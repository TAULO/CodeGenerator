$(document).ready(function () {
    var elementFrame = window.parent.document.getElementsByName('someFrame')[0];
    elementFrame.removeAttribute("height");
    elementFrame.removeAttribute("style");

    $("#cmbusernames").change(function () {
        
        $("#UserId").val($("#txtName").val());
        $("#div").hide();        
    });

    $("#btnFilter").click(function () {
        $('.filter').slideToggle("slow", 'linear');
    });
    
    deletemodal__();

    $("#clearBtn").click(function () {
        $("#user").val('');
    });

    //Aplica kendo a la grilla para paginación   
    var grid = $("#tableAsignature").kendoGrid({
        dataSource: {
            pageSize: 25,
            schema: {
                model: {
                    fields: {
                        UserId: { type: "string" },
                        Modified: { type: "string" },
                        Signatures: { type: "string" },
                        Actions: { type: "string" },
                    }
                }
            },
        },
        scrollable: false,
        sortable: {
            allowUnsort: false
        },
        selectable: false,
        filterable: false,
        pageable: true,
        info: false,
        previousNext: false,
        resizable: true,
        allowUnsort: false,
        messages: {
            display: "",
            first: "",
            previous: "",
            next: "",
            last: "",
            refresh: ""
        },
        columns:
        [
            {
                field: "UserId"
            },
            {
                field: "Modified",
                sortable: {
                    compare: function (a, b) {
                        var dateOne = null;
                        var dateTwo = null;
                     
                        if (a.Modified.length > 0) {
                            dateOne = changeDateFormat(a.Modified);
                        } else {
                            dateOne = changeDateFormat("01 Jan 1900");
                        }

                        if (b.Modified.length > 0) {
                            dateTwo = changeDateFormat(b.Modified);
                        } else {
                            dateTwo = changeDateFormat("01 Jan 1900");
                        }

                        return dateOne.getTime() == dateTwo.getTime() ? 0 : (dateOne.getTime() > dateTwo.getTime()) ? 1 : -1;
                    }
                }
            },
            {
                field: "Signatures"
            },
            {
                field: "Actions"

            }
        ],
        dataBound: function (e) {
            
            $(".k-pager-nav").hide();
            $(".k-pager-info").hide();
            $(".k-pager-first").hide();
            $(".k-pager-last").hide();
        }
    }).data("kendoGrid");
      



        $('#upload').click(function (e) {
            if ($('#upload').attr('aria-describedby') != null) {
                $('#upload').removeAttr('title');
                $("#upload").tooltip("destroy");
            }
        });

        
    $('#save').click(function (e) {
        
        e.preventDefault();
        
        var usuarioAceptado="";
        
        if ($("#cmbusernames").val() == null) {            
        
            var element = $("#txtName");
            $(element).attr('data-val-required', $('#ErrorUsuario').val());
            $(element).addClass("input-validation-error");
            $(element).tooltip().css('left:120px','top:120px');
            $(element).focus();

            $("#cmbusernames").attr('data-val-required', $('#ErrorUsuario').val());
            $("#cmbusernames").addClass("input-validation-error");
            //$("#cmbusernames").tooltip("position", { my: "right-120% top-50%" });
            $("#cmbusernames").focus();
            return false;

        }
        else {
            usuarioAceptado = $("#cmbusernames").val();
        }

        if ($('#upload').val() != "") {
           
            var RutaNombreDocumento = $('#upload').val().toString().split('\\');
            if (RutaNombreDocumento.length > 0) {
                var NombreDocumento = RutaNombreDocumento[RutaNombreDocumento.length - 1];
                var NombreExtension = NombreDocumento.toString().split('.');

                if (NombreExtension.length > 0) {
                    var Extension = NombreExtension[NombreExtension.length - 1];
                    var ExtensionAceptada = "";

                    switch (Extension.toLowerCase()) {
                        //Formato Archivos Imagen
                        case "jpg": ExtensionAceptada = "JPEG"; break;
                        case "gif": ExtensionAceptada = "GIF"; break;
                        
                            //Si el formato no se encuentra dentro de los anteriores casos se tomara por defecto 
                        default: ExtensionAceptada = ""; break;
                    }

                    if (ExtensionAceptada != "" && usuarioAceptado != "") {
                        idbg.lockUi(null, true);
                        $("#targetDoc").submit();
                    }
                    else {
                        $('#upload').attr('Title', $('#ErrorExtension').val());
                        $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
                        $("#upload").tooltip("option", "position", { my: "right-120% top-50%" });
                        $('#upload').focus();                       
                    }
                }
                else {
                    $('#upload').attr('Title', $('#ErrorArchivo').val());
                    $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
                    $("#upload").tooltip("option", "position", { my: "right-120% top-50%" });
                    $('#upload').focus();
                }
            }
            else {
                $('#upload').attr('Title', $('#ErrorArchivo').val());
                $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
                $("#upload").tooltip("option", "position", { my: "right-120% top-50%" });
                $('#upload').focus();
            }
        }
        else {            
            $('#upload').attr('Title', $('#ErrorArchivo').val());
            $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
            $("#upload").tooltip("option", "position", { my: "right-120% top-50%" });
            $('#upload').focus();
        }
    });

    $('#save2').click(function (e) {
        e.preventDefault();
        
        var usuarioAceptado = "";

        if ($("#cmbusernames").val() == null) {
           
            var element = $("#txtName");
            $(element).attr('data-val-required', $('#ErrorUsuario').val());
            $(element).addClass("input-validation-error");
            $(element).tooltip().css('left:120px', 'top:120px');
            $(element).focus();

            $("#cmbusernames").attr('data-val-required', $('#ErrorUsuario').val());
            $("#cmbusernames").addClass("input-validation-error");
            //$("#cmbusernames").tooltip("position", { my: "right-120% top-50%" });
            $("#cmbusernames").focus();
            return false;

        }
        else {
            usuarioAceptado = $("#cmbusernames").val();
        }

        if ($('#upload').val() != "") {

            var RutaNombreDocumento = $('#upload').val().toString().split('\\');
            if (RutaNombreDocumento.length > 0) {
                var NombreDocumento = RutaNombreDocumento[RutaNombreDocumento.length - 1];
                var NombreExtension = NombreDocumento.toString().split('.');

                if (NombreExtension.length > 0) {
                    var Extension = NombreExtension[NombreExtension.length - 1];
                    var ExtensionAceptada = "";

                    switch (Extension.toLowerCase()) {
                        //Formato Archivos Imagen
                        case "jpg": ExtensionAceptada = "JPEG"; break;
                        case "gif": ExtensionAceptada = "GIF"; break;

                            //Si el formato no se encuentra dentro de los anteriores casos se tomara por defecto 
                        default: ExtensionAceptada = ""; break;
                    }

                    if (ExtensionAceptada != "" && usuarioAceptado != "") {
                        idbg.lockUi(null, true);
                        $("#targetDoc").submit();
                    }
                    else {
                        $('#upload').attr('Title', $('#ErrorExtension').val());
                        $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
                        $("#upload").tooltip("option", "position", { my: "right-120% top-50%" });
                        $('#upload').focus();
                        return false;
                    }
                }
                else {
                    $('#upload').attr('Title', $('#ErrorArchivo').val());
                    $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
                    $("#upload").tooltip("option", "position", { my: "left-60% bottom+240%" });
                    $('#upload').focus();
                }
            }
            else {
                $('#upload').attr('Title', $('#ErrorArchivo').val());
                $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
                $("#upload").tooltip("option", "position", { my: "left-60% bottom+240%" });
                $('#upload').focus();
            }
        }
        else {
            $('#upload').attr('Title', $('#ErrorArchivo').val());
            $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
            $("#upload").tooltip("option", "position", { my: "right-120% top-55%" });
            $('#upload').focus();
        }
    });
    
    $('#saveupd').click(function (e) {        
        e.preventDefault();
        
        if ($('#upload').val() != "") {

            var RutaNombreDocumento = $('#upload').val().toString().split('\\');
            if (RutaNombreDocumento.length > 0) {
                var NombreDocumento = RutaNombreDocumento[RutaNombreDocumento.length - 1];
                var NombreExtension = NombreDocumento.toString().split('.');

                if (NombreExtension.length > 0) {
                    var Extension = NombreExtension[NombreExtension.length - 1];
                    var ExtensionAceptada = "";

                    switch (Extension) {
                        //Formato Archivos Imagen
                        case "jpg": ExtensionAceptada = "JPEG"; break;                        
                        case "gif": ExtensionAceptada = "GIF"; break;                        

                            //Si el formato no se encuentra dentro de los anteriores casos se tomara por defecto 
                        default: ExtensionAceptada = ""; break;
                    }

                    if (ExtensionAceptada != "") {                        
                        idbg.lockUi(null, true);
                        $("#targetDoc").submit();                       
                    }
                    else {
                        $('#upload').attr('Title', $('#ErrorExtension').val());
                        $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
                        $("#upload").tooltip("option", "position", { my: "right-120% top-50%" });
                        $('#upload').focus();
                    }
                }
                else {
                    $('#upload').attr('Title', $('#ErrorArchivo').val());
                    $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
                    $("#upload").tooltip("option", "position", { my: "left-60% bottom+240%" });
                    $('#upload').focus();
                }
            }
            else {
                $('#upload').attr('Title', $('#ErrorArchivo').val());
                $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
                $("#upload").tooltip("option", "position", { my: "left-60% bottom+240%" });
                $('#upload').focus();
            }
        }
        else {
            $('#upload').attr('Title', $('#ErrorArchivo').val());
            $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
            $("#upload").tooltip("option", "position", { my: "right-120% top-60%" });
            $('#upload').focus();
        }
    });

    $('#save2upd').click(function (e) {
        e.preventDefault();

        if ($('#upload').val() != "") {

            var RutaNombreDocumento = $('#upload').val().toString().split('\\');
            if (RutaNombreDocumento.length > 0) {
                var NombreDocumento = RutaNombreDocumento[RutaNombreDocumento.length - 1];
                var NombreExtension = NombreDocumento.toString().split('.');

                if (NombreExtension.length > 0) {
                    var Extension = NombreExtension[NombreExtension.length - 1];
                    var ExtensionAceptada = "";

                    switch (Extension) {
                        //Formato Archivos Imagen
                        case "jpg": ExtensionAceptada = "JPEG"; break;                        
                        case "gif": ExtensionAceptada = "GIF"; break;                        

                            //Si el formato no se encuentra dentro de los anteriores casos se tomara por defecto 
                        default: ExtensionAceptada = ""; break;
                    }

                    if (ExtensionAceptada != "") {
                        idbg.lockUi(null, true);
                        $("#targetDoc").submit();
                    }
                    else {
                        $('#upload').attr('Title', $('#ErrorExtension').val());
                        $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
                        $("#upload").tooltip("option", "position", { my: "right-120% top-50%" });
                        $('#upload').focus();
                    }
                }
                else {
                    $('#upload').attr('Title', $('#ErrorArchivo').val());
                    $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
                    $("#upload").tooltip("option", "position", { my: "left-60% bottom+240%" });
                    $('#upload').focus();
                }
            }
            else {
                $('#upload').attr('Title', $('#ErrorArchivo').val());
                $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
                $("#upload").tooltip("option", "position", { my: "left-60% bottom+240%" });
                $('#upload').focus();
            }
        }
        else {
            $('#upload').attr('Title', $('#ErrorArchivo').val());
            $('#upload').tooltip({ show: { effect: "blind", duration: 800 } });
            $("#upload").tooltip("option", "position", { my: "right-120% top-60%" });
            $('#upload').focus();
        }
    });
    
    //Mensaje tooltip de error para validaciones
    $(document).tooltip({
        items: ".input-validation-error",
        content: function () {
            return $(this).attr('data-val-required');
        }
    });

    $("#filterBtn").click(function (e) {
       
       idbg.lockUi(null,true);
    });
});


//Remove modal warning
function removemodal()
{
    $(window.parent.document).find('body').find(".ui-widget-overlay").remove();
    $(".ui-widget-overlay").remove();
    $(".k-window").remove();
}


//Show a modal warning delete siganture
function deleteSignature(element,usersignatureid) {
    
    var positionRelative = $(element).offset();
    $(window.parent.document).find('body').append('<div class="ui-widget-overlay ui-front"></div>');

    
    $('body').append('<div class="ui-widget-overlay ui-front"></div>');
    
    $('body').append('<form id="formSignature" action="' + $("#rutasignature").val() + '">' + '<input data-val="true" data-val-required="The UserSignatureId field is required." id="UserSignatureId" name="UserSignatureId" type="hidden" value="' + usersignatureid + '">' +
        '<div class="dinamicModal"><div style="padding: 20px;">' + $("#mensajeDelete").val() + '</div><div class="pie pieReassign"><div class="botones"> ' +
        '<a title="Cancel" class="cancel" id="CancelWarningDialog" onclick="removemodal();" ' +
        'href="javascript:void(0)">' + $("#Cancel").val() + '</a><label for="delete">' +
        '<input type="button" value="' + $("#Delete").val() + '" class="btn-primary" id="btnSaveDeleteSignature" onclick="DeleteSignatureByUser(' + usersignatureid + ');" ></label>    </div></div></div></form>');
        
   
    var dialog = $(".dinamicModal").kendoWindow({
        width: "800px",
        title: $("#DeleteSignature").val(),
        draggable: false,
        resizable: false,
        //content:  Url.Action("IndexDeleteComponent", "Outputs", new { area = "ResultsMatrix" }),
        //content: '/SignaturesAndContacts/Signatures/IndexDeleteAsignatureWarning',//?userid=' + 'ueyuey' + '&usersignatureid=' + 2 + '&documentreference=' + 'uriuti',
        pinned: true,
        actions: [
            "Close"
        ],
        //open: function (e) {
        //    this.wrapper.attr("style", "top:" + positionRelative.top + "px !important;margin-top:50px");
        //},
        modal: true,
        visible: false,
        close: function () {
            $(window.parent.document).find('body').find(".ui-widget-overlay").remove();
            $(".ui-widget-overlay").remove();
            $(".k-window").remove();
        }
    }).data("kendoWindow");
    $(".k-window-titlebar").addClass("warning");
    $(".k-window-title").addClass("ico_warning");
    dialog.center();
    dialog.open();
   
    
}

//Delete signature byuser
function DeleteSignatureByUser(usersignatureid) {
    deletemodal__();
    idbg.lockUi(null, true);
    $("#formSignature").submit();
};


//Muestra imágen en grilla al hacer click en el enlace ViewSignature
function ViewImage(document,ctrImage,id) {
    jQuery('#href' + id).remove();
    jQuery('#dvhref' + id).append('<div id="dvdLoad' + id + '" class="loadingdatawarning" style="width: 3px;padding-left:35px;"><br>Loading...</div>');
    $.ajax({
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        timeout: 10000,
        url: '../Signatures/GetImageSignature',
        data: '{"document":"' + document + '"}',
        success: function (data) {                                     
            jQuery('#dvdLoad' + id).remove();
            jQuery('#dvhref' + id).append('<img id="img' + id + '" style="padding-top:10px;;text-align:center;width:130px;height:60px;vertical-align:central;" src=data:image/png;base64,' + data + '>')

            jQuery('#dvuser' + id).css('position', 'relative');
            jQuery('#dvfec' + id).css('position', 'relative');            

            jQuery('#dvuser' + id).css('top', '-28px');
            jQuery('#dvfec' + id).css('top', '-28px');                 
        }
       
    });    
};


function deletemodal__() {
    try {
        $(window.parent.document).find('body').find(".ui-widget-overlay").remove();
        $(".ui-widget-overlay").remove();
        $(".k-window").remove();
        $(".k-window-titlebar").remove();
    } catch (Exception) { }
}

//Llena texto lista cuando se consulta por un usuario
function fillCombo(object) {
    
   if ($("#txtName").val() != "") {

      var parent = $(object).parent();
      $(parent).parent().find("#dvdLoad").remove();
      $('<div id="dvdLoad" class="loadingdatawarning" style="width: 3px;padding-left:35px;"><br>Loading...</div>').insertAfter(parent);



        
        $.getJSON("../Signatures/IndexGetUsers" + "?user=" + $("#txtName").val(), null,

            function (data) {
               $(parent).parent().find("#dvdLoad").remove();

                $("#cmbusernames").empty();
                $(".messages").remove();
                var validator = 0;
                $.each(data, function (i, item) {
                    $("#divcbn").fadeIn(1000);                                      
                    validator = 1;
                    $("#cmbusernames").append("<option id='" + item.IdUser + "'>" + item.Nombre.toUpperCase() + "</option>").css('height', '120px');
                });
                if (validator == 0) {
                    $("#divcbn").fadeOut(1000);
                    var element = $("#txtName");
                    $(element).attr('data-val-required', $('#ErrorNoExists').val());
                    $(element).addClass("input-validation-error");
                    $(element).tooltip().css('left:120px', 'top:120px');
                    $(element).focus();
                }
            }).fail(function (jqxhr, textStatus, error) {
               $(parent).parent().find("#dvdLoad").remove();
            });
    }
};


function checkfile() {
    var file = getNameFromPath($("#file").val());
    if (file != null) {
        var extension = file.substr((file.lastIndexOf('.') + 1));
        // alert(extension);
        switch (extension) {
            case 'jpg':
            case 'png':
            case 'gif':            
                flag = true;
                break;
            default:
                flag = false;
        }
    }
    if (flag == false) {
        //$("#spanfile").text("You can upload only jpg,png,gif,pdf extension file");
        var err = $('#ErrorArchivo').val();
        $('#spanfile').attr('Title', $('#ErrorArchivo').val());
        $('#file').tooltip({ show: { effect: "blind", duration: 800 } });
        $("#file").tooltip("option", "position", { my: "left-50% bottom+240%" });
        $('#file').focus();
        //return false;
    }
    else {
        var size = GetFileSize('file');
        if (size > 3) {
            $("#spanfile").text("You can upload file up to 3 MB");
            return false;
        }
        else {
            $("#spanfile").text("");
        }
    }
}

//get file path from client system
function getNameFromPath(strFilepath) {
    var objRE = new RegExp(/([^\/\\]+)$/);
    var strName = objRE.exec(strFilepath);

    if (strName == null) {
        return null;
    }
    else {
        return strName[0];
    }
}


$("#save2").click(function () {
    if ($('#upload').val() == "") {
        $("#spanfile").html("Please upload file");
        return false;
    }
    else {
        return checkfile();
    }
});

function ShowFilter()
{   
    $('#filter').slideToggle("slow", 'linear');  
}

//Replace dataformat
function changeDateFormat(strDate) {
    var splittedDate = strDate.split(" ");
    var convertedDate = "";
    var strMonth = splittedDate[1];
    var numericMonth = -1;

    switch (strMonth) {
        case "Jan": numericMonth = "01"; break;
        case "Feb": numericMonth = "02"; break;
        case "Mar": numericMonth = "03"; break;
        case "Apr": numericMonth = "04"; break;
        case "May": numericMonth = "05"; break;
        case "Jun": numericMonth = "06"; break;
        case "Jul": numericMonth = "07"; break;
        case "Aug": numericMonth = "08"; break;
        case "Sep": numericMonth = "09"; break;
        case "Oct": numericMonth = "10"; break;
        case "Nov": numericMonth = "11"; break;
        case "Dec": numericMonth = "12"; break;
    }

    convertDate = splittedDate[0] + "/" + numericMonth + "/" + splittedDate[2];

    return kendo.parseDate(convertDate, "dd/MM/yyyy");
}

//get file size
function GetFileSize(fileid) {
    try {
        var fileSize = 0;
        //for IE
        if ($.browser.msie) {
            //before making an object of ActiveXObject, 
            //please make sure ActiveX is enabled in your IE browser
            var objFSO = new ActiveXObject("Scripting.FileSystemObject"); var filePath = $("#" + fileid)[0].value;
            var objFile = objFSO.getFile(filePath);
            var fileSize = objFile.size; //size in kb
            fileSize = fileSize / 1048576; //size in mb 
        }
            //for FF, Safari, Opeara and Others
        else {
            fileSize = $("#" + fileid)[0].files[0].size //size in kb
            fileSize = fileSize / 1048576; //size in mb 
        }
        return fileSize;
    }
    catch (e) {
        alert("Error is :" + e);
    }
}