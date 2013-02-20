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


/*****************************************************************************/
/* SymbolTable                                                               */
/*****************************************************************************/

function SymbolTable() {}

// Here is where we will put any symbols that are global (because all 
// SymbolTables will inherit these properties).
SymbolTable.prototype.lambda = new Macro("lambda", function (args) {
	var body = _slice.call(arguments, 1);
	return Macro.lambda(args, body);
});

SymbolTable.defmacro = function (name, fn) {
	SymbolTable.prototype[name] = new Macro(name, fn);
}

SymbolTable.defmacro("defmacro", function (name, args) {
	var body = _slice.call(arguments, 2);
	var macro =  new Macro(name, args, body, this);
	var module = this.module_stack.current();
	module.symbol_table[name.text] = macro;
	return macro;
});

SymbolTable.defmacro("quote", function (item) {
	return new Quoted(item);
});

SymbolTable.defmacro("unquote", function (item) {
	return new Unquoted(item);
});

SymbolTable.defmacro("quasiquote", function (item) {
	return new Quasiquoted(item);
});

SymbolTable.defmacro("add-reader", function (config) {
	config = JLisp.eval(this, config);
	JLispParser.add_parser(config);
	return Ast.Blank;
});

SymbolTable.defmacro("splat", function (arg) {
	return new Splat(arg);
});
;

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
;

Ast.to_keyword = function (symbol, allow_string) {
	var text;
	if (symbol instanceof Symbol) {
		text = symbol.text;
	} else if (allow_string && typeof symbol === "string") {
		text = symbol;
	}

	var index = keywords.indexOf(text);
	if (index >= 0) {
		return text;
	}
}

var CompileQuoted = function () {
	if (!this.compile_quoted_args) {
		if (this instanceof Array) {
			this.compile_quoted_args = function () {
				return this;
			};
		} else {
			this.compile_quoted_args = [];
		}
	}

	this.compile_quoted = function (compiler) {
		var args = this.compile_quoted_args.call ? this.compile_quoted_args() : this.compile_quoted_args;
		args = compiler.compile_each(args);
		return "new JLisp." + this.constructor.name + "(" + args.join(", ") + ")";
	};
};

var ArgsToThis = function () {
	for (var i = 0, len = arguments.length; i < len; i++) {
		this.push(arguments[i]);
	}
};

/****************************************************************************/
/* Symbol                                                                   */
/****************************************************************************/	

this.Symbol = Symbol;

function Symbol(text) {
	if (text instanceof Symbol) {
		this.text = text.text;
	} else {
		this.text = text;
	}
	this.compile_quoted_args = [this.text];
}

CompileQuoted.call(Symbol.prototype);

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


/****************************************************************************/
/* Comment                                                                  */
/****************************************************************************/	

this.Comment = Comment;

function Comment(comment) {
	this.comment = comment;
	this.compile_quoted_args = [this.comment];
	this.has_line_break = this.re_line_break.test(comment);
}

CompileQuoted.call(Comment.prototype);

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


/****************************************************************************/
/* JSWord                                                                   */
/****************************************************************************/	

this.JSWord = JSWord;

function JSWord(text) {
	this.text = text;
	this.compile_quoted_args = [this.text];
}

CompileQuoted.call(JSWord.prototype);

JSWord.prototype.compile = function () {
	return this.text;
};


/****************************************************************************/
/* JSBinOp                                                                  */
/****************************************************************************/	

this.JSBinOp = JSBinOp;

_extend(JSBinOp, JSWord);

function JSBinOp(text) {
	JSWord.call(this, text);
}


/****************************************************************************/
/* JSBlock                                                                  */
/****************************************************************************/	

this.JSBlock = JSBlock;

_extend(JSBlock, Array);

function JSBlock() {
	ArgsToThis.apply(this, arguments);
}

CompileQuoted.call(JSBlock.prototype);

JSBlock.prototype.compile = function (compiler) {
	return "{ " + compiler.compile_each(this).join(";\n") + " }";
};


/****************************************************************************/
/* JSGroup                                                                  */
/****************************************************************************/	

this.JSGroup = JSGroup;

_extend(JSGroup, Array);

function JSGroup() {
	ArgsToThis.apply(this, arguments);
}

CompileQuoted.call(JSGroup.prototype);

JSGroup.prototype.compile = function (compiler) {
	return "( " + compiler.compile_each(this).join(" ") + " )";
};


/****************************************************************************/
/* Macro                                                                    */
/****************************************************************************/	

this.Macro = Macro;

Macro.lambda = function (args, body) {
	var splat;
	var post_splat = [];
	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];
		if (arg instanceof Splat) {
			if (splat) {
				throw new Error("Arguments list can't have more than one Splat");
			}
			splat = arg;
			splat.position = i;
		} else if (splat) {
			var def_arg = [new JSWord("var"), arg, new JSWord("="), [new JSBinOp("-"), new JSWord("arguments.length"), len - i]];
			post_splat.push(def_arg);
		}
	}

	if (splat) {
		args = args.slice(0, splat.position);
	}

	var js_args = new JSGroup();
	js_args.push([new JSBinOp(",")].concat(args));
	
	var js_body = new JSBlock();
	if (splat) {
		var slice_start = splat.position;
		var slice_end;
		if (post_splat.length) {
			slice_end = [new JSBinOp("-"), new JSWord("arguments.length"), post_splat.length];
		}
		
		var slice = [[new JSWord("Array.prototype.slice.call")], new JSWord("arguments")];
		if (slice_start || slice_end) {
			slice.push(slice_start);
		}
		if (slice_end) {
			slice.push(slice_end);
		}
		var def_slice = [new JSWord("var"), arg, new JSWord("="), slice];
		js_body.push(def_slice);

		js_body.push.apply(js_body, post_splat);
	}

	js_body.push.apply(js_body, body);
	var last = js_body.pop();
	var ret = [new JSWord("return"), last];
	js_body.push(ret);

	var fn_ast = new JSGroup();
	fn_ast.push(new JSWord("function"), js_args, js_body);
	return fn_ast;
};

function Macro(name, args, body, compiler) {
	this.name = new Symbol(name);
	if (arguments.length === 2) {
		this.fn = args;
	} else {
		this.args = args;
		this.body = body;
		var fn_ast = Macro.lambda(this.args, this.body);
		this.fn = JLisp.eval(compiler, fn_ast);
	}
}

Macro.prototype.call = function (compiler, args) {
	return this.fn.apply(compiler, args);
};

Macro.prototype.compile = function (compiler) {
	return "new JLisp.Macro(" + compiler.compile_node(this.name.text) + ", " + this.fn + ")";
};


/****************************************************************************/
/* Quoting / unquoting / quasiquoting									    */
/****************************************************************************/	

// Quoted
this.Quoted = Quoted;

function Quoted(item) {
	this.item = item;
	this.compile_quoted_args = [this.item];
}

CompileQuoted.call(Quoted.prototype);

Quoted.prototype.quote_node = function (node) {
	return new Quoted(node);
};

Quoted.prototype.compile = function (compiler) {
	if (this.item && this.item.compile_quoted) {
		return this.item.compile_quoted(compiler);
	} else if (this.item instanceof Array) {
		var c_item = compiler.compile_each(this.item, null, this.quote_node);
		return "[" + c_item.join(", ") + "]";
	} else {
		return compiler.compile_node(this.item);
	}
};


// Unquoted
this.Unquoted = Unquoted;
_extend(Unquoted, Quoted);

function Unquoted(item) {
	Quoted.call(this, item);
}

Unquoted.prototype.compile = function (compiler) {
	return compiler.compile_node(this.item);
};


// Quasiquoted
this.Quasiquoted = Quasiquoted;
_extend(Quasiquoted, Quoted);

function Quasiquoted(item) {
	Quoted.call(this, item);
}

Quasiquoted.prototype.quote_node = function (node) {
	if (node instanceof Unquoted) {
		return node;
	} else {
		return new Quasiquoted(node);
	}
};


/****************************************************************************/
/* Splat                                                                    */
/****************************************************************************/	

this.Splat = Splat;

function Splat(arg) {
	this.arg = arg;
	this.compile_quoted_args = [this.arg];
}

CompileQuoted.call(Splat.prototype);

Splat.prototype.compile = function (compiler) {
	return compiler.compile_node(this.arg);
}


/****************************************************************************/
/* Module                                                                   */
/****************************************************************************/	

this.Module = Module;

_extend(Module, Ast);

Module.private_module_name = "__module__";

function Module(parser) {
	Ast.call(this, parser);
	this.symbol_table = new SymbolTable();
	this.compiled = [];
}

CompileQuoted.call(Module.prototype);

Module.prototype.name = "__anonymous__";

Module.prototype.set_name = function (name) {
	this.named = true;
	this.original_name = name;
	this.name = (name != null ? name : "") + "_module";
	this.name_symbol = new Symbol(this.name);
};

Module.prototype.compile = function (compiler) {
	var compiled;
	if (this.parent) {
		compiled = this.parent.compiled;
		compiled.push.apply(compiled, compiler.compile_each(this));
	} else {
		var name = compiler.compile_node(this.name_symbol);
		compiled = this.compiled;
		
		// Add module variable to beginning of module function.
		compiled.unshift("var " + Module.private_module_name + " = {}"/*, "debugger"*/);

		// At the end of this module, reset the module function to simply return the module that was just built.
		// This prevents the module function from being run multiple times.
		compiled.push(name + " = function () { return " + Module.private_module_name + "; }", "return " + name + "()");
		compiled = compiled.join(";\n");

		return "function " + name + "() {\n" + compiled + ";\n}";
	}
};

Module.prototype.chunk = function () {
	var chunk = Ast.prototype.chunk.call(this);
	if (this.named) {
		chunk.set_name(this.original_name);
	}
	return chunk;
};
;

/****************************************************************************/
/* Parser Definition                                                        */
/****************************************************************************/	

// Word break
var any_word_breaker = "\\s\\(\\)\\{\\}@";
var any_non_word_breaker = "[^" + any_word_breaker + "]"


// Our main parser.
var JLispParser = new Parser({
	ast: Module
});


// Whitespace
JLispParser.add_parser({
	pattern: /^\s+/
});

// Comments
JLispParser.add_parser({
	pattern: /^;+(.*)$/,
	match: function (m) {
		this.ast.add(new Comment(m[1]));
	}
});

// Javascript compatability
JLispParser.add_parser({
	pattern: "@(",
	match: function () {
		this.ast.add_active_node(new JSGroup());
		this.balance("JSGroup", 1);
	}
});
JLispParser.add_parser({
	pattern: "@{",
	match: function () {
		this.ast.add_active_node(new JSBlock());
		this.balance("JSBlock", 1);
	}
});
JLispParser.add_parser({
	pattern: new RegExp("^@([" + any_word_breaker + "]|" + any_non_word_breaker + "+)"),
	match: function (m) {
		this.ast.add(new JSWord(m[1]));
	}
});
JLispParser.add_parser({
	pattern: "}",
	match: function () {
		var node = this.ast.pop_active_node();
		this.ast.assert_type(node, JSBlock);
		this.balance(node.constructor.name, -1);
	}
});
JLispParser.add_parser({
	pattern: /^<(.+)>/,
	match: function (m) {
		this.ast.add(new JSBinOp(m[1]));
	}
});


// Lists
JLispParser.add_parser({
	pattern: "(",
	match: function () {
		this.ast.add_active_node([]);
		this.balance("Array", 1);
	}
});
JLispParser.add_parser({
	pattern: ")",
	match: function () {
		var node = this.ast.pop_active_node();
		this.ast.assert_type(node, Array, JSGroup);
		this.balance(node.constructor.name, -1);
	}
});


// Numbers
JLispParser.add_parser({
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
JLispParser.add_parser({
	pattern: "\"",
	states: [Parser.DEFAULT_STATE, "string"],
	match: function () {
		if (this.get_state() !== "string") {
			this.set_state("string");
			this.ast.set_active_node("");
			this.balance("string", 1);
		} else {
			var s = this.ast.pop_active_node();
			this.ast.assert_type(s, "string");
			this.ast.add(s);
			this.pop_state();
			this.balance("string", -1);
		}
	}
});
JLispParser.add_parser({
	pattern: /^\\./,
	states: ["string"],
	match: get_string_contents
});
JLispParser.add_parser({
	pattern: /^[^"]*/,
	states: ["string"],
	match: get_string_contents
});

// Symbols can start with *anything*, as long as it doesn't conflict with something above.
JLispParser.catch_all_parser({
	pattern: new RegExp("^" + any_non_word_breaker + "+"),
	match: function (m) {
		this.ast.add(new Symbol(m[0]));
	}
});


// Main parser function
var read = function (code, module_name, compile_chunk) {
	var module = JLispParser.parse(code, compile_chunk);
	return module;
};
this.read = read;
;

/****************************************************************************/
/* ModuleStack                                                              */
/****************************************************************************/	

_extend(ModuleStack, Array);

function ModuleStack() {}

ModuleStack.prototype.current = function () {
	return this[this.length - 1];
};


/****************************************************************************/
/* Compiler                                                                 */
/****************************************************************************/	

function Compiler(sources, cb) {
	this.modules = {};
	this.module_stack = new ModuleStack();

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

Compiler.prototype.process_macros = function (node) {
	var module = this.module_stack.current(),
		macro;
	if (node instanceof Array) {
		for (var i = 0, len = node.length; i < len; i++) {
			var item = node[i];
			if (i === 0 && item.constructor === Symbol) {
				macro = module.symbol_table[item.text];
			} else {
				node[i] = this.process_macros(item);
			}
		}

		if (macro) {
			node = macro.call(this, node.slice(1));
			node = this.process_macros(node);
		}
	}
	
	return node;
};

Compiler.prototype.remove_blanks = function (node) {
	if (node instanceof Array) {
		var i = 0,
			len = node.length;
		while (i < len) {
			var item = node[i];
			if (item === Ast.Blank) {
				node.splice(i, 1);
			} else {
				i += 1;
			}
		}
	} else if (node === Ast.Blank) {
		node = undefined;
	}
	return node;
};

Compiler.prototype.compile_node = function (node) {
	if (node && node.compile) {
		return node.compile(this);
	} else if (node instanceof Array || _toString.call(node) === "[object Array]") {
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
	var keyword;
	
	if (first instanceof JSBinOp) {
		return this.compile_each(arr, 1).join(" " + this.compile_node(first) + " ");
	} else if (first instanceof JSWord) {
		// Don't assume a list beginning with a JSWord should be a function call.
		return this.compile_each(arr).join(" ");
	} else {
		var args = this.compile_each(arr, 1);
		return "" + this.compile_node(first) + "(" + args.join(", ") + ")";
	}
};

Compiler.prototype.compile_each = function (nodes, i, process_node) {
	var results = [],
		len;
	for (i = (i || 0), len = nodes.length; i < len; i++) {
		var node = nodes[i];
		if (process_node) {
			node = process_node(node);
		}
		results.push(this.compile_node(node));
	}
	return results;
};


Compiler.prototype.re_extension = /\.(lisp|jlisp|ls)$/;

Compiler.prototype.compile = function (source, cb) {
	cb.__calls = (cb.__calls || 0) + 1;
	cb.__errors = cb.__errors || [];
	cb.__results = cb.__results || [];
	
	var module_name, error, main_ast,
		result = [],
		callbacks = [cb],

		get_ast = function (err, code) {
			if (!err) {
				var ast;
				if (typeof code === "string") {
					ast = read(code, module_name, get_result);
				} else {
					ast = code;
				}
			} else {
				error = err;
			}
			done();
		},

		get_result = function (ast) {
			if (ast instanceof Module) {
				if (!main_ast) {
					main_ast = ast.parent || ast;
					main_ast.set_name(module_name);
					this.modules[main_ast.name] = main_ast;
					this.module_stack.push(main_ast);
				}
			}

			ast = this.process_macros(ast);
			ast = this.remove_blanks(ast);
			this.compile_node(ast);
		}.bind(this),

		done = function () {
			var cbs = arguments.length ? arguments : callbacks;
			result = main_ast.compile(this);
			console.log(result);

			for (var i = 0, len = cbs.length; i < len; i++) {
				var cb = cbs[i];
				cb.__calls -= 1;
				cb.__results.push(result);

				if (cb.__calls === 0) {
					cb(cb.__errors, cb.__results);
				}
			}
		}.bind(this);

	if (source && source.nodeType) {
		module_name = source.getAttribute("data-module-name");
		get_ast(null, source.innerHTML);
	} else if (typeof source === "string") {
		var fs = require('fs');
		module_name = source.replace(this.re_extension, '');
		code = fs.readFile(source, "utf8", get_ast);
	} else {
		get_ast(null, source);
	}
};
;

this.eval = function (compiler, ast) {
	var result;
	if (arguments.length === 1) {
		new Compiler([ast], function (err, code) {
			result = eval(code);
		});
	} else {
		var js = compiler.compile_node(ast);
		result = eval(js);
	}
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
;
}).call( typeof exports !== 'undefined' ? exports : window.JLisp || (window.JLisp = {}) );
