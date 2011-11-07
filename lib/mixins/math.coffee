
types = try require '../types'
catch e then oppo.types

math = ->
  RT = this
  
  {getValue, getAllValues} = ((try (require '../eval_helpers')
  catch e then oppo.eval_helpers) RT)

  ###
  MATH
  ###
  RT['+'] = (items...) ->
    RT.reduce items, (a, b) -> (getValue a) + (getValue b)

  RT['-'] = (items...) ->
    RT.reduce items, (a, b) -> (getValue a) - (getValue b)

  RT['*'] = (items...) ->
    RT.reduce items, (a, b) -> (getValue a) * (getValue b)

  RT['**'] = (x) -> Math.pow getValue x

  RT['/'] = (items...) ->
    RT.reduce items, (a, b) -> (getValue a) / (getValue b)

  RT['sqrt'] = (x) -> Math.sqrt getValue x
  
try module.exports = math
catch e then oppo.mixins.math = math