
compile_code = (code) ->
  parse_tree = oppo.read code
  compiled = oppo.compile parse_tree
  result = eval compiled


result = compile_code """

(for-each (n '(1 2 3))
  (puts n))

"""
