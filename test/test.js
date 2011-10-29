(function() {
  var eval, parse, s;
  parse = this.oppo.parser.parse;
  eval = this.oppo.eval;
  s = parse("(defn Y (le)\n  ((lambda (f) (f f))\n   (lambda (f)\n    (le (lambda (x) \n      ((f f) x))))))\n\n(def factorial\n  (Y (lambda (fac)\n    (lambda (n)\n      (if (<= n 2)\n        n\n        (* n (fac (- n 1))))))))\n      \n(print (factorial 5))");
  s = parse("(defn a () \"a\")\n(print (a))");
  s = parse('(def fib [1 1\n            (lambda (n, i, ls)\n              (+ n (nth ls (- i 2))))])\n            \n(nth fib 200)');
  s = parse('(defn factorial (n)\n  (reduce [n\n            (lambda (n) \n              (if (> 0 n) (- n 1)))]\n          (lambda (a b) (* a b))))\n    \n(factorial 5)');
  console.log("" + s);
  console.log(eval('(defn factorial (n)\n  (reduce [n\n            (lambda (n) \n              (if (> 0 n) (- n 1)))]\n          (lambda (a b) (* a b))))\n    \n(factorial 5)'));
  /* IDEAS
  
  ;; [] denotes a list that only takes one type
  ;; It would be able to make performance optimizations (use javascript typed arrays, string tries, etc)
  ;; it would be the syntactical equivalent of the function (typed-list ...)
  
  ;; {} would be a hash-map, much after the clojure fashion
  
  (defn some-fn
    ;; doc string is optional
    "Some doc string"
    ;; type check is optional
    (expect '(Number Number) Number)
    (x y)
      (/ (+ x y) (- x y)))
      
  defn some-fn
  "Some doc string"
  expect '(Number Number) Number
  x y
    / (+ x y) (- x y)
  
  */
}).call(this);
