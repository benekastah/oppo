
oppo.module "compiler.macro", ["compiler", "compiler.helpers"], ({compile}, helpers) ->
  self = this
  
  self.macros = {}
  self.defmacro = -> (name, argnames, template...) ->
    self.macros[name] = ->
      helpers.recursive_map template, (item, i, ls) ->
        index = argnames.indexOf item
        if item >= 0
          arguments[index]
        else
          item
    
  self.macroexpand1 = (name, args, body...) ->
    
  self