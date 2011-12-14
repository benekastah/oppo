var parser = function() {
  var parser = {trace:function trace() {
  }, yy:{}, symbols_:{"error":2, "program":3, "s_expression_list":4, "EOF":5, "s_expression":6, "special_form":7, "list":8, "js_map":9, "symbol":10, "splat":11, "literal":12, "atom":13, "callable_list":14, "typed_list":15, "hash_map":16, "(":17, "element_list":18, ")":19, "[":20, "]":21, "HASH_MAP_START":22, "MAP_END":23, "JS_MAP_START":24, "element":25, "SPLAT":26, "QUOTE":27, "SYNTAX_QUOTE":28, "FUNCTION":29, "INFIX":30, "NIL":31, "BOOLEAN_TRUE":32, "BOOLEAN_FALSE":33, "STRING":34, "number":35, 
  "DECIMAL_NUMBER":36, "OCTAL_NUMBER":37, "HEXIDECIMAL_NUMBER":38, "IDENTIFIER":39, ":":40, "@":41, "$accept":0, "$end":1}, terminals_:{2:"error", 5:"EOF", 17:"(", 19:")", 20:"[", 21:"]", 22:"HASH_MAP_START", 23:"MAP_END", 24:"JS_MAP_START", 26:"SPLAT", 27:"QUOTE", 28:"SYNTAX_QUOTE", 29:"FUNCTION", 30:"INFIX", 31:"NIL", 32:"BOOLEAN_TRUE", 33:"BOOLEAN_FALSE", 34:"STRING", 36:"DECIMAL_NUMBER", 37:"OCTAL_NUMBER", 38:"HEXIDECIMAL_NUMBER", 39:"IDENTIFIER", 40:":", 41:"@"}, productions_:[0, [3, 2], [4, 
  1], [4, 2], [6, 1], [6, 1], [6, 1], [6, 1], [6, 1], [6, 1], [6, 1], [8, 1], [8, 1], [8, 1], [14, 3], [14, 2], [15, 3], [15, 2], [16, 3], [16, 2], [9, 3], [9, 2], [18, 1], [18, 2], [25, 1], [11, 2], [7, 2], [7, 2], [7, 3], [7, 3], [13, 1], [13, 1], [13, 1], [12, 1], [12, 1], [35, 1], [35, 1], [35, 1], [10, 1], [10, 2], [10, 2]], performAction:function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
    var $0 = $$.length - 1;
    switch(yystate) {
      case 1:
        return["program"].concat($$[$0 - 1]);
        break;
      case 2:
        this.$ = [$$[$0]];
        break;
      case 3:
        this.$ = $$[$0 - 1];
        this.$.push($$[$0]);
        break;
      case 14:
        this.$ = $$[$0 - 1];
        break;
      case 15:
        this.$ = [];
        break;
      case 16:
        this.$ = ["typed-list"].concat($$[$0 - 1]);
        break;
      case 17:
        this.$ = ["typed-list"];
        break;
      case 18:
        this.$ = ["hash-map"].concat($$[$0 - 1]);
        break;
      case 19:
        this.$ = ["hash-map"];
        break;
      case 20:
        this.$ = ["map"].concat($$[$0 - 1]);
        break;
      case 21:
        this.$ = ["map"];
        break;
      case 22:
        this.$ = [$$[$0]];
        break;
      case 23:
        this.$ = $$[$0 - 1];
        this.$.push($$[$0]);
        break;
      case 25:
        this.$ = ["splat", $$[$0]];
        break;
      case 26:
        this.$ = ["quote", $$[$0]];
        break;
      case 27:
        this.$ = ["syntaxQuote", $$[$0]];
        break;
      case 28:
        this.$ = ["lambda", [], $$[$0 - 1]];
        break;
      case 29:
        this.$ = ["infix", $$[$0 - 1]];
        break;
      case 30:
        this.$ = null;
        break;
      case 31:
        this.$ = true;
        break;
      case 32:
        this.$ = false;
        break;
      case 33:
        this.$ = '"' + yytext.substr(1, yytext.length - 2).replace(/"/g, '\\"') + '"';
        break;
      case 35:
        this.$ = Number(yytext, 10);
        break;
      case 36:
        this.$ = parseInt(yytext.replace(/^#/, ""), 8);
        break;
      case 37:
        this.$ = parseInt(yytext.replace(/^#/, ""), 16);
        break;
      case 38:
        this.$ = yytext;
        break;
      case 39:
        this.$ = ["keyword", $$[$0]];
        break;
      case 40:
        this.$ = [".", "self", $$[$0]];
        break
    }
  }, table:[{3:1, 4:2, 6:3, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 20:[1, 29], 22:[1, 30], 24:[1, 18], 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {1:[3]}, {5:[1, 34], 6:35, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 20:[1, 29], 22:[1, 30], 24:[1, 18], 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 
  13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {5:[2, 2], 17:[2, 2], 20:[2, 2], 22:[2, 2], 24:[2, 2], 26:[2, 2], 27:[2, 2], 28:[2, 2], 29:[2, 2], 30:[2, 2], 31:[2, 2], 32:[2, 2], 33:[2, 2], 34:[2, 2], 36:[2, 2], 37:[2, 2], 38:[2, 2], 39:[2, 2], 40:[2, 2], 41:[2, 2]}, {5:[2, 4], 17:[2, 4], 19:[2, 4], 20:[2, 4], 21:[2, 4], 22:[2, 4], 23:[2, 4], 24:[2, 4], 26:[2, 4], 27:[2, 4], 28:[2, 4], 29:[2, 4], 30:[2, 
  4], 31:[2, 4], 32:[2, 4], 33:[2, 4], 34:[2, 4], 36:[2, 4], 37:[2, 4], 38:[2, 4], 39:[2, 4], 40:[2, 4], 41:[2, 4]}, {5:[2, 5], 17:[2, 5], 19:[2, 5], 20:[2, 5], 21:[2, 5], 22:[2, 5], 23:[2, 5], 24:[2, 5], 26:[2, 5], 27:[2, 5], 28:[2, 5], 29:[2, 5], 30:[2, 5], 31:[2, 5], 32:[2, 5], 33:[2, 5], 34:[2, 5], 36:[2, 5], 37:[2, 5], 38:[2, 5], 39:[2, 5], 40:[2, 5], 41:[2, 5]}, {5:[2, 6], 17:[2, 6], 19:[2, 6], 20:[2, 6], 21:[2, 6], 22:[2, 6], 23:[2, 6], 24:[2, 6], 26:[2, 6], 27:[2, 6], 28:[2, 6], 29:[2, 6], 
  30:[2, 6], 31:[2, 6], 32:[2, 6], 33:[2, 6], 34:[2, 6], 36:[2, 6], 37:[2, 6], 38:[2, 6], 39:[2, 6], 40:[2, 6], 41:[2, 6]}, {5:[2, 7], 17:[2, 7], 19:[2, 7], 20:[2, 7], 21:[2, 7], 22:[2, 7], 23:[2, 7], 24:[2, 7], 26:[2, 7], 27:[2, 7], 28:[2, 7], 29:[2, 7], 30:[2, 7], 31:[2, 7], 32:[2, 7], 33:[2, 7], 34:[2, 7], 36:[2, 7], 37:[2, 7], 38:[2, 7], 39:[2, 7], 40:[2, 7], 41:[2, 7]}, {5:[2, 8], 17:[2, 8], 19:[2, 8], 20:[2, 8], 21:[2, 8], 22:[2, 8], 23:[2, 8], 24:[2, 8], 26:[2, 8], 27:[2, 8], 28:[2, 8], 29:[2, 
  8], 30:[2, 8], 31:[2, 8], 32:[2, 8], 33:[2, 8], 34:[2, 8], 36:[2, 8], 37:[2, 8], 38:[2, 8], 39:[2, 8], 40:[2, 8], 41:[2, 8]}, {5:[2, 9], 17:[2, 9], 19:[2, 9], 20:[2, 9], 21:[2, 9], 22:[2, 9], 23:[2, 9], 24:[2, 9], 26:[2, 9], 27:[2, 9], 28:[2, 9], 29:[2, 9], 30:[2, 9], 31:[2, 9], 32:[2, 9], 33:[2, 9], 34:[2, 9], 36:[2, 9], 37:[2, 9], 38:[2, 9], 39:[2, 9], 40:[2, 9], 41:[2, 9]}, {5:[2, 10], 17:[2, 10], 19:[2, 10], 20:[2, 10], 21:[2, 10], 22:[2, 10], 23:[2, 10], 24:[2, 10], 26:[2, 10], 27:[2, 10], 
  28:[2, 10], 29:[2, 10], 30:[2, 10], 31:[2, 10], 32:[2, 10], 33:[2, 10], 34:[2, 10], 36:[2, 10], 37:[2, 10], 38:[2, 10], 39:[2, 10], 40:[2, 10], 41:[2, 10]}, {6:36, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 20:[1, 29], 22:[1, 30], 24:[1, 18], 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {6:37, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 
  13:10, 14:15, 15:16, 16:17, 17:[1, 28], 20:[1, 29], 22:[1, 30], 24:[1, 18], 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {6:40, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 18:38, 20:[1, 29], 22:[1, 30], 24:[1, 18], 25:39, 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 
  35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {6:40, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 18:41, 20:[1, 29], 22:[1, 30], 24:[1, 18], 25:39, 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {5:[2, 11], 17:[2, 11], 19:[2, 11], 20:[2, 11], 21:[2, 11], 22:[2, 11], 23:[2, 11], 24:[2, 11], 26:[2, 
  11], 27:[2, 11], 28:[2, 11], 29:[2, 11], 30:[2, 11], 31:[2, 11], 32:[2, 11], 33:[2, 11], 34:[2, 11], 36:[2, 11], 37:[2, 11], 38:[2, 11], 39:[2, 11], 40:[2, 11], 41:[2, 11]}, {5:[2, 12], 17:[2, 12], 19:[2, 12], 20:[2, 12], 21:[2, 12], 22:[2, 12], 23:[2, 12], 24:[2, 12], 26:[2, 12], 27:[2, 12], 28:[2, 12], 29:[2, 12], 30:[2, 12], 31:[2, 12], 32:[2, 12], 33:[2, 12], 34:[2, 12], 36:[2, 12], 37:[2, 12], 38:[2, 12], 39:[2, 12], 40:[2, 12], 41:[2, 12]}, {5:[2, 13], 17:[2, 13], 19:[2, 13], 20:[2, 13], 
  21:[2, 13], 22:[2, 13], 23:[2, 13], 24:[2, 13], 26:[2, 13], 27:[2, 13], 28:[2, 13], 29:[2, 13], 30:[2, 13], 31:[2, 13], 32:[2, 13], 33:[2, 13], 34:[2, 13], 36:[2, 13], 37:[2, 13], 38:[2, 13], 39:[2, 13], 40:[2, 13], 41:[2, 13]}, {6:40, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 18:42, 20:[1, 29], 22:[1, 30], 23:[1, 43], 24:[1, 18], 25:39, 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 
  32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {5:[2, 38], 17:[2, 38], 19:[2, 38], 20:[2, 38], 21:[2, 38], 22:[2, 38], 23:[2, 38], 24:[2, 38], 26:[2, 38], 27:[2, 38], 28:[2, 38], 29:[2, 38], 30:[2, 38], 31:[2, 38], 32:[2, 38], 33:[2, 38], 34:[2, 38], 36:[2, 38], 37:[2, 38], 38:[2, 38], 39:[2, 38], 40:[2, 38], 41:[2, 38]}, {39:[1, 44]}, {39:[1, 45]}, {10:46, 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {5:[2, 33], 17:[2, 33], 19:[2, 33], 20:[2, 33], 21:[2, 33], 22:[2, 33], 23:[2, 33], 24:[2, 33], 
  26:[2, 33], 27:[2, 33], 28:[2, 33], 29:[2, 33], 30:[2, 33], 31:[2, 33], 32:[2, 33], 33:[2, 33], 34:[2, 33], 36:[2, 33], 37:[2, 33], 38:[2, 33], 39:[2, 33], 40:[2, 33], 41:[2, 33]}, {5:[2, 34], 17:[2, 34], 19:[2, 34], 20:[2, 34], 21:[2, 34], 22:[2, 34], 23:[2, 34], 24:[2, 34], 26:[2, 34], 27:[2, 34], 28:[2, 34], 29:[2, 34], 30:[2, 34], 31:[2, 34], 32:[2, 34], 33:[2, 34], 34:[2, 34], 36:[2, 34], 37:[2, 34], 38:[2, 34], 39:[2, 34], 40:[2, 34], 41:[2, 34]}, {5:[2, 30], 17:[2, 30], 19:[2, 30], 20:[2, 
  30], 21:[2, 30], 22:[2, 30], 23:[2, 30], 24:[2, 30], 26:[2, 30], 27:[2, 30], 28:[2, 30], 29:[2, 30], 30:[2, 30], 31:[2, 30], 32:[2, 30], 33:[2, 30], 34:[2, 30], 36:[2, 30], 37:[2, 30], 38:[2, 30], 39:[2, 30], 40:[2, 30], 41:[2, 30]}, {5:[2, 31], 17:[2, 31], 19:[2, 31], 20:[2, 31], 21:[2, 31], 22:[2, 31], 23:[2, 31], 24:[2, 31], 26:[2, 31], 27:[2, 31], 28:[2, 31], 29:[2, 31], 30:[2, 31], 31:[2, 31], 32:[2, 31], 33:[2, 31], 34:[2, 31], 36:[2, 31], 37:[2, 31], 38:[2, 31], 39:[2, 31], 40:[2, 31], 41:[2, 
  31]}, {5:[2, 32], 17:[2, 32], 19:[2, 32], 20:[2, 32], 21:[2, 32], 22:[2, 32], 23:[2, 32], 24:[2, 32], 26:[2, 32], 27:[2, 32], 28:[2, 32], 29:[2, 32], 30:[2, 32], 31:[2, 32], 32:[2, 32], 33:[2, 32], 34:[2, 32], 36:[2, 32], 37:[2, 32], 38:[2, 32], 39:[2, 32], 40:[2, 32], 41:[2, 32]}, {6:40, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 18:47, 19:[1, 48], 20:[1, 29], 22:[1, 30], 24:[1, 18], 25:39, 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 
  26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {6:40, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 18:49, 20:[1, 29], 21:[1, 50], 22:[1, 30], 24:[1, 18], 25:39, 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {6:40, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 
  16:17, 17:[1, 28], 18:51, 20:[1, 29], 22:[1, 30], 23:[1, 52], 24:[1, 18], 25:39, 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {5:[2, 35], 17:[2, 35], 19:[2, 35], 20:[2, 35], 21:[2, 35], 22:[2, 35], 23:[2, 35], 24:[2, 35], 26:[2, 35], 27:[2, 35], 28:[2, 35], 29:[2, 35], 30:[2, 35], 31:[2, 35], 32:[2, 35], 33:[2, 35], 34:[2, 35], 36:[2, 35], 37:[2, 35], 38:[2, 
  35], 39:[2, 35], 40:[2, 35], 41:[2, 35]}, {5:[2, 36], 17:[2, 36], 19:[2, 36], 20:[2, 36], 21:[2, 36], 22:[2, 36], 23:[2, 36], 24:[2, 36], 26:[2, 36], 27:[2, 36], 28:[2, 36], 29:[2, 36], 30:[2, 36], 31:[2, 36], 32:[2, 36], 33:[2, 36], 34:[2, 36], 36:[2, 36], 37:[2, 36], 38:[2, 36], 39:[2, 36], 40:[2, 36], 41:[2, 36]}, {5:[2, 37], 17:[2, 37], 19:[2, 37], 20:[2, 37], 21:[2, 37], 22:[2, 37], 23:[2, 37], 24:[2, 37], 26:[2, 37], 27:[2, 37], 28:[2, 37], 29:[2, 37], 30:[2, 37], 31:[2, 37], 32:[2, 37], 
  33:[2, 37], 34:[2, 37], 36:[2, 37], 37:[2, 37], 38:[2, 37], 39:[2, 37], 40:[2, 37], 41:[2, 37]}, {1:[2, 1]}, {5:[2, 3], 17:[2, 3], 20:[2, 3], 22:[2, 3], 24:[2, 3], 26:[2, 3], 27:[2, 3], 28:[2, 3], 29:[2, 3], 30:[2, 3], 31:[2, 3], 32:[2, 3], 33:[2, 3], 34:[2, 3], 36:[2, 3], 37:[2, 3], 38:[2, 3], 39:[2, 3], 40:[2, 3], 41:[2, 3]}, {5:[2, 26], 17:[2, 26], 19:[2, 26], 20:[2, 26], 21:[2, 26], 22:[2, 26], 23:[2, 26], 24:[2, 26], 26:[2, 26], 27:[2, 26], 28:[2, 26], 29:[2, 26], 30:[2, 26], 31:[2, 26], 32:[2, 
  26], 33:[2, 26], 34:[2, 26], 36:[2, 26], 37:[2, 26], 38:[2, 26], 39:[2, 26], 40:[2, 26], 41:[2, 26]}, {5:[2, 27], 17:[2, 27], 19:[2, 27], 20:[2, 27], 21:[2, 27], 22:[2, 27], 23:[2, 27], 24:[2, 27], 26:[2, 27], 27:[2, 27], 28:[2, 27], 29:[2, 27], 30:[2, 27], 31:[2, 27], 32:[2, 27], 33:[2, 27], 34:[2, 27], 36:[2, 27], 37:[2, 27], 38:[2, 27], 39:[2, 27], 40:[2, 27], 41:[2, 27]}, {6:40, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 19:[1, 53], 20:[1, 29], 22:[1, 30], 24:[1, 
  18], 25:54, 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {17:[2, 22], 19:[2, 22], 20:[2, 22], 21:[2, 22], 22:[2, 22], 23:[2, 22], 24:[2, 22], 26:[2, 22], 27:[2, 22], 28:[2, 22], 29:[2, 22], 30:[2, 22], 31:[2, 22], 32:[2, 22], 33:[2, 22], 34:[2, 22], 36:[2, 22], 37:[2, 22], 38:[2, 22], 39:[2, 22], 40:[2, 22], 41:[2, 22]}, {17:[2, 24], 19:[2, 24], 20:[2, 24], 
  21:[2, 24], 22:[2, 24], 23:[2, 24], 24:[2, 24], 26:[2, 24], 27:[2, 24], 28:[2, 24], 29:[2, 24], 30:[2, 24], 31:[2, 24], 32:[2, 24], 33:[2, 24], 34:[2, 24], 36:[2, 24], 37:[2, 24], 38:[2, 24], 39:[2, 24], 40:[2, 24], 41:[2, 24]}, {6:40, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 19:[1, 55], 20:[1, 29], 22:[1, 30], 24:[1, 18], 25:54, 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 
  38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {6:40, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 20:[1, 29], 22:[1, 30], 23:[1, 56], 24:[1, 18], 25:54, 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {5:[2, 21], 17:[2, 21], 19:[2, 21], 20:[2, 21], 21:[2, 21], 22:[2, 21], 23:[2, 21], 24:[2, 21], 26:[2, 21], 27:[2, 21], 28:[2, 
  21], 29:[2, 21], 30:[2, 21], 31:[2, 21], 32:[2, 21], 33:[2, 21], 34:[2, 21], 36:[2, 21], 37:[2, 21], 38:[2, 21], 39:[2, 21], 40:[2, 21], 41:[2, 21]}, {5:[2, 39], 17:[2, 39], 19:[2, 39], 20:[2, 39], 21:[2, 39], 22:[2, 39], 23:[2, 39], 24:[2, 39], 26:[2, 39], 27:[2, 39], 28:[2, 39], 29:[2, 39], 30:[2, 39], 31:[2, 39], 32:[2, 39], 33:[2, 39], 34:[2, 39], 36:[2, 39], 37:[2, 39], 38:[2, 39], 39:[2, 39], 40:[2, 39], 41:[2, 39]}, {5:[2, 40], 17:[2, 40], 19:[2, 40], 20:[2, 40], 21:[2, 40], 22:[2, 40], 
  23:[2, 40], 24:[2, 40], 26:[2, 40], 27:[2, 40], 28:[2, 40], 29:[2, 40], 30:[2, 40], 31:[2, 40], 32:[2, 40], 33:[2, 40], 34:[2, 40], 36:[2, 40], 37:[2, 40], 38:[2, 40], 39:[2, 40], 40:[2, 40], 41:[2, 40]}, {5:[2, 25], 17:[2, 25], 19:[2, 25], 20:[2, 25], 21:[2, 25], 22:[2, 25], 23:[2, 25], 24:[2, 25], 26:[2, 25], 27:[2, 25], 28:[2, 25], 29:[2, 25], 30:[2, 25], 31:[2, 25], 32:[2, 25], 33:[2, 25], 34:[2, 25], 36:[2, 25], 37:[2, 25], 38:[2, 25], 39:[2, 25], 40:[2, 25], 41:[2, 25]}, {6:40, 7:4, 8:5, 
  9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 19:[1, 57], 20:[1, 29], 22:[1, 30], 24:[1, 18], 25:54, 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {5:[2, 15], 17:[2, 15], 19:[2, 15], 20:[2, 15], 21:[2, 15], 22:[2, 15], 23:[2, 15], 24:[2, 15], 26:[2, 15], 27:[2, 15], 28:[2, 15], 29:[2, 15], 30:[2, 15], 31:[2, 15], 32:[2, 15], 33:[2, 15], 34:[2, 
  15], 36:[2, 15], 37:[2, 15], 38:[2, 15], 39:[2, 15], 40:[2, 15], 41:[2, 15]}, {6:40, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 20:[1, 29], 21:[1, 58], 22:[1, 30], 24:[1, 18], 25:54, 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {5:[2, 17], 17:[2, 17], 19:[2, 17], 20:[2, 17], 21:[2, 17], 22:[2, 17], 23:[2, 17], 24:[2, 17], 26:[2, 
  17], 27:[2, 17], 28:[2, 17], 29:[2, 17], 30:[2, 17], 31:[2, 17], 32:[2, 17], 33:[2, 17], 34:[2, 17], 36:[2, 17], 37:[2, 17], 38:[2, 17], 39:[2, 17], 40:[2, 17], 41:[2, 17]}, {6:40, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:15, 15:16, 16:17, 17:[1, 28], 20:[1, 29], 22:[1, 30], 23:[1, 59], 24:[1, 18], 25:54, 26:[1, 22], 27:[1, 11], 28:[1, 12], 29:[1, 13], 30:[1, 14], 31:[1, 25], 32:[1, 26], 33:[1, 27], 34:[1, 23], 35:24, 36:[1, 31], 37:[1, 32], 38:[1, 33], 39:[1, 19], 40:[1, 20], 41:[1, 21]}, {5:[2, 
  19], 17:[2, 19], 19:[2, 19], 20:[2, 19], 21:[2, 19], 22:[2, 19], 23:[2, 19], 24:[2, 19], 26:[2, 19], 27:[2, 19], 28:[2, 19], 29:[2, 19], 30:[2, 19], 31:[2, 19], 32:[2, 19], 33:[2, 19], 34:[2, 19], 36:[2, 19], 37:[2, 19], 38:[2, 19], 39:[2, 19], 40:[2, 19], 41:[2, 19]}, {5:[2, 28], 17:[2, 28], 19:[2, 28], 20:[2, 28], 21:[2, 28], 22:[2, 28], 23:[2, 28], 24:[2, 28], 26:[2, 28], 27:[2, 28], 28:[2, 28], 29:[2, 28], 30:[2, 28], 31:[2, 28], 32:[2, 28], 33:[2, 28], 34:[2, 28], 36:[2, 28], 37:[2, 28], 38:[2, 
  28], 39:[2, 28], 40:[2, 28], 41:[2, 28]}, {17:[2, 23], 19:[2, 23], 20:[2, 23], 21:[2, 23], 22:[2, 23], 23:[2, 23], 24:[2, 23], 26:[2, 23], 27:[2, 23], 28:[2, 23], 29:[2, 23], 30:[2, 23], 31:[2, 23], 32:[2, 23], 33:[2, 23], 34:[2, 23], 36:[2, 23], 37:[2, 23], 38:[2, 23], 39:[2, 23], 40:[2, 23], 41:[2, 23]}, {5:[2, 29], 17:[2, 29], 19:[2, 29], 20:[2, 29], 21:[2, 29], 22:[2, 29], 23:[2, 29], 24:[2, 29], 26:[2, 29], 27:[2, 29], 28:[2, 29], 29:[2, 29], 30:[2, 29], 31:[2, 29], 32:[2, 29], 33:[2, 29], 
  34:[2, 29], 36:[2, 29], 37:[2, 29], 38:[2, 29], 39:[2, 29], 40:[2, 29], 41:[2, 29]}, {5:[2, 20], 17:[2, 20], 19:[2, 20], 20:[2, 20], 21:[2, 20], 22:[2, 20], 23:[2, 20], 24:[2, 20], 26:[2, 20], 27:[2, 20], 28:[2, 20], 29:[2, 20], 30:[2, 20], 31:[2, 20], 32:[2, 20], 33:[2, 20], 34:[2, 20], 36:[2, 20], 37:[2, 20], 38:[2, 20], 39:[2, 20], 40:[2, 20], 41:[2, 20]}, {5:[2, 14], 17:[2, 14], 19:[2, 14], 20:[2, 14], 21:[2, 14], 22:[2, 14], 23:[2, 14], 24:[2, 14], 26:[2, 14], 27:[2, 14], 28:[2, 14], 29:[2, 
  14], 30:[2, 14], 31:[2, 14], 32:[2, 14], 33:[2, 14], 34:[2, 14], 36:[2, 14], 37:[2, 14], 38:[2, 14], 39:[2, 14], 40:[2, 14], 41:[2, 14]}, {5:[2, 16], 17:[2, 16], 19:[2, 16], 20:[2, 16], 21:[2, 16], 22:[2, 16], 23:[2, 16], 24:[2, 16], 26:[2, 16], 27:[2, 16], 28:[2, 16], 29:[2, 16], 30:[2, 16], 31:[2, 16], 32:[2, 16], 33:[2, 16], 34:[2, 16], 36:[2, 16], 37:[2, 16], 38:[2, 16], 39:[2, 16], 40:[2, 16], 41:[2, 16]}, {5:[2, 18], 17:[2, 18], 19:[2, 18], 20:[2, 18], 21:[2, 18], 22:[2, 18], 23:[2, 18], 
  24:[2, 18], 26:[2, 18], 27:[2, 18], 28:[2, 18], 29:[2, 18], 30:[2, 18], 31:[2, 18], 32:[2, 18], 33:[2, 18], 34:[2, 18], 36:[2, 18], 37:[2, 18], 38:[2, 18], 39:[2, 18], 40:[2, 18], 41:[2, 18]}], defaultActions:{34:[2, 1]}, parseError:function parseError(str, hash) {
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
      if(typeof action === "undefined" || !action.length || !action[0]) {
        if(!recovering) {
          expected = [];
          for(p in table[state]) {
            if(this.terminals_[p] && p > 2) {
              expected.push("'" + this.terminals_[p] + "'")
            }
          }
          var errStr = "";
          if(this.lexer.showPosition) {
            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ")
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
    }};
    lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
      var YYSTATE = YY_START;
      switch($avoiding_name_collisions) {
        case 0:
          break;
        case 1:
          break;
        case 2:
          return 17;
          break;
        case 3:
          return 19;
          break;
        case 4:
          return 20;
          break;
        case 5:
          return 21;
          break;
        case 6:
          return 22;
          break;
        case 7:
          return 24;
          break;
        case 8:
          return 23;
          break;
        case 9:
          return 27;
          break;
        case 10:
          return 28;
          break;
        case 11:
          return"SYNTAX_EXPAND";
          break;
        case 12:
          return 29;
          break;
        case 13:
          return 30;
          break;
        case 14:
          return 26;
          break;
        case 15:
          return 40;
          break;
        case 16:
          return 34;
          break;
        case 17:
          return 36;
          break;
        case 18:
          return 37;
          break;
        case 19:
          return 38;
          break;
        case 20:
          return 31;
          break;
        case 21:
          return 32;
          break;
        case 22:
          return 33;
          break;
        case 23:
          return 41;
          break;
        case 24:
          return 39;
          break;
        case 25:
          return 5;
          break;
        case 26:
          return"INVALID";
          break
      }
    };
    lexer.rules = [/^;.*/, /^[\s,]+/, /^\(/, /^\)/, /^\[/, /^\]/, /^#\{/, /^\{/, /^\}/, /^'/, /^`/, /^~/, /^#\(/, /^~\(/, /^\.\.\./, /^:/, /^"[^\"]*"/, /^[+-]?[0-9]+(\.[0-9]+)?\b/, /^[+-]?#0[0-9]+\b/, /^[+-]?#0x[0-9]+\b/, /^nil\b/, /^#t\b/, /^#f\b/, /^@/, /^.+?(?=[)}\]\s]+)/, /^$/, /^./];
    lexer.conditions = {"INITIAL":{"rules":[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], "inclusive":true}};
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
  var JS_ILLEGAL_IDENTIFIER_CHARS, JS_KEYWORDS, cantParse, compiler, destring, is_number, is_string, is_symbol, oppo, to_js_symbol, _ref;
  var __hasProp = Object.prototype.hasOwnProperty;
  if(typeof global === "undefined" || global === null) {
    global = window
  }
  if(typeof Parser === "undefined" || Parser === null) {
    Parser = require("./parser")
  }
  if(typeof _ === "undefined" || _ === null) {
    _ = require("underscore")
  }
  oppo = typeof exports !== "undefined" && exports !== null ? exports : global.oppo = {};
  compiler = (_ref = oppo.compiler) != null ? _ref : oppo.compiler = {};
  _.mixin({objectSet:function(o, s, v) {
    var get, path, ret, _final, _ref2;
    if(arguments.length < 3) {
      _ref2 = [o, s, null], s = _ref2[0], v = _ref2[1], o = _ref2[2]
    }
    if(o == null) {
      o = global
    }
    path = (s != null ? s : "").split(".");
    _final = path.pop();
    get = function(o, k) {
      var _ref3;
      return(_ref3 = o[k]) != null ? _ref3 : o[k] = {}
    };
    ret = _.reduce(path, get, o);
    return ret[_final] = v
  }});
  JS_KEYWORDS = ["break", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "export", "extends", "finally", "for", "function", "if", "implements", "import", "in", "instanceof", "interface", "label", "let", "new", "package", "private", "protected", "public", "static", "return", "switch", "super", "this", "throw", "try", "catch", "typeof", "var", "void", "while", "with", "yield"];
  JS_ILLEGAL_IDENTIFIER_CHARS = {"~":"tilde", "`":"backtick", "!":"exclmark", "@":"at", "#":"pound", "%":"percent", "^":"carat", "&":"amperstand", "*":"star", "(":"oparen", ")":"cparen", "-":"dash", "+":"plus", "=":"equals", "{":"ocurly", "}":"ccurly", "[":"osquare", "]":"csquare", "|":"pipe", "\\":"bslash", '"':"dblquote", "'":"snglquote", ":":"colon", ";":"semicolon", "<":"oangle", ">":"rangle", ",":"comma", ".":"dot", "?":"qmark", "/":"fslash", " ":"space", "\t":"tab", "\n":"newline", "\r":"return", 
  "\u000b":"vertical", "\x00":"null"};
  cantParse = function(o) {
    return new TypeError("Can't parse: " + o)
  };
  is_string = function(s) {
    return _.isString(s) && /^".*"$/.test(s)
  };
  is_number = function(n) {
    return!_.isNaN(n)
  };
  is_symbol = function(s) {
    return _.isString(s) && !is_number(s) && !is_string(s)
  };
  to_js_symbol = function(s) {
    var ident, keyword, replaced, _char, _i, _len;
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
    return ident
  };
  destring = function(s) {
    var new_s;
    new_s = s.replace(/^"/, "");
    if(new_s !== s) {
      new_s = new_s.replace(/"$/, "")
    }
    return new_s
  };
  oppo.read = compiler.read = function(string) {
    return Parser.parse(string)
  };
  oppo.eval = compiler.eval = function(sexp) {
    var call, macro;
    if(is_string(sexp) || is_number(sexp)) {
      return sexp
    }else {
      if(is_symbol(sexp)) {
        return to_js_symbol(sexp)
      }else {
        if(_.isArray(sexp)) {
          call = oppo.eval(_.first(sexp));
          if(macro = compiler[call]) {
            return macro.apply(null, program.slice(1))
          }else {
            throw cantParse(sexp);
          }
        }else {
          throw cantParse(sexp);
        }
      }
    }
  };
  oppo.compile = compiler.compile = _.compose(oppo.eval, oppo.read);
  compiler.defmacro = function(name, argnames, template) {
    return _.objectSet(compiler, name, function(args) {
      var body, newSyntaxQuote, oldSyntaxQuote, _ref2;
      newSyntaxQuote = _.bind(compiler.syntaxQuote, argnames, args);
      _ref2 = [compiler.syntaxQuote, newSyntaxQuote], oldSyntaxQuote = _ref2[0], compiler.syntaxQuote = _ref2[1];
      body = oppo.eval(template);
      compiler.syntaxQuote = oldSyntaxQuote;
      return oppo.eval(body)
    })
  };
  compiler.syntaxExpand = function(argnames, args, item) {
    var index;
    if(arguments.length < 3) {
      throw new TypeError("Can't expand syntax outside of macro: " + item);
    }
    index = _.indexOf(argnames, item);
    if(index >= 0) {
      return compile(args[index])
    }else {
      throw new TypeError("No replacement found for " + item + ".");
    }
  };
  compiler.syntaxQuote = function(argnames, args, item) {
    var newSyntaxExpand, oldSyntaxExpand, ret, _ref2;
    if(arguments.length < 3) {
      throw new TypeError("Can't expand syntax outside of macro: " + item);
    }
    newSyntaxExpand = _.bind(compiler.syntaxExpand, argnames, args);
    _ref2 = [compiler.syntaxExpand, newSyntaxExpand], oldSyntaxExpand = _ref2[0], compiler.syntaxExpand = _ref2[1];
    ret = oppo.eval(item);
    compiler.syntaxExpand = oldSyntaxExpand;
    return ret
  };
  compiler["js-eval"] = function(js) {
    return destring(js)
  }
}).call(this);

