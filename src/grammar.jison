/* Oppo - the awesome/experimental lisp on the JSVM */

%{
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

"#"[tT]{1}                              { return 'BOOLEAN_TRUE'; }
"#"[fF]{1}                              { return 'BOOLEAN_FALSE'; }

"("                                     { return '('; }
")"                                     { return ')'; }
"["                                     { return '['; }
"]"                                     { return ']'; }
"{"                                     { return 'OBJECT'; }
"}"                                     { return 'OBJECT_END'; }

","                                     { return 'UNQUOTE'; }
"'"                                     { return 'QUOTE'; }
"`"                                     { return 'QUASIQUOTE'; }
",@"                                    { return 'UNQUOTE_SPLICING'; }
"."                                     { return 'REST'; }
"#("                                    { return 'FUNCTION'; }

":"                                     { return 'KEYWORD'; }
[\w@#\.:!\$%\^&\*\-\+='"\?\|\/\\<>~]+   { return 'IDENTIFIER'; } //'

<<EOF>>                                 { return 'EOF'; }
.                                       { return 'INVALID'; }

/lex

%{
  var types = {}; // oppo.compiler.types;
%}

%start program
%%

program
  : s_expression_list EOF
    {
      $1.unshift(new C.Raw("var eval = " + sym("oppo-eval").compile()));
      var lambda = new C.Lambda({body: $1}, yy);
      //return new C.List([lambda], yy);
      return lambda;
    }
  | EOF
    { return new C.Null(yy); }
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
  ;

list
  : callable_list
  | array
  | object
  ;

callable_list
  : '(' element_list ')'
    { $$ = new C.List($2, yy); }
  ;

array
  : '[' element_list ']'
    { $$ = call_by_name("array", $2, yy); }
  | '[' ']'
    { $$ = call_by_name("array", [], yy); }
  ;
  
object
  : OBJECT kvpair_list OBJECT_END
    { $$ = new C.Object($2, yy); }
  | OBJECT OBJECT_END
    { $$ = new C.Object([], yy); }
  ;

kvpair_list
  : kvpair
    { $$ = [$1]; }
  | kvpair_list kvpair
    { $$ = $1; $$.push($2); }
  ;

kvpair
  : element element
    { $$ = [$1, $2]; }
  ;

element_list
  : base_element_list
  | base_element_list REST element
    { $$ = $1; $$.push(new C.Rest($3, yy)); }
  | REST element
    { $$ = [new C.Rest($3, yy)]; }
  ;

base_element_list
  : element
    { $$ = [$1]; }
  | base_element_list element
    { $$ = $1; $$.push($2); }
  ;

element
  : s_expression
  ;

special_form
  : QUOTE s_expression
    { $$ = call_by_name("quote", $2); }
  | QUASIQUOTE s_expression
    { $$ = call_by_name("quasiquote", $2); }
  | UNQUOTE s_expression
    { $$ = call_by_name("unquote", $2); }
  | UNQUOTE_SPLICING s_expression
    { $$ = call_by_name("unquote-splicing", $2); }
  | FUNCTION element_list ')'
    { $$ = call_by_name("lambda", $2); }
  ;

literal
  : string
  | regex
  | number
  | atom
  ;
  
atom
  : '(' ')'
    { $$ = new C.Null(yy); }
  | BOOLEAN_TRUE
    { $$ = new C.True(yy); }
  | BOOLEAN_FALSE
    { $$ = new C.False(yy); }
  ;

regex
  : REGEX FLAGS
    { $$ = call_by_name("regex", $1, $2.substr(1)); }
  ;
  
number
  : FIXNUM
    { $$ = new C.Number($1, yy); }
  | FLOAT
    { $$ = new C.Number($1, yy); }
  | BASENUM
    {
      var basenum = $1.split('#');
      $$ = new C.Number({value: basenum[1], base: basenum[0]}, yy);
    }
  ;
  
string
  : STRING
    { $$ = new C.String($1, yy); }
  | keyword
  ;
  
keyword
  : KEYWORD symbol
    { $$ = call_by_name("keyword", $2, yy); }
  ;

symbol
  : IDENTIFIER
    {
      if (/^nil$/i.test($1))
        $$ = new C.Null(yy);
      else if (/^true$/i.test($1))
        $$ = new C.True(yy);
      else if (/^false$/i.test($1))
        $$ = new C.False(yy);
      else
        $$ = new C.Symbol($1, yy);
    }
  ;
  
%%