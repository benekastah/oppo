
program = '''

(defmacro + (...nums)
  (js-eval (nums.join " + ")))
    
(+ 1 2 3 4)

'''

code = oppo.read program
compiled = oppo.compile code

console.log compiled

console.log "result", eval compiled