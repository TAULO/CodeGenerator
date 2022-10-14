/*
****************************************************
	exproto.js 수정내역 
****************************************************
| Version		 작성자		  수정일		  변경사항 
 ---------		-------		---------	---------- 
| v2.1.0.2      강남준			2016.12.21    
| v2.1.0.1		강남준		    2016.10.06	

****************************************************

*/
/*
	CrossEX Protocol Javascript Library
	iniLINE Co.,Ltd.
	%VERSIONINFO%
*/

/*
 * TOUCHENEX_CONST Define
 */

var TOUCHENEX_CONST = {
	"debug"			: false,	// console.log 출력 여부
	"debugAlert"	: false,	// exproto에서 발생하는 알림 여부
	"exEXObjName"	: "TOUCHENEX",	// _EX명
	"frameName"		: "",
	"browserInfo"	: "",
	"OSInfo"		: "",
	"pluginInfo"	: [],
	"extabid"		: "",
	"pluginCount"	: 0,
	"isInstalled"	: false,
	"tmpExtArr"		: [],
	"json2Path"		: keysharpnxBaseDir + "/nxCR/common/json2.js",
	"blankPath"		: keysharpnxBaseDir + "/nxCR/common/blank.html"
};

// IE 8 under JSON Object Set
if (typeof JSON !== "object" || navigator.userAgent.match(/msie 8/i)) {
	try {
		JSON = {};
		document.write("<script type='text/javascript' src='" + keysharpnxBaseDir + "/nxCR/common/json2.js'></script>");
	} catch(e) {
		alert("json2.js load error");
	}
}

/* 
 * TOUCHENEX Loading
 */
var TOUCHENEX_LOADING = function( callback ){
	if(TOUCHENEX_CONST.pluginInfo.length <= 0){
		alert("플러그인 체크를 실행하십시오.");
		return;
	} else {
		if(TOUCHENEX_CHECK.chkInfoStatus.status){
			var chk = true;
			for(var i = 0; i < TOUCHENEX_CONST.pluginInfo.length; i++){
				var pluginInfo = TOUCHENEX_CONST.pluginInfo[i];
				try {
					eval(pluginInfo.exPluginName + " = new " + TOUCHENEX_CONST.exEXObjName + "_EX(pluginInfo);");
					exlog("_LOADING", pluginInfo.exPluginName + " = new " + TOUCHENEX_CONST.exEXObjName + "_EX(" + pluginInfo.exPluginInfo + ");");
					exlog("_LOADING." + pluginInfo.exPluginName, eval(pluginInfo.exPluginName));
				} catch (e) {
					exlog("_LOADING [exception]", e);
					//exalert("_LOADING [exception]", pluginInfo.exPluginName + "초기화에 실패하였습니다.");
					exalert("_LOADING [exception]", e);
					chk = false;
					break;
				}
			}
			TOUCHENEX_CONST.isInstalled = chk;
			
			if(callback) {
				if(TOUCHENEX_UTIL.typeEX() && window.location.protocol == "https:"){
					var cbTimeout = 100;
					setTimeout(function(){eval(callback)(chk);}, cbTimeout);
				} else {
					eval(callback)(chk);
				}
			}

		} else {
			alert("플러그인이 모두 설치되지 않았습니다.");
			if(callback) eval(callback)(false);
		}
	}
};

/* 
 * CrossEX InstallCheck
 */
var TOUCHENEX_CHECK = {
	
	chkCallback : "",
	chkInfoStatus : {"status":false, info:[]},
	chkCurrPluginCnt : 0,

	check : function( pluginInfoArr, callback ){
		
		// TOUCHENEX_CONST Initialize
		TOUCHENEX_CONST.frameName = TOUCHENEX_UTIL.findPath(self);
		TOUCHENEX_CONST.OSInfo = TOUCHENEX_UTIL.getOSInfo();
		TOUCHENEX_CONST.browserInfo = TOUCHENEX_UTIL.getBrowserInfo();
		exlog("_CONST.frameName", TOUCHENEX_CONST.frameName);
		exlog("_CONST.OSInfo", TOUCHENEX_CONST.OSInfo);
		exlog("_CONST.browserInfo", TOUCHENEX_CONST.browserInfo);

		// generate IE tab id
		if(!TOUCHENEX_CONST.extabid && (TOUCHENEX_UTIL.typeEX() || TOUCHENEX_UTIL.typePlugin())){
			TOUCHENEX_CONST.extabid = TOUCHENEX_UTIL.createId();
		}
		
		exlog("_CHECK.check", pluginInfoArr);
		this.chkInfoStatus = {"status":false, info:[]};
		this.chkCurrPluginCnt = 0;
		
		if(pluginInfoArr && pluginInfoArr.length > 0){
			var infoCnt = pluginInfoArr.length;
			TOUCHENEX_CONST.pluginInfo = [];
			
			for(var i = 0; i < infoCnt; i++){
				TOUCHENEX_CONST.pluginInfo.push(pluginInfoArr[i]);
				var tmpInfo = {"name":pluginInfoArr[i].exPluginName};
				if(TOUCHENEX_UTIL.typeExtension()){
					tmpInfo.extension = false;
				}
				tmpInfo.EX = false;
				tmpInfo.client = false;
				tmpInfo.daemonVer = "";
				tmpInfo.daemon = "";
				this.chkInfoStatus.info.push(tmpInfo);
				
				// check spec
				if(pluginInfoArr[i].checkSpec){
					// check OS
					if(!TOUCHENEX_UTIL.chkOS(TOUCHENEX_CONST.OSInfo, pluginInfoArr[i].reqSpec.OS)){
						exlog("_CHECK.check", "not support OS");
						if(pluginInfoArr[i].exErrSpec) eval(pluginInfoArr[i].exErrSpec)('OS', pluginInfoArr[i].reqSpec.OS);
						return;
					}
					// check Browser
					if(!TOUCHENEX_UTIL.chkBrowser(TOUCHENEX_CONST.browserInfo, pluginInfoArr[i].reqSpec.Browser)){
						exlog("_CHECK.check", "not support Browser");
						if(pluginInfoArr[i].exErrSpec) eval(pluginInfoArr[i].exErrSpec)('BROWSER', pluginInfoArr[i].reqSpec.Browser);
						return;
					}
				}
			}
		} else {
			if(TOUCHENEX_CONST.pluginInfo.length <= 0){
				alert("플러그인 정보가 필요합니다.");
				return;
			}
		}
		
		if(callback){
			this.chkCallback = callback;
		} else {
			alert("콜백이 필요합니다.");
			return;
		}
		
		TOUCHENEX_CONST.pluginCount = TOUCHENEX_CONST.pluginInfo.length;
		exlog("_CONST.pluginInfo", TOUCHENEX_CONST.pluginInfo);
		exlog("_CONST.pluginCount", TOUCHENEX_CONST.pluginCount);
		
		// generate exDiv
		TOUCHENEX_UTIL.chkCrossEXDiv(TOUCHENEX_CONST);
		
		this.moduleCheck(0);
	},
	
	moduleCheck : function( currPluginCnt ) {
		
		this.chkCurrPluginCnt = currPluginCnt;
		
		if(currPluginCnt >= TOUCHENEX_CONST.pluginCount){
			var chk = true;
			for(var i=0; i<TOUCHENEX_CONST.pluginCount; i++){
				var currInstalled = true;
				var currStatus = this.chkInfoStatus.info[i];
				if(TOUCHENEX_UTIL.typeExtension()){
					if(!currStatus.extension){
						chk = false;
						currInstalled = false;
					}
				}
				if(!currStatus.EX){
					chk = false;
					currInstalled = false;
				}
				if(!currStatus.client){
					chk = false;
					currInstalled = false;
				}
				currStatus.isInstalled = currInstalled;
			}
			this.chkInfoStatus.status = chk;
			exlog("_CHECK.moduleCheck.chkInfoStatus", this.chkInfoStatus);
			eval(TOUCHENEX_CHECK.chkCallback)(this.chkInfoStatus);
			return;
		}
		
		var pluginInfo = TOUCHENEX_CONST.pluginInfo[currPluginCnt];
		//exlog("_CHECK.moduleCheck.currPluginCnt", currPluginCnt);
		
		if(TOUCHENEX_UTIL.typeEX()){
			
			var checkCallback = "TOUCHENEX_CHECK.EXVersionCheck";
			var url = pluginInfo.exProtocolName + "://" + location.host + "/GetVersions";
			url += "?callback=" + checkCallback;
			url += "&m=" + pluginInfo.exModuleName;
			url += "&tabid=" + TOUCHENEX_CONST.extabid;
			url += "&hostid=" + encodeURIComponent(location.host);
			url += "&lic=" + encodeURIComponent(pluginInfo.lic);
			
			// iframe 선언이 document.write인 경우에 한하여 i=1 값을 추가한다.
			if(window.location.protocol == "https:") url += "&i=1&s=1";
		
			
			// getVersion을 재실행시에 n값을 전송
			if(TOUCHENEX_CONST.isInstalled){
				url += "&n=true";
			}
			exlog("_CHECK.moduleCheck.url", url);
			this.loadScript(url);
			
		} else if(TOUCHENEX_UTIL.typeExtension()){
			
			var nativecall;
			try {
				nativecall = eval(pluginInfo.exExtHeader + "_nativecall");
			} catch (e) {}
			
			var url = {"cmd":"init", "exfunc":"get_extension_version", "callback":""};
			exlog("_CHECK.moduleCheck.nativecall.param", url);
			if(typeof nativecall == 'function') {
				nativecall(url, function(version) {
					TOUCHENEX_CHECK.extensionVersionCheck(version);
				});
			} else {
				exlog("_CHECK.moduleCheck.nativecall","nativecall retry");
				setTimeout(function(){
					try {
						nativecall = eval(pluginInfo.exExtHeader + "_nativecall");
					} catch (e) {}
					if(typeof nativecall == 'function') {
						nativecall(url, function(version) {
							TOUCHENEX_CHECK.extensionVersionCheck(version);
						});						
					} else {
						exlog("_CHECK.moduleCheck.nativecall [exception]","extension not load");
						try{
							TOUCHENEX_CHECK.extensionVersionCheck("-1");
						}catch(e) {
							exlog("_CHECK.moduleCheck.nativecall [exception]","extensionVersionCheck('-1')");
						}
					}
				}, 300);
			}
			
		} else if(TOUCHENEX_UTIL.typePlugin()) {
			
			navigator.plugins.refresh(false);
			var EXNP = navigator.mimeTypes[pluginInfo.exNPMimeType];
			
			if (EXNP && EXNP.enabledPlugin){
				// np plugin embed
				if(!document.getElementById(pluginInfo.exNPPluginId)){
					var exPlugin = document.createElement("embed");
					exPlugin.setAttribute("id", pluginInfo.exNPPluginId);
					exPlugin.setAttribute("type", pluginInfo.exNPMimeType);
					exPlugin.setAttribute("tabid", TOUCHENEX_CONST.extabid);
					exPlugin.setAttribute("width", "0");
					exPlugin.setAttribute("height", "0");
					document.body.appendChild(exPlugin);
				}
				
				var verJSON = {"init" : "get_versions",
					"m" : pluginInfo.exModuleName,
					"origin" : location.origin,
					"lic" : pluginInfo.lic
				};
				exlog("_CHECK.moduleCheck.nativecall.param", verJSON);
				var npObj = document.getElementById(pluginInfo.exNPPluginId);
				if(npObj) {
					var npVersionInfo = {};
					try {
						if(typeof npObj.nativeCall == "function"){
							npVersionInfo = npObj.nativeCall(JSON.stringify(verJSON));
							TOUCHENEX_CHECK.npVersionCheck(npVersionInfo);
						} else {
							exlog("_CHECK.moduleCheck.nativeCall [exception]","nativeCall retry");
							setTimeout(function(){
								npObj = document.getElementById(pluginInfo.exNPPluginId); 
								if(typeof npObj.nativeCall == "function"){
									npVersionInfo = npObj.nativeCall(JSON.stringify(verJSON));
									TOUCHENEX_CHECK.npVersionCheck(npVersionInfo);
								} else {
									if(TOUCHENEX_UTIL.isWin()){
										location.reload();
									} else {
										exlog("_CHECK.moduleCheck.nativeCall [exception]","nativeCall cannot run retry");
										setTimeout(function(){
											npObj = document.getElementById(pluginInfo.exNPPluginId);
											if(typeof npObj.nativeCall == "function"){
												npVersionInfo = npObj.nativeCall(JSON.stringify(verJSON));
												TOUCHENEX_CHECK.npVersionCheck(npVersionInfo);
											} else {
												exlog("_CHECK.moduleCheck.nativeCall [exception]","nativeCall cannot run fail");
												//location.reload();
											}
										}, 3000);
									}
								}
							}, 300);
						}
					} catch(e){
						exalert("_CHECK.moduleCheck nativaCall getversion [exception]", e);
						return;
					}
				} else {
					exalert("_CHECK.moduleCheck [exception]", "embed 태그 생성 실패");
					return;
				}
			} else {
				this.npVersionCheck("-1");
			}
		} else {
			if(pluginInfo.exErrSpec) eval(pluginInfo.exErrSpec)('BROWSER', pluginInfo.reqSpec.Browser);
			return;
		}
	},
	
	EXVersionCheck : function( updateInfo ) {
		
		var pluginInfo = TOUCHENEX_CONST.pluginInfo[this.chkCurrPluginCnt];
		
		if(updateInfo) {
			exlog("_CHECK.EXVersionCheck.updateInfo", updateInfo);
			
			// license check
			if(typeof updateInfo.status !== "undefined" && updateInfo.status == false){
				exlog("_CHECK.EXVersionCheck [license check]", pluginInfo.exPluginName + " license check FAIL");
				TOUCHENEX_CHECK.setStatus("license", "", false, false);
			} else {
				exlog("_CHECK.EXVersionCheck [license check]", pluginInfo.exPluginName + " license check SUCCESS");
				TOUCHENEX_CHECK.setStatus("license", "", true, false);
			}
			
			// EX Version Diff
			var exEXSvrVer;
			exlog("_CHECK.EXVersionCheck", "EX version check");
			exEXSvrVer = pluginInfo.exProtocolInfo.exWinProtocolVer;
			
			if(TOUCHENEX_UTIL.diffVersion(updateInfo.ex, exEXSvrVer)) {
				
				TOUCHENEX_CHECK.setStatus("EX", updateInfo.ex, true, false);
				
				// Client Version Diff
				var currModuleInfoArr = updateInfo.m;
				var currModuleVer;
				for(var i = 0; i < currModuleInfoArr.length; i++){
					var cm = currModuleInfoArr[i];
					if(cm.name == pluginInfo.exModuleName){
						currModuleVer = cm.version;
						break;
					}
				}
				var exModuleSvrVer;
				if(TOUCHENEX_UTIL.isWin()){
					if(TOUCHENEX_UTIL.isIE() && (TOUCHENEX_UTIL.getBrowserInfo().bit == "64")){
						exModuleSvrVer = pluginInfo.moduleInfo.exWin64Ver;
					} else {
						exModuleSvrVer = pluginInfo.moduleInfo.exWinVer;
					}
				} else if(TOUCHENEX_UTIL.isMac()){
					exModuleSvrVer = pluginInfo.moduleInfo.exMacVer;
				} else if(TOUCHENEX_UTIL.isLinux()){
					exModuleSvrVer = pluginInfo.moduleInfo.exLinuxVer;
				}
				exlog("_CHECK.EXVersionCheck", "Client version check");
				if(TOUCHENEX_UTIL.diffVersion(currModuleVer, exModuleSvrVer)) {
					
					// set installed
					TOUCHENEX_CHECK.setStatus("client", currModuleVer, true, true);
					
				} else {
					TOUCHENEX_CHECK.setStatus("client", currModuleVer, false, true);
				}
			} else {
				TOUCHENEX_CHECK.setStatus("EX", updateInfo.ex, false, true);
			}
		} else {
			exlog("_CHECK.EXVersionCheck", pluginInfo.exPluginName + " updateInfo Error");
			TOUCHENEX_CHECK.setStatus("EX", "", false, true);
		}
	},
	
	extensionVersionCheck : function( updateInfo ) {
		
		var pluginInfo = TOUCHENEX_CONST.pluginInfo[this.chkCurrPluginCnt];
		exlog("_CHECK.extensionVersionCheck.updateInfo", updateInfo);
		
		if(!window[pluginInfo.exProtocolName + "_extension_listener"]){
			window[pluginInfo.exProtocolName + "_extension_listener"] = function(event){
				alert(pluginInfo.exPluginName + " 확장 기능 설치를 완료 하였습니다.");
			};
		}
		
		if(updateInfo == "-1") {
			window.addEventListener('__'+ pluginInfo.exProtocolName + '_extension_installed__', window[pluginInfo.exProtocolName + "_extension_listener"]);
			exlog("_CHECK.extensionVersionCheck", pluginInfo.exPluginName + " EX Extension not install");
			TOUCHENEX_CHECK.setStatus("extension", "", false, true);
			return;
		}
		
		var extensionVersion = "";
		if(TOUCHENEX_UTIL.isChrome()) extensionVersion = pluginInfo.exExtensionInfo.exChromeExtVer;
		else if(TOUCHENEX_UTIL.isFirefox()) extensionVersion = pluginInfo.exExtensionInfo.exFirefoxExtVer;
		else if(TOUCHENEX_UTIL.isOpera()) extensionVersion = pluginInfo.exExtensionInfo.exOperaExtVer;
		// Extension Version Diff
		exlog("_CHECK.extensionVersionCheck", "Extension version check");
		if(TOUCHENEX_UTIL.diffVersion(updateInfo, extensionVersion)) {
			TOUCHENEX_CHECK.setStatus("extension", updateInfo, true, false);
			window.removeEventListener('__'+ pluginInfo.exProtocolName + '_extension_installed__', window[pluginInfo.exProtocolName + "_extension_listener"]);
			this.extensionNativeVersionCheck();
		} else {
			// chrome은 자동업데이트 되므로 예외처리
			if(TOUCHENEX_UTIL.isChrome()){
				TOUCHENEX_CHECK.setStatus("extension", updateInfo, false, false);
				window.removeEventListener('__'+ pluginInfo.exProtocolName + '_extension_installed__', window[pluginInfo.exProtocolName + "_extension_listener"]);
				this.extensionNativeVersionCheck();
			} else {
				window.addEventListener('__'+ pluginInfo.exProtocolName + '_extension_installed__', window[pluginInfo.exProtocolName + "_extension_listener"]);
				TOUCHENEX_CHECK.setStatus("extension", updateInfo, false, true);
			}
		}
	},
	
	extensionNativeVersionCheck : function() {
		
		var pluginInfo = TOUCHENEX_CONST.pluginInfo[this.chkCurrPluginCnt];
		var nativecall = eval(pluginInfo.exExtHeader + "_nativecall");
		
		var pv = "";
		if(TOUCHENEX_UTIL.isWin()){
			pv = pluginInfo.exProtocolInfo.exWinProtocolVer;
		} else if(TOUCHENEX_UTIL.isMac()){
			pv = pluginInfo.exProtocolInfo.exMacProtocolVer;
		} else if(TOUCHENEX_UTIL.isLinux()){
			pv = pluginInfo.exProtocolInfo.exLinuxProtocolVer;
		}
		
		var nativecallData = {"cmd":"init", "exfunc":"get_versions", 
				"m" : pluginInfo.exModuleName,
				"origin" : pluginInfo.hostid ? pluginInfo.hostid : location.origin,
				"pv" : pv,
				"lic" : pluginInfo.lic,
				"callback":""};
		exlog("_CHECK.extensionNativeVersionCheck.nativecall.param", nativecallData);
		
		var chkExtVerChkInterval;
		var chkExtRetry = 0;
		function chkVersionNativeCall(){
			if(chkExtRetry > 1)
				exlog("_CHECK.extensionNativeVersionCheck.retry", chkExtRetry);
			chkExtRetry++;
			nativecall(nativecallData,
				function(response) {
					exlog("_CHECK.extensionNativeVersionCheck", "clearInterval");
					clearInterval(chkExtVerChkInterval);
					exlog("_CHECK.extensionNativeVersionCheck.response", response);
					if(response) {
						// type 0 - check version
						// type 1 - need to install
						// type 2 - native host error
						if(response.status == "INTERNAL_ERROR") {
							exlog("_CHECK.extensionNativeVersionCheck", pluginInfo.exPluginName + " internal error :: " + response.reply);
							TOUCHENEX_CHECK.setStatus("EX", "", false, true);
						} else if(response.status == "TRUE") {
							// license check
							if(typeof response.reply.status !== "undefined" && response.reply.status == false){
								exlog("_CHECK.extensionNativeVersionCheck [license check]", pluginInfo.exPluginName + " license check FAIL");
								TOUCHENEX_CHECK.setStatus("license", "", false, false);
							} else {
								exlog("_CHECK.extensionNativeVersionCheck [license check]", pluginInfo.exPluginName + " license check SUCCESS");
								TOUCHENEX_CHECK.setStatus("license", "", true, false);
							}
							// EX Version Diff
							var exEXSvrVer;
							if(TOUCHENEX_UTIL.isWin()){
								exEXSvrVer = pluginInfo.exProtocolInfo.exWinProtocolVer;
							} else if(TOUCHENEX_UTIL.isMac()){
								exEXSvrVer = pluginInfo.exProtocolInfo.exMacProtocolVer;
							} else if(TOUCHENEX_UTIL.isLinux()){
								exEXSvrVer = pluginInfo.exProtocolInfo.exLinuxProtocolVer;
							}
							exlog("_CHECK.extensionNativeVersionCheck", "EX version check");
							if(TOUCHENEX_UTIL.diffVersion(response.reply.ex, exEXSvrVer)) {
								TOUCHENEX_CHECK.setStatus("EX", response.reply.ex, true, false);
						
								// TODO Linux 체크 어케할까 솔루션마다 다를텐데....
								// Client Version Diff
								var currModuleInfoArr = response.reply.m;
								var currModuleVer;
								for(var i = 0; i < currModuleInfoArr.length; i++){
									var cm = currModuleInfoArr[i];
									if(cm.name == pluginInfo.exModuleName){
										currModuleVer = cm.version;
										break;
									}
								}
								var exModuleSvrVer;
								if(TOUCHENEX_UTIL.isWin()){
									exModuleSvrVer = pluginInfo.moduleInfo.exWinVer;
								} else if(TOUCHENEX_UTIL.isMac()){
									exModuleSvrVer = pluginInfo.moduleInfo.exMacVer;
								} else if(TOUCHENEX_UTIL.isLinux()){
									exModuleSvrVer = pluginInfo.moduleInfo.exLinuxVer;
								}
								exlog("_CHECK.extensionNativeVersionCheck", "Client version check");
								if(TOUCHENEX_UTIL.diffVersion(currModuleVer, exModuleSvrVer)) {
									// Set isInstalled
									TOUCHENEX_CHECK.setStatus("client", currModuleVer, true, true);
								} else {
									exlog("_CHECK.extensionNativeVersionCheck", pluginInfo.exPluginName + " client not installed or need upgrade");
									TOUCHENEX_CHECK.setStatus("client", currModuleVer, false, true);
								}
							} else {
								exlog("_CHECK.extensionNativeVersionCheck", pluginInfo.exPluginName + " client not installed or need upgrade");
								TOUCHENEX_CHECK.setStatus("EX", response.reply.ex, false, true);
							}
						} else {
							exlog("_CHECK.extensionNativeVersionCheck", pluginInfo.exPluginName + " status not TRUE");
							TOUCHENEX_CHECK.setStatus("EX", "", false, true);
						}
					} else {
						exlog("_CHECK.extensionNativeVersionCheck", pluginInfo.exPluginName + "response not exist");
						exalert("_CHECK.extensionNativeVersionCheck", "Extension의 설치를 확인해주세요.");
						TOUCHENEX_CHECK.setStatus("extension", "", false, true);
						
						
					}
				}
			);
		}
		chkVersionNativeCall();
		chkExtVerChkInterval = setInterval(function(){
			exlog("_CHECK.extensionNativeVersionCheck", "setIntervalCall");
			if(chkExtRetry > 0){
				exlog("_CHECK.extensionNativeVersionCheck", "retry!!!");
				chkVersionNativeCall();
			} else {
				exlog("_CHECK.extensionNativeVersionCheck", "pass!!!");
				clearInterval(chkExtVerChkInterval);
			}
		},3000);
	},
	npVersionCheck : function( updateInfo ) {
		
		updateInfo = JSON.parse(updateInfo);
		exlog("_CHECK.npVersionCheck.updateInfo", updateInfo);
		
		var pluginInfo = TOUCHENEX_CONST.pluginInfo[this.chkCurrPluginCnt];
		if(updateInfo == "-1") {
			exlog("_CHECK.npVersionCheck", pluginInfo.exPluginName + " not install");
			TOUCHENEX_CHECK.setStatus("EX", "", false, true);
			return;
		}
		
		// license check
		if(typeof updateInfo.status !== "undefined" && updateInfo.status == false){
			exlog("_CHECK.extensionNativeVersionCheck [license check]", pluginInfo.exPluginName + " license check FAIL");
			TOUCHENEX_CHECK.setStatus("license", "", false, false);
		} else {
			exlog("_CHECK.extensionNativeVersionCheck [license check]", pluginInfo.exPluginName + " license check SUCCESS");
			TOUCHENEX_CHECK.setStatus("license", "", true, false);
		}
		
		// TODO OS 구분
		// EX Version Diff
		var exEXSvrVer;
		if(TOUCHENEX_UTIL.isWin()){
			exEXSvrVer = pluginInfo.exProtocolInfo.exWinProtocolVer;
		} else if(TOUCHENEX_UTIL.isMac()){
			exEXSvrVer = pluginInfo.exProtocolInfo.exMacProtocolVer;
		} else if(TOUCHENEX_UTIL.isLinux()){
			exEXSvrVer = pluginInfo.exProtocolInfo.exLinuxProtocolVer;
		}
		exlog("_CHECK.npVersionCheck", "EX version check");
		if(TOUCHENEX_UTIL.diffVersion(updateInfo.ex, exEXSvrVer)) {
			
			TOUCHENEX_CHECK.setStatus("EX", updateInfo.ex, true, false);
			
			// Client Version Diff
			var currModuleInfoArr = updateInfo.m;
			var currModuleVer;
			for(var i = 0; i < currModuleInfoArr.length; i++){
				var cm = currModuleInfoArr[i];
				if(cm.name == pluginInfo.exModuleName){
					currModuleVer = cm.version;
					break;
				}
			}
			var exModuleSvrVer;
			if(TOUCHENEX_UTIL.isWin()){
				exModuleSvrVer = pluginInfo.moduleInfo.exWinVer;
			} else if(TOUCHENEX_UTIL.isMac()){
				exModuleSvrVer = pluginInfo.moduleInfo.exMacVer;
			} else if(TOUCHENEX_UTIL.isLinux()){
				exModuleSvrVer = pluginInfo.moduleInfo.exLinuxVer;
			}
			exlog("_CHECK.npVersionCheck", "Client version check");
			if(TOUCHENEX_UTIL.diffVersion(currModuleVer, exModuleSvrVer)) {
				// Set isInstalled
				TOUCHENEX_CHECK.setStatus("client", currModuleVer, true, true);
			} else {
				TOUCHENEX_CHECK.setStatus("client", currModuleVer, false, true);
			}
		} else {
			TOUCHENEX_CHECK.setStatus("EX", updateInfo.ex, false, true);
		}
	},
	
	loadScript : function( url ){

		var newScript = document.createElement("script");
		newScript.id = TOUCHENEX_CONST.exScriptName;
		newScript.type = "text/javascript";
		
		if(newScript.readyState) { // IE8 under
			newScript.onreadystatechange = function() {
				exlog("_UTIL.loadScript.readyState", newScript.readyState);
				if (newScript.readyState == 'loading' || newScript.readyState == 'loaded') {
					newScript.onreadystatechange = null;
					exlog("_UTIL.loadScript", "loadScript load error");
					TOUCHENEX_CHECK.setStatus("EX", "", false, true);
				}
			};
		} else {
			newScript.onerror = function() {
				exlog("_UTIL.loadScript", "loadScript load error");
				TOUCHENEX_CHECK.setStatus("EX", "", false, true);
			};
		}
		
		try {
			newScript.src = url;
		} catch (e) {
			exlog("_UTIL.loadscript", "LoadScript not https load error");
			TOUCHENEX_CHECK.setStatus("EX", "", false, true);
		}
		eval(TOUCHENEX_CONST.exDivName).appendChild(newScript);
	},
	
	setStatus : function (type, localVer, status, isNext){
		var currPlugin = TOUCHENEX_CONST.pluginInfo[this.chkCurrPluginCnt];
		
		if(type == "license"){
			this.chkInfoStatus.info[this.chkCurrPluginCnt].license = status;
		} else if(type == "extension"){
			this.chkInfoStatus.info[this.chkCurrPluginCnt].extensionVer = localVer;
			this.chkInfoStatus.info[this.chkCurrPluginCnt].extension = status;
		} else if(type == "EX"){
			this.chkInfoStatus.info[this.chkCurrPluginCnt].EXVer = localVer;
			this.chkInfoStatus.info[this.chkCurrPluginCnt].EX = status;
		} else if(type == "client"){
			this.chkInfoStatus.info[this.chkCurrPluginCnt].clientVer = localVer;
			this.chkInfoStatus.info[this.chkCurrPluginCnt].client = status;
			if(status){
				currPlugin.isInstalled = true;
			}
		}
		
		if(isNext){
			//this.chkInfoStatus.info[this.chkCurrPluginCnt].check = true;
			//exlog("_CHECK.setStatus", this.chkInfoStatus);
			this.moduleCheck(this.chkCurrPluginCnt + 1);
		} else {
			//exlog("_CHECK.setStatus", this.chkInfoStatus);
		}
	}
};


/* 
 * CrossEX Construct
 * TOUCHENEX_EX
 */
var TOUCHENEX_EX = function( property ) {
	
	this.isInstalled	= property.isInstalled;
	this.exPluginName	= property.exPluginName;
	this.exModuleName	= property.exModuleName ? property.exModuleName : property.exProtocolName;
	this.exProtocolName	= property.exProtocolName;
	this.exExtHeader	= property.exExtHeader;
	this.exNPPluginId	= property.exNPPluginId;
	this.exErrFunc		= property.exErrFunc;
	this.lic			= property.lic;
	this.exDefaultCallbackName = property.exDefaultCallback ? property.exDefaultCallback : property.exPluginName + ".exDefaultCallback";
	
	this.exDivName		= TOUCHENEX_CONST.exDivName;
	this.exFormName		= TOUCHENEX_CONST.exFormName;
	this.exFormDataName	= TOUCHENEX_CONST.exFormDataName;
	this.exIframeName	= TOUCHENEX_CONST.exIframeName;
	this.exScriptName	= TOUCHENEX_CONST.exScriptName;
	
	dummyDomain	= property.dummyDomain?property.dummyDomain:location.host;
	hostid		= property.hostid?property.hostid:location.host;
	
	this.initEXInfoArr	= [];
	this.exInterfaceArr	= [];
	this.exEcho			= false;
	this.setEcho = function( status ){
		this.exEcho =status;
	};
	this.alertInfo		= {"BLOCK":false, "EX":false, "CLIENT":false};
	
	// default callback
	this.exDefaultCallback = function( response ){
		exlog("exDefaultCallback", response);
		if(response){
			var resPluginObj;
			if(response.NAME){
				resPluginObj = eval(response.NAME);
			}
			if(response.ERR == "BLOCK"){
				if(!resPluginObj.alertInfo.BLOCK){
					resPluginObj.alertInfo.BLOCK = true;
					alert(response.NAME + " 라이센스를 확인하세요.");
				}
			} else if(response.ERR == "BLOCK:EX"){
				if(!resPluginObj.alertInfo.EX){
					resPluginObj.alertInfo.EX = true;
					alert(response.NAME + " 프로그램이 변조되었습니다.(EX)\n재설치가 필요합니다.");
					return;
				}
			} else if(response.ERR == "BLOCK:CLIENT"){
				if(!resPluginObj.alertInfo.CLIENT){
					resPluginObj.alertInfo.CLIENT = true;
					alert(response.NAME + " 프로그램이 변조되었습니다.(client)\n재설치가 필요합니다.");
					return;
				}
			} else if(response.ERR == "BLOCK:DISCONNECTED"){
				exlog("exDefaultCallback.msg", response.MSG);
				
				if(!resPluginObj.alertInfo.BLOCK){
					resPluginObj.alertInfo.BLOCK = true;
					alert(response.NAME + " 프로그램이 중단되었습니다.(client)\n페이지를 새로고침하세요.");
					return;
				}
			} else if(response.ERR == "BLOCK:INTERNAL"){
				exlog("exDefaultCallback.msg", response.MSG);
				if(!resPluginObj.alertInfo.BLOCK){
					resPluginObj.alertInfo.BLOCK = true;
					alert(response.NAME + " 프로그램이 중단되었습니다.(client)\n페이지를 새로고침하세요.");
				}
			} else {
				exalert("실행중 오류가 발생하였습니다.(EX)", response);
			}
			
			try{
				if(resPluginObj.exErrFunc){
					eval(resPluginObj.exErrFunc)(response);
				}
			} catch (e){}
			return;
			
		} else {
			exalert("실행중 오류가 발생하였습니다.(EX)", "InvokeCallback not response");
		}
	};
	
	/*
	 * Invoke
	 */
	this.Invoke = function( fname, args, exCallback, pageCallback ){
		
		var id = TOUCHENEX_UTIL.createId();
		var obj = {};
		obj.id = id;
		obj.EXCallback = exCallback ? exCallback:null;
		obj.pageCallback = pageCallback ? pageCallback : null;
		obj.pluginName = this.exPluginName;
		this.exInterfaceArr.push(obj);
		exlog(this.exPluginName + ".Invoke.exInterfaceArr.id", id);
		
		var cmd = "native";
		
		if(TOUCHENEX_UTIL.typeEX()){
			this.InitEX(id, cmd, fname, args, exCallback);
		} else if(TOUCHENEX_UTIL.typeExtension()){
			this.InvokeExtension(id, cmd, fname, args, exCallback);
		} else if(TOUCHENEX_UTIL.typePlugin()) {
			this.InvokePlugin(id, cmd, fname, args, exCallback);
		} else {
			return;
		}
	};
	
	/*
	 * SetPushCallback
	 */
	this.SetPushCallback = function( fname, args ) {
		
		var id = TOUCHENEX_UTIL.createId();
		var obj = {};
		obj.id = id;
		this.exInterfaceArr.push(obj);
		exlog(this.exPluginName + ".SetPushCallback.info", obj);
		
		var cmd = "setcallback";
		if(TOUCHENEX_UTIL.typeEX()){
			this.InitEX(id, cmd, fname, args);
		} else if(TOUCHENEX_UTIL.typeExtension()){
			this.InvokeExtension(id, cmd, fname, args);
		} else if(TOUCHENEX_UTIL.typePlugin()) {
			this.InvokePlugin(id, cmd, fname, args);
		} else {
			return;
		}
	};
	
	this.InitEX = function( id, cmd, fname, funcArgsArray, callback ) {
		
		var initUrl = this.createInitEXURL(id, this.exPluginName + ".InitEXCallback");
		var request = {};
		request.id = id;
		request.tabid = TOUCHENEX_CONST.extabid;
		request.module = this.exModuleName;
		request.cmd = cmd;
		request.origin = location.origin != undefined ? location.origin : (location.protocol + "//" + hostid);
		request.exfunc = {};
		request.exfunc.fname = fname;
		request.callback = callback;
		if(this.exEcho) request.echo = true;
		
		var exfunc = request.exfunc;
		if(funcArgsArray) {
			if(funcArgsArray instanceof Array) {
				exfunc.args = funcArgsArray;
			} else {
				var arr = [funcArgsArray];
				exfunc.args = arr;
			}
		} else {
			exfunc.args = [];
		}
		var initEXInfo = {"id":id,"json":request,"callback":callback};
		this.initEXInfoArr.push(initEXInfo);
		
		exlog(this.exPluginName + ".InitEX.loadScript.url", initUrl);
		TOUCHENEX_UTIL.loadScript(initUrl);
	};
	
	this.InitEXCallback = function( id ) {
				
		var
			callback,
			reqJSON;
		
		if(this.initEXInfoArr){
			for(var i=0; i < this.initEXInfoArr.length; i++){
				initExObj = this.initEXInfoArr[i];
				if(initExObj.id == id){
					reqJSON = initExObj.json;
					callback = initExObj.json.callback;
					this.initEXInfoArr.splice(i,1);
					break;
				}
			}
		} else {
			exlog(this.exPluginName + ".InitEXCallback [exception]", "initEXInfoArr는 존재하지 않습니다.");
			exalert(this.exPluginName + ".InitEXCallback [exception]", "initEXInfoArr는 존재하지 않습니다.");
			return;
		}
		
		this.InvokeEX(id, callback, reqJSON);
	};
	
	this.InvokeEX = function( id, callback, reqJSON){
		
		var frm = document.getElementById(TOUCHENEX_CONST.exFormName);
		frm.target = TOUCHENEX_CONST.exIframeName;
		frm.action = this.createEXURL(id, this.exPluginName + ".InvokeCallback");
		
		if(frm.elements.length > 1){
			for(var i=0; i<frm.elements.length;){
				var chkElement = frm.elements[i];
				var chkId = chkElement.id ? chkElement.id : "";
				var chkName = chkElement.name ? chkElement.name : ""; 
				
				if(chkId != TOUCHENEX_CONST.exFormDataName || chkName != TOUCHENEX_CONST.exFormDataName){
					exlog(this.exPluginName + ".InvokeEX.form remove garbage param",chkId + "::" + chkName);
					chkElement.parentElement.removeChild(chkElement);
				} else {
					i++;
				}
			}
		}
		
		var node = frm.elements[0];
		node.value = JSON.stringify(reqJSON);
		
		exlog(this.exPluginName + ".InvokeEX." + frm.id + ".action", frm.action);
		exlog(this.exPluginName + ".InvokeEX." + node.name + ".value", node.value);
				
		frm.submit();
	};

	this.InvokeExtension = function( id, cmd, fname, args, callback ) {
		
		var request = {};
		request.id = id;
		request.module = this.exModuleName;
		request.cmd = cmd;
		request.origin = location.origin != undefined ? location.origin : (location.protocol + "//" + location.host);
		request.exfunc = {};
		request.exfunc.fname = fname;
		request.exfunc.args = args;
		request.callback = callback;
		if(this.exEcho) request.echo = true;
		exlog(this.exPluginName + ".InvokeExtension.request", request);
		
		TOUCHENEX_CONST.tmpExtArr.push({"id":id,"name":this.exPluginName});
		var invokeCallbackFn = eval(this.exPluginName + ".InvokeExtensionCallback");
		if(typeof eval(this.exExtHeader+"_nativecall") == "function"){
			eval(this.exExtHeader+"_nativecall")(request, invokeCallbackFn);
		} else {
			eval(this.exDefaultCallbackName)("extension not installed");
		}
	};
	
	this.InvokeExtensionCallback = function( response ){
		var tmpPluginName;
		for(var i = 0; i < TOUCHENEX_CONST.tmpExtArr.length; i++){
			var tmpObj = TOUCHENEX_CONST.tmpExtArr[i];
			if(response.id == tmpObj.id){
				tmpPluginName = tmpObj.name;
				TOUCHENEX_CONST.tmpExtArr.splice(i,1);
				break;
			}
		}
		if(tmpPluginName)
			eval(tmpPluginName).InvokeCallback(response);
	};

	this.InvokePlugin = function( id, cmd, fname, args, callback ) {
		
		var request = {};
		request.id = id;
		request.tabid = TOUCHENEX_CONST.extabid;
		request.module = this.exModuleName;
		request.cmd = cmd;
		request.origin = location.origin != undefined ? location.origin : location.host;
		request.exfunc = {};
		request.exfunc.fname = fname;
		request.exfunc.args = args;
		request.callback = callback;
		if(this.exEcho) request.echo = true;
		
		exlog(this.exPluginName + ".InvokePlugin.request", JSON.stringify(request));
		var plugin = eval(this.exNPPluginId);
		if(typeof plugin.nativeCall == "function"){
			var response = plugin.nativeCall(JSON.stringify(request));
			this.InvokeCallback(response);
		} else {
			eval(this.exDefaultCallbackName)("plugin not installed");
			return;
		}
		
		// plugin client callback set
		if(TOUCHENEX_UTIL.typePlugin() && cmd == "setcallback"){
			try {
				var pluginNameStr = this.exNPPluginId;
				var exNameStr = this.exPluginName;
				var pluginPop = function(){
					try {
						//exlog("nppluginPop", TOUCHENEX_CONST.frameName + pluginNameStr);
						var popPlugin = document.getElementById(pluginNameStr);
						var popResp = popPlugin.pop();
						if(popResp){
							eval(popResp);
							//exlog("nppluginPop", "call");
						} else {
							//exlog("nppluginPop", "pass");
						}
					} catch (e){
						exlog(exNameStr + "nppluginPop [exception]", e);
						exlog(exNameStr + "nppluginPop", "plugin.popo function not exist");
					}
					clearInterval(g_intervalPop);
					g_intervalPop = setInterval(pluginPop,1);
				};
				//pluginPop();
				//setInterval(pluginPop,1);
				g_intervalPop = setInterval(pluginPop, 1);
			} catch (e) {
				exlog(this.exPluginName + ".InvokePlugin [exception]", e);
				exlog(this.exPluginName + ".InvokePlugin", "plugin.pop function not exist");
			}
		}
	};
	
	this.InvokeCallback = function( response ){
		if(response){
			try{
				exlog(this.exPluginName + ".InvokeCallback.response", response);
				if(typeof response == "object"){
					var strSerial = JSON.stringify(response);
				} else if(typeof response == "string"){
					response = JSON.parse(response);
				}
				
				if(TOUCHENEX_UTIL.typeEX() || TOUCHENEX_UTIL.typePlugin()) {
					response = response.response;
				} else {
					response = response;
				}
				
				var status = response.status;
				if(status == "TRUE") {	// success
					var id = response.id;
					var funcInfo = {};
					for(var i=0; i < this.exInterfaceArr.length; i++){
						if(this.exInterfaceArr[i]){
							var arrObj = this.exInterfaceArr[i];
							if(arrObj.id == id){
								funcInfo = arrObj;
								this.exInterfaceArr.splice(i,1);
								break;
							}
						}
					}
					var callback = funcInfo.EXCallback;
					var reply = response.reply.reply;
					
					// run callback
					if(callback){
						if(reply instanceof Array) {
							var strReply = {};
							strReply.callback = funcInfo.pageCallback;
							var replyArr;
							replyArr = "[";
							for(var i in reply) {
								var str = reply[i];
								str = str.replace("\\r", "\r");
								str = str.replace("\\n", "\n");
								replyArr += "'" + str + "',";
							}
							replyArr += "]";
							strReply.reply = replyArr;
							callback = callback + "(" + JSON.stringify(strReply) + ");";
						} else if(typeof reply == 'string') {
							var strReply = {};
							strReply.callback = funcInfo.pageCallback;
							strReply.reply = reply.replace("\\r", "\r").replace("\\n", "\n");
							callback = callback + "(" + JSON.stringify(strReply) + ");";
						} else if(typeof reply == 'object') {
							//reply.id = id;
							reply.callback = funcInfo.pageCallback;
							callback = callback + "(" + JSON.stringify(reply) + ");";
						} else {
							callback = callback + "()";
						}
						if(!TOUCHENEX_UTIL.typePlugin() && !TOUCHENEX_UTIL.typeEX())
							eval(callback);
						else
							setTimeout(function(){eval(callback)},5);
					}
				} else if(status == "BLOCK") {
					exlog(this.exPluginName + ".InvokeCallback", "license not valid");
					eval(this.exDefaultCallbackName)({"NAME":this.exPluginName, "ERR":"BLOCK"});
				} else if(status == "BLOCK:EX") {
					exlog(this.exPluginName + ".InvokeCallback", "CrossEX sig check fail");
					eval(this.exDefaultCallbackName)({"NAME":this.exPluginName, "ERR":"BLOCK:EX"});
				} else if(status == "BLOCK:CLIENT") {
					exlog(this.exPluginName + ".InvokeCallback", "Client sig check fail");
					eval(this.exDefaultCallbackName)({"NAME":this.exPluginName, "ERR":"BLOCK:CLIENT"});
				} else if(status == "INTERNAL_ERROR") {
					if(response.reply && response.reply.match(/disconnected/gi).length > 0){
						exlog(this.exPluginName + ".InvokeCallback", "CrossEXClient disconnect");
						eval(this.exDefaultCallbackName)({"NAME":this.exPluginName, "ERR":"BLOCK:DISCONNECTED", "MSG":response.reply});
					} else {
						exlog(this.exPluginName + ".InvokeCallback", "CrossEXClient Internal Error");
						eval(this.exDefaultCallbackName)({"NAME":this.exPluginName, "ERR":"BLOCK:INTERNAL", "MSG":response.reply});
					}
				} else {
					exlog(this.exPluginName + ".InvokeCallback", "native response status not TRUE");
					eval(this.exDefaultCallbackName)(response);
				}
			} catch (e) {
				exlog(this.exPluginName + ".InvokeCallback [exception]", e);
				exlog(this.exPluginName + ".InvokeCallback [exception]", "native response process exception");
				eval(this.exDefaultCallbackName)(response);
			}
		} else {
			exlog(this.exPluginName + ".InvokeCallback", "native call not response");
			eval(this.exDefaultCallbackName)();
		}
	};
	
	/*
	 * ScriptInvoke
	 */
	this.ScriptInvoke = function( args, callback ){
		var jsonStr;
		try {
			if(!(args instanceof Array)) {
				args = [args];
			}
			jsonStr = JSON.stringify(args);
		} catch(e) {
			exalert(this.exPluginName + ".ScriptInvoke", "입력값이 올바르지 않습니다.");
			return;
		}
		var url = this.createScriptInvokeURL(jsonStr, callback);
		exlog(this.exPluginName + ".ScriptInvoke.url", url);
		
		if(TOUCHENEX_UTIL.typeEX()){
			TOUCHENEX_UTIL.loadScript(url);
		} else {
			exlog(this.exPluginName + ".ScriptInvoke", "not IE");
			exalert(this.exPluginName + ".ScriptInvoke", "IE 브라우저에서는 동작하지 않는 펑션입니다.");
			return;
		}
	};
	
	this.createInitEXURL = function( id, callback ) {
		var param = "hostid=" + encodeURIComponent(hostid) 
			+ "&id=" + encodeURIComponent(id)
			+ "&callback=" + encodeURIComponent(TOUCHENEX_CONST.frameName + callback);
		url = this.createProtocolURL("Init", param);
		
		return url;
	};
	
	this.createEXURL = function( id, callback ) {
		var param = "hostid=" + encodeURIComponent(hostid)
			+ "&id=" + encodeURIComponent(id)
			+ "&callback=" + encodeURIComponent(TOUCHENEX_CONST.frameName + callback);
		url = this.createProtocolURL("Call", param);
		
		return url;
	};
	
	this.createProtocolURL = function( cmd, param ) {
		var url = this.exProtocolName + "://" + dummyDomain + "/" + cmd + "?";
		if(param) {
			url += param;
			if(window.location.protocol == "https:") url += "&i=1&s=1";
		} else {
			if(window.location.protocol == "https:") url += "i=1&s=1";
		}
		
		return url;
	};
	
	this.createScriptInvokeURL = function( args, callback ) {
		var id = TOUCHENEX_UTIL.createId();
		var url = this.exProtocolName + "://" + dummyDomain + "/Call2?hostid=" + hostid + "&id=" + id;
		if(callback) {
			url += "&callback=" + callback;
			url += "&__CROSSEX_DATA__=" + encodeURIComponent(args);
		}
		if(window.location.protocol == "https:") url += "&s=1";
		
		return url;
	};
};


/* 
 * CrossEX Util
 * TOUCHENEX_UTIL
 */

var TOUCHENEX_UTIL = {

	exlog : function( func, value ){
		
		if(TOUCHENEX_CONST.debug) {
			if(!window.console) console = {log:function(msg){}};
			
			var strlog;
			try {
				if(typeof value == "undefined") {
					strlog = "[undefined]";
				} else {
					if(typeof value == "function") {
						strlog = "[function] " + value;
					} else if(typeof value == "object") {
						try{
							strlog = "[json] " + JSON.stringify(value);
						} catch (e){
							strlog = "[object] " + value;
						}
					} else if(typeof value == "number") {
						strlog = "[number] " + value;
					} else if(typeof value == "string") {
						strlog = "[string] " + value;
					} else if(typeof value == "boolean") {
						strlog = "[boolean] " + value;
					} else{
						strlog = "[other] " + value.toString();
					}
				}
			} catch (e) {
				strlog = " [exlog exception] " + typeof value;
			}
			try{
				console.log("[exlog] " + TOUCHENEX_CONST.frameName + func + " : " + strlog);
			} catch (e) {}
			
		
			return;
		}
	},
	exalert : function( func, value ){
		
		if(TOUCHENEX_CONST.debugAlert) {
			var msg;
			try {
				if(value){
					if(typeof value == "object") {
						msg = JSON.stringify(value);
					} else if(typeof value == "function") {
						msg = value;
					} else if(typeof value == "number") {
						msg = value;
					} else if(typeof value == "string") {
						msg = value;
					} else if(typeof value == "boolean") {
						msg = value;
					} else {
						msg = value.toString();
					}
				}
			} catch (e) {
				msg = "[exception] " + value;
			}
			
			if(func) {
				alert(func + " : " + msg);
			} else {
				alert(msg);
			}
			return;
		}
	},
	findPath : function(currentFrame, tmpPath) {
		
		if(currentFrame == top) return "";
		
		var path, pathObj;
		if(!tmpPath) {
			pathObj = top;
			path = "top";
		} else {
			pathObj = eval(tmpPath);
			path = tmpPath;
		}
		
		var frameCnt = pathObj.frames.length;
		for(var i = 0 ; i < frameCnt; i++){
			var fr = pathObj.frames[i];
			if(currentFrame == fr){
				return path + ".frames[" + i + "].";
			}

			try {
				if(fr.frames.length > 0){
					var resultPath = TOUCHENEX_UTIL.findPath(currentFrame, path + ".frames[" + i + "]");
					if(resultPath){
						return resultPath;
					}
				}
			} catch(e) {
				exlog("_UTIL.findPath", "frame check error : " + path + "[" + i + "]");
				return;
			}
		}
		return;
	},
	getOSInfo : function(){
		var
			tp = navigator.platform,
			ua = navigator.userAgent,
			tem;
			
		//exlog("platform", tp);
		//exlog("userAgent", ua);
		var result = {};
		
		// platform
    	if (tp == "Win32" || tp == "Win64"){
    		if(ua.search("Windows Phone") >= 0){
    			result.platform = "Windows Phone";
    			result.name="Windows Phone";
    		} else {
    			result.platform = "WINDOWS";
    		}
    	} else if (tp == "MacIntel") {
    		if((ua.search("iPhone") >= 0) || (ua.search("iPad") >= 0) || (ua.search("iPod") >= 0)){
    			result.platform = "iOS";
    			result.name="iOS";
    		} else {
    			result.platform = "MACOSX";
    		}
		} else if (tp.search("Linux") >= 0) {
			if(ua.search("Android") >= 0){
				result.platform = "Android";
				result.name="Android";
			} else {
				result.platform = "LINUX";
			}
		} else if (tp == "iPhone Simulator") {
			result.platform = "iOS";
			result.name="iPhone Simulator";
		} else if (tp == "iPhone") {
			result.platform = "iOS";
			result.name="iPhone";
		} else if (tp == "iPad") {
			result.platform = "iOS";
			result.name="iPad";
		} else if (tp == "iPod") {
			result.platform = "iOS";
			result.name="iPod";
		} else {
			result.platform = "UNKNOWN";
		}
		
		// version, bit
		if(result.platform == "WINDOWS"){
			if(ua.indexOf("Windows NT 5.1") != -1) {result.version="5.1"; result.name="XP";}
			else if(ua.indexOf("Windows NT 5.2") != -1) {result.version="5.2"; result.name="XP";}
			else if(ua.indexOf("Windows NT 6.0") != -1) {result.version="6.0"; result.name="VISTA";}
			else if(ua.indexOf("Windows NT 6.1") != -1) {result.version="6.1"; result.name="7";}
			else if(ua.indexOf("Windows NT 6.2") != -1) {result.version="6.2"; result.name="8";}
			else if(ua.indexOf("Windows NT 6.3") != -1) {result.version="6.3"; result.name="8.1";}
			else if(ua.indexOf("Windows NT 10.0") != -1) {result.version="10.0"; result.name="10";}
			else if(ua.indexOf("Windows NT") != -1){
				result.version="UNKNOWN"; result.name="UNKNOWN";
			} else {
				result.version="UNKNOWN"; result.name="UNKNOWN";
			}
			
			if(ua.indexOf("WOW64") != -1 || ua.indexOf("Win64") != -1) result.bit="64";
			else result.bit="32";
			
		} else if(result.platform == "MACOSX"){
			if((ua.indexOf("Mac OS X 10_5") || ua.indexOf("Mac OS X 10.5")) != -1) {result.version="10.5"; result.name="Leopard";}
			else if((ua.indexOf("Mac OS X 10_6") || ua.indexOf("Mac OS X 10.6")) != -1) {result.version="10.6"; result.name="Snow Leopard";}
			else if((ua.indexOf("Mac OS X 10_7") || ua.indexOf("Mac OS X 10.7")) != -1) {result.version="10.7"; result.name="Lion";}
			else if((ua.indexOf("Mac OS X 10_8") || ua.indexOf("Mac OS X 10.8")) != -1) {result.version="10.8"; result.name="Mountain Lion";}
			else if((ua.indexOf("Mac OS X 10_9") || ua.indexOf("Mac OS X 10.9")) != -1) {result.version="10.9"; result.name="Mavericks";}
			else if((ua.indexOf("Mac OS X 10_10") || ua.indexOf("Mac OS X 10.10")) != -1) {result.version="10.10"; result.name="Yosemite";}
			else if((ua.indexOf("Mac OS X 10_11") || ua.indexOf("Mac OS X 10.11")) != -1) {result.version="10.11"; result.name="El Capitan";}
			else if((ua.indexOf("Mac OS X 10_12") || ua.indexOf("Mac OS X 10.12")) != -1) {result.version="10.12"; result.name="Sierra";}
			else if(ua.indexOf("Mac OS X 10") != -1){
				result.version="10.99"; result.name="NewVersion";
			} else {
				result.version="UNKNOWN"; result.name="UNKNOWN";
			}
			result.bit = "64";
		} else if(result.platform == "LINUX"){
			result.version="UNKNOWN"; result.name="UNKNOWN";
		} else {
			result.version="UNKNOWN"; result.name="UNKNOWN";
		}
		
		//exlog("TOUCHENEX_UTIL.getOSInfo.result", result);
		return result;
	},
	isWin : function() {
		var OSInfo = TOUCHENEX_CONST.OSInfo.platform;
		if(!OSInfo) OSInfo = TOUCHENEX_UTIL.getOSInfo().platform;
		if (OSInfo == "WINDOWS") return true;
		return false;
	},
	isMac : function() {
		var OSInfo = TOUCHENEX_CONST.OSInfo.platform;
		if(!OSInfo) OSInfo = TOUCHENEX_UTIL.getOSInfo().platform;
		if (OSInfo == "MACOSX") return true;
		return false;
	},
	isLinux : function() {
		var OSInfo = TOUCHENEX_CONST.OSInfo.platform;
		if(!OSInfo) OSInfo = TOUCHENEX_UTIL.getOSInfo().platform;
		if (OSInfo == "LINUX") return true;
		return false;
	},
	isMobile : function() {
		var OSInfo = TOUCHENEX_CONST.OSInfo.platform;
		if(!OSInfo) OSInfo = TOUCHENEX_UTIL.getOSInfo().platform;
		if (OSInfo == "iOS" || OSInfo == "Android" || OSInfo == "Windows Phone") return true;
		return false;
	},
	getBrowserInfo : function(){
		var
			tp = navigator.platform,
			N= navigator.appName,
			ua= navigator.userAgent,
			tem;
		var result, M;
		
		//exlog("appName", N);
		//exlog("userAgent", ua);
		
		// if Edge
		M = ua.match(/(edge)\/?\s*(\.?\d+(\.\d+)*)/i);
		M = M ? {"browser":"Edge", "version":M[2]} : M;
		
		// if opera
		if(!M){
			M = ua.match(/(opera|opr)\/?\s*(\.?\d+(\.\d+)*)/i);
			if(M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
			M = M ? {"browser":"Opera", "version":M[2]} : M;
		}
		
		// if IE7 under
		/*
		if(!M) {
			M = ua.match(/MSIE ([67].\d+)/);
			if(M) M = {"browser":"MSIE", "version":M[1]};
		}
		*/
		
		// others
		if(!M) {
			M = ua.match(/(msie|trident|chrome|safari|firefox)\/?\s*(\.?\d+(\.\d+)*)/i);
			if(M){
				if((tem = ua.match(/rv:([\d]+)/)) != null) {
					M[2] = tem[1];
				} else if((tem = ua.match(/version\/([\.\d]+)/i)) != null) {
					M[2] = tem[1];
				}
				if(M[1] == "Trident") M[1] = "MSIE";
				M = M? {"browser":M[1], "version":M[2]} : {"browser":N, "version1":navigator.appVersion,"other":'-?'};
			}
		}
		
		if(!M){
			if(typeof Proxy){
				M = {"browser":"Edge", "version":""};
			}
		}
		
		if(!M){
			return {"browser":"UNDEFINED", "version":""};
		}
		
		if(M.version){
			var verArr = (M.version).split(".");
			M.version = verArr[0];
		}
		
		// bit
		if(tp){
			if(tp.toLowerCase().indexOf("win64") != -1){
				M.bit = "64";
			} else if (tp.toLowerCase().indexOf("win32") != -1){
				M.bit = "32";
			} else {
				M.bit = "";
			}
		}
		
		result = M;
		
		//exlog("CrossEXUtil.getBrowserInfo", result);
		return result;
	},
	getBrowserVer : function() {
		var browserInfo = TOUCHENEX_CONST.browserInfo;
		if(!browserInfo) browserInfo = TOUCHENEX_UTIL.getBrowserInfo();
		return browserInfo.version;
	},
	getBrowserBit : function() {
		var browserInfo = TOUCHENEX_CONST.browserInfo;
		if(!browserInfo) browserInfo = TOUCHENEX_UTIL.getBrowserInfo();
		return browserInfo.bit;
	},
	isIE : function() {
		var browserInfo = TOUCHENEX_CONST.browserInfo;
		if(!browserInfo) browserInfo = TOUCHENEX_UTIL.getBrowserInfo();
		if(browserInfo.browser.toLowerCase().indexOf("msie") != -1) {
			return true;
		} else {
			return false;
		}
	},
	isEdge : function() {
		var browserInfo = TOUCHENEX_CONST.browserInfo;
		if(!browserInfo) browserInfo = TOUCHENEX_UTIL.getBrowserInfo();
		if(browserInfo.browser.toLowerCase().indexOf("edge") != -1) {
			return true;
		} else {
			return false;
		}
	},
	isChrome : function() {
		// Chrome 1+
		//return !!window.chrome;
		var browserInfo = TOUCHENEX_CONST.browserInfo;
		if(!browserInfo) browserInfo = TOUCHENEX_UTIL.getBrowserInfo();
		if(browserInfo.browser.toLowerCase().indexOf("chrome") != -1) {
			return true;
		} else {
			return false;
		}
	},
	isFirefox : function() {
		// Firefox 1.0+
		//return typeof InstallTrigger !== 'undefined';
		var browserInfo = TOUCHENEX_CONST.browserInfo;
		if(!browserInfo) browserInfo = TOUCHENEX_UTIL.getBrowserInfo();
		if(browserInfo.browser.toLowerCase().indexOf("firefox") != -1) {
			return true;
		} else {
			return false;
		}
	},
	isOpera : function() {
		// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
		//return !!window.opera || navigator.userAgent.indexOf('Opera') >= 0  || navigator.userAgent.indexOf('OPR') >= 0;
		
		var browserInfo = TOUCHENEX_CONST.browserInfo;
		if(!browserInfo) browserInfo = TOUCHENEX_UTIL.getBrowserInfo();
		if(browserInfo.browser.toLowerCase().indexOf("opera") != -1) {
			return true;
		} else {
			return false;
		}
	},
	isSafari : function() {
		// At least Safari 3+: "[object HTMLElementConstructor]"
		//return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
		var browserInfo = TOUCHENEX_CONST.browserInfo;
		if(!browserInfo) browserInfo = TOUCHENEX_UTIL.getBrowserInfo();
		if((browserInfo.browser).toLowerCase().indexOf("safari") != -1) {
			return true;
		} else {
			return false;
		}
	},
	typeEX : function() {
		if (TOUCHENEX_UTIL.isWin() && TOUCHENEX_UTIL.isIE()) return true;
		return false;
	},
	typeEdge : function() {
		if (TOUCHENEX_UTIL.isWin() && TOUCHENEX_UTIL.isEdge()) return true;
		return false;
	},
	typeExtension : function() {
		if (
			(TOUCHENEX_UTIL.isWin() || TOUCHENEX_UTIL.isMac() || TOUCHENEX_UTIL.isLinux()) &&
			(TOUCHENEX_UTIL.isChrome() || TOUCHENEX_UTIL.isFirefox() || (TOUCHENEX_UTIL.isOpera() && TOUCHENEX_UTIL.getBrowserVer() > 26))
		) return true;
		//if (TOUCHENEX_UTIL.isChrome() || (TOUCHENEX_UTIL.isOpera() && TOUCHENEX_UTIL.getBrowserVer() > 20)) return true;
		return false;
	},
	typePlugin : function() {
		if ((TOUCHENEX_UTIL.isWin() || TOUCHENEX_UTIL.isMac()) && (TOUCHENEX_UTIL.isSafari())) return true;
		//if (TOUCHENEX_UTIL.isSafari() || TOUCHENEX_UTIL.isFirefox() || (TOUCHENEX_UTIL.isOpera() && TOUCHENEX_UTIL.getBrowserVer() < 20)) return true;
		return false;
	},
	typeDaemon : function(){
		//"max supportBrowser": ["EDGE","CHROME","FIREFOX","OPERA","MSIE"]
		if(TOUCHENEX_UTIL.getOSInfo().platform == "WINDOWS" && TOUCHENEX_UTIL.getOSInfo().name == "10"){
			var daemonInfo = keysharpnxInfo.exEdgeInfo;
			var browserType = TOUCHENEX_UTIL.getBrowserInfo().browser;
			if(daemonInfo && daemonInfo.isUse
					&& daemonInfo.supportBrowser instanceof Array
					&& daemonInfo.supportBrowser.length > 0){
				for(var i = 0; i < daemonInfo.supportBrowser.length; i++){
					var reqBrowser = daemonInfo.supportBrowser[i];
					if(browserType.toUpperCase() == reqBrowser.toUpperCase()){
						return true;
					}
				}
			}
		}
		return false;
	},
	typeDaemonEX : function(pp){
		//20160620 추가 - 공통 사용하도록 수정
		//"max supportBrowser": ["EDGE","CHROME","FIREFOX","OPERA","MSIE"]
		if(TOUCHENEX_UTIL.getOSInfo().platform == "WINDOWS"){
			var daemonInfo = pp.exEdgeInfo;
			var browserType = TOUCHENEX_UTIL.getBrowserInfo().browser;
			if(daemonInfo && daemonInfo.isUse
					&& daemonInfo.supportBrowser instanceof Array
					&& daemonInfo.supportBrowser.length > 0){
				for(var i = 0; i < daemonInfo.supportBrowser.length; i++){
					var reqBrowser = daemonInfo.supportBrowser[i];
					if(browserType.toUpperCase() == reqBrowser.toUpperCase()){
						return true;
					}
				}
			}
		}
		return false;
	},
	chkOS : function(localOS, reqOS){
		//exlog("_UTIL.chkOS.localOS", localOS);
		//exlog("_UTIL.chkOS.reqOS", reqOS);
		var os = localOS.platform.toUpperCase();
		var ver = localOS.version;
		if(os == "WINDOWS" || os == "MACOSX" || os == "LINUX"){
			var reqVer = eval("reqOS." + os);
			if(reqVer){
				if(reqVer == "PASS" || reqVer == "ALL"){
					return true;
				} else if(reqVer == "NO"){
					return false;
				} else {
					if(ver == "UNKNOWN") return false;
					if(this.diffVersionOS(ver, reqVer)){
						return true;
					} else {
						if(this.isWin() && this.isSafari()){
							// windows safari는 win8 이상은 모두 6.2로 표시
							if(ver == "6.2" && (reqVer == "6.2" || reqVer == "6.3" || reqVer == "10.0")){
								return true;
							}
						}
					}
				}
			}
		}
		return false;
	},
	chkBrowser : function(localBrowser, reqBrowser){
		//exlog("_UTIL.chkBrowser.localBrowser", localBrowser);
		//exlog("_UTIL.chkBrowser.reqBrowser", reqBrowser);
		var browser = localBrowser.browser;
		var ver = parseInt(localBrowser.version);
		
		var reqVer = eval("reqBrowser." + browser.toUpperCase());
		if(!reqVer){
			if(this.isWin() && this.isSafari()){
				reqVer = reqBrowser.SAFARI_WIN;
			} else if(this.isMac() && this.isSafari()){
				reqVer = reqBrowser.SAFARI_MAC;
				//return false;
			} else {
				return false;
			}
		}
		
		if(reqVer){
			if(reqVer == "PASS" || reqVer == "ALL"){
				return true;
			} else if(reqVer == "NO"){
				return false;
			} else {
				reqVer = parseInt(reqVer);
				if(ver >= reqVer){
					return true;
				}
			}
		}
		return false;
	},
	createId : function() {
		//var id = new Date().getTime() + "_" + Math.floor(Math.random() * 10000)+1;
		var id = new Date().getTime() + "_" + TOUCHENEX_UTIL.random();
		//exlog("TOUCHENEX_UTIL.createId.id", id);
		return id;
	},
	/**
	 * true : 기존 설치된 모듈이 버전 더 높거나 같음
	 * false : 기존 설치된 모듈이 버전이 낮음. 업그레이드가 필요함.
	 */
	diffVersion : function( curVersion, svrVersion ) {
		if(svrVersion == undefined)
			return true;
		exlog("_UTIL.diffVersion.client version", curVersion);
		exlog("_UTIL.diffVersion.server version", svrVersion);
	    var index;
	    try {
	    	index = curVersion.indexOf('version:', 0);
	    } catch (e){
	    	return false;
	    }
	    
	    if(index >= 0) {
	        curVersion = curVersion.substring(index + 8, curVersion.length);
	        var arrayOldVersion = curVersion.split('.');
	        if(arrayOldVersion.length < 4) arrayOldVersion = curVersion.split(',');
	        if(arrayOldVersion.length < 4) return false;
	        var arrayNewVersion = svrVersion.split('.');

	        for(var i = 0; i < 4; i++) {
	        	if (parseInt(arrayOldVersion[i], 10) > parseInt(arrayNewVersion[i], 10)) {
	        		return true;
	        	} else if (parseInt(arrayOldVersion[i], 10) < parseInt(arrayNewVersion[i], 10)) {
	        		return false;
	        	}
	        }
	        return true;
	    } else {
	        var arrayOldVersion = curVersion.split('.');
	        if(arrayOldVersion.length < 4) arrayOldVersion = curVersion.split(',');
	        if(arrayOldVersion.length < 4) return false;	        
	        var arrayNewVersion = svrVersion.split('.');
	        
	        for(var i = 0; i < 4; i++) {
	        	if (parseInt(arrayOldVersion[i], 10) > parseInt(arrayNewVersion[i], 10)) {
	        		return true;
	        	} else if (parseInt(arrayOldVersion[i], 10) < parseInt(arrayNewVersion[i], 10)) {
	        		return false;
	        	}
	        }
	        return true;
	    }
	},
	diffVersionOS : function( curVersion, svrVersion ){
        var arrayOldVersion = curVersion.split('.');
        var arrayNewVersion = svrVersion.split('.');
        
		if(isNaN(parseInt(arrayOldVersion[0], 10))) return false;
        for(var i = 0; i < arrayNewVersion.length; i++) {
        	if (parseInt(arrayOldVersion[i], 10) > parseInt(arrayNewVersion[i], 10)) {
        		return true;
        	} else if (parseInt(arrayOldVersion[i], 10) < parseInt(arrayNewVersion[i], 10)) {
        		return false;
        	}
        }
        return true;
	},
	chkCrossEXDiv : function() {
		if(TOUCHENEX_UTIL.typeEX()){
			// div, iframe, form, script name _CONST set...
			TOUCHENEX_CONST.exDivName = "crossexDiv";
			TOUCHENEX_CONST.exIframeName = "crossexIfr";
			TOUCHENEX_CONST.exScriptName = "crossexScr";
			TOUCHENEX_CONST.exFormName = "__CROSSEX_FORM__";
			TOUCHENEX_CONST.exFormDataName = "__CROSSEX_DATA__";
			
			var chk = document.getElementById(TOUCHENEX_CONST.exDivName);
			if(!chk) {
				var exDiv = document.createElement("div");
				exDiv.id = TOUCHENEX_CONST.exDivName;
				exDiv.style.display = "none";
				
				if(document.body) {
						document.body.appendChild(exDiv);
				} else {
					exalert("_UTIL.chkCrossEXDiv", "body 태그를 생성해 주십시오");
					return;
				}
					
				var exIframe = "<iframe ";
					exIframe += "name='" + TOUCHENEX_CONST.exIframeName + "' ";
					exIframe += "id='" + TOUCHENEX_CONST.exIframeName + "' ";
					exIframe += "src='" + TOUCHENEX_CONST.blankPath + "' ";
					exIframe += "width=0 height=0 border=0";
					exIframe += "></iframe>";
					chk = document.getElementById(TOUCHENEX_CONST.exDivName);
					chk.innerHTML = exIframe;
					
				var exForm = document.createElement("form");
				exForm.method = "POST";
				exForm.id = TOUCHENEX_CONST.exFormName;
				exForm.name = TOUCHENEX_CONST.exFormName;
				
				var exNode = document.createElement("input");
				exNode.type = "hidden";
				exNode.id = TOUCHENEX_CONST.exFormDataName;
				exNode.name = TOUCHENEX_CONST.exFormDataName;
				
				exForm.appendChild(exNode);
				exDiv.appendChild(exForm);
			}
		}
			
		return;
	},
	loadScript : function( url ) {
		
		var newScript = document.createElement("script");
		newScript.id = TOUCHENEX_CONST.exScriptName;
		newScript.type = "text/javascript";
		if(newScript.readyState) { // IE8 under
			newScript.onreadystatechange = function() {
				exlog("_UTIL.loadScript.readyState", newScript.readyState);
				if (newScript.readyState == 'loading' || newScript.readyState == 'loaded') {
					newScript.onreadystatechange = null;
					exlog("_UTIL.loadScript", "loadScript load error");
					//exalert("_UTIL.loadScript", "loadScript load error");
				}
			};
		} else {
			newScript.onerror = function() {
				exlog("_UTIL.loadScript", "loadScript load error");
				//exalert("_UTIL.loadScript", "loadScript load error");
			};
		}
		
		try {
			newScript.src = url;
		} catch (e) {
			exlog("_UTIL.loadscript", "LoadScript not https load error");
			//exalert("_UTIL.loadScript", "LoadScript not https load error");
		}
		//exlog("TOUCHENEX_UTIL.loadScript", url);
		//document.getElementsByTagName("head")[0].appendChild(newScript);
		eval(TOUCHENEX_CONST.exDivName).appendChild(newScript);
	},
	random : function(){
		try{
			if(!window['_ex_m_w']) window['_ex_m_w'] = 123456789;
			if(!window['_ex_m_z']) window['_ex_m_z'] = 987654321;
			if(!window['_ex_mask']) window['_ex_mask'] = 0xffffffff;
			
			_ex_m_z = (36969 * (_ex_m_z & 65535) + (_ex_m_z >> 16)) & _ex_mask;
			_ex_m_w = (18000 * (_ex_m_w & 65535) + (_ex_m_w >> 16)) & _ex_mask;
		    var result = ((_ex_m_z << 16) + _ex_m_w) & _ex_mask;
		    result /= 4294967296;
		    return parseInt((result + 0.5) * 1000000).toString();
		} catch(e){
			return '';
		}
	}
};

window.exlog = TOUCHENEX_UTIL.exlog;
window.exalert = TOUCHENEX_UTIL.exalert;