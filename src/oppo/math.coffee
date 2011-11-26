oppo.module "oppo.math", ["oppo", "compiler"], (oppo, {compile, helpers}) ->
  self = this
  
  self.to_num = (x) -> Number x
  
  ## Operators
  self['+'] = ->
    _.reduce arguments, ((a, b) -> a + b), 0
    
  self['-'] = (start, nums...) ->
    _.reduce nums, ((a, b) -> a - b), start
    
  self['/'] = (start, nums...) ->
    _.reduce nums, ((a, b) -> a / b), start
    
  self['*'] = ->
    _.reduce arguments, ((a, b) -> a * b), 1
    
  self.mod = self['%'] = (a, b) -> a % b
    
  ## Math object
  self.pow = self['**'] = Math.pow
    
  do ->
    properties = [
    # Properties
      "E"
      "LN2"
      "LN10"
      "LOG2E"
      "LOG10E"
      "PI"
      # "SQRT1_2"
      "SQRT2"
      
    # Methods
      "abs"
      "acos"
      "asin"
      "atan"
      "atan2"
      "ceil"
      "cos"
      "exp"
      "floor"
      "log"
      "max"
      "min"
      "pow"
      # "random"
      "round"
      "sin"
      "sqrt"
      "tan"
    ]
    
    for prop in properties
      self[prop] = Math[prop]
    
    self['SQRT1/2'] = Math.SQRT1_2
  
    self.rand = self.random = (min=0, max=1, dec_places) ->
      top = max - min
      num = (Math.random() * top) + min
      if dec_places?
        dec_places = Math.min dec_places + 1, 21
        Number num.toPrecision dec_places
      else
        num
      
    self['**'] = self.pow
    
  self