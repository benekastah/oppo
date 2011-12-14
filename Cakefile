
process.chdir __dirname
exec = (require 'child_process').exec
fs = require 'fs'

post_exec = (success, error) ->
  error = (e) -> throw e
  (err, stdout, stderr) ->
    console.log stdout if stdout.trim()
    console.error stderr if stderr.trim()
    if err? and error? then error err
    else if success? then success stdout

option '-o', '--output [DIR]', 'set the output directory for an action'

task "build:parser", "rebuild the Jison parser", (options) ->
  dir = options.output ?= "dist"
  exec "jison src/grammar.jison -o #{dir}/parser.js", post_exec(options.success, options.error)

task "build", "build the oppo main file", (options) ->
  dir = options.output ?= "dist"
  
  scripts = [
    "compiler.coffee"
  ].map (f) -> "src/#{f}"
  
  options.success = ->
    command = "coffee -j #{dir}/oppo-compiler.js -c src"
    exec command, post_exec ->
      command = "bin/oppo -c src/oppo -o oppo-runtime.js"
      # command = ""
      exec command, post_exec ->
        command = """
        java -jar google-closure-compiler/compiler.jar
          --js 
            #{dir}/parser.js 
            #{dir}/oppo-compiler.js 
            #{dir}/oppo-runtime.js
          --js_output_file
            #{dir}/oppo.js
          --compilation_level
            WHITESPACE_ONLY
          --formatting
            PRETTY_PRINT
        """
        command = command.replace /\s+/g, ' '
        console.log command
        exec command, post_exec()
    
  invoke "build:parser"
    