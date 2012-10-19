# Oppo

**Oppo is a sweet little lisp for javascript.** This is experimental,
  and therefore any suggestions are welcome.
  
## The language

Following is a list of macros, functions and variables available to
the oppo programmer. Entries take the format of
`<module>::<item-name>`. The `core` module is automatically available,
so you don't have to use the module prefix in that case. As an
example, you can call `core::str` by simply invoking `str` (unless you
have  replaced `str` in your current module or in an active local
scope).

### Core module
  - macro `core::defmacro`: `(defmacro optional-metadata (macro-name
    ...args) ...body)`
    Defines a macro.
    
    Example:
    ```
    (defmacro (log ...x)
      `(.log console ,@x))
    ```
    
  - macro `core::def`: `(def optional-metadata name value)` | `(def
    optional-metadata (fn-name ...args) ...body)`
    Defines a variable on the current module.
    
    Example:
    ```
    ;; Define module variable
    (def one 1)
    ;; Define function
    (def (identity x) x)
    ```
    
  - macro `core::set!`: `(set! name value)`
    Resets the value of a variable.
    
    Example:
    ```
    (def n 1)
    (set! n (+ n 1))
    ```
    
  - macro `core::lambda`: `(lambda (...args) ...body)`
    Creates a function. You can also use the `#(...)` reader macro for
    this. Arguments that aren't named can still be accessed from the
    `arguments` object. A reader macro is provided for this as well,
    `#1` where the `1` can be any number greater than 0. `#1` will
    access the 0th argument, `#2` the first argument and so on.
    
    Example:
    ```
    (map (lambda (a)
           (+ a 1)) #[1 2 3 4 5]) ;; -> #[2 3 4 5 6]
           
    (map #(+ #1 1) #[1 2 3 4 5]) ;; -> #[2 3 4 5 6]
    ```
    
  - macro `core::call`: `(call callable-item ...args)`
    This is used internally for all function/macro calling. This is
    not generally the way you will need to call things.
    
    Example:
    ```
    (call puts 1 2 3)
    ;; The normal way to call things is without `call`.
    ;; Running it this way will do the same thing as the line above.
    (puts 1 2 3)
    ```
    
  - macro `core::object-get-value`: `(object-get-value prop base)`
    Gets the value with the corresponding `prop` in a collection. You
    shouldn't often need to invoke this directly. See example below.
    
    Example:
    ```
    (object-get-value 'alert window)
    
    ;; Here's a better way to do this:
    ('alert window)
    ;; or
    ("alert" window)
    ```
    
  - macro `core::.`: `(. fname base ...args)`
    Gets a callable value from `base` and immediately calls it with
    `args`. Because of a handy reader macro, there doesn't need to be
    a space separating the `.` from the `fname`.
    
    Example:
    ```
    (.alert window 5)
    (."static" express)
    ```
    
  - macro `core::quote`: `(quote x)`
    Quotes `x`. Instead of using the explicit call, most of the time
    you will want to use the reader macro `'`.
    
    Example:
    ```
    (quote x) ;; -> x
    'x ;; -> x
    ```
    
  - macro `core::quasiquote`: `(quasiquote x)`
    Quasiquotes `x`. You can also use the reader macro `\``.
    
    Example:
    ```
    (def a 5)
    `(1 2 3 4 a ,a) ;; -> '(1 2 3 4 a 5)
    ```
    
  - macro `core::unquote`: `(unquote x)`
    Unquotes `x`. You can also use the reader macro `,`.
    
    Example:
    ```
    (def a 5)
    `(1 2 3 4 a ,a) ;; -> '(1 2 3 4 a 5)
    ```
    
  - macro `core::unquote-splicing`: `(unquote-splicing x)`
    Unquotes each item in `x` in sequence into another structure. You
    can also use the reader macro `,@`.
    
    Example:
    ```
    (def a #[1 2 3 4 5])
    `(0 ,@a 6) ;; -> #[0 1 2 3 4 5 6]
    ```
    
  - macro `core::let`: `(let (...bindings) ...body)`
    Introduces a local scope. `bindings` are the local variables. It
    will run each item in body in this new local scope and return the
    result of the last item.
    
    Example:
    ```
    (let [a 1
          b 2
          c 3]
       (+ a b c)) ;; -> 6
    ```
    
  - macro `core::if`: `(if condition run-if-true optional-run-if-false)`
    `if` expression.
    
    Example:
    ```
    (if (nil? x)
      (do-something)
      (do-something-else))
    ```
    
  - macro `core::for`: `(for [defs ls] ...body)`
    The `for` expression is very similar to map, but can be much
    faster.
    
    Example:
    ```
    ;; `n` represents an item in the array.
    (for [n #[1 2 3 4 5]] (* n 2)) ;; -> #[2 4 6 8 10]
    ;; `n` represents an item in the array and `i` represents the index.
    (for [(n i) #[1 2 3 4 5]] (+ n i)) ;; -> #[1 3 5 7 9]
    ```
    
  - macro `core::do`: `(do ...body)`
    `do` will run each item in `body` and give you the result of the
    last statement.
    
    Example:
    ```
    (if (< n 5)
      (do
        (puts n)
        (set! n (+ n 1))))
    ```
    
  - macro `core::include`: `(include ...module-names)`
    This will find and compile each module. If the module has already
    been compiled, then it is already available and will not attempt
    to compile it again.
    
    Modules are simple directory paths that are resolved in the same
    base directory as the main file. Generally, you should only send
    one single file to the oppo compiler, and this file will include
    all the modules it needs, and those modules will include the modules
    they need, and so forth. In this way, the compiler will get all
    the source files used and compile them all into a single
    javascript file.
    
    Example:
    ```
    (include routes/main routes/users)
    
    (.get app "/" routes/main::home)
    (.get app "/user/:id" routes/users::show)
    ```
    
  - macro `core::apply`: `(apply fn args)`
    This is the same as using the javascript .apply function, except
    you can't specify scope.
  
  - macro `core::require`: `(require module-name)` | `(require varname
    module)`
    Makes using the node.js require function (or any implementation
    similar enough) simpler to use.
    
    Example:
    ```
    (require express) ;; var express = require('express');
    (require routes "./routes") ;; var routes = require('./routes');
    ```
    
  - macro `core::new`: `(new Class ...args)`
    Allows you to instantiate a class.
    
  - macro `core::puts`: `(puts ...args)`
    Logs output to the console.
    
  - macro `core::puts-warning`: `(puts-warning ...args)`
    Logs warning message to the console.
    
  - macro `core::puts-error`: `(puts-error ..args)`
    Logs error message to the console.
    
  - macro `core::cond`: `(cond cond1 body1 cond2 body2 cond-n body-n)`
    Evaluates each condition until it finds one that is true. When it
    finds a true condition, it executes the corresponding body.
    
    Example:
    ```
    (def n 3)
    (cond
      (eq n 1) (puts "one")
      (eq n 2) (puts "two")
      (eq n 3) (puts "three")
      'else (puts "idk")) ;; will print "three" to the console.
    ```
    
  - macro `core::use-from`: `(use-from module ...items)`
    Extracts items from `module` and defines a copy locally.
    
    Example:
    ```
    (use-from js eval
                 typeof) ;; Now the macros eval and typeof are
    available in the current scope.
    ```
    
  - macro `core::use`: `(use module1 defs1 module2 defs2 module-n defs-n)`
    With each module and defs pair, it calls `use-from`.
    
    Example:
    ```
    (use module-a [a b c]
         module-b [d e f])
    ```
    
  - macro/function `core::symbol`: `(make-symbol x)`
    Generates a symbol from x.
    
    Example:
    ```
    (symbol 'asdf)
    (symbol "asdf")
    ```
    
  - **Basic operations**
    These are all of type macro/function, and are all in the module
    `core`. They all correspond with the same operator in javascript
    unless otherwise noted.
    
    **Math**
      - `+`
      - `-`
      - `*`
      - `/`
    
    **Logical**
      - `not` (javascript `!`)
      - `or` (javascript `||`)
      - `and` (javascript `&&`)
      
    **Comparison**
      - `<`
      - `>`
      - `<=`
      - `>=`
      - `eq` (javascript `===`)
      - `not-eq` (javascript `!==`)
      - `eq~` (javascript `==`)
      - `not-eq~` (javascript `!=`)
      <br />
  
  - **Type checking**
    All the following are of type function/macro and check to see that their
    argument is equal to the type the name describes. (For example,
    `(number? x)` returns true when `x` is a number). All are in the
    `core` module.
    
      - `number?`
      - `string?`
      - `array?`
      - `arguments?` (returns true when its argument is a function's
        arguments object.)
      - `nil?` (returns true when its argument is either null or
        undefined.)
      - `function?`
      - `regex?`
      - `date?`
      <br />
  
  - function `core::typeof`: `(typeof x)`
    This is the `toType` function by Angus Croll found
    [here](https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/).
    
  - function `core::eval`: `(eval to-eval)`
    This invokes oppo's compiler on `to-eval`, `eval`s the compiled
    code using the javascript `eval` function and returns the computed
    result.
    
    Example:
    ```
    (eval '(+ 1 1)) ;; -> 2
    ```
    
  - function `core::empty?`: `(empty? coll)`
    Checks to see if a collection is empty. Accepts argument of any
    type. Empty arrays, objects and strings will return
    true. Additionally, `#nil` and `0` will also return true. Anything
    else will return false.
    
  - function `core::contains?`: `(contains? coll value
    optional-deep-eq)`
    Checks to see if the collection contains the
    value. `optional-deep-eq` is `#true` by default. If it is set to
    `#false`, it will use the `===` operator for comparison rather
    than the oppo `=` function.
    
  - function `core::contains-key?`: `(contains-key? coll, key)`
    Checks to see if the collection contains the given key. Works for
    arrays, the arguments object, strings and objects. If you pass
    something else for `coll`, the result will be `#false`.
    
  - function `core::list`: `(list ...args)`
    Makes a list out of the arguments. You can call this function
    directly, or you can use the `#[...]` reader macro.
    
    Example:
    ```
    (= (list 1 2 3) #[1 2 3]) ;; -> #true
    ```
    
  - function `core::->list`: `(->list object)`
    Turns any object with a length property into a list.
    
  - function `core::map`: `(map fn list)`
    Invokes `fn` with each item in `list` and gathers the results of
    those calls into an array, which is returned. Similar to `for`.
    
    Example:
    ```
    (def ls #[1 2 3 4 5])
    (map #(* #1 2) ls) ;; -> #[2 4 6 8 10]
    ```
    
  - function `core::reduce`: `(reduce fn list)`
    Invokes `fn` with the first two items in `list`, gets the result,
    and then continues through the rest of the list calling `fn` with
    the previous result and the next item in the list until the list
    is exhausted. Returns the final result.
    
    Example:
    ```
    (def ls #[1 2 3 4 5])
    (reduce * ls) ;; -> 120
    ```
    
  - function `core::reduce-right`: `(reduce-right fn list)`
    Same as `core::reduce`, but operates on the list in reverse.
    
  - function `core::filter`: `(filter fn list)`
    Invokes `fn` on each item in the list and returns a new list of
    all the items for which `fn` returned a truthy value.
    
    Example:
    ```
    (def (is-odd? n)
      (> (mod n 2) 0))
      
    (def ls #[0 1 2 3 4 5 6])
    (filter is-odd? ls) ;; -> #[1 3 5]
    ```
    
  - function `core::concat`: `(concat ls1 ls2 ls-n)`
    This works on lists and strings, but if you are working on lists
    then each `ls` must be a list and if you are working on strings
    then each `ls` must be a string. It uses the native `concat`
    method for lists and strings respectively.
    
  - function `core::first`: `(first ls)`
    Returns the first item in an ordered collection.
    
  - function `core::second`: `(second ls)`
    Returns the second item in an ordered collection.
    
  - function `core::third`: `(third ls)`
    Returns the third item in an ordered collection.
    
  - function `core::last`: `(last ls)`
    Returns the last item in an ordered collection.
    
  - function `core::slice`: `(slice ls start optional-end)`
    Returns a list of all the items between `start` and either
    `optional-end` or the end of the list.
    
  - function `core::head`: `(head ls)`
    Returns a new list of all the items in `ls` except the last one.
    
  - function `core::tail`: `(tail ls)`
    Returns a new list of all the items in `ls` except the first one.
    
  - function `core::nth`: `(nth ls n)`
    Returns the `n`th item of `ls`. Operates on `ls` as if it were
    1-indexed.
    
    Example:
    ```
    (def ls #[1 2 3])
    (nth ls 1) ;; -> 1
    ```
    
  - function `core::object`: `(object key1 value1 key2 value2 key-n
    value-n)`
    Creates an object. You can also use the reader macro `#{...}`
    
    Example:
    ```
    (object 'a 1 'b 2 'c 3 'd 4 'e 5) ;; -> #{a 1
                                              b 2
                                              c 3
                                              d 4
                                              e 5}
    ```
    
  - function `core::->object`: `(->object x)`
    Converts `x` into an Object.
    
  - function `core::merge`: `(merge ...objects)`
    Creates a new object with the combined properties of each object
    passed in. If there are conflicts, objects passed in later will
    have priority.
    
    Example:
    ```
    (def o1 #{'a 1 'b 2 'c 3})
    (def o2 #{'a #nil 'd 4})
    (merge o1 o2) ;; -> #{a #nil
                          b 2
                          c 3
                          d 4}
    ```
    
  - function `core::keys`: `(keys obj)`
    Returns all direct keys of any object. This will not return keys
    on the prototype of the object.
    
  - function `core::str`: `(str ...strings)`
    Concatenates all `strings` into a single string. Arguments do not
    have to explicitly be a string. If they are not a string, they
    will be converted into a string for the final result.
    
  - function `core::->string`: `(->string x)`
    Converts `x` into a string.
    
  - function `core::->number`: `(->number x)`
    Converts `x` into a number.
    
  - function `core::->boolean`: `(->boolean x)`
    Converts `x` into a boolean.
    
  - function `core::=`: `(= ...items)`
    Checks to see if all items are equal to each other. In the case of
    objects, `=` will check to see if the objects are similar enough
    to be considered equal.
    
  - function `core::not=`: `(not= ...items)`
    The inverse of `core::=`.
    
  - function `core::list?`: `(list? x)`
    Checks if x is a list (it is either an array or an arguments
    object).
    
  - function `core::object?`: `(object? x)`
    Checks if x is any kind of object.
    
  - function `core::isNaN?`: `(isNaN? x)`
    Checks if x is the `isNaN` primitive.
    
  - object `core::global`
    This refers to `global` when it is available and `window` otherwise.
    
### js Module
  - macro `js::eval`: `(js::eval to-eval)`
    If you pass in a string, `js::eval` will dump that string as-is
    into the compiler output. If you pass in anything else, it will be
    compiled normally and then passed to the javascript `eval`
    function.
    
    Example:
    ```
    (def obj #{'a 1 'b 2})
    (if (js::eval "'a' in obj")
      (do-something obj))
    ```
    
  - macro `js::typeof`: `(js::typeof x)`
    This is the same as the javascript operator `typeof`.
    
    Example:
    ```
    (typeof 5) ;; -> "number""
    (typeof #nil) ;; -> "object"
    ```
