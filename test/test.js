var noop, __rangle_bool, not, root, _, _equals_, log, or, cond_16mkjui7u_4bm26fi, cond_16mkjui8c_790ebdb;
__rangle_bool = (function (x) {
  var cond_16mkjui79_54n8bjq;
return /* if */ ((cond_16mkjui79_54n8bjq = x) !== false && cond_16mkjui79_54n8bjq != null && cond_16mkjui79_54n8bjq === cond_16mkjui79_54n8bjq ?
  true :
  false)
/* end if */;
}),
not = function (x) { return !__rangle_bool(x); },
root = typeof global !== 'undefined' ? global : window,
_ = root._ || (require && require('underscore')),
_equals_ = function () {
  var i, item, last, len, result;
  last = arguments[0];
  for (i = 1, len = arguments.length; i < len; i++) {
    item = arguments[i];
    result = _.isEqual(last, item);
    if (!result) break;
  }
  return result;
},
log = root.Math.log,
or = function () {
  var i, len, item;
  i = 0;
  len = arguments.length;
  for (; i < len; i++) {
    item = arguments[i];
    if (__rangle_bool(item))
      break;
  }
  return item;
};
(noop = (function () {
  return { append : noop };
}),
null,
null,
/* if */ ((cond_16mkjui7u_4bm26fi = not(_equals_(1, 2))) !== false && cond_16mkjui7u_4bm26fi != null && cond_16mkjui7u_4bm26fi === cond_16mkjui7u_4bm26fi ?
  (global.console.log("Fail" + ": FAILED!"),
or(global.$, noop)("#test").append("Fail" + ": FAILED!")) :
  (global.console.log("Fail" + ": passed"),
or(global.$, noop)("#test").append("Fail" + ": passed")))
/* end if */,
/* if */ ((cond_16mkjui8c_790ebdb = not(_equals_("asdf", "asdf", "asdf"))) !== false && cond_16mkjui8c_790ebdb != null && cond_16mkjui8c_790ebdb === cond_16mkjui8c_790ebdb ?
  (global.console.log("Keywords" + ": FAILED!"),
or(global.$, noop)("#test").append("Keywords" + ": FAILED!")) :
  (global.console.log("Keywords" + ": passed"),
or(global.$, noop)("#test").append("Keywords" + ": passed")))
/* end if */);