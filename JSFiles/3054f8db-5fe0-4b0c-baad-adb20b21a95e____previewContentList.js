/**
 * Created by sujata.patne on 22-04-2016.
 */
myApp.directive('contentFileListGrid', function () {
    return {
        scope: true,
        tranclude: true,
        templateUrl: '../../partials/views/content-file-list.html',
        controller: function ($scope, ngProgress, Upload, ContentFile) {
            $scope.uploadAudio = function (isvalid) {
                if (isvalid) {
                    if ($scope.replacefile) {
                        if (!$scope.InvalidFileError) {
                            imageloop(0);
                            function imageloop(cnt) {
                                $scope.uploading = true;
                                ngProgress.start();
                                var match1 = _.find($scope.audioBitrateFiles, function (val) {
                                    return val.filename_128 == $scope.replacefile[cnt].name.toLowerCase()
                                });
                                var match2 = _.find($scope.audioBitrateFiles, function (val) {
                                    return val.filename_64 == $scope.replacefile[cnt].name.toLowerCase()
                                });
                                var match3 = _.find($scope.audioBitrateFiles, function (val) {
                                    return val.filename_32 == $scope.replacefile[cnt].name.toLowerCase()
                                });
                                var match = (match1) ? match1 : (match2) ? match2 : match3;

                                if (match) {
                                    ContentFile.Upload('/replaceFile', {
                                        file: $scope.replacefile[cnt],
                                        filepath: match.cf_url,
                                        cm_title: $scope.cm_title,
                                        TypeName: $scope.TypeName,
                                        cm_id: $scope.MetaId
                                    }, function (resp) {
                                        $scope.getTime = new Date().getTime();
                                        toastr.success(resp.config.data.file.name + '  file replaced successfully.');
                                        cnt = cnt + 1;
                                        if (!(cnt == $scope.replacefile.length)) {
                                            imageloop(cnt);
                                        } else {
                                            $("#replacefile").val("");
                                            $scope.uploading = false;
                                            ngProgress.complete();
                                        }
                                    }, function (error) {
                                        toastr.error(error);
                                        $scope.uploading = false;
                                        ngProgress.complete();
                                    });
                                }
                            }
                        } else {
                            $scope.InvalidFileError = true;
                            $scope.InvalidFileErrorMessage = $scope.replacefile[cnt].name + " File does not match any files.";
                            toastr.error($scope.InvalidFileErrorMessage);
                        }
                    } else {
                        toastr.error("Please upload file to replace file.");
                    }
                }
            }
            $scope.upload = function (isvalid) {
                if (isvalid) {
                    if ($scope.replacefile) {
                        if (!$scope.InvalidFileError) {
                            $scope.uploading = true;
                            ngProgress.start();
                            imageloop(0);
                            function imageloop(cnt) {

                                var match = _.find($scope.Files, function (val) {
                                    return val.filename == $scope.replacefile[cnt].name.toLowerCase()
                                });

                                if (match) {
                                    ContentFile.Upload('/replaceFile', {file: $scope.replacefile[cnt], filepath: match.cf_url, cm_title: $scope.cm_title, TypeName: $scope.TypeName, cm_id: $scope.MetaId}, function (resp) {
                                        $scope.getTime = new Date().getTime();
                                        toastr.success(resp.config.data.file.name + '  file replaced successfully.');
                                        cnt = cnt + 1;
                                        if (!(cnt == $scope.replacefile.length)) {
                                            imageloop(cnt);
                                        } else {
                                            $("#replacefile").val("");
                                            $scope.uploading = false;
                                            ngProgress.complete();
                                        }
                                    }, function (error) {
                                        toastr.error(error);
                                        $scope.uploading = false;
                                        ngProgress.complete();
                                    });
                                }
                            }
                        } else {
                            toastr.error($scope.InvalidFileErrorMessage);
                        }
                    } else {
                        toastr.error("Please upload file to replace file.");
                    }
                }
            }
            $scope.replacefileupload = function () {
                $scope.InvalidFileError = false;
                if ($scope.replacefile) {
                    imageloop(0);
                    function imageloop(cnt) {
                        var match = _.find($scope.Files, function (val) {
                            return val.filename == $scope.replacefile[cnt].name.toLowerCase()
                        });
                        if (match) {
                            cnt = cnt + 1;
                            if (cnt == $scope.replacefile.length) {
                            } else {
                                imageloop(cnt);
                            }
                        } else {
                            $scope.InvalidFileError = true;
                            $scope.InvalidFileErrorMessage = $scope.replacefile[cnt].name + " File does not match any files.";
                            toastr.error($scope.InvalidFileErrorMessage);
                        }
                    }
                }
            }
            $scope.replaceAudioFileupload = function () {
                $scope.InvalidFileError = false;
                if ($scope.replacefile) {
                    $scope.uploading = true;
                    ngProgress.start();
                    imageloop(0);
                    function imageloop(cnt) {
                        var match1 = _.find($scope.audioBitrateFiles, function (val) {
                            return val.filename_128 == $scope.replacefile[cnt].name.toLowerCase()
                        });
                        var match2 = _.find($scope.audioBitrateFiles, function (val) {
                            return val.filename_64 == $scope.replacefile[cnt].name.toLowerCase()
                        });
                        var match3 = _.find($scope.audioBitrateFiles, function (val) {
                            return val.filename_32 == $scope.replacefile[cnt].name.toLowerCase()
                        });
                        if (match1 || match2 || match3) {
                            cnt = cnt + 1;
                            if (cnt == $scope.replacefile.length) {
                                $("#replacefile").val("");
                                $scope.uploading = false;
                                ngProgress.complete();
                            } else {
                                imageloop(cnt);
                            }
                        } else {
                            $scope.InvalidFileError = true;
                            $scope.InvalidFileErrorMessage = $scope.replacefile[cnt].name + " File does not match any files.";
                            toastr.error($scope.InvalidFileErrorMessage);
                        }
                    }
                }
            }
            $scope.getAudioData = function () {
                $scope.audioBitrateFiles = [];
                _.each($scope.AudioFiles, function (val) {
                    val.type = 'audio';
                    val.Name = 'Audio File';
                    val.filename_128 = (val.high_url) ? val.high_url.substring(val.high_url.lastIndexOf("/") + 1).toLowerCase() : '';
                    val.filename_64 = (val.medium_url) ? val.medium_url.substring(val.medium_url.lastIndexOf("/") + 1).toLowerCase() : '';
                    val.filename_32 = (val.low_url) ? val.low_url.substring(val.low_url.lastIndexOf("/") + 1).toLowerCase() : '';

                    if (val.filename_128 != '' || val.filename_64 != '' || val.filename_32 != '') {
                        $scope.audioBitrateFiles.push(val);
                    }
                });

                $scope.audioFileDetails = BindMasterList($scope.audioBitrateFiles);
                //$scope.filesdetail = BindMasterList($scope.audioBitrateFiles);
                console.log($scope.audioFileDetails);

            }
            $scope.resetSearch = function () {
                $scope.currentPage = 0;
                $scope.SearchUsername = '';
            }
        }
    };
});

myApp.directive('thumbFileListGrid', function () {
    return {
        scope: true,
        tranclude: true,
        templateUrl: '../../partials/views/thumb-file-list.html',
        controller: function ($scope, ngProgress, Upload, ContentFile) {
            $scope.upload = function (isvalid) {
                if (isvalid) {
                    if ($scope.replaceThumbfile) {
                        if (!$scope.InvalidFileError) {
                            $scope.uploading = true;
                            ngProgress.start();
                            imageloop(0);
                            function imageloop(cnt) {

                                var match = _.find($scope.Thumbs, function (val) {
                                    return val.filename == $scope.replaceThumbfile[cnt].name.toLowerCase()
                                });

                                if (match) {
                                    ContentFile.Upload('/replaceThumbFile', {file: $scope.replaceThumbfile[cnt], filepath: match.cf_url, cm_title: $scope.cm_title, TypeName: $scope.TypeName, cm_id: $scope.MetaId}, function (resp) {
                                        $scope.getTime = new Date().getTime();
                                        toastr.success(resp.config.data.file.name + '  file replaced successfully.');
                                        cnt = cnt + 1;
                                        if (!(cnt == $scope.replaceThumbfile.length)) {
                                            imageloop(cnt);
                                        } else {
                                            $("#replaceThumbfile").val("");
                                            $scope.uploading = false;
                                            ngProgress.complete();
                                        }
                                    }, function (error) {
                                        toastr.error(error);
                                        $scope.uploading = false;
                                        ngProgress.complete();
                                    });
                                }
                            }
                        } else {
                            toastr.error($scope.InvalidFileErrorMessage);
                        }
                    } else {
                        toastr.error("Please upload file to replace file.");
                    }
                }
            }
            $scope.replaceThumbfileupload = function () {
                $scope.InvalidFileError = false;
                if ($scope.replaceThumbfile) {
                    imageloop(0);
                    function imageloop(cnt) {
                        var match = _.find($scope.Thumbs, function (val) {
                            return val.filename == $scope.replaceThumbfile[cnt].name.toLowerCase()
                        });
                        if (match) {
                            cnt = cnt + 1;
                            if (cnt == $scope.replaceThumbfile.length) {
                            } else {
                                imageloop(cnt);
                            }
                        } else {
                            $scope.InvalidFileError = true;
                            $scope.InvalidFileErrorMessage = $scope.replaceThumbfile[cnt].name + " File does not match any files.";
                            toastr.error($scope.InvalidFileErrorMessage);
                        }
                    }
                }
            }
            $scope.resetSearch = function () {
                $scope.currentPage = 0;
                $scope.SearchUsername = '';
            }
        }
    };
});

myApp.directive('previewFileListGrid', function () {
    return {
        scope: true,
        transclude: true,
        templateUrl: '../../partials/views/preview-file-list.html',
        controller: function ($scope, $attrs, ngProgress, Upload, ContentFile, $window) {
            $scope.uploadFiles = [];
            $scope.replaceSupportingFile = [];
            $scope.tempFiles = [];

            function getExtension(filename) {
                var parts = filename.split('.');
                return parts[parts.length - 1];
            }
            function isImage(filename) {
                var ext = getExtension(filename);
                switch (ext.toLowerCase()) {
                    case 'jpg':
                    case 'jpeg':
                    case 'gif':
                    case 'bmp':
                    case 'png':
                        //etc
                        return true;
                }
                return false;
            }
            function isVideo(filename) {
                var ext = getExtension(filename);
                switch (ext.toLowerCase()) {
                    case 'm4v':
                    case 'avi':
                    case 'mpg':
                    case 'mp4':
                        // etc
                        return true;
                }
                return false;
            }

            $scope.replacePreviewFileUpload = function (cnt, success) {
                if ($scope.replaceSupportingFile && $scope.replaceSupportingFile.length > 0) {
                    if($scope.replaceSupportingFile[cnt]) {
                        var match = _.find($scope.PreviewFiles, function (val) {
                            return val.filename == $scope.replaceSupportingFile[cnt].file.name.toLowerCase()
                        });
                        if (match) {
                            ngProgress.start();
                            $scope.uploading = true;
                            ContentFile.Upload('/replaceFile', {
                                file: $scope.replaceSupportingFile[cnt].file,
                                filepath: match.cf_url,
                                cm_title: $scope.cm_title,
                               // TypeName: $scope.TypeName,
                                TypeName: match.Name,
                                cm_id: $scope.MetaId,
                                cf_id: match.cf_id
                            }, function (resp) {
                                /*var filename = resp.data.Files.cf_url.split('/');
                                $scope.PreviewFiles[cnt].filename = filename[3];
                                $scope.PreviewFiles[cnt].cf_url = resp.data.Files.cf_url;*/
                                $scope.PreviewFiles[cnt].cf_bitrate = resp.data.Files.cf_bitrate;

                                $scope.getTime = new Date().getTime();
                                toastr.success(resp.config.data.file.name + ' File replaced successfully.');
                                cnt = cnt + 1;
                                if (!(cnt == $scope.replaceSupportingFile.length)) {
                                    $scope.replacePreviewFileUpload(cnt, success);
                                } else {
                                    $scope.replaceSupportingFile = [];
                                    angular.element("input[type='file']").val(null);
                                    $scope.uploading = false;
                                    ngProgress.complete();
                                    success();
                                }
                            }, function (error) {
                                toastr.error(error);
                                $scope.uploading = false;
                                ngProgress.complete();
                                success();
                            });
                        } else {
                            toastr.error($scope.replaceSupportingFile[cnt].file.name + 'FileName does not match. ');
                            success();
                        }
                    }else{
                        cnt = cnt + 1;
                        if (!(cnt == $scope.replaceSupportingFile.length)) {
                            $scope.replacePreviewFileUpload(cnt, success);
                        } else {
                            success();
                        }
                    }
                } else {
                    // toastr.error('FileName does not match or nothing to replace ');
                    success();
                }
            }
            $scope.addPreviewFileUpload = function (tcu, success) {

                if ($scope.uploadFiles && $scope.uploadFiles.length > 0) {
                    var data = $scope.uploadFiles[tcu];
                    if(data){
                        ngProgress.start();
                        $scope.uploading = true;
                        ContentFile.Upload('/uploadotherfiles', {
                            fileCategory: $scope.Preview,
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
                            ct_group_id: data.ct_group_id,
                            ct_param_value: data.ct_param_value
                        }, function (resp) {
                            var filename = resp.data.Files.cf_url.split('/');
                            $scope.PreviewFiles[tcu].filename = filename[3];
                            $scope.PreviewFiles[tcu].cf_bitrate = resp.data.Files.cf_bitrate;
                            $scope.PreviewFiles[tcu].cf_url = resp.data.Files.cf_url;
                            console.log('data.ct_param_value')
                            console.log(data.ct_param_value)
                            if(data.ct_param_value == 'otherimage'){
                                $scope.PreviewFiles[tcu].measure = 'pixels';
                            }else if( data.ct_param_value == 'bitrate'){
                                $scope.PreviewFiles[tcu].measure = 'kbps';
                            }else{
                                $scope.PreviewFiles[tcu].measure = 'kb';
                            }
                            toastr.success(resp.config.data.file.name + ' preview file uploaded successfully.');
                            tcu = tcu + 1;
                            if (!(tcu == $scope.uploadFiles.length)) {
                                $scope.addPreviewFileUpload(tcu, success);
                            } else {
                                $scope.uploadFiles = [];
                                angular.element("input[type='file']").val(null);
                                $scope.uploading = false;
                                ngProgress.complete();
                                success();
                            }
                        }, function (error) {
                            toastr.error(error);
                            $scope.uploading = false;
                            ngProgress.complete();
                            success();
                        });
                    } else {
                        tcu = tcu + 1;
                        if (!(tcu == $scope.uploadFiles.length)) {
                            $scope.addPreviewFileUpload(tcu, success);
                        } else {
                            success();
                        }
                    }
                } else {
                    success();
                }
            }
            $scope.uploadSupportingFile = function (isvalid) {
                if (isvalid) {
                    //angular.element("input[type='file']").val(null);
                   // $scope.replaceSupportingFile = $scope.replaceSupportingFile.filter(Boolean);
                   // $scope.uploadFiles = $scope.uploadFiles.filter(Boolean);
                    //console.log($scope.uploadFiles);

                    $scope.replacePreviewFileUpload(0, function () {
                        $scope.addPreviewFileUpload(0, function () {
                            $scope.PreviewFiles.forEach(function (item, key) {
                                 $("#replaceSupportingFile" + key).val("");
                            });
                        });
                    });
                }
            }
            $scope.addReplacePreviewFileUpload = function (files, templateId, ct_param_value, file_order, file_type,indexno) {
                if (files) {
                    var val = files;
                    var otherimages = _.where(files, {type: 'otherimage'});
                    var otheraudio = _.where(files, {type: 'otheraudio'});
                    var othervideos = _.where(files, {type: 'othervideo'});
                    var othertext = _.where(files, {type: 'othertext'});
                    if (isImage(val.name) && file_type == 'otherimage') {

                        //var count = _.where($scope.uploadFiles, {type: 'image'});
                        var match = _.find($scope.OtherTemplates, function (item) {
                            return item.ct_param_value == 'otherimage'
                        });
                        if (match) {
                            var img_height = '';
                            var img_width = '';

                            if (_.isMatch($scope.PreviewFiles[file_order], {filename: val.name, file_category_id: $scope.Preview, type: 'otherimage'})) {
                                $scope.replaceSupportingFile[file_order] = {count: (file_order + 1), file: val, type: 'image', ct_group_id: templateId, ct_param_value: ct_param_value, width: img_width, height: img_height, other: 'common'};
                                $scope.tempFiles[file_order] = {action:'replace',fileName: val.name,index:file_order};
                            } else if (_.isMatch($scope.PreviewFiles[file_order], {filename: 'no_image.gif', file_category_id: $scope.Preview,type: 'otherimage'})) {
                                $scope.uploadFiles[file_order] = {count: (file_order + 1), file: val, type: 'image', ct_group_id: templateId, ct_param_value: ct_param_value, width: img_width, height: img_height, other: 'common'};
                                $scope.tempFiles[file_order] = {action:'add',fileName: val.name,index:file_order};
                            } else {
                                toastr.error('To replace a file, name & extension should be same');
                            }
                        }
                    } else if (getExtension(val.name).toLowerCase() == "mp3" && file_type == 'otheraudio') {

                        var count = _.where($scope.uploadFiles, {type: 'audio'});
                        var match = _.find($scope.OtherTemplates, function (item) {
                            return item.ct_param_value == 'bitrate'
                        });

                        if (match) {
                            if (_.isMatch($scope.PreviewFiles[file_order], {filename: val.name,file_category_id: $scope.Preview, type: 'otheraudio'})) {
                                $scope.replaceSupportingFile[file_order] = {count: (otheraudio.length + count.length + 1), file: val, type: 'audio', ct_group_id: templateId, ct_param_value: ct_param_value, width: null, height: null, other: 'common'};
                                $scope.tempFiles[file_order] = {action:'replace',fileName: val.name,index:file_order};
                            } else if (_.isMatch($scope.PreviewFiles[file_order], {filename: 'no_image.gif',file_category_id: $scope.Preview, type: 'otheraudio'})) {
                                $scope.uploadFiles[file_order] = {count: (otheraudio.length + count.length + 1), file: val, type: 'audio', ct_group_id: templateId, ct_param_value: ct_param_value, width: null, height: null, other: 'common'};
                                $scope.tempFiles[file_order] = {action:'add',fileName: val.name,index:file_order};
                            } else {
                                toastr.error('To replace a file, name & extension should be same');
                            }
                        }
                    } else if (isVideo(val.name) && file_type == 'othervideo') {
                        var count = _.where($scope.uploadFiles, {type: 'video'});
                        var match = _.find($scope.OtherTemplates, function (item) {
                            return item.ct_param_value == 'othervideo'
                        });

                        if (match) {
                            console.log($scope.Preview);
                            console.log($scope.PreviewFiles[file_order]);
                            if (_.isMatch($scope.PreviewFiles[file_order], {filename: val.name, file_category_id: $scope.Preview, type: 'othervideo'})) {
                                console.log('if')
                                $scope.replaceSupportingFile[file_order] = {count: (othervideos.length + count.length + 1), file: val, type: 'video', ct_group_id: templateId, ct_param_value: ct_param_value, width: null, height: null, other: 'common'};
                                $scope.tempFiles[file_order] = {action:'replace',fileName: val.name,index:file_order};
                            } else if (_.isMatch($scope.PreviewFiles[file_order], {filename: "no_image.gif", file_category_id: $scope.Preview,type: 'othervideo'})) {
                                console.log('else if')
                                $scope.uploadFiles[file_order] = {count: (othervideos.length + count.length + 1), file: val, type: 'video', ct_group_id: templateId, ct_param_value: ct_param_value, width: null, height: null, other: 'common'};
                                $scope.tempFiles[file_order] = {action:'add',fileName: val.name,index:file_order};
                            } else {
                                console.log('else')
                                toastr.error('To replace a file, name & extension should be same');
                            }
                        }
                    } else if (getExtension(val.name).toLowerCase() == "txt" && file_type == 'othertext') {
                        var count = _.where($scope.uploadFiles, {type: 'text'});
                        if (_.isMatch($scope.PreviewFiles[file_order], {filename: val.name, file_category_id: $scope.Preview,type: 'othertext'})) {
                            $scope.replaceSupportingFile[file_order] = {count: indexno, file: val, type: 'text', ct_group_id: templateId, ct_param_value: ct_param_value, width: null, height: null, other: 'common'};
                            $scope.tempFiles[file_order] = {action:'replace',fileName: val.name,index:file_order};
                        } else if (_.isMatch($scope.PreviewFiles[file_order], {filename: 'no_image.gif', file_category_id: $scope.Preview,type: 'othertext'})) {
                            $scope.uploadFiles[file_order] ={count: indexno, file: val, type: 'text', ct_group_id: templateId, ct_param_value: ct_param_value, width: null, height: null, other: 'common'};
                            $scope.tempFiles[file_order] = {action:'add',fileName: val.name,index:file_order};
                        } else {
                            toastr.error('To replace a file, name & extension should be same');
                        }
                    } else {
                        toastr.error('select proper file for upload');
                    }
                }
                else{
                    if($scope.tempFiles) {
                        if (_.where($scope.tempFiles, {action: 'replace',index:file_order}).length > 0) {
                            $scope.replaceSupportingFile[file_order] = null;
                            //  $scope.replaceSupportingFile.splice(file_order, 1)
                        } else {
                            $scope.uploadFiles[file_order] = null;
                            //$scope.uploadFiles.splice(file_order, 1)
                        }
                    }
                }
            }
        }
    };
});

myApp.directive('supportingFileListGrid', function () {
    return {
        scope: true,
        transclude: true,
        templateUrl: '../../partials/views/supporting-file-list.html',
        controller: function ($scope, $attrs, ngProgress, Upload, ContentFile, $window) {
            $scope.uploadFiles = [];
            $scope.replaceSupportingFile = [];
            $scope.tempFiles = [];

            function getExtension(filename) {
                var parts = filename.split('.');
                return parts[parts.length - 1];
            }
            function isImage(filename) {
                var ext = getExtension(filename);
                switch (ext.toLowerCase()) {
                    case 'jpg':
                    case 'jpeg':
                    case 'gif':
                    case 'bmp':
                    case 'png':
                        //etc
                        return true;
                }
                return false;
            }
            function isVideo(filename) {
                var ext = getExtension(filename);
                switch (ext.toLowerCase()) {
                    case 'm4v':
                    case 'avi':
                    case 'mpg':
                    case 'mp4':
                        // etc
                        return true;
                }
                return false;
            }

            $scope.replaceSupportingFileUpload = function (cnt, success) {
                if ($scope.replaceSupportingFile && $scope.replaceSupportingFile.length > 0) {
                    if($scope.replaceSupportingFile[cnt]){

                        var match = _.find($scope.SupportingFiles, function (val) {
                            return val.filename == $scope.replaceSupportingFile[cnt].file.name.toLowerCase()
                        });
                        console.log('match');
                        console.log(match);
                        if (match) {
                            ngProgress.start();
                            $scope.uploading = true;
                            ContentFile.Upload('/replaceFile', {
                                file: $scope.replaceSupportingFile[cnt].file,
                                filepath: match.cf_url,
                                cm_title: $scope.cm_title,
                                TypeName: match.Name,
                                cm_id: $scope.MetaId,
                                cf_id: match.cf_id
                            }, function (resp) {
                                //var filename = match.cf_url.split('/');
                                /*$scope.SupportingFiles[tcu].filename = filename[3];
                                $scope.SupportingFiles[tcu].cf_bitrate = resp.data.Files.cf_bitrate;
                                $scope.SupportingFiles[tcu].cf_url = resp.data.Files.cf_url;*/
                                //$scope.SupportingFiles[cnt] = resp.data.Files;
                                $scope.SupportingFiles[cnt].cf_bitrate = resp.data.Files.cf_bitrate;

                                $scope.getTime = new Date().getTime();
                                toastr.success(resp.config.data.file.name + ' File replaced successfully.');
                                cnt = cnt + 1;
                                if (!(cnt == $scope.replaceSupportingFile.length)) {
                                    $scope.replaceSupportingFileUpload(cnt, success);
                                } else {
                                    $scope.replaceSupportingFile = [];
                                    angular.element("input[type='file']").val(null);
                                    $scope.uploading = false;
                                    ngProgress.complete();
                                    success();
                                }
                            }, function (error) {
                                toastr.error(error);
                                $scope.uploading = false;
                                ngProgress.complete();
                                success();
                            });
                        } else {
                            toastr.error($scope.replaceSupportingFile[cnt].file.name + 'FileName does not match. ');
                            success();
                        }
                    } else {
                        cnt = cnt + 1;
                        if (!(cnt == $scope.replaceSupportingFile.length)) {
                            $scope.replaceSupportingFileUpload(cnt, success);
                        } else {
                            success();
                        }
                    }
                } else {
                    // toastr.error('FileName does not match or nothing to replace ');
                    success();
                }
            }
            $scope.addSupportingFileUpload = function (tcu, success) {
                if ($scope.uploadFiles && $scope.uploadFiles.length > 0) {
                    var data = $scope.uploadFiles[tcu];
                    if(data) {
                        ngProgress.start();
                        $scope.uploading = true;
                        ContentFile.Upload('/uploadotherfiles', {
                                fileCategory: $scope.Supporting,
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
                                ct_group_id: data.ct_group_id,
                                ct_param_value: data.ct_param_value
                            },
                            function (resp) {
                                var filename = resp.data.Files.cf_url.split('/');
                                $scope.SupportingFiles[tcu].filename = filename[3];
                                $scope.SupportingFiles[tcu].cf_bitrate = resp.data.Files.cf_bitrate;
                                $scope.SupportingFiles[tcu].cf_url = resp.data.Files.cf_url;

                              //  $scope.replaceSupportingFile[tcu].filename = filename[3];
                              //  $scope.replaceSupportingFile[tcu].cf_bitrate = resp.data.Files.cf_bitrate;
                              //  $scope.replaceSupportingFile[tcu].cf_url = resp.data.Files.cf_url;

                                if(data.ct_param_value == 'otherimage'){
                                    $scope.SupportingFiles[tcu].measure = 'pixels';
                                }else if( data.ct_param_value == 'bitrate'){
                                    $scope.SupportingFiles[tcu].measure = 'kbps';
                                }else{
                                    $scope.SupportingFiles[tcu].measure = 'kb';
                                }
                                toastr.success(resp.config.data.file.name + ' supporting file uploaded successfully.');
                                tcu = tcu + 1;
                                if (!(tcu == $scope.uploadFiles.length)) {
                                    $scope.addSupportingFileUpload(tcu, success);
                                } else {
                                    $scope.uploadFiles = [];
                                    angular.element("input[type='file']").val(null);
                                    $scope.uploading = false;
                                    ngProgress.complete();
                                    success();
                                }
                            },
                            function (error) {
                                toastr.error(error);
                                $scope.uploading = false;
                                ngProgress.complete();
                                success();
                            });
                    } else {
                        tcu = tcu + 1;
                        if (!(tcu == $scope.uploadFiles.length)) {
                            $scope.addSupportingFileUpload(tcu, success);
                        } else {
                            success();
                        }
                    }
                } else {
                    success();
                }
            }
            $scope.uploadSupportingFile = function (isvalid) {
                if (isvalid) {
                     //angular.element("input[type='file']").val(null);
                    //$scope.replaceSupportingFile = $scope.replaceSupportingFile.filter(Boolean);
                    //$scope.uploadFiles = $scope.uploadFiles.filter(Boolean);
                    $scope.replaceSupportingFileUpload(0, function () {
                        $scope.addSupportingFileUpload(0, function () {
                            $scope.SupportingFiles.forEach(function (item, key) {
                          //      console.log("replaceSupportingFile" + key);
                                $("#replaceSupportingFile" + key).val("");
                            });
                        });
                    });
                }
            }
            console.log('$scope.SupportingFiles')
            console.log($scope.SupportingFiles)
            $scope.addReplaceSupportingFileUpload = function (files, templateId, ct_param_value, file_order, file_type,indexno) {
                if (files) {
                    var val = files;

                    var otherimages = _.where(files, {type: 'otherimage'});
                    var otheraudio = _.where(files, {type: 'otheraudio'});
                    var othervideos = _.where(files, {type: 'othervideo'});
                    var othertext = _.where(files, {type: 'othertext'});
                    console.log('$scope.SupportingFiles')
                    console.log($scope.SupportingFiles)
                    if (isImage(val.name) && file_type == 'otherimage') {
                        var count = _.where($scope.uploadFiles, {type: 'image'});
                        var match = _.find($scope.OtherTemplates, function (item) {
                            return item.ct_param_value == 'otherimage'
                        });
                        if (match) {
                            var img_height = '';
                            var img_width = '';
                            if (_.isMatch($scope.SupportingFiles[file_order], {filename: val.name, file_category_id: $scope.Supporting, type: 'otherimage'})) {
                                    $scope.replaceSupportingFile[file_order] = {count: (file_order + 1), file: val, type: 'image', ct_group_id: templateId, ct_param_value: ct_param_value, width: img_width, height: img_height, other: 'common'};
                                    $scope.tempFiles[file_order] = {action:'replace',fileName: val.name,index:file_order};
                            } else if (_.isMatch($scope.SupportingFiles[file_order], {filename: 'no_image.gif', file_category_id: $scope.Supporting, type: 'otherimage'})) {
                                    $scope.uploadFiles[file_order] = {count: (file_order + 1), file: val, type: 'image', ct_group_id: templateId, ct_param_value: ct_param_value, width: img_width, height: img_height, other: 'common'};
                                    $scope.tempFiles[file_order] = {action:'add',fileName: val.name,index:file_order};
                            } else {
                                console.log('cant replace')
                                toastr.error('To replace a file, name & extension should be same');
                            }
                        }
                    }else if (getExtension(val.name).toLowerCase() == "mp3" && file_type == 'otheraudio') { //otheraudio
                        var count = _.where($scope.uploadFiles, {type: 'audio'});
                        var match = _.find($scope.OtherTemplates, function (item) {
                            return item.ct_param_value == 'bitrate'
                        });

                        if (match) {
                            if (_.isMatch($scope.SupportingFiles[file_order], {filename: val.name, file_category_id: $scope.Supporting, type: 'otheraudio'})) {
                                $scope.replaceSupportingFile[file_order] = {count: (otheraudio.length + count.length + 1), file: val, type: 'audio', ct_group_id: templateId, ct_param_value: ct_param_value, width: null, height: null, other: 'common'};
                                $scope.tempFiles[file_order] = {action:'replace',fileName: val.name,index:file_order};
                            } else if (_.isMatch($scope.SupportingFiles[file_order], {filename: 'no_image.gif', file_category_id: $scope.Supporting, type: 'otheraudio'})) {
                                    $scope.uploadFiles[file_order] = {count: (otheraudio.length + count.length + 1), file: val, type: 'audio', ct_group_id: templateId, ct_param_value: ct_param_value, width: null, height: null, other: 'common'};
                                    $scope.tempFiles[file_order] = {action:'add',fileName: val.name,index:file_order};
                            }else {
                                toastr.error('To replace a file, name & extension should be same');
                            }
                        }
                    }
                    else if (isVideo(val.name) && file_type == 'othervideo') {
                        var count = _.where($scope.uploadFiles, {type: 'video'});
                        var match = _.find($scope.OtherTemplates, function (item) {
                            return item.ct_param_value == 'othervideo'
                        });
                        if (match) {
                            if (_.isMatch($scope.SupportingFiles[file_order], {filename: val.name, file_category_id: $scope.Supporting, type: 'othervideo'})) {
                                console.log('if video')
                                $scope.replaceSupportingFile[file_order] = {count: (othervideos.length + count.length + 1), file: val, type: 'video', ct_group_id: templateId, ct_param_value: ct_param_value, width: null, height: null, other: 'common'};
                                $scope.tempFiles[file_order] = {action:'replace',fileName: val.name,index:file_order};
                            } else if (_.isMatch($scope.SupportingFiles[file_order], {filename: "no_image.gif",file_category_id: $scope.Supporting, type: 'othervideo'})) {
                                console.log('else if video')
                                $scope.uploadFiles[file_order] = {count: (othervideos.length + count.length + 1), file: val, type: 'video', ct_group_id: templateId, ct_param_value: ct_param_value, width: null, height: null, other: 'common'};
                                $scope.tempFiles[file_order] = {action:'add',fileName: val.name,index:file_order};
                            } else {
                                console.log('else')
                                toastr.error('To replace a file, name & extension should be same');
                            }
                        }
                    } 
                    else if (getExtension(val.name).toLowerCase() == "txt" && file_type == 'othertext') {
                        var count = _.where($scope.uploadFiles[file_order], {type: 'text'});
                        if (_.isMatch($scope.SupportingFiles[file_order], {filename: val.name, file_category_id: $scope.Supporting, type: 'othertext'})) {
                            $scope.replaceSupportingFile[file_order] = {count: indexno, file: val, type: 'text', ct_group_id: templateId, ct_param_value: ct_param_value, width: null, height: null, other: 'common'};
                             $scope.tempFiles[file_order] = {action:'replace',fileName: val.name,index:file_order};
                        } else {
                            if (_.isMatch($scope.SupportingFiles[file_order], {filename: "no_image.gif", file_category_id: $scope.Supporting, type: 'othertext'})) {
                                $scope.uploadFiles[file_order] ={count: indexno, file: val, type: 'text', ct_group_id: templateId, ct_param_value: ct_param_value, width: null, height: null, other: 'common'};
                                $scope.tempFiles[file_order] = {action:'add',fileName: val.name,index:file_order};
                            } else {
                                toastr.error('To replace a file, name & extension should be same');
                            }
                        }
                    } else {
                        toastr.error('select proper file for upload');
                    }
                    console.log('$scope.uploadFiles if')
                    console.log($scope.uploadFiles)
                    console.log('$scope.replaceSupportingFile if')
                    console.log($scope.replaceSupportingFile)
                }
                else{
                    console.log('$scope.uploadFiles else')
                    console.log($scope.uploadFiles)
                    console.log('$scope.replaceSupportingFile else')
                    console.log($scope.replaceSupportingFile)

                    if($scope.tempFiles) {
                        if (_.where($scope.tempFiles, {action: 'replace',index:file_order}).length > 0) {
                            $scope.replaceSupportingFile[file_order] = null;
                          //  $scope.replaceSupportingFile.splice(file_order, 1)
                        } else {
                            $scope.uploadFiles[file_order] = null;
                            //$scope.uploadFiles.splice(file_order, 1)
                        }
                    }
                }
            }
        }
    };
});

myApp.directive('dynamicModel', ['$compile', '$parse', function ($compile, $parse) {
        return {
            restrict: 'A',
            terminal: true,
            priority: 100000,
            link: function (scope, elem) {
                var name = $parse(elem.attr('dynamic-model'))(scope);
                elem.removeAttr('dynamic-model');
                elem.attr('data-ng-model', "replaceSupportingFile" + name);
                elem.attr('id', "replaceSupportingFile" + name);
                $compile(elem)(scope);
            }
        };
    }]);