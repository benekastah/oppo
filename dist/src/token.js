(function() {
  this.Token = (function() {
    function Token(type, find) {
      this.type = type;
      this.find = find;
      Token.list[this.type] = this;
    }
    Token.prototype.isMatch = function(str) {
      return (this.find.exec(str)) !== null;
    };
    Token.prototype.toString = function() {
      return this.type;
    };
    Token.list = {};
    Token.ize = function(str, prev) {
      var name, t, token, _len, _ref, _results;
      _ref = this.list;
      _results = [];
      for (token = 0, _len = _ref.length; token < _len; token++) {
        name = _ref[token];
        _results.push(token.isMatch(str) ? (t = Object.create(token), t.text = str, t.prev = prev, prev != null ? prev.next = t : void 0) : void 0);
      }
      return _results;
    };
    return Token;
  })();
  this.declareTokens = function(tokens) {
    var find, name, _len, _results;
    _results = [];
    for (find = 0, _len = tokens.length; find < _len; find++) {
      name = tokens[find];
      _results.push(new Token(name, find));
    }
    return _results;
  };
}).call(this);
