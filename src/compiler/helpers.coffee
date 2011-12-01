
oppo.module "compiler.helpers", ["compiler"], ({compile}) ->
  self = this
  
  # self.thunk = do ->
  #   class Thunk
  #     constructor: (@scope, @to_eval) ->
  #     eval: ->
  #       if not @evald
  #         @evald = true
  #         @result = @scope.eval @scope, @to_eval
  #       else
  #         @result
  #   
  #   # This is a nicer interface than `new Thunk`
  #   ret = (scope, to_eval) -> new Thunk scope, to_eval
  #   ret.Thunk = Thunk
  # 
  # self.thunk.resolve_one = (x) ->
  #   while x instanceof thunk.Thunk
  #     x = x.eval()
  #   x
  # 
  # self.thunk.resolve_many = (x) ->
  #   x = self.thunk.resolveOne x
  #   if x instanceof Array
  #     x.scope.map x, (item) ->
  #       self.thunk.resolveMany item
  #   else x

  # General
  self.identity = (x) -> x
    
  self.recursive_map = (ls, fn, parent_ls, parent_index) ->
    ls.map (item, i, ls) ->
      if item instanceof Array
        self.recursive_map item, fn, ls, i
      else
        fn item, i, ls, parent_ls, parent_index
  
  # modify keywords so we can use them
  # comment out the keywords that we use as themselves within oppo
  self.js_keywords = [
    "break"
    "class"
    "const"
    "continue"
    # "debugger"
    "default"
    "delete"
    "do"
    # "else"
    "enum"
    "export"
    "extends"
    "finally"
    "for"
    "function"
    # "if"
    "implements"
    "import"
    "in"
    "instanceof"
    "interface"
    "label"
    # "let"
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
    # "throw"
    "try"
    "catch"
    "typeof"
    "var"
    "void"
    "while"
    "with"
    "yield"
  ]
  
  self.js_illegal_identifiers =
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
  
  # Values
  self.gensym = do ->
    num = 0
    (name) ->
      if name? then name = "_#{name}_" else name = ""
      "#{name}#{num++}"
      
  self.def = (ident, value, error) ->
    """
    (typeof #{ident} === "undefined" ?
      #{ident} = #{value} :
      #{error})
    """

  self.set = (ident, value, error) ->
    """
    (typeof #{ident} !== "undefined" ?
      #{ident} = #{value} :
      #{error})
    """
      
  class self.Var
    constructor: (@name, @value) ->
    toString: -> "var #{@name} = #{@value};"
    
    tracker = []
    @new_set: -> tracker.push []
    @track: ->
      for _var in arguments
        set = tracker[tracker.length - 1]
        if set?
          set.push _var
    @grab: -> tracker.pop()
    
  self.splat = (x) -> x[1]
      
  self.destructure_list = (pattern, sourceName) ->
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
          result.concat self.destructure_list, item, sourceText
        else
          result.push [item, sourceText]
        
    result
    
  self.restructure_list = (list) ->
    result = []
    
    for item, i in list
      if self.is_splat item
        init = result
        splat = self.splat item
        rest = list[i+1..]
        result = init.concat splat, rest
      else if item instanceof Array
        result.push self.restructure_list item
      else
        result.push item
    result
     
  # Strings
  self.stringify = do ->
    js_array = (a) ->
      contents = a.map self.stringify.to_js
      "[#{contents.join ', '}]"
      
    oppo_array = (a) ->
      contents = a.map self.stringify.to_oppo
      "(#{contents.join ' '})"
      
    js_object = (o) ->
      s = "{ "
      for name, value of o
        s += "\"#{name}\": #{self.stringify.to_js value}, "
      s.replace /, $/, " }"
    
    to_js: (x) ->
      if x instanceof Array
        js_array x
      else if x instanceof Object
        js_object x
      else
        "#{x}"
    to_oppo: (x) ->
      if x instanceof Array
        oppo_array x
      else
        "#{x}"
        
  self.trim_quotes = (s) -> s.substr 1, s.length - 2
  
  # Types
  self.is_string = (s) -> /^".*"$/.test s
  
  self.is_identifier = (i) ->
    if typeof i is "string" and not (self.is_string i)
      yes
    else if i instanceof Array
      if i[0] in ["."]
        yes
      else
        no
    else
      no
      
  self.is_js_identifier = (i) ->
    for own _char of self.js_illegal_identifiers
      if i.indexOf _char >= 0
        return no
    yes
      
  self.is_list = (a) -> a instanceof Array and not a.type?
  
  self.is_splat = (x) -> x instanceof Array and x[0] is 'splat'
  
  self