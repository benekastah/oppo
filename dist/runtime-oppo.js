(function() {
  var evalProgram, parser;
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
  evalProgram(parser.parse('(defmacro defn ($ident $arg-names ...$exprs)\n  \'(let (exprs (if (= (count \'$exprs) 1)\n                  (first \'$exprs)\n                  \'$exprs))\n    (def $ident (lambda $arg-names\n      (eval exprs)))))\n      \n(defmacro debug (...$to-eval)\n  \'(let (result (eval $to-eval))\n    (print result)\n    result))\n\n(defn print (...items)\n  (apply (. global console log) items))'));
}).call(this);
