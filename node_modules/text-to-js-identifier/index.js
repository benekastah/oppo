(function() {
  var JS_ILLEGAL_IDENTIFIER_CHARS, JS_KEYWORDS, WRAPPER_PREFIX, WRAPPER_REGEX, WRAPPER_SUFFIX, char_wrapper, to_js_identifier, wrapper;

  JS_KEYWORDS = ["break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for", "function", "if", "implements", "import", "in", "instanceof", "interface", "let", "new", "null", "package", "private", "protected", "public", "return", "static", "switch", "super", "this", "throw", "true", "try", "typeof", "undefined", "var", "void", "while", "with", "yield"];

  JS_ILLEGAL_IDENTIFIER_CHARS = {
    "~": "tilde",
    "`": "backtick",
    "!": "exclamationmark",
    "@": "at",
    "#": "pound",
    "%": "percent",
    "^": "carat",
    "&": "amperstand",
    "*": "asterisk",
    "(": "leftparen",
    ")": "rightparen",
    "-": "dash",
    "+": "plus",
    "=": "equals",
    "{": "leftcurly",
    "}": "rightcurly",
    "[": "leftsquare",
    "]": "rightsquare",
    "|": "pipe",
    "\\": "backslash",
    "\"": "doublequote",
    "'": "singlequote",
    ":": "colon",
    ";": "semicolon",
    "<": "leftangle",
    ">": "rightangle",
    ",": "comma",
    ".": "period",
    "?": "questionmark",
    "/": "forwardslash",
    " ": "space",
    "\t": "tab",
    "\n": "newline",
    "\r": "carriagereturn"
  };

  WRAPPER_PREFIX = "_$";

  WRAPPER_SUFFIX = "_";

  WRAPPER_REGEX = /_\$[^_]+_/g;

  wrapper = function(text) {
    return "" + WRAPPER_PREFIX + text + WRAPPER_SUFFIX;
  };

  char_wrapper = function(char) {
    var txt, _ref;
    txt = (_ref = JS_ILLEGAL_IDENTIFIER_CHARS[char]) != null ? _ref : "ASCII_" + (char.charCodeAt(0));
    return wrapper(txt);
  };

  to_js_identifier = function(text) {
    if ((JS_KEYWORDS.indexOf(text)) >= 0) return wrapper(text);
    if (text.length === 0) return wrapper("null");
    return ((text.replace(WRAPPER_REGEX, wrapper)).replace(/^\d/, char_wrapper)).replace(/[^\w\$]/g, char_wrapper);
  };

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = to_js_identifier;
  } else if (typeof ender !== "undefined" && ender !== null) {
    ender.ender({
      to_js_identifier: to_js_identifier
    });
  } else {
    this.to_js_identifier = to_js_identifier;
  }

}).call(this);
