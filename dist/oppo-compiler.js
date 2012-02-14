(function() {
  var DEFMACRO, GETMACRO, JS_ILLEGAL_IDENTIFIER_CHARS, JS_KEYWORDS, Scope, binary_fn, compare_fn, compile, compiler, create_object, destructure_list, gensym, get_raw_text, is_keyword, is_quoted, is_splat, is_string, is_symbol, is_unquote, make_error, math_fn, modules, objectSet, oppo, quote_escape, raise, raiseDefError, raiseParseError, raiseSetError, read, read_compile, recursive_map, restructure_list, to_js_symbol, to_list, to_quoted, to_symbol, trim, _is, _ref, _ref2,
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
    "(": "oparen",
    ")": "cparen",
    "-": "minus",
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
        raise("VarGroupsError", "Expecting 1 final scope, got " + scopes.length + " instead");
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

  DEFMACRO = function(name, fn) {
    var c_name;
    c_name = compile(to_symbol(name));
    Scope.def(c_name, "macro", "global");
    return compiler[c_name] = fn;
  };

  GETMACRO = function(name) {
    var c_name;
    c_name = compile(to_symbol(name));
    return compiler[c_name];
  };

  /*
  READ, EVAL, COMPILE
  */

  read = oppo.read = function(string) {
    return parser.parse(string);
  };

  compile = null;

  (function() {
    var _compile;
    _compile = function(sexp, top_level) {
      var args, corename, fn, from_core, macro, prefix, ret, varname, vars, _ref3;
      if (sexp == null) sexp = null;
      if (top_level == null) top_level = false;
      if (top_level) {
        corename = "oppo/core";
        from_core = (_ref3 = modules[corename]) != null ? _ref3.names : void 0;
        if (!(from_core != null)) {
          from_core = _.keys((oppo.module.require(corename)) || {});
        }
        if (from_core.length) {
          prefix = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = from_core.length; _i < _len; _i++) {
              varname = from_core[_i];
              _results.push(compile([to_symbol("var"), to_symbol(varname), [to_symbol('.'), to_symbol(corename), to_quoted(to_symbol(varname))]]));
            }
            return _results;
          })();
          prefix.unshift(compile([to_symbol('require'), to_symbol(corename)]));
        }
      }
      if ((sexp === null || sexp === true || sexp === false) || _.isNumber(sexp)) {
        ret = "" + sexp;
      } else if (is_symbol(sexp)) {
        ret = to_js_symbol(sexp[1]);
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
        prefix = prefix != null ? "" + (prefix.join(',\n')) + "\n" : '';
        ret = "" + vars + prefix + ret + ";";
      }
      return ret;
    };
    compile = function(sexp) {
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

  DEFMACRO('eval', function(sexp) {
    var c_sexp;
    c_sexp = compile(sexp);
    return "eval(compile(" + c_sexp + "))";
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
    var e_sym;
    e_sym = eval(compile([to_symbol("str"), sym]));
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
    return "/* if */ ((" + cond + ") !== false && " + sym + " !== null && " + sym + " !== '' ?\n  " + (compile(t)) + " :\n  " + (compile(f)) + ")\n/* end if */";
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

  DEFMACRO('var', function(name, value) {
    var c_name, c_value;
    c_name = compile(name);
    c_value = compile(value);
    Scope.def(c_name, "variable");
    return "" + c_name + " = " + c_value;
  });

  DEFMACRO('def', function(name, value) {
    var c_name, first_group, ret, _var;
    _var = GETMACRO('var');
    first_group = Scope.top();
    c_name = compile(name);
    if (c_name === (to_js_symbol(c_name))) {
      return ret = _var(name, value, first_group);
    } else {
      return raise("DefError", "Can't define complex symbol: " + c_name);
    }
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
      var argnames, c_name, c_value, name, template;
      name = arguments[0], argnames = arguments[1], template = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if (argnames == null) argnames = [];
      c_name = compile(name);
      c_value = "(function () {\n  return eval(oppo.compiler." + c_name + ".apply(this, arguments));\n})";
      Scope.def(c_name, "macro");
      compiler[c_name] = function() {
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
      return "" + c_name + " = " + c_value;
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
      var _var;
      modules[module_name[1]] = {
        names: names,
        scope: scope
      };
      _var = GETMACRO('var');
      def.push(GETMACRO('def'));
      compiler.def = function(name, value) {
        names.push(name);
        return _var(name, value, scope);
      };
      defmacro.push(GETMACRO('defmacro'));
      return compiler.defmacro = function() {
        var name, rest;
        name = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        names.push(name);
        return defmacro.apply(null, arguments);
      };
    };
    restore_environment = function() {
      compiler.def = def.pop();
      return compiler.defmacro = defmacro.pop();
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
          _results.push(ret = _var(name, [to_symbol('js-eval'), "oppo.module.require(" + (compile(r_name)) + ")"]));
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

}).call(this);
