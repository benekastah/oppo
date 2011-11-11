
oppo.module "compiler.helpers", ->
  self = this
  
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

  self.identity = (x) -> x
    
  self.recursive_map = (ls, fn) ->
    ls.map (item, i, ls) ->
      if item instanceof Array
        self.recursive_map item, fn
      else
        fn item, i, ls

  self.recursive_walk = (ls, fn) ->
    for item, i in ls
      if item instanceof Array
        result = recursive_walk item, fn
      else
        result = fn item, i, ls
    
      return result if result?
    null
  
  self.gensym = do ->
    num = 0
    (name) ->
      "_#{name}_#{num++}"
      
  self.stringify =
    to_js: (x) ->
      if x instanceof Array
        contents = x.map self.stringify.to_js
        "[#{contents.join ', '}]"
      else
        "#{x}"
    to_oppo: (x) ->
      if x instanceof Array
        contents = x.map self.stringify.to_oppo
        "(#{contents.join ' '})"
      else
        "#{x}"
    
  self