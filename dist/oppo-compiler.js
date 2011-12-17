(function() {
  var JS_ILLEGAL_IDENTIFIER_CHARS, JS_KEYWORDS, began, compile, compiler, destring, destructure_list, end_final_var_group, end_var_group, gensym, get_args, is_number, is_splat, is_string, is_symbol, last_var_group, make_error, new_var_group, objectSet, oppo, raise, raiseDefError, raiseParseError, read, recursive_map, to_js_symbol, trim, _ref, _ref2, _ref3;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; }, __slice = Array.prototype.slice;

  if (typeof global === "undefined" || global === null) global = window;

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
    return !_.isNaN(Number(n));
  };

  is_symbol = function(s) {
    return (_.isString(s)) && (!is_number(s)) && (!is_string(s));
  };

  is_splat = function(s) {
    return (_.isArray(s)) && s[0] === 'splat';
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

  to_js_symbol = function(ident) {
    var keyword, replaced, _char, _i, _len;
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

  _ref2 = [], new_var_group = _ref2[0], last_var_group = _ref2[1], end_var_group = _ref2[2], end_final_var_group = _ref2[3];

  (function() {
    var first_var_group, var_groups;
    var_groups = [[]];
    new_var_group = function() {
      return var_groups.push([]);
    };
    last_var_group = function() {
      return _.last(var_groups);
    };
    first_var_group = function() {
      return var_groups[0];
    };
    end_var_group = function() {
      var ret;
      ret = var_groups.pop();
      if (var_groups.length === 0) var_groups.push([]);
      return ret;
    };
    return end_final_var_group = function() {
      if (var_groups.length !== 1) {
        raise("VarGroupsError", "Expecting 1 final var group, got " + var_groups.length + " instead");
      }
      return end_var_group();
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

  if (typeof parser === "undefined" || parser === null) {
    parser = require('./parser');
  }

  oppo = typeof exports !== "undefined" && exports !== null ? exports : (global.oppo = {});

  compiler = (_ref3 = oppo.compiler) != null ? _ref3 : oppo.compiler = {};

  /*
  READER, EVAL, COMPILE
  */

  read = oppo.read = function(string) {
    var trimmed;
    trimmed = trim.call(string);
    if (trimmed === '') string = "nil";
    return parser.parse(string);
  };

  began = false;

  compile = oppo.compile = function(sexp) {
    var args, fn, macro, ret, top_level, vars;
    if (!began) top_level = began = true;
    if (!(sexp != null)) {
      ret = "null";
    } else if (sexp === true) {
      ret = "true";
    } else if (sexp === false) {
      ret = "false";
    } else if ((is_string(sexp)) || (is_number(sexp))) {
      ret = sexp;
    } else if (is_symbol(sexp)) {
      ret = to_js_symbol(sexp);
    } else if (_.isArray(sexp)) {
      fn = oppo.compile(_.first(sexp));
      if ((macro = compiler[fn])) {
        args = sexp.slice(1);
        ret = macro.apply(null, args);
      } else {
        ret = compiler.call.apply(null, sexp);
      }
    } else {
      raiseParseError(sexp);
    }
    if (top_level || !began) {
      began = false;
      vars = end_final_var_group();
      if (vars.length) ret = "var " + (vars.join(', ')) + ";\n" + ret + ";";
    }
    return ret;
  };

  oppo.eval = _.compose(_.bind(global.eval, global), oppo.compile);

  /*
  MISC
  */

  compiler[compile('var')] = function(name, value, current_group) {
    if (current_group == null) current_group = last_var_group();
    name = compile(name);
    value = compile(value);
    current_group = last_var_group();
    if (__indexOf.call(current_group, name) >= 0) raiseDefError(name);
    current_group.push(name);
    return "" + name + " = " + value;
  };

  compiler.def = function(name, value) {
    return compiler[compile('var')](name, value, first_var_group());
  };

  compiler[compile('set!')] = function(name, value) {
    name = compile(name);
    value = compile(value);
    return compile(['if', ['js-eval', "typeof " + name + " !== 'undefined'"], ['js-eval', "" + name + " = " + value], ['throw', "Can't set variable that has not been defined: " + name]]);
  };

  compiler.js_eval = function(js) {
    return destring(js);
  };

  compiler[compile('do')] = function() {
    var body, compiled_body, ret;
    body = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    compiled_body = _.map(arguments, compile);
    ret = compiled_body.join(',\n');
    return "(" + ret + ")";
  };

  compiler[compile('if')] = function(test, t, f) {
    var c_f, c_t, c_test, _ref4;
    if (arguments.length === 2) Array.prototype.push.call(arguments, f);
    _ref4 = _.map(arguments, compile), c_test = _ref4[0], c_t = _ref4[1], c_f = _ref4[2];
    return "(/* if */ " + c_test + " ?\n  /* then */ " + c_t + " :\n  /* else */ " + c_f + ")";
  };

  compiler.map = function(sexp) {
    var c_key, c_value, i, item, ret, _len;
    ret = "{ ";
    for (i = 0, _len = sexp.length; i < _len; i++) {
      item = sexp[i];
      if (i % 2 === 0) {
        c_key = compile(item);
        ret += "" + c_key + " : ";
      } else {
        c_value = compile(item);
        ret += "" + c_value + ",\n";
      }
    }
    return ret.replace(/,\n$/, ' }');
  };

  compiler.quote = function(sexp) {
    var q_sexp;
    if (_.isArray(sexp)) {
      q_sexp = _.map(sexp, compiler.quote);
      return "[" + (q_sexp.join(', ')) + "]";
    } else {
      return ("\"" + sexp + "\"").replace(/^""/, '"\\"').replace(/""$/, '\\""');
    }
  };

  compiler.eval = function() {
    return compiler.call.apply(compiler, ['oppo.eval'].concat(__slice.call(arguments)));
  };

  /*
  ERRORS
  */

  compiler[compile('throw')] = function(err) {
    var c_err;
    c_err = compile(err);
    return "!function () { throw " + c_err + " }()";
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
    var args, argsbody, body, var_stmt, vars, _ref4;
    args = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    new_var_group();
    _ref4 = get_args(args), args = _ref4[0], argsbody = _ref4[1];
    body = _.map(__slice.call(argsbody).concat(__slice.call(body)), compile);
    vars = end_var_group();
    var_stmt = vars.length ? "var " + (vars.join(', ')) + ";\n" : '';
    return "(function (" + (args.join(", ")) + ") {\n  " + var_stmt + "return " + (body.join(', ')) + ";\n})";
  };

  compiler.call = function() {
    var args, c_args, c_fn, fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    c_fn = compile(fn);
    c_args = _.map(args, compile);
    return "" + c_fn + "(" + (c_args.join(', ')) + ")";
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
