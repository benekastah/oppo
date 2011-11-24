
oppo.module "compiler", ["module"], ({require_group}) ->
  self = this

  self.CompileError = class CompileError extends Error
    constructor: (@message) ->
    name: "CompileError"
   
  self.globals = []
    
  self.compile = compile = (s_expr) ->
    ret = if typeof s_expr is "string"
      
      # Strings and identifiers
      if self.helpers.is_string s_expr
        self.core.string s_expr
      else if self.helpers.is_identifier s_expr
        self.core.identifier s_expr
      else
        s_expr
        
    else if s_expr instanceof Array and s_expr.length > 0
      [fn, args...] = s_expr
      [first] = args
      switch fn
        
        # General
        when "program"
          self.core.program first, args
        when "do"
          self.core.do args
        when "module"
          self.core.module args...
        when "quote"
          self.core.quote first
        when "syntax-quote"
          self.macro.syntax_quote first
        when "defmacro"
          self.macro.defmacro args...
        when "eval"
          compile ["oppo.eval", args...]
        when "if"
          self.core.if args...
        
        # Working with variables
        when "def"
          self.core.def args...
        when "defg"
          self.core.defg args...
        when "set!"
          self.core.set args...
        when "setg!"
          self.core.setg args...
        when "let"
          self.core.let args
        
        # Data types
        when "keyword"
          self.types.keyword first
          
        # Javascript interop
        when "."
          self.core.member_access args...
        when "js-eval"
          args.join ",\n"
        # when "throw"
        #   self.core.throw args...
          
        # Functions
        when "infix"
          self.function.infix first
        when "lambda"
          self.function.lambda args...
        else
          # It is an ordinary function call
          self.function.call s_expr...
    else
      # Catch all
      if s_expr instanceof Array
        "null"
      else
        self.helpers.stringify.to_js s_expr
    
    # Return compiled value
    ret
    
  self