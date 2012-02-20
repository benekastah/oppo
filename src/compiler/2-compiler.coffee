
parser ?= require './parser'
oppo = exports ? (global.oppo = {})
compiler = oppo.compiler ?= {}
modules = {}

oppo.DEFMACRO = DEFMACRO = (name, fn) ->
  c_name = compile to_symbol name
  Scope.blind_set c_name, "macro", "global"
  compiler[c_name] = fn
  
oppo.GETMACRO = GETMACRO = (name) ->
  c_name = compile to_symbol name
  compiler[c_name]

DEFITEMS = {}
oppo.DEF = DEF = (name, value, required) ->
  s_name = to_symbol name
  c_name = compile s_name
  
  ret = DEFITEMS[c_name] = ->
    ret = []
    if required?
      for item in required
        result = use_deffed (compile to_symbol item)
        if result?
          ret.push result
    ret.push compile [(to_symbol "def"), s_name, [(to_symbol 'js-eval'), value]]
    ret.join ',\n'
    
  ret.complete = false
  ret
  
use_deffed = (name) ->
  if (item = DEFITEMS[name]?) and item.complete is false
    fn = DEFITEMS[ret]
    fn.complete = true
    fn()
  

###
READ, EVAL, COMPILE
###
read = oppo.read = (string) ->
  # trimmed = trim.call string
  # string = "nil" if trimmed is ''
  parser.parse string

compile = null
do ->
  prefix = null
  _compile = (sexp = null, top_level = false) ->
    if top_level
      prefix = []
    
    if sexp in [null, true, false] or _.isNumber sexp
      ret = "#{sexp}"
    else if is_symbol sexp
      raw_text = sexp[1]
      ret = to_js_symbol raw_text
      deffed = use_deffed ret
      if deffed? then prefix.push deffed
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
      _prefix = if prefix?.length then "#{prefix.join ',\n'};\n" else ''
      ret = """
      #{vars}#{_prefix}#{ret};
      """
      prefix = null
      for own name, item of DEFITEMS
        item.completed = false
    
    ret
  
  oppo._compile = compile = (sexp) ->
    _compile sexp, false
    
  oppo.compile = (sexp) ->
    _compile sexp, true
    
oppo.eval = _.compose (_.bind global.eval, global), compile

read_compile = _.compose compile, oppo.read