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
        scope[item] = value
      else
        (scope[item] ?= {}).submodules ?= {}
        
    value
        
  _module_get = (name) ->
    scope = _module_list
    _module_list_traverse name, (item, i, last, ns) ->
      if not scope? then return false
      scope = if i is last
        scope = scope[item]
      else
        try scope[item]?.submodules
        
    scope
  
  _module = (name, deps, fn) ->
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
  
  _module.require = _require = (name, force) ->
    mod = _module_get name
    if not mod? then throw new ModuleNotFound name
    {fn, deps} = mod
    if force then mod.cache = null
    if mod.cache?
      return mod.cache
  
    _requiring[name] = yes
  
    args = for dep in deps
      throw new CircularDependency name, dep if _requiring[dep]
      _require dep
  
    context = { name: name }
    mod.cache = fn.apply context, args
    _requiring[name] = no
    
    mod.cache
    
  _module.require_group = _require_group = (name, recursive, force) ->
    {submodules} = _module_get name
    modules = _require name
    if submodules
      for own item of submodules
        new_name = "#{name}.#{item}"
        modules[item] = if recursive
          _require_group new_name, recursive, force
        else
          _require new_name, force

    modules
    
  _module.load = _load = (name) -> _require name, yes
  _module.load_group =  (name, r) -> _require_group name, r, yes
  
  _module "module", -> _module
  
  _module