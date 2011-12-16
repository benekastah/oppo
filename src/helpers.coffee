global ?= window
Parser ?= require './parser'
_ ?= require 'underscore'

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

is_string = (s) -> (_.isString s) and /^".*"$/.test s
is_number = (n) -> not _.isNaN n
is_symbol = (s) -> (_.isString s) and (not is_number s) and (not is_string s)

objectSet = (o, s, v) ->
  [s, v, o] = [o, s, null] if arguments.length < 3
  
  o ?= global
  path = (s ? "").split "."
  _final = path.pop()
  get = (o, k) -> o[k] ?= {}
  
  ret = _.reduce path, get, o
  ret[_final] = v

recursive_map = (ls, fn, pass_back, parent, parent_index) ->
  pass_back ?= (item) -> not _.isArray item
  _.map ls, (item, i, ls) ->
    if pass_back item
      fn item, i, ls, parent, parent_index
    else
      self.recursive_map item, fn, pass_back, ls, i

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
  
gensym = (sym='gen') ->
  num = (Math.floor Math.random() * 1e+10).toString 32
  "#{sym}-#{num}"
  
trim = String::trim ? -> (@replace /^\s+/, '').replace /\s+$/, ''
  
###
Error handling
###
make_error = (name, message) ->
  if arguments.length is 1
    [message, name] = [name, null]
  
  BaseError = if _.isFunction name then name else Error
  err = new BaseError
  if name? then err.name = name
  if message? then err.message = message
  err
  
raise = -> throw make_error arguments...

raiseParseError = (expr) -> raise "ParseError", "Can't parse expression: #{expr}"

raiseDefError = (name) -> raise "DefError", "Can't define previously defined value: #{name}"
  
###
Vars
###
# Define our variables to export from anonymous function scope
[new_var_group, last_var_group, end_var_group] = []
do ->
  # initial array in var_groups is for the main scope
  var_groups = [ [] ]
  new_var_group = -> var_groups.push []
  last_var_group = -> _.last var_groups
  end_var_group = -> var_groups.pop()
  
  
###
List destructuring
###
destructure_list = (pattern, sourceName) ->
  result = []
  
  patternLen = pattern.length
  # sourceLen = source.length
  sourceIndex = {
    value: 0
    toString: ->
      if @value >= 0
        "#{@value}"
      else
        num = (@value * -1) - 1
        numStr = if num then " - #{num}" else ""
        "#{sourceName}.length#{numStr}"
  }
  
  for item, i in pattern
    if self.is_splat item
      oldSourceIndex = "#{sourceIndex}"
      sourceIndex.value = (patternLen - i) * -1
      nm = self.splat item
      result.push [nm, "Array.prototype.slice.call(#{sourceName}, #{oldSourceIndex}, #{sourceIndex})"]
    else
      sourceText = "#{sourceName}[#{sourceIndex}]"
      sourceIndex.value++
      if item instanceof Array
        result = result.concat destructure_list, item, sourceText
      else
        result.push [item, sourceText]
      
  result
  