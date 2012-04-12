read = oppo.read = oppo.compiler.read = ->
  parser.parse arguments...

# This function should only be used once as the main entry point to the compilation process for a file.
# This should never be used internally by the compiler.
compile = oppo.compile = oppo.compiler.compile = (sexp) ->
  push_scope()
  sexp.compile()