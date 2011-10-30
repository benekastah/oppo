(function() {
  var funcs, getAllValues, getValue, _ref;
  var __slice = Array.prototype.slice;
  _ref = (function() {
    try {
      return require('../eval_helpers');
    } catch (e) {
      return this.oppo.eval_helpers;
    }
  }).call(this), getValue = _ref.getValue, getAllValues = _ref.getAllValues;
  funcs = function() {
    var RT, _ref2;
    RT = this;
    _ref2 = (function() {
      try {
        return (require('../eval_helpers'))(RT);
      } catch (e) {
        return this.oppo.eval_helpers;
      }
    }).call(this), getValue = _ref2.getValue, getAllValues = _ref2.getAllValues;
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
    this.oppo.mixins.functions = funcs;
  }
}).call(this);
