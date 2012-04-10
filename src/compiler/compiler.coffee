read = oppo.read = oppo.compiler.read = ->
  parser.parse arguments...

compile = oppo.compile = oppo.compiler.compile = (sexp) ->
  sexp.compile()