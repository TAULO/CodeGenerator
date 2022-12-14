function getDefaultOpts(e) {
    var r = {
        omitExtraWLInCodeBlocks: {
            defaultValue: !1,
            describe: "Omit the default extra whiteline added to code blocks",
            type: "boolean"
        },
        noHeaderId: {
            defaultValue: !1,
            describe: "Turn on/off generated header id",
            type: "boolean"
        },
        prefixHeaderId: {
            defaultValue: !1,
            describe: "Specify a prefix to generated header ids",
            type: "string"
        },
        headerLevelStart: {
            defaultValue: !1,
            describe: "The header blocks level start",
            type: "integer"
        },
        parseImgDimensions: {
            defaultValue: !1,
            describe: "Turn on/off image dimension parsing",
            type: "boolean"
        },
        simplifiedAutoLink: {
            defaultValue: !1,
            describe: "Turn on/off GFM autolink style",
            type: "boolean"
        },
        literalMidWordUnderscores: {
            defaultValue: !1,
            describe: "Parse midword underscores as literal underscores",
            type: "boolean"
        },
        strikethrough: {
            defaultValue: !1,
            describe: "Turn on/off strikethrough support",
            type: "boolean"
        },
        tables: {
            defaultValue: !1,
            describe: "Turn on/off tables support",
            type: "boolean"
        },
        tablesHeaderId: {
            defaultValue: !1,
            describe: "Add an id to table headers",
            type: "boolean"
        },
        ghCodeBlocks: {
            defaultValue: !0,
            describe: "Turn on/off GFM fenced code blocks support",
            type: "boolean"
        },
        tasklists: {
            defaultValue: !1,
            describe: "Turn on/off GFM tasklist support",
            type: "boolean"
        },
        smoothLivePreview: {
            defaultValue: !1,
            describe: "Prevents weird effects in live previews due to incomplete input",
            type: "boolean"
        },
        smartIndentationFix: {
            defaultValue: !1,
            description: "Tries to smartly fix identation in es6 strings",
            type: "boolean"
        }
    };
    if (!1 === e) return JSON.parse(JSON.stringify(r));
    var n = {};
    for (var t in r) r.hasOwnProperty(t) && (n[t] = r[t].defaultValue);
    return n
}
function validate(e, r) {
    var n = r ? "Error in " + r + " extension->" : "Error in unnamed extension",
        t = {
            valid: !0,
            error: ""
        };
    showdown.helper.isArray(e) || (e = [e]);
    for (var o = 0; o < e.length; ++o) {
        var s = n + " sub-extension " + o + ": ",
            a = e[o];
        if ("object" !== (void 0 === a ? "undefined" : _typeof(a))) return t.valid = !1, t.error = s + "must be an object, but " + (void 0 === a ? "undefined" : _typeof(a)) + " given", t;
        if (!showdown.helper.isString(a.type)) return t.valid = !1, t.error = s + 'property "type" must be a string, but ' + _typeof(a.type) + " given", t;
        var i = a.type = a.type.toLowerCase();
        if ("language" === i && (i = a.type = "lang"), "html" === i && (i = a.type = "output"), "lang" !== i && "output" !== i && "listener" !== i) return t.valid = !1, t.error = s + "type " + i + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"', t;
        if ("listener" === i) {
            if (showdown.helper.isUndefined(a.listeners)) return t.valid = !1, t.error = s + '. Extensions of type "listener" must have a property called "listeners"', t
        } else if (showdown.helper.isUndefined(a.filter) && showdown.helper.isUndefined(a.regex)) return t.valid = !1, t.error = s + i + ' extensions must define either a "regex" property or a "filter" method', t;
        if (a.listeners) {
            if ("object" !== _typeof(a.listeners)) return t.valid = !1, t.error = s + '"listeners" property must be an object but ' + _typeof(a.listeners) + " given", t;
            for (var l in a.listeners) if (a.listeners.hasOwnProperty(l) && "function" != typeof a.listeners[l]) return t.valid = !1, t.error = s + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + l + " must be a function but " + _typeof(a.listeners[l]) + " given", t
        }
        if (a.filter) {
            if ("function" != typeof a.filter) return t.valid = !1, t.error = s + '"filter" must be a function, but ' + _typeof(a.filter) + " given", t
        } else if (a.regex) {
            if (showdown.helper.isString(a.regex) && (a.regex = new RegExp(a.regex, "g")), !a.regex instanceof RegExp) return t.valid = !1, t.error = s + '"regex" property must either be a string or a RegExp object, but ' + _typeof(a.regex) + " given", t;
            if (showdown.helper.isUndefined(a.replace)) return t.valid = !1, t.error = s + '"regex" extensions must implement a replace string or function', t
        }
    }
    return t
}
function escapeCharactersCallback(e, r) {
    return "~E" + r.charCodeAt(0) + "E"
}
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
    } : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, showdown = {}, parsers = {}, extensions = {}, globalOptions = getDefaultOpts(!0),
    flavor = {
        github: {
            omitExtraWLInCodeBlocks: !0,
            prefixHeaderId: "user-content-",
            simplifiedAutoLink: !0,
            literalMidWordUnderscores: !0,
            strikethrough: !0,
            tables: !0,
            tablesHeaderId: !0,
            ghCodeBlocks: !0,
            tasklists: !0
        },
        vanilla: getDefaultOpts(!0)
    };
showdown.helper = {}, showdown.extensions = {}, showdown.setOption = function(e, r) {
    return globalOptions[e] = r, this
}, showdown.getOption = function(e) {
    return globalOptions[e]
}, showdown.getOptions = function() {
    return globalOptions
}, showdown.resetOptions = function() {
    globalOptions = getDefaultOpts(!0)
}, showdown.setFlavor = function(e) {
    if (flavor.hasOwnProperty(e)) {
        var r = flavor[e];
        for (var n in r) r.hasOwnProperty(n) && (globalOptions[n] = r[n])
    }
}, showdown.getDefaultOptions = function(e) {
    return getDefaultOpts(e)
}, showdown.subParser = function(e, r) {
    if (showdown.helper.isString(e)) {
        if (void 0 === r) {
            if (parsers.hasOwnProperty(e)) return parsers[e];
            throw Error("SubParser named " + e + " not registered!")
        }
        parsers[e] = r
    }
}, showdown.extension = function(e, r) {
    if (!showdown.helper.isString(e)) throw Error("Extension 'name' must be a string");
    if (e = showdown.helper.stdExtName(e), showdown.helper.isUndefined(r)) {
        if (!extensions.hasOwnProperty(e)) throw Error("Extension named " + e + " is not registered!");
        return extensions[e]
    }
    "function" == typeof r && (r = r()), showdown.helper.isArray(r) || (r = [r]);
    var n = validate(r, e);
    if (!n.valid) throw Error(n.error);
    extensions[e] = r
}, showdown.getAllExtensions = function() {
    return extensions
}, showdown.removeExtension = function(e) {
    delete extensions[e]
}, showdown.resetExtensions = function() {
    extensions = {}
}, showdown.validateExtension = function(e) {
    var r = validate(e, null);
    return !!r.valid || (console.warn(r.error), !1)
}, showdown.hasOwnProperty("helper") || (showdown.helper = {}), showdown.helper.isString = function(e) {
    return "string" == typeof e || e instanceof String
}, showdown.helper.isFunction = function(e) {
    return e && "[object Function]" === {}.toString.call(e)
}, showdown.helper.forEach = function(e, r) {
    if ("function" == typeof e.forEach) e.forEach(r);
    else for (var n = 0; n < e.length; n++) r(e[n], n, e)
}, showdown.helper.isArray = function(e) {
    return e.constructor === Array
}, showdown.helper.isUndefined = function(e) {
    return void 0 === e
}, showdown.helper.stdExtName = function(e) {
    return e.replace(/[_-]||\s/g, "").toLowerCase()
}, showdown.helper.escapeCharactersCallback = escapeCharactersCallback, showdown.helper.escapeCharacters = function(e, r, n) {
    var t = "([" + r.replace(/([\[\]\\])/g, "\\$1") + "])";
    n && (t = "\\\\" + t);
    var o = new RegExp(t, "g");
    return e = e.replace(o, escapeCharactersCallback)
};
var rgxFindMatchPos = function(e, r, n, t) {
    var o, s, a, i, l, c = t || "",
        h = c.indexOf("g") > -1,
        u = new RegExp(r + "|" + n, "g" + c.replace(/g/g, "")),
        d = new RegExp(r, c.replace(/g/g, "")),
        p = [];
    do {
        for (o = 0; a = u.exec(e);) if (d.test(a[0])) o++ || (i = (s = u.lastIndex) - a[0].length);
        else if (o && !--o) {
            l = a.index + a[0].length;
            var w = {
                left: {
                    start: i,
                    end: s
                },
                match: {
                    start: s,
                    end: a.index
                },
                right: {
                    start: a.index,
                    end: l
                },
                wholeMatch: {
                    start: i,
                    end: l
                }
            };
            if (p.push(w), !h) return p
        }
    } while (o && (u.lastIndex = s));
    return p
};
showdown.helper.matchRecursiveRegExp = function(e, r, n, t) {
    for (var o = rgxFindMatchPos(e, r, n, t), s = [], a = 0; a < o.length; ++a) s.push([e.slice(o[a].wholeMatch.start, o[a].wholeMatch.end), e.slice(o[a].match.start, o[a].match.end), e.slice(o[a].left.start, o[a].left.end), e.slice(o[a].right.start, o[a].right.end)]);
    return s
}, showdown.helper.replaceRecursiveRegExp = function(e, r, n, t, o) {
    if (!showdown.helper.isFunction(r)) {
        var s = r;
        r = function() {
            return s
        }
    }
    var a = rgxFindMatchPos(e, n, t, o),
        i = e,
        l = a.length;
    if (l > 0) {
        var c = [];
        0 !== a[0].wholeMatch.start && c.push(e.slice(0, a[0].wholeMatch.start));
        for (var h = 0; h < l; ++h) c.push(r(e.slice(a[h].wholeMatch.start, a[h].wholeMatch.end), e.slice(a[h].match.start, a[h].match.end), e.slice(a[h].left.start, a[h].left.end), e.slice(a[h].right.start, a[h].right.end))), h < l - 1 && c.push(e.slice(a[h].wholeMatch.end, a[h + 1].wholeMatch.start));
        a[l - 1].wholeMatch.end < e.length && c.push(e.slice(a[l - 1].wholeMatch.end)), i = c.join("")
    }
    return i
}, showdown.helper.isUndefined(console) && (console = {
    warn: function(e) {
        alert(e)
    },
    log: function(e) {
        alert(e)
    },
    error: function(e) {
        throw e
    }
}), showdown.Converter = function(e) {
    function r(e, r) {
        if (r = r || null, showdown.helper.isString(e)) {
            if (e = showdown.helper.stdExtName(e), r = e, showdown.extensions[e]) return console.warn("DEPRECATION WARNING: " + e + " is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"), void n(showdown.extensions[e], e);
            if (showdown.helper.isUndefined(extensions[e])) throw Error('Extension "' + e + '" could not be loaded. It was either not found or is not a valid extension.');
            e = extensions[e]
        }
        "function" == typeof e && (e = e()), showdown.helper.isArray(e) || (e = [e]);
        var o = validate(e, r);
        if (!o.valid) throw Error(o.error);
        for (var s = 0; s < e.length; ++s) {
            switch (e[s].type) {
                case "lang":
                    a.push(e[s]);
                    break;
                case "output":
                    i.push(e[s])
            }
            if (e[s].hasOwnProperty(l)) for (var c in e[s].listeners) e[s].listeners.hasOwnProperty(c) && t(c, e[s].listeners[c])
        }
    }
    function n(e, r) {
        "function" == typeof e && (e = e(new showdown.Converter)), showdown.helper.isArray(e) || (e = [e]);
        var n = validate(e, r);
        if (!n.valid) throw Error(n.error);
        for (var t = 0; t < e.length; ++t) switch (e[t].type) {
            case "lang":
                a.push(e[t]);
                break;
            case "output":
                i.push(e[t]);
                break;
            default:
                throw Error("Extension loader error: Type unrecognized!!!")
        }
    }
    function t(e, r) {
        if (!showdown.helper.isString(e)) throw Error("Invalid argument in converter.listen() method: name must be a string, but " + (void 0 === e ? "undefined" : _typeof(e)) + " given");
        if ("function" != typeof r) throw Error("Invalid argument in converter.listen() method: callback must be a function, but " + (void 0 === r ? "undefined" : _typeof(r)) + " given");
        l.hasOwnProperty(e) || (l[e] = []), l[e].push(r)
    }
    function o(e) {
        var r = e.match(/^\s*/)[0].length,
            n = new RegExp("^\\s{0," + r + "}", "gm");
        return e.replace(n, "")
    }
    var s = {}, a = [],
        i = [],
        l = {};
    ! function() {
        e = e || {};
        for (var n in globalOptions) globalOptions.hasOwnProperty(n) && (s[n] = globalOptions[n]);
        if ("object" !== (void 0 === e ? "undefined" : _typeof(e))) throw Error("Converter expects the passed parameter to be an object, but " + (void 0 === e ? "undefined" : _typeof(e)) + " was passed instead.");
        for (var t in e) e.hasOwnProperty(t) && (s[t] = e[t]);
        s.extensions && showdown.helper.forEach(s.extensions, r)
    }(), this._dispatch = function(e, r, n, t) {
        if (l.hasOwnProperty(e)) for (var o = 0; o < l[e].length; ++o) {
            var s = l[e][o](e, r, this, n, t);
            s && void 0 !== s && (r = s)
        }
        return r
    }, this.listen = function(e, r) {
        return t(e, r), this
    }, this.makeHtml = function(e) {
        if (!e) return e;
        var r = {
            gHtmlBlocks: [],
            gHtmlMdBlocks: [],
            gHtmlSpans: [],
            gUrls: {},
            gTitles: {},
            gDimensions: {},
            gListLevel: 0,
            hashLinkCounts: {},
            langExtensions: a,
            outputModifiers: i,
            converter: this,
            ghCodeBlocks: []
        };
        return e = e.replace(/~/g, "~T"), e = e.replace(/\$/g, "~D"), e = e.replace(/\r\n/g, "\n"), e = e.replace(/\r/g, "\n"), s.smartIndentationFix && (e = o(e)), e = e, e = showdown.subParser("detab")(e, s, r), e = showdown.subParser("stripBlankLines")(e, s, r), showdown.helper.forEach(a, function(n) {
            e = showdown.subParser("runExtension")(n, e, s, r)
        }), e = showdown.subParser("hashPreCodeTags")(e, s, r), e = showdown.subParser("githubCodeBlocks")(e, s, r), e = showdown.subParser("hashHTMLBlocks")(e, s, r), e = showdown.subParser("hashHTMLSpans")(e, s, r), e = showdown.subParser("stripLinkDefinitions")(e, s, r), e = showdown.subParser("blockGamut")(e, s, r), e = showdown.subParser("unhashHTMLSpans")(e, s, r), e = showdown.subParser("unescapeSpecialChars")(e, s, r), e = e.replace(/~D/g, "$$"), e = e.replace(/~T/g, "~"), showdown.helper.forEach(i, function(n) {
            e = showdown.subParser("runExtension")(n, e, s, r)
        }), e
    }, this.setOption = function(e, r) {
        s[e] = r
    }, this.getOption = function(e) {
        return s[e]
    }, this.getOptions = function() {
        return s
    }, this.addExtension = function(e, n) {
        r(e, n = n || null)
    }, this.useExtension = function(e) {
        r(e)
    }, this.setFlavor = function(e) {
        if (flavor.hasOwnProperty(e)) {
            var r = flavor[e];
            for (var n in r) r.hasOwnProperty(n) && (s[n] = r[n])
        }
    }, this.removeExtension = function(e) {
        showdown.helper.isArray(e) || (e = [e]);
        for (var r = 0; r < e.length; ++r) {
            for (var n = e[r], t = 0; t < a.length; ++t) a[t] === n && a[t].splice(t, 1);
            for (; 0 < i.length; ++t) i[0] === n && i[0].splice(t, 1)
        }
    }, this.getAllExtensions = function() {
        return {
            language: a,
            output: i
        }
    }
}, showdown.subParser("anchors", function(e, r, n) {
    var t = function(e, r, t, o, s, a, i, l) {
        showdown.helper.isUndefined(l) && (l = ""), e = r;
        var c = t,
            h = o.toLowerCase(),
            u = s,
            d = l;
        if (!u) if (h || (h = c.toLowerCase().replace(/ ?\n/g, " ")), u = "#" + h, showdown.helper.isUndefined(n.gUrls[h])) {
            if (!(e.search(/\(\s*\)$/m) > -1)) return e;
            u = ""
        } else u = n.gUrls[h], showdown.helper.isUndefined(n.gTitles[h]) || (d = n.gTitles[h]);
        var p = '<a href="' + (u = showdown.helper.escapeCharacters(u, "*_", !1)) + '"';
        return "" !== d && null !== d && (d = d.replace(/"/g, "&quot;"), p += ' title="' + (d = showdown.helper.escapeCharacters(d, "*_", !1)) + '"'), p += ">" + c + "</a>"
    };
    return e = (e = n.converter._dispatch("anchors.before", e, r, n)).replace(/(\[((?:\[[^\]]*]|[^\[\]])*)][ ]?(?:\n[ ]*)?\[(.*?)])()()()()/g, t), e = e.replace(/(\[((?:\[[^\]]*]|[^\[\]])*)]\([ \t]*()<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, t), e = e.replace(/(\[([^\[\]]+)])()()()()()/g, t), e = n.converter._dispatch("anchors.after", e, r, n)
}), showdown.subParser("autoLinks", function(e, r, n) {
    function t(e, r) {
        var n = r;
        return /^www\./i.test(r) && (r = r.replace(/^www\./i, "http://www.")), '<a href="' + r + '">' + n + "</a>"
    }
    function o(e, r) {
        var n = showdown.subParser("unescapeSpecialChars")(r);
        return showdown.subParser("encodeEmailAddress")(n)
    }
    var s = /\b(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+)(?=\s|$)(?!["<>])/gi,
        a = /(?:^|[ \n\t])([A-Za-z0-9!#$%&'*+-/=?^_`\{|}~\.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?:$|[ \n\t])/gi;
    return e = (e = n.converter._dispatch("autoLinks.before", e, r, n)).replace(/<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)>/gi, t), e = e.replace(/<(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, o), r.simplifiedAutoLink && (e = (e = e.replace(s, t)).replace(a, o)), e = n.converter._dispatch("autoLinks.after", e, r, n)
}), showdown.subParser("blockGamut", function(e, r, n) {
    e = n.converter._dispatch("blockGamut.before", e, r, n), e = showdown.subParser("blockQuotes")(e, r, n), e = showdown.subParser("headers")(e, r, n);
    var t = showdown.subParser("hashBlock")("<hr />", r, n);
    return e = e.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, t), e = e.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm, t), e = e.replace(/^[ ]{0,2}([ ]?_[ ]?){3,}[ \t]*$/gm, t), e = showdown.subParser("lists")(e, r, n), e = showdown.subParser("codeBlocks")(e, r, n), e = showdown.subParser("tables")(e, r, n), e = showdown.subParser("hashHTMLBlocks")(e, r, n), e = showdown.subParser("paragraphs")(e, r, n), e = n.converter._dispatch("blockGamut.after", e, r, n)
}), showdown.subParser("blockQuotes", function(e, r, n) {
    return e = n.converter._dispatch("blockQuotes.before", e, r, n), e = e.replace(/((^[ \t]{0,3}>[ \t]?.+\n(.+\n)*\n*)+)/gm, function(e, t) {
        var o = t;
        return o = o.replace(/^[ \t]*>[ \t]?/gm, "~0"), o = o.replace(/~0/g, ""), o = o.replace(/^[ \t]+$/gm, ""), o = showdown.subParser("githubCodeBlocks")(o, r, n), o = showdown.subParser("blockGamut")(o, r, n), o = o.replace(/(^|\n)/g, "$1  "), o = o.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(e, r) {
            var n = r;
            return n = n.replace(/^  /gm, "~0"), n = n.replace(/~0/g, "")
        }), showdown.subParser("hashBlock")("<blockquote>\n" + o + "\n</blockquote>", r, n)
    }), e = n.converter._dispatch("blockQuotes.after", e, r, n)
}), showdown.subParser("codeBlocks", function(e, r, n) {
    e = n.converter._dispatch("codeBlocks.before", e, r, n);
    return e = (e += "~0").replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g, function(e, t, o) {
        var s = t,
            a = o,
            i = "\n";
        return s = showdown.subParser("outdent")(s), s = showdown.subParser("encodeCode")(s), s = showdown.subParser("detab")(s), s = s.replace(/^\n+/g, ""), s = s.replace(/\n+$/g, ""), r.omitExtraWLInCodeBlocks && (i = ""), s = "<pre><code>" + s + i + "</code></pre>", showdown.subParser("hashBlock")(s, r, n) + a
    }), e = e.replace(/~0/, ""), e = n.converter._dispatch("codeBlocks.after", e, r, n)
}), showdown.subParser("codeSpans", function(e, r, n) {
    return void 0 === (e = n.converter._dispatch("codeSpans.before", e, r, n)) && (e = ""), e = e.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm, function(e, r, n, t) {
        var o = t;
        return o = o.replace(/^([ \t]*)/g, ""), o = o.replace(/[ \t]*$/g, ""), o = showdown.subParser("encodeCode")(o), r + "<code>" + o + "</code>"
    }), e = n.converter._dispatch("codeSpans.after", e, r, n)
}), showdown.subParser("detab", function(e) {
    return e = e.replace(/\t(?=\t)/g, "    "), e = e.replace(/\t/g, "~A~B"), e = e.replace(/~B(.+?)~A/g, function(e, r) {
        for (var n = r, t = 4 - n.length % 4, o = 0; o < t; o++) n += " ";
        return n
    }), e = e.replace(/~A/g, "    "), e = e.replace(/~B/g, "")
}), showdown.subParser("encodeAmpsAndAngles", function(e) {
    return e = e.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), e = e.replace(/<(?![a-z\/?\$!])/gi, "&lt;")
}), showdown.subParser("encodeBackslashEscapes", function(e) {
    return e = e.replace(/\\(\\)/g, showdown.helper.escapeCharactersCallback), e = e.replace(/\\([`*_{}\[\]()>#+-.!])/g, showdown.helper.escapeCharactersCallback)
}), showdown.subParser("encodeCode", function(e) {
    return e = e.replace(/&/g, "&amp;"), e = e.replace(/</g, "&lt;"), e = e.replace(/>/g, "&gt;"), e = showdown.helper.escapeCharacters(e, "*_{}[]\\", !1)
}), showdown.subParser("encodeEmailAddress", function(e) {
    var r = [function(e) {
        return "&#" + e.charCodeAt(0) + ";"
    }, function(e) {
        return "&#x" + e.charCodeAt(0).toString(16) + ";"
    }, function(e) {
        return e
    }];
    return e = "mailto:" + e, e = e.replace(/./g, function(e) {
        if ("@" === e) e = r[Math.floor(2 * Math.random())](e);
        else if (":" !== e) {
            var n = Math.random();
            e = n > .9 ? r[2](e) : n > .45 ? r[1](e) : r[0](e)
        }
        return e
    }), e = '<a href="' + e + '">' + e + "</a>", e = e.replace(/">.+:/g, '">')
}), showdown.subParser("escapeSpecialCharsWithinTagAttributes", function(e) {
    return e = e.replace(/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi, function(e) {
        var r = e.replace(/(.)<\/?code>(?=.)/g, "$1`");
        return r = showdown.helper.escapeCharacters(r, "\\`*_", !1)
    })
}), showdown.subParser("githubCodeBlocks", function(e, r, n) {
    return r.ghCodeBlocks ? (e = n.converter._dispatch("githubCodeBlocks.before", e, r, n), e += "~0", e = e.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g, function(e, t, o) {
        var s = r.omitExtraWLInCodeBlocks ? "" : "\n";
        return o = showdown.subParser("encodeCode")(o), o = showdown.subParser("detab")(o), o = o.replace(/^\n+/g, ""), o = o.replace(/\n+$/g, ""), o = "<pre><code" + (t ? ' class="' + t + " language-" + t + '"' : "") + ">" + o + s + "</code></pre>", o = showdown.subParser("hashBlock")(o, r, n), "\n\n~G" + (n.ghCodeBlocks.push({
            text: e,
            codeblock: o
        }) - 1) + "G\n\n"
    }), e = e.replace(/~0/, ""), n.converter._dispatch("githubCodeBlocks.after", e, r, n)) : e
}), showdown.subParser("hashBlock", function(e, r, n) {
    return e = e.replace(/(^\n+|\n+$)/g, ""), "\n\n~K" + (n.gHtmlBlocks.push(e) - 1) + "K\n\n"
}), showdown.subParser("hashElement", function(e, r, n) {
    return function(e, r) {
        var t = r;
        return t = t.replace(/\n\n/g, "\n"), t = t.replace(/^\n/, ""), t = t.replace(/\n+$/g, ""), t = "\n\n~K" + (n.gHtmlBlocks.push(t) - 1) + "K\n\n"
    }
}), showdown.subParser("hashHTMLBlocks", function(e, r, n) {
    for (var t = ["pre", "div", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "table", "dl", "ol", "ul", "script", "noscript", "form", "fieldset", "iframe", "math", "style", "section", "header", "footer", "nav", "article", "aside", "address", "audio", "canvas", "figure", "hgroup", "output", "video", "p"], o = 0; o < t.length; ++o) e = showdown.helper.replaceRecursiveRegExp(e, function(e, r, t, o) {
        var s = e;
        return -1 !== t.search(/\bmarkdown\b/) && (s = t + n.converter.makeHtml(r) + o), "\n\n~K" + (n.gHtmlBlocks.push(s) - 1) + "K\n\n"
    }, "^(?: |\\t){0,3}<" + t[o] + "\\b[^>]*>", "</" + t[o] + ">", "gim");
    return e = e.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g, showdown.subParser("hashElement")(e, r, n)), e = e.replace(/(<!--[\s\S]*?-->)/g, showdown.subParser("hashElement")(e, r, n)), e = e.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g, showdown.subParser("hashElement")(e, r, n))
}), showdown.subParser("hashHTMLSpans", function(e, r, n) {
    for (var t = showdown.helper.matchRecursiveRegExp(e, "<code\\b[^>]*>", "</code>", "gi"), o = 0; o < t.length; ++o) e = e.replace(t[o][0], "~L" + (n.gHtmlSpans.push(t[o][0]) - 1) + "L");
    return e
}), showdown.subParser("unhashHTMLSpans", function(e, r, n) {
    for (var t = 0; t < n.gHtmlSpans.length; ++t) e = e.replace("~L" + t + "L", n.gHtmlSpans[t]);
    return e
}), showdown.subParser("hashPreCodeTags", function(e, r, n) {
    return e = showdown.helper.replaceRecursiveRegExp(e, function(e, r, t, o) {
        var s = t + showdown.subParser("encodeCode")(r) + o;
        return "\n\n~G" + (n.ghCodeBlocks.push({
            text: e,
            codeblock: s
        }) - 1) + "G\n\n"
    }, "^(?: |\\t){0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>", "^(?: |\\t){0,3}</code>\\s*</pre>", "gim")
}), showdown.subParser("headers", function(e, r, n) {
    function t(e) {
        var r, t = e.replace(/[^\w]/g, "").toLowerCase();
        return n.hashLinkCounts[t] ? r = t + "-" + n.hashLinkCounts[t]++ : (r = t, n.hashLinkCounts[t] = 1), !0 === o && (o = "section"), showdown.helper.isString(o) ? o + r : r
    }
    e = n.converter._dispatch("headers.before", e, r, n);
    var o = r.prefixHeaderId,
        s = isNaN(parseInt(r.headerLevelStart)) ? 1 : parseInt(r.headerLevelStart),
        a = r.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm,
        i = r.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;
    return e = e.replace(a, function(e, o) {
        var a = showdown.subParser("spanGamut")(o, r, n),
            i = r.noHeaderId ? "" : ' id="' + t(o) + '"',
            l = s,
            c = "<h" + l + i + ">" + a + "</h" + l + ">";
        return showdown.subParser("hashBlock")(c, r, n)
    }), e = e.replace(i, function(e, o) {
        var a = showdown.subParser("spanGamut")(o, r, n),
            i = r.noHeaderId ? "" : ' id="' + t(o) + '"',
            l = s + 1,
            c = "<h" + l + i + ">" + a + "</h" + l + ">";
        return showdown.subParser("hashBlock")(c, r, n)
    }), e = e.replace(/^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm, function(e, o, a) {
        var i = showdown.subParser("spanGamut")(a, r, n),
            l = r.noHeaderId ? "" : ' id="' + t(a) + '"',
            c = s - 1 + o.length,
            h = "<h" + c + l + ">" + i + "</h" + c + ">";
        return showdown.subParser("hashBlock")(h, r, n)
    }), e = n.converter._dispatch("headers.after", e, r, n)
}), showdown.subParser("images", function(e, r, n) {
    function t(e, r, t, o, s, a, i, l) {
        var c = n.gUrls,
            h = n.gTitles,
            u = n.gDimensions;
        if (t = t.toLowerCase(), l || (l = ""), "" === o || null === o) {
            if ("" !== t && null !== t || (t = r.toLowerCase().replace(/ ?\n/g, " ")), o = "#" + t, showdown.helper.isUndefined(c[t])) return e;
            o = c[t], showdown.helper.isUndefined(h[t]) || (l = h[t]), showdown.helper.isUndefined(u[t]) || (s = u[t].width, a = u[t].height)
        }
        r = r.replace(/"/g, "&quot;"), r = showdown.helper.escapeCharacters(r, "*_", !1);
        var d = '<img src="' + (o = showdown.helper.escapeCharacters(o, "*_", !1)) + '" alt="' + r + '"';
        return l && (l = l.replace(/"/g, "&quot;"), d += ' title="' + (l = showdown.helper.escapeCharacters(l, "*_", !1)) + '"'), s && a && (d += ' width="' + (s = "*" === s ? "auto" : s) + '"', d += ' height="' + (a = "*" === a ? "auto" : a) + '"'), d += " />"
    }
    return e = (e = n.converter._dispatch("images.before", e, r, n)).replace(/!\[([^\]]*?)] ?(?:\n *)?\[(.*?)]()()()()()/g, t), e = e.replace(/!\[(.*?)]\s?\([ \t]*()<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(['"])(.*?)\6[ \t]*)?\)/g, t), e = n.converter._dispatch("images.after", e, r, n)
}), showdown.subParser("italicsAndBold", function(e, r, n) {
    return e = n.converter._dispatch("italicsAndBold.before", e, r, n), e = r.literalMidWordUnderscores ? (e = (e = (e = e.replace(/(^|\s|>|\b)__(?=\S)([\s\S]+?)__(?=\b|<|\s|$)/gm, "$1<strong>$2</strong>")).replace(/(^|\s|>|\b)_(?=\S)([\s\S]+?)_(?=\b|<|\s|$)/gm, "$1<em>$2</em>")).replace(/(\*\*)(?=\S)([^\r]*?\S[*]*)\1/g, "<strong>$2</strong>")).replace(/(\*)(?=\S)([^\r]*?\S)\1/g, "<em>$2</em>") : (e = e.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, "<strong>$2</strong>")).replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g, "<em>$2</em>"), e = n.converter._dispatch("italicsAndBold.after", e, r, n)
}), showdown.subParser("lists", function(e, r, n) {
    function t(e, t) {
        n.gListLevel++, e = e.replace(/\n{2,}$/, "\n");
        var o = /\n[ \t]*\n(?!~0)/.test(e += "~0");
        return e = e.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm, function(e, t, s, a, i, l, c) {
            c = c && "" !== c.trim();
            var h = showdown.subParser("outdent")(i, r, n),
                u = "";
            return l && r.tasklists && (u = ' class="task-list-item" style="list-style-type: none;"', h = h.replace(/^[ \t]*\[(x|X| )?]/m, function() {
                var e = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
                return c && (e += " checked"), e += ">"
            })), t || h.search(/\n{2,}/) > -1 ? (h = showdown.subParser("githubCodeBlocks")(h, r, n), h = showdown.subParser("blockGamut")(h, r, n)) : (h = (h = showdown.subParser("lists")(h, r, n)).replace(/\n$/, ""), h = o ? showdown.subParser("paragraphs")(h, r, n) : showdown.subParser("spanGamut")(h, r, n)), h = "\n<li" + u + ">" + h + "</li>\n"
        }), e = e.replace(/~0/g, ""), n.gListLevel--, t && (e = e.replace(/\s+$/, "")), e
    }
    function o(e, r, n) {
        var o = "ul" === r ? /^ {0,2}\d+\.[ \t]/gm : /^ {0,2}[*+-][ \t]/gm,
            s = [],
            a = "";
        if (-1 !== e.search(o)) {
            ! function e(s) {
                var i = s.search(o); - 1 !== i ? (a += "\n\n<" + r + ">" + t(s.slice(0, i), !! n) + "</" + r + ">\n\n", o = "ul" === (r = "ul" === r ? "ol" : "ul") ? /^ {0,2}\d+\.[ \t]/gm : /^ {0,2}[*+-][ \t]/gm, e(s.slice(i))) : a += "\n\n<" + r + ">" + t(s, !! n) + "</" + r + ">\n\n"
            }(e);
            for (var i = 0; i < s.length; ++i);
        } else a = "\n\n<" + r + ">" + t(e, !! n) + "</" + r + ">\n\n";
        return a
    }
    e = n.converter._dispatch("lists.before", e, r, n), e += "~0";
    var s = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
    return n.gListLevel ? e = e.replace(s, function(e, r, n) {
        return o(r, n.search(/[*+-]/g) > -1 ? "ul" : "ol", !0)
    }) : (s = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm, e = e.replace(s, function(e, r, n, t) {
        return o(n, t.search(/[*+-]/g) > -1 ? "ul" : "ol")
    })), e = e.replace(/~0/, ""), e = n.converter._dispatch("lists.after", e, r, n)
}), showdown.subParser("outdent", function(e) {
    return e = e.replace(/^(\t|[ ]{1,4})/gm, "~0"), e = e.replace(/~0/g, "")
}), showdown.subParser("paragraphs", function(e, r, n) {
    for (var t = (e = (e = (e = n.converter._dispatch("paragraphs.before", e, r, n)).replace(/^\n+/g, "")).replace(/\n+$/g, "")).split(/\n{2,}/g), o = [], s = t.length, a = 0; a < s; a++) {
        var i = t[a];
        i.search(/~(K|G)(\d+)\1/g) >= 0 ? o.push(i) : (i = (i = showdown.subParser("spanGamut")(i, r, n)).replace(/^([ \t]*)/g, "<p>"), i += "</p>", o.push(i))
    }
    for (s = o.length, a = 0; a < s; a++) {
        for (var l = "", c = o[a], h = !1; c.search(/~(K|G)(\d+)\1/) >= 0;) {
            var u = RegExp.$1,
                d = RegExp.$2;
            l = (l = "K" === u ? n.gHtmlBlocks[d] : h ? showdown.subParser("encodeCode")(n.ghCodeBlocks[d].text) : n.ghCodeBlocks[d].codeblock).replace(/\$/g, "$$$$"), c = c.replace(/(\n\n)?~(K|G)\d+\2(\n\n)?/, l), /^<pre\b[^>]*>\s*<code\b[^>]*>/.test(c) && (h = !0)
        }
        o[a] = c
    }
    return e = o.join("\n\n"), e = e.replace(/^\n+/g, ""), e = e.replace(/\n+$/g, ""), n.converter._dispatch("paragraphs.after", e, r, n)
}), showdown.subParser("runExtension", function(e, r, n, t) {
    if (e.filter) r = e.filter(r, t.converter, n);
    else if (e.regex) {
        var o = e.regex;
        !o instanceof RegExp && (o = new RegExp(o, "g")), r = r.replace(o, e.replace)
    }
    return r
}), showdown.subParser("spanGamut", function(e, r, n) {
    return e = n.converter._dispatch("spanGamut.before", e, r, n), e = showdown.subParser("codeSpans")(e, r, n), e = showdown.subParser("escapeSpecialCharsWithinTagAttributes")(e, r, n), e = showdown.subParser("encodeBackslashEscapes")(e, r, n), e = showdown.subParser("images")(e, r, n), e = showdown.subParser("anchors")(e, r, n), e = showdown.subParser("autoLinks")(e, r, n), e = showdown.subParser("encodeAmpsAndAngles")(e, r, n), e = showdown.subParser("italicsAndBold")(e, r, n), e = showdown.subParser("strikethrough")(e, r, n), e = e.replace(/  +\n/g, " <br />\n"), e = n.converter._dispatch("spanGamut.after", e, r, n)
}), showdown.subParser("strikethrough", function(e, r, n) {
    return r.strikethrough && (e = (e = n.converter._dispatch("strikethrough.before", e, r, n)).replace(/(?:~T){2}([\s\S]+?)(?:~T){2}/g, "<del>$1</del>"), e = n.converter._dispatch("strikethrough.after", e, r, n)), e
}), showdown.subParser("stripBlankLines", function(e) {
    return e.replace(/^[ \t]+$/gm, "")
}), showdown.subParser("stripLinkDefinitions", function(e, r, n) {
    return e += "~0", e = e.replace(/^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=~0))/gm, function(e, t, o, s, a, i, l) {
        return t = t.toLowerCase(), n.gUrls[t] = showdown.subParser("encodeAmpsAndAngles")(o), i ? i + l : (l && (n.gTitles[t] = l.replace(/"|'/g, "&quot;")), r.parseImgDimensions && s && a && (n.gDimensions[t] = {
            width: s,
            height: a
        }), "")
    }), e = e.replace(/~0/, "")
}), showdown.subParser("tables", function(e, r, n) {
    function t(e) {
        return /^:[ \t]*--*$/.test(e) ? ' style="text-align:left;"' : /^--*[ \t]*:[ \t]*$/.test(e) ? ' style="text-align:right;"' : /^:[ \t]*--*[ \t]*:$/.test(e) ? ' style="text-align:center;"' : ""
    }
    function o(e, t) {
        var o = "";
        return e = e.trim(), r.tableHeaderId && (o = ' id="' + e.replace(/ /g, "_").toLowerCase() + '"'), e = showdown.subParser("spanGamut")(e, r, n), "<th" + o + t + ">" + e + "</th>\n"
    }
    function s(e, t) {
        return "<td" + t + ">" + showdown.subParser("spanGamut")(e, r, n) + "</td>\n"
    }
    function a(e, r) {
        for (var n = "<table>\n<thead>\n<tr>\n", t = e.length, o = 0; o < t; ++o) n += e[o];
        for (n += "</tr>\n</thead>\n<tbody>\n", o = 0; o < r.length; ++o) {
            n += "<tr>\n";
            for (var s = 0; s < t; ++s) n += r[o][s];
            n += "</tr>\n"
        }
        return n += "</tbody>\n</table>\n"
    }
    if (!r.tables) return e;
    return e = n.converter._dispatch("tables.before", e, r, n), e = e.replace(/^[ \t]{0,3}\|?.+\|.+\n[ \t]{0,3}\|?[ \t]*:?[ \t]*(?:-|=){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:-|=){2,}[\s\S]+?(?:\n\n|~0)/gm, function(e) {
        var r, n = e.split("\n");
        for (r = 0; r < n.length; ++r) /^[ \t]{0,3}\|/.test(n[r]) && (n[r] = n[r].replace(/^[ \t]{0,3}\|/, "")), /\|[ \t]*$/.test(n[r]) && (n[r] = n[r].replace(/\|[ \t]*$/, ""));
        var i = n[0].split("|").map(function(e) {
            return e.trim()
        }),
            l = n[1].split("|").map(function(e) {
                return e.trim()
            }),
            c = [],
            h = [],
            u = [],
            d = [];
        for (n.shift(), n.shift(), r = 0; r < n.length; ++r) "" !== n[r].trim() && c.push(n[r].split("|").map(function(e) {
            return e.trim()
        }));
        if (i.length < l.length) return e;
        for (r = 0; r < l.length; ++r) u.push(t(l[r]));
        for (r = 0; r < i.length; ++r) showdown.helper.isUndefined(u[r]) && (u[r] = ""), h.push(o(i[r], u[r]));
        for (r = 0; r < c.length; ++r) {
            for (var p = [], w = 0; w < h.length; ++w) showdown.helper.isUndefined(c[r][w]), p.push(s(c[r][w], u[w]));
            d.push(p)
        }
        return a(h, d)
    }), e = n.converter._dispatch("tables.after", e, r, n)
}), showdown.subParser("unescapeSpecialChars", function(e) {
    return e = e.replace(/~E(\d+)E/g, function(e, r) {
        var n = parseInt(r);
        return String.fromCharCode(n)
    })
}), module.exports = showdown;