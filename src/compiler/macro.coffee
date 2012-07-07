
class C.Macro extends C.Construct
  constructor: ({@name, @argnames, @template, @invoke, @oppo_fn}, yy) ->
    super null, yy
    
  compile_unquoted: ->
    c_name = @name.compile()
    scope = last scope_stack
    scope[c_name] = this
    compile_to = @oppo_fn?.compile?() ? "#{@oppo_fn}" ? "null"
    "#{c_name} = #{compile_to}"
    
  invoke: ->
    
  transform: ->
    # Transform this macro into non-macro oppo code
    # Leave in builtin macros, since they only compile to plain javascript
    
    
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