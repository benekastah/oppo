
compile_code = (code) ->
  parse_tree = oppo.read code
  compiled = oppo.compile parse_tree
  result = eval compiled


result = compile_code """

(def (fact n)
  (let loop [n* n
             accum 1]
     (if (< n* 1)
       accum
       (loop (- n* 1) (* n* accum)))))

(puts (fact 5))

"""
