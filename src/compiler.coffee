
oppo.module "compiler", ["lang.core", "lang.arithmetic"], ->
  self = {}
  
  stringify = (x) ->
    if x instanceof Array
      contents = x.map stringify
      "(#{contents.join ' '})"
    else
      "#{x}"
  
  self.compilers = []
  self.greedy_compilers = []
  
  # Each module will register its own components through this function
  self.register = (name, type, test, action) ->
    self.compilers.push {name, type, test, action}
    
  self.register_greedy = (name, type, test, action) ->
    self.greedy_compilers.push {name, type, test, action}

  class self.CompileError extends Error
    constructor: (@message) ->
    name: "CompileError"
    type: "CompileError"
    
  run_compiler = (program, first, compiler) ->
    {name, test, action} = compiler
    if test program, first
      result = action program, self.compile
    
  self.compile = (program) ->
    compiled = false
    first = try program[0]
    
    if self.greedy_compilers.length
      self.compilers.push.apply self.greedy_compilers
      self.greedy_compilers = []
    
    console.log self.compilers
    
    # We have two classes of compilers.
    for compiler in self.compilers
      {name, test, action} = compiler
      if test program, first
        return action program, self.compile
      
    throw new self.CompileError "Unable to compile #{stringify program} because no compiler action recognized it."
    
  self