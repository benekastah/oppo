quote_all = (list) ->
  _quote = (item) -> [(to_symbol 'quote'), item]
  ret = _quote _.map list, (item) ->
    if (_.isArray item) and not is_symbol item
      quote_all item
    else
      _quote item

mc_expand = false
mc_expand_1 = false
compiler.defmacro = (name, argnames=[], template...) ->
  c_name = compile name
  objectSet compiler, c_name, (args...) ->
    q_args = quote_all args
    js = oppo.compile [[['symbol', 'lambda'], argnames, template...], q_args[1]...]
    evald = eval js
    if not mc_expand and not mc_expand_1
      oppo.compile evald
    else
      mc_expand_1 = false
      evald
      
  "/* defmacro #{c_name} */ null"
    
compiler.macroexpand = (sexp) ->
  old_mc_expand = mc_expand
  mc_expand = true
  ret = compile sexp
  ret = compile quote_all ret
  mc_expand = old_mc_expand
  ret
  
compiler.macroexpand_1 = (sexp) ->
  mc_expand_1 = true
  ret = compile sexp
  ret = compile quote_all ret
  mc_expand_1 = false
  ret
    
compiler.syntax_quote = (list) ->
  sym = to_symbol
  ident = gensym 'list'
  restructured_list = restructure_list list, ident
  restructured_list[1] = [(sym 'js-eval'), restructured_list[1]]
  q_list = quote_all list
  
  code = [
    [(sym 'lambda'), [(sym ident)],
      [(sym "var"), restructured_list...]]
    q_list
  ]
  
  ret = compile code