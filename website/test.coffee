
compile_code = (code) ->
  parse_tree = oppo.read code
  compiled = oppo.compile parse_tree
  result = eval compiled


result = compile_code """

(test::describe "oppo"
  (test::it "has a test suite that basically works"
    (test::assert (= 1 1))
    (test::assert (= 5 1))))

"""
