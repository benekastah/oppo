
class C.Macro extends C.Construct
  constructor: ({name, @argnames, @template, transform, @invoke}, yy) ->
    @name = new C.Var name
    @template
    scope = C.current_scope()
    @name._compile() # Compile name so that it can be set properly
    scope.set_var @name, this
    if transform?
      @transform = transform
    super null, yy
    
  compile: ->
    "null"
    
  invoke: (args...) ->
    x = @transform args...
    x.compile()
    
  transform: (args...) ->
    c_template = for t in @template
      tt = C.Macro.transform t
      new C.Raw tt._compile()
    grp = new C.CommaGroup c_template, @yy
    sym_ls = C.Var.gensym "ls"

    fn = new C.Lambda {
      body: [
        (new C.Var.Set _var: sym_ls, value: grp)
        new C.Raw "#{sym_ls._compile()}.quoted = true"
        sym_ls
      ]
      args: @argnames
    }, @yy

    args = for arg in args
      arg = C.Macro.transform arg
      arg.was_quoted = arg.quoted
      arg.quoted = yes
      arg

    ls = new C.List [fn, args...], @yy
    c_template = ls.compile()
    for arg in args
      arg.quoted = arg.was_quoted
      delete arg.was_quoted

    if not __oppo_runtime_defined__? or not __oppo_runtime_defined__
      c_template = "#{compile_runtime()};#{c_template}"

    transformed = eval c_template
    [transformed] = oppoize transformed
    transformed.quoted = false if transformed instanceof C.List
    transformed


  @can_transform: (item) -> item? and item.transform?

  # Transform this macro into non-macro oppo code
  @transform: (code, levels=Infinity) ->
    [code] = (oppoize code)
    if levels > 0
      if code instanceof C.ReturnedConstruct
        code = code.value

      if code instanceof C.List and not (code.quoted or code.quasiquoted)
        callable = @transform code.items[0]
        if callable instanceof C.Symbol
          item = C.get_var_val callable
          if @can_transform item
            transformed = item.transform code.items[1..]...
            levels -= 1
        if callable instanceof C.Keyword
          s_get_prop = new C.Symbol "get-prop"
          transformed = new C.List [s_get_prop, code.items...]

      if not transformed and (code not instanceof C.Macro) and (@can_transform code)
        transformed = code.transform()
      
      if transformed? and transformed isnt code
        @transform transformed, levels
      else
        code
    else
      code