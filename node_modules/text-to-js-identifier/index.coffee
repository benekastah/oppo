JS_KEYWORDS = [
  "break"
  "case"
  "catch"
  "char"
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


WRAPPER_PREFIX = "_$"
WRAPPER_SUFFIX = "_"
WRAPPER_REGEX = /_\$[^_]+_/g
  
wrapper = (text) ->
  "#{WRAPPER_PREFIX}#{text}#{WRAPPER_SUFFIX}"

char_wrapper = (_char) ->
  txt = JS_ILLEGAL_IDENTIFIER_CHARS[_char] ? "ASCII_#{_char.charCodeAt 0}"
  wrapper txt

to_js_identifier = (text) ->
  if (JS_KEYWORDS.indexOf text) >= 0
    return wrapper text
  
  if text.length is 0
    return wrapper "null"
    
  ((text
  .replace WRAPPER_REGEX, wrapper)
  .replace /^\d/, char_wrapper)
  .replace /[^\w\$]/g, char_wrapper

# If we are using node, export it with `module.exports`
if module?.exports?
  module.exports = to_js_identifier
# If we are using ender (ender.no.de), provide this method as a utility
else if ender?
  ender.ender to_js_identifier: to_js_identifier
# Otherwise, attach it to the current context (will be `window` in the browser)
else
  @to_js_identifier = to_js_identifier