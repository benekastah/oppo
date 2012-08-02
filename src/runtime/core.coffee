
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

equality_op = (_not = false) ->
  """
  function () {
    var a, b;
    var i = 0;
    var len = arguments.length;
    for (; i < len; i++) {
      b = arguments[i]
      if (typeof a === "undefined") {
        a = b;
        continue;
      }

      if (!__equal__(a, b))
        return #{_not};

      a = b;
    }
    return #{!_not};
  }
  """


compile_runtime = ->

  define [
    ['__oppo_runtime_defined__', true]
    ['identity', (x) -> x]

    ## Math
    ['+', (math_op '+', true)]
    ['-', math_op '-']
    ['*', math_op '*']
    ['/', math_op '/']
    ['mod', (a, b) -> a % b]
    ['pow', "Math.pow"]
    ['min', 'Math.min']
    ['max', 'Math.max']
    ['incr', (x) -> ++x]
    ['decr', (x) -> --x]


    ## Comparisons
    ['<', compare_op '<']
    ['>', compare_op '>']
    ['<=', compare_op '<=']
    ['>=', compare_op '>=']

    # Borrowed heavily from lodash
    ['__hasDontEnumBug__', "!propertyIsEnumerable.call({ 'valueOf': 0 }, 'valueOf')"]
    ['__explicitEnum__', "__hasDontEnumBug__ ? [
        'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
        'toLocaleString', 'toString', 'valueOf'
      ] : null"]
    ['__hasOwnProperty__', 'Object.prototype.hasOwnProperty']
    ['__equal__', `function (a, b, stack) {
        stack || (stack = []);

        // exit early for identical values
        if (a === b) {
          // treat '+0' vs. '-0' as not equal
          return a !== 0 || (1 / a == 1 / b);
        }
        // a strict comparison is necessary because 'undefined == null'
        if (a == null || b == null) {
          return a === b;
        }
        // compare [[Class]] names
        var className = __typeof__(a);
        if (className != __typeof__(b)) {
          return false;
        }
        switch (className) {
          // strings, numbers, dates, and booleans are compared by value
          case "string":
            // primitives and their corresponding object instances are equivalent;
            // thus, '5' is quivalent to 'new String('5')'
            return a == String(b);

          case "number":
            // treat 'NaN' vs. 'NaN' as equal
            return a != +a
              ? b != +b
              // but treat '+0' vs. '-0' as not equal
              : (a == 0 ? (1 / a == 1 / b) : a == +b);

          case "boolean":
          case "date":
            // coerce dates and booleans to numeric values, dates to milliseconds and
            // booleans to 1 or 0; treat invalid dates coerced to 'NaN' as not equal
            return +a == +b;

          // regexps are compared by their source and flags
          case "regexp":
            return a.source == b.source &&
                   a.global == b.global &&
                   a.multiline == b.multiline &&
                   a.ignoreCase == b.ignoreCase;
        }
        if (typeof a != 'object' || typeof b != 'object') {
          return false;
        }
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation 'JO'.
        var length = stack.length;
        while (length--) {
          // Linear search. Performance is inversely proportional to the number of
          // unique nested structures.
          if (stack[length] == a) {
            return true;
          }
        }

        var index = -1,
            result = true,
            size = 0;

        // add the first collection to the stack of traversed objects
        stack.push(a);

        // recursively compare objects and arrays
        if (className == "array") {
          // compare array lengths to determine if a deep comparison is necessary
          size = a.length;
          result = size == b.length;

          if (result) {
            // deep compare the contents, ignoring non-numeric properties
            while (size--) {
              if (!(result = __equal__(a[size], b[size], stack))) {
                break;
              }
            }
          }
        }
        else {
          // objects with different constructors are not equivalent
          if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) {
            return false;
          }
          // deep compare objects.
          for (var prop in a) {
            if (__hasOwnProperty__.call(a, prop)) {
              // count the number of properties.
              size++;
              // deep compare each property value.
              if (!(result = __hasOwnProperty__.call(b, prop) && __equal__(a[prop], b[prop], stack))) {
                break;
              }
            }
          }
          // ensure both objects have the same number of properties
          if (result) {
            for (prop in b) {
              // Adobe's JS engine, embedded in applications like InDesign, has a
              // bug that causes '!size--' to throw an error so it must be wrapped
              // in parentheses.
              // https://github.com/documentcloud/underscore/issues/355
              if (__hasOwnProperty__.call(b, prop) && !(size--)) {
                break;
              }
            }
            result = !size;
          }
          // handle JScript [[DontEnum]] bug
          if (result && __hasDontEnumBug__) {
            while (++index < 7) {
              prop = __explicitEnum__[index];
              if (__hasOwnProperty__.call(a, prop)) {
                if (!(result = __hasOwnProperty__.call(b, prop) && __equal__(a[prop], b[prop], stack))) {
                  break;
                }
              }
            }
          }
        }
        // remove the first collection from the stack of traversed objects
        stack.pop();
        return result;
      }`
    ]
    ['=', equality_op()]
    ['not=', equality_op(true)]


    ## Binary operations
    ['or', binary_op '||']
    ['and', (binary_op '&&', true)]


    ## Misc
    ['__oppo_eval__', 'oppo.eval']
    ['__typeof__', 'lemur.core.to_type']
    ['typeof', '__typeof__']
    ['puts', 'console.log.bind(console)']


    ## Array functions
    ['__slice__', 'Array.prototype.slice']
    ['list', -> __slice__.call arguments]
    ['first', (a) -> a[0]]
    ['second', (a) -> a[1]]
    ['last', (a) -> a[a.length - 1]]

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

    ['rest', (a) -> a[1..]]
    ['init', (a) -> a[0...(a.length - 1)]]

    ['concat', `function (x) {
      var args = __slice__.call(arguments, 1);
      return x.concat.apply(x, args);
    }`]

    ['sort', (f, a) ->
      new_a = a.slice()
      if f? then new_a.sort f
      else new_a.sort()
    ]

    ## Collections
    ['map', (f, o) ->
      t = __typeof__ o
      if t is "array" or o instanceof Array
        (f x) for x in o
      else if t is "object" or o instanceof Object
        result = {}
        for k, v of o
          if not o.hasOwnProperty k then continue
          result[k] = f [k, v]
        result
    ]

    ['reduce', (f, o) ->
      t = __typeof__ o
      if t is "array" or o instanceof Array
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
      if t is "array" or o instanceof Array
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
      if t is "array" or o instanceof Array
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

    ['clone', """
      Object.create ? function (o) {
        return Object.create(o)
      } : function (o) {
        function Noop() {}
        Noop.prototype = o;
        return new Noop();
      }
      """
    ]

    ['keys', "Object.keys || " + (o) ->
      for k of o
        continue if not o.hasOwnProperty k
        k
    ]

    ['values', (o) ->
      t = __typeof__ o
      if t is "array" or o instanceof Array
        o.slice()
      else if t is "object" or o instanceof Object
        for k in (keys o) then o[k]
    ]

    ['merge', ->
      first = arguments[0]
      t = __typeof__ first
      if t is "array"
        base = []
      else if t is "object"
        base = {}

      for o in arguments
        for k, v of o
          continue unless o.hasOwnProperty k
          base[k] = v
      base
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



