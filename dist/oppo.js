(function() {
  var getAllValues, oppo;
  oppo = (function() {
    try {
      return exports;
    } catch (e) {
      this.oppo = {};
      this.oppo.mixins = {};
      return this.oppo;
    }
  }).call(this);
  try {
    oppo.runtime = require('./runtime');
  } catch (_e) {}
  try {
    oppo.parser = require('./parser');
  } catch (_e) {}
  /*
  This is the access point for a program to the runtime
  This will not only evaluate the code, but it will make
  sure to resolve all thunks before delivering a response
  */
  try {
    getAllValues = require('./eval_helpers').getAllValues;
  } catch (_e) {}
  oppo.eval = function(program) {
    var result;
    if (getAllValues == null) {
      getAllValues = oppo.eval_helpers.getAllValues;
    }
    if (typeof program === "string") {
      program = oppo.parser.parse(program);
    }
    result = oppo.runtime.eval(null, program);
    return result = getAllValues(result);
  };
}).call(this);
