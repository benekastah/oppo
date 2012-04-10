# Oppo
A lisp for javascript.

## Goals

  - Performant. Offload work to the compiler when practical. Make use of javascript's native operators whenever possible.
  - It should be javascript. Compiled Oppo values and functions need to be directly usable in javascript and vice versa. Compiler output should be idiomatic and readable.
  - Hygenic macros. Pattern the macro system after Scheme's.
  - More to come.
  
## Functions

Function definitions should take a scheme-like form:

  (define (identity x) x)

The user should be able to specify default arguments like so:

  (define (get-number (x 0))
    (->num x))

Functions need to be tail-recursive.

## Mathematical operations

All mathematical operations that correspond with an operator in javascript need to use that operator. Hence:

  (+ 1 2 3)
  
should compile to:

  1 + 2 + 3;
  
However, they should also be usable as functions:

  (map '(1 2 3) +)
  
should compile to:

  map([1, 2, 3], _$plus_);
  
The rule is that when the `+` operator is in calling position, it will compile to the javascript operator. When it is in any other position, it will pass it's function value.

All mathematical operations must also be redefinable. Therefore:

  (set! + concat)
  (+ [] 1 2 3)
  
should compile to:

  _$plus_ = concat;
  _$plus_([], 1, 2, 3);
  
Note that here, even though `+` is in calling position, it is called as a function instead of as an operator. Once a operator-function has been redefined, it needs to act only as a function. If the definition ever goes back to the original function (and if we can detect it on the compiler side), then operators should be used again.