
class C.Lambda extends C.Function
  constructor: (config, yy) ->
    {@arity} = config
    config.autoreturn = true
    super config, yy

  compile: ->
    to_return = @body?.pop()
    if to_return
      to_return = C.Macro.transform to_return
      @body.push to_return
    super