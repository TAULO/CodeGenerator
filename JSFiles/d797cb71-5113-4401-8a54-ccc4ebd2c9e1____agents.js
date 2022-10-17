
var agents = agents || {},

	tableAgents = null;

(function ( $ ) {
	var rules = {
			text : function(text){
				 var re = /\S+/;
				 return re.test(text);	
			}
	};
	 var setError = function(id,message, parent){
			$('#' + id).addClass('error_required')
			if ($("#error_" + id).length == 0){
				parent.append('<p  id="error_' + id + '" class="input-group-addon error-required-message" >' + message + '</p>');	
				parent.removeClass("col-md-4");
				parent.addClass("col-md-6");
			}
	 }
	 var clearError = function(id,parent) {
			$("#" + id).removeClass('error_required')
			$("#error_" + id).remove();
			parent.removeClass("col-md-6");
			parent.addClass("col-md-4");
	 }
	var fields_required = [];
	var init = function(_this){
		while(fields_required.length > 0) {
			fields_required.pop();
		}
		_this.find('input').each(function( index ) {
			 var that = $(this);
			
			  var name = that.attr('name');
	          var type = that.attr('type');
	    	  var value =  $(that).val();
	          if (that.attr('required')=='required'){
	        	  fields_required.push({name : name,  type : type, value : value,});
	          }	
		});
	}
	$.fn.validate = function() {
		 
		var options = {
			    	error_required : {
			    		name : $error.enterAgentName
			    		
			    	},
			    	errorHandler : {
			    		name : function(id,message, parent){
			    			 setError(id,message, parent);
			    		}
			    	},
			    	errorClear : {
			    		name : function(id,parent){
			    			 clearError(id,parent);
			    		}
			    	}
			    };
		
		  init(this);
		  var errors = [] ;
		  for (var i=0; i < fields_required.length; i++ ){
			  var id =  fields_required[i].name;
			  var arg = $("#" + id).val();
			  var parent = $("#" + id).parent();
			  if (rules[fields_required[i].type](arg)){
				 options.errorClear[fields_required[i].name](id,parent); 
			  }
			  else{
				  options.errorHandler[fields_required[i].name](id,options.error_required[fields_required[i].name], parent );
				  errors.push(1);
			  }
	        }
		  
		  return errors.length > 0 ? false : true ;
	}
	$.fn.save = function() {
		
		var headers = {},
			params = [],
			data = { params : params},
			$message = $("#agents_save_message");
		
		headers[core.gcsrf().headerName] = core.gcsrf().token;
		
		this.find('input').each(function( index ) {
  		   var that = $(this);
		   var name = that.attr('name');
	       var value =  $(that).val();
	       data.params.push({name: name, value : value});
		});
		
		$.ajax({
			  type: "POST",
			  url: "saveAgent",
			  data: JSON.stringify(data),
			  contentType : 'application/json',
			  dataType: "json",
			  headers : headers ,    	
			  success: function(e){
				  if (e.response.endsWith("Error")){
					  $("#errorAgentsDiv").removeClass("hidden");
					  $("#errorAgentText").html($error.saveAgent);
					
				  }	else{
					  $message.removeClass("alert-danger");
					  $message.removeClass("hidden");
					  $message.addClass("alert-success");
					  setTimeout( function() { $message.addClass('hidden'); }, 3000);
					  $message.html("Agent is saved");
					  agents.initialize();
				  }
			  },
			  error : function(e) {
				  $message.removeClass("alert-success");
				  $message.removeClass("hidden");
				  $message.addClass("alert-danger");
				  $message.html("fail");
					
				}
			});	
	}
}( jQuery ));

agents.extensionWarnDel = function(d){

	var url = 'getExtension?id=' + d;
	$.ajax({
		  type: "GET",
		  url: url,
		  contentType : 'application/json',
		  dataType: "json",
		  success: function(e){
			  
			  agents.deletetedExtension().text(e.response);
			  agents.extension_del_warning().parent().removeClass('hidden');
		  },
		  error : function(e) {
		
				console.log("ERROR: ", e);
			}
		});	
	
	
}
agents.deleteExtension = function(){
	
	var extansion = agents.deletetedExtension().text();
	
	var headers = {};
	
	headers[core.gcsrf().headerName] = core.gcsrf().token;
	
	var data = {name: "extansion", value: extansion};
	
	$.ajax({
		  type: "POST",
		  url: "deleteExtension",
		  data: JSON.stringify(data),
		  contentType : 'application/json',
		  dataType: "json",
		  headers : headers ,    	
		  success: function(e){
			
			 if (e.response == 'Deleted'){
				 
				  agents.extension_del_warning().parent().addClass('hidden');
				  
				  agents.save_done().parent().removeClass('hidden');
				  
				  agents.save_done().text('Extension deleted');

				  setTimeout( function() { agents.save_done().parent().addClass('hidden'); }, 3000);
				  
				  agents.initialize();
			 }
			 if (e.response == 'Error'){
				 
				  agents.extension_del_warning().parent().addClass('hidden');
				  
				  agents.save_error().parent().removeClass('hidden');
				  
				  agents.save_error().text('Error deleting extension!');
				  
				  setTimeout( function() { agents.save_error().parent().addClass('hidden');  }, 3000);
				 
			 }
		  },
		  error : function(e) {
			  agents.save_error().parent().removeClass('hidden');
			  
			  agents.save_error().text('Error deleting extension!');
			  
			  setTimeout( function() { agents.save_error().parent().addClass('hidden');  }, 3000);
			}
		});		
}
agents.edit = function(d){
	
	var input 		= '#input_' 	+ d;
	var penalty     = '#penalty_' 	+ d;
	var btnEdit 	= '#btn_edit_'	+ d;
	var btnCansel 	= '#btn_cansel_'+ d;
	var btnSave 	= '#btn_save_'	+ d;
	var btnDel      = '#btn_del_' +   d;
	
	$(input).removeAttr('disabled');
	$(input).removeClass('inputExtension');
	$(input).addClass('inputEdit');
	
	$(penalty).removeAttr('disabled');
	$(penalty).removeClass('inputExtension');
	$(penalty).addClass('inputEdit');
	
	
	$(btnEdit).addClass('hidden');
	$(btnDel).addClass('hidden');
	$(btnCansel).removeClass('hidden');
	$(btnSave).removeClass('hidden');
	
}
agents.canselEdit = function(d){

	var input 		= '#input_' 	+ d;
	var penalty     = '#penalty_' 	+ d;
	var btnEdit 	= '#btn_edit_'	+ d;
	var btnCansel 	= '#btn_cansel_'+ d;
	var btnSave 	= '#btn_save_'	+ d;
	var btnDel      = '#btn_del_' +   d;
	
	$(input).attr('disabled','disabled');
	$(input).removeClass('inputEdit');
	$(input).addClass('inputExtension');
	
	$(penalty).attr('disabled','disabled');
	$(penalty).removeClass('inputEdit');
	$(penalty).addClass('inputExtension');
	
	$(btnEdit).removeClass('hidden');
	$(btnDel).removeClass('hidden');
	$(btnCansel).addClass('hidden');
	$(btnSave).addClass('hidden');
}
agents.addAgentInQueue = function(d){

	
	agents.assignAgentCourses().removeClass('hidden');
	
	$.ajax({
		  type: "GET",
		  url: "queues",
		  contentType : 'application/json',
		  dataType: "json",
		  success: function(e){
			 agents.selectCourses().empty();
			 for(var i=0; i< e.courses.length; i++){  
				 var option1 = document.createElement("option");
				 option1.setAttribute("value", e.courses[i].coursename);
				 option1.innerHTML = e.courses[i].coursename;
				 agents.selectCourses().append(option1);
			 }
		  },
		  error : function(e) {
		
				console.log("ERROR: ", e);
			}
		});	
	
	var url ='getAgentName?id=' + d;
	
	$.ajax({
		  type: "GET",
		  url: url,
		  contentType : 'application/json',
		  dataType: "json",
		  success: function(e){
			
			  $("#agent_name_1").text(e.name);
			 
		  },
		  error : function(e) {
		
				console.log("ERROR: ", e);
			}
		});	
	
}
agents.assingAgent = function(){
	
	
	
	if ($("#extension").val().length == 0){
		 
		  agents.save_error().parent().removeClass('hidden');
		  
		  agents.save_error().text('Empty value for an extension is not allowed!');
		  
		  setTimeout( function() { agents.save_error().parent().addClass('hidden');  }, 3000);
		  
		  return;
		  
	}

    var headers = {},		  
	assign = { 
			name : $("#agent_name_1").text(),
			extension : $("#extension").val(),
			curses : $("#select_curses :selected").text(),
			penalty : $("#penalty").val()
			
	};
	
	headers[core.gcsrf().headerName] = core.gcsrf().token;
	
	
	$.ajax({
		  type: "POST",
		  url: "assignAgent",
		  data: JSON.stringify(assign),
		  contentType : 'application/json',
		  dataType: "json",
		  headers : headers ,    	
		  success: function(e){
			  
			
			  if (e.response == 'Saved'){
				  
				  agents.assignAgentCourses().addClass('hidden');
				  
				  agents.save_done().parent().removeClass('hidden');
				  
				  agents.save_done().text('Agent and Queue Extension Saved');

				  setTimeout( function() { agents.save_done().parent().addClass('hidden'); }, 3000);
				  
				  agents.initialize();
				  
				  agents.save_error().parent().addClass('hidden');
			  }
			  if (e.response == 'Error'){
				  agents.save_error().parent().removeClass('hidden');
				  
				  agents.save_error().text('Error saving data!');
				  
				  setTimeout( function() { agents.save_error().parent().addClass('hidden');  }, 3000);
			  }
			
			  
		  },
		  error : function(e) {
			
			  agents.save_error().parent().removeClass('hidden');
			  
			  agents.save_error().text('Agent and Queue Extension Saved');
			  
			  setTimeout( function() { agents.save_error().parent().addClass('hidden');  }, 3000);
			  
			}
		});		
	
	
}
agents.canselAssing = function(){
	
	$("#assignAgentCourses").addClass('hidden');
	
	 agents.save_error().parent().addClass('hidden');
}
agents.updateExtension = function(d){
	
	var input = '#input_' 	+ d;
	var penalty = '#penalty_' + d;

	
	
	if ($(input).val().length == 0 ){
		 
		  agents.save_error().parent().removeClass('hidden');
		  
		  agents.save_error().text('Empty value for an extension is not allowed!');
		  
		  setTimeout( function() { agents.save_error().parent().addClass('hidden');  }, 3000);
		  
		  return;
		
	}
	
	var	updateextension = {id: d, extension: $(input).val(), penalty : $(penalty).val() },
	headers = {};

	headers[core.gcsrf().headerName] = core.gcsrf().token;

	$.ajax({
		  type: "POST",
		  url: "updateExtension",
		  data: JSON.stringify(updateextension),
		  contentType : 'application/json',
		  dataType: "json",
		  headers : headers ,    	
		  success: function(e){
			  if (e.response == 'Updated'){
				  
				  agents.assignAgentCourses().addClass('hidden');
				  
				  agents.save_done().parent().removeClass('hidden');
				  
				  agents.save_done().text('Agent and Queue Extension Updated');

				  setTimeout( function() { agents.save_done().parent().addClass('hidden'); }, 3000);
				  
				  agents.initialize();
				  
				  agents.save_error().parent().addClass('hidden');
			  }
			  if (e.response == 'Error'){
				 
				  agents.save_error().parent().removeClass('hidden');
				  
				  agents.save_error().text('Error Updating data!');
				  
				  setTimeout( function() { agents.save_error().parent().addClass('hidden'); }, 3000);
			  }
		  } , 
		 error : function(e) {
					
			  agents.save_error().parent().removeClass('hidden');
			  
			  agents.save_error().text('Error Updating data!');
			  
			  setTimeout( function() { agents.save_error().parent().addClass('hidden'); }, 3000);
			}
		});
}
agents.initialize = function(){
	
	 var format  = function ( d ) {
		var str='<table class="table table-bordered" >'+
				'<thead><tr class="text-center-small"><td  class="col-xs-3">Queue</td><td>Ext</td><td>Penalty</td><td  class="col-xs-4">Action</td></thead>';
		for (var i=0; i < d.childSet.length; i++){
			
			var id = d.childSet[i].id ;
			
			str = str + '<tr ><td>' + d.childSet[i].courseName + '</td>'+
			
			'<td >'+
			
			'<input class="inputExtension" id = "input_'+ id + '"  type="text" value="' + d.childSet[i].extension + '" disabled /> ' + 
			
			'</div>'+
			
			'<td>'+
			
			'<input class="inputExtension" id = "penalty_'+ id + '"  type="text" value="' + d.childSet[i].penalty + '" disabled /> ' + 
			
			'</td>'+
			
			'<td class="text-center"><div class="btn-toolbar">'+
			
			'<button id = "btn_edit_' + id  + '" class="btn-warning btn-xs" onclick="agents.edit(\'' + id +'\')">'+
			
			'<i class="fa fa fa-pencil" aria-hidden="true"></i></button>'+
			
			'<button id="btn_del_' + id  + '" class="btn-danger btn-xs" onclick="agents.extensionWarnDel(\'' + id +'\')">'+
			
			'<i class="fa fa-minus-circle" aria-hidden="true"></i></button>'+
			
			'<button id="btn_save_'+ id  + '" class="btn-success btn-xs hidden" onclick="agents.updateExtension(\'' + id +'\')">'+
			
			'<i class="fa fa-floppy-o" aria-hidden="true"></i></button>'+
			
			'<button  id="btn_cansel_'+ id  + '" class="btn-success btn-xs hidden" onclick="agents.canselEdit(\'' + id +'\')">'+
			
			'<i class="fa fa-ban" aria-hidden="true"></i></button>'+
			
			'</div></td></tr>';
			
			
		}
		str = str + '</table>';
	    return str;
	}	
	var hadnleAgentButton = function(data, btnAddToQueue ){
		return '<div class="btn-toolbar">' + 
//		'<button type="button" class="btn-success btn-xs" data-toggle="tooltip" data-placement="top" title="Add Agent to Queue"' + 
//		'onclick="agents.warningQueue(\'' + data +'\')"><i class="fa fa-plus-circle" aria-hidden="true"></i></button>'+
		'<button type="button" class="btn-danger btn-xs"  data-toggle="tooltip" data-placement="top" title="Delete Agent"'+
		'onclick="agents.warningDel(\'' + data +'\')"><i class="fa fa-minus-circle" aria-hidden="true"></i></button>' + 
		'<button ype="button" class="btn-success btn-xs" onclick="agents.addAgentInQueue(\'' + data +'\')">'+
		'<i class="fa fa-plus-circle" aria-hidden="true"></i></button>'
	    '</div>';	
	}
	
	
	if (tableAgents !=  null){
		tableAgents.destroy();
	}
	
	$.ajax({
		  type: "GET",
		  url: "agents",
		  contentType : 'application/json',
		  dataType: "json",
		  success: function(agents){
			  
			  $("#agentTableDiv").empty();
			 
			  var tb = $('<table/>', {
				    'id':	'tableAgents',
				    'class': 'table table-bordered'
				}).appendTo("#agentTableDiv");
				
			  
			  var dataSet = [];
			  var e = agents;
			  for(var i=0; i < e.agents.length; i++){
				  var childSet = [];
				  for(j=0; j< e.agents[i].coursesExtension.length; j++){
					  childSet.push({
						  'courseName' : e.agents[i].coursesExtension[j].courseName, 
						  'extension' :  e.agents[i].coursesExtension[j].extension,
						  'penalty'   :  e.agents[i].coursesExtension[j].penalty,
						  'id'        :  e.agents[i].coursesExtension[j].id
						  
					  });
				  }
				  
				  dataSet.push({
					  id : e.agents[i].id,
					  name : e.agents[i].name,
					  childSet    : childSet
					  
				  });
			  	}
			  tableAgents = $('#tableAgents')
			  	.on('click', 'td.details-control', function(){
			  		  
			  		  tableAgents.off('click');
					
					  var tr = $(this).closest('tr');
					  var row = tableAgents.row( tr );
					  if ( row.child.isShown() ) {
				            row.child.hide();
				            tr.removeClass('shown');
				        }
				        else {
				            row.child( format(row.data()) ).show();
				            tr.addClass('shown');
				        }
				  })
				  .DataTable({
					 	data : dataSet,
					 	columns : [
					                {
						                "className":      "details-control",
						                "orderable":      false,
						                "data":           null,
						                "defaultContent": '',
						                "width": "10%"
						            },
						            { title  : $label.name,    data: "name" },
						            {  title : $label.action,  data: "id", "className" : "text-center",  "render" : function( data, type, row, meta){

						            	return hadnleAgentButton(data,"Button");
						            	
						             }}						        
						         ],	
					
						paging: false,
						info:     false,
						searching : false 
				});
				  
		  },
		  error : function(e) {
		
				console.log("ERROR: ", e);
			}
		});	

/*	
		if (tableAgents !=  null){
			tableAgents.destroy();
		}
		tableAgents = $('#tableAgents').DataTable({
			"ajax": {
				"url" : "agents", 
	       		"type": "GET",
	            "dataSrc": "agents",
	            "error": function(){
	            
	            	console.log("data loading...");
	            	}
				},
				"columns": [
				             { title  : $label.id,   	data: "id" },
				             { title  : $label.name,    data: "name" },
				             {  title : $label.action,  data: "id", "className" : "text-center",  "render" : function( data, type, row, meta){
				            	
				            	 return agents.hadnleAgentButton(data,"Button");
				             }}
				        
				         ],	
			'iDisplayLength': 100,
			"paging": false,
			"info":     false,
			"searching" : false 
			});
*/			
}
agents.save = function(){

	if ($("#formAgent").validate()){
		$("#formAgent").save();
	}
}
agents.close = function(){
	
	$("#addNewAgentPanel").addClass("hidden");
	$("#agents_save_message").addClass("hidden");
}
agents.warningCancel = function(){
	agents.warningAgentAddQueueDiv().addClass("hidden");
}
agents.addAgent = function(){
	
	$("#addNewAgentPanel").removeClass("hidden");
}
agents.warningQueue = function(id){
	
	agents.warningAgentAddQueueDiv().removeClass("hidden");
	
	agents.warningAgentAddQueueText().html($message.addAgentWithId + ": [" + id + "] "  + 	$message.toQueue );
	
	$.ajax({
		  type: "GET",
		  url: "queues",
		  contentType : 'application/json',
		  dataType: "json",
		  success: function(e){
			 agents.selectQueue().empty();
			 for(var i=0; i< e.courses.length; i++){  
				 var option1 = document.createElement("option");
				 option1.setAttribute("value", e.courses[i].coursename);
				 option1.innerHTML = e.courses[i].coursename;
 			 	 agents.selectQueue().append(option1);
			 }
		  },
		  error : function(e) {
		
				console.log("ERROR: ", e);
			}
		});	
	
	
	$.ajax({
		  type: "GET",
		  url: "phones",
		  contentType : 'application/json',
		  dataType: "json",
		  success: function(e){
			agents.selectPhone().empty();
			for(var i=0; i< e.phones.length; i++){
				var option2 = document.createElement("option");
				option2.setAttribute("value",e.phones[i].id );
				option2.innerHTML = e.phones[i].pnumber;
				agents.selectPhone().append(option2);
				
			}
			 
		  },
		  error : function(e) {
		
				console.log("ERROR: ", e);
			}
		});	
	
	
	
	agents.btnAgentQueue().attr("onclick","agents.addAgentToQueue('" + id + "')");
}
agents.addAgentToQueue = function(id){
	
//	var queue = $("#selectQueue :selected").text();
	var pnumber = $("#selectPhone :selected").text();
	
	var queue = $("#selectQueue").val();
	
	
	var	AgentQueue = {id: id, queue: queue, pnumber : pnumber },
		headers = {};
	
	headers[core.gcsrf().headerName] = core.gcsrf().token;
	
	$.ajax({
		  type: "POST",
		  url: "addToQueue",
		  data: JSON.stringify(AgentQueue),
		  contentType : 'application/json',
		  dataType: "json",
		  headers : headers ,    	
		  success: function(e){
			
			  agents.warningCancel();
			  
		  },
		  error : function(e) {
				console.log("ERROR: ", e);
				
			}
		});
	
	
}
agents.selectPhone = function(){
	return $("#selectPhone");
}
agents.warningAgentAddQueueText = function(){
	return $("#warningAgentAddQueueText");
}
agents.warningDel = function(id){
	
	var url ='getAgentName?id=' + id;
	
	$.ajax({
		  type: "GET",
		  url: url,
		  contentType : 'application/json',
		  dataType: "json",
		  success: function(e){
			
			  
			    agents.warningDiv().removeClass("hidden");
				
				agents.warningText().html($message.deleteAgent +" [" + e.name + "]?");
				
				agents.btnDelete().attr("onclick","agents.deleteAgent('" + id + "')");
			  
				
			 
		  },
		  error : function(e) {
		
				console.log("ERROR: ", e);
			}
		});	
		
	
	
}
agents.worningCancel = function(){
	agents.warningDiv().addClass("hidden");
}

agents.deleteAgent = function(id){
	var headers = {};
	headers[core.gcsrf().headerName] = core.gcsrf().token;
	var data = {name: "id", value: id};
	$.ajax({
		  type: "POST",
		  url: "deleteAgent",
		  data: JSON.stringify(data),
		  contentType : 'application/json',
		  dataType: "json",
		  headers : headers ,    	
		  success: function(e){
				
			    agents.warningDiv().addClass('hidden');
				 
				 if (e.response == 'Deleted'){
					  agents.save_done().parent().removeClass('hidden');
					  
					  agents.save_done().text('Agent has been deleted');

					  setTimeout( function() { agents.save_done().parent().addClass('hidden'); }, 3000);
					  
					  agents.initialize();
				 }
				 if (e.response == 'Error'){
					  agents.save_error().parent().removeClass('hidden');
					  
					  agents.save_error().text('Error deleting Agent!');
					  
					  setTimeout( function() { agents.save_error().parent().addClass('hidden');  }, 3000);
					 
				 }
			  },
			  error : function(e) {
				  
				  agents.warningDiv().addClass('hidden');
				  
				  agents.save_error().parent().removeClass('hidden');
				  
				  agents.save_error().text('Error deleting Agent!');
				  
				  setTimeout( function() { agents.save_error().parent().addClass('hidden');  }, 3000);
				}		
		});	
}

agents.closeAgentError = function(){
	$("#errorAgentsDiv").addClass("hidden");
	$("#errorAgentText").html("");
}
agents.warningDiv = function(){
	
	return $("#warningAgentDelDiv");
}
agents.warningText = function(){
	
	return $("#warningAgentDelText");
}
agents.btnDelete = function(){
	
	return $("#btnAgentDelete");
	
}
agents.warningAgentAddQueueDiv = function(){
	
	return $("#warningAgentAddQueueDiv");
	
}
agents.selectQueue = function(){
	return $("#selectQueue");
}
agents.selectCourses = function(){
	
	return $("#select_curses");
}

agents.assignAgentCourses = function(){
	
	return $("#assignAgentCourses");
	
}
agents.btnAgentQueue = function(){
	
	return $("#btnAgentQueue");
	
}
agents.extension = function(){
	
	return $("extension");
	
}
agents.select_curses = function(){
	
	return $("#select_curses");
	
}
agents.agent_name_1 = function(){
	
	return $("#agent_name_1");
	
}
agents.save_error = function(){
	return $("#save_error");
}
agents.save_done = function(){
	return $("#save_done");
}
agents.extension_del_warning = function(){
	
	return $("#extension_del_warning");
	
}
agents.deletetedExtension = function(){
	
	return $("#deletetedExtension");
}
agents.addNewAgentPanel = function(){
	
	return $("#addNewAgentPanel");
}

