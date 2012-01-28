(function () {
    var oppoString, code, result, oppo;

  if (typeof window === 'undefined')
    oppo = exports;
  else
    oppo = window.oppo;

  oppoString = '(def global (if (defined? window) window global))\n' +
'\n' +
'(if (undefined? (. global \'global))\n' +
'  (def (. global \'global) global)\n' +
'  (set! (. global \'global) global))\n' +
'\n' +
'(defmacro gdef (nm value)\n' +
'  `(def (. global (quote ~nm)) ~value))\n' +
'\n' +
'(defmacro defn (nm argslist ...body)\n' +
'  `(def ~nm (lambda ~argslist ...body)))\n' +
'  \n' +
'(defmacro gdefn (nm argslist ...body)\n' +
'  `(gdef ~nm (lambda ~argslist ...body)))\n' +
'\n' +
'; (defmacro defmodule (nm deps ...body)\n' +
';   (print :deps deps)\n' +
';   (let (ensure-deps (|| deps [])\n' +
';         -deps ((. - \'map) ensure-deps #(str (. %1 1))))\n' +
';     `((. oppo \'module) ~(. nm 1) \'~-deps #(do ...body))))\n' +
'\n' +
';; Logging / Printing\n' +
'(defmacro log (...things)\n' +
'  `((. console \'log) ...things))\n' +
'\n' +
'(defmacro print (item)\n' +
'  (let (x (gensym))\n' +
'    `(let (~x ~item)\n' +
'      (log ~x)\n' +
'      ~x)))\n' +
'\n' +
';; Misc macros and functions\n' +
'(defmacro eval (sexp)\n' +
'  `((. oppo \'eval) ~sexp))\n' +
'  \n' +
'(defmacro read (s)\n' +
'  `((. oppo \'read) ~s))\n' +
'\n' +
'(defmacro log (...things)\n' +
'  `((. console \'log) ...things))\n' +
'\n' +
';; Global definitions\n' +
'(def ->bool (. - \'identity))\n' +
'\n' +
'(gdefn println (...things)\n' +
'  (apply (. console \'log) things))\n' +
'\n' +
';; Type conversion\n' +
'(gdefn ->bool (x)\n' +
'  (js-eval "!(x == null || x === false || x === \\"\\" || x !== x)"))\n' +
'\n' +
'(gdefn ->num (n)\n' +
'  ((. global :Number) n))\n' +
'\n' +
'(gdefn ->str (s)\n' +
'  (str s))\n' +
'\n' +
';; Binary functions\n' +
'(gdefn not (x)\n' +
'  (let (bx (->bool x))\n' +
'    (js-eval "!bx")))\n' +
'\n' +
'(let (binary-each\n' +
'        (lambda (type ls)\n' +
'          (let (item (nth ls 1))\n' +
'            (if (|| (&& (=== type :or) (->bool item))\n' +
'                    (&& (=== type :and) (not item))\n' +
'                    (=== (. ls \'length) 0))\n' +
'              item\n' +
'              (binary-each type ((. ls \'slice) 1))))))\n' +
'                \n' +
'  (gdefn or (...items)\n' +
'    (binary-each :or items))\n' +
'    \n' +
'  (gdefn and (...items)\n' +
'    (binary-each :and items)))\n' +
'\n' +
'(gdefn js-type (x)\n' +
'  (let (cls ((. Object :prototype :toString :call) x)\n' +
'        type-arr ((. cls \'match) #/\\s([a-zA-Z]+)/)\n' +
'        type (. type-arr 1))\n' +
'    ((. type \'toLowerCase))))\n' +
'\n' +
';(defmacro .. (...items)\n' +
';  (if (= 2 (size items))\n' +
';    ))\n' +
'\n' +
';; Collections    \n' +
'(gdefn nth (a n)\n' +
'  (if (=== n 0)\n' +
'    (throw "nth treats collections as one-based; cannot get zeroth item"))\n' +
'  (let (i (if (< n 0)\n' +
'            (+ (. a \'length) n)\n' +
'            (- n 1)))\n' +
'    (. a i)))\n' +
'  \n' +
'(gdefn first (a) (nth a 1))\n' +
'  \n' +
'(gdefn second (a) (nth a 2))\n' +
'  \n' +
'(gdefn last (a) (nth a -1))\n' +
'\n' +
'(gdefn concat (base ...items)\n' +
'  (apply (. base \'concat) ...items))\n' +
'  \n' +
'(gdefn join (a s)\n' +
'  ((. a \'join) s))\n' +
'  \n' +
';(defmacro slice ())\n' +
'\n' +
';; Lists\n' +
'\n' +
';; Strings\n' +
'(defmacro replace (base ...items)\n' +
'  `((. ~base \'replace) ...items))\n' +
'  \n' +
'(defmacro remove (base pattern)\n' +
'  `(replace base pattern ""))\n' +
'  \n' +
'(defmacro match (base pattern)\n' +
'  `((. ~base \'match) pattern))\n' +
'\n' +
';; Regex\n' +
'(defmacro re-match ())\n' +
'\n' +
';; Math\n' +
'(gdefn + (...nums)\n' +
'  ())\n' +
'\n' +
';; Set up underscore\n' +
'; (let (_fn (fn (source-name target-names)\n' +
';             (let (targets (if (> (. target-names \'length) 0) target-names [source-name]))\n' +
';               ((. - \'each)  targets\n' +
';                             (fn (nm)\n' +
';                               (def (. global nm) (. - source-name))))))\n' +
';       _fns (fn (name-map)\n' +
';             (apply (. - \'each) name-map _fn)))\n' +
';   \n' +
';   (_fns { ;; Collections\n' +
';           :each []\n' +
';           :map []\n' +
';           :reduce [\'reduce \'foldl]\n' +
';           :reduceRight [\'reduce-right \'foldr]\n' +
';           :find []\n' +
';           :filter []\n' +
';           :reject []\n' +
';           :all []\n' +
';           :any []\n' +
';           :include []\n' +
';           :invoke []\n' +
';           :pluck []\n' +
';           ; :max []\n' +
';           ; :min []\n' +
';           :sortBy [\'sort-by]\n' +
';           :groupBy [\'group-by]\n' +
';           :sortedIndex [\'sorted-index]\n' +
';           :suffle []\n' +
';           :toArray [\'->array]\n' +
';           :size []\n' +
';           \n' +
';           ;; Arrays\n' +
';           :first [\'first \'head]\n' +
';           :initial [\'initial \'init]\n' +
';           :last []\n' +
';           :rest [\'rest \'tail]\n' +
';           :compact []\n' +
';           :flatten []\n' +
';           :without []\n' +
';           :union []\n' +
';           :intersection []\n' +
';           :difference []\n' +
';           :uniq []\n' +
';           :zip []\n' +
';           :indexOf [\'index-of]\n' +
';           :lastIndexOf [\'last-index-of]\n' +
';           :range []\n' +
';           \n' +
';           ;; Functions\n' +
';           :bind []\n' +
';           :bindAll [\'bind-all]\n' +
';           :memoize []\n' +
';           :delay []\n' +
';           :defer []\n' +
';           :throttle []\n' +
';           :debounce []\n' +
';           :once []\n' +
';           :after []\n' +
';           :wrap []\n' +
';           :compose []\n' +
';           \n' +
';           ;; Objects\n' +
';           :keys []\n' +
';           :values []\n' +
';           :functions []\n' +
';           :extend []\n' +
';           :defaults []\n' +
';           :clone []\n' +
';           :tap []\n' +
';           :isEqual [\'equal? \'=]\n' +
';           :isEmpty [\'empty?]\n' +
';           :isElement [\'element?]\n' +
';           :isArray [\'array?]\n' +
';           :isArguments [\'arguments?]\n' +
';           :isFunction [\'function?]\n' +
';           :isNumber [\'number?]\n' +
';           :isBoolean [\'boolean? \'bool?]\n' +
';           :isDate [\'date?]\n' +
';           :isRegExp [\'regex?]\n' +
';           :isNaN [\'nan?]\n' +
';           :isNull [\'nil?]\n' +
';           :isUndefined [\'undefined?]\n' +
';           \n' +
';           ;; Utility\n' +
';           ; :noConflict []\n' +
';           :identity []\n' +
';           :times []\n' +
';           :uniqueId [\'unique-id]\n' +
';           :escape []\n' +
';           :template []\n' +
';           \n' +
';           ;; Chaining\n' +
';           :chain []\n' +
';           :value []}))\n';
  code = oppo.read(oppoString);
  result = oppo.compile(code);
  eval(result);
  var Module, module_error, module_get, module_get_path, module_set, modules;

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

  Module.prototype.get_deps = (function() {
    var use;
    use = function(obj, props) {
      var args, item, _i, _len;
      args = [];
      props = [].concat(props);
      for (_i = 0, _len = props.length; _i < _len; _i++) {
        item = props[_i];
        if (_.isArray(item)) {
          if (item[1] !== "use") {
            module_error("Bad :use syntax: expected keyword :use, got :" + item[1]);
          }
          args = args.concat(use(obj[item[0]](item[2])));
        } else if (_.isString(item)) {
          args.push(obj[item]);
        } else {
          module_error("Bad :use syntax: " + item + " should be string");
        }
      }
      return args;
    };
    return function() {
      var action, arg, args, imported, item, mod, name, _i, _len, _ref;
      args = [];
      _ref = this.imports;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (_.isArray(item)) {
          name = item[0], action = item[1], arg = item[2];
        } else {
          name = item;
          action = arg = null;
        }
        mod = module_get(name);
        if (mod instanceof Module) {
          imported = mod.require();
        } else {
          module_error("Cannot require non-module: " + item);
        }
        if (action === "use") {
          args.push.apply(args, use(imported, arg));
        } else {
          args.push(imported);
        }
      }
      return args;
    };
  })();

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

})();