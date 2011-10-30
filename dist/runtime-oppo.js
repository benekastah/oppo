(function() {
  var evalProgram, parser, runtime_oppo;
  evalProgram = ((function() {
    try {
      return require('./oppo');
    } catch (e) {
      return this.oppo;
    }
  }).call(this)).eval;
  parser = (function() {
    try {
      return require('./parser');
    } catch (e) {
      return this.oppo.parser;
    }
  }).call(this);
  /*
  Here is the portion of the runtime that can be defined
  in oppo natively.
  */
  runtime_oppo = '(defmacro defn ($ident $arg-names ...$exprs)\n  \'(let (exprs (if (= (count \'$exprs) 1)\n                  (first \'$exprs)\n                  \'$exprs))\n    (def $ident (lambda $arg-names\n      (eval exprs)))))\n      \n(defmacro debug (...$to-eval)\n  \'(let (result (eval $to-eval))\n    (print result)\n    result))\n\n(defn print (...items)\n  (apply (. native console log) items))\n  \n(defn Y (func)\n  ((lambda (f) (f f))\n   (lambda (f)\n    (func (lambda (x) \n      ((f f) x))))))';
  try {
    module.exports = runtime_oppo;
  } catch (e) {
    oppo.runtime_oppo = runtime_oppo;
  }
}).call(this);
