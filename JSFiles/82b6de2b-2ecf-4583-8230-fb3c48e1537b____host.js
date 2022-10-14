(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.host = factory());
}(this, (function () { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var setPrototypeOf = createCommonjsModule(function (module) {
	function _setPrototypeOf(o, p) {
	  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	module.exports = _setPrototypeOf;
	});

	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	var isNativeReflectConstruct = _isNativeReflectConstruct;

	var construct = createCommonjsModule(function (module) {
	function _construct(Parent, args, Class) {
	  if (isNativeReflectConstruct()) {
	    module.exports = _construct = Reflect.construct;
	  } else {
	    module.exports = _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }

	  return _construct.apply(null, arguments);
	}

	module.exports = _construct;
	});

	function _inheritsLoose(subClass, superClass) {
	  subClass.prototype = Object.create(superClass.prototype);
	  subClass.prototype.constructor = subClass;
	  subClass.__proto__ = superClass;
	}

	var inheritsLoose = _inheritsLoose;

	var LOG_PREFIX = "[Simple-XDM] ";
	var nativeBind = Function.prototype.bind;
	var util = {
	  locationOrigin: function locationOrigin() {
	    if (!window.location.origin) {
	      return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
	    } else {
	      return window.location.origin;
	    }
	  },
	  randomString: function randomString() {
	    return Math.floor(Math.random() * 1000000000).toString(16);
	  },
	  isString: function isString(str) {
	    return typeof str === "string" || str instanceof String;
	  },
	  argumentsToArray: function argumentsToArray(arrayLike) {
	    return Array.prototype.slice.call(arrayLike);
	  },
	  argumentNames: function argumentNames(fn) {
	    return fn.toString().replace(/((\/\/.*$)|(\/\*[^]*?\*\/))/mg, '') // strip comments
	    .replace(/[^(]+\(([^)]*)[^]+/, '$1') // get signature
	    .match(/([^\s,]+)/g) || [];
	  },
	  hasCallback: function hasCallback(args) {
	    var length = args.length;
	    return length > 0 && typeof args[length - 1] === 'function';
	  },
	  error: function error(msg) {
	    if (window.console && window.console.error) {
	      var outputError = [];

	      if (typeof msg === "string") {
	        outputError.push(LOG_PREFIX + msg);
	        outputError = outputError.concat(Array.prototype.slice.call(arguments, 1));
	      } else {
	        outputError.push(LOG_PREFIX);
	        outputError = outputError.concat(Array.prototype.slice.call(arguments));
	      }

	      window.console.error.apply(null, outputError);
	    }
	  },
	  warn: function warn(msg) {
	    if (window.console) {
	      console.warn(LOG_PREFIX + msg);
	    }
	  },
	  log: function log(msg) {
	    if (window.console) {
	      window.console.log(LOG_PREFIX + msg);
	    }
	  },
	  _bind: function _bind(thisp, fn) {
	    if (nativeBind && fn.bind === nativeBind) {
	      return fn.bind(thisp);
	    }

	    return function () {
	      return fn.apply(thisp, arguments);
	    };
	  },
	  throttle: function throttle(func, wait, context) {
	    var previous = 0;
	    return function () {
	      var now = Date.now();

	      if (now - previous > wait) {
	        previous = now;
	        func.apply(context, arguments);
	      }
	    };
	  },
	  each: function each(list, iteratee) {
	    var length;
	    var key;

	    if (list) {
	      length = list.length;

	      if (length != null && typeof list !== 'function') {
	        key = 0;

	        while (key < length) {
	          if (iteratee.call(list[key], key, list[key]) === false) {
	            break;
	          }

	          key += 1;
	        }
	      } else {
	        for (key in list) {
	          if (list.hasOwnProperty(key)) {
	            if (iteratee.call(list[key], key, list[key]) === false) {
	              break;
	            }
	          }
	        }
	      }
	    }
	  },
	  extend: function extend(dest) {
	    var args = arguments;
	    var srcs = [].slice.call(args, 1, args.length);
	    srcs.forEach(function (source) {
	      if (typeof source === "object") {
	        Object.getOwnPropertyNames(source).forEach(function (name) {
	          dest[name] = source[name];
	        });
	      }
	    });
	    return dest;
	  },
	  sanitizeStructuredClone: function sanitizeStructuredClone(object) {
	    var whiteList = [Boolean, String, Date, RegExp, Blob, File, FileList, ArrayBuffer];
	    var blackList = [Error, Node];
	    var warn = util.warn;
	    var visitedObjects = [];

	    function _clone(value) {
	      if (typeof value === 'function') {
	        warn("A function was detected and removed from the message.");
	        return null;
	      }

	      if (blackList.some(function (t) {
	        if (value instanceof t) {
	          warn(t.name + " object was detected and removed from the message.");
	          return true;
	        }

	        return false;
	      })) {
	        return {};
	      }

	      if (value && typeof value === 'object' && whiteList.every(function (t) {
	        return !(value instanceof t);
	      })) {
	        var newValue;

	        if (Array.isArray(value)) {
	          newValue = value.map(function (element) {
	            return _clone(element);
	          });
	        } else {
	          if (visitedObjects.indexOf(value) > -1) {
	            warn("A circular reference was detected and removed from the message.");
	            return null;
	          }

	          visitedObjects.push(value);
	          newValue = {};

	          for (var name in value) {
	            if (value.hasOwnProperty(name)) {
	              var clonedValue = _clone(value[name]);

	              if (clonedValue !== null) {
	                newValue[name] = clonedValue;
	              }
	            }
	          }

	          visitedObjects.pop();
	        }

	        return newValue;
	      }

	      return value;
	    }

	    return _clone(object);
	  },
	  getOrigin: function getOrigin(url, base) {
	    // everything except IE11
	    if (typeof URL === 'function') {
	      try {
	        return new URL(url, base).origin;
	      } catch (e) {}
	    } // ie11 + safari 10


	    var doc = document.implementation.createHTMLDocument('');

	    if (base) {
	      var baseElement = doc.createElement('base');
	      baseElement.href = base;
	      doc.head.appendChild(baseElement);
	    }

	    var anchorElement = doc.createElement('a');
	    anchorElement.href = url;
	    doc.body.appendChild(anchorElement);
	    var origin = anchorElement.protocol + '//' + anchorElement.hostname; //ie11, only include port if referenced in initial URL

	    if (url.match(/\/\/[^/]+:[0-9]+\//)) {
	      origin += anchorElement.port ? ':' + anchorElement.port : '';
	    }

	    return origin;
	  }
	};

	var PostMessage = /*#__PURE__*/function () {
	  function PostMessage(data) {
	    var d = data || {};

	    this._registerListener(d.listenOn);
	  }

	  var _proto = PostMessage.prototype;

	  _proto._registerListener = function _registerListener(listenOn) {
	    if (!listenOn || !listenOn.addEventListener) {
	      listenOn = window;
	    }

	    listenOn.addEventListener("message", util._bind(this, this._receiveMessage), false);
	  };

	  _proto._receiveMessage = function _receiveMessage(event) {
	    var handler = this._messageHandlers[event.data.type],
	        extensionId = event.data.eid,
	        reg;

	    if (extensionId && this._registeredExtensions) {
	      reg = this._registeredExtensions[extensionId];
	    }

	    if (!handler || !this._checkOrigin(event, reg)) {
	      return false;
	    }

	    handler.call(this, event, reg);
	  };

	  return PostMessage;
	}();

	var VALID_EVENT_TIME_MS = 30000; //30 seconds

	var XDMRPC = /*#__PURE__*/function (_PostMessage) {
	  inheritsLoose(XDMRPC, _PostMessage);

	  var _proto = XDMRPC.prototype;

	  _proto._padUndefinedArguments = function _padUndefinedArguments(array, length) {
	    return array.length >= length ? array : array.concat(new Array(length - array.length));
	  };

	  function XDMRPC(config) {
	    var _this;

	    config = config || {};
	    _this = _PostMessage.call(this, config) || this;
	    _this._registeredExtensions = config.extensions || {};
	    _this._registeredAPIModules = {};
	    _this._registeredAPIModules._globals = {};
	    _this._pendingCallbacks = {};
	    _this._keycodeCallbacks = {};
	    _this._clickHandler = null;
	    _this._pendingEvents = {};
	    _this._messageHandlers = {
	      init: _this._handleInit,
	      req: _this._handleRequest,
	      resp: _this._handleResponse,
	      broadcast: _this._handleBroadcast,
	      event_query: _this._handleEventQuery,
	      key_triggered: _this._handleKeyTriggered,
	      addon_clicked: _this._handleAddonClick,
	      get_host_offset: _this._getHostOffset,
	      unload: _this._handleUnload,
	      sub: _this._handleSubInit
	    };
	    return _this;
	  }

	  _proto._verifyAPI = function _verifyAPI(event, reg) {
	    var untrustedTargets = event.data.targets;

	    if (!untrustedTargets) {
	      return;
	    }

	    var trustedSpec = this.getApiSpec();
	    var tampered = false;

	    function check(trusted, untrusted) {
	      Object.getOwnPropertyNames(untrusted).forEach(function (name) {
	        if (typeof untrusted[name] === 'object' && trusted[name]) {
	          check(trusted[name], untrusted[name]);
	        } else {
	          if (untrusted[name] === 'parent' && trusted[name]) {
	            tampered = true;
	          }
	        }
	      });
	    }

	    check(trustedSpec, untrustedTargets);
	    event.source.postMessage({
	      type: 'api_tamper',
	      tampered: tampered
	    }, reg.extension.url);
	  };

	  _proto._handleInit = function _handleInit(event, reg) {
	    this._registeredExtensions[reg.extension_id].source = event.source;

	    if (reg.initCallback) {
	      reg.initCallback(event.data.eid);
	      delete reg.initCallback;
	    }

	    if (event.data.targets) {
	      this._verifyAPI(event, reg);
	    }
	  } // postMessage method to do registerExtension
	  ;

	  _proto._handleSubInit = function _handleSubInit(event, reg) {
	    if (reg.extension.options.noSub) {
	      util.error("Sub-Extension requested by [" + reg.extension.addon_key + "] but feature is disabled");
	    } else {
	      this.registerExtension(event.data.ext.id, {
	        extension: event.data.ext
	      });
	    }
	  };

	  _proto._getHostOffset = function _getHostOffset(event, _window) {
	    var hostWindow = event.source;
	    var hostFrameOffset = null;
	    var windowReference = _window || window; // For testing

	    if (windowReference === windowReference.top && typeof windowReference.getHostOffsetFunctionOverride === 'function') {
	      hostFrameOffset = windowReference.getHostOffsetFunctionOverride(hostWindow);
	    }

	    if (typeof hostFrameOffset !== 'number') {
	      hostFrameOffset = 0; // Find the closest frame that has the same origin as event source

	      while (!this._hasSameOrigin(hostWindow)) {
	        // Climb up the iframe tree 1 layer
	        hostFrameOffset++;
	        hostWindow = hostWindow.parent;
	      }
	    }

	    event.source.postMessage({
	      hostFrameOffset: hostFrameOffset
	    }, event.origin);
	  };

	  _proto._hasSameOrigin = function _hasSameOrigin(window) {
	    if (window === window.top) {
	      return true;
	    }

	    try {
	      // Try set & read a variable on the given window
	      // If we can successfully read the value then it means the given window has the same origin
	      // as the window that is currently executing the script
	      var testVariableName = 'test_var_' + Math.random().toString(16).substr(2);
	      window[testVariableName] = true;
	      return window[testVariableName];
	    } catch (e) {// A exception will be thrown if the windows doesn't have the same origin
	    }

	    return false;
	  };

	  _proto._handleResponse = function _handleResponse(event) {
	    var data = event.data;
	    var pendingCallback = this._pendingCallbacks[data.mid];

	    if (pendingCallback) {
	      delete this._pendingCallbacks[data.mid];
	      pendingCallback.apply(window, data.args);
	    }
	  };

	  _proto.registerRequestNotifier = function registerRequestNotifier(cb) {
	    this._registeredRequestNotifier = cb;
	  };

	  _proto._handleRequest = function _handleRequest(event, reg) {
	    function sendResponse() {
	      var args = util.sanitizeStructuredClone(util.argumentsToArray(arguments));
	      event.source.postMessage({
	        mid: event.data.mid,
	        type: 'resp',
	        forPlugin: true,
	        args: args
	      }, reg.extension.url);
	    }

	    var data = event.data;
	    var module = this._registeredAPIModules[data.mod];
	    var extension = this.getRegisteredExtensions(reg.extension)[0];

	    if (module) {
	      var fnName = data.fn;

	      if (data._cls) {
	        var Cls = module[data._cls];
	        var ns = data.mod + '-' + data._cls + '-';
	        sendResponse._id = data._id;

	        if (fnName === 'constructor') {
	          if (!Cls._construct) {
	            Cls.constructor.prototype._destroy = function () {
	              delete this._context._proxies[ns + this._id];
	            };

	            Cls._construct = function () {
	              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	                args[_key] = arguments[_key];
	              }

	              var inst = construct(Cls.constructor, args);

	              var callback = args[args.length - 1];
	              inst._id = callback._id;
	              inst._context = callback._context;
	              inst._context._proxies[ns + inst._id] = inst;
	              return inst;
	            };
	          }

	          module = Cls;
	          fnName = '_construct';
	        } else {
	          module = extension._proxies[ns + data._id];
	        }
	      }

	      var method = module[fnName];

	      if (method) {
	        var methodArgs = data.args;
	        var padLength = method.length - 1;

	        if (fnName === '_construct') {
	          padLength = module.constructor.length - 1;
	        }

	        sendResponse._context = extension;
	        methodArgs = this._padUndefinedArguments(methodArgs, padLength);
	        methodArgs.push(sendResponse);
	        var promiseResult = method.apply(module, methodArgs);

	        if (method.returnsPromise) {
	          if (!(typeof promiseResult === 'object' || typeof promiseResult === 'function') || typeof promiseResult.then !== 'function') {
	            sendResponse('Defined module method did not return a promise.');
	          } else {
	            promiseResult.then(function (result) {
	              sendResponse(undefined, result);
	            }).catch(function (err) {
	              err = err instanceof Error ? err.message : err;
	              sendResponse(err);
	            });
	          }
	        }

	        if (this._registeredRequestNotifier) {
	          this._registeredRequestNotifier.call(null, {
	            module: data.mod,
	            fn: data.fn,
	            type: data.type,
	            addon_key: reg.extension.addon_key,
	            key: reg.extension.key,
	            extension_id: reg.extension_id
	          });
	        }
	      }
	    }
	  };

	  _proto._handleBroadcast = function _handleBroadcast(event, reg) {
	    var event_data = event.data;

	    var targetSpec = function targetSpec(r) {
	      return r.extension.addon_key === reg.extension.addon_key && r.extension_id !== reg.extension_id;
	    };

	    this.dispatch(event_data.etyp, targetSpec, event_data.evnt, null, null);
	  };

	  _proto._handleKeyTriggered = function _handleKeyTriggered(event, reg) {
	    var eventData = event.data;

	    var keycodeEntry = this._keycodeKey(eventData.keycode, eventData.modifiers, reg.extension_id);

	    var listeners = this._keycodeCallbacks[keycodeEntry];

	    if (listeners) {
	      listeners.forEach(function (listener) {
	        listener.call(null, {
	          addon_key: reg.extension.addon_key,
	          key: reg.extension.key,
	          extension_id: reg.extension_id,
	          keycode: eventData.keycode,
	          modifiers: eventData.modifiers
	        });
	      }, this);
	    }
	  };

	  _proto.defineAPIModule = function defineAPIModule(module, moduleName) {
	    moduleName = moduleName || '_globals';
	    this._registeredAPIModules[moduleName] = util.extend({}, this._registeredAPIModules[moduleName] || {}, module);
	    return this._registeredAPIModules;
	  };

	  _proto._pendingEventKey = function _pendingEventKey(targetSpec, time) {
	    var key = targetSpec.addon_key || 'global';

	    if (targetSpec.key) {
	      key = key + "@@" + targetSpec.key;
	    }

	    key = key + "@@" + time;
	    return key;
	  };

	  _proto.queueEvent = function queueEvent(type, targetSpec, event, callback) {
	    var loaded_frame,
	        targets = this._findRegistrations(targetSpec);

	    loaded_frame = targets.some(function (target) {
	      return target.registered_events !== undefined;
	    }, this);

	    if (loaded_frame) {
	      this.dispatch(type, targetSpec, event, callback);
	    } else {
	      this._cleanupInvalidEvents();

	      var time = new Date().getTime();
	      this._pendingEvents[this._pendingEventKey(targetSpec, time)] = {
	        type: type,
	        targetSpec: targetSpec,
	        event: event,
	        callback: callback,
	        time: time,
	        uid: util.randomString()
	      };
	    }
	  };

	  _proto._cleanupInvalidEvents = function _cleanupInvalidEvents() {
	    var _this2 = this;

	    var now = new Date().getTime();
	    var keys = Object.keys(this._pendingEvents);
	    keys.forEach(function (index) {
	      var element = _this2._pendingEvents[index];
	      var eventIsValid = now - element.time <= VALID_EVENT_TIME_MS;

	      if (!eventIsValid) {
	        delete _this2._pendingEvents[index];
	      }
	    });
	  };

	  _proto._handleEventQuery = function _handleEventQuery(message, extension) {
	    var _this3 = this;

	    var executed = {};
	    var now = new Date().getTime();
	    var keys = Object.keys(this._pendingEvents);
	    keys.forEach(function (index) {
	      var element = _this3._pendingEvents[index];
	      var eventIsValid = now - element.time <= VALID_EVENT_TIME_MS;
	      var isSameTarget = !element.targetSpec || _this3._findRegistrations(element.targetSpec).length !== 0;

	      if (isSameTarget && element.targetSpec.key) {
	        isSameTarget = element.targetSpec.addon_key === extension.extension.addon_key && element.targetSpec.key === extension.extension.key;
	      }

	      if (eventIsValid && isSameTarget) {
	        executed[index] = element;
	        element.targetSpec = element.targetSpec || {};

	        _this3.dispatch(element.type, element.targetSpec, element.event, element.callback, message.source);
	      } else if (!eventIsValid) {
	        delete _this3._pendingEvents[index];
	      }
	    });
	    this._registeredExtensions[extension.extension_id].registered_events = message.data.args;
	    return executed;
	  };

	  _proto._handleUnload = function _handleUnload(event, reg) {
	    if (!reg) {
	      return;
	    }

	    if (reg.extension_id && this._registeredExtensions[reg.extension_id]) {
	      delete this._registeredExtensions[reg.extension_id].source;
	    }

	    if (reg.unloadCallback) {
	      reg.unloadCallback(event.data.eid);
	    }
	  };

	  _proto.dispatch = function dispatch(type, targetSpec, event, callback, source) {
	    function sendEvent(reg, evnt) {
	      if (reg.source && reg.source.postMessage) {
	        var mid;

	        if (callback) {
	          mid = util.randomString();
	          this._pendingCallbacks[mid] = callback;
	        }

	        reg.source.postMessage({
	          type: 'evt',
	          mid: mid,
	          etyp: type,
	          evnt: evnt
	        }, reg.extension.url);
	      }
	    }

	    var registrations = this._findRegistrations(targetSpec || {});

	    registrations.forEach(function (reg) {
	      if (source && !reg.source) {
	        reg.source = source;
	      }

	      if (reg.source) {
	        util._bind(this, sendEvent)(reg, event);
	      }
	    }, this);
	  };

	  _proto._findRegistrations = function _findRegistrations(targetSpec) {
	    var _this4 = this;

	    if (this._registeredExtensions.length === 0) {
	      util.error('no registered extensions', this._registeredExtensions);
	      return [];
	    }

	    var keys = Object.getOwnPropertyNames(targetSpec);
	    var registrations = Object.getOwnPropertyNames(this._registeredExtensions).map(function (key) {
	      return _this4._registeredExtensions[key];
	    });

	    if (targetSpec instanceof Function) {
	      return registrations.filter(targetSpec);
	    } else {
	      return registrations.filter(function (reg) {
	        return keys.every(function (key) {
	          return reg.extension[key] === targetSpec[key];
	        });
	      });
	    }
	  };

	  _proto.registerExtension = function registerExtension(extension_id, data) {
	    data._proxies = {};
	    data.extension_id = extension_id;
	    this._registeredExtensions[extension_id] = data;
	  };

	  _proto._keycodeKey = function _keycodeKey(key, modifiers, extension_id) {
	    var code = key;

	    if (modifiers) {
	      if (typeof modifiers === "string") {
	        modifiers = [modifiers];
	      }

	      modifiers.sort();
	      modifiers.forEach(function (modifier) {
	        code += '$$' + modifier;
	      }, this);
	    }

	    return code + '__' + extension_id;
	  };

	  _proto.registerKeyListener = function registerKeyListener(extension_id, key, modifiers, callback) {
	    if (typeof modifiers === "string") {
	      modifiers = [modifiers];
	    }

	    var reg = this._registeredExtensions[extension_id];

	    var keycodeEntry = this._keycodeKey(key, modifiers, extension_id);

	    if (!this._keycodeCallbacks[keycodeEntry]) {
	      this._keycodeCallbacks[keycodeEntry] = [];
	      reg.source.postMessage({
	        type: 'key_listen',
	        keycode: key,
	        modifiers: modifiers,
	        action: 'add'
	      }, reg.extension.url);
	    }

	    this._keycodeCallbacks[keycodeEntry].push(callback);
	  };

	  _proto.unregisterKeyListener = function unregisterKeyListener(extension_id, key, modifiers, callback) {
	    var keycodeEntry = this._keycodeKey(key, modifiers, extension_id);

	    var potentialCallbacks = this._keycodeCallbacks[keycodeEntry];
	    var reg = this._registeredExtensions[extension_id];

	    if (potentialCallbacks) {
	      if (callback) {
	        var index = potentialCallbacks.indexOf(callback);

	        this._keycodeCallbacks[keycodeEntry].splice(index, 1);
	      } else {
	        delete this._keycodeCallbacks[keycodeEntry];
	      }

	      if (reg.source && reg.source.postMessage) {
	        reg.source.postMessage({
	          type: 'key_listen',
	          keycode: key,
	          modifiers: modifiers,
	          action: 'remove'
	        }, reg.extension.url);
	      }
	    }
	  };

	  _proto.registerClickHandler = function registerClickHandler(callback) {
	    if (typeof callback !== 'function') {
	      throw new Error('callback must be a function');
	    }

	    if (this._clickHandler !== null) {
	      throw new Error('ClickHandler already registered');
	    }

	    this._clickHandler = callback;
	  };

	  _proto._handleAddonClick = function _handleAddonClick(event, reg) {
	    if (typeof this._clickHandler === 'function') {
	      this._clickHandler({
	        addon_key: reg.extension.addon_key,
	        key: reg.extension.key,
	        extension_id: reg.extension_id
	      });
	    }
	  };

	  _proto.unregisterClickHandler = function unregisterClickHandler() {
	    this._clickHandler = null;
	  };

	  _proto.getApiSpec = function getApiSpec() {
	    var that = this;

	    function createModule(moduleName) {
	      var module = that._registeredAPIModules[moduleName];

	      if (!module) {
	        throw new Error("unregistered API module: " + moduleName);
	      }

	      function getModuleDefinition(mod) {
	        return Object.getOwnPropertyNames(mod).reduce(function (accumulator, memberName) {
	          var member = mod[memberName];

	          switch (typeof member) {
	            case 'function':
	              accumulator[memberName] = {
	                args: util.argumentNames(member),
	                returnsPromise: member.returnsPromise || false
	              };
	              break;

	            case 'object':
	              if (member.hasOwnProperty('constructor')) {
	                accumulator[memberName] = getModuleDefinition(member);
	              }

	              break;
	          }

	          return accumulator;
	        }, {});
	      }

	      return getModuleDefinition(module);
	    }

	    return Object.getOwnPropertyNames(this._registeredAPIModules).reduce(function (accumulator, moduleName) {
	      accumulator[moduleName] = createModule(moduleName);
	      return accumulator;
	    }, {});
	  };

	  _proto._originEqual = function _originEqual(url, origin) {
	    function strCheck(str) {
	      return typeof str === 'string' && str.length > 0;
	    }

	    var urlOrigin = util.getOrigin(url); // check strings are strings and they contain something

	    if (!strCheck(url) || !strCheck(origin) || !strCheck(urlOrigin)) {
	      return false;
	    }

	    return origin === urlOrigin;
	  } // validate origin of postMessage
	  ;

	  _proto._checkOrigin = function _checkOrigin(event, reg) {
	    var no_source_types = ['init'];
	    var isNoSourceType = reg && !reg.source && no_source_types.indexOf(event.data.type) > -1;
	    var sourceTypeMatches = reg && event.source === reg.source;

	    var hasExtensionUrl = reg && this._originEqual(reg.extension.url, event.origin);

	    var isValidOrigin = hasExtensionUrl && (isNoSourceType || sourceTypeMatches); // get_host_offset fires before init

	    if (event.data.type === 'get_host_offset' && window === window.top) {
	      isValidOrigin = true;
	    } // check undefined for chromium (Issue 395010)


	    if (event.data.type === 'unload' && (sourceTypeMatches || event.source === undefined)) {
	      isValidOrigin = true;
	    }

	    return isValidOrigin;
	  };

	  _proto.getRegisteredExtensions = function getRegisteredExtensions(filter) {
	    if (filter) {
	      return this._findRegistrations(filter);
	    }

	    return this._registeredExtensions;
	  };

	  _proto.unregisterExtension = function unregisterExtension(filter) {
	    var registrations = this._findRegistrations(filter);

	    if (registrations.length !== 0) {
	      registrations.forEach(function (registration) {
	        var _this5 = this;

	        var keys = Object.keys(this._pendingEvents);
	        keys.forEach(function (index) {
	          var element = _this5._pendingEvents[index];
	          var targetSpec = element.targetSpec || {};

	          if (targetSpec.addon_key === registration.extension.addon_key && targetSpec.key === registration.extension.key) {
	            delete _this5._pendingEvents[index];
	          }
	        });
	        delete this._registeredExtensions[registration.extension_id];
	      }, this);
	    }
	  };

	  return XDMRPC;
	}(PostMessage);

	var Connect = /*#__PURE__*/function () {
	  function Connect() {
	    this._xdm = new XDMRPC();
	  }
	  /**
	   * Send a message to iframes matching the targetSpec. This message is added to
	   *  a message queue for delivery to ensure the message is received if an iframe
	   *  has not yet loaded
	   *
	   * @param type The name of the event type
	   * @param targetSpec The spec to match against extensions when sending this event
	   * @param event The event payload
	   * @param callback A callback to be executed when the remote iframe calls its callback
	   */


	  var _proto = Connect.prototype;

	  _proto.dispatch = function dispatch(type, targetSpec, event, callback) {
	    this._xdm.queueEvent(type, targetSpec, event, callback);

	    return this.getExtensions(targetSpec);
	  }
	  /**
	   * Send a message to iframes matching the targetSpec immediately. This message will
	   *  only be sent to iframes that are already open, and will not be delivered if none
	   *  are currently open.
	   *
	   * @param type The name of the event type
	   * @param targetSpec The spec to match against extensions when sending this event
	   * @param event The event payload
	   */
	  ;

	  _proto.broadcast = function broadcast(type, targetSpec, event) {
	    this._xdm.dispatch(type, targetSpec, event, null, null);

	    return this.getExtensions(targetSpec);
	  };

	  _proto._createId = function _createId(extension) {
	    if (!extension.addon_key || !extension.key) {
	      throw Error('Extensions require addon_key and key');
	    }

	    return extension.addon_key + '__' + extension.key + '__' + util.randomString();
	  }
	  /**
	  * Creates a new iframed module, without actually creating the DOM element.
	  * The iframe attributes are passed to the 'setupCallback', which is responsible for creating
	  * the DOM element and returning the window reference.
	  *
	  * @param extension The extension definition. Example:
	  *   {
	  *     addon_key: 'my-addon',
	  *     key: 'my-module',
	  *     url: 'https://example.com/my-module',
	  *     options: {
	  *         autoresize: false,
	  *         hostOrigin: 'https://connect-host.example.com/'
	  *     }
	  *   }
	  *
	  * @param initCallback The optional initCallback is called when the bridge between host and iframe is established.
	  **/
	  ;

	  _proto.create = function create(extension, initCallback, unloadCallback) {
	    var extension_id = this.registerExtension(extension, initCallback, unloadCallback);
	    var options = extension.options || {};
	    var data = {
	      extension_id: extension_id,
	      api: this._xdm.getApiSpec(),
	      origin: util.locationOrigin(),
	      options: options
	    };
	    return {
	      id: extension_id,
	      name: JSON.stringify(data),
	      src: extension.url
	    };
	  };

	  _proto.registerRequestNotifier = function registerRequestNotifier(callback) {
	    this._xdm.registerRequestNotifier(callback);
	  };

	  _proto.registerExtension = function registerExtension(extension, initCallback, unloadCallback) {
	    var extension_id = this._createId(extension);

	    this._xdm.registerExtension(extension_id, {
	      extension: extension,
	      initCallback: initCallback,
	      unloadCallback: unloadCallback
	    });

	    return extension_id;
	  };

	  _proto.registerKeyListener = function registerKeyListener(extension_id, key, modifiers, callback) {
	    this._xdm.registerKeyListener(extension_id, key, modifiers, callback);
	  };

	  _proto.unregisterKeyListener = function unregisterKeyListener(extension_id, key, modifiers, callback) {
	    this._xdm.unregisterKeyListener(extension_id, key, modifiers, callback);
	  };

	  _proto.registerClickHandler = function registerClickHandler(callback) {
	    this._xdm.registerClickHandler(callback);
	  };

	  _proto.unregisterClickHandler = function unregisterClickHandler() {
	    this._xdm.unregisterClickHandler();
	  };

	  _proto.defineModule = function defineModule(moduleName, module, options) {
	    this._xdm.defineAPIModule(module, moduleName, options);
	  };

	  _proto.defineGlobals = function defineGlobals(module) {
	    this._xdm.defineAPIModule(module);
	  };

	  _proto.getExtensions = function getExtensions(filter) {
	    return this._xdm.getRegisteredExtensions(filter);
	  };

	  _proto.unregisterExtension = function unregisterExtension(filter) {
	    return this._xdm.unregisterExtension(filter);
	  };

	  _proto.returnsPromise = function returnsPromise(wrappedMethod) {
	    wrappedMethod.returnsPromise = true;
	  };

	  return Connect;
	}();

	var host = new Connect();

	var domain; // This constructor is used to store event handlers. Instantiating this is
	// faster than explicitly calling `Object.create(null)` to get a "clean" empty
	// object (tested with v8 v4.9).

	function EventHandlers() {}

	EventHandlers.prototype = Object.create(null);

	function EventEmitter() {
	  EventEmitter.init.call(this);
	}
	// require('events') === require('events').EventEmitter

	EventEmitter.EventEmitter = EventEmitter;
	EventEmitter.usingDomains = false;
	EventEmitter.prototype.domain = undefined;
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.

	EventEmitter.defaultMaxListeners = 10;

	EventEmitter.init = function () {
	  this.domain = null;

	  if (EventEmitter.usingDomains) {
	    // if there is an active domain, then attach to it.
	    if (domain.active ) ;
	  }

	  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
	    this._events = new EventHandlers();
	    this._eventsCount = 0;
	  }

	  this._maxListeners = this._maxListeners || undefined;
	}; // Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.


	EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
	  if (typeof n !== 'number' || n < 0 || isNaN(n)) throw new TypeError('"n" argument must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	function $getMaxListeners(that) {
	  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
	  return that._maxListeners;
	}

	EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
	  return $getMaxListeners(this);
	}; // These standalone emit* functions are used to optimize calling of event
	// handlers for fast cases because emit() itself often has a variable number of
	// arguments and can be deoptimized because of that. These functions always have
	// the same number of arguments and thus do not get deoptimized, so the code
	// inside them can execute faster.


	function emitNone(handler, isFn, self) {
	  if (isFn) handler.call(self);else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);

	    for (var i = 0; i < len; ++i) {
	      listeners[i].call(self);
	    }
	  }
	}

	function emitOne(handler, isFn, self, arg1) {
	  if (isFn) handler.call(self, arg1);else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);

	    for (var i = 0; i < len; ++i) {
	      listeners[i].call(self, arg1);
	    }
	  }
	}

	function emitTwo(handler, isFn, self, arg1, arg2) {
	  if (isFn) handler.call(self, arg1, arg2);else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);

	    for (var i = 0; i < len; ++i) {
	      listeners[i].call(self, arg1, arg2);
	    }
	  }
	}

	function emitThree(handler, isFn, self, arg1, arg2, arg3) {
	  if (isFn) handler.call(self, arg1, arg2, arg3);else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);

	    for (var i = 0; i < len; ++i) {
	      listeners[i].call(self, arg1, arg2, arg3);
	    }
	  }
	}

	function emitMany(handler, isFn, self, args) {
	  if (isFn) handler.apply(self, args);else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);

	    for (var i = 0; i < len; ++i) {
	      listeners[i].apply(self, args);
	    }
	  }
	}

	EventEmitter.prototype.emit = function emit(type) {
	  var er, handler, len, args, i, events, domain;
	  var doError = type === 'error';
	  events = this._events;
	  if (events) doError = doError && events.error == null;else if (!doError) return false;
	  domain = this.domain; // If there is no 'error' event listener then throw.

	  if (doError) {
	    er = arguments[1];

	    if (domain) {
	      if (!er) er = new Error('Uncaught, unspecified "error" event');
	      er.domainEmitter = this;
	      er.domain = domain;
	      er.domainThrown = false;
	      domain.emit('error', er);
	    } else if (er instanceof Error) {
	      throw er; // Unhandled 'error' event
	    } else {
	      // At least give some kind of context to the user
	      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	      err.context = er;
	      throw err;
	    }

	    return false;
	  }

	  handler = events[type];
	  if (!handler) return false;
	  var isFn = typeof handler === 'function';
	  len = arguments.length;

	  switch (len) {
	    // fast cases
	    case 1:
	      emitNone(handler, isFn, this);
	      break;

	    case 2:
	      emitOne(handler, isFn, this, arguments[1]);
	      break;

	    case 3:
	      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
	      break;

	    case 4:
	      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
	      break;
	    // slower

	    default:
	      args = new Array(len - 1);

	      for (i = 1; i < len; i++) {
	        args[i - 1] = arguments[i];
	      }

	      emitMany(handler, isFn, this, args);
	  }
	  return true;
	};

	function _addListener(target, type, listener, prepend) {
	  var m;
	  var events;
	  var existing;
	  if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
	  events = target._events;

	  if (!events) {
	    events = target._events = new EventHandlers();
	    target._eventsCount = 0;
	  } else {
	    // To avoid recursion in the case that type === "newListener"! Before
	    // adding it to the listeners, first emit "newListener".
	    if (events.newListener) {
	      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
	      // this._events to be assigned to a new object

	      events = target._events;
	    }

	    existing = events[type];
	  }

	  if (!existing) {
	    // Optimize the case of one listener. Don't need the extra array object.
	    existing = events[type] = listener;
	    ++target._eventsCount;
	  } else {
	    if (typeof existing === 'function') {
	      // Adding the second element, need to change to array.
	      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
	    } else {
	      // If we've already got an array, just append.
	      if (prepend) {
	        existing.unshift(listener);
	      } else {
	        existing.push(listener);
	      }
	    } // Check for listener leak


	    if (!existing.warned) {
	      m = $getMaxListeners(target);

	      if (m && m > 0 && existing.length > m) {
	        existing.warned = true;
	        var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + type + ' listeners added. ' + 'Use emitter.setMaxListeners() to increase limit');
	        w.name = 'MaxListenersExceededWarning';
	        w.emitter = target;
	        w.type = type;
	        w.count = existing.length;
	        emitWarning(w);
	      }
	    }
	  }

	  return target;
	}

	function emitWarning(e) {
	  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
	}

	EventEmitter.prototype.addListener = function addListener(type, listener) {
	  return _addListener(this, type, listener, false);
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.prependListener = function prependListener(type, listener) {
	  return _addListener(this, type, listener, true);
	};

	function _onceWrap(target, type, listener) {
	  var fired = false;

	  function g() {
	    target.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(target, arguments);
	    }
	  }

	  g.listener = listener;
	  return g;
	}

	EventEmitter.prototype.once = function once(type, listener) {
	  if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
	  this.on(type, _onceWrap(this, type, listener));
	  return this;
	};

	EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
	  if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
	  this.prependListener(type, _onceWrap(this, type, listener));
	  return this;
	}; // emits a 'removeListener' event iff the listener was removed


	EventEmitter.prototype.removeListener = function removeListener(type, listener) {
	  var list, events, position, i, originalListener;
	  if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
	  events = this._events;
	  if (!events) return this;
	  list = events[type];
	  if (!list) return this;

	  if (list === listener || list.listener && list.listener === listener) {
	    if (--this._eventsCount === 0) this._events = new EventHandlers();else {
	      delete events[type];
	      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
	    }
	  } else if (typeof list !== 'function') {
	    position = -1;

	    for (i = list.length; i-- > 0;) {
	      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
	        originalListener = list[i].listener;
	        position = i;
	        break;
	      }
	    }

	    if (position < 0) return this;

	    if (list.length === 1) {
	      list[0] = undefined;

	      if (--this._eventsCount === 0) {
	        this._events = new EventHandlers();
	        return this;
	      } else {
	        delete events[type];
	      }
	    } else {
	      spliceOne(list, position);
	    }

	    if (events.removeListener) this.emit('removeListener', type, originalListener || listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
	  var listeners, events;
	  events = this._events;
	  if (!events) return this; // not listening for removeListener, no need to emit

	  if (!events.removeListener) {
	    if (arguments.length === 0) {
	      this._events = new EventHandlers();
	      this._eventsCount = 0;
	    } else if (events[type]) {
	      if (--this._eventsCount === 0) this._events = new EventHandlers();else delete events[type];
	    }

	    return this;
	  } // emit removeListener for all listeners on all events


	  if (arguments.length === 0) {
	    var keys = Object.keys(events);

	    for (var i = 0, key; i < keys.length; ++i) {
	      key = keys[i];
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }

	    this.removeAllListeners('removeListener');
	    this._events = new EventHandlers();
	    this._eventsCount = 0;
	    return this;
	  }

	  listeners = events[type];

	  if (typeof listeners === 'function') {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    do {
	      this.removeListener(type, listeners[listeners.length - 1]);
	    } while (listeners[0]);
	  }

	  return this;
	};

	EventEmitter.prototype.listeners = function listeners(type) {
	  var evlistener;
	  var ret;
	  var events = this._events;
	  if (!events) ret = [];else {
	    evlistener = events[type];
	    if (!evlistener) ret = [];else if (typeof evlistener === 'function') ret = [evlistener.listener || evlistener];else ret = unwrapListeners(evlistener);
	  }
	  return ret;
	};

	EventEmitter.listenerCount = function (emitter, type) {
	  if (typeof emitter.listenerCount === 'function') {
	    return emitter.listenerCount(type);
	  } else {
	    return listenerCount.call(emitter, type);
	  }
	};

	EventEmitter.prototype.listenerCount = listenerCount;

	function listenerCount(type) {
	  var events = this._events;

	  if (events) {
	    var evlistener = events[type];

	    if (typeof evlistener === 'function') {
	      return 1;
	    } else if (evlistener) {
	      return evlistener.length;
	    }
	  }

	  return 0;
	}

	EventEmitter.prototype.eventNames = function eventNames() {
	  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
	}; // About 1.5x faster than the two-arg version of Array#splice().


	function spliceOne(list, index) {
	  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
	    list[i] = list[k];
	  }

	  list.pop();
	}

	function arrayClone(arr, i) {
	  var copy = new Array(i);

	  while (i--) {
	    copy[i] = arr[i];
	  }

	  return copy;
	}

	function unwrapListeners(arr) {
	  var ret = new Array(arr.length);

	  for (var i = 0; i < ret.length; ++i) {
	    ret[i] = arr[i].listener || arr[i];
	  }

	  return ret;
	}

	var EventDispatcher = /*#__PURE__*/function (_EventEmitter) {
	  inheritsLoose(EventDispatcher, _EventEmitter);

	  function EventDispatcher() {
	    var _this;

	    _this = _EventEmitter.call(this) || this;

	    _this.setMaxListeners(20);

	    return _this;
	  }

	  var _proto = EventDispatcher.prototype;

	  _proto.dispatch = function dispatch(action) {
	    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    this.emit.apply(this, ['before:' + action].concat(args));
	    this.emit.apply(this, arguments);
	    this.emit.apply(this, ['after:' + action].concat(args));
	  };

	  _proto.registerOnce = function registerOnce(action, callback) {
	    if (typeof action === 'string') {
	      this.once(action, callback);
	    } else {
	      throw 'ACJS: event name must be string';
	    }
	  };

	  _proto.register = function register(action, callback) {
	    if (typeof action === 'string') {
	      this.on(action, callback);
	    } else {
	      throw 'ACJS: event name must be string';
	    }
	  };

	  _proto.unregister = function unregister(action, callback) {
	    if (typeof action === 'string') {
	      this.removeListener(action, callback);
	    } else {
	      throw 'ACJS: event name must be string';
	    }
	  };

	  return EventDispatcher;
	}(EventEmitter);

	var EventDispatcher$1 = new EventDispatcher();

	function broadcast(type, targetSpec, event) {
	  host.dispatch(type, targetSpec, event);
	  EventDispatcher$1.dispatch('event-dispatch', {
	    type: type,
	    targetSpec: targetSpec,
	    event: event
	  });
	}
	function broadcastPublic(type, event, sender) {
	  EventDispatcher$1.dispatch('event-public-dispatch', {
	    type: type,
	    event: event,
	    sender: sender
	  });
	  host.dispatch(type, {}, {
	    sender: {
	      addonKey: sender.addon_key,
	      key: sender.key,
	      options: util.sanitizeStructuredClone(sender.options)
	    },
	    event: event
	  });
	}
	var EventActions = {
	  broadcast: broadcast,
	  broadcastPublic: broadcastPublic
	};

	function emit(name) {
	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  var callback = args[args.length - 1];
	  args = args.slice(0, -1);
	  EventActions.broadcast(name, {
	    addon_key: callback._context.extension.addon_key
	  }, args);
	}
	function emitPublic(name) {
	  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	    args[_key2 - 1] = arguments[_key2];
	  }

	  var callback = args[args.length - 1];
	  var extension = callback._context.extension;
	  args = args.slice(0, -1);
	  EventActions.broadcastPublic(name, args, extension);
	}
	var events = {
	  emit: emit,
	  emitPublic: emitPublic
	};

	var EnvActions = {
	  iframeResize: function iframeResize(width, height, context) {
	    if (context.extension && !context.extension.options.autoresize) {
	      return;
	    }

	    var el;

	    if (context.extension && context.extension.key) {
	      el = document.getElementById(context.extension.key);
	    } else {
	      el = context;
	    }

	    if (el && el.style) {
	      el.style.height = +(height || 0) + 'px';
	    }
	  }
	};

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/
	/* eslint-disable no-unused-vars */

	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
	  if (val === null || val === undefined) {
	    throw new TypeError('Object.assign cannot be called with null or undefined');
	  }

	  return Object(val);
	}

	function shouldUseNative() {
	  try {
	    if (!Object.assign) {
	      return false;
	    } // Detect buggy property enumeration order in older V8 versions.
	    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


	    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

	    test1[5] = 'de';

	    if (Object.getOwnPropertyNames(test1)[0] === '5') {
	      return false;
	    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


	    var test2 = {};

	    for (var i = 0; i < 10; i++) {
	      test2['_' + String.fromCharCode(i)] = i;
	    }

	    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
	      return test2[n];
	    });

	    if (order2.join('') !== '0123456789') {
	      return false;
	    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


	    var test3 = {};
	    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
	      test3[letter] = letter;
	    });

	    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
	      return false;
	    }

	    return true;
	  } catch (err) {
	    // We don't expect any of the above to throw, but better to be safe.
	    return false;
	  }
	}

	var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	  var from;
	  var to = toObject(target);
	  var symbols;

	  for (var s = 1; s < arguments.length; s++) {
	    from = Object(arguments[s]);

	    for (var key in from) {
	      if (hasOwnProperty.call(from, key)) {
	        to[key] = from[key];
	      }
	    }

	    if (getOwnPropertySymbols) {
	      symbols = getOwnPropertySymbols(from);

	      for (var i = 0; i < symbols.length; i++) {
	        if (propIsEnumerable.call(from, symbols[i])) {
	          to[symbols[i]] = from[symbols[i]];
	        }
	      }
	    }
	  }

	  return to;
	};

	function first(arr, numb) {
	  if (numb) {
	    return arr.slice(0, numb);
	  }

	  return arr[0];
	}

	function last(arr) {
	  return arr[arr.length - 1];
	}

	function pick(obj, keys) {
	  if (typeof obj !== 'object') {
	    return {};
	  }

	  return Object.keys(obj).filter(function (key) {
	    return keys.indexOf(key) >= 0;
	  }).reduce(function (newObj, key) {
	    var _extend;

	    return objectAssign(newObj, (_extend = {}, _extend[key] = obj[key], _extend));
	  }, {});
	}

	function debounce(fn, wait) {
	  var timeout;
	  return function () {
	    var ctx = this;
	    var args = [].slice.call(arguments);

	    function later() {
	      timeout = null;
	      fn.apply(ctx, args);
	    }

	    if (timeout) {
	      clearTimeout(timeout);
	    }

	    timeout = setTimeout(later, wait || 50);
	  };
	}

	var util$1 = {
	  first: first,
	  last: last,
	  pick: pick,
	  debounce: debounce,
	  extend: objectAssign
	};

	var debounce$1 = util$1.debounce;
	var resizeFuncHolder = {};
	var env = {
	  resize: function resize(width, height, callback) {
	    if (!callback._context.extension.options.autoresize) {
	      return false;
	    }

	    callback = util$1.last(arguments);
	    var iframeId = callback._context.extension.key;

	    if (!resizeFuncHolder[iframeId]) {
	      resizeFuncHolder[iframeId] = debounce$1(function (dwidth, dheight, dcallback) {
	        EnvActions.iframeResize(dwidth, dheight, dcallback._context);
	      }, 200);
	    }

	    resizeFuncHolder[iframeId](width, height, callback);
	    return true;
	  }
	};

	host.__proto__.create = function create(extension, initCallback, unloadCallback) {
	  var extension_id = this.registerExtension(extension, initCallback, unloadCallback);
	  var options = extension.options || {};
	  var data = {
	    client_id: extension_id,
	    // TODO: back compatibility
	    extension_id: extension_id,
	    api: this._xdm.getApiSpec(),
	    origin: util.locationOrigin(),
	    app: options,
	    // TODO: back compatibility
	    options: options
	  };
	  return {
	    id: extension_id,
	    name: JSON.stringify(data),
	    src: extension.url
	  };
	};

	host.defineModule('events', events);
	host.defineModule('env', env);

	return host;

})));
