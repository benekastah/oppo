#! /usr/bin/env coffee

process.chdir __dirname
exec = (require 'child_process').exec

post_exec = (success, error) ->
  (err, stdout, stderr) ->
    console.log stdout if stdout.trim()
    console.error stderr if stderr.trim()
    if err and error then error err
    else if success then success stdout

option '-o', '--output [DIR]', 'where the parser.js file should live'

task "build:parser", "rebuild the Jison parser", (options) ->
  dir = options.output or "dist"
  exec "jison src/grammar.jison -o #{dir}/parser.js", post_exec()
    
task "build", "build the Oppo runtime into a single output file", (options) ->
  dir = "dist"
  jdir = "src"
  scripts = [
    # module must come first
    "module"
    # don't worry about order here...
    "macro"
    # "type-checker"
    "compiler"
    "helpers"
    "core"
    "arithmetic"
    # oppo must come last
    "oppo"
  ].map (x) -> "#{jdir}/#{x}"
  
  options.output = dir
  
  exec "coffee -cj #{dir}/oppo.js #{scripts.join ' '}", post_exec()
  invoke 'build:parser'