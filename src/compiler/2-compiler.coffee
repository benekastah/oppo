
parser ?= require './parser'
oppo = exports ? (global.oppo = {})
compiler = oppo.compiler ?= {}
modules = {}

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
  _compile = (sexp = null, top_level = false) ->
    corename = "oppo/core"
    from_core = modules[corename]
    
    if top_level and from_core?
      prefix = for varname in from_core.names
        compile [(to_symbol "var"), (to_symbol varname), [(to_symbol '.'), (to_symbol corename), (to_quoted to_symbol varname)]]
      prefix.unshift compile [(to_symbol 'require'), (to_symbol corename)]
    
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
    
    if top_level
      vars = Scope.end_final()
      vars = if vars.length then "var #{vars.join ', '};\n" else ''
      prefix = if prefix? then "#{prefix.join ',\n'}\n" else ''
      ret = """
      #{vars}#{prefix}#{ret};
      """
    
    ret
  
  compile = (sexp) ->
    _compile sexp, false
    
  oppo.compile = (sexp) ->
    _compile sexp, true
    
oppo.eval = _.compose (_.bind global.eval, global), compile

read_compile = _.compose compile, oppo.read