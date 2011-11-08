
oppo.module "helpers", ->
  self = {}
  
  self.thunk = do ->
    class Thunk
      constructor: (@scope, @to_eval) ->
      eval: ->
        if not @evald
          @evald = true
          @result = @scope.eval @scope, @to_eval
        else
          @result
    
    # This is a nicer interface than `new Thunk`
    ret = (scope, to_eval) -> new Thunk scope, to_eval
    ret.Thunk = Thunk
  
  self.thunk.resolve_one = (x) ->
    while x instanceof thunk.Thunk
      x = x.eval()
    x
  
  self.thunk.resolve_many = (x) ->
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
    
  self