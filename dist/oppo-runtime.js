(function () {
  var oppoString, code, result, oppo;

  if (typeof window === 'undefined')
    oppo = exports;
  else
    oppo = window.oppo;
    
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
    if (!(value != null)) {
      console.warn("Trying to get undefined module: " + name);
      ({});
    }
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
  var self, cond_16le0dvji_59s9fd0;
  with (self = this) {
    return (/* def self.global */ (typeof self.global === 'undefined' ?
  (self.global = /* if */ ((cond_16le0dvji_59s9fd0 = (typeof window !== 'undefined')) !== false && cond_16le0dvji_59s9fd0 !== null && cond_16le0dvji_59s9fd0 !== '' ?
  window :
  global)
/* end if */) :
  ((function () { throw "Can't define variable that is already defined: self.global" })()))
/* end def self.global */);
  }
}))
})();