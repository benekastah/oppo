var h = void 0, s = !0, t = null, z = !1;
function D(b) {
  return function() {
    return b
  }
}
(function() {
  function b(a, c) {
    function o() {
      this.constructor = a
    }
    for(var v in c) {
      w.call(c, v) && (a[v] = c[v])
    }
    o.prototype = c.prototype;
    a.prototype = new o;
    a.b = c.prototype
  }
  var a, f, e, d, p, n, k, q, j, x, y, w = {}.hasOwnProperty, A = [].slice;
  k = "undefined" !== typeof global && global !== t ? global : window;
  k.root = k;
  e = {};
  k.Cd = e;
  p = e.s = {};
  (function() {
    var a;
    a = Object.prototype.toString;
    return p.w = function(c) {
      c = a.call(c);
      c = c.substring(8, c.length - 1);
      return c.toLowerCase()
    }
  })();
  p.yc = (q = String.prototype.trim) != t ? q : function() {
    return("" + this).replace(/^\s+/, "").replace(/\s+$/, "")
  };
  (function() {
    var a, c;
    a = function() {
    };
    return p.ra = (c = Object.create) != t ? c : function(o) {
      a.prototype = o;
      return new a
    }
  })();
  (!("undefined" !== typeof exports && exports !== t) || !("undefined" !== typeof module && module !== t)) && "undefined" !== typeof provide && provide !== t && provide("lemur", e);
  if("node" === ("undefined" !== typeof process && process !== t ? process.title : h)) {
    require("coffee-script"), e = "undefined" !== typeof lemur && lemur !== t ? lemur : require("../core"), f = require("jison").Ha, d = function(a) {
      function c(a) {
        var c, b, d, i, g, m;
        b = a.g;
        c = a.ua;
        d = a.Qa;
        this.start = a.start;
        this.g = {rules:[]};
        this.Qa = {};
        this.ua = [];
        if(b != t) {
          g = 0;
          for(m = b.length;g < m;g++) {
            a = b[g], this.nc.apply(this, a)
          }
        }
        if(c != t) {
          a = 0;
          for(g = c.length;a < g;a++) {
            b = c[a], this.qc(b)
          }
        }
        if(d != t) {
          for(i in d) {
            w.call(d, i) && (c = d[i], this.kc.apply(this, [i].concat(A.call(c))))
          }
        }
        this.K = new f({Ra:this.g, ua:this.ua, wd:this.Qa, Ld:this.start})
      }
      b(c, a);
      c.prototype.D = {mc:/^(return|function)/, "function":/^function/, Bc:/^function\s*\([\w,]*\)\s*/, Jc:/^function\s*\(\)\s*\{\s*return\s*([\s\S]*);\s*\}/, Db:/\s+/g, wc:/[\^\$\*\+\?\.\(\)\|\{\}\[\]\\\/]/g, dc:/^\/\*.*\*\//, lc:/\<\<\w+\>\>/};
      c.prototype.nc = function(a, c) {
        var b, d;
        "regexp" === e.s.w(a) ? b = a.source : this.D.lc.test(a) || (b = a.replace(this.D.wc, "\\$&"));
        "string" !== e.s.w(c) && (c = "" + c);
        d = e.s.yc.call(c);
        this.D.dc.test(d) || (this.D.mc.test(d) ? this.D.Ed.test(d) && (d = d.replace(this.D.Bc, "")) : d = "return '" + d + "';");
        return this.g.rules.push([b, d])
      };
      c.prototype.kc = function() {
        var a, c, b, d, i, g;
        i = arguments[0];
        b = 2 <= arguments.length ? A.call(arguments, 1) : [];
        var m = this.Qa, r = i, C, l, e;
        e = [];
        C = 0;
        for(l = b.length;C < l;C++) {
          c = b[C], g = c[0], a = c[1], c = c[2], a != t ? (a = (d = this.D.Jc.exec(a)) ? d[1] : "(" + a + "())", a = "$$ = " + a + ";") : a = "$$ = $1;", i === this.start && (a += " return $$;"), e.push([g, a, c])
        }
        return m[r] = e
      };
      c.prototype.qc = function() {
        var a, c;
        c = 1 <= arguments.length ? A.call(arguments, 0) : [];
        1 === c.length && (c = c[0]);
        "string" === e.s.w(c) && (c = c.split(this.D.Db));
        2 === c.length && (a = c.pop().split(this.D.Db), c = c.concat(a));
        this.ua.push(c)
      };
      return c
    }(f), e.K = function(a) {
      return(new d(a)).K
    }, "undefined" !== typeof exports && exports !== t && ("undefined" !== typeof module && module !== t) && (module.ta = e.K)
  }
  e = lemur;
  a = e.Ba = function() {
    function b(c) {
      var o;
      c == t && (c = {});
      this.sc = c.sc;
      this.tb = c.tb;
      a.N = this;
      this.T = ((o = this.tb) != t ? o.T.slice() : h) || [];
      this.Ua()
    }
    b.prototype.Ua = function() {
      return this.va(new a.kb({vc:z}))
    };
    b.prototype.va = function(a) {
      this.T.push(a);
      return a
    };
    b.prototype.vb = function() {
      return this.T.pop()
    };
    b.prototype.ba = function() {
      return this.T[this.T.length - 1]
    };
    b.prototype.da = function(a) {
      var o, b, d, l;
      l = this.T.slice().reverse();
      b = 0;
      for(d = l.length;b < d;b++) {
        if(o = l[b], o.bb(a)) {
          return o
        }
      }
      return t
    };
    b.prototype.X = function(a) {
      var o;
      o = this.da(a);
      if(o != t) {
        return o.jc(a)
      }
    };
    b.prototype.zb = function(a, o) {
      var b;
      b = this.da(a);
      return b != t ? b.Wa(a, o) : a.Pa()
    };
    b.prototype.compile = function(a) {
      return a.call(this)
    };
    b.ba = function() {
      return this.N.ba()
    };
    b.va = function() {
      var a;
      return(a = this.N).va.apply(a, arguments)
    };
    b.vb = function() {
      return this.N.vb()
    };
    b.Ua = function() {
      var a;
      return(a = this.N).Ua.apply(a, arguments)
    };
    b.da = function() {
      var a;
      return(a = this.N).da.apply(a, arguments)
    };
    b.X = function() {
      var a;
      return(a = this.N).X.apply(a, arguments)
    };
    b.zb = function() {
      var a;
      return(a = this.N).zb.apply(a, arguments)
    };
    return b
  }();
  a.d = function() {
    function b(a, c) {
      var d;
      this.value = a;
      this.i = c instanceof b ? c.i : "number" === e.s.w(c) ? {g:{o:c}} : c;
      this.Sa = (d = this.i) != t ? d.g.o : h
    }
    var c;
    b.prototype.compile = function() {
      return this.value != t ? "" + this.value : "null"
    };
    b.prototype.a = function() {
      return this.compile.apply(this, arguments)
    };
    b.prototype.error = function(c) {
      var b, d, l;
      b = a.yd;
      l = d = "";
      b != t && (d += " in " + b);
      this.Sa != t && (d += " at line " + this.Sa);
      this.constructor.name != t && (l = "" + this.constructor.name);
      throw"" + l + "Error" + d + ": " + c;
    };
    b.prototype.F = function() {
      return new a.oa(this, this.i)
    };
    b.prototype.Fa = c = function() {
      return function(a) {
        this.constructor = a
      }
    }();
    b.prototype.ra = function() {
      var a, b, d, l, i;
      a = this.constructor;
      d = a.prototype;
      b = this.Fa.prototype;
      this.Fa.prototype = d;
      a = new c(a);
      this.Fa.prototype = b;
      for(l in this) {
        w.call(this, l) && (b = this[l], b = (i = b != t ? "function" === typeof b.ra ? b.ra() : h : h) != t ? i : b, a[l] = b)
      }
      return a
    };
    return b
  }();
  a.oa = function(d) {
    function c() {
      return c.b.constructor.apply(this, arguments)
    }
    b(c, d);
    c.prototype.compile = function() {
      var a;
      a = this.value.a();
      return this.disabled ? a : "return " + a
    };
    c.prototype.$ = function(c) {
      if(c == t) {
        return this
      }
      c instanceof a.oa && (c = c.value);
      this.value = c;
      return c.xc = this
    };
    c.prototype.F = function() {
      return this
    };
    return c
  }(a.d);
  a.la = function(a) {
    function c(a) {
      this.n = a;
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      var a, c, b, d, i;
      d = this.n;
      i = [];
      c = 0;
      for(b = d.length;c < b;c++) {
        a = d[c], i.push(a.a())
      }
      return"[" + i.join(", ") + "]"
    };
    return c
  }(a.d);
  a.Aa = function(a) {
    function c(a, b) {
      c.b.constructor.call(this, t, a || b)
    }
    b(c, a);
    return c
  }(a.d);
  a.W = function(a) {
    function c() {
      return c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = D("null");
    return c
  }(a.Aa);
  a.ud = function(a) {
    function c() {
      return c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = D("void(0)");
    return c
  }(a.Aa);
  a.eb = function(a) {
    function c() {
      return c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    return c
  }(a.Aa);
  a.pa = function(a) {
    function c() {
      return c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = D("true");
    return c
  }(a.eb);
  a.Ca = function(a) {
    function c() {
      return c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = D("false");
    return c
  }(a.eb);
  a.Ob = function(a) {
    function c() {
      return c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = D("this");
    return c
  }(a.d);
  a.Yc = function(d) {
    function c(b, d) {
      var B;
      b == t && (b = {});
      c.b.constructor.apply(this, arguments);
      b.hasOwnProperty("constructor") || (b.constructor = t);
      this.name = b.name;
      B = b.constructor;
      this.prototype = b.prototype;
      this.xa = b.xa;
      this.name == t && (this.name = new a.t("Anonymous_$" + id++ + "_"));
      this.ob = B != t ? B : new a.U({}, d);
      this.prototype == t && (this.prototype = new a.na([], d));
      this.xa == t && (this.xa = new a.na([], d));
      this.ob.name = this.name
    }
    b(c, d);
    c.prototype.compile = function() {
      var a, c;
      c = object_compile(this.name, this.xa);
      a = object_compile("" + this.name + ".prototype", this.prototype);
      return"" + this.name + " = (function () {\n  " + this.ob.a() + ";\n  " + c + ";\n  " + a + ";\n  return " + this.name + ";\n})()"
    };
    return c
  }(a.d);
  a.fb = function(a) {
    function c(a) {
      this.Ac = a;
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      var a, c, b, d, i;
      d = this.Ac;
      i = [];
      c = 0;
      for(b = d.length;c < b;c++) {
        a = d[c], i.push(a.compile())
      }
      return"" + i.join(";\n")
    };
    return c
  }(a.d);
  a.Fb = function(a) {
    function c(a) {
      this.n = a;
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      var a, c, b, d, i;
      d = this.n;
      i = [];
      c = 0;
      for(b = d.length;c < b;c++) {
        a = d[c], i.push(a.a())
      }
      return"(" + i.join(", ") + ")"
    };
    return c
  }(a.d);
  a.U = function(d) {
    function c(b, d) {
      this.name = b.name;
      this.f = b.f;
      this.body = b.body;
      this.qa = b.qa;
      this.name == t && (this.name = "");
      this.f == t && (this.f = []);
      this.body == t && (this.body = []);
      this.f instanceof a.U.cb || (this.f = new a.U.cb(this.f, d));
      c.b.constructor.apply(this, arguments);
      this.f instanceof a.la && (this.f = this.f.n)
    }
    b(c, d);
    c.prototype.compile = function() {
      var c, b, d, l, i, g, m, r, C, f, j, k, p, n, q, w, x, y, A;
      q = new a.kb;
      c = this.Lc();
      m = c.Fc;
      r = c.Gc;
      g = this.qa && m.value instanceof a.Da && m.value.P instanceof a.e && m.value.P.name === this.name.name;
      d = this.f.a();
      l = d[0];
      c = d[1];
      n = d[2];
      i = this.body;
      if(g) {
        g = a.h.B("continue");
        j = {};
        f = [];
        d = [];
        p = this.f.length - 1;
        A = this.f;
        k = x = 0;
        for(y = A.length;x < y;k = ++x) {
          b = A[k], n && k === p && (b = n), C = j[b.name] = a.h.B(b), f.push(new a.h.z({l:C, value:m.value.f[k]})), d.push(new a.h.z({l:b, value:C, fa:z}))
        }
        C = new a.h.z({l:g, value:new a.pa});
        n = new a.h.z({l:g, value:new a.Ca});
        d = new a.fb(f.concat(d, C));
        i.unshift(n);
        m.Kd = s;
        r.$(d);
        d.xc.disabled = s;
        d = a.h.B("result");
        r = a.h.B("fn");
        m = new a.h.z({l:r, value:new a.U({body:i})});
        r = new a.h.z({l:d, value:new a.Da({P:r, scope:new a.Ob})});
        g = new a.Ea({m:new a.Lb(g), G:new a.oa(d)});
        g = new a.Tb({m:new a.pa, body:[r, g]});
        i = [m, g]
      }
      r = "string" === e.s.w(this.name) ? this.name : this.name.a();
      g = function() {
        var a, g, c;
        c = [];
        a = 0;
        for(g = l.length;a < g;a++) {
          b = l[a], c.push(b.a())
        }
        return c
      }();
      m = function() {
        var a, g, c;
        c = [];
        k = a = 0;
        for(g = i.length;a < g;k = ++a) {
          w = i[k], c.push(w.a())
        }
        return c
      }();
      m = "" + m.join(";\n  ") + ";";
      m = c != t ? "" + c.a() + ";\n  " + m : m;
      q = q.Cb();
      return"function " + r + "(" + g.join(", ") + ") {\n  " + q + m + ";\n}"
    };
    c.prototype.Lc = function() {
      var a;
      this.qa && (a = this.body.pop(), a = a.F(), this.body.push(a), a = {Fc:a.$(), Gc:a});
      return a || {}
    };
    return c
  }(a.d);
  a.U.cb = function(d) {
    function c(a) {
      this.f = a;
      c.b.constructor.apply(this, arguments)
    }
    b(c, d);
    c.prototype.compile = function() {
      var c, b, d, e, i;
      b = ("function" === typeof(e = this.f).slice ? e.slice() : h) || ((i = this.f.n) != t ? i.slice() : h);
      if(b.length && (d = b.pop(), d instanceof a.Ia ? d = d.Ya : (b.push(d), d = t), d != t)) {
        d = new a.h(d, d.i), c = d.a(), c = new a.I("" + c + " = Array.prototype.slice.call(arguments, " + b.length + ")")
      }
      return[b, c, d]
    };
    return c
  }(a.d);
  a.Da = function(d) {
    function c(c, b) {
      this.P = c.P;
      this.f = c.f;
      this.scope = c.scope;
      this.apply = c.apply;
      this.call = !!this.scope;
      this.scope == t && (this.scope = new a.W(t, b));
      this.f || (this.f = [])
    }
    b(c, d);
    c.prototype.compile = function() {
      var c, b, d;
      d = this.P.a();
      this.P instanceof a.e || (d = "(" + d + ")");
      b = this.apply || this.call ? [this.scope].concat(this.f) : this.f;
      var e, i, g;
      g = [];
      e = 0;
      for(i = b.length;e < i;e++) {
        c = b[e], g.push(c.a())
      }
      return"" + d + (this.apply ? ".apply" : this.call ? ".call" : "") + "(" + g.join(", ") + ")"
    };
    return c
  }(a.d);
  a.Ea = function(a) {
    function c(a) {
      this.m = a.m;
      this.G = a.G;
      this.q = a.q;
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      var a, c;
      a = this.m.compile();
      c = this.G.compile();
      c = "if (" + a + ") {\n  " + c + "\n}";
      this.q && (a = this.q.compile(), c = "" + c + " else {\n  " + a + "\n}");
      return c
    };
    c.prototype.F = function() {
      this.G = this.G.F();
      this.q && (this.q = this.q.F());
      return this
    };
    c.prototype.$ = function() {
      var a, c;
      return this.q != t ? (a = this.q).$.apply(a, arguments) : (c = this.G).$.apply(c, arguments)
    };
    return c
  }(a.d);
  a.ma = function(a) {
    function c() {
      return c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.Tc = {compile:D("break")};
    c.Xc = {compile:D("continue")};
    return c
  }(a.d);
  a.hb = function(a) {
    function c(a) {
      var b;
      b = a.m;
      this.body = a.body;
      this.Xb = b[0];
      this.Zb = b[1];
      this.bc = b[2];
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      var a, c, b, d;
      a = this.Xb.a();
      c = this.Zb.a();
      b = this.bc.a();
      var i, g, m, r;
      m = this.body;
      r = [];
      i = 0;
      for(g = m.length;i < g;i++) {
        d = m[i], r.push(d.a())
      }
      return"for (" + a + "; " + c + "; " + b + ") {\n\t" + r.join(";\n  ") + ";\n}"
    };
    return c
  }(a.ma);
  a.Hb = function(d) {
    function c(b, d) {
      var e, f, i;
      this.Na = b.Na;
      this.body = b.body;
      i = a.h.B("i", d);
      e = a.h.B("len", d);
      f = new a.rd([this.Na, a.e("length")]);
      e = new a.Eb(a.h.z({"var":i, value:a.H(0, d)}), a.h.z({"var":e, value:f}));
      f = new a.Kb([i, f]);
      i = new a.Mb(i);
      c.b.constructor.call(this, [e, f, i], d)
    }
    b(c, d);
    return c
  }(a.hb);
  a.dd = function(a) {
    function c(a) {
      this.xb = a.xb;
      this.object = a.object;
      this.body = a.body;
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      var a, c, b;
      c = this.xb.a();
      a = this.object.a();
      var d, i, g, m;
      g = this.body;
      m = [];
      d = 0;
      for(i = g.length;d < i;d++) {
        b = g[d], m.push(b.a())
      }
      return"for (" + c + " in " + a + ") {\n  " + m.join(";\n  ") + ";\n}"
    };
    return c
  }(a.ma);
  a.Tb = function(a) {
    function c(a) {
      this.m = a.m;
      this.body = a.body;
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      var a, c;
      a = this.m.a();
      var b, d, i, g;
      i = this.body;
      g = [];
      b = 0;
      for(d = i.length;b < d;b++) {
        c = i[b], g.push(c.a())
      }
      return"while (" + a + ") {\n  " + g.join(";\n  ") + ";\n}"
    };
    return c
  }(a.ma);
  a.ad = function(a) {
    function c(a) {
      this.m = a.m;
      this.body = a.body;
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      var a, c;
      a = this.m.a();
      var b, d, i, g;
      i = this.body;
      g = [];
      b = 0;
      for(d = i.length;b < d;b++) {
        c = i[b], g.push(c.a())
      }
      return"do {\n  " + g.join(";\n  ") + ";\n} while (" + a + ")"
    };
    return c
  }(a.ma);
  a.H = function(a) {
    function c(a) {
      var b, d;
      c.b.constructor.apply(this, arguments);
      "object" === e.s.w(a) && (b = a, d = b.value, a = (b = b.$b) ? parseInt(d, b) : d);
      this.value = +a
    }
    b(c, a);
    c.prototype.compile = function() {
      return"" + this.value
    };
    return c
  }(a.d);
  a.na = function(a) {
    function c(a) {
      this.tc = a != t ? a : [];
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      var a, c, b, d, i, g;
      i = this.tc;
      g = [];
      b = 0;
      for(d = i.length;b < d;b++) {
        c = i[b], a = c[0], c = c[1], g.push("" + a.a() + ": " + c.a())
      }
      return"{ " + g.join(",\n  ") + " }"
    };
    return c
  }(a.d);
  a.sd = function(d) {
    function c(a) {
      this.pc = a[0];
      this.uc = 2 <= a.length ? A.call(a, 1) : [];
      c.b.constructor.apply(this, arguments)
    }
    b(c, d);
    c.prototype.compile = function() {
      var c, b, d, e, i, g, m;
      c = this.pc.a();
      g = this.uc;
      m = [];
      e = 0;
      for(i = g.length;e < i;e++) {
        d = g[e], b = d.a(), d instanceof a.h ? m.push(c = "" + c + "." + b) : m.push(c = "" + c + "[" + b + "]")
      }
      return m
    };
    return c
  }(a.d);
  a.Ga = function(a) {
    function c(a) {
      this.x = a[0];
      this.ha = a[1];
      this.y = a[2];
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      var a, c;
      a = this.x.a();
      c = this.y.a();
      return"" + a + " " + this.ha + " " + c
    };
    return c
  }(a.d);
  a.jb = function(a) {
    function c(a) {
      this.x = a[0];
      this.ha = a[1];
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      return"" + this.ha + this.x.a()
    };
    return c
  }(a.Ga);
  a.ib = function(a) {
    function c(a) {
      this.x = a[0];
      this.ha = a[1];
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      return"" + this.x.a() + this.ha
    };
    return c
  }(a.Ga);
  x = {Mc:"+", td:"-", kd:"*", $c:"/", jd:"%", ed:">", Kb:"<", fd:">=", hd:"<=", cd:"===", bd:"==", md:"!==", ld:"!=", Nc:"&&", nd:"||", Pc:"&", Sc:"|", Vc:"^", Qc:"<<", Uc:">>", Wc:">>>", Eb:","};
  j = {Lb:"!", Rc:"~", qd:"++", pd:"--", Zc:"delete "};
  q = {Mb:"++", od:"--"};
  y = function(d, c) {
    a[d] = function(a) {
      function d(a, b) {
        d.b.constructor.call(this, [a[0], c, a[1]], b)
      }
      b(d, a);
      return d
    }(a.Ga)
  };
  for(n in x) {
    w.call(x, n) && (k = x[n], y(n, k))
  }
  x = function(d, c) {
    a[d] = function(a) {
      function d(a, b) {
        d.b.constructor.call(this, [a, c], b)
      }
      b(d, a);
      return d
    }(a.jb)
  };
  for(n in j) {
    w.call(j, n) && (k = j[n], x(n, k))
  }
  j = function(d, c) {
    a[d] = function(a) {
      function d(a, b) {
        d.b.constructor.call(this, [a, c], b)
      }
      b(d, a);
      return d
    }(a.ib)
  };
  for(n in q) {
    w.call(q, n) && (k = q[n], j(n, k))
  }
  a.I = function(a) {
    function c(a) {
      this.text = a;
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      return this.text
    };
    return c
  }(a.d);
  a.Nb = function(a) {
    function c(a) {
      this.pattern = a.pattern;
      this.Ta = a.Ta;
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      var a;
      return"/" + this.pattern + "/" + ((a = this.Ta) != t ? a : "")
    };
    return c
  }(a.d);
  a.Ia = function(d) {
    function c(b) {
      this.Ya = b;
      this.Ya instanceof a.e || this.error("A rest param must be a symbol.");
      c.b.constructor.apply(this, arguments)
    }
    b(c, d);
    c.prototype.compile = function() {
      return this.Ya.a()
    };
    return c
  }(a.d);
  a.kb = function() {
    function b(c) {
      c == t && (c = {});
      c = c.vc;
      this.aa = {};
      c == t && (c = s);
      c && a.va(this)
    }
    b.prototype.hc = function(a) {
      this.bb(a) && a.ic();
      this.aa[a.name] = {l:a, Bb:h}
    };
    b.prototype.bb = function(a) {
      return a.name in this.aa
    };
    b.prototype.Wa = function(a, b) {
      this.bb(a) || a.Pa();
      return this.aa[a.name].Bb = b
    };
    b.prototype.jc = function(a) {
      var b;
      return(b = this.aa[a.name]) != t ? b.Bb : h
    };
    b.prototype.Cb = function() {
      var a;
      if(Object.keys(this.aa).length) {
        var b, d;
        b = this.aa;
        d = [];
        for(n in b) {
          w.call(b, n) && (a = b[n].l, d.push(a.a()))
        }
        return"var " + d.join(", ") + ";\n"
      }
      return""
    };
    return b
  }();
  a.t = function(a) {
    function c(a) {
      this.value = a;
      c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.compile = function() {
      return"'" + this.value.replace(/'/, "\\'") + "'"
    };
    c.prototype.toString = function() {
      return this.compile()
    };
    return c
  }(a.d);
  a.e = function(d) {
    function c(b) {
      this.name = b;
      this.name instanceof a.e && (this.name = this.name.name);
      c.b.constructor.apply(this, arguments)
    }
    b(c, d);
    c.prototype.compile = function() {
      return a.h.Ec(this.name)
    };
    c.prototype.ic = function() {
      this.error("Can't redefine var " + this.name)
    };
    c.prototype.Pa = function() {
      return this.error("Can't set nonexistant var " + this.name)
    };
    c.B = function(b, c) {
      var d, e;
      b == t && (b = "sym");
      b instanceof a.e && (b = b.name);
      d = (+new Date).toString(36);
      e = Math.floor(1E6 * Math.random()).toString(36);
      return new this("" + b + "-" + e + "-" + d, c)
    };
    c.Ec = function(a) {
      var b;
      if(0 <= this.Jb.indexOf(a)) {
        return this.za(a)
      }
      if(0 === a.length) {
        return this.za("null")
      }
      b = this.cc.bind(this, h);
      return a.replace(this.Rb, this.za).replace(/^\d/, b).replace(/[^\w\$]/g, b)
    };
    c.cc = function(a, b) {
      var c, d;
      a == t && (a = {});
      return this.za((c = (d = a[b]) != t ? d : this.Ib[b]) != t ? c : "ASCII_" + b.charCodeAt(0))
    };
    c.za = function(a) {
      return"" + this.Qb + a + this.Sb
    };
    c.Qb = "_$";
    c.Sb = "_";
    c.Rb = /_\$[^_]+_/g;
    c.Jb = "break case catch char class const continue debugger default delete do else enum export extends false finally for function if implements import in instanceof interface let new null package private protected public return static switch super this throw true try typeof undefined var void while with yield".split(" ");
    c.Ib = {"~":"tilde", "`":"backtick", "!":"exclamationmark", "@":"at", "#":"pound", "%":"percent", "^":"carat", "&":"amperstand", "*":"asterisk", "(":"leftparen", ")":"rightparen", "-":"dash", "+":"plus", "=":"equals", "{":"leftcurly", "}":"rightcurly", "[":"leftsquare", "]":"rightsquare", "|":"pipe", "\\":"backslash", '"':"doublequote", "'":"singlequote", ":":"colon", ";":"semicolon", "<":"leftangle", ">":"rightangle", ",":"comma", ".":"period", "?":"questionmark", "/":"forwardslash", " ":"space", 
    "\t":"tab", "\n":"newline", "\r":"carriagereturn"};
    return c
  }(a.d);
  a.h = function(d) {
    function c() {
      c.b.constructor.apply(this, arguments);
      a.ba().hc(this)
    }
    b(c, d);
    return c
  }(a.e);
  a.h.z = function(d) {
    function c(b, d) {
      var e;
      this.l = b.l;
      e = b.value;
      this.fa = b.fa;
      c.b.constructor.apply(this, arguments);
      this.value = e;
      this.fa == t && (this.fa = s);
      e = a.da(this.l);
      this.fa && !e && this.l.Pa();
      e != t && e.Wa(this.l, this.value)
    }
    b(c, d);
    c.prototype.compile = function() {
      var a, b;
      b = this.l.a();
      a = this.value.a();
      return"" + b + " = " + a
    };
    return c
  }(a.d);
  a.Pb = function(d) {
    function c(b) {
      this.A = b.A;
      this.ca = b.ca;
      this.u = b.u;
      this.v = b.v;
      this.ca == t && (this.ca = a.e.B("err"));
      this.A == t && (this.A = []);
      this.u == t && (this.u = []);
      this.v == t && (this.v = []);
      c.b.constructor.apply(this, arguments)
    }
    b(c, d);
    c.prototype.compile = function() {
      var a, b, c, d, i;
      d = function() {
        var a, b, c, d;
        c = this.A;
        d = [];
        a = 0;
        for(b = c.length;a < b;a++) {
          i = c[a], d.push(i.a())
        }
        return d
      }.call(this);
      b = this.ca.a();
      a = function() {
        var a, b, c, d;
        c = this.u;
        d = [];
        a = 0;
        for(b = c.length;a < b;a++) {
          i = c[a], d.push(i.a())
        }
        return d
      }.call(this);
      c = function() {
        var a, b, c, d;
        c = this.v;
        d = [];
        a = 0;
        for(b = c.length;a < b;a++) {
          i = c[a], d.push(i.a())
        }
        return d
      }.call(this);
      d = d.length ? "\n" + d.join(";\n") + ";\n" : "";
      a = a.length ? "\n" + a.join(";\n") + ";\n" : "";
      c = c.length ? " finally {\n" + c.join(";\n") + ";\n}" : "";
      return"try {" + d + "} catch (" + b + ") {" + a + "}" + c
    };
    c.prototype.F = function() {
      var a;
      if(this.v.length) {
        a = this.v.pop(), this.v.push(a.F())
      }else {
        if(this.A.length && (a = this.A.pop(), this.A.push(a.F())), this.u.length) {
          a = this.u.pop(), this.u.push(a.F())
        }
      }
      return this
    };
    c.prototype.$ = function() {
      return this.v.length ? this.v[this.v.length - 1] : this.u.length ? this.u[this.u.length - 1] : this.A[this.A.length - 1]
    };
    return c
  }(a.d)
}).call(this);
var E = function() {
  function b(a, b, f) {
    a = new e.e(a, f);
    return new e.k([a].concat(b), f)
  }
  function a() {
    this.i = {}
  }
  var f = {trace:function() {
  }, i:{}, Cc:{error:2, program:3, s_expression_list:4, EOF:5, s_expression:6, special_form:7, list:8, symbol:9, literal:10, callable_list:11, array:12, object:13, "(":14, element_list:15, ")":16, "[":17, "]":18, OBJECT:19, kvpair_list:20, OBJECT_END:21, kvpair:22, element:23, base_element_list:24, REST:25, QUOTE:26, QUASIQUOTE:27, UNQUOTE:28, UNQUOTE_SPLICING:29, FUNCTION:30, string:31, regex:32, number:33, atom:34, BOOLEAN_TRUE:35, BOOLEAN_FALSE:36, REGEX:37, FLAGS:38, FIXNUM:39, FLOAT:40, BASENUM:41, 
  STRING:42, keyword:43, KEYWORD:44, IDENTIFIER:45, $accept:0, $end:1}, ja:{2:"error", 5:"EOF", 14:"(", 16:")", 17:"[", 18:"]", 19:"OBJECT", 21:"OBJECT_END", 25:"REST", 26:"QUOTE", 27:"QUASIQUOTE", 28:"UNQUOTE", 29:"UNQUOTE_SPLICING", 30:"FUNCTION", 35:"BOOLEAN_TRUE", 36:"BOOLEAN_FALSE", 37:"REGEX", 38:"FLAGS", 39:"FIXNUM", 40:"FLOAT", 41:"BASENUM", 42:"STRING", 44:"KEYWORD", 45:"IDENTIFIER"}, wb:[0, [3, 2], [3, 1], [4, 2], [4, 1], [6, 1], [6, 1], [6, 1], [6, 1], [8, 1], [8, 1], [8, 1], [11, 3], 
  [12, 3], [12, 2], [13, 3], [13, 2], [20, 1], [20, 2], [22, 2], [15, 1], [15, 3], [15, 2], [24, 1], [24, 2], [23, 1], [7, 2], [7, 2], [7, 2], [7, 2], [7, 3], [10, 1], [10, 1], [10, 1], [10, 1], [34, 2], [34, 1], [34, 1], [32, 2], [33, 1], [33, 1], [33, 1], [31, 1], [31, 1], [43, 2], [9, 1]], Va:function(a, f, n, k, q, j) {
    a = j.length - 1;
    switch(q) {
      case 1:
        return j[a - 1].unshift(new e.I("var eval = " + (new e.e("oppo-eval", h)).compile())), new e.V({body:j[a - 1]}, k);
      case 2:
        return new e.W(k);
      case 3:
        this.c = j[a - 1];
        this.c.push(j[a]);
        break;
      case 4:
        this.c = [j[a]];
        break;
      case 12:
        this.c = new e.k(j[a - 1], k);
        break;
      case 13:
        this.c = b("array", j[a - 1], k);
        break;
      case 14:
        this.c = b("array", [], k);
        break;
      case 15:
        this.c = new e.na(j[a - 1], k);
        break;
      case 16:
        this.c = new e.na([], k);
        break;
      case 17:
        this.c = [j[a]];
        break;
      case 18:
        this.c = j[a - 1];
        this.c.push(j[a]);
        break;
      case 19:
        this.c = [j[a - 1], j[a]];
        break;
      case 21:
        this.c = j[a - 2];
        this.c.push(new e.Ia(j[a], k));
        break;
      case 22:
        this.c = [new e.Ia(j[$01], k)];
        break;
      case 23:
        this.c = [j[a]];
        break;
      case 24:
        this.c = j[a - 1];
        this.c.push(j[a]);
        break;
      case 26:
        this.c = b("quote", j[a]);
        break;
      case 27:
        this.c = b("quasiquote", j[a]);
        break;
      case 28:
        this.c = b("unquote", j[a]);
        break;
      case 29:
        this.c = b("unquote-splicing", j[a]);
        break;
      case 30:
        this.c = b("lambda", j[a - 1]);
        break;
      case 35:
        this.c = new e.W(k);
        break;
      case 36:
        this.c = new e.pa(k);
        break;
      case 37:
        this.c = new e.Ca(k);
        break;
      case 38:
        this.c = b("regex", j[a - 1], j[a].substr(1));
        break;
      case 39:
        this.c = new e.H(j[a], k);
        break;
      case 40:
        this.c = new e.H(j[a], k);
        break;
      case 41:
        q = j[a].split("#");
        this.c = new e.H({value:q[1], $b:q[0]}, k);
        break;
      case 42:
        this.c = new e.t(j[a], k);
        break;
      case 44:
        this.c = b("keyword", j[a], k);
        break;
      case 45:
        this.c = /^nil$/i.test(j[a]) ? new e.W(k) : /^true$/i.test(j[a]) ? new e.pa(k) : /^false$/i.test(j[a]) ? new e.Ca(k) : new e.e(j[a], k)
    }
  }, Dc:[{3:1, 4:2, 5:[1, 3], 6:4, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 17:[1, 23], 19:[1, 24], 26:[1, 9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, {1:[3]}, {5:[1, 34], 6:35, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 17:[1, 23], 19:[1, 24], 26:[1, 9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 
  34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, {1:[2, 2]}, {5:[2, 4], 14:[2, 4], 17:[2, 4], 19:[2, 4], 26:[2, 4], 27:[2, 4], 28:[2, 4], 29:[2, 4], 30:[2, 4], 35:[2, 4], 36:[2, 4], 37:[2, 4], 39:[2, 4], 40:[2, 4], 41:[2, 4], 42:[2, 4], 44:[2, 4], 45:[2, 4]}, {5:[2, 5], 14:[2, 5], 16:[2, 5], 17:[2, 5], 18:[2, 5], 19:[2, 5], 21:[2, 5], 25:[2, 5], 26:[2, 5], 27:[2, 5], 28:[2, 5], 29:[2, 5], 30:[2, 5], 35:[2, 5], 36:[2, 5], 
  37:[2, 5], 39:[2, 5], 40:[2, 5], 41:[2, 5], 42:[2, 5], 44:[2, 5], 45:[2, 5]}, {5:[2, 6], 14:[2, 6], 16:[2, 6], 17:[2, 6], 18:[2, 6], 19:[2, 6], 21:[2, 6], 25:[2, 6], 26:[2, 6], 27:[2, 6], 28:[2, 6], 29:[2, 6], 30:[2, 6], 35:[2, 6], 36:[2, 6], 37:[2, 6], 39:[2, 6], 40:[2, 6], 41:[2, 6], 42:[2, 6], 44:[2, 6], 45:[2, 6]}, {5:[2, 7], 14:[2, 7], 16:[2, 7], 17:[2, 7], 18:[2, 7], 19:[2, 7], 21:[2, 7], 25:[2, 7], 26:[2, 7], 27:[2, 7], 28:[2, 7], 29:[2, 7], 30:[2, 7], 35:[2, 7], 36:[2, 7], 37:[2, 7], 39:[2, 
  7], 40:[2, 7], 41:[2, 7], 42:[2, 7], 44:[2, 7], 45:[2, 7]}, {5:[2, 8], 14:[2, 8], 16:[2, 8], 17:[2, 8], 18:[2, 8], 19:[2, 8], 21:[2, 8], 25:[2, 8], 26:[2, 8], 27:[2, 8], 28:[2, 8], 29:[2, 8], 30:[2, 8], 35:[2, 8], 36:[2, 8], 37:[2, 8], 39:[2, 8], 40:[2, 8], 41:[2, 8], 42:[2, 8], 44:[2, 8], 45:[2, 8]}, {6:36, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 17:[1, 23], 19:[1, 24], 26:[1, 9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 
  37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, {6:37, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 17:[1, 23], 19:[1, 24], 26:[1, 9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, {6:38, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 17:[1, 23], 19:[1, 24], 26:[1, 9], 27:[1, 10], 28:[1, 11], 
  29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, {6:39, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 17:[1, 23], 19:[1, 24], 26:[1, 9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 
  14:[1, 22], 15:40, 17:[1, 23], 19:[1, 24], 23:43, 24:41, 25:[1, 42], 26:[1, 9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, {5:[2, 9], 14:[2, 9], 16:[2, 9], 17:[2, 9], 18:[2, 9], 19:[2, 9], 21:[2, 9], 25:[2, 9], 26:[2, 9], 27:[2, 9], 28:[2, 9], 29:[2, 9], 30:[2, 9], 35:[2, 9], 36:[2, 9], 37:[2, 9], 39:[2, 9], 40:[2, 9], 41:[2, 9], 42:[2, 9], 44:[2, 
  9], 45:[2, 9]}, {5:[2, 10], 14:[2, 10], 16:[2, 10], 17:[2, 10], 18:[2, 10], 19:[2, 10], 21:[2, 10], 25:[2, 10], 26:[2, 10], 27:[2, 10], 28:[2, 10], 29:[2, 10], 30:[2, 10], 35:[2, 10], 36:[2, 10], 37:[2, 10], 39:[2, 10], 40:[2, 10], 41:[2, 10], 42:[2, 10], 44:[2, 10], 45:[2, 10]}, {5:[2, 11], 14:[2, 11], 16:[2, 11], 17:[2, 11], 18:[2, 11], 19:[2, 11], 21:[2, 11], 25:[2, 11], 26:[2, 11], 27:[2, 11], 28:[2, 11], 29:[2, 11], 30:[2, 11], 35:[2, 11], 36:[2, 11], 37:[2, 11], 39:[2, 11], 40:[2, 11], 41:[2, 
  11], 42:[2, 11], 44:[2, 11], 45:[2, 11]}, {5:[2, 45], 14:[2, 45], 16:[2, 45], 17:[2, 45], 18:[2, 45], 19:[2, 45], 21:[2, 45], 25:[2, 45], 26:[2, 45], 27:[2, 45], 28:[2, 45], 29:[2, 45], 30:[2, 45], 35:[2, 45], 36:[2, 45], 37:[2, 45], 39:[2, 45], 40:[2, 45], 41:[2, 45], 42:[2, 45], 44:[2, 45], 45:[2, 45]}, {5:[2, 31], 14:[2, 31], 16:[2, 31], 17:[2, 31], 18:[2, 31], 19:[2, 31], 21:[2, 31], 25:[2, 31], 26:[2, 31], 27:[2, 31], 28:[2, 31], 29:[2, 31], 30:[2, 31], 35:[2, 31], 36:[2, 31], 37:[2, 31], 
  39:[2, 31], 40:[2, 31], 41:[2, 31], 42:[2, 31], 44:[2, 31], 45:[2, 31]}, {5:[2, 32], 14:[2, 32], 16:[2, 32], 17:[2, 32], 18:[2, 32], 19:[2, 32], 21:[2, 32], 25:[2, 32], 26:[2, 32], 27:[2, 32], 28:[2, 32], 29:[2, 32], 30:[2, 32], 35:[2, 32], 36:[2, 32], 37:[2, 32], 39:[2, 32], 40:[2, 32], 41:[2, 32], 42:[2, 32], 44:[2, 32], 45:[2, 32]}, {5:[2, 33], 14:[2, 33], 16:[2, 33], 17:[2, 33], 18:[2, 33], 19:[2, 33], 21:[2, 33], 25:[2, 33], 26:[2, 33], 27:[2, 33], 28:[2, 33], 29:[2, 33], 30:[2, 33], 35:[2, 
  33], 36:[2, 33], 37:[2, 33], 39:[2, 33], 40:[2, 33], 41:[2, 33], 42:[2, 33], 44:[2, 33], 45:[2, 33]}, {5:[2, 34], 14:[2, 34], 16:[2, 34], 17:[2, 34], 18:[2, 34], 19:[2, 34], 21:[2, 34], 25:[2, 34], 26:[2, 34], 27:[2, 34], 28:[2, 34], 29:[2, 34], 30:[2, 34], 35:[2, 34], 36:[2, 34], 37:[2, 34], 39:[2, 34], 40:[2, 34], 41:[2, 34], 42:[2, 34], 44:[2, 34], 45:[2, 34]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 15:45, 16:[1, 46], 17:[1, 23], 19:[1, 24], 23:43, 24:41, 25:[1, 42], 26:[1, 
  9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 15:47, 17:[1, 23], 18:[1, 48], 19:[1, 24], 23:43, 24:41, 25:[1, 42], 26:[1, 9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 
  44:[1, 33], 45:[1, 17]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 17:[1, 23], 19:[1, 24], 20:49, 21:[1, 50], 22:51, 23:52, 26:[1, 9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, {5:[2, 42], 14:[2, 42], 16:[2, 42], 17:[2, 42], 18:[2, 42], 19:[2, 42], 21:[2, 42], 25:[2, 42], 26:[2, 42], 27:[2, 42], 28:[2, 42], 29:[2, 42], 30:[2, 42], 
  35:[2, 42], 36:[2, 42], 37:[2, 42], 39:[2, 42], 40:[2, 42], 41:[2, 42], 42:[2, 42], 44:[2, 42], 45:[2, 42]}, {5:[2, 43], 14:[2, 43], 16:[2, 43], 17:[2, 43], 18:[2, 43], 19:[2, 43], 21:[2, 43], 25:[2, 43], 26:[2, 43], 27:[2, 43], 28:[2, 43], 29:[2, 43], 30:[2, 43], 35:[2, 43], 36:[2, 43], 37:[2, 43], 39:[2, 43], 40:[2, 43], 41:[2, 43], 42:[2, 43], 44:[2, 43], 45:[2, 43]}, {38:[1, 53]}, {5:[2, 39], 14:[2, 39], 16:[2, 39], 17:[2, 39], 18:[2, 39], 19:[2, 39], 21:[2, 39], 25:[2, 39], 26:[2, 39], 27:[2, 
  39], 28:[2, 39], 29:[2, 39], 30:[2, 39], 35:[2, 39], 36:[2, 39], 37:[2, 39], 39:[2, 39], 40:[2, 39], 41:[2, 39], 42:[2, 39], 44:[2, 39], 45:[2, 39]}, {5:[2, 40], 14:[2, 40], 16:[2, 40], 17:[2, 40], 18:[2, 40], 19:[2, 40], 21:[2, 40], 25:[2, 40], 26:[2, 40], 27:[2, 40], 28:[2, 40], 29:[2, 40], 30:[2, 40], 35:[2, 40], 36:[2, 40], 37:[2, 40], 39:[2, 40], 40:[2, 40], 41:[2, 40], 42:[2, 40], 44:[2, 40], 45:[2, 40]}, {5:[2, 41], 14:[2, 41], 16:[2, 41], 17:[2, 41], 18:[2, 41], 19:[2, 41], 21:[2, 41], 
  25:[2, 41], 26:[2, 41], 27:[2, 41], 28:[2, 41], 29:[2, 41], 30:[2, 41], 35:[2, 41], 36:[2, 41], 37:[2, 41], 39:[2, 41], 40:[2, 41], 41:[2, 41], 42:[2, 41], 44:[2, 41], 45:[2, 41]}, {5:[2, 36], 14:[2, 36], 16:[2, 36], 17:[2, 36], 18:[2, 36], 19:[2, 36], 21:[2, 36], 25:[2, 36], 26:[2, 36], 27:[2, 36], 28:[2, 36], 29:[2, 36], 30:[2, 36], 35:[2, 36], 36:[2, 36], 37:[2, 36], 39:[2, 36], 40:[2, 36], 41:[2, 36], 42:[2, 36], 44:[2, 36], 45:[2, 36]}, {5:[2, 37], 14:[2, 37], 16:[2, 37], 17:[2, 37], 18:[2, 
  37], 19:[2, 37], 21:[2, 37], 25:[2, 37], 26:[2, 37], 27:[2, 37], 28:[2, 37], 29:[2, 37], 30:[2, 37], 35:[2, 37], 36:[2, 37], 37:[2, 37], 39:[2, 37], 40:[2, 37], 41:[2, 37], 42:[2, 37], 44:[2, 37], 45:[2, 37]}, {9:54, 45:[1, 17]}, {1:[2, 1]}, {5:[2, 3], 14:[2, 3], 17:[2, 3], 19:[2, 3], 26:[2, 3], 27:[2, 3], 28:[2, 3], 29:[2, 3], 30:[2, 3], 35:[2, 3], 36:[2, 3], 37:[2, 3], 39:[2, 3], 40:[2, 3], 41:[2, 3], 42:[2, 3], 44:[2, 3], 45:[2, 3]}, {5:[2, 26], 14:[2, 26], 16:[2, 26], 17:[2, 26], 18:[2, 26], 
  19:[2, 26], 21:[2, 26], 25:[2, 26], 26:[2, 26], 27:[2, 26], 28:[2, 26], 29:[2, 26], 30:[2, 26], 35:[2, 26], 36:[2, 26], 37:[2, 26], 39:[2, 26], 40:[2, 26], 41:[2, 26], 42:[2, 26], 44:[2, 26], 45:[2, 26]}, {5:[2, 27], 14:[2, 27], 16:[2, 27], 17:[2, 27], 18:[2, 27], 19:[2, 27], 21:[2, 27], 25:[2, 27], 26:[2, 27], 27:[2, 27], 28:[2, 27], 29:[2, 27], 30:[2, 27], 35:[2, 27], 36:[2, 27], 37:[2, 27], 39:[2, 27], 40:[2, 27], 41:[2, 27], 42:[2, 27], 44:[2, 27], 45:[2, 27]}, {5:[2, 28], 14:[2, 28], 16:[2, 
  28], 17:[2, 28], 18:[2, 28], 19:[2, 28], 21:[2, 28], 25:[2, 28], 26:[2, 28], 27:[2, 28], 28:[2, 28], 29:[2, 28], 30:[2, 28], 35:[2, 28], 36:[2, 28], 37:[2, 28], 39:[2, 28], 40:[2, 28], 41:[2, 28], 42:[2, 28], 44:[2, 28], 45:[2, 28]}, {5:[2, 29], 14:[2, 29], 16:[2, 29], 17:[2, 29], 18:[2, 29], 19:[2, 29], 21:[2, 29], 25:[2, 29], 26:[2, 29], 27:[2, 29], 28:[2, 29], 29:[2, 29], 30:[2, 29], 35:[2, 29], 36:[2, 29], 37:[2, 29], 39:[2, 29], 40:[2, 29], 41:[2, 29], 42:[2, 29], 44:[2, 29], 45:[2, 29]}, 
  {16:[1, 55]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 16:[2, 20], 17:[1, 23], 18:[2, 20], 19:[1, 24], 23:57, 25:[1, 56], 26:[1, 9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 17:[1, 23], 19:[1, 24], 23:58, 26:[1, 9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 
  32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, {14:[2, 23], 16:[2, 23], 17:[2, 23], 18:[2, 23], 19:[2, 23], 25:[2, 23], 26:[2, 23], 27:[2, 23], 28:[2, 23], 29:[2, 23], 30:[2, 23], 35:[2, 23], 36:[2, 23], 37:[2, 23], 39:[2, 23], 40:[2, 23], 41:[2, 23], 42:[2, 23], 44:[2, 23], 45:[2, 23]}, {14:[2, 25], 16:[2, 25], 17:[2, 25], 18:[2, 25], 19:[2, 25], 21:[2, 25], 25:[2, 25], 26:[2, 25], 27:[2, 25], 28:[2, 25], 
  29:[2, 25], 30:[2, 25], 35:[2, 25], 36:[2, 25], 37:[2, 25], 39:[2, 25], 40:[2, 25], 41:[2, 25], 42:[2, 25], 44:[2, 25], 45:[2, 25]}, {16:[1, 59]}, {5:[2, 35], 14:[2, 35], 16:[2, 35], 17:[2, 35], 18:[2, 35], 19:[2, 35], 21:[2, 35], 25:[2, 35], 26:[2, 35], 27:[2, 35], 28:[2, 35], 29:[2, 35], 30:[2, 35], 35:[2, 35], 36:[2, 35], 37:[2, 35], 39:[2, 35], 40:[2, 35], 41:[2, 35], 42:[2, 35], 44:[2, 35], 45:[2, 35]}, {18:[1, 60]}, {5:[2, 14], 14:[2, 14], 16:[2, 14], 17:[2, 14], 18:[2, 14], 19:[2, 14], 21:[2, 
  14], 25:[2, 14], 26:[2, 14], 27:[2, 14], 28:[2, 14], 29:[2, 14], 30:[2, 14], 35:[2, 14], 36:[2, 14], 37:[2, 14], 39:[2, 14], 40:[2, 14], 41:[2, 14], 42:[2, 14], 44:[2, 14], 45:[2, 14]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 17:[1, 23], 19:[1, 24], 21:[1, 61], 22:62, 23:52, 26:[1, 9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, 
  {5:[2, 16], 14:[2, 16], 16:[2, 16], 17:[2, 16], 18:[2, 16], 19:[2, 16], 21:[2, 16], 25:[2, 16], 26:[2, 16], 27:[2, 16], 28:[2, 16], 29:[2, 16], 30:[2, 16], 35:[2, 16], 36:[2, 16], 37:[2, 16], 39:[2, 16], 40:[2, 16], 41:[2, 16], 42:[2, 16], 44:[2, 16], 45:[2, 16]}, {14:[2, 17], 17:[2, 17], 19:[2, 17], 21:[2, 17], 26:[2, 17], 27:[2, 17], 28:[2, 17], 29:[2, 17], 30:[2, 17], 35:[2, 17], 36:[2, 17], 37:[2, 17], 39:[2, 17], 40:[2, 17], 41:[2, 17], 42:[2, 17], 44:[2, 17], 45:[2, 17]}, {6:44, 7:5, 8:6, 
  9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 17:[1, 23], 19:[1, 24], 23:63, 26:[1, 9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, {5:[2, 38], 14:[2, 38], 16:[2, 38], 17:[2, 38], 18:[2, 38], 19:[2, 38], 21:[2, 38], 25:[2, 38], 26:[2, 38], 27:[2, 38], 28:[2, 38], 29:[2, 38], 30:[2, 38], 35:[2, 38], 36:[2, 38], 37:[2, 38], 39:[2, 38], 40:[2, 38], 41:[2, 
  38], 42:[2, 38], 44:[2, 38], 45:[2, 38]}, {5:[2, 44], 14:[2, 44], 16:[2, 44], 17:[2, 44], 18:[2, 44], 19:[2, 44], 21:[2, 44], 25:[2, 44], 26:[2, 44], 27:[2, 44], 28:[2, 44], 29:[2, 44], 30:[2, 44], 35:[2, 44], 36:[2, 44], 37:[2, 44], 39:[2, 44], 40:[2, 44], 41:[2, 44], 42:[2, 44], 44:[2, 44], 45:[2, 44]}, {5:[2, 30], 14:[2, 30], 16:[2, 30], 17:[2, 30], 18:[2, 30], 19:[2, 30], 21:[2, 30], 25:[2, 30], 26:[2, 30], 27:[2, 30], 28:[2, 30], 29:[2, 30], 30:[2, 30], 35:[2, 30], 36:[2, 30], 37:[2, 30], 
  39:[2, 30], 40:[2, 30], 41:[2, 30], 42:[2, 30], 44:[2, 30], 45:[2, 30]}, {6:44, 7:5, 8:6, 9:7, 10:8, 11:14, 12:15, 13:16, 14:[1, 22], 17:[1, 23], 19:[1, 24], 23:64, 26:[1, 9], 27:[1, 10], 28:[1, 11], 29:[1, 12], 30:[1, 13], 31:18, 32:19, 33:20, 34:21, 35:[1, 31], 36:[1, 32], 37:[1, 27], 39:[1, 28], 40:[1, 29], 41:[1, 30], 42:[1, 25], 43:26, 44:[1, 33], 45:[1, 17]}, {14:[2, 24], 16:[2, 24], 17:[2, 24], 18:[2, 24], 19:[2, 24], 25:[2, 24], 26:[2, 24], 27:[2, 24], 28:[2, 24], 29:[2, 24], 30:[2, 24], 
  35:[2, 24], 36:[2, 24], 37:[2, 24], 39:[2, 24], 40:[2, 24], 41:[2, 24], 42:[2, 24], 44:[2, 24], 45:[2, 24]}, {16:[2, 22], 18:[2, 22]}, {5:[2, 12], 14:[2, 12], 16:[2, 12], 17:[2, 12], 18:[2, 12], 19:[2, 12], 21:[2, 12], 25:[2, 12], 26:[2, 12], 27:[2, 12], 28:[2, 12], 29:[2, 12], 30:[2, 12], 35:[2, 12], 36:[2, 12], 37:[2, 12], 39:[2, 12], 40:[2, 12], 41:[2, 12], 42:[2, 12], 44:[2, 12], 45:[2, 12]}, {5:[2, 13], 14:[2, 13], 16:[2, 13], 17:[2, 13], 18:[2, 13], 19:[2, 13], 21:[2, 13], 25:[2, 13], 26:[2, 
  13], 27:[2, 13], 28:[2, 13], 29:[2, 13], 30:[2, 13], 35:[2, 13], 36:[2, 13], 37:[2, 13], 39:[2, 13], 40:[2, 13], 41:[2, 13], 42:[2, 13], 44:[2, 13], 45:[2, 13]}, {5:[2, 15], 14:[2, 15], 16:[2, 15], 17:[2, 15], 18:[2, 15], 19:[2, 15], 21:[2, 15], 25:[2, 15], 26:[2, 15], 27:[2, 15], 28:[2, 15], 29:[2, 15], 30:[2, 15], 35:[2, 15], 36:[2, 15], 37:[2, 15], 39:[2, 15], 40:[2, 15], 41:[2, 15], 42:[2, 15], 44:[2, 15], 45:[2, 15]}, {14:[2, 18], 17:[2, 18], 19:[2, 18], 21:[2, 18], 26:[2, 18], 27:[2, 18], 
  28:[2, 18], 29:[2, 18], 30:[2, 18], 35:[2, 18], 36:[2, 18], 37:[2, 18], 39:[2, 18], 40:[2, 18], 41:[2, 18], 42:[2, 18], 44:[2, 18], 45:[2, 18]}, {14:[2, 19], 17:[2, 19], 19:[2, 19], 21:[2, 19], 26:[2, 19], 27:[2, 19], 28:[2, 19], 29:[2, 19], 30:[2, 19], 35:[2, 19], 36:[2, 19], 37:[2, 19], 39:[2, 19], 40:[2, 19], 41:[2, 19], 42:[2, 19], 44:[2, 19], 45:[2, 19]}, {16:[2, 21], 18:[2, 21]}], rb:{3:[2, 2], 34:[2, 1]}, parseError:function(a) {
    throw Error(a);
  }, parse:function(a) {
    var b = [0], e = [t], f = [], q = this.Dc, j = "", x = 0, y = 0, w = 0;
    this.g.zc(a);
    this.g.i = this.i;
    this.i.g = this.g;
    this.i.K = this;
    "undefined" == typeof this.g.j && (this.g.j = {});
    a = this.g.j;
    f.push(a);
    var A = this.g.options && this.g.options.wa;
    "function" === typeof this.i.parseError && (this.parseError = this.i.parseError);
    for(var l, c, o, v, B = {}, u, i;;) {
      o = b[b.length - 1];
      if(this.rb[o]) {
        v = this.rb[o]
      }else {
        if(l === t || "undefined" == typeof l) {
          l = h, l = this.g.Ra() || 1, "number" !== typeof l && (l = this.Cc[l] || l)
        }
        v = q[o] && q[o][l]
      }
      if("undefined" === typeof v || !v.length || !v[0]) {
        var g = "";
        if(!w) {
          i = [];
          for(u in q[o]) {
            this.ja[u] && 2 < u && i.push("'" + this.ja[u] + "'")
          }
          g = this.g.Xa ? "Parse error on line " + (x + 1) + ":\n" + this.g.Xa() + "\nExpecting " + i.join(", ") + ", got '" + (this.ja[l] || l) + "'" : "Parse error on line " + (x + 1) + ": Unexpected " + (1 == l ? "end of input" : "'" + (this.ja[l] || l) + "'");
          this.parseError(g, {text:this.g.match, Hc:this.ja[l] || l, oc:this.g.o, Fd:a, Ad:i})
        }
      }
      if(v[0] instanceof Array && 1 < v.length) {
        throw Error("Parse Error: multiple actions possible at state: " + o + ", token: " + l);
      }
      switch(v[0]) {
        case 1:
          b.push(l);
          e.push(this.g.p);
          f.push(this.g.j);
          b.push(v[1]);
          l = t;
          c ? (l = c, c = t) : (y = this.g.ka, j = this.g.p, x = this.g.o, a = this.g.j, 0 < w && w--);
          break;
        case 2:
          i = this.wb[v[1]][1];
          B.c = e[e.length - i];
          B.lb = {ea:f[f.length - (i || 1)].ea, Y:f[f.length - 1].Y, O:f[f.length - (i || 1)].O, R:f[f.length - 1].R};
          A && (B.lb.S = [f[f.length - (i || 1)].S[0], f[f.length - 1].S[1]]);
          o = this.Va.call(B, j, y, x, this.i, v[1], e, f);
          if("undefined" !== typeof o) {
            return o
          }
          i && (b = b.slice(0, -2 * i), e = e.slice(0, -1 * i), f = f.slice(0, -1 * i));
          b.push(this.wb[v[1]][0]);
          e.push(B.c);
          f.push(B.lb);
          v = q[b[b.length - 2]][b[b.length - 1]];
          b.push(v);
          break;
        case 3:
          return s
      }
    }
    return s
  }}, e = ("undefined" === typeof lemur ? require("lemur") : lemur).Ba;
  f.g = function() {
    return{gb:1, parseError:function(a, b) {
      if(this.i.K) {
        this.i.K.parseError(a, b)
      }else {
        throw Error(a);
      }
    }, zc:function(a) {
      this.r = a;
      this.Ka = this.sa = z;
      this.o = this.ka = 0;
      this.p = this.C = this.match = "";
      this.J = ["INITIAL"];
      this.j = {ea:1, O:0, Y:1, R:0};
      this.options.wa && (this.j.S = [0, 0]);
      this.Z = 0;
      return this
    }, input:function() {
      var a = this.r[0];
      this.p += a;
      this.ka++;
      this.Z++;
      this.match += a;
      this.C += a;
      a.match(/(?:\r\n?|\n).*/g) ? (this.o++, this.j.Y++) : this.j.R++;
      this.options.wa && this.j.S[1]++;
      this.r = this.r.slice(1);
      return a
    }, Ic:function(a) {
      var b = a.length, e = a.split(/(?:\r\n?|\n)/g);
      this.r = a + this.r;
      this.p = this.p.substr(0, this.p.length - b - 1);
      this.Z -= b;
      a = this.match.split(/(?:\r\n?|\n)/g);
      this.match = this.match.substr(0, this.match.length - 1);
      this.C = this.C.substr(0, this.C.length - 1);
      e.length - 1 && (this.o -= e.length - 1);
      var f = this.j.S;
      this.j = {ea:this.j.ea, Y:this.o + 1, O:this.j.O, R:e ? (e.length === a.length ? this.j.O : 0) + a[a.length - e.length].length - e[0].length : this.j.O - b};
      this.options.wa && (this.j.S = [f[0], f[0] + this.ka - b]);
      return this
    }, Gd:function() {
      this.Ka = s;
      return this
    }, Dd:function(a) {
      this.Ic(this.match.slice(a))
    }, rc:function() {
      var a = this.C.substr(0, this.C.length - this.match.length);
      return(20 < a.length ? "..." : "") + a.substr(-20).replace(/\n/g, "")
    }, Kc:function() {
      var a = this.match;
      20 > a.length && (a += this.r.substr(0, 20 - a.length));
      return(a.substr(0, 20) + (20 < a.length ? "..." : "")).replace(/\n/g, "")
    }, Xa:function() {
      var a = this.rc(), b = Array(a.length + 1).join("-");
      return a + this.Kc() + "\n" + b + "^"
    }, next:function() {
      if(this.sa) {
        return this.gb
      }
      this.r || (this.sa = s);
      var a, b, e;
      this.Ka || (this.match = this.p = "");
      for(var f = this.Vb(), q = 0;q < f.length;q++) {
        if((b = this.r.match(this.rules[f[q]])) && (!a || b[0].length > a[0].length)) {
          if(a = b, e = q, !this.options.Bd) {
            break
          }
        }
      }
      if(a) {
        if(b = a[0].match(/(?:\r\n?|\n).*/g)) {
          this.o += b.length
        }
        this.j = {ea:this.j.Y, Y:this.o + 1, O:this.j.R, R:b ? b[b.length - 1].length - b[b.length - 1].match(/\r?\n?/)[0].length : this.j.R + a[0].length};
        this.p += a[0];
        this.match += a[0];
        this.ka = this.p.length;
        this.options.wa && (this.j.S = [this.Z, this.Z += this.ka]);
        this.Ka = z;
        this.r = this.r.slice(a[0].length);
        this.C += a[0];
        a = this.Va.call(this, this.i, this, f[e], this.J[this.J.length - 1]);
        this.sa && this.r && (this.sa = z);
        if(a) {
          return a
        }
      }else {
        return"" === this.r ? this.gb : this.parseError("Lexical error on line " + (this.o + 1) + ". Unrecognized text.\n" + this.Xa(), {text:"", Hc:t, oc:this.o})
      }
    }, Ra:function() {
      var a = this.next();
      return"undefined" !== typeof a ? a : this.Ra()
    }, Ma:function(a) {
      this.J.push(a)
    }, ub:function() {
      return this.J.pop()
    }, Vb:function() {
      return this.gc[this.J[this.J.length - 1]].rules
    }, Nd:function() {
      return this.J[this.J.length - 2]
    }, pushState:function(a) {
      this.Ma(a)
    }, options:{}, Va:function(a, b, e) {
      switch(e) {
        case 2:
          this.Ma("string");
          this.Ab = "";
          break;
        case 3:
          return this.ub(), b.p = this.Ab, 42;
        case 4:
          this.Ab = b.p;
          break;
        case 5:
          this.Ma("regex");
          break;
        case 6:
          return this.ub(), 38;
        case 7:
          return 37;
        case 8:
          return 40;
        case 9:
          return 41;
        case 10:
          return 39;
        case 11:
          return 35;
        case 12:
          return 36;
        case 13:
          return 14;
        case 14:
          return 16;
        case 15:
          return 17;
        case 16:
          return 18;
        case 17:
          return 19;
        case 18:
          return 21;
        case 19:
          return 28;
        case 20:
          return 26;
        case 21:
          return 27;
        case 22:
          return 29;
        case 23:
          return 25;
        case 24:
          return 30;
        case 25:
          return 44;
        case 26:
          return 45;
        case 27:
          return 5;
        case 28:
          return"INVALID"
      }
    }, rules:[/^(?:;.*)/, /^(?:\s+)/, /^(?:")/, /^(?:")/, /^(?:(\\"|[^"])*)/, /^(?:#\/)/, /^(?:\/[a-zA-Z]*)/, /^(?:(\\\/|[^\/])*)/, /^(?:[\+\-]?\d*\.\d+)/, /^(?:\d{1,2}#[\+\-]?\w+)/, /^(?:[\+\-]?\d+)/, /^(?:#[tT]{1})/, /^(?:#[fF]{1})/, /^(?:\()/, /^(?:\))/, /^(?:\[)/, /^(?:\])/, /^(?:\{)/, /^(?:\})/, /^(?:,)/, /^(?:')/, /^(?:`)/, /^(?:,@)/, /^(?:\.)/, /^(?:#\()/, /^(?::)/, /^(?:[\w@#\.:!\$%\^&\*\-\+='"\?\|\/\\<>~]+)/, /^(?:$)/, /^(?:.)/], gc:{string:{rules:[3, 4], inclusive:z}, regex:{rules:[6, 7], 
    inclusive:z}, INITIAL:{rules:[0, 1, 2, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28], inclusive:s}}}
  }();
  a.prototype = f;
  f.Ha = a;
  return new a
}();
"undefined" !== typeof require && "undefined" !== typeof exports && (exports.K = E, exports.Ha = E.Ha, exports.parse = function() {
  return E.parse.apply(E, arguments)
}, exports.sb = function(b) {
  if(!b[1]) {
    throw Error("Usage: " + b[0] + " FILE");
  }
  b = "undefined" !== typeof process ? require("fs").Id(require("path").Jd(b[1]), "utf8") : require("file").path(require("file").zd()).join(b[1]).yb({charset:"utf-8"});
  return exports.K.parse(b)
}, "undefined" !== typeof module && require.sb === module && exports.sb("undefined" !== typeof process ? process.vd.slice(1) : require("system").f));
(function(b) {
  function a() {
  }
  function f(a, b, d) {
    d || (d = []);
    if(a === b) {
      return a !== 0 || 1 / a == 1 / b
    }
    if(a == t || b == t) {
      return a === b
    }
    if(a.Ub) {
      a = a.Wb
    }
    if(b.Ub) {
      b = b.Wb
    }
    if(a.isEqual && k.call(a.isEqual) == y) {
      return a.isEqual(b)
    }
    if(b.isEqual && k.call(b.isEqual) == y) {
      return b.isEqual(a)
    }
    var i = k.call(a);
    if(i != k.call(b)) {
      return z
    }
    switch(i) {
      case l:
        return a == "" + b;
      case w:
        return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
      case j:
      ;
      case x:
        return+a == +b;
      case A:
        return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase
    }
    if(typeof a != "object" || typeof b != "object") {
      return z
    }
    for(var g = d.length;g--;) {
      if(d[g] == a) {
        return s
      }
    }
    var g = -1, m = s, r = 0;
    d.push(a);
    if(i == q) {
      r = a.length;
      if(m = r == b.length) {
        for(;r--;) {
          if(!(m = f(a[r], b[r], d))) {
            break
          }
        }
      }
    }else {
      if("constructor" in a != "constructor" in b || a.constructor != b.constructor) {
        return z
      }
      for(var e in a) {
        if(n.call(a, e)) {
          r++;
          if(!(m = n.call(b, e) && f(a[e], b[e], d))) {
            break
          }
        }
      }
      if(m) {
        for(e in b) {
          if(n.call(b, e) && !r--) {
            break
          }
        }
        m = !r
      }
      if(m && c) {
        for(;++g < 7;) {
          e = p[g];
          if(n.call(a, e) && !(m = n.call(b, e) && f(a[e], b[e], d))) {
            break
          }
        }
      }
    }
    d.pop();
    return m
  }
  var e = typeof exports == "object" && exports && (typeof global == "object" && global && global == global.global && (b = global), exports), d = Object.prototype, p = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"], n = d.hasOwnProperty, k = d.toString, q = "[object Array]", j = "[object Boolean]", x = "[object Date]", y = "[object Function]", w = "[object Number]", A = "[object RegExp]", l = "[object String]", c = !d.propertyIsEnumerable.call({valueOf:0}, 
  "valueOf");
  try {
    Function("//@")()
  }catch(o) {
  }
  a.VERSION = "0.4.2";
  a.isEqual = f;
  if(typeof define == "function" && typeof define.Yb == "object" && define.Yb) {
    b.Ja = a;
    define(function() {
      return a
    })
  }else {
    e ? typeof module == "object" && module && module.ta == e ? (module.ta = a).Ja = a : e.Ja = a : b.Ja = a
  }
})(this);
(function() {
  function b(a, b) {
    function c() {
      this.constructor = a
    }
    for(var d in b) {
      B.call(b, d) && (a[d] = b[d])
    }
    c.prototype = b.prototype;
    a.prototype = new c;
    a.b = b.prototype
  }
  var a, f, e, d, p, n, k, q, j, x, y, w, A, l, c, o, v, B = {}.hasOwnProperty, u = [].slice;
  l = typeof global !== "undefined" && global !== t ? global : window;
  a = lemur.Ba;
  l.Hd = {qb:{types:{}, T:[{}]}};
  oppo.root = l;
  if((typeof module !== "undefined" && module !== t ? module.ta : h) != t) {
    module.ta = oppo
  }
  oppo.Gb = function(a) {
    function c(a, b) {
      this.name = a;
      this.message = b
    }
    b(c, a);
    c.prototype.toString = function() {
      return"" + this.name + ": " + this.message
    };
    return c
  }(Error);
  oppo.Oc = function(a) {
    function c(a) {
      if(a != t) {
        this.message = a
      }
    }
    b(c, a);
    c.prototype.name = "Arity-Exception";
    c.prototype.message = "Wrong number of arguments";
    return c
  }(oppo.Gb);
  o = lemur.s.w;
  oppo.stringify = function(b) {
    var c, d;
    switch(o(b)) {
      case "array":
        return a.k.prototype.ya.call({value:b});
      case "object":
        if(b instanceof a.d) {
          return(d = typeof b.ya === "function" ? b.ya() : h) != t ? d : b.toString()
        }
        var r;
        r = [];
        for(c in b) {
          d = b[c];
          r.push("" + oppo.stringify(c) + " " + oppo.stringify(d))
        }
        return"{ " + r.join("\n") + " }";
      default:
        return"" + b
    }
  };
  oppo.Md = function(a) {
    return oppo.stringify(a).replace(/\n/g, "<br />")
  };
  x = (v = Object.keys) != t ? v : function(a) {
    var b, c;
    c = [];
    for(b in a) {
      B.call(a, b) && c.push(b)
    }
    return c
  };
  (function() {
    var b, c;
    a.d.prototype.a = function() {
      return(this.ia ? this.pb : this.ab ? this.fc : this.$a ? this.ec : this.L ? this.Oa : this.compile).apply(this, arguments)
    };
    a.d.prototype.Oa = function() {
      return"new lemur.Compiler." + this.constructor.name + "('" + this.value + "')"
    };
    b = function() {
      return this.compile.apply(this, arguments)
    };
    a.d.prototype.pb = b;
    a.d.prototype.fc = b;
    a.d.prototype.ec = b;
    a.H.prototype.valueOf = function() {
      return+this.compile()
    };
    a.H.prototype.toString = a.H.prototype.compile;
    c = a.e.prototype.compile;
    a.e.prototype.compile = function() {
      var a, b;
      b = this.name;
      this.name = b.replace(/\-/g, "_");
      a = c.call(this);
      this.name = b;
      return a
    };
    a.t.prototype.toString = function() {
      return eval(this.compile())
    };
    a.t.prototype.valueOf = a.t.prototype.toString;
    return a.Ea.prototype.transform = function() {
      this.G = a.M.transform(this.G);
      if(this.q != t) {
        this.q = a.M.transform(this.q)
      }
      return this
    }
  })();
  oppo.yb = oppo.qb.yb = function() {
    return E.parse.apply(E, arguments)
  };
  n = oppo.compile = oppo.qb.compile = function(b, g) {
    g == t && (g = s);
    if(o(b) === "array") {
      b = new a.k(b);
      b = new a.V({body:[b]})
    }
    return(new lemur.Ba).compile(function() {
      var d, r, e;
      c();
      g && (e = k());
      e = e != t ? "\n// Oppo runtime\n" + e : "";
      d = a.h.B("program").compile();
      r = b.a();
      return"// Your program\nvar " + d + " = " + r + ';\n\nif (typeof __lodash__ === "undefined" && _ && _.noConflict){\n  window.__lodash__ = _.noConflict();\n  _ = null;\n}\n' + e + "\n\n// Run the oppo program\nif (lemur.core.to_type(" + d + ") === 'function')\n  " + d + "();\nelse\n  " + d + ";"
    })
  };
  oppo.xd = function() {
    var b;
    b = new a.W(1);
    return n(b)
  };
  oppo.eval = function(a) {
    return l.eval(n(a))
  };
  a.gd = function(a) {
    function c() {
      return c.b.constructor.apply(this, arguments)
    }
    b(c, a);
    c.prototype.ya = function() {
      return":" + this.value
    };
    return c
  }(a.t);
  a.V = function(c) {
    function g(a, b) {
      this.arity = a.arity;
      a.qa = s;
      g.b.constructor.call(this, a, b)
    }
    b(g, c);
    g.prototype.compile = function() {
      var b, c;
      b = this.body;
      var d, i, e;
      e = [];
      d = 0;
      for(i = b.length;d < i;d++) {
        c = b[d];
        e.push(a.M.transform(c))
      }
      this.body = e;
      c = g.b.compile.apply(this, arguments);
      this.body = b;
      return c
    };
    return g
  }(a.U);
  a.k = function(c) {
    function g() {
      return g.b.constructor.apply(this, arguments)
    }
    b(g, c);
    g.prototype.compile = function() {
      return e.apply(t, ["call"].concat(u.call(this.value)))
    };
    g.prototype.Oa = function() {
      var b, c;
      c = new a.e("js-eval");
      var g, d, i, e;
      i = this.n;
      e = [];
      g = 0;
      for(d = i.length;g < d;g++) {
        b = i[g];
        if(!this.ia || !b.ab) {
          b.L = s
        }
        e.push(new a.k([c, new a.t(b.a())]))
      }
      return(new a.la(e)).compile()
    };
    g.prototype.pb = function() {
      var b, c;
      b = "new lemur.Compiler.List(" + this.Oa.apply(this, arguments) + ", " + this.Sa + ")";
      b = new a.I(b, this.i);
      c = a.h.B("ls");
      return(new a.Fb([new a.h.z({l:c, value:b}), new a.I("" + c.compile() + ".quoted = true"), c])).compile()
    };
    g.prototype.ya = function() {
      var a, b = "" + (this.L ? "'" : this.ia ? "`" : this.ab ? "~" : this.$a ? "..." : "") + "(", c, g, d, i;
      d = this.value;
      i = [];
      c = 0;
      for(g = d.length;c < g;c++) {
        a = d[c];
        i.push(oppo.stringify(a))
      }
      return b + i.join(" ") + ")"
    };
    g.prototype.transform = function() {
      if(!this.L && !this.ia && !this.$a) {
        return d.apply(t, ["call"].concat(u.call(this.value)))
      }
    };
    return g
  }(a.la);
  a.M = function(c) {
    function g(b, c) {
      var d, i;
      d = b.name;
      this.La = b.La;
      this.Za = b.Za;
      i = b.transform;
      this.Q = b.Q;
      this.name = new a.h(d);
      a.ba().Wa(this.name, this);
      if(i != t) {
        this.transform = i
      }
      g.b.constructor.call(this, t, c)
    }
    b(g, c);
    g.prototype.compile = D("null");
    g.prototype.Q = function() {
      return this.transform.apply(this, 1 <= arguments.length ? u.call(arguments, 0) : []).compile()
    };
    g.prototype.transform = function() {
      var b, c, g;
      c = 1 <= arguments.length ? u.call(arguments, 0) : [];
      g = new a.V({body:this.Za, f:this.La}, this.i);
      c = function() {
        var a, g, d;
        d = [];
        a = 0;
        for(g = c.length;a < g;a++) {
          b = c[a];
          b = b.ra();
          b.L = s;
          d.push(b)
        }
        return d
      }();
      g = (new a.k([g].concat(u.call(c)), this.i)).compile();
      g = eval(g);
      if(g instanceof a.k) {
        g.L = z
      }
      return g
    };
    g.nb = function(a) {
      return a != t && a.transform != t && !a.ac
    };
    g.transform = function(b) {
      var c, g;
      if(b instanceof a.oa) {
        b = b.value
      }
      if(b instanceof a.k && !b.L && !b.ia) {
        c = b.n[0];
        if(c instanceof a.e) {
          c = a.X(c);
          this.nb(c) && (g = c.transform.apply(c, b.n.slice(1)))
        }
      }
      !g && (!(b instanceof a.M) && this.nb(b)) && (g = b.transform());
      return g != t && g !== b ? this.transform(g) : b
    };
    return g
  }(a.d);
  q = function(b) {
    var c, d, e;
    new a.e("js-eval");
    e = new a.e("def");
    var f, j, k;
    k = [];
    f = 0;
    for(j = b.length;f < j;f++) {
      d = b[f];
      c = d[0];
      d = d[1];
      c = new a.e(c);
      d = new a.I("" + d);
      k.push(new a.k([e, c, d]))
    }
    b = new a.fb(k);
    return"" + a.ba().Cb() + b.a() + ";"
  };
  p = function(a) {
    return"function () {\n  var last = arguments[0];\n  for (var i=1, len=arguments.length; i<len; i++) {\n    var current = arguments[i];\n    var result = last " + a + " current;\n    if (!result) return result;\n    last = current;\n  }\n  return true;\n}"
  };
  f = function(a, b) {
    b == t && (b = z);
    return"function () {\n  var last = arguments[0];\n  for (var i=1, len=arguments.length; i<len; i++) {\n    if (" + (b ? "!" : "") + "last) return last;\n    last = last " + a + " arguments[i];\n  }\n  return last;\n}"
  };
  y = function(a, b) {
    b == t && (b = z);
    return"function () {\n  var x = arguments[0];\n  for (var i=1, len=arguments.length; i<len; i++) {\n    x " + a + "= " + (b ? "+" : "") + "arguments[i];\n  }\n  return x;\n}"
  };
  A = function(a) {
    return"function (a) {\n    var args = __slice__.call(arguments, 1);\n    var new_a = a.slice();\n    new_a." + a + ".apply(new_a, args);\n    return new_a;\n}"
  };
  w = function(a) {
    return"function (a) {\n  var new_a = a.slice();\n  new_a." + a + "();\n  return new_a;\n}"
  };
  k = function() {
    return q([["+", y("+", s)], ["-", y("-")], ["*", y("*")], ["/", y("/")], ["mod", function(a, b) {
      return a % b
    }], ["**", "Math.pow"], ["min", "Math.min"], ["max", "Math.max"], ["inc", function(a) {
      return++a
    }], ["dec", function(a) {
      return--a
    }], ["<", p("<")], [">", p(">")], ["<=", p("<=")], [">=", p(">=")], ["eq", function() {
      var a, b, c, d;
      c = 0;
      for(d = arguments.length;c < d;c++) {
        b = arguments[c];
        if(typeof a !== "undefined" && a !== t && !__lodash__.isEqual(a, b)) {
          return z
        }
        a = b
      }
      return s
    }], ["=", "eq"], ["not=", function() {
      return!eq.apply(t, arguments)
    }], ["or", f("||")], ["and", f("&&", s)], ["oppo-eval", "oppo.eval"], ["__typeof__", "lemur.core.to_type"], ["typeof", "__typeof__"], ["println", "console.log.bind(console)"], ["prn", "println"], ["__slice__", "Array.prototype.slice"], ["list", function() {
      return __slice__.call(arguments)
    }], ["first", function(a) {
      return a[0]
    }], ["second", function(a) {
      return a[1]
    }], ["last", function(a) {
      return a[a.length - 1]
    }], ["init", function(a) {
      return a.slice(0, a.length - 1)
    }], ["rest", function(a) {
      return a.slice(1)
    }], ["nth", function(a, b) {
      if(b < 0) {
        b = b + a.length
      }else {
        if(b === 0) {
          console.warn("nth treats collections as 1-based instead of 0 based. Don't try to access the 0th element.");
          return t
        }
        b = b - 1
      }
      return a[b]
    }], ["push", A("push")], ["push-right", "push"], ["push-r", "push"], ["push-left", A("unshift")], ["push-l", (new a.e("push-left")).compile()], ["pop", w("pop")], ["pop-right", "pop"], ["pop-r", "pop"], ["pop-left", w("shift")], ["pop-l", (new a.e("pop-left")).compile()], ["concat", function(a) {
      var b = __slice__.call(arguments, 1);
      return a.concat.apply(a, b)
    }], ["sort", function(a, b) {
      var c;
      c = a.slice();
      return b != t ? c.sort(b) : c.sort()
    }], ["map", function(a, b) {
      var c, d, e, f;
      d = __typeof__(b);
      if(b.map != t) {
        return b.map(function(b) {
          return a(b)
        })
      }
      if(d === "array" || b instanceof Array) {
        f = [];
        d = 0;
        for(e = b.length;d < e;d++) {
          c = b[d];
          f.push(a(c))
        }
        return f
      }
      if(d === "object" || b instanceof Object) {
        d = {};
        for(c in b) {
          e = b[c];
          b.hasOwnProperty(c) && (d[c] = a([c, e]))
        }
        return d
      }
    }], ["reduce", function(a, b) {
      var c, d, e, f;
      e = __typeof__(b);
      if(b.reduce != t) {
        return b.reduce(function(b, c) {
          return a(b, c)
        })
      }
      if(e === "array" || b instanceof Array) {
        e = 0;
        for(f = b.length;e < f;e++) {
          c = b[e];
          d = typeof d !== "undefined" && d !== t ? a(d, c) : c
        }
      }else {
        if(e === "object" || b instanceof Object) {
          for(c in b) {
            e = b[c];
            b.hasOwnProperty(c) && (d = d == t ? e : a(d, e))
          }
        }
      }
      return d
    }], ["reduce-right", function(a, b) {
      var c, d, e, f, j;
      d = __typeof__(b);
      if(b.reduceRight != t) {
        return b.reduceRight(function(b, c) {
          return a(b, c)
        })
      }
      if(d === "array" || b instanceof Array) {
        j = b.slice().reverse();
        e = 0;
        for(f = j.length;e < f;e++) {
          d = j[e];
          c = typeof c !== "undefined" && c !== t ? a(c, d) : d
        }
        return c
      }
      if(d === "object" || b instanceof Object) {
        return reduce(a, b)
      }
    }], ["reduce-r", (new a.e("reduce-right")).compile()], ["filter", function(a, b) {
      var c, d, e, f;
      e = __typeof__(b);
      if(b.filter != t) {
        return b.filter(function(b) {
          return a(b)
        })
      }
      if(e === "array" || b instanceof Array) {
        d = [];
        e = 0;
        for(f = b.length;e < f;e++) {
          c = b[e];
          a(c) && d.push(c)
        }
      }else {
        if(e === "object" || b instanceof Object) {
          d = {};
          for(c in b) {
            e = b[c];
            b.hasOwnProperty(c) && a([c, e]) && (d[c] = e)
          }
        }
      }
      return d
    }], ["keys", "Object.keys || " + function(a) {
      var b, c;
      c = [];
      for(b in a) {
        a.hasOwnProperty(b) && c.push(b)
      }
      return c
    }], ["values", function(a) {
      var b, c, d, e, f;
      b = __typeof__(a);
      if(b === "array" || a instanceof Array) {
        return a.slice()
      }
      if(b === "object" || a instanceof Object) {
        e = x(a);
        f = [];
        c = 0;
        for(d = e.length;c < d;c++) {
          b = e[c];
          f.push(a[b])
        }
        return f
      }
    }], ["str", function() {
      var a;
      return function() {
        var b, c, d;
        d = [];
        b = 0;
        for(c = arguments.length;b < c;b++) {
          a = arguments[b];
          typeof a === "string" ? d.push(a) : a.toString != t ? d.push(a.toString()) : d.push("" + a)
        }
        return d
      }.apply(this, arguments).join("")
    }], ["uppercase", function(a) {
      return a.toUpperCase()
    }], ["lowercase", function(a) {
      return a.toLowerCase()
    }], ["replace", function(a, b, c) {
      return a.replace(b, c)
    }], ["match", function(a, b) {
      return a.match(b)
    }], ["re-test", function(a, b) {
      return a.test(b)
    }]])
  };
  j = function(b, c, d) {
    d == t && (d = s);
    b = {name:new a.e(b)};
    d ? b.Q = c : b.transform = c;
    c = new a.M(b);
    c.ac = d;
    c.a()
  };
  e = function() {
    var b, c;
    c = arguments[0];
    b = 2 <= arguments.length ? u.call(arguments, 1) : [];
    c = a.X(new a.e(c));
    return c.Q != t ? c.Q.apply(c, b) : c.transform.apply(c, b).compile()
  };
  d = function() {
    var b, c;
    c = arguments[0];
    b = 2 <= arguments.length ? u.call(arguments, 1) : [];
    c = a.X(new a.e(c));
    return c.transform.apply(c, b)
  };
  c = function() {
    var b;
    j("regex", function(b, c) {
      return new a.Nb({pattern:b.value, Ta:c.value}, b.i)
    });
    j("js-eval", function(b) {
      return b instanceof a.t ? b.value : b instanceof a.H ? b.a() : b instanceof a.e && b.L ? b.name : "oppo.root.eval(" + b.a() + ")"
    });
    j("if", function(b, c, d) {
      return new a.Ea({m:b, G:c, q:d})
    }, z);
    j("lambda", function() {
      var b, c;
      b = arguments[0];
      c = 2 <= arguments.length ? u.call(arguments, 1) : [];
      return new a.V({f:b.value, body:c})
    }, z);
    j("array", function() {
      var b;
      b = 1 <= arguments.length ? u.call(arguments, 0) : [];
      return new a.la(b)
    }, z);
    j("js-for", function() {
      var b, c, d, e;
      b = arguments[0];
      c = arguments[1];
      e = arguments[2];
      d = 4 <= arguments.length ? u.call(arguments, 3) : [];
      return new a.hb({m:[b, c, e], body:d})
    }, z);
    j("foreach", function() {
      var b, c;
      c = arguments[0];
      b = 2 <= arguments.length ? u.call(arguments, 1) : [];
      return new a.Hb({Na:c, body:b})
    }, z);
    b = function(b, c) {
      j(b, function() {
        var b, d, e, g, f, i;
        d = 1 <= arguments.length ? u.call(arguments, 0) : [];
        b = a[c];
        g = b.prototype instanceof a.jb;
        e = b.prototype instanceof a.ib;
        var j;
        for(j = [];d.length;) {
          f = d.shift();
          j.push((g || e ? new b(f, f.i) : (i = d.shift(), new b([f, i], f.i))).compile())
        }
        return j.join(" ")
      })
    };
    b("subtract", "Subtract");
    b("add", "Add");
    b("multiply", "Multiply");
    b("divide", "Divide");
    b("modulo", "Mod");
    b("==", "Eq2");
    b("===", "Eq3");
    b("gt", "GT");
    b("lt", "LT");
    b("gte", "GTE");
    b("lte", "LTE");
    b("not===", "NotEq3");
    b("not==", "NotEq2");
    b("!", "Not");
    b("||", "Or");
    b("&&", "And");
    b("&", "BAnd");
    b("|", "BOr");
    b("^", "BXor");
    b("<<", "BLeftShift");
    b(">>", "BRightShift");
    b(">>>", "BZeroFillRightShift");
    b("~", "BNot");
    b("delete", "Delete");
    j("keyword", function(b) {
      if(b instanceof a.e) {
        return b.value
      }
      if(b instanceof a.t) {
        return b
      }
    });
    j("def", function() {
      var b, c, d, e;
      b = arguments[0];
      d = 2 <= arguments.length ? u.call(arguments, 1) : [];
      d.length || b.error("Def", "You must provide a value.");
      if(b instanceof a.k) {
        c = b.value[0];
        b = b.value.slice(1);
        e = new a.V({name:c, f:b, body:d})
      }else {
        if(b instanceof a.e) {
          c = b;
          e = d[0]
        }else {
          b.error("Def", "Invalid definition.")
        }
      }
      c = new a.h(c);
      return new a.h.z({l:c, value:e})
    }, z);
    j("apply", function() {
      var b, c, d, e;
      e = arguments[0];
      c = 2 <= arguments.length ? u.call(arguments, 1) : [];
      if(c.length > 1) {
        d = function() {
          var a, d, e;
          e = [];
          a = 0;
          for(d = c.length;a < d;a++) {
            b = c[a];
            e.push(b.a())
          }
          return e
        }();
        d = "[].concat(" + d.join(", ") + ")";
        c = [new a.I(d)]
      }
      c.unshift(new a.W);
      c = function() {
        var a, d, e;
        e = [];
        a = 0;
        for(d = c.length;a < d;a++) {
          b = c[a];
          e.push(b.a())
        }
        return e
      }();
      d = e.a();
      !e instanceof a.e && (d = "(c_callable)");
      return"" + d + ".apply(" + c.join(", ") + ")"
    });
    j("call", function() {
      var b, c, d;
      c = arguments[0];
      b = 2 <= arguments.length ? u.call(arguments, 1) : [];
      if(c instanceof a.e) {
        d = a.X(c);
        if(d instanceof a.M) {
          return d.Q != t ? new a.I(d.Q.apply(d, b)) : d.transform.apply(d, b)
        }
      }
      return new a.Da({P:c, f:b}, c.i)
    }, z);
    j("defmacro", function() {
      var b, c, d;
      b = arguments[0];
      d = 2 <= arguments.length ? u.call(arguments, 1) : [];
      c = b.n.shift();
      b = new a.M({name:c, La:b, Za:d});
      return new a.I(b.compile())
    }, z);
    j("let", function() {
      var b, c, d, e, f, i, j, k, l, n;
      b = arguments[0];
      c = 2 <= arguments.length ? u.call(arguments, 1) : [];
      d = new a.e("def");
      j = t;
      i = [];
      n = b.value;
      e = k = 0;
      for(l = n.length;k < l;e = ++k) {
        f = n[e];
        if(e % 2 === 0) {
          j = f
        }else {
          f == t && b.error("Must have even number of bindings.");
          i.push(new a.k([d, j, f]))
        }
      }
      b = u.call(i).concat(u.call(c));
      return(new a.k([new a.V({body:b})])).compile()
    });
    j("do", function() {
      var a;
      return"(" + function() {
        var b, c, d;
        d = [];
        b = 0;
        for(c = arguments.length;b < c;b++) {
          a = arguments[b];
          d.push(a.a())
        }
        return d
      }.apply(this, arguments).join(",\n") + ")"
    });
    j("quote", function(a) {
      a.L = s;
      return a
    }, z);
    j("quasiquote", function(a) {
      a.ia = s;
      return a
    }, z);
    j("unquote", function(a) {
      a.ab = s;
      return a
    }, z);
    j("unquote-splicing", function(a) {
      a.$a = s;
      return a
    }, z);
    j("raise", function(a, b) {
      var c, d;
      if(arguments.length === 1) {
        b = a;
        d = '"Error"'
      }else {
        d = a.a()
      }
      c = b.a();
      return"new oppo.Error(" + d + ", " + c + ").raise()"
    });
    j("try", function() {
      var b, c, d, e;
      b = 1 <= arguments.length ? u.call(arguments, 0) : [];
      e = b.pop();
      if(!(e instanceof a.k) || ((d = e.n[0]) != t ? d.name : h) !== "finally") {
        b.push(e);
        e = new a.k([])
      }
      d = b.pop();
      if(!(d instanceof a.k) || ((c = d.n[0]) != t ? c.name : h) !== "catch") {
        b.push(d);
        d = new a.k([])
      }
      c = d.n;
      d = c[1];
      c = 3 <= c.length ? u.call(c, 2) : [];
      e = e.n;
      e = 2 <= e.length ? u.call(e, 1) : [];
      return new a.Pb({A:b, ca:d, u:c, v:e})
    }, z);
    j("assert", function(b) {
      var c, d;
      c = b.a();
      d = new a.t("Assertion-Error");
      b = new a.t(oppo.stringify(b));
      d = e("raise", d, b);
      return"(" + c + " || " + d + ")"
    })
  }
}).call(this);
"undefined" === typeof __lodash__ && (_ && _.ga) && (window.mb = _.ga(), _ = t);
_$plus_ = function() {
  for(var b = arguments[0], a = 1, f = arguments.length;a < f;a++) {
    b = b + +arguments[a]
  }
  return b
};
_ = function() {
  for(var b = arguments[0], a = 1, f = arguments.length;a < f;a++) {
    b = b - arguments[a]
  }
  return b
};
_$asterisk_ = function() {
  for(var b = arguments[0], a = 1, f = arguments.length;a < f;a++) {
    b = b * arguments[a]
  }
  return b
};
_$forwardslash_ = function() {
  for(var b = arguments[0], a = 1, f = arguments.length;a < f;a++) {
    b = b / arguments[a]
  }
  return b
};
mod = function(b, a) {
  return b % a
};
_$asterisk__$asterisk_ = Math.pow;
min = Math.min;
max = Math.max;
inc = function(b) {
  return++b
};
dec = function(b) {
  return--b
};
_$leftangle_ = function() {
  for(var b = arguments[0], a = 1, f = arguments.length;a < f;a++) {
    var e = arguments[a], b = b < e;
    if(!b) {
      return b
    }
    b = e
  }
  return s
};
_$rightangle_ = function() {
  for(var b = arguments[0], a = 1, f = arguments.length;a < f;a++) {
    var e = arguments[a], b = b > e;
    if(!b) {
      return b
    }
    b = e
  }
  return s
};
_$leftangle__$equals_ = function() {
  for(var b = arguments[0], a = 1, f = arguments.length;a < f;a++) {
    var e = arguments[a], b = b <= e;
    if(!b) {
      return b
    }
    b = e
  }
  return s
};
_$rightangle__$equals_ = function() {
  for(var b = arguments[0], a = 1, f = arguments.length;a < f;a++) {
    var e = arguments[a], b = b >= e;
    if(!b) {
      return b
    }
    b = e
  }
  return s
};
_$equals_ = eq = function() {
  var b, a, f, e;
  f = 0;
  for(e = arguments.length;f < e;f++) {
    a = arguments[f];
    if(typeof b !== "undefined" && b !== t && !__lodash__.isEqual(b, a)) {
      return z
    }
    b = a
  }
  return s
};
not_$equals_ = function() {
  return!eq.apply(t, arguments)
};
or = function() {
  for(var b = arguments[0], a = 1, f = arguments.length;a < f;a++) {
    if(b) {
      break
    }
    b = b || arguments[a]
  }
  return b
};
and = function() {
  for(var b = arguments[0], a = 1, f = arguments.length;a < f;a++) {
    if(!b) {
      break
    }
    b = b && arguments[a]
  }
  return b
};
oppo_eval = oppo.eval;
_$typeof_ = __typeof__ = lemur.s.w;
prn = println = console.log.bind(console);
__slice__ = Array.prototype.slice;
list = function() {
  return __slice__.call(arguments)
};
first = function(b) {
  return b[0]
};
second = function(b) {
  return b[1]
};
last = function(b) {
  return b[b.length - 1]
};
init = function(b) {
  return b.slice(0, b.length - 1)
};
rest = function(b) {
  return b.slice(1)
};
nth = function(b, a) {
  if(a < 0) {
    a = a + b.length
  }else {
    if(a === 0) {
      console.warn("nth treats collections as 1-based instead of 0 based. Don't try to access the 0th element.");
      return t
    }
    a = a - 1
  }
  return b[a]
};
push_r = push_right = push = function(b) {
  var a = __slice__.call(arguments, 1), f = b.slice();
  f.push.apply(f, a);
  return f
};
push_l = push_left = function(b) {
  var a = __slice__.call(arguments, 1), f = b.slice();
  f.unshift.apply(f, a);
  return f
};
pop_r = pop_right = pop = function(b) {
  b = b.slice();
  b.pop();
  return b
};
pop_l = pop_left = function(b) {
  b = b.slice();
  b.shift();
  return b
};
concat = function(b) {
  var a = __slice__.call(arguments, 1);
  return b.concat.apply(b, a)
};
sort = function(b, a) {
  var f;
  f = b.slice();
  return a != t ? f.sort(a) : f.sort()
};
map = function(b, a) {
  var f, e, d, p;
  e = __typeof__(a);
  if(a.map != t) {
    return a.map(function(a) {
      return b(a)
    })
  }
  if(e === "array" || a instanceof Array) {
    p = [];
    e = 0;
    for(d = a.length;e < d;e++) {
      f = a[e];
      p.push(b(f))
    }
    return p
  }
  if(e === "object" || a instanceof Object) {
    e = {};
    for(f in a) {
      d = a[f];
      a.hasOwnProperty(f) && (e[f] = b([f, d]))
    }
    return e
  }
};
reduce = function(b, a) {
  var f, e, d, p;
  d = __typeof__(a);
  if(a.reduce != t) {
    return a.reduce(function(a, d) {
      return b(a, d)
    })
  }
  if(d === "array" || a instanceof Array) {
    d = 0;
    for(p = a.length;d < p;d++) {
      f = a[d];
      e = typeof e !== "undefined" && e !== t ? b(e, f) : f
    }
  }else {
    if(d === "object" || a instanceof Object) {
      for(f in a) {
        d = a[f];
        a.hasOwnProperty(f) && (e = e == t ? d : b(e, d))
      }
    }
  }
  return e
};
reduce_r = reduce_right = function(b, a) {
  var f, e, d, p, n;
  e = __typeof__(a);
  if(a.reduceRight != t) {
    return a.reduceRight(function(a, d) {
      return b(a, d)
    })
  }
  if(e === "array" || a instanceof Array) {
    n = a.slice().reverse();
    d = 0;
    for(p = n.length;d < p;d++) {
      e = n[d];
      f = typeof f !== "undefined" && f !== t ? b(f, e) : e
    }
    return f
  }
  if(e === "object" || a instanceof Object) {
    return reduce(b, a)
  }
};
filter = function(b, a) {
  var f, e, d, p;
  d = __typeof__(a);
  if(a.filter != t) {
    return a.filter(function(a) {
      return b(a)
    })
  }
  if(d === "array" || a instanceof Array) {
    e = [];
    d = 0;
    for(p = a.length;d < p;d++) {
      f = a[d];
      b(f) && e.push(f)
    }
  }else {
    if(d === "object" || a instanceof Object) {
      e = {};
      for(f in a) {
        d = a[f];
        a.hasOwnProperty(f) && b([f, d]) && (e[f] = d)
      }
    }
  }
  return e
};
keys = Object.keys || function(b) {
  var a, f;
  f = [];
  for(a in b) {
    b.hasOwnProperty(a) && f.push(a)
  }
  return f
};
values = function(b) {
  var a, f, e, d, p;
  a = __typeof__(b);
  if(a === "array" || b instanceof Array) {
    return b.slice()
  }
  if(a === "object" || b instanceof Object) {
    d = keys(b);
    p = [];
    f = 0;
    for(e = d.length;f < e;f++) {
      a = d[f];
      p.push(b[a])
    }
    return p
  }
};
str = function() {
  var b;
  return function() {
    var a, f, e;
    e = [];
    a = 0;
    for(f = arguments.length;a < f;a++) {
      b = arguments[a];
      typeof b === "string" ? e.push(b) : b.toString != t ? e.push(b.toString()) : e.push("" + b)
    }
    return e
  }.apply(this, arguments).join("")
};
uppercase = function(b) {
  return b.toUpperCase()
};
lowercase = function(b) {
  return b.toLowerCase()
};
replace = function(b, a, f) {
  return b.replace(a, f)
};
match = function(b, a) {
  return b.match(a)
};
re_test = function(b, a) {
  return b.test(a)
};
"function" === lemur.s.w(t) ? t() : t;
function F() {
  rec_fact = function() {
    var b, a, f;
    for(f = function() {
      b = z;
      if(_$leftangle_(5, 2)) {
        return 1
      }
      b = s
    };;) {
      a = f.call(this);
      if(!b) {
        return a
      }
    }
  };
  fact = function() {
    return rec_fact()
  };
  return prn(_$equals_(fact(), 120))
}
"undefined" === typeof __lodash__ && (_ && _.ga) && (window.mb = _.ga(), _ = t);
"function" === lemur.s.w(F) ? F() : F;
function G() {
  inc = function(b) {
    return _$plus_(b, 1)
  };
  return dec = function(b) {
    return _(b, 1)
  }
}
"undefined" === typeof __lodash__ && (_ && _.ga) && (window.mb = _.ga(), _ = t);
"function" === lemur.s.w(G) ? G() : G;

