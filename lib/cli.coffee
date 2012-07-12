
optimist = require 'optimist'

argv = optimist
.boolean(['c', 'w', 'r'])
.alias('c', 'compile')
.alias('w', 'watch')
.alias('r', 'repl')
.alias('o', 'output')
.alias('b', 'beautify')
.argv

if argv.compile
  files = argv._
  {output, watch, beautify} = argv
  (require "./compile") output, files, watch, beautify
else
  (require "./repl") argv.compile