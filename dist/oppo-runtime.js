(function () {
  var oppoString, code, result, oppo;

  if (typeof window === 'undefined')
    oppo = exports;
  else
    oppo = window.oppo;
    
  var Module, module_error, module_get, module_get_path, module_set, modules;

oppo.compile(oppo.read("\n(defmacro defn (nm argslist ...body)\n  `(def ~nm (lambda ~argslist ...body)))\n\n(defmacro log (...things)\n  `((. console 'log) ...things))\n\n;; Strings\n(defmacro replace (base ...items)\n  `((. ~base 'replace) ...items))\n\n(defmacro remove (base pattern)\n  `(replace base pattern \"\"))\n\n(defmacro match (base pattern)\n  `((. ~base 'match) pattern))\n"));

modules = oppo.modules = {};

module_error = function(msg) {
  throw "Module-Error: " + msg;
};

module_get_path = function(name) {
  if (_.isString(name)) {
    return name.split('/');
  } else {
    return module_error("Not a valid module path: " + module);
  }
};

module_get = function(name) {
  var item, path, value, _i, _len;
  path = module_get_path(name);
  value = modules;
  for (_i = 0, _len = path.length; _i < _len; _i++) {
    item = path[_i];
    value = value != null ? value[item] : void 0;
    if (!(value != null)) module_error("Undefined module: " + name);
  }
  return value;
};

module_set = function(name, value) {
  var base, final_name, final_value, item, mod, path, _i, _len;
  path = module_get_path(name);
  final_name = path.pop();
  mod = modules;
  for (_i = 0, _len = path.length; _i < _len; _i++) {
    item = path[_i];
    base = mod;
    mod = base[item];
    if (!(mod != null)) {
      if (!(base instanceof Module)) {
        mod = base[item] = {};
      } else {
        module_error("Module " + name + " can't be set as a member of another module");
      }
    }
  }
  final_value = mod[final_name];
  if (final_value != null) {
    if (typeof console !== "undefined" && console !== null) {
      if (typeof console.warn === "function") {
        console.warn("Redefining module " + name);
      }
    }
  }
  return mod[final_name] = value;
};

Module = (function() {

  function Module(name, imports, load) {
    this.name = name;
    this.imports = imports;
    this.load = load;
    this.result = {};
  }

  Module.prototype.require = function(force) {
    var deps, previous, required, requiring, _ref, _ref2;
    if (force == null) force = false;
    _ref = Module.statuses, requiring = _ref.requiring, required = _ref.required;
    previous = (_.last(Module.current)) || {};
    Module.current.push(this);
    if (force) {
      this.status = null;
      this.result = {};
    }
    if ((_ref2 = this.status) === requiring || _ref2 === required) {
      if (this.status === requiring) {
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.warn === "function") {
            console.warn("Circular dependency detected between " + this.name + " and " + previous.name);
          }
        }
      }
      return this.result;
    }
    this.status = requiring;
    deps = this.get_deps();
    this.load.apply(this.result, deps);
    this.status = required;
    Module.current.pop();
    return this.result;
  };

  Module.prototype.get_deps = function() {
    var args, imported, mod, name, _i, _len, _ref;
    args = [];
    _ref = this.imports;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      mod = module_get(name);
      if (mod instanceof Module) {
        imported = mod.require();
      } else {
        module_error("Cannot require non-module: " + item);
      }
      args.push(imported);
    }
    return args;
  };

  Module.prototype.status = null;

  Module.statuses = {
    requiring: "REQUIRING",
    required: "REQUIRED"
  };

  Module.current = [];

  return Module;

})();

oppo.module = function(name, imports, fn) {
  if (imports == null) imports = [];
  module_set(name, new Module(name, imports, fn));
  return null;
};

oppo.module.require = function(name, force) {
  var mod;
  mod = module_get(name);
  return mod != null ? mod.require(force) : void 0;
};

    
  (oppo.module("oppo/core", [], function () {
  var self, cond_16l4qtkgl_40ftbk1;
  with (self = this) {
    return (/* def self.global */ (typeof self.global === 'undefined' ?
  (self.global = /* if */ ((cond_16l4qtkgl_40ftbk1 = (typeof window !== 'undefined')) !== false && cond_16l4qtkgl_40ftbk1 !== null && cond_16l4qtkgl_40ftbk1 !== '' ?
  window :
  global)
/* end if */) :
  ((function () { throw "Can't define variable that is already defined: self.global" })()))
/* end def self.global */,
/* defmacro defn */ null,
/* def self.read */ (typeof self.read === 'undefined' ?
  (self.read = (function (s) {
  return oppo.read(s);
})) :
  ((function () { throw "Can't define variable that is already defined: self.read" })()))
/* end def self.read */,
/* def self.__rangle_bool */ (typeof self.__rangle_bool === 'undefined' ?
  (self.__rangle_bool = (function (x) {
  return !(x == null || x === false || x === "" || x !== x);
})) :
  ((function () { throw "Can't define variable that is already defined: self.__rangle_bool" })()))
/* end def self.__rangle_bool */,
/* def self.__rangle_num */ (typeof self.__rangle_num === 'undefined' ?
  (self.__rangle_num = (function (n) {
  return global["Number"](n);
})) :
  ((function () { throw "Can't define variable that is already defined: self.__rangle_num" })()))
/* end def self.__rangle_num */,
/* def self.__rangle_str */ (typeof self.__rangle_str === 'undefined' ?
  (self.__rangle_str = (function (s) {
  return "" + s;
})) :
  ((function () { throw "Can't define variable that is already defined: self.__rangle_str" })()))
/* end def self.__rangle_str */,
/* def self.not */ (typeof self.not === 'undefined' ?
  (self.not = (function (x) {
  return (function () {
  var bx;
return bx = __rangle_bool(x), !bx;
}).apply(this, typeof arguments !== "undefined" ? arguments : []);
})) :
  ((function () { throw "Can't define variable that is already defined: self.not" })()))
/* end def self.not */,
(function () {
  var binary_each;
return binary_each = (function (type, ls) {
  return (function () {
  var item, cond_16l4qtkh2_r5b8bc;
return item = nth(ls, 1), /* if */ ((cond_16l4qtkh2_r5b8bc = (((type === "or") && __rangle_bool(item)) || ((type === "and") && not(item)) || (ls.length === 0))) !== false && cond_16l4qtkh2_r5b8bc !== null && cond_16l4qtkh2_r5b8bc !== '' ?
  item :
  binary_each(type, ls.slice(1)))
/* end if */;
}).apply(this, typeof arguments !== "undefined" ? arguments : []);
}), /* def self.or */ (typeof self.or === 'undefined' ?
  (self.or = (function () {
  var items;
return (items = Array.prototype.slice.call(arguments, 0, arguments.length)), binary_each("or", items);
})) :
  ((function () { throw "Can't define variable that is already defined: self.or" })()))
/* end def self.or */, /* def self.and */ (typeof self.and === 'undefined' ?
  (self.and = (function () {
  var items;
return (items = Array.prototype.slice.call(arguments, 0, arguments.length)), binary_each("and", items);
})) :
  ((function () { throw "Can't define variable that is already defined: self.and" })()))
/* end def self.and */;
}).apply(this, typeof arguments !== "undefined" ? arguments : []),
/* def self.js_type */ (typeof self.js_type === 'undefined' ?
  (self.js_type = (function (x) {
  return (function () {
  var cls, type_arr, type;
return cls = global["Object"].prototype["toString"].call(x), type_arr = cls.match(/\s([a-zA-Z]+)/), type = type_arr[1], type.tolowercase();
}).apply(this, typeof arguments !== "undefined" ? arguments : []);
})) :
  ((function () { throw "Can't define variable that is already defined: self.js_type" })()))
/* end def self.js_type */,
/* def self.nth */ (typeof self.nth === 'undefined' ?
  (self.nth = (function (a, n) {
  var cond_16l4qtkhd_2433kav;
return /* if */ ((cond_16l4qtkhd_2433kav = (n === 0)) !== false && cond_16l4qtkhd_2433kav !== null && cond_16l4qtkhd_2433kav !== '' ?
  (function () { throw "nth treats collections as one-based; cannot get zeroth item" })() :
  null)
/* end if */, (function () {
  var cond_16l4qtkhe_78a6h3m, i;
return i = /* if */ ((cond_16l4qtkhe_78a6h3m = (n < 0)) !== false && cond_16l4qtkhe_78a6h3m !== null && cond_16l4qtkhe_78a6h3m !== '' ?
  a.length + n :
  n - 1)
/* end if */, a[i];
}).apply(this, typeof arguments !== "undefined" ? arguments : []);
})) :
  ((function () { throw "Can't define variable that is already defined: self.nth" })()))
/* end def self.nth */,
/* def self.first */ (typeof self.first === 'undefined' ?
  (self.first = (function (a) {
  return nth(a, 1);
})) :
  ((function () { throw "Can't define variable that is already defined: self.first" })()))
/* end def self.first */,
/* def self.second */ (typeof self.second === 'undefined' ?
  (self.second = (function (a) {
  return nth(a, 2);
})) :
  ((function () { throw "Can't define variable that is already defined: self.second" })()))
/* end def self.second */,
/* def self.last */ (typeof self.last === 'undefined' ?
  (self.last = (function (a) {
  return nth(a, -1);
})) :
  ((function () { throw "Can't define variable that is already defined: self.last" })()))
/* end def self.last */,
/* def self.concat */ (typeof self.concat === 'undefined' ?
  (self.concat = (function () {
  var base, items;
return (base = arguments[0]), (items = Array.prototype.slice.call(arguments, 1, arguments.length)), base.concat.apply(base, [].concat(splat(items)));
})) :
  ((function () { throw "Can't define variable that is already defined: self.concat" })()))
/* end def self.concat */,
/* def self.join */ (typeof self.join === 'undefined' ?
  (self.join = (function (a, s) {
  return a.join(s);
})) :
  ((function () { throw "Can't define variable that is already defined: self.join" })()))
/* end def self.join */,
(function () {
  var underscore_methods, each, array_qmark_;
return underscore_methods = { "each" : null,
"map" : null,
"reduce" : [["symbol", "reduce"], ["symbol", "foldl"]],
"reduceRight" : [["symbol", "reduce-right"], ["symbol", "foldr"]],
"find" : null,
"filter" : null,
"reject" : null,
"all" : null,
"any" : null,
"include" : null,
"invoke" : null,
"pluck" : null,
"sortBy" : [["symbol", "sort-by"]],
"groupBy" : [["symbol", "group-by"]],
"sortedIndex" : [["symbol", "sorted-index"]],
"suffle" : null,
"toArray" : [["symbol", "->array"]],
"size" : null,
"first" : [["symbol", "first"], ["symbol", "head"]],
"initial" : [["symbol", "initial"], ["symbol", "init"]],
"last" : null,
"rest" : [["symbol", "rest"], ["symbol", "tail"]],
"compact" : null,
"flatten" : null,
"without" : null,
"union" : null,
"intersection" : null,
"difference" : null,
"uniq" : null,
"zip" : null,
"indexOf" : [["symbol", "index-of"]],
"lastIndexOf" : [["symbol", "last-index-of"]],
"range" : null,
"bind" : null,
"bindAll" : [["symbol", "bind-all"]],
"memoize" : null,
"delay" : null,
"defer" : null,
"throttle" : null,
"debounce" : null,
"once" : null,
"after" : null,
"wrap" : null,
"compose" : null,
"keys" : null,
"values" : null,
"functions" : null,
"extend" : null,
"defaults" : null,
"clone" : null,
"tap" : null,
"isEqual" : [["symbol", "equal?"], ["symbol", "="]],
"isEmpty" : [["symbol", "empty?"]],
"isElement" : [["symbol", "element?"]],
"isArray" : [["symbol", "array?"]],
"isArguments" : [["symbol", "arguments?"]],
"isFunction" : [["symbol", "function?"]],
"isNumber" : [["symbol", "number?"]],
"isBoolean" : [["symbol", "boolean?"], ["symbol", "bool?"]],
"isDate" : [["symbol", "date?"]],
"isRegExp" : [["symbol", "regex?"]],
"isNaN" : [["symbol", "nan?"]],
"isNull" : [["symbol", "nil?"]],
"isUndefined" : [["symbol", "undefined?"]],
"identity" : null,
"times" : null,
"uniqueId" : [["symbol", "unique-id"]],
"escape" : null,
"template" : null,
"chain" : null,
"value" : null }, each = _.each, array_qmark_ = _["isArray"], each(underscore_methods, (function (v, k) {
  var cond_16l4qtkhu_6fo30km;
return /* if */ ((cond_16l4qtkhu_6fo30km = array_qmark_(v)) !== false && cond_16l4qtkhu_6fo30km !== null && cond_16l4qtkhu_6fo30km !== '' ?
  each(v, (function (i, v) {
  return /* def self.v */ (typeof self.v === 'undefined' ?
  (self.v = _.k) :
  ((function () { throw "Can't define variable that is already defined: self.v" })()))
/* end def self.v */;
})) :
  /* def self.v */ (typeof self.v === 'undefined' ?
  (self.v = _.k) :
  ((function () { throw "Can't define variable that is already defined: self.v" })()))
/* end def self.v */)
/* end if */;
}));
}).apply(this, typeof arguments !== "undefined" ? arguments : []));
  }
}))
})();