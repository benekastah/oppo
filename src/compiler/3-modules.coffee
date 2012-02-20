do ->
  def = []
  defmacro = []
  
  adjust_environment = (module_name, names, scope) ->
    s_module_name = get_raw_text module_name
    modules[s_module_name] = {names, scope}
    
    _var = GETMACRO 'var'
    def.push GETMACRO 'def'
    compiler.def = (name, value) ->
      names.push name
      _var name, value, scope
      
    defmacro.push (last_macro = GETMACRO 'defmacro')
    compiler.defmacro = (name, rest...) ->
      r_name = get_raw_text name
      n_name = (to_symbol "#{s_module_name}.#{r_name}")
      def_stmt = [(to_symbol 'def'), name, [(to_symbol 'js-eval'), (last_macro n_name, rest...)]]
      compile [
        (to_symbol 'do'), def_stmt, 
        [
          (to_symbol 'js-eval'), "#{r_name}.macro_name = '#{compile n_name}'"
        ]
      ]
  
  restore_environment = ->
    compiler.def = def.pop()
    compiler.defmacro = defmacro.pop()
  
  DEFMACRO 'defmodule', (name, deps=[], body...) ->
    scope = Scope.make_new()
    r_name = compile get_raw_text name
    r_deps = _.map deps, _.compose compile, get_raw_text
    c_deps = compile [(to_symbol "quote"), r_deps]
    args = _.map deps, compile
    
    export_names = []
    adjust_environment name, export_names, scope
    # All the body must be compiled after this point
    
    body = if body.length then body else [null]
    c_body = _.map body, compile
    values = export_names
    symbols = _.map values, to_quoted
    js_map_args = Array::concat.apply [], _.zip symbols, values
    return_val = compile [(to_symbol 'js-map'), js_map_args...]
    
    # No compiling after this point
    vars = Scope.end_current()
    restore_environment()
    
    var_stmt = if vars.length then "var #{vars.join ', '};\n" else ''
    ret = """
    oppo.module(#{r_name}, #{c_deps}, function (#{args.join ', '}) {
      #{var_stmt}#{c_body.join ',\n'};
      return #{return_val}
    })
    """
  
  DEFMACRO 'require', (names...) ->
    _var = GETMACRO 'var'
    c_names = for name in names
      r_name = get_raw_text name
      ret = _var name, [(to_symbol 'js-eval'), "oppo.module.require(#{compile r_name})"]
    c_names.join ',\n'