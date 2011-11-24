
oppo.module "x_compiler.arithmetic", ["compiler"], (compiler) ->
  self = this
  
  arithmetic_row = (nums, base, operation) ->
    ret = ''
    order_matters = not base?
    
    operator = nums.shift()
    
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
        ret += "thunk.resolve_one(#{num}) #{operator} "
    if ret and base
      "(#{ret} #{operator} #{base})"
    else if ret
      "(#{ret})"
    else
      "#{base}"

  compiler.register '+', 'function', ((_, _0) -> _0 is '+'), (nums) -> 
    arithmetic_row nums, 0, (a, b) -> a + b
  
  compiler.register '-', 'function', ((_, _0) -> _0 is '-'), (nums) -> 
    arithmetic_row nums, 0, (a, b) -> a - b
  
  compiler.register '*', 'function', ((_, _0) -> _0 is '*'), (nums) -> 
    arithmetic_row nums, 1, (a, b) -> a * b
  
  compiler.register '/', 'function', ((_, _0) -> _0 is '/'), (nums) ->
    arithmetic_row nums, null, (a, b) -> a / b
  
  compiler.register '**', 'function', ((_, _0) -> _0 is '**'), ([_, a, b]) ->
    if +a and +b
      "#{Math.pow a, b}"
    else
      "Math.pow(thunk.resolve_one(#{a}), thunk.resolve_one(#{b}))"
      
  self
    

    