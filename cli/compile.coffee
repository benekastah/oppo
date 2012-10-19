path = require 'path'
fs = require 'fs'
oppo = require '../'
child_process = require 'child_process'
{exec} = child_process
cwd = process.cwd()

# console.log "oppo", oppo

getFiles = (file_and_dir_list, base_dir = '') ->
  files = []
  for item in file_and_dir_list
    full_item = path.join base_dir, item
    try stats = fs.statSync full_item
    catch e
      full_item = "#{full_item}.oppo"
      try stats = fs.statSync full_item
      catch e
        console.error "No file #{full_item.replace /\.oppo$/, ''} found"
        break
    
    if stats.isDirectory()
      dir_contents = fs.readdirSync full_item
      files = files.concat (getFiles dir_contents, full_item)
    else if stats.isFile()
      files.push full_item
  files

get_base_dir = (file) ->
  path.dirname path.resolve(file)

get_module_name = (file, base_dir = get_base_dir file) ->
  module_name = path.resolve file
  # If module_name starts with base_dir, remove base_dir from the beginning
  if module_name.substr(0, base_dir.length) is base_dir
    module_name = module_name.substr base_dir.length
  module_name = module_name.replace /\.oppo$/, ''
  module_name


uglify = (file, argv, callback) ->
  ug1 = null
  ug2 = null
  exec "which uglifyjs2", (err, output) ->
    ug2 = not err and !!output
    action()
  exec "which uglifyjs", (err, output) ->
    ug1 = not err and !!output
    action()

  action = ->
    if ug1? and ug2?
      command = if ug2
        uglify2 file, argv
      else if ug1
        uglify1 file, argv

      if command?
        exec command, write_file
      else
        callback()
        
  write_file = (err, output) ->
    throw err if err?
    fs.writeFile file, output, callback
        

uglify2 = (file, {compress}) ->
  switches = if compress
    "-c"
  else
    "-b indent-level=2 --comments all"
  "uglifyjs2 #{file} #{switches}"
        

uglify1 = (file, {compress}) ->
  switches = if compress
    ""
  else
    "-b --indent 2 -nm -ns --no-seqs"
  "uglifyjs #{switches} #{file}"


@compile = (files, argv) ->
  for file in files
    compile file, argv


r_absolute_path = /^\//
compile = (file, argv, ignore_output) ->
  {output, watch, include_oppo_core, browser, quiet} = argv
  
  if not r_absolute_path.test file
    file = path.join process.cwd(), file

  if watch
    fs.watch file, compile.bind arguments...
      
  compiled_code = oppo.compile_from_file file
  if include_oppo_core
    oppo_core = fs.readFileSync "#{__dirname}/../dist/oppo.js"
    compiled_code = """
    #{oppo_core}

    #{compiled_code}
    """
  else if not browser
    compiled_code = """
    if (typeof oppo === 'undefined') {
      try {
        require('oppo');
      } catch (e) {
        throw new Error('oppo object not available. Make sure you have oppo properly installed.');
      }
    }

    #{compiled_code}
    """

  console.log "Compiled #{file}" if not quiet
    
  if not ignore_output
    send_to_output compiled_code, file, argv
  compiled_code


r_file_extension = /\.oppo$/
send_to_output = (compiled_code, source_file, argv) ->
  {output, beautify, quiet} = argv
  if output?
    if /\.js$/.test output
      output_fname = path.basename output
      output_dir = path.dirname output
    else
      output_dir = output
  
    jsfile = output_fname ? file.replace r_file_extension, '.js'
    jsfile = path.join output_dir ? dir, jsfile

    fs.writeFile jsfile, compiled_code, (err) ->
      throw err if err?
      uglify jsfile, argv, (err) ->
        throw err if err?
        console.log "Wrote #{jsfile}" if not quiet
  else
    console.log compiled_code


@runfile = (file, argv) ->
  {quiet} = argv
  argv.quiet = yes
  compiled_code = compile file, argv, true
  argv.quiet = quiet
  eval compiled_code