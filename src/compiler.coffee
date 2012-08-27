
{JavaScriptCode, Symbol} = oppo
{text_to_js_identifier, to_type, clone} = oppo.helpers

symbol = (text) ->
  new Symbol text

class Context
  constructor: (@parent_context = Object.prototype) ->
    @context = clone @parent_context

  var_stmt: ->
    vars = for own k, v of @context when v not instanceof Context and (type_of v) isnt 'function'
      compile (symbol k)
    if vars.length
      "var #{vars.join ', '};\n"
    else
      ""

class Module extends Context
  constructor: (parent_context, @name) ->
    super parent_context
    Module[@name] = this

class ContextStack
  constructor: ->
    @global_context = new Context()
    @stack = [@global_context]
    @current_context = @global_context

  push: (c) ->
    @current_context = c
    @stack.push c
    c

  push_new: ->
    c = new Context @current_context
    @push c

  push_new_module: (name) ->
    m = new Module @current_context, name
    @push m

  pop: ->
    c = @stack.pop()
    @current_context = @stack[@stack.length - 1]
    c

compile = (parse_tree...) ->
  for sexp in parse_tree
    sexp_type = to_type sexp
    if not sexp?
      "null"
    else if sexp instanceof JavaScriptCode
      sexp.text
    else if sexp instanceof Symbol
      text_to_js_identifier sexp.text
    else if sexp_type in ["boolean", "number"]
      "#{sexp}"
    else if sexp_type is "string"
      "\"#{sexp}\""
    else if sexp_type is "array"
      compile_list sexp

oppo.compile = (parse_tree, module_name = "__anonymous__") ->
  oppo.context_stack ?= new ContextStack()
  module = oppo.context_stack.push_new_module module_name
  c = compile parse_tree...
  oppo.context_stack.pop()

  var_stmt = module.var_stmt()
  """
  (function () {
  #{var_stmt}
  return #{c.join ",\n"}
  
  }()
  """

compile_list = (ls) ->
  [callable] = ls
  call_macro = lookup_symbol callable
  if (to_type call_macro) isnt "function"
    call_macro = lookup_symbol "call", "core"
  else
    ls.shift()
  compile(call_macro ls...)[0]

# Macros. These will take care of virtually all compiling.
# The only macros that will need to be predefined in javascript are:
# - def
# - defmacro
# - defmodule
# - js-eval
# - lambda
# - call
# - any reader-level macros

lambda = (args, body...) ->
  context = oppo.context_stack.push_new()

  c_args = compile args...
  c_body = compile body...

  oppo.context_stack.pop()
  var_stmt = context.var_stmt()

  new JavaScriptCode """
    (function (#{c_args.join ', '}) {
      #{var_stmt}return #{c_body.join ',\n'};
    })
    """

define = ({module, name, value}) ->
  module ?= oppo.__compiling_module__
  full_name = "#{module}::#{name}"
  c_full_name = compile(symbol full_name)[0]
  oppo.defined_symbols[c_full_name] = value
  c_name = compile(symbol name)[0]
  c_val = compile(value)[0]
  new JavaScriptCode "#{c_name} = #{c_val}"

define_macro = (config) ->
  {module, name, argnames, template} = config
  template_compile = config.compile
  module ?= oppo.__compiling_module__

  value = template_compile ? ->
    compile([(lambda argnames, template...), args])[0]
  define {module, name, value}

  null

define_macro
  module: "core"
  name: "defmacro"
  compile: (name, args, template) ->
    t_name = name.text
    define_macro 
      name: t_name
      argnames: args
      template: template

define_macro
  module: "core"
  name: "def"
  compile: (name, value) ->
    t_name = name.text
    define {name: t_name, value}

define_macro
  module: "core"
  name: "lambda"
  compile: lambda

define_macro
  module: "core"
  name: "call"
  compile: (fname, args...) ->
    c_fname = compile(fname)[0]
    c_args = compile args...
    new JavaScriptCode "#{c_fname}(#{c_args.join ', '})"

define_macro
  module: "js"
  name: "eval"
  compile: (to_eval) ->
    type = type_of to_eval
    if type is "string"
      new JavaScriptCode to_eval
    else
      [(symbol "eval"), (compile to_eval)[0]]