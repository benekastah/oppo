(function() {
  var getAllValues, getValue, misc, _ref;
  var __slice = Array.prototype.slice;
  _ref = (function() {
    try {
      return require('../eval_helpers');
    } catch (e) {
      return this.oppo.eval_helpers;
    }
  }).call(this), getValue = _ref.getValue, getAllValues = _ref.getAllValues;
  misc = function() {
    var RT;
    RT = this;
    /*
      MISC / INTEROP
      */
    return RT.repeat = function() {
      var doBlock, exprs, times, _i, _ref2, _results;
      times = arguments[0], exprs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      exprs = getAllValues(exprs);
      doBlock = ['do'].concat(__slice.call(exprs));
      _results = [];
      for (_i = 1, _ref2 = getValue(times); 1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; 1 <= _ref2 ? _i++ : _i--) {
        _results.push(this.eval(this, doBlock));
      }
      return _results;
    };
  };
  try {
    module.exports = misc;
  } catch (e) {
    this.oppo.mixins.misc = misc;
  }
}).call(this);
