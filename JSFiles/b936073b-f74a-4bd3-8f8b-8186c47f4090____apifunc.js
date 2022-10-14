// https://www.html5rocks.com/en/tutorials/cors/
/**
 * @param method
 * @param url
 * @returns {{withCredentials}|XDomainRequest}
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url, true);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}
// each.js
jlogs('exist?','each');

/**
 *
 * @param array
 * @param callback
 * @param limit
 * @param is_last
 * @param is_first
 */
function each(array, callback, limit, is_last, is_first) {

    // limit = 5;
    var count = 1;
    var obj = {};

    if (is_first) {
        obj = firstArray(array);
        callback(obj,0);

    } else if (is_last) {
        obj = lastArray(array);
        callback(obj,-1);

    } else {

        for (var key in array) {

            // skip loop if the property is from prototype
            if (!array.hasOwnProperty(key)) continue;
            if (count > limit) continue;
            count++;

            obj = array[key];

            // console.log(obj);
            // console.log(limit, count);

            callback(obj, key);
        }
    }
    // return this;
}

var firstArray = function (array) {
    var key = array.length - 1;
    return array[key];
}

var lastArray = function (array) {
    return array.slice(-1);
}
!function(E,t,e){"use strict";var r=function(){if(!(this instanceof r)){var e=new r;return e.init.call(e,Array.prototype.slice.call(arguments))}var o,n=null,l={includeEmptyValuedElements:!1,w3cSuccessfulControlsOnly:!1},i=/[^\[\]]+|\[\]/g,a=null;function f(e){if(e&&"object"==typeof e)return Object.keys(e).filter(function(e){return!isNaN(parseInt(e,10))}).splice(-1)[0]}function c(e){var n=f(e);return"string"==typeof n?parseInt(n,10)+1:0}function s(e){if("object"!=typeof e||null===e)return 0;var n,t=0;if("function"==typeof Object.keys)t=Object.keys(e).length;else for(n in e)e.hasOwnProperty(n)&&t++;return t}function p(e){return"INPUT"===e.nodeName&&"radio"===e.type}function v(e){return"INPUT"===e.nodeName&&"checkbox"===e.type}function d(e){return"SELECT"===e.nodeName&&"select-multiple"===e.type}function y(e){return e.checked}function m(e){if(p(e))return!!y(e)&&e.value;if(v(e))return!!y(e)&&e.value;if("INPUT"===(t=e).nodeName&&"file"===t.type)return!(!a.enctype||"multipart/form-data"!==a.enctype)&&(n=e,E.FileList&&n.files instanceof E.FileList&&0<e.files.length?e.files:!(!e.value||""===e.value)&&e.value);var n,t,r,u;if("TEXTAREA"===e.nodeName)return!(!e.value||""===e.value)&&e.value;if("SELECT"===(r=e).nodeName&&"select-one"===r.type)return e.value&&""!==e.value?e.value:!(!e.options||!e.options.length||""===e.options[0].value)&&e.options[0].value;if(d(e)){if(e.options&&0<e.options.length){var i=[];return function(e,n){if([].forEach)return[].forEach.call(e,n);var t;for(t=0;t<e.length;t++)n.call(e,e[t],t)}(e.options,function(e){e.selected&&i.push(e.value)}),l.includeEmptyValuedElements?i:!!i.length&&i}return!1}return"BUTTON"===(u=e).nodeName&&"submit"===u.type?e.value&&""!==e.value?e.value:!(!e.innerText||""===e.innerText)&&e.innerText:void 0!==e.value&&(l.includeEmptyValuedElements?e.value:""!==e.value&&e.value)}function h(e,n,t,r){var u,i=n[0];if(p(e))return!1!==t?r[i]=t:void 0;if(v(e)){if(!1===t)return;if(u=e.name,1<Array.prototype.filter.call(o,function(e){return e.name===u}).length)return r[i]||(r[i]=[]),r[i].push(t);r[i]=t}if(d(e)){if(!1===t)return;r[i]=t}return r[i]=t}function g(e,n,t,r){var u,i,o=n[0];return 1<n.length?"[]"===o?(r[c(r)]={},g(e,n.splice(1,n.length),t,r[(u=r,i=f(u),"string"==typeof i?parseInt(i,10):0)])):(r[o]&&0<s(r[o])||(r[o]={}),g(e,n.splice(1,n.length),t,r[o])):1===n.length?("[]"===o?r[c(r)]=t:h(e,n,t,r),r):void 0}return{init:function(e){return!(!e||"object"!=typeof e||!e[0])&&(n=e[0],void 0!==e[1]&&0<s(e[1])&&function(e,n){var t;for(t in n)n.hasOwnProperty(t)&&(e[t]=n[t])}(l,e[1]),!!function(){switch(typeof n){case"string":a=t.getElementById(n);break;case"object":(e=n)&&"object"==typeof e&&"nodeType"in e&&1===e.nodeType&&(a=n)}var e;return a}()&&!!(o=a.querySelectorAll("input, textarea, select")).length&&function(){var e,n,t,r=0,u={};for(r=0;r<o.length;r++)!(n=o[r]).name||""===n.name||n.disabled||p(n)&&!y(n)||(!1!==(t=m(n))||l.includeEmptyValuedElements)&&(1===(e=n.name.match(i)).length&&h(n,e,t||"",u),1<e.length&&g(n,e,t||"",u));return 0<s(u)&&u}())}}};"function"==typeof define&&define.amd?define(function(){return r}):"object"==typeof module&&module.exports?module.exports=r:E.formToObject=r}(window,document);// get-file-extension.js
jlogs('exist?', 'getFileExtension');

/**
 *
 * @param filename
 * @returns {string}
 */
function getFileExtension(filename) {
    return filename.split("?")[0].split("#")[0].split('.').pop();
}
// has-domain.js
jlogs('exist?','hasDomain');
/**
 * @param url
 * @returns {boolean}
 */
var hasDomain = function (url) {
    return url.indexOf('//') === 0 || url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
}
// is-array.js
jlogs('exist?','isArray');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArray(val) {
    return val !== null ||
        (typeof val === 'object' && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isBoolean');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isBoolean(val) {
    return val !== null ||
        (typeof val === 'boolean')
        ;
}
// is-empty.js
jlogs('exist?','isEmpty');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isEmpty(val) {
    return val == null ||
        typeof val === 'undefined' ||
        (typeof val === 'string' && val.length < 1) ||
        (typeof val === 'object' &&
            (
                !(
                    (typeof val.innerText !== 'undefined' && val.innerText.length !== 0) ||
                    (typeof val.innerHTML !== 'undefined' && val.innerHTML.length !== 0)
                )
                &&
                (Object.keys(val).length === 0)
            )
        )
        // (typeof val !== 'boolean')
        ;
}

//
// function isEmpty(obj) {
//     for (var prop in obj) {
//         if (obj.hasOwnProperty(prop)) {
//             return false;
//         }
//     }
//
//     return JSON.stringify(obj) === JSON.stringify({});
// }
// is-array.js
jlogs('exist?','isNumberGt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberGt(val, number) {
    return val !== null ||
        (typeof val === 'number' && val > number)
        ;
}
// is-array.js
jlogs('exist?','isNumberLt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberLt(val, number) {
    return val !== null ||
        (typeof val === 'number' && val < number)
        ;
}
// is-array.js
jlogs('exist?','isNumber');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumber(val) {
    return val !== null ||
        (typeof val === 'number')
        ;
}
// is-array.js
jlogs('exist?','isObject');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isObject(val) {
    return val !== null ||
        (typeof val === 'object' && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isStringEncoded');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isStringEncoded(val, type) {
    // base64, md5
    return val !== null ||
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val, type) {
    // base64, md5
    return val !== null ||
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val) {
    return val !== null ||
        (typeof val === 'string' && val.length > 0)
        ;
}
//time.js
jlogs('exist?','time');

var time = Date.now || function () {
    return +new Date;
};
// xhr.js
jlogs('exist?','getXHRObject');
/**
 * @returns {boolean}
 */
function getXHRObject() {
    var xhrObj = false;
    try {
        xhrObj = new XMLHttpRequest();
    } catch (e) {
        var progid = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
            'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
        for (var i = 0; i < progid.length; ++i) {
            try {
                xhrObj = new ActiveXObject(progid[i]);
            } catch (e) {
                continue;
            }
            break;
        }
    } finally {

        return xhrObj;
    }
}
// xml2string.js
function xml2string(node) {
    if (typeof (XMLSerializer) !== 'undefined') {
        var serializer = new XMLSerializer();
        return serializer.serializeToString(node);
    } else if (node.xml) {
        return node.xml;
    }
}
// https://www.html5rocks.com/en/tutorials/cors/
/**
 * @param method
 * @param url
 * @returns {{withCredentials}|XDomainRequest}
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url, true);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}
// each.js
jlogs('exist?','each');

/**
 *
 * @param array
 * @param callback
 * @param limit
 * @param is_last
 * @param is_first
 */
function each(array, callback, limit, is_last, is_first) {

    // limit = 5;
    var count = 1;
    var obj = {};

    if (is_first) {
        obj = firstArray(array);
        callback(obj,0);

    } else if (is_last) {
        obj = lastArray(array);
        callback(obj,-1);

    } else {

        for (var key in array) {

            // skip loop if the property is from prototype
            if (!array.hasOwnProperty(key)) continue;
            if (count > limit) continue;
            count++;

            obj = array[key];

            // console.log(obj);
            // console.log(limit, count);

            callback(obj, key);
        }
    }
    // return this;
}

var firstArray = function (array) {
    var key = array.length - 1;
    return array[key];
}

var lastArray = function (array) {
    return array.slice(-1);
}
!function(E,t,e){"use strict";var r=function(){if(!(this instanceof r)){var e=new r;return e.init.call(e,Array.prototype.slice.call(arguments))}var o,n=null,l={includeEmptyValuedElements:!1,w3cSuccessfulControlsOnly:!1},i=/[^\[\]]+|\[\]/g,a=null;function f(e){if(e&&"object"==typeof e)return Object.keys(e).filter(function(e){return!isNaN(parseInt(e,10))}).splice(-1)[0]}function c(e){var n=f(e);return"string"==typeof n?parseInt(n,10)+1:0}function s(e){if("object"!=typeof e||null===e)return 0;var n,t=0;if("function"==typeof Object.keys)t=Object.keys(e).length;else for(n in e)e.hasOwnProperty(n)&&t++;return t}function p(e){return"INPUT"===e.nodeName&&"radio"===e.type}function v(e){return"INPUT"===e.nodeName&&"checkbox"===e.type}function d(e){return"SELECT"===e.nodeName&&"select-multiple"===e.type}function y(e){return e.checked}function m(e){if(p(e))return!!y(e)&&e.value;if(v(e))return!!y(e)&&e.value;if("INPUT"===(t=e).nodeName&&"file"===t.type)return!(!a.enctype||"multipart/form-data"!==a.enctype)&&(n=e,E.FileList&&n.files instanceof E.FileList&&0<e.files.length?e.files:!(!e.value||""===e.value)&&e.value);var n,t,r,u;if("TEXTAREA"===e.nodeName)return!(!e.value||""===e.value)&&e.value;if("SELECT"===(r=e).nodeName&&"select-one"===r.type)return e.value&&""!==e.value?e.value:!(!e.options||!e.options.length||""===e.options[0].value)&&e.options[0].value;if(d(e)){if(e.options&&0<e.options.length){var i=[];return function(e,n){if([].forEach)return[].forEach.call(e,n);var t;for(t=0;t<e.length;t++)n.call(e,e[t],t)}(e.options,function(e){e.selected&&i.push(e.value)}),l.includeEmptyValuedElements?i:!!i.length&&i}return!1}return"BUTTON"===(u=e).nodeName&&"submit"===u.type?e.value&&""!==e.value?e.value:!(!e.innerText||""===e.innerText)&&e.innerText:void 0!==e.value&&(l.includeEmptyValuedElements?e.value:""!==e.value&&e.value)}function h(e,n,t,r){var u,i=n[0];if(p(e))return!1!==t?r[i]=t:void 0;if(v(e)){if(!1===t)return;if(u=e.name,1<Array.prototype.filter.call(o,function(e){return e.name===u}).length)return r[i]||(r[i]=[]),r[i].push(t);r[i]=t}if(d(e)){if(!1===t)return;r[i]=t}return r[i]=t}function g(e,n,t,r){var u,i,o=n[0];return 1<n.length?"[]"===o?(r[c(r)]={},g(e,n.splice(1,n.length),t,r[(u=r,i=f(u),"string"==typeof i?parseInt(i,10):0)])):(r[o]&&0<s(r[o])||(r[o]={}),g(e,n.splice(1,n.length),t,r[o])):1===n.length?("[]"===o?r[c(r)]=t:h(e,n,t,r),r):void 0}return{init:function(e){return!(!e||"object"!=typeof e||!e[0])&&(n=e[0],void 0!==e[1]&&0<s(e[1])&&function(e,n){var t;for(t in n)n.hasOwnProperty(t)&&(e[t]=n[t])}(l,e[1]),!!function(){switch(typeof n){case"string":a=t.getElementById(n);break;case"object":(e=n)&&"object"==typeof e&&"nodeType"in e&&1===e.nodeType&&(a=n)}var e;return a}()&&!!(o=a.querySelectorAll("input, textarea, select")).length&&function(){var e,n,t,r=0,u={};for(r=0;r<o.length;r++)!(n=o[r]).name||""===n.name||n.disabled||p(n)&&!y(n)||(!1!==(t=m(n))||l.includeEmptyValuedElements)&&(1===(e=n.name.match(i)).length&&h(n,e,t||"",u),1<e.length&&g(n,e,t||"",u));return 0<s(u)&&u}())}}};"function"==typeof define&&define.amd?define(function(){return r}):"object"==typeof module&&module.exports?module.exports=r:E.formToObject=r}(window,document);// get-file-extension.js
jlogs('exist?', 'getFileExtension');

/**
 *
 * @param filename
 * @returns {string}
 */
function getFileExtension(filename) {
    return filename.split("?")[0].split("#")[0].split('.').pop();
}
// has-domain.js
jlogs('exist?','hasDomain');
/**
 * @param url
 * @returns {boolean}
 */
var hasDomain = function (url) {
    return url.indexOf('//') === 0 || url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
}
// is-array.js
jlogs('exist?','isArray');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArray(val) {
    return val !== null ||
        (typeof val === 'object' && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isBoolean');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isBoolean(val) {
    return val !== null ||
        (typeof val === 'boolean')
        ;
}
// is-empty.js
jlogs('exist?','isEmpty');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isEmpty(val) {
    return val == null ||
        typeof val === 'undefined' ||
        (typeof val === 'string' && val.length < 1) ||
        (typeof val === 'object' &&
            (
                !(
                    (typeof val.innerText !== 'undefined' && val.innerText.length !== 0) ||
                    (typeof val.innerHTML !== 'undefined' && val.innerHTML.length !== 0)
                )
                &&
                (Object.keys(val).length === 0)
            )
        )
        // (typeof val !== 'boolean')
        ;
}

//
// function isEmpty(obj) {
//     for (var prop in obj) {
//         if (obj.hasOwnProperty(prop)) {
//             return false;
//         }
//     }
//
//     return JSON.stringify(obj) === JSON.stringify({});
// }
// is-array.js
jlogs('exist?','isNumberGt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberGt(val, number) {
    return val !== null ||
        (typeof val === 'number' && val > number)
        ;
}
// is-array.js
jlogs('exist?','isNumberLt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberLt(val, number) {
    return val !== null ||
        (typeof val === 'number' && val < number)
        ;
}
// is-array.js
jlogs('exist?','isNumber');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumber(val) {
    return val !== null ||
        (typeof val === 'number')
        ;
}
// is-array.js
jlogs('exist?','isObject');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isObject(val) {
    return val !== null ||
        (typeof val === 'object' && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isStringEncoded');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isStringEncoded(val, type) {
    // base64, md5
    return val !== null ||
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val, type) {
    // base64, md5
    return val !== null ||
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val) {
    return val !== null ||
        (typeof val === 'string' && val.length > 0)
        ;
}
//time.js
jlogs('exist?','time');

var time = Date.now || function () {
    return +new Date;
};
// xhr.js
jlogs('exist?','getXHRObject');
/**
 * @returns {boolean}
 */
function getXHRObject() {
    var xhrObj = false;
    try {
        xhrObj = new XMLHttpRequest();
    } catch (e) {
        var progid = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
            'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
        for (var i = 0; i < progid.length; ++i) {
            try {
                xhrObj = new ActiveXObject(progid[i]);
            } catch (e) {
                continue;
            }
            break;
        }
    } finally {

        return xhrObj;
    }
}
// xml2string.js
function xml2string(node) {
    if (typeof (XMLSerializer) !== 'undefined') {
        var serializer = new XMLSerializer();
        return serializer.serializeToString(node);
    } else if (node.xml) {
        return node.xml;
    }
}
// https://www.html5rocks.com/en/tutorials/cors/
/**
 * @param method
 * @param url
 * @returns {{withCredentials}|XDomainRequest}
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url, true);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}
// each.js
jlogs('exist?','each');

/**
 *
 * @param array
 * @param callback
 * @param limit
 * @param is_last
 * @param is_first
 */
function each(array, callback, limit, is_last, is_first) {

    // limit = 5;
    var count = 1;
    var obj = {};

    if (is_first) {
        obj = firstArray(array);
        callback(obj,0);

    } else if (is_last) {
        obj = lastArray(array);
        callback(obj,-1);

    } else {

        for (var key in array) {

            // skip loop if the property is from prototype
            if (!array.hasOwnProperty(key)) continue;
            if (count > limit) continue;
            count++;

            obj = array[key];

            // console.log(obj);
            // console.log(limit, count);

            callback(obj, key);
        }
    }
    // return this;
}

var firstArray = function (array) {
    var key = array.length - 1;
    return array[key];
}

var lastArray = function (array) {
    return array.slice(-1);
}
!function(E,t,e){"use strict";var r=function(){if(!(this instanceof r)){var e=new r;return e.init.call(e,Array.prototype.slice.call(arguments))}var o,n=null,l={includeEmptyValuedElements:!1,w3cSuccessfulControlsOnly:!1},i=/[^\[\]]+|\[\]/g,a=null;function f(e){if(e&&"object"==typeof e)return Object.keys(e).filter(function(e){return!isNaN(parseInt(e,10))}).splice(-1)[0]}function c(e){var n=f(e);return"string"==typeof n?parseInt(n,10)+1:0}function s(e){if("object"!=typeof e||null===e)return 0;var n,t=0;if("function"==typeof Object.keys)t=Object.keys(e).length;else for(n in e)e.hasOwnProperty(n)&&t++;return t}function p(e){return"INPUT"===e.nodeName&&"radio"===e.type}function v(e){return"INPUT"===e.nodeName&&"checkbox"===e.type}function d(e){return"SELECT"===e.nodeName&&"select-multiple"===e.type}function y(e){return e.checked}function m(e){if(p(e))return!!y(e)&&e.value;if(v(e))return!!y(e)&&e.value;if("INPUT"===(t=e).nodeName&&"file"===t.type)return!(!a.enctype||"multipart/form-data"!==a.enctype)&&(n=e,E.FileList&&n.files instanceof E.FileList&&0<e.files.length?e.files:!(!e.value||""===e.value)&&e.value);var n,t,r,u;if("TEXTAREA"===e.nodeName)return!(!e.value||""===e.value)&&e.value;if("SELECT"===(r=e).nodeName&&"select-one"===r.type)return e.value&&""!==e.value?e.value:!(!e.options||!e.options.length||""===e.options[0].value)&&e.options[0].value;if(d(e)){if(e.options&&0<e.options.length){var i=[];return function(e,n){if([].forEach)return[].forEach.call(e,n);var t;for(t=0;t<e.length;t++)n.call(e,e[t],t)}(e.options,function(e){e.selected&&i.push(e.value)}),l.includeEmptyValuedElements?i:!!i.length&&i}return!1}return"BUTTON"===(u=e).nodeName&&"submit"===u.type?e.value&&""!==e.value?e.value:!(!e.innerText||""===e.innerText)&&e.innerText:void 0!==e.value&&(l.includeEmptyValuedElements?e.value:""!==e.value&&e.value)}function h(e,n,t,r){var u,i=n[0];if(p(e))return!1!==t?r[i]=t:void 0;if(v(e)){if(!1===t)return;if(u=e.name,1<Array.prototype.filter.call(o,function(e){return e.name===u}).length)return r[i]||(r[i]=[]),r[i].push(t);r[i]=t}if(d(e)){if(!1===t)return;r[i]=t}return r[i]=t}function g(e,n,t,r){var u,i,o=n[0];return 1<n.length?"[]"===o?(r[c(r)]={},g(e,n.splice(1,n.length),t,r[(u=r,i=f(u),"string"==typeof i?parseInt(i,10):0)])):(r[o]&&0<s(r[o])||(r[o]={}),g(e,n.splice(1,n.length),t,r[o])):1===n.length?("[]"===o?r[c(r)]=t:h(e,n,t,r),r):void 0}return{init:function(e){return!(!e||"object"!=typeof e||!e[0])&&(n=e[0],void 0!==e[1]&&0<s(e[1])&&function(e,n){var t;for(t in n)n.hasOwnProperty(t)&&(e[t]=n[t])}(l,e[1]),!!function(){switch(typeof n){case"string":a=t.getElementById(n);break;case"object":(e=n)&&"object"==typeof e&&"nodeType"in e&&1===e.nodeType&&(a=n)}var e;return a}()&&!!(o=a.querySelectorAll("input, textarea, select")).length&&function(){var e,n,t,r=0,u={};for(r=0;r<o.length;r++)!(n=o[r]).name||""===n.name||n.disabled||p(n)&&!y(n)||(!1!==(t=m(n))||l.includeEmptyValuedElements)&&(1===(e=n.name.match(i)).length&&h(n,e,t||"",u),1<e.length&&g(n,e,t||"",u));return 0<s(u)&&u}())}}};"function"==typeof define&&define.amd?define(function(){return r}):"object"==typeof module&&module.exports?module.exports=r:E.formToObject=r}(window,document);// get-file-extension.js
jlogs('exist?', 'getFileExtension');

/**
 *
 * @param filename
 * @returns {string}
 */
function getFileExtension(filename) {
    return filename.split("?")[0].split("#")[0].split('.').pop();
}
// has-domain.js
jlogs('exist?','hasDomain');
/**
 * @param url
 * @returns {boolean}
 */
var hasDomain = function (url) {
    return url.indexOf('//') === 0 || url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
}
// is-array.js
jlogs('exist?','isArray');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArray(val) {
    return val !== null ||
        (typeof val === 'object' && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isBoolean');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isBoolean(val) {
    return val !== null ||
        (typeof val === 'boolean')
        ;
}
// is-empty.js
jlogs('exist?','isEmpty');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isEmpty(val) {
    return val == null ||
        typeof val === 'undefined' ||
        (typeof val === 'string' && val.length < 1) ||
        (typeof val === 'object' &&
            (
                !(
                    (typeof val.innerText !== 'undefined' && val.innerText.length !== 0) ||
                    (typeof val.innerHTML !== 'undefined' && val.innerHTML.length !== 0)
                )
                &&
                (Object.keys(val).length === 0)
            )
        )
        // (typeof val !== 'boolean')
        ;
}

//
// function isEmpty(obj) {
//     for (var prop in obj) {
//         if (obj.hasOwnProperty(prop)) {
//             return false;
//         }
//     }
//
//     return JSON.stringify(obj) === JSON.stringify({});
// }
// is-array.js
jlogs('exist?','isNumberGt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberGt(val, number) {
    return val !== null ||
        (typeof val === 'number' && val > number)
        ;
}
// is-array.js
jlogs('exist?','isNumberLt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberLt(val, number) {
    return val !== null ||
        (typeof val === 'number' && val < number)
        ;
}
// is-array.js
jlogs('exist?','isNumber');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumber(val) {
    return val !== null ||
        (typeof val === 'number')
        ;
}
// is-array.js
jlogs('exist?','isObject');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isObject(val) {
    return val !== null ||
        (typeof val === 'object' && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isStringEncoded');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isStringEncoded(val, type) {
    // base64, md5
    return val !== null ||
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val, type) {
    // base64, md5
    return val !== null ||
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val) {
    return val !== null ||
        (typeof val === 'string' && val.length > 0)
        ;
}
//time.js
jlogs('exist?','time');

var time = Date.now || function () {
    return +new Date;
};
// xhr.js
jlogs('exist?','getXHRObject');
/**
 * @returns {boolean}
 */
function getXHRObject() {
    var xhrObj = false;
    try {
        xhrObj = new XMLHttpRequest();
    } catch (e) {
        var progid = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
            'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
        for (var i = 0; i < progid.length; ++i) {
            try {
                xhrObj = new ActiveXObject(progid[i]);
            } catch (e) {
                continue;
            }
            break;
        }
    } finally {

        return xhrObj;
    }
}
// xml2string.js
function xml2string(node) {
    if (typeof (XMLSerializer) !== 'undefined') {
        var serializer = new XMLSerializer();
        return serializer.serializeToString(node);
    } else if (node.xml) {
        return node.xml;
    }
}
// https://www.html5rocks.com/en/tutorials/cors/
/**
 * @param method
 * @param url
 * @returns {{withCredentials}|XDomainRequest}
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url, true);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}
// each.js
jlogs('exist?','each');

/**
 *
 * @param array
 * @param callback
 * @param limit
 * @param is_last
 * @param is_first
 */
function each(array, callback, limit, is_last, is_first) {

    // limit = 5;
    var count = 1;
    var obj = {};

    if (is_first) {
        obj = firstArray(array);
        callback(obj,0);

    } else if (is_last) {
        obj = lastArray(array);
        callback(obj,-1);

    } else {

        for (var key in array) {

            // skip loop if the property is from prototype
            if (!array.hasOwnProperty(key)) continue;
            if (count > limit) continue;
            count++;

            obj = array[key];

            // console.log(obj);
            // console.log(limit, count);

            callback(obj, key);
        }
    }
    // return this;
}

var firstArray = function (array) {
    var key = array.length - 1;
    return array[key];
}

var lastArray = function (array) {
    return array.slice(-1);
}
!function(E,t,e){"use strict";var r=function(){if(!(this instanceof r)){var e=new r;return e.init.call(e,Array.prototype.slice.call(arguments))}var o,n=null,l={includeEmptyValuedElements:!1,w3cSuccessfulControlsOnly:!1},i=/[^\[\]]+|\[\]/g,a=null;function f(e){if(e&&"object"==typeof e)return Object.keys(e).filter(function(e){return!isNaN(parseInt(e,10))}).splice(-1)[0]}function c(e){var n=f(e);return"string"==typeof n?parseInt(n,10)+1:0}function s(e){if("object"!=typeof e||null===e)return 0;var n,t=0;if("function"==typeof Object.keys)t=Object.keys(e).length;else for(n in e)e.hasOwnProperty(n)&&t++;return t}function p(e){return"INPUT"===e.nodeName&&"radio"===e.type}function v(e){return"INPUT"===e.nodeName&&"checkbox"===e.type}function d(e){return"SELECT"===e.nodeName&&"select-multiple"===e.type}function y(e){return e.checked}function m(e){if(p(e))return!!y(e)&&e.value;if(v(e))return!!y(e)&&e.value;if("INPUT"===(t=e).nodeName&&"file"===t.type)return!(!a.enctype||"multipart/form-data"!==a.enctype)&&(n=e,E.FileList&&n.files instanceof E.FileList&&0<e.files.length?e.files:!(!e.value||""===e.value)&&e.value);var n,t,r,u;if("TEXTAREA"===e.nodeName)return!(!e.value||""===e.value)&&e.value;if("SELECT"===(r=e).nodeName&&"select-one"===r.type)return e.value&&""!==e.value?e.value:!(!e.options||!e.options.length||""===e.options[0].value)&&e.options[0].value;if(d(e)){if(e.options&&0<e.options.length){var i=[];return function(e,n){if([].forEach)return[].forEach.call(e,n);var t;for(t=0;t<e.length;t++)n.call(e,e[t],t)}(e.options,function(e){e.selected&&i.push(e.value)}),l.includeEmptyValuedElements?i:!!i.length&&i}return!1}return"BUTTON"===(u=e).nodeName&&"submit"===u.type?e.value&&""!==e.value?e.value:!(!e.innerText||""===e.innerText)&&e.innerText:void 0!==e.value&&(l.includeEmptyValuedElements?e.value:""!==e.value&&e.value)}function h(e,n,t,r){var u,i=n[0];if(p(e))return!1!==t?r[i]=t:void 0;if(v(e)){if(!1===t)return;if(u=e.name,1<Array.prototype.filter.call(o,function(e){return e.name===u}).length)return r[i]||(r[i]=[]),r[i].push(t);r[i]=t}if(d(e)){if(!1===t)return;r[i]=t}return r[i]=t}function g(e,n,t,r){var u,i,o=n[0];return 1<n.length?"[]"===o?(r[c(r)]={},g(e,n.splice(1,n.length),t,r[(u=r,i=f(u),"string"==typeof i?parseInt(i,10):0)])):(r[o]&&0<s(r[o])||(r[o]={}),g(e,n.splice(1,n.length),t,r[o])):1===n.length?("[]"===o?r[c(r)]=t:h(e,n,t,r),r):void 0}return{init:function(e){return!(!e||"object"!=typeof e||!e[0])&&(n=e[0],void 0!==e[1]&&0<s(e[1])&&function(e,n){var t;for(t in n)n.hasOwnProperty(t)&&(e[t]=n[t])}(l,e[1]),!!function(){switch(typeof n){case"string":a=t.getElementById(n);break;case"object":(e=n)&&"object"==typeof e&&"nodeType"in e&&1===e.nodeType&&(a=n)}var e;return a}()&&!!(o=a.querySelectorAll("input, textarea, select")).length&&function(){var e,n,t,r=0,u={};for(r=0;r<o.length;r++)!(n=o[r]).name||""===n.name||n.disabled||p(n)&&!y(n)||(!1!==(t=m(n))||l.includeEmptyValuedElements)&&(1===(e=n.name.match(i)).length&&h(n,e,t||"",u),1<e.length&&g(n,e,t||"",u));return 0<s(u)&&u}())}}};"function"==typeof define&&define.amd?define(function(){return r}):"object"==typeof module&&module.exports?module.exports=r:E.formToObject=r}(window,document);// get-file-extension.js
jlogs('exist?', 'getFileExtension');

/**
 *
 * @param filename
 * @returns {string}
 */
function getFileExtension(filename) {
    return filename.split("?")[0].split("#")[0].split('.').pop();
}
// has-domain.js
jlogs('exist?','hasDomain');
/**
 * @param url
 * @returns {boolean}
 */
var hasDomain = function (url) {
    return url.indexOf('//') === 0 || url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
}
// is-array.js
jlogs('exist?','isArray');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArray(val) {
    return val !== null &&
        (typeof val === 'object' && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isBoolean');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isBoolean(val) {
    return val !== null &&
        (typeof val === 'boolean')
        ;
}
// is-empty.js
jlogs('exist?','isEmpty');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isEmpty(val) {
    return val == null ||
        typeof val === 'undefined' ||
        (typeof val === 'string' && val.length < 1) ||
        (typeof val === 'object' &&
            (
                !(
                    (typeof val.innerText !== 'undefined' && val.innerText.length !== 0) ||
                    (typeof val.innerHTML !== 'undefined' && val.innerHTML.length !== 0)
                )
                &&
                (Object.keys(val).length === 0)
            )
        )
        // (typeof val !== 'boolean')
        ;
}

//
// function isEmpty(obj) {
//     for (var prop in obj) {
//         if (obj.hasOwnProperty(prop)) {
//             return false;
//         }
//     }
//
//     return JSON.stringify(obj) === JSON.stringify({});
// }
// is-array.js
jlogs('exist?','isNumberGt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberGt(val, number) {
    return val !== null &&
        (typeof val === 'number' && val > number)
        ;
}
// is-array.js
jlogs('exist?','isNumberLt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberLt(val, number) {
    return val !== null &&
        (typeof val === 'number' && val < number)
        ;
}
// is-array.js
jlogs('exist?','isNumber');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumber(val) {
    return val !== null &&
        (typeof val === 'number')
        ;
}
// is-array.js
jlogs('exist?','isObject');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isObject(val) {
    return val !== null &&
        (typeof val === 'object' && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isStringEncoded');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isStringEncoded(val, type) {
    // base64, md5
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val, type) {
    // base64, md5
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val) {
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
//time.js
jlogs('exist?','time');

var time = Date.now || function () {
    return +new Date;
};
// xhr.js
jlogs('exist?','getXHRObject');
/**
 * @returns {boolean}
 */
function getXHRObject() {
    var xhrObj = false;
    try {
        xhrObj = new XMLHttpRequest();
    } catch (e) {
        var progid = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
            'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
        for (var i = 0; i < progid.length; ++i) {
            try {
                xhrObj = new ActiveXObject(progid[i]);
            } catch (e) {
                continue;
            }
            break;
        }
    } finally {

        return xhrObj;
    }
}
// xml2string.js
function xml2string(node) {
    if (typeof (XMLSerializer) !== 'undefined') {
        var serializer = new XMLSerializer();
        return serializer.serializeToString(node);
    } else if (node.xml) {
        return node.xml;
    }
}
// https://www.html5rocks.com/en/tutorials/cors/
/**
 * @param method
 * @param url
 * @returns {{withCredentials}|XDomainRequest}
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url, true);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}
// each.js
jlogs('exist?','each');

/**
 *
 * @param array
 * @param callback
 * @param limit
 * @param is_last
 * @param is_first
 */
function each(array, callback, limit, is_last, is_first) {

    // limit = 5;
    var count = 1;
    var obj = {};

    if (is_first) {
        obj = firstArray(array);
        callback(obj,0);

    } else if (is_last) {
        obj = lastArray(array);
        callback(obj,-1);

    } else {

        for (var key in array) {

            // skip loop if the property is from prototype
            if (!array.hasOwnProperty(key)) continue;
            if (count > limit) continue;
            count++;

            obj = array[key];

            // console.log(obj);
            // console.log(limit, count);

            callback(obj, key);
        }
    }
    // return this;
}

var firstArray = function (array) {
    var key = array.length - 1;
    return array[key];
}

var lastArray = function (array) {
    return array.slice(-1);
}
!function(E,t,e){"use strict";var r=function(){if(!(this instanceof r)){var e=new r;return e.init.call(e,Array.prototype.slice.call(arguments))}var o,n=null,l={includeEmptyValuedElements:!1,w3cSuccessfulControlsOnly:!1},i=/[^\[\]]+|\[\]/g,a=null;function f(e){if(e&&"object"==typeof e)return Object.keys(e).filter(function(e){return!isNaN(parseInt(e,10))}).splice(-1)[0]}function c(e){var n=f(e);return"string"==typeof n?parseInt(n,10)+1:0}function s(e){if("object"!=typeof e||null===e)return 0;var n,t=0;if("function"==typeof Object.keys)t=Object.keys(e).length;else for(n in e)e.hasOwnProperty(n)&&t++;return t}function p(e){return"INPUT"===e.nodeName&&"radio"===e.type}function v(e){return"INPUT"===e.nodeName&&"checkbox"===e.type}function d(e){return"SELECT"===e.nodeName&&"select-multiple"===e.type}function y(e){return e.checked}function m(e){if(p(e))return!!y(e)&&e.value;if(v(e))return!!y(e)&&e.value;if("INPUT"===(t=e).nodeName&&"file"===t.type)return!(!a.enctype||"multipart/form-data"!==a.enctype)&&(n=e,E.FileList&&n.files instanceof E.FileList&&0<e.files.length?e.files:!(!e.value||""===e.value)&&e.value);var n,t,r,u;if("TEXTAREA"===e.nodeName)return!(!e.value||""===e.value)&&e.value;if("SELECT"===(r=e).nodeName&&"select-one"===r.type)return e.value&&""!==e.value?e.value:!(!e.options||!e.options.length||""===e.options[0].value)&&e.options[0].value;if(d(e)){if(e.options&&0<e.options.length){var i=[];return function(e,n){if([].forEach)return[].forEach.call(e,n);var t;for(t=0;t<e.length;t++)n.call(e,e[t],t)}(e.options,function(e){e.selected&&i.push(e.value)}),l.includeEmptyValuedElements?i:!!i.length&&i}return!1}return"BUTTON"===(u=e).nodeName&&"submit"===u.type?e.value&&""!==e.value?e.value:!(!e.innerText||""===e.innerText)&&e.innerText:void 0!==e.value&&(l.includeEmptyValuedElements?e.value:""!==e.value&&e.value)}function h(e,n,t,r){var u,i=n[0];if(p(e))return!1!==t?r[i]=t:void 0;if(v(e)){if(!1===t)return;if(u=e.name,1<Array.prototype.filter.call(o,function(e){return e.name===u}).length)return r[i]||(r[i]=[]),r[i].push(t);r[i]=t}if(d(e)){if(!1===t)return;r[i]=t}return r[i]=t}function g(e,n,t,r){var u,i,o=n[0];return 1<n.length?"[]"===o?(r[c(r)]={},g(e,n.splice(1,n.length),t,r[(u=r,i=f(u),"string"==typeof i?parseInt(i,10):0)])):(r[o]&&0<s(r[o])||(r[o]={}),g(e,n.splice(1,n.length),t,r[o])):1===n.length?("[]"===o?r[c(r)]=t:h(e,n,t,r),r):void 0}return{init:function(e){return!(!e||"object"!=typeof e||!e[0])&&(n=e[0],void 0!==e[1]&&0<s(e[1])&&function(e,n){var t;for(t in n)n.hasOwnProperty(t)&&(e[t]=n[t])}(l,e[1]),!!function(){switch(typeof n){case"string":a=t.getElementById(n);break;case"object":(e=n)&&"object"==typeof e&&"nodeType"in e&&1===e.nodeType&&(a=n)}var e;return a}()&&!!(o=a.querySelectorAll("input, textarea, select")).length&&function(){var e,n,t,r=0,u={};for(r=0;r<o.length;r++)!(n=o[r]).name||""===n.name||n.disabled||p(n)&&!y(n)||(!1!==(t=m(n))||l.includeEmptyValuedElements)&&(1===(e=n.name.match(i)).length&&h(n,e,t||"",u),1<e.length&&g(n,e,t||"",u));return 0<s(u)&&u}())}}};"function"==typeof define&&define.amd?define(function(){return r}):"object"==typeof module&&module.exports?module.exports=r:E.formToObject=r}(window,document);// get-file-extension.js
jlogs('exist?', 'getFileExtension');

/**
 *
 * @param filename
 * @returns {string}
 */
function getFileExtension(filename) {
    return filename.split("?")[0].split("#")[0].split('.').pop();
}
// has-domain.js
jlogs('exist?','hasDomain');
/**
 * @param url
 * @returns {boolean}
 */
var hasDomain = function (url) {
    return url.indexOf('//') === 0 || url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
}
// is-array.js
jlogs('exist?','isArray');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArray(val) {
    return val !== null &&
        (val instanceof Array)
    // obj.constructor.toString().indexOf("Array") != -1
        ;
}
// is-array.js
jlogs('exist?','isBoolean');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isBoolean(val) {
    return val !== null &&
        (typeof val === 'boolean')
        ;
}
// is-empty.js
jlogs('exist?','isEmpty');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isEmpty(val) {
    return val == null ||
        typeof val === 'undefined' ||
        (typeof val === 'string' && val.length < 1) ||
        (typeof val === 'object' &&
            (
                !(
                    (typeof val.innerText !== 'undefined' && val.innerText.length !== 0) ||
                    (typeof val.innerHTML !== 'undefined' && val.innerHTML.length !== 0)
                )
                &&
                (Object.keys(val).length === 0)
            )
        )
        // (typeof val !== 'boolean')
        ;
}

//
// function isEmpty(obj) {
//     for (var prop in obj) {
//         if (obj.hasOwnProperty(prop)) {
//             return false;
//         }
//     }
//
//     return JSON.stringify(obj) === JSON.stringify({});
// }
// is-array.js
jlogs('exist?','isNumberGt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberGt(val, number) {
    return val !== null &&
        (typeof val === 'number' && val > number)
        ;
}
// is-array.js
jlogs('exist?','isNumberLt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberLt(val, number) {
    return val !== null &&
        (typeof val === 'number' && val < number)
        ;
}
// is-array.js
jlogs('exist?','isNumber');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumber(val) {
    return val !== null &&
        (typeof val === 'number')
        ;
}
// is-array.js
jlogs('exist?','isObject');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isObject(val) {
    return val !== null &&
        (typeof val === 'object' && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isStringEncoded');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isStringEncoded(val, type) {
    // base64, md5
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val, type) {
    // base64, md5
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val) {
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
//time.js
jlogs('exist?','time');

var time = Date.now || function () {
    return +new Date;
};
// xhr.js
jlogs('exist?','getXHRObject');
/**
 * @returns {boolean}
 */
function getXHRObject() {
    var xhrObj = false;
    try {
        xhrObj = new XMLHttpRequest();
    } catch (e) {
        var progid = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
            'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
        for (var i = 0; i < progid.length; ++i) {
            try {
                xhrObj = new ActiveXObject(progid[i]);
            } catch (e) {
                continue;
            }
            break;
        }
    } finally {

        return xhrObj;
    }
}
// xml2string.js
function xml2string(node) {
    if (typeof (XMLSerializer) !== 'undefined') {
        var serializer = new XMLSerializer();
        return serializer.serializeToString(node);
    } else if (node.xml) {
        return node.xml;
    }
}
// https://www.html5rocks.com/en/tutorials/cors/
/**
 * @param method
 * @param url
 * @returns {{withCredentials}|XDomainRequest}
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url, true);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}
// each.js
jlogs('exist?','each');

/**
 *
 * @param array
 * @param callback
 * @param limit
 * @param is_last
 * @param is_first
 */
function each(array, callback, limit, is_last, is_first) {

    // limit = 5;
    var count = 1;
    var obj = {};

    if (is_first) {
        obj = firstArray(array);
        callback(obj,0);

    } else if (is_last) {
        obj = lastArray(array);
        callback(obj,-1);

    } else {

        for (var key in array) {

            // skip loop if the property is from prototype
            if (!array.hasOwnProperty(key)) continue;
            if (count > limit) continue;
            count++;

            obj = array[key];

            // console.log(obj);
            // console.log(limit, count);

            callback(obj, key);
        }
    }
    // return this;
}

var firstArray = function (array) {
    var key = array.length - 1;
    return array[key];
}

var lastArray = function (array) {
    return array.slice(-1);
}
!function(E,t,e){"use strict";var r=function(){if(!(this instanceof r)){var e=new r;return e.init.call(e,Array.prototype.slice.call(arguments))}var o,n=null,l={includeEmptyValuedElements:!1,w3cSuccessfulControlsOnly:!1},i=/[^\[\]]+|\[\]/g,a=null;function f(e){if(e&&"object"==typeof e)return Object.keys(e).filter(function(e){return!isNaN(parseInt(e,10))}).splice(-1)[0]}function c(e){var n=f(e);return"string"==typeof n?parseInt(n,10)+1:0}function s(e){if("object"!=typeof e||null===e)return 0;var n,t=0;if("function"==typeof Object.keys)t=Object.keys(e).length;else for(n in e)e.hasOwnProperty(n)&&t++;return t}function p(e){return"INPUT"===e.nodeName&&"radio"===e.type}function v(e){return"INPUT"===e.nodeName&&"checkbox"===e.type}function d(e){return"SELECT"===e.nodeName&&"select-multiple"===e.type}function y(e){return e.checked}function m(e){if(p(e))return!!y(e)&&e.value;if(v(e))return!!y(e)&&e.value;if("INPUT"===(t=e).nodeName&&"file"===t.type)return!(!a.enctype||"multipart/form-data"!==a.enctype)&&(n=e,E.FileList&&n.files instanceof E.FileList&&0<e.files.length?e.files:!(!e.value||""===e.value)&&e.value);var n,t,r,u;if("TEXTAREA"===e.nodeName)return!(!e.value||""===e.value)&&e.value;if("SELECT"===(r=e).nodeName&&"select-one"===r.type)return e.value&&""!==e.value?e.value:!(!e.options||!e.options.length||""===e.options[0].value)&&e.options[0].value;if(d(e)){if(e.options&&0<e.options.length){var i=[];return function(e,n){if([].forEach)return[].forEach.call(e,n);var t;for(t=0;t<e.length;t++)n.call(e,e[t],t)}(e.options,function(e){e.selected&&i.push(e.value)}),l.includeEmptyValuedElements?i:!!i.length&&i}return!1}return"BUTTON"===(u=e).nodeName&&"submit"===u.type?e.value&&""!==e.value?e.value:!(!e.innerText||""===e.innerText)&&e.innerText:void 0!==e.value&&(l.includeEmptyValuedElements?e.value:""!==e.value&&e.value)}function h(e,n,t,r){var u,i=n[0];if(p(e))return!1!==t?r[i]=t:void 0;if(v(e)){if(!1===t)return;if(u=e.name,1<Array.prototype.filter.call(o,function(e){return e.name===u}).length)return r[i]||(r[i]=[]),r[i].push(t);r[i]=t}if(d(e)){if(!1===t)return;r[i]=t}return r[i]=t}function g(e,n,t,r){var u,i,o=n[0];return 1<n.length?"[]"===o?(r[c(r)]={},g(e,n.splice(1,n.length),t,r[(u=r,i=f(u),"string"==typeof i?parseInt(i,10):0)])):(r[o]&&0<s(r[o])||(r[o]={}),g(e,n.splice(1,n.length),t,r[o])):1===n.length?("[]"===o?r[c(r)]=t:h(e,n,t,r),r):void 0}return{init:function(e){return!(!e||"object"!=typeof e||!e[0])&&(n=e[0],void 0!==e[1]&&0<s(e[1])&&function(e,n){var t;for(t in n)n.hasOwnProperty(t)&&(e[t]=n[t])}(l,e[1]),!!function(){switch(typeof n){case"string":a=t.getElementById(n);break;case"object":(e=n)&&"object"==typeof e&&"nodeType"in e&&1===e.nodeType&&(a=n)}var e;return a}()&&!!(o=a.querySelectorAll("input, textarea, select")).length&&function(){var e,n,t,r=0,u={};for(r=0;r<o.length;r++)!(n=o[r]).name||""===n.name||n.disabled||p(n)&&!y(n)||(!1!==(t=m(n))||l.includeEmptyValuedElements)&&(1===(e=n.name.match(i)).length&&h(n,e,t||"",u),1<e.length&&g(n,e,t||"",u));return 0<s(u)&&u}())}}};"function"==typeof define&&define.amd?define(function(){return r}):"object"==typeof module&&module.exports?module.exports=r:E.formToObject=r}(window,document);// get-file-extension.js
jlogs('exist?', 'getFileExtension');

/**
 *
 * @param filename
 * @returns {string}
 */
function getFileExtension(filename) {
    return filename.split("?")[0].split("#")[0].split('.').pop();
}
// has-domain.js
jlogs('exist?','hasDomain');
/**
 * @param url
 * @returns {boolean}
 */
var hasDomain = function (url) {
    return url.indexOf('//') === 0 || url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
}
// is-array.js
jlogs('exist?','isArray');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArray(val) {
    return val !== null &&
        (val instanceof Array && Object.keys(val).length > 0)
    // obj.constructor.toString().indexOf("Array") != -1
        ;
}
// is-array.js
jlogs('exist?','isBoolean');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isBoolean(val) {
    return val !== null &&
        (typeof val === 'boolean')
        ;
}
// is-empty.js
jlogs('exist?','isEmpty');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isEmpty(val) {
    return val == null ||
        typeof val === 'undefined' ||
        (typeof val === 'string' && val.length < 1) ||
        (typeof val === 'object' &&
            (
                !(
                    (typeof val.innerText !== 'undefined' && val.innerText.length !== 0) ||
                    (typeof val.innerHTML !== 'undefined' && val.innerHTML.length !== 0)
                )
                &&
                (Object.keys(val).length === 0)
            )
        )
        // (typeof val !== 'boolean')
        ;
}

//
// function isEmpty(obj) {
//     for (var prop in obj) {
//         if (obj.hasOwnProperty(prop)) {
//             return false;
//         }
//     }
//
//     return JSON.stringify(obj) === JSON.stringify({});
// }
// is-array.js
jlogs('exist?','isNumberGt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberGt(val, number) {
    return val !== null &&
        (typeof val === 'number' && val > number)
        ;
}
// is-array.js
jlogs('exist?','isNumberLt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberLt(val, number) {
    return val !== null &&
        (typeof val === 'number' && val < number)
        ;
}
// is-array.js
jlogs('exist?','isNumber');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumber(val) {
    return val !== null &&
        (typeof val === 'number')
        ;
}
// is-array.js
jlogs('exist?','isObject');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isObject(val) {
    return val !== null &&
        (typeof val === 'object' && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isStringEncoded');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isStringEncoded(val, type) {
    // base64, md5
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val, type) {
    // base64, md5
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val) {
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
//time.js
jlogs('exist?','time');

var time = Date.now || function () {
    return +new Date;
};
// xhr.js
jlogs('exist?','getXHRObject');
/**
 * @returns {boolean}
 */
function getXHRObject() {
    var xhrObj = false;
    try {
        xhrObj = new XMLHttpRequest();
    } catch (e) {
        var progid = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
            'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
        for (var i = 0; i < progid.length; ++i) {
            try {
                xhrObj = new ActiveXObject(progid[i]);
            } catch (e) {
                continue;
            }
            break;
        }
    } finally {

        return xhrObj;
    }
}
// xml2string.js
function xml2string(node) {
    if (typeof (XMLSerializer) !== 'undefined') {
        var serializer = new XMLSerializer();
        return serializer.serializeToString(node);
    } else if (node.xml) {
        return node.xml;
    }
}
// https://www.html5rocks.com/en/tutorials/cors/
/**
 * @param method
 * @param url
 * @returns {{withCredentials}|XDomainRequest}
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url, true);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}
// each.js
jlogs('exist?','each');

/**
 *
 * @param array
 * @param callback
 * @param limit
 * @param is_last
 * @param is_first
 */
function each(array, callback, limit, is_last, is_first) {

    // limit = 5;
    var count = 1;
    var obj = {};

    if (is_first) {
        obj = firstArray(array);
        callback(obj,0);

    } else if (is_last) {
        obj = lastArray(array);
        callback(obj,-1);

    } else {

        for (var key in array) {

            // skip loop if the property is from prototype
            if (!array.hasOwnProperty(key)) continue;
            if (count > limit) continue;
            count++;

            obj = array[key];

            // console.log(obj);
            // console.log(limit, count);

            callback(obj, key);
        }
    }
    // return this;
}

var firstArray = function (array) {
    var key = array.length - 1;
    return array[key];
}

var lastArray = function (array) {
    return array.slice(-1);
}
!function(E,t,e){"use strict";var r=function(){if(!(this instanceof r)){var e=new r;return e.init.call(e,Array.prototype.slice.call(arguments))}var o,n=null,l={includeEmptyValuedElements:!1,w3cSuccessfulControlsOnly:!1},i=/[^\[\]]+|\[\]/g,a=null;function f(e){if(e&&"object"==typeof e)return Object.keys(e).filter(function(e){return!isNaN(parseInt(e,10))}).splice(-1)[0]}function c(e){var n=f(e);return"string"==typeof n?parseInt(n,10)+1:0}function s(e){if("object"!=typeof e||null===e)return 0;var n,t=0;if("function"==typeof Object.keys)t=Object.keys(e).length;else for(n in e)e.hasOwnProperty(n)&&t++;return t}function p(e){return"INPUT"===e.nodeName&&"radio"===e.type}function v(e){return"INPUT"===e.nodeName&&"checkbox"===e.type}function d(e){return"SELECT"===e.nodeName&&"select-multiple"===e.type}function y(e){return e.checked}function m(e){if(p(e))return!!y(e)&&e.value;if(v(e))return!!y(e)&&e.value;if("INPUT"===(t=e).nodeName&&"file"===t.type)return!(!a.enctype||"multipart/form-data"!==a.enctype)&&(n=e,E.FileList&&n.files instanceof E.FileList&&0<e.files.length?e.files:!(!e.value||""===e.value)&&e.value);var n,t,r,u;if("TEXTAREA"===e.nodeName)return!(!e.value||""===e.value)&&e.value;if("SELECT"===(r=e).nodeName&&"select-one"===r.type)return e.value&&""!==e.value?e.value:!(!e.options||!e.options.length||""===e.options[0].value)&&e.options[0].value;if(d(e)){if(e.options&&0<e.options.length){var i=[];return function(e,n){if([].forEach)return[].forEach.call(e,n);var t;for(t=0;t<e.length;t++)n.call(e,e[t],t)}(e.options,function(e){e.selected&&i.push(e.value)}),l.includeEmptyValuedElements?i:!!i.length&&i}return!1}return"BUTTON"===(u=e).nodeName&&"submit"===u.type?e.value&&""!==e.value?e.value:!(!e.innerText||""===e.innerText)&&e.innerText:void 0!==e.value&&(l.includeEmptyValuedElements?e.value:""!==e.value&&e.value)}function h(e,n,t,r){var u,i=n[0];if(p(e))return!1!==t?r[i]=t:void 0;if(v(e)){if(!1===t)return;if(u=e.name,1<Array.prototype.filter.call(o,function(e){return e.name===u}).length)return r[i]||(r[i]=[]),r[i].push(t);r[i]=t}if(d(e)){if(!1===t)return;r[i]=t}return r[i]=t}function g(e,n,t,r){var u,i,o=n[0];return 1<n.length?"[]"===o?(r[c(r)]={},g(e,n.splice(1,n.length),t,r[(u=r,i=f(u),"string"==typeof i?parseInt(i,10):0)])):(r[o]&&0<s(r[o])||(r[o]={}),g(e,n.splice(1,n.length),t,r[o])):1===n.length?("[]"===o?r[c(r)]=t:h(e,n,t,r),r):void 0}return{init:function(e){return!(!e||"object"!=typeof e||!e[0])&&(n=e[0],void 0!==e[1]&&0<s(e[1])&&function(e,n){var t;for(t in n)n.hasOwnProperty(t)&&(e[t]=n[t])}(l,e[1]),!!function(){switch(typeof n){case"string":a=t.getElementById(n);break;case"object":(e=n)&&"object"==typeof e&&"nodeType"in e&&1===e.nodeType&&(a=n)}var e;return a}()&&!!(o=a.querySelectorAll("input, textarea, select")).length&&function(){var e,n,t,r=0,u={};for(r=0;r<o.length;r++)!(n=o[r]).name||""===n.name||n.disabled||p(n)&&!y(n)||(!1!==(t=m(n))||l.includeEmptyValuedElements)&&(1===(e=n.name.match(i)).length&&h(n,e,t||"",u),1<e.length&&g(n,e,t||"",u));return 0<s(u)&&u}())}}};"function"==typeof define&&define.amd?define(function(){return r}):"object"==typeof module&&module.exports?module.exports=r:E.formToObject=r}(window,document);// get-file-extension.js
jlogs('exist?', 'getFileExtension');

/**
 *
 * @param filename
 * @returns {string}
 */
function getFileExtension(filename) {
    return filename.split("?")[0].split("#")[0].split('.').pop();
}
// has-domain.js
jlogs('exist?','hasDomain');
/**
 * @param url
 * @returns {boolean}
 */
var hasDomain = function (url) {
    return url.indexOf('//') === 0 || url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
}
// is-array.js
jlogs('exist?','isArrayMany');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArrayMany(val) {
    return val !== null &&
        (val instanceof Array && Object.keys(val).length > 1)
    // obj.constructor.toString().indexOf("Array") != -1
        ;
}
// is-array.js
jlogs('exist?','isArrayNotEmpty');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArrayNotEmpty(val) {
    return val !== null &&
        (val instanceof Array && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isArrayOne');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArrayOne(val) {
    return val !== null &&
        (val instanceof Array && Object.keys(val).length === 1)
    // obj.constructor.toString().indexOf("Array") != -1
        ;
}
// is-array.js
jlogs('exist?','isArray');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArray(val) {
    return val !== null &&
        (val instanceof Array)
    // obj.constructor.toString().indexOf("Array") != -1
        ;
}
// is-array.js
jlogs('exist?','isBoolean');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isBoolean(val) {
    return val !== null &&
        (typeof val === 'boolean')
        ;
}
// is-empty.js
jlogs('exist?','isEmpty');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isEmpty(val) {
    return val == null ||
        typeof val === 'undefined' ||
        (typeof val === 'string' && val.length < 1) ||
        (typeof val === 'object' &&
            (
                !(
                    (typeof val.innerText !== 'undefined' && val.innerText.length !== 0) ||
                    (typeof val.innerHTML !== 'undefined' && val.innerHTML.length !== 0)
                )
                &&
                (Object.keys(val).length === 0)
            )
        )
        // (typeof val !== 'boolean')
        ;
}

//
// function isEmpty(obj) {
//     for (var prop in obj) {
//         if (obj.hasOwnProperty(prop)) {
//             return false;
//         }
//     }
//
//     return JSON.stringify(obj) === JSON.stringify({});
// }
// is-array.js
jlogs('exist?','isNumberGt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberGt(val, number) {
    return val !== null &&
        (typeof val === 'number' && val > number)
        ;
}
// is-array.js
jlogs('exist?','isNumberLt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberLt(val, number) {
    return val !== null &&
        (typeof val === 'number' && val < number)
        ;
}
// is-array.js
jlogs('exist?','isNumber');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumber(val) {
    return val !== null &&
        (typeof val === 'number')
        ;
}
// is-array.js
jlogs('exist?','isObject');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isObject(val) {
    return val !== null &&
        (typeof val === 'object' && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isStringEncoded');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isStringEncoded(val, type) {
    // base64, md5
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val, type) {
    // base64, md5
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val) {
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
//time.js
jlogs('exist?','time');

var time = Date.now || function () {
    return +new Date;
};
// xhr.js
jlogs('exist?','getXHRObject');
/**
 * @returns {boolean}
 */
function getXHRObject() {
    var xhrObj = false;
    try {
        xhrObj = new XMLHttpRequest();
    } catch (e) {
        var progid = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
            'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
        for (var i = 0; i < progid.length; ++i) {
            try {
                xhrObj = new ActiveXObject(progid[i]);
            } catch (e) {
                continue;
            }
            break;
        }
    } finally {

        return xhrObj;
    }
}
// xml2string.js
function xml2string(node) {
    if (typeof (XMLSerializer) !== 'undefined') {
        var serializer = new XMLSerializer();
        return serializer.serializeToString(node);
    } else if (node.xml) {
        return node.xml;
    }
}
// https://www.html5rocks.com/en/tutorials/cors/
/**
 * @param method
 * @param url
 * @returns {{withCredentials}|XDomainRequest}
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url, true);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}
// each.js
jlogs('exist?','each');

/**
 *
 * @param array
 * @param callback
 * @param limit
 * @param is_last
 * @param is_first
 */
function each(array, callback, limit, is_last, is_first) {

    // limit = 5;
    var count = 1;
    var obj = {};

    if (is_first) {
        obj = firstArray(array);
        callback(obj,0);

    } else if (is_last) {
        obj = lastArray(array);
        callback(obj,-1);

    } else {

        for (var key in array) {

            // skip loop if the property is from prototype
            if (!array.hasOwnProperty(key)) continue;
            if (count > limit) continue;
            count++;

            obj = array[key];

            // console.log(obj);
            // console.log(limit, count);

            callback(obj, key);
        }
    }
    // return this;
}

var firstArray = function (array) {
    var key = array.length - 1;
    return array[key];
}

var lastArray = function (array) {
    return array.slice(-1);
}
!function(E,t,e){"use strict";var r=function(){if(!(this instanceof r)){var e=new r;return e.init.call(e,Array.prototype.slice.call(arguments))}var o,n=null,l={includeEmptyValuedElements:!1,w3cSuccessfulControlsOnly:!1},i=/[^\[\]]+|\[\]/g,a=null;function f(e){if(e&&"object"==typeof e)return Object.keys(e).filter(function(e){return!isNaN(parseInt(e,10))}).splice(-1)[0]}function c(e){var n=f(e);return"string"==typeof n?parseInt(n,10)+1:0}function s(e){if("object"!=typeof e||null===e)return 0;var n,t=0;if("function"==typeof Object.keys)t=Object.keys(e).length;else for(n in e)e.hasOwnProperty(n)&&t++;return t}function p(e){return"INPUT"===e.nodeName&&"radio"===e.type}function v(e){return"INPUT"===e.nodeName&&"checkbox"===e.type}function d(e){return"SELECT"===e.nodeName&&"select-multiple"===e.type}function y(e){return e.checked}function m(e){if(p(e))return!!y(e)&&e.value;if(v(e))return!!y(e)&&e.value;if("INPUT"===(t=e).nodeName&&"file"===t.type)return!(!a.enctype||"multipart/form-data"!==a.enctype)&&(n=e,E.FileList&&n.files instanceof E.FileList&&0<e.files.length?e.files:!(!e.value||""===e.value)&&e.value);var n,t,r,u;if("TEXTAREA"===e.nodeName)return!(!e.value||""===e.value)&&e.value;if("SELECT"===(r=e).nodeName&&"select-one"===r.type)return e.value&&""!==e.value?e.value:!(!e.options||!e.options.length||""===e.options[0].value)&&e.options[0].value;if(d(e)){if(e.options&&0<e.options.length){var i=[];return function(e,n){if([].forEach)return[].forEach.call(e,n);var t;for(t=0;t<e.length;t++)n.call(e,e[t],t)}(e.options,function(e){e.selected&&i.push(e.value)}),l.includeEmptyValuedElements?i:!!i.length&&i}return!1}return"BUTTON"===(u=e).nodeName&&"submit"===u.type?e.value&&""!==e.value?e.value:!(!e.innerText||""===e.innerText)&&e.innerText:void 0!==e.value&&(l.includeEmptyValuedElements?e.value:""!==e.value&&e.value)}function h(e,n,t,r){var u,i=n[0];if(p(e))return!1!==t?r[i]=t:void 0;if(v(e)){if(!1===t)return;if(u=e.name,1<Array.prototype.filter.call(o,function(e){return e.name===u}).length)return r[i]||(r[i]=[]),r[i].push(t);r[i]=t}if(d(e)){if(!1===t)return;r[i]=t}return r[i]=t}function g(e,n,t,r){var u,i,o=n[0];return 1<n.length?"[]"===o?(r[c(r)]={},g(e,n.splice(1,n.length),t,r[(u=r,i=f(u),"string"==typeof i?parseInt(i,10):0)])):(r[o]&&0<s(r[o])||(r[o]={}),g(e,n.splice(1,n.length),t,r[o])):1===n.length?("[]"===o?r[c(r)]=t:h(e,n,t,r),r):void 0}return{init:function(e){return!(!e||"object"!=typeof e||!e[0])&&(n=e[0],void 0!==e[1]&&0<s(e[1])&&function(e,n){var t;for(t in n)n.hasOwnProperty(t)&&(e[t]=n[t])}(l,e[1]),!!function(){switch(typeof n){case"string":a=t.getElementById(n);break;case"object":(e=n)&&"object"==typeof e&&"nodeType"in e&&1===e.nodeType&&(a=n)}var e;return a}()&&!!(o=a.querySelectorAll("input, textarea, select")).length&&function(){var e,n,t,r=0,u={};for(r=0;r<o.length;r++)!(n=o[r]).name||""===n.name||n.disabled||p(n)&&!y(n)||(!1!==(t=m(n))||l.includeEmptyValuedElements)&&(1===(e=n.name.match(i)).length&&h(n,e,t||"",u),1<e.length&&g(n,e,t||"",u));return 0<s(u)&&u}())}}};"function"==typeof define&&define.amd?define(function(){return r}):"object"==typeof module&&module.exports?module.exports=r:E.formToObject=r}(window,document);// get-file-extension.js
jlogs('exist?', 'getFileExtension');

/**
 *
 * @param filename
 * @returns {string}
 */
function getFileExtension(filename) {
    return filename.split("?")[0].split("#")[0].split('.').pop();
}
// has-domain.js
jlogs('exist?','hasDomain');
/**
 * @param url
 * @returns {boolean}
 */
var hasDomain = function (url) {
    return url.indexOf('//') === 0 || url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
}
// is-array.js
jlogs('exist?','isArrayMany');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArrayMany(val) {
    return val !== null &&
        (val instanceof Array && Object.keys(val).length > 1)
    // obj.constructor.toString().indexOf("Array") != -1
        ;
}
// is-array.js
jlogs('exist?','isArrayNotEmpty');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArrayNotEmpty(val) {
    return val !== null &&
        (val instanceof Array && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isArrayOne');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArrayOne(val) {
    return val !== null &&
        (val instanceof Array && Object.keys(val).length === 1)
    // obj.constructor.toString().indexOf("Array") != -1
        ;
}
// is-array.js
jlogs('exist?','isArray');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isArray(val) {
    return val !== null &&
        (val instanceof Array)
    // obj.constructor.toString().indexOf("Array") != -1
        ;
}
// is-array.js
jlogs('exist?','isBoolean');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isBoolean(val) {
    return val !== null &&
        (typeof val === 'boolean')
        ;
}
// is-empty.js
jlogs('exist?','isEmpty');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isEmpty(val) {
    return val == null ||
        typeof val === 'undefined' ||
        (typeof val === 'string' && val.length < 1) ||
        (typeof val === 'object' &&
            (
                !(
                    (typeof val.innerText !== 'undefined' && val.innerText.length !== 0) ||
                    (typeof val.innerHTML !== 'undefined' && val.innerHTML.length !== 0)
                )
                &&
                (Object.keys(val).length === 0)
            )
        )
        // (typeof val !== 'boolean')
        ;
}

//
// function isEmpty(obj) {
//     for (var prop in obj) {
//         if (obj.hasOwnProperty(prop)) {
//             return false;
//         }
//     }
//
//     return JSON.stringify(obj) === JSON.stringify({});
// }
// is-array.js
jlogs('exist?','isNumberGt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberGt(val, number) {
    return val !== null &&
        (typeof val === 'number' && val > number)
        ;
}
// is-array.js
jlogs('exist?','isNumberLt');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumberLt(val, number) {
    return val !== null &&
        (typeof val === 'number' && val < number)
        ;
}
// is-array.js
jlogs('exist?','isNumber');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isNumber(val) {
    return val !== null &&
        (typeof val === 'number')
        ;
}
// is-array.js
jlogs('exist?','isObject');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isObject(val) {
    return val !== null &&
        !(val instanceof Array) &&
        (typeof val === 'object' && Object.keys(val).length > 0)
        ;
}
// is-array.js
jlogs('exist?','isStringEncoded');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isStringEncoded(val, type) {
    // base64, md5
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val, type) {
    // base64, md5
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
// is-array.js
jlogs('exist?','isString');
/**
 *
 * @param val
 * @returns {boolean}
 */
function isString(val) {
    return val !== null &&
        (typeof val === 'string' && val.length > 0)
        ;
}
//time.js
jlogs('exist?','time');

var time = Date.now || function () {
    return +new Date;
};
// xhr.js
jlogs('exist?','getXHRObject');
/**
 * @returns {boolean}
 */
function getXHRObject() {
    var xhrObj = false;
    try {
        xhrObj = new XMLHttpRequest();
    } catch (e) {
        var progid = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
            'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
        for (var i = 0; i < progid.length; ++i) {
            try {
                xhrObj = new ActiveXObject(progid[i]);
            } catch (e) {
                continue;
            }
            break;
        }
    } finally {

        return xhrObj;
    }
}
// xml2string.js
function xml2string(node) {
    if (typeof (XMLSerializer) !== 'undefined') {
        var serializer = new XMLSerializer();
        return serializer.serializeToString(node);
    } else if (node.xml) {
        return node.xml;
    }
}
