oppo.module "oppo.string", ["oppo", "oppo.helpers", "compiler"], (oppo, helpers, {compile}) ->
  self = this
  
  {global_method_set, make_prototype_method} = helpers.get_runtime_builders self
  
  global_method_set "->string", (s) -> s.toString()
  global_method_set "uppercase", (str) -> str.toUpperCase()
  global_method_set "lowercase", (str) -> str.toLowerCase()
  
  global_method_set "split", (str, splitter) -> str.split splitter

  self.capitalize = (str) ->
    (self.uppercase str.substr(0,1)) + str.substr 1
  
  self.uncapitalize = (str) ->
    (self.lowercase str.substr(0,1)) + str.substr 1
  
  self.dasherize = (str) ->
    ls = str.split /\s|_|(?=[A-Z])/
    ls = _.map ls, self.uncapitalize
    result = ls.join '-'
    
  do ->
    ## From String prototype
  
    properties = [
      "charAt"
      "charCodeAt"
      "concat"
      "indexOf"
      "lastIndexOf"
      "localeCompare"
    ]
    
    for prop in properties
      self[prop] = make_prototype_method prop
  
  self.remove = (str, search) -> self.replace str, search, ''
    
  self