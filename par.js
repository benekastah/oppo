(function () {

	var _clone = Object.create || function (o) {
		var Noop = function () {};
		Noop.prototype = o;
		return new Noop();
	};

	var _toString = Object.prototype.toString;

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

	function ParseError(code, lines) {
		Parser.states = [];

		var lineno = lines.length - 1;
		var column = lines[lineno];
		this.message = "Can't parse at line " + (lineno + 1) + ", column " + (column + 1) + ":";

		var code_lines = code.split("\n");
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

	function AstError(code, lines, expected, got) {
		ParseError.call(this, code, lines);
		this.message += "\n\nInvalid ast structure: Expected " + expected + " and got " + ((got.constructor && got.constructor.name) || Object.prototype.toString.call(got));
	}


	/****************************************************************************/
	/* Ast                                                                      */
	/****************************************************************************/

	this.Ast = Ast;
	_extend(Ast, Array);

	function Ast() {
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

		this.uses_ast = config.ast;
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

	Parser.prototype.match = function (code, code_index, lines, column) {
		var state = this.get_state(),
			match,
			ret,
			_code;

		if (this.accepted_states.indexOf(state) >= 0) {
			_code = code.substr(code_index);

			if (this.string) {
				match = _code.substr(0, this.string.length);
				if (match !== this.string) {
					match = null;
				}
			} else if (this.regexp) {
				match = (_code.match(this.regexp) || [])[0];
			}

			if (!match && this.parsers.length) {
				for (var i = 0, len = this.parsers.length; i < len; i++) {
					var p = this.parsers[i];
					p.ast = this.ast;
					ret = p.match(code, code_index);
					if (ret.match) {
						return ret;
					}
				}
			}
		}

		ret = {
			parser: this
		};

		if (match) {
			ret.match = match;
			ret.code_index = code_index + match.length;
			ret.column = column;

			if (this.process_match) {
				var processed = this.process_match(ret, code, lines);
				if (processed != null) {
					ret = processed;
				}
			}
		} else {
			ret.code_index = code_index;
		}

		return ret;
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
		var ret = { code_index: 0 };
		var lines = [];
		var column = 0;

		if (this.uses_ast) {
			this.ast = new Ast();
		}
		
		while (ret.code_index < code.length) {
			ret = this.match(code, ret.code_index, lines, column);

			if (!ret.match) {
				lines.push(column);
				throw new ParseError(code, lines);
			} else {
				// Get column and line information.
				var m = ret.match.replace(re_newlines, "\n");
				var len = m.length;
				for (var i = 0; i < len; i++) {
					var chr = m.charAt(i);
					if (chr === "\t") {
						column += this.tab_width;
					} else {
						column += 1;
					}

					if (chr === "\n") {
						lines.push(column);
						column = 0;
					}
				}
			}
		}

		return ret;
	}

}).call(typeof exports !== "undefined" ? exports : (window.Parjs = {}));
