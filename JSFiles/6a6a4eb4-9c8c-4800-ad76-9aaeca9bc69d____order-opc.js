var extensionOPC = 
{
	doAjax: {
		payment: '',
		partialAddress: '',
	},
	pamyent_go: true,
	is_free_order: false,
	selected_payment: '',
	submit_payment: false,
	address_refresh: 0,
	fieldsForm: {
		'email': {'required' : true, 'validate' : 'isEmail', 'min_length' : 3, 'update' : false },
		'passwd':{'required' : true, 'validate' : 'isPassword', 'min_length' : 5, 'update' : false},
		'company':{'required' : false, 'validate' : 'isText', 'min_length' : 2, 'update' : true},
		'dni':{'required' : true, 'validate' : 'isText', 'min_length' : 9, 'update' : true},
		'vat_number':{'required' : false, 'validate' : 'isText', 'min_length' : 8, 'update' : true},
		'firstname':{'required' : true, 'validate' : 'isText', 'min_length' : 2, 'update' : false},
		'lastname':{'required' : true, 'validate' : 'isText', 'min_length' : 2, 'update' : false},
		'address1':{'required' : true, 'validate' : 'isAddress', 'min_length' : 3, 'update' : false},
		'address2':{'required' : false, 'validate' : 'isText', 'min_length' : 2, 'update' : false},
		'postcode':{'required' : true, 'validate' : 'isPostcode', 'min_length' : 3, 'update' : true},
		'city':{'required' : true, 'validate' : 'isText', 'min_length' : 2, 'update' : true},
		'id_country':{'required' : true, 'validate' : 'isNumber', 'min_length' : 1, 'update' : false},
		'id_state':{'required' : true, 'validate' : 'isNumber', 'min_length' : 1, 'update' : false},
		'phone_mobile':{'required' : true, 'validate' : 'isPhone', 'min_length' : 6, 'update' : true},
		'other':{'required' : false, 'validate' : 'isText', 'min_length' : 2, 'update' : false},
		'company_invoice':{'required' : false, 'validate' : 'isText', 'min_length' : 2, 'update' : true},
		'firstname_invoice':{'required' : true, 'validate' : 'isText', 'min_length' : 2, 'update' : false},
		'lastname_invoice':{'required' : true, 'validate' : 'isText', 'min_length' : 2, 'update' : false},
		'address1_invoice':{'required' : true, 'validate' : 'isAddress', 'min_length' : 3, 'update' : false},
		'address2_invoice':{'required' : false, 'validate' : 'isText', 'min_length' : 2, 'update' : false},
		'postcode_invoice':{'required' : true, 'validate' : 'isPostcode', 'min_length' : 3, 'update' : true},
		'city_invoice':{'required' : true, 'validate' : 'isText', 'min_length' : 2, 'update' : false},
		'id_country_invoice':{'required' : true, 'validate' : 'isNumber', 'min_length' : 1, 'update' : false},
		'id_state_invoice':{'required' : true, 'validate' : 'isNumber', 'min_length' : 1, 'update' : false},
		'phone_mobile_invoice':{'required' : true, 'validate' : 'isPhone', 'min_length' : 6, 'update' : true},
	},
	classFieldOk: 'form-ok',
	classFieldError: 'form-error',
	classStateLoading: 'form-state-loading',
	classStateOk: 'form-state-ok',
	classStateError: 'form-state-nok',
	classStateWarning: 'form-state-warning',
	elementState: 'span.validation-state',
	elementHelper: '.helper',
	urlImgLoader: baseUri+'modules/x13opc/views/img/loader.gif',
	field_tmp_value: '',

	setCurrentValue: function(value)
	{
		extensionOPC.field_tmp_value = value;
	},
	
	/*
	 *	Wyświetl status
	 */

	displayState: function(element, state)
	{
		element.nextAll(extensionOPC.elementState).removeClass(extensionOPC.classStateLoading+' '+extensionOPC.classStateOk+' '+extensionOPC.classStateError+' '+extensionOPC.classStateWarning);
		
		if(state == 1) // ok
			element.nextAll(extensionOPC.elementState).addClass(extensionOPC.classStateOk);
		if(state == 2) // error
			element.nextAll(extensionOPC.elementState).addClass(extensionOPC.classStateError);
		if(state == 3) // loading
			element.nextAll(extensionOPC.elementState).addClass(extensionOPC.classStateLoading);
		if(state == 4) // warning
			element.nextAll(extensionOPC.elementState).addClass(extensionOPC.classStateWarning);
	},

	/*
	 *	Field state
	 */
	displayFieldState: function(element, state)
	{
		element.parent().removeClass(extensionOPC.classFieldOk+' '+extensionOPC.classFieldError);
		
		if(state == 0) // error
			element.parent().addClass(extensionOPC.classFieldError);
		if(state == 1) // ok
			element.parent().addClass(extensionOPC.classFieldOk);
	},
	 
	/*
	 *	Czy tekst
	 */
	isText: function(field_value, min_length) 
	{
		return (field_value.length >= min_length)
	},
	
	/*
	 *	Czy tekst
	 */
	isAddress: function(field_name, field_value, min_length) 
	{
		if (field_value.length < min_length)
			return false;
			
		var pattern = /\d/;
		if (!field_value.match(pattern)) {
			return false;
		}
		else {
			return true;
		}
		return true;
	},
	
	/*
	 *	Czy e-mail
	 */
	isEmail: function(field_value, min_length, check_email) 
	{
		var email_field = $('#new_account_form #email');
		var email = email_field.val();
			if (email != '') 
			{
				$.ajax({
					type:'POST',
					url:orderOpcUrl,
					async:true,
					cache:false,
					dataType:"json",
					data:'ajax=true&method=emailCheck&valid_email=' + email,
					success:function (jsonData) 
					{
						var formatOk = (/^.+@.+\..+$/i.test(field_value) && field_value.length >= min_length)
						if (formatOk) {
							extensionOPC.displayFieldState(email_field, 1);
							extensionOPC.displayState(email_field, 1);
						} else {
							extensionOPC.displayFieldState(email_field, 0);
							extensionOPC.displayState(email_field, 2);
						}
						 
						if(jsonData.isRegistered && check_email)
						{
							$('#email_orledy_register').slideDown('slow');
						}
						else
							$('#email_orledy_register').slideUp('slow');
							
						if((jsonData.isRegistered && check_email) || jsonData.hasError)
						{
							extensionOPC.displayFieldState(email_field, 0);
							extensionOPC.displayState(email_field, 2);
						}
					}
				});
				return 3;
			}

		return (/^.+@.+\..+$/i.test(field_value) && field_value.length >= min_length);
	},

	isPostcode: function(field_name, field_value, min_length) 
	{
		var id_country = (field_name == 'postcode') ? $('#id_country').val() : $('#id_country_invoice').val();
		var postcode_field = $('#' + field_name);
		var result_ok = false;

		if (field_value != "" && id_country != "") {
			if (extensionOPC.fieldsForm[field_name]['update']) {
				extensionOPC.updatePartitialAddress($('#' + field_name), field_name, '&check=zipCheck', true)
			} else {
				$.ajax({
					type:'POST',
					url:orderOpcUrl,
					async:true,
					cache:false,
					dataType:"json",
					data:'ajax=true&method=zipCheck&id_country=' + id_country + '&postcode=' + field_value,
					success:function (jsonData) {
						if (jsonData.status)
						{
							extensionOPC.displayFieldState(postcode_field, 1);
						} else
						{
							extensionOPC.displayFieldState(postcode_field, 0);
						}

							if (jsonData.status) {
								extensionOPC.displayState(postcode_field, 1);
							} else {
								extensionOPC.displayState(postcode_field, 2);
							}

					}//sucess:
				});
			}
			return 3; // loader
		}

		return (field_value.length >= min_length);
	},

	postCodeValidResponse: function(jsonData)
	{
		var field = $('#' + jsonData.zipCheck.field);
		
		if (jsonData.zipCheck.status) {
			extensionOPC.displayFieldState(field, 1);
		} else {
			extensionOPC.displayFieldState(field, 0);
		}

		if (jsonData.zipCheck.status) {
			extensionOPC.displayState(field, 1);
		} else {
			extensionOPC.displayState(field, 2);
		}
	},
	
	isPassword: function(field_value, min_length) 
	{
		return (field_value.length >= min_length)
	},

	isNumber: function(field_value, min_length) 
	{
		return (/^\d+$/i.test(field_value) && field_value.length >= min_length)
	},

	isPhone: function(field_value, min_length) 
	{
		return (/^[0-9-. _+,]+$/i.test(field_value) && field_value.length >= min_length)
	},
	
	/*
	 *	Validacja pola
	 */
	validateField: function(field_name, field_value, check_email) 
	{
		var field = extensionOPC.fieldsForm[field_name];
		field_value = jQuery.trim(field_value);
		var validity_check = 1;
		if (field !== undefined) {
			var valid = true;
			if (field['validate'] == 'isText')
				valid = extensionOPC.isText(field_value, field['min_length']);
			else if (field['validate'] == 'isEmail')
				valid = extensionOPC.isEmail(field_value, field['min_length'], check_email);
			else if (field['validate'] == 'isAddress')
				valid = extensionOPC.isAddress(field_name, field_value, field['min_length']);
			else if (field['validate'] == 'isPostcode')
				valid = extensionOPC.isPostcode(field_name, field_value, field['min_length']);
			else if (field['validate'] == 'isPassword')
				valid = extensionOPC.isPassword(field_value, field['min_length']);
			else if (field['validate'] == 'isNumber')
				valid = extensionOPC.isNumber(field_value, field['min_length']);
			else if (field['validate'] == 'isPhone')
				valid = extensionOPC.isPhone(field_value, field['min_length']);

			if (valid) {
				if (valid == 3)
					validity_check = 3; // just display loader and wait for ajax
				else
					validity_check = 1;
			} else {
				if (field['required']) // is required?
					validity_check = 0;
				else {
					if (field_value == '') // is empty?
						validity_check = 1;
					else
						validity_check = 2;
				}
			}
		}
		return validity_check;
	},
	
	/*
	 *	Validacja pola i status
	 */
	validateFieldAndState: function(element, check_email, update) 
	{
		var state = 0;
		var field_name = element.attr('name');
		var field = extensionOPC.fieldsForm[field_name];
		var validity_check = extensionOPC.validateField(field_name, element.val(), check_email);
		if (validity_check == 0) // błąd i wymagane
		{
			extensionOPC.displayFieldState(element, 0);
			extensionOPC.displayState(element, 2);
		}
		else if (validity_check == 1) // ok
		{
			state = 1;
			extensionOPC.displayFieldState(element, 1);
			extensionOPC.displayState(element, 1);		
		}
		else if (validity_check == 2) // błąd ale pole nie wymagane
		{
			state = 2;
			extensionOPC.displayState(element, 4);
		}
		else if (validity_check == 3) // loader
		{
			extensionOPC.displayState(element, 3);
		}
		
		if (state == 2 || state == 1) {	
			if (field !== undefined && field['update'] && update) {
				extensionOPC.updatePartitialAddress($(element), field_name, 0, '')
			}
		}		
	},

	/*
	 *	Validacja wszystkich pól
	 */
	validateAllFieldsNow: function(submit_account, check_email) 
	{
		$('#new_account_form input[type=text], #new_account_form input[type=password], #new_account_form select , #new_account_form textarea').each(function () {
			if (submit_account || jQuery.trim($(this).val()) != "")
				extensionOPC.validateFieldAndState($(this), check_email, false);
		});
	},

	paymentMethodsGet: function()
	{
		if ($('#HOOK_PAYMENT').length == 0)
			return;
		
		var html = '';
		var currentPaymentMethod = $('input[name=id_method_paymend]:checked').data('href'); 
		
		if ($('#HOOK_PAYMENT #confirmOrder').length)
			extensionOPC.is_free_order = true;
		else
			extensionOPC.is_free_order = false;
		
		$('.payment_module').each(function(i)
			{
			var a = $(this).find('a');
			html += '<table class="resume table table-bordered'+(currentPaymentMethod == a.attr('href') ? ' selected' : '' )+'"><tr>';
			html += '<td class="td1_payment"><input type="radio" name="id_method_paymend" id="payment_method_id_'+i+'" '+(currentPaymentMethod == a.attr('href') ? 'checked="checked"' : '' )+' value="'+i+'" class="wysylka_w_payment" data-href='+a.attr('href')+' /></td>';
			var img = $(this).find('a').css('background-image').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
			html += '<td class="td2_payment"><label for="payment_method_id_'+i+'" class="img_w_payment"><img src="'+img+'" alt="" /></label></td>';
			//$(this).find('img').remove();
			html += '<td class="td3_payment"><label for="payment_method_id_'+i+'" class="opis_w_payment">'+a.html()+'</label></td>';
			html += '</tr></table>';
			$(this).attr('id', 'payment_method_'+i+'');
		});
		$('#paymentMethods').html(html);
		

		if($('#HOOK_PAYMENT').html().indexOf('warning')>-1)
		{
			$('#paymentErrorsOPC').html($('#HOOK_PAYMENT .warning').html()).stop(true, true).fadeIn();
			$.scrollTo('#paymentErrorsOPC', 400);
		}
		else
		{
			$('#paymentErrorsOPC').html('').fadeOut();
		}		
		
		$('input[name=id_method_paymend]').off().on('change', function()
		{
			$('#paymentMethods table').removeClass('selected');
			$(this).parents('table').addClass('selected');
			$('#paymentErrors').slideUp('slow');
		});		
		
	},

	updateCarrierList: function(json)
	{
		var html = json.carrier_block;
		
		$('#carrier_area').replaceWith(html);
		//htmnet//extensionOPC.bindInputs();
		$('#HOOK_BEFORECARRIER').html(json.HOOK_BEFORECARRIER);
		

		extensionOPC.addSelectedCarrier();
	},
	
	addSelectedCarrier: function()
	{
		$('.delivery_option table').removeClass('selected');
		$('.delivery_option_radio:checked').parents('table').addClass('selected');
	},
	
	updatePaymentMethods: function(json)
	{
		$('#HOOK_TOP_PAYMENT').html(json.HOOK_TOP_PAYMENT);
		$('#opc_payment_methods-content #HOOK_PAYMENT').html(json.HOOK_PAYMENT);
		extensionOPC.paymentMethodsGet();
	},

	redirectToPayment: function(checkedPayment)
	{
		var url = $('#payment_method_'+checkedPayment+' a').attr('href');
		var onclick = $('#payment_method_'+checkedPayment+' a').attr('onclick');
			
		if(typeof(onclick) != 'undefined')
		{
			onclick = onclick.replace(/\ *javascript\ *:/gi,'');
			$('#payment_method_'+checkedPayment+' a').attr('href', 'javascript:'+url);
			//window.location.href =  $('#payment_method_'+checkedPayment+' a').attr('href');
			//alert($('#paypal_payment_form').html());
			$('#payment_method_'+checkedPayment+' a').click();
		/*
		*/
		}
		else
		{
			window.location.href = url ;
		}
	},

	validateCGV: function()
	{
		var element = $('#cgv');
		var element_cgv = element;
		if(element.parent().parent().hasClass('checker'))
			var element_cgv = $('#cgv').parent().parent();
		if(element.is(':checked'))
		{
			extensionOPC.displayState(element_cgv, 1);
			$('#errorCGV').slideUp('slow');
			return true;
		}
		
		extensionOPC.displayState(element_cgv, 2);
		return false;
	},
	
	/*
	 *	Czy utworzyć konto
	 */
	checkCreateAccount: function()
	{
		if($('#create_account').prop('checked'))
		{
			$('#is_new_customer').val(1);
			$('.password').slideDown('slow');
		}
		else
		{
			$('#is_new_customer').val(0);
			$('.password').slideUp('slow');
		}
	},
	
	/*
	 *	Czy inny adres do faktury
	 */
	checkInvoiceAddress: function()
	{
		if($('#invoice_address').prop('checked'))
		{
			$('#opc_invoice_address').slideDown('slow');
		}
		else
		{
			$('#opc_invoice_address').slideUp('slow');
		}
	},
	
	/*
	 *	Bind inputs
	 */
	bindInputs: function()
	{
		// Order message update
		$('#message').blur(function() {
			$('#opc_delivery_methods-overlay').fadeIn('slow');
			$.ajax({
				type: 'POST',
				headers: { "cache-control": "no-cache" },
				url: orderOpcUrl + '?rand=' + new Date().getTime(),
				async: true,
				cache: false,
				dataType : "json",
				data: 'ajax=true&method=updateMessage&message=' + encodeURIComponent($('#message').val()) + '&token=' + static_token ,
				success: function(jsonData)
				{
					if (jsonData.hasError)
					{
						var errors = '';
						for(var error in jsonData.errors)
							//IE6 bug fix
							if(error !== 'indexOf')
								errors += $('<div />').html(jsonData.errors[error]).text() + "\n";
						alert(errors);
					}
				else
					$('#opc_delivery_methods-overlay').fadeOut('slow');
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if (textStatus !== 'abort')
						alert("TECHNICAL ERROR: unable to save message \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus);
					$('#opc_delivery_methods-overlay').fadeOut('slow');
				}
			});
			if (typeof bindUniform !=='undefined')
				bindUniform();
		});
		
		// Recyclable checkbox
		$('#recyclable').on('click', function(e){
			updateCarrierSelectionAndGift();
		});
		
		// Gift checkbox update
		$('#gift').off('click').on('click', function(e){
			if ($('#gift').is(':checked'))
				$('#gift_div').show();
			else
				$('#gift_div').hide();
			updateCarrierSelectionAndGift();
		});
		
		if ($('#gift').is(':checked'))
			$('#gift_div').show();
		else
			$('#gift_div').hide();

		// Gift message update
		$('#gift_message').on('change', function() {
			updateCarrierSelectionAndGift();
		});
	
		// Term Of Service (TOS)
		$('#cgv').click(function() {
			updatePaymentMethodsDisplay();
			extensionOPC.validateCGV()
		});
		$('#cgv2').live('click', function() {
			if($('#cgv2').is(':checked'))
				$('#errorCGV2').slideUp('slow');
		});
		$('#cgv3').live('click', function() {
			if($('#cgv3').is(':checked'))
				$('#errorCGV3').slideUp('slow');
		});
		$('#cgv4').live('click', function() {
			if($('#cgv4').is(':checked'))
				$('#errorCGV4').slideUp('slow');
		});
		/*$('#cgv5').click(function() {
			if($('#cgv5').is(':checked'))
				$('#errorCGV5').slideUp('slow');
		});*/
		
		$('#new_account_form input').focus(function () {
			$(this).nextAll('span.helper').addClass('helper-focus');
		});
		$('#new_account_form input').blur(function () {
			$(this).nextAll('span.helper').removeClass('helper-focus');
		});	

		$('#new_account_form input[type=text], #new_account_form input[type=password], #new_account_form select , #new_account_form textarea').blur(function () {
			extensionOPC.validateFieldAndState($(this), true, true);
		});

		$('#new_account_form input[type=text], #new_account_form input[type=password], #new_account_form select , #new_account_form textarea').focus(function () {
			extensionOPC.setCurrentValue($(this).val());
		});

		$('#new_account_form select').on('change', function () {	
			var field_name = $(this).attr('name');
			
			if (field_name.indexOf("_invoice") == -1) {
				extensionOPC.saveAddress('delivery', true, true, '', '');
			} else if ($('#invoice_address').is(':checked')) {
				extensionOPC.saveAddress('invoice', true, true, '', '');
			}
		});
		
	},
	
	confirmFreeOrder: function()
	{
		if ($('#opc_new_account-overlay').length !== 0)
			$('#opc_new_account-overlay').fadeIn('slow');
		else
			$('#opc_account-overlay').fadeIn('slow');
		$('#opc_delivery_methods-overlay, #opc_payment_methods-overlay').fadeOut('slow');
		$('#confirmOrder').prop('disabled', 'disabled');
		$.ajax({
			type: 'POST',
			headers: { "cache-control": "no-cache" },
			url: orderOpcUrl + '?rand=' + new Date().getTime(),
			async: true,
			cache: false,
			dataType : "html",
			data: 'ajax=true&method=makeFreeOrder&token=' + static_token ,
			success: function(html)
			{
				$('#confirmOrder').prop('disabled', false);
				var array_split = html.split(':');
				if (array_split[0] == 'freeorder')
				{
					if (isGuest)
						document.location.href = guestTrackingUrl+'?id_order='+encodeURIComponent(array_split[1])+'&email='+encodeURIComponent(array_split[2]);
					else
						document.location.href = historyUrl;
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (textStatus !== 'abort')
				{
					error = "TECHNICAL ERROR: unable to confirm the order \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus;
					if (!!$.prototype.fancybox)
						$.fancybox.open([
							{
								type: 'inline',
								autoScale: true,
								minHeight: 30,
								content: '<p class="fancybox-error">' + error + '</p>'
							}
						], {
							padding: 0
						});
					else
						alert(error);
				}
			}
		});
	},
	
	updatePartitialAddress: function(element, field_name, params, callback)
	{
		if($(element).val() == extensionOPC.field_tmp_value) 
			return;
		
		if (field_name.indexOf("_invoice") == -1) {
			extensionOPC.saveAddress('delivery', true, true, params, callback);
		} else if ($('#invoice_address').is(':checked')) {
			extensionOPC.saveAddress('invoice', true, true, params, callback);
		}		
		
		return;
		
		if (field_name != 'id_country' && field_name != 'id_country_invoice')
			return;
		
	/*	if (typeof(extensionOPC.doAjax['partialAddress']) == 'undefined') {
			extensionOPC.doAjax['partialAddress'].abort();
			extensionOPC.hideWait('opc_delivery_methods');
		}*/
		
		extensionOPC.doAjax['partialAddress'] = $.ajax({
		   type: 'POST',
		   url: orderOpcUrl,
		   async: true,
		   cache: false,
		   dataType : "json",
		   data: 'ajax=true&method=updateCountry&id_country=' + $('#id_country').val() + '&token=' + static_token+'&' ,
		   beforeSend: function(){
				extensionOPC.displayWait('opc_delivery_methods');
		   },
		   success: function(jsonData)
		   {
				if (jsonData.hasError)
				{
					var errors = '';
					for(error in jsonData.errors)
						//IE6 bug fix
						if(error != 'indexOf')
							errors += jsonData.errors[error] + "\n";
					alert(errors);
				}
				else
				{
					updateCartSummary(jsonData.summary);
					extensionOPC.updatePaymentMethods(jsonData);
					updateHookShoppingCart(jsonData.summary.HOOK_SHOPPING_CART);
					updateHookShoppingCartExtra(jsonData.summary.HOOK_SHOPPING_CART_EXTRA);
					extensionOPC.updateCarrierList(jsonData.carrier_data);
					refreshDeliveryOptions();
				}
				extensionOPC.hideWait('opc_delivery_methods');
			},
		   error: function(XMLHttpRequest, textStatus, errorThrown) {alert("TECHNICAL ERROR: unable to save carrier \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus);}
	   });
	},	
	
	saveAddress: function(type, partitial, async, addparams, callback)
	{
		if (type !== 'delivery' && type !== 'invoice')
			return false;
		
		var params = 'firstname='+encodeURIComponent($('#firstname'+(type == 'invoice' ? '_invoice' : '')).val())+'&lastname='+encodeURIComponent($('#lastname'+(type == 'invoice' ? '_invoice' : '')).val())+'&';
		
		if($('#company'+(type == 'invoice' ? '_invoice' : '')).val() != undefined)
		params += 'company='+encodeURIComponent($('#company'+(type == 'invoice' ? '_invoice' : '')).val())+'&';
		params += 'vat_number='+encodeURIComponent($('#vat_number'+(type == 'invoice' ? '_invoice' : '')).val())+'&';
		params += 'dni='+encodeURIComponent($('#dni'+(type == 'invoice' ? '_invoice' : '')).val())+'&';
		params += 'address1='+encodeURIComponent($('#address1'+(type == 'invoice' ? '_invoice' : '')).val())+'&';
		params += 'postcode='+encodeURIComponent($('#postcode'+(type == 'invoice' ? '_invoice' : '')).val())+'&';
		params += 'city='+encodeURIComponent($('#city'+(type == 'invoice' ? '_invoice' : '')).val())+'&';
		params += 'id_country='+encodeURIComponent($('#id_country'+(type == 'invoice' ? '_invoice' : '')).val())+'&';
		if ($('#id_state'+(type == 'invoice' ? '_invoice' : '')).val())
			params += 'id_state='+encodeURIComponent($('#id_state'+(type == 'invoice' ? '_invoice' : '')).val())+'&';
		params += 'phone='+encodeURIComponent($('#phone_mobile'+(type == 'invoice' ? '_invoice' : '')).val())+'&';
		params += 'alias='+encodeURIComponent($('#alias'+(type == 'invoice' ? '_invoice' : '')).val())+'&';
		if (type == 'delivery' && $('#opc_id_address_delivery').val() != undefined && parseInt($('#opc_id_address_delivery').val()) > 0)
			params += 'opc_id_address_delivery='+encodeURIComponent($('#opc_id_address_delivery').val())+'&';
		if (type == 'invoice' && $('#opc_id_address_invoice').val() != undefined && parseInt($('#opc_id_address_invoice').val()) > 0)			
			params += 'opc_id_address_invoice='+encodeURIComponent($('#opc_id_address_invoice').val())+'&';		
		if(partitial)
			params += 'partialSubmitAddress=true&';
		else
			params += 'submitAddress=true&';
		
		if (type == 'invoice')
			params += 'type_invoice=' + $('input[name=type_invoice]:checked').val() + '&';
		
		// Clean the last &
		params = params.substr(0, params.length-1) + addparams;

		var result = false;
		
		var uri = addressUrl;
		if(partitial)
		{
			uri = orderOpcUrl;
			params += '&method=partialSubmitAddress';
		}
			
		$.ajax({
			type: 'POST',
			headers: { "cache-control": "no-cache" },
			url: uri + '?rand=' + new Date().getTime(),
			async: false,
			cache: false,
			dataType : "json",
			data: 'ajax=true&type='+type+'&'+params+'&token=' + static_token,
			success: function(jsonData)
			{
				if (!jsonData && extensionOPC.submit_payment && extensionOPC.address_refresh < 3) {
					console.log(uri+'?ajax=true&type='+type+'&'+params+'&token=' + static_token);
					extensionOPC.address_refresh++;
					return extensionOPC.saveAddress(type, partitial, async, addparams, callback);
				}
				
				if(!extensionOPC.paymentGo)
					extensionOPC.paymentGo = true;
					
				if (jsonData.hasError)
				{
					var tmp = '';
					var i = 0;
					for(var error in jsonData.errors)
						//IE6 bug fix
						if(error !== 'indexOf')
						{
							i = i+1;
							tmp += '<li>'+jsonData.errors[error]+'</li>';
						}
					tmp += '</ol>';
					var errors = '<b>'+txtThereis+' '+i+' '+txtErrors+':</b><ol>'+tmp;
					var errorform = '#opc_account_errors';
					if(type == 'invoice')
						errorform = '#opc_account_errors_'+type;
					$(errorform).slideUp('fast', function(){
						$(this).html(errors).slideDown('slow', function(){
							$.scrollTo(errorform, 800);
						});
					});
					$('#opc_account-overlay, #opc_delivery_methods-overlay, #opc_payment_methods-overlay').fadeOut('slow');
					result = false;
				}
				else
				{
					// update addresses id
					$('input#opc_id_address_delivery').val(jsonData.id_address_delivery);
					$('input#opc_id_address_invoice').val(jsonData.id_address_invoice);
					
					
					if(partitial)
					{
						updateCartSummary(jsonData.summary);
						extensionOPC.updatePaymentMethods(jsonData);
						updateHookShoppingCart(jsonData.summary.HOOK_SHOPPING_CART);
						updateHookShoppingCartExtra(jsonData.summary.HOOK_SHOPPING_CART_EXTRA);
						extensionOPC.updateCarrierList(jsonData.carrier_data);	
					}
					
					if(refreshDeliveryOptions) {
						refreshDeliveryOptions();
					}
					result = true;
					
					if (callback != '') {
						if (callback == 'checkAddressInvoice')
							checkAddressInvoice();
						else if (callback == 'doPayment')
							doPayment();
						else
							extensionOPC.postCodeValidResponse(jsonData);
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (extensionOPC.submit_payment && extensionOPC.address_refresh < 3) {
					extensionOPC.saveAddress(type, partitial, async, addparams, callback);
					extensionOPC.address_refresh++;
				} else {
					if (textStatus !== 'abort')
						alert("TECHNICAL ERROR: unable to save adresses \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus);
				}
				$('#opc_account-overlay, #opc_delivery_methods-overlay, #opc_payment_methods-overlay').fadeOut('slow');
			}
			});

		return result;
	},
	
	displayWait: function(id) {
		if ($('#'+id).parent().hasClass('opc-wrap'))
			return;
		
		$('#'+id).wrap('<div class="opc-wrap" style="position:relative;"></div>');
		var _cover = $('<div class="opc-cover" style="position:absolute;z-index:100;width:100%;height:100%;background:#FFF url(\'' + extensionOPC.urlImgLoader + '\') center no-repeat;opacity:0.9;"></div>');
		_cover.prependTo('.opc-wrap').hide().fadeIn('fast');
	},

	hideWait: function(id) {
		$('#'+id).siblings('.opc-cover').fadeOut('fast', function(){
			$('#'+id).siblings('.opc-cover').remove();
			$('#'+id).unwrap('<div class="opc_wrap"></div>');
		});
	}	
	
}

function updatePaymentMethodsDisplay()
{
	var checked = '';
	if ($('#cgv:checked').length !== 0)
		checked = 1;
	else
		checked = 0;
		
	/*if (typeof(extensionOPC.doAjax['payment']) == 'undefined') {
		extensionOPC.doAjax['payment'].abort();
	}*/
	
	$('#opc_payment_methods-overlay').fadeIn('slow', function(){
		extensionOPC.doAjax['payment'] = $.ajax({
			type: 'POST',
			headers: { "cache-control": "no-cache" },
			url: orderOpcUrl + '?rand=' + new Date().getTime(),
			async: true,
			cache: false,
			dataType : "json",
			data: 'ajax=true&method=updateTOSStatusAndGetPayments&checked=' + checked + '&token=' + static_token,
			success: function(json)
			{
				extensionOPC.updatePaymentMethods(json);
				if (typeof bindUniform !=='undefined')
					bindUniform();
			}
		});
		$(this).fadeOut('slow');		
	});
}

function updateCarrierSelectionAndGift()
{
	var recyclablePackage = 0;
	var gift = 0;
	var giftMessage = '';
	
	var delivery_option_radio = $('.delivery_option_radio');
	var delivery_option_params = '&';
	$.each(delivery_option_radio, function(i) {
		if ($(this).prop('checked'))
			delivery_option_params += $(delivery_option_radio[i]).attr('name') + '=' + $(delivery_option_radio[i]).val() + '&';
	});
	if (delivery_option_params == '&')
		delivery_option_params = '&delivery_option=&';

	if ($('input#recyclable:checked').length)
		recyclablePackage = 1;
	if ($('input#gift:checked').length)
	{
		gift = 1;
		giftMessage = encodeURIComponent($('#gift_message').val());
	}
	
	$.ajax({
		type: 'POST',
		headers: { "cache-control": "no-cache" },
		url: orderOpcUrl + '?rand=' + new Date().getTime(),
		async: true,
		cache: false,
		dataType : "json",
		data: 'ajax=true&method=updateCarrierAndGetPayments' + delivery_option_params + 'recyclable=' + recyclablePackage + '&gift=' + gift + '&gift_message=' + giftMessage + '&token=' + static_token ,
		beforeSend: function(){
			extensionOPC.displayWait('opc_payment_methods');
		},
		success: function(jsonData)
		{
			if (jsonData.hasError)
			{
				var errors = '';
				for(var error in jsonData.errors)
					//IE6 bug fix
					if(error !== 'indexOf')
						errors += $('<div />').html(jsonData.errors[error]).text() + "\n";
	            if (!!$.prototype.fancybox)
	                $.fancybox.open([
	                    {
	                        type: 'inline',
	                        autoScale: true,
	                        minHeight: 30,
	                        content: '<p class="fancybox-error">' + errors + '</p>'
	                    }
	                ], {
	                    padding: 0
	                });
	            else
	                alert(errors);
			}
			else
			{
				updateCartSummary(jsonData.summary);
				extensionOPC.updatePaymentMethods(jsonData);
				updateHookShoppingCart(jsonData.summary.HOOK_SHOPPING_CART);
				updateHookShoppingCartExtra(jsonData.summary.HOOK_SHOPPING_CART_EXTRA);
				extensionOPC.updateCarrierList(jsonData.carrier_data);
				refreshDeliveryOptions();
				if (typeof bindUniform !=='undefined')
					bindUniform();
			}
			extensionOPC.hideWait('opc_payment_methods');
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			/*if (textStatus !== 'abort')
				alert("TECHNICAL ERROR: unable to save carrier \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus);*/
			
			updateCarrierSelectionAndGift();
			console.log("TECHNICAL ERROR: unable to save carrier \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus);
			
			$('#opc_delivery_methods-overlay, #opc_payment_methods-overlay').fadeOut('slow');
		}
	});
}

function updateNewAccountToAddressBlock()
{
	$('#opc_account-overlay, #opc_delivery_methods-overlay, #opc_payment_methods-overlay').fadeOut('slow');
	$.ajax({
		type: 'POST',
		headers: { "cache-control": "no-cache" },
		url: orderOpcUrl + '?rand=' + new Date().getTime(),
		async: true,
		cache: false,
		dataType : "json",
		data: 'ajax=true&method=getAddressBlockAndCarriersAndPayments&token=' + static_token ,
		success: function(json)
		{
			if (json.hasError)
			{
				var errors = '';
				for(var error in json.errors)
					//IE6 bug fix
					if(error !== 'indexOf')
						errors += $('<div />').html(json.errors[error]).text() + "\n";
				alert(errors);
			}
			else
			{
				isLogged = 1;
				isGuest = 0;
				
				if (json.no_address == 1)
					document.location.href = addressUrl;
				
				if (typeof bindOPCCGV !=='undefined')
					bindOPCCGV();
				
				$('#opc_new_account').fadeOut('fast', function() {
					if (typeof json.formatedAddressFieldsValuesList !== 'undefined' && json.formatedAddressFieldsValuesList )
						formatedAddressFieldsValuesList = json.formatedAddressFieldsValuesList;
					if (typeof json.order_opc_adress !== 'undefined' && json.order_opc_adress)
						$('#opc_new_account').html(json.order_opc_adress);
					// update block user info
					if (json.block_user_info !== '' && $('#header_user').length == 1)
					{
						var elt = $(json.block_user_info).find('#header_user_info').html();					
						$('#header_user_info').fadeOut('nortmal', function() {
							$(this).html(elt).fadeIn();
						});
					}
					$(this).fadeIn('fast', function() {
						//After login, the products are automatically associated to an address
						$.each(json.summary.products, function() {
							updateAddressId(this.id_product, this.id_product_attribute, '0', this.id_address_delivery);
						});
						updateAddressesDisplay(true);
						extensionOPC.updateCarrierList(json.carrier_data);
						updateCarrierSelectionAndGift();
						extensionOPC.updatePaymentMethods(json);
						if ($('#gift-price').length == 1)
							$('#gift-price').html(json.gift_price);
						$('#opc_delivery_methods-overlay, #opc_payment_methods-overlay').fadeOut('slow');
					});
				});
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			if (textStatus !== 'abort')
				alert("TECHNICAL ERROR: unable to send login informations \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus);
			$('#opc_delivery_methods-overlay, #opc_payment_methods-overlay').fadeOut('slow');
		}
	});
}

function updateAddressSelection()
{
	var idAddress_delivery = ($('#opc_id_address_delivery').length == 1 ? $('#opc_id_address_delivery').val() : $('#id_address_delivery').val());
	var idAddress_invoice = ($('#opc_id_address_invoice').length == 1 ? $('#opc_id_address_invoice').val() : ($('#addressesAreEquals:checked').length == 1 ? idAddress_delivery : ($('#id_address_invoice').length == 1 ? $('#id_address_invoice').val() : idAddress_delivery)));

	$('#opc_account-overlay').fadeIn('slow');
	$('#opc_delivery_methods-overlay').fadeIn('slow');
	$('#opc_payment_methods-overlay').fadeIn('slow');
	
	$.ajax({
		type: 'POST',
		headers: { "cache-control": "no-cache" },
		url: orderOpcUrl + '?rand=' + new Date().getTime(),
		async: true,
		cache: false,
		dataType : "json",
		data: 'allow_refresh=1&ajax=true&method=updateAddressesSelected&id_address_delivery=' + idAddress_delivery + '&id_address_invoice=' + idAddress_invoice + '&token=' + static_token,
		success: function(jsonData)
		{
			if (jsonData.hasError)
			{
				var errors = '';
				for(var error in jsonData.errors)
					//IE6 bug fix
					if(error !== 'indexOf')
						errors += $('<div />').html(jsonData.errors[error]).text() + "\n";
	            if (!!$.prototype.fancybox)
	                $.fancybox.open([
	                    {
	                        type: 'inline',
	                        autoScale: true,
	                        minHeight: 30,
	                        content: '<p class="fancybox-error">' + errors + '</p>'
	                    }
	                ], {
	                    padding: 0
	                });
	            else
	                alert(errors);
			}
			else
			{
				if (jsonData.refresh)
					location.reload();
				// Update all product keys with the new address id
				$('#cart_summary .address_'+deliveryAddress).each(function() {
					$(this)
						.removeClass('address_'+deliveryAddress)
						.addClass('address_'+idAddress_delivery);
					$(this).attr('id', $(this).attr('id').replace(/_\d+$/, '_'+idAddress_delivery));
					if ($(this).find('.cart_unit span').length > 0 && $(this).find('.cart_unit span').attr('id').length > 0)
						$(this).find('.cart_unit span').attr('id', $(this).find('.cart_unit span').attr('id').replace(/_\d+$/, '_'+idAddress_delivery));

					if ($(this).find('.cart_total span').length > 0 && $(this).find('.cart_total span').attr('id').length > 0)
						$(this).find('.cart_total span').attr('id', $(this).find('.cart_total span').attr('id').replace(/_\d+$/, '_'+idAddress_delivery));

					if ($(this).find('.cart_quantity_input').length > 0 && $(this).find('.cart_quantity_input').attr('name').length > 0)
					{
						var name = $(this).find('.cart_quantity_input').attr('name')+'_hidden';
						$(this).find('.cart_quantity_input').attr('name', $(this).find('.cart_quantity_input').attr('name').replace(/_\d+$/, '_'+idAddress_delivery));
						if ($(this).find('[name="' + name + '"]').length > 0)
							$(this).find('[name="' + name +' "]').attr('name', name.replace(/_\d+_hidden$/, '_'+idAddress_delivery+'_hidden'));
					}

					if ($(this).find('.cart_quantity_delete').length > 0 && $(this).find('.cart_quantity_delete').attr('id').length > 0)
					{
						$(this).find('.cart_quantity_delete')
							.attr('id', $(this).find('.cart_quantity_delete').attr('id').replace(/_\d+$/, '_'+idAddress_delivery))
							.attr('href', $(this).find('.cart_quantity_delete').attr('href').replace(/id_address_delivery=\d+&/, 'id_address_delivery='+idAddress_delivery+'&'));
					}
					
					if ($(this).find('.cart_quantity_down').length > 0 && $(this).find('.cart_quantity_down').attr('id').length > 0)
					{
						$(this).find('.cart_quantity_down')
							.attr('id', $(this).find('.cart_quantity_down').attr('id').replace(/_\d+$/, '_'+idAddress_delivery))
							.attr('href', $(this).find('.cart_quantity_down').attr('href').replace(/id_address_delivery=\d+&/, 'id_address_delivery='+idAddress_delivery+'&'));
					}

					if ($(this).find('.cart_quantity_up').length > 0 && $(this).find('.cart_quantity_up').attr('id').length > 0)
					{
						$(this).find('.cart_quantity_up')
							.attr('id', $(this).find('.cart_quantity_up').attr('id').replace(/_\d+$/, '_'+idAddress_delivery))
							.attr('href', $(this).find('.cart_quantity_up').attr('href').replace(/id_address_delivery=\d+&/, 'id_address_delivery='+idAddress_delivery+'&'));
					}	
				});

				// Update global var deliveryAddress
				deliveryAddress = idAddress_delivery;
				if (window.ajaxCart !== undefined)
				{
					$('.cart_block_list dd, .cart_block_list dt').each(function(){
						if (typeof($(this).attr('id')) != 'undefined')
							$(this).attr('id', $(this).attr('id').replace(/_\d+$/, '_' + idAddress_delivery));
					});
				}
				extensionOPC.updateCarrierList(jsonData.carrier_data);
				extensionOPC.updatePaymentMethods(jsonData);
				updateCartSummary(jsonData.summary);
				updateHookShoppingCart(jsonData.HOOK_SHOPPING_CART);
				updateHookShoppingCartExtra(jsonData.HOOK_SHOPPING_CART_EXTRA);
				if ($('#gift-price').length == 1)
					$('#gift-price').html(jsonData.gift_price);
				$('#opc_account-overlay, #opc_delivery_methods-overlay, #opc_payment_methods-overlay').fadeOut('slow');
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			if (textStatus !== 'abort')
			{
				error = "TECHNICAL ERROR: unable to save adresses \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus;
	            if (!!$.prototype.fancybox)
	                $.fancybox.open([
	                    {
	                        type: 'inline',
	                        autoScale: true,
	                        minHeight: 30,
	                        content: '<p class="fancybox-error">' + error + '</p>'
	                    }
	                ], {
	                    padding: 0
	                });
	            else
	                alert(error);
			}
			$('#opc_account-overlay, #opc_delivery_methods-overlay, #opc_payment_methods-overlay').fadeOut('slow');
		}
	});
}

function getCarrierListAndUpdate()
{
	$('#opc_delivery_methods-overlay').fadeIn('slow');
	$.ajax({
		type: 'POST',
		headers: { "cache-control": "no-cache" },
		url: orderOpcUrl + '?rand=' + new Date().getTime(),
		async: true,
		cache: false,
		dataType : "json",
		data: 'ajax=true&method=getCarrierList&token=' + static_token,
		success: function(jsonData)
		{
			if (jsonData.hasError)
			{
				var errors = '';
				for(var error in jsonData.errors)
					//IE6 bug fix
					if(error !== 'indexOf')
						errors += $('<div />').html(jsonData.errors[error]).text() + "\n";
	            if (!!$.prototype.fancybox)
	            {
	                $.fancybox.open([
	                    {
	                        type: 'inline',
	                        autoScale: true,
	                        minHeight: 30,
	                        content: '<p class="fancybox-error">' + errors + '</p>'
	                    }
	                ], {
	                    padding: 0
	                });
	            }
	            else
				{
		            if (!!$.prototype.fancybox)
		                $.fancybox.open([
		                    {
		                        type: 'inline',
		                        autoScale: true,
		                        minHeight: 30,
		                        content: '<p class="fancybox-error">' + errors + '</p>'
		                    }
		                ], {
		                    padding: 0
		                });
		            else
		                alert(errors);
				}
			}
			else
				extensionOPC.updateCarrierList(jsonData);
			$('#opc_delivery_methods-overlay').fadeOut('slow');
		}
	});
}

$(document).ready(function() 
{
	extensionOPC.checkCreateAccount();
	extensionOPC.checkInvoiceAddress();

	// Check create account or guest
	$('#create_account').change(function(){
		extensionOPC.checkCreateAccount();
	});
		
	// Check invoice address
	$('#invoice_address').change(function(){
		extensionOPC.checkInvoiceAddress();
	});
	
	$('#openLoginFormBlock').click(function() {
		$('#closeLoginFormBlock').show();
		$(this).hide();
		$('#login_form_content').slideDown('slow');
		return false;
	});
	
	$('#closeLoginFormBlock').click(function() {
		$('#openLoginFormBlock').show();
		$(this).hide();
		$('#login_form_content').slideUp('slow');
		return false;
	});
	
	$('input[name="type_invoice"]').on('change', function() {
		refreshTypeInvoice($(this).val());
	});
	
	refreshTypeInvoice($('input[name="type_invoice"]:checked').val());
	
	$('#copy-address').on('click', function(e) {
		e.preventDefault();
		
		var fields = ['firstname', 'lastname', 'company', 'vat_number', 'address1', 'address2', 'postcode', 'city', 'phone_mobile'];
		
		for (i in fields) {
			var $field = $('#' + fields[i] + '_invoice');
			$field.val($('#' + fields[i]).val());
		
			extensionOPC.validateFieldAndState($field, false, false);
		}
		
		return false;
	});
	
	extensionOPC.addSelectedCarrier();
	extensionOPC.validateAllFieldsNow(false, true);
	extensionOPC.validateCGV();
	extensionOPC.paymentMethodsGet();
	extensionOPC.bindInputs();

	// GUEST CHECKOUT / NEW ACCOUNT MANAGEMENT
	if ((typeof isLogged == 'undefined' || !isLogged) || (typeof isGuest !== 'undefined' && isGuest))
	{
	
		// LOGIN FORM SENDING
		$(document).on('click', '#SubmitLogin', function(e)
		{
			e.preventDefault();
			$.ajax({
				type: 'POST',
				headers: { "cache-control": "no-cache" },
				url: authenticationUrl + '?rand=' + new Date().getTime(),
				async: false,
				cache: false,
				dataType : "json",
				data: 'SubmitLogin=true&ajax=true&email='+encodeURIComponent($('#login_email').val())+'&passwd='+encodeURIComponent($('#login_passwd').val())+'&token=' + static_token ,
				success: function(jsonData)
				{
					if (jsonData.hasError)
					{
						var errors = '<b>'+txtThereis+' '+jsonData.errors.length+' '+txtErrors+':</b><ol>';
						for(var error in jsonData.errors)
							//IE6 bug fix
							if(error !== 'indexOf')
								errors += '<li>'+jsonData.errors[error]+'</li>';
						errors += '</ol>';
						$('#opc_login_errors').html(errors).slideDown('slow');
					}
					else
					{
						// update token
						static_token = jsonData.token;
						updateNewAccountToAddressBlock();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if (textStatus !== 'abort')
					{
						error = "TECHNICAL ERROR: unable to send login informations \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus;
			            if (!!$.prototype.fancybox)
			                $.fancybox.open([
			                    {
			                        type: 'inline',
			                        autoScale: true,
			                        minHeight: 30,
			                        content: '<p class="fancybox-error">' + error + '</p>'
			                    }
			                ], {
			                    padding: 0
			                });
			            else
			                alert(error);
					}
				}
			});
		});	
	}
	
	$('#submitOrder').click(function()
	{
		extensionOPC.submit_payment = false;
		extensionOPC.selected_payment = false;
		var _span = $(this).find('span');
		_span.attr('disabled', 'disabled').css('text-align', 'center').data('text', _span.text()).html('<i class="icon-refresh icon-spin"></i>');
		if(!extensionOPC.is_free_order && (!isVirtualCart || $('input[name=id_method_paymend]').length))
		{
			extensionOPC.selected_payment = $('input[name=id_method_paymend]:checked').val();
			if($('input[name=id_method_paymend]:checked').length == 0)
			{
				$('#paymentErrors').slideDown('slow');
				_span.removeAttr('disabled').empty().text(_span.data('text'));
				return false;
			}
		}
		
		// jeśli paczkomaty są uruchomione sprawdza czy został podany numer telefonu oraz czy został wybrany paczkomat
		/*if(typeof(pakomatoOn) != 'undefined')
		{
			if($('.selected_pakomato').length == 0)
			{
				$('#errorPako').slideDown('slow');
				$.scrollTo('#errorPako', 800);
				_span.removeAttr('disabled').empty().text(_span.data('text'));
				return false;
			}
		}*/
		
		// sprawdza czy została zaakceptowana zgoda (domyślna)
		if(!extensionOPC.validateCGV())
		{
			$('#errorCGV').slideDown('slow');
			_span.removeAttr('disabled').empty().text(_span.data('text'));
			return false;
		}
		
		// sprawdza czy została zaakceptowana dodatkowa zgoda
		if($('#cgv2').length > 0 && !$('#cgv2').is(':checked'))
		{
			$('#errorCGV2').slideDown('slow');
			_span.removeAttr('disabled').empty().text(_span.data('text'));
			return false;
		}

		// sprawdza czy została zaakceptowana dodatkowa zgoda
		if($('#cgv3').length > 0 && !$('#cgv3').is(':checked'))
		{
			$('#errorCGV3').slideDown('slow');
			_span.removeAttr('disabled').empty().text(_span.data('text'));
			return false;
		}

		// sprawdza czy została zaakceptowana dodatkowa zgoda
		if($('#cgv4').length > 0 && !$('#cgv4').is(':checked'))
		{
			$('#errorCGV4').slideDown('slow');
			_span.removeAttr('disabled').empty().text(_span.data('text'));
			return false;
		}
		
		// jeśli zalogowany i nie gość 
		if(isLogged && !isGuest)
		{
			if(isVirtualCart && !extensionOPC.selected_payment)
			{
				extensionOPC.confirmFreeOrder();
				_span.removeAttr('disabled').empty().text(_span.data('text'));
				return;
			}
			 extensionOPC.redirectToPayment(extensionOPC.selected_payment);
			 _span.removeAttr('disabled').empty().text(_span.data('text'));
			 return;
		}
		
		var callingFile = '';
		var params = '';

		if (parseInt($('#opc_id_customer').val()) == 0)
		{
			callingFile = authenticationUrl;
			params = 'submitAccount=true&';
		}
		else
		{
			callingFile = orderOpcUrl;
			params = 'method=editCustomer&';
		}		
		
			$('#opc_account_form input:visible, #opc_account_form input[type=hidden]').each(function() {
				if ($(this).is('input[type=checkbox]'))
				{
					if ($(this).is(':checked'))
						params += encodeURIComponent($(this).attr('name'))+'=1&';
				}
				else if ($(this).is('input[type=radio]'))
				{
					if ($(this).is(':checked'))
						params += encodeURIComponent($(this).attr('name'))+'='+encodeURIComponent($(this).val())+'&';
				}
				else
				{
					params += encodeURIComponent($(this).attr('name'))+'='+encodeURIComponent($(this).val())+'&';
				}
			});
			$('#opc_account_form select:visible').each(function() {
				params += encodeURIComponent($(this).attr('name'))+'='+encodeURIComponent($(this).val())+'&';
			});

			params += 'customer_lastname='+encodeURIComponent($('#lastname').val())+'&';
			params += 'customer_firstname='+encodeURIComponent($('#firstname').val())+'&';
			params += 'passwd='+encodeURIComponent($('#passwd').val())+'&';
			params += 'alias='+encodeURIComponent($('#alias').val())+'&';
			//params += 'other='+encodeURIComponent($('#other').val())+'&';
			params += 'other=&';
			params += 'is_new_customer='+encodeURIComponent($('#is_new_customer').val())+'&';
			// Clean the last &
			params = params.substr(0, params.length-1);
			//$('#opc_new_account-overlay, #opc_delivery_methods-overlay, #opc_payment_methods-overlay').fadeIn('slow');
			$.ajax({
				type: 'POST',
				headers: { "cache-control": "no-cache" },
				url: callingFile + '?rand=' + new Date().getTime(),
				async: false,
				cache: false,
				dataType : "json",
				data: '&ajax=true&'+params+'&token=' + static_token ,
				success: function(jsonData)
				{
					extensionOPC.validateAllFieldsNow(true, false);
					extensionOPC.submit_payment = true;
					
					if (jsonData.hasError)
					{
						var tmp = '';
						var i = 0;
						for(var error in jsonData.errors)
							//IE6 bug fix
							if(error !== 'indexOf')
							{
								i = i+1;
								tmp += '<li>'+jsonData.errors[error]+'</li>';
							}
						tmp += '</ol>';
						var errors = '<b>'+txtThereis+' '+i+' '+txtErrors+':</b><ol>'+tmp;
						$('#opc_account_errors').slideUp('fast', function(){
							$(this).html(errors).slideDown('slow', function(){
								$.scrollTo('#opc_account_errors', 800);
							});							
						});	
						
						$('#opc_new_account-overlay, #opc_delivery_methods-overlay, #opc_payment_methods-overlay').fadeOut('slow');
					}
					else
					{
						$('#opc_account_errors').slideUp('slow', function(){
							$(this).html('');
						});
					}

					isGuest = parseInt($('#is_new_customer').val()) == 1 ? 0 : 1;
					// update addresses id
					
					if(jsonData.id_address_delivery !== undefined && jsonData.id_address_delivery > 0)
						$('#opc_id_address_delivery').val(jsonData.id_address_delivery);
					if(jsonData.id_address_invoice !== undefined && jsonData.id_address_invoice > 0)
						$('#opc_id_address_invoice').val(jsonData.id_address_invoice);				
					
					if (jsonData.id_customer !== undefined && jsonData.id_customer !== 0 && jsonData.isSaved)
					{
					
						// update token
						static_token = jsonData.token;
						
						// update id_customer
						$('#opc_id_customer').val(jsonData.id_customer);
						
						if (isGuest)
						{
							isLogged = 1;
						}
						//else if(jsonData.hasError)
							//updateNewAccountToAddressBlock();		
						
						if(!isGuest && isLogged)
						{
							$('#email').attr('disabled', 'disabled');
						}				
						
						// It's not a new customer
						if ($('#opc_id_customer').val() !== '0')
						{
							extensionOPC.address_refresh = 0;
							if (!extensionOPC.saveAddress('delivery', false, false, '', 'checkAddressInvoice')) {
								return false;
							}
						}						

						extensionOPC.submit_payment = false;
						_span.removeAttr('disabled').empty().text(_span.data('text'));
						$('#opc_account-overlay, #opc_delivery_methods-overlay, #opc_payment_methods-overlay').fadeOut('slow');
											
					}
					else {
						_span.removeAttr('disabled').empty().text(_span.data('text'));
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if (textStatus !== 'abort')
						alert("TECHNICAL ERROR: unable to save account \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus);
					_span.removeAttr('disabled').empty().text(_span.data('text'));
					$('#opc_new_account-overlay, #opc_delivery_methods-overlay, #opc_payment_methods-overlay').fadeIn('slow')
				}
			});		
		
	});
	
});

function checkAddressInvoice()
{
	extensionOPC.address_refresh = 0;
	if ($('#invoice_address:checked').length !== 0) {
		if (!extensionOPC.saveAddress('invoice', false, false, '', 'doPayment')) {
			//$('#submitOrder').find('span').removeAttr('disabled').empty().text($('#submitOrder').find('span').data('text'));
			return false;
		}
	} else {
		doPayment();
	}
}

function doPayment()
{
	if(isVirtualCart && $('input[name=id_method_paymend]').length == 0) {
		extensionOPC.confirmFreeOrder();
		//$('#submitOrder').find('span').removeAttr('disabled').empty().text($('#submitOrder').find('span').data('text'));
		return;
	} else {
		extensionOPC.redirectToPayment(extensionOPC.selected_payment);								
	}
}

function refreshTypeInvoice(val)
{
	if(val == 1)
	{
		$('.invoice_field_firstname').hide();
		$('.firstname_invoice').val('');
		$('.invoice_field_lastname').hide();
		$('.lastname_invoice').val('');
		$('.invoice_field_company').show();
	} else if(val == 2) {
		$('.invoice_field_firstname').show();
		$('.invoice_field_lastname').show();
		$('.invoice_field_company').hide();
	}
}