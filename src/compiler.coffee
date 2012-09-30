
{JavaScriptCode, JavaScriptComment, Symbol, Splat} = oppo
{ text_to_js_identifier,
  to_type,
  clone,
  first_item_matches,
  symbol,
  get_symbol,
  get_symbol_text,
  gensym,
  get_module,
  is_symbol,
  is_quoted,
  is_quasiquoted,
  is_unquoted,
  is_unquote_spliced } = oppo.helpers


oppo.Macro = class Macro
  constructor: (@name, argnames, template) ->
    if (to_type argnames) is "function"
      @transform = argnames
    else
      c_transform_fn = compile_item [(symbol "lambda"), argnames, template...]
      @transform = eval c_transform_fn

  compile: ->
    c_name = compile_item (get_symbol_text @name)
    c_transform = @transform.toString()
    "new oppo.Macro(#{c_name}, #{c_transform})"
      

class Context
  constructor: (@parent_context) ->
    @context = {}


  var_stmt: ->
    vars = for own k, v of @context when v not instanceof Context and v not instanceof Macro
      k = @normalize_symbol_text k
      compile_item (symbol k)
      
    if vars.length
      "var #{vars.join ', '};\n"
    else
      ""


  get_symbol_text: (sym) ->
    "#{get_symbol_text sym}__"


  normalize_symbol_text: (text) -> text.substr 0, text.length - 2


  lookup: (sym) ->
    s_sym = @get_symbol_text sym
    result = @context[s_sym]
    

  def: (sym, value) ->
    s_sym = @get_symbol_text sym
    if not @context[s_sym]?
      @context[s_sym] = value
    else
      err = new OppoCompileError "Can't define previously defined symbol: #{s_sym}", sym
      # console.warn err.toString()


  set: (sym, value) ->
    s_sym = @get_symbol_text sym
    if @context[s_sym]?
      @context[s_sym] = value
    else
      err = new OppoCompileError "Can't set value of undefined symbol: #{s_sym}", sym
      # console.warn err.toString()


  get: (sym) ->
    s_sym = @get_symbol_text sym
    @context[s_sym]


oppo.Module = class Module extends Context
  shortcut_name: "__module__"

  r_leading_slash = /^\//
  constructor: (parent_context, name) ->
    @name = name.replace r_leading_slash, ''
    @full_name = "oppo.modules[\"#{@name}\"]"
    Module.set @name, this
    super parent_context
    glob = oppo.context_stack?.global_context
    if glob?[@name]?
      glob[@name] = this


  var_stmt: -> ""

  compile: (inner) ->
    c_name = compile_item @name
    var_stmt = @var_stmt()
    """
    (function (#{@shortcut_name}) {

    !function () {
      var m = oppo.Module.get(#{c_name}, true);
      var new_context = oppo.helpers.clone(#{@shortcut_name});
      m.context = oppo.helpers.merge(new_context, m.context);
    }();

    #{var_stmt}#{inner};

    })(#{@full_name} || (#{@full_name} = {}))
    """

  toString: -> @name

  @anonymous_module_name: "__anonymous__"
  @core_module_name: "core"
  @modules = {}
  
  @get: (name, create, strict = yes) ->
    m = @modules[name]
    if not m?
      if create
        m = new Module null, name
      else if strict
        throw new OppoCompileError "Can't get undefined module: #{name}"
    m


  @set: (name, module, strict = yes) ->
    m = @get name, no, no
    if m?
      if strict and name not in [@core_module_name, @anonymous_module_name]
        throw new OppoCompileError "Can't make same module twice: #{name}"
    else
      @modules[name] = module


__module__ = null
class ContextStack
  constructor: ->
    @global_context = new Context()
    for own name, mod of Module
      @global_context[name] = mod

    @stack = [@global_context]
    @stack.push Module.get Module.core_module_name
    for own modname, value of Module.modules when modname isnt Module.core_module_name
      @stack.push value
      
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

    core = Module.get Module.core_module_name, null, no
    result = core?.lookup new_sym
    if result isnt undefined
      [result, core, new_sym]
    else
      []


  push: (c) ->
    @current_context = c
    __module__ = c.context
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
    __module__ = @current_context.context
    c


compile = (parse_tree...) ->
  compiled = []
  for sexp in parse_tree
    result = compile_item sexp
    if result isnt undefined
      compiled.push result
  compiled

oppo.compile_item = compile_item = (sexp) ->
  result = sexp?.__compiled__
  if result isnt undefined
    return result

  sexp_type = to_type sexp
  result = do ->
    if sexp_type is "undefined" or sexp instanceof JavaScriptComment
      undefined
    else if sexp_type is "null"
      "null"
    else if sexp instanceof Macro
      sexp.compile()
    else if sexp instanceof JavaScriptCode
      sexp.text
    else if sexp instanceof Symbol
      compile_symbol sexp
    else if sexp instanceof Splat
      "new oppo.Splat()"
    else if sexp_type in ["boolean", "number"]
      "#{sexp}"
    else if sexp_type is "string"
      "\"#{sexp}\""
    else if sexp_type is "array"
      compile_list sexp
    else if sexp_type is "object"
      compile_object sexp

  sexp?.__compiled__ = result
  result

oppo.compile = (parse_tree, module_name = Module.anonymous_module_name) ->
  oppo.context_stack ?= new ContextStack()
  
  module = Module.get module_name, null, no
  if not module?
    module = oppo.context_stack.push_new_module module_name  
  oppo.current_module = module
  
  c = compile parse_tree...
  module.compile "return #{c.join ",\n"}"

if process?.title is "node"
  do ->
    path = require 'path'
    fs = require 'fs'
    r_leading_slash = /^\//
    r_file_extension = /(\.oppo)?$/
    precompiled = {}
    basenames = []

    module_base = null
    get_module_name = (file_path) ->
      path.relative module_base, file_path
    
    oppo.compile_from_file = (pathname) ->
      basename = basenames[basenames.length - 1]
      if basename
        pathname = path.join basename, pathname
      if not r_leading_slash.test pathname
        pathname = path.join __dirname, pathname
        
      fname = pathname.replace r_file_extension, '.oppo'
      pathname = pathname.replace r_file_extension, ''
      # Don't do more work than necessary
      preresult = precompiled[fname]
      if preresult?
        return preresult

      new_basename = path.dirname pathname
      module_base ?= new_basename
      basenames.push new_basename
      
      module_name = get_module_name pathname
      
      file_data = fs.readFileSync fname, "utf8"
      parse_tree = oppo.read file_data
      result = oppo.compile parse_tree, module_name
      precompiled[fname] = result
      basenames.pop()

      result

oppo.eval = (data) ->
  js_code = oppo.compile [data]
  root.eval js_code

compile_symbol = (sym, resolve_module = true, resolve_macro = true, can_be_quoted = true) ->
  sym_text = if (to_type sym) is "string" then sym else sym.text
  if can_be_quoted and sym.quoted
    "new oppo.Symbol(\"#{sym_text}\")"
  else
    [value, context, new_sym] = (oppo.context_stack?.lookup sym) ? []
    if resolve_module and new_sym?
      sym_text = new_sym.text
    
    if resolve_macro && value instanceof Macro
      value
    else if resolve_module and context instanceof Module
      module = context
      if module is oppo.current_module
        module_name = module.shortcut_name
      else
        module_name = module.full_name
      #s_sym = compile_symbol new_sym, false
      s_sym = module.get_symbol_text new_sym
      "#{module_name}.#{s_sym}"
    else
      text_to_js_identifier sym_text

compile_quasiquoted_list = (ls) ->
  quote_symbol = symbol 'quasiquote'
  list = null
  push_list = (item) ->
    results.push item if item isnt undefined
    list = []
    results.push [quote_symbol, list]
    
  results = []
  push_list()
  
  for x in ls
    unquoted = is_unquoted x
    unquote_spliced = is_unquote_spliced x
    if not (unquoted or unquote_spliced)
      if (to_type x) is "array"
        x = compile_quasiquoted_list x
      item = [quote_symbol, x]
    else
      if unquote_spliced
        if (to_type x) is "array"
          x = compile_list x, no
        push_list x
      else
        item = x

    if item isnt undefined
      c_item = new JavaScriptCode compile_item item
      list.push c_item
      item = undefined

  if results.length > 1
    if not list.length
      results.pop()
    new JavaScriptCode compile_item [(new JavaScriptCode "oppo.helpers.concat"), results...]
  else
    list

oppo.compile_list = compile_list = (ls, to_compile = yes) ->
  _ls = ls
  {quasiquoted, quoted, unquoted} = ls
  if (quasiquoted or quoted) and not unquoted
    if not to_compile
      return ls
    if quasiquoted
      q_ls = compile_quasiquoted_list ls
      if (to_type q_ls) is "array"
        c_ls = (compile_item x for x in q_ls)
      else
        return compile_item q_ls
    else if quoted
      quote_symbol = symbol 'quote'
      c_ls = (compile_item [quote_symbol, x] for x in ls)
      
    "[#{c_ls.join ', '}]"
  else
    if ls.length
      [callable] = ls
      callable_is_quoted = is_quoted callable
      callable_is_symbol = is_symbol callable
      if not (callable_is_quoted)
        if (to_type callable) is "array"
          c_callable = compile_list callable, no
        else
          c_callable = compile_item callable

      core = Module.get Module.core_module_name, null, no
      if not callable_is_quoted and callable_is_symbol
        if c_callable not instanceof Macro
          c_callable = core?.get 'call'
          ls[0] = callable
        else
          ls = ls[1..]
        if c_callable not instanceof Macro
          throw new OppoCompileError "Can't call list: #{ls}", ls
      else if ls.length > 1 and (callable_is_symbol and callable_is_quoted)
        c_callable = core?.get 'object-get-value'
      else
        c_callable = core?.get 'call'

      result = c_callable.transform.apply _ls, ls
    else
      result = null
      
    if to_compile
      compile_item result
    else if (to_type result) is "array"
      compile_list result, to_compile
    else
      result


compile_object = (o) ->
  items = for own k, v of o
    c_v = compile_item v
    "#{k}: #{c_v}"
  "{ #{items.join ',\n  '} }"


################################################################################
# Macros. These will take care of virtually all compiling.
################################################################################
lambda = (options = {}, args, body...) ->
  context = oppo.context_stack.push_new()
  {body_hook} = options
  do_return = options.return ? yes

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
    body = [[(symbol 'def'), use_module: no, splat_arg, splat_arg_val], body...]
  
  c_args = compile args...
  if body_hook?
    body = body_hook.call this, body
  c_body = compile body...

  oppo.context_stack.pop()
  var_stmt = context.var_stmt()

  return_kywd = if do_return and body_len then "return " else ""

  if @function_name?
    fn_name = get_symbol_text @function_name
  else
    fn_name = ''
    
  new JavaScriptCode """
    (function #{fn_name}(#{c_args.join ', '}) {
      #{var_stmt}#{return_kywd}#{c_body.join ',\n'};
    })
    """


define = (args...) ->
  if args[0]?.constructor is Object
    [opts, name, others...] = args
  else
    [name, others...] = args
    opts = {}

  {use_module} = opts
  use_module ?= yes
    
  if (to_type name) is "array"
    [name, args...] = name
    body = others
    value = [(symbol 'lambda'), args, body...]
    value.function_name = name
  else
    [value] = others

  full_name = name
  [module, name] = get_module name
  if module?
    context = Module.get module, true
  else if use_module
    current_context = context = oppo.context_stack.current_context
    while context && context not instanceof Module
      context = context.parent_context
    context ?= current_context
  else
    context = oppo.context_stack.current_context

  context.def name, value

  c_name = compile_symbol full_name, yes, no, no
  c_val = compile_item value
  new JavaScriptCode "#{c_name} = #{c_val}"


set = (args...) ->
  if args.length < 3
    [name, value] = args
  else
    [opts, name, value] = args
    
  opts ?= {}
  {use_module} = opts
  use_module ?= yes

  [__, context] = oppo.context_stack.lookup name
  if context?
    context.set name, value
  else
    throw new OppoCompileError "Can't set undefined symbol: #{name}", this

  c_name = compile_item name
  c_value = compile_item value
  new JavaScriptCode "#{c_name} = #{c_value}"


define_macro = (name, argnames, template) ->
  value = new Macro name, argnames, template
  define name, value


define_builtin_macro = (name, template_compile) ->
  define_macro (symbol name), template_compile


define_core_macro = (name, template_compile) ->
  define_builtin_macro "#{Module.core_module_name}::#{name}", template_compile


define_core_macro "defmacro", (args, template...) ->
  [name, argnames...] = args
  define_macro name, argnames, template


define_core_macro "def", define
define_core_macro "set!", set
define_core_macro "lambda", -> lambda null, arguments...


define_core_macro "call", (fname, args...) ->
  c_fname = compile_item fname
  c_args = compile args...
  new JavaScriptCode "#{c_fname}(#{c_args.join ', '})"


define_core_macro "object-get-value", (prop, base) ->
  c_base = compile_item base
  if (is_quoted prop) and (is_symbol prop)
    s_prop = compile_list prop, no
    s_prop.quoted = no
    c_prop = compile_symbol s_prop, no, no
    js_code = "#{c_base}.#{c_prop}"
  else
    c_prop = compile_item prop
    js_code = "#{c_base}[#{c_prop}]"

  new JavaScriptCode js_code


define_core_macro ".", (fname, base, args...) ->
  fname = [(symbol 'quote'), fname]
  [[(symbol 'object-get-value'), fname, base], args...]


define_core_macro "quote", (x) ->
  if x?
    x.quoted = yes unless x.unquoted
    x.__compiled__ = undefined
  x
  

define_core_macro "quasiquote", (x) ->
  if x?
    x.quasiquoted = yes unless x.unquoted
  [(symbol "quote"), x]


define_core_macro "unquote", (x) ->
  if x?
    x.unquoted = yes
    x.quoted = x.quasiquoted = no
  x


define_core_macro "unquote-splicing", (x) ->
  x?.unquote_spliced = yes
  [(symbol "unquote"), x]


_let = (options = {}, locals, body...) ->
  if locals.length % 2
    throw new OppoCompileError "let must have an even number of binding forms", this
  names = []
  def_body = []
  for item, i in locals
    if i % 2 is 0
      name = item
    else
      setter = if name not in names
        symbol "def"
      else
        symbol "set!"
      names.push name
      
      result = [setter, {use_module: no}, name, item]
      def_body.push result
      
  body = def_body.concat body
  [(lambda options, [], body...)]
  
define_core_macro "let", -> _let null, arguments...


define_core_macro "if", (cond, when_t, when_f) ->
  [c_cond, c_when_t, c_when_f] = compile cond, when_t, when_f ? new JavaScriptCode "void 0"
  new JavaScriptCode """
  (#{c_cond} ?
      #{c_when_t}
    : #{c_when_f})
  """


define_core_macro "for", ([defs, ls], body...) ->
  if (to_type defs) isnt "array"
    defs = [defs]
  [item, i] = defs
  
  temp_ls = gensym "list"
  i ?= gensym "i"
  len = gensym "len"
  item ?= gensym "item"
  result = gensym "result"

  body_hook = (let_body) ->
    prefix = compile let_body...

    c_temp_ls = compile_item temp_ls
    c_i = compile_item i
    c_len = compile_item len
    c_item = compile_item item
    c_result = compile_item result
    c_body = compile_item [(symbol "do"), body...]

    _for = new JavaScriptCode """
    #{prefix.join ',\n  '};
    for (; #{c_i} < #{c_len}; #{c_i}++) {
      #{c_item} = #{c_temp_ls}[#{c_i}];
      #{c_result}.push(#{c_body});
    }
    return #{c_result};
    """
    [_for]

  _let {body_hook, return: no}, [
    temp_ls, ls
    i, 0
    len, [[(symbol 'quote'), (symbol "length")], temp_ls]
    item, null
    result, [(symbol "quote"), []]
  ]


define_core_macro "do", ->
  c_items = compile arguments...
  new JavaScriptCode "(#{c_items.join '\n, '})"


define_core_macro "include", (path_names...) ->
  includes = for name in path_names
    oppo.compile_from_file name.text or name
  new JavaScriptCode includes.join ',\n'


define_builtin_macro "js::eval", (to_eval) ->
  type = to_type to_eval
  if type is "string"
    quotes_escaped = to_eval.replace /"/g, '\\"' # get rid of an annoying emacs coffee-mode bug with this single-quote: '
    s_to_eval = "\"#{quotes_escaped}\""
    new JavaScriptCode (eval s_to_eval)
  else
    [(new JavaScriptCode "oppo.root.eval"), compile_item to_eval]