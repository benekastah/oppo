
class C.Lambda extends C.Function
  constructor: (config, yy) ->
    {@arity} = config
    config.autoreturn = true
    super config, yy

  compile: ->
    body = @body
    @body = for item in body then C.Macro.transform item
    result = super
    @body = body
    result