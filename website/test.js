// Generated by CoffeeScript 1.3.3
(function() {
  var compile_code, result;

  compile_code = function(code) {
    var compiled, parse_tree, result;
    parse_tree = oppo.read(code);
    compiled = oppo.compile(parse_tree);
    return result = eval(compiled);
  };

  result = compile_code("\n(def x (eq \"a\" \"a\"))\n");

}).call(this);
