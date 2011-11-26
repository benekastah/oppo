#! /usr/bin/env coffee

process.chdir __dirname
exec = (require 'child_process').exec
try oppo = require "#{__dirname}/dist/oppo"
fs = require 'fs'

post_exec = (success, error) ->
  (err, stdout, stderr) ->
    console.log stdout if stdout.trim()
    console.error stderr if stderr.trim()
    if err and error then error err
    else if success then success stdout

option '-o', '--output [DIR]', 'where the parser.js file should live'

task "build:parser", "rebuild the Jison parser", (options) ->
  dir = options.output ? "dist"
  exec "jison src/grammar.jison -o #{dir}/parser.js", post_exec()
    
# task "build:runtime", "build the Oppo runtime"
    
task "build", "build the Oppo runtime into a single output file", (options) ->
  dir = options.output ? "dist"
  jdir = "src"
  scripts = [
    # module must come first
    "module"
    # compiler stuff - everything in the compiler folder
    "compiler"
    # runtime stuff - everything in the oppo folder
    "oppo"
    # oppo must come last
    "oppo.coffee"
  ].map (x) -> "#{jdir}/#{x}"
  
  invoke 'build:parser'
  command = "coffee -cj #{dir}/oppo.js #{scripts.join ' '}"
  console.log command
  exec command, post_exec
  
task "compile", "compile oppo file(s)", (options) ->
  {output} = options
  [__, files...] = options.arguments
  output ?= process.cwd()
  
  oppo = 
  
  for file in files
    if not /\.oppo$/.test file
      file = "#{file}.oppo"
    jsfile = file.replace /\.oppo$/, '.js'
    jsfile = "#{output}/#{jsfile}"
    
    fs.readFile file, 'utf8', (err, code) ->
      console.log code
      fs.writeFile jsfile, oppo.eval code
      console.log "hasdf"
    
    