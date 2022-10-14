(function($) {

var Teddypass = new function(){

	function getTeddyUrl() {
		var url = location.href;
		var arrUrlParts = url.match(/^(https?):\/\/(.[^/]+)/i);
		if (arrUrlParts === null)
			throw "Teddypass can not be initialized on this page: " + url;
		var protocol = arrUrlParts[1];
		var domain = arrUrlParts[2];
		var tld = domain.split(".").reverse()[0];
	//	tld = 'local'; //DEBUG
		if (tld !== 'local'){
			tld = 'com';
			protocol = 'https';
		} else {
			protocol = 'http';
		}
		return protocol + "://www.teddyid." + tld;
	}
	
	function getSiteUrl(){
		var matches = location.href.match(/^https?:\/\/[^\/]+/i); 
		return (matches && matches.length>0) ? matches[0] : null;
	}

	var node_id;
	var site = getSiteUrl();
	var teddy_url = getTeddyUrl();
	var bInExtension = (getProperty('browser_extension_origin', false) !== false); // false in IE!
	var is_firefox_extension = getProperty('is_firefox_extension', false);
	var is_ie_extension = (typeof is_ie_extension_flag !== "undefined" ? true : false);
	var peer_origin = getProperty('browser_extension_origin', teddy_url);
	var bInSafariExtension = (peer_origin.indexOf('safari-') === 0);
	var bInOperaExtension = (bInExtension && navigator.userAgent.indexOf('OPR/') !== -1);
	var bInYaBrowserExtension = (bInExtension && navigator.userAgent.indexOf('YaBrowser/') !== -1);
	
	var bOwnPayment = (is_firefox_extension || is_ie_extension || bInSafariExtension || bInOperaExtension || bInYaBrowserExtension);
	
	var bInSaveDialog = false;
	var bSaveDone = false;
	var bPasswordChangeCheckDone = false;
	var bPassed = false;
	var arrLogins;
	var assocLoginAttributesDataset;
	var arrSubmitButtons;

	var arrForms = [];
	var current_form = null;
	
	var bHasAccounts = false;
	var bSuppressLoginHintForExistingUser = false;
	var bNewLogin = false;

	var iframe = null;
	var popup = null;
	var scheduled_message = null;
	var bNeedTopWindow = (navigator.vendor && navigator.vendor.indexOf('Apple') !== -1);
	var bLoadedIframe = false;
	var receivedLogin = null;
	var receivedPassword = null;
	var savedLogin = null;
	var savedPassword = null;
	var generatedPassword = null;
	
	var licenseResult =  null;
	var prevLicenseResult = null;
	var bDisabled = false;
	var submit_type_enum = {
		unknown: 0,
		submit : 1,
		submit_override: 2,
		click: 3
	};
	var submit_type = submit_type_enum.unknown;
	var last_click_event = {element: null, time: 0};
	var click_counter = 0;
	
	var HUE_LIMIT = 320;

	function loadServerFrame(){
		if (is_firefox_extension)
			loadFirefoxFrame();
		else if (bInSafariExtension)
			loadSafariFrame();
		else
			loadAuthIframe();
	}

	function loadAuthIframe(){
		var widgetRect = getWidgetRect();
		var src = bInExtension
			? peer_origin + "/proxy-iframe.html#"+location.href
			: teddy_url + "/teddypass.php?node_id="+node_id+(is_ie_extension ? '#^ie' : '');
		
		$("#teddypass_iframediv").html('<iframe src="'+src+'" frameborder="0"></iframe>');
		var $iframe = $("#teddypass_iframediv iframe");
		$iframe.css('top', widgetRect.top+'px');
		$iframe.css('left', widgetRect.left+'px');
		$iframe.css('width', widgetRect.width+'px');
		$iframe.css('min-width', widgetRect.width+'px');
		$iframe.css('height', widgetRect.height+'px');
		iframe = $iframe.get(0).contentWindow;
		if (window.addEventListener)
			window.addEventListener("message", receiveMessage, false);
		else if (window.attachEvent)
			window.attachEvent("onmessage", receiveMessage);
		
		if (bInExtension && !bOwnPayment) {
			requestLicenseStatus();
		}
	}
	
	function requestLicenseStatus(bInteractive) {
		// forward the message to background
		var message = {command: "getLicenseStatus"};
		if (bInteractive)
			message.params = {interactive: true};
		chrome.runtime.sendMessage(message, function(response) {
			response.extension_id = chrome.runtime.id;
			if (prevLicenseResult && prevLicenseResult.licenseStatus !== response.licenseStatus)
				response.bUpdated = true;
			prevLicenseResult = licenseResult = response;
			addLicenseNotice();
		});
	}
	
	function loadSafariFrame(){
		safari.self.addEventListener("message", receiveMessage, false);
		window.addEventListener("message", receiveMessage, false); // receive from popup
		sendXdmCommand("init", {});
	}
	
	function loadFirefoxFrame(){
		var widgetRect = getWidgetRect();
		popup = new function(){
			this.postMessage = function(message, from) {
				self.port.emit("message", message);
			};
			this.reload = function(){
				this.postMessage(JSON.stringify({
					command:'reload',
					params: {
						url: teddy_url + "/teddypass.php?node_id="+node_id+"#"+location.href+"^firefox",
						rect: widgetRect
					}
				}));
			};
		};
		
		self.port.on("message", function(message){
			var event = {};
			event.source = popup;
			event.origin = peer_origin;
			event.data = message;
			receiveMessage(event);
		});
		
		$(window).bind('beforeunload', function(){
			if (!bInSaveDialog)
				sendXdmCommand("on_unload",{});
			else
				sendXdmCommand("close_after_save_done",{});
		});
		
		sendXdmCommand("init_complete",{});
		popup.reload();
	};
	
	function addLicenseNotice(){
		var WARN_WHEN_DAYS_LEFT = 7;
		var EXTEND_FOR_DAYS = 3;
		bDisabled = false;
		if (!licenseResult)
			return;
	//	licenseResult.daysOver=1;
	//	licenseResult.licenseStatus = "FREE_TRIAL_EXPIRED";
		if (licenseResult.bUpdated && licenseResult.licenseStatus === "FULL"){ // remove license notices
			$('.teddypass_license').html('');
			return;
		}
		if (licenseResult.licenseStatus === "FULL" 
				|| licenseResult.licenseStatus === "FREE_TRIAL" && licenseResult.daysLeft > WARN_WHEN_DAYS_LEFT)
			return;
		
		var text = null;
		var payment_anchor = bOwnPayment
			? 'href="'+teddy_url+'/buy.php" target="_blank"'
			: 'href="https://chrome.google.com/webstore/detail/teddyid-password-manager/'+licenseResult.extension_id+'" target="_blank"';
		var pay_now_text = ' <a '+payment_anchor+'>'+TeddypassDictionary.getPayNow()+'</a>.';
		if (licenseResult.licenseStatus === "FREE_TRIAL" && licenseResult.daysLeft <= WARN_WHEN_DAYS_LEFT)
			text = TeddypassDictionary.getTrialExpires(licenseResult.daysLeft) + pay_now_text;
		else if (licenseResult.licenseStatus === "FREE_TRIAL_EXPIRED" && licenseResult.daysOver <= EXTEND_FOR_DAYS)
			text = TeddypassDictionary.getExtendedDaysLeft(EXTEND_FOR_DAYS - licenseResult.daysOver) + pay_now_text;
		else if (licenseResult.licenseStatus === "FREE_TRIAL_EXPIRED"){
			text = TeddypassDictionary.getTrialExpired(payment_anchor);
			bDisabled = true;
		}
		else
			return;
		console.log("adding trial notice");
		
		if (text){
			if (!licenseResult.online && !bOwnPayment)
				text += '<br/>'+TeddypassDictionary.getIfPaid()+' <a href="#signin" class="teddypass_signin_to_chrome">'+TeddypassDictionary.getSignInToChrome()+'</a>.';
			// enclose into <p>
			text = '<p class="teddypass_license">'+text+'</p>';
			if (bDisabled)
				text = '<a href="https://www.teddyid.com/" target="_blank"><img src="'+peer_origin+'/images/main/teddy_logo_small.png" width="64" height="33" /></a>' + text;
			var set = $("#teddypass_loginlist,#teddypass_login_hint,#teddypass_firstlogin_hint,#teddypass_signup_hint")
				.filter(function(){
					return !$(this).children().is('.teddypass_license');
				});
			bDisabled ? set.html(text) : set.append(text);
			$(".teddypass_signin_to_chrome").click(function(){
				requestLicenseStatus(true);
				return false;
			});
		}
	}
	
	/*
	 * cross browser keyboard event (https://gist.github.com/termi/4654819)
	 */
	_initKeyboardEvent_type = function (e) {
		try {
			e.initKeyboardEvent("keyup", false, false, this, "+", 3, true, false, true, false, false);
			return(e["keyIdentifier"] || e["key"]) === "+" && (e["keyLocation"] || e["location"]) === 3 && (e.ctrlKey ? e.altKey ? 1 : 3 : e.shiftKey ? 2 : 4) || 9;
		} catch (__e__) {
			_initKeyboardEvent_type = 0;
		}
	}(document.createEvent("KeyboardEvent")), _keyboardEvent_properties_dictionary = {"char": "", "key": "", "location": 0, "ctrlKey": false, "shiftKey": false, "altKey": false, "metaKey": false, "repeat": false, "locale": "", "detail": 0, "bubbles": true, "cancelable": false, "keyCode": 0, "charCode": 0, "which": 0}, own = Function.prototype.call.bind(Object.prototype.hasOwnProperty), _Object_defineProperty = Object.defineProperty || function (obj, prop, val) {
		if ("value" in val) {
			obj[prop] = val["value"];
		}
	};
	function crossBrowser_initKeyboardEvent(type, dict) {
		var e;
		if (_initKeyboardEvent_type) {
			e = document.createEvent("KeyboardEvent");
		} else {
			e = document.createEvent("Event");
		}
		var _prop_name, localDict = {};
		for (_prop_name in _keyboardEvent_properties_dictionary) {
			if (own(_keyboardEvent_properties_dictionary, _prop_name)) {
				localDict[_prop_name] = (own(dict, _prop_name) && dict || _keyboardEvent_properties_dictionary)[_prop_name];
			}
		}
		var _ctrlKey = localDict["ctrlKey"], _shiftKey = localDict["shiftKey"], _altKey = localDict["altKey"], _metaKey = localDict["metaKey"], _altGraphKey = localDict["altGraphKey"], _modifiersListArg = _initKeyboardEvent_type > 3 ? ((_ctrlKey ? "Control" : "") + (_shiftKey ? " Shift" : "") + (_altKey ? " Alt" : "") + (_metaKey ? " Meta" : "") + (_altGraphKey ? " AltGraph" : "")).trim() : null, _key = localDict["key"] + "", _char = localDict["char"] + "", _location = localDict["location"], _keyCode =
				localDict["keyCode"] || (localDict["keyCode"] = _key && _key.charCodeAt(0) || 0), _charCode = localDict["charCode"] || (localDict["charCode"] = _char && _char.charCodeAt(0) || 0), _bubbles = localDict["bubbles"], _cancelable = localDict["cancelable"], _repeat = localDict["repeat"], _locale = localDict["locale"], _view = this;
		localDict["which"] || (localDict["which"] = localDict["keyCode"]);
		if ("initKeyEvent" in e) {
			e.initKeyEvent(type, _bubbles, _cancelable, _view, _ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _charCode);
		} else {
			if (_initKeyboardEvent_type && "initKeyboardEvent" in e) {
				if (_initKeyboardEvent_type === 1) {
					e.initKeyboardEvent(type, _bubbles, _cancelable, _view, _key, _location, _ctrlKey, _shiftKey, _altKey, _metaKey, _altGraphKey);
				} else {
					if (_initKeyboardEvent_type === 2) {
						e.initKeyboardEvent(type, _bubbles, _cancelable, _view, _ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _charCode);
					} else {
						if (_initKeyboardEvent_type === 3) {
							e.initKeyboardEvent(type, _bubbles, _cancelable, _view, _key, _location, _ctrlKey, _altKey, _shiftKey, _metaKey, _altGraphKey);
						} else {
							if (_initKeyboardEvent_type === 4) {
								e.initKeyboardEvent(type, _bubbles, _cancelable, _view, _key, _location, _modifiersListArg, _repeat, _locale);
							} else {
								e.initKeyboardEvent(type, _bubbles, _cancelable, _view, _char, _key, _location, _modifiersListArg, _repeat, _locale);
							}
						}
					}
				}
			} else {
				e.initEvent(type, _bubbles, _cancelable);
			}
		}
		for (_prop_name in _keyboardEvent_properties_dictionary) {
			if (own(_keyboardEvent_properties_dictionary, _prop_name)) {
				if (e[_prop_name] != localDict[_prop_name]) {
					try {
						delete e[_prop_name];
						_Object_defineProperty(e, _prop_name, {writable: true, "value": localDict[_prop_name]});
					} catch (e) {
					}
				}
			}
		}
		return e;
	}

	function simulateKeyboardEvent(obj){
		var arrTypes = ["change", "keypress", "keyup", "keydown", "input"];
		for (var i=0; i<arrTypes.length; i++) {
			var event = crossBrowser_initKeyboardEvent(arrTypes[i], {});
			obj.dispatchEvent(event);
		}
	}
	
	function receiveMessage(event){	
		var message = null;
		if (bInSafariExtension && !event.source && !event.data){
			if (event.name === "message")
				message = event.message;
			else
				throw "unrecognized event name: "+event.name;
		}
		else{
			if (!(event.source === iframe || popup && event.source === popup)){
				console.log("event.source !== teddy, message="+event.data);
				return;
			}
			if (!(event.origin === peer_origin || bInSafariExtension && event.origin === teddy_url)){
				console.log("unexpected origin: " + event.origin);
				return;
			}
			message = event.data;
		}
		console.log("teddypass Receive: " + message); // DEBUG
		var objMessage;
		try { objMessage = JSON.parse(message); } catch(e) { return; }
		var command = objMessage.command;
		var params = objMessage.params;
		if (command === "close")
			destroyAuthIframe();
		else if (command === "onLicenseStatus"){
			licenseResult = params;
			addLicenseNotice();
		}
		else if (command === "onOpened"){
			// (from safari popup) code moved to storeLoginAttributesDataset
		}
		else if (command === "onClosed")
			popup = null;
		else if (command === "setHeight"){
			var height = params.height;
		//	console.log("received height "+height);
			var top = Math.max(getWindowHeight()/2 - height/2, 10);
			if (!is_firefox_extension)
				top += $(window).scrollTop();
			resizeFrame({height: height, top: top});
		}
		else if (command === "fillCredentials"){
			receivedLogin = params.login;
			receivedPassword = params.password;

			hide_teddypass();
			var objForm = arrForms[getCurrentFormIndex()];
			
			objForm.login_field.value = params.login;
			simulateKeyboardEvent(objForm.login_field);
			
			if (objForm.type !== "two_step_login") {
				objForm.password_field.value = params.password;
				simulateKeyboardEvent(objForm.password_field);
			}
			
			var autoSubmit = getUserProperty('auto_submit', params.login, getProperty('auto_submit', 'auto'));
			if(autoSubmit === 'yes' || autoSubmit === 'no') {
				if(autoSubmit === 'yes') {
					submitCurrentForm();
				}
			}
			else {
				if (!hasOtherFieldsToFill(current_form)){
					submitCurrentForm();
				}
			}
			
			// second step
			if (objForm.type === "two_step_login") {
				var fill_interval = setInterval(function() {
					if (!objForm.password_field)
						return;
					objForm.password_field.value = params.password;
					simulateKeyboardEvent(objForm.password_field);
					submitCurrentForm();
					clearInterval(fill_interval);
				}, 100);
			}
		}
		else if (command === "onPasswordSaveDone"){
			hide_teddypass();
			bInSaveDialog = false;
			bSaveDone = true;
			if (typeof params.error !== "undefined") {
				alert(TeddypassDictionary["getPassword"+params.error]());
			}
			submitCurrentForm();
			setTimeout(function(){
				bPassed = false;
				bSaveDone = false; // reset the state if the page was not unloaded (submit was stopped by internal validators)
			}, 1000);
		}
		else if (command === "onPasswordChangeCheckDone"){
			hide_teddypass();
			bPasswordChangeCheckDone = true;
			submitCurrentForm();
		}
		else if (command === "storeLoginAttributesDataset"){
			assocLoginAttributesDataset = params.assocLoginAttributesDataset;
			arrLogins = [];
			for (var full_login in assocLoginAttributesDataset) {
				arrLogins.push({
					full_login: full_login,
					naked_login: assocLoginAttributesDataset[full_login].login
				});
			}
			bHasAccounts = params.bHasAccounts;
			bSuppressLoginHintForExistingUser = params.bSuppressLoginHintForExistingUser;
			if (typeof params.arrSubmitButtons !== "undefined")
				arrSubmitButtons = params.arrSubmitButtons;
			
			attachFieldEventHandlers();
			
			// safari
			if (popup && !is_firefox_extension){
				if (!scheduled_message)
					throw "no scheduled_message";
				popup.postMessage(scheduled_message, teddy_url);
				scheduled_message = null;
			}
		}
		else if (command === "reset"){
			removeHint('login');
			if (is_firefox_extension) {
				console.log("reset");
				popup.reload();
				hide_teddypass();
			} 
			else {
				destroyAuthIframe(); // todo: destroy firefox frame?
				loadServerFrame();
			}
		}
		else if (command === "onPasswordGenerated"){
			var max_password_length = getProperty('max_password_length');
			if (max_password_length)
				params.password = params.password.substr(0, max_password_length);
			var password_allowed_chars = getProperty('password_allowed_chars');
			if (password_allowed_chars)
				params.password = params.password.replace(new RegExp('[^'+password_allowed_chars+']', 'g'), '');
			var objForm = arrForms[getCurrentFormIndex()];
			generatedPassword = params.password;
			objForm.password1_field.value = params.password;
			simulateKeyboardEvent(objForm.password1_field);
			if (objForm.password2_field)
				objForm.password2_field.value = params.password;
			removeHint('signup');
		}
		else if (command === "show"){
			$("#teddypass_div").show();
			sendXdmCommand("onShown", {});
		}
		else if (command === "hide"){
			hide_teddypass();
		}
		else if(command === "hideLoginStr") {
			$(".loginlist_item_" + params.login.replace(/\W/g, "")).hide();
		}
	}

	function getWidgetRect(){
		var widget_width = 500;
		var widget_height = 100;
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		if (!windowWidth){ // IE 6-8
			if (document.body && document.body.offsetWidth) {
				windowWidth = document.body.offsetWidth;
				windowHeight = document.body.offsetHeight;
			}
			else if (document.compatMode==='CSS1Compat' &&
					document.documentElement &&
					document.documentElement.offsetWidth ) {
				windowWidth = document.documentElement.offsetWidth;
				windowHeight = document.documentElement.offsetHeight;
			}
			if (!windowWidth){
				windowWidth = 600;
				windowHeight = 400;
			}
		}
		var widget_left = Math.max(windowWidth/2 - widget_width/2, 10) - parseInt($("body").css("margin-left"));;
		var widget_top = Math.max(windowHeight/2 - widget_height/2, 10);
		return {
			left: widget_left,
			top: widget_top,
			width: widget_width,
			height: widget_height
		};
	}

	function getWindowHeight(){
		var windowHeight = window.innerHeight;
		if (!windowHeight){ // IE 6-8
			if (document.body && document.body.offsetWidth) {
				windowHeight = document.body.offsetHeight;
			}
			else if (document.compatMode==='CSS1Compat' &&
					document.documentElement &&
					document.documentElement.offsetWidth ) {
				windowHeight = document.documentElement.offsetHeight;
			}
			if (!windowHeight){
				windowHeight = 400;
			}
		}
		return windowHeight;
	}

	function resizeFrame(params) {
		if (is_firefox_extension)
			sendXdmCommand("set_height", params);
		else
			$("#teddypass_iframediv iframe").animate({height: params.height+"px", top: params.top+"px"});
	}
	
	function hide_teddypass(){
		$("#teddypass_div").hide();
		if (is_firefox_extension)
			sendXdmCommand('hide_panel', {});
	}
	
	function destroyAuthIframe(){
		document.getElementById("teddypass_iframediv").innerHTML = "";
		hide_teddypass();
	}
	
	function supportsLocalStorage() {
		try {
			if ('localStorage' in window && window['localStorage'] !== null){
				localStorage.setItem('test', 'test');
				localStorage.removeItem('test');
				return true;
			}
			else
				return false;
		}
		catch (e) {
		//	console.log(e);
			return false;
		}
	}
	
	function getFormIndexBySubmitButton(submit_button){
		for (var i=0; i<arrForms.length; i++)
			if (arrForms[i].submit_button === submit_button)
				return i;
		throw "failed to find form index by submit button";
	}
	
	function getFormIndexByForm(form){
		for (var i=0; i<arrForms.length; i++)
			if (arrForms[i].form === form)
				return i;
		throw "failed to find form index by form, form="+form;
	}
	
	function getCurrentFormIndex(){
		return getFormIndexByForm(current_form);
	}
	
	function alreadyHaveForm(form){
		for (var i=0; i<arrForms.length; i++)
			if (arrForms[i].form === form){
			//	console.log("already have form "+i+'/'+arrForms.length);
				return true;
			}
		return false;
	}
	
	function submitCurrentForm(){
		var objForm = arrForms[getCurrentFormIndex()];
		
		var click_submit_button = function() {
			var btn = $(objForm.submit_button);
			var href = btn.attr('href');
			if (href)
				href = href.trim().toLowerCase();
			if (href && href.indexOf('javascript:') === 0 && href.indexOf('javascript:void(') === -1) {
				handleSubmit(objForm); // manual call because we will skip our handlers in case of location change (no submit fired)
				location.href = href;
			} else
				btn[0].click();
		};
		
		switch (submit_type) {
			case submit_type_enum.submit:
				$(objForm.form).submit();
				break;
			case submit_type_enum.submit_override:
				objForm.form.submit();
				break;
			case submit_type_enum.click:
				click_submit_button();
				break;
			case submit_type_enum.unknown:
			default: // login in with saved password, no remembered previous submit type
				if (objForm.submit_button)
					click_submit_button();
				else if (objForm.form)
					$(objForm.form).submit();
				else
					console.log("can't submit form");
		}
	}
	
	function hasOtherFieldsToFill(form){
		var count_elements_to_fill = 0;
		for (var i=0; i<form.elements.length; i++){
			var element = form.elements[i];
			if (element.type === 'text' || element.type === 'textarea' || element.type === 'radio' || element.type === 'checkbox' || element.type === 'select')
				count_elements_to_fill++;
		}
		return (count_elements_to_fill > 1);
	}
	
	function getPasswordFields(form){
		var arrPasswordFields = [];
		for (var i=0; i<form.elements.length; i++){
			var element = form.elements[i];
			if (element.type === 'password' 
					&& $(element).is(':visible')
					&& element.name.toLowerCase().indexOf('cvv') === -1 
					&& element.id.toLowerCase().indexOf('cvv') === -1
					&& element.name.toLowerCase().indexOf('cvc') === -1 
					&& element.id.toLowerCase().indexOf('cvc') === -1
			)
				arrPasswordFields.push(element);
		}
		return arrPasswordFields;
	}
	
	function getNumberOfTextFields(elements){
		var count=0;
		for (var i=0; i<elements.length; i++){
			var element = elements[i];
			if ((element.type === 'text' || element.type === 'email' || element.type === 'tel' || element.type === 'url')
					&& $(element).is(':visible')
					&& element.name.toLowerCase().indexOf('otp') === -1 
					&& element.id.toLowerCase().indexOf('otp') === -1
					&& element.name.toLowerCase().indexOf('captcha') === -1 
					&& element.id.toLowerCase().indexOf('captcha') === -1)
				count++;
		}
		return count;
	}
	
	function searchForLoginField(arrTextElements) {
		if (arrTextElements.length === 1)
			return arrTextElements[0];
		if (arrTextElements.length > 1){
			var searchElementBySubstring = function(substring){
				for (var i=0; i<arrTextElements.length; i++){
					var element = arrTextElements[i];
					if (element.name.toLowerCase().indexOf(substring) !== -1 || element.id.toLowerCase().indexOf(substring) !== -1)
						return element;
				}
				return null;
			};
			var element;
			if (element = searchElementBySubstring('login'))
				return element;
			if (element = searchElementBySubstring('mail'))
				return element;
			if (element = searchElementBySubstring('name'))
				return element;
			if (element = searchElementBySubstring('user'))
				return element;
		}
		return null;
	}
	
	function getLoginField(form){
		var arrTextElements = [];
		if (form) {
			for (var i=0; i<form.elements.length; i++){
				var element = form.elements[i];
				if (!$(element).is(':visible'))
					continue;
				if (element.type === 'password') // login is always before password(s)
					break;
				if (element.type !== 'text' && element.type !== 'email' && element.type !== 'tel' || element.type === 'url')
					continue;
				if (element.name==='login' || element.name==='username')
					return element;
				else
					arrTextElements.push(element);
			}
		}
		return searchForLoginField(arrTextElements);
	}
	
	function getSubmitButton(form){
		var arrButtons = [];
		var bPassedPasswordField = false;
		for (var i=0; i<form.elements.length; i++){
			var element = form.elements[i];
			var bVisible = $(element).is(':visible');
			if (element.type === 'password' && bVisible)
				bPassedPasswordField = true;
			if (!bPassedPasswordField) // skip everything before passwords
				continue;
			if (element.type === 'submit' && bVisible)
				return element;
			else if (element.type === 'button' && bVisible)
				arrButtons.push(element);
		}
		if (arrButtons.length >= 1)
			return arrButtons[arrButtons.length - 1]; // last button

		return null;
	}
	
	var clickHandler = function(e){
		if ($(e.target).is(':checkbox'))
			return; // skip "remember me" checkbox clicks
		last_click_event = {element: e.target, time: new Date().getTime()};
		click_counter++;
	};
	function monitorClicks(){
		document.addEventListener('click', clickHandler, true);
	}
	
	function monitorKBEvents(objForm) {
		var $inputObjs = objForm.form ? $(objForm.form).find('input') : $([objForm.login_field,objForm.password_field]);
		$inputObjs.bind('change', function() {
			click_counter = 0;
		});
	}
	
	function storeButtonPath(objForm){
		var button_path = getPath(last_click_event.element);
		var password_path = getPath(objForm.password_field);
		sendXdmCommand("storeButtonPath", {button_path: button_path, password_path: password_path});
	}
	
	// dynamic ajax and native .submit() handling
	function monitorUnload(objForm) {
		window.addEventListener("beforeunload", function(e) {
			var current_date = new Date().getTime();
			if (objForm.login_field.value &&
			objForm.password_field.value &&
			click_counter === 1 && // exactly one click
			current_date - last_click_event.time < 3000) { // 3s for ajax to complete
				storeButtonPath(objForm);
			}
		});
	}
	
	// dynamic submit handling
	function checkClickedElem(objForm) {
		// 20 ms not yet passed since click and till submit -> submit button was clicked
		var current_time = (new Date()).getTime();
		if ( (!objForm.submit_button || objForm.is_dynamic_button)
				&& objForm.type === "login"
				&& current_time - last_click_event.time < 20)
		{
			storeButtonPath(objForm);
		}
	}
	
	function formExists(form){
		for (var i=0; i<document.forms.length; i++)
			if (document.forms[i] === form)
				return true;
		return false;
	}
	
	function elementExists(element){
		return (element && (element.form !== null));
	/*	var form = element.form;
		for (var i=0; i<form.elements.length; i++)
			if (form.elements[i] === element)
				return true;
		return false;*/
	}
	
	function verifyExistingForms(){
		for (var i=0; i<arrForms.length; i++){
			var objForm = arrForms[i];
			if (objForm.form === null || objForm.form.localName !== "form") // formless page
				continue;
			if (objForm.type !== "two_step_login" && (!formExists(objForm.form) || !elementExists(objForm.login_field))){
				console.log("form "+i+" is gone, removing it");
				$("#teddypass_loginlist").hide();
				arrForms.splice(i, 1);
			}
		}
	}
	
	function findCredentialsFields(){
		$("input#submit").attr("id", "teddy_renamed_submit");
		verifyExistingForms();
		var bFound = false;
		
		var signup_form_login_field = getProperty('signup_form_login_field');
		if (signup_form_login_field){
			var signup_form_password1_field = getProperty('signup_form_password1_field');
			var signup_form_password2_field = getProperty('signup_form_password2_field');
			var login_fields = $(signup_form_login_field);
			var password1_fields = $(signup_form_password1_field);
			var password2_fields = $(signup_form_password2_field);
			for (i = 0; i < login_fields.length; i++) {
				var login_field = login_fields.get(i);
				var password1_field = password1_fields.get(i);
				var password2_field = password2_fields.get(i);
				if (login_field && password1_field && !alreadyHaveForm(login_field.form)){ // password2 is optional
					var form = password1_field.form;
					var signup_form_submit_button = getProperty('signup_form_submit_button');
					var submit_button = signup_form_submit_button 
						? $(signup_form_submit_button).get(0) : getSubmitButton(form);
					arrForms.push({
						type: "signup",
						form: form,
						login_field: login_field,
						password1_field: password1_field,
						password2_field: password2_field,
						submit_button: submit_button
					});
					console.log("found predefined signup form, login="+login_field.name+", submit button = "+submit_button);
					attachSubmitHandler(form, submit_button);
					bFound = true;
				}
			}
		}
		var two_step_login = getProperty('two_step_login');
		if (two_step_login) {
			var login_form_login_field = getProperty('login_form_login_field');
			var login_form_password_field = getProperty('login_form_password_field');
			var login_form_submit_button = getProperty('login_form_submit_button');
			var submit_button = $(login_form_submit_button).get(0);
			
			try {
				var existing_form = arrForms[getFormIndexBySubmitButton(submit_button)];
			} catch(e){};
			
			var login_fields = $(login_form_login_field);
			var password_fields = $(login_form_password_field);
			if (login_fields.length)
				var login_field = login_fields[0];
			if (password_fields.length)
				var password_field = password_fields[0];
			
			var visible_fields = $(login_form_password_field+':visible, '+login_form_login_field+':visible');
			if (visible_fields.length)
				var current_field = visible_fields[0];
			
			if (current_field === login_field) { // google hack
				setTimeout(function(){
					move_hint("#teddypass_loginlist", login_field);
				}, 300);
			}
			
			if (current_field)
				bFound = true;
			
			if (current_field && !existing_form) {
				var form = current_field.form;
				var objForm = {
					type: "two_step_login",
					form: form,
					login_field: login_field,
					password_field: password_field,
					submit_button: submit_button
				};
				if (!objForm.form) {
					var common_parent = $(current_field).parents().has(objForm.submit_button).first();
					if (common_parent.length)
						objForm.form = common_parent[0];
				}
				arrForms.push(objForm);
				console.log("found predefined two step login form "+submit_button);
			}
			if (existing_form) {
				if (login_field && !existing_form.login_field)
					existing_form.login_field = login_field;
				if (password_field && !existing_form.password_field) {
					existing_form.password_field = password_field;
					attachSubmitHandler(existing_form.form, existing_form.submit_button);
				}
			}
		}
		
		var login_form_login_field = getProperty('login_form_login_field');
		if (!two_step_login && login_form_login_field){
			var login_form_password_field = getProperty('login_form_password_field');
			var login_fields = $(login_form_login_field);
			var password_fields = $(login_form_password_field);
			for (i = 0; i < login_fields.length; i++) {
				var login_field = login_fields.get(i);
				var password_field = password_fields.get(i);
				if (login_field && password_field && !alreadyHaveForm(login_field.form)){
					var form = password_field.form;
					var login_form_submit_button = getProperty('login_form_submit_button');
					var submit_button = login_form_submit_button 
						? $(login_form_submit_button).get(0) : getSubmitButton(form);
					var objForm = {
						type: "login",
						form: form,
						login_field: login_field,
						password_field: password_field,
						submit_button: submit_button
					};
					if (!objForm.form) {
						var common_parent = $(objForm.login_field).parents().has(objForm.password_field).first();
						if (common_parent.length)
							objForm.form = common_parent[0];
					}
					arrForms.push(objForm);
					attachSubmitHandler(objForm.form, submit_button);
					bFound = true;
					console.log("found predefined login form "+submit_button);
				}
			}
		}
		
		attachDynamicSubmitButtons();

		if (bFound)
			return true;
		
		var forms = document.forms;
		for (var i=0; i<forms.length; i++){
			var form = forms[i];
			if (alreadyHaveForm(form))
				continue;
			var arrPasswordFields = getPasswordFields(form);
			if (arrPasswordFields.length === 2 
					|| arrPasswordFields.length === 1 && getNumberOfTextFields(form.elements) > 1){
				var password1_field = arrPasswordFields[0];
				var password2_field = (arrPasswordFields.length === 2) ? arrPasswordFields[1] : null;
			//	console.log("found 2pass form");
				var login_field = getLoginField(form);
				if (!login_field)
					continue;
				var signup_form_submit_button = getProperty('signup_form_submit_button');
				var submit_button = signup_form_submit_button 
					? $(signup_form_submit_button).get(0) : getSubmitButton(form);
				arrForms.push({
					type: "signup",
					form: form,
					login_field: login_field,
					password1_field: password1_field,
					password2_field: password2_field,
					submit_button: submit_button
				});
				console.log("found signup form, login="+login_field.name+", submit button = "+(submit_button ? submit_button.name : 'none'));
				attachSubmitHandler(form, submit_button);
				bFound = true;
			}
			else if (arrPasswordFields.length === 1){
				var password_field = arrPasswordFields[0];
				var login_field = getLoginField(form);
				if (!login_field)
					continue;
				var login_form_submit_button = getProperty('login_form_submit_button');
				var submit_button = login_form_submit_button 
					? $(login_form_submit_button).get(0) : getSubmitButton(form);
				arrForms.push({
					type: "login",
					form: form,
					login_field: login_field,
					password_field: password_field,
					submit_button: submit_button
				});
				console.log("found login form, login="+login_field.name+", submit button = "+(submit_button ? submit_button.name : 'none'));
				attachSubmitHandler(form, submit_button);
				bFound = true;
			}
		}
		
		attachDynamicSubmitButtons();
		
		if (arrForms.length > 0)
			return bFound;
		
		// try to find a form not enclosed in <form> tag (only if no other forms ever found)
		var jqPasswords = $('input[type="password"]').filter(function(){
			return ($(this).parents('form').length === 0);
		});
		var jqTextFields = $('input[type="text"]:visible,input[type="email"]:visible,input[type="tel"]:visible,input[type="url"]:visible').filter(function(){
			return ($(this).parents('form').length === 0);
		});
		var login_field = searchForLoginField(jqTextFields);
		var jqSubmitButtons = $('button:visible,input[type="button"]:visible').filter(function(){
			return ($(this).parents('form').length === 0);
		});
		
		if (!alreadyHaveForm(null)
			&& (jqPasswords.length === 1 || jqPasswords.length === 2)
			&& login_field
			&& jqSubmitButtons.length === 1)
		{
			var submit_button = jqSubmitButtons.get(0);
			var objForm = {
				type: (jqPasswords.length === 1 && getNumberOfTextFields(jqTextFields) === 1) ? "login" : "signup",
				form: null,
				login_field: login_field,
				submit_button: submit_button
			};
			if (objForm.type === "login")
				objForm.password_field = jqPasswords.get(0);
			else{
				objForm.password1_field = jqPasswords.get(0);
				objForm.password2_field = jqPasswords.get(1);
			}
			arrForms.push(objForm);
			console.log("found "+objForm.type+" form not enclosed in form tag, login field is "+login_field.name);
			attachSubmitHandler(null, objForm.submit_button);
			return true;
		}
		return false;
	}
	
	function attachDynamicSubmitButtons() {
		if (arrSubmitButtons) {
			for (var i=0; i<arrForms.length; i++) {
				if (!arrForms[i].submit_button) {
					for (var btn_ind in arrSubmitButtons) {
						var button_path = $(arrSubmitButtons[btn_ind].button_path);
						var password_path = $(arrSubmitButtons[btn_ind].password_path);
						if (button_path.length && 
							password_path.length &&
							$(arrForms[i].form).has(password_path))
						{
							arrForms[i].submit_button = button_path[0];
							arrForms[i].is_dynamic_button = true;
							console.log('found dynamic submit button : '+arrSubmitButtons[btn_ind].button_path);
							attachSubmitHandler(null, arrForms[i].submit_button);
							break;
						}
					}
				}
			}
		}
	}
	
	function handleSubmit(objForm){
		if (!bHasAccounts)
			return true;
		var login = objForm.login_field.value;
		if (login.length === 0)
			return true;
		var password = ((objForm.type === "login" || objForm.type === "two_step_login") ? objForm.password_field : objForm.password1_field).value;
		if (password.length === 0){
			if (generatedPassword)
				password = generatedPassword;
			else
				return true;
		}
		
		// saving
		if (bSaveDone || bPassed)
			return true;
		if (bInSaveDialog)
			return false;
		if (savedLogin === login && savedPassword === password) // repeated submit
			return true;
		
		current_form = objForm.form;
		
		// editing existing pass
		var check_login_presence = function() {
			for (var ind_login in arrLogins) {
				if (arrLogins[ind_login].naked_login === login)
					return true;
			}
			return false;
		};
		if (arrLogins && check_login_presence()) {
			if(bPasswordChangeCheckDone || (receivedLogin === login && receivedPassword === password) || bNeedTopWindow) {
				bPassed = true; // second handler won't go through the same checks again
				return true;
			}
			else {
				sendXdmCommand("checkPasswordChange", {login:login, password:password});
				return false;
			}
		}

		var full_login = login;
		if (objForm.type === "signup"){
			var suffix1_value = getProperty("signup_form_login_suffix_value", null);
			var suffix = getProperty("signup_form_login_suffix_field", null);
			if (suffix){
				var suffix2_value = $(suffix).val();
				if (suffix1_value)
					full_login += suffix1_value;
				if (suffix2_value)
					full_login += suffix2_value;
			}
		}
		sendXdmCommand("savePassword", {login:full_login, password:password});
		bInSaveDialog = (!bNeedTopWindow || typeof popup !== 'undefined');
		if (bInSaveDialog){
			savedLogin = login;
			savedPassword = password;
		}
		return false;
	}
	
	function getPath(node) {
		var $node = $(node);
		if ($node.length !== 1) return false;
		var path;
		while ($node.length) {
			var node =$node[0];
			var name = node.localName;
			if (!name) break;
			if ($node.attr('id')) {
				path = '#'+$node.attr('id')+(path ? '>' + path : '');
				break;
			}
			name = name.toLowerCase();
			var $parent = $node.parent();
			
			var $siblings = $parent.children(name);
			if ($siblings.length > 1) { 
				name += ':eq(' + $siblings.index($node) + ')';
			}
			path = name + (path ? '>' + path : '');
			$node = $parent;
		}
		return path;
	};
	
	function attachSubmitHandler(form, submit_button)
	{
		var last_submit_time = 0; // prevent recursion
		if (form){
			console.log('setting submit handler');
			var objForm = arrForms[getFormIndexByForm(form)];
			var native_submit = form.submit;
			form.submit = function() {
				console.log('handle submit [override]');
				submit_type = submit_type_enum.submit_override;
				if (handleSubmit(objForm)){
					var current_time =  new Date().getTime();
					if (current_time - last_submit_time < 10)
						return true;
					last_submit_time = current_time;
					return native_submit.call(form);
				}
				checkClickedElem(objForm);
				return false;
			};
			//if (is_firefox_extension)
			//	exportFunction(form.submit, form, {defineAs: 'submit'});
			// disabled, due to umi-cms login problem
			
			var submit_handler = function(e, skip_target_check){
				if (!skip_target_check)
					if (e.target !== form && !$.contains(submit_button, e.target)) return;
				console.log('handle captured submit');
				submit_type = submit_type_enum.submit;
				if (!handleSubmit(objForm)){
					checkClickedElem(objForm);
					e.preventDefault();
					e.stopImmediatePropagation();
				}
			};
			$(form).parent().get(0).addEventListener('submit', submit_handler, true);
			
			var last_key_was_arrow = false;
			var key_listener = function(e) {
				if ((e.which === 13 || e.keyCode === 13) && !last_key_was_arrow) {
					submit_handler.call(this, e, true);
					submit_type = submit_type_enum.unknown; // we can't reproduce keypress event to submit => default behavior
				}
				else if (((e.which === 38 || e.keyCode === 38) // hack to prevent submit on browser's autocomplete Enter
						|| (e.which === 40 || e.keyCode === 40))
						&& (e.target.type === "text" 
						|| e.target.type === "email"
						|| e.target.type === "tel"
						|| e.target.type === "url")) {
					last_key_was_arrow = true;
				}
				else
					last_key_was_arrow = false;
			};
			$(form).parent().get(0).addEventListener('keydown', key_listener, true);
			$(form).parent().get(0).addEventListener('keyup', key_listener, true);
			$(form).parent().get(0).addEventListener('keypress', key_listener, true);
			
			// launch dynamic heuristic to acquire submit button
			if ((!objForm.submit_button || objForm.is_dynamic_button) && objForm.type === "login") {
				monitorClicks();
				monitorKBEvents(objForm);
				monitorUnload(objForm);
			}
		}
		if (submit_button){
			console.log('setting .click() handler');
			var click_handler = function(e) {
				if (e.target !== submit_button && !$.contains(submit_button, e.target)) return;
				console.log('handle captured click');
				submit_type = submit_type_enum.click;
				if (!handleSubmit(arrForms[getFormIndexBySubmitButton(submit_button)])){
					e.preventDefault();
					e.stopImmediatePropagation();
				}
			};
			$(submit_button).parent().get(0).addEventListener('click', click_handler, true); // capture phase
			// add own click handler on bubble phase before any other (for manual click triggering from jQuery)
			$(submit_button).bind('click', click_handler);// add to the end
			if (typeof $._data !== "undefined") {
				var handlers = $._data(submit_button, 'events')['click'];
				var handler = handlers.pop(); // take out the handler we just inserted from the end
				handlers.splice(0, 0, handler); // move it at the beginning
			}
		}
	}

	function hasForms(type){
		for (var i=0; i<arrForms.length; i++){
			if (arrForms[i].type === type)
				return true;
		}
	}
	
	function attachFieldEventHandlers(){
		if (arrLogins.length > 0)
			attachLoginList();
		else if (!bHasAccounts || !bSuppressLoginHintForExistingUser || !bInExtension)
			attachHint('login');
		if (hasForms('signup'))
			attachHint('signup');
		addLicenseNotice();
	}
	
	function webkitAutofillKiller($login_field) {
		if (navigator.userAgent.indexOf('Chrome') !== -1){
			var type = $login_field.attr('type');
			var click_counter = 0;
			if (!$login_field.length)
				return;
			var click_listener = function(e){
				if ($login_field.attr('type') != type)
					return;
				click_counter++;
				if (click_counter == 1) {
					$login_field.attr('type', 'password');
					setTimeout(function(){
						$login_field.attr('type', type);
					}, 1); // hide native login dropdown
					$login_field.triggerHandler('focus'); // show our login list
				}
				else {
					$login_field.triggerHandler('blur'); // hide our login list
				}
			};
			$login_field[0].addEventListener('click', click_listener, true);
			document.addEventListener('click', function(e){
				if (!$(e.target).is($login_field)) {
					click_counter = 0;
				}
			}, true);
		}
		else if (navigator.userAgent.indexOf('Safari') !== -1) {
			//TODO
		}
	};
	
	function attachLoginList(){
		if (!$("#teddypass_loginlist").length) {
			var loginlist_template = $("#teddypass_loginlist_template").html();
			if (loginlist_template)
				$("#teddypass_loginlist_template").html('');
			else{
				var favicon_img = bInSafariExtension ? 'class="teddypass_favicon"' : 'src="'+peer_origin+'/favicon.ico"';
				var close_img = bInSafariExtension ? 'class="teddypass_close teddypass_close_icon"' : 'src="'+peer_origin+'/images/correspondent_close.png"';
				loginlist_template = '<div id="teddypass_loginlist" class="teddypass login_list"><div id="teddypass_login_row_template"><span class="loginlist_item_[[cleaned_login]]"><a href="#" data-login="[[tag_login]]" data-naked-login="[[naked_login]]" class="teddypass_login_link"><img '+favicon_img+' class="login_icon"/> [[login]]</a>' +
					'<a href="#delete_login" data-login="[[tag_login]]" data-naked-login="[[naked_login]]" data-employee="[[employee_id]]" class="teddypass_delete_login_link fl_right"><img title="' + TeddypassDictionary.getLoginDelete() + '" '+close_img+' class="teddypass_close_icon"></a><br/></span></div>';
			}
			var html = '<div>'+loginlist_template+'</div>';
			var jqLoginList = $(typeof $.parseHTML !== "undefined" ? $.parseHTML(html) : html);
			var row_template = jqLoginList.find('#teddypass_login_row_template').html();
			if (!row_template){
				console.log("Teddypass: login row template not found");
				return;
			}
			var rows = '';
			for (var i=0; i<arrLogins.length; i++)
				rows += row_template.replace('[[login]]', arrLogins[i].full_login)
					.replace(/\[\[cleaned_login\]\]/g, arrLogins[i].naked_login.replace(/\W/g, ""))
					.replace(/\[\[naked_login\]\]/g, arrLogins[i].naked_login)
					.replace(/\[\[employee_id\]\]/g, assocLoginAttributesDataset[arrLogins[i].full_login].employee_id)
					.replace(/\[\[tag_login\]\]/g, arrLogins[i].full_login.replace(/"/g, '&quot;'));
			
			jqLoginList.find('#teddypass_login_row_template').html(rows);
			$('body').append(jqLoginList.html());
			var rgb = $("#teddypass_loginlist a").css('color').match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			if (Math.sqrt(Math.pow(rgb[1],2) + Math.pow(rgb[2],2) + Math.pow(rgb[3],2)) > HUE_LIMIT) {
				$("#teddypass_loginlist a").css({color: 'blue'});
			}

			// click handlers
			$(".teddypass_login_link").unbind('click').click(function(event){
				event.preventDefault();
				event.stopImmediatePropagation();
				$("#teddypass_loginlist").hide();
				var login = $(this).attr("data-login");
				Teddypass.login(login);
			});
			$(".teddypass_delete_login_link").unbind('click').click(function(event){
				event.preventDefault();
				event.stopImmediatePropagation();
				var login = $(this).attr("data-naked-login");
				var employee_id = $(this).attr("data-employee");
				Teddypass.askToDeleteLogin(login, employee_id);
			});
		}
				
		var bBlurred = false;
		for (var i=0; i<arrForms.length; i++){
			if (arrForms[i].bEventsAttached)
				continue;
			var assocForm = arrForms[i];
			if (assocForm.type !== 'login' && assocForm.type !== 'two_step_login')
				continue;
			var jqLogin = $(assocForm.login_field);
			var jqPassword = $(assocForm.password_field);
			webkitAutofillKiller(jqLogin);
			jqLogin.bind('focus', function(){
				bBlurred = false;
				move_hint("#teddypass_loginlist", this, true);
				current_form = assocForm.form;
			});
			$(window).resize(function(){
				move_hint("#teddypass_loginlist", jqLogin);
			});
			jqLogin.blur(function(){
				bBlurred = true;
			});
			var fnHide = function(){
				if (bBlurred){
					bBlurred = false;
					$("#teddypass_loginlist").hide();
				}
			};
			$('html').click(fnHide);
			jqPassword && jqPassword.focus(fnHide);
			jqLogin.keyup(function(e){
				if (e.keyCode !== 9 && e.keyCode !== 16) // TAB & Shift
					$("#teddypass_loginlist").hide();
			});
			
			arrForms[i].bEventsAttached = true;
			
			// if focus event fired before we are called
			if (document.activeElement === assocForm.login_field){
				console.log('force focus');
				jqLogin.focus();
			}
		}
	}
	
	function move_hint(self_id, parent, bneed_to_show) {
		//var offset_top = ($(parent).length ? $(parent).offset().top + parent.offsetHeight : 0);
		//var offset_left = ($(parent).length ? $(parent).offset().left : 0);
		var offset_top = ($(parent).length ? $(parent).offset().top : 0);
		var offset_left = ($(parent).length ? $(parent).offset().left + parent.offsetWidth : 0);
		if ($('body').css('position') == 'relative' || $('body').css('position') == 'absolute') {
			offset_top -= $('body').offset().top;
			offset_left -= $('body').offset().left;
		} else {
			offset_top -= parseInt($("body").css("margin-top"));
			offset_left -= parseInt($("body").css("margin-left"));
		}
		var min_width = $(parent).outerWidth() - 2*parseInt($(self_id).css('padding-left')) - 2*parseInt($(self_id).css('border-left-width')||'0');
		$(self_id).css({
			'box-sizing': 'content-box',
			'min-width': min_width,
			top: offset_top, 
			left: offset_left
		});
		if (bneed_to_show)
			$(self_id).css({display: 'block'});
		if (isInIframe()) {
			offset_top += Math.min(0, $(window).height() - offset_top - $(self_id).outerHeight());
			offset_left += Math.min(0, $(window).width() - offset_left - $(self_id).outerWidth());
			$(self_id).css({
				top: offset_top, 
				left: offset_left
			});
		}
	}
	
	function attachHint(hint_type) {
		if (typeof TeddypassDictionary === 'undefined'){
			setTimeout(function(){attachHint(hint_type);}, 2000);
			return;
		}
		var id = hint_type === 'login'
			? (bHasAccounts ? "teddypass_firstlogin_hint" : "teddypass_login_hint")
			: 'teddypass_signup_hint';
		
		// append hint text
		if ($("#"+id).length === 0){
			var html;
			var logo_img = bInSafariExtension ? 'class="teddypass_logo"' : 'src="'+peer_origin+'/images/main/teddy_logo_small.png"';
			
			// login text
			if (hint_type === 'login') {
				var message = bHasAccounts
					? '<p>'+TeddypassDictionary.getEnterAsUsual()+'</p>'
					: '<p>'+TeddypassDictionary.getThisIsLastTime()+'</p><div class="fl_left al_left"><a href="#" id="teddypass_signup_link">'+TeddypassDictionary.getGetYourTeddyId()+'</a> '+TeddypassDictionary.getToLoginByPictures()+'.</div>';
				if (bHasAccounts && bInExtension)
									
					message += '<div class="fl_left"><a href="#dontshow" id="teddypass_dontshow">'+TeddypassDictionary.getDontShow()+'</a></div>';
				html='<div id="'+id+'" class="teddypass hint"><img '+logo_img+' width="64" height="33" />'+message+'<div class="learn_more"><a href="//www.teddyid.com/" target="_blank">'+TeddypassDictionary.getLearnMore()+'</a></div></div>';
			}
			// signup text
			else {														
				html='<div id="teddypass_signup_hint" class="teddypass hint"><img '+logo_img+' width="64" height="33"/><p>'+TeddypassDictionary.getTeddyCanGeneratePassword()+'</p><p id="teddypass_ifnew">'+TeddypassDictionary.getIfNoTeddyYet()+'</p><div			><a href="#gen_password" id="teddypass_gentext"			>'+TeddypassDictionary.getGetTeddyAndGenPassword()+'</a></div><div class="learn_more"><a href="//www.teddyid.com/" target="_blank">'+TeddypassDictionary.getLearnMore()+'</a></div></div>';
			}
			$('#teddy').append(html);
			
			// correct the difference between colors hue
			var rgb = $("#"+id+" p").css('color').match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			if (Math.sqrt(Math.pow(rgb[1],2) + Math.pow(rgb[2],2) + Math.pow(rgb[3],2)) > HUE_LIMIT) {
				$("#"+id+" p, #"+id+" div").css({color: '#444444'});
				$("#"+id+" a").css({color: 'blue'});
			}
		}
		
		// bind hint links events
		if (hint_type === 'login') {
			var is_link_inside_hint_clicked = false;
			$("#teddypass_signup_link").unbind('click').click(function(event){
				Teddypass.signup();
				is_link_inside_hint_clicked = true;
				event.preventDefault();
			});
			if (bHasAccounts && bInExtension){
				$("#teddypass_dontshow").unbind('click').click(function(event){
					sendXdmCommand("dontShowLoginHintToExistingUser", {});
					removeHint('login');
					is_link_inside_hint_clicked = true;
					event.preventDefault();
				});
			}
		}
		// signup
		else {
			if (bHasAccounts){
				$("#teddypass_ifnew").hide();
				$("#teddypass_gentext").html(TeddypassDictionary.getGetGenPassword());
			}
			$("#teddypass_gentext").unbind('click').click(function(event){
				event.preventDefault();
				event.stopPropagation();
				Teddypass.generatePassword();
			});
		}
		
		// bind form events
		var bBlurred = false;
		var jqLogin;
		var jqPassword;
		var last_input_used;
		var focusHandler;
		var common_focus_handler = function() {
			move_hint('#'+id, this, true);
			bBlurred = false;
		};
		if (hint_type === 'login') {
			focusHandler = function(){
				last_input_used = this;
				if (is_link_inside_hint_clicked) {
					is_link_inside_hint_clicked = false;
					return;
				}
				common_focus_handler.call(this);
				sendXdmCommand(bHasAccounts ? 'onFirstLoginHintShown' : 'onLoginHintShown', {});
			};
		}
		// signup
		else {
			focusHandler = function(){
				if (this.value.length > 10)
					return;
				current_form = this.form;
				common_focus_handler.call(this);
				sendXdmCommand('onSignupHintShown', {});
			};
		}
		$(window).resize(function(){
			move_hint('#'+id, last_input_used);
		});
		var blurHandler = function(){
			bBlurred = true;
		};
		var keyUpHandler = function(e) {
			if (e.keyCode !== 9 && e.keyCode !== 16) // TAB & Shift
				$("#"+id).hide();
		};
		$('html').click(function(){
			if (bBlurred){
				bBlurred = false;
				$("#"+id).hide();
			}
		});
		for (var i=0; i<arrForms.length; i++){
			if (arrForms[i].bEventsAttached)
				continue;
			var assocForm = arrForms[i];
			if (assocForm.type !== hint_type) {
				if ( ! (assocForm.type == "two_step_login" && hint_type=="login")) // exclude this case
					continue;
			}
			
			if (hint_type === 'login') {
				jqLogin = last_input_used = $(assocForm.login_field);
				jqPassword = $(assocForm.password_field);
			}
			else {
				jqPassword = last_input_used = $(assocForm.password1_field);
			}
			jqPassword.bind('focus.hint', focusHandler);
			jqPassword.blur(blurHandler);
			jqPassword.bind('keyup.hint', keyUpHandler);
			if (jqLogin) {
				webkitAutofillKiller(jqLogin);
				jqLogin.bind('focus.hint', function(){
					focusHandler.call(this);
				});
				jqLogin.blur(blurHandler);
				jqLogin.bind('keyup.hint', keyUpHandler);
			}
			arrForms[i].bEventsAttached = true;
		}
	}
	
	function removeHint(hint_type) {
		for (var i=0; i<arrForms.length; i++){
			var assocForm = arrForms[i];
			if (assocForm.type !== hint_type)
				continue;
			$(hint_type === 'signup' ? assocForm.password1_field : [assocForm.login_field, assocForm.password_field])
					.unbind('focus.hint keyup.hint blur');
			arrForms[i].bEventsAttached = false;
		}
	}
	
	function sendXdmCommand(command, params){
		if (!params)
			params = {};
		var obj = {command: command, params: params};
		var message = JSON.stringify(obj);
		console.log('teddypass Send: '+message);
		if (is_firefox_extension)
			return popup.postMessage(message, peer_origin);
		
		// background xdms is Safari - the unique way
		if (!bNeedTopWindow || $.inArray(command, ["generatePassword", "onShown", "onLoginHintShown", "onFirstLoginHintShown", "onSignupHintShown", "dontShowLoginHintToExistingUser", "delete", "init", "storeButtonPath"]) !== -1){
			if (bInSafariExtension){
				obj.params.return_url = location.href;
				message = JSON.stringify(obj);
				console.log('teddypass safari Send: '+message);
				return safari.self.tab.dispatchMessage("message", message);
			}
			else
				return iframe.postMessage(message, peer_origin);
		}
		
		// use popup in safari
		if (!popup || typeof popup === 'undefined' || typeof popup.postMessage === 'undefined'){
			scheduled_message = message;
			var widgetRect = getWidgetRect();
			widgetRect.top += window.screenY;
			widgetRect.left += window.screenX;
			popup = window.open(teddy_url + "/teddypass.php?node_id="+node_id, "popup", "width="+widgetRect.width+", height="+widgetRect.height+", top="+widgetRect.top+", left="+widgetRect.left+", directories=no, location=no, menubar=no, scrollbars=no, status=no, toolbar=no");
		}
		else
		{
			popup.postMessage(message, teddy_url);
		}
	}
	
	function loadJs(src, bAsync){
		(function() {
			var async_js = document.createElement('script');
			async_js.type = 'text/javascript';
			async_js.async = bAsync;
			async_js.src = src;
			async_js.charset = "UTF-8";
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(async_js, s);
		})();
	}
	
	function getLanguage(){
		var arrSupportedLanguages = ['en', 'ru'];
		var lang_and_country = document.documentElement.lang || navigator.language || navigator.userLanguage;
		if (!lang_and_country)
			return 'en';
		var language = lang_and_country.substr(0, 2);
		if (!$.inArray(language, arrSupportedLanguages))
			language = 'en';
		return language;
	}
	
	function isInIframe() {
		try {
			return (is_firefox_extension ? window : window.self) !== window.top;
		} catch (e) {
			return true;
		}
	}
	
	function getProperty(name, default_value){
		return (typeof TeddypassProperties !== 'undefined' && TeddypassProperties[name]) 
			? TeddypassProperties[name] : default_value;
	}

	function getUserProperty(name, login, default_value) {
		return (typeof assocLoginAttributesDataset[login] !== 'undefined' && typeof assocLoginAttributesDataset[login][name] !== 'undefined'
			&& assocLoginAttributesDataset[login][name])
			? assocLoginAttributesDataset[login][name] : default_value;
	}

	function addTeddypassDiv(){
		var wrapper_div = document.createElement('div');
		wrapper_div.innerHTML = '\
			<div id="teddypass_div">\
				<div class="back"></div>\
				<div id="teddypass_iframediv"></div>\
			</div>';
		wrapper_div.style.position="static";
		document.getElementsByTagName('body')[0].appendChild(wrapper_div);
	}
	
	function findCredentialsAndConnectToServer(){
		if (!findCredentialsFields()){
			console.log((window === top ? "top frame" : "iframe")+": no credentials forms found");
			return;
		}
		if (!bInExtension)
			loadJs(getTeddyUrl()+"/dictionaries/"+getLanguage()+"/teddypass.dictionary.js", true);
		addTeddypassDiv();
		node_id = getProperty('node_id', 0);
		loadServerFrame();
		bLoadedIframe = true;
	}
	
	this.isInExtension = function(){
		return bInExtension;
	};
	
	this.login = function(login){
		sendXdmCommand("login", {login: login, require_device_confirmation: getProperty('require_device_confirmation', 'no')});
	};

	this.askToDeleteLogin = function(login, employee_id) {
		if(confirm(TeddypassDictionary.getAskForDelete() + login + '?')) {
			this.delete_login(login, employee_id);
		}
	};

	this.delete_login = function(login, employee_id){
		sendXdmCommand("delete", {login: login, employee_id: employee_id});
	};
	
	this.signup = function(){
		sendXdmCommand("signup", {bGenPassword: false});
	};
	
	this.generatePassword = function(){
		if (bHasAccounts)
			sendXdmCommand("generatePassword");
		else
			sendXdmCommand("signup", {bGenPassword: true});
	};
	
	this.init = function(){
		if (is_firefox_extension && !isInIframe()) {
			self.port.emit("message", JSON.stringify({command: "reset_tab_panel_index"}));
		}
		if (!navigator.cookieEnabled || !supportsLocalStorage() || !document.addEventListener)
			return;
		if (!window.console)
			window.console = {};
		if (!window.console.log)
			window.console.log = function () { };
		if (is_firefox_extension) {
			window.console = {log: function(){}};
		}
		var focus_handler = function(){
			if (bDisabled)
				return;
			console.log("rescanning the document");
			if (bLoadedIframe){
				if (findCredentialsFields() && arrLogins !== null)
					attachFieldEventHandlers();
			}
			else
				findCredentialsAndConnectToServer();
		};
		
		var focus_selector = $('input').filter(function() {
			return typeof $(this).attr('type') !== "undefined" ? $.inArray($(this).attr('type').toLowerCase(), ["text","password","email","tel","url"]) > -1 : false;
		});

		if (typeof $().on !== "undefined")
			$(document).on("focusin", focus_selector, focus_handler);
		else if (typeof $().live !== "undefined")
			$(focus_selector).live("focusin", focus_handler);
		else
			$(focus_selector).bind("focusin", focus_handler);
		findCredentialsAndConnectToServer();
	};
};

function haveScriptInDom(url) {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src === url)
			return true;
    }
    return false;
}


if (Teddypass.isInExtension()) {
	if (!haveScriptInDom("https://www.teddyid.com/js/teddypass.js") 
		&& !location.href.match(/https?:\/\/www\.teddyid\.(?:com|local)\/teddypass\.php/)){
		Teddypass.init();
		if (location.href.indexOf('https://www.teddyid.com') === 0)
			localStorage.setItem('has_extension', 1);
	}
}
else{
	function start() {
		$(document).ready(function(){
			Teddypass.init();
		});
	}
	var load_js = function() {
		var jq = document.createElement('script'); jq.type = 'text/javascript';
		jq.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js';
		jq.onload = function() {jQuery = $.noConflict(true); start();};
		document.getElementsByTagName('head')[0].appendChild(jq);
	};
	function check_jquery_and_start() {
		// load CSS
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = 'https://www.teddyid.com/css/teddypass.css';
		link.media = 'all';
		head.appendChild(link);
		// hack for RequireJS-enabled sites
		if (typeof define === "function" && define.amd && typeof requirejs !== "undefined") {
			var isDefined = function(value, path) {
				path.split('.').forEach(function(key) { value = value && value[key]; });
				return (typeof value !== 'undefined' && value !== null);
			};
			if (!isDefined(requirejs, 's.contexts._.config.paths.jquery')
				&& (typeof jQuery === 'undefined' || !jQuery || typeof jQuery.fn === 'undefined'))
			{
				load_js();
				return;
			}
			require(['require'], function (rq) {
				setTimeout(function() {
					rq(['jquery'], function (jQuery) {
						start();
					});
				}, 100);
			});
			return;
		}
		if (typeof jQuery === 'undefined' || !jQuery || typeof jQuery.fn === 'undefined') {
			load_js();
			return;
		}
		start();
	}
	check_jquery_and_start();
}
})(window.teddyid_jquery || window.jQuery);