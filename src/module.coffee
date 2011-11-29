
_ ?= require? "underscore"
if not _?
  throw new Error "Unmet dependency: underscore.js"
  
_.mixin
  create: do ->
    _create = Object.create ? (o) ->
      noop = ->
      noop:: = o
      new noop
    (o = null) ->
      _create o

global ?= window
oppo_global = _.create global
oppo = {}

oppo.module = do ->
  
  # Module errors
  class ModuleNotFound extends Error
    constructor: (module) ->
      @message = "Module #{module} not found"
    name: "ModuleNotFound"
    
  class CircularDependency extends Error
    constructor: (module_a, module_b) ->
      @message = "#{module_a} and #{module_b} are circular dependencies"
    name: "ModuleCircularDependency"
  
  _module_list = {}
  _requiring = {}
  _requiring_submodules = {}
  
  _module_list_traverse = (name, eachback) ->
    namespace = name.split '.'
    
    for item, i in namespace
      result = eachback item, i, namespace.length - 1, namespace
      if result is false
        break
  
  _module_set = (name, value) ->
    scope = _module_list
    _module_list_traverse name, (item, i, last, ns) ->
      scope = if i is last
        cur_value = scope[item]
        scope[item] = if cur_value
          cur_value[prop] = val for own prop, val of value
          cur_value
        else
          value
      else
        (scope[item] ?= {}).submodules ?= {}
        
    value
        
  _module_get = (name) ->
    scope = _module_list
    _module_list_traverse name, (item, i, last, ns) ->
      if not scope? then return false
      scope = if i is last
        scope[item]
      else
        scope?[item]?.submodules
        
    scope
  
  _module = (name, deps=[], fn) ->
    mod = _module_get name
    if mod?.fn?
      console.warn "Redefining module #{name}"
      console.trace()
    
    switch arguments.length
      when 1
        throw new Error "oppo.module requires at least two arguments"
      when 2
        fn = deps
        deps = []
    
    _module_set name, {deps, fn}
    _module
  
  _require_one = (name, force) ->
    mod = _module_get name
    if not mod? then throw new ModuleNotFound name
    {fn, deps} = mod
    
    if not fn
      console.warn "Module #{name} is not defined."
      return
    if not deps then deps = []
    
    if _requiring[name]
      throw new Error "Already requiring #{name}"
    
    if force then mod.cache = null
    if mod.cache?
      return mod.cache
  
    _requiring[name] = yes
  
    args = for dep in deps
      throw new CircularDependency name, dep if _requiring[dep]
      _require dep
    
    # Make our context
    context = _.create oppo_global
    context.name = name
    
    mod.cache = fn.apply context, args
    _requiring[name] = no
    
    mod.cache
    
  _module.require = _require = (name, force) ->
    {submodules} = (_module_get name) ? {}
    modules = _require_one name
    
    if submodules and not _requiring_submodules[name]
      _requiring_submodules[name] = true
      for own item of submodules
        new_name = "#{name}.#{item}"
        modules[item] = _require new_name, force
      _requiring_submodules[name] = false

    modules
    
  _module.load = _load = (name) -> _require name, yes
  
  _module "module", -> _module
  _module "require", -> _module.require
  _module "load", -> _module.load
  _module "global", -> oppo_global
  _module "underscore", -> _
  
  _module