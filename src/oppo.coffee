global ?= window
exports ?= global.oppo = oppo

# Wrap the parser in a module
oppo.module "parser", -> parser ?= require './parser'

oppo.module "oppo", ["parser", "compiler"], (parser, compiler) ->
  self = this
  
  self.eval = (input) ->
    program = if typeof input is "string"
      self.read input
    else
      input
    eval compiler.compile program
    
  self.eval_program = (input) ->
    compiler.compile input, true
  
  self.read = (txt) ->
    parser.parse txt
  
  exports.eval = self.eval
  exports.read = self.read
  
  self
  
oppo.module.require "oppo"