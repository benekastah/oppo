oppo.module "oppo.helpers", ["compiler"], ({compile}) ->
  self = this
  
  self.global_method_set = (names, fn) ->
    if names not instanceof Array
      names = [names]
    for nm in names
      nm = compile nm
      global[nm] = @[nm] = fn
    
  self.global_method_get = (nm) ->
    global[compile nm]
    
  self.make_prototype_method = (nm) ->
    (base, args...) -> base[nm] args...
  
  self.get_runtime_builders = (scope) ->
    {global_method_set, make_prototype_method} = self
    global_method_set = _.bind global_method_set, scope
    global_method_get = self.global_method_get
    make_prototype_method = _.bind make_prototype_method, scope
    {global_method_set, global_method_get, make_prototype_method}
    
  self.typeof = (x) ->
    if x is null
      "null"
    else if x not instanceof Object
      typeof x
    else
      x.constructor?.name ? (Object::toString.call x).match(/\s(\w+)/)[1]
    
  self