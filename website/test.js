// Generated by CoffeeScript 1.3.3
(function() {
  var compiled, oppo_code, parse_tree, result;

  oppo_code = "\n;; Hey there!\n(def (identity x) x)\n(alert (identity .5))\n";

  parse_tree = oppo.read(oppo_code);

  compiled = oppo.compile(parse_tree);

  result = eval(compiled);

}).call(this);