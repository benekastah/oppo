(function() {
  var code, compiled, program;

  program = '\n(defmacro + (...nums)\n  (js-eval (nums.join " + ")))\n    \n(+ 1 2 3 4)\n';

  code = oppo.read(program);

  compiled = oppo.compile(code);

  console.log(compiled);

  console.log("result", eval(compiled));

}).call(this);
