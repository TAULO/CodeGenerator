// JJTEACH.js
var timeout = 500;
var closetimer = 100;
var ddmenuitem = 0;
var globalRowId = 0;

var JJTEACH = {
	extension : '.htm',
	loader : function(div) {
		$j(div)
				.html(
						'<center><img style="position:absolute; bottom:50%;" src = "'
								+ prefix
								+ '/images/preloader/black-0018-loading.gif"></center>');
	},
	ajaxLoad : function(url) {
		JJTEACH.loader('#contents');
		$j('#contents').load(prefix + url + JJTEACH.extension);
		$j("#prevbutton,#nextbutton,#topprevbutton,#topnextbutton").css(
				'display', 'none');
	},
	ajaxLoadFullPage : function(url) {
		JJTEACH.loader('#content');
		$j('#content').load(prefix + url + JJTEACH.extension);
	},
	ajaxLoadPage : function(response) {
		try {
			response.substr(0, 1);
			$j('#container').html(response);
		} catch (e) {
			$j('#evaluationTest_errors').html(response.message);
		}
	},
	ajaxSearch : function(url, firstname, lastname, userRole) {
		JJTEACH.loader('#contents');
		var firstName = "";
		firstName = firstname;
		var lastName = "";
		lastName = lastname;
		var role = "";
		role = userRole;

		if (firstName == "" && lastName == "" && role == "NONE") {
			$j('#contents')
					.load(prefix + "/user/listusers" + JJTEACH.extension);
		} else {
			$j('#contents').load(
					prefix + url + JJTEACH.extension + "?firstName="
							+ firstName + "&lastName=" + lastName + "&role="
							+ role);
		}
	},
	changeStatusTopic : function(topicId, moduleId, value) {
		JJTEACH.loader('#topics');
		var startIndex = value;
		var start = Number(value);
		if (isNaN(start)) {
			startIndex = 1;
		}
		$j('#topics').load(
				prefix + "/topic/changestatustopic" + JJTEACH.extension
						+ "?topicId=" + topicId + "&moduleId=" + moduleId
						+ "&startIndex=" + startIndex);
	},
	populateTable : function(id, name) {
		var tab = $j('#moduletab').tabs();
		JJTEACH.loader('#topics');
		$j('#topicTabLabel').attr('style', 'display:inline');
		$j('#topics').load(
				prefix + "/topic/topiclist" + JJTEACH.extension + "?moduleId="
						+ id);
		$j('#topicTabLabel').html(name);
		tab.tabs('select', (tab.tabs("length") - 1));
	},
	ajaxListUsers : function(startIndex, role) {
		JJTEACH.loader('#usersList');
		var div = ' #usersList';
		$j('#usersList').load(
				prefix + "/user/listusers" + JJTEACH.extension + "?startIndex="
						+ startIndex + "&role=" + role + div);
	},
	ajaxList : function(role) {

		JJTEACH.loader('#usersList');
		var div = ' #usersList';
		$j('#usersList').load(
				prefix + "/user/listusers" + JJTEACH.extension + "?role="
						+ role + div);
	},
	ajaxListModules : function(startIndex) {
		JJTEACH.loader('#contents');
		$j('#contents').load(
				prefix + "/module/listmodules" + JJTEACH.extension
						+ "?startIndex=" + startIndex);
	},
	ajaxListTopics : function(startIndex, moduleId) {
		JJTEACH.loader('#topics');
		var searchString = $j('#tpc_srch_txt').val();
		$j('#topics').load(
				prefix + "/topic/topiclist" + JJTEACH.extension
						+ "?startIndex=" + startIndex + "&moduleId=" + moduleId
						+ "&searchString='" + searchString + "'");
	},
	ajaxTopicList : function(startIndex, moduleId) {
		JJTEACH.loader('#srch_rslts');
		var searchString = $j('#tpc_srch_txt').val();
		$j('#srch_rslts').load(
				prefix + "/topic/listtopic" + JJTEACH.extension
						+ "?startIndex=" + startIndex + "&moduleId=" + moduleId
						+ "&searchString=" + escape(searchString));
	},

	ajaxListTransactions : function(startIndex, moduleId, mentorId) {
		JJTEACH.loader('#contents');
		$j('#contents').load(
				prefix + "/mentor/listtransactions" + JJTEACH.extension
						+ "?mentorId=" + mentorId + "&moduleId=" + moduleId
						+ "&startIndex=" + startIndex);
	},
	ajaxProfileLoad : function() {
		JJTEACH.loader('#contents');
		var url = prefix + "user/profile" + JJTEACH.extension;
		new Ajax.Request(url, {
			method : 'get',
			onSuccess : function(transport) {
				$j('#contents').html(transport);
			}
		});
	},
	ajaxEdit : function(url, param) {
		JJTEACH.loader('#contents');
		$j('#contents').load(
				prefix + url + JJTEACH.extension + "?roleId=" + param);
	},
	ajaxLocationEdit : function(url, param) {
		JJTEACH.loader('#contents');
		$j('#contents').load(
				prefix + url + JJTEACH.extension + "?locationId=" + param);
	},
	ajaxLocationDelete : function(url, param) {
		JJTEACH.loader('#contents');
		$j('#contents').load(
				prefix + url + JJTEACH.extension + "?locationId=" + param);
	},

	ajaxAdminPasswordEdit : function(url, param) {
		JJTEACH.loader('#contents');
		$j('#contents').load(
				prefix + url + JJTEACH.extension + "?company_id=" + param);
	},

	ajaxGroupEdit : function(url, param) {
		JJTEACH.loader('#contents');
		$j('#contents').load(
				prefix + url + JJTEACH.extension + "?groupId=" + param);
	},
	ajaxGroupDelete : function(url, param) {
		var del = "Do you really want to delete this Group";
		if (confirm(del)) {

			new Ajax.Request(
					prefix + url + JJTEACH.extension,
					{
						method : 'get',
						parameters : {
							'groupId' : '' + param + ''
						},
						onSuccess : function(response) {
							var res = response.responseText.evalJSON();
							if (res.empty == "false") {
								jAlert(
										"Sorry! You can't Delete This Group\nIt contains some Users",
										"Delete Blocked!");
								JJTEACH.ajaxLoad('/group/listgroups');

							} else if (res.empty == "true") {
								jAlert("Group Deleted Successifully",
										"Deleting!");
								JJTEACH.ajaxLoad('/group/listgroups');
							} else {
								jAlert("Unknown Operation", "Error!");
								JJTEACH.ajaxLoad('/group/listgroups');
							}

						}
					});
		} else {
			return false;
		}

	},
	ajaxGroupAddUsers : function(url, param) {
		JJTEACH.loader('#contents');
		$j('#contents').load(
				prefix + url + JJTEACH.extension + "?groupId=" + param);
	},
	ajaxADDUserToAGroup : function(urlpath, param, group) {

		$j.ajax({
			url : prefix + urlpath + JJTEACH.extension + "?userId=" + param
					+ "&groupId=" + group,
			type : "POST",
			success : function(response) {
				// var res = response.responseText.evalJSON();
				if (response.isSaved == "true") {
					jAlert("Selected Users Successfully Added to Group",
							"Adding Users To Group");
					JJTEACH.ajaxLoad('/group/listgroups');

				} else {
					jAlert("Error on Saving", "Error");
					JJTEACH.ajaxLoad('/group/listgroups');
				}

			}
		});

	}
	/*
	 * { new Ajax.Request(prefix + urlpath + JJTEACH.extension, { method :
	 * 'get', parameters : { 'userId' : '' + param + '', 'groupId' : '' + group + '' },
	 * onSuccess : function(response) { var res =
	 * response.responseText.evalJSON(); if (res.isSaved == "true") {
	 * jAlert("Selected Users Successifully Added to Group","Adding Users To
	 * Group"); JJTEACH.ajaxLoad('/group/listgroups');
	 * 
	 * }else{ jAlert("Error on Saving","Error");
	 * JJTEACH.ajaxLoad('/group/listgroups'); } } }); }
	 */
	,
	ajaxUserEdit : function(url, param) {
		JJTEACH.loader('#contents');
		$j('#contents').load(
				prefix + url + JJTEACH.extension + "?userId=" + param);
	},
	ajaxTopicAdd : function(param) {
		var parent = 'topics';// document.getElementById('newtopic').parentNode.id;
		JJTEACH.loader('#' + parent);
		$j('#' + parent).load(
				prefix + "/topic/addtopic" + JJTEACH.extension + "?moduleId="
						+ param);

	},
	ajaxTopicEdit : function(param, module) {
		var parent = 'topics';// document.getElementById('newtopic').parentNode.id;
		JJTEACH.loader('#' + parent);
		$j('#' + parent).load(
				prefix + "/topic/edittopic" + JJTEACH.extension + "?topicId="
						+ param + "&moduleId=" + module);
	},
	ajaxChangePassword : function(url) {
		JJTEACH.loader('#popupForgot');
		$j('#popupForgot').load(prefix + url + JJTEACH.extension);
		$j(function() {
			$j('#popupForgot').dialog({
				resizable : false,
				width : 360,
				zIndex : 5000,
				title : 'FORGOT PASSWORD?',
				show : 'slide',
				draggable : false,
				height : 160,
				modal : true,
				autoOpen : true,
				overlay : {
					opacity : 0.6,
					background : "black"
				}
			});
		});
	},
	ajaxEnableUser : function(url, param) {
		new Ajax.Request(prefix + url + JJTEACH.extension, {
			method : 'get',
			parameters : {
				'userId' : '' + param + ''
			}
		});
	},
	ajaxDisableUser : function(url, param) {
		new Ajax.Request(prefix + url + JJTEACH.extension, {
			method : 'get',
			parameters : {
				'userId' : '' + param + ''
			}

		});
	},
	ajaxChangeStatusUser : function(url, param) {
		new Ajax.Request(
				prefix + url + JJTEACH.extension,
				{
					method : 'get',
					parameters : {
						'userId' : '' + param + ''
					},
					onSuccess : function(response) {
						var res = response.responseText.evalJSON();
						if (res.isMax == "true") {
							jAlert(
									"Sorry! You Have Attained Maximum Number of \nEnabled Users Allowed by Your License Plan\nPlease Disable Another User First and Enable This User",
									"License Deal!");
							JJTEACH.ajaxLoad('/user/listusers');

						} else {
							JJTEACH.ajaxLoad('/user/listusers');
						}

					}
				});
	},
	ajaxChangeCloudUserStatus : function(url, param) {
		new Ajax.Request(prefix + url + JJTEACH.extension, {
			method : 'get',
			parameters : {
				'userId' : '' + param + ''
			}

		});
	},
	ajaxEditModule : function(url, param) {
		JJTEACH.loader('#module');

		$j('#module').load(
				prefix + url + JJTEACH.extension + "?moduleId=" + param);

	},
	ajaxEditCompanySetting : function(url, param) {
		JJTEACH.loader('#contents');

		$j('#contents').load(
				prefix + url + JJTEACH.extension + "?companyId=" + param);

	},
	ajaxViewModuleTopics : function(param) {

		var tabs = $j('#moduletab').tabs();
		var selected = tabs.tabs('option', 'selected');
		selected.load(prefix + "/topic/topiclist" + JJTEACH.extension
				+ "?moduleId=" + param);
	},
	ajaxViewModuleExercises : function(url, userId, moduleId, moduleName) {
		var tab = $j('#usertab').tabs(
				"add",
				prefix + url + JJTEACH.extension + "?userId=" + userId
						+ "&moduleId=" + moduleId, moduleName);
		tab.tabs('select', (tab.tabs("length") - 1));
	},
	ajaxEditMentorTemplate : function(url, param) {
		JJTEACH.loader('#contents');
		$j('#contents')
				.load(
						prefix + url + JJTEACH.extension + "?mentorTemplateId="
								+ param);
	},
	ajaxEditCourseTemplate : function(url, param) {
		JJTEACH.loader('#contents');
		$j('#contents')
				.load(
						prefix + url + JJTEACH.extension + "?courseTemplateId="
								+ param);
	},
	ajaxEditCT : function(url, param) {
		$j('#templates')
				.load(
						prefix + url + JJTEACH.extension + "?courseTemplateId="
								+ param);
		// $j('#templatemodules').load(
		// prefix + "/coursetemplate/ctlistboxes" + JJTEACH.extension
		// + "?courseTemplateId=" + param);
		JJTEACH.populateTable(param);
		$j('#courseTemplates').tabs("select", 1);
	},
	ajaxEditET : function(url, param) {
		var parent = document.getElementById("evaluationTemplate").parentNode.id;

		$j('#' + parent).load(
				prefix + url + JJTEACH.extension + "?evaluationTemplateId="
						+ param);
		/*
		 * $j('#questions').load( prefix + "/question/listquestions" +
		 * JJTEACH.extension + "?evaluationId=" + param);
		 * 
		 * $j('#courseTemplates').tabs("select", 1);
		 */
	},
	ajaxAddEvaluation : function(div, param) {
		var parent = document.getElementById(div).parentNode.id;

		$j('#' + parent).load(
				prefix + "/evaluation/addevaluationtemplate"
						+ JJTEACH.extension + "?moduleId=" + param);

	},
	ajaxViewEvaluationQuestions : function(div, param) {
		var parent = document.getElementById(div).parentNode.id;
		JJTEACH.loader('#' + parent);
		$j('#' + parent).load(
				prefix + "/question/listquestions" + JJTEACH.extension
						+ "?evaluationId=" + param);

	},
	ajaxPaginateEvaluationQuestions : function(startIndex, evaluationId) {
		JJTEACH.loader('#srch_rslts');
		var searchString = $j('#qtn_srch_txt').val();
		$j('#srch_rslts').load(
				prefix + "/question/pgnteval" + JJTEACH.extension
						+ "?evaluationId=" + evaluationId + "&startIndex="
						+ startIndex + "&searchString=" + escape(searchString));

	},
	ajaxViewEvaluationQuestionsByTopic : function(topicId, topicName, moduleId,
			startIndex) {

		var tab = $j('#moduletab').tabs();

		var url = prefix + "/question/listquestions/bytopic"
				+ JJTEACH.extension;
		var data = {
			"topicId" : topicId,
			"topicName" : topicName,
			"moduleId" : moduleId,
			"moduleName" : $j('#topicTabLabel').html()
		};

		if (startIndex) {
			data["startIndex"] = startIndex;
		}

		$j('#topicTabLabel').attr('style', 'display:inline');
		$j('#topics').load(url, data);

		$j('#topicTabLabel').html('Topic Questions');
		tab.tabs('select', (tab.tabs("length") - 1));

	},
	ajaxPaginateEvaluationQuestionsByTopic : function(topicId, topicName,
			moduleId, startIndex) {

		var tab = $j('#moduletab').tabs();
		var searchString = $j('#eval_qstns_srch').val();
		var url = prefix + "/question/listquestions/pgntbytopic"
				+ JJTEACH.extension + "?topicId=" + topicId + "&topicName="
				+ escape(topicName) + "&moduleId=" + moduleId + "&moduleName="
				+ escape($j('#topicTabLabel').html()) + "&searchString="
				+ escape(searchString);

		$j('#topicTabLabel').attr('style', 'display:inline');
		$j('#listEvaluationQuestionsByTopicDiv').load(url);

		$j('#topicTabLabel').html('Topic Questions');
		tab.tabs('select', (tab.tabs("length") - 1));

	},
	ajaxViewQuestionsNotAssociatedWithTopic : function(moduleId, topicId,
			topicName, startIndex) {

		// var tab = $j('#moduletab').tabs();
		var url = prefix + "/question/listquestions/unassociatedwithtopic"
				+ JJTEACH.extension;

		var data = {
			"moduleId" : moduleId,
			"topicId" : topicId,
			"topicName" : topicName
		};

		if (startIndex) {
			data["startIndex"] = startIndex;
		}

		$j('#topics').load(url, data);

		$j('#topicTabLabel').html('Associate Question With Topic');

		// tab.tabs('select', (tab.tabs("length") - 1));
	},
	ajaxPaginateUnAssociated : function(moduleId, topicId, topicName,
			startIndex) {
		var searchString = $j('#srch-string').val();
		var url = prefix + "/question/listquestions/unassociatedsearchresults"
				+ JJTEACH.extension + "?moduleId=" + moduleId + "&topicId="
				+ topicId + "&topicName=" + escape(topicName)
				+ "&searchString=" + escape(searchString) + "&startIndex="
				+ startIndex;

		$j('#listEvaluationQuestionsByTopicDiv').load(url);

		$j('#topicTabLabel').html('Associate Question With Topic');

		// tab.tabs('select', (tab.tabs("length") - 1));
	},
	ajaxViewQuestionsToDissociateFromTopic : function(moduleId, topicId,
			topicName, startIndex) {

		var url = prefix + "/question/listquestions/todissociatefromtopic"
				+ JJTEACH.extension + "?moduleId=" + moduleId + "&topicId="
				+ topicId + "&topicName=" + escape(topicName);

		$j('#topics').load(url);

		$j('#topicTabLabel').html('Dissociate Question From Topic');

	},
	ajaxPaginateQuestionsToDissociateFromTopic : function(moduleId, topicId,
			topicName, startIndex) {
		var searchString = $j('#dsc_qtns_srch').val();
		var url = prefix + "/question/listquestions/pgnttodissociatefromtopic"
				+ JJTEACH.extension + "?moduleId=" + moduleId + "&topicId="
				+ topicId + "&topicName=" + escape(topicName)
				+ "&searchString=" + escape(searchString) + "&startIndex="
				+ startIndex;

		$j('#listEvaluationQuestionsByTopicDiv').load(url);

		$j('#topicTabLabel').html('Dissociate Question From Topic');

	},
	ajaxQuestionAdd : function(div, param) {
		var parent = document.getElementById(div).parentNode.id;
		JJTEACH.loader('#' + parent);
		$j('#' + parent).load(
				prefix + "/question/addevaluationquestion" + JJTEACH.extension
						+ "?evaluationId=" + param);
	},
	ajaxQuestionEdit : function(div, param) {
		var parent = document.getElementById(div).parentNode.id;
		JJTEACH.loader('#' + parent);
		$j('#' + parent).load(
				prefix + "/question/editquestionform" + JJTEACH.extension
						+ "?questionId=" + param);
	},
	ajaxQuestionDelete : function(param, evaluationTemplateId) {
		jConfirm('Are you sure you want to Delete this question?',
				'Confirm Delete', function(r) {
					if (r == true) {
						$j.post(prefix + "/question/deleteQuestion"
								+ JJTEACH.extension, {
							questionId : param
						}, function(data) {
							var msg = data.u;
							if (msg == "deleteFailed") {
								jAlert('Delete failed', 'Delete Not Possible');
							} else {
								$j('#topics').load(
										prefix + "/question/listquestions"
												+ JJTEACH.extension
												+ "?evaluationId="
												+ evaluationTemplateId);
							}
						});
					}
				});

	},
	ajaxEnableModule : function(url, param) {
		JJTEACH.loader('#contents');
		$j('#contents').load(
				prefix + url + JJTEACH.extension + "?moduleId=" + param);
	},
	ajaxDisableModule : function(url, param) {
		JJTEACH.loader('#contents');
		$j('#contents').load(
				prefix + url + JJTEACH.extension + "?moduleId=" + param);
	},
	ajaxLoadCTModules : function(url, param) {
		JJTEACH.loader('#ctemplateboxes');
		$j('#ctemplateboxes')
				.load(
						prefix + url + JJTEACH.extension + "?courseTemplateId="
								+ param);
	},
	ajaxLoadGroupCT : function(url, param) {
		if (param == 0) {
			jAlert("Select A Group", "Group!");
			return false;
		} else {
			JJTEACH.loader('#groupctbox');
			$j('#groupctbox').load(
					prefix + url + JJTEACH.extension + "?groupId=" + param);
		}
	},
	ajaxLoadMTExercise : function(url, param) {
		JJTEACH.loader('#mtemplateboxes');
		$j('#mtemplateboxes')
				.load(
						prefix + url + JJTEACH.extension + "?mentorTemplateId="
								+ param);
	},
	ajaxLoadStudentCT : function(url, param) {
		JJTEACH.loader('#coursetemplatetab');
		$j('#coursetemplatetab').load(
				prefix + url + JJTEACH.extension + "?userId=" + param);
	},
	ajaxLoadSendStudentMsg : function(url, param) {
		JJTEACH.loader('#sendmessagetab');
		$j('#sendmessagetab').load(
				prefix + url + JJTEACH.extension + "?userId=" + param);
	},
	ajaxSubmitExercise : function(url, param) {
		JJTEACH.loader('#coursecountent');
		$j('#coursecontent').load(
				prefix + url + JJTEACH.extension + "?topicId=" + param);
		$j("#prevbutton,#nextbutton,#topprevbutton,#topnextbutton").css(
				'display', 'none');
	},
	topic : {
		populate : function(id) {
			new Ajax.Request(prefix + "/topic/listparenttopics"
					+ JJTEACH.extension, {
				method : 'get',
				parameters : {
					'id' : '' + id + ''
				},
				onSuccess : function(transport) {
					var json = transport.responseText.evalJSON();
					var topicOptions = "";
					var maximum = "";
					maximum += json[0].maxLevel;
					topicOptions += "<option value=''>Select Parent</option>";
					for ( var i = 0; i < json.length; i++) {
						topicOptions += "<option value='" + json[i].topicId
								+ "'>" + json[i].topicName + "</option>";
					}
					$j('#parent').html(topicOptions);
					$j('#maxLev').html(maximum);
				}
			})
		}
	},

	ajaxReadFeedback : function(url, param) {
		JJTEACH.loader('#coursecontent');
		$j('#coursecontent').load(
				prefix + url + JJTEACH.extension + "?topicId=" + param);
		$j("#prevbutton,#nextbutton,#topprevbutton,#topnextbutton").css(
				'display', 'none');
	},

	ajaxGradeExercise : function(url, param, title) {
		var tab = $j("#mentoringTab").tabs("add",
				prefix + url + JJTEACH.extension + "?exerciseId=" + param,
				"Grade " + title);
		tab.tabs('select', (tab.tabs("length") - 1));

	},

	/*
	 * ajaxLoadMentorTransactions : function(url, param, exercise) { var tab =
	 * $j("#mentoringTab").tabs("add", prefix + url + JJTEACH.extension +
	 * "?exerciseId=" + param, "User Exercise " + exercise); tab.tabs('select',
	 * (tab.tabs("length") - 1)); },
	 */

	ajaxLoadMentorTransactions : function(url, param, exercise) {

		$j
				.ajax({
					url : prefix + "/mentoring/checkexercisegradingstatus"
							+ JJTEACH.extension + "?exerciseId=" + param,
					type : "POST",
					success : function(response) {
						if (response.isBeingGraded == "false") {
							if (response.isGraded == "true") {
								alert("Exercise has already been graded");
								this.ajaxLoadTransactions(
										"/mentor/listtransactions",
										response.mentorId, response.moduleId);
							} else {
								var tab = $j("#mentoringTab").tabs(
										"add",
										prefix + url + JJTEACH.extension
												+ "?exerciseId=" + param,
										"User Exercise " + exercise);
								tab.tabs('select', (tab.tabs("length") - 1));
							}
						} else {
							alert("Exercise is being graded by "
									+ response.mentorName);
						}
					}
				});

	},
	loadTopicTree : function(url, moduleId, moduleName) {
		$j("#modules").css('display', 'none');
		JJTEACH.buildTopicTree(url, moduleId, moduleName);
		JJTEACH.refreshTopicTree(url, moduleId);
	},
	buildTopicTree : function(url, moduleId, moduleName) {
		if ($j('#sidebar').length == 0) {
			$j("#container").html(
					"<div id='sidebar'><div id='treeTitle'></div><div id='treeDiv'></div></div>"
							+ "<div id='contents'></div>");
		}
		$j('#sidebar div,#sidebar').css("display", "block");
		// $j('#sidebar').css("background", "#FFFFFF");
		$j('#treeTitle').html(moduleName);
		$j('#treeDiv').jstree({
			"plugins" : [ "json_data", "themes", "ui" ],
			"json_data" : {
				"ajax" : {
					"url" : prefix + url + JJTEACH.extension,
					"data" : function(n) {
						return {
							"moduleId" : moduleId
						};
					},
					"success" : function() {
						JJTEACH.loadLastAccessedTopicInModule(moduleId);
					}

				}
			},
			"ui" : {
				"select_limit" : 1
			},
			"themes" : {
				"theme" : "apple",
				"icons" : true
			}
		}).bind(
				"select_node.jstree",
				function(event, data) {
					var topicId = data.rslt.obj.attr("id");
					if ($j('#coursecontent').get() == "")
						$j('#contents').html("<div id='coursecontent'></div>");
					$j('#coursecontent').load(
							prefix + "/topictext/view" + JJTEACH.extension
									+ "?topicId=" + topicId);
					$j("#prevbutton,#nextbutton").css('display', 'block');
				});
	},
	refreshTopicTree : function(url, moduleId) {
		setInterval(function() {
			$j.ajax({
				url : prefix + "/topic/refresh/tree/by/modules"
						+ JJTEACH.extension + "?moduleId=" + moduleId,
				type : "GET",
				success : function(response) {
					for ( var i = 0; i < response.length; i++) {
						var status = $j("#treeDiv li#" + response[i].topicId)
								.attr("rel");
						if (status != response[i].status) {
							$j("#treeDiv li#" + response[i].topicId).attr(
									"rel", response[i].status);
							JJTEACH.selectTreeNode(response[i].topicId);
						}
					}
				}
			});
		}, 20000);
	},

	loadLastAccessedTopicInModule : function(moduleId) {

		var url = prefix + "/topic/lastaccessedtopicinmodule"
				+ JJTEACH.extension;
		new Ajax.Request(url, {
			method : 'get',
			parameters : {
				'moduleId' : moduleId
			},
			onSuccess : function(transport) {
				var topicId = transport.responseJSON.topicId;
				if (topicId >= 0)
					JJTEACH.selectTreeNode(topicId);
			}
		});
	},
	selectTreeNode : function(topicId) {
		setTimeout(function() {
			var node = $j("#treeDiv li#" + topicId).get();
			if (node == "") {
				JJTEACH.selectTreeNode(topicId);
				return;
			}
			$j.jstree._reference(node).select_node(node, true);
		}, 500);
	},
	ajaxLoadModules : function(url, param) {
		JJTEACH.loader('div.solutions');
		$j('div.solutions').load(
				prefix + url + JJTEACH.extension + "?mentorId=" + param);
	},
	ajaxLoadMentorMT : function(url, param) {
		JJTEACH.loader('#mentorboxes');
		$j('#mentorboxes').load(
				prefix + url + JJTEACH.extension + "?mentorId=" + param);
	},
	ajaxEditTabbedTemplate : function(param) {
		JJTEACH.loader('#mentorTemplate');
		$j('#mentorTemplate').load(
				prefix + "/mentor/editmentortemplateform" + JJTEACH.extension
						+ "?mentorTemplateId=" + param);
		$j('#assignExtoMt').load(
				prefix + "/mentor/mttabbedlistboxes" + JJTEACH.extension
						+ "?mentorTemplateId=" + param);
	},
	ajaxTabbedTemplate : function(param) {
		JJTEACH.loader('#mentorTemplate');
		$j('#mentorTemplate').load(
				prefix + "/mentor/mentortemplateprofile" + JJTEACH.extension
						+ "?mentorTemplateId=" + param);
		$j('#assignExtoMt').load(
				prefix + "/mentor/mttabbedlistboxes" + JJTEACH.extension
						+ "?mentorTemplateId=" + param);
	},
	ajaxEditMT : function(url, param) {
		JJTEACH.loader('#mentorTemplate');
		$j('#mentorTemplate')
				.load(
						prefix + url + JJTEACH.extension + "?mentorTemplateId="
								+ param);
	},
	ajaxLoadAssignMTEXs : function(url, param) {
		JJTEACH.loader('#assignExtoMt');
		$j('#assignExtoMt')
				.load(
						prefix + url + JJTEACH.extension + "?mentorTemplateId="
								+ param);
	},
	ajaxUserInfo : function(param) {
		JJTEACH.loader('#contents');
		$j('#contents').load(
				prefix + "/user/userinfo" + JJTEACH.extension + "?userId="
						+ param);
	},
	ajaxLoadStudentInfo : function(param) {
		JJTEACH.loader('#progresstab');
		$j('#progresstab').load(
				prefix + "/user/studentinfo" + JJTEACH.extension + "?userId="
						+ param);

	},
	ajaxLoadMentorMt : function(param) {
		JJTEACH.loader('#assigntab');
		$j('#assigntab').load(
				prefix + "/mentor/mtabbedlistboxes" + JJTEACH.extension
						+ "?userId=" + param);
	},
	ajaxLoadTransactions : function(url, param1, param2) {
		JJTEACH.loader('#contents');
		$j('#contents').load(
				prefix + url + JJTEACH.extension + "?mentorId=" + param1
						+ "&moduleId=" + param2);
	},

	ajaxToggleUserModuleStatus : function(param1, param2, param3) {
		if ($j(param3).is(':checked') == true) {
			$j.ajax({
				url : prefix + "/user/enabledisablemodule" + JJTEACH.extension
						+ "?userId=" + param1 + "&moduleId=" + param2,
				type : "POST"
			});
		} else {
			if (confirm("This action will disable the selected module.\nThe student will not be able to access the \nmodule")) {
				$j.ajax({
					url : prefix + "/user/enabledisablemodule"
							+ JJTEACH.extension + "?userId=" + param1
							+ "&moduleId=" + param2,
					type : "POST"
				});
			} else {
				$j(param3).attr('checked', 'checked');
			}
		}
	},

	ajaxLoadStatistics : function(url, param) {
		JJTEACH.loader('#statistics');
		$j('#statistics').load(
				prefix + url + JJTEACH.extension + "?mentorId=" + param);
	},
	setCurrentModule : function(url, url2, param1, param2) {
		$j.ajax({
			url : prefix + url + JJTEACH.extension + "?moduleId=" + param1,
			type : "POST"
		});
		JJTEACH.loadTopicTree(url2, param1, param2);

	},

	moduleEvaluation : function(url, param) {
		$j('#content').load(
				prefix + url + JJTEACH.extension + "?moduleId=" + param);
	},
	administerEvaluation : function(url, param) {
		$j('#content').load(
				prefix + url + JJTEACH.extension + "?testId=" + param);

	},
	courseEvaluation : function(url, param) {
		$j('#content').load(
				prefix + url + JJTEACH.extension + "?courseId=" + param);
	},

	ajaxViewModuleEvaluation : function(id, name) {
		var tab = $j('#moduletab').tabs();
		/*
		 * "add", prefix + "/evaluation/listevaluationtemplates" +
		 * JJTEACH.extension + "?moduleId=" + id, name + " Evaluation");
		 */
		$j('#topicTabLabel').attr('style', 'display:inline');
		$j('#topics').load(
				prefix + "/evaluation/listevaluationtemplates"
						+ JJTEACH.extension + "?moduleId=" + id);
		$j('#topicTabLabel').html(name + ' Module Evaluation');
		tab.tabs('select', (tab.tabs("length") - 1));

	},

	ajaxListModuleEvalStats : function(url, param) {
		$j('#moduleTestResultsTab').load(
				prefix + url + JJTEACH.extension + "?startIndex=" + param);
	},

	ajaxListCourseEvalStats : function(url, param) {
		$j('#courseTestResultsTab').load(
				prefix + url + JJTEACH.extension + "?startIndex=" + param);

	},
	ajaxAddEvaluationTemplate : function(param) {
		var parentId = document.getElementById("evaluationTemplate").parentNode.id;
		$j("#" + parentId).load(
				prefix + "/evaluation/addevaluationtemplate"
						+ JJTEACH.extension);
	},
	ajaxDownloadAttachedFile : function(url, param) {
		alert("in progress");
	},

	ajaxRemoveFile : function(param) {
		if (confirm("Remove file? Action cannot be undone")) {
			$j.ajax({
				url : prefix + "/topic/deletetopicfile" + JJTEACH.extension
						+ "?fileId=" + param,
				type : "POST",
				success : function(response) {
					if (response.ERROR == "true") {
						alert(response.MESSAGE);
					} else {
						alert(response.MESSAGE);
						$j('#fileRow').html("<td colspan=6>No file</td>");
					}
				}
			});
		} else {
			alert("Cancelled")
		}
	},

	ajaxCompany : function(param) {

		// $j('#wrapper').load(prefix + "/company" + param + JJTEACH.extension);
		$j.ajax({
			url : prefix + "/company" + param + JJTEACH.extension,
			type : "GET"
		});

		$j('#container').load(prefix + "/company" + param + JJTEACH.extension);
	},
	ajaxShowHideEvalQuestions : function() {
		if ($j("#evalQstnNum").css('visibility') == 'hidden') {
			$j("#evalQstnNum").css('visibility', 'visible');

		} else {
			$j("#evalQstnNum").css('visibility', 'hidden');
		}
	},
	ajaxTakeQuiz : function(id) {
		JJTEACH.loader('#popupQuiz' + id);
		$j('#popupQuiz' + id).load(
				prefix + "/topictext/quiz" + JJTEACH.extension + "?topicId="
						+ id);
		if ($j('#popupQuiz' + id).is('dialog')) {
			$j('#popupQuiz' + id).dialog('open');
		} else {
			$j(function() {
				$j('#popupQuiz' + id).dialog({
					resizable : false,
					minWidth : 430,
					maxWidth : 800,
					zIndex : 5000,
					title : 'Quiz',
					show : 'slide',
					draggable : false,
					modal : true,
					minHeight : 310,
					maxHeight : 600,
					autoOpen : true,
					closeOnEscape : false,
					overlay : {
						opacity : 0.6,
						background : "black"
					}
				});
			});
		}
	},
	ajaxShowResult : function(id) {
		$j('#popupQuiz' + id).load(
				prefix + "/topictext/quizresults" + JJTEACH.extension);
		$j('#popupQuiz' + id).dialog({
			closeOnEscape : true
		});

		$j('#popupQuiz' + id).dialog({
			buttons : [ {
				text : "OK",
				click : function() {
					$j(this).dialog("close");
				}
			} ]
		});

		$j("#treeDiv li#" + id).attr('rel', 'STATUS_TOPIC_COMPLETED');
		$j.ajax({
			url : prefix + "/user/completetopic.htm",
			type : "POST",
			data : {
				"topicId" : id
			},
			success : function(data) {
				$j("#coursecontent .head div").html(data.m);
				$j("#coursecontent .head div").css("font-size", "1.3em");
			}
		});

	},
	ajaxLoadNextQuiz : function(id) {
		$j('#popupQuiz' + id).load(
				prefix + "/topictext/quiznext" + JJTEACH.extension);

	},
	cloud : {
		cloudRevokeInstance : function(id) {
			var url = prefix + "/cloud/revokeinstance.htm?id=" + id;
			if (confirm('Are you sure you want to revoke this instance')) {
				JJTEACH.loader('#contents');
				$j('#contents').load(url);
			}
		},
		cloudDeleteInstance : function(id) {
			var url = prefix + "/cloud/deleteinstance.htm?id=" + id;
			if (confirm('Are you sure you want to delete this instance')) {
				JJTEACH.loader('#contents');
				$j('#contents').load(url);
			}
		}
	},
	ajaxReportPreview : function(cquery, title) {
		JJTEACH.loader('#preview');
		var regExp = /\s+/g;
		var q = cquery.replace(regExp, '%20');
		title = title.replace(regExp, '%20');
		$j('#preview').load(
				prefix + "/report/customreportpreview" + JJTEACH.extension
						+ "?customquery=" + q + "&reportTitle=" + title);
	},
	ajaxReportDownload : function(url) {
		var role = $j("#role :selected").val();
		window.open(prefix + url + '&role=' + role, 'Download');
	},
	ajaxReportPreview : function(cquery, title, id) {
		JJTEACH.ajaxLoaderB('#preview');
		var regExp = /\s+/g;
		var q = cquery.replace(regExp, '%20');
		title = title.replace(regExp, '%20');
		$j('#preview').load(
				prefix + "/report/customreportpreview" + JJTEACH.extension
						+ "?customquery=" + q + "&reportTitle=" + title
						+ "&reportId=" + id);
	},
	ajaxReportToolTipPreview : function(id, div) {
		$j(div).load(
				prefix + "/report/customreportpreview" + JJTEACH.extension
						+ "?reportId=" + id);
	},
	ajaxDeleteReport : function(url, id) {
		$j('#contents').load(prefix + url + JJTEACH.extension + '?id=' + id);
	},
	ajaxSavedReportDownload : function(url, id) {
		window.open(prefix + url + '&reportId=' + id, 'Download');
	},
	ajaxAddFieldRow : function() {
		$j('#default_row').clone().appendTo('#custom_fields > tbody:last');
	},
	ajaxRemoveLastFieldRow : function() {
		$j('#custom_fields tbody tr:last').remove();
	},
	ajaxAddDisplayField : function() {
		$j('#default_field').clone().appendTo(
				'#display_fields_table > tbody:last');
	},
	ajaxRemoveDisplayField : function() {
		$j('#display_fields_table tbody tr:last').remove();
	},
	ajaxLoadReportTable : function(table) {

		$j('#report_table_div').load(
				prefix + "/report/report_table" + JJTEACH.extension + "?table="
						+ table);
	},
	ajaxSaveReport : function() {
		JJTEACH.ajaxLoaderB('#report_table_div');
		$j('#report_table_div').load(
				prefix + "/report/save_report" + JJTEACH.extension);
	},
	ajaxAddJoinTable : function() {
		$j('#table_list').clone().appendTo('#join_tables > tbody:last');
	},
	ajaxRemoveJoinTable : function() {
		$j('#join_tables tbody tr:last').remove();
	},
	ajaxLoadTableFields : function(param) {
		$j.getJSON(prefix + "/report/gettablefields" + JJTEACH.extension, {
			table : '' + param + '',
			ajax : 'true'
		}, function(response) {
			var fields = response.fields;
			var options = '';
			for ( var i = 0; i < fields.length; i++) {
				options += '<option value="' + fields[i] + '">' + fields[i]
						+ '</option>';
			}
			$j('select#mainJoinColumn').html(options);
		});

	},
	ajaxShowReportSQL : function() {
		if ($j('#showsql').is(':checked') == true) {
			$j('#sqldiv').show('slow');
		} else {
			$j('#sqldiv').hide('slow')
		}
	},
	ajaxLoaderB : function(div) {
		$j(div).html(
				'<img style="position:absolute; bottom:50%;" src = "' + prefix
						+ '/images/preloader/black-002-loading.gif">');
	},
	ajaxSqlReportDownload : function() {
		JJTEACH.ajaxLoaderB('#preview');
		$j('#ajaxform').submit();
	}
}