/* Oppo - the awesome/experimental lisp on the JSVM */

%lex
%%

";".*                           { /* comment */ }
[\s,]+                              { /* ignore */ }

"("                                 { return '('; }
")"                                 { return ')'; }
"["                                 { return '['; }
"]"                                 { return ']'; }
"{"                                 { return 'HASH_MAP_START'; }
"}"                                 { return 'HASH_MAP_END'; }

"'"                                 { return 'QUOTE'; }
"#("                                { return 'FUNCTION'; }

\"[^\"]*\"\b                        { return 'STRING'; }    \\"
[0-9]+("."[0-9]+)?\b                { return 'DECIMAL_NUMBER'; }
"#0"[0-9]+\b                        { return 'OCTAL_NUMBER'; }
"#0x"[0-9]+\b                       { return 'HEXIDECIMAL_NUMBER'}

"nil"\b                             { return 'NIL'; }
"#t"\b                              { return 'BOOLEAN_TRUE'; }
"#f"\b                              { return 'BOOLEAN_FALSE'; }

[^\s]+\b                            { return 'IDENTIFIER'; }

<<EOF>>                             { return 'EOF'; }
.                                   { return 'INVALID'; }

/lex

%start program
%%

program
  : s_expression_list EOF
    {{ return ['do', $s_expression_list]; }}
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

special_form
  : QUOTE s_expression
    { $$ = ["quote", $2]; }
  | FUNCTION element_list ')'
    { $$ = ["fn", $2]; }
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
    { $$ = yytext; }
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
  ;
  
%%