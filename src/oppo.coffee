
parser ?= require './parser'
oppo = exports ? (global.oppo = {})
compiler = oppo.compiler ?= {}

###
READER, EVAL, COMPILE
###
read = oppo.read = (string) ->
  trimmed = trim.call string
  string = "nil" if trimmed is ''
  parser.parse string

began = false
compile = oppo.compile = (sexp=null) ->
  if not began
    top_level = began = true
  
  if sexp in [null, true, false] or _.isNumber sexp
    ret = "#{sexp}"
  else if is_symbol sexp
    ret = to_js_symbol sexp[1]
  else if _.isString sexp
    ret = "\"#{sexp}\""
  else if _.isArray sexp
    fn = oppo.compile _.first sexp
    if (macro = compiler[fn])
      args = sexp[1..]
      ret = macro args...
    else
      ret = compiler.call.apply null, sexp
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

###
MISC
###
compiler[to_js_symbol 'var'] = (name, value, current_group=last_var_group()) ->
  name = compile name
  value = compile value
  raiseDefError name if name in current_group
  current_group.push name
  "#{name} = #{value}"
  
compiler.def = (name, value) ->
  compiler[to_js_symbol 'var'] name, value, first_var_group()
  
compiler[to_js_symbol 'set!'] = (name, value) ->
  name = compile name
  value = compile value
  read_compile """
  (if (js-eval "typeof #{name} !== 'undefined'")
    (js-eval "#{name} =  #{value}")
    (throw "Can't set variable that has not been defined: #{name}"))
  """

compiler.js_eval = (js) -> js

compiler[to_js_symbol 'do'] = (body...) ->
  compiled_body = _.map arguments, compile
  ret = compiled_body.join ',\n'
  "(#{ret})"

compiler[to_js_symbol 'if'] = (test, t, f) ->
  if arguments.length is 2
    Array::push.call arguments, f
  [c_test, c_t, c_f] = _.map arguments, compile
  """
  (/* if */ #{c_test} ?
    /* then */ #{c_t} :
    /* else */ #{c_f})
  """
    
compiler.js_map = (sexp...) ->
  ret = "{ "
  for item, i in sexp
    if i % 2 is 0
      c_key = compile item
      ret += "#{c_key} : "
    else
      c_value = compile item
      ret += "#{c_value},\n"
  ret.replace /,\n$/, ' }'
    
compiler.quote = (sexp) ->
  if _.isArray sexp
    q_sexp = _.map sexp, compiler.quote
    "[#{q_sexp.join ', '}]"
  else
    "\"#{sexp}\"".replace(/^""/, '"\\"').replace /""$/, '\\""'
    
compiler.eval = -> compiler.call 'oppo.eval', arguments...

compiler[to_js_symbol "."] = (base, names...) ->
  c_base = compile base
  c_names = _.map names, compile
  c_names.unshift c_base
  c_names.join "."

###
ERRORS
###
compiler[to_js_symbol 'throw'] = (err) ->
  c_err = compile err
  "!function () { throw #{c_err} }()"

###
FUNCTIONS
###
get_args = (args) ->
  destructure = _.any args, is_splat
  
  if (destructure)
    vars = destructure_list args, "arguments"
    args = []
    body = []
    (body.push read "(var #{_var[0]} (js-eval \"#{_var[1]}\"))") for _var in vars
  else
    args = args.map (arg) -> compile arg
    body = []
    
  [args, body]

compiler.lambda = (args, body...) ->
  new_var_group()
  [args, argsbody] = get_args args
  body = _.map [argsbody..., body...], compile
  vars = end_var_group()
  var_stmt = if vars.length then "var #{vars.join ', '};\n" else ''
  """
  (function (#{args.join ", "}) {
    #{var_stmt}return #{body.join ', '};
  })
  """
  
compiler.call = (fn, args...) ->
  c_fn = compile fn
  c_args = _.map args, compile
  "#{c_fn}(#{c_args.join ', '})"

###
MACROS
###
compiler.defmacro = (name, argnames, template) ->
  c_name = compile name
  objectSet compiler, c_name, (args...) ->
    js = oppo.compile [[['symbol', 'lambda'], argnames, template], args...]
    evald = eval js
    oppo.compile evald
  "/* defmacro #{c_name} */ null"
    
compiler.syntax_quote = (sexpr) ->
  for item, i in sexpr
    if is_splat item
      splat = compile item[1]
      a1 = compile [["symbol", "quote"], sexpr[...i]]
      a2 = splat
      a3 = compile [["symbol", "quote"], sexpr[i+1..]]
      sexpr = ""
      i--
    else if is_unquote item
      sexpr[i] = eval item[1]
    else if _.isArray item
      sexpr[i] = compiler.syntaxQuote item
    
# compiler.unquote = (item, syntax_quote) ->
#   if not syntax_quote
#     raise TypeError, "Cannot unquote item outside of a syntax quote"
#   oppo.compile item
# 
# compiler.unquote_splice = (item, syntax_quote) ->
#   if not syntax_quote
#     raise TypeError, "Cannot unquote-splice item outside of a syntax quote"
#   oppo.compile item
#   
# compiler.splat = (item, syntax_quote) ->
#   if not syntax_quote
#     raise TypeError, "Cannot unquote-splice item outside of a syntax quote"
#   oppo.compile item