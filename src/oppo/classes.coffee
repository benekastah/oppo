  
oppo.module "oppo.classes", ->
  self = this

  class Keyword
    constructor: (@name) ->
    toString: -> ":#{@name}"
    
  class TypedList
    constructor: ->
      @type = helpers.typeof arguments[0]
      for arg in arguments
        if (type = helpers.typeof arg) isnt @type
          throw new TypeError "Can't add item of type #{type} to typed-list of type #{@type}"
        @push arg

  self