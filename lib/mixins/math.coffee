
math = ->
  RT = this
  
  {getValue, getAllValues} = try (require '../eval_helpers') RT
  catch e then @oppo.eval_helpers

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
catch e then @oppo.mixins.math = math