
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
      for _var in vars
        helpers.Var.track new helpers.Var _var...
      args = []
    else
      args = args.map (arg) -> compile arg
      
    args
      
  self.lambda = (args=[], body...) ->
    args = get_args args
    
    Var = helpers.Var
    Var.new_set()
    
    for item, i in body
      if item instanceof helpers.Var
        Var.track item
      else
        body = (body.slice i).map (item) -> compile item
        break
    
    vars = Var.grab()
    vars = if vars.length then (vars.join '\n  ') + '\n' else ''
    """
    (function (#{args.join ', '}) {
      #{vars}return #{body.join ',\n    '};
    })
    """
    
  self.infix = (call) ->
    compile [call.shift(), call.shift()].reverse().concat call
    
  self.apply = (fn, args...) ->
    args.reduceRight (a, b) -> a.unshift b; a
    compile [fn, args...]
   
  # Add items to runtime
  
    
  self