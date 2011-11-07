###
NODE.JS / BROWSER INTEROP
###

module_name = "arithmetic"

self = if exports?
  @oppo[module_name] = {}
else
  exports

require ?= (mod) -> @oppo.lib[mod.replace /^\.\//, '']
global ?= window

###
FILE BODY
###

arithmetic_row = (nums, operator, base, operation) ->
  ret = ''
  order_matters = not base?
  for num in nums
    n = +num
    if n and operation
      if not base?
        base = n
      else
        base = operation base, n
    else
      if order_matters and base
        ret += "#{base} #{operator} "
        base = null
      ret += "thunk.resolveOne(#{num}) #{operator} "
  if ret and base
    "(#{ret} #{operator} #{base})"
  else if ret
    "(#{ret})"
  else
    "#{base}"

self["+"] = (nums...) -> 
  arithmetic_row nums, '+', 0, (a, b) -> a + b
  
self["-"] = (nums...) -> 
  arithmetic_row nums, '-', 0, (a, b) -> a - b
  
self["*"] = (nums...) -> 
  arithmetic_row nums, '*', 1, (a, b) -> a * b
  
self["/"] = (nums...) ->
  arithmetic_row nums, '/', null, (a, b) -> a / b
  
self["**"] = (a, b) ->
  if +a and +b
    "#{Math.pow a, b}"
  else
    "Math.pow(thunk.resolveOne(#{a}), thunk.resolveOne(#{b}))"
    

    