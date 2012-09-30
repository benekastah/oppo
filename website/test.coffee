
compile_code = (code) ->
  parse_tree = oppo.read code
  compiled = oppo.compile parse_tree
  result = eval compiled


result = compile_code """

(def-chained-operator < "<" and)
(< 1 2 3 4 5 6 7)

"""
