
oppo.module "compiler.function", ["compiler", "compiler.macro", "compiler.helpers"], ({compile}, macro, helpers) ->
  self = this

  self.call = (fn, s_exp...) ->
    loop
      fn = compile fn
      if fn not instanceof Array then break
    # Try to run it as a macro. If that fails, call it as a normal function
    try
      mc = macro.call fn, s_exp
      compile mc
    catch e
      args = for arg in s_exp
        compile arg
      "#{fn}(#{args.join ', '})"
      
  get_args = (args) ->
    destructure = false
    for arg in args
      if helpers.is_splat arg
        destructure = true
        break
    
    if (destructure)
      vars = helpers.destructure_list args, "arguments"
      vars = vars.map (item) -> new helpers.Var item...
      args = []
    else
      vars = []
      args = args.map (arg) -> compile arg
      
    {vars, args}
      
  self.lambda = (args=[], body...) ->
    {vars, args} = get_args args
    
    for item, i in body
      if item instanceof helpers.Var
        vars.push item
      else
        body = (body.slice i).map (item) -> compile item
        break
    
    vars = if vars.length then (vars.join '\n  ') + '\n' else ''
    """
    (function (#{args.join ', '}) {
      #{vars}return #{body.join ',\n  '};
    })
    """
    
  self.infix = (call) ->
    compile [call.shift(), call.shift()].reverse().concat call
    
  self.apply = (fn, args...) ->
    args.reduceRight (a, b) -> a.unshift b; a
    compile [fn, args...]
   
  # Add items to runtime
  
    
  self