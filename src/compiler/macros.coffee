do ->
  mc_expand = false
  mc_expand_1 = false
  
  DEFMACRO 'defmacro', (name, argnames=[], template...) ->
    c_name = compile name
    c_value = """
    (function () {
      return eval(oppo.compiler.#{c_name}.apply(this, arguments));
    })
    """
    Scope.def c_name, "macro"
    
    compiler[c_name] = ->
      q_args = _.map arguments, to_quoted
      sexp = [[(to_symbol 'lambda'), argnames].concat(template)].concat(q_args)
      js = compile sexp
      evald = eval js
      if not mc_expand and not mc_expand_1
        compile evald
      else
        mc_expand_1 = false
        evald
        
    "#{c_name} = #{c_value}"
    
  DEFMACRO 'macroexpand', (sexp) ->
    old_mc_expand = mc_expand
    mc_expand = true
    ret = compile sexp
    ret = compile to_quoted ret
    mc_expand = old_mc_expand
    ret
  
  DEFMACRO 'macroexpand-1', (sexp) ->
    mc_expand_1 = true
    ret = compile sexp
    ret = compile to_quoted ret
    mc_expand_1 = false
    ret
    
  DEFMACRO 'syntax-quote', (list) ->
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