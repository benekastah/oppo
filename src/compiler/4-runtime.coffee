do ->
  underscore_fns =
    # Collections
    each: null
    map: null
    reduce: ["reduce", "foldl"]
    reduceRight: ["reduce-right", "foldr"]
    find: null
    filter: null
    reject: null
    all: null
    any: null
    include: null
    invoke: null
    pluck: null
    # max: null
    # min: null
    sortBy: ["sort-by"]
    groupBy: ["group-by"]
    sortedIndex: ["sorted-index"]
    shuffle: null
    toArray: ["->array"]
    size: null
  
    # Arrays
    first: ["first", "head"]
    initial: ["initial", "init"]
    last: null
    rest: ["rest", "tail"]
    compact: null
    flatten: null
    without: null
    union: null
    intersection: null
    difference: null
    uniq: null
    zip: null
    indexOf: ["index-of"]
    lastIndexOf: ["last-index-of"]
    range: null
    bind: null
    bindAll: ["bind-all"]
    memoize: null
    delay: null
    defer: null
    throttle: null
    debounce: null
    once: null
    after: null
    wrap: null
    compose: null
  
    # Objects
    keys: null
    values: null
    functions: null
    extend: null
    defaults: null
    clone: null
    tap: null
    isEqual: ["equal?", "="]
    isEmpty: ["empty?"]
    isElement: ["element?"]
    isArray: ["array?", "list?"]
    isArguments: ["arguments?"]
    isFunction: ["function?", "fn?"]
    isNumber: ["number?", "num?"]
    isBoolean: ["boolean?", "bool?"]
    isDate: ["date?"]
    isRegExp: ["regex?"]
    isNaN: ["nan?"]
    isNull: ["nil?"]
    isUndefined: ["undefined?"]
  
    # Utility
    # noConflict: null
    identity: null
    times: null
    uniqueId: ["unique-id"]
    escape: ["escape-html"]
    template: null
  
    # Chaining
    chain: null
    value: null
  
  for own fname, oppo_names of underscore_fns
    oppo_names ?= [fname]
    value = "_.#{fname}"
    for name in oppo_names
      DEF name, value
    
    
    
DEF 'global', "typeof global !== 'undefined' ? global : window"

## Math functions
make_math_fn = (symbol, js_symbol = symbol) ->
  DEF symbol, """
  function () {
    var i, num, len, current;
    for (i = 0, len = arguments.length; i < len; i++) {
      current = arguments[i];
      if (num == null) num = current;
      else num #{js_symbol}= current;
    }
    return num;
  }
  """

make_math_fn '+'
make_math_fn '*'
make_math_fn '-'
make_math_fn '/'
make_math_fn '%'
DEF '**', 'Math.pow'
DEF 'max', 'Math.max'
DEF 'min', 'Math.min'

## Conversion functions
DEF '->bool', compile [
  (to_symbol 'lambda')
  [(to_symbol 'x')]
  [(to_symbol 'if'), (to_symbol 'x'), [(to_symbol 'js-eval'), 'true'], [(to_symbol 'js-eval'), 'false']]
]

## Binary functions
DEF 'and', """
function () {
  var i, len, item;
  i = 0;
  len = arguments.length;
  for (; i < len; i++) {
    item = arguments[i];
    if (!#{compile to_symbol '->bool'}(item))
      break;
  }
  return item;
}
""", "->bool"

DEF 'or', """
function () {
  var i, len, item;
  i = 0;
  len = arguments.length;
  for (; i < len; i++) {
    item = arguments[i];
    if (#{compile to_symbol '->bool'}(item))
      break;
  }
  return item;
}
""", "->bool"