$.fn.SageTabs = function (p) {
    p = $.extend({

    }, p);
    $this = $(this);
    $this.find('ul > li').on('click', function () {
        var $li = $(this);
        $this.find(' ul > li').removeClass('active');
        $this.find('.imageeditor').hide();
        var id = $li.attr('data-div');
        $li.addClass('active');
        $this.find('#' + id).show();
    });
};

(function ($) {
    var imageExtension = '';
    var videoExtension = '';
    var documentExtension = '';
    var pageSize = 100;
    var pageCount = 1;
    var downloadPath = '';
    var onlineResultCount = 0;
    $.ManageSetting = function (p) {
        p = $.extend({
            modulePath: '/Modules/Admin/MediaManagement/',
            userModuleID: '',
            culture: 'en-US',
            mediaType: '*'
        }, p);
        Setting = {
            config: {
                isPostBack: false,
                async: false,
                cache: false,
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                data: '{}',
                dataType: 'json',
                crossDomain: true,
                baseURL: p.modulePath + 'Services/webservice.asmx/',
                method: "",
                url: "",
                ajaxCallMode: "",
                userModuleID: p.userModuleID
            },
            init: function () {
                Setting.Events();
                Setting.GetSettings(1, 2);
                $('#tabWrapper').SageTabs();
            },
            fileUpload: function (filePath) {
                var html = '<div class="droppable" id="dvUploadWrapperDrop"><p><i class="fa fa-cloud-upload" aria-hidden="true"></i>Drag files here or click to upload</p></div>';
                $('.fileUploader').html(html);
                Setting.FileUploader('MediaFile',
                    "#dvUploadWrapperDrop",
                    '.productList',
                    'png,jpg',
                    filePath + '/',
                    Setting.FileUploaded);
            },
            FileUploader: function (fileClassName, dragZone, outputMessageID, extension, savaPath, callback) {
                $(this).DragUploader({
                    userModuleID: p.userModuleID,
                    extension: extension,
                    response: '',
                    outputMessageID: outputMessageID,
                    fileClassName: fileClassName,
                    PortalID: SageFramePortalID,
                    UserName: SageFrameUserName,
                    path: p.componentPath,
                    dragZone: dragZone,
                    savaPath: savaPath,
                    encodeQuality: '20L',
                    callback: callback,
                    UploadHandlerPath: SageFrameAppPath + '/Modules/Admin/MediaManagement/'
                });
            },
            FileUploaded: function (response) {
                if (response != null) {
                    var resp = response.split("###");
                    if (resp[0] == "1") {
                        var rootFolderPath = $('#CategoryListing').attr('data-rootfolder');
                        Setting.GetmediaCategoryByPath(rootFolderPath);
                    }
                    else {
                        //error here
                        SageFrame.messaging.show("Not a valid file Extension", "alert");
                    }
                }
            },

            Events: function () {
                $('#btnSaveSetting').on('click', function () {
                    var objSetting = {
                        "MediaSetting": {
                            "FolderName": $('#txtfolderName').val().trim(),
                            "MediaVisibility": $('#rdReuseable').is(':checked') ? "reuse" : "userwise",
                            "MediaReadLocation": $('#rdFromSytem').is(':checked') ? "system" : "medialocation",
                            "MediaIgnoreFolders": $('#txtIgnoreFolder').val(),
                            "AllowCategory": $('#chkAllowCategory').is(':checked'),
                            "ImageExtension": $('#txtImageExtension').val(),
                            "VideoExtension": $('#txtvideoExtension').val(),
                            "DocumentExtension": $('#txtdocumentExtension').val(),
                            "OptimizeImage": $('#chkAllowOptimization').is(':checked'),
                            "ScaleImage": $('#txtScaleImage').val()
                        }

                        //{ 'key': "FolderName", 'value': $('#txtfolderName').val().trim() },
                        //{ 'key': "MediaVisibility", 'value': $('#rdReuseable').is(':checked') ? "reuse" : "userwise" },
                        //{ 'key': "MediaReadLocation", 'value': $('#rdFromSytem').is(':checked') ? "system" : "medialocation" },
                        //{ 'key': "MediaIgnoreFolders", 'value': $('#txtIgnoreFolder').val() },
                        //{ 'key': "AllowCategory", 'value': $('#chkAllowCategory').is(':checked') },
                        //{ 'key': "ImageExtension", 'value': $('#txtImageExtension').val() },
                        //{ 'key': "VideoExtension", 'value': $('#txtvideoExtension').val() },
                        //{ 'key': "DocumentExtension", 'value': $('#txtdocumentExtension').val() }

                    };
                    Setting.SaveSettings(objSetting);
                });
                $('#spnMediaSetting').on('click', function () {
                    Setting.GetSettings(1, 1);
                    Setting.ShowSettings();
                });
                $('#btnCancelSettings').on('click', function () {
                    Setting.GetSettings(1, 2);
                    Setting.ShowMediaList();
                });
                $('#btnSearch').on('click', function () {
                    pageCount = 1;
                    var rootFolderPath = $('#CategoryListing').attr('data-rootfolder');
                    var filterFile = $('#txtSearchFile').val().trim();
                    var searchType = parseInt($("input[name='rdbSearch']:checked").val());
                    if (searchType == 1) {
                        if (rootFolderPath.length > 0 && filterFile.length > 0) {
                            Setting.FilterMediaByPath(rootFolderPath, filterFile);
                        }
                    }
                    else {
                        if (filterFile != "") {
                            $("#CategoryListing").html('');
                            Setting.GetImageFromOnline(filterFile, pageSize, pageCount);
                        }
                        else {
                            SageAlertDialog("Please enter search key", "search key needed");
                        }
                    }
                });
                $('#refreshSearch').on('click', function () {
                    var rootFolderPath = $('#CategoryListing').attr('data-rootfolder');
                    $('#txtSearchFile').val('');
                    pageCount = 1;
                    $("input[name='rdbSearch'][value='1']").prop("checked", true);
                    Setting.FilterMediaByPath(rootFolderPath, '*');
                });
                $('#backtoMediaList').on('click', function () {
                    //Setting.GetSettings(1, 2);
                    var rootFolderPath = $('#CategoryListing').attr('data-rootfolder');
                    Setting.GetmediaCategoryByPath(rootFolderPath);
                    Setting.ShowMediaList();
                });
                $('#btnSaveCroppedImage').on('click', function () {
                    $('#btnCropped').trigger('click');
                    var imageCropping = $('#imgCropping');
                    var folderPath = imageCropping.attr('data-imagepath');
                    var image64 = $('#clientImage').attr('src');
                    if (folderPath != null && folderPath.length > 0) {
                        Setting.SaveCroppedImage(folderPath, image64);
                    }
                });
            },
            ParseImagepath: function (imagePath) {

            },
            ShowSettings: function () {
                $('#dvMediaList').hide();
                $('#dvSettings').show();
                $('#imagemanipulate').hide();
            },
            ShowMediaList: function () {
                $('#dvMediaList').show();
                $('#dvSettings').hide();
                $('#imagemanipulate').hide();
            },
            ShowImageDetailList: function () {
                $('#dvMediaList').hide();
                $('#dvSettings').hide();
                $('#imagemanipulate').show();
            },
            SaveCroppedImage: function (folderPath, image64Bit) {
                var objImageInfo =
                    {
                        Image64Bit: image64Bit,
                        ImageFullPath: folderPath,
                        PortalID: parseInt(SageFramePortalID),
                        UserModuleID: p.userModuleID,
                        UserName: SageFrameUserName,
                        secureToken: SageFrameSecureToken
                    }
                this.config.method = "SaveCroppedImage";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    objImageInfo: objImageInfo
                });
                this.config.ajaxCallMode = 5;
                this.ajaxCall(this.config);
            },
            SaveSettings: function (objSetting) {
                var objMediaSetting =
                    {
                        MediaSettingID: $('#hdnMembershipID').val(),
                        SettingKeyValue: JSON2.stringify(objSetting),
                        PortalID: parseInt(SageFramePortalID),
                        UserModuleID: p.userModuleID,
                        Culture: p.culture
                    }
                this.config.method = "AddUpdate";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    objMediaSetting: objMediaSetting,
                    userName: SageFrameUserName,
                    secureToken: SageFrameSecureToken
                });
                this.config.ajaxCallMode = 0;
                this.ajaxCall(this.config);
            },
            GetSettings: function (MediaSettingID, ajaxCallMode) {
                var objMediaSetting =
                    {
                        MediaSettingID: MediaSettingID,
                        PortalID: parseInt(SageFramePortalID),
                        UserModuleID: p.userModuleID,
                        Culture: p.culture
                    }
                this.config.method = "GetSettings";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    objMediaSetting: objMediaSetting,
                    userName: SageFrameUserName,
                    secureToken: SageFrameSecureToken
                });
                this.config.ajaxCallMode = ajaxCallMode;
                this.ajaxCall(this.config);
            },

            GetmediaCategory: function () {
                var objMediaCategory =
                {
                    PortalID: parseInt(SageFramePortalID),
                    UserModuleID: p.userModuleID,
                    UserName: SageFrameUserName,
                    secureToken: SageFrameSecureToken
                };
                this.config.method = "GetMediaCategory";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    objMediaCategory: objMediaCategory,
                });
                this.config.ajaxCallMode = 4;
                this.ajaxCall(this.config);
            },
            GetmediaCategoryByPath: function (baseCategoryPath) {
                var objMedaicategory =
                {
                    PortalID: parseInt(SageFramePortalID),
                    UserModuleID: p.userModuleID,
                    UserName: SageFrameUserName,
                    secureToken: SageFrameSecureToken,
                    BaseCategory: baseCategoryPath,
                    UploadType: p.mediaType
                };
                this.config.method = "GetMediaCategoryByPath";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    objMedaicategory: objMedaicategory,
                });
                this.config.ajaxCallMode = 4;
                this.ajaxCall(this.config);
            },
            FilterMediaByPath: function (baseCategoryPath, filter) {
                var objMedaicategory =
                {
                    PortalID: parseInt(SageFramePortalID),
                    UserModuleID: p.userModuleID,
                    UserName: SageFrameUserName,
                    secureToken: SageFrameSecureToken,
                    BaseCategory: baseCategoryPath,
                    Filter: filter
                };
                this.config.method = "FilterMediaByPath";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    objMedaicategory: objMedaicategory,
                });
                this.config.ajaxCallMode = 4;
                this.ajaxCall(this.config);
            },
            GetImageFromOnline: function (searchText, pageSize, pageCount) {
                var apiKey = 'se5gcq9nvk8qdysrd9wn7szq';
                var url = '';
                url = "https://api.gettyimages.com/v3/search/images?fields=id,title,thumb,referral_destinations&phrase=" + searchText + "&sort_order=most_popular&page=" + pageCount + "&page_size=" + pageSize + "";
                $.ajax(
                {
                    type: 'GET',
                    url: url,
                    beforeSend: function (request) {
                        request.setRequestHeader("Api-Key", apiKey);
                    }
                }).done(function (data) {
                    Setting.BindOnlineImages(data);
                    $('#CategoryListing').off().on('scroll', function (e) {
                        var elem = $(e.currentTarget);
                        if (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight()) {
                            if (pageCount * pageSize < onlineResultCount) {
                                pageCount = pageCount + 1;
                                var filterFile = $('#txtSearchFile').val().trim();
                                var searchType = parseInt($("input[name='rdbSearch']:checked").val());
                                if (searchType == 2) {
                                    Setting.GetImageFromOnline(filterFile, pageSize, pageCount);
                                }
                            }
                        }
                    });
                }).fail(function (data) {

                });
            },
            BindOnlineImages: function (data) {
                var html = '';
                var html = '<ul class="ulOnlineImages">';
                if (data.images.length > 0) {
                    onlineResultCount = data.result_count;
                    for (var i = 0; i < data.images.length; i++) {
                        var title = data.images[i].title.trim();
                        title = title.replace(/[^a-zA-Z0-9]/g, '-');
                        title = title.replace(/\-+/g, '-');
                        var id = data.images[i].id;
                        var downloadLink = 'http://media.gettyimages.com/photos/' + title + '-picture-id' + id + '';
                        //html += '<li class="liCategory" data-path="' + downloadLink + '">';
                        //html += '<span class="viewImage icons-wrapper"><i class="selectimage fa fa-sliders"></i>View</span>';
                        //html += '<span class="downloadImage icons-wrapper"><i class="selectimage fa fa-sliders"></i>Download</span>';
                        //html += '<img class="imgOnline" src="' + data.images[i].display_sizes[0].uri + '"/></li>';
                        html += '<li class="liCategory" data-path="' + downloadLink + '">';
                        html += '<span class="icons-wrapper">';
                        html += '<i class="viewImage fa fa-eye" title="view image" data-type="image"></i>';
                        html += '<i class="fa fa-download downloadImage" title="select image" data-type="image"></i>';
                        html += '</span>';
                        html += '<img class="imgOnline" src="' + data.images[i].display_sizes[0].uri + '" height="100px">';
                        html += '</li>';

                    }
                }
                else {
                    var imagePath = SageFrameHostURL + '/Modules/Admin/MediaManagement/images/nodataImg.jpg';
                    html += '<li class="nomediaData"><img height="100px" src="' + imagePath + '" /></li>';
                }
                html += '</ul>';
                $("#CategoryListing").append(html);

                $("#CategoryListing").off().on("click", "ul.ulOnlineImages span.viewImage", function () {
                    var href = $(this).parent('li').data('path');
                    var html = '<img src="' + href + '" />';
                    $(this).parent('li').AddPopUP(html);
                });
                $('.viewImage').on('click', function () {
                    $(this).parents('li.liCategory').find('img').trigger('click');
                });

                $("img.imgOnline").off().on("click", function () {
                    var $this = $(this);
                    var href = $this.parents('li.liCategory').data('path');
                    var html = '<div class="imageOnline"><img src="' + href + '" /></div>';
                    $('body').append(html);
                    $('.imageOnline').SimpleDialog({
                        "title": "Online Image",
                        "width": 700,
                        "height": 800,
                        "top": 0,
                        "close":
                            function (event, ui) {
                                $('body').find('.imageOnline').remove();
                            }
                    });
                });
                $(".downloadImage").off().on("click", function () {
                    var downloadImgUrl = $(this).parents('li.liCategory').data('path');
                    downloadPath = $("#CategoryListing").data('rootfolder');
                    downloadPath = downloadPath + "/DownloadedImage";
                    SageConfirmDialog('Are you sure you want to download image?').done(function () {
                        Setting.DownloadAndSaveImage(downloadImgUrl, downloadPath);
                    });
                });
            },
            DownloadAndSaveImage: function (downloadUrl) {
                this.config.method = "DownloadAndSaveImage";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    downloadUrl: downloadUrl,
                    downloadPath: downloadPath
                });
                this.config.ajaxCallMode = 6;
                this.ajaxCall(this.config);
            },
            BindEvents: function (objSettings) {
                //objSettings.FolderName 
                //objSettings.MediaVisibility 
                //objSettings.MediaReadLocation  
                //objSettings.MediaIgnoreFolders 
                //objSettings.AllowCategory
                //objSettings.ImageExtension
                //objSettings.VideoExtension
                //objSettings.DocumentExtension 
                //objSettings.OptimizeImage
                //objSettings.ScaleImage
                imageExtension = objSettings.ImageExtension;
                videoExtension = objSettings.VideoExtension;
                documentExtension = objSettings.DocumentExtension;

                var rootfolder = '';
                if (objSettings.MediaReadLocation == "system") {
                    rootfolder = '';
                }
                else {
                    rootfolder = objSettings.FolderName;
                }
                if (objSettings.MediaVisibility == "userwise") {
                    rootfolder += "\\" + SageFrameUserName;
                }
                $('#CategoryListing').attr('data-rootfolder', rootfolder);
                $('#CategoryListing').attr('data-MediaReadLocation', objSettings.MediaReadLocation);
                $('#CategoryListing').attr('data-Parentfolder', "");
                if (objSettings.AllowCategory) {
                    $('#categorycreator').show();
                    $('#btnAddCategory').on('click', function () {
                        var categoryName = $('#txtCategoryname').val().trim();
                        var rootfolderPath = $('#CategoryListing').attr('data-rootfolder');
                        //Check category if exists here
                        if (categoryName.length > 0) {
                            Setting.AddCategory(categoryName, rootfolderPath);
                        }
                    });
                }
                else {
                    $('#categorycreator').hide();
                }
                Setting.GetmediaCategory();
                Setting.CreateBreadcrumb();

            },
            GetFolderHerarchy: function (categoryName, rootfolderPath) {
                var objMediaCategory =
                {
                    BaseCategory: categoryName,
                    ParentCategory: $('#CategoryListing').attr('data-rootfolder'),
                    MediaSettingID: $('#hdnMembershipID').val(),
                    PortalID: parseInt(SageFramePortalID),
                    UserModuleID: p.userModuleID,
                    userName: SageFrameUserName,
                    secureToken: SageFrameSecureToken
                };
                this.config.method = "GetMediaFolderList";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    objMediaCategory: objMediaCategory,
                });
                this.config.async = false;
                this.config.ajaxCallMode = 7;
                this.ajaxCall(this.config);
            },
            FolderHerarchy: function (data) {
                var popupdata = '<div class="divCategoryList">';
                popupdata += '<div class="copyHeader">';
                popupdata += '<div id="tempMediaHolder"></div>';
                //popupdata += '<div class="sfButtonwrapper">';
                //popupdata += '<span class="sfBtn  sfHighlightBtn smlbtn-succ" title="Create group" id="spnTempCopy"><i class="fa fa-clipboard"></i>Copy to</span>';
                //popupdata += '<span class="sfBtn  sfHighlightBtn smlbtn-danger" title="Cancel group" id="spnTempMove"><i class="fa fa-arrows"></i>Move to</span>';
                popupdata += '<div class="sfRadiobutton sfRadioTab">';
                popupdata += '<span class="sfBtn smlbtn-succ">';
                popupdata += '<span class="icon-copy"></span>';

                popupdata += '<input id="rdCopy" name="movemode" style="display:none;" type="radio">';
                popupdata += '<label for="rdCopy" class=" movecopy">Copy To</label>';
                popupdata += '</span>';
                popupdata += '<span class="sfBtn smlbtn-succ">';
                popupdata += '<span class="icon-move"></span>';
                popupdata += '<input id="rdMove" name="movemode" style="display:none;" type="radio">';
                popupdata += '<label for="rdMove" class=" movecopy">Move To</label>';
                popupdata += '</span>';
                popupdata += '</div>';
                popupdata += '</div>';
                popupdata += data;
                popupdata += '<div class="sfButtonwrapper" style="display:none;">';
                popupdata += '<span class="sfBtn  sfHighlightBtn smlbtn-succ" title="Create group" id="spnCopy"><span class="fa fa-clipboard"></i>Copy to</span>';
                popupdata += '<span class="sfBtn  sfHighlightBtn smlbtn-danger" title="Cancel group" id="spnMove"><i class="fa fa-arrows"></i>Move to</span>';
                popupdata += '</div>';
                popupdata += '<div class="SelectedFolder" style="display:none;">';
                popupdata += '<label>Destination category: </label><span class="selFolderPath" data-pathSrc="">';
                popupdata += '</span>';
                popupdata += '</div>';
                popupdata += '<div class="sfButtonwrapper buttonClick">';
                popupdata += '<span class="sfBtn  sfHighlightBtn smlbtn-succ" style="display:none;" id="spnSave"><i class="icon-save"></i>Save</span>';
                popupdata += '</div>';
                popupdata += '</div>';
                $('#CategoryListing').append(popupdata);
                $('.divCategoryList').SimpleDialog({
                    "title": "Folder Herarchy",
                    "width": 500,
                    "height": 600,
                    "top": 0,
                    "close":
                        function (event, ui) {
                            $('body').find('.divCategoryList').remove();
                        }
                });
                $('html, body').animate({ scrollTop: 0 }, 'slow');
                var $activeMove = $('.move.active');
                var $dataType = $activeMove.attr('data-type');
                var $srcDataPath = $activeMove.parents('.liCategory').attr('data-path');
                var srcFile = Setting.GetFolderName($srcDataPath);
                switch ($dataType) {
                    case "image":
                        $datatype = $activeMove.parents('.liCategory').find('img');
                        break;
                    case "video":
                        $datatype = $activeMove.parents('.liCategory').find('video');
                        break;
                    case "category":
                        $datatype = $activeMove.parents('.liCategory').find('span.catName');
                        //srcFile = '';
                        break;
                    case "document":
                        $datatype = $activeMove.parents('.liCategory').find('span.document');
                        break;
                }
                $('#tempMediaHolder').append($datatype.clone());
                $('.divCategoryList ul li span').on('click', function () {
                    var folderPath = $(this).attr('data-path').replace(/###/g, '');
                    $('.selFolderPath').text(folderPath);
                });
                //$('#spnCopy').on('click', function () {
                //    var $desDataPath = $('.selFolderPath').text() + '/' + srcFile;
                //    Setting.CopyMedia($srcDataPath, $desDataPath, $dataType);
                //});
                //$('#spnMove').on('click', function () {
                //    var $desDataPath = $('.selFolderPath').text() + '/' + srcFile;
                //    Setting.MoveMedia($srcDataPath, $desDataPath, $dataType);
                //});

                $('.movecopy').on('click', function () {
                    $('.mediaCategoryHierrarchy').fadeIn(400, function () {
                        $('.divCategoryList ul li span').eq(0).trigger('click');
                        $('.SelectedFolder').show();
                        $('#spnSave').show();
                    });
                });
                $('#spnSave').on('click', function () {
                    var $desDataPath = $('.selFolderPath').text() + '/' + srcFile;
                    if ($('#rdCopy').is(':checked')) {
                        Setting.CopyMedia($srcDataPath, $desDataPath, $dataType);
                    }
                    else {
                        Setting.MoveMedia($srcDataPath, $desDataPath, $dataType);
                    }
                });


            },
            AddCategory: function (categoryName, rootfolderPath) {
                var objMediaCategory =
                {
                    BaseCategory: categoryName,
                    ParentCategory: $('#CategoryListing').attr('data-rootfolder'),
                    MediaSettingID: $('#hdnMembershipID').val(),
                    PortalID: parseInt(SageFramePortalID),
                    UserModuleID: p.userModuleID,
                    userName: SageFrameUserName,
                    secureToken: SageFrameSecureToken
                };
                this.config.method = "CreateCategory";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    objMediaCategory: objMediaCategory,
                });
                this.config.ajaxCallMode = 3;
                this.ajaxCall(this.config);
            },
            validation: function () {
                $validator = $("#form1").validate({
                    rules: {
                        productName: {
                            required: true
                        },
                        categoryName: {
                            selectcheck: true
                        },
                        locationName: {
                            selectcheck: true,
                            required: true
                        },
                        //membershipPlan: {
                        //    selectcheck: true
                        //},
                        txtHiddenFileAttachment: {
                            required: true
                        },
                        txtconfigHiddenFileAttachment: {
                            required: true
                        },
                        txtUnitPrice:
                        {
                            required: true,
                            decimal: true
                        }

                    },
                    messages: {
                        productName: {
                            required: "Please give the product name"
                        },
                        locationName: {
                            required: "* Please select at least a location"
                        },
                        categoryName: "* Please select a category name",
                        categoryName: "* Please select a categoryName",
                        //membershipPlan: "* Please select at least a code",
                        txtHiddenFileAttachment: "* Please upload a product zip",
                        txtconfigHiddenFileAttachment: "* Please upload config file",
                        txtConversionRate: {
                            required: "* Required Field",
                            decimal: "* Enter valid decimal number"
                        },
                        txtUnitPrice: {
                            required: "* Required Field",
                            decimal: "* Enter valid decimal number"
                        }

                    },
                    ignore: ':hidden, :disabled',
                });
            },
            ajaxSuccess: function (data) {
                switch (Setting.config.ajaxCallMode) {
                    case 0:
                        var mediaSettingID = data.d;
                        $('#hdnMembershipID').val(mediaSettingID);
                        SageFrame.messaging.show("Settings Saved Successfully", "Success");
                        break;
                    case 1:
                        var objMediaSetting = data.d;
                        if (objMediaSetting != null && objMediaSetting.MediaSettingID > 0) {
                            $('#hdnMembershipID').val(objMediaSetting.MediaSettingID);
                            var settingKeyValue = JSON.parse(objMediaSetting.SettingKeyValue);
                            var objsettings = {
                            };
                            objsettings.FolderName = settingKeyValue.MediaSetting.FolderName;
                            objsettings.MediaVisibility = settingKeyValue.MediaSetting.MediaVisibility;
                            objsettings.MediaReadLocation = settingKeyValue.MediaSetting.MediaReadLocation;
                            objsettings.MediaIgnoreFolders = settingKeyValue.MediaSetting.MediaIgnoreFolders;
                            objsettings.AllowCategory = settingKeyValue.MediaSetting.AllowCategory;
                            objsettings.ImageExtension = settingKeyValue.MediaSetting.ImageExtension;
                            objsettings.VideoExtension = settingKeyValue.MediaSetting.VideoExtension;
                            objsettings.DocumentExtension = settingKeyValue.MediaSetting.DocumentExtension;
                            objsettings.OptimizeImage = settingKeyValue.MediaSetting.OptimizeImage;
                            objsettings.ScaleImage = settingKeyValue.MediaSetting.ScaleImage;

                            $('#txtfolderName').val(objsettings.FolderName);
                            if (objsettings.MediaVisibility == "reuse") {
                                $('#rdReuseable').attr('checked', true);
                            }
                            else {
                                $('#rdUserWise').attr('checked', true);
                            }
                            if (objsettings.MediaReadLocation == "system") {
                                $('#rdFromSytem').attr('checked', true);
                            }
                            else {
                                $('#rdFromMediaLocation').attr('checked', true);
                            }
                            $('#txtIgnoreFolder').val(objsettings.MediaIgnoreFolders);
                            $('#chkAllowCategory').attr('checked', objsettings.AllowCategory);
                            $('#txtImageExtension').val(objsettings.ImageExtension);
                            $('#txtvideoExtension').val(objsettings.VideoExtension);
                            $('#txtdocumentExtension').val(objsettings.DocumentExtension);
                            $('#txtScaleImage').val(objsettings.ScaleImage);
                            $('#chkAllowOptimization').attr('checked', objsettings.OptimizeImage);
                        }
                        break;
                    case 2:
                        var objMediaSetting = data.d;
                        if (objMediaSetting != null && objMediaSetting.MediaSettingID > 0) {
                            $('#hdnMembershipID').val(objMediaSetting.MediaSettingID);
                            var settingKeyValue = JSON.parse(objMediaSetting.SettingKeyValue);
                            var objsettings = {
                            };
                            objsettings.FolderName = settingKeyValue.MediaSetting.FolderName;
                            objsettings.MediaVisibility = settingKeyValue.MediaSetting.MediaVisibility;
                            objsettings.MediaReadLocation = settingKeyValue.MediaSetting.MediaReadLocation;
                            objsettings.MediaIgnoreFolders = settingKeyValue.MediaSetting.MediaIgnoreFolders;
                            objsettings.AllowCategory = settingKeyValue.MediaSetting.AllowCategory;
                            objsettings.ImageExtension = settingKeyValue.MediaSetting.ImageExtension;
                            objsettings.VideoExtension = settingKeyValue.MediaSetting.VideoExtension;
                            objsettings.DocumentExtension = settingKeyValue.MediaSetting.DocumentExtension;
                            Setting.BindEvents(objsettings);
                        }
                        break;
                    case 3:
                        if (!data.d || data.d == 'false') {
                            var rootFolderPath = $('#CategoryListing').attr('data-rootfolder');
                            if (rootFolderPath.length > 0) {
                                Setting.GetmediaCategoryByPath(rootFolderPath);
                                $('#txtCategoryname').val('');
                                SageFrame.messaging.show("Category created", "success");
                            }
                        }
                        else {
                            SageFrame.messaging.show("Category already exists", "error");
                        }
                        break;
                    case 4:
                        var category = data.d;
                        if (category != null && category.length > 0) {
                            var length = category.length;
                            var html = '';
                            html += '<ul id="ulCategory">';
                            for (var i = 0; i < length; i++) {
                                var filePath = category[i];
                                if (filePath != null && filePath.length > 0) {
                                    var outPut = Setting.GetFileDOM(filePath);;
                                    html += '<li class="liCategory" data-path="' + filePath + '">' + outPut + '</li>';
                                }
                            }
                            html += '</ul>';
                            $('#CategoryListing').html(html);
                        }
                        else {
                            var html = '';
                            var imagePath = SageFrameHostURL + '/Modules/Admin/MediaManagement/images/nodataImg.jpg';
                            html += '<ul id="ulCategory">';
                            html += '<li class="nomediaData"><img height="100px" src="' + imagePath + '" /></li>';
                            html += '</ul>';
                            $('#CategoryListing').html(html);
                        }
                        Setting.MediaBindEvents();
                        break;
                    case 5:
                        var respose = data.d;
                        var $imageCrop = $('#imgCropping');
                        $imageCrop.removeClass('cropper-hidden');
                        $('.img-container > .cropper-container.cropper-bg').remove();
                        $imageCrop.attr('data-imagePath', respose);
                        $imageCrop.attr('src', SageFrameHostURL + '/' + respose);
                        $(this).InitCropper();
                        
                        break;
                    case 6:
                        if (data.d == 1) {
                            var rootDowmloadPath = '';
                            rootDowmloadPath = 'media/downloadedimage';
                            SageFrame.messaging.show("Downloaded Successfully", "success");
                            Setting.GetmediaCategoryByPath(rootDowmloadPath);
                        }
                        else {
                            SageFrame.messaging.show("Download Failed", "alert");
                        }
                        break;
                    case 7:
                        Setting.FolderHerarchy(data.d);
                        break;
                    case 8:
                        var response = data.d;
                        if (response === '') {
                            SageFrame.messaging.show("Media deleted succesfully", "success");
                            var rootFolderPath = $('#CategoryListing').attr('data-rootfolder');
                            Setting.GetmediaCategoryByPath(rootFolderPath);
                        } else {
                            SageFrame.messaging.show(data.d, "alert");
                        }
                        $('.divCategoryList').dialog("close");
                        break;
                    case 9:
                        var response = data.d;
                        if (response === '') {
                            SageFrame.messaging.show("Media copied succesfully", "success");
                            var rootFolderPath = $('#CategoryListing').attr('data-rootfolder');
                            Setting.GetmediaCategoryByPath(rootFolderPath);
                        } else {
                            SageFrame.messaging.show(data.d, "alert");
                        }
                        $('.divCategoryList').dialog("close");
                        break;
                    case 10:
                        var response = data.d;
                        if (response === '') {
                            SageFrame.messaging.show("Media moved succesfully", "success");
                            var rootFolderPath = $('#CategoryListing').attr('data-rootfolder');
                            Setting.GetmediaCategoryByPath(rootFolderPath);
                        } else {
                            SageFrame.messaging.show(data.d, "alert");
                        }
                        $('.divCategoryList').dialog("close");
                        break;
                }
            },
            MediaBindEvents: function () {
                $('.deleteMedia').on('click', function () {
                    var $this = $(this);
                    var dataType = $this.attr('data-type');
                    var confirmmessage = '';
                    var dataPath = $this.parent().parent().attr('data-path');
                    switch (dataType) {
                        case "image":
                            confirmmessage = 'Do you want to delete this image ?';
                            break;
                        case "video":
                            confirmmessage = 'Do you want to delete this video ?';
                            break;
                        case "category":
                            confirmmessage = 'Do you want to delete this category ? It may contain files or categories';
                            break;
                        case "document":
                            confirmmessage = 'Do you want to delete this document ?';
                            break;
                    }
                    SageConfirmDialog(confirmmessage).done(function () {
                        Setting.DeleteMedia(dataPath, dataType);
                    });
                });
                $('.videoControl').on('click', function () {
                    var $this = $(this);
                    var video = $(this).parent().parent().find('.videos').get(0);
                    if (video.paused) {
                        $this.addClass('fa-pause-circle-o').removeClass('fa-play-circle-o');
                        video.play();
                    }
                    else {
                        $this.removeClass('fa-pause-circle-o').addClass('fa-play-circle-o');
                        video.pause();
                    }
                });
                Setting.fileUpload($('#CategoryListing').attr('data-rootfolder'));
                $('#ulCategory li .catName').off().on('click', function () {
                    var $this = $(this).parent();
                    $('.MediaFile').remove();
                    if ($this.attr('data-path') != null && $this.attr('data-path').length > 0) {
                        var rooFolderPath = $this.attr('data-path');
                        $('#btnCategoryBack').attr('data-rootfolder', $('#CategoryListing').attr('data-rootfolder'));
                        $('#CategoryListing').attr('data-rootfolder', rooFolderPath);
                        Setting.GetmediaCategoryByPath(rooFolderPath);
                        Setting.CreateBreadcrumb();
                    }
                });
                $('.selectimage').on('click', function () {
                    var $this = $(this);
                    var imagePath = $this.parent().parent().attr('data-path');
                    $('#imgCropping').removeClass('cropper-hidden');
                    $('.img-container > .cropper-container.cropper-bg').remove();
                    $('#imgCropping').attr('data-imagePath', imagePath);
                    $('#imgCropping').attr('src', SageFrameHostURL + '/' + imagePath);
                    $(this).InitCropper();
                    Setting.ShowImageDetailList();
                });
                $('.move').off().on('click', function () {
                    $('.move').removeClass('active');
                    $(this).addClass('active');
                    Setting.GetFolderHerarchy();
                });
                Setting.CreateBreadcrumb();
            },
            DeleteMedia: function (dataPath, dataType) {
                var objMediaCategory =
                    {
                        BaseCategory: dataPath,
                        UploadType: dataType,
                        PortalID: parseInt(SageFramePortalID),
                        UserModuleID: p.userModuleID,
                        UserName: SageFrameUserName,
                        secureToken: SageFrameSecureToken
                    }
                this.config.method = "DeleteMedia";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    objMediaCategory: objMediaCategory
                });
                this.config.ajaxCallMode = 8;
                this.ajaxCall(this.config);
            },
            CopyMedia: function (srcdataPath, destDataPath, dataType) {
                var objMediaCategory =
                    {
                        BaseCategory: srcdataPath,
                        ParentCategory: destDataPath,
                        UploadType: dataType,
                        PortalID: parseInt(SageFramePortalID),
                        UserModuleID: p.userModuleID,
                        UserName: SageFrameUserName,
                        secureToken: SageFrameSecureToken
                    }
                this.config.method = "CopyMedia";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    objMediaCategory: objMediaCategory
                });
                this.config.ajaxCallMode = 9;
                this.ajaxCall(this.config);
            },
            MoveMedia: function (srcdataPath, destDataPath, dataType) {
                var objMediaCategory =
                    {
                        BaseCategory: srcdataPath,
                        ParentCategory: destDataPath,
                        UploadType: dataType,
                        PortalID: parseInt(SageFramePortalID),
                        UserModuleID: p.userModuleID,
                        UserName: SageFrameUserName,
                        secureToken: SageFrameSecureToken
                    }
                this.config.method = "MoveMedia";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    objMediaCategory: objMediaCategory
                });
                this.config.ajaxCallMode = 10;
                this.ajaxCall(this.config);
            },
            CreateBreadcrumb: function () {
                var rootFolderPath = $('#CategoryListing').attr('data-rootfolder');
                // rootFolderPath = 'media\\asdf\\asdfa\\adf';

                var list = '<ul id="navigateurl">';
                var link = '';

                if ($('#CategoryListing').attr('data-MediaReadLocation') == "system")
                    list += '<li><span class="liNavigate navigatecategory" data-rootfolder="">Home</li>';
                if (rootFolderPath.length > 0) {
                    var paths = rootFolderPath.split('\\');
                    $(paths).each(function (index, value) {
                        link += value;
                        list += '<li><span class="liNavigate navigatecategory" data-rootfolder="' + link + '">' + value + '</li>';
                        link += '\\';
                    });
                }
                list += '</ul>';
                $('.divBreadcrumb').html(list);
                $('#navigateurl li:last-child').find('.navigatecategory').removeClass('liNavigate');
                //}

                $('.liNavigate').off().on('click', function () {
                    var $this = $(this);
                    var rootFolderPath = $this.attr('data-rootfolder');
                    $('#CategoryListing').attr('data-rootfolder', rootFolderPath);
                    //if (rootFolderPath.length > 0) {
                    Setting.GetmediaCategoryByPath(rootFolderPath);
                    // }
                });
            },
            GetFileDOM: function (filePath) {
                var fileExtensionNotMatched = true;
                var fileName = Setting.GetFolderName(filePath);
                var html = '';//'<i data-type="image" class="deleteMedia icon-select"></i>';
                var iconSelect = '';
                if (fileName.indexOf('.') > 0) {
                    var fileExtension = Setting.GetFileExtension(fileName);
                    var extenstions = imageExtension.split(',');
                    $(extenstions).each(function (index, value) {
                        if (value == fileExtension) {
                            html += '<span class="icons-wrapper">';
                            html += '<i data-type="image" title="delete image" class="deleteMedia icon-delete"></i>';
                            html += '<i class="selectimage fa fa-sliders" title="select image" data-type="image"></i>';
                            html += '<i class="move fa fa-arrows" title="move" data-type="image"></i>';
                            html += '</span>';
                            html += '<img height="100px" src="' + SageFrameHostURL + '/' + filePath + '" />';
                            fileExtensionNotMatched = false;
                        }
                    });
                    if (fileExtensionNotMatched) {
                        extenstions = videoExtension.split(',');
                        $(extenstions).each(function (index, value) {
                            if (value == fileExtension) {
                                html += '<span class="icons-wrapper">';
                                html += '<i data-type="video" title="delete video" class="deleteMedia icon-delete"></i>';
                                html += '<i class="videoControl  fa fa-play-circle-o" title="video player"  data-type="video"></i>';
                                html += '<i class="move fa fa-arrows" title="move"  data-type="video"></i>';
                                html += '</span>';
                                html += '<video class="videos" width="100">';
                                html += '<source src="' + SageFrameHostURL + '/' + filePath + '" type="video/' + fileExtension + '">';
                                html += 'Your browser does not support HTML5 video.';
                                html += '</video>';
                                fileExtensionNotMatched = false;
                            }
                        });
                        if (fileExtensionNotMatched) {
                            extenstions = documentExtension.split(',');
                            $(extenstions).each(function (index, value) {
                                if (value == fileExtension) {
                                    html += '<span class="icons-wrapper">';
                                    html += '<i data-type="document" title="delete document" class="deleteMedia icon-delete"></i>';
                                    //html += '<i class="selectimage fa fa-sliders" data-type="document"></i>';
                                    html += '<i class="move fa fa-arrows" title="move"  data-type="document"></i>';
                                    html += '</span>';
                                    var fileName = Setting.GetFolderName(filePath);
                                    html += '<span title="' + fileName + '" class="document">' + fileName + '</span>';
                                    fileExtensionNotMatched = false;
                                }
                            });
                        }
                    }
                }
                else {
                    html += '<span class="icons-wrapper">';
                    html += '<i data-type="category" title="delete category" class="deleteMedia icon-delete"></i>';
                    //html += '<i class="selectimage fa fa-sliders" data-type="category"></i>';
                    html += '<i class="move fa fa-arrows" title="move"  data-type="category"></i>';
                    html += '</span>';
                    html += '<span class="catName">' + fileName + '</span>';
                }
                return html;
            },
            GetFileExtension: function (file) {
                //debugger;
                fileName = file.split('.');
                var nameLength = fileName.length;
                return fileName[nameLength - 1].replace('.', '');
            },
            GetFolderName: function (filePath) {
                if (filePath != null && filePath.length > 0) {
                    var fileSplited = filePath.split('\\');
                    var length = fileSplited.length;
                    return fileSplited[length - 1];
                }
                else
                    return '';
            },
            ajaxFailure: function () {
            },
            ajaxCall: function (config) {
                $.ajax({
                    type: Setting.config.type,
                    contentType: Setting.config.contentType,
                    async: Setting.config.async,
                    cache: Setting.config.cache,
                    url: Setting.config.url,
                    data: Setting.config.data,
                    dataType: Setting.config.dataType,
                    success: Setting.ajaxSuccess,
                    error: Setting.ajaxFailure,
                    complete: function () {
                        FormFieldComplete();
                    }
                });
            }
        };
        var authInfo = {
            UserModuleID: p.userModuleID,
            PortalID: SageFramePortalID,
            Username: SageFrameUserName,
            SecureToken: SageFrameSecureToken
        };
        Setting.init();
    }
    $.fn.MediaManagementSetting = function (p) {
        $.ManageSetting(p);
    };




})(jQuery);



