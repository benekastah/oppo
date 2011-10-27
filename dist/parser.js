(function() {
  var g;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.parser = (function() {
    try {
      return exports;
    } catch (e) {
      return {};
    }
  })();
  g = (function() {
    try {
      return window;
    } catch (e) {
      return global;
    }
  })();
  (function() {
    var COMMENT_BEGIN, COMMENT_END, LIST_CLOSE, LIST_OPEN, List, QUOTE, SEP, Token, empty, head, inComment, inQuote, inString, listItem, parse, quoteShouldWaitForListEnd, quoteWaitForListEnd, recurse, resolveListItem, resolveQuote, runtime, tail;
    recurse = (function() {
      try {
        return require('./tco');
      } catch (e) {
        return g.recurse;
      }
    })();
    runtime = (function() {
      try {
        return require('./runtime');
      } catch (e) {
        return g.Runtime;
      }
    })();
    /*
      TOKENS
      */
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
    LIST_OPEN = new Token("(");
    LIST_CLOSE = new Token(")");
    SEP = new Token(/\s|,/);
    QUOTE = new Token("'");
    COMMENT_BEGIN = new Token(";");
    COMMENT_END = new Token("\n");
    /*
      DATA TYPES
      */
    List = runtime.types.List;
    this.ProgramList = (function() {
      __extends(ProgramList, List);
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
    /*
      LIST PROCESSING FUNCTIONS
      */
    empty = function(item) {
      return !item.length;
    };
    head = function(item) {
      return item[0];
    };
    tail = function(item) {
      if (typeof item === "string") {
        return item.substr(1);
      } else {
        return Array.prototype.slice.apply(item, 1);
      }
    };
    /*
      PARSER/TOKENIZER
      */
    inQuote = null;
    inString = null;
    inComment = null;
    listItem = null;
    quoteWaitForListEnd = null;
    this.parse = parse = __bind(function(text, list, base) {
      var h, ls, t;
      if (arguments.length === 1) {
        base = list = new this.ProgramList();
        list.push("do");
        inQuote = 0;
        quoteWaitForListEnd = [];
        inString = false;
        inComment = false;
        listItem = null;
      }
      h = head(text);
      t = tail(text);
      if (COMMENT_BEGIN.test(h)) {
        inComment = true;
      } else if (COMMENT_END.test(h)) {
        inComment = false;
      }
      if (!inComment) {
        if (empty(text)) {
          if (listItem) {
            list.push(listItem);
          }
          return base;
        } else if (QUOTE.test(h)) {
          t = "(quote " + t;
          inQuote++;
        } else if ((LIST_OPEN.test(h)) && !inString) {
          ls = new this.ProgramList({
            parent: list
          });
          list.push(ls);
          if (quoteShouldWaitForListEnd(t)) {
            quoteWaitForListEnd.push(list);
            --inQuote;
          }
        } else if ((LIST_CLOSE.test(h)) && !inString) {
          ls = list.parent;
        } else if (!SEP.test(h)) {
          if ((!listItem || inString) && h === '"') {
            inString = !inString;
          }
          listItem || (listItem = '');
          listItem = "" + listItem + h;
        }
        if (((SEP.test(h)) || LIST_CLOSE.test(h)) && !inString) {
          t = resolveQuote(list, h, t);
          resolveListItem(list);
        }
      }
      return recurse(parse, t, ls || list, base);
    }, this);
    /*
      HELPERS
      */
    quoteShouldWaitForListEnd = function(t) {
      var exception, len, test;
      if (inQuote) {
        exception = "quote";
        len = exception.length;
        test = t.substr(0, len);
        if (!(test === exception && SEP.test(t.charAt(len)))) {
          return true;
        }
      }
      return false;
    };
    resolveQuote = function(list, h, t) {
      var closeThisList, listClose;
      listClose = LIST_CLOSE.test(h);
      closeThisList = quoteWaitForListEnd[quoteWaitForListEnd.length - 1] === list;
      if ((!closeThisList && (inQuote && listItem !== 'quote')) || (closeThisList && listClose)) {
        inQuote = Math.max(--inQuote, 0);
        if (closeThisList && listClose) {
          quoteWaitForListEnd.pop();
        }
        return ") " + t;
      } else {
        return t;
      }
    };
    return resolveListItem = function(list) {
      if (listItem != null) {
        list.push(listItem);
        listItem = null;
      }
      return list;
    };
  }).call(this.parser);
}).call(this);
