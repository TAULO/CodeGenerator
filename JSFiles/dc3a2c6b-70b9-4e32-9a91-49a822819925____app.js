var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ExtensionApp;
(function (ExtensionApp) {
    var Services;
    (function (Services) {
        /**
         * Chrome service class.
         */
        var ChromeService = (function () {
            /**
             * Constructor for the chrome service.
             * @param $rootScope Scope
             * @param chrome Chrome runtime
             */
            function ChromeService($rootScope, chrome) {
                this.$rootScope = $rootScope;
                this.chrome = chrome;
                /** Events array */
                this.events = [];
                /** Current frame */
                this.frameUrls = [];
                this.isInitialized = false;
            }
            /**
             * Clear all.
             */
            ChromeService.prototype.ClearAll = function () {
                this.testingTabId = undefined;
                this.isInitialized = false;
                this.events = [];
                this.chrome.runtime.onMessage.removeListener(this.EventListener);
            };
            /**
             * Ensure that we're only looking to the same tab
             * and registering events from that tab
             */
            ChromeService.prototype.Initialize = function (tabId) {
                this.testingTabId = tabId;
                this.isInitialized = true;
            };
            /** Initialize the event listeners. */
            ChromeService.prototype.InitializeEventListeners = function () {
                var CS = this;
                var RS = this.$rootScope;
                this.EventListener = function (msg, sender, response) {
                    /** If the sender is content script and the tab is the one that we're tracking */
                    if (msg.from === 'content' && sender.tab.id === CS.testingTabId) {
                        if (msg.subject) {
                            /** Page load */
                            if (msg.subject === 'load') {
                                var tabUrl = sender.tab.url;
                                if (tabUrl === msg.info.url) {
                                    CS.AddLoadEvent({ url: msg.info.url });
                                }
                                else {
                                    CS.AddPartialLoadEvent({ url: msg.info.url });
                                }
                            }
                            else if (msg.subject === 'click') {
                                if (CS.frameUrls.length != 0) {
                                    /** Comes from an internal frame that we haven't registered. Should be the deepest level. */
                                    var index = CS.frameUrls.map(function (obj) { return obj.key; }).indexOf(CS.ExtractDomain(msg.info.url));
                                    if (index == -1) {
                                        var currentFrame = CS.frameUrls[CS.frameUrls.length - 1].value;
                                        if (CS.currentFrame !== currentFrame) {
                                            CS.currentFrame = currentFrame;
                                            CS.AddIFrameSub({ id: CS.currentFrame });
                                        }
                                    }
                                    else if (index > 0) {
                                        var currentFrame = CS.frameUrls[index - 1].value;
                                        if (CS.currentFrame !== currentFrame) {
                                            CS.currentFrame = currentFrame;
                                            CS.AddIFrameSub({ id: CS.currentFrame });
                                        }
                                    }
                                }
                                CS.AddClickEvent(msg.info);
                            }
                            else if (msg.subject === 'text') {
                                CS.AddKeyEvent(msg.info);
                            }
                            else if (msg.subject === 'enter') {
                                CS.AddEnterEvent(msg.info);
                            }
                            else if (msg.subject === 'iframesubload') {
                                CS.currentFrame = msg.info.id;
                                CS.frameUrls.push({ key: CS.ExtractDomain(msg.info.url), value: msg.info.id });
                                CS.AddIFrameSub({ id: msg.info.id, url: msg.info.url });
                            }
                        }
                    }
                    else if (msg.from === 'background') {
                        /** Ensure event */
                        if (msg.subject === 'ensure') {
                            CS.AddEnsureEvent({ id: msg.info.id, path: msg.info.path });
                        }
                        /**  */
                        if (msg.subject) {
                            if (msg.subject === 'UrlChange') {
                            }
                        }
                    }
                    RS.$apply();
                };
                this.chrome.runtime.onMessage.addListener(this.EventListener);
            };
            /** Add event */
            ChromeService.prototype.AddEvent = function (event) {
                this.events.push(event);
            };
            /** Add IFrame subload event */
            ChromeService.prototype.AddIFrameSub = function (event) {
                this.events.push({ id: event.id, type: 'iframesubload', url: event.url });
            };
            /** Add partial load event */
            ChromeService.prototype.AddPartialLoadEvent = function (event) {
                var partials = this.events[this.lastLoadEventIndex].partials;
                if (!partials) {
                    this.events[this.lastLoadEventIndex].partials = [];
                }
                this.events[this.lastLoadEventIndex].partials.push({ url: event.url });
            };
            /** Add load event */
            ChromeService.prototype.AddLoadEvent = function (event) {
                this.events.push({ url: event.url, type: 'load' });
                // last index
                this.lastLoadEventIndex = this.events.length - 1;
            };
            /** Add click event */
            ChromeService.prototype.AddClickEvent = function (event) {
                this.events.push({ id: event.id, path: event.path, type: 'click' });
            };
            /** Add ensure event */
            ChromeService.prototype.AddEnsureEvent = function (event) {
                this.events.push({ id: event.id, path: event.path, type: 'ensure', testtype: 'ensure' });
            };
            /** Add key event */
            ChromeService.prototype.AddKeyEvent = function (event) {
                if (this.events[this.events.length - 1].id == event.id) {
                    this.events.pop();
                }
                this.events.push({ id: event.id, text: event.text, path: event.path, className: event.className, type: 'key' });
            };
            /** Add Enter key event. */
            ChromeService.prototype.AddEnterEvent = function (event) {
                this.events.push({ id: event.id, path: event.path, type: 'enter' });
            };
            /** Remove event */
            ChromeService.prototype.RemoveEvent = function (index) {
                if (index === 0 || this.events.length === 0) {
                    return;
                }
                this.events.splice(index, 1);
            };
            ChromeService.prototype.ExtractDomain = function (url) {
                var domain;
                //find & remove protocol (http, ftp, etc.) and get domain
                if (url.indexOf("://") > -1) {
                    domain = url.split('/')[2];
                }
                else {
                    domain = url.split('/')[0];
                }
                //find & remove port number
                domain = domain.split(':')[0];
                return domain;
            };
            /** Dependency injection. */
            ChromeService.$inject = ['$rootScope', 'chrome'];
            return ChromeService;
        }());
        Services.ChromeService = ChromeService;
    })(Services = ExtensionApp.Services || (ExtensionApp.Services = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Services;
    (function (Services) {
        /** Template service */
        var TemplateService = (function () {
            /**
             * Constructor
             * @param chrome extension access
             * @param ChromeService chrome service
             */
            function TemplateService(chrome, ChromeService) {
                this.chrome = chrome;
                this.ChromeService = ChromeService;
            }
            /** Get file template */
            TemplateService.prototype.GetFileTemplate = function () {
                var fileTemplateUrl = chrome.extension.getURL('templates/file.js.template');
                return this.readTextFile(fileTemplateUrl);
            };
            /** Get test template */
            TemplateService.prototype.GetTestTemplate = function () {
                var fileTemplateUrl = chrome.extension.getURL('templates/test.js.template');
                return this.readTextFile(fileTemplateUrl);
            };
            /** Compose file */
            TemplateService.prototype.ComposeFile = function (testName) {
                var fileTemplate = this.GetFileTemplate();
                /** File template replacement tags */
                var globalDefsPlaceholder = "%GLOBALDEFINITIONS%";
                fileTemplate = fileTemplate.replace(globalDefsPlaceholder, this.ComposeGlobalDefinitions().join("\n")) + "";
                var testNameReplace = '%NAME%';
                fileTemplate = fileTemplate.replace(testNameReplace, testName) + "";
                var testSettings = "%TESTSETTINGS%";
                fileTemplate = fileTemplate.replace(testSettings, this.ComposeTestsSettings().join("\n    "));
                var testTemplate = '%TESTTEMPLATE%';
                fileTemplate = fileTemplate.replace(testTemplate, this.ComposeTests()) + "";
                return fileTemplate;
            };
            TemplateService.prototype.ComposeGlobalDefinitions = function () {
                return [];
            };
            TemplateService.prototype.ComposeTestsSettings = function () {
                return [];
            };
            /** Compose the tests */
            TemplateService.prototype.ComposeTests = function () {
                var testTemplate = this.GetTestTemplate();
                /** Test template replacement tags */
                var test = '%TEST%';
                var internalTests = this.ComposeSteps().join("\n        ");
                testTemplate = testTemplate.replace(test, internalTests);
                return testTemplate;
            };
            /** Compose the steps */
            TemplateService.prototype.ComposeSteps = function () {
                var _this = this;
                var tests = [];
                var currentIndent = 1;
                this.ChromeService.events.forEach(function (value, index) {
                    /*if (currentIndent != value.indent)
                     {
    
                     }*/
                    if (value.testtype === 'test' && value.type === 'load') {
                        // Verify if the url is changing.
                        tests.push(_this.AddUrlChangeTest(value.url));
                    }
                    else if (value.type === 'load') {
                        // Replace with proper browser.get condition adding.
                        tests.push(_this.AddBrowserGetStep(value.url));
                    }
                    else if (value.type === 'click') {
                        // Click step registry
                        tests.push(_this.AddClickStep(value.id, value.path));
                    }
                    else if (value.type === 'key') {
                        // Key step registry
                        tests.push(_this.AddTypeInStep(value.id, value.path, value.text));
                    }
                    else if (value.type === 'enter') {
                        // Enter step registry
                        tests.push(_this.AddEnterStep(value.id));
                    }
                    else if (value.type === 'ensure') {
                        // Add ensure test
                        tests.push(_this.AddEnsureTest(value.id, value.path));
                    }
                    else if (value.type === 'iframesubload') {
                        // Switch context to iframe
                        tests.push(_this.SwitchToIFrameContext(value.id));
                    }
                });
                return tests;
            };
            /** Format string */
            TemplateService.prototype.formatString = function (format) {
                var params = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    params[_i - 1] = arguments[_i];
                }
                var args = Array.prototype.slice.call(arguments, 1);
                return format.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] != 'undefined'
                        ? args[number]
                        : match;
                });
            };
            ;
            /** Read file */
            TemplateService.prototype.readTextFile = function (file) {
                var rawFile = new XMLHttpRequest();
                var allText = undefined;
                rawFile.open("GET", file, false);
                rawFile.onreadystatechange = function () {
                    if (rawFile.readyState === 4) {
                        if (rawFile.status === 200 || rawFile.status == 0) {
                            allText = rawFile.responseText;
                        }
                    }
                };
                rawFile.send(null);
                return allText;
            };
            /** Dependency injection */
            TemplateService.$inject = ['chrome', 'ChromeService'];
            return TemplateService;
        }());
        Services.TemplateService = TemplateService;
        var ProtractorTemplateService = (function (_super) {
            __extends(ProtractorTemplateService, _super);
            function ProtractorTemplateService() {
                _super.apply(this, arguments);
            }
            ProtractorTemplateService.prototype.ComposeGlobalDefinitions = function () {
                return [
                    "var urlChanged = function (url) {",
                    "    return function () {",
                    "        return browser.getCurrentUrl().then(function (actualUrl) {",
                    "            return url != actualUrl;",
                    "        });",
                    "    };",
                    "};"
                ];
            };
            ProtractorTemplateService.prototype.ComposeTestsSettings = function () {
                return ["browser.ignoreSynchronization = true;"];
            };
            /** Browser get step */
            ProtractorTemplateService.prototype.AddBrowserGetStep = function (url) {
                /** Get url template */
                return this.formatString("browser.get('{0}');", url);
            };
            /** Click step */
            ProtractorTemplateService.prototype.AddClickStep = function (id, path) {
                if (id && id.length > 0) {
                    return this.formatString("element(by.id('{0}')).click();", id);
                }
                else if (path && path.length > 0) {
                    return this.formatString("element(by.css('{0}')).click();", path);
                }
            };
            /** Add enter step */
            ProtractorTemplateService.prototype.AddEnterStep = function (id) {
                if (id && id.length > 0) {
                    return this.formatString("element(by.id('{0}')).sendKeys(protractor.Key.ENTER);", id);
                }
            };
            /** Type in step */
            ProtractorTemplateService.prototype.AddTypeInStep = function (id, path, text) {
                if (id && id.length > 0) {
                    return this.formatString("element(by.id('{0}')).sendKeys('{1}');", id, text);
                }
                else if (path && path.length > 0) {
                    return this.formatString("element(by.css('{0}')).sendKeys('{1}');", path, text);
                }
            };
            /** Add ensure test */
            ProtractorTemplateService.prototype.AddEnsureTest = function (id, path) {
                if (id && id.length > 0) {
                    return this.formatString("expect(element(by.id('{0}')).isPresent()).toBeTruthy();", id);
                }
                else if (path && path.length > 0) {
                    return this.formatString("expect(element(by.css('{0}')).isPresent()).toBeTruthy();", path);
                }
            };
            /** Switch to iframe context */
            ProtractorTemplateService.prototype.SwitchToIFrameContext = function (id) {
                if (id && id.length > 0) {
                    var result = "browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id('{0}'))), 2000);";
                    result += "" + this.AddEnsureTest(id, undefined);
                    result += "" + "browser.switchTo().frame('{0}');";
                    return this.formatString(result, id);
                }
            };
            /** Add url change test */
            ProtractorTemplateService.prototype.AddUrlChangeTest = function (url) {
                return this.formatString("browser.wait(urlChanged('{0}'), 5000)", url);
            };
            return ProtractorTemplateService;
        }(TemplateService));
        Services.ProtractorTemplateService = ProtractorTemplateService;
        var WebdriverIOTemplateService = (function (_super) {
            __extends(WebdriverIOTemplateService, _super);
            function WebdriverIOTemplateService() {
                _super.apply(this, arguments);
            }
            WebdriverIOTemplateService.prototype.ComposeGlobalDefinitions = function () {
                return ["var urlChanged = function(url) { return browser.url() === url; };"];
            };
            WebdriverIOTemplateService.prototype.ComposeTestsSettings = function () {
                return [
                    "browser.timeouts('implicit', 2000);",
                    "browser.timeouts('page load', 5000);"
                ];
            };
            WebdriverIOTemplateService.prototype.AddBrowserGetStep = function (url) {
                return this.formatString("browser.url('{0}');", url);
            };
            WebdriverIOTemplateService.prototype.AddClickStep = function (id, path) {
                if (id && id.length > 0) {
                    return this.formatString("browser.click('#{0}');", id);
                }
                else if (path && path.length > 0) {
                    return this.formatString("browser.click('{0}');", path);
                }
                else {
                    return "\/\/ AddClickStep failed due to the missing element selector;";
                }
            };
            WebdriverIOTemplateService.prototype.AddEnterStep = function (id) {
                if (id && id.length > 0) {
                    return this.formatString("browser.element('#{0}').keys('Enter');", id);
                }
                else {
                    return "\/\/ AddEnterStep failed due to the missing element selector;";
                }
            };
            WebdriverIOTemplateService.prototype.AddTypeInStep = function (id, path, text) {
                if (id && id.length > 0) {
                    return this.formatString("browser.setValue('#{0}', '{1}');", id, text);
                }
                else if (path && path.length > 0) {
                    return this.formatString("browser.element('{0}', '{1}');", path, text);
                }
                else {
                    return "\/\/ AddTypeInStep failed due to the missing element selector;";
                }
            };
            WebdriverIOTemplateService.prototype.AddEnsureTest = function (id, path) {
                if (id && id.length > 0) {
                    return this.formatString("expect(browser.isExisting('#{0}')).toBeTruthy();", id);
                }
                else if (path && path.length > 0) {
                    return this.formatString("expect(browser.isExisting('{0}')).toBeTruthy();", path);
                }
                else {
                    return "\/\/ AddEnsureTest failed due to the missing element selector;";
                }
            };
            /** Switch to iframe context */
            WebdriverIOTemplateService.prototype.SwitchToIFrameContext = function (id) {
                if (id && id.length > 0) {
                    var result = "browser.waitForExist('#{0}', 2000);";
                    result += "" + this.AddEnsureTest(id, undefined);
                    result += "" + "browser.frame('#{0}');";
                    return this.formatString(result, id);
                }
                else {
                    return "\/\/ SwitchToIFrameContext failed due to the missing element selector;";
                }
            };
            /** Add url change test */
            WebdriverIOTemplateService.prototype.AddUrlChangeTest = function (url) {
                return this.formatString("browser.waitUntil(urlChanged('{0}'), 5000)", url);
            };
            return WebdriverIOTemplateService;
        }(TemplateService));
        Services.WebdriverIOTemplateService = WebdriverIOTemplateService;
    })(Services = ExtensionApp.Services || (ExtensionApp.Services = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Services;
    (function (Services) {
        /** StorageService that downloads file to user machine */
        var DownloadStorageService = (function () {
            /**
             * Constructor
             * @param chrome extension access
             */
            function DownloadStorageService(chrome) {
                this.chrome = chrome;
            }
            DownloadStorageService.prototype.StoreFile = function (fileName, fileData, fileType) {
                if (fileType === void 0) { fileType = "text/plain"; }
                var fileBlob = new Blob([fileData], { type: fileType });
                var fileUrl = URL.createObjectURL(fileBlob);
                this.chrome.downloads.download({
                    url: fileUrl,
                    // Provide initial name to be tests.js
                    filename: fileName,
                    conflictAction: "prompt",
                    // Open save as dialog
                    saveAs: true
                }, function (downloadId) {
                    console.log("Downloaded item with ID", downloadId);
                });
            };
            /** Dependency injection */
            DownloadStorageService.$inject = ['chrome'];
            return DownloadStorageService;
        }());
        Services.DownloadStorageService = DownloadStorageService;
        /**
         * HTTPStorageService can store file to remote HTTP service.
         *
         * Endpoint should support POST method.
         */
        var HTTPStorageService = (function () {
            /**
             * Constructor
             * @param endpointUrl URL of REST endpoint to store file to.
             */
            function HTTPStorageService(endpointUrl) {
                if (endpointUrl === void 0) { endpointUrl = "http://localhost:8080"; }
                this.endpointUrl = endpointUrl;
            }
            HTTPStorageService.prototype.StoreFile = function (fileName, fileData, fileType) {
                if (fileType === void 0) { fileType = "text/plain"; }
                var me = this;
                var fileBlob = new Blob([fileData], { type: fileType });
                var data = new FormData();
                data.append("file", fileBlob, fileName);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", me.endpointUrl);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            console.log("File was successfully stored to '%s'", me.endpointUrl);
                        }
                        else {
                            console.log("Request to '%s' failed with code %d", me.endpointUrl, xhr.status);
                        }
                    }
                };
                xhr.send(data);
            };
            /** Dependency injection */
            HTTPStorageService.$inject = [];
            return HTTPStorageService;
        }());
        Services.HTTPStorageService = HTTPStorageService;
    })(Services = ExtensionApp.Services || (ExtensionApp.Services = {}));
})(ExtensionApp || (ExtensionApp = {}));
/// <reference path="chrome_service.ts"/>
/// <reference path="template_service.ts"/>
/// <reference path="storage_service.ts"/>
var ExtensionApp;
(function (ExtensionApp) {
    var Services;
    (function (Services) {
        angular
            .module('ExtensionApp.Services', [])
            .service('ChromeService', Services.ChromeService)
            .service('ProtractorTemplateService', Services.ProtractorTemplateService)
            .service('WebdriverIOTemplateService', Services.WebdriverIOTemplateService)
            .service('DownloadStorageService', Services.DownloadStorageService)
            .service('HTTPStorageService', Services.HTTPStorageService);
    })(Services = ExtensionApp.Services || (ExtensionApp.Services = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Event types */
        (function (EventType) {
            EventType[EventType["Load"] = 0] = "Load";
            EventType[EventType["Click"] = 1] = "Click";
            EventType[EventType["Focus"] = 2] = "Focus";
            EventType[EventType["Key"] = 3] = "Key";
        })(Controllers.EventType || (Controllers.EventType = {}));
        var EventType = Controllers.EventType;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Outcome type */
        (function (OutcomeType) {
            OutcomeType[OutcomeType["NetworkCall"] = 0] = "NetworkCall";
            OutcomeType[OutcomeType["UXChange"] = 1] = "UXChange";
            OutcomeType[OutcomeType["URLChange"] = 2] = "URLChange";
        })(Controllers.OutcomeType || (Controllers.OutcomeType = {}));
        var OutcomeType = Controllers.OutcomeType;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Abstract Event class */
        var Event = (function () {
            function Event() {
            }
            return Event;
        }());
        Controllers.Event = Event;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Base class for different outcome types. */
        var Outcome = (function () {
            function Outcome() {
            }
            return Outcome;
        }());
        Controllers.Outcome = Outcome;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Click event */
        var ClickEvent = (function (_super) {
            __extends(ClickEvent, _super);
            /** Make sure the event class + id + perhaps the element number is logged */
            function ClickEvent(elementId, elementClass) {
                _super.call(this);
                this.elementId = elementId;
                this.elementClass = elementClass;
                /** Click event type */
                this.type = Controllers.EventType.Click;
            }
            return ClickEvent;
        }(Controllers.Event));
        Controllers.ClickEvent = ClickEvent;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Load event */
        var LoadEvent = (function (_super) {
            __extends(LoadEvent, _super);
            /** Constructor */
            function LoadEvent(loadUrl) {
                _super.call(this);
                this.loadUrl = loadUrl;
                /** Type is load */
                this.type = Controllers.EventType.Load;
            }
            return LoadEvent;
        }(Controllers.Event));
        Controllers.LoadEvent = LoadEvent;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Load event */
        var KeyEvent = (function (_super) {
            __extends(KeyEvent, _super);
            /** Constructor */
            function KeyEvent(loadUrl) {
                _super.call(this);
                this.loadUrl = loadUrl;
                /** Type is load */
                this.type = Controllers.EventType.Key;
            }
            return KeyEvent;
        }(Controllers.Event));
        Controllers.KeyEvent = KeyEvent;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
/// <reference path="EventType.ts"/>
/// <reference path="OutcomeType.ts"/>
/// <reference path="Event.ts"/>
/// <reference path="Outcome.ts"/>
/// <reference path="ClickEvent.ts"/>
/// <reference path="LoadEvent.ts"/>
/// <reference path="KeyEvent.ts"/> 
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        var IntroController = (function () {
            /**
             * Constructor for events controller.
             * @param $scope the scope
             * @param ChromeService chrome service
             */
            function IntroController($scope, ChromeService, TemplateService, StorageService, chrome) {
                this.$scope = $scope;
                this.ChromeService = ChromeService;
                this.TemplateService = TemplateService;
                this.StorageService = StorageService;
                this.chrome = chrome;
                /** If the chrome service is not initialized present the base page request experience. */
                if (!ChromeService.isInitialized) {
                    this.initialized = false;
                    this.propose = false;
                    this.InitializeEventHandlers();
                }
                else {
                    this.initialized = true;
                    this.tab = this.ChromeService.testingTabId;
                    this.url = this.ChromeService.events[0].url;
                }
            }
            /**
             * Initialize everything now that we know the base page and tab id.
             */
            IntroController.prototype.Initialize = function () {
                this.initialized = true;
                this.propose = false;
                this.ChromeService.Initialize(this.tab);
                this.ChromeService.AddLoadEvent({ url: this.url });
                this.ChromeService.InitializeEventListeners();
            };
            /**
             * Initialize event handlers
             */
            IntroController.prototype.InitializeEventHandlers = function () {
                var controller = this;
                this.chrome.runtime.onMessage.addListener(function TemporaryListener(msg, sender, response) {
                    /** If the sender is content script */
                    if (controller.ChromeService.isInitialized) {
                        controller.chrome.runtime.onMessage.removeListener(TemporaryListener);
                        return;
                    }
                    if (msg.from === 'content') {
                        if (msg.subject) {
                            /** Page load */
                            if (msg.subject === 'load') {
                                controller.tab = sender.tab.id;
                                controller.url = sender.tab.url;
                                controller.propose = true;
                                controller.$scope.$apply();
                            }
                        }
                    }
                });
            };
            /**
             * Clear all
             */
            IntroController.prototype.ClearAll = function () {
                this.initialized = false;
                this.propose = false;
                this.ChromeService.ClearAll();
                this.InitializeEventHandlers();
            };
            /** Download the tests */
            IntroController.prototype.Download = function () {
                var testId = 'Recorded test';
                var fileData = this.TemplateService.ComposeFile(testId);
                this.StorageService.StoreFile(testId + '.js', fileData);
            };
            /**
             * Dependency injection.
             */
            IntroController.$inject = ['$scope', 'ChromeService', 'ProtractorTemplateService', 'DownloadStorageService', 'chrome'];
            return IntroController;
        }());
        Controllers.IntroController = IntroController;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /**
         * Events controller class.
         */
        var EventsController = (function () {
            /**
             * Constructor for events controller.
             * @param ChromeService chrome service
             */
            function EventsController(ChromeService) {
                this.ChromeService = ChromeService;
                /**
                 * Menu options
                 */
                this.menuOptions = [
                    /*['Mark as Setup', function ($itemScope) {
                        $itemScope.event.testtype = 'setup';
                    }/*, [
                        ['Mark as Setup and Edit', function($itemScope) {
                            $itemScope.event.testtype = 'setup';
                        }]]
                    ],null,*/
                    ['Mark as Step', function ($itemScope) {
                            $itemScope.event.testtype = 'step';
                        }], null,
                    ['Mark as Test', function ($itemScope) {
                            $itemScope.event.testtype = 'test';
                        }] /*,null,
                    ['Mark as Result', function($itemScope) {
                        $itemScope.event.testtype = 'result';
                    }]*/
                ];
                this.events = this.ChromeService.events;
            }
            /**
             * Remove event from the chrome service.
             * @param index Index to remove.
             */
            EventsController.prototype.RemoveEvent = function (index) {
                this.ChromeService.RemoveEvent(index);
            };
            /**
             * Dependency injection.
             */
            EventsController.$inject = ['ChromeService'];
            return EventsController;
        }());
        Controllers.EventsController = EventsController;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        var NavbarController = (function () {
            /**
             * Constructor for the controller
             */
            function NavbarController($scope, $location, TemplateService, StorageService) {
                var _this = this;
                this.$scope = $scope;
                this.$location = $location;
                this.TemplateService = TemplateService;
                this.StorageService = StorageService;
                $scope.isActive = function (viewLocation) {
                    if ($location.path().indexOf('demo') >= 0) {
                        return false;
                    }
                    return $location.path().indexOf(viewLocation) >= 0;
                };
                $scope.Back = function () {
                    window.history.back();
                };
                $scope.Download = function () {
                    var testId = 'Recorded test';
                    var fileData = _this.TemplateService.ComposeFile(testId);
                    _this.StorageService.StoreFile(testId + '.js', fileData);
                };
            }
            /** dependency injection */
            NavbarController.$inject = ['$scope', '$location', 'ProtractorTemplateService', 'DownloadStorageService'];
            return NavbarController;
        }());
        Controllers.NavbarController = NavbarController;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /**
         * Preferences controller
         */
        var PreferencesController = (function () {
            /** Preferences controller */
            function PreferencesController($scope, TemplateService) {
                this.TemplateService = TemplateService;
                $scope.Download = function () {
                    //TemplateService.ComposeFile();
                };
            }
            /** Dependency injection */
            PreferencesController.$inject = ['$scope', 'WebdriverIOTemplateService'];
            return PreferencesController;
        }());
        Controllers.PreferencesController = PreferencesController;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
/// <reference path="intro_controller.ts"/>
/// <reference path="events_controller.ts"/>
/// <reference path="navbar_controller.ts"/>
/// <reference path="preferences_controller.ts"/>
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        angular.module('ExtensionApp.Controllers', []);
        angular.module('ExtensionApp.Controllers').controller('IntroController', Controllers.IntroController);
        angular.module('ExtensionApp.Controllers').controller('EventsController', Controllers.EventsController);
        angular.module('ExtensionApp.Controllers').controller('NavbarController', Controllers.NavbarController);
        angular.module('ExtensionApp.Controllers').controller('PreferencesController', Controllers.PreferencesController);
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/chrome/chrome.d.ts"/>
/// <reference path="app/classes/_all.ts"/>
/// <reference path="app/services/_all.ts"/>
/// <reference path="app/controllers/_all.ts"/>
var ExtensionApp;
(function (ExtensionApp) {
    angular.module('ExtensionApp', ['ngRoute',
        'ExtensionApp.Controllers',
        'ExtensionApp.Services',
        'ui.bootstrap.contextMenu']).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/setup', {
                templateUrl: 'views/intro.html',
                controller: ExtensionApp.Controllers.IntroController,
                controllerAs: 'vm'
            })
                .when('/tests', {
                templateUrl: 'views/tests.html',
                controller: ExtensionApp.Controllers.EventsController,
                controllerAs: 'vm'
            })
                .when('/preferences', {
                templateUrl: 'views/preferences.html',
                controller: ExtensionApp.Controllers.PreferencesController,
                controllerAs: 'vm'
            }).
                otherwise({
                redirectTo: '/setup'
            });
        }]).run(null);
    angular.module('ExtensionApp').constant('chrome', chrome);
})(ExtensionApp || (ExtensionApp = {}));
