parser = try exports
catch e then oppo.parser = {}
  
g = try window
catch e then global

recurse = try require './recurse'
catch e then oppo.recurse

{ProgramList} = try require './types'
catch e then oppo.types

class Token
  constructor: (@descriptor) ->
    if @descriptor instanceof RegExp
      @test = @descriptor.test.bind @descriptor
    else if typeof @descriptor is "string"
      @test = (s) -> s is @descriptor
    else
      throw new Error "Token: Descriptor must be string or regexp"

Array::toString = ->
  s = ''
  for item in this
    if item instanceof Array
      s = "#{s}  \n#{item.toString().replace '\n', '  \n'}"
    else
      s = "#{s} #{item}"
  "(#{s})"

# RegExp::toString = -> "/#{@source}/"

identity = (x) -> x

class Construct
  constructor: ({@open, @close, @regexp, expander, @greedy}) ->
    @expander = expander if expander?
    if @open? and not @close?
      Construct.take_next_construct this
    Construct.construct_list.push this
    
  test_open: (matching, collected) ->
    if @open?
      if matching is @open
        @opened()
        return [true, !!@greedy]
    else if @regexp?
      if @regexp.test matching
        @opened()
        return @closed matching
    [false]
    
  test_end: (matching, collected) ->
    if @close? and matching is @close
      @closed collected
    else
      [false]
  
  expander: identity
  
  opened: ->
    Construct.add_active_construct this
    
  closed: (collected=@collected_list) ->
    Construct.active_construct_list.pop()
    compiled = @expander collected
    if not (@give compiled) and compiled isnt Construct.NO_VALUE
      if @active_construct_list.length
        Construct.active_construct_list[this.index - 1].collected_list.push compiled
      else
        Construct.program_list.push compiled
    [true, compiled]
  
  ###
  CONSTRUCT - CLASS ITEMS
  ###
  @construct_list: []
  @active_construct_list: []
  @take_next_construct_list: []
  @program_list: []
  @NO_VALUE: { "Construct.NO_VALUE": true }
  
  @take_next_construct: (t) ->
    @take_next_construct_list.push t
    t.take = (t) ->
      @closed t
      
  @add_active_construct: (t) ->
    l = @active_construct_list.push Object.create t
    t.give = @give_next_construct.bind this, t
    t.collected_list
    t.index = l - 1
    
  @give_next_construct: (t) ->
    c = @take_next_construct_list.pop()
    if c?.take?
      c.take t
      true
    else
      false
    
  @parse: (text) ->
    @matching_text = ''
    greedy_construct = null
    for _char in text
      @matching_text += _char
      [active_construct] = @active_construct_list
      r = active_construct?.test_end @matching_text
      if r? and r[0] is true
        @collected_list = []
        @matching_text = ''
        break
      else if not greedy_construct?
        for c in @construct_list
          r = c.test_open @matching_text
          if r[0] is true
            @matching_text = ''
            if r[1] is true
              greedy_construct = r
            break
            
          
try window.Construct = Construct
        
    
    

###
CONSTRUCTS
###
SEP = new Construct
  regexp: /\s|,/,
  expander: -> Construct.NO_VALUE
LIST = new Construct
  open: '('
  close: ')'
TYPED_LIST = new Construct
  open: '['
  close: ']'
  expander: (content) ->
    ["typed-list", content]
FUNCTION = new Construct
  open: '#('
  close: ')'
  expander: (content) ->
    ["lambda", [], content]
COMMENT = new Construct
  open: ';'
  close: '\n'
  greedy: true
  expander: -> Construct.NO_VALUE
STRING = new Construct
  open: '"'
  close: '"'
  greedy: true
  expander: (content) -> "\"#{content}\""
NUMBER = new Construct
  regexp: /\d+/
IDENTIFIER = new Construct
  regexp: /^[^\s,\(\)]*$/
QUOTE = new Construct
  open: "'"
  expander: (content) ->
    ["quote", content]
  

parser.parse = Construct.parse.bind Construct


# ###
# LIST PROCESSING FUNCTIONS
# ###
# empty = (item) -> !item.length
# head = (item) -> item[0]
# tail = (item) ->
#   if typeof item is "string"
#     item.substr 1
#   else
#     Array.prototype.slice.apply item, 1
# 
# 
# ###
# PARSER/TOKENIZER
# ###
# inQuote = null
# inString = null
# inComment = null
# listItem = null
# quoteWaitForListEnd = null
# 
# parser.parse = parse = (text, list, base) =>
#   if arguments.length is 1
#     # Assume a new call and initialize some things
#     base = list = new ProgramList()
#     list.push "do"
#     inQuote = 0
#     quoteWaitForListEnd = []
#     inString = false
#     inComment = false
#     listItem = null
#     
#   h = head text
#   t = tail text
#   isEOF = empty text
#   
#   # console.log "#{h}\n"
#   if COMMENT_BEGIN.test h
#     inComment = true
#   else if (COMMENT_END.test h) or isEOF
#     inComment = false
#   
#   if not inComment
#     if isEOF
#       if listItem then list.push listItem
#       return base
#     else if QUOTE.test h
#       t = "(quote #{t}"
#       inQuote++
#     else if (LIST_OPEN.test h) and not inString
#       ls = new ProgramList parent:list
#       list.push ls
#       if quoteShouldWaitForListEnd t
#         quoteWaitForListEnd.push list
#         --inQuote
#     else if (LIST_CLOSE.test h) and not inString
#       ls = list.parent
#     else if (TYPED_LIST_OPEN.test h) and not inString
#       t = "(typed-list #{t}"
#     else if (TYPED_LIST_CLOSE.test h) and not inString
#       t = ") #{t}"
#     else if (SPECIAL_OPEN.test h) and not inString
#       if LIST_OPEN.test head t
#         t = "(fn () #{t}"
#         console.warn 'The #() syntax for lambda functions is incomplete. Do not use it.'
#     else if not SEP.test h
#       if (not listItem or inString) and h is '"'
#         inString = not inString
#       listItem or= ''
#       listItem = "#{listItem}#{h}"
#     
#     if ((SEP.test h) or LIST_CLOSE.test h) and not inString
#       t = resolveQuote list, h, t
#       # This needs to be called second or errors will result
#       resolveListItem list
#     
#   recurse parse, t, ls or list, base
# 
# 
# ###
# HELPERS
# ###
# quoteShouldWaitForListEnd = (t) ->
#   if inQuote
#     exception = "quote"
#     len = exception.length
#     test = t.substr 0, len
#     if not (test is exception and SEP.test t.charAt len)
#       return true
#   false
# 
# resolveQuote = (list, h, t) ->
#   listClose = LIST_CLOSE.test h
#   closeThisList = quoteWaitForListEnd[quoteWaitForListEnd.length - 1] is list
#   if (not closeThisList and (inQuote and listItem isnt 'quote')) or (closeThisList and listClose)
#     inQuote = Math.max --inQuote, 0
#     if closeThisList and listClose
#       quoteWaitForListEnd.pop()
#     ") #{t}"
#   else
#     t
#     
# resolveListItem = (list) ->
#   if listItem?
#     list.push listItem
#     listItem = null
#   list