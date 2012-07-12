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
      C.List::toOppoString.call {value: o}
    when "object"
      if o instanceof C.Construct
        o.toOppoString?() ? o.toString()
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
    compile_fn = if @quasiquoted
      @compile_quasiquoted
    else if @unquoted
      @compile_unquoted
    else if @unquote_spliced
      @compile_unquote_spliced
    else if @quoted
      @compile_quoted
    else
      @compile
    compile_fn.apply this, arguments

  C.Construct::compile_quoted = ->
    "new lemur.Compiler.#{@constructor.name}('#{@value}')"

  normal_compile = -> @compile arguments...
  C.Construct::compile_quasiquoted = normal_compile

  C.Construct::compile_unquoted = normal_compile

  C.Construct::compile_unquote_spliced = normal_compile

  C.Number::valueOf = -> +@compile()

  C.Number::toString = C.Number::compile

  sym_compile = C.Symbol::compile
  C.Symbol::compile = ->
    name = @name
    @name = name.replace /\-/g, '_'
    c_sym = sym_compile.call this
    @name = name
    c_sym

  C.String::toString = ->
    eval @compile()

  C.String::valueOf = C.String::toString

  C.If::transform = ->
    @then = C.Macro.transform @then
    @_else = C.Macro.transform @_else if @_else?
    this

#-----------------------------------------------------------------------------#

read = oppo.read = oppo.compiler.read = ->
  parser.parse arguments...

#-----------------------------------------------------------------------------#

compile = oppo.compile = oppo.compiler.compile = (sexp, comp_runtime = true) ->
  if (type_of sexp) is "array"
    sexp = new C.List sexp
    sexp = new C.Lambda body: [sexp]

  new lemur.Compiler().compile ->
    setup_built_in_macros()
    if comp_runtime
      r = compile_runtime()

    if r?
      r = """

      // Oppo runtime
      #{r}
      """
    else
      r = ""

    sym_prog = C.Var.gensym "program"
    c_sym_prog = sym_prog.compile()
    prog = sexp._compile()
    """
    // Your program
    var #{c_sym_prog} = #{prog};
    #{r}
    
    // Run the oppo program
    if (lemur.core.to_type(#{c_sym_prog}) === 'function')
      #{c_sym_prog}();
    else
      #{c_sym_prog};
    """

oppo.compile_runtime = ->
  sexp = new C.Null 1
  compile sexp

oppo_eval = oppo.eval = (sexp) ->
  root.eval compile sexp

#-----------------------------------------------------------------------------#