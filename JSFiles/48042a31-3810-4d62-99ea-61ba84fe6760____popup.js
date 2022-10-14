'use strict';

// Copyright (c) 2013 - 2014 Booking.com. All rights reserved.
(function(window, document, $, B, settings, undefined) {
	var xyClient = new window.B.XY.Client(),
		extensionAPI = new window.GeExtensionAPI(),
		tracking = new window.Tracking(extensionAPI),
		errorMessages,
		parsedTemplates = {},
		chrome = window.chrome;
		config = window.config;

	window.GeniusExtension = {
		updated: false,
		localData: {},
		init: function(opts) {
			var userIsLoggedIn,
				$contentWrapper = $('#wrapper'),
				extensionContext = this,
				currentData = extensionAPI.getExtensionData(),
				templateName = 'container.html',
				updateTimeout,
				promise = $.Deferred();

			// Set the language and the direction
			$('html')
				.attr('dir', chrome.i18n.getMessage('@@bidi_dir'))
				.attr('lang', extensionAPI.getUserLanguageForURL());

			this.localData = currentData;

			errorMessages = this.loadTranslations('errorMessages');

			// Store whether user is logged in or not (meaning we have the user key and token in localStorage)			
			userIsLoggedIn = !!( currentData.loginStatus && currentData.loginStatus.key );

			$(window).bind('message', function(event) {
				var originalPostMessageEvent = event.originalEvent,
					parsedTemplate;

				if (!(originalPostMessageEvent.data && (originalPostMessageEvent.data.parsedTemplate || originalPostMessageEvent.data.name))) return;

				// Listen to postbacks from the IFRAME
				if (originalPostMessageEvent.data.name) {
					switch (originalPostMessageEvent.data.name) {
						case 'setWindowHeight':
							extensionContext.resizeForgottenPasswordIframe(originalPostMessageEvent.data.windowHeight);
							break;
						case 'closeIframe':
							extensionContext.closeForgottenPasswordIframe();
							break;
						case 'showLoadingOverlay':
							extensionContext.showLoadingOverlay();
							break;
					}
					return;
				}

				parsedTemplate = originalPostMessageEvent.data.parsedTemplate;

				if( typeof( parsedTemplates[originalPostMessageEvent.data.id] ) === 'function' ) {
					parsedTemplates[originalPostMessageEvent.data.id].apply(extensionContext, new Array(parsedTemplate) );
					delete parsedTemplates[originalPostMessageEvent.data.id];
				}
			});

			promise.then( function(content) {
				var context = extensionContext.loadTranslations(templateName);

				extensionContext.parseTemplate(content, context, function(parsedTemplate) {
					// Update main content wrapper with most updated template stored in local storage
					extensionContext.updateTemplate(parsedTemplate, '#wrapper', true);
					// Set up listeners for form interaction
					extensionContext.registerEvents();

					if( userIsLoggedIn ) {

						if(window.exps) {
							B.track.exp(0);
						}

						if( currentData.userNotifications && currentData.userNotifications.notifications ) {

							extensionAPI.processNotifications( currentData.userNotifications.notifications );
							// Get updated version of data
							currentData = extensionAPI.getExtensionData();

							//Fixed Dismiss Experiment
							if(B.track.getVariant(4)) {
								currentData = extensionAPI.hackishRemoveDismissed(currentData);
							}

							extensionContext.updateNotificationsTemplate(currentData.userNotifications.notifications);
						}

						extensionContext.performWebsiteAuth();
						$('.panel-auth').removeClass('active');

						// Get and show user notifications
						extensionAPI.updateNotifications({
							successCallback: extensionContext.updateNotificationsTemplate.bind(extensionContext),
							errorCallback: function(err) {

								if( err && err.responseJSON && err.responseJSON.errors && err.responseJSON.errors[0] && err.responseJSON.errors[0].code ) {
									if( err.responseJSON.errors[0].code === 'user_token_authenticate_failed' ) {
										// If authentication fails we kick the user out and ask for re logging in
										extensionContext.logout();
										extensionContext.showErrorMessages( errorMessages.errorAuthSigninAgain );
										tracking.trackEvent(config.analytics.categories.ERROR, 'sign_out', 'signin_again');
									}
								}
							}
						});

						extensionContext.showSearchTabFirst();
					} else {
						var $inputAddons = $('.input-group-addon');
						var minWidth = 0;

						$inputAddons.each(function(){
							if ($(this).outerWidth() > minWidth) {
								minWidth = $(this).outerWidth();
							}
						});

						$inputAddons.each(function(){
							$(this).css('minWidth', minWidth);
						});
					}
				});
			});

			extensionContext.loadLocalTemplate('./templates/' + templateName, promise);

			// Update the icon (and badge) when the user presses the button
			extensionAPI.updateIcon();
		},

		showSearchTabFirst: function() {
			B.track.exp(5); // exp: lp_browser_extension_search_tab_first

			if( B.track.getVariant(5) ) {
				var $notificationTab = $('#main-tabs').find('.tab-notifications');
				var $searchTab = $('#main-tabs').find('.tab-search');
				$notificationTab.removeClass('pull-left').addClass('pull-right');
				$searchTab.removeClass('pull-right').addClass('pull-left').click();
			}
		},

		loadTranslations: function(templateName) {

			var translations = {},
				currentTranslationKey,
				translationsKeys,
				config = extensionAPI.loadConfig(),
				extensionContext = this;

			if( templateName && config.templateTranslations[templateName] && $.isArray(config.templateTranslations[templateName]) ) {

				translationsKeys = config.templateTranslations[templateName];

				// Load by default error messages in all templates
				if( templateName !== 'errorMessages' ) {
					translationsKeys = translationsKeys.concat( config.templateTranslations['errorMessages'] );
				}

				for( var i = 0, l = translationsKeys.length; i < l; i++ ) {
					currentTranslationKey = translationsKeys[i];
					translations[currentTranslationKey] = chrome.i18n.getMessage(currentTranslationKey);

					if (config.templateTranslations.dynamicMessages.hasOwnProperty(currentTranslationKey)) {
						var placeholderValues = [];

						if (Array.isArray(config.templateTranslations.dynamicMessages[currentTranslationKey])) {
							var placeholderArray = config.templateTranslations.dynamicMessages[currentTranslationKey];

							// Parse the placeholder array; teoretically, most of the times it will be only one placeholder
							// but you could have man, depending on the string you use
							for (var placeholderItem in placeholderArray) {
								var placeholder = placeholderArray[placeholderItem];

								for (var keys in placeholder) {
									if (placeholder.hasOwnProperty(keys)) {
										if (typeof extensionContext[placeholder[keys]] === 'function') {
											placeholderValues.push((extensionContext[placeholder[keys]])());

										}
									}
								}
							}
						} else if (typeof config.templateTranslations.dynamicMessages[currentTranslationKey] === 'object') {
							var placeholder = config.templateTranslations.dynamicMessages[currentTranslationKey];

							for (var keys in placeholder) {
								if (placeholder.hasOwnProperty(keys)) {
									if (typeof extensionContext[placeholder[keys]] === 'function') {
										placeholderValues.push((extensionContext[placeholder[keys]])());

									}
								}
							}
						}

						translations[currentTranslationKey] = chrome.i18n.getMessage(currentTranslationKey, placeholderValues);
					} else {
						translations[currentTranslationKey] = chrome.i18n.getMessage(currentTranslationKey);
					}
				}
			}
			return translations;

		},

		logout: function() {
			extensionAPI.removeExtensionData();
			this.init();
			extensionAPI.updateIcon();
		},

		loadLocalTemplate: function(name, promise) {
			var data;

			if(!name) return;

			data = this.localData = extensionAPI.getExtensionData();

			if(data && data.templates && data.templates[name]) {
				promise.resolve(data.templates[url]);
			} else {
				// Otherwise, if no local storage, load the default template (default_template_content)
				$.ajax({
					url: '/' + name
				}).then(
					// Success callback
					function(content) {
						promise.resolve(content);
					},
					// Error callback, should never happen since file is in file system
					function() {}
				);
			}
		},

		parseTemplate: function(templateSource, context, callback ) {

			var iframe = document.getElementById('template_parser_sandbox'),
				extensionContext = this,
				callbackArgs,
				message,
				fn,
				id = "" + parseInt( Math.random() * 1000000, 10 );

				if( typeof(callback) === 'function' ) {
					fn = callback;
				}
				/* Originally I tried to create a Promise with jQuery deferred, and make the iframe resolve it when the template was parsed
				 * The resolved method would be defined here, so we would avoid having to defined event handlers for postMessage here
				 * Unfortunately, the jQuery Deferred cannot be sent in the message, so old school event callback
				*/

			if(iframe) {

				// Synchronise the events returned by parsing of templates by keeping track of the callbacks in an object
				if( fn ) {
					parsedTemplates[id] = fn;
				}

				message = {
					templateSource: templateSource,
					context: context,
					id: id
				};

				iframe.contentWindow.postMessage(message, '*');
			}
		},

		updateTemplate: function(data, selector, isPureHtml, isAppend) {
			if (selector === false) {
				return data;
			}

			if (selector.jQuery) {
				if (isAppend === true) {
					selector.append(data);
				} else {
					selector.html(data);
				}
			} else {
				var $target = $(selector);

				if( $target.length ) {
					if( isPureHtml ) {
						if (isAppend === true) {
							$target.append(data);
						} else {
							$target.html(data);
						}
					}
				}
			}
		},

		getGuestCount: function() {
			var $checkinAdults = $('#checkinAdults'),
				$checkinChildren = $('#checkinChildren'),
				guestCount = 0;

			// Calculate the number of quests (adults + children)
			guestCount = (isNaN(parseInt($checkinAdults.val())) ? 0 : parseInt($checkinAdults.val())) + (isNaN(parseInt($checkinChildren.val())) ? 0 : parseInt($checkinChildren.val()));

			return guestCount;
		},

		updateGuestCount: function(countValue) {
			var $badgeCount = $('#edit-guest-details').find('.guests');

			// Update the data-* attribute; it seems it doesn't work as expected with $.data()
			if (typeof countValue === 'number') {
				$badgeCount.attr('data-guests', countValue);
			} else {
				$badgeCount.attr('data-guests', 0);
			}			
		},

		searchWithAutocomplete: function(formElement) {
			var searchQuery = '',
				config = extensionAPI.loadConfig(),
				searchUrl = config.searchUrl;

			// Construct the query
			searchQuery = $(formElement).serialize();
			searchUrl = searchUrl + '?' + searchQuery;

			// Open the generated URL in a new tab and activate it
			chrome.tabs.create({
				url: searchUrl,
				active: true
			});
		},

		searchWithDisambiguation: function() {


			/*


			MISSING

			 - Error msg no destinations











			*/

			var destination = $('#destination').val(),
					extensionContext = this,
					searchQuery = $('.form-search :input[value!=""]').serialize(),
					searchUrl = config.searchUrl + '?' + searchQuery;

			extensionContext.showLoadingOverlay();

			var successCallback = function(response) {
				var thread,
					destinations,
					item,
					i,l;

				/*
				http://www.booking.com/searchresults.html?

				src=index

				ss=New+York%2C+New+York+State%2C+U.S.A.

				checkin_monthday=17
				checkin_year_month=20141

				checkout_monthday=18
				checkout_year_month=20141

				interval_of_time=any

				flex_checkin_year_month=any

				sb_predefined_group_options_value=2

				no_rooms=1

				group_adults=2
				group_children=0

				dest_type=city
				dest_id=20088325
				*/

				extensionContext.hideLoadingOverlay();

				// Process only if we have the right structure and information
				if (response && (typeof response === 'object') && response.hasOwnProperty('disambiguation')) {

					thread = response['disambiguation'];

					extensionContext.hideErrorMessages();

					if ( thread && thread['%search_disamb%'] && $.isArray( thread['%search_disamb%'] ) && thread['%search_disamb%'].length ) {
						/*// Get unique destination types
						destinationTypes = $.map(thread['%search%'], function(item, index){
								return item.type;
						});
						destinationTypes = $.unique(destinationTypes);

						// Partition results
						$.each(destinationTypes, function(indexDestinationType, value){
								var partitionItems = [],
										partition = {};

								$.map(thread['%search%'], function(item, indexDestination){
										if (item.type === value) {

												// TODO Set the correct action label (needs translations)
												if (item.type === 'hotel') {
														item.actionLabel = chrome.i18n.getMessage('disambiguationMoreInformationButton');
												} else {
														item.actionLabel = chrome.i18n.getMessage('disambiguationShowPropertiesButton');
												}

												item.actionURL = searchUrl + ';dest_type=' + ( item.type === 'ufi' ? 'city' : item.type ) + ';dest_id=' + item.id;

												partitionItems.push(item);
										}
								});

								partition.name =  chrome.i18n.getMessage('disambiguationDestinationType_' + value);
								partition.items = partitionItems;

								partitionedDestinations.push(partition);
						});*/

						destinations = thread['%search_disamb%'];

						for( i = 0, l = destinations.length; i < l; i++) {

							item = destinations[i];

							if (item.type === 'hotel') {
								item.actionLabel = chrome.i18n.getMessage('disambiguationMoreInformationButton');
							} else {
								item.actionLabel = chrome.i18n.getMessage('disambiguationShowPropertiesButton');
							}

							item.actionURL = searchUrl + ';dest_type=' + ( item.type === 'ufi' ? 'city' : item.type ) + ';dest_id=' + item.id;

						}

						extensionContext.disambiguationResults( destinations );
					} else {
						extensionContext.showErrorMessages( errorMessages.errorNoDestinationsFound );
					}
				}

			};

			var errorCallback = function(response) {
				var currentError,
					shownError,
					error;

				extensionContext.hideLoadingOverlay();

				if( response && response.responseJSON && response.responseJSON.errors && response.responseJSON.errors[0] ) {
					error = response.responseJSON.errors[0].text;
					if( this.localData.errorMessages && this.localData.errorMessages[error] ) {
							shownError = this.localData.errorMessages[error];
					} else if( config.errorMessages && config.errorMessages[error] ) {
							shownError = config.errorMessages[error];
					}

					if(shownError) {
						this.showErrorMessages(new Array(shownError));
					}
				}
			};

			xyClient.init ( {
					url: config.XYUrl,
					username: config.extensionAuthentication.key,
					password: config.extensionAuthentication.secret
			} );
			xyClient.thread('disambiguation');


			//xyClient.cmd('language','%language%','fr',function(){}, function(){});

			xyClient.search('%search_disamb%',{
				"domain" : "anything",
				"search" : {
						"disambiguation" : {
								"string" : destination,
								"language": config.languageLocale
						}
				},
				"sort": ["elastic_search_score", "dest_type", {"collation": "alphanumeric"}],
				"objects" : {
						"dataset": "hashes",
						"id": {"to": "dest_id"},
						"type": {"to": "dest_type"},
						"name": {"to": "name"},
						"name_name": {"to": "name_name"},
						"region": {"to": "name_region"},
						"properties": {"to": "nr_hotels"},
						"countryCode": {"to": "cc1"},
						"countryName": {"to": "name_country"},
						"imageURL": {"to":"main_photo_url", "image_format":"square64"},
						"destinationURL": {"to":"dest_url", "host_url": "http://www.booking.com", "language": config.languageLocale}

				}
			}, successCallback, errorCallback);

			xyClient.go();
		},

		disambiguationResults: function(destinations) {
			var promise = $.Deferred(),
					extensionContext = this;

			this.loadLocalTemplate('./templates/disambiguation.html', promise);
			promise.then( function(templateContent) {

					// Declare working variables
					var $citiesContainer = $("#main-content").find('.list-disambiguation');

					// Construct the HTML string
					extensionContext.parseTemplate(templateContent, {destinations: destinations}, function(citiesHTML) {
							// Add the cities to the list (replaces the previous content)
							$('.form-search').fadeOut('200', function(){
									$citiesContainer.append(citiesHTML);

									// Show the Search again bubutton
									$('.search-again').removeClass('hidden');
									$('.btn-divider').removeClass('hidden');
							});

					});
			});

		},

		initAvatar: function(tabName) {
			var promise = $.Deferred(),
				templateName = 'user-avatar.html',
				templatePath = './templates/' + templateName,
				extensionContext = this,
				context = extensionContext.loadTranslations(templateName),
				panelID,
				placeholderSelector;

			this.loadLocalTemplate(templatePath, promise);

			if (tabName === 'tab_notifications') {
				panelID = '#panel-notifications';
				placeholderSelector = '.avatar-placeholder-notifications';
			} else {
				panelID = '#panel-search';
				placeholderSelector = '.avatar-placeholder-search';
			}

			promise.then(function (templateContent) {
				// Declare working variables
				var $travelPartiesContainer = $(panelID).find(placeholderSelector),
					extensionData = extensionAPI.getExtensionData(),
					travelParties = {};

				// Enrich container context
				if (extensionContext.isUsernameAvailable()) {
					context.isUsernameAvailable = true;
				} else {
					context.isUsernameAvailable = false;
				}

				// Add Genius Logo EXP
				if (extensionContext.isGeniusUser()) {
					context.isGeniusUser = true;
					context.genuisImgUrl = config.imagesFolder + '/icons/genius.png';
				} else {
					context.isGeniusUser = false;
				}

				// Enrich container context
				if (extensionContext.isUserAvatarAvailable()) {
					context.isUserAvatarAvailable = true;
					context.imageURL = extensionContext.getUserAvatar();
				} else {
					context.isUserAvatarAvailable = false;
				}

				// Construct the HTML string
				extensionContext.parseTemplate(templateContent, context, function(parsedTemplate) {
					// Add the cities to the list (replaces the previous content)
					extensionContext.updateTemplate(parsedTemplate, placeholderSelector, true);
					//extensionContext.handleTravelParties();

					$('.user-avatar').tooltip({
						html: true
					});
				});
			});
		},

		initTravelParties: function( parties ) {
			var promise = $.Deferred(),
				templateName = 'travel-parties.html',
				templatePath = './templates/' + templateName,
				extensionContext = this,
				context = extensionContext.loadTranslations(templateName);

			this.loadLocalTemplate(templatePath, promise);
			
			promise.then( function( templateContent ) {
				// Declare working variables
				var $travelPartiesContainer = $("#guests-container").find('.checkin-guests-summary'),
					extensionData = extensionAPI.getExtensionData(),
					travelParties = {};

				if( extensionData.userPreferences && extensionData.userPreferences.travelParties ) {
					context.travelParties = extensionData.userPreferences.travelParties;
				}

				// Construct the HTML string
				extensionContext.parseTemplate(templateContent, context, function(parsedTemplate) {
					// Add the cities to the list (replaces the previous content)
					extensionContext.updateTemplate(parsedTemplate, '.checkin-guests-summary', true);
					extensionContext.handleTravelParties();
				});
			});
		},

		initCheckinDetails: function() {
			var $checkinRooms = $('#checkinRooms'),
				$checkinAdults = $('#checkinAdults'),
				$checkinChildren = $('#checkinChildren');

			var checkinRoomsHTML = '',
				checkinAdultsHTML = '',
				checkinChildrenHTML = '<option value="0" selected="selected">0</option>';

			for (var i = 1; i <= 30; i++) {
				if (i <= 10) {
					checkinAdultsHTML += '<option value="' + i + '"' + (i == 2 ? ' selected="selected"' : '') +'>' + i + '</option>';
					checkinChildrenHTML += '<option value="' + i + '">' + i + '</option>';
				}
				checkinRoomsHTML += '<option value="' + i + '"' + (i == 1 ? ' selected="selected"' : '') +'>' + i + '</option>';
			}

			$checkinRooms.html(checkinRoomsHTML);
			$checkinAdults.html(checkinAdultsHTML);
			$checkinChildren.html(checkinChildrenHTML);
		},

		handleTravelParties: function() {
			var extensionContext = this,
				$travelParties = $('#predefinedGroups'),
				$checkinRooms = $('#checkinRooms'),
				$checkinAdults = $('#checkinAdults'),
				$checkinChildren = $('#checkinChildren'),
				$checkinDetails = $('#guests-container').find('.checkin-guests-overview'),
				$childrenDetails = $('#guests-container').find('.checkin-children-details'),
				customGroup;

			$travelParties.on('change', function(event){
				var $this = $(this);

				$('#travel_party_input').remove();

				switch($travelParties.val()) {

					case '2':

						$checkinRooms.val(1);
						$checkinAdults.val(2);
						$checkinChildren.val(0);
						$checkinDetails.addClass('hidden');
						$childrenDetails.addClass('hidden');
						break;

					case '1':

						$checkinRooms.val(1);
						$checkinAdults.val(1);
						$checkinChildren.val(0);
						$checkinDetails.addClass('hidden');
						$childrenDetails.addClass('hidden');
						break;

					case 'custom-option':

						customGroup = $( 'option:selected', $this ).data('group');
						$checkinRooms.val( 1 );
						$checkinAdults.val( customGroup.number_adults );
						$checkinChildren.val( customGroup.number_children );
						$checkinDetails.removeClass('hidden').append('<input type="hidden" id="travel_party_input" name="travel_party" value="' + customGroup.party_id + '" />');
						break;

					default:

						$checkinRooms.val(1);
						$checkinAdults.val(2);
						$checkinChildren.val(0);
						$checkinDetails.removeClass('hidden');
						break;
				}

				// Update the HTML for children and number of guests
				extensionContext.updateChildrenHTML();
				extensionContext.updateGuestCount(extensionContext.getGuestCount());
			});
		},

		handleCheckinDetails: function() {
			var extensionContext = this,
				$checkinRooms = $('#checkinRooms'),
				$checkinAdults = $('#checkinAdults'),
				$checkinChildren = $('#checkinChildren');

			$('#checkinAdults,#checkinChildren').on('change', function(event){
				extensionContext.updateGuestCount(extensionContext.getGuestCount());
			});

			// Recalculate the number of guests
			$checkinRooms.on('change', function(event){
				var guests = $(this).val(),
					selectedAdults = $checkinAdults.val(),
					checkinAdultsHTML = '';

				// Build the HTML for Adults attempting to preserve the previously stored value for Adults
				for (var i = 1; i <= (guests * 10); i++) {
					checkinAdultsHTML += '<option value="' + i + '"' + (i == selectedAdults ? ' selected="selected"' : '') +'>' + i + '</option>';
				}

				// Reset the HTML
				$checkinAdults.html(checkinAdultsHTML);

				// Recalculate the number of guests (usually, it applies only if the selected value doesn't exist in the list anymore)
				extensionContext.updateGuestCount(extensionContext.getGuestCount());
			});

			$checkinChildren.on('change', function(event){
				extensionContext.updateChildrenHTML();
			});

			$('#edit-guest-details').on('click', function(){
				var $guestsContainer = $('#guests-container');

				$guestsContainer.animate({
					height: 'toggle'
				}, 200, function(){
					$(this).toggleClass('hidden');
				});

				if (!$guestsContainer.is(':visible')) {
					tracking.trackEvent(config.analytics.categories.CLICK, 'guests_overview');
				}
			});
		},

		updateChildrenHTML: function() {
			var $travelParties = $('#predefinedGroups'),
				$checkinChildren = $('#checkinChildren'),
				$childrenAges = $('#guests-container').find('.checkin-children-ages'),
				$childrenDetails = $('#guests-container').find('.checkin-children-details'),
				childrenCount = $checkinChildren.val(),
				childrenAgesHTML = '',
				customChildrenAges,
				currentAge;


			if( $travelParties.val() === 'custom-option' ) {
				customChildrenAges = $( 'option:selected', $travelParties ).data('group');
				customChildrenAges = customChildrenAges.children_info;
			}

			if (childrenCount > 0) {
				var promise = $.Deferred(),
					templateName = 'children-age.html',
					templatePath = './templates/' + templateName,
					extensionContext = this,
					context = extensionContext.loadTranslations(templateName);

				this.loadLocalTemplate(templatePath, promise);

				promise.then( function( templateContent ) {
					// Declare working variables
					var $travelPartiesContainer = $("#guests-container").find('.checkin-guests-summary'),
						extensionData = extensionAPI.getExtensionData(),
						travelParties = {},
						callback;

					$childrenAges.html('');

					callback = function(parsedTemplate) {
						// Add the cities to the list (replaces the previous content)
						extensionContext.updateTemplate(parsedTemplate, $childrenAges, true, true);
					}

					for (var i = 0; i < childrenCount; i++) {
						if( customChildrenAges && customChildrenAges[i] && customChildrenAges[i].age ) {
							currentAge = customChildrenAges[i].age;
						} else {
							currentAge = '';
						}

						context.value = currentAge;

						// Construct the HTML string
						extensionContext.parseTemplate(templateContent, context, callback);
					}

					$childrenDetails.removeClass('hidden');
				});
			} else {
				$childrenAges.html('');
				$childrenDetails.addClass('hidden');
			}
		},

		registerEvents: function() {
			var extensionContext = this,
				config = extensionAPI.loadConfig(),
				calendarVisible = false,
				calendarVisibleName = '';

			this.initAvatar('tab_notifications');
			this.initAvatar('tab_search');

			if (extensionAPI.isUserSignedIn() && !extensionContext.isValidUserEmail()) {
				var shownError = errorMessages['errorAuthUnconfirmedEmail'];

				extensionContext.showErrorMessages(shownError);
				tracking.trackEvent(config.analytics.categories.ERROR, 'sign_in', 'unverified_email');
			}

			this.initTravelParties({});
			this.initCheckinDetails();
			this.handleCheckinDetails();

			// Detach all the handlers for document before reattaching
			// Prevents multiple calls for tracking and other events
			$(document).off();

			// Change the scroll shadow opacity on scroll
			$(document).on('scroll', function(){
				var documentHeight = $(this).height(),
					scrollTop = $(this).scrollTop(),
					scrollThreshold = documentHeight / 10,
					currentScrollDistance = scrollTop / scrollThreshold,
					opacity = 0;

				if (scrollTop < scrollThreshold) {
					opacity = currentScrollDistance;
				} else {
					opacity = 1;
				}

				$('.scroll-gradient-notifications').css('opacity', opacity);
			});

			// Display tht proper panel on tab click
			$('#main-tabs').find('.tab').off().on('click', function () {
				var $this = $(this);

				if (extensionAPI.isUserSignedIn() && extensionContext.isValidUserEmail()) {
					extensionContext.hideErrorMessages();
				}

				$this.addClass('active')
					.append(config.itemIndicator)
					.siblings().removeClass('active')
					.find('span.arrow').remove();

				$('#main-content').find('.panel')
					.removeClass('active')
					.filter("." + $this.data('panel'))
						.addClass('active');
			});

			$(document).on('click', '[data-tracking="true"]', function(event){
				var $this = $(this);

				tracking.trackEvent(config.analytics.categories.CLICK, $this.data('trackingAction'), tracking.extractDataAttributes($this));
			});

			$(document).on('submit', '.form-authenticate', function(event){
				var $this = $(this),
					credentials,
					validationResult,
					callbacks = {},
					isXYLogin;

				

				callbacks.authenticationCallbacks = {
					successCallback: function(response) {
						var currentData = extensionAPI.getExtensionData(),
							responseData;

						this.localData = currentData;

						if( response && response.main && response.main['%login%'] ) {

							responseData = response.main['%login%'];
							currentData.loginStatus = {
								key: responseData.key,
								token: responseData.token
							};

						}

						extensionAPI.setExtensionData(currentData);

						extensionContext.performWebsiteAuth();
						extensionContext.hideErrorMessages();

						tracking.trackEvent(config.analytics.categories.AUTHENTICATION, 'authentication_form');
					},

					errorCallback: function(response) {
						var errorCode,
							shownError;
						
						if( response && response.responseJSON && response.responseJSON.errors && response.responseJSON.errors[0] ) {

							errorCode = response.responseJSON.errors[0].code;

							if( errorCode === "validation_failure" ) {
								shownError = errorMessages['errorAuthSigninAgain'];
								tracking.trackEvent(config.analytics.categories.ERROR, 'sign_in', 'credentials_invalid');
							} else if( errorCode === 'user_token_login_failed' ) {
								shownError = errorMessages['errorAuthSigninAgain'];
								tracking.trackEvent(config.analytics.categories.ERROR, 'sign_in', 'credentials_invalid');
							}

							if(shownError) {
								extensionContext.showErrorMessages( shownError );
							}

							extensionAPI.clearFirstRun();
						}
						
						extensionContext.hideLoadingOverlay();

					}
				};

				callbacks.notificationsCallbacks = {
					successCallback: function(data) {
						extensionContext.updateNotificationsTemplate.call(extensionContext, data);
						extensionContext.initTravelParties({});

						extensionContext.initAvatar('tab_notifications');
						extensionContext.initAvatar('tab_search');

						if (!extensionContext.isValidUserEmail()) {
							var shownError = errorMessages['errorAuthUnconfirmedEmail'];

							extensionContext.showErrorMessages(shownError);
							tracking.trackEvent(config.analytics.categories.ERROR, 'sign_in', 'unverified_email');
						}
					}
				};

				validationResult = B.formValidator.validate(this);

				isXYLogin = ( $this.find('#input_xy_token').val() && $this.find('#input_xy_secret').val() );

				if( isXYLogin ) {

					// Clear auth inputs since they are not necessary anymore
					$this.find('#form-email').val( '' );
					$this.find('#form-password').val( '' );

				} else if( validationResult.valid ) {

					extensionContext.showLoadingOverlay();

					credentials = {
						email: $this.find('#form-email').val(),
						password: $this.find('#form-password').val()
					};

					extensionAPI.authenticateUser( credentials, callbacks );
					event.preventDefault();

				} else {

					event.preventDefault();
					extensionContext.showErrorMessages(validationResult.errors);
					tracking.trackErrors(validationResult.tracking);

				}

			});

			$(document).on('submit', '.form-search', function( event ){
				var $this = $(this),
					destination = $this.find('#destination'),
					autocompleteSelected = destination.data('autocompleteSelected'),
					validationResult,
					$guestDetails,
					$checkinRooms,
					$checkinAdults,
					$checkinChildren,
					$checkinChildrenAges,
					lengthOfStay,
					destinationId,
					destinationType,
					searchTracking;

				event.preventDefault();

				if( $('#autocomplete-results').is(':visible') ) return;

				validationResult = B.formValidator.validate(this);

				if (validationResult.valid) {

					extensionContext.hideErrorMessages();
					
					$guestDetails = $('#predefinedGroups');
					$checkinRooms = $('#checkinRooms');
					$checkinAdults = $('#checkinAdults');
					$checkinChildren = $('#checkinChildren');
					$checkinChildrenAges = $('#search-panel').find('.input-age');
					lengthOfStay = $('#lengthOfStay').val();
					destinationId = $('#destinationId').val();
					destinationType = $('#destinationType').val();


					searchTracking = tracking.buildPartialSearchTracking($guestDetails.val(), $checkinRooms.val(), $checkinAdults.val(), $checkinChildren.val(), $checkinChildrenAges);

					// Add the length of stay
					if (typeof lengthOfStay !== 'undefined') {
						searchTracking['lengthOfStay'] = lengthOfStay;
					}

					// Add the destination ID and type
					if (typeof destinationId !== 'undefined' && typeof destinationType !== 'undefined') {
						searchTracking['ufiTypeID'] = destinationType + ':' + destinationId;
					}

					if (autocompleteSelected) {
						

						// Track the event
						tracking.trackEvent(config.analytics.categories.SEARCH_AUTOCOMPLETE, searchTracking['action'], searchTracking);

						// Finally, search
						extensionContext.searchWithAutocomplete($this);
					} else {

						// Track the event
						tracking.trackEvent(config.analytics.categories.SEARCH_DISAMBIGUATION, searchTracking['action'], searchTracking);

						// Finally, search
						extensionContext.searchWithDisambiguation($this);

					}
				} else {
					extensionContext.showErrorMessages(validationResult.errors);
					tracking.trackErrors(validationResult.tracking);
				}
			});

			$('#destination').LightAutocomplete({
				url: config.rootURL + '/autocomplete',
				min_length: 2,
				delay: 250,
				supportKeyNavigation: 1,
				keepFocusUponSelection: 1,
				params: {
					lang: 'en',
					aid: config.affiliateID,
					should_split: 0,
					sort_nr_destinations: 1
				}
			}, config, extensionAPI, xyClient );

			$('.form-control').on('focus', function(event){
				var $this = $(this);
				$this.siblings('.input-group-addon').addClass('active');
			});

			$('.form-control').on('blur', function(event){
				var $this = $(this);
				$this.siblings('.input-group-addon').removeClass('active');
			});

			$( "#calCheckIn" ).datepicker({
				firstDay: 1,
				dateFormat: 'yy-mm-dd',
				navigationAsDateFormat: true,
				minDate: new Date(),
				maxDate: '+1y',
				onSelect: function(dateText, instance) {
					var newDate = $(this).datepicker('getDate');

					calendarVisible = false;
					$(this).fadeOut('200', function(){
						$(this).parent().addClass('remove-spacing');	
					});

					$('#checkinMonthDay').val(instance.selectedDay);
					$('#checkinYear').val(instance.selectedYear + '-' + (instance.selectedMonth + 1));
					
					if (newDate) {
						newDate.setDate(newDate.getDate() + 1);
					}
					
					$('#calCheckOut').datepicker('option', 'minDate', newDate);
					$('#calCheckOut').datepicker('setDate', newDate);

					var $checkoutDate = $("#calCheckOut").datepicker('getDate');
					$('#checkoutMonthDay').val($checkoutDate.getDate());
					$('#checkoutYear').val($checkoutDate.getFullYear() + '-' + ($checkoutDate.getMonth() + 1));

					// Recalculate the length of stay
					$('#lengthOfStay').val(extensionContext.dateDiff($(this).datepicker('getDate'), $checkoutDate));

					// Render the date
					$("#date-checkin").val(extensionContext.renderDate($(this).datepicker('getDate')));
					$("#date-checkout").val(extensionContext.renderDate($("#calCheckOut").datepicker('getDate')));
				}
			});

			// Get initialized variables for check-in date
			var $checkinDate = $("#calCheckIn").datepicker('getDate');
			$('#checkinMonthDay').val($checkinDate.getDate());
			$('#checkinYear').val($checkinDate.getFullYear() + '-' + ($checkinDate.getMonth() + 1));

			$( "#calCheckOut" ).datepicker({
				firstDay: 1,
				dateFormat: 'yy-mm-dd',
				navigationAsDateFormat: true,
				minDate: new Date(),
				maxDate: '+1y',
				defaultDate: '+1d',
				onSelect: function(dateText, instance) {
					calendarVisible = false;
					$(this).fadeOut(300);

					var $checkinDate = $("#calCheckIn").datepicker('getDate');

					$('#checkoutMonthDay').val(instance.selectedDay);
					$('#checkoutYear').val(instance.selectedYear + '-' + (instance.selectedMonth + 1));

					// Recalculate the length of stay
					var lengthOfStay = extensionContext.dateDiff($checkinDate, $(this).datepicker('getDate'));
					$('#lengthOfStay').val(lengthOfStay);

					// Render the date
					$("#date-checkout").val(extensionContext.renderDate($(this).datepicker('getDate')));
				}
			});

			// Get initialized variables for check-out date
			var $checkoutDate = $("#calCheckOut").datepicker('getDate');
			$('#checkoutMonthDay').val($checkoutDate.getDate());
			$('#checkoutYear').val($checkoutDate.getFullYear() + '-' + ($checkoutDate.getMonth() + 1));

			$("#date-checkin").val(extensionContext.renderDate($("#calCheckIn").datepicker('getDate')));
			$("#date-checkout").val(extensionContext.renderDate($("#calCheckOut").datepicker('getDate')));

			// Hide the calendars
			$('#calCheckIn,#calCheckOut').hide();

			// Initialize length of stay
			$('#lengthOfStay').val(extensionContext.dateDiff($checkinDate, $checkoutDate));

			$('.input-date,#calendar-container').on('click', function(){
				event.stopPropagation();
			});

			// Show the calendar when the user focuses the date fields
			$('.input-date').on('click', function(event) {
				var $this = $(this);
				var $calendarContainer = $('#calendar-container');

				var $calendar = $('#' + $this.data('calendar'));

				if (calendarVisible) {
					if (calendarVisibleName === $this.data('calendar')) {
						$calendar.hide();
						calendarVisible = false;
					} else {
						$calendar.fadeIn(300, function(){
							calendarVisible = true;
							calendarVisibleName = $this.data('calendar');
						}).siblings().hide();
					}
				} else {
					$calendar.fadeIn(300, function(){
						calendarVisibleName = $this.data('calendar');
						calendarVisible = true;
					}).siblings().hide();
				}
			});

			// Prevent the calendar from hiding when the user changes the focus
			$('.input-date').on('blur', function(event) {
				event.preventDefault();
				return false;
			});

			// Hide the calendar if clicked outside
			$('html').on('click', function(){
				$('.calendar').fadeOut(300);
				calendarVisible = false;
				calendarVisibleName = '';
			});

			$('#destination').on('blur', function(event){
				if ($('#autocomplete-results').is(':not(:visible)')) {
					$(this).removeClass('has-autocomplete');
				}
			});

			$(document).on('click', '.search-again', function() {
				var $searchPanel = $('#search-panel'),
					$destination = $('#destination'),
					$this = $(this);

				// Show the search form
				$searchPanel.find('.form-search').fadeIn(300);

				// Focus the destination field for convenience
				$destination.val('').focus();

				// Empty list
				$('.list-disambiguation').find('.list-destinations').hide().html('');

				// Hide the Search again link and the button divider
				$this.addClass('hidden').siblings('.btn-divider').addClass('hidden');
			});

			$(document)
				.on('click', '.extension-user-logout', function() {
					extensionContext.logout();
				})
				.on('click', '.forgotten-password', function(event) {
					var $html = $('html').first(),
						$iframe = $('#iframe-forgotten-password').first();

					event.preventDefault();

					// Add loading mask and change the background color to mask IFRAME artifacts
					extensionContext.showLoadingOverlay();
					$html.addClass('only-iframe');

					// Get the IFRAME height on loading
					$iframe.on('load', function(){
						var message = {
							command: 'getWindowHeight'
						};

						$iframe[0].contentWindow.postMessage(message, '*');
					});

					$iframe.attr('src', config.forgottenPasswordInlineURL + '&lang=' + extensionAPI.getUserLanguageForURL());
				})
				.on('click', '.dismiss-notification', function() {
					var id = this.getAttribute('data-notification'),
						isLastNotification;

					if( id ) {
						extensionAPI.dismissNotification( id );

						// Track fixed dismiss exp
						// S0 is tracked in BE
						// S1 is tracked onview
						// S2 is tracked onclick
						B.track.stage(4, 2);

						$('#notification' + id).fadeOut('slow', function() {
							if ( $('.user-notification:visible').length === 0 ) {
								$('.list-notifications-s-non-empty').hide();
								$('.list-notifications-s-empty').show();
							}
						});
					}
				})
				.on('click', '.read-notification', function() {
					var id = this.getAttribute('data-notification');

					if( id ) {
						extensionAPI.readNotification( id );
						$('#notification' + id).addClass("seen");
					}
				});
		},

		resizeForgottenPasswordIframe: function(height) {
			var $iframe = $('#' + config.forgottenPasswordIframeId),
				$mainContent = $('#main-content'),
				extensionContext = this;

			if ($iframe.length) {
				$iframe.height(height);
				$iframe.removeClass('hidden');
				$mainContent.addClass('hidden');

				extensionContext.hideLoadingOverlay();
			}
		},

		closeForgottenPasswordIframe: function() {
			var $html = $('html').first(),
				$iframe = $('#' + config.forgottenPasswordIframeId),
				$mainContent = $('#main-content'),
				extensionContext = this;

			if ($iframe.length) {
				$html.removeClass('only-iframe');
				$mainContent.removeClass('hidden');
				$iframe.addClass('hidden');
			}
		},

		updateNotificationsTemplate: function(notifications) {
			// Declare working variables
			var $notificationsContainer,
				extensionContext = this,
				extensionData,
				promise = $.Deferred(),
				context,
				templateName = 'notifications.html';

			var modifiedData = {
				userNotifications: {
					notifications: notifications
				}
			};

			//Fixed Dismiss Experiment
			if(B.track.getVariant(4)) {
				notifications = extensionAPI.hackishRemoveDismissed(modifiedData).userNotifications.notifications;
			}

			// Stop processing if there are no new notifications
			if (notifications.length === 0) {
				// Show content depending whether there are notifications
				// Fake a click and track
				if( extensionAPI.localNotificationsPresent() ) {
					$('.list-notifications-s-non-empty').show();
					$('.list-notifications-s-empty').hide();

					if( !B.track.getVariant(5) ) { // exp: lp_browser_extension_search_tab_first
						$('#main-tabs').find('.tab-notifications').click();
						tracking.trackEvent(config.analytics.categories.CLICK, 'tab_notifications');
					}
				} else {
					$('.list-notifications-s-non-empty').hide();
					$('.list-notifications-s-empty').show();

					$('#main-tabs').find('.tab-search').click();
					tracking.trackEvent(config.analytics.categories.CLICK, 'tab_search');
				}

				// Hide the mask and show the tabs
				extensionContext.hideLoadingOverlay();
				extensionContext.showTabs();

				return;
			}

			extensionData = extensionAPI.getExtensionData();

			$notificationsContainer = $("#main-content").find('.list-notifications-s-non-empty');

			this.loadLocalTemplate( './templates/' + templateName, promise );

			promise.then( function( templateContent ) {

				context = extensionContext.loadTranslations( templateName );
				context.notifications = notifications;

				extensionContext.parseTemplate( templateContent, context, function(notificationsHTML) {

					$notificationsContainer.html( notificationsHTML ).removeClass( 'empty' );

					// Hide the mask and show the tabs
					extensionContext.hideLoadingOverlay();
					extensionContext.showTabs();

					$('.list-notifications-s-non-empty').show();
					$('.list-notifications-s-empty').hide();

					if( !B.track.getVariant(5) ) { // exp: lp_browser_extension_search_tab_first
						// Fake a click and track
						$('#main-tabs').find('.tab-notifications').click();
						tracking.trackEvent(config.analytics.categories.CLICK, 'tab_notifications');
					}
				});

			}, function() {
				extensionContext.hideLoadingOverlay();
			});
		},

		performWebsiteAuth: function() {
			var data = extensionAPI.getExtensionData(),
				$form;

			if( data.loginStatus && data.loginStatus.key && data.loginStatus.token ) {
				$form = $('.form-authenticate');

				$form.data('silentAuth', true);
				$form.find('#input_xy_token').val( data.loginStatus.key );
				$form.find('#input_xy_secret').val( data.loginStatus.token );

				$form.submit();
			}
		},

		showLoadingOverlay: function() {
			$('#mask').removeClass('hidden');
		},

		hideLoadingOverlay: function() {
			$('#mask').addClass('hidden');
		},

		showTabs: function() {
			$('#main-tabs').removeClass('hidden');
			$('.wrapper-body').addClass('wrapper-s-with-tabs');
		},

		hideTabs: function() {
			$('#main-tabs').addClass('hidden');
			$('.wrapper-body').removeClass('wrapper-s-with-tabs');
		},

		showErrorMessages: function(messages, messageCTA) {
			var $alerts = $('.alert');
			var $messageContainer = $('.error-msg-block'),
				html = '<a href="#" class="alert-dismiss pull-right">&times;</a>';

			if(!messages) return;

			if( $.isArray(messages) ) {
				for(var i = 0, l = messages.length; i < l; i++) {
					html += '<p class="alert-error">' + messages[i] + '</p>';
				}
			} else {
				html += '<p class="alert-error">' + messages + '</p>';

				if (typeof messageCTA !== 'undefined') {
					html += '<p class="alert-error-cta">' + messages + '</p>';
				}
			}

			$messageContainer.html(html).show();

			$('.alert-dismiss').click(function(){
				$(this).parent().fadeOut(200);
			});

		},

		hideErrorMessages: function() {
			$('.error-msg-block').hide();
		},

		getUserCountryFromLocale: function() {
			var userLocale = window.navigator.language.toLowerCase();
			var userInfo = userLocale.split('-');

			return userInfo[1];
		},

		isLanguageRTL: function(languageWithoutDialect) {
			if (languageWithoutDialect === 'ar' || languageWithoutDialect === 'he') {
				return true;
			}

			return false;
		},

		dateDiff: function(checkinDate, checkoutDate) {
			// Create new dates, discarding the time parts (though there shouldn't be any)
			var checkin = new Date(checkinDate.getFullYear(), checkinDate.getMonth(), checkinDate.getDate());
			var checkout = new Date(checkoutDate.getFullYear(), checkoutDate.getMonth(), checkoutDate.getDate());


			var millisecondsPerDay = 1000 * 60 * 60 * 24;
			var millisBetween = checkout.getTime() - checkin.getTime();
			var days = millisBetween / millisecondsPerDay;

			return Math.floor(days);
		},

		getWeekStartDay: function(country) {
			if (typeof country === 'undefined' || country === '' || !$.inArray(country, config.locale.countriesForWeekCheck)) {
				return 1;
			}

			return 0;
		},

		renderDate: function(date) {
			var dateFormatter = new DateFormatter();

			return dateFormatter.date(date, 'short_date_with_weekday');
		},

		getUserName: function() {
			var localData = extensionAPI.getExtensionData();

			if (localData.userPreferences && localData.userPreferences.userName && localData.userPreferences.userName.isNameAvailable && localData.userPreferences.userName.fullName) {
				return localData.userPreferences.userName.fullName;
			}

			return false;
		},

		isUsernameAvailable: function() {
			var localData = extensionAPI.getExtensionData();

			if (localData.userPreferences && localData.userPreferences.userName && localData.userPreferences.userName.isNameAvailable) {
				return localData.userPreferences.userName.isNameAvailable;
			}

			return false;
		},

		isGeniusUser: function() {
			var localData = extensionAPI.getExtensionData();

			return !!(localData.userPreferences && localData.userPreferences.isGeniusUser);
		},

		getUserAvatar: function() {
			var localData = extensionAPI.getExtensionData();

			if (localData.userPreferences && localData.userPreferences.userAvatar && localData.userPreferences.userAvatar.isAvatarAvailable && localData.userPreferences.userAvatar.avatarURL) {
				if(localData.userPreferences.userAvatar.isFacebookAvatar && window.exps) {
					B.track.exp(1);
					if(B.track.getVariant(1) == 1) {
						return localData.userPreferences.userAvatar.avatarURL;
					} else {
						return config.imageHostUrl + '/' + localData.userPreferences.userAvatar.avatarURL;
					}
				} else {
					return config.imageHostUrl + '/' + localData.userPreferences.userAvatar.avatarURL;
				}
			}

			return false;
		},

		isValidUserEmail: function() {
			var localData = extensionAPI.getExtensionData();

			if (localData.userPreferences && localData.userPreferences.isValidEmail) {
				return localData.userPreferences.isValidEmail;
			}

			return false;
		},

		isUserAvatarAvailable: function() {
			var localData = extensionAPI.getExtensionData();

			if (localData.userPreferences && localData.userPreferences.userAvatar && localData.userPreferences.userAvatar.isAvatarAvailable) {
				return localData.userPreferences.userAvatar.isAvatarAvailable;
			}

			return false;
		},

		isFacebookAvatar: function() {
			var localData = extensionAPI.getExtensionData();

			if (localData.userPreferences && localData.userPreferences.userAvatar && localData.userPreferences.userAvatar.isFacebookAvatar) {
				return localData.userPreferences.userAvatar.isFacebookAvatar;
			}

			return false;
		}
	};

	// When user clicks on extension icon, we run the extension initialization
	window.addEventListener('load', function () {
		var currentData = extensionAPI.getExtensionData();

		var userIsLoggedIn = !!( currentData.loginStatus && currentData.loginStatus.key );

		if(userIsLoggedIn) {
			$.ajax({
				type: "POST",
				data: {
					aid: 382975,
					lang: extensionAPI.getUserLanguageForURL(),
					stype: 1
				},
				url: config.secureRootURL + "/get_browser_extension_exp_hashes",
				success: function(data) {
					var win = document.getElementById("template_parser_sandbox").contentWindow;
					window.exps = data || [];
					if( config.isDev() ) { // Is dev? Force some experiment variant just for debugging
						window.exps[5] = ['fERFOXfBZDRYGPCFfBLLSCC', 1];
					}
					var result = win.postMessage({exps: data}, '*');
					window.GeniusExtension.init({hasExps:true});
					return false;
				}
			});
		} else {
			window.GeniusExtension.init();
		}
	});
})(window, document, jQuery, window.B, {initialUpdateWait: 1});
