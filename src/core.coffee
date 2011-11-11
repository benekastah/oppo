
oppo.module "compiler.core", ["compiler", "compiler.helpers", "compiler.macro"], ({compile}, helpers, macro) ->
  self = this
  
  self.identifier = helpers.identity
  
  self.string = helpers.identity
  
  self.do = (a) ->
    s.shift()
    body = for stmt in s
      compile stmt
      
    # make the last statement a return
    body.push "_return(#{body.pop()})"
    
    self.lambda null, body
    
  self.funcall = (s_exp) ->
    fn = s_exp.shift()
    mc = macro.macros[fn]
    if mc?
      compile mc s_exp
    else
      args = for arg in s_exp
        compile arg
      "#{compile fn}(#{args.join ', '})"
    
  self.quote = (code) ->
    if code instanceof Array
      code = code.map (item) -> compile item
    helpers.stringify.to_js code
    
  self.lambda = (args=[], body) ->
    args = args.map (arg) -> compile arg
    body = body.map (item) -> compile item
    "function (#{args.join ', '}) {
      return #{body.join ',\n'};
    }"
    
  self.def = (ident, val) ->
    ident = compile ident
    globals.push ident
    "#{ident} = #{compile val}"
    
  self.infix = (call) ->
    compile [call.shift(), call.shift()].reverse().concat call
    
  self