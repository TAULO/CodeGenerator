if (self.CavalryLogger) { CavalryLogger.start_js(["5Hph+"]); }

__d("FBRTCCallConstants",[],(function(a,b,c,d,e,f){e.exports={FBRTCCallConnectionType:{MISSED_CALL:4,CONNECTED_CALL:5},FBRTCCallType:{VOICE_CALL:1,VIDEO_CALL:2,COLLAB_VIDEO_CALL:3,COLLAB_SCREEN_SHARE_CALL:4}}}),null);
__d("FBRTCCapability",[],(function(a,b,c,d,e,f){e.exports={SUPPORT_AUDIO_DEPRECATED:0,SUPPORT_VIDEO_DEPRECATED:1,SUPPORT_EXPERIMENTS_IN_JOIN_RESPONSE:2,SUPPORT_NEW_PARTICIPANT_STATES:3,SUPPORT_SDP_RENEGOTIATION:4,SUPPORT_MWPP:5,REQUIRE_FULL_SDP_IN_SMU:6,SUPPORT_PRECONNECT:7}}),null);
__d("FBRTCDeviceStatus",[],(function(a,b,c,d,e,f){e.exports={OK:0,NOT_SUPPORTED:1,IN_ANOTHER_CALL:10}}),null);
__d("FBRTCDismissReason",[],(function(a,b,c,d,e,f){e.exports={CALL_ENDED:0,ANSWERED_ON_ANOTHER_DEVICE:1,IN_ANOTHER_CALL:2,CONNECTION_DROPPED:3,REJECTED_ON_ANOTHER_DEVICE:4,REMOVED_BY_PARTICIPANT:5,REJECTED_BY_CALLEE:6,INTERNAL_ERROR:7,CALL_ENDED_BY_PRODUCT:9}}),null);
__d("FBRTCHangupReason",[],(function(a,b,c,d,e,f){e.exports={IGNORE_CALL:0,HANGUP_CALL:1,NO_ANSWER_TIMEOUT:2,CLIENT_ERROR:3,IN_ANOTHER_CALL:4,CLIENT_INTERRUPTED:5,SESSION_MIGRATED:6}}),null);
__d("FBRTCMediaType",[],(function(a,b,c,d,e,f){e.exports={AUDIO:0,VIDEO:1,DATA:2}}),null);
__d("FBRTCRtcResponseStatusCode",[],(function(a,b,c,d,e,f){e.exports={OK:200,BAD_REQUEST:400,UNAUTHORIZED:401,NOT_FOUND:404,METHOD_NOT_ALLOWED:406,CONFLICT:409,CONDITIONAL_REQUEST_FAILED:412,SERVER_INTERNAL_ERROR:500,SERVICE_UNAVAILABLE:503}}),null);
__d("FBRTCVideoQuality",[],(function(a,b,c,d,e,f){e.exports={LOW:0,MEDIUM:1,HIGH:2,HD:3,NUM_QUALITIES:4}}),null);
__d("ChromeExtensionInstallError",[],(function(a,b,c,d,e,f){"use strict";__p&&__p();a=function(a){__p&&__p();babelHelpers.inheritsLoose(b,a);function b(b,c,d){var e;e=a.call(this,b)||this;e.message=b;e.$ChromeExtensionInstallError3=b;e.$ChromeExtensionInstallError1=d;e.$ChromeExtensionInstallError2=c;e.name=e.constructor.name;return e}var c=b.prototype;c.toString=function(){return this.name+": "+[this.message,this.$ChromeExtensionInstallError2,this.$ChromeExtensionInstallError1].join("-")};c.getTypedMessage=function(){return this.$ChromeExtensionInstallError3};c.getInstallType=function(){return this.$ChromeExtensionInstallError2};return b}(babelHelpers.wrapNativeSuper(Error));e.exports=a}),null);
__d("RTCChromeExtensionListener",["DateConsts","EventEmitter"],(function(a,b,c,d,e,f){"use strict";__p&&__p();a=b("DateConsts").MS_PER_SEC;var g=a;c=function(a){__p&&__p();babelHelpers.inheritsLoose(b,a);function b(b){__p&&__p();var c;c=a.call(this)||this;c.$RTCChromeExtensionListener1=!1;c.$RTCChromeExtensionListener2=null;c.$RTCChromeExtensionListener5=function(a){var b=a;if(a.type==="notificationButtonClicked"){var d=a.buttonIndex;a=a.notificationId;d!==0&&d!==1&&(b={type:"notificationClicked",notificationId:a})}c.emit(b.type,b)};c.$RTCChromeExtensionListener6=function(a){a.onMessage.removeListener(c.$RTCChromeExtensionListener5),c.$RTCChromeExtensionListener2=null,c.emit("portDisconnected"),c.$RTCChromeExtensionListener1===!1&&c.$RTCChromeExtensionListener7(g)};c.$RTCChromeExtensionListener3=b;return c}var c=b.prototype;c.$RTCChromeExtensionListener4=function(){if(this.$RTCChromeExtensionListener2==null)try{var a=window.chrome.runtime.connect(this.$RTCChromeExtensionListener3,{name:"notifications"});a.onMessage.addListener(this.$RTCChromeExtensionListener5);a.onDisconnect.addListener(this.$RTCChromeExtensionListener6);this.$RTCChromeExtensionListener2=a;this.emit("portConnected")}catch(a){this.emit("portConnectionError",a)}};c.$RTCChromeExtensionListener7=function(a){var b=this;a===void 0&&(a=10);window.setTimeout(function(){b.$RTCChromeExtensionListener4()},a)};c.connect=function(){this.$RTCChromeExtensionListener7()};c.disconnect=function(){this.$RTCChromeExtensionListener2!=null&&(this.$RTCChromeExtensionListener1=!0,this.$RTCChromeExtensionListener2.disconnect(),this.$RTCChromeExtensionListener2=null)};return b}(b("EventEmitter"));e.exports=c}),null);
__d("RTCChromeScreenSharingExtension",["Promise","RTCChromeExtensionListener","URI","isWorkplaceDotComURI","uuid"],(function(a,b,c,d,e,f){__p&&__p();var g;function a(){return b("isWorkplaceDotComURI")((g||(g=b("URI"))).getRequestURI())}var h="hmobhiioligjpeieihehfjlkmmkjemfl",i="ncfpggehkhmjpdjpefomjchjafhmbnai";h=a()===!0?h:i;function c(a){return new(b("RTCChromeExtensionListener"))(a)}function j(a,c){return new(b("Promise"))(function(b,d){window.chrome.runtime.sendMessage(c,a,function(a){if(a!=null)typeof a==="object"&&a.type==="error"?d(new Error(a.message)):b(a);else{a=window.chrome.runtime.lastError.message;d(new Error(a))}})})}function d(a,b){b===void 0&&(b=["screen","window","tab"]);return j({type:"getStreamID",sources:b},a)}function f(a,b){return j({type:"cancel",requestID:a},b)}function k(){return b("uuid")()}e.exports={EXTENSION_ID:h,connectToNotifications:c,generateNotificationID:k,getMediaSourceFromExtension:d,useWorkplaceExtension:a,sendExtensionRequest:j,stopExtensionScreenSharing:f}}),null);
__d("ScreenSharingExtensionInstallationTypedLogger",["Banzai","GeneratedLoggerUtils","nullthrows"],(function(a,b,c,d,e,f){"use strict";__p&&__p();a=function(){__p&&__p();function a(){this.$1={}}var c=a.prototype;c.log=function(){b("GeneratedLoggerUtils").log("logger:ScreenSharingExtensionInstallationLoggerConfig",this.$1,b("Banzai").BASIC)};c.logVital=function(){b("GeneratedLoggerUtils").log("logger:ScreenSharingExtensionInstallationLoggerConfig",this.$1,b("Banzai").VITAL)};c.logImmediately=function(){b("GeneratedLoggerUtils").log("logger:ScreenSharingExtensionInstallationLoggerConfig",this.$1,{signal:!0})};c.clear=function(){this.$1={};return this};c.getData=function(){return babelHelpers["extends"]({},this.$1)};c.updateData=function(a){this.$1=babelHelpers["extends"]({},this.$1,a);return this};c.setExtensionID=function(a){this.$1.extension_id=a;return this};c.setFailReason=function(a){this.$1.fail_reason=a;return this};c.setInstallEvent=function(a){this.$1.install_event=a;return this};c.setSourceApp=function(a){this.$1.source_app=a;return this};c.setTime=function(a){this.$1.time=a;return this};c.setType=function(a){this.$1.type=a;return this};c.setURIPath=function(a){this.$1.uri_path=a;return this};c.setVC=function(a){this.$1.vc=a;return this};c.setWeight=function(a){this.$1.weight=a;return this};return a}();c={extension_id:!0,fail_reason:!0,install_event:!0,source_app:!0,time:!0,type:!0,uri_path:!0,vc:!0,weight:!0};e.exports=a}),null);
__d("CollabRTCChromeScreenSharingExtension",["invariant","Promise","regeneratorRuntime","ChromeExtensionInstallError","DateConsts","RTCChromeScreenSharingExtension","ScreenSharingExtensionInstallationTypedLogger","URI","isFacebookURI"],(function(a,b,c,d,e,f,g){"use strict";__p&&__p();var h;a=b("DateConsts").MS_PER_MIN;var i=(c=b("RTCChromeScreenSharingExtension")).EXTENSION_ID,j=c.generateNotificationID,k=c.getMediaSourceFromExtension,l=c.sendExtensionRequest,m=c.stopExtensionScreenSharing;d=c.useWorkplaceExtension;var n="DIALOG_USER_CANCEL",o="EXTENSION_NOT_FOUND",p="MESSAGESENDER_TAB_UNDEFINED",q="REQUEST_ID_UNDEFINED",r="UNEXPECTED_ERROR";f="data-fb-only-screensharing-extension-available";c="data-wp-screensharing-extension-available";var s=d()===!0?c:f,t=250,u=2*a,v=2;d=function(){__p&&__p();function a(){this.DIALOG_USER_CANCEL=n,this.EXTENSION_NOT_FOUND=o,this.MESSAGESENDER_TAB_UNDEFINED=p,this.REQUEST_ID_UNDEFINED=q,this.UNEXPECTED_ERROR=r,this.$2=i}var c=a.prototype;c.isInstalled=function(){var a=document;a=a.documentElement;return a!=null&&a.hasAttribute(s)?!0:!1};c.throwIfNotInstalled=function(){if(this.isInstalled()!==!0)throw new Error(o)};c.$3=function(a,c){__p&&__p();var d=this,e=(c=a)!=null?(c=c.chrome)!=null?c.webstore:c:c;if(e==null)return b("Promise").reject(new(b("ChromeExtensionInstallError"))("CHROME_WEBSTORE_UNDEFINED","inline"));var f=window.document.documentElement;w(this.getExtensionURL(),window.document);a!==window&&w(this.getExtensionURL(),a.document);return new(b("Promise"))(function(a,c){e.install(d.getExtensionURL(),function(){f!=null&&f.setAttribute(d.getPresenseAttr(),"true"),a()},function(a,d){c(new(b("ChromeExtensionInstallError"))("EXTENSION_INSTALL_FAILED","inline",d))})}).then(function(){d.$4(v);return"inline"})};c.$5=function(a){__p&&__p();var c=this;if(this.isInstalled())return b("Promise").resolve("store");w(this.getExtensionURL(),window.document);window.open(this.getExtensionURL(),"_blank");return this.$4(u/t).then(function(){var a=window.document.documentElement;a.setAttribute(c.getPresenseAttr(),"true");return"store"})["catch"](function(){throw new(b("ChromeExtensionInstallError"))("EXTENSION_STORE_INSTALL_TIMEOUT","store")})};c.getPresenseAttr=function(){return s};c.isInlineInstallCapableDomain=function(){return b("isFacebookURI")((h||(h=b("URI"))).getRequestURI())};c.install=function(a){var c=this;if(this.isInstalled())return b("Promise").resolve();new(b("ScreenSharingExtensionInstallationTypedLogger"))().setInstallEvent("started").setExtensionID(this.$2).setSourceApp(a).log();return this.$6(a).then(function(d){new(b("ScreenSharingExtensionInstallationTypedLogger"))().setInstallEvent("installed").setExtensionID(c.$2).setType(d).setSourceApp(a).setURIPath((h||(h=b("URI"))).getRequestURI().getPath()).log()})["catch"](function(d){new(b("ScreenSharingExtensionInstallationTypedLogger"))().setInstallEvent("failed").setExtensionID(c.$2).setFailReason(d.getTypedMessage()).setType(d.getInstallType()).setSourceApp(a).setURIPath((h||(h=b("URI"))).getRequestURI().getPath()).log();throw d})};c.$6=function(a){var b;if(!this.isInlineInstallCapableDomain())return this.$5(a);b=(b=window)!=null?(b=b.chrome)!=null?b.webstore:b:b;if(b==null)return this.$5(a);return window.opener?this.$5(a):this.$3(window,a)};c.getSourceID=function(a){__p&&__p();var c;return b("regeneratorRuntime").async(function(d){__p&&__p();while(1)switch(d.prev=d.next){case 0:if(this.isInstalled()){d.next=2;break}throw new Error(o);case 2:d.next=4;return b("regeneratorRuntime").awrap(k(this.$2,a));case 4:c=d.sent;d.t0=c.type;d.next=d.t0==="streamID"?8:d.t0==="canceledGetStreamID"?10:11;break;case 8:this.$1=c.requestID;return d.abrupt("return",c.streamID);case 10:throw new Error(n);case 11:throw new Error(r);case 12:case"end":return d.stop()}},null,this)};c.getExtensionID=function(){return this.$2};c.getExtensionURL=function(){return"https://chrome.google.com/webstore/detail/"+this.$2};c.stop=function(){return b("regeneratorRuntime").async(function(a){while(1)switch(a.prev=a.next){case 0:a.next=2;return b("regeneratorRuntime").awrap(m(this.$1,this.$2));case 2:this.$1=null;case 3:case"end":return a.stop()}},null,this)};c.$4=function(a){var b=this;return l({type:"ping"},this.$2)["catch"](function(c){if(a<1)throw c;return x(t).then(function(){return b.$4(a-1)})})};c.isMinimumVersionNumber=function(a,c,d){__p&&__p();var e,f,g,h,i,j;return b("regeneratorRuntime").async(function(k){__p&&__p();while(1)switch(k.prev=k.next){case 0:this.throwIfNotInstalled();k.next=3;return b("regeneratorRuntime").awrap(l({type:"ping"},this.$2));case 3:e=k.sent;f=e.version;g=f.split(".").map(function(a){return parseInt(a,10)}),h=g[0],i=g[1],j=g[2];if(!(h>=a)){k.next=10;break}if(!(i>c)){k.next=9;break}return k.abrupt("return",!0);case 9:return k.abrupt("return",i===c&&j>=d);case 10:return k.abrupt("return",!1);case 11:case"end":return k.stop()}},null,this)};c.focusTabAndWindow=function(){__p&&__p();var a;return b("regeneratorRuntime").async(function(c){while(1)switch(c.prev=c.next){case 0:this.throwIfNotInstalled();c.next=3;return b("regeneratorRuntime").awrap(l({type:"focusTabAndWindow"},this.$2));case 3:a=c.sent;return c.abrupt("return",{tab:a.tab,window:a.window});case 5:case"end":return c.stop()}},null,this)};c.getLastFocusedWindow=function(a){__p&&__p();var c;return b("regeneratorRuntime").async(function(d){while(1)switch(d.prev=d.next){case 0:this.throwIfNotInstalled();d.next=3;return b("regeneratorRuntime").awrap(l({type:"getLastFocusedWindow",getInfo:a},this.$2));case 3:c=d.sent;return d.abrupt("return",c.window);case 5:case"end":return d.stop()}},null,this)};c.getTabForSender=function(){__p&&__p();var a;return b("regeneratorRuntime").async(function(c){while(1)switch(c.prev=c.next){case 0:this.throwIfNotInstalled();c.next=3;return b("regeneratorRuntime").awrap(l({type:"getTabForSender"},this.$2));case 3:a=c.sent;return c.abrupt("return",a.tab);case 5:case"end":return c.stop()}},null,this)};c.getTabAndWindowForSender=function(){__p&&__p();var a;return b("regeneratorRuntime").async(function(c){while(1)switch(c.prev=c.next){case 0:this.throwIfNotInstalled();c.next=3;return b("regeneratorRuntime").awrap(l({type:"getTabAndWindowForSender"},this.$2));case 3:a=c.sent;return c.abrupt("return",{tab:a.tab,window:a.window});case 5:case"end":return c.stop()}},null,this)};c.getWindow=function(a,c){__p&&__p();var d;return b("regeneratorRuntime").async(function(e){while(1)switch(e.prev=e.next){case 0:this.throwIfNotInstalled();e.next=3;return b("regeneratorRuntime").awrap(l({type:"getWindow",windowId:a,getInfo:c},this.$2));case 3:d=e.sent;return e.abrupt("return",d.window);case 5:case"end":return e.stop()}},null,this)};c.updateTab=function(a,c){__p&&__p();var d,e;return b("regeneratorRuntime").async(function(f){__p&&__p();while(1)switch(f.prev=f.next){case 0:this.throwIfNotInstalled();d={type:"updateTab",updateProperties:a};c!==void 0&&(d.tabId=c);f.next=5;return b("regeneratorRuntime").awrap(l(d,this.$2));case 5:e=f.sent;return f.abrupt("return",e.tab);case 7:case"end":return f.stop()}},null,this)};c.updateWindow=function(a,c){__p&&__p();var d;return b("regeneratorRuntime").async(function(e){while(1)switch(e.prev=e.next){case 0:this.throwIfNotInstalled();e.next=3;return b("regeneratorRuntime").awrap(l({type:"updateWindow",windowId:a,updateInfo:c},this.$2));case 3:d=e.sent;return e.abrupt("return",d.window);case 5:case"end":return e.stop()}},null,this)};c.clearNotification=function(a){__p&&__p();var c,d;return b("regeneratorRuntime").async(function(e){__p&&__p();while(1)switch(e.prev=e.next){case 0:e.next=2;return b("regeneratorRuntime").awrap(this.isNotificationPermissionGranted());case 2:c=e.sent;if(!(c===!1)){e.next=5;break}throw new Error("Chrome extension notifications permission not granted");case 5:e.next=7;return b("regeneratorRuntime").awrap(l({type:"clearNotification",notificationId:a},this.$2));case 7:d=e.sent;return e.abrupt("return",d.wasCleared);case 9:case"end":return e.stop()}},null,this)};c.createNotification=function(a){__p&&__p();var c,d;return b("regeneratorRuntime").async(function(e){__p&&__p();while(1)switch(e.prev=e.next){case 0:e.next=2;return b("regeneratorRuntime").awrap(this.isNotificationPermissionGranted());case 2:c=e.sent;if(!(c===!1)){e.next=5;break}throw new Error("Chrome extension notifications permission not granted");case 5:e.next=7;return b("regeneratorRuntime").awrap(l({type:"createNotification",notificationId:j(),options:a},this.$2));case 7:d=e.sent;return e.abrupt("return",d.notificationId);case 9:case"end":return e.stop()}},null,this)};c.getAllNotifications=function(){__p&&__p();var a,c;return b("regeneratorRuntime").async(function(d){__p&&__p();while(1)switch(d.prev=d.next){case 0:d.next=2;return b("regeneratorRuntime").awrap(this.isNotificationPermissionGranted());case 2:a=d.sent;if(!(a===!1)){d.next=5;break}throw new Error("Chrome extension notifications permission not granted");case 5:d.next=7;return b("regeneratorRuntime").awrap(l({type:"getAllNotifications"},this.$2));case 7:c=d.sent;return d.abrupt("return",Object.keys(c.notifications));case 9:case"end":return d.stop()}},null,this)};c.getNotificationsPermissionLevel=function(){__p&&__p();var a;return b("regeneratorRuntime").async(function(c){while(1)switch(c.prev=c.next){case 0:this.throwIfNotInstalled();c.next=3;return b("regeneratorRuntime").awrap(l({type:"getNotificationsPermissionLevel"},this.$2));case 3:a=c.sent;return c.abrupt("return",a.level);case 5:case"end":return c.stop()}},null,this)};c.updateNotification=function(a,c){__p&&__p();var d,e;return b("regeneratorRuntime").async(function(f){__p&&__p();while(1)switch(f.prev=f.next){case 0:f.next=2;return b("regeneratorRuntime").awrap(this.isNotificationPermissionGranted());case 2:d=f.sent;if(!(d===!1)){f.next=5;break}throw new Error("Chrome extension notifications permission not granted");case 5:f.next=7;return b("regeneratorRuntime").awrap(l({type:"updateNotification",notificationId:a,options:c},this.$2));case 7:e=f.sent;return f.abrupt("return",e.wasUpdated);case 9:case"end":return f.stop()}},null,this)};c.isNotificationPermissionGranted=function(){__p&&__p();var a;return b("regeneratorRuntime").async(function(c){__p&&__p();while(1)switch(c.prev=c.next){case 0:a="denied";c.prev=1;c.next=4;return b("regeneratorRuntime").awrap(this.getNotificationsPermissionLevel());case 4:a=c.sent;c.next=10;break;case 7:c.prev=7,c.t0=c["catch"](1),a="denied";case 10:c.t1=a;c.next=c.t1==="granted"?13:c.t1==="denied"?14:15;break;case 13:return c.abrupt("return",!0);case 14:return c.abrupt("return",!1);case 15:throw new Error("Received an unexpected permission level: "+a);case 16:case"end":return c.stop()}},null,this,[[1,7]])};return a}();function w(a,b){var c="chrome-webstore-item";if(!b.querySelector('link[href="'+a+'"][rel="'+c+'"]')){var d=b.createElement("link");d.setAttribute("href",a);d.setAttribute("rel",c);b.head!=null||g(0,6240);b.head.appendChild(d)}}function x(a){return new(b("Promise"))(function(b){return window.setTimeout(b,a)})}e.exports=new d()}),null);
__d("CollabRTCChromeScreenSharing",["CollabRTCChromeScreenSharingExtension"],(function(a,b,c,d,e,f){"use strict";__p&&__p();a={focusTabAndWindow:function(){return b("CollabRTCChromeScreenSharingExtension").focusTabAndWindow()},getLastFocusedWindow:function(a){return b("CollabRTCChromeScreenSharingExtension").getLastFocusedWindow(a)},getTabForSender:function(){return b("CollabRTCChromeScreenSharingExtension").getTabForSender()},getTabAndWindowForSender:function(){return b("CollabRTCChromeScreenSharingExtension").getTabAndWindowForSender()},getWindow:function(a,c){return b("CollabRTCChromeScreenSharingExtension").getWindow(a,c)},getSourceID:function(a,c){return b("CollabRTCChromeScreenSharingExtension").install(c).then(function(){return b("CollabRTCChromeScreenSharingExtension").getSourceID(a)})},stop:function(){return b("CollabRTCChromeScreenSharingExtension").stop()},updateTab:function(a,c){return b("CollabRTCChromeScreenSharingExtension").updateTab(a,c)},updateWindow:function(a,c){return b("CollabRTCChromeScreenSharingExtension").updateWindow(a,c)}};e.exports=a}),null);
__d("RTCIceCandidate",[],(function(a,b,c,d,e,f){"use strict";e.exports=window.RTCIceCandidate||window.mozRTCIceCandidate}),null);
__d("RTCPeerConnection",[],(function(a,b,c,d,e,f){"use strict";e.exports=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection}),null);
__d("isGroupCallUri",["isFacebookURI","isMessengerDotComURI"],(function(a,b,c,d,e,f){"use strict";function a(a){return(b("isFacebookURI")(a)||b("isMessengerDotComURI")(a))&&a.getPath().startsWith("/groupcall")}e.exports=a}),null);
__d("RTCWebMediaStreamsTypedLogger",["Banzai","GeneratedLoggerUtils","nullthrows"],(function(a,b,c,d,e,f){"use strict";__p&&__p();a=function(){__p&&__p();function a(){this.$1={}}var c=a.prototype;c.log=function(){b("GeneratedLoggerUtils").log("logger:RTCWebMediaStreamsLoggerConfig",this.$1,b("Banzai").BASIC)};c.logVital=function(){b("GeneratedLoggerUtils").log("logger:RTCWebMediaStreamsLoggerConfig",this.$1,b("Banzai").VITAL)};c.logImmediately=function(){b("GeneratedLoggerUtils").log("logger:RTCWebMediaStreamsLoggerConfig",this.$1,{signal:!0})};c.clear=function(){this.$1={};return this};c.getData=function(){return babelHelpers["extends"]({},this.$1)};c.updateData=function(a){this.$1=babelHelpers["extends"]({},this.$1,a);return this};c.setBytes=function(a){this.$1.bytes=a;return this};c.setCallID=function(a){this.$1.call_id=a;return this};c.setCallType=function(a){this.$1.call_type=a;return this};c.setConferenceName=function(a){this.$1.conference_name=a;return this};c.setFrameHeight=function(a){this.$1.frame_height=a;return this};c.setFrameWidth=function(a){this.$1.frame_width=a;return this};c.setFrames=function(a){this.$1.frames=a;return this};c.setFramesPerSecond=function(a){this.$1.frames_per_second=a;return this};c.setIsLocal=function(a){this.$1.is_local=a;return this};c.setJitter=function(a){this.$1.jitter=a;return this};c.setJitterBufferDelay=function(a){this.$1.jitter_buffer_delay=a;return this};c.setPackets=function(a){this.$1.packets=a;return this};c.setPacketsLost=function(a){this.$1.packets_lost=a;return this};c.setQpSum=function(a){this.$1.qp_sum=a;return this};c.setRtt=function(a){this.$1.rtt=a;return this};c.setStreamID=function(a){this.$1.stream_id=a;return this};c.setStreamType=function(a){this.$1.stream_type=a;return this};c.setTime=function(a){this.$1.time=a;return this};c.setTimeElapsed=function(a){this.$1.time_elapsed=a;return this};c.setVC=function(a){this.$1.vc=a;return this};c.setWeight=function(a){this.$1.weight=a;return this};c.updateExtraData=function(a){a=b("nullthrows")(b("GeneratedLoggerUtils").serializeMap(a));b("GeneratedLoggerUtils").checkExtraDataFieldNames(a,g);this.$1=babelHelpers["extends"]({},this.$1,a);return this};c.addToExtraData=function(a,b){var c={};c[a]=b;return this.updateExtraData(c)};return a}();var g={bytes:!0,call_id:!0,call_type:!0,conference_name:!0,frame_height:!0,frame_width:!0,frames:!0,frames_per_second:!0,is_local:!0,jitter:!0,jitter_buffer_delay:!0,packets:!0,packets_lost:!0,qp_sum:!0,rtt:!0,stream_id:!0,stream_type:!0,time:!0,time_elapsed:!0,vc:!0,weight:!0};e.exports=a}),null);
/**
 * Copyright @ 2015 Atlassian Pty Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @nolint
 * @preserve-header
 * @preserve-whitespace
 */
__d("sdp-interop-array-equals",[],(function $module_sdp_interop_array_equals(global,require,requireDynamic,requireLazy,module,exports){

module.exports = function arrayEquals(array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (let i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!arrayEquals.apply(this[i], [array[i]]))
                return false;
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal:
            // {x:20} != {x:20}
            return false;
        }
    }
    return true;
};

/*  */}),null);
/**
 * Released under the MIT license. Copyright (c) 2013 Eirik Albrigtsen.
 *
 * @nolint
 * @preserve-header
 * @preserve-whitespace
 */
__d("sdp-transform-grammar",[],(function $module_sdp_transform_grammar(global,require,requireDynamic,requireLazy,module,exports){

var grammar = module.exports = {
  v: [{
    name: 'version',
    reg: /^(\d*)$/
  }],
  o: [{ //o=- 20518 0 IN IP4 203.0.113.1
    // NB: sessionId will be a String in most cases because it is huge
    name: 'origin',
    reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
    names: ['username', 'sessionId', 'sessionVersion', 'netType', 'ipVer', 'address'],
    format: '%s %s %d %s IP%d %s'
  }],
  // default parsing of these only (though some of these feel outdated)
  s: [{ name: 'name' }],
  i: [{ name: 'description' }],
  u: [{ name: 'uri' }],
  e: [{ name: 'email' }],
  p: [{ name: 'phone' }],
  z: [{ name: 'timezones' }], // TODO: this one can actually be parsed properly..
  r: [{ name: 'repeats' }],   // TODO: this one can also be parsed properly
  //k: [{}], // outdated thing ignored
  t: [{ //t=0 0
    name: 'timing',
    reg: /^(\d*) (\d*)/,
    names: ['start', 'stop'],
    format: '%d %d'
  }],
  c: [{ //c=IN IP4 10.47.197.26
    name: 'connection',
    reg: /^IN IP(\d) (\S*)/,
    names: ['version', 'ip'],
    format: 'IN IP%d %s'
  }],
  b: [{ //b=AS:4000
    push: 'bandwidth',
    reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
    names: ['type', 'limit'],
    format: '%s:%s'
  }],
  m: [{ //m=video 51744 RTP/AVP 126 97 98 34 31
    // NB: special - pushes to session
    // TODO: rtp/fmtp should be filtered by the payloads found here?
    reg: /^(\w*) (\d*) ([\w\/]*)(?: (.*))?/,
    names: ['type', 'port', 'protocol', 'payloads'],
    format: '%s %d %s %s'
  }],
  a: [
    { //a=rtpmap:110 opus/48000/2
      push: 'rtp',
      reg: /^rtpmap:(\d*) ([\w\-\.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
      names: ['payload', 'codec', 'rate', 'encoding'],
      format: function (o) {
        return (o.encoding) ?
          'rtpmap:%d %s/%s/%s':
          o.rate ?
          'rtpmap:%d %s/%s':
          'rtpmap:%d %s';
      }
    },
    { //a=fmtp:108 profile-level-id=24;object=23;bitrate=64000
      //a=fmtp:111 minptime=10; useinbandfec=1
      push: 'fmtp',
      reg: /^fmtp:(\d*) ([\S| ]*)/,
      names: ['payload', 'config'],
      format: 'fmtp:%d %s'
    },
    { //a=control:streamid=0
      name: 'control',
      reg: /^control:(.*)/,
      format: 'control:%s'
    },
    { //a=rtcp:65179 IN IP4 193.84.77.194
      name: 'rtcp',
      reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
      names: ['port', 'netType', 'ipVer', 'address'],
      format: function (o) {
        return (o.address != null) ?
          'rtcp:%d %s IP%d %s':
          'rtcp:%d';
      }
    },
    { //a=rtcp-fb:98 trr-int 100
      push: 'rtcpFbTrrInt',
      reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
      names: ['payload', 'value'],
      format: 'rtcp-fb:%d trr-int %d'
    },
    { //a=rtcp-fb:98 nack rpsi
      push: 'rtcpFb',
      reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
      names: ['payload', 'type', 'subtype'],
      format: function (o) {
        return (o.subtype != null) ?
          'rtcp-fb:%s %s %s':
          'rtcp-fb:%s %s';
      }
    },
    { //a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
      //a=extmap:1/recvonly URI-gps-string
      push: 'ext',
      reg: /^extmap:(\d+)(?:\/(\w+))? (\S*)(?: (\S*))?/,
      names: ['value', 'direction', 'uri', 'config'],
      format: function (o) {
        return 'extmap:%d' + (o.direction ? '/%s' : '%v') + ' %s' + (o.config ? ' %s' : '');
      }
    },
    { //a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:PS1uQCVeeCFCanVmcjkpPywjNWhcYD0mXXtxaVBR|2^20|1:32
      push: 'crypto',
      reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
      names: ['id', 'suite', 'config', 'sessionConfig'],
      format: function (o) {
        return (o.sessionConfig != null) ?
          'crypto:%d %s %s %s':
          'crypto:%d %s %s';
      }
    },
    { //a=setup:actpass
      name: 'setup',
      reg: /^setup:(\w*)/,
      format: 'setup:%s'
    },
    { //a=mid:1
      name: 'mid',
      reg: /^mid:([^\s]*)/,
      format: 'mid:%s'
    },
    { //a=msid:0c8b064d-d807-43b4-b434-f92a889d8587 98178685-d409-46e0-8e16-7ef0db0db64a
      name: 'msid',
      reg: /^msid:(.*)/,
      format: 'msid:%s'
    },
    { //a=ptime:20
      name: 'ptime',
      reg: /^ptime:(\d*)/,
      format: 'ptime:%d'
    },
    { //a=maxptime:60
      name: 'maxptime',
      reg: /^maxptime:(\d*)/,
      format: 'maxptime:%d'
    },
    { //a=sendrecv
      name: 'direction',
      reg: /^(sendrecv|recvonly|sendonly|inactive)/
    },
    { //a=ice-lite
      name: 'icelite',
      reg: /^(ice-lite)/
    },
    { //a=ice-ufrag:F7gI
      name: 'iceUfrag',
      reg: /^ice-ufrag:(\S*)/,
      format: 'ice-ufrag:%s'
    },
    { //a=ice-pwd:x9cml/YzichV2+XlhiMu8g
      name: 'icePwd',
      reg: /^ice-pwd:(\S*)/,
      format: 'ice-pwd:%s'
    },
    { //a=fingerprint:SHA-1 00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33
      name: 'fingerprint',
      reg: /^fingerprint:(\S*) (\S*)/,
      names: ['type', 'hash'],
      format: 'fingerprint:%s %s'
    },
    { //a=candidate:0 1 UDP 2113667327 203.0.113.1 54400 typ host
      //a=candidate:1162875081 1 udp 2113937151 192.168.34.75 60017 typ host generation 0 network-id 3 network-cost 10
      //a=candidate:3289912957 2 udp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 generation 0 network-id 3 network-cost 10
      //a=candidate:229815620 1 tcp 1518280447 192.168.150.19 60017 typ host tcptype active generation 0 network-id 3 network-cost 10
      //a=candidate:3289912957 2 tcp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 tcptype passive generation 0 network-id 3 network-cost 10
      push:'candidates',
      reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
      names: ['foundation', 'component', 'transport', 'priority', 'ip', 'port', 'type', 'raddr', 'rport', 'tcptype', 'generation', 'network-id', 'network-cost'],
      format: function (o) {
        var str = 'candidate:%s %d %s %d %s %d typ %s';

        str += (o.raddr != null) ? ' raddr %s rport %d' : '%v%v';

        // NB: candidate has three optional chunks, so %void middles one if it's missing
        str += (o.tcptype != null) ? ' tcptype %s' : '%v';

        if (o.generation != null) {
          str += ' generation %d';
        }

        str += (o['network-id'] != null) ? ' network-id %d' : '%v';
        str += (o['network-cost'] != null) ? ' network-cost %d' : '%v';
        return str;
      }
    },
    { //a=end-of-candidates (keep after the candidates line for readability)
      name: 'endOfCandidates',
      reg: /^(end-of-candidates)/
    },
    { //a=remote-candidates:1 203.0.113.1 54400 2 203.0.113.1 54401 ...
      name: 'remoteCandidates',
      reg: /^remote-candidates:(.*)/,
      format: 'remote-candidates:%s'
    },
    { //a=ice-options:google-ice
      name: 'iceOptions',
      reg: /^ice-options:(\S*)/,
      format: 'ice-options:%s'
    },
    { //a=ssrc:2566107569 cname:t9YU8M1UxTF8Y1A1
      push: 'ssrcs',
      reg: /^ssrc:(\d*) ([\w_]*)(?::(.*))?/,
      names: ['id', 'attribute', 'value'],
      format: function (o) {
        var str = 'ssrc:%d';
        if (o.attribute != null) {
          str += ' %s';
          if (o.value != null) {
            str += ':%s';
          }
        }
        return str;
      }
    },
    { //a=ssrc-group:FEC 1 2
      //a=ssrc-group:FEC-FR 3004364195 1080772241
      push: 'ssrcGroups',
      // token-char = %x21 / %x23-27 / %x2A-2B / %x2D-2E / %x30-39 / %x41-5A / %x5E-7E
      reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
      names: ['semantics', 'ssrcs'],
      format: 'ssrc-group:%s %s'
    },
    { //a=msid-semantic: WMS Jvlam5X3SX1OP6pn20zWogvaKJz5Hjf9OnlV
      name: 'msidSemantic',
      reg: /^msid-semantic:\s?(\w*) (\S*)/,
      names: ['semantic', 'token'],
      format: 'msid-semantic: %s %s' // space after ':' is not accidental
    },
    { //a=group:BUNDLE audio video
      push: 'groups',
      reg: /^group:(\w*) (.*)/,
      names: ['type', 'mids'],
      format: 'group:%s %s'
    },
    { //a=rtcp-mux
      name: 'rtcpMux',
      reg: /^(rtcp-mux)/
    },
    { //a=rtcp-rsize
      name: 'rtcpRsize',
      reg: /^(rtcp-rsize)/
    },
    { //a=sctpmap:5000 webrtc-datachannel 1024
      name: 'sctpmap',
      reg: /^sctpmap:([\w_\/]*) (\S*)(?: (\S*))?/,
      names: ['sctpmapNumber', 'app', 'maxMessageSize'],
      format: function (o) {
        return (o.maxMessageSize != null) ?
          'sctpmap:%s %s %s' :
          'sctpmap:%s %s';
      }
    },
    { //a=x-google-flag:conference
      name: 'xGoogleFlag',
      reg: /^x-google-flag:([^\s]*)/,
      format: 'x-google-flag:%s'
    },
    { //a=rid:1 send max-width=1280;max-height=720;max-fps=30;depend=0
      push: 'rids',
      reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
      names: ['id', 'direction', 'params'],
      format: function (o) {
        return (o.params) ? 'rid:%s %s %s' : 'rid:%s %s';
      }
    },
    { //a=imageattr:97 send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320] recv [x=330,y=250]
      //a=imageattr:* send [x=800,y=640] recv *
      //a=imageattr:100 recv [x=320,y=240]
      push: 'imageattrs',
      reg: new RegExp(
        //a=imageattr:97
        '^imageattr:(\\d+|\\*)' +
        //send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320]
        '[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)' +
        //recv [x=330,y=250]
        '(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?'
      ),
      names: ['pt', 'dir1', 'attrs1', 'dir2', 'attrs2'],
      format: function (o) {
        return 'imageattr:%s %s %s' + (o.dir2 ? ' %s %s' : '');
      }
    },
    { //a=simulcast:send 1,2,3;~4,~5 recv 6;~7,~8
      //a=simulcast:recv 1;4,5 send 6;7
      name: 'simulcast',
      reg: new RegExp(
        //a=simulcast:
        '^simulcast:' +
        //send 1,2,3;~4,~5
        '(send|recv) ([a-zA-Z0-9\\-_~;,]+)' +
        //space + recv 6;~7,~8
        '(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?' +
        //end
        '$'
      ),
      names: ['dir1', 'list1', 'dir2', 'list2'],
      format: function (o) {
        return 'simulcast:%s %s' + (o.dir2 ? ' %s %s' : '');
      }
    },
    { //Old simulcast draft 03 (implemented by Firefox)
      //  https://tools.ietf.org/html/draft-ietf-mmusic-sdp-simulcast-03
      //a=simulcast: recv pt=97;98 send pt=97
      //a=simulcast: send rid=5;6;7 paused=6,7
      name: 'simulcast_03',
      reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
      names: ['value'],
      format: 'simulcast: %s'
    },
    {
      //a=framerate:25
      //a=framerate:29.97
      name: 'framerate',
      reg: /^framerate:(\d+(?:$|\.\d+))/,
      format: 'framerate:%s'
    },
    { // any a= that we don't understand is kepts verbatim on media.invalid
      push: 'invalid',
      names: ['value']
    }
  ]
};

// set sensible defaults to avoid polluting the grammar with boring details
Object.keys(grammar).forEach(function (key) {
  var objs = grammar[key];
  objs.forEach(function (obj) {
    if (!obj.reg) {
      obj.reg = /(.*)/;
    }
    if (!obj.format) {
      obj.format = '%s';
    }
  });
});

/*  */}),null);
/**
 * Released under the MIT license. Copyright (c) 2013 Eirik Albrigtsen.
 *
 * @nolint
 * @preserve-header
 * @preserve-whitespace
 */
__d("sdp-transform-parser",["sdp-transform-grammar"],(function $module_sdp_transform_parser(global,require,requireDynamic,requireLazy,module,exports){

var toIntIfInt = function (v) {
  return String(Number(v)) === v ? Number(v) : v;
};

var attachProperties = function (match, location, names, rawName) {
  if (rawName && !names) {
    location[rawName] = toIntIfInt(match[1]);
  }
  else {
    for (var i = 0; i < names.length; i += 1) {
      if (match[i+1] != null) {
        location[names[i]] = toIntIfInt(match[i+1]);
      }
    }
  }
};

var parseReg = function (obj, location, content) {
  var needsBlank = obj.name && obj.names;
  if (obj.push && !location[obj.push]) {
    location[obj.push] = [];
  }
  else if (needsBlank && !location[obj.name]) {
    location[obj.name] = {};
  }
  var keyLocation = obj.push ?
    {} :  // blank object that will be pushed
    needsBlank ? location[obj.name] : location; // otherwise, named location or root

  attachProperties(content.match(obj.reg), keyLocation, obj.names, obj.name);

  if (obj.push) {
    location[obj.push].push(keyLocation);
  }
};

var grammar = require('sdp-transform-grammar');
var validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);

exports.parse = function (sdp) {
  var session = {}
    , media = []
    , location = session; // points at where properties go under (one of the above)

  // parse lines we understand
  sdp.split(/(\r\n|\r|\n)/).filter(validLine).forEach(function (l) {
    var type = l[0];
    var content = l.slice(2);
    if (type === 'm') {
      media.push({rtp: [], fmtp: []});
      location = media[media.length-1]; // point at latest media line
    }

    for (var j = 0; j < (grammar[type] || []).length; j += 1) {
      var obj = grammar[type][j];
      if (obj.reg.test(content)) {
        return parseReg(obj, location, content);
      }
    }
  });

  session.media = media; // link it up
  return session;
};

var paramReducer = function (acc, expr) {
  var s = expr.split(/=(.+)/, 2);
  if (s.length === 2) {
    acc[s[0]] = toIntIfInt(s[1]);
  }
  return acc;
};

exports.parseParams = function (str) {
  return str.split(/\;\s?/).reduce(paramReducer, {});
};

// For backward compatibility - alias will be removed in 3.0.0
exports.parseFmtpConfig = exports.parseParams;

exports.parsePayloads = function (str) {
  return str.split(' ').map(Number);
};

exports.parseRemoteCandidates = function (str) {
  var candidates = [];
  var parts = str.split(' ').map(toIntIfInt);
  for (var i = 0; i < parts.length; i += 3) {
    candidates.push({
      component: parts[i],
      ip: parts[i + 1],
      port: parts[i + 2]
    });
  }
  return candidates;
};

exports.parseImageAttributes = function (str) {
  return str.split(' ').map(function (item) {
    return item.substring(1, item.length-1).split(',').reduce(paramReducer, {});
  });
};

exports.parseSimulcastStreamList = function (str) {
  return str.split(';').map(function (stream) {
    return stream.split(',').map(function (format) {
      var scid, paused = false;

      if (format[0] !== '~') {
        scid = toIntIfInt(format);
      } else {
        scid = toIntIfInt(format.substring(1, format.length));
        paused = true;
      }

      return {
        scid: scid,
        paused: paused
      };
    });
  });
};

/*  */}),null);
/**
 * Released under the MIT license. Copyright (c) 2013 Eirik Albrigtsen.
 *
 * @nolint
 * @preserve-header
 * @preserve-whitespace
 */
__d("sdp-transform-writer",["sdp-transform-grammar"],(function $module_sdp_transform_writer(global,require,requireDynamic,requireLazy,module,exports){

var grammar = require('sdp-transform-grammar');

// customized util.format - discards excess arguments and can void middle ones
var formatRegExp = /%[sdv%]/g;
var format = function (formatStr) {
  var i = 1;
  var args = arguments;
  var len = args.length;
  return formatStr.replace(formatRegExp, function (x) {
    if (i >= len) {
      return x; // missing argument
    }
    var arg = args[i];
    i += 1;
    switch (x) {
    case '%%':
      return '%';
    case '%s':
      return String(arg);
    case '%d':
      return Number(arg);
    case '%v':
      return '';
    }
  });
  // NB: we discard excess arguments - they are typically undefined from makeLine
};

var makeLine = function (type, obj, location) {
  var str = obj.format instanceof Function ?
    (obj.format(obj.push ? location : location[obj.name])) :
    obj.format;

  var args = [type + '=' + str];
  if (obj.names) {
    for (var i = 0; i < obj.names.length; i += 1) {
      var n = obj.names[i];
      if (obj.name) {
        args.push(location[obj.name][n]);
      }
      else { // for mLine and push attributes
        args.push(location[obj.names[i]]);
      }
    }
  }
  else {
    args.push(location[obj.name]);
  }
  return format.apply(null, args);
};

// RFC specified order
// TODO: extend this with all the rest
var defaultOuterOrder = [
  'v', 'o', 's', 'i',
  'u', 'e', 'p', 'c',
  'b', 't', 'r', 'z', 'a'
];
var defaultInnerOrder = ['i', 'c', 'b', 'a'];


module.exports = function (session, opts) {
  opts = opts || {};
  // ensure certain properties exist
  if (session.version == null) {
    session.version = 0; // 'v=0' must be there (only defined version atm)
  }
  if (session.name == null) {
    session.name = ' '; // 's= ' must be there if no meaningful name set
  }
  session.media.forEach(function (mLine) {
    if (mLine.payloads == null) {
      mLine.payloads = '';
    }
  });

  var outerOrder = opts.outerOrder || defaultOuterOrder;
  var innerOrder = opts.innerOrder || defaultInnerOrder;
  var sdp = [];

  // loop through outerOrder for matching properties on session
  outerOrder.forEach(function (type) {
    grammar[type].forEach(function (obj) {
      if (obj.name in session && session[obj.name] != null) {
        sdp.push(makeLine(type, obj, session));
      }
      else if (obj.push in session && session[obj.push] != null) {
        session[obj.push].forEach(function (el) {
          sdp.push(makeLine(type, obj, el));
        });
      }
    });
  });

  // then for each media line, follow the innerOrder
  session.media.forEach(function (mLine) {
    sdp.push(makeLine('m', grammar.m[0], mLine));

    innerOrder.forEach(function (type) {
      grammar[type].forEach(function (obj) {
        if (obj.name in mLine && mLine[obj.name] != null) {
          sdp.push(makeLine(type, obj, mLine));
        }
        else if (obj.push in mLine && mLine[obj.push] != null) {
          mLine[obj.push].forEach(function (el) {
            sdp.push(makeLine(type, obj, el));
          });
        }
      });
    });
  });

  return sdp.join('\r\n') + '\r\n';
};

/*  */}),null);
/**
 * Released under the MIT license. Copyright (c) 2013 Eirik Albrigtsen.
 *
 * @nolint
 * @preserve-header
 * @preserve-whitespace
 */
__d("sdp-transform",["sdp-transform-parser","sdp-transform-writer"],(function $module_sdp_transform(global,require,requireDynamic,requireLazy,module,exports){

var parser = require('sdp-transform-parser');
var writer = require('sdp-transform-writer');

exports.write = writer;
exports.parse = parser.parse;
exports.parseFmtpConfig = parser.parseFmtpConfig;
exports.parseParams = parser.parseParams;
exports.parsePayloads = parser.parsePayloads;
exports.parseRemoteCandidates = parser.parseRemoteCandidates;
exports.parseImageAttributes = parser.parseImageAttributes;
exports.parseSimulcastStreamList = parser.parseSimulcastStreamList;

/*  */}),null);
/**
 * Copyright @ 2015 Atlassian Pty Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @nolint
 * @preserve-header
 * @preserve-whitespace
 */
__d("sdp-interop-transform",["sdp-transform"],(function $module_sdp_interop_transform(global,require,requireDynamic,requireLazy,module,exports){

const transform = require('sdp-transform');

exports.write = function(session, opts) {

  if (typeof session !== 'undefined' &&
      typeof session.media !== 'undefined' &&
      Array.isArray(session.media)) {

    session.media.forEach(function (mLine) {
      // expand sources to ssrcs
      if (typeof mLine.sources !== 'undefined' &&
        Object.keys(mLine.sources).length !== 0) {
          mLine.ssrcs = [];
          Object.keys(mLine.sources).forEach(function (ssrc) {
            const source = mLine.sources[ssrc];
            Object.keys(source).forEach(function (attribute) {
              mLine.ssrcs.push({
                id: ssrc,
                attribute: attribute,
                value: source[attribute]
              });
            });
          });
          delete mLine.sources;
        }

      // join ssrcs in ssrc groups
      if (typeof mLine.ssrcGroups !== 'undefined' &&
        Array.isArray(mLine.ssrcGroups)) {
          mLine.ssrcGroups.forEach(function (ssrcGroup) {
            if (typeof ssrcGroup.ssrcs !== 'undefined' &&
                Array.isArray(ssrcGroup.ssrcs)) {
              ssrcGroup.ssrcs = ssrcGroup.ssrcs.join(' ');
            }
          });
        }
    });
  }

  // join group mids
  if (typeof session !== 'undefined' &&
      typeof session.groups !== 'undefined' && Array.isArray(session.groups)) {

    session.groups.forEach(function (g) {
      if (typeof g.mids !== 'undefined' && Array.isArray(g.mids)) {
        g.mids = g.mids.join(' ');
      }
    });
  }

  return transform.write(session, opts);
};

exports.parse = function(sdp) {
  const session = transform.parse(sdp);

  if (typeof session !== 'undefined' && typeof session.media !== 'undefined' &&
      Array.isArray(session.media)) {

    session.media.forEach(function (mLine) {
      // group sources attributes by ssrc
      if (typeof mLine.ssrcs !== 'undefined' && Array.isArray(mLine.ssrcs)) {
        mLine.sources = {};
        mLine.ssrcs.forEach(function (ssrc) {
          if (!mLine.sources[ssrc.id])
          mLine.sources[ssrc.id] = {};
        mLine.sources[ssrc.id][ssrc.attribute] = ssrc.value;
        });

        delete mLine.ssrcs;
      }

      // split ssrcs in ssrc groups
      if (typeof mLine.ssrcGroups !== 'undefined' &&
        Array.isArray(mLine.ssrcGroups)) {
          mLine.ssrcGroups.forEach(function (ssrcGroup) {
            if (typeof ssrcGroup.ssrcs === 'string') {
              ssrcGroup.ssrcs = ssrcGroup.ssrcs.split(' ');
            }
          });
        }
    });
  }
  // split group mids
  if (typeof session !== 'undefined' &&
      typeof session.groups !== 'undefined' && Array.isArray(session.groups)) {

    session.groups.forEach(function (g) {
      if (typeof g.mids === 'string') {
        g.mids = g.mids.split(' ');
      }
    });
  }

  return session;
};

/*  */}),null);
__d("assignMediaStream",[],(function(a,b,c,d,e,f){"use strict";var g=window.URL||window.webkitURL,h="srcObject"in window.HTMLMediaElement.prototype,i="mozSrcObject"in window.HTMLMediaElement.prototype;function a(a,b){h?a.srcObject=b:i?a.mozSrcObject=b:(typeof a.src==="string"&&g.revokeObjectURL(a.src),a.src=b!=null?g.createObjectURL(b):"")}e.exports=a}),null);
__d("memoizeLastByArgs",["MemoizationInstrumentation","shallowArrayEqual"],(function(a,b,c,d,e,f){"use strict";__p&&__p();function a(a,c){__p&&__p();var d=c||a.name||"unknown",f=null;c=function(){__p&&__p();for(var c=arguments.length,g=new Array(c),h=0;h<c;h++)g[h]=arguments[h];var i=b("MemoizationInstrumentation").onFunctionCall(e.id,d),j=!0;if(!(f!=null&&b("shallowArrayEqual")(g,f.args))){j=!1;var k=a.apply(void 0,g);f==null?f={args:g,ret:k}:(f.args=g,f.ret=k)}i&&i(j);return f.ret};return c}e.exports=a}),null);
__d("RTCCallActionTypes",[],(function(a,b,c,d,e,f){e.exports=Object.freeze({CALL:"CALL",CALL_SUCCESS:"CALL_SUCCESS",CALL_ERROR:"CALL_ERROR",INCOMING_CALL_SUCCESS:"INCOMING_CALL_SUCCESS",INIT:"INIT",RESET:"RESET",RESET_FOR_REDIAL:"RESET_FOR_REDIAL",CALL_COLLISION:"CALL_COLLISION",WAIT_FOR_USER_INPUT:"WAIT_FOR_USER_INPUT",SET_CALL_SUMMARY:"SET_CALL_SUMMARY",SET_MW_CALL_TYPE:"SET_MW_CALL_TYPE",SET_LAYOUT:"SET_LAYOUT",SET_LINKHASH:"SET_LINKHASH",SET_DOMINANT_SPEAKER:"SET_DOMINANT_SPEAKER",SET_PINNED_SPEAKER:"SET_PINNED_SPEAKER",SET_USE_DOMINANT_SPEAKE_VIEW:"SET_USE_DOMINANT_SPEAKE_VIEW",SET_GRID_VIEW:"SET_GRID_VIEW",SET_STRIP_VIEW:"SET_STRIP_VIEW",INIT_THREAD:"INIT_THREAD",ON_PARTICIPANT_LEFT:"ON_PARTICIPANT_LEFT",ON_PARTICIPANTS_ADDED:"ON_PARTICIPANTS_ADDED",ADD_PARTICIPANTS_TO_RING:"ADD_PARTICIPANTS_TO_RING",JOIN:"JOIN",JOIN_SUCCESS:"JOIN_SUCCESS",JOIN_ERROR:"JOIN_ERROR",HANGUP:"HANGUP",HANGUP_SUCCESS:"HANGUP_SUCCESS",HANGUP_ERROR:"HANGUP_ERROR",ON_CONFERENCE_STATE:"ON_CONFERENCE_STATE",DISMISS:"DISMISS",END_CALL:"END_CALL",ON_JOIN_REQUEST_SENT:"ON_JOIN_REQUEST_SENT",ON_JOIN_RESPONSE:"ON_JOIN_RESPONSE",ON_RECEIVED_JOIN_RESPONSE:"ON_RECEIVED_JOIN_RESPONSE",ON_PROCESSED_JOIN_RESPONSE:"ON_PROCESSED_JOIN_RESPONSE",ON_SERVER_MEDIA_UPDATE_SUCCESS:"ON_SERVER_MEDIA_UPDATE_SUCCESS",ON_CLIENT_MEDIA_UPDATE_RESPONSE:"ON_CLIENT_MEDIA_UPDATE_RESPONSE",SET_LOCAL_CLIENT_VERSION:"SET_LOCAL_CLIENT_VERSION",INIT_LOCAL_USER:"INIT_LOCAL_USER",INIT_REMOTE_USERS:"INIT_REMOTE_USERS",UPDATE_REMOTE_USERS:"UPDATE_REMOTE_USERS",ADD_REMOTE_STREAM:"ADD_REMOTE_STREAM",REMOVE_REMOTE_STREAM:"REMOVE_REMOTE_STREAM",REMOVE_ALL_REMOTE_STREAMS:"REMOVE_ALL_REMOTE_STREAMS",ADD_REMOTE_TRACK:"ADD_REMOTE_TRACK",REMOVE_REMOTE_TRACK:"REMOVE_REMOTE_TRACK",AUDIO_MUTED:"AUDIO_MUTED",AUDIO_UNMUTED:"AUDIO_UNMUTED",VIDEO_MUTED:"VIDEO_MUTED",VIDEO_UNMUTED:"VIDEO_UNMUTED",REMOTE_AUDIO_MUTED:"REMOTE_AUDIO_MUTED",REMOTE_AUDIO_UNMUTED:"REMOTE_AUDIO_UNMUTED",REMOTE_VIDEO_MUTED:"REMOTE_VIDEO_MUTED",REMOTE_VIDEO_UNMUTED:"REMOTE_VIDEO_UNMUTED",SELF_VIEW_COLLAPSED:"SELF_VIEW_COLLAPSED",SELF_VIEW_UNCOLLAPSED:"SELF_VIEW_UNCOLLAPSED",ADD_LOCAL_STREAM:"ADD_LOCAL_STREAM",REMOVE_LOCAL_STREAM:"REMOVE_LOCAL_STREAM",REPLACE_LOCAL_STREAM:"REPLACE_LOCAL_STREAM",REMOVE_ALL_LOCAL_STREAMS:"REMOVE_ALL_LOCAL_STREAMS",STOP_LOCAL_STREAM:"STOP_LOCAL_STREAM",ADD_LOCAL_SCREEN_STREAM:"ADD_LOCAL_SCREEN_STREAM",REMOVE_LOCAL_SCREEN_STREAM:"REMOVE_LOCAL_SCREEN_STREAM",REMOVE_ALL_LOCAL_SCREEN_STREAMS:"REMOVE_ALL_LOCAL_SCREEN_STREAMS",REPLACE_LOCAL_SCREEN_STREAM:"REPLACE_LOCAL_SCREEN_STREAM",ADD_REMOTE_SCREEN_STREAM:"ADD_REMOTE_SCREEN_STREAM",REMOVE_REMOTE_SCREEN_STREAM:"REMOVE_REMOTE_SCREEN_STREAM",TOGGLE_REMOTE_STREAM:"TOGGLE_REMOTE_STREAM",SUBMIT_RATING:"SUBMIT_RATING",SUBMIT_FEEDBACK:"SUBMIT_FEEDBACK",SUBMIT_FEEDBACK_OPTIONS:"SUBMIT_FEEDBACK_OPTIONS",SUBMIT_SURVEY_CHOICE:"SUBMIT_SURVEY_CHOICE",RATING_SHOWN:"RATING_SHOWN",FEEDBACK_SHOWN:"FEEDBACK_SHOWN",SET_CONFERENCE_STATE:"SET_CONFERENCE_STATE",SET_END_CALL_REASON:"SET_END_CALL_REASON",FLOOR_STATUS:"FLOOR_STATUS"})}),null);
__d("RTCGroupCallEscalationActionTypes",[],(function(a,b,c,d,e,f){e.exports=Object.freeze({GROUP_ESCALATION_START:"GROUP_ESCALATION_START",GROUP_ESCALATION_SUCCESS:"GROUP_ESCALATION_SUCCESS",GROUP_ESCALATION_CANCEL:"GROUP_ESCALATION_CANCEL",GROUP_ESCALATION_SET_USERS_TO_RING:"GROUP_ESCALATION_SET_USERS_TO_RING",GROUP_ESCALATION_CLEAR_P2P_CONNECTION:"GROUP_ESCALATION_CLEAR_P2P_CONNECTION",GROUP_ESCALATION_SET_P2P_CALLSUMMARY:"GROUP_ESCALATION_SET_P2P_CALLSUMMARY",GROUP_ESCALATION_ADD_LOCAL_STREAM:"GROUP_ESCALATION_ADD_LOCAL_STREAM"})}),null);
__d("XCollabCallSendMessageController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/collab/sendmessage/",{recipient_id:{type:"Int",required:!0},msg_id:{type:"Int",required:!0},message_info:{type:"String",required:!0},webrtc_fbtrace:{type:"Int"}})}),null);
__d("XGroupCallController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/groupcall/{?call_context}/",{call_context:{type:"String",required:!0},call_id:{type:"Int"},users_to_ring:{type:"FBIDSet",defaultValue:[]},has_video:{type:"Bool",defaultValue:!0},initialize_video:{type:"Bool",defaultValue:!0},server_info_data:{type:"String"},nonce:{type:"String"},multiway_www_tier:{type:"String"},multiway_core_tier:{type:"String"}})}),null);
__d("XGroupCallSendMessageController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/groupcall/sendmessage/",{webrtc_fbtrace:{type:"Int"}})}),null);
__d("XGroupCallSendRequestController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/groupcall/sendrequest/",{webrtc_fbtrace:{type:"Int"}})}),null);
__d("XGroupCallSigningController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/groupcall/init/",{call_context:{type:"String",required:!0},call_id:{type:"Int"},users_to_ring:{type:"FBIDSet",defaultValue:[]},has_video:{type:"Bool",defaultValue:!1},initialize_video:{type:"Bool",defaultValue:!1},server_info_data:{type:"String"},nonce:{type:"String"},multiway_www_tier:{type:"String"},multiway_core_tier:{type:"String"}})}),null);
__d("XRTCCallNUXController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/rtc/call/nuxstatus/",{})}),null);
__d("XScreenSharingController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/videocall/screen_sharing/",{peer_id:{type:"FBID",required:!0},version:{type:"Int"}})}),null);
__d("XVideoCallAdminMessageController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/videocall/admin_msg/",{})}),null);
__d("XVideoCallController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/videocall/incall/",{peer_id:{type:"FBID",required:!0},call_id:{type:"Int"},is_caller:{type:"Bool",defaultValue:!1},audio_only:{type:"Bool",defaultValue:!1},nonce:{type:"String"},meeting_id:{type:"Int"},meeting_pass:{type:"String"},initialize_video:{type:"Bool",defaultValue:!0}})}),null);
__d("XVideoCallSendMessageController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/videocall/sendmessage/",{recipient_id:{type:"Int",required:!0},msg_id:{type:"Int",required:!0},message_info:{type:"String",required:!0},webrtc_fbtrace:{type:"Int"}})}),null);
__d("XVideoCallSigningController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/videocall/init/",{peer_id:{type:"FBID",required:!0},call_id:{type:"Int"},is_caller:{type:"Bool",defaultValue:!1},audio_only:{type:"Bool",defaultValue:!1},nonce:{type:"String"},meeting_id:{type:"Int"},meeting_pass:{type:"String"},initialize_video:{type:"Bool",defaultValue:!0}})}),null);
__d("XVideoCallTurnDiscoveryController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/videocall/turndiscovery/",{version:{type:"Int",required:!0},call_id:{type:"String"}})}),null);
__d("XWirelessScreenSharingController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/screen_sharing/{?session_id}/",{nonce:{type:"String"},peer_id:{type:"FBID",required:!0},session_id:{type:"Int"}})}),null);