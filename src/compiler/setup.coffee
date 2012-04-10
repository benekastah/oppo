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