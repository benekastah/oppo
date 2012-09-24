
compile_code = (code) ->
  parse_tree = oppo.read code
  compiled = oppo.compile parse_tree
  result = eval compiled


result = compile_code """

(def (add a b) (js::eval "(+a) + (+b)"))
(def (+ ...n) (.reduce n add))

(+ 1 2 3)

"""
