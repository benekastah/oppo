
/****************************************************************************/
/* Symbol                                                                   */
/****************************************************************************/	

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


/****************************************************************************/
/* Comment                                                                  */
/****************************************************************************/	

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


/****************************************************************************/
/* JSWord                                                                   */
/****************************************************************************/	

this.JSWord = JSWord;

_extend(JSWord, Symbol);

function JSWord(text) {
	Symbol.call(this, text);
}

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

function JSBlock() {}

JSBlock.prototype.compile = function (compiler) {
	return "{ " + compiler.compile_each(this).join(";\n") + " }";
};


/****************************************************************************/
/* JSGroup                                                                  */
/****************************************************************************/	

this.JSGroup = JSGroup;

_extend(JSGroup, Array);

function JSGroup() {}

JSGroup.prototype.compile = function (compiler) {
	return "( " + compiler.compile_each(this).join(" ") + " )";
};


/****************************************************************************/
/* Macro                                                                    */
/****************************************************************************/	

this.Macro = Macro;

function Macro(ls) {
	this.ls = ls;
}

Macro.prototype.compile = function () {

};


/****************************************************************************/
/* Module                                                                   */
/****************************************************************************/	

this.Module = Module;

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
	compiler.module_stack.push(this);

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
