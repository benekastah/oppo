
/****************************************************************************/
/* ParseError                                                               */
/****************************************************************************/

this.ParseError = ParseError;
_extend(ParseError, Error);

function ParseError(parser) {
	var lineno = parser.lines.length - 1;
	var column = parser.lines[lineno];
	this.message = "Can't parse at line " + (lineno + 1) + ", column " + (column + 1) + ":";

	var code_lines = parser.code.split("\n");
	var prevline = code_lines[lineno - 1];
	var line = code_lines[lineno];
	var pointer_line = Array(column + 1).join(" ") + "^";
	var nextline = code_lines[lineno + 1];

	var display_lines = [];
	if (prevline != null) {
		display_lines.push(prevline);
	}
	display_lines.push(line, pointer_line);
	if (nextline != null) {
		display_lines.push(nextline);
	}

	this.message += "\n\t" + display_lines.join("\n\t");
}


/****************************************************************************/
/* AstError                                                                 */
/****************************************************************************/

this.AstError = AstError;
_extend(AstError, ParseError);

function AstError(parser, message) {
	ParseError.call(this, parser);
	this.message += "\n\n" + message;
}


/****************************************************************************/
/* Ast                                                                      */
/****************************************************************************/

this.Ast = Ast;
_extend(Ast, Array);

Ast.Blank = {};

function Ast(parser) {
	this.parser = parser;
	this.active_nodes = [this];
	this.compile_index = 0;
}

Ast.prototype.get_active_node = function (pop) {
	return this.active_nodes[this.active_nodes.length - 1];
};

Ast.prototype.set_active_node = function (node) {
	this.active_nodes.push(node);
};

Ast.prototype.pop_active_node = function () {
	return this.active_nodes.pop();
};

Ast.prototype.add_active_node = function (node) {
	this.add(node);
	this.set_active_node(node);
};

Ast.prototype.add = function (node) {
	this.get_active_node().push(node);
};

Ast.prototype.assert_type = function (node) {
	var types = _slice.call(arguments, 1);
	var s_types = [];
	var result = false;
	for (var i = 0, len = types.length; i < len; i++) {
		var type = types[i];
		result = typeof node === type || node.constructor === type;
		if (result) {
			break;
		}
		s_types.push(type.name || type);
	}
	
	if (!result) {
		var last = s_types.pop();
		var type_list = s_types.join(', ');
		if (type_list) {
			type_list += " or " + last;
		} else {
			type_list = last;
		}
		throw new AstError(this.parser, "Expected " + type_list + ", got " + (node && node.constructor.name) + " instead");
	}
};

Ast.prototype.chunk = function () {
	var chunk_array = this.slice(this.compile_index);
	this.compile_index = this.length;
	var chunk = new this.constructor(this.parser);
	chunk.push.apply(chunk, chunk_array);
	chunk.parent = this;
	return chunk;
};

/****************************************************************************/
/* Parser                                                                   */
/****************************************************************************/	

this.Parser = Parser;

Parser.DEFAULT_STATE = "default";

Parser.call_with_parent = function (name, fn) {
	Parser.prototype[name] = function () {
		var parent = this.parent || this;
		return fn.apply(parent, arguments);
	};
};

function Parser(config) {
	if (!config) {
		config = {};
	}

	var pattern = config.pattern;
	if (typeof pattern === "string") {
		this.string = pattern;
	} else if (_toString.call(pattern) === "[object RegExp]") {
		if (pattern.source.charAt(0) !== "^") {
			throw new Error("Can't use regexp that doesn't begin with '^' because we must always parse from the beginning of the string.");
		}
		this.regexp = pattern;
	}

	this.ast_class = config.ast;
	if (this.ast_calss && _toString.call(this.ast_class) !== "[object Function]") {
		this.ast_class = Ast;
	}
	this.accepted_states = config.states || [Parser.DEFAULT_STATE];
	this.process_match = config.match;
	this.tab_width = config.tab_width || 4;
	this.parsers = [];
	this.states = [];
	this.balance_table = {};
}

Parser.prototype.add_parser = function (config) {
	var catch_all;
	if (this.has_catch_all_parser) {
		catch_all = this.parsers.pop();
	}
	
	if (config.catch_all) {
		if (this.has_catch_all_parser) {
			throw new Error("Can't have more than one catch-all parser");
		}
		this.has_catch_all_parser = true;
	}

	var p = new Parser(config);
	this.parsers.push(p);
	p.parent = this;

	if (catch_all) {
		this.parsers.push(catch_all);
	}

	return p;
};

Parser.prototype.catch_all_parser = function (config) {
	config.catch_all = true;
	this.add_parser(config);
};

Parser.prototype.match = function (main_parser) {
	var state = this.get_state(),
		re_match,
		match,
		code;

	if (this.accepted_states.indexOf(state) >= 0) {
		code = main_parser.code.substr(main_parser.code_index);

		if (this.string) {
			match = code.substr(0, this.string.length);
			if (match !== this.string) {
				match = null;
			}
		} else if (this.regexp) {
			re_match = code.match(this.regexp) || []
			match = re_match[0];
		}

		if (!match && this.parsers.length) {
			for (var i = 0, len = this.parsers.length; i < len; i++) {
				var p = this.parsers[i];
				p.ast = this.ast;
				match = p.match(main_parser);
				if (match) {
					return match;
				}
			}
		}
	}

	if (match) {
		if (this.process_match) {
			var ast_len = this.ast.length;
			var to_ast = this.process_match(re_match || [match], main_parser);
			if (typeof to_ast !== "undefined" && this.ast.length === ast_len) {
				this.ast.add(to_ast);
			}
		}
	}

	return match;
};

Parser.call_with_parent("set_state", function (state) {
	this.states.push(state);
	if (this.accepted_states.indexOf(state) < 0) {
		this.accepted_states.push(state);
	}
});

Parser.call_with_parent("get_state", function () {
	return this.states[this.states.length - 1] || Parser.DEFAULT_STATE;
});

Parser.call_with_parent("pop_state", function () {
	return this.states.pop() || Parser.DEFAULT_STATE;
});

Parser.call_with_parent("balance", function (name, change) {
	if (this.balance_table[name] == null) {
		this.balance_table[name] = change;
	} else {
		this.balance_table[name] += change;
	}
});

Parser.call_with_parent("is_balanced", function (name) {
	if (name) {
		return !this.balance_table[name];
	} else {
		for (name in this.balance_table) {
			var result = this.is_balanced(name);
			if (!result) {
				return result;
			}
		}
		return true;
	}
});

var re_newlines = /\r?\n/g;
Parser.prototype.parse = function (code, compile_chunk) {
	var match;
	this.code = code;
	this.code_index = 0;
	this.lines = [];
	this.column = 0;

	if (this.ast_class) {
		this.ast = new this.ast_class(this);
	}
	
	while (this.code_index < code.length) {
		match = this.match(this);

		if (!match) {
			this.lines.push(this.column);
			throw new ParseError(this);
		} else {
			// Get new code_index.
			this.code_index += match.length;
			// Get column and line information.
			var m = match.replace(re_newlines, "\n");
			var len = m.length;
			for (var i = 0; i < len; i++) {
				var chr = m.charAt(i);
				if (chr === "\t") {
					this.column += this.tab_width;
				} else {
					this.column += 1;
				}

				if (chr === "\n") {
					this.lines.push(this.column);
					this.column = 0;
				}
			}

			if (this.is_balanced() && compile_chunk) {
				var chunk = this.ast.chunk();
				if (chunk.length) {
					compile_chunk(chunk);
				}
			}
		}
	}

	return this.ast;
}
