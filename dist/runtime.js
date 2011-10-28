(function() {
  var DeferredEval, NamedArgsList, RT, compare, defer, evalProgram, g, getNewScope, getValue, getValues, parser, recurse, recursive_walk, types, _base, _ref;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  parser = (function() {
    try {
      return (require('./parser')).parser;
    } catch (e) {
      return this.parser;
    }
  }).call(this);
  recurse = (function() {
    try {
      return (require('./tco')).parser;
    } catch (e) {
      return this.recurse;
    }
  }).call(this);
  g = (function() {
    try {
      return window;
    } catch (e) {
      return global;
    }
  })();
  types = {};
  types.List = parser.List;
  types.identifier = {
    test: function(s) {
      return typeof s === "string" && !(types.string.test(s)) && !(types.number.test(s)) && /^[^\s]+$/.test(s);
    },
    value: function(scope, ident) {
      return scope[ident];
    },
    def: function(scope, ident, val) {
      if ((scope.hasOwnProperty(ident)) && typeof scope[ident] !== 'undefined') {
        throw new Error("Can't define " + ident + " in scope where it is already defined: " + scope);
      } else {
        return scope[ident] = val;
      }
    },
    "set!": function(scope, ident, val) {
      if ((scope.hasOwnProperty(ident)) && typeof scope[ident] !== 'undefined') {
        return scope[ident] = val;
      } else {
        throw new Error("Can't redifine " + ident + " in scope where it is not defined: " + scope);
      }
    }
  };
  types.string = {
    test: function(s) {
      return typeof s === "string" && /^"[^"]*"$/.test(s);
    },
    value: function(s) {
      return (s.replace(/^"/, '')).replace(/"$/, '');
    }
  };
  types.number = {
    test: function(s) {
      return (typeof s === "string" && /^\d+$/.test(s)) || typeof s === "number";
    },
    value: function(n) {
      return +n;
    }
  };
  NamedArgsList = (function() {
    __extends(NamedArgsList, types.List);
    function NamedArgsList() {
      NamedArgsList.__super__.constructor.apply(this, arguments);
    }
    NamedArgsList.prototype.format = function(argsList, scope) {
      var args, i, name, restArgs, restIndex, restName, value, _len;
      args = new types.List;
      for (i = 0, _len = argsList.length; i < _len; i++) {
        value = argsList[i];
        name = this[i] || '';
        if (restArgs) {
          restArgs.push(value);
        } else if ((name.substr(0, 3)) === this.REST) {
          restArgs = new types.List;
          restName = name.substr(3);
          restIndex = i;
          restArgs.push(value);
        } else {
          args.push(value);
          scope[name || this.unnamedParam(i)] = value;
        }
      }
      if (restName) {
        args.push(restArgs);
        scope[restName || this.unnamedParam(restIndex)] = restArgs;
      }
      return args;
    };
    NamedArgsList.prototype.unnamedParam = function(i) {
      return "%" + (i + 1);
    };
    NamedArgsList.prototype.REST = '...';
    return NamedArgsList;
  })();
  DeferredEval = (function() {
    function DeferredEval(scope, toEval) {
      this.scope = scope;
      this.toEval = toEval;
    }
    DeferredEval.prototype.call = function() {
      var _ref;
      if ((_ref = this.result) == null) {
        this.result = RT.eval(this.scope, this.toEval);
      }
      return this.result;
    };
    return DeferredEval;
  })();
  defer = function(scope, toEval) {
    return new DeferredEval(scope, toEval);
  };
  getValue = function(x) {
    var ret;
    ret = x;
    while (ret instanceof DeferredEval) {
      ret = ret.call();
    }
    return ret;
  };
  getValues = function(x) {
    return RT.map(x, function(item) {
      return getValue(item);
    });
  };
  if ((_ref = (_base = g.Object).create) == null) {
    _base.create = (function() {
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
  recursive_walk = function(ls, fn) {
    var i, item, _len;
    for (i = 0, _len = ls.length; i < _len; i++) {
      item = ls[i];
      if (item instanceof Array) {
        recursive_walk(item, fn);
      } else {
        fn(item, i, ls);
      }
    }
    return null;
  };
  getNewScope = function(scope) {
    var ret;
    if (scope == null) {
      scope = RT;
    }
    ret = Object.create(scope);
    return ret;
  };
  RT = Object.create(g);
  RT.global = g;
  RT["eval-js"] = g.eval;
  RT.eval = function(scope, x) {
    var argNames, args, base, bindings, case_f, case_t, done, exp, expr, exprs, fn, i, ident, item, key, keys, len, names, newScope, o, prev, ret, rname, test, val, values, _0, __, _i, _j, _len, _len2, _len3, _len4, _ref2;
    if (scope == null) {
      scope = RT;
    }
    x = getValue(x);
    _0 = (function() {
      try {
        return x[0];
      } catch (_e) {}
    })();
    if (x === 'nil' || !(x != null)) {
      return null;
    } else if (x === '#t') {
      return true;
    } else if (x === '#f') {
      return false;
    } else if (types.identifier.test(x)) {
      return types.identifier.value(scope, x);
    } else if (types.number.test(x)) {
      return types.number.value(x);
    } else if (types.string.test(x)) {
      return types.string.value(x);
    } else if (_0 === 'quote') {
      __ = x[0], exp = x[1];
      return exp;
    } else if (_0 === 'if') {
      __ = x[0], test = x[1], case_t = x[2], case_f = x[3];
      if (getValue(this.eval(scope, test))) {
        return defer(scope, case_t);
      } else {
        return defer(scope, case_f);
      }
    } else if (_0 === 'def') {
      __ = x[0], ident = x[1], exp = x[2];
      return types.identifier.def(RT, ident, defer(scope, exp));
    } else if (_0 === 'set!') {
      __ = x[0], ident = x[1], exp = x[2];
      return types.identifier["set!"](RT, ident, defer(scope, exp));
    } else if (_0 === 'let') {
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
        return defer(scope, ['let', bindings, ['apply', rname, ['quote', values]]]);
      } else {
        __ = x[0], bindings = x[1], exprs = 3 <= x.length ? __slice.call(x, 2) : [];
        done = false;
        i = 0;
        len = bindings.length;
        newScope = getNewScope(scope);
        if (bindings % 2) {
          throw new Error("You must have an even number of 'let' bindings.");
        }
        while (i < len) {
          ident = bindings[i++];
          expr = defer(newScope, bindings[i++]);
          types.identifier.def(newScope, ident, expr);
        }
        return defer(newScope, ['do'].concat(__slice.call(exprs)));
      }
    } else if (_0 === 'defmacro') {
      __ = x[0], ident = x[1], argNames = x[2], exp = x[3];
      argNames = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(NamedArgsList, argNames.slice(0), function() {});
      ret = function() {
        var args, toEval, val;
        args = {};
        argNames.format(arguments, args);
        toEval = getValue(this.eval(scope, exp));
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
    } else if (_0 === 'lambda') {
      __ = x[0], argNames = x[1], exprs = 3 <= x.length ? __slice.call(x, 2) : [];
      ret = function() {
        newScope = getNewScope(ret.scope);
        argNames = (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return typeof result === "object" ? result : child;
        })(NamedArgsList, argNames.slice(0), function() {});
        argNames.format(arguments, newScope);
        return defer(newScope, ['do'].concat(__slice.call(exprs)));
      };
      ret.toString = function() {
        return "(lambda " + (exprs.join(' ')) + ")";
      };
      ret.value = ret;
      ret.arity = argNames.length;
      ret.scope = scope;
      return ret;
    } else if (_0 === 'do') {
      _ref2 = x.slice(1);
      for (_i = 0, _len2 = _ref2.length; _i < _len2; _i++) {
        exp = _ref2[_i];
        val = getValue(this.eval(scope, exp));
      }
      return val;
    } else if (_0 === '.') {
      __ = x[0], base = x[1], keys = 3 <= x.length ? __slice.call(x, 2) : [];
      o = getValue(this.eval(scope, base));
      for (_j = 0, _len3 = keys.length; _j < _len3; _j++) {
        key = keys[_j];
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
    } else {
      fn = x[0], args = 2 <= x.length ? __slice.call(x, 1) : [];
      fn = getValue(this.eval(scope, fn));
      if (typeof fn !== 'function') {
        throw new Error("Tried to call non-callable: " + fn);
      }
      if (fn.is_macro) {
        return getValue(this.eval(scope, fn.apply(scope, args)));
      } else {
        for (i = 0, _len4 = args.length; i < _len4; i++) {
          item = args[i];
          args[i] = defer(scope, item);
        }
        if (fn === RT.eval) {
          args.unshift(scope);
        }
        return fn.apply(scope, args);
      }
    }
  };
  /*
  FUNCTIONS
  */
  RT.apply = function() {
    var args, fn, ls, lsCopy, _i;
    fn = arguments[0], args = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), ls = arguments[_i++];
    ls.unshift.apply(ls, args);
    lsCopy = ls.slice(0);
    return fn.apply(null, lsCopy);
  };
  RT.curry = function() {
    var args, fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return fn.bind.apply(fn, [this].concat(__slice.call(args)));
  };
  /*
  LISTS
  */
  RT.list = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return defer(this, ['quote', items]);
  };
  RT.head = RT.first = function(ls) {
    return (getValue(ls))[0];
  };
  RT.second = function(ls) {
    return (getValue(ls))[1];
  };
  RT.nth = function(ls, n) {
    ls = getValue(ls);
    if (n < 0) {
      n = ls.length + n;
    }
    return ls[n];
  };
  RT.last = function(ls) {
    ls = getValue(ls);
    return ls[ls.length - 1];
  };
  RT.tail = RT.rest = function(ls) {
    return (getValue(ls)).slice(1);
  };
  RT.init = function(ls) {
    return (getValue(ls)).slice(0, -1);
  };
  RT.each = function(ls, fn) {
    var i, item, _len;
    ls = getValue(ls);
    fn = getValue(fn);
    if (Array.prototype.forEach != null) {
      return ls.forEach(fn);
    } else {
      for (i = 0, _len = ls.length; i < _len; i++) {
        item = ls[i];
        fn(this.eval(this, item), i, ls);
      }
      return null;
    }
  };
  RT.map = function(ls, fn) {
    var ret;
    ls = getValue(ls);
    fn = getValue(fn);
    if (Array.prototype.map != null) {
      return ls.map(fn);
    } else {
      ret = [];
      return RT.each(ls, function() {
        return ret.push(fn.apply(null, arguments));
      });
    }
  };
  RT.reduce = function(ls, fn) {
    var start;
    ls = getValue(ls);
    fn = getValue(fn);
    if (Array.prototype.reduce != null) {
      return ls.reduce(fn);
    } else {
      start = ls.shift();
      RT.each(ls, function(item, i, ls) {
        return start = fn(start, item, i, ls);
      });
      return start;
    }
  };
  RT.concat = function() {
    var args, _ref2;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    args = getValues(args);
    return (_ref2 = new types.List()).concat.apply(_ref2, args);
  };
  RT.count = function(ls) {
    return (getValue(ls)).length;
  };
  /*
  MATH
  */
  RT['+'] = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return RT.reduce(items, function(a, b) {
      return (getValue(a)) + (getValue(b));
    });
  };
  RT['-'] = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return RT.reduce(items, function(a, b) {
      return (getValue(a)) - (getValue(b));
    });
  };
  RT['*'] = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return RT.reduce(items, function(a, b) {
      return (getValue(a)) * (getValue(b));
    });
  };
  RT['**'] = function(x) {
    return Math.pow(getValue(x));
  };
  RT['/'] = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return RT.reduce(items, function(a, b) {
      return (getValue(a)) / (getValue(b));
    });
  };
  RT['sqrt'] = function(x) {
    return Math.sqrt(getValue(x));
  };
  /*
  COMPARISONS
  */
  compare = function() {
    var item, items, prev, test, _i, _len;
    test = arguments[0], prev = arguments[1], items = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      if (!test(prev, item)) {
        return false;
      }
      prev = item;
    }
    return true;
  };
  RT['>'] = RT.curry(compare, function(a, b) {
    return (getValue(a)) > (getValue(b));
  });
  RT['<'] = RT.curry(compare, function(a, b) {
    return (getValue(a)) < (getValue(b));
  });
  RT['>='] = RT.curry(compare, function(a, b) {
    return (getValue(a)) >= (getValue(b));
  });
  RT['<='] = RT.curry(compare, function(a, b) {
    return (getValue(a)) <= (getValue(b));
  });
  RT['='] = RT.curry(compare, function(a, b) {
    return (getValue(a)) === (getValue(b));
  });
  RT['not='] = RT.curry(compare, function(a, b) {
    return (getValue(a)) !== (getValue(b));
  });
  RT.or = RT.curry(compare, function(a, b) {
    return !(getValue(a)) || (getValue(b));
  });
  RT.and = RT.curry(compare, function(a, b) {
    return (getValue(a)) && (getValue(b));
  });
  RT.not = function(a) {
    return (a = getValue(a)) === false || a === null;
  };
  /*
  TYPE CHECKING
  */
  RT["string?"] = function(x) {
    return typeof (x = getValue(x)) === "string" || x instanceof String;
  };
  RT["list?"] = function(x) {
    return (getValue(x)) instanceof Array;
  };
  RT["num?"] = function(x) {
    return typeof (x = getValue(x)) === "number" || x instanceof Number;
  };
  RT["nil?"] = function(x) {
    return !((getValue(x)) != null);
  };
  /*
  MISC / INTEROP
  */
  RT.print = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    items = getValues(items);
    return console.log.apply(console, items);
  };
  RT.repeat = function() {
    var doBlock, exprs, times, _i, _ref2, _results;
    times = arguments[0], exprs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    exprs = getValues(exprs);
    doBlock = ['do'].concat(__slice.call(exprs));
    _results = [];
    for (_i = 1, _ref2 = getValue(times); 1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; 1 <= _ref2 ? _i++ : _i--) {
      _results.push(this.eval(this, doBlock));
    }
    return _results;
  };
  /*
  ENVIRONMENT MACROS
  */
  RT.eval(null, parser.parse('(defmacro defn ($ident $arg-names ...$exprs)\n  \'(let (exprs (if (= (count \'$exprs) 1)\n                  (first \'$exprs)\n                  \'$exprs))\n    (def $ident (lambda $arg-names\n      (eval exprs)))))\n      \n(defmacro debug (& to-eval)\n  \'(let (result (eval to-eval))\n    (print result)\n    result))'));
  evalProgram = function(program) {
    var result;
    result = RT.eval(RT, program);
    return getValue(result);
  };
  try {
    module.exports = RT;
  } catch (e) {
    g.Runtime = RT;
  }
}).call(this);
