(function() {
  var TailCall, recurse, tcloop;
  var __slice = Array.prototype.slice;
  TailCall = (function() {
    function TailCall(fn, args) {
      this.fn = fn;
      this.args = args;
    }
    return TailCall;
  })();
  tcloop = function(fn, tc) {
    var ret;
    fn.toc_sync = true;
    while (tc instanceof TailCall) {
      tc = tc.fn.apply(tc, tc.args);
    }
    fn.toc_sync = false;
    return ret = tc;
  };
  recurse = function() {
    var args, fn, tc;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    tc = new TailCall(fn, args);
    if (!fn.toc_sync) {
      return tcloop(fn, tc);
    } else {
      return tc;
    }
  };
  try {
    module.exports = recurse;
  } catch (e) {
    this.recurse = recurse;
  }
}).call(this);
