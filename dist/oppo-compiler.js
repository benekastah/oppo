// Generated by CoffeeScript 1.3.3
(function() {
  var C, INDENT, L, call_macro, clone, compile, compile_list, indent_down, indent_up, keys, last, macro, map, newline, newline_down, newline_up, read, root, scope_stack, setup_built_in_macros, trim, type_of, types, _ref, _ref1, _ref2,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  root = typeof global !== "undefined" && global !== null ? global : window;

  L = lemur;

  C = L.Compiler;

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
      if (message != null) {
        this.message = message;
      }
    }

    ArityException.prototype.name = "Arity-Exception";

    ArityException.prototype.message = "Wrong number of arguments";

    return ArityException;

  })(oppo.Error);

  type_of = lemur.core.to_type;

  oppo.stringify = function(o) {
    var items, key, type, value;
    type = type_of(o);
    switch (type) {
      case "array":
        return types.List.prototype.toString.call({
          value: o
        });
      case "object":
        if (o instanceof C.Construct) {
          return o.toString();
        } else {
          items = (function() {
            var _results;
            _results = [];
            for (key in o) {
              value = o[key];
              _results.push("" + (oppo.stringify(key)) + " " + (oppo.stringify(value)));
            }
            return _results;
          })();
          return "{ " + (items.join("\n")) + " }";
        }
        break;
      default:
        return "" + o;
    }
  };

  oppo.stringify_html = function(o) {
    var s;
    s = oppo.stringify(o);
    return s.replace(/\n/g, "<br />");
  };

  clone = (_ref1 = Object.create) != null ? _ref1 : function(o) {
    function ObjectClone () {};
    ObjectClone.prototype = o;
    return new ObjectClone();
  };

  keys = (_ref2 = Object.keys) != null ? _ref2 : function(o) {
    var prop, _results;
    _results = [];
    for (prop in o) {
      if (!__hasProp.call(o, prop)) continue;
      _results.push(prop);
    }
    return _results;
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

  compile_list = function(list, arg, unquoted) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      if (unquoted) {
        item.quoted = false;
      }
      _results.push(item.compile(arg));
    }
    return _results;
  };

  trim = String.prototype.trim || function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
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

  read = oppo.read = oppo.compiler.read = function() {
    return parser.parse.apply(parser, arguments);
  };

  compile = oppo.compile = oppo.compiler.compile = function(sexp) {
    return new lemur.Compiler().compile(function() {
      setup_built_in_macros();
      return sexp.compile();
    });
  };

  C.Call = (function(_super) {

    __extends(Call, _super);

    function Call() {
      return Call.__super__.constructor.apply(this, arguments);
    }

    Call.prototype.compile = function() {
      var arg, val, _i, _len, _ref3;
      val = C.get_var_val(this.fn);
      if (val instanceof C.Macro) {
        _ref3 = this.args;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          arg = _ref3[_i];
          arg.quoted = true;
        }
        return val.invoke.apply(val, this.args);
      } else {
        return Call.__super__.compile.apply(this, arguments);
      }
    };

    return Call;

  })(C.FunctionCall);

  C.Keyword = (function(_super) {

    __extends(Keyword, _super);

    function Keyword() {
      return Keyword.__super__.constructor.apply(this, arguments);
    }

    Keyword.prototype.toString = function() {
      return ":" + this.value;
    };

    return Keyword;

  })(C.String);

  C.Lambda = (function(_super) {

    __extends(Lambda, _super);

    function Lambda(config, yy) {
      this.arity = config.arity;
      config.autoreturn = true;
      Lambda.__super__.constructor.call(this, config, yy);
    }

    return Lambda;

  })(C.Function);

  C.List = (function(_super) {

    __extends(List, _super);

    function List() {
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.compile = function() {
      if (!this.quoted) {
        return (new C.Call({
          fn: this.items[0],
          args: this.items.slice(1)
        })).compile();
      } else {
        return List.__super__.compile.apply(this, arguments);
      }
    };

    return List;

  })(C.Array);

  C.Macro = (function(_super) {

    __extends(Macro, _super);

    function Macro(_arg, yy) {
      this.name = _arg.name, this.argnames = _arg.argnames, this.template = _arg.template, this.invoke = _arg.invoke, this.oppo_fn = _arg.oppo_fn;
      Macro.__super__.constructor.call(this, null, yy);
    }

    Macro.prototype.compile_unquoted = function() {
      var c_name, compile_to, scope, _ref3, _ref4, _ref5;
      c_name = this.name.compile();
      scope = last(scope_stack);
      scope[c_name] = this;
      compile_to = (_ref3 = (_ref4 = (_ref5 = this.oppo_fn) != null ? typeof _ref5.compile === "function" ? _ref5.compile() : void 0 : void 0) != null ? _ref4 : "" + this.oppo_fn) != null ? _ref3 : "null";
      return "" + c_name + " = " + compile_to;
    };

    Macro.prototype.invoke = function() {};

    Macro.prototype.transform = function() {};

    Macro.transform = function(code) {
      var c_callable, callable, item, scope;
      if (code instanceof C.List) {
        if (code.quoted) {
          return this.transform(code);
        } else {
          callable = code.value[0];
          if (callable instanceof C.Symbol) {
            c_callable = C.Symbol.compile_non_strict(callable);
            scope = last(scope_stack);
            item = scope[c_callable];
            if (item instanceof C.Macro && !item.builtin) {
              return item.transform(code);
            }
          }
        }
      }
      return code;
    };

    return Macro;

  })(C.Construct);

  (function() {
    var isNaN, sym, _ref3;
    sym = (_ref3 = typeof to_js_identifier !== "undefined" && to_js_identifier !== null ? to_js_identifier : ender.to_js_identifier) != null ? _ref3 : require("text-to-js-identifier");
    isNaN = this[sym('NaN?')] = function(x) {
      return (to_type(x)) !== "number" || x !== x;
    };
    this[sym('+')] = function() {
      var num, x, _i, _len;
      num = 0;
      if (arguments.length < 2) {
        throw new Error("Can't add less than two numbers.,");
      }
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        x = arguments[_i];
        num += x;
      }
      if (isNaN(num)) {
        throw new TypeError("Can't add non-numbers.");
      }
      return num;
    };
    this[sym('-')] = function() {
      var num, x, _i, _len;
      num = null;
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        x = arguments[_i];
        if (num != null) {
          num -= x;
        } else {
          num = x;
        }
      }
      if (isNaN(num)) {
        throw new TypeError("Can't subtract non-numbers.");
      }
      return num;
    };
    return this[sym('*')] = function() {
      var num, x, _i, _len, _results;
      num = null;
      _results = [];
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        x = arguments[_i];
        if (num != null) {
          _results.push(num *= x);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
  });

  /*
  HELPERS
  */


  macro = function(name, fn) {
    var m, s_name, scope;
    s_name = new C.Symbol(name);
    s_name.must_exist = false;
    m = new C.Macro({
      name: s_name,
      invoke: fn
    });
    m.builtin = true;
    m.compile();
    scope = C.current_scope();
    scope.def_var(s_name, m);
    return m;
  };

  call_macro = function() {
    var args, name;
    name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    macro = C.get_var_val(C.Symbol(name));
    return macro.invoke.apply(macro, args);
  };

  setup_built_in_macros = function() {
    /*
      JAVASCRIPT BUILTINS
    */

    var macro_do, macro_if, macro_let, operator_macro;
    macro("js-eval", function(js_code) {
      return js_code;
    });
    macro_if = macro("if", function(cond, tbranch, fbranch) {
      var result, _ref3;
      result = "(/* IF */ " + (cond.compile()) + " ?\n" + (indent_up()) + "/* THEN */ " + (tbranch.compile()) + " :\n" + INDENT + "/* ELSE */ " + ((_ref3 = fbranch != null ? fbranch.compile() : void 0) != null ? _ref3 : "null") + ")";
      indent_down();
      return result;
    });
    macro("lambda", function() {
      var args, body, fn;
      args = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      fn = new C.Lambda({
        args: args.value,
        body: body
      });
      return fn.compile();
    });
    macro("js-for", function() {
      var a, b, body, c, _for;
      a = arguments[0], b = arguments[1], c = arguments[2], body = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
      _for = new C.ForLoop({
        condition: [a, b, c],
        body: body
      });
      return _for.compile();
    });
    macro("foreach", function() {
      var body, coll, foreach;
      coll = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return foreach = new C.ForEachLoop({
        collection: coll,
        body: body
      });
    });
    operator_macro = function(name, className) {
      var macro_fn;
      macro_fn = function() {
        var Cls, args, postfix, prefix, results, x, y;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        Cls = C[className];
        prefix = Cls.prototype instanceof C.PrefixOperation;
        postfix = Cls.prototype instanceof C.PostfixOperation;
        results = (function() {
          var _results;
          _results = [];
          while (args.length) {
            x = args.shift();
            _results.push((prefix || postfix ? new Cls(x, x.yy) : (y = args.shift(), new Cls([x, y], x.yy))).compile());
          }
          return _results;
        })();
        return results.join(' ');
      };
      return macro(name, macro_fn);
    };
    operator_macro("subtract", "Subtract");
    operator_macro("add", "Add");
    operator_macro("multiply", "Multiply");
    operator_macro("divide", "Divide");
    operator_macro("modulo", "Mod");
    operator_macro("==", "Eq2");
    operator_macro("===", "Eq3");
    operator_macro("gt", "GT");
    operator_macro("lt", "LT");
    operator_macro("gte", "GTE");
    operator_macro("lte", "LTE");
    operator_macro("not===", "NotEq3");
    operator_macro("not==", "NotEq2");
    operator_macro("!", "Not");
    operator_macro("||", "Or");
    operator_macro("&&", "And");
    operator_macro("&", "BAnd");
    operator_macro("|", "BOr");
    operator_macro("^", "BXor");
    operator_macro("<<", "BLeftShift");
    operator_macro(">>", "BRightShift");
    operator_macro(">>>", "BZeroFillRightShift");
    operator_macro("~", "BNot");
    operator_macro("delete", "Delete");
    /*
      OPPO BUILTINS
    */

    macro("def", function() {
      var args, body, c_name, c_value, name, rest, scope, to_define, value;
      to_define = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!rest.length) {
        to_define.error("Def", "You must provide a value.");
      }
      scope = C.current_scope();
      if (to_define instanceof C.List) {
        name = to_define.value[0];
        args = to_define.value.slice(1);
        body = rest;
        value = new C.Lambda({
          name: name,
          args: args,
          body: body
        });
      } else if (to_define instanceof C.Symbol) {
        name = to_define;
        value = rest[0];
      } else {
        to_define.error("Def", "Invalid definition.");
      }
      scope.def_var(name, value);
      c_name = name.compile();
      c_value = value.compile();
      return "" + c_name + " = " + c_value;
    });
    macro("call", function() {
      var args, c_args, callable, item, scope, to_call;
      callable = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      to_call = callable.compile();
      if (callable instanceof types.Symbol) {
        scope = last(scope_stack);
        item = scope[to_call];
        if (item instanceof types.Macro) {
          return item.invoke.apply(item, args);
        }
      }
      if (callable instanceof types.Function) {
        to_call = "(" + to_call + ")";
      }
      c_args = compile_list(args);
      return "" + to_call + "(" + (c_args.join(', ')) + ")";
    });
    macro_let = macro("let", function() {
      var bindings, body, def_sym, i, item, new_bindings, new_body, sym, _i, _len, _ref3;
      bindings = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      def_sym = new types.Symbol('def', null, bindings);
      sym = null;
      new_bindings = [];
      _ref3 = bindings.value;
      for (i = _i = 0, _len = _ref3.length; _i < _len; i = ++_i) {
        item = _ref3[i];
        if (i % 2 === 0) {
          sym = item;
        } else {
          if (!(item != null)) {
            bindings.error("Must have even number of bindings.");
          }
          new_bindings.push(new types.List([def_sym, sym, item]));
        }
      }
      new_body = __slice.call(new_bindings).concat(__slice.call(body));
      return (new types.List([
        new types.Lambda({
          body: new_body
        })
      ])).compile();
    });
    macro_do = macro("do", function() {
      var c_items;
      c_items = compile_list(arguments, null, true);
      return "(" + (c_items.join(',\n' + INDENT)) + ")";
    });
    /*
      QUOTING
    */

    macro("quote", function(x) {
      x.quoted = true;
      return x.compile();
    });
    macro("quasiquote", function(x) {
      var c_item, compiled, current_group, first, item, push_group, scope, _i, _len, _ref3;
      scope = last(scope_stack);
      current_group = [];
      compiled = [];
      push_group = function() {
        if (current_group.length) {
          compiled.push("[" + (current_group.join(', ')) + "]");
        }
        return current_group = [];
      };
      _ref3 = x.value;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        item = _ref3[_i];
        if (item instanceof types.UnquoteSpliced) {
          c_item = "Array.prototype.slice.call(" + (item.compile()) + ")";
          push_group();
          compiled.push(c_item);
        } else if (item instanceof types.Unquoted) {
          current_group.push(item.compile());
        } else {
          current_group.push(item.compile(true));
        }
      }
      push_group();
      first = compiled.shift();
      if (compiled.length) {
        return "" + first + ".concat(" + (compiled.join(', ')) + ")";
      } else {
        return first;
      }
    });
    macro("unquote", function(x) {
      return x.compile(false);
    });
    macro("unquote-splicing", function(x) {
      return x.compile(false);
    });
    /*
      ERRORS & VALIDATIONS
    */

    macro("raise", function(namespace, error) {
      var c_error, c_namespace;
      if (arguments.length === 1) {
        error = namespace;
        c_namespace = "\"Error\"";
      } else {
        c_namespace = namespace.compile();
      }
      c_error = error.compile();
      return "(function () {\n" + (indent_up()) + "throw new oppo.Error(" + c_namespace + ", " + c_error + ");\n" + (indent_down()) + "})()";
    });
    return macro("assert", function(sexp) {
      var c_sexp, error, error_namespace, raise_call;
      c_sexp = sexp.compile();
      error_namespace = new types.String("Assertion-Error");
      error = new types.String(sexp.toString());
      raise_call = call_macro("raise", error_namespace, error);
      return "(" + c_sexp + " || " + raise_call + ")";
    });
  };

}).call(this);
