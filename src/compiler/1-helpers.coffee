global ?= window
_ ?= require 'underscore'

create_object = do ->
  if Object.create
    (o) -> Object.create o
  else
    (o) ->
      class Object
      Object:: = o
      new Object

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
  "-": "minus"
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
to_list = (ls) -> [(to_symbol "list"), ls...]

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
  
  # Prevent a single dash from being turned into an underscore
  if ident is '-'
    ident = "_#{JS_ILLEGAL_IDENTIFIER_CHARS['-']}_"
    
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
raiseSetError = (name) -> raise "SetError", "Can't set value that has not been defined: #{name}"
  
###
Scope management
### 
Scope = {}
do ->
  global_scope = {}
  
  scopes = null
  initialize_scopes = -> scopes = [create_object global_scope]
  initialize_scopes()
  
  Scope.top = -> _.first scopes
  Scope.current = -> _.last scopes
  
  Scope.def = (name, type, scope = Scope.current()) ->
    if scope is "global"
      scope = global_scope
    raiseDefError name if scope.hasOwnProperty name
    scope[name] = type
    
  Scope.set = (name, type) ->
    index = scopes.length
    while index
      scope = scopes[--index]
      found = scope.hasOwnProperty name
      break if found
    raiseSetError name if not found
    scope[name] = type
    
  Scope.blind_set = (name, type, scope = Scope.current()) ->
    if scope is "global"
      scope = global_scope
    scope[name] = type
  
  Scope.type = (name) ->
    scope = Scope.current()
    "#{scope[name]}"
  
  Scope.make_new = ->
    scope = Scope.current()
    scopes.push (ret = create_object scope)
    ret
    
  Scope.end_current = (get_vars = true) ->
    ret = scopes.pop()
    if get_vars
      _.keys ret
    else
      ret
    
  Scope.end_final = (get_vars = true) ->
    len = scopes.length
    ret = Scope.end_current(get_vars)
    initialize_scopes()
    if len isnt 1
      raise "VarGroupsError", "Expecting 1 final scope, got #{len} instead"
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
