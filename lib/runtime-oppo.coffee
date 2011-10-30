evalProgram = (try require './oppo'
catch e then @oppo).eval

parser = try require './parser'
catch e then @oppo.parser

###
Here is the portion of the runtime that can be defined
in oppo natively.
###

runtime_oppo = '''
(defmacro defn ($ident $arg-names ...$exprs)
  '(let (exprs (if (= (count '$exprs) 1)
                  (first '$exprs)
                  '$exprs))
    (def $ident (lambda $arg-names
      (eval exprs)))))
      
(defmacro debug (...$to-eval)
  '(let (result (eval $to-eval))
    (print result)
    result))

(defn print (...items)
  (apply (. native console log) items))
  
(defn Y (func)
  ((lambda (f) (f f))
   (lambda (f)
    (func (lambda (x) 
      ((f f) x))))))
'''

try module.exports = runtime_oppo
catch e then oppo.runtime_oppo = runtime_oppo