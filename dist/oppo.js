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
  if (typeof global === "undefined" || global === null) {
    global = window;
  }
  oppo_global = Object.create(global);
  oppo = {};
  oppo.module = (function() {
    var CircularDependency, ModuleNotFound, _load, _module, _module_get, _module_list, _module_list_traverse, _module_set, _require, _require_one, _requiring, _requiring_submodules;
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
        if (!(scope != null)) {
          return false;
        }
        return scope = (function() {
          var _ref;
          if (i === last) {
            return scope = scope[item];
          } else {
            try {
              return (_ref = scope[item]) != null ? _ref.submodules : void 0;
            } catch (_e) {}
          }
        })();
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
      context = Object.create(oppo_global);
      context.name = name;
      mod.cache = fn.apply(context, args);
      _requiring[name] = false;
      return mod.cache;
    };
    _module.require = _require = function(name, force) {
      var item, modules, new_name, submodules;
      submodules = _module_get(name).submodules;
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
    return _module;
  })();
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
            case "do":
              return self.core["do"](args);
            case "module":
              return (_ref = self.core).module.apply(_ref, args);
            case "quote":
              return self.core.quote(first);
            case "syntax-quote":
              return self.macro.syntax_quote(first);
            case "defmacro":
              return (_ref2 = self.macro).defmacro.apply(_ref2, args);
            case "eval":
              return compile(["oppo.eval"].concat(__slice.call(args)));
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
            case "keyword":
              return self.types.keyword(first);
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
      function Var(name, value) {
        this.name = name;
        this.value = value;
      }
      Var.prototype.toString = function() {
        return "var " + this.name + " = " + this.value + ";";
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
    self.is_list = function(a) {
      return a instanceof Array && !(a.type != null);
    };
    self.is_splat = function(x) {
      return x instanceof Array && x[0] === 'splat';
    };
    return self;
  });
  oppo.module("compiler.core", ["compiler", "compiler.helpers"], function(_arg, helpers) {
    var compile, self;
    compile = _arg.compile;
    self = this;
    self.identifier = function(ident) {
      var keyword, _i, _len, _ref;
      _ref = helpers.js_keywords;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        keyword = _ref[_i];
        ident = ident === keyword ? "_" + ident + "_" : ident;
      }
      ident = ident.replace(/\./g, "_dot_").replace(/\-/g, "_").replace(/\+/g, "_plus_").replace(/\*/g, "_star_").replace(/\=/g, "_eq_").replace(/</g, "_lt_").replace(/>/g, "_gt_").replace(/%/g, "_percent_").replace(/#/g, "_pound_").replace(/\^/g, "_carat_").replace(/'/g, "_squote_").replace(/"/g, "_dquote_").replace(/&/g, "_amp_").replace(/\|/g, "_pipe_").replace(/@/g, "_at_").replace(/!/g, "_exclmark_").replace(/\?/g, "_qmark_").replace(/,/g, "_comma_").replace(/\//g, "_fslash_").replace(/\\/g, "_bslash_").replace(/~/g, "_tilde_").replace(/`/g, "_backtick_").replace(/:/g, "_colon_");
      return ident;
    };
    self.string = helpers.identity;
    self.program = function(first, args) {
      var base_deps, name, program, _ref;
      base_deps = ["global", "require", "load"];
      if (((first != null ? first[0] : void 0) != null) === "module") {
        if ((_ref = first[2]) == null) {
          first[2] = [];
        }
        first[2] = __slice.call(base_deps).concat(__slice.call(first[2]));
        return compile(first.concat(args.slice(1)));
      } else {
        name = helpers.gensym("anonymous");
        args.push(["set!", "self", args.pop()]);
        program = [["module", name, base_deps].concat(__slice.call(args)), [[".", "oppo", "module", "require"], "\"" + name + "\""]].map(function(item) {
          return compile(item);
        });
        return "" + (program.join(",\n")) + ";";
      }
    };
    self["do"] = function(body) {
      return compile([["lambda", []].concat(__slice.call(body))]);
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
      return "" + (compile(cond)) + " ?\n  " + (compile(t_action)) + " :\n  " + (compile(f_action || null));
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
      ident = ident === "self" ? ident : compile([".", "self", ident]);
      val = compile(val);
      return helpers.def(ident, val, err);
    };
    self.set = function(ident, val) {
      var err;
      err = compile(["set-error", "\"" + ident + "\""]);
      ident = ident === "self" ? ident : compile([".", "self", ident]);
      val = compile(val);
      return helpers.set(ident, val, err);
    };
    self.defp = function(ident, val) {
      var err;
      err = compile(["def-error", "\"" + ident + "\""]);
      ident = compile([".", "_private", ident]);
      val = compile(val);
      return helpers.set(ident, val, err);
    };
    self.setp = function(ident, val) {
      var err;
      err = compile(["set-error", "\"" + ident + "\""]);
      ident = compile([".", "_private", ident]);
      val = compile(val);
      return helpers.set(ident, val, err);
    };
    self.module = function() {
      var body, deps, fn, name, vars;
      name = arguments[0], deps = arguments[1], body = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      name = "\"" + name + "\"";
      vars = [new helpers.Var("_private", "{}")];
      body = body.map(function(item) {
        return compile(item);
      });
      fn = "(function (" + (deps.join(', ')) + ") {\n  " + (vars.join('\n  ')) + "\n  this.self = this;\n  with (this) {\n    " + (body.join(',\n  ')) + ";\n  }\n  return this.self;\n})";
      deps = helpers.stringify.to_js(deps.map(function(dep) {
        return "\"" + dep + "\"";
      }));
      return "oppo.module(" + name + ", " + deps + ", " + fn + ")";
    };
    self.member_access = function() {
      var base, items, simple;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      items = items.map(function(item) {
        return compile(typeof item === "string" && /^".*"$/.test(item) ? helpers.trim_quotes(item) : item);
      });
      base = items.shift();
      simple = true;
      if (simple) {
        return "" + base + "." + (items.join('.'));
      } else {
        return "" + base + "[\"" + (items.join('"]["')) + "\"]";
      }
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
      var arg, destructure, vars, _i, _len;
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
        vars = vars.map(function(item) {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor, result = func.apply(child, args);
            return typeof result === "object" ? result : child;
          })(helpers.Var, item, function() {});
        });
        args = [];
      } else {
        vars = [];
        args = args.map(function(arg) {
          return compile(arg);
        });
      }
      return {
        vars: vars,
        args: args
      };
    };
    self.lambda = function() {
      var args, body, i, item, vars, _len, _ref;
      args = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (args == null) {
        args = [];
      }
      _ref = get_args(args), vars = _ref.vars, args = _ref.args;
      for (i = 0, _len = body.length; i < _len; i++) {
        item = body[i];
        if (item instanceof helpers.Var) {
          vars.push(item);
        } else {
          body = (body.slice(i)).map(function(item) {
            return compile(item);
          });
          break;
        }
      }
      vars = vars.length ? (vars.join('\n  ')) + '\n' : '';
      return "(function (" + (args.join(', ')) + ") {\n  " + vars + "return " + (body.join(',\n  ')) + ";\n})";
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
        var arg_map, args, replaced;
        args = arguments;
        arg_map = helpers.destructure_list(argnames, "args");
        argnames = arg_map.map(function(item) {
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
            result = macro_replace(argnames, args, item);
            if (splat) {
              return ["...", result];
            } else {
              return result;
            }
          });
          return replaced = helpers.restructure_list(replaced);
        } else {
          return replaced = macro_replace(argnames, args, template);
        }
      };
      return "null /* macro: " + name + " */";
    };
    self.is_macro;
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
    self.macroexpand = function(ls) {};
    return self;
  });
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
  oppo.module("oppo.core", ["oppo", "oppo.list", "oppo.string", "global", "compiler"], function(oppo, list, string, global, _arg) {
    var compile, global_method_get, global_method_set, oppo_data, self;
    compile = _arg.compile;
    self = this;
    global_method_set = function(nm, fn) {
      nm = compile(nm);
      return global[nm] = self[nm] = fn;
    };
    global_method_get = function(nm) {
      return global[compile(nm)];
    };
    oppo_data = oppo.read('(defmacro defn (fname args ...body)\n  `(def fname\n    (lambda args\n      ...body)))\n  \n(defmacro apply (fn ...args ls)\n  `((. fn apply) fn (concat args ls)))\n  \n(defmacro call (fn ...args)\n  `(apply fn args))');
    oppo.eval(oppo_data);
    global_method_set("throw", (function() {
      var toString;
      toString = function() {
        var info;
        info = this.info != null ? "\n\n  Additional Info: " + (this.info.join(', ')) : "";
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
    global_method_set("keyword", (function() {
      var Keyword, keywords;
      keywords = {};
      Keyword = (function() {
        function Keyword(name) {
          this.name = name;
        }
        Keyword.prototype.type = "keyword";
        return Keyword;
      })();
      return function(word) {
        var _ref;
        return (_ref = keywords[word]) != null ? _ref : keywords[word] = new Keyword(word);
      };
    })());
    global_method_set("typed-list", list.typed_list);
    global_method_set("hash-map", list.hash_map);
    global_method_set("concat", list.concat);
    global_method_set("slice", list.slice);
    global_method_set("nth", list.nth);
    global_method_set("uppercase", string.uppercase);
    global_method_set("lowercase", string.lowercase);
    (function() {
      var dasherize, method, methods, _i, _j, _len, _len2, _list_proxy, _ref, _ref2;
      dasherize = string.dasherize;
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
      methods = {
        collections: ["each", "map", "reduce", "reduceRight", "find", "filter", "all", "any", "include", "invoke", "pluck", "max", "min", "sortBy", "groupBy", "sortedIndex", "shuffle", "toArray", "size"],
        arrays: ["first", "initial", "last", "rest", "compact", "flatten", "without", "union", "intersection", "difference", "uniq", "zip", "indexOf", "lastIndexOf"],
        functions: ["memoize", "delay", "defer", "throttle", "debounce", "once", "after", "wrap", "compose"],
        objects: ["keys", "values", "functions", "extend", "defaults", "clone", "tap", "isEqual", "isEmpty", "isElement", "isArray", "isArguments", "isFunction", "isString", "isNumber", "isBoolean", "isDate", "isUndefined"],
        utility: ["identity", "times", "mixin", "uniqueId", "escape", "template"],
        chaining: ["chain"]
      };
      _ref = methods.collections.concat(methods.arrays);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        method = _ref[_i];
        global_method_set(dasherize(method), _list_proxy(_[method]));
      }
      _ref2 = methods.functions.concat(methods.objects, methods.utility, methods.chaining);
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        method = _ref2[_j];
        global_method_set(dasherize(method), _[method]);
      }
      global_method_set("is-nil", _.isNull);
      global_method_set("is-non-number", _.isNaN);
      global_method_set("curry", function() {
        var args, fn;
        fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return _.bind(fn, null, args);
      });
      return global_method_set("is-regexp", _.isRegExp);
    })();
    return self;
  });
  oppo.module("oppo.list", ["oppo", "compiler"], function(oppo, _arg) {
    var compile, helpers, self;
    compile = _arg.compile, helpers = _arg.helpers;
    self = this;
    self.typed_list = function(items) {
      return items.type = typed_list;
    };
    self.hash_map = function(items) {
      items.type = hash_map;
      if (items.length % 2 > 0) {
        throw new TypeError("Can't make a hash-map with an odd number of arguments");
      }
    };
    self.concat = function(ls, items) {
      return ls.concat.apply(ls, items);
    };
    self.slice = function(ls, start, end) {
      return ls.slice(start, end);
    };
    self.nth = function(ls, i) {
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
    };
    self.nth0 = function(ls, i) {
      if (i < 0) {
        i = ls.length + i;
      }
      return ls[i];
    };
    return self;
  });
  oppo.module("oppo.string", ["oppo", "compiler"], function(oppo, _arg) {
    var compile, helpers, self;
    compile = _arg.compile, helpers = _arg.helpers;
    self = this;
    self.uppercase = function(str) {
      return str.toUpperCase();
    };
    self.lowercase = function(str) {
      return str.toLowerCase();
    };
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
    return self;
  });
  global.oppo = oppo;
  oppo.module("parser", function() {
    return typeof parser !== "undefined" && parser !== null ? parser : parser = require('./parser');
  });
  oppo.module("oppo", ["parser", "compiler"], function(parser, compiler) {
    oppo.compile = compiler.compile.bind(compiler);
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
