(function() {
  var oppo, oppo_global, result;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice;
  if (typeof _ === "undefined" || _ === null) {
    _ = typeof require === "function" ? require("underscore") : void 0;
  }
  if (!(typeof _ !== "undefined" && _ !== null)) {
    throw new Error("Unmet dependency: underscore.js");
  }
  _.mixin({
    create: (function() {
      var _create, _ref;
      _create = (_ref = Object.create) != null ? _ref : function(o) {
        var noop;
        noop = function() {};
        noop.prototype = o;
        return new noop;
      };
      return function(o) {
        if (o == null) {
          o = null;
        }
        return _create(o);
      };
    })()
  });
  if (typeof global === "undefined" || global === null) {
    global = window;
  }
  oppo_global = _.create(global);
  oppo = {};
  oppo.module = (function() {
    var CircularDependency, ModuleNotFound, _load, _module, _module_get, _module_list, _module_list_traverse, _module_set, _require, _require_one, _requiring, _requiring_submodules, _waiting;
    ModuleNotFound = (function() {
      __extends(ModuleNotFound, Error);
      function ModuleNotFound(module) {
        this.message = "Module " + module + " not found";
      }
      ModuleNotFound.prototype.name = "ModuleNotFound";
      return ModuleNotFound;
    })();
    CircularDependency = (function() {
      __extends(CircularDependency, Error);
      function CircularDependency(module_a, module_b) {
        this.message = "" + module_a + " and " + module_b + " are circular dependencies";
      }
      CircularDependency.prototype.name = "ModuleCircularDependency";
      return CircularDependency;
    })();
    _module_list = {};
    _requiring = {};
    _requiring_submodules = {};
    _waiting = {};
    _module_list_traverse = function(name, eachback) {
      var i, item, namespace, result, _len, _results;
      namespace = name.split('.');
      _results = [];
      for (i = 0, _len = namespace.length; i < _len; i++) {
        item = namespace[i];
        result = eachback(item, i, namespace.length - 1, namespace);
        if (result === false) {
          break;
        }
      }
      return _results;
    };
    _module_set = function(name, value) {
      var scope;
      scope = _module_list;
      _module_list_traverse(name, function(item, i, last, ns) {
        var cur_value, prop, val, _base, _ref, _ref2;
        return scope = i === last ? (cur_value = scope[item], scope[item] = (function() {
          if (cur_value) {
            for (prop in value) {
              if (!__hasProp.call(value, prop)) continue;
              val = value[prop];
              cur_value[prop] = val;
            }
            return cur_value;
          } else {
            return value;
          }
        })()) : (_ref = (_base = ((_ref2 = scope[item]) != null ? _ref2 : scope[item] = {})).submodules) != null ? _ref : _base.submodules = {};
      });
      return value;
    };
    _module_get = function(name) {
      var scope;
      scope = _module_list;
      _module_list_traverse(name, function(item, i, last, ns) {
        var _ref;
        if (!(scope != null)) {
          return false;
        }
        return scope = i === last ? scope[item] : scope != null ? (_ref = scope[item]) != null ? _ref.submodules : void 0 : void 0;
      });
      return scope;
    };
    _module = function(name, deps, fn) {
      var mod;
      if (deps == null) {
        deps = [];
      }
      mod = _module_get(name);
      if ((mod != null ? mod.fn : void 0) != null) {
        console.warn("Redefining module " + name);
        console.trace();
      }
      switch (arguments.length) {
        case 1:
          throw new Error("oppo.module requires at least two arguments");
          break;
        case 2:
          fn = deps;
          deps = [];
      }
      _module_set(name, {
        deps: deps,
        fn: fn
      });
      return _module;
    };
    _require_one = function(name, force) {
      var args, context, dep, deps, fn, mod;
      mod = _module_get(name);
      if (!(mod != null)) {
        throw new ModuleNotFound(name);
      }
      fn = mod.fn, deps = mod.deps;
      if (!fn) {
        console.warn("Module " + name + " is not defined.");
        return;
      }
      if (!deps) {
        deps = [];
      }
      if (_requiring[name]) {
        throw new Error("Already requiring " + name);
      }
      if (force) {
        mod.cache = null;
      }
      if (mod.cache != null) {
        return mod.cache;
      }
      _requiring[name] = true;
      args = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = deps.length; _i < _len; _i++) {
          dep = deps[_i];
          if (_requiring[dep]) {
            throw new CircularDependency(name, dep);
          }
          _results.push(_require(dep));
        }
        return _results;
      })();
      context = _.create(oppo_global);
      context.name = name;
      mod.cache = fn.apply(context, args);
      _requiring[name] = false;
      return mod.cache;
    };
    _module.require = _require = function(name, force) {
      var item, modules, new_name, submodules, _ref;
      submodules = ((_ref = _module_get(name)) != null ? _ref : {}).submodules;
      modules = _require_one(name);
      if (submodules && !_requiring_submodules[name]) {
        _requiring_submodules[name] = true;
        for (item in submodules) {
          if (!__hasProp.call(submodules, item)) continue;
          new_name = "" + name + "." + item;
          modules[item] = _require(new_name, force);
        }
        _requiring_submodules[name] = false;
      }
      return modules;
    };
    _module.load = _load = function(name) {
      return _require(name, true);
    };
    _module("module", function() {
      return _module;
    });
    _module("require", function() {
      return _module.require;
    });
    _module("load", function() {
      return _module.load;
    });
    _module("global", function() {
      return oppo_global;
    });
    _module("underscore", function() {
      return _;
    });
    return _module;
  })();
  oppo.module("x_compiler.arithmetic", ["compiler"], function(compiler) {
    var arithmetic_row, self;
    self = this;
    arithmetic_row = function(nums, base, operation) {
      var n, num, operator, order_matters, ret, _i, _len;
      ret = '';
      order_matters = !(base != null);
      operator = nums.shift();
      for (_i = 0, _len = nums.length; _i < _len; _i++) {
        num = nums[_i];
        n = +num;
        if (n && operation) {
          if (!(base != null)) {
            base = n;
          } else {
            base = operation(base, n);
          }
        } else {
          if (order_matters && base) {
            ret += "" + base + " " + operator + " ";
            base = null;
          }
          ret += "thunk.resolve_one(" + num + ") " + operator + " ";
        }
      }
      if (ret && base) {
        return "(" + ret + " " + operator + " " + base + ")";
      } else if (ret) {
        return "(" + ret + ")";
      } else {
        return "" + base;
      }
    };
    compiler.register('+', 'function', (function(_, _0) {
      return _0 === '+';
    }), function(nums) {
      return arithmetic_row(nums, 0, function(a, b) {
        return a + b;
      });
    });
    compiler.register('-', 'function', (function(_, _0) {
      return _0 === '-';
    }), function(nums) {
      return arithmetic_row(nums, 0, function(a, b) {
        return a - b;
      });
    });
    compiler.register('*', 'function', (function(_, _0) {
      return _0 === '*';
    }), function(nums) {
      return arithmetic_row(nums, 1, function(a, b) {
        return a * b;
      });
    });
    compiler.register('/', 'function', (function(_, _0) {
      return _0 === '/';
    }), function(nums) {
      return arithmetic_row(nums, null, function(a, b) {
        return a / b;
      });
    });
    compiler.register('**', 'function', (function(_, _0) {
      return _0 === '**';
    }), function(_arg) {
      var a, b, _;
      _ = _arg[0], a = _arg[1], b = _arg[2];
      if (+a && +b) {
        return "" + (Math.pow(a, b));
      } else {
        return "Math.pow(thunk.resolve_one(" + a + "), thunk.resolve_one(" + b + "))";
      }
    });
    return self;
  });
  oppo.module("compiler", ["module"], function(_arg) {
    var CompileError, compile, require_group, self;
    require_group = _arg.require_group;
    self = this;
    self.CompileError = CompileError = (function() {
      __extends(CompileError, Error);
      function CompileError(message) {
        this.message = message;
      }
      CompileError.prototype.name = "CompileError";
      return CompileError;
    })();
    self.globals = [];
    self.compile = compile = function(s_expr) {
      var args, first, fn, ret;
      ret = (function() {
        var _ref, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
        if (typeof s_expr === "string") {
          if (self.helpers.is_string(s_expr)) {
            return self.core.string(s_expr);
          } else if (self.helpers.is_identifier(s_expr)) {
            return self.core.identifier(s_expr);
          } else {
            return s_expr;
          }
        } else if (s_expr instanceof Array && s_expr.length > 0) {
          fn = s_expr[0], args = 2 <= s_expr.length ? __slice.call(s_expr, 1) : [];
          first = args[0];
          switch (fn) {
            case "program":
              return self.core.program(first, args);
            case "module":
              return (_ref = self.core).module.apply(_ref, args);
            case "quote":
              return self.core.quote(first);
            case "syntax-quote":
              return self.macro.syntax_quote(first);
            case "defmacro":
              return (_ref2 = self.macro).defmacro.apply(_ref2, args);
            case "macroexpand-1":
              return self.macro.macroexpand_1(self.compile(first));
            case "if":
              return (_ref3 = self.core)["if"].apply(_ref3, args);
            case "def":
              return (_ref4 = self.core).def.apply(_ref4, args);
            case "defg":
              return (_ref5 = self.core).defg.apply(_ref5, args);
            case "set!":
              return (_ref6 = self.core).set.apply(_ref6, args);
            case "setg!":
              return (_ref7 = self.core).setg.apply(_ref7, args);
            case "let":
              return self.core["let"](args);
            case ".":
              return (_ref8 = self.core).member_access.apply(_ref8, args);
            case "js-eval":
              return args.join(",\n");
            case "infix":
              return self["function"].infix(first);
            case "lambda":
              return (_ref9 = self["function"]).lambda.apply(_ref9, args);
            default:
              return (_ref10 = self["function"]).call.apply(_ref10, s_expr);
          }
        } else {
          if (s_expr instanceof Array) {
            return "null";
          } else {
            return self.helpers.stringify.to_js(s_expr);
          }
        }
      })();
      return ret;
    };
    return self;
  });
  oppo.module("compiler.core", ["compiler", "compiler.helpers", "underscore"], function(_arg, helpers, _) {
    var compile, self;
    compile = _arg.compile;
    self = this;
    self.identifier = function(ident) {
      var keyword, replaced, _char, _i, _len, _ref, _ref2;
      _ref = helpers.js_keywords;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        keyword = _ref[_i];
        ident = ident === keyword ? "_" + ident + "_" : ident;
      }
      if (ident.length > 1) {
        ident = ident.replace(/\-/g, '_');
      }
      _ref2 = helpers.js_illegal_identifiers;
      for (_char in _ref2) {
        if (!__hasProp.call(_ref2, _char)) continue;
        replaced = _ref2[_char];
        while ((ident.indexOf(_char)) >= 0) {
          ident = ident.replace(_char, "_" + replaced + "_");
        }
      }
      return ident;
    };
    self.string = helpers.identity;
    self.program = function(first, args) {
      var base_deps, name, program, _ref;
      base_deps = ["global", "require", "load"];
      if ((first != null ? first[0] : void 0) === "module") {
        if ((_ref = first[2]) == null) {
          first[2] = [];
        }
        first[2] = __slice.call(base_deps).concat(__slice.call(first[2]));
        return compile(first.concat(args.slice(1)));
      } else {
        name = helpers.gensym("anonymous");
        args.push(["set!", "self", args.pop()]);
        program = [["module", name, base_deps, ["js-eval", "self = global"]].concat(__slice.call(args)), [[".", "oppo", "module", "require"], "\"" + name + "\""]].map(function(item) {
          return compile(item);
        });
        return "" + (program.join(",\n")) + ";";
      }
    };
    self.quote = function(code) {
      if (code instanceof Array) {
        code = code.map(function(item) {
          return compile(item);
        });
      }
      return helpers.stringify.to_js(code);
    };
    self["if"] = function(cond, t_action, f_action) {
      return "/* if */ " + (compile(["->bool", cond])) + " ?\n  /* then */ " + (compile(t_action)) + " :\n  /* else */ " + (compile(f_action != null ? f_action : null));
    };
    self.defg = function(ident, val) {
      var err;
      err = compile(['def-error', "\"" + ident + "\""]);
      ident = compile([".", "global", ident]);
      val = compile(val);
      return helpers.def(ident, val, err);
    };
    self.setg = function(ident, val) {
      var err;
      err = compile(['set-error', "\"" + ident + "\""]);
      ident = compile([".", "global", ident]);
      val = compile(val);
      return helpers.def(ident, val, err);
    };
    self["let"] = function(args) {
      var bind_name, body, first, i, item, last, name, named_values, vars, _len;
      first = args[0];
      if (helpers.is_identifier(args[0])) {
        name = args[0], named_values = args[1], body = 3 <= args.length ? __slice.call(args, 2) : [];
      } else {
        named_values = args[0], body = 2 <= args.length ? __slice.call(args, 1) : [];
      }
      vars = [];
      for (i = 0, _len = named_values.length; i < _len; i++) {
        item = named_values[i];
        if (i % 2 === 1) {
          vars.push(new helpers.Var(compile(last), compile(item)));
        } else {
          last = item;
        }
      }
      if (name != null) {
        name = compile(name);
        bind_name = "" + name + " = " + name + ".bind(null, " + name + ")";
        return compile([["lambda", [name], [name, name]], ["lambda", [name], ["js-eval", bind_name]].concat(__slice.call(vars), __slice.call(body))]);
      } else {
        return compile([["lambda", []].concat(__slice.call(vars), __slice.call(body))]);
      }
    };
    self.def = function(ident, val) {
      var err;
      err = compile(["def-error", "\"" + ident + "\""]);
      ident = compile(ident);
      val = compile(val);
      if (helpers.is_js_identifier(ident)) {
        helpers.Var.track(new helpers.Var(ident));
      }
      return helpers.def(ident, val, err);
    };
    self.set = function(ident, val) {
      var err;
      err = compile(["set-error", "\"" + ident + "\""]);
      ident = compile(ident);
      val = compile(val);
      return helpers.set(ident, val, err);
    };
    self.module = function() {
      var Var, args, body, deps, fn, name, vars;
      name = arguments[0], deps = arguments[1], body = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      name = "\"" + name + "\"";
      Var = helpers.Var;
      Var.new_set();
      Var.track(new Var("self", "this"));
      body = body.map(function(item) {
        return compile(item);
      });
      args = _.map(deps, function(item) {
        return compile(item);
      });
      vars = Var.grab();
      fn = "(function (" + (args.join(', ')) + ") {\n  " + (vars.join('\n  ')) + "\n  with (this) {\n    " + (body.join(',\n    ')) + ";\n  }\n  return self;\n})";
      deps = helpers.stringify.to_js(_.map(deps || [], function(dep) {
        return "\"" + dep + "\"";
      }));
      return "(oppo || require('oppo')).module(" + name + ", " + deps + ", " + fn + ")";
    };
    self.member_access = function() {
      var base, items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      items = items.map(function(item) {
        item = helpers.is_string(item) ? helpers.trim_quotes(item) : item;
        return compile(item);
      });
      base = items.shift();
      return "" + base + "." + (items.join('.'));
    };
    return self;
  });
  oppo.module("compiler.function", ["compiler", "compiler.macro", "compiler.helpers"], function(_arg, macro, helpers) {
    var compile, get_args, self;
    compile = _arg.compile;
    self = this;
    self.call = function() {
      var arg, args, fn, mc, s_exp;
      fn = arguments[0], s_exp = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      while (true) {
        fn = compile(fn);
        if (!(fn instanceof Array)) {
          break;
        }
      }
      try {
        mc = macro.call(fn, s_exp);
        return compile(mc);
      } catch (e) {
        args = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = s_exp.length; _i < _len; _i++) {
            arg = s_exp[_i];
            _results.push(compile(arg));
          }
          return _results;
        })();
        return "" + fn + "(" + (args.join(', ')) + ")";
      }
    };
    get_args = function(args) {
      var arg, destructure, vars, _i, _j, _len, _len2, _var;
      destructure = false;
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        if (helpers.is_splat(arg)) {
          destructure = true;
          break;
        }
      }
      if (destructure) {
        vars = helpers.destructure_list(args, "arguments");
        for (_j = 0, _len2 = vars.length; _j < _len2; _j++) {
          _var = vars[_j];
          helpers.Var.track((function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor, result = func.apply(child, args);
            return typeof result === "object" ? result : child;
          })(helpers.Var, _var, function() {}));
        }
        args = [];
      } else {
        args = args.map(function(arg) {
          return compile(arg);
        });
      }
      return args;
    };
    self.lambda = function() {
      var Var, args, body, i, item, vars, _len;
      args = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (args == null) {
        args = [];
      }
      args = get_args(args);
      Var = helpers.Var;
      Var.new_set();
      for (i = 0, _len = body.length; i < _len; i++) {
        item = body[i];
        if (item instanceof helpers.Var) {
          Var.track(item);
        } else {
          body = (body.slice(i)).map(function(item) {
            return compile(item);
          });
          break;
        }
      }
      vars = Var.grab();
      vars = vars.length ? (vars.join('\n  ')) + '\n' : '';
      return "(function (" + (args.join(', ')) + ") {\n  " + vars + "return " + (body.join(',\n    ')) + ";\n})";
    };
    self.infix = function(call) {
      return compile([call.shift(), call.shift()].reverse().concat(call));
    };
    self.apply = function() {
      var args, fn;
      fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      args.reduceRight(function(a, b) {
        a.unshift(b);
        return a;
      });
      return compile([fn].concat(__slice.call(args)));
    };
    return self;
  });
  oppo.module("compiler.helpers", ["compiler"], function(_arg) {
    var compile, self;
    compile = _arg.compile;
    self = this;
    self.identity = function(x) {
      return x;
    };
    self.recursive_map = function(ls, fn, parent_ls, parent_index) {
      return ls.map(function(item, i, ls) {
        if (item instanceof Array) {
          return self.recursive_map(item, fn, ls, i);
        } else {
          return fn(item, i, ls, parent_ls, parent_index);
        }
      });
    };
    self.js_keywords = ["break", "class", "const", "continue", "default", "delete", "do", "enum", "export", "extends", "finally", "for", "function", "implements", "import", "in", "instanceof", "interface", "label", "new", "package", "private", "protected", "public", "static", "return", "switch", "super", "this", "try", "catch", "typeof", "var", "void", "while", "with", "yield"];
    self.js_illegal_identifiers = {
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
    self.gensym = (function() {
      var num;
      num = 0;
      return function(name) {
        if (name != null) {
          name = "_" + name + "_";
        } else {
          name = "";
        }
        return "" + name + (num++);
      };
    })();
    self.def = function(ident, value, error) {
      return "(typeof " + ident + " === \"undefined\" ?\n  " + ident + " = " + value + " :\n  " + error + ")";
    };
    self.set = function(ident, value, error) {
      return "(typeof " + ident + " !== \"undefined\" ?\n  " + ident + " = " + value + " :\n  " + error + ")";
    };
    self.Var = (function() {
      var tracker;
      function Var(name, value) {
        this.name = name;
        this.value = value;
      }
      Var.prototype.toString = function() {
        return "var " + this.name + " = " + this.value + ";";
      };
      tracker = [];
      Var.new_set = function() {
        return tracker.push([]);
      };
      Var.track = function() {
        var set, _i, _len, _results, _var;
        _results = [];
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          _var = arguments[_i];
          set = tracker[tracker.length - 1];
          _results.push(set != null ? set.push(_var) : void 0);
        }
        return _results;
      };
      Var.grab = function() {
        return tracker.pop();
      };
      return Var;
    })();
    self.splat = function(x) {
      return x[1];
    };
    self.destructure_list = function(pattern, sourceName) {
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
            result.concat(self.destructure_list, item, sourceText);
          } else {
            result.push([item, sourceText]);
          }
        }
      }
      return result;
    };
    self.restructure_list = function(list) {
      var i, init, item, rest, result, splat, _len;
      result = [];
      for (i = 0, _len = list.length; i < _len; i++) {
        item = list[i];
        if (self.is_splat(item)) {
          init = result;
          splat = self.splat(item);
          rest = list.slice(i + 1);
          result = init.concat(splat, rest);
        } else if (item instanceof Array) {
          result.push(self.restructure_list(item));
        } else {
          result.push(item);
        }
      }
      return result;
    };
    self.stringify = (function() {
      var js_array, js_object, oppo_array;
      js_array = function(a) {
        var contents;
        contents = a.map(self.stringify.to_js);
        return "[" + (contents.join(', ')) + "]";
      };
      oppo_array = function(a) {
        var contents;
        contents = a.map(self.stringify.to_oppo);
        return "(" + (contents.join(' ')) + ")";
      };
      js_object = function(o) {
        var name, s, value;
        s = "{ ";
        for (name in o) {
          value = o[name];
          s += "\"" + name + "\": " + (self.stringify.to_js(value)) + ", ";
        }
        return s.replace(/, $/, " }");
      };
      return {
        to_js: function(x) {
          if (x instanceof Array) {
            return js_array(x);
          } else if (x instanceof Object) {
            return js_object(x);
          } else {
            return "" + x;
          }
        },
        to_oppo: function(x) {
          if (x instanceof Array) {
            return oppo_array(x);
          } else {
            return "" + x;
          }
        }
      };
    })();
    self.trim_quotes = function(s) {
      return s.substr(1, s.length - 2);
    };
    self.is_string = function(s) {
      return /^".*"$/.test(s);
    };
    self.is_identifier = function(i) {
      var _ref;
      if (typeof i === "string" && !(self.is_string(i))) {
        return true;
      } else if (i instanceof Array) {
        if ((_ref = i[0]) === ".") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };
    self.is_js_identifier = function(i) {
      var _char, _ref;
      _ref = self.js_illegal_identifiers;
      for (_char in _ref) {
        if (!__hasProp.call(_ref, _char)) continue;
        if (i.indexOf(_char >= 0)) {
          return false;
        }
      }
      return true;
    };
    self.is_list = function(a) {
      return a instanceof Array && !(a.type != null);
    };
    self.is_splat = function(x) {
      return x instanceof Array && x[0] === 'splat';
    };
    return self;
  });
  oppo.module("compiler.macro", ["compiler", "compiler.helpers"], function(_arg, helpers) {
    var compile, macro_replace, macros, self;
    compile = _arg.compile;
    self = this;
    macros = {};
    macro_replace = function(argnames, args, item) {
      var index;
      index = argnames.indexOf(item);
      if (index >= 0) {
        return args[index];
      } else {
        return item;
      }
    };
    self.defmacro = function(name, argnames, template) {
      macros[compile(name)] = function() {
        var arg_map, args, replaced, _argnames;
        args = arguments;
        arg_map = helpers.destructure_list(argnames, "args");
        _argnames = arg_map.map(function(item) {
          return item[0];
        });
        args = arg_map.map(function(item) {
          var item1, js, result;
          item1 = item[1];
          js = compile(["js-eval", item1]);
          return result = eval(js);
        });
        if (template instanceof Array) {
          replaced = helpers.recursive_map(template, function(item, i, ls, parent, parent_i) {
            var result, splat;
            if (helpers.is_splat(item)) {
              item = helpers.splat(item);
              splat = true;
            }
            result = macro_replace(_argnames, args, item);
            if (splat) {
              return ["...", result];
            } else {
              return result;
            }
          });
          return replaced = helpers.restructure_list(replaced);
        } else {
          return replaced = macro_replace(_argnames, args, template);
        }
      };
      return "null /* macro: " + name + " */";
    };
    self.call = function(fn, s_exp) {
      var mc;
      mc = macros[fn];
      if (mc != null) {
        return compile(mc.apply(null, s_exp));
      } else {
        throw new TypeError("\"" + fn + "\" is not a macro");
      }
    };
    self.syntax_quote = helpers.identity;
    self.macroexpand_1 = function(ls) {
      var result;
      try {
        result = self.call(ls[0], ls.slice(1));
      } catch (e) {
        result = ls;
      }
      return result;
    };
    return self;
  });
  oppo.module("oppo.classes", function() {
    var Keyword, TypedList, self;
    self = this;
    Keyword = (function() {
      function Keyword(name) {
        this.name = name;
      }
      Keyword.prototype.toString = function() {
        return ":" + this.name;
      };
      return Keyword;
    })();
    TypedList = (function() {
      function TypedList() {
        var arg, type, _i, _len;
        this.type = helpers["typeof"](arguments[0]);
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          arg = arguments[_i];
          if ((type = helpers["typeof"](arg)) !== this.type) {
            throw new TypeError("Can't add item of type " + type + " to typed-list of type " + this.type);
          }
          this.push(arg);
        }
      }
      return TypedList;
    })();
    return self;
  });
  oppo.module("oppo.core", ["oppo", "oppo.helpers", "oppo.classes", "oppo.list", "oppo.string", "oppo.math", "global", "compiler", "underscore"], function(oppo, helpers, classes, list, string, math, global, _arg, _) {
    var bind_method, compile, global_method_get, global_method_set, make_prototype_method, name, oppo_data, self, _ref;
    compile = _arg.compile;
    self = this;
    _ref = helpers.get_runtime_builders(self), global_method_set = _ref.global_method_set, global_method_get = _ref.global_method_get, make_prototype_method = _ref.make_prototype_method;
    global_method_set("throw", (function() {
      var toString;
      toString = function() {
        var info;
        info = this.info != null ? "\n  Additional Info: " + (this.info.join(', ').trim() || 'none') : "";
        return "" + this.type + ": " + this.message + info;
      };
      return function() {
        var info, message, type;
        type = arguments[0], message = arguments[1], info = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        throw {
          type: type,
          message: message,
          info: info,
          toString: toString
        };
      };
    })());
    global_method_set("def-error", function(nm) {
      return (global_method_get("throw"))("def-error", "Can't define variable that is already defined: " + nm);
    });
    global_method_set("set-error", function(nm) {
      return (global_method_get("throw"))("set-error", "Can't redefine variable that has not yet been defined: " + nm);
    });
    bind_method = function(o, method) {
      return _.bind(o[method], o);
    };
    global_method_set("print", bind_method(console, "log"));
    global_method_set("print-error", bind_method(console, "error"));
    global_method_set("print-warning", bind_method(console, "warn"));
    name = global_method_set("name", function(x) {
      return x.name;
    });
    global_method_set("keyword", (function() {
      var keywords;
      keywords = {};
      return function(word) {
        var _ref2;
        return (_ref2 = keywords[word]) != null ? _ref2 : keywords[word] = new classes.Keyword(word);
      };
    })());
    global_method_set("js-map", function() {
      var arg, i, key, ret, _len, _results;
      if (arguments.length % 2 !== 0) {
        throw new TypeError("Can't make a js-map with an odd number of arguments");
      }
      ret = {};
      _results = [];
      for (i = 0, _len = arguments.length; i < _len; i++) {
        arg = arguments[i];
        _results.push(i % 2 === 0 ? (arg instanceof classes.Keyword ? arg = name(arg) : (helpers["typeof"](arg)) !== string ? console.warn("Making js-map with non-string key " + arg + " or type " + (helpers["typeof"](arg))) : void 0, key = arg) : ret[key] = arg);
      }
      return _results;
    });
    global_method_set("typeof", function(x) {
      var _ref2, _ref3;
      if (x === null) {
        return "null";
      } else if (!(x instanceof Object)) {
        return typeof x;
      } else {
        return (_ref2 = (_ref3 = x.constructor) != null ? _ref3.name : void 0) != null ? _ref2 : (Object.prototype.toString.call(x)).match(/\s(\w+)/)[1];
      }
    });
    global_method_set("concat", function() {
      var base;
      base = arguments[0];
      if (_.isString(base)) {
        return string.concat.apply(string, arguments);
      } else {
        return list.concat.apply(list, arguments);
      }
    });
    (function() {
      var make_compare_fn, to_bool;
      make_compare_fn = function(action) {
        return function() {
          var arg, args, val, _i, _len;
          val = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          for (_i = 0, _len = args.length; _i < _len; _i++) {
            arg = args[_i];
            if (action(val, arg)) {
              val = arg;
            } else {
              return false;
            }
          }
          return true;
        };
      };
      to_bool = global_method_set("->bool", function(x) {
        if (x != null) {
          return x !== false;
        } else {
          return false;
        }
      });
      global_method_set("or", function() {
        return _.reduce(arguments, (function(a, b) {
          if (to_bool(a)) {
            return a;
          } else {
            return b;
          }
        }), null);
      });
      global_method_set("and", function() {
        var first, rest;
        first = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return _.reduce(rest, (function(a, b) {
          if (!(to_bool(a))) {
            return a;
          } else {
            return b;
          }
        }), first);
      });
      global_method_set("not", function(x) {
        return !to_bool(x);
      });
      global_method_set(["==", "like?"], make_compare_fn(function(a, b) {
        return a == b;
      }));
      global_method_set(["===", "is?"], make_compare_fn(function(a, b) {
        return a === b;
      }));
      global_method_set(["=", "eq?"], make_compare_fn(function(a, b) {
        return _.isEqual(a, b);
      }));
      global_method_set("<", make_compare_fn(function(a, b) {
        return a < b;
      }));
      global_method_set(">", make_compare_fn(function(a, b) {
        return a > b;
      }));
      global_method_set("<=", make_compare_fn(function(a, b) {
        return a <= b;
      }));
      return global_method_set(">=", make_compare_fn(function(a, b) {
        return a >= b;
      }));
    })();
    (function(_) {
      var dasherize, general_methods, list_methods, method, method_name, methods, _i, _j, _len, _len2, _list_proxy;
      dasherize = string.dasherize;
      method_name = function(str) {
        var nm;
        nm = dasherize(str);
        return nm = nm.replace(/^is\-(.*)/, "$1?");
      };
      _list_proxy = function(fn) {
        return function() {
          var args, ls, result;
          ls = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (_.isString(ls)) {
            ls = ls.split('');
            ls.toString = function() {
              return ls.join('');
            };
          }
          result = fn.apply(null, [ls].concat(__slice.call(args)));
          return result;
        };
      };
      methods = helpers.underscore_methods;
      list_methods = methods.collections.concat(methods.arrays);
      general_methods = methods.functions.concat(methods.objects, methods.utility, methods.chaining);
      for (_i = 0, _len = list_methods.length; _i < _len; _i++) {
        method = list_methods[_i];
        global_method_set(method_name(method), _list_proxy(_[method]));
      }
      for (_j = 0, _len2 = general_methods.length; _j < _len2; _j++) {
        method = general_methods[_j];
        global_method_set(method_name(method), _[method]);
      }
      global_method_set("nil?", _.isNull);
      global_method_set("nan?", _.isNaN);
      global_method_set("curry", function() {
        var args, fn;
        fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return _.bind(fn, null, args);
      });
      global_method_set(["regexp?", "regex?"], _.isRegExp);
      global_method_set("unique-id", _.uniqueId);
      global_method_set(["reduce", "inject", "foldl"], function(_arg2, fn) {
        var ls, start;
        start = _arg2[0], ls = 2 <= _arg2.length ? __slice.call(_arg2, 1) : [];
        return _.reduce(ls, fn, start);
      });
      global_method_set(["reduce-right", "foldr"], function(_arg2, fn) {
        var ls, start;
        start = _arg2[0], ls = 2 <= _arg2.length ? __slice.call(_arg2, 1) : [];
        return _.reduceRight(ls, fn, start);
      });
      global_method_set("index", _.indexOf);
      return global_method_set("last-index", _.lastIndexOf);
    })(_);
    oppo_data = oppo.read('(defmacro defn (fname args ...body)\n  `(def fname\n    (lambda args\n      ...body)))\n\n(defmacro apply (fn ...args ls)\n  `((. fn apply) fn (concat args ls)))\n\n(defmacro call (fn ...args)\n  `(apply fn args))\n\n(defmacro do (...body)\n  `(call (lambda () (...body))))\n\n(defmacro not= (...args)\n  `(not (= ...args)))\n\n(defmacro not== (...args)\n  `(not (== ...args)))\n\n(defmacro not=== (...args)\n  `(not (=== ...args)))');
    oppo.eval(oppo_data);
    return self;
  });
  oppo.module("oppo.helpers", ["compiler"], function(_arg) {
    var compile, self;
    compile = _arg.compile;
    self = this;
    self.global_method_set = function(names, fn) {
      var nm, _i, _len, _results;
      if (!(names instanceof Array)) {
        names = [names];
      }
      _results = [];
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        nm = names[_i];
        nm = compile(nm);
        _results.push(global[nm] = this[nm] = fn);
      }
      return _results;
    };
    self.global_method_get = function(nm) {
      return global[compile(nm)];
    };
    self.make_prototype_method = function(nm) {
      return function() {
        var args, base;
        base = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return base[nm].apply(base, args);
      };
    };
    self.get_runtime_builders = function(scope) {
      var global_method_get, global_method_set, make_prototype_method;
      global_method_set = self.global_method_set, make_prototype_method = self.make_prototype_method;
      global_method_set = _.bind(global_method_set, scope);
      global_method_get = self.global_method_get;
      make_prototype_method = _.bind(make_prototype_method, scope);
      return {
        global_method_set: global_method_set,
        global_method_get: global_method_get,
        make_prototype_method: make_prototype_method
      };
    };
    self["typeof"] = function(x) {
      var _ref, _ref2;
      if (x === null) {
        return "null";
      } else if (!(x instanceof Object)) {
        return typeof x;
      } else {
        return (_ref = (_ref2 = x.constructor) != null ? _ref2.name : void 0) != null ? _ref : (Object.prototype.toString.call(x)).match(/\s(\w+)/)[1];
      }
    };
    self.underscore_methods = {
      collections: ["each", "map", "find", "detect", "filter", "select", "all", "every", "any", "some", "include", "contains", "invoke", "pluck", "sortBy", "groupBy", "sortedIndex", "shuffle", "toArray", "size"],
      arrays: ["first", "head", "initial", "last", "rest", "tail", "compact", "flatten", "without", "union", "intersection", "difference", "uniq", "unique", "zip"],
      functions: ["memoize", "delay", "defer", "throttle", "debounce", "once", "after", "wrap", "compose"],
      objects: ["keys", "values", "functions", "methods", "extend", "defaults", "clone", "create", "tap", "isEmpty", "isElement", "isArray", "isArguments", "isFunction", "isString", "isNumber", "isBoolean", "isDate", "isUndefined"],
      utility: ["identity", "times", "mixin", "escape", "template"],
      chaining: []
    };
    return self;
  });
  oppo.module("oppo.list", ["oppo", "oppo.helpers", "oppo.classes", "compiler"], function(oppo, helpers, classes, _arg) {
    var compile, global_method_set, make_prototype_method, self, _ref;
    compile = _arg.compile;
    self = this;
    _ref = helpers.get_runtime_builders(self), global_method_set = _ref.global_method_set, make_prototype_method = _ref.make_prototype_method;
    global_method_set(["list", "->list"], function() {
      var items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return items;
    });
    global_method_set("join", function(ls, joiner) {
      if (joiner == null) {
        joiner = '';
      }
      return ls.join(joiner);
    });
    global_method_set("typed-list", function() {
      var items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(classes.TypedList, items, function() {});
    });
    global_method_set("hash-map", function(items) {
      items.type = hash_map;
      if (items.length % 2 > 0) {
        throw new TypeError("Can't make a hash-map with an odd number of arguments");
      }
    });
    self.concat = function() {
      var a;
      a = [];
      return a.concat.apply(a, arguments);
    };
    global_method_set("slice", function(ls, start, end) {
      return ls.slice(start, end);
    });
    self.max = function(ls) {
      return Math.max.apply(Math, ls);
    };
    self.min = function(ls) {
      return Math.min.apply(Math, ls);
    };
    global_method_set("nth", function(ls, i) {
      if (i === 0) {
        console.warn("Warning: Use nth0 for 0-based access to lists.");
        return null;
      }
      if (i < 0) {
        i = ls.length + i;
      } else {
        i -= 1;
      }
      return ls[i];
    });
    global_method_set("second", function(ls) {
      return ls[1];
    });
    self.nth0 = function(ls, i) {
      if (i < 0) {
        i = ls.length + i;
      }
      return ls[i];
    };
    return self;
  });
  oppo.module("oppo.math", ["oppo", "oppo.helpers", "compiler"], function(oppo, helpers, _arg) {
    var compile, global_method_set, make_prototype_method, self, _ref;
    compile = _arg.compile;
    self = this;
    _ref = helpers.get_runtime_builders(self), global_method_set = _ref.global_method_set, make_prototype_method = _ref.make_prototype_method;
    global_method_set("->num", function(x) {
      return Number(x);
    });
    global_method_set("+", function() {
      return _.reduce(arguments, (function(a, b) {
        return a + b;
      }), 0);
    });
    global_method_set('-', function() {
      var nums, start;
      start = arguments[0], nums = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return _.reduce(nums, (function(a, b) {
        return a - b;
      }), start);
    });
    global_method_set('/', function() {
      var nums, start;
      start = arguments[0], nums = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return _.reduce(nums, (function(a, b) {
        return a / b;
      }), start);
    });
    global_method_set('*', function() {
      return _.reduce(arguments, (function(a, b) {
        return a * b;
      }), 1);
    });
    global_method_set(['%', 'mod'], function(a, b) {
      return a % b;
    });
    global_method_set(['**', 'pow'], Math.pow);
    (function() {
      var prop, properties, _i, _len;
      properties = ["E", "LN2", "LN10", "LOG2E", "LOG10E", "PI", "SQRT2", "abs", "acos", "asin", "atan", "atan2", "ceil", "cos", "exp", "floor", "log", "max", "min", "pow", "round", "sin", "sqrt", "tan"];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        self[prop] = Math[prop];
      }
      self['SQRT1/2'] = Math.SQRT1_2;
      self.rand = self.random = function(min, max, dec_places) {
        var num, top;
        if (min == null) {
          min = 0;
        }
        if (max == null) {
          max = 1;
        }
        top = max - min;
        num = (Math.random() * top) + min;
        if (dec_places != null) {
          dec_places = Math.min(dec_places + 1, 21);
          return Number(num.toPrecision(dec_places));
        } else {
          return num;
        }
      };
      return self['**'] = self.pow;
    })();
    return self;
  });
  oppo.module("oppo.string", ["oppo", "oppo.helpers", "compiler"], function(oppo, helpers, _arg) {
    var compile, global_method_set, make_prototype_method, self, _ref;
    compile = _arg.compile;
    self = this;
    _ref = helpers.get_runtime_builders(self), global_method_set = _ref.global_method_set, make_prototype_method = _ref.make_prototype_method;
    global_method_set("->string", function(s) {
      return s.toString();
    });
    global_method_set("uppercase", function(str) {
      return str.toUpperCase();
    });
    global_method_set("lowercase", function(str) {
      return str.toLowerCase();
    });
    global_method_set("split", function(str, splitter) {
      return str.split(splitter);
    });
    self.capitalize = function(str) {
      return (self.uppercase(str.substr(0, 1))) + str.substr(1);
    };
    self.uncapitalize = function(str) {
      return (self.lowercase(str.substr(0, 1))) + str.substr(1);
    };
    self.dasherize = function(str) {
      var ls, result;
      ls = str.split(/\s|_|(?=[A-Z])/);
      ls = _.map(ls, self.uncapitalize);
      return result = ls.join('-');
    };
    (function() {
      var prop, properties, _i, _len, _results;
      properties = ["charAt", "charCodeAt", "concat", "indexOf", "lastIndexOf", "localeCompare"];
      _results = [];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        _results.push(self[prop] = make_prototype_method(prop));
      }
      return _results;
    })();
    self.remove = function(str, search) {
      return self.replace(str, search, '');
    };
    return self;
  });
  global.oppo = oppo;
  oppo.module("parser", function() {
    return typeof parser !== "undefined" && parser !== null ? parser : parser = require('./parser');
  });
  oppo.module("oppo", ["parser", "compiler", "underscore"], function(parser, compiler, _) {
    oppo.compile = _.bind(compiler.compile, compiler);
    oppo.eval = function(oppo_data) {
      var js;
      js = oppo.compile(oppo_data);
      return eval(js);
    };
    oppo.read = function(oppo_txt) {
      return parser.parse(oppo_txt);
    };
    return oppo;
  });
  result = oppo.module.require("oppo");
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = result;
  }
}).call(this);
