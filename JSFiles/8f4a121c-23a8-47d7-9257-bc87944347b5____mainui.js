MainUI = {};
MainUI.appMenuEvents = new Array();
MainUI.init = function() {
	
	var mainDiv = $("<div id='main'></div>").css({
		"position":"absolute",
		"top":"0px",
		"left":"0px",
		"width": "100%",
		"height": "100%"
	});
	
	var layoutSettings = {
		Name: "Main",
        Dock: $.layoutEngine.DOCK.FILL,
        EleID: "main",
        Children:[{
			Name: "Fill",
			Dock: $.layoutEngine.DOCK.FILL,
	 		EleID: "main"
		}]
	};
	var appMenuItems = $("<ul id='appMenuItems' class='contextMenu' style='display:none'>" +
			"<li class=''><a href='#imservices'>IM</a></li>" +
			"<li class=''><a href='#shopServices'>Shop</a></li>" +
			"<li class=''><a href='#mapServices'>Map</a></li>" +
			"<li class=''><a href='#personal'>Personal</a></li>" +
			"<li class=''><a href='#preferences'>Preferences</a></li>" +
			"<li class='separator'><a href='#quit'>Quit</a></li>" +
	"</ul>");
	
	var appMenu = $("<div id='appMenu'><img id='appMenuImg' src='/resource/status/available.png'/></div>");
	appMenu.css({"position": "fixed",
					"right":"0", 
					"top": "0", 
					"z-index": "8888",
					"padding": "10px"});
	
	
	$("body").append(appMenu);
	$("body").append(appMenuItems);
	
	$("body").append(mainDiv);
	
	$.layoutEngine(layoutSettings);
	
	appMenu.contextMenu({
			menu: 'appMenuItems',
			leftButton: true,
			menulocFunc: function() {
				var menuX = appMenu.offset().left + 10 - appMenuItems.width() + appMenu.width();
				var menuY = appMenu.offset().top + 10 + appMenu.height();
				return {x: menuX, y: menuY};
			}
			
		}, function(action, el, pos) {
			
			var eventInfo = MainUI.appMenuEvents[action];
			if (eventInfo) {
				var handler = eventInfo.handler;
				if (handler) {
					handler();
				}
				MainUI.removeAppEventInfo(action);
				return;
			}
			
			
			if (action == "imservices") {
				ImService.show();
			} else if (action == "shopServices") {
				ShopService.show();
			} else if (action == "mapServices") {
				MapService.show();
			} else if (action  == "personal") {
				Personal.show();
			} else if (action == "preferences") {
				Preferences.show();
			} else if (action  == "quit") {
				var connectionMgr = XmppConnectionMgr.getInstance();
				var conn = connectionMgr.getAllConnections()[0];
				if (conn) {
					MainUI.userClose = true;
					conn.close();
				}
			}
			
			
		}
	);
	
	Preferences.addItemChangedListener({
		preferenceNames: ["shareLoc"],
		handler: function(oldValue, newValue) {
			if (newValue == true) {
				MainUI.geoLocIntervalId = setInterval(updateLoc, 10 * 1000);
			} else {
				clearInterval(MainUI.geoLocIntervalId);
			}
		}
	});
	
	
	var connectionMgr = XmppConnectionMgr.getInstance();
	connectionMgr.addConnectionListener([
			ConnectionEventType.ConnectionClosed
		],
		function(event) {
			if (MainUI.geoLocIntervalId) {
				clearInterval(MainUI.geoLocIntervalId);
			}
			appMenu.children("img").attr("src", "/resource/status/unavailable.png");
			if (!MainUI.userClose) {
				alert($.i18n.prop("app.connectionClosed", "连接已断开"));
			}
			
			window.location.reload();
		}
	);
	
	ImService.init();
	ShopService.init();
	MapService.init();
	Personal.init();
	Preferences.init();
	
	ImService.show();
}

function updateLoc() {
	GeoUtils.getCurrentPosition(function(p) {
		var lat = p.coords.latitude;
		var lon = p.coords.longitude;
		
		var connectionMgr = XmppConnectionMgr.getInstance();
		var conn = connectionMgr.getAllConnections()[0];
		if (conn) {
			var currentP = conn.currentPresence;
			var geoLocExtension = new GeoLocExtension();
			geoLocExtension.setType(GeoLocType.LATLON);
			geoLocExtension.setLat(lat);
			geoLocExtension.setLon(lon);
			
			currentP.removePacketExtension(GeoLocExtension.ELEMENTNAME, GeoLocExtension.NAMESPACE);
			currentP.addPacketExtension(geoLocExtension);
			conn.changeStatus(currentP);
		}
		
	}, 
	function(){
		
	}, false);		
}

MainUI.addAppEventInfo = function(eventInfo) {
	var eventId = eventInfo.eventId;
	if (eventId == null) {
		return;
	}
	if (MainUI.appMenuEvents[eventId] || $("#" + eventId)[0]) {
		MainUI.updateAppEventInfo(eventInfo);
		return;
	}
	
	var eventName = eventInfo.eventName;
	eventName = mCutStr(eventName, 7);
	var eventCss = eventInfo.css;
	var appMenu = $("#appMenuItems");
	appMenu.prepend("<li id='" + eventId + "' class='" + eventCss + "'>" +
						"<a href='#" + eventId + "'>" + 
							eventName + "</a></li>");
	
	MainUI.appMenuEvents[eventId] = eventInfo;
}

MainUI.updateAppEventInfo = function(eventInfo) {
	var eventId = eventInfo.eventId;
	if (eventId == null) {
		return;
	}

	var item = $("#" + eventId);
	item.removeClass();
	item.addClass(eventInfo.css);
	item.children("a").text(eventInfo.eventName);
	
	
	MainUI.appMenuEvents[eventId] = eventInfo;
}
MainUI.removeAppEventInfo = function(eventId) {
	delete MainUI.appMenuEvents[eventId];
	$("#" + eventId).remove();
}


// start of IMService
ImService = {};
ImService.init = function() {
	
	var imservices = $("<div id='imservices'></div>");
	
	// im tabs
	var imTop = $("<div id='imTop'></div>");
	// contact tab
	var contactTab = $("<b id='contact-tab' class='marginpadding'></b>");
	contactTab.attr("type", "contact");
	contactTab.addClass("sexybutton");
	contactTab.text($.i18n.prop("imservices.contact", "联系人"));
	imTop.append(contactTab);
	
	var chatTab = $("<b id='chat-tab' class='marginpadding'></b>");
	// chat tab
	chatTab.attr("type", "chat");
	chatTab.addClass("sexybutton");
	chatTab.text($.i18n.prop("imservices.chat", "聊天"));
	imTop.append(chatTab);
	
	var contactInfoTab =  $("<b id='contactInfoTab' class='marginpadding'></b>");
	// contactInfo tab
	contactInfoTab.attr("type", "contactInfo");
	contactInfoTab.addClass("sexybutton");
	contactInfoTab.text($.i18n.prop("imservices.contactInfo", "联系人资料"));
	contactInfoTab.hide();
	imTop.append(contactInfoTab);
	
	// tabs click event
	imTop.find("b:first").addClass("sexysimple sexyteal");
	imTop.find("b").click(function(){
		$(this).addClass("sexysimple sexyteal").siblings("b").removeClass("sexysimple sexyteal");
		var type = $(this).attr("type");
		var centerchildren = $("#imCenter").children();
		$.each(centerchildren, function(index, value) {
			var jqEl = $(value);
			if (type == jqEl.attr("type")) {
				jqEl.show();
			} else {
				jqEl.hide();
			}
		});
		if (type == "contact") {
			$.layoutEngine(imContactlayoutSettings);
		} else if (type == "chat") {
			$.layoutEngine(imChatlayoutSettings);
			var chatHeader = $("#chat-scroller-header");
			var selectedPanel = chatHeader.children(".selected");
			if (selectedPanel[0]) {
				selectedPanel.click();
			} else {
				chatHeader.find("span:first").click();
			}
		}
	});

	
	var imCenter = $("<div id='imCenter'></div>");
	
	// user info ,username,status,photo
	var userinfo = $("<div id='userinfo'></div>");
	userinfo.attr("type", "contact");
	
	var userinfotable = $("<table style='padding-left:5px;'>" +
			"<tbody>" +
				"<tr>" +
					"<td>" +
						"<img id='userphoto' src='/resource/userface.bmp' width='50' height='50' />" + 
					"</td>" +
					"<td>" +
						"<table style='padding-left:5px'>" +
							"<tbody>" +
								"<tr>" +
									"<td>" +
										"<img id='user-status-img' src='/resource/status/unavailable.png' />" +
										"<img id='user-status-menu' src='/resource/statusmenu.png' style='padding-left:2px;padding-right:10px;' />" +
										"<span id='userinfo-username'>Noah</span>" +
									"</td>" +
								"</tr>" +
								"<tr style='height:30px;'>" +
									"<td>" +
										"<div id='user-status-message'>available</div>" +
									"</td>" +
								"</tr>" +
							"</tbody>" +
						"</table>" +
					"</td>" +
				"</tr>" +
			"</tbody>" +
		"</table>");

					
	// user's status menu 
	var statusMenu = $("<ul id='myMenu' class='contextMenu'>" +
			"<li class='available'><a href='#available'>" + $.i18n.prop("imservices.status.available", "在线") + "</a></li>" +
			"<li class='away'><a href='#away'>" + $.i18n.prop("imservices.status.away", "离开") + "</a></li>" +
			"<li class='chat'><a href='#chat'>" + $.i18n.prop("imservices.status.chat", "空闲") + "</a></li>" +
			"<li class='dnd'><a href='#dnd'>" + $.i18n.prop("imservices.status.dnd", "忙碌") + "</a></li>" +
			"<li class='xa'><a href='#xa'>" + $.i18n.prop("imservices.status.xa", "离开") + "</a></li>" +
	"</ul>");
	statusMenu.hide();
	
	
	
	userinfo.append(statusMenu);
	userinfo.append(userinfotable);
	
	imCenter.append(userinfo);
	
	var contactlist = $("<div id='contactlist'></div>");
	contactlist.attr("type", "contact");
	
	imCenter.append(contactlist);
	// start of chat html
	
	var chatScrollHeader = $("<div id='chat-scroller-header'></div>");
	chatScrollHeader.attr("type", "chat");
	
	imCenter.append(chatScrollHeader);
	
	var chatScrollBody = $("<div id='chat-scroller-body'></div>");
	chatScrollBody.attr("type", "chat");
	
	var chatPanel = $("<div id='chat-panel'></div>");	
	chatScrollBody.append(chatPanel);

	imCenter.append(chatScrollBody);
	
	var contactInfoPanel = $("<table id='contactInfoPanel'class='marginpadding'>" +
								"<tbody>" +
									"<tr>" +
										"<td>" +
											"<img id='contactInfoImg' src='/resource/userface.bmp' width='50' height='50' />" + 
										"</td>" +
										"<td>" +
											"<table style='padding-left:5px'>" +
												"<tbody>" +
													"<tr>" +
														"<td>" +
															"<span id='contactInfoJid'>Noah@example.com</span>" +
															"<a href='javascript:void(0);' style='margin-left:10px;'>" + 
																$.i18n.prop("imservices.action.deleteContact", "删除") + 
															"</a>" +
														"</td>" +
													"</tr>" +
													"<tr style='height:30px;'>" +
														"<td>" +
															"<label id='contactInfoName'>" + 
																$.i18n.prop("imservices.nickame", "备注名：") + 
															"</label>" +
															"<input id='contactNickName' type='text' />" +
														"</td>" +
													"</tr>" +
												"</tbody>" +
											"</table>" +
										"</td>" +
									"</tr>" +
									"<tr>" +
										"<td colspan='2'>" +
											"<table>" +
												"<tr>" +
													"<td>" +
														"<label id='contactGroup' for='contactGroupSelect'>" + 
															$.i18n.prop("imservices.groupName", "组名：") + 
														"</label>" +
													"</td>" +
													"<td>" +
														"<input id='contactInfoGroup' name='contactInfoGroup' type='text'/>" +
													"</td>" +
												"</tr>" +
											"</table>" +
										"</td>" +
									"</tr>" +
									"<tr>" +
										"<td/>" +
										"<td>" +
											"<div style='float:right;'>" +
												"<button id='saveContactInfo'>" +
													$.i18n.prop("imservices.action.saveContactInfo", "保存") + 
												"</button>" +
												"<button id='closeContactInfo'>" +
													$.i18n.prop("imservices.action.closeContactInfo", "关闭") + 
												"</button>" +
											"</div>" +
										"</td>" +
									"</tr>" +
								"</tbody>" +
							"</table>");
	contactInfoPanel.attr("type", "contactInfo");
	contactInfoPanel.find("button:first").click(function(){
		var contactJidStr = $("#contactInfoJid").text();
		var iq = new Iq(IqType.SET);
		var iqRoster = new IqRoster();
		
		var nickName = $("#contactNickName").val();
		var iqRosterItem = new IqRosterItem(JID.createJID(contactJidStr), nickName);
		iqRosterItem.addGroup($("#contactInfoGroup").val());
		iqRoster.addRosterItem(iqRosterItem);
		
		iq.addPacketExtension(iqRoster);
		
		var connectionMgr = XmppConnectionMgr.getInstance();
		var conn = connectionMgr.getAllConnections()[0];
		if (conn) {
			conn.handleStanza({
				filter: new PacketIdFilter(iq.getStanzaId()),
				timeout: Christy.loginTimeout,
				handler: function(iqResponse) {
					if (iqResponse.getType() == IqType.RESULT) {
						alert($.i18n.prop("imservices.updateContactSuccess", "更新成功！"));
						contactTab.click();
						contactInfoTab.hide();
					} else {
						alert($.i18n.prop("imservices.updateContactFailed", "更新失败！"));
					}
				},
				timeoutHandler: function() {
					alert($.i18n.prop("imservices.updateContactFailed", "更新失败！"));
				}
			});
			
			conn.sendStanza(iq);
			
			
		}
		
	});
	
	contactInfoPanel.find("button:last").click(function(){
		contactTab.click();
		contactInfoTab.hide();
	});
	
	contactInfoPanel.find("a").click(function(){
		
		if (!confirm($.i18n.prop("imservices.confirmRemoveContact", "确认删除？"))) {
			return;
		}
		
		var contactJidStr = $("#contactInfoJid").text();
		var iq = new Iq(IqType.SET);
		var iqRoster = new IqRoster();

		var iqRosterItem = new IqRosterItem(JID.createJID(contactJidStr), null);
		iqRosterItem.setSubscription(IqRosterSubscription.remove);
		iqRoster.addRosterItem(iqRosterItem);
		
		iq.addPacketExtension(iqRoster);
		
		var connectionMgr = XmppConnectionMgr.getInstance();
		var conn = connectionMgr.getAllConnections()[0];
		if (conn) {
			conn.handleStanza({
				filter: new PacketIdFilter(iq.getStanzaId()),
				timeout: Christy.loginTimeout,
				handler: function(iqResponse) {
					if (iqResponse.getType() == IqType.RESULT) {
						alert($.i18n.prop("imservices.removeContactSuccess", "删除成功！"));
						contactTab.click();
						contactInfoTab.hide();
					} else {
						alert($.i18n.prop("imservices.removeContactFailed", "删除失败！"));
					}
				},
				timeoutHandler: function() {
					alert($.i18n.prop("imservices.removeContactFailed", "删除失败！"));
				}
			});
			
			conn.sendStanza(iq);
			
			
		}
		
	});
	
	imCenter.append(contactInfoPanel);
	
	var imTopHeight = 40;
	
	imContactlayoutSettings = {
		Name: "Main",
        Dock: $.layoutEngine.DOCK.FILL,
        EleID: "main",        
        Children:[{
			Name: "Fill",
			Dock: $.layoutEngine.DOCK.FILL,
	 		EleID: "imservices",
	 		Children:[{
	 			Name: "Top2",
				Dock: $.layoutEngine.DOCK.TOP,
				EleID: "imTop",
				Height: imTopHeight
	 		},{
	 			Name: "Fill2",
				Dock: $.layoutEngine.DOCK.FILL,
		 		EleID: "imCenter",
		 		Children:[{
		 			Name: "Top3",
					Dock: $.layoutEngine.DOCK.TOP,
					EleID: "userinfo",
					Height: 70
		 		},{
		 			Name: "Fill3",
					Dock: $.layoutEngine.DOCK.FILL,
					EleID: "contactlist",
		 		}]
	 		}]
		}]
	};
	
	imChatlayoutSettings = {
		Name: "Main",
        Dock: $.layoutEngine.DOCK.FILL,
        EleID: "main",        
        Children:[{
			Name: "Fill",
			Dock: $.layoutEngine.DOCK.FILL,
	 		EleID: "imservices",
	 		Children:[{
	 			Name: "Top2",
				Dock: $.layoutEngine.DOCK.TOP,
				EleID: "imTop",
				Height: imTopHeight
	 		},{
	 			Name: "Fill2",
				Dock: $.layoutEngine.DOCK.FILL,
		 		EleID: "imCenter",
		 		Children:[{
		 			Name: "Top3",
					Dock: $.layoutEngine.DOCK.TOP,
					EleID: "chat-scroller-header",
					Height: 30
		 		},{
		 			Name: "Fill3",
					Dock: $.layoutEngine.DOCK.FILL,
					EleID: "chat-scroller-body"
		 		}]
	 		}]
		}]
	};
	
	imservices.append(imTop);
	imservices.append(imCenter);
	
	$("#main").append(imservices);
	imservices.hide();
	
	$.layoutEngine(imContactlayoutSettings);

	var statusMenuHandler = function(action, el, pos) {
		var connectionMgr = XmppConnectionMgr.getInstance();
		var conn = connectionMgr.getAllConnections()[0];
		if (conn) {
			var currentPresence = conn.currentPresence;
			if (currentPresence != null) {
				var showType = currentPresence.getShow();
				if (showType == null && currentPresence.isAvailable()) {
					showType = PresenceShow.AVAILABLE;
				}
				if (showType == action) {
					return;
				}
			}
			
			var presence = new Presence(PresenceType.AVAILABLE);
			if (action == "away") {
				presence.setShow(PresenceShow.AWAY);
			} else if (action == "chat") {
				presence.setShow(PresenceShow.CHAT);
			} else if (action == "dnd") {
				presence.setShow(PresenceShow.DND);
			} else if (action == "xa") {
				presence.setShow(PresenceShow.XA);
			}
			
			
			var statusMess = $("#user-status-message");
			if (statusMess.attr("emptyStatus") == "false") {
				presence.setUserStatus(statusMess.text());
			}

			conn.changeStatus(presence);
			var statusInfo = getStatusInfo(presence);
			$("#user-status-img").attr("src", statusInfo.imgPath);
			var presenceStatus = presence.getUserStatus();
			var statusMessContent = (presenceStatus == null) ? statusInfo.statusMessage : presenceStatus;
			statusMess.text(statusMessContent);
		}
	};

	$("#user-status-menu").contextMenu({
			menu: 'myMenu',
			leftButton: true,
			menulocFunc: function() {
				var menuX = $("#user-status-img").offset().left;
				var menuY = $("#user-status-img").offset().top - imTopHeight + $("#user-status-img").height();
				return {x: menuX, y: menuY};
			}
		}, statusMenuHandler
	);
	
	$("#user-status-img").contextMenu({
			menu: 'myMenu',
			leftButton: true,
			menulocFunc: function() {
				var menuX = $("#user-status-img").offset().left;
				var menuY = $("#user-status-img").offset().top - imTopHeight + $("#user-status-img").height();
				return {x: menuX, y: menuY};
			}
		}, statusMenuHandler
	);
	
	contactTab.click();
	
	var statusMessageClickFunc = function(){
		
		$(this).unbind("click");
		var statusMessage = $(this);
		var oldmessage = $(this).text();
		var inputStatusMessage = $("<input id='input-status-message' type='text' value='" + oldmessage + "'/>");
		
		
		inputStatusMessage.keypress(function(event) {
			if (event.keyCode == 13) {
				$(this).blur();
			}
		});
		inputStatusMessage.bind("blur", function() {
			statusMessage.empty();
			statusMessageVal = $(this).val();
			var connectionMgr = XmppConnectionMgr.getInstance();
			if (statusMessageVal != oldmessage) {
				var conn = connectionMgr.getAllConnections()[0];
				if (conn) {
					var currentPres = conn.currentPresence;
					if (currentPres == null) {
						currentPres = new Presence(PresenceType.AVAILABLE);
					}
					currentPres.setStanzaId(null);
					currentPres.setUserStatus(statusMessageVal);
					conn.changeStatus(currentPres);
				}
			}
			
			if (statusMessageVal == null || statusMessageVal == "") {
				var conn = connectionMgr.getAllConnections()[0];
				if (conn) {
					var imgPathAndStatusMess = getStatusInfo(conn.currentPresence);
					statusMessageVal = imgPathAndStatusMess.statusMessage;
				}
				statusMessage.attr("emptyStatus", true);
			} else {
				statusMessage.attr("emptyStatus", false);
			}
			statusMessage.text(statusMessageVal);
			statusMessage.bind("click", statusMessageClickFunc);
			
		});
		$(this).empty();
		$(this).append(inputStatusMessage);
		inputStatusMessage.select();
		inputStatusMessage[0].focus();
	};
	$("#user-status-message").bind("click", statusMessageClickFunc);
	
		
	var connectionMgr = XmppConnectionMgr.getInstance();
	
	connectionMgr.addConnectionListener([
			ConnectionEventType.ContactUpdated,
			ConnectionEventType.ContactRemoved,
			ConnectionEventType.ContactStatusChanged,
			ConnectionEventType.ChatCreated
		],
		
		function(event) {
			var contact = event.contact;
			var eventType = event.eventType;
			if (eventType == ConnectionEventType.ContactUpdated
				|| eventType == ConnectionEventType.ContactStatusChanged) {
				updateContact(contactlist, contact, false);
			} else if (eventType == ConnectionEventType.ContactRemoved) {
				updateContact(contactlist, contact, true);
			} else if (eventType == ConnectionEventType.ChatCreated) {
				var connection = event.connection;
				var bareJID = event.chat.bareJID;
				var contact = connection.getContact(bareJID);
				var showName = (contact) ? contact.getShowName() : bareJID.toBareJID();
				
				createChatHtml(chatScrollHeader, chatPanel, false, {
					jid: bareJID.toBareJID(),
					showName: showName
				});
				if (chatScrollHeader.children().size() == 1) {
					chatScrollHeader.children().click();
				}
			}
		}
	);
	
	var conn = connectionMgr.getAllConnections()[0];
	if (conn) {
		conn.queryRoster();
		if (conn.initPresence) {
			conn.changeStatus(conn.initPresence);
			var imgPathAndStatusMess = getStatusInfo(conn.initPresence);
			
			$("#user-status-img").attr("src", imgPathAndStatusMess.imgPath);
			var statusMessage = imgPathAndStatusMess.statusMessage;
			if (conn.initPresence.getUserStatus() != null) {
				statusMessage = conn.initPresence.getUserStatus();
			}
			$("#user-status-message").text(statusMessage);
			
		}
		$("#userinfo-username").text(conn.getJid().toBareJID());
		
		var vCardIq = new Iq(IqType.GET);
		vCardIq.setTo(new JID(conn.getJid().getNode(), conn.getJid().getDomain(), null));
		vCardIq.addPacketExtension(new IqVCard());
		conn.handleStanza({
			filter: new PacketIdFilter(vCardIq.getStanzaId()),
			timeout: Christy.loginTimeout,
			handler: function(iqResponse) {
				if (iqResponse.getType() == IqType.RESULT) {
					var vCard = iqResponse.getPacketExtension(IqVCard.ELEMENTNAME, IqVCard.NAMESPACE);
					if (vCard.getNickName()) {
						$("#userinfo-username").text(vCard.getNickName());
					}
					if (vCard.hasPhoto()) {
						$("#userphoto").attr("src", "data:" + vCard.getPhotoType() + ";base64," + vCard.getPhotoBinval());
					}
				}
			}
		});
		
		conn.sendStanza(vCardIq);
	}
	
	Preferences.updatePreferences(false);
}

ImService.show = function() {
	var imservices = $("#imservices");
	imservices.siblings().hide();
	imservices.show();
	
	var imTop = $("#imTop");
	imTop.children(".sexysimple").click();
}


function createContactJqObj(newContact) {
	
	var newBareJid = newContact.getBareJid();
	
	var showName = newContact.getShowName();
	var statusMessage = $.i18n.prop("imservices.status.unavailable", "离线");
	var newContactJqObj = $("<div>" +
								"<table style='width:100%;'>" +
									"<tr>" +
										"<td>" +
											"<img status-img='true' src='/resource/status/unavailable.png'/>" +
										"</td>" +
										"<td style='width:100%;'>" +
											"<table>" +
												"<tr>" +
													"<td>" +
														"<div showname='true'>" + showName + "</div>" +
													"</td>" +
												"</tr>" +
												"<tr>" +
													"<td>" +
														"<div status-message='true'>" + statusMessage + "</div>" +
													"</td>" +
												"</tr>" +
											"</table>" + 
										"</td>" +
										"<td contactJid='" + newBareJid.toPrepedBareJID() + "'>" +
											"<img src='/resource/statusmenu.png'/>" +
										"</td>" +
										"<td contactJid='" + newBareJid.toPrepedBareJID() + "'>" +
											"<img src='/resource/ajax-loader2.gif'/>" +
										"</td>" +
									"<tr/>" +
								"</table>" +
							"</div>");
							

	
	newContactJqObj.attr("contactJid", newBareJid.toPrepedBareJID());
	newContactJqObj.attr("statusCode", 0);
	
	var tdFirst = newContactJqObj.find("td:first");
	
	var clickFunc = function(){
		var contactJid = $(this).attr("contactJid");
		var connectionMgr = XmppConnectionMgr.getInstance();
		var conn = connectionMgr.getAllConnections()[0];
		if (conn) {
			var contact = conn.getContact(JID.createJID(contactJid));
			var chatScrollHeader = $("#chat-scroller-header");
			var chatPanel = $("#chat-panel");
			createChatHtml(chatScrollHeader, chatPanel, true, {
				jid: contactJid,
				showName: contact.getShowName()
			});
		}		
	};
	tdFirst.click(clickFunc);
	tdFirst.next().click(clickFunc);
	
	var contactInfoButton = tdFirst.next().next();
	contactInfoButton.click(function(){
		var iq = new Iq(IqType.GET);
		
		var jid = $(this).attr("contactJid");
		
		var vCard = new IqVCard();
		iq.setTo(JID.createJID(jid));
		iq.addPacketExtension(vCard);
		
		var connectionMgr = XmppConnectionMgr.getInstance();
		var conn = connectionMgr.getAllConnections()[0];
		if (conn) {
			conn.handleStanza({
				filter: new PacketIdFilter(iq.getStanzaId()),
				timeout: Christy.loginTimeout,
				handler: function(iqResponse) {
					if (iqResponse.getType() == IqType.RESULT) {
						var contact = conn.getContact(JID.createJID(jid));
						showContactInfo(contact, iqResponse);
					} else {
						alert($.i18n.prop("imservices.getvcardFailed", "获取失败！"));
					}
				}
			});
			
			conn.sendStanza(iq);
		}
	});
	
	var locButton = contactInfoButton.next();
	locButton.click(function(){
		var jid = $(this).attr("contactJid");
		var connectionMgr = XmppConnectionMgr.getInstance();
		var conn = connectionMgr.getAllConnections()[0];
		var contact = conn.getContact(JID.createJID(jid));
		if (contact.isResourceAvailable()) {
			var userResource = contact.getMaxPriorityResource();
			var presence = userResource.currentPresence;
			var geolocX = presence.getPacketExtension(GeoLocExtension.ELEMENTNAME, GeoLocExtension.NAMESPACE);
			if (geolocX && geolocX.getType() == GeoLocType.LATLON) {
				var lat = geolocX.getLat();
				var lon = geolocX.getLon();
				
				var mapItem = {
    				id: jid,
    				title: contact.getShowName(),
    				isShow: true,
    				positions: [{
    					lat: lat,
    					lon: lon
    				}]
    			};
				MapService.updateMapItem(mapItem);
				MapService.show();
			}					
		} else {
			MapService.removeMapItem(jid);
		}
		
		
	});
	return newContactJqObj;
}

function showContactInfo(contact, iqResponse) {
	var vCard = iqResponse.getPacketExtension(IqVCard.ELEMENTNAME, IqVCard.NAMESPACE);
	$("#contactInfoJid").text(contact.getBareJid().toBareJID());
	
	$("#contactNickName").val(contact.getNickname());
	
	var rosterItem = contact.getRosterItem();
	var subscription = rosterItem.getSubscription();
	var unsubscribedContactCheckbox = $("#unsubscribedContactCheckbox");
	unsubscribedContactCheckbox.attr("checked", false);
	if (subscription == IqRosterSubscription.from
		|| subscription == IqRosterSubscription.both) {
		unsubscribedContactCheckbox.attr("checked", false);
	} else if (subscription == IqRosterSubscription.to) {
		unsubscribedContactCheckbox.attr("checked", true);
	} else {
		unsubscribedContactCheckbox.attr("disabled", true);
	}
	
	var groupName = contact.getGroups()[0];
	$("#contactInfoGroup").val(groupName);
	
	var contactInfoTab = $("#contactInfoTab");
	contactInfoTab.show();
	contactInfoTab.click();
}


function updateContact(contactlistJqObj, contact, remove) {
	var bareJid = contact.getBareJid();
	var contactJqObj = contactlistJqObj.find("div[contactjid='" + bareJid.toPrepedBareJID() + "']");
	
	var addContact = false;
	
	if (contactJqObj.length == 0) {
		addContact = true;
	} 
	
	contactJqObj.remove();
	
	if (!remove) {
		
		contactJqObj = createContactJqObj(contact);
	
		var statusImgSrc = null;
		var statusMessage = null;
		if (contact.isResourceAvailable()) {
			var userResource = contact.getMaxPriorityResource();
			var presence = userResource.currentPresence;
			
			var statusInfo = getStatusInfo(presence);
			contactJqObj.attr("statusCode", statusInfo.statusCode);
			statusImgSrc = statusInfo.imgPath;
			statusMessage = statusInfo.statusMessage;
			
			if (presence.getUserStatus() != null) {
				statusMessage = presence.getUserStatus();
			}
		} else {
			statusImgSrc = "/resource/status/unavailable.png";
			statusMessage = $.i18n.prop("imservices.status.unavailable", "离线");
			contactJqObj.attr("statusCode", 0);
		}
		
		var statusImg = contactJqObj.find("img[status-img]");
		statusImg.attr("src", statusImgSrc);
		
		var showName = contact.getShowName();
		var showNameJqObj = contactJqObj.find("div[showname]");
		showNameJqObj.text(showName);
		
		var statusMessageJqObj = contactJqObj.find("div[status-message]");
		statusMessageJqObj.text(statusMessage);
		
		var groupNames = contact.getGroups().slice(0);
		if (groupNames.length == 0) {
			groupNames[0] = "general";
		}
		
		//add contact to group
		for (j = 0; j < groupNames.length; ++j) {
			var groupName = groupNames[j];
			
			var groupJqObj = contactlistJqObj.find("div[groupname='" + groupName + "']");
			if (groupJqObj.length == 0) {
				groupJqObj = addGroup(contactlistJqObj, groupName);
			}
			var inserted = false;
			var contacts = groupJqObj.children("[contactjid]");
			$.each(contacts, function(index, value) {		
				var oldContactJqObj = $(value);
				var oldContactStatusCode = oldContactJqObj.attr("statusCode");
				var contactStatusCode = contactJqObj.attr("statusCode");
				
				if (contactStatusCode > oldContactStatusCode) {
					contactJqObj.clone(true).insertBefore(oldContactJqObj);
					inserted = true;
					return false;
				} else if (contactStatusCode == oldContactStatusCode) {
					var oldBareJid = oldContactJqObj.attr("contactJid");
					if (bareJid.toPrepedBareJID() < oldBareJid) {
						contactJqObj.clone(true).insertBefore(oldContactJqObj);
						inserted = true;
						return false;
					}
				}
			});
			if (!inserted) {
				groupJqObj.append(contactJqObj.clone(true));
			}	
		}
	}
	//update group
	var groupJqObjs = contactlistJqObj.children("[groupname]");
	$.each(groupJqObjs, function(index, value) {		
		var groupJqObj = $(value);
		//remove emtpy group
		var contacts = groupJqObj.children("[contactJid]");
		if (contacts.length == 0) {
			groupJqObj.remove();
		} else {
			// calculate online user
			var onlineCount = 0;
			$.each(contacts, function(index, valueContact) {		
				var groupContact = $(valueContact);
				var status = groupContact.attr("statusCode");
				if (status > 0) {
					++onlineCount;
				}
			});
			var groupN = groupJqObj.attr("groupname");
			groupJqObj.children(":first").text(groupN + "(" + onlineCount + "/" + contacts.length + ")");
			
		}
	});
		
	if (addContact && $("#contactlist").is(":visible")) {
		$.layoutEngine(imContactlayoutSettings);
	}
	
	// TODO update chat tab
}

function addGroup(contactlistJqObj, groupName) {
	var newGroupJqObj = $("<div></div>").attr("groupname", groupName);
	var groupLabel = $("<div id='" + groupName + "-label' class='contactGroup'></div>").text(groupName);
	
	newGroupJqObj.append(groupLabel);
	groupLabel.click(function(){
		var groupContacts = newGroupJqObj.children("[contactJid]");
		if (groupContacts.is(":visible")) {
			groupContacts.hide();
		} else {
			groupContacts.show();
		}
	});
	
	var inserted = false;
	var groupJqObjs = contactlistJqObj.children("[groupname]");
	$.each(groupJqObjs, function(index, value) {		
		var oldGroupJqObj = $(value);
		var oldGroupName = oldGroupJqObj.attr("groupname");
		if (groupName < oldGroupName) {
			newGroupJqObj.insertBefore(oldGroupJqObj);
			inserted = true;
			return false;
		}
	});
	if (!inserted) {
		contactlistJqObj.append(newGroupJqObj);
	}
	return newGroupJqObj;
}

function createChatHtml(chatScrollHeader, chatPanel, showChatPanel, contactInfo) {
	
	var chatPanelTab = chatScrollHeader.children("span[tabContactJid='" + contactInfo.jid + "']");
	if (chatPanelTab[0] == null) {
		chatPanelTab = $("<span tabContactJid='" + contactInfo.jid + "'>" + contactInfo.showName + "</span>");
	
		var chatHandlerFunc = function(){
			$("span[tabContactJid]").removeClass('selected');
			$(this).addClass("selected");	
			$(this).removeClass("hasNewMessage");
			var currentChatPanel = $("#chat-panel > div[chatPanelId=" + $(this).attr('tabContactJid') + "-chatPanel]");
			currentChatPanel.siblings().hide();	
			currentChatPanel.show();
			$.layoutEngine(imChatlayoutSettings);
			var messageArea = currentChatPanel.find("div[messagearea]");
			if (messageArea.is(":visible")) {
				scrollToWindowBottom();
			}
			MainUI.removeAppEventInfo(StringUtils.hash(contactInfo.jid, "md5"));
		};
		
		chatPanelTab.click(chatHandlerFunc);
		chatScrollHeader.append(chatPanelTab);
										
		var contactChatPanel = $("<div chatPanelId='" + contactInfo.jid + "-chatPanel' style='display:none;'>" +
									"<table style='width:100%;height:100%;'>" +
										"<tr style='height:100%;'>" +
											"<td style='padding-left:7px;'>" +
												"<div messagearea='1' style='width:100%;height:100%;word-break:break-all;'></div>" +
											"</td>" +
										"</tr>" +
										"<tr>" +
											"<td>" +
												"<table>" +
													"<tr>" +
														"<td>" +
															"<button>" + $.i18n.prop("imservices.action.close", "关闭") + "</button>" +
														"</td>" +
														"<td style='width:100%;'>" +
															"<input type='text' style='width:100%;'/>" +
														"</td>" +
														"<td>" +
															"<button class='sexybutton sexysimple sexymygray'>" +
																$.i18n.prop("imservices.action.send", "发送") +
															"</button>" +
														"</td>" +
													"</tr>" +
												"</table>" +
											"</td>" +
										"</tr>" +
									"</table>" +
								"</div>");
								
		var controlBar = contactChatPanel.find("table:last");
									
		var connectionMgr = XmppConnectionMgr.getInstance();
		var conn = connectionMgr.getAllConnections()[0];
		var contactJid = JID.createJID(contactInfo.jid);
		var chat = conn.getChat(contactJid, true);
		
		var messageArea = contactChatPanel.find("div[messagearea]");
		
		var messageReceivedHandler = function(event) {
			var eventChat = event.chat;
			if (eventChat != chat) {
				return;
			}
			var contact = conn.getContact(eventChat.bareJID);
			var showName = (contact) ? contact.getShowName() : eventChat.bareJID.getNode();
			var message = event.stanza;
			messageArea.append("<div class='contactMessage'>" + showName + ":" + message.getBody() + "</div>");
			$.layoutEngine(imChatlayoutSettings);
			if (messageArea.is(":visible")) {
				scrollToWindowBottom();
			}

			if (!contactChatPanel.is(":visible")) {
				chatPanelTab.addClass("hasNewMessage");
				MainUI.addAppEventInfo({
					eventId: StringUtils.hash(eventChat.bareJID.toPrepedBareJID(), "md5"),
					eventName: showName,
					handler: function() {
						$("#chat-tab").click();
						chatPanelTab.click();
					}
				});
			}
		};
		
		connectionMgr.addConnectionListener([
				ConnectionEventType.MessageReceived
			],
			messageReceivedHandler
		);
			
		controlBar.find("button:first").click(function(){
			var selectedTab = chatPanelTab.prev();
			if (selectedTab[0] == null) {
				selectedTab = chatPanelTab.next();
			}
			
			selectedTab.click();
			
			chatPanelTab.remove();
			contactChatPanel.remove();
			conn.removeChat(contactJid);
			connectionMgr.removeConnectionListener(messageReceivedHandler);
		});
		
		var sendMessageAction = function(){
			var text = controlBar.find("input").val();
			if (text != null && text != "") {
				conn.sendChatText(chat, text);
				controlBar.find("input").val("");
				messageArea.append("<div class='myMessage'>" + $("#userinfo-username").text() + ":" + text + "</div>");
				$.layoutEngine(imChatlayoutSettings);
				if (messageArea.is(":visible")) {
					scrollToWindowBottom();
				}
			}
		};
		controlBar.find("input").keypress(function(event) {
			if (event.keyCode == 13) {
				sendMessageAction();
			}
		});
		controlBar.find("button:last").click(sendMessageAction);

		chatPanel.append(contactChatPanel);
	}
	
	if (showChatPanel) {
		$("#chat-tab").click();
		chatPanelTab.click();
	}
	
}

function getStatusInfo(presence) {
	var imgPath = "/resource/status/unavailable.png";
	var statusMessage = $.i18n.prop("imservices.status.unavailable", "离线");
	var statusCode = 0;
	if (presence != null && presence.isAvailable()) {
		if (presence.getShow() == PresenceShow.AWAY) {
			statusMessage = $.i18n.prop("imservices.status.away", "离开");
			imgPath = "/resource/status/away.png";
			statusCode = 3;
		} else if (presence.getShow() == PresenceShow.CHAT) {
			statusMessage = $.i18n.prop("imservices.status.chat", "空闲");
			imgPath = "/resource/status/chat.png";
			statusCode = 5;
		} else if (presence.getShow() == PresenceShow.DND) {
			statusMessage = $.i18n.prop("imservices.status.dnd", "忙碌");
			imgPath = "/resource/status/dnd.png";
			statusCode = 2;
		} else if (presence.getShow() == PresenceShow.XA) {
			statusMessage = $.i18n.prop("imservices.status.xa", "离开");
			imgPath = "/resource/status/xa.png";
			statusCode = 1;
		} else {
			statusMessage = $.i18n.prop("imservices.status.available", "在线");
			imgPath = "/resource/status/available.png";
			statusCode = 4;
		}
	}

	return {imgPath: imgPath, 
				statusMessage: statusMessage, 
				statusCode: statusCode};
	
	
}
// end of IMService


// start of ShopService

ShopService = {};
ShopService.shopSearchResult = {};

ShopService.init = function() {
	
	var shopservices = $("<div id='shopservices'></div>");	
	
	var controlBar = $("<table id='shopcontrolbar' style='width:100%;'>" +
							"<tr>" +
								"<td style='width:33%;float:left;'>" +
									"<button id='back' style='margin-left:0.2cm;' class='sexybutton sexysimple sexymygray sexysmall'>Back</button>" +
								"</td>" +
								"<td style='width:33%;'>" +
									"<div id='shopTitle'>Search</div>" +
								"</td>" +
								"<td>" +
									"<div style='float:right;'>" +
									"<button id='searchShop' style='margin-right:1cm;' class='sexybutton sexysimple sexymygray sexysmall'>Search Nearby</button>" +
									"<button id='maplistShop' style='margin-right:1cm;display:none;' class='sexybutton sexysimple sexymygray sexysmall'>Map List</button>" +
									"<button id='commentShopButton' style='display:none;margin-right:5px;' class='sexybutton sexysimple sexymygray sexysmall'>Comment</button>" +
									"<button id='showshopinmap' style='margin-right:1cm;display:none;' class='sexybutton sexysimple sexymygray sexysmall'>Map</button>" +									
									"</div>" +
								"</td>" +
							"</tr>" +
						"</table>");
	
	shopservices.append(controlBar);
	
	var shopCenter = $("<div id='shopCenter'></div>");
	var shopSearch = $("<div id='shopsearch' title='Search' class='marginpadding'></div>");
	var searchBar = $("<div style='text-align:center;margin:auto;'>" +
							"<input type='text' style='margin-right:0.1cm;'/>" +
							"<button class='sexybutton sexysimple sexymygray sexysmall'>Search</button>" +
						"</div>");
	
	shopSearch.append(searchBar);
	
	shopSearch.append("<br/>");
	
	var popularArea = $("<table>" +
							"<tr>" +
								"<td>Popular Area Title</td>" +
							"</tr>" +
							"<tr>" +
								"<td>Popular Area1</td>" +
							"</tr>" +
							"<tr>" +
								"<td>Popular Area2</td>" +
							"</tr>" +
							"<tr>" +
								"<td>Popular Area3</td>" +
							"</tr>" +
							"<tr>" +
								"<td>Popular Area4</td>" +
							"</tr>" +
						"</table>");
	shopSearch.append(popularArea);	
	shopCenter.append(shopSearch);	

	var shopList = $("<div id='shoplist' title='Search Result' class='marginpadding' style='display:none;'>" +
						"<div></div>" +
						"<div id='pagination' class='pagination'></div>" +
					"</div>");
	shopCenter.append(shopList);
	
	var shopDetailJqObj = $("<div id='shopdetail' class='marginpadding' style='display:none;'></div>");
	shopCenter.append(shopDetailJqObj);
	
	shopservices.append(shopCenter);
	
	var commentShop = $("<table id='commentShop' style='display:none;width:100%;height:100%;'>" +
							"<tr>" +
								"<td style='float:left;'>" +
									"<span>" + $.i18n.prop("shopservice.totalScore", "总分：") + "</span><input id='shopScore' type='text' size='3'/>" +
								"</td>" +
							"</tr>" +
							"<tr>" +
								"<td style='float:left;'>" +
									"<div id='shopCommentItems'>" +
										"<div>" +
											"<span>" + $.i18n.prop("shopservice.taste", "口味：") + "</span><input id='shopTaste' type='text' size='7'/>" +
											"<span>" + $.i18n.prop("shopservice.environment", "环境：") + "</span><input id='shopEnvironment' type='text' size='7'/>" +
										"</div>" +
										"<div>" +
											"<span>" + $.i18n.prop("shopservice.service", "服务：") + "</span><input id='shopService' type='text' size='7'/>" +
										"</div>" +
									"</div>" +
								"</td>" +
							"</tr>" +
							"<tr style='width:100%;height:100%;'>" +
								"<td style='float:left;width:100%;height:100%;'>" +
									"<input id='commentContent' type='text' style='width:100%;height:100%;' />" +
								"</td>" +
							"</tr>" +
							"<tr >" +
								"<td>" +
									"<button id='submitShopComment'>" + $.i18n.prop("shopservice.submit", "提交") + "</button>" +
								"</td>" +
							"</tr>" +
						"</table>");
	shopCenter.append(commentShop);

	shopserviceTablayoutSettings = {
		Name: "Main",
        Dock: $.layoutEngine.DOCK.FILL,
        EleID: "main",
		Children:[{
			Name: "Top",
			Dock: $.layoutEngine.DOCK.FILL,
			EleID: "shopservices",
			Children:[{
	 			Name: "Top2",
				Dock: $.layoutEngine.DOCK.TOP,
				EleID: "shopcontrolbar",
				Height: 30
			}, {
				Name: "Fill2",
				Dock: $.layoutEngine.DOCK.FILL,
		 		EleID: "shopCenter"
			}]
		}]
	};
	
	
	$("#main").append(shopservices);
	
	$("#back").click(function() {
		var showItem = $("#shopCenter").children(":visible");
		var prev = showItem.prev();
		if (prev[0]) {
			$("#shopTitle").text(prev.attr("title"));
			prev.siblings().hide();
			prev.show();
			
			var showButton = null;
			if (prev.attr("id") == "shopsearch") {
				showShopSearchPanel();
			} else if (prev.attr("id") == "shoplist") {
				showShopListPanel();
			} else if (prev.attr("id") == "shopdetail") {
				showShopDetailPanel();
			}
			$.layoutEngine(shopserviceTablayoutSettings);
		}
	});
	
	$("#searchShop").click(function() {
		var shopList = $("#shoplist");
		$(shopList.children()[0]).empty();
		
		GeoUtils.getCurrentPosition(function(p) {
			searchShopsByLoc(shopList, p, 1, 5, true);
		}, function(){}, true);		
		
		$("#shopTitle").text(shopList.attr("title"));
		shopList.siblings().hide();
		shopList.show();
		
		var nextButton = $(this).next();
		nextButton.siblings().hide();
		nextButton.show();
		
		$.layoutEngine(shopserviceTablayoutSettings);
	});
	
	
	
	$("#commentShopButton").click(function(){
		showShopComment(ShopService.currentShopDetail.basicInfo.name);
	});
	
	$("#submitShopComment").click(function() {
		submitShopComment();
	});
	
	$.layoutEngine(shopserviceTablayoutSettings);
	
}


ShopService.show = function() {
	var shopservices = $("#shopservices");
	shopservices.siblings().hide();
	shopservices.show();
	$.layoutEngine(shopserviceTablayoutSettings);
}

function createShopInfo(shopInfo) {
	var shopInfoTable = $("<table shopId='" + shopInfo.id + "'>" +
								"<tr>" +
									"<td>" +
										"<img src='" + shopInfo.imgSrc + "' width='50' height='50' />" +
									"</td>" +
									"<td>" +
										"<div>" + shopInfo.name + "</div>" +
										"<div>" + shopInfo.tel + "</div>" +
										"<div>" + shopInfo.street + "</div>" +
									"</td>" +
								"</tr>" +
							"</table>");
	shopInfoTable.click(function(){
		var shopId = $(this).attr("shopId");
		$.ajax({
			url: "/shop/",
			dataType: "json",
			cache: false,
			type: "get",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			data: {
				action: "getshopdetail",
				shopid: shopId
			},
			success: function(shopDetail){
				ShopService.currentShopDetail = shopDetail;
				showShopDetail(shopDetail);
			},
			error: function (xmlHttpRequest, textStatus, errorThrown) {
				
			},
			complete: function(xmlHttpRequest, textStatus) {
				
			}
		});

	});
	
	return shopInfoTable;
}

function submitShopComment() {
	var shopDetail = ShopService.currentShopDetail;
	var connectionMgr = XmppConnectionMgr.getInstance();
	var conn = connectionMgr.getAllConnections()[0];
	if (conn) {
		var username = conn.getJid().getNode();
		var shopId = shopDetail.basicInfo.id;
		
		var comentContent = "";
		var shopScore = $("#shopScore");
		comentContent += "shopScore:" + shopScore.val() + ";";
		
		var commentShopTable = $("#commentShop");
		var items = commentShopTable.find("input[item]");

		$.each(items, function(index, value) {		
			var commentItem = $(value);
			var itemName = commentItem.attr("item");
			var itemValue = commentItem.val();
			comentContent += itemName + ":" + itemValue + ";";
		});
		
		var content = $("#commentContent");
		comentContent += "content" + ":" + content.val() + ";";
		
		
		$.ajax({
			url: "/shop/",
			cache: false,
			type: "get",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			data: {
				action: "submitShopComment",
				shopid: shopId,
				username: username,
				comentContent: comentContent
			},
			success: function(response){
				if (response.result == "success") {
					alert($.i18n.prop("shopservice.commentSuccess", "评论成功！"));
					$("#back").click();
				}
			},
			error: function (xmlHttpRequest, textStatus, errorThrown) {
				
			},
			complete: function(xmlHttpRequest, textStatus) {
				
			}
		});
		
	}
}

function showShopComment(shopTitleText) {
	
	var commentShopTable = $("#commentShop");

	var shopDetail = ShopService.currentShopDetail;
	var overall = shopDetail.overall;
	if (overall) {
		var shopCommentItems = $("#shopCommentItems");
		shopCommentItems.empty();
		var i = 1;
		for(var key in overall) {
			if ("score" != key) {
				shopCommentItems.append("<span>" + $.i18n.prop("shopservice." + key, "项目：") + "</span><input item='" + key + "' type='text' size='7'/>");
				if (i != 0 && i % 2 == 0) {
					shopCommentItems.append("<br/>");
				}
				++i;
			}
		}
	}
	

	commentShopTable.find("input").text("");
	commentShopTable.siblings().hide();
	commentShopTable.show();
	
	var shopTitle = $("#shopTitle");
	shopTitle.text(shopTitleText);
	
	var commentShopButton = $("#commentShopButton");
	commentShopButton.siblings().hide();
	commentShopButton.hide();
	$.layoutEngine(shopserviceTablayoutSettings);
	
}

function showShopDetail(shopDetail) {
	
	var shopDetailJqObj = $("#shopdetail");
	shopDetailJqObj.empty();
	var baseInfo = shopDetail.basicInfo;
	var overall = shopDetail.overall;
	var shopBaseInfo = $("<table shopId='" + baseInfo.id + "'>" +
							"<tr>" +
								"<td>" +
									"<img src='" + baseInfo.imgSrc + "' width='50' height='50' />" +
								"</td>" +
								"<td>" +
									"<div>" + baseInfo.name + " "+ baseInfo.hasCoupon + 
										"<button>收藏</button>" +
									"</div>" +
									"<div>" + overall.score + " "+ overall.perCapita + "</div>" +
									"<span>Service:" + overall.service + "</span>" + 
									"<span>Taste:" + overall.taste + "</span>" + 
								"</td>" +
							"</tr>" +
						"</table>");
	
	shopBaseInfo.find("button").click(function(){
		var iq = new Iq(IqType.SET);
	
		var userFavoriteShop = new IqUserFavoriteShop();
		var item = new ShopItem(baseInfo.id);
		item.setAction("add");
		userFavoriteShop.addShopItem(item);
		iq.addPacketExtension(userFavoriteShop);
		
		var connectionMgr = XmppConnectionMgr.getInstance();
		var conn = connectionMgr.getAllConnections()[0];
		if (conn) {
			conn.handleStanza({
				filter: new PacketIdFilter(iq.getStanzaId()),
				timeout: Christy.loginTimeout,
				handler: function(iqResponse) {
					if (iqResponse.getType() == IqType.RESULT) {
						alert($.i18n.prop("personal.favoriteSuccess", "收藏成功!"));
					} else {
						alert($.i18n.prop("personal.favoriteFailed", "收藏失败!"));
					}
				}
			});
			
			conn.sendStanza(iq);
		}
	});
	
	shopDetailJqObj.append(shopBaseInfo);

	var contact = $("<table>" +
						"<tr>" +
							"<td style='word-break:break-all;'>" +
								shopDetail.intro +
							"</td>" +
						"</tr>" +
						"<tr>" +
							"<td style='word-break:break-all;'>" +
								"address:" + baseInfo.addr + "<br/>" +
								"phone:" + baseInfo.phone + 
							"</td>" +
						"</tr>" +
					"</table>");
					
	shopDetailJqObj.append(contact);
	
	shopDetailJqObj.append("<br/>");
	
	var comms = shopDetail.comments;
	var commsJqObj = $("<div></div>");
	for (i = 0; i < comms.length; ++i) {
		var onecomment = comms[i];
		commsJqObj.append("<table>" +
								"<tr>" +
									"<td>" + onecomment.username + "</td>" +
									"<td>" + new Date(onecomment.time).format("yyyy-MM-dd hh:mm:ss") + "</td>" +
								"</tr>" +
								"<tr>" +
									"<td colspan='2'>" + onecomment.score + "</td>" +
								"</tr>" +
								"<tr>" +
									"<td colspan='2'>" + onecomment.content + "</td>" +
								"</tr>" +
							"</table>");
	}
	
	$("#shopTitle").text(shopDetailJqObj.attr("title"));
	shopDetailJqObj.append(commsJqObj);
	shopDetailJqObj.siblings().hide();
	shopDetailJqObj.show();
	
	var showInMap = $("#showshopinmap");
	var commentShopButton = $("#commentShopButton");
	showInMap.siblings().hide();
	showInMap.show();
	commentShopButton.show();
	
	$.layoutEngine(shopserviceTablayoutSettings);
}

function showShopSearchPanel() {
	var shopSearch = $("#shopsearch");
	shopSearch.siblings().hide();
	shopSearch.show();
	
	var searchShop = $("#searchShop");
	searchShop.siblings().hide();
	searchShop.show();
	
	$.layoutEngine(shopserviceTablayoutSettings);
}

function showShopListPanel() {
	var shopList = $("#shoplist");
	
	if (shopList.children("div:first").children().size() == 0) {
		$("#back").click();
		return;
	}
	
	shopList.siblings().hide();
	shopList.show();
	
	var mapListShop = $("#maplistShop");
	mapListShop.siblings().hide();
	mapListShop.show();
	
	$.layoutEngine(shopserviceTablayoutSettings);
}

function showShopDetailPanel() {
	var shopDetail = $("#shopdetail");
	shopDetail.siblings().hide();
	shopDetail.show();
	
	var showShopInMap = $("#showshopinmap");
	
	showShopInMap.siblings().hide();
	showShopInMap.show();
	
	var commentShopButton = $("#commentShopButton");
	commentShopButton.show();
	
	$.layoutEngine(shopserviceTablayoutSettings);
}

function searchShopsByLoc(shopList, p, page, count, updatePage) {
	$.ajax({
		url: "/shop/",
		dataType: "json",
		cache: false,
		type: "get",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: {
			action: "search",
			easting: p.easting,
			northing: p.northing,
			page: page,
			count: count
		},
		success: function(searchResult){
			shopSearchResult = searchResult;
			$(shopList.children()[0]).empty();
			var shops = searchResult.shops;
			for (i = 0; i < shops.length; ++i) {
				var shopTable = createShopInfo(shops[i]);
				$(shopList.children()[0]).append(shopTable);
			}
			if (updatePage) {
				$("#pagination").pagination(10, {
					num_edge_entries: 1,
					num_display_entries: 8,
					items_per_page: count,
	                callback: function(page_id, jq) {
						searchShopsByLoc(shopList, p, page_id + 1, count, false);
	                }
	            });
			}
			
			$.layoutEngine(shopserviceTablayoutSettings);
		},
		error: function (xmlHttpRequest, textStatus, errorThrown) {
			
		},
		complete: function(xmlHttpRequest, textStatus) {
			
		}
	});
	
}
// end of ShopService


// start of MapService
MapService = {};
MapService.init = function() {
	var mapServices = $("<div id='mapservices'></div>");

	var controlBar = $("<table id='mapControlbar' style='width:100%;'>" +
							"<tr>" +
								"<td style='width:50%;'>" +
									"<button style='float:left;margin-left:0.2cm;' class='sexybutton sexysimple sexymygray sexysmall'>Route</button>" +
								"</td>" +
								"<td style='width:50%;'>" +
									"<button style='float:right;margin-right:1cm;' class='sexybutton sexysimple sexymygray sexysmall'>Result List</button>" +
								"</td>" +
							"</tr>" +
						"</table>");
	controlBar.find("button:first").click(function(){
		var mapcanvas = $("#mapcanvas");
		mapcanvas.show();
		
		var mapItems = $("#mapItems");
		mapItems.hide();
		
		$.layoutEngine(mapserviceTablayoutSettings);
	});
	
	controlBar.find("button:last").click(function(){
		var mapcanvas = $("#mapcanvas");
		mapcanvas.hide();
		
		var mapItems = $("#mapItems");
		mapItems.show();
		
		$.layoutEngine(mapItemslayoutSettings);
	});
	
	mapServices.append(controlBar);
	
	var mapcanvas = $("<iframe id='mapcanvas' name='mapcanvas' width='100%' height='100%' scrolling='no' frameborder='0'>" +
					"</iframe>");
	mapServices.append(mapcanvas);
	
	var mapItems = $("<div id='mapItems'></div>");
	mapItems.hide();
	mapServices.append(mapItems);
	
	$("#main").append(mapServices);
	mapServices.hide();
	
	mapserviceTablayoutSettings = {
		Name: "Main",
        Dock: $.layoutEngine.DOCK.FILL,
        EleID: "main",
		Children:[{
			Name: "Top",
			Dock: $.layoutEngine.DOCK.FILL,
			EleID: "mapservices",
			Children:[{
	 			Name: "Top2",
				Dock: $.layoutEngine.DOCK.TOP,
				EleID: "mapControlbar",
				Height: 30
			}, {
				Name: "Fill2",
				Dock: $.layoutEngine.DOCK.FILL,
		 		EleID: "mapcanvas"
			}]
		}]  
	};
	
	mapItemslayoutSettings = {
		Name: "Main",
        Dock: $.layoutEngine.DOCK.FILL,
        EleID: "main",
		Children:[{
			Name: "Top",
			Dock: $.layoutEngine.DOCK.FILL,
			EleID: "mapservices",
			Children:[{
	 			Name: "Top2",
				Dock: $.layoutEngine.DOCK.TOP,
				EleID: "mapControlbar",
				Height: 30
			}, {
				Name: "Fill2",
				Dock: $.layoutEngine.DOCK.FILL,
		 		EleID: "mapItems"
			}]
		}]  
	};
	$.layoutEngine(mapserviceTablayoutSettings);
	
	var connectionMgr = XmppConnectionMgr.getInstance();
	connectionMgr.addConnectionListener([
			ConnectionEventType.ContactRemoved,
			ConnectionEventType.ContactStatusChanged
		],
		function(event) {
			var contact = event.contact;
			var bareJid = contact.getBareJid();
			var itemId = bareJid.toPrepedBareJID();
			var mapItem = MapService.mapItems[itemId];
			if (mapItem && mapItem.isShow) {
				var eventType = event.eventType;
				if (eventType == ConnectionEventType.ContactStatusChanged) {
					if (contact.isResourceAvailable()) {
						var userResource = contact.getMaxPriorityResource();
						var presence = userResource.currentPresence;
						var geolocX = presence.getPacketExtension(GeoLocExtension.ELEMENTNAME, GeoLocExtension.NAMESPACE);
						if (geolocX && geolocX.getType() == GeoLocType.LATLON) {
							var lat = geolocX.getLat();
							var lon = geolocX.getLon();
							
							var mapItem = {
			    				id: itemId,
			    				title: contact.getShowName(),
			    				isShow: true,
			    				positions: [{
			    					lat: lat,
			    					lon: lon
			    				}]
			    			};
							MapService.updateMapItem(mapItem);
						}					
					} else {
						MapService.removeMapItem(itemId);
					}
				} else if (eventType == ConnectionEventType.ContactRemoved) {
					MapService.removeMapItem(itemId);
				}
			}
			
		}
	);
}


MapService.show = function() {
	var mapServices = $("#mapservices");
	
	var mapcanvas = $("#mapcanvas");
	if (mapcanvas.attr("src") == null || mapcanvas.attr("src") == "") {
		mapcanvas.attr("src", "/mapcanvas.html");
	}
	
	mapServices.siblings().hide();
	mapServices.show();
	
	var mapItems =  $("#mapItems");
	if (mapcanvas.is(":visible")) {
		$.layoutEngine(mapserviceTablayoutSettings);
	} else if (mapItems.is(":visible")) {
		$.layoutEngine(mapItemslayoutSettings);
	}
}

function mapFrameLoaded() {
	var mapcanvas = $("#mapcanvas");
	for (var key in MapService.mapItems) {
		var mapItem = MapService.mapItems[key];
		if (mapItem.isShow) {
			var marker = {
				id: mapItem.id,
				title: mapItem.title,
				positions: mapItem.positions
			};
			mapcanvas[0].contentWindow.updateMapMarker(marker);
		}
	}
	$.layoutEngine(mapserviceTablayoutSettings);
}

MapService.mapItems= {};

MapService.containMapItem = function (mapItemId) {
	var mapcanvas = $("#mapcanvas");
	var mapItem = MapService.mapItems[mapItemId];
	if (mapItem) {
		return true;
	}
	return false;
}

MapService.updateMapItem = function (mapItem) {
	var mapItemId = mapItem.id;	
	MapService.mapItems[mapItemId] = mapItem;
	
	var mapItems = $("#mapItems");
	var itemDiv = mapItems.children("div[mapItem='" + mapItemId + "']");
	if (itemDiv.size() == 0) {
		itemDiv = $("<div mapItem=" + mapItemId + ">" + 
						"<input id='" + mapItem.id + "-mapItem' name='" + mapItem.id + "-mapItem' type='checkbox' checked='checked'/>" +
						"<label id='" + mapItem.id + "-mapItemLabel' for='" + mapItem.id + "-mapItem'>" + mapItem.title + "</label>" +
						"<button id=''>删除</button>" +
					"</div>");
		itemDiv.children("input").click(function(){
			var checkbox = $(this);
			var mapItem = MapService.mapItems[mapItemId];
			if (mapItem) {
				mapItem.isShow = (checkbox.attr("checked") == true);
				MapService.updateMapItem(mapItem);
			}
		});
		itemDiv.children("button").click(function(){
			MapService.removeMapItem(mapItemId);
			itemDiv.remove();
		});
		mapItems.append(itemDiv);
	}
	

	var mapcanvas = $("#mapcanvas");
	if (mapcanvas.attr("src")) {
		if (mapItem.isShow) {
			var marker = {
				id: mapItem.id,
				title: mapItem.title,
				positions: mapItem.positions
			};
			mapcanvas[0].contentWindow.updateMapMarker(marker);
		} else {
			mapcanvas[0].contentWindow.removeMapMarker(mapItem.id);
		}
		
	}
}

MapService.removeMapItem = function (mapItemId) {
	delete MapService.mapItems[mapItemId];
	var mapcanvas = $("#mapcanvas");
	if (mapcanvas.attr("src")) {
		mapcanvas[0].contentWindow.removeMapMarker(mapItemId);
	}
}
// end of MapService


// start of Personal

Personal = {};
Personal.init = function() {
	var personal = $("<div id='personal'></div>");
	
	// personal tabs
	var personalTop = $("<div id='personalTop'></div>");
	// favorShop tab
	var favoriteShopTab = $("<b id='favoriteShop' tabpanelid='favoriteShopPanel' class='marginpadding'></b>");
	favoriteShopTab.addClass("sexybutton");
	favoriteShopTab.text($.i18n.prop("personal.favorite", "收藏"));
	personalTop.append(favoriteShopTab);
	
	
	// tabs click event
	personalTop.find("b:first").addClass("sexysimple sexyteal");
	personalTop.find("b").click(function(){
		$(this).addClass("sexysimple sexyteal").siblings("b").removeClass("sexysimple sexyteal");
		var tabpanelid = $(this).attr("tabpanelid");
		var tabpanel = $("#" + tabpanelid);
		tabpanel.siblings().hide();
		tabpanel.show();
		
		if (tabpanelid == "favoriteShopPanel") {
			showFavoriteShop();
		}
	});
	
	personal.append(personalTop);
	
	var personalCenter = $("<div id='personalCenter'></div>");
	
	var favoriteShopPanel = $("<div id='favoriteShopPanel'></div>");
	favoriteShopPanel.append("<div id='favoriteShopPagination' class='pagination'></div>");
	
	personalCenter.append(favoriteShopPanel);
	
	
	personal.append(personalCenter);
	
	var personalTopHeight = 40;
	
	personallayoutSettings = {
		Name: "Main",
        Dock: $.layoutEngine.DOCK.FILL,
        EleID: "main",        
        Children:[{
			Name: "Fill",
			Dock: $.layoutEngine.DOCK.FILL,
	 		EleID: "personal",
	 		Children:[{
	 			Name: "Top2",
				Dock: $.layoutEngine.DOCK.TOP,
				EleID: "personalTop",
				Height: personalTopHeight
	 		},{
	 			Name: "Fill2",
				Dock: $.layoutEngine.DOCK.FILL,
		 		EleID: "personalCenter"
	 		}]
		}]
	};
	
	personalFavoriteShoplayoutSettings = {
		Name: "Main",
        Dock: $.layoutEngine.DOCK.FILL,
        EleID: "main",        
        Children:[{
			Name: "Fill",
			Dock: $.layoutEngine.DOCK.FILL,
	 		EleID: "personal",
	 		Children:[{
	 			Name: "Top2",
				Dock: $.layoutEngine.DOCK.TOP,
				EleID: "personalTop",
				Height: personalTopHeight
	 		},{
	 			Name: "Fill2",
				Dock: $.layoutEngine.DOCK.FILL,
		 		EleID: "personalCenter"
	 		}]
		}]
	};
	
	$("#main").append(personal);
	$.layoutEngine(personallayoutSettings);}

function showFavoriteShop() {
	var favoriteShopPanel = $("#favoriteShopPanel");
	if (favoriteShopPanel.children().size() > 1) {
		$.layoutEngine(personallayoutSettings);
		return;
	}
	
	queryFavoriteShop(0, 5, true);
	
}

function queryFavoriteShop(startIndex, max, updatePage) {
	var iq = new Iq(IqType.GET);
	
	var userFavoriteShop = new IqUserFavoriteShop();
	var resultSetExtension = new ResultSetExtension();
	resultSetExtension.setIndex(startIndex);
	resultSetExtension.setMax(max);
	userFavoriteShop.setResultSetExtension(resultSetExtension);
	
	iq.addPacketExtension(userFavoriteShop);
	
	var connectionMgr = XmppConnectionMgr.getInstance();
	var conn = connectionMgr.getAllConnections()[0];
	if (conn) {
		conn.handleStanza({
			filter: new PacketIdFilter(iq.getStanzaId()),
			timeout: Christy.loginTimeout,
			handler: function(iqResponse) {
				if (iqResponse.getType() == IqType.RESULT) {
					var userFavoriteShop = iqResponse.getPacketExtension(IqUserFavoriteShop.ELEMENTNAME, IqUserFavoriteShop.NAMESPACE);
					var shopItems = userFavoriteShop.getShopItems();
					var favoriteShopPanel = $("#favoriteShopPanel");
					favoriteShopPanel.children("table").remove();
					for (var i = 0; i < shopItems.length; ++i) {
						var favoriteShopItemJqObj = createPersonalFavorShop(shopItems[i]);
						var lastTable = favoriteShopPanel.children("table:last");
						if (lastTable[0]) {
							favoriteShopItemJqObj.insertAfter(lastTable);
						} else {
							favoriteShopItemJqObj.insertBefore(favoriteShopPanel.children("div:first"));
						}
						
					}
					
					if (updatePage) {
						var rsx = userFavoriteShop.getResultSetExtension();
						var favoriteShopPagination = $("#favoriteShopPagination");
						favoriteShopPagination.pagination(rsx.getCount(), {
							num_edge_entries: 1,
							num_display_entries: 8,
							items_per_page: 5,
			                callback: function(page_id, jq) {
								queryFavoriteShop(page_id * 5, 5, false);
			                }
		            	});
					}
					$.layoutEngine(personallayoutSettings);
				}				
			}
		});
		
		conn.sendStanza(iq);
	}
}

function createPersonalFavorShop(shopItem) {
	var shopInfoTable = $("<table shopId='" + shopItem.getShopId() + "' style='width:100%;border-bottom:1px solid gray;'>" +
								"<tr>" +
									"<td>" +
										"<div>" + shopItem.getShopName() + " " + shopItem.getStreet() +"</div>" +
										"<div>" + shopItem.getTel() + "</div>" +
									"</td>" +
									"<td style='float:right'>" +
										"<button>删除</button>" +
									"</td>" +
								"</tr>" +
							"</table>");
	shopInfoTable.find("td:first").click(function(){
		var shopId = shopItem.getShopId();
		$.ajax({
			url: "/shop/",
			dataType: "json",
			cache: false,
			type: "get",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			data: {
				action: "getshopdetail",
				shopid: shopId
			},
			success: function(shopDetail){
				ShopService.currentShopDetail = shopDetail;
				showShopDetail(shopDetail);
				ShopService.show();
			},
			error: function (xmlHttpRequest, textStatus, errorThrown) {
				
			},
			complete: function(xmlHttpRequest, textStatus) {
				
			}
		});

	});
	
	shopInfoTable.find("button").click(function(){
		var iq = new Iq(IqType.SET);
		var userFavoriteShop = new IqUserFavoriteShop();
		
		var item = new ShopItem(shopItem.getShopId());
		item.setAction("remove");
		userFavoriteShop.addShopItem(item);
		
		iq.addPacketExtension(userFavoriteShop);
		
		var connectionMgr = XmppConnectionMgr.getInstance();
		var conn = connectionMgr.getAllConnections()[0];
		if (conn) {
			conn.handleStanza({
				filter: new PacketIdFilter(iq.getStanzaId()),
				timeout: Christy.loginTimeout,
				handler: function(iqResponse) {
					if (iqResponse.getType() == IqType.RESULT) {
						$("#favoriteShopPanel").children("table").remove();
						showFavoriteShop();
					}
				}
			});
			
			conn.sendStanza(iq);
		}
	});
	
	
	return shopInfoTable;
};

Personal.show = function() {
	var personal = $("#personal");
	
	personal.siblings().hide();
	personal.show();
	
	var personalTop = $("#personalTop");
	personalTop.children(".sexysimple").click();
	$.layoutEngine(personallayoutSettings);
};


// end of Personal


// start of Preferences
Preferences = {};

Preferences.setPreferenceItem = function(preferenceName, value) {
	var oldValue = Preferences.preferencesItems[preferenceName];
	if (oldValue != value) {
		Preferences.preferencesItems[preferenceName] = value;
		Preferences.fireItemChangedListener(preferenceName, oldValue, value);
	}
}

Preferences.getPreferenceItem = function(preferenceName) {
	return Preferences.preferencesItems[preferenceName];
}

Preferences.preferencesItems = {};
Preferences.preferencesItems['shareLoc'] = false;
Preferences.itemChangedListeners = [];
Preferences.addItemChangedListener = function(listener) {
	if (!isArray(listener.preferenceNames)) {
		listener.preferenceNames = [listener.preferenceNames];
	}
	
	Preferences.itemChangedListeners.push(listener);
};

Preferences.removeItemChangedListener = function(listener) {
	var listeners = Preferences.itemChangedListeners;
	for (var i = 0; i < listeners.length; ++i){
		if (listeners[i] == listener){
			listeners.splice(i,1);
			break;
		}
	}
};

Preferences.fireItemChangedListener = function(preferenceName, oldValue, newValue) {
	var listeners = Preferences.itemChangedListeners;
	for (var i = 0; i < listeners.length; ++i){
		var l = listeners[i];
		if (l.preferenceNames.contains(preferenceName)){
			l.handler(oldValue, newValue);
			break;
		}
	}
};

Preferences.init = function() {
	var preferences = $("<div id='preferences'>" +
							"<table>" +
								"<tr>" +
									"<td>" +
										"<input id='shareloc' name='shareloc' type='checkbox' checked='checked'/>" +
										"<label id='shareloc_label' for='shareloc'>" +
											$.i18n.prop("preferences.shareLoc", "共享位置信息") +
										"</label>" +
									"</td>"+
								"</tr>" +
								"<tr>" +
									"<td>" +
										"<div style='float:right;'>" +
											"<button id='savePreferences'>" +
												$.i18n.prop("preferences.savePreferences", "保存") + 
											"</button>" +
										"</div>" +
									"</td>"+
								"</tr>" +
							"</table>" +
						"</div>");
						
	preferences.find("button").click(function(){
		var iq = new Iq(IqType.SET);
	
		var privateXml = new IqPrivateXml();
		var preferencesExtension = new PreferencesExtension();
		
		var checkbox = $("#shareloc");
		preferencesExtension.setShareLoc(checkbox.attr("checked") == true);
		
		privateXml.setPacketExtension(preferencesExtension);
		iq.addPacketExtension(privateXml);
		
		var connectionMgr = XmppConnectionMgr.getInstance();
		var conn = connectionMgr.getAllConnections()[0];
		if (conn) {
			conn.handleStanza({
				filter: new PacketIdFilter(iq.getStanzaId()),
				timeout: Christy.loginTimeout,
				handler: function(iqResponse) {
					if (iqResponse.getType() == IqType.RESULT) {
						alert($.i18n.prop("preferences.saveSuccess", "保存成功！"));
						
						Preferences.setPreferenceItem("shareLoc", (checkbox.attr("checked") == true));	
					} else {
						alert($.i18n.prop("preferences.saveFailed", "保存失败！"));
					}			
				},
				timeoutHandler: function() {
					alert($.i18n.prop("preferences.saveFailed", "保存失败！"));
				}
			});
			conn.sendStanza(iq);
		}
		
	});
	
	preferenceslayoutSettings = {
		Name: "Main",
        Dock: $.layoutEngine.DOCK.FILL,
        EleID: "main",        
        Children:[{
			Name: "Fill",
			Dock: $.layoutEngine.DOCK.FILL,
	 		EleID: "preferences"
		}]
	};
	
	$("#main").append(preferences);
};

Preferences.updatePreferences = function(updateUI) {
	var iq = new Iq(IqType.GET);
	
	var privateXml = new IqPrivateXml();
	var preferencesExtension = new PreferencesExtension();
	privateXml.setPacketExtension(preferencesExtension);
	iq.addPacketExtension(privateXml);
	
	var connectionMgr = XmppConnectionMgr.getInstance();
	var conn = connectionMgr.getAllConnections()[0];
	if (conn) {
		conn.handleStanza({
			filter: new PacketIdFilter(iq.getStanzaId()),
			timeout: Christy.loginTimeout,
			handler: function(iqResponse) {
				if (iqResponse.getType() == IqType.RESULT) {
					var privateXmlX = iqResponse.getPacketExtension(IqPrivateXml.ELEMENTNAME, IqPrivateXml.NAMESPACE);
					if (privateXmlX) {
						var preferencesX = privateXmlX.getPacketExtension();
						if (preferencesX) {
							var newValue = (preferencesX.isShareLoc() == true);
							Preferences.setPreferenceItem("shareLoc", newValue);
							if (updateUI) {
								Preferences.updatePreferencesUI(preferencesX);
							}
							
							
						}
					}
					
				}				
			}
		});
		
		conn.sendStanza(iq);
	}
}

Preferences.updatePreferencesUI = function(preferencesX) {
	var value = (preferencesX.isShareLoc() == true);				
	var checkbox = $("#shareloc");
	checkbox.attr("checked", value);
	
};

Preferences.show = function() {
	
	var preferences = $("#preferences");
	preferences.siblings().hide();
	preferences.show();
	
	Preferences.updatePreferences(true);
	
	$.layoutEngine(preferenceslayoutSettings);
	
	
	
};
// end of Preferences