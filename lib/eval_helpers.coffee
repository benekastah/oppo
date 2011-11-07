
eval = null
eval_helpers = (RT) ->
  
  return eval if eval?
  
  # Object to return
  eval = {}

  types = try require './types'
  catch e then oppo.types

  ###
  DEALING WITH THUNKS
  ###
  thunk = eval.thunk = (scope, toEval) -> new types.Thunk scope, toEval

  getValue = eval.getValue = (x) ->
    ret = x
    while ret instanceof types.Thunk
      ret = ret.call()
    ret
  
  getAllValues = eval.getAllValues = (x) ->
    x = getValue x
    if x instanceof Array
      RT.map x, (item) ->
        getAllValues item
    else x

  recursive_walk = eval.recursive_walk = (ls, fn) ->
    for item, i in ls
      if item instanceof Array
        result = recursive_walk item, fn
      else
        result = fn item, i, ls
      
      if result?
        return result
    null

  Object.create ?= do ->
    class Noop
    (p) ->
      Noop:: = p
      new Noop()

  eval.get_new_scope = (scope=RT) ->
    ret = Object.create scope
    ret

  eval.has_side_affects = (x, RT) ->
    if x instanceof Array
      ret = recursive_walk x, (item, i) ->
        if i is 0 and item in ['def', 'defn'] or RT.last(item) is "!"
          return true
    ret or false

  eval.if = (scope, x) ->
    [__, test, case_t, case_f] = x
    if getValue scope.eval scope, test
      thunk scope, case_t
    else
      thunk scope, case_f
    
  eval.def = (scope, x, RT) ->
    [__, ident, exp] = x
    types.identifier.def RT, ident, (scope.eval scope, exp)
  
  eval.set = (scope, x, RT) ->
    [__, ident, exp] = x
    types.identifier["set!"] RT, ident, (scope.eval scope, exp)
  
  eval.let = (scope, x) ->  
    new_scope = eval.get_new_scope scope
    if types.identifier.test x[1]
      [__, rname, bindings, exprs...] = x
      names = []
      values = []
      for item, i in bindings
        if i % 2 then values.push item
        else names.push item
      bindings.push rname, ['lambda', names, exprs...]
      thunk new_scope, ['let', bindings, ['apply', rname, ['quote', values]]]
    else
      [__, bindings, exprs...] = x
      done = false
      i = 0
      len = bindings.length
      if bindings % 2 then throw new Error "You must have an even number of 'let' bindings."
      while i < len
        ident = bindings[i++]
        expr = thunk new_scope, bindings[i++]
        types.identifier.def new_scope, ident, expr
  
      thunk new_scope, ['do', exprs...]
    
  eval.defmacro = (scope, x) ->
    [__, ident, argNames, exp] = x
    argNames = new types.NamedArgsList argNames[0..]...
    ret = ->
      args = {}
      argNames.format arguments, args
      # Get the list we are processing
      toEval = getValue scope.eval scope, exp
      # toEval = exp
      if toEval instanceof Array
        # Copy the exp array so we don't write over it
        recursive_walk toEval, (item, i, ls) =>
          if types.identifier.test item
            if args.hasOwnProperty item
              ls[i] = args[item]
              null
      else
        toEval = exp
        if (types.Itentifier.test toEval)
          if val = args[item]?
            toEval = item
      # Evaluate result
      scope.eval scope, toEval
    ret.is_macro = true

    types.identifier.def RT, ident, ret
  
  eval.lambda = (scope, x) ->
    [__, argNames, exprs...] = x
    ret = ->
      newScope = eval.get_new_scope ret.scope
      argNames =  new types.NamedArgsList argNames[0..]...
      argNames.format arguments, newScope
      thunk newScope, ['do', exprs...]
    ret.toString = -> "(lambda #{exprs.join ' '})"
    ret.value = ret
    ret.arity = argNames.length
    ret.scope = scope
    ret
  
  eval.do = (scope, x) ->
    for exp in x[1..]
      thunk scope, exp
    
  eval.property_access = (scope, x) ->
    [__, base, keys...] = x
    o = getValue scope.eval scope, base
    for key in keys
      if o?
        prev = o
        o = o[key]
      else
        return null
    if typeof o is 'function'
      o = o.bind prev
    else
      o
    
  eval.func_call = (scope, x, RT) ->
    [fn_name, args...] = x
  
    if typeof (getValue fn_name) isnt 'function'
      fn = getValue scope.eval scope, fn_name
  
    if typeof fn isnt 'function'
      throw new Error "Tried to call non-callable: #{fn_name} = #{fn}"
  
    if fn.is_macro
      getValue fn.apply scope, args
    else
      for item, i in args
        # if 
        args[i] = thunk scope, item
      if fn is scope.eval
        args.unshift scope
      fn.apply scope, args
  
  eval
    
try module.exports = eval_helpers
catch e then oppo.eval_helpers = eval_helpers