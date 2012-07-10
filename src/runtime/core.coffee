
define = (o) ->
  sym_js_eval = new C.Symbol "js-eval"
  sym_do = new C.Symbol "do"
  sym_def = new C.Symbol "def"
  defs = for own name, val of o
    sym = new C.Symbol name
    o_val = new C.List [sym_js_eval, new C.String "#{val}"]
    new C.List [sym_def, sym, o_val]

  result = new C.List [sym_do, defs...]

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

compile_runtime = ->
  define


    ## Math
    '+': (math_op '+', true)

    '-': math_op '-'

    '*': math_op '*'

    '/': math_op '/'

    mod: (a, b) -> a % b

    '**': "Math.pow"


    ## Comparisons
    '=': compare_op '==='

    'not=': compare_op '!=='

    '<': compare_op '<'

    '>': compare_op '>'

    '<=': compare_op '<='

    '>=': compare_op '>='


    ## Binary operations
    or: binary_op '||'

    and: (binary_op '&&', true)


    ## Array functions
    first: (a) -> a[0]

    second: (a) -> a[1]

    last: (a) -> a[a.length - 1]

    nth: (a, n) ->
      if n < 0
        n += a.length
      else if n is 0
        console.warn "nth treats collections as 1-based instead of 0 based. Don't try to access the 0th element."
        return null
      else
        n -= 1

      a[n]
