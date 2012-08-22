# Oppo
A lisp for javascript.

## Goals

  - Performant. Offload work to the compiler when practical. Make use of javascript's native operators whenever possible.
  - It should be javascript. Compiled Oppo values and functions need to be directly usable in javascript and vice versa. Compiler output should be idiomatic and readable.
  - Hygenic macros. Pattern the macro system after Scheme's.

## Runtime
### General
#### Macros
  - **defmacro**

    Defines a new macro:

        (defmacro (id x) `(identity ,x))

    **defmacro** always defines its values _in the module scope_. Since macros are not true values, but compiler configurations, there is no such thing as a lexically-scoped macro.

  - **def**

    Defines a new value or function:

        (def a 5) ;; defines variable a with value 5
        (def (identity x) x) ;; defines identity function

    **def** always defines its values _in the module scope_. In order to define local variables, **let** must be used.

  - **set**

    Sets the value of a previously defined variable:

        (def a 5)
        (set a (+ 5 1))

  - **lambda**

    Defines a new function:

        (lambda (... args) (map add args))

    **lambda** equates to an anonymous function in javascript.

  - **let**

  - **do**

  - **js-eval**

  - **quote**

  - **quasiquote**

  - **unquote**

#### Functions
  - **eval**

### Binary
#### Macros
  - **or**

  - **and**

  - **not**

### Logical
#### Macros
  - **if**

  - **>**

  - **<**

  - **>=**

  - **<=**

  - **==**

  - **===**

#### Functions
  - **=**
    
    Tests objects for equality. Considers objects with identical property-value maps to be equal.

### Math
#### Macros
  - **\+**

        (+ 1 2 3) ;; -> 1 + 2 + 3

  - **\-**

        (- 5 4 3) ;; -> 5 - 4 - 3

  - **\***

        (* 10 30) ;; -> 10 * 30

  - **/**

        (/ 12 2) ;; -> 12 / 2

  - **%**

        (% 16 4) ;; -> 16 % 4

#### Functions
  - **add**
    
    Function counterpart of **\+**

  - **subtract**
    
    Function counterpart of **\-**

  - **multiply**
    
    Function counterpart of **\***

  - **divide**
    
    Function counterpart of **/**

  - **mod**
    
    Function counterpart of **%**

### Collections
#### Macros
  - **object, {}**

  - **list, []**

#### Functions
  - **map**

  - **reduce, reduce-left**

  - **reduce-right**

  - **filter**

  - **some**