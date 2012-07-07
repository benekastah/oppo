
class C.List extends C.Array
  compile: ->
    unless @quoted
      (new C.Call {fn: @items[0], args: @items.slice 1}).compile()
    else
      super