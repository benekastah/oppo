
root = global ? window

class OppoHelpers
  toString = Object::toString
  to_type: (o) -> (s = toString.call o).substring(8, s.length - 1).toLowerCase()

  clone: Object.create ? (o) ->
    class Noop
    Noop:: = o
    new Noop

  to_oppo_string: (x) ->
    {to_oppo_string, to_type} = oppo.helpers
    type = to_type x
    if not x?
      "nil"
    if x instanceof oppo.Symbol
      "'#{x.text}"
    else if type is "array"
      items = (to_oppo_string item for item in x)
      "'(#{items.join ' '})"
    else if type is "object"
      items = ("#{to_oppo_string k} #{to_oppo_string v}" for k, v of x)
      "{#{items.join ',\n '}}"
    else if type is "string"
      "\"#{x}\""
    else if type is "function"
      "#<Function #{x.name or '__anonymous__'}>"
    else
      if x.toString?
        x.toString()
      else
        "#{x}"

  text_to_js_identifier: do ->  
    WRAPPER_PREFIX = "_$"
    WRAPPER_SUFFIX = "_"
    WRAPPER_REGEX = /_\$[^_]+_/g

    JS_KEYWORDS = [
      "break"
      "case"
      "catch"
      "char"
      "class"
      "const"
      "continue"
      "default"
      "delete"
      "do"
      "else"
      "enum"
      "export"
      "extends"
      "false"
      "finally"
      "for"
      "function"
      "if"
      "implements"
      "import"
      "in"
      "instanceof"
      "interface"
      "let"
      "new"
      "null"
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
      "true"
      "try"
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
      "!": "exclamationmark"
      "@": "at"
      "#": "pound"
      "%": "percent"
      "^": "carat"
      "&": "amperstand"
      "*": "asterisk"
      "(": "leftparen"
      ")": "rightparen"
      "-": "dash"
      "+": "plus"
      "=": "equals"
      "{": "leftcurly"
      "}": "rightcurly"
      "[": "leftsquare"
      "]": "rightsquare"
      "|": "pipe"
      "\\": "backslash"
      "\"": "doublequote"
      "'": "singlequote"
      ":": "colon"
      ";": "semicolon"
      "<": "leftangle"
      ">": "rightangle"
      ",": "comma"
      ".": "period"
      "?": "questionmark"
      "/": "forwardslash"
      " ": "space"
      "\t": "tab"
      "\n": "newline"
      "\r": "carriagereturn"

    char_wrapper = (conversions={}, _char) ->
      txt = conversions[_char] ? JS_ILLEGAL_IDENTIFIER_CHARS[_char] ? "ASCII_#{_char.charCodeAt 0}"
      wrapper txt

    wrapper = (text) -> "#{WRAPPER_PREFIX}#{text}#{WRAPPER_SUFFIX}"

    text_to_js_identifier = (text, conversions) ->
      text = text.replace /-/g, '_'

      if (JS_KEYWORDS.indexOf text) >= 0
        return wrapper text

      if text.length is 0
        return wrapper "null"

      _char_wrapper = char_wrapper.bind this, conversions

      (text
      .replace /^\d/, _char_wrapper)
      .replace /[^\w\$]/g, _char_wrapper
  
  
root.oppo = 
  helpers: new OppoHelpers()
  modules: {}

if module?.exports?
  module.exports = oppo