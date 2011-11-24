oppo.module "oppo.string", ["oppo", "compiler"], (oppo, {compile, helpers}) ->
  self = this

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
    
  self