
var _clone = Object.create || function (o) {
	var Noop = function () {};
	Noop.prototype = o;
	return new Noop();
};

var _toString = Object.prototype.toString;
var _slice = Array.prototype.slice;

var _extend = function (child, parent) {
	child.prototype = _clone(parent.prototype);
	child.prototype.constructor = child;
};
this._extend = _extend;


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

function Ast(parser) {
	this.parser = parser;
	this.active_nodes = [this];
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


/****************************************************************************/
/* Parser                                                                   */
/****************************************************************************/	

this.Parser = Parser;

Parser.DEFAULT_STATE = "default";

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
}

Parser.prototype.add_parser = function (config) {
	var p = new Parser(config);
	this.parsers.push(p);
	p.parent = this;
	return p;
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
			this.process_match(re_match || [match], main_parser);
		}
	}

	return match;
};

Parser.prototype.set_state = function (state) {
	var ctx = this.parent || this;
	ctx.states.push(state);
	if (ctx.accepted_states.indexOf(state) < 0) {
		ctx.accepted_states.push(state);
	}
};

Parser.prototype.get_state = function () {
	var ctx = this.parent || this;
	return ctx.states[ctx.states.length - 1] || Parser.DEFAULT_STATE;
};

Parser.prototype.pop_state = function () {
	return (this.parent || this).states.pop() || Parser.DEFAULT_STATE;
};

var re_newlines = /\r?\n/g;
Parser.prototype.parse = function (code) {
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
		}
	}

	return this.ast;
}
