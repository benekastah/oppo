(function() {
  var oppo, _load, _module, _module_list, _require;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  oppo = {};
  _module_list = {};
  _module = function(name, deps, fn) {
    var mod;
    mod = _module_list[name];
    if (mod != null) {
      console.warn("Redefining module " + name);
    }
    if (arguments.length === 2) {
      fn = deps;
      deps = [];
    }
    return _module_list[name] = {
      deps: deps,
      fn: fn
    };
  };
  _module.require = _require = function(name, force) {
    var dep, deps, fn, mod, _ref;
    mod = _module_list[name];
    fn = mod.fn, deps = mod.deps;
    if (force) {
      mod.cache = null;
    }
    return (_ref = mod.cache) != null ? _ref : mod.cache = fn.apply(null, (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = deps.length; _i < _len; _i++) {
        dep = deps[_i];
        _results.push(_require(dep));
      }
      return _results;
    })());
  };
  _module.load = _load = function(name) {
    return _require(name, true);
  };
  _module("module", function() {
    return _module;
  });
  _module("require", ["module"], function(mod) {
    return mod.require;
  });
  _module("load", ["module"], function(mod) {
    return mod.load;
  });
  /*
  EXPORT MODULE
  */
  oppo.module = _module;
  oppo.module("compiler", ["lang.core", "lang.arithmetic"], function() {
    var run_compiler, self, stringify;
    self = {};
    stringify = function(x) {
      var contents;
      if (x instanceof Array) {
        contents = x.map(stringify);
        return "(" + (contents.join(' ')) + ")";
      } else {
        return "" + x;
      }
    };
    self.compilers = [];
    self.greedy_compilers = [];
    self.register = function(name, type, test, action) {
      return self.compilers.push({
        name: name,
        type: type,
        test: test,
        action: action
      });
    };
    self.register_greedy = function(name, type, test, action) {
      return self.greedy_compilers.push({
        name: name,
        type: type,
        test: test,
        action: action
      });
    };
    self.CompileError = (function() {
      __extends(CompileError, Error);
      function CompileError(message) {
        this.message = message;
      }
      CompileError.prototype.name = "CompileError";
      CompileError.prototype.type = "CompileError";
      return CompileError;
    })();
    run_compiler = function(program, first, compiler) {
      var action, name, result, test;
      name = compiler.name, test = compiler.test, action = compiler.action;
      if (test(program, first)) {
        return result = action(program, self.compile);
      }
    };
    self.compile = function(program) {
      var action, compiled, compiler, first, name, test, _i, _len, _ref;
      compiled = false;
      first = (function() {
        try {
          return program[0];
        } catch (_e) {}
      })();
      if (self.greedy_compilers.length) {
        self.compilers.push.apply(self.greedy_compilers);
        self.greedy_compilers = [];
      }
      console.log(self.compilers);
      _ref = self.compilers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        compiler = _ref[_i];
        name = compiler.name, test = compiler.test, action = compiler.action;
        if (test(program, first)) {
          return action(program, self.compile);
        }
      }
      throw new self.CompileError("Unable to compile " + (stringify(program)) + " because no compiler action recognized it.");
    };
    return self;
  });
  oppo.module("helpers", function() {
    var self;
    self = {};
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
    return self;
  });
  oppo.module("lang.arithmetic", ["compiler"], function(compiler) {
    var arithmetic_row, self;
    self = {};
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
    self = {};
    self.eval = compiler.compile;
    self.parse = function(txt) {
      var program;
      program = parser.parse(txt);
      return self.eval(program);
    };
    exports.eval = self.eval;
    exports.parse = self.parse;
    return self;
  });
  oppo.module.require("oppo");
}).call(this);
