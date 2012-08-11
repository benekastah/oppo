
class C.List extends C.Array
  compile: ->
    call_macro "call", @value...

  to_transform: ["quote", "quasiquote", "unquote", "unquote-splicing"]
  transform_child: (child) ->
    if child instanceof C.List and not (child.quoted or child.quasiquoted)
      [fst] = child.items
      if fst instanceof C.Symbol and not (child.quoted or child.quasiquoted)
        if fst.name in @to_transform
          return C.Macro.transform child, 1
    child

  should_quote_child: (child) ->
    child instanceof C.List or
    child instanceof C.Keyword or
    (child not instanceof C.Atom and
    child not instanceof C.String and
    child not instanceof C.Number and
    child not instanceof C.Regex and
    child not instanceof C.Array)

  should_quasiquote_child: (child) ->
    @quasiquoted and
    not (child.unquoted or child.unquote_spliced) and
    (@is_macro_template or @should_quote_child(child))

  compile_quoted: ->
    current_group = []
    arrays = []
    spliced = []
    for item in @items
      item = @transform_child item
      if @quasiquoted
        item.quasiquoted ?= @should_quasiquote_child item
      else
        item.quoted ?= @should_quote_child item
      
      if item.unquote_spliced
        arrays.push new C.Array current_group
        spliced.push item
        current_group = []
      else
        current_group.push item

    if current_group and arrays.length
      arrays.push new C.Array current_group
      spliced.push null
      current_group = []
    
    if not arrays.length
      ret = new C.Array current_group
    else
      while (arrays.length)
        array = arrays.pop()
        arg = spliced.pop()
        args = []
        if arg?
          args.push arg
        if last_result?
          args.push last_result

        if array instanceof C.Array and not array.items.length and args.length
          arg = args.shift()
          array = arg

        args = for arg in args then arg._compile()

        array_has_length = array not instanceof C.Array or array.items.length
        result = if array_has_length and args.length
          "#{array._compile()}.concat(#{args.join ', '})"
        else if array_has_length
          array._compile()

        if result
          last_result = new C.Raw result
      ret = last_result ? new C.Array []

    ret.compile()

  compile_quasiquoted: ->
    @compile_quoted()

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