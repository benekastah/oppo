
class C.Macro extends C.Construct
  constructor: ({name, @argnames, @template, @invoke, @oppo_fn}, yy) ->
    @name = new C.Var name
    scope = C.current_scope()
    scope.set_var @name, this
    super null, yy
    
  compile: ->

    "null"
    
  invoke: ->
    
  transform: ->
    # Transform this macro into non-macro oppo code
    # Leave in builtin macros unchanged, since they compile straight to javascript
    
    
  @transform: (code) ->
    if code instanceof C.List
      if code.quoted
        return @transform code
      else
        callable = code.value[0]
        if callable instanceof C.Symbol
          c_callable = C.Symbol.compile_non_strict callable
          scope = last scope_stack
          item = scope[c_callable]
          if item instanceof C.Macro and not item.builtin
            return item.transform code
    code