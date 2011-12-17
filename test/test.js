(function() {
  var code, compiled, program;

  program = '\n(if #f\n  (console.log "yay!")\n  (console.log {\'a "b" \'c "d"}))\n';

  code = oppo.read(program);

  compiled = oppo.compile(code);

  console.log(compiled);

  oppo.eval(code);

}).call(this);
