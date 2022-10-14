/**
 * Created by cjh1 on 2016/12/6.
 */
const require = nodeRequire;
const electron = require('electron');
const path = require('path');
const fs = require('fs');
const {download} = require('electron-dl');
const isDev = require('electron-is-dev');

const Context = require('../../node/contextmenu.js');
const tool = require('../../node/tool.js');
const TabEx = require('../../node/TabEx.js');
const system = require('../../node/system');
const fileUtil = require('../../node/FileUtil');

const {calculateId} = require('./chrome/main/chrome-app-id');

const mm = require('./chrome/ExtManager');

calculateId('first').then(function(value) {
    console.log('success')
    //
}, function(value) {
    console.log('failure')
    //
});

const {
    remote,
    ipcRenderer,
    webFrame} = require('electron');
const chromeExtensions = require('./chrome/extension');

const {createChrome} = require('./chrome/api/chrome');

webFrame.registerURLSchemeAsSecure('chrome-extension');
webFrame.registerURLSchemeAsBypassingCSP('chrome-extension');
webFrame.registerURLSchemeAsPrivileged('chrome-extension');

webFrame.registerURLSchemeAsSecure('yunser');
webFrame.registerURLSchemeAsBypassingCSP('yunser');
webFrame.registerURLSchemeAsPrivileged('yunser');

const selfBrowserWindow = remote.getCurrentWindow();
const selfId = selfBrowserWindow.id;

let remoteGlobal = remote.getGlobal('global');

remoteGlobal.callback = function (msg, data) {
    alert('callbak');
}
//webFrame.setZoomFactor(2)
//webFrame.setZoomLevelLimits(0.25, 5);

remoteGlobal.tabs = [];
let globalTabs = remoteGlobal.tabs;
function getTab(id) {
    for (let i = 0; i < globalTabs.length; i++) {
        if (globalTabs[i].id === id) {
            return globalTabs[i];
        }
    }
    return null;
}
function getActiveTab(id) {
    for (let i = 0; i < globalTabs.length; i++) {
        if (globalTabs[i].active) {
            return globalTabs[i];
        }
    }
    return null;
}
function updateCurTab(url) {
    setInputUrl(url);
    // TODO
    let curTab = getTab(curTabId);
    curTab.url = url;
    remoteGlobal.tabs = globalTabs;
    updateNavIcon();
}

class Browser {

    back() {

    }

    loadUrl(url) {
        console.log('curTabId', curTabId)
        let curTab = getTab(curTabId);
        curTab.url = url;
        remoteGlobal.tabs = globalTabs;
        setInputUrl(url);

        updateNavIcon();
    }

    active(id) {

        let avtiveTab = getActiveTab();
        avtiveTab.active = false;

        let curTab = getTab(id);
        curTab.active = true;
        setInputUrl(curTab.url);

        remoteGlobal.tabs = globalTabs;
    }

    remove(id) {
        console.log('删除了',id)
        console.log(globalTabs);
        for (let i = 0; i < globalTabs.length; i++) {
            if (globalTabs[i].id === id) {
                globalTabs.splice(i, 1);
                console.log(globalTabs);
                remoteGlobal.tabs = globalTabs;
                break;
            }
        }
    }

    addTab(id, url) {
        globalTabs.push({
            id: '' + id,
            url: url,
            active: true
        });

        remoteGlobal.tabs = globalTabs;
    }
}

let browser = new Browser();

let curTabId;
let tabNum = 0;

console.log('node version: ' + process.versions.node);
console.log('chrome version: ' + process.versions.chrome);
console.log('electron version: ' + process.versions.electron);

function delUnusedElements(menuTpl) {
    let notDeletedPrevEl;
    return menuTpl.filter(el => el.visible !== false).filter((el, i, arr) => {
        const toDelete = el.type === 'separator' && (!notDeletedPrevEl || i === arr.length - 1 || arr[i + 1].type === 'separator');
        notDeletedPrevEl = toDelete ? notDeletedPrevEl : el;
        return !toDelete;
    });
}

const appPath = system.getAppPath();

let globalExtensions;

function getExtensionById(id) {
    for (let i = 0; i < globalExtensions.length; i++) {
        if (globalExtensions[i].id === id) {
            return globalExtensions[i];
        }
    }
    return null;
}



let chrome;
let i18n;

// load all extension
chromeExtensions.load(appPath + '/extension', (err, extensions) => {
    globalExtensions = extensions;
    remoteGlobal.exts = extensions
    remoteGlobal.mm = ['1', 2, 3];
    // init chrome after load all extension
    chrome = createChrome(__dirname);
    i18n = chrome.i18n;
    chrome.management.getAll((extInfos) => {
    });
    chrome.contextMenus.create({
        "title": "Test parent item"
    });

    extensions.forEach((extension) => {
        // Browser Actions popup
        if (extension.browser_action) {
            let action = extension.browser_action;
            let icon;
            if (action.default_icon) {
                if (typeof action.default_icon === 'string') {
                    icon = action.default_icon;
                } else {
                    // use the first icon
                    for (let key in action.default_icon) {
                        icon = action.default_icon[key];
                        break;
                    }
                }
            } else {
                icon = 'img/default-icon.jpg';
            }

            $('#ext-list').append(`<a class="ext-item" href="#" data-ext="${extension.id}" title="${extension.name}">
                <img src="${extension.path}/${icon}"></a>`);
        }

        // background script
        if (extension.background && extension.background.scripts) {
            let scripts = extension.background.scripts;

            // generate background page
            let bgPagePath = path.join(extension.path, '_generated_background_page.html');
            let scriptHtml = '';
            scripts.forEach((script) => {
                scriptHtml += `<script src="${script}"></script>\n`;
            });
            let bgPageHtml = `<!DOCTYPE html><html><head><<meta charset="utf-8">script>alert(1);</script></head><body><div>backgroud page</div>${scriptHtml}</body></html>`;
            fs.writeFileSync(bgPagePath, bgPageHtml, 'utf8', () => {
                
            });

            // run backgroud page
            let bgPageUrl = `chrome-extension://${extension.id}/_generated_background_page.html`;
            let webview = document.createElement('webview');
            //webview.style.display = 'none';
            webview.setAttribute('nodeintegration', '');
            webview.style.visibility = 'hidden';
            webview.src = bgPagePath;
            webview.preload = './chrome/preload/preload.js';
            webview.addEventListener('dom-ready', () => {
                //alert('ready');
            });
            document.body.appendChild(webview);

            /*scripts.forEach((script) => {
                let scriptPath = path.resolve(extension.path, script);

                let scriptText = fs.readFileSync(scriptPath, 'utf-8');

                let script2 = `((chrome) {${scriptText}})(createChrome(${extension.path}));`;

                var myScript= document.createElement("script");
                myScript.type = "text/javascript";
                //myScript.text = script2;
                myScript.src=scriptPath;
                //document.body.appendChild(myScript);




                let webview = document.createElement('webview');
                //webview.style.display = 'none';
                webview.setAttribute('nodeintegration', '');
                webview.style.visibility = 'hidden';
                webview.src = 'http://www.baidu.com';
                webview.preload = './chrome/preload/preload.js';
                webview.addEventListener('dom-ready', () => {
                    alert('ready');
                });
                document.body.appendChild(webview);
            });*/
        }
        
        // chrome_url_overrides
        if (extension.chrome_url_overrides) {
            if (extension.chrome_url_overrides.newtab) {
                mm.newtab = 'chrome-extension://' + extension.id + '/' + extension.chrome_url_overrides.newtab;
            }
        }

        // theme
        if (extension.theme && extension.name === 'Litten') {
            let theme = extension.theme;
            console.info(theme);
            if (theme.images) {
                let images = theme.images;
                //theme_ntp_background 大背景
            }
            if (theme.color) {
                let color = theme.color;
                //color.bookmark_text // 书签颜色
                //color.button_background // + -x按钮背景色
                //tab_background_text非 active tab 颜色
                //tab_text : active tab text color
                //ntp_background 大背景
                // toolbar 工具栏
            }
        }
    })
});

function simpleText(text) {
    if (text.length > 20) {
        return text.substring(0, 20) + '...';
    }
    return text;
}

function createMenu(props) {
    var opts = {};
    const editFlags = props.editFlags;
    const hasText = props.selectionText.trim().length > 0;
    const can = type => editFlags[`can${type}`] && hasText;


    let curWebview = document.getElementById('webview-' + curTabId);
    // current context
    let curContext;
    if (props.mediaType === 'image') {
        curContext = 'image';
    } else if (props.linkURL) {
        curContext = 'link';
    } else if (hasText) {
        curContext = 'selection';
    } else if (props.isEditable) {
        curContext = 'editable';
    }/* else {
     curContext = 'page';
     }*/
    //"all", "page", "frame", "video", "audio", "launcher", "browser_action", or "page_action"

    let menuTpl = [
        {
            id: 'back',
            label: i18n.getMessage('back'),
            enabled: curWebview.canGoBack(),
            click() {
                curWebview.goBack();
            }
        },
        {
            id: 'forward',
            label: i18n.getMessage('forward'),
            enabled: curWebview.canGoForward(),
            click() {
                curWebview.goForward();
            }
        },
        {
            id: 'reload',
            label: i18n.getMessage('reload'),
            click() {
                curWebview.reload();
            }
        },
        {
            type: 'separator'
        },
        {
            id: 'cut',
            label: i18n.getMessage('cut'),
            // needed because of macOS limitation:
            // https://github.com/electron/electron/issues/5860
            role: can('Cut') ? 'cut' : '',
            enabled: can('Cut'),
            visible: props.isEditable
        },
        {
            id: 'copy',
            label: i18n.getMessage('copy'),
            role: can('Copy') ? 'copy' : '',
            enabled: can('Copy'),
            visible: props.isEditable || hasText
        },
        {
            id: 'searchText',
            label: `${i18n.getMessage('search')} "${simpleText(props.selectionText)}"`,
            click() {
                let url = system.getSearchUrl(props.selectionText);
                window.open(url);
            },
            visible: props.isEditable || hasText
        },
        {
            id: 'paste',
            label: i18n.getMessage('paste'),
            role: editFlags.canPaste ? 'paste' : '',
            enabled: editFlags.canPaste,
            visible: props.isEditable
        },
        {
            type: 'separator'
        }
    ];

    if (props.mediaType === 'image') {
        menuTpl = [
            {
                type: 'separator'
            },
            {
                id: 'open-img',
                label: i18n.getMessage('openImageInNewTab'),
                click(item, win) {
                    window.open(props.srcURL);
                }
            },
            {
                id: 'save',
                label: i18n.getMessage('saveImageAs'),
                click(item, win) {
                    download(win, props.srcURL); // TODO
                }
            },
            {
                id: 'copy-image',
                label: i18n.getMessage('copyImage'),
                click(item, win) {
                    // TODO
                    ui.msg('the function is not achieve');
                }
            },
            {
                id: 'copy-image',
                label: i18n.getMessage('copyImageAddress'),
                click(item, win) {
                    electron.clipboard.writeText(props.srcURL);
                }
            },
            {
                type: 'separator'
            }
        ];
    }

    if (props.linkURL && props.mediaType === 'none') {
        menuTpl = [
            {
                type: 'separator'
            },
            {
                id: 'open-link',
                label: i18n.getMessage('openLinkInNewTab'),
                click() {
                    window.open(props.linkURL);
                }
            },
            {
                id: 'copyLink',
                label: i18n.getMessage('copyLinkAddress'),
                click() {
                    if (process.platform === 'darwin') {
                        electron.clipboard.writeBookmark(props.linkText, props.linkURL);
                    } else {
                        electron.clipboard.writeText(props.linkURL);
                    }
                }
            },
            {
                type: 'separator'
            }];
    }

    if (opts.prepend) {
        const result = opts.prepend(props, win);

        if (Array.isArray(result)) {
            menuTpl.unshift(...result);
        }
    }

    if (opts.append) {
        const result = opts.append(props, win);

        if (Array.isArray(result)) {
            menuTpl.push(...result);
        }
    }

    // extension context menu
    console.log(remoteGlobal.menus)
    if (remoteGlobal.menus && remoteGlobal.menus.length) {
        remoteGlobal.menus.forEach(function (menu) {
            let item = createMenuItem(menu, curContext);
            if (item) {
                menuTpl.push(item);
            }
        });

        menuTpl.push(
            {
                type: 'separator'
            }
        );
    }

    if (opts.showInspectElement || (opts.showInspectElement !== false && isDev)) {
        menuTpl.push(
            {
                type: 'separator'
            },
            {
                id: 'view-source',
                label: i18n.getMessage('viewSource'),
                click() {
                    window.open('view-source:' + curWebview.getURL())
                    //ui.msg('the function is not achieve');
                }
            },
            {
                id: 'inspect',
                label: i18n.getMessage('inspectElement'),
                click(item, win) {
                    //webview.getWebContents().Contents.inspectElement(props.x, props.y);

                    webview.getWebContents().openDevTools({
                        //undocked: false,
                        //detach: false,
                        mode: 'right'
                    });

                    /*webview.inspectServiceWorker();
                     if (webview.getWebContents().isDevToolsOpened()) {
                     webview.getWebContents().devToolsWebContents.focus();
                     } else {

                     }*/
                }
            },
            {
                type: 'separator'
            }
        );
    }

    // apply custom labels for default menu items
    if (opts.labels) {
        for (const menuItem of menuTpl) {
            if (opts.labels[menuItem.id]) {
                menuItem.label = opts.labels[menuItem.id];
            }
        }
    }

    // filter out leading/trailing separators
    // TODO: https://github.com/electron/electron/issues/5869
    menuTpl = delUnusedElements(menuTpl);

    return menuTpl;
}

var menuevent = {};
function buildMenuFromTemplate(menu) {
    $('#extension-menu').empty();

    var html = '';
    for (var i = 0; i < menu.length; i++) {
        var item = menu[i];

        if (item.type === 'separator') {
            html += '<li class="divider"></li>';
            continue;
        }

        let disabled = item.enabled === false ? 'disabled' : '';
        let id = i + '-0';

        html += `<li class="${disabled}">
            <a href="#" data-id="${id}">${item.label}</a>
        
        ` +
            (function () {
                if (item.submenu) {
                    var submenu = '<ul class="dropdown-menu">';
                    for (var j = 0; j < item.submenu.length; j++) {
                        submenu += '<li><a data-id="' + i + (j + 1)+ '" href="#">' + item.submenu[j].label + '</a></li>';
                        if (item.submenu[j].click) {
                            menuevent[i + '' + (j + 1)] = item.submenu[j].click;
                        }
                    }
                    submenu += '</ul>';
                    return submenu;

                } else {
                    return '';
                }

            })() + '</li>';
        if (item.click) {
            menuevent[i + '-0'] = item.click;
        }
    }

    $('#extension-menu')[0].innerHTML = html;

}

$('#extension-menu').on('click', 'a', function () {
    var id = $(this).data('id');
    if (menuevent[id]) {
        menuevent[id]();
    }
})

function initWebview(webview, id, isExt) {
    webview.addEventListener('did-finish-load', (e) => {
        updateNavIcon();
    });
    webview.addEventListener('found-in-page', (e, result) => {
        $('#find-info').text(`第 ${e.result.activeMatchOrdinal} 条, 共 ${e.result.matches} 条`);
    });
    webview.addEventListener('did-start-loading', (e) => {
        ;
    });
    webview.addEventListener('page-title-updated', (e) => {
        let $link = $('#nav-link-' + id);
        $link.find('.title').text(webview.getTitle());
        $link.attr('title', webview.getTitle());
    });
    webview.addEventListener('page-favicon-updated', (e) => {
        let $link = $('#nav-link-' + id);
        $link.find('.logo').css('background-image', 'url("' + e.favicons[0] + '")');
    });

    webview.addEventListener('did-fail-load', (e) => {
        console.log('fail')
        let type = fileUtil.getType( webview.getURL());
        if (type === 'audio') {
            // 暂时使用默认播放器
        } else {
            //webview.loadURL('chrome://errorpage');
        }
    });
    webview.addEventListener('new-window', (e) => {
        addTab(e.url);
    });
    webview.addEventListener('new-page-favicon-updated', (favicons) => {
    });
    webview.addEventListener('will-navigate', function (e) {
        updateCurTab(e.url);
    });
    webview.addEventListener('mousedown', (e) => {
        $(document).trigger('mousedown');
    }, true);
    webview.addEventListener('mouseup', (e) => {
        $(document).trigger('mouseup');
        $(document).trigger('click');
    }, true);
    webview.addEventListener('dom-ready', () => {
        if (isExt) {
            
        } else {
            globalExtensions.forEach((extension) => {
                chromeExtensions.addToWebview(webview, extension, (err) => {
                    if (err) {
                        console.error(err);
                    }
                })
            });
        }

        webview.getWebContents().on('context-menu', (e, props) => {

            let menuTpl = createMenu(props);

            buildMenuFromTemplate(menuTpl);

            ui.contextmenu('#extension-menu', props.x, props.y + 107);

            if (menuTpl.length > 0) {
                //const menu = (electron.Menu || electron.remote.Menu).buildFromTemplate(menuTpl);

                /*
                 * When electron.remote is not available this runs in the browser process.
                 * We can safely use win in this case as it refers to the window the
                 * context-menu should open in.
                 * When this is being called from a webView, we can't use win as this
                 * would refere to the webView which is not allowed to render a popup menu.
                 */
                //menu.popup(electron.remote ? electron.remote.getCurrentWindow() : win);
            }
        });
    });
}

function initWebview2(webview, id, isExt) {
    webview.addEventListener('did-fail-load', (e) => {
        ui.msg('load extension fail');
    });
    webview.addEventListener('new-window', (e) => {
        addTab(e.url);
    });
    webview.addEventListener('dom-ready', () => {
        /*webview.getWebContents().on('context-menu', (e, props) => {

            //console.info(remote.getGlobal('global'))

            var opts = {};
            const editFlags = props.editFlags;
            const hasText = props.selectionText.trim().length > 0;
            const can = type => editFlags[`can${type}`] && hasText;


            let curWebview = document.getElementById('webview-' + curTabId);
            // current context
            let curContext;
            if (props.mediaType === 'image') {
                curContext = 'image';
            } else if (props.linkURL) {
                curContext = 'link';
            } else if (hasText) {
                curContext = 'selection';
            } else if (props.isEditable) {
                curContext = 'editable';
            }/!* else {
             curContext = 'page';
             }*!/
            //"all", "page", "frame", "video", "audio", "launcher", "browser_action", or "page_action"

            let menuTpl = [
                {
                    id: 'back',
                    label: i18n.getMessage('back'),
                    enabled: curWebview.canGoBack(),
                    click() {
                        curWebview.goBack();
                    }
                },
                {
                    id: 'forward',
                    label: i18n.getMessage('forward'),
                    enabled: curWebview.canGoForward(),
                    click() {
                        curWebview.goForward();
                    }
                },
                {
                    id: 'reload',
                    label: i18n.getMessage('reload'),
                    click() {
                        curWebview.reload();
                    }
                },
                {
                    type: 'separator'
                },
                {
                    id: 'cut',
                    label: i18n.getMessage('cut'),
                    // needed because of macOS limitation:
                    // https://github.com/electron/electron/issues/5860
                    role: can('Cut') ? 'cut' : '',
                    enabled: can('Cut'),
                    visible: props.isEditable
                },
                {
                    id: 'copy',
                    label: i18n.getMessage('copy'),
                    role: can('Copy') ? 'copy' : '',
                    enabled: can('Copy'),
                    visible: props.isEditable || hasText
                },
                {
                    id: 'searchText',
                    label: `${i18n.getMessage('search')} "${simpleText(props.selectionText)}"`,
                    click() {
                        let url = system.getSearchUrl(props.selectionText);
                        window.open(url);
                    },
                    visible: props.isEditable || hasText
                },
                {
                    id: 'paste',
                    label: i18n.getMessage('paste'),
                    role: editFlags.canPaste ? 'paste' : '',
                    enabled: editFlags.canPaste,
                    visible: props.isEditable
                },
                {
                    type: 'separator'
                }
            ];

            if (props.mediaType === 'image') {
                menuTpl = [
                    {
                        type: 'separator'
                    },
                    {
                        id: 'open-img',
                        label: i18n.getMessage('openImageInNewTab'),
                        click(item, win) {
                            window.open(props.srcURL);
                        }
                    },
                    {
                        id: 'save',
                        label: i18n.getMessage('saveImageAs'),
                        click(item, win) {
                            download(win, props.srcURL); // TODO
                        }
                    },
                    {
                        id: 'copy-image',
                        label: i18n.getMessage('copyImage'),
                        click(item, win) {
                            // TODO
                            ui.msg('the function is not achieve');
                        }
                    },
                    {
                        id: 'copy-image',
                        label: i18n.getMessage('copyImageAddress'),
                        click(item, win) {
                            electron.clipboard.writeText(props.srcURL);
                        }
                    },
                    {
                        type: 'separator'
                    }
                ];
            }

            if (props.linkURL && props.mediaType === 'none') {
                menuTpl = [
                    {
                        type: 'separator'
                    },
                    {
                        id: 'open-link',
                        label: i18n.getMessage('openLinkInNewTab'),
                        click() {
                            window.open(props.linkURL);
                        }
                    },
                    {
                        id: 'copyLink',
                        label: i18n.getMessage('copyLinkAddress'),
                        click() {
                            if (process.platform === 'darwin') {
                                electron.clipboard.writeBookmark(props.linkText, props.linkURL);
                            } else {
                                electron.clipboard.writeText(props.linkURL);
                            }
                        }
                    },
                    {
                        type: 'separator'
                    }];
            }

            if (opts.prepend) {
                const result = opts.prepend(props, win);

                if (Array.isArray(result)) {
                    menuTpl.unshift(...result);
                }
            }

            if (opts.append) {
                const result = opts.append(props, win);

                if (Array.isArray(result)) {
                    menuTpl.push(...result);
                }
            }

            // extension context menu
            console.log(remoteGlobal.menus)
            if (remoteGlobal.menus && remoteGlobal.menus.length) {
                remoteGlobal.menus.forEach(function (menu) {
                    let item = createMenuItem(menu, curContext);
                    if (item) {
                        menuTpl.push(item);
                    }
                });

                menuTpl.push(
                    {
                        type: 'separator'
                    }
                );
            }

            if (opts.showInspectElement || (opts.showInspectElement !== false && isDev)) {
                menuTpl.push(
                    {
                        type: 'separator'
                    },
                    {
                        id: 'view-source',
                        label: i18n.getMessage('viewSource'),
                        click() {
                            window.open('view-source:' + curWebview.getURL())
                            //ui.msg('the function is not achieve');
                        }
                    },
                    {
                        id: 'inspect',
                        label: i18n.getMessage('inspectElement'),
                        click(item, win) {
                            //webview.getWebContents().Contents.inspectElement(props.x, props.y);

                            webview.getWebContents().openDevTools({
                                //undocked: false,
                                //detach: false,
                                mode: 'right'
                            });

                            /!*webview.inspectServiceWorker();
                             if (webview.getWebContents().isDevToolsOpened()) {
                             webview.getWebContents().devToolsWebContents.focus();
                             } else {

                             }*!/
                        }
                    },
                    {
                        type: 'separator'
                    }
                );
            }

            // apply custom labels for default menu items
            if (opts.labels) {
                for (const menuItem of menuTpl) {
                    if (opts.labels[menuItem.id]) {
                        menuItem.label = opts.labels[menuItem.id];
                    }
                }
            }

            // filter out leading/trailing separators
            // TODO: https://github.com/electron/electron/issues/5869
            menuTpl = delUnusedElements(menuTpl);

            if (menuTpl.length > 0) {
                const menu = (electron.Menu || electron.remote.Menu).buildFromTemplate(menuTpl);

                /!*
                 * When electron.remote is not available this runs in the browser process.
                 * We can safely use win in this case as it refers to the window the
                 * context-menu should open in.
                 * When this is being called from a webView, we can't use win as this
                 * would refere to the webView which is not allowed to render a popup menu.
                 *!/
                menu.popup(electron.remote ? electron.remote.getCurrentWindow() : win);
            }
        });*/
    });
}

function createMenuItem(menu, curContext) {
    function dealChildren(children) {
        let arr = [];
        children.forEach((submenu) => {

            if (submenu.contexts && (submenu.contexts.contains(curContext)
                || submenu.contexts.contains('all'))) {
                let iii = {
                    id: new Date().getTime(), // TODO
                    label: submenu.title,
                    click() {
                        typeof submenu.onclick === 'function' && submenu.onclick();
                    }
                };
                if (submenu.children) {
                    let ret = dealChildren(submenu.children);
                    iii.submenu = ret;
                }
                arr.push(iii);
            }

        });
        return arr;
    }

    if (menu.contexts && (menu.contexts.contains(curContext) || menu.contexts.contains('all'))) {
        let item = {
            id: menu.id,
            label: menu.title,
            click() {
                typeof menu.onclick === 'function' && menu.onclick();
            }
        };
        if (menu.children) {
            let c = dealChildren(menu.children);
            item.submenu = c;
        }

        return item;
    }
    return null;
}


$(document).on('keydown', function (e) {
    if (e.ctrlKey) {
        switch (e.keyCode) {
            case 9: // tab
                tab.next();
                return false;
            case 70: // f
                $('#find-box').show();
                $('#find-input')[0].select();
                return false;
            case 73: // i
                let wv = document.getElementById('webview-' + curTabId);
                wv.openDevTools({mode: 'right'})
                //webContents.openDevTools({mode: 'detach'});
                return false;
            case 81: // q
                ipcRenderer.send('win-reload');
                return false;
            case 82: // r
                let webview = document.getElementById('webview-' + curTabId);
                webview.reload();
                return false;
            case 87: // w
                tab.close(curTabId);
                return false;
            case 187: // +
                zoomIn();
                return false;
            case 189: // -
                zoomOut();
                return false;
        }
    }
});

function dealUrl(url) {
    // TODO
    if (url.startWith('app://')) {
        let appName = url.substring(6);
        url =  'file:///' + path.resolve(system.getAppPath(), `app/${appName}/index.html`);
    }

    return url;
}

function setInputUrl(url) {
    if (url === mm.newtab) {
        $('#url-input').val('');
    } else {
        $('#url-input').val(url);
    }
}

function loadUrl(url) {
    url = dealUrl(url);

    let webview = document.getElementById('webview-' + curTabId);
    webview.loadURL(url);

    browser.loadUrl(url);
}

$('#url-input').on('focus', function (e) {
    this.select();
});

(function () {
    let $linkUrl = $('#link-url');
    $(document).on('mouseover', 'a', function () {
        $linkUrl.text(this.href);
        $linkUrl.fadeIn();
    });

    $(document).on('mouseout', 'a', function () {
        $linkUrl.fadeOut();
    });
})();


$('#url-input').on('keydown', function (e) {
    if (e.keyCode == 13) {
        if (this.value.startWith('http') || this.value.startWith('file://')
            || this.value.startWith('chrome://') || this.value.startWith('chrome-extension://')) {
            let url = this.value;
            loadUrl(url);
        } else {
            // if the keyword is  file path
            if (/^\w:/.test(this.value)) {
            /*if (this.value.startWith('C:') || this.value.startWith('D:')
                || this.value.startWith('E:') || this.value.startWith('F:')) {*/
                let ext = fileUtil.getExt(this.value);
                if (!ext) {
                    // TODO
                    let url = 'file:///G:/install/apache2.4/htdocs/yunser/tool/note/app/app/files/index.html'
                        + '?path=' + this.value;
                    window.open(url);
                } else {
                    console.log('unkne', this.value, ext);
                }
                /*if (fs.existsSync(keyword)) {

                 } */
            } else if (this.value.startWith('app://')) {
                let appName = this.value.substring(6);
                let url =  'file:///' + path.resolve(system.getAppPath(), `app/${appName}/index.html`);
                loadUrl(url);
                //
            } else if (this.value.contains('.')) { // TODO
                    let url = 'http://' + this.value;
                    loadUrl(url);
            } else {
                let url = system.getSearchUrl(this.value);
                window.open(url);
            }


        }

    }
});

$('#forward').on('click', function (e) {
    e.preventDefault();
    if ($(this).hasClass('disabled')) {
        return;
    }

    let webview = document.getElementById('webview-' + curTabId);
    if (webview.canGoForward()) {
        webview.goForward();
        setTimeout(function () {
            updateCurTab(webview.getURL());
        }, 1000);
    }
});
$('#back').on('click', function (e) {
    e.preventDefault();
    if ($(this).hasClass('disabled')) {
        return;
    }

    let webview = document.getElementById('webview-' + curTabId);
    if (webview.canGoBack()) {
        webview.goBack();
        setTimeout(function () {
            updateCurTab(webview.getURL());
        }, 1000);
    }
});
$('#reload').on('click', function (e) {
    e.preventDefault();
    if ($(this).hasClass('disabled')) {
        return;
    }

    let webview = document.getElementById('webview-' + curTabId);
    webview.reload();
});

let tab = new TabEx('#tabs', {
    //monitor: '.topbar',
    // close callback
    onClose: function (id, newId) {
        curTabId = newId;
        tabNum--;

        if (tabNum === 0) {
            ipcRenderer.send('win-close');
        }

        browser.active(newId);
        browser.remove(id);
    }
});

var iddd = 123;
function getIdd() {
    return iddd++;
}

function addTab(url, ext) {
    url = dealUrl(url);
    
    var id = getIdd();

    setInputUrl(url);

    curTabId = '' + id;
    tabNum += 1;

    let prevTab = getActiveTab();
    if (prevTab) {
        prevTab.active = false;
    }

    browser.addTab(id, url);

    tab.add({
        id: id,
        title: '新标签页',
        content: `
        <div class="webview-box">
              <webview id="webview-${id}" class="webview" autosize="on"  src="${url}" style="height: 100%" nodeintegration preload="./chrome/preload/preload.js"></webview>
        </div>`,
    });

    initWebview(document.getElementById('webview-' + id), id, ext);

    $('#url-input')[0].focus();

    return id;
}


function addTab2(url, ext) {

    // TODO 改进
    var id = getIdd();
    let $div = $(`<div id="${id}"></div>`);
    $(document.body).append($div);
    $div.dialog({
        shade: 0.01,
        shadeClose: true
    });
    $div.html(`
     <webview id="webview-${id}" class="webview" autosize="on" src="${url}" style="height: 100%" nodeintegration preload="./preload.js"></webview>
     `)
    let popup = document.getElementById('webview-' + id);
    popup.addEventListener('did-fail-load', (e) => {
        console.log('失败了')
    });

    url = dealUrl(url);

    //popup.loadURL(url);

    setInputUrl(url);

    curTabId = id;
    tabNum += 1;

    let prevTab = getActiveTab();
    if (prevTab) {
        prevTab.active = false;
    }


    let nodeintegration = (url.startWith('chrome-extension://') || url.startWith('file://')) ? ' nodeintegration' : '';
    nodeintegration = 'nodeintegration';

    if (ext) {

    }
    let preload = './chrome/preload/preload.js';

    /*tab.add({
        id: id,
        title: '新标签页',
        content: `
        <div class="webview-box">
              <webview id="webview-${id}" class="webview" autosize="on"  src="${url}" style="height: 100%" ${nodeintegration} preload="${preload}"></webview>
        </div>`,
    });*/

    initWebview2(document.getElementById('webview-' + id), id, ext);

    return id;
}

$('#add-tab').on('click', function () {
    addTab(mm.newtab);
});

ipcRenderer.on('new-window', function(event, message) {
    addTab(message);
});

ipcRenderer.on('opp-main', function(event, message) {
    if (message.type === 'launchApp') {
        console.info(message.id)
        console.info(remoteGlobal.exts)
        for (let i = 0; i < remoteGlobal.exts.length; i++) {
            if (remoteGlobal.exts[i].id === message.id) {
                let ext = remoteGlobal.exts[i];
                if (ext.app && ext.app.launch) {
                    if (ext.app.launch.local_path) {
                        let popupPgaeUrl = 'chrome-extension://' + ext.id + '/' + ext.app.launch.local_path;
                        addTab(popupPgaeUrl, ext);
                    } else if (ext.app.launch.web_url) {
                        addTab(ext.app.launch.web_url, ext);
                    }


                }
                break;
            }
        }
    }
});


ipcRenderer.on('debug', function(event, message) {
    console.info(message);
    //message[0].apply(console, message[1]);
    //addTab(message);
});

ipcRenderer.on('will-navigate', function(event, message) {
    loadUrl(message);
});

ipcRenderer.on('leave-full-screen', function(event, message) {
    $('#tab-nav').show();
    $('#layout-header').show();
    $('#tab-tool').show();
    $('#tab-content').css('top', '110px');
});

ipcRenderer.on('enter-full-screen', function(event, message) {
    $('#tab-nav').hide();
    $('#layout-header').hide();
    $('#tab-tool').hide();
    $('#tab-content').css('top', '0');
});

var id = addTab(mm.newtab); // TODO extension may not load

$(document).on('shown.ui.tab', 'a[data-toggle="tab"]', function (e) {

    // 获取已激活的标签页的名称
    var activeTab = $(e.target).text();
    var id = e.target.parentNode.getAttribute('data-id');

    let prevTab = getActiveTab();
    prevTab.active = false;

    curTabId = id;
    let curTab = getTab(curTabId);
    curTab.active = true;
    setInputUrl(curTab.url);
    updateNavIcon();
    remoteGlobal.tabs = globalTabs;

    // 获取前一个激活的标签页的名称
    var previousTab = $(e.relatedTarget).text();
    $(".active-tab span").html(activeTab);
    $(".previous-tab span").html(previousTab);
});

function updateNavIcon() {
    var webview = document.getElementById('webview-' + curTabId);
    if (webview.canGoBack()) {
        $('#back').removeClass('disabled');
    } else {
        $('#back').addClass('disabled');
    }

    if (webview.canGoForward()) {
        $('#forward').removeClass('disabled');
    } else {
        $('#forward').addClass('disabled');
    }
}

let curScale = 1;
let scales = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5];

function zoomIn() {
    for (let i = 0; i < scales.length; i++) {
        if (scales[i] === curScale && i !== scales.length - 1) {
            curScale = scales[i + 1];
            let curWebview = document.getElementById('webview-' + curTabId);
            curWebview.setZoomFactor(curScale);
            ui.msg(Math.floor(curScale * 100) + '%');
            return;
        }
    }
}

function zoomOut() {
    for (let i = scales.length - 1; i >= 0; i--) {
        if (scales[i] === curScale && i !== 0) {
            curScale = scales[i - 1];
            let curWebview = document.getElementById('webview-' + curTabId);
            curWebview.setZoomFactor(curScale);
            ui.msg(Math.floor(curScale * 100) + '%');
            return;
        }
    }
}

/*$(document).on('mousewheel', function (e, delta) {
    if (e.ctrlKey) {

        if (delta > 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    }
});*/


$(document).on('click', function (e, delta) {
    // TODO there is a bug in electron when user click a webview element, this code wouldn't be run
    console.log('click');
});








// ajax test
/*
$.ajax({
    url: '123.json',
    type: 'GET',
    dataType: 'html',
    success: function (data) {
        alert(data);
    },
    error(a, b, c) {
        console.log('error', a, b, c)
    }
})*/
/*$.ajax({
    url:"123.json",
    dataType: 'html',
    success:function(result){
        $("#div1").html(result);
    },
    error(a, b, c) {
        console.log('error', a, b, c)
    }
});
 */

/*
插件名称
 选项
从Chrome中移除
从 Chrome 菜单中隐藏
管理拓展程序

* */

$('#ext-list').contextmenu({
    item: '.ext-item',
    content: '#extension-menu'
});
/*$(document).contextmenu({
    content: '#extension-menu'
});*/
$('#ext-list').on('click', '[data-ext]', function (e) {
    e.preventDefault();
    let extId = $(this).attr('data-ext');
    let ext = getExtensionById(extId);

    if (ext.app && ext.app.launch && ext.app.launch.local_path) {
        let popupPgaeUrl = 'chrome-extension://' + extId + '/' + ext.app.launch.local_path;

        addTab2(popupPgaeUrl, ext);
    } else {
        let popupPgaeUrl = 'chrome-extension://' + extId + '/' + ext.browser_action.default_popup;

        addTab2(popupPgaeUrl, ext);
    }
});


initHeader();

function initHeader() {
    // find in page
    let findId;
    $('#find-input').on('input', function () {
        let curWebview = document.getElementById('webview-' + curTabId);
        if (this.value) {
            findId = curWebview.getWebContents().findInPage(this.value);
        } else {
            curWebview.getWebContents().stopFindInPage('clearSelection');
        }
    });
    $('#find-close').on('click', function (e) {
        e.preventDefault();
        $('#find-box').hide();
    });
    $('#find-prev').on('click', function (e) {
        e.preventDefault();
        let curWebview = document.getElementById('webview-' + curTabId);
        findId = curWebview.getWebContents().findInPage($('#find-input').val(), {
            forward: false,
            //findNext: true
        });
    });
    $('#find-next').on('click', function (e) {
        e.preventDefault();
        let curWebview = document.getElementById('webview-' + curTabId);
        findId = curWebview.getWebContents().findInPage($('#find-input').val(), {
            findNext: true
        });
    });
    $('#find-close').on('click', function (e) {
        e.preventDefault();
        $('#find-box').hide();
    });

    // collection
    let bookmark = [
        {
            text: 'Apps',
            url: 'chrome://apps'
        },
        {
            text: 'extensions',
            url: 'chrome://extensions'
        },
        {
            text: 'Baidu',
            url: 'http://www.baidu.com'
        },
        {
            text: 'chat',
            url: 'app://chat'
        },
        {
            text: 'Mail',
            url: 'app://mail'
        },
        {
            text: 'Collections',
            url: 'app://apps'
        },
        {
            text: 'Markdown Editor',
            url: 'app://markdown'
        },
        {
            text: 'File Manager',
            url: 'app://files'
        },
        {
            text: 'App Store',
            url: 'app://store'
        },
        {
            text: 'Desktop',
            url: 'app://desktop'
        },
        {
            text: 'Baidu',
            url: 'http://www.baidu.com'
        },
        {
            text: 'Search',
            url: 'app://search'
        },
        {
            text: 'Photos',
            url: 'app://photos'
        },
        {
            text: 'Guide',
            url: 'app://guide'
        },
        {
            text: 'Music',
            url: 'app://music'
        },
        {
            text: 'Downloads',
            url: 'app://downloads'
        },
        {
            text: 'Cnlendar',
            url: 'app://calendar',
        },
        {
            text: 'Editor',
            url: 'app://editor'
        },
        {
            text: 'download file',
            url: 'http://sw.bos.baidu.com/sw-search-sp/software/0b57a709db50a/Baidu_Setup_4384_3.1.0.2950_10000001.exe'
        },
        {
            text: 'Todo',
            url: 'app://todo'
        },
        {
            text: 'Reader',
            url: 'app://reader',
        }
    ];
    let html = [];
    bookmark.forEach((item) => {
        html.push(`<a href="${item.url}">${item.text}</a>`);
    });
    $('#collection').html(html.join(''));

    // topbar
    $('#win-min').on('click', function (e) {
        e.preventDefault();
        ipcRenderer.send('win-min');
    });
    $('#win-max').on('click', function (e) {
        e.preventDefault();
        ipcRenderer.send('win-max');
    });
    $('#win-close').on('click', function (e) {
        e.preventDefault();
        ipcRenderer.send('win-close');
    });
}