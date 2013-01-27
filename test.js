if (typeof oppo === "undefined") {
  try {
    require("oppo");
  } catch (e) {
    throw new Error("oppo object not available. Make sure you have oppo properly installed.");
  }
}

(function(__module__) {
  !function() {
    var m = oppo.Module.get("test", true);
    var new_context = oppo.helpers.clone(__module__);
    m.context = oppo.helpers.merge(new_context, m.context);
  }();
  (function(__module__) {
    !function() {
      var m = oppo.Module.get("fact", true);
      var new_context = oppo.helpers.clone(__module__);
      m.context = oppo.helpers.merge(new_context, m.context);
    }();
    __module__.rec_fact__ = function rec_fact(n, accum) {
      return n < 2 ? accum : __module__.rec_fact__(n - 1, accum * n);
    }, __module__.fact__ = function fact(n) {
      return __module__.rec_fact__(n, 1);
    };
    return __module__;
  })(oppo.modules["fact"] || (oppo.modules["fact"] = {})), __module__.f__ = oppo.modules["fact"].fact__(5), 
  console.log.apply(console, oppo.modules["core"].map__(oppo.modules["core"].__$rightangle_log_string__, oppo.modules["core"].list__("5! = ", __module__.f__)));
  return __module__;
})(oppo.modules["test"] || (oppo.modules["test"] = {}));