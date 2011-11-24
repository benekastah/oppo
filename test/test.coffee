
oppo.module "test", ["oppo"], (oppo) ->

  ast = oppo.read '''
  (def a '(1 2 3 4 5 6 7 8 9))
  (nth a -4)
  '''

  console.log ast
  evald = oppo.eval ast
  console.log evald

oppo.module.require "test"