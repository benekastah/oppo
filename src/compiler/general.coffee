DEFMACRO 'eval', (sexp) ->
  c_sexp = compile sexp
  "eval(oppo.compile(#{c_sexp}))"

DEFMACRO 'quote', (sexp) ->
  sexp = quote_escape sexp
  ret = if not sexp?
    null
  if _.isBoolean sexp
    sexp
  else if (is_symbol sexp)
    compile to_list sexp
  else if _.isArray sexp
    q_sexp = _.map sexp, to_quoted
    compile to_list q_sexp
  else if _.isNumber sexp
    sexp
  else
    s_sexp = "#{sexp}"
    "\"#{s_sexp.replace /"/g, '\\"'}\""

DEFMACRO 'symbol', (sym) ->
  e_sym = eval compile [(to_symbol "str"), sym]
  compile (to_symbol e_sym)

DEFMACRO 'js-eval', (js) ->
  c_js = compile js
  if is_string c_js
    e_js = c_js.substr 1, c_js.length - 2
    e_js = e_js.replace /\\?"/g, '\\"'
    ret = eval "\"#{e_js}\""
  else
    ret = "eval(#{c_js})"

DEFMACRO 'do', (body...) ->
  compiled_body = _.map arguments, compile
  ret = compiled_body.join ',\n'
  "(#{ret})"

DEFMACRO 'if', (test, t, f) ->
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

DEFMACRO 'regex', (body, modifiers) -> "/#{body}/#{modifiers ? ''}"

DEFMACRO 'undefined?', (x) ->
  c_x = compile x
  "(typeof #{c_x} === 'undefined')"

DEFMACRO 'defined?', (x) ->
  c_x = compile x
  "(typeof #{c_x} !== 'undefined')"


###
MODULES
###
do ->
  def = null
  defmacro = null
  set = null
  
  adjust_environment = (module_name, self_name) ->
    def = GETMACRO 'def'
    DEFMACRO 'def', (name, value) ->
      _name = if is_symbol name
        [(to_symbol "."), self_name, [(to_symbol 'quote'), name]]
      else
        name
        
      def _name, value
      
    defmacro = GETMACRO 'defmacro'
    DEFMACRO 'defmacro', (name, rest...) ->
      _name = if is_symbol name
        [(to_symbol "."), module_name, [(to_symbol 'quote'), name]]
      else
        name
        
      defmacro name, rest...
      
    set = GETMACRO 'set!'
    DEFMACRO 'set!', (name, value) ->
      if _.isEqual name, self_name
        throw "Can't redefine 'self' in a module."
      else
        set name, value
  
  restore_environment = ->
    DEFMACRO 'def', def
    DEFMACRO 'defmacro', defmacro
    DEFMACRO 'set!', set
    def = defmacro = set = null
  
  DEFMACRO 'defmodule', (name, deps=[], body...) ->
    scope = Scope.make_new()
    r_name = compile get_raw_text name
    r_deps = _.map deps, _.compose compile, get_raw_text
    c_deps = compile [(to_symbol "quote"), r_deps]
    args = _.map deps, compile
    
    self_name = to_symbol "self"
    define_self = compile [(to_symbol "var"), self_name, [(to_symbol 'js-eval'), 'this']]
    adjust_environment name, self_name
    # All the body must be compiled after this point
    
    body = if body.length then body else [null]
    c_body = compile [(to_symbol 'do'), body...]
    
    # No compiling after this point
    current_var_group = get_keys scope
    var_smt = "var #{current_var_group.join ', '};"
    
    Scope.end_current()
    restore_environment()
    
    ret = """
    oppo.module(#{r_name}, #{c_deps}, function (#{args.join ', '}) {
      #{var_smt}
      with (#{define_self}) {
        return #{c_body};
      }
    })
    """
  
  DEFMACRO 'require', (names...) ->
    c_names = for name in names
      r_name = get_raw_text name
      "oppo.module.require(#{compile r_name})"
    c_names.join ',\n'

###
VARIABLES
###
DEFMACRO 'gensym', ->
  sym = gensym arguments...
  ret = compile [(to_symbol 'quote'), (to_symbol sym)]

DEFMACRO 'var', (name, value) ->
  c_name = compile name
  c_value = compile value
  Scope.def c_name, "variable"
  "#{c_name} = #{c_value}"
  
DEFMACRO 'def', (name, value) ->
  _var = GETMACRO 'var'
  first_group = Scope.top()
  c_name = compile name
  if c_name is (to_js_symbol c_name)
    ret = _var name, value, first_group
  else
    raise "DefError", "Can't define complex symbol: #{c_name}"

DEFMACRO 'set!', (name, value) ->
  c_name = compile name
  c_value = compile value
  if c_name is (to_js_symbol c_name)
    Scope.set c_name, "variable"
    ret = "#{c_name} = #{c_value}"
  else
    raise "SetError", "Can't set complex symbol: #{c_name}"

###
MATH
###
math_fn = (fn, symbol) ->
  DEFMACRO fn, (nums...) ->
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
  DEFMACRO fn, (nums...) ->
    c_nums = _.map nums, compile
    ret = c_nums.join " #{symbol or fn} "
    "(#{ret})"

binary_fn "||"
binary_fn "&&"

###
COMPARISONS
###
compare_fn = (fn, symbol) ->
  DEFMACRO fn, (items...) ->
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
DEFMACRO 'throw', (err) ->
  c_err = compile err
  "(function () { throw #{c_err} })()"