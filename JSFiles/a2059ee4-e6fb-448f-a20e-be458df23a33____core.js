import UAParser from 'ua-parser-js';
import 'core-js/proposals/relative-indexing-method';

/* eslint-disable no-param-reassign */
const loadNative = ({
  videoElement
}) => ({
  load: ({
    native: url
  }) => {
    videoElement.src = url;
    videoElement.style.height = '100%';
    videoElement.style.width = '100%';
  },
  play: () => videoElement.play(),
  pause: () => videoElement.pause(),
  seek: time => {
    videoElement.currentTime = time;
  },
  getVideoElement: () => videoElement,
  getVideoQuality: () => ({}),
  destroy: () => {}
});

/*
  We overwrite standard function for getting mediaSource object
  because Chrome supports VideoTrack only in experiment mode.
*/
const getUrlObject = fn => {
  const createObjectURL = window.URL.createObjectURL.bind();

  window.URL.createObjectURL = blob => {
    if (blob.addSourceBuffer) {
      fn(blob);
    }

    return createObjectURL(blob);
  };
};

/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let shaka$1;
const shakaLog = {
  v1: () => {}
};

const asMap = object => {
  const map = new Map();

  for (const key of Object.keys(object)) {
    map.set(key, object[key]);
  }

  return map;
};

const makeResponse = (headers, data, status, uri, responseURL, requestType) => {
  if (status >= 200 && status <= 299 && status != 202) {
    // Most 2xx HTTP codes are success cases.

    /** @type {shaka.extern.Response} */
    const response = {
      uri: responseURL || uri,
      originalUri: uri,
      data,
      status,
      headers,
      fromCache: !!headers['x-shaka-from-cache']
    };
    return response;
  }

  let responseText = null;

  try {
    responseText = shaka$1.util.StringUtils.fromBytesAutoDetect(data); // eslint-disable-next-line no-empty
  } catch (exception) {}

  const severity = status == 401 || status == 403 ? shaka$1.util.Error.Severity.CRITICAL : shaka$1.util.Error.Severity.RECOVERABLE;
  throw new shaka$1.util.Error(severity, shaka$1.util.Error.Category.NETWORK, shaka$1.util.Error.Code.BAD_HTTP_STATUS, uri, status, responseText, headers, requestType);
};

const goog$1 = {
  asserts: {
    assert: () => {}
  }
};
/**
 * @summary A networking plugin to handle http and https URIs via the Fetch API.
 * @export
 */

class HttpFetchPlugin {
  /**
   * @param {string} uri
   * @param {shaka.extern.Request} request
   * @param {shaka.net.NetworkingEngine.RequestType} requestType
   * @param {shaka.extern.ProgressUpdated} progressUpdated Called when a
   *   progress event happened.
   * @param {shaka.extern.HeadersReceived} headersReceived Called when the
   *   headers for the download are received, but before the body is.
   * @return {!shaka.extern.IAbortableOperation.<shaka.extern.Response>}
   * @export
   */
  static parse(uri, request, requestType, progressUpdated, headersReceived) {
    const headers = new HttpFetchPlugin.Headers_();
    asMap(request.headers).forEach((value, key) => {
      headers.append(key, value);
    });
    const controller = new HttpFetchPlugin.AbortController_();
    /** @type {!RequestInit} */

    const init = {
      // Edge does not treat null as undefined for body; https://bit.ly/2luyE6x
      body: request.body || undefined,
      headers,
      method: request.method,
      signal: controller.signal,
      credentials: request.allowCrossSiteCredentials ? 'include' : undefined
    };
    /** @type {shaka.net.HttpFetchPlugin.AbortStatus} */

    const abortStatus = {
      canceled: false,
      timedOut: false
    };
    const pendingRequest = HttpFetchPlugin.request_(uri, requestType, init, abortStatus, progressUpdated, headersReceived, request.streamDataCallback);
    /** @type {!shaka.util.AbortableOperation} */

    const op = new shaka$1.util.AbortableOperation(pendingRequest, () => {
      abortStatus.canceled = true;
      controller.abort();
      return Promise.resolve();
    }); // The fetch API does not timeout natively, so do a timeout manually using
    // the AbortController.

    const timeoutMs = request.retryParameters.timeout;

    if (timeoutMs) {
      const timer = new shaka$1.util.Timer(() => {
        abortStatus.timedOut = true;
        controller.abort();
      });
      timer.tickAfter(timeoutMs / 1000); // To avoid calling |abort| on the network request after it finished, we
      // will stop the timer when the requests resolves/rejects.

      op.finally(() => {
        timer.stop();
      });
    }

    return op;
  }
  /**
   * @param {string} uri
   * @param {shaka.net.NetworkingEngine.RequestType} requestType
   * @param {!RequestInit} init
   * @param {shaka.net.HttpFetchPlugin.AbortStatus} abortStatus
   * @param {shaka.extern.ProgressUpdated} progressUpdated
   * @param {shaka.extern.HeadersReceived} headersReceived
   * @param {?function(BufferSource):!Promise} streamDataCallback
   * @return {!Promise<!shaka.extern.Response>}
   * @private
   */


  static async request_(uri, requestType, init, abortStatus, progressUpdated, headersReceived, streamDataCallback) {
    const fetch = HttpFetchPlugin.fetch_;
    const ReadableStream = HttpFetchPlugin.ReadableStream_;
    let response;
    let arrayBuffer;
    let loaded = 0;
    let lastLoaded = 0; // Last time stamp when we got a progress event.

    let lastTime = Date.now();

    try {
      // The promise returned by fetch resolves as soon as the HTTP response
      // headers are available. The download itself isn't done until the promise
      // for retrieving the data (arrayBuffer, blob, etc) has resolved.
      response = await fetch(uri, init); // At this point in the process, we have the headers of the response, but
      // not the body yet.

      headersReceived(HttpFetchPlugin.headersToGenericObject_(response.headers)); // Getting the reader in this way allows us to observe the process of
      // downloading the body, instead of just waiting for an opaque promise to
      // resolve.
      // We first clone the response because calling getReader locks the body
      // stream; if we didn't clone it here, we would be unable to get the
      // response's arrayBuffer later.

      const reader = response.clone().body.getReader();
      const contentLengthRaw = response.headers.get('Content-Length');
      const contentLength = contentLengthRaw ? parseInt(contentLengthRaw, 10) : 0;

      const start = controller => {
        const push = async () => {
          let readObj;

          try {
            readObj = await reader.read();
          } catch (e) {
            // If we abort the request, we'll get an error here.  Just ignore it
            // since real errors will be reported when we read the buffer below.
            shakaLog.v1('error reading from stream', e.message);
            return;
          }

          if (!readObj.done) {
            loaded += readObj.value.byteLength; // streamDataCallback adds stream data to buffer for low latency mode
            // 4xx response means a segment is not ready and can retry soon
            // only successful response data should be added, or playback freezes

            if (response.status === 200 && streamDataCallback) {
              await streamDataCallback(readObj.value);
            }
          }

          const currentTime = Date.now(); // If the time between last time and this time we got progress event
          // is long enough, or if a whole segment is downloaded, call
          // progressUpdated().

          if (currentTime - lastTime > 100 || readObj.done) {
            progressUpdated(currentTime - lastTime, loaded - lastLoaded, contentLength - loaded);
            lastLoaded = loaded;
            lastTime = currentTime;
          }

          if (readObj.done) {
            goog$1.asserts.assert(!readObj.value, 'readObj should be unset when "done" is true.');
            controller.close();
          } else {
            controller.enqueue(readObj.value);
            push();
          }
        };

        push();
      }; // Create a ReadableStream to use the reader. We don't need to use the
      // actual stream for anything, though, as we are using the response's
      // arrayBuffer method to get the body, so we don't store the
      // ReadableStream.


      new ReadableStream({
        start
      }); // eslint-disable-line no-new

      arrayBuffer = await response.arrayBuffer();
    } catch (error) {
      if (abortStatus.canceled) {
        throw new shaka$1.util.Error(shaka$1.util.Error.Severity.RECOVERABLE, shaka$1.util.Error.Category.NETWORK, shaka$1.util.Error.Code.OPERATION_ABORTED, uri, requestType);
      } else if (abortStatus.timedOut) {
        throw new shaka$1.util.Error(shaka$1.util.Error.Severity.RECOVERABLE, shaka$1.util.Error.Category.NETWORK, shaka$1.util.Error.Code.TIMEOUT, uri, requestType);
      } else {
        throw new shaka$1.util.Error(shaka$1.util.Error.Severity.RECOVERABLE, shaka$1.util.Error.Category.NETWORK, shaka$1.util.Error.Code.HTTP_ERROR, uri, error, requestType);
      }
    }

    const headers = HttpFetchPlugin.headersToGenericObject_(response.headers);
    return makeResponse(headers, arrayBuffer, response.status, uri, response.url, requestType);
  }
  /**
   * @param {!Headers} headers
   * @return {!Object.<string, string>}
   * @private
   */


  static headersToGenericObject_(headers) {
    const headersObj = {};
    headers.forEach((value, key) => {
      // Since Edge incorrectly return the header with a leading new line
      // character ('\n'), we trim the header here.
      headersObj[key.trim()] = value;
    });
    return headersObj;
  }

}

HttpFetchPlugin.register = shakaNamespace => {
  shaka$1 = shakaNamespace;
  /**
   * Overridden in unit tests, but compiled out in production.
   *
   * @const {function(string, !RequestInit)}
   * @private
   */

  HttpFetchPlugin.fetch_ = window.fetch;
  /**
   * Overridden in unit tests, but compiled out in production.
   *
   * @const {function(new: AbortController)}
   * @private
   */

  HttpFetchPlugin.AbortController_ = window.AbortController;
  /**
   * Overridden in unit tests, but compiled out in production.
   *
   * @const {function(new: ReadableStream, !Object)}
   * @private
   */

  HttpFetchPlugin.ReadableStream_ = window.ReadableStream;
  /**
   * Overridden in unit tests, but compiled out in production.
   *
   * @const {function(new: Headers)}
   * @private
   */

  HttpFetchPlugin.Headers_ = window.Headers;
  shaka$1.net.NetworkingEngine.registerScheme('http', HttpFetchPlugin.parse);
  shaka$1.net.NetworkingEngine.registerScheme('https', HttpFetchPlugin.parse);
  shaka$1.net.NetworkingEngine.registerScheme('blob', HttpFetchPlugin.parse);
};

/* eslint-disable guard-for-in */

/* eslint-disable no-unused-vars */
const myLog = console;
const goog = {
  asserts: {
    assert: (result, message) => result || console.warn('message')
  }
};
const ALL_EVENTS_ = 'All';

function PublicPromise() {
  let resolvePromise;
  let rejectPromise;
  const promise = new Promise((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  this.resolve = resolvePromise;
  this.reject = rejectPromise;

  this.then = (...args) => promise.then(...args);

  this.catch = (...args) => promise.catch(...args);
}

class MultiMap {
  /** */
  constructor() {
    /** @private {!Object.<string, !Array.<T>>} */
    this.map_ = {};
  }
  /**
   * Add a key, value pair to the map.
   * @param {string} key
   * @param {T} value
   */


  push(key, value) {
    // eslint-disable-next-line no-prototype-builtins
    if (this.map_.hasOwnProperty(key)) {
      this.map_[key].push(value);
    } else {
      this.map_[key] = [value];
    }
  }
  /**
   * Get a list of values by key.
   * @param {string} key
   * @return {Array.<T>} or null if no such key exists.
   */


  get(key) {
    const list = this.map_[key]; // slice() clones the list so that it and the map can each be modified
    // without affecting the other.

    return list ? list.slice() : null;
  }
  /**
   * Get a list of all values.
   * @return {!Array.<T>}
   */


  getAll() {
    const list = [];

    for (const key in this.map_) {
      list.push(...this.map_[key]);
    }

    return list;
  }
  /**
   * Remove a specific value, if it exists.
   * @param {string} key
   * @param {T} value
   */


  remove(key, value) {
    if (!(key in this.map_)) {
      return;
    }

    this.map_[key] = this.map_[key].filter(i => i != value);

    if (this.map_[key].length == 0) {
      // Delete the array if it's empty, so that |get| will reliably return null
      // "if no such key exists", instead of sometimes returning an empty array.
      delete this.map_[key];
    }
  }
  /**
   * Clear all keys and values from the multimap.
   */


  clear() {
    this.map_ = {};
  }
  /**
   * @param {function(string, !Array.<T>)} callback
   */


  forEach(callback) {
    for (const key in this.map_) {
      callback(key, this.map_[key]);
    }
  }
  /**
   * Returns the number of elements in the multimap.
   * @return {number}
   */


  size() {
    return Object.keys(this.map_).length;
  }
  /**
   * Get a list of all the keys.
   * @return {!Array.<string>}
   */


  keys() {
    return Object.keys(this.map_);
  }

}

class FakeEventTarget {
  /** */
  constructor() {
    /**
     * @private {shaka.util.MultiMap.<shaka.util.FakeEventTarget.ListenerType>}
     */
    this.listeners_ = new MultiMap();
    /**
     * The target of all dispatched events.  Defaults to |this|.
     * @type {EventTarget}
     */

    this.dispatchTarget = this;
  }
  /**
   * Add an event listener to this object.
   *
   * @param {string} type The event type to listen for.
   * @param {shaka.util.FakeEventTarget.ListenerType} listener The callback or
   *   listener object to invoke.
   * @param {(!AddEventListenerOptions|boolean)=} options Ignored.
   * @override
   * @exportInterface
   */


  addEventListener(type, listener, options) {
    if (!this.listeners_) {
      return;
    }

    this.listeners_.push(type, listener);
  }
  /**
   * Add an event listener to this object that is invoked for all events types
   * the object fires.
   *
   * @param {shaka.util.FakeEventTarget.ListenerType} listener The callback or
   *   listener object to invoke.
   * @exportInterface
   */


  listenToAllEvents(listener) {
    this.addEventListener(ALL_EVENTS_, listener);
  }
  /**
   * Remove an event listener from this object.
   *
   * @param {string} type The event type for which you wish to remove a
   *   listener.
   * @param {shaka.util.FakeEventTarget.ListenerType} listener The callback or
   *   listener object to remove.
   * @param {(EventListenerOptions|boolean)=} options Ignored.
   * @override
   * @exportInterface
   */


  removeEventListener(type, listener, options) {
    if (!this.listeners_) {
      return;
    }

    this.listeners_.remove(type, listener);
  }
  /**
   * Dispatch an event from this object.
   *
   * @param {!Event} event The event to be dispatched from this object.
   * @return {boolean} True if the default action was prevented.
   * @override
   * @exportInterface
   */


  dispatchEvent(event) {
    // In many browsers, it is complex to overwrite properties of actual Events.
    // Here we expect only to dispatch FakeEvents, which are simpler.
    goog.asserts.assert(event instanceof shaka.util.FakeEvent, 'FakeEventTarget can only dispatch FakeEvents!');

    if (!this.listeners_) {
      return true;
    }

    let listeners = this.listeners_.get(event.type) || [];
    const universalListeners = this.listeners_.get(ALL_EVENTS_);

    if (universalListeners) {
      listeners = listeners.concat(universalListeners);
    } // Execute this event on listeners until the event has been stopped or we
    // run out of listeners.


    for (const listener of listeners) {
      // Do this every time, since events can be re-dispatched from handlers.
      event.target = this.dispatchTarget;
      event.currentTarget = this.dispatchTarget;

      try {
        // Check for the |handleEvent| member to test if this is a
        // |EventListener| instance or a basic function.
        if (listener.handleEvent) {
          listener.handleEvent(event);
        } else {
          // eslint-disable-next-line no-restricted-syntax
          listener.call(this, event);
        }
      } catch (exception) {
        // Exceptions during event handlers should not affect the caller,
        // but should appear on the console as uncaught, according to MDN:
        // https://mzl.la/2JXgwRo
        myLog.error('Uncaught exception in event handler', exception, exception ? exception.message : null, exception ? exception.stack : null);
      }

      if (event.stopped) {
        break;
      }
    }

    return event.defaultPrevented;
  }
  /**
   * @override
   * @exportInterface
   */


  release() {
    this.listeners_ = null;
  }

}

const waitForReadyState = (mediaElement, readyState, eventManager, callback) => {
  const READY_STATES_TO_EVENT_NAMES_ = [[window.HTMLMediaElement.HAVE_METADATA, 'loadedmetadata'], [window.HTMLMediaElement.HAVE_CURRENT_DATA, 'loadeddata'], [window.HTMLMediaElement.HAVE_FUTURE_DATA, 'canplay'], [window.HTMLMediaElement.HAVE_ENOUGH_DATA, 'canplaythrough']];

  if (readyState == window.HTMLMediaElement.HAVE_NOTHING || mediaElement.readyState >= readyState) {
    callback();
  } else {
    const eventName = READY_STATES_TO_EVENT_NAMES_.find(x => x[0] === readyState)[1];
    eventManager.listenOnce(mediaElement, eventName, callback);
  }
};

class PatchedMediaKeysApple {
  /**
   * Installs the polyfill if needed.
   * @export
   */
  static install(shaka) {
    if (!window.HTMLVideoElement || !window.WebKitMediaKeys) {
      // No HTML5 video or no prefixed EME.
      return;
    }

    myLog.info('Using Apple-prefixed EME'); // Delete mediaKeys to work around strict mode compatibility issues.
    // eslint-disable-next-line no-restricted-syntax

    delete window.HTMLMediaElement.prototype.mediaKeys; // Work around read-only declaration for mediaKeys by using a string.
    // eslint-disable-next-line no-restricted-syntax

    window.HTMLMediaElement.prototype.mediaKeys = null; // eslint-disable-next-line no-restricted-syntax

    window.HTMLMediaElement.prototype.setMediaKeys = PatchedMediaKeysApple.setMediaKeys; // Install patches

    window.MediaKeys = PatchedMediaKeysApple.MediaKeys;
    window.MediaKeySystemAccess = PatchedMediaKeysApple.MediaKeySystemAccess;
    navigator.requestMediaKeySystemAccess = PatchedMediaKeysApple.requestMediaKeySystemAccess;
    window.shakaMediaKeysPolyfill = true;

    const defaultInitDataTransform = (initData, initDataType, drmInfo) => {
      if (initDataType === 'skd') {
        const {
          defaultGetContentId,
          initDataTransform
        } = shaka.util.FairPlayUtils;
        const cert = drmInfo.serverCertificate;
        const contentId = defaultGetContentId(initData);
        return initDataTransform(initData, contentId, cert);
      }

      return initData;
    };

    const setupPlayer = player => {
      player.licenseRequestHandler = request => {
        const base64Payload = encodeURIComponent(btoa(String.fromCharCode(...new Uint8Array(request.body))));
        const contentId = encodeURIComponent(new TextDecoder('utf-8').decode(request.initData).slice(6));
        request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        request.body = `spc=${base64Payload}&asset_id=${contentId}`;
      };

      player.configure({
        drm: {
          initDataTransform: defaultInitDataTransform
        }
      });
      player.getNetworkingEngine().registerResponseFilter((type, response) => {
        if (type !== shaka.net.NetworkingEngine.RequestType.LICENSE) {
          return;
        }

        const responseText = new TextDecoder('utf-8').decode(response.data).trim();

        if (responseText.slice(0, 5) === '<ckc>' && responseText.slice(-6) === '</ckc>') {
          response.data = Uint8Array.from(atob(responseText.slice(5, -6)), c => c.charCodeAt(0));
        }
      });
    };

    PatchedMediaKeysApple.setupPlayer = setupPlayer;
  }
  /**
   * An implementation of navigator.requestMediaKeySystemAccess.
   * Retrieves a MediaKeySystemAccess object.
   *
   * @this {!Navigator}
   * @param {string} keySystem
   * @param {!Array.<!MediaKeySystemConfiguration>} supportedConfigurations
   * @return {!Promise.<!MediaKeySystemAccess>}
   */


  static requestMediaKeySystemAccess(keySystem, supportedConfigurations) {
    myLog.debug('PatchedMediaKeysApple.requestMediaKeySystemAccess');
    console.info({
      keySystem,
      supportedConfigurations
    });
    goog.asserts.assert(this == navigator, 'bad "this" for requestMediaKeySystemAccess');

    try {
      console.info({
        keySystem,
        supportedConfigurations
      });
      const access = new PatchedMediaKeysApple.MediaKeySystemAccess(keySystem, supportedConfigurations);
      return Promise.resolve(
      /** @type {!MediaKeySystemAccess} */
      access);
    } catch (exception) {
      console.error(exception);
      return Promise.reject(exception);
    }
  }
  /**
   * An implementation of window.HTMLMediaElement.prototype.setMediaKeys.
   * Attaches a MediaKeys object to the media element.
   *
   * @this {!window.HTMLMediaElement}
   * @param {MediaKeys} mediaKeys
   * @return {!Promise}
   */


  static setMediaKeys(mediaKeys) {
    myLog.debug('PatchedMediaKeysApple.setMediaKeys');
    goog.asserts.assert(this instanceof window.HTMLMediaElement, 'bad "this" for setMediaKeys');
    const newMediaKeys =
    /** @type {window.shaka.polyfill.PatchedMediaKeysApple.MediaKeys} */
    mediaKeys;
    const oldMediaKeys =
    /** @type {window.shaka.polyfill.PatchedMediaKeysApple.MediaKeys} */
    this.mediaKeys;

    if (oldMediaKeys && oldMediaKeys != newMediaKeys) {
      goog.asserts.assert(oldMediaKeys instanceof PatchedMediaKeysApple.MediaKeys, 'non-polyfill instance of oldMediaKeys'); // Have the old MediaKeys stop listening to events on the video tag.

      oldMediaKeys.setMedia(null);
    }

    delete this.mediaKeys; // in case there is an existing getter

    this.mediaKeys = mediaKeys; // work around read-only declaration

    if (newMediaKeys) {
      goog.asserts.assert(newMediaKeys instanceof PatchedMediaKeysApple.MediaKeys, 'non-polyfill instance of newMediaKeys');
      return newMediaKeys.setMedia(this);
    }

    return Promise.resolve();
  }
  /**
   * Handler for the native media elements webkitneedkey event.
   *
   * @this {!window.HTMLMediaElement}
   * @param {!MediaKeyEvent} event
   * @suppress {constantProperty} We reassign what would be const on a real
   *   MediaEncryptedEvent, but in our look-alike event.
   * @private
   */


  static onWebkitNeedKey_(event) {
    myLog.debug('PatchedMediaKeysApple.onWebkitNeedKey_', event);
    const {
      mediaKeys
    } = this;
    goog.asserts.assert(mediaKeys instanceof PatchedMediaKeysApple.MediaKeys, 'non-polyfill instance of newMediaKeys');
    goog.asserts.assert(event.initData != null, 'missing init data!'); // Convert the prefixed init data to match the native 'encrypted' event.

    const uint8 = window.shaka.util.BufferUtils.toUint8(event.initData);
    const dataview = window.shaka.util.BufferUtils.toDataView(uint8); // The first part is a 4 byte little-endian int, which is the length of
    // the second part.

    const length = dataview.getUint32(
    /* position= */
    0,
    /* littleEndian= */
    true);

    if (length + 4 != uint8.byteLength) {
      throw new RangeError('Malformed FairPlay init data');
    } // The remainder is a UTF-16 skd URL.  Convert this to UTF-8 and pass on.


    const str = window.shaka.util.StringUtils.fromUTF16(uint8.subarray(4),
    /* littleEndian= */
    true);
    const initData = window.shaka.util.StringUtils.toUTF8(str); // NOTE: Because "this" is a real EventTarget, the event we dispatch here
    // must also be a real Event.

    const event2 = new Event('encrypted');
    const encryptedEvent =
    /** @type {!MediaEncryptedEvent} */

    /** @type {?} */
    event2;
    encryptedEvent.initDataType = 'skd';
    encryptedEvent.initData = window.shaka.util.BufferUtils.toArrayBuffer(initData);
    this.dispatchEvent(event2);
  }

}
/**
 * An implementation of MediaKeySystemAccess.
 *
 * @implements {MediaKeySystemAccess}
 */


PatchedMediaKeysApple.MediaKeySystemAccess = class {
  /**
   * @param {string} keySystem
   * @param {!Array.<!MediaKeySystemConfiguration>} supportedConfigurations
   */
  constructor(keySystem, supportedConfigurations) {
    myLog.debug('PatchedMediaKeysApple.MediaKeySystemAccess');
    /** @type {string} */

    this.keySystem = keySystem;
    /** @private {!MediaKeySystemConfiguration} */

    this.configuration_; // Optimization: WebKitMediaKeys.isTypeSupported delays responses by a
    // significant amount of time, possibly to discourage fingerprinting.
    // Since we know only FairPlay is supported here, let's skip queries for
    // anything else to speed up the process.

    if (keySystem.startsWith('com.apple.fps')) {
      for (const cfg of supportedConfigurations) {
        const newCfg = this.checkConfig_(cfg);

        if (newCfg) {
          this.configuration_ = newCfg;
          return;
        }
      }
    } // According to the spec, this should be a DOMException, but there is not a
    // public constructor for that.  So we make this look-alike instead.


    const unsupportedKeySystemError = new Error('Unsupported keySystem');
    unsupportedKeySystemError.name = 'NotSupportedError';
    unsupportedKeySystemError.code = DOMException.NOT_SUPPORTED_ERR;
    throw unsupportedKeySystemError;
  }
  /**
   * Check a single config for MediaKeySystemAccess.
   *
   * @param {MediaKeySystemConfiguration} cfg The requested config.
   * @return {?MediaKeySystemConfiguration} A matching config we can support, or
   *   null if the input is not supportable.
   * @private
   */


  checkConfig_(cfg) {
    if (cfg.persistentState == 'required') {
      // Not supported by the prefixed API.
      return null;
    } // Create a new config object and start adding in the pieces which we find
    // support for.  We will return this from getConfiguration() later if
    // asked.

    /** @type {!MediaKeySystemConfiguration} */


    const newCfg = {
      audioCapabilities: [],
      videoCapabilities: [],
      // It is technically against spec to return these as optional, but we
      // don't truly know their values from the prefixed API:
      persistentState: 'optional',
      distinctiveIdentifier: 'optional',
      // Pretend the requested init data types are supported, since we don't
      // really know that either:
      initDataTypes: cfg.initDataTypes,
      sessionTypes: ['temporary'],
      label: cfg.label
    }; // PatchedMediaKeysApple tests for key system availability through
    // WebKitMediaKeys.isTypeSupported.

    let ranAnyTests = false;
    let success = false;

    if (cfg.audioCapabilities) {
      for (const cap of cfg.audioCapabilities) {
        if (cap.contentType) {
          ranAnyTests = true;
          const contentType = cap.contentType.split(';')[0];

          if (window.WebKitMediaKeys.isTypeSupported(this.keySystem, contentType)) {
            newCfg.audioCapabilities.push(cap);
            success = true;
          }
        }
      }
    }

    if (cfg.videoCapabilities) {
      for (const cap of cfg.videoCapabilities) {
        if (cap.contentType) {
          ranAnyTests = true;
          const contentType = cap.contentType.split(';')[0];

          if (window.WebKitMediaKeys.isTypeSupported(this.keySystem, contentType)) {
            newCfg.videoCapabilities.push(cap);
            success = true;
          }
        }
      }
    }

    if (!ranAnyTests) {
      // If no specific types were requested, we check all common types to
      // find out if the key system is present at all.
      success = window.WebKitMediaKeys.isTypeSupported(this.keySystem, 'video/mp4');
    }

    if (success) {
      return newCfg;
    }

    return null;
  }
  /** @override */


  createMediaKeys() {
    myLog.debug('PatchedMediaKeysApple.MediaKeySystemAccess.createMediaKeys');
    const mediaKeys = new PatchedMediaKeysApple.MediaKeys(this.keySystem);
    return Promise.resolve(
    /** @type {!MediaKeys} */
    mediaKeys);
  }
  /** @override */


  getConfiguration() {
    myLog.debug('PatchedMediaKeysApple.MediaKeySystemAccess.getConfiguration');
    return this.configuration_;
  }

};
/**
 * An implementation of MediaKeys.
 *
 * @implements {MediaKeys}
 */

PatchedMediaKeysApple.MediaKeys = class {
  /** @param {string} keySystem */
  constructor(keySystem) {
    myLog.debug('PatchedMediaKeysApple.MediaKeys');
    /** @private {!WebKitMediaKeys} */

    this.nativeMediaKeys_ = new window.WebKitMediaKeys(keySystem);
    /** @private {!window.shaka.util.EventManager} */

    this.eventManager_ = new window.shaka.util.EventManager();
  }
  /** @override */


  createSession(sessionType) {
    myLog.debug('PatchedMediaKeysApple.MediaKeys.createSession');
    sessionType = sessionType || 'temporary'; // For now, only the 'temporary' type is supported.

    if (sessionType != 'temporary') {
      throw new TypeError(`Session type ${sessionType} is unsupported on this platform.`);
    }

    return new PatchedMediaKeysApple.MediaKeySession(this.nativeMediaKeys_, sessionType);
  }
  /** @override */


  setServerCertificate(serverCertificate) {
    myLog.debug('PatchedMediaKeysApple.MediaKeys.setServerCertificate');
    return Promise.resolve(false);
  }
  /**
   * @param {window.HTMLMediaElement} media
   * @protected
   * @return {!Promise}
   */


  setMedia(media) {
    // Remove any old listeners.
    this.eventManager_.removeAll(); // It is valid for media to be null; null is used to flag that event
    // handlers need to be cleaned up.

    if (!media) {
      return Promise.resolve();
    } // Intercept and translate these prefixed EME events.


    this.eventManager_.listen(media, 'webkitneedkey',
    /** @type {window.shaka.util.EventManager.ListenerType} */
    PatchedMediaKeysApple.onWebkitNeedKey_); // Wrap native window.HTMLMediaElement.webkitSetMediaKeys with a Promise.

    try {
      // Some browsers require that readyState >=1 before mediaKeys can be
      // set, so check this and wait for loadedmetadata if we are not in the
      // correct state
      waitForReadyState(media, window.HTMLMediaElement.HAVE_METADATA, this.eventManager_, () => {
        media.webkitSetMediaKeys(this.nativeMediaKeys_);
      });
      return Promise.resolve();
    } catch (exception) {
      return Promise.reject(exception);
    }
  }

};
/**
 * An implementation of MediaKeySession.
 *
 * @implements {MediaKeySession}
 */

PatchedMediaKeysApple.MediaKeySession = class extends FakeEventTarget {
  /**
   * @param {WebKitMediaKeys} nativeMediaKeys
   * @param {string} sessionType
   */
  constructor(nativeMediaKeys, sessionType) {
    myLog.debug('PatchedMediaKeysApple.MediaKeySession');
    super();
    /**
     * The native MediaKeySession, which will be created in generateRequest.
     * @private {WebKitMediaKeySession}
     */

    this.nativeMediaKeySession_ = null;
    /** @private {WebKitMediaKeys} */

    this.nativeMediaKeys_ = nativeMediaKeys; // Promises that are resolved later

    /** @private {PublicPromise} */

    this.generateRequestPromise_ = null;
    /** @private {PublicPromise} */

    this.updatePromise_ = null;
    /** @private {!window.shaka.util.EventManager} */

    this.eventManager_ = new window.shaka.util.EventManager();
    /** @type {string} */

    this.sessionId = '';
    /** @type {number} */

    this.expiration = NaN;
    /** @type {!PublicPromise} */

    this.closed = new PublicPromise();
    /** @type {!window.shaka.polyfill.PatchedMediaKeysApple.MediaKeyStatusMap} */

    this.keyStatuses = new PatchedMediaKeysApple.MediaKeyStatusMap();
  }
  /** @override */


  generateRequest(initDataType, initData) {
    myLog.debug('PatchedMediaKeysApple.MediaKeySession.generateRequest');
    this.generateRequestPromise_ = new PublicPromise();

    try {
      // This EME spec version requires a MIME content type as the 1st param to
      // createSession, but doesn't seem to matter what the value is.
      // It also only accepts Uint8Array, not ArrayBuffer, so explicitly make
      // initData into a Uint8Array.
      const session = this.nativeMediaKeys_.createSession('video/mp4', window.shaka.util.BufferUtils.toUint8(initData));
      this.nativeMediaKeySession_ = session;
      this.sessionId = session.sessionId || ''; // Attach session event handlers here.

      this.eventManager_.listen(this.nativeMediaKeySession_, 'webkitkeymessage',
      /** @type {window.shaka.util.EventManager.ListenerType} */
      event => this.onWebkitKeyMessage_(event));
      this.eventManager_.listen(session, 'webkitkeyadded',
      /** @type {window.shaka.util.EventManager.ListenerType} */
      event => this.onWebkitKeyAdded_(event));
      this.eventManager_.listen(session, 'webkitkeyerror',
      /** @type {window.shaka.util.EventManager.ListenerType} */
      event => this.onWebkitKeyError_(event));
      this.updateKeyStatus_('status-pending');
    } catch (exception) {
      this.generateRequestPromise_.reject(exception);
    }

    return this.generateRequestPromise_;
  }
  /** @override */


  load() {
    myLog.debug('PatchedMediaKeysApple.MediaKeySession.load');
    return Promise.reject(new Error('MediaKeySession.load not yet supported'));
  }
  /** @override */


  update(response) {
    myLog.debug('PatchedMediaKeysApple.MediaKeySession.update');
    this.updatePromise_ = new PublicPromise();

    try {
      // Pass through to the native session.
      this.nativeMediaKeySession_.update(window.shaka.util.BufferUtils.toUint8(response));
    } catch (exception) {
      this.updatePromise_.reject(exception);
    }

    return this.updatePromise_;
  }
  /** @override */


  close() {
    myLog.debug('PatchedMediaKeysApple.MediaKeySession.close');

    try {
      // Pass through to the native session.
      this.nativeMediaKeySession_.close();
      this.closed.resolve();
      this.eventManager_.removeAll();
    } catch (exception) {
      this.closed.reject(exception);
    }

    return this.closed;
  }
  /** @override */


  remove() {
    myLog.debug('PatchedMediaKeysApple.MediaKeySession.remove');
    return Promise.reject(new Error('MediaKeySession.remove is only applicable for persistent licenses, ' + 'which are not supported on this platform'));
  }
  /**
   * Handler for the native keymessage event on WebKitMediaKeySession.
   *
   * @param {!MediaKeyEvent} event
   * @private
   */


  onWebkitKeyMessage_(event) {
    myLog.debug('PatchedMediaKeysApple.onWebkitKeyMessage_', event); // We can now resolve this.generateRequestPromise, which should be non-null.

    goog.asserts.assert(this.generateRequestPromise_, 'generateRequestPromise_ should be set before now!');

    if (this.generateRequestPromise_) {
      this.generateRequestPromise_.resolve();
      this.generateRequestPromise_ = null;
    }

    const isNew = this.keyStatuses.getStatus() == undefined;
    const data = new Map().set('messageType', isNew ? 'license-request' : 'license-renewal').set('message', window.shaka.util.BufferUtils.toArrayBuffer(event.message));
    const event2 = new window.shaka.util.FakeEvent('message', data);
    this.dispatchEvent(event2);
  }
  /**
   * Handler for the native keyadded event on WebKitMediaKeySession.
   *
   * @param {!MediaKeyEvent} event
   * @private
   */


  onWebkitKeyAdded_(event) {
    myLog.debug('PatchedMediaKeysApple.onWebkitKeyAdded_', event); // This shouldn't fire while we're in the middle of generateRequest,
    // but if it does, we will need to change the logic to account for it.

    goog.asserts.assert(!this.generateRequestPromise_, 'Key added during generate!'); // We can now resolve this.updatePromise, which should be non-null.

    goog.asserts.assert(this.updatePromise_, 'updatePromise_ should be set before now!');

    if (this.updatePromise_) {
      this.updateKeyStatus_('usable');
      this.updatePromise_.resolve();
      this.updatePromise_ = null;
    }
  }
  /**
   * Handler for the native keyerror event on WebKitMediaKeySession.
   *
   * @param {!MediaKeyEvent} event
   * @private
   */


  onWebkitKeyError_(event) {
    myLog.debug('PatchedMediaKeysApple.onWebkitKeyError_', event);
    const error = new Error('EME PatchedMediaKeysApple key error');
    error.errorCode = this.nativeMediaKeySession_.error;

    if (this.generateRequestPromise_ != null) {
      this.generateRequestPromise_.reject(error);
      this.generateRequestPromise_ = null;
    } else if (this.updatePromise_ != null) {
      this.updatePromise_.reject(error);
      this.updatePromise_ = null;
    } else {
      // Unexpected error - map native codes to standardised key statuses.
      // Possible values of this.nativeMediaKeySession_.error.code:
      // MEDIA_KEYERR_UNKNOWN        = 1
      // MEDIA_KEYERR_CLIENT         = 2
      // MEDIA_KEYERR_SERVICE        = 3
      // MEDIA_KEYERR_OUTPUT         = 4
      // MEDIA_KEYERR_HARDWARECHANGE = 5
      // MEDIA_KEYERR_DOMAIN         = 6
      switch (this.nativeMediaKeySession_.error.code) {
        case window.WebKitMediaKeyError.MEDIA_KEYERR_OUTPUT:
        case window.WebKitMediaKeyError.MEDIA_KEYERR_HARDWARECHANGE:
          this.updateKeyStatus_('output-not-allowed');
          break;

        default:
          this.updateKeyStatus_('internal-error');
          break;
      }
    }
  }
  /**
   * Updates key status and dispatch a 'keystatuseschange' event.
   *
   * @param {string} status
   * @private
   */


  updateKeyStatus_(status) {
    this.keyStatuses.setStatus(status);
    const event = new window.shaka.util.FakeEvent('keystatuseschange');
    this.dispatchEvent(event);
  }

};

const getDummyKeyId = () => new Uint8Array([0]).buffer;
/**
 * @summary An implementation of MediaKeyStatusMap.
 * This fakes a map with a single key ID.
 *
 * @todo Consolidate the MediaKeyStatusMap types in these polyfills.
 * @implements {MediaKeyStatusMap}
 */


PatchedMediaKeysApple.MediaKeyStatusMap = class {
  /** */
  constructor() {
    /**
     * @type {number}
     */
    this.size = 0;
    /**
     * @private {string|undefined}
     */

    this.status_ = undefined;
  }
  /**
   * An internal method used by the session to set key status.
   * @param {string|undefined} status
   */


  setStatus(status) {
    this.size = status == undefined ? 0 : 1;
    this.status_ = status;
  }
  /**
   * An internal method used by the session to get key status.
   * @return {string|undefined}
   */


  getStatus() {
    return this.status_;
  }
  /** @override */


  forEach(fn) {
    if (this.status_) {
      fn(this.status_, getDummyKeyId());
    }
  }
  /** @override */


  get(keyId) {
    if (this.has(keyId)) {
      return this.status_;
    }

    return undefined;
  }
  /** @override */


  has(keyId) {
    const fakeKeyId = getDummyKeyId();

    if (this.status_ && window.shaka.util.BufferUtils.equal(keyId, fakeKeyId)) {
      return true;
    }

    return false;
  }
  /**
   * @suppress {missingReturn}
   * @override
   */


  entries() {
    goog.asserts.assert(false, 'Not used!  Provided only for the compiler.');
  }
  /**
   * @suppress {missingReturn}
   * @override
   */


  keys() {
    goog.asserts.assert(false, 'Not used!  Provided only for the compiler.');
  }
  /**
   * @suppress {missingReturn}
   * @override
   */


  values() {
    goog.asserts.assert(false, 'Not used!  Provided only for the compiler.');
  }

};

/* eslint-disable no-param-reassign */

const getQualityItem = track => ({
  id: track.originalVideoId,
  bitrate: track.videoBandwidth,
  width: track.width,
  height: track.height,
  codec: track.videoCodec,
  frameRate: track.frameRate
});

const loadShaka = async (videoElement, config = {}) => {
  let player;
  getUrlObject(mediaSource => {
    player.mediaSource = mediaSource;
  });
  const shaka = await import('shaka-player');
  window.shaka = shaka;
  shaka.polyfill.installAll();

  if (window.WebKitMediaKeys) {
    PatchedMediaKeysApple.install(shaka);
  }

  player = new shaka.Player(videoElement);

  if (window.WebKitMediaKeys) {
    PatchedMediaKeysApple.setupPlayer(player);
  }

  player.configure({
    manifest: {
      dash: {
        ignoreSuggestedPresentationDelay: true
      }
    },
    streaming: {
      // To reduce the unseekable range at the start of the manifests.
      // See: https://github.com/shaka-project/shaka-player/issues/3526
      safeSeekOffset: 0,
      rebufferingGoal: 0
    }
  });
  player.configure(config);
  player.addEventListener('error', event => {
    var _window$Sentry;

    console.log(event);
    const {
      detail = {}
    } = event;
    const error = new Error(`Player: ${detail.code}/${detail.name}`);

    if (!detail || /The video element has thrown a media error|Video element triggered an Error/.test(detail.message)) {
      return;
    }

    videoElement.dispatchEvent(Object.assign(new CustomEvent('error'), {
      error: detail,
      message: `Player Error: ${detail.code}/${detail.message.split(' ', 3)[2]}`
    }));

    if (detail.code === 1001 || detail.severity === 2) {
      console.info('Stream unavailable, unload source');
      player.unload();
    }

    (_window$Sentry = window.Sentry) === null || _window$Sentry === void 0 ? void 0 : _window$Sentry.captureException(error);
  });
  player.addEventListener('loaded', () => videoElement.dispatchEvent(new CustomEvent('canplay')));
  player.addEventListener('adaptation', event => {
    const {
      videoBandwidth,
      width,
      height
    } = event.newTrack;
    videoElement.dispatchEvent(new CustomEvent('downloadQualityChange', {
      detail: {
        bitrate: parseInt(videoBandwidth / 1000, 10),
        height,
        width
      }
    }));
  });
  const extensionOptions = {
    licenseRequestHeaders: null
  };

  const getAvailableVideoQualities = () => player.getVariantTracks().reduce((trackList, currentTrack) => {
    const keepOrignalTrack = trackList.find(track => track.height === currentTrack.height);

    if (!keepOrignalTrack) {
      trackList.push(getQualityItem(currentTrack));
    }

    return trackList;
  }, []);

  const getVideoQuality = () => {
    const activeTrack = player.getVariantTracks().find(track => track.active);
    if (!activeTrack) return {};
    return getQualityItem(activeTrack);
  };

  HttpFetchPlugin.register(shaka);
  player.getNetworkingEngine().registerRequestFilter((type, request) => {
    const {
      LICENSE,
      SERVER_CERTIFICATE
    } = shaka.net.NetworkingEngine.RequestType;

    if (type === SERVER_CERTIFICATE) {
      var _extensionOptions$drm;

      request.headers = { ...request.headers,
        ...((_extensionOptions$drm = extensionOptions.drm[player.drmInfo().keySystem]) === null || _extensionOptions$drm === void 0 ? void 0 : _extensionOptions$drm.certificateHeaders)
      };
    }

    if (type === LICENSE) {
      var _extensionOptions$drm2, _player$licenseReques, _player;

      request.headers = { ...request.headers,
        ...((_extensionOptions$drm2 = extensionOptions.drm[player.drmInfo().keySystem]) === null || _extensionOptions$drm2 === void 0 ? void 0 : _extensionOptions$drm2.headers)
      };
      (_player$licenseReques = (_player = player).licenseRequestHandler) === null || _player$licenseReques === void 0 ? void 0 : _player$licenseReques.call(_player, request);
    }
  });
  const extensions = {
    shaka,

    get mediaSource() {
      return player.mediaSource;
    },

    configureExtensions: ({
      drm
    } = {}) => {
      extensionOptions.drm = drm;
    },
    getPlaybackSpeed: () => videoElement.playbackRate,
    getVideoElement: () => videoElement,
    setQuality: restrictions => {
      if (!restrictions) return; // FIXME: Setting restrictions to {} cannot enable abr.

      player.configure('abr.restrictions', restrictions);
    },
    getVideoQuality,
    getAvailableVideoQualities,
    getSubtitles: () => player.getTextTracks().map(track => ({
      label: track.label,
      value: track.language,
      enabled: track.active
    })),
    setSubtitleTrack: lang => {
      var _player3, _player4;

      if (lang === 'off') {
        var _player2;

        (_player2 = player) === null || _player2 === void 0 ? void 0 : _player2.setTextTrackVisibility(false);
        return;
      }

      (_player3 = player) === null || _player3 === void 0 ? void 0 : _player3.selectTextLanguage(lang);
      (_player4 = player) === null || _player4 === void 0 ? void 0 : _player4.setTextTrackVisibility(true);
    },
    getAudio: () => {
      var _player5;

      const active = (_player5 = player) === null || _player5 === void 0 ? void 0 : _player5.getVariantTracks().find(track => track.active);
      return {
        lang: active === null || active === void 0 ? void 0 : active.language,
        label: active === null || active === void 0 ? void 0 : active.label
      };
    },
    getAudioList: () => player.getAudioLanguages().map(lang => ({
      lang,
      label: lang
    })),
    setAudioTrack: lang => {
      var _player6;

      if (!lang) return;
      (_player6 = player) === null || _player6 === void 0 ? void 0 : _player6.selectAudioLanguage(lang);
    },
    on: player.addEventListener.bind(player)
  };
  Object.assign(player, extensions);
  return player;
};

/* eslint-disable no-plusplus */
new UAParser();
function needNativeHls() {
  // Don't let Android phones play HLS, even if some of them report supported
  // This covers Samsung & OPPO special cases
  const isAndroid = /android/i.test(navigator.userAgent); // canPlayType isn't reliable across all iOS verion / device combinations, so also check user agent

  const isSafari = /^((?!chrome|android).)*(safari|iPad|iPhone)/i.test(navigator.userAgent); // ref: https://stackoverflow.com/a/12905122/4578017
  // none of our supported browsers other than Safari response to this

  const canPlayHls = document.createElement('video').canPlayType('application/vnd.apple.mpegURL');
  return isAndroid || /firefox/i.test(navigator.userAgent) ? '' : isSafari ? 'maybe' : canPlayHls;
}

/* eslint-disable no-param-reassign */
const keySystems = {
  widevine: 'com.widevine.alpha',
  fairplay: 'com.apple.fps.1_0',
  playready: 'com.microsoft.playready'
};

const getDrmOptions$1 = source => {
  const drm = source.drm && Object.entries(source.drm).reduce((result, [keySystemId, options]) => {
    const uri = typeof options === 'string' ? options : options.licenseUri;

    if (uri) {
      const keySystemName = keySystems[keySystemId] || keySystemId;
      result.servers[keySystemName] = uri;

      if (options.certificateUri) {
        result.advanced[keySystemName] = {
          serverCertificateUri: options.certificateUri
        };
      }
    }

    return result;
  }, {
    servers: {},
    advanced: {}
  });
  const extensions = source.drm && Object.entries(source.drm).reduce((result, [keySystemId, options]) => {
    const keySystemName = keySystems[keySystemId] || keySystemId;

    if (options.headers || options.certificateHeaders) {
      result[keySystemName] = {
        headers: options.headers,
        ...(options.certificateHeaders && {
          certificateHeaders: options.certificateHeaders
        })
      };
    }

    return result;
  }, {});
  return [drm, {
    drm: extensions
  }];
};

const FairplayKeySystem = {
  prepareContentId: contentUri => {
    const uriParts = contentUri.split('://');
    const contentId = uriParts[1] || '';
    return uriParts[0].slice(-3).toLowerCase() === 'skd' ? contentId : '';
  },
  prepareCertificate: cert => new Uint8Array(cert),
  prepareMessage: (keyMessageEvent, keySession) => {
    const spc = encodeURIComponent(keyMessageEvent.messageBase64Encoded);
    const assetId = encodeURIComponent(keySession.contentId);
    return `spc=${spc}&asset_id=${assetId}`;
  },
  prepareLicense: license => {
    if (license.substr(0, 5) === '<ckc>' && license.substr(-6) === '</ckc>') {
      return license.slice(5, -6);
    }

    return license;
  }
};

const defaultCertificateUrl = url => `${url === null || url === void 0 ? void 0 : url.replace(/\/$/, '')}/fairplay_cert`;

const getDrmConfig = ({
  url,
  headers,
  widevine = {
    level: undefined
  },
  fairplay = {}
}) => {
  if (!url) {
    return {};
  }

  return {
    widevine: {
      LA_URL: url,
      withCredentials: false,
      headers,
      ...((widevine === null || widevine === void 0 ? void 0 : widevine.level) && {
        videoRobustness: widevine === null || widevine === void 0 ? void 0 : widevine.level
      })
    },
    fairplay: {
      LA_URL: url,
      withCredentials: false,
      headers,
      certificateURL: fairplay.certificateURL || defaultCertificateUrl(url),
      certificateHeaders: fairplay.certificateHeaders,
      ...FairplayKeySystem
    },
    playready: {
      LA_URL: url,
      withCredentials: false,
      headers
    }
  };
};

const loadBitmovin = async ({
  container,
  videoElement,
  autoplay,
  config = {}
}) => {
  // Don't move module paths to array or other variables! they need to be resolved by bundlers
  const {
    Player,
    PlayerEvent
  } = await import('bitmovin-player/modules/bitmovinplayer-core');
  const nativeHls = needNativeHls();
  const bitmovinModules = [].concat(await import('bitmovin-player/modules/bitmovinplayer-engine-bitmovin'), nativeHls && (await import('bitmovin-player/modules/bitmovinplayer-engine-native')), await Promise.all([import('bitmovin-player/modules/bitmovinplayer-drm'), import('bitmovin-player/modules/bitmovinplayer-abr'), import('bitmovin-player/modules/bitmovinplayer-subtitles'), import('bitmovin-player/modules/bitmovinplayer-container-mp4')]), nativeHls && (await Promise.all([import('bitmovin-player/modules/bitmovinplayer-hls'), import('bitmovin-player/modules/bitmovinplayer-subtitles-native')])), !nativeHls && (await import('bitmovin-player/modules/bitmovinplayer-subtitles-vtt')), !nativeHls && (await import('bitmovin-player/modules/bitmovinplayer-xml')), !nativeHls && (await Promise.all([import('bitmovin-player/modules/bitmovinplayer-dash'), import('bitmovin-player/modules/bitmovinplayer-mserenderer'), import('bitmovin-player/modules/bitmovinplayer-polyfill')]))).filter(Boolean);
  bitmovinModules.forEach(module => Player.addModule(module.default));
  const extensionOptions = {
    drm: {}
  };
  let adaptationHandler;
  const player = new Player(container, {
    ui: false,
    ...config,
    playback: { ...config.playback,
      autoplay
    },
    adaptation: { ...config.adaptation,
      onVideoAdaptation: data => {
        var _adaptationHandler;

        const availableQualities = player.getAvailableVideoQualities();
        return ((_adaptationHandler = adaptationHandler) === null || _adaptationHandler === void 0 ? void 0 : _adaptationHandler({
          availableQualities,
          suggested: availableQualities.find(item => item.id === data.suggested) || {
            id: data.suggested
          }
        })) || data.suggested;
      }
    }
  });

  player.configure = ({
    drm
  }) => {
    if (drm) {
      extensionOptions.drm = drm;
    }
  };

  player.configureExtensions = ({
    drm
  } = {}) => {
    if (drm) {
      extensionOptions.licenseRequestHeaders = Object.values(drm)[0].headers;
    }
  };

  const originalLoad = player.load;

  player.load = (src, startTime, type) => {
    const {
      muted
    } = videoElement;
    originalLoad.call(player, {
      [type === 'application/x-mpegurl' ? 'hls' : 'dash']: src,
      drm: getDrmConfig({
        url: ['com.apple.fps.1_0', 'com.widevine.alpha', 'com.microsoft.playready'].map(keySystemName => {
          var _extensionOptions$drm, _extensionOptions$drm2;

          return (_extensionOptions$drm = extensionOptions.drm) === null || _extensionOptions$drm === void 0 ? void 0 : (_extensionOptions$drm2 = _extensionOptions$drm.servers) === null || _extensionOptions$drm2 === void 0 ? void 0 : _extensionOptions$drm2[keySystemName];
        }).find(Boolean),
        headers: extensionOptions.licenseRequestHeaders
      }),
      ...(startTime && {
        options: {
          startTime
        }
      })
    }).then(result => {
      // Bitmovin resets muted state after load in Safari, so restore it
      if (muted) {
        player.mute();
      } else {
        player.unmute();
      }

      return result;
    });
  };

  player.setAdaptationHandler = handler => {
    adaptationHandler = handler;
  };

  player.seekRange = player.getSeekableRange;
  player.getDrmConfig = getDrmConfig; // Mock Shaka player interface from shaka.js

  player.getSubtitles = () => {
    var _player$subtitles;

    return ((_player$subtitles = player.subtitles) === null || _player$subtitles === void 0 ? void 0 : _player$subtitles.list().map(track => ({
      label: track.label,
      value: track.lang,
      enabled: track.enabled
    }))) || [];
  };

  player.setSubtitleTrack = language => {
    var _subtitles$list;

    const {
      subtitles
    } = player;
    subtitles === null || subtitles === void 0 ? void 0 : (_subtitles$list = subtitles.list) === null || _subtitles$list === void 0 ? void 0 : _subtitles$list.call(subtitles).forEach(track => {
      // TODO consider multiple subtitles
      subtitles[language === track.lang ? 'enable' : 'disable'](track.id); // Safari need to fire cueExit manually.

      if (language === 'off') subtitles.cueExit();
    });
  };

  player.getAudioList = () => player.getAvailableAudio();

  player.setAudioTrack = language => {
    const track = player.getAvailableAudio().find(audio => audio.lang === language);

    if (track) {
      player.setAudio(track.id);
    }
  };

  player.setVideoElement(videoElement); // For a paused live stream, Bitmovin constantly download latest segments and update,
  // and may unexpectedly resume playing when playing vod-to-live, so set speed 0 to prevent.
  // #CPT-1783

  player.on(PlayerEvent.Play, () => {
    if (player.isLive()) {
      player.setPlaybackSpeed(1);
    }
  });
  player.on(PlayerEvent.Paused, () => {
    if (player.isLive()) {
      player.setPlaybackSpeed(0);
    }
  });
  player.on(PlayerEvent.SourceLoaded, () => {
    if (player.isLive()) {
      // eslint-disable-next-line no-param-reassign
      player.setPlaybackSpeed(1); // no video event fires when live stream loaded, fire one so that we can handle like VOD

      videoElement.dispatchEvent(new Event('canplay'));
    }
  });
  player.on(PlayerEvent.Error, info => {
    var _window$Sentry;

    const error = new Error(`Player: ${info.code}/${info.name}`);
    console.warn(info);

    if (/The video element has thrown a media error|Video element triggered an Error/.test(info.message)) {
      return;
    }

    (_window$Sentry = window.Sentry) === null || _window$Sentry === void 0 ? void 0 : _window$Sentry.captureException(error);
    videoElement.dispatchEvent(Object.assign(new CustomEvent('error'), {
      error: info,
      message: `Player Error: ${info.code}/${info.name}`
    }));
  });
  player.on(PlayerEvent.StallStarted, () => videoElement.dispatchEvent(new Event('waiting')));
  player.on(PlayerEvent.VideoDownloadQualityChanged, event => videoElement.dispatchEvent(new CustomEvent('downloadQualityChange', {
    detail: {
      bitrate: parseInt(event.targetQuality.bitrate / 1000, 10),
      height: event.targetQuality.height,
      width: event.targetQuality.width
    }
  })));
  return player;
};

const loadPlayer = async (videoElement, {
  container,
  autoplay,
  source,
  shaka,
  bitmovin
}) => {
  if (source !== null && source !== void 0 && source.native) {
    const player = await loadNative({
      videoElement
    });
    return player;
  } // default to Shaka


  if (shaka || !bitmovin) {
    const player = await loadShaka(videoElement, shaka);

    if (autoplay) {
      // eslint-disable-next-line no-param-reassign
      videoElement.autoplay = true;
    }

    videoElement.dispatchEvent(new CustomEvent('playerStarted'));
    return player;
  }

  if (bitmovin) {
    const player = await loadBitmovin({
      container,
      videoElement,
      autoplay,
      config: bitmovin
    });
    videoElement.dispatchEvent(new CustomEvent('playerStarted'));
    return player;
  } // TODO load other players: dash.js, hls.js

};

const once = (target, name, handler) => {
  const oneTime = (...args) => {
    handler(...args);
    target.removeEventListener(name, oneTime);
  };

  target.addEventListener(name, oneTime);
  return () => target.removeEventListener(name, oneTime);
};

/* eslint-disable no-param-reassign */
const VideoSourceTypeMap = {
  'application/dash+xml': {
    sourceKeyName: 'dash',
    extension: 'mpd'
  },
  'application/x-mpegurl': {
    sourceKeyName: 'hls',
    extension: 'm3u8'
  }
};
const mimeTypes = {
  hls: 'application/x-mpegurl',
  dash: 'application/dash+xml'
};

const getExtensionByType = srcType => {
  var _VideoSourceTypeMap$s;

  return (_VideoSourceTypeMap$s = VideoSourceTypeMap[srcType]) === null || _VideoSourceTypeMap$s === void 0 ? void 0 : _VideoSourceTypeMap$s.extension;
};

const isStringSourceWithProperExtension = (url, srcType) => {
  if (typeof url === 'string') {
    const extension = url.split('.').at(-1); // eslint-disable-next-line eqeqeq

    if (extension == getExtensionByType(srcType)) return true;
  }

  return false;
};

const matchType = (source, manifestType) => {
  var _source$type, _source$type2;

  return ((_source$type = source.type) === null || _source$type === void 0 ? void 0 : _source$type.includes(manifestType)) || ((_source$type2 = source.type) === null || _source$type2 === void 0 ? void 0 : _source$type2.toLowerCase()) === mimeTypes[manifestType] || isStringSourceWithProperExtension(source.src || source, manifestType);
};

const getDrmOptions = fallbackDrm => {
  if (!(fallbackDrm !== null && fallbackDrm !== void 0 && fallbackDrm.url)) {
    return;
  }

  const drmOptions = {
    licenseUri: fallbackDrm.url,
    headers: fallbackDrm.headers
  };
  return {
    widevine: drmOptions,
    fairplay: { ...drmOptions,
      certificateUri: `${fallbackDrm.url}/fairplay_cert`,
      ...fallbackDrm.fairplay
    },
    playready: drmOptions
  };
};
/**
 * @typedef {{src: string, type: string}} SourceObject
 * @typedef {{hls: string, dash: string}} SourceObjectAlt backward compatiable form
 *
 * @param {SourceObject[]|SourceObject|SourceObjectAlt|string} sourceOptions
 * @param {{preferManifestType?: ('dash'|'hls')}} options
 * @return {{src: string, type: string, drm: Object}}
 */


const getSource = (sourceOptions, {
  preferManifestType,
  fallbackDrm
} = {}) => {
  if (sourceOptions.dash || sourceOptions.hls) {
    const {
      dash,
      hls
    } = sourceOptions;
    return getSource([hls && {
      src: hls,
      type: mimeTypes.hls
    }, dash && {
      src: dash,
      type: mimeTypes.dash
    }].filter(Boolean), {
      preferManifestType,
      fallbackDrm
    });
  }

  if (!Array.isArray(sourceOptions)) {
    return getSource([sourceOptions], {
      preferManifestType,
      fallbackDrm
    });
  }

  if (fallbackDrm) {
    return getSource(sourceOptions.map(option => ({ ...(option.src ? option : {
        src: option
      }),
      drm: getDrmOptions(fallbackDrm)
    })), {
      preferManifestType
    });
  }

  const matched = sourceOptions.find(source => !preferManifestType || matchType(source, preferManifestType));
  const selected = matched || sourceOptions[0];

  if (!selected) {
    return;
  }

  const type = matched && preferManifestType === 'hls' && mimeTypes.hls;
  return { ...(selected.src ? selected : {
      src: selected
    }),
    type
  };
};

const timeoutError = () => new Error('request timeout');
/**
 * @param {URL|RequestInfo} url 
 * @param {RequestInit} options 
 * @param {{responseType: 'json'|'text'}}
 */


const retryRequest = (url, options = {}, {
  responseType = 'json',
  timeout = 6,
  retryTimes = 6
} = {}) => new Promise((resolve, reject) => {
  setTimeout(() => reject(timeoutError()), timeout * 1000);
  fetch(url, options).then(response => {
    var _response$responseTyp;

    return resolve(((_response$responseTyp = response[responseType]) === null || _response$responseTyp === void 0 ? void 0 : _response$responseTyp.call(response)) || response);
  }).catch(reject);
}).catch(error => {
  console.log(error);

  if (retryTimes > 0) {
    return retryRequest(url, options, {
      timeout,
      retryTimes: retryTimes - 1
    });
  }

  return error;
});

const matchAll = (input, pattern) => {
  const flags = [pattern.global && 'g', pattern.ignoreCase && 'i', pattern.multiline && 'm'].filter(Boolean).join('');
  const clone = new RegExp(pattern, flags);
  return Array.from(function* () {
    let matched = true;

    while (1) {
      matched = clone.exec(input);

      if (!matched) {
        return;
      }

      yield matched;
    }
  }());
};

const getHlsQualityOptions = async hlsUrl => {
  const manifest = await retryRequest(hlsUrl, {}, {
    responseType: 'text'
  });
  const resolutionList = matchAll(manifest, /RESOLUTION=\d+x(\d+)/g);
  return Array.from(new Set(resolutionList.map(([, height]) => ({
    height: +height
  })))).sort((a, b) => b.height - a.height);
};
 // for unit test

/* eslint-disable no-param-reassign */

const SHAKA_LIVE_DURATION = 4294967296;

const isLiveDuration = duration => duration < SHAKA_LIVE_DURATION;

const getMediaTime = (media, plugins = []) => {
  const {
    duration,
    ...data
  } = Object.assign({
    currentTime: media.currentTime,
    bufferTime: Math.max(...Array.from({
      length: media.buffered.length
    }, (_, index) => media.buffered.end(index))),
    duration: media.initialDuration // monkey patched, duration may change for DASH playback

  }, ...plugins.map(plugin => {
    var _plugin$getPlaybackSt2;

    return (_plugin$getPlaybackSt2 = plugin.getPlaybackStatus) === null || _plugin$getPlaybackSt2 === void 0 ? void 0 : _plugin$getPlaybackSt2.call(plugin);
  }));
  return { ...data,
    ...((!isLiveDuration(media.initialDuration) || Math.abs(media.duration - media.initialDuration) < 0.5) && {
      duration
    })
  };
};

const tryPatchHlsVideoQualities = async (player, hlsUrl) => {
  if (/^data/.test(hlsUrl)) {
    return;
  } // filtered manifest comes with data URI and should be ignored


  const videoQualities = await getHlsQualityOptions(hlsUrl).catch(e => {
    console.warn('Failed to get HLS video qualities', e);
  });

  if (videoQualities) {
    player.getAvailableVideoQualities = () => videoQualities;
  }
};

const load = async (media, {
  player,
  startTime,
  plugins = [],
  drm
}, source) => {
  const preferManifestType = needNativeHls() ? 'hls' : 'dash';
  const preferred = getSource(source, {
    preferManifestType,
    fallbackDrm: drm
  }); // There's no use case that changing DRM options without changing manifest URL, just skip

  if (player.lastSrc === (preferred === null || preferred === void 0 ? void 0 : preferred.src)) {
    console.info('src is unchanged, skip load', preferred.src);
    return;
  }

  player.lastSrc = preferred === null || preferred === void 0 ? void 0 : preferred.src; // playlog v2 depends on this event

  media.dispatchEvent(new Event('loadstart'));
  const merged = await plugins.reduce(async (loadChain, plugin) => {
    var _plugin$load;

    const currentSource = await loadChain;
    const overrides = await ((_plugin$load = plugin.load) === null || _plugin$load === void 0 ? void 0 : _plugin$load.call(plugin, currentSource, {
      video: media,
      player,
      source: currentSource,
      startTime,
      streamFormat: preferManifestType,
      reload: async () => {
        // Bitmovin unexpectedly restores muted state, so save to restore
        const restoreMuted = player.isMuted && {
          muted: player.isMuted()
        };
        player.lastSrc = '';
        await load(media, {
          player,
          startTime,
          plugins,
          drm
        }, source);

        if (restoreMuted) {
          player[restoreMuted.muted ? 'mute' : 'unmute']();
        }
      }
    }));
    return overrides ? { ...currentSource,
      ...(overrides.url && {
        src: overrides.url
      }),
      ...(overrides.startTime >= 0 && {
        startTime: overrides.startTime
      })
    } : currentSource;
  }, { ...preferred,
    startTime
  });
  media.addEventListener('durationchange', () => {
    // media duration may change when playing VOD to live or SSAI streams, save it here for convenience
    media.initialDuration = media.duration;
  }, {
    once: true
  });
  const [drmOptions, extensions] = getDrmOptions$1(preferred);
  player.configure({
    drm: drmOptions
  });
  player.configureExtensions(extensions);
  let loadStartTime;

  if (merged.type !== 'application/x-mpegurl') {
    loadStartTime = merged.startTime;
  } else if (merged.startTime > 0) {
    once(media, 'loadeddata', event => {
      event.preventDefault();
      setTimeout(() => {
        media.currentTime = merged.startTime;
      }, 66);
    });
  }

  if (merged.type === 'application/x-mpegurl') {
    await tryPatchHlsVideoQualities(player, merged.src);
  }

  return player.unload().then(() => player.load(merged.src, loadStartTime, merged.type)).catch(error => {
    media.dispatchEvent(Object.assign(new CustomEvent('error'), {
      error
    }));
  });
};

const seek = async (media, {
  player,
  plugins = []
}, time, issuer) => {
  const HAVE_METADATA = 1;

  if (media.readyState < HAVE_METADATA) {
    await new Promise(resolve => {
      media.addEventListener('loadeddata', resolve, {
        once: true
      });
    });
  } // TODO skip seeking to too near point, consider SSAI cases


  const seekPlugin = plugins.find(plugin => typeof plugin.handleSeek === 'function' && plugin.isActive());

  const seekInternal = seekTime => {
    var _player$seek;

    // seeking to end video may cause Shaka glich, so move back a little
    if (seekTime <= media.duration && seekTime >= media.duration - 0.1) {
      return seekInternal(media.duration - 0.7);
    } // when playing in Bitmovin, must call player.seek to sync internal time


    (_player$seek = player.seek) === null || _player$seek === void 0 ? void 0 : _player$seek.call(player, seekTime, issuer); // player.seek sets time after adding segments,
    // set again to reflect instantly

    media.currentTime = seekTime;
    once(media, 'seeked', () => {
      // when seeking to the end it may result in a few seconds earlier
      if (Math.abs(seekTime - media.currentTime) > 0.5) {
        media.currentTime = seekTime;
      }
    });
  };

  if (seekPlugin) {
    seekPlugin.handleSeek(time, seekInternal);
  } else {
    seekInternal(time);
  }
};

export { getMediaTime, load, loadPlayer, seek };
