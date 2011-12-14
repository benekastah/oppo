(function() {
  oppo.module("test", ["oppo"], function(oppo) {
    var ast, evald;
    ast = oppo.read('\n;(defn fact (n)\n;  (if ~(n <= 2)\n;    n\n;    ~(n * (fact ~(n - 1)))))\n\n;(fact 5)\n\n(+ 1 1)\n');
    console.log(ast);
    evald = oppo.eval(ast);
    return console.log(evald);
  });
  oppo.module.require("test");
}).call(this);
