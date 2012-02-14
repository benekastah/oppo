do ->
  def = null
  defmacro = null
  set = null
  
  adjust_environment = (module_name, self_name) ->
    def = GETMACRO 'def'
    DEFMACRO 'def', (name, value) ->
      _name = if is_symbol name
        [(to_symbol "."), self_name, [(to_symbol 'quote'), name]]
      else
        name
        
      def _name, value
      
    defmacro = GETMACRO 'defmacro'
    DEFMACRO 'defmacro', (name, rest...) ->
      _name = if is_symbol name
        [(to_symbol "."), module_name, [(to_symbol 'quote'), name]]
      else
        name
        
      defmacro name, rest...
      
    set = GETMACRO 'set!'
    DEFMACRO 'set!', (name, value) ->
      if _.isEqual name, self_name
        throw "Can't redefine 'self' in a module."
      else
        set name, value
  
  restore_environment = ->
    DEFMACRO 'def', def
    DEFMACRO 'defmacro', defmacro
    DEFMACRO 'set!', set
    def = defmacro = set = null
  
  DEFMACRO 'defmodule', (name, deps=[], body...) ->
    scope = Scope.make_new()
    r_name = compile get_raw_text name
    r_deps = _.map deps, _.compose compile, get_raw_text
    c_deps = compile [(to_symbol "quote"), r_deps]
    args = _.map deps, compile
    
    self_name = to_symbol "self"
    define_self = compile [(to_symbol "var"), self_name, [(to_symbol 'js-eval'), 'this']]
    adjust_environment name, self_name
    # All the body must be compiled after this point
    
    body = if body.length then body else [null]
    c_body = compile [(to_symbol 'do'), body...]
    
    # No compiling after this point
    current_var_group = get_keys scope
    var_smt = "var #{current_var_group.join ', '};"
    
    Scope.end_current()
    restore_environment()
    
    ret = """
    oppo.module(#{r_name}, #{c_deps}, function (#{args.join ', '}) {
      #{var_smt}
      with (#{define_self}) {
        return #{c_body};
      }
    })
    """
  
  DEFMACRO 'require', (names...) ->
    c_names = for name in names
      r_name = get_raw_text name
      "oppo.module.require(#{compile r_name})"
    c_names.join ',\n'