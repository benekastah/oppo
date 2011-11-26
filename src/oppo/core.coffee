
oppo.module "oppo.core", [
  "oppo"
  "oppo.list"
  "oppo.string"
  "oppo.math"
  "global"
  "compiler"
], (oppo, list, string, math, global, {compile}) ->
  self = this
  
  global_method_set = (nm, fn) ->
    nm = compile nm
    global[nm] = self[nm] = fn
    
  global_method_get = (nm) ->
    global[compile nm]
  
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
  
  
  ## Types
  global_method_set "keyword", do ->
    keywords = {}
    
    class Keyword
      constructor: (@name) ->
      type: "keyword"
      
    (word) ->
      keywords[word] ?= new Keyword word
  
  ## Lists
  global_method_set "list", list.list
  global_method_set "typed-list", list.typed_list
  global_method_set "hash-map", list.hash_map
  global_method_set "concat", list.concat
  global_method_set "slice", list.slice
  global_method_set "nth", list.nth
  
  ## Strings
  global_method_set "uppercase", string.uppercase
  global_method_set "lowercase", string.lowercase
  
  ## Math
  global_method_set "+", math['+']
  global_method_set "-", math['-']
  global_method_set "*", math['*']
  global_method_set "**", math['**']
  global_method_set "/", math['/']
  global_method_set "%", math['%']
  
  
  ## Stuff from Underscore.js
  do (_) ->
    _ ?= try require 'underscore'
    if not _? and _.noConflict
      throw new Error "Underscore dependency not fulfilled."
    
    oppo.module "underscore", -> _
    _ = oppo.module.require "underscore"
    
    dasherize = string.dasherize
    
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
        "tap"
        "isEqual"
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
      
    for method in methods.collections.concat methods.arrays
      global_method_set (dasherize method), _list_proxy _[method]
    for method in methods.functions.concat methods.objects, methods.utility, methods.chaining
      global_method_set (dasherize method), _[method]
    
    global_method_set "is-nil", _.isNull
    global_method_set "is-nan", _.isNaN
    global_method_set "curry", (fn, args...) -> _.bind fn, null, args
    global_method_set "is-regexp", _.isRegExp
    global_method_set "unique-id", _.uniqueId
    
    global_method_set "reduce", ([start, ls...], fn) -> _.reduce ls, fn, start
    global_method_set "inject", global.reduce
    global_method_set "foldl", global.reduce
    global_method_set "reduce-right", ([start, ls...], fn) -> _.reduceRight ls, fn, start
    global_method_set "foldr", global['reduce-right']
    
    global_method_set "index", _.indexOf
    global_method_set "last-index", _.lastIndexOf
    
  self
  