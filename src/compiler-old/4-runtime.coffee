DEF 'root', "typeof global !== 'undefined' ? global : window"
DEF '_', "{0}._ || (require && require('underscore'))", ["root"]

## Underscore fns
do ->
  underscore_fns =
    # Collections
    #each: null
    #map: null
    #reduce: ["reduce", "foldl"]
    #reduceRight: ["reduce-right", "foldr"]
    #find: null
    #filter: null
    #reject: null
    #all: null
    #any: null
    include: null
    invoke: null
    pluck: null
    #max: null
    #min: null
    #sortBy: ["sort-by"]
    #groupBy: ["group-by"]
    #sortedIndex: ["sorted-index"]
    shuffle: null
    toArray: ["->arr", "->array"]
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
    #uniq: null
    zip: null
    #indexOf: ["index-of"]
    #lastIndexOf: ["last-index-of"]
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
    #extend: null
    #defaults: null
    clone: null
    tap: null
    #isEqual: ["equal?", "="]
    isEmpty: ["empty?"]
    isElement: ["element?"]
    isArray: ["array?", "list?"]
    isArguments: ["arguments?"]
    isFunction: ["function?", "fn?"]
    isString: ["string?", "str?"]
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
    value = "{0}.#{fname}"
    for name in oppo_names
      DEF name, value, ["_"]
    


get_from_prototype = (obj, method) ->
  name = "__#{method}__"
  DEF name, "{0}.#{obj}.prototype.#{method}", ["root"]
  name

use_from_prototype = (obj, method, oppo_name = method) ->
  temp = get_from_prototype obj, method
  DEF oppo_name, """
  function (base) {
    var args;
    args = {0}.call(arguments, 1);
    return {1}.apply(base, args);
  }
  """, ["__slice__", temp]

get_many_from_prototype = (obj, methods) ->
  for method in methods
    get_from_prototype obj, method
    
use_many_from_prototype = (obj, methods) ->
  for args in methods
    if not _.isArray args
      args = [args]
    args.unshift obj
    use_from_prototype args...
    
use_properties = (obj, props) ->
  for prop in props
    if not _.isArray prop
      prop = [prop]
      
    [js_name, oppo_name] = prop
    oppo_name ?= js_name
    
    _obj = if obj? then ".#{obj}" else ""
    DEF oppo_name, "{0}#{_obj}.#{js_name}", ["root"]
    
use_root_properties = (props) ->
  use_properties null, props


## Math functions
make_math_fn = (symbol, js_symbol = symbol) ->
  DEF symbol, """
  function () {
    var i, num, len, current;
    num = arguments[0];
    for (i = 1, len = arguments.length; i < len; i++) {
      current = arguments[i];
      num #{js_symbol}= current;
    }
    return num;
  }
  """

make_math_fn '+'
make_math_fn '*'
make_math_fn '-'
make_math_fn '/'
make_math_fn '%'

use_properties "Math", [
  "E", "LN2", "LN10", "LOG2E", "LOG10E", "PI", ["SQRT1_2", "sqrt1/2"], "SQRT2"
  "abs", "acos", "asin", "atan", "atan2", "ceil", "cos", "exp", "floor", "log", "max"
  "min", ["pow", "**"], "pow", "round", "sin", "sqrt", "tan"
]

DEF "random", """
function (_1, _2) {
  var r, min, max;
  r = Math.random;
  switch (arguments.length) {
    case 0: return r();
    case 1:
      max = _1;
      return {0}(r() * max);
    case 2:
      min = _1;
      max = _2;
      return {0}(r() * (max - min)) + min;
  }
}
""", ["floor"]

DEF "rand", "{0}", ["random"]

use_root_properties [
  ["isFinite", "finite?"], "Infinity", "NaN", ["parseFloat", "->float"]
]

DEF "->int", "function (s, r) { return parseInt(s, r == null ? 10 : r); }"
DEF "-infinity", "-{0}", ["infinity"]

DEF "->base", """
function (n, base) {
  return (+n).toString(base);
}
"""

## Comparison functions
make_comparison_fn = (symbol, compare_fn, deps) ->
  if _.isString compare_fn
    js_symbol = compare_fn
    compare_fn = null
  else
    js_symbol = symbol
  
  compare_fn ?= (a, b) -> "#{a} #{js_symbol} #{b}"
    
  DEF symbol, """
  function () {
    var i, item, last, len, result;
    last = arguments[0];
    for (i = 1, len = arguments.length; i < len; i++) {
      item = arguments[i];
      result = #{compare_fn("last", "item")};
      if (!result) break;
    }
    return result;
  }
  """, deps
  
make_comparison_fn "<"
make_comparison_fn ">"
make_comparison_fn "<="
make_comparison_fn ">="
make_comparison_fn "=="
make_comparison_fn "==="
make_comparison_fn "not==", "!="
make_comparison_fn "not===", "!=="
make_comparison_fn "=", ((a, b) -> "{0}.isEqual(#{a}, #{b})"), ["_"]
DEF "equal?", "{0}", ["="]
DEF "not=", "function () { return !{0}(); }", ["="]


## Conversion functions
DEF '->bool', compile [
  (to_symbol 'lambda')
  [(to_symbol 'x')]
  [(to_symbol 'if'), (to_symbol 'x'), [(to_symbol 'js-eval'), 'true'], [(to_symbol 'js-eval'), 'false']]
]

DEF '->boolean', "{0}", ["->bool"]

DEF 'not', "function (x) { return !{0}(x); }", ["->bool"]

DEF '->str', """
function (x) {
  return x.toString ? x.toString : '' + x;
}
"""

DEF '->string', "{0}", ["->str"]

DEF '->num', "function (x) { return +x; }"

DEF '->number', "{0}", ["->num"]

DEF '->js-map', "function (x) { return Object(x); }"


## Binary functions
DEF 'and', """
function () {
  var i, len, item;
  i = 0;
  len = arguments.length;
  for (; i < len; i++) {
    item = arguments[i];
    if (!{0}(item))
      break;
  }
  return item;
}
""", ["->bool"]

DEF 'or', """
function () {
  var i, len, item;
  i = 0;
  len = arguments.length;
  for (; i < len; i++) {
    item = arguments[i];
    if ({0}(item))
      break;
  }
  return item;
}
""", ["->bool"]


## Array/String functions
slice = get_from_prototype "Array", "slice"
sort = get_from_prototype "Array", "sort"
join = get_from_prototype "Array", "join"

do ->
  DEF "__iterator_builder_1__", """
  function (method_name) {
    var method = {0}[method_name];
    return function (a, fn, context) {
      var args = {1}(arguments);
      if (fn) {
        args[1] = {2}(a) ? function (v, k, o) {
          return fn(v, k + 1, o);
        } : fn;
      }
      return method.apply({0}, args);
    };
  }
  """, ["_", "->array", "array?"]
  
  build = (name, js_name = name) ->
    DEF name, "{0}('#{js_name}')", ["__iterator_builder_1__"]

  build "each"
  build "map"
  build "find"
  build "filter"
  build "reject"
  build "all"
  build "any"
  build "group-by", "groupBy"

do ->
  DEF "__iterator_builder_2__", """
  function (method_name) {
    var method = {2}[method_name];
    return function (a, fn, memo, context) {
      var args = {0}(arguments);
      if (fn) {
        args[1] = {1}(a) ? function (main, v, k, o) {
          return fn(main, v, k + 1, o)
        } : fn;
      }
      return method.apply({2}, args);
    };
  }
  """, ["->array", "array?", "_"]
  
  build = (name, js_name = name) ->
    DEF name, "{0}('#{js_name}')", ["__iterator_builder_2__"]
    
  build "reduce"
  DEF "foldl", "{0}", ["reduce"]
  
  build "reduce-right", "reduceRight"
  DEF "foldr", "{0}", ["reduce-right"]
  
DEF "slice", """
function (a) {
  var args;
  args = {0}.call(arguments, 1);
  return a.slice.apply(a, args);
}
""", [slice]
  
DEF "sorted-index", """
function (a) {
  return {0}.sortedIndex.apply({0}, arguments) + 1;
}
""", ["_"]

DEF "join", """
function (a, sep) {
  return {0}.call(a, sep != null ? sep : '');
}
""", [join]

DEF "uniq", """
function (a, sorted, fn) {
  var args = {0}(arguments);
  if (fn) {
    args[2] = fn && function (v, k, o) {
      return fn(v, k + 1, o);
    };
  }
  return {1}.uniq.apply({1}, args);
}
""", ["->array", "_"]

DEF "unique", "{0}", ["uniq"]

DEF "concat", """
function (base) {
  var args;
  args = {0}.call(arguments, 1);
  return base.concat.apply(base, args);
}
""", [slice]

DEF "nth", """
function (a, i) {
  i = +i;
  if (i === 0)
    console.warn("Trying to get 0th item with nth; nth treats lists as 1-based");
    
  if (i < 0)
    i = (a || []).length + i;
  else
    i -= 1;
    
  return {0}(a) ? a[i] : {1}(a) ? a.charAt(i) : (function () { throw "Can't get nth item: collection must be a list or a string"; })();
}
""", ["array?", "string?"]

DEF "index-of", """
function (a, x, sorted) {
  return ({0}(a) ? a.indexOf(x) : {1}.indexOf(a, x, sorted)) + 1;
}
""", ["string?", "_"]

DEF "last-index-of", """
function (a, x) {
  return ({0}(a) ? a.lastIndexOf(x) : {1}.lastIndexOf(a, x)) + 1;
}
""", ["string?", "_"]

DEF "sort", """
function (a, fn, context) {
  var iterator, isArray;
  if ({0}(a)) {
    if (!fn) return a.slice().sort();
    iterator = function (v, k, o) {
      return fn(v, k + 1, o);
    };
  }
  else iterator = fn;
  return {1}.sortBy(a, iterator, context);
}
""", ["->array", "_"]

DEF "reverse", """
function (a) {
  var str, ret;
  str = {0}(a);
  ret = str ? a.split('') : a.slice();
  ret.reverse();
  return str ? ret.join('') : ret;
}
""", ["string?"]


## String only functions
to_lower = get_from_prototype "String", "toLowerCase"
to_upper = get_from_prototype "String", "toUpperCase"
split = get_from_prototype "String", "split"
trim = get_from_prototype "String", "trim"
rtrim = get_from_prototype "String", "trimRight"
ltrim = get_from_prototype "String", "trimLeft"

DEF "rtrim", """
function (s) {
  return {0} ? {0}.call(s) : s.replace(/\s+$/, '');
}
""", [rtrim]
DEF "trim-right", "{0}", ["rtrim"]

DEF "ltrim", """
function (s) {
  return {0} ? {0}.call(s) : s.replace(/^\s+/, '');
}
""", [ltrim]
DEF "trim-left", "{0}", ["ltrim"]

DEF "trim", """
function (s) {
  return {0} ? {0}.call(s) : {1}({2}(s));
}
""", [trim, "ltrim", "rtrim"]

DEF "->lower", "function (s) { return {0}.call(s); }", [to_lower]
DEF "->upper", "function (s) { return {0}.call(s); }", [to_upper]

use_many_from_prototype "String", [
  "split", "replace", ["search", "str-search"], "substr", "substring",
  ["charCodeAt", "char-code-at"], "match", ["toLocaleLowerCase", "->locale-lower"]
  ["toLocaleUpperCase", "->locale-upper"], ["localeCompare", "locale-compare"]
]


## Object functions
DEF "merge", """
function () {
  var args = {0}(arguments);
  args.unshift({});
  return {1}.extend.apply({1}, args);
}
""", ["->array", "_"]

DEF "careful-merge", """
function () {
  var args = {0}(arguments);
  args.unshift({});
  return {1}.defaults.apply({1}, args);
}
""", ["->array", "_"]

DEF "__create__", "Object.create"

DEF "extend", """
(function () {
  return {0} ? function (proto) { return {0}(proto != null ? proto : null); } :
  function (proto) {
    function noop() {}
    noop.prototype = proto != null ? proto : null;
    return new noop;
  };
})()
""", ["__create__"]

DEF "merge-extend", """
function (o, proto) {
  var ret;
  ret = {0}(proto);
  return {1}.extend(ret, o);
}
""", ["extend", "_"]


## Misc
use_many_from_prototype "RegExp", [
  ["exec", "re-exec"], ["test", "re-test"]
]

use_many_from_prototype "Number", [
  ["toExponential", "->exponential"], ["toFixed", "->fixed"], ["toLocaleString", "->locale-string"]
  ["toPrecision", "->precision"]
]

DEF "date", """
function (a, b, c, d, e, f, g) {
  var d, D;
  D = {0}.Date;
  switch (arguments.length) {
    case 0: d = new D(); break;
    case 1: d = new D(a); break;
    case 2: d = new D(a, b); break;
    case 3: d = new D(a, b, c); break;
    case 4: d = new D(a, b, c, d); break;
    case 5: d = new D(a, b, c, d, e); break;
    case 6: d = new D(a, b, c, d, e, f); break;
    case 7: d = new D(a, b, c, d, e, f, g); break;
  }
  return d;
}
""", ["root"]

DEF "now", """
(function () {
  var D;
  D = {0}.Date;
  return D.now ? D.now : function () { return +(new Date); }
})()
""", ["root"]

use_many_from_prototype "Date", [
  ["getDate", "get-date"], ["getDay", "get-day"], ["getFullYear", "get-year"], ["getHours", "get-hours"]
  ["getMilliseconds", "get-milliseconds"], ["getMinutes", "get-minutes"], ["getMonth", "get-month"]
  ["getSeconds", "get-seconds"], ["getTime", "get-time"], ["getTimezoneOffset", "get-timezone-offset"]
  ["getUTCDate", "get-utc-date"], ["getUTCDay", "get-utc-day"], ["getUTCFullYear", "get-utc-full-year"]
  ["getUTCHours", "get-utc-hours"], ["getUTCMilliseconds", "get-utc-milliseconds"], ["getUTCMinutes", "get-utc-minutes"]
  ["getUTCMonth", "get-utc-month"], ["getUTCSeconds", "get-utc-seconds"], ["setDate", "set-date!"]
  ["setFullYear", "set-year!"], ["setHours", "set-hours!"], ["setMilliseconds", "set-milliseconds!"]
  ["setMinutes", "set-minutes!"], ["setMonth", "set-month!"], ["setSeconds", "set-seconds!"], ["setTime", "set-time!"]
  ["setUTCDate", "set-utc-date!"], ["setUTCFullYear", "set-utc-year!"], ["setUTCHours", "set-utc-hours!"]
  ["setUTCMilliseconds", "set-utc-milliseconds!"], ["setUTCMinutes", "set-utc-minutes!"], ["setUTCMonth", "set-utc-month!"]
  ["setUTCSeconds", "set-utc-seconds!"], ["toDateString", "->date-string"], ["toISOString", "->iso-string"]
  ["toJSON", "->json"], ["toLocaleDateString", "->locale-date-string"], ["toLocaleTimeString", "->locale-time-string"]
  ["toTimeString", "->time-string"], ["toUTCString", "->utc-string"]
]

DEF "json-stringify", "{0}.JSON.stringify", ["root"]
DEF "json-parse", "{0}.JSON.parse", ["root"]