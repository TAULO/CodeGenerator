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
 * 根据指定的加密类型，加密源字符，返回加密后的字符（RSA | DES 所需的秘钥，全部由Native维护,H5不介入）
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
 * 根据指定的解密类型，解密源字符，返回加密前的字符(注意：不支持MD5方式解密，RSA | DES 所需的秘钥，全部由Native维护,H5不介入)
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
 * 复制文本到剪切板
 *
 * @param {Object} opts
 * @property {String} copyStr 复制字段名称
 * @param {Function} cb
 */
AlipBorad.prototype.copy = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'copy', opts, cb);
};

/**
 * 清除剪切板
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
 * 获取公共信息
 *
 * @param {Function} cb
 */
Application.prototype.getEnvironment = function(cb) {
  return this._aladdin.call(this.name, 'getEnvironment', cb);
};


/**
 * 获取公共信息
 *
 * @param {Function} cb
 */
Application.prototype.getSimpleEnvironmentSync = function() {
  return this._aladdin.callSync(this.name, 'getSimpleEnvironmentSync');
};

/**
 * @callback cb (error, data)
 * @param {Object} error 错误对象 （注： 错误码区间：301XX）
 * @param {Object} data 响应对象
 * @property {Object} appConfig config文件,返回一个字典包含app的各个配置项（XML文件），链接为：https://bankupload.pingan.com.cn/smartphone/config/PAEBank_2/iphone_config2_0.xml
 * @property {String} versionCode 版本信息code
 * @property {String} versionName 版本信息name
 * @property {String} interface 当前环境
 * @property {String} context F5标示（ibp/smp)
 * @property {String} domain 环境域名
 */


/**
 * 获取系统时间
 *
 * @param {Function} cb
 */
Application.prototype.getServerTime = function(cb) {
  return this._aladdin.call(this.name, 'getServerTime', cb);
};
/**
 * @callback cb (error, data)
 * @param {Object} error 错误对象 （注： 错误码区间：301XX）
 * @param {Object} data 响应对象
 */

/**
 * 退出应用程序
 *
 * @param {Function} cb
 */
Application.prototype.exit = function(cb) {
  return this._aladdin.call(this.name, 'exit', cb);
};

/**
 * 给应用评分
 *
 * @param {Function} cb
 */
Application.prototype.grade = function(cb) {
  return this._aladdin.call(this.name, 'grade', cb);
};

/**
 * 应用升级
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Application.prototype.upgrade = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'upgrade', opts, cb);
};

/**
 * 客户中心
 *
 * @param {Function} cb
 */
Application.prototype.service = function(cb) {
  return this._aladdin.call(this.name, 'service', cb);
};

/**
 * 安全中心-预留验证信息
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Application.prototype.modifyHint = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'modifyHint', opts, cb);
};

/**
 * 跳转到制定router路径界面
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Application.prototype.route = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'route', opts, cb);
};

/**
 * 更新首页更多标签页上的小红点
 *
 * @param {Function} cb
 */
Application.prototype.refreshMoreGuideMark = function(cb) {
  return this._aladdin.call(this.name, 'refreshMoreGuideMark', cb);
};

/**
 * 获取版本签名
 */
Application.prototype.getVerisonSign = function(cb) {
  return this._aladdin.call(this.name, 'getVersionSign', cb);
};

/**
 * 获取模块地址
 *
 * @param {String} module 模块名，如果不传则默认当前环境的模块地址
 *
 * @param {Function} cb(err,data)
 *   data:{remote:'',local:''}
 */
Application.prototype.getModuleUrl = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name, 'getModuleUrl', opts, cb);
};

/**
 * 获取设备指纹
 */
Application.prototype.getDevFinger = function(cb) {
  return this._aladdin.call(this.name, 'getDevFinger', cb);
};


/**
 * 获取appid
 */
Application.prototype.getAppIdSync = function() {
  return this._aladdin.callSync(this.name, 'getAppIdSync');
};

/**
* 显示透明webview
* @param {Object} opts 参数
*                     opts = { "url": "/messageCenter/pages/redpackOpacityWin.html" }
* @param {Function} cb 回调方法
*/
Application.prototype.showOpacityWindow = function(opts,cb) {
  opts = opts || {};
  return this._aladdin.call(this.name, 'showOpacityWindow', opts, cb);
};
/**
* 隐藏透明webview
* @param {Function} cb 回调方法
*/
Application.prototype.hideOpacityWindow = function(cb) {
  return this._aladdin.call(this.name, 'hideOpacityWindow', cb);
};
/**
* 检查app是否存在和打开或下载app
* @param {Function} otps 回调方法
* 应有参数:
    "schemes":"IOS的Schemes";
    "from":"资讯";
    “downloadUrl_iOS":"此app的iOS下载地址”;
    "openAppUrl":"用scheme方式打开此app指定页面需要的参数";
* @param {Function} cb 回调方法
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
 * 音频播放开始
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Audio.prototype.play = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'play', opts, cb);
};

/**
 * 音频播放停止
 *
 * @param {Function} cb
 */
Audio.prototype.stop = function(cb) {
  return this._aladdin.call(this.name, 'stop', cb);
};

/**
 * 音频播放暂停
 *
 * @param {Function} cb
 */
Audio.prototype.pause = function(cb) {
  return this._aladdin.call(this.name, 'pause', cb);
};

/**
 * BreakPoint类，断点.
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
 * 断点埋点
 *
 * @param {Object} opts
 * @param {Function} cb
 */
BreakPointTool.prototype.record = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'record', opts, cb);
};


/**
 * 清除断点
 *
 * @param {Object} opts
 * @param {Function} cb
 */
BreakPointTool.prototype.clean = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'clean', opts, cb);
};

/**
 *  清除所有断点
 *
 * @param {Function} cb
 */
BreakPointTool.prototype.cleanAll = function (cb) {
    return this._aladdin.call(this.name, 'cleanAll', cb);
};

/**
 * Device类.
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
 * 获取设备信息(不同步的)
 *
 * @param {Function} cb
 */
Device.prototype.getInfo = function(cb) {
  return this._aladdin.call(this.name, 'getInfo', cb);
};

/**
 * 获取设备信息(同步的)
 *
 * @param {Function} cb
 */
Device.prototype.getInfoSync = function() {
  return this._aladdin.callSync(this.name, 'getInfoSync');
};

/**
 * Email类，邮件.
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
 * 发邮件
 *
 * @param {Object} opts
 * @property {String} subject 邮件标题
 * @property {String} body 邮件内容
 * @property {String} address 邮件地址
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
 * 显示/隐藏底部
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Footer.prototype.show = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'show', opts, cb);
};

/**
 * 是否显示底部
 *
 * @param {Function} cb
 */
Footer.prototype.isHidden = function (cb) {
    return this._aladdin.call(this.name, 'isHidden', cb);
};

/**
 * Header类，导航头.
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
 * 设置导航头样式
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Header.prototype.config = function(opts, cb) {
  if (typeof opts === 'object') { //处理native多次触发回调被释放问题
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
 * @property {String} url 请求URL
 * @property {String} method 请求类型,default:post
 * @property {Object} qs 请求参数对象
 * @property {Object} body 请求对象
 * @property {String} timeout 超时时间,default:60000ms
 * @property {Object} headers 自定义请求头
 * @property {String} retry 重试次数 系统名称,default:0
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
 * Navigator类，导航.
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
 * 调起拨号程序拨打电话
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Phone.prototype.call = function(opts, cb) {
  return this._aladdin.call(this.name, 'call', opts, cb);
};

/**
 * 弹出通讯录界面选择某个联系人信息
 *
 * @param {Function} cb
 */
Phone.prototype.selectContact = function(cb) {
  return this._aladdin.call(this.name, 'selectContact', cb);
};

/**
 * 获取手机号
 *
 * @param {Function} cb
 */
Phone.prototype.getMobileNo = function(cb) {
  return this._aladdin.call(this.name, 'getMobileNo', cb);
};

/**
 * 二维码
 */

function Qrcode(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Qrcode.prototype, 'name', {
  value: 'bowqrcode',
  writable: false
});

/**
 * 二维码条形码扫瞄
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
 * 生成二维码
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Qrcode.prototype.generate = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'generate', opts, cb);
};

/**
 * 保存二维码条形码到相册
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
 * 二维码屏幕调亮
 *
 * @param {Object} opts
 *    isAuto:Boolean //false 代表可以修改屏幕亮度,ture 忽略screenLightness
 *    screenLightness:Number // 屏幕亮度值 0–255
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
 * SafeKeyBoard 唤起安全键盘
 *
 * @param {Object} opts
 * @param {Function} cb
 */
SafeKeyBoard.prototype.arouse = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'arouse', opts, cb);
};

/**
 * SafeKeyBoard 关闭密码键盘
 *
 * @param {Function} cb
 */
SafeKeyBoard.prototype.hide = function(cb) {
  return this._aladdin.call(this.name, 'hide', cb);
};

/**
 * 好友分享
 */

function Share(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Share.prototype, 'name', {
  value: 'bowshare',
  writable: false
});

/**
 * 分享信息
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Share.prototype.msg = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'msg', opts, cb);
};

/**
 * 二维码分享
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
 * 分享
 * native不做渠道显示,调起直接分享
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Share.prototype.send = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'send', opts, cb);
};

/**
 * SharedMemory类，同步方式进行存储.
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
  /** 非字符串类型的key */
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
 * 设置值
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
 * 获取键
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
 * 清理key对应的共享内存数据
 * @param key {String} 共享内存中对应的键值
 * @returns
 */
SharedMemory.prototype.removeItem = function(key) {
  key = __stringfy(key);
  return this._aladdin.callSync(this.name, 'removeItem', key);
};

/**
 * 清理所有共享内存数据
 */
SharedMemory.prototype.clear = function() {
  return this._aladdin.callSync(this.name, 'clear');
};

/**
 * Sms类，短信服务.
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
 * 获取短信(OPT自动读取验证)(仅安卓)
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
 * Sms.prototype.message的别名
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Sms.prototype.autoFetchOtpMsg = function(opts, cb) {
  return this.message(opts, cb);
};

/**
 * 发送短信
 *
 * @param {Object} opts
 * @property {String} mobileNo 手机号码
 * @property {String} body 短信内容
 * @param {Function} cb
 */
Sms.prototype.send = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'send', opts, cb);
};

/**
 * 智能语音
 */
function Voice(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Voice.prototype, 'name', {
  value: 'bowvoice',
  writable: false
});

/**
 * 智能语音转账入口
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Voice.prototype.transfer = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'transfer', opts, cb);
};

/**
 * 语音识别 获取文本
 *
 * @param {Function} cb
 */
Voice.prototype.getText = function(cb) {
  return this._aladdin.call(this.name, 'getText', cb);
};

/**
 * AccountMigration类，账户迁移.
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
 * 获取用户上次打开app时间,迁移过来的账户是否有设置交易密码
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
 * 清除数据
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
* 消息公告.
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
 * 获取公告数据
 *
 * @param {Function} cb
 */
Announcement.prototype.getNoticeData=function(cb){
  return this._aladdin.call(this.name, 'getNoticeData', cb);
};


/**
* 设置公告已读状态
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
 * 获取缓存大小，字节形式
 *
 * @param {Object} opts 后台接口queryversion返回的数据
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
 * 登录
 */

function Auth(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(Auth.prototype, 'name', {
  value: 'bowauth',
  writable: false
});


/**
 * 将H5 的登录数据同步给Native
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Auth.prototype.synLogin = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'synLogin', opts, cb);
};

/**
 * 将H5的登出状态同步给Native
 *
 * @param {Function} cb
 */
Auth.prototype.synLogout = function(cb) {
  return this._aladdin.call(this.name, 'synLogout', cb);
};

/**
 * 获取登录数据
 *
 * @param {Function} cb
 */
Auth.prototype.fetchLogin = function(cb) {
  return this._aladdin.call(this.name, 'fetchLogin', cb);
};

/**
 * 登录认证
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
 * 取消登录
 */
Auth.prototype.cancelLogin = function(cb) {
  return this._aladdin.call(this.name, 'cancelLogin', cb);
};

/**
 *
 * 与synLogout的区别是:safeExit有Native退出调研逻辑.
 *
 * 后续应该去掉该safeExit，而是单独添加退出调研弹窗的组件。在synLogout的回调中调用它。
 *
 * @param {Function} cb
 */
Auth.prototype.safeExit = function (cb) {
    return this._aladdin.call(this.name, 'safeExit', cb);
};

/**
 * 身份证授权
 */

function CreditAuthorization(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(CreditAuthorization.prototype, 'name', {
  value: 'bowcreditAuthorization',
  writable: false
});

/**
 * 扫描身份证
 *
 * @param {Object} opts
 * @param {Function} cb
 */
CreditAuthorization.prototype.scan = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'scan', opts, cb);
};

/**
 * 登录
 */

function FingerLogin(aladdin) {
  this._aladdin = aladdin;
}

Object.defineProperty(FingerLogin.prototype, 'name', {
  value: 'bowfingerLogin',
  writable: false
});


/**
 * touchId支持与开启状态获取
 *
 * @param {Function} cb
 */
FingerLogin.prototype.checkTouchIdState = function(cb) {
  return this._aladdin.call(this.name, 'checkTouchIdState', cb);
};

/**
 * 指纹登录开关状态获取
 *
 * @param {Function} cb
 */
FingerLogin.prototype.checkFingerprintsSwitch = function(cb) {
  return this._aladdin.call(this.name, 'checkFingerprintsSwitch', cb);
};

/**
 * 调起指纹登录接口
 *
 *  @param {Object}  {flag: ‘open’/‘close’} 开启/关闭
 * @param {Function} cb
 */
FingerLogin.prototype.setFingerprintsSwitch = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name, 'setFingerprintsSwitch', opts, cb);
};

/**
 * 获取登录数据
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
 * 调起设置页面
 *
 * @param {Function} cb
 */
Gesture.prototype.proceedSetup = function(opts, cb) {
  return this._aladdin.call(this.name, 'proceedSetup', opts, cb);
};

/**
 * 同步认证Token
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Gesture.prototype.syncAuthToken = function(opts, cb) {
  return this._aladdin.call(this.name, 'syncAuthToken', opts, cb);
};

/**
 * 获取手势开关
 *
 * @param {Function} cb
 */
Gesture.prototype.checkSwitchState = function(cb) {
  return this._aladdin.call(this.name, 'checkSwitchState', cb);
};

/**
 * 保存手势登录功能开关
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Gesture.prototype.updateSwitchState = function(opts, cb) {
  return this._aladdin.call(this.name, 'updateSwitchState', opts, cb);
};

/**
 * 打开手势密码验证
 *
 * @param {Function} cb
 */
Gesture.prototype.openAccessVerify = function(cb) {
  return this._aladdin.call(this.name, 'openAccessVerify', cb);
};

/**
 * 清除设置信息
 *
 * @param {Function} cb
 */
Gesture.prototype.clearProfileSettings = function(cb) {
  return this._aladdin.call(this.name, 'clearProfileSettings', cb);
};

/**
 * 是否已经设置了手势密码
 *
 * @param {Function} cb
 */
Gesture.prototype.isAlreadySetup = function(cb) {
  return this._aladdin.call(this.name, 'isAlreadySetup', cb);
};

/**
 * 手势密码路径是否显示
 *
 * @param {Function} cb
 */
Gesture.prototype.checkPathVisible = function(cb) {
  return this._aladdin.call(this.name, 'checkPathVisible', cb);
};

/**
 * 设置手势密码路径是否显示
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Gesture.prototype.updatePathVisible = function(opts, cb) {
  return this._aladdin.call(this.name, 'updatePathVisible', opts, cb);
};


/**
 * 同步手势密码是否设置成功给native
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Gesture.prototype.synPasswordSetup = function(opts, cb) {
  return this._aladdin.call(this.name, 'synPasswordSetup', opts, cb);
};

/**
 *  修改手势密码
 */
Gesture.prototype.modifyPassword = function(cb) {
  return this._aladdin.call(this.name, 'modifyPassword', cb);
};

/**
 * Guidance类，客户引导.
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
 * 转账--首次客户引导，理财产品--首次客户引导
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
// * 理财产品--首次客户引导
// *
// * @param {Function} cb
// */
// Guidance.prototype.financialProductsGuide = function (cb) {
//     return this._aladdin.call(this.name, 'financialProductsGuide', cb);
// };

/**
 * 进app启动引导页
 */
Guidance.prototype.appGuideView = function() {
  return this._aladdin.call(this.name, 'appGuideView');
};

/**
 * 马拉松
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
* Notification类，消息提醒.
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
 * 获取系统是否开启消息提醒
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
 * 获取系统是否开启消息提醒
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
* 保存消息列表（活动、交易、公告）
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
* 获取消息列表（活动、交易、公告）
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
* 判断客户号是否与上一次登录相同
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
* 设置单条消息（活动、交易、公告 ）为已读
*
* @param {Object} opts
* @param {Function} cb
*/
Notification.prototype.markMessageRead = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'markMessageRead', opts, cb);
};

/**
 * 跳转AppStore(仅ios可用)  注意！应该移到application组件的
 * @param {Object} opts   如：{url: "http://xxxx.com"}
 * @param {Function} cb
 */
Notification.prototype.toAppStore=function(opts,cb){
    return this._aladdin.call(this.name, 'toAppStore',opts, cb);
};

/**
 * 通知native最新消息数
 */
Notification.prototype.setNewMsgNumber=function(number,cb){
    return this._aladdin.call(this.name, 'setNewMsgNumber',number, cb);
};

/**
* 设置消息中心全局数据
*
* @param {Object} opts  {startTime: 1487851343095}  startTime:开始时间
* @param {Function} cb
*/
Notification.prototype.setPublicData = function (opts, cb) {
    opts = opts || {};

    return this._aladdin.call(this.name, 'setPublicData', opts, cb);
};
/**
* 获取消息中心全局数据
*
* @param {Object} opts
* @param {Function} cb
*/
Notification.prototype.getPublicData = function (cb) {
    return this._aladdin.call(this.name, 'getPublicData', cb);
};

/**
* 通知native需要去重新拉取新消息数(用于检测tab首页是否需要加红点)
* @param {Function} cb
*/
Notification.prototype.checkNewNumber = function (cb) {
    return this._aladdin.call(this.name, 'checkNewNumber', cb);
};

/**
 * Offer类，优惠券.
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
 * 是否有小红点
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
 * 清楚小红点
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
 * 查看未领取的offer数
 *
 * @param {Function} cb
 */
Offer.prototype.queryRightCount = function(cb) {
  return this._aladdin.call(this.name, 'queryRightCount', cb);
};

/**
* 截图设置(仅Android)
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
* 获取截屏开启状态
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
* 设置截屏开启状态
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
 * 埋点
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
 * Tsm类，入行TSM-基于SE芯片安全认证.
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
 * UKey 读取卡片唯一序列号
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
 * UKey 获取卡片信息
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
 * UKey 下载证书
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
 * UKey 存储证书
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
 * UKey 获取证书
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
 * UKey 获取下载证书需要的p10格式数据
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
 * UKey 验证PIN
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
 * UKey 更新PIN
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
 * UKey 签名数据
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
 * UKey 生成RSA公钥
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Tsm.prototype.ukeyGenRSA = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'ukeyGenRSA', opts, cb);
};

/**
 * 人脸识别
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
/** 打开人脸识别 注意：人脸识别测试环境只能打debug包测试，生产环境只能打release包。
 *
 * @param opts [appId]          string    BISP统一分配,请与人脸识别appkey的申请人确认 (口袋已经在native处理，h5不需要传)
 *             [appKey]         string    BISP统一分配,请与人脸识别appkey的申请人确认 (口袋已经在native处理，h5不需要传)
 *             [systemId]       string    BISP统一分配,请与人脸识别appkey的申请人确认 (口袋已经在native处理，h5不需要传)
 *             [actionNum]      string    0:无动作 1:张嘴 2:随机动作
 *             [faceRecVersion] string    0:旧版本 1:新版本,口袋接入的是新版本,需要传1的字符串
 * @param {Function} cb   function(error,responseObj){}; responseObj 对象有两个属性,为imageId和token
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
 * 扫描银行卡
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
 * 获取地理位置
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
 * 打开钱包
 *
 * @param {Object} opts
 * @param {Function} cb
 */
Applepay.prototype.openWallet = function(opts, cb) {
  return this._aladdin.call(this.name, 'openWallet', opts, cb);
};

/**
 * 软证书.
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
 *  下载软证书
 * @param {Object} opts
 * @param {Function} cb
 */
Softcertificate.prototype.downCer = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name,'downCer', opts, cb);
};

/**
 * 查询软证书
 * @param {Function} cb
 */
Softcertificate.prototype.queryCer = function(cb) {
  return this._aladdin.call(this.name,'queryCer', cb);
};

/**
 * 创建p10
 * @param {Function} cb
 */
Softcertificate.prototype.createP10 = function(cb) {
  return this._aladdin.call(this.name,'createP10', cb);
};

/**
 * 判断本地是否存在软证书
 * @param {Function} cb
 */
Softcertificate.prototype.checkCertExist = function(cb) {
  return this._aladdin.call(this.name,'checkCertExist', cb);
};

/**
 *  加签
 * @param {Object} opts
 * @param {Function} cb
 */
Softcertificate.prototype.signData = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name,'signData', opts, cb);
};

/**
 *  导入证书
 * @param {Object} opts
 * @param {Function} cb
 */
Softcertificate.prototype.importCert = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name,'importCert', opts, cb);
};

/**
 * 删除本地证书
 * @param {Function} cb
 */
Softcertificate.prototype.deleteCert = function(cb) {
  return this._aladdin.call(this.name,'deleteCert', cb);
};

/**
 *  获取本地证书信息
 * @param {Object} opts
 * @param {Function} cb
 */
Softcertificate.prototype.getCertInfo = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name,'getCertInfo', opts, cb);
};

/**
 * 任意门.
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
 *  打开任意门
 * @param {Object} opts
 * @param {Function} cb
 */
Anydoor.prototype.openPlugin = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name,'openPlugin', opts, cb);
};

/**
 * CityPicker类，城市选择器.
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
 * DatePick类，日期选择器.
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
 * 日期
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
 * 周期
 *
 * @param {Object} opts
 * @param {Function} cb
 */
DatePicker.prototype.period = function(opts, cb) {
  opts = opts || {};

  return this._aladdin.call(this.name, 'period', opts, cb);
};

/**
 * ModuleCityChoose类，导航头.
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
 * 选择城市
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
 * ModuleTabBar类，导航头.
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
* 选择tab
*
* @param {Object} opts
＊   @param {String} url
* @param {Function} cb
*/
ModuleTabBar.prototype.select = function(opts, cb) {
  opts = opts || {};
  return this._aladdin.call(this.name, 'select', opts, cb);
};

/**
 * 下拉刷新
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
 * 添加下拉刷新
 *
 * @param {Object} opts 配置
 *                 - {Function} onRefresh 开始刷新回调方法
 *                 - {String} title 标题
 * @param {Function} cb
 * @returns this
 */
RefreshControl.prototype.create = function(opts, cb) {
  return this._aladdin.call(this.name, 'create', opts, cb);
};

/**
 * 停止显示下拉视图
 *
 * @param {Function} cb
 * @returns this
 */
RefreshControl.prototype.stop = function(cb) {
  return this._aladdin.call(this.name, 'stop', cb);
};

/**
 * Spinner类，下拉框.
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
 * 单选
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
