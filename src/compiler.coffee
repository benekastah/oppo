
{JavaScriptCode, JavaScriptComment, Symbol, Splat} = oppo
{text_to_js_identifier, to_type, clone} = oppo.helpers

Symbol::toString = -> get_symbol_text this

symbol = (text, base_symbol) ->
  if text instanceof Symbol
    text
  else
    new Symbol text, base_symbol

get_symbol = (sym) ->
  type = to_type sym
  if (is_symbol sym) and type is "array"
    if is_quoted sym
      get_symbol sym[1]
    else
      sym[1]
  else if type is "string"
    (symbol sym)
  else if sym instanceof Symbol
    sym
  else
    throw new Error "Can't get symbol from non-symbol #{sym}"

get_symbol_text = (sym, resolve_module = false) ->
  sym = get_symbol sym
  if sym instanceof Symbol
    text_to_js_identifier sym.text
  else
    throw new OppoCompileError "Can't get symbol text from non-symbol #{sym}", sym

gensym = null
do ->
  gensym_id_map = {}
  gensym = (name = "gen") ->
    id = gensym_id_map[name]
    if not id?
      id = gensym_id_map[name] = 0
    ret = symbol "#{name}_#{id}__"
    gensym_id_map[name] += 1
    ret

module_splitter = null
get_module = (sym) ->
  module_splitter ?= text_to_js_identifier '::'
  s_sym = get_symbol_text sym, false
  a_sym = s_sym.split module_splitter
  switch a_sym.length
    when 1
      [s_sym] = a_sym
    when 2
      [module, s_sym] = a_sym
    else
      throw new OppoCompileError "Can't define more than one module for symbol #{s_sym}", sym

  return [module, (symbol s_sym, sym)]

first_item_matches = (x, sym) ->
  c_sym = get_symbol_text sym, yes
  if (to_type x) is "array"
    [fst] = x
    if is_symbol fst
      c_fst = get_symbol_text fst
      c_fst is c_sym
    else
      no
  else
    no

is_symbol = (x, recurse = yes) ->
  x instanceof Symbol or
  (recurse and (to_type x) is "array" and is_symbol (compile_list x, no), no)

is_keyword = (x) -> first_item_matches x, 'keyword'

is_quoted = (x, recurse = yes) ->
  x?.quoted or
  (recurse and (to_type x) is "array" and is_quoted (compile_list x, no), no)

is_quasiquoted = (x, recurse = yes) ->
  x?.quasiquoted or
  (recurse and (to_type x) is "array" and is_quasiquoted (compile_list x, no), no)

is_unquoted = (x, recurse = yes) ->
  x?.unquoted or
  (recurse and (to_type x) is "array" and is_unquoted (compile_list x, no), no)

is_unquote_spliced = (x, recurse = yes) ->
  x?.unquote_spliced or
  (recurse and (to_type x) is "array" and is_unquote_spliced (compile_list x, no), no)


class OppoCompileError extends Error
  constructor: (message, @form) ->
    @line_number = @form and @form.line_number
    if @line_number
      message = "at line #{@line_number}: #{message}"
    @message = message


class Macro
  constructor: (@name, argnames, template) ->
    if (to_type argnames) is "function"
      @transform = argnames
    else
      @transform = eval (compile [(symbol "lambda"), argnames, template...])[0]
      

class Context
  constructor: (@parent_context) ->
    @context = clone @parent_context?.context ? Object.prototype

  var_stmt: ->
    vars = for own k, v of @context when v not instanceof Context and (to_type v) isnt 'function'
      compile (symbol k)
    if vars.length
      "var #{vars.join ', '};\n"
    else
      ""

  lookup: (sym) ->
    [module, new_sym] = get_module sym
    if module?
      return Module.get(module)?.lookup new_sym
    
    s_sym = get_symbol_text new_sym
    result = @context[s_sym]
    if not module? and result is undefined and (this not instanceof Module or @name isnt "core")
      core = Module.get 'core'
      result = core.lookup sym
    result

  def: (sym, value) ->
    s_sym = get_symbol_text sym
    if not @context[s_sym]?
      @context[s_sym] = value
    else
      throw new OppoCompileError "Can't define previously defined symbol: #{s_sym}", sym

  set: (sym, value) ->
    s_sym = get_symbol_text sym
    if @context[s_sym]?
      @context[s_sym] = value
    else
      throw new OppoCompileError "Can't set value of undefined symbol: #{s_sym}", sym

  get: (sym) ->
    s_sym = get_symbol_text sym
    @context[s_sym]


anonymous_module_name = "__anonymous__"
class Module extends Context
  constructor: (parent_context, @name) ->
    Module.set @name, this
    super parent_context
    glob = oppo.context_stack?.global_context
    if glob?[@name]?
      glob[@name] = this

  @modules = {}

  @get: (name, create) ->
    m = @modules[name]
    if not m?
      if create
        m = new Module null, name
      else
        new OppoCompileError "Can't get undefined module: #{name}"
    m

  @set: (name, module) ->
    if @modules[name]? and name isnt anonymous_module_name
      throw new OppoCompileError "Can't make same module twice: #{name}"
    else
      @modules[name] = module


class ContextStack
  constructor: ->
    @global_context = new Context()
    for own name, mod of Module
      @global_context[name] = mod

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
  compiled = []
  for sexp in parse_tree
    sexp_type = to_type sexp
    
    result = if not sexp? or sexp instanceof Macro
      "null"
    else if sexp instanceof JavaScriptComment
      undefined
    else if sexp instanceof JavaScriptCode
      sexp.text
    else if sexp instanceof Symbol
      compile_symbol sexp
    else if sexp_type in ["boolean", "number"]
      "#{sexp}"
    else if sexp_type is "string"
      "\"#{sexp}\""
    else if sexp_type is "array"
      compile_list sexp

    if result isnt undefined
      compiled.push result
  compiled

oppo.compile = (parse_tree, module_name = anonymous_module_name) ->
  oppo.context_stack ?= new ContextStack()
  module = oppo.context_stack.push_new_module module_name
  c = compile parse_tree...
  oppo.context_stack.pop()

  var_stmt = module.var_stmt()
  """
  (function () {

  #{var_stmt}return #{c.join ",\n"};

  })();
  """

compile_symbol = (sym, resolve_module = true) ->
  sym_text = if (to_type sym) is "string" then sym else sym.text
  if sym.quoted
    "new oppo.Symbol(\"#{sym_text}\")"
  else
    if resolve_module
      [module, new_sym] = get_module sym

    value = oppo.context_stack?.current_context.lookup sym
    if value instanceof Macro
      value
    else if module?
      [(symbol "object-get-value"), (symbol module), new_sym]
    else
      text_to_js_identifier sym_text

compile_list = (ls, to_compile = yes) ->
  if ls.quoted
    quasiquoted = ls.quasiquoted
    quote_symbol = (symbol if quasiquoted then 'quasiquote' else 'quote')

    c_ls = []
    lists = [c_ls]
    for x in ls
      if not quasiquoted or not is_unquoted x
        c_ls.push (compile [quote_symbol, x])[0]
      else
        compiled_item = (compile x)[0]
        if is_unquote_spliced x
          c_ls = []
          lists.push compiled_item, c_ls
        else        
          c_ls.push compiled_item

    concat_args = for ls in lists
      if (to_type ls) is "array"
        "[#{ls.join ', '}]"
      else
        ls

    if concat_args.length > 1
      "#{concat_args[0]}.concat(#{concat_args[1..].join ', '})"
    else
      concat_args[0]
      
  else if ls.quasiquoted
    c_ls = ((compile [(symbol 'quasiquote'), x])[0] for x in ls when not is_unquoted x)
    ""
  else
    [callable] = ls
    callable_is_keyword = is_keyword callable
    callable_is_quoted = is_quoted callable
    callable_is_symbol = is_symbol callable
    if not (callable_is_keyword or callable_is_quoted)
      if (to_type callable) is "array"
        c_callable = compile_list callable, no
      else
        c_callable = (compile callable)[0]

    if not callable_is_quoted and callable_is_symbol
      if c_callable not instanceof Macro
        c_callable = Module.get('core').get 'call'
        ls[0] = callable
      else
        ls = ls[1..]
      if c_callable not instanceof Macro
        throw new OppoCompileError "Can't call list: #{ls}", ls
    else if callable_is_keyword or (callable_is_symbol and callable_is_quoted)
      c_callable = Module.get('core').get 'object-get-value'
    else
      c_callable = Module.get('core').get 'call'

    result = c_callable.transform ls...
    if to_compile
      (compile result)[0]
    else
      result

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

  splat_args = []
  normal_args = []
  found_splat = no
  for arg in args
    is_splat = arg instanceof Splat
    found_splat or= is_splat
    continue if is_splat
    if found_splat
      splat_args.push arg
    else
      normal_args.push arg

  if splat_args.length > 1
    throw new OppoCompileError "Oppo currently does not support having more than one rest argument."

  args = normal_args
  [splat_arg] = splat_args
  body_len = body.length # Get the body length now before we change it.
  if splat_arg?
    splat_arg_val = new JavaScriptCode "Array.prototype.slice.call(arguments, #{args.length})"
    body = [[(symbol 'def'), splat_arg, splat_arg_val], body...]
  
  c_args = compile args...
  c_body = compile body...

  oppo.context_stack.pop()
  var_stmt = context.var_stmt()

  return_kywd = if body_len then "return " else ""

  new JavaScriptCode """
    (function (#{c_args.join ', '}) {
      #{var_stmt}#{return_kywd}#{c_body.join ',\n'};
    })
    """

define = (name, others...) ->
  if (to_type name) is "array"
    [name, args...] = name
    body = others
    return define name, [(symbol 'lambda'), args, body...]
  else
    [value] = others

  [module, name] = get_module name
  if module?
    context = Module.get module, true
  else
    context = oppo.context_stack.current_context

  context.def name, value

  c_name = compile(name)[0]
  c_val = compile(value)[0]
  new JavaScriptCode "#{c_name} = #{c_val}"

define_macro = (name, argnames, template) ->
  value = new Macro name, argnames, template
  define name, value
  undefined

define_builtin_macro = (name, template_compile) ->
  define_macro (symbol name), template_compile

define_builtin_macro "core::defmacro", (args, template...) ->
  [name, argnames...] = args
  define_macro name, argnames, template

define_builtin_macro "core::def", define

define_builtin_macro "core::lambda", lambda

define_builtin_macro "core::call", (fname, args...) ->
  c_fname = compile(fname)[0]
  c_args = compile args...
  new JavaScriptCode "#{c_fname}(#{c_args.join ', '})"

define_builtin_macro "core::object-get-value", (prop, base) ->
  c_base = (compile base)[0]
  if (is_quoted prop) and (is_symbol prop)
    s_prop = compile_list prop, no
    s_prop.quoted = no
    c_prop = (compile s_prop)[0]
    js_code = "#{c_base}.#{c_prop}"
  else
    c_prop = (compile prop)[0]
    js_code = "#{c_base}[#{c_prop}]"

  new JavaScriptCode js_code

define_builtin_macro "core::.", (fname, base, args...) ->
  fname = [(symbol 'quote'), fname]
  [[(symbol 'object-get-value'), fname, base], args...]

define_builtin_macro "core::keyword", (k) -> k

define_builtin_macro "core::quote", (x) ->
  x?.quoted = yes
  x

define_builtin_macro "core::quasiquote", (x) ->
  x?.quasiquoted = yes
  [(symbol "quote"), x]

define_builtin_macro "core::unquote", (x) ->
  x?.unquoted = yes
  x

define_builtin_macro "core::unquote-splicing", (x) ->
  x?.unquote_spliced = yes
  [(symbol "unquote"), x]

define_builtin_macro "js::eval", (to_eval) ->
  type = to_type to_eval
  if type is "string"
    quotes_escaped = to_eval.replace /"/g, '\\"' # get rid of an annoying emacs coffee-mode bug with this single-quote: '
    s_to_eval = "\"#{quotes_escaped}\""
    new JavaScriptCode (eval s_to_eval)
  else
    [(symbol "eval"), (compile to_eval)[0]]