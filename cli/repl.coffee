readline = require 'readline'
oppo = require '../'

prompt_prefix = "oppo > "
prompt_continued_prefix = ".... >   "
compile = null

repl = readline.createInterface
  input: process.stdin
  output: process.stdout
  terminal: yes

prompt = (prefix = prompt_prefix) ->
  repl.setPrompt prefix
  repl.prompt()

puts_symbol = new oppo.Symbol "puts"
do_symbol = new oppo.Symbol "do"

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

  try
    oppo_data = oppo.read code
    if compile
      result = oppo.compile oppo_data
    else
      # Log the result
      oppo_data = [puts_symbol, [do_symbol, oppo_data...]]
      result = oppo.eval oppo_data
      result = oppo.helpers.to_oppo_string result
  catch e
    try console.error e.toString()
    throw e
  
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
