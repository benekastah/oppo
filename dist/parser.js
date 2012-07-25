/* Jison generated parser */
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"program":3,"s_expression_list":4,"EOF":5,"s_expression":6,"special_form":7,"list":8,"symbol":9,"literal":10,"callable_list":11,"array":12,"object":13,"(":14,"element_list":15,")":16,"[":17,"]":18,"OBJECT":19,"kvpair_list":20,"OBJECT_END":21,"kvpair":22,"element":23,"base_element_list":24,"REST":25,"QUOTE":26,"QUASIQUOTE":27,"UNQUOTE":28,"UNQUOTE_SPLICING":29,"FUNCTION":30,"string":31,"regex":32,"number":33,"atom":34,"BOOLEAN_TRUE":35,"BOOLEAN_FALSE":36,"REGEX":37,"FLAGS":38,"FIXNUM":39,"FLOAT":40,"BASENUM":41,"STRING":42,"keyword":43,"KEYWORD":44,"IDENTIFIER":45,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"(",16:")",17:"[",18:"]",19:"OBJECT",21:"OBJECT_END",25:"REST",26:"QUOTE",27:"QUASIQUOTE",28:"UNQUOTE",29:"UNQUOTE_SPLICING",30:"FUNCTION",35:"BOOLEAN_TRUE",36:"BOOLEAN_FALSE",37:"REGEX",38:"FLAGS",39:"FIXNUM",40:"FLOAT",41:"BASENUM",42:"STRING",44:"KEYWORD",45:"IDENTIFIER"},
productions_: [0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[8,1],[8,1],[8,1],[11,3],[12,3],[12,2],[13,3],[13,2],[20,1],[20,2],[22,2],[15,1],[15,3],[15,2],[24,1],[24,2],[23,1],[7,2],[7,2],[7,2],[7,2],[7,3],[10,1],[10,1],[10,1],[10,1],[34,2],[34,1],[34,1],[32,2],[33,1],[33,1],[33,1],[31,1],[31,1],[43,2],[9,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:
      $$[$0-1].unshift(new C.Raw("var eval = " + sym("__oppo_eval__").compile()));
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
case 21: this.$ = $$[$0-2]; this.$.push(new C.Rest($$[$0], yy)); 
break;
case 22: this.$ = [new C.Rest($$[$01], yy)]; 
break;
case 23: this.$ = [$$[$0]]; 
break;
case 24: this.$ = $$[$0-1]; this.$.push($$[$0]); 
break;
case 26: this.$ = call_by_name("quote", [$$[$0]]); 
break;
case 27: this.$ = call_by_name("quasiquote", [$$[$0]]); 
break;
case 28: this.$ = call_by_name("unquote", [$$[$0]]); 
break;
case 29: this.$ = call_by_name("unquote-splicing", [$$[$0]]); 
break;
case 30: this.$ = call_by_name("lambda", [$$[$0-1]]); 
break;
case 35: this.$ = new C.Null(yy); 
break;
case 36: this.$ = new C.True(yy); 
break;
case 37: this.$ = new C.False(yy); 
break;
case 38: this.$ = call_by_name("regex", [new C.String($$[$0-1], yy), new C.String($$[$0].substr(1), yy)], yy); 
break;
case 39: this.$ = new C.Number($$[$0], yy); 
break;
case 40: this.$ = new C.Number($$[$0], yy); 
break;
case 41:
      var basenum = $$[$0].split('#');
      this.$ = new C.Number({value: basenum[1], base: basenum[0]}, yy);
    
break;
case 42: this.$ = new C.String($$[$0], yy); 
break;
case 44: this.$ = call_by_name("keyword", [$$[$0]], yy); 
break;
case 45:
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
table: [{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{1:[3]},{5:[1,34],6:35,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{1:[2,2]},{5:[2,4],14:[2,4],17:[2,4],19:[2,4],26:[2,4],27:[2,4],28:[2,4],29:[2,4],30:[2,4],35:[2,4],36:[2,4],37:[2,4],39:[2,4],40:[2,4],41:[2,4],42:[2,4],44:[2,4],45:[2,4]},{5:[2,5],14:[2,5],16:[2,5],17:[2,5],18:[2,5],19:[2,5],21:[2,5],25:[2,5],26:[2,5],27:[2,5],28:[2,5],29:[2,5],30:[2,5],35:[2,5],36:[2,5],37:[2,5],39:[2,5],40:[2,5],41:[2,5],42:[2,5],44:[2,5],45:[2,5]},{5:[2,6],14:[2,6],16:[2,6],17:[2,6],18:[2,6],19:[2,6],21:[2,6],25:[2,6],26:[2,6],27:[2,6],28:[2,6],29:[2,6],30:[2,6],35:[2,6],36:[2,6],37:[2,6],39:[2,6],40:[2,6],41:[2,6],42:[2,6],44:[2,6],45:[2,6]},{5:[2,7],14:[2,7],16:[2,7],17:[2,7],18:[2,7],19:[2,7],21:[2,7],25:[2,7],26:[2,7],27:[2,7],28:[2,7],29:[2,7],30:[2,7],35:[2,7],36:[2,7],37:[2,7],39:[2,7],40:[2,7],41:[2,7],42:[2,7],44:[2,7],45:[2,7]},{5:[2,8],14:[2,8],16:[2,8],17:[2,8],18:[2,8],19:[2,8],21:[2,8],25:[2,8],26:[2,8],27:[2,8],28:[2,8],29:[2,8],30:[2,8],35:[2,8],36:[2,8],37:[2,8],39:[2,8],40:[2,8],41:[2,8],42:[2,8],44:[2,8],45:[2,8]},{6:36,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{6:37,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{6:38,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{6:39,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{6:44,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],15:40,17:[1,23],19:[1,24],23:43,24:41,25:[1,42],26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{5:[2,9],14:[2,9],16:[2,9],17:[2,9],18:[2,9],19:[2,9],21:[2,9],25:[2,9],26:[2,9],27:[2,9],28:[2,9],29:[2,9],30:[2,9],35:[2,9],36:[2,9],37:[2,9],39:[2,9],40:[2,9],41:[2,9],42:[2,9],44:[2,9],45:[2,9]},{5:[2,10],14:[2,10],16:[2,10],17:[2,10],18:[2,10],19:[2,10],21:[2,10],25:[2,10],26:[2,10],27:[2,10],28:[2,10],29:[2,10],30:[2,10],35:[2,10],36:[2,10],37:[2,10],39:[2,10],40:[2,10],41:[2,10],42:[2,10],44:[2,10],45:[2,10]},{5:[2,11],14:[2,11],16:[2,11],17:[2,11],18:[2,11],19:[2,11],21:[2,11],25:[2,11],26:[2,11],27:[2,11],28:[2,11],29:[2,11],30:[2,11],35:[2,11],36:[2,11],37:[2,11],39:[2,11],40:[2,11],41:[2,11],42:[2,11],44:[2,11],45:[2,11]},{5:[2,45],14:[2,45],16:[2,45],17:[2,45],18:[2,45],19:[2,45],21:[2,45],25:[2,45],26:[2,45],27:[2,45],28:[2,45],29:[2,45],30:[2,45],35:[2,45],36:[2,45],37:[2,45],39:[2,45],40:[2,45],41:[2,45],42:[2,45],44:[2,45],45:[2,45]},{5:[2,31],14:[2,31],16:[2,31],17:[2,31],18:[2,31],19:[2,31],21:[2,31],25:[2,31],26:[2,31],27:[2,31],28:[2,31],29:[2,31],30:[2,31],35:[2,31],36:[2,31],37:[2,31],39:[2,31],40:[2,31],41:[2,31],42:[2,31],44:[2,31],45:[2,31]},{5:[2,32],14:[2,32],16:[2,32],17:[2,32],18:[2,32],19:[2,32],21:[2,32],25:[2,32],26:[2,32],27:[2,32],28:[2,32],29:[2,32],30:[2,32],35:[2,32],36:[2,32],37:[2,32],39:[2,32],40:[2,32],41:[2,32],42:[2,32],44:[2,32],45:[2,32]},{5:[2,33],14:[2,33],16:[2,33],17:[2,33],18:[2,33],19:[2,33],21:[2,33],25:[2,33],26:[2,33],27:[2,33],28:[2,33],29:[2,33],30:[2,33],35:[2,33],36:[2,33],37:[2,33],39:[2,33],40:[2,33],41:[2,33],42:[2,33],44:[2,33],45:[2,33]},{5:[2,34],14:[2,34],16:[2,34],17:[2,34],18:[2,34],19:[2,34],21:[2,34],25:[2,34],26:[2,34],27:[2,34],28:[2,34],29:[2,34],30:[2,34],35:[2,34],36:[2,34],37:[2,34],39:[2,34],40:[2,34],41:[2,34],42:[2,34],44:[2,34],45:[2,34]},{6:44,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],15:45,16:[1,46],17:[1,23],19:[1,24],23:43,24:41,25:[1,42],26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{6:44,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],15:47,17:[1,23],18:[1,48],19:[1,24],23:43,24:41,25:[1,42],26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{6:44,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],20:49,21:[1,50],22:51,23:52,26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{5:[2,42],14:[2,42],16:[2,42],17:[2,42],18:[2,42],19:[2,42],21:[2,42],25:[2,42],26:[2,42],27:[2,42],28:[2,42],29:[2,42],30:[2,42],35:[2,42],36:[2,42],37:[2,42],39:[2,42],40:[2,42],41:[2,42],42:[2,42],44:[2,42],45:[2,42]},{5:[2,43],14:[2,43],16:[2,43],17:[2,43],18:[2,43],19:[2,43],21:[2,43],25:[2,43],26:[2,43],27:[2,43],28:[2,43],29:[2,43],30:[2,43],35:[2,43],36:[2,43],37:[2,43],39:[2,43],40:[2,43],41:[2,43],42:[2,43],44:[2,43],45:[2,43]},{38:[1,53]},{5:[2,39],14:[2,39],16:[2,39],17:[2,39],18:[2,39],19:[2,39],21:[2,39],25:[2,39],26:[2,39],27:[2,39],28:[2,39],29:[2,39],30:[2,39],35:[2,39],36:[2,39],37:[2,39],39:[2,39],40:[2,39],41:[2,39],42:[2,39],44:[2,39],45:[2,39]},{5:[2,40],14:[2,40],16:[2,40],17:[2,40],18:[2,40],19:[2,40],21:[2,40],25:[2,40],26:[2,40],27:[2,40],28:[2,40],29:[2,40],30:[2,40],35:[2,40],36:[2,40],37:[2,40],39:[2,40],40:[2,40],41:[2,40],42:[2,40],44:[2,40],45:[2,40]},{5:[2,41],14:[2,41],16:[2,41],17:[2,41],18:[2,41],19:[2,41],21:[2,41],25:[2,41],26:[2,41],27:[2,41],28:[2,41],29:[2,41],30:[2,41],35:[2,41],36:[2,41],37:[2,41],39:[2,41],40:[2,41],41:[2,41],42:[2,41],44:[2,41],45:[2,41]},{5:[2,36],14:[2,36],16:[2,36],17:[2,36],18:[2,36],19:[2,36],21:[2,36],25:[2,36],26:[2,36],27:[2,36],28:[2,36],29:[2,36],30:[2,36],35:[2,36],36:[2,36],37:[2,36],39:[2,36],40:[2,36],41:[2,36],42:[2,36],44:[2,36],45:[2,36]},{5:[2,37],14:[2,37],16:[2,37],17:[2,37],18:[2,37],19:[2,37],21:[2,37],25:[2,37],26:[2,37],27:[2,37],28:[2,37],29:[2,37],30:[2,37],35:[2,37],36:[2,37],37:[2,37],39:[2,37],40:[2,37],41:[2,37],42:[2,37],44:[2,37],45:[2,37]},{9:54,45:[1,17]},{1:[2,1]},{5:[2,3],14:[2,3],17:[2,3],19:[2,3],26:[2,3],27:[2,3],28:[2,3],29:[2,3],30:[2,3],35:[2,3],36:[2,3],37:[2,3],39:[2,3],40:[2,3],41:[2,3],42:[2,3],44:[2,3],45:[2,3]},{5:[2,26],14:[2,26],16:[2,26],17:[2,26],18:[2,26],19:[2,26],21:[2,26],25:[2,26],26:[2,26],27:[2,26],28:[2,26],29:[2,26],30:[2,26],35:[2,26],36:[2,26],37:[2,26],39:[2,26],40:[2,26],41:[2,26],42:[2,26],44:[2,26],45:[2,26]},{5:[2,27],14:[2,27],16:[2,27],17:[2,27],18:[2,27],19:[2,27],21:[2,27],25:[2,27],26:[2,27],27:[2,27],28:[2,27],29:[2,27],30:[2,27],35:[2,27],36:[2,27],37:[2,27],39:[2,27],40:[2,27],41:[2,27],42:[2,27],44:[2,27],45:[2,27]},{5:[2,28],14:[2,28],16:[2,28],17:[2,28],18:[2,28],19:[2,28],21:[2,28],25:[2,28],26:[2,28],27:[2,28],28:[2,28],29:[2,28],30:[2,28],35:[2,28],36:[2,28],37:[2,28],39:[2,28],40:[2,28],41:[2,28],42:[2,28],44:[2,28],45:[2,28]},{5:[2,29],14:[2,29],16:[2,29],17:[2,29],18:[2,29],19:[2,29],21:[2,29],25:[2,29],26:[2,29],27:[2,29],28:[2,29],29:[2,29],30:[2,29],35:[2,29],36:[2,29],37:[2,29],39:[2,29],40:[2,29],41:[2,29],42:[2,29],44:[2,29],45:[2,29]},{16:[1,55]},{6:44,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],16:[2,20],17:[1,23],18:[2,20],19:[1,24],23:57,25:[1,56],26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{6:44,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],23:58,26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{14:[2,23],16:[2,23],17:[2,23],18:[2,23],19:[2,23],25:[2,23],26:[2,23],27:[2,23],28:[2,23],29:[2,23],30:[2,23],35:[2,23],36:[2,23],37:[2,23],39:[2,23],40:[2,23],41:[2,23],42:[2,23],44:[2,23],45:[2,23]},{14:[2,25],16:[2,25],17:[2,25],18:[2,25],19:[2,25],21:[2,25],25:[2,25],26:[2,25],27:[2,25],28:[2,25],29:[2,25],30:[2,25],35:[2,25],36:[2,25],37:[2,25],39:[2,25],40:[2,25],41:[2,25],42:[2,25],44:[2,25],45:[2,25]},{16:[1,59]},{5:[2,35],14:[2,35],16:[2,35],17:[2,35],18:[2,35],19:[2,35],21:[2,35],25:[2,35],26:[2,35],27:[2,35],28:[2,35],29:[2,35],30:[2,35],35:[2,35],36:[2,35],37:[2,35],39:[2,35],40:[2,35],41:[2,35],42:[2,35],44:[2,35],45:[2,35]},{18:[1,60]},{5:[2,14],14:[2,14],16:[2,14],17:[2,14],18:[2,14],19:[2,14],21:[2,14],25:[2,14],26:[2,14],27:[2,14],28:[2,14],29:[2,14],30:[2,14],35:[2,14],36:[2,14],37:[2,14],39:[2,14],40:[2,14],41:[2,14],42:[2,14],44:[2,14],45:[2,14]},{6:44,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],21:[1,61],22:62,23:52,26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{5:[2,16],14:[2,16],16:[2,16],17:[2,16],18:[2,16],19:[2,16],21:[2,16],25:[2,16],26:[2,16],27:[2,16],28:[2,16],29:[2,16],30:[2,16],35:[2,16],36:[2,16],37:[2,16],39:[2,16],40:[2,16],41:[2,16],42:[2,16],44:[2,16],45:[2,16]},{14:[2,17],17:[2,17],19:[2,17],21:[2,17],26:[2,17],27:[2,17],28:[2,17],29:[2,17],30:[2,17],35:[2,17],36:[2,17],37:[2,17],39:[2,17],40:[2,17],41:[2,17],42:[2,17],44:[2,17],45:[2,17]},{6:44,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],23:63,26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{5:[2,38],14:[2,38],16:[2,38],17:[2,38],18:[2,38],19:[2,38],21:[2,38],25:[2,38],26:[2,38],27:[2,38],28:[2,38],29:[2,38],30:[2,38],35:[2,38],36:[2,38],37:[2,38],39:[2,38],40:[2,38],41:[2,38],42:[2,38],44:[2,38],45:[2,38]},{5:[2,44],14:[2,44],16:[2,44],17:[2,44],18:[2,44],19:[2,44],21:[2,44],25:[2,44],26:[2,44],27:[2,44],28:[2,44],29:[2,44],30:[2,44],35:[2,44],36:[2,44],37:[2,44],39:[2,44],40:[2,44],41:[2,44],42:[2,44],44:[2,44],45:[2,44]},{5:[2,30],14:[2,30],16:[2,30],17:[2,30],18:[2,30],19:[2,30],21:[2,30],25:[2,30],26:[2,30],27:[2,30],28:[2,30],29:[2,30],30:[2,30],35:[2,30],36:[2,30],37:[2,30],39:[2,30],40:[2,30],41:[2,30],42:[2,30],44:[2,30],45:[2,30]},{6:44,7:5,8:6,9:7,10:8,11:14,12:15,13:16,14:[1,22],17:[1,23],19:[1,24],23:64,26:[1,9],27:[1,10],28:[1,11],29:[1,12],30:[1,13],31:18,32:19,33:20,34:21,35:[1,31],36:[1,32],37:[1,27],39:[1,28],40:[1,29],41:[1,30],42:[1,25],43:26,44:[1,33],45:[1,17]},{14:[2,24],16:[2,24],17:[2,24],18:[2,24],19:[2,24],25:[2,24],26:[2,24],27:[2,24],28:[2,24],29:[2,24],30:[2,24],35:[2,24],36:[2,24],37:[2,24],39:[2,24],40:[2,24],41:[2,24],42:[2,24],44:[2,24],45:[2,24]},{16:[2,22],18:[2,22]},{5:[2,12],14:[2,12],16:[2,12],17:[2,12],18:[2,12],19:[2,12],21:[2,12],25:[2,12],26:[2,12],27:[2,12],28:[2,12],29:[2,12],30:[2,12],35:[2,12],36:[2,12],37:[2,12],39:[2,12],40:[2,12],41:[2,12],42:[2,12],44:[2,12],45:[2,12]},{5:[2,13],14:[2,13],16:[2,13],17:[2,13],18:[2,13],19:[2,13],21:[2,13],25:[2,13],26:[2,13],27:[2,13],28:[2,13],29:[2,13],30:[2,13],35:[2,13],36:[2,13],37:[2,13],39:[2,13],40:[2,13],41:[2,13],42:[2,13],44:[2,13],45:[2,13]},{5:[2,15],14:[2,15],16:[2,15],17:[2,15],18:[2,15],19:[2,15],21:[2,15],25:[2,15],26:[2,15],27:[2,15],28:[2,15],29:[2,15],30:[2,15],35:[2,15],36:[2,15],37:[2,15],39:[2,15],40:[2,15],41:[2,15],42:[2,15],44:[2,15],45:[2,15]},{14:[2,18],17:[2,18],19:[2,18],21:[2,18],26:[2,18],27:[2,18],28:[2,18],29:[2,18],30:[2,18],35:[2,18],36:[2,18],37:[2,18],39:[2,18],40:[2,18],41:[2,18],42:[2,18],44:[2,18],45:[2,18]},{14:[2,19],17:[2,19],19:[2,19],21:[2,19],26:[2,19],27:[2,19],28:[2,19],29:[2,19],30:[2,19],35:[2,19],36:[2,19],37:[2,19],39:[2,19],40:[2,19],41:[2,19],42:[2,19],44:[2,19],45:[2,19]},{16:[2,21],18:[2,21]}],
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
case 3: this.popState(); yy_.yytext = this.string_buffer; return 42; 
break;
case 4:this.string_buffer = yy_.yytext;
break;
case 5:this.begin('regex');
break;
case 6: this.popState(); return 38; 
break;
case 7: return 37; 
break;
case 8: return 40; 
break;
case 9: return 41; 
break;
case 10: return 39; 
break;
case 11: return 35; 
break;
case 12: return 36; 
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
case 19: return 29; 
break;
case 20: return 28; 
break;
case 21: return 26; 
break;
case 22: return 27; 
break;
case 23: return 25; 
break;
case 24: return 30; 
break;
case 25: return 44; 
break;
case 26: return 45; 
break;
case 27: return 5; 
break;
case 28: return 'INVALID'; 
break;
}
};
lexer.rules = [/^(?:;.*)/,/^(?:\s+)/,/^(?:")/,/^(?:")/,/^(?:(\\"|[^"])*)/,/^(?:#\/)/,/^(?:\/[a-zA-Z]*)/,/^(?:(\\\/|[^\/])*)/,/^(?:[\+\-]?\d*\.\d+)/,/^(?:\d{1,2}#[\+\-]?\w+)/,/^(?:[\+\-]?\d+)/,/^(?:#[tT]{1})/,/^(?:#[fF]{1})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:,@)/,/^(?:,)/,/^(?:')/,/^(?:`)/,/^(?:\.)/,/^(?:#\()/,/^(?::)/,/^(?:[\w@#\.:!\$%\^&\*\-\+='"\?\|\/\\<>~]+)/,/^(?:$)/,/^(?:.)/];
lexer.conditions = {"string":{"rules":[3,4],"inclusive":false},"regex":{"rules":[6,7],"inclusive":false},"INITIAL":{"rules":[0,1,2,5,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],"inclusive":true}};
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