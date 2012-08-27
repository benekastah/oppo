
optimist = require 'optimist'
compiler = require './compile'

argv = optimist
.boolean(['c', 'w', 'r', 'b', 't'])
.alias('c', 'compile')
.alias('w', 'watch')
.alias('r', 'repl')
.alias('b', 'beautify')
.alias('t', 'test')
.alias('o', 'output')
.argv

if argv.compile and not argv.repl
  files = argv._
  {output, watch, beautify} = argv
  compiler.compile output, files, watch, beautify
else if argv.test
  compiler.runfile "#{__dirname}/../spec/spec.oppo"
else if argv._.length
  compiler.runfile argv._[0]
else
  (require "./repl") argv.compile