
types = try require '../types'
catch e then oppo.types

lists = ->
  RT = this
  
  {getValue, getAllValues} = ((try (require '../eval_helpers')
  catch e then oppo.eval_helpers) RT)
  
  ###
  LISTS
  ###
  # Builder methods
  RT.list = (items...) ->
    @eval this, ['quote', items]

  RT["typed-list"] = (items...) ->
    new types.TypedList items

  # Accessor methods
  RT.head = RT.first = (ls) ->
    ls = getValue ls
    if ls instanceof types.TypedList
      ls.get 0
    else
      ls[0]
  
  RT.second = (ls) ->
    ls = getValue ls
    if ls instanceof types.TypedList
      ls.get 1
    else
      ls[1]
  
  RT.nth = (ls, n) ->
    ls = getValue ls
    if n < 0
      n = ls.length + n
    
    if ls instanceof types.TypedList
      ls.get n
    else
      ls[n]
  
  RT.last = (ls) ->
    ls = getValue ls
    ls[ls.length-1]

  RT.tail = RT.rest = (ls) ->
    (getValue ls)[1..]
  
  RT.init = (ls) ->
    (getValue ls).slice 0, -1

  # Iteration and mutator methods
  RT.each = (ls, fn) ->
    ls = getValue ls
    fn = getValue fn
    if Array.prototype.forEach?
      ls.forEach fn
    else
      i = -1
      len = ls.length
      while ++i < len
        if ls instanceof types.TypedList
          item = ls.get i
          len = ls.length
        else
          item = ls[i]
        
        result = fn (@eval this, item), i, ls
        if result?
          return result

  RT.map = (ls, fn) ->
    ls = getValue ls
    fn = getValue fn
    if Array.prototype.map?
      ls.map fn
    else
      ret = []
      RT.each ls, ->
        ret.push fn arguments...
      
  RT.reduce = (ls, fn) ->
    ls = getAllValues ls
    fn = getValue fn
    if ls.reduce?
      ls.reduce fn
    else
      start = ls.shift()
      RT.each ls, (item, i, ls) ->
        start = fn start, item, i, ls
      start
      
  RT.concat = (args...) ->
    args = getAllValues args
    new types.List().concat args...

  RT.count = (ls) -> (getValue ls).length

  RT.end = (ls) -> 
    ls = getValue ls
    if ls not instanceof types.TypedList
      throw new Error "Tried to terminate a #{RT['typeof'] ls} value. This only works with typed-lists"
    else
      ls.end()
      
  # RT.range = RT["r.."] = (start, end) ->
  #   end ?= Infinity
  #   RT['typed-list'] 
  
  ###
  pluck = (a, i) ->
    a[...i].concat a[(i + 1)..]

  insert = (a, i, item) ->
    a[...i].concat item, a[i..]

  move = (a, old_i, new_i) ->
    val = a[old_i]
    a = pluck a, old_i
    a = insert a, new_i, val
  ###
      
try module.exports = lists
catch e then oppo.mixins.lists = lists