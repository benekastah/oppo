###
NODE.JS / BROWSER INTEROP
###

module_name = "compile"

self = if exports?
  @oppo[module_name] = {}
else
  exports

require ?= (mod) -> @oppo.lib[mod.replace /^\.\//, '']
global ?= window

###
FILE BODY
###

{recursive_walk} = require './helpers'

self.compile = (program) ->
  