(function () {
  var oppoString, code, result;
  oppoString = ';; Misc macros and functions\n' +
'(defmacro eval (sexp)\n' +
'  `((. oppo eval) ~sexp))\n' +
'\n' +
'(defmacro print (...things)\n' +
'  `((. console log) ...things))\n' +
'  \n' +
'(defmacro defn (nm argslist ...body)\n' +
'  `(def ~nm (lambda ~argslist ...body)))\n' +
'  \n' +
'(defmacro or (...items)\n' +
'  (let (s ((. items join) " || "))\n' +
'    `(js-eval ~s)))\n' +
'\n' +
';(defmacro apply)\n' +
'\n' +
'(defn typeof (x)\n' +
'  (let (cls ((. Object prototype toString call) x)\n' +
'        type-arr ((. cls match) #/\s([a-zA-Z]+)/)\n' +
'        type ((. - first) type-arr))\n' +
'    ((. type toLowerCase))))\n' +
'\n' +
';(defmacro .. (...items)\n' +
';  (if (= 2 (size items))\n' +
';    ))\n' +
'\n' +
';; Collections\n' +
'(defmacro concat (base ...items)\n' +
'  `((. ~base concat) ...items))\n' +
'\n' +
';; Lists\n' +
'\n' +
';; Strings\n' +
'; (defmacro str (...items)\n' +
';   (let (new-items (concat ["\""] items "\"")\n' +
';         s ((. new-items join) "\" + \""))\n' +
';     `(js-eval ~((. s replace) " + \"\"" ""))))\n' +
'\n' +
';; Arithmetic\n' +
';(defmacro + (...nums)\n' +
';  )\n' +
'\n' +
'\n' +
'\n' +
';; Set up underscore\n' +
'(let (collections [:each :map :reduce :reduceRight :find :filter :reject :all :any :include :invoke :pluck :max :min :sortBy :groupBy :sortedIndex :shuffle :toArray :size]\n' +
'      arrays [:first :initial :last :rest :compact :flatten :without :union :intersection :difference :uniq :zip :indexOf :lastIndexOf :range]\n' +
'      functions [:bind :bindAll :memoize :delay :defer :throttle :debounce :once :after :wrap :compose]\n' +
'      objects [:keys :values :functions :extend :defaults :clone :tap :isEqual :isEmpty :isElement :isArray :isArguments :isFunction :isString :isNumber :isBoolean :isDate :isRegExp :isNaN :isNull :isUndefined]\n' +
'      utility [:noConflict :identity :times :mixin :uniqueId :escape :template]\n' +
'      chaining [:chain :value])\n' +
'  \n' +
'  ;(defn dasherize (s)\n' +
'  ;  ((. s replace) #//))\n' +
'  \n' +
'  ;; Add all the underscore methods here\n' +
'  )\n';
  code = oppo.read(oppoString);
  result = oppo.compile(code);
  return eval(result);
})();