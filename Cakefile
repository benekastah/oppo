
process.chdir __dirname
exec = (require 'child_process').exec
fs = require 'fs'
path = require 'path'
oppo = require 'dist/oppo'

post_exec = (options, error) ->
  if typeof options is "function"
    success = options
  else
    {success, error} = options
  error ?= (e) -> throw e
  
  (err, stdout, stderr) ->
    console.log stdout if stdout.trim()
    console.error stderr if stderr.trim()
    if err? and error? then error err
    else if success? then success stdout

option '-o', '--output [DIR]', 'set the output directory for an action'
option '-R', '--omit-runtime', 'omit the runtime from the google closure compilation'
option '-f', '--formatting', 'set the formatting for the google closure compilation'
option '-l', '--compilation_level', 'set the compilation level for the google closure compilation'

task "build", "Build all", (options) ->
  dir = options.output ?= "dist"
    
  # Confusingly, the order of the commands should be read from the bottom up
  options.success = ->
    options.success = ->
      options.success = ->
        options.success = null
        invoke "closure:compile"
      invoke "build:runtime"
    invoke "build:compiler"
  invoke "build:parser"

task "clean", "Clean files from old builds", (options) ->
  dir = options.output ?= "dist"
  fs.readdir dir, (err, files) ->
    throw err if err
    for file in files
      full = path.join __dirname, dir, file
      console.log "Removing file: #{full}"
      fs.unlink full

task "build:parser", "Generate the Jison parser", (options) ->
  dir = options.output ?= "dist"
  command = "jison src/grammar.jison -o #{dir}/parser.js"
  console.log "Generate jison parser: #{command}"
  exec command, post_exec options
    
task "build:compiler", "Build the oppo compiler", (options) ->
  dir = options.output ?= "dist"

  scripts = "src/compiler"

  command = "coffee -j #{dir}/oppo-compiler.js -c #{scripts}"
  console.log "Building oppo compiler: #{command}"
  
  exec command, post_exec options
  
task "closure:compile", "Compile existing build files into single oppo.js file", (options) ->
  dir = options.output ?= "dist"
  {formatting, compilation_level} = options
  
  compilation_level ?= "WHITESPACE_ONLY" # "ADVANCED_OPTIMIZATIONS"
  formatting ?= "PRETTY_PRINT"
  formatting = if formatting?
    """
    --formatting
      #{formatting}
    """
  else ""
  
  runtime = if options['omit-runtime'] then '' else "#{dir}/oppo-runtime.js"
  
  command = """
  java -jar google-closure-compiler/compiler.jar
    --js 
      #{dir}/parser.js 
      #{dir}/oppo-compiler.js 
      #{runtime}
    --js_output_file
      #{dir}/oppo.js
    --compilation_level
      #{compilation_level}
    #{formatting}
  """
  
  console.log "Running the Google Closure compiler:\n#{command}"
  
  # This formatting removes newlines, which break bash's ability to execute the command
  command = command.replace /\s+/g, ' '
  
  exec command, post_exec options
  
# task "compile:runtime", "Compile oppo runtime", (options) ->
#   unless options['omit-runtime']
#     dir = options.output ?= "dist"
#     command = "bin/oppo -c src/runtime -o #{dir}/oppo-runtime.js"
#     console.log "Compiling oppo runtime: #{command}"
#     exec command, post_exec options
#   else
#     options.success and options.success()
    
task "build:runtime", "Build oppo runtime", (options) ->
  unless options['omit-runtime']
    dir = options.output ?= "dist"
    file = "#{dir}/oppo-runtime.js"
    command = "coffee -j #{file} -cb src/runtime"
    
    console.log "Building runtime coffeescripts: #{command}"
    exec command, post_exec ->
      fs.readFile file, "utf8", (err, file_contents) ->
        if err then throw err
        
        fs.readFile "src/runtime/runtime.oppo", "utf8", (err, code) ->
          if err then throw err
          file_contents = """
          (function () {
            var oppoString, code, result, oppo;

            if (typeof window === 'undefined')
              oppo = exports;
            else
              oppo = window.oppo;
              
            #{file_contents}
              
            #{oppo.compile (oppo.read code), false}
          })();
          """
        
          console.log "Writing runtime file, including oppo code..."
          fs.writeFile file, file_contents, 'utf8', options.success
  else
    options.success?()
    