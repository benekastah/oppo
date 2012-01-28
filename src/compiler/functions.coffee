do ->
  get_args = (args=[]) ->
    if args is "null"
      args = []
    
    destructure = _.any args, is_splat
  
    if (destructure)
      vars = destructure_list args, "arguments"
      args = []
      body = []
      (body.push read "(var #{_var[0]} (js-eval \"#{_var[1]}\"))") for _var in vars
    else
      args = args.map (arg) -> compile arg
      body = []
    
    [args or [], body or []]

  compiler.lambda = (args, body...) ->
    new_var_group()
    [args, argsbody] = get_args args
    body = argsbody.concat body
      
    body = _.map body, compile
    vars = end_var_group()
    var_stmt = if vars.length then "var #{vars.join ', '};\n" else ''
    ret = """
    (function (#{args.join ", "}) {
      #{var_stmt}return #{body.join ', '};
    })
    """
  
  compiler.fn = compiler.lambda
  
compiler.call = (fn, args...) ->
  c_fn = compile fn
  c_args = _.map args, compile
  "#{c_fn}(#{c_args.join ', '})"
  
compiler.apply = (fn, args...) ->
  c_fn = compile fn
  spl_fn = c_fn.split '.'
  spl_fn.pop()
  fn_base = spl_fn.join '.'
  c_args = _.map args, compile
  "#{c_fn}.apply(#{fn_base or null}, [].concat(#{c_args.join ', '}))"
  
compiler[to_js_symbol 'let'] = (names_vals, body...) ->
  vars = []
  i = 0
  len = names_vals.length
  while i < len
    vars.push [(to_symbol "var"), names_vals[i++], names_vals[i++]]
    
  body = vars.concat body
  let_fn = [(to_symbol "lambda"), [], body...]
            
  ret = """
  #{compile let_fn}.apply(this, typeof arguments !== "undefined" ? arguments : [])
  """
  
compiler[to_js_symbol 'new'] = (cls, args...) ->
  c_cls = compile cls
  c_args = _.map args, compile
  "new #{c_cls}(#{c_args.join ', '})"