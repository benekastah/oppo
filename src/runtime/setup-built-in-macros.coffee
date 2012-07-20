###
HELPERS
###

defmacro = (name, fn, builtin=true) ->
  s_name = new C.Symbol name
  macro_args = name: s_name
  if builtin
    macro_args.invoke = fn
  else
    macro_args.transform = fn
  m = new C.Macro macro_args
  m.builtin = builtin
  m._compile()
  m
  
call_macro = (name, args...) ->
  to_call = C.get_var_val (new C.Symbol name)
  if to_call.invoke?
    to_call.invoke args...
  else
    ret = to_call.transform args...
    ret.compile()

call_macro_transform = (name, args...) ->
  to_call = C.get_var_val (new C.Symbol name)
  to_call.transform args...


setup_built_in_macros = ->
  ###
  JAVASCRIPT BUILTINS
  ###
  defmacro "regex", (pattern, modifiers) ->
    new C.Regex {pattern: pattern.value, modifiers: modifiers.value}, pattern.yy
  , false

  defmacro "js-eval", (js_code) ->
    if js_code instanceof C.String
      js_code.value
    else if js_code instanceof C.Number
      js_code._compile()
    else if (js_code instanceof C.Symbol) and js_code.quoted
      js_code.name
    else
      "oppo.root.eval(#{js_code._compile()})"

  defmacro "if", (cond, tbranch, fbranch) ->
    _if = new C.If {
      condition: cond
      then: tbranch
      _else: fbranch
    }
  , false

  defmacro "lambda", (args, body...) ->
    fn = new C.Lambda {args: args.value, body}
  , false

  defmacro "array", (items...) ->
    ary = new C.Array items
  , false

  defmacro "js-for", (a, b, c, body...) ->
    _for = new C.ForLoop condition: [a, b, c], body: body
  , false

  defmacro "foreach", (coll, body...) ->
    foreach = new C.ForEachLoop collection: coll, body: body
  , false

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
  defmacro "keyword", (keyword) ->
    if keyword instanceof C.Symbol
      new C.String keyword.value, keyword.yy
    else if keyword instanceof C.String
      k
  , false


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
  , false
  
  defmacro "apply", (callable, args...) ->
    if args.length > 1
      c_args = for arg in args then arg._compile()
      c_args = "[].concat(#{c_args.join ', '})"
      args = [new C.Raw c_args]

    args.unshift new C.Null()
    args = for arg in args then arg._compile()
    c_callable = callable._compile()
    if not callable instanceof C.Symbol
      c_callable = "(c_callable)"
    "#{c_callable}.apply(#{args.join ', '})"

  defmacro "call", (callable, args...) ->
    if callable instanceof C.Symbol
      item = C.get_var_val callable
      if item instanceof C.Macro
        if item.invoke?
          return new C.Raw item.invoke args...
        else
          return item.transform args...
    fcall = new C.FunctionCall {fn: callable, args}, callable.yy
  , false

  defmacro "defmacro", (argnames, template...) ->
    name = argnames.items.shift()
    mac = new C.Macro {name, argnames, template}
    new C.Raw mac.compile()
  , false

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
        new_bindings.push new C.List [def_sym, sym, item]
        
    new_body = [new_bindings..., body...]
    (new C.List [new C.Lambda body: new_body]).compile()

  macro_do = defmacro "do", ->
    c_items = for arg in arguments then arg._compile()
    "(#{c_items.join ',\n'})"
    


  ###
  QUOTING
  ###
    
  defmacro "quote", (x) ->
    x.quoted = true
    x
  , false

  defmacro "quasiquote", (x) ->
    x.quasiquoted = true
    x
  , false
    
  defmacro "unquote", (x) ->
    x.unquoted = true
    x
  , false
    
  defmacro "unquote-splicing", (x) ->
    x.unquote_spliced = true
    x
  , false
    


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
    "new oppo.Error(#{c_namespace}, #{c_error}).raise()"

  defmacro "try", (sexp...) ->
    _finally = sexp.pop()
    if _finally not instanceof C.List or _finally.items[0]?.name isnt "finally"
      sexp.push _finally
      _finally = new C.List []

    _catch = sexp.pop()
    if _catch not instanceof C.List or _catch.items[0]?.name isnt "catch"
      sexp.push _catch
      _catch = new C.List []

    body = sexp
    [__, catch_err, catch_body...] = _catch.items
    [__, finally_body...] = _finally.items

    new C.TryCatch _try: body, err_name: catch_err, _catch: catch_body, _finally: finally_body
  , false

  defmacro "assert", (sexp) ->
    c_sexp = sexp._compile()
    
    error_namespace = new C.String "Assertion-Error"
    error = new C.String (oppo.stringify sexp)
    raise_call = call_macro "raise", error_namespace, error
    """
    (#{c_sexp} || #{raise_call})
    """