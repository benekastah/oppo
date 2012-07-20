
class C.List extends C.Array
  compile: ->
    call_macro "call", @value...

  compile_quoted: ->
    sym_js_eval = new C.Symbol "js-eval"
    items = for item in @items
      item.quoted = true unless (@quasiquoted and item.unquoted)
      new C.List [sym_js_eval, new C.String item._compile()]
    
    ret = new C.Array items
    ret.compile()

  compile_quasiquoted: ->
    value = @compile_quoted arguments...
    ls = "new lemur.Compiler.List(#{value}, #{@line_number})"
    ls = new C.Raw ls, @yy
    sym_ls = C.Var.gensym "ls"
    grp = new C.CommaGroup [
      (new C.Var.Set _var: sym_ls, value: ls)
      new C.Raw "#{sym_ls.compile()}.quoted = true"
      sym_ls
    ]
    grp.compile()

  toOppoString: ->
    s_value = for item in @value
      oppo.stringify item
      
    prefix = if @quoted
      "'"
    else if @quasiquoted
      "`"
    else if @unquoted
      ","
    else if @unquote_spliced
      ",@"
    else
      ""

    "#{prefix}(#{s_value.join ' '})"

  transform: ->
    if not (@quoted or @quasiquoted or @unquote_spliced)
      call_macro_transform "call", @value...