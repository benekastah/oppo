
class C.Macro extends C.Construct
  constructor: ({name, @argnames, @template, transform, @invoke, @oppo_fn}, yy) ->
    @name = new C.Var name
    scope = C.current_scope()
    scope.set_var @name, this
    if transform?
      @transform = transform
    super null, yy
    
  compile: ->
    "null"
    
  invoke: ->
    
  transform: ->

  @can_transform: (item) -> item? and item.transform? and !item.builtin

    # Transform this macro into non-macro oppo code
    # Leave in builtin macros unchanged, since they compile straight to javascript
  @transform: (code) ->
    if code instanceof C.ReturnedConstruct
      code = code.value

    if code instanceof C.List
      callable = code.items[0]
      if callable instanceof C.Symbol
        item = C.get_var_val callable
        if @can_transform item
          transformed = item.transform code.items[1..]...

    if not transformed and @can_transform code
      transformed = code.transform()
    
    if transformed? and transformed isnt code
      @transform transformed
    else
      code