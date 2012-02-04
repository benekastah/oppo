do ->
  mc_expand = false
  mc_expand_1 = false
  compiler.defmacro = (name, argnames=[], template...) ->
    c_name = compile name
    objectSet compiler, c_name, (args...) ->
      q_args = _.map args, to_quoted
      sexp = [[(to_symbol 'lambda'), argnames, template...], q_args...]
      js = oppo.compile sexp
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
    ret = compile to_quoted ret
    mc_expand = old_mc_expand
    ret
  
  compiler.macroexpand_1 = (sexp) ->
    mc_expand_1 = true
    ret = compile sexp
    ret = compile to_quoted ret
    mc_expand_1 = false
    ret
    
  compiler.syntax_quote = (list) ->
    sym = to_symbol
    ident = gensym 'list'
    restructured_list = restructure_list list, ident
    restructured_list[1] = [(sym 'js-eval'), restructured_list[1]]
    q_list = to_quoted list
  
    code = [
      [(sym 'lambda'), [(sym ident)],
        [(sym "var"), restructured_list...]]
      q_list
    ]
  
    ret = compile code