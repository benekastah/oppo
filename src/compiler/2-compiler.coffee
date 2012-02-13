
parser ?= require './parser'
oppo = exports ? (global.oppo = {})
compiler = oppo.compiler ?= {}

DEFMACRO = (name, fn) ->
  c_name = compile to_symbol name
  Scope.def c_name, "macro", "global"
  compiler[c_name] = fn
  
GETMACRO = (name) ->
  c_name = compile to_symbol name
  compiler[c_name]

###
READ, EVAL, COMPILE
###
read = oppo.read = (string) ->
  # trimmed = trim.call string
  # string = "nil" if trimmed is ''
  parser.parse string

compile = null
do ->
  _compile = (sexp = null, top_level = false, with_oppo_core = false) ->
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
      if (Scope.type fn) is "macro"
        macro = compiler[fn]
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
    
    if top_level
      vars = Scope.end_final()
      if vars.length
        ret = """
        var #{vars.join ', '};
        #{ret};
        """
    
    ret
  
  compile = (sexp) ->
    _compile sexp, false
    
  oppo.compile = (sexp) ->
    _compile sexp, true
    
oppo.eval = _.compose (_.bind global.eval, global), compile

read_compile = _.compose compile, oppo.read