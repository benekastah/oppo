global ?= window
exports ?= global.oppo = oppo

# Wrap the parser in a module
oppo.module "parser", -> parser ?= require './parser'

oppo.module "oppo", ["parser", "compiler"], (parser, compiler) ->
  self = {}
  
  self.eval = compiler.compile
  
  self.parse = (txt) ->
    program = parser.parse txt
    self.eval program
  
  exports.eval = self.eval
  exports.parse = self.parse
  
  self
  
oppo.module.require "oppo"