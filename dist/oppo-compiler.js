(function() {
  var INDENT, JS_ILLEGAL_IDENTIFIER_CHARS, JS_KEYWORDS, WRAPPER_PREFIX, WRAPPER_REGEX, WRAPPER_SUFFIX, call_macro, char_wrapper, clone, compile, compile_list, indent_down, indent_up, last, macro, macro_do, macro_if, macro_let, map, newline, newline_down, newline_up, pop_scope, push_scope, read, root, scope_stack, to_js_identifier, trim, type_of, types, wrapper, __toString, _ref, _ref2,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  JS_KEYWORDS = ["break", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for", "function", "if", "implements", "import", "in", "instanceof", "interface", "let", "new", "null", "package", "private", "protected", "public", "return", "static", "switch", "super", "this", "throw", "true", "try", "typeof", "undefined", "var", "void", "while", "with", "yield"];

  JS_ILLEGAL_IDENTIFIER_CHARS = {
    "~": "tilde",
    "`": "backtick",
    "!": "exclamationmark",
    "@": "at",
    "#": "pound",
    "%": "percent",
    "^": "carat",
    "&": "amperstand",
    "*": "asterisk",
    "(": "leftparen",
    ")": "rightparen",
    "-": "dash",
    "+": "plus",
    "=": "equals",
    "{": "leftcurly",
    "}": "rightcurly",
    "[": "leftsquare",
    "]": "rightsquare",
    "|": "pipe",
    "\\": "backslash",
    "\"": "doublequote",
    "'": "singlequote",
    ":": "colon",
    ";": "semicolon",
    "<": "leftangle",
    ">": "rightangle",
    ",": "comma",
    ".": "period",
    "?": "questionmark",
    "/": "forwardslash",
    " ": "space",
    "\t": "tab",
    "\n": "newline",
    "\r": "carriagereturn"
  };

  WRAPPER_PREFIX = "_$";

  WRAPPER_SUFFIX = "_";

  WRAPPER_REGEX = /_\$[^_]+_/g;

  wrapper = function(text) {
    return "" + WRAPPER_PREFIX + text + WRAPPER_SUFFIX;
  };

  char_wrapper = function(_char) {
    var txt, _ref;
    txt = (_ref = JS_ILLEGAL_IDENTIFIER_CHARS[_char]) != null ? _ref : "ASCII_" + (_char.charCodeAt(0));
    return wrapper(txt);
  };

  to_js_identifier = function(text) {
    if ((JS_KEYWORDS.indexOf(text)) >= 0) return wrapper(text);
    if (text.length === 0) return wrapper("null");
    return ((text.replace(WRAPPER_REGEX, wrapper)).replace(/^\d/, char_wrapper)).replace(/[^\w\$]/g, char_wrapper);
  };

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = to_js_identifier;
  } else if (typeof ender !== "undefined" && ender !== null) {
    ender.ender({
      to_js_identifier: to_js_identifier
    });
  } else {
    this.to_js_identifier = to_js_identifier;
  }

  root = typeof global !== "undefined" && global !== null ? global : window;

  root.oppo = {
    compiler: {
      types: {},
      scope_stack: [{}]
    }
  };

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = oppo;
  }

  _ref = oppo.compiler, scope_stack = _ref.scope_stack, types = _ref.types;

  oppo.Error = (function(_super) {

    __extends(Error, _super);

    function Error(name, message) {
      this.name = name;
      this.message = message;
    }

    Error.prototype.toString = function() {
      return "" + this.name + ": " + this.message;
    };

    return Error;

  })(Error);

  oppo.ArityException = (function(_super) {

    __extends(ArityException, _super);

    function ArityException(message) {
      if (message != null) this.message = message;
    }

    ArityException.prototype.name = "Arity-Exception";

    ArityException.prototype.message = "Wrong number of arguments";

    return ArityException;

  })(oppo.Error);

  __toString = Object.prototype.toString;

  type_of = function(x) {
    return __toString.call(x).slice(8, -1).toLowerCase();
  };

  clone = (_ref2 = Object.create) != null ? _ref2 : function(o) {
    function ObjectClone () {};    ObjectClone.prototype = o;
    return new ObjectClone();
  };

  last = function(list) {
    if ((list != null ? list.length : void 0) != null) {
      return list[list.length - 1];
    }
  };

  map = function(list, fn) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      _results.push(fn(item));
    }
    return _results;
  };

  compile_list = function(list, arg) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      _results.push(item.compile(arg));
    }
    return _results;
  };

  trim = String.prototype.trim || function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  };

  push_scope = function() {
    var new_scope, scope;
    scope = last(scope_stack);
    new_scope = clone(scope);
    scope_stack.push(new_scope);
    return new_scope;
  };

  pop_scope = function() {
    return scope_stack.pop();
  };

  INDENT = "";

  indent_up = function() {
    return INDENT = "" + INDENT + "  ";
  };

  indent_down = function() {
    return INDENT = INDENT.substr(2);
  };

  newline = function() {
    return "\n" + INDENT;
  };

  newline_down = function() {
    return "\n" + (indent_down());
  };

  newline_up = function() {
    return "\n" + (indent_up());
  };

  (function() {
    this.SyntaxNode = (function() {

      function SyntaxNode(value, yy_or_node_or_num) {
        var _ref3;
        this.value = value;
        if (yy_or_node_or_num instanceof types.SyntaxNode) {
          this.transfer_node = yy_or_node_or_num;
          this.yy = yy_or_node_or_num.yy;
        } else if ((type_of(yy_or_node_or_num)) === "number") {
          this.yy = {
            lexer: {
              yylineno: yy_or_node_or_num
            }
          };
        } else {
          this.yy = yy_or_node_or_num;
        }
        this.line_number = (_ref3 = this.yy) != null ? _ref3.lexer.yylineno : void 0;
      }

      SyntaxNode.prototype.cache = {};

      SyntaxNode.prototype.compile = function(quoted) {
        if (quoted == null) quoted = this.quoted;
        if ((type_of(this._compile)) === "function") {
          return this.cache["_compile"] || this._compile();
        } else if (!quoted) {
          return this.cache["compile_unquoted"] || this.compile_unquoted();
        } else {
          return this.cache["compile_quoted"] || this.compile_quoted();
        }
      };

      SyntaxNode.prototype.compile_unquoted = function() {
        return "" + this.value;
      };

      SyntaxNode.prototype.compile_quoted = function() {
        return "new oppo.compiler.types." + this.constructor.name + "('" + this.value + "')";
      };

      SyntaxNode.prototype.location_trace = function() {
        var file, line_number;
        line_number = this.line_number ? "@ line " + this.line_number : '';
        file = this.file ? " in " + this.file : '';
        return "" + line_number + file;
      };

      SyntaxNode.prototype.error_message = function(type, msg) {
        var full_msg, msg_prefix;
        if (arguments.length === 1) msg = type;
        if (msg == null) msg = "An error occurred";
        msg.replace(/\.$/, '');
        msg_prefix = "" + (type != null ? type : this.constructor.name) + "Error: ";
        return full_msg = "" + msg_prefix + msg + (this.location_trace()) + ".";
      };

      SyntaxNode.prototype.error = function(type, msg) {
        throw this.error_message(type, msg);
      };

      SyntaxNode.prototype.valueOf = function() {
        return this.value;
      };

      SyntaxNode.prototype.toString = function() {
        var prefix;
        prefix = this.quoted ? "'" : "";
        return "" + prefix + (this.value.toString());
      };

      return SyntaxNode;

    })();
    this.List = (function(_super) {

      __extends(List, _super);

      function List() {
        List.__super__.constructor.apply(this, arguments);
      }

      List.prototype.compile_unquoted = function() {
        var scope, _ref3;
        scope = last(scope_stack);
        return (_ref3 = scope.call).invoke.apply(_ref3, this.value);
      };

      List.prototype.compile_quoted = function() {
        var c_value;
        c_value = compile_list(this.value, true);
        return "[" + (c_value.join(', ')) + "]";
      };

      List.prototype.toString = function() {
        var item, prefix, s_value;
        s_value = (function() {
          var _i, _len, _ref3, _results;
          _ref3 = this.value;
          _results = [];
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            item = _ref3[_i];
            _results.push(item.toString());
          }
          return _results;
        }).call(this);
        prefix = this.quoted ? "'" : "";
        return "" + prefix + "(" + (s_value.join(' ')) + ")";
      };

      return List;

    })(this.SyntaxNode);
    this.Quoted = (function(_super) {

      __extends(Quoted, _super);

      function Quoted(value, yy) {
        Quoted.__super__.constructor.call(this, null, yy);
        value.quoted = true;
        this.value = [new types.Symbol("quote", yy), value];
        this.quoted_value = value;
      }

      return Quoted;

    })(this.List);
    this.Object = (function(_super) {

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
        for (i = 0, _len = _ref3.length; i < _len; i++) {
          item = _ref3[i];
          if (i % 2 === 0) {
            if (item instanceof types.Symbol && !item.quoted) {
              this.dynamic_keys.push(item);
              values = this.dynamic_values;
            } else {
              this.static_keys.push(item);
              values = this.static_values;
            }
          } else {
            values.push(item);
          }
        }
        delete this.value;
        if ((this.static_keys.length !== this.static_values.length) || (this.dynamic_keys.length !== this.dynamic_values.length)) {
          this.error("Cannot make an object with an odd number of items.");
        }
      }

      Object.prototype._compile = function() {
        var c_key, c_tmp_var, c_value, dynamic_body, i, item, literal_body, object, object_definition, scope, tmp_var;
        literal_body = (function() {
          var _len, _ref3, _results;
          _ref3 = this.static_keys;
          _results = [];
          for (i = 0, _len = _ref3.length; i < _len; i++) {
            item = _ref3[i];
            if (item instanceof types.Quoted) {
              c_key = item.value[1].compile(false);
            } else {
              c_key = item.compile(false);
            }
            c_value = this.static_values[i].compile();
            _results.push("" + c_key + ": " + c_value);
          }
          return _results;
        }).call(this);
        if (literal_body.length) {
          object = "{" + (newline_up()) + (literal_body.join(',' + newline())) + (newline_down()) + "}";
        } else {
          object = "{}";
        }
        if (this.dynamic_keys.length) {
          tmp_var = types.Symbol.gensym("obj");
          c_tmp_var = tmp_var.compile();
          scope = last(scope_stack);
          object_definition = scope.def.invoke(tmp_var, new types.List([new types.Symbol("js-eval"), object]));
          dynamic_body = (function() {
            var _len, _ref3, _results;
            _ref3 = this.dynamic_keys;
            _results = [];
            for (i = 0, _len = _ref3.length; i < _len; i++) {
              item = _ref3[i];
              c_key = item.compile();
              c_value = this.dynamic_values[i].compile();
              _results.push("" + c_tmp_var + "[" + c_key + "] = " + c_value);
            }
            return _results;
          }).call(this);
          object = "(" + object_definition + "," + (newline()) + (dynamic_body.join(',' + newline())) + "," + (newline()) + c_tmp_var + ")";
        }
        return object;
      };

      return Object;

    })(this.SyntaxNode);
    this.Number = (function(_super) {

      __extends(Number, _super);

      function Number() {
        Number.__super__.constructor.apply(this, arguments);
      }

      Number.prototype._compile = function() {
        return this.value;
      };

      return Number;

    })(this.SyntaxNode);
    this.Fixnum = (function(_super) {

      __extends(Fixnum, _super);

      function Fixnum() {
        Fixnum.__super__.constructor.apply(this, arguments);
      }

      return Fixnum;

    })(this.Number);
    this.Float = (function(_super) {

      __extends(Float, _super);

      function Float() {
        Float.__super__.constructor.apply(this, arguments);
      }

      return Float;

    })(this.Number);
    this.String = (function(_super) {

      __extends(String, _super);

      function String() {
        String.__super__.constructor.apply(this, arguments);
      }

      String.prototype._compile = function() {
        var val;
        val = this.value instanceof types.Symbol ? this.value.compile() : this.value;
        return "\"" + (val.replace(/\n/g, '\\n')) + "\"";
      };

      return String;

    })(this.SyntaxNode);
    this.Regex = (function(_super) {

      __extends(Regex, _super);

      function Regex(body, flags, yy) {
        this.body = body;
        this.flags = flags;
        Regex.__super__.constructor.call(this, null, yy);
      }

      Regex.prototype.compile_unquoted = function() {
        return "/" + this.body + "/" + this.flags;
      };

      return Regex;

    })(this.SyntaxNode);
    this.Atom = (function(_super) {

      __extends(Atom, _super);

      function Atom(yy) {
        Atom.__super__.constructor.call(this, this.value, yy);
      }

      return Atom;

    })(this.SyntaxNode);
    this.Nil = (function(_super) {

      __extends(Nil, _super);

      function Nil() {
        Nil.__super__.constructor.apply(this, arguments);
      }

      Nil.prototype.value = null;

      return Nil;

    })(this.Atom);
    this.Boolean = (function(_super) {

      __extends(Boolean, _super);

      function Boolean() {
        Boolean.__super__.constructor.apply(this, arguments);
      }

      return Boolean;

    })(this.Atom);
    this.True = (function(_super) {

      __extends(True, _super);

      function True() {
        True.__super__.constructor.apply(this, arguments);
      }

      True.prototype.value = true;

      True.prototype.toString = function() {
        return '#t';
      };

      return True;

    })(this.Boolean);
    this.False = (function(_super) {

      __extends(False, _super);

      function False() {
        False.__super__.constructor.apply(this, arguments);
      }

      False.prototype.value = false;

      False.prototype.toString = function() {
        return '#f';
      };

      return False;

    })(this.Boolean);
    this.Symbol = (function(_super) {

      __extends(Symbol, _super);

      function Symbol(value, yy) {
        Symbol.__super__.constructor.apply(this, arguments);
        if ((this.value.substr(0, 3)) === "...") {
          this.splat = true;
          this.value = this.value.substr(3);
        }
      }

      Symbol.prototype.compile_unquoted = function() {
        var val;
        val = this.value.length > 1 ? this.value.replace(/\-/g, "_") : this.value;
        return to_js_identifier(val);
      };

      Symbol.gensym = function(sym) {
        var random, s_sym, symbol, time;
        if (sym instanceof types.Symbol) {
          s_sym = sym.value;
          symbol = sym;
        } else if ((type_of(sym)) === "string") {
          s_sym = sym;
        } else {
          s_sym = "gen";
        }
        time = (+new Date()).toString(36);
        random = (Math.floor(Math.random() * 100000)).toString(36);
        s_sym = "" + s_sym + "-" + time + "-" + random;
        return new types.Symbol(s_sym, symbol);
      };

      return Symbol;

    })(this.SyntaxNode);
    this.Function = (function(_super) {

      __extends(Function, _super);

      function Function(name, args, body, yy) {
        var arg, i, _len;
        this.name = name;
        this.args = args;
        this.body = body;
        Function.__super__.constructor.call(this, null, yy);
        if (this.args) {
          this.min_arity = this.max_arity = this.args.length;
          for (i = 0, _len = args.length; i < _len; i++) {
            arg = args[i];
            if (arg.splat) {
              this.min_arity = i;
              this.max_arity = Infinity;
              break;
            }
          }
        } else {
          this.min_arity = 0;
          this.max_arity = Infinity;
        }
      }

      Function.prototype.compile_unquoted = function() {
        var body, c_args, c_body, c_name, code, error_name, result, tail_recursive, temp_result, v_length, _ref3, _ref4;
        indent_up();
        c_name = (_ref3 = (_ref4 = this.name) != null ? _ref4.compile() : void 0) != null ? _ref3 : '';
        if (this.args != null) {
          c_args = compile_list(this.args);
        } else {
          c_args = [];
        }
        this.cached_compiled_args = c_args;
        body = this.body;
        body = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = body.length; _i < _len; _i++) {
            code = body[_i];
            _results.push(types.Macro.transform(code));
          }
          return _results;
        })();
        tail_recursive = this.transform_tail_recursive(last(body));
        c_body = compile_list(this.body);
        v_length = (types.Symbol.gensym("argslen")).compile();
        error_name = c_name ? " in '" + c_name + "': " : "";
        if (tail_recursive) {
          indent_up();
          c_body = compile_list(this.body);
          c_body = c_body.join("," + (newline()));
          temp_result = (types.Symbol.gensym("result")).compile();
          c_body = "while (true) {\n" + INDENT + "var " + this.temp_continue + " = false;\n" + INDENT + "var " + temp_result + " = (" + c_body + ");\n\n" + INDENT + "if (!" + this.temp_continue + ") {\n" + (indent_up()) + "return " + temp_result + ";\n" + (indent_down()) + "}\n" + (indent_down()) + "}";
        } else {
          c_body = compile_list(this.body);
          c_body = "return (" + (c_body.join("," + newline())) + ");";
        }
        result = "function " + c_name + "(" + (c_args.join(', ')) + ") {\n" + INDENT + c_body + "\n}";
        indent_down();
        return result;
      };

      Function.prototype.transform_tail_recursive = function(code) {
        var arg, c_passed_arg, callable, callable_value, emulated_call, i, index, result, scope, temp_args_assignments, temp_args_to_real_args, tmp, _len, _ref3, _ref4;
        scope = last(scope_stack);
        if ((!code.quoted) && (code instanceof types.List)) {
          callable = code.value[0];
          if (callable instanceof types.Symbol) {
            callable_value = callable.value;
            if (((_ref3 = this.name) != null ? _ref3.value : void 0) === callable_value) {
              if (!this.temp_args) {
                this.temp_args = (function() {
                  var _i, _len, _ref4, _results;
                  _ref4 = this.args;
                  _results = [];
                  for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
                    arg = _ref4[_i];
                    _results.push((types.Symbol.gensym(arg)).compile());
                  }
                  return _results;
                }).call(this);
                this.temp_continue = (types.Symbol.gensym("continue")).compile();
              }
              temp_args_assignments = [];
              temp_args_to_real_args = [];
              _ref4 = this.temp_args;
              for (i = 0, _len = _ref4.length; i < _len; i++) {
                tmp = _ref4[i];
                index = i + 1;
                c_passed_arg = code.value[index].compile();
                temp_args_assignments.push("" + tmp + " = " + c_passed_arg);
                temp_args_to_real_args.push("" + this.cached_compiled_args[i] + " = " + tmp);
              }
              emulated_call = __slice.call(temp_args_assignments).concat(__slice.call(temp_args_to_real_args), ["" + this.temp_continue + " = true"]);
              code._compile = function() {
                return "(" + (emulated_call.join(',' + newline())) + ")";
              };
              return true;
            } else if (callable_value === macro_do.name || callable_value === macro_let.name) {
              return this.transform_tail_recursive(last(code));
            } else if (callable_value === macro_if.value) {
              result = this.transform_tail_recursive(code[2]);
              result || (result = this.transform_tail_recursive(code[3]));
              return result;
            }
          }
        }
        return false;
      };

      return Function;

    })(this.SyntaxNode);
    return this.Macro = (function(_super) {

      __extends(Macro, _super);

      function Macro(name, argnames, template, yy, fn) {
        this.name = name;
        this.argnames = argnames;
        this.template = template;
        Macro.__super__.constructor.call(this, null, yy);
        if (fn != null) this.invoke = fn;
      }

      Macro.prototype.compile_unquoted = function() {
        var c_name, scope;
        c_name = this.name.compile();
        if (this.invoke == null) {}
        scope = last(scope_stack);
        scope[c_name] = this;
        return "null";
      };

      Macro.transform = function(code) {
        var c_callable, callable, item, scope;
        if (code instanceof types.List) {
          if (code.quoted) {
            return this.transform(code);
          } else {
            callable = code.value[0];
            if (callable instanceof types.Symbol) {
              c_callable = callable.compile();
              scope = last(scope_stack);
              item = scope[c_callable];
              if (item instanceof types.Macro && !item.builtin) {
                return item.transform(code);
              }
            }
          }
        }
        return code;
      };

      return Macro;

    })(this.SyntaxNode);
  }).call(types);

  macro = function(name, fn) {
    var m, s_name;
    s_name = new types.Symbol(name);
    m = new types.Macro(s_name, null, null, null, fn);
    m.builtin = true;
    m.compile();
    return m;
  };

  call_macro = function() {
    var args, c_name, name, scope, _ref3;
    name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    scope = last(scope_stack);
    c_name = to_js_identifier(name);
    return (_ref3 = scope[c_name]).invoke.apply(_ref3, args);
  };

  macro("def", function() {
    var args, body, c_name, c_value, fn, name, rest, scope, to_define, value;
    to_define = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!rest.length) to_define.error("Def", "You must provide a value.");
    if (to_define instanceof types.List) {
      name = to_define.value[0];
      args = to_define.value.slice(1);
      body = rest;
      fn = new types.Function(name, args, body, to_define);
      c_name = name.compile();
      c_value = fn.compile();
    } else if (to_define instanceof types.Symbol) {
      name = to_define;
      value = rest[0];
      c_name = name.compile();
      c_value = value.compile();
    } else {
      to_define.error("Def", "Invalid definition.");
    }
    scope = last(scope_stack);
    if (scope[c_name] != null) {
      name.error("Def", "Cannot define previously defined value.");
    } else {
      scope[c_name] = value;
    }
    return "" + c_name + " = " + c_value;
  });

  macro("call", function() {
    var args, c_args, callable, item, scope, to_call;
    callable = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    to_call = callable.compile();
    if (callable instanceof types.Symbol) {
      scope = last(scope_stack);
      item = scope[to_call];
      if (item instanceof types.Macro) return item.invoke.apply(item, args);
    }
    if (callable instanceof types.Function) to_call = "(" + to_call + ")";
    c_args = compile_list(args);
    return "" + to_call + "(" + (c_args.join(', ')) + ")";
  });

  macro_do = macro("do", function() {
    var c_items;
    c_items = compile_list(arguments);
    return "(" + (c_items.join(',\n')) + ")";
  });

  macro("quote", function(x) {
    x.quoted = true;
    return x.compile();
  });

  macro("raise", function(namespace, error) {
    var c_error, c_namespace;
    if (arguments.length === 1) {
      error = namespace;
      c_namespace = "Error";
    } else {
      c_namespace = namespace.compile();
    }
    c_error = error.compile();
    return "(function () {\n  throw new oppo.Error(" + c_namespace + ", " + c_error + ");\n})()";
  });

  macro("assert", function(sexp) {
    var c_sexp, error, error_namespace, raise_call;
    c_sexp = sexp.compile();
    error_namespace = new types.String("Assertion-Error");
    error = new types.String(sexp.toString());
    raise_call = call_macro("raise", error_namespace, error);
    return "(" + c_sexp + " || " + raise_call + ")";
  });

  macro("js-eval", function(js_code) {
    return js_code;
  });

  macro_if = macro("if", function() {});

  macro_let = macro("let", function() {});

  read = oppo.read = oppo.compiler.read = function() {
    return parser.parse.apply(parser, arguments);
  };

  compile = oppo.compile = oppo.compiler.compile = function(sexp) {
    INDENT = "";
    push_scope();
    return sexp.compile();
  };

}).call(this);
