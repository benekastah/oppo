oppo = try exports
catch e
  @oppo = {}
  @oppo.mixins = {}
  @oppo

try oppo.runtime = require './runtime'
try oppo.parser = require './parser'

###
This is the access point for a program to the runtime
This will not only evaluate the code, but it will make
sure to resolve all thunks before delivering a response
###
try {getAllValues} = require './eval_helpers'
oppo.eval = (program) ->
  getAllValues ?= oppo.eval_helpers.getAllValues
  if typeof program is "string"
    program = oppo.parser.parse program
  result = oppo.runtime.eval null, program
  result = getAllValues result
  # result = try RT.last result
  # catch e then result