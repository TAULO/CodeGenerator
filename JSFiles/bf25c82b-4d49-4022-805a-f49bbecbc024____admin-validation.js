$(document).ready(function()
{  //brand hide n show in manage seller 
$(".coupon").click(function(){
	  var check_sel_id=$(this).attr('lang');
	  var brand=$(this).attr('lang');
	  var add=$(this).attr('lang');
	  var can=$(this).attr('lang');
	   $('#coupon'+check_sel_id).hide();
	   $('#brand_'+check_sel_id).show();
	   $('#add'+add).show();
	   $('#can'+can).show();
	});
	/*$(".btn_coupon").blur(function(){
	  var check_sel_id=$(this).attr('lang');
	  var brand=$(this).attr('lang');
	  var add=$(this).attr('lang');
	  var can=$(this).attr('lang');
	   $('#coupon'+check_sel_id).show();
	   $('#brand_'+check_sel_id).hide();
	   $('#add'+add).hide();
	   $('#can'+can).hide();
	});*/
	$(".can").click(function(){
	  var check_sel_id=$(this).attr('lang');
	  var brand=$(this).attr('lang');
	  var add=$(this).attr('lang');
	  var can=$(this).attr('lang');
	   $('#coupon'+check_sel_id).show();
	   $('#brand_'+check_sel_id).hide();
	   $('#add'+add).hide();
	   $('#can'+can).hide();
	});
	$(".add").click(function(){
	  var check_sel_id=$(this).attr('lang');
	  var brand=$(this).attr('lang');
	  var add=$(this).attr('lang');
	  var can=$(this).attr('lang');
	  var brand_=document.getElementById('brand_'+check_sel_id).value;
	  if(isNaN(brand_))
	  {
	   $('#coupon'+check_sel_id).hide();
	  }
	  else
	  {
	   $('#coupon'+check_sel_id).show();
	   $('#brand_'+check_sel_id).hide();
	   $('#add'+add).hide();
	   $('#can'+can).hide();
	  }
	});
	
	
	
	//hide and show manage coupon
	$(".co").click(function(){
	  var check_sel_id=$(this).attr('lang');
	  var brand=$(this).attr('lang');
	  var addc=$(this).attr('lang');
	  var canc=$(this).attr('lang');
	   $('#co'+check_sel_id).hide();
	   $('#co_'+check_sel_id).show();
	   $('#addc'+addc).show();
	   $('#canc'+canc).show();
	});
	/*$(".cupon").blur(function(){
	  var check_sel_id=$(this).attr('lang');
	  var brand=$(this).attr('lang');
	   $('#co'+check_sel_id).show();
	   $('#co_'+check_sel_id).hide();
	});*/
	$(".addc").click(function(){
	  var check_sel_id=$(this).attr('lang');
	  var brand=$(this).attr('lang');
	  var addc=$(this).attr('lang');
	  var canc=$(this).attr('lang');
	  var co_=document.getElementById('co_'+check_sel_id).value;
	  if(isNaN(co_))
	  {
		$('#co'+check_sel_id).hide();  
	  }
	  else
	  {
	   $('#co'+check_sel_id).show();
	   $('#co_'+check_sel_id).hide();
	   $('#addc'+addc).hide();
	   $('#canc'+canc).hide();
	  }
	});
	$(".canc").click(function(){
	  var check_sel_id=$(this).attr('lang');
	  var brand=$(this).attr('lang');
	  var addc=$(this).attr('lang');
	  var canc=$(this).attr('lang');
	   $('#co'+check_sel_id).show();
	   $('#co_'+check_sel_id).hide();
	   $('#addc'+addc).hide();
	   $('#canc'+canc).hide();
	});
	$('.cate_menu').click(function(){
	 var cate_id=$(this).attr('value');
	 var check=$(this);
	 $('#Loading').show();
	 if($(this).is(':checked'))
	 {
		 var param={'category_id':cate_id,'category_menu':1};
	 }
	 else
	 {
		 var param={'category_id':cate_id,'category_menu':0};
	 }
     $.ajax({
				url:site_url+'superadmin/categories/menucategory/',
				type:'POST',
				data:param,
				success:function(res)
				{  
				  $('#Loading').hide();
				  if(res=='limit')
				  {
					$('#message_limit').show();	  
					$('#message_limit').html('you can only 5 category add to header');
					check.removeAttr('checked');
				  }
				}
		  });  
	});
	$('.add').click(function(){
				var check_sel_id=$(this).attr('lang');
				var totalcoupon=document.getElementById('brand_'+check_sel_id).value;
			 	if(isNaN(totalcoupon))
				{
					$('#error_brans'+check_sel_id).show();
			     $('#error_brans'+check_sel_id).fadeIn(1000);	
			    document.getElementById('error_brans'+check_sel_id).innerHTML="Number required.";
				 setTimeout(function(){
				$('#brand_').css('border-color','#dddfe0');
				$('#error_brans'+check_sel_id).fadeOut('slow');
								
			},1000);
			return false;
					 var param={'coupon':totalcoupon,'check_sel_id':check_sel_id};
					$.ajax({
					url:site_url+'superadmin/admin/addcoupon/',
					type:'POST',
					data:param,
					//dataType:'json',
					success:function(res)
						{  
							return true;
						}
						
				   });
		        }
				if(totalcoupon!="")
				{
					 var param={'coupon':totalcoupon,'check_sel_id':check_sel_id};
					$.ajax({
					url:site_url+'superadmin/admin/addcoupon/',
					type:'POST',
					data:param,
					//dataType:'json',
						success:function(res)
						{   
						   
							return true;
						}
				   });
		        }
				else 
				{
					var param={'coupon':1,'check_sel_id':check_sel_id};
					$.ajax({
					url:site_url+'superadmin/admin/addcoupon/',
					type:'POST',
					data:param,
					//dataType:'json',
						success:function(res)
						{
							
							return true;
						}
				   });
				}
				
	      });
		  
	
	
	
	
	
	
	//add coupon in text	  
	/*$('.btn_coupon').change(function(){
				var check_sel_id=$(this).attr('lang');
				var totalcoupon=$(this).val();
				if(totalcoupon!="")
				{
					 var param={'coupon':totalcoupon,'check_sel_id':check_sel_id};
					$.ajax({
					url:site_url+'superadmin/admin/addcoupon/',
					type:'POST',
					data:param,
					//dataType:'json',
						success:function(res)
						{   
						   
							return true;
						}
				   });
		        }
				else
				{
					var param={'coupon':1,'check_sel_id':check_sel_id};
					$.ajax({
					url:site_url+'superadmin/admin/addcoupon/',
					type:'POST',
					data:param,
					//dataType:'json',
						success:function(res)
						{
							
							return true;
						}
				   });
				}
				
	      });
		  */
		  
		  
		  
		  
		  //
		  
		  $('.addc').click(function(){
				var check_sel_id=$(this).attr('lang');
				var totalcoupon=document.getElementById('co_'+check_sel_id).value;
				
				if(isNaN(totalcoupon))
				{
					$('#error_coupon'+check_sel_id).show();
			     $('#error_coupon'+check_sel_id).fadeIn(1000);	
			    document.getElementById('error_coupon'+check_sel_id).innerHTML="Number required.";
				 setTimeout(function(){
				$('#co_').css('border-color','#dddfe0');
				$('#error_coupon'+check_sel_id).fadeOut('slow');
								
			},1000);
			return false;
					 var param={'coupon':totalcoupon,'check_sel_id':check_sel_id};
					$.ajax({
					url:site_url+'superadmin/admin/coupon/',
					type:'POST',
					data:param,
					//dataType:'json',
						success:function(res)
						{  
							return true;
						}
				   });
		     }
				
				
				
				if(totalcoupon!="")
				{
					 var param={'coupon':totalcoupon,'check_sel_id':check_sel_id};
					$.ajax({
					url:site_url+'superadmin/admin/coupon/',
					type:'POST',
					data:param,
					//dataType:'json',
						success:function(res)
						{  
							return true;
						}
				   });
		     }
			 else
				{
					var param={'coupon':1,'check_sel_id':check_sel_id};
					$.ajax({
					url:site_url+'superadmin/admin/coupon/',
					type:'POST',
					data:param,
					//dataType:'json',
						success:function(res)
						{
							return true;
						}
				   });
				}
			 
	      });	
	
		
		  
	//add coupon in manage seller
	/*$('.cupon').change(function(){
				var check_sel_id=$(this).attr('lang');
				var totalcoupon=$(this).val();
				
				if(totalcoupon!="")
				{
					 var param={'coupon':totalcoupon,'check_sel_id':check_sel_id};
					$.ajax({
					url:site_url+'superadmin/admin/coupon/',
					type:'POST',
					data:param,
					//dataType:'json',
						success:function(res)
						{  
							return true;
						}
				   });
		     }
			 else
				{
					var param={'coupon':1,'check_sel_id':check_sel_id};
					$.ajax({
					url:site_url+'superadmin/admin/coupon/',
					type:'POST',
					data:param,
					//dataType:'json',
						success:function(res)
						{
							return true;
						}
				   });
				}
			 
	      });	
	
	*/
	
	//chk email address already exist or not
	$('.chk_email_address').blur(function()
	{
		var emailaddress=jQuery('#user_email').val();
		//var functionname=jQuery('#chkclass').val();
		var filter=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		
		if(emailaddress=="" || !filter.test(emailaddress))
		{
			 document.getElementById('user_email').value='';
			 jQuery('#user_email').css('border-color', 'red');
			 jQuery('#user_email').html("Enter Email Address");
			 jQuery('#user_email').keyup(function () { jQuery('#user_email').css('border-color', ''); });
		}
		else
		{
			var param={'email':emailaddress};
			$.ajax({
			url:site_url+'superadmin/admin/checkemail/',
			type:'POST',
			data:param,
			//dataType:'json',
			success:function(res)
			{ 
			
				if(res=="exist")
				{ 
					jQuery('#user_email1').fadeIn("slow");	
					jQuery('#user_email').addClass('myerror');
					jQuery("#user_email1").css('color','red');
					jQuery("#user_email1").html('Email Allready Exist');
					jQuery("#user_email1").css("font-size",14);
					jQuery("#btn_user_registration").attr("disabled",true);
				}
				else
				{
					jQuery('#user_email1').fadeIn("slow");	
					jQuery("#user_email1").css('color','green');
					jQuery("#user_email1").html('Email Available');
					jQuery("#user_email1").css("font-size",14);
					jQuery('#user_email1').fadeOut(2000);
					jQuery('#user_email').removeClass('myerror');
					jQuery("#btn_user_registration").removeAttr("disabled");
				}
				return true;
			}
	});
			
		}
	});	
	$('#btn_account').click(function(){
   var file_upload=document.getElementById('file_upload');
   var username=document.getElementById('username');
   var email=document.getElementById('email');
   var phone=document.getElementById('phone');
   var fax=document.getElementById('fax');
   var address=document.getElementById('address');
 
  /* if(file_upload.value=="")
	{
	  $('#error_file_upload').show();
	  $('#error_file_upload').fadeIn(3000);
	  document.getElementById('error_file_upload').innerHTML="The Image field is reuired.";
	  setTimeout(function(){
		  $('#file_upload').css('border-color','#dddfe0');
		  $('#error_file_upload').fadeOut('slow');
	  },3000);
	  return false;
	}*/
	 if(username.value=="")
	{
	  $('#error_username').show();
	  $('#error_username').fadeIn(3000);
	  document.getElementById('error_username').innerHTML="The Username field is reuired.";
	  setTimeout(function(){
		  $('#username').css('border-color','#dddfe0');
		  $('#error_username').fadeOut('slow');
	  },3000);
	  return false;
	}
	else if(!email.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) || email.value=="")
		{
			$('#error_email').show();
			$('#error_email').fadeIn(3000);	
			document.getElementById('error_email').innerHTML="Valid email-id is required.";
			setTimeout(function(){
				$('#email').css('border-color','#dddfe0');
				$('#error_email').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(phone.value=="")
		{ 
			$('#error_phone').show();
			$('#error_phone').fadeIn(3000);	
			document.getElementById('error_phone').innerHTML="The Phone field is required.";
			setTimeout(function(){
				$('#phone').css('border-color','#dddfe0');
				$('#error_phone').fadeOut('slow');
								
			},3000);
			return false;
		}	
		else if(!phone.value.match(/^[\d\.\-\+]+$/))
		{
			$('#error_phone').show();
			$('#error_phone').fadeIn(3000);	
			document.getElementById('error_phone').innerHTML="The field should proper digits only.";
			setTimeout(function(){
				$('#phone').css('border-color','#dddfe0');
				$('#error_phone').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(fax.value=="")
		{ 
			$('#error_fax').show();
			$('#error_fax').fadeIn(3000);	
			document.getElementById('error_fax').innerHTML="The Fax field is required.";
			setTimeout(function(){
				$('#fax').css('border-color','#dddfe0');
				$('#error_fax').fadeOut('slow');
								
			},3000);
			return false;
		}	
		else if(!fax.value.match(/[\+? *[1-9]+]?[0-9 ]+/))
		{ 
			$('#error_fax').show();
			$('#error_fax').fadeIn(3000);	
			document.getElementById('error_fax').innerHTML="The Fax field should proper digits only.";
			setTimeout(function(){
				$('#fax').css('border-color','#dddfe0');
				$('#error_fax').fadeOut('slow');
								
			},3000);
			return false;
		}	
		else if(address.value=="")
		{ 
			$('#error_address').show();
			$('#error_address').fadeIn(3000);	
			document.getElementById('error_address').innerHTML="The Address field is required.";
			setTimeout(function(){
				$('#address').css('border-color','#dddfe0');
				$('#error_address').fadeOut('slow');
								
			},3000);
			return false;
		}	
		
	
  	});
	//validation for admin email
	$('#btn_info_mail').click(function(){
	var info_email=document.getElementById('info_email');
	var contact_email=document.getElementById('contact_email');
	var support_email=document.getElementById('support_email');
    if(!info_email.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) || info_email.value=="")
		{
			$('#error_info_email').show();
			$('#error_info_email').fadeIn(3000);	
			document.getElementById('error_info_email').innerHTML="Valid email-id is required.";
			setTimeout(function(){
				$('#info_email').css('border-color','#dddfe0');
				$('#error_info_email').fadeOut('slow');
								
			},3000);
			return false;
		}
	else if(!contact_email.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) || contact_email.value=="")
		{
			$('#error_contact_email').show();
			$('#error_contact_email').fadeIn(3000);	
			document.getElementById('error_contact_email').innerHTML="Valid Contact email-id is required.";
			setTimeout(function(){
				$('#contact_email').css('border-color','#dddfe0');
				$('#error_contact_email').fadeOut('slow');
								
			},3000);
			return false;
		}
	else if(!support_email.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) || support_email.value=="")
		{
			$('#error_support_email').show();
			$('#error_support_email').fadeIn(3000);	
			document.getElementById('error_support_email').innerHTML="Valid Support email-id is required.";
			setTimeout(function(){
				$('#support_email').css('border-color','#dddfe0');
				$('#error_support_email').fadeOut('slow');
								
			},3000);
			return false;
		}
	});
	//validation for change password
	$('#btn_password').click(function(){
	var current_pass=document.getElementById('current_pass');
	var new_pass=document.getElementById('new_pass');
	var confirm_pass=document.getElementById('confirm_pass');
	if(current_pass.value=="")
	{
			$('#error_current_pass').show();
			$('#error_current_pass').fadeIn(3000);	
			document.getElementById('error_current_pass').innerHTML="The Current password field is required.";
		     setTimeout(function(){
				$('#current_pass').css('border-color','#dddfe0');
				$('#error_current_pass').fadeOut('slow');
								
			},3000);
			return false;
		}			
	else if(new_pass.value=="")
	{
		$('#error_new_pass').show();
		$('#error_new_pass').fadeIn(3000);	
		document.getElementById('error_new_pass').innerHTML="The New password field is required.";
		setTimeout(function(){
		$('#new_pass').css('border-color','#dddfe0');
		$('#error_new_pass').fadeOut('slow');
		},3000);
		return false;
		}			
	else if(confirm_pass.value=="")
	{
			$('#error_confirm_pass').show();
			$('#error_confirm_pass').fadeIn(3000);	
			document.getElementById('error_confirm_pass').innerHTML="The confirm password field is required.";
		     setTimeout(function(){
				$('#confirm_pass').css('border-color','#dddfe0');
				$('#error_confirm_pass').fadeOut('slow');
								
			},3000);
			return false;
		}			
	else if(confirm_pass.value!=new_pass.value)
	{
			$('#error_confirm_pass').show();
			$('#error_confirm_pass').fadeIn(3000);	
			document.getElementById('error_confirm_pass').innerHTML="The confirm password & new password is not same.";
		     setTimeout(function(){
				$('#confirm_pass').css('border-color','#dddfe0');
				$('#error_confirm_pass').fadeOut('slow');
								
			},3000);
			return false;
		}			
	});
	//validation social link
	$('#btn_social').click(function(){
	var facebook_link=document.getElementById('facebook_link');
	var twitter_link=document.getElementById('twitter_link');
	var googleplus=document.getElementById('googleplus');
	var urlregex = /^(http|https|ftp)\:\/\/www\.([-0-9a-zA-Z]+\.)+[a-zA-Z]{2,4}$/;
	if(facebook_link.value=="" )
		{
			$('#error_facebook_link').show();
			$('#error_facebook_link').fadeIn(3000);	
			document.getElementById('error_facebook_link').innerHTML="Facebook URL is required.";
			setTimeout(function(){
				$('#facebook_link').css('border-color','#dddfe0');
				$('#error_facebook_link').fadeOut('slow');
								
			},3000);
			return false;
		}
	else if(facebook_link.value!="" && !urlregex.test(facebook_link.value))
		{
			$('#error_facebook_link').show();
			$('#error_facebook_link').fadeIn(3000);	
			document.getElementById('error_facebook_link').innerHTML="Enter valid URL.";
			setTimeout(function(){
				$('#facebook_link').css('border-color','#dddfe0');
				$('#error_facebook_link').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(twitter_link.value=="")
		{
			$('#error_twitter_link').show();
			$('#error_twitter_link').fadeIn(3000);	
			document.getElementById('error_twitter_link').innerHTML="Twitter URL is required.";
			setTimeout(function(){
				$('#twitter_link').css('border-color','#dddfe0');
				$('#error_twitter_link').fadeOut('slow');
								
			},3000);
			return false;
		}
		
		else if(!urlregex.test(twitter_link.value))
		{
			$('#error_twitter_link').show();
			$('#error_twitter_link').fadeIn(3000);	
			document.getElementById('error_twitter_link').innerHTML="Enter valid URL.";
			setTimeout(function(){
				$('#twitter_link').css('border-color','#dddfe0');
				$('#error_twitter_link').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(googleplus.value=="")
		{
			$('#error_googleplus').show();
			$('#error_googleplus').fadeIn(3000);	
			document.getElementById('error_googleplus').innerHTML="Googleplus URL is required.";
			setTimeout(function(){
				$('#googleplus').css('border-color','#dddfe0');
				$('#error_googleplus').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(!urlregex.test(googleplus.value))
		{
			$('#error_googleplus').show();
			$('#error_googleplus').fadeIn(3000);	
			document.getElementById('error_googleplus').innerHTML="Enter valid URL.";
			setTimeout(function(){
				$('#googleplus').css('border-color','#dddfe0');
				$('#error_googleplus').fadeOut('slow');
								
			},3000);
			return false;
		}
		
	});
	
	//Validation For update points start
	$('#btn_update_point').click(function(){
	var fb_share_point=document.getElementById('fb_share_point');
	var like_point=document.getElementById('like_point');
	var coupon_commnet_point=document.getElementById('coupon_commnet_point');
	var community_point=document.getElementById('community_point');
	
	if(fb_share_point.value=="" )
	{
			$('#error_fb_share_point').show();
			$('#error_fb_share_point').fadeIn(3000);	
			document.getElementById('error_fb_share_point').innerHTML="Facebook share point is required.";
			setTimeout(function(){
				$('#fb_share_point').css('border-color','#dddfe0');
				$('#error_fb_share_point').fadeOut('slow');
								
			},3000);
			return false;
		}
	else if(isNaN(fb_share_point.value))
	{
			$('#error_fb_share_point').show();
			$('#error_fb_share_point').fadeIn(3000);	
			document.getElementById('error_fb_share_point').innerHTML="Facebook share point is only numeric field.";
			setTimeout(function(){
			$('#fb_share_point').css('border-color','#dddfe0');
			$('#error_fb_share_point').fadeOut('slow');
			},3000);
			return false;
	 }
	else if(like_point.value=="" )
	{
			$('#error_like_point').show();
			$('#error_like_point').fadeIn(3000);	
			document.getElementById('error_like_point').innerHTML="Like point is required.";
			setTimeout(function(){
			$('#like_point').css('border-color','#dddfe0');
			$('#error_like_point').fadeOut('slow');
			},3000);
			return false;
		}
	else if(isNaN(like_point.value))
	{
			$('#error_like_point').show();
			$('#error_like_point').fadeIn(3000);	
			document.getElementById('error_like_point').innerHTML="Like point is only numeric field.";
			setTimeout(function(){
			$('#like_point').css('border-color','#dddfe0');
			$('#error_like_point').fadeOut('slow');
			},3000);
			return false;
	 }
	else if(coupon_commnet_point.value=="" )
	{
			$('#error_coupon_commnet_point').show();
			$('#error_coupon_commnet_point').fadeIn(3000);	
			document.getElementById('error_coupon_commnet_point').innerHTML="Coupon commnet point is required.";
			setTimeout(function(){
			$('#coupon_commnet_point').css('border-color','#dddfe0');
			$('#error_coupon_commnet_point').fadeOut('slow');
			},3000);
			return false;
	}
	else if(isNaN(coupon_commnet_point.value))
	{
			$('#error_coupon_commnet_point').show();
			$('#error_coupon_commnet_point').fadeIn(3000);	
			document.getElementById('error_coupon_commnet_point').innerHTML="Coupon commnet point is only numeric field.";
			setTimeout(function(){
			$('#coupon_commnet_point').css('border-color','#dddfe0');
			$('#error_coupon_commnet_point').fadeOut('slow');
			},3000);
			return false;
	 }
	else if(community_point.value=="" )
	{
			$('#error_community_point').show();
			$('#error_community_point').fadeIn(3000);	
			document.getElementById('error_community_point').innerHTML="Community point is required.";
			setTimeout(function(){
			$('#community_point').css('border-color','#dddfe0');
			$('#error_community_point').fadeOut('slow');
			},3000);
			return false;
	}
	else if(isNaN(community_point.value))
	{
			$('#error_community_point').show();
			$('#error_community_point').fadeIn(3000);	
			document.getElementById('error_community_point').innerHTML="Community point is only numeric field.";
			setTimeout(function(){
			$('#community_point').css('border-color','#dddfe0');
			$('#error_community_point').fadeOut('slow');
			},3000);
			return false;
	 }
	});
	//Validation For update points start
	$('#btn_update_perday_point').click(function(){
	var per_day=document.getElementById('per_day');
	if(per_day.value=="" )
	{
			$('#error_per_day').show();
			$('#error_per_day').fadeIn(3000);	
			document.getElementById('error_per_day').innerHTML="Per day limit is required.";
			setTimeout(function(){
				$('#error_per_day').css('border-color','#dddfe0');
				$('#error_per_day').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(isNaN(per_day.value))
		{
				$('#error_per_day').show();
				$('#error_per_day').fadeIn(3000);	
				document.getElementById('error_per_day').innerHTML="Per day limit is only numeric field.";
				setTimeout(function(){
				$('#error_per_day').css('border-color','#dddfe0');
				$('#error_per_day').fadeOut('slow');
				},3000);
				return false;
		 }
	});
	//Validation For update points End
	//validation for add and update category
   $('#add_category').click(function(){	

 var category_name=document.getElementById('category_name');
 var parent_cat=document.getElementById('parent_cat'); 

 if(category_name.value=="")
		{
			$('#error_category_name').show();
			$('#error_category_name').fadeIn(3000);	
			document.getElementById('error_category_name').innerHTML="Category Name is required.";
			setTimeout(function(){
				$('#category_name').css('border-color','#dddfe0');
				$('#error_category_name').fadeOut('slow');
								
			},3000);
			return false;
		}
   else if(parent_cat.value=='0')
		{
			$('#error_parent_cat').show();
			$('#error_parent_cat').fadeIn(3000);	
			document.getElementById('error_parent_cat').innerHTML="Parent Category is required.";
			setTimeout(function(){
				$('#parent_cat').css('border-color','#dddfe0');
				$('#error_parent_cat').fadeOut('slow');
								
			},3000);
			return false;
		}
 });
	//validation for fornt pages
	$('#brm_frontpage').click(function(){	
	var page_name=document.getElementById('page_name');
	var page_title=document.getElementById('page_title');
	var meta_title=document.getElementById('meta_title');
	var meta_keyword=document.getElementById('meta_keyword');
	var meta_desc=document.getElementById('meta_desc');
	var page_description = CKEDITOR.instances['page_description'].getData().replace(/<[^>]*>/gi, '');
	if(page_name.value=="")
		{
			$('#error_page_name').show();
			$('#error_page_name').fadeIn(3000);	
			document.getElementById('error_page_name').innerHTML="Name is required.";
			setTimeout(function(){
				$('#page_name').css('border-color','#dddfe0');
				$('#error_page_name').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(page_title.value=="")
		{
			$('#error_page_title').show();
			$('#error_page_title').fadeIn(3000);	
			document.getElementById('error_page_title').innerHTML="Title is required.";
			setTimeout(function(){
				$('#page_title').css('border-color','#dddfe0');
				$('#error_page_title').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(meta_title.value=="")
		{
			$('#error_meta_title').show();
			$('#error_meta_title').fadeIn(3000);	
			document.getElementById('error_meta_title').innerHTML="Meta Title is required.";
			setTimeout(function(){
				$('#meta_title').css('border-color','#dddfe0');
				$('#error_meta_title').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(meta_keyword.value=="")
		{
			$('#error_meta_keyword').show();
			$('#error_meta_keyword').fadeIn(3000);	
			document.getElementById('error_meta_keyword').innerHTML="Meta keyword is required.";
			setTimeout(function(){
				$('#meta_keyword').css('border-color','#dddfe0');
				$('#error_meta_keyword').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(meta_desc.value=="")
		{
			$('#error_meta_desc').show();
			$('#error_meta_desc').fadeIn(3000);	
			document.getElementById('error_meta_desc').innerHTML="Meta description is required.";
			setTimeout(function(){
				$('#meta_desc').css('border-color','#dddfe0');
				$('#error_meta_desc').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(!page_description.length)
		{
			$('#error_page_description').show();
			$('#error_page_description').fadeIn(3000);	
			document.getElementById('error_page_description').innerHTML="The description field is required.";
			setTimeout(function(){
				$('#page_description').css('border-color','#dddfe0');
				$('#error_page_description').fadeOut('slow');
								
			},3000);
			return false;
		}
	});
	//validation for add and update news letter
	$('#btn_add_newsletter').click(function(){	
	var newsletter_subject=document.getElementById('newsletter_subject');
	var news_title=document.getElementById('news_title');
	var news_description=document.getElementById('news_description');	
    var description1 = CKEDITOR.instances['news_description'].getData().replace(/<[^>]*>/gi, '');
	if(newsletter_subject.value=="")
		{
			$('#error_newsletter_subject').show();
			$('#error_newsletter_subject').fadeIn(3000);	
			document.getElementById('error_newsletter_subject').innerHTML="Subject is required.";
			setTimeout(function(){
				$('#newsletter_subject').css('border-color','#dddfe0');
				$('#error_newsletter_subject').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(news_title.value=="")
		{
			$('#error_news_title').show();
			$('#error_news_title').fadeIn(3000);	
			document.getElementById('error_news_title').innerHTML="Title is required.";
			setTimeout(function(){
				$('#news_title').css('border-color','#dddfe0');
				$('#error_news_title').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(!description1.length)
		{
			$('#error_news_description').show();
			$('#error_news_description').fadeIn(3000);	
			document.getElementById('error_news_description').innerHTML="The Description field is required.";
			setTimeout(function(){
				$('#description1').css('border-color','#dddfe0');
				$('#error_news_description').fadeOut('slow');
								
			},3000);
			return false;
		}		
	});
	//validation for add and update faq 
	$('#btn_add_faq').click(function(){
	var checked=$("input:checkbox[name='faqcat_id[]']:checked").length;
	var faq_ques=document.getElementById('faq_ques');
	var faq_ans=document.getElementById('faq_ans');	
    var description1 = CKEDITOR.instances['faq_ans'].getData().replace(/<[^>]*>/gi, '');	
	if(checked==0)
		{
			$('#error_faqcat_id').show();
			$('#error_faqcat_id').fadeIn(3000);
			document.getElementById('error_faqcat_id').innerHTML="please Select category.";
			setTimeout(function(){
				$('#faqcat_id').css('border-color','#dddfe0');
				$('#error_faqcat_id').fadeOut('slow');
			},3000);
			return false;
		}
		else if(faq_ques.value=="")
		{
			$('#error_faq_ques').show();
			$('#error_faq_ques').fadeIn(3000);	
			document.getElementById('error_faq_ques').innerHTML="Question field is required.";
			setTimeout(function(){
				$('#faq_ques').css('border-color','#dddfe0');
				$('#error_faq_ques').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(!description1.length)
		{
			$('#error_faq_ans').show();
			$('#error_faq_ans').fadeIn(3000);	
			document.getElementById('error_faq_ans').innerHTML="The Description field is required.";
			setTimeout(function(){
				$('#description1').css('border-color','#dddfe0');
				$('#error_faq_ans').fadeOut('slow');
								
			},3000);
			return false;
		}		
	});
	
	//validation for community message
	$('#btn_update_message').click(function(){
	var message_title=document.getElementById('message_title');
	var message_desc=document.getElementById('message_desc');
	var description1 = CKEDITOR.instances['message_desc'].getData().replace(/<[^>]*>/gi, '');
	if(message_title.value=="")
		{
			$('#error_message_title').show();
			$('#error_message_title').fadeIn(3000);	
			document.getElementById('error_message_title').innerHTML="Title field is required.";
			setTimeout(function(){
				$('#message_title').css('border-color','#dddfe0');
				$('#error_message_title').fadeOut('slow');
								
			},3000);
			return false;
		}
		if(!description1.length)
		{
			$('#error_message_desc').show();
			$('#error_message_desc').fadeIn(3000);	
			document.getElementById('error_message_desc').innerHTML="The Description field is required.";
			setTimeout(function(){
				$('#description1').css('border-color','#dddfe0');
				$('#error_message_desc').fadeOut('slow');
								
			},3000);
			return false;
		}		
	});
	//validation for seller Start
	$('#btn_update_seller').click(function(){
	var username=document.getElementById('username');
	var firstname=document.getElementById('firstname');
	var lastname=document.getElementById('lastname');
	var DOB=document.getElementById('DOB');
	var city=document.getElementById('city');
	var state=document.getElementById('state');
	var countryid=document.getElementById('countryid');
	var zipcode=document.getElementById('zipcode');
	//var Website=document.getElementById('Website');
	var briefbio=document.getElementById('briefbio');
	var seller_email_id=document.getElementById('seller_email_id');
	var password=document.getElementById('password');
	
	if(username.value=="")
		{
			$('#error_username').show();
			$('#error_username').fadeIn(3000);	
			document.getElementById('error_username').innerHTML="Username field is required.";
			setTimeout(function(){
				$('#username').css('border-color','#dddfe0');
				$('#error_username').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(firstname.value=="")
		{
			$('#error_firstname').show();
			$('#error_firstname').fadeIn(3000);	
			document.getElementById('error_firstname').innerHTML="Firstname field is required.";
			setTimeout(function(){
				$('#firstname').css('border-color','#dddfe0');
				$('#error_firstname').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(lastname.value=="")
		{
			$('#error_lastname').show();
			$('#error_lastname').fadeIn(3000);	
			document.getElementById('error_lastname').innerHTML="Lastname field is required.";
			setTimeout(function(){
				$('#lastname').css('border-color','#dddfe0');
				$('#error_lastname').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(DOB.value=="0000-00-00")
		{
			$('#error_DOB').show();
			$('#error_DOB').fadeIn(3000);	
			document.getElementById('error_DOB').innerHTML="date of birth field is required.";
			setTimeout(function(){
				$('#DOB').css('border-color','#dddfe0');
				$('#error_DOB').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(city.value=="")
		{
			$('#error_city').show();
			$('#error_city').fadeIn(3000);	
			document.getElementById('error_city').innerHTML="city field is required.";
			setTimeout(function(){
				$('#city').css('border-color','#dddfe0');
				$('#error_city').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(state.value=="")
		{
			$('#error_state').show();
			$('#error_state').fadeIn(3000);	
			document.getElementById('error_state').innerHTML="state field is required.";
			setTimeout(function(){
				$('#state').css('border-color','#dddfe0');
				$('#error_state').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(countryid.value=="")
		{
			$('#error_countryid').show();
			$('#error_countryid').fadeIn(3000);	
			document.getElementById('error_countryid').innerHTML="country field is required.";
			setTimeout(function(){
				$('#countryid').css('border-color','#dddfe0');
				$('#error_countryid').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(zipcode.value=="")
		{
			$('#error_zipcode').show();
			$('#error_zipcode').fadeIn(3000);	
			document.getElementById('error_zipcode').innerHTML="zipcode field is required.";
			setTimeout(function(){
				$('#zipcode').css('border-color','#dddfe0');
				$('#error_zipcode').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(isNaN(zipcode.value))
		{
			$('#error_zipcode').show();
			$('#error_zipcode').fadeIn(3000);	
			document.getElementById('error_zipcode').innerHTML="please enter digits only .";
			setTimeout(function(){
				$('#zipcode').css('border-color','#dddfe0');
				$('#error_zipcode').fadeOut('slow');
								
			},3000);
			return false;
		}
	/*	else if(Website.value=="")
		{
			$('#error_Website').show();
			$('#error_Website').fadeIn(3000);	
			document.getElementById('error_Website').innerHTML="Website field is required.";
			setTimeout(function(){
				$('#Website').css('border-color','#dddfe0');
				$('#error_Website').fadeOut('slow');
								
			},3000);
			return false;
		}
	*/
		else if(briefbio.value=="")
		{
			$('#error_briefbio').show();
			$('#error_briefbio').fadeIn(3000);	
			document.getElementById('error_briefbio').innerHTML="briefbio field is required.";
			setTimeout(function(){
				$('#briefbio').css('border-color','#dddfe0');
				$('#error_briefbio').fadeOut('slow');
		},3000);
		return false;
		}
		else if(!seller_email_id.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) || seller_email_id.value=="")
		{
			$('#error_seller_email_id').show();
			$('#error_seller_email_id').fadeIn(3000);	
			document.getElementById('error_seller_email_id').innerHTML="Valid email-id is required.";
			setTimeout(function(){
				$('#seller_email_id').css('border-color','#dddfe0');
				$('#error_seller_email_id').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(password.value=="")
		{
			$('#error_password').show();
			$('#error_password').fadeIn(3000);	
			document.getElementById('error_password').innerHTML="password field is required.";
			setTimeout(function(){
				$('#password').css('border-color','#dddfe0');
				$('#error_password').fadeOut('slow');
								
			},3000);
			return false;
		}
	});
	//validation for seller End
	//validation for User Start
	$('#btn_update_user').click(function(){
	var username=document.getElementById('username');
	var first_name=document.getElementById('first_name');
	var last_name=document.getElementById('last_name');
	var contact_no=document.getElementById('contact_no');
	var address=document.getElementById('address');
	var city_id=document.getElementById('city_id');
	var state_id=document.getElementById('state_id');
	var country_id=document.getElementById('country_id');
	var seller_email_id=document.getElementById('seller_email_id');
	var password=document.getElementById('password');
	
		if(username.value=="")
		{
			$('#error_username').show();
			$('#error_username').fadeIn(3000);	
			document.getElementById('error_username').innerHTML="username field is required.";
			setTimeout(function(){
				$('#username').css('border-color','#dddfe0');
				$('#error_username').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(first_name.value=="")
		{
			$('#error_first_name').show();
			$('#error_first_name').fadeIn(3000);	
			document.getElementById('error_first_name').innerHTML="firstname field is required.";
			setTimeout(function(){
				$('#first_name').css('border-color','#dddfe0');
				$('#error_first_name').fadeOut('slow');
			},3000);
			return false;
		}
		else if(last_name.value=="")
		{
			$('#error_last_name').show();
			$('#error_last_name').fadeIn(3000);	
			document.getElementById('error_last_name').innerHTML="lastname field is required.";
			setTimeout(function(){
				$('#last_name').css('border-color','#dddfe0');
				$('#error_last_name').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(contact_no.value=="")
		{
			$('#error_contact_no').show();
			$('#error_contact_no').fadeIn(3000);	
			document.getElementById('error_contact_no').innerHTML="contact number field is required.";
			setTimeout(function(){
				$('#contact_no').css('border-color','#dddfe0');
				$('#error_contact_no').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(isNaN(contact_no.value))
		{
			$('#error_contact_no').show();
			$('#error_contact_no').fadeIn(3000);	
			document.getElementById('error_contact_no').innerHTML="contact number field is is only numeric.";
			setTimeout(function(){
				$('#contact_no').css('border-color','#dddfe0');
				$('#error_contact_no').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(address.value=="")
		{
			$('#error_address').show();
			$('#error_address').fadeIn(3000);	
			document.getElementById('error_address').innerHTML="address field is required.";
			setTimeout(function(){
				$('#address').css('border-color','#dddfe0');
				$('#error_address').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(city_id.value=="")
		{
			$('#error_city_id').show();
			$('#error_city_id').fadeIn(3000);	
			document.getElementById('error_city_id').innerHTML="city field is required.";
			setTimeout(function(){
				$('#city_id').css('border-color','#dddfe0');
				$('#error_city_id').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(state_id.value=="")
		{
			$('#error_state_id').show();
			$('#error_state_id').fadeIn(3000);	
			document.getElementById('error_state_id').innerHTML="state field is required.";
			setTimeout(function(){
				$('#state_id').css('border-color','#dddfe0');
				$('#error_state_id').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(country_id.value=="")
		{
			$('#error_country_id').show();
			$('#error_country_id').fadeIn(3000);	
			document.getElementById('error_country_id').innerHTML="country field is required.";
			setTimeout(function(){
				$('#country_id').css('border-color','#dddfe0');
				$('#error_country_id').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(!seller_email_id.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) || seller_email_id.value=="")
		{
			$('#error_seller_email_id').show();
			$('#error_seller_email_id').fadeIn(3000);	
			document.getElementById('error_seller_email_id').innerHTML="Valid email id is required.";
			setTimeout(function(){
				$('#seller_email_id').css('border-color','#dddfe0');
				$('#error_seller_email_id').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(password.value=="")
		{
			$('#error_password').show();
			$('#error_password').fadeIn(3000);	
			document.getElementById('error_password').innerHTML="password field is required.";
			setTimeout(function(){
				$('#password').css('border-color','#dddfe0');
				$('#error_password').fadeOut('slow');
								
			},3000);
			return false;
		}
	});
	//validation for User End
	
	//validation for add and update Product Start
	$('#btn_update_product').click(function(){
		var type=$(this).attr('lang');
		var product_image=document.getElementById('product_image');
		var product_title=document.getElementById('product_title');
		var product_desc=document.getElementById('product_desc');
		var description1 = CKEDITOR.instances['product_desc'].getData().replace(/<[^>]*>/gi, '');	
		var product_point=document.getElementById('product_point');
		var chkimg = product_image.value.split(".");
	    var extension = chkimg[1];
		if((product_image.value!='') && (extension!='jpg' && extension!='jpeg' && extension!='gif' && extension!='png'))
		{
				$('#error_product_image').show();
				$('#error_product_image').fadeIn(3000);	
				document.getElementById('error_product_image').innerHTML="The file type you are attempting to upload is not allowed.";
				setTimeout(function(){
					$('#product_image').css('border-color','#dddfe0');
					$('#error_product_image').fadeOut('slow');
				},3000);
				return false;
		}
		else if(type=='add' && product_image.value=="")
		{
				$('#error_product_image').show();
				$('#error_product_image').fadeIn(3000);	
				document.getElementById('error_product_image').innerHTML="Image field is required.";
				setTimeout(function(){
					$('#product_image').css('border-color','#dddfe0');
					$('#error_product_image').fadeOut('slow');
				},3000);
				return false;
		}
		else if(product_title.value=="")
		{
			$('#error_product_title').show();
			$('#error_product_title').fadeIn(3000);	
			document.getElementById('error_product_title').innerHTML="Title field is required.";
			setTimeout(function(){
				$('#product_title').css('border-color','#dddfe0');
				$('#error_product_title').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(!description1.length)
		{
			$('#error_product_desc').show();
			$('#error_product_desc').fadeIn(3000);	
			document.getElementById('error_product_desc').innerHTML="The Description field is required.";
			setTimeout(function(){
				$('#description1').css('border-color','#dddfe0');
				$('#error_product_desc').fadeOut('slow');
								
			},3000);
			return false;
		}		
		else if(product_point.value=="")
		{
			$('#error_product_point').show();
			$('#error_product_point').fadeIn(3000);	
			document.getElementById('error_product_point').innerHTML="Title field is required.";
			setTimeout(function(){
				$('#product_point').css('border-color','#dddfe0');
				$('#error_product_point').fadeOut('slow');
			},3000);
			return false;
		}
		else if(isNaN(product_point.value))
		{
			$('#error_product_point').show();
			$('#error_product_point').fadeIn(3000);	
			document.getElementById('error_product_point').innerHTML="Numeric value is required.";
			setTimeout(function(){
				$('#product_point').css('border-color','#dddfe0');
				$('#error_product_point').fadeOut('slow');
			},3000);
			return false;
		}
	});
	//validation for add and update Product End
	
	//validation for add and update brand
	$('#btn_add_brand').click(function(){
		var brand_image=document.getElementById('brand_image');
		var brand_title=document.getElementById('brand_title');
		var brand_desc=document.getElementById('brand_desc');
		var chkimg = brand_image.value.split(".");
	    var extension = chkimg[1];
		if(brand_image.value!='')
		{
		if((extension!='jpg' && extension!='jpeg' && extension!='gif' && extension!='png'))
		{
				$('#error_brand_image').show();
				$('#error_brand_image').fadeIn(3000);	
				document.getElementById('error_brand_image').innerHTML="The file type you are attempting to upload is not allowed.";
				setTimeout(function(){
					$('#brand_image').css('border-color','#dddfe0');
					$('#error_brand_image').fadeOut('slow');
				},3000);
				return false;
		}
		}
		if(brand_title.value=="")
		{
			$('#error_brand_title').show();
			$('#error_brand_title').fadeIn(3000);	
			document.getElementById('error_brand_title').innerHTML="Title field is required.";
			setTimeout(function(){
				$('#brand_title').css('border-color','#dddfe0');
				$('#error_brand_title').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(brand_desc.value=="")
		{
			$('#error_brand_desc').show();
			$('#error_brand_desc').fadeIn(3000);	
			document.getElementById('error_brand_desc').innerHTML="Title description field is required.";
			setTimeout(function(){
				$('#brand_desc').css('border-color','#dddfe0');
				$('#error_brand_desc').fadeOut('slow');
								
			},3000);
			return false;
		}
	});
	//validation for add and update faq 
	$('#btn_update_brands').click(function(){
	var checked=$("input:checkbox[name='brands_id[]']:checked").length;
	if(checked==0)
		{
			$('#error_brands_id').show();
			$('#error_brands_id').fadeIn(3000);
			document.getElementById('error_brands_id').innerHTML="Please select Brand.";
			setTimeout(function(){
				$('#brands_id').css('border-color','#dddfe0');
				$('#error_brands_id').fadeOut('slow');
			},3000);
			return false;
		}
	});
	});


<!--add multiple image banner-->
$(document).ready(function()
{
		$('#add-image').click(function(){
		flag=1
		$('.col-lg-9').each(function(e){
		  var pdf_id=$(this).attr('id','banner_image_'+e);
		  var id_check=$(this).attr('id');
		})
		if(flag==1)
		{
			$('#pdfappend').clone().appendTo('#append');
			$("#pdfappend.class-add:last").find("input").val("");
			$('#error_lesson_pdf').fadeOut('slow');
		}
	});
	
	$('#remove-image').click(function(){
	  if($('.class-add').length>1)
	  {$('#pdfappend.class-add:last').last().remove();}
	  else
	  {$("#pdfappend.class-add").find("input").val("");}
	});
	
//validation banner
$('#btn_ban').click(function(){
	
	var banner_image=document.getElementById('banner_image');
	var b=document.getElementsByName('banner_image');
	var linkb=document.getElementById('linkb');
	var urlregex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	var chkimg = banner_image.value.split(".");
	var extension = chkimg[1];
		if(banner_image.value=="" )
		{
			$('#error_banner').show();
			$('#error_banner').fadeIn(3000);	
			document.getElementById('error_banner').innerHTML="choose image.";
			setTimeout(function(){
				$('#banner_image').css('border-color','#dddfe0');
				$('#error_banner').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(extension!='jpg' && extension!='jpeg' && extension!='gif' && extension!='png' && ($(this).attr('name')=='btn_banner'))
		{
				$('#error_banner').show();
				$('#error_banner').fadeIn(3000);	
				document.getElementById('error_banner').innerHTML="The file type you are attempting to upload is not allowed.";
				setTimeout(function(){
					$('#banner_image').css('border-color','#dddfe0');
					$('#error_banner').fadeOut('slow');
									
				},3000);
				return false;
		}
		/*else if(b.height != '354' && b.width != '1170')
		{
			$('#error_banner').show();
			$('#error_banner').fadeIn(3000);	
			document.getElementById('error_banner').innerHTML="image.";
			setTimeout(function(){
				$('#banner_image').css('border-color','#dddfe0');
				$('#error_banner').fadeOut('slow');
								
			},3000);
			return false;
		}*/
		
		else if(linkb.value=="")
		{
			$('#error_banner').show();
			$('#error_banner').fadeIn(3000);	
			document.getElementById('error_banner').innerHTML="URL is required.";
			setTimeout(function(){
				$('#linkb').css('border-color','#dddfe0');
				$('#error_banner').fadeOut('slow');
								
			},3000);
			return false;
		}
		else if(linkb.value!="" && !urlregex.test(linkb.value))
		{
			$('#error_banner').show();
			$('#error_banner').fadeIn(3000);	
			document.getElementById('error_banner').innerHTML="Enter valid URL.";
			setTimeout(function(){
				$('#linkb').css('border-color','#dddfe0');
				$('#error_banner').fadeOut('slow');
								
			},3000);
			return false;
		}
		
	});
	});

<!--Used Function start-->
// Check box validation for Categor Start
/*function checkCheckBoxes(form)
 {
	if(form.faqcat_id[0].checked == false &&  form.faqcat_id[1].checked == false && form.faqcat_id[2].checked == false) 
	{
		alert ('You didn\'t choose any of the category checkboxes!');
		return false;
	} else { 	
		return true;
	}
}*/
// Check box validation for Categor End

//delete Conform Message
function deletconfirm()
{
	if(confirm('Are you sure to delete this record ?'))
	{
		return true;
	}
	else
	{
		return false;
	}}
//active multiple status (yogesh)
function multipleactivestatus(form_id)
{
	var checked=$("input[name='checkbox_del[]']:checked").length;
	if(checked<1)
	{
		$('#message').show();
		document.getElementById('message').innerHTML = 'No records selected for changing status.';
		setTimeout(function(){
						$('#message').fadeOut('slow');
						},3000);
						return false;
	   // alert('No records selected for changing status.');
	}
	else
	{
		/*$('#message_confirm').show();
		
		document.getElementById('message_confirm').innerHTML = 'Are you sure to change status of these records ? <a href="" onclick="javascript : return false;">No</a><span style="margin-left:30px;"><a href="" onclick="javascript : return true;">Yes</a></span>';
		$('#status_chck').val('1');
		$('#'+form_id).submit();*/
  		if(confirm('Are you sure to change status of these records ?'))
  		{
			$('#status_chck').val('1');
			$('#'+form_id).submit();
  			return true;
  		}
  	    else
  		{
  			return false;
  		}	
	}}
//Blocking mutiple status (yogesh)
function multipleblockstatus(form_id)
{ 
	var checked=$("input[name='checkbox_del[]']:checked").length;
	if(checked<1)
	{
		$('#message').show();
		document.getElementById('message').innerHTML = 'No records selected for changing status.';
		setTimeout(function(){
						$('#message').fadeOut('slow');
						},3000);
						return false;
	   // alert('No records selected for changing status.');
	}
	else
	{
 		if(confirm('Are you sure to change status of these records ?'))
  		{
			$('#status_chck').val('2');
			$('#'+form_id).submit();
  			return true;
  		}
  	    else
  		{
  			return false;
  		}
	}}
	
//delete multiple records (yogesh)
function multipledeletconfirm(frm_id)
{ 
	var checked=$("input[name='checkbox_del[]']:checked").length;
	if(checked<1)
	{
		$('#message').show();
		document.getElementById('message').innerHTML = 'Please select records for delete.';
		setTimeout(function(){
						$('#message').fadeOut('slow');
						},3000);
						return false;
	}
	else
	{
 		if(confirm('Are you sure to delete these records ?'))
  		{
			$('#status_chck').val('3');
			$('#'+frm_id).submit();
  			return true;
  		}
  	    else
  		{
  			return false;
  		}
	}}
	
//Image Validation multiple records	 (yogesh)
function check_Files(fileName,eleId,button_name)
{     
		var ext_a = fileName.substring(fileName.lastIndexOf('.') + 1);
		if(ext_a == "jpg" || ext_a == "jpeg" || ext_a == "gif" || ext_a == "png" || ext_a == "GIF" || ext_a == "JPG" || ext_a == "JPEG" || ext_a == "PNG")
		{
			//document.getElementById(btn_update_seller).disabled = false;	
			document.getElementById(button_name).disabled=false;
			return true;
		}
		else {
		alert("Invalid File Format.");
		document.getElementById(button_name).disabled=true;
		document.getElementById(eleId).focus();
		document.getElementById(eleId).value="";
		return false;
		}}		
	
//Email Id Dublication For Seller	(yogesh)
$(document).ready(function(){
$('#seller_email_id').blur(function(){
			var email=$('#seller_email_id');
			var loginid=$('#loginid');
			var datastring="email="+email.val()+"&loginid="+loginid.val();
			$.ajax({
				url:site_url+'superadmin/seller/check_email/',
				type: 'POST',
				dataType:'json',
				data:datastring,
				cache: false,
				success:function(res)
				{
					if(res=="error")
					{
						 $("#btn_update_seller").attr("disabled","disabled");
						 $("#btn_update_user").attr("disabled","disabled");
						alert(email.val()+" already exist!");
						return false;
					}
					else
					{
					 $("#btn_update_seller").removeAttr('disabled');
					 $("#btn_update_user").removeAttr('disabled');
					}
				}
			});
	});});		

//Send multiple newsletter
function sendmultiplenewsletter()
{
	var checked=$("input[name='check_email[]']:checked").length;
	if(checked<1)
	{
		$('#err_news_title').show();
		$('#err_news_title').fadeIn(3000);	
		document.getElementById('err_news_title').innerHTML="Please select at least one below user.";
		news_title.focus();
			setTimeout(function(){
			$('#news_title').css('border-color','#dddfe0');
			$('#err_news_title').fadeOut('slow');
			},3000);
			return false;
	}
	else
	{
		return true;
	}}	
<!--Used Function end-->


$(document).ready(function(){
	$('#add-image').click(function(){
		flag=1
		$('.pimg').each(function(e){
		  var pdf_id=$(this).attr('id','product_image_'+e);
		  var id_check=$(this).attr('id');
		 
		   if($('#'+id_check).val()=='')
		   {
			    $('#error_product_image').css('margin-left','230px');	
				$('#error_product_image').show();
				$('#error_product_image').fadeIn(3000);
				document.getElementById('error_product_image').innerHTML="The Image uploaded is required.";
				setTimeout(function(){
				 $('#error_product_image').fadeOut('slow');
				},3000);3
				flag=0;
				return false;
		   }
		   var chkpdf = $('#'+id_check).val().split(".");
		   var extension = chkpdf[1];
		   
		   if(extension!='jpg' && extension!='JPG' && extension!='png' && extension!='PNG' && extension!='jpeg' && extension!='JPEG' && extension!='gif' && extension!='GIF')	
		   {
			 $('#error_product_image1').css('margin-left','230px')
			 $('#error_product_image1').show();
			 $('#error_product_image1').fadeIn(3000);	
			 document.getElementById('error_product_image1').innerHTML="The file type you are attempting to upload is not allowed.";
			 setTimeout(function(){
				$('#product_image').css('border-color','#dddfe0');
				$('#error_product_image1').fadeOut('slow');
			 },3000);
			 flag=0;
			 if($('.class-add').length>1)
			  {$('#imageappend.class-add:last').last().remove();}
			  else
			  {$("#imageappend.class-add").find("input").val("");}
			 return false;
		   }
		})
		if(flag==1)
		{
			$('#imageappend').clone().appendTo('#append');
			$("#imageappend.class-add:last").find("input").val("");
			$('#error_product_image').fadeOut('slow');
		}
	});
	
	
	$('#remove-image').click(function(){
	  if($('.class-add').length>1)
	  {$('#imageappend.class-add:last').last().remove();}
	  else
	  {$("#imageappend.class-add").find("input").val("");}
	});	
	
	$('#select_month_for_chart').change(function()
	{
			$('#get_chart_details').submit();
		
	});
	$('#select_year_for_chart').change(function()
	{
			$('#get_chart_details').submit();
		
	});
	
	$('#select_month_for_chart1').change(function()
	{
			$('#get_chart_details1').submit();
		
	});
	$('#select_year_for_chart1').change(function()
	{
			$('#get_chart_details1').submit();
		
	});
	
	<!-- validation Send Newsletter -->
	$('#btn_send_newsletter').click(function(){
		var news_title=document.getElementById('news_title');
		var chk_bx=document.getElementsByName('check_email[]');
		
		var chk_len=chk_bx.length;
		var flag=0; 
		for(i=0;i<chk_len;i++)
		{
			if(chk_bx[i].checked)
			{
				flag=1;
				break;
			}
			else
			{
				flag=0;
			}
		}
		
		if(news_title.value=="")
		{
			$('#err_news_title').show();
			$('#err_news_title').fadeIn(3000);	
			document.getElementById('err_news_title').innerHTML="The title field is required.";
			news_title.focus();
			setTimeout(function(){
				$('#news_title').css('border-color','#dddfe0');
				$('#err_news_title').fadeOut('slow');
								
			},3000);
			return false;
		}
		 if(flag==0)
		{
		  $('#err_news_title').show();
			$('#err_news_title').fadeIn(3000);	
			document.getElementById('err_news_title').innerHTML="Please Select Subscribers.";
			news_title.focus();
			setTimeout(function(){
				$('#news_title').css('border-color','#dddfe0');
				$('#err_news_title').fadeOut('slow');
								
			},3000);
			return false;
		}
	});
	
	<!-- validation Add newsletter -->
	$('#btn_newsletter').click(function(){
		var news_description=document.getElementById('news_description');	
		var description1 = CKEDITOR.instances['news_description'].getData().replace(/<[^>]*>/gi, '');
		if(!description1.length)
		{
			$('#err_news_description').show();
			$('#err_news_description').fadeIn(3000);	
			document.getElementById('err_news_description').innerHTML="The Description field is required.";
			setTimeout(function(){
				$('#description1').css('border-color','#dddfe0');
				$('#err_news_description').fadeOut('slow');
								
			},3000);
			return false;
		}		
	});
	
	<!-- validationUpdate newsletter -->
	$('#btn_updatenews').click(function(){
		var news_description=document.getElementById('news_description');	
		var description1 = CKEDITOR.instances['news_description'].getData().replace(/<[^>]*>/gi, '');
		if(!description1.length)
		{
			$('#err_news_description').show();
			$('#err_news_description').fadeIn(3000);	
			document.getElementById('err_news_description').innerHTML="The Description field is required.";
			setTimeout(function(){
				$('#description1').css('border-color','#dddfe0');
				$('#err_news_description').fadeOut('slow');
								
			},3000);
			return false;
		}		
	});
	
	
	$('#btn_merchant').click(function()
	{
		var attach=$('#trade_attachment').val();
		var ext = attach.substring(attach.lastIndexOf('.')+1);
		if(ext!='doc' && ext!='docx' && ext!='pdf' && ext!='txt' )
		{
			 jQuery('#error_trade_attachment').css('color','red');
			jQuery('#error_trade_attachment').fadeIn(2000);
			 jQuery('#error_trade_attachment').html('Invalid file attached');
			 jQuery('#error_trade_attachment').fadeOut(2000);
			return false;
		}
	});
	
	$('#remove-price').click(function(){
	  if($('.class-add-price').length>1)
	  {$('#priceappend.class-add-price:last').last().remove();}
	  else
	  {$("#priceappend.class-add-price").find("input").val("");}
	});	
	
	
	$('#remove-video').click(function(){
	  if($('.class-add-video').length>1)
	  {$('#videoappend.class-add-video:last').last().remove();}
	  else
	  {$("#videoappend.class-add-video").find("input").val("");}
	});	
	$('.productlimit').click(function(){
	  alert('you have no sufficient points.');
	  return false;
	});
	$('.purchased_status').change(function(){
	   var status=$(this).val();
	   var purchased_id=$(this).attr('lang');
	   $(this).next('span').show();
	   var dataString = {status:status,purchased_id:purchased_id}
		   $.ajax({
					type: 'POST',
					url: site_url+'superadmin/product/change_status/',
					data:dataString,
					success:function(res)
					{
						if(res=='done')
						{
							 $(this).next('span').hide();
							alert("Status changed successfully.");
							window.location.reload();
						}
						else
						{
						}
					}
			   });
	 });
	$('.deal_type').change(function()
	{
		var deal = $('#deal_type').val();
		var city_name = $('#city_eng').val();
		var category_eng = $('#category_eng').val();
		$('#deal_type').css('border-color', '');
		if(deal!="none")
		{
			postData={city_name:city_name,category_eng:category_eng,deal:deal};
			$.post(site_url+'superadmin/deal/check_main_deal', postData, function (data)
			{
           		if(data=='exist')
				{
					$('#errordeal_type').fadeIn(3000);
					$('#deal_type').css('border-color', 'red');
					$('#errordeal_type').html('You alredy have added main deal under given city and category');
					$('#errordeal_type').fadeOut(3000);
					return false
				}
        	});	
		}
		else
		{return true;}
	});});
//delete newsletter
function deletconfirm()
{
	if(confirm('Are you sure to delete this record ?'))
	{
		return true;
	}
	else
	{
		return false;
	}}

//delete mulitiple manage newsletter
function deletesendnewsletter()
{
	var checked=$("input[name='check_email[]']:checked").length;
	if(checked<1)
    alert('No records selected for deletion.');
	else
	{
 		if(confirm('Are you sure to delete these records ?'))
  		{
  			$('#frm-send-newsletter').submit();
  			return true;
  		}
  	    else
  		{
  			return false;
  		}
	}}
function check_mult_action(ctrl_name,form_id)
{
	var chk_bx=document.getElementsByName(ctrl_name);
	var chk_len=chk_bx.length;
	var flag=0; 
	for(i=0;i<chk_len;i++)
	{
		if(chk_bx[i].checked)
		{
			flag=1;
			break;
		}
		else
		{
			flag=0;
		}
	}
	if(flag==0)
	{
      alert("Please select record");
	  return false;
	}
	else
	{
		if(confirm("Are you sure you want to perform this action ?"))
		{return true;}
		else
		{return false;}
	}}
	
/*Image size validation Start*/
function loadImage_new(file_name, updt_advertisement,pro) 
{
  var input, file, fr, img;
  var updt_advertisement = updt_advertisement;
  input = document.getElementById(pro);
	file = input.files[0];
 	fr = new FileReader();
    fr.onload = createImage;
    fr.readAsDataURL(file);
    function createImage() {
        img = document.createElement('img');
        img.onload = imageLoaded;
        img.style.display = 'none'; // If you don't want it showing
        img.src = fr.result;
    }

    function imageLoaded() {
       //alert(img.width + "x" + img.height);
         if (img.width == 1170 && img.height == 354) 
		 	{
               document.getElementById(updt_advertisement).disabled = false;
				return true;
            } 
			else
			{
			   document.getElementById(updt_advertisement).disabled = true;
			   alert("Banner image size should be 1170 X 354.");
			   document.getElementById(updt_advertisement).disabled = true;
			return false;
	   	}
    }
	}
/*Image size validation End*/	