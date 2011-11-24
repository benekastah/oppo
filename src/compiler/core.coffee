
oppo.module "compiler.core", ["compiler", "compiler.helpers"], ({compile}, helpers) ->
  self = this
  
  self.identifier = (ident) ->
    # Modify keywords
    for keyword in helpers.js_keywords
      ident = if ident is keyword then "_#{ident}_" else ident
    
    # Sanitize special characters
    ident = ident
    .replace(/\./g, "_dot_")
    .replace(/\-/g, "_")
    .replace(/\+/g, "_plus_")
    .replace(/\*/g, "_star_")
    .replace(/\=/g, "_eq_")
    .replace(/</g, "_lt_")
    .replace(/>/g, "_gt_")
    .replace(/%/g, "_percent_")
    .replace(/#/g, "_pound_")
    .replace(/\^/g, "_carat_")
    .replace(/'/g, "_squote_")
    .replace(/"/g, "_dquote_")
    .replace(/&/g, "_amp_")
    .replace(/\|/g, "_pipe_")
    .replace(/@/g, "_at_")
    .replace(/!/g, "_exclmark_")
    .replace(/\?/g, "_qmark_")
    .replace(/,/g, "_comma_")
    .replace(/\//g, "_fslash_")
    .replace(/\\/g, "_bslash_")
    .replace(/~/g, "_tilde_")
    .replace(/`/g, "_backtick_")
    .replace(/:/g, "_colon_")
    
    ident
  
  self.string = helpers.identity
  
  self.program = (first, args) ->
    base_deps = ["global", "require", "load"]
    if first?[0]? is "module"
      first[2] ?= []
      first[2] = [base_deps..., first[2]...]
      compile first.concat args[1..]
    else
      name = helpers.gensym "anonymous"
      args.push ["set!", "self", args.pop()]
      program = [
        ["module", name, base_deps, args...],
        [[".", "oppo", "module", "require"], "\"#{name}\""]
      ].map (item) -> compile item
      "#{program.join ",\n"};"
  
  self.do = (body) ->
    compile [["lambda", [], body...]]
      
  self.quote = (code) ->
    if code instanceof Array
      code = code.map (item) -> compile item
    helpers.stringify.to_js code
    
  self.if = (cond, t_action, f_action) ->
    """
    #{compile cond} ?
      #{compile t_action} :
      #{compile f_action or null}
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
    ident = if ident is "self" then ident else compile [".", "self", ident]
    val = compile val
    helpers.def ident, val, err
    
  self.set = (ident, val) ->
    err = compile ["set-error", "\"#{ident}\""]
    ident = if ident is "self" then ident else compile [".", "self", ident]
    val = compile val
    helpers.set ident, val, err
    
  self.defp = (ident, val) ->
    err = compile ["def-error", "\"#{ident}\""]
    ident = compile [".", "_private", ident]
    val = compile val
    helpers.set ident, val, err
    
  self.setp = (ident, val) ->
    err = compile ["set-error", "\"#{ident}\""]
    ident = compile [".", "_private", ident]
    val = compile val
    helpers.set ident, val, err
    
  self.module = (name, deps, body...) ->
    name = "\"#{name}\""
    
    vars = [
      new helpers.Var "_private", "{}"
    ]
    
    body = body.map (item) -> compile item
    
    fn = """
    (function (#{deps.join ', '}) {
      #{vars.join '\n  '}
      this.self = this;
      with (this) {
        #{body.join ',\n  '};
      }
      return this.self;
    })
    """
    
    
    deps = helpers.stringify.to_js deps.map (dep) -> "\"#{dep}\""
    "oppo.module(#{name}, #{deps}, #{fn})"
    
  # javascript interop helpers
  self.member_access = (items...) ->
    items = items.map (item) ->
      compile if typeof item is "string" and /^".*"$/.test item
        helpers.trim_quotes item
      else
        item
    base = items.shift()
    
    # Only supporting simple mode at the moment
    simple = true
    if simple
      "#{base}.#{items.join '.'}"
    else
      "#{base}[\"#{items.join '"]["'}\"]"
    
  self