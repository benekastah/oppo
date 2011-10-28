parser = try (require './parser').parser
catch e then @parser

recurse = try (require './tco').parser
catch e then @recurse

g = try window
catch e then global


types = {}
    
types.List = parser.List

class types.Identifier
  constructor: (name, scope) ->
    @name = name
    @scope = scope
    @value = @scope[name]
  set: (val, scope=@scope) ->
    if (scope.hasOwnProperty @name) and typeof scope[@name] isnt 'undefined'
      @value = scope[@name] = val;
    else
      throw new Error "Can't redifine #{@name} in scope where it is undefined: #{scope}"
  def: (val, scope=@scope) ->
    if (scope.hasOwnProperty @name) and typeof scope[@name] isnt 'undefined'
      throw new Error "Can't define #{@name} in scope where it is already defined: #{scope}"
    else
      @value = scope[@name] = val
  @test: (s) ->
    typeof s is "string" and not (types.String.test s) and not (types.Number.test s) and /^[^\s]+$/.test s
    
# types.identifier = 
#   test: (s) ->
#     typeof s is "string" and not (types.String.test s) and not (types.Number.test s) and /^[^\s]+$/.test s
#   value: (scope, ident) -> scope[ident]
#   def: (scope, ident, val) ->
#     if (scope.hasOwnProperty ident) and typeof scope[ident] isnt 'undefined'
#       throw new Error "Can't define #{ident} in scope where it is already defined: #{scope}"
#     else
#       scope[ident] = val
#   "set!": (scope, ident, val) ->
#     if (scope.hasOwnProperty ident) and typeof scope[ident] isnt 'undefined'
#       scope[ident] = val;
#     else
#       throw new Error "Can't redifine #{ident} in scope where it is not defined: #{scope}"
    
class types.String
  constructor: (value) ->
    @value = value.replace(/^"/, '').replace(/"$/, '')
  toString: -> @value
  @test: (s) -> typeof s is "string" and /^"[^"]*"$/.test s
  
class types.Number
  constructor: (value) ->
    @value = +value
  valueOf: -> @value
  @test: (s) -> (typeof s is "string" and /^\d+$/.test s) or typeof s is "number"
  
class types.NamedArgsList extends types.List
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

RT.types = types

# Eval
RT["eval-js"] = g.eval
RT.eval = (scope, x) ->
  scope ?= if this is g then RT else this
  _0 = try x[0]
  
  if x is 'nil' or not x?
    null
  
  else if x is '#t'
    true
  
  else if x is '#f'
    false
  
  else if types.Identifier.test x
    new types.Identifier x, scope
    
  else if types.Number.test x
    new types.Number x
    
  else if types.String.test x
    new types.String x
  
  # else if RestParameter.test x
    # ???
    # ret = []
    # ret.rest = true
  
  else if _0 is 'quote'
    [__, exp] = x
    exp
    
  else if _0 is 'if'
    [__, test, case_t, case_f] = x
    if @eval scope, test
      @eval scope, case_t
    else
      @eval scope, case_f
      
  else if _0 is 'def'
    [__, ident, exp] = x
    (@eval RT, ident).def (@eval scope, exp)
    
  else if _0 is 'let'
    if types.Identifier.test x[1]
      [__, rname, bindings, exprs...] = x
      names = []
      values = []
      for item, i in bindings
        if i % 2 then values.push item
        else names.push item
      bindings.push rname, ['lambda', names, exprs...]
      @eval scope, ['let', bindings, ['apply', rname, ['quote', values]]]
    else
      [__, bindings, exprs...] = x
      done = false
      i = 0
      len = bindings.length
      newScope = getNewScope scope
      if bindings % 2 then throw new Error "You must have an even number of 'let' bindings."
      while i < len
        ident = @eval newScope, bindings[i++]
        expr = @eval newScope, bindings[i++]
        ident.def expr, newScope
      
      @eval newScope, ['do', exprs...]
      
  else if _0 is 'set!'
    [__, ident, exp] = x
    (@eval scope, ident).set (@eval scope, exp)
    
  else if _0 is 'defmacro'
    [__, ident, argNames, exp] = x
    argNames = new types.NamedArgsList argNames[0..]...
    ret = ->
      args = {}
      argNames.format arguments, args
      toEval = @eval scope, exp
      if toEval instanceof Array
        # Copy the exp array so we don't write over it
        recursive_walk toEval, (item, i, ls) =>
          if types.Identifier.test item
            if args.hasOwnProperty item
              ls[i] = args[item]
      else
        toEval = exp
        if (types.Itentifier.test toEval)
          if val = args[item]?
            toEval = item
      # @eval this, toEval
      toEval
    ret.is_macro = true
    
    (@eval scope, ident).def ret
    
  else if _0 is 'lambda'
    [__, argNames, exprs...] = x
    ret = ->
      newScope = getNewScope ret.scope
      argNames =  new types.NamedArgsList argNames[0..]...
      argNames.format arguments, newScope
      RT.eval newScope, ['do', exprs...]
    ret.toString = -> "(lambda #{exprs.join ' '})"
    ret.value = ret
    ret.arity = argNames.length
    ret.scope = scope
    ret
    
  else if _0 is 'do'
    for exp in x[1..]
      val = @eval scope, exp
    val
  
  else if _0 is '.'
    [__, base, keys...] = x
    o = (@eval this, base).value
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
    fn = @eval scope, fn
    if fn?.hasOwnProperty 'value'
      fn = fn.value
      
    if typeof fn isnt 'function'
      throw new Error "Tried to call non-callable: #{fn}"
      
    if fn.is_macro
      @eval scope, fn.apply scope, args
    else
      args = for exp in args
        val = @eval scope, exp
        val?.value or val
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
  @eval this, ['quote', items]

# Accessor methods
RT.head = RT.first = (ls) ->
  ls[0]
  
RT.second = (ls) ->
  ls[1]
  
RT.nth = (ls, n) ->
  if n < 0
    n = ls.length + n
  ls[n]
  
RT.last = (ls) ->
  ls[ls.length-1]

RT.tail = RT.rest = (ls) ->
  new parser.List items:ls.slice 1
  
RT.init = (ls) ->
  new parser.List items:ls.slice 0, ls.length-1

# Iteration and mutator methods
RT.each = (ls, fn) ->
  if Array.prototype.forEach?
    ls.forEach fn
  else
    for item, i in ls
      fn (@eval this, item), i, ls
    null

RT.map = (ls, fn) ->
  if Array.prototype.map?
    ls.map fn
  else
    ret = []
    RT.each (item, i, ls) ->
      ret.push fn arguments...
      
RT.reduce = (ls, fn) ->
  if Array.prototype.reduce?
    ls.reduce fn
  else
    start = ls.shift()
    RT.each ls, (item, i, ls) ->
      start = fn start, item, i, ls
    start
      
RT.concat = (args...) -> new types.List().concat args...

RT.count = (ls) -> ls.length


###
MATH
###
RT['+'] = (items...) ->
  RT.reduce items, (a, b) -> a + b

RT['-'] = (items...) ->
  RT.reduce items, (a, b) -> a - b
  
RT['*'] = (items...) ->
  RT.reduce items, (a, b) -> a * b
  
RT['**'] = Math.pow
  
RT['/'] = (items...) ->
  RT.reduce items, (a, b) -> a / b
  
RT['sqrt'] = (x) -> g.Math.sqrt x


###
COMPARISONS
###
compare = (test, prev, items...) ->
  for item in items
    if not test prev, item
      return false
    prev = item
  true

RT['>'] = RT.curry compare, (a, b) -> a > b

RT['<'] = RT.curry compare, (a, b) -> a < b
  
RT['>='] = RT.curry compare, (a, b) -> a >= b
  
RT['<='] = RT.curry compare, (a, b) -> a <= b

RT['='] = RT.curry compare, (a, b) -> a is b

RT['not='] = RT.curry compare, (a, b) -> a isnt b

RT.or = RT.curry compare, (a, b) -> not a or b

RT.and = RT.curry compare, (a, b) -> a and b

RT.not = (a) -> a is false or a is null


###
TYPE CHECKING
###
RT["string?"] = (x) -> typeof x is "string" or x instanceof types.String or x instanceof String
RT["list?"] = (x) -> x instanceof Array
RT["num?"] = (x) -> typeof x is "number" or x instanceof types.Number or x instanceof Number
RT["nil?"] = (x) -> not x?

  
###
MISC / INTEROP
###
RT.print = (items...) ->
  console.log items...

RT.repeat = (times, exprs...) ->
  doBlock = ['do', exprs...]
  for [1..times]
    @eval this, doBlock

RT.global = g

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

try module.exports = RT
catch e then g.Runtime = RT