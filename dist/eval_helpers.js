(function() {
  var RT, eval, getAllValues, getValue, oppo, recursive_walk, thunk, types, _ref;
  var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  eval = (function() {
    try {
      return exports;
    } catch (e) {
      return this.oppo.eval_helpers = {};
    }
  }).call(this);
  oppo = this.oppo || {};
  types = (function() {
    try {
      return require('./types');
    } catch (e) {
      return this.oppo.types;
    }
  }).call(this);
  try {
    RT = require('./runtime');
  } catch (_e) {}
  /*
  DEALING WITH THUNKS
  */
  thunk = eval.thunk = function(scope, toEval) {
    return new types.Thunk(scope, toEval);
  };
  getValue = eval.getValue = function(x) {
    var ret;
    ret = x;
    while (ret instanceof types.Thunk) {
      ret = ret.call();
    }
    return ret;
  };
  getAllValues = eval.getAllValues = function(x) {
    if (RT == null) {
      RT = this.oppo.runtime;
    }
    x = getValue(x);
    if (x instanceof Array) {
      return RT.map(x, function(item) {
        return getAllValues(item);
      });
    } else {
      return x;
    }
  };
  recursive_walk = eval.recursive_walk = function(ls, fn) {
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
  if ((_ref = Object.create) == null) {
    Object.create = (function() {
      var Noop;
      Noop = (function() {
        function Noop() {}
        return Noop;
      })();
      return function(p) {
        Noop.prototype = p;
        return new Noop();
      };
    })();
  }
  eval.get_new_scope = function(scope) {
    var ret;
    if (scope == null) {
      scope = RT;
    }
    ret = Object.create(scope);
    return ret;
  };
  eval.has_side_affects = function(x, RT) {
    var ret;
    if (x instanceof Array) {
      ret = recursive_walk(x, function(item, i) {
        if (i === 0 && (item === 'def' || item === 'defn') || RT.last(item) === "!") {
          return true;
        }
      });
    }
    return ret || false;
  };
  eval["if"] = function(scope, x) {
    var case_f, case_t, test, __;
    __ = x[0], test = x[1], case_t = x[2], case_f = x[3];
    if (getValue(scope.eval(scope, test))) {
      return thunk(scope, case_t);
    } else {
      return thunk(scope, case_f);
    }
  };
  eval.def = function(scope, x, RT) {
    var exp, ident, __;
    __ = x[0], ident = x[1], exp = x[2];
    return oppo.types.identifier.def(RT, ident, scope.eval(scope, exp));
  };
  eval.set = function(scope, x, RT) {
    var exp, ident, __;
    __ = x[0], ident = x[1], exp = x[2];
    return oppo.types.identifier["set!"](RT, ident, scope.eval(scope, exp));
  };
  eval["let"] = function(scope, x) {
    var bindings, done, expr, exprs, i, ident, item, len, names, new_scope, rname, values, __, _len;
    new_scope = eval.get_new_scope(scope);
    if (types.identifier.test(x[1])) {
      __ = x[0], rname = x[1], bindings = x[2], exprs = 4 <= x.length ? __slice.call(x, 3) : [];
      names = [];
      values = [];
      for (i = 0, _len = bindings.length; i < _len; i++) {
        item = bindings[i];
        if (i % 2) {
          values.push(item);
        } else {
          names.push(item);
        }
      }
      bindings.push(rname, ['lambda', names].concat(__slice.call(exprs)));
      return thunk(new_scope, ['let', bindings, ['apply', rname, ['quote', values]]]);
    } else {
      __ = x[0], bindings = x[1], exprs = 3 <= x.length ? __slice.call(x, 2) : [];
      done = false;
      i = 0;
      len = bindings.length;
      if (bindings % 2) {
        throw new Error("You must have an even number of 'let' bindings.");
      }
      while (i < len) {
        ident = bindings[i++];
        expr = thunk(new_scope, bindings[i++]);
        types.identifier.def(new_scope, ident, expr);
      }
      return thunk(new_scope, ['do'].concat(__slice.call(exprs)));
    }
  };
  eval.defmacro = function(scope, x) {
    var argNames, exp, ident, ret, __;
    __ = x[0], ident = x[1], argNames = x[2], exp = x[3];
    argNames = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return typeof result === "object" ? result : child;
    })(types.NamedArgsList, argNames.slice(0), function() {});
    ret = function() {
      var args, toEval, val;
      args = {};
      argNames.format(arguments, args);
      toEval = getValue(scope.eval(scope, exp));
      if (toEval instanceof Array) {
        recursive_walk(toEval, __bind(function(item, i, ls) {
          if (types.identifier.test(item)) {
            if (args.hasOwnProperty(item)) {
              return ls[i] = args[item];
            }
          }
        }, this));
      } else {
        toEval = exp;
        if (types.Itentifier.test(toEval)) {
          if (val = args[item] != null) {
            toEval = item;
          }
        }
      }
      return toEval;
    };
    ret.is_macro = true;
    return types.identifier.def(RT, ident, ret);
  };
  eval.lambda = function(scope, x) {
    var argNames, exprs, ret, __;
    __ = x[0], argNames = x[1], exprs = 3 <= x.length ? __slice.call(x, 2) : [];
    ret = function() {
      var newScope;
      newScope = eval.get_new_scope(ret.scope);
      argNames = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(types.NamedArgsList, argNames.slice(0), function() {});
      argNames.format(arguments, newScope);
      return thunk(newScope, ['do'].concat(__slice.call(exprs)));
    };
    ret.toString = function() {
      return "(lambda " + (exprs.join(' ')) + ")";
    };
    ret.value = ret;
    ret.arity = argNames.length;
    ret.scope = scope;
    return ret;
  };
  eval["do"] = function(scope, x) {
    var exp, val, _i, _len, _ref2, _results;
    _ref2 = x.slice(1);
    _results = [];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      exp = _ref2[_i];
      _results.push(val = thunk(scope, exp));
    }
    return _results;
  };
  eval.property_access = function(scope, x) {
    var base, key, keys, o, prev, __, _i, _len;
    __ = x[0], base = x[1], keys = 3 <= x.length ? __slice.call(x, 2) : [];
    o = getValue(scope.eval(scope, base));
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      if (o != null) {
        prev = o;
        o = o[key];
      } else {
        return null;
      }
    }
    if (typeof o === 'function') {
      return o = o.bind(prev);
    } else {
      return o;
    }
  };
  eval.func_call = function(scope, x, RT) {
    var args, fn, i, item, _len;
    fn = x[0], args = 2 <= x.length ? __slice.call(x, 1) : [];
    if (typeof (getValue(fn)) !== 'function') {
      fn = getValue(scope.eval(scope, fn));
    }
    if (typeof fn !== 'function') {
      throw new Error("Tried to call non-callable: " + fn);
    }
    if (fn.is_macro) {
      return getValue(scope.eval(scope, fn.apply(scope, args)));
    } else {
      for (i = 0, _len = args.length; i < _len; i++) {
        item = args[i];
        args[i] = thunk(scope, item);
      }
      if (fn === scope.eval) {
        args.unshift(scope);
      }
      return fn.apply(scope, args);
    }
  };
}).call(this);
