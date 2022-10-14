var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(e) {
    return typeof e;
} : function(e) {
    return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};

function getDefaultOpts(e) {
    "use strict";
    var r = {
        omitExtraWLInCodeBlocks: {
            defaultValue: false,
            describe: "Omit the default extra whiteline added to code blocks",
            type: "boolean"
        },
        noHeaderId: {
            defaultValue: false,
            describe: "Turn on/off generated header id",
            type: "boolean"
        },
        prefixHeaderId: {
            defaultValue: false,
            describe: "Specify a prefix to generated header ids",
            type: "string"
        },
        headerLevelStart: {
            defaultValue: false,
            describe: "The header blocks level start",
            type: "integer"
        },
        parseImgDimensions: {
            defaultValue: false,
            describe: "Turn on/off image dimension parsing",
            type: "boolean"
        },
        simplifiedAutoLink: {
            defaultValue: false,
            describe: "Turn on/off GFM autolink style",
            type: "boolean"
        },
        literalMidWordUnderscores: {
            defaultValue: false,
            describe: "Parse midword underscores as literal underscores",
            type: "boolean"
        },
        strikethrough: {
            defaultValue: false,
            describe: "Turn on/off strikethrough support",
            type: "boolean"
        },
        tables: {
            defaultValue: false,
            describe: "Turn on/off tables support",
            type: "boolean"
        },
        tablesHeaderId: {
            defaultValue: false,
            describe: "Add an id to table headers",
            type: "boolean"
        },
        ghCodeBlocks: {
            defaultValue: true,
            describe: "Turn on/off GFM fenced code blocks support",
            type: "boolean"
        },
        tasklists: {
            defaultValue: false,
            describe: "Turn on/off GFM tasklist support",
            type: "boolean"
        },
        smoothLivePreview: {
            defaultValue: false,
            describe: "Prevents weird effects in live previews due to incomplete input",
            type: "boolean"
        },
        smartIndentationFix: {
            defaultValue: false,
            description: "Tries to smartly fix identation in es6 strings",
            type: "boolean"
        }
    };
    if (e === false) {
        return JSON.parse(JSON.stringify(r));
    }
    var t = {};
    for (var n in r) {
        if (r.hasOwnProperty(n)) {
            t[n] = r[n].defaultValue;
        }
    }
    return t;
}

var showdown = {}, parsers = {}, extensions = {}, globalOptions = getDefaultOpts(true), flavor = {
    github: {
        omitExtraWLInCodeBlocks: true,
        prefixHeaderId: "user-content-",
        simplifiedAutoLink: true,
        literalMidWordUnderscores: true,
        strikethrough: true,
        tables: true,
        tablesHeaderId: true,
        ghCodeBlocks: true,
        tasklists: true
    },
    vanilla: getDefaultOpts(true)
};

showdown.helper = {};

showdown.extensions = {};

showdown.setOption = function(e, r) {
    "use strict";
    globalOptions[e] = r;
    return this;
};

showdown.getOption = function(e) {
    "use strict";
    return globalOptions[e];
};

showdown.getOptions = function() {
    "use strict";
    return globalOptions;
};

showdown.resetOptions = function() {
    "use strict";
    globalOptions = getDefaultOpts(true);
};

showdown.setFlavor = function(e) {
    "use strict";
    if (flavor.hasOwnProperty(e)) {
        var r = flavor[e];
        for (var t in r) {
            if (r.hasOwnProperty(t)) {
                globalOptions[t] = r[t];
            }
        }
    }
};

showdown.getDefaultOptions = function(e) {
    "use strict";
    return getDefaultOpts(e);
};

showdown.subParser = function(e, r) {
    "use strict";
    if (showdown.helper.isString(e)) {
        if (typeof r !== "undefined") {
            parsers[e] = r;
        } else {
            if (parsers.hasOwnProperty(e)) {
                return parsers[e];
            } else {
                throw Error("SubParser named " + e + " not registered!");
            }
        }
    }
};

showdown.extension = function(e, r) {
    "use strict";
    if (!showdown.helper.isString(e)) {
        throw Error("Extension 'name' must be a string");
    }
    e = showdown.helper.stdExtName(e);
    if (showdown.helper.isUndefined(r)) {
        if (!extensions.hasOwnProperty(e)) {
            throw Error("Extension named " + e + " is not registered!");
        }
        return extensions[e];
    } else {
        if (typeof r === "function") {
            r = r();
        }
        if (!showdown.helper.isArray(r)) {
            r = [ r ];
        }
        var t = validate(r, e);
        if (t.valid) {
            extensions[e] = r;
        } else {
            throw Error(t.error);
        }
    }
};

showdown.getAllExtensions = function() {
    "use strict";
    return extensions;
};

showdown.removeExtension = function(e) {
    "use strict";
    delete extensions[e];
};

showdown.resetExtensions = function() {
    "use strict";
    extensions = {};
};

function validate(e, r) {
    "use strict";
    var t = r ? "Error in " + r + " extension->" : "Error in unnamed extension", n = {
        valid: true,
        error: ""
    };
    if (!showdown.helper.isArray(e)) {
        e = [ e ];
    }
    for (var s = 0; s < e.length; ++s) {
        var o = t + " sub-extension " + s + ": ", a = e[s];
        if ((typeof a === "undefined" ? "undefined" : _typeof(a)) !== "object") {
            n.valid = false;
            n.error = o + "must be an object, but " + (typeof a === "undefined" ? "undefined" : _typeof(a)) + " given";
            return n;
        }
        if (!showdown.helper.isString(a.type)) {
            n.valid = false;
            n.error = o + 'property "type" must be a string, but ' + _typeof(a.type) + " given";
            return n;
        }
        var i = a.type = a.type.toLowerCase();
        if (i === "language") {
            i = a.type = "lang";
        }
        if (i === "html") {
            i = a.type = "output";
        }
        if (i !== "lang" && i !== "output" && i !== "listener") {
            n.valid = false;
            n.error = o + "type " + i + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"';
            return n;
        }
        if (i === "listener") {
            if (showdown.helper.isUndefined(a.listeners)) {
                n.valid = false;
                n.error = o + '. Extensions of type "listener" must have a property called "listeners"';
                return n;
            }
        } else {
            if (showdown.helper.isUndefined(a.filter) && showdown.helper.isUndefined(a.regex)) {
                n.valid = false;
                n.error = o + i + ' extensions must define either a "regex" property or a "filter" method';
                return n;
            }
        }
        if (a.listeners) {
            if (_typeof(a.listeners) !== "object") {
                n.valid = false;
                n.error = o + '"listeners" property must be an object but ' + _typeof(a.listeners) + " given";
                return n;
            }
            for (var l in a.listeners) {
                if (a.listeners.hasOwnProperty(l)) {
                    if (typeof a.listeners[l] !== "function") {
                        n.valid = false;
                        n.error = o + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + l + " must be a function but " + _typeof(a.listeners[l]) + " given";
                        return n;
                    }
                }
            }
        }
        if (a.filter) {
            if (typeof a.filter !== "function") {
                n.valid = false;
                n.error = o + '"filter" must be a function, but ' + _typeof(a.filter) + " given";
                return n;
            }
        } else if (a.regex) {
            if (showdown.helper.isString(a.regex)) {
                a.regex = new RegExp(a.regex, "g");
            }
            if (!a.regex instanceof RegExp) {
                n.valid = false;
                n.error = o + '"regex" property must either be a string or a RegExp object, but ' + _typeof(a.regex) + " given";
                return n;
            }
            if (showdown.helper.isUndefined(a.replace)) {
                n.valid = false;
                n.error = o + '"regex" extensions must implement a replace string or function';
                return n;
            }
        }
    }
    return n;
}

showdown.validateExtension = function(e) {
    "use strict";
    var r = validate(e, null);
    if (!r.valid) {
        console.warn(r.error);
        return false;
    }
    return true;
};

if (!showdown.hasOwnProperty("helper")) {
    showdown.helper = {};
}

showdown.helper.isString = function e(r) {
    "use strict";
    return typeof r === "string" || r instanceof String;
};

showdown.helper.isFunction = function e(r) {
    "use strict";
    var t = {};
    return r && t.toString.call(r) === "[object Function]";
};

showdown.helper.forEach = function e(r, t) {
    "use strict";
    if (typeof r.forEach === "function") {
        r.forEach(t);
    } else {
        for (var n = 0; n < r.length; n++) {
            t(r[n], n, r);
        }
    }
};

showdown.helper.isArray = function e(r) {
    "use strict";
    return r.constructor === Array;
};

showdown.helper.isUndefined = function e(r) {
    "use strict";
    return typeof r === "undefined";
};

showdown.helper.stdExtName = function(e) {
    "use strict";
    return e.replace(/[_-]||\s/g, "").toLowerCase();
};

function escapeCharactersCallback(e, r) {
    "use strict";
    var t = r.charCodeAt(0);
    return "~E" + t + "E";
}

showdown.helper.escapeCharactersCallback = escapeCharactersCallback;

showdown.helper.escapeCharacters = function e(r, t, n) {
    "use strict";
    var s = "([" + t.replace(/([\[\]\\])/g, "\\$1") + "])";
    if (n) {
        s = "\\\\" + s;
    }
    var o = new RegExp(s, "g");
    r = r.replace(o, escapeCharactersCallback);
    return r;
};

var rgxFindMatchPos = function e(r, t, n, s) {
    "use strict";
    var o = s || "", a = o.indexOf("g") > -1, i = new RegExp(t + "|" + n, "g" + o.replace(/g/g, "")), l = new RegExp(t, o.replace(/g/g, "")), u = [], c, h, d, f, p;
    do {
        c = 0;
        while (d = i.exec(r)) {
            if (l.test(d[0])) {
                if (!c++) {
                    h = i.lastIndex;
                    f = h - d[0].length;
                }
            } else if (c) {
                if (!--c) {
                    p = d.index + d[0].length;
                    var w = {
                        left: {
                            start: f,
                            end: h
                        },
                        match: {
                            start: h,
                            end: d.index
                        },
                        right: {
                            start: d.index,
                            end: p
                        },
                        wholeMatch: {
                            start: f,
                            end: p
                        }
                    };
                    u.push(w);
                    if (!a) {
                        return u;
                    }
                }
            }
        }
    } while (c && (i.lastIndex = h));
    return u;
};

showdown.helper.matchRecursiveRegExp = function(e, r, t, n) {
    "use strict";
    var s = rgxFindMatchPos(e, r, t, n), o = [];
    for (var a = 0; a < s.length; ++a) {
        o.push([ e.slice(s[a].wholeMatch.start, s[a].wholeMatch.end), e.slice(s[a].match.start, s[a].match.end), e.slice(s[a].left.start, s[a].left.end), e.slice(s[a].right.start, s[a].right.end) ]);
    }
    return o;
};

showdown.helper.replaceRecursiveRegExp = function(e, r, t, n, s) {
    "use strict";
    if (!showdown.helper.isFunction(r)) {
        var o = r;
        r = function e() {
            return o;
        };
    }
    var a = rgxFindMatchPos(e, t, n, s), i = e, l = a.length;
    if (l > 0) {
        var u = [];
        if (a[0].wholeMatch.start !== 0) {
            u.push(e.slice(0, a[0].wholeMatch.start));
        }
        for (var c = 0; c < l; ++c) {
            u.push(r(e.slice(a[c].wholeMatch.start, a[c].wholeMatch.end), e.slice(a[c].match.start, a[c].match.end), e.slice(a[c].left.start, a[c].left.end), e.slice(a[c].right.start, a[c].right.end)));
            if (c < l - 1) {
                u.push(e.slice(a[c].wholeMatch.end, a[c + 1].wholeMatch.start));
            }
        }
        if (a[l - 1].wholeMatch.end < e.length) {
            u.push(e.slice(a[l - 1].wholeMatch.end));
        }
        i = u.join("");
    }
    return i;
};

if (showdown.helper.isUndefined(console)) {
    console = {
        warn: function e(r) {
            "use strict";
            alert(r);
        },
        log: function e(r) {
            "use strict";
            alert(r);
        },
        error: function e(r) {
            "use strict";
            throw r;
        }
    };
}

showdown.Converter = function(e) {
    "use strict";
    var r = {}, t = [], n = [], s = {};
    o();
    function o() {
        e = e || {};
        for (var t in globalOptions) {
            if (globalOptions.hasOwnProperty(t)) {
                r[t] = globalOptions[t];
            }
        }
        if ((typeof e === "undefined" ? "undefined" : _typeof(e)) === "object") {
            for (var n in e) {
                if (e.hasOwnProperty(n)) {
                    r[n] = e[n];
                }
            }
        } else {
            throw Error("Converter expects the passed parameter to be an object, but " + (typeof e === "undefined" ? "undefined" : _typeof(e)) + " was passed instead.");
        }
        if (r.extensions) {
            showdown.helper.forEach(r.extensions, a);
        }
    }
    function a(e, r) {
        r = r || null;
        if (showdown.helper.isString(e)) {
            e = showdown.helper.stdExtName(e);
            r = e;
            if (showdown.extensions[e]) {
                console.warn("DEPRECATION WARNING: " + e + " is an old extension that uses a deprecated loading method." + "Please inform the developer that the extension should be updated!");
                i(showdown.extensions[e], e);
                return;
            } else if (!showdown.helper.isUndefined(extensions[e])) {
                e = extensions[e];
            } else {
                throw Error('Extension "' + e + '" could not be loaded. It was either not found or is not a valid extension.');
            }
        }
        if (typeof e === "function") {
            e = e();
        }
        if (!showdown.helper.isArray(e)) {
            e = [ e ];
        }
        var o = validate(e, r);
        if (!o.valid) {
            throw Error(o.error);
        }
        for (var a = 0; a < e.length; ++a) {
            switch (e[a].type) {
              case "lang":
                t.push(e[a]);
                break;

              case "output":
                n.push(e[a]);
                break;
            }
            if (e[a].hasOwnProperty(s)) {
                for (var u in e[a].listeners) {
                    if (e[a].listeners.hasOwnProperty(u)) {
                        l(u, e[a].listeners[u]);
                    }
                }
            }
        }
    }
    function i(e, r) {
        if (typeof e === "function") {
            e = e(new showdown.Converter());
        }
        if (!showdown.helper.isArray(e)) {
            e = [ e ];
        }
        var s = validate(e, r);
        if (!s.valid) {
            throw Error(s.error);
        }
        for (var o = 0; o < e.length; ++o) {
            switch (e[o].type) {
              case "lang":
                t.push(e[o]);
                break;

              case "output":
                n.push(e[o]);
                break;

              default:
                throw Error("Extension loader error: Type unrecognized!!!");
            }
        }
    }
    function l(e, r) {
        if (!showdown.helper.isString(e)) {
            throw Error("Invalid argument in converter.listen() method: name must be a string, but " + (typeof e === "undefined" ? "undefined" : _typeof(e)) + " given");
        }
        if (typeof r !== "function") {
            throw Error("Invalid argument in converter.listen() method: callback must be a function, but " + (typeof r === "undefined" ? "undefined" : _typeof(r)) + " given");
        }
        if (!s.hasOwnProperty(e)) {
            s[e] = [];
        }
        s[e].push(r);
    }
    function u(e) {
        var r = e.match(/^\s*/)[0].length, t = new RegExp("^\\s{0," + r + "}", "gm");
        return e.replace(t, "");
    }
    this._dispatch = function e(r, t, n, o) {
        if (s.hasOwnProperty(r)) {
            for (var a = 0; a < s[r].length; ++a) {
                var i = s[r][a](r, t, this, n, o);
                if (i && typeof i !== "undefined") {
                    t = i;
                }
            }
        }
        return t;
    };
    this.listen = function(e, r) {
        l(e, r);
        return this;
    };
    this.makeHtml = function(e) {
        if (!e) {
            return e;
        }
        var s = {
            gHtmlBlocks: [],
            gHtmlMdBlocks: [],
            gHtmlSpans: [],
            gUrls: {},
            gTitles: {},
            gDimensions: {},
            gListLevel: 0,
            hashLinkCounts: {},
            langExtensions: t,
            outputModifiers: n,
            converter: this,
            ghCodeBlocks: []
        };
        e = e.replace(/~/g, "~T");
        e = e.replace(/\$/g, "~D");
        e = e.replace(/\r\n/g, "\n");
        e = e.replace(/\r/g, "\n");
        if (r.smartIndentationFix) {
            e = u(e);
        }
        e = e;
        e = showdown.subParser("detab")(e, r, s);
        e = showdown.subParser("stripBlankLines")(e, r, s);
        showdown.helper.forEach(t, function(t) {
            e = showdown.subParser("runExtension")(t, e, r, s);
        });
        e = showdown.subParser("hashPreCodeTags")(e, r, s);
        e = showdown.subParser("githubCodeBlocks")(e, r, s);
        e = showdown.subParser("hashHTMLBlocks")(e, r, s);
        e = showdown.subParser("hashHTMLSpans")(e, r, s);
        e = showdown.subParser("stripLinkDefinitions")(e, r, s);
        e = showdown.subParser("blockGamut")(e, r, s);
        e = showdown.subParser("unhashHTMLSpans")(e, r, s);
        e = showdown.subParser("unescapeSpecialChars")(e, r, s);
        e = e.replace(/~D/g, "$$");
        e = e.replace(/~T/g, "~");
        showdown.helper.forEach(n, function(t) {
            e = showdown.subParser("runExtension")(t, e, r, s);
        });
        return e;
    };
    this.setOption = function(e, t) {
        r[e] = t;
    };
    this.getOption = function(e) {
        return r[e];
    };
    this.getOptions = function() {
        return r;
    };
    this.addExtension = function(e, r) {
        r = r || null;
        a(e, r);
    };
    this.useExtension = function(e) {
        a(e);
    };
    this.setFlavor = function(e) {
        if (flavor.hasOwnProperty(e)) {
            var t = flavor[e];
            for (var n in t) {
                if (t.hasOwnProperty(n)) {
                    r[n] = t[n];
                }
            }
        }
    };
    this.removeExtension = function(e) {
        if (!showdown.helper.isArray(e)) {
            e = [ e ];
        }
        for (var r = 0; r < e.length; ++r) {
            var s = e[r];
            for (var o = 0; o < t.length; ++o) {
                if (t[o] === s) {
                    t[o].splice(o, 1);
                }
            }
            for (var a = 0; a < n.length; ++o) {
                if (n[a] === s) {
                    n[a].splice(o, 1);
                }
            }
        }
    };
    this.getAllExtensions = function() {
        return {
            language: t,
            output: n
        };
    };
};

showdown.subParser("anchors", function(e, r, t) {
    "use strict";
    e = t.converter._dispatch("anchors.before", e, r, t);
    var n = function e(r, n, s, o, a, i, l, u) {
        if (showdown.helper.isUndefined(u)) {
            u = "";
        }
        r = n;
        var c = s, h = o.toLowerCase(), d = a, f = u;
        if (!d) {
            if (!h) {
                h = c.toLowerCase().replace(/ ?\n/g, " ");
            }
            d = "#" + h;
            if (!showdown.helper.isUndefined(t.gUrls[h])) {
                d = t.gUrls[h];
                if (!showdown.helper.isUndefined(t.gTitles[h])) {
                    f = t.gTitles[h];
                }
            } else {
                if (r.search(/\(\s*\)$/m) > -1) {
                    d = "";
                } else {
                    return r;
                }
            }
        }
        d = showdown.helper.escapeCharacters(d, "*_", false);
        var p = '<a href="' + d + '"';
        if (f !== "" && f !== null) {
            f = f.replace(/"/g, "&quot;");
            f = showdown.helper.escapeCharacters(f, "*_", false);
            p += ' title="' + f + '"';
        }
        p += ">" + c + "</a>";
        return p;
    };
    e = e.replace(/(\[((?:\[[^\]]*]|[^\[\]])*)][ ]?(?:\n[ ]*)?\[(.*?)])()()()()/g, n);
    e = e.replace(/(\[((?:\[[^\]]*]|[^\[\]])*)]\([ \t]*()<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, n);
    e = e.replace(/(\[([^\[\]]+)])()()()()()/g, n);
    e = t.converter._dispatch("anchors.after", e, r, t);
    return e;
});

showdown.subParser("autoLinks", function(e, r, t) {
    "use strict";
    e = t.converter._dispatch("autoLinks.before", e, r, t);
    var n = /\b(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+)(?=\s|$)(?!["<>])/gi, s = /<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)>/gi, o = /(?:^|[ \n\t])([A-Za-z0-9!#$%&'*+-/=?^_`\{|}~\.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?:$|[ \n\t])/gi, a = /<(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi;
    e = e.replace(s, i);
    e = e.replace(a, l);
    if (r.simplifiedAutoLink) {
        e = e.replace(n, i);
        e = e.replace(o, l);
    }
    function i(e, r) {
        var t = r;
        if (/^www\./i.test(r)) {
            r = r.replace(/^www\./i, "http://www.");
        }
        return '<a href="' + r + '">' + t + "</a>";
    }
    function l(e, r) {
        var t = showdown.subParser("unescapeSpecialChars")(r);
        return showdown.subParser("encodeEmailAddress")(t);
    }
    e = t.converter._dispatch("autoLinks.after", e, r, t);
    return e;
});

showdown.subParser("blockGamut", function(e, r, t) {
    "use strict";
    e = t.converter._dispatch("blockGamut.before", e, r, t);
    e = showdown.subParser("blockQuotes")(e, r, t);
    e = showdown.subParser("headers")(e, r, t);
    var n = showdown.subParser("hashBlock")("<hr />", r, t);
    e = e.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, n);
    e = e.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm, n);
    e = e.replace(/^[ ]{0,2}([ ]?_[ ]?){3,}[ \t]*$/gm, n);
    e = showdown.subParser("lists")(e, r, t);
    e = showdown.subParser("codeBlocks")(e, r, t);
    e = showdown.subParser("tables")(e, r, t);
    e = showdown.subParser("hashHTMLBlocks")(e, r, t);
    e = showdown.subParser("paragraphs")(e, r, t);
    e = t.converter._dispatch("blockGamut.after", e, r, t);
    return e;
});

showdown.subParser("blockQuotes", function(e, r, t) {
    "use strict";
    e = t.converter._dispatch("blockQuotes.before", e, r, t);
    e = e.replace(/((^[ \t]{0,3}>[ \t]?.+\n(.+\n)*\n*)+)/gm, function(e, n) {
        var s = n;
        s = s.replace(/^[ \t]*>[ \t]?/gm, "~0");
        s = s.replace(/~0/g, "");
        s = s.replace(/^[ \t]+$/gm, "");
        s = showdown.subParser("githubCodeBlocks")(s, r, t);
        s = showdown.subParser("blockGamut")(s, r, t);
        s = s.replace(/(^|\n)/g, "$1  ");
        s = s.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(e, r) {
            var t = r;
            t = t.replace(/^  /gm, "~0");
            t = t.replace(/~0/g, "");
            return t;
        });
        return showdown.subParser("hashBlock")("<blockquote>\n" + s + "\n</blockquote>", r, t);
    });
    e = t.converter._dispatch("blockQuotes.after", e, r, t);
    return e;
});

showdown.subParser("codeBlocks", function(e, r, t) {
    "use strict";
    e = t.converter._dispatch("codeBlocks.before", e, r, t);
    e += "~0";
    var n = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g;
    e = e.replace(n, function(e, n, s) {
        var o = n, a = s, i = "\n";
        o = showdown.subParser("outdent")(o);
        o = showdown.subParser("encodeCode")(o);
        o = showdown.subParser("detab")(o);
        o = o.replace(/^\n+/g, "");
        o = o.replace(/\n+$/g, "");
        if (r.omitExtraWLInCodeBlocks) {
            i = "";
        }
        o = "<pre><code>" + o + i + "</code></pre>";
        return showdown.subParser("hashBlock")(o, r, t) + a;
    });
    e = e.replace(/~0/, "");
    e = t.converter._dispatch("codeBlocks.after", e, r, t);
    return e;
});

showdown.subParser("codeSpans", function(e, r, t) {
    "use strict";
    e = t.converter._dispatch("codeSpans.before", e, r, t);
    if (typeof e === "undefined") {
        e = "";
    }
    e = e.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm, function(e, r, t, n) {
        var s = n;
        s = s.replace(/^([ \t]*)/g, "");
        s = s.replace(/[ \t]*$/g, "");
        s = showdown.subParser("encodeCode")(s);
        return r + "<code>" + s + "</code>";
    });
    e = t.converter._dispatch("codeSpans.after", e, r, t);
    return e;
});

showdown.subParser("detab", function(e) {
    "use strict";
    e = e.replace(/\t(?=\t)/g, "    ");
    e = e.replace(/\t/g, "~A~B");
    e = e.replace(/~B(.+?)~A/g, function(e, r) {
        var t = r, n = 4 - t.length % 4;
        for (var s = 0; s < n; s++) {
            t += " ";
        }
        return t;
    });
    e = e.replace(/~A/g, "    ");
    e = e.replace(/~B/g, "");
    return e;
});

showdown.subParser("encodeAmpsAndAngles", function(e) {
    "use strict";
    e = e.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;");
    e = e.replace(/<(?![a-z\/?\$!])/gi, "&lt;");
    return e;
});

showdown.subParser("encodeBackslashEscapes", function(e) {
    "use strict";
    e = e.replace(/\\(\\)/g, showdown.helper.escapeCharactersCallback);
    e = e.replace(/\\([`*_{}\[\]()>#+-.!])/g, showdown.helper.escapeCharactersCallback);
    return e;
});

showdown.subParser("encodeCode", function(e) {
    "use strict";
    e = e.replace(/&/g, "&amp;");
    e = e.replace(/</g, "&lt;");
    e = e.replace(/>/g, "&gt;");
    e = showdown.helper.escapeCharacters(e, "*_{}[]\\", false);
    return e;
});

showdown.subParser("encodeEmailAddress", function(e) {
    "use strict";
    var r = [ function(e) {
        return "&#" + e.charCodeAt(0) + ";";
    }, function(e) {
        return "&#x" + e.charCodeAt(0).toString(16) + ";";
    }, function(e) {
        return e;
    } ];
    e = "mailto:" + e;
    e = e.replace(/./g, function(e) {
        if (e === "@") {
            e = r[Math.floor(Math.random() * 2)](e);
        } else if (e !== ":") {
            var t = Math.random();
            e = t > .9 ? r[2](e) : t > .45 ? r[1](e) : r[0](e);
        }
        return e;
    });
    e = '<a href="' + e + '">' + e + "</a>";
    e = e.replace(/">.+:/g, '">');
    return e;
});

showdown.subParser("escapeSpecialCharsWithinTagAttributes", function(e) {
    "use strict";
    var r = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;
    e = e.replace(r, function(e) {
        var r = e.replace(/(.)<\/?code>(?=.)/g, "$1`");
        r = showdown.helper.escapeCharacters(r, "\\`*_", false);
        return r;
    });
    return e;
});

showdown.subParser("githubCodeBlocks", function(e, r, t) {
    "use strict";
    if (!r.ghCodeBlocks) {
        return e;
    }
    e = t.converter._dispatch("githubCodeBlocks.before", e, r, t);
    e += "~0";
    e = e.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g, function(e, n, s) {
        var o = r.omitExtraWLInCodeBlocks ? "" : "\n";
        s = showdown.subParser("encodeCode")(s);
        s = showdown.subParser("detab")(s);
        s = s.replace(/^\n+/g, "");
        s = s.replace(/\n+$/g, "");
        s = "<pre><code" + (n ? ' class="' + n + " language-" + n + '"' : "") + ">" + s + o + "</code></pre>";
        s = showdown.subParser("hashBlock")(s, r, t);
        return "\n\n~G" + (t.ghCodeBlocks.push({
            text: e,
            codeblock: s
        }) - 1) + "G\n\n";
    });
    e = e.replace(/~0/, "");
    return t.converter._dispatch("githubCodeBlocks.after", e, r, t);
});

showdown.subParser("hashBlock", function(e, r, t) {
    "use strict";
    e = e.replace(/(^\n+|\n+$)/g, "");
    return "\n\n~K" + (t.gHtmlBlocks.push(e) - 1) + "K\n\n";
});

showdown.subParser("hashElement", function(e, r, t) {
    "use strict";
    return function(e, r) {
        var n = r;
        n = n.replace(/\n\n/g, "\n");
        n = n.replace(/^\n/, "");
        n = n.replace(/\n+$/g, "");
        n = "\n\n~K" + (t.gHtmlBlocks.push(n) - 1) + "K\n\n";
        return n;
    };
});

showdown.subParser("hashHTMLBlocks", function(e, r, t) {
    "use strict";
    var n = [ "pre", "div", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "table", "dl", "ol", "ul", "script", "noscript", "form", "fieldset", "iframe", "math", "style", "section", "header", "footer", "nav", "article", "aside", "address", "audio", "canvas", "figure", "hgroup", "output", "video", "p" ], s = function e(r, n, s, o) {
        var a = r;
        if (s.search(/\bmarkdown\b/) !== -1) {
            a = s + t.converter.makeHtml(n) + o;
        }
        return "\n\n~K" + (t.gHtmlBlocks.push(a) - 1) + "K\n\n";
    };
    for (var o = 0; o < n.length; ++o) {
        e = showdown.helper.replaceRecursiveRegExp(e, s, "^(?: |\\t){0,3}<" + n[o] + "\\b[^>]*>", "</" + n[o] + ">", "gim");
    }
    e = e.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g, showdown.subParser("hashElement")(e, r, t));
    e = e.replace(/(<!--[\s\S]*?-->)/g, showdown.subParser("hashElement")(e, r, t));
    e = e.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g, showdown.subParser("hashElement")(e, r, t));
    return e;
});

showdown.subParser("hashHTMLSpans", function(e, r, t) {
    "use strict";
    var n = showdown.helper.matchRecursiveRegExp(e, "<code\\b[^>]*>", "</code>", "gi");
    for (var s = 0; s < n.length; ++s) {
        e = e.replace(n[s][0], "~L" + (t.gHtmlSpans.push(n[s][0]) - 1) + "L");
    }
    return e;
});

showdown.subParser("unhashHTMLSpans", function(e, r, t) {
    "use strict";
    for (var n = 0; n < t.gHtmlSpans.length; ++n) {
        e = e.replace("~L" + n + "L", t.gHtmlSpans[n]);
    }
    return e;
});

showdown.subParser("hashPreCodeTags", function(e, r, t) {
    "use strict";
    var n = function e(r, n, s, o) {
        var a = s + showdown.subParser("encodeCode")(n) + o;
        return "\n\n~G" + (t.ghCodeBlocks.push({
            text: r,
            codeblock: a
        }) - 1) + "G\n\n";
    };
    e = showdown.helper.replaceRecursiveRegExp(e, n, "^(?: |\\t){0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>", "^(?: |\\t){0,3}</code>\\s*</pre>", "gim");
    return e;
});

showdown.subParser("headers", function(e, r, t) {
    "use strict";
    e = t.converter._dispatch("headers.before", e, r, t);
    var n = r.prefixHeaderId, s = isNaN(parseInt(r.headerLevelStart)) ? 1 : parseInt(r.headerLevelStart), o = r.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm, a = r.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;
    e = e.replace(o, function(e, n) {
        var o = showdown.subParser("spanGamut")(n, r, t), a = r.noHeaderId ? "" : ' id="' + i(n) + '"', l = s, u = "<h" + l + a + ">" + o + "</h" + l + ">";
        return showdown.subParser("hashBlock")(u, r, t);
    });
    e = e.replace(a, function(e, n) {
        var o = showdown.subParser("spanGamut")(n, r, t), a = r.noHeaderId ? "" : ' id="' + i(n) + '"', l = s + 1, u = "<h" + l + a + ">" + o + "</h" + l + ">";
        return showdown.subParser("hashBlock")(u, r, t);
    });
    e = e.replace(/^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm, function(e, n, o) {
        var a = showdown.subParser("spanGamut")(o, r, t), l = r.noHeaderId ? "" : ' id="' + i(o) + '"', u = s - 1 + n.length, c = "<h" + u + l + ">" + a + "</h" + u + ">";
        return showdown.subParser("hashBlock")(c, r, t);
    });
    function i(e) {
        var r, s = e.replace(/[^\w]/g, "").toLowerCase();
        if (t.hashLinkCounts[s]) {
            r = s + "-" + t.hashLinkCounts[s]++;
        } else {
            r = s;
            t.hashLinkCounts[s] = 1;
        }
        if (n === true) {
            n = "section";
        }
        if (showdown.helper.isString(n)) {
            return n + r;
        }
        return r;
    }
    e = t.converter._dispatch("headers.after", e, r, t);
    return e;
});

showdown.subParser("images", function(e, r, t) {
    "use strict";
    e = t.converter._dispatch("images.before", e, r, t);
    var n = /!\[(.*?)]\s?\([ \t]*()<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(['"])(.*?)\6[ \t]*)?\)/g, s = /!\[([^\]]*?)] ?(?:\n *)?\[(.*?)]()()()()()/g;
    function o(e, r, n, s, o, a, i, l) {
        var u = t.gUrls, c = t.gTitles, h = t.gDimensions;
        n = n.toLowerCase();
        if (!l) {
            l = "";
        }
        if (s === "" || s === null) {
            if (n === "" || n === null) {
                n = r.toLowerCase().replace(/ ?\n/g, " ");
            }
            s = "#" + n;
            if (!showdown.helper.isUndefined(u[n])) {
                s = u[n];
                if (!showdown.helper.isUndefined(c[n])) {
                    l = c[n];
                }
                if (!showdown.helper.isUndefined(h[n])) {
                    o = h[n].width;
                    a = h[n].height;
                }
            } else {
                return e;
            }
        }
        r = r.replace(/"/g, "&quot;");
        r = showdown.helper.escapeCharacters(r, "*_", false);
        s = showdown.helper.escapeCharacters(s, "*_", false);
        var d = '<img src="' + s + '" alt="' + r + '"';
        if (l) {
            l = l.replace(/"/g, "&quot;");
            l = showdown.helper.escapeCharacters(l, "*_", false);
            d += ' title="' + l + '"';
        }
        if (o && a) {
            o = o === "*" ? "auto" : o;
            a = a === "*" ? "auto" : a;
            d += ' width="' + o + '"';
            d += ' height="' + a + '"';
        }
        d += " />";
        return d;
    }
    e = e.replace(s, o);
    e = e.replace(n, o);
    e = t.converter._dispatch("images.after", e, r, t);
    return e;
});

showdown.subParser("italicsAndBold", function(e, r, t) {
    "use strict";
    e = t.converter._dispatch("italicsAndBold.before", e, r, t);
    if (r.literalMidWordUnderscores) {
        e = e.replace(/(^|\s|>|\b)__(?=\S)([\s\S]+?)__(?=\b|<|\s|$)/gm, "$1<strong>$2</strong>");
        e = e.replace(/(^|\s|>|\b)_(?=\S)([\s\S]+?)_(?=\b|<|\s|$)/gm, "$1<em>$2</em>");
        e = e.replace(/(\*\*)(?=\S)([^\r]*?\S[*]*)\1/g, "<strong>$2</strong>");
        e = e.replace(/(\*)(?=\S)([^\r]*?\S)\1/g, "<em>$2</em>");
    } else {
        e = e.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, "<strong>$2</strong>");
        e = e.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g, "<em>$2</em>");
    }
    e = t.converter._dispatch("italicsAndBold.after", e, r, t);
    return e;
});

showdown.subParser("lists", function(e, r, t) {
    "use strict";
    e = t.converter._dispatch("lists.before", e, r, t);
    function n(e, n) {
        t.gListLevel++;
        e = e.replace(/\n{2,}$/, "\n");
        e += "~0";
        var s = /(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm, o = /\n[ \t]*\n(?!~0)/.test(e);
        e = e.replace(s, function(e, n, s, a, i, l, u) {
            u = u && u.trim() !== "";
            var c = showdown.subParser("outdent")(i, r, t), h = "";
            if (l && r.tasklists) {
                h = ' class="task-list-item" style="list-style-type: none;"';
                c = c.replace(/^[ \t]*\[(x|X| )?]/m, function() {
                    var e = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
                    if (u) {
                        e += " checked";
                    }
                    e += ">";
                    return e;
                });
            }
            if (n || c.search(/\n{2,}/) > -1) {
                c = showdown.subParser("githubCodeBlocks")(c, r, t);
                c = showdown.subParser("blockGamut")(c, r, t);
            } else {
                c = showdown.subParser("lists")(c, r, t);
                c = c.replace(/\n$/, "");
                if (o) {
                    c = showdown.subParser("paragraphs")(c, r, t);
                } else {
                    c = showdown.subParser("spanGamut")(c, r, t);
                }
            }
            c = "\n<li" + h + ">" + c + "</li>\n";
            return c;
        });
        e = e.replace(/~0/g, "");
        t.gListLevel--;
        if (n) {
            e = e.replace(/\s+$/, "");
        }
        return e;
    }
    function s(e, r, t) {
        var s = r === "ul" ? /^ {0,2}\d+\.[ \t]/gm : /^ {0,2}[*+-][ \t]/gm, o = [], a = "";
        if (e.search(s) !== -1) {
            (function e(o) {
                var i = o.search(s);
                if (i !== -1) {
                    a += "\n\n<" + r + ">" + n(o.slice(0, i), !!t) + "</" + r + ">\n\n";
                    r = r === "ul" ? "ol" : "ul";
                    s = r === "ul" ? /^ {0,2}\d+\.[ \t]/gm : /^ {0,2}[*+-][ \t]/gm;
                    e(o.slice(i));
                } else {
                    a += "\n\n<" + r + ">" + n(o, !!t) + "</" + r + ">\n\n";
                }
            })(e);
            for (var i = 0; i < o.length; ++i) {}
        } else {
            a = "\n\n<" + r + ">" + n(e, !!t) + "</" + r + ">\n\n";
        }
        return a;
    }
    e += "~0";
    var o = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
    if (t.gListLevel) {
        e = e.replace(o, function(e, r, t) {
            var n = t.search(/[*+-]/g) > -1 ? "ul" : "ol";
            return s(r, n, true);
        });
    } else {
        o = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
        e = e.replace(o, function(e, r, t, n) {
            var o = n.search(/[*+-]/g) > -1 ? "ul" : "ol";
            return s(t, o);
        });
    }
    e = e.replace(/~0/, "");
    e = t.converter._dispatch("lists.after", e, r, t);
    return e;
});

showdown.subParser("outdent", function(e) {
    "use strict";
    e = e.replace(/^(\t|[ ]{1,4})/gm, "~0");
    e = e.replace(/~0/g, "");
    return e;
});

showdown.subParser("paragraphs", function(e, r, t) {
    "use strict";
    e = t.converter._dispatch("paragraphs.before", e, r, t);
    e = e.replace(/^\n+/g, "");
    e = e.replace(/\n+$/g, "");
    var n = e.split(/\n{2,}/g), s = [], o = n.length;
    for (var a = 0; a < o; a++) {
        var i = n[a];
        if (i.search(/~(K|G)(\d+)\1/g) >= 0) {
            s.push(i);
        } else {
            i = showdown.subParser("spanGamut")(i, r, t);
            i = i.replace(/^([ \t]*)/g, "<p>");
            i += "</p>";
            s.push(i);
        }
    }
    o = s.length;
    for (a = 0; a < o; a++) {
        var l = "", u = s[a], c = false;
        while (u.search(/~(K|G)(\d+)\1/) >= 0) {
            var h = RegExp.$1, d = RegExp.$2;
            if (h === "K") {
                l = t.gHtmlBlocks[d];
            } else {
                if (c) {
                    l = showdown.subParser("encodeCode")(t.ghCodeBlocks[d].text);
                } else {
                    l = t.ghCodeBlocks[d].codeblock;
                }
            }
            l = l.replace(/\$/g, "$$$$");
            u = u.replace(/(\n\n)?~(K|G)\d+\2(\n\n)?/, l);
            if (/^<pre\b[^>]*>\s*<code\b[^>]*>/.test(u)) {
                c = true;
            }
        }
        s[a] = u;
    }
    e = s.join("\n\n");
    e = e.replace(/^\n+/g, "");
    e = e.replace(/\n+$/g, "");
    return t.converter._dispatch("paragraphs.after", e, r, t);
});

showdown.subParser("runExtension", function(e, r, t, n) {
    "use strict";
    if (e.filter) {
        r = e.filter(r, n.converter, t);
    } else if (e.regex) {
        var s = e.regex;
        if (!s instanceof RegExp) {
            s = new RegExp(s, "g");
        }
        r = r.replace(s, e.replace);
    }
    return r;
});

showdown.subParser("spanGamut", function(e, r, t) {
    "use strict";
    e = t.converter._dispatch("spanGamut.before", e, r, t);
    e = showdown.subParser("codeSpans")(e, r, t);
    e = showdown.subParser("escapeSpecialCharsWithinTagAttributes")(e, r, t);
    e = showdown.subParser("encodeBackslashEscapes")(e, r, t);
    e = showdown.subParser("images")(e, r, t);
    e = showdown.subParser("anchors")(e, r, t);
    e = showdown.subParser("autoLinks")(e, r, t);
    e = showdown.subParser("encodeAmpsAndAngles")(e, r, t);
    e = showdown.subParser("italicsAndBold")(e, r, t);
    e = showdown.subParser("strikethrough")(e, r, t);
    e = e.replace(/  +\n/g, " <br />\n");
    e = t.converter._dispatch("spanGamut.after", e, r, t);
    return e;
});

showdown.subParser("strikethrough", function(e, r, t) {
    "use strict";
    if (r.strikethrough) {
        e = t.converter._dispatch("strikethrough.before", e, r, t);
        e = e.replace(/(?:~T){2}([\s\S]+?)(?:~T){2}/g, "<del>$1</del>");
        e = t.converter._dispatch("strikethrough.after", e, r, t);
    }
    return e;
});

showdown.subParser("stripBlankLines", function(e) {
    "use strict";
    return e.replace(/^[ \t]+$/gm, "");
});

showdown.subParser("stripLinkDefinitions", function(e, r, t) {
    "use strict";
    var n = /^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=~0))/gm;
    e += "~0";
    e = e.replace(n, function(e, n, s, o, a, i, l) {
        n = n.toLowerCase();
        t.gUrls[n] = showdown.subParser("encodeAmpsAndAngles")(s);
        if (i) {
            return i + l;
        } else {
            if (l) {
                t.gTitles[n] = l.replace(/"|'/g, "&quot;");
            }
            if (r.parseImgDimensions && o && a) {
                t.gDimensions[n] = {
                    width: o,
                    height: a
                };
            }
        }
        return "";
    });
    e = e.replace(/~0/, "");
    return e;
});

showdown.subParser("tables", function(e, r, t) {
    "use strict";
    if (!r.tables) {
        return e;
    }
    var n = /^[ \t]{0,3}\|?.+\|.+\n[ \t]{0,3}\|?[ \t]*:?[ \t]*(?:-|=){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:-|=){2,}[\s\S]+?(?:\n\n|~0)/gm;
    function s(e) {
        if (/^:[ \t]*--*$/.test(e)) {
            return ' style="text-align:left;"';
        } else if (/^--*[ \t]*:[ \t]*$/.test(e)) {
            return ' style="text-align:right;"';
        } else if (/^:[ \t]*--*[ \t]*:$/.test(e)) {
            return ' style="text-align:center;"';
        } else {
            return "";
        }
    }
    function o(e, n) {
        var s = "";
        e = e.trim();
        if (r.tableHeaderId) {
            s = ' id="' + e.replace(/ /g, "_").toLowerCase() + '"';
        }
        e = showdown.subParser("spanGamut")(e, r, t);
        return "<th" + s + n + ">" + e + "</th>\n";
    }
    function a(e, n) {
        var s = showdown.subParser("spanGamut")(e, r, t);
        return "<td" + n + ">" + s + "</td>\n";
    }
    function i(e, r) {
        var t = "<table>\n<thead>\n<tr>\n", n = e.length;
        for (var s = 0; s < n; ++s) {
            t += e[s];
        }
        t += "</tr>\n</thead>\n<tbody>\n";
        for (s = 0; s < r.length; ++s) {
            t += "<tr>\n";
            for (var o = 0; o < n; ++o) {
                t += r[s][o];
            }
            t += "</tr>\n";
        }
        t += "</tbody>\n</table>\n";
        return t;
    }
    e = t.converter._dispatch("tables.before", e, r, t);
    e = e.replace(n, function(e) {
        var r, t = e.split("\n");
        for (r = 0; r < t.length; ++r) {
            if (/^[ \t]{0,3}\|/.test(t[r])) {
                t[r] = t[r].replace(/^[ \t]{0,3}\|/, "");
            }
            if (/\|[ \t]*$/.test(t[r])) {
                t[r] = t[r].replace(/\|[ \t]*$/, "");
            }
        }
        var n = t[0].split("|").map(function(e) {
            return e.trim();
        }), l = t[1].split("|").map(function(e) {
            return e.trim();
        }), u = [], c = [], h = [], d = [];
        t.shift();
        t.shift();
        for (r = 0; r < t.length; ++r) {
            if (t[r].trim() === "") {
                continue;
            }
            u.push(t[r].split("|").map(function(e) {
                return e.trim();
            }));
        }
        if (n.length < l.length) {
            return e;
        }
        for (r = 0; r < l.length; ++r) {
            h.push(s(l[r]));
        }
        for (r = 0; r < n.length; ++r) {
            if (showdown.helper.isUndefined(h[r])) {
                h[r] = "";
            }
            c.push(o(n[r], h[r]));
        }
        for (r = 0; r < u.length; ++r) {
            var f = [];
            for (var p = 0; p < c.length; ++p) {
                if (showdown.helper.isUndefined(u[r][p])) {}
                f.push(a(u[r][p], h[p]));
            }
            d.push(f);
        }
        return i(c, d);
    });
    e = t.converter._dispatch("tables.after", e, r, t);
    return e;
});

showdown.subParser("unescapeSpecialChars", function(e) {
    "use strict";
    e = e.replace(/~E(\d+)E/g, function(e, r) {
        var t = parseInt(r);
        return String.fromCharCode(t);
    });
    return e;
});

module.exports = showdown;