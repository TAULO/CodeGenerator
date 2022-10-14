/*******************************************************
* Copyright (C) 2018-2022 WP Interactive Media, Inc. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*******************************************************/
(() => {
    "use strict";
    const EXTENSION_ID = chrome.runtime.id, UNSUPPORTED_SITES = [ ".hotstar.", ".hbogola.", ".hboespana." ], SERVICE_SITES = [ ".netflix.", ".disneyplus.", ".hbomax.", ".hulu.", ".amazon.", ".primevideo.", ".youtube." ], ChromeStorageReadError = "Failed to read chrome storage. Please refresh the page and try again", GenericErrorMessage = "An unexpected error occured. Please refresh the page and try again.";
    class StreamingSerivce {
        constructor(requiredPermissions, contentScripts, serverName, name, syncFromEnd) {
            this.requiredPermissions = requiredPermissions, this.serverName = serverName, this.name = name, 
            this.contentScripts = contentScripts, this.syncFromEnd = syncFromEnd;
        }
        urlWithSessionId(sessionId) {
            return `https://redirect.teleparty.com/join/${sessionId}`;
        }
    }
    var StreamingServiceName, HboVideoType;
    function getHBOVideoType(url) {
        return url.includes("urn:hbo:feature") ? HboVideoType.HBO_FEATURE : url.includes("urn:hbo:episode") || url.includes("urn:hbo:page:") && url.includes(":type:episode") ? HboVideoType.HBO_EPISODE : url.includes("urn:hbo:extra") ? HboVideoType.HBO_EXTRA : HboVideoType.NONE;
    }
    function getURLParameter(url, key, queryIndex) {
        const searchString = "?" + url.split("?")[queryIndex];
        if (void 0 === searchString) return;
        const escapedKey = key.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), match = new RegExp("[?|&]" + escapedKey + "=([^&]*)(&|$)").exec(searchString);
        return null === match || match.length < 2 ? void 0 : decodeURIComponent(match[1]);
    }
    !function(StreamingServiceName) {
        StreamingServiceName.NETFLIX = "NETFLIX", StreamingServiceName.HULU = "HULU", StreamingServiceName.DISNEY_PLUS = "DISNEY_PLUS", 
        StreamingServiceName.HBO_MAX = "HBO_MAX", StreamingServiceName.YOUTUBE = "YOUTUBE", 
        StreamingServiceName.AMAZON = "AMAZON";
    }(StreamingServiceName || (StreamingServiceName = {})), function(HboVideoType) {
        HboVideoType.HBO_EPISODE = "episode", HboVideoType.HBO_FEATURE = "feature", HboVideoType.HBO_EXTRA = "extra", 
        HboVideoType.NONE = "none";
    }(HboVideoType || (HboVideoType = {}));
    const Netflix = new class extends StreamingSerivce {
        isValidUrl(url) {
            return function(url) {
                return url.hostname.includes(".netflix.") && url.pathname.includes("/watch");
            }(url);
        }
        getVideoId(url) {
            const match = url.pathname.match(/^.*\/([0-9]+)\??.*/);
            return match && match.length > 0 ? match[1] : void 0;
        }
        getFullscreenScript() {
            return '\n            (function() {\n                var sizingWrapper = document.getElementsByClassName("sizing-wrapper")[0];\n                    if (sizingWrapper) {\n                        sizingWrapper.requestFullscreen = function() {}\n                        document.getElementsByClassName(\'button-nfplayerFullscreen\')[0].onclick = function() {\n                            var fullScreenWrapper = document.getElementsByClassName("nf-kb-nav-wrapper")[0];\n                            fullScreenWrapper.webkitRequestFullScreen(fullScreenWrapper.ALLOW_KEYBOARD_INPUT);\n                        }\n                    }\n            })();\n        ';
        }
    }([], [ "content_scripts/netflix/netflix_content_bundled.js" ], "netflix", StreamingServiceName.NETFLIX, !1);
    Object.freeze(Netflix);
    const Services_Netflix = Netflix;
    const Hulu = new class extends StreamingSerivce {
        isValidUrl(url) {
            return function(url) {
                return url.hostname.includes(".hulu.") && url.pathname.includes("/watch");
            }(url);
        }
        getVideoId(url) {
            const match = url.pathname.match(/^.*\/([a-z\-0-9]+)\??.*/);
            return match && match.length > 0 ? match[1] : void 0;
        }
    }([], [ "content_scripts/hulu/hulu_content_bundled.js" ], "hulu", StreamingServiceName.HULU, !1);
    Object.freeze(Hulu);
    const Services_Hulu = Hulu;
    const DisneyPlus = new class extends StreamingSerivce {
        isValidUrl(url) {
            return function(url) {
                return url.hostname.includes(".disneyplus.") && url.pathname.includes("/video");
            }(url);
        }
        getVideoId(url) {
            const match = url.pathname.match(/^.*\/([a-z\-0-9]+)\??.*/);
            return match && match.length > 0 ? match[1] : void 0;
        }
    }([], [ "content_scripts/disney/disney_content_bundled.js" ], "disney", StreamingServiceName.DISNEY_PLUS, !1);
    Object.freeze(DisneyPlus);
    const Disney = DisneyPlus;
    const HboMax = new class extends StreamingSerivce {
        isValidUrl(url) {
            return function(url) {
                return url.hostname.includes(".hbomax.") && "none" !== getHBOVideoType(url.pathname) || url.pathname.includes("urn:hbo:page");
            }(url);
        }
        getVideoId(url) {
            const videoUrnType = "urn:hbo:" + getHBOVideoType(url.pathname) + ":", hboQueryString = url.pathname.split(videoUrnType);
            let hboParseIds = null != hboQueryString && hboQueryString.length > 1 && null != hboQueryString[1] ? hboQueryString[1].match(/^([a-zA-Z\-_0-9]+)\??.*/) : null;
            const hboMatch = null != hboParseIds && 0 !== hboParseIds.length ? hboQueryString[1].match(/^([a-zA-Z\-_0-9]+)\??.*/) : void 0;
            let hboVideoId = hboMatch && hboMatch.length > 0 ? hboMatch[1] : void 0;
            return hboVideoId || (hboParseIds = url.pathname.match(/(page:)([a-zA-Z\-_0-9]+)\??.*/), 
            hboVideoId = null != hboParseIds && 3 == hboParseIds.length ? hboParseIds[2] : void 0), 
            hboVideoId;
        }
        getVideoType(url) {
            return getHBOVideoType(url.pathname);
        }
    }([], [ "content_scripts/hbo_max/hbo_max_content_bundled.js" ], "hbomax", StreamingServiceName.HBO_MAX, !1);
    Object.freeze(HboMax);
    const Services_HboMax = HboMax;
    const Amazon = new class extends StreamingSerivce {
        isValidUrl(url) {
            return function(url) {
                return url.hostname.includes(".amazon.") || url.hostname.includes(".primevideo.");
            }(url);
        }
        getVideoId(url) {
            const match = url.pathname.split("ref")[0].match(/^.*\/([a-z\-0-9.A-Z]+)(\?|\/ref)?.*/);
            return null != match && match.length > 0 ? match[1] : void 0;
        }
    }([], [ "content_scripts/amazon/amazon_content_bundled.js" ], "amazon", StreamingServiceName.AMAZON, !1);
    Object.freeze(Amazon);
    const Services_Amazon = Amazon;
    const Youtube = new class extends StreamingSerivce {
        isValidUrl(url) {
            return function(url) {
                return url.hostname.includes(".youtube.");
            }(url);
        }
        getVideoId(url) {
            if (url.href.includes("watch?") || url.href.includes("/shorts/")) {
                const match = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm.exec(url.href);
                return null != match && match.length > 3 && match[3] ? match[3] : void 0;
            }
            return "browsing";
        }
    }([], [ "content_scripts/youtube/youtube_content_bundled.js" ], "youtube", StreamingServiceName.YOUTUBE, !1);
    Object.freeze(Youtube);
    const Services_Youtube = Youtube;
    class ExtensionTab {
        constructor(url, id) {
            var _a;
            this.id = id, this.videoId, this.url = url;
            const validServices = [ Services_Netflix, Services_Hulu, Disney, Services_HboMax, Services_Amazon, Services_Youtube ];
            for (const service of validServices) if (service.isValidUrl(this.url)) {
                this.streamingService = service, this.serviceName = service.name, this.videoId = service.getVideoId(url);
                break;
            }
            this.sessionIdFromUrl = null !== (_a = getURLParameter(this.url.href, "npSessionId", 1)) && void 0 !== _a ? _a : void 0;
        }
        urlWithSessionId(sessionId) {
            return this.streamingService ? this.streamingService.urlWithSessionId(sessionId) : void 0;
        }
    }
    var PopupMessageType;
    !function(PopupMessageType) {
        PopupMessageType.CREATE_SESSION = "createSession", PopupMessageType.RE_INJECT = "reInject", 
        PopupMessageType.GET_INIT_DATA = "getInitData", PopupMessageType.IS_CONTENT_SCRIPT_READY = "isContentScriptReady", 
        PopupMessageType.SET_CHAT_VISIBLE = "setChatVisible", PopupMessageType.DISCONNECT = "teardown", 
        PopupMessageType.CLOSE_POPUP = "closePopup";
    }(PopupMessageType || (PopupMessageType = {}));
    class Message {
        constructor(sender, target, type) {
            this.sender = sender, this.target = target, this.type = type;
        }
    }
    class PopupMessage extends Message {
        constructor(sender, target, type) {
            super(sender, target, type), this.type = type;
        }
    }
    class CreateSessionMessage extends PopupMessage {
        constructor(sender, target, data) {
            super(sender, target, PopupMessageType.CREATE_SESSION), this.data = data;
        }
    }
    var debug = console.log.bind(window.console);
    const Messaging_MessagePasser = new class {
        addListener(listener) {
            chrome.runtime.onMessage.addListener(listener);
        }
        removeListener(listener) {
            chrome.runtime.onMessage.removeListener(listener);
        }
        sendMessageToTabAsync(message, tabId, timeout = 2e4) {
            return new Promise(((resolve, reject) => {
                const sendTimeout = setTimeout((() => {
                    reject();
                }), timeout);
                try {
                    chrome.tabs.sendMessage(tabId, message, (response => {
                        chrome.runtime.lastError && debug(chrome.runtime.lastError.message + JSON.stringify(message)), 
                        clearTimeout(sendTimeout), resolve(response);
                    }));
                } catch (error) {
                    clearTimeout(sendTimeout), reject(error);
                }
            }));
        }
        sendMessageToExtension(message, timeout) {
            return new Promise(((resolve, reject) => {
                let sendTimeout = null;
                timeout && (sendTimeout = setTimeout((() => {
                    reject({
                        error: "Send Message Timeout"
                    });
                }), timeout));
                try {
                    chrome.runtime.sendMessage(EXTENSION_ID, message, (response => {
                        chrome.runtime.lastError && console.log(chrome.runtime.lastError.message + JSON.stringify(message)), 
                        sendTimeout && clearTimeout(sendTimeout), resolve(response);
                    }));
                } catch (error) {
                    sendTimeout && clearTimeout(sendTimeout), reject(error);
                }
            }));
        }
    };
    class GetInitDataMessage extends PopupMessage {
        constructor(sender, target) {
            super(sender, target, PopupMessageType.GET_INIT_DATA);
        }
    }
    class IsContentScriptReadyMessage extends PopupMessage {
        constructor(sender, target) {
            super(sender, target, PopupMessageType.IS_CONTENT_SCRIPT_READY);
        }
    }
    class SetChatVisibleMessage extends PopupMessage {
        constructor(sender, target, data) {
            super(sender, target, PopupMessageType.SET_CHAT_VISIBLE), this.data = data;
        }
    }
    class BackgroundMessage extends Message {
        constructor(sender, target, type) {
            super(sender, target, type), this.type = type;
        }
    }
    var BackgroundMessageType;
    !function(BackgroundMessageType) {
        BackgroundMessageType.JOIN_SESSION = "joinSession", BackgroundMessageType.GET_VIDEO_DATA = "getVideoData", 
        BackgroundMessageType.LOAD_SESSION = "loadSession", BackgroundMessageType.NO_SESSION_DATA = "noSessionData", 
        BackgroundMessageType.TEARDOWN = "teardown", BackgroundMessageType.ON_VIDEO_UPDATE = "onVideoUpdate", 
        BackgroundMessageType.SOCKET_LOST_CONNECTION = "socketLostConnection", BackgroundMessageType.REBOOT = "socketReconnect", 
        BackgroundMessageType.LOG_EVENT = "logEvent", BackgroundMessageType.LOG_EXPERIMENT = "logExpirement", 
        BackgroundMessageType.STAY_ALIVE = "stayAlive", BackgroundMessageType.LOAD_CHAT_WINDOW = "loadChatWindow", 
        BackgroundMessageType.RESET_CHAT_WINDOW = "resetChatWindow", BackgroundMessageType.HIDE_CHAT_WINDOW = "hideChatWindow";
    }(BackgroundMessageType || (BackgroundMessageType = {}));
    class LogEventMessage extends BackgroundMessage {
        constructor(sender, target, data) {
            super(sender, target, BackgroundMessageType.LOG_EVENT), this.data = data, this.sender = sender, 
            this.target = target;
        }
    }
    class PopupDisconnectMessage extends PopupMessage {
        constructor(sender, target) {
            super(sender, target, PopupMessageType.DISCONNECT);
        }
    }
    const Permissions_namespaceObject = JSON.parse('{"dE":["tabs"],"$6":["*://*/*"]}');
    class LogExperimentMessage extends BackgroundMessage {
        constructor(sender, target, data) {
            super(sender, target, BackgroundMessageType.LOG_EXPERIMENT), this.data = data;
        }
    }
    var __awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))((function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                var value;
                result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                    resolve(value);
                }))).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
    };
    const ChromeStorageWriter = new class {
        setItemsAsync(items) {
            return __awaiter(this, void 0, void 0, (function*() {
                return new Promise(((resolve, reject) => {
                    chrome.storage.local.set(items, (() => {
                        chrome.runtime.lastError ? reject(new Error("Failed to write to chrome storage. Please refresh the page and try again")) : resolve();
                    }));
                }));
            }));
        }
    };
    Object.freeze(ChromeStorageWriter);
    const ChromeStorage_ChromeStorageWriter = ChromeStorageWriter;
    var ChromeStorageReader_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))((function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                var value;
                result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                    resolve(value);
                }))).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
    };
    const ChromeStorageReader = new class {
        getItemsAsync(items) {
            return ChromeStorageReader_awaiter(this, void 0, void 0, (function*() {
                return new Promise(((resolve, reject) => {
                    chrome.storage.local.get(items, (result => {
                        chrome.runtime.lastError ? reject(new Error(ChromeStorageReadError)) : resolve(result);
                    }));
                }));
            }));
        }
        getAllItemsAsync() {
            return ChromeStorageReader_awaiter(this, void 0, void 0, (function*() {
                return new Promise(((resolve, reject) => {
                    chrome.storage.local.get(null, (result => {
                        chrome.runtime.lastError ? reject(new Error(ChromeStorageReadError)) : resolve(result);
                    }));
                }));
            }));
        }
    };
    Object.freeze(ChromeStorageReader);
    const ChromeStorage_ChromeStorageReader = ChromeStorageReader;
    var Popup_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))((function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                var value;
                result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                    resolve(value);
                }))).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
    };
    const _gaq = [];
    let permId;
    _gaq.push([ "_setAccount", "UA-71812070-2" ]), _gaq.push([ "_trackPageview" ]), 
    function() {
        var _a;
        const ga = document.createElement("script");
        ga.type = "text/javascript", ga.async = !0, ga.src = "https://ssl.google-analytics.com/ga.js";
        const s = document.getElementsByTagName("script")[0];
        null === (_a = s.parentNode) || void 0 === _a || _a.insertBefore(ga, s);
    }(), console.log("Popup Loaded"), function() {
        const logEventMessage = new LogEventMessage("Popup", "Service_Background", {
            name: "user_click",
            component: {
                name: "popup_open",
                type: "button",
                origin: "tp"
            }
        });
        Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
        const oldLogEventMessage = new LogEventMessage("Popup", "Service_Background", {
            eventType: "popup-open-chrome"
        });
        Messaging_MessagePasser.sendMessageToExtension(oldLogEventMessage);
    }(), chrome.runtime.onUpdateAvailable.addListener((function(details) {
        _gaq.push([ "_trackEvent", "auto-update ->" + details.version, "clicked" ]), chrome.runtime.reload();
    })), chrome.storage.local.get([ "userId" ], (function(data) {
        data.userId && (permId = data.userId);
    }));
    const $ = jQuery;
    function showError(errorMessage, showButton = !0) {
        const logEventMessage = new LogEventMessage("Popup", "Service_Background", {
            name: "error",
            action: {
                reason: errorMessage,
                description: "An error has occured"
            }
        });
        Messaging_MessagePasser.sendMessageToExtension(logEventMessage), $(".some-error").removeClass("hidden"), 
        $(".no-error").addClass("hidden"), $("#error-msg").html(errorMessage), showButton ? $("#close-error").removeClass("hidden") : $("#close-error").addClass("hidden");
    }
    function startSpinning() {
        $("#control-lock").prop("disabled", !0), $("#create-session").prop("disabled", !0), 
        $("#leave-session").prop("disabled", !0), $("#create-session").html('Loading <span class="ellipsis-anim"><span>.</span><span>.</span><span>.</span></span>');
    }
    function stopSpinning() {
        $("#control-lock").prop("disabled", !1), $("#create-session").prop("disabled", !1), 
        $("#leave-session").prop("disabled", !1), $("#create-session").text("Start the party");
    }
    $((function() {
        startSpinning(), function() {
            return Popup_awaiter(this, void 0, void 0, (function*() {
                return new Promise(((resolve, reject) => {
                    chrome.tabs.query({
                        active: !0,
                        currentWindow: !0
                    }, (function(tabs) {
                        if (tabs.length > 0) {
                            const activeTab = tabs[0];
                            if (activeTab.id && activeTab.url) return void resolve({
                                id: activeTab.id,
                                url: activeTab.url
                            });
                        }
                        reject();
                    }));
                }));
            }));
        }().then((activeTab => {
            let extensionTab;
            if (debug("Setting up popup event listeners"), $("#create-session").click(createSessionAsync), 
            $("#close-error").click(closeErrorClicked), $("#reviewLink").click(reviewLinkClicked), 
            $("#learn-more").click(learnMore), $("#learn-more-teleparty").click(learnMoreTeleparty), 
            $("#leave-session").click(leaveSessionAsync), $("#show-chat").change(showChat), 
            $("#share-url").click(onShareUrlClicked), $("#copy-btn").click(onCopybuttonClicked), 
            $("#service-netflix").on("click", onServiceClicked(StreamingServiceName.NETFLIX)), 
            $("#service-hulu").on("click", onServiceClicked(StreamingServiceName.HULU)), $("#service-amazon").on("click", onServiceClicked(StreamingServiceName.AMAZON)), 
            $("#service-hbomax").on("click", onServiceClicked(StreamingServiceName.HBO_MAX)), 
            $("#service-disney").on("click", onServiceClicked(StreamingServiceName.DISNEY_PLUS)), 
            $("#service-youtube").on("click", onServiceClicked(StreamingServiceName.YOUTUBE)), 
            !activeTab.url || !activeTab.id) return $(".wrongSite").removeClass("hidden"), void $(".disconnected").addClass("hidden");
            {
                const url = new URL(activeTab.url);
                if (extensionTab = new ExtensionTab(url, activeTab.id), !extensionTab.serviceName) return !function(url) {
                    return UNSUPPORTED_SITES.some((str => url.hostname.includes(str)));
                }(url) ? !function(url) {
                    return SERVICE_SITES.some((str => url.hostname.includes(str)));
                }(url) ? $(".wrongSite").removeClass("hidden") : $(".serviceSite").removeClass("hidden") : $(".unsupportedSite").removeClass("hidden"), 
                void $(".disconnected").addClass("hidden");
                $(".permissions").addClass("hidden"), Messaging_MessagePasser.addListener((function(message, _sender, sendResponse) {
                    "Service_Background" == message.sender && "Popup" == message.target && message.type == PopupMessageType.CLOSE_POPUP && (sendResponse(), 
                    window.close());
                    return !1;
                })), function() {
                    return Popup_awaiter(this, void 0, void 0, (function*() {
                        if (extensionTab.streamingService) {
                            const streamingService = extensionTab.streamingService;
                            yield new Promise((resolve => {
                                chrome.tabs.executeScript(extensionTab.id, {
                                    file: "lib/tp_libraries_min.js"
                                }, resolve);
                            })), yield Promise.all(streamingService.contentScripts.map((script => new Promise((resolve => {
                                chrome.tabs.executeScript(extensionTab.id, {
                                    file: script
                                }, (() => {
                                    resolve();
                                }));
                            }))))), console.log("Content Scripts ready");
                        }
                    }));
                }().then((function() {
                    return Popup_awaiter(this, void 0, void 0, (function*() {
                        const isContentScriptReadyMessage = new IsContentScriptReadyMessage("Popup", "Content_Script"), response = yield Messaging_MessagePasser.sendMessageToTabAsync(isContentScriptReadyMessage, extensionTab.id);
                        response ? response.error ? (showError(response.error.message, response.error.showButton), 
                        stopSpinning()) : (stopSpinning(), function() {
                            var _a;
                            Popup_awaiter(this, void 0, void 0, (function*() {
                                startSpinning();
                                const getInitDataMessage = new GetInitDataMessage("Popup", "Content_Script"), response = yield Messaging_MessagePasser.sendMessageToTabAsync(getInitDataMessage, extensionTab.id);
                                response.inSession && response.partyUrl && (showConnected(response.partyUrl), $(".popup-showchat-container").show(), 
                                $("#show-chat").prop("checked", null !== (_a = response.isChatVisible) && void 0 !== _a && _a), 
                                response.showReviewMessage), stopSpinning();
                            }));
                        }(), debug("Content Script Ready")) : (showError(GenericErrorMessage, !1), stopSpinning());
                    }));
                }));
            }
            function handleResponseError(response) {
                response && response.error ? showError(response.error, !1) : showError(GenericErrorMessage, !1);
            }
            function showConnected(partyUrl) {
                $(".disconnected").addClass("hidden"), $(".connected").removeClass("hidden"), $("#show-chat").prop("checked", !0), 
                $("#share-url").val(partyUrl).focus().select();
            }
            function onServiceClicked(service) {
                return () => {
                    const logEventMessage = new LogEventMessage("Popup", "Service_Background", {
                        name: "user_click",
                        action: {
                            description: `popup_service-btn_${service}`
                        }
                    });
                    switch (Messaging_MessagePasser.sendMessageToExtension(logEventMessage), service) {
                      case StreamingServiceName.NETFLIX:
                        window.open("https://netflix.com");
                        break;

                      case StreamingServiceName.DISNEY_PLUS:
                        window.open("https://disneyplus.com");
                        break;

                      case StreamingServiceName.AMAZON:
                        window.open("https://www.amazon.com/Prime-Video/b?node=2676882011");
                        break;

                      case StreamingServiceName.HBO_MAX:
                        window.open("https://hbomax.com");
                        break;

                      case StreamingServiceName.HULU:
                        window.open("https://hulu.com");
                        break;

                      case StreamingServiceName.YOUTUBE:
                        window.open("https://www.youtube.com");
                    }
                };
            }
            function checkPermissions() {
                return Popup_awaiter(this, void 0, void 0, (function*() {
                    const lastRequest = (yield ChromeStorage_ChromeStorageReader.getItemsAsync([ "popupPermissionsRequestedDate" ])).popupPermissionsRequestedDate;
                    if (lastRequest) try {
                        if (function(testDate) {
                            const todaysDate = new Date;
                            return todaysDate.setHours(0, 0, 0, 0), Math.abs(Number(todaysDate) - Number(testDate)) <= 3024e5;
                        }(new Date(lastRequest))) return void sendCreateSession();
                    } catch (error) {}
                    return ChromeStorage_ChromeStorageWriter.setItemsAsync({
                        popupPermissionsRequestedDate: (new Date).toString()
                    }), new Promise((resolve => {
                        chrome.permissions.contains({
                            origins: Permissions_namespaceObject.$6,
                            permissions: Permissions_namespaceObject.dE
                        }, (hasPermissions => {
                            if (hasPermissions) sendCreateSession(), resolve(!0); else {
                                $(".disconnected").addClass("hidden"), $(".permissions").removeClass("hidden");
                                let loadingPermissions = !1;
                                $("#accept-permissions").click((() => {
                                    loadingPermissions || (loadingPermissions = !0, chrome.permissions.request({
                                        origins: Permissions_namespaceObject.$6,
                                        permissions: Permissions_namespaceObject.dE
                                    }, (granted => Popup_awaiter(this, void 0, void 0, (function*() {
                                        const logPrompt = new LogExperimentMessage("Popup", "Service_Background", {
                                            experimentName: "permissions_request",
                                            experimentVersion: "all_sites-popup-chrome",
                                            eventType: "permissions-prompted"
                                        });
                                        Messaging_MessagePasser.sendMessageToExtension(logPrompt);
                                        const logExperimentMessage = new LogExperimentMessage("Popup", "Service_Background", {
                                            experimentName: "permissions_request",
                                            experimentVersion: "all_sites-popup-chrome",
                                            eventType: granted ? "permissions-granted" : "permissions-denied"
                                        });
                                        Messaging_MessagePasser.sendMessageToExtension(logExperimentMessage, 2500), $(".permissions").addClass("hidden"), 
                                        $(".disconnected").removeClass("hidden"), yield sendCreateSession(), resolve(granted);
                                    })))));
                                }));
                            }
                        }));
                    }));
                }));
            }
            function sendCreateSession() {
                return Popup_awaiter(this, void 0, void 0, (function*() {
                    debug("Sending create session");
                    const createSessionMessage = new CreateSessionMessage("Popup", "Service_Background", {
                        createSettings: {
                            controlLock: $("#control-lock").is(":checked")
                        },
                        extensionTabData: extensionTab
                    });
                    try {
                        const response = yield Messaging_MessagePasser.sendMessageToExtension(createSessionMessage);
                        if (response && response.sessionId) {
                            const sessionId = response.sessionId, partyUrl = function(sessionId) {
                                return `https://redirect.teleparty.com/join/${sessionId}`;
                            }(sessionId);
                            showConnected(partyUrl), function(sessionId) {
                                var _a;
                                _gaq.push([ "_trackEvent", "create-session", "clicked", extensionTab.serviceName ]), 
                                function(eventType, sessionId, serviceName) {
                                    try {
                                        if (permId) {
                                            const data = {
                                                userId: permId,
                                                eventType,
                                                sessionId,
                                                serviceName
                                            };
                                            console.log("event: " + JSON.stringify(data));
                                            const xmlhttp = new XMLHttpRequest;
                                            xmlhttp.open("POST", "https://data.netflixparty.com/log-event"), xmlhttp.setRequestHeader("Content-Type", "application/json"), 
                                            xmlhttp.send(JSON.stringify(data));
                                        }
                                    } catch (e) {
                                        console.log("log event error");
                                    }
                                }("create-session", sessionId, null !== (_a = extensionTab.serviceName) && void 0 !== _a ? _a : "");
                            }(sessionId);
                        } else handleResponseError(response);
                        stopSpinning();
                    } catch (error) {
                        stopSpinning(), handleResponseError(error);
                    }
                }));
            }
            function createSessionAsync() {
                return Popup_awaiter(this, void 0, void 0, (function*() {
                    !function() {
                        const logEventMessage = new LogEventMessage("Popup", "Service_Background", {
                            name: "user_click",
                            component: {
                                name: "popup-create_session",
                                type: "button",
                                origin: "tp"
                            }
                        });
                        Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                        const oldLogEventMessage = new LogEventMessage("Popup", "Service_Background", {
                            eventType: "create-session-clickedchrome"
                        });
                        Messaging_MessagePasser.sendMessageToExtension(oldLogEventMessage);
                    }(), startSpinning(), yield checkPermissions();
                }));
            }
            function closeErrorClicked() {
                $(".no-error").removeClass("hidden"), $(".some-error").addClass("hidden");
            }
            function reviewLinkClicked() {
                window.open("https://chrome.google.com/webstore/detail/netflix-party-is-now-tele/oocalimimngaihdkbihfgmpkcpnmlaoa/reviews"), 
                chrome.storage.local.set({
                    reviewClicked: !0
                });
                const logEventMessage = new LogEventMessage("Popup", "Service_Background", {
                    name: "review-clicked",
                    action: {
                        description: "review link was clicked"
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                const oldLogEventMessage = new LogEventMessage("Popup", "Service_Background", {
                    eventType: "review-clicked-chrome"
                });
                Messaging_MessagePasser.sendMessageToExtension(oldLogEventMessage);
            }
            function onCopybuttonClicked(e) {
                console.log("click");
                const sessionIdFromShareUrl = getURLParameter($("#share-url").val(), "npSessionId", 1);
                sessionIdFromShareUrl && showConnected(sessionIdFromShareUrl), e.stopPropagation(), 
                e.preventDefault(), $("#share-url").select(), document.execCommand("copy"), $("#copy-btn").parent().css("background", "#24D154"), 
                $("#copy-btn").text("Copied!");
            }
            function onShareUrlClicked(e) {
                e.stopPropagation(), e.preventDefault(), $("#share-url").select();
            }
            function learnMore() {
                chrome.tabs.create({
                    url: "https://www.netflixparty.com/support"
                });
            }
            function learnMoreTeleparty() {
                chrome.tabs.create({
                    url: "https://www.netflixparty.com/introducing-teleparty"
                });
            }
            function leaveSessionAsync() {
                return Popup_awaiter(this, void 0, void 0, (function*() {
                    const logEventMessage = new LogEventMessage("Popup", "Service_Background", {
                        name: "user_click",
                        component: {
                            name: "popup-disconnect_session",
                            type: "button",
                            origin: "tp"
                        }
                    });
                    Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                    const disconnectMessage = new PopupDisconnectMessage("Popup", "Content_Script");
                    yield Messaging_MessagePasser.sendMessageToTabAsync(disconnectMessage, extensionTab.id), 
                    window.close();
                }));
            }
            function showChat() {
                const visibleData = {
                    visible: $("#show-chat").is(":checked")
                }, setVisibleMessage = new SetChatVisibleMessage("Popup", "Content_Script", visibleData);
                Messaging_MessagePasser.sendMessageToTabAsync(setVisibleMessage, extensionTab.id);
            }
            $("#reviewLink").attr("href", "https://chrome.google.com/webstore/detail/netflix-party-is-now-tele/oocalimimngaihdkbihfgmpkcpnmlaoa/reviews");
        })).catch((error => {
            console.log(error);
        }));
    }));
})();