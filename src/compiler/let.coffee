
class C.Let extends C.FunctionCall
  constructor: ({@bindings, @body}) ->
    super

  compile: ->
    def_sym = new C.Symbol 'def'
    sym = null
    new_bindings = []
    for item, i in @bindings.value
      if i % 2 is 0
        sym = item
      else
        if not item?
          @bindings.error "Must have even number of bindings."
        new_bindings.push new C.List [def_sym, sym, item]
        
    body = [new_bindings..., @body...]
    @cached_body = body
    @fn = new C.Lambda body: body
    super

  should_return: ->
    me = new C.ReturnedConstruct this
    body = @cached_body ? @body
    ret = C.Macro.transform body[body.length - 1]
    ret = ret.should_return()
    me.tail_node = (x) ->
      if not x
        ret
      else
        body[body.length - 1] = C.Macro.transform x
    me