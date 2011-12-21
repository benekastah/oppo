global ?= window
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

is_splat = (s) -> s?[0]?[1] is 'splat'
is_unquote = (u) -> u?[0]?[1] is 'unquote'
is_symbol = (s) -> s?[0] is 'symbol'

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
      recursive_map item, fn, pass_back, ls, i

to_js_symbol = (ident) ->
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
[new_var_group, first_var_group, last_var_group, end_var_group, end_final_var_group] = []
do ->
  # initial array in var_groups is for the main scope
  var_groups = [ [] ]
  new_var_group = -> var_groups.push []
  first_var_group = -> var_groups[0]
  last_var_group = -> _.last var_groups
  
  end_var_group = -> 
    ret = var_groups.pop()
    if var_groups.length is 0
      var_groups.push []
    ret
    
  end_final_var_group = ->
    if var_groups.length isnt 1
      raise "VarGroupsError", "Expecting 1 final var group, got #{var_groups.length} instead"
    end_var_group()
  
  
###
List destructuring
###
desplat_list = (pattern, sourceName, jsfn) ->
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
    if is_splat item
      item = compile item[1]
      oldSourceIndex = "#{sourceIndex}"
      sourceIndex.value = (patternLen - i) * -1
      result.push jsfn item, sourceName, sourceIndex, oldSourceIndex
    else
      compiled = jsfn sourceName, sourceIndex
      sourceIndex.value++
      if item instanceof Array
        result = result.concat destructure_list, item, sourceText
      else
        result.push compiled
      
  result

destructure_list = do ->
  jsfn = (itemName, mainName, index, oldIndex) ->
    if oldIndex?
      [itemName, "Array.prototype.slice.call(#{mainName}, #{oldIndex}, #{index})"]
    else
      [itemName, "#{mainName}[#{index}]"]
  
  -> desplatList arguments..., jsfn
  
restructure_list = do ->
  jsfn = (itemName, mainName, index, oldIndex) ->
    if oldIndex?
      "#{mainName}.slice(#{oldIndex}, #{index}).concat(itemName, #{mainName}.slice(#{index} + 1))"
    else
      ""
  
  -> desplatList arguments..., jsfn
  