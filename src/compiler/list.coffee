
class C.List extends C.Array
  compile: ->
    call_macro "call", @value...

  compile_quoted: ->
    sym_js_eval = new C.Symbol "js-eval"
    items = for item in @items
      item.quoted = true unless item.unquoted
      new C.List [sym_js_eval, new C.String item._compile()]
    (new C.Array items).compile()

  toString: ->
    s_value = for item in @value
      oppo.stringify item
      
    prefix = if @quoted
      "'"
    else if @quasiquoted
      "`"
    else if @unquoted
      "~"
    else if @unquote_spliced
      "..."
    else
      ""

    "#{prefix}(#{s_value.join ' '})"