readline = require 'readline'
oppo = require 'oppo'

prompt_prefix = "oppo > "
prompt_continued_prefix = ".... >   "
compile = null

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
  
  oppo_data = oppo.read code
  if compile
    result = oppo.compile oppo_data
  else
    result = oppo.eval oppo_data
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
