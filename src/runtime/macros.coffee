
# oppo.compile oppo.read """
# 
# (defmacro defn (nm argslist ...body)
#   `(def ~nm (lambda ~argslist ...body)))
# 
# (defmacro log (...things)
#   `((. console 'log) ...things))
# 
# ;; Strings
# (defmacro replace (base ...items)
#   `((. ~base 'replace) ...items))
# 
# (defmacro remove (base pattern)
#   `(replace base pattern ""))
# 
# (defmacro match (base pattern)
#   `((. ~base 'match) pattern))
# 
# """