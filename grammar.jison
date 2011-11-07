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
    {{ return $s_expression_list; }}
  ;

s_expression_list
  : s_expression
    { $$ = [$1]; console.log("dbg:", "s_expression_list", $$); }
  | s_expression_list s_expression
    { $$ = $1; $$.push($2); console.log("dbg:", "s_expression_list", $$); }
  ;

s_expression
  : special_form
  | list
  | symbol
  | literal
  | atom
  ;

list
  : basic_list
  | typed_list
  | hash_map
  ;

basic_list
  : '(' element_list ')'
    { $$ = $2; console.log("dbg:", "list", $$); }
  | '(' ')'
    { $$ = []; console.log("dbg:", "list", $$); }
  ;

typed_list
  : '[' element_list ']'
    { $$ = ["typed-list", $2]; console.log("dbg:", "typed_list", $$); }
  | '[' ']'
    { $$ = ["typed-list", []]; console.log("dbg:", "typed_list", $$); }
  ;
  
hash_map
  : HASH_MAP_START element_list HASH_MAP_END
    { $$ = ["hash-map", $2]; console.log("dbg:", "hash_map", $$); }
  | HASH_MAP_START HASH_MAP_END
    { $$ = ["hash-map", []]; console.log("dbg:", "hash_map", $$); }
  ;

element_list
  : element
    { $$ = [$1]; console.log("dbg:", "element_list", $$); }
  | element_list element
    { $$ = $1; $$.push($2); console.log("dbg:", "element_list", $$); }
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
    { $$ = null; console.log("dbg:", "nil", $$); }
  | BOOLEAN_TRUE
    { $$ = true; console.log("dbg:", "true", $$); }
  | BOOLEAN_FALSE
    { $$ = false; console.log("dbg:", "false", $$); }
  ;

literal
  : STRING
    { $$ = yytext; "a".replace(/^"/, "").replace(/"$/, ""); console.log("dbg:", "string", $$); }
  | number
  ;
  
number
  : DECIMAL_NUMBER
    { $$ = Number(yytext, 10); console.log("dbg:", "decimal", $$); }
  | OCTAL_NUMBER
    { $$ = parseInt(yytext.replace(/^#/, ''), 8); console.log("dbg:", "octal", $$); }
  | HEXIDECIMAL_NUMBER
    { $$ = parseInt(yytext.replace(/^#/, ''), 16); console.log("dbg:", "hexidecimal", $$); }
  ;
  
symbol
  : IDENTIFIER
    { $$ = yytext; console.log("dbg:", "ident", $$); }
  ;
  
%%