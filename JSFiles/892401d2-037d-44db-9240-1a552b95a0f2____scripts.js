(function(exports, global) {
    global["MenuAndFooter"] = exports;
    "use strict";
    var Utils = function() {
        return {
            replaceStringParams: function(string, params) {
                for (var key in params) {
                    string = string.replace(new RegExp("{" + key + "}", "gi"), params[key]);
                }
                return string;
            },
            addUrlParams: function(url, params) {
                var alreadyHasParams = url.indexOf("?") !== -1;
                for (var key in params) {
                    url += alreadyHasParams ? "&" : "?";
                    alreadyHasParams = true;
                    url = url + encodeURI(key) + "=" + encodeURI(params[key]);
                }
                return url;
            },
            localizeUrl: function(url, newLocale) {
                return url.replace(/\/\/(www|\w\w)\./, "//" + (newLocale === "en" ? "www" : newLocale) + ".");
            },
            fixWixHost: function(str) {
                var host = window.location.host;
                var match = host.match(/(\..+\.wixpress\.com|\.wix.com)/g);
                return str.replace(host, "www" + match[0]);
            },
            fixProtocol: function(link) {
                return window.location.protocol === "https:" ? link.replace("http://", "https://") : link;
            },
            toggleClassOnCondition: function(elem, clss, condition) {
                if (condition) {
                    elem.addClass(clss);
                } else {
                    elem.removeClass(clss);
                }
            },
            loadScript: function(link, callback) {
                var script = document.createElement("script");
                script.src = link;
                script.onload = callback;
                document.documentElement.firstChild.appendChild(script);
            },
            extend: function(a, b) {
                for (var key in b) {
                    if (b.hasOwnProperty(key)) {
                        a[key] = b[key];
                    }
                }
                return a;
            },
            getLocationOrigin: function() {
                var origin = "https://" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
                return origin;
            }
        };
    }();
    "use strict";
    (function() {
        var VerticalsMetaData = {
            BUSINESS: {
                templatesPath: "/website/templates/html/business/1",
                homepagePath: "/business/website",
                featuresPath: "/features/business",
                biName: "business"
            },
            MUSIC: {
                templatesPath: "/website/templates/html/music/1",
                homepagePath: "/music/website",
                featuresPath: "/features/music",
                biName: "music"
            },
            PHOTOGRAPHY: {
                templatesPath: "/website/templates/html/photography/1",
                homepagePath: "/photography/website",
                featuresPath: "/features/photography",
                biName: "photography"
            },
            ONLINE_STORE: {
                templatesPath: "/website/templates/html/online-store/1",
                homepagePath: "/onlinestore/website",
                featuresPath: "/features/onlinestore",
                biName: "online-store"
            },
            DESIGNER: {
                templatesPath: "/website/templates/html/design/1",
                homepagePath: "/design/website",
                featuresPath: "/features/designers",
                biName: "design"
            },
            RESTAURANTS: {
                templatesPath: "/website/templates/html/restaurants-food/1",
                homepagePath: "/restaurant/website",
                featuresPath: "/features/restaurants",
                biName: "restaurants"
            },
            ACCOMMODATION: {
                templatesPath: "/website/templates/html/accommodation/1",
                homepagePath: "/hotels/website",
                featuresPath: "/features/accommodation",
                biName: "accommodation"
            },
            EVENTS: {
                templatesPath: "/website/templates/html/events/1",
                homepagePath: "/event/website",
                featuresPath: "/features/events",
                biName: "events"
            },
            PORTFOLIO_AND_CV: {
                templatesPath: "/website/templates/html/portfolio-cv/1",
                homepagePath: "/cv-resume/website",
                featuresPath: "/features/portfolio-cv",
                biName: "portfolio-cv"
            },
            BEAUTY_AND_WELLNESS: {
                templatesPath: "/website/templates/html/health-wellness/1",
                homepagePath: "/beauty-wellness/website",
                featuresPath: "/features/main",
                biName: "beauty-wellness"
            },
            BLOG: {
                templatesPath: "/website/templates/html/blog/1",
                homepagePath: "/start/blog",
                featuresPath: "/features/blog",
                biName: "blog"
            }
        };
        if (typeof window !== "undefined") {
            window.W = window.W || {};
            window.W.Site = window.W.Site || {};
            window.W.Site.Common = window.W.Site.Common || {};
            window.W.Site.Common.VerticalsMetaData = window.W.Site.Common.VerticalsMetaData || VerticalsMetaData;
        }
        if (typeof module !== "undefined") {
            module.exports = VerticalsMetaData;
        }
    })();
    "use strict";
    window.W = window.W || {};
    W.Site = W.Site || {};
    W.Site.Common = W.Site.Common || {};
    var BI = W.Site.Common.BI || function() {
        var headerFooterEvent = {
            extension: "hf",
            src: "19",
            init: "500",
            loadComplete: "501",
            fail: "13",
            loginDialog: "503",
            goToVerticalsSelection: "504",
            goToVerticalHomepage: "505"
        };
        var mobileHeaderEvents = {
            extension: "mhp",
            src: "19",
            openMenu: "202",
            menuPage: "203",
            signinClick: "200"
        };
        var legacyHeaderEvents = {
            extension: "hp",
            src: "19",
            clickOnHeader: "311",
            languageChange: "313",
            signinClick: "314"
        };
        var spettatoreEvents = {
            extension: "spettatore_bi",
            src: "2",
            legacyPostReg: "30"
        };
        var topBannerEvent = {
            extension: "dash",
            src: "5",
            init: "54",
            complete: "55",
            fail: "13",
            click: "14",
            create: "34",
            update: "36"
        };
        var Utils = Utils || {};
        Utils.getLocationOrigin = Utils.getLocationOrigin || function() {
            var origin = window.location.origin;
            if (!window.location.origin) {
                origin = "https://" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
            }
            return origin;
        };
        var path = Utils.getLocationOrigin().indexOf("wix.com") > -1 ? "https://frog.wix.com/" : "/";
        function _report(extension, src, evtid, report) {
            var date = new Date().getTime();
            var finaleReport = "";
            if (typeof report !== "undefined") {
                finaleReport = report + "&";
            }
            if (extension === headerFooterEvent.extension || extension === legacyHeaderEvents.extension) {
                finaleReport += "origin=" + window.location.host + window.location.pathname + "&";
            }
            finaleReport += "_=" + date;
            var imgSrc = W.Site.Common.BI.path + extension + "?src=" + src + "&evid=" + evtid + "&" + finaleReport;
            var img = new Image();
            img.src = imgSrc;
        }
        return {
            headerFooterEvent: headerFooterEvent,
            topBannerEvent: topBannerEvent,
            legacyHeaderEvents: legacyHeaderEvents,
            spettatoreEvents: spettatoreEvents,
            mobileHeaderEvents: mobileHeaderEvents,
            path: path,
            report: _report
        };
    }();
    W.Site.Common.BI = BI;
    "use strict";
    var options, clientTopology, experiments;
    if (!NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }
    window.W = window.W || {};
    W.Site = W.Site || {};
    W.Site.Common = W.Site.Common || {};
    W.Site.Common.SUPPORTED_LANGUAGES = [ "en", "de", "es", "fr", "it", "nl", "no", "pl", "pt", "ru", "sv", "ja", "ko", "tr", "da", "hi", "cs" ];
    W.Site.Common.DefaultLayout = W.Site.Common.DefaultLayout || function() {
        var noop = function() {};
        function initMarketingHeaderAndFooter(options, embedder) {
            document.querySelectorAll("#wix-menu, #wix-footer").forEach(function(node) {
                node.innerHTML = "";
            });
            var config = {};
            try {
                if (W.Site.Common.clientTopology.marketingHeaderAndFooterStaticsUrl) {
                    config.baseUrl = W.Site.Common.clientTopology.marketingHeaderAndFooterStaticsUrl;
                }
            } catch (e) {
                console.warn(e);
            }
            if (options.forceMobileView && options.forceMobileView.force) {
                config.screenBreakpoint = typeof options.forceMobileView.size === "number" ? options.forceMobileView.size : config.screenBreakpoint;
            }
            var hostPage = null;
            if (location.pathname.indexOf("/website/templates") === 0) {
                hostPage = "templates";
            } else if (location.pathname === "/") {
                hostPage = "homepage";
            } else if (document.querySelector("#SITE_CONTAINER") && location.pathname.indexOf("/music/website") === 0) {
                hostPage = "music";
            } else if (document.querySelector("#SITE_CONTAINER")) {
                hostPage = "editor";
            }
            config.hostPage = hostPage;
            config.tabIndex = options.tabIndex || null;
            config.hideMainLinksOnDesktop = options.hideMainLinksOnDesktop || null;
            config.useOnly = options.useOnly || null;
            embedder(config);
            return;
        }
        function resolveMarketingHeaderAndFooterEmbedder(onSuccess, onError) {
            if (W.Site.Common.marketingHeaderAndFooter) {
                onSuccess(W.Site.Common.marketingHeaderAndFooter.init.bind(W.Site.Common.marketingHeaderAndFooter));
            } else if (typeof require === "function") {
                try {
                    require([ "marketing-header-and-footer" ], function(mhnf) {
                        if (typeof mhnf.embed === "function") {
                            onSuccess(mhnf.embed.bind(mhnf.embed));
                        } else {
                            onError("Loaded module does not appear to be mrnd header and footer");
                        }
                    }, function(err) {
                        onError(err);
                    });
                } catch (err) {
                    onError(err);
                }
            } else {
                onError();
            }
        }
        function isAnroidMobile() {
            return /Android/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent);
        }
        function initMobileView(options) {
            options.forceMobileView = options.forceMobileView ? options.forceMobileView : {
                force: false,
                width: 640
            };
            options.showMobileMenu = false;
            if (options.forceMobileView.force) {
                if (window.innerWidth <= options.forceMobileView.size) {
                    options.showMobileMenu = true;
                }
                jQuery(window).resize(function() {
                    if (window.innerWidth <= options.forceMobileView.size && !options.showMobileMenu) {
                        options.showMobileMenu = true;
                        jQuery("#wix-footer").hide();
                        jQuery("body").addClass("wix-menu-mobile-enabled");
                        jQuery("#wix-menu").addClass("wm-mobile wm-mobile-optimized");
                    } else if (window.innerWidth > options.forceMobileView.size && options.showMobileMenu) {
                        options.showMobileMenu = false;
                        jQuery("#wix-footer").show();
                        jQuery("body").removeClass("wix-menu-mobile-enabled");
                        jQuery("#wix-menu").removeClass("wm-mobile wm-mobile-optimized");
                    }
                });
            }
            if (options.doNotHideFooter !== true && (options.mobileOptimized && W.Site.Common.isMobile || options.showMobileMenu)) {
                jQuery("#wix-footer").hide();
            }
        }
        function getPostSignUpUrlByVertical() {
            var userVerticalId = W.Site.Common.Verticals.getUserVertical();
            if (userVerticalId) {
                return Utils.getLocationOrigin() + W.Site.Common.VerticalsMetaData[userVerticalId].templatesPath;
            } else {
                var endpoint = experiments["specs.EnableLinksToIntroAtMainFunnel"] === "true" ? "intro" : "vertical";
                return Utils.getLocationOrigin() + "/new/" + endpoint + "?referralAdditionalInfo=header";
            }
        }
        function activateVerticals(options) {
            var verticalId = W.Site.Common.Verticals.getVerticalIdByPath(window.location.pathname);
            if (verticalId) {
                W.Site.Common.Verticals.setUserVertical(verticalId);
            }
            options.verticalsActive = true;
            options.postSignUp = getPostSignUpUrlByVertical();
        }
        function loadExperiments(options, callback) {
            var pending = 0;
            function done() {
                pending--;
                if (pending === 0) {
                    callback();
                }
            }
            pending++;
            experiments = {};
            W.Site.Common.Petri.getExperiments(function(data) {
                Utils.extend(experiments, data);
                done();
            }, "headerAndFooter");
            if (W.Site.Common.isMobile === false) {
                pending++;
                W.Site.Common.Petri.getSingleExperiment(function(data) {
                    Utils.extend(experiments, {
                        "specs.marketing.headerAndFooterHTTPSEnabled": data
                    });
                    done();
                }, "specs.marketing.headerAndFooterHTTPSEnabled", false);
            }
            if (W.Site.Common.isMobile === false) {
                pending++;
                W.Site.Common.Petri.getSingleExperiment(function(data) {
                    Utils.extend(experiments, {
                        "specs.marketing.getUsersDetailsWithCredentials": data
                    });
                    done();
                }, "specs.marketing.getUsersDetailsWithCredentials", false);
            }
        }
        function verifyJQueryLoaded(callback) {
            if (typeof jQuery !== "undefined") {
                callback();
            } else {
                Utils.loadScript(W.Site.Common.clientTopology.headerAndFooterStaticsUrl + "bower_components/jquery/dist/jquery.min.js", function() {
                    if (typeof jQuery !== "undefined") {
                        callback();
                        return;
                    }
                    if (typeof requirejs === "function") {
                        requirejs([ "jquery" ], function($) {
                            window.jQuery = $;
                            callback();
                        });
                    } else {
                        console.log("Unable to load jQuery, header was not initialized");
                    }
                });
            }
        }
        function getSelectedLanguage() {
            return jQuery("#wix-menu").attr("lang");
        }
        function getDefaultOptions() {
            return {
                supportedLanguages: W.Site.Common.SUPPORTED_LANGUAGES,
                usersUrl: clientTopology.usersBaseUrl + "/wix-users/",
                displayLoginComponent: true,
                displayLanguageComponent: true,
                postLogin: Utils.getLocationOrigin() + "/my-account/sites/",
                postSignUp: Utils.getLocationOrigin() + "/new/account/",
                onLoginDialogOnLoad: noop,
                onLoginDialogOnClose: noop,
                externalPage: false,
                jsonpEnabled: false,
                layout: "center",
                mobileOptimized: false,
                lang: getSelectedLanguage(),
                baseApiUrl: "/_api"
            };
        }
        function reportInitBI() {
            W.Site.Common.BI.report(W.Site.Common.BI.headerFooterEvent.extension, W.Site.Common.BI.headerFooterEvent.src, W.Site.Common.BI.headerFooterEvent.init, "is_mobile=" + W.Site.Common.isMobile + "&component=header");
        }
        function init(customOptions) {
            if (W.Site.Common.isHeaderAndFooterInit) {
                return;
            }
            clientTopology = W.Site.Common.clientTopology;
            W.Site.Common.HeaderInitTime = Date.now();
            W.Site.Common.isMobile = /webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || isAnroidMobile();
            W.Site.Common.isHeaderAndFooterInit = true;
            verifyJQueryLoaded(function() {
                options = getDefaultOptions();
                options = Utils.extend(options, customOptions || {});
                loadExperiments(options, function() {
                    if (options.hideHeaderAndFooter) {
                        jQuery("#wix-menu, #wix-footer").remove();
                        return;
                    }
                    if (experiments["specs.marketing.NewHeaderAndFooter"] === "true") {
                        resolveMarketingHeaderAndFooterEmbedder(function(embedder) {
                            try {
                                initMarketingHeaderAndFooter(options, embedder);
                            } catch (err) {
                                console.warn("Old header and footer failed to embed new one", err);
                            }
                        }, function(err) {
                            console.warn("Old header and footer tries to init new one but it does not loaded", err);
                        });
                    }
                    jQuery("#wix-menu").addClass("davinci-enabled");
                    if (!W.Site.Common.UserDetailsServer.isSessionValid()) {
                        jQuery("#wm-my-account-link").addClass("davinci-hide");
                    }
                    activateVerticals(options);
                    if (experiments["specs.ChineseAndThaiLanguagesInMenu"] === "true") {
                        options.supportedLanguages.push("zh");
                        options.supportedLanguages.push("th");
                    }
                    initMobileView(options);
                    reportInitBI();
                    Controller.init();
                });
            });
        }
        return {
            init: init
        };
    }();
    "use strict";
    (function() {
        window.W = window.W || {};
        window.W.Site = window.W.Site || {};
        window.W.Site.Common = window.W.Site.Common || {};
        if (window.W.Site.Common.UserDetailsServer) {
            return;
        }
        window.W.Site.Common.UserDetailsServer = {};
        var UserDetails = window.W.Site.Common.UserDetailsServer;
        var wixClient, userID, validSession;
        function makeJsonp(method, url, onError, onSuccess) {
            var tmpFuncName = "_" + (W.Site.Common.UserDetailsServer.comm.jsonpCallbacks.counter++).toString(36);
            onError = onError || function() {};
            var clear = function() {
                clearTimeout(timeout);
                delete W.Site.Common.UserDetailsServer.comm.jsonpCallbacks[tmpFuncName];
                document.getElementsByTagName("head")[0].removeChild(js);
            };
            var success = function(item, obj) {
                clear();
                if (obj.success) {
                    onSuccess(obj);
                } else {
                    onError(obj);
                }
            };
            var error = function() {
                clear();
                onError();
            };
            url += "&accept=jsonp";
            url += "&callback=W.Site.Common.UserDetailsServer.comm.jsonpCallbacks." + tmpFuncName;
            url += "&callerId=" + tmpFuncName;
            url += method.toLowerCase() === "get" ? "" : "&_method=" + method.toLowerCase();
            var js = document.createElement("script");
            js.type = "text/javascript";
            js.src = url;
            js.onerror = error;
            document.getElementsByTagName("head")[0].appendChild(js);
            var timeout = setTimeout(error, 6e4);
            W.Site.Common.UserDetailsServer.comm.jsonpCallbacks[tmpFuncName] = success;
        }
        function getCookie(name) {
            var cookie = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
            return cookie && cookie[2];
        }
        function getValidSession() {
            return userID && getCookie("wixClient");
        }
        function getUserID() {
            return wixClient && wixClient.split("|")[6];
        }
        function updateDetailsFromCookies() {
            wixClient = getCookie("wixClient");
            userID = getUserID();
            validSession = getValidSession();
        }
        updateDetailsFromCookies();
        function getApiUrl(webapp) {
            var baseApiUrl = options.baseApiUrl;
            return fixOrigin(baseApiUrl + "/" + (webapp ? webapp + "/" : ""));
        }
        function fixOrigin(url) {
            var isAbsolute = !!url.match(/^http/);
            if (isAbsolute) {
                return url;
            } else {
                return url.replace(/^([^\/]*\/\/+)?[^\/]*/, window.location.protocol + "//" + window.location.host);
            }
        }
        function getFromServer(callback, args) {
            var userDetailsApiUrl = getApiUrl("wix-html-login-webapp") + "user/getUserDetails";
            if (args.jsonpEnabled) {
                makeJsonp("GET", Utils.fixWixHost(userDetailsApiUrl) + "?", null, function(data) {
                    onGetUserDetailsSuccess(callback, data);
                });
            } else {
                if (experiments["specs.marketing.getUsersDetailsWithCredentials"] === "true") {
                    jQuery.getJSON(userDetailsApiUrl, {
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true
                    }, function(data) {
                        onGetUserDetailsSuccess(callback, data);
                    });
                } else {
                    jQuery.getJSON(userDetailsApiUrl, function(data) {
                        onGetUserDetailsSuccess(callback, data);
                    });
                }
            }
        }
        function get(callback, _args) {
            var args = _args || {};
            getFromServer(callback, args);
        }
        function onGetUserDetailsSuccess(callback, data) {
            var userDetails = data.payload;
            var defaultUserImage = "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50";
            if (!userDetails.profileImage || userDetails.profileImage === null) {
                if (typeof jQuery !== "undefined") {
                    var apiUrl = getApiUrl("account-info-server") + "/profileimage";
                    jQuery.getJSON(apiUrl, function(data) {
                        userDetails.profileImage = data.profileImage ? data.profileImage : defaultUserImage;
                        callback(userDetails);
                    });
                } else {
                    userDetails.profileImage = defaultUserImage;
                    callback(userDetails);
                }
            } else {
                callback(userDetails);
            }
        }
        UserDetails.get = get;
        UserDetails.isSessionValid = function() {
            return validSession;
        };
        UserDetails.comm = {
            jsonpCallbacks: {
                counter: 0
            }
        };
    })();
    "use strict";
    if (typeof angular !== "undefined") {
        angular.module("wixHeaderAndFooter", []);
        angular.module("wixHeaderAndFooter").service("verticals", [ "$window", function($window) {
            return $window.W.Site.Common.Verticals;
        } ]);
        angular.module("wixHeaderAndFooter").factory("wixHeader", [ "$window", "$rootScope", function($window, $rootScope) {
            var sidebarInitialState, isMenuControllerInitFinished = false;
            if ($window.W && $window.W.Site && $window.W.Site.Common) {
                var layout = $window.W.Site.Common.DefaultLayout;
                var controller = $window.W.Site.Common.Menu && $window.W.Site.Common.Menu.Controller;
                controller.setPostInitCallback(function() {
                    isMenuControllerInitFinished = true;
                    if (sidebarInitialState !== undefined) {
                        $window.W.Site.Common.Menu.Controller.onSidebarStateChange(sidebarInitialState);
                    }
                });
                if ($window.W.Site.Common.TopBanner && $window.W.Site.Common.TopBanner.notifyHeight) {
                    $window.W.Site.Common.TopBanner.notifyHeight(function(newHeight) {
                        $rootScope.$apply(function() {
                            $rootScope.wixMenuTopBannerHeight = newHeight;
                        });
                    });
                }
            }
            $rootScope.$on("sidebarStateChange", function(event, sidebarOpen) {
                if ($window.W.Site.Common.Menu) {
                    if (isMenuControllerInitFinished) {
                        $window.W.Site.Common.Menu.Controller.onSidebarStateChange(sidebarOpen);
                    } else {
                        sidebarInitialState = sidebarOpen;
                    }
                }
            });
            return {
                init: function(options) {
                    if (layout && !layout.isStartInitialized) {
                        layout.init(options);
                        layout.isStartInitialized = true;
                    }
                },
                setMenuBottomBorderVisible: function(visible) {
                    if (controller) {
                        controller.setMenuBottomBorderVisible(visible);
                    }
                },
                setLayout: function(layout) {
                    if (controller && controller.setLayout) {
                        controller.setLayout(layout);
                    }
                },
                reload: function() {
                    if ($window.W.Site.Common.marketingHeaderAndFooter && $window.W.Site.Common.marketingHeaderAndFooter.reload) {
                        $window.W.Site.Common.marketingHeaderAndFooter.reload();
                        return;
                    }
                    if (controller) {
                        controller.init();
                    }
                }
            };
        } ]);
    }
    "use strict";
    W.Site.Common = W.Site.Common || {};
    var Petri = W.Site.Common.Petri || function() {
        var scopesMap = {};
        var experimentsMap = {};
        function safeAjax(url, callback) {
            jQuery.ajax({
                type: "GET",
                url: url,
                dataType: "text",
                success: function(res) {
                    callback(res);
                },
                error: function(obj, status, res) {
                    console.log("Laboratory " + status + ": " + res);
                    callback();
                }
            });
        }
        function safeParse(str) {
            if (str) {
                try {
                    return JSON.parse(str);
                } catch (e) {
                    console.log(e);
                }
            }
            return undefined;
        }
        function getExperiments(callback, scope) {
            if (scopesMap[scope] !== undefined) {
                return scopesMap[scope];
            }
            var baseApiUrl = options.baseApiUrl;
            safeAjax(baseApiUrl + "/wix-laboratory-server/laboratory/conductAllInScope?scope=" + scope, function(res) {
                callback(scopesMap[scope] = safeParse(res) || {});
            });
        }
        function getSingleExperiment(callback, key, fallback) {
            if (experimentsMap[key] !== undefined) {
                return experimentsMap[key];
            }
            var baseApiUrl = options.baseApiUrl;
            safeAjax(baseApiUrl + "/wix-laboratory-server/laboratory/conductExperiment?key=" + key + "&fallback=" + fallback, function(res) {
                callback(experimentsMap[key] = res || fallback);
            });
        }
        return {
            getExperiments: getExperiments,
            getSingleExperiment: getSingleExperiment
        };
    }();
    W.Site.Common.Petri = Petri;
    "use strict";
    window.W = window.W || {};
    W.Site = W.Site || {};
    W.Site.Common = W.Site.Common || {};
    var CookieBuilderService = W.Site.Common.CookieBuilderService || function() {
        function processDomain(domain) {
            if (!domain || domain === "localhost") {
                return "";
            }
            var result;
            var hasSubdomain = (domain.match(/\./g) || []).length > 1;
            if (hasSubdomain) {
                result = domain.substr(domain.indexOf("."));
            } else {
                result = "." + domain;
            }
            return ";domain=" + result;
        }
        function build(key, value, domain) {
            return key + "=" + value + ";path=/" + processDomain(domain);
        }
        function buildForRemoval(key, domain) {
            return build(key, "", domain) + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        return {
            build: build,
            buildForRemoval: buildForRemoval
        };
    }();
    W.Site.Common.CookieBuilderService = CookieBuilderService;
    "use strict";
    window.W = window.W || {};
    W.Site = W.Site || {};
    W.Site.Common = W.Site.Common || {};
    var StorageService = W.Site.Common.StorageService || function(cookieBuilder) {
        var domain = window.location.hostname;
        function setItem(itemName, itemValue) {
            try {
                document.cookie = cookieBuilder.build(itemName, itemValue, domain);
            } catch (e) {}
        }
        function getCookieValue(sKey) {
            return document.cookie.split("; ").map(function(cookieStr) {
                var pair = cookieStr.split("=");
                return {
                    key: pair[0],
                    value: pair[1]
                };
            }).filter(function(cookie) {
                return cookie.key === sKey;
            }).map(function(pair) {
                return pair.value;
            }).shift() || null;
        }
        function getItem(itemName) {
            try {
                return getCookieValue(itemName);
            } catch (e) {
                return null;
            }
        }
        function removeItem(itemName) {
            try {
                document.cookie = cookieBuilder.buildForRemoval(itemName, domain);
            } catch (e) {}
        }
        return {
            setItem: setItem,
            getItem: getItem,
            removeItem: removeItem
        };
    }(W.Site.Common.CookieBuilderService);
    W.Site.Common.StorageService = StorageService;
    "use strict";
    window.W = window.W || {};
    W.Site = W.Site || {};
    W.Site.Common = W.Site.Common || {};
    var Verticals = W.Site.Common.Verticals || function(storageService, verticalsMetaData) {
        var STORAGE_ID = "wixVertical";
        function getVerticalIdByPath(url) {
            for (var verticalId in verticalsMetaData) {
                if (verticalsMetaData.hasOwnProperty(verticalId)) {
                    if (url === verticalsMetaData[verticalId].homepagePath) {
                        return verticalId;
                    }
                }
            }
            return null;
        }
        function setUserVertical(verticalId) {
            storageService.setItem(STORAGE_ID, verticalId);
        }
        function getUserVertical() {
            return storageService.getItem(STORAGE_ID);
        }
        function clearUserVertical() {
            storageService.removeItem(STORAGE_ID);
        }
        return {
            setUserVertical: setUserVertical,
            getUserVertical: getUserVertical,
            getVerticalIdByPath: getVerticalIdByPath,
            clearUserVertical: clearUserVertical
        };
    }(W.Site.Common.StorageService, W.Site.Common.VerticalsMetaData);
    W.Site.Common.Verticals = Verticals;
    "use strict";
    var MobileMenu = W.Site.Common.MobileMenu || function() {
        var menuElement, menuHandle;
        var BODY_CLASS_PREPARE_MOBILE = "wix-menu-mobile-enabled";
        var BODY_CLASS_DISPLAY_MOBILE = "wix-menu-mobile-display-sidebar";
        var BODY_CLASS_MOBILE_ANIMATING_TO_SHOW = "wix-menu-mobile-animating-to-show";
        var BODY_CLASS_MOBILE_ANIMATING_TO_HIDE = "wix-menu-mobile-animating-to-hide";
        var SIDEBAR_ANIMATE_DURATION = 200;
        var tapEmbargo = {};
        var isSidebarDisplayed = false;
        function init(_menuElement) {
            menuElement = _menuElement;
            menuHandle = menuElement.find(".wm-mobile-optimized-menu-handle");
            jQuery("body").addClass(BODY_CLASS_PREPARE_MOBILE);
            events();
            handleScrollClassOnSidebar();
            jQuery(".mobile-lang, .wm-mobile-lang-overlay, .wm-icon").on("click", function(e) {
                jQuery(this).toggleClass("open");
                e.preventDefault();
            });
        }
        function clickWithDelay(href) {
            setTimeout(function() {
                window.location.href = href;
            }, 200);
        }
        function events() {
            menuHandle.bind("click tap touch", function(e) {
                e.preventDefault();
                W.Site.Common.BI.report(W.Site.Common.BI.mobileHeaderEvents.extension, W.Site.Common.BI.mobileHeaderEvents.src, W.Site.Common.BI.mobileHeaderEvents.openMenu);
                preventDoubleTap(showSidebar);
            });
            jQuery(".wm-mobile-menu-links a").not(".get-started").on("click tap touch", function(e) {
                e.preventDefault();
                var link = jQuery(this);
                W.Site.Common.BI.report(W.Site.Common.BI.mobileHeaderEvents.extension, W.Site.Common.BI.mobileHeaderEvents.src, W.Site.Common.BI.mobileHeaderEvents.menuPage, "name=" + link.attr("bi"));
                clickWithDelay(link.attr("href"));
            });
            menuElement.find(".wm-mobile-sidebar-wrapper").on("click tap touch", function(e) {
                if (isSidebarDisplayed && !isTouchSidebarLinksElement(e)) {
                    preventDoubleTap(hideSidebar);
                }
            });
            jQuery(window).on("orientationchange", function() {
                handleScrollClassOnSidebar();
            });
            jQuery("#wm-mobile-close-sidebar").bind("click tap touch", function() {
                hideSidebar();
            });
            handleEventsOnHideSidebar();
        }
        function handleScrollClassOnSidebar() {
            var sidebarContentHeight = menuElement.find(".wm-mobile-sidebar-content").height();
            Utils.toggleClassOnCondition(menuElement, "wm-require-sidebar-scroll", sidebarContentHeight > jQuery(window).height());
        }
        function showSidebar() {
            isSidebarDisplayed = true;
            jQuery("body").addClass(BODY_CLASS_DISPLAY_MOBILE);
            handleBodyAnimationClass(BODY_CLASS_MOBILE_ANIMATING_TO_SHOW);
            handleEventsOnShowSidebar();
            if (jQuery(".mobile-lang").hasClass("open")) {
                jQuery(".mobile-lang").removeClass("open");
            }
        }
        function handleBodyAnimationClass(clss) {
            jQuery("body").addClass(clss);
            setTimeout(function() {
                jQuery("body").removeClass(clss);
            }, SIDEBAR_ANIMATE_DURATION);
        }
        function handleEventsOnShowSidebar() {
            jQuery("#wix-menu").unbind("swiperight");
        }
        function handleEventsOnHideSidebar() {
            jQuery("#wix-menu").bind("swiperight", onBodySwipeRight);
            jQuery(document).unbind("vmouseup");
        }
        function hideSidebar() {
            handleEventsOnHideSidebar();
            handleBodyAnimationClass(BODY_CLASS_MOBILE_ANIMATING_TO_HIDE);
            isSidebarDisplayed = false;
            jQuery("body").removeClass(BODY_CLASS_DISPLAY_MOBILE);
        }
        function isTouchSidebarLinksElement(e) {
            return !!jQuery(e.target).closest("#wix-menu .wm-mobile-menu-links").length;
        }
        function onBodySwipeRight() {
            showSidebar();
        }
        function preventDoubleTap(callback) {
            var delay = SIDEBAR_ANIMATE_DURATION;
            var eventName = callback.name;
            if (!tapEmbargo[eventName]) {
                callback();
            }
            tapEmbargo[eventName] = true;
            setTimeout(function() {
                tapEmbargo[eventName] = false;
            }, delay);
        }
        return {
            init: init,
            hideSidebar: hideSidebar
        };
    }();
    W.Site.Common.MobileMenu = MobileMenu;
    "use strict";
    var MobileMenuLogin = W.Site.Common.MobileMenuLogin || function() {
        function init() {
            events();
            if (document.location.hash === "#sign-up") {
                gotoLoginPage();
            }
        }
        function gotoLoginPage() {
            setTimeout(function() {
                var link = "https://" + window.location.hostname + "/signin";
                window.open(link, "_top");
            }, 500);
        }
        function events() {
            jQuery("#wm-mobile-get-started").find("a").on("click tap touch", function(e) {
                e.preventDefault();
                W.Site.Common.BI.report(W.Site.Common.BI.mobileHeaderEvents.extension, W.Site.Common.BI.mobileHeaderEvents.src, W.Site.Common.BI.mobileHeaderEvents.signinClick);
                gotoLoginPage();
            });
        }
        return {
            init: init
        };
    }();
    W.Site.Common.MobileMenuLogin = MobileMenuLogin;
    "use strict";
    W.Site.Common = W.Site.Common || {};
    var UserApiManager = W.Site.Common.UserApiManager || function() {
        var userApi;
        var shortHost = document.location.host.substr(document.location.host.indexOf(".") + 1);
        var userLoggedIn = false;
        function setUserApi() {
            if (typeof UserApi === "undefined") {
                setTimeout(setUserApi, 50);
            } else {
                userApi = UserApi.getInstance().init({
                    orgDocID: "null-doc-id",
                    usersDomain: "https://users." + shortHost + "/wix-users",
                    corsEnabled: true,
                    urlThatUserRedirectedFrom: document.location.href
                });
                if (userApi.isSessionValid()) {
                    userLoggedIn = true;
                }
                jQuery.noConflict();
            }
        }
        function loadUserApi() {
            if (typeof UserApi === "undefined") {
                var url = "//static.parastorage.com/services/html-landing/html/mobile/hp-2/js-v4/user-api.js";
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = url;
                jQuery("body").append(s);
                setUserApi();
            }
        }
        return {
            loadUserApi: loadUserApi,
            userApi: userApi
        };
    }();
    W.Site.Common.UserApiManager = UserApiManager;
    "use strict";
    var AccountSection = function() {
        var menuElement;
        function fixSettingsDropDownWidth() {
            var settingsTitleWidth = menuElement.find(".wm-user-details").width();
            var settingsDropDownWidth = menuElement.find("#wm-settings-drop-down").width();
            var EXTRA_WIDTH = 44;
            if (settingsTitleWidth + EXTRA_WIDTH > settingsDropDownWidth) {
                menuElement.find("#wm-settings-drop-down").css({
                    width: settingsTitleWidth + EXTRA_WIDTH
                });
            }
        }
        function setDropDownHeight(singleRowElement, singleDropDownHeight) {
            var height = menuElement.height();
            jQuery(singleRowElement).find("a").each(function(index) {
                var elemHeight = height + (index - 1) * singleDropDownHeight - 30;
                jQuery(this).css({
                    top: elemHeight + "px",
                    height: singleDropDownHeight
                });
            });
        }
        function initMenuStyles() {
            var singleDropDownHeight = 48 - 1;
            var totalDropDownHeight = singleDropDownHeight * (options.supportedLanguages.length - 1);
            totalDropDownHeight = Math.min(totalDropDownHeight, window.innerHeight - 160);
            menuElement.find([ ".language-drop-down-background", ".language-drop-down-container", ".wm-lang-sub-menu" ].join(",")).css({
                height: totalDropDownHeight
            });
            setDropDownHeight(menuElement.find(".wm-language-drop-down-wrapper"), singleDropDownHeight);
        }
        function showAccountMenuButton(userDetails) {
            menuElement.find(".signin").hide();
            menuElement.find(".wm-language-drop-down-wrapper").hide();
            var loggedInElement = menuElement.find(".wm-logged-in");
            loggedInElement.show();
            loggedInElement.find(".user-name").text(userDetails.userName);
            if (userDetails.profileImage) {
                menuElement.find(".wm-user-image").remove();
                menuElement.find(".wm-user-image-wrapper").prepend('<img class="wm-user-image" src="' + Utils.fixProtocol(userDetails.profileImage) + '">');
            }
            menuElement.on("mouseover", ".wm-drop-down-settings-component", function() {
                fixSettingsDropDownWidth();
            });
        }
        function showLoginButton() {
            menuElement.find(".wm-logged-in").hide();
            menuElement.find(".signin").show();
            if (!options.externalPage) {
                menuElement.find(".wm-language-drop-down-wrapper").show();
                jQuery(".drop-down-language-wrapper").css({
                    opacity: 1
                });
            }
        }
        function changeUserComponentState() {
            var userDetailsServer = W.Site.Common.UserDetailsServer;
            if (userDetailsServer.isSessionValid()) {
                userDetailsServer.get(function(userDetails) {
                    if (userDetailsServer.isSessionValid()) {
                        showAccountMenuButton(userDetails);
                    } else {
                        showLoginButton();
                    }
                }, {
                    forceGetJSON: true,
                    jsonpEnabled: options.jsonpEnabled,
                    baseApiUrl: options.baseApiUrl
                });
            } else {
                showLoginButton();
            }
        }
        function init(element) {
            menuElement = element;
            menuElement.find(".current-language").on("mouseenter", initMenuStyles);
            menuElement.find(".wm-language-drop-down-wrapper").on("mouseenter", initMenuStyles);
            if (options.displayLoginComponent) {
                changeUserComponentState();
            }
        }
        return {
            init: init,
            changeUserComponentState: changeUserComponentState
        };
    }();
    "use strict";
    var View = function() {
        var menuElement;
        var originalMenuElement;
        var LANGUAGE_LOCALE_MAP = {
            en: "English",
            cs: "ÄŒeÅ¡tina",
            da: "Dansk",
            de: "Deutsch",
            fr: "FranÃ§ais",
            es: "EspaÃ±ol",
            it: "Italiano",
            no: "Norsk",
            pl: "Polski",
            pt: "PortuguÃªs",
            ru: "Ð ÑƒÑÑÐºÐ¸Ð¹",
            sv: "Svenska",
            ja: "æ—¥æœ¬èªž",
            ko: "í•œêµ­ì–´",
            tr: "TÃ¼rkÃ§e",
            nl: "Nederlands",
            hi: "à¤¹à¤¿à¤¨à¥à¤¦à¥€",
            zh: "Chinese",
            th: "Thai"
        };
        function drawLogo() {
            return originalMenuElement.find("#wm-logo")[0].outerHTML;
        }
        function drawLinks(selected) {
            var navigationLinksTemplate = '<div class="wm-links-container"></div>';
            var navigationLinksElement = jQuery(navigationLinksTemplate);
            navigationLinksElement.append(originalMenuElement.find("ul:nth(0)")).find("#" + selected).addClass("selected");
            return navigationLinksElement[0].outerHTML;
        }
        function generateVerticalMenuItemTemplate(verticalId, verticalLabel, href) {
            return "<li>" + '<a class="wm-vertical-link" data-vertical-id="' + verticalId + '" href="' + href + '">' + "<span>" + verticalLabel + "</span>" + "</a>" + "</li>";
        }
        function drawVerticalsDropDown(selectedVerticalId, verticalsMetaData, verticalsTranslations) {
            if (selectedVerticalId !== null) {
                var menuItemsTemplate = Object.keys(verticalsMetaData).filter(function(verticalId) {
                    return verticalsTranslations[verticalId];
                }).map(function(verticalId) {
                    return generateVerticalMenuItemTemplate(verticalsMetaData[verticalId].biName, verticalsTranslations[verticalId], verticalsMetaData[verticalId].homepagePath);
                }).join("");
                menuItemsTemplate += generateVerticalMenuItemTemplate("other", verticalsTranslations.OTHER, Utils.getLocationOrigin() + "/website/templates");
                var verticalsMenuTemplate = '<a class="unselectable">' + verticalsTranslations[selectedVerticalId] + '<span class="sub-menu-arrow"><svg width="10" height="5.7" viewBox="0 0 10 5.7"><polygon fill="none" points="5 5.7 0 0.7 0.7 0 5 4.4 9.3 0 10 0.7 "/></svg></span>' + "</a>" + '<ul class="wm-submenu">' + menuItemsTemplate + "</ul>";
                jQuery("#wm-verticals-drop-down").append(verticalsMenuTemplate);
            }
        }
        function postAction() {
            return {
                postLogin: options.postLogin !== "/" ? options.postLogin : window.location.href,
                postSignUp: options.postSignUp !== "/" ? options.postSignUp : window.location.href
            };
        }
        function drawUserStateComponent() {
            if (options.displayLoginComponent) {
                var signinText = jQuery(".wm-signin").html();
                var signinLink = jQuery(".wm-signin").attr("href");
                var userGreetingsText = jQuery("#wm-user-greeting").html();
                if (signinLink !== "#") {
                    var action = postAction();
                    signinLink += "&postLogin=" + encodeURIComponent(action.postLogin);
                    signinLink += "&postSignUp=" + encodeURIComponent(action.postSignUp);
                    signinLink += "&originUrl=" + encodeURIComponent(window.location.href);
                }
                return "" + '<a id="wm-signin-link" href="' + signinLink + '" class="signin"><span class="wix-component-text">' + signinText + "</span></a>" + '<div class="wm-logged-in">' + '<div class="wm-settings-wrapper">' + '<div class="wm-drop-down-settings-component">' + '<a class="wm-user-details-wrapper">' + '<div class="wm-user-details">' + '<div class="wm-user-image-wrapper">' + '<div class="wm-user-fallback-image">&nbsp;</div>' + "</div>" + '<div class="user-name-actions">' + '<div class="user-name-wrapper">' + '<div class="user-name">' + userGreetingsText + "</div>" + "</div>" + "</div>" + '<span class="sub-menu-arrow"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="10" height="5.7" viewBox="0 0 10 5.7" enable-background="new 0 0 9.992 5.695" xml:space="preserve"><polygon fill="none" points="5 5.7 0 0.7 0.7 0 5 4.4 9.3 0 10 0.7 "/></svg></span>' + "</div>" + "</a>" + jQuery("#wm-settings-drop-down")[0].outerHTML + "</div>" + "</div>" + "</div>";
            } else {
                return "";
            }
        }
        function langLink(newLocale) {
            var setLanguageEntryPoint = clientTopology.usersBaseUrl + "/wix-users/auth/setLanguage";
            return Utils.addUrlParams(setLanguageEntryPoint, {
                language: newLocale,
                redirectTo: Utils.localizeUrl(window.location.href, newLocale)
            });
        }
        function createDropDownLanguageArray() {
            return options.supportedLanguages.filter(function(x) {
                return x !== options.lang;
            });
        }
        function createDropDownLanguageListHtml() {
            return createDropDownLanguageArray().map(function(language) {
                var link = langLink(language, options.lang);
                return '<li><a href="' + link + '" class="wm-change-language-link language-' + language + '" data-lang="' + language + '">' + '<span class="drop-down-language-wrapper">' + '<span class="wix-component-text display">' + LANGUAGE_LOCALE_MAP[language] + "</span>" + "</span>" + "</a></li>";
            }).join("");
        }
        function createMobileDropDownLanguageListHtml() {
            var dropDownLanguageHtml = '<div class="mobile-lang"><ul><li class="selected-lang"><a>' + LANGUAGE_LOCALE_MAP[options.lang] + "</a></li>";
            dropDownLanguageHtml += createDropDownLanguageArray().map(function(language) {
                var link = langLink(language, options.lang);
                return '<li><a href="' + link + '" class="wm-change-language-link language-' + language + '" data-lang="' + language + '">' + LANGUAGE_LOCALE_MAP[language] + "</a></li>";
            });
            dropDownLanguageHtml += '</ul><div class="wm-mobile-lang-overlay"></div></div>';
            return dropDownLanguageHtml;
        }
        function drawLanguageComponentAnnonymous() {
            if (options.displayLoginComponent) {
                return "" + '<span class="globeIcon"><svg width="18" height="18" viewBox="0 0 18 18"><path fill="none" d="M10.8 0.2C10.3 0.1 9.9 0 9.5 0 9.3 0 9.2 0 9 0l0 0C8.4 0 7.9 0.1 7.4 0.2 3.2 0.9 0 4.6 0 9c0 4.4 3.2 8.1 7.4 8.8C7.9 17.9 8.4 18 9 18l0 0c0.2 0 0.3 0 0.5 0 0.4 0 0.9-0.1 1.3-0.2C14.9 17 18 13.4 18 9 18 4.6 14.9 1 10.8 0.2zM16.4 6h-3.6c-0.6-2-1.7-3.9-2.8-5C12.8 1.4 15.4 3.5 16.4 6zM12 9c0 0.7-0.1 1.3-0.2 2H6.3C6.1 10.3 6 9.7 6 9c0-0.7 0.1-1.3 0.3-2h5.5C11.9 7.7 12 8.3 12 9zM9 16.5c-1-1.1-1.8-2.7-2.5-4.5h5C11.1 13.8 10 15.4 9 16.5zM6.5 6C7.2 4.2 8 2.6 9 1.5c1 1.1 2.1 2.7 2.6 4.5H6.5zM8 1c-1.1 1.3-2.1 3.1-2.7 5H1.6C2.7 3.4 5.1 1.4 8 1zM1.3 7H5.1C5 7.7 4.9 8.3 4.9 9c0 0.7 0.1 1.3 0.2 2H1.3c-0.2-0.6-0.3-1.3-0.3-2C1 8.3 1.1 7.6 1.3 7zM1.6 12h3.7c0.5 1.9 1.6 3.7 2.7 5C5.1 16.6 2.7 14.6 1.6 12zM10 17c1.2-1.1 2.2-2.9 2.8-5h3.6C15.4 14.5 12.7 16.8 10 17zM16.7 11h-3.7c0.1-0.7 0.2-1.3 0.2-2 0-0.7 0-1.3-0.1-2h3.7c0.1 0.6 0.2 1.3 0.2 2C17 9.7 16.9 10.4 16.7 11z"/></svg></span>' + '<div class="language-drop-down-background"></div>' + '<ul class="language-drop-down-container">' + createDropDownLanguageListHtml() + "</ul>";
            } else {
                return "";
            }
        }
        function createSettingsLanguageComponent() {
            return "" + '<a class="current-language">' + LANGUAGE_LOCALE_MAP[options.lang] + '<span class="globeIcon"><svg width="18" height="18" viewBox="0 0 18 18"><path fill="none" d="M10.8 0.2C10.3 0.1 9.9 0 9.5 0 9.3 0 9.2 0 9 0l0 0C8.4 0 7.9 0.1 7.4 0.2 3.2 0.9 0 4.6 0 9c0 4.4 3.2 8.1 7.4 8.8C7.9 17.9 8.4 18 9 18l0 0c0.2 0 0.3 0 0.5 0 0.4 0 0.9-0.1 1.3-0.2C14.9 17 18 13.4 18 9 18 4.6 14.9 1 10.8 0.2zM16.4 6h-3.6c-0.6-2-1.7-3.9-2.8-5C12.8 1.4 15.4 3.5 16.4 6zM12 9c0 0.7-0.1 1.3-0.2 2H6.3C6.1 10.3 6 9.7 6 9c0-0.7 0.1-1.3 0.3-2h5.5C11.9 7.7 12 8.3 12 9zM9 16.5c-1-1.1-1.8-2.7-2.5-4.5h5C11.1 13.8 10 15.4 9 16.5zM6.5 6C7.2 4.2 8 2.6 9 1.5c1 1.1 2.1 2.7 2.6 4.5H6.5zM8 1c-1.1 1.3-2.1 3.1-2.7 5H1.6C2.7 3.4 5.1 1.4 8 1zM1.3 7H5.1C5 7.7 4.9 8.3 4.9 9c0 0.7 0.1 1.3 0.2 2H1.3c-0.2-0.6-0.3-1.3-0.3-2C1 8.3 1.1 7.6 1.3 7zM1.6 12h3.7c0.5 1.9 1.6 3.7 2.7 5C5.1 16.6 2.7 14.6 1.6 12zM10 17c1.2-1.1 2.2-2.9 2.8-5h3.6C15.4 14.5 12.7 16.8 10 17zM16.7 11h-3.7c0.1-0.7 0.2-1.3 0.2-2 0-0.7 0-1.3-0.1-2h3.7c0.1 0.6 0.2 1.3 0.2 2C17 9.7 16.9 10.4 16.7 11z"/></svg></span>' + "</a>" + '<ul id="wm-language-selector-list" class="wm-lang-sub-menu">' + createDropDownLanguageListHtml() + "</ul>";
        }
        function drawSettingsLanguageDropDown() {
            jQuery("#wm-settings-language-dropdown").html(createSettingsLanguageComponent());
            jQuery(".wm-container").append(createMobileDropDownLanguageListHtml());
        }
        function drawMobileOptimizedMenuHandle() {
            if (options.mobileOptimized || options.forceMobileView && options.forceMobileView.force) {
                return '<a class="wm-mobile-optimized-menu-handle"><div class="wm-icon"></div></a>';
            } else {
                return "";
            }
        }
        function drawMobileOptimizedSidebar(selected) {
            if (options.mobileOptimized || options.forceMobileView && options.forceMobileView.force) {
                var element = jQuery("" + '<div class="wm-mobile-sidebar-wrapper">' + '<div class="wm-mobile-page-overlay"></div>' + '<div class="wm-mobile-sidebar">' + '<div class="wm-mobile-sidebar-content">' + originalMenuElement.find("#wm-mobile-sidebar").html() + '<div id="wm-mobile-close-sidebar" class="header-and-footer-svg-font-icons-close"></div>' + "</div>" + "</div>" + "</div>");
                element.find("#" + selected).addClass("selected");
                return element[0].outerHTML;
            } else {
                return "";
            }
        }
        function assignDropDownClasses() {
            menuElement.find(".wm-links-container > ul > li").each(function(i, element) {
                if (jQuery(element).find("ul").length > 0) {
                    jQuery(element).addClass("wm-dropdown");
                }
                jQuery(element).addClass("menuItem");
            });
        }
        function adjustMenuForExternalPage() {
            var linksWrapper = menuElement.find(".wm-links-wrapper");
            menuElement.find(".wm-container").append(linksWrapper);
            menuElement.attr({
                "data-external-page": options.externalPage
            });
        }
        function checkIfMenuItemHref(url, liItem) {
            var isMatch = false;
            jQuery(liItem).find("a:not(.wm-vertical-link)").each(function() {
                var link = jQuery(this).attr("href");
                if (url.indexOf(link) !== -1) {
                    isMatch = true;
                }
            });
            return isMatch;
        }
        function selectMenuItem() {
            var verticalId = W.Site.Common.Verticals.getVerticalIdByPath(window.location.pathname);
            if (verticalId) {
                jQuery("#wm-verticals-drop-down").addClass("selected");
            } else {
                var pageURL = Utils.getLocationOrigin() + window.location.pathname;
                jQuery(".wm-links-container ul .menuItem").each(function() {
                    var isMatch = checkIfMenuItemHref(pageURL, jQuery(this));
                    if (isMatch) {
                        jQuery(this).addClass("selected");
                    }
                });
            }
        }
        function init() {
            originalMenuElement = jQuery("#wix-menu");
            var menuString = drawMobileOptimizedSidebar(options.selectedNav) + '<div class="wm-container">' + drawMobileOptimizedMenuHandle() + '<div class="wm-logo-wrapper">' + drawLogo() + "</div>" + '<div class="wm-links-wrapper">' + drawLinks(options.selectedNav) + "</div>" + '<div class="wm-language-and-user-wrapper">' + '<div class="wm-language-drop-down-wrapper">' + drawLanguageComponentAnnonymous() + "</div>" + '<div class="wm-user-state-wrapper">' + drawUserStateComponent() + "</div>" + "</div>" + "</div>";
            menuElement = jQuery("#wix-menu").empty().append(menuString).css("visibility", "visible");
            if (options.verticalsActive) {
                var verticalsTranslations = JSON.parse(jQuery("#wm-verticals-names").text() || "{}");
                drawVerticalsDropDown(W.Site.Common.Verticals.getUserVertical(), W.Site.Common.VerticalsMetaData, verticalsTranslations);
            }
            assignDropDownClasses();
            drawSettingsLanguageDropDown();
            if (options.externalPage) {
                adjustMenuForExternalPage();
            }
            menuElement.attr("data-layout", options.layout);
            jQuery("body").addClass("wix-menu-enabled");
            if (W.Site.Common.isMobile || options.showMobileMenu) {
                menuElement.addClass("wm-mobile");
            }
            if (options.mobileOptimized && W.Site.Common.isMobile || options.showMobileMenu) {
                menuElement.addClass("wm-mobile-optimized");
            }
            selectMenuItem();
            return menuElement;
        }
        return {
            init: init
        };
    }();
    "use strict";
    W.Site.Common.Menu = W.Site.Common.Menu || {};
    var Controller = W.Site.Common.Menu.Controller || function() {
        var menuElement, postInitCallback = function() {}, preInitLayoutOption, isSidebarStateChangeFirstTime = true;
        function init() {
            initialize();
        }
        function changeAElementPath(selector, path) {
            var nodesList = document.querySelectorAll(selector);
            var parts = path.split("#");
            var pathname = parts.length > 0 ? parts[0] : "";
            var hash = parts.length > 1 ? parts[1] : "";
            for (var i = 0; i < nodesList.length; ++i) {
                var element = nodesList[i];
                if (pathname) {
                    element.pathname = pathname;
                }
                if (hash) {
                    element.hash = hash;
                }
            }
        }
        function getVerticalByCurrentPath() {
            return W.Site.Common.Verticals.getVerticalIdByPath(window.location.pathname);
        }
        function getUserVertical() {
            return W.Site.Common.Verticals.getUserVertical();
        }
        function setTemplatesUrlByVerticalId(verticalId) {
            var templatesPath = W.Site.Common.VerticalsMetaData[verticalId].templatesPath;
            changeAElementPath("#wix-menu .wm-create-link", templatesPath);
        }
        function showVerticalsDropDown() {
            var nodesList = document.querySelectorAll("#wix-menu #wm-verticals-drop-down");
            for (var i = 0; i < nodesList.length; ++i) {
                var element = nodesList[i];
                element.classList.remove("is-hidden");
            }
        }
        function showVerticalsMenuItem() {
            var nodesList = document.querySelectorAll("#wix-menu #wm-verticals-link");
            for (var i = 0; i < nodesList.length; ++i) {
                var element = nodesList[i];
                element.classList.remove("is-hidden");
            }
        }
        function reportSigninClicked() {
            W.Site.Common.BI.report(W.Site.Common.BI.legacyHeaderEvents.extension, W.Site.Common.BI.legacyHeaderEvents.src, W.Site.Common.BI.legacyHeaderEvents.signinClick);
        }
        function reportTabClicked(tabName) {
            W.Site.Common.BI.report(W.Site.Common.BI.legacyHeaderEvents.extension, W.Site.Common.BI.legacyHeaderEvents.src, W.Site.Common.BI.legacyHeaderEvents.clickOnHeader, "row=first&tab=" + tabName);
        }
        function reportSubTabClicked(tabName, subTabName) {
            W.Site.Common.BI.report(W.Site.Common.BI.legacyHeaderEvents.extension, W.Site.Common.BI.legacyHeaderEvents.src, W.Site.Common.BI.legacyHeaderEvents.clickOnHeader, "row=second&tab=" + tabName + "&sub_tab=" + subTabName);
        }
        function reportLanguageChange(currentLang, newLang) {
            W.Site.Common.BI.report(W.Site.Common.BI.legacyHeaderEvents.extension, W.Site.Common.BI.legacyHeaderEvents.src, W.Site.Common.BI.legacyHeaderEvents.languageChange, "origin_lng=" + currentLang + "&destination_lng=" + newLang);
        }
        function reportGoToVerticalsSelectionClicked() {
            W.Site.Common.BI.report(W.Site.Common.BI.headerFooterEvent.extension, W.Site.Common.BI.headerFooterEvent.src, W.Site.Common.BI.headerFooterEvent.goToVerticalsSelection);
        }
        function reportGoToVerticalHomepageClicked(verticalId) {
            W.Site.Common.BI.report(W.Site.Common.BI.headerFooterEvent.extension, W.Site.Common.BI.headerFooterEvent.src, W.Site.Common.BI.headerFooterEvent.goToVerticalHomepage, "name=" + verticalId);
            W.Site.Common.BI.report(W.Site.Common.BI.spettatoreEvents.extension, W.Site.Common.BI.spettatoreEvents.src, W.Site.Common.BI.spettatoreEvents.legacyPostReg, "cat=" + verticalId);
        }
        function decorateClick(cssSelector, decorationFunc) {
            jQuery(cssSelector).on("click touch tap", function(event) {
                event.preventDefault();
                decorationFunc(event.currentTarget);
                setTimeout(function() {
                    window.location = event.currentTarget.href;
                }, 1e3);
            });
        }
        function listenToClickEventsForBI() {
            decorateClick("a#wm-logo", function() {
                reportTabClicked("WixLogo");
            });
            decorateClick("a#wm-my-account-link", function() {
                reportTabClicked("MySites");
            });
            decorateClick("a.wm-create-link", function() {
                reportTabClicked("Templates");
            });
            decorateClick("a.wm-explore-link", function() {
                reportTabClicked("Explore");
            });
            decorateClick("a#wm-subscriptions", function() {
                reportTabClicked("Subscriptions");
            });
            decorateClick("a#wm-support-link", function() {
                reportTabClicked("Support");
            });
            decorateClick("a#wm-signin-link", function() {
                reportSigninClicked();
            });
            decorateClick("a#wm-get-inspired-link", function() {
                reportSubTabClicked("Explore", "GetInspired");
            });
            decorateClick("a.wm-features-link", function() {
                reportTabClicked("Features");
            });
            decorateClick("a#wm-app-market-link", function() {
                reportSubTabClicked("Explore", "AppMarket");
            });
            decorateClick("a#wm-sub-upgrade-plans", function() {
                reportSubTabClicked("Subscriptions", "PremiumPlans");
            });
            decorateClick("a#wm-sub-domains", function() {
                reportSubTabClicked("Subscriptions", "Domains");
            });
            decorateClick("a#wm-sub-mail-box", function() {
                reportSubTabClicked("Subscriptions", "Mailboxes");
            });
            decorateClick("a#wm-site-for", reportGoToVerticalsSelectionClicked);
            decorateClick("a.wm-vertical-link", function(element) {
                reportGoToVerticalHomepageClicked(jQuery(element).attr("data-vertical-id"));
            });
            decorateClick("a.wm-change-language-link", function(element) {
                reportLanguageChange(options.lang, jQuery(element).attr("data-lang"));
            });
        }
        function overrideEditorFixes() {
            jQuery("body").removeClass("wix-menu-enabled");
            jQuery("#wix-menu").addClass("override-editor-fixes");
        }
        function initialize() {
            menuElement = View.init();
            manipulateMenuElement();
            AccountSection.init(menuElement);
            menuElement.css("visibility", "visible");
            menuElement.addClass("no-sidebar-state-change-occurred");
            if (options.mobileOptimized && W.Site.Common.isMobile || options.forceMobileView.force) {
                MobileMenu.init(menuElement);
                MobileMenuLogin.init(menuElement);
                if (options.forceMobileView.force && window.innerWidth > options.forceMobileView.size) {
                    options.showMobileMenu = false;
                    jQuery("#wix-footer").show();
                    jQuery("body").removeClass("wix-menu-mobile-enabled");
                    jQuery("#wix-menu").removeClass("wm-mobile wm-mobile-optimized");
                }
            }
            var userVerticalId = getUserVertical();
            if (userVerticalId) {
                setTemplatesUrlByVerticalId(userVerticalId);
            }
            var isVerticalHomePage = getVerticalByCurrentPath() ? true : false;
            if (options.forceTransparentStyle || isVerticalHomePage) {
                overrideEditorFixes();
                jQuery("#wix-menu").addClass("transparentMenu").mouseenter(function() {
                    jQuery(this).removeClass("transparentMenu");
                }).mouseleave(function() {
                    jQuery(this).addClass("transparentMenu");
                });
            }
            if (options.verticalsActive) {
                if (userVerticalId) {
                    showVerticalsDropDown();
                } else {
                    showVerticalsMenuItem();
                }
            }
            listenToClickEventsForBI();
            if (options.showTopBanner !== undefined && options.showTopBanner) {
                TopBanner.init();
            }
            setTimeout(function() {
                if (preInitLayoutOption) {
                    setLayout(preInitLayoutOption);
                }
                postInitCallback();
                var loadTime = Date.now() - W.Site.Common.HeaderInitTime;
                W.Site.Common.BI.report(W.Site.Common.BI.headerFooterEvent.extension, W.Site.Common.BI.headerFooterEvent.src, W.Site.Common.BI.headerFooterEvent.loadComplete, "load_time=" + loadTime + "&is_mobile=" + W.Site.Common.isMobile + "&component=header");
                jQuery("#wix-menu").removeClass("initializing");
            }, 0);
        }
        function manipulateMenuElement() {
            addStylingAttributesToMenuElement();
            if (W.Site.Common.UserDetailsServer.isSessionValid()) {
                manipulatePremiumLinksLoggedIn();
            }
        }
        function manipulatePremiumLinksLoggedIn() {
            var premiumApiUrl = clientTopology.premiumBaseUrl + "/wix/api";
            menuElement.find("#wm-sub-upgrade-plans, #wm-subscriptions").attr("href", premiumApiUrl + "/billingConsole");
            menuElement.find("#wm-sub-domains").attr("href", premiumApiUrl + "/domainConsole");
            menuElement.find("#wm-sub-mail-box").attr("href", premiumApiUrl + "/googleMailBoxConsole");
        }
        function addStylingAttributesToMenuElement() {
            menuElement.attr({
                lang: options.language
            });
            if (!options.displayLoginComponent) {
                menuElement.addClass("no-login");
            }
            if (!options.displayLanguageComponent) {
                menuElement.addClass("no-language-support");
            }
        }
        function setMenuBottomBorderVisible(value) {
            if (value) {
                menuElement.removeClass("hide-menu-bottom-border");
            } else {
                menuElement.addClass("hide-menu-bottom-border");
            }
        }
        function isMenuBottomBorderVisible() {
            return !menuElement.hasClass("hide-menu-bottom-border");
        }
        function setLayout(layout) {
            if (!menuElement) {
                preInitLayoutOption = layout;
                return;
            }
            menuElement.attr("data-layout", layout);
        }
        function onSidebarStateChange(sidebarOpen) {
            if (!menuElement) {
                return;
            }
            if (isSidebarStateChangeFirstTime) {
                isSidebarStateChangeFirstTime = false;
                setTimeout(function() {
                    menuElement.removeClass("no-sidebar-state-change-occurred");
                });
            }
            toggleSidebarStateClass(sidebarOpen);
        }
        function toggleSidebarStateClass(sidebarOpen) {
            if (sidebarOpen) {
                menuElement.addClass("sidebar-is-open");
            } else {
                menuElement.removeClass("sidebar-is-open");
            }
        }
        function setPostInitCallback(callback) {
            postInitCallback = callback;
        }
        return {
            init: init,
            setMenuBottomBorderVisible: setMenuBottomBorderVisible,
            isMenuBottomBorderVisible: isMenuBottomBorderVisible,
            setLayout: setLayout,
            onSidebarStateChange: onSidebarStateChange,
            setPostInitCallback: setPostInitCallback
        };
    }();
    W.Site.Common.Menu.Controller = Controller;
    "use strict";
    W.Site.Common = W.Site.Common || {};
    var TopBanner = W.Site.Common.TopBanner = W.Site.Common.TopBanner || function() {
        var notifyHeightCallback = function() {};
        var time = new Date().getTime();
        var maxTimeLimit = 24 * 60 * 60 * 1e3;
        var ignoredBanners, bannerLastTime;
        function languageBanner(lang, code) {
            var str = "Wix is also available in " + lang + '. <span id="linkBtn">Switch your language.</span>';
            return {
                message: str,
                link: "https://users.wix.com/wix-users/auth/setLanguage?language=" + code + "&redirectTo=https%3A%2F%2F" + code + ".wix.com%2Fmy-account%2Fsites%2F",
                target: "_self"
            };
        }
        function translationBanner(lang, code) {
            var str = "Join Our New " + lang + ' Wix Community Translation Program - <span id="linkBtn">Learn More</span>';
            return {
                message: str,
                link: "http://www.wix.com/web-lp/wix-translate-" + code,
                target: "_blank"
            };
        }
        var banners = {
            DanishTranslateBanner: translationBanner("Danish", "dk"),
            CzechTranslateBanner: translationBanner("Czech", "cz"),
            FinnishTranslateBanner: translationBanner("Finnish", "fn"),
            DanishBanner: languageBanner("Danish", "dk"),
            DutchBanner: languageBanner("Dutch", "nl"),
            FrenchBanner: languageBanner("French", "fr"),
            GermanBanner: languageBanner("German", "de"),
            ItalianBanner: languageBanner("Italian", "it"),
            JapaneseBanner: languageBanner("Japanese", "ja"),
            KoreanBanner: languageBanner("Korean", "ko"),
            NorwegianBanner: languageBanner("Norwegian", "no"),
            PolishBanner: languageBanner("Polish", "pl"),
            PortugueseBanner: languageBanner("Portuguese", "pt"),
            RussianBanner: languageBanner("Russian", "ru"),
            SpanishBanner: languageBanner("Spanish", "es"),
            SwedishBanner: languageBanner("Swedish", "sv"),
            TurkishBanner: languageBanner("Turkish", "tr"),
            HindiBanner: languageBanner("Hindi", "hi")
        };
        function getIgnoredBanners() {
            ignoredBanners = localStorage.getItem("headerBanners") !== null ? localStorage.getItem("headerBanners") : [];
            bannerLastTime = localStorage.getItem("headerBanners-time") !== null ? localStorage.getItem("headerBanners-time") : 0;
            if (typeof ignoredBanners === "string") {
                ignoredBanners = ignoredBanners.split(",");
            }
            bannerLastTime = parseInt(bannerLastTime, 10);
        }
        function ignoreBanner(banner) {
            ignoredBanners.push(banner);
            localStorage.setItem("headerBanners", ignoredBanners.join(","));
            localStorage.setItem("headerBanners-time", time);
        }
        function report(banner, evid) {
            if (evid) {
                W.Site.Common.BI.report(W.Site.Common.BI.topBannerEvent.extension, W.Site.Common.BI.topBannerEvent.src, evid, "name=" + banner);
            } else {
                evid = banner;
                W.Site.Common.BI.report(W.Site.Common.BI.topBannerEvent.extension, W.Site.Common.BI.topBannerEvent.src, evid);
            }
        }
        function removeBannerView(banner) {
            jQuery("#wix-menu-banner").animate({
                opacity: "0"
            }, 200, function() {
                jQuery("#wix-menu-banner").hide();
            });
            var marginBackToTop = 0;
            if (options.mobileOptimized && W.Site.Common.isMobile) {
                marginBackToTop = 50;
            }
            jQuery(".header-wrapper ").animate({
                "margin-top": marginBackToTop
            }, 200, function() {});
            notifyHeightCallback(marginBackToTop);
            jQuery("body").animate({
                "padding-top": marginBackToTop
            }, 200, function() {
                jQuery("body").removeClass("wix-menu-top-banner");
            });
            ignoreBanner(banner);
            report(banner, W.Site.Common.BI.topBannerEvent.update);
        }
        function loadView(selectedBanner) {
            if (bannerLastTime + maxTimeLimit >= time) {
                return;
            }
            report(selectedBanner, W.Site.Common.BI.topBannerEvent.create);
            jQuery("body").append('<div id="wix-menu-banner"></div>');
            jQuery("#wix-menu-banner").append('<div id="close-btn"></div>');
            jQuery("#wix-menu-banner").append('<p id="wix-menu-banner-message"></p>');
            jQuery("#wix-menu-banner-message").html(banners[selectedBanner].message);
            jQuery("#wix-menu-banner").css("background-color", "#60adf0");
            jQuery("#close-btn").on("tap touch click", function() {
                removeBannerView(selectedBanner);
            });
            jQuery("#linkBtn").on("tap touch click", function() {
                report(selectedBanner, "14");
                report(selectedBanner, W.Site.Common.BI.topBannerEvent.click);
                setTimeout(function() {
                    window.open(banners[selectedBanner].link, banners[selectedBanner].target);
                }, 100);
            });
            var bodyMarginTop = parseInt(jQuery("#wix-menu-banner").css("height")) > 50 ? parseInt(jQuery("#wix-menu-banner").css("height")) : 50;
            notifyHeightCallback(0);
            setTimeout(function() {
                notifyHeightCallback(bodyMarginTop);
                jQuery("body").addClass("wix-menu-top-banner").animate({
                    "padding-top": bodyMarginTop
                }, 200, function() {
                    jQuery("#wix-menu-banner").animate({
                        opacity: "1"
                    }, 200, function() {});
                });
            }, 1e3);
            report(W.Site.Common.BI.topBannerEvent.complete);
        }
        function parseBannerData(data) {
            var allowedBanners = [];
            jQuery.each(data, function(bannerName, value) {
                bannerName = bannerName.replace(/^specs\./, "");
                if (value === "true" && ignoredBanners.indexOf(bannerName) === -1) {
                    allowedBanners.push(bannerName);
                }
            });
            if (allowedBanners.length) {
                loadView(allowedBanners.shift());
            }
        }
        function init() {
            report(W.Site.Common.BI.topBannerEvent.init);
            getIgnoredBanners();
            W.Site.Common.Petri.getExperiments(parseBannerData, "headerBanners");
        }
        return {
            init: init,
            notifyHeight: function(callback) {
                notifyHeightCallback = callback;
            }
        };
    }();
})({}, function() {
    return this;
}());