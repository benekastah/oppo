
{parser} = require './parser'

main = (program_text) ->
  program = parser.parse program_text
  
codegen = (ast) ->
  switch ast[0]
    when 'program'
      codegenList ast[2..]
    when 'ident'
      ast[1].name
    when 'constant'
      ast[1].val
    when 's_expression'
      "[#{ ast[2].join(', ') }]"
      
codegenList = (list) ->
  list.reduce (prev, curr) ->
    prev + codegen curr
  , ''

 
main '''
()

'''