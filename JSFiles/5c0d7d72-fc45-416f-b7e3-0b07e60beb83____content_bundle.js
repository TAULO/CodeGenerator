(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/lodash/_isHostObject.js":[function(require,module,exports){
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

module.exports = isHostObject;

},{}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/lodash/isObjectLike.js":[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/lodash/isPlainObject.js":[function(require,module,exports){
var isHostObject = require('./_isHostObject'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var getPrototypeOf = Object.getPrototypeOf;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) ||
      objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = objectProto;
  if (typeof value.constructor == 'function') {
    proto = getPrototypeOf(value);
  }
  if (proto === null) {
    return true;
  }
  var Ctor = proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

module.exports = isPlainObject;

},{"./_isHostObject":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/lodash/_isHostObject.js","./isObjectLike":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/lodash/isObjectLike.js"}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux-thunk/lib/index.js":[function(require,module,exports){
'use strict';

function thunkMiddleware(_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      return typeof action === 'function' ? action(dispatch, getState) : next(action);
    };
  };
}

module.exports = thunkMiddleware;
},{}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/applyMiddleware.js":[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.__esModule = true;
exports["default"] = applyMiddleware;

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, initialState, enhancer) {
      var store = createStore(reducer, initialState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2["default"].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
},{"./compose":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/compose.js"}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/bindActionCreators.js":[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports["default"] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
},{}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/combineReducers.js":[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports["default"] = combineReducers;

var _createStore = require('./createStore');

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Reducer "' + key + '" returned undefined handling ' + actionName + '. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!(0, _isPlainObject2["default"])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key);
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var sanityError;
  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if (sanityError) {
      throw sanityError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
      if (warningMessage) {
        (0, _warning2["default"])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i];
      var reducer = finalReducers[key];
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
}).call(this,require('_process'))
},{"./createStore":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/createStore.js","./utils/warning":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/utils/warning.js","_process":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/process/browser.js","lodash/isPlainObject":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/lodash/isPlainObject.js"}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/compose.js":[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = compose;
/**
 * Composes single-argument functions from right to left.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing functions from right to
 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
 */
function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return function () {
    if (funcs.length === 0) {
      return arguments.length <= 0 ? undefined : arguments[0];
    }

    var last = funcs[funcs.length - 1];
    var rest = funcs.slice(0, -1);

    return rest.reduceRight(function (composed, f) {
      return f(composed);
    }, last.apply(undefined, arguments));
  };
}
},{}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/createStore.js":[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.ActionTypes = undefined;
exports["default"] = createStore;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'
};

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [initialState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
function createStore(reducer, initialState, enhancer) {
  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initialState;
    initialState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, initialState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = initialState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all states changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing ???what changed???. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2["default"])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  };
}
},{"lodash/isPlainObject":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/lodash/isPlainObject.js"}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/index.js":[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = require('./combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = require('./bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = require('./applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  (0, _warning2["default"])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2["default"];
exports.combineReducers = _combineReducers2["default"];
exports.bindActionCreators = _bindActionCreators2["default"];
exports.applyMiddleware = _applyMiddleware2["default"];
exports.compose = _compose2["default"];
}).call(this,require('_process'))
},{"./applyMiddleware":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/applyMiddleware.js","./bindActionCreators":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/bindActionCreators.js","./combineReducers":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/combineReducers.js","./compose":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/compose.js","./createStore":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/createStore.js","./utils/warning":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/utils/warning.js","_process":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/process/browser.js"}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/utils/warning.js":[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports["default"] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that you can use this stack
    // to find the callsite that caused this warning to fire.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
},{}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/content.js":[function(require,module,exports){
'use strict';

require('./content/index');

console.log('Greetings from Content Script');

},{"./content/index":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/content/index.js"}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/content/index.js":[function(require,module,exports){
'use strict';

var _configureStore = require('../shared/store/configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

var _getState = require('../shared/helpers/getState');

var _getState2 = _interopRequireDefault(_getState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = {};

(0, _getState2.default)().then(function (initialStore) {
  console.log('%cInitial Store:', 'color: #6638F0; font-weight: bold;', initialStore);
  store = (0, _configureStore2.default)(initialStore);

  console.log('%cInitial State', 'color: #C600D7; font-weight: bold;', store.getState());
  store.subscribe(function () {
    var message = {
      action: 'updateState',
      state: store.getState()
    };
    //Dispatching updates to Background Page
    chrome.runtime.sendMessage(message);
    //Dispatching updates to the rest of Content Scripts
    /*chrome.tabs.query({}, function (tabs) {
      for (var i = 0; i < tabs.length; ++i) {
        chrome.tabs.sendMessage(tabs[i].id, message);
      }
    });*/
  });
});

//Receiving updates from Popup window
chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  console.log('%conMessage recieved', 'color: #B0F566; font-weight: bold;');
  if (req.action === 'updateState') {
    store.dispatch({
      type: 'UPDATE_STATE',
      state: req.state
    });
  }

  if (req.method === 'getHTML') {
    var config = document.getElementById('config');

    sendResponse(Object.assign({}, { method: 'getHTML' }, JSON.parse(config.innerText)));
  }
});

},{"../shared/helpers/getState":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/helpers/getState.js","../shared/store/configureStore":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/store/configureStore.js"}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/actions/index.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = logout;
var UPDATE_STATE = exports.UPDATE_STATE = 'UPDATE_STATE';
var LOGOUT = exports.LOGOUT = 'LOGOUT';

function logout() {
  return {
    type: LOGOUT
  };
}

},{}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/actions/profile.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateProfile = updateProfile;
var UPDATE_PROFILE = exports.UPDATE_PROFILE = 'UPDATE_PROFILE';

function updateProfile(profile) {
  return {
    type: UPDATE_PROFILE,
    profile: profile
  };
}

},{}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/helpers/createInitState.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createInitState;
function createInitState(storage) {
  return {
    persistent: storage
  };
}

},{}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/helpers/getState.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getState;

var _initStorage = require('../initStorage');

var _initStorage2 = _interopRequireDefault(_initStorage);

var _createInitState = require('./createInitState');

var _createInitState2 = _interopRequireDefault(_createInitState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Get store from Background Page

function getState() {
  return new Promise(function (resolve, reject) {
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
      chrome.runtime.sendMessage({
        action: 'getState'
      }, function (res) {
        console.log('getState', res);
        if (res) {
          resolve(res);
        } else {
          reject(new Error('Cannot reach Background Page'));
        }
      });
    } else {
      resolve((0, _createInitState2.default)(_initStorage2.default));
    }
  });
}

},{"../initStorage":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/initStorage.js","./createInitState":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/helpers/createInitState.js"}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/initStorage.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  options: {
    initCount: 1
  }
};

},{}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/reducers/index.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

var _persistent = require('./persistent');

var _persistent2 = _interopRequireDefault(_persistent);

var _profile = require('./profile');

var _profile2 = _interopRequireDefault(_profile);

var _scratchPlayer = require('./scratchPlayer');

var _scratchPlayer2 = _interopRequireDefault(_scratchPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootReducer = (0, _redux.combineReducers)({
  profile: _profile2.default,
  persistent: _persistent2.default
});

exports.default = rootReducer;

},{"../actions":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/actions/index.js","./persistent":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/reducers/persistent.js","./profile":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/reducers/profile.js","./scratchPlayer":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/reducers/scratchPlayer.js","redux":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/index.js"}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/reducers/persistent.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = persistent;

var _actions = require('../actions');

var initialState = {
  userId: ''
};

function persistent() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.UPDATE_STATE:
      var newState = Object.assign({}, state, action.state.persistent);
      if (location.protocol == 'chrome-extension:' && chrome.extension.getBackgroundPage() === window) {
        localStorage.setItem('persistent', JSON.stringify(newState));
      }
      return newState;
    case _actions.LOGOUT:
      return Object.assign({}, state, { userId: '' });
    default:
      return state;
  }
}

},{"../actions":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/actions/index.js"}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/reducers/profile.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = profile;

var _profile = require('../actions/profile');

var _actions = require('../actions');

var initialState = {};

function profile() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _profile.UPDATE_PROFILE:
      return _extends({}, state, action.profile);
    case _actions.LOGOUT:
      return {};
    default:
      return state;
  }
}

},{"../actions":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/actions/index.js","../actions/profile":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/actions/profile.js"}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/reducers/scratchPlayer.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = scratchPlayer;

var initialState = {
  projectUrl: 'http://scratch.mit.edu/projects/',
  playing: false
};

function scratchPlayer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case CHANGE_PROJECT:
      return _extends({}, state, {
        projectUrl: action.projectUrl
      });
    default:
      return state;
  }
}

},{}],"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/store/configureStore.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureStore;

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createStoreWithMiddleware = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore);

function configureStore(initialState) {
  return createStoreWithMiddleware(_reducers2.default, initialState);
}

},{"../reducers":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/shared/reducers/index.js","redux":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux/lib/index.js","redux-thunk":"/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/node_modules/redux-thunk/lib/index.js"}]},{},["/Users/Cesar/Documents/Bitbucket/foresees-chrome-extension/src/scripts/content.js"]);
