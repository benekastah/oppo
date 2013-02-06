(function () {

	var Parjs;
	if (typeof require === "function") {
		Parjs = require('./par.js');
	} else {
		Parjs = window.Parjs;
	}

	var Parser = Parjs.Parser;
	var ParseError = Parjs.ParseError;
	var AstError = Parjs.AstError;
	var _extend = Parjs._extend;
	
	var _assert;
	if (typeof assert !== "function") {
		_extend(AssertError, Error);
		function AssertError() {}
		AssertError.prototype.message = "Assertion failed";

		_assert = function (item) {
			if (!item) {
				throw new AssertError();
			}
		};
	} else {
		_assert = assert;
	}


	function Symbol(m) {
		this.match = m;
		this.text = m.match;
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

	_extend(JSObject, Array)
	function JSObject() {}
	JSObject.prototype.compile = function () {
		throw "JSObject's compile method not implemented";
	};

	_extend(JSWord, Symbol);
	function JSWord(m) {
		Symbol.call(this, m);
		this.text = this.text.substr(1);
	}
	JSWord.prototype.compile = function () {
		return this.text;
	};

	_extend(JSBlock, Array);
	function JSBlock() {}
	JSBlock.prototype.compile = function () {
		return "{ " + compile_each(this).join(";\n") + " }";
	};

	_extend(JSGroup, Array);
	function JSGroup() {}
	JSGroup.prototype.compile = function () {
		return "( " + compile_each(this).join(" ") + " )";
	};


	// Word break
	var any_non_word_breaker = "[^\\s\\(\\)\\{\\}]"


	// Our main parser.
	var JLisp = new Parser({
		ast: true
	});


	// Whitespace
	var whitespace = JLisp.add_parser({
		pattern: /^\s+/
	});

	// Javascript compatability
	var js_word = JLisp.add_parser({
		pattern: new RegExp("^@" + any_non_word_breaker + "+"),
		match: function (m) {
			this.ast.add(new JSWord(m));
		}
	});
	var js_oparen = JLisp.add_parser({
		pattern: "@(",
		match: function () {
			this.ast.add_active_node(new JSGroup());
		}
	});
	var js_oblock = JLisp.add_parser({
		pattern: "@{",
		match: function () {
			this.ast.add_active_node(new JSBlock());
		}
	});


	// Lists
	var oparen = JLisp.add_parser({
		pattern: "(",
		match: function () {
			this.ast.add_active_node([]);
		}
	});
	var cparen = JLisp.add_parser({
		pattern: ")",
		match: function () {
			var node = this.ast.pop_active_node();
			_assert(node instanceof Array || node instanceof JSGroup);
		}
	});


	// Numbers
	var number = JLisp.add_parser({
		pattern: /^\-?\d+(\.\d+)?/,
		match: function (m) {
			this.ast.add(+m.match);
		}
	});

	// Strings
	var get_string_contents = function (m) {
		var s = this.ast.pop_active_node();
		s += m.match;
		this.ast.set_active_node(s);
	};
	var string_delimiter = JLisp.add_parser({
		pattern: "\"",
		states: [Parser.DEFAULT_STATE, "string"],
		match: function () {
			if (this.get_state() !== "string") {
				this.set_state("string");
				this.ast.set_active_node("");
			} else {
				var s = this.ast.pop_active_node();
				_assert(typeof s === "string");
				this.ast.add(s);
				this.pop_state();
			}
		}
	});
	var string_escaped_char = JLisp.add_parser({
		pattern: /^\\./,
		states: ["string"],
		match: get_string_contents
	});
	var string_contents = JLisp.add_parser({
		pattern: /^[^"]*/,
		states: ["string"],
		match: get_string_contents
	});


	// Javascript object literals
	var oobject = JLisp.add_parser({
		pattern: "{",
		match: function () {
			this.ast.add_active_node(new JSObject());
		}
	});
	var cobject = JLisp.add_parser({
		pattern: "}",
		match: function () {
			var node = this.ast.pop_active_node();
			_assert(node instanceof JSObject || node instanceof JSBlock);
		}
	});


	// Symbols can start with *anything*, as long as it doesn't conflict with something above.
	var symbol = JLisp.add_parser({
		pattern: new RegExp("^" + any_non_word_breaker + "+"),
		match: function (m) {
			this.ast.add(new Symbol(m));
		}
	});


	// Main parser function
	var parse = this.parse = function (code) {
		JLisp.parse(code);
		return JLisp.ast;
	};

	var compile_node = this.compile_node = function (node) {
		if (node instanceof Parjs.Ast) {
			return compile_each(node).join(";\n");
		} else if (Object.prototype.toString.call(node) === "[object Array]") {
			// Only function calls for now.
			return compile_call(node);
		} else if (typeof node === "string") {
			return '"' + node + '"';
		} else if (node == null) {
			return '' + node;
		} else if (node.compile) {
			return node.compile();
		} else if (node.toString) {
			return node.toString();
		} else {
			return '' + node;
		}
	};

	var compile_call = function (call) {
		var fn = call[0];
		if (fn instanceof JSWord) {
			// Don't assume a list beginning with a JSWord should be a function call.
			return compile_each(call).join(" ");
		} else {
			var args = compile_each(call, 1);
			return "" + compile_node(fn) + "(" + args.join(", ") + ")";
		}
	};

	var compile_each = function (nodes, i) {
		var results = [],
			len;
		for (i = (i || 0), len = nodes.length; i < len; i++) {
			results.push(compile_node(nodes[i]));
		}
		return results;
	};

	var compile = this.compile = function (code) {
		var ast = parse(code);
		return compile_node(ast);
	};


	function get_scripts() {
		if (typeof document !== "undefined") {
			var scripts = document.getElementsByTagName("script");
			for (var script_idx = 0, scripts_len = scripts.length; script_idx < scripts_len; script_idx++) {
				var script = scripts[script_idx];
				if (script.type === "text/lisp") {
					var code = script.innerHTML;
					var compiled = compile(code);
					console.log(compiled);
				}
			}
		} else if (typeof process !== "undefined") {
			var fs = require('fs');
			var scripts = Array.prototype.slice.call(process.argv, 2);
			for (var idx = 0, len = scripts.length; idx < len; idx++) {
				var script = scripts[idx];
				var code = fs.readFileSync(script, 'utf8');
				var compiled = compile(code);
				console.log(compiled);
			}
		}
	}
	get_scripts();

}).call(typeof exports !== "undefined" ? exports : (window.JLisp = {}));
