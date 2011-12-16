path = require 'path'
fs = require 'fs'
oppo = require '../'
cwd = process.cwd()

# console.log "oppo", oppo

getFiles = (file_and_dir_list) ->
  files = []
  for item in file_and_dir_list
    full_item = path.resolve item
    try stats = fs.statSync full_item
    catch e
      full_item = "#{full_item}.oppo"
      try stats = fs.statSync full_item
      catch e
        console.error "No file #{full_item.replace /\.oppo$/, ''} found"
        break
    
    if stats.isDirectory()
      dir_contents = fs.readdirSync full_item
      files.concat getFiles dir_contents
    else if stats.isFile()
      files.push full_item
  files

module.exports = compile = (output, source_files, watch) ->
  files = getFiles source_files
  if /\.js$/.test output
    output_fname = path.basename output
    output_dir = path.dirname output
  else
    output_dir = output
  
  for file in files
    dir = path.dirname file
    fname = path.basename file
    
    if watch
      fs.watch file, compile.bind output_dir, file
    
    if not /\.oppo$/.test fname
      fname = "#{file}.oppo"
    jsfile = fname.replace /\.oppo$/, '.js'
    jsfile = path.join output_dir ? dir, output_fname ? jsfile
    
    fs.readFile file, 'utf8', (err, code) ->
      throw err if err
      
      read_code = oppo.read code
      compiled_code = oppo.compile read_code
      
      fs.writeFile jsfile, compiled_code
      console.log "Compiled #{jsfile}"