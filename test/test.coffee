
oppo.module "test", ["oppo"], (oppo) ->

  ast = oppo.read '''
  (first '(1 2 3 4))
  '''

  console.log ast
  evald = oppo.eval ast
  console.log evald

oppo.module.require "test"