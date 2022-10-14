const ExtensionMessageBus = (function() {
    const listeners = {};

    const tabQueryRedirects = {};

    function redirectKeyForQuery(tabQuery) {
        return JSON.stringify(tabQuery);
    }

    const pendingSends = {};

    function trigger(request, sender) {
        $(listeners).trigger(request.method, {
            invocationId: request.invocationId,
            payload: request.payload,
            sender: {
                id: sender.tab.id,
                url: sender.tab.url,
                canonicalUrl: request.canonicalUrl
            }
        });
    }

    // This function exists only because `chrome.tabs`' query APIs are asynchronous.
    function sendToTabs(method, payload, tabs, tabQuery, options) {
        // Send the message if the query yielded results.
        if (tabs && tabs.length) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, {
                    method,
                    payload,
                });
            });

            // If the query yielded a single tab and the sender specified to activate the tab, do so.
            if ((tabs.length === 1) && options.activateAfterSending) {
                chrome.tabs.update(tabs[0].id, {
                    active: true
                });
            }
        } else if (tabQuery.canonicalUrl || tabQuery.url) {
            // If no tabs were found, open a tab for the query. We'll resend the message when the tab's
            // listeners are ready.
            const redirectKey = redirectKeyForQuery(tabQuery);

            // It's possible that a tab has already been opened, since this function is executed
            // asynchronously after `send`.
            let redirectedQuery = tabQueryRedirects[redirectKey];
            if (redirectedQuery) {
                const pendingSendsForTab = pendingSends[redirectedQuery.id];
                if (pendingSendsForTab) {
                    pendingSendsForTab.push([method, payload, redirectedQuery]);
                } else {
                    // The pending sends have already been cleared. Try re-sending.
                    send(method, payload, redirectedQuery, options);
                }
                return;
            }

            chrome.tabs.create({
                url: tabQuery.canonicalUrl || tabQuery.url
            }, function(tab) {
                redirectedQuery = {
                    id: tab.id,
                    // Include the URL/canonical URL in the redirect so that if this _new_ tab is closed
                    // we'll be able to redirect again.
                    url: tabQuery.url,
                    canonicalUrl: tabQuery.canonicalUrl
                };
                tabQueryRedirects[redirectKey] = redirectedQuery;
                const pendingSendsForTab = pendingSends[redirectedQuery.id] = [];
                pendingSendsForTab.push([method, payload, redirectedQuery]);
            });
        }
    }

    function send(method, payload, tabQuery, options) {
        tabQuery = tabQuery || {};
        options = _.defaults({}, options, {
            activateAfterSending: false
        });

        let redirectedQuery = tabQueryRedirects[redirectKeyForQuery(tabQuery)];
        if (redirectedQuery) {
            while (redirectedQuery) {
                tabQuery = redirectedQuery;
                redirectedQuery = tabQueryRedirects[redirectKeyForQuery(tabQuery)];
            }
            const pendingSendsForTab = pendingSends[tabQuery.id];
            if (pendingSendsForTab) {
                // Resend when the tab's listeners are ready.
                pendingSendsForTab.push([method, payload, tabQuery]);
                return;
            }
            // Otherwise, the tab's ready; let the message send.
        }

        if (tabQuery.id) {
            chrome.tabs.get(tabQuery.id, function(tab) {
                if (chrome.runtime.lastError) {
                    // If no tab is found with the specified ID, `lastError` will be set and we need to check
                    // it or Chrome will complain. But, we don't consider this an error since we expect that
                    // the tab might have been closed.
                }
                sendToTabs(method, payload, tab && [tab], tabQuery, options);
            });
        } else {
            chrome.tabs.query({
                url: tabQuery.url,
                active: tabQuery.active
            }, function(tabs) {
                if (!_.isUndefined(tabQuery.notId)) {
                    tabs = _.reject(tabs, function(tab) {
                        return tab.id === tabQuery.notId;
                    });
                }
                sendToTabs(method, payload, tabs, tabQuery, options);
            });
        }
    }

    function on(method, callback) {
        $(listeners).on(method, function(evt, context) {
            if (context.invocationId) {
                callback(context.payload, context.sender, function(response) {
                    send('_IN_REPLY_TO_' + context.invocationId, response);
                });
                delete context.invocationId; // Only one response can be sent.
            } else {
                callback(context.payload, context.sender);
            }
        });
    }

    // When tab listeners become ready, flush pending message sends.
    on('listenerReady', function(method, sender) {
        let pendingSendsForTab = pendingSends[sender.id];
        if (pendingSendsForTab) {
            const completedSends = [];
            pendingSendsForTab.forEach(function(sendArguments) {
                if (sendArguments[0] === method) {
                    send.apply(null, sendArguments);
                    completedSends.push(sendArguments);
                }
            });
            // Filter the completed sends from the pending sends.
            pendingSendsForTab = pendingSendsForTab.filter(function(sendArguments) {
                return completedSends.indexOf(sendArguments) === -1;
            });
            if (pendingSendsForTab.length) {
                pendingSends[sender.id] = pendingSendsForTab;
            } else {
                delete pendingSends[sender.id];
            }
        }

    });

    return {
        send,

        on,

        trigger,
    };
})();

function bundleError(err) {
    const errObj = typeof err === 'string' ? new Error(err) : err;

    return {
        message: errObj.message,
        name: errObj.name,
        // Gather all the own properties here for easier reconstruction on the other side.
        props: Object.assign({
            stack: errObj.stack,
        }, errObj),
    };
}

// XHR properties useful to include when returning XHR errors
const XHR_ERROR_PROPS = [
    'readyState',
    'responseText',
    'responseType',
    'responseURL',
    'status',
    'statusText'
];

class XHRError extends Error {
    constructor(message, xhr) {
        super(message);
        for (const prop of XHR_ERROR_PROPS) {
            this[prop] = xhr[prop];
        }
    }
}

async function getBlobFromObjectURL(objectURL) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', objectURL, true);
    xhr.responseType = 'blob';

    return new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(new XHRError('Blob resolution got non-200 response code.', xhr));
            }
        });

        xhr.addEventListener('error', () => {
            reject(new XHRError('Blob resolution failed.', xhr));
        });

        xhr.send();
    });
}

const BLOB_PROTOCOL_PATTERN = /blob/i;

function isBlobURL(url) {
    return !!url && BLOB_PROTOCOL_PATTERN.test(new URL(url).protocol);
}


const ResponseCache = (function() {
    // Cache blobs by url so we can serve upload requests for the files they represent.
    // Entries are removed when their corresponding file has been successfully uploaded,
    // or 5 minutes after they've been added to the cache.
    const blobResponseCache = new Map();
    const RESPONSE_CACHE_TTL = 5 * 60 * 1000;

    function cacheBlobResponse(url, blob) {
        const blobURL = URL.createObjectURL(blob);
        blobResponseCache.set(url, {
            time: Date.now(),
            blobURL
        });
        return blobURL;
    }

    async function getCachedBlobResponse(url) {
        const response = blobResponseCache.get(url);
        if (!response) return null;
        return fetch(response.blobURL).then((resp) => resp.blob());
    }

    function removeCachedBlobResponse(url) {
        const response = blobResponseCache.get(url);
        if (response && response.blobURL) URL.revokeObjectURL(response.blobURL);
        blobResponseCache.delete(url);
    }

    setInterval(() => {
        const threshold = Date.now() - RESPONSE_CACHE_TTL;
        for (const [url, response] of blobResponseCache) {
            if (response.time < threshold) {
                removeCachedBlobResponse(url);
            }
        }
    }, RESPONSE_CACHE_TTL);

    // Public interface
    return {
        cacheBlobResponse,
        getCachedBlobResponse,
        removeCachedBlobResponse,
    };

})();

// TODO(Tucker): flow wya https://mixmaxhq.atlassian.net/browse/MX-7178

function wrapAsyncMessageHandler(handler, willSendResponse) {
    return function(request, messageSender, sendMessage) {
        handler(request, messageSender, sendMessage);
        return willSendResponse;
    };
}

const UploaderProxy = (function() {
    class FileNotFoundError extends Error {
        constructor(fileRef, message = 'Referenced file not found') {
            super(message);
            this.file = fileRef;
        }
    }

    const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/mixmax/upload';

    const throttledCredentialsGet = _.throttle(async ({
        credentials,
        region
    }) => {
        AWS.config.update({
            region
        });
        return credentials.getPromise();
    }, 500, {
        trailing: false
    }); // To avoid the function being called multiple times in the wait period.

    async function uploadFileToS3({
        bucketParams,
        uploadParams,
        uploadOptions,
        refetchCredentials
    }) {
        const bucket = await loadAttachmentsBucket(bucketParams, refetchCredentials);
        const upload = bucket.upload(uploadParams, uploadOptions);
        return upload.promise();
    }

    async function loadAttachmentsBucket(bucketParams, refetchCredentials) {
        const hydratedBucketParams = {
            ..._.omit(bucketParams, 'credentialsParams'),
            credentials: new AWS.CognitoIdentityCredentials(bucketParams.credentialsParams)
        };
        if (refetchCredentials) {
            await throttledCredentialsGet(hydratedBucketParams);
        }
        return new AWS.S3(hydratedBucketParams);
    }

    async function getFile(fileRef) {
        if (!fileRef.url && !fileRef.objectURL) {
            throw new FileNotFoundError(fileRef);
        }

        let blob;
        // Check if we have a cached blob for the url first
        if (fileRef.url) {
            blob = await ResponseCache.getCachedBlobResponse(fileRef.url);
        }

        // If a url wasn't provided or wasn't found in the cache, try the objectURL
        if (!blob && fileRef.objectURL) {
            blob = await getBlobFromObjectURL(fileRef.objectURL);
        }

        if (!blob) {
            throw new FileNotFoundError(fileRef);
        } else if (!blob.size) {
            // Successfully fetching an empty blob is especially erroneous, add a custom error message
            throw new FileNotFoundError(fileRef, 'Fetched empty blob');
        }
        return new File([blob], fileRef.name);
    }

    async function handleUploadFileToS3(request, messageSender, sendResponse) {
        try {
            const {
                config
            } = request;
            const file = await getFile(config.fileRef);
            if (!file) {
                return sendResponse({
                    success: false,
                    payload: bundleError(new FileNotFoundError(config.fileRef))
                });
            }

            config.uploadParams.Body = file;
            const result = await uploadFileToS3(config);
            sendResponse({
                success: true,
                payload: result
            });
            // We only remove the cached response upon successful upload to allow retries from extension-source.
            ResponseCache.removeCachedBlobResponse(config.fileRef.url);
        } catch (err) {
            sendResponse({
                success: false,
                payload: bundleError(err)
            });
        }
    }

    function uploadToCloudinary({
        file,
        folder,
        uploadPreset
    }, sendUpdate) {
        const fd = new FormData();
        fd.append('upload_preset', uploadPreset);
        fd.append('folder', folder);
        fd.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', CLOUDINARY_UPLOAD_URL, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.upload.addEventListener('progress', (e) => {
            const percentage = e.lengthComputable ? Math.round((e.loaded * 100.0) / e.total) : 0;
            sendUpdate({
                percentage
            });
        });

        xhr.addEventListener('load', () => {
            const response = JSON.parse(xhr.responseText);
            sendUpdate({
                success: true,
                payload: response
            });
        });

        xhr.addEventListener('error', () => {
            sendUpdate({
                success: false,
                payload: bundleError('Error uploading to cloudinary')
            });
        });

        xhr.send(fd);
    }

    async function handleUploadToCloudinary(config, sendUpdate) {
        try {
            const file = await getFile(config.fileRef);
            if (!file) {
                return sendUpdate({
                    success: false,
                    payload: bundleError(new FileNotFoundError(config.fileRef))
                });
            }

            uploadToCloudinary({
                file,
                folder: config.folder,
                uploadPreset: config.uploadPreset
            }, sendUpdate);
        } catch (err) {
            sendUpdate({
                success: false,
                payload: bundleError(err)
            });
        }
    }

    function handlePortConnect(port) {
        port.onMessage.addListener(({
            config,
            method,
            id
        }) => {
            const sendUpdate = ({
                success,
                percentage,
                payload
            }) => {
                port.postMessage({
                    id,
                    success,
                    percentage,
                    payload
                });
            };

            if (method !== 'uploadToCloudinary') {
                sendUpdate({
                    success: false,
                    payload: bundleError(new TypeError(`invalid method ${method}`))
                });
                return;
            }

            handleUploadToCloudinary(config, sendUpdate);
        });
    }

    // Public interface
    return {
        handleUploadFileToS3: wrapAsyncMessageHandler(handleUploadFileToS3, true),
        handlePortConnect,
    };
})();

var DEFAULT_SIDEBAR_MODE = 'window';

var SIDEBAR_WINDOW_WIDTH = 300;

var doubleClickTimer;

var wasDoubleClick;

chrome.browserAction.onClicked.addListener(function(tab) {
    if (doubleClickTimer) {
        wasDoubleClick = true;
        return;
    }

    doubleClickTimer = setTimeout(function() {
        chrome.windows.get(tab.windowId, function(win) {
            chrome.storage.local.get(null, function(storage) {
                // Determine the email address of the user (if there is one).
                var email = _getUserEmail(storage);

                // Keep the original behaviour of opening the compose window for now
                // and open the sidebar everywhere on double click.
                if (wasDoubleClick) {
                    var mode = _getSidebarModeForUser(email, storage);
                    _openSidebar(mode, win, tab);
                } else {
                    openComposeWindow(win, tab, storage);
                }

                wasDoubleClick = false;
                doubleClickTimer = null;
            });
        });
    }, 250);
});

function _openSidebar(mode, win, tab) {
    if (mode === 'window' && win.state !== 'fullscreen') {
        _openSidebarInWindowMode(win);
    } else {
        _openSidebarInFrameMode(tab);
    }
}

function _getSidebarModeForUser(email, storage) {
    // Grab the cached user preferences from storage.
    if (!email) return DEFAULT_SIDEBAR_MODE;
    var preferences = storage['cachedUserPrefs_' + email + '_' + Environment.get()];

    if (preferences) {
        try {
            preferences = JSON.parse(preferences);
        } catch (e) {}
    }

    // Return the preferred sidebar mode if present, otherwise fall back to the default.
    return (preferences && preferences.sidebarMode) || DEFAULT_SIDEBAR_MODE;
}

function _updateMainWindow(sidebarLeft, win) {
    // Shrink the window to fit the sidebar
    let windowNewLeft = win.left;
    let windowNewWidth = sidebarLeft - win.left;

    if (win.width < SIDEBAR_WINDOW_WIDTH) {
        // If the current window is so small that it can't be shrunk
        // to fit the sidebar move it to left to make space for the sidebar
        windowNewLeft = win.left - SIDEBAR_WINDOW_WIDTH;
        windowNewWidth = win.width;
    }

    chrome.windows.update(win.id, {
        left: windowNewLeft,
        width: windowNewWidth
    });
}

function _openSidebarInWindowMode(win) {
    // Figure out the positioning. Is there enough room for the sidebar to the right of the window?
    var sidebarLeft;
    var windowCurrentRight = win.left + win.width;

    // If the windowCurrentRight is larger than the screen.availWidth,
    // we are clearly on the second monitor and the math below won't work.
    const onSecondMonitor = windowCurrentRight > screen.availWidth;
    if (onSecondMonitor) {
        // We don't know the size of the second monitor so just
        // just move current window to fit the sidebar everywhere.
        // This fixes https://mixmaxhq.atlassian.net/browse/MX-1976
        sidebarLeft = windowCurrentRight - SIDEBAR_WINDOW_WIDTH;
        _updateMainWindow(sidebarLeft, win);
    } else if (screen.availWidth - windowCurrentRight >= SIDEBAR_WINDOW_WIDTH) {
        // Yep, there's enough space. We can position the sidebar to the right of the window.
        sidebarLeft = windowCurrentRight;
    } else {
        sidebarLeft = screen.availWidth - SIDEBAR_WINDOW_WIDTH;
        _updateMainWindow(sidebarLeft, win);
    }

    // Check for/fetch the existing sidebar window.
    _getSingletonSidebarWindow(function(existingSidebarWindow) {
        // Setup the common sidebar properties (dimensions and positioning).
        var sidebarProps = {
            width: SIDEBAR_WINDOW_WIDTH,
            height: win.height,
            top: win.top,
            left: sidebarLeft
        };

        if (existingSidebarWindow) {
            sidebarProps.state = 'normal';
            sidebarProps.focused = true; // Give it focus.
            chrome.windows.update(existingSidebarWindow.id, sidebarProps);
        } else {
            // There's no current sidebar window open. Open one now.
            sidebarProps.url = _getSidebarUrl();
            sidebarProps.focused = false;
            sidebarProps.type = 'popup';
            chrome.windows.create(sidebarProps);
            chrome.windows.update(win.id, {
                focused: true
            }); // Ensure the original window has focus.
        }
    });
}

function _openSidebarInFrameMode(tab) {
    ExtensionMessageBus.send('openSidebarInFrame', {}, {
        id: tab.id
    });
}

function _getSingletonSidebarWindow(callback) {
    chrome.windows.getAll({
        populate: true,
        windowTypes: ['popup']
    }, function(wins) {
        for (var i = 0; i < wins.length; i++) {
            var win = wins[i];
            var tab = win.tabs[0]; // There's always exactly one tab because type is 'popup'.
            if (tab.url === _getSidebarUrl()) {
                callback(win);
                return;
            }
        }
        callback(null);
    });
}

function _getSidebarUrl() {
    return Environment.getScriptBaseUrl() + '/public/sidebar-anywhere/index.html?mode=window';
}

function openComposeWindow(win, tab, storage, params) {
    var onboardedAccounts = getOnboardedAccounts(storage);
    if (onboardedAccounts.length === 0) {
        // The user hasn't onboarded yet. Just bring up Gmail.
        return refreshBrowser('gmail-inbox', true);
    }

    // Determine the email address of the user from storage.
    var userEmail = _getUserEmail(storage);

    // Generate a message id and URL.
    var messageId = generateMessageId();
    var url = Environment.getComposeUrl() + '/message/' + messageId + '?user=' + encodeURIComponent(userEmail);

    // Only show the accounts bar if there's more than one account to choose from.
    if (onboardedAccounts.length > 1) {
        url += '&showAccounts=true';
    }

    if (!_.isEmpty(params)) {
        url += '&' + $.param(params).replace(/\+/g, '%20');
    }

    if (win.state === 'fullscreen') {
        // If the source window is in fullscreen mode, create a new tab.
        chrome.tabs.create({
            windowId: win.id,
            url,
            index: tab.index + 1 // Create this tab right after the source tab.
        });
    } else {
        var windowRightEdge = win.left + win.width;
        var windowTop = win.top;

        // Match Gmail compose mole width. The height is slightly taller as required by our menus.
        var width = 615;
        var height = 613;

        chrome.windows.create({
            url,
            width,
            height,
            top: windowTop + 70,
            left: windowRightEdge - width - 20,
            type: 'popup'
        });
    }
}

function _getUserEmail(storage) {
    var onboardedAccounts = getOnboardedAccounts(storage);
    return onboardedAccounts.length === 0 ? null : (_preferredOnboardedAccount(storage) || onboardedAccounts[0]);
}

function _preferredOnboardedAccount(storage) {
    var preferred = storage['account_last_used_in_popup_' + Environment.get()];
    if (!preferred) return;

    // It must have been onboarded.
    var hasBeenOnboarded = storage['onboarded_' + preferred + '_' + Environment.get()];
    if (!hasBeenOnboarded) return;

    return preferred;
}

function getOnboardedAccounts(storage) {
    var onboardedAccounts = [];

    Object.keys(storage).some(function(key) {
        var matches = key.match(new RegExp('^onboarded_(.+)_' + Environment.get() + '$'));
        if (matches && storage[key]) onboardedAccounts.push(matches[1]);
    });

    return onboardedAccounts;
}

ExtensionMessageBus.on('sidebarLoaded', function(payload, sender, callback) {
    chrome.tabs.query({
        active: true,
        windowType: 'normal'
    }, function(tabs) {
        var tab = tabs[0]; // Just grab the active tab of the first normal window.
        if (tab) ExtensionMessageBus.send('sidebarLoaded', payload, {
            id: tab.id
        });
        if (callback) callback();
    });
});

ExtensionMessageBus.on('contactSelected', function(payload, sender, callback) {
    _getSingletonSidebarWindow(function(win) {
        if (win) ExtensionMessageBus.send('contactSelected', payload, {
            id: win.tabs[0].id
        });
        ExtensionMessageBus.send('contactSelected', payload, {
            id: sender.id
        });
        if (callback) callback();
    });
});

ExtensionMessageBus.on('closeSidebar', function(payload, sender) {
    ExtensionMessageBus.send('closeSidebar', payload, {
        id: sender.id
    });
});

chrome.tabs.onActivated.addListener(function(changeInfo) {
    ExtensionMessageBus.send('tabChanged', changeInfo, {
        id: changeInfo.tabId
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    ExtensionMessageBus.send('tabUpdated', changeInfo, {
        id: tab.id
    });
});

const FetchProxy = (function() {

    // Properties of the Response object we want to send back to the content script.
    const RESPONSE_PROPERTIES_WHITELIST = [
        'ok',
        'redirected',
        'status',
        'statusText',
        'type',
        'url',
        'headers',
    ];

    // Property name the text of the body that we send with our response to the content script.
    const BODY_PROP = '_body';

    async function getBodyAsType(response, type) {
        try {
            const payload = await response[type]();
            return {
                success: true,
                payload
            };
        } catch (err) {
            // If theres an error when processing the body, let the client decide what to do at the call
            // site.
            return {
                success: false,
                payload: bundleError(err)
            };
        }
    }

    const abortControllers = new Map();

    async function fetchWithTimeout(url, options) {
        if (!options.timeout && !options.signalId) {
            return doFetch(url, options);
        }

        if (options.timeout && (typeof options.timeout !== 'number' || options.timeout <= 0)) {
            throw new TypeError('timeout provided was not a positive number');
        }

        const controller = new AbortController();
        let abortTimer;
        if (options.timeout) {
            abortTimer = setTimeout(() => controller.abort(), options.timeout);
        }

        if (options.signalId) {
            abortControllers.set(options.signalId, controller);
        }

        try {
            const init = {
                ...options,
                // For timeout.
                signal: controller.signal,
            };
            delete init.timeout;
            delete init.signalId;

            return await doFetch(url, init);
        } finally {
            if (abortTimer) clearTimeout(abortTimer);
            if (options.signalId) abortControllers.delete(options.signalId);
        }
    }

    async function doFetch(url, options) {
        if (isBlobURL(url)) {
            const blob = await getBlobFromObjectURL(url);
            return new Response(blob);
        }

        return fetch(url, options);
    }

    function serializeHeaders(headers) {
        // Safety belts
        if (!headers || !(headers instanceof Headers)) return {};

        const headersObj = {};
        for (const [name, value] of headers) {
            headersObj[name] = value;
        }
        return headersObj;
    }

    async function handleFetch(request, messageSender, sendResponse) {
        try {
            const {
                url,
                options,
                responseFormat = 'raw'
            } = request;

            // Fetch the resource.
            const response = await fetchWithTimeout(url, options);

            // Pick only the properties that we care about and that can be sent via chrome.runtime
            const shimmedResponse = _.pick(response, RESPONSE_PROPERTIES_WHITELIST);
            shimmedResponse.headers = serializeHeaders(shimmedResponse.headers);

            // Get the body according to the `responseFormat` and attach it to the shimmed response.
            // The content script will parse the body text as necessary (e.g. as JSON) on the other side.
            const responseType = responseFormat === 'objectURL' ? 'blob' : 'text';
            const getBodyResult = await getBodyAsType(response, responseType);

            if (getBodyResult.success && responseFormat === 'objectURL') {
                // The response url can be empty if the request url was an ObjectURL. In that case,
                // use the request url for caching purposes.
                if (!shimmedResponse.url && isBlobURL(url)) shimmedResponse.url = url;

                const blob = getBodyResult.payload;
                // cache the blob for future usage and return an ObjectURL for use in content scripts
                const blobURL = ResponseCache.cacheBlobResponse(shimmedResponse.url, blob);
                shimmedResponse[BODY_PROP] = {
                    success: true,
                    payload: blobURL
                };
            } else {
                shimmedResponse[BODY_PROP] = getBodyResult;
            }

            sendResponse({
                success: true,
                payload: shimmedResponse
            });
        } catch (err) {
            sendResponse({
                success: false,
                payload: bundleError(err)
            });
        }
    }

    function handleAbortFetch(request, messageSender, sendResponse) {
        try {
            const {
                signalId
            } = request;
            const controller = abortControllers.get(signalId);

            if (!controller) {
                sendResponse({
                    success: false,
                    payload: bundleError('Fetch already completed or aborted')
                });
                return;
            }

            controller.abort();
            sendResponse({
                success: true
            });
        } catch (err) {
            sendResponse({
                success: false,
                payload: bundleError(err)
            });
        }
    }

    // Public interface
    return {
        handleFetch: wrapAsyncMessageHandler(handleFetch, true),
        handleAbortFetch
    };
})();

function generateMessageId() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
    var length = 17; // Not a requirement that it's 17 characters long, but that's what Random.id() uses.
    var buffer = new Uint16Array(length);
    // Don't use Math.random() since there's risk of collisions: http://devoluk.com/google-chrome-math-random-issue.html
    window.crypto.getRandomValues(buffer);
    var randomstring = '';
    for (var i = 0; i < buffer.length; i++) {
        randomstring += chars[buffer[i] % chars.length];
    }
    return randomstring;
}

(function() {

    function isValidSender(sender) {
        return !!sender.tab;
    }

    function stripParams(url) {
        try {
            const urlObj = new URL(url);
            return `${urlObj.origin}${urlObj.pathname}`;
        } catch (err) {
            // Ignore URL parsing errors.
            if (err instanceof TypeError) return null;
            throw err;
        }
    }

    function getSenderTags(sender) {
        return {
            senderUrl: sender && stripParams(sender.url),
            tabUrl: sender && sender.tab && stripParams(sender.tab.url),
        };
    }

    function logInvalidSender(sender, request) {
        error.captureMessage('Invalid message sender', {
            culprit: 'Received message from invalid sender',
            extra: {
                sender,
                request,
            },
            tags: getSenderTags(sender),
        });
    }

    function logInvalidMessage(method, sender, request) {
        error.captureMessage(`unexpected message ${method} from content script`, {
            culprit: 'Received unexpected message from content script',
            extra: {
                method,
                sender,
                request,
            },
            tags: getSenderTags(sender),
        });
    }

    function logUnknownMethod(method, sender, request) {
        error.captureMessage(`Unknown method ${method}`, {
            culprit: 'Received unknown request method from content script',
            extra: {
                method,
                sender,
                request,
            },
            tags: getSenderTags(sender),
        });
    }

    const salesforceDomainRegex = /(^|\.)(sales)?force\.com$/;
    const extensionURL = 'chrome-extension://ocpljaamllnldhepankaeljmeeeghnid';
    const gmailDomain = 'https://mail.google.com';

    function isSalesforceDomain(hostname) {
        if (!hostname) return false;
        if (salesforceDomainRegex.test(hostname)) return true;

        return false;
    }

    function isWhitelistedUrl(url) {
        const {
            protocol,
            origin,
            hostname
        } = new URL(url);

        if (origin === extensionURL) return true;

        // Note: this excludes our public homepage https://mixmax.com
        return /https/.test(protocol) && (
            origin === gmailDomain ||
            isSalesforceDomain(hostname) ||
            hostname.endsWith('.mixmax.com')
        );
    }

    // Whitelist of 'universal' methods that our content script should be able to invoke from
    // any context page.
    const UNIVERSAL_METHODS = new Set([
        'sidebarEnabled',
        'setStorage',
        'contactSelected',
        'sidebarLoaded',
        'closeSidebar',
        'listenerReady',
        'mailTo',
        'callTo',
    ]);

    function isUniversalMethod(method) {
        return UNIVERSAL_METHODS.has(method);
    }

    function handleExtensionMessageBusRequest(request, messageSender) {
        ExtensionMessageBus.trigger(request, messageSender);
        return false;
    }

    const MESSAGE_HANDLERS = new Map([
        ['fetchResource', FetchProxy.handleFetch.bind(FetchProxy)],
        ['abortFetch', FetchProxy.handleAbortFetch.bind(FetchProxy)],
        ['uploadFileToS3', UploaderProxy.handleUploadFileToS3.bind(UploaderProxy)],
        ['sidebarEnabled', handleExtensionMessageBusRequest],
        ['contactSelected', handleExtensionMessageBusRequest],
        ['sidebarLoaded', handleExtensionMessageBusRequest],
        ['closeSidebar', handleExtensionMessageBusRequest],
        ['postNotification', handleExtensionMessageBusRequest],
        ['ping', handleExtensionMessageBusRequest],
        ['refreshGmail', handleExtensionMessageBusRequest],
        ['refreshGmailOnly', handleExtensionMessageBusRequest],
        ['refreshSalesforce', handleExtensionMessageBusRequest],
        ['setStorage', handleExtensionMessageBusRequest],
        ['listenerReady', handleExtensionMessageBusRequest],
        ['mailTo', wrapAsyncMessageHandler(handleMailToRequest, false)],
        ['callTo', wrapAsyncMessageHandler(handleCallToRequest, false)],
    ]);

    function handleMessage(request, messageSender, sendResponse) {
        const {
            method
        } = request;
        if (!MESSAGE_HANDLERS.has(method)) {
            logUnknownMethod(method, messageSender, request);
            return false;
        }
        const handler = MESSAGE_HANDLERS.get(method);
        return handler(request, messageSender, sendResponse);
    }

    function listenForMessages() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            try {
                if (!isValidSender(sender)) {
                    logInvalidSender(sender, request);
                    return;
                }
                if (!isWhitelistedUrl(sender.tab.url) && !isUniversalMethod(request.method)) {
                    logInvalidMessage(request.method, sender, request);
                    return;
                }

                return handleMessage(request, sender, sendResponse);
            } catch (err) {
                error.captureException(err, {
                    culprit: 'Failure when handling message in background page'
                });
            }
        });
    }

    const CONNECTION_HANDLERS = new Map([
        ['mixmax_cloudinary_upload', UploaderProxy.handlePortConnect.bind(UploaderProxy)]
    ]);

    function isWhiteListedPortName(name) {
        return CONNECTION_HANDLERS.has(name);
    }

    function listenForConnections() {
        chrome.runtime.onConnect.addListener((port) => {
            try {
                const {
                    sender,
                    name: portName
                } = port;
                if (!isWhitelistedUrl(sender.tab.url) || !isWhiteListedPortName(portName)) {
                    logInvalidMessage(portName, sender, null);
                    return;
                }

                const handler = CONNECTION_HANDLERS.get(portName);
                handler(port);
            } catch (err) {
                error.captureException(err, {
                    culprit: 'Failure when handling connection in background page'
                });
            }
        });
    }

    try {
        listenForMessages();
        listenForConnections();
    } catch (err) {
        error.captureException(err, {
            culprit: 'Failure when attaching chrome.runtime listeners'
        });
    }

})();

function handleMailToRequest(request, messageSender) {
    openMailtoLink(messageSender.tab, request.payload.href);
}

chrome.tabs.onCreated.addListener(function(tab) {
    if (!/^mailto:/.test(tab.url)) return;

    chrome.storage.local.get(null, function(storage) {
        var hasAtLeastOneAccount = getOnboardedAccounts(storage).length > 0;
        if (hasAtLeastOneAccount) {
            openMailtoLink(tab, tab.url);
            chrome.tabs.remove(tab.id);
        }
    });
});

function openMailtoLink(tab, href) {
    var to = href.match(/mailto:([^\?]+)/);
    if (to) to = decodeURIComponent(to[1]);

    var cc = getParameterByName(href, 'cc');
    var bcc = getParameterByName(href, 'bcc');
    var subject = getParameterByName(href, 'subject');
    var body = getParameterByName(href, 'body');

    var payload = {};
    if (to) payload.to = to;
    if (cc) payload.cc = cc;
    if (bcc) payload.bcc = bcc;
    if (subject) payload.subject = subject;
    if (body) payload.body = body;

    chrome.windows.get(tab.windowId, function(win) {
        chrome.storage.local.get(null, function(storage) {
            openComposeWindow(win, tab, storage, payload);
        });
    });
}


// Helper gets a URL parameter by name.
function getParameterByName(href, name) {
    var match = RegExp('[?&]' + name + '=([^&]*)', 'i').exec(href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

const LAST_SEEN_NOTIFICATIONS = new Map();
const MAXIMUM_RETAINED_NOTIFICATIONS = 100;

ExtensionMessageBus.on('postNotification', function(notificationOptions, notificationSender) {
    // Debounce notifications in case the same Gmail account is open in multiple tabs.
    // This structure also serves to track the notification context for clicks.
    const notificationId = notificationOptions.id;
    if (LAST_SEEN_NOTIFICATIONS.has(notificationId)) return;

    var handlerOptionKeys = ['activateOnClick'];
    var context = {
        clientContext: notificationOptions.context,
        sender: notificationSender,
        handlerOptions: _.map(notificationOptions.buttons, function(button) {
            return _.pick(button, handlerOptionKeys);
        })
    };
    LAST_SEEN_NOTIFICATIONS.set(notificationId, context);
    if (LAST_SEEN_NOTIFICATIONS.size > MAXIMUM_RETAINED_NOTIFICATIONS) {
        // This will delete FIFO since maps iterate in insertion order.
        LAST_SEEN_NOTIFICATIONS.delete(LAST_SEEN_NOTIFICATIONS.keys().next().value);
    }

    chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: 'src/assets/img/icon.png',
        title: notificationOptions.title,
        message: notificationOptions.message,
        buttons: _.map(notificationOptions.buttons, function(button) {
            // The Chrome API will freak out if we pass a non-standard key.
            return _.omit(button, handlerOptionKeys);
        }),
        isClickable: notificationOptions.showClickable
    }, function() {
        var err = chrome.runtime.lastError;
        if (err) {
            error('Could not post notification:', err);
        }
    });
});

function onNotificationClicked(notificationId, buttonIndex) {
    if (buttonIndex === undefined) {
        // This was called from 'onClicked' (the body of the notification was clicked, vs. a button).
        // `null` is expected in this case below and by the 'notificationClicked' handler in `extension-source`.
        buttonIndex = null;
    }

    // Chrome does not clear notifications when you click on them (tested 1/17/2015).
    chrome.notifications.clear(notificationId, function() {});

    const context = LAST_SEEN_NOTIFICATIONS.get(notificationId);
    if (!context) {
        // The user might have more than `MAXIMUM_RETAINED_NOTIFICATIONS` open and clicked one of the
        // oldest ones, or the extension may have been reloaded since the notification was created.
        // Nothing we can do to handle the click without the context, so return.
        return;
    }
    LAST_SEEN_NOTIFICATIONS.delete(notificationId);

    var notificationOptions = {
        activateAfterSending: true
    };

    if (buttonIndex !== null) {
        var handlerOptions = context.handlerOptions[buttonIndex];
        notificationOptions.activateAfterSending = handlerOptions.activateOnClick;
    }

    ExtensionMessageBus.send('notificationClicked', {
        id: notificationId,
        context: context.clientContext,
        buttonIndex,
    }, context.sender, notificationOptions);
}
chrome.notifications.onClicked.addListener(onNotificationClicked);
chrome.notifications.onButtonClicked.addListener(onNotificationClicked);

function handleCallToRequest(request, messageSender) {
    openTelLink(messageSender.tab, request.payload.href);
}


function generateCallId() {
    // Implementation inspired by Random.id() in Meteor.
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';

    // Not a requirement that it's 17 characters long, but that's what
    // Random.id() uses.
    var length = 17;
    var buffer = new Uint16Array(length);

    // Don't use Math.random() since there's risk of collisions:
    // http://devoluk.com/google-chrome-math-random-issue.html.
    window.crypto.getRandomValues(buffer);

    var randomstring = '';
    for (var i = 0; i < buffer.length; i++) {
        randomstring += chars[buffer[i] % chars.length];
    }
    return randomstring;
}


function openTelLink(tab, href) {
    var phoneNumber = href.match(/tel:([^\;]+)/);
    if (phoneNumber) phoneNumber = decodeURIComponent(phoneNumber[1]);

    chrome.windows.get(tab.windowId, function(win) {
        chrome.storage.local.get(null, function(storage) {
            openCallToWindow(win, tab, storage, {
                phoneNumber
            });
        });
    });
}

function openCallToWindow(win, tab, storage, params) {
    var onboardedAccounts = getOnboardedAccounts(storage);
    if (onboardedAccounts.length === 0) {
        // The user hasn't onboarded yet. Just bring up Gmail.
        return refreshBrowser('gmail-inbox', true);
    }

    // Determine the email address of the user from storage.
    var userEmail = _getUserEmail(storage);

    // Generate a message id and URL.
    const callId = generateCallId();
    var url = `${Environment.getComposeUrl()}/call/${callId}?user=${encodeURIComponent(userEmail)}`;

    if (!_.isEmpty(params)) {
        url += '&' + $.param(params).replace(/\+/g, '%20');
    }

    if (win.state === 'fullscreen') {
        // If the source window is in fullscreen mode, create a new tab.
        chrome.tabs.create({
            windowId: win.id,
            url,
            index: tab.index + 1 // Create this tab right after the source tab.
        });
    } else {
        var windowRightEdge = win.left + win.width;
        var windowTop = win.top;

        // Match Call compose mole width. The height is slightly taller as required by our menus.
        var width = 615;
        var height = 613;

        chrome.windows.create({
            url,
            width,
            height,
            top: windowTop + 70,
            left: windowRightEdge - width - 20,
            type: 'popup'
        });
    }
}


const extensionOrigin = 'chrome-extension://ocpljaamllnldhepankaeljmeeeghnid';

function isNullOriginHeader(name, value) {
    return /^Origin$/i.test(name) && value === 'null';
}

function hasNullOrigin(requestHeaders) {
    for (const {
            name,
            value
        } of requestHeaders) {
        if (isNullOriginHeader(name, value)) return true;
    }
    return false;
}

function shouldOverwriteOriginHeader(requestDetails) {
    const {
        initiator,
        tabId,
        requestHeaders
    } = requestDetails;
    return initiator === extensionOrigin && tabId === -1 && hasNullOrigin(requestHeaders);
}

function overWriteNullOriginHeader(requestHeaders) {
    return requestHeaders.map(({
        name,
        value
    }) => {
        return {
            name,
            value: isNullOriginHeader(name, value) ? extensionOrigin : value,
        };
    });
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    (requestDetails) => {
        if (shouldOverwriteOriginHeader(requestDetails)) {
            return {
                requestHeaders: overWriteNullOriginHeader(requestDetails.requestHeaders)
            };
        }
        return {};
    }, {
        urls: ['https://' + '*.mixmax.com/' + '*'],
        types: ['xmlhttprequest'],
    },
    ['blocking', 'requestHeaders']
);

ExtensionMessageBus.on('ping', function(payload, sender, callback) {
    if (callback) callback('pong');
});

function refreshBrowser(target, bringToForeground = false) {
    if ((target !== 'gmail') && (target !== 'salesforce') && (target !== 'app-home')) return;

    chrome.windows.getAll({
        populate: true
    }, function(windows) {
        let foundExisting = false;
        const appUrl = new URL(Environment.getAppUrl());

        windows.forEach(function(win) {
            win.tabs.forEach(function(tab) {
                // Parse the hostname from the url for a secure comparison of tabs below.
                let url = new URL(tab.url);
                const hostname = url.hostname;

                // Handle Salesforce and Salesforce Lightning domains, as well as custom domains.
                const isSalesforceUrl = hostname === 'force.com' || hostname === 'salesforce.com' || hostname.endsWith('.force.com') || hostname.endsWith('.salesforce.com');

                // Ignore tabs not matching the target.
                if (target === 'gmail') {
                    if (hostname !== 'mail.google.com') return;
                } else if (target === 'salesforce') {
                    if (!isSalesforceUrl) return;
                } else if (target === 'app-home') {
                    if (hostname !== appUrl.hostname) return;
                } else {
                    return; // Unknown target.
                }

                url = url.href;

                // Update and reload the matching tab. If this is the first one
                // found and bringToForeground is true, activate it.
                chrome.tabs.update(tab.id, {
                    url,
                    active: bringToForeground && !foundExisting
                });

                foundExisting = true;
            });
        });

        // If no gmail tab found, just open a new one.
        if (bringToForeground && !foundExisting) {
            let url;
            if (target === 'app-home') {
                // This only happens on install, since on update we don't set bringtoForeground to true.
                const params = {
                    ref: 'install'
                };
                url = getUrl(appUrl.href, params);
            } else if (target === 'gmail') {
                url = 'https://mail.google.com';
            } else {
                url = 'https://salesforce.com';
            }

            chrome.tabs.create({
                url,
                active: true
            });
        }
    });
}

function getUrl(url, params = {}) {
    url = new URL(url);
    Object.keys(params).forEach((param) => url.searchParams.set(param, params[param]));
    return url.toString();
}

function trackInstallEvent() {
    return fetch(`${Environment.getAppUrl()}/api/analytics/event`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event: 'Installed extension',
            source: 'extension'
        }),
    });
}

// Refresh on install.
chrome.runtime.onInstalled.addListener(function(details) {
    // Reload the tabs into which our extension loads content scripts when the user installs the
    // extension, so that we can begin onboarding. Reload these tabs when the user updates the
    // extension because the Chrome content-script runtime will lose connection with the extension
    // https://sentry.io/mixmax/chrome-extension/issues/173651259/ and needs to be resynced by reloading.
    if (details.reason === 'update') {
        refreshBrowser('salesforce');
        refreshBrowser('gmail');
        refreshBrowser('app-home');
    } else if (details.reason === 'install') {
        trackInstallEvent();
        refreshBrowser('salesforce');
        refreshBrowser('app-home', true);
        refreshBrowser('gmail', false);
    }
});

// Refresh gmail (for deactivating).
// HACK(jeff): Refresh SFDC as well, to support both clients using the new extension and the old.
// This dovetails nicely with existing usage of this method--only when deactivating, in which case
// we want to refresh all Mixmax tabs. Also specific methods in case we want to refresh isolated
// sets down the line.
ExtensionMessageBus.on('refreshGmail', function(payload, sender, callback) {
    refreshBrowser('salesforce');
    refreshBrowser('gmail', payload);
    if (callback) callback();
});

ExtensionMessageBus.on('refreshGmailOnly', function(payload, sender, callback) {
    refreshBrowser('gmail', payload);
    if (callback) callback();
});

ExtensionMessageBus.on('refreshSalesforce', function(payload, sender, callback) {
    refreshBrowser('salesforce', payload);
    if (callback) callback();
});

// Modify storage.
ExtensionMessageBus.on('setStorage', function(payload, sender, callback) {
    chrome.storage.local.set(payload);
    // Sync storage with the other tabs.
    ExtensionMessageBus.send('setStorage', payload, {
        notId: sender.id
    });
    if (callback) callback();
});

function setUninstallUrl() {
    // Not on Chrome 41 yet.
    if (!chrome.runtime.setUninstallURL) return;

    chrome.storage.local.get(null, function(storage) {
        var allAccounts = [];
        var loggedInAccounts = [];

        Object.keys(storage).forEach(function(key) {
            var matches = key.match(/^onboarding_started_(.+)_[a-z]+$/);
            if (matches) allAccounts.push(matches[1]);

            matches = key.match(/^has_been_onboarded_(.+)_[a-z]+$/);
            if (matches && !_.contains(allAccounts, matches[1])) allAccounts.push(matches[1]);

            matches = key.match(/^onboarded_(.+)_[a-z]+$/);
            if (matches) loggedInAccounts.push(matches[1]);
        });

        allAccounts = _.unique(allAccounts);
        loggedInAccounts = _.unique(loggedInAccounts).map(function(account) {
            return allAccounts.indexOf(account);
        });

        var url = Environment.getAppUrl() + '/uninstall-extension' +
            '?a2=' + LZString.compressToEncodedURIComponent(allAccounts.join(',')) +
            '&l2=' + LZString.compressToEncodedURIComponent(loggedInAccounts.join(','));

        chrome.runtime.setUninstallURL(url);
    });
}

// Set now.
setUninstallUrl();

// Set on every key change so we update the url when accounts get onboarded.
chrome.storage.onChanged.addListener(setUninstallUrl);

chrome.webRequest.onBeforeRequest.addListener(function(details) {
    // We don't need to check for `localhost` requests because those will fail anyway.
    if (details.url.includes('mixmax.com/api/track')) {
        return {
            redirectUrl: 'data:image/gif;base64,R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
        };
    }
    return {};
}, {
    urls: ['*://*.googleusercontent.com/proxy*'],
    types: ['image']
}, ['blocking']);