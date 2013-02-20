
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
