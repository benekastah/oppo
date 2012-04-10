(->
  
  class @SyntaxNode
    constructor: (@value, @yy) ->
      @line_number = @yy.lexer.yylineno
      
  class @List extends @SyntaxNode
    
  class @Symbol extends @SyntaxNode
    
  class @Object extends @List
  
).call oppo.CompilerTypes = {}