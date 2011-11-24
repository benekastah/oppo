class TailCall
  constructor: (@fn, @args) ->

tcloop = (fn, tc) ->
  fn.toc_sync = true;
  while tc instanceof TailCall
    tc = tc.fn tc.args...
  fn.toc_sync = false;
  ret = tc

recurse = (fn, args...) ->
  tc = new TailCall fn, args
  if not fn.toc_sync
    tcloop fn, tc
  else tc
  
try module.exports = recurse
catch e then oppo.recurse = recurse