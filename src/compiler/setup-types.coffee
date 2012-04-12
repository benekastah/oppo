
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
      
    cache: {}
      
    compile: (quoted = @quoted) ->
      if (type_of @_compile) is "function"
        @cache["_compile"] or @_compile()
      else if not quoted
        @cache["compile_unquoted"] or @compile_unquoted()
      else
        @cache["compile_quoted"] or @compile_quoted()
      
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
      scope.call.invoke @value...

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
    constructor: ->
      super
      
      @static_keys = []
      @static_values = []
      @dynamic_keys = []
      @dynamic_values = []
      values = null
      for item, i in @value
        if i % 2 is 0
          if item instanceof types.Symbol and not item.quoted
            @dynamic_keys.push item
            values = @dynamic_values
          else
            @static_keys.push item
            values = @static_values
        else
          values.push item
      delete @value
      
      if (@static_keys.length isnt @static_values.length) or (@dynamic_keys.length isnt @dynamic_values.length)
        @error "Cannot make an object with an odd number of items."
        
    _compile: ->
      literal_body = for item, i in @static_keys
        if item instanceof types.Quoted
          c_key = item.value[1].compile false
        else
          c_key = item.compile false
          
        c_value = @static_values[i].compile()
          
        "#{c_key}: #{c_value}"
      
      if literal_body.length
        object = "{\n  #{literal_body.join ',\n  '}\n}"
      else
        object = "{}"
      
      if @dynamic_keys.length
        tmp_var = types.Symbol.gensym "obj"
        c_tmp_var = tmp_var.compile()
        scope = last scope_stack
        object_definition = scope.def.invoke tmp_var, (new types.List [(new types.Symbol "js-eval"), object])
        
        dynamic_body = for item, i in @dynamic_keys
          c_key = item.compile()
          c_value = @dynamic_values[i].compile()
          "#{c_tmp_var}[#{c_key}] = #{c_value}"
          
        object = "(#{object_definition},\n#{dynamic_body.join ',\n'},\n#{c_tmp_var})"
        
      object
  
  #---------------------------------------------------------------------------#
  
  class @Number extends @SyntaxNode
    _compile: -> @value
    
  class @Fixnum extends @Number
    
  class @Float extends @Number
    
  #---------------------------------------------------------------------------#
    
  class @String extends @SyntaxNode
    _compile: ->
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
        
      @cached_compiled_args = c_args
      
      body = @body
      
      # Resolve all the macros in the function body so we can reason about the code
      body = for code in body then types.Macro.transform code
      # Check to see if this function is tail-recursive
      tail_recursive = @transform_tail_recursive (last body)
        
      c_body = compile_list @body
      v_length = (types.Symbol.gensym "argslen").compile()
      error_name = if c_name then " in '#{c_name}': " else ""
      
      c_body = c_body.join ",\n"
      
      if tail_recursive
        temp_result = (types.Symbol.gensym "result").compile()
        c_body = """
        while (true) {
          var #{@temp_continue} = false;
          var #{temp_result} = (#{c_body});
          if (!#{@temp_continue}) return #{temp_result};
        }
        """
      else
        c_body = "return #{c_body};"
        
      """
      function #{c_name}(#{c_args.join ', '}) {
        #{c_body}
      }
      """
      
    transform_tail_recursive: (code) ->
      scope = last scope_stack
      if (not code.quoted) and (code instanceof types.List)
        callable = code.value[0]
        
        if callable instanceof types.Symbol
          callable_value = callable.value
          
          if this.name?.value is callable_value
            if not @temp_args
              @temp_args = for arg in @args then (types.Symbol.gensym arg).compile()
              @temp_continue = (types.Symbol.gensym "continue").compile()
              
            temp_args_assignments = []
            temp_args_to_real_args = []
            for tmp, i in @temp_args
              index = i + 1
              c_passed_arg = code.value[index].compile()
              temp_args_assignments.push "#{tmp} = #{c_passed_arg}"
              temp_args_to_real_args.push "#{@cached_compiled_args[i]} = #{tmp}"
              
            emulated_call = [
              temp_args_assignments...
              temp_args_to_real_args...
              "#{@temp_continue} = true"
            ]
            
            code._compile = ->
              "(#{emulated_call.join ',\n  '})"
            
            return yes
            
          else if callable_value in [macro_do.name, macro_let.name]
            return @transform_tail_recursive (last code)
            
          else if callable_value is macro_if.value
            result = @transform_tail_recursive code[2]
            result or= @transform_tail_recursive code[3]
            return result
            
      no
  
  #---------------------------------------------------------------------------#
  
  class @Macro extends @SyntaxNode
    constructor: (@name, @argnames, @template, yy, fn) ->
      super null, yy
      if fn?
        @invoke = fn
      
    compile_unquoted: ->
      c_name = @name.compile()
      unless @invoke?
        # make macro here
        # need an invoke function
        # need a transform function that will simply turn it into the compiled oppo code.
        # the transform function needs to transform its result recursively until the code is pure, non-macro code (actually, any builtin macros will still be there)
        ;
      scope = last scope_stack
      scope[c_name] = this
      "null"
      
    @transform: (code) ->
      if code instanceof types.List
        if code.quoted
          return @transform code
        else
          callable = code.value[0]
          if callable instanceof types.Symbol
            c_callable = callable.compile()
            scope = last scope_stack
            item = scope[c_callable]
            if item instanceof types.Macro and not item.builtin
              return item.transform code
      
      code
  
  #---------------------------------------------------------------------------#
  
).call types