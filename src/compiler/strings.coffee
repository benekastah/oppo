compiler.str = (strs...) ->
  first_is_str = null
  
  if strs.length is 0
    strs.push ""
  
  c_strs = _.map strs, (s) ->
    if (is_quoted s) and is_symbol s[1]
      s = to_js_symbol s[1][1]
    c_s = compile s
    first_is_str ?= is_string c_s
    c_s
    
  initial_str = if first_is_str then '' else '"" + '
  "#{initial_str}#{c_strs.join ' + '}"
  
compiler.keyword = (key) ->
  if (is_quoted key) and (is_symbol (e_key = oppo.eval key))
    compile e_key[1]
  else if _.isString key
    compile key
  else
    compile [(to_symbol 'str'), key]