oppo = {}

_module_list = {}

_module = (name, deps, fn) ->
  mod = _module_list[name]
  if mod?
    console.warn "Redefining module #{name}"
  
  if arguments.length is 2
    fn = deps
    deps = []
  
  _module_list[name] = {deps, fn}
  
_module.require = _require = (name, force) ->
  mod = _module_list[name]
  {fn, deps} = mod
  
  if force then mod.cache = null
  mod.cache ?= fn (_require dep for dep in deps)...
  
_module.load = _load = (name) ->
  _require name, true
  
_module "module", -> _module
_module "require", ["module"], (mod) -> mod.require
_module "load", ["module"], (mod) -> mod.load

###
EXPORT MODULE
###

oppo.module = _module