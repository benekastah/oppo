(function() {
  var JS_ILLEGAL_IDENTIFIER_CHARS, JS_KEYWORDS, cantParse, compiler, destring, is_number, is_string, is_symbol, oppo, to_js_symbol, _ref;
  var __hasProp = Object.prototype.hasOwnProperty;

  if (typeof global === "undefined" || global === null) global = window;

  if (typeof Parser === "undefined" || Parser === null) {
    Parser = require('./parser');
  }

  if (typeof _ === "undefined" || _ === null) _ = require('underscore');

  oppo = typeof exports !== "undefined" && exports !== null ? exports : (global.oppo = {});

  compiler = (_ref = oppo.compiler) != null ? _ref : oppo.compiler = {};

  _.mixin({
    objectSet: function(o, s, v) {
      var get, path, ret, _final, _ref2;
      if (arguments.length < 3) {
        _ref2 = [o, s, null], s = _ref2[0], v = _ref2[1], o = _ref2[2];
      }
      if (o == null) o = global;
      path = (s != null ? s : "").split(".");
      _final = path.pop();
      get = function(o, k) {
        var _ref3;
        return (_ref3 = o[k]) != null ? _ref3 : o[k] = {};
      };
      ret = _.reduce(path, get, o);
      return ret[_final] = v;
    }
  });

  JS_KEYWORDS = ["break", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "export", "extends", "finally", "for", "function", "if", "implements", "import", "in", "instanceof", "interface", "label", "let", "new", "package", "private", "protected", "public", "static", "return", "switch", "super", "this", "throw", "try", "catch", "typeof", "var", "void", "while", "with", "yield"];

  JS_ILLEGAL_IDENTIFIER_CHARS = {
    "~": "tilde",
    "`": "backtick",
    "!": "exclmark",
    "@": "at",
    "#": "pound",
    "%": "percent",
    "^": "carat",
    "&": "amperstand",
    "*": "star",
    "(": "oparen",
    ")": "cparen",
    "-": "dash",
    "+": "plus",
    "=": "equals",
    "{": "ocurly",
    "}": "ccurly",
    "[": "osquare",
    "]": "csquare",
    "|": "pipe",
    "\\": "bslash",
    "\"": "dblquote",
    "'": "snglquote",
    ":": "colon",
    ";": "semicolon",
    "<": "oangle",
    ">": "rangle",
    ",": "comma",
    ".": "dot",
    "?": "qmark",
    "/": "fslash",
    " ": "space",
    "\t": "tab",
    "\n": "newline",
    "\r": "return",
    "\v": "vertical",
    "\0": "null"
  };

  cantParse = function(o) {
    return new TypeError("Can't parse: " + o);
  };

  is_string = function(s) {
    return (_.isString(s)) && /^".*"$/.test(s);
  };

  is_number = function(n) {
    return !_.isNaN(n);
  };

  is_symbol = function(s) {
    return (_.isString(s)) && (!is_number(s)) && (!is_string(s));
  };

  to_js_symbol = function(s) {
    var ident, keyword, replaced, _char, _i, _len;
    for (_i = 0, _len = JS_KEYWORDS.length; _i < _len; _i++) {
      keyword = JS_KEYWORDS[_i];
      ident = ident === keyword ? "_" + ident + "_" : ident;
    }
    ident = ident.replace(/\-/g, '_');
    for (_char in JS_ILLEGAL_IDENTIFIER_CHARS) {
      if (!__hasProp.call(JS_ILLEGAL_IDENTIFIER_CHARS, _char)) continue;
      replaced = JS_ILLEGAL_IDENTIFIER_CHARS[_char];
      while ((ident.indexOf(_char)) >= 0) {
        ident = ident.replace(_char, "_" + replaced + "_");
      }
    }
    return ident;
  };

  destring = function(s) {
    var new_s;
    new_s = s.replace(/^"/, '');
    if (new_s !== s) new_s = new_s.replace(/"$/, '');
    return new_s;
  };

  /*
  READER, EVAL, COMPILE
  */

  oppo.read = compiler.read = function(string) {
    return Parser.parse(string);
  };

  oppo.eval = compiler.eval = function(sexp) {
    var call, macro;
    if ((is_string(sexp)) || (is_number(sexp))) {
      return sexp;
    } else if (is_symbol(sexp)) {
      return to_js_symbol(sexp);
    } else if (_.isArray(sexp)) {
      call = oppo.eval(_.first(sexp));
      if ((macro = compiler[call])) {
        return macro.apply(null, program.slice(1));
      } else {
        throw cantParse(sexp);
      }
    } else {
      throw cantParse(sexp);
    }
  };

  oppo.compile = compiler.compile = function(str) {
    var ast;
    ast = oppo.read;
    return oppo.eval(ast);
  };

  /*
  MACROS
  */

  compiler.defmacro = function(name, argnames, template) {
    return _.objectSet(compiler, name, function(args) {
      var body, newSyntaxQuote, oldSyntaxQuote, _ref2;
      newSyntaxQuote = _.bind(compiler.syntaxQuote, argnames, args);
      _ref2 = [compiler.syntaxQuote, newSyntaxQuote], oldSyntaxQuote = _ref2[0], compiler.syntaxQuote = _ref2[1];
      body = oppo.eval(template);
      compiler.syntaxQuote = oldSyntaxQuote;
      return oppo.eval(body);
    });
  };

  compiler.syntaxExpand = function(argnames, args, item) {
    var index;
    if (arguments.length < 3) {
      throw new TypeError("Can't expand syntax outside of macro: " + item);
    }
    index = _.indexOf(argnames, item);
    if (index >= 0) {
      return compile(args[index]);
    } else {
      throw new TypeError("No replacement found for " + item + ".");
    }
  };

  compiler.syntaxQuote = function(argnames, args, item) {
    var newSyntaxExpand, oldSyntaxExpand, ret, _ref2;
    if (arguments.length < 3) {
      throw new TypeError("Can't expand syntax outside of macro: " + item);
    }
    newSyntaxExpand = _.bind(compiler.syntaxExpand, argnames, args);
    _ref2 = [compiler.syntaxExpand, newSyntaxExpand], oldSyntaxExpand = _ref2[0], compiler.syntaxExpand = _ref2[1];
    ret = oppo.eval(item);
    compiler.syntaxExpand = oldSyntaxExpand;
    return ret;
  };

  compiler['js-eval'] = function(js) {
    return destring(js);
  };

}).call(this);
