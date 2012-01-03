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

to_symbol = (s) -> ['symbol', s]

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
  if not is_symbol sym
    c_sym = to_js_symbol sym
  else
    c_sym = compile sym
  
  time = (+ new Date).toString 32
  num = (Math.floor Math.random() * 1e+10).toString 32
  "#{c_sym}_#{time}_#{num}"
  
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
List (de/re)structuring
###
destructure_list = (pattern, sourceName) ->
  result = []
  has_splat = false
  
  patternLen = pattern.length
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
      has_splat = true
      c_item = compile item[1]
      oldSourceIndex = "#{sourceIndex}"
      sourceIndex.value = (patternLen - i) * -1
      result.push [c_item, "Array.prototype.slice.call(#{sourceName}, #{oldSourceIndex}, #{sourceIndex})"]
    else
      index.value++
      compiled = [(compile item), "#{sourceName}[#{sourceIndex}]"]
      if item instanceof Array
        result = result.concat destructure_list, item, sourceText
      else
        result.push compiled
      
  if has_splat then result else []
  
restructure_list = (pattern, sourceName) ->
  ident = gensym sourceName
  concatArgs = []
  result = [(to_symbol ident)]
  
  slice_start = null
  do_slice = ->
    if slice_start?
      concatArgs.push "#{sourceName}.slice(#{slice_start}, #{i})"
      slice_start = null
  
  for item, i in pattern
    if is_splat item
      do_slice()
      c_item = compile item[1]
      concatArgs.push c_item
    else if is_unquote item
      do_slice()
      concatArgs.push "[#{compile item[1]}]"
    else if (_.isArray item) and not is_symbol item
      do_slice()
      new_ident = "#{sourceName}[#{i}]"
      restructured = restructure_list item, new_ident
      concatArgs.push "[#{restructured[1]}]"
    else
      if not slice_start?
        slice_start = i
  
  do_slice()
  
  result.push "[].concat(#{concatArgs.join ', '})"
  result
