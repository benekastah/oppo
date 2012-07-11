
define = (defs) ->
  sym_js_eval = new C.Symbol "js-eval"
  sym_def = new C.Symbol "def"
  defs = for [name, val] in defs
    sym = new C.Symbol name
    o_val = new C.Raw "#{val}"
    new C.List [sym_def, sym, o_val]

  result = new C.CodeFragment defs
  scope = C.current_scope()
  var_stmt = scope.var_stmt()
  "#{var_stmt}#{result._compile()};"

compare_op = (sym) ->
  """
  function () {
    var last = arguments[0];
    for (var i=1, len=arguments.length; i<len; i++) {
      var current = arguments[i];
      var result = last #{sym} current;
      if (!result) return result;
      last = current;
    }
    return true;
  }
  """

binary_op = (sym, _not=false) ->
  """
  function () {
    var last = arguments[0];
    for (var i=1, len=arguments.length; i<len; i++) {
      if (#{if _not then '!' else ''}last) return last;
      last = last #{sym} arguments[i];
    }
    return last;
  }
  """

math_op = (sym, explicit_convert=false) ->
  """
  function () {
    var x = arguments[0];
    for (var i=1, len=arguments.length; i<len; i++) {
      x #{sym}= #{if explicit_convert then '+' else ''}arguments[i];
    }
    return x;
  }
  """

push_unshift_op = (method) ->
  """
  function (a) {
      var args = __slice__.call(arguments, 1);
      var new_a = a.slice();
      new_a.#{method}.apply(new_a, args);
      return new_a;
  }
  """

pop_shift_op = (method) ->
  """
  function (a) {
    var new_a = a.slice();
    new_a.#{method}();
    return new_a;
  }
  """

compile_runtime = ->

  define [
    ## Math
    ['+', (math_op '+', true)]

    ['-', math_op '-']

    ['*', math_op '*']

    ['/', math_op '/']

    ['mod', (a, b) -> a % b]

    ['**', "Math.pow"]


    ## Comparisons
    ['=', compare_op '===']

    ['not=', compare_op '!==']

    ['<', compare_op '<']

    ['>', compare_op '>']

    ['<=', compare_op '<=']

    ['>=', compare_op '>=']


    ## Binary operations
    ['or', binary_op '||']

    ['and', (binary_op '&&', true)]


    ## Misc
    ['oppo-eval', 'oppo.eval']
    ['__typeof__', 'lemur.core.to_type']
    ['typeof', '__typeof__']


    ## Array functions
    ['__slice__', 'Array.prototype.slice']

    ['first', (a) -> a[0]]

    ['second', (a) -> a[1]]

    ['last', (a) -> a[a.length - 1]]

    ['init', (a) -> a.slice 0, a.length - 1]

    ['rest', (a) -> a.slice 1]

    ['nth', (a, n) ->
      if n < 0
        n += a.length
      else if n is 0
        console.warn "nth treats collections as 1-based instead of 0 based. Don't try to access the 0th element."
        return null
      else
        n -= 1

      a[n]
    ]

    ['push', push_unshift_op "push"]
    ['push-right', 'push']
    ['push-r', 'push']

    ['push-left', push_unshift_op "unshift"]
    ['push-l', (new C.Symbol 'push-left').compile()]

    ['pop', pop_shift_op "pop"]
    ['pop-right', 'pop']
    ['pop-r', 'pop']

    ['pop-left', pop_shift_op "shift"]
    ['pop-l', (new C.Symbol 'pop-left').compile()]

    ['concat', `function (x) {
      var args = __slice__.call(arguments, 1);
      return x.concat.apply(x, args);
    }`]

    ['sort', (a, f) ->
      new_a = a.slice()
      if f? then new_a.sort f
      else new_a.sort()
    ]

    ## Collections
    ['map', (f, o) ->
      t = __typeof__ o
      if o.map?
        o.map (x) -> f x
      else if t is "array" or o instanceof Array
        for x in o then f x
      else if t is "object" or o instanceof Object
        result = {}
        for k, v of o
          if not o.hasOwnProperty k then continue
          result[k] = f [k, v]
        result
    ]

    ['reduce', (f, o) ->
      t = __typeof__ o
      if o.reduce?
        return o.reduce (a, b) -> f a, b
      else if t is "array" or o instanceof Array
        for x in o
          if not result?
            result = x
            continue
          result = f result, x
      else if t is "object" or o instanceof Object
        for k, v of o
          if not o.hasOwnProperty k then continue
          if not result?
            result = v
            continue
          result = f result, v
      result
    ]

    ['reduce-right', (f, o) ->
      t = __typeof__ o
      if o.reduceRight?
        o.reduceRight (a, b) -> f a, b
      else if t is "array" or o instanceof Array
        for x in o.slice().reverse()
          if not result?
            result = x
            continue
          result = f result, x
        result
      else if t is "object" or o instanceof Object
        reduce f, o
    ]
    ['reduce-r', (new C.Symbol 'reduce-right').compile()]

    ['filter', (f, o) ->
      t = __typeof__ o
      if o.filter?
        return o.filter (x) -> f x
      else if t is "array" or o instanceof Array
        result = []
        for x in o
          if f x
            result.push x
      else if t is "object" or o instanceof Object
        result = {}
        for k, v of o
          if not o.hasOwnProperty k then continue
          if f [k, v]
            result[k] = v
      result
    ]

    ['keys', "Object.keys || " + (o) ->
      for k of o
        if  not o.hasOwnProperty k then continue
        k
    ]

    ['values', (o) ->
      t = __typeof__ o
      if t is "array" or o instanceof Array
        o.slice()
      else if t is "object" or o instanceof Object
        for k in (keys o) then o[k]
    ]


    ## String functions
    ['str', ->
      args = for arg in arguments
        if typeof arg is "string"
          arg
        else if arg.toString?
          arg.toString()
        else
          "#{arg}"
      args.join ''
    ]

    ['uppercase', (s) -> s.toUpperCase()]
    ['lowercase', (s) -> s.toLowerCase()]

    ['replace', (s, re, rplc) -> s.replace re, rplc]
    ['match', (s, re) -> s.match re]


    ## Regex functions
    ['re-test', (re, s) -> re.test s]
  ]



