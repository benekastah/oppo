(function() {
  var COMMENT_BEGIN, COMMENT_END, LIST_CLOSE, LIST_OPEN, ProgramList, QUOTE, SEP, TYPED_LIST_CLOSE, TYPED_LIST_OPEN, Token, empty, g, head, inComment, inQuote, inString, listItem, parse, parser, quoteShouldWaitForListEnd, quoteWaitForListEnd, recurse, resolveListItem, resolveQuote, tail, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  parser = (function() {
    try {
      return exports;
    } catch (e) {
      return this.oppo.parser = {};
    }
  }).call(this);
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
      return this.oppo.recurse;
    }
  }).call(this);
  _ref = (function() {
    try {
      return require('./types');
    } catch (e) {
      return this.oppo.types;
    }
  }).call(this), Token = _ref.Token, ProgramList = _ref.ProgramList;
  /*
  TOKENS
  */
  LIST_OPEN = new Token("(");
  LIST_CLOSE = new Token(")");
  TYPED_LIST_OPEN = new Token("[");
  TYPED_LIST_CLOSE = new Token("]");
  SEP = new Token(/\s|,/);
  QUOTE = new Token("'");
  COMMENT_BEGIN = new Token(";");
  COMMENT_END = new Token("\n");
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
  parser.parse = parse = __bind(function(text, list, base) {
    var h, ls, t;
    if (arguments.length === 1) {
      base = list = new ProgramList();
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
        ls = new ProgramList({
          parent: list
        });
        list.push(ls);
        if (quoteShouldWaitForListEnd(t)) {
          quoteWaitForListEnd.push(list);
          --inQuote;
        }
      } else if ((LIST_CLOSE.test(h)) && !inString) {
        ls = list.parent;
      } else if ((TYPED_LIST_OPEN.test(h)) && !inString) {
        t = "(typed-list " + t;
      } else if ((TYPED_LIST_CLOSE.test(h)) && !inString) {
        t = ") " + t;
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
  resolveListItem = function(list) {
    if (listItem != null) {
      list.push(listItem);
      listItem = null;
    }
    return list;
  };
}).call(this);
