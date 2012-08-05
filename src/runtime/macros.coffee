###
HELPERS
###

defmacro = (name, fn) ->
  s_name = new C.Symbol name
  macro_args = name: s_name
  macro_args.transform = fn
  m = new C.Macro macro_args
  m._compile()
  m
  
call_macro = (name, args...) ->
  to_call = C.get_var_val (new C.Symbol name)
  ret = to_call.transform args...
  ret._compile()

call_macro_transform = (name, args...) ->
  to_call = C.get_var_val (new C.Symbol name)
  to_call.transform args...


setup_built_in_macros = ->
  ###
  JAVASCRIPT BUILTINS
  ###
  defmacro "regex", (pattern, modifiers) ->
    pattern = C.Macro.transform pattern
    modifiers = C.Macro.transform modifiers
    new C.Regex {pattern: pattern, modifiers: modifiers}, pattern.yy

  defmacro "js-eval", (js_code) ->
    js_code = C.Macro.transform js_code
    if js_code instanceof C.String
      new C.Raw js_code.value
    else if js_code instanceof C.Number
      new C.Raw js_code._compile()
    else if (js_code instanceof C.Symbol) and js_code.quoted
      new C.Raw js_code.name
    else
      new C.Raw "oppo.root.eval(#{js_code._compile()})"

  defmacro "if", (cond, tbranch, fbranch) ->
    _if = new C.IfTernary {
      condition: cond
      then: tbranch
      _else: fbranch
    }

  defmacro "cond", (cond, body, others...) ->
    if others.length % 2 isnt 0
      throw new Error "`cond` requires an even number of arguments."

    if_config =
      condition: cond
      then: body

    if others.length
      if_config._else = new C.List [new C.Symbol("cond"), others...]

    _if = new C.IfTernary if_config

  defmacro "lambda", (args, body...) ->
    fn = new C.Lambda {args: args.value, body}

  defmacro "array", (items...) ->
    ary = new C.Array items

  defmacro "object", (kvpairs...) ->
    obj = new C.OppoObject kvpairs

  defmacro "get-prop", (o, ps...) ->
    c_o = o._compile()
    c = "#{c_o}"
    for p in ps
      p = C.Macro.transform p
      sym = p instanceof C.Symbol and (p.quoted or p.quasiquoted)
      if sym
        p.quoted = p.quasiquoted = no
      c_p = p._compile()
      if sym
        c = "#{c}.#{c_p}"
      else
        c = "#{c}[#{c_p}]"
    new C.Raw c

  defmacro "get-fn", (p, o, args...) ->
    s_get_prop = new C.Symbol "get-prop"
    s_quote = new C.Symbol "quote"
    q_p = new C.List [s_quote, p]
    fn = new C.List [s_get_prop, o, q_p]
    new C.List [fn, args...]

  defmacro "new", (cls, args...) ->
    new C.FunctionCall fn: cls, args: args, instantiate: true

  defmacro "js-for", (a, b, c, body...) ->
    _for = new C.ForLoop condition: [a, b, c], body: body

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

      new C.Raw results.join ' '
      
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
  operator_macro "not", "Not"

  operator_macro "or", "Or"
  operator_macro "and", "And"

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
    if keyword instanceof C.Symbol and (keyword.quoted or keyword.quasiquoted)
      new C.String keyword.value, keyword.yy
    else if keyword instanceof C.String
      keyword
    else
      new C.Raw "String(#{keyword._compile()})"

  defmacro "symbol->keyword", (s) ->
    new C.String s.value, s.yy

  defmacro "include", (files...) ->
    if process?.title isnt 'node'
      throw new Error "Cannot include file when compiling without file system access."
    fs = require 'fs'
    path = require 'path'

    {include_directory} = C.current_context
    expressions = []
    for f in files
      fname = String (eval f._compile())
      # Test for absolute path
      if C.current_context.include_directory? and not /^(\/|[a-z]:\\)/i.test fname
        fname = path.join C.current_context.include_directory, fname

      if C.current_context.cached_includes[fname]
        continue
      else
        C.current_context.cached_includes[fname] = true

      C.current_context.include_directory = path.dirname fname
      text = fs.readFileSync fname, "utf8"
      code = oppo.read text
      fragment = new C.CodeFragment code.s_expression_list
      expressions.push fragment._compile()
      C.current_context.include_directory = include_directory

    new C.Raw expressions.join ';\n'

  defmacro "symbol", (sym) ->
    if sym instanceof C.Symbol and (sym.quoted or sym.quasiquoted)
      sym.quoted = true
      sym
    else if sym instanceof C.String
      new_sym = new C.Symbol sym.value, sym.yy
      new_sym.quoted = true
      new_sym
    else
      c_sym = sym._compile()
      new C.Raw "new lemur.Compiler.Symbol(#{c_sym}, #{sym.line_number})"

  defmacro "def", (to_define, rest...) ->
    if not rest.length
      to_define.error "Def", "You must provide a value."
    
    scope = C.current_scope()
    if to_define instanceof C.List
      name = to_define.value[0]
      args = to_define.value.slice 1
      body = rest
      value = new C.Lambda {args, body, name, quiet_name: true}
    else if to_define instanceof C.Symbol
      name = to_define
      value = rest[0]
    else
      to_define.error "Def", "Invalid definition."
    
    name = new C.Var name
    set_ = new C.Var.Set {_var: name, value}
  
  defmacro "apply", (callable, args...) ->
    if args.length > 1
      c_args = for arg in args then arg._compile()
      last_arg = c_args.pop()
      c_args = "[#{c_args.join ', '}].concat(#{last_arg})"
      args = [new C.Raw c_args]

    args.unshift new C.Null()
    args = for arg in args then arg._compile()
    c_callable = callable._compile()
    if not callable instanceof C.Symbol
      c_callable = "(c_callable)"
    new C.Raw "#{c_callable}.apply(#{args.join ', '})"

  defmacro "call", (callable, args...) ->
    if callable instanceof C.Symbol
      item = C.get_var_val callable
      if item instanceof C.Macro
        if item.invoke?
          return new C.Raw item.invoke args...
        else
          return item.transform args...
    fcall = new C.FunctionCall {fn: callable, args}, callable.yy

  defmacro "defmacro", (argnames, template...) ->
    name = argnames.items.shift()
    mac = new C.Macro {name, argnames, template}
    new C.Raw mac.compile()

  defmacro "let", (bindings, body...) ->
    new C.Let {bindings, body}

  macro_do = defmacro "do", (items...) ->
    new C.CommaGroup items, items[0].yy
    


  ###
  QUOTING
  ###
    
  defmacro "quote", (x) ->
    x.quoted = true
    x

  defmacro "quasiquote", (x) ->
    x.quasiquoted = true
    x
    
  defmacro "unquote", (x) ->
    x.unquoted = true
    x
    
  defmacro "unquote-splicing", (x) ->
    x.unquote_spliced = true
    x
    


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
    new C.Raw "new oppo.Error(#{c_namespace}, #{c_error}).raise()"

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

    new C.TryCatchExpression _try: body, err_name: catch_err, _catch: catch_body, _finally: finally_body

  defmacro "assert", (sexp) ->
    c_sexp = sexp._compile()
    
    error_namespace = new C.String "Assertion-Error"
    error = new C.String (oppo.stringify sexp)
    raise_call = call_macro "raise", error_namespace, error
    new C.Raw """
    (#{c_sexp} || #{raise_call})
    """