(function() {
  var getAllValues, getValue, lists, _ref;
  var __slice = Array.prototype.slice;
  _ref = (function() {
    try {
      return require('../eval_helpers');
    } catch (e) {
      return this.oppo.eval_helpers;
    }
  }).call(this), getValue = _ref.getValue, getAllValues = _ref.getAllValues;
  lists = function() {
    var RT;
    RT = this;
    /*
      LISTS
      */
    RT.list = function() {
      var items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.eval(this, ['quote', items]);
    };
    RT["typed-list"] = function() {
      var items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.eval(this, [
        function() {
          return new TypedList(items);
        }
      ]);
    };
    RT.head = RT.first = function(ls) {
      ls = getValue(ls);
      if (ls instanceof TypedList) {
        return ls.get(0);
      } else {
        return ls[0];
      }
    };
    RT.second = function(ls) {
      ls = getValue(ls);
      if (ls instanceof TypedList) {
        return ls.get(1);
      } else {
        return ls[1];
      }
    };
    RT.nth = function(ls, n) {
      ls = getValue(ls);
      if (n < 0) {
        n = ls.length + n;
      }
      if (ls instanceof TypedList) {
        return ls.get(n);
      } else {
        return ls[n];
      }
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
      var i, item, len, result, _results;
      ls = getValue(ls);
      fn = getValue(fn);
      if (Array.prototype.forEach != null) {
        return ls.forEach(fn);
      } else {
        i = -1;
        len = ls.length;
        _results = [];
        while (++i < len) {
          if (ls instanceof TypedList) {
            item = ls.get(i);
            len = ls.length;
          } else {
            item = ls[i];
          }
          result = fn(this.eval(this, item), i, ls);
          if (result != null) {
            return result;
          }
        }
        return _results;
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
      ls = getAllValues(ls);
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
      args = getAllValues(args);
      return (_ref2 = new types.List()).concat.apply(_ref2, args);
    };
    RT.count = function(ls) {
      return (getValue(ls)).length;
    };
    return RT.end = function(ls) {
      ls = getValue(ls);
      if (!(ls instanceof TypedList)) {
        throw new Error("Tried to terminate a " + (RT['typeof'](ls)) + " value. This only works with typed-lists");
      } else {
        return ls.end();
      }
    };
  };
  try {
    module.exports = lists;
  } catch (e) {
    this.oppo.mixins.lists = lists;
  }
}).call(this);
