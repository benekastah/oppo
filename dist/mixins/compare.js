(function() {
  var compare, getAllValues, getValue, types, _ref;
  var __slice = Array.prototype.slice;
  types = (function() {
    try {
      return require('../types');
    } catch (e) {
      return this.oppo.types;
    }
  }).call(this);
  _ref = (function() {
    try {
      return require('../eval_helpers');
    } catch (e) {
      return this.oppo.eval_helpers;
    }
  }).call(this), getValue = _ref.getValue, getAllValues = _ref.getAllValues;
  compare = function() {
    var RT;
    RT = this;
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
    RT["fn?"] = function(x) {
      return typeof x === "function";
    };
    return RT["typeof"] = function(x) {
      if (RT["string?"](x)) {
        return "string";
      } else if (RT["list?"](x)) {
        return "list";
      } else if (RT["num?"](x)) {
        return "number";
      } else if (RT["nil?"](x)) {
        return "nil";
      } else if (RT["fn?"](x)) {
        return "function";
      } else {
        return null;
      }
    };
  };
  try {
    module.exports = compare;
  } catch (e) {
    this.oppo.mixins.compare = compare;
  }
}).call(this);
