/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelRestrictions = {};
panelRestrictions.localization = {};
/****************************/

// Panel details
var panelName = "Restrictions";

// Localizations
panelRestrictions.localization = {
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelRestrictions.localization, localizations.panels[panelName]);

// Interface methods
panelRestrictions.init = function(){
	applyLocalizations(panelName, localizations.panels);
	window.dataBindEvents.push(panelRestrictions.bindData);
	panelRestrictions.bindEvents();
}

panelRestrictions.clearForm = function(panel)
{
	panel = panel || panelRestrictions._panel;
	panel.find("input, select, textarea").each(function(){
		if($(this).closest("div#generateKeyPanel").length>0)return;
		if($(this).attr("type")=="checkbox")
		{
			if($(this).closest("td").is(".checkboxArea"))return;
			crushFTP.UI.checkUnchekInput($(this));
		}
		else
		{
			$(this).val("");
		}
	});
}

panelRestrictions.availablePlugins = function()
{
	//Bind available plugins
	var availablePlugins = $(document).data("GUIXMLPrefs").plugins.plugins_subitem;
	crushFTP.methods.rebuildSubItems(availablePlugins, "plugins_subitem");
	var addedPlugins = [];
	if(!availablePlugins || availablePlugins.length==0)
		return addedPlugins;
	function addPluginName(item)
	{
		if(jQuery.isArray(item) && item.length>0)
		{
			for(var i=0;i<item.length;i++)
			{
				addPluginName(item[i]);
			}
		}
		else
		{
			var pluginName = item.pluginName;
			if(pluginName == "CrushTask")
			{
				var pluginName = item.pluginName;
				/*if(!addedPlugins.has(pluginName))
				{
					addedPlugins.push(pluginName + " (User Defined)");
				}*/
				if(item.subItem && item.subItem.length > 0)
				{
					pluginName = pluginName + ":" + item.subItem;
				}
				if(pluginName && pluginName.length > 0)
				{
					addedPlugins.push(pluginName);
				}
			}
		}
	}
	for(var i=0;i<availablePlugins.length;i++)
	{
		addPluginName(availablePlugins[i].plugins_subitem_subitem);
	}
	if(addedPlugins.length>1)
	{
		var first = addedPlugins[0];
		addedPlugins[0] = addedPlugins[1];
		addedPlugins[1] = first;
	}
	return addedPlugins.sort();
}

panelRestrictions.bindData = function(userInfo, jsonDeep, panel)
{
	$(".offsetEntries", panelRestrictions._panel).hide();
	var dataPanel = panel || panelRestrictions._panel;
	panelRestrictions.clearForm(dataPanel);
	if(panel)
	{
		panel.removeClass("inheritValSet");
	}
	if(userInfo.user)
	{
		var tasks = panelRestrictions.availablePlugins();
		if(tasks && tasks.length>0)
		{
			var crushTaskDrps = $("#account_expire_task, #disabled_account_task, #account_expire_notify_task, #password_expire_notify_task", panel).empty();
			var pluginOpts = $('<optgroup label="Plugin"></optgroup>');
			for(var i=0;i<tasks.length;i++)
			{
				pluginOpts.append("<option value='"+tasks[i]+"'>"+tasks[i]+"</option>");
			}
			crushTaskDrps.append(pluginOpts);
			var availableJobs = $(document).data("AvailableJobsNoEvents");
			if(availableJobs && availableJobs.length>0)
			{
				var jobOpts = $('<optgroup label="Job"></optgroup>');
				for (var i = 0; i < availableJobs.length; i++) {
					jobOpts.append("<option value=\"Job:"+unescape(availableJobs[i])+"\">"+unescape(availableJobs[i])+"</option>");
				}
				crushTaskDrps.append(jobOpts);
			}
			crushTaskDrps.prepend("<option value=''>Please Select</option>");
		}

		if(typeof userInfo.user.password_expire_advance_days_notify == "undefined")
			userInfo.user.password_expire_advance_days_notify = "10";
		if(typeof userInfo.user.account_expire_advance_days_notify == "undefined")
			userInfo.user.account_expire_advance_days_notify = "10";
		userManager.data.bindValuesFromJson(dataPanel, userInfo.user, false, panel);

		if($("#fileEncryptionKey", dataPanel).val() != "")
			$(".oldEncryption", dataPanel).show();
		else
			$(".oldEncryption", dataPanel).hide();

		var dataInheritedFrom = false;
		var curData = userManager.methods.seperateValueAndInheritValue(crushFTP.data.getValueFromJson(userInfo.user, "day_of_week_allow"));
		var value = curData.value;
		dataInheritedFrom = curData.inherit || dataInheritedFrom;
		var daysAllowed = value.split("");
		for(var i=0;i<daysAllowed.length;i++)
		{
			var dayCheck = $("#day" + daysAllowed[i], dataPanel);
			crushFTP.UI.checkUnchekInput(dayCheck, true);
		}
		if(!panel)
			userManager.data.setInheritPropertyOfSection($("#day1", dataPanel), "day_of_week_allow", true);
		userManager.methods.showInheritValueLabel($("#day1", dataPanel), dataInheritedFrom);

		dataInheritedFrom = false;
		curData = userManager.methods.seperateValueAndInheritValue(crushFTP.data.getValueFromJson(userInfo.user, "allowed_protocols"));
		value = curData.value;
		dataInheritedFrom = curData.inherit || dataInheritedFrom;
		var protocolsAllowed = value.split(",");
		for(var i=0;i<protocolsAllowed.length;i++)
		{
			var curProto = protocolsAllowed[i].split(":");
			if(curProto.length>0)
			{
				if(!curProto[1])
					curProto[1] = 0;

				if(curProto[0].length && curProto[0].length>0)
				{
					var protoCheck = $("#proto_" + curProto[0], dataPanel);
					crushFTP.UI.checkUnchekInput(protoCheck, true);
					$("#proto_" + curProto[0] + "_val", dataPanel).val(curProto[1]);
				}
			}
		}
		dataPanel.find("#maxConnectionsPerProtocolSettings").find("input.checkOptions").trigger("change");
		if(!panel)
			userManager.data.setInheritPropertyOfSection($("#proto_ftp", dataPanel), "allowed_protocols", true);
		userManager.methods.showInheritValueLabel($("#proto_ftp", dataPanel), dataInheritedFrom);

		//Binding IP Restrictions
		var IPRestrictions = $("#IPRestrictions", dataPanel).empty();
		if(userInfo.user.ip_restrictions)
		{
			crushFTP.methods.rebuildSubItems(userInfo.user.ip_restrictions, "ip_restrictions");
			userManager.UI.multiOptionControlDataBind(userInfo.user
				, "ip_restrictions"
				, $("#IPRestrictions", dataPanel)
				, function addNewButton(curItem){
						var type = curItem.type;
						var startip = curItem.start_ip;
						var stopip = curItem.stop_ip;
						var bannedIP = type + startip + "," + stopip;
						return $("<li class='ui-widget-content restriction_"+type+"' bannedIP='"+bannedIP+"'>"+bannedIP+"</li>");
					}
			, !panel);
		}
		if(!panel)
			userManager.data.setInheritPropertyOfSection(IPRestrictions, "ip_restrictions", true);

		//Binding Content Restriction
		var extensionBlockRules = $("#extensionBlockRules", dataPanel).empty();
		if(userInfo.user.content_restriction)
		{
			var items = userInfo.user.content_restriction.split("\n");
			for(var i=0;i<items.length;i++)
			{
				var curItem = items[i];
				var values = curItem.split(";");
				if(values.length>=3)
				{
					var type = values[0];
					var path = values[1];
					var extension = values[2];
					var name = "No name";
					if(type.toLowerCase().indexOf("byte_")==0)
						name = type.replace("byte_", "");
					else if(type.toLowerCase().indexOf("aeszip_")==0)
						name = type.replace("aeszip_", "");
					type = type.replace("_"+name, "");
					var obj = {
						extension:extension,
						type:type,
						path:path,
						name:name
					};
					var offsets = [];
					if(values.length>3)
					{
						try{
						var _offsets = values[3].split(",");
						for(var j=0;j<_offsets.length;j++)
						{
							var curVal = _offsets[j];
							if(typeof curVal != "undefined" && curVal!="")
								offsets.push(curVal);
						}}catch(ex){
						}
					}
					var newControl = $("<li class='ui-widget-content'>"+name + " -> " +type + " : " + extension + " : " + path +"</li>");
					newControl.data("controlData", obj);
					newControl.data("offsetData", offsets);
					extensionBlockRules.append(newControl);
				}
			}
		}
		if(panelRestrictions._panel.find("#account_expire_delete:checked").length>0)
		{
			panelRestrictions._panel.find("#expirationTask").removeClass('ui-state-disabled');
		}
		else
		{
			panelRestrictions._panel.find("#expirationTask").addClass('ui-state-disabled');
		}
		if(!panel)
			userManager.data.setInheritPropertyOfSection(extensionBlockRules, "content_restriction", true);

		userManager.UI.panelsPostbindEvent(dataPanel, panel);
		//$("#expire_password_days", panelRestrictions._panel).trigger("textchange");
	}
}

panelRestrictions.validateMaxConnectionValue = function(val)
{
	if(!crushFTP.methods.isNumeric(val))
	{
		return "Please enter numeric value for max connections allowed : ";
	}
	else
	{
		var count = parseInt(val);
		if(count>0  && count<8)
		{
			return "Please enter value either 0 or 8 and higher for max connections allowed : ";
		}
	}
	return false;
}

panelRestrictions.bindEvents = function()
{
	userManager.UI.togglePanels(panelRestrictions._panel);
	$(".checkboxArea>input[type='checkbox']", panelRestrictions._panel).change(function(){
		var curUserData = crushFTP.storage("currentUserInherited");
		if(!$(this).is(":checked"))
		{
			curUserData = {user: crushFTP.storage("currentUsersLowerLevelsData")};
			$(this).closest("fieldset").addClass("inheritSet");
		}
		else
			$(this).closest("fieldset").removeClass("inheritSet");
		if(!$(this).closest("fieldset").hasClass("notInheritable"))
			panelRestrictions.bindData(curUserData, false, $(this).closest("fieldset"));
	});

	var settingPanel = panelRestrictions._panel.find("#maxConnectionsPerProtocolSettings");
	settingPanel.find("input.countLimit").change(function(){
		var input = $(this);
		var msg = panelRestrictions.validateMaxConnectionValue(input.val());
		if(msg)
		{
			jPrompt(msg, "0", "Max connections allowed for " + input.parent().prev().prev().text(), function(value){
				if(value != null)
					input.val(value).change();
				else
					input.val(0);
				panelRestrictions._panel.trigger("changed", [settingPanel]);
			});
		}
	});

	panelRestrictions._panel.find("input.checkOptions").change(function(){
		if($(this).is("#proto_http") || $(this).is("#proto_https"))
		{
			if(!settingPanel.find("#proto_http").is(":checked") && !settingPanel.find("#proto_https").is(":checked"))
			{
				var chk = settingPanel.find("#proto_webdav").attr("disabled", "disabled").addClass("ui-state-disabled");
				crushFTP.UI.checkUnchekInput(chk);
			}
			else
			{
				settingPanel.find("#proto_webdav").removeAttr("disabled", "disabled").removeClass("ui-state-disabled");
			}
		}
		if($(this).is("#account_expire_delete"))
		{
			if($(this).is(":checked"))
			{
				panelRestrictions._panel.find("#expirationTask").removeClass('ui-state-disabled');
			}
			else
			{
				panelRestrictions._panel.find("#expirationTask").addClass('ui-state-disabled');
			}
			return false;
		}

		if(!$(this).is(":checked"))
		{
			$(this).closest("td").find("input[type='text']").val(0).attr("disabled", "disabled").addClass("ui-state-disabled disableValidation");
		}
		else
		{
			$(this).closest("td").find("input[type='text']").removeAttr("disabled", "disabled").removeClass("ui-state-disabled disableValidation");
		}
	});

	settingPanel.find(".defaultValCon").change(function(){
		if($(this).val() == "")
			$(this).val(0).trigger("blur");
	});

	$("#expire_password_days", panelRestrictions._panel).bind("textchange", function(){
		var val = $(this).val();
		var curVal = val || false;
		if(((curVal - 0) != curVal || curVal.length == 0))
		{
		}
		else
		{
			val = parseFloat(val);
		}

		$("#expire_password_when", panelRestrictions._panel).html("Wait...");
		crushFTP.data.getServerItem("server_info/current_datetime_ddmmyyhhmmss", function(server_info){
			var response_status = $(server_info).find("response_status").text();
			var myDate = new Date();
			if(response_status)
			{
				var mm = parseInt(response_status.substr(0, 2), 0);
				var dd = parseInt(response_status.substr(2, 2), 0);
				var yyyy = parseInt(response_status.substr(4, 4), 0);
				var hh = parseInt(response_status.substr(8, 2), 0);
				var mmm = parseInt(response_status.substr(10, 2), 0);
				var ss = parseInt(response_status.substr(12, 2), 0);
				myDate = new Date(yyyy, mm-1, dd, hh, mmm, ss);
			}
			myDate.setDate(myDate.getDate() + val);
			$("#expire_password_when", panelRestrictions._panel).html(myDate.format('mm/dd/yyyy hh:nn:ss a/p'));
			panelRestrictions._panel.trigger("changed");
		});
	});

	$("#btnExpireNow", panelRestrictions._panel).click(function(){
		$("#expire_password_when", panelRestrictions._panel).html("Wait...");
		crushFTP.data.getServerItem("server_info/current_datetime_ddmmyyhhmmss", function(server_info){
			var response_status = $(server_info).find("response_status").text();
			var myDate = new Date();
			if(response_status)
			{
				var mm = parseInt(response_status.substr(0, 2), 0);
				var dd = parseInt(response_status.substr(2, 2), 0);
				var yyyy = parseInt(response_status.substr(4, 4), 0);
				var hh = parseInt(response_status.substr(8, 2), 0);
				var mmm = parseInt(response_status.substr(10, 2), 0);
				var ss = parseInt(response_status.substr(12, 2), 0);
				myDate = new Date(yyyy, mm-1, dd, hh, mmm, ss);
			}
			myDate.setDate(myDate.getDate());
			$("#expire_password_when", panelRestrictions._panel).html(myDate.format('mm/dd/yyyy hh:nn:ss a/p'));
			panelRestrictions._panel.trigger("changed");
		});
		return false;
	});

	$("#quickSetExpirationTime", panelRestrictions._panel).click(function(evt, cb){
		var input = $("#account_expire", panelRestrictions._panel);
		var selDate = input.datepicker("getDate");
		var myDate = new Date();
		var defaultDays = 1.5;
		if(selDate)
		{
			var t2 = selDate.getTime();
			var t1 = myDate.getTime();
			defaultDays = parseInt((t2-t1)/(24*3600*1000)) + 1;
		}
		jPrompt("Enter the number of days from now until this account expires : ", defaultDays, "Input", function(value){
			var days = parseInt(value);
			if(days != null && days != NaN)
			{
				if (days == NaN) days = 0;
				days = Math.abs(days);
				if (days > 0) {
					myDate.setDate(myDate.getDate() + days);
					input.datepicker( "setDate" , myDate );
				}
				panelRestrictions._panel.trigger("changed", [input]);
				if(cb)cb();
			}
		});
		return false;
	});

	var IPRestrictions = $("#IPRestrictions", panelRestrictions._panel);
	IPRestrictions.bind("dblclick", function(evt){
        if(evt.target && $(evt.target).is("li")){
            $("a#editIPRestriction", panelRestrictions._panel).trigger('click');
            return false;
        }
    });

	$("a#addIPRestriction", panelRestrictions._panel).click(function(evt, controlData, control) {
        var beforeAfter = "",
            chooseOptId = "",
            startingipID = "",
            stoppingipId = "",
            reasonId = "";

        if (controlData) {
            chooseOptId = controlData.type;
            startingipID = controlData.start_ip;
            stoppingipId = controlData.stop_ip;
        }
        $("#WIbannedIPDialogBan").find("#bannedIPlist").unbind("change").bind("change", function() {});
        $("#WIbannedIPDialogBan").dialog({
            resizable: false,
            modal: true,
            width: 450,
            create: function() {
                $(this).css("maxHeight", 500);
            },
            open: function() {
                $("#WIbannedIPDialogBan #selectionId").val(beforeAfter);
                $("#WIbannedIPDialogBan #chooseoptId").val(chooseOptId);
                $("#WIbannedIPDialogBan #startingIP").val(startingipID);
                $("#WIbannedIPDialogBan #stoppingIp").val(stoppingipId);

                if (controlData) {
                    $("#WIbannedIPDialogBan").find('#before_after_Id').hide();
                } else {
                    $("#WIbannedIPDialogBan").find('#before_after_Id').show();
                }
            },
            buttons: {
                OK: function() {

                    beforeAfter = $.trim($("#WIbannedIPDialogBan").find("#selectionId").val());
                    chooseOptId = $.trim($("#WIbannedIPDialogBan").find("#chooseoptId").val());
                    startingipID = $.trim($("#WIbannedIPDialogBan").find("#startingIP").val());
                    stoppingipId = $.trim($("#WIbannedIPDialogBan").find("#stoppingIp").val());

                    // Validation
                    if (!startingipID) {
                        alert("Please enter starting IP")
                        $("#WIbannedIPDialogBan").find("#startingIP").focus();
                        return false;
                    }
                    if (!crushFTP.methods.isValidIP(startingipID)) {
                        alert("Invalid starting IP - Address!!")
                        $("#WIbannedIPDialogBan").find("#startingIP").focus();
                        return false;
                    }
                    if (!stoppingipId) {
                        alert("Please enter stopping IP")
                        $("#WIbannedIPDialogBan").find("#stoppingIp").focus();
                        return false;
                    }
                    if (!crushFTP.methods.isValidIP(stoppingipId)) {
                        alert("Invalid stopping IP - Address!!")
                        $("#WIbannedIPDialogBan").find("#startingIP").focus();
                        return false;
                    }
                    if (!crushFTP.methods.isMatchingIPRange(startingipID, stoppingipId)) {
                        var that = $(this);
                        jConfirm("IP range mismatches, maybe its a typo. Ignore if it's intended.", "Warning", function(val){
                            if(val){
                                buildControl();
                                that.dialog("close");
                            }
                        }, {
                            okButtonText: "Ignore",
                            cancelButtonText: "Cancel"
                        });
                        return false;
                    }
                    function buildControl() {
						var bannedIP = chooseOptId + startingipID + "," + stoppingipId;
						var newControl = $("<li class='ui-widget-content restriction_"+chooseOptId+"' bannedIP='"+bannedIP+"'>"+bannedIP+"</li>");
						newControl.data("controlData", {
							start_ip:startingipID,
							type:chooseOptId,
							stop_ip:stoppingipId
						});

						if(control){
							control.replaceWith(newControl);
							newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
							newControl.addClass("ui-widget-header").addClass("ui-selected");
							panelRestrictions._panel.trigger("changed", [IPRestrictions]);
							return;
						}

						if(beforeAfter == "After")
						{
							IPRestrictions.append(newControl);
						}
						else
						{
							IPRestrictions.prepend(newControl);
						}

						if(newControl)
						{
							newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
							newControl.addClass("ui-widget-header").addClass("ui-selected");
						}
						panelRestrictions._panel.trigger("changed", [IPRestrictions]);
                    }
                    buildControl();
                    $(this).dialog("close");
                },
                Cancel: function() {
                    $(this).dialog("close");
                }
            }
        });
        return false;
    });

	$("a#removeIPRestriction", panelRestrictions._panel).click(function(){
		crushFTP.UI.removeItem(IPRestrictions, function(){
			panelRestrictions._panel.trigger("changed", [IPRestrictions]);
		});
		return false;
	});

	$("a#editIPRestriction", panelRestrictions._panel).click(function(evt, control){
		var selected = IPRestrictions.find("li.ui-widget-header");
		if(selected && selected.length > 0)
		{
			var controlData = selected.data("controlData");
			if(!controlData)return;
			$("#addIPRestriction", panelRestrictions._panel).trigger("click", [controlData, selected]);
			return false;
		}
	});

	$("a.serverFilePickButton", panelRestrictions._panel).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'dir',
				file_mode : curElem.attr("FileMode") || 'user',
				existingVal : $("#" + curElem.attr("rel"), panelRestrictions._panel).val(),
				callback : function(selectedPath){
					var elem = $("#" + curElem.attr("rel"), panelRestrictions._panel);
					if(curElem.attr("rel") == "ssh_public_keys" && elem.val().length>0)
					{
						elem.val($.trim(elem.val() + "\n"+ selectedPath)).trigger("change");
					}
					else
					{
						elem.val(selectedPath).trigger("change");
					}
					panelRestrictions._panel.trigger("changed", [elem]);
				}
			});
			return false;
		});
	});

	$("a#generateFileKey", panelRestrictions._panel).click(function(){
		userManager.methods.performServerAction($("a#generateFileKey", panelRestrictions._panel),
			{
				command : "generateFileKey",
				keyPath : $("#fileEncryptionKey", panelRestrictions._panel).val()
			}
		, "Generate encryption key :");
		return false;
	});

	$("#removeOldEncryptionMethod", panelRestrictions._panel).unbind().click(function(){
		$("#fileEncryptionKey", panelRestrictions._panel).val("").trigger("change");
		if($("#fileEncryptionKey", panelRestrictions._panel).val()!="")
		{
			$(".oldEncryption", panelRestrictions._panel).show();
		}
		else
		{
			$(".oldEncryption", panelRestrictions._panel).hide();
		}
		return false;
	});

	$("#restrictions_pgpEncryptionGenerateButton").unbind().click(function () {
		if ($("#restrictions_pgpPivateKeyPathGenerate").val().indexOf(".key") < 0)
		{
			$("#restrictions_pgpPivateKeyPathGenerate").val($("#restrictions_pgpPivateKeyPathGenerate").val()+"private.key");
		}
		var obj = {
			command: "pgpGenerateKeyPair",
			pgpCommonNameGenerate: crushFTP.methods.htmlEncode($("#restrictions_pgpCommonNameGenerate").val()),
			pgpKeySizeGenerate: $("#restrictions_pgpKeySizeGenerate").val(),
			pgpKeyDaysGenerate: $("#restrictions_pgpKeyDaysGenerate").val(),
			pgpPrivateKeyPasswordGenerate: crushFTP.methods.htmlEncode($("#restrictions_pgpPrivateKeyPasswordGenerate").val()),
			pgpPivateKeyPathGenerate: crushFTP.methods.htmlEncode($("#restrictions_pgpPivateKeyPathGenerate").val()),
			random: Math.random()
		};
		obj.c2f = crushFTP.getCrushAuth();
		$.ajax({
			type: "POST",
			url: userManager.ajaxCallURL,
			data: obj,
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				errorThrown = errorThrown || "pgpGenerateKeyPair failed";
				crushFTP.UI.growl("Error : ", errorThrown, true, true);
			},
			success: function (msg) {
				var responseText = msg;
				try {
					var response = msg.getElementsByTagName("response");
					response = crushFTP.data.getTextContent(response[0]).textContent;
					alert(response);
				} catch (ex) {}
			}
		});
		return false;
	});

	var extensionBlockRules = $("#extensionBlockRules", panelRestrictions._panel);
	extensionBlockRules.bind("dblclick", function(evt){
        if(evt.target && $(evt.target).is("li")){
            $("a#editBlockRule", panelRestrictions._panel).trigger('click');
            return false;
        }
    });
	$("a#addBlockRule", panelRestrictions._panel).click(function(evt){
		var type =  "";
		jPrompt("Validation type : ", type, "Input", function(value){
			type = value;
			if(type != null)
			{
				var name = "";
				function nameEntry()
				{
					jPrompt("Choose a name for this entry :", name, "Input", function(value){
						name = value;
						if(name)
						{
							var extension = "";
							if(type == "aeszip")
								extension = "*.zip";
							function extensionEntry()
							{
								jPrompt("File Extension :", extension, "Input", function(value){
									extension = value;
									if(extension)
									{
										if(extension.indexOf(".")>=0)
										{
											if(extension.indexOf(".")==0)
											{
												extension = "*" + extension;
											}
										}
										else
										{
											extension = "*." + extension;
										}
										var path = "/";
										function pathEntry()
										{
											jPrompt("Enter Path :", path, "Input", function(value){
												path = value;
												if(path == null)
													return;
												if(path.indexOf("/") != path.length - 1 || path.length == 0)
												{
													if(path.indexOf("/")!=0)
														path = "/" + path;
												}
												if(path.lastIndexOf("/") != path.length - 1)
												{
													path = path + "/";
												}
												if(path.indexOf("/")!=0)
												{
													path = "/" + path;
												}
												var newControl = $("<li class='ui-widget-content'>" + name + " -> " +type + " : " + extension + " : " + path +"</li>");
												newControl.data("controlData", {
													extension:extension,
													type:type,
													path:path,
													name:name
												});
												if(newControl)
												{
													extensionBlockRules.find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
													newControl.addClass("ui-widget-header").addClass("ui-selected");
													panelRestrictions.ruleItemSelected(false, newControl);
												}
												extensionBlockRules.append(newControl);
												panelRestrictions._panel.trigger("changed", [extensionBlockRules]);
											});
										}
										pathEntry();
									}
									else if(extension != null)
									{
										extensionEntry();
									}
								});
							}
							extensionEntry();
						}
						else if(name != null)
						{
							nameEntry();
						}
					});
				}
				nameEntry();
			}
		}, ["byte|Byte Validation", "aeszip|AES Zip Validation"]);
		return false;
	});

	$("a#removeBlockRule", panelRestrictions._panel).click(function(){
		crushFTP.UI.removeItem(extensionBlockRules, function(){
			panelRestrictions.ruleItemSelected(false, extensionBlockRules.find(".ui-widget-header"));
			panelRestrictions._panel.trigger("changed", [extensionBlockRules]);
		});
		return false;
	});

	$("a#editBlockRule", panelRestrictions._panel).click(function(evt, control){
		var selected = extensionBlockRules.find("li.ui-widget-header");
		if(selected && selected.length > 0)
		{
			var controlData = selected.data("controlData");
			if(!controlData)return;
			var type = controlData.type;
			function typeEntry()
			{
				jPrompt("Validation type : ", type, "Input", function(value){
					type = value;
					if(type)
					{
						var name = controlData.name;
						function nameEntry()
						{
							jPrompt("Choose a name for this entry :", name, "Input", function(value){
								name = value;
								if(name)
								{
									var extension = controlData.extension;
									function extensionEntry()
									{
										jPrompt("File Extension :", extension, "Input", function(value){
											if(extension.indexOf(".")>=0)
											{
												if(extension.indexOf(".")==0)
												{
													extension = "*" + extension;
												}
											}
											else
											{
												extension = "*." + extension;
											}
											var path = controlData.path;
											function pathEntry()
											{
												jPrompt("Enter Path :", path, "Input", function(value){
													path = value;
													if(path != null)
													{
														if(path.indexOf("/") != path.length - 1 || path.length == 0)
														{
															if(path.indexOf("/")!=0)
																path = "/" + path;
														}
														if(path.lastIndexOf("/") != path.length - 1)
														{
															path = path + "/";
														}
														if(path.indexOf("/")!=0)
														{
															path = "/" + path;
														}
														var newControl = $("<li class='ui-widget-content'>" + name + " -> " +type + " : " + extension + " : " + path +"</li>");
														selected.replaceWith(newControl);
														newControl.data("controlData", {
															extension:extension,
															type:type,
															path:path,
															name:name
														});
														if(newControl)
														{
															extensionBlockRules.find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
															newControl.addClass("ui-widget-header").addClass("ui-selected");
															panelRestrictions.ruleItemSelected(false, newControl);
															panelRestrictions._panel.trigger("changed", [extensionBlockRules]);
														}
													}
													else
														pathEntry();
												});
											}
											pathEntry();
										});
									}
									extensionEntry();
								}
								else if(name != null)
								{
									nameEntry();
								}
							});
						}
						nameEntry();
					}
					else if(type != null)
					{
						nameEntry();
					}
				}, ["byte|Byte Validation", "aeszip|AES Zip Validation"]);
			}
			typeEntry();
		}
		return false;
	});

	extensionBlockRules.unbind("onSelect").bind("onSelect"
		, function(evt, list, selected){
			panelRestrictions.ruleItemSelected(list, selected);
	});

	var offsetList = $("#offsetItems", panelRestrictions._panel);
	$("a#addOffset", panelRestrictions._panel).click(function(evt){
		var selected = extensionBlockRules.find("li.ui-widget-header");
		if(selected.length==0)return;
		var offsetData = selected.data("offsetData") || [];
		var offset =  "";
		var appendHTML = "<div style='margin:5px 0px;'><label for='offsetByteValue' style='width: 77px;display: inline-block;text-align: right;padding-right: 4px;'>Byte Value : </label><input style='margin:5px 0px;width:100px;' id='offsetByteValue' class='extraItem' type='text' value='' /></div>";
		jPrompt("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Offset : ", offset, "Input", function(value, key, byteValue){
			offset = value;
			if(offset != null && byteValue != null)
			{
				if(!crushFTP.methods.isNumeric(offset) || !crushFTP.methods.isNumeric(byteValue))
				{
					jAlert("Please enter numeric value", "Error", function(){
						$("a#addOffset", panelRestrictions._panel).click();
					});
				}
				else
				{
					var newControl = $("<li class='ui-widget-content'>"+ offset + "=" + byteValue + "</li>");
					newControl.data("controlData", offset+"="+byteValue);
					offsetData.push(offset+"="+byteValue);
					offsetList.append(newControl);
					selected.data("offsetData", offsetData);
					panelRestrictions._panel.trigger("changed", [offsetList]);
				}
			}
		}, false, false, {appendAfterInput : appendHTML, textBoxWidth : 100});
		return false;
	});

	$("a#removeOffset", panelRestrictions._panel).click(function(){
		var selected = extensionBlockRules.find("li.ui-widget-header");
		if(selected.length==0)return;
		var offsetData = selected.data("offsetData") || [];
		var offSelected = offsetList.find("li.ui-widget-header");
		var removed;
		if(offSelected.length>0)
		{
			removed = offSelected.data("controlData");
		}
		crushFTP.UI.removeItem(offsetList, function(){
			if(removed)
			{
				if(offsetData.has(removed))
					offsetData.removeByVal(removed);
				selected.data("offsetData", offsetData);
			}
			panelRestrictions._panel.trigger("changed", [offsetList]);
		});
		return false;
	});

	$("a.testPGPButton", panelRestrictions._panel).each(function () {
		$(this).testPGPButton();
	});
};

panelRestrictions.ruleItemSelected = function(list, selected)
{
	var list = $("#offsetItems", panelRestrictions._panel).empty();
	if(selected.length>0)
	{
		var controlData = selected.data("controlData");
		if(controlData.type == "aeszip")
		{
			$(".offsetEntries", panelRestrictions._panel).hide();
			return;
		}
		$(".offsetEntries", panelRestrictions._panel).show();
		var offsetEntries = selected.data("offsetData");
		if(offsetEntries)
		{
			for(var i=0;i<offsetEntries.length;i++)
			{
				var newControl = $("<li class='ui-widget-content'>"+ offsetEntries[i] +"</li>");
				newControl.data("controlData", offsetEntries[i]);
				list.append(newControl);
			}
		}
	}
	else
	{
		$(".offsetEntries", panelRestrictions._panel).hide();
	}
}

panelRestrictions.generateSpecialItemsXML = function(name, type)
{
	type = type || "add";
	var xml = "";
	if(name == "IPRestrictions")
	{
		if(type == "add")
		{
			if(panelRestrictions._panel.find("#ipRestrictionsCheck").find("input:checked").length>0)
			{
				xml += "\r\n<ip_restrictions type=\"vector\">";
				$("#IPRestrictions", panelRestrictions._panel).find("li").each(function(){
					var curItem = $(this).data("controlData");
					var type = curItem.type;
					var startip = curItem.start_ip;
					var stopip = curItem.stop_ip;
					xml += "\r\n<ip_restrictions_subitem type=\"properties\">";
					xml += "\r\n<stop_ip>"+stopip+"</stop_ip>";
					xml += "\r\n<start_ip>"+startip+"</start_ip>";
					xml += "\r\n<type>"+type+"</type>";
					xml += "\r\n</ip_restrictions_subitem>";
				});
				xml += "\r\n</ip_restrictions>";
			}
		}
		else
			xml = "ip_restrictions";
	}
	else if(name == "AllowedDays")
	{
		if(type == "add")
		{
			if(panelRestrictions._panel.find("#allowedConnectionDaysCheck").find("input:checked").length>0)
			{
				xml += "\r\n<day_of_week_allow>";
				panelRestrictions._panel.find("#dayOfWeekAllowedToConnect").find("input:checked").each(function(){
					xml += $(this).attr("id").replace("day","");
				});
				xml += "</day_of_week_allow>";
			}
		}
		else
			xml = "day_of_week_allow";
	}
	else if(name == "ConnectionsPerProtocol")
	{
		if(type == "add")
		{
			if(panelRestrictions._panel.find("#connectionsPerProtocolCheck").find("input:checked").length>0)
			{
				xml += "\r\n<allowed_protocols>";
				var settingPanel = panelRestrictions._panel.find("#maxConnectionsPerProtocolSettings");
				var proto_http = $("#proto_http", settingPanel).is(":checked");
				settingPanel.find("input:checked").each(function(){
					var proto = $(this).attr("id").replace("proto_","").toLowerCase();
					if(proto == "webdav")
					{
						var val = settingPanel.find("#proto_http_val").val();
						if(settingPanel.find("#proto_http_val").is(":disabled"))
							val = settingPanel.find("#proto_https_val").val();
						if($.trim(val) == "") val = 0;
						xml += $(this).attr("id").replace("proto_","") + ":" + val + ",";
					}
					else
					{
						var val = $(this).closest("td").find("input[type='text']").val();
						if($.trim(val) == "") val = 0;
						xml += $(this).attr("id").replace("proto_","") + ":" + val + ",";
					}
				});
				xml += "</allowed_protocols>";
			}
		}
		else
			xml = "allowed_protocols";
	}
	else if(name == "extensionBlockRules")
	{
		if(type == "add")
		{
			var items = panelRestrictions._panel.find("#extensionBlockRules").find("li");
			if(items.length>0)
			{
				var xmlItems = [];
				items.each(function(){
					var controlData = $(this).data("controlData");
					var offsetData = $(this).data("offsetData") || [];
					if(controlData)
					{
						var _type=controlData.type;
						var extension=controlData.extension;
						var path=controlData.path;
						var _name = controlData.name;
						var valToSave = _type + "_" + _name + ";" + path + ";" + extension + ";";
						if(_type == "byte")
						{
							for(var i=0;i<offsetData.length;i++)
							{
								if(typeof offsetData[i] != "undefined")
								{
									if(i!=offsetData.length-1)
										valToSave += offsetData[i] + ",";
									else
										valToSave += offsetData[i];
								}
							}
							if(offsetData.length>0)
								xmlItems.push(valToSave + ";");
							else
								xmlItems.push(valToSave);
						}
						else
						{
							xmlItems.push(valToSave);
						}
					}
				});
				xml = "<content_restriction>" + xmlItems.join("\n") + "</content_restriction>";
			}
		}
		else
			xml = "content_restriction";
	}
	return xml;
}

panelRestrictions.generateXML = function()
{
	var xml = "";

	//General items
	panelRestrictions._panel.find("td.checkboxArea").not(".specialProperty").find("input:checked").each(function(){
		var formPanel = $(this).closest("td").next();
		xml += "\r\n" + userManager.data.buildXMLToSubmitForm(formPanel);
	});

	xml += panelRestrictions.generateSpecialItemsXML("IPRestrictions");
	xml += panelRestrictions.generateSpecialItemsXML("AllowedDays");
	xml += panelRestrictions.generateSpecialItemsXML("ConnectionsPerProtocol");
	xml += panelRestrictions.generateSpecialItemsXML("extensionBlockRules");
	return xml;
}