parse = @oppo.parser.parse
eval = @oppo.eval

s = parse """
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

s = parse """
(defn a () "a")
(print (a))
"""

# s = parse '''
# (print (not nil))
# '''

# s = parse """
# (defmacro p! (msg)
#   '(print msg))
#   
# (p! "yo")
# """

# s = parse """
# (defn factorial (n)
#   (if (<= n 2)
#     n
#     (* n (factorial (- n 1)))))
# 
# (print (factorial 5))
# """

s = parse '''
(def fib [1 1
            (lambda (n, i, ls)
              (+ n (nth ls (- i 2))))])
            
(nth fib 200)
'''

s = parse '''
(defn factorial (n)
  (reduce [n
            (lambda (n) 
              (if (> 0 n) (- n 1)))]
          (lambda (a b) (* a b))))
    
(factorial 5)
'''

console.log "#{s}"
console.log eval '''
(defn factorial (n)
  (reduce [n
            (lambda (n) 
              (if (> 0 n) (- n 1)))]
          (lambda (a b) (* a b))))
    
(factorial 5)
'''

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