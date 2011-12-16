
oppo = exports ? (global.oppo = {})
compiler = oppo.compiler ?= {}

###
READER, EVAL, COMPILE
###
read = oppo.read = compiler.read = (string) ->
  trimmed = trim.call string
  string = "nil" if trimmed is ''
  Parser.parse string

compile = oppo.compile = compiler.compile = (sexp) ->
  ret = "null"
  if (is_string sexp) or (is_number sexp)
    ret = sexp
  else if is_symbol sexp
    ret = to_js_symbol sexp
  else if _.isArray sexp
    fn = oppo.eval _.first sexp
    if (macro = compiler[fn])
      args = program[1..]
      ret = macro args...
    else
      ret = compiler.call sexp
  else
    raiseParseError sexp
    
  ret
    
eval = oppo.eval = compiler.eval = _.compose eval, oppo.compile

###
MISC
###
compiler.def = (name, value) ->
  name = compile name
  value = compile value
  current_group = last_var_group()
  raiseDefError name if name in current_group
  current_group.push name
  "#{name} = #{value}"
  
compiler[compile 'set!'] = (name, value) ->
  name = compile name
  value = compile value
  "typeof #{name} !== 'undefined' ? #{name} = #{value} : !function () { throw \"Can't set variable that has not been defined: #{name}\" }()"

compiler.js_eval = (js) -> destring js

compiler.call = (fn, args...) -> "#{fn}(#{args.join ', '})"

compiler.do = (body...) ->
  compiled_body = _.map body, compile
  ret = compiled_body.join ',\n'
  "(#{ret})"

###
FUNCTIONS
###
get_args = (args) ->
  destructure = _.any args, is_splat
  
  if (destructure)
    vars = destructure_list args, "arguments"
    args = []
    body = []
    (body.push ['def', _var[0], ['js-eval', _var[1]]]) for _var in vars
  else
    args = args.map (arg) -> compile arg
    body = []
    
  [args, body]

compiler.lambda = (args, body...) ->
  [args, body] = get_args args
  vars = end_var_group()
  var_stmt = if vars.length "var #{vars.join ', '};\n" else ''
  body = _.map body, compile
  """
  (function (#{args.join ", "}) {
    #{var_stmt}return #{body.join ', '};
  })
  """

###
MACROS
###
compiler.defmacro = (name, argnames, template) ->
  objectSet compiler, name, (args...) ->
    evald = oppo.eval [['lambda', argnames, template] '...args']
    oppo.compile evald
    
compiler.syntax_quote = (sexpr) ->
  SPECIAL = ['unquote', 'unquote-splice']
  special_list = []
    
  each_item = (item, i, ls, parent, parent_index) ->
    if i is 0
      switch item
        when 'unquote'
          return compiler.unquote item, true
        when 'unquote_splice'
          list = compiler.unquote_splice item, true
          list = [list] if not _.isArray list
          end_list = []
          while parent.length >= parent_index
            end_list.unshift parent.pop()
          parent.push.apply parent, list.concat end_list
    item

  recursive_map sexpr, each_item
  
    
compiler.unquote = (item, syntax_quote) ->
  if not syntax_quote
    raise TypeError, "Cannot unquote item outside of a syntax quote"
  oppo.compile item

compiler.unquote_splice = (item, syntax_quote) ->
  if not syntax_quote
    raise TypeError, "Cannot unquote-splice item outside of a syntax quote"
  oppo.compile item