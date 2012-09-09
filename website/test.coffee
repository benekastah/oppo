
oppo_code = """

(defmacro (get o p)
  `((quote ,p) ,o))

(get window alert)

"""

parse_tree = oppo.read oppo_code
compiled = oppo.compile parse_tree
result = eval compiled