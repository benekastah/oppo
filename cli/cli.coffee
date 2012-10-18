
optimist = require 'optimist'
compiler = require './compile'

argv = optimist
.boolean(['c', 'C', 'w', 'r', 'b', 't', 'i'])
.alias('c', 'compile')
.alias('C', 'compress')
.alias('w', 'watch')
.alias('r', 'repl')
.alias('b', 'browser')
.alias('i', 'include_oppo_core')
.alias('t', 'test')
.alias('o', 'output')
.argv

if argv.browser
  argv.include_oppo_core = yes

if argv.compile and not argv.repl
  files = argv._
  compiler.compile files, argv
else if argv.test
  compiler.runfile "#{__dirname}/../spec/spec.oppo"
else if argv._.length
  compiler.runfile argv._[0]
else
  (require "./repl") argv.compile