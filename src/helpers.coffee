###
NODE.JS / BROWSER INTEROP
###

module_name = "helpers"

self = if exports?
  @oppo[module_name] = {}
else
  exports

require ?= (mod) -> @oppo.lib[mod.replace /^\.\//, '']
global ?= window

###
FILE BODY
###

self.thunk = do ->
  class Thunk
    constructor: (@scope, @to_eval) ->
    eval: ->
      if not @evald
        @result = @scope.eval @scope, @to_eval
      else
        @result
  
  (scope, to_eval) -> new Thunk scope, to_eval
  
self.thunk.resolveOne = (x) ->
  while x instanceof types.Thunk
    x = x.eval()
  x
  
self.thunk.resolveMany = (x) ->
  x = self.thunk.resolveOne x
  if x instanceof Array
    x.scope.map x, (item) ->
      self.thunk.resolveMany item
  else x

self.recursive_walk = (ls, fn) ->
  for item, i in ls
    if item instanceof Array
      result = recursive_walk item, fn
    else
      result = fn item, i, ls
    
    return result if result?
  null