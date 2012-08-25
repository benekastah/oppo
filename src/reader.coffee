
###
HELPERS
###
{to_type} = oppo.helpers

oppo.Token = class Token
  constructor: (@token_text) ->

  add: (list, lists) ->
    unless @ignore
      parsed = if @parse? then @parse() else this
      list.push parsed
    list

  toString: -> @token_text

  @match: (text) ->
    if text is @matcher
      yes
    else if (to_type @matcher) is "regexp"
      @matcher.test text
    else
      no

  @make_matcher: (m) ->
    if (to_type m) is "regexp"
      new RegExp "^#{m.source}$"
    else
      m

class Number extends Token
  parse: -> +@token_text

class Boolean extends Token


###
TOKEN DEFINITIONS
###
tokenClasses = [
  class Token.Whitespace extends Token
    @matcher: Token.make_matcher /\s+/
    ignore: yes

  class Token.ListOpen extends Token
    @matcher: "("
    add: (list, lists) ->
      new_list = []
      list.push new_list
      lists.push new_list
      new_list

  class Token.ListClose extends Token
    @matcher: ")"
    add: (list, lists) ->
      lists.pop()
      lists[lists.length - 1]

  class Token.Fixnum extends Number
    @matcher: Token.make_matcher /-?\d+/

  class Token.Float extends Number
    @matcher: Token.make_matcher /-?\d*\.\d+/

  class Token.String extends Token
    @matcher: Token.make_matcher /"[^"]*"/
    parse: -> @token_text.substr 1, @token_text.length - 2

  class Token.Nil extends Token
    @matcher: "nil"
    parse: -> null

  class Token.True extends Boolean
    @matcher: "true"

  class Token.False extends Boolean
    @matcher: "false"

  class Token.Symbol extends Token
    constructor: (token_text) ->
      if token_text instanceof Token.Symbol
        token_text = token_text.token_text
      super token_text

    @matcher: Token.make_matcher /[\w\-!@#$%^&*+=|\\:\/?<>\.]+/
]


###
READER
###
read_token = (text) ->
  token_text = ""
  while text.length
    token_text += text.charAt(0)
    text = text.substr 1
    for TokenClass in tokenClasses
      matched = TokenClass.match token_text
      if matched
        match = [(new TokenClass token_text), text]
        if token_text is TokenClass.matcher
          return match
        else
          break
    if not matched and match?
      return match
  match

oppo.read = (text) ->
  token_stream = []
  lists = [token_stream]
  current_list = token_stream
  while text.length
    [token, text] = read_token text
    if token?
      current_list = token.add current_list, lists
    else
      throw new Error "ParseError: Invalid syntax: #{text}"
  token_stream

