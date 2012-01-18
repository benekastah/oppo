(function () {
  var oppoString, code, result, oppo;
  
  if (typeof window === 'undefined')
    oppo = exports;
  else
    oppo = window.oppo;
  
  oppoString = ';; Misc macros and functions\n' +
'(defmacro eval (sexp)\n' +
'  `((. oppo \'eval) ~sexp))\n' +
'  \n' +
'(defmacro read (s)\n' +
'  `((. oppo \'read) ~s))\n' +
'\n' +
'(defmacro println (...things)\n' +
'  `((. console \'log) ...things))\n' +
'\n' +
'(defmacro defn (nm argslist ...body)\n' +
'  `(def ~nm (lambda ~argslist ...body)))\n' +
'\n' +
';; Global definitions\n' +
'(def ->bool (. - \'identity))\n' +
'\n' +
'(def global (if (undefined? global) window global))\n' +
'\n' +
'(defmacro gdef (nm value)\n' +
'  `(def (. global (quote ~nm)) ~value))\n' +
'  \n' +
'(if (. global \'global) () (gdef global global))\n' +
'  \n' +
'(defmacro gdefn (nm argslist ...body)\n' +
'  `(gdef ~nm (lambda ~argslist ...body)))\n' +
'\n' +
'(gdefn println (...things)\n' +
'  (apply (. console \'log) things))\n' +
'\n' +
';; Type conversion\n' +
'(gdefn ->bool (x)\n' +
'  (js-eval "!(x == null || x === false || x === \\"\\" || x !== x)"))\n' +
'\n' +
'(gdefn ->num (n)\n' +
'  ((. window :Number) n))\n' +
'\n' +
'(gdefn ->str (s)\n' +
'  (str s))\n' +
'\n' +
';; Binary functions\n' +
'(gdefn not (x)\n' +
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
'  (gdefn or (...items)\n' +
'    (binary-each :or items))\n' +
'    \n' +
'  (gdefn and (...items)\n' +
'    (binary-each :and items)))\n' +
'\n' +
'(gdefn js-type (x)\n' +
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
'(gdefn nth (a n)\n' +
'  (if (=== n 0)\n' +
'    (throw "nth treats collections as one-based; cannot get zeroth item"))\n' +
'  (let (i (if (< n 0)\n' +
'            (+ (. a \'length) n)\n' +
'            (- n 1)))\n' +
'    (. a i)))\n' +
'  \n' +
'(gdefn first (a) (nth a 1))\n' +
'  \n' +
'(gdefn second (a) (nth a 2))\n' +
'  \n' +
'(gdefn last (a) (nth a -1))\n' +
'\n' +
'(gdefn concat (base ...items)\n' +
'  (apply (. base \'concat) ...items))\n' +
'  \n' +
'(gdefn join (a s)\n' +
'  ((. a \'join) s))\n' +
'  \n' +
';(defmacro slice ())\n' +
'\n' +
';; Lists\n' +
'\n' +
';; Strings\n' +
'(defmacro replace (base ...items)\n' +
'  `((. ~base \'replace) ...items))\n' +
'  \n' +
'(defmacro remove (base pattern)\n' +
'  `(replace base pattern ""))\n' +
'  \n' +
'(defmacro match (base pattern)\n' +
'  `((. ~base \'match) pattern))\n' +
'\n' +
';; Regex\n' +
'(defmacro re-match ())\n' +
'\n' +
';; Math\n' +
'(gdefn + (...nums)\n' +
'  ())\n' +
'\n' +
';; Set up underscore\n' +
'; (let (_fn (fn (source-name target-names)\n' +
';             (let (targets (if (> (. target-names \'length) 0) target-names [source-name]))\n' +
';               ((. - \'each)  targets\n' +
';                             (fn (nm)\n' +
';                               (def (. global nm) (. - source-name))))))\n' +
';       _fns (fn (name-map)\n' +
';             (apply (. - \'each) name-map _fn)))\n' +
';   \n' +
';   (_fns { ;; Collections\n' +
';           :each []\n' +
';           :map []\n' +
';           :reduce [\'reduce \'foldl]\n' +
';           :reduceRight [\'reduce-right \'foldr]\n' +
';           :find []\n' +
';           :filter []\n' +
';           :reject []\n' +
';           :all []\n' +
';           :any []\n' +
';           :include []\n' +
';           :invoke []\n' +
';           :pluck []\n' +
';           ; :max []\n' +
';           ; :min []\n' +
';           :sortBy [\'sort-by]\n' +
';           :groupBy [\'group-by]\n' +
';           :sortedIndex [\'sorted-index]\n' +
';           :suffle []\n' +
';           :toArray [\'->array]\n' +
';           :size []\n' +
';           \n' +
';           ;; Arrays\n' +
';           :first [\'first \'head]\n' +
';           :initial [\'initial \'init]\n' +
';           :last []\n' +
';           :rest [\'rest \'tail]\n' +
';           :compact []\n' +
';           :flatten []\n' +
';           :without []\n' +
';           :union []\n' +
';           :intersection []\n' +
';           :difference []\n' +
';           :uniq []\n' +
';           :zip []\n' +
';           :indexOf [\'index-of]\n' +
';           :lastIndexOf [\'last-index-of]\n' +
';           :range []\n' +
';           \n' +
';           ;; Functions\n' +
';           :bind []\n' +
';           :bindAll [\'bind-all]\n' +
';           :memoize []\n' +
';           :delay []\n' +
';           :defer []\n' +
';           :throttle []\n' +
';           :debounce []\n' +
';           :once []\n' +
';           :after []\n' +
';           :wrap []\n' +
';           :compose []\n' +
';           \n' +
';           ;; Objects\n' +
';           :keys []\n' +
';           :values []\n' +
';           :functions []\n' +
';           :extend []\n' +
';           :defaults []\n' +
';           :clone []\n' +
';           :tap []\n' +
';           :isEqual [\'equal? \'=]\n' +
';           :isEmpty [\'empty?]\n' +
';           :isElement [\'element?]\n' +
';           :isArray [\'array?]\n' +
';           :isArguments [\'arguments?]\n' +
';           :isFunction [\'function?]\n' +
';           :isNumber [\'number?]\n' +
';           :isBoolean [\'boolean? \'bool?]\n' +
';           :isDate [\'date?]\n' +
';           :isRegExp [\'regex?]\n' +
';           :isNaN [\'nan?]\n' +
';           :isNull [\'nil?]\n' +
';           :isUndefined [\'undefined?]\n' +
';           \n' +
';           ;; Utility\n' +
';           ; :noConflict []\n' +
';           :identity []\n' +
';           :times []\n' +
';           :uniqueId [\'unique-id]\n' +
';           :escape []\n' +
';           :template []\n' +
';           \n' +
';           ;; Chaining\n' +
';           :chain []\n' +
';           :value []}))\n';
  code = oppo.read(oppoString);
  result = oppo.compile(code);
  return eval(result);
})();