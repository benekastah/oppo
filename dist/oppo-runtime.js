(function () {
  var oppoString, code, result;
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
'(defn identity (x) x)\n' +
'\n' +
';; Global definitions\n' +
'(def ->bool identity)\n' +
'\n' +
'(def global (if (undefined? global) window global))\n' +
'\n' +
'(defmacro gdef (nm value)\n' +
'  `(def (. global (quote ~nm)) ~value))\n' +
'  \n' +
'(if (. global \'global) () (gdef global global))\n' +
'(gdef identity identity)\n' +
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
'(let (underscore-methods \n' +
'          ;; collections\n' +
'        [ ;:each \n' +
'          :map :reduce :reduceRight :find :filter :reject :all \n' +
'                    :any :include :invoke :pluck :max :min :sortBy :groupBy \n' +
'                    :sortedIndex :shuffle :toArray :size\n' +
'          ;; arrays\n' +
'          :first :initial :last :rest :compact :flatten :without :union \n' +
'              :intersection :difference :uniq :zip :indexOf :lastIndexOf :range\n' +
'          ;; functions\n' +
'          :bind :bindAll :memoize :delay :defer :throttle :debounce \n' +
'                    :once :after :wrap :compose\n' +
'          ;; objects\n' +
'          :keys :values :functions :extend :defaults :clone :tap :isEqual \n' +
'                    :isEmpty :isElement :isArray :isArguments :isFunction :isString \n' +
'                    :isNumber :isBoolean :isDate :isRegExp :isNaN :isNull\n' +
'                    ;:isUndefined\n' +
'          ;; utility\n' +
'          :noConflict :identity :times :mixin :uniqueId :escape :template\n' +
'          ;; chaining\n' +
'          :chain :value])\n' +
'  \n' +
'  (defmacro -get (m)\n' +
'    `(. - ~m))\n' +
'  \n' +
'  (gdef = (-get :isEqual))\n' +
'  (gdef each (-get :each))\n' +
'  \n' +
'  (defn dasherize (s)\n' +
'    (replace s #/([a-z])([A-Z])/ "$1-$2"))\n' +
'    \n' +
'  (defmacro symbolize (s)\n' +
'    (let (dashed (dasherize s)\n' +
'          replaced-is (replace dashed #/^is\\-(.*)$/ "$1?")\n' +
'          replaced-to (if (not=== replaced-is dashed)\n' +
'                        (replace replaced-is #/^to\\-(.*)$/ "->$1")\n' +
'                        replaced-is))\n' +
'      `(symbol ~replaced-to)))\n' +
'      \n' +
'  (each underscore-methods\n' +
'    (lambda (nm)\n' +
'      (gdef (symbolize nm) (-get nm))))\n' +
'  \n' +
'  ;; Add all the underscore methods here\n' +
'  )\n';
  code = oppo.read(oppoString);
  result = oppo.compile(code);
  return eval(result);
})();