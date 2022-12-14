window.__BAKED_JSREPL_BUILD__ = true;
(function () {
    var n, k, l, o, r, p, s, t, q = [].slice,
        j = function (h, a) {
            return function () {
                return h.apply(a, arguments)
            }
        }, v = {}.hasOwnProperty,
        u = function (h, a) {
            function c() {
                this.constructor = h
            }
            for (var b in a) v.call(a, b) && (h[b] = a[b]);
            c.prototype = a.prototype;
            h.prototype = new c;
            h.__super__ = a.prototype;
            return h
        };
    k = document.getElementById("jsrepl-script");
    if (k != null) n = k.src.split("/").slice(0, -1).join("/"), r = "" + n + "/sandbox.html";
    else throw Error('JSREPL script element cannot be found. Make sure you have the ID "jsrepl-script" on it.');
    o = function () {
        function h() {
            var a, c = this;
            a = function () {
                c.head = document.getElementsByTagName("head")[0];
                return c.body = document.getElementsByTagName("body")[0]
            };
            a();
            this.loadfns = [a];
            window.onload = function () {
                var b, a, e, d, f;
                d = c.loadfns;
                f = [];
                for (a = 0, e = d.length; a < e; a++) b = d[a], f.push(b());
                return f
            };
            this.iframe = null
        }
        h.prototype._appendChild = function (a, c) {
            var b, g = this;
            b = function () {
                return g[a].appendChild(c)
            };
            return this[a] != null ? b() : this.loadfns.push(b)
        };
        h.prototype.createSandbox = function (a) {
            var c = this;
            this.iframe !=
                null && this.body.removeChild(this.iframe);
            this.iframe = document.createElement("iframe");
            this.iframe.src = r;
            this.iframe.style.display = "none";
            this.iframe.onload = function () {
                return a(c.iframe.contentWindow)
            };
            return this._appendChild("body", this.iframe)
        };
        return h
    }();
    k = function () {
        function h() {
            this.listeners = {}
        }
        h.prototype.makeArray = function (a) {
            Object.prototype.toString.call(a) !== "[object Array]" && (a = [a]);
            return a
        };
        h.prototype.on = function (a, c) {
            var b, g, e, d;
            if (typeof c === "function") {
                a = this.makeArray(a);
                d = [];
                for (g = 0, e = a.length; g < e; g++) b = a[g], this.listeners[b] == null ? d.push(this.listeners[b] = [c]) : d.push(this.listeners[b].push(c));
                return d
            }
        };
        h.prototype.off = function (a, c) {
            var b, g, e, d, f, a = this.makeArray(a);
            f = [];
            for (e = 0, d = a.length; e < d; e++) b = a[e], g = this.listeners[b], g != null && (c != null ? (b = g.indexOf(c), b > -1 ? f.push(g.splice(b, 1)) : f.push(void 0)) : f.push(this.listeners[b] = []));
            return f
        };
        h.prototype.fire = function (a, c) {
            var b, g, e, d, c = this.makeArray(c);
            g = this.listeners[a];
            if (g != null) {
                c.push(a);
                var f;
                f = [];
                for (e = 0, d = g.length; e <
                    d; e++) b = g[e], f.push(b);
                d = [];
                for (g = 0, e = f.length; g < e; g++) b = f[g], d.push(b.apply(this, c));
                return d
            }
        };
        h.prototype.once = function (a, c) {
            var b, g, e, d, f, h = this,
                a = this.makeArray(a);
            b = function () {
                var g, e, f, d;
                g = 1 <= arguments.length ? q.call(arguments, 0) : [];
                for (f = 0, d = a.length; f < d; f++) e = a[f], h.off(e, b);
                return c.apply(null, g)
            };
            f = [];
            for (e = 0, d = a.length; e < d; e++) g = a[e], f.push(this.on(g, b));
            return f
        };
        return h
    }();
    t = "Worker" in window;
    p = function (h) {
        function a(c, b, a) {
            var e;
            this.input_server = b;
            a == null && (a = {});
            this.onmsg = j(this.onmsg,
                this);
            var d, f, h;
            h = [];
            for (d = 0, f = c.length; d < f; d++) b = c[d], h.push(n + "/" + b);
            this.baseScripts = h;
            this.loader = new o;
            for (e in a) c = a[e], typeof c === "function" && (a[e] = [c]);
            this.listeners = a
        }
        u(a, h);
        a.prototype.onmsg = function (a) {
            var b;
            try {
                return b = JSON.parse(a.data), this.fire(b.type, [b.data])
            } catch (g) {}
        };
        a.prototype.load = function (a, b) {
            var g, e, d, f = this;
            b == null && (b = true);
            g = this.baseScripts.concat(a);
            e = g.shift();
            this.worker != null && this.kill();
            d = function () {
                f.post({
                    type: "importScripts",
                    data: g
                });
                if (f.input_server != null) return f.post({
                    type: "set_input_server",
                    data: f.input_server
                })
            };
            window.removeEventListener("message", this.onmsg, false);
            return !t || !b ? this.loader.createSandbox(function (a) {
                f.worker = a;
                f.workerIsIframe = true;
                window.addEventListener("message", f.onmsg, false);
                return d()
            }) : (this.worker = new Worker(e), this.workerIsIframe = false, this.worker.addEventListener("message", this.onmsg, false), d())
        };
        a.prototype.post = function (a) {
            a = JSON.stringify(a);
            return this.workerIsIframe ? this.worker.postMessage(a, "*") : this.worker.postMessage(a)
        };
        a.prototype.kill = function () {
            var a;
            typeof (a = this.worker).terminate === "function" && a.terminate();
            if (this.loader.body != null && this.loader.iframe) return this.loader.body.removeChild(this.loader.iframe), delete this.loader.iframe
        };
        return a
    }(k);
    s = function () {
        var h, a, c;
        h = {
            firefox_3: /firefox\/3/i,
            opera: /opera/i,
            chrome: /chrome/i
        };
        for (a in h)
            if (c = h[a], c.test(window.navigator.userAgent)) return a
    }();
    l = function (h) {
        function a(c) {
            var b, g, e, d, f, h, i, m = this;
            b = c != null ? c : {};
            i = b.result;
            c = b.error;
            e = b.input;
            f = b.output;
            h = b.progress;
            this.timeout = b.timeout;
            d =
                b.input_server;
            this.getLangConfig = j(this.getLangConfig, this);
            this.rawEval = j(this.rawEval, this);
            this.eval = j(this.eval, this);
            this.checkLineEnd = j(this.checkLineEnd, this);
            this.loadLanguage = j(this.loadLanguage, this);
            this.off = j(this.off, this);
            this.on = j(this.on, this);
            a.__super__.constructor.call(this);
            window.openDatabase != null && (g = openDatabase("replit_input", "1.0", "Emscripted input", 1024), g.transaction(function (a) {
                a.executeSql("DROP TABLE IF EXISTS input");
                return a.executeSql("CREATE TABLE input (text)")
            }));
            d == null && (d = {});
            d.input_id = Math.floor(Math.random() * 9007199254740992) + 1;
            this.lang = null;
            this.on("input", e);
            b = ["sandbox.js"];
            window.__BAKED_JSREPL_BUILD__ || (b = b.concat(["util/polyfills.js", "util/mtwister.js"]));
            this.sandbox = new p(b, d, {
                output: f,
                input: function () {
                    return m.fire("input", function (a) {
                        return m.sandbox.post({
                            type: "input.write",
                            data: a
                        })
                    })
                },
                error: c,
                result: i,
                progress: h,
                db_input: function () {
                    return m.fire("input", function (a) {
                        m.sandbox.fire("recieved_input", [a]);
                        return g.transaction(function (b) {
                            return b.executeSql("INSERT INTO input (text) VALUES ('" +
                                a + "')", [])
                        })
                    })
                },
                server_input: function () {
                    return m.fire("input", function (a) {
                        var b, c;
                        m.sandbox.fire("recieved_input", [a]);
                        b = (d.url || "/emscripten/input/") + d.input_id;
                        if (d.cors)
                            if (c = new XMLHttpRequest, "withCredentials" in c) c.open("POST", b, true);
                            else if (typeof XDomainRequest !== "undefined" && XDomainRequest !== null) c = new XDomainRequest, c.open("POST", b);
                        else throw Error("CORS not supported on your browser");
                        else c = new XMLHttpRequest, c.open("POST", b, true);
                        return c.send("input=" + a)
                    })
                }
            })
        }
        u(a, h);
        a.prototype.on =
            function (c, b) {
                var g, e, d, f, c = this.makeArray(c);
                f = [];
                for (e = 0, d = c.length; e < d; e++) g = c[e], g === "input" ? f.push(a.__super__.on.call(this, "input", b)) : f.push(this.sandbox.on(g, b));
                return f
        };
        a.prototype.off = function (c, b) {
            var g, e, d, f, c = this.makeArray(c);
            f = [];
            for (e = 0, d = c.length; e < d; e++) g = c[e], g === "input" ? f.push(a.__super__.off.call(this, "input", b)) : f.push(this.sandbox.off(g, b));
            return f
        };
        a.prototype.loadLanguage = function (c, b, g) {
            var e, d;
            typeof b === "function" && (d = [b, void 0], g = d[0], b = d[1]);
            if (a.prototype.Languages.prototype[c] ==
                null) throw Error("Language " + c + " not supported.");
            this.current_lang_name = c;
            this.lang = a.prototype.Languages.prototype[c];
            if (g != null) this.sandbox.once("ready", g);
            return this.sandbox.load(function () {
                var a, b, c, d;
                c = this.lang.scripts;
                d = [];
                for (a = 0, b = c.length; a < b; a++) e = c[a], typeof e === "object" ? d.push(e[s] || e["default"]) : d.push(e);
                return d
            }.call(this).concat([this.lang.engine]), b)
        };
        a.prototype.checkLineEnd = function (a, b) {
            return /\n\s*$/.test(a) ? b(false) : (this.sandbox.once("indent", b), this.sandbox.post({
                type: "getNextLineIndent",
                data: a
            }))
        };
        a.prototype.eval = function (a, b) {
            var g, e, d, f, h, i = this;
            !this.sandbox.workerIsIframe && this.timeout != null && this.timeout.time && this.timeout.callback && (
				f = null, 
				e = function () {
					i.sandbox.fire("timeout");
					return i.timeout.callback() ? h() : f = setTimeout(e, i.timeout.time)
				}, 
				f = setTimeout(e, this.timeout.time), 
				d = function () {
					var a, b;
					2 <= arguments.length ? q.call(arguments, 0, b = arguments.length - 1) : b = 0;
					a = arguments[b++];
					clearTimeout(f);
					if (a === "input") return i.once("recieved_input", function () {
						return f = setTimeout(e, i.timeout.time)
					}),
					g()
				}, 
				g = function () {
					return i.once(["result", "error", "input"], d)
				}, 
				h = function () {
					return i.off(["result", "error", "input"], d)
				}, 
				g());
            if (typeof b === "function") this.once(["result", "error"], function () {
                var a, c, d;
                a = 2 <= arguments.length ? q.call(arguments, 0, d = arguments.length - 1) : (d = 0, []);
                c = arguments[d++];
                return c === "error" ? b(a[0], null) : b(null, a[0])
            });
            return this.sandbox.post({
                type: "engine.Eval",
                data: a
            })
        };
        a.prototype.rawEval = function (a) {
            return this.sandbox.post({
                type: "engine.RawEval",
                data: a
            })
        };
        a.prototype.getLangConfig =
            function (c) {
                return a.prototype.Languages.prototype[c || this.current_lang_name] || null
        };
        return a
    }(k);
    l.prototype.Languages = function () {
        return function () {}
    }();
    l.prototype.__test__ = function () {
        return function () {}
    }();
    l.prototype.__test__.prototype.Loader = o;
    l.prototype.__test__.prototype.EventEmitter = k;
    l.prototype.__test__.prototype.Sandbox = p;
    this.JSREPL = l
}).call(this);
JSREPL.prototype.Languages.prototype = {
    qbasic: {
        system_name: "qbasic",
        name: "Quick Basic",
        extension: "bas",
        matchings: [],
        scripts: [{
            "default": ["engines/qbasic-default.js"]
        }],
        includes: [],
        engine: "langs/qbasic/jsrepl_qbasic.js",
        minifier: "closure"
    },
    scheme: {
        system_name: "scheme",
        name: "Scheme",
        extension: "scm",
        matchings: [
            ["(", ")"],
            ["[", "]"]
        ],
        scripts: [{
            "default": ["engines/scheme-default.js"]
        }],
        includes: [],
        engine: "langs/scheme/jsrepl_scheme.js",
        minifier: "yui"
    },
    javascript: {
        system_name: "javascript",
        name: "JavaScript",
        extension: "js",
        matchings: [
            ["(", ")"],
            ["[", "]"],
            ["{", "}"]
        ],
        scripts: [{
            "default": ["engines/javascript-default.js"]
        }],
        includes: [],
        engine: "langs/javascript/jsrepl_js.js",
        minifier: "closure"
    },
    coffeescript: {
        system_name: "coffeescript",
        name: "CoffeeScript",
        extension: "coffee",
        matchings: [
            ["(", ")"],
            ["[", "]"],
            ["{", "}"]
        ],
        scripts: [{
            "default": ["engines/coffeescript-default.js"]
        }],
        includes: [],
        engine: "langs/coffee-script/jsrepl_coffee.js",
        minifier: "uglify"
    },
    brainfuck: {
        system_name: "brainfuck",
        name: "Brainfuck",
        extension: "bf",
        matchings: [
            ["[", "]"]
        ],
        scripts: [{
            "default": ["engines/brainfuck-default.js"]
        }],
        includes: [],
        engine: "langs/brainfuck/jsrepl_brainfuck.js",
        minifier: "closure"
    },
    unlambda: {
        system_name: "unlambda",
        name: "Unlambda",
        extension: "unl",
        matchings: [],
        scripts: [{
            "default": ["engines/unlambda-default.js"]
        }],
        includes: [],
        engine: "langs/unlambda/jsrepl_unlambda.js",
        minifier: "closure"
    },
    lolcode: {
        system_name: "lolcode",
        name: "LOLCODE",
        extension: "lol",
        matchings: [],
        scripts: [{
            "default": ["engines/lolcode-default.js"]
        }],
        includes: [],
        engine: "langs/lolcode/jsrepl_lolcode.js",
        minifier: "closure"
    },
    kaffeine: {
        system_name: "kaffeine",
        name: "Kaffeine",
        extension: "k",
        matchings: [
            ["(", ")"],
            ["[", "]"],
            ["{", "}"]
        ],
        scripts: [{
            "default": ["engines/kaffeine-default.js"]
        }],
        includes: [],
        engine: "langs/kaffeine/jsrepl_kaffeine.js",
        minifier: "closure"
    },
    move: {
        system_name: "move",
        name: "Move",
        extension: "mv",
        matchings: [
            ["(", ")"],
            ["[", "]"],
            ["{", "}"]
        ],
        scripts: [{
            "default": ["engines/move-default.js"]
        }],
        includes: [],
        engine: "langs/move/jsrepl_move.js",
        minifier: "closure"
    },
    traceur: {
        system_name: "traceur",
        name: "Traceur",
        extension: "js",
        matchings: [
            ["(", ")"],
            ["[", "]"],
            ["{", "}"]
        ],
        scripts: [{
            "default": ["engines/traceur-default.js"]
        }],
        includes: [],
        engine: "langs/traceur/jsrepl_traceur.js",
        minifier: "closure_es5"
    },
    emoticon: {
        system_name: "emoticon",
        name: "Emoticon",
        extension: "emo",
        matchings: [
            ["(", ")"]
        ],
        scripts: [{
            "default": ["engines/emoticon-default.js"]
        }],
        includes: [],
        engine: "langs/emoticon/jsrepl_emoticon.js",
        minifier: "closure"
    },
    bloop: {
        system_name: "bloop",
        name: "Bloop/Floop",
        extensions: "bloop",
        matchings: [],
        scripts: [{
            "default": ["engines/bloop-default.js"]
        }],
        includes: [],
        engine: "langs/bloop/jsrepl_bloop.js",
        minifier: "closure"
    },
    forth: {
        system_name: "forth",
        name: "Forth",
        extensions: "4th",
        matchings: [
            ["(", ")"],
            [":", ";"]
        ],
        scripts: [{
            "default": ["engines/forth-default.js"]
        }],
        includes: [],
        engine: "langs/forth/jsrepl_forth.js",
        minifier: "closure"
    },
    lua: {
        system_name: "lua",
        name: "Lua",
        extension: "lua",
        matchings: [
            ["(", ")"],
            ["[", "]"],
            ["{", "}"]
        ],
        scripts: [{
            "default": ["engines/lua-default.js"]
        }],
        includes: [],
        engine: "langs/lua/jsrepl_lua.js",
        minifier: "none",
        emscripted: true
    },
    python: {
        system_name: "python",
        name: "Python",
        extension: "py",
        matchings: [
            ["(", ")"],
            ["[", "]"],
            ["{", "}"]
        ],
        scripts: [{
            opera: ["engines/python-opera.js"],
            "default": ["engines/python-default.js"]
        }],
        includes: ["extern/python/unclosured", "extern/python/closured", "extern/python/reloop-closured"],
        engine: "langs/python/jsrepl_python.js",
        minifier: "none",
        emscripted: true
    },
    ruby: {
        system_name: "ruby",
        name: "Ruby",
        extension: "rb",
        matchings: [
            ["(", ")"],
            ["[", "]"],
            ["{", "}"]
        ],
        scripts: [{
            opera: ["engines/ruby-opera.js"],
            firefox_3: ["engines/ruby-firefox_3.js"],
            "default": ["engines/ruby-default.js"]
        }],
        includes: ["extern/ruby/dist/lib"],
        engine: "langs/ruby/jsrepl_ruby.js",
        minifier: "none",
        emscripted: true
    },
    roy: {
        system_name: "roy",
        name: "Roy",
        extension: "roy",
        matchings: [
            ["(", ")"],
            ["[", "]"],
            ["{", "}"]
        ],
        scripts: [{
            "default": ["engines/roy-default.js"]
        }],
        includes: [],
        engine: "langs/roy/jsrepl_roy.js",
        minifier: "closure"
    }
};