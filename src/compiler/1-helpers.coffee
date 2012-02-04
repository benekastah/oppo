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
  "return"
  "static"
  "switch"
  "super"
  "this"
  "throw"
  "try"
  "catch"
  "typeof"
  "undefined"
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

_is = (what, x) -> x?[0]?[1] is what
is_splat = (s) -> _is 'splat', s
is_unquote = (u) -> _is 'unquote', u
is_quoted = (q) -> _is 'quote', q
is_keyword = (k) -> _is 'keyword', k
is_string = (s) -> (_.isString s) and (/^"/.test s) and /"$/.test s

is_symbol = (s) -> s?[0] is "symbol"

to_symbol = (s) -> ['symbol', s]
to_quoted = (x) -> [(to_symbol "quote"), x]

quote_escape = (x) ->
  ret = x
  if _.isString x
    ret = x.replace /\\/g, "\\\\"
  ret

get_raw_text = (s) ->
  if is_quoted s
    s = oppo.eval s
    
  if _.isString s
    s
  else
    s[1]

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
  
  ident.toLowerCase()
  
gensym = (sym='gen') ->
  c_sym = compile [(to_symbol 'symbol'), sym]
  
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
[new_var_group, first_var_group, last_var_group, end_var_group, end_final_var_group, initialize_var_groups] = []
do ->
  # initial array in var_groups is for the main scope
  var_groups = null
  initialize_var_groups = ->
    # console.log "initializing var groups."
    var_groups = [ [] ]
  initialize_var_groups()
  
  new_var_group = ->
    var_groups.push (ret = [])
    # console.log "Created var group; #{var_groups.length} total."
    ret
  first_var_group = -> var_groups[0]
  last_var_group = -> _.last var_groups
  
  end_var_group = ->
    ret = var_groups.pop()
    # console.log "Ended var group;   #{var_groups.length} remaining."
    ret
    
  end_final_var_group = ->
    if var_groups.length isnt 1
      raise "VarGroupsError", "Expecting 1 final var group, got #{var_groups.length} instead"
    # console.log "Ending final var group."
    ret = end_var_group()
    initialize_var_groups()
    ret
  
  
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
      compiled = [(compile item), "#{sourceName}[#{sourceIndex}]"]
      sourceIndex.value++
      if not (is_symbol item) and item instanceof Array
        result = result.concat (destructure_list item, sourceName)
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
      c_item = compile item[1]
      concatArgs.push "[#{c_item}]"
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
