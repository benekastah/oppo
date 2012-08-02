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

@compile = (output, source_files, watch, beautify) ->
  files = getFiles source_files

  if /\.js$/.test output
    output_fname = path.basename output
    output_dir = path.dirname output
  else
    output_dir = output
  
  c_files = for file in files
    dir = path.dirname file
    fname = path.basename file

    # Ignore private files
    if /^\./.test fname
      continue
    
    if watch
      fs.watch file, compile.bind output_dir, file
    
    if not /\.oppo$/.test fname
      fname = "#{file}.oppo"
    jsfile = output_fname ? fname.replace /\.oppo$/, '.js'
    tmp_jsfile = jsfile.replace /\.js$/, '-TEMP.js'
    jsfile = path.join output_dir ? dir, jsfile
    tmp_jsfile = path.join output_dir ? dir, tmp_jsfile
    
    code = fs.readFileSync file, 'utf8'
    try
      read_code = oppo.read code
      compiled_code = oppo.compile read_code, false, dir
      console.log "Compiled #{fname}"
    catch e
      console.warn "Error compiling #{fname}", e
      compiled_code = ''

    compiled_code

  oppo_js = fs.readFileSync "#{__dirname}/../dist/oppo.js", 'utf8'
  include_oppo = """
  if (typeof module !== 'undefined' && typeof require !== 'undefined') {
    require('oppo');
  } else {
    #{oppo_js}
  }
  """
  c_files.unshift include_oppo, oppo.compile_runtime()

  fs.writeFileSync jsfile, c_files.join ';'
  # fs.writeFileSync tmp_jsfile, c_files.join ';'
  # child_process.exec "uglifyjs --overwrite #{if beautify then '--beautify' else ''} --lift-vars #{jsfile}; rm #{tmp_jsfile}; echo \"Wrote #{jsfile}\""
  # child_process.exec "closure-compiler --compilation_level ADVANCED_OPTIMIZATIONS " +
  #   "#{if beautify then "--formatting=pretty_print" else ""} " +
  #   "--js_output_file #{jsfile} --js #{tmp_jsfile}; " +
  #   "rm #{tmp_jsfile}; echo \"Wrote #{jsfile}\""

@runfile = (file) ->
  dir = path.dirname file
  code = fs.readFileSync file, 'utf8'
  read_code = oppo.read code
  compiled_code = oppo.compile read_code, null, dir
  console.log (eval compiled_code)
