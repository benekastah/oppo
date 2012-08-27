readline = require 'readline'
oppo = require '../'

prompt_prefix = "oppo > "
prompt_continued_prefix = ".... >   "
compile = null
code_accum = []

repl = readline.createInterface process.stdin, process.stdout

prompt = (prefix = prompt_prefix) ->
  repl.setPrompt prefix
  repl.prompt()

backlog = ''
run = (buffer) ->
  if not buffer?
    return
  if not buffer.toString().trim()
    prompt()
    return
    
  backlog = code = "#{backlog}#{buffer}"
  
  if code[code.length - 1] is "\\"
    backlog = backlog[0...-1] + "\n"
    prompt(prompt_continued_prefix)
    return
  backlog = ''
  
  code_accum.push code
  if code_accum.length > 1000
    code_accum.shift()

  oppo_data = oppo.read code_accum.join ' '
  if compile
    result = oppo.compile oppo_data, null, __dirname
  else
    try result = oppo.eval oppo_data
    catch e
      code_accum.pop()
      throw e
    try result = JSON.stringify result
  console.log result
  
  prompt()

error = (err) ->
  console.log (err.stack or err.toString)
  prompt()

process.on 'uncaughtException', error

repl.on 'attemptClose', ->
  process.stdout.write '\n'
  repl.close()
  
repl.on 'close', ->
  process.stdout.write '\n'
  process.stdin.destroy()
  
repl.on 'line', run
prompt()

module.exports = start = (c) ->
  compile = c
  run()
