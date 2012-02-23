(function() {
  var DEF, DEFITEMS, DEFMACRO, GETMACRO, JS_ILLEGAL_IDENTIFIER_CHARS, JS_KEYWORDS, Scope, binary_fn, compare_fn, compile, compiler, create_object, destructure_list, gensym, get_from_prototype, get_many_from_prototype, get_raw_text, is_keyword, is_quoted, is_splat, is_string, is_symbol, is_unquote, join, ltrim, make_comparison_fn, make_error, make_math_fn, math_fn, modules, objectSet, oppo, quote_escape, raise, raiseDefError, raiseParseError, raiseSetError, read, read_compile, recursive_map, reset_deffed, restructure_list, rtrim, slice, sort, split, to_js_symbol, to_list, to_lower, to_quoted, to_symbol, to_upper, trim, use_deffed, use_from_prototype, use_many_from_prototype, use_properties, use_root_properties, __var, _is, _ref, _ref2,
    __slice = Array.prototype.slice,
    __hasProp = Object.prototype.hasOwnProperty;

  if (typeof global === "undefined" || global === null) global = window;

  if (typeof _ === "undefined" || _ === null) _ = require('underscore');

  create_object = (function() {
    if (Object.create) {
      return function(o) {
        return Object.create(o);
      };
    } else {
      return function(o) {
        var Object;
        Object = (function() {

          function Object() {}

          return Object;

        })();
        Object.prototype = o;
        return new Object;
      };
    }
  })();

  JS_KEYWORDS = ["break", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "export", "extends", "finally", "for", "function", "if", "implements", "import", "in", "instanceof", "interface", "label", "let", "new", "package", "private", "protected", "public", "return", "static", "switch", "super", "this", "throw", "try", "catch", "typeof", "undefined", "var", "void", "while", "with", "yield"];

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
    "(": "lparen",
    ")": "rparen",
    "-": "minus",
    "+": "plus",
    "=": "equals",
    "{": "lcurly",
    "}": "rcurly",
    "[": "lsquare",
    "]": "rsquare",
    "|": "pipe",
    "\\": "bslash",
    "\"": "dblquote",
    "'": "snglquote",
    ":": "colon",
    ";": "semicolon",
    "<": "langle",
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

  _is = function(what, x) {
    var _ref;
    return (x != null ? (_ref = x[0]) != null ? _ref[1] : void 0 : void 0) === what;
  };

  is_splat = function(s) {
    return _is('splat', s);
  };

  is_unquote = function(u) {
    return _is('unquote', u);
  };

  is_quoted = function(q) {
    return _is('quote', q);
  };

  is_keyword = function(k) {
    return _is('keyword', k);
  };

  is_string = function(s) {
    return (_.isString(s)) && (/^"/.test(s)) && /"$/.test(s);
  };

  is_symbol = function(s) {
    return (s != null ? s[0] : void 0) === "symbol";
  };

  to_symbol = function(s) {
    return ['symbol', s];
  };

  to_quoted = function(x) {
    return [to_symbol("quote"), x];
  };

  to_list = function(ls) {
    return [to_symbol("list")].concat(__slice.call(ls));
  };

  quote_escape = function(x) {
    var ret;
    ret = x;
    if (_.isString(x)) ret = x.replace(/\\/g, "\\\\");
    return ret;
  };

  get_raw_text = function(s) {
    if (is_quoted(s)) s = oppo.eval(s);
    if (_.isString(s)) {
      return s;
    } else {
      return s[1];
    }
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
        return recursive_map(item, fn, pass_back, ls, i);
      }
    });
  };

  to_js_symbol = function(ident) {
    var keyword, replaced, _char, _i, _len;
    for (_i = 0, _len = JS_KEYWORDS.length; _i < _len; _i++) {
      keyword = JS_KEYWORDS[_i];
      ident = ident === keyword ? "_" + ident + "_" : ident;
    }
    if (ident === '-') ident = "_" + JS_ILLEGAL_IDENTIFIER_CHARS['-'] + "_";
    ident = ident.replace(/\-/g, '_');
    for (_char in JS_ILLEGAL_IDENTIFIER_CHARS) {
      if (!__hasProp.call(JS_ILLEGAL_IDENTIFIER_CHARS, _char)) continue;
      replaced = JS_ILLEGAL_IDENTIFIER_CHARS[_char];
      while ((ident.indexOf(_char)) >= 0) {
        ident = ident.replace(_char, "_" + replaced + "_");
      }
    }
    return ident.toLowerCase();
  };

  gensym = function(sym) {
    var c_sym, num, time;
    if (sym == null) sym = 'gen';
    c_sym = compile([to_symbol('symbol'), sym]);
    time = (+(new Date)).toString(32);
    num = (Math.floor(Math.random() * 1e+10)).toString(32);
    return "" + c_sym + "_" + time + "_" + num;
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

  raiseSetError = function(name) {
    return raise("SetError", "Can't set value that has not been defined: " + name);
  };

  /*
  Scope management
  */

  Scope = {};

  (function() {
    var global_scope, initialize_scopes, scopes;
    global_scope = {};
    scopes = null;
    initialize_scopes = function() {
      return scopes = [create_object(global_scope)];
    };
    initialize_scopes();
    Scope.top = function() {
      return _.first(scopes);
    };
    Scope.current = function() {
      return _.last(scopes);
    };
    Scope.def = function(name, type, scope) {
      if (scope == null) scope = Scope.current();
      if (scope === "global") scope = global_scope;
      if (scope.hasOwnProperty(name)) raiseDefError(name);
      return scope[name] = type;
    };
    Scope.set = function(name, type) {
      var found, index, scope;
      index = scopes.length;
      while (index) {
        scope = scopes[--index];
        found = scope.hasOwnProperty(name);
        if (found) break;
      }
      if (!found) raiseSetError(name);
      return scope[name] = type;
    };
    Scope.blind_set = function(name, type, scope) {
      if (scope == null) scope = Scope.current();
      if (scope === "global") scope = global_scope;
      return scope[name] = type;
    };
    Scope.type = function(name) {
      var scope;
      scope = Scope.current();
      return "" + scope[name];
    };
    Scope.make_new = function() {
      var ret, scope;
      scope = Scope.current();
      scopes.push((ret = create_object(scope)));
      return ret;
    };
    Scope.end_current = function(get_vars) {
      var ret;
      if (get_vars == null) get_vars = true;
      ret = scopes.pop();
      if (get_vars) {
        return _.keys(ret);
      } else {
        return ret;
      }
    };
    return Scope.end_final = function(get_vars) {
      var len, ret;
      if (get_vars == null) get_vars = true;
      len = scopes.length;
      ret = Scope.end_current(get_vars);
      initialize_scopes();
      if (len !== 1) {
        raise("VarGroupsError", "Expecting 1 final scope, got " + len + " instead");
      }
      return ret;
    };
  })();

  /*
  List (de/re)structuring
  */

  destructure_list = function(pattern, sourceName) {
    var c_item, compiled, has_splat, i, item, oldSourceIndex, patternLen, result, sourceIndex, _len;
    result = [];
    has_splat = false;
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
      if (is_splat(item)) {
        has_splat = true;
        c_item = compile(item[1]);
        oldSourceIndex = "" + sourceIndex;
        sourceIndex.value = (patternLen - i) * -1;
        result.push([c_item, "Array.prototype.slice.call(" + sourceName + ", " + oldSourceIndex + ", " + sourceIndex + ")"]);
      } else {
        compiled = [compile(item), "" + sourceName + "[" + sourceIndex + "]"];
        sourceIndex.value++;
        if (!(is_symbol(item)) && item instanceof Array) {
          result = result.concat(destructure_list(item, sourceName));
        } else {
          result.push(compiled);
        }
      }
    }
    if (has_splat) {
      return result;
    } else {
      return [];
    }
  };

  restructure_list = function(pattern, sourceName) {
    var c_item, concatArgs, do_slice, i, ident, item, new_ident, restructured, result, slice_start, _len;
    ident = gensym(sourceName);
    concatArgs = [];
    result = [to_symbol(ident)];
    slice_start = null;
    do_slice = function() {
      if (slice_start != null) {
        concatArgs.push("" + sourceName + ".slice(" + slice_start + ", " + i + ")");
        return slice_start = null;
      }
    };
    for (i = 0, _len = pattern.length; i < _len; i++) {
      item = pattern[i];
      if (is_splat(item)) {
        do_slice();
        c_item = compile(item[1]);
        concatArgs.push(c_item);
      } else if (is_unquote(item)) {
        do_slice();
        c_item = compile(item[1]);
        concatArgs.push("[" + c_item + "]");
      } else if ((_.isArray(item)) && !is_symbol(item)) {
        do_slice();
        new_ident = "" + sourceName + "[" + i + "]";
        restructured = restructure_list(item, new_ident);
        concatArgs.push("[" + restructured[1] + "]");
      } else {
        if (!(slice_start != null)) slice_start = i;
      }
    }
    do_slice();
    result.push("[].concat(" + (concatArgs.join(', ')) + ")");
    return result;
  };

  if (typeof parser === "undefined" || parser === null) {
    parser = require('./parser');
  }

  oppo = typeof exports !== "undefined" && exports !== null ? exports : (global.oppo = {});

  compiler = (_ref2 = oppo.compiler) != null ? _ref2 : oppo.compiler = {};

  modules = {};

  oppo.DEFMACRO = DEFMACRO = function(name, fn) {
    var c_name;
    c_name = compile(to_symbol(name));
    Scope.blind_set(c_name, "macro", "global");
    return compiler[c_name] = fn;
  };

  oppo.GETMACRO = GETMACRO = function(name) {
    var c_name;
    c_name = compile(to_symbol(name));
    return compiler[c_name];
  };

  DEFITEMS = {};

  oppo.DEF = DEF = function(name, value, required) {
    var c_name, ret, s_name;
    s_name = to_symbol(name);
    c_name = compile(s_name);
    ret = DEFITEMS[c_name] = function() {
      var item, result, _i, _len;
      ret = [];
      if (required != null) {
        required = _.map(required, _.compose(compile, to_symbol));
        for (_i = 0, _len = required.length; _i < _len; _i++) {
          item = required[_i];
          result = use_deffed(item);
          if (result != null) ret.push(result);
        }
        value = value.replace(/\{(\d+)\}/g, function(s, num) {
          return required[+num];
        });
      }
      ret.push(compile([to_symbol("def"), s_name, [to_symbol('js-eval'), value]]));
      return ret.join(',\n');
    };
    ret.complete = false;
    return ret;
  };

  use_deffed = function(name) {
    var fn;
    fn = DEFITEMS[name];
    if ((fn != null) && fn.complete === false) {
      fn.complete = true;
      return fn();
    }
  };

  reset_deffed = function() {
    var item, name, _results;
    _results = [];
    for (name in DEFITEMS) {
      if (!__hasProp.call(DEFITEMS, name)) continue;
      item = DEFITEMS[name];
      _results.push(item.complete = false);
    }
    return _results;
  };

  /*
  READ, EVAL, COMPILE
  */

  read = oppo.read = function(string) {
    return parser.parse(string);
  };

  compile = null;

  (function() {
    var prefix, _compile;
    prefix = null;
    _compile = function(sexp, top_level) {
      var args, deffed, fn, macro, raw_text, ret, vars, _prefix;
      if (sexp == null) sexp = null;
      if (top_level == null) top_level = false;
      if (top_level) prefix = [];
      if ((sexp === null || sexp === true || sexp === false) || _.isNumber(sexp)) {
        ret = "" + sexp;
      } else if (is_symbol(sexp)) {
        raw_text = sexp[1];
        ret = to_js_symbol(raw_text);
        if (prefix != null) {
          deffed = use_deffed(ret);
          if (deffed != null) prefix.push(deffed);
        }
      } else if (_.isString(sexp)) {
        ret = "\"" + (sexp.replace(/\n/g, '\\n')) + "\"";
      } else if (_.isFunction(sexp)) {
        ret = "" + sexp;
      } else if (_.isArray(sexp)) {
        fn = compile(_.first(sexp));
        args = sexp.slice(1);
        if ((Scope.type(fn)) === "macro") {
          macro = compiler[fn];
          ret = macro.apply(null, args);
        } else {
          ret = compiler.call.apply(compiler, [[to_symbol("js-eval"), fn]].concat(__slice.call(args)));
        }
      } else {
        raiseParseError(sexp);
      }
      if (top_level) {
        vars = Scope.end_final();
        vars = vars.length ? "var " + (vars.join(', ')) + ";\n" : '';
        _prefix = (prefix != null ? prefix.length : void 0) ? "" + (prefix.join(',\n')) + ";\n" : '';
        ret = "" + vars + _prefix + ret + ";";
        prefix = null;
        reset_deffed();
      }
      return ret;
    };
    oppo._compile = compile = function(sexp) {
      return _compile(sexp, false);
    };
    return oppo.compile = function(sexp) {
      return _compile(sexp, true);
    };
  })();

  oppo.eval = _.compose(_.bind(global.eval, global), compile);

  read_compile = _.compose(compile, oppo.read);

  DEFMACRO("js-map", function() {
    var add_ons, c_value, e_key, i, item, item_added, last, ret, sexp, sym, _len;
    sexp = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    sym = gensym("obj");
    add_ons = [];
    item_added = false;
    ret = "{ ";
    for (i = 0, _len = sexp.length; i < _len; i++) {
      item = sexp[i];
      if (i % 2 === 0) {
        if ((is_quoted(item)) && is_symbol((e_key = oppo.eval(item)))) {
          ret += "" + (compile(e_key)) + " : ";
        } else if ((_.isString(item)) || (is_keyword(item))) {
          ret += "" + (compile(item)) + " : ";
        } else if ((_.isNumber(item)) && !(_.isNaN(item))) {
          ret += "\"" + (compile(item)) + "\" : ";
        } else {
          item_added = true;
          add_ons.push("" + sym + "[" + (compile(item)) + "] = ");
        }
      } else {
        c_value = compile(item);
        if (!item_added) {
          ret += "" + c_value + ",\n";
        } else {
          item_added = false;
          last = add_ons.pop();
          last += c_value;
          add_ons.push(last);
        }
      }
    }
    ret = ret.replace(/(\s|,\s)$/, ' }');
    if (!add_ons.length) {
      return ret;
    } else {
      add_ons = _.map(add_ons, function(x) {
        return [to_symbol("js-eval"), x];
      });
      add_ons.unshift(to_symbol("do"));
      add_ons.push(["symbol", sym]);
      return ret = "(function (" + sym + ") {\n  return " + (compile(add_ons)) + ";\n})(" + ret + ")";
    }
  });

  DEFMACRO('list', function() {
    var c_sexp, sexp;
    sexp = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    c_sexp = _.map(sexp, compile);
    return "[" + (c_sexp.join(', ')) + "]";
  });

  DEFMACRO('.', function() {
    var base, c_base, e_name, name, names, ret, _i, _len;
    base = arguments[0], names = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    c_base = compile(base);
    ret = c_base;
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      e_name = null;
      if (is_quoted(name)) e_name = oppo.eval(name);
      if ((e_name != null) && is_symbol(e_name)) {
        ret += "." + (compile(e_name));
      } else {
        ret += "[" + (compile(name)) + "]";
      }
    }
    return ret;
  });

  (function() {
    var get_args;
    get_args = function(args) {
      var body, destructure, vars, _i, _len, _var;
      if (args == null) args = [];
      if (args === "null") args = [];
      destructure = _.any(args, is_splat);
      if (destructure) {
        vars = destructure_list(args, "arguments");
        args = [];
        body = [];
        for (_i = 0, _len = vars.length; _i < _len; _i++) {
          _var = vars[_i];
          body.push(read("(var " + _var[0] + " (js-eval \"" + _var[1] + "\"))"));
        }
      } else {
        args = args.map(function(arg) {
          return compile(arg);
        });
        body = [];
      }
      return [args || [], body || []];
    };
    DEFMACRO('lambda', function() {
      var args, argsbody, body, ret, scope, var_stmt, vars, _ref3;
      args = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      scope = Scope.make_new();
      _ref3 = get_args(args), args = _ref3[0], argsbody = _ref3[1];
      body = argsbody.concat(body);
      body = _.map(body, compile);
      vars = Scope.end_current();
      var_stmt = vars.length ? "var " + (vars.join(', ')) + ";\n" : '';
      return ret = "(function (" + (args.join(", ")) + ") {\n  " + var_stmt + "return " + (body.join(', ')) + ";\n})";
    });
    return DEFMACRO('fn', compiler.lambda);
  })();

  DEFMACRO('call', function() {
    var args, c_args, c_fn, fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    c_fn = compile(fn);
    c_args = _.map(args, compile);
    return "" + c_fn + "(" + (c_args.join(', ')) + ")";
  });

  DEFMACRO('apply', function() {
    var args, c_args, c_fn, fn, fn_base, spl_fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    c_fn = compile(fn);
    spl_fn = c_fn.split('.');
    spl_fn.pop();
    fn_base = spl_fn.join('.');
    c_args = _.map(args, compile);
    return "" + c_fn + ".apply(" + (fn_base || null) + ", [].concat(" + (c_args.join(', ')) + "))";
  });

  DEFMACRO('let', function() {
    var body, i, len, let_fn, names_vals, ret, vars;
    names_vals = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    vars = [];
    i = 0;
    len = names_vals.length;
    while (i < len) {
      vars.push([to_symbol("var"), names_vals[i++], names_vals[i++]]);
    }
    body = vars.concat(body);
    let_fn = [to_symbol("lambda"), []].concat(__slice.call(body));
    return ret = "" + (compile(let_fn)) + ".apply(this, typeof arguments !== \"undefined\" ? arguments : [])";
  });

  DEFMACRO('new', function() {
    var args, c_args, c_cls, cls;
    cls = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    c_cls = compile(cls);
    c_args = _.map(args, compile);
    return "new " + c_cls + "(" + (c_args.join(', ')) + ")";
  });

  DEFMACRO('defn', function() {
    var args, body, name;
    name = arguments[0], args = arguments[1], body = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    return compile([to_symbol('def'), name, [to_symbol('lambda'), args].concat(__slice.call(body))]);
  });

  DEFMACRO('curry', function() {
    var args, base, fn, ret;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if ((_.isArray(fn)) && (get_raw_text(fn[0])) === '.') {
      base = fn.slice(0);
      base.pop();
      if (base.length === 2) base = base[1];
    } else {
      base = null;
    }
    return ret = compile([to_symbol("bind"), fn, base].concat(__slice.call(args)));
  });

  DEFMACRO('eval', function(sexp) {
    var c_sexp;
    c_sexp = compile(sexp);
    return "eval(oppo._compile(" + c_sexp + "))";
  });

  DEFMACRO('quote', function(sexp) {
    var q_sexp, ret, s_sexp;
    sexp = quote_escape(sexp);
    ret = !(sexp != null) ? null : void 0;
    if (_.isBoolean(sexp)) {
      return sexp;
    } else if (is_symbol(sexp)) {
      return compile(to_list(sexp));
    } else if (_.isArray(sexp)) {
      q_sexp = _.map(sexp, to_quoted);
      return compile(to_list(q_sexp));
    } else if (_.isNumber(sexp)) {
      return sexp;
    } else {
      s_sexp = "" + sexp;
      return "\"" + (s_sexp.replace(/"/g, '\\"')) + "\"";
    }
  });

  DEFMACRO('symbol', function(sym) {
    var e_sym, str;
    str = GETMACRO('str');
    e_sym = eval(str(sym));
    return compile(to_symbol(e_sym));
  });

  DEFMACRO('js-eval', function(js) {
    var c_js, e_js, ret;
    c_js = compile(js);
    if (is_string(c_js)) {
      e_js = c_js.substr(1, c_js.length - 2);
      e_js = e_js.replace(/\\?"/g, '\\"');
      return ret = eval("\"" + e_js + "\"");
    } else {
      return ret = "eval(" + c_js + ")";
    }
  });

  DEFMACRO('do', function() {
    var body, compiled_body, ret;
    body = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    compiled_body = _.map(arguments, compile);
    ret = compiled_body.join(',\n');
    return "(" + ret + ")";
  });

  DEFMACRO('if', function(test, t, f) {
    var c_f, c_t, c_test, cond, sym, _ref3;
    if (arguments.length === 2) Array.prototype.push.call(arguments, f);
    _ref3 = _.map(arguments, compile), c_test = _ref3[0], c_t = _ref3[1], c_f = _ref3[2];
    sym = gensym("cond");
    cond = compile([to_symbol('var'), to_symbol(sym), test]);
    return "/* if */ ((" + cond + ") !== false && " + sym + " != null && " + sym + " === " + sym + " ?\n  " + (compile(t)) + " :\n  " + (compile(f)) + ")\n/* end if */";
  });

  DEFMACRO('regex', function(body, modifiers) {
    return "/" + body + "/" + (modifiers != null ? modifiers : '');
  });

  DEFMACRO('undefined?', function(x) {
    var c_x;
    c_x = compile(x);
    return "(typeof " + c_x + " === 'undefined')";
  });

  DEFMACRO('defined?', function(x) {
    var c_x;
    c_x = compile(x);
    return "(typeof " + c_x + " !== 'undefined')";
  });

  /*
  VARIABLES
  */

  DEFMACRO('gensym', function() {
    var ret, sym;
    sym = gensym.apply(null, arguments);
    return ret = compile([to_symbol('quote'), to_symbol(sym)]);
  });

  __var = function(name, value, scope, type) {
    var c_name, c_value;
    if (type == null) type = "variable";
    c_name = compile(name);
    if (c_name !== (to_js_symbol(c_name))) {
      raise("DefError", "Can't define complex symbol: " + c_name);
    }
    c_value = compile(value);
    Scope.def(c_name, type, scope);
    return "" + c_name + " = " + c_value;
  };

  DEFMACRO('var', function(name, value) {
    return __var(name, value);
  });

  DEFMACRO('def', function(name, value) {
    var c_name, first_group, ret;
    first_group = Scope.top();
    c_name = compile(name);
    return ret = __var(name, value, first_group);
  });

  DEFMACRO('set!', function(name, value) {
    var c_name, c_value, ret;
    c_name = compile(name);
    c_value = compile(value);
    if (c_name === (to_js_symbol(c_name))) {
      Scope.set(c_name, "variable");
      return ret = "" + c_name + " = " + c_value;
    } else {
      return raise("SetError", "Can't set complex symbol: " + c_name);
    }
  });

  /*
  MATH
  */

  math_fn = function(fn, symbol) {
    return DEFMACRO(fn, function() {
      var c_nums, nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      c_nums = _.map(nums, compile);
      return c_nums.join(" " + (symbol || fn) + " ");
    });
  };

  math_fn("+");

  math_fn("-");

  math_fn("*");

  math_fn("/");

  math_fn("%");

  /*
  BINARY
  */

  binary_fn = function(fn, symbol) {
    return DEFMACRO(fn, function() {
      var c_nums, nums, ret;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      c_nums = _.map(nums, compile);
      ret = c_nums.join(" " + (symbol || fn) + " ");
      return "(" + ret + ")";
    });
  };

  binary_fn("||");

  binary_fn("&&");

  /*
  COMPARISONS
  */

  compare_fn = function(fn, symbol) {
    return DEFMACRO(fn, function() {
      var c_items, item, items, last, ret, _i, _len, _ref3;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      c_items = _.map(items, compile);
      ret = [];
      last = c_items[0];
      _ref3 = c_items.slice(1);
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        item = _ref3[_i];
        ret.push("" + last + " " + (symbol || fn) + " " + item);
        last = item;
      }
      return "(" + (ret.join(' && ')) + ")";
    });
  };

  compare_fn("<");

  compare_fn(">");

  compare_fn("<=");

  compare_fn(">=");

  compare_fn("==");

  compare_fn("not==", "!=");

  compare_fn("===");

  compare_fn("not===", "!==");

  /*
  ERRORS
  */

  DEFMACRO('throw', function(err) {
    var c_err;
    c_err = compile(err);
    return "(function () { throw " + c_err + " })()";
  });

  (function() {
    var mc_expand, mc_expand_1;
    mc_expand = false;
    mc_expand_1 = false;
    DEFMACRO('defmacro', function() {
      var argnames, base, c_name, name, template;
      name = arguments[0], argnames = arguments[1], template = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if (argnames == null) argnames = [];
      c_name = compile(name);
      base = compiler;
      Scope.def(c_name, "macro", "global");
      base[c_name] = function() {
        var evald, js, q_args, sexp;
        q_args = _.map(arguments, to_quoted);
        sexp = [[to_symbol('lambda'), argnames].concat(template)].concat(q_args);
        js = compile(sexp);
        evald = eval(js);
        if (!mc_expand && !mc_expand_1) {
          return compile(evald);
        } else {
          mc_expand_1 = false;
          return evald;
        }
      };
      return "null";
    });
    DEFMACRO('macroexpand', function(sexp) {
      var old_mc_expand, ret;
      old_mc_expand = mc_expand;
      mc_expand = true;
      ret = compile(sexp);
      ret = compile(to_quoted(ret));
      mc_expand = old_mc_expand;
      return ret;
    });
    DEFMACRO('macroexpand-1', function(sexp) {
      var ret;
      mc_expand_1 = true;
      ret = compile(sexp);
      ret = compile(to_quoted(ret));
      mc_expand_1 = false;
      return ret;
    });
    return DEFMACRO('syntax-quote', function(list) {
      var code, ident, q_list, restructured_list, ret, sym;
      sym = to_symbol;
      ident = gensym('list');
      restructured_list = restructure_list(list, ident);
      restructured_list[1] = [sym('js-eval'), restructured_list[1]];
      q_list = to_quoted(list);
      code = [[sym('lambda'), [sym(ident)], [sym("var")].concat(__slice.call(restructured_list))], q_list];
      return ret = compile(code);
    });
  })();

  (function() {
    var adjust_environment, def, defmacro, restore_environment;
    def = [];
    defmacro = [];
    adjust_environment = function(module_name, names, scope) {
      var s_module_name, _var;
      s_module_name = get_raw_text(module_name);
      modules[s_module_name] = {
        names: names,
        scope: scope
      };
      _var = GETMACRO('var');
      def.push(GETMACRO('def'));
      return compiler.def = function(name, value) {
        names.push(name);
        return _var(name, value, scope);
      };
    };
    restore_environment = function() {
      return compiler.def = def.pop();
    };
    DEFMACRO('defmodule', function() {
      var args, body, c_body, c_deps, deps, export_names, js_map_args, name, r_deps, r_name, ret, return_val, scope, symbols, values, var_stmt, vars;
      name = arguments[0], deps = arguments[1], body = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if (deps == null) deps = [];
      scope = Scope.make_new();
      r_name = compile(get_raw_text(name));
      r_deps = _.map(deps, _.compose(compile, get_raw_text));
      c_deps = compile([to_symbol("quote"), r_deps]);
      args = _.map(deps, compile);
      export_names = [];
      adjust_environment(name, export_names, scope);
      body = body.length ? body : [null];
      c_body = _.map(body, compile);
      values = export_names;
      symbols = _.map(values, to_quoted);
      js_map_args = Array.prototype.concat.apply([], _.zip(symbols, values));
      return_val = compile([to_symbol('js-map')].concat(__slice.call(js_map_args)));
      vars = Scope.end_current();
      restore_environment();
      var_stmt = vars.length ? "var " + (vars.join(', ')) + ";\n" : '';
      return ret = "oppo.module(" + r_name + ", " + c_deps + ", function (" + (args.join(', ')) + ") {\n  " + var_stmt + (c_body.join(',\n')) + ";\n  return " + return_val + "\n})";
    });
    return DEFMACRO('require', function() {
      var c_names, name, names, r_name, ret, _var;
      names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _var = GETMACRO('var');
      c_names = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          r_name = get_raw_text(name);
          _results.push(ret = __var(name, [to_symbol('js-eval'), "oppo.module.require(" + (compile(r_name)) + ")"], null, "module"));
        }
        return _results;
      })();
      return c_names.join(',\n');
    });
  })();

  DEFMACRO('str', function() {
    var c_strs, first_is_str, initial_str, strs;
    strs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    first_is_str = null;
    if (strs.length === 0) strs.push("");
    c_strs = _.map(strs, function(s) {
      var c_s;
      if ((is_quoted(s)) && is_symbol(s[1])) s = to_js_symbol(s[1][1]);
      c_s = compile(s);
      if (first_is_str == null) first_is_str = is_string(c_s);
      return c_s;
    });
    initial_str = first_is_str ? '' : '"" + ';
    return "" + initial_str + (c_strs.join(' + '));
  });

  DEFMACRO('keyword', function(key) {
    var e_key;
    if ((is_quoted(key)) && (is_symbol((e_key = oppo.eval(key))))) {
      return compile(e_key[1]);
    } else if (_.isString(key)) {
      return compile(key);
    } else {
      return compile([to_symbol('str'), key]);
    }
  });

  DEF('root', "typeof global !== 'undefined' ? global : window");

  DEF('_', "{0}._ || (require && require('underscore'))", ["root"]);

  (function() {
    var fname, name, oppo_names, underscore_fns, value, _results;
    underscore_fns = {
      include: null,
      invoke: null,
      pluck: null,
      shuffle: null,
      toArray: ["->arr", "->array"],
      size: null,
      first: ["first", "head"],
      initial: ["initial", "init"],
      last: null,
      rest: ["rest", "tail"],
      compact: null,
      flatten: null,
      without: null,
      union: null,
      intersection: null,
      difference: null,
      zip: null,
      range: null,
      bind: null,
      bindAll: ["bind-all"],
      memoize: null,
      delay: null,
      defer: null,
      throttle: null,
      debounce: null,
      once: null,
      after: null,
      wrap: null,
      compose: null,
      keys: null,
      values: null,
      functions: null,
      clone: null,
      tap: null,
      isEmpty: ["empty?"],
      isElement: ["element?"],
      isArray: ["array?", "list?"],
      isArguments: ["arguments?"],
      isFunction: ["function?", "fn?"],
      isString: ["string?", "str?"],
      isNumber: ["number?", "num?"],
      isBoolean: ["boolean?", "bool?"],
      isDate: ["date?"],
      isRegExp: ["regex?"],
      isNaN: ["nan?"],
      isNull: ["nil?"],
      isUndefined: ["undefined?"],
      identity: null,
      times: null,
      uniqueId: ["unique-id"],
      escape: ["escape-html"],
      template: null,
      chain: null,
      value: null
    };
    _results = [];
    for (fname in underscore_fns) {
      if (!__hasProp.call(underscore_fns, fname)) continue;
      oppo_names = underscore_fns[fname];
      if (oppo_names == null) oppo_names = [fname];
      value = "{0}." + fname;
      _results.push((function() {
        var _i, _len, _results2;
        _results2 = [];
        for (_i = 0, _len = oppo_names.length; _i < _len; _i++) {
          name = oppo_names[_i];
          _results2.push(DEF(name, value, ["_"]));
        }
        return _results2;
      })());
    }
    return _results;
  })();

  get_from_prototype = function(obj, method) {
    var name;
    name = "__" + method + "__";
    DEF(name, "{0}." + obj + ".prototype." + method, ["root"]);
    return name;
  };

  use_from_prototype = function(obj, method, oppo_name) {
    var temp;
    if (oppo_name == null) oppo_name = method;
    temp = get_from_prototype(obj, method);
    return DEF(oppo_name, "function (base) {\n  var args;\n  args = {0}.call(arguments, 1);\n  return {1}.apply(base, args);\n}", ["__slice__", temp]);
  };

  get_many_from_prototype = function(obj, methods) {
    var method, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      method = methods[_i];
      _results.push(get_from_prototype(obj, method));
    }
    return _results;
  };

  use_many_from_prototype = function(obj, methods) {
    var args, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      args = methods[_i];
      if (!_.isArray(args)) args = [args];
      args.unshift(obj);
      _results.push(use_from_prototype.apply(null, args));
    }
    return _results;
  };

  use_properties = function(obj, props) {
    var js_name, oppo_name, prop, _i, _len, _obj, _results;
    _results = [];
    for (_i = 0, _len = props.length; _i < _len; _i++) {
      prop = props[_i];
      if (!_.isArray(prop)) prop = [prop];
      js_name = prop[0], oppo_name = prop[1];
      if (oppo_name == null) oppo_name = js_name;
      _obj = obj != null ? "." + obj : "";
      _results.push(DEF(oppo_name, "{0}" + _obj + "." + js_name, ["root"]));
    }
    return _results;
  };

  use_root_properties = function(props) {
    return use_properties(null, props);
  };

  make_math_fn = function(symbol, js_symbol) {
    if (js_symbol == null) js_symbol = symbol;
    return DEF(symbol, "function () {\n  var i, num, len, current;\n  num = arguments[0];\n  for (i = 1, len = arguments.length; i < len; i++) {\n    current = arguments[i];\n    num " + js_symbol + "= current;\n  }\n  return num;\n}");
  };

  make_math_fn('+');

  make_math_fn('*');

  make_math_fn('-');

  make_math_fn('/');

  make_math_fn('%');

  use_properties("Math", ["E", "LN2", "LN10", "LOG2E", "LOG10E", "PI", ["SQRT1_2", "sqrt1/2"], "SQRT2", "abs", "acos", "asin", "atan", "atan2", "ceil", "cos", "exp", "floor", "log", "max", "min", ["pow", "**"], "pow", "round", "sin", "sqrt", "tan"]);

  DEF("random", "function (_1, _2) {\n  var r, min, max;\n  r = Math.random;\n  switch (arguments.length) {\n    case 0: return r();\n    case 1:\n      max = _1;\n      return {0}(r() * max);\n    case 2:\n      min = _1;\n      max = _2;\n      return {0}(r() * (max - min)) + min;\n  }\n}", ["floor"]);

  DEF("rand", "{0}", ["random"]);

  use_root_properties([["isFinite", "finite?"], "Infinity", "NaN", ["parseFloat", "->float"]]);

  DEF("->int", "function (s, r) { return parseInt(s, r == null ? 10 : r); }");

  DEF("-infinity", "-{0}", ["infinity"]);

  DEF("->base", "function (n, base) {\n  return (+n).toString(base);\n}");

  make_comparison_fn = function(symbol, compare_fn, deps) {
    var js_symbol;
    if (_.isString(compare_fn)) {
      js_symbol = compare_fn;
      compare_fn = null;
    } else {
      js_symbol = symbol;
    }
    if (compare_fn == null) {
      compare_fn = function(a, b) {
        return "" + a + " " + js_symbol + " " + b;
      };
    }
    return DEF(symbol, "function () {\n  var i, item, last, len, result;\n  last = arguments[0];\n  for (i = 1, len = arguments.length; i < len; i++) {\n    item = arguments[i];\n    result = " + (compare_fn("last", "item")) + ";\n    if (!result) break;\n  }\n  return result;\n}", deps);
  };

  make_comparison_fn("<");

  make_comparison_fn(">");

  make_comparison_fn("<=");

  make_comparison_fn(">=");

  make_comparison_fn("==");

  make_comparison_fn("===");

  make_comparison_fn("not==", "!=");

  make_comparison_fn("not===", "!==");

  make_comparison_fn("=", (function(a, b) {
    return "{0}.isEqual(" + a + ", " + b + ")";
  }), ["_"]);

  DEF("equal?", "{0}", ["="]);

  DEF("not=", "function () { return !{0}(); }", ["="]);

  DEF('->bool', compile([to_symbol('lambda'), [to_symbol('x')], [to_symbol('if'), to_symbol('x'), [to_symbol('js-eval'), 'true'], [to_symbol('js-eval'), 'false']]]));

  DEF('->boolean', "{0}", ["->bool"]);

  DEF('not', "function (x) { return !{0}(x); }", ["->bool"]);

  DEF('->str', "function (x) {\n  return x.toString ? x.toString : '' + x;\n}");

  DEF('->string', "{0}", ["->str"]);

  DEF('->num', "function (x) { return +x; }");

  DEF('->number', "{0}", ["->num"]);

  DEF('->js-map', "function (x) { return Object(x); }");

  DEF('and', "function () {\n  var i, len, item;\n  i = 0;\n  len = arguments.length;\n  for (; i < len; i++) {\n    item = arguments[i];\n    if (!{0}(item))\n      break;\n  }\n  return item;\n}", ["->bool"]);

  DEF('or', "function () {\n  var i, len, item;\n  i = 0;\n  len = arguments.length;\n  for (; i < len; i++) {\n    item = arguments[i];\n    if ({0}(item))\n      break;\n  }\n  return item;\n}", ["->bool"]);

  slice = get_from_prototype("Array", "slice");

  sort = get_from_prototype("Array", "sort");

  join = get_from_prototype("Array", "join");

  (function() {
    var build;
    DEF("__iterator_builder_1__", "function (method_name) {\n  var method = {0}[method_name];\n  return function (a, fn, context) {\n    var args = {1}(arguments);\n    if (fn) {\n      args[1] = {2}(a) ? function (v, k, o) {\n        return fn(v, k + 1, o);\n      } : fn;\n    }\n    return method.apply({0}, args);\n  };\n}", ["_", "->array", "array?"]);
    build = function(name, js_name) {
      if (js_name == null) js_name = name;
      return DEF(name, "{0}('" + js_name + "')", ["__iterator_builder_1__"]);
    };
    build("each");
    build("map");
    build("find");
    build("filter");
    build("reject");
    build("all");
    build("any");
    return build("group-by", "groupBy");
  })();

  (function() {
    var build;
    DEF("__iterator_builder_2__", "function (method_name) {\n  var method = {2}[method_name];\n  return function (a, fn, memo, context) {\n    var args = {0}(arguments);\n    if (fn) {\n      args[1] = {1}(a) ? function (main, v, k, o) {\n        return fn(main, v, k + 1, o)\n      } : fn;\n    }\n    return method.apply({2}, args);\n  };\n}", ["->array", "array?", "_"]);
    build = function(name, js_name) {
      if (js_name == null) js_name = name;
      return DEF(name, "{0}('" + js_name + "')", ["__iterator_builder_2__"]);
    };
    build("reduce");
    DEF("foldl", "{0}", ["reduce"]);
    build("reduce-right", "reduceRight");
    return DEF("foldr", "{0}", ["reduce-right"]);
  })();

  DEF("slice", "function (a) {\n  var args;\n  args = {0}.call(arguments, 1);\n  return a.slice.apply(a, args);\n}", [slice]);

  DEF("sorted-index", "function (a) {\n  return {0}.sortedIndex.apply({0}, arguments) + 1;\n}", ["_"]);

  DEF("join", "function (a, sep) {\n  return {0}.call(a, sep != null ? sep : '');\n}", [join]);

  DEF("uniq", "function (a, sorted, fn) {\n  var args = {0}(arguments);\n  if (fn) {\n    args[2] = fn && function (v, k, o) {\n      return fn(v, k + 1, o);\n    };\n  }\n  return {1}.uniq.apply({1}, args);\n}", ["->array", "_"]);

  DEF("unique", "{0}", ["uniq"]);

  DEF("concat", "function (base) {\n  var args;\n  args = {0}.call(arguments, 1);\n  return base.concat.apply(base, args);\n}", [slice]);

  DEF("nth", "function (a, i) {\n  i = +i;\n  if (i === 0)\n    console.warn(\"Trying to get 0th item with nth; nth treats lists as 1-based\");\n    \n  if (i < 0)\n    i = (a || []).length + i;\n  else\n    i -= 1;\n    \n  return {0}(a) ? a[i] : {1}(a) ? a.charAt(i) : (function () { throw \"Can't get nth item: collection must be a list or a string\"; })();\n}", ["array?", "string?"]);

  DEF("index-of", "function (a, x, sorted) {\n  return ({0}(a) ? a.indexOf(x) : {1}.indexOf(a, x, sorted)) + 1;\n}", ["string?", "_"]);

  DEF("last-index-of", "function (a, x) {\n  return ({0}(a) ? a.lastIndexOf(x) : {1}.lastIndexOf(a, x)) + 1;\n}", ["string?", "_"]);

  DEF("sort", "function (a, fn, context) {\n  var iterator, isArray;\n  if ({0}(a)) {\n    if (!fn) return a.slice().sort();\n    iterator = function (v, k, o) {\n      return fn(v, k + 1, o);\n    };\n  }\n  else iterator = fn;\n  return {1}.sortBy(a, iterator, context);\n}", ["->array", "_"]);

  DEF("reverse", "function (a) {\n  var str, ret;\n  str = {0}(a);\n  ret = str ? a.split('') : a.slice();\n  ret.reverse();\n  return str ? ret.join('') : ret;\n}", ["string?"]);

  to_lower = get_from_prototype("String", "toLowerCase");

  to_upper = get_from_prototype("String", "toUpperCase");

  split = get_from_prototype("String", "split");

  trim = get_from_prototype("String", "trim");

  rtrim = get_from_prototype("String", "trimRight");

  ltrim = get_from_prototype("String", "trimLeft");

  DEF("rtrim", "function (s) {\n  return {0} ? {0}.call(s) : s.replace(/\s+$/, '');\n}", [rtrim]);

  DEF("trim-right", "{0}", ["rtrim"]);

  DEF("ltrim", "function (s) {\n  return {0} ? {0}.call(s) : s.replace(/^\s+/, '');\n}", [ltrim]);

  DEF("trim-left", "{0}", ["ltrim"]);

  DEF("trim", "function (s) {\n  return {0} ? {0}.call(s) : {1}({2}(s));\n}", [trim, "ltrim", "rtrim"]);

  DEF("->lower", "function (s) { return {0}.call(s); }", [to_lower]);

  DEF("->upper", "function (s) { return {0}.call(s); }", [to_upper]);

  use_many_from_prototype("String", ["split", "replace", ["search", "str-search"], "substr", "substring", ["charCodeAt", "char-code-at"], "match", ["toLocaleLowerCase", "->locale-lower"], ["toLocaleUpperCase", "->locale-upper"], ["localeCompare", "locale-compare"]]);

  DEF("merge", "function () {\n  var args = {0}(arguments);\n  args.unshift({});\n  return {1}.extend.apply({1}, args);\n}", ["->array", "_"]);

  DEF("careful-merge", "function () {\n  var args = {0}(arguments);\n  args.unshift({});\n  return {1}.defaults.apply({1}, args);\n}", ["->array", "_"]);

  DEF("__create__", "Object.create");

  DEF("extend", "(function () {\n  return {0} ? function (proto) { return {0}(proto != null ? proto : null); } :\n  function (proto) {\n    function noop() {}\n    noop.prototype = proto != null ? proto : null;\n    return new noop;\n  };\n})()", ["__create__"]);

  DEF("merge-extend", "function (o, proto) {\n  var ret;\n  ret = {0}(proto);\n  return {1}.extend(ret, o);\n}", ["extend", "_"]);

  use_many_from_prototype("RegExp", [["exec", "re-exec"], ["test", "re-test"]]);

  use_many_from_prototype("Number", [["toExponential", "->exponential"], ["toFixed", "->fixed"], ["toLocaleString", "->locale-string"], ["toPrecision", "->precision"]]);

  DEF("date", "function (a, b, c, d, e, f, g) {\n  var d, D;\n  D = {0}.Date;\n  switch (arguments.length) {\n    case 0: d = new D(); break;\n    case 1: d = new D(a); break;\n    case 2: d = new D(a, b); break;\n    case 3: d = new D(a, b, c); break;\n    case 4: d = new D(a, b, c, d); break;\n    case 5: d = new D(a, b, c, d, e); break;\n    case 6: d = new D(a, b, c, d, e, f); break;\n    case 7: d = new D(a, b, c, d, e, f, g); break;\n  }\n  return d;\n}", ["root"]);

  DEF("now", "(function () {\n  var D;\n  D = {0}.Date;\n  return D.now ? D.now : function () { return +(new Date); }\n})()", ["root"]);

  use_many_from_prototype("Date", [["getDate", "get-date"], ["getDay", "get-day"], ["getFullYear", "get-year"], ["getHours", "get-hours"], ["getMilliseconds", "get-milliseconds"], ["getMinutes", "get-minutes"], ["getMonth", "get-month"], ["getSeconds", "get-seconds"], ["getTime", "get-time"], ["getTimezoneOffset", "get-timezone-offset"], ["getUTCDate", "get-utc-date"], ["getUTCDay", "get-utc-day"], ["getUTCFullYear", "get-utc-full-year"], ["getUTCHours", "get-utc-hours"], ["getUTCMilliseconds", "get-utc-milliseconds"], ["getUTCMinutes", "get-utc-minutes"], ["getUTCMonth", "get-utc-month"], ["getUTCSeconds", "get-utc-seconds"], ["setDate", "set-date!"], ["setFullYear", "set-year!"], ["setHours", "set-hours!"], ["setMilliseconds", "set-milliseconds!"], ["setMinutes", "set-minutes!"], ["setMonth", "set-month!"], ["setSeconds", "set-seconds!"], ["setTime", "set-time!"], ["setUTCDate", "set-utc-date!"], ["setUTCFullYear", "set-utc-year!"], ["setUTCHours", "set-utc-hours!"], ["setUTCMilliseconds", "set-utc-milliseconds!"], ["setUTCMinutes", "set-utc-minutes!"], ["setUTCMonth", "set-utc-month!"], ["setUTCSeconds", "set-utc-seconds!"], ["toDateString", "->date-string"], ["toISOString", "->iso-string"], ["toJSON", "->json"], ["toLocaleDateString", "->locale-date-string"], ["toLocaleTimeString", "->locale-time-string"], ["toTimeString", "->time-string"], ["toUTCString", "->utc-string"]]);

  DEF("json-stringify", "{0}.JSON.stringify", ["root"]);

  DEF("json-parse", "{0}.JSON.parse", ["root"]);

}).call(this);
