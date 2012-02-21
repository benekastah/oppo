# Oppo

### Oppo is a sweet little lisp for javascript.

**Important**: Oppo is in alpha stage. It is for the adventurous, the intrepid explorers, the true hackers. It is certainly moving towards stability, but there is much yet to be done before it can be determined to be stable. One of the main things that needs doing is to get a meaningful test suite going, and some complete documentation on the macros and methods that are available to the programmer.

## Objectives

  * Oppo should not reinvent the wheel. Sane design choices from other languages were preferred over other ideas. The languages that have influenced oppo the most were javascript, clojure and coffeescript (in no particular order). Effort was made to keep javascript ideas intact in oppo where it made sense to do so.
  * Oppo should be a very programmer-friendly language. It should allow the programmer to modify his or her environment. Functions and macros are preferred over rigid operators and keywords. Oppo should smooth over the not-so-sane design choices made in javascript. Any system macro or function should be redefinable.
  * Oppo should have a simple module system that works in the browser and in applicable server-side environments. (Status: currently only node.js is supported. Modules need a little polishing, but work generally. Macros currently do not work well in modules.)
  * Oppo should have strong support for compiler macros. Reader macros should also be possible. (Status: currently, reader macros are not possible with oppo. All compiler macros are global at this time [though due to the incompleteness of the implementation, I believe they will not work across files currently]. Eventually, all macros should fit nicely into modules.)
  * Oppo should have a strong functional runtime. In accordance with oppo's desire not to reinvent the wheel, [Underscore.js](http://documentcloud.github.com/underscore) was chosen as the foundation of the runtime. Therefore, compiled code from oppo has Underscore.js as an implicit dependency.
  
## Syntax rundown

Oppo is a lisp, and follows lisp's general semantics:

    ; A semicolon comments the line
    ;; This calls a function. Arguments do not need commas to separate them
    ;; This is like writing some_fn(1, 2, 3) in javascript
    (some-fn 1 2 3)
    
    ;; This is a quoted expression. It won't be evaluated. Instead it can be
    ;; stored, modified, and evaluated later.
    '(some-fn 1 2 3)
    
Almost anything can be an identifier. Note, identifiers in oppo are case-insensitive:

    some-fn ;; becomes some_fn
    cool?   ;; becomes cool_qmark_
    *       ;; becomes _star_
    YO%man  ;; becomes yo_percent_man
    
Oppo has keywords and strings. Keywords are similar to the idea behind clojure's keywords and ruby's symbols. Since the basic idea is to have a unique identifier, and since javascript doesn't have a keyword concept, I just chose to make keywords translate into string literals:

    (= :hey-man! "hey-man!") ;; returns true, because the two expressions are equal
    
Oppo also has symbols. Using these ideas, we can access properties on an object:

    ;; In a browser, `global` is an alias for `window`
    (. global 'alert)          ;; global.alert
    (. global 'ALERT)          ;; global.alert
    (. global 'getElementById) ;; global.getelementbyid  <- doesn't work!!
    (. global :getElementById) ;; global["getElementById"]  <- ahh, that's better!
    
    (. foo 'bar :batz)         ;; foo.bar["batz"]
    (def thing :batz)          ;; thing = "batz"
    (. foo 'bar thing)         ;; foo.bar["batz"]
    
We can make javascript objects:

    (def obj {'a 1
              'b 2}) ;; obj = {a: 1, b: 2}
    (def obj {:a 1
              :b 2}) ;; obj = {"a": 1, "b": 2}
              
We can also make arrays:

    (def ls [1 2 3 4 5]) ;; ls = [1, 2, 3, 4, 5]
    
Accessing members of arrays is simple. **Note**: most functions in oppo treat arrays as if they are 1-based instead of 0-based:

    (def arr [1 2 3 4 5])
    (nth arr 3)      ;; 3
    (nth arr -2)     ;; 4
    (nth arr 0)      ;; undefined
    (index-of arr 1) ;; 1
    
    ;; Access arrays in a 0-based way, if you must
    (. arr 0)        ;; 1
    
We can do math:

    (+ 1 2 3) ;; 6
    (/ 5 2)   ;; 2.5
    (% 10 2)  ;; 0
    (** 3 3)  ;; 3^3 = 9
    
We can define functions:

    ;; works
    (def add-5 (lambda (x) (+ x 5))) ;; you can use `fn` instead of `lambda` if you want
    ;; simpler
    (defn add-5 (x) (+ x 5))
    ;; another way
    (def add-5 #(+ %1 5)) ;; %1 refers to the first argument of the function
    
We can define macros:

    (defmacro log (...args)
      `((. global 'console 'log) ...args))
      
    (log 1 2 3 4) ;; global.console.log(1, 2, 3, 4)
      
    (defmacro add-5 (x)
      `(+ ~x 5))
      
    (add-5 6)     ;; 6 + 5
    
We can call underscore functions:

    (map {'a 1
          'b 2}
         #(* %1 3)) ;; [3, 6]
         
The runtime tends to change some of the names of existing functions (the underscore object itself is *not* modified). If you aren't sure about a name, there is a simple formula you can use to figure it out:

  * Camel cased names end up separated by dashes: `indexOf` -> `index-of`
  * Method names prefixed with `is` have a question mark at the end instead: `isString` -> `string?`
  * Method names prefixed with `to` have `->` as a prefix instead: `toArray` -> `->array`
  * Underscores and dashes are interchangeable: `some_identifier` === `some-identifier`. The exception is when the identifier is a single dash: `-` -> `_minus_`.
  
## A few more complete examples

The obligatory factorial function (**note**: no tail recursion yet):

    (defn fact (n)
      (if (> n 2)
        (* n (fact (- n 1)))
        n))
        
Or, we could try it another way:

    (defn fact (n)
      (reduce (range n 1 -1) #(* %1 %2)))
      
Here is a simple error handling function (for a browser):

    (defn handle-error (message)
      (let (msg (or message "An unknown error has occurred"))
        (alert msg)))
        
If you have a thirst for fibonacci numbers:

    (defn fib (x ls)
      (let (-ls (or ls [1 1])
            n (last -ls)
            n-1 (nth -ls -2)
            fibs (concat -ls (+ n n-1)))
        (if (< (size fibs) x)
          (fib x fibs)
          fibs)))

    (fib 15) ;; get the first 15 fibonacci numbers