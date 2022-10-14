
$(document).ready(function () {
    var _duration = 800;
    var _maxImageCount = 4;
    var _maxCVCount = 10;
    var _maxEmpRecommendCount = 3;
    var userID = 0;
    var accountID = 0;
    userID = $('#ContentPlaceHolder1_HiddenUserID').val();
    accountID = $('#ContentPlaceHolder1_hidEditCompanyID').val();
    var hidPhotoName = $('#ContentPlaceHolder1_hidPhotoName').val();
    _maxImageCount = $('#ContentPlaceHolder1_hdnMaxImageCount').val();
    //if (getMaxImageCount() > 0)
    //    _maxImageCount = getMaxImageCount();
    
    if (parseInt($('#hdnImageCount').val()) >= _maxImageCount) {
        $('#divAddImage').hide();
    }
    if (parseInt($('#hdnCVCount').val()) >= _maxCVCount) {
        $('#img-fileuploader').hide();
    }
    if (parseInt($('#hdnEmpRecommendCount').val()) >= _maxEmpRecommendCount) {
        $('#divAddEmpRecommend').hide();
    }

    $(document).on('click', '.img-delete', function () {

        if (confirm('Are you sure you want to Delete ?')) {

            var postURL = "/Ajax/FileUploadHandler.ashx?delete=1&AccountID=" + accountID + "&id=" + $(this).attr('id');

            $.ajax({
                url: postURL,
                type: "POST",
                contentType: false,
                processData: false,
                success: function (result) {
                    var json = $.parseJSON(result);
                    $('#image-list').empty();
                    for (var j = 0; j < json.length; j++) {
                        $('#image-list').append('<div class="col-xs-12 col-md-6 no-pad-left displayPanel">'
                                                + '<div class="col-xs-9 col-sm-3 col-md-3">'
                                                + '<a data-lightbox="com-image" href="/images/Company/can/mc/' + json[j]['ID'] + '_' + json[j]['FileName'] + '">'
                                                    + '<image class="img-thumbnail" src="/images/Company/can/mc/80/80/' + json[j]['ID'] + '_' + json[j]['FileName'] + '"/>'
                                                + '</a>'
                                                + '</div>'
                                                + '<div class="col-xs-9 col-sm-7 col-md-7 over-hide">' + json[j]['FileName'] + '</div>'
                                                + '<div class="col-xs-3 col-sm-2 col-md-2 no-mar-pad text-right">'
                                                    + '<span title="remove" id="' + json[j]['ID'] + '_' + json[j]['FileName'] + '"'
                                                        + 'class="img-delete removeAction glyphicon glyphicon-remove" aria-hidden="true"></span>'
                                                    + ' <span title="remove" id="' + json[j]['ID'] + '_' + json[j]['FileName'] + '"'
                                                        + 'class="img-delete removeAction">Delete</span>'
                                                + '</div>'
                                            + '</div>');
                    }

                    var imgCount = parseInt($('#hdnImageCount').val());
                    imgCount = imgCount - 1;
                    $('#hdnImageCount').val(imgCount);

                    $('.input-group > input[type="text"]').val('');

                    if (imgCount < _maxImageCount) {
                        $('#divAddImage').show();
                    }
                },
                error: function (err) {
                    console.log('Error - ' + err.statusText);
                }
            });
        }
    });

    $("#btnUpload").click(function (evt) {
        var fileUpload = $("#fupload").get(0);
        var files = fileUpload.files;

        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            data.append(files[i].name, files[i]);
        }

        var postURL = "/Ajax/FileUploadHandler.ashx?AccountID=" + accountID;

        $.ajax({
            url: postURL,
            type: "POST",
            //dataType: 'application/json charset=utf-8',
            data: data,
            contentType: false, // 'application/json; charset=utf-8',
            processData: false,
            success: function (result) {

                var json = $.parseJSON(result);
                $('#image-list').empty();
                for (var j = 0; j < json.length; j++) {
                    $('#image-list').append('<div class="col-xs-12 col-md-6 no-pad-left displayPanel">'
                                            + '<div class="col-xs-9 col-sm-3 col-md-3">'
                                                + '<a data-lightbox="com-image" href="/images/Company/can/mc/' + json[j]['ID'] + '_' + json[j]['FileName'] + '">'
                                                    + '<image class="img-thumbnail" src="/images/Company/can/mc/80/80/' + json[j]['ID'] + '_' + json[j]['FileName'] + '"/>'
                                                + '</a>'
                                            + '</div>'
                                            + '<div class="col-xs-9 col-sm-7 col-md-7 over-hide">' + json[j]['FileName'] + '</div>'
                                            + '<div class="col-xs-3 col-sm-2 col-md-2 no-mar-pad text-right">'
                                                + '<span title="remove" id="' + json[j]['ID'] + '_' + json[j]['FileName'] + '"'
                                                    + 'class="img-delete removeAction glyphicon glyphicon-remove" aria-hidden="true"></span>'
                                                + ' <span title="remove" id="' + json[j]['ID'] + '_' + json[j]['FileName'] + '"'
                                                    + 'class="img-delete removeAction">Delete</span>'
                                            + '</div>'
                                        + '</div>');
                }

                $('#fupload').val('');
                $('#imgprv').removeAttr('src');
                $('.input-group > input[type="text"]').val('');

                var imgCount = parseInt($('#hdnImageCount').val());
                imgCount = imgCount + 1;
                $('#hdnImageCount').val(imgCount);
                if (imgCount >= _maxImageCount) {
                    $('#divAddImage').hide();
                }
            },
            error: function (err) {
                console.log('Error - ' + err.statusText);
            }
        });

        evt.preventDefault();
    });
    //Image preview
    prvimg = {
        UpdatePreview: function (obj) {
            $('#divImageMsg').hide();
            if (!window.FileReader) {
            } else {
                var reader = new FileReader();
                var target = null;

                reader.onload = function (e) {
                    target = e.target || e.srcElement;

                    var fileExtension = target.result;
                    fileExtension = fileExtension.substring(0, fileExtension.indexOf(';'));
                    if (fileExtension.indexOf('/') > 0)
                        fileExtension = fileExtension.substring(fileExtension.indexOf('/') + 1);

                    if (ValidateImageSize(obj.files[0].size) == false || ValidateImageFile(fileExtension) == false) {

                        $('.fupload').val('');
                        $(".imgprv").prop("src", '');
                        $(".imgprv").prop("alt", '');
                        return;
                    }

                    $(".imgprv").prop("src", target.result);
                    $(".imgprv").prop("alt", '');
                };
                reader.readAsDataURL(obj.files[0]);
            }
        }
    };


    function ValidateImageSize(fileSize) {
        $('#divImageMsg').empty();

        if (fileSize > 750 * 1024) {
            $('#divImageMsg').show();
            $('#divImageMsg').empty();
            $('#divImageMsg').append("Sorry, image size must be less than 750kb, please try again.");
            //"Sorry, your image size is too large, the allowed file size is 750 KB, please try again; or contact JobNet on support@JobNet.com.mm.");
            return false;
        }

        return true;
    }

    //".png", ".jpg", ".jpeg", 
    function ValidateImageFile(sFileName) {
        $('#divImageMsg').empty();

        if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validProfilePhotoExtensions.length; j++) {
                var sCurExtension = _validProfilePhotoExtensions[j];

                if (sFileName.toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
                else if ("." + sFileName.toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
                else if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
            }

            if (!blnValid) {
                $('#divImageMsg').show();
                $('#divImageMsg').empty();
                $('#divImageMsg').append("Sorry, " + sFileName + " is invalid, the allowed extensions are: " + _validProfilePhotoExtensions.join(", "));
                return false;
            }
        }
        //}
        //}

        return true;
    }

    // Job Seeker Profile Image Change
    prvprofileimg = {
        ChangeJobSeekerProfile_2: function (obj) {
            $('.profile-photo').prop('src', '');
            var postURL = "/Ajax/JobSeekerDataHandler.ashx?Type=6&Status=1&OldPhoto=" + hidPhotoName;

            $.ajax({
                url: postURL,
                type: "POST",
                //dataType: 'application/json charset=utf-8',
                //data: data,
                contentType: false, // 'application/json; charset=utf-8',
                processData: false,
                success: function (result) {
                    $('.profile-photo').prop('src', '/Images/' + result);
                    return result;
                },
                error: function (err) {
                    console.log('Error - ' + err.statusText)
                }
            });
        }
    };

    function ValidateProfileImageSize(fileSize) {
        $('#divProfilePhotoMsg').empty();

        if (fileSize > 750 * 1024) {
            $('#divProfilePhotoMsg').show();
            $('#divProfilePhotoMsg').empty();
            $('#divProfilePhotoMsg').append("Sorry, image size must be less than 750kb, please try again.");
            return false;
        }

        return true;
    }

    // Job Seeker Profile Image preview
    jobseekerimg = {
        ChangeJobSeekerProfile: function (obj) {
            $('#divProfilePhotoMsg').hide();

            if (!window.FileReader) {
            } else {
                var reader = new FileReader();
                var target = null;

                reader.onload = function (e) {
                    target = e.target || e.srcElement;

                    var fileExtension = target.result;
                    fileExtension = fileExtension.substring(0, fileExtension.indexOf(';'));
                    if (fileExtension.indexOf('/') > 0)
                        fileExtension = fileExtension.substring(fileExtension.indexOf('/') + 1);

                    var isValidCVFile = true;
                    if (ValidateProfileImageSize(obj.files[0].size) == false || ValidateProfilePhotoFile(fileExtension) == false) {
                        // $('.cv-entryPanel').show(_duration);
                        // $('#divAddCV').hide(_duration);

                        $('.fuProfilePhoto').val('');
                        $(".profile-photo").prop("src", '');
                        $(".profile-photo").prop("alt", '');
                        return;
                    }

                    //$(".profile-photo").prop("src", target.result);
                    //$(".profile-photo").prop("alt", '');

                    $('.profile-photo').prop('src', '');
                    var postURL = "/Ajax/JobSeekerDataHandler.ashx?Type=6&Status=1&UserID=" + userID; // +"&OldPhoto=" + $('.hdnProfilePhoto').val();

                    var fileUpload = $(".fuProfilePhoto").get(0);
                    var files = fileUpload.files;
                    var data = new FormData();
                    for (var i = 0; i < files.length; i++) {
                        data.append(files[i].name, files[i]);
                    }

                    $.ajax({
                        url: postURL,
                        type: "POST",
                        //dataType: 'application/json charset=utf-8',
                        data: data,
                        contentType: false, // 'application/json; charset=utf-8',
                        processData: false,
                        success: function (result) {
                            $('.profile-photo').prop('src', '/images/can/mc/120/120/' + result);
                            $('#ContentPlaceHolder1_hidPhotoName').val('images/' + result);
                            //return result;
                        },
                        error: function (err) {
                            console.log('Error - ' + err.statusText)
                        }
                    });
                };
                reader.readAsDataURL(obj.files[0]);
            }
        }
    };

    // Company Profile Logo Change
    prvprofileimg = {
        ChangeCompanyLogo: function (obj) {
            $('#divProfilePhotoMsg').hide();

            if (!window.FileReader) {
            } else {
                var reader = new FileReader();
                var target = null;

                reader.onload = function (e) {
                    target = e.target || e.srcElement;

                    var fileExtension = target.result;
                    fileExtension = fileExtension.substring(0, fileExtension.indexOf(';'));
                    if (fileExtension.indexOf('/') > 0)
                        fileExtension = fileExtension.substring(fileExtension.indexOf('/') + 1);

                    var isValidCVFile = true;
                    if (ValidateProfileImageSize(obj.files[0].size) == false || ValidateProfilePhotoFile(fileExtension) == false) {
                        // $('.cv-entryPanel').show(_duration);
                        // $('#divAddCV').hide(_duration);

                        $('.fuProfilePhoto').val('');
                        $(".profile-photo").prop("src", '');
                        $(".profile-photo").prop("alt", '');
                        return;
                    }

                    $(".profile-photo").prop("alt", '');
                    $('.profile-photo').prop('src', '');
                    $(".profile-photo").prop("src", target.result);
                };
                reader.readAsDataURL(obj.files[0]);
            }
        }
    };

    //".png", ".jpg", ".jpeg", 
    var _validProfilePhotoExtensions = ["png", "jpg", "jpeg"];
    function ValidateProfilePhotoFile(sFileName) {
        $('#divProfilePhotoMsg').empty();

        if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validProfilePhotoExtensions.length; j++) {
                var sCurExtension = _validProfilePhotoExtensions[j];

                if (sFileName.toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
                else if ("." + sFileName.toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
                else if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
            }

            if (!blnValid) {
                $('#divProfilePhotoMsg').show();
                $('#divProfilePhotoMsg').empty();
                $('#divProfilePhotoMsg').append("Sorry, " + sFileName + " is invalid, the allowed extensions are: " + _validProfilePhotoExtensions.join(", "));
                return false;
            }
        }
        //}
        //}

        return true;
    }

    // ----------------------------- Upload CV ----------------------------- //

    $('#divAddCV').on('click', function () {
        $('#hdnCVID').val('');
        $('#divAddCV').hide();
        $('#cv-uploader').show();
        $('#divFileName').hide();
        $('.cv-entryPanel').show(_duration);

        $('#job-seeker-form').addClass('disabled-div');
        $(window).scrollTop(0);
    });

    $(document).on('click', '.cv-cancel', function () {
        CVChangeDefaultControlStyle();

        ClearCVData();

        ReloadCVData('');

        $('.cv-entryPanel').hide(_duration);
        $('#divAddCV').show(_duration);

        $('#job-seeker-form').removeClass('disabled-div');
        if ($('#lblMobileHeaderComment').css('display') != "none")
            $(window).scrollTop($('#divAddCV').offset().top - 200);
    });

    $(document).on('click', '#btnCVDelete', function () {
        $('#divCVMsg').text('');
        if (confirm('Are you sure you want to Delete ?')) {
            var appliedCV = false;
            //var postURL = "/Ajax/CVFileUploadHandler.ashx?Status=4&UserID=" + userID + "&id=" + $(this).attr('id');
            var postURL = "/Ajax/CVFileUploadHandler.ashx?Status=4&UserID=" + userID + "&id=" + $('#hdnCVID').val();
            $.ajax({
                url: postURL,
                type: "POST",
                contentType: false,
                processData: false,
                success: function (result) {

                    if (result == "applied cv") {
                        appliedCV = true;
                        $('#divCVMsg').text('Sorry, unable to delete this CV attachment, as it is used by a previous job you applied for. Don’t worry it won’t be used for future applications unless you specify to do so.');
                        //alert("Sorry, unable to delete old CV, as it is attached for an old application.");
                    }
                    else {
                        SetAutoApplyCheckBox(0);
                        var json = $.parseJSON(result);
                        $('#image-list').empty();
                        for (var j = 0; j < json.length; j++) {
                            $('#image-list').append('<div class="seeker-item-box displayPanel">'
                                                + '<div class="col-xs-11 col-sm-11 col-md-11 no-mar-pad">'
                                                    + '<div class="col-xs-12 col-sm-1 col-md-1"><span>'
                                                        + '<image class="" src="/images/can/mc/20/20/attach-icon.png"/>'
                                                    + '</span></div>'
                                                    + '<div class="col-xs-12 col-sm-4 col-md-4 over-hide"><span>' + json[j]['CVName'] + '</span></div>'
                                                    + '<div class="col-xs-12 col-sm-4 col-md-4 over-hide"><span>' + json[j]['FileName'] + '</span></div>'
                                                    + '<div class="col-xs-12 col-sm-3 col-md-3"><span class="heading-text">Default CV</span> : '
                                                        + (json[j]['DefaultCV'] == "1" ? "Yes" : "No") + '</div>'
                                                + '</div>'
                                                + '<div class="col-xs-1 col-sm-1 col-md-1 no-mar-pad text-right">'
                                                    + '<span id="' + json[j]['CVVersionID'] + '"'
                                                        + ' title="Edit" class="doc-edit editAction glyphicon glyphicon-edit" aria-hidden="true">'
                                                    + '</span>'
                                                    + '<span id="' + json[j]['CVVersionID'] + '"'
                                                        + ' title="Edit" class="doc-edit editAction">Edit</span>'
                                                    + '<span title="remove" id="' + json[j]['CVVersionID'] + '_' + json[j]['FileName'] + '"'
                                                        + 'class="doc-delete removeAction glyphicon glyphicon-remove" aria-hidden="true" style="display:none;"></span>'
                                                + '</div>'
                                            + '</div>');

                            if (json[j]['DefaultCV'] == "1") {
                                SetAutoApplyCheckBox(1);
                            }
                        }

                        ClearCVData();
                        RefreshAutoApplyCheckBox();

                        var imgCount = parseInt($('#hdnCVCount').val());
                        imgCount = imgCount - 1;
                        $('#hdnCVCount').val(imgCount);
                        if (imgCount < _maxCVCount) {
                            $('#img-fileuploader').show();
                        }

                        SaveAndProceedDisableControl();
                    }

                    if (appliedCV == false) {
                        $('#divAddCV').show();
                        $('.cv-entryPanel').hide(_duration);
                        $('#job-seeker-form').removeClass('disabled-div');
                        if ($('#lblMobileHeaderComment').css('display') != "none")
                            $(window).scrollTop($('#divAddCV').offset().top - 200);

                        SaveAndProceedDisableControl();
                    }
                },
                error: function (err) {
                    console.log('Error - ' + err.statusText)
                }
            });

            //            $(this).parent("div").parent("div").fadeOut(_duration, function () {
            //                $(this).remove();
            //            });
        }
    });

    $(document).on('click', '.doc-edit', function () {

        $('#job-seeker-form').addClass('disabled-div');

        $('#cv-uploader').hide();
        $('#divFileName').show();
        $('#btnCVDelete').show();
        ReloadCVData($(this).attr('id'));
        SelectCVData($(this).attr('id'));
        $(window).scrollTop(0);
    });

    function SelectCVData(cvID) {
        $('#divCVAdd').hide(_duration);
        $(".cv-entryPanel").show(_duration);

        var postURL = "/Ajax/CVFileUploadHandler.ashx?";
        postURL = postURL + "&Status=3";
        postURL = postURL + "&UserID=" + userID;
        postURL = postURL + "&CVVersionID=" + cvID;

        $.ajax({
            url: postURL,
            type: "POST",
            //dataType: 'application/json charset=utf-8',
            //data: data,
            contentType: false, // 'application/json; charset=utf-8',
            processData: false,
            success: function (result) {
                var json = $.parseJSON(result);
                $('#hdnCVID').val(json.CVVersionID);
                $('#txtCVName').val(json.CVName);
                if (json.DefaultCV == "1")
                    $('#chkDefaultApply').prop('checked', true);
                else
                    $('#chkDefaultApply').prop('checked', false);
                $('#lblFileName').text(json.FileName);
            },
            error: function (err) {
                console.log('Error - ' + err.statusText)
            }
        });
    }

    function ReloadCVData(withoutID) {
        var postURL = "/Ajax/CVFileUploadHandler.ashx?Status=5&UserID=" + userID + "&withoutID=" + withoutID;
        RequestAndLoadCVData(postURL);
    }

    function RequestAndLoadCVData(postURL, data) {

        $.ajax({
            url: postURL,
            type: "POST",
            //dataType: 'application/json charset=utf-8',
            data: data,
            contentType: false, // 'application/json; charset=utf-8',
            processData: false,
            success: function (result) {

                if (result == "session time out")
                    console.log('session time out');

                SetAutoApplyCheckBox(0);
                var json = $.parseJSON(result);
                $('#image-list').empty();
                for (var j = 0; j < json.length; j++) {
                    $('#image-list').append('<div class="seeker-item-box displayPanel">'
                                        + '<div class="col-xs-11 col-sm-11 col-md-11 no-mar-pad">'
                                            + '<div class="col-xs-12 col-sm-1 col-md-1"><span>'
                                                + '<image class="" src="/images/can/mc/20/20/attach-icon.png"/>'
                                            + '</span></div>'
                                            + '<div class="col-xs-12 col-sm-4 col-md-4 over-hide"><span>' + json[j]['CVName'] + '</span></div>'
                                            + '<div class="col-xs-12 col-sm-4 col-md-4 over-hide"><span>' + json[j]['FileName'] + '</span></div>'
                                            + '<div class="col-xs-12 col-sm-3 col-md-3"><span class="heading-text">Default CV</span> : '
                                                + (json[j]['DefaultCV'] == "1" ? "Yes" : "No") + '</div>'
                                        + '</div>'
                                        + '<div class="col-xs-1 col-sm-1 col-md-1 no-mar-pad text-right">'
                                            + '<span id="' + json[j]['CVVersionID'] + '"'
                                                + ' title="Edit" class="doc-edit editAction glyphicon glyphicon-edit" aria-hidden="true">'
                                            + '</span>'
                                            + '<span id="' + json[j]['CVVersionID'] + '"'
                                                + ' title="Edit" class="doc-edit editAction">Edit</span>'
                                            + '<span title="remove" id="' + json[j]['CVVersionID'] + '_' + json[j]['FileName'] + '"'
                                                + 'class="doc-delete removeAction glyphicon glyphicon-remove" aria-hidden="true" style="display:none;"></span>'
                                        + '</div>'
                                    + '</div>');

                    if (json[j]['DefaultCV'] == "1")
                        SetAutoApplyCheckBox(1);
                }

                //$('#chkDefaultApply').prop('checked', true);
                RefreshAutoApplyCheckBox();
                //$('#divAddCV').show();
                //$('.cv-entryPanel').hide(_duration);

                var imgCount = parseInt($('#hdnCVCount').val());
                imgCount = imgCount + 1;
                $('#hdnCVCount').val(imgCount);
                if (imgCount >= _maxCVCount) {
                    $('#img-fileuploader').hide();
                }
            },
            error: function (err) {
                console.log('Error - ' + err.statusText)
            }
        });
    }

    function CVChangeDefaultControlStyle() {
        changeDefaultControlStyle($('#fupload'));
        changeDefaultControlStyle($('#txtCVName'));

        $('#rfvChooseCV').text('');
        $('#rfvCVName').text('');
    }

    function ClearCVData() {
        $('#txtCVName').val('');
        $('#fupload').val('');
        $('#docprv').removeAttr('src');
        $('#chkDefaultApply').prop('checked', false);
        $('#divCVMsg').text('');

        $('#cv-uploader').show();
        $('#btnCVDelete').hide();
    }

    $("#btnCVUpload").click(function (evt) {
        CVChangeDefaultControlStyle();
        $('#divCVMsg').text('');
        var msg = '';

        if ($('#hdnCVID').val() == "0") {
            if ($("#fupload").get(0).files.length == 0) {
                msg = msg + (msg != "" ? ", " : "") + 'File';
                $('#rfvChooseCV').text('Please enter');
                changeWarningControlStyle($('#fupload'));
            }
        }
        if ($('#txtCVName').val().trim() == '') {
            msg = msg + (msg != "" ? ", " : "") + 'CV Name';
            $('#rfvCVName').text('Please enter');
            changeWarningControlStyle($('#txtCVName'));
        }
        if (msg != '') {
            //$('#divCVMsg').text(msg + ' must be filled!');
            //$('#divCVMsg').show();
            evt.preventDefault();
            return;
        }

        var fileUpload = $("#fupload").get(0);
        var files = fileUpload.files;
        var cvName = $('#txtCVName').val();
        var autoApply = 0;
        if ($('#chkDefaultApply').prop('checked'))
            autoApply = 1;

        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            data.append(files[i].name, files[i]);
        }

        {
            var postURL = "/Ajax/CVFileUploadHandler.ashx?";
            postURL = postURL + "Status=" + ($('#hdnCVID').val() != "0" ? 2 : 1);
            postURL = postURL + "&CVVersionID=" + $('#hdnCVID').val();
            postURL = postURL + "&UserID=" + userID + "&CVName=" + cvName + "&AutoApply=" + autoApply;
            RequestAndLoadCVData(postURL, data);

            ClearCVData();

            $('#divAddCV').show();
            $('.cv-entryPanel').hide(_duration);
        }

        $('#job-seeker-form').removeClass('disabled-div');
        if ($('#lblMobileHeaderComment').css('display') != "none")
            $(window).scrollTop($('#divAddCV').offset().top - 200);

        if (autoApply == 1)
            SetAutoApplyCheckBox(autoApply);
        SaveAndProceedDisableControl();

        evt.preventDefault();
    });
    //Image preview
    prvdoc = {
        UpdatePreview: function (obj) {
            $('#divCVMsg').empty();
            $('#rfvChooseCV').text('');

            if (!window.FileReader) {
            } else {
                var reader = new FileReader();
                var target = null;

                var fileExtension = '';
                if (obj.files[0] != null) {
                    fileExtension = obj.files[0]['name'];
                    fileExtension = fileExtension.substring(fileExtension.lastIndexOf('.') + 1);
                    if (fileExtension.indexOf('/') > 0)
                        fileExtension = fileExtension.substring(fileExtension.indexOf('/') + 1);
                }

                if (ValidateCVFile(fileExtension) == false || ValidateCVSize(obj.files[0].size) == false) {
                    // $('.cv-entryPanel').show(_duration);
                    // $('#divAddCV').hide(_duration);
                    return;
                }

                reader.onload = function (e) {
                    target = e.target || e.srcElement;

                    $("#docprv").prop("src", "/images/can/mc/25/25/attach-icon.png");
                    //$("#docprv").prop("src", target.result);

                };
                if (obj.files.count > 0)
                    reader.readAsDataURL(obj.files[0]);

                if ($('.cv-upload').prop("files")[0] != undefined) {
                    var name = $('.cv-upload').prop("files")[0]['name'];
                    var extIndex = name.lastIndexOf('.');
                    $('#txtCVName').val(name.substr(0, extIndex));
                    $('.cv-name').val(name.substr(0, extIndex));
                }
            }
        }
    };

    function ValidateCVSize(fileSize) {
        if (fileSize > (5 * 1024 * 1024)) {
            //$('#divCVMsg').show();
            //$('#divCVMsg').empty();
            //$('#divCVMsg').append("Sorry, your file size is too large, allowed file size is 2 MB.");
            $('#rfvChooseCV').text('Sorry, image size must be less than 5 MB, please try again.');
            $('.cv-upload').val('');
            return false;
        }

        return true;
    }

    //".doc", ".docx", ".pdf", 
    var _validCVExtensions = ["pdf", "doc", "msword", "docx", "vnd.openxmlformats-officedocument.wordprocessingml.document"];
    function ValidateCVFile(sFileName) {
        //var arrInputs = oForm.getElementsByTagName("input");
        //for (var i = 0; i < arrInputs.length; i++) {
        //var oInput = arrInputs[i];
        //if (oInput.type == "file") {
        //var sFileName = oInput.value;

        if (sFileName != '') {
            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _validCVExtensions.length; j++) {
                    var sCurExtension = _validCVExtensions[j];

                    if (sFileName.toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                    else if ("." + sFileName.toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                    else if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }

                if (!blnValid) {
                    //$('#divCVMsg').show();
                    //$('#divCVMsg').empty();
                    //$('#divCVMsg').append("Sorry, " + sFileName + " is invalid, allowed extensions are: " + _validCVExtensions.join(", "));
                    $('#rfvChooseCV').text("Sorry, " + sFileName + " is invalid, the allowed extensions are: " + _validCVExtensions.join(", "));
                    $('.cv-upload').val('');
                    return false;
                }
            }
        }
        //}
        //}

        return true;
    }

    // ----------------------------- Upload CV ----------------------------- //


    // ----------------------------- Start Premium Service ----------------------------- //
    // ----------------------------- Start Cover Image ----------------------------- //

    $("#btnUploadCover").click(function (evt) {
        var fileUpload = $(".fUploadCover").get(0);
        var files = fileUpload.files;

        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            data.append(files[i].name, files[i]);
        }

        var postURL = "/Ajax/FileUploadHandler.ashx?type=cover&AccountID=" + accountID;

        $.ajax({
            url: postURL,
            type: "POST",
            //dataType: 'application/json charset=utf-8',
            data: data,
            contentType: false, // 'application/json; charset=utf-8',
            processData: false,
            success: function (result) {

                var json = $.parseJSON(result);

                $('.fUploadCover').val('');
                $('.img-cover-prv').removeAttr('src');
                $('.input-group > input[type="text"]').val('');
                $('#divCoverSuccessMsg').append('Successfully saved Cover.');
            },
            error: function (err) {
                console.log('Error - ' + err.statusText);
            }
        });

        evt.preventDefault();
    });
    //Cover preview
    prvCover = {
        UpdateCoverPreview: function (obj) {
            $('#divCoverMsg').hide();
            if (!window.FileReader) {
            } else {
                var reader = new FileReader();
                var target = null;

                reader.onload = function (e) {
                    target = e.target || e.srcElement;

                    var fileExtension = target.result;
                    fileExtension = fileExtension.substring(0, fileExtension.indexOf(';'));
                    if (fileExtension.indexOf('/') > 0)
                        fileExtension = fileExtension.substring(fileExtension.indexOf('/') + 1);
                    
                    if (ValidateCoverSize(obj.files[0].size) == false || ValidateCoverFile(fileExtension) == false) {
                        $('.fUploadCover').val('');
                        $(".img-cover-prv").prop("src", '/images/add-a-cover.png');
                        return;
                    }

                    $(".img-cover-prv").prop("src", target.result);
                };
                reader.readAsDataURL(obj.files[0]);
            }
        }
    };


    function ValidateCoverSize(fileSize) {
        $('#divCoverMsg').empty();

        if (fileSize > 750 * 1024) {
            $('#divCoverMsg').show();
            $('#divCoverMsg').empty();
            $('#divCoverMsg').append("Sorry, image size must be less than 750kb, please try again.");
            return false;
        }

        return true;
    }

    //".png", ".jpg", ".jpeg", 
    function ValidateCoverFile(sFileName) {
        $('#divCoverMsg').empty();

        if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validProfilePhotoExtensions.length; j++) {
                var sCurExtension = _validProfilePhotoExtensions[j];

                if (sFileName.toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
                else if ("." + sFileName.toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
                else if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
            }

            if (!blnValid) {
                $('#divCoverMsg').show();
                $('#divCoverMsg').empty();
                $('#divCoverMsg').append("Sorry, " + sFileName + " is invalid, the allowed extensions are: " + _validProfilePhotoExtensions.join(", "));
                return false;
            }
        }
        //}
        //}

        return true;
    }

    // ----------------------------- End Cover Image ----------------------------- //

    // ----------------------------- Start Employer Recommend Image ----------------------------- //


    //$(document).on('click', '.emp-recommend-save', function () {
    //    $("#divAddEmpRecommend").show(_duration);
    //    $(".emp-recommend-entryPanel").hide(_duration);
    //});

    $('#divAddEmpRecommend').on('click', function () {
        EmpRecommendChangeDefaultControlStyle();
        ClearEmpRecommendData();
        $('#divAddEmpRecommend').hide();
        $('#btnDeleteEmpRecommend').hide();
        $('.emp-recommend-entryPanel').show(_duration);
    });
    $(document).on('click', '.emp-recommend-cancel', function () {
        EmpRecommendChangeDefaultControlStyle();
        ClearEmpRecommendData();
        ReloadEmpRecommendData('');

        if (parseInt($('#hdnEmpRecommendCount').val()) >= _maxEmpRecommendCount) {
            $('#divAddEmpRecommend').hide();
        }
        else {
            $('#divAddEmpRecommend').show();
        }

        $(".emp-recommend-entryPanel").hide(_duration);
    });

    $("#btnSaveEmpRecommend").click(function (evt) {

        EmpRecommendChangeDefaultControlStyle();
        $('#divEmpRecommendMsg').text('');
        var msg = '';

        //if ($('#hdnEmpRecommendID').val() == "") {
        //    if ($("#fUploadEmpRecommend").get(0).files.length == 0) {
        //        msg = msg + (msg != "" ? ", " : "") + 'File';
        //        $('#rfvChooseEmpRecommend').text('Please enter');
        //        changeWarningControlStyle($('#fUploadEmpRecommend'));
        //    }
        //}
        if ($('#txtEmpRecommendName').val().trim() == '') {
            msg = msg + (msg != "" ? ", " : "") + 'Name';
            $('#rfvEmpRecommendName').text('Please enter');
            changeWarningControlStyle($('#txtEmpRecommendName'));
        }
        if ($('#txtEmpRecommendTitle').val().trim() == '') {
            msg = msg + (msg != "" ? ", " : "") + 'Title';
            $('#rfvEmpRecommendTitle').text('Please enter');
            changeWarningControlStyle($('#txtEmpRecommendTitle'));
        }
        if ($('#txtEmpRecommendRemark').val().trim() == '') {
            msg = msg + (msg != "" ? ", " : "") + 'Remark';
            $('#rfvEmpRecommendRemark').text('Please enter');
            changeWarningControlStyle($('#txtEmpRecommendRemark'));
        }
        if (msg != '') {
            //$('#divCVMsg').text(msg + ' must be filled!');
            //$('#divCVMsg').show();
            evt.preventDefault();
            return;
        }

        var fileUpload = $("#fUploadEmpRecommend").get(0);
        var files = fileUpload.files;
        var name = encodeURIComponent($('#txtEmpRecommendName').val());
        var title = encodeURIComponent($('#txtEmpRecommendTitle').val());
        var remark = encodeURIComponent($('#txtEmpRecommendRemark').val());
        var image = $('#hdnEmpRecommendImage').val();

        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            data.append(files[i].name, files[i]);
        }

        {
            var postURL = "/Ajax/FileUploadHandler.ashx?type=emp-recommend";
            postURL = postURL + "&Status=" + ($('#hdnEmpRecommendID').val() != "" ? 2 : 1);
            postURL = postURL + "&EmployerRecommendID=" + $('#hdnEmpRecommendID').val();
            postURL = postURL + "&AccountID=" + accountID + "&Name=" + name + "&Title=" + title + "&Remark=" + remark + "&Image=" + image;
            RequestAndLoadEmpRecommendData(postURL, data);

            ClearEmpRecommendData();

            var count = parseInt($('#hdnEmpRecommendCount').val());
            count = count + 1;
            $('#hdnEmpRecommendCount').val(count);
            if (parseInt($('#hdnEmpRecommendCount').val()) >= _maxEmpRecommendCount) {
                $('#divAddEmpRecommend').hide();
            }
            else {
                $('#divAddEmpRecommend').show();
            }
        }

        evt.preventDefault();
        $(".emp-recommend-entryPanel").hide(_duration);

    });
    //Cover preview
    prvEmpRecommend = {
        UpdateEmpRecommendPreview: function (obj) {
            $('#divEmpRecommendMsg').hide();
            if (!window.FileReader) {
            } else {
                var reader = new FileReader();
                var target = null;

                reader.onload = function (e) {
                    target = e.target || e.srcElement;

                    var fileExtension = target.result;
                    fileExtension = fileExtension.substring(0, fileExtension.indexOf(';'));
                    if (fileExtension.indexOf('/') > 0)
                        fileExtension = fileExtension.substring(fileExtension.indexOf('/') + 1);

                    if (ValidateEmpRecommendSize(obj.files[0].size) == false || ValidateEmpRecommendFile(fileExtension) == false) {
                        $('#fUploadEmpRecommend').val('');
                        $("#imgEmpRecommendPrv").prop("src", '/images/male.jpg');
                        return;
                    }

                    $("#imgEmpRecommendPrv").prop("src", target.result);
                };
                reader.readAsDataURL(obj.files[0]);
            }
        }
    };

    $(document).on('click', '#btnDeleteEmpRecommend', function () {

        if (confirm('Are you sure you want to Delete ?')) {
            var postURL = "/Ajax/FileUploadHandler.ashx?type=emp-recommend&Status=4&AccountID=" + accountID + "&EmployerRecommendID=" + $('#hdnEmpRecommendID').val();
            $.ajax({
                url: postURL,
                type: "POST",
                contentType: false,
                processData: false,
                success: function (result) {

                    var json = $.parseJSON(result);
                    $('#emp-recommend-list').empty();
                    for (var j = 0; j < json.length; j++) {
                        
                        var img = json[j]['Image'];
                        var lnk = "";
                        if (img != "") {
                            lnk = '/images/employer-recommend/c-' + json[j]['AccountID'] + '/can/mc/' + json[j]['Image'];
                            img = '/images/employer-recommend/c-' + json[j]['AccountID'] + '/can/mc/100/100/' + json[j]['Image'];
                        }
                        else {
                            lnk = "/images/can/mc/male.jpg";
                            img = "/images/can/mc/100/100/male.jpg";
                        }

                        //$('#emp-recommend-list').append('<div class="col-xs-12 col-md-12 no-pad-left displayPanel">'
                        //                    + '<div class="col-xs-11 col-md-11 no-mar-pad">'
                        //                        + '<div class="col-xs-2 col-sm-2 col-md-2">'
                        //                            + '<a data-lightbox="emp-recommend-image" href="' + lnk + '">'
                        //                                    + '<img class="img-circle img-emp-recommend" src="' + img + '" />'
                        //                            + '</a>'
                        //                        + '</div>'
                        //                        + '<div class="col-xs-10 col-md-10 no-mar-pad">'
                        //                            + '<div class="col-xs-6 col-sm-4 col-md-4 over-hide">'
                        //                                + '<span class="heading-text">Name :' + '</span> ' + json[j]['Name']
                        //                            + '</div>'
                        //                            + '<div class="col-xs-6 col-sm-8 col-md-8 over-hide">'
                        //                                + '<span class="heading-text">Title :' + '</span> ' + json[j]['Title']
                        //                            + '</div>'
                        //                            + '<div class="col-xs-12 col-sm-12 col-md-12">'
                        //                                + '<span class="heading-text">Remark :' + '</span> ' + json[j]['Remark']
                        //                            + '</div>'
                        //                        + '</div>'
                        //                    + '</div>'
                        //                    + '<div class="col-xs-1 col-sm-1 col-md-1 no-mar-pad text-right">'
                        //                        + '<span id="' + json[j]["EmployerRecommendID"] + '" title="edit" class="emp-recommend-edit editAction glyphicon glyphicon-edit" aria-hidden="true"></span>'
                        //                        + '<span id="' + json[j]["EmployerRecommendID"] + '" title="edit" class="emp-recommend-edit editAction">Edit</span>'
                        //                        + '<span id="' + json[j]["EmployerRecommendID"] + '" title="remove" class="emp-recommend-remove removeAction glyphicon glyphicon-remove" aria-hidden="true" style="display: none"></span>'
                        //                    + '</div>'
                        //                + '</div>');

                        
                        $('#emp-recommend-list').append('<div class="col-xs-12 col-md-12 no-pad-left displayPanel">'
                                                + '<div class="col-xs-12 col-sm-11 col-md-11 no-mar-pad">'
                                                    + '<div class="col-xs-12 col-sm-2 col-md-2 emp-recommend-img-box">'
                                                        + '<div class="col-xs-8 col-sm-12 no-mar-pad">'
                                                            + '<a data-lightbox="emp-recommend-image" href="' + lnk + '">'
                                                                + '<img class="img-circle img-emp-recommend" src="' + img + '" />'
                                                            + '</a>'
                                                        + '</div>'
                                                        + '<div class="col-xs-4 no-mar-pad text-right emp-recommend-eidt-m">'
                                                            + '<span id="' + json[j]["EmployerRecommendID"] + '" title="edit" class="emp-recommend-edit editAction glyphicon glyphicon-edit" aria-hidden="true"></span>'
                                                            + '<span id="' + json[j]["EmployerRecommendID"] + '" title="edit" class="emp-recommend-edit editAction">Edit</span>'
                                                            + '<span id="' + json[j]["EmployerRecommendID"] + '" title="remove" class="emp-recommend-remove removeAction glyphicon glyphicon-remove" aria-hidden="true" style="display: none"></span>'
                                                        + '</div>'
                                                    + '</div>'
                                                    + '<div class="col-xs-12 col-md-10 no-mar-pad">'
                                                        + '<div class="col-xs-12 col-sm-4 col-md-4 over-hide">'
                                                            + '<span class="heading-text">Name :</span>' + json[j]['Name']
                                                        + '</div>'
                                                        + '<div class="col-xs-12 col-sm-8 col-md-8 over-hide">'
                                                            + '<span class="heading-text">Title :' + json[j]['Title']
                                                        + '</div>'
                                                        + '<div class="col-xs-12 col-sm-12 col-md-12">'
                                                            + '<span class="heading-text">Remark :</span>' + json[j]['Remark']
                                                        + '</div>'
                                                    + '</div>'
                                                + '</div>'
                                                + '<div class="col-xs-2 col-sm-1 col-md-1 no-mar-pad text-right emp-recommend-eidt">'
                                                    + '<span id="' + json[j]["EmployerRecommendID"] + '" title="edit" class="emp-recommend-edit editAction glyphicon glyphicon-edit" aria-hidden="true"></span>'
                                                    + '<span id="' + json[j]["EmployerRecommendID"] + '" title="edit" class="emp-recommend-edit editAction">Edit</span>'
                                                    + '<span id="' + json[j]["EmployerRecommendID"] + '" title="remove" class="emp-recommend-remove removeAction glyphicon glyphicon-remove" aria-hidden="true" style="display: none"></span>'
                                                + '</div>'
                                            + '</div>');
                    }

                    ClearEmpRecommendData();

                    var count = parseInt($('#hdnEmpRecommendCount').val());
                    count = count - 1;
                    $('#hdnEmpRecommendCount').val(count);
                    if (parseInt($('#hdnEmpRecommendCount').val()) < _maxEmpRecommendCount) {
                        $('#divAddEmpRecommend').show();
                    }
                },
                error: function (err) {
                    console.log('Error - ' + err.statusText)
                }
            });

            $('#divAddEmpRecommend').show();
            $('.emp-recommend-entryPanel').hide(_duration);
        }
    });

    $(document).on('click', '.emp-recommend-edit', function () {

        $('#divAddEmpRecommend').hide();
        $('#btnDeleteEmpRecommend').show();
        ReloadEmpRecommendData($(this).attr('id'));
        SelectEmpRecommendData($(this).attr('id'));
        
    });

    function SelectEmpRecommendData(empRecommendID) {
        $('#divEmpRecommendAdd').hide(_duration);
        $(".emp-recommend-entryPanel").show(_duration);

        var postURL = "/Ajax/FileUploadHandler.ashx?type=emp-recommend";
        postURL = postURL + "&Status=3";
        postURL = postURL + "&AccountID=" + accountID;
        postURL = postURL + "&EmployerRecommendID=" + empRecommendID;

        $.ajax({
            url: postURL,
            type: "POST",
            //dataType: 'application/json charset=utf-8',
            //data: data,
            contentType: false, // 'application/json; charset=utf-8',
            processData: false,
            success: function (result) {
                var json = $.parseJSON(result);
                $('#hdnEmpRecommendID').val(json.EmployerRecommendID);
                $('#txtEmpRecommendName').val(json.Name);
                $('#txtEmpRecommendTitle').val(json.Title);
                $('#txtEmpRecommendRemark').val(json.Remark);
                $('#hdnEmpRecommendImage').val(json.Image);

                if (json.Image != "")
                    $('#imgEmpRecommendPrv').prop('src', '/images/employer-recommend/c-' + accountID + '/' + json.Image);
                else
                    $('#imgEmpRecommendPrv').prop('src', '/images/male.jpg');
            },
            error: function (err) {
                console.log('Error - ' + err.statusText)
            }
        });
    }

    function ReloadEmpRecommendData(withoutID) {
        var postURL = "/Ajax/FileUploadHandler.ashx?type=emp-recommend&Status=5&AccountID=" + accountID + "&withoutID=" + withoutID;
        RequestAndLoadEmpRecommendData(postURL);
    }

    function RequestAndLoadEmpRecommendData(postURL, data) {

        $.ajax({
            url: postURL,
            type: "POST",
            //dataType: 'application/json charset=utf-8',
            data: data,
            contentType: false, // 'application/json; charset=utf-8',
            processData: false,
            success: function (result) {

                if (result == "session time out")
                    console.log('session time out');
                
                var json = $.parseJSON(result);
                $('#emp-recommend-list').empty();
                for (var j = 0; j < json.length; j++) {

                    var img = json[j]['Image'];
                    var lnk = "";
                    if (img != "") {
                        lnk = '/images/employer-recommend/c-' + json[j]['AccountID'] + '/can/mc/' + json[j]['Image'];
                        img = '/images/employer-recommend/c-' + json[j]['AccountID'] + '/can/mc/100/100/' + json[j]['Image'];
                    }
                    else {
                        lnk = "/images/can/mc/male.jpg";
                        img = "/images/can/mc/100/100/male.jpg";
                    }

                    //$('#emp-recommend-list').append('<div class="col-xs-12 col-md-12 no-pad-left displayPanel">'
                    //                    + '<div class="col-xs-11 col-md-11 no-mar-pad">'
                    //                        + '<div class="col-xs-2 col-sm-2 col-md-2">'
                    //                            + '<a data-lightbox="emp-recommend-image" href="' + lnk + '">'
                    //                                    + '<img class="img-circle img-emp-recommend" src="' + img + '" />'
                    //                            + '</a>'
                    //                        + '</div>'
                    //                        + '<div class="col-xs-10 col-md-10 no-mar-pad">'
                    //                            + '<div class="col-xs-6 col-sm-4 col-md-4 over-hide">'
                    //                                + '<span class="heading-text">Name :' + '</span> ' + json[j]['Name']
                    //                            + '</div>'
                    //                            + '<div class="col-xs-6 col-sm-8 col-md-8 over-hide">'
                    //                                + '<span class="heading-text">Title :' + '</span> ' + json[j]['Title']
                    //                            + '</div>'
                    //                            + '<div class="col-xs-12 col-sm-12 col-md-12">'
                    //                                + '<span class="heading-text">Remark :' + '</span> ' + json[j]['Remark']
                    //                            + '</div>'
                    //                        + '</div>'
                    //                    + '</div>'
                    //                    + '<div class="col-xs-1 col-sm-1 col-md-1 no-mar-pad text-right">'
                    //                        + '<span id="' + json[j]["EmployerRecommendID"] + '" title="edit" class="emp-recommend-edit editAction glyphicon glyphicon-edit" aria-hidden="true"></span>'
                    //                        + '<span id="' + json[j]["EmployerRecommendID"] + '" title="edit" class="emp-recommend-edit editAction">Edit</span>'
                    //                        + '<span id="' + json[j]["EmployerRecommendID"] + '" title="remove" class="emp-recommend-remove removeAction glyphicon glyphicon-remove" aria-hidden="true" style="display: none"></span>'
                    //                    + '</div>'
                    //                + '</div>');


                    $('#emp-recommend-list').append('<div class="col-xs-12 col-md-12 no-pad-left displayPanel">'
                                            + '<div class="col-xs-12 col-sm-11 col-md-11 no-mar-pad">'
                                                + '<div class="col-xs-12 col-sm-2 col-md-2 emp-recommend-img-box">'
                                                    + '<div class="col-xs-8 col-sm-12 no-mar-pad">'
                                                        + '<a data-lightbox="emp-recommend-image" href="' + lnk + '">'
                                                            + '<img class="img-circle img-emp-recommend" src="' + img + '" />'
                                                        + '</a>'
                                                    + '</div>'
                                                    + '<div class="col-xs-4 no-mar-pad text-right emp-recommend-eidt-m">'
                                                        + '<span id="' + json[j]["EmployerRecommendID"] + '" title="edit" class="emp-recommend-edit editAction glyphicon glyphicon-edit" aria-hidden="true"></span>'
                                                        + '<span id="' + json[j]["EmployerRecommendID"] + '" title="edit" class="emp-recommend-edit editAction">Edit</span>'
                                                        + '<span id="' + json[j]["EmployerRecommendID"] + '" title="remove" class="emp-recommend-remove removeAction glyphicon glyphicon-remove" aria-hidden="true" style="display: none"></span>'
                                                    + '</div>'
                                                + '</div>'
                                                + '<div class="col-xs-12 col-md-10 no-mar-pad">'
                                                    + '<div class="col-xs-12 col-sm-4 col-md-4 over-hide">'
                                                        + '<span class="heading-text">Name :</span>' + json[j]['Name']
                                                    + '</div>'
                                                    + '<div class="col-xs-12 col-sm-8 col-md-8 over-hide">'
                                                        + '<span class="heading-text">Title :' + json[j]['Title']
                                                    + '</div>'
                                                    + '<div class="col-xs-12 col-sm-12 col-md-12">'
                                                        + '<span class="heading-text">Remark :</span>' + json[j]['Remark']
                                                    + '</div>'
                                                + '</div>'
                                            + '</div>'
                                            + '<div class="col-xs-2 col-sm-1 col-md-1 no-mar-pad text-right emp-recommend-eidt">'
                                                + '<span id="' + json[j]["EmployerRecommendID"] + '" title="edit" class="emp-recommend-edit editAction glyphicon glyphicon-edit" aria-hidden="true"></span>'
                                                + '<span id="' + json[j]["EmployerRecommendID"] + '" title="edit" class="emp-recommend-edit editAction">Edit</span>'
                                                + '<span id="' + json[j]["EmployerRecommendID"] + '" title="remove" class="emp-recommend-remove removeAction glyphicon glyphicon-remove" aria-hidden="true" style="display: none"></span>'
                                            + '</div>'
                                        + '</div>');
                }
            },
            error: function (err) {
                console.log('Error - ' + err.statusText)
            }
        });
    }

    function EmpRecommendChangeDefaultControlStyle() {
        changeDefaultControlStyle($('#txtEmpRecommendName'));
        changeDefaultControlStyle($('#txtEmpRecommendTitle'));
        changeDefaultControlStyle($('#txtEmpRecommendRemark'));
        $('#fuEmpRecommend').find('input:text').val('');

        $('#rfvEmpRecommendName').text('');
        $('#rfvEmpRecommendTitle').text('');
        $('#rfvEmpRecommendRemark').text('');
        $('#rfvChooseEmpRecommend').text('');
    }

    function ClearEmpRecommendData() {
        $('#hdnEmpRecommendID').val('');
        $('#txtEmpRecommendName').val('');
        $('#txtEmpRecommendTitle').val('');
        $('#txtEmpRecommendRemark').val('');
        $('#fUploadEmpRecommend').val('');
        $('#imgEmpRecommendPrv').prop('src', '/images/male.jpg');
        $('#divEmpRecommendMsg').text('');

        $('#cv-uploader').show();
        $('#btnCVDelete').hide();
    }

    function ValidateEmpRecommendSize(fileSize) {
        $('#divEmpRecommendMsg').empty();

        if (fileSize > 750 * 1024) {
            $('#divEmpRecommendMsg').show();
            $('#divEmpRecommendMsg').empty();
            $('#divEmpRecommendMsg').append("Sorry, image size must be less than 750kb, please try again.");
            $('#fuEmpRecommend').find('input:text').val('');
            return false;
        }

        return true;
    }

    //".png", ".jpg", ".jpeg", 
    function ValidateEmpRecommendFile(sFileName) {
        $('#divEmpRecommendMsg').empty();

        if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validProfilePhotoExtensions.length; j++) {
                var sCurExtension = _validProfilePhotoExtensions[j];

                if (sFileName.toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
                else if ("." + sFileName.toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
                else if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
            }

            if (!blnValid) {
                $('#divEmpRecommendMsg').show();
                $('#divEmpRecommendMsg').empty();
                $('#divEmpRecommendMsg').append("Sorry, " + sFileName + " is invalid, the allowed extensions are: " + _validProfilePhotoExtensions.join(", "));
                $('#fuEmpRecommend').find('input:text').val('');
                return false;
            }
        }
        //}
        //}

        return true;
    }

    // ----------------------------- End Employer Recommend ----------------------------- //
    // ----------------------------- End Premium Service ----------------------------- //

});
