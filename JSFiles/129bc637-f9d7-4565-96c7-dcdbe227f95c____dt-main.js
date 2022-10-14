$(document).ready(function() {

	var $body = $('body');

	var $flowchart = null;
	var $container = null;
	var $draggableOperators = null;

	$body.on('click','[data-dt-action]', function(e) {
		e.preventDefault();
		var $this = $(this);
		var action = $this.data('dt-action');	
		switch (action) {
			case 'main':
				break;
			case 'user-main':
				load_section('/user/list');
				break;
			case 'user-page':
				var userId = $this.data('user-id');
				load_section('/user/' + userId + '/page');
				break;
			case 'actor-main':
				load_section('/actor/list');
				break;
			case 'actor-page':
				var actorId = $this.data('actor-id');
				load_section('/actor/' + actorId + '/page');
				break;
			case 'extension-main':
				load_section('/extension/list');
				break;
			case 'extension-page':
				var extensionId = $this.data('extension-id');
				load_section('/extension/' + extensionId + '/page');
				break;
			case 'module-main':
				load_section('/module/list');
				break;
			case 'module-page':
				$('#flowchart-controls').empty();
				$('#flowchartworkspace').empty();
				$('#flowchart-properties').empty();
				$('#flowchart-properties-data').empty();
				var moduleId = $this.data('module-id');
				if($('.content').length) {
					$('.content').load('/module/' + moduleId + '/page', function(data,status,xhr) {
						$.get('/module/' + moduleId + '/body', function(d) {
							$flowchart = $('#flowchartworkspace');
							$container = $flowchart.parent();
							$flowchart.flowchart({
								data: JSON.parse(d),
								linkWidth: 2,
								defaultSelectedLinkColor: '#000055',
								grid: 10,
								multipleLinksOnInput: false,
								multipleLinksOnOutput: true
							});
							$flowchart.flowchart({
								onOperatorSelect: function(operatorId) {
									$('#flowchart-properties-data').show();
									var data = $flowchart.flowchart('getOperatorData',operatorId);
									$('#flowchart-properties-data').html(getPropertiesTable(data,moduleId));
									return true;
								},
								onOperatorUnselect: function() {
									$('#flowchart-properties-data').hide();
									return true;
								},
								onLinkSelect: function(linkId) {
									return true;
								},
								onLinkUnselect: function() {
									return true;
								}
							});
							$draggableOperators = $('.flowchart-draggable-operator');
							$draggableOperators.draggable({
								cursor: "move",
								opacity: 0.7,
								appendTo: 'body',
								zIndex: 1000,
								helper: function(e) {
									var $this = $(this);
									var data = getOperatorData($this);
									return $flowchart.flowchart('getOperatorElement', data);
								},
								stop: function(e, ui) {
									var $this = $(this);
									var elOffset = ui.offset;
									var containerOffset = $container.offset();
									if (elOffset.left > containerOffset.left &&	elOffset.top > containerOffset.top && elOffset.left < containerOffset.left + $container.width() && elOffset.top < containerOffset.top + $container.height()) {
										var flowchartOffset = $flowchart.offset();
										var relativeLeft = elOffset.left - flowchartOffset.left;
										var relativeTop = elOffset.top - flowchartOffset.top;
										var positionRatio = $flowchart.flowchart('getPositionRatio');
										relativeLeft /= positionRatio;
										relativeTop /= positionRatio;
										var data = getOperatorData($this);
										data.left = relativeLeft;
										data.top = relativeTop;
										$flowchart.flowchart('addOperator',data);
									}
								}
							});
							
						});
					});
					$('[data-ma-action="aside-open"],.sidebar').removeClass('toggled');
		            $('.content,.header').find('.ma-backdrop').remove();
				}
				break;
			case 'project-main':
				load_section('/project/list');
				break;
			case 'application-main':
				load_section('/application/list');
				break;
			case 'application-page':
				var applicationId = $this.data('application-id');
				load_section('/application/' + applicationId + '/page');
				break;
			case 'project-page':
				var projectId = $this.data('project-id');
				load_section('/project/' + projectId + '/page');
				break;
			case 'endpoint-page':
				var endpointId = $this.data('endpoint-id');
				load_section('/endpoint/' + endpointId + '/page');
				break;
			case 'collection-page':
				var collectionId = $this.data('collection-id');
				load_section('/collection/' + collectionId + '/page');
				break;
			case 'mqtt-channel-page':
				var channelId = $this.data('mqtt-channel-id');
				load_section('/mqtt/' + channelId + '/page');
				break;
		}
	});
	
	function load_section(url){
		if($('.content').length){
			$('.content').load(url,function(data,status,xhr){
				console.log('load: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
				error_handler(xhr.status);				
			});
			$('[data-ma-action="aside-open"],.sidebar').removeClass('toggled');
            $('.content,.header').find('.ma-backdrop').remove();
		}
	}

	// APPLICATION -->
	
	$(document).on('click',"button[id='btn-application-token-add']", function() {
		var url = '/application/token';
		var applicationId = $(this).data("applicationId");
		$.post(url,{applicationId:applicationId}, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/application/' + applicationId + '/page');
		});
	});

	$(document).on('click',"button[name='btn-application-token-copy']", function() {
		var tokenId = $(this).data("tokenId");
		console.log(tokenId);
		copyToClipboard(tokenId);
	});
	
	$(document).on('click',"button[name='btn-application-token-remove']", function() {
		var url = '/application/token/remove';
		var applicationId = $(this).data("applicationId");
		var tokenId = $(this).data("tokenId");
		$.post(url,{tokenId:tokenId}, function(data,status,xhr) {			
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/application/' + applicationId + '/page');
		});
	});

    // --

	$(document).on('click',"button[id='btn-role-application-assign']", function() {
		var url = '/application/assign/role';
		var applicationId = $("#applicationId").val();
		var roleName = $("#roleName").val();
		$(document).find("div[id='modal-role-application-assign']").modal('hide');
		$.post(url,{applicationId:applicationId,roleName:roleName}, function(data,status,xhr) {			
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/application/' + applicationId + '/page');
		});
	});

	$(document).on('click',"button[name='btn-role-application-assign-remove']", function() {
		var applicationId = $(this).data("applicationId");
		var roleId = $(this).data("roleId");
		var roleName = $(this).data("roleName");
		$("#remove-application-id").val(applicationId);
		$("#remove-role-id").val(roleId);
		$("#remove-role-name").val(roleName);
		$("#modal-role-application-assign-remove").find(".modal-body").html("Are you sure you want to remove role <b>" + roleName + "</b>?");	
	});

	$(document).on('click',"button[name='btn-role-application-assign-remove-execute']", function() {	
		var roleId = $("#remove-role-id").val();
		var roleName = $("#remove-role-name").val();
		var applicationId = $("#remove-application-id").val();
		var url = '/application/assign/role/remove';
		$(document).find("div[id='modal-role-application-assign-remove']").modal('hide');
		$.post(url,{applicationId:applicationId,roleId:roleId}, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/application/' + applicationId + '/page');
		});
	});

	// --

	$(document).on('click',"button[id='btn-application-add']", function() {
		var url = '/application/add';
		var applicationName = $("#applicationName").val();
		var applicationDescription = $("#applicationDescription").val();
		$(document).find("div[id='modal-application-add']").modal('hide');
		$.post(url,{applicationName:applicationName,applicationDescription:applicationDescription}, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/application/list');
		});
	});

	$(document).on('click',"button[name='btn-application-delete']", function() {
		var applicationId = $(this).data("applicationId");
		var applicationName = $(this).data("applicationName");
		$("#delete-application-id").val(applicationId);
		$("#delete-application-name").val(applicationName);
		$("#modal-application-delete").find(".modal-body").html("Are you sure you want to delete '<b>" + applicationName + "</b>'?");	
	});

	$(document).on('click',"button[name='btn-application-delete-execute']", function() {	
		var applicationId = $("#delete-application-id").val();
		var url = '/application/' + applicationId + '/delete';
		$(document).find("div[id='modal-application-delete']").modal('hide');
		$.get(url, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/application/list');
		});	
	});
	
	// MQTT -->
	
	$(document).on('click',"button[id='btn-mqtt-add']", function() {
		var url = '/mqtt/add';
		var channelName = $("#channelName").val();
		var channelDescription = $("#channelDescription").val();
		var channelServer = $("#channelServer").val();
		var channelServerUsername = $("#channelServerUsername").val();
		var channelServerPassword = $("#channelServerPassword").val();
		var channelTopic = $("#channelTopic").val();
		var applicationId = $("#applicationId").val();		
		$(document).find("div[id='modal-mqtt-add']").modal('hide');
		$.post(url,{channelName:channelName,channelDescription:channelDescription, channelServer:channelServer,channelServerUsername:channelServerUsername,channelServerPassword:channelServerPassword,channelTopic:channelTopic,applicationId:applicationId}, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/application/' + applicationId + '/page');
		});
	});
	
	$(document).on('click',"button[name='btn-mqtt-delete']", function() {
		var applicationId = $(this).data("applicationId");
		var mqttChannelId = $(this).data("mqttChannelId");
		var mqttChannelName = $(this).data("mqttChannelName");
		$("#delete-mqtt-application-id").val(applicationId);
		$("#delete-mqtt-channel-id").val(mqttChannelId);
		$("#delete-mqtt-channel-name").val(mqttChannelName);
		$("#modal-mqtt-delete").find(".modal-body").html("Are you sure you want to delete '<b>" + mqttChannelName + "</b>'?");	
	});

	$(document).on('click',"button[name='btn-mqtt-delete-execute']", function() {	
		var applicationId = $("#delete-mqtt-application-id").val();
		var channelId = $("#delete-mqtt-channel-id").val();
		var url = '/mqtt/' + channelId + '/delete';
		$(document).find("div[id='modal-mqtt-delete']").modal('hide');
		$.get(url, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/application/' + applicationId + '/page');
		});
	});
	
	$(document).on('change',"input[name='channelState']", function() {	
		var value = $(this).val();
		var channelId = $(this).data("mqttChannelId");
		var url = '/mqtt/' + channelId + '/state/' + value;
		$.get(url, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/mqtt/' + channelId + '/page');
		});
	});
	
	// ENDPOINT -->
	
	$(document).on('click',"button[id='btn-endpoint-add']", function() {
		var url = '/endpoint/add';
		var endpointName = $("#endpointName").val();
		var endpointDescription = $("#endpointDescription").val();
		var applicationId = $("#applicationId").val();		
		$(document).find("div[id='modal-endpoint-add']").modal('hide');
		$.post(url,{endpointName:endpointName,endpointDescription:endpointDescription,applicationId:applicationId}, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/application/' + applicationId + '/page');
		});
	});
	
	$(document).on('click',"button[name='btn-endpoint-delete']", function() {
		var applicationId = $(this).data("applicationId");
		var endpointId = $(this).data("endpointId");
		var endpointName = $(this).data("endpointName");
		$("#delete-endpoint-application-id").val(applicationId);
		$("#delete-endpoint-id").val(endpointId);
		$("#delete-endpoint-name").val(endpointName);
		$("#modal-endpoint-delete").find(".modal-body").html("Are you sure you want to delete '<b>" + endpointName + "</b>'?");	
	});

	$(document).on('click',"button[name='btn-endpoint-delete-execute']", function() {	
		var applicationId = $("#delete-endpoint-application-id").val();
		var endpointId = $("#delete-endpoint-id").val();
		var url = '/endpoint/' + endpointId + '/delete';
		$(document).find("div[id='modal-endpoint-delete']").modal('hide');
		$.get(url, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/application/' + applicationId + '/page');
		});
	});

	// COLLECTION -->

	$(document).on('click',"button[id='btn-collection-create']", function() {
		$(document).find("div[id='modal-collection-create']").modal('hide');
		var url = '/collection/create';
		var projectId = $("#projectId").val();
		var endpointId = $("#endpointId").val();
		$.post(url,{endpointId:endpointId,projectId:projectId},function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/endpoint/' + endpointId + '/page');
		});
	});

	$(document).on('click',"button[name='btn-collection-delete']", function() {
		var collectionId = $(this).data("collectionId");
		var endpointId = $(this).data("endpointId");
		$("#delete-endpoint-id").val(endpointId);
		$("#delete-collection-id").val(collectionId);
		$("#modal-collection-delete").find(".modal-body").html("Are you sure you want to delete data collection '<b>" + collectionId + "</b>'?");	
	});

	$(document).on('click',"button[name='btn-collection-delete-execute']", function() {	
		var collectionId = $("#delete-collection-id").val();
		var endpointId = $("#delete-endpoint-id").val();
		var url = '/collection/' + collectionId + '/delete';
		$(document).find("div[id='modal-collection-delete']").modal('hide');
		$.get(url, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/endpoint/' + endpointId + '/page');
		});
	});
		
	$(document).on('change',"input[name='collectionState']", function() {	
		var value = $(this).val();
		var collectionId = $(this).data("collectionId");
		var url = '/collection/' + collectionId + '/state/' + value;
		$.get(url, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/collection/' + collectionId + '/page');
		});
	});

	// FILE -->

	$(document).on('change',"input[id='file']" , function() {
  		var fileName = $(this).val().split("\\").pop();
  		var collectionId = $(this).data("collectionId");
  		$(this).siblings(".custom-file-label").addClass("selected").html(fileName);
  		var formData = new FormData();
  		formData.append('file', $(this)[0].files[0]);
  		formData.append('collectionId', collectionId);
  		$.ajax({
        	type: 'post',
        	url: '/collection/upload',
        	processData: false,
        	contentType: false,
        	data: formData,
        	success: function (response) {
				load_section('/collection/' + collectionId + '/page');
       		}
    	});
	});

	$(document).on('click',"button[name='btn-file-delete']", function() {
		var collectionId = $(this).data("collectionId");
		var fileId = $(this).data("fileId");
		var fileName = $(this).data("fileName");
		$("#delete-file-id").val(fileId);
		$("#delete-collection-id").val(collectionId);
		$("#modal-file-delete").find(".modal-body").html("Are you sure you want to delete file '<b>" + fileName + "</b>'?");	
	});

	$(document).on('click',"button[name='btn-file-delete-execute']", function() {	
		var fileId = $("#delete-file-id").val();
		var collectionId = $("#delete-collection-id").val();
		var url = '/file/' + fileId + '/delete';
		$(document).find("div[id='modal-file-delete']").modal('hide');
		$.get(url, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/collection/' + collectionId + '/page');
		});
	});

	$(document).on('click',"button[name='btn-file-download']", function() {	
		var fileId = $(this).data("fileId");
		location.href = '/file/' + fileId + '/download';
	});
	
	
	$(document).on('change',"select[name='extensionTypeId']", function() {	
		var extensionTypeId = $(this).val();
		var fileId = $(this).data("fileId");
		var collectionId = $(this).data("collectionId");
		var url = '/file/' + fileId + '/type/' + extensionTypeId + '/update';
		$.get(url, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/collection/' + collectionId + '/page');
		});
	});

	// PROJECT --
	
	$(document).on('click',"button[id='btn-project-add']", function() {
		$(document).find("div[id='modal-project-add']").modal('hide');
		var url = '/project/add';
		var projectName = $("#projectName").val();
		var projectDescription = $("#projectDescription").val();
		$.post(url,{projectName:projectName,projectDescription:projectDescription}, function(data,status,xhr) {			
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/project/list');
		});
	});
	
	$(document).on('click',"button[name='btn-project-delete']", function() {
		var projectId = $(this).data("projectId");
		var projectName = $(this).data("projectName");
		$("#delete-project-id").val(projectId);
		$("#delete-project-name").val(projectName);
		$("#modal-project-delete").find(".modal-body").html("Are you sure you want to delete '<b>" + projectName + "</b>'?");	
	});

	$(document).on('click',"button[name='btn-project-delete-execute']", function() {	
		$(document).find("div[id='modal-project-delete']").modal('hide');
		var projectId = $("#delete-project-id").val();
		var url = '/project/' + projectId + '/delete';
		$.get(url, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/project/list');
		});	
	});

	// PROJECT PROPERTY --

	$(document).on('click',"button[id='btn-project-property-add']", function() {
		var projectId = $("#projectId").val();
		var url = '/project/' + projectId + '/property/add';
		var propertyName = $("#propertyName").val();
		var propertyValue = $("#propertyValue").val();
		$.post(url,{propertyName:propertyName,propertyValue:propertyValue}, function(data,status,xhr) {
			$(document).find("div[id='modal-project-property-add']").modal('hide');
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/project/' + projectId + '/page');
		});
	});

	$(document).on('click',"button[name='btn-project-property-delete']", function() {
		var projectId = $(this).data("projectId");
		var propertyId = $(this).data("propertyId");
		var propertyName = $(this).data("propertyName");
		$("#delete-project-id").val(projectId);
		$("#delete-project-property-id").val(propertyId);
		$("#delete-project-property-name").val(propertyName);
		$("#modal-project-property-delete").find(".modal-body").html("Are you sure you want to delete property '<b>" + propertyName + "</b>'?");	
	});

	$(document).on('click',"button[name='btn-project-property-delete-execute']", function() {	
		var projectId = $("#delete-project-id").val();
		var projectPropertyId = $("#delete-project-property-id").val();
		var url = '/project/' + projectId + '/property/' + projectPropertyId + '/delete';
		$.get(url, function(data,status,xhr) {
			$(document).find("div[id='modal-project-property-delete']").modal('hide');
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/project/' + projectId + '/page');
		});	
	});

	// USER --

	$(document).on('click',"button[id='btn-role-user-assign']", function() {
		var url = '/user/assign/role';
		var userId = $("#userId").val();
		var roleId = $("#roleId").val();
		var roleName = $("#roleId").find(':selected').data("roleName");
		$(document).find("div[id='modal-role-user-assign']").modal('hide');
		$.post(url,{userId:userId,roleId:roleId,roleName:roleName}, function(data,status,xhr) {			
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/user/' + userId + '/page');
		});
	});

	$(document).on('click',"button[name='btn-role-user-assign-remove']", function() {
		var userId = $(this).data("userId");
		var roleId = $(this).data("roleId");
		var roleName = $(this).data("roleName");		
		$("#remove-user-id").val(userId);
		$("#remove-role-id").val(roleId);
		$("#remove-role-name").val(roleName);
		$("#modal-role-user-assign-remove").find(".modal-body").html("Are you sure you want to remove role <b>" + roleName + "</b>?");	
	});

	$(document).on('click',"button[name='btn-role-user-assign-remove-execute']", function() {	
		var roleId = $("#remove-role-id").val();
		var roleName = $("#remove-role-name").val();
		var userId = $("#remove-user-id").val();
		var url = '/user/assign/role/remove';
		$(document).find("div[id='modal-rolet-user-assign-remove']").modal('hide');
		$.post(url,{userId:userId,roleId:roleId,roleName:roleName}, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/user/' + userId + '/page');
		});
	});

	// --

	$(document).on('click',"button[id='btn-project-user-assign']", function() {
		var url = '/user/assign/project';
		var userId = $("#userId").val();
		var projectId = $("#projectId").val();
		$(document).find("div[id='modal-project-user-assign']").modal('hide');
		$.post(url,{userId:userId,projectId:projectId}, function(data,status,xhr) {			
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/project/' + projectId + '/page');
		});
	});

	$(document).on('click',"button[name='btn-project-user-assign-remove']", function() {
		var projectId = $(this).data("projectId");
		var userId = $(this).data("userId");
		var userEmail = $(this).data("userEmail");		
		$("#remove-project-id").val(projectId);
		$("#remove-user-id").val(userId);
		$("#remove-user-email").val(userEmail);
		$("#modal-project-user-assign-remove").find(".modal-body").html("Are you sure you want to remove user <b>" + userEmail + "</b>?");	
	});

	$(document).on('click',"button[name='btn-project-user-assign-remove-execute']", function() {	
		var projectId = $("#remove-project-id").val();
		var userId = $("#remove-user-id").val();
		var url = '/user/assign/project/remove';
		$(document).find("div[id='modal-project-user-assign-remove']").modal('hide');
		$.post(url,{userId:userId,projectId:projectId}, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/project/' + projectId + '/page');
		});	
	});

	// MODULE --

	$(document).on('click',"button[id='btn-module-add']", function() {
		var url = '/module/add';
		var moduleName = $("#moduleName").val();
		var moduleDescription = $("#moduleDescription").val();
		$.post(url,{moduleName:moduleName,moduleDescription:moduleDescription}, function(data,status,xhr) {
			$(document).find("div[id='modal-module-add']").modal('hide');
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/module/list');
		});		
	});

	$(document).on('click',"button[name='btn-module-delete']", function() {
		var moduleId = $(this).data("moduleId");
		var moduleName = $(this).data("moduleName");
		$("#delete-module-id").val(moduleId);
		$("#delete-module-name").val(moduleName);
		$("#modal-module-delete").find(".modal-body").html("Are you sure you want to delete '<b>" + moduleName + "</b>'?");	
	});

	$(document).on('click',"button[name='btn-module-delete-execute']", function() {	
		var moduleId = $("#delete-module-id").val();
		var url = '/module/' + moduleId + '/delete';
		$.get(url, function(data,status,xhr) {
			$(document).find("div[id='modal-module-delete']").modal('hide');
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/module/list');
		});	
	});

	$(document).on('click',"button[name='btn-module-enable']", function() {
		var moduleId = $(this).data("moduleId");
		var url = '/module/' + moduleId + '/enable';
		$.get(url, function(data,status,xhr){
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/module/list');
		});
	});

	$(document).on('click',"button[name='btn-module-disable']", function() {
		var moduleId = $(this).data("moduleId");
		var url = '/module/' + moduleId + '/disable';
		$.get(url, function(data,status,xhr){
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/module/list');
		});
	});

	$(document).on('change',"input[name='runtimeState']", function() {	
		var value = $(this).val();
		var url = '/runtime/state/' + value;
		$.get(url, function(data,status,xhr) {
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/module/list');
		});
	});

	// ACTOR --

	$(document).on('click',"button[id='btn-actor-add']", function() {
		var url = '/actor/add';
		var actorName = $("#actorName").val();
		var actorBean = $("#actorBean").val();
		var actorInputNum = $("#actorInputNum").val();
		var actorOutputNum = $("#actorOutputNum").val();
		$.post(url,{actorName:actorName,actorBean:actorBean,actorInputNum:actorInputNum,actorOutputNum:actorOutputNum}, function(data,status,xhr) {
			$(document).find("div[id='modal-module-add']").modal('hide');
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/actor/list');
		});
	});

	$(document).on('click',"button[name='btn-actor-delete']", function() {
		var actorId = $(this).data("actorId");
		var actorName = $(this).data("actorName");
		$("#delete-actor-id").val(actorId);
		$("#delete-actor-name").val(actorName);
		$("#modal-actor-delete").find(".modal-body").html("Are you sure you want to delete actor '<b>" + actorName + "</b>'?");	
	});

	$(document).on('click',"button[name='btn-actor-delete-execute']", function() {	
		var actorId = $("#delete-actor-id").val();
		var url = '/actor/' + actorId + '/delete';
		$.get(url, function(data,status,xhr) {
			$(document).find("div[id='modal-actor-delete']").modal('hide');
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/actor/list');
		});	
	});
	
	// ACTOR PROPERTY --

	$(document).on('click',"button[id='btn-actor-property-add']", function() {
		var actorId = $("#actorId").val();
		var url = '/actor/' + actorId + '/property/add';
		var propertyName = $("#propertyName").val();
		var propertyValue = $("#propertyValue").val();
		$.post(url,{propertyName:propertyName,propertyValue:propertyValue}, function(data,status,xhr) {
			$(document).find("div[id='modal-actor-property-add']").modal('hide');
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/actor/' + actorId + '/page');
		});
	});

	$(document).on('click',"button[name='btn-actor-property-delete']", function() {
		var actorId = $(this).data("actorId");
		var propertyId = $(this).data("propertyId");
		var propertyName = $(this).data("propertyName");
		$("#delete-actor-id").val(actorId);
		$("#delete-actor-property-id").val(propertyId);
		$("#delete-actor-property-name").val(propertyName);
		$("#modal-actor-property-delete").find(".modal-body").html("Are you sure you want to delete property '<b>" + propertyName + "</b>'?");	
	});

	$(document).on('click',"button[name='btn-actor-property-delete-execute']", function() {	
		var actorId = $("#delete-actor-id").val();
		var actorPropertyId = $("#delete-actor-property-id").val();
		var url = '/actor/' + actorId + '/property/' + actorPropertyId + '/delete';
		$.get(url, function(data,status,xhr) {
			$(document).find("div[id='modal-actor-property-delete']").modal('hide');
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/actor/' + actorId + '/page');
		});	
	});
	
	// FILE EXTENSION --

	$(document).on('click',"button[id='btn-extension-add']", function() {
		var url = '/extension/add';
		var extensionId = $("#extensionId").val();
		$.post(url,{extensionId:extensionId}, function(data,status,xhr) {
			$(document).find("div[id='modal-extension-add']").modal('hide');
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/extension/list');
		});
	});

	$(document).on('click',"button[name='btn-extension-delete']", function() {
		var extensionId = $(this).data("extensionId");
		$("#delete-extension-id").val(extensionId);
		$("#modal-extension-delete").find(".modal-body").html("Are you sure you want to delete file extension '" + extensionId + "'?");	
	});

	$(document).on('click',"button[name='btn-extension-delete-execute']", function() {	
		var actorId = $("#delete-extension-id").val();
		var url = '/extension/' + extensionId + '/delete';
		$.get(url, function(data,status,xhr) {
			$(document).find("div[id='modal-extension-delete']").modal('hide');
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/extension/list');
		});	
	});

	// FILE EXTENSION TYPE --
	
	$(document).on('click',"button[id='btn-extension-type-add']", function() {
		var extensionId = $("#extensionId").val();
		var url = '/extension/' + extensionId + '/type/add';
		var extensionTypeName = $("#extensionTypeName").val();
		$.post(url,{extensionTypeName:extensionTypeName}, function(data,status,xhr) {
			$(document).find("div[id='modal-extension-type-add']").modal('hide');
			error_handler(xhr.status);
			console.log('post: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/extension/' + extensionId + '/page');
		});
	});

	$(document).on('click',"button[name='btn-extension-type-delete']", function() {
		var extensionId = $("#extensionId").val();
		var extensionTypeId = $(this).data("extensionTypeId");
		var extensionTypeName = $(this).data("extensionTypeName");
		$("#delete-extension-id").val(extensionId);
		$("#delete-extension-type-id").val(extensionTypeId);
		$("#delete-extension-type-name").val(extensionTypeName);
		$("#modal-extension-type-delete").find(".modal-body").html("Are you sure you want to delete type '<b>" + extensionTypeName + "</b>'?");	
	});

	$(document).on('click',"button[name='btn-extension-type-delete-execute']", function() {	
		var extensionId = $("#delete-extension-id").val();
		var extensionTypeId = $("#delete-extension-type-id").val();
		var url = '/extension/' + extensionId + '/type/' + extensionTypeId + '/delete';
		$.get(url, function(data,status,xhr) {
			$(document).find("div[id='modal-extension-type-delete']").modal('hide');
			error_handler(xhr.status);
			console.log('get: ' + url + ', statusCode: ' + xhr.status + ', status: ' + status);
			load_section('/extension/' + extensionId + '/page');
		});	
	});
	
	// SYSTEM --

	function error_handler(status) {
		switch(status){
			case 401:
				$('.content').html('authentication error');
				break;
			case 404:
				$('.content').html('not found');
				break;
			case 500:
				$('.content').html('server error');
				break;
		}
	}
	
	// FLOWCHART --

	$(document).on('click',"button[id='btn_actor_del']", function() {
		$flowchart.flowchart('deleteSelected');
	});

	$(document).on('click',"button[id='btn_actor_upd']", function() {
		var moduleId = $(this).data("moduleId");
		var moduleBody = JSON.stringify($flowchart.flowchart('getData'));
		$.post("/module/body", {moduleId:moduleId,moduleBody:moduleBody}, function() {
			console.log('module updated: ' + moduleBody);
		});
	});
	
	$(document).on('keyup',"input[name='property']", function() {					
		var selectedOperatorId = $flowchart.flowchart('getSelectedOperatorId');
		if(selectedOperatorId != null) {
			var propertyName = $(this).attr("id");
			var propertyValue = $(this).val();
			$flowchart.flowchart('setOperatorProperty', selectedOperatorId, propertyName, propertyValue);
		}
	});

	function getPropertiesTable(data,moduleId) {
		var table = "<table class='flowchart-table'>";
			for(property in data.properties) {
				if(!(property === "inputs" || property === "outputs")) {
					table += "<tr><td>" + property + "</td><td><input type='text' id='" + property + "' name='property' value='" + data.properties[property] + "'/></td></tr>";
				}
			}
			table += "<tr><td colspan='2' class='b'>";
			table += "<button id='btn_actor_upd' data-module-id=" + moduleId + " class='btn btn-light btn--icon-text btn-sm float-right ml-1'><i class='zmdi zmdi-save'></i> Save</button>";
			table += "<button id='btn_actor_del' data-module-id=" + moduleId + " class='btn btn-light btn--icon-text btn-sm float-right ml-1'><i class='zmdi zmdi-delete'></i> Delete</button>";
			table += "</td></tr>";
			table += "</table>";
		return table;
	}

	function getOperatorData($element) {
		var nbInputs = parseInt($element.data('nb-inputs'), 10);
		var nbOutputs = parseInt($element.data('nb-outputs'), 10);
		var nbId = $element.data('nb-id');
		var data = {
			properties: {
				title: $element.text(),
				inputs: {},
				outputs: {}
			}
		};
		$.get('/actor/' + nbId + '/properties', function(response) {
			var propertyList = JSON.parse(response);
			for(property of propertyList){
				data.properties[property.name] = property.value;
			}						
		});
		for (i=0;i<nbInputs;i++){
			data.properties.inputs['input_' + i] = {
				label: 'Input ' + (i + 1)
			};
		}
		for(i=0;i<nbOutputs;i++){
			data.properties.outputs['output_' + i] = {
				label: 'Output ' + (i + 1)
			};
		}
		return data;
	}
	
	function copyToClipboard(val) {
    	var $temp = $("<input>");
    	$("body").append($temp);
    	$temp.val(val).select();
    	document.execCommand("copy");
    	$temp.remove();
	}
});