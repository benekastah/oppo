(function() {
  var JS_ILLEGAL_IDENTIFIER_CHARS, JS_KEYWORDS, began, binary_fn, compare_fn, compile, compiler, destructure_list, end_final_var_group, end_var_group, first_var_group, gensym, get_raw_text, initialize_var_groups, is_keyword, is_quoted, is_splat, is_string, is_symbol, is_unquote, last_var_group, make_error, math_fn, mc_expand, mc_expand_1, new_var_group, objectSet, oppo, quote_all, quote_escape, raise, raiseDefError, raiseParseError, read, read_compile, recursive_map, restructure_list, to_js_symbol, to_symbol, trim, _is, _ref, _ref2, _ref3,
    __hasProp = Object.prototype.hasOwnProperty,
    __slice = Array.prototype.slice,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (typeof global === "undefined" || global === null) global = window;

  if (typeof _ === "undefined" || _ === null) _ = require('underscore');

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

  /*
  Vars
  */

  _ref2 = [], new_var_group = _ref2[0], first_var_group = _ref2[1], last_var_group = _ref2[2], end_var_group = _ref2[3], end_final_var_group = _ref2[4], initialize_var_groups = _ref2[5];

  (function() {
    var var_groups;
    var_groups = null;
    initialize_var_groups = function() {
      return var_groups = [[]];
    };
    initialize_var_groups();
    new_var_group = function() {
      var ret;
      var_groups.push((ret = []));
      return ret;
    };
    first_var_group = function() {
      return var_groups[0];
    };
    last_var_group = function() {
      return _.last(var_groups);
    };
    end_var_group = function() {
      var ret;
      ret = var_groups.pop();
      return ret;
    };
    return end_final_var_group = function() {
      var ret;
      if (var_groups.length !== 1) {
        raise("VarGroupsError", "Expecting 1 final var group, got " + var_groups.length + " instead");
      }
      ret = end_var_group();
      initialize_var_groups();
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

  compiler = (_ref3 = oppo.compiler) != null ? _ref3 : oppo.compiler = {};

  /*
  READER, EVAL, COMPILE
  */

  read = oppo.read = function(string) {
    return parser.parse(string);
  };

  began = false;

  compile = oppo.compile = function(sexp, init_vars) {
    var args, fn, macro, ret, top_level, vars;
    if (sexp == null) sexp = null;
    if (init_vars == null) init_vars = false;
    if (!began) top_level = began = true;
    if ((sexp === null || sexp === true || sexp === false) || _.isNumber(sexp)) {
      ret = "" + sexp;
    } else if (is_symbol(sexp)) {
      ret = to_js_symbol(sexp[1]);
    } else if (_.isString(sexp)) {
      ret = "\"" + (sexp.replace(/\n/g, '\\n')) + "\"";
    } else if (_.isArray(sexp)) {
      fn = oppo.compile(_.first(sexp));
      args = sexp.slice(1);
      if ((macro = compiler[fn])) {
        ret = macro.apply(null, args);
      } else {
        ret = compiler.call.apply(compiler, [[to_symbol("js-eval"), fn]].concat(__slice.call(args)));
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

  read_compile = _.compose(oppo.compile, oppo.read);

  compiler.js_map = function() {
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
  };

  compiler[to_js_symbol(".")] = function() {
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
  };

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
    compiler.lambda = function() {
      var args, argsbody, body, ret, var_stmt, vars, _ref4;
      args = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      new_var_group();
      _ref4 = get_args(args), args = _ref4[0], argsbody = _ref4[1];
      body = argsbody.concat(body);
      body = _.map(body, compile);
      vars = end_var_group();
      var_stmt = vars.length ? "var " + (vars.join(', ')) + ";\n" : '';
      return ret = "(function (" + (args.join(", ")) + ") {\n  " + var_stmt + "return " + (body.join(', ')) + ";\n})";
    };
    return compiler.fn = compiler.lambda;
  })();

  compiler.call = function() {
    var args, c_args, c_fn, fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    c_fn = compile(fn);
    c_args = _.map(args, compile);
    return "" + c_fn + "(" + (c_args.join(', ')) + ")";
  };

  compiler.apply = function() {
    var args, c_args, c_fn, fn, fn_base, spl_fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    c_fn = compile(fn);
    spl_fn = c_fn.split('.');
    spl_fn.pop();
    fn_base = spl_fn.join('.');
    c_args = _.map(args, compile);
    return "" + c_fn + ".apply(" + (fn_base || null) + ", [].concat(" + (c_args.join(', ')) + "))";
  };

  compiler[to_js_symbol('let')] = function() {
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
  };

  compiler[to_js_symbol('new')] = function() {
    var args, c_args, c_cls, cls;
    cls = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    c_cls = compile(cls);
    c_args = _.map(args, compile);
    return "new " + c_cls + "(" + (c_args.join(', ')) + ")";
  };

  compiler.quote = function(sexp) {
    var q_sexp, ret, s_sexp;
    sexp = quote_escape(sexp);
    if (!(sexp != null)) null;
    if (_.isBoolean(sexp)) {
      return sexp;
    } else if (_.isArray(sexp)) {
      q_sexp = _.map(sexp, compile);
      return ret = "[" + (q_sexp.join(', ')) + "]";
    } else if (_.isNumber(sexp)) {
      return ret = sexp;
    } else {
      s_sexp = "" + sexp;
      return ret = "\"" + (s_sexp.replace(/"/g, '\\"')) + "\"";
    }
  };

  compiler.symbol = function(sym) {
    var e_sym;
    e_sym = eval(compile([to_symbol("str"), sym]));
    return compile(to_symbol(e_sym));
  };

  compiler.js_eval = function(js) {
    var c_js, e_js, ret;
    c_js = compile(js);
    if (is_string(c_js)) {
      e_js = c_js.substr(1, c_js.length - 2);
      e_js = e_js.replace(/\\?"/g, '\\"');
      return ret = eval("\"" + e_js + "\"");
    } else {
      return ret = "eval(" + c_js + ")";
    }
  };

  compiler[to_js_symbol('do')] = function() {
    var body, compiled_body, ret;
    body = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    compiled_body = _.map(arguments, compile);
    ret = compiled_body.join(',\n');
    return "(" + ret + ")";
  };

  compiler[to_js_symbol('if')] = function(test, t, f) {
    var c_f, c_t, c_test, cond, sym, _ref4;
    if (arguments.length === 2) Array.prototype.push.call(arguments, f);
    _ref4 = _.map(arguments, compile), c_test = _ref4[0], c_t = _ref4[1], c_f = _ref4[2];
    sym = gensym("cond");
    cond = compile([to_symbol('var'), to_symbol(sym), test]);
    return "/* if */ ((" + cond + ") !== false && " + sym + " !== null && " + sym + " !== '' ?\n  " + (compile(t)) + " :\n  " + (compile(f)) + ")\n/* end if */";
  };

  compiler.regex = function(body, modifiers) {
    return "/" + body + "/" + (modifiers != null ? modifiers : '');
  };

  compiler[to_js_symbol('undefined?')] = function(x) {
    var c_x;
    c_x = compile(x);
    return "(typeof " + c_x + " === 'undefined')";
  };

  compiler[to_js_symbol('defined?')] = function(x) {
    var c_x;
    c_x = compile(x);
    return "(typeof " + c_x + " !== 'undefined')";
  };

  /*
  MODULES
  */

  (function() {
    var get_args, get_deps;
    get_deps = function(deps) {
      var item, new_item, result;
      result = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = deps.length; _i < _len; _i++) {
          item = deps[_i];
          if (is_quoted(item)) item = item[1];
          new_item = is_symbol(item) ? get_raw_text(item) : is_keyword(item) ? item : _.isArray(item) ? get_deps(item) : raise("ModuleError: Invalid dependency: " + item);
          _results.push([to_symbol('js-eval'), compile(new_item)]);
        }
        return _results;
      })();
      return [to_symbol('quote'), result];
    };
    get_args = function(deps) {
      var args, item, q_a, _i, _len;
      if (is_quoted(deps)) deps = deps[1];
      args = [];
      for (_i = 0, _len = deps.length; _i < _len; _i++) {
        item = deps[_i];
        if (is_quoted(item)) item = item[1];
        if (is_symbol(item)) {
          args.push(item);
        } else if ((_.isArray(item)) && !is_keyword(item)) {
          if ((oppo.eval(item[1])) === "use") {
            q_a = item[2];
            args.push.apply(args, q_a[1]);
          }
        }
      }
      return args;
    };
    compiler.defmodule = function() {
      var args, body, c_args, c_body, c_deps, deps, name, r_deps, r_name, ret;
      name = arguments[0], deps = arguments[1], body = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if (deps == null) deps = [];
      r_name = compile(get_raw_text(name));
      r_deps = get_deps(deps);
      c_deps = compile(r_deps);
      args = get_args(deps);
      c_args = _.map(args, compile);
      c_body = compile([to_symbol('do')].concat(__slice.call(body)));
      return ret = "oppo.module(" + r_name + ", " + c_deps + ", function (" + (c_args.join(', ')) + ") {\n  return " + c_body + ";\n})";
    };
    return compiler.require = function() {
      var c_names, name, names, r_name;
      names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      c_names = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          r_name = get_raw_text(name);
          _results.push("oppo.module.require(" + (compile(r_name)) + ")");
        }
        return _results;
      })();
      return c_names.join(',\n');
    };
  })();

  /*
  VARIABLES
  */

  compiler.gensym = function() {
    var ret, sym;
    sym = gensym.apply(null, arguments);
    return ret = compile([to_symbol('quote'), to_symbol(sym)]);
  };

  compiler[to_js_symbol('var')] = function(name, value, current_group) {
    var c_name, c_value;
    if (current_group == null) current_group = last_var_group();
    c_name = compile(name);
    c_value = compile(value);
    if (__indexOf.call(current_group, c_name) >= 0) raiseDefError(c_name);
    current_group.push(c_name);
    return "" + c_name + " = " + c_value;
  };

  compiler.def = function(name, value) {
    var c_name, c_value, err, first_group, ret, _var;
    _var = compiler[to_js_symbol('var')];
    first_group = first_var_group();
    c_name = compile(name);
    if (c_name === to_js_symbol(c_name)) {
      return ret = _var(name, value, first_group);
    } else {
      c_value = compile(value);
      err = read_compile("(throw \"Can't define variable that is already defined: " + c_name + "\")");
      return ret = "/* def " + c_name + " */ (typeof " + c_name + " === 'undefined' ?\n  (" + c_name + " = " + c_value + ") :\n  " + err + ")\n/* end def " + c_name + " */";
    }
  };

  compiler[to_js_symbol('set!')] = function(name, value) {
    var c_name, c_value, err, ret;
    c_name = compile(name);
    c_value = compile(value);
    err = read_compile("(throw \"Can't set variable that has not been defined: " + c_name + "\")");
    return ret = "/* set! " + c_name + " */ (typeof " + c_name + " !== 'undefined' ?\n  (" + c_name + " = " + c_value + ") :\n  " + err + ")\n/* end set! " + c_name + " */";
  };

  /*
  MATH
  */

  math_fn = function(fn, symbol) {
    return compiler[to_js_symbol(fn)] = function() {
      var c_nums, nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      c_nums = _.map(nums, compile);
      return c_nums.join(" " + (symbol || fn) + " ");
    };
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
    return compiler[to_js_symbol(fn)] = function() {
      var c_nums, nums, ret;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      c_nums = _.map(nums, compile);
      ret = c_nums.join(" " + (symbol || fn) + " ");
      return "(" + ret + ")";
    };
  };

  binary_fn("||");

  binary_fn("&&");

  /*
  COMPARISONS
  */

  compare_fn = function(fn, symbol) {
    return compiler[to_js_symbol(fn)] = function() {
      var c_items, item, items, last, ret, _i, _len, _ref4;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      c_items = _.map(items, compile);
      ret = [];
      last = c_items[0];
      _ref4 = c_items.slice(1);
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        item = _ref4[_i];
        ret.push("" + last + " " + (symbol || fn) + " " + item);
        last = item;
      }
      ret.join(" && ");
      return "(" + ret + ")";
    };
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

  compiler[to_js_symbol('throw')] = function(err) {
    var c_err;
    c_err = compile(err);
    return "(function () { throw " + c_err + " })()";
  };

  quote_all = function(list) {
    var ret, _quote;
    _quote = function(item) {
      return [to_symbol('quote'), item];
    };
    return ret = _quote(_.map(list, function(item) {
      if ((_.isArray(item)) && !is_symbol(item)) {
        return quote_all(item);
      } else {
        return _quote(item);
      }
    }));
  };

  mc_expand = false;

  mc_expand_1 = false;

  compiler.defmacro = function() {
    var argnames, c_name, name, template;
    name = arguments[0], argnames = arguments[1], template = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (argnames == null) argnames = [];
    c_name = compile(name);
    objectSet(compiler, c_name, function() {
      var args, evald, js, q_args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      q_args = quote_all(args);
      js = oppo.compile([[['symbol', 'lambda'], argnames].concat(__slice.call(template))].concat(__slice.call(q_args[1])));
      evald = eval(js);
      if (!mc_expand && !mc_expand_1) {
        return oppo.compile(evald);
      } else {
        mc_expand_1 = false;
        return evald;
      }
    });
    return "/* defmacro " + c_name + " */ null";
  };

  compiler.macroexpand = function(sexp) {
    var old_mc_expand, ret;
    old_mc_expand = mc_expand;
    mc_expand = true;
    ret = compile(sexp);
    ret = compile(quote_all(ret));
    mc_expand = old_mc_expand;
    return ret;
  };

  compiler.macroexpand_1 = function(sexp) {
    var ret;
    mc_expand_1 = true;
    ret = compile(sexp);
    ret = compile(quote_all(ret));
    mc_expand_1 = false;
    return ret;
  };

  compiler.syntax_quote = function(list) {
    var code, ident, q_list, restructured_list, ret, sym;
    sym = to_symbol;
    ident = gensym('list');
    restructured_list = restructure_list(list, ident);
    restructured_list[1] = [sym('js-eval'), restructured_list[1]];
    q_list = quote_all(list);
    code = [[sym('lambda'), [sym(ident)], [sym("var")].concat(__slice.call(restructured_list))], q_list];
    return ret = compile(code);
  };

  compiler.str = function() {
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
  };

  compiler.keyword = function(key) {
    var e_key;
    if ((is_quoted(key)) && (is_symbol((e_key = oppo.eval(key))))) {
      return compile(e_key[1]);
    } else if (_.isString(key)) {
      return compile(key);
    } else {
      return compile([to_symbol('str'), key]);
    }
  };

}).call(this);
