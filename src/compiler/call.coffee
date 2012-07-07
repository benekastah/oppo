
class C.Call extends C.FunctionCall
  compile: ->
    val = C.get_var_val @fn
    if val instanceof C.Macro
      for arg in @args then arg.quoted = true
      val.invoke(@args...)
    else
      super