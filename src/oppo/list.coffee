
oppo.module "oppo.list", ["oppo", "compiler"], (oppo, {compile, helpers}) ->
  self = this
  
  self.list = (items...) -> items
  
  # constructors
  self.typed_list = (items) ->
    items.type = typed_list

  self.hash_map = (items) ->
    items.type = hash_map
    if items.length % 2 > 0
      throw new TypeError "Can't make a hash-map with an odd number of arguments"
      
  # methods
  self.concat = (ls, items) ->
    ls.concat.apply ls, items
    
  self.slice = (ls, start, end) ->
    ls.slice start, end
    
  self.max = (ls) -> Math.max ls...
  self.min = (ls) -> Math.min ls...
    
  self.nth = (ls, i) ->
    if i is 0
      console.warn "Warning: Use nth0 for 0-based access to lists."
      return null
    
    if i < 0
      i = ls.length + i
    else
      # use a 1-based index
      i -= 1
      
    ls[i]
    
  self.second = (ls) -> ls[1]
    
  self.nth0 = (ls, i) ->
    if i < 0
      i = ls.length + i
    ls[i]
      
  self