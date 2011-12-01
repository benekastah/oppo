
oppo.module "test", ["oppo"], (oppo) ->

  # ast = oppo.read '''
  # (defn Y (le)
  #   (call
  #     (lambda (f) (f f))
  #     (lambda (f) (le
  #       (lambda (x) (call (f f) x))))))
  # 
  # (defn fact (n)
  #   (if ~(n <= 2)
  #     n
  #     ~(n * (fact ~(n - 1)))))
  #     
  # (def y-fact
  #   (Y (lambda (fact)
  #     (lambda (n)
  #       (if ~(n <= 2)
  #         n
  #         ~(n * (fact ~(n - 1))))))))
  #     
  # (fact 5)
  # (y-fact 5)
  # '''
  
  ast = oppo.read '''
  
  ;(defn fact (n)
  ;  (if ~(n <= 2)
  ;    n
  ;    ~(n * (fact ~(n - 1)))))

  ;(fact 5)
  
  (+ 1 1)

  '''

  console.log ast
  evald = oppo.eval ast
  console.log evald

oppo.module.require "test"