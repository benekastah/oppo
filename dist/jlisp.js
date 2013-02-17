(function () {
var self = this;

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

this.Symbol = Symbol;
function Symbol(text) {
	this.text = text;
}
Symbol.prototype.re_invalid = /[^\w\.]/g;
Symbol.prototype.compile = function () {
	return "$" + this.text.replace(this.re_invalid, function (chr) {
		var code = chr.charCodeAt(0).toString(16);
		while (code.length < 4) {
			code = "0" + code;
		}
		return "_u" + code + "_";
	});
};
Symbol.from_json = function (obj) {
	return new Symbol(obj.text);
};


this.Comment = Comment;
function Comment(comment) {
	this.comment = comment;
	this.has_line_break = this.re_line_break.test(comment);
}
Comment.prototype.re_line_break = /\n/;
Comment.prototype.compile = function () {
	if (this.has_line_break) {
		return "/* " + this.comment + " */";
	} else {
		return "// " + this.comment;
	}
};
Comment.from_json = function (obj) {
	return new Comment(obj.comment);
};


this.JSWord = JSWord;
_extend(JSWord, Symbol);
function JSWord(text) {
	Symbol.call(this, text);
}
JSWord.prototype.compile = function () {
	return this.text;
};


this.JSBinOp = JSBinOp;
_extend(JSBinOp, JSWord);
function JSBinOp(text) {
	JSWord.call(this, text);
}


this.JSBlock = JSBlock;
_extend(JSBlock, Array);
function JSBlock() {}
JSBlock.prototype.compile = function (compiler) {
	return "{ " + compiler.compile_each(this).join(";\n") + " }";
};


this.JSGroup = JSGroup;
_extend(JSGroup, Array);
function JSGroup() {}
JSGroup.prototype.compile = function (compiler) {
	return "( " + compiler.compile_each(this).join(" ") + " )";
};


// Word break
var any_non_word_breaker = "[^\\s\\(\\)\\{\\}@]"


// Our main parser.
var JLisp = new Parser({
	ast: Module
});


// Whitespace
JLisp.add_parser({
	pattern: /^\s+/
});

// Comments
JLisp.add_parser({
	pattern: /^;+(.*)$/,
	match: function (m) {
		this.ast.add(new Comment(m[1]));
	}
});

// Javascript compatability
JLisp.add_parser({
	pattern: new RegExp("^@(" + any_non_word_breaker + "+)"),
	match: function (m) {
		this.ast.add(new JSWord(m[1]));
	}
});
JLisp.add_parser({
	pattern: "@(",
	match: function () {
		this.ast.add_active_node(new JSGroup());
	}
});
JLisp.add_parser({
	pattern: "@{",
	match: function () {
		this.ast.add_active_node(new JSBlock());
	}
});
JLisp.add_parser({
	pattern: "}",
	match: function () {
		var node = this.ast.pop_active_node();
		this.ast.assert_type(node, JSBlock);
	}
});
JLisp.add_parser({
	pattern: /^<(.+)>/,
	match: function (m) {
		this.ast.add(new JSBinOp(m[1]));
	}
});


// Lists
JLisp.add_parser({
	pattern: "(",
	match: function () {
		this.ast.add_active_node([]);
	}
});
JLisp.add_parser({
	pattern: ")",
	match: function () {
		var node = this.ast.pop_active_node();
		this.ast.assert_type(node, Array, JSGroup);
	}
});


// Numbers
JLisp.add_parser({
	pattern: /^\-?\d+(\.\d+)?/,
	match: function (m) {
		this.ast.add(+m[0]);
	}
});

// Strings
function get_string_contents(m) {
	var s = this.ast.pop_active_node();
	s += m[0];
	this.ast.set_active_node(s);
};
JLisp.add_parser({
	pattern: "\"",
	states: [Parser.DEFAULT_STATE, "string"],
	match: function () {
		if (this.get_state() !== "string") {
			this.set_state("string");
			this.ast.set_active_node("");
		} else {
			var s = this.ast.pop_active_node();
			this.ast.assert_type(s, "string");
			this.ast.add(s);
			this.pop_state();
		}
	}
});
JLisp.add_parser({
	pattern: /^\\./,
	states: ["string"],
	match: get_string_contents
});
JLisp.add_parser({
	pattern: /^[^"]*/,
	states: ["string"],
	match: get_string_contents
});


// Symbols can start with *anything*, as long as it doesn't conflict with something above.
JLisp.add_parser({
	pattern: new RegExp("^" + any_non_word_breaker + "+"),
	match: function (m) {
		this.ast.add(new Symbol(m[0]));
	}
});


// Main parser function
var read = function (code, module_name) {
	var module = JLisp.parse(code);
	module.set_name(module_name || module.name);
	return module;
};
this.read = read;

// _extend(Stack, Array);
// function Stack() {}
// Stack.prototype.current = function () {
// 	return this[this.length - 1];
// };
// 
// 
// _extend(ContextStack, Stack);
// function ContextStack() {}
// 
// 
// function Context() {}
// 
// 
// _extend(ModuleStack, Stack);
// function ModuleStack() {}
// ModuleStack.prototype.push = function (x) {
// 	if (!(x instanceof Module)) {
// 		throw "Can't add non-Module to ModuleStack";
// 	}
// 	ModuleStack.prototype.push.call(this, x);
// };


_extend(Module, Ast);
Module.private_module_name = "__module__";
function Module(parser) {
	Ast.call(this, parser);
	this.symbol_table = {};
}
Module.prototype.name = "main";
Module.prototype.set_name = function (name) {
	this.name = (name != null ? name : "") + "_module";
	this.name_symbol = new Symbol(this.name);
};
Module.prototype.compile = function (compiler) {
	compiler.modules[this.name] = this;
	var name = compiler.compile_node(this.name_symbol);
	var compiled = compiler.compile_each(this);
	
	// Add module variable to beginning of module function.
	compiled.unshift("var " + Module.private_module_name + " = {}");

	// At the end of this module, reset the module function to simply return the module that was just built.
	// This prevents the module function from being run multiple times.
	compiled.push(name + " = function () { return " + Module.private_module_name + "; }", "return " + name + "()");
	compiled = compiled.join(";\n");

	return "function " + name + "() {\n" + compiled + ";\n}";
};


function Compiler(sources, cb) {
	this.modules = {};

	var done = function (errors, results) {
		if (errors && errors.length) {
			console.error.apply(console, errors);
		}

		var result;
		if (results) {
			results.push("if (typeof " + Compiler.main_module_name + " !== 'undefined') { " + Compiler.main_module_name + "(); }");
			result = results.join("\n\n");
		}

		cb(errors && errors[0], result);
	};

	for (var i = 0, len = sources.length; i < len; i++) {
		this.compile(sources[i], done);
	}
	
	if (!len) {
		done();
	}
}
Compiler.main_module_name = new Symbol("__main___module").compile(null);

Compiler.prototype.compile_node = function (node) {
	if (node.compile) {
		return node.compile(this);
	} else if (node instanceof Array || Object.prototype.toString.call(node) === "[object Array]") {
		return this.compile_array(node);
	} else if (typeof node === "string") {
		return '"' + node + '"';
	} else if (node == null) {
		return '' + node;
	} else if (node.toString) {
		return node.toString();
	} else {
		return '' + node;
	}
};

Compiler.prototype.compile_array = function (arr) {
	var first = arr[0];
	if (first instanceof JSBinOp) {
		return this.compile_each(arr, 1).join(" " + this.compile_node(first) + " ");
	} else if (first instanceof JSWord) {
		// Don't assume a list beginning with a JSWord should be a function call.
		return this.compile_each(arr).join(" ");
	//} else if (this.modules) {
	} else {
		var args = this.compile_each(arr, 1);
		return "" + this.compile_node(first) + "(" + args.join(", ") + ")";
	}
};

Compiler.prototype.compile_each = function (nodes, i) {
	var results = [],
		len;
	for (i = (i || 0), len = nodes.length; i < len; i++) {
		results.push(this.compile_node(nodes[i]));
	}
	return results;
};


Compiler.prototype.re_extension = /\.(lisp|jlisp|ls)$/;
Compiler.prototype.compile = function (source, cb) {
	cb.__calls = (cb.__calls || 0) + 1;
	cb.__errors = cb.__errors || [];
	cb.__results = cb.__results || [];
	
	var module_name, error, result,
		callbacks = [cb],

		get_result = function (err, code) {
			if (!err) {
				var ast;
				if (code instanceof Ast) {
					ast = code;
				} else {
					ast = read(code, module_name);
				}
				result = this.compile_node(ast);
			} else {
				error = err;
			}
			done();
		}.bind(this),

		done = function () {
			var cbs = arguments.length ? arguments : callbacks;
			for (var i = 0, len = cbs.length; i < len; i++) {
				var cb = cbs[i];
				cb.__calls -= 1;
				cb.__results.push(result);

				if (cb.__calls === 0) {
					cb(cb.__errors, cb.__results);
				}
			}
		};

	if (source.nodeType) {
		module_name = source.getAttribute("data-module-name");
		get_result(null, source.innerHTML);
	} else if (typeof source === "string" && typeof require !== "undefined") {
		var fs = require('fs');
		module_name = source.replace(this.re_extension, '');
		code = fs.readFile(source, "utf8", get_result);
	} else {
		get_result(err, source);
	}
};

var _clone = Object.create || function (o) {
	function Noop() {}
	Noop.prototype = o;
	return new Noop();
};

this.eval = function (ast) {
	var result;
	new Compiler(ast, function (err, code) {
		result = eval(code);
	});
	return result;
};


var type_key = "__type__";
var json_replacer = function (key, value) {
	if (value && typeof value === "object") {
		var type = value.constructor && value.constructor.name;
		if (type && typeof type === "string") {
			value = _clone(value);
			value[type_key] = type;
		}
	}
	return value;
};

var json_reviver = function (key, value) {
	var type = value[type_key];
	if (type && typeof type === "string") {
		var Class = self[type];
		if (Class && Class.from_json) {
			return Class.from_json(value);
		}
	}
	return value;
};

var json_parse = function (json) {
	return JSON.parse(json, json_reviver);
};
this.json_parse = json_parse;

var json_stringify = function (obj) {
	return JSON.stringify(obj, json_replacer, '\t');
};
this.json_stringify = json_stringify;


function get_scripts() {
	var outfile;

	var jlisp_scripts = [];
	if (typeof document !== "undefined") {
		var scripts = document.getElementsByTagName("script");
		var jlisp_scripts = [];
		for (var script_idx = 0, scripts_len = scripts.length; script_idx < scripts_len; script_idx++) {
			var script = scripts[script_idx];
			if (script.type === "text/lisp") {
				jlisp_scripts.push(script);
			}
		}
	} else if (typeof process !== "undefined") {
		var fs = require('fs');
		var jlisp_scripts = process.argv.slice(2);
		outfile = jlisp_scripts[0] + ".js";
	}

	var compiler = new Compiler(jlisp_scripts, function (err, code) {
		if (outfile) {
			var fs = require('fs');
			fs.writeFile(outfile, code, 'utf8', function (err) {
				if (!err) {
					console.log("Wrote " + outfile);
				} else {
					console.error(err);
				}
			});
		} else {
			eval(code);
		}
	});
}

get_scripts.call(this);
}).call( typeof exports !== 'undefined' ? exports : window.JLisp || (window.JLisp = {}) );
