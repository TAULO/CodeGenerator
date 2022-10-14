if (Klippy === undefined) var Klippy = {};
Klippy.DEBUG = new Class({
    _debugOn: true,
    _startupTime: Date.now(),
    _timestamp: function() {
        return "[" + ((Date.now() - this._startupTime) / 1E3).toFixed(3) + "s]"
    },
    initialize: function(a) {
        this.console = typeof Ti == "object" && typeof Ti.API == "object" ? Ti.API : window.console;
        (this._debugOn = a) && this.info("Running in DEBUG mode")
    },
    enable: function() {
        this._debugOn = true;
        this.info("Running in DEBUG mode")
    },
    disable: function() {
        this._debugOn = false;
        this.info("Running in RELEASE mode")
    },
    info: function(a) {
        if (this._debugOn && this.console) {
            a = this._timestamp() + " " + a;
            "info" in this.console ? this.console.info(a) : this.console.log(a)
        }
    },
    log: function(a) {
        if (this._debugOn && this.console) {
            a = this._timestamp() + " " + a;
            "debug" in this.console ? this.console.debug(a) : this.console.log(a)
        }
    },
    warn: function(a) {
        if (this._debugOn && this.console) {
            a = this._timestamp() + " " + a;
            "warn" in this.console ? this.console.warn(a) : this.console.log(a)
        }
    },
    error: function(a) {
        if (this._debugOn && this.console) {
            a = this._timestamp() + " " + a;
            "error" in this.console ? this.console.error(a) : this.console.log(a)
        }
    },
    assert: function(a, b) {
        if (this._debugOn && this.console) if ("assert" in this.console) this.console.assert(a, b);
        else a || this.error("Assertion failed: " + b)
    },
    dump: function(a) {
        this._debugOn && this.console && this.info(JSON.stringify(a))
    }
});
window.$debug = new Klippy.DEBUG(false);
if (Background === undefined) var Background = {};
Background.Settings = new Class({
    Implements: Options,
    options: {},
    initialize: function() {
        this.load();
        window.$settings = this;
        Browser.safari && safari.extension.settings && safari.extension.settings.addEventListener("change", function(a) {
            $settings.options[a.key] = a.newValue
        }, false)
    },
    load: function() {
        this.setOptions(window.app_default_config);
        if (window.localStorage.options) {
            var a = JSON.parse(window.localStorage.options) || {},
                b;
            for (b in a) if (b.indexOf("app_") != 0) if (a[b] !== undefined && a[b] !== null) this.options[b] = a[b]
        }
        if (Browser.chrome) if (window.localStorage.options) {
            a = JSON.parse(window.localStorage.options) || {};
            for (b in a) if (b.indexOf("app_") != 0) if (a[b] !== undefined && a[b] !== null) this.options[b] = a[b]
        }
        if (Browser.safari) if (safari.extension.settings) for (b in window.app_default_config) if (b.indexOf("app_") != 0) if (safari.extension.settings[b] !== undefined && safari.extension.settings[b] !== null) this.options[b] = safari.extension.settings[b];
        this.options.app_id = window.app_id;
        this.options.app_name = window.app_name;
        this.options.app_stamp = window.app_stamp;
        this.options.app_title = window.app_title;
        this.options.app_version = window.app_version;
        if (this.options.key_format) {
            this.options["key-preview"] = this.options.key_format;
            delete this.options.key_format
        }
        if (this.options.key_send) {
            this.options["key-send"] = this.options.key_send;
            delete this.options.key_send
        }
        if (this.options.key_save) {
            this.options["key-save"] = this.options.key_save;
            delete this.options.key_save
        }
        if (this.options.key_send_save) {
            this.options["key-send-save"] = this.options.key_send_save;
            delete this.options.key_send_save
        }
        if (this.options["key-preview"] == "f12") this.options["key-preview"] = "ctrl-f12";
        if (this.options["1-click"]) {
            this.options["default-action"] = "send";
            delete this.options["1-click"]
        }
        this.options.buttons = window.app_default_config.buttons;
        if (window.app_default_config["whatsnew-date"] && (!window.localStorage["whatsnew-date"] || window.localStorage["whatsnew-date"] < window.app_default_config["whatsnew-date"])) this.options.buttons += ", whatsnew"
    },
    save: function() {
        var a = {},
            b;
        for (b in this.options) if (b.indexOf("app_") != 0) if (this.options[b] !== undefined && this.options[b] !== null) a[b] = this.options[b];
        window.localStorage.options = JSON.stringify(a);
        if (Browser.chrome) {
            a = {};
            for (b in this.options) if (b.indexOf("app_") != 0) if (this.options[b] !== undefined && this.options[b] !== null) a[b] = this.options[b];
            window.localStorage.options = JSON.stringify(a)
        }
        if (Browser.safari) if (safari.extension.settings) for (b in window.app_default_config) if (b.indexOf("app_") != 0) if (this.options[b] !== undefined && this.options[b] !== null) safari.extension.settings[b] = this.options[b];
        this.load()
    },
    get: function(a) {
        return a ? this.options[a] : this.options
    },
    set: function(a, b, c) {
        if (a) this.options[a] = b;
        else this.options = b;
        c || this.save()
    },
    getServer: function() {
        var a = this.options.server;
        if (a) return a;
        return this.options.throughwall ? "http://api2.klip.me/" : "http://api.klip.me/"
    }
});
if (Background === undefined) Background = {};
Background.i18n = new Class({
    options: {},
    initialize: function() {
        this.options.extId = chrome.i18n.getMessage("extId");
        this.options.extName = chrome.i18n.getMessage("extName");
        this.options.extTitle = chrome.i18n.getMessage("extTitle");
        this.options.extDesc = chrome.i18n.getMessage("extDesc");
        this.options.button_send = chrome.i18n.getMessage("button_send");
        this.options.button_save = chrome.i18n.getMessage("button_save");
        this.options.button_share = chrome.i18n.getMessage("button_share");
        this.options.button_share_sina_weibo = chrome.i18n.getMessage("button_share_sina_weibo");
        this.options.button_share_tencent_weibo = chrome.i18n.getMessage("button_share_tencent_weibo");
        this.options.button_setting = chrome.i18n.getMessage("button_setting");
        this.options.button_ok = chrome.i18n.getMessage("button_ok");
        this.options.button_home = chrome.i18n.getMessage("button_home");
        this.options.button_whatsnew = chrome.i18n.getMessage("button_whatsnew");
        for (var a = 1; chrome.i18n.getMessage("error_" + a);) {
            this.options["error_" + a] = chrome.i18n.getMessage("error_" + a);
            a++
        }
        for (a = 1; chrome.i18n.getMessage("message_" + a);) {
            this.options["message_" + a] = chrome.i18n.getMessage("message_" + a);
            a++
        }
        window.$i18n = this
    },
    translate: function(a) {
        a = a.getElements("[i18n-content]");
        for (var b = 0; b < a.length; b++) {
            var c = chrome.i18n.getMessage(a[b].getAttribute("i18n-content"));
            c && a[b].set("html", c)
        }
        $("credits") && !chrome.i18n.getMessage("options_label_credit_detail") && $("credits").setStyle("display", "none")
    }
});
Object.append(DOMEvent.defineKeys, {
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    shift: 16,
    control: 17,
    alt: 18,
    capslock: 20,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    numlock: 144,
    scrolllock: 145,
    ";": 186,
    "=": 187,
    ",": 188,
    "-": Browser.firefox ? 109 : 189,
    ".": 190,
    "/": 191,
    "`": 192,
    "[": 219,
    "\\": 220,
    "]": 221,
    "'": 222,
    "+": 107
});
DOMEvent.implement({
    keyString: function() {
        if (!this.key || this.key == "") return "";
        if (["shift", "control", "alt", "capslock", "pageup", "pagedown", "end", "home", "numlock", "scrolllock", "backspace"].contains(this.key)) return "";
        var a = "";
        if (this.event.altKey) a += Browser.safari ? "option-" : "alt-";
        if (this.event.metaKey) a += "command-";
        if (this.event.ctrlKey) a += Browser.safari ? "control-" : "ctrl-";
        if (this.event.shiftKey) a += "shift-";
        a += this.key;
        return a
    }
});
String.implement({
    startsWith: function(a) {
        return this.indexOf(a) == 0
    },
    endsWith: function(a) {
        var b = this.lastIndexOf(a);
        return b != -1 && b + a.length == this.length
    },
    substringBefore: function(a, b) {
        var c = 0;
        if (b) c = this.lastIndexOf(a);
        else this.indexOf(a);
        if (c >= 0) return this.substring(0, c);
        return ""
    },
    substringAfter: function(a, b) {
        var c = 0;
        if (b) c = this.lastIndexOf(a);
        else this.indexOf(a);
        if (c >= 0) return this.substring(c + a.length);
        return ""
    },
    tokenize: function(a, b) {
        for (var c = [], d = 0, e = 0; e < this.length; e++) if (a.contains(this[e])) {
            c.push(this.substring(d, e));
            d = e + b
        }
        d < this.length && c.push(this.substring(d));
        return c
    },
    checkEmail: function() {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this)
    }
});
window.app_id = chrome.i18n.getMessage("extId");
window.app_name = chrome.i18n.getMessage("extName");
window.app_title = chrome.i18n.getMessage("extTitle");
window.app_description = chrome.i18n.getMessage("extDesc");
window.app_version = "3.2.5";
window.app_default_config = {
    server: "",
    address_name: "",
    address_domain: "free.kindle.com",
    address: "",
    keep_images: true,
    keep_paragraph_spacing: false,
    myEmail: {
        address: "",
        key: "",
        status: "",
        type: "evernote"
    },
    favAccount: {
        id: "",
        nickname: "",
        token: "",
        mode: 0,
        status: 0,
        type: 0
    },
    throughwall: navigator.language == "zh-CN",
    buttons: "send, save, setting",
    "buttons-position": Browser.safari ? "left" : "right",
    "key-preview": Browser.safari ? "control-f12" : "ctrl-f12",
    "key-send": Browser.safari ? "command-control-k" : "alt-ctrl-k",
    "key-save": Browser.safari ? "command-control-s" : "alt-ctrl-s",
    "key-send-mail": Browser.safari ? "command-control-e" : "alt-ctrl-e",
    "default-action": "preview",
    "first-page": "options.html",
    "whatsnew-date": "2011/10/01",
    "whatsnew-page": "whatsnew#gr",
    "default-page": "options.html"
};
window.localStorage.lastAccessOptionsPage = $time();
if (Background === undefined) Background = {};
new Background.Settings;
Background.Options = new Class({
    initialize: function() {
        var a = this;
        chrome.extension.sendMessage({
            action: "get-options"
        }, function(b) {
            $settings.set(null, b, true);
            b = window.location.search;
            a.checkUser(function(c) {
                if (c && c.status == 200 && c.text) {
                    c = JSON.parse(c.text);
                    var d = $settings.get();
                    d.myEmail = c;
                    chrome.extension.sendMessage({
                        action: "set-options",
                        options: d
                    }, function() {})
                }
            });
            b.contains("action=fav-signin") && a.checkFavUser(function(c) {
                if (c && c.status == 200 && c.text) {
                    c = JSON.parse(c.text);
                    var d = $settings.get();
                    d.favAccount = c;
                    chrome.extension.sendMessage({
                        action: "set-options",
                        options: d
                    }, function() {})
                }
            });
            a.reset()
        })
    },
    reset: function() {
        $("save_button").disabled = true;
        $("reset_button").disabled = true;
        var a = $settings.get();
        if (a["key-send"] !== undefined && $("key_send")) $("key_send").value = a["key-send"];
        if (a["key-save"] !== undefined && $("key_save")) $("key_save").value = a["key-save"];
        if (a["key-preview"] !== undefined && $("key_preview")) $("key_preview").value = a["key-preview"];
        if (a["key-send-mail"] !== undefined && $("key_send_mail")) $("key_send_mail").value = a["key-send-mail"];
        if (a["key-send-kindle-mail"] !== undefined && $("key_send_kindle_mail")) $("key_send_kindle_mail").value = a["key-send-kindle-mail"];
        if (a["key-send-save"] !== undefined && $("key_send_save")) $("key_send_save").value = a["key-send-save"];
        a.myEmail = a.myEmail || {
            address: "",
            key: "",
            status: "",
            type: "gmail"
        };
        $$("input[name=verifyType]").some(function(b) {
            if (a.myEmail && a.myEmail.type === b.value) return b.checked = true
        });
        if (a["default-action"] && $("1-click")) $("1-click").checked = a["default-action"] == "send";
        if (a.keep_images !== undefined && $("keep_images")) $("keep_images").checked = a.keep_images;
        if (a.keep_paragraph_spacing !== undefined && $("keep_paragraph_spacing")) $("keep_paragraph_spacing").checked = a.keep_paragraph_spacing;
        if (a.throughwall !== undefined && $("throughwall")) $("throughwall").checked = a.throughwall;
        if (window.app_id == "SendToKindle") {
            if (a.address_name !== undefined && $("address_name")) $("address_name").value = a.address_name;
            if (a.address_domain !== undefined && $("address_domain")) $("address_domain").value = a.address_domain
        }
    },
    save: function() {
        var a = $settings.get();
        if ($("key_send")) a["key-send"] = $("key_send").value;
        if ($("key_save")) a["key-save"] = $("key_save").value;
        if ($("key_preview")) a["key-preview"] = $("key_preview").value;
        if ($("key_send_mail")) a["key-send-mail"] = $("key_send_mail").value;
        if ($("key_send_kindle_mail")) a["key-send-kindle-mail"] = $("key_send_kindle_mail").value;
        if ($("key_send_save")) a["key-send-save"] = $("key_send_save").value;
        if ($("1-click")) a["default-action"] = $("1-click").checked ? "send" : "preview";
        if ($("keep_images")) a.keep_images = $("keep_images").checked;
        if ($("keep_paragraph_spacing")) a.keep_paragraph_spacing = $("keep_paragraph_spacing").checked;
        if ($("throughwall")) a.throughwall = $("throughwall").checked;
        a.myEmail = a.myEmail || {
            address: "",
            key: "",
            status: "",
            type: "gmail"
        };
        $$("input[name=verifyType]").some(function(c) {
            if (!c.checked) return false;
            a.myEmail.type = c.value;
            return true
        });
        if (window.app_id == "SendToKindle") {
            var b = $("address_name").value;
            if (b.indexOf("@") >= 0) b = b.substr(0, b.indexOf("@"));
            b = b.trim();
            $("address_name").value = b;
            a.address_name = b;
            a.address_domain = $("address_domain").value
        }
        chrome.extension.sendMessage({
            action: "set-options",
            options: a
        }, function() {});
        $("save_status").fade("in");
        window.setTimeout(function() {
            $("save_status").fade("out")
        }, 500);
        $("save_button").disabled = true;
        $("reset_button").disabled = true
    },
    setStatus: function(a) {
        if ($("myEmailStatus")) if (a && a.length > 0) {
            $("myEmailStatus").set("text", a);
            $("myEmailStatus").setStyle("display", "")
        } else $("myEmailStatus").setStyle("display", "none")
    },
    setAlert: function(a) {
        if ($("myEmailAlert")) if (a && a.length > 0) {
            $("myEmailAlert").set("text", a);
            $("myEmailAlert").setStyle("display", "")
        } else $("myEmailAlert").setStyle("display", "none")
    },
    updateStates: function() {
        var a = $settings.get(),
            b = false;
        if ($("key_send")) b = b || a["key-send"] !== $("key_send").value;
        if ($("key_save")) b = b || a["key-save"] !== $("key_save").value;
        if ($("key_preview")) b = b || a["key-preview"] !== $("key_preview").value;
        if ($("key_send_mail")) b = b || a["key-send-mail"] !== $("key_send_mail").value;
        if ($("key_send_kindle_mail")) b = b || a["key-send-kindle-mail"] !== $("key_send_kindle_mail").value;
        if ($("key_send_save")) b = b || a["key-send-save"] !== $("key_send_save").value;
        if ($("1-click")) b = b || a["default-action"] == "send" !== $("1-click").checked;
        if ($("keep_images")) b = b || a.keep_images !== $("keep_images").checked;
        if ($("keep_paragraph_spacing")) b = b || a.keep_paragraph_spacing !== $("keep_paragraph_spacing").checked;
        if ($("throughwall")) b = b || a.throughwall !== $("throughwall").checked;
        a.myEmail = a.myEmail || {
            address: "",
            key: "",
            status: "",
            type: "gmail"
        };
        $$("input[name=verifyType]").some(function(c) {
            if (!c.checked) return false;
            if (a.myEmail.type !== c.value) b = true;
            return true
        }, this);
        if (window.app_id == "SendToKindle") {
            b = (b = b || a.address_name !== $("address_name").value) || a.address_domain !== $("address_domain").value;
            if ($("address_domain").value === "kindle.com") {
                $("kindle_com").className = "explain selected alert";
                $("free_kindle_com").className = "explain unselected"
            } else if ($("address_domain").value === "free.kindle.com") {
                $("kindle_com").className = "explain unselected";
                $("free_kindle_com").className = "explain selected"
            } else {
                $("kindle_com").className = "explain unselected";
                $("free_kindle_com").className = "explain unselected"
            }
        }
        if (a.myEmail && a.myEmail.address) {
            $("verifyEmail") && $("verifyEmail").setStyle("display", "none");
            $("clearEmail") && $("clearEmail").setStyle("display", "");
            $("myEmailType") && $("myEmailType").setStyle("display", "none");
            $("myEmailNotVerified") && $("myEmailNotVerified").setStyle("display", "none");
            if ($("myEmailVerified")) {
                $("myEmailVerified").setStyle("display", "");
                $("myEmailDescription") && $("myEmailDescription").setStyle("display", "none");
                this.setAlert("");
                if (a.myEmail.status == "ok") $("myEmail").set("html", a.myEmail.address);
                else if (a.myEmail.status == "pending") {
                    this.setAlert(chrome.i18n.getMessage("message_1"));
                    $("myEmail").set("html", a.myEmail.address + " <b>pending...</b>")
                } else $("myEmail").set("html", a.myEmail.address + " <b>" + a.myEmail.status + "</b>")
            }
            $("shortcuts_extra") && $("shortcuts_extra").setStyle("display", "")
        } else {
            $("verifyEmail") && $("verifyEmail").setStyle("display", "");
            $("clearEmail") && $("clearEmail").setStyle("display", "none");
            $("myEmailType") && $("myEmailType").setStyle("display", "");
            $("myEmailNotVerified") && $("myEmailNotVerified").setStyle("display", "");
            $("myEmailVerified") && $("myEmailVerified").setStyle("display", "none");
            $("myEmailDescription") && $("myEmailDescription").setStyle("display", "");
            this.setAlert("");
            $("shortcuts_extra") && $("shortcuts_extra").setStyle("display", "none")
        }
        if ($("myEmailStatus") && $("myEmailStatus").getStyle("display") !== "none") {
            $("myEmailVerified") && $("myEmailVerified").setStyle("display", "none");
            $("myEmailNotVerified") && $("myEmailNotVerified").setStyle("display", "none")
        }
        if ($("verifyByInstapaper") && $("verifyByInstapaper").checked) {
            $("findEmailEvernote") && $("findEmailEvernote").setStyle("display", "none");
            $("findEmailInstapaper") && $("findEmailInstapaper").setStyle("display", "");
            $("inputEvernoteEmail") && $("inputEvernoteEmail").setStyle("display", "none");
            $("inputInstapaperEmail") && $("inputInstapaperEmail").setStyle("display", "");
            $("verifyGmail") && $("verifyGmail").setStyle("display", "none");
            $("verifyEmail") && $("verifyEmail").setStyle("display", "none")
        } else if ($("verifyByEvernote") && $("verifyByEvernote").checked) {
            $("findEmailEvernote") && $("findEmailEvernote").setStyle("display", "");
            $("findEmailInstapaper") && $("findEmailInstapaper").setStyle("display", "none");
            $("inputEvernoteEmail") && $("inputEvernoteEmail").setStyle("display", "");
            $("inputInstapaperEmail") && $("inputInstapaperEmail").setStyle("display", "none");
            $("verifyGmail") && $("verifyGmail").setStyle("display", "none");
            $("verifyEmail") && $("verifyEmail").setStyle("display", "none")
        } else if ($("verifyByGoogleAccount") && $("verifyByGoogleAccount").checked) {
            $("findEmailEvernote") && $("findEmailEvernote").setStyle("display", "none");
            $("findEmailInstapaper") && $("findEmailInstapaper").setStyle("display", "none");
            $("inputEvernoteEmail") && $("inputEvernoteEmail").setStyle("display", "none");
            $("inputInstapaperEmail") && $("inputInstapaperEmail").setStyle("display", "none");
            $("verifyGmail") && $("verifyGmail").setStyle("display", "");
            $("verifyEmail") && $("verifyEmail").setStyle("display", "none")
        } else if ($("verifyByEmail") && $("verifyByEmail").checked) {
            $("findEmailEvernote") && $("findEmailEvernote").setStyle("display", "none");
            $("findEmailInstapaper") && $("findEmailInstapaper").setStyle("display", "none");
            $("inputEvernoteEmail") && $("inputEvernoteEmail").setStyle("display", "none");
            $("inputInstapaperEmail") && $("inputInstapaperEmail").setStyle("display", "none");
            $("verifyGmail") && $("verifyGmail").setStyle("display", "none");
            $("verifyEmail") && $("verifyEmail").setStyle("display", "")
        }
        if (a.favAccount && a.favAccount.token && a.favAccount.id) {
            $("favDemo") && $("favDemo").setStyle("display", "none");
            $("favHome") && $("favHome").setStyle("display", "");
            $("favSignin") && $("favSignin").setStyle("display", "none");
            $("favSignout") && $("favSignout").setStyle("display", "")
        } else {
            $("favDemo") && $("favDemo").setStyle("display", "");
            $("favHome") && $("favHome").setStyle("display", "none");
            $("favSignin") && $("favSignin").setStyle("display", "");
            $("favSignout") && $("favSignout").setStyle("display", "none")
        }
        $("save_button").disabled = !b || $("address_name") && !$("address_name").value;
        $("reset_button").disabled = !b
    },
    install: function() {
        $("save_button") && $("save_button").addEvent("click", this.save);
        $("reset_button") && $("reset_button").addEvent("click", this.reset);
        var a = ["delete", "backspace", "space", "enter", "shift", "alt", "ctrl"];
        $("key_send") && $("key_send").addEvent("keydown", function(c) {
            if (!a.contains(c.keyString())) $("key_send").value = c.keyString();
            c.preventDefault()
        });
        $("key_save") && $("key_save").addEvent("keydown", function(c) {
            if (!a.contains(c.keyString())) $("key_save").value = c.keyString();
            c.preventDefault()
        });
        $("key_preview") && $("key_preview").addEvent("keydown", function(c) {
            if (!a.contains(c.keyString())) $("key_preview").value = c.keyString();
            c.preventDefault()
        });
        $("key_send_mail") && $("key_send_mail").addEvent("keydown", function(c) {
            if (!a.contains(c.keyString())) $("key_send_mail").value = c.keyString();
            c.preventDefault()
        });
        $("key_send_kindle_mail") && $("key_send_kindle_mail").addEvent("keydown", function(c) {
            if (!a.contains(c.keyString())) $("key_send_kindle_mail").value = c.keyString();
            c.preventDefault()
        });
        $("key_send_save") && $("key_send_save").addEvent("keydown", function(c) {
            if (!a.contains(c.keyString())) $("key_send_save").value = c.keyString();
            c.preventDefault()
        });
        var b = this;
        $("verifyGmail") && $("verifyGmail").addEvent("click", function(c) {
            var d = $settings.get();
            b.setStatus(chrome.i18n.getMessage("message_6"));
            d.myEmail = {
                address: "",
                key: "",
                status: "",
                type: "gmail"
            };
            chrome.extension.sendMessage({
                action: "set-options",
                options: d
            }, function() {
                var e = $settings.getServer();
                if (e.indexOf("api2.klip.me") > 0) e = "http://cn.klip.me/";
                else if (e.indexOf("api.klip.me") > 0) e = "http://www.klip.me/";
                if (Browser.safari) window.location.href = e + "pushtophone/login?callback=" + encodeURIComponent(chrome.extension.getURL("options.html") + "?action=pushtomail-signin");
                else {
                    chrome.tabs.create({
                        url: e + "pushtophone/login?callback=" + encodeURIComponent(chrome.extension.getURL("options.html") + "?action=pushtomail-signin")
                    });
                    chrome.tabs.getCurrent(function(f) {
                        chrome.tabs.remove(f.id)
                    })
                }
            });
            c.preventDefault()
        });
        $("verifyEmail") && $("verifyEmail").addEvent("click", function(c) {
            var d = $settings.get(),
                e = window.prompt(chrome.i18n.getMessage("message_23"), "");
            if (e != null && e != "") {
                e = e.trim().toLowerCase();
                if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e)) {
                    b.setStatus(chrome.i18n.getMessage("message_3"));
                    d.myEmail = {
                        address: "",
                        key: "",
                        status: "",
                        type: "email"
                    };
                    b.newUser(e, function(f) {
                        if (f && f.status == 200 && f.text) {
                            f = JSON.parse(f.text);
                            d.myEmail = f;
                            chrome.extension.sendMessage({
                                action: "set-options",
                                options: d
                            }, function() {})
                        }
                        b.setStatus("")
                    })
                } else window.alert(chrome.i18n.getMessage("message_2"))
            }
            c.preventDefault()
        });
        $("inputEvernoteEmail") && $("inputEvernoteEmail").addEvent("click", function(c) {
            var d = $settings.get(),
                e = window.prompt(chrome.i18n.getMessage("message_7"), "");
            if (e != null && e != "") {
                e = e.trim().toLowerCase();
                if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e) || !e.endsWith("@m.evernote.com")) window.alert(chrome.i18n.getMessage("message_4"));
                else {
                    d.myEmail = {
                        address: "",
                        key: "",
                        status: "",
                        type: "evernote"
                    };
                    b.newUser(e, function(f) {
                        if (f && f.status == 200 && f.text) {
                            f = JSON.parse(f.text);
                            d.myEmail = f;
                            chrome.extension.sendMessage({
                                action: "set-options",
                                options: d
                            }, function() {})
                        }
                        b.setStatus("")
                    })
                }
            }
            c.preventDefault()
        });
        $("inputInstapaperEmail") && $("inputInstapaperEmail").addEvent("click", function(c) {
            var d = $settings.get(),
                e = window.prompt(chrome.i18n.getMessage("message_8"), "");
            if (e != null && e != "") {
                e = e.trim().toLowerCase();
                if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e) || !e.endsWith("@instapaper.com")) window.alert(chrome.i18n.getMessage("message_5"));
                else {
                    d.myEmail = {
                        address: "",
                        key: "",
                        status: "",
                        type: "instapaper"
                    };
                    b.newUser(e, function(f) {
                        if (f && f.status == 200 && f.text) {
                            f = JSON.parse(f.text);
                            d.myEmail = f;
                            chrome.extension.sendMessage({
                                action: "set-options",
                                options: d
                            }, function() {})
                        }
                        b.setStatus("")
                    })
                }
            }
            c.preventDefault()
        });
        $("clearEmail") && $("clearEmail").addEvent("click", function(c) {
            var d = $settings.get();
            $("myEmailDescription") && $("myEmailDescription").setStyle("display", "");
            b.setStatus("Clearing...");
            b.deleteUser(d.myEmail.address, d.myEmail.key, function() {
                var e = d.myEmail.type;
                d.myEmail = {
                    address: "",
                    key: "",
                    status: "",
                    type: "gmail"
                };
                chrome.extension.sendMessage({
                    action: "set-options",
                    options: d
                }, function() {
                    if (e == "gmail") {
                        var f = $settings.getServer();
                        if (f.indexOf("api2.klip.me") > 0) f = "http://cn.klip.me/";
                        else if (f.indexOf("api.klip.me") > 0) f = "http://www.klip.me/";
                        if (Browser.safari) window.location.href = f + "pushtophone/logout?callback=" + encodeURIComponent(chrome.extension.getURL("options.html") + "?action=pushtomail-signout");
                        else {
                            chrome.tabs.create({
                                url: f + "pushtophone/logout?callback=" + encodeURIComponent(chrome.extension.getURL("options.html") + "?action=pushtomail-signout")
                            });
                            chrome.tabs.getCurrent(function(g) {
                                chrome.tabs.remove(g.id)
                            })
                        }
                    }
                });
                b.setStatus("")
            });
            c.preventDefault()
        });
        $("favSignin") && $("favSignin").addEvent("click", function(c) {
            var d = $settings.get();
            d.favAccount = {
                address: "",
                token: "",
                status: 0,
                type: 0,
                mode: 0
            };
            chrome.extension.sendMessage({
                action: "set-options",
                options: d
            }, function() {
                var e = $settings.getServer();
                if (e.indexOf("api2.klip.me") > 0) e = "http://cn.klip.me/";
                else if (e.indexOf("api.klip.me") > 0) e = "http://www.klip.me/";
                if (Browser.safari) window.location.href = e + "fav/signin?callback=" + encodeURIComponent(chrome.extension.getURL("options.html") + "?action=fav-signin");
                else {
                    chrome.tabs.create({
                        url: e + "fav/signin?callback=" + encodeURIComponent(chrome.extension.getURL("options.html") + "?action=fav-signin")
                    });
                    chrome.tabs.getCurrent(function(f) {
                        chrome.tabs.remove(f.id)
                    })
                }
            });
            c.preventDefault()
        });
        $("favSignout") && $("favSignout").addEvent("click", function(c) {
            var d = $settings.get();
            d.favAccount = {
                address: "",
                token: "",
                status: 0,
                type: 0,
                mode: 0
            };
            chrome.extension.sendMessage({
                action: "set-options",
                options: d
            }, function() {
                window.location.href = chrome.extension.getURL("options.html") + "?action=fav-signout"
            });
            c.preventDefault()
        });
        $("favDemo") && $("favDemo").addEvent("click", function(c) {
            var d = $settings.getServer();
            if (d.indexOf("api2.klip.me") > 0) d = "http://cn.klip.me/";
            else if (d.indexOf("api.klip.me") > 0) d = "http://www.klip.me/";
            window.location.href = d + "fav/demo";
            c.preventDefault()
        });
        $("favHome") && $("favHome").addEvent("click", function(c) {
            var d = $settings.getServer();
            if (d.indexOf("api2.klip.me") > 0) d = "http://cn.klip.me/";
            else if (d.indexOf("api.klip.me") > 0) d = "http://www.klip.me/";
            window.location.href = d + "fav/my";
            c.preventDefault()
        });
        this.timerID = this.updateStates.periodical(200, this);
        this.reset()
    },
    uninstall: function() {
        $("save_button") && $("save_button").removeEvent("click", this.save);
        $("reset_button") && $("reset_button").removeEvent("click", this.reset);
        $clear(this.timerID)
    },
    newUser: function(a, b) {
        var c = $settings.getServer();
        (new Request({
            url: c + "v1/pushtophone/newUser",
            method: "GET",
            onSuccess: function(d) {
                b({
                    text: d,
                    status: 200
                })
            },
            onFailure: function(d) {
                b({
                    text: "",
                    status: d.status
                })
            }
        })).send("email=" + a + "&language=" + chrome.i18n.getMessage("extLanguage"))
    },
    deleteUser: function(a, b, c) {
        var d = $settings.getServer();
        (new Request({
            url: d + "v1/pushtophone/deleteUser",
            method: "GET",
            onSuccess: function(e) {
                c({
                    text: e,
                    status: 200
                })
            },
            onFailure: function(e) {
                c({
                    text: "",
                    status: e.status
                })
            }
        })).send("email=" + a + "&key=" + b)
    },
    checkUser: function(a) {
        var b = $settings.getServer();
        if (b.indexOf("api2.klip.me") > 0) b = "http://cn.klip.me/";
        else if (b.indexOf("api.klip.me") > 0) b = "http://www.klip.me/";
        b = new Request({
            url: b + "v1/pushtophone/checkUser",
            method: "GET",
            onSuccess: function(e) {
                a({
                    text: e,
                    status: 200
                })
            },
            onFailure: function(e) {
                a({
                    text: "",
                    status: e.status
                })
            }
        });
        var c = $settings.get(),
            d = "";
        if (c.myEmail) {
            if (c.myEmail.key) d = "key=" + c.myEmail.key;
            if (c.myEmail.address) {
                if (d != "") d += "&";
                d += "email=" + c.myEmail.address
            }
        }
        b.send(d)
    },
    checkFavUser: function(a) {
        var b = $settings.getServer();
        if (b.indexOf("api2.klip.me") > 0) b = "http://cn.klip.me/";
        else if (b.indexOf("api.klip.me") > 0) b = "http://www.klip.me/";
        (new Request({
            url: b + "v1/fav/checkUser",
            method: "GET",
            onSuccess: function(c) {
                a({
                    text: c,
                    status: 200
                })
            },
            onFailure: function(c) {
                a({
                    text: "",
                    status: c.status
                })
            }
        })).send()
    }
});
window.addEvent("domready", function() {
    (new Background.Options).install();
    (new Background.i18n).translate(document)
});