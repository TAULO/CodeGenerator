$(document).ready(function(){
     $('#addInstalment').on('click' , function(){
         
    var installmentCount = $('.instalment').size();
        if(parseInt(installmentCount) == 0){
             installmentCount = installmentCount + 1;
        }
    if(installmentCount >= 4){
                    $.Zebra_Dialog('<strong>Maximum payment rows</strong>, you have reached a maximum permissible number of payment instalments. Only four(4) numbers instalments are allowed.', {
                        'type':     'information',
                        'title':    'Payment Installment row'
                    });         
    }else{
            $.ajax({
            url: '/services/new-instalment/',
            type: 'GET',
            cache:false,
            data: {'rowCount':installmentCount},
            beforeSend: function (request){
                $('#installment-loading-status').slideDown().html('<div class="loading"><span class="text-info"><i class="fa fa-spinner fa-spin"></i> Loading...</span></div>');               
            },

            success: function(data,status,xhr) {

                    $('#dynamic-form-wrapper').append(data);
                    $("select.selectric").selectric();
                    $('.datepicker').daterangepicker({
                                                                            singleDatePicker: true,
                                                                            format: 'DD/MM/YYYY'});                    
             
            },
            complete:function(){ 
                $('.loading-status').html('');                
            },
            error: function(data,status,xhr) {
            alert("fail: " + xhr.toString() );
            //console.log(data );
            }
            });        
    }         
     });

/**
 * Request Option
 */    
     $('#add-request').on('click' , function(){
         
    var requestCount = $('.request').size();
         if(parseInt(requestCount) == 0){
             requestCount =  1;
         }else{
            requestCount = requestCount + 1; 
         }    
    if(requestCount >= 11){
                    $.Zebra_Dialog('<strong>Maximum request rows</strong>, you have reached a maximum permissible number of requests . Only twelve(12) request types are allowed.', {
                        'type':     'information',
                        'title':    'Payment row'
                    });         
    }else{
            $.ajax({
            url: '/services/new-request/',
            type: 'GET',
            cache:false,
            data: {'rowCount':requestCount},
            beforeSend: function (request){
                $('#request-loading-status').slideDown().html('<div class="loading text-info"><span class="text-info"><i class="fa fa-spinner fa-spin"></i> Loading...</span></div>');               
            },

            success: function(data,status,xhr) {
                    $('#dynamic-contents-request').append(data);
                    $("select.selectric").selectric();
                    $('.datepicker').daterangepicker({
                                                                            singleDatePicker: true,
                                                                            format: 'DD/MM/YYYY'});
             
            },
            complete:function(){ 
                $('.loading-status').html('');                
            },
            error: function(data,status,xhr) {
            alert("fail: " + xhr.toString() );
            //console.log(data );
            }
            });        
    }         
     });
/**
 * Adding Project extension 
 */
     $('#add-extension').on('click' , function(){
         var extensionCount = $('.extension').size();
         if(parseInt(extensionCount) == 0){
             extensionCount = extensionCount + 1;
         }
         if(extensionCount >= 2){
                    $.Zebra_Dialog('<strong>You have reached a maximum permissible number of assignment extensions. Only two(2) numbers extensions are allowed.', {
                        'type':     'information',
                        'title':    'Assignment Extension Row'
                    });
                    
                    return false;
         }else{
            $.ajax({
            url: '/services/new-extension/',
            type: 'GET',
            cache:false,
            data: {'rowCount':extensionCount},
            beforeSend: function (request){
                $('#extension-loading-status').slideDown().html('<div class="loading"><span class="text-info"><i class="fa fa-spinner fa-spin"></i> Loading...</span></div>');               
            },

            success: function(data,status,xhr) {

                    $('#extension-container').append(data);
                    
                        $('button[class=btn_remove]').click(function(){
                                $(this).parent('.extension').remove();
                        });
                    $('.datepicker').daterangepicker({
                                                                            singleDatePicker: true,
                                                                            format: 'DD/MM/YYYY'});              
            },
            complete:function(){ 
                $('.loading-status').html('');                
            },
            error: function(data,status,xhr) {
            alert("fail: " + xhr.toString() );
            //console.log(data );
            }
            });             
         }
        
     });
/**
 * Adding Contact Row 
 */
     $('#add-contact').on('click' , function(){
         var count = $('.contact').size();
         if(parseInt(count) == 0){
             count = count + 1;
         }
         if(count >= 3){
                    $.Zebra_Dialog('<strong>You have reached a maximum permissible number of contacts per  organization/company. Only a maximum of three(3) contacts is allowed.', {
                        'type':     'information',
                        'title':    'Contact Details'
                    });
                    
                    return false;
         }else{
            $.ajax({
            url: '/services/new-contact/',
            type: 'GET',
            cache:false,
            data: {'rowCount':count},
            beforeSend: function (request){
                $('#contact-loading-status').slideDown().html('<div class="loading"><span class="text-info"><i class="fa fa-spinner fa-spin"></i> Loading...</span></div>');               
            },

            success: function(data,status,xhr) {

                    $('#dynamic-contents-contact').append(data);
                    $("select.selectric").selectric();        
            },
            complete:function(){ 
                $('.loading-status').html('');                
            },
            error: function(data,status,xhr) {
            alert("fail: " + xhr.toString() );
            //console.log(data );
            }
            });             
         }
        
     });     
/**
 * Adding Employment Data 
 */
     $('#add-employment').on('click' , function(){
         var extensionCount = $('.extension').size();
         if(parseInt(extensionCount) == 0){
             extensionCount = extensionCount + 1;
         }
            $.ajax({
            url: '/services/new-employment-data/',
            type: 'GET',
            cache:false,
            data: {'rowCount':extensionCount},
            beforeSend: function (request){
                $('#employment-creation-loading-status').slideDown().html('<div class="loading"><span class="text-info"><i class="fa fa-spinner fa-spin"></i> Loading...</span></div>');               
            },

            success: function(data,status,xhr) {

                    $('#employment-creation-container').append(data);
                    
                        $('button[class=btn_remove]').click(function(){
                                $(this).parent('.extension').remove();
                        });
                    $('.datepicker').daterangepicker({
                                                                            singleDatePicker: true,
                                                                            format: 'DD/MM/YYYY'});              
            },
            complete:function(){ 
                $('.loading-status').html('');                
            },
            error: function(data,status,xhr) {
            alert("fail: " + xhr.toString() );
            //console.log(data );
            }
            });             

     });
     
        //trigger modal close
        $('#btn-cancel').on('click' , function(){
            $('#modal-extension').modal('close');
        });      
        
    $('#period-element').on('change' , 'select[id=period]' , function(){
        var period = $(this).val();
         
        $('input[id=code]').val('BSB' + period.replace('-' , '')).css('font-weight' , 'bold');
        //code
    });

    $(".messages").on('click' ,'span[id=close] i' , function() {
                $(".messages").animate(
                        {"opacity": "0"},{
                         "complete":function(){
                             $(this).remove();
                         }
                        }
                        );
            });  

     
});

var BsspEmployment = {
    init : function(){},
    remove: function(id){
                $.Zebra_Dialog('Are you sure you want to delete this Employment Data ?', {
                    'type':     'warning',
                    'title':    'Remove Employment Data.',
                    'buttons':  [
                                    {caption: 'Yes', callback: function() {
                                            $('#employment-data_' + id).animate({ backgroundColor: "#C00" }, "fast").animate({ opacity: "hide" }, "slow").remove();                                
                                        }},
                                    {caption: 'No', callback: function() { return true;}}
                                ]
                });           
            }
};
var BsspExtension = {
    init : function(){},
    remove: function(id){
                $.Zebra_Dialog('Are you sure you want to delete this Assignment Extension Row ?', {
                    'type':     'warning',
                    'title':    'Remove Assignment Extension',
                    'buttons':  [
                                    {caption: 'Yes', callback: function() {
                                            $('#extension_' + id).animate({ backgroundColor: "#C00" }, "fast").animate({ opacity: "hide" }, "slow").remove();                                
                                        }},
                                    {caption: 'No', callback: function() { return true;}}
                                ]
                });           
            }
};

var BsspRequest = {
    init:function(){},
    otherType: function(elementId , value){
            var idData = elementId.split('-');
            $element = $('#other-request-type-' + idData[2]);
        if('Other' === String(value)){
            $element.removeAttr('readonly');
        }else{
            $element.attr('readonly' , 'readonly');
        }
    },
    removeExistingResquest: function(requestId , requestNumber){
                    var requestCount = $('.request').size();
                    if(requestCount == 1){
                                $.Zebra_Dialog('<strong>All BSSP Applications must have atleast one request.', {
                                    'type':     'information',
                                    'title':    'Cannot Delete Request'
                                });

                                return false;
                     }else{
                    $.Zebra_Dialog('Are you sure you want to delete the Request Data with the request number <b>' + requestNumber + '</b>? <br/> Please note , the record will be permanently removed from the BSSP System.', {
                                    'type':     'warning',
                                    'title':    'Remove Request Data.',
                                    'buttons':  [
                                                    {caption: 'Yes', callback: function() {

                                                            /**
                                                             * AJAX - Removing an existing request row
                                                             */
                                                                $.ajax({
                                                                url: '/services/remove-request/',
                                                                type: 'POST',
                                                                cache:false,
                                                                data: {'requestId':requestId},
                                                                beforeSend: function (request){
                                                                    $('#remove_' + requestId).html('<i class="fa fa-spinner fa-spin"></i> Removing...').addClass('text-danger');                
                                                                },

                                                                success: function(data,status,xhr) {
                                                                        $('#request_' + requestId).slideUp('slow').remove();           
                                                                },
                                                                complete:function(){ 
                                                                    $('.loading-status').html('');
                                                                    $('#requests-notices').html('<p class="messages info status-approved">Request with request number <b>'+ requestNumber +'</b> has been removed successfully.</p>');
                                                                    bsspUtil.authideNotices();
                                                                },
                                                                error: function(data,status,xhr) {
                                                                alert("fail: " + xhr.toString() );
                                                                //console.log(data );
                                                                }
                                                                });                                                              
                                                        }},
                                                    {caption: 'No', callback: function() { return true;}}
                                                ]
                });                          
                     }        
    }
};
var bssp = {
    removeRow: function(rowId){        
        $.Zebra_Dialog('Are you sure you want to delete this application request?', {
            'type':     'warning',
            'title':    'Remove Application Request',
            'buttons':  [
                            {caption: 'Yes', callback: function() {
                                var idData = rowId.split('_');
                                    $('#request_' + idData[1]).animate({ backgroundColor: "#C00" }, "fast").animate({ opacity: "hide" }, "slow").remove();                                
                                }},
                            {caption: 'No', callback: function() { return true;}}
                        ]
        });        
    } ,
    removeInstallment: function(rowId){        
        $.Zebra_Dialog('Are you sure you want to delete this Installment?', {
            'type':     'warning',
            'title':    'Remove Installment',
            'buttons':  [
                            {caption: 'Yes', callback: function() {
                                var idData = rowId.split('_');
                                    $('#installment_' + idData[1]).animate({ backgroundColor: "#C00" }, "fast").animate({ opacity: "hide" }, "slow").remove();                                
                                }},
                            {caption: 'No', callback: function() { return true;}}
                        ]
        });        
    } ,     
    removeContact: function(rowNum){        
        $.Zebra_Dialog('Are you sure you want to delete this contact details?', {
            'type':     'warning',
            'title':    'Remove Contact Details',
            'buttons':  [
                            {caption: 'Yes', callback: function() {
                                    $('#contact_' + rowNum).animate({ backgroundColor: "#C00" }, "fast").animate({ opacity: "hide" }, "slow").remove();                                
                                }},
                            {caption: 'No', callback: function() { return true;}}
                        ]
        });        
    } ,
    removeExistingContact:function(contactId){
                    var requestCount = $('.contact').size();
                    if(requestCount == 1){
                                $.Zebra_Dialog('<strong>A company must have atleast one contact.', {
                                    'type':     'information',
                                    'title':    'Cannot Delete Contact'
                                });

                                return false;
                     }else{
                    $.Zebra_Dialog('Are you sure you want to delete the selected contact? <br/> Please note , the record will be permanently removed from the BSSP System.', {
                                    'type':     'warning',
                                    'title':    'Remove Contact Data.',
                                    'buttons':  [
                                                    {caption: 'Yes', callback: function() {

                                                            /**
                                                             * AJAX - Removing an existing request row
                                                             */
                                                                $.ajax({
                                                                url: '/services/remove-contact/',
                                                                type: 'POST',
                                                                cache:false,
                                                                data: {'contactId':contactId},
                                                                beforeSend: function (request){
                                                                    $('#remove_contact_' + contactId).html('<i class="fa fa-spinner fa-spin"></i> Removing...').addClass('text-danger');                
                                                                },

                                                                success: function(data,status,xhr) {
                                                                        $('#contact_' + contactId).slideUp('slow').remove();           
                                                                },
                                                                complete:function(){ 
                                                                    $('.loading-status').html('');
                                                                    $('#contact-notices').html('<p class="messages info status-approved">A contact with contact number <b>'+ contactId +'</b> has been removed successfully.</p>');
                                                                    bsspUtil.authideNotices();
                                                                },
                                                                error: function(data,status,xhr) {
                                                                alert("fail: " + xhr.toString() );
                                                                //console.log(data );
                                                                }
                                                                });                                                              
                                                        }},
                                                    {caption: 'No', callback: function() { return true;}}
                                                ]
                });                          
                     }        
    },
    createBudgetCode: function(){
       
    },
    removeApplication: function(applicationNumber){
        $.Zebra_Dialog('Are you sure you want to delete this application ?', {
            'type':     'warning',
            'title':    'Remove Application - ' + applicationNumber,
            'buttons':  [
                            {caption: 'Yes', callback: function() {
                                return true;                              
                                }},
                            {caption: 'No', callback: function() { return true;}}
                        ]
        });          
    },
    removeApplicationRequest: function(requestNumber){
        $.Zebra_Dialog('Are you sure you want to delete this application`s request?', {
            'type':     'warning',
            'title':    'Remove Application`s Request - ' + requestNumber,
            'buttons':  [
                            {caption: 'Yes', callback: function() {
                               
                                }},
                            {caption: 'No', callback: function() { return true;}}
                        ]
        });          
    }
};