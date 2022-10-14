/**
 * @memberof myApp
 * @type {controller|angular.Controller}
 * @desc Content File Controller
 */
myApp.controller('content-filesCtrl', function ($scope, $state, $http, $stateParams, ngProgress, $window, ContentFile, _, Icon, Upload,Excel,$q) {
    $('.removeActiveClass').removeClass('active');
    $('.removeSubactiveClass').removeClass('active');
    $('#addcontentfile').addClass('active');
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');
    $scope.CurrentPage = $state.current.name;
    $scope.ThumbFiles = [];
    $scope.WallPaperFiles = [];
    $scope.VideoFiles = [];
    $scope.AudioFiles = [];
    $scope.GameImageFiles = [];
    $scope.GameVideoFiles = [];
    $scope.GameAppFiles = [];
    $scope.TextFiles = [];
    $scope.LangSupportFiles = [];
    $scope.LangSupportError = [];
    $scope.TextError = [];
    $scope.AudioZipFiles = [];
    $scope.AudioZipError = [];
    $scope.BGSongType = [];
    $scope.CommonFiles = [];
    $scope.SingleAudioVisible = false;
    $scope.BulkAudioVisible = false;
    $scope.Main = 1;
    $scope.Supporting = 2;
    $scope.Preview = 3;
    /**
     * @desc Get Matadata Status
     * @param MetadataExpirydate
     * @param VendorExpirydate
     * @param PropertyExpirydate
     * @param Vendor_active
     * @param Property_active
     * @param cm_state
     * @returns {String}
     */
    function getStatus(MetadataExpirydate, VendorExpirydate, PropertyExpirydate, Vendor_active, Property_active, cm_state) {
        var status;

        if (cm_state == 7) {

            status = "Metadata deleted for this Metadata Id.";
        }
        else if (cm_state == 5) {
            status = "Metadata rejected for this Metadata Id.";
        }
        else if (Vendor_active != 1) {
            status = "Vendor blocked for this Metadata Id.";
        }
        else if (Datewithouttime(VendorExpirydate) < Datewithouttime(new Date())) {
            status = "Vendor expired for this Metadata Id.";
        }
        else if (Property_active != 1) {
            status = "Property blocked for this Metadata Id.";
        }
        else if (Datewithouttime(PropertyExpirydate) < Datewithouttime(new Date())) {
            status = "Property expired for this Metadata Id.";
        }
        else if (cm_state == 6) {
            status = "Metadata blocked for this Metadata Id.";
        }
        else if (Datewithouttime(MetadataExpirydate) < Datewithouttime(new Date())) {
            status = "Metadata expired for this Metadata Id.";
        }

        return status;
    }

    /**
     *  @desc get data to display chart and grid on dashbard page
     */
    Icon.GetDashBoardData(function (dashboard) {
        $scope.ContentType = _.where( dashboard.ContentType, { cm_name: "Content Type" });
    }, function (error) {
        toastr.error(error);
    });
    /**
     *  @desc get data to render on add content file form
     */
    ContentFile.getContentFile({}, function (content) {
        content.UserRole === "Super Admin" || content.UserRole == "Moderator" ? location.href = "/" : "";
        $scope.ConfigData = content.ConfigData;

        content.BGSongType.forEach(function (songType) {
            $scope.BGSongType.push(songType.cd_name);
        })
         $scope.Templates = content.Templates;
        //$scope.ContentType = _.where(content.ContentType, { cm_name: "Content Type" });
        $scope.OtherTemplates = content.OtherTemplates;
        $scope.OtherTemplates.forEach(function(template){
            if(template.ct_param_value == "Main"){
                $scope.Main = template.ct_param;
            }
            if(template.ct_param_value == "Supporting"){
                $scope.Supporting = template.ct_param;
            }
            if(template.ct_param_value == "Preview"){
                $scope.Preview = template.ct_param;
            }
        })
        $scope.DeviceModels = content.Devices;
        $scope.HandsetDeviceGroups = content.HandsetDeviceGroups;
        $scope.AllGroups = content.HandsetGroups;
        $scope.loading = true;
    }, function (error) {
        toastr.error(error);
    });
    /**
     * @desc get data to populate handset group dropdown
     * @constructor
     */
    $scope.HandsetGroupChange = function () {
        if (!$scope.SelectedHandsetGroup || $scope.SelectedHandsetGroup == "") {
            $scope.GroupHandset = [];
            $scope.SelectedCriteriaHandset = [];
        }
        else {
            var grouphandset = _.where($scope.HandsetDeviceGroups, { chg_chgr_group_id: $scope.SelectedHandsetGroup });
            $scope.GroupHandset = [];
            $scope.SelectedCriteriaHandset = [];
            _.each(grouphandset, function (handset) {
                var data = _.find($scope.DeviceModels, function (device) { return device.dc_id == handset.chg_handset_id });
                if (data) {
                    $scope.SelectedCriteriaHandset.push(data);
                }
            });
        }
    }
    /**
     * @desc click to move selected data to left side
     */
    $scope.leftclick = function () {
        _.each($scope.SelectedGroupHandset, function (selected) {
            var index = _.findIndex($scope.GroupHandset, function (cnt) { return cnt.dc_id == selected })
            if (index > -1) {
                $scope.SelectedCriteriaHandset.push($scope.GroupHandset[index]);
                $scope.GroupHandset.splice(index, 1);
            }
        })
        $scope.SelectedGroupHandset = [];
    }
    /**
     * @desc click to move selected data to right side
     */
    $scope.rightclick = function () {
        _.each($scope.SelectedFilterCriteria, function (selected) {
            var index = _.findIndex($scope.SelectedCriteriaHandset, function (cnt) { return cnt.dc_id == selected })
            if (index > -1) {
                $scope.GroupHandset.push($scope.SelectedCriteriaHandset[index]);
                $scope.SelectedCriteriaHandset.splice(index, 1);
            }
        })
        $scope.SelectedFilterCriteria = [];
    }
    /**
     * @desc click to move all data to left side
     */
    $scope.leftAllclick = function () {
        _.each($scope.GroupHandset, function (selected) {
            $scope.SelectedCriteriaHandset.push(selected);
        })
        $scope.GroupHandset = [];
    }
    /**
     * @desc click to move data to right side
     */
    $scope.rightAllclick = function () {
        _.each($scope.SelectedCriteriaHandset, function (selected) {
            $scope.GroupHandset.push(selected);
        })
        $scope.SelectedCriteriaHandset = [];
    }
    /**
     * @desc on content type change
     * @constructor
     */
    $scope.ContentTypeChange = function () {
        $scope.FileUploadVisible = false;
        $scope.Uploadervisible = false;
    }
    /**
     * Reset/Clear form
     * @constructor
     */
    $scope.Suggestions = function () {
        $scope.FileUploadVisible = true;
        $("#thumbfile").val("");
        $("#wallpaperfile").val("");
        $("#videofile").val("");
        $("#audiofile").val("");
        $("#gameimagefile").val("");
        $("#gamevideofile").val("");
        $("#gameappfile").val("");
        $("#commonfile").val("");
        $("#supportfile").val("");
        $(".textfile").val("");
        $scope.SelectedHandsetGroup = "";
        $scope.HandsetGroupChange();
        $scope.WallpaperPartVisible = false;
        $scope.VideoPartVisible = false;
        $scope.AudioPartVisible = false;
        $scope.GamePartVisible = false;
        $scope.TextPartVisible = false;
        $scope.Uploadervisible = true;
        if ($scope.TypeName == "Imagery") {
            $scope.WallpaperPartVisible = true;
        }
        else if ($scope.TypeName == "Video") {
            $scope.VideoPartVisible = true;
        }
        else if ($scope.TypeName == "Audio") {
            $scope.AudioPartVisible = true;
        }
        else if ($scope.TypeName == "AppsGames") {
            $scope.GamePartVisible = true;
        }
        else if ($scope.TypeName == "Text") {
            $scope.TextPartVisible = true;
        }
    }
    /**
     * @desc search metadata
     * @param isvalid
     * @constructor
     */
    $scope.SearchMetadata = function (isvalid) {
        if (isvalid) {
            try {
                var match = _.find($scope.ContentType, function (val) { return val.cd_id == $scope.SelectedContentType; });
                if (match) {
                    $scope.TypeName = match.cd_name;
                    $scope.MetaId = Icon.GetDecode($scope.MetadataId);
                    ngProgress.start();
                    ContentFile.checkMetadata({ Id: $scope.MetaId, parentid: $scope.SelectedContentType, contenttype: match.cd_name }, function (metadata) {
                        if (metadata.Metadata.length > 0) {
                            $scope.LyricsLanguagesMetadata = metadata.LyricsLanguages;
                             _.each($scope.LyricsLanguagesMetadata, function (lang) {
                                lang.MetaId = Icon.GetEncode(lang.ct_group_id);
                                lang.file = '';
                            })
                            var status = getStatus(metadata.Metadata[0].cm_expires_on, metadata.Metadata[0].vd_end_on, metadata.Metadata[0].propertyexpirydate, metadata.Metadata[0].vd_is_active, metadata.Metadata[0].propertyactive, metadata.Metadata[0].cm_state)
                            if (!status) {
                                $scope.Files = metadata.Files;
                                $scope.ThumbDataFiles = metadata.ThumbFiles;
                                $scope.cm_title = metadata.Metadata[0].cm_title;
                                if ($scope.TypeName == "Text") {
                                    $scope.LanguagesMetadata = metadata.Languages;
                                    _.each($scope.LanguagesMetadata, function (lang) {
                                        lang.MetaId = $scope.MetadataId + "_" + Icon.GetEncode(lang.ct_group_id);
                                        lang.file = '';
                                    })
                                }
                                else if ($scope.TypeName == "Audio") {

                                    //console.log(metadata.Metadata[0].cm_ispersonalized)
                                    if (metadata.Metadata[0].cm_ispersonalized == 1) {
                                        $scope.SingleAudioVisible = false;
                                        $scope.BulkAudioVisible = true;
                                    }
                                    else {
                                        $scope.SingleAudioVisible = true;
                                        $scope.BulkAudioVisible = false;
                                    }
                                }
                                $scope.Suggestions();
                            }
                            else {
                                $scope.ContentTypeChange();
                                toastr.error(status);
                            }
                        }
                        else {
                            $scope.ContentTypeChange();
                            toastr.error("Metadata id does not match with content type.");
                        }
                        ngProgress.complete();
                    }, function (error) {
                        $scope.ContentTypeChange();
                        toastr.error(error);
                        ngProgress.complete();
                    });
                }
            }
            catch (err) {
                $scope.ContentTypeChange();
                toastr.error("Please enter valid Metadata Id.");
            }
        }
    }
    /**
     * @desc validate thumbnail file for upload
      * @param files
     */
    $scope.thumbfileuploader = function (files) {
        var thumb_limit = $scope.ConfigData.thumb_limit;
        $scope.thumberror = false;
        $scope.ThumbFiles = [];
        if ($scope.thumbfile) {
            var thumblength = $scope.thumbfile.length;
            if ((thumb_limit - $scope.ThumbDataFiles.length - thumblength) >= 0) {
                function thumbloop(t) {
                    var reader = new FileReader();
                    var ext = getExtension($scope.thumbfile[t].name).toLowerCase();
                     if (ext == "gif" || ext == "jpg" || ext == "png") {
                        reader.onload = function (e) {
                            var new_file = new Image();
                            new_file.src = e.target.result;
                            new_file.onload = function () {
                                $scope.ThumbFiles.push({ count: ($scope.ThumbFiles.length + $scope.ThumbDataFiles.length + 1), file: $scope.thumbfile[t], width: this.width, height: this.height });
                                t = t + 1;
                                if (!(thumblength == t)) {
                                    thumbloop(t);
                                }
                            }
                        }
                        reader.readAsDataURL($scope.thumbfile[t]);
                    }else{
                        $scope.wallpapererror = true;
                        $scope.wallpapererrormessage = "Please upload valid thumbnail files.";
                        toastr.error($scope.wallpapererrormessage);
                    }
                }
                thumbloop(0);
            }
            else {
                $scope.thumberror = true;
                if ($scope.ThumbDataFiles.length == thumb_limit) {
                    $scope.thumberrormessage = $scope.ThumbDataFiles.length + " thumb files already uploaded. you can't upload anymore.";
                }
                else {
                    if ($scope.ThumbDataFiles.length == 0) {
                        $scope.thumberrormessage = "You can upload only " + (thumb_limit - $scope.ThumbDataFiles.length) + " thumb files.";
                    }
                    else {
                        $scope.thumberrormessage = $scope.ThumbDataFiles.length + " thumb file already uploaded. you can upload only " + (thumb_limit - $scope.ThumbDataFiles.length) + " thumb files.";
                    }
                }
                toastr.error($scope.thumberrormessage);
            }
        }
    }
    /**
     * @desc validate imagery uploader
     */
    $scope.wallpaperfileuploader = function () {
        var wallpaper_limit = $scope.ConfigData.wallpaper_limit;

        $scope.wallpapererror = false;
        $scope.WallPaperFiles = [];
        if ($scope.wallpaperfile) {
            if ($scope.wallpaperfile.length <= wallpaper_limit) {
                try {
                    imageloop(0);
                    function imageloop(cnt) {
                        var i = cnt;
                        var ext = getExtension($scope.wallpaperfile[i].name).toLowerCase();
                        if (ext == "gif" || ext == "jpg" || ext == "png") {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var new_file = new Image();
                                new_file.src = e.target.result;
                                new_file.onload = function () {
                                    if ((this.height == 1280 && this.width == 1280) || (this.height == 1280 && this.width == 720) || (this.height == 720 && this.width == 1280)) {
                                        cnt = cnt + 1;
                                        var height = this.height;
                                        var width = this.width;
                                        var match = _.find($scope.Templates, function (val) {
                                            return ((val.width == width) && (val.height == height));
                                        })
                                        if (match) {
                                            $scope.WallPaperFiles.push({
                                                fileCategory: $scope.Main,
                                                file: $scope.wallpaperfile[i],
                                                type: 'Imagery',
                                                ct_group_id: match.ct_group_id,
                                                cm_id: $scope.MetaId,
                                                width: this.width,
                                                height: this.height,
                                                other: null
                                            })
                                        }
                                        if (!(cnt == $scope.wallpaperfile.length)) {
                                            imageloop(cnt);
                                        }
                                        else {
                                            $scope.wallpapererror = false;
                                        }
                                    }
                                    else {
                                        $scope.wallpapererror = true;
                                        $scope.wallpapererrormessage = "Invalid Dimension In " + $scope.wallpaperfile[i].name + ".";
                                        toastr.error($scope.wallpapererrormessage);
                                    }
                                }
                            }
                            reader.readAsDataURL($scope.wallpaperfile[i]);
                        }else{
                            $scope.wallpapererror = true;
                            $scope.wallpapererrormessage = "Please upload valid wallpaper files.";
                            toastr.error($scope.wallpapererrormessage);
                        }

                    }
                }
                catch (err) {
                    $scope.wallpapererror = true;
                    $scope.wallpapererrormessage = "Invalid Image Format.";
                    toastr.error($scope.wallpapererrormessage);
                }
            }
            else {
                $scope.wallpapererror = true;
                $scope.wallpapererrormessage = "Maximum Three base Image file upload at a time.";
                toastr.error($scope.wallpapererrormessage);
            }

        }
    }
    /**
     * @desc validate video uploader
      * @param files
     */
    $scope.videofileuploader = function (files) {
        var video_limit = $scope.ConfigData.video_limit;

        $scope.videoerror = false;
        $scope.VideoFiles = [];
        if ($scope.videofile) {
            if (getExtension($scope.videofile.name).toLowerCase() == "mp4") {
                var match = _.find($scope.Templates, function (val) { return val.width == 640 && val.height == 320 })
                if (match) {
                    $scope.VideoFiles.push({ fileCategory:$scope.Main, file: $scope.videofile, type: 'Video', ct_group_id: match.ct_group_id, cm_id: $scope.MetaId, width: 640, height: 320, other: null })
                }
            }
            else {
                $scope.videoerror = true;
                $scope.videoerrormessage = "Invalid video file extension.";
                toastr.error($scope.videoerrormessage);
            }
        }
    }
    /**
     * @desc validate audio uploader
     * @param files
     */
    $scope.audiofileuploader = function (files) {
        var audio_limit = $scope.ConfigData.audio_limit;

        $scope.audioerror = false;
        $scope.AudioFiles = [];
        if ($scope.audiofile) {
            if (getExtension($scope.audiofile.name).toLowerCase() == "mp3") {
                //var match = _.find($scope.OtherTemplates, function (val) { return val.ct_param == 128 })
                var match = _.find($scope.OtherTemplates, function (val) { return val.ct_param_value == 'bitrate' })
                if (match) {
                    $scope.AudioFiles.push({fileCategory:$scope.Main, file: $scope.audiofile, type: 'Audio', ct_group_id: match.ct_group_id, cm_id: $scope.MetaId, width: null, height: null, other: 128 })
                }
            }
            else {
                $scope.audioerror = true;
                $scope.audioerrormessage = "Invalid audio file extension.";
                toastr.error($scope.audioerrormessage);
            }
        }
    }
    /**
     * @desc validate audio zip file uploader
     * @param audiofile
     * @param cm_id
     * @param ct_group_id
     * @param cd_name
     * @param MetaId
     * @param ct_param
     * @param ct_param_value
     */
    $scope.audiozipfileuploader = function (audiofile, cm_id, ct_group_id, cd_name, MetaId, ct_param, ct_param_value) {
        if (audiofile) {
            if (getExtension(audiofile.name).toLowerCase() == "zip") {
                $scope.AudioZipFiles.push({ fileCategory:$scope.Supporting, file: audiofile, type: 'audiozip', ct_param: ct_param, ct_param_value: ct_param_value, ct_group_id: ct_group_id, cm_id: cm_id, width: null, height: null, other: cd_name, langaugemetaid: MetaId })
            }
            else {
                $scope.ziperrormessage = "File extension must be zip for language " + cd_name + ".";
                $scope.AudioZipError.push({ error: $scope.ziperrormessage, ct_group_id: ct_group_id });
                toastr.error($scope.ziperrormessage);
            }
        }else {
            var temperror = [];
            _.each($scope.AudioZipError, function (err) {
                if (!(err.ct_group_id == ct_group_id)) {
                    temperror.push(err);
                }
            });
            $scope.AudioZipError = temperror;
            var tempfiles = [];
            _.each($scope.AudioZipFiles, function (val) {
                if (!(val.ct_group_id == ct_group_id)) {
                    tempfiles.push(val);
                }
            });
            $scope.AudioZipFiles = tempfiles;
        }

    };
    /**
     * @desc validate game supporting image file uploader
     */
    $scope.gameimagefileuploader = function () {
        var supporting_image_limit = $scope.ConfigData.supporting_image_limit;

        $scope.gameimageerror = false;
        $scope.GameImageFiles = [];
        if ($scope.gameimagefile) {
            if ($scope.gameimagefile.length <= supporting_image_limit) {
                try {
                    var otherimages = _.where($scope.Files, { ct_param_value: 'otherimage' });
                    if (supporting_image_limit - otherimages.length - $scope.gameimagefile.length >= 0) {
                        var match = _.find($scope.OtherTemplates, function (val) { return val.ct_param_value == 'otherimage' })
                        if (match) {
                            gameimageloop(0);
                            function gameimageloop(gi) {
                                $scope.GameImageFiles.push({fileCategory:$scope.Supporting, count: (otherimages.length + $scope.GameImageFiles.length + 1), file: $scope.gameimagefile[gi], type: 'GameImage', ct_group_id: match.ct_group_id, cm_id: $scope.MetaId, width: null, height: null, other: 128 })
                                gi = gi + 1;
                                if (!(gi == $scope.gameimagefile.length)) {
                                    gameimageloop(gi);
                                }
                            }
                        }
                    }
                    else {
                        $scope.gameimageerror = true;
                        if (otherimages.length >= supporting_image_limit ) {
                            $scope.gameimageerrormessage = otherimages.length + " supporting image file already uploaded. you can't upload anymore.";
                        }
                        else {
                            if (otherimages.length == 0 ) {
                                $scope.gameimageerrormessage = "You can upload only " + (supporting_image_limit - otherimages.length) + " supporting images.";
                            }
                            else {
                                $scope.gameimageerrormessage = otherimages.length + " supporting image file already uploaded. You can upload only " + (supporting_image_limit - otherimages.length) + " supporting images.";
                            }
                        }
                        toastr.error($scope.gameimageerrormessage);
                    }
                }
                catch (err) {
                    $scope.gameimageerror = true;
                    $scope.gameimageerrormessage = "Invalid Image Format.";
                    toastr.error($scope.gameimageerrormessage);
                }
            }
            else {
                $scope.gameimageerror = true;
                $scope.gameimageerrormessage = "Maximum "+supporting_image_limit+" supporting Image file upload at a time.";
                toastr.error($scope.gameimageerrormessage);
            }
        }
    }
    /**
     * @desc validate game supporting video file uploader
     */
    $scope.gamevideofileuploader = function () {
        var video_download_limit = $scope.ConfigData.video_download_limit;

        $scope.gamevideoerror = false;
        $scope.GameVideoFiles = [];
        if ($scope.gamevideofile) {
            if ($scope.gamevideofile.length <= video_download_limit) {
                try {
                    var othervideos = _.where($scope.Files, { ct_param_value: 'othervideo' });
                    if ((video_download_limit - othervideos.length - $scope.gamevideofile.length) >= 0) {
                        var match = _.find($scope.OtherTemplates, function (val) { return val.ct_param_value == 'othervideo' })
                        if (match) {
                            gamevideoloop(0);
                            function gamevideoloop(gv) {
                                $scope.GameVideoFiles.push({ fileCategory:$scope.Supporting, count: (othervideos.length + $scope.GameVideoFiles.length + 1), file: $scope.gamevideofile[gv], type: 'gamevideo', ct_group_id: match.ct_group_id, cm_id: $scope.MetaId, width: null, height: null, other: null })
                                gv = gv + 1;
                                if (!(gv == $scope.gamevideofile.length)) {
                                    gamevideoloop(gv);
                                }
                            }
                        }
                    }
                    else {
                        $scope.gamevideoerror = true;
                        if (othervideos.length == video_download_limit) {
                            $scope.gamevideoerrormessage = othervideos.length + " supporting video file already uploaded. you can't upload anymore.";
                        }
                        else {
                            if (othervideos.length == 0) {
                                $scope.gamevideoerrormessage = "you can upload only " + (video_download_limit - othervideos.length) + " supporting video.";
                            }
                            else {
                                $scope.gamevideoerrormessage = othervideos.length + " supporting video file already uploaded. you can upload only " + (video_download_limit - othervideos.length) + " supporting video.";
                            }
                        }
                        toastr.error($scope.gamevideoerrormessage);
                    }
                }
                catch (err) {
                    $scope.gamevideoerror = true;
                    $scope.gamevideoerrormessage = "Invalid Video Format.";
                    toastr.error($scope.gamevideoerrormessage);
                }
            }
            else {
                $scope.gamevideoerror = true;
                $scope.gamevideoerrormessage = "Maximum "+video_download_limit+" supporting video file upload at a time.";
                toastr.error($scope.gamevideoerrormessage);
            }
        }
    }
    /**
     * @desc validate game app file uploader
     */
    $scope.gameappfileuploader = function () {
        var game_limit = $scope.ConfigData.game_limit;

        $scope.gameapperror = false;
        $scope.GameAppFiles = [];
        if ($scope.gameappfile) {
            if ($scope.gameappfile.length <= game_limit) {
                try {
                    var apps = _.where($scope.Files, {ct_param_value: 'app'});
                    var match = _.find($scope.OtherTemplates, function (val) {
                        return val.ct_param_value == 'app'
                    })
                    if (match) {
                        _.each($scope.gameappfile, function (val) {
                            $scope.GameAppFiles.push({
                                fileCategory:$scope.Main,
                                count: (apps.length + $scope.GameAppFiles.length + 1),
                                file: val,
                                type: 'gameapp',
                                ct_group_id: match.ct_group_id,
                                cm_id: $scope.MetaId,
                                width: null,
                                height: null,
                                other: null
                            })
                        });
                    }
                }
                catch (err) {
                    $scope.gameapperror = true;
                    $scope.gameapperrormessage = "Invalid App File Format.";
                    toastr.error($scope.gameapperrormessage);
                }
            }else {
                $scope.gameapperror = true;
                $scope.gameapperrormessage = "Maximum "+game_limit+" base app file upload at a time.";
                toastr.error($scope.gameapperrormessage);
            }
        }
    }
    /**
     * @desc validate text file uploader
     * @param textfile
     * @param cm_id
     * @param ct_group_id
     * @param cd_name
     * @param MetaId
     * @param ct_param
     * @param ct_param_value
     */
    $scope.textfileuploader = function (textfile, cm_id, ct_group_id, cd_name, MetaId, ct_param, ct_param_value) {
        var text_limit = $scope.ConfigData.text_limit;
        if (textfile) {
            var texts = _.where($scope.Files, { ct_group_id: ct_group_id });
            if ((text_limit - texts.length - textfile.length) >= 0) {
                _.each(textfile, function (val) {
                    var count = _.where($scope.TextFiles, { ct_group_id: ct_group_id });

                   // if (getExtension(val.name).toLowerCase() == "txt" || getExtension(val.name).toLowerCase() == "json" || getExtension(val.name).toLowerCase() == "xml") {
                    if (isText(val.name)) {
                        $scope.TextFiles.push({ fileCategory:$scope.Main, count: (texts.length + count.length + 1), file: val, type: 'text', ct_param: ct_param, ct_param_value: ct_param_value, ct_group_id: ct_group_id, cm_id: cm_id, width: null, height: null, other: cd_name, langaugemetaid: MetaId })
                    }
                    else {
                        $scope.texterrormessage = "Invalid lyrics file extension for " + ct_param_value;
                        $scope.TextError.push({ error: $scope.texterrormessage, ct_group_id: ct_group_id });
                        toastr.error($scope.texterrormessage);
                    }
                });
            }
            else {
                if (texts.length == text_limit) {
                    $scope.texterrormessage = texts.length + " text file already uploaded for " + cd_name + ". you can't upload anymore.";
                }
                else {
                    if (texts.length == 0) {
                        $scope.texterrormessage = "You can upload only " + (text_limit - texts.length) + " text file for " + cd_name + ".";
                    }
                    else {
                        $scope.texterrormessage = texts.length + " text file already uploaded for " + cd_name + ". you can upload only " + (text_limit - texts.length) + " text file for " + cd_name + ".";
                    }
                }
                $scope.TextError.push({ error: $scope.texterrormessage, ct_group_id: ct_group_id });
                toastr.error($scope.texterrormessage);
            }
        }
        else {
            var temperror = [];
            _.each($scope.TextError, function (err) {
                if (!(err.ct_group_id == ct_group_id)) {
                    temperror.push(err);
                }
            });
            $scope.TextError = temperror;
            var tempfiles = [];
            _.each($scope.TextFiles, function (val) {
                if (!(val.ct_group_id == ct_group_id)) {
                    tempfiles.push(val);
                }
            });
            $scope.TextFiles = tempfiles;
        }
    };
    /**
     * @desc validate language text file uploader
     * @param langsupportfile
     * @param cm_id
     * @param ct_group_id
     * @param cd_name
     * @param MetaId
     * @param ct_param
     * @param ct_param_value
     */
    $scope.langSupportFileUploader = function (langsupportfile, cm_id, ct_group_id, cd_name, MetaId, ct_param, ct_param_value) {
        var text_limit = $scope.ConfigData.text_limit;
         if (langsupportfile) {
            var langs = _.where($scope.Files, { ct_group_id: ct_group_id });

            if ((text_limit - langs.length - langsupportfile.length) >= 0) {
                _.each(langsupportfile, function (val) {
                    var count = _.where($scope.LangSupportFiles, { ct_group_id: ct_group_id });

                    if (getExtension(val.name).toLowerCase() == "txt") {
                        $scope.LangSupportFiles.push({fileCategory:$scope.Supporting, count: (langs.length + count.length + 1), file: val, type: 'text', ct_param: ct_param, ct_param_value: ct_param_value, ct_group_id: ct_group_id, cm_id: cm_id, width: null, height: null, other: cd_name, langaugemetaid: MetaId })
                    }
                    else {
                        $scope.langerrormessage = "Invalid lyrics file extension for " + ct_param_value;
                        $scope.LangSupportError.push({ error: $scope.langerrormessage, ct_group_id: ct_group_id });
                        toastr.error($scope.langerrormessage);
                    }
                });
            }
            else {
                if (langs.length == text_limit) {
                    $scope.langerrormessage = langs.length + " language file already uploaded for " + cd_name + ". you can't upload anymore.";
                }
                else {
                    if (langs.length == 0) {
                        $scope.langerrormessage = "You can upload only " + (text_limit - langs.length) + " text file for " + cd_name + ".";
                    }
                    else {
                        $scope.langerrormessage = langs.length + " language file already uploaded for " + cd_name + ". You can upload only " + (text_limit - langs.length) + " language file for " + cd_name + ".";
                    }
                }
                $scope.LangSupportError.push({ error: $scope.langerrormessage, ct_group_id: ct_group_id });
                toastr.error($scope.langerrormessage);
            }
        }
        else {
            var temperror = [];
            _.each($scope.LangSupportError, function (err) {
                if (!(err.ct_group_id == ct_group_id)) {
                    temperror.push(err);
                }
            });
            $scope.LangSupportError = temperror;
            var tempfiles = [];
            _.each($scope.LangSupportFiles, function (val) {
                if (!(val.ct_group_id == ct_group_id)) {
                    tempfiles.push(val);
                }
            });
            $scope.LangSupportFiles = tempfiles;
        }
    };
    /**
     * @desc validate audio, video, image supporting files uploader
     * @param files
     */
    $scope.supportingfileuploader = function (files) {
        var supporting_image_limit = $scope.ConfigData.supporting_image_limit;
        var video_download_limit = $scope.ConfigData.video_download_limit;
        var audio_download_limit = $scope.ConfigData.audio_download_limit;
        $scope.supportingfileerrormessage = '';
        $scope.supportingfileerror = false;
        //$scope.CommonFiles = [];
        $scope.SupportingFiles = [];

        if ($scope.supportfile) {
            var imagecount = 0;
            var audiocount = 0;
            var videocount = 0;
            _.each($scope.supportfile, function (val) {
                if (getExtension(val.name).toLowerCase() == "mp3") {
                    audiocount++;
                }
                else if (isImage(val.name)) {
                    imagecount++;
                }
                else if (isVideo(val.name)) {
                    videocount++;
                }
                else {
                    $scope.supportingfileerror = true;
                    $scope.supportingfileerrormessage = "Invalid File Extension.";
                    toastr.error($scope.supportingfileerrormessage);
                }
            })
            if (!$scope.supportingfileerror) {
                var flag = true;
                var otherimages = _.where($scope.Files, { ct_param_value: 'otherimage',file_category_id:$scope.Supporting });
                var otheraudio = _.where($scope.Files, { ct_param_value: 'otheraudio',file_category_id:$scope.Supporting  });
                var othervideos = _.where($scope.Files, { ct_param_value: 'othervideo',file_category_id:$scope.Supporting  });

                if (imagecount != 0) {
                    if (!((supporting_image_limit - otherimages.length - imagecount) >= 0)) {
                        flag = false;
                        $scope.supportingfileerror = true;
                        if (otherimages.length >= supporting_image_limit) {
                            $scope.supportingfileerrormessage = otherimages.length + " supporting image file already uploaded. You can't upload anymore.";
                        }
                        else {
                            if (otherimages.length == 0) {
                                $scope.supportingfileerrormessage = "You can upload only " + (supporting_image_limit - otherimages.length) + " supporting images.";
                            }
                            else {
                                $scope.supportingfileerrormessage = otherimages.length + " supporting image file already uploaded. You can upload only " + (supporting_image_limit - otherimages.length) + " supporting images.";
                            }
                        }
                        $scope.supportfile = '';
                        toastr.error($scope.supportingfileerrormessage);
                    }
                }
                if (audiocount != 0) {
                    if (!((audio_download_limit - otheraudio.length - audiocount) == 0)) {
                        flag = false;
                        $scope.supportingfileerror = true;
                        if (otheraudio.length >= audio_download_limit) {
                            $scope.supportingfileerrormessage = otheraudio.length + " supporting audio file already uploaded. You can't upload anymore.";
                        }
                        else {
                            if (otheraudio.length == 0) {
                                $scope.supportingfileerrormessage = "You can upload only " + (audio_download_limit - otheraudio.length) + " supporting audio.";
                            }
                            else {
                                $scope.supportingfileerrormessage = otheraudio.length + " supporting audio file already uploaded. You can upload only " + (audio_download_limit - otheraudio.length) + " supporting audio.";
                            }
                        }
                        $scope.supportfile = '';
                        toastr.error($scope.supportingfileerrormessage);
                    }
                }
                if (videocount != 0) {
                    if (!((video_download_limit - othervideos.length - videocount) == 0)) {
                        flag = false;
                        $scope.supportingfileerror = true;
                        if (othervideos.length >= video_download_limit) {
                            $scope.supportingfileerrormessage = othervideos.length + " supporting video file already uploaded. You can't upload anymore.";
                        }
                        else {
                            if (othervideos.length == 0) {
                                $scope.supportingfileerrormessage = "You can upload only " + (video_download_limit - othervideos.length) + " supporting video.";
                            }
                            else {
                                $scope.supportingfileerrormessage = othervideos.length + " supporting video file already uploaded. You can upload only " + (video_download_limit - othervideos.length) + " supporting video.";
                            }
                        }
                        $scope.supportfile = '';
                        toastr.error($scope.supportingfileerrormessage);
                    }
                }
                //console.log($scope.supportfile)

                if (flag) {
                    _.each($scope.supportfile, function (val) {
                        if (isImage(val.name)) {
                            var count = _.where($scope.SupportingFiles, { type: 'image' });
                            var match = _.find($scope.OtherTemplates, function (item) { return item.ct_param_value == 'otherimage' })
                            if (match) {
                                $scope.SupportingFiles.push({fileCategory:$scope.Supporting,  count: (otherimages.length + count.length + 1), file: val, type: 'image', ct_group_id: match.ct_group_id, cm_id: $scope.MetaId, width: null, height: null, other: 'common' })
                            }
                        }else if(getExtension(val.name).toLowerCase() == "mp3") {

                            var count = _.where($scope.SupportingFiles, { type: 'audio' });
                            var match = _.find($scope.OtherTemplates, function (item) { return item.ct_param_value == 'otheraudio' })
                            if (match) {
                                $scope.SupportingFiles.push({fileCategory:$scope.Supporting,  count: (otheraudio.length + count.length + 1), file: val, type: 'audio', ct_group_id: match.ct_group_id, cm_id: $scope.MetaId, width: null, height: null, other: 'common' })
                            }
                        }
                        else if (isVideo(val.name)) {
                            var count = _.where($scope.SupportingFiles, { type: 'video' });
                            var match = _.find($scope.OtherTemplates, function (item) { return item.ct_param_value == 'othervideo' })
                            if (match) {
                                $scope.SupportingFiles.push({fileCategory:$scope.Supporting,  count: (othervideos.length + count.length + 1), file: val, type: 'video', ct_group_id: match.ct_group_id, cm_id: $scope.MetaId, width: null, height: null, other: 'common' })
                            }
                        }
                    })
                }
            }
        }
    }
    /**
     * @desc validate audio, video, image preview files uploader
     * @param files
     */
    $scope.commonfileuploader = function (files) {
        var supporting_image_limit = $scope.ConfigData.supporting_image_limit;
        var video_preview_limit = $scope.ConfigData.video_preview_limit;
        var audio_preview_limit = $scope.ConfigData.audio_preview_limit;
        $scope.commonfileerror = false;
        $scope.CommonFiles = [];
        if ($scope.commonfile) {
            var audiocount = 0;
            var imagecount = 0;
            var videocount = 0;

            _.each($scope.commonfile, function (val) {
                if (getExtension(val.name).toLowerCase() == "mp3") {
                    audiocount++;
                }
                else if (isImage(val.name)) {
                    imagecount++;
                }
                else if (isVideo(val.name)) {
                    videocount++;
                }
                else {
                    $scope.commonfileerror = true;
                    $scope.commonfileerrormessage = "Invalid Common File Extension.";
                    toastr.error($scope.commonfileerrormessage);
                }
            })
            if (!$scope.commonfileerror) {
                var flag = true;
                var otherimages = _.where($scope.Files, { ct_param_value: 'otherimage',file_category_id:$scope.Preview  });
                var otheraudio = _.where($scope.Files, { ct_param_value: 'otheraudio',file_category_id:$scope.Preview });
                var othervideos = _.where($scope.Files, { ct_param_value: 'othervideo',file_category_id:$scope.Preview });

                if (imagecount != 0) {
                    if (!((supporting_image_limit - otherimages.length - imagecount) >= 0)) {
                        flag = false;
                        $scope.commonfileerror = true;
                        if (otherimages.length >= supporting_image_limit) {
                            $scope.commonfileerrormessage = otherimages.length + " preview image file already uploaded. you can't upload anymore.";
                        } else {
                            if (otherimages.length == 0) {
                                $scope.commonfileerrormessage = "You can upload only " + (supporting_image_limit - otherimages.length) + " preview images.";
                            }
                            else {
                                if(supporting_image_limit > otherimages.length){
                                    $scope.commonfileerrormessage = otherimages.length + " preview image file already uploaded. You can upload only " + Math.abs(supporting_image_limit - otherimages.length) + " common images.";
                                }else{
                                    $scope.commonfileerrormessage = otherimages.length + " preview image file already uploaded. You can't upload anymore.";
                                }
                            }

                        }
                        $scope.commonfile = '';
                        toastr.error($scope.commonfileerrormessage);
                    }
                }
                if (audiocount != 0) {
                    if (!((audio_preview_limit - otheraudio.length - audiocount) == 0)) {
                        flag = false;
                        $scope.commonfileerror = true;
                        if (otheraudio.length >= audio_preview_limit) {
                            $scope.commonfileerrormessage = otheraudio.length + " preview audio file already uploaded. You can't upload anymore.";
                        }
                        else {
                            if (otheraudio.length == 0) {
                                $scope.commonfileerrormessage = "You can upload only " + (audio_preview_limit - otheraudio.length) + " preview audio.";
                            }
                            else {
                                $scope.commonfileerrormessage = otheraudio.length + " preview audio file already uploaded. You can upload only " + (audio_preview_limit - otheraudio.length) + " preview audio.";
                            }
                        }
                        $scope.commonfile = '';
                        toastr.error($scope.commonfileerrormessage);
                    }
                }
                if (videocount != 0) {
                    if (!((video_preview_limit - othervideos.length - videocount) >= 0)) {
                        flag = false;
                        $scope.commonfileerror = true;
                        if (othervideos.length >= video_preview_limit) {
                            $scope.commonfileerrormessage = othervideos.length + " preview video file already uploaded. You can't upload anymore.";
                        }
                        else {
                            if (othervideos.length == 0) {
                                $scope.commonfileerrormessage = "You can upload only " + (video_preview_limit - othervideos.length) + " preview video.";
                            }
                            else {
                                if(video_preview_limit > othervideos.length){
                                    $scope.commonfileerrormessage = othervideos.length + " preview video file already uploaded. you can upload only " + Math.abs(video_preview_limit - othervideos.length) + " common video.";
                                }else{
                                    $scope.commonfileerrormessage = othervideos.length + " preview video file already uploaded. You can't upload anymore.";
                                }
                            }
                        }
                        $scope.commonfile = '';
                        toastr.error($scope.commonfileerrormessage);
                    }
                }
                //console.log($scope.commonfile)

                if (flag) {
                    _.each($scope.commonfile, function (val, index) {
                        if (isImage(val.name)) {

                            var count = _.where($scope.CommonFiles, { type: 'image' });
                            var match = _.find($scope.OtherTemplates, function (item) { return item.ct_param_value == 'otherimage' })
                            if (match) {
                               // $scope.CommonFiles.push({fileCategory:$scope.Preview,  count: (otherimages.length + count.length + 1), file: val, type: 'image', ct_group_id: match.ct_group_id, cm_id: $scope.MetaId, width: null, height: null, other: 'common' })
                                $scope.CommonFiles.push({fileCategory:$scope.Preview,  count: (otherimages.length + count.length + 1), file: val, type: 'image', ct_group_id: match.ct_group_id, cm_id: $scope.MetaId, width: null, height: null, other: 'common' })
                            }
                        }else if(getExtension(val.name).toLowerCase() == "mp3") {

                            var count = _.where($scope.CommonFiles, { type: 'audio' });
                            var match = _.find($scope.OtherTemplates, function (item) { return item.ct_param_value == 'otheraudio' })
                            if (match) {
                                $scope.CommonFiles.push({fileCategory:$scope.Preview,  count: (otheraudio.length + count.length + 1), file: val, type: 'audio', ct_group_id: match.ct_group_id, cm_id: $scope.MetaId, width: null, height: null, other: 'common' })
                            }
                        }

                        else if (isVideo(val.name)) {
                            var count = _.where($scope.CommonFiles, { type: 'video' });
                            var match = _.find($scope.OtherTemplates, function (item) { return item.ct_param_value == 'othervideo' })
                            if (match) {
                                $scope.CommonFiles.push({fileCategory:$scope.Preview,  count: (othervideos.length + count.length + 1), file: val, type: 'video', ct_group_id: match.ct_group_id, cm_id: $scope.MetaId, width: null, height: null, other: 'common' })
                            }
                        }
                    })
                }
                console.log($scope.CommonFiles)

            }
        }
    }
    /**
     * @desc upload audio, video, image, thumb, games, text main/supporting/preview files uploader
      * @param files
     */
    $scope.upload = function (files) {
        //console.log($scope.TypeName)
        if ($scope.TypeName == "Imagery") {
           // if ($scope.wallpaperfile  || $scope.CommonFiles.length > 0 || $scope.thumbfile) {
                if ($scope.thumberror || $scope.wallpapererror) {
                    toastr.error($scope.thumberror ? $scope.thumberrormessage : $scope.wallpapererrormessage);
                }
                else {
                    ngProgress.start();
                    $scope.uploading = true;
                    ThumbUpload(0, {upload:'thumb'}, function (data) {
                        WallpaperUpload(0, {upload:'main'}, function (data) {
                            SupportingUpload(0, {upload:'supporting'}, function (data) {
                                PreviewUpload(0, {upload:'preview'}, function (data) {
                                    SupportingTextFileUpload(0, {upload: 'text'}, function (data) {
                                        ngProgress.complete();
                                        $scope.uploading = false;

                                    });
                                })
                            });
                        });
                    });
                }
            /*}
            else {
                toastr.error("Please upload base wallpaper file.");
            }*/
        }
        else if ($scope.TypeName == "Video") {
            //if ($scope.videofile || $scope.CommonFiles.length > 0 || $scope.thumbfile) {
                if ($scope.thumberror || $scope.videoerror) {
                    toastr.error($scope.thumberror ? $scope.thumberrormessage : $scope.videoerrormessage);
                }
                else {
                    ngProgress.start();
                    $scope.uploading = true;
                    ThumbUpload(0, {upload:'thumb'}, function (data) {
                        VideoUpload(0, {upload:'main'}, function (data) {
                            SupportingUpload(0, {upload:'supporting'}, function (data) {
                                PreviewUpload(0, {upload:'preview'}, function (data) {
                                    SupportingTextFileUpload(0, {upload:'text'}, function (data) {
                                        ngProgress.complete();
                                        $scope.uploading = false;
                                    })
                                });
                            });
                        });
                    });
                }
            /*}
            else {
                toastr.error("Please upload base video file.");
            }*/
        }
        else if ($scope.TypeName == "Audio") {
                if ($scope.thumberror || $scope.audioerror) {
                    toastr.error($scope.thumberror ? $scope.thumberrormessage : $scope.audioerrormessage);
                } else {
                    ngProgress.start();
                    $scope.uploading = true;
                    ThumbUpload(0, {upload:'thumb'}, function (data) {
                        AudioUpload(0, {upload:'main'}, function (data) {
                            SupportingUpload(0, {upload:'supporting'}, function (data) {
                                PreviewUpload(0, {upload:'preview'}, function (data) {
                                    SupportingTextFileUpload(0, {upload:'text'}, function (data) {
                                        ngProgress.complete();
                                        $scope.uploading = false;
                                    })
                                });
                            });
                        });
                    });
                }
            /*}
            else {
                toastr.error("Please upload base audio file.");
            }*/
        }
        else if ($scope.TypeName == "AppsGames") {
            //if ($scope.thumbfile || $scope.gameimagefile || $scope.gamevideofile || $scope.gameappfile) {
                if ($scope.thumberror || $scope.gameimageerror || $scope.gamevideoerror || $scope.gameapperror) {
                    toastr.error($scope.thumberror ? $scope.thumberrormessage : $scope.gameimageerror ? $scope.gameimageerrormessage : $scope.gamevideoerror ? $scope.gamevideoerrormessage : $scope.gameapperrormessage);
                }
                else if (!$scope.gameappfile || ($scope.gameappfile && $scope.GroupHandset.length > 0)) {
                    ngProgress.start();
                    $scope.uploading = true;
                    ThumbUpload(0, {upload:'thumb'}, function (data) {
                        GameAppUpload(0, {upload:'main'}, function (data) {
                            SupportingUpload(0, {upload:'supporting'}, function (data) {
                                PreviewUpload(0, {upload:'preview'}, function (data) {
                                    SupportingTextFileUpload(0, {upload:'text'}, function (data) {
                                        ngProgress.complete();
                                        $scope.uploading = false;
                                    })
                                });
                            });
                        });
                    });
                }
                else {
                    toastr.error("Please add Handset for map with App File.");
                }
            /*}
            else {
                toastr.error("Please upload app file or supporting files.");
            }*/
            $scope.GamePartVisible = true;
        }
        else if ($scope.TypeName == "Text") {
            if ($scope.TextError.length == 0) {
               // if ($scope.thumbfile ||  ($scope.CommonFiles.length >0)  || ($scope.TextFiles.length > 0 || $scope.commonfileerror)) {
               /*if ($scope.thumberror || $scope.supportingfileerror || $scope.commonfileerror) {
                 toastr.error($scope.thumberror ? $scope.thumberrormessage : $scope.commonfileerror ?  $scope.commonfileerrormessage : $scope.supportingfileerrormessage);
               }*/
                if ($scope.thumberror || $scope.commonfileerror) {
                        toastr.error($scope.thumberror ? $scope.thumberrormessage : $scope.commonfileerrormessage);
                    }
                    else {
                        ngProgress.start();
                        $scope.uploading = true;
                        ThumbUpload(0, {upload:'thumb'}, function (data) {
                            TextFileUpload(0, {upload:'main'}, function (data) {
                                SupportingUpload(0, {upload:'supporting'}, function (data) {
                                    PreviewUpload(0, {upload:'preview'}, function (data) {
                                        SupportingTextFileUpload(0, {upload: 'text'}, function (data) {
                                            ngProgress.complete();
                                            $scope.uploading = false;
                                        });
                                    })
                                });
                            });
                        });
                    }
                /*}
                else {
                    toastr.error("Please upload common files or text files.");
                }*/
            }
            else {
                toastr.error($scope.TextError[0].error);

            }
        }
    }
    /**
     * @desc Upload Thumbnails files
     * @param tu
     * @param item
     * @param success
     * @constructor
     */
    function ThumbUpload(tu,item,success) {
        if(item.upload === 'thumb' && $scope.ThumbFiles && $scope.ThumbFiles.length > 0) {
            ContentFile.Upload('/uploadThumb', {
                bulkAudioVisible: $scope.BulkAudioVisible,
                count: $scope.ThumbFiles[tu].count,
                file: $scope.ThumbFiles[tu].file,
                cm_title: $scope.cm_title,
                TypeName: $scope.TypeName,
                MetaDataId: $scope.MetadataId,
                cm_id: $scope.MetaId,
                other: null,
                width: $scope.ThumbFiles[tu].width,
                height: $scope.ThumbFiles[tu].height,
                ct_group_id: null
            }, function (resp) {
                $scope.ThumbDataFiles = resp.data.ThumbFiles;
                toastr.success(resp.config.data.file.name + ' Thumb file uploaded successfully.');
                tu = tu + 1;
                if (tu == $scope.ThumbFiles.length) {

                    $("#thumbfile").val("");
                    $scope.thumbfile = null;
                    $scope.ThumbFiles = [];
                  //  $scope.uploading = false;
                 //   ngProgress.complete();
                    success(item.upload);
                }
                else {
                    ThumbUpload(tu,item,success);
                }
            }, function (error) {
                toastr.error(error);
                $scope.uploading = false;
                ngProgress.complete();
            });
        }else{
            success(item.upload);
        }
    }

    /**
     * @desc Upload Imagery files
     * @param wu
     * @param item
     * @param success
     * @constructor
     */
    function WallpaperUpload(wu,item,success) {
        if(item.upload === 'main' && $scope.WallPaperFiles && $scope.WallPaperFiles.length > 0 ) {
            var data = $scope.WallPaperFiles[wu];
            ContentFile.Upload('/upload' + $scope.TypeName, {
                fileCategory: data.fileCategory,
                file: data.file,
                cm_title: $scope.cm_title,
                other: data.other,
                TypeName: $scope.TypeName,
                MetaDataId: $scope.MetadataId,
                cm_id: $scope.MetaId,
                width: data.width,
                height: data.height,
                ct_group_id: data.ct_group_id
            }, function (resp) {
                $scope.Files = resp.data.Files;
                toastr.success(resp.config.data.file.name + ' Base file uploaded successfully.');
                wu = wu + 1;
                if (wu == $scope.WallPaperFiles.length) {
                    $("#thumbfile").val("");
                    $("#wallpaperfile").val("");
                    $scope.WallPaperFiles = [];
                    $scope.thumbfile = null;
                    $scope.wallpaperfile = null;
                   // $scope.uploading = false;
                  //  ngProgress.complete();
                    success(item.upload);
                }
                else {
                    WallpaperUpload(wu,item,success);
                }
            }, function (error) {
                toastr.error(error);
                $scope.uploading = false;
                ngProgress.complete();
            });
        }else {
           /// toastr.error("Please upload base imagery file.");
            success(item.upload);
        }
    }

    /**
     * @desc Upload Video files
     * @param vu
     * @param item
     * @param success
     * @constructor
     */
    function VideoUpload(vu,item,success) {
        if(item.upload === 'main' && $scope.VideoFiles && $scope.VideoFiles.length > 0 ) {
            var data = $scope.VideoFiles[vu];
            ContentFile.Upload('/upload' + $scope.TypeName, {
                fileCategory: data.fileCategory,
                file: data.file,
                cm_title: $scope.cm_title,
                other: data.other,
                TypeName: $scope.TypeName,
                MetaDataId: $scope.MetadataId,
                cm_id: $scope.MetaId,
                width: data.width,
                height: data.height,
                ct_group_id: data.ct_group_id
            }, function (resp) {
                if (resp.data.success) {
                    $scope.Files = resp.data.Files;
                    toastr.success(resp.config.data.file.name + ' Base file uploaded successfully.');
                    vu = vu + 1;
                    if (vu == $scope.VideoFiles.length) {
                        $("#thumbfile").val("");
                        $("#videofile").val("");
                        $scope.videofile = null;
                       // $scope.uploading = false;
                       // ngProgress.complete();
                        success(item.upload);
                    }
                    else {
                        VideoUpload(vu,item,success);
                    }
                }
                else {
                    $("#thumbfile").val("");
                    $("#videofile").val("");
                    $scope.thumbfile = null;
                    $scope.videofile = null;
                    toastr.error(resp.data.message);
                   // $scope.uploading = false;
                   // ngProgress.complete();
                    success(item.upload);
                }
            }, function (error) {
                toastr.error(error);
                $scope.uploading = false;
                ngProgress.complete();
            });
        }else {
           // toastr.error("Please upload base video file.");
            success(item.upload);
        }
}

    /**
     * @desc Upload Audio files
     * @param au
     * @param item
     * @param success
     * @constructor
     */
    function AudioUpload(au,item,success) {
        if(item.upload === 'main' && $scope.AudioFiles && $scope.AudioFiles.length > 0 ) {
            var data = $scope.AudioFiles[au];
            ContentFile.Upload('/upload' + $scope.TypeName, {
                fileCategory: data.fileCategory,
                file: data.file,
                cm_title: $scope.cm_title,
                other: data.other,
                TypeName: $scope.TypeName,
                MetaDataId: $scope.MetadataId,
                cm_id: $scope.MetaId,
                width: data.width,
                height: data.height,
                ct_group_id: data.ct_group_id
            }, function (resp) {
                if (resp.data.success) {
                    $scope.Files = resp.data.Files;
                    toastr.success(resp.config.data.file.name + ' Base file uploaded successfully.');
                    au = au + 1;
                    if (au == $scope.AudioFiles.length) {

                        $("#audiofile").val("");
                        $scope.AudioFiles = [];
                        $scope.audiofile = null;
                        success(item.upload);
                    }
                    else {
                        AudioUpload(au, item, success);
                    }
                }
            }, function (error) {
                toastr.error(error);
                $scope.uploading = false;
                ngProgress.complete();
            });
        }else{
          //  toastr.error("Please upload base audio file.");
            success(item.upload);
        }
    }

    /**
     * @desc Upload Game files
     * @param ga
     * @param item
     * @param success
     * @constructor
     */
    function GameAppUpload(ga,item,success) {
        if(item.upload === 'main' && $scope.GameAppFiles && $scope.GameAppFiles.length > 0 ) {

            var data = $scope.GameAppFiles[ga];
            var handsets = _.unique(_.pluck($scope.GroupHandset, "dc_id"));
            ContentFile.Upload('/upload' + $scope.TypeName, {
                fileCategory: data.fileCategory,
                count: data.count,
                Handsets: handsets.toString(),
                file: data.file,
                cm_title: $scope.cm_title,
                other: data.other,
                type: 'app',
                TypeName: $scope.TypeName,
                MetaDataId: $scope.MetadataId,
                cm_id: $scope.MetaId,
                width: data.width,
                height: data.height,
                ct_group_id: data.ct_group_id
            }, function (resp) {
                $scope.Files = resp.data.Files;
                toastr.success(resp.config.data.file.name + ' Game App file uploaded successfully.');
                ga = ga + 1;
                if (ga == $scope.GameAppFiles.length) {
                    $("#thumbfile").val("");
                    $("#gameimagefile").val("");
                    $("#gamevideofile").val("");
                    $("#gameappfile").val("");
                    $scope.GameAppFiles = [];
                    $scope.thumbfile = null;
                    $scope.gameimagefile = null;
                    $scope.gamevideofile = null;
                    $scope.gameappfile = null;
                    //$scope.uploading = false;
                    $scope.SelectedHandsetGroup = "";
                    $scope.HandsetGroupChange();
                    success(item.upload);

                    //ngProgress.complete();
                }
                else {
                    GameAppUpload(ga,item,success);
                }
            }, function (error) {
                toastr.error(error);
                $scope.uploading = false;
                ngProgress.complete();
            });
        }else{
           // toastr.error("Please upload app file.");
            success(item.upload);
        }
    }

    /**
     * @desc Upload Text Language files
     * @param tuf
     * @param item
     * @param success
     * @constructor
     */
    function TextFileUpload(tuf,item,success) {
        if(item.upload === 'main' && $scope.TextFiles && $scope.TextFiles.length > 0 ) {
            var data = $scope.TextFiles[tuf];
            ContentFile.Upload('/upload' + $scope.TypeName, {
                fileCategory: data.fileCategory,
                count: data.count,
                file: data.file,
                cm_title: $scope.cm_title,
                langaugemetaid: data.langaugemetaid,
                TypeName: $scope.TypeName,
                MetaDataId: $scope.MetadataId,
                cm_id: $scope.MetaId,
                width: data.width,
                height: data.height,
                ct_group_id: data.ct_group_id,
                ct_param: data.ct_param,
                ct_param_value: data.ct_param_value
            }, function (resp) {
                $scope.Files = resp.data.Files;
                toastr.success(resp.config.data.file.name + ' text file uploaded successfully.');
                tuf = tuf + 1;
                if (tuf == $scope.TextFiles.length) {
                    $("#thumbfile").val("");
                    $(".textfile").val("");
                    $("#commonfile").val("");
                    $scope.thumbfile = null;
                    $scope.TextFiles = [];
                    $scope.commonfile = null;
                  //  ngProgress.complete();
                  //  $scope.uploading = false;
                    success(item.upload);

                }
                else {
                    TextFileUpload(tuf, item, success);
                }
            }, function (error) {
                toastr.error(error);
                $scope.uploading = false;
                ngProgress.complete();
            });
        }else{
            //toastr.error("Please upload text file.");
            success(item.upload);

        }
    }

    /**
     * @desc Upload Supporting files
     * @param tcu
     * @param item
     * @param success
     * @constructor
     */
    function SupportingUpload(tcu,item,success) {
        if(item.upload === 'supporting' && $scope.SupportingFiles && $scope.SupportingFiles.length > 0) {
            var data = $scope.SupportingFiles[tcu];
             ContentFile.Upload('/uploadotherfiles', {
                fileCategory: data.fileCategory,
                count: data.count,
                file: data.file,
                cm_title: $scope.cm_title,
                other: data.other,
                type: data.type,
                TypeName: $scope.TypeName,
                MetaDataId: $scope.MetadataId,
                cm_id: $scope.MetaId,
                width: data.width,
                height: data.height,
                ct_group_id: data.ct_group_id
            }, function (resp) {
                $scope.Files = resp.data.Files;
                toastr.success(resp.config.data.file.name + ' Supporting file uploaded successfully.');
                tcu = tcu + 1;
                if (tcu == $scope.SupportingFiles.length) {
                    $("#supportfile").val("");
                    $scope.SupportingFiles = [];
                 //   $scope.commonfile = null;
                    $scope.supportfile = null;
                    success(item.upload);
                }
                else {
                    SupportingUpload(tcu, item, success);
                }
            }, function (error) {
                toastr.error(error);
                $scope.uploading = false;
                ngProgress.complete();
            });
        }else{            //or supporting files
            //toastr.error("Please upload supporting files.");
            success(item.upload);
        }
    }

    /**
     * @desc Upload Preview files
     * @param tcu
     * @param item
     * @param success
     * @constructor
     */
    function PreviewUpload(tcu,item,success) {
        if(item.upload === 'preview' && $scope.CommonFiles && $scope.CommonFiles.length > 0) {
            var data = $scope.CommonFiles[tcu];
           // var filetype = (data.fileCategory == 2)? 'Supporting' : 'Preview';
            ContentFile.Upload('/uploadotherfiles', {
                fileCategory: data.fileCategory,
                count: data.count,
                file: data.file,
                cm_title: $scope.cm_title,
                other: data.other,
                type: data.type,
                TypeName: $scope.TypeName,
                MetaDataId: $scope.MetadataId,
                cm_id: $scope.MetaId,
                width: data.width,
                height: data.height,
                ct_group_id: data.ct_group_id
            }, function (resp) {
                $scope.Files = resp.data.Files;
                toastr.success(resp.config.data.file.name + ' Preview file uploaded successfully.');
                tcu = tcu + 1;
                if (tcu == $scope.CommonFiles.length) {
                    $("#commonfile").val("");
                    $scope.CommonFiles = [];
                    $scope.commonfile = null;
                   // $scope.supportfile = null;
                    success(item.upload);
                }
                else {
                    PreviewUpload(tcu, item, success);
                }
            }, function (error) {
                toastr.error(error);
                $scope.uploading = false;
                ngProgress.complete();
            });
        }else{            //or supporting files
            //toastr.error("Please upload supporting files.");
            success(item.upload);
        }
    }

    /**
     * @desc Upload Supporting Text Language files
     * @param tuf
     * @param item
     * @param success
     * @constructor
     */
    function SupportingTextFileUpload(tuf,item,success) {
        if(item.upload === 'text' && $scope.LangSupportFiles && $scope.LangSupportFiles.length > 0) {
            var data = $scope.LangSupportFiles[tuf];
            var filetype = (data.fileCategory == 2)? 'Supporting' : 'Preview';
             var languageMetadata = data.langaugemetaid;
            ContentFile.Upload('/uploadotherfiles', {
                fileCategory: data.fileCategory,
                count: data.count,
                file: data.file,
                type: item.upload,
                cm_title: $scope.cm_title,
                langaugemetaid: data.langaugemetaid,
                TypeName: $scope.TypeName,
                MetaDataId: $scope.MetadataId,
                cm_id: $scope.MetaId,
                width: data.width,
                height: data.height,
                ct_group_id: data.ct_group_id,
                ct_param: data.ct_param,
                ct_param_value: data.ct_param_value
            }, function (resp) {
                $scope.Files = resp.data.Files;
                toastr.success(resp.config.data.file.name + ' ' + filetype+' language file uploaded successfully.');
                tuf = tuf + 1;
                $("#langsupportfile_"+languageMetadata).val("");

                if (tuf == $scope.LangSupportFiles.length) {
                    $scope.LangSupportFiles = [];
                   // ngProgress.complete();
                    //$scope.uploading = false;
                    success(item.upload);
                }
                else {
                    SupportingTextFileUpload(tuf, item, success);
                }
            }, function (error) {
                console.log('error')
                toastr.error(error);
                $scope.uploading = false;
                ngProgress.complete();
            });
        }else{
           // toastr.error("Please upload supporting text files.");
            success(item.upload);
        }
    }
});

