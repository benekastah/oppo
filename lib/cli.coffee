
optimist = require 'optimist'

argv = optimist
.boolean(['c', 'w', 'r'])
.alias('c', 'compile')
.alias('w', 'watch')
.alias('r', 'repl')
.alias('o', 'output')
.argv

if argv.compile
  files = argv._
  {output, watch} = argv
  (require "./compile") output, files, watch
else
  (require "./repl") argv.compile