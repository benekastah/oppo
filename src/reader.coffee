
###
HELPERS / SETUP
###
{to_type} = oppo.helpers
r_whitespace = /^\s+/
r_number = /^-?(\d*\.\d+|\d+)/
r_symbol = /^[\w~`!@#$%^&*\-+=|\\"':?\/<>,\.]+/

reader = oppo.reader = {}

class OppoReadError extends Error
  constructor: (message, text, index) ->
    @message = message

oppo.JavaScriptCode = class JavaScriptCode
  constructor: (@text) ->

oppo.JavaScriptComment = class JavaScriptComment

oppo.Symbol = class Symbol
  constructor: (@text, base_symbol) ->
    @line_number = base_symbol?.line_number ? reader.line_number

  toString: -> @text

oppo.Splat = class Splat

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

  read: (text, prevLength = 0) ->
    for [k, f] in @table
      if match = @get_match k, f, text
        result = f match
        if result isnt undefined
          if reader.wrap_next?
            result = [(new Symbol reader.wrap_next), result]
            reader.wrap_next = null
          reader.current_list.push result
        return match.length + prevLength

    # Handle special buffers where syntax must be ignored.
    _char = text.charAt 0
    reader.escape_next_char = no
    text_rest = text.substr 1
    newPrevLength = prevLength + 1
    if reader.string_buffer?
      reader.string_buffer += _char
      @read text_rest, newPrevLength
    else if reader.comment_buffer?
      reader.comment_buffer += _char
      @read text_rest, newPrevLength

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
        if reader.wrap_next?
          [list.wrap, reader.wrap_next] = [reader.wrap_next]
        reader.lists.push list
        reader.current_list = list
        list.starting_line_number = reader.line_number
        undefined

      ')', make_reader ->
        list = reader.lists.pop()
        if list.wrap?
          [reader.wrap_next, list.wrap] = [list.wrap]
        reader.current_list = reader.lists[reader.lists.length - 1]
        list

      "'", make_reader ->
        reader.wrap_next = 'quote'
        undefined

      '`', make_reader ->
        reader.wrap_next = 'quasiquote'
        undefined

      ',@', make_reader ->
        reader.wrap_next = 'unquote-splicing'
        undefined

      ',', make_reader ->
        reader.wrap_next = 'unquote'
        undefined

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
read_token = (text, index) ->
  if reader.read_special
    length = ReadTable.tables.special.read text
    if not length?
      throw new OppoReadError "Invalid special syntax", text, index
  else
    length = ReadTable.tables.default.read text
    if not length?
      length = ReadTable.tables.last.read text

  if length?
    return text.substr length

oppo.read = (text) ->
  list = []
  reader.line_number = 1
  reader.lists = [list]
  reader.current_list = list
  while text.length
    text = read_token text
  reader.lists = reader.current_list = null
  list

