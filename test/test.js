(function() {
  oppo.module("test", ["oppo"], function(oppo) {
    var ast, evald;
    ast = oppo.read('(first \'(1 2 3 4))');
    console.log(ast);
    evald = oppo.eval(ast);
    return console.log(evald);
  });
  oppo.module.require("test");
}).call(this);
