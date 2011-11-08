
oppo.module "lang.core", ["compiler"], (compiler) ->
  self = {}
  
  compiler.register 'do', 'function', ((_, _0) -> _0 is 'do'), (do_block, compile) ->
    body = for stmt in do_block
      compile stmt
    body.push "return #{body.pop()}"
    
    "(function () {
      #{body.join ';\n'}
    })()"
    
  compiler.register_greedy 'function call', 'function', (_, _0) -> 
    typeof _0 is "string" and not (/^".*"$/.test _0)
  , (funcall, compile) ->
    fn = funcall.shift()
    "#{fn}( #{funcall.join ', '} )"