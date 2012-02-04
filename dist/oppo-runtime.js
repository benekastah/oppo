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
  var self, cond_16l4kevng_5o0vaer;
  with (self = this) {
    return (/* def self.global */ (typeof self.global === 'undefined' ?
  (self.global = /* if */ ((cond_16l4kevng_5o0vaer = (typeof window !== 'undefined')) !== false && cond_16l4kevng_5o0vaer !== null && cond_16l4kevng_5o0vaer !== '' ?
  window :
  global)
/* end if */) :
  ((function () { throw "Can't define variable that is already defined: self.global" })()))
/* end def self.global */,
eval((function (list_16l4kevng_8l1hfc1) {
  var list_16l4kevng_8l1hfc1_16l4kevnh_802hdmp;
return list_16l4kevng_8l1hfc1_16l4kevnh_802hdmp = [].concat(list_16l4kevng_8l1hfc1.slice(0, 1));
})([[["symbol", "quote"], ["symbol", "do"]]])),
/* defmacro defn */ null,
["symbol", "def"](print, [[["symbol", "quote"], [[["symbol", "quote"], ["symbol", "splat"]], [["symbol", "quote"], ["symbol", "items"]]]]]),
["symbol", "def"](eval, [[["symbol", "quote"], ["symbol", "sexp"]]]),
["symbol", "def"](read, [[["symbol", "quote"], ["symbol", "s"]]]),
["symbol", "def"](__rangle_bool, [[["symbol", "quote"], ["symbol", "x"]]]),
["symbol", "def"](__rangle_num, [[["symbol", "quote"], ["symbol", "n"]]]),
["symbol", "def"](__rangle_str, [[["symbol", "quote"], ["symbol", "s"]]]),
["symbol", "def"](not, [[["symbol", "quote"], ["symbol", "x"]]]),
(function () {
  var binary_each;
return binary_each = (function (type, ls) {
  return (function () {
  var item, cond_16l4kevo2_7hleqna;
return item = nth(ls, 1), /* if */ ((cond_16l4kevo2_7hleqna = (((type === "or") && __rangle_bool(item)) || ((type === "and") && not(item)) || (ls.length === 0))) !== false && cond_16l4kevo2_7hleqna !== null && cond_16l4kevo2_7hleqna !== '' ?
  item :
  binary_each(type, ls.slice(1)))
/* end if */;
}).apply(this, typeof arguments !== "undefined" ? arguments : []);
}), ["symbol", "def"](or, [[["symbol", "quote"], [[["symbol", "quote"], ["symbol", "splat"]], [["symbol", "quote"], ["symbol", "items"]]]]]), ["symbol", "def"](and, [[["symbol", "quote"], [[["symbol", "quote"], ["symbol", "splat"]], [["symbol", "quote"], ["symbol", "items"]]]]]);
}).apply(this, typeof arguments !== "undefined" ? arguments : []),
["symbol", "def"](js_type, [[["symbol", "quote"], ["symbol", "x"]]]),
["symbol", "def"](nth, [[["symbol", "quote"], ["symbol", "a"]], [["symbol", "quote"], ["symbol", "n"]]]),
["symbol", "def"](first, [[["symbol", "quote"], ["symbol", "a"]]]),
["symbol", "def"](second, [[["symbol", "quote"], ["symbol", "a"]]]),
["symbol", "def"](last, [[["symbol", "quote"], ["symbol", "a"]]]),
["symbol", "def"](concat, [[["symbol", "quote"], ["symbol", "base"]], [["symbol", "quote"], [[["symbol", "quote"], ["symbol", "splat"]], [["symbol", "quote"], ["symbol", "items"]]]]]),
["symbol", "def"](join, [[["symbol", "quote"], ["symbol", "a"]], [["symbol", "quote"], ["symbol", "s"]]]),
(function () {
  var underscore_methods, each, array_qmark_;
return underscore_methods = { "each" : null,
"map" : null,
"reduce" : [[["symbol", "quote"], ["symbol", "reduce"]], [["symbol", "quote"], ["symbol", "foldl"]]],
"reduceRight" : [[["symbol", "quote"], ["symbol", "reduce-right"]], [["symbol", "quote"], ["symbol", "foldr"]]],
"find" : null,
"filter" : null,
"reject" : null,
"all" : null,
"any" : null,
"include" : null,
"invoke" : null,
"pluck" : null,
"sortBy" : [[["symbol", "quote"], ["symbol", "sort-by"]]],
"groupBy" : [[["symbol", "quote"], ["symbol", "group-by"]]],
"sortedIndex" : [[["symbol", "quote"], ["symbol", "sorted-index"]]],
"suffle" : null,
"toArray" : [[["symbol", "quote"], ["symbol", "->array"]]],
"size" : null,
"first" : [[["symbol", "quote"], ["symbol", "first"]], [["symbol", "quote"], ["symbol", "head"]]],
"initial" : [[["symbol", "quote"], ["symbol", "initial"]], [["symbol", "quote"], ["symbol", "init"]]],
"last" : null,
"rest" : [[["symbol", "quote"], ["symbol", "rest"]], [["symbol", "quote"], ["symbol", "tail"]]],
"compact" : null,
"flatten" : null,
"without" : null,
"union" : null,
"intersection" : null,
"difference" : null,
"uniq" : null,
"zip" : null,
"indexOf" : [[["symbol", "quote"], ["symbol", "index-of"]]],
"lastIndexOf" : [[["symbol", "quote"], ["symbol", "last-index-of"]]],
"range" : null,
"bind" : null,
"bindAll" : [[["symbol", "quote"], ["symbol", "bind-all"]]],
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
"isEqual" : [[["symbol", "quote"], ["symbol", "equal?"]], [["symbol", "quote"], ["symbol", "="]]],
"isEmpty" : [[["symbol", "quote"], ["symbol", "empty?"]]],
"isElement" : [[["symbol", "quote"], ["symbol", "element?"]]],
"isArray" : [[["symbol", "quote"], ["symbol", "array?"]]],
"isArguments" : [[["symbol", "quote"], ["symbol", "arguments?"]]],
"isFunction" : [[["symbol", "quote"], ["symbol", "function?"]]],
"isNumber" : [[["symbol", "quote"], ["symbol", "number?"]]],
"isBoolean" : [[["symbol", "quote"], ["symbol", "boolean?"]], [["symbol", "quote"], ["symbol", "bool?"]]],
"isDate" : [[["symbol", "quote"], ["symbol", "date?"]]],
"isRegExp" : [[["symbol", "quote"], ["symbol", "regex?"]]],
"isNaN" : [[["symbol", "quote"], ["symbol", "nan?"]]],
"isNull" : [[["symbol", "quote"], ["symbol", "nil?"]]],
"isUndefined" : [[["symbol", "quote"], ["symbol", "undefined?"]]],
"identity" : null,
"times" : null,
"uniqueId" : [[["symbol", "quote"], ["symbol", "unique-id"]]],
"escape" : null,
"template" : null,
"chain" : null,
"value" : null }, each = _.each, array_qmark_ = _["isArray"], each(underscore_methods, (function (v, k) {
  var cond_16l4kevp2_3bpk0ga;
return /* if */ ((cond_16l4kevp2_3bpk0ga = array_qmark_(v)) !== false && cond_16l4kevp2_3bpk0ga !== null && cond_16l4kevp2_3bpk0ga !== '' ?
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