global ?= window
Parser ?= require './parser'
_ ?= require 'underscore'
oppo = exports ? (global.oppo = {})
compiler = oppo.compiler ?= {}

_.mixin
  objectSet: (o, s, v) ->
    [s, v, o] = [o, s, null] if arguments.length < 3
    
    o ?= global
    path = (s ? "").split "."
    _final = path.pop()
    get = (o, k) -> o[k] ?= {}
    
    ret = _.reduce path, get, o
    ret[_final] = v

# comment out the keywords that we use as themselves within oppo
JS_KEYWORDS = [
  "break"
  "class"
  "const"
  "continue"
  "debugger"
  "default"
  "delete"
  "do"
  "else"
  "enum"
  "export"
  "extends"
  "finally"
  "for"
  "function"
  "if"
  "implements"
  "import"
  "in"
  "instanceof"
  "interface"
  "label"
  "let"
  "new"
  "package"
  "private"
  "protected"
  "public"
  "static"
  "return"
  "switch"
  "super"
  "this"
  "throw"
  "try"
  "catch"
  "typeof"
  "var"
  "void"
  "while"
  "with"
  "yield"
]

JS_ILLEGAL_IDENTIFIER_CHARS =
  "~": "tilde"
  "`": "backtick"
  "!": "exclmark"
  "@": "at"
  "#": "pound"
  "%": "percent"
  "^": "carat"
  "&": "amperstand"
  "*": "star"
  "(": "oparen"
  ")": "cparen"
  "-": "dash"
  "+": "plus"
  "=": "equals"
  "{": "ocurly"
  "}": "ccurly"
  "[": "osquare"
  "]": "csquare"
  "|": "pipe"
  "\\": "bslash"
  "\"": "dblquote"
  "'": "snglquote"
  ":": "colon"
  ";": "semicolon"
  "<": "oangle"
  ">": "rangle"
  ",": "comma"
  ".": "dot"
  "?": "qmark"
  "/": "fslash"
  " ": "space"
  "\t": "tab"
  "\n": "newline"
  "\r": "return"
  "\v": "vertical"
  "\0": "null"

cantParse = (o) -> new TypeError "Can't parse: #{o}"

is_string = (s) -> (_.isString s) and /^".*"$/.test s
is_number = (n) -> not _.isNaN n
is_symbol = (s) -> (_.isString s) and (not is_number s) and (not is_string s)

to_js_symbol = (s) ->
  # Modify keywords
  for keyword in JS_KEYWORDS
    ident = if ident is keyword then "_#{ident}_" else ident
  
  # Sanitize special characters
  # Simply convert dashes to underscores
  ident = ident.replace /\-/g, '_'
  for own _char, replaced of JS_ILLEGAL_IDENTIFIER_CHARS
    while (ident.indexOf _char) >= 0
      ident = ident.replace _char, "_#{replaced}_"
  
  ident
  
destring = (s) -> 
  new_s = s.replace /^"/, ''
  if new_s isnt s
    new_s = new_s.replace /"$/, ''
  new_s

###
READER, EVAL, COMPILE
###
oppo.read = compiler.read = (string) -> Parser.parse string

oppo.eval = compiler.eval = (sexp) ->
  if (is_string sexp) or (is_number sexp)
    return sexp
  else if is_symbol sexp
    to_js_symbol sexp
  else if _.isArray sexp
    call = oppo.eval _.first sexp
    if (macro = compiler[call])
      macro program[1..]...
    else
      throw cantParse sexp
  else
    throw cantParse sexp
    
oppo.compile = compiler.compile = _.compose oppo.eval, oppo.read

###
MACROS
###
compiler.defmacro = (name, argnames, template) ->
  _.objectSet compiler, name, (args) ->
    newSyntaxQuote = _.bind compiler.syntaxQuote, argnames, args
    [oldSyntaxQuote, compiler.syntaxQuote] = [compiler.syntaxQuote, newSyntaxQuote]
    
    body = oppo.eval template
    
    compiler.syntaxQuote = oldSyntaxQuote
    oppo.eval body
    
compiler.syntaxExpand = (argnames, args, item) ->
  if arguments.length < 3
    throw new TypeError "Can't expand syntax outside of macro: #{item}"
  
  index = _.indexOf argnames, item
  if index >= 0
    compile args[index]
  else
    throw new TypeError "No replacement found for #{item}."
    
compiler.syntaxQuote = (argnames, args, item) ->
  if arguments.length < 3
    throw new TypeError "Can't expand syntax outside of macro: #{item}"
    
  newSyntaxExpand = _.bind compiler.syntaxExpand, argnames, args
  [oldSyntaxExpand, compiler.syntaxExpand] = [compiler.syntaxExpand, newSyntaxExpand]
  
  ret = oppo.eval item
  
  compiler.syntaxExpand = oldSyntaxExpand
  ret
  
compiler['js-eval'] = (js) -> destring js