/*! aladdin-ibank.js v1.0.7 (c) 2017 aladdin-ibank */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.aladdin = factory());
}(window, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var aladdin_extension = createCommonjsModule(function (module, exports) {
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.aladdin = factory());
}(commonjsGlobal, (function () { 'use strict';

var commonjsGlobal$$1 = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};





function createCommonjsModule$$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var aladdin_min = createCommonjsModule$$1(function (module, exports) {
/*! Aladdin.js v1.0.8 (c) 2016-2017 Aladdin */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.aladdin=e();}(commonjsGlobal$$1,function(){"use strict";function t(t){setTimeout(t);}function e(t,e,n){Object.defineProperty(t,e,{value:n,writable:!1});}function n(t,e,n){if(void 0===n&&(n="string"),void 0===e||typeof e!==n){ throw new TypeError("The "+t+" must be a "+n+" and a value") }}function i(t){var e=function(e){e&&this.emit("error",e),t.apply(null,arguments);}.bind(this);return e.keep=t.keep,e}function o(){this._ts=(new Date).getTime(),this._callTimes=0,this._handlers={},this._subscribers={},this._middlewares=[];}function r(t,e){if(void 0===e&&(e=!1),!t||"object"!=typeof t){ return""; }var n=[];for(var i in t){var o=t[i];if(Array.isArray(o)){ for(var r in o){ n.push((e?i:i+"[]")+"="+encodeURIComponent(o[r])); } }else { n.push(i+"="+encodeURIComponent(o)); }}return n.join("&")}function a(t,e,n){void 0===n&&(n=!1);var i=r(e,n);return""!==i&&(i=(/\?/.test(t)?"&":"?")+i),t+i}function s(t){this._aladdin=t;}function c(t){var e=this;for(var n in t){ e[n]=t[n]; }}function l(t){return function(e,n){t(e,new c(n));}}function u(t){return t=t||{},t.method=t.method?t.method.toLowerCase():"get",t.headers||(t.headers={}),"post"!==t.method&&"put"!==t.method&&"patch"!==t.method&&"delete"!==t.method||t.headers["Content-Type"]||(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.qs&&"[object Object]"===Object.prototype.toString.call(t.qs)&&(t.url=a(t.url,t.qs,t.traditional)),t.body&&"[object Object]"===Object.prototype.toString.call(t.body)&&(/x-www-form-urlencoded/.test(t.headers["Content-Type"])?t.body=r(t.body,t.traditional):t.body=JSON.stringify(t.body)),t}function p(t){this._aladdin=t;}function d(t){this._aladdin=t;}function h(t){d.call(this,t);}function f(t){d.call(this,t);}function y(t){this._aladdin=t;}function m(t){this._aladdin=t;}function _(t){this._aladdin=t;}function b(t){this._aladdin=t;}var v,g,w,A=navigator.userAgent,I=/AladdinHybrid\/(\d+\.\d+\.?\d*.*?) \((.*?) (\d+\.\d+\.?\d*.*?)\)/i.exec(A);Array.isArray(I)&&(v=I[1],g=I[2],w=I[3]);var C={hybridVersion:v,appName:g,appVersion:w,isMobile:/Mobile/i.test(A),isAndroid:/Android/i.test(A),isiOS:!!A.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i),isiPhone:/iPhone/i.test(A),isiPad:/iPad/i.test(A),isiPod:/iPod/i.test(A),isHybrid:!!v,isBrowser:!v,isWechat:/MicroMessenger/i.test(A),isQQ:/ QQ\//i.test(A)},S={};e(o.prototype,"version","1.0.8"),o.prototype.on=function(t,e){return n("event name",t),n("event listener",e,"function"),(this._subscribers[t]||(this._subscribers[t]=[])).push(e),this},o.prototype.once=function(t,e){var n=this,i=function(){n.off(t,i),e.apply(this,arguments);};return i.listener=e,this.on(t,i),this},o.prototype.off=function(t,e){var i=this;if(!arguments.length){for(t in i._subscribers){ delete i._subscribers[t]; }return this}if(n("event name",t),!e&&this._subscribers[t]){ return delete this._subscribers[t],this; }var o=this._subscribers[t];if(!o){ return this; }for(var r,a=o.length;a--;){ if((r=o[a])===e||r.listener===e){i._subscribers[t].splice(a,1);break} }return this},o.prototype.emit=function(t){
var arguments$1 = arguments;
for(var e=[],i=arguments.length-1;i-- >0;){ e[i]=arguments$1[i+1]; }n("event name",t);var o=this._subscribers[t];if(o){ for(var r in o){ o[r].apply(null,e); } }return this},o.prototype.broadcast=function(t,e,i,o){return n("event name",t),"function"==typeof e?(o=e,e={}):"function"==typeof i&&(o=i,i=""),this.call("aladdin","broadcast",{eventName:t,event:e,url:i},o),this},o.prototype.use=function(t,e){n("Component",t,"function");var i=new t(this);return e=e||i.name||t.name.replace(/^([A-Z])/,function(t){return t.toLowerCase()}),n("Component's name",e),this[e]=i,this},o.prototype.middleware=function(t){return"function"==typeof t&&this._middlewares.push(t),this},o.prototype.support=function(t,e,i){return n("component name",t),"function"==typeof e&&(i=e,e=""),this.call("aladdin","support",{component:t,action:e},i),this},o.prototype._transformHandlers=function(t,e,n,o){var r=this;for(var a in n){var s=n[a];if(s){var c=Object.prototype.toString.call(s);if("[object Object]"!==c&&"[object Array]"!==c||r._transformHandlers(t,e,s,o),"[object Function]"===c){var l=o+"_function_"+t+"_"+e+"_"+(isNaN(a)?a:"callback");n[a]=l,r._handlers[l]=i.call(r,s);}}}},o.prototype.call=function(){var e=arguments,n=this;t(function(){n.callSync.apply(n,e);});},o.prototype.callSync=function(t,e){
var arguments$1 = arguments;
for(var n=[],i=arguments.length-2;i-- >0;){ n[i]=arguments$1[i+2]; }var o={component:t,action:e,args:n,callId:(this._ts+ ++this._callTimes).toString(16)};if(this._middlewares.length>0&&!(o=this._middlewares.reduce(function(t,e){return e(t)},o))){ return this; }this._transformHandlers(o.component,o.action,o.args,o.callId),o.message=o.component+"."+o.action+"?"+encodeURIComponent(JSON.stringify(o.args)),this.emit("call",o);var r;if(C.isAndroid){ r=prompt("aladdin://"+o.message); }else if(C.isiOS){S[o.callId]=o.message,window.__ALADDIN__||(window.__ALADDIN__={});var a=document.createElement("IFRAME");a.setAttribute("src","aladdin://delay-fetch?callId="+o.callId),a.setAttribute("style","display: none;"),document.documentElement.appendChild(a),a.parentNode.removeChild(a),a=null,r=window.__ALADDIN__.retValue,window.__ALADDIN__.retValue=void 0;}return r},o.prototype.callback=function(t){
var arguments$1 = arguments;
for(var e=[],n=arguments.length-1;n-- >0;){ e[n]=arguments$1[n+1]; }if(t){var i=this._handlers[t];this.emit("callback",{handlerKey:t,handler:i,args:e}),i&&"function"==typeof i&&(i.apply(null,e),i.keep||delete this._handlers[t]);}},o.prototype.fetch=function(t){var e=S[t];return e&&delete S[t],e},e(s.prototype,"name","navigator"),s.prototype.forward=function(t,e){return t=t||{},t.url=t.url||"",t.transition=t.transition||"pushFromRight",t.qs&&"object"==typeof t.qs&&(t.url=a(t.url,t.qs,t.traditional)),this._aladdin.call(this.name,"forward",t,e),this},s.prototype.replace=function(t,e){return t=t||{},t.url=t.url||"",t.transition=t.transition||"pushFromRight",t.qs&&"object"==typeof t.qs&&(t.url=a(t.url,t.qs,t.traditional)),this._aladdin.call(this.name,"replace",t,e),this},s.prototype.back=function(t,e){return t=t||{},"function"==typeof t&&(e=t,t={}),this._aladdin.call(this.name,"back",t,e),this},s.prototype.backTop=function(t,e){return t=t||{},"function"==typeof t&&(e=t,t={}),this._aladdin.call(this.name,"backTop",t,e),this},c.prototype.json=function(){return this.body?JSON.parse(this.body):{}},c.prototype.text=function(){return this.body},c.prototype.header=function(t){var e=this;if(t=t.toLowerCase(),!this.headers){ return""; }for(var n in e.headers){ if(n.toLowerCase()===t){ return e.headers[n]; } }return""},e(p.prototype,"name","http"),p.prototype.request=function(t,e){return t=u(t),e=l(e),this._aladdin.call(this.name,"request",t,e),this},p.prototype.setCookie=function(t,e){return this._aladdin.call(this.name,"setCookie",t,e),this},p.prototype.getCookie=function(t,e,n){return this._aladdin.call(this.name,"getCookie",t,e,n),this},p.prototype.removeCookie=function(t,e,n){return this._aladdin.call(this.name,"removeCookie",t,e,n),this},p.prototype.upload=function(t,e){return t=t||{},t.method=t.method||"post",t=u(t),this._aladdin.call(this.name,"upload",t,e),this},p.prototype.download=function(t,e){return t=u(t),this._aladdin.call(this.name,"download",t,e),this};var k=function(t,e){function n(){this.constructor=t;}for(var i in e){ e.hasOwnProperty(i)&&(t[i]=e[i]); }t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n);},D=function(t){return"string"!=typeof t&&("[object Null]"===toString.call(t)||void 0===t?t+="":t=t.toString()),t};d.prototype.getItem=function(t,e,n,i){"function"==typeof e?(i=e,e=!1,n="3DES"):"function"==typeof n?(e=!!e,i=n,n="3DES"):(e=!!e,n=n||"3DES"),t=D(t);var o={key:t,share:e,crypto:n};return this._aladdin.call(this.name,"getItem",o,function(t,e){try{e=JSON.parse(e);}catch(t){e=null;}i(t,e);}),this},d.prototype.setItem=function(t,e,n,i,o){t=D(t),e=JSON.stringify(e),"function"==typeof n?(o=n,n=!1,i="3DES"):"function"==typeof i?(n=!!n,o=i,i="3DES"):(n=!!n,i=i||"3DES");var r={key:t,value:e,share:n,crypto:i};return this._aladdin.call(this.name,"setItem",r,o),this},d.prototype.removeItem=function(t,e,n){t=D(t),"function"==typeof e&&(n=e,e=!1);var i={key:t,share:e};return this._aladdin.call(this.name,"removeItem",i,n),this},d.prototype.clear=function(t){return this._aladdin.call(this.name,"clear",t),this},k(h,d),e(h.prototype,"name","localStorage"),k(f,d),e(f.prototype,"name","sessionStorage"),e(y.prototype,"name","device"),y.prototype.getInfo=function(t){return this._aladdin.call(this.name,"getInfo",t),this},e(m.prototype,"name","network"),m.prototype.getInfo=function(t){return this._aladdin.call(this.name,"getInfo",t),this},e(_.prototype,"name","header"),_.prototype.config=function(t,e){return this._aladdin.call(this.name,"config",t||{},e),this},e(b.prototype,"name","page"),b.prototype.bounce=function(t,e){return this.config({bounce:!!t},e),this},b.prototype.swipe=function(t,e){return this.config({swipe:!!t},e),this},b.prototype.config=function(t,e){return this._aladdin.call(this.name,"config",t||{},e),this};var j=new o;return j.env=C,j.use(s).use(p).use(y).use(m).use(_).use(h).use(f).use(b),function(e){window.__ALADDIN_CALLBACK__=function(){var n=arguments;t(function(){e.callback.apply(e,n);});},window.__ALADDIN_EVENT_EMIT__=function(){var n=arguments;t(function(){e.emit.apply(e,n);});},window.__ALADDIN_FETCH__=function(t){return e.fetch(t)};}(j),j});
});


return aladdin_min;

})));
});

function Crypto(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Crypto.prototype, 'name', {
  value: 'crypto',
  writable: false
});

/**
 * ???????????????????????????????????????????????????????????????????????????RSA | DES ???????????????????????????Native??????,H5????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 * @returns this
 */
Crypto.prototype.encrypt = function(opts, cb) {
  var formats = {
    '3DES': 'base64'
  };
  if (opts && opts.params && opts.params.format === undefined) {
    opts.params.format = formats[opts.mode] || '16';
  }
  this._aladdin.call(this.name, 'encrypt', opts || {}, cb);
  return this;
};

/**
 * ????????????????????????????????????????????????????????????????????????(??????????????????MD5???????????????RSA | DES ???????????????????????????Native??????,H5?????????)
 *
 * @param {Object} opts
 * @param {Function} cb
 * @returns this
 */
Crypto.prototype.decrypt = function(opts, cb) {
  this._aladdin.call(this.name, 'decrypt', opts || {}, cb);
  return this;
};

function AlipBorad(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(AlipBorad.prototype, 'name', {
  value: 'bowalipborad',
  writable: false
});

/**
 * ????????????????????????
 *
 * @param {Object} opts
 * @property {String} copyStr ??????????????????
 * @param {Function} cb
 */
AlipBorad.prototype.copy = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'copy', opts, cb);
};

/**
 * ???????????????
 *
 * @param {Function} cb
 */
AlipBorad.prototype.clear = function(cb) {
  return this._aladdin.call(this.name, 'clear', cb);
};

function Application(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Application.prototype, 'name', {
  value: 'bowapplication',
  writable: false
});

/**
 * ??????????????????
 *
 * @param {Function} cb
 */
Application.prototype.getEnvironment = function(cb) {
  return this._aladdin.call(this.name, 'getEnvironment', cb);
};


/**
 * ??????????????????
 *
 * @param {Function} cb
 */
Application.prototype.getSimpleEnvironmentSync = function() {
  return this._aladdin.callSync(this.name, 'getSimpleEnvironmentSync');
};

/**
 * @callback cb (error, data)
 * @param {Object} error ???????????? ????????? ??????????????????301XX???
 * @param {Object} data ????????????
 * @property {Object} appConfig config??????,????????????????????????app?????????????????????XML????????????????????????https://bankupload.pingan.com.cn/smartphone/config/PAEBank_2/iphone_config2_0.xml
 * @property {String} versionCode ????????????code
 * @property {String} versionName ????????????name
 * @property {String} interface ????????????
 * @property {String} context F5?????????ibp/smp)
 * @property {String} domain ????????????
 */


/**
 * ??????????????????
 *
 * @param {Function} cb
 */
Application.prototype.getServerTime = function(cb) {
  return this._aladdin.call(this.name, 'getServerTime', cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error ???????????? ????????? ??????????????????301XX???
 * @param {Object} data ????????????
 */

/**
 * ??????????????????
 *
 * @param {Function} cb
 */
Application.prototype.exit = function(cb) {
  return this._aladdin.call(this.name, 'exit', cb);
};

/**
 * ???????????????
 *
 * @param {Function} cb
 */
Application.prototype.grade = function(cb) {
  return this._aladdin.call(this.name, 'grade', cb);
};

/**
 * ????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Application.prototype.upgrade = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'upgrade', opts, cb);
};

/**
 * ????????????
 *
 * @param {Function} cb
 */
Application.prototype.service = function(cb) {
  return this._aladdin.call(this.name, 'service', cb);
};

/**
 * ????????????-??????????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Application.prototype.modifyHint = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'modifyHint', opts, cb);
};

/**
 * ???????????????router????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Application.prototype.route = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'route', opts, cb);
};

/**
 * ??????????????????????????????????????????
 *
 * @param {Function} cb
 */
Application.prototype.refreshMoreGuideMark = function(cb) {
  return this._aladdin.call(this.name, 'refreshMoreGuideMark', cb);
};

/**
 * ??????????????????
 */
Application.prototype.getVerisonSign = function(cb) {
  return this._aladdin.call(this.name, 'getVersionSign', cb);
};

/**
 * ??????????????????
 *
 * @param {String} module ????????????????????????????????????????????????????????????
 *
 * @param {Function} cb(err,data)
 *   data:{remote:'',local:''}
 */
Application.prototype.getModuleUrl = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name, 'getModuleUrl', opts, cb);
};

/**
 * ??????????????????
 */
Application.prototype.getDevFinger = function(cb) {
  return this._aladdin.call(this.name, 'getDevFinger', cb);
};


/**
 * ??????appid
 */
Application.prototype.getAppIdSync = function() {
  return this._aladdin.callSync(this.name, 'getAppIdSync');
};

/**
* ????????????webview
* @param {Object} opts ??????
*                     opts = { "url": "/messageCenter/pages/redpackOpacityWin.html" }
* @param {Function} cb ????????????
*/
Application.prototype.showOpacityWindow = function(opts,cb) {
  opts = opts || {};
  return this._aladdin.call(this.name, 'showOpacityWindow', opts, cb);
};
/**
* ????????????webview
* @param {Function} cb ????????????
*/
Application.prototype.hideOpacityWindow = function(cb) {
  return this._aladdin.call(this.name, 'hideOpacityWindow', cb);
};
/**
* ??????app??????????????????????????????app
* @param {Function} otps ????????????
* ????????????:
    "schemes":"IOS???Schemes";
    "from":"??????";
    ???downloadUrl_iOS":"???app???iOS???????????????;
    "openAppUrl":"???scheme???????????????app???????????????????????????";
* @param {Function} cb ????????????
*/
Application.prototype.isAppExistAndAction = function(opts,cb) {
  opts = opts || {};
  return this._aladdin.call(this.name, 'isAppExistAndAction', opts, cb);
};

function Audio(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Audio.prototype, 'name', {
  value: 'bowaudio',
  writable: false
});

/**
 * ??????????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Audio.prototype.play = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'play', opts, cb);
};

/**
 * ??????????????????
 *
 * @param {Function} cb
 */
Audio.prototype.stop = function(cb) {
  return this._aladdin.call(this.name, 'stop', cb);
};

/**
 * ??????????????????
 *
 * @param {Function} cb
 */
Audio.prototype.pause = function(cb) {
  return this._aladdin.call(this.name, 'pause', cb);
};

/**
 * BreakPoint????????????.
 *
 * @constructor
 * @param {object} adapter
 */
function BreakPointTool(aladdin) {
    this._aladdin = aladdin;
}

Object.defineProperty(BreakPointTool.prototype, 'name', {
    value: 'bowbreakPointTool',
    writable: false
});

/**
 * ????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
BreakPointTool.prototype.record = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'record', opts, cb);
};


/**
 * ????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
BreakPointTool.prototype.clean = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'clean', opts, cb);
};

/**
 *  ??????????????????
 *
 * @param {Function} cb
 */
BreakPointTool.prototype.cleanAll = function (cb) {
    return this._aladdin.call(this.name, 'cleanAll', cb);
};

/**
 * Device???.
 *
 * @constructor
 * @param {object} adapter
 */
function Device(aladdin) {
  this._aladdin = aladdin;

  // let source = this._device = aladdin.device;

  // for (let key in source) {
  //   if (!this[key]) {
  //     this[key] = source[key];
  //   }
  // }
}

Object.defineProperty(Device.prototype, 'name', {
  value: 'bowdevice',
  writable: false
});

/**
 * ??????????????????(????????????)
 *
 * @param {Function} cb
 */
Device.prototype.getInfo = function(cb) {
  return this._aladdin.call(this.name, 'getInfo', cb);
};

/**
 * ??????????????????(?????????)
 *
 * @param {Function} cb
 */
Device.prototype.getInfoSync = function() {
  return this._aladdin.callSync(this.name, 'getInfoSync');
};

/**
 * Email????????????.
 *
 * @constructor
 * @param {object} aladdin
 */
function Email(aladdin) {
    this._aladdin = aladdin;
}

Object.defineProperty(Email.prototype, 'name', {
    value: 'bowemail',
    writable: false
});

/**
 * ?????????
 *
 * @param {Object} opts
 * @property {String} subject ????????????
 * @property {String} body ????????????
 * @property {String} address ????????????
 * @param {Function} cb
 */
Email.prototype.send = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'send', opts, cb);
};

/**
 * footer
 */

function Footer(aladdin) {
    this._aladdin = aladdin;
}

Object.defineProperty(Footer.prototype, 'name', {
    value: 'bowfooter',
    writable: false
});


/**
 * ??????/????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Footer.prototype.show = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'show', opts, cb);
};

/**
 * ??????????????????
 *
 * @param {Function} cb
 */
Footer.prototype.isHidden = function (cb) {
    return this._aladdin.call(this.name, 'isHidden', cb);
};

/**
 * Header???????????????.
 *
 * @constructor
 * @param {object} adapter
 */
function Header(aladdin) {
  var this$1 = this;

  this._aladdin = aladdin;
  var source = this._header = aladdin.header;

  for (var key in source) {
    if (!this$1[key]) {
      this$1[key] = source[key];
    }
  }
}

Object.defineProperty(Header.prototype, 'name', {
  value: 'header',
  writable: false
});


/**
 * ?????????????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Header.prototype.config = function(opts, cb) {
  if (typeof opts === 'object') { //??????native?????????????????????????????????
    opts.leftButtonCallback && (opts.leftButtonCallback.keep = true);
    opts.rightButtonCallback && (opts.rightButtonCallback.keep = true);
  }
  return this._header.config.apply(this._header, arguments);
};

function Http(aladdin) {
  var this$1 = this;

  this._aladdin = aladdin;

  var source = this._http = aladdin.http;

  for (var key in source) {
    if (!this$1[key]) {
      this$1[key] = source[key];
    }
  }
}

Object.defineProperty(Http.prototype, 'name', {
  value: 'http',
  writable: false
});

Http.prototype.ajax = function(url, settings) {
  var http = this;

  var emptyFn = function() {};

  var dataType = 'text';
  var complete = emptyFn;
  var error = emptyFn;
  var success = emptyFn;
  var type;
  var data;
  var beforeSend = emptyFn;

  var opts;

  var xhr;

  var responseData = '';

  settings = typeof url === 'object' ? url : settings;
  url = typeof url === 'object' ? settings.url : url;

  var $ = window.$;
  if ($ && $.ajaxSettings) {
    dataType = $.ajaxSettings.dataType || '';
    complete = $.ajaxSettings.complete || emptyFn;
    beforeSend = $.ajaxSettings.beforeSend || emptyFn;
  }

  // var cache = settings.cache === false ? false : true;
  beforeSend = typeof settings.beforeSend === 'function' ? settings.beforeSend : beforeSend;
  complete = typeof settings.complete === 'function' ? settings.complete : complete;
  error = typeof settings.error === 'function' ? settings.error : emptyFn;
  success = typeof settings.success === 'function' ? settings.success : emptyFn;
  dataType = typeof settings.dataType === 'string' ? settings.dataType : dataType;
  type = settings.type || 'GET';
  data = settings.data || '';

  opts = {
    url: url,
    method: type,
    timeout: settings.timeout,
    headers: settings.headers
  };

  if (type.toUpperCase() === 'GET') {
    opts.qs = data;
  } else {
    opts.body = data;
  }

  if (!!settings.traditional) {
    opts.traditional = true;
  }

  xhr = {
    readyState: 1,
    response: '',
    responseText: '',
    responseURL: url,
    status: '',
    timeout: '',
    statusText: ''
  };

  beforeSend(xhr);

  http.request(opts, function(er, res) {
    var status = '';

    if (er) {
      if (er.code == '10003') {
        status = 'timeout';
      } else {
        status = 'error';
      }

      error(xhr, status);
    } else {
      status = 'success';

      xhr.readyState = 4;
      xhr.responseText = res.body;
      xhr.response = res.body;
      xhr.status = res.status;
      xhr.statusText = 'OK';
      xhr.getResponseHeader = function(headerName) {
        return (res.headers || {})[headerName]
      };
      xhr.getAllResponseHeaders = function() {
        var result = [];
        var headers = res.headers || {};
        for (var name in headers) {
          if (headers.hasOwnProperty(name)) {
            result.push(name + ': ' + headers[name]);
          }
        }
        return result.join('\n');
      };

      if (dataType.toLowerCase() === 'json') {
        try {
          responseData = JSON.parse(res.body);
          success(responseData, status, xhr);
        } catch (e) {
          status = 'parsererror';
          error(xhr, status);
        }
      } else {
        responseData = xhr.responseText;
        success(responseData, status, xhr);
      }
    }
    complete(xhr, status);
  });
  return xhr;
};



/**
 * http
 *
 *
 * @param {Object} opts
 * @property {String} url ??????URL
 * @property {String} method ????????????,default:post
 * @property {Object} qs ??????????????????
 * @property {Object} body ????????????
 * @property {String} timeout ????????????,default:60000ms
 * @property {Object} headers ??????????????????
 * @property {String} retry ???????????? ????????????,default:0
 * @param {Function} cb
 */
Http.prototype.request = function(opts, cb) {
  opts = opts || {};
  opts.method = opts.method || 'post';
  opts.timeout = opts.timeout || 60000;

  var _http = this._http;
  var retry = opts.retry || 0;

  (function doRequest() {
    _http.request(opts, function(error, res) {
      if (error && retry > 0) {
        retry--;
        doRequest();
      } else {
        cb(error, res);
      }
    });
  })();
  return this;
};

/**
 * Navigator????????????.
 *
 * @constructor
 * @param {object} adapter
 */
function Navigator(aladdin) {
  var this$1 = this;

  this._aladdin = aladdin;

  var source = this._navigator = aladdin.navigator;

  for (var key in source) {
    if (!this$1[key]) {
      this$1[key] = source[key];
    }
  }
}

Object.defineProperty(Navigator.prototype, 'name', {
  value: 'navigator',
  writable: false
});


/**
 *
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Navigator.prototype.forward = function(opts, cb) {

  if (opts && opts.tpl && opts.tpl === 'webview') {
    opts.currentUrl = window.location.href;
  }

  return this._navigator.forward.apply(this._navigator, arguments);
};

function Phone(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Phone.prototype, 'name', {
  value: 'bowphone',
  writable: false
});

/**
 * ??????????????????????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Phone.prototype.call = function(opts, cb) {
  return this._aladdin.call(this.name, 'call', opts, cb);
};

/**
 * ????????????????????????????????????????????????
 *
 * @param {Function} cb
 */
Phone.prototype.selectContact = function(cb) {
  return this._aladdin.call(this.name, 'selectContact', cb);
};

/**
 * ???????????????
 *
 * @param {Function} cb
 */
Phone.prototype.getMobileNo = function(cb) {
  return this._aladdin.call(this.name, 'getMobileNo', cb);
};

/**
 * ?????????
 */

function Qrcode(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Qrcode.prototype, 'name', {
  value: 'bowqrcode',
  writable: false
});

/**
 * ????????????????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 *
 * cb (error)
 * {Object} error
 */
Qrcode.prototype.scan = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'scan', opts, cb);
};

/**
 * ???????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Qrcode.prototype.generate = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'generate', opts, cb);
};

/**
 * ?????????????????????????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 *
 * cb (error)
 * {Object} error
 */
Qrcode.prototype.save = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'save', opts, cb);
};

/**
 * ?????????????????????
 *
 * @param {Object} opts
 *    isAuto:Boolean //false ??????????????????????????????,ture ??????screenLightness
 *    screenLightness:Number // ??????????????? 0???255
 * @param {Function} cb
 *
 * cb (error)
 * {Object} error
 */
Qrcode.prototype.lightness = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'lightness', opts, cb);
};

function SafeKeyBoard(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(SafeKeyBoard.prototype, 'name', {
  value: 'bowsafeKeyBoard',
  writable: false
});

/**
 * SafeKeyBoard ??????????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
SafeKeyBoard.prototype.arouse = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'arouse', opts, cb);
};

/**
 * SafeKeyBoard ??????????????????
 *
 * @param {Function} cb
 */
SafeKeyBoard.prototype.hide = function(cb) {
  return this._aladdin.call(this.name, 'hide', cb);
};

/**
 * ????????????
 */

function Share(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Share.prototype, 'name', {
  value: 'bowshare',
  writable: false
});

/**
 * ????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Share.prototype.msg = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'msg', opts, cb);
};

/**
 * ???????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Share.prototype.qrcode = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'qrcode', opts, cb);
};

Share.prototype.getMGMInfo = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'getMGMInfo', opts, cb);
};


Share.prototype.getChannels = function(cb) {

  return this._aladdin.call(this.name, 'getChannels', cb);
};

/**
 * ??????
 * native??????????????????,??????????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Share.prototype.send = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'send', opts, cb);
};

/**
 * SharedMemory??????????????????????????????.
 *
 * @constructor
 * @param {object} adapter
 */
function SharedMemory(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(SharedMemory.prototype, 'name', {
  value: 'bowsharedMemory',
  writable: false
});

var __stringfy = function(key) {
  /** ?????????????????????key */
  if (typeof key !== 'string') {
    if (toString.call(key) === '[object Null]' || typeof key === 'undefined') {
      key += '';
    } else {
      key = key.toString();
    }
  }
  return key;
};

/**
 * ?????????
 * @param key
 * @param value
 */
SharedMemory.prototype.setItem = function(key, value) {
  key = __stringfy(key);
  value = JSON.stringify(value);

  return this._aladdin.callSync(this.name, 'setItem', {
    key: key,
    value: value
  });
};

/**
 * ?????????
 * @param key
 * @returns {*}
 */
SharedMemory.prototype.getItem = function(key) {
  key = __stringfy(key);
  var value = this._aladdin.callSync(this.name, 'getItem', key);

  try {
    value = JSON.parse(value);
  } catch (e) {
    //ignore this
  }

  return value;
};

/**
 * ??????key???????????????????????????
 * @param key {String} ??????????????????????????????
 * @returns
 */
SharedMemory.prototype.removeItem = function(key) {
  key = __stringfy(key);
  return this._aladdin.callSync(this.name, 'removeItem', key);
};

/**
 * ??????????????????????????????
 */
SharedMemory.prototype.clear = function() {
  return this._aladdin.callSync(this.name, 'clear');
};

/**
 * Sms??????????????????.
 *
 * @constructor
 * @param {object} adapter
 */
function Sms(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Sms.prototype, 'name', {
  value: 'bowsms',
  writable: false
});

/**
 * ????????????(OPT??????????????????)(?????????)
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Sms.prototype.message = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'message', opts, cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * Sms.prototype.message?????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Sms.prototype.autoFetchOtpMsg = function(opts, cb) {
  return this.message(opts, cb);
};

/**
 * ????????????
 *
 * @param {Object} opts
 * @property {String} mobileNo ????????????
 * @property {String} body ????????????
 * @param {Function} cb
 */
Sms.prototype.send = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'send', opts, cb);
};

/**
 * ????????????
 */
function Voice(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Voice.prototype, 'name', {
  value: 'bowvoice',
  writable: false
});

/**
 * ????????????????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Voice.prototype.transfer = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'transfer', opts, cb);
};

/**
 * ???????????? ????????????
 *
 * @param {Function} cb
 */
Voice.prototype.getText = function(cb) {
  return this._aladdin.call(this.name, 'getText', cb);
};

/**
 * AccountMigration??????????????????.
 *
 * @constructor
 * @param {object} adapter
 */
function AccountMigration(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(AccountMigration.prototype, 'name', {
  value: 'bowaccountMigration',
  writable: false
});

/**
 * ????????????????????????app??????,????????????????????????????????????????????????
 *
 * @param {Function} cb
 */
AccountMigration.prototype.queryUserInfo = function(cb) {
  return this._aladdin.call(this.name, 'queryUserInfo', cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * ????????????
 *
 * @param {Object} opts
 * @prototype {String} type
 * @param {Function} cb
 */
AccountMigration.prototype.removeQueryUserInfo = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'removeQueryUserInfo', opts, cb);
};

/**
* ????????????.
*
* @constructor
* @param {object} adapter
*/
function Announcement(aladdin) {
    this._aladdin = aladdin;
}

Object.defineProperty(Announcement.prototype, 'name', {
    value: 'bowannouncement',
    writable: false
});

/**
 * ??????????????????
 *
 * @param {Function} cb
 */
Announcement.prototype.getNoticeData=function(cb){
  return this._aladdin.call(this.name, 'getNoticeData', cb);
};


/**
* ????????????????????????
*
* @param {Object} opts
* @param {Function} cb
*/
Announcement.prototype.setNoticeRead = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'setNoticeRead', opts, cb);
};

function AppVersion(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(AppVersion.prototype, 'name', {
  value: 'bowappversion',
  writable: false
});

/**
 * ?????????????????????????????????
 *
 * @param {Object} opts ????????????queryversion???????????????
 * opts = {
 *     appDownloadUrl: "";
       clientTips: "\U4e0d\U63d0\U793a\U5347\U7ea7";
       maxAppVersion: "";
       updateStatus: 2;
 * }
 * @param {Function} cb
 */
AppVersion.prototype.showUpdateDialog = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name, 'showUpdateDialog', opts, cb);
};

/**
 * ??????
 */

function Auth(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Auth.prototype, 'name', {
  value: 'bowauth',
  writable: false
});


/**
 * ???H5 ????????????????????????Native
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Auth.prototype.synLogin = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'synLogin', opts, cb);
};

/**
 * ???H5????????????????????????Native
 *
 * @param {Function} cb
 */
Auth.prototype.synLogout = function(cb) {
  return this._aladdin.call(this.name, 'synLogout', cb);
};

/**
 * ??????????????????
 *
 * @param {Function} cb
 */
Auth.prototype.fetchLogin = function(cb) {
  return this._aladdin.call(this.name, 'fetchLogin', cb);
};

/**
 * ????????????
 */
Auth.prototype.launchLogin = function(opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  } else {
    opts = opts || {};
  }
  return this._aladdin.call(this.name, 'launchLogin', opts, cb);
};

/**
 * ????????????
 */
Auth.prototype.cancelLogin = function(cb) {
  return this._aladdin.call(this.name, 'cancelLogin', cb);
};

/**
 *
 * ???synLogout????????????:safeExit???Native??????????????????.
 *
 * ?????????????????????safeExit??????????????????????????????????????????????????????synLogout????????????????????????
 *
 * @param {Function} cb
 */
Auth.prototype.safeExit = function (cb) {
    return this._aladdin.call(this.name, 'safeExit', cb);
};

/**
 * ???????????????
 */

function CreditAuthorization(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(CreditAuthorization.prototype, 'name', {
  value: 'bowcreditAuthorization',
  writable: false
});

/**
 * ???????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
CreditAuthorization.prototype.scan = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'scan', opts, cb);
};

/**
 * ??????
 */

function FingerLogin(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(FingerLogin.prototype, 'name', {
  value: 'bowfingerLogin',
  writable: false
});


/**
 * touchId???????????????????????????
 *
 * @param {Function} cb
 */
FingerLogin.prototype.checkTouchIdState = function(cb) {
  return this._aladdin.call(this.name, 'checkTouchIdState', cb);
};

/**
 * ??????????????????????????????
 *
 * @param {Function} cb
 */
FingerLogin.prototype.checkFingerprintsSwitch = function(cb) {
  return this._aladdin.call(this.name, 'checkFingerprintsSwitch', cb);
};

/**
 * ????????????????????????
 *
 *  @param {Object}  {flag: ???open???/???close???} ??????/??????
 * @param {Function} cb
 */
FingerLogin.prototype.setFingerprintsSwitch = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name, 'setFingerprintsSwitch', opts, cb);
};

/**
 * ??????????????????
 *
 * @param {Function} cb
 */
FingerLogin.prototype.fingerprintsLogin = function(opts, cb) {
  return this._aladdin.call(this.name, 'fingerprintsLogin', opts, cb);
};

function Gesture(aladdin) {
 this._aladdin = aladdin;
}

Object.defineProperty(Gesture.prototype, 'name', {
  value: 'bowgesture',
  writable: false
});


/**
 * ??????????????????
 *
 * @param {Function} cb
 */
Gesture.prototype.proceedSetup = function(opts, cb) {
  return this._aladdin.call(this.name, 'proceedSetup', opts, cb);
};

/**
 * ????????????Token
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Gesture.prototype.syncAuthToken = function(opts, cb) {
  return this._aladdin.call(this.name, 'syncAuthToken', opts, cb);
};

/**
 * ??????????????????
 *
 * @param {Function} cb
 */
Gesture.prototype.checkSwitchState = function(cb) {
  return this._aladdin.call(this.name, 'checkSwitchState', cb);
};

/**
 * ??????????????????????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Gesture.prototype.updateSwitchState = function(opts, cb) {
  return this._aladdin.call(this.name, 'updateSwitchState', opts, cb);
};

/**
 * ????????????????????????
 *
 * @param {Function} cb
 */
Gesture.prototype.openAccessVerify = function(cb) {
  return this._aladdin.call(this.name, 'openAccessVerify', cb);
};

/**
 * ??????????????????
 *
 * @param {Function} cb
 */
Gesture.prototype.clearProfileSettings = function(cb) {
  return this._aladdin.call(this.name, 'clearProfileSettings', cb);
};

/**
 * ?????????????????????????????????
 *
 * @param {Function} cb
 */
Gesture.prototype.isAlreadySetup = function(cb) {
  return this._aladdin.call(this.name, 'isAlreadySetup', cb);
};

/**
 * ??????????????????????????????
 *
 * @param {Function} cb
 */
Gesture.prototype.checkPathVisible = function(cb) {
  return this._aladdin.call(this.name, 'checkPathVisible', cb);
};

/**
 * ????????????????????????????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Gesture.prototype.updatePathVisible = function(opts, cb) {
  return this._aladdin.call(this.name, 'updatePathVisible', opts, cb);
};


/**
 * ???????????????????????????????????????native
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Gesture.prototype.synPasswordSetup = function(opts, cb) {
  return this._aladdin.call(this.name, 'synPasswordSetup', opts, cb);
};

/**
 *  ??????????????????
 */
Gesture.prototype.modifyPassword = function(cb) {
  return this._aladdin.call(this.name, 'modifyPassword', cb);
};

/**
 * Guidance??????????????????.
 *
 * @constructor
 * @param {object} aladdin
 */
function Guidance(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Guidance.prototype, 'name', {
  value: 'bowguidance',
  writable: false
});

/**
 * ??????--?????????????????????????????????--??????????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Guidance.prototype.showGuideView = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'showGuideView', opts, cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

// /**
// * ????????????--??????????????????
// *
// * @param {Function} cb
// */
// Guidance.prototype.financialProductsGuide = function (cb) {
//     return this._aladdin.call(this.name, 'financialProductsGuide', cb);
// };

/**
 * ???app???????????????
 */
Guidance.prototype.appGuideView = function() {
  return this._aladdin.call(this.name, 'appGuideView');
};

/**
 * ?????????
 */

function Marathon(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Marathon.prototype, 'name', {
  value: 'bowmarathon',
  writable: false
});

Marathon.prototype.openMarathon = function(cb) {
  return this._aladdin.call(this.name, 'openMarathon', cb);
};

/**
* Notification??????????????????.
*
* @constructor
* @param {object} adapter
*/
function Notification(aladdin) {
   this._aladdin = aladdin;
}

Object.defineProperty(Notification.prototype, 'name', {
    value: 'bownotification',
    writable: false
});

/**
 * ????????????????????????????????????
 *
 * @param {Function} cb
 */
Notification.prototype.getSysNotificationStatus = function (cb) {
    return this._aladdin.call(this.name, 'getSysNotificationStatus', cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * ????????????????????????????????????
 *
 * @param {Function} cb
 */
Notification.prototype.toSysSettingPage = function (cb) {
    return this._aladdin.call(this.name, 'toSysSettingPage', cb);
};
/**
 * @callback cb (error)
 * @param {Object} error
 */

/**
* ????????????????????????????????????????????????
*
* @param {Object} opts
* @param {Function} cb
*/
Notification.prototype.saveMessage = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'saveMessage', opts, cb);
};
/**
* @callback cb (error, data)
* @param {Object} error
* @param {Object} data
*/

/**
* ????????????????????????????????????????????????
*
* @param {Object} opts
* @param {Function} cb
*/
Notification.prototype.getMessage = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'getMessage', opts, cb);
};
/**
* @callback cb (error, data)
* @param {Object} error
* @param {Object} data
*/

/**
* ?????????????????????????????????????????????
*
* @param {Object} opts
* @param {Function} cb
*/
Notification.prototype.checkSameUser = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'checkSameUser', opts, cb);
};
/**
* @callback cb (error, data)
* @param {Object} error
* @param {Object} data
*/

/**
* ????????????????????????????????????????????? ????????????
*
* @param {Object} opts
* @param {Function} cb
*/
Notification.prototype.markMessageRead = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'markMessageRead', opts, cb);
};

/**
 * ??????AppStore(???ios??????)  ?????????????????????application?????????
 * @param {Object} opts   ??????{url: "http://xxxx.com"}
 * @param {Function} cb
 */
Notification.prototype.toAppStore=function(opts,cb){
    return this._aladdin.call(this.name, 'toAppStore',opts, cb);
};

/**
 * ??????native???????????????
 */
Notification.prototype.setNewMsgNumber=function(number,cb){
    return this._aladdin.call(this.name, 'setNewMsgNumber',number, cb);
};

/**
* ??????????????????????????????
*
* @param {Object} opts  {startTime: 1487851343095}  startTime:????????????
* @param {Function} cb
*/
Notification.prototype.setPublicData = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'setPublicData', opts, cb);
};
/**
* ??????????????????????????????
*
* @param {Object} opts
* @param {Function} cb
*/
Notification.prototype.getPublicData = function (cb) {
    return this._aladdin.call(this.name, 'getPublicData', cb);
};

/**
* ??????native?????????????????????????????????(????????????tab???????????????????????????)
* @param {Function} cb
*/
Notification.prototype.checkNewNumber = function (cb) {
    return this._aladdin.call(this.name, 'checkNewNumber', cb);
};

/**
 * Offer???????????????.
 *
 * @constructor
 * @param {object} adapter
 */
function Offer(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Offer.prototype, 'name', {
  value: 'bowoffer',
  writable: false
});

/**
 * ??????????????????
 *
 * @param {Function} cb
 */
Offer.prototype.hasPoint = function(cb) {
  this._aladdin.call(this.name, 'hasPoint', cb);

  return this;
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * ???????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Offer.prototype.clearPoint = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'clearPoint', opts, cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * ??????????????????offer???
 *
 * @param {Function} cb
 */
Offer.prototype.queryRightCount = function(cb) {
  return this._aladdin.call(this.name, 'queryRightCount', cb);
};

/**
* ????????????(???Android)
*
* @constructor
* @param {object} adapter
*/
function ScreenShot(aladdin) {
    this._aladdin = aladdin;
}

Object.defineProperty(ScreenShot.prototype, 'name', {
    value: 'bowscreenShot',
    writable: false
});

/**
* ????????????????????????
*
* @param {Function} cb(err,data)
*   data: {status:true}
*/
ScreenShot.prototype.getAllowScreenShot = function (cb) {
    this._aladdin.call(this.name, 'getAllowScreenShot', cb);

    return this;
};
/**
* @callback cb (error, data)
* @param {Object} error
* @param {Object} data
*/

/**
* ????????????????????????
*
* @param {Object} opts
*     {status:true}
* @param {Function} cb
*/
ScreenShot.prototype.setAllowScreenShot = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'setAllowScreenShot', opts, cb);
};

/**
 * ??????
 */

function TalkingData(aladdin) {
   this._aladdin = aladdin;
}

Object.defineProperty(TalkingData.prototype, 'name', {
    value: 'bowtalkingData',
    writable: false
});

/**
 * TalkingData   trackEvent
 *
 * @param {Object} opts
 * @param {Function} cb
 */
TalkingData.prototype.trackEvent= function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'trackEvent', opts, cb);
};

/**
 * TalkingData   collectUser
 *
 * @param {Object} opts
 * @param {Function} cb
 */
TalkingData.prototype.collectUser= function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'collectUser', opts, cb);
};

/**
 * TalkingData   clearUser
 *
 * @param {Object} opts
 * @param {Function} cb
 */
TalkingData.prototype.clearUser= function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'clearUser', opts, cb);
};

/**
 * TalkingData   onPageStart
 *
 * @param {Object} opts
 * @param {Function} cb
 */
TalkingData.prototype.onPageStart= function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'onPageStart', opts, cb);
};

/**
 * TalkingData   onPageEnd
 *
 * @param {Object} opts
 * @param {Function} cb
 */
TalkingData.prototype.onPageEnd= function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'onPageEnd', opts, cb);
};

/**
 * Tsm????????????TSM-??????SE??????????????????.
 *
 * @constructor
 * @param {object} adapter
 */
function Tsm(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Tsm.prototype, 'name', {
  value: 'bowtsm',
  writable: false
});

/**
 * UKey ???????????????????????????
 *
 * @param {Function} cb
 */
Tsm.prototype.ukeyReadCardSerialNumber = function(cb) {
  return this._aladdin.call(this.name, 'ukeyReadCardSerialNumber', cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * UKey ??????????????????
 *
 * @param {Function} cb
 */
Tsm.prototype.ukeyGetCardInfo = function(cb) {
  return this._aladdin.call(this.name, 'ukeyGetCardInfo', cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * UKey ????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Tsm.prototype.ukeyDownloadCertificate = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'ukeyDownloadCertificate', opts, cb);
};
/**
 * @callback cb (error)
 * @param {Object} error
 */

/**
 * UKey ????????????
 *
 * @param {Function} cb
 */
Tsm.prototype.ukeyStorageCertificate = function(cb) {
  return this._aladdin.call(this.name, 'ukeyStorageCertificate', cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * UKey ????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Tsm.prototype.ukeyGetCertificate = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'ukeyGetCertificate', opts, cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * UKey ???????????????????????????p10????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Tsm.prototype.ukeyGetCertReqData = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'ukeyGetCertReqData', opts, cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * UKey ??????PIN
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Tsm.prototype.ukeyVerifyPIN = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'ukeyVerifyPIN', opts, cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * UKey ??????PIN
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Tsm.prototype.ukeyUpdatePIN = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'ukeyUpdatePIN', opts, cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * UKey ????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Tsm.prototype.ukeySignData = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'ukeySignData', opts, cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * UKey ??????RSA??????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Tsm.prototype.ukeyGenRSA = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'ukeyGenRSA', opts, cb);
};

/**
 * ????????????
 *
 * @constructor
 * @param {object} aladdin
 */
function FaceRec(aladdin) {
    this._aladdin = aladdin;
}

Object.defineProperty(FaceRec.prototype, 'name', {
    value: 'faceRec',
    writable: false
});
/** ?????????????????? ??????????????????????????????????????????debug?????????????????????????????????release??????
 *
 * @param opts [appId]          string    BISP????????????,??????????????????appkey?????????????????? (???????????????native?????????h5????????????)
 *             [appKey]         string    BISP????????????,??????????????????appkey?????????????????? (???????????????native?????????h5????????????)
 *             [systemId]       string    BISP????????????,??????????????????appkey?????????????????? (???????????????native?????????h5????????????)
 *             [actionNum]      string    0:????????? 1:?????? 2:????????????
 *             [faceRecVersion] string    0:????????? 1:?????????,???????????????????????????,?????????1????????????
 * @param {Function} cb   function(error,responseObj){}; responseObj ?????????????????????,???imageId???token
 */
FaceRec.prototype.showFaceRec = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'showFaceRec', opts, cb);
};

function OcrBankCardAuthorization(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(OcrBankCardAuthorization.prototype, 'name', {
  value: 'bowocrBankCardAuthorization',
  writable: false
});

/**
 * ???????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
OcrBankCardAuthorization.prototype.scan = function(opts, cb) {
  return this._aladdin.call(this.name, 'scan', opts, cb);
};

function Location$1(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Location$1.prototype, 'name', {
  value: 'bowlocation',
  writable: false
});

/**
 * ??????????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Location$1.prototype.startLocation = function(opts, cb) {
  return this._aladdin.call(this.name, 'startLocation', opts, cb);
};

function Applepay(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Location.prototype, 'name', {
  value: 'bowapplepay',
  writable: false
});

/**
 * ????????????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Applepay.prototype.openWallet = function(opts, cb) {
  return this._aladdin.call(this.name, 'openWallet', opts, cb);
};

/**
 * ?????????.
 *
 * @constructor
 * @param {object} adapter
 */
function Softcertificate(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Softcertificate.prototype, 'name', {
  value: 'softCertificate',
  writable: false
});

/**
 *  ???????????????
 * @param {Object} opts
 * @param {Function} cb
 */
Softcertificate.prototype.downCer = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name,'downCer', opts, cb);
};

/**
 * ???????????????
 * @param {Function} cb
 */
Softcertificate.prototype.queryCer = function(cb) {
  return this._aladdin.call(this.name,'queryCer', cb);
};

/**
 * ??????p10
 * @param {Function} cb
 */
Softcertificate.prototype.createP10 = function(cb) {
  return this._aladdin.call(this.name,'createP10', cb);
};

/**
 * ?????????????????????????????????
 * @param {Function} cb
 */
Softcertificate.prototype.checkCertExist = function(cb) {
  return this._aladdin.call(this.name,'checkCertExist', cb);
};

/**
 *  ??????
 * @param {Object} opts
 * @param {Function} cb
 */
Softcertificate.prototype.signData = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name,'signData', opts, cb);
};

/**
 *  ????????????
 * @param {Object} opts
 * @param {Function} cb
 */
Softcertificate.prototype.importCert = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name,'importCert', opts, cb);
};

/**
 * ??????????????????
 * @param {Function} cb
 */
Softcertificate.prototype.deleteCert = function(cb) {
  return this._aladdin.call(this.name,'deleteCert', cb);
};

/**
 *  ????????????????????????
 * @param {Object} opts
 * @param {Function} cb
 */
Softcertificate.prototype.getCertInfo = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name,'getCertInfo', opts, cb);
};

/**
 * ?????????.
 *
 * @constructor
 * @param {object} adapter
 */
function Anydoor(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Anydoor.prototype, 'name', {
  value: 'bowAnyDoor',
  writable: false
});

/**
 *  ???????????????
 * @param {Object} opts
 * @param {Function} cb
 */
Anydoor.prototype.openPlugin = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name,'openPlugin', opts, cb);
};

/**
 * CityPicker?????????????????????.
 *
 * @constructor
 * @param {object} adapter
 */
function CityPicker(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(CityPicker.prototype, 'name', {
  value: 'bowcityPicker',
  writable: false
});

/**
 *
 *
 * @param {Object} opts
 * @param {Function} cb
 */
CityPicker.prototype.show = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'show', opts, cb);
};

/**
 * DatePick?????????????????????.
 *
 * @constructor
 * @param {object} adapter
 */
function DatePicker(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(DatePicker.prototype, 'name', {
  value: 'bowdatePicker',
  writable: false
});

/**
 * ??????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
DatePicker.prototype.date = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'date', opts, cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error
 * @param {Object} data
 */

/**
 * ??????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
DatePicker.prototype.period = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'period', opts, cb);
};

/**
 * ModuleCityChoose???????????????.
 *
 * @constructor
 * @param {object} adapter
 */
function ModuleCityChoose(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(ModuleCityChoose.prototype, 'name', {
  value: 'bowmoduleCityChoose',
  writable: false
});


/**
 * ????????????
 *
 * @param {Object} opts
 *   @param {String} province
 *   @param {String} city
 *   @param {String} region
 * @param {Function} cb
 */
ModuleCityChoose.prototype.show = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name, 'show', opts, cb);
};

/**
 * ModuleTabBar???????????????.
 *
 * @constructor
 * @param {object} adapter
 */
function ModuleTabBar(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(ModuleTabBar.prototype, 'name', {
  value: 'bowmoduleTabBar',
  writable: false
});


/**
* ??????tab
*
* @param {Object} opts
???   @param {String} url
* @param {Function} cb
*/
ModuleTabBar.prototype.select = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name, 'select', opts, cb);
};

/**
 * ????????????
 *
 * @constructor
 * @param {object} adapter
 */
function RefreshControl(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(RefreshControl.prototype, 'name', {
  value: 'bowrefreshControl',
  writable: false
});

/**
 * ??????????????????
 *
 * @param {Object} opts ??????
 *                 - {Function} onRefresh ????????????????????????
 *                 - {String} title ??????
 * @param {Function} cb
 * @returns this
 */
RefreshControl.prototype.create = function(opts, cb) {
  return this._aladdin.call(this.name, 'create', opts, cb);
};

/**
 * ????????????????????????
 *
 * @param {Function} cb
 * @returns this
 */
RefreshControl.prototype.stop = function(cb) {
  return this._aladdin.call(this.name, 'stop', cb);
};

/**
 * Spinner???????????????.
 *
 * @constructor
 * @param {object} adapter
 */
function Spinner(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Spinner.prototype, 'name', {
  value: 'bowspinner',
  writable: false
});

/**
 * ??????
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Spinner.prototype.select = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'select', opts, cb);
};

aladdin_extension.use(Crypto,"crypto");
aladdin_extension.use(AlipBorad,"alipborad");
aladdin_extension.use(Application,"application");
aladdin_extension.use(Audio,"audio");
aladdin_extension.use(BreakPointTool,"breakPointTool");
aladdin_extension.use(Device,"device");
aladdin_extension.use(Email,"email");
aladdin_extension.use(Footer,"footer");
aladdin_extension.use(Header,"header");
aladdin_extension.use(Http,"http");
aladdin_extension.use(Navigator,"navigator");
aladdin_extension.use(Phone,"phone");
aladdin_extension.use(Qrcode,"qrcode");
aladdin_extension.use(SafeKeyBoard,"safeKeyBoard");
aladdin_extension.use(Share,"share");
aladdin_extension.use(SharedMemory,"sharedMemory");
aladdin_extension.use(Sms,"sms");
aladdin_extension.use(Voice,"voice");
aladdin_extension.use(AccountMigration,"accountMigration");
aladdin_extension.use(Announcement,"announcement");
aladdin_extension.use(AppVersion,"appVersion");
aladdin_extension.use(Auth,"auth");
aladdin_extension.use(CreditAuthorization,"creditAuthorization");
aladdin_extension.use(FingerLogin,"fingerLogin");
aladdin_extension.use(Gesture,"gesture");
aladdin_extension.use(Guidance,"guidance");
aladdin_extension.use(Marathon,"marathon");
aladdin_extension.use(Notification,"notification");
aladdin_extension.use(Offer,"offer");
aladdin_extension.use(ScreenShot,"screenShot");
aladdin_extension.use(TalkingData,"talkingData");
aladdin_extension.use(Tsm,"tsm");
aladdin_extension.use(FaceRec,"faceRec");
aladdin_extension.use(OcrBankCardAuthorization,"ocrBankCardAuthorization");
aladdin_extension.use(Location$1,"location");
aladdin_extension.use(Applepay,"applepay");
aladdin_extension.use(Softcertificate,"softCertificate");
aladdin_extension.use(Anydoor,"anyDoor");
aladdin_extension.use(CityPicker,"cityPicker");
aladdin_extension.use(DatePicker,"datePicker");
aladdin_extension.use(ModuleCityChoose,"moduleCityChoose");
aladdin_extension.use(ModuleTabBar,"moduleTabBar");
aladdin_extension.use(RefreshControl,"refreshControl");
aladdin_extension.use(Spinner,"spinner");

return aladdin_extension;

})));
