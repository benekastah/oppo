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

  DEFMACRO 'lambda', (args, body...) ->
    scope = Scope.make_new()
    [args, argsbody] = get_args args
    body = argsbody.concat body
      
    body = _.map body, compile
    vars = Scope.end_current()
    
    var_stmt = if vars.length then "var #{vars.join ', '};\n" else ''
    ret = """
    (function (#{args.join ", "}) {
      #{var_stmt}return #{body.join ', '};
    })
    """
  
  DEFMACRO 'fn', compiler.lambda
  
DEFMACRO 'call', (fn, args...) ->
  c_fn = compile fn
  c_args = _.map args, compile
  "#{c_fn}(#{c_args.join ', '})"
  
DEFMACRO 'apply', (fn, args...) ->
  c_fn = compile fn
  spl_fn = c_fn.split '.'
  spl_fn.pop()
  fn_base = spl_fn.join '.'
  c_args = _.map args, compile
  "#{c_fn}.apply(#{fn_base or null}, [].concat(#{c_args.join ', '}))"
  
DEFMACRO 'let', (names_vals, body...) ->
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
  
DEFMACRO 'new', (cls, args...) ->
  c_cls = compile cls
  c_args = _.map args, compile
  "new #{c_cls}(#{c_args.join ', '})"
  
DEFMACRO 'defn', (name, args, body...) ->
  compile [(to_symbol 'def'), name, [(to_symbol 'lambda'), args, body...]]
  
DEFMACRO 'curry', (fn, args...) ->
  if (_.isArray fn) and (get_raw_text fn[0]) is '.'
    base = fn[0..]
    base.pop()
    if base.length is 2
      base = base[1]
  else
    base = null
    
  ret = compile [(to_symbol "bind"), fn, base, args...]
    