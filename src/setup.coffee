root = global ? window
L = lemur
C = L.Compiler

#-----------------------------------------------------------------------------#

root.oppo =
  compiler:
    types: {}
    scope_stack: [{}]
    
if module?.exports?
  module.exports = oppo
    
{scope_stack, types} = oppo.compiler
   
#-----------------------------------------------------------------------------#
   
class oppo.Error extends Error
  constructor: (@name, @message) ->
  toString: -> "#{@name}: #{@message}"

#-----------------------------------------------------------------------------#
   
class oppo.ArityException extends oppo.Error
  constructor: (message) ->
    if message?
      @message = message
      
  name: "Arity-Exception"
  message: "Wrong number of arguments"

#-----------------------------------------------------------------------------#

type_of = lemur.core.to_type
    
#-----------------------------------------------------------------------------#
    
oppo.stringify = (o) ->
  type = type_of o
  switch type
    when "array"
      C.List::toString.call {value: o}
    when "object"
      if o instanceof C.Construct
        o.toString()
      else
        items = for key, value of o
          "#{oppo.stringify key} #{oppo.stringify value}"
        "{ #{items.join "\n"} }"
    else
      "#{o}"
    
#-----------------------------------------------------------------------------#

oppo.stringify_html = (o) ->
  s = oppo.stringify o
  s.replace /\n/g, "<br />"

#-----------------------------------------------------------------------------#
    
clone = Object.create ? (o) ->
  `function ObjectClone () {}`
  ObjectClone:: = o
  new ObjectClone()
  
#-----------------------------------------------------------------------------#
  
keys = Object.keys ? (o) -> for own prop of o then prop
  
#-----------------------------------------------------------------------------#
  
last = (list) ->
  if list?.length?
    list[list.length - 1]
    
#-----------------------------------------------------------------------------#
    
map = (list, fn) ->
  for item in list
    fn item
    
#-----------------------------------------------------------------------------#
    
compile_list = (list, arg, unquoted) ->
  for item in list
    item.quoted = false if unquoted
    item._compile arg
    
#-----------------------------------------------------------------------------#
    
trim = String::trim or -> @.replace(/^\s+/, '').replace /\s+$/, ''

#-----------------------------------------------------------------------------#

do ->
  C.Construct::_compile = ->
    compile_fn = if @quoted
      @compile_quoted
    else if @quasiquoted
      @compile_quasiquoted
    else if @unquoted
      @compile_unquoted
    else if @unquote_spliced
      @compile_unquote_spliced
    else
      @compile
    compile_fn.apply this, arguments

  C.Construct::compile_quoted = ->
    "new lemur.Compiler.#{@constructor.name}('#{@value}')"

  C.Construct::compile_quasiquoted = C.Construct::compile

  C.Construct::compile_unquoted = C.Construct::compile

  C.Construct::compile_unquote_spliced = C.Construct::compile

  C.Number::compile_quoted = C.Number::compile

  C.String::compile_quoted = C.String::compile

  C.Array::compile_quoted = C.Array::compile

  C.If::transform = ->
    @then = C.Macro.transform @then
    @_else = C.Macro.transform @_else if @_else?
    this

#-----------------------------------------------------------------------------#

read = oppo.read = oppo.compiler.read = ->
  parser.parse arguments...

#-----------------------------------------------------------------------------#

compile = oppo.compile = oppo.compiler.compile = (sexp) ->
  new lemur.Compiler().compile ->
    setup_built_in_macros()
    r = compile_runtime()
    prog = sexp._compile()
    """
    #{r}
    #{prog}
    """

#-----------------------------------------------------------------------------#