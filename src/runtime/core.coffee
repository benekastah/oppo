(->
  
  sym = to_js_identifier
  
  isNaN = @[sym 'NaN?'] = (x) -> (to_type x) isnt "number" or x isnt x
  
  @[sym '+'] = ->
    num = 0
    if arguments.length < 2
      throw new Error "Can't add less than two numbers.,"
    
    for x in arguments
      num += x
      
    if isNaN num
      throw new TypeError("Can't add non-numbers.");
      
    num
    
  @[sym '-'] = ->
    num = null
    for x in arguments
      if num?
        num -= x
      else
        num = x
    
    if isNaN num
      throw new TypeError("Can't subtract non-numbers.")
      
    num
    
  @[sym '*'] = ->
    num = null
    for x in arguments
      if num?
        num *= x
  
).call oppo