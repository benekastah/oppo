
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

is_symbol = (x, recurse = 1) ->
  x instanceof Symbol or
  (recurse and (to_type x) is "array" and is_symbol (compile_list x, no), recurse - 1)

is_keyword = (x) -> first_item_matches x, 'keyword'

is_quoted = (x, recurse = 2) ->
  x?.quoted or
  (recurse and (to_type x) is "array" and is_quoted (compile_list x, no), recurse - 1)

is_quasiquoted = (x, recurse = 2) ->
  x?.quasiquoted or
  (recurse and (to_type x) is "array" and is_quasiquoted (compile_list x, no), recurse - 1)

is_unquoted = (x, recurse = 2) ->
  x?.unquoted or
  (recurse and (to_type x) is "array" and is_unquoted (compile_list x, no), recurse - 1)

is_unquote_spliced = (x, recurse = 2) ->
  x?.unquote_spliced or
  (recurse and (to_type x) is "array" and is_unquote_spliced (compile_list x, no), recurse - 1)


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
      @transform = eval compile_item [(symbol "lambda"), argnames, template...]
      

class Context
  constructor: (@parent_context) ->
    @context = {}


  var_stmt: ->
    vars = for own k, v of @context when v not instanceof Context and v not instanceof Macro
      compile_item (symbol k)
    if vars.length
      "var #{vars.join ', '};\n"
    else
      ""


  lookup: (sym) ->
    s_sym = get_symbol_text sym
    result = @context[s_sym]
    

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
  shortcut_name: "__module__"

  constructor: (parent_context, @name) ->
    @full_name = "oppo.modules[\"#{@name}\"]"
    Module.set @name, this
    super parent_context
    glob = oppo.context_stack?.global_context
    if glob?[@name]?
      glob[@name] = this


  var_stmt: -> ""

  compile: (inner) ->
    var_stmt = @var_stmt()
    """
    (function (#{@shortcut_name}) {

    #{var_stmt}#{inner};

    })(#{@full_name} || (#{@full_name} = {}));
    """


  toString: -> @name
  @modules = {}


  @get: (name, create, strict = yes) ->
    m = @modules[name]
    if not m?
      if create
        m = new Module null, name
      else if strict
        throw new OppoCompileError "Can't get undefined module: #{name}"
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


  lookup: (sym) ->
    [module, new_sym] = get_module sym
    new_sym ?= sym
    if module?
      module = Module.get(module, null, no)
      result = module?.lookup new_sym
      return [result, module, new_sym]

    index = @stack.length
    while index--
      c = @stack[index]
      result = c.lookup new_sym
      return [result, c, new_sym] if result isnt undefined

    core = Module.get 'core', null, no
    result = core?.lookup new_sym
    if result isnt undefined
      [result, core, new_sym]
    else
      []


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
    result = compile_item sexp
    if result isnt undefined
      compiled.push result
  compiled

compile_item = (sexp) ->
  sexp_type = to_type sexp
    
  if sexp_type is "undefined" or sexp instanceof Macro
  else if sexp_type is "null"
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

oppo.compile = (parse_tree, module_name = anonymous_module_name) ->
  oppo.context_stack ?= new ContextStack()
  
  module = Module.get module_name, null, no
  if not module?
    module = oppo.context_stack.push_new_module module_name  
  oppo.current_module = module
  
  c = compile parse_tree...
  module.compile "return #{c.join ",\n"}"

oppo.eval = ->
  js_code = oppo.compile arguments...
  eval js_code

compile_symbol = (sym, resolve_module = true) ->
  sym_text = if (to_type sym) is "string" then sym else sym.text
  if sym.quoted
    "new oppo.Symbol(\"#{sym_text}\")"
  else
    [value, context, new_sym] = (oppo.context_stack?.lookup sym) ? []
    if resolve_module and new_sym?
      sym_text = new_sym.text
    
    if value instanceof Macro
      value
    else if resolve_module and context instanceof Module
      module = context
      if module is oppo.current_module
        module_name = module.shortcut_name
      else
        module_name = module.full_name
      s_sym = compile_symbol new_sym, false
      "#{module_name}.#{s_sym}"
    else
      text_to_js_identifier sym_text

compile_quasiquoted_list = (a) ->
  current_list = []
  lists = [current_list]
  compile_quoted = (x) -> compile_item [(symbol 'quasiquote'), x]
  for item in a
    if is_unquote_spliced item
      current_list = []
      lists.push compile_item(item), current_list
    else if (to_type item) is "array"
      resolved = compile_quasiquoted_list item
      current_list.push resolved
    else
      current_list.push compile_quoted item
      
  lists_len = lists.length
  last_list = lists[lists_len - 1]
  if lists_len > 1 and not last_list.length
    lists.pop()

  concat_args = for ls in lists
    if (to_type ls) is "array"
      "[#{ls.join ', '}]"
    else
      ls

  first_arg = concat_args[0]
  if concat_args.length > 1
    "#{first_arg}.concat(#{concat_args[1..].join ', '})"
  else
    first_arg

compile_list = (ls, to_compile = yes) ->
  _ls = ls
  if ls.quasiquoted
    compile_quasiquoted_list ls
    
  else if ls.quoted and not ls.unquoted
    quote_symbol = symbol 'quote'
    if not to_compile
      return ls

    c_ls = (compile_item [quote_symbol, x] for x in ls)
    "[#{c_ls.join ', '}]"
    
  else
    [callable] = ls
    callable_is_keyword = is_keyword callable
    callable_is_quoted = is_quoted callable
    callable_is_symbol = is_symbol callable
    if not (callable_is_keyword or callable_is_quoted)
      if (to_type callable) is "array"
        c_callable = compile_list callable, no
      else
        c_callable = compile_item callable

    if not callable_is_quoted and callable_is_symbol
      if c_callable not instanceof Macro
        c_callable = Module.get('core', null, no)?.get 'call'
        ls[0] = callable
      else
        ls = ls[1..]
      if c_callable not instanceof Macro
        throw new OppoCompileError "Can't call list: #{ls}", ls
    else if ls.length > 1 and (callable_is_keyword or (callable_is_symbol and callable_is_quoted))
      c_callable = Module.get('core', null, no)?.get 'object-get-value'
    else
      c_callable = Module.get('core', null, no)?.get 'call'

    result = c_callable.transform.apply _ls, ls
    if to_compile
      compile_item result
    else if (to_type result) is "array"
      compile_list result, to_compile
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

  if @function_name?
    fn_name = get_symbol_text @function_name
    oparen = ""
    cparen = ""
  else
    fn_name = ''
    oparen = "("
    cparen = ")"
    
  new JavaScriptCode """
    #{oparen}function #{fn_name}(#{c_args.join ', '}) {
      #{var_stmt}#{return_kywd}#{c_body.join ',\n'};
    }#{cparen}
    """

define = (name, others...) ->
  if (to_type name) is "array"
    [name, args...] = name
    body = others
    val = [(symbol 'lambda'), args, body...]
    val.function_name = name
    return define name, val
  else
    [value] = others

  full_name = name
  [module, name] = get_module name
  if module?
    context = Module.get module, true
  else
    context = oppo.context_stack.current_context

  context.def name, value

  c_name = compile_item full_name
  c_val = compile_item value
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
  c_fname = compile_item fname
  c_args = compile args...
  new JavaScriptCode "#{c_fname}(#{c_args.join ', '})"

define_builtin_macro "core::object-get-value", (prop, base) ->
  c_base = compile_item base
  if (is_quoted prop) and (is_symbol prop)
    s_prop = compile_list prop, no
    s_prop.quoted = no
    c_prop = compile_item s_prop
    js_code = "#{c_base}.#{c_prop}"
  else
    c_prop = compile_item prop
    js_code = "#{c_base}[#{c_prop}]"

  new JavaScriptCode js_code

define_builtin_macro "core::.", (fname, base, args...) ->
  fname = [(symbol 'quote'), fname]
  [[(symbol 'object-get-value'), fname, base], args...]

define_builtin_macro "core::keyword", (k) -> k

define_builtin_macro "core::quote", (x) ->
  x?.quoted = yes unless x.unquoted
  x
  
define_builtin_macro "core::quasiquote", (x) ->
  #if (to_type x) is "array"
  #  x = resolve_unquotes x
  x?.quasiquoted = yes unless x.unquoted
  [(symbol "quote"), x]

define_builtin_macro "core::unquote", (x) ->
  if x?
    x.unquoted = yes
    x.quoted = x.quasiquoted = no
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
    [(symbol "eval"), compile_item to_eval]