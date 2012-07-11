/* Jison generated parser */
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"program":3,"s_expression_list":4,"EOF":5,"s_expression":6,"special_form":7,"list":8,"symbol":9,"literal":10,"callable_list":11,"array":12,"object":13,"(":14,"element_list":15,")":16,"[":17,"]":18,"OBJECT":19,"kvpair_list":20,"OBJECT_END":21,"kvpair":22,"element":23,"QUOTE":24,"QUASIQUOTE":25,"UNQUOTE":26,"UNQUOTE_SPLICING":27,"FUNCTION":28,"string":29,"regex":30,"number":31,"atom":32,"BOOLEAN_TRUE":33,"BOOLEAN_FALSE":34,"REGEX":35,"FLAGS":36,"FIXNUM":37,"FLOAT":38,"BASENUM":39,"STRING":40,"keyword":41,"KEYWORD":42,"IDENTIFIER":43,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"(",16:")",17:"[",18:"]",19:"OBJECT",21:"OBJECT_END",24:"QUOTE",25:"QUASIQUOTE",26:"UNQUOTE",27:"UNQUOTE_SPLICING",28:"FUNCTION",33:"BOOLEAN_TRUE",34:"BOOLEAN_FALSE",35:"REGEX",36:"FLAGS",37:"FIXNUM",38:"FLOAT",39:"BASENUM",40:"STRING",42:"KEYWORD",43:"IDENTIFIER"},
productions_: [0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[8,1],[8,1],[8,1],[11,3],[12,3],[12,2],[13,3],[13,2],[20,1],[20,2],[22,2],[15,1],[15,2],[23,1],[7,2],[7,2],[7,2],[7,2],[7,3],[10,1],[10,1],[10,1],[10,1],[32,2],[32,1],[32,1],[30,2],[31,1],[31,1],[31,1],[29,1],[29,1],[41,2],[9,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:
      $$[$0-1].unshift(new C.Raw("var eval = " + sym("oppo-eval").compile()));
      var lambda = new C.Lambda({body: $$[$0-1]}, yy);
      //return new C.List([lambda], yy);
      return lambda;
    
break;
case 2: return new C.Null(yy); 
break;
case 3: this.$ = $$[$0-1]; this.$.push($$[$0]); 
break;
case 4: this.$ = [$$[$0]]; 
break;
case 12: this.$ = new C.List($$[$0-1], yy); 
break;
case 13: this.$ = call_by_name("array", $$[$0-1], yy); 
break;
case 14: this.$ = call_by_name("array", [], yy); 
break;
case 15: this.$ = new C.Object($$[$0-1], yy); 
break;
case 16: this.$ = new C.Object([], yy); 
break;
case 17: this.$ = [$$[$0]]; 
break;
case 18: this.$ = $$[$0-1]; this.$.push($$[$0]); 
break;
case 19: this.$ = [$$[$0-1], $$[$0]]; 
break;
case 20: this.$ = [$$[$0]]; 
break;
case 21: this.$ = $$[$0-1]; this.$.push($$[$0]); 
break;
case 23: this.$ = $$[$0]; this.$.quoted = true; 
break;
case 24: this.$ = $$[$0]; this.$.quasiquoted = true; 
break;
case 25: this.$ = $$[$0]; this.$.unquoted = true; 
break;
case 26: this.$ = $$[$0]; this.$.unquote_spliced = true; 
break;
case 27: this.$ = new C.Lambda({body: $$[$0-1], arity: Infinity}, yy); 
break;
case 32: this.$ = new C.Null(yy); 
break;
case 33: this.$ = new C.True(yy); 
break;
case 34: this.$ = new C.False(yy); 
break;
case 35: this.$ = new C.Regex({pattern: $$[$0-1], modifiers: $$[$0].substr(1)}, yy); 
break;
case 36: this.$ = new C.Number($$[$0], yy); 
break;
case 37: this.$ = new C.Number($$[$0], yy); 
break;
case 38:
      var basenum = $$[$0].split('#');
      this.$ = new C.Number({value: basenum[1], base: basenum[0]}, yy);
    
break;
case 39: this.$ = new C.String($$[$0], yy); 
break;
case 41: this.$ = new C.Keyword($$[$0].value, yy); 
break;
case 42:
      if (/^nil$/i.test($$[$0]))
        this.$ = new C.Null(yy);
      else if (/^true$/i.test($$[$0]))
        this.$ = new C.True(yy);
      else if (/^false$/i.test($$[$0]))
        this.$ = new C.False(yy);
      else
        this.$ = new C.Symbol($$[$0], yy);
    
break;
}
},
table: [{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{1:[3]},{5:[1,34],6:35,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{1:[2,2]},{5:[2,4],14:[2,4],17:[2,4],19:[2,4],24:[2,4],25:[2,4],26:[2,4],27:[2,4],28:[2,4],33:[2,4],34:[2,4],35:[2,4],37:[2,4],38:[2,4],39:[2,4],40:[2,4],42:[2,4],43:[2,4]},{5:[2,5],14:[2,5],16:[2,5],17:[2,5],18:[2,5],19:[2,5],21:[2,5],24:[2,5],25:[2,5],26:[2,5],27:[2,5],28:[2,5],33:[2,5],34:[2,5],35:[2,5],37:[2,5],38:[2,5],39:[2,5],40:[2,5],42:[2,5],43:[2,5]},{5:[2,6],14:[2,6],16:[2,6],17:[2,6],18:[2,6],19:[2,6],21:[2,6],24:[2,6],25:[2,6],26:[2,6],27:[2,6],28:[2,6],33:[2,6],34:[2,6],35:[2,6],37:[2,6],38:[2,6],39:[2,6],40:[2,6],42:[2,6],43:[2,6]},{5:[2,7],14:[2,7],16:[2,7],17:[2,7],18:[2,7],19:[2,7],21:[2,7],24:[2,7],25:[2,7],26:[2,7],27:[2,7],28:[2,7],33:[2,7],34:[2,7],35:[2,7],37:[2,7],38:[2,7],39:[2,7],40:[2,7],42:[2,7],43:[2,7]},{5:[2,8],14:[2,8],16:[2,8],17:[2,8],18:[2,8],19:[2,8],21:[2,8],24:[2,8],25:[2,8],26:[2,8],27:[2,8],28:[2,8],33:[2,8],34:[2,8],35:[2,8],37:[2,8],38:[2,8],39:[2,8],40:[2,8],42:[2,8],43:[2,8]},{6:36,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{6:37,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{6:38,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{6:39,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{6:42,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],15:40,17:[1,23],19:[1,24],23:41,24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{5:[2,9],14:[2,9],16:[2,9],17:[2,9],18:[2,9],19:[2,9],21:[2,9],24:[2,9],25:[2,9],26:[2,9],27:[2,9],28:[2,9],33:[2,9],34:[2,9],35:[2,9],37:[2,9],38:[2,9],39:[2,9],40:[2,9],42:[2,9],43:[2,9]},{5:[2,10],14:[2,10],16:[2,10],17:[2,10],18:[2,10],19:[2,10],21:[2,10],24:[2,10],25:[2,10],26:[2,10],27:[2,10],28:[2,10],33:[2,10],34:[2,10],35:[2,10],37:[2,10],38:[2,10],39:[2,10],40:[2,10],42:[2,10],43:[2,10]},{5:[2,11],14:[2,11],16:[2,11],17:[2,11],18:[2,11],19:[2,11],21:[2,11],24:[2,11],25:[2,11],26:[2,11],27:[2,11],28:[2,11],33:[2,11],34:[2,11],35:[2,11],37:[2,11],38:[2,11],39:[2,11],40:[2,11],42:[2,11],43:[2,11]},{5:[2,42],14:[2,42],16:[2,42],17:[2,42],18:[2,42],19:[2,42],21:[2,42],24:[2,42],25:[2,42],26:[2,42],27:[2,42],28:[2,42],33:[2,42],34:[2,42],35:[2,42],37:[2,42],38:[2,42],39:[2,42],40:[2,42],42:[2,42],43:[2,42]},{5:[2,28],14:[2,28],16:[2,28],17:[2,28],18:[2,28],19:[2,28],21:[2,28],24:[2,28],25:[2,28],26:[2,28],27:[2,28],28:[2,28],33:[2,28],34:[2,28],35:[2,28],37:[2,28],38:[2,28],39:[2,28],40:[2,28],42:[2,28],43:[2,28]},{5:[2,29],14:[2,29],16:[2,29],17:[2,29],18:[2,29],19:[2,29],21:[2,29],24:[2,29],25:[2,29],26:[2,29],27:[2,29],28:[2,29],33:[2,29],34:[2,29],35:[2,29],37:[2,29],38:[2,29],39:[2,29],40:[2,29],42:[2,29],43:[2,29]},{5:[2,30],14:[2,30],16:[2,30],17:[2,30],18:[2,30],19:[2,30],21:[2,30],24:[2,30],25:[2,30],26:[2,30],27:[2,30],28:[2,30],33:[2,30],34:[2,30],35:[2,30],37:[2,30],38:[2,30],39:[2,30],40:[2,30],42:[2,30],43:[2,30]},{5:[2,31],14:[2,31],16:[2,31],17:[2,31],18:[2,31],19:[2,31],21:[2,31],24:[2,31],25:[2,31],26:[2,31],27:[2,31],28:[2,31],33:[2,31],34:[2,31],35:[2,31],37:[2,31],38:[2,31],39:[2,31],40:[2,31],42:[2,31],43:[2,31]},{6:42,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],15:43,16:[1,44],17:[1,23],19:[1,24],23:41,24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{6:42,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],15:45,17:[1,23],18:[1,46],19:[1,24],23:41,24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{6:42,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],20:47,21:[1,48],22:49,23:50,24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{5:[2,39],14:[2,39],16:[2,39],17:[2,39],18:[2,39],19:[2,39],21:[2,39],24:[2,39],25:[2,39],26:[2,39],27:[2,39],28:[2,39],33:[2,39],34:[2,39],35:[2,39],37:[2,39],38:[2,39],39:[2,39],40:[2,39],42:[2,39],43:[2,39]},{5:[2,40],14:[2,40],16:[2,40],17:[2,40],18:[2,40],19:[2,40],21:[2,40],24:[2,40],25:[2,40],26:[2,40],27:[2,40],28:[2,40],33:[2,40],34:[2,40],35:[2,40],37:[2,40],38:[2,40],39:[2,40],40:[2,40],42:[2,40],43:[2,40]},{36:[1,51]},{5:[2,36],14:[2,36],16:[2,36],17:[2,36],18:[2,36],19:[2,36],21:[2,36],24:[2,36],25:[2,36],26:[2,36],27:[2,36],28:[2,36],33:[2,36],34:[2,36],35:[2,36],37:[2,36],38:[2,36],39:[2,36],40:[2,36],42:[2,36],43:[2,36]},{5:[2,37],14:[2,37],16:[2,37],17:[2,37],18:[2,37],19:[2,37],21:[2,37],24:[2,37],25:[2,37],26:[2,37],27:[2,37],28:[2,37],33:[2,37],34:[2,37],35:[2,37],37:[2,37],38:[2,37],39:[2,37],40:[2,37],42:[2,37],43:[2,37]},{5:[2,38],14:[2,38],16:[2,38],17:[2,38],18:[2,38],19:[2,38],21:[2,38],24:[2,38],25:[2,38],26:[2,38],27:[2,38],28:[2,38],33:[2,38],34:[2,38],35:[2,38],37:[2,38],38:[2,38],39:[2,38],40:[2,38],42:[2,38],43:[2,38]},{5:[2,33],14:[2,33],16:[2,33],17:[2,33],18:[2,33],19:[2,33],21:[2,33],24:[2,33],25:[2,33],26:[2,33],27:[2,33],28:[2,33],33:[2,33],34:[2,33],35:[2,33],37:[2,33],38:[2,33],39:[2,33],40:[2,33],42:[2,33],43:[2,33]},{5:[2,34],14:[2,34],16:[2,34],17:[2,34],18:[2,34],19:[2,34],21:[2,34],24:[2,34],25:[2,34],26:[2,34],27:[2,34],28:[2,34],33:[2,34],34:[2,34],35:[2,34],37:[2,34],38:[2,34],39:[2,34],40:[2,34],42:[2,34],43:[2,34]},{9:52,43:[1,17]},{1:[2,1]},{5:[2,3],14:[2,3],17:[2,3],19:[2,3],24:[2,3],25:[2,3],26:[2,3],27:[2,3],28:[2,3],33:[2,3],34:[2,3],35:[2,3],37:[2,3],38:[2,3],39:[2,3],40:[2,3],42:[2,3],43:[2,3]},{5:[2,23],14:[2,23],16:[2,23],17:[2,23],18:[2,23],19:[2,23],21:[2,23],24:[2,23],25:[2,23],26:[2,23],27:[2,23],28:[2,23],33:[2,23],34:[2,23],35:[2,23],37:[2,23],38:[2,23],39:[2,23],40:[2,23],42:[2,23],43:[2,23]},{5:[2,24],14:[2,24],16:[2,24],17:[2,24],18:[2,24],19:[2,24],21:[2,24],24:[2,24],25:[2,24],26:[2,24],27:[2,24],28:[2,24],33:[2,24],34:[2,24],35:[2,24],37:[2,24],38:[2,24],39:[2,24],40:[2,24],42:[2,24],43:[2,24]},{5:[2,25],14:[2,25],16:[2,25],17:[2,25],18:[2,25],19:[2,25],21:[2,25],24:[2,25],25:[2,25],26:[2,25],27:[2,25],28:[2,25],33:[2,25],34:[2,25],35:[2,25],37:[2,25],38:[2,25],39:[2,25],40:[2,25],42:[2,25],43:[2,25]},{5:[2,26],14:[2,26],16:[2,26],17:[2,26],18:[2,26],19:[2,26],21:[2,26],24:[2,26],25:[2,26],26:[2,26],27:[2,26],28:[2,26],33:[2,26],34:[2,26],35:[2,26],37:[2,26],38:[2,26],39:[2,26],40:[2,26],42:[2,26],43:[2,26]},{6:42,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],16:[1,53],17:[1,23],19:[1,24],23:54,24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{14:[2,20],16:[2,20],17:[2,20],18:[2,20],19:[2,20],24:[2,20],25:[2,20],26:[2,20],27:[2,20],28:[2,20],33:[2,20],34:[2,20],35:[2,20],37:[2,20],38:[2,20],39:[2,20],40:[2,20],42:[2,20],43:[2,20]},{14:[2,22],16:[2,22],17:[2,22],18:[2,22],19:[2,22],21:[2,22],24:[2,22],25:[2,22],26:[2,22],27:[2,22],28:[2,22],33:[2,22],34:[2,22],35:[2,22],37:[2,22],38:[2,22],39:[2,22],40:[2,22],42:[2,22],43:[2,22]},{6:42,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],16:[1,55],17:[1,23],19:[1,24],23:54,24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{5:[2,32],14:[2,32],16:[2,32],17:[2,32],18:[2,32],19:[2,32],21:[2,32],24:[2,32],25:[2,32],26:[2,32],27:[2,32],28:[2,32],33:[2,32],34:[2,32],35:[2,32],37:[2,32],38:[2,32],39:[2,32],40:[2,32],42:[2,32],43:[2,32]},{6:42,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],18:[1,56],19:[1,24],23:54,24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{5:[2,14],14:[2,14],16:[2,14],17:[2,14],18:[2,14],19:[2,14],21:[2,14],24:[2,14],25:[2,14],26:[2,14],27:[2,14],28:[2,14],33:[2,14],34:[2,14],35:[2,14],37:[2,14],38:[2,14],39:[2,14],40:[2,14],42:[2,14],43:[2,14]},{6:42,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],21:[1,57],22:58,23:50,24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{5:[2,16],14:[2,16],16:[2,16],17:[2,16],18:[2,16],19:[2,16],21:[2,16],24:[2,16],25:[2,16],26:[2,16],27:[2,16],28:[2,16],33:[2,16],34:[2,16],35:[2,16],37:[2,16],38:[2,16],39:[2,16],40:[2,16],42:[2,16],43:[2,16]},{14:[2,17],17:[2,17],19:[2,17],21:[2,17],24:[2,17],25:[2,17],26:[2,17],27:[2,17],28:[2,17],33:[2,17],34:[2,17],35:[2,17],37:[2,17],38:[2,17],39:[2,17],40:[2,17],42:[2,17],43:[2,17]},{6:42,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],23:59,24:[1,9],25:[1,10],26:[1,11],27:[1,12],28:[1,13],29:18,30:19,31:20,32:21,33:[1,31],34:[1,32],35:[1,27],37:[1,28],38:[1,29],39:[1,30],40:[1,25],41:26,42:[1,33],43:[1,17]},{5:[2,35],14:[2,35],16:[2,35],17:[2,35],18:[2,35],19:[2,35],21:[2,35],24:[2,35],25:[2,35],26:[2,35],27:[2,35],28:[2,35],33:[2,35],34:[2,35],35:[2,35],37:[2,35],38:[2,35],39:[2,35],40:[2,35],42:[2,35],43:[2,35]},{5:[2,41],14:[2,41],16:[2,41],17:[2,41],18:[2,41],19:[2,41],21:[2,41],24:[2,41],25:[2,41],26:[2,41],27:[2,41],28:[2,41],33:[2,41],34:[2,41],35:[2,41],37:[2,41],38:[2,41],39:[2,41],40:[2,41],42:[2,41],43:[2,41]},{5:[2,27],14:[2,27],16:[2,27],17:[2,27],18:[2,27],19:[2,27],21:[2,27],24:[2,27],25:[2,27],26:[2,27],27:[2,27],28:[2,27],33:[2,27],34:[2,27],35:[2,27],37:[2,27],38:[2,27],39:[2,27],40:[2,27],42:[2,27],43:[2,27]},{14:[2,21],16:[2,21],17:[2,21],18:[2,21],19:[2,21],24:[2,21],25:[2,21],26:[2,21],27:[2,21],28:[2,21],33:[2,21],34:[2,21],35:[2,21],37:[2,21],38:[2,21],39:[2,21],40:[2,21],42:[2,21],43:[2,21]},{5:[2,12],14:[2,12],16:[2,12],17:[2,12],18:[2,12],19:[2,12],21:[2,12],24:[2,12],25:[2,12],26:[2,12],27:[2,12],28:[2,12],33:[2,12],34:[2,12],35:[2,12],37:[2,12],38:[2,12],39:[2,12],40:[2,12],42:[2,12],43:[2,12]},{5:[2,13],14:[2,13],16:[2,13],17:[2,13],18:[2,13],19:[2,13],21:[2,13],24:[2,13],25:[2,13],26:[2,13],27:[2,13],28:[2,13],33:[2,13],34:[2,13],35:[2,13],37:[2,13],38:[2,13],39:[2,13],40:[2,13],42:[2,13],43:[2,13]},{5:[2,15],14:[2,15],16:[2,15],17:[2,15],18:[2,15],19:[2,15],21:[2,15],24:[2,15],25:[2,15],26:[2,15],27:[2,15],28:[2,15],33:[2,15],34:[2,15],35:[2,15],37:[2,15],38:[2,15],39:[2,15],40:[2,15],42:[2,15],43:[2,15]},{14:[2,18],17:[2,18],19:[2,18],21:[2,18],24:[2,18],25:[2,18],26:[2,18],27:[2,18],28:[2,18],33:[2,18],34:[2,18],35:[2,18],37:[2,18],38:[2,18],39:[2,18],40:[2,18],42:[2,18],43:[2,18]},{14:[2,19],17:[2,19],19:[2,19],21:[2,19],24:[2,19],25:[2,19],26:[2,19],27:[2,19],28:[2,19],33:[2,19],34:[2,19],35:[2,19],37:[2,19],38:[2,19],39:[2,19],40:[2,19],42:[2,19],43:[2,19]}],
defaultActions: {3:[2,2],34:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};

  var L = typeof lemur === "undefined" ? require('lemur') : lemur;
  var C = L.Compiler;

  var sym = function (s, yy) {
    return new C.Symbol(s, yy)
  };

  var slice = Array.prototype.slice;
  var call_by_name = function (sname, args, yy) {
    var s = sym(sname, yy);
    return new C.List([s].concat(args), yy);
  };

  var types = {}; // oppo.compiler.types;
/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0: /* comment */ 
break;
case 1: /* ignore */ 
break;
case 2: this.begin('string'); this.string_buffer = ""; 
break;
case 3: this.popState(); yy_.yytext = this.string_buffer; return 40; 
break;
case 4:this.string_buffer = yy_.yytext;
break;
case 5:this.begin('regex');
break;
case 6: this.popState(); return 36; 
break;
case 7: return 35; 
break;
case 8: return 38; 
break;
case 9: return 39; 
break;
case 10: return 37; 
break;
case 11: return 33; 
break;
case 12: return 34; 
break;
case 13: return 14; 
break;
case 14: return 16; 
break;
case 15: return 17; 
break;
case 16: return 18; 
break;
case 17: return 19; 
break;
case 18: return 21; 
break;
case 19: return 26; 
break;
case 20: return 24; 
break;
case 21: return 25; 
break;
case 22: return 27; 
break;
case 23: return 28; 
break;
case 24: return 42; 
break;
case 25: return 43; 
break;
case 26: return 5; 
break;
case 27: return 'INVALID'; 
break;
}
};
lexer.rules = [/^(?:;.*)/,/^(?:\s+)/,/^(?:")/,/^(?:")/,/^(?:(\\"|[^"])*)/,/^(?:#\/)/,/^(?:\/[a-zA-Z]*)/,/^(?:(\\\/|[^\/])*)/,/^(?:[\+\-]?\d*\.\d+)/,/^(?:\d{1,2}#[\+\-]?\w+)/,/^(?:[\+\-]?\d+)/,/^(?:#[tT]{1})/,/^(?:#[fF]{1})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:,)/,/^(?:')/,/^(?:`)/,/^(?:,@)/,/^(?:#\()/,/^(?::)/,/^(?:[\w@#\.:!\$%\^&\*\-\+='"\?\|\/\\<>~]+)/,/^(?:$)/,/^(?:.)/];
lexer.conditions = {"string":{"rules":[3,4],"inclusive":false},"regex":{"rules":[6,7],"inclusive":false},"INITIAL":{"rules":[0,1,2,5,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    var source, cwd;
    if (typeof process !== 'undefined') {
        source = require('fs').readFileSync(require('path').resolve(args[1]), "utf8");
    } else {
        source = require("file").path(require("file").cwd()).join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}