var Koppeltaal = Koppeltaal || {};
Koppeltaal.Client = function (baseUrl, authorization)
{
	if (!baseUrl)
	{
		throw Error('No base url specified.');
	}

	if (!authorization)
	{
		throw Error('No authorization specified.');
	}

	this.baseUrl = baseUrl;
	this.authorization = authorization;
	// Set up commonly used url's.
	this.fhirUrl = baseUrl + '/FHIR/Koppeltaal';
	this.messageHeaderUrl = this.fhirUrl + '/MessageHeader';
	this.messageHeaderSearchUrl = this.messageHeaderUrl + '/_search';
	this.getNextMessageAndClaimUrl = this.messageHeaderSearchUrl + '?_query=MessageHeader.GetNextNewAndClaim';
	this.getActivityDefinitionsUrl = this.fhirUrl + '/Other?code=ActivityDefinition';
	this.mailboxUrl = this.fhirUrl + '/Mailbox';
	this.metaDataUrl = this.fhirUrl + '/metadata';
	this.oauthUrl = baseUrl + '/OAuth2/Koppeltaal';
	this.tokenUrl = this.oauthUrl + '/Token';
	this.iterateNewMessages = function (processor, searchArguments)
	{
		var client = this;
		var messageIterator = function (message)
		{
			var isEmpty = !Koppeltaal.Message.hasEntries(message);
			if (!isEmpty)	// An empty message means that the server has no more messages to send us.
			{
				var newStatus;
				try
				{
					var processingSuccessfull = processor(message); // Call the message consumer's logic.

					newStatus = processingSuccessfull ? "Success" : "Failed"; // Update the message status on the server.
				}
				catch (error)
				{
					//console.error(error);
					newStatus = "Failed";
					// TODO: set error message

					// Update the message status.
					client.updateMessageStatus(message, newStatus);
					throw error;
				}

				client.getNextMessageAndClaim(messageIterator, searchArguments);
			}
		};
		this.getNextMessageAndClaim(messageIterator, searchArguments); // Start retrieving messages.
	};
	this.getNextMessageAndClaim = function (callback, searchArguments)
	{
		var authorization = this.authorization;
		// Add the search arguments as query string.
		var searchUrl = this.getNextMessageAndClaimUrl;
		for (var key in searchArguments)
		{
			if (searchArguments.hasOwnProperty(key))	// Just to make sure we don't get properties of the Array prototype.
			{
				var value = searchArguments[key]; // TODO: encode value.
				searchUrl += '&' + key + '=' + value;
			}
		}

		$.ajax({
			type: "GET",
			dataType: 'json',
			url: searchUrl,
			crossDomain: true,
			contentType: "application/json",
			beforeSend: function (xhr)
			{
				xhr.setRequestHeader("Authorization", Koppeltaal.Util.getAuthorizationString(authorization));
			},
			success: callback
		});
	};
	this.getMessageHeaders = function (searchArguments, successCallback, errorCallback)
	{
		var authorization = this.authorization;
		// Add the search arguments as query string.
		var searchUrl = this.messageHeaderSearchUrl;
		var isFirst = true;
		for (var key in searchArguments)
		{
			if (searchArguments.hasOwnProperty(key))	// Just to make sure we don't get properties of the Array prototype.
			{
				var value = searchArguments[key]; // TODO: encode value.
				var delimiter = isFirst ? '?' : '&';
				searchUrl += delimiter + key + '=' + value;
				isFirst = false;
			}
		}

		var xhr = $.ajax({
			type: "GET",
			dataType: 'json',
			url: searchUrl,
			crossDomain: true,
			contentType: "application/json",
			beforeSend: function (xhr)
			{
				xhr.setRequestHeader("Authorization", Koppeltaal.Util.getAuthorizationString(authorization));
			},
			success: successCallback,
			error: errorCallback
		});
		return xhr;
	};
	this.getMessageWithId = function (id, successCallback, errorCallback)
	{
		var authorization = this.authorization;
		// Add the search arguments as query string.
		var searchUrl = this.messageHeaderSearchUrl + '?_id=' + id;
		$.ajax({
			type: "GET",
			dataType: 'json',
			url: searchUrl,
			contentType: "application/json",
			crossDomain: true,
			beforeSend: function (xhr)
			{
				xhr.setRequestHeader("Authorization", Koppeltaal.Util.getAuthorizationString(authorization));
			},
			success: successCallback,
			error: errorCallback
		});
	};
	this.updateMessageStatus = function (message, newProcessingStatus)
	{
		var headerEntry = Koppeltaal.Message.getMessageHeaderEntry(message);
		this.updateMessageStatusFromHeader(headerEntry, newProcessingStatus);
	};
	this.updateMessageStatusFromHeader = function (headerEntry, newProcessingStatus)
	{
		var messageHeader = headerEntry.content;
		// Update the json message object with the new value.
		Koppeltaal.MessageHeader.setProcessingStatus(messageHeader, newProcessingStatus);
		var url = headerEntry.id; // The message header ID is only contained in its entry in the bundle. TODO: check whether we should do something about that.

		// Send the new value to the server.
		var authorization = this.authorization;
		$.ajax({
			type: "PUT",
			url: url,
			contentType: "application/json",
			crossDomain: true,
			data: JSON.stringify(messageHeader),
			beforeSend: function (xhr)
			{
				xhr.setRequestHeader("Authorization", Koppeltaal.Util.getAuthorizationString(authorization));
			}
		});
	};
	this.getActivityDefinitions = function (successCallback, errorCallback)
	{
		var authorization = this.authorization;
		$.ajax({
			type: "GET",
			dataType: 'json',
			url: this.getActivityDefinitionsUrl,
			crossDomain: true,
			contentType: "application/json",
			beforeSend: function (xhr)
			{
				xhr.setRequestHeader("Authorization", Koppeltaal.Util.getAuthorizationString(authorization));
			},
			success: successCallback,
			error: errorCallback
//			success: function (response)
//			{
//				// Parse the bundle to an array.
//				var activityDefinitions = [];
//				for (var i = 0; i < response.entry.length; i++)
//				{
//					activityDefinitions.push(response.entry[i].content);
//				}
//
//				callback(activityDefinitions);
//			}
		});
	};
	this.postMessageToMailbox = function (message, successCallback, errorCallback)
	{
		var authorization = this.authorization;
		$.ajax({
			type: "POST",
			dataType: 'json',
			url: this.mailboxUrl,
			contentType: "application/json",
			data: JSON.stringify(message),
			crossDomain: true,
			beforeSend: function (xhr)
			{
				xhr.setRequestHeader("Authorization", Koppeltaal.Util.getAuthorizationString(authorization));
			},
			success: successCallback,
			error: errorCallback
		});
	};
	this.getApplicationLaunchUrl = function (applicationId, patientId, activityId, userId)
	{
		var launchUrl = this.baseUrl + '/OAuth2/Koppeltaal/Launch?';
		launchUrl += 'client_id=' + encodeURIComponent(applicationId);
		launchUrl += '&patient=' + encodeURIComponent(patientId);
		launchUrl += '&resource=' + encodeURIComponent(activityId);
		// Add authorization data.
		launchUrl += '&Authorization=' + encodeURIComponent(Koppeltaal.Util.getAuthorizationString(authorization));
		if (userId)
		{
			launchUrl += '&user=' + encodeURIComponent(userId);
		}

		return launchUrl;
	};
	this.getServerMetaData = function (successCallback, errorCallback)
	{
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: this.metaDataUrl,
			crossDomain: true,
			contentType: "application/json",
			success: successCallback,
			error: errorCallback
		});
	};
	
	this.getOAuthAuthorizeUrl = function (clientId, urlToRedirectTo, scope, state, successCallback, errorCallback)
	{
		this.getServerMetaData(
				function (metadata)
				{
					var authorizeUrl = Koppeltaal.MetaData.getAuthorizationEndpoint(metadata);
					authorizeUrl += '?response_type=code';
					authorizeUrl += '&client_id=' + encodeURIComponent(clientId);
					authorizeUrl += '&redirect_uri=' + encodeURIComponent(urlToRedirectTo);
					authorizeUrl += '&scope=' + encodeURIComponent(scope);
					if (state)
					{
						authorizeUrl += '&state=' + encodeURIComponent(state);
					}

					successCallback(authorizeUrl);
				},
				errorCallback);
	};
	
	this.convertMobileLaunchCodeToToken = function (successCallback, errorCallback)
	{
		var authorization = this.authorization;
		if (authorization.type !== 'mobilelaunch')
		{
			throw Error('A mobile launch code can only be used when authorization type is \'mobilelaunch\'.');
		}
		
		if (!authorization.launchCode)
		{
			throw Error('authorization.launchCode not specified');
		}
		
		if (!authorization.clientId)
		{
			throw Error('authorization.clientId not specified');
		}
		
		if (!authorization.redirectUrl)
		{
			throw Error('authorization.redirectUrl not specified');
		}
		
		if (!authorization.scope)
		{
			throw Error('authorization.scope not specified');
		}
		
		// Combine launchCode and scope.
		var extendedScope = 'launch:' + authorization.launchCode + ' ' + authorization.scope;
		
		this.authorize(authorization.clientId, authorization.redirectUrl, extendedScope, authorization.state, function(response)
		{
			$.extend(authorization, response); // Add the token information to the authorization object.

			successCallback(authorization);
			
		}, errorCallback);
	}
	
	this.convertAccessCodeToToken = function (successCallback, errorCallback)
	{
		var authorization = this.authorization;
		if (authorization.type !== 'token')
		{
			throw Error('An access token can only be retrieved when authorization type is \'token\'.');
		}

		var accessCode = this.authorization.accessCode;
		if (!accessCode)
		{
			throw Error('No access code is specified.');
		}

		var redirectUrl = this.authorization.redirectUrl;
		if (!redirectUrl)
		{
			throw Error('No redirect url is specified.');
		}

		var tokenUrl = this.tokenUrl;
		tokenUrl += '?grant_type=authorization_code';
		tokenUrl += '&code=' + encodeURIComponent(accessCode);
		tokenUrl += '&redirect_uri=' + encodeURIComponent(redirectUrl);
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: tokenUrl,
			crossDomain: true,
			success: function (response)
			{
				$.extend(authorization, response); // Add the token information to the authorization object.

				successCallback(authorization);
			},
			error: errorCallback
		});
	};
	
	this.authorize = function (clientId, urlToRedirectTo, scope, state, successCallback, errorCallback)
	{
		var client = this;
		
		this.getOAuthAuthorizeUrl(clientId, urlToRedirectTo, scope, state, function(authorizeUrl)
		{
			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: authorizeUrl,
				crossDomain: true,
				success: function (response)
				{
					if (!response.authorization_code)
					{
						throw Error("No authorization code received from server.");
					}
					
					authorization.accessCode = response.authorization_code;
					authorization.type = "token";
					client.convertAccessCodeToToken(successCallback, errorCallback);
				},
				error: errorCallback
			});
		}, errorCallback);
	}
};
Koppeltaal.MetaData =
		{
			getAuthorizationEndpoint: function (metadata)
			{
				var restInformation = metadata.rest;
				if (restInformation && restInformation.length > 0)
				{
					var restInfo = restInformation[0];
					if (restInfo.security)
					{
						var authorizationExtension = Koppeltaal.Resource.getExtension(restInfo.security, "http://fhir-registry.smartplatforms.org/Profile/oauth-uris#authorize");
						if (authorizationExtension)
						{
							var authorizationEndpoint = authorizationExtension.valueUri;
							if (authorizationEndpoint)
							{
								return authorizationEndpoint;
							}
							else
							{
								throw Error('Metadata does not contain a value for the authorization endpoint');
							}
						}
						else
						{
							throw Error('Metadata does not contain an authorization endpoint extension');
						}
					}
					else
					{
						throw Error('Metadata is missing security information');
					}
				}
				else
				{
					throw Error('Metadata is missing rest information');
				}
			}
		};
// Resource.
Koppeltaal.Resource =
		{
			// Finds the extension with the given url.
			getExtension: function (resource, extensionUri)
			{
				if (resource && resource.extension) {
					for (var i = 0; i < resource.extension.length; i++)
					{
						var extension = resource.extension[i];
						if (extension.url === extensionUri)
						{
							return extension;
						}
					}
				}

				return null;
			},
			getExtensions: function (resource, extensionUri)
			{
				var extensions = [];
				if (resource && resource.extension) {
					for (var i = 0; i < resource.extension.length; i++)
					{
						var extension = resource.extension[i];
						if (extension.url === extensionUri)
						{
							extensions.push(extension);
						}
					}
				}

				return extensions;
			},
			addExtension: function (resource, extension)
			{
				if (!resource.extension)	// Ensure the extension array exists.
				{
					resource.extension = [];
				}

				resource.extension.push(extension);
				return extension;
			},
			addExtensionUrl: function (resource, extensionUri)
			{
				var extension = {};
				extension.url = extensionUri;
				return this.addExtension(resource, extension);
			},
			addExtensionValue: function (resource, extensionUri, value, valueType)
			{
				var extension = {};
				extension.url = extensionUri;
				extension['value' + valueType] = value;
				return this.addExtension(resource, extension);
			},
			setExtensionValue: function (resource, extensionUri, value, valueType)
			{
				var extension = this.getExtension(resource, extensionUri);
				if (!extension) {
					extension = this.addExtensionUrl(resource, extensionUri);
				}

				extension['value' + valueType] = value;
			},
			getExtensionValue: function (resource, extensionUri, valueType)
			{
				var extension = Koppeltaal.Resource.getExtension(resource, extensionUri);
				if (extension)
				{
					return extension['value' + valueType];
				}
				else
				{
					return null;
				}
			},
			removeExtension: function (resource, extensionUri, removeAll)
			{
				if (resource.extension)
				{
					for (var i = 0; i < resource.extension.length; )
					{
						var extension = resource.extension[i];
						if (extension.url === extensionUri)
						{
							resource.extension.splice(i, 1);
							if (!removeAll)
							{
								break;
							}
						}
						else
						{
							i++;
						}
					}
				}
			}
		};
Koppeltaal.Message =
		{
			create: function (domain)
			{
				var bundle =
						{
							id: 'urn:uuid:' + Koppeltaal.Util.guid(),
							resourceType: "Bundle",
							category:
									[
										{// The domain tag.
											"term": "http://ggz.koppeltaal.nl/fhir/Koppeltaal/Domain#" + domain,
											"label": domain,
											"scheme": "http://hl7.org/fhir/tag/security"
										},
										{// Indicates to the server that this bundle represents a message.
											"term": "http://hl7.org/fhir/tag/message",
											"scheme": "http://hl7.org/fhir/tag"
										}
									],
							entry: []
						};
				return bundle;
			},
			getMessageHeaderEntry: function (message)
			{
				// Parse message header. Because it is a message bundle, the first entry must be the header. Otherwise it is an invalid message.
				if (!message.entry || message.entry.length <= 0)
				{
					throw Error("Bundle contains no entries.");
				}

				// Get the header.
				var entry = message.entry[0];
				return entry;
			},
			getMessageHeader: function (message)
			{
				// Get the header entry.
				var entry = this.getMessageHeaderEntry(message);
				// Check whether the entry contains a resource of the correct type.
				var resource = entry.content;
				if (resource.resourceType !== 'MessageHeader')
				{
					throw Error("The first entry of this bundle is not a MessageHeader. Not a valid message bundle.");
				}
				return resource;
			},
			// Reads the focal resource ID from the message header, then gets that resource from the bundle.
			getFocalResource: function (message)
			{
				var data = this.getFocalResourceData(message);
				var focalResource = this.getContainedResource(message, data.reference);
				return focalResource;
			},
			getFocalResourceData: function (message)
			{
				var isEmpty = !this.hasEntries(message);
				if (isEmpty)
				{
					throw Error("No entries found in bundle");
				}

				var header = this.getMessageHeader(message);
				return Koppeltaal.MessageHeader.getFocalResource(header);
			},
			// Sets the focal resource ID on the message header.
			setFocalResource: function (message, resource, resourceReference)
			{
				var isEmpty = !this.hasEntries(message);
				if (isEmpty)
				{
					throw Error("No entries found in bundle");
				}

				var header = this.getMessageHeader(message);
				var focalResourceReference =
						{
							//id : resource.id,
							reference: resourceReference //resource.id
						};
				Koppeltaal.MessageHeader.setFocalResource(header, focalResourceReference);
				// TODO: add resource entry to message.
				this.addResourceEntry(message, resource, resourceReference);
			},
			getResources: function (message)
			{
				return message.entry ? message.entry : [];
			},
			// Gets one of the resources contained in the bundle based on it's id.
			getContainedResource: function (message, resourceId)
			{
				for (var entryNo = 0; entryNo < message.entry.length; entryNo++)
				{
					var entry = message.entry[entryNo];
					// First check whether the ID matches.
					if (entry.id == resourceId)
					{
						return entry.content;
					}
					
					// Second, check whether the selflink matches.
					var links = entry.link;
					if (links)
					{
						for (var i = 0; i < links.length; i++)
						{
							var link = links[0];
							if (link.rel == "self" && link.href == resourceId)
							{
								return entry.content;
							}
						}
					}
				}
			},
			getContainedResourceWithId: function (message, contentId)
			{
				for (var entryNo = 0; entryNo < message.entry.length; entryNo++)
				{
					var entry = message.entry[entryNo];
					
					// First check whether the ID matches.
					if (entry.id == contentId)
					{
						return entry.content;
					}
					
					// Second, check whether the selflink matches.
					var links = entry.link;
					if (links)
					{
						for (var i = 0; i < links.length; i++)
						{
							var link = links[0];
							if (link.rel == "self" && link.href == resourceId)
							{
								return entry.content;
							}
						}
					}
				}
			},
			getContainedResourceEntriesWithType: function (message, resourceType)
			{
				var entries = [];
				for (var entryNo = 0; entryNo < message.entry.length; entryNo++)
				{
					var entry = message.entry[entryNo];
					if (entry.content && entry.content.resourceType === resourceType)
					{
						entries.push(entry);
					}
				}
				return entries;
			},
			getContainedResourcesWithType: function (message, resourceType)
			{
				var resources = [];
				
				var resourceEntries = Koppeltaal.Message.getContainedResourceEntriesWithType(message, resourceType);
				for (var entryNo = 0; entryNo < resourceEntries.length; entryNo++)
				{
					var entry = resourceEntries[entryNo];
					resources.push(entry.content);
				}
				
				return resources;
			},
			getContainedResourceEntriesWithTypeAndCode: function (message, resourceType, resourceCode)
			{
				var resources = [];
				for (var entryNo = 0; entryNo < message.entry.length; entryNo++)
				{
					var entry = message.entry[entryNo];
					if (entry.content && entry.content.resourceType === resourceType)
					{
						if (entry.content.code && entry.content.code.coding && entry.content.code.coding.length > 0) {
							for (var i = 0; i < entry.content.code.coding.length; ++i)
							{
								var coding = entry.content.code.coding[i];
								if (coding.code && coding.code === resourceCode) {
									resources.push(entry);
								}
							}
						}
					}
				}
				return resources;
			},
			getContainedResourcesWithTypeAndCode: function (message, resourceType, resourceCode)
			{
				var resources = [];
				for (var entryNo = 0; entryNo < message.entry.length; entryNo++)
				{
					var entry = message.entry[entryNo];
					if (entry.content && entry.content.resourceType === resourceType)
					{
						if (entry.content.code && entry.content.code.coding && entry.content.code.coding.length > 0) {
							for (var i = 0; i < entry.content.code.coding.length; ++i)
							{
								var coding = entry.content.code.coding[i];
								if (coding.code && coding.code === resourceCode) {
									resources.push(entry.content);
								}
							}
						}
					}
				}
				return resources;
			},
			addResourceEntry: function (message, resource, reference)
			{
				if (!message.entry) {
					message.entry = [];
				}

				var entry = {
					content: resource
				};
				
				var historyIndex = reference.indexOf('/_history');
				var resourceId;
				var resourceSelfLink;
				if (historyIndex > 0) // The reference contains a history part.
				{
					resourceId = reference.substring(0, historyIndex);
					resourceSelfLink = reference;
				}
				else // Reference contains no history part.
				{
					resourceId = reference;
					// No self link if we have no history.
				}
				
				// Add the id and (if present) self link to the entry,
				entry.id = resourceId;
				if (resourceSelfLink) {
					entry.link = {
						rel: 'self',
						href: resourceSelfLink
					};
				}

				message.entry.push(entry);
				return entry;
			},
			removeResourceEntry: function (message, resourceId, removeAll) {
				if (message.entry) {
					for (var i = 0; i < message.entry.length; ) {
						if (message.entry[i].id === resourceId) {
							message.entry.splice(i, 1);
							if (!removeAll) {
								break;
							}
						} else {
							++i;
						}
					}
				}
			},
			hasEntries: function (message)
			{
				return message.entry && message.entry.length > 0;
			}
		};
Koppeltaal.SimpleMessage = // A SimpleMessage is nothing more than a Message with a pre-generated MessageHeader.
		{
			create: function (domain, messageEventCode)
			{
				var message = Koppeltaal.Message.create(domain);
				var messageHeader = Koppeltaal.MessageHeader.create();
				var uuid = Koppeltaal.Util.guid();
				messageHeader.identifier = uuid;
				messageHeader.event = messageEventCode;
				Koppeltaal.Message.addResourceEntry(message, messageHeader, 'urn:uuid:' + uuid);
				return message;
			}
		};
Koppeltaal.PatientMessage = // A PatientMessage is a SimpleMessage that is sent in the context of care for one particular patient.
		{
			create: function (domain, messageEventCode, patientReference)
			{
				var message = Koppeltaal.SimpleMessage.create(domain, messageEventCode);
				var messageHeader = Koppeltaal.Message.getMessageHeader(message);
				Koppeltaal.MessageHeader.setPatient(messageHeader, patientReference);
				return message;
			}
		};
Koppeltaal.CreateOrUpdateCarePlanMessage =
		{
			create: function (domain, patientReference, careplan, careplanReference)
			{
				var event = Koppeltaal.ValueSets.Events.CreateOrUpdateCarePlan;
				var message = Koppeltaal.PatientMessage.create(domain, event, patientReference);
				Koppeltaal.Message.setFocalResource(message, careplan, careplanReference);
				return message;
			}
		};
Koppeltaal.UpdateCarePlanActivityStatusMessage =
		{
			create: function (domain, patientReference, activityStatus, activityStatusReference)
			{
				var event = Koppeltaal.ValueSets.Events.UpdateCarePlanActivityStatus;
				var message = Koppeltaal.PatientMessage.create(domain, event, patientReference);
				Koppeltaal.Message.setFocalResource(message, activityStatus, activityStatusReference);
				return message;
			}
		};
Koppeltaal.MessageHeader =
		{
			PatientExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/MessageHeader#Patient',
			ProcessingStatusUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/MessageHeader#ProcessingStatus',
			ProcessingStatusStatusUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/MessageHeader#ProcessingStatusStatus',
			create: function ()
			{
				var messageHeader =
						{
							resourceType: 'MessageHeader',
							extension: [],
							data: [],
							source: {
								software: "Hello",
								endpoint: "Stuff"
							},
							timestamp: new Date().toISOString()
						};
				return messageHeader;
			},
			getMessageHeaderId: function (messageHeader)
			{
				return parseInt(messageHeader.id.substr(messageHeader.id.lastIndexOf('/') + 1));
			},
			getFocalResource: function (messageHeader)
			{
				var focalResourceReference;
				if (messageHeader.data && messageHeader.data.length > 0)
				{
					// Note: multiple focal resources are not yet supported.
					focalResourceObject = messageHeader.data[0];
					if (focalResourceObject)
					{
						focalResourceReference = focalResourceObject.reference;
					}
				}

				return focalResourceReference;
			},
			setFocalResource: function (messageHeader, resourceReference)
			{
				messageHeader.data = [resourceReference]; // Currently there is no support for multiple focal resources.
			},
			getProcessingStatus: function (messageHeader)
			{
				var extensions = messageHeader.extension;
				for (var i = 0; i < extensions.length; i++)
				{
					var extension = extensions[i];
					if (extension.url === this.ProcessingStatusUri)
					{
						var processingStatusAttributes = extension.extension;
						for (j = 0; j < processingStatusAttributes.length; j++)
						{
							var processingStatusAttribute = processingStatusAttributes[j];
							if (processingStatusAttribute.url === this.ProcessingStatusStatusUri)
							{
								return processingStatusAttribute.valueCode;
							}
							break;
						}
						break;
					}

				}

				return undefined;
			},
			setProcessingStatus: function (messageHeader, newStatus)
			{
				var extensions = messageHeader.extension;
				for (var i = 0; i < extensions.length; i++)
				{
					var extension = extensions[i];
					if (extension.url === this.ProcessingStatusUri)
					{
						var processingStatusAttributes = extension.extension;
						for (j = 0; j < processingStatusAttributes.length; j++)
						{
							var processingStatusAttribute = processingStatusAttributes[j];
							if (processingStatusAttribute.url === this.ProcessingStatusStatusUri)
							{
								//var currentStatus = processingStatusAttribute.valueCode;
								processingStatusAttribute.valueCode = newStatus;
							}
							break;
						}
						break;
					}

				}
			},
			getPatient: function (messageHeader)
			{
				var value = Koppeltaal.Resource.getExtensionValue(messageHeader, this.PatientExtensionUri, 'Resource');
				if (value)
				{
					return value.reference;
				} else {
					return null;
				}
			},
			setPatient: function (messageHeader, patientReference)
			{
				var reference =
						{
							reference: patientReference
						};
				Koppeltaal.Resource.setExtensionValue(messageHeader, this.PatientExtensionUri, reference, 'Resource');
			},
			getEvent: function (resource) {
				if (resource.event)
				{
					return resource.event;
				}
				else
				{
					return null;
				}
			},
			getEventSystem: function (resource) {
				var event = Koppeltaal.MessageHeader.getEvent(resource);
				if (event)
				{
					return event.system;
				}
				else
				{
					return null;
				}
			},
			getEventCode: function (resource) {
				var event = Koppeltaal.MessageHeader.getEvent(resource);
				if (event)
				{
					return event.code;
				}
				else
				{
					return null;
				}
			},
			getEventDisplay: function (resource) {
				var event = Koppeltaal.MessageHeader.getEvent(resource);
				if (event)
				{
					return event.display;
				}
				else
				{
					return null;
				}
			}
		};
// Constants.
Koppeltaal.ActivityDefinition = {};
Koppeltaal.ActivityDefinition.ActivityDefinitionExtensionUriBase = "http://ggz.koppeltaal.nl/fhir/Koppeltaal/ActivityDefinition#";
Koppeltaal.ActivityDefinition.NameExtensionUri = Koppeltaal.ActivityDefinition.ActivityDefinitionExtensionUriBase + "ActivityName";
Koppeltaal.ActivityDefinition.DescriptionExtensionUri = Koppeltaal.ActivityDefinition.ActivityDefinitionExtensionUriBase + "ActivityDescription";
Koppeltaal.ActivityDefinition.IdentifierExtensionUri = Koppeltaal.ActivityDefinition.ActivityDefinitionExtensionUriBase + "ActivityDefinitionIdentifier";
Koppeltaal.ActivityDefinition.ApplicationExtensionUri = Koppeltaal.ActivityDefinition.ActivityDefinitionExtensionUriBase + "Application";
Koppeltaal.ActivityDefinition.TypeExtensionUri = Koppeltaal.ActivityDefinition.ActivityDefinitionExtensionUriBase + "ActivityKind";
Koppeltaal.ActivityDefinition.SubActivityExtensionUri = Koppeltaal.ActivityDefinition.ActivityDefinitionExtensionUriBase + "SubActivity";
Koppeltaal.ActivityDefinition.SubActivityNameExtensionUri = Koppeltaal.ActivityDefinition.ActivityDefinitionExtensionUriBase + "SubActivityName";
Koppeltaal.ActivityDefinition.SubActivityIdentifierExtensionUri = Koppeltaal.ActivityDefinition.ActivityDefinitionExtensionUriBase + "SubActivityIdentifier";
Koppeltaal.ActivityDefinition.SubActivityDescriptionExtensionUri = Koppeltaal.ActivityDefinition.ActivityDefinitionExtensionUriBase + "SubActivityDescription";
Koppeltaal.ActivityDefinition.getActivityKind = function (activityDefinition)
{
	return Koppeltaal.Resource.getExtensionValue(activityDefinition, this.TypeExtensionUri, 'Coding');
};
Koppeltaal.ActivityDefinition.getActivityName = function (activityDefinition)
{
	return Koppeltaal.Resource.getExtensionValue(activityDefinition, this.NameExtensionUri, 'String');
};
Koppeltaal.ActivityDefinition.getActivityDescription = function (activityDefinition)
{
	return Koppeltaal.Resource.getExtensionValue(activityDefinition, this.DescriptionExtensionUri, 'String');
};
Koppeltaal.ActivityDefinition.getApplication = function (activityDefinition)
{
	return Koppeltaal.Resource.getExtensionValue(activityDefinition, this.ApplicationExtensionUri, 'Resource');
};
Koppeltaal.ActivityDefinition.getSubActivities = function (activityDefinition)
{
	return Koppeltaal.Resource.getExtensions(activityDefinition, this.SubActivityExtensionUri);
};
Koppeltaal.ActivityDefinition.getSubActivityName = function (subActivity)
{
	return Koppeltaal.Resource.getExtensionValue(subActivity, this.SubActivityNameExtensionUri, "String");
};
Koppeltaal.ActivityDefinition.addSubActivityName = function (subActivity, name)
{
	return Koppeltaal.Resource.addExtensionValue(subActivity, this.SubActivityNameExtensionUri, name, "String");
};
Koppeltaal.ActivityDefinition.getSubActivityIdentifier = function (subActivity)
{
	return Koppeltaal.Resource.getExtensionValue(subActivity, this.SubActivityIdentifierExtensionUri, "String");
};
Koppeltaal.ActivityDefinition.addSubActivityIdentifier = function (subActivity, identifier)
{
	return Koppeltaal.Resource.addExtensionValue(subActivity, this.SubActivityIdentifierExtensionUri, identifier, "String");
};
Koppeltaal.ActivityDefinition.getSubActivityDescription = function (subActivity)
{
	return Koppeltaal.Resource.getExtensionValue(subActivity, this.SubActivityDescriptionExtensionUri, "String");
};
Koppeltaal.ActivityDefinition.addSubActivityDescription = function (subActivity, description)
{
	return Koppeltaal.Resource.addExtensionValue(subActivity, this.SubActivityDescriptionExtensionUri, description, "String");
};
/*
 // Tag
 Koppeltaal.Tag = function(term, label, scheme)
 {
 
 }
 // DomainTag
 Koppeltaal.DomainTag = function(domain)
 {
 var term = 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/Domain#' + domain;
 var label = domain;
 var scheme = 'http://hl7.org/fhir/tag/security';
 Koppeltaal.Tag.call(this, term, label, scheme);
 }
 */

// Utilities.
Koppeltaal.Util = {};
Koppeltaal.Util.getAuthorizationString = function (authorization)
{
	switch (authorization.type)
	{
		case 'basic':
			return this.getBasicAuthorization(authorization.username, authorization.password);
			break;
		case 'token':
			if (!authorization.access_token)
			{
				throw Error('Trying to use authentication via token, but no token is specified. Perhaps the access code has not yet been converted to a token?');
			}

			return this.getTokenAuthorization(authorization.access_token, authorization.token_type);
			break;
		case 'anonymous':
			return null;
			break;
		default:
			throw Error('Unrecognized authorization type: ' + authorization.type);
	}
};
Koppeltaal.Util.getBasicAuthorization = function (username, password)
{
	return 'Basic ' + Koppeltaal.Util.base64_encode(username + ':' + password);
};
Koppeltaal.Util.getTokenAuthorization = function (token, tokenType)
{
	if (tokenType === 'Bearer')
	{
		return 'Bearer ' + token;
	}
	else
	{
		throw Error('Unrecognized token type.');
	}
};
Koppeltaal.Util.base64_encode = function (data)
{
	//  discuss at: http://phpjs.org/functions/base64_encode/
	// original by: Tyler Akins (http://rumkin.com)
	// improved by: Bayron Guevara
	// improved by: Thunder.m
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Rafal Kukawski (http://kukawski.pl)
	// bugfixed by: Pellentesque Malesuada
	//   example 1: base64_encode('Kevin van Zonneveld');
	//   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
	//   example 2: base64_encode('a');
	//   returns 2: 'YQ=='

	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
			ac = 0,
			enc = '',
			tmp_arr = [];
	if (!data) {
		return data;
	}

	do { // pack three octets into four hexets
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);
		bits = o1 << 16 | o2 << 8 | o3;
		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;
		// use hexets to index into b64, and append result to encoded string
		tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);
	enc = tmp_arr.join('');
	var r = data.length % 3;
	return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
};
Koppeltaal.Util.guid = (function () {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
	}
	return function () {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
	};
})();
Koppeltaal.Util.hash = function (string) {
	var hash = 0, n = string.length, i, chr;
	for (i = 0; i < n; ++i) {
		chr = string.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // convert to 32bit integer
	}
	return hash;
};
Koppeltaal.ValueSets =
		{
			Events:
					{
						CreateOrUpdateCarePlan:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/MessageEvents',
									code: 'CreateOrUpdateCarePlan',
									display: 'CreateOrUpdateCarePlan'
								},
						UpdateCarePlanActivityStatus:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/MessageEvents',
									code: 'UpdateCarePlanActivityStatus',
									display: 'UpdateCarePlanActivityStatus'
								}

						// TODO: add the other events.
					},
			OtherResourceUsage:
					{
						CarePlanActivityStatus:
								{
									system: "http://ggz.koppeltaal.nl/fhir/Koppeltaal/OtherResourceUsage",
									code: "CarePlanActivityStatus",
									display: "CarePlanActivityStatus"
								},
						BlackBoxState:
								{
									system: "http://ggz.koppeltaal.nl/fhir/Koppeltaal/OtherResourceUsage",
									code: "BlackBoxState",
									display: "BlackBoxState"
								}
					},
			CarePlanStatus:
					{
						Planned:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanStatus',
									code: 'planned',
									display: 'planned'
								},
						Active:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanParticipantRole',
									code: 'active',
									display: 'active'
								},
						Completed:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanParticipantRole',
									code: 'completed',
									display: 'completed'
								}
					},
			CarePlanParticipantRoles:
					{
						Requester:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanParticipantRole',
									code: 'Requester',
									display: 'Requester'
								},
						Supervisor:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanParticipantRole',
									code: 'Supervisor',
									display: 'Supervisor'
								},
						Thirdparty:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanParticipantRole',
									code: 'Thirdparty',
									display: 'Thirdparty'
								},
						Caregiver:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanParticipantRole',
									code: 'Caregiver',
									display: 'Caregiver'
								},
						Secretary:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanParticipantRole',
									code: 'Secretary',
									display: 'Secretary'
								},
						Analyst:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanParticipantRole',
									code: 'Analyst',
									display: 'Analyst'
								}
					},
			ActivityKind:
					{
						Game:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/ActivityKind',
									code: 'Game',
									display: 'Game'
								},
						ELearning:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/ActivityKind',
									code: 'ELearning',
									display: 'ELearning'
								},
						Questionnaire:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/ActivityKind',
									code: 'Questionnaire',
									display: 'Questionnaire'
								},
						Meeting:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/ActivityKind',
									code: 'Meeting',
									display: 'Meeting'
								}
					},
			CarePlanActivityStatus:
					{
						Waiting:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanActivityStatus',
									code: 'Waiting',
									display: 'Waiting'
								},
						Available:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanActivityStatus',
									code: 'Available',
									display: 'Available'
								},
						InProgress:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanActivityStatus',
									code: 'InProgress',
									display: 'InProgress'
								},
						Completed:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanActivityStatus',
									code: 'Completed',
									display: 'Completed'
								},
						Cancelled:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanActivityStatus',
									code: 'Cancelled',
									display: 'Cancelled'
								},
						Expired:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanActivityStatus',
									code: 'Expired',
									display: 'Expired'
								},
						SkippedByUser:
								{
									system: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanActivityStatus',
									code: 'SkippedByUser',
									display: 'SkippedByUser'
								}
					},
			Gender:
					{
						Female:
								{
									system: 'http://hl7.org/fhir/vs/administrative-gender',
									code: 'F',
									display: 'Female'
								},
						Male:
								{
									system: 'http://hl7.org/fhir/vs/administrative-gender',
									code: 'M',
									display: 'Male'
								},
						Undifferentiated:
								{
									system: 'http://hl7.org/fhir/vs/administrative-gender',
									code: 'UN',
									display: 'Undifferentiated'
								},
						Unknown:
								{
									system: 'http://hl7.org/fhir/vs/administrative-gender',
									code: 'UNK',
									display: 'Unknown'
								}
					}
		};
Koppeltaal.FHIR = {};
Koppeltaal.FHIR.Codes =
		{
			CarePlanGoalStatus:
					{
						InProgress: 'in progress',
						Achieved: 'achieved',
						Sustaining: 'sustaining',
						Cancelled: 'cancelled'
					}
		};
Koppeltaal.CarePlan =
		{
			create: function (id, patientReference, statusCode)
			{
				var careplan =
						{
							resourceType: 'CarePlan',
							id: id,
							patient:
									{
										reference: patientReference
									},
							participant: [],
							activity: [],
							goal: [],
							status: statusCode
						};
				return careplan;
			},
			getActivity: function (careplan, activityId)
			{
				var activities = careplan.activity || [];
				for (var i = 0; i < activities.length; ++i) {
					if (activities[i].id === activityId) {
						return activities[i];
					}
				}
				return null;
			}
		};
Koppeltaal.CarePlan.Participant =
		{
			create: function (id, role)
			{
				var participant =
						{
							role:
									{
										coding: role
									},
							member:
									{
										reference: id
									}
						};
				return participant;
			}
		};
Koppeltaal.CarePlan.Goal =
		{
			create: function (id, role)
			{
				var participant =
						{
							role: role,
							member:
									{
										id: id,
										reference: id
									}
						};
				return participant;
			}
		};
Koppeltaal.CarePlan.Activity =
		{
			ActivityDefinitionExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlan#ActivityDefinition',
			ActivityIdentifierExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlan#ActivityIdentifier',
			ActivityKindExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlan#ActivityKind',
			DescriptionExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlan#ActivityDescription',
			SubActivityExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlan#SubActivity',
			ParticipantExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlan#Participant',
			ParticipantMemberExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlan#ParticipantMember',
			ParticipantRoleExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlan#ParticipantRole',
			StartDateExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlan#StartDate',
			StatusExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlan#ActivityStatus',
			create: function (id, category)
			{
				var activity =
						{
							id: id,
							extension: [],
							goal: [],
							prohibited: false,
							simple:
									{
										category: category,
										performer: []
									}
						};
				return activity;
			},
			// Get/set ActivityDefinition
			getActivityDefinitionId: function (carePlanActivity)
			{
				return Koppeltaal.Resource.getExtensionValue(carePlanActivity, this.ActivityDefinitionExtensionUri, 'String');
			},
			setActivityDefinition: function (activity, activityDefinitionIdentifier)
			{
				Koppeltaal.Resource.setExtensionValue(activity, this.ActivityDefinitionExtensionUri, activityDefinitionIdentifier, 'String');
			},
			// Get/set ActivityIdentifier
			getActivityIdentifier: function (carePlanActivity)
			{
				return Koppeltaal.Resource.getExtensionValue(carePlanActivity, this.ActivityIdentifierExtensionUri, 'String');
			},
			setActivityIdentifier: function (activity, activityIdentifier)
			{
				Koppeltaal.Resource.setExtensionValue(activity, this.ActivityIdentifierExtensionUri, activityIdentifier, 'String');
			},
			// Get/set Activity Kind
			getActivityKind: function (activity)
			{
				return Koppeltaal.Resource.getExtensionValue(activity, this.ActivityKindExtensionUri, 'Coding');
			},
			setActivityKind: function (activity, activityKindCoding)
			{
				Koppeltaal.Resource.setExtensionValue(activity, this.ActivityKindExtensionUri, activityKindCoding, 'Coding');
			},
			// Get/set description;
			getDescription: function (activity)
			{
				return Koppeltaal.Resource.getExtensionValue(activity, this.DescriptionExtensionUri, 'String');
			},
			setDescription: function (activity, description)
			{
				Koppeltaal.Resource.setExtensionValue(activity, this.DescriptionExtensionUri, description, 'String');
			},
			//Get/set performers.
			getPerformers: function (activity)
			{
				return activity.simple.performer;
			},
			addPerformer: function (activity, performerId)
			{
				if (!activity.simple)
				{
					activity.simple = {};
				}

				if (!activity.simple.performer)
				{
					activity.simple.performer = [];
				}

				activity.simple.performer.push(
						{
							reference: performerId
						});
			},
			// Set subactivities. name & description optional
			addSubActivity: function (activity, identifier)
			{
				var subActivity = Koppeltaal.Resource.addExtensionValue(activity, this.SubActivityExtensionUri, identifier, "String");
				return subActivity;
			},
			getParticipant: function (activity)
			{
				Koppeltaal.Resource.getExtensionValue(activity, this.ParticipantExtensionUri, 'CarePlanParticipantComponent');
			},
			getParticipantsWithRole: function (activity, role)
			{
				var participants = [];
				var extensions = Koppeltaal.Resource.getExtensions(activity, this.ParticipantExtensionUri);
				for (var i = 0; i < extensions.length; ++i) {
					var extension = extensions[i];
					var memberValue = Koppeltaal.Resource.getExtensionValue(extension, this.ParticipantMemberExtensionUri, "Resource");
					var roleCodeableConcept = Koppeltaal.Resource.getExtensionValue(extension, this.ParticipantRoleExtensionUri, "CodeableConcept");
					if (memberValue && roleCodeableConcept) {
						var coding = roleCodeableConcept.coding;
						for (var j = 0; j < coding.length; ++j) {
							if (coding[j].code === role) {
								participants.push(memberValue.reference);
								break;
							}
						}
					}
				}

				return participants;
			},
			//Set participants.
			addParticipant: function (activity, participant)
			{
				var resource = Koppeltaal.Resource.addExtensionUrl(activity, this.ParticipantExtensionUri);
				Koppeltaal.Resource.addExtensionValue(resource, this.ParticipantMemberExtensionUri, participant.member, 'Resource');
				Koppeltaal.Resource.addExtensionValue(resource, this.ParticipantRoleExtensionUri, participant.role, 'CodeableConcept');
			},
			//Get/set start date.
			setStartDate: function (activity, startdate)
			{
				Koppeltaal.Resource.setExtensionValue(activity, this.StartDateExtensionUri, startdate, 'DateTime');
			},
			//Get/set status
			setStatus: function (activity, statusCoding)
			{
				Koppeltaal.Resource.setExtensionValue(activity, this.StatusExtensionUri, statusCoding, 'Coding');
			},
			getStatus: function (activity)
			{
				return Koppeltaal.Resource.getExtensionValue(activity, this.StatusExtensionUri, 'Coding');
			}
		};
Koppeltaal.CarePlan.Activity.Status =
		{
			ActivityExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanActivityStatus#Activity',
			ActivityStatusExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanActivityStatus#ActivityStatus',
			PercentageCompletedExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanActivityStatus#PercentageCompleted',
			SubActivityExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanActivityStatus#SubActivity',
			SubActivityIdentifierExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanActivityStatus#SubActivityIdentifier',
			SubActivityStatusExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/CarePlanActivityStatus#SubActivityStatus',
			create: function (activityId)
			{
				var status =
						{
							resourceType: 'Other',
							id: activityId,
							extension: [],
							code:
									{
										coding:
												[
													Koppeltaal.ValueSets.OtherResourceUsage.CarePlanActivityStatus
												]
									}
						};
				return status;
			},
			// Get/set ActivityStatus
			getActivity: function (status)
			{
				return Koppeltaal.Resource.getExtensionValue(status, this.ActivityExtensionUri, 'String');
			},
			setActivity: function (status, activity)
			{
				Koppeltaal.Resource.setExtensionValue(status, this.ActivityExtensionUri, activity, 'String');
			},
			// Get/set ActivityStatus
			getActivityStatus: function (status)
			{
				return Koppeltaal.Resource.getExtensionValue(status, this.ActivityStatusExtensionUri, 'Coding');
			},
			setActivityStatus: function (status, statusCoding)
			{
				Koppeltaal.Resource.setExtensionValue(status, this.ActivityStatusExtensionUri, statusCoding, 'Coding');
			},
			// Get/set PercentageCompleted
			getPercentageCompleted: function (status)
			{
				return Koppeltaal.Resource.getExtensionValue(status, this.PercentageCompletedExtensionUri, 'Integer');
			},
			setPercentageCompleted: function (status, percentageCompleted)
			{
				Koppeltaal.Resource.setExtensionValue(status, this.PercentageCompletedExtensionUri, percentageCompleted, 'Integer');
			},
			//
			getSubActivities: function (status) {
				return Koppeltaal.Resource.getExtensions(status, this.SubActivityExtensionUri);
			},
			addSubActivity: function (status, subActivityIdentifier, subActivityStatusCoding) {
				var resource = Koppeltaal.Resource.addExtensionUrl(status, this.SubActivityExtensionUri);
				Koppeltaal.Resource.addExtensionValue(resource, this.SubActivityIdentifierExtensionUri, subActivityIdentifier, 'String');
				Koppeltaal.Resource.addExtensionValue(resource, this.SubActivityStatusExtensionUri, subActivityStatusCoding, 'Coding');
			},
			removeSubActivites: function (status) {
				Koppeltaal.Resource.removeExtension(status, this.SubActivityExtensionUri, true);
			},
			getSubActivityIdentifier: function (subActivity) {
				return Koppeltaal.Resource.getExtensionValue(subActivity, this.SubActivityIdentifierExtensionUri, 'String');
			},
			getSubActivityStatus: function (subActivity) {
				return Koppeltaal.Resource.getExtensionValue(subActivity, this.SubActivityStatusExtensionUri, 'Coding');
			},
			// Get/set BlackBoxState
			getBlackBoxState: function (status, blackBoxStateExtensionUri)
			{
				return Koppeltaal.Resource.getExtensionValue(status, blackBoxStateExtensionUri, 'Resource');
			},
			setBlackBoxState: function (status, blackBoxStateExtensionUri, blackBoxStateResource)
			{
				Koppeltaal.Resource.setExtensionValue(status, blackBoxStateExtensionUri, blackBoxStateResource, 'Resource');
			},
			// Get/set BlackBoxStateId
			getBlackBoxStateReference: function (status, blackBoxStateExtensionUri)
			{
				var blackBoxStateResource = Koppeltaal.CarePlan.Activity.Status.getBlackBoxState(status, blackBoxStateExtensionUri);
				return blackBoxStateResource ? blackBoxStateResource.reference : blackBoxStateResource;
			},
			setBlackBoxStateReference: function (status, blackBoxStateExtensionUri, blackBoxStateReference)
			{
				var blackBoxStateResource =
						{
							reference: blackBoxStateReference
						};
				this.setBlackBoxState(status, blackBoxStateExtensionUri, blackBoxStateResource);
			}
		};
Koppeltaal.UserMessage =
		{
			ContentExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/UserMessage#Content',
			SubjectStringExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/UserMessage#SubjectString',
			FromExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/UserMessage#From',
			ToExtensionUri: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/UserMessage#To',
			getContent: function (usermessage)
			{
				var extension = Koppeltaal.Resource.getExtension(usermessage, this.ContentExtensionUri);
				return extension.valueXhtml;
			},
			getSubjectString: function (usermessage)
			{
				var extension = Koppeltaal.Resource.getExtension(usermessage, this.SubjectStringExtensionUri);
				return extension.valueString;
			},
			getFrom: function (usermessage)
			{
				var extension = Koppeltaal.Resource.getExtension(usermessage, this.FromExtensionUri);
				return extension.valueResource;
			},
			getTo: function (usermessage)
			{
				var extension = Koppeltaal.Resource.getExtension(usermessage, this.ToExtensionUri);
				return extension.valueResource;
			}
		};
Koppeltaal.Patient =
		{
			AgeExtensionUrl: 'http://ggz.koppeltaal.nl/fhir/Koppeltaal/Patient#Age',
			create: function (id)
			{
				var patient =
						{
							resourceType: 'Patient',
							id: id,
							extension: [],
							name: [],
							gender: {}
						};
				return patient;
			},
			setAge: function (patient, age)
			{
				Koppeltaal.Resource.setExtensionValue(patient, this.AgeExtensionUrl, age, 'Integer');
			},
			setGender: function (patient, genderCode)
			{
				if (!patient.gender)
				{
					patient.gender = {};
				}

				patient.gender.coding = [genderCode];
			}
		};
