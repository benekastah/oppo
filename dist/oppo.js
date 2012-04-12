(function() {
  var INDENT, JS_ILLEGAL_IDENTIFIER_CHARS, JS_KEYWORDS, WRAPPER_PREFIX, WRAPPER_REGEX, WRAPPER_SUFFIX, call_macro, char_wrapper, clone, compile, compile_list, indent_down, indent_up, last, macro, macro_do, macro_if, macro_let, map, newline, newline_down, newline_up, pop_scope, push_scope, read, root, scope_stack, to_js_identifier, trim, type_of, types, wrapper, __toString, _ref, _ref2, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for(var key in parent) {
      if(__hasProp.call(parent, key)) {
        child[key] = parent[key]
      }
    }
    function ctor() {
      this.constructor = child
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child
  }, __slice = Array.prototype.slice;
  JS_KEYWORDS = ["break", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for", "function", "if", "implements", "import", "in", "instanceof", "interface", "let", "new", "null", "package", "private", "protected", "public", "return", "static", "switch", "super", "this", "throw", "true", "try", "typeof", "undefined", "var", "void", "while", "with", "yield"];
  JS_ILLEGAL_IDENTIFIER_CHARS = {"~":"tilde", "`":"backtick", "!":"exclamationmark", "@":"at", "#":"pound", "%":"percent", "^":"carat", "&":"amperstand", "*":"asterisk", "(":"leftparen", ")":"rightparen", "-":"dash", "+":"plus", "=":"equals", "{":"leftcurly", "}":"rightcurly", "[":"leftsquare", "]":"rightsquare", "|":"pipe", "\\":"backslash", '"':"doublequote", "'":"singlequote", ":":"colon", ";":"semicolon", "<":"leftangle", ">":"rightangle", ",":"comma", ".":"period", "?":"questionmark", "/":"forwardslash", 
  " ":"space", "\t":"tab", "\n":"newline", "\r":"carriagereturn"};
  WRAPPER_PREFIX = "_$";
  WRAPPER_SUFFIX = "_";
  WRAPPER_REGEX = /_\$[^_]+_/g;
  wrapper = function(text) {
    return"" + WRAPPER_PREFIX + text + WRAPPER_SUFFIX
  };
  char_wrapper = function(_char) {
    var txt, _ref;
    txt = (_ref = JS_ILLEGAL_IDENTIFIER_CHARS[_char]) != null ? _ref : "ASCII_" + _char.charCodeAt(0);
    return wrapper(txt)
  };
  to_js_identifier = function(text) {
    if(JS_KEYWORDS.indexOf(text) >= 0) {
      return wrapper(text)
    }
    if(text.length === 0) {
      return wrapper("null")
    }
    return text.replace(WRAPPER_REGEX, wrapper).replace(/^\d/, char_wrapper).replace(/[^\w\$]/g, char_wrapper)
  };
  if((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = to_js_identifier
  }else {
    if(typeof ender !== "undefined" && ender !== null) {
      ender.ender({to_js_identifier:to_js_identifier})
    }else {
      this.to_js_identifier = to_js_identifier
    }
  }
  root = typeof global !== "undefined" && global !== null ? global : window;
  root.oppo = {compiler:{types:{}, scope_stack:[{}]}};
  if((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = oppo
  }
  _ref = oppo.compiler, scope_stack = _ref.scope_stack, types = _ref.types;
  oppo.Error = function(_super) {
    __extends(Error, _super);
    function Error(name, message) {
      this.name = name;
      this.message = message
    }
    Error.prototype.toString = function() {
      return"" + this.name + ": " + this.message
    };
    return Error
  }(Error);
  oppo.ArityException = function(_super) {
    __extends(ArityException, _super);
    function ArityException(message) {
      if(message != null) {
        this.message = message
      }
    }
    ArityException.prototype.name = "Arity-Exception";
    ArityException.prototype.message = "Wrong number of arguments";
    return ArityException
  }(oppo.Error);
  __toString = Object.prototype.toString;
  type_of = function(x) {
    return __toString.call(x).slice(8, -1).toLowerCase()
  };
  clone = (_ref2 = Object.create) != null ? _ref2 : function(o) {
    function ObjectClone() {
    }
    ObjectClone.prototype = o;
    return new ObjectClone
  };
  last = function(list) {
    if((list != null ? list.length : void 0) != null) {
      return list[list.length - 1]
    }
  };
  map = function(list, fn) {
    var item, _i, _len, _results;
    _results = [];
    for(_i = 0, _len = list.length;_i < _len;_i++) {
      item = list[_i];
      _results.push(fn(item))
    }
    return _results
  };
  compile_list = function(list, arg) {
    var item, _i, _len, _results;
    _results = [];
    for(_i = 0, _len = list.length;_i < _len;_i++) {
      item = list[_i];
      _results.push(item.compile(arg))
    }
    return _results
  };
  trim = String.prototype.trim || function() {
    return this.replace(/^\s+/, "").replace(/\s+$/, "")
  };
  push_scope = function() {
    var new_scope, scope;
    scope = last(scope_stack);
    new_scope = clone(scope);
    scope_stack.push(new_scope);
    return new_scope
  };
  pop_scope = function() {
    return scope_stack.pop()
  };
  INDENT = "";
  indent_up = function() {
    return INDENT = "" + INDENT + "  "
  };
  indent_down = function() {
    return INDENT = INDENT.substr(2)
  };
  newline = function() {
    return"\n" + INDENT
  };
  newline_down = function() {
    return"\n" + indent_down()
  };
  newline_up = function() {
    return"\n" + indent_up()
  };
  (function() {
    this.SyntaxNode = function() {
      function SyntaxNode(value, yy_or_node_or_num) {
        var _ref3;
        this.value = value;
        if(yy_or_node_or_num instanceof types.SyntaxNode) {
          this.transfer_node = yy_or_node_or_num;
          this.yy = yy_or_node_or_num.yy
        }else {
          if(type_of(yy_or_node_or_num) === "number") {
            this.yy = {lexer:{yylineno:yy_or_node_or_num}}
          }else {
            this.yy = yy_or_node_or_num
          }
        }
        this.line_number = (_ref3 = this.yy) != null ? _ref3.lexer.yylineno : void 0
      }
      SyntaxNode.prototype.cache = {};
      SyntaxNode.prototype.compile = function(quoted) {
        if(quoted == null) {
          quoted = this.quoted
        }
        if(type_of(this._compile) === "function") {
          return this.cache["_compile"] || this._compile()
        }else {
          if(!quoted) {
            return this.cache["compile_unquoted"] || this.compile_unquoted()
          }else {
            return this.cache["compile_quoted"] || this.compile_quoted()
          }
        }
      };
      SyntaxNode.prototype.compile_unquoted = function() {
        return"" + this.value
      };
      SyntaxNode.prototype.compile_quoted = function() {
        return"new oppo.compiler.types." + this.constructor.name + "('" + this.value + "')"
      };
      SyntaxNode.prototype.location_trace = function() {
        var file, line_number;
        line_number = this.line_number ? "@ line " + this.line_number : "";
        file = this.file ? " in " + this.file : "";
        return"" + line_number + file
      };
      SyntaxNode.prototype.error_message = function(type, msg) {
        var full_msg, msg_prefix;
        if(arguments.length === 1) {
          msg = type
        }
        if(msg == null) {
          msg = "An error occurred"
        }
        msg.replace(/\.$/, "");
        msg_prefix = "" + (type != null ? type : this.constructor.name) + "Error: ";
        return full_msg = "" + msg_prefix + msg + this.location_trace() + "."
      };
      SyntaxNode.prototype.error = function(type, msg) {
        throw this.error_message(type, msg);
      };
      SyntaxNode.prototype.valueOf = function() {
        return this.value
      };
      SyntaxNode.prototype.toString = function() {
        var prefix;
        prefix = this.quoted ? "'" : "";
        return"" + prefix + this.value.toString()
      };
      return SyntaxNode
    }();
    this.List = function(_super) {
      __extends(List, _super);
      function List() {
        List.__super__.constructor.apply(this, arguments)
      }
      List.prototype.compile_unquoted = function() {
        var scope, _ref3;
        scope = last(scope_stack);
        return(_ref3 = scope.call).invoke.apply(_ref3, this.value)
      };
      List.prototype.compile_quoted = function() {
        var c_value;
        c_value = compile_list(this.value, true);
        return"[" + c_value.join(", ") + "]"
      };
      List.prototype.toString = function() {
        var item, prefix, s_value;
        s_value = function() {
          var _i, _len, _ref3, _results;
          _ref3 = this.value;
          _results = [];
          for(_i = 0, _len = _ref3.length;_i < _len;_i++) {
            item = _ref3[_i];
            _results.push(item.toString())
          }
          return _results
        }.call(this);
        prefix = this.quoted ? "'" : "";
        return"" + prefix + "(" + s_value.join(" ") + ")"
      };
      return List
    }(this.SyntaxNode);
    this.Quoted = function(_super) {
      __extends(Quoted, _super);
      function Quoted(value, yy) {
        Quoted.__super__.constructor.call(this, null, yy);
        value.quoted = true;
        this.value = [new types.Symbol("quote", yy), value];
        this.quoted_value = value
      }
      return Quoted
    }(this.List);
    this.Object = function(_super) {
      __extends(Object, _super);
      function Object() {
        var i, item, values, _len, _ref3;
        Object.__super__.constructor.apply(this, arguments);
        this.static_keys = [];
        this.static_values = [];
        this.dynamic_keys = [];
        this.dynamic_values = [];
        values = null;
        _ref3 = this.value;
        for(i = 0, _len = _ref3.length;i < _len;i++) {
          item = _ref3[i];
          if(i % 2 === 0) {
            if(item instanceof types.Symbol && !item.quoted) {
              this.dynamic_keys.push(item);
              values = this.dynamic_values
            }else {
              this.static_keys.push(item);
              values = this.static_values
            }
          }else {
            values.push(item)
          }
        }
        delete this.value;
        if(this.static_keys.length !== this.static_values.length || this.dynamic_keys.length !== this.dynamic_values.length) {
          this.error("Cannot make an object with an odd number of items.")
        }
      }
      Object.prototype._compile = function() {
        var c_key, c_tmp_var, c_value, dynamic_body, i, item, literal_body, object, object_definition, scope, tmp_var;
        literal_body = function() {
          var _len, _ref3, _results;
          _ref3 = this.static_keys;
          _results = [];
          for(i = 0, _len = _ref3.length;i < _len;i++) {
            item = _ref3[i];
            if(item instanceof types.Quoted) {
              c_key = item.value[1].compile(false)
            }else {
              c_key = item.compile(false)
            }
            c_value = this.static_values[i].compile();
            _results.push("" + c_key + ": " + c_value)
          }
          return _results
        }.call(this);
        if(literal_body.length) {
          object = "{" + newline_up() + literal_body.join("," + newline()) + newline_down() + "}"
        }else {
          object = "{}"
        }
        if(this.dynamic_keys.length) {
          tmp_var = types.Symbol.gensym("obj");
          c_tmp_var = tmp_var.compile();
          scope = last(scope_stack);
          object_definition = scope.def.invoke(tmp_var, new types.List([new types.Symbol("js-eval"), object]));
          dynamic_body = function() {
            var _len, _ref3, _results;
            _ref3 = this.dynamic_keys;
            _results = [];
            for(i = 0, _len = _ref3.length;i < _len;i++) {
              item = _ref3[i];
              c_key = item.compile();
              c_value = this.dynamic_values[i].compile();
              _results.push("" + c_tmp_var + "[" + c_key + "] = " + c_value)
            }
            return _results
          }.call(this);
          object = "(" + object_definition + "," + newline() + dynamic_body.join("," + newline()) + "," + newline() + c_tmp_var + ")"
        }
        return object
      };
      return Object
    }(this.SyntaxNode);
    this.Number = function(_super) {
      __extends(Number, _super);
      function Number() {
        Number.__super__.constructor.apply(this, arguments)
      }
      Number.prototype._compile = function() {
        return this.value
      };
      return Number
    }(this.SyntaxNode);
    this.Fixnum = function(_super) {
      __extends(Fixnum, _super);
      function Fixnum() {
        Fixnum.__super__.constructor.apply(this, arguments)
      }
      return Fixnum
    }(this.Number);
    this.Float = function(_super) {
      __extends(Float, _super);
      function Float() {
        Float.__super__.constructor.apply(this, arguments)
      }
      return Float
    }(this.Number);
    this.String = function(_super) {
      __extends(String, _super);
      function String() {
        String.__super__.constructor.apply(this, arguments)
      }
      String.prototype._compile = function() {
        var val;
        val = this.value instanceof types.Symbol ? this.value.compile() : this.value;
        return'"' + val.replace(/\n/g, "\\n") + '"'
      };
      return String
    }(this.SyntaxNode);
    this.Regex = function(_super) {
      __extends(Regex, _super);
      function Regex(body, flags, yy) {
        this.body = body;
        this.flags = flags;
        Regex.__super__.constructor.call(this, null, yy)
      }
      Regex.prototype.compile_unquoted = function() {
        return"/" + this.body + "/" + this.flags
      };
      return Regex
    }(this.SyntaxNode);
    this.Atom = function(_super) {
      __extends(Atom, _super);
      function Atom(yy) {
        Atom.__super__.constructor.call(this, this.value, yy)
      }
      return Atom
    }(this.SyntaxNode);
    this.Nil = function(_super) {
      __extends(Nil, _super);
      function Nil() {
        Nil.__super__.constructor.apply(this, arguments)
      }
      Nil.prototype.value = null;
      return Nil
    }(this.Atom);
    this.Boolean = function(_super) {
      __extends(Boolean, _super);
      function Boolean() {
        Boolean.__super__.constructor.apply(this, arguments)
      }
      return Boolean
    }(this.Atom);
    this.True = function(_super) {
      __extends(True, _super);
      function True() {
        True.__super__.constructor.apply(this, arguments)
      }
      True.prototype.value = true;
      True.prototype.toString = function() {
        return"#t"
      };
      return True
    }(this.Boolean);
    this.False = function(_super) {
      __extends(False, _super);
      function False() {
        False.__super__.constructor.apply(this, arguments)
      }
      False.prototype.value = false;
      False.prototype.toString = function() {
        return"#f"
      };
      return False
    }(this.Boolean);
    this.Symbol = function(_super) {
      __extends(Symbol, _super);
      function Symbol(value, yy) {
        Symbol.__super__.constructor.apply(this, arguments);
        if(this.value.substr(0, 3) === "...") {
          this.splat = true;
          this.value = this.value.substr(3)
        }
      }
      Symbol.prototype.compile_unquoted = function() {
        var val;
        val = this.value.length > 1 ? this.value.replace(/\-/g, "_") : this.value;
        return to_js_identifier(val)
      };
      Symbol.gensym = function(sym) {
        var random, s_sym, symbol, time;
        if(sym instanceof types.Symbol) {
          s_sym = sym.value;
          symbol = sym
        }else {
          if(type_of(sym) === "string") {
            s_sym = sym
          }else {
            s_sym = "gen"
          }
        }
        time = (+new Date).toString(36);
        random = Math.floor(Math.random() * 1E5).toString(36);
        s_sym = "" + s_sym + "-" + time + "-" + random;
        return new types.Symbol(s_sym, symbol)
      };
      return Symbol
    }(this.SyntaxNode);
    this.Function = function(_super) {
      __extends(Function, _super);
      function Function(name, args, body, yy) {
        var arg, i, _len;
        this.name = name;
        this.args = args;
        this.body = body;
        Function.__super__.constructor.call(this, null, yy);
        if(this.args) {
          this.min_arity = this.max_arity = this.args.length;
          for(i = 0, _len = args.length;i < _len;i++) {
            arg = args[i];
            if(arg.splat) {
              this.min_arity = i;
              this.max_arity = Infinity;
              break
            }
          }
        }else {
          this.min_arity = 0;
          this.max_arity = Infinity
        }
      }
      Function.prototype.compile_unquoted = function() {
        var body, c_args, c_body, c_name, code, error_name, result, tail_recursive, temp_result, v_length, _ref3, _ref4;
        indent_up();
        c_name = (_ref3 = (_ref4 = this.name) != null ? _ref4.compile() : void 0) != null ? _ref3 : "";
        if(this.args != null) {
          c_args = compile_list(this.args)
        }else {
          c_args = []
        }
        this.cached_compiled_args = c_args;
        body = this.body;
        body = function() {
          var _i, _len, _results;
          _results = [];
          for(_i = 0, _len = body.length;_i < _len;_i++) {
            code = body[_i];
            _results.push(types.Macro.transform(code))
          }
          return _results
        }();
        tail_recursive = this.transform_tail_recursive(last(body));
        c_body = compile_list(this.body);
        v_length = types.Symbol.gensym("argslen").compile();
        error_name = c_name ? " in '" + c_name + "': " : "";
        if(tail_recursive) {
          indent_up();
          c_body = compile_list(this.body);
          c_body = c_body.join("," + newline());
          temp_result = types.Symbol.gensym("result").compile();
          c_body = "while (true) {\n" + INDENT + "var " + this.temp_continue + " = false;\n" + INDENT + "var " + temp_result + " = (" + c_body + ");\n\n" + INDENT + "if (!" + this.temp_continue + ") {\n" + indent_up() + "return " + temp_result + ";\n" + indent_down() + "}\n" + indent_down() + "}"
        }else {
          c_body = compile_list(this.body);
          c_body = "return (" + c_body.join("," + newline()) + ");"
        }
        result = "function " + c_name + "(" + c_args.join(", ") + ") {\n" + INDENT + c_body + "\n}";
        indent_down();
        return result
      };
      Function.prototype.transform_tail_recursive = function(code) {
        var arg, c_passed_arg, callable, callable_value, emulated_call, i, index, result, scope, temp_args_assignments, temp_args_to_real_args, tmp, _len, _ref3, _ref4;
        scope = last(scope_stack);
        if(!code.quoted && code instanceof types.List) {
          callable = code.value[0];
          if(callable instanceof types.Symbol) {
            callable_value = callable.value;
            if(((_ref3 = this.name) != null ? _ref3.value : void 0) === callable_value) {
              if(!this.temp_args) {
                this.temp_args = function() {
                  var _i, _len, _ref4, _results;
                  _ref4 = this.args;
                  _results = [];
                  for(_i = 0, _len = _ref4.length;_i < _len;_i++) {
                    arg = _ref4[_i];
                    _results.push(types.Symbol.gensym(arg).compile())
                  }
                  return _results
                }.call(this);
                this.temp_continue = types.Symbol.gensym("continue").compile()
              }
              temp_args_assignments = [];
              temp_args_to_real_args = [];
              _ref4 = this.temp_args;
              for(i = 0, _len = _ref4.length;i < _len;i++) {
                tmp = _ref4[i];
                index = i + 1;
                c_passed_arg = code.value[index].compile();
                temp_args_assignments.push("" + tmp + " = " + c_passed_arg);
                temp_args_to_real_args.push("" + this.cached_compiled_args[i] + " = " + tmp)
              }
              emulated_call = __slice.call(temp_args_assignments).concat(__slice.call(temp_args_to_real_args), ["" + this.temp_continue + " = true"]);
              code._compile = function() {
                return"(" + emulated_call.join("," + newline()) + ")"
              };
              return true
            }else {
              if(callable_value === macro_do.name || callable_value === macro_let.name) {
                return this.transform_tail_recursive(last(code))
              }else {
                if(callable_value === macro_if.value) {
                  result = this.transform_tail_recursive(code[2]);
                  result || (result = this.transform_tail_recursive(code[3]));
                  return result
                }
              }
            }
          }
        }
        return false
      };
      return Function
    }(this.SyntaxNode);
    return this.Macro = function(_super) {
      __extends(Macro, _super);
      function Macro(name, argnames, template, yy, fn) {
        this.name = name;
        this.argnames = argnames;
        this.template = template;
        Macro.__super__.constructor.call(this, null, yy);
        if(fn != null) {
          this.invoke = fn
        }
      }
      Macro.prototype.compile_unquoted = function() {
        var c_name, scope;
        c_name = this.name.compile();
        if(this.invoke == null) {
        }
        scope = last(scope_stack);
        scope[c_name] = this;
        return"null"
      };
      Macro.transform = function(code) {
        var c_callable, callable, item, scope;
        if(code instanceof types.List) {
          if(code.quoted) {
            return this.transform(code)
          }else {
            callable = code.value[0];
            if(callable instanceof types.Symbol) {
              c_callable = callable.compile();
              scope = last(scope_stack);
              item = scope[c_callable];
              if(item instanceof types.Macro && !item.builtin) {
                return item.transform(code)
              }
            }
          }
        }
        return code
      };
      return Macro
    }(this.SyntaxNode)
  }).call(types);
  macro = function(name, fn) {
    var m, s_name;
    s_name = new types.Symbol(name);
    m = new types.Macro(s_name, null, null, null, fn);
    m.builtin = true;
    m.compile();
    return m
  };
  call_macro = function() {
    var args, c_name, name, scope, _ref3;
    name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    scope = last(scope_stack);
    c_name = to_js_identifier(name);
    return(_ref3 = scope[c_name]).invoke.apply(_ref3, args)
  };
  macro("def", function() {
    var args, body, c_name, c_value, fn, name, rest, scope, to_define, value;
    to_define = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if(!rest.length) {
      to_define.error("Def", "You must provide a value.")
    }
    if(to_define instanceof types.List) {
      name = to_define.value[0];
      args = to_define.value.slice(1);
      body = rest;
      fn = new types.Function(name, args, body, to_define);
      c_name = name.compile();
      c_value = fn.compile()
    }else {
      if(to_define instanceof types.Symbol) {
        name = to_define;
        value = rest[0];
        c_name = name.compile();
        c_value = value.compile()
      }else {
        to_define.error("Def", "Invalid definition.")
      }
    }
    scope = last(scope_stack);
    if(scope[c_name] != null) {
      name.error("Def", "Cannot define previously defined value.")
    }else {
      scope[c_name] = value
    }
    return"" + c_name + " = " + c_value
  });
  macro("call", function() {
    var args, c_args, callable, item, scope, to_call;
    callable = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    to_call = callable.compile();
    if(callable instanceof types.Symbol) {
      scope = last(scope_stack);
      item = scope[to_call];
      if(item instanceof types.Macro) {
        return item.invoke.apply(item, args)
      }
    }
    if(callable instanceof types.Function) {
      to_call = "(" + to_call + ")"
    }
    c_args = compile_list(args);
    return"" + to_call + "(" + c_args.join(", ") + ")"
  });
  macro_do = macro("do", function() {
    var c_items;
    c_items = compile_list(arguments);
    return"(" + c_items.join(",\n") + ")"
  });
  macro("quote", function(x) {
    x.quoted = true;
    return x.compile()
  });
  macro("raise", function(namespace, error) {
    var c_error, c_namespace;
    if(arguments.length === 1) {
      error = namespace;
      c_namespace = "Error"
    }else {
      c_namespace = namespace.compile()
    }
    c_error = error.compile();
    return"(function () {\n  throw new oppo.Error(" + c_namespace + ", " + c_error + ");\n})()"
  });
  macro("assert", function(sexp) {
    var c_sexp, error, error_namespace, raise_call;
    c_sexp = sexp.compile();
    error_namespace = new types.String("Assertion-Error");
    error = new types.String(sexp.toString());
    raise_call = call_macro("raise", error_namespace, error);
    return"(" + c_sexp + " || " + raise_call + ")"
  });
  macro("js-eval", function(js_code) {
    return js_code
  });
  macro_if = macro("if", function() {
  });
  macro_let = macro("let", function() {
  });
  read = oppo.read = oppo.compiler.read = function() {
    return parser.parse.apply(parser, arguments)
  };
  compile = oppo.compile = oppo.compiler.compile = function(sexp) {
    INDENT = "";
    push_scope();
    return sexp.compile()
  }
}).call(this);
var parser = function() {
  var types = oppo.compiler.types;
  var parser = {trace:function trace() {
  }, yy:{}, symbols_:{"error":2, "program":3, "s_expression_list":4, "EOF":5, "s_expression":6, "special_form":7, "list":8, "symbol":9, "literal":10, "atom":11, "callable_list":12, "quoted_list":13, "object":14, "(":15, "element_list":16, ")":17, "[":18, "]":19, "OBJECT":20, "OBJECT_END":21, "element":22, "QUOTE":23, "QUASIQUOTE":24, "UNQUOTE":25, "UNQUOTE_SPLICING":26, "FUNCTION":27, "NIL":28, "BOOLEAN_TRUE":29, "BOOLEAN_FALSE":30, "string":31, "regex":32, "number":33, "REGEX":34, "FLAGS":35, "FIXNUM":36, 
  "FLOAT":37, "BASENUM":38, "STRING":39, "KEYWORD":40, "IDENTIFIER":41, "$accept":0, "$end":1}, terminals_:{2:"error", 5:"EOF", 15:"(", 17:")", 18:"[", 19:"]", 20:"OBJECT", 21:"OBJECT_END", 23:"QUOTE", 24:"QUASIQUOTE", 25:"UNQUOTE", 26:"UNQUOTE_SPLICING", 27:"FUNCTION", 28:"NIL", 29:"BOOLEAN_TRUE", 30:"BOOLEAN_FALSE", 34:"REGEX", 35:"FLAGS", 36:"FIXNUM", 37:"FLOAT", 38:"BASENUM", 39:"STRING", 40:"KEYWORD", 41:"IDENTIFIER"}, productions_:[0, [3, 2], [3, 1], [4, 2], [4, 1], [6, 1], [6, 1], [6, 1], 
  [6, 1], [6, 1], [8, 1], [8, 1], [8, 1], [12, 3], [12, 2], [13, 3], [13, 2], [14, 3], [14, 2], [16, 1], [16, 2], [22, 1], [7, 2], [7, 2], [7, 2], [7, 2], [7, 3], [11, 1], [11, 1], [11, 1], [10, 1], [10, 1], [10, 1], [32, 2], [33, 1], [33, 1], [33, 1], [31, 1], [31, 2], [9, 1]], performAction:function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
    var $0 = $$.length - 1;
    switch(yystate) {
      case 1:
        var _do = new types.Symbol("do", yy);
        return new types.List([_do].concat($$[$0 - 1]), yy);
        break;
      case 2:
        return new types.Nil(yy);
        break;
      case 3:
        this.$ = $$[$0 - 1];
        this.$.push($$[$0]);
        break;
      case 4:
        this.$ = [$$[$0]];
        break;
      case 13:
        this.$ = new types.List($$[$0 - 1], yy);
        break;
      case 14:
        this.$ = new types.Nil(yy);
        break;
      case 15:
        var list = new types.List($$[$0 - 1], yy);
        this.$ = new types.Quoted(list, yy);
        break;
      case 16:
        var list = new types.List([], yy);
        this.$ = new types.Quoted(list, yy);
        break;
      case 17:
        this.$ = new types.Object($$[$0 - 1], yy);
        break;
      case 18:
        this.$ = new types.Object([], yy);
        break;
      case 19:
        this.$ = [$$[$0]];
        break;
      case 20:
        this.$ = $$[$0 - 1];
        this.$.push($$[$0]);
        break;
      case 22:
        this.$ = new types.Quoted($$[$0], yy);
        break;
      case 23:
        var sym = new types.Symbol("quasiquote", yy);
        this.$ = new types.List([sym, $$[$0]], yy);
        break;
      case 24:
        var sym = new types.Symbol("unquote", yy);
        this.$ = new types.List([sym, $$[$0]], yy);
        break;
      case 25:
        var sym = new types.Symbol("unquote-splicing", yy);
        this.$ = new types.List([sym, $$[$0]], yy);
        break;
      case 26:
        this.$ = new types.Function(null, null, $$[$0 - 1]);
        break;
      case 27:
        this.$ = new types.Nil(yy);
        break;
      case 28:
        this.$ = new types.True(yy);
        break;
      case 29:
        this.$ = new types.False(yy);
        break;
      case 33:
        this.$ = new types.Regex($$[$0 - 1], $$[$0].substr(1), yy);
        break;
      case 34:
        this.$ = new types.Fixnum($$[$0], yy);
        break;
      case 35:
        this.$ = new types.Float($$[$0], yy);
        break;
      case 36:
        var basenum = $$[$0].split("#");
        var base = basenum[0];
        var snum = basenum[1];
        var num = parseInt(snum, +base);
        this.$ = new types.Fixnum(num, yy);
        break;
      case 37:
        this.$ = new types.String($$[$0], yy);
        break;
      case 38:
        this.$ = new types.String($$[$0].value, yy);
        break;
      case 39:
        this.$ = new types.Symbol($$[$0], yy);
        break
    }
  }, table:[{3:1, 4:2, 5:[1, 3], 6:4, 7:5, 8:6, 9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 15:[1, 25], 18:[1, 26], 20:[1, 27], 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 28], 40:[1, 29], 41:[1, 18]}, {1:[3]}, {5:[1, 34], 6:35, 7:5, 8:6, 9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 15:[1, 25], 18:[1, 26], 20:[1, 27], 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 
  22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 28], 40:[1, 29], 41:[1, 18]}, {1:[2, 2]}, {5:[2, 4], 15:[2, 4], 18:[2, 4], 20:[2, 4], 23:[2, 4], 24:[2, 4], 25:[2, 4], 26:[2, 4], 27:[2, 4], 28:[2, 4], 29:[2, 4], 30:[2, 4], 34:[2, 4], 36:[2, 4], 37:[2, 4], 38:[2, 4], 39:[2, 4], 40:[2, 4], 41:[2, 4]}, {5:[2, 5], 15:[2, 5], 17:[2, 5], 18:[2, 5], 19:[2, 5], 20:[2, 5], 21:[2, 5], 23:[2, 5], 24:[2, 5], 25:[2, 5], 26:[2, 5], 27:[2, 5], 28:[2, 5], 
  29:[2, 5], 30:[2, 5], 34:[2, 5], 36:[2, 5], 37:[2, 5], 38:[2, 5], 39:[2, 5], 40:[2, 5], 41:[2, 5]}, {5:[2, 6], 15:[2, 6], 17:[2, 6], 18:[2, 6], 19:[2, 6], 20:[2, 6], 21:[2, 6], 23:[2, 6], 24:[2, 6], 25:[2, 6], 26:[2, 6], 27:[2, 6], 28:[2, 6], 29:[2, 6], 30:[2, 6], 34:[2, 6], 36:[2, 6], 37:[2, 6], 38:[2, 6], 39:[2, 6], 40:[2, 6], 41:[2, 6]}, {5:[2, 7], 15:[2, 7], 17:[2, 7], 18:[2, 7], 19:[2, 7], 20:[2, 7], 21:[2, 7], 23:[2, 7], 24:[2, 7], 25:[2, 7], 26:[2, 7], 27:[2, 7], 28:[2, 7], 29:[2, 7], 30:[2, 
  7], 34:[2, 7], 36:[2, 7], 37:[2, 7], 38:[2, 7], 39:[2, 7], 40:[2, 7], 41:[2, 7]}, {5:[2, 8], 15:[2, 8], 17:[2, 8], 18:[2, 8], 19:[2, 8], 20:[2, 8], 21:[2, 8], 23:[2, 8], 24:[2, 8], 25:[2, 8], 26:[2, 8], 27:[2, 8], 28:[2, 8], 29:[2, 8], 30:[2, 8], 34:[2, 8], 36:[2, 8], 37:[2, 8], 38:[2, 8], 39:[2, 8], 40:[2, 8], 41:[2, 8]}, {5:[2, 9], 15:[2, 9], 17:[2, 9], 18:[2, 9], 19:[2, 9], 20:[2, 9], 21:[2, 9], 23:[2, 9], 24:[2, 9], 25:[2, 9], 26:[2, 9], 27:[2, 9], 28:[2, 9], 29:[2, 9], 30:[2, 9], 34:[2, 9], 
  36:[2, 9], 37:[2, 9], 38:[2, 9], 39:[2, 9], 40:[2, 9], 41:[2, 9]}, {6:36, 7:5, 8:6, 9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 15:[1, 25], 18:[1, 26], 20:[1, 27], 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 28], 40:[1, 29], 41:[1, 18]}, {6:37, 7:5, 8:6, 9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 15:[1, 25], 18:[1, 26], 20:[1, 27], 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 
  27:[1, 14], 28:[1, 22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 28], 40:[1, 29], 41:[1, 18]}, {6:38, 7:5, 8:6, 9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 15:[1, 25], 18:[1, 26], 20:[1, 27], 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 28], 40:[1, 29], 41:[1, 18]}, {6:39, 7:5, 8:6, 9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 
  15:[1, 25], 18:[1, 26], 20:[1, 27], 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 28], 40:[1, 29], 41:[1, 18]}, {6:42, 7:5, 8:6, 9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 15:[1, 25], 16:40, 18:[1, 26], 20:[1, 27], 22:41, 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 
  33], 39:[1, 28], 40:[1, 29], 41:[1, 18]}, {5:[2, 10], 15:[2, 10], 17:[2, 10], 18:[2, 10], 19:[2, 10], 20:[2, 10], 21:[2, 10], 23:[2, 10], 24:[2, 10], 25:[2, 10], 26:[2, 10], 27:[2, 10], 28:[2, 10], 29:[2, 10], 30:[2, 10], 34:[2, 10], 36:[2, 10], 37:[2, 10], 38:[2, 10], 39:[2, 10], 40:[2, 10], 41:[2, 10]}, {5:[2, 11], 15:[2, 11], 17:[2, 11], 18:[2, 11], 19:[2, 11], 20:[2, 11], 21:[2, 11], 23:[2, 11], 24:[2, 11], 25:[2, 11], 26:[2, 11], 27:[2, 11], 28:[2, 11], 29:[2, 11], 30:[2, 11], 34:[2, 11], 
  36:[2, 11], 37:[2, 11], 38:[2, 11], 39:[2, 11], 40:[2, 11], 41:[2, 11]}, {5:[2, 12], 15:[2, 12], 17:[2, 12], 18:[2, 12], 19:[2, 12], 20:[2, 12], 21:[2, 12], 23:[2, 12], 24:[2, 12], 25:[2, 12], 26:[2, 12], 27:[2, 12], 28:[2, 12], 29:[2, 12], 30:[2, 12], 34:[2, 12], 36:[2, 12], 37:[2, 12], 38:[2, 12], 39:[2, 12], 40:[2, 12], 41:[2, 12]}, {5:[2, 39], 15:[2, 39], 17:[2, 39], 18:[2, 39], 19:[2, 39], 20:[2, 39], 21:[2, 39], 23:[2, 39], 24:[2, 39], 25:[2, 39], 26:[2, 39], 27:[2, 39], 28:[2, 39], 29:[2, 
  39], 30:[2, 39], 34:[2, 39], 36:[2, 39], 37:[2, 39], 38:[2, 39], 39:[2, 39], 40:[2, 39], 41:[2, 39]}, {5:[2, 30], 15:[2, 30], 17:[2, 30], 18:[2, 30], 19:[2, 30], 20:[2, 30], 21:[2, 30], 23:[2, 30], 24:[2, 30], 25:[2, 30], 26:[2, 30], 27:[2, 30], 28:[2, 30], 29:[2, 30], 30:[2, 30], 34:[2, 30], 36:[2, 30], 37:[2, 30], 38:[2, 30], 39:[2, 30], 40:[2, 30], 41:[2, 30]}, {5:[2, 31], 15:[2, 31], 17:[2, 31], 18:[2, 31], 19:[2, 31], 20:[2, 31], 21:[2, 31], 23:[2, 31], 24:[2, 31], 25:[2, 31], 26:[2, 31], 
  27:[2, 31], 28:[2, 31], 29:[2, 31], 30:[2, 31], 34:[2, 31], 36:[2, 31], 37:[2, 31], 38:[2, 31], 39:[2, 31], 40:[2, 31], 41:[2, 31]}, {5:[2, 32], 15:[2, 32], 17:[2, 32], 18:[2, 32], 19:[2, 32], 20:[2, 32], 21:[2, 32], 23:[2, 32], 24:[2, 32], 25:[2, 32], 26:[2, 32], 27:[2, 32], 28:[2, 32], 29:[2, 32], 30:[2, 32], 34:[2, 32], 36:[2, 32], 37:[2, 32], 38:[2, 32], 39:[2, 32], 40:[2, 32], 41:[2, 32]}, {5:[2, 27], 15:[2, 27], 17:[2, 27], 18:[2, 27], 19:[2, 27], 20:[2, 27], 21:[2, 27], 23:[2, 27], 24:[2, 
  27], 25:[2, 27], 26:[2, 27], 27:[2, 27], 28:[2, 27], 29:[2, 27], 30:[2, 27], 34:[2, 27], 36:[2, 27], 37:[2, 27], 38:[2, 27], 39:[2, 27], 40:[2, 27], 41:[2, 27]}, {5:[2, 28], 15:[2, 28], 17:[2, 28], 18:[2, 28], 19:[2, 28], 20:[2, 28], 21:[2, 28], 23:[2, 28], 24:[2, 28], 25:[2, 28], 26:[2, 28], 27:[2, 28], 28:[2, 28], 29:[2, 28], 30:[2, 28], 34:[2, 28], 36:[2, 28], 37:[2, 28], 38:[2, 28], 39:[2, 28], 40:[2, 28], 41:[2, 28]}, {5:[2, 29], 15:[2, 29], 17:[2, 29], 18:[2, 29], 19:[2, 29], 20:[2, 29], 
  21:[2, 29], 23:[2, 29], 24:[2, 29], 25:[2, 29], 26:[2, 29], 27:[2, 29], 28:[2, 29], 29:[2, 29], 30:[2, 29], 34:[2, 29], 36:[2, 29], 37:[2, 29], 38:[2, 29], 39:[2, 29], 40:[2, 29], 41:[2, 29]}, {6:42, 7:5, 8:6, 9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 15:[1, 25], 16:43, 17:[1, 44], 18:[1, 26], 20:[1, 27], 22:41, 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 28], 40:[1, 29], 
  41:[1, 18]}, {6:42, 7:5, 8:6, 9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 15:[1, 25], 16:45, 18:[1, 26], 19:[1, 46], 20:[1, 27], 22:41, 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 28], 40:[1, 29], 41:[1, 18]}, {6:42, 7:5, 8:6, 9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 15:[1, 25], 16:47, 18:[1, 26], 20:[1, 27], 21:[1, 48], 22:41, 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 
  14], 28:[1, 22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 28], 40:[1, 29], 41:[1, 18]}, {5:[2, 37], 15:[2, 37], 17:[2, 37], 18:[2, 37], 19:[2, 37], 20:[2, 37], 21:[2, 37], 23:[2, 37], 24:[2, 37], 25:[2, 37], 26:[2, 37], 27:[2, 37], 28:[2, 37], 29:[2, 37], 30:[2, 37], 34:[2, 37], 36:[2, 37], 37:[2, 37], 38:[2, 37], 39:[2, 37], 40:[2, 37], 41:[2, 37]}, {9:49, 41:[1, 18]}, {35:[1, 50]}, {5:[2, 34], 15:[2, 34], 17:[2, 34], 18:[2, 34], 19:[2, 
  34], 20:[2, 34], 21:[2, 34], 23:[2, 34], 24:[2, 34], 25:[2, 34], 26:[2, 34], 27:[2, 34], 28:[2, 34], 29:[2, 34], 30:[2, 34], 34:[2, 34], 36:[2, 34], 37:[2, 34], 38:[2, 34], 39:[2, 34], 40:[2, 34], 41:[2, 34]}, {5:[2, 35], 15:[2, 35], 17:[2, 35], 18:[2, 35], 19:[2, 35], 20:[2, 35], 21:[2, 35], 23:[2, 35], 24:[2, 35], 25:[2, 35], 26:[2, 35], 27:[2, 35], 28:[2, 35], 29:[2, 35], 30:[2, 35], 34:[2, 35], 36:[2, 35], 37:[2, 35], 38:[2, 35], 39:[2, 35], 40:[2, 35], 41:[2, 35]}, {5:[2, 36], 15:[2, 36], 
  17:[2, 36], 18:[2, 36], 19:[2, 36], 20:[2, 36], 21:[2, 36], 23:[2, 36], 24:[2, 36], 25:[2, 36], 26:[2, 36], 27:[2, 36], 28:[2, 36], 29:[2, 36], 30:[2, 36], 34:[2, 36], 36:[2, 36], 37:[2, 36], 38:[2, 36], 39:[2, 36], 40:[2, 36], 41:[2, 36]}, {1:[2, 1]}, {5:[2, 3], 15:[2, 3], 18:[2, 3], 20:[2, 3], 23:[2, 3], 24:[2, 3], 25:[2, 3], 26:[2, 3], 27:[2, 3], 28:[2, 3], 29:[2, 3], 30:[2, 3], 34:[2, 3], 36:[2, 3], 37:[2, 3], 38:[2, 3], 39:[2, 3], 40:[2, 3], 41:[2, 3]}, {5:[2, 22], 15:[2, 22], 17:[2, 22], 
  18:[2, 22], 19:[2, 22], 20:[2, 22], 21:[2, 22], 23:[2, 22], 24:[2, 22], 25:[2, 22], 26:[2, 22], 27:[2, 22], 28:[2, 22], 29:[2, 22], 30:[2, 22], 34:[2, 22], 36:[2, 22], 37:[2, 22], 38:[2, 22], 39:[2, 22], 40:[2, 22], 41:[2, 22]}, {5:[2, 23], 15:[2, 23], 17:[2, 23], 18:[2, 23], 19:[2, 23], 20:[2, 23], 21:[2, 23], 23:[2, 23], 24:[2, 23], 25:[2, 23], 26:[2, 23], 27:[2, 23], 28:[2, 23], 29:[2, 23], 30:[2, 23], 34:[2, 23], 36:[2, 23], 37:[2, 23], 38:[2, 23], 39:[2, 23], 40:[2, 23], 41:[2, 23]}, {5:[2, 
  24], 15:[2, 24], 17:[2, 24], 18:[2, 24], 19:[2, 24], 20:[2, 24], 21:[2, 24], 23:[2, 24], 24:[2, 24], 25:[2, 24], 26:[2, 24], 27:[2, 24], 28:[2, 24], 29:[2, 24], 30:[2, 24], 34:[2, 24], 36:[2, 24], 37:[2, 24], 38:[2, 24], 39:[2, 24], 40:[2, 24], 41:[2, 24]}, {5:[2, 25], 15:[2, 25], 17:[2, 25], 18:[2, 25], 19:[2, 25], 20:[2, 25], 21:[2, 25], 23:[2, 25], 24:[2, 25], 25:[2, 25], 26:[2, 25], 27:[2, 25], 28:[2, 25], 29:[2, 25], 30:[2, 25], 34:[2, 25], 36:[2, 25], 37:[2, 25], 38:[2, 25], 39:[2, 25], 40:[2, 
  25], 41:[2, 25]}, {6:42, 7:5, 8:6, 9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 15:[1, 25], 17:[1, 51], 18:[1, 26], 20:[1, 27], 22:52, 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 28], 40:[1, 29], 41:[1, 18]}, {15:[2, 19], 17:[2, 19], 18:[2, 19], 19:[2, 19], 20:[2, 19], 21:[2, 19], 23:[2, 19], 24:[2, 19], 25:[2, 19], 26:[2, 19], 27:[2, 19], 28:[2, 19], 29:[2, 19], 30:[2, 19], 
  34:[2, 19], 36:[2, 19], 37:[2, 19], 38:[2, 19], 39:[2, 19], 40:[2, 19], 41:[2, 19]}, {15:[2, 21], 17:[2, 21], 18:[2, 21], 19:[2, 21], 20:[2, 21], 21:[2, 21], 23:[2, 21], 24:[2, 21], 25:[2, 21], 26:[2, 21], 27:[2, 21], 28:[2, 21], 29:[2, 21], 30:[2, 21], 34:[2, 21], 36:[2, 21], 37:[2, 21], 38:[2, 21], 39:[2, 21], 40:[2, 21], 41:[2, 21]}, {6:42, 7:5, 8:6, 9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 15:[1, 25], 17:[1, 53], 18:[1, 26], 20:[1, 27], 22:52, 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 
  14], 28:[1, 22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 28], 40:[1, 29], 41:[1, 18]}, {5:[2, 14], 15:[2, 14], 17:[2, 14], 18:[2, 14], 19:[2, 14], 20:[2, 14], 21:[2, 14], 23:[2, 14], 24:[2, 14], 25:[2, 14], 26:[2, 14], 27:[2, 14], 28:[2, 14], 29:[2, 14], 30:[2, 14], 34:[2, 14], 36:[2, 14], 37:[2, 14], 38:[2, 14], 39:[2, 14], 40:[2, 14], 41:[2, 14]}, {6:42, 7:5, 8:6, 9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 15:[1, 25], 18:[1, 26], 19:[1, 54], 
  20:[1, 27], 22:52, 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 28], 40:[1, 29], 41:[1, 18]}, {5:[2, 16], 15:[2, 16], 17:[2, 16], 18:[2, 16], 19:[2, 16], 20:[2, 16], 21:[2, 16], 23:[2, 16], 24:[2, 16], 25:[2, 16], 26:[2, 16], 27:[2, 16], 28:[2, 16], 29:[2, 16], 30:[2, 16], 34:[2, 16], 36:[2, 16], 37:[2, 16], 38:[2, 16], 39:[2, 16], 40:[2, 16], 41:[2, 16]}, {6:42, 7:5, 8:6, 
  9:7, 10:8, 11:9, 12:15, 13:16, 14:17, 15:[1, 25], 18:[1, 26], 20:[1, 27], 21:[1, 55], 22:52, 23:[1, 10], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 22], 29:[1, 23], 30:[1, 24], 31:19, 32:20, 33:21, 34:[1, 30], 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 28], 40:[1, 29], 41:[1, 18]}, {5:[2, 18], 15:[2, 18], 17:[2, 18], 18:[2, 18], 19:[2, 18], 20:[2, 18], 21:[2, 18], 23:[2, 18], 24:[2, 18], 25:[2, 18], 26:[2, 18], 27:[2, 18], 28:[2, 18], 29:[2, 18], 30:[2, 18], 34:[2, 18], 36:[2, 18], 
  37:[2, 18], 38:[2, 18], 39:[2, 18], 40:[2, 18], 41:[2, 18]}, {5:[2, 38], 15:[2, 38], 17:[2, 38], 18:[2, 38], 19:[2, 38], 20:[2, 38], 21:[2, 38], 23:[2, 38], 24:[2, 38], 25:[2, 38], 26:[2, 38], 27:[2, 38], 28:[2, 38], 29:[2, 38], 30:[2, 38], 34:[2, 38], 36:[2, 38], 37:[2, 38], 38:[2, 38], 39:[2, 38], 40:[2, 38], 41:[2, 38]}, {5:[2, 33], 15:[2, 33], 17:[2, 33], 18:[2, 33], 19:[2, 33], 20:[2, 33], 21:[2, 33], 23:[2, 33], 24:[2, 33], 25:[2, 33], 26:[2, 33], 27:[2, 33], 28:[2, 33], 29:[2, 33], 30:[2, 
  33], 34:[2, 33], 36:[2, 33], 37:[2, 33], 38:[2, 33], 39:[2, 33], 40:[2, 33], 41:[2, 33]}, {5:[2, 26], 15:[2, 26], 17:[2, 26], 18:[2, 26], 19:[2, 26], 20:[2, 26], 21:[2, 26], 23:[2, 26], 24:[2, 26], 25:[2, 26], 26:[2, 26], 27:[2, 26], 28:[2, 26], 29:[2, 26], 30:[2, 26], 34:[2, 26], 36:[2, 26], 37:[2, 26], 38:[2, 26], 39:[2, 26], 40:[2, 26], 41:[2, 26]}, {15:[2, 20], 17:[2, 20], 18:[2, 20], 19:[2, 20], 20:[2, 20], 21:[2, 20], 23:[2, 20], 24:[2, 20], 25:[2, 20], 26:[2, 20], 27:[2, 20], 28:[2, 20], 
  29:[2, 20], 30:[2, 20], 34:[2, 20], 36:[2, 20], 37:[2, 20], 38:[2, 20], 39:[2, 20], 40:[2, 20], 41:[2, 20]}, {5:[2, 13], 15:[2, 13], 17:[2, 13], 18:[2, 13], 19:[2, 13], 20:[2, 13], 21:[2, 13], 23:[2, 13], 24:[2, 13], 25:[2, 13], 26:[2, 13], 27:[2, 13], 28:[2, 13], 29:[2, 13], 30:[2, 13], 34:[2, 13], 36:[2, 13], 37:[2, 13], 38:[2, 13], 39:[2, 13], 40:[2, 13], 41:[2, 13]}, {5:[2, 15], 15:[2, 15], 17:[2, 15], 18:[2, 15], 19:[2, 15], 20:[2, 15], 21:[2, 15], 23:[2, 15], 24:[2, 15], 25:[2, 15], 26:[2, 
  15], 27:[2, 15], 28:[2, 15], 29:[2, 15], 30:[2, 15], 34:[2, 15], 36:[2, 15], 37:[2, 15], 38:[2, 15], 39:[2, 15], 40:[2, 15], 41:[2, 15]}, {5:[2, 17], 15:[2, 17], 17:[2, 17], 18:[2, 17], 19:[2, 17], 20:[2, 17], 21:[2, 17], 23:[2, 17], 24:[2, 17], 25:[2, 17], 26:[2, 17], 27:[2, 17], 28:[2, 17], 29:[2, 17], 30:[2, 17], 34:[2, 17], 36:[2, 17], 37:[2, 17], 38:[2, 17], 39:[2, 17], 40:[2, 17], 41:[2, 17]}], defaultActions:{3:[2, 2], 34:[2, 1]}, parseError:function parseError(str, hash) {
    throw new Error(str);
  }, parse:function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if(typeof this.lexer.yylloc == "undefined") {
      this.lexer.yylloc = {}
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    if(typeof this.yy.parseError === "function") {
      this.parseError = this.yy.parseError
    }
    function popStack(n) {
      stack.length = stack.length - 2 * n;
      vstack.length = vstack.length - n;
      lstack.length = lstack.length - n
    }
    function lex() {
      var token;
      token = self.lexer.lex() || 1;
      if(typeof token !== "number") {
        token = self.symbols_[token] || token
      }
      return token
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while(true) {
      state = stack[stack.length - 1];
      if(this.defaultActions[state]) {
        action = this.defaultActions[state]
      }else {
        if(symbol == null) {
          symbol = lex()
        }
        action = table[state] && table[state][symbol]
      }
      _handle_error:if(typeof action === "undefined" || !action.length || !action[0]) {
        if(!recovering) {
          expected = [];
          for(p in table[state]) {
            if(this.terminals_[p] && p > 2) {
              expected.push("'" + this.terminals_[p] + "'")
            }
          }
          var errStr = "";
          if(this.lexer.showPosition) {
            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + this.terminals_[symbol] + "'"
          }else {
            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'")
          }
          this.parseError(errStr, {text:this.lexer.match, token:this.terminals_[symbol] || symbol, line:this.lexer.yylineno, loc:yyloc, expected:expected})
        }
        if(recovering == 3) {
          if(symbol == EOF) {
            throw new Error(errStr || "Parsing halted.");
          }
          yyleng = this.lexer.yyleng;
          yytext = this.lexer.yytext;
          yylineno = this.lexer.yylineno;
          yyloc = this.lexer.yylloc;
          symbol = lex()
        }
        while(1) {
          if(TERROR.toString() in table[state]) {
            break
          }
          if(state == 0) {
            throw new Error(errStr || "Parsing halted.");
          }
          popStack(1);
          state = stack[stack.length - 1]
        }
        preErrorSymbol = symbol;
        symbol = TERROR;
        state = stack[stack.length - 1];
        action = table[state] && table[state][TERROR];
        recovering = 3
      }
      if(action[0] instanceof Array && action.length > 1) {
        throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
      }
      switch(action[0]) {
        case 1:
          stack.push(symbol);
          vstack.push(this.lexer.yytext);
          lstack.push(this.lexer.yylloc);
          stack.push(action[1]);
          symbol = null;
          if(!preErrorSymbol) {
            yyleng = this.lexer.yyleng;
            yytext = this.lexer.yytext;
            yylineno = this.lexer.yylineno;
            yyloc = this.lexer.yylloc;
            if(recovering > 0) {
              recovering--
            }
          }else {
            symbol = preErrorSymbol;
            preErrorSymbol = null
          }
          break;
        case 2:
          len = this.productions_[action[1]][1];
          yyval.$ = vstack[vstack.length - len];
          yyval._$ = {first_line:lstack[lstack.length - (len || 1)].first_line, last_line:lstack[lstack.length - 1].last_line, first_column:lstack[lstack.length - (len || 1)].first_column, last_column:lstack[lstack.length - 1].last_column};
          r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
          if(typeof r !== "undefined") {
            return r
          }
          if(len) {
            stack = stack.slice(0, -1 * len * 2);
            vstack = vstack.slice(0, -1 * len);
            lstack = lstack.slice(0, -1 * len)
          }
          stack.push(this.productions_[action[1]][0]);
          vstack.push(yyval.$);
          lstack.push(yyval._$);
          newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
          stack.push(newState);
          break;
        case 3:
          return true
      }
    }
    return true
  }};
  var lexer = function() {
    var lexer = {EOF:1, parseError:function parseError(str, hash) {
      if(this.yy.parseError) {
        this.yy.parseError(str, hash)
      }else {
        throw new Error(str);
      }
    }, setInput:function(input) {
      this._input = input;
      this._more = this._less = this.done = false;
      this.yylineno = this.yyleng = 0;
      this.yytext = this.matched = this.match = "";
      this.conditionStack = ["INITIAL"];
      this.yylloc = {first_line:1, first_column:0, last_line:1, last_column:0};
      return this
    }, input:function() {
      var ch = this._input[0];
      this.yytext += ch;
      this.yyleng++;
      this.match += ch;
      this.matched += ch;
      var lines = ch.match(/\n/);
      if(lines) {
        this.yylineno++
      }
      this._input = this._input.slice(1);
      return ch
    }, unput:function(ch) {
      this._input = ch + this._input;
      return this
    }, more:function() {
      this._more = true;
      return this
    }, pastInput:function() {
      var past = this.matched.substr(0, this.matched.length - this.match.length);
      return(past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "")
    }, upcomingInput:function() {
      var next = this.match;
      if(next.length < 20) {
        next += this._input.substr(0, 20 - next.length)
      }
      return(next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "")
    }, showPosition:function() {
      var pre = this.pastInput();
      var c = (new Array(pre.length + 1)).join("-");
      return pre + this.upcomingInput() + "\n" + c + "^"
    }, next:function() {
      if(this.done) {
        return this.EOF
      }
      if(!this._input) {
        this.done = true
      }
      var token, match, col, lines;
      if(!this._more) {
        this.yytext = "";
        this.match = ""
      }
      var rules = this._currentRules();
      for(var i = 0;i < rules.length;i++) {
        match = this._input.match(this.rules[rules[i]]);
        if(match) {
          lines = match[0].match(/\n.*/g);
          if(lines) {
            this.yylineno += lines.length
          }
          this.yylloc = {first_line:this.yylloc.last_line, last_line:this.yylineno + 1, first_column:this.yylloc.last_column, last_column:lines ? lines[lines.length - 1].length - 1 : this.yylloc.last_column + match[0].length};
          this.yytext += match[0];
          this.match += match[0];
          this.matches = match;
          this.yyleng = this.yytext.length;
          this._more = false;
          this._input = this._input.slice(match[0].length);
          this.matched += match[0];
          token = this.performAction.call(this, this.yy, this, rules[i], this.conditionStack[this.conditionStack.length - 1]);
          if(token) {
            return token
          }else {
            return
          }
        }
      }
      if(this._input === "") {
        return this.EOF
      }else {
        this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {text:"", token:null, line:this.yylineno})
      }
    }, lex:function lex() {
      var r = this.next();
      if(typeof r !== "undefined") {
        return r
      }else {
        return this.lex()
      }
    }, begin:function begin(condition) {
      this.conditionStack.push(condition)
    }, popState:function popState() {
      return this.conditionStack.pop()
    }, _currentRules:function _currentRules() {
      return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
    }, topState:function() {
      return this.conditionStack[this.conditionStack.length - 2]
    }, pushState:function begin(condition) {
      this.begin(condition)
    }};
    lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
      var YYSTATE = YY_START;
      switch($avoiding_name_collisions) {
        case 0:
          break;
        case 1:
          break;
        case 2:
          this.begin("string");
          this.string_buffer = "";
          break;
        case 3:
          this.popState();
          yy_.yytext = this.string_buffer;
          return 39;
          break;
        case 4:
          this.string_buffer = yy_.yytext;
          break;
        case 5:
          this.begin("regex");
          break;
        case 6:
          this.popState();
          return 35;
          break;
        case 7:
          return 34;
          break;
        case 8:
          return 37;
          break;
        case 9:
          return 38;
          break;
        case 10:
          return 36;
          break;
        case 11:
          return 28;
          break;
        case 12:
          return 29;
          break;
        case 13:
          return 30;
          break;
        case 14:
          return 15;
          break;
        case 15:
          return 17;
          break;
        case 16:
          return 18;
          break;
        case 17:
          return 19;
          break;
        case 18:
          return 20;
          break;
        case 19:
          return 21;
          break;
        case 20:
          return 25;
          break;
        case 21:
          return 23;
          break;
        case 22:
          return 24;
          break;
        case 23:
          return 26;
          break;
        case 24:
          return 27;
          break;
        case 25:
          return 40;
          break;
        case 26:
          return 41;
          break;
        case 27:
          return 5;
          break;
        case 28:
          return"INVALID";
          break
      }
    };
    lexer.rules = [/^;.*/, /^\s+/, /^"/, /^"/, /^(\\"|[^"])*/, /^#\//, /^\/[a-zA-Z]*/, /^(\\\/|[^\/])*/, /^[\+\-]?\d*\.\d+/, /^\d{1,2}#[\+\-]?\w+/, /^[\+\-]?\d+/, /^#(n|N)/, /^#(t|T)/, /^#(f|F)/, /^\(/, /^\)/, /^\[/, /^\]/, /^\{/, /^\}/, /^~/, /^'/, /^`/, /^\.\.\./, /^#\(/, /^:/, /^[\w@#\.:!\$%\^&\*\-\+='"\?\|\/\\<>,]+/, /^$/, /^./];
    lexer.conditions = {"string":{"rules":[3, 4], "inclusive":false}, "regex":{"rules":[6, 7], "inclusive":false}, "INITIAL":{"rules":[0, 1, 2, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28], "inclusive":true}};
    return lexer
  }();
  parser.lexer = lexer;
  return parser
}();
if(typeof require !== "undefined" && typeof exports !== "undefined") {
  exports.parser = parser;
  exports.parse = function() {
    return parser.parse.apply(parser, arguments)
  };
  exports.main = function commonjsMain(args) {
    if(!args[1]) {
      throw new Error("Usage: " + args[0] + " FILE");
    }
    if(typeof process !== "undefined") {
      var source = require("fs").readFileSync(require("path").join(process.cwd(), args[1]), "utf8")
    }else {
      var cwd = require("file").path(require("file").cwd());
      var source = cwd.join(args[1]).read({charset:"utf-8"})
    }
    return exports.parser.parse(source)
  };
  if(typeof module !== "undefined" && require.main === module) {
    exports.main(typeof process !== "undefined" ? process.argv.slice(1) : require("system").args)
  }
}
;
