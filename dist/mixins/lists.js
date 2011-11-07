(function() {
  var lists, types;
  var __slice = Array.prototype.slice;
  types = (function() {
    try {
      return require('../types');
    } catch (e) {
      return oppo.types;
    }
  })();
  lists = function() {
    var RT, getAllValues, getValue, _ref;
    RT = this;
    _ref = ((function() {
      try {
        return require('../eval_helpers');
      } catch (e) {
        return oppo.eval_helpers;
      }
    })())(RT), getValue = _ref.getValue, getAllValues = _ref.getAllValues;
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
      return new types.TypedList(items);
    };
    RT.head = RT.first = function(ls) {
      ls = getValue(ls);
      if (ls instanceof types.TypedList) {
        return ls.get(0);
      } else {
        return ls[0];
      }
    };
    RT.second = function(ls) {
      ls = getValue(ls);
      if (ls instanceof types.TypedList) {
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
      if (ls instanceof types.TypedList) {
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
          if (ls instanceof types.TypedList) {
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
      if (ls.reduce != null) {
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
      if (!(ls instanceof types.TypedList)) {
        throw new Error("Tried to terminate a " + (RT['typeof'](ls)) + " value. This only works with typed-lists");
      } else {
        return ls.end();
      }
    };
    /*
      pluck = (a, i) ->
        a[...i].concat a[(i + 1)..]
    
      insert = (a, i, item) ->
        a[...i].concat item, a[i..]
    
      move = (a, old_i, new_i) ->
        val = a[old_i]
        a = pluck a, old_i
        a = insert a, new_i, val
      */
  };
  try {
    module.exports = lists;
  } catch (e) {
    oppo.mixins.lists = lists;
  }
}).call(this);
