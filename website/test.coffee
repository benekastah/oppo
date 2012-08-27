
oppo_code = """

;; Hey there!
(def (identity x) x)
(alert (identity .5))

"""

parse_tree = oppo.read oppo_code
compiled = oppo.compile parse_tree
result = eval compiled