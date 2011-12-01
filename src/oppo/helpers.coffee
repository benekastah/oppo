oppo.module "oppo.helpers", ["compiler"], ({compile}) ->
  self = this
  
  self.global_method_set = (names, fn) ->
    if names not instanceof Array
      names = [names]
    for nm in names
      nm = compile nm
      global[nm] = @[nm] = fn
    
  self.global_method_get = (nm) ->
    global[compile nm]
    
  self.make_prototype_method = (nm) ->
    (base, args...) -> base[nm] args...
  
  self.get_runtime_builders = (scope) ->
    {global_method_set, make_prototype_method} = self
    global_method_set = _.bind global_method_set, scope
    global_method_get = self.global_method_get
    make_prototype_method = _.bind make_prototype_method, scope
    {global_method_set, global_method_get, make_prototype_method}
    
  self.typeof = (x) ->
    if x is null
      "null"
    else if x not instanceof Object
      typeof x
    else
      x.constructor?.name ? (Object::toString.call x).match(/\s(\w+)/)[1]
      
  ## Set forth the underscore methods.
  ## Methods on the same line are aliases to the same function.
  ## Entries that are commented out are entries that exist in underscore,
  ## but we're modifying the name, functionality or are leaving out.
  self.underscore_methods =
    collections: [
      "each", # "forEach"
      "map"
      # "reduce", "inject", "foldl",
      # "reduceRight", "foldr"
      "find", "detect"
      "filter", "select"
      "all", "every"
      "any", "some"
      "include", "contains"
      "invoke"
      "pluck"
      # "max"
      # "min"
      "sortBy"
      "groupBy"
      "sortedIndex"
      "shuffle"
      "toArray"
      "size"
    ]
    arrays: [
      "first", "head"
      "initial"
      "last"
      "rest", "tail"
      "compact"
      "flatten"
      "without"
      "union"
      "intersection"
      "difference"
      "uniq", "unique"
      "zip"
      # "indexOf"
      # "lastIndexOf"
      # "range"
    ]
    functions: [
      # "bind"
      # "bindAll"
      "memoize"
      "delay"
      "defer"
      "throttle"
      "debounce"
      "once"
      "after"
      "wrap"
      "compose"
    ]
    objects: [
      "keys"
      "values"
      "functions", "methods"
      "extend"
      "defaults"
      "clone"
      "create" # our own function, added in module
      "tap"
      # "isEqual"
      "isEmpty"
      "isElement"
      "isArray"
      "isArguments"
      "isFunction"
      "isString"
      "isNumber"
      "isBoolean"
      "isDate"
      # "isRegExp"
      # "isNaN"
      # "isNull"
      "isUndefined"
    ]
    utility: [
      # "noConflict"
      "identity"
      "times"
      "mixin"
      # "uniqueId"
      "escape"
      "template"
    ]
    chaining: [
      # "chain"
      # "value"
    ]
    
  self