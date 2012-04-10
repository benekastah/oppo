
(->
  
  #---------------------------------------------------------------------------#
  
  class @SyntaxNode
    constructor: (@value, yy_or_node_or_num) ->
      if yy_or_node_or_num instanceof types.SyntaxNode
        @transfer_node = yy_or_node_or_num
        @yy = yy_or_node_or_num.yy
      else if (type_of yy_or_node_or_num) is "number"
        @yy = {
          lexer: {
            yylineno: yy_or_node_or_num
          }
        }
      else
        @yy = yy_or_node_or_num
        
      @line_number = @yy?.lexer.yylineno
      
    compile: (quoted) ->
      if not (@quoted or quoted)
        @compile_unquoted()
      else
        @compile_quoted()
      
    compile_unquoted: ->
      "#{@value}"
      
    compile_quoted: ->
      "new oppo.compiler.types.#{@constructor.name}('#{@value}')"
      
    location_trace: ->
      line_number = if @line_number then "@ line #{@line_number}" else ''
      file = if @file then " in #{@file}" else ''
      "#{line_number}#{file}"
      
    error_message: (type, msg) ->
      if arguments.length is 1
        msg = type
        
      msg ?= "An error occurred"
      msg.replace /\.$/, ''
        
      msg_prefix = "#{type ? @constructor.name}Error: "
      full_msg = "#{msg_prefix}#{msg}#{@location_trace()}."
      
    error: (type, msg) ->
      throw @error_message type, msg
      
    valueOf: -> @value
    
    toString: ->
      prefix = if @quoted then "'" else ""
      "#{prefix}#{@value.toString()}"
  
  #---------------------------------------------------------------------------#
  
  class @List extends @SyntaxNode
    compile_unquoted: ->
      scope = last scope_stack
      scope.call.call @value...

    compile_quoted: ->
      c_value = compile_list @value, true
      "[#{c_value.join ', '}]"
      
    toString: ->
      s_value = for item in @value
        item.toString()
      prefix = if @quoted then "'" else ""
      "#{prefix}(#{s_value.join ' '})"
        
  #---------------------------------------------------------------------------#
        
  class @Quoted extends @List
    constructor: (value, yy) ->
      super null, yy
      value.quoted = true
      @value = [new types.Symbol("quote", yy), value]
      @quoted_value = value
        
  #---------------------------------------------------------------------------#
        
  class @Object extends @List
  
  #---------------------------------------------------------------------------#
  
  class @Number extends @SyntaxNode
    compile: -> @value
    
  class @Fixnum extends @Number
    
  class @Float extends @Number
    
  #---------------------------------------------------------------------------#
    
  class @String extends @SyntaxNode
    compile: ->
      val = if @value instanceof types.Symbol
        @value.compile()
      else
        @value
      "\"#{val.replace /\n/g, '\\n'}\""
  
  #---------------------------------------------------------------------------#
  
  class @Regex extends @SyntaxNode
    constructor: (@body, @flags, yy) ->
      super null, yy

    compile_unquoted: ->
      "/#{@body}/#{@flags}"
  
  #---------------------------------------------------------------------------#
  
  class @Atom extends @SyntaxNode
    constructor: (yy) ->
      super @value, yy
    
  class @Nil extends @Atom
    value: null
    
  class @Boolean extends @Atom
    
  class @True extends @Boolean
    value: true
    toString: -> '#t'
    
  class @False extends @Boolean
    value: false
    toString: -> '#f'
  
  #---------------------------------------------------------------------------#
    
  class @Symbol extends @SyntaxNode
    constructor: (value, yy) ->
      super
      if (@value.substr 0, 3) == "..."
        @splat = true
        @value = @value.substr 3
    
    compile_unquoted: ->
      val = if @value.length > 1
        @value.replace /\-/g, "_"
      else
        @value
      to_js_identifier val
      
    @gensym: (sym) ->
      if sym instanceof types.Symbol
        s_sym = sym.value
        symbol = sym
      else if (type_of sym) is "string"
        s_sym = sym
      else
        s_sym = "gen"

      time = (+new Date()).toString 36
      random = (Math.floor Math.random() * 100000).toString 36
      s_sym = "#{s_sym}-#{time}-#{random}"
      new types.Symbol s_sym, symbol
      
  #---------------------------------------------------------------------------#
  
  class @Function extends @SyntaxNode
    constructor: (@name, @args, @body, yy) ->
      super null, yy
      
      if @args
        @min_arity = @max_arity = @args.length
        for arg, i in args
          if arg.splat
            @min_arity = i
            @max_arity = Infinity
            break
      else
        @min_arity = 0
        @max_arity = Infinity
      
    compile_unquoted: ->
      c_name = @name?.compile() ? ''
      if @args?
        c_args = compile_list @args
      else
        c_args = []
      c_body = compile_list @body
      v_length = (types.Symbol.gensym "argslen").compile()
      error_name = if c_name then " in '#{c_name}': " else ""
      """
      function #{c_name}(#{c_args.join ', '}) {
        var #{v_length} = arguments.length;
        if (#{v_length} < #{@min_arity} || #{v_length} > #{@max_arity})
          throw new oppo.ArityException("#{error_name}Expected between #{@min_arity} and #{@max_arity} arguments; got " + #{v_length} +  " instead #{@location_trace()}.");
          
        return (#{c_body.join ',\n'});
      }
      """
  
  #---------------------------------------------------------------------------#
  
  class @Macro extends @SyntaxNode
    constructor: (@name, @argnames, @template, yy, fn) ->
      super null, yy
      if fn?
        @call = fn
      
    compile_unquoted: ->
      c_name = @name.compile()
      unless @call?
        # make macro here
        ;
      scope = last scope_stack
      scope[c_name] = this
      "null"
  
  #---------------------------------------------------------------------------#
  
).call types