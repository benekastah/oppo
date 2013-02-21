
(defmacro set! (nm val)
  (quasiquote (<=> (unquote nm) (unquote val))))

(defmacro var ((splat names))
  (quasiquote (@var (<,> (unquote-splicing names)))))

(defmacro get-nth (ls n)
  (quasiquote (@ (unquote ls) @[ (unquote n) @])))

(defmacro get-head (ls)
  (quasiquote (get-nth (unquote ls) 0)))

(defmacro get-tail (ls)
  (quasiquote ((<.> (unquote ls) @slice) 1)))

(defmacro get-length (ls)
  (quasiquote (<.> (unquote ls) @length)))

(defmacro if (test y n)
  (quasiquote
	(@ (unquote test) @? (unquote y) @: (unquote n))))

(defmacro do ((splat exprs))
  @((<,> (unquote-splicing exprs))))

(defmacro object-key-value-pairs (kvps)
  (var kvp -kvps k v)
  (if (get-length kvps)
	(do
		(set! kvp (get-head kvps))
		(set! -kvps (get-tail kvps))
	  
		(set! k (get-head kvp))
		(set! v (get-nth kvp 1))

		(quasiquote (<,> (<:> k v) (unquote (object-key-value-pairs -kvps)))))))

(defmacro object ((splat kvps))
  (quasiquote (@{ (unquote (object-key-value-pairs kvps)) })))

