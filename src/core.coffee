
root = global ? window  
root.oppo =
  root: root
  modules: {}


class OppoCompileError extends Error
  constructor: (message, @form) ->
    @line_number = @form and @form.line_number
    if @line_number
      message = "at line #{@line_number}: #{message}"
    @message = message


oppo.JavaScriptCode = class JavaScriptCode
  constructor: (@text) ->


oppo.JavaScriptComment = class JavaScriptComment


oppo.Symbol = class Symbol
  constructor: (text, base_symbol) ->
    @text = "#{text}"
    @line_number = base_symbol?.line_number ? reader.line_number

  toString: -> oppo.helpers.get_symbol_text this


oppo.Splat = class Splat

array_toString = Object::toString
array_concat = Array::concat
oppo.helpers =
  to_type: (o) -> (s = array_toString.call o).substring(8, s.length - 1).toLowerCase()

  clone: Object.create ? (o) ->
    class Noop
    Noop:: = o
    new Noop

  merge: (first_o = {}, objs...) ->
    for o in objs
      o ?= {}
      for own k, v of o
        if !first_o.hasOwnProperty k
          first_o[k] = v
    first_o

  to_oppo_string: (x) ->
    {to_oppo_string, to_type} = oppo.helpers
    type = to_type x

    quoted = x?.quoted

    string = if not x?
      "#nil"
    else if type is "boolean"
      "##{x}"
    else if x instanceof oppo.Symbol
      x.text
    else if type is "array"
      items = (to_oppo_string item for item in x)
      quoted = yes
      "(#{items.join ' '})"
    else if type is "object"
      items = ("#{k} #{to_oppo_string v}" for k, v of x)
      "{ #{items.join '\n  '} }"
    else if type is "string"
      "\"#{x}\""
    else if type is "function"
      "#<Function #{x.name or '__anonymous__'}>"
    else
      if x.toString?
        x.toString()
      else
        "#{x}"

    if quoted
      string = "'#{string}"
    string

  first_item_matches: (x, sym) ->
    c_sym = get_symbol_text sym, yes
    if (to_type x) is "array"
      [fst] = x
      if is_symbol fst
        c_fst = get_symbol_text fst
        c_fst is c_sym
      else
        no
    else
      no

  # Include the fns that come after here
  symbol: (text, base_symbol) ->
    if text instanceof Symbol
      text
    else
      new Symbol text, base_symbol

  get_symbol: (sym) ->
    {to_type} = oppo.helpers
    type = to_type sym
    if (is_symbol sym) and type is "array"
      if is_quoted sym
        get_symbol sym[1]
      else
        sym[1]
    else if type is "string"
      (symbol sym)
    else if sym instanceof Symbol
      sym
    else
      throw new Error "Can't get symbol from non-symbol #{sym}"

  get_symbol_text: (sym, resolve_module = false) ->
    {get_symbol, text_to_js_identifier} = oppo.helpers
    sym = get_symbol sym
    if sym instanceof Symbol
      text_to_js_identifier sym.text
    else
      throw new OppoCompileError "Can't get symbol text from non-symbol #{sym}", sym

  concat: (base, items...) -> array_concat.apply base, items

  gensym: do ->
    gensym_id_map = {}
    gensym = (name = "gen") ->
      {symbol} = oppo.helpers
      id = gensym_id_map[name]
      if not id?
        id = gensym_id_map[name] = 0
      ret = symbol "#{name}_#{id}__"
      gensym_id_map[name] += 1
      ret

  get_module: do ->
    module_splitter = null
    get_module = (sym) ->
      {text_to_js_identifier, get_symbol_text, symbol} = oppo.helpers
      module_splitter ?= text_to_js_identifier '::'
      s_sym = get_symbol_text sym, false
      a_sym = s_sym.split module_splitter
      switch a_sym.length
        when 1
          [s_sym] = a_sym
        when 2
          [module, s_sym] = a_sym
        else
          throw new OppoCompileError "Can't define more than one module for symbol #{s_sym}", sym
      [module, (symbol s_sym, sym)]

  is_symbol: (x, recurse = 1) ->
    {to_type, is_symbol} = oppo.helpers
    x instanceof Symbol or
    (recurse and (to_type x) is "array" and is_symbol (oppo.compile_list x, no), recurse - 1)

  is_quoted: (x, recurse = 2) ->
    {to_type, is_quoted} = oppo.helpers
    x?.quoted or
    (recurse and (to_type x) is "array" and first_item_matches x, "quote")

  is_quasiquoted: (x, recurse = 2) ->
    {to_type, is_quasiquoted} = oppo.helpers
    x?.quasiquoted or
    (recurse and (to_type x) is "array" and first_item_matches x, "quasiquote")

  is_unquoted: (x, recurse = 2) ->
    {to_type, is_unquoted} = oppo.helpers
    x?.unquoted or
    (recurse and (to_type x) is "array" and first_item_matches x, "unquote")

  is_unquote_spliced: (x, recurse = 2) ->
    {to_type, is_unquote_spliced} = oppo.helpers
    x?.unquote_spliced or
    (recurse and (to_type x) is "array" and first_item_matches x, "unquote-splicing")

if module?.exports?
  module.exports = oppo