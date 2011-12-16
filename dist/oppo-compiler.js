(function() {
  var JS_ILLEGAL_IDENTIFIER_CHARS, JS_KEYWORDS, compile, compiler, destring, destructure_list, end_var_group, eval, gensym, get_args, is_number, is_string, is_symbol, last_var_group, make_error, new_var_group, objectSet, oppo, raise, raiseDefError, raiseParseError, read, recursive_map, to_js_symbol, trim, _ref, _ref2, _ref3;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; }, __slice = Array.prototype.slice;

  if (typeof global === "undefined" || global === null) global = window;

  if (typeof Parser === "undefined" || Parser === null) {
    Parser = require('./parser');
  }

  if (typeof _ === "undefined" || _ === null) _ = require('underscore');

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

  is_string = function(s) {
    return (_.isString(s)) && /^".*"$/.test(s);
  };

  is_number = function(n) {
    return !_.isNaN(n);
  };

  is_symbol = function(s) {
    return (_.isString(s)) && (!is_number(s)) && (!is_string(s));
  };

  objectSet = function(o, s, v) {
    var get, path, ret, _final, _ref;
    if (arguments.length < 3) {
      _ref = [o, s, null], s = _ref[0], v = _ref[1], o = _ref[2];
    }
    if (o == null) o = global;
    path = (s != null ? s : "").split(".");
    _final = path.pop();
    get = function(o, k) {
      var _ref2;
      return (_ref2 = o[k]) != null ? _ref2 : o[k] = {};
    };
    ret = _.reduce(path, get, o);
    return ret[_final] = v;
  };

  recursive_map = function(ls, fn, pass_back, parent, parent_index) {
    if (pass_back == null) {
      pass_back = function(item) {
        return !_.isArray(item);
      };
    }
    return _.map(ls, function(item, i, ls) {
      if (pass_back(item)) {
        return fn(item, i, ls, parent, parent_index);
      } else {
        return self.recursive_map(item, fn, pass_back, ls, i);
      }
    });
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

  gensym = function(sym) {
    var num;
    if (sym == null) sym = 'gen';
    num = (Math.floor(Math.random() * 1e+10)).toString(32);
    return "" + sym + "-" + num;
  };

  trim = (_ref = String.prototype.trim) != null ? _ref : function() {
    return (this.replace(/^\s+/, '')).replace(/\s+$/, '');
  };

  /*
  Error handling
  */

  make_error = function(name, message) {
    var BaseError, err, _ref2;
    if (arguments.length === 1) {
      _ref2 = [name, null], message = _ref2[0], name = _ref2[1];
    }
    BaseError = _.isFunction(name) ? name : Error;
    err = new BaseError;
    if (name != null) err.name = name;
    if (message != null) err.message = message;
    return err;
  };

  raise = function() {
    throw make_error.apply(null, arguments);
  };

  raiseParseError = function(expr) {
    return raise("ParseError", "Can't parse expression: " + expr);
  };

  raiseDefError = function(name) {
    return raise("DefError", "Can't define previously defined value: " + name);
  };

  /*
  Vars
  */

  _ref2 = [], new_var_group = _ref2[0], last_var_group = _ref2[1], end_var_group = _ref2[2];

  (function() {
    var var_groups;
    var_groups = [[]];
    new_var_group = function() {
      return var_groups.push([]);
    };
    last_var_group = function() {
      return _.last(var_groups);
    };
    return end_var_group = function() {
      return var_groups.pop();
    };
  })();

  /*
  List destructuring
  */

  destructure_list = function(pattern, sourceName) {
    var i, item, nm, oldSourceIndex, patternLen, result, sourceIndex, sourceText, _len;
    result = [];
    patternLen = pattern.length;
    sourceIndex = {
      value: 0,
      toString: function() {
        var num, numStr;
        if (this.value >= 0) {
          return "" + this.value;
        } else {
          num = (this.value * -1) - 1;
          numStr = num ? " - " + num : "";
          return "" + sourceName + ".length" + numStr;
        }
      }
    };
    for (i = 0, _len = pattern.length; i < _len; i++) {
      item = pattern[i];
      if (self.is_splat(item)) {
        oldSourceIndex = "" + sourceIndex;
        sourceIndex.value = (patternLen - i) * -1;
        nm = self.splat(item);
        result.push([nm, "Array.prototype.slice.call(" + sourceName + ", " + oldSourceIndex + ", " + sourceIndex + ")"]);
      } else {
        sourceText = "" + sourceName + "[" + sourceIndex + "]";
        sourceIndex.value++;
        if (item instanceof Array) {
          result = result.concat(destructure_list, item, sourceText);
        } else {
          result.push([item, sourceText]);
        }
      }
    }
    return result;
  };

  oppo = typeof exports !== "undefined" && exports !== null ? exports : (global.oppo = {});

  compiler = (_ref3 = oppo.compiler) != null ? _ref3 : oppo.compiler = {};

  /*
  READER, EVAL, COMPILE
  */

  read = oppo.read = compiler.read = function(string) {
    var trimmed;
    trimmed = trim.call(string);
    if (trimmed === '') string = "nil";
    return Parser.parse(string);
  };

  compile = oppo.compile = compiler.compile = function(sexp) {
    var args, fn, macro, ret;
    ret = "null";
    if ((is_string(sexp)) || (is_number(sexp))) {
      ret = sexp;
    } else if (is_symbol(sexp)) {
      ret = to_js_symbol(sexp);
    } else if (_.isArray(sexp)) {
      fn = oppo.eval(_.first(sexp));
      if ((macro = compiler[fn])) {
        args = program.slice(1);
        ret = macro.apply(null, args);
      } else {
        ret = compiler.call(sexp);
      }
    } else {
      raiseParseError(sexp);
    }
    return ret;
  };

  eval = oppo.eval = compiler.eval = _.compose(eval, oppo.compile);

  /*
  MISC
  */

  compiler.def = function(name, value) {
    var current_group;
    name = compile(name);
    value = compile(value);
    current_group = last_var_group();
    if (__indexOf.call(current_group, name) >= 0) raiseDefError(name);
    current_group.push(name);
    return "" + name + " = " + value;
  };

  compiler[compile('set!')] = function(name, value) {
    name = compile(name);
    value = compile(value);
    return "typeof " + name + " !== 'undefined' ? " + name + " = " + value + " : !function () { throw \"Can't set variable that has not been defined: " + name + "\" }()";
  };

  compiler.js_eval = function(js) {
    return destring(js);
  };

  compiler.call = function() {
    var args, fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return "" + fn + "(" + (args.join(', ')) + ")";
  };

  compiler["do"] = function() {
    var body, compiled_body, ret;
    body = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    compiled_body = _.map(body, compile);
    ret = compiled_body.join(',\n');
    return "(" + ret + ")";
  };

  /*
  FUNCTIONS
  */

  get_args = function(args) {
    var body, destructure, vars, _i, _len, _var;
    destructure = _.any(args, is_splat);
    if (destructure) {
      vars = destructure_list(args, "arguments");
      args = [];
      body = [];
      for (_i = 0, _len = vars.length; _i < _len; _i++) {
        _var = vars[_i];
        body.push(['def', _var[0], ['js-eval', _var[1]]]);
      }
    } else {
      args = args.map(function(arg) {
        return compile(arg);
      });
      body = [];
    }
    return [args, body];
  };

  compiler.lambda = function() {
    var args, body, var_stmt, vars, _ref4;
    args = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    _ref4 = get_args(args), args = _ref4[0], body = _ref4[1];
    vars = end_var_group();
    var_stmt = vars.length("var " + (vars.join(', ')) + ";\n") ? void 0 : '';
    body = _.map(body, compile);
    return "(function (" + (args.join(", ")) + ") {\n  " + var_stmt + "return " + (body.join(', ')) + ";\n})";
  };

  /*
  MACROS
  */

  compiler.defmacro = function(name, argnames, template) {
    return objectSet(compiler, name, function() {
      var args, evald;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      evald = oppo.eval([['lambda', argnames, template]('...args')]);
      return oppo.compile(evald);
    });
  };

  compiler.syntax_quote = function(sexpr) {
    var SPECIAL, each_item, special_list;
    SPECIAL = ['unquote', 'unquote-splice'];
    special_list = [];
    each_item = function(item, i, ls, parent, parent_index) {
      var end_list, list;
      if (i === 0) {
        switch (item) {
          case 'unquote':
            return compiler.unquote(item, true);
          case 'unquote_splice':
            list = compiler.unquote_splice(item, true);
            if (!_.isArray(list)) list = [list];
            end_list = [];
            while (parent.length >= parent_index) {
              end_list.unshift(parent.pop());
            }
            parent.push.apply(parent, list.concat(end_list));
        }
      }
      return item;
    };
    return recursive_map(sexpr, each_item);
  };

  compiler.unquote = function(item, syntax_quote) {
    if (!syntax_quote) {
      raise(TypeError, "Cannot unquote item outside of a syntax quote");
    }
    return oppo.compile(item);
  };

  compiler.unquote_splice = function(item, syntax_quote) {
    if (!syntax_quote) {
      raise(TypeError, "Cannot unquote-splice item outside of a syntax quote");
    }
    return oppo.compile(item);
  };

}).call(this);
