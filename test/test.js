(function() {
  oppo.module("test", ["oppo"], function(oppo) {
    var ast, evald;
    ast = oppo.read('(def a \'(1 2 3 4 5 6 7 8 9))\n(nth a -4)');
    console.log(ast);
    evald = oppo.eval(ast);
    return console.log(evald);
  });
  oppo.module.require("test");
}).call(this);
