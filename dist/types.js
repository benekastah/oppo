(function() {
  var RT, eval_helpers, getEvalHelpers, getRT, types;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice;
  types = (function() {
    try {
      return exports;
    } catch (e) {
      return this.oppo.types = {};
    }
  }).call(this);
  RT = null;
  getRT = function() {
    if (RT != null) {
      return RT;
    } else {
      try {
        return require('./runtime');
      } catch (e) {
        return this.oppo.runtime;
      }
    }
  };
  eval_helpers = null;
  getEvalHelpers = function() {
    if (eval_helpers != null) {
      return eval_helpers;
    } else {
      return eval_helpers = ((function() {
        try {
          return require('./eval_helpers');
        } catch (e) {
          return this.oppo.eval_helpers;
        }
      }).call(this))(getRT());
    }
  };
  types.List = (function() {
    __extends(List, Array);
    function List() {
      var items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (items) {
        this.push.apply(this, items);
      }
    }
    List.prototype.get = function(i) {
      return this[i];
    };
    List.prototype.toArray = function() {
      return this.slice(0);
    };
    List.prototype.toString = function() {
      return "(" + ((this.join(' ')).replace(") (", ")\n  (")) + ")";
    };
    return List;
  })();
  types.TypedList = (function() {
    __extends(TypedList, types.List);
    function TypedList(items) {
      var i, item, itemType, last, _len, _ref;
      items = getEvalHelpers().getValue(items);
      last = items.length - 1;
      for (i = 0, _len = items.length; i < _len; i++) {
        item = items[i];
        item = getEvalHelpers().getValue(item);
        itemType = getRT()["typeof"](item);
        if ((_ref = this.type) == null) {
          this.type = itemType;
        }
        if (i === last && itemType === "function" && this.type !== itemType) {
          this.generator = item;
        } else if (this.type !== itemType) {
          throw new Error("typed-list: Cannot contain item of type " + itemType + " in a typed-list of type " + type);
        } else {
          this.push(item);
        }
      }
      if (this.length === 1 && (getRT()["typeof"](this[0])) === "function") {
        this.generator = this[0];
        this[0] = this.generator(null, 0, this);
      }
      if (this.generator) {
        this.generator.enabled = true;
      }
    }
    TypedList.prototype.get = function(i) {
      var j, val, _ref;
      i = getEvalHelpers().getValue(i);
      val = this[i];
      if (i < this.length) {
        val;
      } else if ((_ref = this.generator) != null ? _ref.enabled : void 0) {
        j = this.length;
        while (j <= i) {
          this.push(this.generator(getRT().last(this), j++, this));
        }
        val = getRT().last(this);
        if (!(val != null) && this.type !== "nil") {
          this.end();
        }
      }
      return val;
    };
    TypedList.prototype.getAll = function() {
      var i, val, _results;
      i = 0;
      _results = [];
      while (val !== null) {
        _results.push(val = get(i++));
      }
      return _results;
    };
    TypedList.prototype.end = function() {
      return this.generator.enabled = false;
    };
    TypedList.prototype.reduce = function() {
      getAll();
      return this.reduce.apply(this, arguments);
    };
    TypedList.prototype.toString = function() {
      return "[ " + (this.join(" ")) + " ]";
    };
    return TypedList;
  })();
  types.ProgramList = (function() {
    __extends(ProgramList, types.List);
    function ProgramList(config) {
      var items;
      if (config == null) {
        config = {};
      }
      this.parent = config.parent, items = config.items;
      ProgramList.__super__.constructor.apply(this, items);
    }
    return ProgramList;
  })();
  types.Token = (function() {
    function Token(descriptor) {
      this.descriptor = descriptor;
      if (this.descriptor instanceof RegExp) {
        this.test = this.descriptor.test.bind(this.descriptor);
      } else if (typeof this.descriptor === "string") {
        this.test = function(s) {
          return s === this.descriptor;
        };
      } else {
        throw new Error("Token: Descriptor must be string or regexp");
      }
    }
    return Token;
  })();
  types.NamedArgsList = (function() {
    __extends(NamedArgsList, types.List);
    function NamedArgsList() {
      NamedArgsList.__super__.constructor.apply(this, arguments);
    }
    NamedArgsList.prototype.format = function(argsList, scope) {
      var args, i, name, restArgs, restIndex, restName, value, _len;
      args = new types.List;
      for (i = 0, _len = argsList.length; i < _len; i++) {
        value = argsList[i];
        name = this[i] || '';
        if (restArgs) {
          restArgs.push(value);
        } else if ((name.substr(0, 3)) === this.REST) {
          restArgs = new types.List;
          restName = name.substr(3);
          restIndex = i;
          restArgs.push(value);
        } else {
          args.push(value);
          scope[name || this.unnamedParam(i)] = value;
        }
      }
      if (restName) {
        args.push(restArgs);
        scope[restName || this.unnamedParam(restIndex)] = restArgs;
      }
      return args;
    };
    NamedArgsList.prototype.unnamedParam = function(i) {
      return "%" + (i + 1);
    };
    NamedArgsList.prototype.REST = '...';
    return NamedArgsList;
  })();
  types.Thunk = (function() {
    function Thunk(scope, toEval) {
      this.scope = scope;
      this.toEval = toEval;
    }
    Thunk.prototype.call = function() {
      var _ref;
      if ((_ref = this.result) == null) {
        this.result = getRT().eval(this.scope, this.toEval);
      }
      return this.result;
    };
    return Thunk;
  })();
  types.identifier = {
    test: function(s) {
      return typeof s === "string" && !(types.string.test(s)) && !(types.number.test(s)) && /^[^\s]+$/.test(s);
    },
    value: function(scope, ident) {
      return scope[ident];
    },
    def: function(scope, ident, val) {
      if ((scope.hasOwnProperty(ident)) && typeof scope[ident] !== 'undefined') {
        throw new Error("Can't define " + ident + " in scope where it is already defined: " + scope);
      } else {
        return scope[ident] = val;
      }
    },
    "set!": function(scope, ident, val) {
      if ((scope.hasOwnProperty(ident)) && typeof scope[ident] !== 'undefined') {
        return scope[ident] = val;
      } else {
        throw new Error("Can't redifine " + ident + " in scope where it is not defined: " + scope);
      }
    }
  };
  types.string = {
    test: function(s) {
      return typeof s === "string" && /^"[^"]*"$/.test(s);
    },
    value: function(s) {
      return (s.replace(/^"/, '')).replace(/"$/, '');
    }
  };
  types.number = {
    test: function(s) {
      return (typeof s === "string" && /^\d+$/.test(s)) || typeof s === "number";
    },
    value: function(n) {
      return +n;
    }
  };
}).call(this);
