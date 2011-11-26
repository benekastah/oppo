oppo.module "oppo.string", ["oppo", "compiler"], (oppo, {compile, helpers}) ->
  self = this
  
  self.to_string = (s) -> s.toString()
  
  self.uppercase = (str) -> str.toUpperCase()

  self.lowercase = (str) -> str.toLowerCase()

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
    
    string_method = (name) ->
      (str, things...) -> str[name] things...
  
    properties = [
      "charAt"
      "charCodeAt"
      "concat"
      "indexOf"
      "lastIndexOf"
      "localeCompare"
    ]
    
    for prop in properties
      self[prop] = string_method prop
  
  self.remove = (str, search) -> self.replace str, search, ''
    
  self