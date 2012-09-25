
do ->
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
  
  oppo.helpers.text_to_js_identifier = (text, conversions) ->
    text = text.replace /-/g, '_'

    if (JS_KEYWORDS.indexOf text) >= 0
      return wrapper text

    if text.length is 0
      return wrapper "null"

    _char_wrapper = char_wrapper.bind this, conversions

    (text
      .replace /^\d/, _char_wrapper)
      .replace /[^\w\$]/g, _char_wrapper
      