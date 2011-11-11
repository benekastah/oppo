
oppo.module "compiler", ["module"], ({require_group}) ->
  self = this

  self.CompileError = class CompileError extends Error
    constructor: (@message) ->
    name: "CompileError"
  
  group = null
  get_group = -> group ?= require_group self.name
   
  self.globals = []
    
  self.compile = compile = (s_expr, top_level) ->
    self = get_group()
    ret = if typeof s_expr is "string"
      if /^".*"$/.test s_expr
        self.core.string s_expr
      else
        self.core.identifier s_expr
    else
      [fn, args...] = s_expr
      [first] = args
      switch fn
        when "string"
          self.core.string first
        when "identifier"
          self.core.identifier first
        when "do"
          self.core.do args
        when "quote"
          self.core.quote first
        when "defmacro"
          self.macro.defmacro args
        when "infix"
          self.core.infix first
        else
          # It is an ordinary function call
          self.core.funcall s_expr
    
    if top_level
      globals = if self.globals.length
        "var #{self.globals.join ', '};\n"
      else
        ''
      """
      (function () {
        #{globals}#{ret}
      }).call(this);
      """
    else ret
    
  self