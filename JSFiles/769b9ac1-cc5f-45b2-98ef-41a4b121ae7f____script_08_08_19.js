$(document).ready(function(){

var nav_offset_top = $('#mainNav').height() + 20; 
    function navbarFixed(){
        if ( $('.header_area').length ){ 
            $(window).scroll(function() {
                var scroll = $(window).scrollTop();   
                if (scroll >= nav_offset_top ) {
                    $(".header_area").addClass("navbar_fixed");
                } else {
                    $(".header_area").removeClass("navbar_fixed");
                }
            });
        };
    };

        navbarFixed();


    $('#user_citizen_id').click(function(){
        if($(this).prop("checked") == true){
          $("#user_citizen_id_text").text("I am an Indian citizen");
            $(this).parent().parent().addClass("jss878 jss877");
        }
        else if($(this).prop("checked") == false){
            $("#user_citizen_id_text").text("I am not an Indian citizen");
          $(this).parent().parent().removeClass("jss878 jss877");
        }
    });


    $('#contact_details_private').click(function(){
        if($(this).prop("checked") == true){
          $("#contact_details_private_text").text("I trust the Campaigner and my contact details can be shared with them.");
            $(this).parent().parent().addClass("jss878 jss877");
        }
        else if($(this).prop("checked") == false){
            $("#contact_details_private_text").text("Keep me updated but keep my contact details private.");
          $(this).parent().parent().removeClass("jss878 jss877");
        }
    });

    
    // Validation Starts Here

    $("#reg_name").keyup(function(){
        if($(this).val().trim() != ""){
            $(this).parent().parent().find(".error").text("");
        }
        else {
            $(this).parent().parent().find(".error").text("Please enter a correct name");
        }
    });

    $("#reg_email").keyup(function(){
        if($(this).val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null || $(this).val().trim() == "" ){
            $(this).parent().parent().find(".error").text("Please enter a correct Email Id and remove any spaces");
        }
        else{
            $(this).parent().parent().find(".error").text("");
        }
    });   
    

    $("#forget_email").keyup(function(){
        if($(this).val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null){
            $(this).parent().parent().find(".error").text("Please enter a correct Email Id and remove any spaces");
        }
        else{
            $(this).parent().parent().find(".error").text("");
        }
    });    


    $("#log_email").keyup(function(){
        if($(this).val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null){
            $(this).parent().parent().find(".error").text("Please enter a correct Email Id and remove any spaces");
        }
        else{
            $(this).parent().parent().find(".error").text("");
        }
    });   

    $("#reg_pass").keyup(function(){
        if($(this).val().trim() == "" || $(this).val().length < 8){
            $(this).parent().parent().find(".error").text("Should be equal to or more than 8 characters");
        }
        else {
            $(this).parent().parent().find(".error").text("");
        }
    });

    $("#log_pass").keyup(function(){
        if($(this).val().trim() == "" || $(this).val().length < 8){
            $(this).parent().parent().parent().find(".error").text("Should be equal to or more than 8 characters");
        }
        else {
            $(this).parent().parent().parent().find(".error").text("");
        }
    });


    $("#mobile-number").keyup(function(){
        if($(this).val().trim() == ""){
            $(this).parent().parent().parent().find(".error").text("Please enter a correct Mobile No");
        }
        else {
            $(this).parent().parent().parent().find(".error").text("");
        }
    });

    $("#mobile-number").keypress(function(evt){       
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)){
            return false;
        }
    });

    
    $(".integer_value").keypress(function(evt){       
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)){
            return false;
        }
    });

    $('#termsCheck_box').change(function(){
        if ($('#termsCheck_box').prop("checked")) {
            $(this).parent().parent().addClass('jss883 jss896');
            $('#termsCheck_box').parent().find('.svg_hide').show();           
            $('#termsCheck_box').parent().find('.svg_show').hide();
            $('.terms_error').toast('hide');
        }
        else{
            $(this).parent().parent().removeClass('jss883 jss896');
            $('#termsCheck_box').parent().find('.svg_hide').hide();
            $('#termsCheck_box').parent().find('.svg_show').show(); 
            $('.terms_error').toast('show');
        }
    });


    

    $('#donation_anonymous_checkbox').change(function(){
        if ($('#donation_anonymous_checkbox').prop("checked")) {
            $(this).parent().parent().addClass('jss883 jss896');
            $('#donation_anonymous_checkbox').parent().find('.svg_hide').show();           
            $('#donation_anonymous_checkbox').parent().find('.svg_show').hide();
        }
        else{
            $(this).parent().parent().removeClass('jss883 jss896');
            $('#donation_anonymous_checkbox').parent().find('.svg_hide').hide();           
            $('#donation_anonymous_checkbox').parent().find('.svg_show').show();
        }
    });

    $('#citizen_voluntary').change(function(){
        if ($('#citizen_voluntary').prop("checked")) {
            $(this).parent().parent().addClass('jss883 jss896');
            $('#citizen_voluntary').parent().find('.svg_hide').show();           
            $('#citizen_voluntary').parent().find('.svg_show').hide();
        }
        else{
            $(this).parent().parent().removeClass('jss883 jss896');
            $('#citizen_voluntary').parent().find('.svg_hide').hide();
            $('#citizen_voluntary').parent().find('.svg_show').show(); 
        }
    });

    $('#hide_my_name').change(function(){
        if ($('#hide_my_name').prop("checked")) {
            $(this).parent().parent().addClass('jss883 jss896');
            $('#hide_my_name').parent().find('.svg_hide').show();           
            $('#hide_my_name').parent().find('.svg_show').hide();
        }
        else{
            $(this).parent().parent().removeClass('jss883 jss896');
            $('#hide_my_name').parent().find('.svg_hide').hide();
            $('#hide_my_name').parent().find('.svg_show').show(); 
        }
    });

   

    

    // Register Script validation
    regg_name=reg_email=reg_pass=reg_number=log_email=log_pass=trem_check=new_pass=con_pass=reg_number_mbl_num=0;

    country_code_num = $('.country_code_here').text();
    mbl_num =  $("#mobile-number").val() 
    n = mbl_num.startsWith(country_code_num);
    function mbl_val(){
        if(n === false){
            $("#mobile-number").parent().parent().parent().find(".error").text("Please enter a correct Mobile No");  
                reg_number_mbl_num = 1 ;
                return false;
        }
        else{     
            $("#mobile-number").parent().parent().parent().find(".error").text("");  
            reg_number_mbl_num = 0 ;
        }
    }
    // mbl_val();

    $("#register_btn").click(function(){

        if($("#reg_name").val().trim() != ""){
            $("#reg_name").parent().parent().find(".error").text("");
            regg_name = 0;
        }
        else {
            $("#reg_name").parent().parent().find(".error").text("Please enter a correct name");
            regg_name = 1;
        }

        if($("#reg_email").val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null || $("#reg_email").val().trim() == ""){
            $("#reg_email").parent().parent().find(".error").text("Please enter a correct Email Id and remove any spaces");
            reg_email = 1;
        }
        else{
            $("#reg_email").parent().parent().find(".error").text("");
            reg_email = 0;
        }

        if($("#reg_pass").val().trim() == "" || $("#reg_pass").val().length < 8){
            $("#reg_pass").parent().parent().find(".error").text("Should be equal to or more than 8 characters");
            reg_pass = 1 ;
        }
        else {
            $("#reg_pass").parent().parent().find(".error").text("");
            reg_pass = 0 ;
        }
         

        if($("#mobile-number").val().length < 7 ){
            $("#mobile-number").parent().parent().parent().find(".error").text("Please enter a correct Mobile No");       
            reg_number = 1 ;   
        }
        else if($("#mobile-number").val().startsWith($('.country_code_here').text()) === false){
            $("#mobile-number").parent().parent().parent().find(".error").text("Please enter a Country Code to Mobile No");       
            reg_number = 1 ;    
            }
        else {
            $("#mobile-number").parent().parent().parent().find(".error").text("");
            reg_number = 0 ;
        }


        if ($('#termsCheck_box').prop("checked")) {
            // checked
            $('.terms_error').toast('hide');
            // return;
            trem_check = 0
        }
        else{
            // alert("not checked");
            $('.terms_error').toast('show');
            trem_check = 1
        }

        if(reg_number == 1 || reg_email == 1 || reg_pass == 1 || regg_name == 1 || trem_check == 1 ){
            return false
        }

    });

    $("#login_btn").click(function(){
        
        if($("#log_email").val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null || $("#log_email").val().trim() == ""){
            $("#log_email").parent().parent().find(".error").text("Please enter a correct Email Id and remove any spaces");
            log_email = 1
        }
        else {
            $("#log_email").parent().parent().find(".error").text("");
            log_email = 0
        }

        if($("#log_pass").val().trim() == "" || $("#log_pass").val().length < 8){
            
            $("#log_pass").parent().parent().parent().find(".error").text("Should be equal to or more than 8 characters");
            log_pass = 1
        }
        else {
            $("#log_pass").parent().parent().parent().find(".error").text("");
            log_pass = 0
        }

        if(log_email == 1 || log_pass == 1 ){
            return false
        }

    });

    $("#forget_btn").click(function(){
        if($("#forget_email").val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null || $("#forget_email").val().trim() == ""){
            $("#forget_email").parent().parent().find(".error").text("Please enter a correct Email Id and remove any spaces");
            return false;
        }
        else {
            $("#forget_email").parent().parent().find(".error").text("");
        }

    });


    $("#new_pass").keyup(function(){
        if($(this).val().trim() == "" || $(this).val().length < 8){
            $(this).parent().parent().parent().find(".error").text("Should be equal to or more than 8 characters");
            new_pass = 1 ;
        }
        else {
            $(this).parent().parent().parent().find(".error").text("");
            new_pass = 0 ;
        }
    });

    var old_pass = 0;

    $("#old_pass").keyup(function(){
        if($(this).val().trim() == "" || $(this).val().length < 8){
            $(this).parent().parent().parent().find(".error").text("Should be equal to or more than 8 characters");
            old_pass = 1 ;
        }
        else {
            $(this).parent().parent().parent().find(".error").text("");
            old_pass = 0 ;
        }
    });

    $("#con_pass").keyup(function(){
        if($(this).val().trim() == ""){
            $(this).parent().parent().parent().find(".error").text("Should be equal to or more than 8 characters");
            con_pass = 1 ;
        }
        else {
            if($("#con_pass").val() != $("#new_pass").val()){
                $("#con_pass").parent().parent().parent().find(".error").text("Repeat Password must match with new password");
                con_pass = 1 ;
            }
            else{
                $(this).parent().parent().parent().find(".error").text("");
                con_pass = 0 ;
            }
        }
    });

    $("#new_pass_btn").click(function(){
        if( new_pass == 0  && con_pass == 0) {
            if($("#con_pass").val() != $("#new_pass").val()){
                $("#con_pass").parent().parent().parent().find(".error").text("Repeat Password must match with new password");
                return false;
            }
        }
        else if( new_pass == 0  && con_pass == 1) {
            return false;
        }
    });

    $("#change_pass_btn").click(function(){
        if( new_pass == 0  && con_pass == 0 && old_pass == 0) {
            if($("#con_pass").val() != $("#new_pass").val()){
                $("#con_pass").parent().parent().parent().find(".error").text("Repeat Password must match with new password");
                return false;
            }
        }
        else if( new_pass == 0  && con_pass == 1) {
            return false;
        }
    });


    if ($("#citizen_voluntary").is(':checked')){
        $('#citizen_voluntary').parent().parent().addClass('jss883 jss896');
        $('#citizen_voluntary').find('.svg_hide').show();           
        $('#citizen_voluntary').find('.svg_show').hide();
    }

    if ($("#donation_anonymous_checkbox").is(':checked')){
        $('#donation_anonymous_checkbox').parent().parent().addClass('jss883 jss896');
        $('#citizen_voluntary').parent().find('.svg_hide').show();           
        $('#citizen_voluntary').parent().find('.svg_show').hide();
    }

    if ($("#termsCheck_box").is(':checked')){
        $('#termsCheck_box').parent().parent().addClass('jss883 jss896');
        $('#termsCheck_box').parent().find('.svg_hide').show();           
        $('#termsCheck_box').parent().find('.svg_show').hide();
            $('.terms_error').toast('hide');
    }

});




var _validFileExtensions_img = [".jpeg", ".jpg",".png"];    
             
function Validateimgupload(oInputimg) {

    if (oInputimg.type == "file") {
                
        var sFileName = oInputimg.value;
        
        if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validFileExtensions_img.length; j++) {
                var sCurExtension = _validFileExtensions_img[j];
                if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    if (blnValid) {
                      var fsize = $('#id_picture')[0].files[0].size;
                        if (oInputimg.files && oInputimg.files[0]) {
                      var reader = new FileReader();

                        reader.readAsDataURL(oInputimg.files[0]);
                        reader.onload = function (e) {
                            //Initiate the JavaScript Image object.
                            var image = new Image();
             
                            //Set the Base64 string return from FileReader as source.
                            image.src = e.target.result;
                                   
                            $("#img_val").text("");
                            $("#id_picture_error").text("");
                            
                    }
                }
            }
                    break;
                }
            }
            if (!blnValid) {

             $("#img_val").text("Allowed file format : (.png/jpg/jpeg)");
             $("#id_picture_error").text("Allowed file format : (.png/jpg/jpeg)");
                
                oInputimg.value = "";
                return false;
            }
        }
        
         if (blnValid) {

            var fsize = $('#id_picture')[0].files[0].size;
           
            if (oInputimg.files && oInputimg.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#blah')
                        .attr('src', e.target.result);                                    
                };

                reader.readAsDataURL(oInputimg.files[0]);
                reader.onload = function (e) {
                    //Initiate the JavaScript Image object.
                    var image = new Image();
     
                    //Set the Base64 string return from FileReader as source.
                    image.src = e.target.result;
                           
                 
     
                }
            }
            $("#img_val").text("");
            $("#id_picture_error").text("");
        }

        
    }
}


var _validFileExtensions_doc = [".docx", ".doc",".pdf"];    
             
function Validatedocupload(oInputimg) {
    if (oInputimg.type == "file") {
                
        var sFileName = oInputimg.value;
        
        if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validFileExtensions_doc.length; j++) {
                var sCurExtension = _validFileExtensions_doc[j];
                if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    if (blnValid) {
                      var fsize = $('#id_doc')[0].files[0].size;
                        if (oInputimg.files && oInputimg.files[0]) {
                      var reader = new FileReader();

                        reader.readAsDataURL(oInputimg.files[0]);
                        reader.onload = function (e) {
                            //Initiate the JavaScript Image object.
                            var image = new Image();
             
                            //Set the Base64 string return from FileReader as source.
                            image.src = e.target.result;
                                   
                            $("#doc_val").text("");
                    }
                }
            }
                    break;
                }
            }
            if (!blnValid) {

             $("#doc_val").text("Allowed file format : (.docx/doc/pdf)");
                
                oInputimg.value = "";
                return false;
            }
        }
        
         if (blnValid) {
            var fsize = $('#id_doc')[0].files[0].size;
           
            if (oInputimg.files && oInputimg.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#blah')
                        .attr('src', e.target.result);                                    
                };

                reader.readAsDataURL(oInputimg.files[0]);
                reader.onload = function (e) {
                    //Initiate the JavaScript Image object.
                    var image = new Image();
     
                    //Set the Base64 string return from FileReader as source.
                    image.src = e.target.result;
                           
                 
     
                }
            }
        }
        
    }
}


var _validFileExtensions_img_two = [".jpeg", ".jpg",".png"];    
             
function Validateimgupload_two(oInputimg) {
    if (oInputimg.type == "file") {
                
        var sFileName = oInputimg.value;
        
        if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validFileExtensions_img.length; j++) {
                var sCurExtension = _validFileExtensions_img[j];
                if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    if (blnValid) {
                      var fsize = $('#id_picture_two')[0].files[0].size;
                        if (oInputimg.files && oInputimg.files[0]) {
                      var reader = new FileReader();

                        reader.readAsDataURL(oInputimg.files[0]);
                        reader.onload = function (e) {
                            //Initiate the JavaScript Image object.
                            var image = new Image();
             
                            //Set the Base64 string return from FileReader as source.
                            image.src = e.target.result;
                                   
                            $("#img_val").text("");
                            $(".id_picture_two_error").text("");
                    }
                }
            }
                    break;
                }
            }
            if (!blnValid) {

             $("#img_val").text("Allowed file format : (.png/jpg/jpeg)");
                $(".id_picture_two_error").text("Allowed file format : (.png/jpg/jpeg)");
                oInputimg.value = "";
                return false;
            }
        }
        
         if (blnValid) {
            var fsize = $('#id_picture_two')[0].files[0].size;
           
            if (oInputimg.files && oInputimg.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#id_picture_two')
                        .attr('src', e.target.result);                                    
                };

                reader.readAsDataURL(oInputimg.files[0]);
                reader.onload = function (e) {
                    //Initiate the JavaScript Image object.
                    var image = new Image();
     
                    //Set the Base64 string return from FileReader as source.
                    image.src = e.target.result;
                           
                 
     
                }
            }
        }
        
    }
}





$(".contact-form-input  input ").focusin(function(){
    $(this).parent().parent().find('.labeel50').addClass('labeel147 colr_yellow');
    $(this).parent().parent().find('.contact-form-input').addClass('border_yellow');
});

$(".contact-form-input  input ").focusout(function(){
    if($(this).val() != "" ){
        $(this).parent().parent().find('.labeel50').addClass('labeel147');
        $(this).parent().parent().find('.labeel50').removeClass('colr_yellow');
        $(this).parent().parent().find('.contact-form-input').removeClass('border_yellow');
    }
    else{
        $(this).parent().parent().find('.labeel50').removeClass('labeel147 colr_yellow');
        $(this).parent().parent().find('.contact-form-input').removeClass('border_yellow');
    }
});


$(".contact-form-input  textarea ").focusin(function(){
    $(this).parent().parent().find('.labeel50').addClass('labeel147 colr_yellow');
    $(this).parent().parent().find('.contact-form-input').addClass('border_yellow');
});

$(".contact-form-input  textarea ").focusout(function(){
    if($(this).val() != "" ){
        $(this).parent().parent().find('.labeel50').addClass('labeel147');
        $(this).parent().parent().find('.labeel50').removeClass('colr_yellow');
        $(this).parent().parent().find('.contact-form-input').removeClass('border_yellow');
    }
    else{
        $(this).parent().parent().find('.labeel50').removeClass('labeel147 colr_yellow');
        $(this).parent().parent().find('.contact-form-input').removeClass('border_yellow');
    }
});


// Contact Us submit
contact_name=contact_email=contact_subject=contact_textarea=0

$("#contact_name").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().find(".error").text("Please enter a correct name");
    }
});

$("#contact_subject").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().find(".error").text("Please enter a correct name");
    }
});

$("#contact_textarea").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().find(".error").text("Please enter a correct name");
    }
});

$("#contact_email").keyup(function(){
    if($(this).val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null){
        $(this).parent().parent().find(".error").text("Please enter a correct Email Id");
    }
    else{
        $(this).parent().parent().find(".error").text("");
    }
});   


$("#contact_btn").click(function(){

    if($("#contact_name").val().trim() != ""){
        $("#contact_name").parent().parent().find(".error").text("");
        contact_name = 0;
    }
    else {
        $("#contact_name").parent().parent().find(".error").text("Please enter a correct name");
        contact_name = 1;
    }

    if($("#contact_subject").val().trim() != ""){
        $("#contact_subject").parent().parent().find(".error").text("");
        contact_subject = 0;
    }
    else {
        $("#contact_subject").parent().parent().find(".error").text("Please enter a correct name");
        contact_subject = 1;
    }

    if($("#contact_textarea").val().trim() != ""){
        $("#contact_textarea").parent().parent().find(".error").text("");
        contact_textarea = 0;
    }
    else {
        $("#contact_textarea").parent().parent().find(".error").text("Please enter a correct name");
        contact_textarea = 1;
    }

    if($("#contact_email").val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null || $("#contact_email").val().trim() == ""){
        $("#contact_email").parent().parent().find(".error").text("Please enter a correct Email Id");
        contact_email = 1;
    }
    else{
        $("#contact_email").parent().parent().find(".error").text("");
        contact_email = 0;
    }

    if(contact_name == 1 || contact_subject == 1 || contact_textarea == 1 || contact_email == 1  ){
        return false
    }

});

$('#id_about_edit').click(function () {
    $('#about_textarea_modal .jqte_editor').html($('#id_about_div .jqte_editor ').html());
});
$('#about_textarea_modal_close').click(function () {
    $('#id_about_div .jqte_editor').html($('#about_textarea_modal .jqte_editor').html());
});

$('#id_short_text_edit').click(function () {
    $('#short_text_textarea_modal .jqte_editor').html($('#id_about_buzz .jqte_editor ').html());
});
$('#short_text_textarea_modal_close').click(function () {
    $('#id_about_buzz .jqte_editor').html($('#short_text_textarea_modal .jqte_editor').html());
});




// Upload Image with preview

var _one_validFileExtensions_img_two = [".png", ".jpg", "jpeg"];

    function uploadphoto(oInputimg) {

        if (oInputimg.type == "file") {



            var sFileName = oInputimg.value;



            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _one_validFileExtensions_img_two.length; j++) {
                    var sCurExtension = _one_validFileExtensions_img_two[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }

                if (!blnValid) {
                    $("#img_val").text("Allowed file format : (.png/jpg/jpeg)");
                    oInputimg.value = "";
                    return false;
                }

                if (blnValid) {
                    if (oInputimg.files && oInputimg.files[0]) {
                        var reader = new FileReader();

                        reader.onload = function (e) {

                            //Initiate the JavaScript Image object.
                            var image = new Image();
             
                            //Set the Base64 string return from FileReader as source.
                            image.src = e.target.result;
                                   
                            //Validate the File Height and Width.
                            image.onload = function () {
                                var height = this.height;
                                var width = this.width;
                                
                                // if(height>40 && width > 180){
                                //     $("#id_Resume").val("");
                                //     $("#emp-profile").text("Upload profile Image");
                                //     setTimeout(function () { $('#candidate-pro-img-size').modal('show'); }, 100);
                                //     $('#candidate-pro-img-size').modal({ backdrop: 'static', keyboard: false });
                                //     document.getElementById('blah').src = '/static/static/images/180*40.png';
                                    
                                // }
                            };

                            $('#blah')
                                .attr('src', e.target.result)
                                // .width(width);
                                // .height(height);
                        };

                        reader.readAsDataURL(oInputimg.files[0]);
                    }
                    $("#img_val").text("");
                }

            }
        }
        return true;
    }

$("#abt_capm_group").click(function(){

      var text_length = $("#id_about_cam .jqte_editor").text().length;
      if(text_length<=0){
        $("#id_about_error").text("Please fill about the Campaign ");
        return false;
      }
      else {
        $("#id_about_error").text("");
        return true;
      }
 });


// Edit Updates

$(".class_tittle #id_title").keyup(function(){
    if($(this).val().trim() != ""){
        $("#id_tittle_error").text("");
    }
    else {
        $("#id_tittle_error").text("Please enter a title");
    }
});

$("#Edit_Updates").click(function(){


    var id_title = update_text =0

    if($(".class_tittle #id_title").val().trim() != ""){
        $("#id_tittle_error").text("");
        id_title = 0;
    }
    else {
        $("#id_tittle_error").text("Please enter a title");
        id_title = 1;
    }


    var text_length_2 = $("#id_about_update .jqte_editor").text().length;
      if(text_length_2<=0){
        $("#id_update_error").text("Please Update ");
        update_text = 1
      }
      else {
        // $("textarea[name='buzz']").val($("#id_about_update .jqte_editor").text());
        $("#id_update_error").text("");
        update_text = 0; 
      }


      if(update_text == 1 || id_title == 1 ){
        return false
    }

});



// Edit Buzzz

$(".class_tittle_one #id_title").keyup(function(){
    if($(this).val().trim() != ""){
        $("#id_tittle_one_error").text("");
    }
    else {
        $("#id_tittle_one_error").text("Please enter a title");
    }
});

$("#id_publisher").keyup(function(){
    if($(this).val().trim() != ""){
        $("#publisher_error").text("");
    }
    else {
        $("#publisher_error").text("Please enter a publisher");
    }
});



// buzz or media

$("#id_article_link").keyup(function(){
        if($(this).val().trim().match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/) == null){
            $("#article_error").text("Please Valid a article link");
        }
        else{
            $("#article_error").text("");
        }
    });   
    




$("#Edit_buzz").click(function(){


    var id_tittle_one = buzz_text = id_article_link = id_picture_two =  id_publisher = 0;

    if($(".class_tittle_one #id_title").val().trim() != ""){
        $("#id_tittle_one_error").text("");
        id_tittle_one = 0;
    }
    else {
        $("#id_tittle_one_error").text("Please enter a title");
        id_tittle_one = 1;
    }

    if($("#id_publisher").val().trim() != ""){
        $("#publisher_error").text("");
        id_publisher = 0;
    }
    else {
        $("#publisher_error").text("Please enter a publisher");
        id_publisher = 1;
    }

    

    var text_length_3 = $("#id_about_buzz .jqte_editor").text().length;
      if(text_length_3<=0){
        $("#id_buzz_error").text("Please Update ");
        buzz_text = 1
      }
      else {
         // $("textarea[name='buzz']").val($("#id_about_update .jqte_editor").text());
        $("#id_buzz_error").text("");
        buzz_text = 0; 
      }


     

        if($("#id_article_link").val().trim().match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/) == null || $("#id_article_link").val().trim() == ""){
            $("#article_error").text("Please Valid a article link");
            id_article_link = 1;
        }
        else{
            $("#article_error").text("");
            id_article_link = 0;
        }



        if($("#id_picture_two").val() == ""){
            $(".id_picture_two_error").text("Please Upload Image");
            id_picture_two = 1;
        }
        else{
             $(".id_picture_two_error").text("");
            id_picture_two = 0;
        }
        


      if(buzz_text == 1 || id_tittle_one == 1 || id_article_link == 1 || id_picture_two == 1 || id_publisher == 1){
        return false
    }

});


$(".edit_title_class #id_title").keyup(function(){
    if($(this).val().trim() != ""){
        $(".edit_title_error").text("");
    }
    else {
        $(".edit_title_error").text("Please enter a title");
    }
});


$("#edit_title_btn").click(function(){

    if($(".edit_title_class #id_title").val().trim() != ""){
        $(".edit_title_error").text("");
        return true
    }
    else {
        $(".edit_title_error").text("Please enter a title");
        return false
    }

});

$(".edit_goal #id_goal").keyup(function(){
    if($(this).val().trim() != ""){
        $(".edit_goal_error").text("");
    }
    else {
        $(".edit_goal_error").text("Please enter a Goal");
    }
});


$("#edit_goal_btn").click(function(){

    if($(".edit_goal #id_goal").val().trim() != ""){
        $(".edit_goal_error").text("");
        return true
    }
    else {
        $(".edit_goal_error").text("Please enter a Goal");
        return false
    }

});


$("#id_picture_btn").click(function(){
 if($("#id_picture").val() == ""){
        $("#id_picture_error").text("Please Upload Image");
        return false
    }
    else{
         $("#id_picture_error").text("");
        return true
    }
});


// Service Equiry format

$("#id_name").keyup(function(){
        if($(this).val().trim() != ""){
            $(this).parent().parent().find(".error").text("");
        }
        else {
            $(this).parent().parent().find(".error").text("Please enter a correct name");
        }
    });


$("#id_email").keyup(function(){
        if($(this).val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null){
            $(this).parent().parent().find(".error").text("Please enter a correct Email Id and remove any spaces");
        }
        else{
            $(this).parent().parent().find(".error").text("");
        }
    }); 


$("#mobile-number-2").keyup(function(){
        if($(this).val().trim() == ""){
            $(this).parent().parent().parent().find(".error").text("Please enter a correct Mobile No");
        }
        else {
            $(this).parent().parent().parent().find(".error").text("");
        }
    });

    $("#mobile-number-2").keypress(function(evt){       
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)){
            return false;
        }
    });


    $("#id_message").keyup(function(){
        if($(this).val().trim() != ""){
            $(this).parent().parent().find(".error").text("");
        }
        else {
            $(this).parent().parent().find(".error").text("Please provide Message");
        }
    });

$("#services_btn").click(function(){
    // Name,email,mobile,Message

    var id_name = id_email = id_message = mobile_number_2 = 0;

    if($("#id_name").val().trim() != ""){
            $("#id_name").parent().parent().find(".error").text("");
            id_name = 0;
        }
        else {
            $("#id_name").parent().parent().find(".error").text("Please enter a correct name");
            id_name = 1;
        }

        if($("#id_email").val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null || $("#id_email").val().trim() == ""){
            $("#id_email").parent().parent().find(".error").text("Please enter a correct Email Id and remove any spaces");
            id_email = 1;
        }
        else{
            $("#id_email").parent().parent().find(".error").text("");
            id_email = 0;
        }

        if($("#mobile-number-2").val().length < 7 ){
            $("#mobile-number-2").parent().parent().parent().find(".error").text("Please enter a correct Mobile No");       
            mobile_number_2 = 1 ;   
        }
        else if($("#mobile-number-2").val().startsWith($('.country_code_here').text()) === false){
            $("#mobile-number-2").parent().parent().parent().find(".error").text("Please enter a Country Code to Mobile No");       
            mobile_number_2 = 1 ;    
            }
        else {
            $("#mobile-number-2").parent().parent().parent().find(".error").text("");
            mobile_number_2 = 0 ;
        }

        if($("#id_message").val().trim() != ""){
            $("#id_message").parent().parent().find(".error").text("");
            id_message = 0;
        }
        else {
            $("#id_message").parent().parent().find(".error").text("Please provide Message");
            id_message = 1;
        }

        if(id_name == 1 || id_email == 1 || mobile_number_2 == 1 || id_message == 1 ){
            return false
        }
});

// authorize_campaign

$("#id_category").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().find(".error").text("Please enter category");
    }
});



$("#id_category").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().find(".error").text("Please enter category");
    }
});


$("#authorize_campaign").click(function(){
    if($("#id_category").val().trim() != ""){
        $("#id_category").parent().parent().find(".error").text("");
        return true;
    }
    else {
        $("#id_category").parent().parent().find(".error").text("Please enter category");
        return false;
    }
});


$("#id_cause").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().find(".error").text("Please enter cause");
    }
});

$("#id_edit_cause").click(function(){ 

    var id_cause = dec_error = 0;

    if($("#id_cause").val().trim() != ""){
        $("#id_cause").parent().parent().find(".error").text("");
        id_cause = 0;
    }
    else {
        $("#id_cause").parent().parent().find(".error").text("Please enter cause");
        id_cause = 1;
    }


    var text_length_des = $("#id_about_div .jqte_editor").text().length;
      if(text_length_des<=0) {
        $("#description_error").text("Please enter Description ");
        dec_error = 1;
      }
      else {
        $("#description_error").text("");
        dec_error = 0; 
      }

      if(id_cause == 1 || dec_error == 1 ) {
            return false
      }

});


$("#manage_user_edit_btn").click(function(){

    var id_name = id_email  = mobile_number_2 = 0;

    if($("#reg_name").val().trim() != ""){
            $("#reg_name").parent().parent().find(".error").text("");
            id_name = 0;
        }
        else {
            $("#reg_name").parent().parent().find(".error").text("Please enter a correct name");
            id_name = 1;
        }

        if($("#reg_email").val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null || $("#reg_email").val().trim() == ""){
            $("#reg_email").parent().parent().find(".error").text("Please enter a correct Email Id and remove any spaces");
            id_email = 1;
        }
        else{
            $("#reg_email").parent().parent().find(".error").text("");
            id_email = 0;
        }

    if($("#mobile-number").val().length < 7 ){
            $("#mobile-number").parent().parent().parent().find(".error").text("Please enter a correct Mobile No");       
            mobile_number_2 = 1 ;   
        }
        else if($("#mobile-number").val().startsWith($('.country_code_here').text()) === false){
            $("#mobile-number").parent().parent().parent().find(".error").text("Please enter a Country Code to Mobile No");       
            mobile_number_2 = 1 ;    
            }
        else {
            $("#mobile-number").parent().parent().parent().find(".error").text("");
            mobile_number_2 = 0 ;
        }

         if(id_name == 1 || id_email == 1 || mobile_number_2 == 1 ){
            return false
        }

});


var generic_id_departments = generic_role = 0;
$("#id_departments").change(function(){
    if($(this).val() == ""){
        $("#dep_error").text("Please select departments");
        generic_id_departments = 1;
    }
    else{
        $("#dep_error").text("");
        generic_id_departments = 0;
    }
});

$("#id_role").change(function(){
    if($(this).val() == ""){
        $("#role_error").text("Please select departments");
        generic_role = 1;
    }
    else{
        $("#role_error").text("");
        generic_role = 0;
    }
});



$("#manage_generic_user_edit_btn").click(function(){

    var id_name = id_email   = 0;

    if($("#id_name").val().trim() != ""){
            $("#id_name").parent().parent().find(".error").text("");
            id_name = 0;
        }
        else {
            $("#id_name").parent().parent().find(".error").text("Please enter a correct name");
            id_name = 1;
        }

        if($("#reg_email").val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null || $("#reg_email").val().trim() == ""){
            $("#reg_email").parent().parent().find(".error").text("Please enter a correct Email Id and remove any spaces");
            id_email = 1;
        }
        else{
            $("#reg_email").parent().parent().find(".error").text("");
            id_email = 0;
        }

    if(generic_id_departments==1 || generic_role == 1 || id_name == 1 || id_email== 1 ){
        return false;
    }
    
});

// Modify testimonial

$("#id_designation").keyup(function(){
        if($(this).val().trim() != ""){
            $(this).parent().parent().parent().find(".error").text("");
        }
        else {
            $(this).parent().parent().parent().find(".error").text("Please enter a correct designation");
        }
    });

$("#testimonial​_id").click(function(){

    var id_name = id_designation = update_text = id_image = 0;
    if($("#id_name").val().trim() != ""){
            $("#id_name").parent().parent().find(".error").text("");
            id_name = 0;
        }
        else {
            $("#id_name").parent().parent().find(".error").text("Please enter a correct name");
            id_name = 1;
        }

        if($("#id_designation").val().trim() != ""){
            $("#id_designation").parent().parent().parent().find(".error").text("");
            id_designation = 0;
        }
        else {
            $("#id_designation").parent().parent().parent().find(".error").text("Please enter a correct designation");
            id_designation = 1;
        }

        var text_length_2 = $("#id_about_crowd_newsing_div .jqte_editor").text().length;
          if(text_length_2<=0){
            $("#id_update_error").text("Please Update ");
            update_text = 1
          }
          else {
            // $("textarea[name='buzz']").val($("#id_about_crowd_newsing_div .jqte_editor").text());
            $("#id_update_error").text("");
            update_text = 0; 
          }

          if($("#id_image").val() == ""){
                $("#img_val").text("Please Upload Image");
                id_image = 1;
            }
            else{
                 $("#img_val").text("");
                id_image = 0;
            }
        
    if(id_name == 1 || id_designation == 1 || update_text == 1 || id_image == 1){
        return false
    }

});


// Manage Campaign edit

$("#id_title").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().parent().find(".error").text("Please enter a correct title");
    }
});

$("#id_day").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().parent().find(".error").text("Please enter no of days");
    }
});

$("#id_goal").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().parent().find(".error").text("Please enter a goal");
    }
});



$("#id_short_description").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().parent().find(".error").text("Please enter a some description");
    }
});


$("#id_commission").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().parent().find(".error").text("Please enter a commission");
    }
});

var select_category = select_cause = select_sensitivity = 0;

$("#select_category").change(function(){
    if($(this).val() == ""){
        $("#select_category_error").text("Please select category");
        select_category = 1;
    }
    else{
        $("#select_category_error").text("");
        select_category = 0;
    }
});

$("#select_cause").change(function(){
    if($(this).val() == ""){
        $("#select_cause_error").text("Please select category");
        select_cause = 1;
    }
    else{
        $("#select_cause_error").text("");
        select_cause = 0;
    }
});

$("#id_cause").change(function(){
    if($(this).val() == ""){
        $("#id_cause_error").text("Please select cause");
        select_cause = 1;
    }
    else{
        $("#id_cause_error").text("");
        select_cause = 0;
    }
});


$("#id_category").change(function(){
    if($(this).val() == ""){
        $("#id_cause_error").text("Please select category");
        select_cause = 1;
    }
    else{
        $("#id_cause_error").text("");
        select_cause = 0;
    }
});






$("#id_sensitivity").change(function(){
    if($(this).val() == "") {
        $("#id_sensitivity_error").text("Please select sensitivity");
        select_sensitivity = 1;
    }
    else {
        $("#id_sensitivity_error").text("");
        select_sensitivity = 0;
    }
});


$("#select_sensitivity").change(function(){
    if($(this).val() == "") {
        $("#select_sensitivity_error").text("Please select category");
        select_sensitivity = 1;
    }
    else {
        $("#select_sensitivity_error").text("");
        select_sensitivity = 0;
    }
});


    
    $("#manage_camp_edit").click(function(){

        var id_title = id_day = id_goal = id_short_description = select_cause = id_commission = about_text = 0;

        if($("#id_title").val().trim() != ""){
            $("#id_title").parent().parent().find(".error").text("");
            id_title = 0;
        }
        else {
            $("#id_title").parent().parent().find(".error").text("Please enter a correct title");
            id_title = 1;
        }

        if($("#id_day").val().trim() != ""){
            $("#id_day").parent().parent().find(".error").text("");
            id_day = 0;
        }
        else {
            $("#id_day").parent().parent().find(".error").text("Please enter no of days");
            id_day = 1;
        }

        if($("#id_goal").val().trim() != ""){
            $("#id_goal").parent().parent().find(".error").text("");
            id_goal = 0;
        }
        else {
            $("#id_goal").parent().parent().find(".error").text("Please enter a goal");
            id_goal = 1;
        }

        if($("#id_commission").val().trim() != ""){
            $("#id_commission").parent().parent().find(".error").text("");
            id_commission = 0;
        }
        else {
            $("#id_commission").parent().parent().find(".error").text("Please enter a some commission");
            id_commission = 1;
        }


        if($("#select_cause").val() == ""){
            $("#select_cause_error").text("Please select category");
            select_cause = 1;
        }
        else{
            $("#select_cause_error").text("");
            select_cause = 0;
        }

        if($("#select_sensitivity").val() == "") {
            $("#select_sensitivity_error").text("Please select category");
            select_sensitivity = 1;
        }
        else {
            $("#select_sensitivity_error").text("");
            select_sensitivity = 0;
        }

        

        if($("#id_short_description").val().trim() != ""){
            $("#id_short_description").parent().parent().find(".error").text("");
            id_short_description = 0;
        }
        else {
            $("#id_short_description").parent().parent().find(".error").text("Please enter asome description");
            id_short_description = 1;
        }

        
        // if($("#id_image").val() == ""){
        //     $("#img_val").text("Please Upload Image");
        //     id_picture_two = 1;
        // }
        // else{
        //      $("#img_val").text("");
        //     id_picture_two = 0;
        // }



        var text_length_2 = $("#id_about_div .jqte_editor").text().length;
          if(text_length_2<=0){
            $("#about_error").text("Please enter about ");
            about_text = 1
          }
          else {
            $("#about_error").text("");
            about_text = 0; 
          }


    if(select_category == 1 || select_cause == 1  || select_sensitivity == 1 || id_commission == 1 || id_title == 1 || id_day == 1 || id_goal == 1 || id_short_description == 1 || about_text == 1 ) {
        return false
    }
});


$("#manage_support_edit").click(function(){

        var id_title = id_day = id_goal = id_short_description = id_picture_two = id_commission = about_text = 0;

        if($("#id_title").val().trim() != ""){
            $("#id_title").parent().parent().find(".error").text("");
            id_title = 0;
        }
        else {
            $("#id_title").parent().parent().find(".error").text("Please enter a correct title");
            id_title = 1;
        }


        if($("#id_goal").val().trim() != ""){
            $("#id_goal").parent().parent().find(".error").text("");
            id_goal = 0;
        }
        else {
            $("#id_goal").parent().parent().find(".error").text("Please enter a goal");
            id_goal = 1;
        }


        if($("#id_short_description").val().trim() != ""){
            $("#id_short_description").parent().parent().find(".error").text("");
            id_short_description = 0;
        }
        else {
            $("#id_short_description").parent().parent().find(".error").text("Please enter some description");
            id_short_description = 1;
        }

        // if($("#id_image").val() == ""){
        //     $("#img_val").text("Please Upload Image");
        //     id_picture_two = 1;
        // }
        // else{
        //      $("#img_val").text("");
        //     id_picture_two = 0;
        // }

        if($("#select_cause").val() == ""){
            $("#select_cause_error").text("Please select category");
            select_cause = 1;
        }
        else{
            $("#select_cause_error").text("");
            select_cause = 0;
        }

        if($("#select_sensitivity").val() == "") {
            $("#select_sensitivity_error").text("Please select category");
            select_sensitivity = 1;
        }
        else {
            $("#select_sensitivity_error").text("");
            select_sensitivity = 0;
        }

        var text_length_2 = $("#id_about_div .jqte_editor").text().length;
          if(text_length_2<=0){
            $("#about_error").text("Please enter about ");
            about_text = 1
          }
          else {
            $("#about_error").text("");
            about_text = 0; 
          }


    if( select_cause == 1 ||  select_sensitivity == 1 ||  id_title == 1 ||  id_goal == 1 || id_short_description == 1 || about_text == 1 ) {
        return false
    }
});


$("#datetimepicker1").keyup(function(){
    if($(this).val().trim() != ""){
        $("#date_error").text("");
    }
    else {
        $("#date_error").text("Please enter a correct date");
    }
});

$("#datetimepicker1").change(function(){
    if($(this).val().trim() != ""){
        $("#date_error").text("");
    }
    else {
        $("#date_error").text("Please enter a correct date");
    }
});



$("#id_place").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().parent().find(".error").text("Please enter a Place");
    }
});


$("#manage_event_edit").click(function(){

        var id_name = id_place = datetimepicker1 = id_picture_two  = about_text = 0;

        if($("#id_name").val().trim() != ""){
            $("#id_name").parent().parent().find(".error").text("");
            id_name = 0;
        }
        else {
            $("#id_name").parent().parent().find(".error").text("Please enter a correct name");
            id_name = 1;
        }


        if($("#id_place").val().trim() != ""){
            $("#id_place").parent().parent().find(".error").text("");
            id_place = 0;
        }
        else {
            $("#id_place").parent().parent().find(".error").text("Please enter a correct place");
            id_place = 1;
        }


        if($("#datetimepicker1").val().trim() != ""){
            $("#date_error").text("");
            datetimepicker1 = 0;
        }
        else {
            $("#date_error").text("Please enter a correct date");
            datetimepicker1 = 1;
        }

        // if($("#id_image").val() == ""){
        //     $("#img_val").text("Please Upload Image");
        //     id_picture_two = 1;
        // }
        // else{
        //      $("#img_val").text("");
        //     id_picture_two = 0;
        // }

        if($("#select_cause").val() == ""){
            $("#select_cause_error").text("Please select category");
            select_cause = 1;
        }
        else{
            $("#select_cause_error").text("");
            select_cause = 0;
        }

        if($("#select_sensitivity").val() == "") {
            $("#select_sensitivity_error").text("Please select category");
            select_sensitivity = 1;
        }
        else {
            $("#select_sensitivity_error").text("");
            select_sensitivity = 0;
        }

        var text_length_2 = $("#id_about_div .jqte_editor").text().length;
          if(text_length_2<=0){
            $("#about_error").text("Please enter about ");
            about_text = 1
          }
          else {
            $("#about_error").text("");
            about_text = 0; 
          }


    if( select_cause == 1 || select_sensitivity == 1 ||  id_place == 1 ||  id_name == 1 || datetimepicker1 == 1 || about_text == 1 ) {
        return false
    }
});

$("#id_amount").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().parent().find(".error").text("Please enter a correct Amount");
    }
});

$("#id_address").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().find(".error").text("Please enter a correct Amount");
    }
});

$("#id_pincode").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().find(".error").text("Please enter a correct Amount");
    }
});

$("#id_city").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().find(".error").text("Please enter a correct Amount");
    }
});

$("#mobile-number").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().find(".error").text("Please enter a correct Amount");
    }
});

$("#id_state").keyup(function(){
    if($(this).val().trim() != ""){
        $(this).parent().parent().find(".error").text("");
    }
    else {
        $(this).parent().parent().find(".error").text("Please enter a correct Amount");
    }
});



$("#support_fund").click(function(){

        var id_name = id_address = id_pincode  = id_amount = id_city = id_state = reg_number = trem_check = 0;

        if($("#id_name").val().trim() != ""){
            $("#id_name").parent().parent().find(".error").text("");
            id_name = 0;
        }
        else {
            $("#id_name").parent().parent().find(".error").text("Please enter a correct name");
            id_name = 1;
        }

        if($("#id_amount").val().trim() != ""){
            $("#id_amount").parent().parent().parent().find(".error").text("");
            id_amount = 0;
        }
        else {
            $("#id_amount").parent().parent().parent().find(".error").text("Please enter a correct Amount");
            id_amount = 1;
        }


        if($("#id_address").val().trim() != ""){
            $("#id_address").parent().parent().find(".error").text("");
            id_address = 0;
        }
        else {
            $("#id_address").parent().parent().find(".error").text("Please enter a correct place");
            id_address = 1;
        }


        if($("#id_pincode").val().trim() != ""){
            $("#id_pincode").parent().parent().find(".error").text("");
            id_pincode = 0;
        }
        else {
            $("#id_pincode").parent().parent().find(".error").text("Please enter a correct pincode");
            id_pincode = 1;
        }

        if($("#id_city").val().trim() != ""){
            $("#id_city").parent().parent().find(".error").text("");
            id_city = 0;
        }
        else {
            $("#id_city").parent().parent().find(".error").text("Please enter a correct City");
            id_city = 1;
        }

        if($("#id_state").val().trim() != ""){
            $("#id_state").parent().parent().find(".error").text("");
            id_state = 0;
        }
        else {
            $("#id_state").parent().parent().find(".error").text("Please enter a correct State");
            id_state = 1;
        }

        if($("#mobile-number").val().length < 7 ){
            $("#mobile-number").parent().parent().parent().find(".error").text("Please enter a correct Mobile No");       
            reg_number = 1 ;   
        }
        else if($("#mobile-number").val().startsWith($('.country_code_here').text()) === false){
            $("#mobile-number").parent().parent().parent().find(".error").text("Please enter a Country Code to Mobile No");       
            reg_number = 1 ;    
            }
        else {
            $("#mobile-number").parent().parent().parent().find(".error").text("");
            reg_number = 0 ;
        }

        if($("#id_email").val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null || $("#id_email").val().trim() == ""){
            $("#id_email").parent().parent().find(".error").text("Please enter a correct Email Id and remove any spaces");
            id_email = 1;
        }
        else{
            $("#id_email").parent().parent().find(".error").text("");
            id_email = 0;
        }

        if ($('#termsCheck_box').prop("checked")) {
            // checked
            $('.terms_error').toast('hide');
            // return;
            trem_check = 0
        }
        else{
            // alert("not checked");
            $('.terms_error').toast('show');
            trem_check = 1
        }

        if( id_email == 1 || id_state == 1 ||  id_name == 1 || id_pincode == 1 || id_city == 1 || id_amount == 1 || trem_check == 1 || reg_number == 1) {
                return false
         }
    
});


$("#join_grp").click(function(){

        var id_name = id_address = id_pincode = id_city = id_state = reg_number  = 0;

        if($("#id_name").val().trim() != ""){
            $("#id_name").parent().parent().find(".error").text("");
            id_name = 0;
        }
        else {
            $("#id_name").parent().parent().find(".error").text("Please enter a correct name");
            id_name = 1;
        }


        if($("#id_address").val().trim() != ""){
            $("#id_address").parent().parent().find(".error").text("");
            id_address = 0;
        }
        else {
            $("#id_address").parent().parent().find(".error").text("Please enter a correct place");
            id_address = 1;
        }


        if($("#id_pincode").val().trim() != ""){
            $("#id_pincode").parent().parent().find(".error").text("");
            id_pincode = 0;
        }
        else {
            $("#id_pincode").parent().parent().find(".error").text("Please enter a correct pincode");
            id_pincode = 1;
        }

        if($("#id_city").val().trim() != ""){
            $("#id_city").parent().parent().find(".error").text("");
            id_city = 0;
        }
        else {
            $("#id_city").parent().parent().find(".error").text("Please enter a correct City");
            id_city = 1;
        }

        if($("#id_state").val().trim() != ""){
            $("#id_state").parent().parent().find(".error").text("");
            id_state = 0;
        }
        else {
            $("#id_state").parent().parent().find(".error").text("Please enter a correct State");
            id_state = 1;
        }

        if($("#mobile-number").val().length < 7 ){
            $("#mobile-number").parent().parent().parent().find(".error").text("Please enter a correct Mobile No");       
            reg_number = 1 ;   
        }
        else if($("#mobile-number").val().startsWith($('.country_code_here').text()) === false){
            $("#mobile-number").parent().parent().parent().find(".error").text("Please enter a Country Code to Mobile No");       
            reg_number = 1 ;    
            }
        else {
            $("#mobile-number").parent().parent().parent().find(".error").text("");
            reg_number = 0 ;
        }

        if($("#id_email").val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null || $("#id_email").val().trim() == ""){
            $("#id_email").parent().parent().find(".error").text("Please enter a correct Email Id and remove any spaces");
            id_email = 1;
        }
        else{
            $("#id_email").parent().parent().find(".error").text("");
            id_email = 0;
        }

        if ($('#termsCheck_box').prop("checked")) {
            // checked
            $('.terms_error').toast('hide');
            // return;
            trem_check = 0
        }
        else{
            // alert("not checked");
            $('.terms_error').toast('show');
            trem_check = 1
        }

        if( id_email == 1 || id_state == 1 ||  id_name == 1 || id_pincode == 1 || id_city == 1 || reg_number == 1) {
                return false
         }
    
});


$("#join_grp").click(function(){

        var id_name = id_address = id_pincode = id_city = id_state = reg_number  = 0;

        if($("#id_name").val().trim() != ""){
            $("#id_name").parent().parent().find(".error").text("");
            id_name = 0;
        }
        else {
            $("#id_name").parent().parent().find(".error").text("Please enter a correct name");
            id_name = 1;
        }


        if($("#id_address").val().trim() != ""){
            $("#id_address").parent().parent().find(".error").text("");
            id_address = 0;
        }
        else {
            $("#id_address").parent().parent().find(".error").text("Please enter a correct place");
            id_address = 1;
        }


        if($("#id_pincode").val().trim() != ""){
            $("#id_pincode").parent().parent().find(".error").text("");
            id_pincode = 0;
        }
        else {
            $("#id_pincode").parent().parent().find(".error").text("Please enter a correct pincode");
            id_pincode = 1;
        }

        if($("#id_city").val().trim() != ""){
            $("#id_city").parent().parent().find(".error").text("");
            id_city = 0;
        }
        else {
            $("#id_city").parent().parent().find(".error").text("Please enter a correct City");
            id_city = 1;
        }

        if($("#id_state").val().trim() != ""){
            $("#id_state").parent().parent().find(".error").text("");
            id_state = 0;
        }
        else {
            $("#id_state").parent().parent().find(".error").text("Please enter a correct State");
            id_state = 1;
        }

        if($("#mobile-number").val().length < 7 ){
            $("#mobile-number").parent().parent().parent().find(".error").text("Please enter a correct Mobile No");       
            reg_number = 1 ;   
        }
        else if($("#mobile-number").val().startsWith($('.country_code_here').text()) === false){
            $("#mobile-number").parent().parent().parent().find(".error").text("Please enter a Country Code to Mobile No");       
            reg_number = 1 ;    
            }
        else {
            $("#mobile-number").parent().parent().parent().find(".error").text("");
            reg_number = 0 ;
        }

        if($("#id_email").val().trim().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/) == null || $("#id_email").val().trim() == ""){
            $("#id_email").parent().parent().find(".error").text("Please enter a correct Email Id and remove any spaces");
            id_email = 1;
        }
        else{
            $("#id_email").parent().parent().find(".error").text("");
            id_email = 0;
        }

        if ($('#termsCheck_box').prop("checked")) {
            // checked
            $('.terms_error').toast('hide');
            // return;
            trem_check = 0
        }
        else{
            // alert("not checked");
            $('.terms_error').toast('show');
            trem_check = 1
        }

        if( id_email == 1 || id_state == 1 ||  id_name == 1 || id_pincode == 1 || id_city == 1 || reg_number == 1) {
                return false
         }
    
});

// Start a Mobilisation Campaign

$("#Support_Group").click(function(){

        var id_title  = id_goal = id_short_description = id_picture_two = id_commission = about_text = 0;

        if($("#id_title").val().trim() != ""){
            $("#id_title").parent().parent().find(".error").text("");
            id_title = 0;
        }
        else {
            $("#id_title").parent().parent().find(".error").text("Please enter a correct title");
            id_title = 1;
        }


        if($("#id_goal").val().trim() != ""){
            $("#id_goal").parent().parent().find(".error").text("");
            id_goal = 0;
        }
        else {
            $("#id_goal").parent().parent().find(".error").text("Please enter a goal");
            id_goal = 1;
        }


        if($("#id_short_description").val().trim() != ""){
            $("#id_short_description").parent().parent().find(".error").text("");
            id_short_description = 0;
        }
        else {
            $("#id_short_description").parent().parent().find(".error").text("Please enter some description");
            id_short_description = 1;
        }

        if($("#id_picture").val() == ""){
            $("#img_val").text("Please Upload Image");
            id_picture_two = 1;
        }
        else{
             $("#img_val").text("");
            id_picture_two = 0;
        }

        if($("#id_cause").val() == ""){
            $("#id_cause_error").text("Please select category");
            select_cause = 1;
        }
        else{
            $("#id_cause_error").text("");
            select_cause = 0;
        }

        if($("#id_sensitivity").val() == "") {
            $("#id_sensitivity_error").text("Please select category");
            select_sensitivity = 1;
        }
        else {
            $("#id_sensitivity_error").text("");
            select_sensitivity = 0;
        }

        var text_length_2 = $("#id_about_div .jqte_editor").text().length;
          if(text_length_2<=0){
            $("#id_about_error").text("Please enter about ");
            about_text = 1
          }
          else {
            $("#id_about_error").text("");
            about_text = 0; 
          }


    if( select_cause == 1 ||  select_sensitivity == 1 ||  id_title == 1 ||  id_goal == 1 || id_short_description == 1 || about_text == 1 || id_picture_two == 1 ) {
        return false
    }
});

// Start start_event

$("#start_event").click(function(){

        var id_name = id_place = datetimepicker1 = id_picture_two  = about_text = 0;

        if($("#id_name").val().trim() != ""){
            $("#id_name").parent().parent().find(".error").text("");
            id_name = 0;
        }
        else {
            $("#id_name").parent().parent().find(".error").text("Please enter a correct name");
            id_name = 1;
        }


        if($("#id_place").val().trim() != ""){
            $("#id_place").parent().parent().find(".error").text("");
            id_place = 0;
        }
        else {
            $("#id_place").parent().parent().find(".error").text("Please enter a correct place");
            id_place = 1;
        }


        if($("#datetimepicker1").val().trim() != ""){
            $("#date_error").text("");
            datetimepicker1 = 0;
        }
        else {
            $("#date_error").text("Please enter a correct date");
            datetimepicker1 = 1;
        }

        if($("#id_image").val() == ""){
            $("#img_val").text("Please Upload Image");
            id_picture_two = 1;
        }
        else{
             $("#img_val").text("");
            id_picture_two = 0;
        }

        if($("#id_cause").val() == ""){
            $("#id_cause_error").text("Please select cause");
            select_cause = 1;
        }
        else{
            $("#id_cause_error").text("");
            select_cause = 0;
        }

        if($("#id_sensitivity").val() == "") {
            $("#id_sensitivity_error").text("Please select sensitivity");
            select_sensitivity = 1;
        }
        else {
            $("#id_sensitivity_error").text("");
            select_sensitivity = 0;
        }

        var text_length_2 = $("#id_about_div .jqte_editor").text().length;
          if(text_length_2<=0){
            $("#about_error").text("Please enter about ");
            about_text = 1
          }
          else {
            $("#about_error").text("");
            about_text = 0; 
          }


    if( select_cause == 1 || select_sensitivity == 1 ||  id_place == 1 ||  id_name == 1 || datetimepicker1 == 1 || about_text == 1 || id_picture_two == 1 ) {
        return false
    }
});


// Start Campaign

$("#Start_fund").click(function(){

        var id_title  = id_goal = id_short_description = id_picture_two = id_commission = about_text = 0;

        if($("#id_title").val().trim() != ""){
            $("#id_title").parent().parent().find(".error").text("");
            id_title = 0;
        }
        else {
            $("#id_title").parent().parent().find(".error").text("Please enter a correct title");
            id_title = 1;
        }

        if($("#id_day").val().trim() != ""){
            $("#id_day").parent().parent().find(".error").text("");
            id_day = 0;
        }
        else {
            $("#id_day").parent().parent().find(".error").text("Please enter no of days");
            id_day = 1;
        }

        if($("#id_goal").val().trim() != ""){
            $("#id_goal").parent().parent().find(".error").text("");
            id_goal = 0;
        }
        else {
            $("#id_goal").parent().parent().find(".error").text("Please enter a goal");
            id_goal = 1;
        }


        if($("#id_short_description").val().trim() != ""){
            $("#id_short_description").parent().parent().find(".error").text("");
            id_short_description = 0;
        }
        else {
            $("#id_short_description").parent().parent().find(".error").text("Please enter some description");
            id_short_description = 1;
        }

        if($("#id_picture").val() == ""){
            $("#img_val").text("Please Upload Image");
            id_picture_two = 1;
        }
        else{
             $("#img_val").text("");
            id_picture_two = 0;
        }

        

        if($("#id_category").val() == ""){
            $("#id_category_error").text("Please select category");
            select_category = 1;
        }
        else{
            $("#id_category_error").text("");
            select_category = 0;
        }

        if($("#id_cause").val() == ""){
            $("#id_cause_error").text("Please select cause");
            select_cause = 1;
        }
        else{
            $("#id_cause_error").text("");
            select_cause = 0;
        }

        if($("#id_sensitivity").val() == "") {
            $("#id_sensitivity_error").text("Please select sensitivity");
            select_sensitivity = 1;
        }
        else {
            $("#id_sensitivity_error").text("");
            select_sensitivity = 0;
        }

        var text_length_2 = $("#id_about_div .jqte_editor").text().length;
          if(text_length_2<=0){
            $("#id_about_error").text("Please enter about ");
            about_text = 1
          }
          else {
            $("#id_about_error").text("");
            about_text = 0; 
          }


    if( select_cause == 1 || id_day == 1 || select_category == 1 ||  select_sensitivity == 1 ||  id_title == 1 ||  id_goal == 1 || id_short_description == 1 || about_text == 1 || id_picture_two == 1 ) {
        return false
    }
});