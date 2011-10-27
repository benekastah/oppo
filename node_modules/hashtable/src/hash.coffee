getArray = (item) ->
  if item instanceof Array
    item
  else if item?
    [item]
  else
    []

# egal: see http://wiki.ecmascript.org/doku.php?id=harmony:egal
egal = (a, b) ->
  if a is b
    # 0 is not -0
    a isnt 0 or 1/a is 1/b
  else
    # NaN is NaN
    a isnt a and b isnt b

fileScope = this

class @QHash
  constructor: (entries = []) ->
    @storage = new QHash.Storage()
    argslen = arguments.length
    if entries instanceof Array and argslen is 1
      for entry in entries
        @set entry...
    else if argslen is 1
      for own key, value of entries
        @set key, value
    else if argslen is 2
      @set arguments...
  
  set: (key, value) ->
    if (index = @storage.indexOf key) >= 0
      @storage[index][1] = value;
    else
      @storage.push [key, value]
    value
    
  get: (key) ->
    @storage.valueAt @storage.indexOf key
  
  remove: (key) ->
    index = @storage.indexOf key
    if index >= 0
      ret = @storage.valueAt index
      @storage = (@storage.slice 0, index).concat @storage.slice index + 1
    else
      ret = false
    ret
  
  forEach: (callback) ->
    for item in @storage
      callback item...
  
  getStorage: -> @storage
  
  Object.defineProperty QHash::, 'length',
    get: -> @storage.length
    
  # Storage array, with some helper methods
  class @Storage extends Array
    constructor: (arr) ->
      if arr instanceof Array
        for item in arr
          @push[item] if item instanceof Array and 0 < item.length < 3

    indexOf: (key) ->
      for item, index in this
        [item_key] = getArray item
        return index if egal key, item_key
      -1

    valueAt: (index) ->
      [key, value] = getArray this[index]
      value

    keyAt: (index) ->
      [key] = getArray this[index]
      key
    
    sort: ->
      arr = for entry in this then entry
      arr.sort()
  
@Hash = class @HashTable
  constructor: (entries = []) ->
    if entries instanceof Array
      for entry in entries
        @set entry...
    else if entries instanceof Object
      for own key, value of entries
        @set key, value
    else if arguments.length
      @set arguments...
  
  set: (obj, value) ->
    @[HashTable.key obj] = value;
    
  get: (obj) ->
    @[HashTable.key obj]
  
  remove: (obj) ->
    ret = get obj
    delete @[HashTable.key obj]
    if ret? then ret else false
  
  @sortedObjectClone: (obj) ->
    if obj instanceof RegExp
      re = obj
      obj = "object-type": "RegExp", "object-value": re.toString()
    else if typeof obj is "function"
      fn = obj
      obj = "object-type": "Function", "object-value": fn.toString()
    else if obj instanceof Array
      arr = obj
      obj = {}
      for own key, value of arr
        obj[key] = value
    else if typeof obj is "number"
      num = obj
      if val is 0 and 1/val is -Infinity
        num = "-0"
      obj = "object-type": "number", "object-value": num.toString()
    else if obj not instanceof Object
      val = obj
      obj = "object-type": typeof val, "object-value": val.toString()

    clone = new fileScope.QHash obj
    clone.forEach (key, value) =>
      if value instanceof Object
        clone.set key, @sortedObjectClone value

    clone = clone.getStorage()
    clone.sort()

  @stringify: (obj) ->
    clone = @sortedObjectClone obj
    JSON.stringify clone
    
  @key: @stringify.bind this
    