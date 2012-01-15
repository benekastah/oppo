(function () {
  var oppoString, code, result;
  oppoString = ';; Misc macros and functions\n' +
'(defmacro eval (sexp)\n' +
'  `((. oppo \'eval) ~sexp))\n' +
'  \n' +
'(defmacro read (s)\n' +
'  `((. oppo \'read) ~s))\n' +
'\n' +
'(defmacro print (...things)\n' +
'  `((. console \'log) ...things))\n' +
'  \n' +
'(defmacro defn (nm argslist ...body)\n' +
'  `(def ~nm (lambda ~argslist ...body)))\n' +
'  \n' +
'(defmacro apply (fn ...args)\n' +
'  (let (args-list ((. window :Array \'prototype \'concat \'apply) [] args))\n' +
'    `(~fn ...args-list)))\n' +
'  \n' +
';; Type conversion\n' +
'(defn (. window \'->bool) (x)\n' +
'  (js-eval "!(x == null || x === false || x === \\"\\" || x !== x)"))\n' +
'  \n' +
'(defn (. window \'->num) (n)\n' +
'  ((. window :Number) n))\n' +
'  \n' +
'(defn (. window \'->str) (s)\n' +
'  (str s))\n' +
'\n' +
';; Binary functions\n' +
'(defn (. window \'not) (x)\n' +
'  (let (bx (->bool x))\n' +
'    (js-eval "!bx")))\n' +
'\n' +
'(let (binary-each\n' +
'        (lambda (type ls)\n' +
'          (let (item (nth ls 1))\n' +
'            (if (|| (&& (=== type :or) (->bool item))\n' +
'                    (&& (=== type :and) (not item))\n' +
'                    (=== (. ls \'length) 0))\n' +
'              item\n' +
'              (binary-each type ((. ls \'slice) 1))))))\n' +
'                \n' +
'  (defn (. window \'or) (...items)\n' +
'    (binary-each :or items))\n' +
'    \n' +
'  (defn (. window \'and) (...items)\n' +
'    (binary-each :and items)))\n' +
'\n' +
';(defmacro apply)\n' +
'\n' +
'(def global (|| global window))\n' +
'\n' +
'(defmacro defg )\n' +
'\n' +
'(defn (. window \'js-type) (x)\n' +
'  (let (cls ((. Object :prototype :toString :call) x)\n' +
'        type-arr ((. cls \'match) #/\\s([a-zA-Z]+)/)\n' +
'        type (. type-arr 1))\n' +
'    ((. type \'toLowerCase))))\n' +
'\n' +
';(defmacro .. (...items)\n' +
';  (if (= 2 (size items))\n' +
';    ))\n' +
'\n' +
';; Collections    \n' +
'(defn (. window \'nth) (a n)\n' +
'  (if (=== n 0)\n' +
'    (throw "nth treats collections as one-based; cannot get zeroth item"))\n' +
'  (let (i (if (< n 0)\n' +
'            (+ (. a \'length) n)\n' +
'            (- n 1)))\n' +
'    (. a i)))\n' +
'  \n' +
'(defn (. window \'first) (a) (nth a 1))\n' +
'  \n' +
'(defn (. window \'second) (a) (nth a 2))\n' +
'  \n' +
'(defn (. window \'last) (a) (nth a -1))\n' +
'\n' +
'(defn (. window \'concat) (base ...items)\n' +
'  (apply (. base \'concat) ...items))\n' +
'  \n' +
'(defn (. window \'join) (a s)\n' +
'  ((. a \'join) s))\n' +
'  \n' +
'(defmacro slice ())\n' +
'\n' +
';; Lists\n' +
'\n' +
';; Strings\n' +
'(defmacro replace (base ...items)\n' +
'  `((. ~base \'replace) ...items))\n' +
'  \n' +
'(defmacro remove (base pattern)\n' +
'  `(replace base pattern ""))\n' +
'\n' +
'\n' +
';; Set up underscore\n' +
'(let (collections [ :each :map :reduce :reduceRight :find :filter :reject :all \n' +
'                    :any :include :invoke :pluck :max :min :sortBy :groupBy \n' +
'                    :sortedIndex :shuffle :toArray :size]\n' +
'      arrays [:first :initial :last :rest :compact :flatten :without :union \n' +
'              :intersection :difference :uniq :zip :indexOf :lastIndexOf :range]\n' +
'      functions [ :bind :bindAll :memoize :delay :defer :throttle :debounce \n' +
'                  :once :after :wrap :compose]\n' +
'      objects [ :keys :values :functions :extend :defaults :clone :tap :isEqual \n' +
'                :isEmpty :isElement :isArray :isArguments :isFunction :isString \n' +
'                :isNumber :isBoolean :isDate :isRegExp :isNaN :isNull :isUndefined]\n' +
'      utility [:noConflict :identity :times :mixin :uniqueId :escape :template]\n' +
'      chaining [:chain :value])\n' +
'  \n' +
'  (defmacro -get (m)\n' +
'    `(. - ~m))\n' +
'  \n' +
'  (def (. window \'=) (-get :isEqual))\n' +
'  \n' +
'  ;(defn dasherize (s)\n' +
'  ;  (. (replace s #/([a-z])([A-Z])/ "$1-$2") :toLowerCase))\n' +
'    \n' +
'  ;(defn symbolize (s)\n' +
'  ;  (if ()))\n' +
'  \n' +
'  ;; Add all the underscore methods here\n' +
'  )\n';
  code = oppo.read(oppoString);
  result = oppo.compile(code);
  return eval(result);
})();