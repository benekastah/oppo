var parser = function() {
  var parser = {trace:function trace() {
  }, yy:{}, symbols_:{"error":2, "program":3, "s_expression_list":4, "EOF":5, "s_expression":6, "special_form":7, "list":8, "symbol":9, "keyword":10, "literal":11, "atom":12, "callable_list":13, "quoted_list":14, "js_map":15, "(":16, "element_list":17, ")":18, "[":19, "]":20, "JS_MAP_START":21, "MAP_END":22, "element":23, "QUOTE":24, "SYNTAX_QUOTE":25, "UNQUOTE":26, "SPLAT":27, "FUNCTION":28, "ARGUMENTS_ACCESSOR":29, "NIL":30, "BOOLEAN_TRUE":31, "BOOLEAN_FALSE":32, "STRING":33, "regex":34, "number":35, 
  "REGEX":36, "FLAGS":37, "DECIMAL_NUMBER":38, "OCTAL_NUMBER":39, "HEXIDECIMAL_NUMBER":40, "BINARY_NUMBER":41, "KEYWORD":42, "IDENTIFIER":43, "$accept":0, "$end":1}, terminals_:{2:"error", 5:"EOF", 16:"(", 18:")", 19:"[", 20:"]", 21:"JS_MAP_START", 22:"MAP_END", 24:"QUOTE", 25:"SYNTAX_QUOTE", 26:"UNQUOTE", 27:"SPLAT", 28:"FUNCTION", 29:"ARGUMENTS_ACCESSOR", 30:"NIL", 31:"BOOLEAN_TRUE", 32:"BOOLEAN_FALSE", 33:"STRING", 36:"REGEX", 37:"FLAGS", 38:"DECIMAL_NUMBER", 39:"OCTAL_NUMBER", 40:"HEXIDECIMAL_NUMBER", 
  41:"BINARY_NUMBER", 42:"KEYWORD", 43:"IDENTIFIER"}, productions_:[0, [3, 2], [3, 1], [4, 2], [4, 1], [6, 1], [6, 1], [6, 1], [6, 1], [6, 1], [6, 1], [8, 1], [8, 1], [8, 1], [13, 3], [13, 2], [14, 3], [14, 2], [15, 3], [15, 2], [17, 1], [17, 2], [23, 1], [7, 2], [7, 2], [7, 2], [7, 2], [7, 3], [7, 1], [12, 1], [12, 1], [12, 1], [11, 1], [11, 1], [11, 1], [34, 2], [35, 1], [35, 1], [35, 1], [35, 1], [10, 2], [9, 1]], performAction:function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
    var $0 = $$.length - 1;
    switch(yystate) {
      case 1:
        return[["symbol", "do"]].concat($$[$0 - 1]);
        break;
      case 2:
        return null;
        break;
      case 3:
        this.$ = $$[$0 - 1];
        this.$.push($$[$0]);
        break;
      case 4:
        this.$ = [$$[$0]];
        break;
      case 14:
        this.$ = $$[$0 - 1];
        break;
      case 15:
        this.$ = null;
        break;
      case 16:
        this.$ = [["symbol", "list"]].concat($$[$0 - 1]);
        break;
      case 17:
        this.$ = [["symbol", "list"]];
        break;
      case 18:
        this.$ = [["symbol", "js-map"]].concat($$[$0 - 1]);
        break;
      case 19:
        this.$ = [["symbol", "js-map"]];
        break;
      case 20:
        this.$ = [$$[$0]];
        break;
      case 21:
        this.$ = $$[$0 - 1];
        this.$.push($$[$0]);
        break;
      case 23:
        this.$ = [["symbol", "quote"], $$[$0]];
        break;
      case 24:
        this.$ = [["symbol", "syntax-quote"], $$[$0]];
        break;
      case 25:
        this.$ = [["symbol", "unquote"], $$[$0]];
        break;
      case 26:
        this.$ = [["symbol", "splat"], $$[$0]];
        break;
      case 27:
        this.$ = [["symbol", "lambda"], [], $$[$0 - 1]];
        break;
      case 28:
        this.$ = [["symbol", "js-eval"], "arguments[" + ($$[$0].substring(1) - 1) + "]"];
        break;
      case 29:
        this.$ = null;
        break;
      case 30:
        this.$ = true;
        break;
      case 31:
        this.$ = false;
        break;
      case 32:
        this.$ = $$[$0];
        break;
      case 35:
        this.$ = [["symbol", "regex"], $$[$0 - 1], $$[$0].substr(1)];
        break;
      case 36:
        this.$ = parseFloat(yytext, 10);
        break;
      case 37:
        if(/[8-9]/.test(yytext)) {
          this.$ = NaN
        }else {
          this.$ = parseInt(yytext.replace(/^#0/, ""), 8)
        }
        break;
      case 38:
        this.$ = parseInt(yytext.replace(/^#x/, ""), 16);
        break;
      case 39:
        if(/[2-9]/.test(yytext)) {
          this.$ = NaN
        }else {
          this.$ = parseInt(yytext.replace(/^#b/, ""), 2)
        }
        break;
      case 40:
        this.$ = [["symbol", "keyword"], [["symbol", "quote"], $$[$0]]];
        break;
      case 41:
        var _this = [["symbol", "js-eval"], "this"], yytext1_ = yytext.substr(1), yytext0 = yytext.charAt(0), yytextLower = yytext.toLowerCase();
        if(yytextLower === "nil") {
          this.$ = null
        }else {
          this.$ = ["symbol", yytext]
        }
        break
    }
  }, table:[{3:1, 4:2, 5:[1, 3], 6:4, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 19:[1, 29], 21:[1, 30], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 15], 29:[1, 16], 30:[1, 25], 31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 34], 41:[1, 35], 42:[1, 21], 43:[1, 20]}, {1:[3]}, {5:[1, 36], 6:37, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 19:[1, 29], 21:[1, 30], 24:[1, 11], 25:[1, 12], 26:[1, 13], 
  27:[1, 14], 28:[1, 15], 29:[1, 16], 30:[1, 25], 31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 34], 41:[1, 35], 42:[1, 21], 43:[1, 20]}, {1:[2, 2]}, {5:[2, 4], 16:[2, 4], 19:[2, 4], 21:[2, 4], 24:[2, 4], 25:[2, 4], 26:[2, 4], 27:[2, 4], 28:[2, 4], 29:[2, 4], 30:[2, 4], 31:[2, 4], 32:[2, 4], 33:[2, 4], 36:[2, 4], 38:[2, 4], 39:[2, 4], 40:[2, 4], 41:[2, 4], 42:[2, 4], 43:[2, 4]}, {5:[2, 5], 16:[2, 5], 18:[2, 5], 19:[2, 5], 20:[2, 5], 21:[2, 5], 22:[2, 
  5], 24:[2, 5], 25:[2, 5], 26:[2, 5], 27:[2, 5], 28:[2, 5], 29:[2, 5], 30:[2, 5], 31:[2, 5], 32:[2, 5], 33:[2, 5], 36:[2, 5], 38:[2, 5], 39:[2, 5], 40:[2, 5], 41:[2, 5], 42:[2, 5], 43:[2, 5]}, {5:[2, 6], 16:[2, 6], 18:[2, 6], 19:[2, 6], 20:[2, 6], 21:[2, 6], 22:[2, 6], 24:[2, 6], 25:[2, 6], 26:[2, 6], 27:[2, 6], 28:[2, 6], 29:[2, 6], 30:[2, 6], 31:[2, 6], 32:[2, 6], 33:[2, 6], 36:[2, 6], 38:[2, 6], 39:[2, 6], 40:[2, 6], 41:[2, 6], 42:[2, 6], 43:[2, 6]}, {5:[2, 7], 16:[2, 7], 18:[2, 7], 19:[2, 7], 
  20:[2, 7], 21:[2, 7], 22:[2, 7], 24:[2, 7], 25:[2, 7], 26:[2, 7], 27:[2, 7], 28:[2, 7], 29:[2, 7], 30:[2, 7], 31:[2, 7], 32:[2, 7], 33:[2, 7], 36:[2, 7], 38:[2, 7], 39:[2, 7], 40:[2, 7], 41:[2, 7], 42:[2, 7], 43:[2, 7]}, {5:[2, 8], 16:[2, 8], 18:[2, 8], 19:[2, 8], 20:[2, 8], 21:[2, 8], 22:[2, 8], 24:[2, 8], 25:[2, 8], 26:[2, 8], 27:[2, 8], 28:[2, 8], 29:[2, 8], 30:[2, 8], 31:[2, 8], 32:[2, 8], 33:[2, 8], 36:[2, 8], 38:[2, 8], 39:[2, 8], 40:[2, 8], 41:[2, 8], 42:[2, 8], 43:[2, 8]}, {5:[2, 9], 16:[2, 
  9], 18:[2, 9], 19:[2, 9], 20:[2, 9], 21:[2, 9], 22:[2, 9], 24:[2, 9], 25:[2, 9], 26:[2, 9], 27:[2, 9], 28:[2, 9], 29:[2, 9], 30:[2, 9], 31:[2, 9], 32:[2, 9], 33:[2, 9], 36:[2, 9], 38:[2, 9], 39:[2, 9], 40:[2, 9], 41:[2, 9], 42:[2, 9], 43:[2, 9]}, {5:[2, 10], 16:[2, 10], 18:[2, 10], 19:[2, 10], 20:[2, 10], 21:[2, 10], 22:[2, 10], 24:[2, 10], 25:[2, 10], 26:[2, 10], 27:[2, 10], 28:[2, 10], 29:[2, 10], 30:[2, 10], 31:[2, 10], 32:[2, 10], 33:[2, 10], 36:[2, 10], 38:[2, 10], 39:[2, 10], 40:[2, 10], 
  41:[2, 10], 42:[2, 10], 43:[2, 10]}, {6:38, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 19:[1, 29], 21:[1, 30], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 15], 29:[1, 16], 30:[1, 25], 31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 34], 41:[1, 35], 42:[1, 21], 43:[1, 20]}, {6:39, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 19:[1, 29], 21:[1, 30], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 
  28:[1, 15], 29:[1, 16], 30:[1, 25], 31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 34], 41:[1, 35], 42:[1, 21], 43:[1, 20]}, {6:40, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 19:[1, 29], 21:[1, 30], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 15], 29:[1, 16], 30:[1, 25], 31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 34], 41:[1, 35], 42:[1, 21], 43:[1, 20]}, {6:41, 7:5, 
  8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 19:[1, 29], 21:[1, 30], 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 15], 29:[1, 16], 30:[1, 25], 31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 34], 41:[1, 35], 42:[1, 21], 43:[1, 20]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 17:42, 19:[1, 29], 21:[1, 30], 23:43, 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 15], 29:[1, 16], 30:[1, 25], 
  31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 34], 41:[1, 35], 42:[1, 21], 43:[1, 20]}, {5:[2, 28], 16:[2, 28], 18:[2, 28], 19:[2, 28], 20:[2, 28], 21:[2, 28], 22:[2, 28], 24:[2, 28], 25:[2, 28], 26:[2, 28], 27:[2, 28], 28:[2, 28], 29:[2, 28], 30:[2, 28], 31:[2, 28], 32:[2, 28], 33:[2, 28], 36:[2, 28], 38:[2, 28], 39:[2, 28], 40:[2, 28], 41:[2, 28], 42:[2, 28], 43:[2, 28]}, {5:[2, 11], 16:[2, 11], 18:[2, 11], 19:[2, 11], 20:[2, 11], 21:[2, 11], 22:[2, 
  11], 24:[2, 11], 25:[2, 11], 26:[2, 11], 27:[2, 11], 28:[2, 11], 29:[2, 11], 30:[2, 11], 31:[2, 11], 32:[2, 11], 33:[2, 11], 36:[2, 11], 38:[2, 11], 39:[2, 11], 40:[2, 11], 41:[2, 11], 42:[2, 11], 43:[2, 11]}, {5:[2, 12], 16:[2, 12], 18:[2, 12], 19:[2, 12], 20:[2, 12], 21:[2, 12], 22:[2, 12], 24:[2, 12], 25:[2, 12], 26:[2, 12], 27:[2, 12], 28:[2, 12], 29:[2, 12], 30:[2, 12], 31:[2, 12], 32:[2, 12], 33:[2, 12], 36:[2, 12], 38:[2, 12], 39:[2, 12], 40:[2, 12], 41:[2, 12], 42:[2, 12], 43:[2, 12]}, 
  {5:[2, 13], 16:[2, 13], 18:[2, 13], 19:[2, 13], 20:[2, 13], 21:[2, 13], 22:[2, 13], 24:[2, 13], 25:[2, 13], 26:[2, 13], 27:[2, 13], 28:[2, 13], 29:[2, 13], 30:[2, 13], 31:[2, 13], 32:[2, 13], 33:[2, 13], 36:[2, 13], 38:[2, 13], 39:[2, 13], 40:[2, 13], 41:[2, 13], 42:[2, 13], 43:[2, 13]}, {5:[2, 41], 16:[2, 41], 18:[2, 41], 19:[2, 41], 20:[2, 41], 21:[2, 41], 22:[2, 41], 24:[2, 41], 25:[2, 41], 26:[2, 41], 27:[2, 41], 28:[2, 41], 29:[2, 41], 30:[2, 41], 31:[2, 41], 32:[2, 41], 33:[2, 41], 36:[2, 
  41], 38:[2, 41], 39:[2, 41], 40:[2, 41], 41:[2, 41], 42:[2, 41], 43:[2, 41]}, {9:45, 43:[1, 20]}, {5:[2, 32], 16:[2, 32], 18:[2, 32], 19:[2, 32], 20:[2, 32], 21:[2, 32], 22:[2, 32], 24:[2, 32], 25:[2, 32], 26:[2, 32], 27:[2, 32], 28:[2, 32], 29:[2, 32], 30:[2, 32], 31:[2, 32], 32:[2, 32], 33:[2, 32], 36:[2, 32], 38:[2, 32], 39:[2, 32], 40:[2, 32], 41:[2, 32], 42:[2, 32], 43:[2, 32]}, {5:[2, 33], 16:[2, 33], 18:[2, 33], 19:[2, 33], 20:[2, 33], 21:[2, 33], 22:[2, 33], 24:[2, 33], 25:[2, 33], 26:[2, 
  33], 27:[2, 33], 28:[2, 33], 29:[2, 33], 30:[2, 33], 31:[2, 33], 32:[2, 33], 33:[2, 33], 36:[2, 33], 38:[2, 33], 39:[2, 33], 40:[2, 33], 41:[2, 33], 42:[2, 33], 43:[2, 33]}, {5:[2, 34], 16:[2, 34], 18:[2, 34], 19:[2, 34], 20:[2, 34], 21:[2, 34], 22:[2, 34], 24:[2, 34], 25:[2, 34], 26:[2, 34], 27:[2, 34], 28:[2, 34], 29:[2, 34], 30:[2, 34], 31:[2, 34], 32:[2, 34], 33:[2, 34], 36:[2, 34], 38:[2, 34], 39:[2, 34], 40:[2, 34], 41:[2, 34], 42:[2, 34], 43:[2, 34]}, {5:[2, 29], 16:[2, 29], 18:[2, 29], 
  19:[2, 29], 20:[2, 29], 21:[2, 29], 22:[2, 29], 24:[2, 29], 25:[2, 29], 26:[2, 29], 27:[2, 29], 28:[2, 29], 29:[2, 29], 30:[2, 29], 31:[2, 29], 32:[2, 29], 33:[2, 29], 36:[2, 29], 38:[2, 29], 39:[2, 29], 40:[2, 29], 41:[2, 29], 42:[2, 29], 43:[2, 29]}, {5:[2, 30], 16:[2, 30], 18:[2, 30], 19:[2, 30], 20:[2, 30], 21:[2, 30], 22:[2, 30], 24:[2, 30], 25:[2, 30], 26:[2, 30], 27:[2, 30], 28:[2, 30], 29:[2, 30], 30:[2, 30], 31:[2, 30], 32:[2, 30], 33:[2, 30], 36:[2, 30], 38:[2, 30], 39:[2, 30], 40:[2, 
  30], 41:[2, 30], 42:[2, 30], 43:[2, 30]}, {5:[2, 31], 16:[2, 31], 18:[2, 31], 19:[2, 31], 20:[2, 31], 21:[2, 31], 22:[2, 31], 24:[2, 31], 25:[2, 31], 26:[2, 31], 27:[2, 31], 28:[2, 31], 29:[2, 31], 30:[2, 31], 31:[2, 31], 32:[2, 31], 33:[2, 31], 36:[2, 31], 38:[2, 31], 39:[2, 31], 40:[2, 31], 41:[2, 31], 42:[2, 31], 43:[2, 31]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 17:46, 18:[1, 47], 19:[1, 29], 21:[1, 30], 23:43, 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 
  28:[1, 15], 29:[1, 16], 30:[1, 25], 31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 34], 41:[1, 35], 42:[1, 21], 43:[1, 20]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 17:48, 19:[1, 29], 20:[1, 49], 21:[1, 30], 23:43, 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 15], 29:[1, 16], 30:[1, 25], 31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 34], 41:[1, 35], 42:[1, 21], 
  43:[1, 20]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 17:50, 19:[1, 29], 21:[1, 30], 22:[1, 51], 23:43, 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 15], 29:[1, 16], 30:[1, 25], 31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 34], 41:[1, 35], 42:[1, 21], 43:[1, 20]}, {37:[1, 52]}, {5:[2, 36], 16:[2, 36], 18:[2, 36], 19:[2, 36], 20:[2, 36], 21:[2, 36], 22:[2, 36], 24:[2, 36], 25:[2, 36], 26:[2, 36], 27:[2, 36], 
  28:[2, 36], 29:[2, 36], 30:[2, 36], 31:[2, 36], 32:[2, 36], 33:[2, 36], 36:[2, 36], 38:[2, 36], 39:[2, 36], 40:[2, 36], 41:[2, 36], 42:[2, 36], 43:[2, 36]}, {5:[2, 37], 16:[2, 37], 18:[2, 37], 19:[2, 37], 20:[2, 37], 21:[2, 37], 22:[2, 37], 24:[2, 37], 25:[2, 37], 26:[2, 37], 27:[2, 37], 28:[2, 37], 29:[2, 37], 30:[2, 37], 31:[2, 37], 32:[2, 37], 33:[2, 37], 36:[2, 37], 38:[2, 37], 39:[2, 37], 40:[2, 37], 41:[2, 37], 42:[2, 37], 43:[2, 37]}, {5:[2, 38], 16:[2, 38], 18:[2, 38], 19:[2, 38], 20:[2, 
  38], 21:[2, 38], 22:[2, 38], 24:[2, 38], 25:[2, 38], 26:[2, 38], 27:[2, 38], 28:[2, 38], 29:[2, 38], 30:[2, 38], 31:[2, 38], 32:[2, 38], 33:[2, 38], 36:[2, 38], 38:[2, 38], 39:[2, 38], 40:[2, 38], 41:[2, 38], 42:[2, 38], 43:[2, 38]}, {5:[2, 39], 16:[2, 39], 18:[2, 39], 19:[2, 39], 20:[2, 39], 21:[2, 39], 22:[2, 39], 24:[2, 39], 25:[2, 39], 26:[2, 39], 27:[2, 39], 28:[2, 39], 29:[2, 39], 30:[2, 39], 31:[2, 39], 32:[2, 39], 33:[2, 39], 36:[2, 39], 38:[2, 39], 39:[2, 39], 40:[2, 39], 41:[2, 39], 42:[2, 
  39], 43:[2, 39]}, {1:[2, 1]}, {5:[2, 3], 16:[2, 3], 19:[2, 3], 21:[2, 3], 24:[2, 3], 25:[2, 3], 26:[2, 3], 27:[2, 3], 28:[2, 3], 29:[2, 3], 30:[2, 3], 31:[2, 3], 32:[2, 3], 33:[2, 3], 36:[2, 3], 38:[2, 3], 39:[2, 3], 40:[2, 3], 41:[2, 3], 42:[2, 3], 43:[2, 3]}, {5:[2, 23], 16:[2, 23], 18:[2, 23], 19:[2, 23], 20:[2, 23], 21:[2, 23], 22:[2, 23], 24:[2, 23], 25:[2, 23], 26:[2, 23], 27:[2, 23], 28:[2, 23], 29:[2, 23], 30:[2, 23], 31:[2, 23], 32:[2, 23], 33:[2, 23], 36:[2, 23], 38:[2, 23], 39:[2, 23], 
  40:[2, 23], 41:[2, 23], 42:[2, 23], 43:[2, 23]}, {5:[2, 24], 16:[2, 24], 18:[2, 24], 19:[2, 24], 20:[2, 24], 21:[2, 24], 22:[2, 24], 24:[2, 24], 25:[2, 24], 26:[2, 24], 27:[2, 24], 28:[2, 24], 29:[2, 24], 30:[2, 24], 31:[2, 24], 32:[2, 24], 33:[2, 24], 36:[2, 24], 38:[2, 24], 39:[2, 24], 40:[2, 24], 41:[2, 24], 42:[2, 24], 43:[2, 24]}, {5:[2, 25], 16:[2, 25], 18:[2, 25], 19:[2, 25], 20:[2, 25], 21:[2, 25], 22:[2, 25], 24:[2, 25], 25:[2, 25], 26:[2, 25], 27:[2, 25], 28:[2, 25], 29:[2, 25], 30:[2, 
  25], 31:[2, 25], 32:[2, 25], 33:[2, 25], 36:[2, 25], 38:[2, 25], 39:[2, 25], 40:[2, 25], 41:[2, 25], 42:[2, 25], 43:[2, 25]}, {5:[2, 26], 16:[2, 26], 18:[2, 26], 19:[2, 26], 20:[2, 26], 21:[2, 26], 22:[2, 26], 24:[2, 26], 25:[2, 26], 26:[2, 26], 27:[2, 26], 28:[2, 26], 29:[2, 26], 30:[2, 26], 31:[2, 26], 32:[2, 26], 33:[2, 26], 36:[2, 26], 38:[2, 26], 39:[2, 26], 40:[2, 26], 41:[2, 26], 42:[2, 26], 43:[2, 26]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 18:[1, 53], 
  19:[1, 29], 21:[1, 30], 23:54, 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 15], 29:[1, 16], 30:[1, 25], 31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 34], 41:[1, 35], 42:[1, 21], 43:[1, 20]}, {16:[2, 20], 18:[2, 20], 19:[2, 20], 20:[2, 20], 21:[2, 20], 22:[2, 20], 24:[2, 20], 25:[2, 20], 26:[2, 20], 27:[2, 20], 28:[2, 20], 29:[2, 20], 30:[2, 20], 31:[2, 20], 32:[2, 20], 33:[2, 20], 36:[2, 20], 38:[2, 20], 39:[2, 20], 40:[2, 20], 41:[2, 20], 
  42:[2, 20], 43:[2, 20]}, {16:[2, 22], 18:[2, 22], 19:[2, 22], 20:[2, 22], 21:[2, 22], 22:[2, 22], 24:[2, 22], 25:[2, 22], 26:[2, 22], 27:[2, 22], 28:[2, 22], 29:[2, 22], 30:[2, 22], 31:[2, 22], 32:[2, 22], 33:[2, 22], 36:[2, 22], 38:[2, 22], 39:[2, 22], 40:[2, 22], 41:[2, 22], 42:[2, 22], 43:[2, 22]}, {5:[2, 40], 16:[2, 40], 18:[2, 40], 19:[2, 40], 20:[2, 40], 21:[2, 40], 22:[2, 40], 24:[2, 40], 25:[2, 40], 26:[2, 40], 27:[2, 40], 28:[2, 40], 29:[2, 40], 30:[2, 40], 31:[2, 40], 32:[2, 40], 33:[2, 
  40], 36:[2, 40], 38:[2, 40], 39:[2, 40], 40:[2, 40], 41:[2, 40], 42:[2, 40], 43:[2, 40]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 18:[1, 55], 19:[1, 29], 21:[1, 30], 23:54, 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 15], 29:[1, 16], 30:[1, 25], 31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 34], 41:[1, 35], 42:[1, 21], 43:[1, 20]}, {5:[2, 15], 16:[2, 15], 18:[2, 15], 19:[2, 15], 20:[2, 15], 21:[2, 15], 22:[2, 
  15], 24:[2, 15], 25:[2, 15], 26:[2, 15], 27:[2, 15], 28:[2, 15], 29:[2, 15], 30:[2, 15], 31:[2, 15], 32:[2, 15], 33:[2, 15], 36:[2, 15], 38:[2, 15], 39:[2, 15], 40:[2, 15], 41:[2, 15], 42:[2, 15], 43:[2, 15]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 19:[1, 29], 20:[1, 56], 21:[1, 30], 23:54, 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 15], 29:[1, 16], 30:[1, 25], 31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 
  34], 41:[1, 35], 42:[1, 21], 43:[1, 20]}, {5:[2, 17], 16:[2, 17], 18:[2, 17], 19:[2, 17], 20:[2, 17], 21:[2, 17], 22:[2, 17], 24:[2, 17], 25:[2, 17], 26:[2, 17], 27:[2, 17], 28:[2, 17], 29:[2, 17], 30:[2, 17], 31:[2, 17], 32:[2, 17], 33:[2, 17], 36:[2, 17], 38:[2, 17], 39:[2, 17], 40:[2, 17], 41:[2, 17], 42:[2, 17], 43:[2, 17]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:17, 14:18, 15:19, 16:[1, 28], 19:[1, 29], 21:[1, 30], 22:[1, 57], 23:54, 24:[1, 11], 25:[1, 12], 26:[1, 13], 27:[1, 14], 28:[1, 
  15], 29:[1, 16], 30:[1, 25], 31:[1, 26], 32:[1, 27], 33:[1, 22], 34:23, 35:24, 36:[1, 31], 38:[1, 32], 39:[1, 33], 40:[1, 34], 41:[1, 35], 42:[1, 21], 43:[1, 20]}, {5:[2, 19], 16:[2, 19], 18:[2, 19], 19:[2, 19], 20:[2, 19], 21:[2, 19], 22:[2, 19], 24:[2, 19], 25:[2, 19], 26:[2, 19], 27:[2, 19], 28:[2, 19], 29:[2, 19], 30:[2, 19], 31:[2, 19], 32:[2, 19], 33:[2, 19], 36:[2, 19], 38:[2, 19], 39:[2, 19], 40:[2, 19], 41:[2, 19], 42:[2, 19], 43:[2, 19]}, {5:[2, 35], 16:[2, 35], 18:[2, 35], 19:[2, 35], 
  20:[2, 35], 21:[2, 35], 22:[2, 35], 24:[2, 35], 25:[2, 35], 26:[2, 35], 27:[2, 35], 28:[2, 35], 29:[2, 35], 30:[2, 35], 31:[2, 35], 32:[2, 35], 33:[2, 35], 36:[2, 35], 38:[2, 35], 39:[2, 35], 40:[2, 35], 41:[2, 35], 42:[2, 35], 43:[2, 35]}, {5:[2, 27], 16:[2, 27], 18:[2, 27], 19:[2, 27], 20:[2, 27], 21:[2, 27], 22:[2, 27], 24:[2, 27], 25:[2, 27], 26:[2, 27], 27:[2, 27], 28:[2, 27], 29:[2, 27], 30:[2, 27], 31:[2, 27], 32:[2, 27], 33:[2, 27], 36:[2, 27], 38:[2, 27], 39:[2, 27], 40:[2, 27], 41:[2, 
  27], 42:[2, 27], 43:[2, 27]}, {16:[2, 21], 18:[2, 21], 19:[2, 21], 20:[2, 21], 21:[2, 21], 22:[2, 21], 24:[2, 21], 25:[2, 21], 26:[2, 21], 27:[2, 21], 28:[2, 21], 29:[2, 21], 30:[2, 21], 31:[2, 21], 32:[2, 21], 33:[2, 21], 36:[2, 21], 38:[2, 21], 39:[2, 21], 40:[2, 21], 41:[2, 21], 42:[2, 21], 43:[2, 21]}, {5:[2, 14], 16:[2, 14], 18:[2, 14], 19:[2, 14], 20:[2, 14], 21:[2, 14], 22:[2, 14], 24:[2, 14], 25:[2, 14], 26:[2, 14], 27:[2, 14], 28:[2, 14], 29:[2, 14], 30:[2, 14], 31:[2, 14], 32:[2, 14], 
  33:[2, 14], 36:[2, 14], 38:[2, 14], 39:[2, 14], 40:[2, 14], 41:[2, 14], 42:[2, 14], 43:[2, 14]}, {5:[2, 16], 16:[2, 16], 18:[2, 16], 19:[2, 16], 20:[2, 16], 21:[2, 16], 22:[2, 16], 24:[2, 16], 25:[2, 16], 26:[2, 16], 27:[2, 16], 28:[2, 16], 29:[2, 16], 30:[2, 16], 31:[2, 16], 32:[2, 16], 33:[2, 16], 36:[2, 16], 38:[2, 16], 39:[2, 16], 40:[2, 16], 41:[2, 16], 42:[2, 16], 43:[2, 16]}, {5:[2, 18], 16:[2, 18], 18:[2, 18], 19:[2, 18], 20:[2, 18], 21:[2, 18], 22:[2, 18], 24:[2, 18], 25:[2, 18], 26:[2, 
  18], 27:[2, 18], 28:[2, 18], 29:[2, 18], 30:[2, 18], 31:[2, 18], 32:[2, 18], 33:[2, 18], 36:[2, 18], 38:[2, 18], 39:[2, 18], 40:[2, 18], 41:[2, 18], 42:[2, 18], 43:[2, 18]}], defaultActions:{3:[2, 2], 36:[2, 1]}, parseError:function parseError(str, hash) {
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
          return 33;
          break;
        case 4:
          this.string_buffer = yy_.yytext;
          break;
        case 5:
          this.begin("regex");
          break;
        case 6:
          this.popState();
          return 37;
          break;
        case 7:
          return 36;
          break;
        case 8:
          return 38;
          break;
        case 9:
          return 39;
          break;
        case 10:
          return 40;
          break;
        case 11:
          return 41;
          break;
        case 12:
          return 30;
          break;
        case 13:
          return 31;
          break;
        case 14:
          return 32;
          break;
        case 15:
          return 16;
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
          return"HASH_MAP_START";
          break;
        case 20:
          return 21;
          break;
        case 21:
          return 22;
          break;
        case 22:
          return 26;
          break;
        case 23:
          return 24;
          break;
        case 24:
          return 25;
          break;
        case 25:
          return 27;
          break;
        case 26:
          return 28;
          break;
        case 27:
          return 29;
          break;
        case 28:
          return 42;
          break;
        case 29:
          return 43;
          break;
        case 30:
          return 5;
          break;
        case 31:
          return"INVALID";
          break
      }
    };
    lexer.rules = [/^;.*/, /^\s+/, /^"/, /^"/, /^(\\"|[^"])*/, /^#\//, /^\/[a-zA-Z]*/, /^(\\\/|[^\/])*/, /^[+-]?[0-9]+(\.[0-9]+)?\b/, /^[+-]?#0[0-9]+\b/, /^[+-]?#x[0-9a-fA-F]+\b/, /^[+-]?#b[0-9]+\b/, /^#(n|N)/, /^#(t|T)/, /^#(f|F)/, /^\(/, /^\)/, /^\[/, /^\]/, /^#\{/, /^\{/, /^\}/, /^~/, /^'/, /^`/, /^\.\.\./, /^#\(/, /^%\d+/, /^:/, /^[\w@#\.:!\$%\^&\*\-\+='"\?\|\/\\<>,]+/, /^$/, /^./];
    lexer.conditions = {"string":{"rules":[3, 4], "inclusive":false}, "regex":{"rules":[6, 7], "inclusive":false}, "INITIAL":{"rules":[0, 1, 2, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], "inclusive":true}};
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
;(function() {
  var JS_ILLEGAL_IDENTIFIER_CHARS, JS_KEYWORDS, began, binary_fn, compare_fn, compile, compiler, destructure_list, end_final_var_group, end_var_group, first_var_group, gensym, get_raw_text, initialize_var_groups, is_keyword, is_quoted, is_splat, is_string, is_symbol, is_unquote, last_var_group, make_error, math_fn, new_var_group, objectSet, oppo, quote_escape, raise, raiseDefError, raiseParseError, read, read_compile, recursive_map, restructure_list, to_js_symbol, to_list, to_quoted, to_symbol, trim, 
  _is, _ref, _ref2, _ref3, __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) {
    for(var i = 0, l = this.length;i < l;i++) {
      if(i in this && this[i] === item) {
        return i
      }
    }
    return-1
  };
  if(typeof global === "undefined" || global === null) {
    global = window
  }
  if(typeof _ === "undefined" || _ === null) {
    _ = require("underscore")
  }
  JS_KEYWORDS = ["break", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "export", "extends", "finally", "for", "function", "if", "implements", "import", "in", "instanceof", "interface", "label", "let", "new", "package", "private", "protected", "public", "return", "static", "switch", "super", "this", "throw", "try", "catch", "typeof", "undefined", "var", "void", "while", "with", "yield"];
  JS_ILLEGAL_IDENTIFIER_CHARS = {"~":"tilde", "`":"backtick", "!":"exclmark", "@":"at", "#":"pound", "%":"percent", "^":"carat", "&":"amperstand", "*":"star", "(":"oparen", ")":"cparen", "-":"dash", "+":"plus", "=":"equals", "{":"ocurly", "}":"ccurly", "[":"osquare", "]":"csquare", "|":"pipe", "\\":"bslash", '"':"dblquote", "'":"snglquote", ":":"colon", ";":"semicolon", "<":"oangle", ">":"rangle", ",":"comma", ".":"dot", "?":"qmark", "/":"fslash", " ":"space", "\t":"tab", "\n":"newline", "\r":"return", 
  "\u000b":"vertical", "\x00":"null"};
  _is = function(what, x) {
    var _ref;
    return(x != null ? (_ref = x[0]) != null ? _ref[1] : void 0 : void 0) === what
  };
  is_splat = function(s) {
    return _is("splat", s)
  };
  is_unquote = function(u) {
    return _is("unquote", u)
  };
  is_quoted = function(q) {
    return _is("quote", q)
  };
  is_keyword = function(k) {
    return _is("keyword", k)
  };
  is_string = function(s) {
    return _.isString(s) && /^"/.test(s) && /"$/.test(s)
  };
  is_symbol = function(s) {
    return(s != null ? s[0] : void 0) === "symbol"
  };
  to_symbol = function(s) {
    return["symbol", s]
  };
  to_quoted = function(x) {
    return[to_symbol("quote"), x]
  };
  to_list = function(ls) {
    return[to_symbol("list")].concat(__slice.call(ls))
  };
  quote_escape = function(x) {
    var ret;
    ret = x;
    if(_.isString(x)) {
      ret = x.replace(/\\/g, "\\\\")
    }
    return ret
  };
  get_raw_text = function(s) {
    if(is_quoted(s)) {
      s = oppo.eval(s)
    }
    if(_.isString(s)) {
      return s
    }else {
      return s[1]
    }
  };
  objectSet = function(o, s, v) {
    var get, path, ret, _final, _ref;
    if(arguments.length < 3) {
      _ref = [o, s, null], s = _ref[0], v = _ref[1], o = _ref[2]
    }
    if(o == null) {
      o = global
    }
    path = (s != null ? s : "").split(".");
    _final = path.pop();
    get = function(o, k) {
      var _ref2;
      return(_ref2 = o[k]) != null ? _ref2 : o[k] = {}
    };
    ret = _.reduce(path, get, o);
    return ret[_final] = v
  };
  recursive_map = function(ls, fn, pass_back, parent, parent_index) {
    if(pass_back == null) {
      pass_back = function(item) {
        return!_.isArray(item)
      }
    }
    return _.map(ls, function(item, i, ls) {
      if(pass_back(item)) {
        return fn(item, i, ls, parent, parent_index)
      }else {
        return recursive_map(item, fn, pass_back, ls, i)
      }
    })
  };
  to_js_symbol = function(ident) {
    var keyword, replaced, _char, _i, _len;
    for(_i = 0, _len = JS_KEYWORDS.length;_i < _len;_i++) {
      keyword = JS_KEYWORDS[_i];
      ident = ident === keyword ? "_" + ident + "_" : ident
    }
    ident = ident.replace(/\-/g, "_");
    for(_char in JS_ILLEGAL_IDENTIFIER_CHARS) {
      if(!__hasProp.call(JS_ILLEGAL_IDENTIFIER_CHARS, _char)) {
        continue
      }
      replaced = JS_ILLEGAL_IDENTIFIER_CHARS[_char];
      while(ident.indexOf(_char) >= 0) {
        ident = ident.replace(_char, "_" + replaced + "_")
      }
    }
    return ident.toLowerCase()
  };
  gensym = function(sym) {
    var c_sym, num, time;
    if(sym == null) {
      sym = "gen"
    }
    c_sym = compile([to_symbol("symbol"), sym]);
    time = (+new Date).toString(32);
    num = Math.floor(Math.random() * 1E10).toString(32);
    return"" + c_sym + "_" + time + "_" + num
  };
  trim = (_ref = String.prototype.trim) != null ? _ref : function() {
    return this.replace(/^\s+/, "").replace(/\s+$/, "")
  };
  make_error = function(name, message) {
    var BaseError, err, _ref2;
    if(arguments.length === 1) {
      _ref2 = [name, null], message = _ref2[0], name = _ref2[1]
    }
    BaseError = _.isFunction(name) ? name : Error;
    err = new BaseError;
    if(name != null) {
      err.name = name
    }
    if(message != null) {
      err.message = message
    }
    return err
  };
  raise = function() {
    throw make_error.apply(null, arguments);
  };
  raiseParseError = function(expr) {
    return raise("ParseError", "Can't parse expression: " + expr)
  };
  raiseDefError = function(name) {
    return raise("DefError", "Can't define previously defined value: " + name)
  };
  _ref2 = [], new_var_group = _ref2[0], first_var_group = _ref2[1], last_var_group = _ref2[2], end_var_group = _ref2[3], end_final_var_group = _ref2[4], initialize_var_groups = _ref2[5];
  (function() {
    var var_groups;
    var_groups = null;
    initialize_var_groups = function() {
      return var_groups = [[]]
    };
    initialize_var_groups();
    new_var_group = function() {
      var ret;
      var_groups.push(ret = []);
      return ret
    };
    first_var_group = function() {
      return var_groups[0]
    };
    last_var_group = function() {
      return _.last(var_groups)
    };
    end_var_group = function() {
      var ret;
      ret = var_groups.pop();
      return ret
    };
    return end_final_var_group = function() {
      var ret;
      if(var_groups.length !== 1) {
        raise("VarGroupsError", "Expecting 1 final var group, got " + var_groups.length + " instead")
      }
      ret = end_var_group();
      initialize_var_groups();
      return ret
    }
  })();
  destructure_list = function(pattern, sourceName) {
    var c_item, compiled, has_splat, i, item, oldSourceIndex, patternLen, result, sourceIndex, _len;
    result = [];
    has_splat = false;
    patternLen = pattern.length;
    sourceIndex = {value:0, toString:function() {
      var num, numStr;
      if(this.value >= 0) {
        return"" + this.value
      }else {
        num = this.value * -1 - 1;
        numStr = num ? " - " + num : "";
        return"" + sourceName + ".length" + numStr
      }
    }};
    for(i = 0, _len = pattern.length;i < _len;i++) {
      item = pattern[i];
      if(is_splat(item)) {
        has_splat = true;
        c_item = compile(item[1]);
        oldSourceIndex = "" + sourceIndex;
        sourceIndex.value = (patternLen - i) * -1;
        result.push([c_item, "Array.prototype.slice.call(" + sourceName + ", " + oldSourceIndex + ", " + sourceIndex + ")"])
      }else {
        compiled = [compile(item), "" + sourceName + "[" + sourceIndex + "]"];
        sourceIndex.value++;
        if(!is_symbol(item) && item instanceof Array) {
          result = result.concat(destructure_list(item, sourceName))
        }else {
          result.push(compiled)
        }
      }
    }
    if(has_splat) {
      return result
    }else {
      return[]
    }
  };
  restructure_list = function(pattern, sourceName) {
    var c_item, concatArgs, do_slice, i, ident, item, new_ident, restructured, result, slice_start, _len;
    ident = gensym(sourceName);
    concatArgs = [];
    result = [to_symbol(ident)];
    slice_start = null;
    do_slice = function() {
      if(slice_start != null) {
        concatArgs.push("" + sourceName + ".slice(" + slice_start + ", " + i + ")");
        return slice_start = null
      }
    };
    for(i = 0, _len = pattern.length;i < _len;i++) {
      item = pattern[i];
      if(is_splat(item)) {
        do_slice();
        c_item = compile(item[1]);
        concatArgs.push(c_item)
      }else {
        if(is_unquote(item)) {
          do_slice();
          c_item = compile(item[1]);
          concatArgs.push("[" + c_item + "]")
        }else {
          if(_.isArray(item) && !is_symbol(item)) {
            do_slice();
            new_ident = "" + sourceName + "[" + i + "]";
            restructured = restructure_list(item, new_ident);
            concatArgs.push("[" + restructured[1] + "]")
          }else {
            if(!(slice_start != null)) {
              slice_start = i
            }
          }
        }
      }
    }
    do_slice();
    result.push("[].concat(" + concatArgs.join(", ") + ")");
    return result
  };
  if(typeof parser === "undefined" || parser === null) {
    parser = require("./parser")
  }
  oppo = typeof exports !== "undefined" && exports !== null ? exports : global.oppo = {};
  compiler = (_ref3 = oppo.compiler) != null ? _ref3 : oppo.compiler = {};
  read = oppo.read = function(string) {
    return parser.parse(string)
  };
  began = false;
  oppo.compile = function(sexp, with_oppo_core) {
    var args, corename, fn, macro, ret, top_level, vars;
    if(sexp == null) {
      sexp = null
    }
    if(!began) {
      top_level = began = true
    }
    if(sexp === null || sexp === true || sexp === false || _.isNumber(sexp)) {
      ret = "" + sexp
    }else {
      if(is_symbol(sexp)) {
        ret = to_js_symbol(sexp[1])
      }else {
        if(_.isString(sexp)) {
          ret = '"' + sexp.replace(/\n/g, "\\n") + '"'
        }else {
          if(_.isFunction(sexp)) {
            ret = "" + sexp
          }else {
            if(_.isArray(sexp)) {
              fn = compile(_.first(sexp));
              args = sexp.slice(1);
              if(macro = compiler[fn]) {
                ret = macro.apply(null, args)
              }else {
                ret = compiler.call.apply(compiler, [[to_symbol("js-eval"), fn]].concat(__slice.call(args)))
              }
            }else {
              raiseParseError(sexp)
            }
          }
        }
      }
    }
    if(with_oppo_core !== false) {
      corename = "oppo/core";
      ret = "with (oppo.module.require('" + corename + "')) {\n  " + ret + "\n}"
    }
    if(top_level || !began) {
      began = false;
      vars = end_final_var_group();
      if(vars.length) {
        ret = "var " + vars.join(", ") + ";\n" + ret + ";"
      }
    }
    return ret
  };
  compile = function(sexp) {
    return oppo.compile(sexp, false)
  };
  oppo.eval = _.compose(_.bind(global.eval, global), compile);
  read_compile = _.compose(compile, oppo.read);
  compiler.js_map = function() {
    var add_ons, c_value, e_key, i, item, item_added, last, ret, sexp, sym, _len;
    sexp = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    sym = gensym("obj");
    add_ons = [];
    item_added = false;
    ret = "{ ";
    for(i = 0, _len = sexp.length;i < _len;i++) {
      item = sexp[i];
      if(i % 2 === 0) {
        if(is_quoted(item) && is_symbol(e_key = oppo.eval(item))) {
          ret += "" + compile(e_key) + " : "
        }else {
          if(_.isString(item) || is_keyword(item)) {
            ret += "" + compile(item) + " : "
          }else {
            if(_.isNumber(item) && !_.isNaN(item)) {
              ret += '"' + compile(item) + '" : '
            }else {
              item_added = true;
              add_ons.push("" + sym + "[" + compile(item) + "] = ")
            }
          }
        }
      }else {
        c_value = compile(item);
        if(!item_added) {
          ret += "" + c_value + ",\n"
        }else {
          item_added = false;
          last = add_ons.pop();
          last += c_value;
          add_ons.push(last)
        }
      }
    }
    ret = ret.replace(/(\s|,\s)$/, " }");
    if(!add_ons.length) {
      return ret
    }else {
      add_ons = _.map(add_ons, function(x) {
        return[to_symbol("js-eval"), x]
      });
      add_ons.unshift(to_symbol("do"));
      add_ons.push(["symbol", sym]);
      return ret = "(function (" + sym + ") {\n  return " + compile(add_ons) + ";\n})(" + ret + ")"
    }
  };
  compiler.list = function() {
    var c_sexp, sexp;
    sexp = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    c_sexp = _.map(sexp, compile);
    return"[" + c_sexp.join(", ") + "]"
  };
  compiler[to_js_symbol(".")] = function() {
    var base, c_base, e_name, name, names, ret, _i, _len;
    base = arguments[0], names = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    c_base = compile(base);
    ret = c_base;
    for(_i = 0, _len = names.length;_i < _len;_i++) {
      name = names[_i];
      e_name = null;
      if(is_quoted(name)) {
        e_name = oppo.eval(name)
      }
      if(e_name != null && is_symbol(e_name)) {
        ret += "." + compile(e_name)
      }else {
        ret += "[" + compile(name) + "]"
      }
    }
    return ret
  };
  (function() {
    var get_args;
    get_args = function(args) {
      var body, destructure, vars, _i, _len, _var;
      if(args == null) {
        args = []
      }
      if(args === "null") {
        args = []
      }
      destructure = _.any(args, is_splat);
      if(destructure) {
        vars = destructure_list(args, "arguments");
        args = [];
        body = [];
        for(_i = 0, _len = vars.length;_i < _len;_i++) {
          _var = vars[_i];
          body.push(read("(var " + _var[0] + ' (js-eval "' + _var[1] + '"))'))
        }
      }else {
        args = args.map(function(arg) {
          return compile(arg)
        });
        body = []
      }
      return[args || [], body || []]
    };
    compiler.lambda = function() {
      var args, argsbody, body, ret, var_stmt, vars, _ref4;
      args = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      new_var_group();
      _ref4 = get_args(args), args = _ref4[0], argsbody = _ref4[1];
      body = argsbody.concat(body);
      body = _.map(body, compile);
      vars = end_var_group();
      var_stmt = vars.length ? "var " + vars.join(", ") + ";\n" : "";
      return ret = "(function (" + args.join(", ") + ") {\n  " + var_stmt + "return " + body.join(", ") + ";\n})"
    };
    return compiler.fn = compiler.lambda
  })();
  compiler.call = function() {
    var args, c_args, c_fn, fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    c_fn = compile(fn);
    c_args = _.map(args, compile);
    return"" + c_fn + "(" + c_args.join(", ") + ")"
  };
  compiler.apply = function() {
    var args, c_args, c_fn, fn, fn_base, spl_fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    c_fn = compile(fn);
    spl_fn = c_fn.split(".");
    spl_fn.pop();
    fn_base = spl_fn.join(".");
    c_args = _.map(args, compile);
    return"" + c_fn + ".apply(" + (fn_base || null) + ", [].concat(" + c_args.join(", ") + "))"
  };
  compiler[to_js_symbol("let")] = function() {
    var body, i, len, let_fn, names_vals, ret, vars;
    names_vals = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    vars = [];
    i = 0;
    len = names_vals.length;
    while(i < len) {
      vars.push([to_symbol("var"), names_vals[i++], names_vals[i++]])
    }
    body = vars.concat(body);
    let_fn = [to_symbol("lambda"), []].concat(__slice.call(body));
    return ret = "" + compile(let_fn) + '.apply(this, typeof arguments !== "undefined" ? arguments : [])'
  };
  compiler[to_js_symbol("new")] = function() {
    var args, c_args, c_cls, cls;
    cls = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    c_cls = compile(cls);
    c_args = _.map(args, compile);
    return"new " + c_cls + "(" + c_args.join(", ") + ")"
  };
  compiler.eval = function(sexp) {
    var c_sexp;
    c_sexp = compile(sexp);
    return"eval(oppo.compile(" + c_sexp + "))"
  };
  compiler.quote = function(sexp) {
    var q_sexp, ret, s_sexp;
    sexp = quote_escape(sexp);
    ret = !(sexp != null) ? null : void 0;
    if(_.isBoolean(sexp)) {
      return sexp
    }else {
      if(is_symbol(sexp)) {
        return compile(to_list(sexp))
      }else {
        if(_.isArray(sexp)) {
          q_sexp = _.map(sexp, to_quoted);
          return compile(to_list(q_sexp))
        }else {
          if(_.isNumber(sexp)) {
            return sexp
          }else {
            s_sexp = "" + sexp;
            return'"' + s_sexp.replace(/"/g, '\\"') + '"'
          }
        }
      }
    }
  };
  compiler.symbol = function(sym) {
    var e_sym;
    e_sym = eval(compile([to_symbol("str"), sym]));
    return compile(to_symbol(e_sym))
  };
  compiler.js_eval = function(js) {
    var c_js, e_js, ret;
    c_js = compile(js);
    if(is_string(c_js)) {
      e_js = c_js.substr(1, c_js.length - 2);
      e_js = e_js.replace(/\\?"/g, '\\"');
      return ret = eval('"' + e_js + '"')
    }else {
      return ret = "eval(" + c_js + ")"
    }
  };
  compiler[to_js_symbol("do")] = function() {
    var body, compiled_body, ret;
    body = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    compiled_body = _.map(arguments, compile);
    ret = compiled_body.join(",\n");
    return"(" + ret + ")"
  };
  compiler[to_js_symbol("if")] = function(test, t, f) {
    var c_f, c_t, c_test, cond, sym, _ref4;
    if(arguments.length === 2) {
      Array.prototype.push.call(arguments, f)
    }
    _ref4 = _.map(arguments, compile), c_test = _ref4[0], c_t = _ref4[1], c_f = _ref4[2];
    sym = gensym("cond");
    cond = compile([to_symbol("var"), to_symbol(sym), test]);
    return"/* if */ ((" + cond + ") !== false && " + sym + " !== null && " + sym + " !== '' ?\n  " + compile(t) + " :\n  " + compile(f) + ")\n/* end if */"
  };
  compiler.regex = function(body, modifiers) {
    return"/" + body + "/" + (modifiers != null ? modifiers : "")
  };
  compiler[to_js_symbol("undefined?")] = function(x) {
    var c_x;
    c_x = compile(x);
    return"(typeof " + c_x + " === 'undefined')"
  };
  compiler[to_js_symbol("defined?")] = function(x) {
    var c_x;
    c_x = compile(x);
    return"(typeof " + c_x + " !== 'undefined')"
  };
  (function() {
    var adjust_environment, def, defmacro, restore_environment, set;
    def = null;
    defmacro = null;
    set = null;
    adjust_environment = function(module_name, self_name) {
      def = compiler.def;
      compiler.def = function(name, value) {
        var _name;
        _name = is_symbol(name) ? [to_symbol("."), self_name, [to_symbol("quote"), name]] : name;
        return def(_name, value)
      };
      defmacro = compiler.defmacro;
      compiler.defmacro = function() {
        var name, rest, _name;
        name = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        _name = is_symbol(name) ? [to_symbol("."), module_name, [to_symbol("quote"), name]] : name;
        return defmacro.apply(null, [name].concat(__slice.call(rest)))
      };
      set = compiler[to_js_symbol("set!")];
      return compiler[to_js_symbol("set!")] = function(name, value) {
        if(_.isEqual(name, self_name)) {
          throw"Can't redefine 'self' in a module.";
        }else {
          return set(name, value)
        }
      }
    };
    restore_environment = function() {
      var _ref4, _ref5, _ref6;
      _ref4 = [def], compiler.def = _ref4[0], def = _ref4[1];
      _ref5 = [defmacro], compiler.defmacro = _ref5[0], defmacro = _ref5[1];
      return _ref6 = [set], compiler[to_js_symbol("set!")] = _ref6[0], set = _ref6[1], _ref6
    };
    compiler.defmodule = function() {
      var args, body, c_body, c_deps, current_var_group, define_self, deps, name, r_deps, r_name, ret, self_name, var_smt;
      name = arguments[0], deps = arguments[1], body = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if(deps == null) {
        deps = []
      }
      new_var_group();
      r_name = compile(get_raw_text(name));
      r_deps = _.map(deps, _.compose(compile, get_raw_text));
      c_deps = compile([to_symbol("quote"), r_deps]);
      args = _.map(deps, compile);
      self_name = to_symbol("self");
      define_self = compile([to_symbol("var"), self_name, [to_symbol("js-eval"), "this"]]);
      adjust_environment(name, self_name);
      body = body.length ? body : [null];
      c_body = compile([to_symbol("do")].concat(__slice.call(body)));
      current_var_group = last_var_group();
      var_smt = "var " + current_var_group.join(", ") + ";";
      end_var_group();
      restore_environment();
      return ret = "oppo.module(" + r_name + ", " + c_deps + ", function (" + args.join(", ") + ") {\n  " + var_smt + "\n  with (" + define_self + ") {\n    return " + c_body + ";\n  }\n})"
    };
    return compiler.require = function() {
      var c_names, name, names, r_name;
      names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      c_names = function() {
        var _i, _len, _results;
        _results = [];
        for(_i = 0, _len = names.length;_i < _len;_i++) {
          name = names[_i];
          r_name = get_raw_text(name);
          _results.push("oppo.module.require(" + compile(r_name) + ")")
        }
        return _results
      }();
      return c_names.join(",\n")
    }
  })();
  compiler.gensym = function() {
    var ret, sym;
    sym = gensym.apply(null, arguments);
    return ret = compile([to_symbol("quote"), to_symbol(sym)])
  };
  compiler[to_js_symbol("var")] = function(name, value, current_group) {
    var c_name, c_value;
    if(current_group == null) {
      current_group = last_var_group()
    }
    c_name = compile(name);
    c_value = compile(value);
    if(__indexOf.call(current_group, c_name) >= 0) {
      raiseDefError(c_name)
    }
    current_group.push(c_name);
    return"" + c_name + " = " + c_value
  };
  compiler.def = function(name, value) {
    var c_name, c_value, err, first_group, ret, _var;
    _var = compiler[to_js_symbol("var")];
    first_group = first_var_group();
    c_name = compile(name);
    if(c_name === to_js_symbol(c_name)) {
      return ret = _var(name, value, first_group)
    }else {
      c_value = compile(value);
      err = read_compile("(throw \"Can't define variable that is already defined: " + c_name + '")');
      return ret = "/* def " + c_name + " */ (typeof " + c_name + " === 'undefined' ?\n  (" + c_name + " = " + c_value + ") :\n  " + err + ")\n/* end def " + c_name + " */"
    }
  };
  compiler[to_js_symbol("set!")] = function(name, value) {
    var c_name, c_value, err, ret;
    c_name = compile(name);
    c_value = compile(value);
    err = read_compile("(throw \"Can't set variable that has not been defined: " + c_name + '")');
    return ret = "/* set! " + c_name + " */ (typeof " + c_name + " !== 'undefined' ?\n  (" + c_name + " = " + c_value + ") :\n  " + err + ")\n/* end set! " + c_name + " */"
  };
  math_fn = function(fn, symbol) {
    return compiler[to_js_symbol(fn)] = function() {
      var c_nums, nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      c_nums = _.map(nums, compile);
      return c_nums.join(" " + (symbol || fn) + " ")
    }
  };
  math_fn("+");
  math_fn("-");
  math_fn("*");
  math_fn("/");
  math_fn("%");
  binary_fn = function(fn, symbol) {
    return compiler[to_js_symbol(fn)] = function() {
      var c_nums, nums, ret;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      c_nums = _.map(nums, compile);
      ret = c_nums.join(" " + (symbol || fn) + " ");
      return"(" + ret + ")"
    }
  };
  binary_fn("||");
  binary_fn("&&");
  compare_fn = function(fn, symbol) {
    return compiler[to_js_symbol(fn)] = function() {
      var c_items, item, items, last, ret, _i, _len, _ref4;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      c_items = _.map(items, compile);
      ret = [];
      last = c_items[0];
      _ref4 = c_items.slice(1);
      for(_i = 0, _len = _ref4.length;_i < _len;_i++) {
        item = _ref4[_i];
        ret.push("" + last + " " + (symbol || fn) + " " + item);
        last = item
      }
      ret.join(" && ");
      return"(" + ret + ")"
    }
  };
  compare_fn("<");
  compare_fn(">");
  compare_fn("<=");
  compare_fn(">=");
  compare_fn("==");
  compare_fn("not==", "!=");
  compare_fn("===");
  compare_fn("not===", "!==");
  compiler[to_js_symbol("throw")] = function(err) {
    var c_err;
    c_err = compile(err);
    return"(function () { throw " + c_err + " })()"
  };
  (function() {
    var mc_expand, mc_expand_1;
    mc_expand = false;
    mc_expand_1 = false;
    compiler.defmacro = function() {
      var argnames, c_name, name, template;
      name = arguments[0], argnames = arguments[1], template = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if(argnames == null) {
        argnames = []
      }
      c_name = compile(name);
      compiler[c_name] = function() {
        var evald, js, q_args, sexp;
        q_args = _.map(arguments, to_quoted);
        sexp = [[to_symbol("lambda"), argnames].concat(template)].concat(q_args);
        js = oppo.compile(sexp);
        evald = eval(js);
        if(!mc_expand && !mc_expand_1) {
          return oppo.compile(evald)
        }else {
          mc_expand_1 = false;
          return evald
        }
      };
      return compile([to_symbol("def"), name, [to_symbol("js-eval"), "(function () {\n  return eval(oppo.compiler." + c_name + ".apply(this, arguments));\n})"]])
    };
    compiler.macroexpand = function(sexp) {
      var old_mc_expand, ret;
      old_mc_expand = mc_expand;
      mc_expand = true;
      ret = compile(sexp);
      ret = compile(to_quoted(ret));
      mc_expand = old_mc_expand;
      return ret
    };
    compiler.macroexpand_1 = function(sexp) {
      var ret;
      mc_expand_1 = true;
      ret = compile(sexp);
      ret = compile(to_quoted(ret));
      mc_expand_1 = false;
      return ret
    };
    return compiler.syntax_quote = function(list) {
      var code, ident, q_list, restructured_list, ret, sym;
      sym = to_symbol;
      ident = gensym("list");
      restructured_list = restructure_list(list, ident);
      restructured_list[1] = [sym("js-eval"), restructured_list[1]];
      q_list = to_quoted(list);
      code = [[sym("lambda"), [sym(ident)], [sym("var")].concat(__slice.call(restructured_list))], q_list];
      return ret = compile(code)
    }
  })();
  compiler.str = function() {
    var c_strs, first_is_str, initial_str, strs;
    strs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    first_is_str = null;
    if(strs.length === 0) {
      strs.push("")
    }
    c_strs = _.map(strs, function(s) {
      var c_s;
      if(is_quoted(s) && is_symbol(s[1])) {
        s = to_js_symbol(s[1][1])
      }
      c_s = compile(s);
      if(first_is_str == null) {
        first_is_str = is_string(c_s)
      }
      return c_s
    });
    initial_str = first_is_str ? "" : '"" + ';
    return"" + initial_str + c_strs.join(" + ")
  };
  compiler.keyword = function(key) {
    var e_key;
    if(is_quoted(key) && is_symbol(e_key = oppo.eval(key))) {
      return compile(e_key[1])
    }else {
      if(_.isString(key)) {
        return compile(key)
      }else {
        return compile([to_symbol("str"), key])
      }
    }
  }
}).call(this);

