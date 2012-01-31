modules = oppo.modules = {}

module_error = (msg) ->
  throw "Module-Error: #{msg}"

module_get_path = (name) ->
  if _.isString name
    name.split '/'
  else
    module_error "Not a valid module path: #{module}"
    
module_get = (name) ->
  path = module_get_path name
  value = modules
  for item in path
    value = value?[item]
    if not value?
      module_error "Undefined module: #{name}"
  value
  
module_set = (name, value) ->
  path = module_get_path name
  final_name = path.pop()
  mod = modules
  for item in path
    base = mod
    mod = base[item]
    if not mod?
      if base not instanceof Module
        mod = base[item] = {}
      else
        module_error "Module #{name} can't be set as a member of another module"
      
  final_value = mod[final_name]
  if final_value?
    console?.warn? "Redefining module #{name}"
  mod[final_name] = value

class Module
  constructor: (@name, @imports, @load) ->
    @result = {}
    
  require: (force=false) ->
    {requiring, required} = Module.statuses
    previous = (_.last Module.current) or {}
    Module.current.push this
    
    if force
      @status = null
      @result = {}
      
    if @status in [requiring, required]
      if @status is requiring
        console?.warn? "Circular dependency detected between #{@name} and #{previous.name}"
      return @result
      
    @status = requiring
    deps = @get_deps()
    @load.apply @result, deps
    @status = required
    Module.current.pop()
    @result
    
  get_deps: ->
    args = []
    for name in @imports
      mod = module_get name
      if mod instanceof Module
        imported = mod.require()
      else
        module_error "Cannot require non-module: #{item}"
      
      args.push imported
    args
    
  status: null
  @statuses:
    requiring: "REQUIRING"
    required: "REQUIRED"
  @current: []

oppo.module = (name, imports=[], fn) ->
  module_set name, new Module name, imports, fn
  null
  
oppo.module.require = (name, force) ->
  mod = module_get name
  mod?.require force
    