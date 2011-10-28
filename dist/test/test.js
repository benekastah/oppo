(function() {
  var s;
  s = parser.parse("(defn Y (le)\n  ((lambda (f) (f f))\n   (lambda (f)\n    (le (lambda (x) \n      ((f f) x))))))\n\n(def factorial\n  (Y (lambda (fac)\n    (lambda (n)\n      (if (<= n 2)\n        n\n        (* n (fac (- n 1))))))))\n      \n(print (factorial 5))");
  s = parser.parse("(defn a () \"a\")\n(print (a))");
  s = parser.parse("(defn factorial (n)\n  (if (<= n 2)\n    n\n    (* n (factorial (- n 1)))))\n\n(print (factorial 5))");
  console.log("" + s);
  console.log(Runtime.eval(null, s));
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
