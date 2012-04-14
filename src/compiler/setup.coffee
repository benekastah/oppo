root = global ? window

root.oppo =
  compiler:
    types: {}
    scope_stack: [{}]
    
if module?.exports?
  module.exports = oppo
    
{scope_stack, types} = oppo.compiler
   
class oppo.Error extends Error
  constructor: (@name, @message) ->
  toString: -> "#{@name}: #{@message}"
   
class oppo.ArityException extends oppo.Error
  constructor: (message) ->
    if message?
      @message = message
      
  name: "Arity-Exception"
  message: "Wrong number of arguments"
   
__toString = Object::toString 
type_of = (x) ->
  __toString.call(x).slice(8, -1).toLowerCase()
    
clone = Object.create ? (o) ->
  `function ObjectClone () {}`
  ObjectClone:: = o
  new ObjectClone()
  
last = (list) ->
  if list?.length?
    list[list.length - 1]
    
map = (list, fn) ->
  for item in list
    fn item
    
compile_list = (list, arg) ->
  for item in list
    item.compile arg
    
trim = String::trim or -> @.replace(/^\s+/, '').replace /\s+$/, ''

push_scope = ->
  scope = last scope_stack
  new_scope = clone scope
  scope_stack.push new_scope
  new_scope
  
pop_scope = ->
  scope_stack.pop()
  
scope_var_statement = ->
  scope = last scope_stack
  names = []
  for own name, sym of scope
    if sym instanceof types.Dynamic then continue
    if sym.declared_var
      sym.error "Already declared var for this symbol. Possible compiler error?"
    sym.declared_var = true
    names.push name
    
  if names.length then "#{INDENT}var #{names.join ', '};\n" else ""
  
INDENT = ""
indent_up = ->
  INDENT = "#{INDENT}  "
  
indent_down = ->
  INDENT = INDENT.substr 2
  
newline = -> "\n#{INDENT}"
newline_down = -> "\n#{indent_down()}"
newline_up = -> "\n#{indent_up()}"