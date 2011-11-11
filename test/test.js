(function() {
  oppo.module("test", ["oppo"], function(oppo) {
    var ast;
    ast = oppo.read('\n(defmacro a (a) a)\n(a b)\n');
    console.log(ast);
    return console.log(oppo.eval_program(ast));
  });
  oppo.module.require("test");
}).call(this);
