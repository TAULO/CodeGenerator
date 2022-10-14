// change event start
$('#product_image').change( function(event) {
    console.log('event--------',event)    
    var extensionProductImage = $('#product_image').val().substring($('#product_image').val().lastIndexOf('.') + 1)
    console.log('extensionProductImage---',extensionProductImage)
    if(extensionProductImage == 'png' || extensionProductImage == 'jpg' || extensionProductImage == 'jpeg'){
        console.log("if")
        $("#product_fake_image").fadeIn("fast").attr('src',URL.createObjectURL(event.target.files[0]));
    }else{
        console.log("else")
        console.log(" $('#product_image').val()----", $('#product_image').val())
        var extensionProductImage1 = $('#product_image').val().substring($('#product_image').val().lastIndexOf('.') + 1)
        console.log("extensionProductImage1 --",extensionProductImage1)
        if(extensionProductImage1 == ""){
            console.log("else if")
        }
        else if(extensionProductImage1 == 'png' || extensionProductImage1 == 'jpg' || extensionProductImage1 == 'jpeg' ){
            console.log("else ielse if")
            document.getElementById('product_fake_image').src = window.URL.createObjectURL(thisVal);
        }else{
            console.log("else else")
            $('#product_fake_image').attr("src","{{ MEDIA_URL }}{{value.image}}")
            $("#product_image").val("")
            swal("error","Please Choose PNG or JPG or JPEG Image","error")
            return false;
        }
    }
})


$(document).on("change", ".point", function() {
    var sum = 0;
    $(".point").each(function(){
        console.log('sum')
        sum += +$(this).val();
    });
    $(".total").html(sum);
});

function customRemoveElement(elem, fieldName, fieldId) {
    console.log('elem-->',elem)
    console.log('fieldName--->',fieldName)
    console.log('fieldId--->',fieldId)
    var elem_siblings = elem.siblings()
    console.log('ele siblings-->',elem_siblings.eq("1").html())
    // document.querySelector('#'+fieldId).onclick=function(){
    //         swal({
    //             title:"Are you sure?",
    //             text:"You will not be able to recover this imaginary file!",
    //             type:"warning",
    //             showCancelButton:true,
    //             confirmButtonClass:"btn-danger",
    //             confirmButtonText:"Yes, delete it!",
    //             cancelButtonText:"No, cancel plx!",
    //             closeOnConfirm:false,
    //             closeOnCancel:false
    //         },
    //         function(isConfirm){
    //             if(isConfirm){
    //                 swal("Deleted!","Your imaginary file has been deleted.","success");
    //                 var url = elem.attr('data-url')
    //                 console.log('url---',url)
                    // $.ajax({
                    //     url: url,
                    //     // type:"POST",
                    //     dataType:'text',
                    //     data:{
                    //         'email':email,
                    //     },
                    //   success: function(data){
                    //     console.log('success');
                    //     $('#loader').hide();
                    //     swal({
                    //         title: "Success!",
                    //         text: "Mail has been Sent Successfully",
                    //         icon: "success",
                    //         buttons: false
                    //       })
                    //     function redirect(){
                    //      window.location.href = "{% url 'login'  %}";
                    //     }
                    //     setTimeout(redirect, 2000); //2000 is equivalent to 2 seconds
                    //   },
                    //   error: function(){
                    //     console.log('error')
                    //     $('#loader').hide();
                    //     swal("Email-ID is not valid...Please Enter registered Email-ID..!!")
                    //   }
                    // });
        //         }else{
        //             swal("Cancelled","Your imaginary file is safe :)","error");
        //         }
        //     });
        // };
    if(fieldName == 'tech_file'){
        console.log('tech_file if')
        tech_exists_file_name = $('#tech-selected-files').val()
        tmpExistingFiles = tech_exists_file_name.split(', ')
        var removeItem = elem_siblings.eq("1").html();
        tmpExistingFiles = jQuery.grep(tmpExistingFiles, function(value) {
          return value != removeItem;
        });
        tech_exists_file_name = tmpExistingFiles.join(', ');
        $('#tech-selected-files').val(tech_exists_file_name);
        console.log('tech_exists_file_name-->',tech_exists_file_name)

        console.log('tech_file length--------', $('.tech_file').length)
        for(var i = 0; i<$('.tech_file').length-1;i++){
            console.log('in for loop remove-----',i)
            var tech_id = $('#'+fieldId)
            console.log('tech_id----',tech_id)
            var tech_val = tech_id.val()
            console.log('tech_val----',tech_val)
            var splitTechVal = tech_val.split('\\')
            console.log('splitTechVal[i]---',splitTechVal)
            console.log('splitTechVal---last---',splitTechVal.reverse()[0], typeof(splitTechVal.reverse()[0]))
            console.log('ele siblings-->',elem_siblings.eq("1").html())
            if(splitTechVal.reverse()[0] == elem_siblings.eq("1").html()){
                console.log('tech_id----if',tech_id)
                tech_id.remove()
                elem.parent().parent().remove();
                break
            }
        }
    }
    if(fieldName == 'video'){
        video_exists_file_name = $('#video-selected-files').val()
        tmpExistingFiles = video_exists_file_name.split(', ')
        var removeItem = elem_siblings.eq("1").html();
        tmpExistingFiles = jQuery.grep(tmpExistingFiles, function(value) {
          return value != removeItem;
        });
        video_exists_file_name = tmpExistingFiles.join(', ');
        $('#video-selected-files').val(video_exists_file_name);
        console.log('video_exists_file_name-->',video_exists_file_name)

        console.log('video length--------', $('.video').length)
        for(var i = 0; i<$('.video').length-1;i++){
            console.log('in for loop remove-----',i)
            var video_id = $('#'+fieldId)
            console.log('video_id----',video_id)
            var video_val = video_id.val()
            console.log('video_val----',video_val)
            var splitVideoVal = video_val.split('\\')
            console.log('splitVideoVal[i]---',splitVideoVal)
            console.log('splitVideoVal---last---',splitVideoVal.reverse()[0], typeof(splitVideoVal.reverse()[0]))
            console.log('ele siblings-->',elem_siblings.eq("1").html())
            if(splitVideoVal.reverse()[0] == elem_siblings.eq("1").html()){
                console.log('video_id----if',video_id)
                video_id.remove()
                elem.parent().parent().remove();
                break
            }
        }
    }
    if(fieldName == 'app_file'){
        app_exists_file_name = $('#app-selected-files').val()
        tmpExistingFiles = app_exists_file_name.split(', ')
        var removeItem = elem_siblings.eq("1").html();
        tmpExistingFiles = jQuery.grep(tmpExistingFiles, function(value) {
          return value != removeItem;
        });
        app_exists_file_name = tmpExistingFiles.join(', ');
        $('#app-selected-files').val(app_exists_file_name);
        console.log('app_exists_file_name-->',app_exists_file_name)

        console.log('app length--------', $('.app_file').length)
        for(var i = 0; i<$('.app_file').length-1;i++){
            console.log('in for loop remove-----',i)
            var app_id = $('#'+fieldId)
            console.log('app_id----',app_id)
            var app_val = app_id.val()
            console.log('app_val----',app_val)
            var splitAppVal = app_val.split('\\')
            console.log('splitAppVal[i]---',splitAppVal)
            console.log('splitAppVal---last---',splitAppVal.reverse()[0], typeof(splitAppVal.reverse()[0]))
            console.log('ele siblings-->',elem_siblings.eq("1").html())
            if(splitAppVal.reverse()[0] == elem_siblings.eq("1").html()){
                console.log('app_id----if',app_id)
                app_id.remove()
                elem.parent().parent().remove();
                break
            }
        }
    }
    if(fieldName == 'safety_file'){
        safety_exists_file_name = $('#safety-selected-files').val()
        tmpExistingFiles = safety_exists_file_name.split(', ')
        var removeItem = elem_siblings.eq("1").html();
        tmpExistingFiles = jQuery.grep(tmpExistingFiles, function(value) {
          return value != removeItem;
        });
        safety_exists_file_name = tmpExistingFiles.join(', ');
        $('#safety-selected-files').val(safety_exists_file_name);
        console.log('safety_exists_file_name-->',safety_exists_file_name)

        console.log('safety length--------', $('.safety_file').length)
        for(var i = 0; i<$('.safety_file').length-1;i++){
            console.log('in for loop remove-----',i)
            var safety_id = $('#'+fieldId)
            console.log('safety_id----',safety_id)
            var safety_val = safety_id.val()
            console.log('safety_val----',safety_val)
            var splitSafetyVal = safety_val.split('\\')
            console.log('splitSafetyVal[i]---',splitSafetyVal)
            console.log('splitSafetyVal---last---',splitSafetyVal.reverse()[0], typeof(splitSafetyVal.reverse()[0]))
            console.log('ele siblings-->',elem_siblings.eq("1").html())
            if(splitSafetyVal.reverse()[0] == elem_siblings.eq("1").html()){
                console.log('safety_id----if',safety_id)
                safety_id.remove()
                elem.parent().parent().remove();
                break
            }
        }
    }
    if(fieldName == 'certificate_file'){
        certificate_exists_file_name = $('#certificate-selected-files').val()
        tmpExistingFiles = certificate_exists_file_name.split(', ')
        var removeItem = elem_siblings.eq("1").html();
        tmpExistingFiles = jQuery.grep(tmpExistingFiles, function(value) {
          return value != removeItem;
        });
        certificate_exists_file_name = tmpExistingFiles.join(', ');
        $('#certificate-selected-files').val(certificate_exists_file_name);
        console.log('certificate_exists_file_name-->',certificate_exists_file_name)

        console.log('certificate length--------', $('.certificate_file').length)
        for(var i = 0; i < $('.certificate_file').length-1;i++){
            console.log('in for loop remove-----',i)
            var certificate_id = $('#'+fieldId)
            console.log('certificate_id----',certificate_id)
            var certificate_val = certificate_id.val()
            console.log('certificate_val----',certificate_val)
            var splitCertificateVal = certificate_val.split('\\')
            console.log('splitCertificateVal[i]---',splitCertificateVal)
            console.log('splitCertificateVal---last---',splitCertificateVal.reverse()[0], typeof(splitCertificateVal.reverse()[0]))
            console.log('ele siblings-->',elem_siblings.eq("1").html())
            if(splitCertificateVal.reverse()[0] == elem_siblings.eq("1").html()){
                console.log('certificate_id----if',certificate_id)
                certificate_id.remove()
                elem.parent().parent().remove();
                break
            }
        }
    }
    if(fieldName == 'equipment_file'){
        equipment_exists_file_name = $('#equipment-selected-files').val()
        console.log('equipment_exists_file_name : ', equipment_exists_file_name);
        tmpExistingFiles = equipment_exists_file_name.split(', ')
        var removeItem = elem_siblings.eq("1").html();
        tmpExistingFiles = jQuery.grep(tmpExistingFiles, function(value) {
          return value != removeItem;
        });
        equipment_exists_file_name = tmpExistingFiles.join(', ');
        $('#equipment-selected-files').val(equipment_exists_file_name);
        for(var i = 0; i < $('.equipment_file').length-1;i++){
            var certificate_id = $('#'+fieldId)
            var certificate_val = certificate_id.val()
            var splitCertificateVal = certificate_val.split('\\')
            if(splitCertificateVal.reverse()[0] == elem_siblings.eq("1").html()){
                certificate_id.remove()
                elem.parent().parent().remove();
                break
            }
        }
    }
    if(fieldName == 'industry_file'){
        industry_exists_file_name = $('#industry-selected-files').val()
        console.log('industry_exists_file_name : ', industry_exists_file_name);
        tmpExistingFiles = industry_exists_file_name.split(', ')
        var removeItem = elem_siblings.eq("1").html();
        tmpExistingFiles = jQuery.grep(tmpExistingFiles, function(value) {
          return value != removeItem;
        });
        industry_exists_file_name = tmpExistingFiles.join(', ');
        $('#industry-selected-files').val(industry_exists_file_name);
        for(var i = 0; i < $('.industry_file').length-1;i++){
            var certificate_id = $('#'+fieldId)
            var certificate_val = certificate_id.val()
            var splitCertificateVal = certificate_val.split('\\')
            if(splitCertificateVal.reverse()[0] == elem_siblings.eq("1").html()){
                certificate_id.remove()
                elem.parent().parent().remove();
                break
            }
        }
    }
    if(fieldName == 'building_file'){
        building_exists_file_name = $('#building-selected-files').val()
        console.log('building_exists_file_name : ', building_exists_file_name);
        tmpExistingFiles = building_exists_file_name.split(', ')
        var removeItem = elem_siblings.eq("1").html();
        tmpExistingFiles = jQuery.grep(tmpExistingFiles, function(value) {
          return value != removeItem;
        });
        building_exists_file_name = tmpExistingFiles.join(', ');
        $('#building-selected-files').val(building_exists_file_name);
        for(var i = 0; i < $('.building_file').length-1;i++){
            var certificate_id = $('#'+fieldId)
            var certificate_val = certificate_id.val()
            var splitCertificateVal = certificate_val.split('\\')
            if(splitCertificateVal.reverse()[0] == elem_siblings.eq("1").html()){
                certificate_id.remove()
                elem.parent().parent().remove();
                break
            }
        }
    }
    if(fieldName == 'quality_file'){
        quality_exists_file_name = $('#quality-selected-files').val()
        console.log('quality_exists_file_name : ', quality_exists_file_name);
        tmpExistingFiles = building_exists_file_name.split(', ')
        var removeItem = elem_siblings.eq("1").html();
        tmpExistingFiles = jQuery.grep(tmpExistingFiles, function(value) {
          return value != removeItem;
        });
        quality_exists_file_name = tmpExistingFiles.join(', ');
        $('#quality-selected-files').val(quality_exists_file_name);
        for(var i = 0; i < $('.quality_file').length-1;i++){
            var certificate_id = $('#'+fieldId)
            var certificate_val = certificate_id.val()
            var splitCertificateVal = certificate_val.split('\\')
            if(splitCertificateVal.reverse()[0] == elem_siblings.eq("1").html()){
                certificate_id.remove()
                elem.parent().parent().remove();
                break
            }
        }
    }
}

var tech_exists_file_name = ''
var safety_exists_file_name = ''
var app_exists_file_name = ''
var certificate_exists_file_name = ''
var equipment_exists_file_name = ''
var industry_exists_file_name = ''
var building_exists_file_name = ''
var quality_exists_file_name = ''
var video_exists_file_name = ''
var selectedFiles_name = ''
var splitExists_file_name;
var res = false

function check_file(id){

    var selectedFiles = $('#'+id)[0].files;
    console.log('selectedFiles-->',selectedFiles)
    selectedFiles_name = selectedFiles[0].name;
    console.log('selectedFiles_name-->',selectedFiles_name)
    var splitId = id.split('_')
    console.log('splitId-----',splitId)
    if(splitId[0] == "tech"){
        console.log('tech_exists_file_name-->',tech_exists_file_name)
        splitExists_file_name = tech_exists_file_name.split(', ');
    }
    if(splitId[0] == "app"){
        console.log('app_exists_file_name-->',app_exists_file_name)
        splitExists_file_name = app_exists_file_name.split(', ');
    }
    if(splitId[0] == "safety"){
        console.log('safety_exists_file_name-->',safety_exists_file_name)
        splitExists_file_name = safety_exists_file_name.split(', ');
    }
    if(splitId[0] == "certificate"){
        console.log('certificate_exists_file_name-->',certificate_exists_file_name)
        splitExists_file_name = certificate_exists_file_name.split(', ');
    }
    if(splitId[0] == "equipment"){
        console.log('equipment_exists_file_name-->',equipment_exists_file_name)
        splitExists_file_name = equipment_exists_file_name.split(', ');
    }
    if(splitId[0] == "industry"){
        console.log('industry_exists_file_name-->',industry_exists_file_name)
        splitExists_file_name = industry_exists_file_name.split(', ');
    }
    if(splitId[0] == "building"){
        console.log('building_exists_file_name-->',building_exists_file_name)
        splitExists_file_name = building_exists_file_name.split(', ');
    }
    if(splitId[0] == "quality"){
        console.log('quality_exists_file_name-->',quality_exists_file_name)
        splitExists_file_name = quality_exists_file_name.split(', ');
    }
    if(splitId[0] == "video"){
        console.log('video_exists_file_name-->',video_exists_file_name)
        splitExists_file_name = video_exists_file_name.split(', ');
    }
    console.log('splitExists_file_name.length--->',splitExists_file_name.length);
    console.log('splitExists_file_name___________',splitExists_file_name)
    console.log('selectedFiles_name------------',selectedFiles_name)

    if(splitExists_file_name.includes(selectedFiles_name)){
        $('#'+id).val('')
        swal("error","File already exists","error");
        res = false
    }else{
        res = true
    }

    // for(var i = 0; i<=splitExists_file_name.length - 1; i++){
    //     console.log('in for loop---->',i)
    //     console.log('splitExists_file_name'+[i],splitExists_file_name[i],typeof(splitExists_file_name[i]),'====== selectedFiles_name--->',selectedFiles_name,typeof(selectedFiles_name))

    //     if(splitExists_file_name[i] == selectedFiles_name){
    //         $('#'+id).val('')
    //         swal("File already exists");
    //         res = false;
    //         console.log('res--',res)
    //         continue;
    //         // break;
    //     }else{
    //         console.log('not match')
    //         if(splitExists_file_name[i] != selectedFiles_name){
    //             res = true;
    //             console.log('res--',res)
    //         }
    //         // res=true
    //         // console.log('res--',res)
    //         continue;
    //     }
    // }
}
// technical  add file
var t = 0
var inc = 0
var change_n = 0

function techFile(id) {

    check_file(id);
    console.log('res-->',res)
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        inc = newTmpId;
        change_n++
        $('#change_n').val(change_n);
        var techSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        if(techSelectedFiles.length != 0 && extension != 'pdf'){
            swal("error","Please Choose PDF File","error")
        }
        else{
            for(i = 0; i < techSelectedFiles.length; i++) {
                t++
                var tech_file_ul = $('#tech_file_ul')
                var tech_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'tech_file','tech_file_`+(t-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon"><i class="icofont icofont-file-pdf"></i></div><div id="tech_file_name_` + t + `" class="file_name"></div></div></li>`
                
                tech_file_ul.append(tech_li_html)
                $('#tech_file_name_'+t).text(techSelectedFiles[i].name)
                var techTmpSelectedFiles = $('#tech-selected-files').val();
                if(techTmpSelectedFiles == '') {
                    techTmpSelectedFiles = techSelectedFiles[i].name;
                } else {
                    techTmpSelectedFiles += ', '+ techSelectedFiles[i].name;
                }
                $('#tech-selected-files').val(techTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            inc++
            var btn = `<input id="tech_file_`+inc+`" name="technical_datasheet_files_`+inc+`" type="file" class="custom-file-input tech_file" onchange="techFile('tech_file_`+inc+`');" accept=".pdf"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        console.log('ookokok in change',$('#tech_file_'+$('#change_n').val()));
        tech_exists_file_name = $('#tech-selected-files').val()
        console.log('tech_exists_file_name-->',tech_exists_file_name)
    }
}

// technical edit file

var edit_t = 0
var edit_inc = 0
var edit_change_n = 0

function editTechFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        console.log('newTmpId-->',newTmpId);
        edit_inc = newTmpId;
        edit_change_n++
        $('#change_n').val(edit_change_n);
        console.log('edit_change_n-->',edit_change_n)
        var techSelectedFiles = $('#'+id)[0].files;
        console.log('techSelectedFiles-->',techSelectedFiles)
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        console.log('extension-->',extension)
        if(techSelectedFiles.length != 0 && extension != 'pdf'){
            swal("error","Please Choose PDF File","error")
        }
        else{
            for(i = 0; i < techSelectedFiles.length; i++) {
                edit_t++
                var tech_file_ul = $('#tech_file_ul')
                var tech_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'tech_file','tech_file_`+(edit_t-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon"><i class="icofont icofont-file-pdf"></i></div><div id="tech_file_name_` + edit_t + `" class="file_name"></div></div></li>`
                
                tech_file_ul.append(tech_li_html)
                $('#tech_file_name_'+edit_t).text(techSelectedFiles[i].name)
                var techTmpSelectedFiles = $('#tech-selected-files').val();
                if(techTmpSelectedFiles == '') {
                    techTmpSelectedFiles = techSelectedFiles[i].name;
                } else {
                    techTmpSelectedFiles += ', '+ techSelectedFiles[i].name;
                }
                $('#tech-selected-files').val(techTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            edit_inc++
            var btn = `<input id="tech_file_`+edit_inc+`" name="technical_datasheet_files_`+edit_inc+`" type="file" class="custom-file-input tech_file" onchange="editTechFile('tech_file_`+edit_inc+`');" accept=".pdf"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        console.log('ookokok in change',$('#tech_file_'+$('#change_n').val()));
        tech_exists_file_name = $('#tech-selected-files').val()
        console.log('tech_exists_file_name-->',tech_exists_file_name)
    }
}

// application  add file

var a = 0
var a_inc = 0
var a_change_n = 0
function appFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        a_inc = newTmpId;
        a_change_n++
        $('#change_n_app').val(a_change_n);
        var appSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        if(appSelectedFiles.length != 0 && extension != 'pdf'){
            swal("error","Please Choose PDF File","error")
        }
        else{
            for(i = 0; i < appSelectedFiles.length; i++) {
                a++
                var app_file_ul = $('#app_file_ul')
                var app_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'app_file','app_file_`+(a-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon"><i class="icofont icofont-file-pdf"></i></div><div id="app_file_name_` + a + `" class="file_name"></div></div></li>`
                
                app_file_ul.append(app_li_html)
                $('#app_file_name_'+a).text(appSelectedFiles[i].name)
                var appTmpSelectedFiles = $('#app-selected-files').val();
                if(appTmpSelectedFiles == '') {
                    appTmpSelectedFiles = appSelectedFiles[i].name;
                } else {
                    appTmpSelectedFiles += ', '+ appSelectedFiles[i].name;
                }
                $('#app-selected-files').val(appTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            a_inc++
            var btn = `<input id="app_file_`+a_inc+`" name="application_guideline_files_`+a_inc+`" type="file" class="custom-file-input app_file" onchange="appFile('app_file_`+a_inc+`');" accept=".pdf"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        console.log('ookokok in change',$('#app_file_'+$('#change_n').val()));
        app_exists_file_name = $('#app-selected-files').val()
        console.log('app_exists_file_name-->',app_exists_file_name)
    }
}

// application edit file

var edit_a = 0
var edit_inc_a = 0
var edit_change_n_a = 0
function editAppFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        edit_inc_a = newTmpId;
        edit_change_n_a++
        $('#change_n_app').val(edit_change_n_a);
        var appSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        if(appSelectedFiles.length != 0 && extension != 'pdf'){
            swal("error","Please Choose PDF File","error")
        }
        else{
            for(i = 0; i < appSelectedFiles.length; i++) {
                edit_a++
                var app_file_ul = $('#app_file_ul')
                var app_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'app_file','app_file_`+(edit_a-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon"><i class="icofont icofont-file-pdf"></i></div><div id="app_file_name_` + edit_a + `" class="file_name"></div></div></li>`
                
                app_file_ul.append(app_li_html)
                $('#app_file_name_'+edit_a).text(appSelectedFiles[i].name)
                var appTmpSelectedFiles = $('#app-selected-files').val();
                if(appTmpSelectedFiles == '') {
                    appTmpSelectedFiles = appSelectedFiles[i].name;
                } else {
                    appTmpSelectedFiles += ', '+ appSelectedFiles[i].name;
                }
                $('#app-selected-files').val(appTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            edit_inc_a++
            var btn = `<input id="app_file_`+edit_inc_a+`" name="application_guideline_files_`+edit_inc_a+`" type="file" class="custom-file-input app_file" onchange="editAppFile('app_file_`+edit_inc_a+`');" accept=".pdf"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        console.log('ookokok in change',$('#app_file_'+$('#change_n').val()));
        app_exists_file_name = $('#app-selected-files').val()
        console.log('app_exists_file_name-->',app_exists_file_name)
    }
}

// video  add file

var v = 0
var v_inc = 0
var v_change_n = 0
function videoFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        v_inc = newTmpId;
        v_change_n++
        $('#change_n_video').val(v_change_n);
        var videoSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        if(videoSelectedFiles.length != 0 && extension != 'mp4'){
            swal("error","Please Choose MP4 Video","error")
        }
        else{
            for(i = 0; i < videoSelectedFiles.length; i++) {
                v++
                var video_ul = $('#video_ul')
                var video_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'video','video_`+(v-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon"><i class="icofont icofont-video"></i></div><div id="video_name_` + v + `" class="file_name"></div></div></li>`
                
                video_ul.append(video_li_html)
                $('#video_name_'+v).text(videoSelectedFiles[i].name)
                var videoTmpSelectedFiles = $('#video-selected-files').val();
                if(videoTmpSelectedFiles == '') {
                    videoTmpSelectedFiles = videoSelectedFiles[i].name;
                } else {
                    videoTmpSelectedFiles += ', '+ videoSelectedFiles[i].name;
                }
                $('#video-selected-files').val(videoTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            v_inc++
            var btn = `<input id="video_`+v_inc+`" name="video_`+v_inc+`" type="file" class="custom-file-input video" onchange="videoFile('video_`+v_inc+`');" accept="video/*"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        console.log('ookokok in change',$('#video_'+$('#change_n').val()));
        video_exists_file_name = $('#video-selected-files').val()
        console.log('video_exists_file_name-->',video_exists_file_name)
    }
}

// video edit file

var edit_v = 0
var edit_inc_v = 0
var edit_change_n_v = 0
function editVideoFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        edit_inc_v = newTmpId;
        edit_change_n_v++
        $('#change_n_video').val(edit_change_n_v);
        var videoSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        if(videoSelectedFiles.length != 0 && extension != 'mp4'){
            swal("error","Please Choose PDF File","error")
        }
        else{
            for(i = 0; i < videoSelectedFiles.length; i++) {
                edit_v++
                var video_ul = $('#video_ul')
                var video_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'video','video_`+(edit_v-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon"><i class="icofont icofont-video"></i></div><div id="video_name_` + edit_v + `" class="file_name"></div></div></li>`
                
                video_ul.append(video_li_html)
                $('#video_name_'+edit_v).text(videoSelectedFiles[i].name)
                var videoTmpSelectedFiles = $('#video-selected-files').val();
                if(videoTmpSelectedFiles == '') {
                    videoTmpSelectedFiles = videoSelectedFiles[i].name;
                } else {
                    videoTmpSelectedFiles += ', '+ videoSelectedFiles[i].name;
                }
                $('#video-selected-files').val(videoTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            edit_inc_v++
            var btn = `<input id="video_`+edit_inc_v+`" name="video_`+edit_inc_v+`" type="file" class="custom-file-input video" onchange="editVideoFile('video_`+edit_inc_v+`');" accept="video/*"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        console.log('ookokok in change',$('#video_'+$('#change_n').val()));
        video_exists_file_name = $('#video-selected-files').val()
        console.log('video_exists_file_name-->',video_exists_file_name)
    }
}



// safety  add file

var s = 0
var s_inc = 0
var s_change_n = 0
function safetyFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        s_inc = newTmpId;
        s_change_n++
        $('#change_n_safety').val(s_change_n);
        var safetySelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        var allExtension = ['pdf','jpg','png','jpeg']
        if(safetySelectedFiles.length != 0 && !allExtension.includes(extension)){
            swal("error","Please Choose PDF or JPG or JPEG or PNG File","error")
        }
        // else{
        //     for(i = 0; i < safetySelectedFiles.length; i++) {
        //         s++
        //         var safety_file_ul = $('#safety_file_ul')
        //         var safety_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'safety_file','safety_file_`+(s-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon"><i class="icofont icofont-file-pdf"></i></div><div id="safety_file_name_` + s + `" class="file_name"></div></div></li>`
                
        //         safety_file_ul.append(safety_li_html)
        //         $('#safety_file_name_'+s).text(safetySelectedFiles[i].name)
        //         var safetyTmpSelectedFiles = $('#safety-selected-files').val();
        //         if(safetyTmpSelectedFiles == '') {
        //             safetyTmpSelectedFiles = safetySelectedFiles[i].name;
        //         } else {
        //             safetyTmpSelectedFiles += ', '+ safetySelectedFiles[i].name;
        //         }
        //         $('#safety-selected-files').val(safetyTmpSelectedFiles);
        //     }
        //     $('#'+id).css('display','none')
        //     s_inc++
        //     var btn = `<input id="safety_file_`+s_inc+`" name="safety_datasheet_files_`+s_inc+`" type="file" class="custom-file-input safety_file" onchange="safetyFile('safety_file_`+s_inc+`');" accept=".pdf"><label>Upload</label>`
        //     $('#'+id).parent().append(btn)
        // }
        
        else{
            for(i = 0; i < safetySelectedFiles.length; i++) {
                s++
                var safety_file_ul = $('#safety_file_ul')
                var extensionIcon = '';
                if(extension == 'pdf'){
                    extensionIcon = `<i class="icofont icofont-file-pdf"></i>`
                } else {
                    extensionIcon = `<i class="icofont icofont-ui-image"></i>`
                }
                var safety_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'safety_file','safety_file_`+(eq-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon">`+extensionIcon+`</div><div id="safety_file_name_` + eq + `" class="file_name"></div></div></li>`
                safety_file_ul.append(safety_li_html)
                $('#safety_file_name_'+s).text(safetySelectedFiles[i].name)
                var safetyTmpSelectedFiles = $('#safety-selected-files').val();
                console.log('safetyTmpSelectedFiles : ', safetyTmpSelectedFiles);
                if(safetyTmpSelectedFiles == '') {
                    safetyTmpSelectedFiles = safetySelectedFiles[i].name;
                } else {
                    safetyTmpSelectedFiles += ', '+ safetySelectedFiles[i].name;
                }
                console.log('safetyTmpSelectedFiles : ', safetyTmpSelectedFiles);
                $('#safety-selected-files').val(safetyTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            s_inc++
            // var btn = `<input id="safety_file_`+s_inc+`" name="safety_datasheet_files_`+s_inc+`" type="file" class="custom-file-input safety_file" onchange="safetyFile('safety_file_`+s_inc+`');" accept=".pdf"><label>Upload</label>`
            //     $('#'+id).parent().append(btn)
            var btn = `<input id="safety_file_`+s_inc+`" name="safety_datasheet_files_`+c_inc+`" type="file" class="custom-file-input safety_file" onchange="safetyFile('safety_file_`+s_inc+`');" accept=".pdf,image/*"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        console.log('ookokok in change',$('#safety_file_'+$('#change_n').val()));
        safety_exists_file_name = $('#safety-selected-files').val()
        console.log('safety_exists_file_name-->',safety_exists_file_name)
    }
}

// safety edit file

var edit_s = 0
var edit_inc_s = 0
var edit_change_n_s = 0
function editSafetyFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        edit_inc_s = newTmpId;
        edit_change_n_s++
        $('#change_n_safety').val(edit_change_n_s);
        var safetySelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        if(safetySelectedFiles.length != 0 && extension != 'pdf'){
            swal("error","Please Choose PDF File","error")
        }
        else{
            for(i = 0; i < safetySelectedFiles.length; i++) {
                edit_s++
                var safety_file_ul = $('#safety_file_ul')
                var safety_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'safety_file','safety_file_`+(edit_s-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon"><i class="icofont icofont-file-pdf"></i></div><div id="safety_file_name_` + edit_s + `" class="file_name"></div></div></li>`
                
                safety_file_ul.append(safety_li_html)
                $('#safety_file_name_'+edit_s).text(safetySelectedFiles[i].name)
                var safetyTmpSelectedFiles = $('#safety-selected-files').val();
                if(safetyTmpSelectedFiles == '') {
                    safetyTmpSelectedFiles = safetySelectedFiles[i].name;
                } else {
                    safetyTmpSelectedFiles += ', '+ safetySelectedFiles[i].name;
                }
                $('#safety-selected-files').val(safetyTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            edit_inc_s++
            var btn = `<input id="safety_file_`+edit_inc_s+`" name="safety_datasheet_files_`+edit_inc_s+`" type="file" class="custom-file-input safety_file" onchange="editSafetyFile('safety_file_`+edit_inc_s+`');" accept=".pdf"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        console.log('ookokok in change',$('#safety_file_'+$('#change_n').val()));
        safety_exists_file_name = $('#safety-selected-files').val()
        console.log('safety_exists_file_name-->',safety_exists_file_name)
    }
}


// certificate  add file

var c = 0
var c_inc = 0
var c_change_n = 0

function certificateFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        c_inc = newTmpId;
        c_change_n++
        $('#change_n_certificate').val(c_change_n);
        var certificateSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        var allExtension = ['pdf','jpg','png','jpeg']
        if(certificateSelectedFiles.length != 0 && !allExtension.includes(extension)){
            console.log('extension-----',extension)
            swal("error","Please Choose PDF or JPG or JPEG or PNG File","error")
        }else{
            for(i = 0; i < certificateSelectedFiles.length; i++) {
                c++
                var certificate_file_ul = $('#certificate_file_ul')
                var extensionIcon = '';
                if(extension == 'pdf'){
                    extensionIcon = `<i class="icofont icofont-file-pdf"></i>`
                } else {
                    extensionIcon = `<i class="icofont icofont-ui-image"></i>`
                }
                var certificate_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'certificate_file','certificate_file_`+(c-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon">`+extensionIcon+`</div><div id="certificate_file_name_` + c + `" class="file_name"></div></div></li>`
                certificate_file_ul.append(certificate_li_html)
                $('#certificate_file_name_'+c).text(certificateSelectedFiles[i].name)
                var certificateTmpSelectedFiles = $('#certificate-selected-files').val();
                console.log('certificateTmpSelectedFiles : ', certificateTmpSelectedFiles);
                if(certificateTmpSelectedFiles == '') {
                    certificateTmpSelectedFiles = certificateSelectedFiles[i].name;
                } else {
                    certificateTmpSelectedFiles += ', '+ certificateSelectedFiles[i].name;
                }
                console.log('certificateTmpSelectedFiles : ', certificateTmpSelectedFiles);
                $('#certificate-selected-files').val(certificateTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            c_inc++
            var btn = `<input id="certificate_file_`+c_inc+`" name="certificate_file_`+c_inc+`" type="file" class="custom-file-input certificate_file" onchange="certificateFile('certificate_file_`+c_inc+`');" accept=".pdf,image/*"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        console.log('ookokok in change',$('#certificate_file_'+$('#change_n').val()));
        certificate_exists_file_name = $('#certificate-selected-files').val()
        console.log('certificate_exists_file_name-->',certificate_exists_file_name)
    }
}

// equipment  add file

var eq = 0
var eq_inc = 0
var eq_change_n = 0

function equipmentFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        eq_inc = newTmpId;
        eq_change_n++
        $('#change_n_equipment').val(eq_change_n);
        var certificateSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        var allExtension = ['pdf','jpg','png','jpeg']
        if(certificateSelectedFiles.length != 0 && !allExtension.includes(extension)){
            swal("error","Please Choose PDF or JPG or JPEG or PNG File","error")
        }else{
            for(i = 0; i < certificateSelectedFiles.length; i++) {
                eq++
                var certificate_file_ul = $('#equipment_file_ul')
                var extensionIcon = '';
                if(extension == 'pdf'){
                    extensionIcon = `<i class="icofont icofont-file-pdf"></i>`
                } else {
                    extensionIcon = `<i class="icofont icofont-ui-image"></i>`
                }
                var certificate_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'equipment_file','equipment_file_`+(eq-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon">`+extensionIcon+`</div><div id="equipment_file_name_` + eq + `" class="file_name"></div></div></li>`
                certificate_file_ul.append(certificate_li_html)
                $('#equipment_file_name_'+eq).text(certificateSelectedFiles[i].name)
                var certificateTmpSelectedFiles = $('#equipment-selected-files').val();
                console.log('certificateTmpSelectedFiles : ', certificateTmpSelectedFiles);
                if(certificateTmpSelectedFiles == '') {
                    certificateTmpSelectedFiles = certificateSelectedFiles[i].name;
                } else {
                    certificateTmpSelectedFiles += ', '+ certificateSelectedFiles[i].name;
                }
                console.log('certificateTmpSelectedFiles : ', certificateTmpSelectedFiles);
                $('#equipment-selected-files').val(certificateTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            eq_inc++
            var btn = `<input id="equipment_file_`+eq_inc+`" name="equipment_file_`+eq_inc+`" type="file" class="custom-file-input equipment_file" onchange="equipmentFile('equipment_file_`+eq_inc+`');" accept=".pdf,image/*"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        equipment_exists_file_name = $('#equipment-selected-files').val()
    }
}

// industry  add file

var ind = 0
var ind_inc = 0
var ind_change_n = 0

function industryFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        ind_inc = newTmpId;
        ind_change_n++
        $('#change_n_industry').val(ind_change_n);
        var certificateSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        var allExtension = ['pdf','jpg','png','jpeg']
        if(certificateSelectedFiles.length != 0 && !allExtension.includes(extension)){
            swal("error","Please Choose PDF or JPG or JPEG or PNG File","error")
        }else{
            for(i = 0; i < certificateSelectedFiles.length; i++) {
                ind++
                var certificate_file_ul = $('#industry_file_ul')
                var extensionIcon = '';
                if(extension == 'pdf'){
                    extensionIcon = `<i class="icofont icofont-file-pdf"></i>`
                } else {
                    extensionIcon = `<i class="icofont icofont-ui-image"></i>`
                }
                var certificate_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'industry_file','industry_file_`+(ind-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon">`+extensionIcon+`</div><div id="industry_file_name_` + ind + `" class="file_name"></div></div></li>`
                certificate_file_ul.append(certificate_li_html)
                $('#industry_file_name_'+ind).text(certificateSelectedFiles[i].name)
                var certificateTmpSelectedFiles = $('#industry-selected-files').val();
                console.log('certificateTmpSelectedFiles : ', certificateTmpSelectedFiles);
                if(certificateTmpSelectedFiles == '') {
                    certificateTmpSelectedFiles = certificateSelectedFiles[i].name;
                } else {
                    certificateTmpSelectedFiles += ', '+ certificateSelectedFiles[i].name;
                }
                console.log('certificateTmpSelectedFiles : ', certificateTmpSelectedFiles);
                $('#industry-selected-files').val(certificateTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            ind_inc++
            var btn = `<input id="industry_file_`+ind_inc+`" name="industry_file_`+ind_inc+`" type="file" class="custom-file-input industry_file" onchange="industryFile('industry_file_`+ind_inc+`');" accept=".pdf,image/*"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        industry_exists_file_name = $('#industry-selected-files').val()
    }
}

// Building  add file

var bld = 0
var bld_inc = 0
var bld_change_n = 0

function buildingFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        bld_inc = newTmpId;
        bld_change_n++
        $('#change_n_building').val(bld_change_n);
        var certificateSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        var allExtension = ['pdf','jpg','png','jpeg']
        if(certificateSelectedFiles.length != 0 && !allExtension.includes(extension)){
            swal("error","Please Choose PDF or JPG or JPEG or PNG File","error")
        }else{
            for(i = 0; i < certificateSelectedFiles.length; i++) {
                bld++
                var certificate_file_ul = $('#building_file_ul')
                var extensionIcon = '';
                if(extension == 'pdf'){
                    extensionIcon = `<i class="icofont icofont-file-pdf"></i>`
                } else {
                    extensionIcon = `<i class="icofont icofont-ui-image"></i>`
                }
                var certificate_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'building_file','building_file_`+(bld-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon">`+extensionIcon+`</div><div id="building_file_name_` + bld + `" class="file_name"></div></div></li>`
                certificate_file_ul.append(certificate_li_html)
                $('#building_file_name_'+bld).text(certificateSelectedFiles[i].name)
                var certificateTmpSelectedFiles = $('#building-selected-files').val();
                console.log('certificateTmpSelectedFiles : ', certificateTmpSelectedFiles);
                if(certificateTmpSelectedFiles == '') {
                    certificateTmpSelectedFiles = certificateSelectedFiles[i].name;
                } else {
                    certificateTmpSelectedFiles += ', '+ certificateSelectedFiles[i].name;
                }
                console.log('certificateTmpSelectedFiles : ', certificateTmpSelectedFiles);
                $('#building-selected-files').val(certificateTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            bld_inc++
            var btn = `<input id="building_file_`+bld_inc+`" name="building_file_`+bld_inc+`" type="file" class="custom-file-input building_file" onchange="buildingFile('building_file_`+bld_inc+`');" accept=".pdf,image/*"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        building_exists_file_name = $('#building-selected-files').val()
    }
}

// Quality  add file

var qua = 0
var qua_inc = 0
var qua_change_n = 0

function qualityFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        qua_inc = newTmpId;
        qua_change_n++
        $('#change_n_quality').val(qua_change_n);
        var certificateSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        var allExtension = ['pdf','jpg','png','jpeg']
        if(certificateSelectedFiles.length != 0 && !allExtension.includes(extension)){
            swal("error","Please Choose PDF or JPG or JPEG or PNG File","error")
        }else{
            for(i = 0; i < certificateSelectedFiles.length; i++) {
                qua++
                var certificate_file_ul = $('#quality_file_ul')
                var extensionIcon = '';
                if(extension == 'pdf'){
                    extensionIcon = `<i class="icofont icofont-file-pdf"></i>`
                } else {
                    extensionIcon = `<i class="icofont icofont-ui-image"></i>`
                }
                var certificate_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'quality_file','quality_file_`+(qua-1)+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon">`+extensionIcon+`</div><div id="quality_file_name_` + qua + `" class="file_name"></div></div></li>`
                certificate_file_ul.append(certificate_li_html)
                $('#quality_file_name_'+qua).text(certificateSelectedFiles[i].name)
                var certificateTmpSelectedFiles = $('#quality-selected-files').val();
                console.log('certificateTmpSelectedFiles : ', certificateTmpSelectedFiles);
                if(certificateTmpSelectedFiles == '') {
                    certificateTmpSelectedFiles = certificateSelectedFiles[i].name;
                } else {
                    certificateTmpSelectedFiles += ', '+ certificateSelectedFiles[i].name;
                }
                console.log('certificateTmpSelectedFiles : ', certificateTmpSelectedFiles);
                $('#quality-selected-files').val(certificateTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            qua_inc++
            var btn = `<input id="quality_file_`+qua_inc+`" name="quality_file_`+qua_inc+`" type="file" class="custom-file-input quality_file" onchange="qualityFile('quality_file_`+qua_inc+`');" accept=".pdf,image/*"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        quality_exists_file_name = $('#quality-selected-files').val()
    }
}

// certificate edit file

var edit_certificate = 0
var edit_inc_certificate = 0
var edit_change_n_certificate = 0
function editCertificateFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        edit_inc_certificate = newTmpId;
        edit_change_n_certificate++
        $('#change_n_certificate').val(edit_change_n_certificate);
        var certificateSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        var allExtension = ['pdf','jpg','png','jpeg']
        if(certificateSelectedFiles.length != 0 && !allExtension.includes(extension)){
            swal("error","Please Choose PDF or PNG or JPEG or JPG File","error")
        }
        else{
            for(i = 0; i < certificateSelectedFiles.length; i++) {
                edit_certificate++
                var extensionIcon = '';
                if(extension == 'pdf'){
                    extensionIcon = `<i class="icofont icofont-file-pdf"></i>`
                } else {
                    extensionIcon = `<i class="icofont icofont-ui-image"></i>`
                }
                var certificate_file_ul = $('#certificate_file_ul')
                var certificate_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'certificate_file','certificate_file_`+edit_inc_certificate+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon">`+extensionIcon+`</div><div id="certificate_file_name_` + edit_certificate + `" class="file_name"></div></div></li>`
                
                certificate_file_ul.append(certificate_li_html)
                $('#certificate_file_name_'+edit_certificate).text(certificateSelectedFiles[i].name)
                var certificateTmpSelectedFiles = $('#certificate-selected-files').val();
                if(certificateTmpSelectedFiles == '') {
                    certificateTmpSelectedFiles = certificateSelectedFiles[i].name;
                } else {
                    certificateTmpSelectedFiles += ', '+ certificateSelectedFiles[i].name;
                }
                $('#certificate-selected-files').val(certificateTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            edit_inc_certificate++
            var btn = `<input id="certificate_file_`+edit_inc_certificate+`" name="certificate_file_`+edit_inc_certificate+`" type="file" class="custom-file-input certificate_file" onchange="editCertificateFile('certificate_file_`+edit_inc_certificate+`');" accept=".pdf,image/*"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        console.log('ookokok in change',$('#certificate_file_'+$('#change_n').val()));
        certificate_exists_file_name = $('#certificate-selected-files').val()
        console.log('certificate_exists_file_name-->',certificate_exists_file_name)
    }
}


// Equipment edit file

var edit_equipment = 0
var edit_inc_equipment = 0
var edit_change_n_equipment = 0
function editEquipmentFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        edit_inc_equipment = newTmpId;
        edit_change_n_equipment++
        $('#change_n_equipment').val(edit_change_n_equipment);
        var certificateSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        var allExtension = ['pdf','jpg','png','jpeg']
        if(certificateSelectedFiles.length != 0 && !allExtension.includes(extension)){
            swal("error","Please Choose PDF or PNG or JPEG or JPG File","error")
        }
        else{
            for(i = 0; i < certificateSelectedFiles.length; i++) {
                edit_equipment++
                var extensionIcon = '';
                if(extension == 'pdf'){
                    extensionIcon = `<i class="icofont icofont-file-pdf"></i>`
                } else {
                    extensionIcon = `<i class="icofont icofont-ui-image"></i>`
                }
                var certificate_file_ul = $('#equipment_file_ul')
                var certificate_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'equipment_file','equipment_file_`+edit_inc_equipment+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon">`+extensionIcon+`</div><div id="equipment_file_name_` + edit_equipment + `" class="file_name"></div></div></li>`

                certificate_file_ul.append(certificate_li_html)
                $('#equipment_file_name_'+edit_equipment).text(certificateSelectedFiles[i].name)
                var certificateTmpSelectedFiles = $('#equipment-selected-files').val();
                if(certificateTmpSelectedFiles == '') {
                    certificateTmpSelectedFiles = certificateSelectedFiles[i].name;
                } else {
                    certificateTmpSelectedFiles += ', '+ certificateSelectedFiles[i].name;
                }
                $('#equipment-selected-files').val(certificateTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            edit_inc_equipment++
            var btn = `<input id="equipment_file_`+edit_inc_equipment+`" name="equipment_file_`+edit_inc_equipment+`" type="file" class="custom-file-input equipment_file" onchange="editEquipmentFile('equipment_file_`+edit_inc_equipment+`');" accept=".pdf,image/*"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        equipment_exists_file_name = $('#equipment-selected-files').val()
    }
}

// Industry edit file

var edit_industry = 0
var edit_inc_industry = 0
var edit_change_n_industry = 0
function editIndustryFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        edit_inc_industry = newTmpId;
        edit_change_n_industry++
        $('#change_n_industry').val(edit_change_n_industry);
        var certificateSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        var allExtension = ['pdf','jpg','png','jpeg']
        if(certificateSelectedFiles.length != 0 && !allExtension.includes(extension)){
            swal("error","Please Choose PDF or PNG or JPEG or JPG File","error")
        }
        else{
            for(i = 0; i < certificateSelectedFiles.length; i++) {
                edit_industry++
                var extensionIcon = '';
                if(extension == 'pdf'){
                    extensionIcon = `<i class="icofont icofont-file-pdf"></i>`
                } else {
                    extensionIcon = `<i class="icofont icofont-ui-image"></i>`
                }
                var certificate_file_ul = $('#industry_file_ul')
                var certificate_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'industry_file','industry_file_`+edit_inc_industry+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon">`+extensionIcon+`</div><div id="industry_file_name_` + edit_industry + `" class="file_name"></div></div></li>`

                certificate_file_ul.append(certificate_li_html)
                $('#industry_file_name_'+edit_industry).text(certificateSelectedFiles[i].name)
                var certificateTmpSelectedFiles = $('#industry-selected-files').val();
                if(certificateTmpSelectedFiles == '') {
                    certificateTmpSelectedFiles = certificateSelectedFiles[i].name;
                } else {
                    certificateTmpSelectedFiles += ', '+ certificateSelectedFiles[i].name;
                }
                $('#industry-selected-files').val(certificateTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            edit_inc_industry++
            var btn = `<input id="industry_file_`+edit_inc_industry+`" name="industry_file_`+edit_inc_industry+`" type="file" class="custom-file-input industry_file" onchange="editIndustryFile('industry_file_`+edit_inc_industry+`');" accept=".pdf,image/*"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        industry_exists_file_name = $('#industry-selected-files').val()
    }
}

// Building edit file

var edit_building = 0
var edit_inc_building = 0
var edit_change_n_building = 0
function editBuildingFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        edit_inc_building = newTmpId;
        edit_change_n_building++
        $('#change_n_building').val(edit_change_n_building);
        var certificateSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        var allExtension = ['pdf','jpg','png','jpeg']
        if(certificateSelectedFiles.length != 0 && !allExtension.includes(extension)){
            swal("error","Please Choose PDF or PNG or JPEG or JPG File","error")
        }
        else{
            for(i = 0; i < certificateSelectedFiles.length; i++) {
                edit_building++
                var extensionIcon = '';
                if(extension == 'pdf'){
                    extensionIcon = `<i class="icofont icofont-file-pdf"></i>`
                } else {
                    extensionIcon = `<i class="icofont icofont-ui-image"></i>`
                }
                var certificate_file_ul = $('#building_file_ul')
                var certificate_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'building_file','building_file_`+edit_inc_building+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon">`+extensionIcon+`</div><div id="building_file_name_` + edit_building + `" class="file_name"></div></div></li>`

                certificate_file_ul.append(certificate_li_html)
                $('#building_file_name_'+edit_building).text(certificateSelectedFiles[i].name)
                var certificateTmpSelectedFiles = $('#building-selected-files').val();
                if(certificateTmpSelectedFiles == '') {
                    certificateTmpSelectedFiles = certificateSelectedFiles[i].name;
                } else {
                    certificateTmpSelectedFiles += ', '+ certificateSelectedFiles[i].name;
                }
                $('#building-selected-files').val(certificateTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            edit_inc_building++
            var btn = `<input id="building_file_`+edit_inc_building+`" name="building_file_`+edit_inc_building+`" type="file" class="custom-file-input building_file" onchange="editBuildingFile('building_file_`+edit_inc_building+`');" accept=".pdf,image/*"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        building_exists_file_name = $('#building-selected-files').val()
    }
}

// Quality edit file

var edit_quality = 0
var edit_inc_quality = 0
var edit_change_n_quality = 0
function editQualityFile(id) {
    check_file(id);
    if(res)
    {
        tmpId = id.split('_');
        newTmpId = tmpId[tmpId.length - 1];
        edit_inc_quality = newTmpId;
        edit_change_n_quality++
        $('#change_n_quality').val(edit_change_n_quality);
        var certificateSelectedFiles = $('#'+id)[0].files;
        var extension = $('#'+id).val().substring($('#'+id).val().lastIndexOf('.') + 1)
        var allExtension = ['pdf','jpg','png','jpeg']
        if(certificateSelectedFiles.length != 0 && !allExtension.includes(extension)){
            swal("error","Please Choose PDF or PNG or JPEG or JPG File","error")
        }
        else{
            for(i = 0; i < certificateSelectedFiles.length; i++) {
                edit_quality++
                var extensionIcon = '';
                if(extension == 'pdf'){
                    extensionIcon = `<i class="icofont icofont-file-pdf"></i>`
                } else {
                    extensionIcon = `<i class="icofont icofont-ui-image"></i>`
                }
                var certificate_file_ul = $('#quality_file_ul')
                var certificate_li_html = `<li><div class="box"><a onclick="customRemoveElement($(this),'quality_file','quality_file_`+edit_inc_quality+`')" class="remove1"><i class="icofont icofont-close"></i></a><div class="icon">`+extensionIcon+`</div><div id="quality_file_name_` + edit_quality + `" class="file_name"></div></div></li>`

                certificate_file_ul.append(certificate_li_html)
                $('#quality_file_name_'+edit_quality).text(certificateSelectedFiles[i].name)
                var certificateTmpSelectedFiles = $('#quality-selected-files').val();
                if(certificateTmpSelectedFiles == '') {
                    certificateTmpSelectedFiles = certificateSelectedFiles[i].name;
                } else {
                    certificateTmpSelectedFiles += ', '+ certificateSelectedFiles[i].name;
                }
                $('#quality-selected-files').val(certificateTmpSelectedFiles);
            }
            $('#'+id).css('display','none')
            edit_inc_quality++
            var btn = `<input id="quality_file_`+edit_inc_quality+`" name="quality_file_`+edit_inc_quality+`" type="file" class="custom-file-input quality_file" onchange="editQualityFile('quality_file_`+edit_inc_quality+`');" accept=".pdf,image/*"><label>Upload</label>`
            $('#'+id).parent().append(btn)
        }
        quality_exists_file_name = $('#quality-selected-files').val()
    }
}

// end chang event
