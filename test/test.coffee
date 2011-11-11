
oppo.module "test", ["oppo"], (oppo) ->

  ast = oppo.read '''

  (defmacro a (a) a)
  (a b)

  '''

  console.log ast

  console.log oppo.eval_program ast
  
oppo.module.require "test"