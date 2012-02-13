
parser ?= require './parser'
oppo = exports ? (global.oppo = {})
compiler = oppo.compiler ?= {}

DEFMACRO = (name, fn) ->
  c_name = compile name
  Scope.def name, "macro", Scope.global()
  compiler[c_name] = fn
  
GETMACRO = (name) ->
  c_name = compile name
  compiler[c_name]

###
READ, EVAL, COMPILE
###
read = oppo.read = (string) ->
  # trimmed = trim.call string
  # string = "nil" if trimmed is ''
  parser.parse string

began = false
oppo.compile = (sexp = null, with_oppo_core) ->
  if not began
    top_level = began = true
  
  if sexp in [null, true, false] or _.isNumber sexp
    ret = "#{sexp}"
  else if is_symbol sexp
    ret = to_js_symbol sexp[1]
  else if _.isString sexp
    ret = "\"#{sexp.replace /\n/g, '\\n'}\""
  else if _.isFunction sexp
    ret = "#{sexp}"
  else if _.isArray sexp
    fn = compile _.first sexp
    args = sexp[1..]
    if (macro = compiler[fn])
      ret = macro args...
    else
      ret = compiler.call [(to_symbol "js-eval"), fn], args...
  else
    raiseParseError sexp
    
  if with_oppo_core isnt false
    corename = "oppo/core"
    ret = """
    with (oppo.module.require('#{corename}')) {
      #{ret}
    }
    """
    
  if top_level or not began
    began = false
    vars = end_final_scope()
    if vars.length
      ret = """
      var #{vars.join ', '};
      #{ret};
      """
    
  ret
  
compile = (sexp) ->
  oppo.compile sexp, false
    
oppo.eval = _.compose (_.bind global.eval, global), compile

read_compile = _.compose compile, oppo.read