(function() {
  var math;
  var __slice = Array.prototype.slice;
  math = function() {
    var RT, getAllValues, getValue, _ref;
    RT = this;
    _ref = (function() {
      try {
        return (require('../eval_helpers'))(RT);
      } catch (e) {
        return this.oppo.eval_helpers;
      }
    }).call(this), getValue = _ref.getValue, getAllValues = _ref.getAllValues;
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
    return RT['sqrt'] = function(x) {
      return Math.sqrt(getValue(x));
    };
  };
  try {
    module.exports = math;
  } catch (e) {
    this.oppo.mixins.math = math;
  }
}).call(this);
