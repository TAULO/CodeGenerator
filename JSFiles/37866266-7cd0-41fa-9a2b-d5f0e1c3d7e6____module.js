/*
 * DC jQuery Vertical Accordion Menu - jQuery vertical accordion menu plugin
 * Copyright (c) 2011 Design Chemical
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 */
// AridiusCategoryaccordion
(function($){
	$.fn.dcAccordion = function(options) {
		//set default options 
		var defaults = {
				classParent	 : 'dcjq-parent',
			classActive	 : 'active',
			classArrow	 : 'dcjq-icon',
			classCount	 : 'dcjq-count',
			classExpand	 : 'dcjq-current-parent',
			classDisable : '',
			eventType	 : 'click',
			hoverDelay	 : 300,
			menuClose     : true,
			autoClose    : true,
			autoExpand	 : false,
			speed        : 'slow',
			saveState	 : true,
			disableLink	 : true,
			showCount : false,
		};
		//call in the default otions
		var options = $.extend(defaults, options);
		this.each(function(options){
			var obj = this;
			$objLinks = $('li > div',obj);
			$objSub = $('li > ul',obj);
			if(defaults.classDisable){
				$objLinks = $('li:not(.'+defaults.classDisable+') > a',obj);
				$objSub = $('li:not(.'+defaults.classDisable+') > ul',obj);
			}
			classActive = defaults.classActive;
			setUpAccordion();
			if(defaults.autoExpand == true){
				$('li.'+defaults.classExpand+' > a').addClass(classActive);
			}
			resetAccordion();
			if(defaults.eventType == 'hover'){
				var config = {
					sensitivity: 2, // number = sensitivity threshold (must be 1 or higher)
					interval: defaults.hoverDelay, // number = milliseconds for onMouseOver polling interval
					over: linkOver, // function = onMouseOver callback (REQUIRED)
					timeout: defaults.hoverDelay, // number = milliseconds delay before onMouseOut
					out: linkOut // function = onMouseOut callback (REQUIRED)
				};
				$objLinks.hoverIntent(config);
				var configMenu = {
					sensitivity: 2, // number = sensitivity threshold (must be 1 or higher)
					interval: 1000, // number = milliseconds for onMouseOver polling interval
					over: menuOver, // function = onMouseOver callback (REQUIRED)
					timeout: 1000, // number = milliseconds delay before onMouseOut
					out: menuOut // function = onMouseOut callback (REQUIRED)
				};
				$(obj).hoverIntent(configMenu);
				// Disable parent links
				if(defaults.disableLink == true){
					$objLinks.click(function(e){
						if($(this).siblings('ul').length >0){
							e.preventDefault();
						}
					});
				}
			} else {
				$objLinks.click(function(e){
					$activeLi = $(this).parent('li');
					$parentsLi = $activeLi.parents('li');
					$parentsUl = $activeLi.parents('ul');
					// Prevent browsing to link if has child links
					if(defaults.disableLink == true){
						if($(this).siblings('ul').length >0){
							e.preventDefault();
						}
					}
					// Auto close sibling menus
					if(defaults.autoClose == true){
						autoCloseAccordion($parentsLi, $parentsUl);
					}
					if ($('> ul',$activeLi).is(':visible')){
						$('ul',$activeLi).slideUp(defaults.speed);
						$('a',$activeLi).removeClass(classActive);
					} else {
						$(this).siblings('ul').slideToggle(defaults.speed);
						$('> a',$activeLi).addClass(classActive);
					}
				});
			}
			// Set up accordion
			function setUpAccordion(){
				$arrow = '<span class="'+defaults.classArrow+'"></span>';
				var classParentLi = defaults.classParent+'-li';
				$objSub.show();
				$('li',obj).each(function(){
					if($('> ul',this).length > 0){
						$(this).addClass(classParentLi);
						$('> a',this).addClass(defaults.classParent).append($arrow);
					}
				});
				$objSub.hide();
				if(defaults.classDisable){
					$('li.'+defaults.classDisable+' > ul').show();
				}
				if(defaults.showCount == true){
					$('li.'+classParentLi,obj).each(function(){
						if(defaults.disableLink == true){
							var getCount = parseInt($('ul a:not(.'+defaults.classParent+')',this).length);
						} else {
							var getCount = parseInt($('ul a',this).length);
						}
					$('> a',this).append(' <span class="'+defaults.classCount+'">('+getCount+')</span>');
					});
				}
			}
			function linkOver(){
			$activeLi = $(this).parent('li');
			$parentsLi = $activeLi.parents('li');
			$parentsUl = $activeLi.parents('ul');
			// Auto close sibling menus
			if(defaults.autoClose == true){
				autoCloseAccordion($parentsLi, $parentsUl);
			}
			if ($('> ul',$activeLi).is(':visible')){
				$('ul',$activeLi).slideUp(defaults.speed);
				$('a',$activeLi).removeClass(classActive);
			} else {
				$(this).siblings('ul').slideToggle(defaults.speed);
				$('> a',$activeLi).addClass(classActive);
			}
		}
		function linkOut(){
		}
		function menuOver(){
		}
		function menuOut(){
			if(defaults.menuClose == true){
				$objSub.slideUp(defaults.speed);
				// Reset active links
			}
		}
		// Auto-Close Open Menu Items
		function autoCloseAccordion($parentsLi, $parentsUl){
			$('ul',obj).not($parentsUl).slideUp(defaults.speed);
			// Reset active links
			$('a',obj).removeClass(classActive);
			$('> a',$parentsLi).addClass(classActive);
		}
		// Reset accordion using active links
		function resetAccordion(){
			$objSub.hide();
			var $parentsLi = $('a.'+classActive,obj).parents('li');
			$('> a',$parentsLi).addClass(classActive);
			$allActiveLi = $('a.'+classActive,obj);
			$($allActiveLi).siblings('ul').show();
		}
		});
	};
})(jQuery);
// Aridiusletters
function subscribe()
{
	$.ajax({
url: 'index.php?route=extension/module/aridius_letters/add_email',
type: 'post',
data: 'email=' + $('.mail_letters2').val(),
dataType: 'json',
success: function(data) {
			if (data['error']) {
				$('.textsuccess').remove();
				if (data['error']['email']) {
					$('.message_email').html('<span class="textdanger">'+data['error']['email']+'</span>').show();
				} else {
					$('.message_email').hide().empty();
				}
				if (data['error']['compare_email']) {
					$('.message_compare').html('<span class="textdanger">'+data['error']['compare_email']+'</span>').show();
				} else {
					$('.message_compare').hide().empty();
				}
			}
			if (data['success']) {
				$('.textdanger').remove();
				$('.message_success').html('<span class="textsuccess">'+data['success_email']+'</span>');
			}
		}
	});
	return false;
}
// AridiusPopupmail
function subscribe_popup()
{
	$.ajax({
url: 'index.php?route=extension/module/aridius_popupmail/add_email',
type: 'post',
data: 'email=' + $('#mail_letters_popup').val(),
dataType: 'json',
success: function(data) {
			if (data['error']) {
				$('.textsuccess').remove();
				if (data['error']['email']) {
					$('.message_email_popup').html('<span class="textdanger">'+data['error']['email']+'</span>').show();
				} else {
					$('.message_email_popup').hide().empty();
				}
				if (data['error']['compare_email']) {
					$('.message_compare_popup').html('<span class="textdanger">'+data['error']['compare_email']+'</span>').show();
				} else {
					$('.message_compare_popup').hide().empty();
				}
			}
			if (data['success']) {
				setTimeout(function() {		
					$('#mailModal').modal('hide');
				}, 5500);	
				$('.textdanger').remove();
				$('.message_success_popup').html('<span class="textsuccess">'+data['success_email']+'</span>');
			}
		}
	});
	return false;
}
// Aridiuscallback
$(document).ready(function() {
	$(document).on("click touchstart", "#call-order-submit", function (e) {
		$('.mfp-content').append('<div class="loader"><div class="bag_quickview"></div></div>');
		$.ajax({
url: 'index.php?route=extension/module/aridiuscallback/write',
type: 'post',
dataType: 'json',
data: $('input[name=\'aridiuscallback_contact\'],input[name=\'aridiuscallback_firstname\'],input[name=\'aridiuscallback_email\'],input[name=\'aridiuscallback_timein\'],input[name=\'aridiuscallback_timeoff\'],textarea[name=\'aridiuscallback_comment\']'),
success: function (data) {
				if (data['error']) {
					$("div.loader").remove();
					$('.aridiuscallback .error').remove();
					if (data['error']['firstname']) {
						$('.aridiuscallback_errorfirstname').html('<span class="text-danger">'+data['error']['firstname']+'</span>').show();
					} else {
						$('.aridiuscallback_errorfirstname').hide().empty();
					}
					if (data['error']['contact']) {
						$('.aridiuscallback_errorcontact').html('<span class="text-danger">'+data['error']['contact']+'</span>').show();
					} else {
						$('.aridiuscallback_errorcontact').hide().empty();
					}
					if (data['error']['email']) {
						$('.aridiuscallback_erroremail').html('<span class="text-danger">'+data['error']['email']+'</span>').show();
					} else {
						$('.aridiuscallback_erroremail').hide().empty();
					}
				}
				if (data['success']) {
					$("div.loader").remove();
					setTimeout(function() {
						$.magnificPopup.close();
					}, 5500);
					$.magnificPopup.open({
items: {
src: 'index.php?route=extension/module/aridiuscallback/success'
						},
type: 'ajax'
					});
				}
			}
		});
	});
	$("body").on("click",".call-order", function(){
		var $lg = $('.pswp');		
		if (typeof $lg.lightGallery == 'function') {
		 var gallery = $lg.lightGallery();
		gallery.data('lightGallery').destroy(true);
		};
		$.magnificPopup.close();
		$.magnificPopup.open({
items: {
src: 'index.php?route=extension/module/aridiuscallback/getForm'
			},
type: 'ajax',
removalDelay: 0,
mainClass: 'my-mfp-zoom-in'
		});
	});
});
// Aridiusfastorder
$(document).ready(function() {
	$(document).on("click touchstart", "#fast-order-submit", function (e) {
		$('.mfp-content').append('<div class="loader"><div class="bag_quickview"></div></div>');
		$.ajax({
url: 'index.php?route=extension/module/aridiusfastorder/write',
type: 'post',
dataType: 'json',
data: $('#product input[type=\'text\'], #product input[type=\'hidden\'], #product input[type=\'radio\']:checked, #product input[type=\'checkbox\']:checked, #product select, #product textarea,input[name=\'aridiusfastorder_contact\'],input[name=\'aridiusfastorder_firstname\'],input[name=\'aridiusfastorder_email\'],textarea[name=\'aridiusfastorder_comment\'],input[name=\'fo_total_price\']'),
success: function (data) {
				if (data['error']) {
					$("div.loader").remove();
					$('.aridiusfastorder .error').remove();
					if (data['error']['firstname']) {
						$('.aridiusfastorder_errorfirstname').html('<span class="text-danger">'+data['error']['firstname']+'</span>').show();
					} else {
						$('.aridiusfastorder_errorfirstname').hide().empty();
					}
					if (data['error']['quantity']) {
						$('.aridiusfastorder_errorquantity').html('<span class="text-danger">'+data['error']['quantity']+'</span>').show();
					} else {
						$('.aridiusfastorder_errorquantity').hide().empty();
					}
					if (data['error']['contact']) {
						$('.aridiusfastorder_errorcontact').html('<span class="text-danger">'+data['error']['contact']+'</span>').show();
					} else {
						$('.aridiusfastorder_errorcontact').hide().empty();
					}
					if (data['error']['email']) {
						$('.aridiusfastorder_erroremail').html('<span class="text-danger">'+data['error']['email']+'</span>').show();
					} else {
						$('.aridiusfastorder_erroremail').hide().empty();
					}
				}
				if (data['success']) {
					$("div.loader").remove();
					setTimeout(function() {
						$.magnificPopup.close();
					}, 5500);
					$.magnificPopup.open({
items: {
src: 'index.php?route=extension/module/aridiusfastorder/success'
						},
type: 'ajax'
					});
				}
			}
		});
	});
	$('body').on('click','#fast-order, #fast-order2, #fast-order3' , function(){
		var $lg = $('.pswp');		
		if (typeof $lg.lightGallery == 'function') {
		var gallery = $lg.lightGallery();
		gallery.data('lightGallery').destroy(true);
		};
		$.ajax({
url: 'index.php?route=extension/module/aridiusfastorder/validOrder',
type: 'post',
data: $('#product input[type=\'text\'], #product input[type=\'hidden\'], #product input[type=\'radio\']:checked, #product input[type=\'checkbox\']:checked, #product select, #product textarea'),
dataType: 'json',
beforeSend: function(){
$('.overlay').html('<div id="preloader"><i class="fa fa-spinner fa-spin"></i></div>');
},
complete: function() {
				$('#fast-order').button('reset');
				$('#fast-order2').button('reset');
				$('#fast-order3').button('reset');
			},
success: function(json) {
				$('.alert, .text-danger').remove();
				$('.form-group').removeClass('has-error');
				if (json['error']) {
					if (json['error']['option']) {
						for (i in json['error']['option']) {
							var element = $('#input-option' + i.replace('_', '-'));
							if (element.parent().hasClass('input-group')) {
								element.parent().after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
							} else {
								element.after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
							}
						}
					}
					if (json['error']['recurring']) {
						$('select[name=\'recurring_id\']').after('<div class="text-danger">' + json['error']['recurring'] + '</div>');
					}
					$('.text-danger').parent().addClass('has-error');
				}
				if (json['success']) {
					var formated_special=$('.autocalc-product-special').html();
					if (typeof formated_special == 'undefined'){
						formated_special=$('.autocalc-product-price').html();
					}
					var formated_price=$('.autocalc-product-price').html();
					if (typeof formated_price == 'undefined'){
						formated_price=$('.autocalc-product-special').html();
					}
					$.magnificPopup.close();
					$.magnificPopup.open({
items: {
src: 'index.php?route=extension/module/aridiusfastorder/getForm&product_id='+$('input[name=product_id]').val()+'&formated_special='+formated_special+'&quantity='+$('input[name=quantity]').val()+'&formated_price='+formated_price+'&quantity='+$('input[name=quantity]').val()
						},
type: 'ajax',
removalDelay: 0,
mainClass: 'my-mfp-zoom-in'
					});
				}
$('#preloader').remove();				
			},
error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	});
});
// Aridiusinstock
$(document).on("click touchstart", "#instock-order-submit", function (e) {
	$('.mfp-content').append('<div class="loader"><div class="bag_quickview"></div></div>');
	var product_id = $(this).data('productId');
	var aridiusinstock_contact = $("input[name=aridiusinstock_contact]").val();
	var aridiusinstock_firstname = $("input[name=aridiusinstock_firstname]").val();
	var aridiusinstock_email = $("input[name=aridiusinstock_email]").val();
	$.ajax({
url: 'index.php?route=extension/module/aridiusinstock/write',
type: 'post',
dataType: 'json',
data: {product_id:product_id,aridiusinstock_contact:aridiusinstock_contact,aridiusinstock_firstname:aridiusinstock_firstname,aridiusinstock_email:aridiusinstock_email},
success: function (data) {
			if (data['error']) {
				$("div.loader").remove();
				$('.aridiusinstock .error').remove();
				if (data['error']['firstname']) {
					$('.aridiusinstock_errorfirstname').html('<span class="text-danger">'+data['error']['firstname']+'</span>').show();
				} else {
					$('.aridiusinstock_errorfirstname').hide().empty();
				}
				if (data['error']['contact']) {
					$('.aridiusinstock_errorcontact').html('<span class="text-danger">'+data['error']['contact']+'</span>').show();
				} else {
					$('.aridiusinstock_errorcontact').hide().empty();
				}
				if (data['error']['email']) {
					$('.aridiusinstock_erroremail').html('<span class="text-danger">'+data['error']['email']+'</span>').show();
				} else {
					$('.aridiusinstock_erroremail').hide().empty();
				}
			}
			if (data['success']) {
				setTimeout(function() {
					$("div.loader").remove();
					$.magnificPopup.close();
				}, 5500);
				$.magnificPopup.open({
items: {
src: 'index.php?route=extension/module/aridiusinstock/success'
					},
type: 'ajax'
				});
			}
		}
	});
});
var instock = {
	'add': function(product_id) {
		var $lg = $('.pswp');		
		if (typeof $lg.lightGallery == 'function') {
		var gallery = $lg.lightGallery();
		gallery.data('lightGallery').destroy(true);
		};
		$.ajax({
url: 'index.php?route=extension/module/aridiusinstock/validOrder',
type: 'post',
data: 'product_id=' + product_id,
dataType: 'json',
beforeSend: function(){
$('.overlay').html('<div id="preloader"><i class="fa fa-spinner fa-spin"></i></div>');
},
success: function(json) {
				$('.alert, .text-danger').remove();
				$('.form-group').removeClass('has-error');
				$.magnificPopup.close(); 
				$.magnificPopup.open({
items: {
src: 'index.php?route=extension/module/aridiusinstock/getForm&product_id='+ product_id
					},
type: 'ajax',
 removalDelay: 0,
 mainClass: 'my-mfp-zoom-in'
				});
$('#preloader').remove();				
			},
error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	'remove': function() {
	}
}
// Aridiusundersell
$(document).ready(function() {
$(document).on("click touchstart", "#undersell-order-submit", function (e) {
	    $('.mfp-content').append('<div class="loader"><div class="bag_quickview"></div></div>');
		$.ajax({
			url: 'index.php?route=extension/module/aridiusundersell/write',
			type: 'post',
			dataType: 'json',
			data: $('#product input[type=\'text\'], #product input[type=\'hidden\'], #product input[type=\'radio\']:checked, #product input[type=\'checkbox\']:checked, #product select, #product textarea,input[name=\'aridiusundersell_contact\'],input[name=\'aridiusundersell_firstname\'],input[name=\'aridiusundersell_email\'],textarea[name=\'aridiusundersell_comment\'],input[name=\'aridiusundersell_link\'],input[name=\'fo_total_price\']'),			
			success: function (data) {
				if (data['error']) {
					$("div.loader").remove();
					$('.aridiusundersell .error').remove();
					if (data['error']['firstname']) {
						$('.aridiusundersell_errorfirstname').html('<span class="text-danger">'+data['error']['firstname']+'</span>').show();
					} else {
                   $('.aridiusundersell_errorfirstname').hide().empty();
                           }
					if (data['error']['quantity']) {
						$('.aridiusundersell_errorquantity').html('<span class="text-danger">'+data['error']['quantity']+'</span>').show();
					} else {
                   $('.aridiusundersell_errorquantity').hide().empty();
                           }
					if (data['error']['contact']) {
						$('.aridiusundersell_errorcontact').html('<span class="text-danger">'+data['error']['contact']+'</span>').show();
					} else {
                   $('.aridiusundersell_errorcontact').hide().empty();
                           }
					if (data['error']['email']) {
						$('.aridiusundersell_erroremail').html('<span class="text-danger">'+data['error']['email']+'</span>').show();
					} else {
                   $('.aridiusundersell_erroremail').hide().empty();
                           }
					if (data['error']['link']) {
						$('.aridiusundersell_errorlink').html('<span class="text-danger">'+data['error']['link']+'</span>').show();
					} else {
                   $('.aridiusundersell_errorlink').hide().empty();
                           }
				}
				if (data['success']) {
					$("div.loader").remove();
					setTimeout(function() {		
					$.magnificPopup.close();
					}, 5500);	
					$.magnificPopup.open({
				  items: {
					src: 'index.php?route=extension/module/aridiusundersell/success'
				  },
				  type: 'ajax'
				});
				}
			}
		});
	});
$('#undersell-order').on('click', function() {

	$.ajax({
		url: 'index.php?route=extension/module/aridiusundersell/validOrder',
		type: 'post',
		data: $('#product input[type=\'text\'], #product input[type=\'hidden\'], #product input[type=\'radio\']:checked, #product input[type=\'checkbox\']:checked, #product select, #product textarea'),
		dataType: 'json',
		beforeSend: function() {
			$('.overlay').html('<div id="preloader"><i class="fa fa-spinner fa-spin"></i></div>');
		},
		complete: function() {
			$('#undersell-order').button('reset');
		},
		success: function(json) {
			$('.alert, .text-danger').remove();
			$('.form-group').removeClass('has-error');
				var formated_special=$('.autocalc-product-special').html();
				if (typeof formated_special == 'undefined'){
					formated_special=$('.autocalc-product-price').html();
				}
					var formated_price=$('.autocalc-product-price').html();
				if (typeof formated_price == 'undefined'){
					formated_price=$('.autocalc-product-special').html();
				}
				$.magnificPopup.open({
				  items: {
					src: 'index.php?route=extension/module/aridiusundersell/getForm&product_id='+$('input[name=product_id]').val()+'&formated_special='+formated_special+'&quantity='+$('input[name=quantity]').val()+'&formated_price='+formated_price+'&quantity='+$('input[name=quantity]').val()
				  },
				 type: 'ajax',
 removalDelay: 0,
 mainClass: 'my-mfp-zoom-in'
				});
	$('#preloader').remove();			
		},
        error: function(xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
	});
});
});
// jquery.maskedinput.js
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var ua = navigator.userAgent,
        iPhone = /iphone/i.test(ua),
        chrome = /chrome/i.test(ua),
        android = /android/i.test(ua),
        caretTimeoutId;
    $.mask = {
        //Predefined character definitions
        definitions: {
            '9': "[0-9]",
            'a': "[A-Za-z]",
            '*': "[A-Za-z0-9]"
        },
        autoclear: true,
        dataName: "rawMaskFn",
        placeholder: '_'
    };
    $.fn.extend({
        //Helper Function for Caret positioning
        caret: function(begin, end) {
            var range;
            if (this.length === 0 || this.is(":hidden") || this.get(0) !== document.activeElement) {
                return;
            }
            if (typeof begin == 'number') {
                end = (typeof end === 'number') ? end : begin;
                return this.each(function() {
                    if (this.setSelectionRange) {
                        this.setSelectionRange(begin, end);
                    } else if (this.createTextRange) {
                        range = this.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', end);
                        range.moveStart('character', begin);
                        range.select();
                    }
                });
            } else {
                if (this[0].setSelectionRange) {
                    begin = this[0].selectionStart;
                    end = this[0].selectionEnd;
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                    begin = 0 - range.duplicate().moveStart('character', -100000);
                    end = begin + range.text.length;
                }
                return { begin: begin, end: end };
            }
        },
        unmask: function() {
            return this.trigger("unmask");
        },
        mask: function(mask, settings) {
            var input,
                defs,
                tests,
                partialPosition,
                firstNonMaskPos,
                lastRequiredNonMaskPos,
                len,
                oldVal;
            if (!mask && this.length > 0) {
                input = $(this[0]);
                var fn = input.data($.mask.dataName)
                return fn?fn():undefined;
            }
            settings = $.extend({
                autoclear: $.mask.autoclear,
                placeholder: $.mask.placeholder, // Load default placeholder
                completed: null
            }, settings);
            defs = $.mask.definitions;
            tests = [];
            partialPosition = len = mask.length;
            firstNonMaskPos = null;
            mask = String(mask);
            $.each(mask.split(""), function(i, c) {
                if (c == '?') {
                    len--;
                    partialPosition = i;
                } else if (defs[c]) {
                    tests.push(new RegExp(defs[c]));
                    if (firstNonMaskPos === null) {
                        firstNonMaskPos = tests.length - 1;
                    }
                    if(i < partialPosition){
                        lastRequiredNonMaskPos = tests.length - 1;
                    }
                } else {
                    tests.push(null);
                }
            });
            return this.trigger("unmask").each(function() {
                var input = $(this),
                    buffer = $.map(
                        mask.split(""),
                        function(c, i) {
                            if (c != '?') {
                                return defs[c] ? getPlaceholder(i) : c;
                            }
                        }),
                    defaultBuffer = buffer.join(''),
                    focusText = input.val();
                function tryFireCompleted(){
                    if (!settings.completed) {
                        return;
                    }
                    for (var i = firstNonMaskPos; i <= lastRequiredNonMaskPos; i++) {
                        if (tests[i] && buffer[i] === getPlaceholder(i)) {
                            return;
                        }
                    }
                    settings.completed.call(input);
                }
                function getPlaceholder(i){
                    if(i < settings.placeholder.length)
                        return settings.placeholder.charAt(i);
                    return settings.placeholder.charAt(0);
                }
                function seekNext(pos) {
                    while (++pos < len && !tests[pos]);
                    return pos;
                }
                function seekPrev(pos) {
                    while (--pos >= 0 && !tests[pos]);
                    return pos;
                }
                function shiftL(begin,end) {
                    var i,
                        j;
                    if (begin<0) {
                        return;
                    }
                    for (i = begin, j = seekNext(end); i < len; i++) {
                        if (tests[i]) {
                            if (j < len && tests[i].test(buffer[j])) {
                                buffer[i] = buffer[j];
                                buffer[j] = getPlaceholder(j);
                            } else {
                                break;
                            }
                            j = seekNext(j);
                        }
                    }
                    writeBuffer();
                    input.caret(Math.max(firstNonMaskPos, begin));
                }
                function shiftR(pos) {
                    var i,
                        c,
                        j,
                        t;
                    for (i = pos, c = getPlaceholder(pos); i < len; i++) {
                        if (tests[i]) {
                            j = seekNext(i);
                            t = buffer[i];
                            buffer[i] = c;
                            if (j < len && tests[j].test(t)) {
                                c = t;
                            } else {
                                break;
                            }
                        }
                    }
                }
                function androidInputEvent(e) {
                    var curVal = input.val();
                    var pos = input.caret();
                    var proxy = function () {
                            $.proxy($.fn.caret, input, pos.begin, pos.begin)();
                        };
                    if (oldVal && oldVal.length && oldVal.length > curVal.length ) {
                        // a deletion or backspace happened
                        var nextPos = checkVal(true);
                        var curPos = pos.end;
                        while (curPos > 0 && !tests[curPos-1]) {
                            curPos--;
                        }
                        if (curPos === 0) {
                            curPos = nextPos;
                        }
                        pos.begin = curPos;
                        setTimeout(function() {
                            proxy();
                            tryFireCompleted();
                        }, 0);
                    } else {
                        pos.begin = checkVal(true);
                        setTimeout(function() {
                            proxy();
                            tryFireCompleted();
                        }, 0);
                    }               
                }
                function blurEvent(e) {
                    checkVal();
                    if (input.val() != focusText)
                        input.change();
                }
                function keydownEvent(e) {
                    if (input.prop("readonly")){
                        return;
                    }
                    var k = e.which || e.keyCode,
                        pos,
                        begin,
                        end;
                        oldVal = input.val();
                    //backspace, delete, and escape get special treatment
                    if (k === 8 || k === 46 || (iPhone && k === 127)) {
                        pos = input.caret();
                        begin = pos.begin;
                        end = pos.end;
                        if (end - begin === 0) {
                            begin=k!==46?seekPrev(begin):(end=seekNext(begin-1));
                            end=k===46?seekNext(end):end;
                        }
                        clearBuffer(begin, end);
                        shiftL(begin, end - 1);
                        e.preventDefault();
                    } else if( k === 13 ) { // enter
                        blurEvent.call(this, e);
                    } else if (k === 27) { // escape
                        input.val(focusText);
                        input.caret(0, checkVal());
                        e.preventDefault();
                    }
                }
                function keypressEvent(e) {
                    if (input.prop("readonly")){
                        return;
                    }
                    var k = e.which || e.keyCode,
                        pos = input.caret(),
                        p,
                        c,
                        next;
                    if (e.ctrlKey || e.altKey || e.metaKey || k < 32) {//Ignore
                        return;
                    } else if ( k && k !== 13 ) {
                        if (pos.end - pos.begin !== 0){
                            clearBuffer(pos.begin, pos.end);
                            shiftL(pos.begin, pos.end-1);
                        }
                        p = seekNext(pos.begin - 1);
                        if (p < len) {
                            c = String.fromCharCode(k);
                            if (tests[p].test(c)) {
                                shiftR(p);
                                buffer[p] = c;
                                writeBuffer();
                                next = seekNext(p);
                                if(android){
                                    //Path for CSP Violation on FireFox OS 1.1
                                    var proxy = function() {
                                        $.proxy($.fn.caret,input,next)();
                                    };
                                    setTimeout(proxy,0);
                                }else{
                                    input.caret(next);
                                }
                                if(pos.begin <= lastRequiredNonMaskPos){
                                     tryFireCompleted();
                                 }
                            }
                        }
                        e.preventDefault();
                    }
                }
                function clearBuffer(start, end) {
                    var i;
                    for (i = start; i < end && i < len; i++) {
                        if (tests[i]) {
                            buffer[i] = getPlaceholder(i);
                        }
                    }
                }
                function writeBuffer() { input.val(buffer.join('')); }
                function checkVal(allow) {
                    //try to place characters where they belong
                    var test = input.val(),
                        lastMatch = -1,
                        i,
                        c,
                        pos;
                    for (i = 0, pos = 0; i < len; i++) {
                        if (tests[i]) {
                            buffer[i] = getPlaceholder(i);
                            while (pos++ < test.length) {
                                c = test.charAt(pos - 1);
                                if (tests[i].test(c)) {
                                    buffer[i] = c;
                                    lastMatch = i;
                                    break;
                                }
                            }
                            if (pos > test.length) {
                                clearBuffer(i + 1, len);
                                break;
                            }
                        } else {
                            if (buffer[i] === test.charAt(pos)) {
                                pos++;
                            }
                            if( i < partialPosition){
                                lastMatch = i;
                            }
                        }
                    }
                    if (allow) {
                        writeBuffer();
                    } else if (lastMatch + 1 < partialPosition) {
                        if (settings.autoclear || buffer.join('') === defaultBuffer) {
                            // Invalid value. Remove it and replace it with the
                            // mask, which is the default behavior.
                            if(input.val()) input.val("");
                            clearBuffer(0, len);
                        } else {
                            // Invalid value, but we opt to show the value to the
                            // user and allow them to correct their mistake.
                            writeBuffer();
                        }
                    } else {
                        writeBuffer();
                        input.val(input.val().substring(0, lastMatch + 1));
                    }
                    return (partialPosition ? i : firstNonMaskPos);
                }
                input.data($.mask.dataName,function(){
                    return $.map(buffer, function(c, i) {
                        return tests[i]&&c!=getPlaceholder(i) ? c : null;
                    }).join('');
                });
                input
                    .one("unmask", function() {
                        input
                            .off(".mask")
                            .removeData($.mask.dataName);
                    })
                    .on("focus.mask", function() {
                        if (input.prop("readonly")){
                            return;
                        }
                        clearTimeout(caretTimeoutId);
                        var pos;
                        focusText = input.val();
                        pos = checkVal();
                        caretTimeoutId = setTimeout(function(){
                            if(input.get(0) !== document.activeElement){
                                return;
                            }
                            writeBuffer();
                            if (pos == mask.replace("?","").length) {
                                input.caret(0, pos);
                            } else {
                                input.caret(pos);
                            }
                        }, 10);
                    })
                    .on("blur.mask", blurEvent)
                    .on("keydown.mask", keydownEvent)
                    .on("keypress.mask", keypressEvent)
                    .on("input.mask paste.mask", function() {
                        if (input.prop("readonly")){
                            return;
                        }
                        setTimeout(function() {
                            var pos=checkVal(true);
                            input.caret(pos);
                            tryFireCompleted();
                        }, 0);
                    });
                    if (chrome && android)
                    {
                        input
                            .off('input.mask')
                            .on('input.mask', androidInputEvent);
                    }
                    checkVal(); //Perform initial check for existing values
            });
        }
    });
}));