
types = try require '../types'
catch e then oppo.types

misc = ->
  RT = this
  
  {getValue, getAllValues} = ((try (require '../eval_helpers')
  catch e then oppo.eval_helpers) RT)

  ###
  MISC / INTEROP
  ###
  # RT.print = (items...) ->
  #   items = getAllValues items
  #   console.log items...

  RT.repeat = (times, exprs...) ->
    exprs = getAllValues exprs
    doBlock = ['do', exprs...]
    for [1..(getValue times)]
      @eval this, doBlock
      

try module.exports = misc
catch e then oppo.mixins.misc = misc