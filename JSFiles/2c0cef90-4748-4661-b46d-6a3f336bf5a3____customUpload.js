$(function () {
    'use strict';
    /*-----Profile pic upload js--------------*/
    
    $('#profilePic').fileupload({
       
        dataType: 'json',
        dropZone: $(),

    add: function(e, data) {

                    var fileType = data.files[0].type;
                    var fileSize = data.files[0].size;
                    var extension = fileType.replace(/^.*\//, '');
                    
                    if(fileType.indexOf('image/') === 0) {
                        if(extension=='jpeg' || extension=='png'){
                            if(fileSize<2000099){
                                $(".uploadProcess").append('<div class="progress" id="progress"><div class="progress-bar progress-bar-success"></div></div>');
                                data.submit();
                            }else{
                                alert('Image size must be less than 2mb');
                            }
                     
                        }else{
                            alert('Only allowed jpeg and png format');
                        }
                            
                    }else{
                        alert('Only allowed image format');
                    }
                       
                },
        done: function (e, data) {
            var returnJson = jQuery.parseJSON(data.jqXHR.responseText);
            $(".profile-avatar").attr("src", returnJson.imgPath);
            $("#progress").remove();
            
            
        },

        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
        },
        fail: function(e,data){
            console.log(e);
            console.log(data);
            console.log('failed');

        },
        error: function(e, data) {

                   console.log(e);
                   console.log(data);
                   console.log('error');

                },
    });

/*-----license/certificate upload js--------------*/

    $('#licensePic').fileupload({
       
        dataType: 'json',
        dropZone: $(),

    add: function(e, data) {

                    var fileType = data.files[0].type;
                    var fileSize = data.files[0].size;
                    var extension = fileType.replace(/^.*\//, '');
                    
                    if(fileType.indexOf('image/') === 0) {
                        if(extension=='jpeg' || extension=='png'|| extension=='gif'|| extension=='jpg'){
                            if(fileSize<57671680){
                                $('.loader-overlaylicence').show();
                                data.submit();
                            }else{
                                alert('Image size must be less than 2mb');
                            }
                     
                        }else{
                            alert('Only allowed jpeg, gif, jpg and png format');
                        }
                            
                    }else{
                        alert('Only allowed image format');
                    }
                        
                },
        done: function (e, data) {
             $('.loader-overlaylicence').hide();
             $('.licenseInput').remove();
             location.reload();
            
            
        },
        fail: function(e,data){
             $('.loader-overlaylicence').hide();
            console.log(e);
            console.log(data);
            console.log('failed');

        },
        error: function(e, data) {
                     $('.loader-overlaylicence').hide();
                   console.log(e);
                   console.log(data);
                   console.log('error');

                },
    });

/*-----gallery upload js--------------*/

    $('#galleryPic').fileupload({
        dataType: 'json',
        dropZone: $(),

    add: function(e, data) {

                    var fileType = data.files[0].type;
                    var fileSize = data.files[0].size;
                    var extension = fileType.replace(/^.*\//, '');
                    
                    if(fileType.indexOf('image/') === 0) {
                        if(extension=='jpeg' || extension=='png'|| extension=='gif'|| extension=='jpg'){
                            if(fileSize<57671680){
                                $('.loader-overlay').show();
                                data.submit();
                            }else{
                                alert('Image size must be less than 2mb');
                            }
                     
                        }else{
                            alert('Only allowed jpeg, gif, jpg and png format');
                        }
                            
                    }else{
                        alert('Only allowed image format');
                    }
                        
                },
        done: function (e, data) {
             $('.loader-overlay').hide();
             $('.loader-overlaylicence').hide();
             $('.licenseInput').remove();
             location.reload();
            
            
        },
        fail: function(e,data){
             $('.loader-overlaylicence').hide();
             $('.loader-overlay').hide();
            console.log(e);
            console.log(data);
            console.log('failed');

        },
        error: function(e, data) {
                    $('.loader-overlaylicence').hide();
                     $('.loader-overlay').hide();
                   console.log(e);
                   console.log(data);
                   console.log('error');

                },
    });

/*----------------gallery delete --------------*/

$(document).on('submit', '#galleryDeleteForm', function(event) {
        event.preventDefault();
    
 var _data = $(this).serialize();

        $.ajax({
            url: base_url + '/guide/gallery/delete',
            type: 'POST',
            dataType: 'json',
            data: _data
        })
            .done(function(data) {
               
                if (data.stat == 'ok'){
                    location.reload();
                    //alert("Successfully Deleted.")
                }
                else{
                    
                    alert(data.msg);
                }

            });


}); 


/*----------------add guide license delete --------------*/

$(document).on('submit', '#addlicenseDeleteForm', function(event) {
        event.preventDefault();
    //$('#loader3', form).html('<img src="../../images/ajax-loader.gif" />       Please wait...');
 var _data = $(this).serialize();

        $.ajax({
            url: base_url + '/guide/license/delete',
            type: 'POST',
            dataType: 'json',
            data: _data
        })
            .done(function(data) {
                console.log(data.success);
              console.log("Data::"+data.html);
               
                            $('#successimgupload').hide();
                            $('#failedmsg').empty();
                            $('#failedmsg').removeClass('alert-success');
                            $('#failedmsg').addClass('alert alert-danger');
                            $('#failedmsg').append(data.success);
                            $('#failedmsg').show();
                            $('#licenseshow').html(data.html);
                   // $("#settings").load(window.location + "#settings");
                    //location.reload();
                

            })

            .fail(function(jqXHR, textStatus, errorThrown ) {
              var errors = jqXHR.responseJSON;
              var errorsHtml= '';
              $.each( errors, function( key, value ) {
                errorsHtml += '<p>' + value[0] + '</p>'; 
            });

                console.log(errorsHtml);
                            $('#userimage').hide();
                            $('#uservideos').hide();
                            $('#userbooking').hide();
                            $('#userlicense').hide();
                            $('#successmsg').hide();
                            $('#failedmsg').empty();
                            $('#failedmsg').addClass('alert alert-danger');
                            $('#failedmsg').append(errorsHtml);
                            $('#failedmsg').show();
                            $(window).scrollTop('#failedmsg');
              });


}); 

/*----------------add guide gallery delete --------------*/

$(document).on('submit', '#addgalleryDeleteForm', function(event) {
        event.preventDefault();
    //$('#loader3', form).html('<img src="../../images/ajax-loader.gif" />       Please wait...');
 var _data = $(this).serialize();

        $.ajax({
            url: base_url + '/guide/gallery/delete',
            type: 'POST',
            dataType: 'json',
            data: _data
        })
            .done(function(data) {
                console.log(data.success);
              console.log("Data::"+data.html);
               

                            $('#successimgupload').hide();
                            $('#failedmsg').empty();
                            $('#failedmsg').removeClass('alert-success');
                            $('#failedmsg').addClass('alert alert-danger');
                            $('#failedmsg').append(data.success);
                            $('#failedmsg').show();
                            $('#galleryshow').html(data.html);
                

            })

            .fail(function(jqXHR, textStatus, errorThrown ) {
              var errors = jqXHR.responseJSON;
              var errorsHtml= '';
              $.each( errors, function( key, value ) {
                errorsHtml += '<p>' + value[0] + '</p>'; 
            });

                console.log(errorsHtml);
                            $('#userimage').hide();
                            $('#uservideos').hide();
                            $('#userbooking').hide();
                            $('#userlicense').hide();
                            $('#successmsg').hide();
                            $('#failedmsg').empty();
                            $('#failedmsg').addClass('alert alert-danger');
                            $('#failedmsg').append(errorsHtml);
                            $('#failedmsg').show();
                            $(window).scrollTop('#failedmsg');
              });


}); 

/*----------------add guide videos delete --------------*/

$(document).on('submit', '#videoDeleteForm', function(event) {
        event.preventDefault();
    //$('#loader3', form).html('<img src="../../images/ajax-loader.gif" />       Please wait...');
 var _data = $(this).serialize();

        $.ajax({
            url: base_url + '/guide/videos/delete',
            type: 'POST',
            dataType: 'json',
            data: _data
        })
            .done(function(data) {
                console.log(data.success);
              console.log("Data::"+data.html);
               
                            $('#successimgupload').hide();
                            $('#failedmsg').empty();
                            $('#failedmsg').removeClass('alert-success');
                            $('#failedmsg').addClass('alert alert-danger');
                            $('#failedmsg').append(data.success);
                            $('#failedmsg').show();
                            $('#displayvideo').html(data.html);
                   // $("#settings").load(window.location + "#settings");
                    //location.reload();
                

            })

            .fail(function(jqXHR, textStatus, errorThrown ) {
              var errors = jqXHR.responseJSON;
              var errorsHtml= '';
              $.each( errors, function( key, value ) {
                errorsHtml += '<p>' + value[0] + '</p>'; 
            });

                console.log(errorsHtml);
                            $('#userimage').hide();
                            $('#uservideos').hide();
                            $('#userbooking').hide();
                            $('#userlicense').hide();
                            $('#successmsg').hide();
                            $('#failedmsg').empty();
                            $('#failedmsg').addClass('alert alert-danger');
                            $('#failedmsg').append(errorsHtml);
                            $('#failedmsg').show();
                            $(window).scrollTop('#failedmsg');
              });


}); 


/*----------------gallery caption edit --------------*/

$(document).on('submit', '#galleryCaptionEditForm', function(event) {
        event.preventDefault();
    
 var _data = $(this).serialize();

        $.ajax({
            url: base_url + '/guide/gallery/edit',
            type: 'POST',
            dataType: 'json',
            data: _data
        })
            .done(function(data) {
               
                if (data.stat == 'ok'){
                    location.reload();
                }
                else{
                    
                    alert(data.msg);
                }

            });


}); 



/*----------------video caption edit --------------*/

$(document).on('submit', '#videoCaptionEditForm', function(event) {
        event.preventDefault();
        var _data = $(this).serialize();

        $.ajax({
            url: base_url + '/guide/video/edit',
            type: 'POST',
            dataType: 'json',
            data: _data
        })
        .done(function(data) {
           
            if (data.stat == 'ok') {
                location.reload();
            }
            else{
                
                alert(data.stat);
            }

        });

});

/*-----guide banner upload js--------------*/

    $('#bannerPic').fileupload({
       
        dataType: 'json',
        dropZone: $(),

    add: function(e, data) {

                    var fileType = data.files[0].type;
                    var fileSize = data.files[0].size;
                    var extension = fileType.replace(/^.*\//, '');
                    
                    if(fileType.indexOf('image/') === 0) {
                        if(extension=='jpeg' || extension=='png'|| extension=='gif'|| extension=='jpg'){
                            if(fileSize<57671680){
                                $('.loader-overlay').show();
                                data.submit();
                            }else{
                                alert('Image size must be less than 2mb');
                            }
                     
                        }else{
                            alert('Only allowed jpeg, gif, jpg and png format');
                        }
                            
                    }else{
                        alert('Only allowed image format');
                    }
                        
                },
        done: function (e, data) {
            var returnJson = jQuery.parseJSON(data.jqXHR.responseText);
            $("#progress").remove();
            $('.profile-banner').css('background-image', 'url(' + returnJson.imgPath + ')');
            
            
            
        },

        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
        },
        fail: function(e,data){
            console.log(e);
            console.log(data);
            console.log('failed');

        },
        error: function(e, data) {

                   console.log(e);
                   console.log(data);
                   console.log('error');

                },
    });

    /*-----gallery upload form backend js--------------*/
    $('#galleryPicture').fileupload({
        dataType: 'json',
        dropZone: $(),
    add: function(e, data) {

                    $('.imgloader').show();

                    var fileType = data.files[0].type;
                    var fileSize = data.files[0].size;
                    var extension = fileType.replace(/^.*\//, '');
                    
                    if(fileType.indexOf('image/') === 0) {
                        if(extension=='jpeg' || extension=='png'|| extension=='gif'|| extension=='jpg'){
                            if(fileSize<57671680){
                                $('.loader-overlay').show();
                                data.submit();
                            }else{
                                alert('Image size must be less than 5mb');
                            }
                     
                        }else{
                            alert('Only allowed jpeg, gif, jpg and png format');
                        }
                            
                    }else{
                        alert('Only allowed image format');
                    }
                        
                },
        done: function (e, data) {
            var returnJson = jQuery.parseJSON(data.jqXHR.responseText);
            console.log(returnJson);
            console.log(returnJson.success);
            console.log(returnJson.html);
             $('.imgloader').hide();
             $('.loader-overlay').hide();
             $('.licenseInput').remove();
             $('#userimage').show();
             $('#uservideos').show();
             $('#userbooking').show();
             $('#userlicense').show();
             $('#failedmsg').hide();
             $('#successmsg').hide();
             $('#successimgupload').empty();
             $('#successimgupload').addClass('alert alert-success');
             $('#successimgupload').append(returnJson.success);
             $('#galleryshow').html(returnJson.html);
             $(window).scrollTop('#failedmsg');
            
        },
        fail: function(e,data){
             $('.loader-overlay').hide();
             $('.imgloader').hide();
            console.log(e);
            console.log(data);
            console.log('failed');

        },
        error: function(e, data) {
                     $('.loader-overlay').hide();
                     $('.imgloader').hide();
                   console.log(e);
                   console.log(data);
                   console.log('error');

                },
    });

    /*-----licence upload form backend js--------------*/
    $('#licensePicture').fileupload({
        dataType: 'json',
        dropZone: $(),
    add: function(e, data) {

                    $('.imglicloader').show();

                    var fileType = data.files[0].type;
                    var fileSize = data.files[0].size;
                    var extension = fileType.replace(/^.*\//, '');
                    
                    if(fileType.indexOf('image/') === 0) {
                        if(extension=='jpeg' || extension=='png'){
                            if(fileSize<2000099){
                                $('.loader-overlay').show();
                                data.submit();
                            }else{
                                alert('Image size must be less than 2mb');
                            }
                     
                        }else{
                            alert('Only allowed jpeg and png format');
                        }
                            
                    }else{
                        alert('Only allowed image format');
                    }
                        
                },
        done: function (e, data) {
            var returnJson = jQuery.parseJSON(data.jqXHR.responseText);
            console.log(returnJson);
             $('.imglicloader').hide();
             $('.loader-overlay').hide();
             $('.licenseInput').remove();
             $('#userimage').show();
             $('#uservideos').show();
             $('#userbooking').show();
             $('#userlicense').show();
             $('#failedmsg').hide();
             $('#successmsg').hide();
             $('#successimgupload').empty();
             $('#successimgupload').addClass('alert alert-success');
             $('#successimgupload').append(returnJson.success);
             $('#licenseshow').html(returnJson.html);
             $(window).scrollTop('#failedmsg');
            
        },
        fail: function(e,data){
             $('.loader-overlay').hide();
             $('.imglicloader').hide();
            console.log(e);
            console.log(data);
            console.log('failed');

        },
        error: function(e, data) {
                     $('.loader-overlay').hide();
                     $('.imglicloader').hide();
                   console.log(e);
                   console.log(data);
                   console.log('error');

                },
    });

});


