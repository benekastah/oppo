
{Token} = oppo
{Symbol} = Token
{text_to_js_identifier, to_type} = oppo.helpers

symbol = (text) ->
  new Symbol text

oppo.defined_symbols = {}
lookup_symbol = (sym, m = oppo.__compiling_module__) ->
  new_sym = symbol sym
  sym_text = new_sym.token_text
  possible_syms = [sym_text, "#{m}::#{new_sym.token_text}"]
  if m isnt "core"
    possible_syms.push "core::#{new_sym.token_text}"

  for possible_sym in possible_syms
    c_sym = compile(symbol possible_sym)[0]
    val = oppo.defined_symbols[c_sym]
    return val if val?

class JavaScriptCode
  constructor: (@text) ->

compile = (parse_tree...) ->
  for sexp in parse_tree
    sexp_type = to_type sexp
    if not sexp?
      "null"
    else if sexp instanceof JavaScriptCode
      sexp.text
    else if sexp instanceof Symbol
      text_to_js_identifier sexp.token_text
    else if sexp_type in ["boolean", "number"]
      "#{sexp}"
    else if sexp_type is "string"
      "\"#{sexp}\""
    else if sexp_type is "array"
      compile_list sexp

oppo.compile = (parse_tree, module = "core") ->
  last_module = oppo.__compiling_module__
  oppo.__compiling_module__ = module
  c = compile parse_tree...
  oppo.__compiling_module__ = last_module
  c.join ";\n"

compile_list = (ls) ->
  [callable] = ls
  call_macro = lookup_symbol callable
  if (to_type call_macro) isnt "function"
    call_macro = lookup_symbol "call", "core"
  else
    ls.shift()
  compile(call_macro ls...)[0]

lambda = (args, body...) ->
  c_args = compile args...
  c_body = compile body...
  new JavaScriptCode """
    (function (#{c_args.join ', '}) {
      return #{c_body.join ', '};
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
    t_name = name.token_text
    define_macro 
      name: t_name
      argnames: args
      template: template

define_macro
  module: "core"
  name: "def"
  compile: (name, value) ->
    t_name = name.token_text
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
  module: "core"
  name: "callmacro"
  compile: (macro, args...) ->

define_macro
  module: "js"
  name: "eval"
  compile: (to_eval) ->
    type = type_of to_eval
    if type is "string"
      new JavaScriptCode to_eval
    else
      [(symbol "eval"), (compile to_eval)[0]]