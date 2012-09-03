
oppo_code = """

(def map (js::eval "function (fn, ls) {
  var ret = [];
  for (var i = 0, len = ls.length; i < len; i++) {
    var item = ls[i];
    ret.push(fn(item));
  }
  return ret;
}"))

(def (->string x) (String x))

(def (str ...strings)
  (.join (map ->string strings) ""))

(str 1 2 3 4 5)

"""

parse_tree = oppo.read oppo_code
compiled = oppo.compile parse_tree
result = eval compiled