
$.domReady ->
  $oppo = $ '#oppo'
  $js = $ '#js'
  $result = $ '#result'
  cache = $.cache "try-oppo"
  oppo_code_cache_key = "oppo-code"
  
  compute_result = ->
    js = $js.val()
    try
      evald = eval js
      try
        result = JSON.stringify evald
        if typeof result isnt "string"
          throw ""
      catch e
        console.trace()
        result = evald
    catch e then result = e
    
    if typeof result is 'undefined'
      result = 'undefined'
    else
      result = "#{result}"
      
    $result.html result

  compile = ->
    code = oppo_code = $oppo.val()
    cache.set oppo_code_cache_key, code
    try
      ast = oppo.read code
      js = oppo.compile ast, true
    catch e
      console.trace()
      js = "/* #{e} */"
    $js.val js
  
  compile_and_compute_result = _.compose compute_result, compile
  
  timeout = null
  $oppo.keyup ->
    clearTimeout timeout
    timeout = setTimeout compile_and_compute_result, 500
    
  $oppo.val(cache.get oppo_code_cache_key or '').keyup()