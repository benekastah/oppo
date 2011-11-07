(function() {
  var funcs, types;
  var __slice = Array.prototype.slice;
  types = (function() {
    try {
      return require('../types');
    } catch (e) {
      return oppo.types;
    }
  })();
  funcs = function() {
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
      FUNCTIONS
      */
    RT.apply = function() {
      var args, fn, ls, lsCopy, _i;
      fn = arguments[0], args = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), ls = arguments[_i++];
      ls.unshift.apply(ls, args);
      lsCopy = ls.slice(0);
      return fn.apply(null, lsCopy);
    };
    return RT.curry = function() {
      var args, fn;
      fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return fn.bind.apply(fn, [this].concat(__slice.call(args)));
    };
  };
  try {
    module.exports = funcs;
  } catch (e) {
    oppo.mixins.functions = funcs;
  }
}).call(this);
