
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
				item = node[i] = this.process_macros(item);
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
