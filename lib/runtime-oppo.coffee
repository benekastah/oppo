evalProgram = (try require './oppo'
catch e then @oppo).eval

parser = try require './parser'
catch e then @oppo.parser

###
Here is the portion of the runtime that can be defined
in oppo natively.
###

evalProgram parser.parse '''
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
  (apply (. global console log) items))
'''