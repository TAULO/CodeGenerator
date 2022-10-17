jQuery(document).ready(function()
{
	jQuery('.wcuf_file_input').val('');
	jQuery('.delete_button').on('click',wcuf_delete_file);
	jQuery('#wcuf_upload_button').on('click',wcuf_save_all_uploads);
	jQuery('.wcuf_upload_field_button').on('click',wcuf_browse_file);
	
	jQuery('#wcuf_show_popup_button').magnificPopup({
          type: 'inline',
		  showCloseBtn:false,
          preloader: false,
            callbacks: {
            /*
			
			beforeOpen: function() {
              console.log("here");
            }*/
			 /* close: function(event) {
				  wcuf_test(event)
				} */
          } 
        });	
	jQuery('#wcuf_close_popup_alert').on('click',function(event){ event.preventDefault(); event.stopImmediatePropagation(); jQuery.magnificPopup.close(); return false});
	
	if (window.File && window.FileReader && window.FileList && window.Blob) 
	{
		//Old "string encoding" method
		//jQuery('.wcuf_file_input').on('change' ,wcuf_encode_file);
		
		//jQuery('.wcuf_file_input.wcuf_file_input_multiple').on('change', wcuf_check_multiple_file_uploads_limit);
		jQuery(document).on('change','.wcuf_file_input', wcuf_file_input_check);
		jQuery(document).on('click','.wcuf_upload_multiple_files_button', wcuf_start_checks_on_files_info);
	} 
	else 
	{
		jQuery('#wcuf_file_uploads_container').hide();
		wcuf_show_popup_alert(wcuf_html5_error);
	}
});
function wcuf_browse_file(event)
{
	event.preventDefault();
	event.stopImmediatePropagation();
	var id = jQuery(event.currentTarget).data('id');
	jQuery("#wcuf_upload_field_"+id).trigger('click');
	return false;
}
function wcuf_delete_file(event)
{
	wcuf_is_deleting = true;
	jQuery("#wcuf_file_uploads_container").fadeOut(400);
	jQuery("#wcuf_deleting_message").delay(500).fadeIn(400,function()
	{
		//Smooth scroll
		try{
			jQuery('html, body').animate({
				  scrollTop: jQuery('#wcuf_deleting_message').offset().top - 200 //#wcmca_address_form_container ?
				}, 500);
		}catch(error){}
	});
	event.preventDefault();
	event.stopImmediatePropagation();
	var is_temp = jQuery(event.target).data('temp');
	
	if(is_temp == "yes")
		return;
	
	jQuery.post( wcuf_ajaxurl , { action: wcuf_ajax_delete_action, id: jQuery(event.target).data('id'), order_id:wcuf_order_id, is_temp:is_temp } ).done( function(){  window.location.reload(true); /* window.location.href = window.location.href; */    });
	return false;
}
function wcuf_delete_temp_file(event)
{
	event.preventDefault();
	event.stopImmediatePropagation();
	//jQuery("#wcuf_deleting_message").animate({'opacity':'1'}, 200); 
	
	var id = jQuery(event.target).data('id');
	var upload_id = jQuery(event.target).data('upload-id');
	var is_temp = jQuery(event.target).data('temp');
	jQuery('#wcuf_file_name_'+upload_id).html("");
	jQuery('#wcuf_delete_button_box_'+upload_id).fadeOut();
	jQuery('#wcuf_deleting_box_'+upload_id).fadeIn(400);
	jQuery('#wcuf_upload_button').fadeOut(400);
	
	jQuery.post( wcuf_ajaxurl , { action: wcuf_ajax_delete_action, id: id, order_id:wcuf_order_id, is_temp:is_temp } ).done( function()
				{  
					jQuery('#wcuf_feedback_textarea_'+upload_id).prop('disabled', false);
					jQuery("#wcuf_max_size_notice_"+upload_id).removeClass("wcuf_already_uploaded");
					jQuery("#wcuf_disclaimer_label_"+upload_id).removeClass("wcuf_already_uploaded");
					//jQuery("#wcuf_feedback_textarea_"+upload_id).removeClass("wcuf_already_uploaded");
					
					jQuery("#wcuf_upload_field_button_"+upload_id).removeClass("wcuf_already_uploaded");
					jQuery("#wcuf_upload_multiple_files_button_"+upload_id).removeClass("wcuf_already_uploaded");
					jQuery("#wcuf_file_name"+upload_id).removeClass("wcuf_already_uploaded");
					jQuery('#wcuf_upload_field_button_'+upload_id+', #wcuf_max_size_notice_'+upload_id+', #wcuf_feedback_textarea_'+upload_id+', #wcuf_upload_multiple_files_button_'+id).fadeIn(200); 
					check_which_multiple_files_upload_button_show();
					
					jQuery('#wcuf_delete_button_box_'+upload_id).empty(); 
					jQuery('#wcuf_delete_button_box_'+upload_id).fadeIn(); 					
					jQuery('#wcuf_disclaimer_label_'+upload_id).fadeIn(); 					
					
					jQuery('#wcuf_deleting_box_'+upload_id).fadeOut(400);
					jQuery('#wcuf_upload_button').fadeIn(400);
				});
	return false;
}
function check_which_multiple_files_upload_button_show()
{
	jQuery('.wcuf_upload_multiple_files_button:not(".wcuf_already_uploaded")').each(function(index,elem)
	{
		var id = jQuery(this).data('id');
		if(typeof wcuf_multiple_files_queues !== 'undefined' && typeof wcuf_multiple_files_queues[id] !=='undefined' && wcuf_multiple_files_queues[id].length > 0)
			jQuery(this).fadeIn(500);
	});
}
function wcuf_upload_complete(id)//wcuf_append_file_delete
{
	var delete_id = 'wcufuploadedfile_'+id;
	jQuery('#wcuf_file_name_'+id).delay(320).fadeIn(300,function()
	{
		//Smooth scroll
		try{
			jQuery('html, body').animate({
				  scrollTop: jQuery('#wcuf_file_name_'+id).offset().top - 200 //#wcmca_address_form_container ?
				}, 500);
		}catch(error){}
	});
	jQuery('#wcuf_upload_status_box_'+id).delay(300).hide(500);
	jQuery('#wcuf_upload_button').fadeIn(200);
	
	jQuery('.wcuf_crop_container:not(".wcuf_already_uploaded"):not(".wcuf_not_to_be_showed"), .wcuf_disclaimer_label:not(".wcuf_already_uploaded"), .wcuf_file_name:not(".wcuf_already_uploaded"), .wcuf_upload_field_button:not(".wcuf_already_uploaded"), .wcuf_max_size_notice:not(".wcuf_already_uploaded"), .wcuf_feedback_textarea:not(".wcuf_already_uploaded"), .delete_button').fadeIn(500);
	check_which_multiple_files_upload_button_show();
	jQuery('#wcuf_delete_button_box_'+id).append('<button data-temp="yes" class="button delete_button" data-id="'+delete_id+'" data-upload-id="'+id+'">'+wcuf_delete_file_msg+'</button>');
	jQuery('#wcuf_delete_button_box_'+id).on('click', wcuf_delete_temp_file);	
}
function wcuf_reset_loading_ui(id)
{
	jQuery('.wcuf_bar').css('background-color',wcuf_progressbar_color);
	jQuery('#wcuf_upload_button').fadeOut(0);
	jQuery('#wcuf_file_name_'+id).html("");
	jQuery('.wcuf_file_name').fadeOut(0);	
	jQuery('#wcuf_bar_'+id).css('width', "0%");
	
	jQuery('.wcuf_crop_container, .wcuf_disclaimer_label, .wcuf_upload_field_button, .wcuf_upload_multiple_files_button, .wcuf_max_size_notice, .delete_button, .wcuf_feedback_textarea').fadeOut(300);	
	jQuery("#wcuf_crop_container_"+id).addClass("wcuf_already_uploaded");
	jQuery("#wcuf_upload_field_button_"+id).addClass("wcuf_already_uploaded");
	jQuery("#wcuf_upload_multiple_files_button_"+id).addClass("wcuf_already_uploaded");
	jQuery("#wcuf_file_name"+id).addClass("wcuf_already_uploaded");
	jQuery("#wcuf_disclaimer_label_"+id).addClass("wcuf_already_uploaded");
	
	jQuery("#wcuf_max_size_notice_"+id).addClass("wcuf_already_uploaded");
	jQuery('#wcuf_upload_status_box_'+id).show(400,function()
	{
		//Smooth scroll
		try{
			jQuery('html, body').animate({
				  scrollTop: jQuery('#wcuf_upload_status_box_'+id).offset().top - 200 //#wcmca_address_form_container ?
				}, 500);
		}catch(error){}
	});
	jQuery('#wcuf_delete_button_box_'+id).empty();
	jQuery('#wcuf_status_'+id).html(wcuf_loading_msg);
	
}
function wcuf_save_all_uploads(evt)
{
	evt.preventDefault();
	evt.stopImmediatePropagation();
	
	//validation
	 var can_send = true;
	 
	if(typeof wcuf_multiple_files_queues !== 'undefined')
		for (var key in wcuf_multiple_files_queues) {
		  if (wcuf_multiple_files_queues[key].length != 0) {
			  wcuf_show_popup_alert(wcuf_multiple_uploads_error_message);
			  return false;
		  }
		}
	jQuery('.wcuf_file_input').each(function(index,elem)
	{
		var my_id = jQuery(this).data('id');
		if(jQuery(this).prop('required') && jQuery(this).val() == "")
		{
			can_send = false;
		}
	});
	if(!can_send)
	{
		wcuf_show_popup_alert(wcuf_upload_required_message)
		return;
	} 
	
	jQuery('#wcuf_upload_button').fadeOut(200);	
	jQuery('#wcuf_file_uploads_container').fadeOut(200);
	jQuery('#wcuf_progress').delay(250).fadeIn();
	
	var formData = new FormData();
	formData.append('action', 'save_uploaded_files_on_order_detail_page');
	formData.append('order_id', wcuf_order_id);
	var random = Math.floor((Math.random() * 1000000) + 999);
	
	jQuery.ajax({
		url: wcuf_ajaxurl+"?nocache="+random,
		type: 'POST',
		data: formData,
		async: true,
		success: function (data) {
			//wcuf_show_popup_alert(data);
			//window.location.href = window.location.href;
			window.location.reload(true);			
		},
		error: function (data) {
			wcuf_show_popup_alert("Error: "+data);
		},
		cache: false,
		contentType: false,
		processData: false
	});
	return false;
}
function wcuf_file_input_check(evt)
{
	evt.preventDefault();
	evt.stopImmediatePropagation();
	
	if(jQuery(evt.target).prop('multiple'))
	{
		wcuf_manage_multiple_file_browse(evt);
	}
	else
		wcuf_start_checks_on_files_info(evt);
	
	return false;
}
function wcuf_start_checks_on_files_info(evt)
{
	evt.preventDefault();
	evt.stopImmediatePropagation();
	var id =  jQuery(evt.currentTarget).data('id');
	var current_elem = jQuery('#wcuf_upload_field_'+id);
	var max_image_width = current_elem.data("max-width");
	var max_image_height = current_elem.data("max-height");
	var min_image_width = current_elem.data("min-width");
	var min_image_height = current_elem.data("min-height");
	/* var exact_image_size = current_elem.data("exact-image-size"); */
	
	var is_multiple = jQuery(evt.currentTarget).hasClass('wcuf_upload_multiple_files_button');
	if(is_multiple)
	{
		if(typeof wcuf_multiple_files_queues === 'undefined' || typeof wcuf_multiple_files_queues[id] === 'undefined')
			return false;
		
		files = wcuf_multiple_files_queues[id];
	}
	else
	{
		files = evt.target.files;
	}
	if(max_image_width == 0 &&  max_image_height  == 0 &&  min_image_width  == 0 &&  min_image_height  == 0)
		//wcuf_backgroud_file_upload(evt);
		wcuf_check_if_show_cropping_area(evt)
	else
		wcuf_check_image_file_width_and_height(files,evt,wcuf_result_on_files_info, max_image_width, max_image_height, min_image_width, min_image_height);
}
function wcuf_result_on_files_info(evt, error, img, data)
{
	if(!error)
	{
		wcuf_check_if_show_cropping_area(evt)
	}
	else
	{
		var size_string = data.min_image_width != 0 ? "<br/>"+data.min_image_width+" "+wcuf_image_min_width_text+"<br/>" : ""; 
		size_string += data.max_image_width != 0 ? data.max_image_width+" "+wcuf_image_width_text+"<br/>" : ""; 
		size_string += data.min_image_height != 0 ? data.min_image_height+" "+wcuf_image_min_height_text+"<br/>": "";
		size_string += data.max_image_height != 0 ? data.max_image_height+" "+wcuf_image_height_text+"<br/>" : "";
		
		//if(!data.exact_image_size)
			wcuf_show_popup_alert(wcuf_image_size_error+" "+size_string);
		/* else
			wcuf_show_popup_alert(img.name+wcuf_image_exact_size_error+size_string); */
		return false;
	}
		
}
function wcuf_check_if_show_cropping_area(evt)
{
	var is_multiple = jQuery(evt.currentTarget).hasClass('wcuf_upload_multiple_files_button');
	var id = jQuery(evt.currentTarget).data('id');
	var enable_crop = jQuery("#wcuf_upload_field_"+id).data('enable-crop-editor');
	/* console.log(is_multiple);
	console.log(enable_crop); */
	if(!is_multiple && enable_crop)
	{
		new wcuf_image_crop(evt, id,wcuf_backgroud_file_upload);
	}			
	else
		wcuf_backgroud_file_upload(evt);
}
function wcuf_backgroud_file_upload(evt)
{
	evt.preventDefault();
	evt.stopImmediatePropagation();
	var id =  jQuery(evt.currentTarget).data('id');
	var current_elem = jQuery('#wcuf_upload_field_'+id); //jQuery(evt.currentTarget)
	
	var size = current_elem.data('size');
	var file_wcuf_name = current_elem.attr('name');
	var file_wcuf_title = current_elem.data('title');
	var check_disclaimer = current_elem.data('disclaimer');
	var extension =  current_elem.val().replace(/^.*\./, '');
	var extension_accepted = current_elem.attr('accept');
	var file_wcuf_user_feedback = jQuery('#wcuf_feedback_textarea_'+id).val();
	
	
	var files;
    var file;
	var is_multiple = jQuery(evt.currentTarget).hasClass('wcuf_upload_multiple_files_button');

	if(is_multiple)
	{
		if(typeof wcuf_multiple_files_queues === 'undefined' || typeof wcuf_multiple_files_queues[id] === 'undefined')
			return false;
		
		files = wcuf_multiple_files_queues[id];
		file = wcuf_multiple_files_queues[id][0];
	}
	else
	{
		files = evt.target.files;
		if(typeof evt.blob === 'undefined') 
			file = files[0]; 
		else //in case the file (image) has been cropped
			file = evt.blob;
	}
	
	extension =  extension.toLowerCase();
	if(typeof extension_accepted !== 'undefined')
		extension_accepted =  extension_accepted.toLowerCase();
	
	if (location.host.indexOf("sitepointstatic") >= 0) return;
	
	var xhr = new XMLHttpRequest();
	
	//Checkes
	if(check_disclaimer && !jQuery('#wcuf_disclaimer_checkbox_'+id).prop('checked'))
	{
		wcuf_show_popup_alert(wcuf_disclaimer_must_be_accepted_message);
		return false;
	}
	if(is_multiple)
	{
		if(!wcuf_check_multiple_file_uploads_limit(id))
		{
			return false;
		}
	}
	if(jQuery('#wcuf_feedback_textarea_'+id).val() == "" && jQuery('#wcuf_feedback_textarea_'+id).prop('required'))
	{
		wcuf_show_popup_alert(wcuf_user_feedback_required_message)
		return;
	}
	jQuery('#wcuf_feedback_textarea_'+id).prop('disabled', true);
	
		if (xhr.upload && 
			/* file.type == "image/jpeg" && */ 
			(extension_accepted == undefined || extension_accepted.indexOf(extension) > -1) &&
			file.size <= size) 
			{
				//UI			
				wcuf_reset_loading_ui(id);
				
				// progress bar
				xhr.upload.addEventListener("progress", function(e) 
				{
					var pc = parseInt((e.loaded / e.total * 100));
					jQuery('#wcuf_bar_'+id).css('width', pc+"%");
					jQuery('#wcuf_percent_'+id).html(pc + "%");
				}, false);
				xhr.upload.addEventListener("load",function(e)
				{
					//wcuf_append_file_delete(id);
					wcuf_upload_complete(id);
				},false);
				// file received/failed
				xhr.onreadystatechange = function(e) {
					if (xhr.readyState == 4) 
					{
						jQuery('#wcuf_status_'+id).html(xhr.status == 200 ? wcuf_success_msg : wcuf_failure_msg);
					}
				};

				var formData = new FormData();
				xhr.open("POST", wcuf_ajaxurl, true);
				formData.append('action', wcuf_ajax_action); //'upload_file_during_checkout_or_product_page'
				formData.append('title', file_wcuf_title);
				formData.append('user_feedback', file_wcuf_user_feedback);
				formData.append('order_id', wcuf_order_id);
				if(files.length == 1)
				{
					var tempfile_name  = wcuf_replace_bad_char(file.name);
					var quantity = typeof file.quantity !== 'undefined' ? file.quantity : 1;
					formData.append(file_wcuf_name, file, tempfile_name); //file id used as key
					formData.append('multiple', 'no');
					formData.append('quantity_0', quantity);
					jQuery('#wcuf_file_name_'+id).html(tempfile_name);
				}
				else
				{
					formData.append('multiple', 'yes');
					for(var i = 0; i < files.length; i++)
					{
						var tempfile_name  = wcuf_replace_bad_char(files[i].name);
						var quantity = typeof files[i].quantity !== 'undefined' ? files[i].quantity : 1;
						formData.append('quantity_'+i, quantity);
						if(i == 0)
						{
							formData.append(file_wcuf_name, files[i], tempfile_name);
							//jQuery('#wcuf_file_name_'+id).html(files[i].name);
						}
						else
						{
							formData.append(file_wcuf_name+"_"+i, files[i], tempfile_name);
							//jQuery('#wcuf_file_name_'+id).html(jQuery('#wcuf_file_name_'+id).html()+"<br/>"+files[i].name);
						}
					}
				}
				if(typeof wcuf_multiple_files_queues !== 'undefined' && typeof wcuf_multiple_files_queues[id] !== 'undefined')
					wcuf_multiple_files_queues[id] = new Array();
				try{
					setTimeout(function(){xhr.send(formData)},600);
				}catch(e){wcuf_show_popup_alert(e)}

			}	
			else
			{
				wcuf_display_file_size_or_ext_error(file, size, extension_accepted);
			}
}
function wcuf_replace_bad_char(text)
{
	text = text.replace("'","");
	text = text.replace('"',"");
	return text;
}
function wcuf_show_popup_alert(text)
{
	jQuery('#wcuf_alert_popup_content').html(text);
	jQuery('#wcuf_show_popup_button').trigger('click');
}
function wcuf_display_file_size_or_ext_error(file, size, extension_accepted)
{
	var msg = file.name+wcuf_file_size_error+(size/(1024*1024))+" MB<br/>";
	msg += wcuf_type_allowed_error+" "+extension_accepted;
	wcuf_show_popup_alert(msg);
}
function wcuf_check_multiple_file_uploads_limit(id)
{
	var fileUpload = jQuery('#wcuf_upload_field_'+id);
	var max_size = fileUpload.data("size");
	var max_num = fileUpload.data("max-files");
	var min_num = fileUpload.data("min-files");
	var extension_accepted = fileUpload.attr('accept');
	var error = false;
	var files = wcuf_multiple_files_queues[id];
	var all_files_quantity_sum = 0;
	
	if(typeof extension_accepted !== 'undefined')
		extension_accepted =  extension_accepted.toLowerCase();
	
	//Computing number of files and their quantity
	for (var i=0; i<files.length; i++)
	{
		all_files_quantity_sum += typeof files[i].quantity !== 'undefined' ? files[i].quantity : 1;
	}
	
	//if (parseInt($fileUpload.get(0).files.length) > max_num)
	if (max_num != 0 && /* files.length */ all_files_quantity_sum > max_num)
	{
		wcuf_show_popup_alert(wcuf_file_num_error+max_num);
		error = true;
	}
	else if(min_num != 0 && /* files.length */ all_files_quantity_sum < min_num)
	{
		wcuf_show_popup_alert(wcuf_minimum_required_files_message+min_num);
		error = true;
	}
	else 
	{
		var msg="";
		for(var i = 0; i < files.length; i++)
		{
			var name = files[i].name;
			var extension =  name.replace(/^.*\./, '');
			extension =  extension.toLowerCase();
	
			if(files[i].size > max_size || (extension_accepted != undefined && extension_accepted.indexOf(extension) == -1))
			{
				msg += name+wcuf_file_size_error+(max_size/(1024*1024))+" MB<br/>"; //with alert <br/> => \n
				msg += wcuf_type_allowed_error+" "+extension_accepted+"<br/><br/>";
			}
		}
			
		if(msg != "")
		{
			wcuf_show_popup_alert(msg);
			error = true;
		}
	}
	
	if(error)
	{
		/* event.stopImmediatePropagation();
		event.preventDefault(); */
		return false;
	}
	return true;
}
/* function wcuf_check_multiple_file_uploads_limit(event)
{
	 var $fileUpload = jQuery(event.currentTarget);
	 var max_size = jQuery(event.currentTarget).data("size");
	 var max_num = jQuery(event.currentTarget).data("max-files");
	
	 var extension_accepted = jQuery(event.currentTarget).attr('accept');
	 var error = false;
	 
	if (parseInt($fileUpload.get(0).files.length) > max_num)
	{
		wcuf_show_popup_alert(wcuf_file_num_error+max_num);
		error = true;
	}
	else 
	{
		var msg="";
		for(var i = 0; i < $fileUpload.get(0).files.length; i++)
		{
			var name = $fileUpload.get(0).files[i].name;
			var extension =  name.replace(/^.*\./, '');
			if($fileUpload.get(0).files[i].size > max_size || (extension_accepted != undefined && extension_accepted.indexOf(extension) == -1))
			{
				msg += name+wcuf_file_size_error+(max_size/(1024*1024))+" MB\n";
				msg += wcuf_type_allowed_error+" "+extension_accepted;
			}
		}
			
		if(msg != "")
		{
			wcuf_show_popup_alert(msg);
			error = true;
		}
	}
	
	if(error)
	{
		event.stopImmediatePropagation();
		event.preventDefault();
		return false;
	}
} */