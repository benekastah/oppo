
/****************************************************************************/
/* Parser Definition                                                        */
/****************************************************************************/	

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

// Keywords
JLisp.add_parser({
	pattern: "defmacro",
	match: function (m) {
		var active_node = this.ast.get_active_node();
		if (!active_node.length) {
			active_node.is_macro = true;
		}
		this.ast.add(new Symbol(m[0]));
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
