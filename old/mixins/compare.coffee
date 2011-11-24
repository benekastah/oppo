
types = try require '../types'
catch e then oppo.types

compare = ->
  RT = this
  
  {getValue, getAllValues} = ((try (require '../eval_helpers')
  catch e then oppo.eval_helpers) RT)

  ###
  COMPARISONS
  ###
  compare = (test, prev, items...) ->
    for item in items
      if not test prev, item
        return false
      prev = item
    true

  RT['>'] = RT.curry compare, (a, b) -> (getValue a) > (getValue b)

  RT['<'] = RT.curry compare, (a, b) -> (getValue a) < (getValue b)

  RT['>='] = RT.curry compare, (a, b) -> (getValue a) >= (getValue b)

  RT['<='] = RT.curry compare, (a, b) -> (getValue a) <= (getValue b)

  RT['='] = RT.curry compare, (a, b) -> (getValue a) is (getValue b)

  RT['not='] = RT.curry compare, (a, b) -> (getValue a) isnt (getValue b)

  RT.or = RT.curry compare, (a, b) -> not (getValue a) or (getValue b)

  RT.and = RT.curry compare, (a, b) -> (getValue a) and (getValue b)

  RT.not = (a) -> (a = getValue a) is false or a is null



  ###
  TYPE CHECKING
  ###
  RT["string?"] = (x) -> typeof (x = getValue x) is "string" or x instanceof String
  RT["list?"] = (x) -> (getValue x) instanceof Array
  RT["num?"] = (x) -> typeof (x = getValue x) is "number" or x instanceof Number
  RT["nil?"] = (x) -> not (getValue x)?
  RT["fn?"] = (x) -> typeof x is "function"
  RT["typeof"] = (x) ->
    if RT["string?"] x then "string"
    else if RT["list?"] x then "list"
    else if RT["num?"] x then "number"
    else if RT["nil?"] x then "nil"
    else if RT["fn?"] x then "function"
    else null
    
    
try module.exports = compare
catch e then oppo.mixins.compare = compare