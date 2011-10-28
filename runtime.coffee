parser = try (require './parser').parser
catch e then @parser

recurse = try (require './tco').parser
catch e then @recurse

g = try window
catch e then global


types = {}
    
types.List = parser.List

# class types.Identifier
#   constructor: (name, scope) ->
#     @name = name
#     @scope = scope
#     @value = @scope[name]
#   set: (val, scope=@scope) ->
#     if (scope.hasOwnProperty @name) and typeof scope[@name] isnt 'undefined'
#       @value = scope[@name] = val;
#     else
#       throw new Error "Can't redifine #{@name} in scope where it is undefined: #{scope}"
#   def: (val, scope=@scope) ->
#     if (scope.hasOwnProperty @name) and typeof scope[@name] isnt 'undefined'
#       throw new Error "Can't define #{@name} in scope where it is already defined: #{scope}"
#     else
#       @value = scope[@name] = val
#   @test: (s) ->
#     typeof s is "string" and not (types.String.test s) and not (types.Number.test s) and /^[^\s]+$/.test s
    
types.identifier = 
  test: (s) ->
    typeof s is "string" and not (types.string.test s) and not (types.number.test s) and /^[^\s]+$/.test s
  value: (scope, ident) -> scope[ident]
  def: (scope, ident, val) ->
    if (scope.hasOwnProperty ident) and typeof scope[ident] isnt 'undefined'
      throw new Error "Can't define #{ident} in scope where it is already defined: #{scope}"
    else
      scope[ident] = val
  "set!": (scope, ident, val) ->
    if (scope.hasOwnProperty ident) and typeof scope[ident] isnt 'undefined'
      scope[ident] = val;
    else
      throw new Error "Can't redifine #{ident} in scope where it is not defined: #{scope}"
    
# class types.String
#   constructor: (value) ->
#     @value = value.replace(/^"/, '').replace(/"$/, '')
#   toString: -> @value
#   @test: (s) -> typeof s is "string" and /^"[^"]*"$/.test s
  
types.string =
  test: (s) -> typeof s is "string" and /^"[^"]*"$/.test s
  value: (s) -> (s.replace /^"/, '').replace /"$/, ''
  
# class types.Number
#   constructor: (value) ->
#     @value = +value
#   valueOf: -> @value
#   @test: (s) -> (typeof s is "string" and /^\d+$/.test s) or typeof s is "number"
  
types.number =
  test: (s) -> (typeof s is "string" and /^\d+$/.test s) or typeof s is "number"
  value: (n) -> +n
  
class NamedArgsList extends types.List
  constructor: () ->
    super arguments...
  format: (argsList, scope) ->
    args = new types.List
    for value, i in argsList
      name = @[i] or ''
      # value = RT.eval scope, value
      if restArgs
        restArgs.push value
      else if (name.substr 0, 3) is @REST
        restArgs = new types.List
        restName = name.substr 3
        restIndex = i
        restArgs.push value
      else
        args.push value
        scope[name or @unnamedParam i] = value
    if restName
      args.push restArgs
      scope[restName or @unnamedParam restIndex] = restArgs
    args
  unnamedParam: (i) -> "%#{i+1}"
  REST: '...'
    
class DeferredEval
  constructor: (@scope, @toEval) ->
  call: ->
    @result ?= RT.eval @scope, @toEval
    @result
defer = (scope, toEval) -> new DeferredEval scope, toEval
getValue = (x) ->
  ret = x
  while ret instanceof DeferredEval
    ret = ret.call()
  ret
getValues = (x) ->
  RT.map x, (item) ->
    getValue item



g.Object.create ?= do ->
  class Noop
  (p) ->
    Noop:: = p
    new Noop()

recursive_walk = (ls, fn) ->
  for item, i in ls
    if item instanceof Array
      recursive_walk item, fn
    else
      fn item, i, ls
  null
  
getNewScope = (scope=RT) ->
  ret = Object.create scope
  ret



RT = Object.create g

RT.global = g

# Eval
RT["eval-js"] = g.eval
RT.eval = (scope=RT, x) ->
  x = getValue x
  _0 = try x[0]
  
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
    [__, exp] = x
    exp
    
  else if _0 is 'if'
    [__, test, case_t, case_f] = x
    if getValue @eval scope, test
      defer scope, case_t
    else
      defer scope, case_f
      
  else if _0 is 'def'
    [__, ident, exp] = x
    types.identifier.def RT, ident, defer scope, exp
    
  else if _0 is 'set!'
    [__, ident, exp] = x
    types.identifier["set!"] RT, ident, defer scope, exp
    
  else if _0 is 'let'
    if types.identifier.test x[1]
      [__, rname, bindings, exprs...] = x
      names = []
      values = []
      for item, i in bindings
        if i % 2 then values.push item
        else names.push item
      bindings.push rname, ['lambda', names, exprs...]
      defer scope, ['let', bindings, ['apply', rname, ['quote', values]]]
    else
      [__, bindings, exprs...] = x
      done = false
      i = 0
      len = bindings.length
      newScope = getNewScope scope
      if bindings % 2 then throw new Error "You must have an even number of 'let' bindings."
      while i < len
        ident = bindings[i++]
        expr = defer newScope, bindings[i++]
        types.identifier.def newScope, ident, expr
      
      defer newScope, ['do', exprs...]
    
  else if _0 is 'defmacro'
    [__, ident, argNames, exp] = x
    argNames = new NamedArgsList argNames[0..]...
    ret = ->
      args = {}
      argNames.format arguments, args
      toEval = getValue @eval scope, exp
      if toEval instanceof Array
        # Copy the exp array so we don't write over it
        recursive_walk toEval, (item, i, ls) =>
          if types.identifier.test item
            if args.hasOwnProperty item
              ls[i] = args[item]
      else
        toEval = exp
        if (types.Itentifier.test toEval)
          if val = args[item]?
            toEval = item
      toEval
    ret.is_macro = true
    
    types.identifier.def RT, ident, ret
    
  else if _0 is 'lambda'
    [__, argNames, exprs...] = x
    ret = ->
      newScope = getNewScope ret.scope
      argNames =  new NamedArgsList argNames[0..]...
      argNames.format arguments, newScope
      defer newScope, ['do', exprs...]
    ret.toString = -> "(lambda #{exprs.join ' '})"
    ret.value = ret
    ret.arity = argNames.length
    ret.scope = scope
    ret
    
  else if _0 is 'do'
    for exp in x[1..]
      val = getValue @eval scope, exp
    val
  
  else if _0 is '.'
    [__, base, keys...] = x
    o = getValue @eval scope, base
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
  
  else
    [fn, args...] = x
    fn = getValue @eval scope, fn
      
    if typeof fn isnt 'function'
      throw new Error "Tried to call non-callable: #{fn}"
      
    if fn.is_macro
      getValue @eval scope, fn.apply scope, args
    else
      for item, i in args
        args[i] = defer scope, item
      if fn is RT.eval
        args.unshift scope
      fn.apply scope, args




###
FUNCTIONS
###
RT.apply = (fn, args..., ls) ->
  ls.unshift args...
  lsCopy = ls[0..]
  fn lsCopy...

RT.curry = (fn, args...) ->
  fn.bind this, args...



###
LISTS
###
# Builder methods
RT.list = (items...) ->
  defer this, ['quote', items]

# Accessor methods
RT.head = RT.first = (ls) ->
  (getValue ls)[0]
  
RT.second = (ls) ->
  (getValue ls)[1]
  
RT.nth = (ls, n) ->
  ls = getValue ls
  if n < 0
    n = ls.length + n
  ls[n]
  
RT.last = (ls) ->
  ls = getValue ls
  ls[ls.length-1]

RT.tail = RT.rest = (ls) ->
  (getValue ls)[1..]
  
RT.init = (ls) ->
  (getValue ls).slice 0, -1

# Iteration and mutator methods
RT.each = (ls, fn) ->
  ls = getValue ls
  fn = getValue fn
  if Array.prototype.forEach?
    ls.forEach fn
  else
    for item, i in ls
      fn (@eval this, item), i, ls
    null

RT.map = (ls, fn) ->
  ls = getValue ls
  fn = getValue fn
  if Array.prototype.map?
    ls.map fn
  else
    ret = []
    RT.each ls, ->
      ret.push fn arguments...
      
RT.reduce = (ls, fn) ->
  ls = getValue ls
  fn = getValue fn
  if Array.prototype.reduce?
    ls.reduce fn
  else
    start = ls.shift()
    RT.each ls, (item, i, ls) ->
      start = fn start, item, i, ls
    start
      
RT.concat = (args...) ->
  args = getValues args
  new types.List().concat args...

RT.count = (ls) -> (getValue ls).length



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

  
  
###
MISC / INTEROP
###
RT.print = (items...) ->
  items = getValues items
  console.log items...

RT.repeat = (times, exprs...) ->
  exprs = getValues exprs
  doBlock = ['do', exprs...]
  for [1..(getValue times)]
    @eval this, doBlock



###
ENVIRONMENT MACROS
###

RT.eval null, parser.parse '''
(defmacro defn ($ident $arg-names ...$exprs)
  '(let (exprs (if (= (count '$exprs) 1)
                  (first '$exprs)
                  '$exprs))
    (def $ident (lambda $arg-names
      (eval exprs)))))
      
(defmacro debug (& to-eval)
  '(let (result (eval to-eval))
    (print result)
    result))
'''

evalProgram = (program) ->
  result = RT.eval RT, program
  getValue result

try module.exports = RT
catch e then g.Runtime = RT