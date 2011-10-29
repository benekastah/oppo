parser = try (require './parser').parser
catch e then @oppo.parser

recurse = try require './recurse'
catch e then @oppo.recurse

eval_helpers = try require './eval_helpers'
catch e then @oppo.eval_helpers

types = try require './types'
catch e then @oppo.types

mixins =
  compare: try require './mixins/compare'
  catch e then @oppo.mixins.compare
  functions: try require './mixins/functions'
  catch e then @oppo.mixins.functions
  lists: try require './mixins/lists'
  catch e then @oppo.mixins.lists
  math: try require './mixins/math'
  catch e then @oppo.mixins.math
  misc: try require './mixins/misc'
  catch e then @oppo.mixins.misc

g = try window
catch e then global

getValue = eval_helpers.getValue
getAllValues = eval_helpers.getAllValues

RT = {}
RT.global = g

# Eval
RT["eval-js"] = g.eval
RT.eval = (scope=RT, x) ->
  x = getValue x
  _0 = try x[0]
  
  has_side_affects = eval_helpers.has_side_affects x, RT
  
  ret = do =>
    if x is 'nil' or not x?
      null
    else if x is '#t'
      true
    else if x is '#f'
      false
    else if types.identifier.test x
      types.identifier.value scope, x
    else if types.number.test x
      types.number.value x
    else if types.string.test x
      types.string.value x
    else if _0 is 'quote'
      exp = x[1]
    else if _0 is 'if'
      eval_helpers.if scope, x
    else if _0 is 'def'
      eval_helpers.def scope, x, RT
    else if _0 is 'set!'
      eval_helpers.set scope, x, RT
    else if _0 is 'let'
      eval_helpers.let scope, x
    else if _0 is 'defmacro'
      eval_helpers.defmacro scope, x
    else if _0 in ['lambda', 'fn']
      eval_helpers.lambda scope, x
    else if _0 is 'do'
      eval_helpers.do scope, x
    else if _0 is '.'
      eval_helpers.property_access scope, x
    else
      eval_helpers.func_call scope, x, RT
  
  if has_side_affects
    getAllValues ret
  else
    ret

# Add environment functions
mixins.functions.call RT
mixins.compare.call RT
mixins.lists.call RT
mixins.math.call RT
mixins.misc.call RT

try require './runtime-oppo'

try module.exports = RT
catch e then @oppo.runtime = RT