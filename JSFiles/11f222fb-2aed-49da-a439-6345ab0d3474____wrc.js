/**
 *
 *  Avast WebRep plugin
 *  (c) 2012 Avast Corp.
 *
 *
 *
 *  Testing Phishing and SiteCorrect sites:
 *
 *  (http(s)?://)test-phishing.ff.avast.com(/)? phishing site / phishing domain
 *  (http(s)?://)test-typo.ff.avast.com(.*) sitecorrect suggestion  www.avast.com
 *  (http(s)?://)test-blocker.ff.avast.com(.*) blocker site
 *
 *
 *
 *
 *
 */

(function (_, PROTO) {
    "use strict";

    if (typeof (AvastWRC) === "undefined") {
        AvastWRC = {};
    }

    var TTL_DATE_FORMAT = "yyyymmddHHMMss";

    // event types (AvastWRC.gpb.All.EventType)
    var EV_TYPE_CLICK = 0;
    var EV_TYPE_TABFOCUS = 3;

    var DEBUG_MODE = false;

    /**
     * Throttle function to prevent flooding of our servers
     *
     * Orignal version is part of underscore.js library.
     *
     * @param  {Function} func Function to be executed by at least 'wait' miliseconds
     * @param  {Number}   wait Miliseconds to wait before executing the function
     * @return {Function}      Wrapped up original function with throttling
     */
    function throttle(func, wait) {
        var context, args, timeout, result;
        var previous = 0;
        var later = function () {
            previous = new Date();
            timeout = null;
            result = func.apply(context, args);
        };
        return function () {
            var now = new Date();
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
            } else if (!timeout) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    }

    /*******************************************************************************
     *
     *  AvastWRC Defaults
     *
     ******************************************************************************/
    _.extend(AvastWRC, {
        DEFAULTS: {
            LOG: true,
            USER: null,
            // Throttling requests by given amount of miliseconds
            THROTTLE: 250,
            // default ttl used in results (if not provided by the server)
            TTL: 3600,
            // local storage names for caching
            CACHE: {
                DOMAIN: "urlinfo"
            },
            // list of url schemes we should not handle
            IGNORE_TABS: {
                "^secure://": [
                    "ALL"
                ],
                "^chrome:\\/\\/": [
                    "ALL"
                ],
                "^chrome-extension:": [
                    "ALL"
                ],
                "^moz-extension:": [
                    "ALL"
                ],
                "^ms-browser-extension:": [
                    "ALL"
                ],
                "^chrome-devtools:\\/\\/": [
                    "ALL"
                ],
                "^https:\\/\\/chrome\\.google\\.com\\/webstore": [
                    "ALL"
                ],
                "^about:": [
                    "ALL"
                ],
                "^view-source:": [
                    "ALL"
                ],
                "^file:\\/\\/": [
                    "ALL"
                ],
                "^http(s)?:\\/\\/([\\w|\\d]+:[\\w|\\d]+@)?localhost": [
                    "ALL"
                ],
                "^data:text\\/html": [
                    "ALL"
                ],
            },
            // webrep flags bit mask
            WEBREP_FLAGS_MASK: {
                shopping: 1,
                social: 2,
                news: 4,
                it: 8,
                corporate: 16,
                pornography: 32,
                violence: 64,
                gambling: 128,
                drugs: 256,
                illegal: 512,
                others: 1024,
            }
        },
        CORE_DEFAULT_SETTINGS: { // core defaults
            current: {
                callerId: 0,  // Not set by default
                userId: null,  // Persisted userId
            },
            features: {
                safePrice: true
            },
            userSPPoppupSettings: {
                help: {
                    selected: false,
                    settingsChanged: false,
                },
                notifications: {
                    selected: true,
                    settingsChanged: false,
                    offers: {
                        showAlways: true,// show always
                        showBetter: false,// show better than the original price
                        hide: false,// hide
                    },
                    accommodations: {
                        showBetter: true,// show better than the original price
                        showSimilar: true,// show similar hotels
                        showPopular: true,// show popular hotels
                    },
                    coupons: {
                        showAlways: true, // show always
                        showOnce: false, // show once
                        hide: false, // hide notifications
                    },
                    others: {
                        showAlways: true, // show always
                    },
                    standard: {
                        position: { top: 16, right: 16 }
                    },
                    panel: {
                        position: { top: 16, right: 16 }
                    },
                    minimized: {
                        position: { top: 16, right: 16 }
                    }
                },
                customList: {
                    selected: false,
                    showAddButton: true,
                    settingsChanged: false,
                    whiteList: []
                },
                privacy: {
                    selected: false,
                    settingsChanged: false,
                    accepted: true,
                },
                defaultMenuChanged: false,
                defaultMenu: "notifications"
            }
        }
    });


    /*******************************************************************************
     *
     *  AvastWRC Config
     *
     ******************************************************************************/

    _.extend(AvastWRC,
        {
            // Default properties - will/should be overwritten, once connected to avast! program
            CONFIG: {
                VERSION: 8,
                // GUID - obtained from avast program
                GUID: null,
                // AUID - obtained from avast program
                AUID: null,
                // HWID - hardwareId/MIDEX obtained from avast program
                HWID: null,
                // UUID - user ID - obtained from avast program
                UUID: null,
                // userId - persisting userId from cookie to use in identity calls
                USERID: null,
                LOCAL_ENABLED: true, // Can we connect to avast! proram on localhost?
                CALLERID: 8020, // Caller ID: A7R5=1 A8=2 TEST 10000
                EXT_TYPE: 2, // Extension type for UrlInfo SP = 2;
                EXT_VER: 15,
                DATA_VER: 15,
                EDITION: 0,
                BRANDING_TYPE: 0,
                SAFESHOP: 0,
                // WTU search url
                InstallDate: "",
                InstallTimestamp: "",
                serverType: 0,
                providerType: "",
                SOURCE_ID: "",
                startTime: (new Date()).getTime()
            },
        });

    /*******************************************************************************
     *
     *  AvastWRC Core
     *
     ******************************************************************************/

    _.extend(AvastWRC,
        {
            // Export constants
            EXT_TYPE_SP: 2,

            BRANDING_TYPE_AVAST: 0,
            BRANDING_TYPE_AVG: 1,

            browserVersion: 0,
            bs: {},

            /**
             * Start new avast core
             * @return {Object} Self reference;
             */
            init: function () {

                // we can connect to avast! on localhost only on windows - update the property
                AvastWRC.CONFIG.LOCAL_ENABLED = AvastWRC.Utils.getBrowserInfo().isWindows() && !AvastWRC.Utils.getBrowserInfo().isEdge();
                AvastWRC.CONFIG.VERSION = AvastWRC.bs.getVersion();
                AvastWRC.CONFIG.DEBUG_MODE = AvastWRC.storageCache.get("DEBUG_MODE") || DEBUG_MODE;

                if (!AvastWRC.CONFIG.DEBUG_MODE) {
                    console = console || {};
                    console.log = function () {
                    };
                }

                AvastWRC.CONFIG.serverType = AvastWRC.storageCache.get("server") || 0;
                AvastWRC.CONFIG.providerType = AvastWRC.storageCache.get("provider") || "";

                AvastWRC.CONFIG.InstallDate = AvastWRC.storageCache.get("InstallDate") || "";

                let newInstall = !AvastWRC.CONFIG.InstallDate;
                AvastWRC.CONFIG.NEW_INSTALL = newInstall;

                if (AvastWRC.CONFIG.InstallDate === "") {
                    AvastWRC.CONFIG.InstallDate = AvastWRC.Utils.getDateAsString();
                    AvastWRC.storageCache.save("InstallDate", AvastWRC.CONFIG.InstallDate);
                }

                AvastWRC.CONFIG.InstallTimestamp = AvastWRC.storageCache.get("InstallTimestamp") || "";
                if (AvastWRC.CONFIG.InstallTimestamp === "") {
                    AvastWRC.CONFIG.InstallTimestamp = AvastWRC.Utils.getInstallTime(AvastWRC.CONFIG.InstallDate);
                    AvastWRC.storageCache.save("InstallTimestamp", AvastWRC.CONFIG.InstallTimestamp);
                }

                AvastWRC.CONFIG.OPT_IN = AvastWRC.storageCache.get("opt_in") || { functional: false, privacy: false, timeStamp: 0, show4Version: "12.0.0" };
                if (!AvastWRC.CONFIG.OPT_IN.showNextTime)
                    AvastWRC.CONFIG.OPT_IN.showNextTime = false;
                if (AvastWRC.Utils.getBrowserInfo().isFirefox()) {
                    if (this.showOptInMessage()) {
                        AvastWRC.showOptIn();
                    } else if (AvastWRC.CONFIG.OPT_IN.functional) {
                        AvastWRC.bal.init();
                    }
                }
                else {
                    AvastWRC.bal.init();
                }
                return this;
            },
            showOptIn: function(){
                let tabId = null;
                let isAvast = AvastWRC.CONFIG.BRANDING_TYPE === AvastWRC.BRANDING_TYPE_AVAST;
                AvastWRC.CONFIG.OPT_IN_DATA = {
                    url: AvastWRC.getLandingPageURL(),
                    isENLang: ABEK.locale.getBrowserLang().toLowerCase() === "en",
                    spOptInTitle: AvastWRC.bs.getLocalizedString("spOptInTitle"),
                    spOptInTitleB: AvastWRC.bs.getLocalizedString(isAvast ? "spOptInTitleBAvast" : "spOptInTitleBAVG"),
                    spOptInPolice: AvastWRC.bs.getLocalizedString("spOptInPolice"),
                    spOptInPoliceB: AvastWRC.bs.getLocalizedString(isAvast ? "spOptInPoliceBAvast" : "spOptInPoliceBAVG"),
                    spOptInPolice1: AvastWRC.bs.getLocalizedString("spOptInPolice1"),
                    spOptInPolice2: AvastWRC.bs.getLocalizedString("spOptInPolice2"),
                    spOptInPolice3: AvastWRC.bs.getLocalizedString("spOptInPolice3"),
                    spOptInPoliceLink: AvastWRC.bs.getLocalizedString("spOptInPoliceLink"),
                    spOptInPoliceAccept: AvastWRC.bs.getLocalizedString("spOptInPoliceAccept"),
                    spOptInPoliceAcceptB: AvastWRC.bs.getLocalizedString("spOptInPoliceAcceptB"),
                    spOptInPoliceDeny: AvastWRC.bs.getLocalizedString("spOptInPoliceDeny"),
                    spOptInSecondTitle: AvastWRC.bs.getLocalizedString("spOptInSecondTitle"),
                    spOptInSecondTitleB: AvastWRC.bs.getLocalizedString(isAvast ? "spOptInSecondTitleBAvast" : "spOptInSecondTitleBAVG"),
                    spOptInSecondText: AvastWRC.bs.getLocalizedString("spOptInSecondText"),
                    spOptInSecondReviewConsent: AvastWRC.bs.getLocalizedString("spOptInSecondReviewConsent"),
                    spOptInSecondClose: AvastWRC.bs.getLocalizedString("spOptInSecondClose"),
                    logo: AvastWRC.bs.getLocalImageURL("sp-logo-panel.png"),
                    piggy: AvastWRC.bs.getLocalImageURL("icon-piggy.png"),
                    mark: AvastWRC.bs.getLocalImageURL("icon-exclamation-mark.png"),
                    check: AvastWRC.bs.getLocalImageURL("check.png"),
                    cross: AvastWRC.bs.getLocalImageURL("cross.png"), 
                    iconExclamationMarkOptIn: AvastWRC.bs.getLocalImageURL("icon-exclamation-mark-opt-in.png"),
                    iconLogo: AvastWRC.bs.getLocalImageURL("logo-opt-in.png")
                };
                chrome.runtime.onMessage.addListener(function (request, sender, senderResponse) {
                    request.tab = sender.tab;
                    return onOptIn(request, tabId);
                });

                chrome.tabs.create({ url: AvastWRC.CONFIG.OPT_IN_DATA.url }, function (tab) {
                    tabId = tab.id;
                    let now = new Date();
                    AvastWRC.CONFIG.OPT_IN.timeStamp = Math.round(now.getTime() / 1000.0);
                    AvastWRC.CONFIG.OPT_IN.show4Version = chrome.runtime.getManifest().version;
                    AvastWRC.CONFIG.OPT_IN.showNextTime = false;
                    AvastWRC.storageCache.save("opt_in", AvastWRC.CONFIG.OPT_IN);
                });
            },
            getLandingPageURL: function () {
                let configs = {
                    "AVAST": {
                        brandingType: "avast",
                        endpoint: "/lp-safeprice-welcome-new"
                    },
                    "AVG": {
                        brandingType: "avg",
                        endpoint: "/welcome/safeprice-new"
                    }
                };

                let brandingSpecifics = AvastWRC.CONFIG.BRANDING_TYPE === AvastWRC.BRANDING_TYPE_AVG ? configs.AVG : configs.AVAST;
                let lang = ABEK.locale.getBrowserLang();

                let url = `https://platform.${brandingSpecifics.brandingType}.com/SP/Onboarding/?utm_medium=link&utm_source=safeprice&utm_campaign=safeprice-onboarding&language=${lang}`;

                return url;
            },

            showOptInMessage: function () {
                if (AvastWRC.CONFIG.NEW_INSTALL || AvastWRC.CONFIG.OPT_IN.showNextTime) {
                    return true;
                }
                if (!AvastWRC.CONFIG.OPT_IN.functional && chrome.runtime.getManifest().version !== AvastWRC.CONFIG.OPT_IN.show4Version){
                    AvastWRC.CONFIG.OPT_IN.showNextTime = true;
                    AvastWRC.storageCache.save("opt_in", AvastWRC.CONFIG.OPT_IN);
                }
                return false;
            },
            getBrowserVersion: function () {
                var version = 0;
                var found = AvastWRC.Utils.getBrowserInfo().getBrowserVersion().match(/(\d)+/);
                if (typeof found === "object" && found !== null && found.length > 0) version = parseInt(found[0]);
                return version;
            },
            /**
             * Return contents of the localStorage for a given storage name
             * @param  {String} key Storage name
             * @return {String}     Storage contents
             */
            getWindowStorage: function (key) {
                // THIS SHOULD BE REFACTORED - move all browser specific overrides to one place

                if (this.browserVersion === 0) this.browserVersion = this.getBrowserVersion();
                if (AvastWRC.Utils.getBrowserInfo().isFirefox() && this.browserVersion < 48 || typeof localStorage === "undefined") {
                    return AvastWRC.bs.getLocalStorage().getItem(storage);
                } else {
                    return localStorage[key];
                }
            },
            /**
             * Return contents of the browser.storage.local for a given storage name
             * @param  {String} storage Storage name
             * @param  {callback} function(result)
             */
            getStorage: function (storage, callback) {
                // THIS SHOULD BE REFACTORED - move all browser specific overrides to one place

                if (this.browserVersion === 0) this.browserVersion = this.getBrowserVersion();
                if (AvastWRC.Utils.getBrowserInfo().isSafari() || AvastWRC.Utils.getBrowserInfo().isFirefox() && this.browserVersion < 48 || typeof localStorage === "undefined") {
                    callback(JSON.parse(AvastWRC.bs.getLocalStorage().getItem(storage)));
                    return;
                } else {
                    return AvastWRC.bs.getLocalStorage(storage, callback);
                }
            },
            /**
             * Return Promise of the browser.storage.local for a given storage name
             * @param  {String} storage Storage name
             */
            getStorageAsync: function (storage) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this.getStorage(storage, function (data, err) {
                        let v = data || null;
                        resolve({ key: storage, value: data });
                    });
                });
            },

            /**
             * Save data to local storage
             * @param {String} key Storage name
             * @param {String} data    Storage
             */
            setStorage: function (key, data) {
                // save it to local storage
                if (this.browserVersion === 0) this.browserVersion = this.getBrowserVersion();
                if (AvastWRC.Utils.getBrowserInfo().isSafari() || AvastWRC.Utils.getBrowserInfo().isFirefox() && this.browserVersion < 48 || typeof localStorage === "undefined") {
                    AvastWRC.bs.getLocalStorage().setItem(key, JSON.stringify(data));
                } else {
                    AvastWRC.bs.setLocalStorage(key, data);
                }
            },


            /**
             * Handler for tabs.onRemoved events. Clears the tab TabReqCache.
             * If tab was closed, sends a request containing object {url, tabId, windowId}
             * If whole browser was closed, sends an array of objects {url, tabId}             *
             */
            onTabRemoved: function (tabId, removeInfo) {
                // isWindowClosing true = whole browser was shut down || false = tab was shut down
                if (removeInfo && removeInfo.isWindowClosing) {
                    if (AvastWRC.Utils.Burger) {
                        AvastWRC.Utils.Burger.initBurger(true/*sendAll*/);
                    } else {
                        console.log("no burger lib");
                    }
                }
                AvastWRC.TabReqCache.drop(tabId);
            },

            /**
             * Handles the onSendHeaders event to retrieve data (referer URL) from the request headers.
             * Stores retrieved data into AvastWRC.TabReqCache.
             * @param {Object} details event details
             */
            onSendHeaders: function (details) {
                if (details.type === "main_frame") {
                    AvastWRC.TabReqCache.drop(details.tabId);

                    var referer = AvastWRC.bs.retrieveRequestHeaderValue(details.requestHeaders, "Referer");
                    AvastWRC.TabReqCache.set(details.tabId, "referer", referer);

                    AvastWRC.bal.sp.setBadge(details.tabId, null, false/*no animation*/);
                    AvastWRC.bal.sp.disableBadgeAnimation(details.tabId);
                    AvastWRC.bal.emitEvent("control.hide", details.tabId);

                    if (AvastWRC.ASDetector) {
                        console.log("DETECTOR: AvastWRC.ASDetector available");
                        AvastWRC.ASDetector.onNavigationEvent(details.tabId,
                            details.url,
                            details.requestId,
                            details.timeStamp);
                    }
                }
            },

            avastConfig: {
                load: function () {
                    let localAvastConfig = AvastWRC.storageCache.get(AvastWRC.avastConfig.config.localStorageKeyName) || {};

                    if (typeof localAvastConfig === "string") {
                        localAvastConfig = JSON.parse(localAvastConfig);
                    }

                    for (let key in localAvastConfig) {
                        if (localAvastConfig[key] && isBase64Encoded(localAvastConfig[key])) localAvastConfig[key] = window.atob(localAvastConfig[key]);
                    }

                    if (localAvastConfig) {
                        AvastWRC.CONFIG.GUID = localAvastConfig.guid || null;
                        AvastWRC.CONFIG.AUID = localAvastConfig.auid || null;
                        AvastWRC.CONFIG.UUID = localAvastConfig.uuid || null;
                        AvastWRC.CONFIG.HWID = localAvastConfig.hwid || null;
                    }

                    AvastWRC.CONFIG.PLG_GUID = localAvastConfig.plg_guid || AvastWRC.Utils.getRandomUID();

                    AvastWRC.avastConfig.set({
                        "guid": AvastWRC.CONFIG.GUID,
                        "plg_guid": AvastWRC.CONFIG.PLG_GUID,
                        "auid": AvastWRC.CONFIG.AUID,
                        "hwid": AvastWRC.CONFIG.HWID,
                        "uuid": AvastWRC.CONFIG.UUID,
                    });

                    function isBase64Encoded(value) {
                        let base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/,
                            sha256Regex = /[A-Fa-f0-9]{64}/; // sha256 hash matches base64 regex expression, just to avoid to decode a hashed value to base64 before it was encoded to base64.

                        return !sha256Regex.test(value) && base64Regex.test(value);
                    }
                },
                set: function (avastConfig) {
                    let avastConfigEncoded = JSON.parse(JSON.stringify(avastConfig));

                    for (let key in avastConfig) {
                        if (avastConfigEncoded[key]) avastConfigEncoded[key] = window.btoa(avastConfig[key]);
                    }

                    AvastWRC.storageCache.save(AvastWRC.avastConfig.config.localStorageKeyName, JSON.stringify(avastConfigEncoded));
                },
                config: {
                    localStorageKeyName: "AvastConfig"
                }
            }
        });


    AvastWRC.Browser = {};

    AvastWRC.storageCache = {
        data: {
            domainsWhiteList: {
                key: "domainsWhiteList",
                isAsync: true,
                value: null,
            },
            sp_debug_server: {
                key: "sp_debug_server",
                isAsync: false,
                value: null,
            },
            update: {
                key: "update",
                isAsync: true,
                value: null,
            },
            settings: {
                key: "settings",
                isAsync: true,
                value: null,
            },
            landingPageShown: {
                key: "landingPageShown",
                isAsync: true,
                value: null,
            },
            installedVersion: {
                key: "installedVersion",
                isAsync: true,
                value: null,
            },
            __NOTIFICATIONS__: {
                key: "__NOTIFICATIONS__",
                isAsync: true,
                value: null,
            },
            YesNo: {
                key: "YesNo",
                isAsync: true,
                value: null,
            },
            Social: {
                key: "Social",
                isAsync: true,
                value: null,
            },
            Shepherd: {
                key: "Shepherd",
                isAsync: true,
                value: null,
            },
            SettingsTooltip: {
                key: "SettingsTooltip",
                isAsync: true,
                value: null,
            },
            InstallTimestamp: {
                key: "InstallTimestamp",
                isAsync: true,
                value: null,
            },
            InstallDate: {
                key: "InstallDate",
                isAsync: true,
                value: null,
            },
            HeartBeat: {
                key: "HeartBeat",
                isAsync: true,
                value: null,
            },
            CloseTooltip: {
                key: "CloseTooltip",
                isAsync: true,
                value: null,
            },
            BE: {
                key: "BE",
                isAsync: true,
                value: null,
            },
            AvastConfig: {
                key: "AvastConfig",
                isAsync: true,
                value: null,
            },
            server: {
                key: "server",
                isAsync: false,
                value: null,
            },
            DEBUG_MODE: {
                key: "DEBUG_MODE",
                isAsync: false,
                value: null,
            },
            provider: {
                key: "provider",
                isAsync: false,
                value: null,
            },
            countryIP: {
                key: "countryIP",
                isAsync: false,
                value: null,
            },
            server_burger: {
                key: "server_burger",
                isAsync: false,
                value: null,
            },
            max_burger_messages: {
                key: "max_burger_messages",
                isAsync: false,
                value: null,
            },
            send_burger_interval: {
                key: "send_burger_interval",
                isAsync: false,
                value: null,
            },
            opt_in: {
                key: "opt_in",
                isAsync: true,
                value: null,
            }
        },

        loadSyncStorageAndGetAsyncData: () => {
            var data = AvastWRC.storageCache.data;
            let storageValues = [];
            for (var storageKey in data) {
                if (!AvastWRC.storageCache.isAsync(storageKey)) {
                    AvastWRC.storageCache.save(storageKey, AvastWRC.getWindowStorage(storageKey));
                } else {
                    storageValues.push(AvastWRC.getStorageAsync(storageKey));
                }
            }
            return storageValues;
        },

        load: () => {
            let asyncData = AvastWRC.storageCache.loadSyncStorageAndGetAsyncData() || [];

            Promise.all(asyncData).then((values) => {
                values.forEach(element => {
                    AvastWRC.storageCache.save(element.key, element.value);
                });

                console.log("New storage", AvastWRC.storageCache.data);

                AvastWRC.init();
            });
        },

        isAsync: (key) => {
            if (AvastWRC.storageCache.data[key]) {
                return AvastWRC.storageCache.data[key].isAsync;
            } else {
                console.log('====================================');
                console.log("Trying to know if a key is in async storage but not exist: ", key);
                console.log('====================================');
                return null;
            }
        },

        get: (key) => {
            //return this.data
            if (AvastWRC.storageCache.data[key]) {
                return AvastWRC.storageCache.data[key].value;
            } else {
                console.log('====================================');
                console.log("Trying to get a key in storage but not exist: ", key);
                console.log('====================================');
                return null;
            }

        },

        save: (key, value) => {
            if (AvastWRC.storageCache.data[key]) {
                AvastWRC.storageCache.data[key].value = value;
                if (AvastWRC.storageCache.isAsync(key)) {
                    AvastWRC.setStorage(AvastWRC.storageCache.data[key].key, value);
                }
            } else {
                console.log('====================================');
                console.log("Trying to save a key in storage but not exist: ", key);
                console.log('====================================');
            }
        }
    };
    /*******************************************************************************
     *
     *  AvastWRC Tab Request cache/store
     *
     *  @author: Martin Havelka, Salsita Software
     *
     ******************************************************************************/

    AvastWRC.TabReqCache = {
        reqCache: {},

        set: function (tab_id, key, value) {
            var tab_rec = this.reqCache[tab_id];
            if (tab_rec) {
                tab_rec[key] = value;
            } else {
                tab_rec = {};
                tab_rec[key] = value;
                this.reqCache[tab_id] = tab_rec;
            }
        },

        get: function (tab_id, key) {
            var ret = null;
            var tab_rec = this.reqCache[tab_id];
            if (tab_rec) {
                ret = tab_rec[key];
            }
            return ret;
        },

        drop: function (tab_id) {
            if (this.reqCache[tab_id]) delete this.reqCache[tab_id];
        },

        dropByKey: function (tab_id, key) {
            if (this.reqCache[tab_id] && this.reqCache[tab_id][key]) delete this.reqCache[tab_id][key];
        }
    };

    AvastWRC.UtilsCache = {
        cache: {},
        set: function (key, value_id, value) {
            var cach_val = this.cache[key];
            if (cach_val) {
                cach_val[value_id] = value;
            } else {
                cach_val = {};
                cach_val[value_id] = value;
                this.cache[key] = cach_val;
            }
        },

        get: function (key, value_id) {
            var ret = null;
            var cach_val = this.cache[key];
            if (cach_val) {
                ret = cach_val[value_id];
            }
            return ret;
        },

        drop: function (key) {
            if (this.cache[key]) delete this.cache[key];
        },

        remove: function (key, value_id) {
            if (this.cache[key] && this.cache[key][value_id]) delete this.cache[key][value_id];
        },
    };

    /*******************************************************************************
     *
     *  AvastWRC Queue
     *
     *  @author: Viktor Gräber
     *
     ******************************************************************************/

    AvastWRC.Queue = {
        queue: {},

        set: function (key, value) {
            var key_rec = this.queue[key];
            if (key_rec) {
                key_rec.push(value);
            } else {
                key_rec = [];
                key_rec.push(value);
                this.queue[key] = key_rec;
            }
        },

        get: function (key) {
            var ret = null;
            var key_rec = this.queue[key];
            if (key_rec) {
                ret = key_rec.pop();
            }
            return ret;
        },

        drop: function (key) {
            if (this.queue[key]) delete this.queue[key];
        },
    };

    /*******************************************************************************
     *
     *  dateFormat impl.
     *
     *   - former "dateFormat.js"
     *
     *  @author: --
     *
     ******************************************************************************/

    var dateFormat = function () {
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            var dF = dateFormat;

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length === 1 && Object.prototype.toString.call(date) === "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date();
            if (isNaN(date)) throw SyntaxError("invalid date");

            mask = String(dF.masks[mask] || mask || dF.masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) === "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d: d,
                    dd: pad(d),
                    ddd: dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m: m + 1,
                    mm: pad(m + 1),
                    mmm: dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy: String(y).slice(2),
                    yyyy: y,
                    h: H % 12 || 12,
                    hh: pad(H % 12 || 12),
                    H: H,
                    HH: pad(H),
                    M: M,
                    MM: pad(M),
                    s: s,
                    ss: pad(s),
                    l: pad(L, 3),
                    L: pad(L > 99 ? Math.round(L / 10) : L),
                    t: H < 12 ? "a" : "p",
                    tt: H < 12 ? "am" : "pm",
                    T: H < 12 ? "A" : "P",
                    TT: H < 12 ? "AM" : "PM",
                    Z: utc ? "UTC" : (String(date).match(timezone) || ["",]).pop().replace(timezoneClip, ""),
                    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S: ["th", "st", "nd", "rd",][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10],
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    // Some common format strings
    dateFormat.masks = {
        "default": "ddd mmm dd yyyy HH:MM:ss",
        shortDate: "m/d/yy",
        mediumDate: "mmm d, yyyy",
        longDate: "mmmm d, yyyy",
        fullDate: "dddd, mmmm d, yyyy",
        shortTime: "h:MM TT",
        mediumTime: "h:MM:ss TT",
        longTime: "h:MM:ss TT Z",
        isoDate: "yyyy-mm-dd",
        isoTime: "HH:MM:ss",
        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
    };

    // Internationalization strings
    dateFormat.i18n = {
        dayNames: [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
        ],
        monthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
        ],
    };

    /*******************************************************************************
     *
     *  AvastWRC UTILS
     *
     *
     *  @author: Ondrej Masek
     *
     ******************************************************************************/

    AvastWRC.Utils = {

        /**
         * Throttle function.
         */
        throttle: throttle, // exporting the function, see above

        /**
         * Date formating implementaton.
         * @param {Date} date to format
         * @param {String} mask to format the date to
         * @param {String} (optional) date UTC
         */
        dateFormat: dateFormat,

        getDateAsString: function () {
            var d = new Date();
            return d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        },

        getInstallTime: function (dateAsString) {
            var now = new Date();
            console.log("getInstallTime -> now", dateAsString, now);
            if (dateAsString !== "") {
                var myDate = dateAsString.split("/");
                //DateFormat(year, month, day, hours, minutes, seconds, milliseconds)
                var year = myDate[0];
                var month = myDate[1];
                var day = myDate[2].split(" ")[0];
                var hours = myDate[2].split(" ")[1].split(":")[0];
                var minutes = myDate[2].split(" ")[1].split(":")[1];
                var seconds = myDate[2].split(" ")[1].split(":")[2];
                now = new Date(year, month, day, hours, minutes, seconds);
                console.log("getInstallTime -> new string from InstallDate in localstorage: ", dateAsString, "params to build timestamp: ", year, month, day, hours, minutes, seconds, "now: ", now);
            }
            var timestamp = Math.round(now.getTime() / 1000.0);
            console.log("getInstallTime -> new timestamp: ", timestamp);
            return timestamp;
        },

        /**
         * Generate random UID.
         */
        getRandomUID: function () {
            var genericGuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
            var hex = "0123456789abcdef";
            var r = 0;
            var guid = "";
            for (var i = 0; i < genericGuid.length; i++) {
                if (genericGuid[i] !== "-" && genericGuid[i] !== "4") {
                    r = Math.random() * 16 | 0;
                }
                if (genericGuid[i] === "x") {
                    guid += hex[r];
                } else if (genericGuid[i] === "y") {
                    r &= 0x3;  //  (sample:?0??)
                    r |= 0x8;  // (sample:1???)
                    guid += hex[r];
                } else {
                    guid += genericGuid[i];
                }
            }
            return guid;
        },

        /**
         * Parse price value from price string in cents.
         * @param {String}  string with price value
         * @return {Number} price value $7.99 -> 799
         */
        getPriceValue: function (price) {
            var priceStr = (Array.isArray(price)) ? ((price.length > 0) ? price[0] : "") : (price || "");
            // ignore prefix, dollar/euro/... val, decimal point(./,), cents/..., ignore suffix
            var s = (/^[^0-9\.\,]*([0-9]{0,3}(?:[\.\,\s]?[0-9]{3})*?)(?:([\.\,])([0-9]{1,2}))?[^0-9]*$/i).exec(priceStr);
            var v = 0, m = 100;
            for (var i = 1; i < s.length; i++) {
                var seg = s[i];
                if (seg) {
                    if (seg === "." || seg === ",") {
                        m = 1; // following fractions are cents
                    } else {
                        v += parseFloat(String(seg).replace(/[\,\s\.]/g, "")) * m;
                    }
                }
            }
            return v;
        },
        /**
         * Strip URL and return the domain
         * @param  {String} url URL string (http://www.google.com)
         * @return {String}     Domain string (google.com)
         */
        encodeNotAllowedChar: function (url) {
            if (url === undefined || url === null) return null;

            var regex = /\|/gi;
            url = url.replace(regex, "");
            return url;
        },
        /**
         * Look for redirector urls in
         * @param  {String} url Original URL
         * @return {String}     Extracted URL
         */
        getUrlTarget: function (url) {
            //Recognizes target urls inside arbitrary redirector urls (also handles base64 encoded urls)
            var args = this.getUrlVars(url);

            for (var p in args) {
                if (args.hasOwnProperty(p)) {
                    //This regexp extracts domain from URL encoded address of type http
                    try {
                        //Matches URLs starting with http(s)://domain.com http(s)://www.domain.com www.domain.com
                        //optionally followed by path and GET parameters
                        //If successfull then matches[4] holds the domain name with the www. part stripped

                        var re = /((https?\:\/\/(www\.)?|www\.)(([\w|\-]+\.)+(\w+)))([\/#\?].*)?/;
                        var decoded = decodeURIComponent(args[p]);
                        var matches = decoded.match(re);
                        if (matches) {
                            return matches[2] + matches[4];
                        }

                        var b64decoded = atob(decoded);
                        matches = b64decoded.match(re);
                        if (matches) {
                            return matches[2] + matches[4];
                        }
                    } catch (e) {
                        //alert("Exception: "+JSON.stringify(e));
                    }
                }
            }
            return null;
        },
        /**
         * Create an object from arguments passed through GET
         * @param  {String} url URL string
         * @return {Object}     arguments as object
         */
        getUrlVars: function (url) {
            //Creates an associative array of GET URL parameters
            var vars = {};
            if (url === undefined || url === null) return vars;
            var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                vars[key] = value;
            });

            return vars;
        },

        /**
         * Manipulate bitmasks
         */
        BitWriter: function (n) {

            // local variables

            var bit = Math.abs(n),
                F = function () {
                },
                that = null;

            /**
             * Basic bitmask validate, a binary value should be 2^n power; this ensures the bit is valid by basic arithmetic
             * @method isValidBit
             * @return {Boolean} True, when a valid bitmask.
             * @private
             */
            var isValidBitmask = function (n) {
                if (0 > n) {
                    return false;
                }
                var i = 0,
                    j = 1;

                while (j <= n) {
                    if (j === n) {
                        return true;
                    }
                    i += 1;
                    j = Math.pow(2, i);
                }

                return false;
            };

            // public interface

            F.prototype = {

                /**
                 * Adds the bitmask to the binary value; remains unchanged if n is an invalid bitmask.
                 * @method addBitmask
                 * @param n {Number} Required. Any 2^n value.
                 * @return {Number} The new binary value.
                 * @public
                 */
                addBitmask: function (n) {
                    if (!isValidBitmask(n) || that.hasBitmask(n)) {
                        return bit;
                    }
                    bit = (bit | n);
                    return bit;
                },

                /**
                 * Retrieves the binary value.
                 * @method getValue
                 * @return {Number} The binary value.
                 * @public
                 */
                getValue: function () {
                    return bit;
                },

                /**
                 * Tests if the bitmask is present, returning the bitmask when it is and ZERO otherwise.
                 * @method hasBitmask
                 * @param n {Number} Required. Any 2^n value.
                 * @return {Number} The value of bitmask, when present, otherwise ZERO.
                 * @public
                 */
                hasBitmask: function (n) {
                    if (!isValidBitmask(n) || n > bit) {
                        return 0;
                    }
                    return (bit & n);
                },

                /**
                 * Removes the bitmask to the binary value; remains unchanged if n is an invalid bitmask.
                 *  When n > the binary number, then the number is simply reduced to ZERO.
                 * @method removeBitmask
                 * @param n {Number} Required. Any 2^n value.
                 * @return {Number} The new binary value.
                 * @public
                 */
                removeBitmask: function (n) {
                    if (!isValidBitmask(n) || !that.hasBitmask(n)) {
                        return bit;
                    }
                    bit = (bit ^ n);
                    return bit;
                },
            };

            that = new F();
            return that;
        },
        /**
         * Replace "%s" placeholders in strings with provided arguments.
         */
        aosFormat: function (formatted, args) {
            for (var arg in args) {
                formatted = formatted.replace("%s", args[arg]);
            }
            return formatted;
        }
    }; // AvastWRC.Utils

    AvastWRC.Burger = AvastWRC.Burger || {
        emitEvent: function () {
            console.log("no burger lib");
        }
    };

    function onOptIn(request, tabId) {
        if (request.id === "opt-in-acceptance") {
            chrome.runtime.onMessage.removeListener(onOptIn);
            AvastWRC.CONFIG.OPT_IN.functional = request.acceptance.functional;
            AvastWRC.CONFIG.OPT_IN.privacy = request.acceptance.privacy;
            AvastWRC.storageCache.save("opt_in", AvastWRC.CONFIG.OPT_IN);

            AvastWRC.CONFIG.OPT_IN.updateSettings = true;

            if (AvastWRC.CONFIG.OPT_IN && AvastWRC.CONFIG.OPT_IN.functional) {
                var result = AvastWRC.storageCache.get("landingPageShown");
                if (result === true) {
                    chrome.tabs.remove(tabId, function () { });
                }
                AvastWRC.bal.init();
            } else {
                chrome.tabs.remove(tabId, function () { });
                chrome.tabs.create({ url: "__OPT_IN_STORE_URL__" }, function (tab) { });
            }
            
        } else if (request.id === "opt-in-get-data") {
            let message = {
                message: "opt-in-init",
                tab: request.tab,
                id: "opt-in-init",
                data: AvastWRC.CONFIG.OPT_IN_DATA
            };
            //chrome.runtime.sendMessage(message);
            return Promise.resolve({ response: message });
        }
        
    }
}).call(this, _, AvastWRC.PROTO);

(function(AvastWRC) {
    "use strict";
    var Browser = {

        browser : "",
        version : "",
        OS: "",
        OSBurger: "",
        OSVersion: "",

            /**
             * Get Browser information
             * @param  {String} t What property are we querying ("browser|version|OS")
             * @return {String}   Property value
             */
            get: function (t) {
                if (t === "browser") {
                    if (this.browser === "") this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
                    return this.browser;
                }
                if (t === "version") {
                    if (this.version === "") this.version = this.searchVersion(this.dataBrowser) || "an unknown version";
                    return this.version;
                }
                if (t === "OS") {
                    if (this.OS === "") this.OS = this.searchString(this.dataOS, false) || "an unknown OS";
                    return this.OS;
                }
                if (t === "OSBurger") {
                    if (this.OSBurger === "") this.OSBurger = this.searchString(this.dataOS, true) || "an unknown OS";
                    return this.OSBurger;
                }
                if (t === "OSVersion") {
                    if (this.OSVersion === "") this.OSVersion = this.searchString(this.dataOSVersion, false) || "0.0 (an unknown OS Version)";
                    return this.OSVersion;
                }
                return "not found";
            },
            /**
             * Look for specific data in userAgents
             * @param  {Object} data Where to look for
             * @return {String}      Resulting value
             */
            searchString: function (data, isBurgerData) {
                for (var i=0;i<data.length;i++) {
                    var dataString = data[i].string;
                    
                    if (dataString) {
                        if (dataString.indexOf(data[i].subString) !== -1)
                            return (!isBurgerData) ? data[i].identity : data[i].identityBurger;
                    }
                }
            },
            /**
             * Search for browser version
             * @param  {String} dataString provided userAgent string to get the data from
             * @return {String}            Browser version
             */
            searchVersion: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var ua = data[i].string;
                    var regex = new RegExp("(" + data[i].subString + ")/?\\s*([\\d\\.]+)", 'i');
                      
                    var m = ua.match(regex) || [];
                    if (m.length === 3) {
                        return m[2];
                    }
                }
                return false;
            },
            /**
             * Individual settings for each browser
             * @type {Array}
             */
            dataBrowser: [
                {
                    string: navigator.userAgent,
                    subString: "Edge",
                    identity: "MS_EDGE",
                    versionSearch: "Version"
                },
                {
                    string: navigator.userAgent,
                    subString: "Edg",
                    identity: "MS_EDGE",
                    versionSearch: "Version"
                },
                {
                    string: navigator.userAgent,
                    subString: "OPR",
                    identity: "OPERA",
                    versionSearch: "Version"
                },
                {
                    string: navigator.userAgent,
                    subString: "Avast",
                    identity: "AVAST",
                    versionSearch: "Version"
                },
                {
                    string: navigator.userAgent,
                    subString: "Chrome",
                    identity: "CHROME",
                    versionSearch: "Version"
                },
                {
                    string: navigator.vendor,
                    subString: "Apple",
                    identity: "SAFARI",
                    versionSearch: "Version"
                },
                {
                    string: navigator.userAgent,
                    subString: "Firefox",
                    identity: "FIREFOX",
                    versionSearch: "Version"
                }
            ],
            /**
             * Individual settings for each browser/OS
             * @type {Array}
             */
            dataOS : [
                {
                    string: navigator.platform,
                    subString: "Win",
                    identity: "WIN",
                    identityBurger: "WINDOWS"
                },
                {
                    string: navigator.platform,
                    subString: "Mac",
                    identity: "MAC",
                    identityBurger: "OSX"
                },
                {
                    string: navigator.platform,
                    subString: "MacIntel",
                    identity: "MAC",
                    identityBurger: "OSX"
                },
                {
                    string: navigator.userAgent,
                    subString: "iPhone",
                    identity: "IOS",
                    identityBurger: "IOS"
                },
                {
                    string: navigator.platform,
                    subString: "Linux",
                    identity: "LINUX",
                    identityBurger: "LINUX"
                }
            ],
            /**
             * Individual settings for each browser/OSVersion
             * @type {Array}
             */
            dataOSVersion : [
                {
                    string: navigator.userAgent,
                    subString: "Windows 10.0",
                    identity: "10.0 (Windows 10.0)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows NT 10.0",
                    identity: "10.0 (Windows NT 10.0)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows 8.1",
                    identity: "6.3 (Windows 8.1)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows NT 6.3",
                    identity: "6.3 (Windows NT 6.3)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows 8",
                    identity: "6.2 (Windows 8)"
                },
                 {
                    string: navigator.userAgent,
                    subString: "Windows NT 6.2",
                    identity: "6.2 (Windows NT 6.2)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows 7",
                    identity: "6.1 (Windows 7)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows NT 6.1",
                    identity: "6.1 (Windows NT 6.1)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows NT 6.0",
                    identity: "6.0 (Windows NT 6.0)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows NT 5.2",
                    identity: "5.2 (Windows NT 5.2)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows NT 5.1",
                    identity: "5.1 (Windows NT 5.1)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows XP",
                    identity: "5.1 (Windows XP)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows NT 5.0",
                    identity: "5.0 (Windows NT 5.0)"
                },
                 {
                    string: navigator.userAgent,
                    subString: "Windows 2000",
                    identity: "5.0 (Windows 2000)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Win 9x 4.90",
                    identity: "4.90 (Win 9x 4.90)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows ME",
                    identity: "4.90 (Windows ME)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows 98",
                    identity: "4.10 (Windows 98)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Win98",
                    identity: "4.10 (Win98)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows 95",
                    identity: "4.03 (Windows 95)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Win95",
                    identity: "4.03 (Win95)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows_95",
                    identity: "4.03 (Windows_95)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows NT 4.0",
                    identity: "4.0 (Windows NT 4.0)"
                },
                {
                    string: navigator.userAgent,
                    subString: "WinNT4.0",
                    identity: "4.0 (WinNT4.0)"
                },
                {
                    string: navigator.userAgent,
                    subString: "WinNT",
                    identity: "4.0 (WinNT)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Windows NT",
                    identity: "4.0 (Windows NT)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Win16",
                    identity: "3.11 (Win16)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_14",
                    identity: "10.14 (macOS Mojave)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_13",
                    identity: "10.13 (macOS High Sierra)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_12",
                    identity: "10.12 (macOS Sierra)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_11",
                    identity: "10.11 (macOS El Capitan)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_10",
                    identity: "10.10 (macOS Yosemite)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_9",
                    identity: "10.9 (macOS Mavericks)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_8",
                    identity: "10.8 (macOS Mountain Lion)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_7",
                    identity: "10.7 (macOS Lion)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_6",
                    identity: "10.6 (macOS Snow Leopard)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_5",
                    identity: "10.5 (macOS Leopard)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_4",
                    identity: "10.4 (macOS Tiger)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_3",
                    identity: "10.3 (macOS Panther)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_2",
                    identity: "10.2 (macOS Jaguar)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_1",
                    identity: "10.1 (macOS Puma)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10_0",
                    identity: "10.0 (macOS Cheetah)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.14",
                    identity: "10.14 (macOS Mojave)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.13",
                    identity: "10.13 (macOS High Sierra)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.12",
                    identity: "10.12 (macOS Sierra)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.11",
                    identity: "10.11 (macOS El Capitan)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.10",
                    identity: "10.10 (macOS Yosemite)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.9",
                    identity: "10.9 (macOS Mavericks)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.8",
                    identity: "10.8 (macOS Mountain Lion)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.7",
                    identity: "10.7 (macOS Lion)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.6",
                    identity: "10.6 (macOS Snow Leopard)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.5",
                    identity: "10.5 (macOS Leopard)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.4",
                    identity: "10.4 (macOS Tiger)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.3",
                    identity: "10.3 (macOS Panther)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.2",
                    identity: "10.2 (macOS Jaguar)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.1",
                    identity: "10.1 (macOS Puma)"
                },
                {
                    string: navigator.userAgent,
                    subString: "Intel Mac OS X 10.0",
                    identity: "10.0 (macOS Cheetah)"
                }
            ]
        };

        /**
         * Get browser OS information
         * @type {String}
         */
        AvastWRC.Utils.getBrowserInfo = function () {
          return {
            osVersion: Browser.get('OSVersion'),
            os: Browser.get('OS'),
            osBurger: Browser.get('OSBurger'),
            getBrowser: function() { return Browser.get('browser'); },
            getBrowserVersion: function() { return Browser.get('version'); },
            isWindows: function() { return (this.os !== null && this.os === "WIN") || (this.osBurger !== null && this.osBurger === "WINDOWS");},
            isFirefox: function() { return Browser.get('browser') === 'FIREFOX'; },
            isChrome: function () { return Browser.get('browser') === 'CHROME'; },
            isEdge: function () { return Browser.get('browser') === 'MS_EDGE'; },
            isOpera: function () { return Browser.get('browser') === 'OPERA'; },
            isSafari: function () { return Browser.get('browser') === 'SAFARI'; },
            isAvast: function () { return Browser.get('browser') === 'AVAST'; },
            getCurrentBrowserShortName: function () {
                let browserName = Browser.get('browser');
                let browserShortNames = {
                    'FIREFOX': 'FF',
                    'CHROME': 'CH',
                    'MS_EDGE': 'ED',
                    'OPERA': 'OP',
                    'SAFARI': 'SF',
                    'AVAST': 'ASB'
                };
                
                return browserShortNames[browserName] || "";
            }
          };
        };

}).call(this, AvastWRC);

(function(AvastWRC) {
	"use strict";
	/**
	 * Generate ClientInfo for new SP OffersRequest proto format.
	 * @param {String}  
	 * @return  {Object}
	 */
	AvastWRC.Utils.getClientInfo = function(){
		var clientInfo = {};
		clientInfo.client = AvastWRC.CONFIG.BRANDING_TYPE; 
		// providerType is set only for test it's the guid to get an specific provider on the offer request
		if(AvastWRC.CONFIG.providerType === "") {
			clientInfo.guid = (AvastWRC.CONFIG.GUID !== null)? AvastWRC.CONFIG.GUID : "";
		}else{
			clientInfo.guid = AvastWRC.CONFIG.providerType;
		}
		clientInfo.language = ABEK.locale.getBrowserLang();
		clientInfo.referer = "";
		clientInfo.extension_guid = (AvastWRC.CONFIG.DEBUG_MODE) ? "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx" : (AvastWRC.CONFIG.PLG_GUID !== null) ? AvastWRC.CONFIG.PLG_GUID : "";
		
		clientInfo.browser = AvastWRC.Utils.getSpecificBrowserInfo();
		clientInfo.extension = AvastWRC.Utils.getSpecificExtensionInfo();
		clientInfo.user_settings = AvastWRC.Utils.buildUserSettings();
		
		var cmp = { showABTest: false,
			campaignId: "default"};

		if(AvastWRC.Shepherd){
			cmp = (AvastWRC.Shepherd) ? AvastWRC.Shepherd.getCampaing() : cmp;
		}
		clientInfo.campaign_id = cmp.campaignId;
		clientInfo.install_time = AvastWRC.CONFIG.InstallTimestamp;
		clientInfo.source_id = AvastWRC.CONFIG.SOURCE_ID;

		clientInfo.transaction_id = null;
		clientInfo.request_id = null;

		return clientInfo;
	};

	AvastWRC.Utils.getClientInfoMessage = function(_clientInfo){
		var cliInfo = _clientInfo || AvastWRC.Utils.getClientInfo(); 

		var clientInfo = new AvastWRC.gpb.All.SafeShopOffer.ClientInfo();
		clientInfo.client = cliInfo.client;
		clientInfo.guid = cliInfo.guid;
		clientInfo.language = cliInfo.language;
		clientInfo.extension_guid = cliInfo.extension_guid;

		clientInfo.browser = AvastWRC.Utils.getSpecificBrowserInfoMessage(cliInfo.browser);
		clientInfo.extension = AvastWRC.Utils.getSpecificExtensionInfoMessage(cliInfo.extension);
		clientInfo.user_settings = AvastWRC.Utils.buildUserSettingsMessage(cliInfo.user_settings);
		
		
		clientInfo.campaign_id = cliInfo.campaign_id;

		if(!AvastWRC.Utils.getBrowserInfo().isFirefox()){
			clientInfo.install_time = AvastWRC.PROTO.I64.fromNumber(cliInfo.install_time);
			clientInfo.source_id = cliInfo.source_id;
		}
		

		clientInfo.transaction_id = cliInfo.transaction_id;
		clientInfo.request_id = cliInfo.request_id;
		return clientInfo;
	};


	 /**
	 * Generate BrowserInfo for new SP OffersRequest proto format.
	 * @param {String}  
	 * @return  {Object}
	 */
	AvastWRC.Utils.getSpecificBrowserInfoMessage = function(_browserInfo){
		var allBrowserInfo = _browserInfo || AvastWRC.Utils.getSpecificBrowserInfo();
		var browserInfo = new AvastWRC.gpb.All.SafeShopOffer.ClientInfo.Browser();
		if(!AvastWRC.Utils.getBrowserInfo().isFirefox()){
			browserInfo.type = allBrowserInfo.type;
			browserInfo.version = allBrowserInfo.version;
		}		
		browserInfo.language = allBrowserInfo.language;
		return browserInfo;
	};

	 /**
	 * Generate BrowserInfo
	 * @param {String}  
	 * @return  {Object}
	 */
	AvastWRC.Utils.getSpecificBrowserInfo = function(){
		var allBrowserInfo = AvastWRC.Utils.getBrowserInfo();
		var browserInfo = {};
		browserInfo.type = AvastWRC.gpb.All.SafeShopOffer.ClientInfo.Browser.BrowserType[allBrowserInfo.getBrowser()];
		browserInfo.version = allBrowserInfo.getBrowserVersion();
		browserInfo.language = ABEK.locale.getBrowserLang().toLowerCase();
		return browserInfo;
	};
	/**
	* Generate ExtensionInfo for new SP OffersRequest proto format.
	* @param {String}  
	* @return  {Object}
	*/
	AvastWRC.Utils.getSpecificExtensionInfoMessage = function(_extensionInfo){
		let extInfo = _extensionInfo || AvastWRC.Utils.getSpecificExtensionInfo();
		var extensionInfo = new AvastWRC.gpb.All.SafeShopOffer.ClientInfo.Extension();

		extensionInfo.type = extInfo.type;
		extensionInfo.version = extInfo.version;   

		return extensionInfo;
	};

	/**
	* Generate ExtensionInfo.
	* @param {String}  
	* @return  {Object}
	*/
	AvastWRC.Utils.getSpecificExtensionInfo = function(){
		var extensionInfo = {};
		extensionInfo.type = 0 /*SafepriceMultiprovider*/;
		extensionInfo.version = AvastWRC.CONFIG.VERSION;          
		return extensionInfo;
	};

	AvastWRC.Utils.getIncludeMask = function(accommodations){
		var INCLUDE_MASK = {
			eShop : 1,
			accommodations : 2,
			special: 4,
			betterHotelPrice: 8,
			similarHotels: 16,
			popularHotels: 32

		};
		var mask = AvastWRC.Utils.BitWriter(0);

		if(accommodations.showBetter){
			mask.addBitmask(INCLUDE_MASK.betterHotelPrice);
		}
		if(accommodations.showSimilar){
			mask.addBitmask(INCLUDE_MASK.similarHotels);
		}
		if(accommodations.showPopular){
			mask.addBitmask(INCLUDE_MASK.popularHotels);
		}
		return mask.getValue();
	};

	AvastWRC.Utils.buildUserSettingsMessage = function(settings){
		var _userSettings = new AvastWRC.gpb.All.SafeShopOffer.ClientInfo.UserSettings();
		var userSettings = settings || AvastWRC.Utils.buildUserSettings();


		_userSettings.show_automatic = userSettings.show_automatic;

		_userSettings.advanced = new AvastWRC.gpb.All.SafeShopOffer.ClientInfo.UserSettings.Advanced();
		_userSettings.advanced.offers_configs = new AvastWRC.gpb.All.SafeShopOffer.ClientInfo.UserSettings.Advanced.OffersConfigs();
		_userSettings.advanced.offers_configs.offer_limit = userSettings.advanced.offers_configs.offer_limit;
		_userSettings.advanced.offers_configs.accommodation_limit = userSettings.advanced.offers_configs.accommodation_limit;
		_userSettings.advanced.offers_configs.include_flag = userSettings.advanced.offers_configs.include_flag;
		_userSettings.advanced.offers_configs.offers_visibility = userSettings.advanced.offers_configs.offers_visibilit;

		_userSettings.advanced.coupons_configs = new AvastWRC.gpb.All.SafeShopOffer.ClientInfo.UserSettings.Advanced.CouponsConfigs();
		_userSettings.advanced.coupons_configs.coupons_visibility = userSettings.advanced.coupons_configs.coupons_visibility;
		_userSettings.advanced.redirect_configs = new AvastWRC.gpb.All.SafeShopOffer.ClientInfo.UserSettings.Advanced.RedirectConfigs();
		_userSettings.advanced.redirect_configs.redirect_visibility = userSettings.advanced.redirect_configs.redirect_visibility;
		_userSettings.custom_list = userSettings.custom_list;

		return _userSettings;
		
	};

	AvastWRC.Utils.buildUserSettings = function(settings){
		var _userSettings = {};
		var userSettings = null;

		if(settings){
			userSettings = settings;
		 }
		 else if(AvastWRC.bal.settings.get().userSPPoppupSettings){
			userSettings = AvastWRC.bal.settings.get().userSPPoppupSettings;
		 }
		 else{
			userSettings = AvastWRC.bal.sp.getModuleDefaultSettings().userSPPoppupSettings;
		 }
		_userSettings.show_automatic = true;
		_userSettings.advanced = {};
		_userSettings.advanced.offers_configs = {};
		_userSettings.advanced.offers_configs.offer_limit = userSettings.notifications.offers.showAlways ? 110 
															: userSettings.notifications.offers.showBetter ? 99 
															: userSettings.notifications.offers.hide ? 0 : 110;
		_userSettings.advanced.offers_configs.accommodation_limit = userSettings.notifications.accommodations.showBetter ? 99 : 0;
		//_userSettings.advanced.offers_configs.include_flag = AvastWRC.Utils.getIncludeMask(userSettings.notifications.accommodations);
		_userSettings.advanced.offers_configs.offers_visibility = userSettings.notifications.offers.showAlways ? 0 
															: userSettings.notifications.offers.showBetter ? 1 
															: userSettings.notifications.offers.hide ? 3 : 0;
		_userSettings.advanced.coupons_configs = {};
		_userSettings.advanced.coupons_configs.coupons_visibility = userSettings.notifications.coupons.showAlways ? 0 
																	: userSettings.notifications.coupons.showOnce ? 1 
																	: userSettings.notifications.coupons.hide ? 2 : 0;
		_userSettings.advanced.redirect_configs = {};
		_userSettings.advanced.redirect_configs.redirect_visibility = userSettings.notifications.others.showAlways ? 0 : 1;
		_userSettings.custom_list = userSettings.customList.whiteList;

		return _userSettings;
	};

	AvastWRC.Utils.reportPhishingDomain = function () {
		return AvastWRC.CONFIG.GUID === null;
	};

	AvastWRC.Utils.Burger = {
		initBurger : function(sendAll){
			if(AvastWRC.Burger === undefined){
				console.log("no burger lib");
				return;
			}			
			var data = AvastWRC.Utils.Burger.getBurgerData();
			if(data === null)return;
			AvastWRC.Burger.emitEvent("burger.initme", data, sendAll);			
		},
		getBurgerData : function (){
			var guid = "";
			if(AvastWRC && AvastWRC.CONFIG){
				if(AvastWRC.CONFIG.providerType && AvastWRC.CONFIG.providerType !== ""){
					guid = AvastWRC.CONFIG.providerType;
					console.log("AVASTWRC-> identityMessage.guid: use test guid -> ", AvastWRC.CONFIG.providerType);
				}
				else if(AvastWRC.CONFIG.GUID && AvastWRC.CONFIG.GUID !== ""){
					guid = AvastWRC.CONFIG.GUID;
					console.log("AVASTWRC-> identityMessage.guid: use avast guid -> ", AvastWRC.CONFIG.GUID);
				}
			} 
			
			var variant = AvastWRC.CONFIG.BRANDING_TYPE; 
			var version = AvastWRC.CONFIG.VERSION?AvastWRC.CONFIG.VERSION:"";
			var iVersion = 0;
			if (version !== "")
				iVersion = version.substring(version.lastIndexOf(".")+1);
			var os = AvastWRC.Utils.getBrowserInfo().osBurger;
			var osVersion = AvastWRC.Utils.getBrowserInfo().osVersion;
			if(os !== "")
				os = os.toUpperCase();
			if (variant !== null && version !== "" && os !== ""){
				var burgerData = {
					guid:  guid,
					variant: variant, //0 Avast, 1 AVG
					version: version,
					internal_version: iVersion,
					platform: os,
					platform_version: osVersion
				};
				return burgerData;
			}else return null;
		}
	};

	AvastWRC.Utils.resolveImageUrl = function(primaryImage = "", secondaryImage = "", subcategory = 0){

		let imagesMap = {
			"Finance-repeat.gif" : "Loans.png",
			"Insurance-repeat.gif" : "Health-Insurance.png",
			"Security-repeat.gif" : "Home-Security.png",
			"Vertical-Deals-Repeat.gif" : "Loans.png",
			"Vertical-Travel-Carrental-repeat.gif" : "Car-Rental.png",
			"Vertical-Travel-Flights-Repeat.gif" : "Flights.png",
			"secondarydefault" : "Default.png",
			"barImagedefault" : "Default-90x30.png",
			"0": "Default-90x30.png",
            "1": "Loans-90x30.png",
            "2": "Loans-90x30.png",
            "3": "Loans-90x30.png",
            "4": "Mortgage-90x30.png",
            "5": "Gas-90x30.png",
            "6": "Electricity-90x30.png",
            "7": "Home-Security-90x30.png",
            "8": "Health-Insurance-90x30.png",
            "9": "Electronics-90x30.png",
            "10": "Car-Rental-90x30.png",
            "11": "Flights-90x30.png",
            "12": "Internet-Hosting-90x30.png",
            "13": "Internet-Hosting-90x30.png",
			"14": "Home-90x30.png",
			"rfid": "RFID.png"
		};
		return {
			barImage: (secondaryImage !== "" && secondaryImage.indexOf("rfid") !== -1) ? getImageUrl(imagesMap.rfid) : (!imagesMap[subcategory.toString()]) ? getImageUrl(imagesMap["0"]) : getImageUrl(imagesMap[subcategory.toString()]),
			primaryImage : (primaryImage === "") ? "" : (primaryImage.indexOf("http") !== -1) ? primaryImage : "",
			secondaryImage : (secondaryImage === "") ? getImageUrl(imagesMap.secondarydefault) : (secondaryImage.indexOf("http") !== -1) ? secondaryImage : (!imagesMap[secondaryImage]) ? getImageUrl(imagesMap.secondaryDefault) : getImageUrl(imagesMap[secondaryImage]),
		};

	   function getImageUrl (imageName) {
			return AvastWRC.bal.utils.getLocalImageURLs({}, {image: imageName}).image;
		}
	};

    AvastWRC.Utils.buildQueryString = function (queryStringParameters) {
        let result = "?";

        for (let key in queryStringParameters) {
            result += `&${key}=${queryStringParameters[key]}`;
        }

        return result.replace("?&", "?");
    };
}).call(this, AvastWRC);