(function() {
  var _;

  _ = require("underscore");

  $.domReady(function() {
    var $js, $oppo, $result, cache, compile, compile_and_compute_result, compute_result, oppo_code_cache_key, timeout;
    $oppo = $('#oppo');
    $js = $('#js');
    $result = $('#result');
    cache = $.cache("try-oppo");
    oppo_code_cache_key = "oppo-code";
    compute_result = function() {
      var evald, js, result;
      js = $js.val();
      try {
        evald = eval(js);
        result = oppo.stringify_html(evald);
      } catch (e) {
        result = e;
      }
      if (typeof result === 'undefined') {
        result = 'undefined';
      } else {
        result = "" + result;
      }
      return $result.html(result);
    };
    compile = function() {
      var ast, code, js, oppo_code;
      code = oppo_code = $oppo.val();
      cache.set(oppo_code_cache_key, code);
      try {
        ast = oppo.read(code);
        js = oppo.compile(ast);
      } catch (e) {
        js = "/* " + e + " */";
      }
      return $js.val(js);
    };
    compile_and_compute_result = _.compose(compute_result, compile);
    timeout = null;
    $oppo.keyup(function() {
      clearTimeout(timeout);
      return timeout = setTimeout(compile_and_compute_result, 500);
    });
    return $oppo.val(cache.get(oppo_code_cache_key || '')).keyup();
  });

}).call(this);
