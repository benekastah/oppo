###
NODE.JS / BROWSER INTEROP
###

module_name = "type-check"

self = if exports?
  @oppo[module_name] = {}
else
  exports

require ?= (mod) -> @oppo.lib[mod.replace /^\.\//, '']
global ?= window

###
FILE BODY
###

