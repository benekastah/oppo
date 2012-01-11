/* Oppo - the awesome/experimental lisp on the JSVM */

%lex
%x string regex
%%

";".*                                   { /* comment */ }
\s+                                     { /* ignore */ }

'"'                                     { this.begin('string'); this.string_buffer = ""; }
<string>'"'                             { this.popState(); yytext = this.string_buffer; return 'STRING'; }
<string>"\\\""                          { this.string_buffer += "\\\""; }
<string>[^"]                            { this.string_buffer += yytext; } //"

"#/"                                    { this.begin('regex'); this.regex_buffer = ""; }
<regex>"/"[a-zA-Z]*                     { this.popState(); yytext = this.regex_buffer + yytext; return 'REGEX'; }
<regex>"\\/"                            { this.regex_buffer += "\\/"; }
<regex>[^\/]                            { this.regex_buffer += yytext; }

[+-]?[0-9]+("."[0-9]+)?\b               { return 'DECIMAL_NUMBER'; }
[+-]?"#0"[0-8]+\b                       { return 'OCTAL_NUMBER'; }
[+-]?"#x"[0-9a-fA-F]+\b                 { return 'HEXIDECIMAL_NUMBER'; }
[+-]?"#b"[0-1]+\b                       { return 'BINARY_NUMBER'; }

"nil"\b                                 { return 'NIL'; }
"#t"\b                                  { return 'BOOLEAN_TRUE'; }
"#f"\b                                  { return 'BOOLEAN_FALSE'; }

"("                                     { return '('; }
")"                                     { return ')'; }
"["                                     { return '['; }
"]"                                     { return ']'; }
"#{"                                    { return 'HASH_MAP_START'; }
"{"                                     { return 'JS_MAP_START'; }
"}"                                     { return 'MAP_END'; }
"#("                                    { return 'FUNCTION'; }
"%"\d+                                  { return 'ARGUMENTS_ACCESSOR'; }

"~"                                     { return 'UNQUOTE'; }
"'"                                     { return 'QUOTE'; }
"`"                                     { return 'SYNTAX_QUOTE'; }
"..."                                   { return 'SPLAT'; }

":"                                     { return 'KEYWORD'; }
[\w!@#\$%\^&\*\-\+=:'\?\/\\<>\.,]+      { return 'IDENTIFIER'; }   //'

<<EOF>>                                 { return 'EOF'; }
.                                       { return 'INVALID'; }

/lex

%start program
%%

program
  : s_expression_list EOF
    { return [["symbol", "do"]].concat($1); }
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
  | js_map
  ;

callable_list
  : '(' element_list ')'
    { $$ = $2; }
  | '(' ')'
    { $$ = []; }
  ;

quoted_list
  : '[' element_list ']'
    { $$ = [["symbol", "quote"], $2]; }
  | '[' ']'
    { $$ = [["symbol", "quote"], []]; }
  ;
  
js_map
  : JS_MAP_START element_list MAP_END
    { $$ = [["symbol", "js-map"]].concat($2); }
  | JS_MAP_START MAP_END
    { $$ = [["symbol", "js-map"]]; }
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
    { $$ = [["symbol", "quote"], $2]; }
  | SYNTAX_QUOTE s_expression
    { $$ = [["symbol", "syntax-quote"], $2]; }
  | UNQUOTE s_expression
    { $$ = [["symbol", "unquote"], $2]; }
  | SPLAT s_expression
    { $$ = [["symbol", "splat"], $2]; }
  | FUNCTION element_list ')'
    { $$ = [["symbol", "lambda"], [], $2]; }
  | ARGUMENTS_ACCESSOR
    { $$ = [["symbol", "js-eval"], "arguments[" + ($1.substring(1) - 1) + "]"]; }
  ;

atom
  : NIL
    { $$ = null; }
  | BOOLEAN_TRUE
    { $$ = true; }
  | BOOLEAN_FALSE
    { $$ = false; }
  ;

literal
  : STRING
    { $$ = $1.replace(/\n/, "\\n"); }
  | regex
  | number
  ;
  
regex
  : REGEX {
      var re = $1.split("/");
      $$ = [["symbol", "regex"], re[0], re[1]];
    }
  ;
  
number
  : DECIMAL_NUMBER
    { $$ = parseInt(yytext, 10); }
  | OCTAL_NUMBER
    { $$ = parseInt(yytext.replace(/^#0/, ''), 8); }
  | HEXIDECIMAL_NUMBER
    { $$ = parseInt(yytext.replace(/^#x/, ''), 16); }
  | BINARY_NUMBER
    { $$ = parseInt(yytext.replace(/^#b/, ''), 2); }
  ;
  
symbol
  : KEYWORD symbol
    { $$ = [["symbol", "keyword"], $2]; }
  | IDENTIFIER
    { $$ = ["symbol", yytext]; }
  ;
  
%%