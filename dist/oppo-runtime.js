(function () {
  var code, result;
  code = oppo.read(";; Macros\n" +
"\n" +
"(defmacro print (...things)\n" +
"  `((. console log) ...things))\n" +
"  \n" +
"(defmacro defn (nm argslist ...body)\n" +
"  `(def ~nm (lambda ~argslist ...body)))\n" +
"\n" +
";; Set up underscore\n" +
"(let (collections [:each :map :reduce :reduceRight :find :filter :reject :all :any :include :invoke :pluck :max :min :sortBy :groupBy :sortedIndex :shuffle :toArray :size]\n" +
"      arrays [:first :initial :last :rest :compact :flatten :without :union :intersection :difference :uniq :zip :indexOf :lastIndexOf :range]\n" +
"      functions [:bind :bindAll :memoize :delay :defer :throttle :debounce :once :after :wrap :compose]\n" +
"      objects [:keys :values :functions :extend :defaults :clone :tap :isEqual :isEmpty :isElement :isArray :isArguments :isFunction :isString :isNumber :isBoolean :isDate :isRegExp :isNaN :isNull :isUndefined]\n" +
"      utility [:noConflict :identity :times :mixin :uniqueId :escape :template]\n" +
"      chaining [:chain :value])\n" +
"  \n" +
"  ;(defn dasherize (s)\n" +
"  ;  ((. s replace)))\n" +
"  \n" +
"  ;; Add all the underscore methods here\n" +
"  )\n");
  result = oppo.compile(code);
  return eval(result);
})();