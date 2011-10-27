
%lex
%%

\s+                                       { /* ignore */ }
"("                                       { return 'LIST_START'; }
")"                                       { return 'LIST_END'; }
[^'"\s][.\s]+                             { return 'IDENTIFIER'; }
"-"?[0-9]+("."[0-9]+)?\b                  { return 'NUMBER'; }
"[^"]*"|'[^']*'                           { return 'STRING'; }

<<EOF>>                                   { return 'EOF'; }
.                                         { return 'INVALID'; }

/lex

%left LIST_START
%right LIST_END

program
  : block_list EOF
    {{ return ['Program', {}].concat($1) }}
  
block_list