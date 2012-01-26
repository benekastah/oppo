compiler.js_map = (sexp...) ->
  sym = gensym "obj"
  add_ons = []
  item_added = false
  ret = "{ "
  for item, i in sexp
    if i % 2 is 0
      if (is_quoted item) and is_symbol (e_key = oppo.eval item)
        ret += "#{compile e_key} : "
      else if (_.isString item) or (is_keyword item)
        ret += "#{compile item} : "
      else if (_.isNumber item) and not (_.isNaN item)
        ret += "\"#{compile item}\" : "
      else
        item_added = true
        add_ons.push "#{sym}[#{compile item}] = "
    else
      c_value = compile item
      if not item_added
        ret += "#{c_value},\n"
      else
        item_added = false
        last = add_ons.pop()
        last += c_value
        add_ons.push last
        
  ret = ret.replace /(\s|,\s)$/, ' }'
  if not add_ons.length
    ret
  else
    add_ons = _.map add_ons, (x) -> [(to_symbol "js-eval"), x]
    add_ons.unshift (to_symbol "do")
    add_ons.push ["symbol", sym]
    ret = """
    (function (#{sym}) {
      return #{compile add_ons};
    })(#{ret})
    """
    
## Member access
compiler[to_js_symbol "."] = (base, names...) ->
  c_base = compile base
  ret = c_base
  for name in names
    e_name = null
    if is_quoted name
      e_name = oppo.eval name
    if e_name? and is_symbol e_name
      ret += ".#{compile e_name}"
    else
      ret += "[#{compile name}]"
  ret