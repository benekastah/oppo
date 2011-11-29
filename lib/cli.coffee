
argv = (require 'optimist')
.boolean(['c', 'w']).argv

compile = argv.c or argv.compile
repl = argv.r or argv.repl

if compile and not repl
  files = argv._
  output_dir = argv.o
  watch = argv.w
  (require "./compile") output_dir, files, watch
else
  (require "./repl") compile