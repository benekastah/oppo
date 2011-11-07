(function() {
  var COMMENT, Construct, FUNCTION, IDENTIFIER, LIST, NUMBER, ProgramList, QUOTE, SEP, STRING, TYPED_LIST, Token, g, identity, parser, recurse;
  parser = (function() {
    try {
      return exports;
    } catch (e) {
      return oppo.parser = {};
    }
  })();
  g = (function() {
    try {
      return window;
    } catch (e) {
      return global;
    }
  })();
  recurse = (function() {
    try {
      return require('./recurse');
    } catch (e) {
      return oppo.recurse;
    }
  })();
  ProgramList = (function() {
    try {
      return require('./types');
    } catch (e) {
      return oppo.types;
    }
  })().ProgramList;
  Token = (function() {
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
  Array.prototype.toString = function() {
    var item, s, _i, _len;
    s = '';
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      item = this[_i];
      if (item instanceof Array) {
        s = "" + s + "  \n" + (item.toString().replace('\n', '  \n'));
      } else {
        s = "" + s + " " + item;
      }
    }
    return "(" + s + ")";
  };
  identity = function(x) {
    return x;
  };
  Construct = (function() {
    function Construct(_arg) {
      var expander;
      this.open = _arg.open, this.close = _arg.close, this.regexp = _arg.regexp, expander = _arg.expander, this.greedy = _arg.greedy;
      if (expander != null) {
        this.expander = expander;
      }
      if ((this.open != null) && !(this.close != null)) {
        Construct.take_next_construct(this);
      }
      Construct.construct_list.push(this);
    }
    Construct.prototype.test_open = function(matching, collected) {
      if (this.open != null) {
        if (matching === this.open) {
          this.opened();
          return [true, !!this.greedy];
        }
      } else if (this.regexp != null) {
        if (this.regexp.test(matching)) {
          this.opened();
          return this.closed(matching);
        }
      }
      return [false];
    };
    Construct.prototype.test_end = function(matching, collected) {
      if ((this.close != null) && matching === this.close) {
        return this.closed(collected);
      } else {
        return [false];
      }
    };
    Construct.prototype.expander = identity;
    Construct.prototype.opened = function() {
      return Construct.add_active_construct(this);
    };
    Construct.prototype.closed = function(collected) {
      var compiled;
      if (collected == null) {
        collected = this.collected_list;
      }
      Construct.active_construct_list.pop();
      compiled = this.expander(collected);
      if (!(this.give(compiled)) && compiled !== Construct.NO_VALUE) {
        if (this.active_construct_list.length) {
          Construct.active_construct_list[this.index - 1].collected_list.push(compiled);
        } else {
          Construct.program_list.push(compiled);
        }
      }
      return [true, compiled];
    };
    /*
      CONSTRUCT - CLASS ITEMS
      */
    Construct.construct_list = [];
    Construct.active_construct_list = [];
    Construct.take_next_construct_list = [];
    Construct.program_list = [];
    Construct.NO_VALUE = {
      "Construct.NO_VALUE": true
    };
    Construct.take_next_construct = function(t) {
      this.take_next_construct_list.push(t);
      return t.take = function(t) {
        return this.closed(t);
      };
    };
    Construct.add_active_construct = function(t) {
      var l;
      l = this.active_construct_list.push(Object.create(t));
      t.give = this.give_next_construct.bind(this, t);
      t.collected_list;
      return t.index = l - 1;
    };
    Construct.give_next_construct = function(t) {
      var c;
      c = this.take_next_construct_list.pop();
      if ((c != null ? c.take : void 0) != null) {
        c.take(t);
        return true;
      } else {
        return false;
      }
    };
    Construct.parse = function(text) {
      var active_construct, c, greedy_construct, r, _char, _i, _j, _len, _len2, _ref, _results;
      this.matching_text = '';
      greedy_construct = null;
      _results = [];
      for (_i = 0, _len = text.length; _i < _len; _i++) {
        _char = text[_i];
        this.matching_text += _char;
        active_construct = this.active_construct_list[0];
        r = active_construct != null ? active_construct.test_end(this.matching_text) : void 0;
        if ((r != null) && r[0] === true) {
          this.collected_list = [];
          this.matching_text = '';
          break;
        } else if (!(greedy_construct != null)) {
          _ref = this.construct_list;
          for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
            c = _ref[_j];
            r = c.test_open(this.matching_text);
            if (r[0] === true) {
              this.matching_text = '';
              if (r[1] === true) {
                greedy_construct = r;
              }
              break;
            }
          }
        }
      }
      return _results;
    };
    return Construct;
  })();
  try {
    window.Construct = Construct;
  } catch (_e) {}
  /*
  CONSTRUCTS
  */
  SEP = new Construct({
    regexp: /\s|,/,
    expander: function() {
      return Construct.NO_VALUE;
    }
  });
  LIST = new Construct({
    open: '(',
    close: ')'
  });
  TYPED_LIST = new Construct({
    open: '[',
    close: ']',
    expander: function(content) {
      return ["typed-list", content];
    }
  });
  FUNCTION = new Construct({
    open: '#(',
    close: ')',
    expander: function(content) {
      return ["lambda", [], content];
    }
  });
  COMMENT = new Construct({
    open: ';',
    close: '\n',
    greedy: true,
    expander: function() {
      return Construct.NO_VALUE;
    }
  });
  STRING = new Construct({
    open: '"',
    close: '"',
    greedy: true,
    expander: function(content) {
      return "\"" + content + "\"";
    }
  });
  NUMBER = new Construct({
    regexp: /\d+/
  });
  IDENTIFIER = new Construct({
    regexp: /^[^\s,\(\)]*$/
  });
  QUOTE = new Construct({
    open: "'",
    expander: function(content) {
      return ["quote", content];
    }
  });
  parser.parse = Construct.parse.bind(Construct);
}).call(this);
