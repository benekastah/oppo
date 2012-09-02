
oppo_code = """

(.concat "asdf " "fdsa")

"""

parse_tree = oppo.read oppo_code
compiled = oppo.compile parse_tree
result = eval compiled