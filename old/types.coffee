types = try exports
catch e then oppo.types = {}

RT = null
getRT = ->
  if RT?
    RT
  else
    try require './runtime'
    catch e then oppo.runtime

eval_helpers = null
getEvalHelpers = ->
  if eval_helpers?
    eval_helpers
  else
    eval_helpers = (try require './eval_helpers'
    catch e then oppo.eval_helpers) getRT()

class types.List extends Array
  constructor: (items...) ->
    if items then @push.apply @, items
  get: (i) -> @[i]
  toArray: -> @[0..]
  toString: ->
    "(#{(@join ' ').replace ") (", ")\n  ("})"









# Examples of TypedList
# [ '(1 2) '(#(inc a) #(dec b)) ]
# ; -> ['(1 2) '(2 1) '(3 0) ...]
# 
# [ '(1 5)
#   '(#(inc %1) #(dec %1))
#   '(#(< 5) #(> 0)) ]
# ; -> ['(1 5) '(2 4) '(3 3) '(4 2)]
# 
# [ 5 #(if (> %1 1) (dec %1)) ]
# ; -> [5 4 3 2]

class types.TypedList extends types.List
  constructor: (items) ->
    items = getEvalHelpers().getValue items
    last = items.length - 1
    for item, i in items
      item = getEvalHelpers().getValue item
      itemType =  getRT()["typeof"] item
      @type ?= itemType
      if i is last and itemType is "function" and @type isnt itemType
        @generator = item
      else if @type isnt itemType
        throw new Error "typed-list: Cannot contain item of type #{itemType} in a typed-list of type #{type}"
      else
        @push item
    if @length is 1 and (getRT()["typeof"] @[0]) is "function"
      @generator = @[0]
      @[0] = @generator null, 0, this
    if @generator then @generator.enabled = true

  get: (i) ->
    i = getEvalHelpers().getValue i
    val = @[i]
    if i < @length
      val
    else if @generator?.enabled
      j = @length
      while j <= i
        @push @generator (getRT().last this), j++, this
      val = getRT().last this
      if not val? and @type isnt "nil"
        @end()
    val
    
  getAll: ->
    i = 0
    until val is null
      val = get i++
    
  end: () ->
    @generator.enabled = false
  
  reduce: () ->
    getAll()
    this.reduce.apply this, arguments
  
  toString: ->
    "[ #{@join " "} ]"

class types.ProgramList extends types.List
  constructor: (config={}) ->
    {@parent, items} = config
    super items...

class types.NamedArgsList extends types.List
  constructor: () ->
    super arguments...
  format: (argsList, scope) ->
    args = new types.List
    for value, i in argsList
      name = @[i] or ''
      # value = getRT().eval scope, value
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

class types.Thunk
  constructor: (@scope, @toEval) ->
  call: ->
    @result ?= getRT().eval @scope, @toEval
    @result

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
  
types.string =
  test: (s) -> typeof s is "string" and /^"[^"]*"$/.test s
  value: (s) -> (s.replace /^"/, '').replace /"$/, ''
  
types.number =
  test: (s) -> (typeof s is "string" and /^\d+$/.test s) or typeof s is "number"
  value: (n) -> +n