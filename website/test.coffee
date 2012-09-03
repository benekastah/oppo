
oppo_code = """

(def (list ...ls) ls)

(list 1 2 3 4)

"""

parse_tree = oppo.read oppo_code
compiled = oppo.compile parse_tree
result = eval compiled