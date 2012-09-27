path = require 'path'
fs = require 'fs'
oppo = require '../'
child_process = require 'child_process'
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

@compile = (output, files, watch, beautify) ->
  for file in files
    compile output, file, watch, beautify

r_absolute_path = /^\//
r_file_extension = /\.oppo$/
compile = (output, file, watch, beautify) ->
  if not r_absolute_path.test file
    file = path.join __dirname, "..", file
  
  if /\.js$/.test output
    output_fname = path.basename output
    output_dir = path.dirname output
  else
    output_dir = output

  jsfile = output_fname ? file.replace r_file_extension, '.js'
  jsfile = path.join output_dir ? dir, jsfile  

  if watch
    fs.watch file, compile.bind arguments...
      
  compiled_code = oppo.compile_from_file file
  console.log "Compiled #{file}"

  fs.writeFile jsfile, compiled_code, (err) ->
    throw err if err?
    console.log "Wrote #{jsfile}"


@runfile = (file) ->
  module_name = get_module_name file
  code = fs.readFileSync file, 'utf8'
  read_code = oppo.read code
  compiled_code = oppo.compile read_code, dir
  console.log (eval compiled_code)
