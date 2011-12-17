
program = '''

(if #f
  (console.log "yay!")
  (console.log {'a "b" 'c "d"}))

'''

code = oppo.read program
compiled = oppo.compile code

console.log compiled

oppo.eval code