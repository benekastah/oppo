
class C.OppoObject extends C.Object
  constructor: ->
    super

  compile: ->
    @static_pairs = []
    @dynamic_pairs = []
    for pair in @property_value_pairs
      [prop, val] = pair
      [prop] = oppoize prop
      [val] = oppoize val
      prop = C.Macro.transform prop
      pair = [prop, val]
      if prop instanceof C.Symbol and (prop.quoted or prop.quasiquoted)
        prop.quoted = prop.quasiquoted = false
        @static_pairs.push pair
      else if prop instanceof C.String
        @static_pairs.push pair
      else
        @dynamic_pairs.push pair

    old_pairs = @property_value_pairs
    @property_value_pairs = @static_pairs
    
    obj = super
    sym_obj = C.Var.gensym "obj"
    set_obj = new C.Var.Set _var: sym_obj, value: new C.Raw obj
    dynamic = for [prop, val] in @dynamic_pairs
      new C.Raw "#{sym_obj._compile()}[#{prop._compile()}] = #{val._compile()}"
    
    result = if dynamic.length
      (new C.CommaGroup [set_obj, dynamic..., sym_obj], @yy)._compile()
    else
      obj

    @property_value_pairs = old_pairs
    result

  compile_quoted: ->
    pairs = for [prop, val] in @property_value_pairs
      [(C.Macro.transform prop), (C.Macro.transform val)]

    [pairs] = oppoize pairs
    pairs.quoted = true
    c_pairs = pairs._compile()
    "new lemur.Compiler.OppoObject(#{c_pairs}, #{@line_number})"