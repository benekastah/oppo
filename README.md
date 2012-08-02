# Oppo

### Oppo is a sweet little lisp for javascript.

**Important**: Oppo is alpha software. It is for the adventurous, the intrepid explorers, the true hackers. It is certainly moving towards stability, but there is much yet to be done before it can be determined to be stable. One of the main things that needs doing is to get a meaningful test suite going, and some complete documentation on the macros and methods that are available to the programmer.

## Objectives

  * It should be javascripty. Don't reinvent valid javascript concepts. The languages that have influenced oppo the most were javascript, scheme, clojure and coffeescript.
  * Oppo should be a very programmer-friendly language. It should allow the programmer to modify his or her environment. Functions and macros are preferred over rigid operators and keywords. Oppo should smooth over the not-so-sane design choices made in javascript. Any system macro or function should be redefinable.
  * Oppo should have strong support for compiler macros. Reader macros should also be possible. (Status: currently, reader macros are not possible with oppo. They won't be until oppo is self-compiling.)
  * Oppo should have a strong functional runtime.
  
## Syntax rundown

Oppo is a lisp, and follows lisp's general semantics:

    ; A semicolon comments the line
    ;; This calls a function. Arguments do not need commas to separate them
    ;; This is like writing some_fn(1, 2, 3) in javascript
    (some-fn 1 2 3)
    
    ;; This is a quoted expression. It won't be evaluated. Instead it can be
    ;; stored, modified, and evaluated later.
    '(some-fn 1 2 3)
   
Almost anything can be an identifier:

    some-fn ;; becomes some_fn
    cool?   ;; becomes cool_$questionmark_
    *       ;; becomes _$asterisk_
    YO%man  ;; becomes YO_$percent_man
    
Oppo has keywords and strings. Keywords are similar to the idea behind clojure's keywords and ruby's symbols. Since the basic idea is to have a unique symbolic object, and since javascript doesn't have a keyword concept, I just chose to make keywords translate into string literals:

    (= :hey-man! "hey-man!") ;; returns true, because the two expressions are equal
    
Oppo also has symbols. Using these ideas, we can access properties on an object:

    ;; In Oppo, `root` is an alias for `global` or `window`, whichever is available first.
    ;; Putting the `@` before an object turns that object into a macro which can access its members like so:
    (@root 'alert)          ;; root.alert
    (@root 'ALERT)          ;; root.alert
    (@root 'getElementById) ;; root.getElementById
    (@root :getElementById) ;; root["getElementById"]
    
    (@foo 'bar :batz)       ;; foo.bar["batz"]
    (def thing :batz)       ;; thing = "batz"
    (@foo 'bar thing)       ;; foo.bar[thing]
    
We can also call methods on objects:
    
    (.alert root "Hi there!") ;; root.alert("Hi there!")
    (.save post)              ;; post.save()

We can make javascript objects:

    (def obj {:a 1
              :b 2}) ;; obj = {"a": 1, "b": 2}
              
We can also make arrays:

    (def ls [1 2 3 4 5]) ;; ls = [1, 2, 3, 4, 5]
    
Accessing members of arrays is simple. _**NOTE**: nth treats arrays as if they are 1-based instead of 0-based_:

    (def arr [1 2 3 4 5])
    (nth arr 3)      ;; 3
    (nth arr -2)     ;; 4
    (nth arr 0)      ;; null
    
    ;; Access arrays in a 0-based way, if you must
    (@arr 0)        ;; 1
    
We can do math:

    (+ 1 2 3) ;; 6
    (/ 5 2)   ;; 2.5
    (mod 10 2)  ;; 0
    (pow 3 3)  ;; 3^3 = 9
    
We can define functions:

    ;; works
    (def add-5 (lambda (x) (+ x 5)))
    ;; simpler
    (def (add-5 x) (+ x 5))
    ;; another way. **NOTE**: This is planned but not implemented.
    (def add-5 #(+ %1 5)) ;; %1 refers to the first argument of the function
    
We can define macros:

    (defmacro (log ...args)
      `(.log (@root 'console) ,@args))
      
    (log 1 2 3 4) ;; root.console.log(1, 2, 3, 4)
      
    (defmacro (add-5 x)
      `(+ ,x 5))
      
    (add-5 6)     ;; _$plus_(6, 5)
    
We can call map/reduce/filter/etc. _**NOTE** more complete API docs to come_:

    (map {'a 1
          'b 2}
         #(* %1 3)) ;; [3, 6]
  
## A few more complete examples

The obligatory factorial function:

    (def (fact n)
      (if (> n 2)
        (* n (fact (- n 1)))
        n))

We could make it tail-recursive:

    (def (rec-fact n accum)
      (if (< n 2)
        accum
        (rec-fact (decr n) (* accum n))))

    (def (fact n)
      (rec-fact n 1))
      
Here is a simple error handling function (for a browser):

    (def (handle-error message)
      (let (msg (or message "An unknown error has occurred"))
        (alert msg)))
        
If you have a thirst for fibonacci numbers. _**NOTE**: I should probably make this tail-recursive_:

    (def (fib x ls)
      (let (-ls (or ls [1 1])
            n (last -ls)
            n-1 (nth -ls -2)
            fibs (concat -ls (+ n n-1)))
        (if (< (@fibs :length) x)
          (fib x fibs)
          fibs)))

    (fib 15) ;; get the first 15 fibonacci numbers