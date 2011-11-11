(function() {
  var oppo;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice;
  oppo = {};
  oppo.module = (function() {
    var CircularDependency, ModuleNotFound, _load, _module, _module_get, _module_list, _module_list_traverse, _module_set, _require, _require_group, _requiring;
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
        var _base, _ref, _ref2;
        return scope = i === last ? scope[item] = value : (_ref = (_base = ((_ref2 = scope[item]) != null ? _ref2 : scope[item] = {})).submodules) != null ? _ref : _base.submodules = {};
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
    _module.require = _require = function(name, force) {
      var args, context, dep, deps, fn, mod;
      mod = _module_get(name);
      if (!(mod != null)) {
        throw new ModuleNotFound(name);
      }
      fn = mod.fn, deps = mod.deps;
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
      context = {
        name: name
      };
      mod.cache = fn.apply(context, args);
      _requiring[name] = false;
      return mod.cache;
    };
    _module.require_group = _require_group = function(name, recursive, force) {
      var item, modules, new_name, submodules;
      submodules = _module_get(name).submodules;
      modules = _require(name);
      if (submodules) {
        for (item in submodules) {
          if (!__hasProp.call(submodules, item)) continue;
          new_name = "" + name + "." + item;
          modules[item] = recursive ? _require_group(new_name, recursive, force) : _require(new_name, force);
        }
      }
      return modules;
    };
    _module.load = _load = function(name) {
      return _require(name, true);
    };
    _module.load_group = function(name, r) {
      return _require_group(name, r, true);
    };
    _module("module", function() {
      return _module;
    });
    return _module;
  })();
  oppo.module("compiler.macro", ["compiler", "compiler.helpers"], function(_arg, helpers) {
    var compile, self;
    compile = _arg.compile;
    self = this;
    self.macros = {};
    self.defmacro = function() {
      return function() {
        var argnames, name, template;
        name = arguments[0], argnames = arguments[1], template = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        return self.macros[name] = function() {
          return helpers.recursive_map(template, function(item, i, ls) {
            var index;
            index = argnames.indexOf(item);
            if (item >= 0) {
              return arguments[index];
            } else {
              return item;
            }
          });
        };
      };
    };
    self.macroexpand1 = function() {
      var args, body, name;
      name = arguments[0], args = arguments[1], body = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    };
    return self;
  });
  oppo.module("compiler", ["module"], function(_arg) {
    var CompileError, compile, get_group, group, require_group, self;
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
    group = null;
    get_group = function() {
      return group != null ? group : group = require_group(self.name);
    };
    self.globals = [];
    self.compile = compile = function(s_expr, top_level) {
      var args, first, fn, globals, ret;
      self = get_group();
      ret = (function() {
        if (typeof s_expr === "string") {
          if (/^".*"$/.test(s_expr)) {
            return self.core.string(s_expr);
          } else {
            return self.core.identifier(s_expr);
          }
        } else {
          fn = s_expr[0], args = 2 <= s_expr.length ? __slice.call(s_expr, 1) : [];
          first = args[0];
          switch (fn) {
            case "string":
              return self.core.string(first);
            case "identifier":
              return self.core.identifier(first);
            case "do":
              return self.core["do"](args);
            case "quote":
              return self.core.quote(first);
            case "defmacro":
              return self.macro.defmacro(args);
            case "infix":
              return self.core.infix(first);
            default:
              return self.core.funcall(s_expr);
          }
        }
      })();
      if (top_level) {
        globals = self.globals.length ? "var " + (self.globals.join(', ')) + ";\n" : '';
        return "(function () {\n  " + globals + ret + "\n}).call(this);";
      } else {
        return ret;
      }
    };
    return self;
  });
  oppo.module("compiler.helpers", function() {
    var self;
    self = this;
    self.thunk = (function() {
      var Thunk, ret;
      Thunk = (function() {
        function Thunk(scope, to_eval) {
          this.scope = scope;
          this.to_eval = to_eval;
        }
        Thunk.prototype.eval = function() {
          if (!this.evald) {
            this.evald = true;
            return this.result = this.scope.eval(this.scope, this.to_eval);
          } else {
            return this.result;
          }
        };
        return Thunk;
      })();
      ret = function(scope, to_eval) {
        return new Thunk(scope, to_eval);
      };
      return ret.Thunk = Thunk;
    })();
    self.thunk.resolve_one = function(x) {
      while (x instanceof thunk.Thunk) {
        x = x.eval();
      }
      return x;
    };
    self.thunk.resolve_many = function(x) {
      x = self.thunk.resolveOne(x);
      if (x instanceof Array) {
        return x.scope.map(x, function(item) {
          return self.thunk.resolveMany(item);
        });
      } else {
        return x;
      }
    };
    self.identity = function(x) {
      return x;
    };
    self.recursive_map = function(ls, fn) {
      return ls.map(function(item, i, ls) {
        if (item instanceof Array) {
          return self.recursive_map(item, fn);
        } else {
          return fn(item, i, ls);
        }
      });
    };
    self.recursive_walk = function(ls, fn) {
      var i, item, result, _len;
      for (i = 0, _len = ls.length; i < _len; i++) {
        item = ls[i];
        if (item instanceof Array) {
          result = recursive_walk(item, fn);
        } else {
          result = fn(item, i, ls);
        }
        if (result != null) {
          return result;
        }
      }
      return null;
    };
    self.gensym = (function() {
      var num;
      num = 0;
      return function(name) {
        return "_" + name + "_" + (num++);
      };
    })();
    self.stringify = {
      to_js: function(x) {
        var contents;
        if (x instanceof Array) {
          contents = x.map(self.stringify.to_js);
          return "[" + (contents.join(', ')) + "]";
        } else {
          return "" + x;
        }
      },
      to_oppo: function(x) {
        var contents;
        if (x instanceof Array) {
          contents = x.map(self.stringify.to_oppo);
          return "(" + (contents.join(' ')) + ")";
        } else {
          return "" + x;
        }
      }
    };
    return self;
  });
  oppo.module("compiler.core", ["compiler", "compiler.helpers", "compiler.macro"], function(_arg, helpers, macro) {
    var compile, self;
    compile = _arg.compile;
    self = this;
    self.identifier = helpers.identity;
    self.string = helpers.identity;
    self["do"] = function(a) {
      var body, stmt;
      s.shift();
      body = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = s.length; _i < _len; _i++) {
          stmt = s[_i];
          _results.push(compile(stmt));
        }
        return _results;
      })();
      body.push("_return(" + (body.pop()) + ")");
      return self.lambda(null, body);
    };
    self.funcall = function(s_exp) {
      var arg, args, fn, mc;
      fn = s_exp.shift();
      mc = macro.macros[fn];
      if (mc != null) {
        return compile(mc(s_exp));
      } else {
        args = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = s_exp.length; _i < _len; _i++) {
            arg = s_exp[_i];
            _results.push(compile(arg));
          }
          return _results;
        })();
        return "" + (compile(fn)) + "(" + (args.join(', ')) + ")";
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
    self.lambda = function(args, body) {
      if (args == null) {
        args = [];
      }
      args = args.map(function(arg) {
        return compile(arg);
      });
      body = body.map(function(item) {
        return compile(item);
      });
      return "function (" + (args.join(', ')) + ") {      return " + (body.join(',\n')) + ";    }";
    };
    self.def = function(ident, val) {
      ident = compile(ident);
      globals.push(ident);
      return "" + ident + " = " + (compile(val));
    };
    self.infix = function(call) {
      return compile([call.shift(), call.shift()].reverse().concat(call));
    };
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
  if (typeof global === "undefined" || global === null) {
    global = window;
  }
  if (typeof exports === "undefined" || exports === null) {
    exports = global.oppo = oppo;
  }
  oppo.module("parser", function() {
    return typeof parser !== "undefined" && parser !== null ? parser : parser = require('./parser');
  });
  oppo.module("oppo", ["parser", "compiler"], function(parser, compiler) {
    var self;
    self = this;
    self.eval = function(input) {
      var program;
      program = typeof input === "string" ? self.read(input) : input;
      return eval(compiler.compile(program));
    };
    self.eval_program = function(input) {
      return compiler.compile(input, true);
    };
    self.read = function(txt) {
      return parser.parse(txt);
    };
    exports.eval = self.eval;
    exports.read = self.read;
    return self;
  });
  oppo.module.require("oppo");
}).call(this);
