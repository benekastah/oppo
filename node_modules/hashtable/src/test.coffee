
try {Hash, QHash} = require 'hashtable'
catch e 
  {Hash, QHash} = window
hkey = Hash.key

hash = new Hash()
hash[hkey [1,2,3,4]] = "asdf"

# console.log hkey([1,2,3,4]) is hkey([1,2,3,4])
# console.log hkey(a: 'b', c: 'd') is hkey(c: 'd', a: 'b')
# console.log hkey(a: { b: { c: 'd', e: 'f'}}, g: 'h') is hkey(g: 'h', a: { b: { e: 'f', c: 'd'}})

h = new QHash()

for [0..4]
  key = { verb: 'get', route: '/' }
  action = -> dosomething()
  h.set key, action

console.log h.getStorage()