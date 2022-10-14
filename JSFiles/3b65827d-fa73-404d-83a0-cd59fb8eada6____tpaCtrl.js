app.controller('TpaCtrl',
    function ($scope, $rootScope, $http, FileUploader, $rootScope, $location, SweetAlert, $modal, $localStorage, $filter, $translate) {

        $scope.saveOrUpdateBtnIconClass = "";
        $scope.saveOrUpdateBtnDisabled = false;
        $scope.labelSave = 'pages.tpaManagement.save';
        $scope.tpa = {
            Id: "",
            Name: "",
            TelNumber: "",
            Address: "",
            tpaCode: "",
            Banner: "",
            Banner2: "",
            Banner3: "",
            Banner4: "",
            Banner5: "",
            Logo: "",
            DiscountDescription: "",

        }

        $scope.publicLink = "";
        $scope.StaffSigninLink = "";

        $scope.resetTpa = function () {
            $scope.tpa = {
                Id: "",
                Name: "",
                TelNumber: "",
                Address: "",
                tpaCode: "",
                Banner: "",
                Banner2: "",
                Banner3: "",
                Banner4: "",
                Banner5: "",
                Logo: "",
                DiscountDescription: "",
            }

            $scope.publicLink = "";
            $scope.StaffSigninLink = "";
            $('input[type=file]').val('');//no angular implementation
        }
        $scope.loadExistingTPAs = function () {
            $http({
                method: 'GET',
                url: '/TAS.Web/api/TPA/GetAllTPAs',
                headers: { 'Authorization': $localStorage.jwt }
            }).success(function (data, status, headers, config) {
                $scope.tpas = data;

                $scope.tpa.Id = $scope.tpas[0].Id;

                $scope.SetTpa();
            }).error(function (data, status, headers, config) {
            });

        };


        $scope.SetTpa = function () {
            if ($scope.tpa.Id != "" && typeof ($scope.tpa.Id) !== "undefined" && $scope.tpa.Id != null) {
                $http({
                    method: 'POST',
                    url:'/TAS.Web/api/TPA/GetTPADetailsById',
                    data: { "tpaId": $scope.tpa.Id },
                    headers: { 'Authorization': $localStorage.jwt },
                    async:false,
                }).success(function (data, status, headers, config) {
                    $scope.tpa = data[0];
                    $scope.tpa.bannerByte = "";
                    $scope.tpa.bannerByte2 = "";
                    $scope.tpa.bannerByte3 = "";
                    $scope.tpa.bannerByte4 = "";
                    $scope.tpa.bannerByte5 = "";
                    $scope.tpa.logoByte = "";
                    $scope.showBanner();
                    $scope.showBanner2();
                    $scope.showBanner3();
                    $scope.showBanner4();
                    $scope.showBanner5();
                    $scope.showLogo();
                    $scope.publicLink = "https://www.leftfield.xyz/TAS.Web/STANDARD/index.html#/home/products/" + $scope.tpa.Name;
                    $scope.StaffSigninLink = "https://www.leftfield.xyz/TAS.Web/STANDARD/index.html#/login/signin/" + $scope.tpa.Name;
                    $scope.labelSave = 'pages.tpaManagement.update';
                }).error(function (data, status, headers, config) {
                });
            } else {
                $scope.resetTpa();
                $scope.publicLink = "";
            }
        }
        $scope.saveOrUpdateTpa = function () {
            if ($scope.tpa.Name != "") {
                if (uploader1.queue.length > 0) {
                    uploader1.queue[0].upload();

                } else if (uploader2.queue.length > 0) {
                    uploader2.queue[0].upload();
                    //alert('Selected file has been uploaded successfully.');
                } else if (uploader3.queue.length > 0) {
                    uploader3.queue[0].upload();
                    //alert('Selected file has been uploaded successfully.');
                } else if (uploader4.queue.length > 0) {
                    uploader4.queue[0].upload();
                    //alert('Selected file has been uploaded successfully.');
                } else if (uploader5.queue.length > 0) {
                    uploader5.queue[0].upload();
                    //alert('Selected file has been uploaded successfully.');
                } else if (uploaderLogo.queue.length > 0) {
                    uploaderLogo.queue[0].upload();
                } else {
                    //if ($scope.tpa.Id != "") {              //Commented by Chathura disable saving (else part)
                    $scope.saveOrUpdateBtnIconClass = "fa fa-spinner fa-spin";
                    $scope.saveOrUpdateBtnDisabled = true;
                        $http({
                            method: 'POST',
                            url: '/TAS.Web/api/TPA/UpdateTPA',
                            headers: { 'Authorization': $localStorage.jwt },
                            data: $scope.tpa
                        }).success(function (data, status, headers, config) {
                            $scope.resetTpa();
                            $scope.loadExistingTPAs();
                            $scope.saveOrUpdateBtnIconClass = "";
                            $scope.saveOrUpdateBtnDisabled = false;
                            SweetAlert.swal({
                                title: $filter('translate')('pages.tpaManagement.TASInformation'),
                                text: $filter('translate')('pages.tpaManagement.SuccessfullyUpdated'),
                                confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                                confirmButtonColor: "#007AFF"
                            });
                        }).error(function (data, status, headers, config) {
                            $scope.saveOrUpdateBtnIconClass = "";
                            $scope.saveOrUpdateBtnDisabled = false;
                        });
                    //}
                    //else {
                    //    $http({
                    //        method: 'POST',
                    //        url: '/TAS.Web/api/TPA/SaveTPA',
                    //        data: $scope.tpa
                    //    }).success(function (data, status, headers, config) {
                    //        $scope.resetTpa();
                    //        $scope.loadExistingTPAs();
                    //        SweetAlert.swal({
                    //            title: "TAS Information",
                    //            text: "Successfully Saved",
                    //            confirmButtonColor: "#007AFF"
                    //        });
                    //    }).error(function (data, status, headers, config) {

                    //    });
                    //}
                }

            } else {
                SweetAlert.swal({
                    title: $filter('translate')('pages.tpaManagement.TASInformation'),
                    text: $filter('translate')('pages.tpaManagement.PleaseEnterRequiredDetails'),
                    type: "warning",
                    confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                    confirmButtonColor: "rgb(221, 107, 85)"
                });

            }
        }
        $scope.showBanner = function () {
            if ($scope.tpa.Banner != "00000000-0000-0000-0000-000000000000") {
                $http({
                    method: 'POST',
                    url: '/TAS.Web/api/Image/GetImageById',
                    headers: { 'Authorization': $localStorage.jwt },
                    data: { 'ImageId': $scope.tpa.Banner },
                }).success(function (data, status, headers, config) {
                    $scope.tpa.bannerByte = data;
                }).error(function (data, status, headers, config) {
                });
            }

        }

        $scope.showBanner2 = function () {
            if ($scope.tpa.Banner2 != "00000000-0000-0000-0000-000000000000") {
                $http({
                    method: 'POST',
                    url: '/TAS.Web/api/Image/GetImageById',
                    headers: { 'Authorization': $localStorage.jwt },
                    data: { 'ImageId': $scope.tpa.Banner2 },
                }).success(function (data, status, headers, config) {
                    $scope.tpa.bannerByte2 = data;
                }).error(function (data, status, headers, config) {
                });
            }

        }

        $scope.showBanner3 = function () {
            if ($scope.tpa.Banner3 != "00000000-0000-0000-0000-000000000000") {
                $http({
                    method: 'POST',
                    url: '/TAS.Web/api/Image/GetImageById',
                    headers: { 'Authorization': $localStorage.jwt },
                    data: { 'ImageId': $scope.tpa.Banner3 },
                }).success(function (data, status, headers, config) {
                    $scope.tpa.bannerByte3 = data;
                }).error(function (data, status, headers, config) {
                });
            }

        }

        $scope.showBanner4 = function () {
            if ($scope.tpa.Banner4 != "00000000-0000-0000-0000-000000000000") {
                $http({
                    method: 'POST',
                    url: '/TAS.Web/api/Image/GetImageById',
                    headers: { 'Authorization': $localStorage.jwt },
                    data: { 'ImageId': $scope.tpa.Banner4 },
                }).success(function (data, status, headers, config) {
                    $scope.tpa.bannerByte4 = data;
                }).error(function (data, status, headers, config) {
                });
            }

        }

        $scope.showBanner5 = function () {
            if ($scope.tpa.Banner5 != "00000000-0000-0000-0000-000000000000") {
                $http({
                    method: 'POST',
                    url: '/TAS.Web/api/Image/GetImageById',
                    headers: { 'Authorization': $localStorage.jwt },
                    data: { 'ImageId': $scope.tpa.Banner5 },
                }).success(function (data, status, headers, config) {
                    $scope.tpa.bannerByte5 = data;
                }).error(function (data, status, headers, config) {
                });
            }

        }

        $scope.showLogo = function () {
            if ($scope.tpa.Logo != "00000000-0000-0000-0000-000000000000") {
                $http({
                    method: 'POST',
                    url: '/TAS.Web/api/Image/GetImageById',
                    headers: { 'Authorization': $localStorage.jwt },
                    data: { 'ImageId': $scope.tpa.Logo },
                }).success(function (data, status, headers, config) {
                    $scope.tpa.logoByte = data;
                }).error(function (data, status, headers, config) {
                });
            }
        }
        $scope.isShowing = function (value) {

            if (value== '00000000-0000-0000-0000-000000000000' || value=='' || value==null)
                return false;
            else
                return true;

        };


        // upload buttons for localizations

        $scope.selectFile = function (elementId) {
            document.getElementById(elementId).click();
        };


        // end upload buttons for localizations




        var uploader1 = $scope.uploader1 = new FileUploader({
            url: '/TAS.Web/api/Image/UploadImage',
            headers: { 'Authorization': $localStorage.jwt }
        });
        var uploader2 = $scope.uploader2 = new FileUploader({
            url: '/TAS.Web/api/Image/UploadImage',
            headers: { 'Authorization': $localStorage.jwt }
        });
        var uploader3 = $scope.uploader3 = new FileUploader({
            url: '/TAS.Web/api/Image/UploadImage',
            headers: { 'Authorization': $localStorage.jwt }
        });
        var uploader4 = $scope.uploader4 = new FileUploader({
            url: '/TAS.Web/api/Image/UploadImage',
            headers: { 'Authorization': $localStorage.jwt }
        });
        var uploader5 = $scope.uploader5 = new FileUploader({
            url: '/TAS.Web/api/Image/UploadImage',
            headers: { 'Authorization': $localStorage.jwt }
        });
        var uploaderLogo = $scope.uploaderLogo = new FileUploader({
            url: '/TAS.Web/api/Image/UploadImage',
            headers: { 'Authorization': $localStorage.jwt }
        });

        uploader1.filters.push({
            name: 'extensionFilter',
            fn: function (item, options) {
                var filename = item.name;
                var extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
                if (extension == "png" || extension == "jpg" || extension == "bmp" || extension == "gif")
                    return true;
                else {
                    alert('Invalid file format. Please select a file with jpg/png/bmp or gif format  and try again.');
                    return false;
                }
            }
        });

        uploader1.filters.push({
            name: 'sizeFilter',
            fn: function (item, options) {
                var fileSize = item.size;
                fileSize = parseInt(fileSize) / (1024 * 1024);
                if (fileSize <= 5)
                    return true;
                else {
                    alert('Selected file exceeds the 5MB file size limit. Please choose a new file and try again.');
                    return false;
                }
            }
        });

        uploader1.filters.push({
            name: 'itemResetFilter',
            fn: function (item, options) {
                if (this.queue.length < 5)
                    return true;
                else {
                    alert('You have exceeded the limit of uploading files.');
                    return false;
                }
            }
        });

        // CALLBACKS
        $scope.selectedFile1 = "No File Chosen";
        uploader1.onWhenAddingFileFailed = function (item, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader1.onAfterAddingFile = function (fileItem) {
            // alert('Files ready for upload.');
            console.log(fileItem);

        };

        uploader1.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.uploader1.queue = [];
            $scope.uploader1.progress = 0;
            $scope.tpa.Banner = response.replace(/\"/g, "");
             if (uploader2.queue.length > 0) {
                uploader2.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else if (uploader3.queue.length > 0) {
                uploader3.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else if (uploader4.queue.length > 0) {
                uploader4.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else if (uploader5.queue.length > 0) {
                uploader5.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else if (uploaderLogo.queue.length > 0) {
                uploaderLogo.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else {
                if ($scope.tpa.Id != "") {
                    $http({
                        method: 'POST',
                        url: '/TAS.Web/api/TPA/UpdateTPA',
                        headers: { 'Authorization': $localStorage.jwt },
                        data: $scope.tpa
                    }).success(function (data, status, headers, config) {
                        $scope.resetTpa();
                        $scope.loadExistingTPAs();
                        SweetAlert.swal({
                            title: $filter('translate')('pages.tpaManagement.TASInformation'),
                            text: $filter('translate')('pages.tpaManagement.SuccessfullyUpdated'),
                            confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                            confirmButtonColor: "#007AFF"
                        });
                    }).error(function (data, status, headers, config) {

                    });
                } else {
                    $http({
                        method: 'POST',
                        url: '/TAS.Web/api/TPA/SaveTPA',
                        headers: { 'Authorization': $localStorage.jwt },
                        data: $scope.tpa
                    }).success(function (data, status, headers, config) {
                        $scope.resetTpa();
                        $scope.loadExistingTPAs();
                        SweetAlert.swal({
                            title: $filter('translate')('pages.tpaManagement.TASInformation'),
                            text: $filter('translate')('pages.tpaManagement.SuccessfullySaved'),
                            confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                            confirmButtonColor: "#007AFF"
                        });
                    }).error(function (data, status, headers, config) {

                    });
                }
            }

        };
        uploader1.onErrorItem = function (fileItem, response, status, headers) {
            alert('We were unable to upload your file. Please try again.');
        };
        uploader1.onCancelItem = function (fileItem, response, status, headers) {
            // alert('File uploading has been cancelled.');
        };

        uploader1.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader1.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader1.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader1.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };

        uploader1.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader1.onCompleteAll = function () {
            console.info('onCompleteAll');
        };


        //////////////////////////////////////  uploader 2 /////////////////////////////////

        uploader2.filters.push({
            name: 'extensionFilter',
            fn: function (item, options) {
                var filename = item.name;
                var extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
                if (extension == "png" || extension == "jpg" || extension == "bmp" || extension == "gif")
                    return true;
                else {
                    alert('Invalid file format. Please select a file with jpg/png/bmp or gif format  and try again.');
                    return false;
                }
            }
        });

        uploader2.filters.push({
            name: 'sizeFilter',
            fn: function (item, options) {
                var fileSize = item.size;
                fileSize = parseInt(fileSize) / (1024 * 1024);
                if (fileSize <= 5)
                    return true;
                else {
                    alert('Selected file exceeds the 5MB file size limit. Please choose a new file and try again.');
                    return false;
                }
            }
        });

        uploader2.filters.push({
            name: 'itemResetFilter',
            fn: function (item, options) {
                if (this.queue.length < 5)
                    return true;
                else {
                    alert('You have exceeded the limit of uploading files.');
                    return false;
                }
            }
        });

        // CALLBACKS

        uploader2.onWhenAddingFileFailed = function (item, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader2.onAfterAddingFile = function (fileItem) {
            // alert('Files ready for upload.');
        };
        uploader2.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.uploader2.queue = [];
            $scope.uploader2.progress = 0;
            $scope.tpa.Banner2 = response.replace(/\"/g, "");
            if (uploader3.queue.length > 0) {
                uploader3.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else if (uploader4.queue.length > 0) {
                uploader4.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else if (uploader5.queue.length > 0) {
                uploader5.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else if (uploaderLogo.queue.length > 0) {
                uploaderLogo.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            }   else {
                if ($scope.tpa.Id != "") {
                    $http({
                        method: 'POST',
                        url: '/TAS.Web/api/TPA/UpdateTPA',
                        headers: { 'Authorization': $localStorage.jwt },
                        data: $scope.tpa
                    }).success(function (data, status, headers, config) {
                        $scope.resetTpa();
                        $scope.loadExistingTPAs();
                        SweetAlert.swal({
                            title: $filter('translate')('pages.tpaManagement.TASInformation'),
                            text: $filter('translate')('pages.tpaManagement.SuccessfullySaved'),
                            confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                            confirmButtonColor: "#007AFF"
                        });
                    }).error(function (data, status, headers, config) {

                    });
                } else {
                    $http({
                        method: 'POST',
                        url: '/TAS.Web/api/TPA/SaveTPA',
                        headers: { 'Authorization': $localStorage.jwt },
                        data: $scope.tpa
                    }).success(function (data, status, headers, config) {
                        $scope.resetTpa();
                        $scope.loadExistingTPAs();
                        SweetAlert.swal({
                            title: $filter('translate')('pages.tpaManagement.TASInformation'),
                            text: $filter('translate')('pages.tpaManagement.SuccessfullyUpdated'),
                            confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                            confirmButtonColor: "#007AFF"
                        });
                    }).error(function (data, status, headers, config) {

                    });
                }
            }

        };
        uploader2.onErrorItem = function (fileItem, response, status, headers) {
            alert('We were unable to upload your file. Please try again.');
        };
        uploader2.onCancelItem = function (fileItem, response, status, headers) {
            // alert('File uploading has been cancelled.');
        };
        uploader2.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader2.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader2.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader2.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader2.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader2.onCompleteAll = function () {
            console.info('onCompleteAll');
        };


        //////////////////////////////////// uploader 2 end ////////////////////////

        //////////////////////////////////////  uploader3 /////////////////////////////////

        uploader3.filters.push({
            name: 'extensionFilter',
            fn: function (item, options) {
                var filename = item.name;
                var extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
                if (extension == "png" || extension == "jpg" || extension == "bmp" || extension == "gif")
                    return true;
                else {
                    alert('Invalid file format. Please select a file with jpg/png/bmp or gif format  and try again.');
                    return false;
                }
            }
        });

        uploader3.filters.push({
            name: 'sizeFilter',
            fn: function (item, options) {
                var fileSize = item.size;
                fileSize = parseInt(fileSize) / (1024 * 1024);
                if (fileSize <= 5)
                    return true;
                else {
                    alert('Selected file exceeds the 5MB file size limit. Please choose a new file and try again.');
                    return false;
                }
            }
        });

        uploader3.filters.push({
            name: 'itemResetFilter',
            fn: function (item, options) {
                if (this.queue.length < 5)
                    return true;
                else {
                    alert('You have exceeded the limit of uploading files.');
                    return false;
                }
            }
        });

        // CALLBACKS

        uploader3.onWhenAddingFileFailed = function (item, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader3.onAfterAddingFile = function (fileItem) {
            // alert('Files ready for upload.');
        };
        uploader3.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.uploader3.queue = [];
            $scope.uploader3.progress = 0;
            $scope.tpa.Banner3 = response.replace(/\"/g, "");
             if (uploader4.queue.length > 0) {
                uploader4.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else if (uploader5.queue.length > 0) {
                uploader5.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else if (uploaderLogo.queue.length > 0) {
                uploaderLogo.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else {
                if ($scope.tpa.Id != "") {
                    $http({
                        method: 'POST',
                        url: '/TAS.Web/api/TPA/UpdateTPA',
                        headers: { 'Authorization': $localStorage.jwt },
                        data: $scope.tpa
                    }).success(function (data, status, headers, config) {
                        $scope.resetTpa();
                        $scope.loadExistingTPAs();
                        SweetAlert.swal({
                            title: $filter('translate')('pages.tpaManagement.TASInformation'),
                            text: $filter('translate')('pages.tpaManagement.SuccessfullySaved'),
                            confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                            confirmButtonColor: "#007AFF"
                        });
                    }).error(function (data, status, headers, config) {

                    });
                } else {
                    $http({
                        method: 'POST',
                        url: '/TAS.Web/api/TPA/SaveTPA',
                        headers: { 'Authorization': $localStorage.jwt },
                        data: $scope.tpa
                    }).success(function (data, status, headers, config) {
                        $scope.resetTpa();
                        $scope.loadExistingTPAs();
                        SweetAlert.swal({
                            title: $filter('translate')('pages.tpaManagement.TASInformation'),
                            text: $filter('translate')('pages.tpaManagement.SuccessfullyUpdated'),
                            confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                            confirmButtonColor: "#007AFF"
                        });
                    }).error(function (data, status, headers, config) {

                    });
                }
            }

        };
        uploader3.onErrorItem = function (fileItem, response, status, headers) {
            alert('We were unable to upload your file. Please try again.');
        };
        uploader3.onCancelItem = function (fileItem, response, status, headers) {
            // alert('File uploading has been cancelled.');
        };
        uploader3.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader3.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader3.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader3.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader3.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader3.onCompleteAll = function () {
            console.info('onCompleteAll');
        };


        //////////////////////////////////// uploader 2 end ////////////////////////

        //////////////////////////////////////  uploader4 /////////////////////////////////

        uploader4.filters.push({
            name: 'extensionFilter',
            fn: function (item, options) {
                var filename = item.name;
                var extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
                if (extension == "png" || extension == "jpg" || extension == "bmp" || extension == "gif")
                    return true;
                else {
                    alert('Invalid file format. Please select a file with jpg/png/bmp or gif format  and try again.');
                    return false;
                }
            }
        });

        uploader4.filters.push({
            name: 'sizeFilter',
            fn: function (item, options) {
                var fileSize = item.size;
                fileSize = parseInt(fileSize) / (1024 * 1024);
                if (fileSize <= 5)
                    return true;
                else {
                    alert('Selected file exceeds the 5MB file size limit. Please choose a new file and try again.');
                    return false;
                }
            }
        });

        uploader4.filters.push({
            name: 'itemResetFilter',
            fn: function (item, options) {
                if (this.queue.length < 5)
                    return true;
                else {
                    alert('You have exceeded the limit of uploading files.');
                    return false;
                }
            }
        });

        // CALLBACKS

        uploader4.onWhenAddingFileFailed = function (item, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader4.onAfterAddingFile = function (fileItem) {
            // alert('Files ready for upload.');
        };
        uploader4.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.uploader4.queue = [];
            $scope.uploader4.progress = 0;
            $scope.tpa.Banner4 = response.replace(/\"/g, "");
            if (uploader5.queue.length > 0) {
                uploader5.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else if (uploaderLogo.queue.length > 0) {
                uploaderLogo.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else {
                if ($scope.tpa.Id != "") {
                    $http({
                        method: 'POST',
                        url: '/TAS.Web/api/TPA/UpdateTPA',
                        headers: { 'Authorization': $localStorage.jwt },
                        data: $scope.tpa
                    }).success(function (data, status, headers, config) {
                        $scope.resetTpa();
                        $scope.loadExistingTPAs();
                        SweetAlert.swal({
                            title: $filter('translate')('pages.tpaManagement.TASInformation'),
                            text: $filter('translate')('pages.tpaManagement.SuccessfullySaved'),
                            confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                            confirmButtonColor: "#007AFF"
                        });
                    }).error(function (data, status, headers, config) {

                    });
                } else {
                    $http({
                        method: 'POST',
                        url: '/TAS.Web/api/TPA/SaveTPA',
                        headers: { 'Authorization': $localStorage.jwt },
                        data: $scope.tpa
                    }).success(function (data, status, headers, config) {
                        $scope.resetTpa();
                        $scope.loadExistingTPAs();
                        SweetAlert.swal({
                            title: $filter('translate')('pages.tpaManagement.TASInformation'),
                            text: $filter('translate')('pages.tpaManagement.SuccessfullyUpdated'),
                            confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                            confirmButtonColor: "#007AFF"
                        });
                    }).error(function (data, status, headers, config) {

                    });
                }
            }

        };
        uploader4.onErrorItem = function (fileItem, response, status, headers) {
            alert('We were unable to upload your file. Please try again.');
        };
        uploader4.onCancelItem = function (fileItem, response, status, headers) {
            // alert('File uploading has been cancelled.');
        };
        uploader4.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader4.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader4.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader4.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader4.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader4.onCompleteAll = function () {
            console.info('onCompleteAll');
        };


        //////////////////////////////////// uploader4 end ////////////////////////

        //////////////////////////////////////  uploader5 /////////////////////////////////

        uploader5.filters.push({
            name: 'extensionFilter',
            fn: function (item, options) {
                var filename = item.name;
                var extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
                if (extension == "png" || extension == "jpg" || extension == "bmp" || extension == "gif")
                    return true;
                else {
                    alert('Invalid file format. Please select a file with jpg/png/bmp or gif format  and try again.');
                    return false;
                }
            }
        });

        uploader5.filters.push({
            name: 'sizeFilter',
            fn: function (item, options) {
                var fileSize = item.size;
                fileSize = parseInt(fileSize) / (1024 * 1024);
                if (fileSize <= 5)
                    return true;
                else {
                    alert('Selected file exceeds the 5MB file size limit. Please choose a new file and try again.');
                    return false;
                }
            }
        });

        uploader5.filters.push({
            name: 'itemResetFilter',
            fn: function (item, options) {
                if (this.queue.length < 5)
                    return true;
                else {
                    alert('You have exceeded the limit of uploading files.');
                    return false;
                }
            }
        });

        // CALLBACKS

        uploader5.onWhenAddingFileFailed = function (item, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader5.onAfterAddingFile = function (fileItem) {
            // alert('Files ready for upload.');
        };
        uploader5.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.uploader5.queue = [];
            $scope.uploader5.progress = 0;
            $scope.tpa.Banner5 = response.replace(/\"/g, "");
            if (uploaderLogo.queue.length > 0) {
                uploaderLogo.queue[0].upload();
                //alert('Selected file has been uploaded successfully.');
            } else {
                if ($scope.tpa.Id != "") {
                    $http({
                        method: 'POST',
                        url: '/TAS.Web/api/TPA/UpdateTPA',
                        headers: { 'Authorization': $localStorage.jwt },
                        data: $scope.tpa
                    }).success(function (data, status, headers, config) {
                        $scope.resetTpa();
                        $scope.loadExistingTPAs();
                        SweetAlert.swal({
                            title: $filter('translate')('pages.tpaManagement.TASInformation'),
                            text: $filter('translate')('pages.tpaManagement.SuccessfullySaved'),
                            confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                            confirmButtonColor: "#007AFF"
                        });
                    }).error(function (data, status, headers, config) {

                    });
                } else {
                    $http({
                        method: 'POST',
                        url: '/TAS.Web/api/TPA/SaveTPA',
                        headers: { 'Authorization': $localStorage.jwt },
                        data: $scope.tpa
                    }).success(function (data, status, headers, config) {
                        $scope.resetTpa();
                        $scope.loadExistingTPAs();
                        SweetAlert.swal({
                            title: $filter('translate')('pages.tpaManagement.TASInformation'),
                            text: $filter('translate')('pages.tpaManagement.SuccessfullyUpdated'),
                            confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                            confirmButtonColor: "#007AFF"
                        });
                    }).error(function (data, status, headers, config) {

                    });
                }
            }

        };
        uploader5.onErrorItem = function (fileItem, response, status, headers) {
            alert('We were unable to upload your file. Please try again.');
        };
        uploader5.onCancelItem = function (fileItem, response, status, headers) {
            // alert('File uploading has been cancelled.');
        };
        uploader5.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader5.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader5.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader5.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader5.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader5.onCompleteAll = function () {
            console.info('onCompleteAll');
        };





        //////////////////////////////////// uploader5 end ////////////////////////

        // console.info('uploader', uploader);
        uploaderLogo.filters.push({
            name: 'extensionFilter',
            fn: function (item, options) {
                var filename = item.name;
                var extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
                if (extension == "png" || extension == "jpg" || extension == "bmp" || extension == "gif")
                    return true;
                else {
                    alert('Invalid file format. Please select a file with jpg/png/bmp or gif format  and try again.');
                    return false;
                }
            }
        });

        uploaderLogo.filters.push({
            name: 'sizeFilter',
            fn: function (item, options) {
                var fileSize = item.size;
                fileSize = parseInt(fileSize) / (1024 * 1024);
                if (fileSize <= 5)
                    return true;
                else {
                    alert('Selected file exceeds the 5MB file size limit. Please choose a new file and try again.');
                    return false;
                }
            }
        });

        uploaderLogo.filters.push({
            name: 'itemResetFilter',
            fn: function (item, options) {
                if (this.queue.length < 5)
                    return true;
                else {
                    alert('You have exceeded the limit of uploading files.');
                    return false;
                }
            }
        });

        // CALLBACKS

        uploaderLogo.onWhenAddingFileFailed = function (item, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploaderLogo.onAfterAddingFile = function (fileItem) {
            // alert('Files ready for upload.');
            $scope.selectedFile1 = fileItem.file.name;
        };

        uploaderLogo.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.uploaderLogo.queue = [];
            $scope.uploaderLogo.progress = 0;
            //alert('Selected file has been uploaded successfully.');
            $scope.tpa.Logo = response.replace(/\"/g, "");
            if ($scope.tpa.Id != "") {
                $http({
                    method: 'POST',
                    url: '/TAS.Web/api/TPA/UpdateTPA',
                    headers: { 'Authorization': $localStorage.jwt },
                    data: $scope.tpa
                }).success(function (data, status, headers, config) {
                    $scope.resetTpa();
                    $scope.loadExistingTPAs();
                    SweetAlert.swal({
                        title: $filter('translate')('pages.tpaManagement.TASInformation'),
                        text: $filter('translate')('pages.tpaManagement.SuccessfullySaved'),
                        confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                        confirmButtonColor: "#007AFF"
                    });
                }).error(function (data, status, headers, config) {

                });
            } else {
                $http({
                    method: 'POST',
                    url: '/TAS.Web/api/TPA/SaveTPA',
                    headers: { 'Authorization': $localStorage.jwt },
                    data: $scope.tpa
                }).success(function (data, status, headers, config) {
                    $scope.resetTpa();
                    $scope.loadExistingTPAs();
                    SweetAlert.swal({
                        title: $filter('translate')('pages.tpaManagement.TASInformation'),
                        text: $filter('translate')('pages.tpaManagement.SuccessfullyUpdated'),
                        confirmButtonText: $filter('translate')('pages.taxManagement.ok'),
                        confirmButtonColor: "#007AFF"
                    });
                }).error(function (data, status, headers, config) {

                });
            }

        };
        uploaderLogo.onErrorItem = function (fileItem, response, status, headers) {
            alert('We were unable to upload your file. Please try again.');
        };
        uploaderLogo.onCancelItem = function (fileItem, response, status, headers) {
            // alert('File uploading has been cancelled.');
        };

        uploaderLogo.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploaderLogo.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploaderLogo.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploaderLogo.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };

        uploaderLogo.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploaderLogo.onCompleteAll = function () {
            console.info('onCompleteAll');
        };




    });