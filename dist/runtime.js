(function() {
  var RT, g, getNewScope, parser, recurse, recursive_walk, types, _base, _ref;
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
  types.List = (function() {
    __extends(List, Array);
    function List() {
      var items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (items) {
        this.push.apply(this, items);
      }
    }
    List.prototype.toString = function() {
      return "(" + ((this.join(' ')).replace(") (", ")\n  (")) + ")";
    };
    return List;
  })();
  types.Identifier = (function() {
    function Identifier(name, scope) {
      this.name = name;
      this.scope = scope;
      this.value = this.scope[name];
    }
    Identifier.prototype.set = function(val, scope) {
      if (scope == null) {
        scope = this.scope;
      }
      if ((scope.hasOwnProperty(this.name)) && typeof scope[this.name] !== 'undefined') {
        return this.value = scope[this.name] = val;
      } else {
        throw new Error("Can't redifine " + this.name + " in scope where it is undefined: " + scope);
      }
    };
    Identifier.prototype.def = function(val, scope) {
      if (scope == null) {
        scope = this.scope;
      }
      if ((scope.hasOwnProperty(this.name)) && typeof scope[this.name] !== 'undefined') {
        throw new Error("Can't define " + this.name + " in scope where it is already defined: " + scope);
      } else {
        return this.value = scope[this.name] = val;
      }
    };
    Identifier.test = function(s) {
      return typeof s === "string" && !(types.String.test(s)) && !(types.Number.test(s)) && /^[^\s]+$/.test(s);
    };
    return Identifier;
  })();
  types.String = (function() {
    function String(value) {
      this.value = value.replace(/^"/, '').replace(/"$/, '');
    }
    String.prototype.toString = function() {
      return this.value;
    };
    String.test = function(s) {
      return typeof s === "string" && /^"[^"]*"$/.test(s);
    };
    return String;
  })();
  types.Number = (function() {
    function Number(value) {
      this.value = +value;
    }
    Number.prototype.valueOf = function() {
      return this.value;
    };
    Number.test = function(s) {
      return (typeof s === "string" && /^\d+$/.test(s)) || typeof s === "number";
    };
    return Number;
  })();
  types.NamedArgsList = (function() {
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
  RT.types = types;
  RT["eval-js"] = g.eval;
  RT.eval = function(scope, x) {
    var argNames, args, base, bindings, case_f, case_t, done, exp, expr, exprs, fn, i, ident, item, key, keys, len, names, newScope, o, prev, ret, rname, test, val, values, _0, __, _i, _j, _len, _len2, _len3, _ref2;
    if (scope == null) {
      scope = RT;
    }
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
    } else if (types.Identifier.test(x)) {
      return new types.Identifier(x, scope);
    } else if (types.Number.test(x)) {
      return new types.Number(x);
    } else if (types.String.test(x)) {
      return new types.String(x);
    } else if (_0 === 'quote') {
      __ = x[0], exp = x[1];
      return exp;
    } else if (_0 === 'if') {
      __ = x[0], test = x[1], case_t = x[2], case_f = x[3];
      if (this.eval(scope, test)) {
        return this.eval(scope, case_t);
      } else {
        return this.eval(scope, case_f);
      }
    } else if (_0 === 'def') {
      __ = x[0], ident = x[1], exp = x[2];
      return (this.eval(scope, ident)).def(this.eval(scope, exp));
    } else if (_0 === 'defn') {
      __ = x[0], ident = x[1], argNames = x[2], exp = x[3];
      return this.eval(scope, scope.list('def', ident, scope.list('lambda', argNames, exp)));
    } else if (_0 === 'let') {
      if (types.Identifier.test(x[1])) {
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
        return this.eval(scope, ['let', bindings, ['apply', rname, ['quote', values]]]);
      } else {
        __ = x[0], bindings = x[1], exprs = 3 <= x.length ? __slice.call(x, 2) : [];
        done = false;
        i = 0;
        len = bindings.length;
        newScope = getNewScope(scope);
        if (bindings % 2) {
          throw new Error("You must have an even number of 'let' bindings.");
        }
        while (!done) {
          ident = this.eval(newScope, bindings[i++]);
          expr = this.eval(newScope, bindings[i++]);
          ident.def(expr, newScope);
          done = !(i < len);
        }
        return this.eval(newScope, ['do'].concat(__slice.call(exprs)));
      }
    } else if (_0 === 'set!') {
      __ = x[0], ident = x[1], exp = x[2];
      return (this.eval(scope, ident)).set(this.eval(scope, exp));
    } else if (_0 === 'defmacro') {
      __ = x[0], ident = x[1], argNames = x[2], exp = x[3];
      exp = this.eval(scope, exp);
      ret = __bind(function() {
        var a, argName, args, name, toEval, _len2;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (exp instanceof Array) {
          toEval = exp.slice(0);
          recursive_walk(toEval, __bind(function(item, i, ls) {
            var a, argName, name, _len2, _results;
            if (types.Identifier.test(item)) {
              name = (this.eval(scope, item)).name;
              _results = [];
              for (a = 0, _len2 = argNames.length; a < _len2; a++) {
                argName = argNames[a];
                if (argName === name) {
                  ls[i] = args[a];
                  break;
                }
              }
              return _results;
            }
          }, this));
        } else {
          toEval = exp;
          if (types.Itentifier.test(toEval)) {
            name = (this.eval(scope, item)).name;
            for (a = 0, _len2 = argNames.length; a < _len2; a++) {
              argName = argNames[a];
              if (argName === name) {
                toEval = args[a];
                break;
              }
            }
          }
        }
        return toEval;
      }, this);
      ret.is_macro = true;
      return (this.eval(scope, ident)).def(ret);
    } else if (_0 === 'lambda') {
      __ = x[0], argNames = x[1], exprs = 3 <= x.length ? __slice.call(x, 2) : [];
      ret = function() {
        newScope = getNewScope(ret.scope);
        argNames = (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return typeof result === "object" ? result : child;
        })(types.NamedArgsList, argNames.slice(0), function() {});
        argNames.format(arguments, newScope);
        return RT.eval(newScope, ['do'].concat(__slice.call(exprs)));
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
        val = this.eval(scope, exp);
      }
      return val;
    } else if (_0 === '.') {
      __ = x[0], base = x[1], keys = 3 <= x.length ? __slice.call(x, 2) : [];
      o = (this.eval(this, base)).value;
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
      fn = this.eval(scope, fn);
      if ((fn != null ? fn.value : void 0) != null) {
        fn = fn.value;
      }
      if (typeof fn !== 'function') {
        throw new Error("Tried to call non-callable: " + fn);
      }
      if (fn.is_macro) {
        return this.eval(scope, fn.apply(null, args));
      } else {
        args = (function() {
          var _k, _len4, _results;
          _results = [];
          for (_k = 0, _len4 = args.length; _k < _len4; _k++) {
            exp = args[_k];
            val = this.eval(scope, exp);
            _results.push((val != null ? val.value : void 0) || val);
          }
          return _results;
        }).call(this);
        return fn.apply(scope, args);
      }
    }
  };
  /*
  RECURSION / LOOPING
  */
  /*
  LISTS
  */
  RT.list = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.eval(this, ['quote', items]);
  };
  RT.head = RT.first = function(ls) {
    return ls[0];
  };
  RT.second = function(ls) {
    return ls[1];
  };
  RT.nth = function(ls, n) {
    if (n < 0) {
      n = ls.length + n;
    }
    return ls[n];
  };
  RT.last = function(ls) {
    return ls[ls.length - 1];
  };
  RT.tail = RT.rest = function(ls) {
    return new parser.List({
      items: ls.slice(1)
    });
  };
  RT.init = function(ls) {
    return new parser.List({
      items: ls.slice(0, ls.length - 1)
    });
  };
  RT.each = function(ls, fn) {
    var i, item, _len;
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
    if (Array.prototype.map != null) {
      return ls.map(fn);
    } else {
      ret = [];
      return RT.each(function(item, i, ls) {
        return ret.push(fn.apply(null, arguments));
      });
    }
  };
  RT.reduce = function(ls, fn) {
    var start;
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
    return (_ref2 = new types.List()).concat.apply(_ref2, args);
  };
  /*
  MATH
  */
  RT['+'] = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return RT.reduce(items, function(a, b) {
      return a + b;
    });
  };
  RT['-'] = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return RT.reduce(items, function(a, b) {
      return a - b;
    });
  };
  RT['*'] = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return RT.reduce(items, function(a, b) {
      return a * b;
    });
  };
  RT['/'] = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return RT.reduce(items, function(a, b) {
      return a / b;
    });
  };
  RT['sqrt'] = function(x) {
    return g.Math.sqrt(x);
  };
  /*
  COMPARISONS
  */
  RT['>'] = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return RT.reduce(items, function(a, b) {
      return a > b;
    });
  };
  RT['<'] = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return RT.reduce(items, function(a, b) {
      return a < b;
    });
  };
  RT['>='] = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return RT.reduce(items, function(a, b) {
      return a >= b;
    });
  };
  RT['<='] = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return RT.reduce(items, function(a, b) {
      return a <= b;
    });
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
  /*
  MISC / INTEROP
  */
  RT["print!"] = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, items);
  };
  RT.repeat = function() {
    var doBlock, exprs, times, _i, _results;
    times = arguments[0], exprs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    doBlock = ['do'].concat(__slice.call(exprs));
    _results = [];
    for (_i = 1; 1 <= times ? _i <= times : _i >= times; 1 <= times ? _i++ : _i--) {
      _results.push(this.eval(this, doBlock));
    }
    return _results;
  };
  RT.global = g;
  try {
    module.exports = RT;
  } catch (e) {
    g.Runtime = RT;
  }
}).call(this);
