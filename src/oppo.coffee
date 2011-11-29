global.oppo = oppo


# Wrap the parser in a module
oppo.module "parser", -> parser ?= require './parser'

oppo.module "oppo", ["parser", "compiler", "underscore"], (parser, compiler, _) ->
  oppo.compile = _.bind compiler.compile, compiler
  
  oppo.eval = (oppo_data) ->
    js = oppo.compile oppo_data
    eval js
  
  oppo.read = (oppo_txt) ->
    parser.parse oppo_txt
  
  oppo
  
result = oppo.module.require "oppo"
if module?.exports?
  module.exports = result