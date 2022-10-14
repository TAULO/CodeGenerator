browser.tabs.onActivated.addListener(activeInfo => {

    browser.tabs.get(activeInfo.tabId, (tab) => {

        if (typeof tab.id == "undefined") {
            return;
        }

        if (tab.status !== "complete") {
            return;
        }

        extension.shouldReload(tab).then(async doReload => {

            if (doReload === false) {
                return;
            }

            const settings = await getSettings();

            extension.updateTabData(tab.id);
            browser.tabs.reload(tab.id, {
                bypassCache: settings.refreshOnReload
            });
        });
    });
});

browser.tabs.onActivated.addListener(activeInfo => {

    browser.tabs.get(activeInfo.tabId, tab => {

        extension.updateIcon(tab);
    });
});

browser.tabs.onCreated.addListener(tab => {

    if (typeof tab.id == "undefined") {
        return;
    }

    extension.updateTabData(tab.id);
});

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {

    if (typeof changeInfo.url == "undefined") {
        return;
    }

    extension.updateTabData(tabId);
});

browser.tabs.onUpdated.addListener(tabId => {

    browser.tabs.get(tabId, tab => {

        extension.updateIcon(tab);
    });
});

browser.tabs.onRemoved.addListener(tabId => {

    extension.removeTabData(tabId);
});

browser.browserAction.onClicked.addListener(tab => {

    if (typeof tab.url == "undefined") {
        return;
    }

    extension.toggleDisable(tab);
});
