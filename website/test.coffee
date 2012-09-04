
oppo_code = """

(defmacro (puts ...stuff)
  `(.log console ,@stuff))

(puts 'asdf)

"""

parse_tree = oppo.read oppo_code
compiled = oppo.compile parse_tree
result = eval compiled