/* Jison generated parser */
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"program":3,"s_expression_list":4,"EOF":5,"s_expression":6,"special_form":7,"list":8,"symbol":9,"literal":10,"atom":11,"callable_list":12,"typed_list":13,"hash_map":14,"(":15,"element_list":16,")":17,"[":18,"]":19,"HASH_MAP_START":20,"HASH_MAP_END":21,"element":22,"QUOTE":23,"FUNCTION":24,"NIL":25,"BOOLEAN_TRUE":26,"BOOLEAN_FALSE":27,"STRING":28,"number":29,"DECIMAL_NUMBER":30,"OCTAL_NUMBER":31,"HEXIDECIMAL_NUMBER":32,"IDENTIFIER":33,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",15:"(",17:")",18:"[",19:"]",20:"HASH_MAP_START",21:"HASH_MAP_END",23:"QUOTE",24:"FUNCTION",25:"NIL",26:"BOOLEAN_TRUE",27:"BOOLEAN_FALSE",28:"STRING",30:"DECIMAL_NUMBER",31:"OCTAL_NUMBER",32:"HEXIDECIMAL_NUMBER",33:"IDENTIFIER"},
productions_: [0,[3,2],[4,1],[4,2],[6,1],[6,1],[6,1],[6,1],[6,1],[8,1],[8,1],[8,1],[12,3],[12,2],[13,3],[13,2],[14,3],[14,2],[16,1],[16,2],[22,1],[7,2],[7,3],[11,1],[11,1],[11,1],[10,1],[10,1],[29,1],[29,1],[29,1],[9,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return ['do', $$[$0-1]]; 
break;
case 2: this.$ = [$$[$0]]; 
break;
case 3: this.$ = $$[$0-1]; this.$.push($$[$0]); 
break;
case 12: this.$ = $$[$0-1]; 
break;
case 13: this.$ = []; 
break;
case 14: this.$ = ["typed-list", $$[$0-1]]; 
break;
case 15: this.$ = ["typed-list", []]; 
break;
case 16: this.$ = ["hash-map", $$[$0-1]]; 
break;
case 17: this.$ = ["hash-map", []]; 
break;
case 18: this.$ = [$$[$0]]; 
break;
case 19: this.$ = $$[$0-1]; this.$.push($$[$0]); 
break;
case 21: this.$ = ["quote", $$[$0]]; 
break;
case 22: this.$ = ["fn", $$[$0-1]]; 
break;
case 23: this.$ = null; 
break;
case 24: this.$ = true; 
break;
case 25: this.$ = false; 
break;
case 26: this.$ = yytext; 
break;
case 28: this.$ = Number(yytext, 10); 
break;
case 29: this.$ = parseInt(yytext.replace(/^#/, ''), 8); 
break;
case 30: this.$ = parseInt(yytext.replace(/^#/, ''), 16); 
break;
case 31: this.$ = yytext; 
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:5,9:6,10:7,11:8,12:11,13:12,14:13,15:[1,20],18:[1,21],20:[1,22],23:[1,9],24:[1,10],25:[1,17],26:[1,18],27:[1,19],28:[1,15],29:16,30:[1,23],31:[1,24],32:[1,25],33:[1,14]},{1:[3]},{5:[1,26],6:27,7:4,8:5,9:6,10:7,11:8,12:11,13:12,14:13,15:[1,20],18:[1,21],20:[1,22],23:[1,9],24:[1,10],25:[1,17],26:[1,18],27:[1,19],28:[1,15],29:16,30:[1,23],31:[1,24],32:[1,25],33:[1,14]},{5:[2,2],15:[2,2],18:[2,2],20:[2,2],23:[2,2],24:[2,2],25:[2,2],26:[2,2],27:[2,2],28:[2,2],30:[2,2],31:[2,2],32:[2,2],33:[2,2]},{5:[2,4],15:[2,4],17:[2,4],18:[2,4],19:[2,4],20:[2,4],21:[2,4],23:[2,4],24:[2,4],25:[2,4],26:[2,4],27:[2,4],28:[2,4],30:[2,4],31:[2,4],32:[2,4],33:[2,4]},{5:[2,5],15:[2,5],17:[2,5],18:[2,5],19:[2,5],20:[2,5],21:[2,5],23:[2,5],24:[2,5],25:[2,5],26:[2,5],27:[2,5],28:[2,5],30:[2,5],31:[2,5],32:[2,5],33:[2,5]},{5:[2,6],15:[2,6],17:[2,6],18:[2,6],19:[2,6],20:[2,6],21:[2,6],23:[2,6],24:[2,6],25:[2,6],26:[2,6],27:[2,6],28:[2,6],30:[2,6],31:[2,6],32:[2,6],33:[2,6]},{5:[2,7],15:[2,7],17:[2,7],18:[2,7],19:[2,7],20:[2,7],21:[2,7],23:[2,7],24:[2,7],25:[2,7],26:[2,7],27:[2,7],28:[2,7],30:[2,7],31:[2,7],32:[2,7],33:[2,7]},{5:[2,8],15:[2,8],17:[2,8],18:[2,8],19:[2,8],20:[2,8],21:[2,8],23:[2,8],24:[2,8],25:[2,8],26:[2,8],27:[2,8],28:[2,8],30:[2,8],31:[2,8],32:[2,8],33:[2,8]},{6:28,7:4,8:5,9:6,10:7,11:8,12:11,13:12,14:13,15:[1,20],18:[1,21],20:[1,22],23:[1,9],24:[1,10],25:[1,17],26:[1,18],27:[1,19],28:[1,15],29:16,30:[1,23],31:[1,24],32:[1,25],33:[1,14]},{6:31,7:4,8:5,9:6,10:7,11:8,12:11,13:12,14:13,15:[1,20],16:29,18:[1,21],20:[1,22],22:30,23:[1,9],24:[1,10],25:[1,17],26:[1,18],27:[1,19],28:[1,15],29:16,30:[1,23],31:[1,24],32:[1,25],33:[1,14]},{5:[2,9],15:[2,9],17:[2,9],18:[2,9],19:[2,9],20:[2,9],21:[2,9],23:[2,9],24:[2,9],25:[2,9],26:[2,9],27:[2,9],28:[2,9],30:[2,9],31:[2,9],32:[2,9],33:[2,9]},{5:[2,10],15:[2,10],17:[2,10],18:[2,10],19:[2,10],20:[2,10],21:[2,10],23:[2,10],24:[2,10],25:[2,10],26:[2,10],27:[2,10],28:[2,10],30:[2,10],31:[2,10],32:[2,10],33:[2,10]},{5:[2,11],15:[2,11],17:[2,11],18:[2,11],19:[2,11],20:[2,11],21:[2,11],23:[2,11],24:[2,11],25:[2,11],26:[2,11],27:[2,11],28:[2,11],30:[2,11],31:[2,11],32:[2,11],33:[2,11]},{5:[2,31],15:[2,31],17:[2,31],18:[2,31],19:[2,31],20:[2,31],21:[2,31],23:[2,31],24:[2,31],25:[2,31],26:[2,31],27:[2,31],28:[2,31],30:[2,31],31:[2,31],32:[2,31],33:[2,31]},{5:[2,26],15:[2,26],17:[2,26],18:[2,26],19:[2,26],20:[2,26],21:[2,26],23:[2,26],24:[2,26],25:[2,26],26:[2,26],27:[2,26],28:[2,26],30:[2,26],31:[2,26],32:[2,26],33:[2,26]},{5:[2,27],15:[2,27],17:[2,27],18:[2,27],19:[2,27],20:[2,27],21:[2,27],23:[2,27],24:[2,27],25:[2,27],26:[2,27],27:[2,27],28:[2,27],30:[2,27],31:[2,27],32:[2,27],33:[2,27]},{5:[2,23],15:[2,23],17:[2,23],18:[2,23],19:[2,23],20:[2,23],21:[2,23],23:[2,23],24:[2,23],25:[2,23],26:[2,23],27:[2,23],28:[2,23],30:[2,23],31:[2,23],32:[2,23],33:[2,23]},{5:[2,24],15:[2,24],17:[2,24],18:[2,24],19:[2,24],20:[2,24],21:[2,24],23:[2,24],24:[2,24],25:[2,24],26:[2,24],27:[2,24],28:[2,24],30:[2,24],31:[2,24],32:[2,24],33:[2,24]},{5:[2,25],15:[2,25],17:[2,25],18:[2,25],19:[2,25],20:[2,25],21:[2,25],23:[2,25],24:[2,25],25:[2,25],26:[2,25],27:[2,25],28:[2,25],30:[2,25],31:[2,25],32:[2,25],33:[2,25]},{6:31,7:4,8:5,9:6,10:7,11:8,12:11,13:12,14:13,15:[1,20],16:32,17:[1,33],18:[1,21],20:[1,22],22:30,23:[1,9],24:[1,10],25:[1,17],26:[1,18],27:[1,19],28:[1,15],29:16,30:[1,23],31:[1,24],32:[1,25],33:[1,14]},{6:31,7:4,8:5,9:6,10:7,11:8,12:11,13:12,14:13,15:[1,20],16:34,18:[1,21],19:[1,35],20:[1,22],22:30,23:[1,9],24:[1,10],25:[1,17],26:[1,18],27:[1,19],28:[1,15],29:16,30:[1,23],31:[1,24],32:[1,25],33:[1,14]},{6:31,7:4,8:5,9:6,10:7,11:8,12:11,13:12,14:13,15:[1,20],16:36,18:[1,21],20:[1,22],21:[1,37],22:30,23:[1,9],24:[1,10],25:[1,17],26:[1,18],27:[1,19],28:[1,15],29:16,30:[1,23],31:[1,24],32:[1,25],33:[1,14]},{5:[2,28],15:[2,28],17:[2,28],18:[2,28],19:[2,28],20:[2,28],21:[2,28],23:[2,28],24:[2,28],25:[2,28],26:[2,28],27:[2,28],28:[2,28],30:[2,28],31:[2,28],32:[2,28],33:[2,28]},{5:[2,29],15:[2,29],17:[2,29],18:[2,29],19:[2,29],20:[2,29],21:[2,29],23:[2,29],24:[2,29],25:[2,29],26:[2,29],27:[2,29],28:[2,29],30:[2,29],31:[2,29],32:[2,29],33:[2,29]},{5:[2,30],15:[2,30],17:[2,30],18:[2,30],19:[2,30],20:[2,30],21:[2,30],23:[2,30],24:[2,30],25:[2,30],26:[2,30],27:[2,30],28:[2,30],30:[2,30],31:[2,30],32:[2,30],33:[2,30]},{1:[2,1]},{5:[2,3],15:[2,3],18:[2,3],20:[2,3],23:[2,3],24:[2,3],25:[2,3],26:[2,3],27:[2,3],28:[2,3],30:[2,3],31:[2,3],32:[2,3],33:[2,3]},{5:[2,21],15:[2,21],17:[2,21],18:[2,21],19:[2,21],20:[2,21],21:[2,21],23:[2,21],24:[2,21],25:[2,21],26:[2,21],27:[2,21],28:[2,21],30:[2,21],31:[2,21],32:[2,21],33:[2,21]},{6:31,7:4,8:5,9:6,10:7,11:8,12:11,13:12,14:13,15:[1,20],17:[1,38],18:[1,21],20:[1,22],22:39,23:[1,9],24:[1,10],25:[1,17],26:[1,18],27:[1,19],28:[1,15],29:16,30:[1,23],31:[1,24],32:[1,25],33:[1,14]},{15:[2,18],17:[2,18],18:[2,18],19:[2,18],20:[2,18],21:[2,18],23:[2,18],24:[2,18],25:[2,18],26:[2,18],27:[2,18],28:[2,18],30:[2,18],31:[2,18],32:[2,18],33:[2,18]},{15:[2,20],17:[2,20],18:[2,20],19:[2,20],20:[2,20],21:[2,20],23:[2,20],24:[2,20],25:[2,20],26:[2,20],27:[2,20],28:[2,20],30:[2,20],31:[2,20],32:[2,20],33:[2,20]},{6:31,7:4,8:5,9:6,10:7,11:8,12:11,13:12,14:13,15:[1,20],17:[1,40],18:[1,21],20:[1,22],22:39,23:[1,9],24:[1,10],25:[1,17],26:[1,18],27:[1,19],28:[1,15],29:16,30:[1,23],31:[1,24],32:[1,25],33:[1,14]},{5:[2,13],15:[2,13],17:[2,13],18:[2,13],19:[2,13],20:[2,13],21:[2,13],23:[2,13],24:[2,13],25:[2,13],26:[2,13],27:[2,13],28:[2,13],30:[2,13],31:[2,13],32:[2,13],33:[2,13]},{6:31,7:4,8:5,9:6,10:7,11:8,12:11,13:12,14:13,15:[1,20],18:[1,21],19:[1,41],20:[1,22],22:39,23:[1,9],24:[1,10],25:[1,17],26:[1,18],27:[1,19],28:[1,15],29:16,30:[1,23],31:[1,24],32:[1,25],33:[1,14]},{5:[2,15],15:[2,15],17:[2,15],18:[2,15],19:[2,15],20:[2,15],21:[2,15],23:[2,15],24:[2,15],25:[2,15],26:[2,15],27:[2,15],28:[2,15],30:[2,15],31:[2,15],32:[2,15],33:[2,15]},{6:31,7:4,8:5,9:6,10:7,11:8,12:11,13:12,14:13,15:[1,20],18:[1,21],20:[1,22],21:[1,42],22:39,23:[1,9],24:[1,10],25:[1,17],26:[1,18],27:[1,19],28:[1,15],29:16,30:[1,23],31:[1,24],32:[1,25],33:[1,14]},{5:[2,17],15:[2,17],17:[2,17],18:[2,17],19:[2,17],20:[2,17],21:[2,17],23:[2,17],24:[2,17],25:[2,17],26:[2,17],27:[2,17],28:[2,17],30:[2,17],31:[2,17],32:[2,17],33:[2,17]},{5:[2,22],15:[2,22],17:[2,22],18:[2,22],19:[2,22],20:[2,22],21:[2,22],23:[2,22],24:[2,22],25:[2,22],26:[2,22],27:[2,22],28:[2,22],30:[2,22],31:[2,22],32:[2,22],33:[2,22]},{15:[2,19],17:[2,19],18:[2,19],19:[2,19],20:[2,19],21:[2,19],23:[2,19],24:[2,19],25:[2,19],26:[2,19],27:[2,19],28:[2,19],30:[2,19],31:[2,19],32:[2,19],33:[2,19]},{5:[2,12],15:[2,12],17:[2,12],18:[2,12],19:[2,12],20:[2,12],21:[2,12],23:[2,12],24:[2,12],25:[2,12],26:[2,12],27:[2,12],28:[2,12],30:[2,12],31:[2,12],32:[2,12],33:[2,12]},{5:[2,14],15:[2,14],17:[2,14],18:[2,14],19:[2,14],20:[2,14],21:[2,14],23:[2,14],24:[2,14],25:[2,14],26:[2,14],27:[2,14],28:[2,14],30:[2,14],31:[2,14],32:[2,14],33:[2,14]},{5:[2,16],15:[2,16],17:[2,16],18:[2,16],19:[2,16],20:[2,16],21:[2,16],23:[2,16],24:[2,16],25:[2,16],26:[2,16],27:[2,16],28:[2,16],30:[2,16],31:[2,16],32:[2,16],33:[2,16]}],
defaultActions: {26:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ');
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
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
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
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
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
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
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0: /* comment */ 
break;
case 1: /* ignore */ 
break;
case 2: return 15; 
break;
case 3: return 17; 
break;
case 4: return 18; 
break;
case 5: return 19; 
break;
case 6: return 20; 
break;
case 7: return 21; 
break;
case 8: return 23; 
break;
case 9: return 24; 
break;
case 10: return 28; 
break;
case 11: return 30; 
break;
case 12: return 31; 
break;
case 13: return 32
break;
case 14: return 25; 
break;
case 15: return 26; 
break;
case 16: return 27; 
break;
case 17: return 33; 
break;
case 18: return 5; 
break;
case 19: return 'INVALID'; 
break;
}
};
lexer.rules = [/^;.*/,/^[\s,]+/,/^\(/,/^\)/,/^\[/,/^\]/,/^\{/,/^\}/,/^'/,/^#\(/,/^"[^\"]*"\b/,/^[0-9]+(\.[0-9]+)?\b/,/^#0[0-9]+\b/,/^#0x[0-9]+\b/,/^nil\b/,/^#t\b/,/^#f\b/,/^[^\s]+\b/,/^$/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}