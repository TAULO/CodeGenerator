'use strict';
var TRACK_LIST = null;
var _EB_Popup_Events = {

	initialize_listeners : function() {

		var $container = $("#popupContent");

		$container.on('click', '#showLoginForm', function(e) {
			e.preventDefault();
			$container.html(EngageBaygetTemplate('login', {}));
		});

		$container.on('click', '#loginWithGsuite', function(e) {
			e.preventDefault();
			$container.html(EngageBaygetTemplate('generate-verification-code',
					{}));
		});

		$container.on('click', '#showSignupForm', function(e) {
			e.preventDefault();
			$container.html(EngageBaygetTemplate('signup', {}));
			// Fill hidden fields
			$container.find("#timeZoneId").val(
					-(new Date().getTimezoneOffset()));
		});

		// Initialize events
		$container.on('keyup', 'input[name="email"].emailtype', function(e) {

			var website = $('[name="url"]').val();
			var email = $('[name="email"]').val();

			var email = $(this).val();
			if (!isEmail(email))
				return;

			var domain = getWebsiteFromEmail(email);
			if (domain)
				$container.find('input[name="url"]').val("http://" + domain);

		});

		$container
				.on(
						"click",
						"#resendLoginVerificationCode",
						function(e) {
							e.preventDefault();
							var email = $(this).attr('data-email');
							if (!email)
								return;

							generateLoginVerificationCode({
								email : email
							}, successCallback, errorCallback);

							function successCallback(authInfoJSON) {
								$("#errorBlock", $container).html('');
								var $successContainer = $("#successBlock",
										$container);
								$successContainer
										.html("<div class='xs-mb-20'>We sent you an email with the verification code. Please enter the code below to login.</div>");
								setTimeout(function() {
									$successContainer.html("");
								}, 6000);

							}

							function errorCallback(error) {
								$("#successBlock", $container).html('');
								$("#errorBlock", $container).html(
										"<div class='xs-mb-20'>" + error.responseText
												+ "</div>").show();
								$that.find(':input[type="submit"]').prop(
										'disabled', false);
								$that.find(':input[type="submit"] img').hide();
							}

						});

		$container
				.on(
						"submit",
						"#generateVerificationCodeForm",
						function(e) {

							e.preventDefault();

							var auhFormType = $(this).attr('name');
							var $that = $(this);

							var json = {};

							var formData = $(this).serializeArray();
							$.each(formData, function(index1, dataobj) {
								json[dataobj['name']] = dataobj['value']
							});

							$("#errorBlock", $container).hide();

							$that.find(':input[type="submit"]').prop(
									'disabled', true);
							$that.find(':input[type="submit"] img').show();

							generateLoginVerificationCode(json,
									successCallback, errorCallback);

							function successCallback(authInfoJSON) {

								var json1 = {
									email : json.email,
									'login_with_verification_code' : true
								};
								$container.html(EngageBaygetTemplate('login',
										json1));

								_EB_storage.set_local_storage(
										"POPUP_DEFAULT_TEMPLATE", {
											template_name : 'login',
											data : json1
										}, function() {
										});

								var $successContainer = $("#successBlock",
										$container);
								$successContainer
										.html("<div class='xs-mb-20'>We sent you an email with the verification code. Please enter the code below to login.</div>");
								setTimeout(function() {
									$successContainer.html("");
								});

							}

							function errorCallback(error) {
								$("#errorBlock", $container).html(
										"<div class='xs-mb-20'>" + error.responseText
												+ "</div>").show();
								$that.find(':input[type="submit"]').prop(
										'disabled', false);
								$that.find(':input[type="submit"] img').hide();
							}

							return false;

						});

		$container
				.on(
						"submit",
						".auth-form",
						function(e) {

							e.preventDefault();

							var auhFormType = $(this).attr('name');
							var $that = $(this);

							var json = {};

							var formData = $(this).serializeArray();
							$.each(formData, function(index1, dataobj) {
								json[dataobj['name']] = dataobj['value']
							});

							$("#errorBlock", $container).hide();

							$that.find(':input[type="submit"]').prop(
									'disabled', true);
							$that.find(':input[type="submit"] img').show();

							// Call respective auth method
							if (auhFormType && auhFormType == "signUpForm") {
								authenticateSignUpUser(json, successCallback,
										errorCallback);
							} else {
								authenticateLoginUser(json, successCallback,
										errorCallback);
							}

							function successCallback(authInfoJSON) {

								// console.log(authInfoJSON);

								_EB_storage
										.set_local_storage(
												AUTH_USER_API_KEY_NAME,
												authInfoJSON,
												function() {
													ENGAGEBAY_AUTH_USER_DATA = authInfoJSON;

													browser.extension
															.getBackgroundPage()
															.checkLoginAndDoNessasaryActions();

													browser.extension
															.getBackgroundPage()
															.reloadGmailTabs();

													browser.extension
															.getBackgroundPage()._EB_Background
															.setIcon('icon');
													_EB_Popup
															.loadUserDashboard(authInfoJSON);
												});

							}

							function errorCallback(error) {
								$("#errorBlock", $container).html(
										"<div class='xs-mb-20'>" + error.responseText
												+ "</div>").show();
								$that.find(':input[type="submit"]').prop(
										'disabled', false);
								$that.find(':input[type="submit"] img').hide();
							}

							return false;

						});
		$('body')
				.on(
						'click',
						"input#linkedinDataFetch",
						function(evt) {
							chrome.tabs
									.sendMessage(
											parseInt(this.dataset['tabid']),
											'engagebay_get_contact_details',
											function(contact) {
												// alert(contact);
												contact.data.countrycode = countryCode2Name;
												var linkedInurl = contact.data.linkedin;

												if (linkedInurl[linkedInurl.length - 1] == "/")
													contact.data.linkedin = contact.data.linkedin
															.slice(0, -1);

												if (contact.type == 'PERSON') {
													$(
															"#popupContent #dashbordContent")
															.html(
																	EngageBaygetTemplate(
																			'contact-add',
																			contact.data));
													validateLNContactForm();
												} else {
													$(
															"#popupContent #dashbordContent")
															.html(
																	EngageBaygetTemplate(
																			'ln-company',
																			contact.data));
													validateLNCompanyForm();
												}

											});

						});

		$('body').on(
				'click',
				"input#twitterMultipleDataFetch",
				function(evt) {
					chrome.tabs.sendMessage(parseInt(this.dataset['tabid']),
							'engagebay_get_contact_details_twitter', function(
									contact) {
								$("#popupContent #dashbordContent").html(
										EngageBaygetTemplate(
												'contact-multiple-add-twitter',
												contact.data));
								validateTwitterContactForm();

							});

				});

		$('body').on(
				'click',
				"input#twitterDataFetch",
				function(evt) {
					chrome.tabs.sendMessage(parseInt(this.dataset['tabid']),
							'engagebay_get_contact_details_twitter', function(
									contact) {
								if (contact.type == 'PERSON') {
									$("#popupContent #dashbordContent").html(
											EngageBaygetTemplate('contact-add',
													contact.data));
									validateTWContactForm();
								} else
									$("#popupContent #dashbordContent").html(
											EngageBaygetTemplate('ln-company',
													contact.data));

							});

				});

		$('body')
				.on(
						'click',
						'#loadActivities',
						function() {

							ACTIVE_ROUTER = "ACTIVITY";
							LAST_FETCHED_CURSOR = "";

							$('.navbar').find('.active').removeClass('active');
							$(this).addClass('active');

							$(".navbar").find(".extension-seleted-name").text(
									$(this).text());

							$("#linkedIn-add-new").addClass("hide");

							$("#popupContent #dashbordContent")
									.html(
											'<div class="text-center xs-pt-50 xs-mt-40"><img height="100" width="100" src="../images/loader.gif"></div>');

							loadActivities(
									"",
									function() {

										browser.extension.getBackgroundPage()._EB_Background
												.setBadgeText("");

										$("#popupContent #dashbordContent")
												.html("");
									});

						});

		$('body')
				.on(
						'click',
						'#loadContactForm',
						function() {

							ACTIVE_ROUTER = "";
							$("#popupContent #dashbordContent").html("");
							$("#popupContent #dashbordContent")
									.html(
											'<div class="text-center xs-pt-50 xs-mt-40"><img height="100" width="100" src="../images/loader.gif"></div>');

							$("#popupContent #dashbordContent").html(
									EngageBaygetTemplate("add-contact-form"));

						});

		$('body').on("click", "#send_contact", function() {
			if ($("#save_contact").valid()) {
				saveContactToDB($("#send_contact"));
			}
		});

		$('body').on("click", "#form_update_contact_save", function() {
			if ($("#save_contact").valid())
				saveContactToDB();
		});

		$('body')
				.on(
						'click',
						'#loadDealForm',
						function() {

							ACTIVE_ROUTER = "";
							$("#popupContent #dashbordContent").html("");
							$("#popupContent #dashbordContent")
									.html(
											'<div class="text-center xs-pt-50 xs-mt-40"><img height="100" width="100" src="../images/loader.gif"></div>');

							$("#dashbordContent").html(
									EngageBaygetTemplate("add-deal-form"));

							var str = "";
							// Get users
							_EB_Request_Processor(
									"/api/panel/users",
									{},
									"GET",
									function(response) {

										for (var i = 0; i < response.length; i++) {
											str += "<option value='"
													+ response[i].id + "'>"
													+ response[i].name
													+ "</option>";
										}
										$("#owner_id").html(str);
									});
							var tractStr = "";
							var milestone_ui = "";
							// Get tracks
							_EB_Request_Processor(
									"/api/panel/tracks",
									{},
									"GET",
									function(response) {

										for (var i = 0; i < response.length; i++) {
											tractStr += "<option value='"
													+ response[i].id + "'>"
													+ response[i].name
													+ "</option>";
										}
										$("#track").html(tractStr);
										for (var i = 0; i < response[0].milestones.length; i++) {
											milestone_ui += "<option value="
													+ response[0].milestones[i].labelActualName
													+ ">"
													+ response[0].milestones[i].labelName
													+ "</option>";
										}
										TRACK_LIST = response;

										$("#milestone").html(milestone_ui);
									});

							$("#add_deal_form")
									.delegate(
											'#track',
											'change',
											function(e) {
												var pipelineId = $(this).val();

												var getmilstone;
												for (var i = 0; i < TRACK_LIST.length; i++) {
													if (TRACK_LIST[i].id == pipelineId) {
														getmilstone = TRACK_LIST[i];
														break;
													}
												}
												var milestoneUI = "";
												if (getmilstone != undefined) {
													for (var u = 0; u < getmilstone.milestones.length; u++) {
														milestoneUI += "<option value="
																+ getmilstone.milestones[u].labelActualName
																+ ">"
																+ getmilstone.milestones[u].labelName
																+ "</option>";
													}
												}
												$("#milestone").html(
														milestoneUI);
											});

							$('#closed_date').datepicker();

						});

		$('body').on("click", "#send_deal", function() {
			if ($("#add_deal_form").valid()) {
				saveDealToDB();
			}
		});

		$('body')
				.on(
						'click',
						'#loadCompanyForm',
						function() {
							ACTIVE_ROUTER = "";
							$("#popupContent #dashbordContent").html("");
							$("#popupContent #dashbordContent")
									.html(
											'<div class="text-center xs-pt-50 xs-mt-40"><img height="100" width="100" src="../images/loader.gif"></div>');

							$("#dashbordContent").html(
									EngageBaygetTemplate("add-company-form"));

						});

		$('body')
				.on(
						'click',
						'#loadTaskForm',
						function() {

							ACTIVE_ROUTER = "";
							$("#popupContent #dashbordContent").html("");
							$("#popupContent #dashbordContent")
									.html(
											'<div class="text-center xs-pt-50 xs-mt-40"><img height="100" width="100" src="../images/loader.gif"></div>');

							$("#dashbordContent").html(
									EngageBaygetTemplate("add-task-form"));

							var str = "";
							// Get users
							_EB_Request_Processor(
									"/api/panel/users",
									{},
									"GET",
									function(response) {

										for (var i = 0; i < response.length; i++) {
											str += "<option value='"
													+ response[i].id + "'>"
													+ response[i].name
													+ "</option>";
										}
										$("#owner_id").html(str);
									});

							var categroieshtml = "";
							// load categroies
							_EB_Request_Processor(
									"/api/panel/taskcategory",
									{},
									"GET",
									function(response) {

										for (var i = 0; i < response.categories.length; i++) {
											categroieshtml += "<option value='"
													+ response.categories[i]
													+ "'>"
													+ response.categories[i]
													+ "</option>";
										}
										$("#Task_type").html(categroieshtml);
									});

							$('#closed_date').datepicker();

						});

		$('body').on("click", "#send_task", function() {
			if ($("#add_task_form").valid()) {
				saveTaskToDB();
			}
		});

		$("body").on("click", "#send_company", function() {
			if ($("#add_company_form").valid()) {
				saveCompanyToDB();
			}
		});

		$('body')
				.on(
						'click',
						'#loadContacts',
						function() {

							ACTIVE_ROUTER = "CONTACTS";
							LAST_FETCHED_CURSOR = "";

							$('.navbar').find('.active').removeClass('active');
							$(this).addClass('active');

							$(".navbar").find(".extension-seleted-name").text(
									$(this).text());

							$("#linkedIn-add-new").addClass("hide");

							$("#popupContent #dashbordContent").html(
									EngageBaygetTemplate('contacts-container',
											{}));

							$("#popupContent #contactsContent")
									.html(
											'<div class="text-center xs-pt-50 xs-mt-40"><img height="100" width="100" src="../images/loader.gif"></div>');

							loadContacts('/api/panel/subscribers', {
								page_size : 20,
								sort_key : '-created_time'
							}, 'POST', function() {
								$("#popupContent #contactsContent").html("");
							});

						});
		$('body')
				.on(
						'click',
						'#loadLinkedInSearch',
						function() {

							$('.navbar').find('.active').removeClass('active');
							$(this).addClass('active');

							$(".navbar").find(".extension-seleted-name").text(
									$(this).text());

							$("#popupContent #dashbordContent").html(
									EngageBaygetTemplate('linkedIn-container',
											{}));

							$("#linkedIn-add-new").addClass("hide");

							$("#popupContent #contactsContent")
									.html(
											'<div class="text-center xs-pt-50 xs-mt-40"><img height="100" width="100" src="../images/loader.gif"></div>');

							$("#popupContent #contactsContent").html(
									EngageBaygetTemplate('linkedin-prospect',
											{}));

							$("#btn_search").on("click", function(evt) {
								showLinkedinData();
								window.close();
							});
							$("#btn_search_keyword").on("click", function(evt) {
								var value = showLinkedinDataByKeyword();
								if (value == true)
									window.close();
							});

						});

		$('body')
				.on(
						'mouseover',
						'.add-to-sequence-popup .addToSequence',
						function() {

							// console.log("in");

							var $that = $(this).closest(
									'.add-to-sequence-popup');

							if (!SEQUENCE_COLLECTION) {

								$that
										.find('.add-to-sequence-popup-content')
										.html(
												'<img style="padding:10px;" src="../images/f-loader.gif" />');

								// fetch from server
								// Get user activities
								_EB_Request_Processor("/api/panel/sequence",
										{}, "GET", function(response) {
											SEQUENCE_COLLECTION = response;
											fillSequenceList($that);
										});

							} else {
								fillSequenceList($that);
							}

						});

		function fillSequenceList($el) {

			var template = "";

			if (!SEQUENCE_COLLECTION || SEQUENCE_COLLECTION.length == 0)
				template = "<p>Sequence is unavailable to add contact.</p>";
			else {
				var options = "";
				$.each(SEQUENCE_COLLECTION, function(index, seq) {
					options += "<option value='" + seq.id + "'>" + seq.name
							+ "</option>";
				});
				template = "<p>Add this contact to sequence?</p> <div> <select class='form-control'>"
						+ options
						+ "</select></div> <div style='margin-top: 10px;'> <button id='addContactToSequence' class='btn btn-primary'>Add</button> </div>";
			}

			$el.find('.add-to-sequence-popup-content').html(template);

		}

		$('body').on(
				'click',
				'#addContactToSequence',
				function() {

					if ($(this).attr('disabled'))
						return;

					var sequenceId = $(this).closest(
							'.add-to-sequence-popup-content').find('select')
							.val();
					if (!sequenceId)
						return;

					var subscriberId = $(this).closest('.contact-details')
							.attr('data-id');
					if (!subscriberId)
						return;

					$(this).attr('disabled', true);

					// Get user activities
					var $that = $(this);
					_EB_Request_Processor(
							"/api/panel/subscribers/add-to-sequence", {
								subscriberId : subscriberId,
								sequenceId : sequenceId
							}, "GET", function(response) {
								$that.text("Added");
							});

				});

		$('body')
				.on(
						'mouseover',
						'.add-to-list-popup .addToList',
						function() {

							// console.log("in");

							var $that = $(this).closest('.add-to-list-popup');

							if (!LIST_COLLECTION) {

								$that
										.find('.add-to-list-popup-content')
										.html(
												'<img style="padding:10px;" src="../images/f-loader.gif" />');

								// fetch from server
								// Get user activities
								_EB_Request_Processor("/api/panel/contactlist",
										{}, "GET", function(response) {
											LIST_COLLECTION = response;
											fillListList($that);
										});

							} else {
								fillListList($that);
							}

						});

		function fillListList($el) {

			var template = "";

			if (!LIST_COLLECTION || LIST_COLLECTION.length == 0)
				template = "<p>List is unavailable to add contact.</p>";
			else {
				var options = "";
				$.each(LIST_COLLECTION, function(index, seq) {
					options += "<option value='" + seq.id + "'>" + seq.name
							+ "</option>";
				});
				template = "<p>Add this contact to list?</p> <div> <select class='form-control'>"
						+ options
						+ "</select></div> <div style='margin-top: 10px;'> <button id='addContactToList' class='btn btn-primary'>Add</button> </div>";
			}

			$el.find('.add-to-list-popup-content').html(template);

		}

		$('body').on(
				'click',
				'#addContactToList',
				function() {

					if ($(this).attr('disabled'))
						return;

					var listId = $(this).closest('.add-to-list-popup-content')
							.find('select').val();
					if (!listId)
						return;

					var subscriberId = $(this).closest('.contact-details')
							.attr('data-id');
					if (!subscriberId)
						return;

					$(this).attr('disabled', true);

					var $that = $(this);
					// Get user activities
					_EB_Request_Processor("/api/panel/subscribers/add-to-list",
							{
								subscriberId : subscriberId,
								listId : listId
							}, "GET", function(response) {
								$that.text("Added");
							});

				});

		$('body')
				.on(
						'keyup',
						'#contactSearchField',
						function() {

							var q = $(this).val();

							$("#popupContent #contactsContent")
									.html(
											'<div class="text-center xs-pt-50 xs-mt-40"><img height="100" width="100" src="../images/loader.gif"></div>');

							LAST_FETCHED_CURSOR = "";

							function callback() {
								$("#popupContent #contactsContent").html("");
							}

							if (!q) {

								ACTIVE_ROUTER = "CONTACTS";

								loadContacts('/api/panel/subscribers', {
									page_size : 20,
									sort_key : '-created_time'
								}, 'POST', callback);
								return;
							}

							ACTIVE_ROUTER = "CONTACT_SEARCH";

							loadContacts('/api/search', {
								q : q,
								page_size : 20,
								type : "Subscriber",
								order_by : '-created_time',
							}, 'GET', callback);

						});

		$('body').on(
				'click',
				'.contact-details',
				function() {

					var cId = $(this).data('id');
					if (!cId)
						return;

					window.open('https://'
							+ ENGAGEBAY_AUTH_USER_DATA.domain_name
							+ '.engagebay.com/home#list/0/subscriber/' + cId,
							'_blank');
					return;

				});

	}

};

var SEQUENCE_COLLECTION;
var LIST_COLLECTION;
var ACTIVE_ROUTER;
var LAST_FETCHED_CURSOR;

function loadContacts(url, json, type, callback) {

	console.log("json", json)

	// Get user activities
	_EB_Request_Processor(url, json, type, function(response) {

		if (callback)
			callback();

		if (response && response.length > 0)
			LAST_FETCHED_CURSOR = response[response.length - 1].cursor;

		var $content = $(EngageBaygetTemplate('contacts', response));

		$content.find('.gravatar-intial-img').each(function(index, ele) {
			loadGravatarOrIntialImage(ele);
		});

		$("#popupContent #contactsContent").append($content);

	});

}

function loadGravatarOrIntialImage(ele) {

	const dataName = $(ele).data('name');
	var email = $(ele).data('email');

	if (!email)
		email = "";
	// Default image
	const backup_image = "&d=" + 404 + "\" ";

	const img = new Image();
	img.src = 'https://secure.gravatar.com/avatar/' + MD5(email) + '.jpg?s='
			+ "50" + backup_image;
	img.onload = function() {
	};
	img.onerror = function() {
		img.src = getIntialImage(dataName);
	};

	$(ele).append(img);
}

function loadActivities(cursor, callback) {

	var json = {
		page_size : 20,
		sort_key : '-created_time'
	}

	if (cursor)
		json.cursor = cursor;

	// Get user activities
	_EB_Request_Processor("/api/browser-extension/get-user-email-activities",
			json, "GET", function(response) {

				if (response && response.length > 0)
					LAST_FETCHED_CURSOR = response[response.length - 1].cursor;

				if (callback)
					callback(response);

				var $content = $(EngageBaygetTemplate('dashboard', response));

				$content.find('.gravatar-intial-img').each(
						function(index, ele) {
							loadGravatarOrIntialImage(ele);
						});

				$("#popupContent #dashbordContent").append($content);

			});

}

var INFINISCROLL_SERVING = false;
$("body").on(
		"scroll",
		function(e) {

			if (INFINISCROLL_SERVING || !LAST_FETCHED_CURSOR)
				return;

			if ($(this).scrollTop() <= ($(document).height()
					- $(window).height() - 10)) {
				return;
			}

			if (ACTIVE_ROUTER == "ACTIVITY") {
				INFINISCROLL_SERVING = true;
				loadActivities(LAST_FETCHED_CURSOR, function() {
					INFINISCROLL_SERVING = false;
				});
			}

			if (ACTIVE_ROUTER == "CONTACTS") {
				loadContacts('/api/panel/subscribers', {
					page_size : 20,
					sort_key : '-created_time',
					cursor : LAST_FETCHED_CURSOR
				}, 'POST', function() {
					INFINISCROLL_SERVING = false;
				});
			}

			if (ACTIVE_ROUTER == "CONTACT_SEARCH") {

				var q = $("#popupContent #contactSearchField").val();
				if (!q) {
					INFINISCROLL_SERVING = false;
					return;
				}

				loadContacts('/api/search', {
					q : q,
					page_size : 20,
					type : "Subscriber",
					order_by : '-created_time',
				}, 'GET', function() {
					INFINISCROLL_SERVING = false;
				});

			}

		});

function showLinkedinData() {
	var manager = document.getElementById("form-manager").value;
	var country = document.getElementById("form-country").value;
	var location = document.getElementById("form-location").value;

	var s = manager + ' "' + country + '"' + ' "' + location + '"';

	var urr = encodeURI(s).replace(/%20/g, '+').replace('&', '%26');

	var query = urr
			+ " site:linkedin.com/in/ OR site:linkedin.com/pub/ -site:linkedin.com/pub/dir/ -site:ca.linkedin.com&gws_rd=cr&ei=FqhaV-3EOYvnvASv6bCoAg";

	var uri = "https://www.google.com/search?num=100&q=" + query;

	browser.tabs.create({
		url : uri
	});
}

function showLinkedinDataByKeyword() {
	var keyword = document.getElementById("any_key_word").value;
	var searc_criteria = document.getElementById("form_manager1").value;

	if (!keyword) {
		document.getElementById("result_keyword").innerHTML = "<b style='color: red;'>Required keyword</b>";
		return false;
	}

	if (!searc_criteria) {
		document.getElementById("result_select_item").innerHTML = "<b style='color: red;'>Select criteria</b>";
		return false;
	}

	if (searc_criteria == "search_contact_in_google") {
		var query = keyword
				+ " site:linkedin.com/in/ OR site:linkedin.com/pub/ -site:linkedin.com/pub/dir/";
		browser.tabs.create({
			url : "http://www.google.com/search?gws_rd=cr&as_qdr=all&q="
					+ query
		});
	}

	if (searc_criteria == "search_company_in_google") {
		var query = keyword + " site:www.linkedin.com/company/";
		browser.tabs.create({
			url : "http://www.google.com/search?gws_rd=cr&as_qdr=all&q="
					+ query
		});
	}
	return true;
}

function validateLNContactForm() {
	$("#contact_save").on("click", function(e) {
		if ($("#add_contact").valid()) {
			onLNSave('PERSON', $('#contact_save'));
		} else {
			return;
		}
	});
}

function validateTWContactForm() {
	$("#contact_save").on("click", function(e) {
		if ($("#add_contact").valid()) {
			onTWSave('PERSON', $('#contact_save'));
		} else {
			return;
		}
	});
}

function validateLNCompanyForm() {
	$("#company_save").on("click", function(e) {
		if ($("#add_company").valid()) {
			onCompanySave('COMPANY', $('#company_save'));
		} else
			return;

	});
}

function onCompanySave(actionMsg, element) {
	if (element) {
		element.attr('disabled', 'disabled');
	}
	var props = [];
	var nameForm = "";
	$('#dashbordContent').find('input._engagebay_inp').each(function() {
		if ($(this).val()) {

			if ($(this).attr('name') == 'name')
				nameForm = $(this).val();
			if ($(this).attr('data-subtype'))
				props.push({
					name : $(this).attr('name'),
					value : $(this).val(),
					type : 'SYSTEM',
					subtype : $(this).attr('data-subtype')
				});
			else
				props.push({
					name : $(this).attr('name'),
					value : $(this).val(),
					type : 'SYSTEM'
				});
		}
	});

	var addrCustom = {};
	var addrElems = document
			.querySelectorAll('div#_engagebay_extn_addContact ._engagebay_inp_custom.address[name]');
	$('#dashbordContent').find('._engagebay_inp_custom.address[name]').each(
			function() {
				if ($(this).val() && $(this).val().length > 0)
					addrCustom[$(this).attr('name')] = $(this).val();
			});

	if (addrCustom.addressCity || addrCustom.addressCountry) {
		var obj = {};
		if (addrCustom.addressCity)
			obj.city = addrCustom.addressCity;
		if (addrCustom.addressCountry)
			obj.country = addrCustom.addressCountry;
		props.push({
			name : 'address',
			value : JSON.stringify(obj),
			subtype : ''
		});
	}

	var company = {};
	company.properties = JSON.stringify(props);
	company.type = actionMsg;

	if ($('#crm_others').find('._engagebay_update_').length == 1) {
		_EB_Request_Processor("/api/browser-extension/getcomany?name="
				+ nameForm, {}, "GET", function(resp) {
			company.id = resp.id;
			updateEngagebayCompany(company, element);

		}, function(err) {
			// console.log(err);
		});
	} else {
		createEngagebayCompany(company, element);
	}
}
function onTWSave(actionMsg, element) {
	if (element) {
		element.attr('disabled', 'disabled');
	}
	var props = [];
	var emailForm = "";
	$('#dashbordContent').find('input._engagebay_inp').each(function() {
		if ($(this).val()) {

			if ($(this).attr('name') == 'email')
				emailForm = $(this).val();
			if ($(this).attr('data-subtype'))
				props.push({
					name : $(this).attr('name'),
					value : $(this).val(),
					type : 'SYSTEM',
					subtype : $(this).attr('data-subtype')
				});
			else
				props.push({
					name : $(this).attr('name'),
					value : $(this).val(),
					type : 'SYSTEM'
				});
		}
	});

	var addrCustom = {};
	var addrElems = document
			.querySelectorAll('div#_engagebay_extn_addContact ._engagebay_inp_custom.address[name]');
	$('#dashbordContent').find('._engagebay_inp_custom.address[name]').each(
			function() {
				if ($(this).val() && $(this).val().length > 0)
					addrCustom[$(this).attr('name')] = $(this).val();
			});

	if (addrCustom.addressCity || addrCustom.addressCountry) {
		var obj = {};
		if (addrCustom.addressCity)
			obj.city = addrCustom.addressCity;
		if (addrCustom.addressCountry)
			obj.country = addrCustom.addressCountry;
		props.push({
			name : 'address',
			value : JSON.stringify(obj),
			subtype : ''
		});
	}

	var contact = {};
	contact.properties = JSON.stringify(props);
	contact.type = actionMsg;
	contact.tags = JSON.stringify([ "twitter" ]);
	// Add Source
	contact.source = 'TWITTER';
	contact.isFromTwitter = true;
	if ($('#crm_others').find('._engagebay_update_').length == 1) {
		crm.getContactDetails(emailForm, function(resp) {
			contact.id = resp.id;
			updateEngagebayContact(contact, element);

		}, function(err) {
			// console.log(err);
		});
	} else {
		createEngagebayContact(contact, element);
	}

}
function updateEngagebayCompany(company, element) {
	var isTagsUpdateAllow = false;
	var company2 = {};
	company2.id = company.id;
	if (company.tags != undefined && company.tags.length > 0) {
		if (company.tags[0] != 'linkedin') {
			isTagsUpdateAllow = true;
			company2.tags = company.tags;
		}
	}
	$("#dashbordContent #message").remove();
	_EB_Request_Processor("/api/browser-extension/updatecompany", company,
			"PUT", function(resp) {

			}, function(err) {

			}, "application/x-www-form-urlencoded");
	if (element) {
		element.removeAttr('disabled');
	}
}

function createEngagebayCompany(company, element) {
	$("#dashbordContent #message").remove();
	_EB_Request_Processor(
			"/api/browser-extension/addcompany",
			company,
			"POST",
			function(resp) {
				var isUpdated = false;
				if (resp.updated_time > resp.created_time)
					isUpdated = true;
				var contactLink = 'https://'
						+ ENGAGEBAY_AUTH_USER_DATA.domain_name
						+ '.engagebay.com/#company/' + resp.id;
				$("#crm_others123")
						.append(
								'<div id="message" style="font-size: 11px;color: #02bd02;margin-left: 117px;margin-bottom:10px;">Company has been created successfully. Click <a href="'
										+ contactLink
										+ '" target="_blank" style="color: blue;">here </a> to open the company</div>');

			},
			function(err) {
				if (err.responseText == 'Sorry, duplicate contact found with the same email address.') {
					$('#dashbordContent').find('._engagebay_save_').remove();
					$("#add_contact .linked-forms-btn")
							.append(
									'<input value="Update" style="color: #fff;background-color: #f2603e;border-color: #f2603e;text-transform: capitalize;" class="_engagebay_update_ btn btn-primary" id="contact_save">');
					$("#crm_others123")
							.append(
									'<div id="message" style="font-size: 11px;color: red;margin-left: 117px;margin-bottom:10px;">Sorry, we found another contact with the same email ID. Please update the existing contact.</div>');
					validateLNContactForm();
				} else {
					$("#crm_others123")
							.append(
									'<div id="message" style="font-size: 11px;color: red;margin-left: 117px;margin-bottom:10px;">'
											+ err.responseText + '</div>');
				}
			}, "application/x-www-form-urlencoded");
	if (element) {
		element.removeAttr('disabled');
	}
}

function saveCompanyToDB(element) {
	if (element) {
		element.attr('disabled', 'disabled');
	}
	var company = {};
	$("#add_company_form").find(".form-control").each(function() {
		var value = $(this).val();
		var label = $(this).attr('name');

		if (label != 'email')
			company[label] = value;
	});

	_EB_Request_Processor(
			"/api/browser-extension/company-form",
			company,
			"POST",
			function(resp) {
				$('#save_company').attr('disabled', 'disabled');
				$("#add_company_form #crm_others123").html("");
				$("#add_company_form #crm_others123")
						.append(
								'<div id="message" style="font-size: 11px;color: #02bd02;margin-left: 117px;margin-bottom:10px;">Company is added in Engagebay.</div>');
			},
			function(err) {
				$("#add_company_form #crm_others123").html("");
				$("#add_company_form #crm_others123")
						.append(
								'<div id="message" style="font-size: 11px;color: red;margin-left: 117px;margin-bottom:10px;">'
										+ err.responseText + '</div>');
			});

}
function saveDealToDB(element) {
	if (element) {
		element.attr('disabled', 'disabled');
	}
	var deal = {};
	var lableName;
	$("#add_deal_form").find(".form-control").each(function() {
		var value = $(this).val();
		var label = $(this).attr('name');
		if (label == 'closed_date') {
			if (value.length >= 1) {
				var date = new Date(value);
				value = date.getTime() / 1000;
			} else
				value = 0;
		}
		if (label == "milestoneActualName") {
			lableName = $(this).find("option:selected").text()
		}
		// Ignore the Email in JSON as it is to be sent in the URL but not in
		// the JSON.
		// This is the email of the contact to which this task is related to.
		if (label != 'email')
			deal[label] = value;
	});
	var email = $("#add_deal_form input[name='email']").val();
	deal.milestoneLabelName = lableName;
	deal.is_due = true;
	deal.entiy_group_name = "deal";
	_EB_Request_Processor(
			"/api/browser-extension/deal-form",
			deal,
			"POST",
			function(resp) {
				$('#save_deal').attr('disabled', 'disabled');
				$("#add_deal_form #crm_others123").html("");
				$("#add_deal_form #crm_others123")
						.append(
								'<div id="message" style="font-size: 11px;color: #02bd02;margin-left: 117px;margin-bottom:10px;">Deal is added in Engagebay.</div>');
			},
			function(err) {
				$("#add_deal_form #crm_others123").html("");
				$("#add_deal_form #crm_others123")
						.append(
								'<div id="message" style="font-size: 11px;color:red;margin-left: 117px;margin-bottom:10px;">'
										+ err.responseText + '</div>');
			});
}

function saveTaskToDB(element) {
	if (element) {
		element.attr('disabled', 'disabled');
	}
	var task = {};
	$("#add_task_form").find(".form-control").each(function() {
		var value = $(this).val();
		var label = $(this).attr('name');
		if (label == 'closed_date') {
			var date = new Date(value);
			value = date.getTime() / 1000;
		}
		// Ignore the Email in JSON as it is to be sent in the URL but not in
		// the JSON.
		// This is the email of the contact to which this task is related to.
		if (label != 'email')
			task[label] = value;
	});

	task.is_due = true;
	task.entiy_group_name = "task";
	_EB_Request_Processor(
			"/api/browser-extension/task-form",
			task,
			"POST",
			function(resp) {
				$('#save_task').attr('disabled', 'disabled');
				$("#add_task_form #crm_others123").html("");
				$("#add_task_form #crm_others123")
						.append(
								'<div id="message" style="font-size: 11px;color: #02bd02;margin-left: 117px;margin-bottom:10px;">Task is added in Engagebay.</div>');
			},
			function(err) {
				$("#add_task_form #crm_others123").html("");
				$("#add_task_form #crm_others123")
						.append(
								'<div id="message" style="font-size: 11px;color:red;margin-left: 117px;margin-bottom:10px;">'
										+ err.responseText + '</div>');
			});
}

function saveContactToDB(element) {
	if (element) {
		element.attr('disabled', 'disabled');
	}
	var props = [];
	var emailForm = "";
	var isVaildTagInput = false;
	var tags_received = "";
	var tags_input = [ "Chrome Extension" ];
	$('#dashbordContent').find('input._engagebay_inp').each(
			function() {
				if ($(this).val()) {

					if ($(this).attr('name') == 'email') {
						emailForm = $(this).val();
					}
					if ($(this).attr('name') == 'tags') {
						// console.log("here");
						tags_received = $(this).val();
						var tags = [];
						if (tags_received.indexOf(",") > 0) {
							var tagsarr = tags_received.split(",");
							for (var j = 0; j < tagsarr.length; j++) {
								var eachTag = tagsarr[j];
								eachTag = eachTag.trim();
								if (isValidTagTester(eachTag)) {
									tags_input.push(eachTag);
								} else {
									isVaildTagInput = true;
								}

							}
						} else {
							tags_received = tags_received.trim();
							if (tags_received.length > 0
									&& isValidTagTester(tags_received)) {
								tags_received = tags_received.trim();
								tags_input.push(tags_received);
							} else {
								isVaildTagInput = true;
							}
						}
						// tags_input = $(this).val();
					} else {
						props.push({
							name : $(this).attr('name'),
							value : $(this).val(),
							type : 'SYSTEM'
						});
					}

				}
			});
	var contact = {};
	contact.properties = JSON.stringify(props);
	if (tags_input.length > 0) {
		if (isVaildTagInput) {
			if (document.getElementById('err_message_ag') != null) {
				document.getElementById('err_message_ag').remove();
			}
			$("#dashbordContent123")
					.append(
							'<div id="err_message_ag" style="font-size: 11px;color: red;margin-left: 117px;margin-bottom:10px;">Tag name should start with an alphabet and cannot contain special characters other than underscore and space.</div>');
			element.removeAttr('disabled');
			return;
		}
		contact.tags = JSON.stringify(tags_input);
		// Add Source
		contact.source = 'Extension';
	} else {
		if (tags_received.length > 0 && isVaildTagInput) {
			if (document.getElementById('err_message_ag') != null) {
				document.getElementById('err_message_ag').remove();
			}
			$("#dashbordContent123")
					.append(
							'<div id="err_message_ag" style="font-size: 11px;color: red;margin-left: 117px;margin-bottom:10px;">Tag name should start with an alphabet and cannot contain special characters other than underscore and space.</div>');
			element.removeAttr('disabled');
			return;
		} else {
			contact.tags = JSON.stringify([ "linkedin" ]);
			// Add Source
			contact.source = 'Extension';
		}

	}

	createEngagebayContactFromForm(contact, element);

}

function onLNSave(actionMsg, element) {
	if (element) {
		element.attr('disabled', 'disabled');
	}
	var props = [];
	var emailForm = "";
	var tags_input = [ "linkedin" ];
	var tags_received = "";
	var isVaildTagInput = false;
	$('#dashbordContent').find('input._engagebay_inp').each(
			function() {
				if ($(this).val()) {

					if ($(this).attr('name') == 'email') {
						emailForm = $(this).val();
					}
					if ($(this).attr('data-subtype')) {
						props.push({
							name : $(this).attr('name'),
							value : $(this).val(),
							type : 'SYSTEM',
							subtype : $(this).attr('data-subtype')
						});
					} else {
						if ($(this).attr('name') == 'tags') {
							// console.log("here");
							tags_received = $(this).val();
							var tags = [];
							if (tags_received.indexOf(",") > 0) {
								var tagsarr = tags_received.split(",");
								for (var j = 0; j < tagsarr.length; j++) {
									var eachTag = tagsarr[j];
									eachTag = eachTag.trim();
									if (isValidTagTester(eachTag)) {
										tags_input.push(eachTag);
									} else {
										isVaildTagInput = true;
									}

								}
							} else {
								tags_received = tags_received.trim();
								if (tags_received.length > 0
										&& isValidTagTester(tags_received)) {
									tags_received = tags_received.trim();
									tags_input.push(tags_received);
								} else {
									isVaildTagInput = true;
								}
							}
							// tags_input = $(this).val();
						} else {
							props.push({
								name : $(this).attr('name'),
								value : $(this).val(),
								type : 'SYSTEM'
							});
						}

					}
				}
			});

	var addrCustom = {};
	var addrElems = document
			.querySelectorAll('div#_engagebay_extn_addContact ._engagebay_inp_custom.address[name]');
	$('#dashbordContent').find('._engagebay_inp_custom.address[name]').each(
			function() {
				if ($(this).val() && $(this).val().length > 0)
					addrCustom[$(this).attr('name')] = $(this).val();
			});

	if (addrCustom.addressCity || addrCustom.addressCountry) {
		var obj = {};
		if (addrCustom.addressCity)
			obj.city = addrCustom.addressCity;
		if (addrCustom.addressCountry)
			obj.country = addrCustom.addressCountry;
		props.push({
			name : 'address',
			value : JSON.stringify(obj),
			subtype : ''
		});
	}

	var contact = {};
	contact.properties = JSON.stringify(props);
	contact.type = actionMsg;
	if (tags_input.length > 0) {
		if (isVaildTagInput) {
			if (document.getElementById('err_message_ag') != null) {
				document.getElementById('err_message_ag').remove();
			}
			$("#dashbordContent123")
					.append(
							'<div id="err_message_ag" style="font-size: 11px;color: red;margin-left: 117px;margin-bottom:10px;">Tag name should start with an alphabet and cannot contain special characters other than underscore and space.</div>');
			element.removeAttr('disabled');
			return;
		}
		contact.tags = JSON.stringify(tags_input);
		// Add Source
		contact.source = 'LINKEDIN';
	} else {
		if (tags_received.length > 0 && isVaildTagInput) {
			if (document.getElementById('err_message_ag') != null) {
				document.getElementById('err_message_ag').remove();
			}
			$("#dashbordContent123")
					.append(
							'<div id="err_message_ag" style="font-size: 11px;color: red;margin-left: 117px;margin-bottom:10px;">Tag name should start with an alphabet and cannot contain special characters other than underscore and space.</div>');
			element.removeAttr('disabled');
			return;
		} else {
			contact.tags = JSON.stringify([ "linkedin" ]);
			// Add Source
			contact.source = 'LINKEDIN';
		}

	}
	contact.tagsWithTime = [];
	if ($('#dashbordContent').find('._engagebay_update_').length == 1) {
		_EB_Request_Processor("/api/browser-extension/getcontact?email="
				+ emailForm, {}, "GET", function(resp) {
			if (document.getElementById('err_message_ag') != null) {
				document.getElementById('err_message_ag').remove();
			}
			contact.id = resp.id;
			updateEngagebayContact(contact, element);

		}, function(err) {
			// console.log(err);
		});
	} else {
		if (document.getElementById('err_message_ag') != null) {
			document.getElementById('err_message_ag').remove();
		}
		createEngagebayContact(contact, element);
	}
}

function createEngagebayContact(contact, element) {

	$("#dashbordContent #message").remove();
	_EB_Request_Processor(
			"/api/browser-extension/addcontact",
			contact,
			"POST",
			function(resp) {
				var isUpdated = false;
				if (resp.updated_time > resp.created_time)
					isUpdated = true;

				if (element && element[0].getAttribute("id") == 'company_save') {
					var contactLink = 'https://'
							+ ENGAGEBAY_AUTH_USER_DATA.domain_name
							+ '.engagebay.com/#company/' + resp.id;
					$("#crm_others123")
							.append(
									'<div id="message" style="font-size: 11px;color: #02bd02;margin-left: 117px;margin-bottom:10px;">Company has been created successfully. Click <a href="'
											+ contactLink
											+ '" target="_blank" style="color: blue;">here</a> to open the company</div>');
				} else {
					var contactLink = 'https://'
							+ ENGAGEBAY_AUTH_USER_DATA.domain_name
							+ '.engagebay.com/#list/0/subscriber/' + resp.id;
					// $("#crm_others123").append('<div id="message"
					// style="font-size: 11px;color: #02bd02;margin-left:
					// 117px;margin-bottom:10px;">Contact has been created
					// successfully. Click <a href="'+contactLink+'"
					// target="_blank" style="color: blue;">here to open the
					// contact</a></div>');
					if (isUpdated) {
						$("#crm_others123")
								.append(
										'<div id="message" style="font-size: 11px;color: #02bd02;margin-left: 117px;margin-bottom:10px;">Contact has been updated successfully. Click <a href="'
												+ contactLink
												+ '" target="_blank" style="color: blue;">here</a> to open the contact</div>');
					} else {
						$("#crm_others123")
								.append(
										'<div id="message" style="font-size: 11px;color: #02bd02;margin-left: 117px;margin-bottom:10px;">Contact has been created successfully. Click <a href="'
												+ contactLink
												+ '" target="_blank" style="color: blue;">here</a> to open the contact</div>');
					}
				}
				element.removeAttr('disabled');
				return;
			},
			function(err) {
				if (err.responseText == 'Sorry, duplicate contact found with the same email address.') {
					$('#dashbordContent').find('._engagebay_save_').remove();
					$("#add_contact .linked-forms-btn")
							.append(
									'<input value="Update" style="color: #fff;background-color: #f2603e;border-color: #f2603e;text-transform: capitalize;" class="_engagebay_update_ btn btn-primary" id="contact_save">');
					$("#save_contact .linked-forms-btn")
							.append(
									'<input value="Update" style="color: #fff;background-color: #f2603e;border-color: #f2603e;text-transform: capitalize;" class="_engagebay_update_ btn btn-primary" id="contact_save">');
					$("#crm_others123")
							.append(
									'<div id="message" style="font-size: 11px;color: red;margin-left: 117px;margin-bottom:10px;">Sorry, we found another contact with the same email ID. Please update the existing contact.</div>');
					validateLNContactForm();
				} else {
					$("#crm_others123")
							.append(
									'<div id="message" style="font-size: 11px;color: red;margin-left: 117px;margin-bottom:10px;">'
											+ err.responseText + '</div>');
				}
				element.removeAttr('disabled');
				return;

			}, "application/x-www-form-urlencoded");

}

function createEngagebayContactFromForm(contact, element) {
	$("#dashbordContent #message").remove();
	_EB_Request_Processor(
			"/api/browser-extension/contact-form",
			contact,
			"POST",
			function(resp) {
				var isUpdated = false;
				if (resp.updated_time > resp.created_time)
					isUpdated = true;

				if (element && element[0].getAttribute("id") == 'company_save') {
					var contactLink = 'https://'
							+ ENGAGEBAY_AUTH_USER_DATA.domain_name
							+ '.engagebay.com/#company/' + resp.id;
					$("#crm_others123")
							.append(
									'<div id="message" style="font-size: 11px;color: #02bd02;margin-left: 117px;margin-bottom:10px;">Company has been created successfully. Click <a href="'
											+ contactLink
											+ '" target="_blank" style="color: blue;">here </a>to open the company</div>');
					element.removeAttr('disabled');
					return;
				} else {
					var contactLink = 'https://'
							+ ENGAGEBAY_AUTH_USER_DATA.domain_name
							+ '.engagebay.com/#list/0/subscriber/' + resp.id;
					// $("#crm_others123").append('<div id="message"
					// style="font-size: 11px;color: #02bd02;margin-left:
					// 117px;margin-bottom:10px;">Contact has been created
					// successfully. Click <a href="'+contactLink+'"
					// target="_blank" style="color: blue;">here to open the
					// contact</a></div>');
					if (isUpdated) {
						$("#crm_others123")
								.append(
										'<div id="message" style="font-size: 11px;color: #02bd02;margin-left: 117px;margin-bottom:10px;">Contact has been updated successfully. Click <a href="'
												+ contactLink
												+ '" target="_blank" style="color: blue;">here</a> to open the contact</div>');
					} else {
						$("#crm_others123")
								.append(
										'<div id="message" style="font-size: 11px;color: #02bd02;margin-left: 117px;margin-bottom:10px;">Contact has been created successfully. Click <a href="'
												+ contactLink
												+ '" target="_blank" style="color: blue;">here </a> to open the contact</div>');
					}
				}
				element.removeAttr('disabled');
				return;
			},
			function(err) {
				$("#crm_others123")
						.append(
								'<div id="message" style="font-size: 11px;color: red;margin-left: 117px;margin-bottom:10px;">'
										+ err.responseText + '</div>');
			}, "application/x-www-form-urlencoded");
}

function updateEngagebayContact(contact, element) {
	var isTagsUpdateAllow = false;
	var contact2 = {};
	contact2.id = contact.id;
	if (contact.tags != undefined && contact.tags.length > 0) {
		if (contact.tags[0] != 'linkedin') {
			isTagsUpdateAllow = true;
			contact2.tags = contact.tags;
		}
	}
	$("#dashbordContent #message").remove();
	_EB_Request_Processor(
			"/api/browser-extension/updatecontact",
			contact,
			"PUT",
			function(resp) {
				var contactLink = 'https://'
						+ ENGAGEBAY_AUTH_USER_DATA.domain_name
						+ '.engagebay.com/#list/0/subscriber' + resp.id;

				$("#crm_others123")
						.append(
								'<div id="message" style="font-size: 11px;color: #02bd02;margin-left: 117px;margin-bottom:10px;">Contact has been updated successfully. Click <a href="'
										+ contactLink
										+ '" target="_blank" style="color: blue;">here</a> to open the contact</div>');

			}, function(err) {

			}, "application/x-www-form-urlencoded");
	if (element) {
		element.removeAttr('disabled');
	}

}

function isValidTagTester(tag) {

	var r = '\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC';
	var regexString = '^[' + r + '][' + r + ' 0-9_-]*$';
	var is_valid = new RegExp(regexString).test(tag);
	return is_valid;
}

function validateTwitterContactForm() {
	var s = '';
	$('._enggebayio_save_').click(function(e) {
		e.preventDefault();
		s = this.id;
		onSaveTwitter('PERSON', s);
	});
}

function onSaveTwitter(actionMsg, element) {
	var formId = "#form-" + element
	var props = [];
	$(formId).find('input._engagebay_inp').each(
			function() {
				if ($(this).val()) {

					if ($(this).attr('data-subtype'))
						props.push({
							name : $(this).attr('name'),
							value : $(this).val(),
							type : 'SYSTEM',
							subtype : $(this).attr('data-subtype')
						});
					else {
						if ($(this).attr('name') == 'image'
								&& $(this).val().indexOf(
										'default_profile_images') > 0) {
						} else {
							props.push({
								name : $(this).attr('name'),
								value : $(this).val(),
								type : 'SYSTEM'
							});
						}

					}
				}
			});

	var addrCustom = {};
	var addrElems = document
			.querySelectorAll('div#_engagebay_extn_addContact ._engagebay_inp_custom.address[name]');
	$(formId).find('._engagebay_inp_custom.address[name]').each(function() {
		if ($(this).val() && $(this).val().length > 0)
			addrCustom[$(this).attr('name')] = $(this).val();
	});
	if (addrCustom.addressCity || addrCustom.addressCountry) {
		var obj = {};
		if (addrCustom.addressCity)
			obj.city = addrCustom.addressCity;
		if (addrCustom.addressCountry)
			obj.country = addrCustom.addressCountry;
		props.push({
			name : 'address',
			value : JSON.stringify(obj),
			subtype : ''
		});
	}
	var contact = {};
	contact.properties = JSON.stringify(props);
	contact.type = actionMsg;
	contact.tags = JSON.stringify([ "twitter" ]);
	// Add Twitter Source
	contact.sourc = 'TWITTER';
	contact.isFromTwitter = true;
	_EB_Request_Processor(
			"/api/browser-extension/addcontact",
			contact,
			"POST",
			function(resp) {
				$(formId).find('input[type="button"]').attr('disabled',
						'disabled');
				var contactLink = 'https://'
						+ ENGAGEBAY_AUTH_USER_DATA.domain_name
						+ '.engagebay.com/#list/0/subscriber/' + resp.id;
				$(formId)
						.append(
								'<div id="message" style="font-size: 11px;color: #02bd02;margin-left: 55px;margin-right: 19px;">Contact has been created successfully. Click <a href="'
										+ contactLink
										+ '" target="_blank" style="color: blue;">here</a> to open the contact</div>');
			},
			function(err) {
				$(formId)
						.append(
								'<div id="message" style="font-size: 11px;color: #02bd02;margin-left: 55px;margin-right: 19px;">'
										+ err.responseText + '</div>');
			}, "application/x-www-form-urlencoded");

}