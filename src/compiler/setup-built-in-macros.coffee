
macro = (name, fn) ->
  s_name = new types.Symbol name
  m = new types.Macro s_name, null, null, null, fn
  m.builtin = true
  m.compile()
  m
  
call_macro = (name, args...) ->
  scope = last scope_stack
  c_name = to_js_identifier name
  scope[c_name].invoke args...

macro "def", (to_define, rest...) ->
  if not rest.length
    to_define.error "Def", "You must provide a value."

  if to_define instanceof types.List
    name = to_define.value[0]
    args = to_define.value.slice 1
    body = rest
    fn = new types.Function name, args, body, to_define
    c_name = name.compile()
    c_value = fn.compile()
  else if to_define instanceof types.Symbol
    name = to_define
    value = rest[0]
    c_name = name.compile()
    c_value = value.compile()
  else
    to_define.error "Def", "Invalid definition."
  
  scope = last scope_stack
  if scope[c_name]?
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

macro_do = macro "do", ->
  c_items = compile_list arguments
  "(#{c_items.join ', '})"
  
macro "quote", (x) ->
  x.quoted = true
  x.compile()
  
macro "raise", (namespace, error) ->
  if arguments.length is 1
    error = namespace
    c_namespace = "Error"
  else
    c_namespace = namespace.compile()
    
  c_error = error.compile()
  
  """
  (function () {
    throw new oppo.Error(#{c_namespace}, #{c_error});
  })()
  """

macro "assert", (sexp) ->
  c_sexp = sexp.compile()
  
  error_namespace = new types.String "Assertion-Error"
  error = new types.String sexp.toString()
  raise_call = call_macro "raise", error_namespace, error
  """
  (#{c_sexp} || #{raise_call})
  """
  
macro "js-eval", (js_code) ->
  js_code
  
macro_if = macro "if", ->
  
macro_let = macro "let", ->
