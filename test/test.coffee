
s = parser.parse """
(defn Y (le)
  ((lambda (f) (f f))
   (lambda (f)
    (le (lambda (x) 
      ((f f) x))))))

(def factorial
  (Y (lambda (fac)
    (lambda (n)
      (if (<= n 2)
        n
        (* n (fac (- n 1))))))))
      
(print (factorial 5))
"""

s = parser.parse """
(defn a () "a")
(print (a))
"""

# s = parser.parse '''
# (print (not nil))
# '''

# s = parser.parse """
# (defmacro p! (msg)
#   '(print msg))
#   
# (p! "yo")
# """

s = parser.parse """
(defn factorial (n)
  (if (<= n 2)
    n
    (* n (factorial (- n 1)))))

(print (factorial 5))
"""

console.log "#{s}"
console.log Runtime.eval null, s

### IDEAS

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

###