compiler.quote = (sexp) ->
  sexp = quote_escape sexp
  if not sexp?
    null
  if _.isBoolean sexp
    sexp
  else if _.isArray sexp
    q_sexp = _.map sexp, compile
    ret = "[#{q_sexp.join ', '}]"
  else if _.isNumber sexp
    ret = sexp
  else
    s_sexp = "#{sexp}"
    ret = "\"#{s_sexp.replace /"/g, '\\"'}\""

compiler.symbol = (sym) ->
  e_sym = eval compile [(to_symbol "str"), sym]
  compile (to_symbol e_sym)

compiler.js_eval = (js) ->
  c_js = compile js
  if is_string c_js
    e_js = c_js.substr 1, c_js.length - 2
    e_js = e_js.replace /\\?"/g, '\\"'
    ret = eval "\"#{e_js}\""
  else
    ret = "eval(#{c_js})"

compiler[to_js_symbol 'do'] = (body...) ->
  compiled_body = _.map arguments, compile
  ret = compiled_body.join ',\n'
  "(#{ret})"

compiler[to_js_symbol 'if'] = (test, t, f) ->
  if arguments.length is 2
    Array::push.call arguments, f
  [c_test, c_t, c_f] = _.map arguments, compile
  sym = gensym "cond"
  cond = compile [(to_symbol 'var'), (to_symbol sym), test]
  """
  /* if */ ((#{cond}) !== false && #{sym} !== null && #{sym} !== '' ?
    #{compile t} :
    #{compile f})
  /* end if */
  """

compiler.regex = (body, modifiers) -> "/#{body}/#{modifiers ? ''}"

compiler[to_js_symbol 'undefined?'] = (x) ->
  c_x = compile x
  "(typeof #{c_x} === 'undefined')"

compiler[to_js_symbol 'defined?'] = (x) ->
  c_x = compile x
  "(typeof #{c_x} !== 'undefined')"


###
MODULES
###
do ->
  def = null
  make_module_def = (self_name) ->
    def = compiler.def
    compiler.def = (name, value) ->
      name = [(to_symbol "."), self_name, [(to_symbol 'quote'), name]]
      def name, value
    
  restore_normal_def = ->
    ret = compiler.def = def
    def = null
    ret
  
  compiler.defmodule = (name, deps=[], body...) ->
    new_var_group()
    r_name = compile get_raw_text name
    r_deps = _.map deps, _.compose compile, get_raw_text
    c_deps = compile [(to_symbol "quote"), r_deps]
    args = _.map deps, compile
    
    self_name = to_symbol "self"
    define_self = compile [(to_symbol "var"), self_name, [(to_symbol 'js-eval'), 'this']]
    make_module_def self_name
    
    body = if body.length then body else [null]
    c_body = compile [(to_symbol 'do'), body...]
    
    current_var_group = last_var_group()
    var_smt = "var #{current_var_group.join ', '};"
    
    # No compiling after this point
    end_var_group()
    restore_normal_def()
    
    ret = """
    oppo.module(#{r_name}, #{c_deps}, function (#{args.join ', '}) {
      #{var_smt}
      with (#{define_self}) {
        return #{c_body};
      }
    })
    """
  
  compiler.require = (names...) ->
    c_names = for name in names
      r_name = get_raw_text name
      "oppo.module.require(#{compile r_name})"
    c_names.join ',\n'

###
VARIABLES
###
compiler.gensym = ->
  sym = gensym arguments...
  ret = compile [(to_symbol 'quote'), (to_symbol sym)]

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
  if c_name is (to_js_symbol c_name)
    ret = _var name, value, first_group
  else
    c_value = compile value
    err = read_compile "(throw \"Can't define variable that is already defined: #{c_name}\")"
    ret = """
    /* def #{c_name} */ (typeof #{c_name} === 'undefined' ?
      (#{c_name} = #{c_value}) :
      #{err})
    /* end def #{c_name} */
    """

compiler[to_js_symbol 'set!'] = (name, value) ->
  c_name = compile name
  c_value = compile value
  err = read_compile "(throw \"Can't set variable that has not been defined: #{c_name}\")"
  ret = """
  /* set! #{c_name} */ (typeof #{c_name} !== 'undefined' ?
    (#{c_name} = #{c_value}) :
    #{err})
  /* end set! #{c_name} */
  """

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
binary_fn = (fn, symbol) ->
  compiler[to_js_symbol fn] = (nums...) ->
    c_nums = _.map nums, compile
    ret = c_nums.join " #{symbol or fn} "
    "(#{ret})"

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
    "(#{ret})"

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