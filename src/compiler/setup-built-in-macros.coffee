L = lemur
C = L.compiler

###
HELPERS
###

macro = (name, fn) ->
  s_name = new types.Symbol name
  s_name.must_exist = false
  m = new types.Macro s_name, null, null, null, fn
  m.builtin = true
  m.compile()
  m
  
call_macro = (name, args...) ->
  scope = last scope_stack
  c_name = to_js_identifier name
  scope[c_name].invoke args...





###
JAVASCRIPT BUILTINS
###
  
macro "js-eval", (js_code) ->
  js_code
  
macro_if = macro "if", (cond, tbranch, fbranch) ->
  result = """
  (/* IF */ #{cond.compile()} ?
  #{indent_up()}/* THEN */ #{tbranch.compile()} :
  #{INDENT}/* ELSE */ #{fbranch?.compile() ? "null"})
  """
  indent_down()
  result

macro "lambda", (args, body...) ->
  fn = new C.Function {args, body, autoreturn: true}
  fn.compile()

macro "js-for", (a, b, c, body...) ->
  _for = new C.ForLoop condition: [a, b, c], body: body
  _for.compile()

macro "foreach", (coll, body...) ->
  foreach = new C.ForEachLoop collection: coll, body: body

op_macro = (name, className, prefix, postfix) ->
  name = "js-#{name}"
  macro_fn = (args...) ->
    Cls = C[className]
    results = while args.length
      x = args.unshift()
      (if prefix or postfix
        new Cls x, x.yy
      else
        y = args.unshift()
        new Cls [x, y], x.yy
      ).compile()

    results.join ' '
    
  macro name, macro_fn

operator_macro "-", "Subtract"
operator_macro "+", "Add"
operator_macro "*", "Multiply"
operator_macro "/", "Divide"
operator_macro "%", "Mod"

operator_macro "==", "Eq2"
operator_macro "===", "Eq3"
operator_macro ">", "GT"
operator_macro "<", "LT"
operator_macro ">=", "GTE"
operator_macro "<=", "LTE"
operator_macro "!==", "NotEq3"
operator_macro "!=", "NotEq2"
operator_macro "!", "Not"

operator_macro "||", "Or"
operator_macro "&&", "And"

operator_macro "&", "BAnd"
operator_macro "|", "BOr"
operator_macro "^", "BXor"
operator_macro "<<", "BLeftShift"
operator_macro ">>", "BRightShift"
operator_macro ">>>", "BZeroFillRightShift"
operator_macro "~", "BNot"

operator_macro "delete", "Delete"



###
OPPO BUILTINS
###

macro "def", (to_define, rest...) ->
  if not rest.length
    to_define.error "Def", "You must provide a value."
  
  scope = compiler_scope
  token = {}
  if to_define instanceof types.List
    name = to_define.value[0]
    args = to_define.value.slice 1
    body = rest
    value = new types.Function name, args, body, to_define
  else if to_define instanceof types.Symbol
    name = to_define
    value = rest[0]
  else
    to_define.error "Def", "Invalid definition."
  
  name.must_exist = false
  c_name = name.compile()
  scope[c_name] = token unless scope[c_name]?
  c_value = value.compile()
  
  if scope[c_name] isnt token
    name.error "Def", "Cannot define previously defined value."
  else
    scope[c_name] = value
  
  "#{c_name} = #{c_value}"
  
macro "call", (callable, args...) ->
  to_call = callable.compile()
  if callable instanceof types.Symbol
    scope = last scope_stack
    item = scope[to_call]
    if item instanceof types.Macro
      return item.invoke args...
  
  # Make sure function literals are immediately callable
  if callable instanceof types.Function
    to_call = "(#{to_call})"
    
  c_args = compile_list args
    
  "#{to_call}(#{c_args.join ', '})"

macro_let = macro "let", (bindings, body...) ->
  def_sym = new types.Symbol 'def', null, bindings
  sym = null
  new_bindings = []
  for item, i in bindings.value
    if i % 2 is 0
      sym = item
    else
      if not item?
        bindings.error "Must have even number of bindings."
      new_bindings.push new types.List [def_sym, sym, item]
      
  new_body = [new_bindings..., body...]
  (new types.List [new types.Function null, null, new_body]).compile()

macro_do = macro "do", ->
  c_items = compile_list arguments
  "(#{c_items.join ',\n' + INDENT})"
  


###
QUOTING
###
  
macro "quote", (x) ->
  x.quoted = true
  x.compile()
  
macro "quasiquote", (x) ->
  scope = last scope_stack
  current_group = []
  compiled = []
  push_group = ->
    if current_group.length
      compiled.push "[#{current_group.join ', '}]"
    current_group = []
    
  for item in x.value
    if item instanceof types.UnquoteSpliced
      c_item = "Array.prototype.slice.call(#{item.compile()})"
      push_group()
      compiled.push c_item
    else if item instanceof types.Unquoted
      current_group.push item.compile()
    else
      current_group.push (item.compile true)
      
  push_group()
  first = compiled.shift()
  if compiled.length
    "#{first}.concat(#{compiled.join ', '})"
  else
    first
  
macro "unquote", (x) ->
  x.compile false
  
macro "unquote-splicing", (x) ->
  x.compile false
  


###
ERRORS & VALIDATIONS
###
  
macro "raise", (namespace, error) ->
  if arguments.length is 1
    error = namespace
    c_namespace = "\"Error\""
  else
    c_namespace = namespace.compile()
    
  c_error = error.compile()
  
  """
  (function () {
  #{indent_up()}throw new oppo.Error(#{c_namespace}, #{c_error});
  #{indent_down()}})()
  """

macro "assert", (sexp) ->
  c_sexp = sexp.compile()
  
  error_namespace = new types.String "Assertion-Error"
  error = new types.String sexp.toString()
  raise_call = call_macro "raise", error_namespace, error
  """
  (#{c_sexp} || #{raise_call})
  """