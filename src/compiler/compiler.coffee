read = oppo.read = oppo.compiler.read = ->
  parser.parse arguments...

# This function should only be used once as the main entry point to the compilation process for a file.
# This should never be used internally by the compiler.
compiler_scope = null
compile = oppo.compile = oppo.compiler.compile = (sexp) ->
  INDENT = ""
  compiler_scope = push_scope()
  sexp.top_level = true
  compiled = sexp.compile()
  pop_scope()
  compiled