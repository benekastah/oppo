
class C.Keyword extends C.String
  compile: ->
    old_value = @value
    value = C.Macro.transform @value
    if value instanceof C.String
      @value = value.value
    else if value instanceof C.Symbol and (value.quoted or value.quasiquoted)
      @value = value.name
    else
      return "String(#{value._compile()})"

    result = super
    @value = old_value
    result

  compile_quoted: ->
    t_v = C.Macro.transform @value
    c_v = t_v.compile_quoted()
    "new lemur.Compiler.Keyword(#{c_v}, #{@line_number or "null"})"

  toOppoString: -> ":#{@value}"