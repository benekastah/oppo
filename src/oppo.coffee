
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
  c_name = compile name
  c_value = compile value
  raiseDefError c_name if c_name in current_group
  current_group.push c_name
  "#{c_name} = #{c_value}"
  
compiler.def = (name, value) ->
  _var = compiler[to_js_symbol 'var']
  first_group = first_var_group()
  c_name = compile name
  if c_name is to_js_symbol c_name
    ret = _var name, value, first_group
  else
    c_value = compile value
    err = read_compile "(throw \"Can't define variable that is already defined: #{c_name}\")"
    ret = """
    /* def #{c_name} */
    (typeof #{c_name} === 'undefined' ?
      (#{c_name} = #{c_value}) :
      #{err})
    /* end def #{c_name} */
    """
  
compiler[to_js_symbol 'set!'] = (name, value) ->
  c_name = compile name
  c_value = compile value
  err = read_compile "(throw \"Can't set variable that has not been defined: #{c_name}\")"
  ret = """
  /* set! #{c_name} */
  (typeof #{c_name} !== 'undefined' ?
    (#{c_name} = #{c_value}) :
    #{err})
  /* end set! #{c_name} */
  """

compiler.js_eval = (js) ->
  compiled = compile js
  ret = eval compiled

compiler[to_js_symbol 'do'] = (body...) ->
  compiled_body = _.map arguments, compile
  ret = compiled_body.join ',\n'
  "(#{ret})"

compiler[to_js_symbol 'if'] = (test, t, f) ->
  if arguments.length is 2
    Array::push.call arguments, f
  [c_test, c_t, c_f] = _.map arguments, compile
  """
  /* if */
  (#{c_test} ?
    #{c_t} :
    #{c_f})
  /* end if */
  """
    
compiler.js_map = (sexp...) ->
  sym = gensym "obj"
  add_ons = []
  item_added = false
  ret = "{ "
  for item, i in sexp
    if i % 2 is 0
      if (is_quoted item) and is_symbol (e_key = oppo.eval item)
        ret += "#{compile e_key} : "
      else if (_.isString item) or (is_keyword item)
        ret += "#{compile item} : "
      else if (_.isNumber item) and not (_.isNaN item)
        ret += "\"#{compile item}\" : "
      else
        item_added = true
        add_ons.push "#{sym}[#{compile item}] = "
    else
      c_value = compile item
      if not item_added
        ret += "#{c_value},\n"
      else
        item_added = false
        last = add_ons.pop()
        last += c_value
        add_ons.push last
        
  ret = ret.replace /(\s|,\s)$/, ' }'
  if not add_ons.length
    ret
  else
    add_ons = _.map add_ons, (x) -> [(to_symbol "js-eval"), x]
    add_ons.unshift (to_symbol "do")
    add_ons.push ["symbol", sym]
    """
    (function (#{sym}) {
      return #{compile add_ons};
    })(#{ret})
    """
       
compiler.quote = (sexp) ->
  sexp = quote_escape sexp
  if _.isArray sexp
    q_sexp = _.map sexp, compile
    ret = "[#{q_sexp.join ', '}]"
  else if _.isNumber sexp
    ret = sexp
  else
    s_sexp = "#{sexp}"
    ret = "\"#{s_sexp.replace /"/g, '\\"'}\""

compiler[to_js_symbol "."] = (base, names...) ->
  c_base = compile base
  ret = c_base
  for name in names
    e_name = null
    if is_quoted name
      e_name = oppo.eval name
    if e_name? and is_symbol e_name
      ret += ".#{compile e_name}"
    else
      ret += "[#{compile name}]"
  ret
  
compiler.keyword = (key) -> compile key[1]

compiler.regex = (body, modifiers) -> "/#{body}/#{modifiers ? ''}"

# compiler.str = (strs...) -> 
#   c_strs = _.map strs, compile
#   "'' + #{c_strs.join ' + '}"

###
MATH
###
math_fn = (fn, symbol) ->
  compiler[to_js_symbol fn] = (nums...) ->
    c_nums = _.map nums, compile
    c_nums.join " #{symbol or fn} "
    
math_fn "+"
math_fn "-"
math_fn "*"
math_fn "/"
math_fn "%"

###
BINARY
###
binary_fn = math_fn
binary_fn "||"
binary_fn "&&"

###
COMPARISONS
###
compare_fn = (fn, symbol) ->
  compiler[to_js_symbol fn] = (items...) ->
    c_items = _.map items, compile
    ret = []
    last = c_items[0]
    for item in c_items[1..]
      ret.push "#{last} #{symbol or fn} #{item}"
      last = item
    ret.join " && "
    
compare_fn "<"
compare_fn ">"
compare_fn "<="
compare_fn ">="
compare_fn "=="
compare_fn "not==", "!="
compare_fn "==="
compare_fn "not===", "!=="

###
ERRORS
###
compiler[to_js_symbol 'throw'] = (err) ->
  c_err = compile err
  "(function () { throw #{c_err} })()"

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
  body = argsbody.concat body
      
  body = _.map body, compile
  vars = end_var_group()
  var_stmt = if vars.length then "var #{vars.join ', '};\n" else ''
  ret = """
  (function (#{args.join ", "}) {
    #{var_stmt}return #{body.join ', '};
  })
  """
  
compile.fn = compiler.lambda
  
compiler.call = (fn, args...) ->
  c_fn = compile fn
  c_args = _.map args, compile
  "#{c_fn}(#{c_args.join ', '})"
  
compiler[to_js_symbol 'let'] = (names_vals, body...) ->
  vars = []
  i = 0
  while i < names_vals.length
    vars.push [(to_symbol "var"), names_vals[i++], names_vals[i++]]
    
  body = vars.concat body
  ret = compile [[(to_symbol "lambda"), [], body...]]

###
MACROS
###
quote_all = (list) ->
  _quote = (item) -> [(to_symbol 'quote'), item]
  ret = _quote _.map list, (item) ->
    if (_.isArray item) and not is_symbol item
      quote_all item
    else
      _quote item

mc_expand = false
mc_expand_1 = false
compiler.defmacro = (name, argnames, template) ->
  c_name = compile name
  objectSet compiler, c_name, (args...) ->
    q_args = quote_all args
    js = oppo.compile [[['symbol', 'lambda'], argnames, template], q_args[1]...]
    evald = eval js
    if not mc_expand and not mc_expand_1
      oppo.compile evald
    else
      mc_expand_1 = false
      evald
      
  "/* defmacro #{c_name} */ null"
    
compiler.macroexpand = (sexp) ->
  old_mc_expand = mc_expand
  mc_expand = true
  ret = compile sexp
  ret = compile quote_all ret
  mc_expand = old_mc_expand
  ret
  
compiler.macroexpand_1 = (sexp) ->
  mc_expand_1 = true
  ret = compile sexp
  ret = compile quote_all ret
  mc_expand_1 = false
  ret
    
    
compiler.syntax_quote = (list) ->
  sym = to_symbol
  ident = gensym 'list'
  restructured_list = restructure_list list, ident
  restructured_list[1] = [(sym 'js-eval'), restructured_list[1]]
  q_list = quote_all list
  
  code = [
    [(sym 'lambda'), [(sym ident)],
      [(sym "var"), restructured_list...]]
    q_list
  ]
  
  ret = compile code