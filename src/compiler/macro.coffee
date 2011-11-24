
oppo.module "compiler.macro", ["compiler", "compiler.helpers"], ({compile}, helpers) ->
  self = this
  
  macros = {}
  
  macro_replace = (argnames, args, item) ->
    index = argnames.indexOf item
    if index >= 0
      args[index]
    else
      item
  
  self.defmacro = (name, argnames, template) ->
    macros[compile name] = ->
      args = arguments
      arg_map = helpers.destructure_list argnames, "args"
      argnames = arg_map.map (item) -> item[0]
      args = arg_map.map (item) ->
        item1 = item[1]
        js = compile ["js-eval", item1]
        result = eval js
      
      if template instanceof Array
        replaced = helpers.recursive_map template, (item, i, ls, parent, parent_i) ->
          if helpers.is_splat item
            item = helpers.splat item
            splat = true
            
          result = macro_replace argnames, args, item
          if splat
            ["...", result]
          else
            result
            
        replaced = helpers.restructure_list replaced
      else
        replaced = macro_replace argnames, args, template
    # Let a macro definition return "null" for the compiler
    "null /* macro: #{name} */"
    
  self.is_macro
    
  self.call = (fn, s_exp) ->
    mc = macros[fn]
    if mc?
      compile mc s_exp...
    else
      throw new TypeError "\"#{fn}\" is not a macro"
    
  self.syntax_quote = helpers.identity
    
  self.macroexpand = (ls) -> # TODO
    
  self