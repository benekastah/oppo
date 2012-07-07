
class C.Lambda extends C.Function
  constructor: (config, yy) ->
    {@arity} = config
    config.autoreturn = true
    super config, yy