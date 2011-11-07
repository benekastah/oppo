(function() {
  var ast;
  ast = parser.parse('a\n;( a b c d )\n');
  console.log("ast:", ast);
}).call(this);
