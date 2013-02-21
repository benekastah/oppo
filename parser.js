
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
	pattern: /^;+(.*)\n/,
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
	pattern: new RegExp("^@([" + any_word_breaker + "]{,1}|" + any_non_word_breaker + "+)"),
	match: function (m) {
		this.ast.add(new JSWord(m[1]));
	}
});
JLispParser.add_parser({
	pattern: "@",
	match: function (m) {
		this.ast.add(new JSWord(""));
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
