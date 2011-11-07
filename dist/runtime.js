(function() {
  var RT, eval_helpers, eval_helpers_fn, g, getAllValues, getValue, mixins, parser, recurse, types;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  parser = (function() {
    try {
      return (require('./parser')).parser;
    } catch (e) {
      return oppo.parser;
    }
  })();
  recurse = (function() {
    try {
      return require('./recurse');
    } catch (e) {
      return oppo.recurse;
    }
  })();
  eval_helpers_fn = (function() {
    try {
      return require('./eval_helpers');
    } catch (e) {
      return oppo.eval_helpers;
    }
  })();
  types = (function() {
    try {
      return require('./types');
    } catch (e) {
      return oppo.types;
    }
  })();
  mixins = {
    compare: (function() {
      try {
        return require('./mixins/compare');
      } catch (e) {
        return oppo.mixins.compare;
      }
    })(),
    functions: (function() {
      try {
        return require('./mixins/functions');
      } catch (e) {
        return oppo.mixins.functions;
      }
    })(),
    lists: (function() {
      try {
        return require('./mixins/lists');
      } catch (e) {
        return oppo.mixins.lists;
      }
    })(),
    math: (function() {
      try {
        return require('./mixins/math');
      } catch (e) {
        return oppo.mixins.math;
      }
    })(),
    misc: (function() {
      try {
        return require('./mixins/misc');
      } catch (e) {
        return oppo.mixins.misc;
      }
    })()
  };
  g = (function() {
    try {
      return window;
    } catch (e) {
      return global;
    }
  })();
  RT = {};
  eval_helpers = eval_helpers_fn(RT);
  getValue = eval_helpers.getValue, getAllValues = eval_helpers.getAllValues;
  RT["native"] = g;
  RT.global = RT;
  RT["eval-js"] = g.eval;
  RT.eval = function(scope, x) {
    var get_last_value, has_side_affects, ret, _0;
    if (scope == null) {
      scope = RT;
    }
    x = getValue(x);
    _0 = (function() {
      try {
        return x[0];
      } catch (_e) {}
    })();
    has_side_affects = eval_helpers.has_side_affects(x, RT);
    get_last_value = false;
    ret = __bind(function() {
      var exp;
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
        return exp = x[1];
      } else if (_0 === 'if') {
        return eval_helpers["if"](scope, x);
      } else if (_0 === 'def') {
        return eval_helpers.def(scope, x, RT);
      } else if (_0 === 'set!') {
        return eval_helpers.set(scope, x, RT);
      } else if (_0 === 'let') {
        return eval_helpers["let"](scope, x);
      } else if (_0 === 'defmacro') {
        return eval_helpers.defmacro(scope, x);
      } else if (_0 === 'lambda' || _0 === 'fn') {
        return eval_helpers.lambda(scope, x);
      } else if (_0 === 'do') {
        get_last_value = true;
        return eval_helpers["do"](scope, x);
      } else if (_0 === '.') {
        return eval_helpers.property_access(scope, x);
      } else {
        return eval_helpers.func_call(scope, x, RT);
      }
    }, this)();
    ret = has_side_affects ? getAllValues(ret) : ret;
    if (get_last_value) {
      ret = RT.last(ret);
    }
    return ret;
  };
  mixins.functions.call(RT);
  mixins.compare.call(RT);
  mixins.lists.call(RT);
  mixins.math.call(RT);
  mixins.misc.call(RT);
  try {
    module.exports = RT;
  } catch (e) {
    oppo.runtime = RT;
  }
}).call(this);
