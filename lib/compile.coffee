path = require 'path'
fs = require 'fs'
oppo = require '../'
cwd = process.cwd()

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

module.exports = compile = (output_dir, source_files, watch) ->
  files = getFiles source_files
  
  for file in files
    dir = path.dirname file
    fname = path.basename file
    
    if watch
      fs.watch file, compile.bind output_dir, file
    
    if not /\.oppo$/.test fname
      fname = "#{file}.oppo"
    jsfile = fname.replace /\.oppo$/, '.js'
    jsfile = "#{output_dir ? dir}/#{jsfile}"
    
    fs.readFile file, 'utf8', (err, code) ->
      read_code = oppo.read code
      compiled_code = oppo.compile read_code
      
      fs.writeFile jsfile, compiled_code
      console.log "Compiled #{jsfile}"