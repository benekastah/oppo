
oppo.module "compiler.core", ["compiler", "compiler.helpers", "underscore"], ({compile}, helpers, _) ->
  self = this
  
  self.identifier = (ident) ->
    # Modify keywords
    for keyword in helpers.js_keywords
      ident = if ident is keyword then "_#{ident}_" else ident
    
    # Sanitize special characters
    # Simply convert dashes to underscores (unless ident could potentially be a single dash)
    if ident.length > 1
      ident = ident.replace /\-/g, '_'
    for own _char, replaced of helpers.js_illegal_identifiers
      while (ident.indexOf _char) >= 0
        ident = ident.replace _char, "_#{replaced}_"
    
    ident
  
  self.string = helpers.identity
  
  self.program = (first, args) ->
    base_deps = ["global", "require", "load"]
    if first?[0] is "module"
      first[2] ?= []
      first[2] = [base_deps..., first[2]...]
      compile first.concat args[1..]
    else
      name = helpers.gensym "anonymous"
      args.push ["set!", "self", args.pop()]
      program = [
        ["module", name, base_deps, ["js-eval", "self = global"], args...],
        [[".", "oppo", "module", "require"], "\"#{name}\""]
      ].map (item) -> compile item
      "#{program.join ",\n"};"
  
  # self.do = (body) ->
  #   compile [["lambda", [], body...]]
      
  self.quote = (code) ->
    if code instanceof Array
      code = code.map (item) -> compile item
    helpers.stringify.to_js code
    
  self.if = (cond, t_action, f_action) ->
    """
    /* if */ #{compile ["->bool", cond]} ?
      /* then */ #{compile t_action} :
      /* else */ #{compile f_action ? null}
    """
    
  # Working with variables
  self.defg = (ident, val) ->
    err = compile ['def-error', "\"#{ident}\""]
    ident = compile [".", "global", ident]
    val = compile val
    helpers.def ident, val, err
    
  self.setg = (ident, val) ->
    err = compile ['set-error', "\"#{ident}\""]
    ident = compile [".", "global", ident]
    val = compile val
    helpers.def ident, val, err
    
  self.let = (args) ->
    [first] = args
    if helpers.is_identifier args[0]
      [name, named_values, body...] = args
    else
      [named_values, body...] = args
    
    vars = []
    for item, i in named_values
      if i % 2 is 1
        vars.push new helpers.Var (compile last), (compile item)
      else
        last = item
        
    if name?
      name = compile name
      bind_name = "#{name} = #{name}.bind(null, #{name})"
      compile [
        ["lambda", [name], [name, name]]
        ["lambda", [name], ["js-eval", bind_name], vars..., body...]
      ]
    else
      compile [["lambda", [], vars..., body...]]
    
  # Module functions
  self.def = (ident, val) ->
    err = compile ["def-error", "\"#{ident}\""]
    ident = compile ident
    val = compile val
    
    # We have a simple variable
    if helpers.is_js_identifier ident
      helpers.Var.track new helpers.Var ident
    
    helpers.def ident, val, err
    
  self.set = (ident, val) ->
    err = compile ["set-error", "\"#{ident}\""]
    ident = compile ident
    val = compile val
    helpers.set ident, val, err
    
  self.module = (name, deps, body...) ->
    name = "\"#{name}\""
    
    Var = helpers.Var
    Var.new_set()
    Var.track new Var "self", "this"
    
    body = body.map (item) -> compile item
    args = _.map deps, (item) -> compile item
    vars = Var.grab()
    
    fn = """
    (function (#{args.join ', '}) {
      #{vars.join '\n  '}
      with (this) {
        #{body.join ',\n    '};
      }
      return self;
    })
    """
    
    deps = helpers.stringify.to_js _.map (deps or []), (dep) -> "\"#{dep}\""
    "(oppo || require('oppo')).module(#{name}, #{deps}, #{fn})"
    
  # javascript interop helpers
  self.member_access = (items...) ->
    items = items.map (item) ->
      item = if helpers.is_string item
        helpers.trim_quotes item
      else
        item
      compile item
    base = items.shift()
    
    "#{base}.#{items.join '.'}"
    
  self