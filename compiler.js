
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
