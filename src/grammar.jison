/* Oppo - the awesome/experimental lisp on the JSVM */

%lex
%%

";".*                               { /* comment */ }
[\s,]+                              { /* ignore */ }

"("                                 { return '('; }
")"                                 { return ')'; }
"["                                 { return '['; }
"]"                                 { return ']'; }
"{"                                 { return 'HASH_MAP_START'; }
"}"                                 { return 'HASH_MAP_END'; }

"'"                                 { return 'QUOTE'; }
"`"                                 { return 'SYNTAX_QUOTE'; }
"#("                                { return 'FUNCTION'; }
"~("                                { return 'INFIX'; }
"..."                               { return 'SPLAT'; }
":"                                 { return ':'; }

\"[^\"]*\"                          { return 'STRING'; }    //"
[+-]?[0-9]+("."[0-9]+)?\b           { return 'DECIMAL_NUMBER'; }
[+-]?"#0"[0-9]+\b                   { return 'OCTAL_NUMBER'; }
[+-]?"#0x"[0-9]+\b                  { return 'HEXIDECIMAL_NUMBER'}

"nil"\b                             { return 'NIL'; }
"#t"\b                              { return 'BOOLEAN_TRUE'; }
"#f"\b                              { return 'BOOLEAN_FALSE'; }

.+?(?=[)}\]\s]+)                    { return 'IDENTIFIER'; }

<<EOF>>                             { return 'EOF'; }
.                                   { return 'INVALID'; }

/lex

%start program
%%

//[^#:\s]{1}[!@#\$%\^&\*\-\+=\|\\:'"\/\?\.,<>\w]*   { return 'IDENTIFIER'; } //'

program
  : s_expression_list EOF
    { return ["program"].concat($1); }
  ;

s_expression_list
  : s_expression
    { $$ = [$1]; }
  | s_expression_list s_expression
    { $$ = $1; $$.push($2); }
  ;

s_expression
  : special_form
  | list
  | symbol
  | splat
  | literal
  | atom
  ;

list
  : callable_list
  | typed_list
  | hash_map
  ;

callable_list
  : '(' element_list ')'
    { $$ = $2; }
  | '(' ')'
    { $$ = []; }
  ;

typed_list
  : '[' element_list ']'
    { $$ = ["typed-list", $2]; }
  | '[' ']'
    { $$ = ["typed-list", []]; }
  ;
  
hash_map
  : HASH_MAP_START element_list HASH_MAP_END
    { $$ = ["hash-map", $2]; }
  | HASH_MAP_START HASH_MAP_END
    { $$ = ["hash-map", []]; }
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
  
splat
  : SPLAT symbol
    { $$ = ["splat", $2]; }
  ;

special_form
  : QUOTE s_expression
    { $$ = ["quote", $2]; }
  | SYNTAX_QUOTE s_expression
    { $$ = ["syntax-quote", $2]; }
  | FUNCTION element_list ')'
    { $$ = ["lambda", [], $2]; }
  | INFIX element_list ')'
    { $$ = ["infix", $2]; }
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
    { $$ = "\"" + yytext.substr(1, yytext.length-2).replace(/"/g, '\\"') + "\""; }
  | number
  ;
  
number
  : DECIMAL_NUMBER
    { $$ = Number(yytext, 10); }
  | OCTAL_NUMBER
    { $$ = parseInt(yytext.replace(/^#/, ''), 8); }
  | HEXIDECIMAL_NUMBER
    { $$ = parseInt(yytext.replace(/^#/, ''), 16); }
  ;
  
symbol
  : IDENTIFIER
    { $$ = yytext; }
  | ':' IDENTIFIER
    { $$ = ["keyword", $2]}
  ;
  
%%