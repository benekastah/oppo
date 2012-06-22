/* Oppo - the awesome/experimental lisp on the JSVM */

%{
  var L = lemur;
  var C = L.compiler;

  var sym = function (s) {
    return new C.Symbol(s, yy);
  };

  var slice = Array.prototype.slice;
  var call = function (sname) {
    var args = slice.call(arguments, 1);
    var s = sym(sname);
    return new C.Call([sym].concat(args));
  };
%}

%lex
%x string regex
%%

";".*                                   { /* comment */ }
\s+                                     { /* ignore */ }

'"'                                     { this.begin('string'); this.string_buffer = ""; }
<string>'"'                             { this.popState(); yytext = this.string_buffer; return 'STRING'; }
<string>(\\\"|[^"])*                    this.string_buffer = yytext;

"#/"                                    this.begin('regex');
<regex>"/"[a-zA-Z]*                     { this.popState(); return 'FLAGS'; }
<regex>(\\\/|[^\/])*                    { return 'REGEX'; }

[\+\-]?\d*"."\d+                        { return 'FLOAT'; }
\d{1,2}"#"[\+\-]?\w+                    { return 'BASENUM'; }
[\+\-]?\d+                              { return 'FIXNUM'; }

"#"("n"|"N")                            { return 'NIL'; }
"#"("t"|"T")                            { return 'BOOLEAN_TRUE'; }
"#"("f"|"F")                            { return 'BOOLEAN_FALSE'; }

"("                                     { return '('; }
")"                                     { return ')'; }
"["                                     { return '['; }
"]"                                     { return ']'; }
"{"                                     { return 'OBJECT'; }
"}"                                     { return 'OBJECT_END'; }

"~"                                     { return 'UNQUOTE'; }
"'"                                     { return 'QUOTE'; }
"`"                                     { return 'QUASIQUOTE'; }
"..."                                   { return 'UNQUOTE_SPLICING'; }
"#("                                    { return 'FUNCTION'; }

":"                                     { return 'KEYWORD'; }
[\w@#\.:!\$%\^&\*\-\+='"\?\|\/\\<>,]+   { return 'IDENTIFIER'; } //'

<<EOF>>                                 { return 'EOF'; }
.                                       { return 'INVALID'; }

/lex

%{
  var types = oppo.compiler.types;
%}

%start program
%%

program
  : s_expression_list EOF
    {
      var _do = new types.Symbol("do", null, yy);
      return new types.List([_do].concat($1), yy);
    }
  | EOF
    { return new types.Nil(yy); }
  ;

s_expression_list
  : s_expression_list s_expression
    { $$ = $1; $$.push($2); }
  | s_expression
    { $$ = [$1]; }
  ;

s_expression
  : special_form
  | list
  | symbol
  | literal
  | atom
  ;

list
  : callable_list
  | quoted_list
  | object
  ;

callable_list
  : '(' element_list ')'
    { $$ = new types.List($2, yy); }
  | '(' ')'
    { $$ = new types.Nil(yy); }
  ;

quoted_list
  : '[' element_list ']'
    {
      var i = 0;
      var len = $2.length;
      for (; i < len; i++) {
        var item = $2[i];
        if (!(item instanceof types.UnquoteSpliced))
        $2[i] = new types.Unquoted(item, yy);
      }
      
      var list = new types.List($2, yy);
      $$ = new types.Quasiquoted(list, yy);
    }
  | '[' ']'
    {
      var list = new types.List([], yy);
      $$ = new types.Quoted(list, yy);
    }
  ;
  
object
  : OBJECT element_list OBJECT_END
    { $$ = new types.Object($2, yy); }
  | OBJECT OBJECT_END
    { $$ = new types.Object([], yy); }
  ;

element_list
  : element
    { $$ = [$1]; }
  | element_list element
    { $$ = $1; $$.push($2); }
  ;

element
  : s_expression
  ;

special_form
  : QUOTE s_expression
    { $$ = new types.Quoted($2, yy); }
  | QUASIQUOTE s_expression
    { $$ = new types.Quasiquoted($2, yy); }
  | UNQUOTE s_expression
    { $$ = new types.Unquoted($2, yy); }
  | UNQUOTE_SPLICING s_expression
    { $$ = new types.UnquoteSpliced($2, yy); }
  | FUNCTION element_list ')'
    { $$ = new types.Function(null, null, $element_list); }
  ;

atom
  : NIL
    { $$ = new types.Nil(yy); }
  | BOOLEAN_TRUE
    { $$ = new types.True(yy); }
  | BOOLEAN_FALSE
    { $$ = new types.False(yy); }
  ;

literal
  : string
  | regex
  | number
  ;
  
regex
  : REGEX FLAGS
    { $$ = new types.Regex($1, $2.substr(1), yy); }
  ;
  
number
  : FIXNUM
    { $$ = new types.Fixnum($1, yy); }
  | FLOAT
    { $$ = new types.Float($1, yy); }
  | BASENUM
    {
      var basenum = $1.split('#');
      var base = basenum[0];
      var snum = basenum[1];
      var num = parseInt(snum, +base);
      $$ = new types.Fixnum(num, yy);
    }
  ;
  
string
  : STRING
    { $$ = new types.String($1, yy); }
  | KEYWORD symbol
    { $$ = new types.String($symbol.value, yy); }
  ;
  
symbol
  : IDENTIFIER
    { $$ = new types.Symbol($1, null, yy); }
  ;
  
%%