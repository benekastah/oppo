
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
		return "/* " + this.comment + " */\n";
	} else {
		return "// " + this.comment + "\n";
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
	// Find splats
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
			var def_arg = [new JSWord("var"), arg, new JSWord("="), 
							[new JSWord("arguments"),
								new JSWord("["), 
								[new JSBinOp("-"), new JSWord("arguments.length"), len - i],
								new JSWord("]")]];
			post_splat.push(def_arg);
		}
	}

	if (splat) {
		args = args.slice(0, splat.position);
	}

	var js_args = new JSGroup();
	js_args.push([new JSBinOp(",")].concat(args));
	
	var js_body = new JSBlock();

	// Figure out splats
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
		var def_slice = [new JSWord("var"), splat, new JSWord("="), slice];
		js_body.push(def_slice);

		js_body.push.apply(js_body, post_splat);
	}

	js_body.push.apply(js_body, body);

	// Return last item.
	var last,
		lasts = [];
	while (js_body.length && (last = js_body.pop())) {
		// Don't return a Comment
		if (!(last instanceof Comment)) {
			last = [new JSWord("return"), last];
			lasts.unshift(last);
			break;
		} else {
			lasts.unshift(last);
		}
	}
	// Add everything back to js_body
	js_body.push.apply(js_body, lasts);

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
/* Quoting / unquoting / unquote-splicing / quasiquoting					*/
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

Quoted.prototype.compile = function (compiler, quasiquoted) {
	if (this.item && this.item.compile_quoted) {
		return this.item.compile_quoted(compiler);
	} else if (this.item instanceof Array) {
		var c_item = compiler.compile_each(this.item, null, this.quote_node);
		return "[" + c_item.join(", ") + "]";
	} else {
		return compiler.compile_node(this.item);
	}
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

Quasiquoted.prototype.compile = function (compiler) {
	UnquotedSplicing.resolve(this);
	if (this.item instanceof Unquoted) {
		this.item.compile_quoted = this.item.compile;
	}
	return Quoted.prototype.compile.call(this, compiler);
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


// UnquotedSplicing
this.UnquotedSplicing = UnquotedSplicing;
_extend(UnquotedSplicing, Unquoted);

UnquotedSplicing.resolve = function (node) {
	if (node instanceof Array) {
		var lists = [];
		lists.add = function (ls) {
			return this.push(new Quasiquoted(ls));
		};

		var slice_start = 0;

		for (var i = 0, len = node.length; i < len; i++) {
			var item = node[i];
			if (item instanceof UnquotedSplicing) {
				var sliced = node.slice(slice_start, i);
				slice_start = i + 1;
				if (sliced.length) {
					lists.add(sliced);
				}
				lists.push(item);
			} else if (item instanceof Array) {
				node[i] = UnquotedSplicing.resolve(item);
			}
		}

		if (lists.length) {
			var node_tail = node.slice(slice_start);
			if (node_tail.length) {
				lists.add(node_tail);
			}

			if (lists.length === 1) {
				return lists[0];
			} else {
				var ast = [[new JSBinOp("."), lists[0], new JSWord("concat")]].concat(lists.slice(1));
				return new Unquoted(ast);
			}
		} else {
			return node;
		}
	} else if (node instanceof Quoted) {
		node.item = UnquotedSplicing.resolve(node.item);
	}
	return node;
};

function UnquotedSplicing(item) {
	Unquoted.call(this, item);
}

UnquotedSplicing.prototype.inject_to_parent = function (parent, index) {
	if (this !== parent[index]) {
		throw new Error("Can't find this UnquotedSplicing instance in parent at given index");
	}
	parent.splice.apply(parent, [index, 1].concat(this.item));
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
