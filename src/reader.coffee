
###
HELPERS / SETUP
###
{to_type, clone, is_quoted, is_symbol, raise} = oppo.helpers
{JavaScriptCode} = oppo
r_whitespace = /^\s+/
r_number_explicit_base = /^\d+#[\da-z]+/i
r_number = /^(\+|-)?(\d*\.\d+|\d+)(e(\+|-)?\d+)?/i
r_symbol = /^[\w~`!@#$%^&*\-+=|\\"':?\/<>,\.]+/

r_digit = /\d/
r_word = /\w/
number_allowed_chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
"p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
base_acceptable_chars = {}
for base in [2..36]
  index = base - 1
  top_char = number_allowed_chars[index]
  if r_digit.test top_char
    re = "[0-#{top_char}]+"
  else if r_word.test top_char
    re = "[0-9a-#{top_char}]+"
  base_acceptable_chars[base] = new RegExp "^#{re}$", "i"


reader = oppo.reader = {}

class OppoReadError extends Error
  text_length: 50
  name: "ReadError"
  constructor: (@message = 'Unknown error') ->    
    @line_number = reader.line_number
    @file = oppo.compiling

    lines = reader.text.split "\n"
    line_index = @line_number - 1
    @line = lines[line_index]
    
    previous_lines = lines.slice 0, line_index
    previous_lines = (previous_lines.join '\n') + '\n'
    @column_number = reader.text_index - previous_lines.length
    @column_line = "#{(new Array @column_number).join ' '}^"

  toString: ->
    """
    #{@name}: #{@message}
    in #{@file} at line #{@line_number},#{@column_number}:
      #{@line}
      #{@column_line}
    """

reader.Wrapper = class Wrapper
  constructor: (symbol_text) ->
    @symbol = new Symbol symbol_text


###
READTABLES
###
make_reader = (opts, f) ->
  if arguments.length is 1
    [f, opts] = [opts, f]
  {comment_special, string_special} = opts ? {}

  reader_fn = (input) ->
    if reader.read_special
      reader.read_special = no
    f arguments...

  reader_fn.comment_special = comment_special
  reader_fn.string_special = string_special

  reader_fn

read_true = make_reader -> true
read_false = make_reader -> false
read_nil = make_reader -> null

open_list = make_reader (match) ->
  list = []
  list.opener = match
  reader.lists.push list
  reader.current_list = list
  list.starting_line_number = reader.line_number
  reader.open_parens += 1
  undefined

close_list = make_reader (match, text, index) ->
  open_parens = reader.open_parens -= 1
  if open_parens < 0
    raise new OppoReadError "You have too many `)`s"

  list = reader.lists.pop()
  {opener} = list
  error_message = "Braces mismatch: it is illegal to open a form with"
  error_message_ctd = "and close it with"
  if opener is "(" and match isnt ")"
    raise new OppoReadError "#{error_message} `(` #{error_message_ctd} `]`"
  else if opener is '[' and match isnt ']'
    raise new OppoReadError "#{error_message} `[` #{error_message_ctd} `)`"
          
  reader.current_list = reader.lists[reader.lists.length - 1]
  list

oppo.ReadTable = class ReadTable
  constructor: ->
    @table = []
    for arg, i in arguments
      if i % 2 is 0
        item = []
        @table.push item
      item.push arg

  get_match: (m, f, text) ->
    if not reader.escape_next_char and (not reader.string_buffer? or f.string_special) and (not reader.comment_buffer? or f.comment_special)
      if (to_type m) is "regexp"
        match = (text.match m)?[0]
      else if m is (text.substr 0, m.length)
        match = m

  read: ->
    text = reader.text.substr reader.text_index
    for [k, f] in @table
      if match = @get_match k, f, text
        result = f match, text
        if result isnt undefined
          reader.current_list.push result
        reader.text_index += match.length
        return true

    # Handle special buffers where syntax must be ignored.
    _char = text.charAt 0
    escaped = reader.escape_next_char
    reader.escape_next_char = no
    if reader.string_buffer?
      reader.string_buffer += "\\" if escaped
      reader.string_buffer += _char
      reader.text_index += 1
      @read()
    else if reader.comment_buffer?
      reader.comment_buffer += _char
      reader.text_index += 1
      @read()
    else
      false

  @tables:
    default: new ReadTable(
      ';', make_reader ->
        reader.comment_buffer = ''
        undefined

      '\\', make_reader {string_special: yes}, ->
        reader.escape_next_char = true
        undefined

      '\n', make_reader {comment_special: yes}, (input) ->
        reader.line_number += 1
        if reader.comment_buffer?
          comment = "//#{reader.comment_buffer}#{input}"
          reader.comment_buffer = null
          new JavaScriptComment comment
        else
          undefined

      "(", open_list
      "[", open_list
      "{", open_list
      ")", close_list
      "]", close_list
      "}", close_list

      "'", make_reader (match) ->
        new Wrapper 'quote'

      '`', make_reader (match) ->
        new Wrapper 'quasiquote'

      ',@', make_reader (match) ->
        new Wrapper 'unquote-splicing'

      ',', make_reader ->
        new Wrapper 'unquote'

      '"', make_reader {string_special: yes}, ->
        if reader.string_buffer?
          string = reader.string_buffer.replace(/\n/g, "\\n")
          reader.string_buffer = null
          string
        else
          reader.string_buffer = ""
          undefined

      '...', make_reader -> new Splat()

      '.', make_reader -> new Symbol '.'

      '#', make_reader ->
        reader.read_special = yes
        undefined
    )

    last: new ReadTable(
      r_whitespace, make_reader -> undefined
      
      r_number_explicit_base, make_reader (input) ->
        [base, number] = input.split '#'
        base = +base
        r_valid = base_acceptable_chars[base]
        if not r_valid.test number
          raise new OppoReadError "The number #{number} is improperly formatted for base #{base}."
        parseInt number, base
        
      r_number, make_reader (input) -> +input
      
      r_symbol, make_reader (input) -> new Symbol input
    )

    special: new ReadTable(
      'true', read_true
      't', read_true
      'yes', read_true
      'on', read_true
    
      'false', read_false
      'f', read_false
      'no', read_false
      'off', read_false
    
      'nil', read_nil
      'n', read_nil

      /^\d+/, make_reader (match) ->
        new JavaScriptCode "arguments[#{match - 1}]"
        
      '(', make_reader ->
        open_list arguments...
        list = reader.current_list
        body = []
        list.push (new Symbol 'lambda'), [], body
        list.push = -> body.push arguments...
        undefined

      '[', make_reader ->
        open_list arguments...
        list = reader.current_list
        list.push new Symbol 'list'
        undefined

      '{', make_reader ->
        open_list arguments...
        list = reader.current_list
        list.push new Symbol 'object'
        list.is_reader_object = yes
        undefined
    )

###
READER
###
read_token = ->
  unless reader.read_special
    ReadTable.tables.default.read() or ReadTable.tables.last.read()
  else
    ReadTable.tables.special.read() or raise new OppoReadError "Invalid special syntax"


oppo.read = (text) ->
  list = []
  reader.line_number = 1
  reader.lists = [list]
  reader.current_list = list
  reader.text = text
  reader.text_index = 0
  reader.open_parens = 0
  reader.open_array = 0

  while reader.text_index < reader.text.length
    success = read_token()
    if not success
      raise new OppoReadError "Invalid character: `#{reader.text.charAt reader.text_index}`"

  {open_parens} = reader
  if open_parens > 0
    raise new OppoReadError "You have #{open_parens} too many `(`s"

  # Reset all the reader variables we set earlier
  [ reader.line_number
    reader.lists
    reader.current_list
    reader.text
    reader.text_index ] = []

  list = parse list
  list


parse_reader_object = (list) ->
  ls = list.slice 1
  if ls.length % 2 isnt 0
    raise new OppoReadError "Can't create a reader object with odd number of arguments"

  obj = {}
  for item, i in ls
    if i % 2 is 0
      key = item
      if ((is_quoted key) and (is_symbol key[1])) or typeof key in ["string", "number"]
        key = key[1]
      else
        return list
    else
      obj[key] = item
  obj


parse = oppo.parse = (parse_tree) ->
  wrappers = []
  list = []
  {is_reader_object} = parse_tree
  for item in parse_tree  
    if item instanceof Wrapper
      wrappers.push item
    else
      item = parse item if (to_type item) is "array"
      while wrappers.length
        wrapper = wrappers.pop()
        item = [wrapper.symbol, item]
      list.push item

  if is_reader_object
    list = parse_reader_object list
    
  list