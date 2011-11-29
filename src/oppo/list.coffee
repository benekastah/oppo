
oppo.module "oppo.list", ["oppo", "oppo.helpers", "oppo.classes", "compiler"], (oppo, helpers, classes, {compile}) ->
  self = this
  
  {global_method_set, make_prototype_method} = helpers.get_runtime_builders self
  
  global_method_set ["list", "->list"], (items...) -> items
  global_method_set "join", (ls, joiner = '') -> ls.join joiner
  
  # constructors
  global_method_set "typed-list", (items...) ->
    new classes.TypedList items...

  global_method_set "hash-map", (items) ->
    items.type = hash_map
    if items.length % 2 > 0
      throw new TypeError "Can't make a hash-map with an odd number of arguments"
      
  # methods
  self.concat = ->
    a = []
    a.concat.apply a, arguments
    
  global_method_set "slice", (ls, start, end) ->
    ls.slice start, end
    
  self.max = (ls) -> Math.max ls...
  self.min = (ls) -> Math.min ls...
    
  global_method_set "nth", (ls, i) ->
    if i is 0
      console.warn "Warning: Use nth0 for 0-based access to lists."
      return null
    
    if i < 0
      i = ls.length + i
    else
      # use a 1-based index
      i -= 1
      
    ls[i]
    
  global_method_set "second", (ls) -> ls[1]
    
  self.nth0 = (ls, i) ->
    if i < 0
      i = ls.length + i
    ls[i]
      
  self