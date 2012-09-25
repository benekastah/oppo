
###
HELPERS / SETUP
###
{to_type, clone} = oppo.helpers
r_whitespace = /^\s+/
r_number = /^-?(\d*\.\d+|\d+)/
r_symbol = /^[\w~`!@#$%^&*\-+=|\\"':?\/<>,\.]+/

reader = oppo.reader = {}

class OppoReadError
  # This is an inheritance hack that gets the error messeges to show up properly in the repl
  @:: = new Error()
  
  text_length: 50
  name: "ReadError"
  constructor: (@message = 'Unknown error') ->
    @text = reader.text
    @index = reader.text_index

  toString: ->
    "#{@name}: #{@message}"

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
    if reader.escape_next_char
      reader.escape_next_char = no
    f arguments...

  reader_fn.comment_special = comment_special
  reader_fn.string_special = string_special

  reader_fn

read_true = make_reader -> true
read_false = make_reader -> false
read_nil = make_reader -> null

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
    reader.escape_next_char = no
    if reader.string_buffer?
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

      '(', make_reader ->
        list = []
        reader.lists.push list
        reader.current_list = list
        list.starting_line_number = reader.line_number
        reader.open_parens += 1
        undefined

      ')', make_reader (match, text, index) ->
        open_parens = reader.open_parens -= 1
        if open_parens < 0
          throw new OppoReadError "You have too many `)`s"

        list = reader.lists.pop()
        reader.current_list = reader.lists[reader.lists.length - 1]
        list

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
      r_number, make_reader (input) -> +input
      r_symbol, make_reader (input) -> new Symbol input
    )

    special: new ReadTable(
      'true', read_true
      't', read_true
    
      'false', read_false
      'f', read_false
    
      'nil', read_nil
      'n', read_nil
    )

###
READER
###
read_token = ->
  unless reader.read_special
    ReadTable.tables.default.read() or ReadTable.tables.last.read()
  else
    ReadTable.tables.special.read() or throw new OppoReadError "Invalid special syntax"


oppo.read = (text) ->
  list = []
  reader.line_number = 1
  reader.lists = [list]
  reader.current_list = list
  reader.text = text
  reader.text_index = 0
  reader.open_parens = 0

  while reader.text_index < reader.text.length
    read_token()

  # Reset all the reader variables we set earlier
  [ reader.line_number
    reader.lists
    reader.current_list
    reader.text
    reader.text_index ] = []

  {open_parens} = reader
  if open_parens > 0
    throw new OppoReadError "You have #{open_parens} too many `(`s"

  list = parse list
  list


parse = oppo.parse = (parse_tree) ->
  wrappers = []
  list = []
  for item in parse_tree  
    if item instanceof Wrapper
      wrappers.push item
    else
      item = parse item if (to_type item) is "array"
      while wrappers.length
        wrapper = wrappers.pop()
        item = [wrapper.symbol, item]
      list.push item

  list