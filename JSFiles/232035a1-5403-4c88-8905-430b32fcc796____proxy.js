!function e(t, n, o) {
    function r(s, c) {
        if (!n[s]) {
            if (!t[s]) {
                var a = "function" == typeof require && require;
                if (!c && a) return a(s, !0);
                if (i) return i(s, !0);
                var u = new Error("Cannot find module '" + s + "'");
                throw u.code = "MODULE_NOT_FOUND", u;
            }
            var l = n[s] = {
                exports: {}
            };
            t[s][0].call(l.exports, function(e) {
                var n = t[s][1][e];
                return r(n ? n : e);
            }, l, l.exports, e, t, n, o);
        }
        return n[s].exports;
    }
    for (var i = "function" == typeof require && require, s = 0; s < o.length; s++) r(o[s]);
    return r;
}({
    1: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/json/stringify"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/json/stringify": 8
    } ],
    2: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/object/assign"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/object/assign": 9
    } ],
    3: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/object/define-property"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/object/define-property": 10
    } ],
    4: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/promise"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/promise": 11
    } ],
    5: [ function(e, t, n) {
        "use strict";
        n.__esModule = !0, n["default"] = function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        };
    }, {} ],
    6: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        n.__esModule = !0;
        var r = e("../core-js/object/define-property"), i = o(r);
        n["default"] = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var o = t[n];
                    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), 
                    (0, i["default"])(e, o.key, o);
                }
            }
            return function(t, n, o) {
                return n && e(t.prototype, n), o && e(t, o), t;
            };
        }();
    }, {
        "../core-js/object/define-property": 3
    } ],
    7: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        n.__esModule = !0;
        var r = e("../core-js/object/define-property"), i = o(r);
        n["default"] = function(e, t, n) {
            return t in e ? (0, i["default"])(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = n, e;
        };
    }, {
        "../core-js/object/define-property": 3
    } ],
    8: [ function(e, t, n) {
        var o = e("../../modules/_core"), r = o.JSON || (o.JSON = {
            stringify: JSON.stringify
        });
        t.exports = function(e) {
            return r.stringify.apply(r, arguments);
        };
    }, {
        "../../modules/_core": 19
    } ],
    9: [ function(e, t, n) {
        e("../../modules/es6.object.assign"), t.exports = e("../../modules/_core").Object.assign;
    }, {
        "../../modules/_core": 19,
        "../../modules/es6.object.assign": 74
    } ],
    10: [ function(e, t, n) {
        e("../../modules/es6.object.define-property");
        var o = e("../../modules/_core").Object;
        t.exports = function(e, t, n) {
            return o.defineProperty(e, t, n);
        };
    }, {
        "../../modules/_core": 19,
        "../../modules/es6.object.define-property": 75
    } ],
    11: [ function(e, t, n) {
        e("../modules/es6.object.to-string"), e("../modules/es6.string.iterator"), e("../modules/web.dom.iterable"), 
        e("../modules/es6.promise"), t.exports = e("../modules/_core").Promise;
    }, {
        "../modules/_core": 19,
        "../modules/es6.object.to-string": 76,
        "../modules/es6.promise": 77,
        "../modules/es6.string.iterator": 78,
        "../modules/web.dom.iterable": 79
    } ],
    12: [ function(e, t, n) {
        t.exports = function(e) {
            if ("function" != typeof e) throw TypeError(e + " is not a function!");
            return e;
        };
    }, {} ],
    13: [ function(e, t, n) {
        t.exports = function() {};
    }, {} ],
    14: [ function(e, t, n) {
        t.exports = function(e, t, n, o) {
            if (!(e instanceof t) || void 0 !== o && o in e) throw TypeError(n + ": incorrect invocation!");
            return e;
        };
    }, {} ],
    15: [ function(e, t, n) {
        var o = e("./_is-object");
        t.exports = function(e) {
            if (!o(e)) throw TypeError(e + " is not an object!");
            return e;
        };
    }, {
        "./_is-object": 36
    } ],
    16: [ function(e, t, n) {
        var o = e("./_to-iobject"), r = e("./_to-length"), i = e("./_to-index");
        t.exports = function(e) {
            return function(t, n, s) {
                var c, a = o(t), u = r(a.length), l = i(s, u);
                if (e && n != n) {
                    for (;u > l; ) if (c = a[l++], c != c) return !0;
                } else for (;u > l; l++) if ((e || l in a) && a[l] === n) return e || l || 0;
                return !e && -1;
            };
        };
    }, {
        "./_to-index": 64,
        "./_to-iobject": 66,
        "./_to-length": 67
    } ],
    17: [ function(e, t, n) {
        var o = e("./_cof"), r = e("./_wks")("toStringTag"), i = "Arguments" == o(function() {
            return arguments;
        }()), s = function(e, t) {
            try {
                return e[t];
            } catch (n) {}
        };
        t.exports = function(e) {
            var t, n, c;
            return void 0 === e ? "Undefined" : null === e ? "Null" : "string" == typeof (n = s(t = Object(e), r)) ? n : i ? o(t) : "Object" == (c = o(t)) && "function" == typeof t.callee ? "Arguments" : c;
        };
    }, {
        "./_cof": 18,
        "./_wks": 71
    } ],
    18: [ function(e, t, n) {
        var o = {}.toString;
        t.exports = function(e) {
            return o.call(e).slice(8, -1);
        };
    }, {} ],
    19: [ function(e, t, n) {
        var o = t.exports = {
            version: "2.4.0"
        };
        "number" == typeof __e && (__e = o);
    }, {} ],
    20: [ function(e, t, n) {
        var o = e("./_a-function");
        t.exports = function(e, t, n) {
            if (o(e), void 0 === t) return e;
            switch (n) {
              case 1:
                return function(n) {
                    return e.call(t, n);
                };

              case 2:
                return function(n, o) {
                    return e.call(t, n, o);
                };

              case 3:
                return function(n, o, r) {
                    return e.call(t, n, o, r);
                };
            }
            return function() {
                return e.apply(t, arguments);
            };
        };
    }, {
        "./_a-function": 12
    } ],
    21: [ function(e, t, n) {
        t.exports = function(e) {
            if (void 0 == e) throw TypeError("Can't call method on  " + e);
            return e;
        };
    }, {} ],
    22: [ function(e, t, n) {
        t.exports = !e("./_fails")(function() {
            return 7 != Object.defineProperty({}, "a", {
                get: function() {
                    return 7;
                }
            }).a;
        });
    }, {
        "./_fails": 26
    } ],
    23: [ function(e, t, n) {
        var o = e("./_is-object"), r = e("./_global").document, i = o(r) && o(r.createElement);
        t.exports = function(e) {
            return i ? r.createElement(e) : {};
        };
    }, {
        "./_global": 28,
        "./_is-object": 36
    } ],
    24: [ function(e, t, n) {
        t.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
    }, {} ],
    25: [ function(e, t, n) {
        var o = e("./_global"), r = e("./_core"), i = e("./_ctx"), s = e("./_hide"), c = "prototype", a = function(e, t, n) {
            var u, l, f, d = e & a.F, g = e & a.G, p = e & a.S, _ = e & a.P, h = e & a.B, v = e & a.W, b = g ? r : r[t] || (r[t] = {}), m = b[c], y = g ? o : p ? o[t] : (o[t] || {})[c];
            g && (n = t);
            for (u in n) l = !d && y && void 0 !== y[u], l && u in b || (f = l ? y[u] : n[u], 
            b[u] = g && "function" != typeof y[u] ? n[u] : h && l ? i(f, o) : v && y[u] == f ? function(e) {
                var t = function(t, n, o) {
                    if (this instanceof e) {
                        switch (arguments.length) {
                          case 0:
                            return new e();

                          case 1:
                            return new e(t);

                          case 2:
                            return new e(t, n);
                        }
                        return new e(t, n, o);
                    }
                    return e.apply(this, arguments);
                };
                return t[c] = e[c], t;
            }(f) : _ && "function" == typeof f ? i(Function.call, f) : f, _ && ((b.virtual || (b.virtual = {}))[u] = f, 
            e & a.R && m && !m[u] && s(m, u, f)));
        };
        a.F = 1, a.G = 2, a.S = 4, a.P = 8, a.B = 16, a.W = 32, a.U = 64, a.R = 128, t.exports = a;
    }, {
        "./_core": 19,
        "./_ctx": 20,
        "./_global": 28,
        "./_hide": 30
    } ],
    26: [ function(e, t, n) {
        t.exports = function(e) {
            try {
                return !!e();
            } catch (t) {
                return !0;
            }
        };
    }, {} ],
    27: [ function(e, t, n) {
        var o = e("./_ctx"), r = e("./_iter-call"), i = e("./_is-array-iter"), s = e("./_an-object"), c = e("./_to-length"), a = e("./core.get-iterator-method"), u = {}, l = {}, n = t.exports = function(e, t, n, f, d) {
            var g, p, _, h, v = d ? function() {
                return e;
            } : a(e), b = o(n, f, t ? 2 : 1), m = 0;
            if ("function" != typeof v) throw TypeError(e + " is not iterable!");
            if (i(v)) {
                for (g = c(e.length); g > m; m++) if (h = t ? b(s(p = e[m])[0], p[1]) : b(e[m]), 
                h === u || h === l) return h;
            } else for (_ = v.call(e); !(p = _.next()).done; ) if (h = r(_, b, p.value, t), 
            h === u || h === l) return h;
        };
        n.BREAK = u, n.RETURN = l;
    }, {
        "./_an-object": 15,
        "./_ctx": 20,
        "./_is-array-iter": 35,
        "./_iter-call": 37,
        "./_to-length": 67,
        "./core.get-iterator-method": 72
    } ],
    28: [ function(e, t, n) {
        var o = t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
        "number" == typeof __g && (__g = o);
    }, {} ],
    29: [ function(e, t, n) {
        var o = {}.hasOwnProperty;
        t.exports = function(e, t) {
            return o.call(e, t);
        };
    }, {} ],
    30: [ function(e, t, n) {
        var o = e("./_object-dp"), r = e("./_property-desc");
        t.exports = e("./_descriptors") ? function(e, t, n) {
            return o.f(e, t, r(1, n));
        } : function(e, t, n) {
            return e[t] = n, e;
        };
    }, {
        "./_descriptors": 22,
        "./_object-dp": 47,
        "./_property-desc": 54
    } ],
    31: [ function(e, t, n) {
        t.exports = e("./_global").document && document.documentElement;
    }, {
        "./_global": 28
    } ],
    32: [ function(e, t, n) {
        t.exports = !e("./_descriptors") && !e("./_fails")(function() {
            return 7 != Object.defineProperty(e("./_dom-create")("div"), "a", {
                get: function() {
                    return 7;
                }
            }).a;
        });
    }, {
        "./_descriptors": 22,
        "./_dom-create": 23,
        "./_fails": 26
    } ],
    33: [ function(e, t, n) {
        t.exports = function(e, t, n) {
            var o = void 0 === n;
            switch (t.length) {
              case 0:
                return o ? e() : e.call(n);

              case 1:
                return o ? e(t[0]) : e.call(n, t[0]);

              case 2:
                return o ? e(t[0], t[1]) : e.call(n, t[0], t[1]);

              case 3:
                return o ? e(t[0], t[1], t[2]) : e.call(n, t[0], t[1], t[2]);

              case 4:
                return o ? e(t[0], t[1], t[2], t[3]) : e.call(n, t[0], t[1], t[2], t[3]);
            }
            return e.apply(n, t);
        };
    }, {} ],
    34: [ function(e, t, n) {
        var o = e("./_cof");
        t.exports = Object("z").propertyIsEnumerable(0) ? Object : function(e) {
            return "String" == o(e) ? e.split("") : Object(e);
        };
    }, {
        "./_cof": 18
    } ],
    35: [ function(e, t, n) {
        var o = e("./_iterators"), r = e("./_wks")("iterator"), i = Array.prototype;
        t.exports = function(e) {
            return void 0 !== e && (o.Array === e || i[r] === e);
        };
    }, {
        "./_iterators": 42,
        "./_wks": 71
    } ],
    36: [ function(e, t, n) {
        t.exports = function(e) {
            return "object" == typeof e ? null !== e : "function" == typeof e;
        };
    }, {} ],
    37: [ function(e, t, n) {
        var o = e("./_an-object");
        t.exports = function(e, t, n, r) {
            try {
                return r ? t(o(n)[0], n[1]) : t(n);
            } catch (i) {
                var s = e["return"];
                throw void 0 !== s && o(s.call(e)), i;
            }
        };
    }, {
        "./_an-object": 15
    } ],
    38: [ function(e, t, n) {
        "use strict";
        var o = e("./_object-create"), r = e("./_property-desc"), i = e("./_set-to-string-tag"), s = {};
        e("./_hide")(s, e("./_wks")("iterator"), function() {
            return this;
        }), t.exports = function(e, t, n) {
            e.prototype = o(s, {
                next: r(1, n)
            }), i(e, t + " Iterator");
        };
    }, {
        "./_hide": 30,
        "./_object-create": 46,
        "./_property-desc": 54,
        "./_set-to-string-tag": 58,
        "./_wks": 71
    } ],
    39: [ function(e, t, n) {
        "use strict";
        var o = e("./_library"), r = e("./_export"), i = e("./_redefine"), s = e("./_hide"), c = e("./_has"), a = e("./_iterators"), u = e("./_iter-create"), l = e("./_set-to-string-tag"), f = e("./_object-gpo"), d = e("./_wks")("iterator"), g = !([].keys && "next" in [].keys()), p = "@@iterator", _ = "keys", h = "values", v = function() {
            return this;
        };
        t.exports = function(e, t, n, b, m, y, L) {
            u(n, t, b);
            var x, j, w, k = function(e) {
                if (!g && e in F) return F[e];
                switch (e) {
                  case _:
                    return function() {
                        return new n(this, e);
                    };

                  case h:
                    return function() {
                        return new n(this, e);
                    };
                }
                return function() {
                    return new n(this, e);
                };
            }, O = t + " Iterator", R = m == h, N = !1, F = e.prototype, I = F[d] || F[p] || m && F[m], A = I || k(m), E = m ? R ? k("entries") : A : void 0, P = "Array" == t ? F.entries || I : I;
            if (P && (w = f(P.call(new e())), w !== Object.prototype && (l(w, O, !0), o || c(w, d) || s(w, d, v))), 
            R && I && I.name !== h && (N = !0, A = function() {
                return I.call(this);
            }), o && !L || !g && !N && F[d] || s(F, d, A), a[t] = A, a[O] = v, m) if (x = {
                values: R ? A : k(h),
                keys: y ? A : k(_),
                entries: E
            }, L) for (j in x) j in F || i(F, j, x[j]); else r(r.P + r.F * (g || N), t, x);
            return x;
        };
    }, {
        "./_export": 25,
        "./_has": 29,
        "./_hide": 30,
        "./_iter-create": 38,
        "./_iterators": 42,
        "./_library": 43,
        "./_object-gpo": 50,
        "./_redefine": 56,
        "./_set-to-string-tag": 58,
        "./_wks": 71
    } ],
    40: [ function(e, t, n) {
        var o = e("./_wks")("iterator"), r = !1;
        try {
            var i = [ 7 ][o]();
            i["return"] = function() {
                r = !0;
            }, Array.from(i, function() {
                throw 2;
            });
        } catch (s) {}
        t.exports = function(e, t) {
            if (!t && !r) return !1;
            var n = !1;
            try {
                var i = [ 7 ], s = i[o]();
                s.next = function() {
                    return {
                        done: n = !0
                    };
                }, i[o] = function() {
                    return s;
                }, e(i);
            } catch (c) {}
            return n;
        };
    }, {
        "./_wks": 71
    } ],
    41: [ function(e, t, n) {
        t.exports = function(e, t) {
            return {
                value: t,
                done: !!e
            };
        };
    }, {} ],
    42: [ function(e, t, n) {
        t.exports = {};
    }, {} ],
    43: [ function(e, t, n) {
        t.exports = !0;
    }, {} ],
    44: [ function(e, t, n) {
        var o = e("./_global"), r = e("./_task").set, i = o.MutationObserver || o.WebKitMutationObserver, s = o.process, c = o.Promise, a = "process" == e("./_cof")(s);
        t.exports = function() {
            var e, t, n, u = function() {
                var o, r;
                for (a && (o = s.domain) && o.exit(); e; ) {
                    r = e.fn, e = e.next;
                    try {
                        r();
                    } catch (i) {
                        throw e ? n() : t = void 0, i;
                    }
                }
                t = void 0, o && o.enter();
            };
            if (a) n = function() {
                s.nextTick(u);
            }; else if (i) {
                var l = !0, f = document.createTextNode("");
                new i(u).observe(f, {
                    characterData: !0
                }), n = function() {
                    f.data = l = !l;
                };
            } else if (c && c.resolve) {
                var d = c.resolve();
                n = function() {
                    d.then(u);
                };
            } else n = function() {
                r.call(o, u);
            };
            return function(o) {
                var r = {
                    fn: o,
                    next: void 0
                };
                t && (t.next = r), e || (e = r, n()), t = r;
            };
        };
    }, {
        "./_cof": 18,
        "./_global": 28,
        "./_task": 63
    } ],
    45: [ function(e, t, n) {
        "use strict";
        var o = e("./_object-keys"), r = e("./_object-gops"), i = e("./_object-pie"), s = e("./_to-object"), c = e("./_iobject"), a = Object.assign;
        t.exports = !a || e("./_fails")(function() {
            var e = {}, t = {}, n = Symbol(), o = "abcdefghijklmnopqrst";
            return e[n] = 7, o.split("").forEach(function(e) {
                t[e] = e;
            }), 7 != a({}, e)[n] || Object.keys(a({}, t)).join("") != o;
        }) ? function(e, t) {
            for (var n = s(e), a = arguments.length, u = 1, l = r.f, f = i.f; a > u; ) for (var d, g = c(arguments[u++]), p = l ? o(g).concat(l(g)) : o(g), _ = p.length, h = 0; _ > h; ) f.call(g, d = p[h++]) && (n[d] = g[d]);
            return n;
        } : a;
    }, {
        "./_fails": 26,
        "./_iobject": 34,
        "./_object-gops": 49,
        "./_object-keys": 52,
        "./_object-pie": 53,
        "./_to-object": 68
    } ],
    46: [ function(e, t, n) {
        var o = e("./_an-object"), r = e("./_object-dps"), i = e("./_enum-bug-keys"), s = e("./_shared-key")("IE_PROTO"), c = function() {}, a = "prototype", u = function() {
            var t, n = e("./_dom-create")("iframe"), o = i.length, r = "<", s = ">";
            for (n.style.display = "none", e("./_html").appendChild(n), n.src = "javascript:", 
            t = n.contentWindow.document, t.open(), t.write(r + "script" + s + "document.F=Object" + r + "/script" + s), 
            t.close(), u = t.F; o--; ) delete u[a][i[o]];
            return u();
        };
        t.exports = Object.create || function(e, t) {
            var n;
            return null !== e ? (c[a] = o(e), n = new c(), c[a] = null, n[s] = e) : n = u(), 
            void 0 === t ? n : r(n, t);
        };
    }, {
        "./_an-object": 15,
        "./_dom-create": 23,
        "./_enum-bug-keys": 24,
        "./_html": 31,
        "./_object-dps": 48,
        "./_shared-key": 59
    } ],
    47: [ function(e, t, n) {
        var o = e("./_an-object"), r = e("./_ie8-dom-define"), i = e("./_to-primitive"), s = Object.defineProperty;
        n.f = e("./_descriptors") ? Object.defineProperty : function(e, t, n) {
            if (o(e), t = i(t, !0), o(n), r) try {
                return s(e, t, n);
            } catch (c) {}
            if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");
            return "value" in n && (e[t] = n.value), e;
        };
    }, {
        "./_an-object": 15,
        "./_descriptors": 22,
        "./_ie8-dom-define": 32,
        "./_to-primitive": 69
    } ],
    48: [ function(e, t, n) {
        var o = e("./_object-dp"), r = e("./_an-object"), i = e("./_object-keys");
        t.exports = e("./_descriptors") ? Object.defineProperties : function(e, t) {
            r(e);
            for (var n, s = i(t), c = s.length, a = 0; c > a; ) o.f(e, n = s[a++], t[n]);
            return e;
        };
    }, {
        "./_an-object": 15,
        "./_descriptors": 22,
        "./_object-dp": 47,
        "./_object-keys": 52
    } ],
    49: [ function(e, t, n) {
        n.f = Object.getOwnPropertySymbols;
    }, {} ],
    50: [ function(e, t, n) {
        var o = e("./_has"), r = e("./_to-object"), i = e("./_shared-key")("IE_PROTO"), s = Object.prototype;
        t.exports = Object.getPrototypeOf || function(e) {
            return e = r(e), o(e, i) ? e[i] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? s : null;
        };
    }, {
        "./_has": 29,
        "./_shared-key": 59,
        "./_to-object": 68
    } ],
    51: [ function(e, t, n) {
        var o = e("./_has"), r = e("./_to-iobject"), i = e("./_array-includes")(!1), s = e("./_shared-key")("IE_PROTO");
        t.exports = function(e, t) {
            var n, c = r(e), a = 0, u = [];
            for (n in c) n != s && o(c, n) && u.push(n);
            for (;t.length > a; ) o(c, n = t[a++]) && (~i(u, n) || u.push(n));
            return u;
        };
    }, {
        "./_array-includes": 16,
        "./_has": 29,
        "./_shared-key": 59,
        "./_to-iobject": 66
    } ],
    52: [ function(e, t, n) {
        var o = e("./_object-keys-internal"), r = e("./_enum-bug-keys");
        t.exports = Object.keys || function(e) {
            return o(e, r);
        };
    }, {
        "./_enum-bug-keys": 24,
        "./_object-keys-internal": 51
    } ],
    53: [ function(e, t, n) {
        n.f = {}.propertyIsEnumerable;
    }, {} ],
    54: [ function(e, t, n) {
        t.exports = function(e, t) {
            return {
                enumerable: !(1 & e),
                configurable: !(2 & e),
                writable: !(4 & e),
                value: t
            };
        };
    }, {} ],
    55: [ function(e, t, n) {
        var o = e("./_hide");
        t.exports = function(e, t, n) {
            for (var r in t) n && e[r] ? e[r] = t[r] : o(e, r, t[r]);
            return e;
        };
    }, {
        "./_hide": 30
    } ],
    56: [ function(e, t, n) {
        t.exports = e("./_hide");
    }, {
        "./_hide": 30
    } ],
    57: [ function(e, t, n) {
        "use strict";
        var o = e("./_global"), r = e("./_core"), i = e("./_object-dp"), s = e("./_descriptors"), c = e("./_wks")("species");
        t.exports = function(e) {
            var t = "function" == typeof r[e] ? r[e] : o[e];
            s && t && !t[c] && i.f(t, c, {
                configurable: !0,
                get: function() {
                    return this;
                }
            });
        };
    }, {
        "./_core": 19,
        "./_descriptors": 22,
        "./_global": 28,
        "./_object-dp": 47,
        "./_wks": 71
    } ],
    58: [ function(e, t, n) {
        var o = e("./_object-dp").f, r = e("./_has"), i = e("./_wks")("toStringTag");
        t.exports = function(e, t, n) {
            e && !r(e = n ? e : e.prototype, i) && o(e, i, {
                configurable: !0,
                value: t
            });
        };
    }, {
        "./_has": 29,
        "./_object-dp": 47,
        "./_wks": 71
    } ],
    59: [ function(e, t, n) {
        var o = e("./_shared")("keys"), r = e("./_uid");
        t.exports = function(e) {
            return o[e] || (o[e] = r(e));
        };
    }, {
        "./_shared": 60,
        "./_uid": 70
    } ],
    60: [ function(e, t, n) {
        var o = e("./_global"), r = "__core-js_shared__", i = o[r] || (o[r] = {});
        t.exports = function(e) {
            return i[e] || (i[e] = {});
        };
    }, {
        "./_global": 28
    } ],
    61: [ function(e, t, n) {
        var o = e("./_an-object"), r = e("./_a-function"), i = e("./_wks")("species");
        t.exports = function(e, t) {
            var n, s = o(e).constructor;
            return void 0 === s || void 0 == (n = o(s)[i]) ? t : r(n);
        };
    }, {
        "./_a-function": 12,
        "./_an-object": 15,
        "./_wks": 71
    } ],
    62: [ function(e, t, n) {
        var o = e("./_to-integer"), r = e("./_defined");
        t.exports = function(e) {
            return function(t, n) {
                var i, s, c = String(r(t)), a = o(n), u = c.length;
                return a < 0 || a >= u ? e ? "" : void 0 : (i = c.charCodeAt(a), i < 55296 || i > 56319 || a + 1 === u || (s = c.charCodeAt(a + 1)) < 56320 || s > 57343 ? e ? c.charAt(a) : i : e ? c.slice(a, a + 2) : (i - 55296 << 10) + (s - 56320) + 65536);
            };
        };
    }, {
        "./_defined": 21,
        "./_to-integer": 65
    } ],
    63: [ function(e, t, n) {
        var o, r, i, s = e("./_ctx"), c = e("./_invoke"), a = e("./_html"), u = e("./_dom-create"), l = e("./_global"), f = l.process, d = l.setImmediate, g = l.clearImmediate, p = l.MessageChannel, _ = 0, h = {}, v = "onreadystatechange", b = function() {
            var e = +this;
            if (h.hasOwnProperty(e)) {
                var t = h[e];
                delete h[e], t();
            }
        }, m = function(e) {
            b.call(e.data);
        };
        d && g || (d = function(e) {
            for (var t = [], n = 1; arguments.length > n; ) t.push(arguments[n++]);
            return h[++_] = function() {
                c("function" == typeof e ? e : Function(e), t);
            }, o(_), _;
        }, g = function(e) {
            delete h[e];
        }, "process" == e("./_cof")(f) ? o = function(e) {
            f.nextTick(s(b, e, 1));
        } : p ? (r = new p(), i = r.port2, r.port1.onmessage = m, o = s(i.postMessage, i, 1)) : l.addEventListener && "function" == typeof postMessage && !l.importScripts ? (o = function(e) {
            l.postMessage(e + "", "*");
        }, l.addEventListener("message", m, !1)) : o = v in u("script") ? function(e) {
            a.appendChild(u("script"))[v] = function() {
                a.removeChild(this), b.call(e);
            };
        } : function(e) {
            setTimeout(s(b, e, 1), 0);
        }), t.exports = {
            set: d,
            clear: g
        };
    }, {
        "./_cof": 18,
        "./_ctx": 20,
        "./_dom-create": 23,
        "./_global": 28,
        "./_html": 31,
        "./_invoke": 33
    } ],
    64: [ function(e, t, n) {
        var o = e("./_to-integer"), r = Math.max, i = Math.min;
        t.exports = function(e, t) {
            return e = o(e), e < 0 ? r(e + t, 0) : i(e, t);
        };
    }, {
        "./_to-integer": 65
    } ],
    65: [ function(e, t, n) {
        var o = Math.ceil, r = Math.floor;
        t.exports = function(e) {
            return isNaN(e = +e) ? 0 : (e > 0 ? r : o)(e);
        };
    }, {} ],
    66: [ function(e, t, n) {
        var o = e("./_iobject"), r = e("./_defined");
        t.exports = function(e) {
            return o(r(e));
        };
    }, {
        "./_defined": 21,
        "./_iobject": 34
    } ],
    67: [ function(e, t, n) {
        var o = e("./_to-integer"), r = Math.min;
        t.exports = function(e) {
            return e > 0 ? r(o(e), 9007199254740991) : 0;
        };
    }, {
        "./_to-integer": 65
    } ],
    68: [ function(e, t, n) {
        var o = e("./_defined");
        t.exports = function(e) {
            return Object(o(e));
        };
    }, {
        "./_defined": 21
    } ],
    69: [ function(e, t, n) {
        var o = e("./_is-object");
        t.exports = function(e, t) {
            if (!o(e)) return e;
            var n, r;
            if (t && "function" == typeof (n = e.toString) && !o(r = n.call(e))) return r;
            if ("function" == typeof (n = e.valueOf) && !o(r = n.call(e))) return r;
            if (!t && "function" == typeof (n = e.toString) && !o(r = n.call(e))) return r;
            throw TypeError("Can't convert object to primitive value");
        };
    }, {
        "./_is-object": 36
    } ],
    70: [ function(e, t, n) {
        var o = 0, r = Math.random();
        t.exports = function(e) {
            return "Symbol(".concat(void 0 === e ? "" : e, ")_", (++o + r).toString(36));
        };
    }, {} ],
    71: [ function(e, t, n) {
        var o = e("./_shared")("wks"), r = e("./_uid"), i = e("./_global").Symbol, s = "function" == typeof i, c = t.exports = function(e) {
            return o[e] || (o[e] = s && i[e] || (s ? i : r)("Symbol." + e));
        };
        c.store = o;
    }, {
        "./_global": 28,
        "./_shared": 60,
        "./_uid": 70
    } ],
    72: [ function(e, t, n) {
        var o = e("./_classof"), r = e("./_wks")("iterator"), i = e("./_iterators");
        t.exports = e("./_core").getIteratorMethod = function(e) {
            if (void 0 != e) return e[r] || e["@@iterator"] || i[o(e)];
        };
    }, {
        "./_classof": 17,
        "./_core": 19,
        "./_iterators": 42,
        "./_wks": 71
    } ],
    73: [ function(e, t, n) {
        "use strict";
        var o = e("./_add-to-unscopables"), r = e("./_iter-step"), i = e("./_iterators"), s = e("./_to-iobject");
        t.exports = e("./_iter-define")(Array, "Array", function(e, t) {
            this._t = s(e), this._i = 0, this._k = t;
        }, function() {
            var e = this._t, t = this._k, n = this._i++;
            return !e || n >= e.length ? (this._t = void 0, r(1)) : "keys" == t ? r(0, n) : "values" == t ? r(0, e[n]) : r(0, [ n, e[n] ]);
        }, "values"), i.Arguments = i.Array, o("keys"), o("values"), o("entries");
    }, {
        "./_add-to-unscopables": 13,
        "./_iter-define": 39,
        "./_iter-step": 41,
        "./_iterators": 42,
        "./_to-iobject": 66
    } ],
    74: [ function(e, t, n) {
        var o = e("./_export");
        o(o.S + o.F, "Object", {
            assign: e("./_object-assign")
        });
    }, {
        "./_export": 25,
        "./_object-assign": 45
    } ],
    75: [ function(e, t, n) {
        var o = e("./_export");
        o(o.S + o.F * !e("./_descriptors"), "Object", {
            defineProperty: e("./_object-dp").f
        });
    }, {
        "./_descriptors": 22,
        "./_export": 25,
        "./_object-dp": 47
    } ],
    76: [ function(e, t, n) {}, {} ],
    77: [ function(e, t, n) {
        "use strict";
        var o, r, i, s = e("./_library"), c = e("./_global"), a = e("./_ctx"), u = e("./_classof"), l = e("./_export"), f = e("./_is-object"), d = e("./_a-function"), g = e("./_an-instance"), p = e("./_for-of"), _ = e("./_species-constructor"), h = e("./_task").set, v = e("./_microtask")(), b = "Promise", m = c.TypeError, y = c.process, L = c[b], y = c.process, x = "process" == u(y), j = function() {}, w = !!function() {
            try {
                var t = L.resolve(1), n = (t.constructor = {})[e("./_wks")("species")] = function(e) {
                    e(j, j);
                };
                return (x || "function" == typeof PromiseRejectionEvent) && t.then(j) instanceof n;
            } catch (o) {}
        }(), k = function(e, t) {
            return e === t || e === L && t === i;
        }, O = function(e) {
            var t;
            return !(!f(e) || "function" != typeof (t = e.then)) && t;
        }, R = function(e) {
            return k(L, e) ? new N(e) : new r(e);
        }, N = r = function(e) {
            var t, n;
            this.promise = new e(function(e, o) {
                if (void 0 !== t || void 0 !== n) throw m("Bad Promise constructor");
                t = e, n = o;
            }), this.resolve = d(t), this.reject = d(n);
        }, F = function(e) {
            try {
                e();
            } catch (t) {
                return {
                    error: t
                };
            }
        }, I = function(e, t) {
            if (!e._n) {
                e._n = !0;
                var n = e._c;
                v(function() {
                    for (var o = e._v, r = 1 == e._s, i = 0, s = function(t) {
                        var n, i, s = r ? t.ok : t.fail, c = t.resolve, a = t.reject, u = t.domain;
                        try {
                            s ? (r || (2 == e._h && P(e), e._h = 1), s === !0 ? n = o : (u && u.enter(), n = s(o), 
                            u && u.exit()), n === t.promise ? a(m("Promise-chain cycle")) : (i = O(n)) ? i.call(n, c, a) : c(n)) : a(o);
                        } catch (l) {
                            a(l);
                        }
                    }; n.length > i; ) s(n[i++]);
                    e._c = [], e._n = !1, t && !e._h && A(e);
                });
            }
        }, A = function(e) {
            h.call(c, function() {
                var t, n, o, r = e._v;
                if (E(e) && (t = F(function() {
                    x ? y.emit("unhandledRejection", r, e) : (n = c.onunhandledrejection) ? n({
                        promise: e,
                        reason: r
                    }) : (o = c.console) && o.error && o.error("Unhandled promise rejection", r);
                }), e._h = x || E(e) ? 2 : 1), e._a = void 0, t) throw t.error;
            });
        }, E = function(e) {
            if (1 == e._h) return !1;
            for (var t, n = e._a || e._c, o = 0; n.length > o; ) if (t = n[o++], t.fail || !E(t.promise)) return !1;
            return !0;
        }, P = function(e) {
            h.call(c, function() {
                var t;
                x ? y.emit("rejectionHandled", e) : (t = c.onrejectionhandled) && t({
                    promise: e,
                    reason: e._v
                });
            });
        }, C = function(e) {
            var t = this;
            t._d || (t._d = !0, t = t._w || t, t._v = e, t._s = 2, t._a || (t._a = t._c.slice()), 
            I(t, !0));
        }, M = function(e) {
            var t, n = this;
            if (!n._d) {
                n._d = !0, n = n._w || n;
                try {
                    if (n === e) throw m("Promise can't be resolved itself");
                    (t = O(e)) ? v(function() {
                        var o = {
                            _w: n,
                            _d: !1
                        };
                        try {
                            t.call(e, a(M, o, 1), a(C, o, 1));
                        } catch (r) {
                            C.call(o, r);
                        }
                    }) : (n._v = e, n._s = 1, I(n, !1));
                } catch (o) {
                    C.call({
                        _w: n,
                        _d: !1
                    }, o);
                }
            }
        };
        w || (L = function(e) {
            g(this, L, b, "_h"), d(e), o.call(this);
            try {
                e(a(M, this, 1), a(C, this, 1));
            } catch (t) {
                C.call(this, t);
            }
        }, o = function(e) {
            this._c = [], this._a = void 0, this._s = 0, this._d = !1, this._v = void 0, this._h = 0, 
            this._n = !1;
        }, o.prototype = e("./_redefine-all")(L.prototype, {
            then: function(e, t) {
                var n = R(_(this, L));
                return n.ok = "function" != typeof e || e, n.fail = "function" == typeof t && t, 
                n.domain = x ? y.domain : void 0, this._c.push(n), this._a && this._a.push(n), this._s && I(this, !1), 
                n.promise;
            },
            "catch": function(e) {
                return this.then(void 0, e);
            }
        }), N = function() {
            var e = new o();
            this.promise = e, this.resolve = a(M, e, 1), this.reject = a(C, e, 1);
        }), l(l.G + l.W + l.F * !w, {
            Promise: L
        }), e("./_set-to-string-tag")(L, b), e("./_set-species")(b), i = e("./_core")[b], 
        l(l.S + l.F * !w, b, {
            reject: function(e) {
                var t = R(this), n = t.reject;
                return n(e), t.promise;
            }
        }), l(l.S + l.F * (s || !w), b, {
            resolve: function(e) {
                if (e instanceof L && k(e.constructor, this)) return e;
                var t = R(this), n = t.resolve;
                return n(e), t.promise;
            }
        }), l(l.S + l.F * !(w && e("./_iter-detect")(function(e) {
            L.all(e)["catch"](j);
        })), b, {
            all: function(e) {
                var t = this, n = R(t), o = n.resolve, r = n.reject, i = F(function() {
                    var n = [], i = 0, s = 1;
                    p(e, !1, function(e) {
                        var c = i++, a = !1;
                        n.push(void 0), s++, t.resolve(e).then(function(e) {
                            a || (a = !0, n[c] = e, --s || o(n));
                        }, r);
                    }), --s || o(n);
                });
                return i && r(i.error), n.promise;
            },
            race: function(e) {
                var t = this, n = R(t), o = n.reject, r = F(function() {
                    p(e, !1, function(e) {
                        t.resolve(e).then(n.resolve, o);
                    });
                });
                return r && o(r.error), n.promise;
            }
        });
    }, {
        "./_a-function": 12,
        "./_an-instance": 14,
        "./_classof": 17,
        "./_core": 19,
        "./_ctx": 20,
        "./_export": 25,
        "./_for-of": 27,
        "./_global": 28,
        "./_is-object": 36,
        "./_iter-detect": 40,
        "./_library": 43,
        "./_microtask": 44,
        "./_redefine-all": 55,
        "./_set-species": 57,
        "./_set-to-string-tag": 58,
        "./_species-constructor": 61,
        "./_task": 63,
        "./_wks": 71
    } ],
    78: [ function(e, t, n) {
        "use strict";
        var o = e("./_string-at")(!0);
        e("./_iter-define")(String, "String", function(e) {
            this._t = String(e), this._i = 0;
        }, function() {
            var e, t = this._t, n = this._i;
            return n >= t.length ? {
                value: void 0,
                done: !0
            } : (e = o(t, n), this._i += e.length, {
                value: e,
                done: !1
            });
        });
    }, {
        "./_iter-define": 39,
        "./_string-at": 62
    } ],
    79: [ function(e, t, n) {
        e("./es6.array.iterator");
        for (var o = e("./_global"), r = e("./_hide"), i = e("./_iterators"), s = e("./_wks")("toStringTag"), c = [ "NodeList", "DOMTokenList", "MediaList", "StyleSheetList", "CSSRuleList" ], a = 0; a < 5; a++) {
            var u = c[a], l = o[u], f = l && l.prototype;
            f && !f[s] && r(f, s, u), i[u] = i.Array;
        }
    }, {
        "./_global": 28,
        "./_hide": 30,
        "./_iterators": 42,
        "./_wks": 71,
        "./es6.array.iterator": 73
    } ],
    80: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.ports = {
            bridge: "bridge",
            background: "message:to-priv",
            broadcast: "message:to-non-priv"
        };
    }, {} ],
    81: [ function(e, t, n) {
        "use strict";
        function o() {
            if (c()) {
                var e = void 0;
                try {
                    e = browser;
                } catch (t) {
                    e = {};
                }
                return !!e.runtime;
            }
            return a();
        }
        function r() {
            return !!window.__extensionTestsMode;
        }
        function i() {
            return "20";
        }
        function s() {
            return "87677a2c52b84ad3a151a4a72f5bd3c4";
        }
        function c() {
            return window.navigator.userAgent.indexOf("Firefox") !== -1;
        }
        function a() {
            return !!window.chrome && /google/i.test(navigator.vendor);
        }
        function u() {
            return /^((?!chrome).)*safari/i.test(navigator.userAgent);
        }
        function l() {
            return u() && navigator.userAgent.indexOf("Version/8.0") !== -1;
        }
        function f() {
            return navigator.appVersion.indexOf("Win") !== -1;
        }
        function d() {
            return !!window.IS_BG;
        }
        function g() {
            var e = !1;
            try {
                e = safari.extension.globalPage.contentWindow !== window;
            } catch (t) {}
            return e;
        }
        function p() {
            return !!window.IS_POPUP;
        }
        function _() {
            return d() || p();
        }
        function h() {
            return a() ? "chrome" : c() ? "firefox" : u() ? "safari" : "other";
        }
        function v() {
            var e = "unknown";
            try {
                if (u()) return safari.extension.displayVersion;
                if (a()) {
                    var t = chrome.runtime.getManifest();
                    return t.version;
                }
                if (c()) {
                    var n = browser.runtime.getManifest();
                    return n.version;
                }
                return e;
            } catch (o) {
                return console.error(o), e;
            }
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.isWE = o, n.isTestsMode = r, n.getUpdateTime = i, n.getUuid = s, n.isFF = c, 
        n.isChrome = a, n.isSafari = u, n.isSafari8 = l, n.isWindows = f, n.isBg = d, n.isSafariSettingsPopup = g, 
        n.isPopup = p, n.isBgOrPopup = _, n.getBrowser = h, n.getVersion = v, n.ENV = "prod";
        var b = "c10dd64c87f70ef5563a63c368797e8c";
        n.MIXPANEL = {
            qaKey: "7a5c95b5cba1b225d00cc3ba1c410c78",
            key: b,
            cookie: "mp_" + b + "_mixpanel"
        }, n.STATSC = {
            URL: "https://stats-public.grammarly.io/",
            PREFIX: "grammarly.ui"
        }, n.GRAMMARLY_DOMAIN = "grammarly.com";
        var m = "https://www." + n.GRAMMARLY_DOMAIN;
        n.DAPI = "https://data." + n.GRAMMARLY_DOMAIN;
        var y = "https://app." + n.GRAMMARLY_DOMAIN, L = "https://auth." + n.GRAMMARLY_DOMAIN + "/v3", x = L + "/user", j = m + "/after_install_page";
        n.URLS = {
            app: y,
            appPersonalDictionary: y + "/profile/dictionary",
            capi: "wss://capi." + n.GRAMMARLY_DOMAIN + "/freews",
            dapiMimic: n.DAPI + "/api/mimic",
            dapiProps: n.DAPI + "/api/props",
            editorDictionary: y + "/profile/dictionary",
            dictionary: "https://capi." + n.GRAMMARLY_DOMAIN + "/api/defs",
            docs: y + "/docs",
            docsApi: "https://dox." + n.GRAMMARLY_DOMAIN + "/documents",
            authSettings: x + "/settings",
            authCreatePage: L + "/redirect-anonymous?location=" + j,
            userOrAnonymous: x + "/oranonymous",
            authSignin: L + "/login",
            authSignup: L + "/signup",
            signin: m + "/signin",
            signup: m + "/signup",
            resetPassword: m + "/resetpassword",
            raven: "felog.grammarly.io",
            newFelog: "https://f-log-extension.grammarly.io",
            referral: m + "/referral?page=extension",
            welcomeC: m + "/extension-success",
            upgrade: m + "/upgrade",
            uninstall: m + "/extension-uninstall",
            terms: m + "/terms",
            policy: m + "/privacy-policy",
            pageConfigUrl: "https://d3cv4a9a9wh0bt.cloudfront.net/browserplugin/config.json"
        };
        var w = h().slice(0, 1).toUpperCase() + h().slice(1);
        n.appName = "extension" + w, n.gnarAppName = h() + "Ext";
    }, {} ],
    82: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function r(e, t, n, o, r, i, a, u) {
            var l = {
                message: i,
                logger: r,
                level: c.toFelogString(a),
                application: e,
                version: t,
                env: n
            };
            return u && (l.extra = u), o + "/log?json=" + encodeURIComponent((0, s["default"])(l));
        }
        var i = e("babel-runtime/core-js/json/stringify"), s = o(i);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var c;
        !function(e) {
            e[e.INFO = 0] = "INFO", e[e.WARN = 1] = "WARN", e[e.ERROR = 2] = "ERROR";
        }(c = n.LogLevel || (n.LogLevel = {})), function(e) {
            function t(t) {
                switch (t) {
                  case e.INFO:
                    return "INFO";

                  case e.WARN:
                    return "WARN";

                  case e.ERROR:
                    return "ERROR";

                  default:
                    ;
                    throw new TypeError("Unrecognized log level " + t);
                }
            }
            e.toFelogString = t;
        }(c = n.LogLevel || (n.LogLevel = {})), n.felogRequestUrl = r;
    }, {
        "babel-runtime/core-js/json/stringify": 1
    } ],
    83: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function r(e, t, n, o) {
            var r = document.createElement("img");
            return r.src = a.felogRequestUrl(c.appName, c.getVersion(), c.ENV, c.URLS.newFelog, e, t, n, o), 
            s["default"].resolve();
        }
        var i = e("babel-runtime/core-js/promise"), s = o(i);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var c = e("../newConfig"), a = e("./felog");
        n.sendEventPixel = r;
    }, {
        "../newConfig": 81,
        "./felog": 82,
        "babel-runtime/core-js/promise": 4
    } ],
    84: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var r = e("babel-runtime/core-js/json/stringify"), i = o(r), s = e("babel-runtime/helpers/classCallCheck"), c = o(s), a = e("babel-runtime/helpers/createClass"), u = o(a);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var l = e("./felog"), f = function() {
            function e(t) {
                var n = this;
                (0, c["default"])(this, e), this._sendFelog = t, this.pageLoadTimeout = function() {
                    n._send("cs.connection.failover.pageLoad.timeout", "content script init failed", l.LogLevel.ERROR);
                }, this.appLoadTimeout = function() {
                    n._send("cs.connection.failover.appLoad.timeout", "extension init timed out", l.LogLevel.ERROR);
                }, this.differentStateDomain = function(e) {
                    n._send("cs.state.differentDomain", "received state for different domain", l.LogLevel.INFO, {
                        stateDomain: e
                    });
                }, this.restoredBgConnection = function(e) {
                    n._send("cs.connection.bg.restored", "bg page connection restored", l.LogLevel.INFO, {
                        timeWithoutConnection: e
                    });
                }, this.initWithoutBgConnection = function() {
                    n._send("cs.connection.bg.disconnected", "no connection to bg page", l.LogLevel.INFO);
                }, this.fetchDefinitionsFail = function() {
                    n._send("cs.connection.api.definition.failed", "definitions fetch failed", l.LogLevel.WARN);
                }, this.infinityCheckResetFail = function(e) {
                    n._send("cs.connection.infiniteCheck.failed", "infinite check reset failed", l.LogLevel.ERROR, {
                        delay: e
                    });
                }, this.tooLongPageConfigInit = function(e) {
                    n._send("cs.pageConfig.init.exceeded", "page config init timeout", l.LogLevel.WARN, {
                        initTime: e
                    });
                }, this.tooLongUserUpdateTime = function(e) {
                    n._send("bg.state.user.update.exceeded", "user state update took too long", l.LogLevel.WARN, {
                        updateTime: e
                    });
                }, this.lostBgPageConnection = function() {
                    n._send("cs.gbutton.bgСonnection.lost", "gbutton connection to bg page lost", l.LogLevel.INFO);
                }, this.restoreBgPageConnection = function(e) {
                    n._send("cs.gbutton.bgСonnection.restored", "gbutton connection to bg page restored", l.LogLevel.INFO, {
                        time: e
                    });
                }, this.badCursorPosition = function() {
                    n._send("cs.editor.badCursorPosition", "incorrect cursor position in grammarly-editor", l.LogLevel.INFO);
                }, this.cursorJump = function() {
                    n._send("cs.editor.cursorJump", "cursor jump detected", l.LogLevel.WARN);
                }, this.signinOpen = function() {
                    n._send("cs.signin.open", "sign in dialog opened", l.LogLevel.INFO);
                }, this.signinClose = function(e) {
                    n._send("cs.signin.close", "sign in dialog closed", l.LogLevel.INFO, {
                        openTime: e
                    });
                }, this.tabReloadClick = function() {
                    n._send("cs.gbutton.reload.click", "gbutton reload clicked", l.LogLevel.WARN);
                }, this.popupLoadError = function(e, t) {
                    n._send("cs.popup.load.error", "could not open pop-up editor", l.LogLevel.ERROR, {
                        message: e,
                        name: t
                    });
                }, this.loginNoBgPageConnection = function(e) {
                    n._send("debug.cs.connection.signin.bg.timeout", "can not connect to bg page on login", l.LogLevel.INFO, {
                        message: e
                    });
                }, this.pageConfigCDNError = function(e) {
                    n._send("cs.pageConfig.cdn.error", "could not read page config", l.LogLevel.ERROR, {
                        message: e
                    });
                }, this.pageConfigLocalStorageError = function(e, t) {
                    n._send("cs.pageConfig.localStorage.error", "could not read page config from localStorage", l.LogLevel.INFO, {
                        message: e,
                        name: t
                    });
                }, this.pageConfigUpdated = function(e, t) {
                    n._send("cs.pageConfig.updated", "page config updated", l.LogLevel.INFO, {
                        oldVersion: e,
                        newVersion: t
                    });
                }, this.settingsPopupTimeout = function() {
                    n._send("settings.popup.init.timeout", "settings popup open timeout", l.LogLevel.WARN);
                }, this.settingsUsupportedShow = function(e) {
                    n._send("settings.popup.state.unsupported.show", "page unsupported message shown", l.LogLevel.INFO, {
                        popupType: e
                    });
                }, this.settingsPopupToggled = function(e) {
                    n._send("settings.popup.experiment.toggle", "settings popup disabled/enabled for experiment on /personalize page", l.LogLevel.INFO, {
                        isPopupDisabled: e
                    });
                }, this.socketBgError = function() {
                    n._send("bg.socket.error", "bg page socket error", l.LogLevel.WARN);
                }, this.capiNotAuthorizedLoop = function(e, t) {
                    n._send("debug.socket.notAuthorizedLoop", "could not authenticate on capi and auth", l.LogLevel.INFO, {
                        authDegradation: e,
                        cookiesDisabled: t
                    });
                }, this.socketDisabledCookie = function() {
                    n._send("debug.socket.disabledCookies", "disabled cookies after failed authentication", l.LogLevel.INFO);
                }, this.socketBgRestored = function(e) {
                    n._send("debug.bg.socket.restored", "capi session restored", l.LogLevel.INFO, {
                        tryCount: e
                    });
                }, this.socketBgReconnectFail = function(e, t) {
                    n._send("bg.socket.reconnect.fail", "could not restore ws connection", l.LogLevel.WARN, {
                        token: e,
                        tryCount: t
                    });
                }, this.socketCsError = function() {
                    n._send("cs.socket.error", "content script socket error", l.LogLevel.WARN);
                }, this.soketCsErrorMsg = function(e) {
                    n._send("cs.socket.errorMsg", "capi error", l.LogLevel.WARN, {
                        message: e
                    });
                }, this.gnarClientInitFail = function(e) {
                    n._send("gnar.bg.tracking.gnar.init.fail", "gnar init failed", l.LogLevel.WARN, {
                        message: e
                    });
                }, this.bgTrackingInitFail = function() {
                    n._send("debug.tracking.init.fail", "bg page tracking library init failed", l.LogLevel.INFO);
                }, this.dailyPing = function() {
                    n._send("debug.dailyPing", "daily ping", l.LogLevel.INFO);
                }, this.userUpgradeClick = function(e) {
                    n._send("cs.ui.action.upgradeClick", "upgrade hook clicked", l.LogLevel.INFO, {
                        placement: e
                    });
                }, this.gButtonClick = function() {
                    n._send("cs.ui.gbutton.click", "gbutton clicked", l.LogLevel.INFO);
                }, this.checkingToggledInField = function(e) {
                    n._send("cs.ui.gbutton.toggleInField", "checking toggled in field", l.LogLevel.INFO, {
                        enabled: e
                    });
                }, this.disabledOnDomain = function() {
                    n._send("cs.state.disabledOnDomain", "checking disabled for domain", l.LogLevel.INFO);
                }, this.sessionInvalidated = function(e, t) {
                    n._send("bg.session.invalidated", "user session invalidated", l.LogLevel.INFO, {
                        reason: e,
                        userChanged: t
                    });
                }, this.unexpectedAnonymous = function(e) {
                    n._send("debug.bg.session.unexpectedAnonymous", "user changed to anonymous", l.LogLevel.INFO, e);
                }, this.weakDialectInitialized = function(e) {
                    n._send("bg.settings.weakDialect.init", "set weak dialect from capi", l.LogLevel.INFO, {
                        dialect: e
                    });
                }, this.getDapiPropError = function(e, t) {
                    n._send("bg.connection.dapi.getProp.error", "could not get dapi property", l.LogLevel.WARN, {
                        property: e,
                        body: t
                    });
                }, this.setDapiPropError = function(e, t) {
                    n._send("bg.connection.dapi.setProp.error", "could not set dapi property", l.LogLevel.WARN, {
                        property: e,
                        body: t
                    });
                }, this.toggleExtensionDefs = function(e) {
                    n._send("bg.settings.definitions.toggle", "definitions toggled for domain", l.LogLevel.INFO, {
                        enabled: e
                    });
                }, this.toggleExtension = function(e) {
                    n._send("bg.settings.extension.toggle", "extension toggled for domain", l.LogLevel.INFO, {
                        enabled: e
                    });
                }, this.cookieOverflow = function(e, t) {
                    n._send("debug.bg.state.cookie.overflow", "cookie is too big", l.LogLevel.INFO, {
                        size: e,
                        biggestCookie: t
                    });
                }, this.externalChangePlan = function() {
                    n._send("bg.api.external.changePlan", "plan changed from editor", l.LogLevel.INFO);
                }, this.externalChangeDialect = function() {
                    n._send("bg.api.external.changeDialect", "dialect changed from editor", l.LogLevel.INFO);
                }, this.externalChangeUser = function() {
                    n._send("bg.api.external.changeUsed", "user changed from editor", l.LogLevel.INFO);
                }, this.externalLogout = function() {
                    n._send("bg.api.external.logout", "user logged out form editor", l.LogLevel.INFO);
                }, this.bgPageStartFail = function(e, t) {
                    n._send("bg.start.fail", "bg page start failed", l.LogLevel.ERROR, {
                        message: e,
                        stack: t
                    });
                }, this.bgPageInitTimeout = function(e) {
                    n._send("bg.state.start.timeout", "bg page init timeout", l.LogLevel.WARN, {
                        initTime: e
                    });
                }, this.bgPageInitFail = function(e) {
                    n._send("bg.state.init.fail", "bg page init failed", l.LogLevel.ERROR, {
                        initAttempts: e
                    });
                }, this.extensionUpdated = function(e, t) {
                    n._send("bg.state.updated", "extension updated", l.LogLevel.INFO, {
                        currentVersion: e,
                        previousVersion: t
                    });
                }, this.extensionUpdateFail = function(e) {
                    n._send("bg.state.update.fail", "extension update failed", l.LogLevel.INFO, {
                        previousVersion: e
                    });
                }, this.cannotGetInstallSource = function() {
                    n._send("bg.getSource.fail", "failed to get extension install source", l.LogLevel.WARN);
                }, this.extensionInstall = function(e) {
                    n._send("bg.state.install", "extension installed", l.LogLevel.INFO, {
                        source: e
                    });
                }, this.chromeForcedToUpdate = function(e) {
                    n._send("bg.chrome.forcedToUpdate", "chrome forced update", l.LogLevel.INFO, {
                        newVersion: e
                    });
                }, this.chromeContentScriptLoadError = function(e, t) {
                    n._send("bg.chrome.cs.load.error", "content script execution error", l.LogLevel.WARN, {
                        message: e,
                        type: t
                    });
                }, this.reloadNotificationShow = function() {
                    n._send("bg.ui.notification.tabsReload.show", "extension reload notification shown", l.LogLevel.WARN);
                }, this.reloadNotificationClick = function() {
                    n._send("bg.ui.notification.tabsReload.click", "reload notification clicked", l.LogLevel.INFO);
                }, this.fetchUserFail = function(e, t, o) {
                    n._send("bg.user.fetch.fail", "failed to update user", l.LogLevel.WARN, {
                        body: t,
                        statusCode: o,
                        reason: e
                    });
                }, this.fetchMimicFail = function(e, t) {
                    n._send("bg.user.mimic.fail", "mimic request failed", l.LogLevel.WARN, {
                        body: e,
                        statusCode: t
                    });
                }, this.fetchCookieFail = function() {
                    n._send("bg.cookie.fail", "could not get grauth from cookie", l.LogLevel.WARN);
                }, this.fetchSettingsFail = function(e, t) {
                    n._send("bg.user.settings.fail", "could not get settings from auth", l.LogLevel.WARN, {
                        body: e,
                        statusCode: t
                    });
                }, this.frequentCookieChanges = function(e) {
                    n._send("debug.cookie.onChange.error", "cookie change too frequent", l.LogLevel.INFO, {
                        canceled: e
                    });
                }, this.initializeWeakDialectFromDapi = function() {
                    n._send("bg.state.dialect.weak.initialize", "set weak dialect from dapi", l.LogLevel.INFO);
                }, this.incognitoInit = function() {
                    n._send("bg.incognito.init", "extension initialized in incognito mode", l.LogLevel.INFO);
                }, this.disabledCookiesInit = function() {
                    n._send("bg.cookie.disabled", "extension initialized with disabled cookies", l.LogLevel.INFO);
                }, this.proxyInit = function() {
                    n._send("proxy.init", "proxy script initialized", l.LogLevel.INFO);
                }, this.proxyPortDisconnected = function(e, t) {
                    n._send("proxy.disconnect", "proxy port disconnected", l.LogLevel.INFO, {
                        port: e,
                        error: t
                    });
                }, this.unhandledBgPageException = function(e) {
                    n._send("bg.unhandledException", "unhandled exception on background page", l.LogLevel.ERROR, {
                        message: e.error ? e.error.message : e.message
                    });
                }, this.unhandledBgPageRejection = function(e) {
                    n._send("bg.unhandledRejection", "unhandled promise rejection on background page", l.LogLevel.ERROR, {
                        message: null != e.reason ? "string" == typeof e.reason ? e.reason : e.reason.message : e.message
                    });
                };
            }
            return (0, u["default"])(e, [ {
                key: "_send",
                value: function(e, t, n, o) {
                    var r = void 0;
                    try {
                        r = (0, i["default"])(o);
                    } catch (s) {
                        r = "Failed to stringify event properties: '" + s + "', '" + (s && s.message) + "'", 
                        console.warn(r, "for " + t + "@" + e);
                    }
                    try {
                        this._sendFelog(e, t, n, null != o ? {
                            json: r
                        } : void 0);
                    } catch (s) {
                        console.warn("Failed to send felog for " + t + "@" + e + ": '" + s + "', '" + (s && s.message) + "'");
                    }
                }
            } ]), e;
        }();
        n.Telemetry = f;
    }, {
        "./felog": 82,
        "babel-runtime/core-js/json/stringify": 1,
        "babel-runtime/helpers/classCallCheck": 5,
        "babel-runtime/helpers/createClass": 6
    } ],
    85: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function r() {
            function e(e) {
                var t = e.detail, n = t.name, o = t.data;
                i && i[n].postMessage(o);
            }
            function t() {
                document.dispatchEvent(new CustomEvent("grammarly:pong")), document.dispatchEvent(new CustomEvent("grammarly:reset"));
            }
            function n(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                return document.dispatchEvent(new CustomEvent("grammarly:message", {
                    detail: (0, a["default"])({
                        event: e
                    }, t)
                }));
            }
            function o() {
                document.removeEventListener("grammarly:action", e), document.removeEventListener("grammarly:ping", t), 
                document.removeEventListener("grammarly:reset", o), i = null;
            }
            function r(e) {
                var t = d.runtime.connect({
                    name: e
                });
                return t.onMessage.addListener(function(t) {
                    return n("message", {
                        msg: t,
                        name: e
                    });
                }), t.onDisconnect.addListener(function() {
                    console.warn("port malfunction " + e);
                    var t = d.runtime.lastError;
                    g.proxyPortDisconnected(e, t && t.message || "port malfunction: " + e), o(), document.dispatchEvent(new CustomEvent("grammarly:error", {
                        detail: {
                            event: "disconnect",
                            name: e
                        }
                    }));
                }), t;
            }
            var i = [ f.ports.bridge, f.ports.background, f.ports.broadcast ].reduce(function(e, t) {
                return (0, a["default"])({}, e, (0, s["default"])({}, t, r(t)));
            }, {});
            document.addEventListener("grammarly:action", e), document.addEventListener("grammarly:ping", t), 
            document.dispatchEvent(new CustomEvent("grammarly:proxyports")), document.addEventListener("grammarly:proxyports", o), 
            g.proxyInit();
        }
        var i = e("babel-runtime/helpers/defineProperty"), s = o(i), c = e("babel-runtime/core-js/object/assign"), a = o(c);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var u = e("lib/tracking/felogPixel"), l = e("lib/tracking/telemetry"), f = e("extension-api/interface"), d = window.chrome || window.browser, g = new l.Telemetry(u.sendEventPixel);
        "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", r, !1) : r();
    }, {
        "babel-runtime/core-js/object/assign": 2,
        "babel-runtime/helpers/defineProperty": 7,
        "extension-api/interface": 80,
        "lib/tracking/felogPixel": 83,
        "lib/tracking/telemetry": 84
    } ]
}, {}, [ 85 ]);