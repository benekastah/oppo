
oppo.module "oppo.core", [
  "oppo"
  "oppo.helpers"
  "oppo.classes"
  "oppo.list"
  "oppo.string"
  "oppo.math"
  "global"
  "compiler"
  "underscore"
], (oppo, helpers, classes, list, string, math, global, {compile}, _) ->
  self = this
  
  {global_method_set, global_method_get, make_prototype_method} = helpers.get_runtime_builders self
  
  ## Some basic macros
  oppo_data = oppo.read '''
  (defmacro defn (fname args ...body)
    `(def fname
      (lambda args
        ...body)))
    
  (defmacro apply (fn ...args ls)
    `((. fn apply) fn (concat args ls)))
    
  (defmacro call (fn ...args)
    `(apply fn args))
    
  (defmacro do (...body)
    `(call (lambda () (...body))))
    
  (defmacro not= (...args)
    `(not (= ...args)))
    
  (defmacro not== (...args)
    `(not (== ...args)))
    
  (defmacro not=== (...args)
    `(not (=== ...args)))
  '''
  oppo.eval oppo_data
  
  ## Error handling
  global_method_set "throw", do ->
    toString = ->
      info = if @info? then "\n\n  Additional Info: #{@info.join(', ')}" else ""
      "#{@type}: #{@message}#{info}"
    (type, message, info...) ->
      throw {type, message, info, toString}
      
  global_method_set "def-error", (nm) ->
    (global_method_get "throw") "def-error", "Can't define variable that is already defined: #{nm}"
    
  global_method_set "set-error", (nm) ->
    (global_method_get "throw") "set-error", "Can't redefine variable that has not yet been defined: #{nm}"
    
  
  ## Console
  bind_method = (o, method) -> _.bind o[method], o
  global_method_set "print", bind_method console, "log"
  global_method_set "print-error", bind_method console, "error"
  global_method_set "print-warning", bind_method console, "warn"
  
  
  ## Types
  name = global_method_set "name", (x) -> x.name
  
  global_method_set "keyword", do ->
    keywords = {} 
    (word) ->
      keywords[word] ?= new classes.Keyword word
      
  global_method_set "js-map", ->
    if arguments.length % 2 isnt 0
      throw new TypeError "Can't make a js-map with an odd number of arguments"
    ret = {}
    for arg, i in arguments
      if i % 2 is 0
        if arg instanceof classes.Keyword
          arg = name arg
        else if (helpers.typeof arg) isnt string
          console.warn "Making js-map with non-string key #{arg} or type #{helpers.typeof arg}"
        key = arg
      else
        ret[key] = arg
      
  global_method_set "typeof", (x) ->
    if x is null
      "null"
    else if x not instanceof Object
      typeof x
    else
      x.constructor?.name ? (Object::toString.call x).match(/\s(\w+)/)[1]
      
    
  
  ## Lists
  global_method_set "concat", ->
    base = arguments[0]
    if _.isString base
      string.concat arguments...
    else
      list.concat arguments...
  
  ## Comparisons
  do ->
    make_compare_fn = (action) ->
      (val, args...) ->
        for arg in args
          if action val, arg
            val = arg
          else
            return no
        yes
  
    to_bool = global_method_set "->bool", (x) -> if x? then x isnt false else false
  
    global_method_set "or", ->
      _.reduce arguments, ((a, b) -> if (to_bool a) then a else b), null
    
    global_method_set "and", (first, rest...) ->
      _.reduce rest, ((a, b) -> if not (to_bool a) then a else b), first
    
    global_method_set "not", (x) -> not to_bool x
    
    global_method_set ["==", "like?"], make_compare_fn (a, b) -> `a == b`
    global_method_set ["===", "is?"], make_compare_fn (a, b) -> a is b
    global_method_set ["=", "eq?"], make_compare_fn (a, b) -> _.isEqual a, b
    
    global_method_set "<", make_compare_fn (a, b) -> a < b
    global_method_set ">", make_compare_fn (a, b) -> a > b
    global_method_set "<=", make_compare_fn (a, b) -> a <= b
    global_method_set ">=", make_compare_fn (a, b) -> a >= b
      
  
  ## Stuff from Underscore.js
  do (_) ->
    dasherize = string.dasherize
    method_name = (str) ->
      nm = dasherize str
      nm = nm.replace /^is\-(.*)/, "$1?"
    
    _list_proxy = (fn) ->
      (ls, args...) ->
        if _.isString ls
          # was_string = true
          ls = ls.split ''
          ls.toString = -> ls.join ''
        result = fn ls, args...
        # if was_string and _.isArray result
        #   result = result.join ''
        result
      
    ## Set forth the underscore methods.
    ## Methods on the same line are aliases to the same function.
    ## Entries that are commented out are entries that exist in underscore,
    ## but we're modifying the name, functionality or are leaving out.
    methods =
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
      
    list_methods = methods.collections.concat methods.arrays
    general_methods = methods.functions.concat methods.objects, methods.utility, methods.chaining
    
    console.log general_methods
      
    for method in list_methods
      global_method_set (method_name method), _list_proxy _[method]
    for method in general_methods
      global_method_set (method_name method), _[method]
    
    global_method_set "nil?", _.isNull
    global_method_set "nan?", _.isNaN
    global_method_set "curry", (fn, args...) -> _.bind fn, null, args
    global_method_set ["regexp?", "regex?"], _.isRegExp
    global_method_set "unique-id", _.uniqueId
    
    global_method_set ["reduce", "inject", "foldl"], ([start, ls...], fn) -> _.reduce ls, fn, start
    global_method_set ["reduce-right", "foldr"], ([start, ls...], fn) -> _.reduceRight ls, fn, start
    
    global_method_set "index", _.indexOf
    global_method_set "last-index", _.lastIndexOf
    
  self
  