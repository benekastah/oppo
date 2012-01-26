
parser ?= require './parser'
oppo = exports ? (global.oppo = {})
compiler = oppo.compiler ?= {}

###
READER, EVAL, COMPILE
###
read = oppo.read = (string) ->
  # trimmed = trim.call string
  # string = "nil" if trimmed is ''
  parser.parse string

began = false
compile = oppo.compile = (sexp = null, init_vars = false) ->
  # if init_vars
  #   initialize_var_groups()
  #   init_vars = false
  
  if not began
    top_level = began = true
  
  if sexp in [null, true, false] or _.isNumber sexp
    ret = "#{sexp}"
  else if is_symbol sexp
    ret = to_js_symbol sexp[1]
  else if _.isString sexp
    ret = "\"#{sexp.replace /\n/g, '\\n'}\""
  else if _.isArray sexp
    fn = oppo.compile _.first sexp
    args = sexp[1..]
    if (macro = compiler[fn])
      ret = macro args...
    else
      ret = compiler.call [(to_symbol "js-eval"), fn], args...
  else
    raiseParseError sexp
    
  if top_level or not began
    began = false
    vars = end_final_var_group()
    if vars.length
      ret = """
      var #{vars.join ', '};
      #{ret};
      """
    
  ret
    
oppo.eval = _.compose (_.bind global.eval, global), oppo.compile

read_compile = _.compose oppo.compile, oppo.read