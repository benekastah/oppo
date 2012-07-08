###
HELPERS
###

defmacro = (name, fn) ->
  s_name = new C.Symbol name
  m = new C.Macro name: s_name, invoke: fn
  m.builtin = true
  m._compile()
  m
  
call_macro = (name, args...) ->
  to_call = C.get_var_val (new C.Symbol name)
  to_call.invoke args...



setup_built_in_macros = ->
  ###
  JAVASCRIPT BUILTINS
  ###
    
  defmacro "js-eval", (js_code) ->
    if js_code instanceof C.String
      js_code.value
    else if js_code instanceof C.Number
      js_code._compile()
    else if (js_code instanceof C.Symbol) and js_code.quoted
      js_code.name
    else
      "window.eval(#{js_code._compile()})"

  defmacro "if", (cond, tbranch, fbranch) ->
    result = """
    (/* IF */ #{cond._compile()} ?
    /* THEN */ #{tbranch._compile()} :
    /* ELSE */ #{fbranch?.compile() ? "null"})
    """
    indent_down()
    result

  defmacro "lambda", (args, body...) ->
    fn = new C.Lambda {args: args.value, body}
    fn._compile()

  defmacro "js-for", (a, b, c, body...) ->
    _for = new C.ForLoop condition: [a, b, c], body: body
    _for._compile()

  defmacro "foreach", (coll, body...) ->
    foreach = new C.ForEachLoop collection: coll, body: body

  operator_macro = (name, className) ->
    macro_fn = (args...) ->
      Cls = C[className]
      prefix = (Cls::) instanceof C.PrefixOperation
      postfix = (Cls::) instanceof C.PostfixOperation
      results = while args.length
        x = args.shift()
        (if prefix or postfix
          new Cls x, x.yy
        else
          y = args.shift()
          new Cls [x, y], x.yy
        ).compile()

      results.join ' '
      
    defmacro name, macro_fn

  operator_macro "subtract", "Subtract"
  operator_macro "add", "Add"
  operator_macro "multiply", "Multiply"
  operator_macro "divide", "Divide"
  operator_macro "modulo", "Mod"

  operator_macro "==", "Eq2"
  operator_macro "===", "Eq3"
  operator_macro "gt", "GT"
  operator_macro "lt", "LT"
  operator_macro "gte", "GTE"
  operator_macro "lte", "LTE"
  operator_macro "not===", "NotEq3"
  operator_macro "not==", "NotEq2"
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

  defmacro "def", (to_define, rest...) ->
    if not rest.length
      to_define.error "Def", "You must provide a value."
    
    scope = C.current_scope()
    if to_define instanceof C.List
      name = to_define.value[0]
      args = to_define.value.slice 1
      body = rest
      value = new C.Lambda {name, args, body}
    else if to_define instanceof C.Symbol
      name = to_define
      value = rest[0]
    else
      to_define.error "Def", "Invalid definition."
    
    name = new C.Var name
    set_ = new C.Var.Set {_var: name, value}
    set_._compile()
    
  defmacro "call", (callable, args...) ->
    if callable instanceof C.Symbol
      item = C.get_var_val callable
      if item instanceof C.Macro
        return item.invoke args...
    fcall = new C.FunctionCall {fn: callable, args}, callable.yy
    fcall._compile()

  macro_let = defmacro "let", (bindings, body...) ->
    def_sym = new C.Symbol 'def'
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
    (new types.List [new types.Lambda body: new_body]).compile()

  macro_do = defmacro "do", ->
    c_items = compile_list arguments, null, true
    "(#{c_items.join ',\n'})"
    


  ###
  QUOTING
  ###
    
  defmacro "quote", (x) ->
    x.quoted = true
    x._compile()
    
  defmacro "quasiquote", (x) ->
    scope = last scope_stack
    current_group = []
    compiled = []
    push_group = ->
      if current_group.length
        compiled.push "[#{current_group.join ', '}]"
      current_group = []
      
    for item in x.value
      if item instanceof types.UnquoteSpliced
        c_item = "Array.prototype.slice.call(#{item._compile()})"
        push_group()
        compiled.push c_item
      else if item instanceof types.Unquoted
        current_group.push item._compile()
      else
        current_group.push (item._compile true)
        
    push_group()
    first = compiled.shift()
    if compiled.length
      "#{first}.concat(#{compiled.join ', '})"
    else
      first
    
  defmacro "unquote", (x) ->
    x._compile false
    
  defmacro "unquote-splicing", (x) ->
    x._compile false
    


  ###
  ERRORS & VALIDATIONS
  ###
    
  defmacro "raise", (namespace, error) ->
    if arguments.length is 1
      error = namespace
      c_namespace = "\"Error\""
    else
      c_namespace = namespace._compile()
      
    c_error = error._compile()
    
    """
    (function () {
    #{indent_up()}throw new oppo.Error(#{c_namespace}, #{c_error});
    #{indent_down()}})()
    """

  defmacro "assert", (sexp) ->
    c_sexp = sexp._compile()
    
    error_namespace = new types.String "Assertion-Error"
    error = new types.String sexp.toString()
    raise_call = call_macro "raise", error_namespace, error
    """
    (#{c_sexp} || #{raise_call})
    """