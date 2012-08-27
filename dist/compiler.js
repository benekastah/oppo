// Generated by CoffeeScript 1.3.3
(function() {
  var Context, ContextStack, JavaScriptCode, Module, Symbol, clone, compile, compile_list, define, define_macro, lambda, symbol, text_to_js_identifier, to_type, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  JavaScriptCode = oppo.JavaScriptCode, Symbol = oppo.Symbol;

  _ref = oppo.helpers, text_to_js_identifier = _ref.text_to_js_identifier, to_type = _ref.to_type, clone = _ref.clone;

  symbol = function(text) {
    return new Symbol(text);
  };

  Context = (function() {

    function Context(parent_context) {
      this.parent_context = parent_context != null ? parent_context : Object.prototype;
      this.context = clone(this.parent_context);
    }

    Context.prototype.var_stmt = function() {
      var k, v, vars;
      vars = (function() {
        var _ref1, _results;
        _ref1 = this.context;
        _results = [];
        for (k in _ref1) {
          if (!__hasProp.call(_ref1, k)) continue;
          v = _ref1[k];
          if (!(v instanceof Context) && (type_of(v)) !== 'function') {
            _results.push(compile(symbol(k)));
          }
        }
        return _results;
      }).call(this);
      if (vars.length) {
        return "var " + (vars.join(', ')) + ";\n";
      } else {
        return "";
      }
    };

    return Context;

  })();

  Module = (function(_super) {

    __extends(Module, _super);

    function Module(parent_context, name) {
      this.name = name;
      Module.__super__.constructor.call(this, parent_context);
      Module[this.name] = this;
    }

    return Module;

  })(Context);

  ContextStack = (function() {

    function ContextStack() {
      this.global_context = new Context();
      this.stack = [this.global_context];
      this.current_context = this.global_context;
    }

    ContextStack.prototype.push = function(c) {
      this.current_context = c;
      this.stack.push(c);
      return c;
    };

    ContextStack.prototype.push_new = function() {
      var c;
      c = new Context(this.current_context);
      return this.push(c);
    };

    ContextStack.prototype.push_new_module = function(name) {
      var m;
      m = new Module(this.current_context, name);
      return this.push(m);
    };

    ContextStack.prototype.pop = function() {
      var c;
      c = this.stack.pop();
      this.current_context = this.stack[this.stack.length - 1];
      return c;
    };

    return ContextStack;

  })();

  compile = function() {
    var parse_tree, sexp, sexp_type, _i, _len, _results;
    parse_tree = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _results = [];
    for (_i = 0, _len = parse_tree.length; _i < _len; _i++) {
      sexp = parse_tree[_i];
      sexp_type = to_type(sexp);
      if (!(sexp != null)) {
        _results.push("null");
      } else if (sexp instanceof JavaScriptCode) {
        _results.push(sexp.text);
      } else if (sexp instanceof Symbol) {
        _results.push(text_to_js_identifier(sexp.text));
      } else if (sexp_type === "boolean" || sexp_type === "number") {
        _results.push("" + sexp);
      } else if (sexp_type === "string") {
        _results.push("\"" + sexp + "\"");
      } else if (sexp_type === "array") {
        _results.push(compile_list(sexp));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  oppo.compile = function(parse_tree, module_name) {
    var c, module, var_stmt, _ref1;
    if (module_name == null) {
      module_name = "__anonymous__";
    }
    if ((_ref1 = oppo.context_stack) == null) {
      oppo.context_stack = new ContextStack();
    }
    module = oppo.context_stack.push_new_module(module_name);
    c = compile.apply(null, parse_tree);
    oppo.context_stack.pop();
    var_stmt = module.var_stmt();
    return "(function () {\n" + var_stmt + "\nreturn " + (c.join(",\n")) + "\n\n}()";
  };

  compile_list = function(ls) {
    var call_macro, callable;
    callable = ls[0];
    call_macro = lookup_symbol(callable);
    if ((to_type(call_macro)) !== "function") {
      call_macro = lookup_symbol("call", "core");
    } else {
      ls.shift();
    }
    return compile(call_macro.apply(null, ls))[0];
  };

  lambda = function() {
    var args, body, c_args, c_body, context, var_stmt;
    args = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    context = oppo.context_stack.push_new();
    c_args = compile.apply(null, args);
    c_body = compile.apply(null, body);
    oppo.context_stack.pop();
    var_stmt = context.var_stmt();
    return new JavaScriptCode("(function (" + (c_args.join(', ')) + ") {\n  " + var_stmt + "return " + (c_body.join(',\n')) + ";\n})");
  };

  define = function(_arg) {
    var c_full_name, c_name, c_val, full_name, module, name, value;
    module = _arg.module, name = _arg.name, value = _arg.value;
    if (module == null) {
      module = oppo.__compiling_module__;
    }
    full_name = "" + module + "::" + name;
    c_full_name = compile(symbol(full_name))[0];
    oppo.defined_symbols[c_full_name] = value;
    c_name = compile(symbol(name))[0];
    c_val = compile(value)[0];
    return new JavaScriptCode("" + c_name + " = " + c_val);
  };

  define_macro = function(config) {
    var argnames, module, name, template, template_compile, value;
    module = config.module, name = config.name, argnames = config.argnames, template = config.template;
    template_compile = config.compile;
    if (module == null) {
      module = oppo.__compiling_module__;
    }
    value = template_compile != null ? template_compile : function() {
      return compile([lambda.apply(null, [argnames].concat(__slice.call(template))), args])[0];
    };
    define({
      module: module,
      name: name,
      value: value
    });
    return null;
  };

  define_macro({
    module: "core",
    name: "defmacro",
    compile: function(name, args, template) {
      var t_name;
      t_name = name.text;
      return define_macro({
        name: t_name,
        argnames: args,
        template: template
      });
    }
  });

  define_macro({
    module: "core",
    name: "def",
    compile: function(name, value) {
      var t_name;
      t_name = name.text;
      return define({
        name: t_name,
        value: value
      });
    }
  });

  define_macro({
    module: "core",
    name: "lambda",
    compile: lambda
  });

  define_macro({
    module: "core",
    name: "call",
    compile: function() {
      var args, c_args, c_fname, fname;
      fname = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      c_fname = compile(fname)[0];
      c_args = compile.apply(null, args);
      return new JavaScriptCode("" + c_fname + "(" + (c_args.join(', ')) + ")");
    }
  });

  define_macro({
    module: "js",
    name: "eval",
    compile: function(to_eval) {
      var type;
      type = type_of(to_eval);
      if (type === "string") {
        return new JavaScriptCode(to_eval);
      } else {
        return [symbol("eval"), (compile(to_eval))[0]];
      }
    }
  });

}).call(this);