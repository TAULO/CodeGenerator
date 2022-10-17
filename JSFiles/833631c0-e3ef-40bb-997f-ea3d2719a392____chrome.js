/**
 * Created by cjh1 on 2016/12/18.
 */

const {remote, desktopCapturer, webFrame, shell, ipcRenderer} = require('electron');
const {Menu, MenuItem, BrowserWindow} = remote;
const {app} = remote;
const path = require('path');
const fs = require('fs');

let remoteGlobal = remote.getGlobal('global');

const AppWindow = require('./window.js');
const Event = require('./event');

let chromeCache = {};

function deepCopy(o, t) {
    for (var k in o) {
        var v = o[k];
        if (v.constructor == Object)
            t[k] = deepCopy(v, {});
        else
            t[k] = v;
    }
    return t;
}

function getManifestVersion(runtimePath) {
    return JSON.parse(fs.readFileSync(path.join(runtimePath, 'manifest.json')).toString()).version;
}

function getMessageFromManifest(manifest, extensionPath) {
    let message;
    let messagePath;
    // 搜索用户首选语言对应的消息文件
    let userLocale = 'zh_CN'; // en, zh_CN
    let commonLocale;
    if (userLocale.indexOf('_') !== -1) {
        commonLocale = userLocale.split('_')[0];
    }
    if (fs.existsSync(messagePath = path.join(extensionPath, `_locales/${userLocale}/messages.json`))) {
        message = JSON.parse(fs.readFileSync(messagePath));
    } else if (commonLocale && fs.existsSync(messagePath = path.join(extensionPath, `_locales/${commonLocale}/messages.json`))) {
        message = JSON.parse(fs.readFileSync(messagePath));
    } else if (manifest.default_locale && fs.existsSync(messagePath = path.join(extensionPath, `_locales/${manifest.default_locale}/messages.json`))) {
        message = JSON.parse(fs.readFileSync(messagePath));
    }
    return message;
}

function localeManifest(manifestJson, message) {
    manifestJson = manifestJson.replace(/__MSG_(\w+?)__/g, function (a, msg) {
        if (message && message[msg]) {
            return message[msg].message;
        }
        return msg;
    });
    return JSON.parse(manifestJson);
}

// get extension id from extension path
function getIdByPath(path) {
    let arr = path.replace(/\\/g, '/').split('/');
    return arr[arr.length - 2];
}

function createChrome(extensionPath) {
    if (chromeCache[extensionPath]) {
        return chromeCache[extensionPath];
    }

    let manifestJson = fs.readFileSync(path.join(extensionPath, 'manifest.json'), 'utf-8');
    if (!manifestJson) {
        console.error('清单文件缺失或不可读');
    }

    let manifest = JSON.parse(manifestJson);
    if (!manifest.permissions) {
        manifest.permissions = {};
    }

    let curExtId = getIdByPath(extensionPath);
    
    let hasPermission = function (name) {
        return manifest.permissions.some((permission) => {
            return permission === name;
        })
    };

    let message = getMessageFromManifest(manifest, extensionPath);
    manifest = localeManifest(manifestJson, message);
    
    // check version and update
    let myManifestVersion = getManifestVersion(extensionPath);

    // common
    let chrome = {
        Event: Event,
        csi: function () {

        },
        runtime: {
            OnInstalledReason: {
                CHROME_UPDATE: 'chrome_update',
                INSTALL: 'install',
                SHARED_MODULE_UPDATE: 'shared_module_update',
                UPDATE: 'update'
            },
            OnRestartRequiredReason: {
                APP_UPDATE: 'app_update',
                OS_UPDATE: 'os_update',
                PERIODIC: 'periodic'
            },
            PlatformArch: {
                ARM: 'arm',
                X86_32: 'x86-32',
                X86_64: 'x86-64'
            },
            PlatformNaclArch: {
                ARM: 'arm',
                X86_32: 'x86-32',
                X86_64: 'x86-64'
            },
            RequestUpdateCheckStatus: {
                NO_UPDATE: 'no_update',
                THROTTLED: 'throttled',
                UPDATE_AVAILABLE: 'update_available'
            },
            PlatformOs: {
                ANDROID: 'android',
                CROS: 'cros',
                LINUX: 'linux',
                MAC: 'mac',
                OPENBSD: 'openbsd',
                WIN: 'win'
            },
            id: curExtId, // TODO
            /**
             * @return {object}
             */
            getManifest: function () {
                return manifest;
            },
            /**
             * Converts a relative path within an app/extension install directory to a fully-qualified URL
             * @param {string} path
             *      A path to a resource within an app/extension expressed relative to its install directory
             * @return {string}
             */
            getURL: function (path) {
                return `chrome-extension://${this.id}/${path}`;
            },
            /**
             * Since Chrome 26
             * @param {string} extensionId
             * @param {*} message
             * @param {Object} options
             * @param {function} responseCallback
             */
            sendMessage(extensionId, message, options, responseCallback) {
                console.error('dropping message on the floor', arguments);
            },
            /**
             * @param {string} (optional)extensionId
             * @param {object} (optional)connectInfo
             * @return {Port}
             */
            connect(extensionId, connectInfo) {

            }
        },
        i18n: {
            /**
             * @param {string} text
             * @param {function} callback
             */
            detectLanguage: function (text, callback) {
                // TODO
            },

            /**
             * @param {function} callback
             */
            getAcceptLanguages: function (callback) {
                callback(['zh_CN', 'zh']); // TODO
            },

            /**
             * @param {String} messageName
             * @param {*} substitutions
             * @return {string}
             */
            getMessage: function (messageName, substitutions) {
                if (message && message[messageName]) {
                    return message[messageName].message;
                }
                return '';
            },

            /**
             * @return {string}
             */
            getUILanguage: function () {
                return 'zh-CN'; // TODO
            }
        },
        loadTimes: {

        }
    };

    chrome.extension = {
        ViewType: {
            POPUP: 'popup',
            TAB: 'tab',
        },

        /**
         * @type object
         */
        lastError: null,

        /**
         * @type boolean
         */
        inIncognitoContext: false,

        connect: function () {

        },

        // onConnect
        // onMessage
        // onRequest
        //lastError: null,
        sendMessage: function () {

        },

        /**
         * @deprecated use runtime.sendMessage instead
         *
         * @param {string} extensionId
         * @param {*} request
         * @param {function} responseCallback
         */
        sendRequest: function (extensionId, request, responseCallback) {

        },

        /**
         * @deprecated use runtime.onMessage instead
         */
        onRequest: null,

        /**
         *
         * @param {string} path
         * @return {string}
         */
        getURL(path) {
            return `chrome-extension://${curExtId}/${path}`;
        },

        /**
         * @param {object} fetchProperties
         * @return {Array.<Window>}
         */
        getViews(fetchProperties) {

        },

        /**
         * @return Window
         */
        getBackgroundPage() {

        },

        /**
         * @param {function} callback
         */
        isAllowedIncognitoAccess(callback) {

        },

        /**
         *
         * @param {function} callback
         */
        isAllowedFileSchemeAccess(callback) {}
    };
    
    if (hasPermission('management')) {
        chrome.management = {
            ExtensionDisabledReason: {
                PERMISSIONS_INCREASE: "permissions_increase",
                UNKNOWN: "unknown"
            },
            ExtensionInstallType: {
                ADMIN: "admin",
                DEVELOPMENT: "development",
                NORMAL: "normal",
                OTHER: "other",
                SIDELOAD: "sideload"
            },
            ExtensionType: {
                EXTENSION: "extension",
                HOSTED_APP: "hosted_app",
                LEGACY_PACKAGED_APP: "legacy_packaged_app",
                PACKAGED_APP: "packaged_app",
                THEME: "theme"
            },
            LaunchType: {
                OPEN_AS_PINNED_TAB: "OPEN_AS_PINNED_TAB",
                OPEN_AS_REGULAR_TAB: "OPEN_AS_REGULAR_TAB",
                OPEN_AS_WINDOW: "OPEN_AS_WINDOW",
                OPEN_FULL_SCREEN: "OPEN_FULL_SCREEN"
            },

            createAppShortcut() {
                "use strict";

            },
            generateAppForLink() {
                "use strict";

            },

            /**
             * TODO 可能为空
             * @param {string} id
             * @param {function(ExtensionInfo)} callback
             */
            get(id, callback) {
                for (let i = 0; i < remoteGlobal.extInfos.length; i++) {
                    if (remoteGlobal.extInfos[i].id === id) {
                        callback(remoteGlobal.extInfos[i]);
                        return;
                    }
                }
                callback(null);
            },

            /**
             * @param {function(Array.<ExtensionInfo>)} callback
             */
            getAll(callback) {
                if (remoteGlobal.extInfos) {
                    callback(remoteGlobal.extInfos);
                    return;
                }
                let extInfos = [];

                var that = this;
                function getType(ext) {
                    if (ext.theme) {
                        return that.ExtensionType.THEME;
                    }
                    if (ext.app && ext.app.launch) {
                        if (ext.app.launch.local_path) {
                            return that.ExtensionType.PACKAGED_APP;
                        }
                        return that.ExtensionType.HOSTED_APP; // TODO LEGACY_PACKAGED_APP
                    }
                    return that.ExtensionType.EXTENSION;
                }
                function getIcons(ext) {
                    if (!ext.icons) {
                        return [];
                    }
                    let icons = [];
                    for (let key in ext.icons) {
                        icons.push({
                            size: parseInt(key),
                            url: 'chrome-extension://' + ext.id + '/' + ext.icons[key]
                            //url: 'chrome://extension-icon/agepbnndonmiebbonknpibiggagnlokc/16/0' // TODO
                        });
                    }
                    return icons;
                }
                remoteGlobal.exts.forEach((ext) => {
                    extInfos.push({
                        id: ext.id,
                        name: ext.name,
                        shortName: ext.short_name || ext.name,
                        description: ext.description,
                        version: ext.version,
                        mayDisable: true,
                        enabled: true, // TODO
                        disabledReason: null, // TODO
                        isApp: ext.app ? true : false,
                        type: getType(ext),
                        appLaunchUrl: '',
                        homepageUrl: ext.homepage_url,
                        updateUrl: ext.update_url,
                        offlineEnabled: ext.offline_enabled === false ? false : true,
                        optionsUrl: ext.options_page,
                        icons: getIcons(ext),
                        permissions: ext.permissions,
                        hostPermissions: [],
                        installType: this.ExtensionInstallType.NORMAL,
                        launchType: this.LaunchType.OPEN_AS_REGULAR_TAB,
                        availableLaunchTypes: [this.LaunchType.OPEN_AS_REGULAR_TAB]
                    });
                });

                remoteGlobal.extInfos = extInfos;
                callback(extInfos);
            },

            /**
             * @param {string} id
             * @param {function} callback
             */
            getPermissionWarningsById(id, callback) {

            },

            /**
             * @parma {string} manifestStr
             * @parma {function} callback
             */
            getPermissionWarningsByManifest(manifestStr, callback) {

            },
            /**
             *
             */
            getPermissionWarningsByManifest() {
                "use strict";

            },
            /**
             * @param function callback (ExtensionInfo result)
             */
            getSelf(callback) {
                "use strict";

            },

            /**
             * @param {string} id
             * @param {function} callback
             */
            launchApp(id, callback) {
                console.log('试试'+id);
                //console.log(remoteGlobal);
                //remoteGlobal.callback('asd');
                //alert(id);
                // TODO
                ipcRenderer.send('opp', {
                    type: 'launchApp',
                    id: id
                })
                console.log('发送完')
            },

            onDisabled: new chrome.Event(),
            onEnabled: new chrome.Event(),
            onInstalled: new chrome.Event(),
            onUninstalled: new chrome.Event(),
            /**
             * @param {string} id
             * @param {boolean} enabled
             * @param {function} callback
             */
            setEnabled(id, enabled, callback) {

            },
            setIncognitoEnabled() {
                "use strict";

            },
            setIncognitoEnabled() {
                "use strict";

            },
            setLaunchType() {
                "use strict";

            },
            /**
             * @param {string} id
             * @param {object} options
             * @param {function} callback
             */
            uninstall(id, options, callback) {

            },
            /**
             * @param {object} options
             * @param {function} callback
             */
            uninstallSelf(options, callback) {

            }
        };
    }

    chrome.desktopCapture = require('./chrome-desktopcapture.js');

    // difference
//chrome.app = require('./chrome-app.js');
    chrome.system = require('./chrome-system.js');
    //chrome.alarms = require('./chrome-alarms.js');
//chrome.idle = require('./chrome-idle.js');

    chrome.syncFileSystem = {
    };

    if (hasPermission('storage')) {
        chrome.storage = require('./chrome-storage');
    }

    chrome.browser = require('./chrome-browser');

    if (hasPermission('contextMenus')) {
        let createContextMenus = require('./chrome-contextmenus.js');
        chrome.contextMenus = createContextMenus(curExtId, manifest, chrome.extension);
    }

    if (hasPermission('notifications')) {
        chrome.notifications = require('./chrome-notifications.js');
    }

    if (manifest.browser_action) {
        chrome.browserAction = {
            /**
             * @param {integer} tabId
             */
            disable(tabId) {

            },

            /**
             * @param {integer} tabId
             */
            enable(tabId) {

            },

            /**
             * @param {Object} details
             * @param {function} callback
             */
            getBadgeBackgroundColor(details, callback) {

            },

            /**
             * @param {Object} details
             * @param {function} callback
             */
            getBadgeText(details, callback) {

            },

            /**
             * @param {Object} details
             * @param {function} callback
             */
            getPopup(details, callback) {
                "use strict";

            },

            /**
             * @param {Object} details
             * @param {function} callback
             */
            getTitle(details, callback) {
                "use strict";

            },
            onClicked: new chrome.Event(),

            /**
             * @param {Object} details
             */
            setBadgeBackgroundColor(details) {
                "use strict";

            },

            /**
             * @param {Object} details
             */
            setBadgeText(details) {
                "use strict";

            },

            /**
             * @param {Object} details
             * @param {function} callback
             */
            setIcon(details, callback) {

            },

            /**
             * @param {Object} details
             */
            setPopup(details) {
                "use strict";

            },

            /**
             * @param {object} details
             */
            setTitle(details) {
                "use strict";

            }
        };
    }

    if (manifest.page_action) {
        chrome.pageAction = {


        };
    }

    //const identity = require('../api/chrome-identity');
    //chrome.identity = identity.identity;

    chrome.fileSystem = {
    };

    if (manifest.app) {
        chrome.app = {
            runtime: {
                LaunchSource: {
                    ABOUT_PAGE: "about_page",
                    APP_LAUNCHER: "app_launcher",
                    BACKGROUND: "background",
                    CHROME_INTERNAL: "chrome_internal",
                    COMMAND_LINE: "command_line",
                    EPHEMERAL_APP: "ephemeral_app",
                    EXTENSIONS_PAGE: "extensions_page",
                    FILE_HANDLER: "file_handler",
                    KEYBOARD: "keyboard",
                    KIOSK: "kiosk",
                    LOAD_AND_LAUNCH: "load_and_launch",
                    MANAGEMENT_API: "management_api",
                    NEW_TAB_PAGE: "new_tab_page",
                    RELOAD: "reload",
                    RESTART:"restart",
                    SYSTEM_TRAY: "system_tray",
                    TEST: "test",
                    URL_HANDLER: "url_handler"
                },
                onLaunched: new chrome.Event(),
                onEmbedRequested: new chrome.Event(),
                onRestarted: new chrome.Event()
            },
            window: {
                /**
                 *
                 * @param {string} url
                 * @param {CreateWindowOptions} options
                 * @param {function} callback
                 */
                create: function(url, options, callback) {

                },
                /**
                 * @return {AppWindow}
                 */
                current: function () {

                },
                /**
                 * @return array of AppWindow
                 */
                getAll: function () {
                },
                /**
                 * @param {string} id
                 * @return {AppWindow}
                 */
                get(id) {

                },
                /**
                 * @return {boolean}
                 */
                canSetVisibleOnAllWorkspaces: function () {

                }

            }
        }
    } else {
        chrome.app = {
            getDetails: function () {
                return null;
            },
            getIsInstalled: function () {
                return false;
            },
            installState: function () {

            },
            isInstalled: function () {
                return false;
            },
            runningState: function () {
                return 'cannot_run';
            }
        };
    }

    chrome.permissions = {
        contains() {
            "use strict";

        },
        getAll() {

        },
        onAdded: new chrome.Event(),
        onRemoved: new chrome.Event(),
        remove() {

        },
        request() {

        }
    };

    chrome.webNavigation = {};

    chrome.topSites = {

    };

    chrome.themes = {
        changeOSWallpaper() {
            "use strict";

        },
        changeWallpaper() {},
        getAccount() {
            "use strict";

        },
        getAll() {},
        getPersonData() {},
        getSyncdataItem() {},
        getWallpaper() {},
        onAccountStatusChanged() {},
        onChanged: new chrome.Event(),
        openLoginDialog() {},
        showLogin() {},
        showSyncDataDlg() {},
        skinSetting() {},
        switchTo() {},

    };

    chrome.webRequest = {};

    if (hasPermission('tabs')) {
        chrome.tabs = {
            /**
             * @param {integer} tabId
             * @param {function(Tab)} callback
             */
            get(tabId, callback) {
                "use strict";

            },

            /**
             * @param {function(Tab)} callback
             */
            getCurrent(callback) {
                "use strict";

            },

            /**
             * @param {integer} tabId
             * @param {Object} connectInfo
             */
            connect(tabId, connectInfo) {
                "use strict";

            },

            /**
             * @param {Object} queryInfo
             * @param {function} callback
             */
            query(queryInfo, callback) {
                "use strict";

                console.log(remoteGlobal.tabs);
                for (let i = 0; i < remoteGlobal.tabs.length; i++) {
                    if (remoteGlobal.tabs[i].active) {
                        console.log('回调');
                        callback([remoteGlobal.tabs[i]]);
                    }
                }
            },

            /**
             * @param {Object} createProperties
             * @param {function(Array.<Tab>)} callback
             */
            create(createProperties, callback) {

            },


        };
    }

    chromeCache[extensionPath] = chrome;

    return chrome;
}

exports.createChrome = createChrome;
exports.getMessageFromManifest = getMessageFromManifest;
exports.localeManifest = localeManifest;
exports.getIdByPath = getIdByPath;