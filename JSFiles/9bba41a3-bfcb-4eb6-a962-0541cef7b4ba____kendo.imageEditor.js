(function ($) {
    // shorten references to variables. this is better for uglification
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget;

    var ImageEditor = Widget.extend({
        init: function (element, options) {
            // base call to initialize widget
            if ($(element).attr("disabled")) { 
                options.disabled = true;
                this._templates.kendoInputOptions.enabled = false;
            }
            Widget.fn.init.call(this, element, options);
            this._parseExtensions(options);
            this._create();
            this._setupEvents();
        },
        inputControls: null,
        options: {
            // the name is what it will appear as off the kendo namespace(i.e. kendo.ui.MyWidget).
            // The jQuery plugin would be jQuery.fn.kendoMyWidget.
            name: "ImageEditor",
            disabled: false, 
            showFileName: true,
            doNotConvertSpreadSheets:false,
            allowUpload: true,
            images: [],
            minHeight: null,
            maxHeight: null,
            minWidth: null,
            maxWidth: null,
            previewHeight: 150,
            previewWidth: 150,
            resizePreviewImage: true,
            previewLeftClass: "col-md-6",
            previewRightClass: "col-md-6",
            fixedAspectRatio: false,
            maxImageSize: 0,
            rotationDegrees: 0,
            acceptedExtensions: [".jpg", ".jpeg", ".png", ".eps", ".jpg", ".tiff", ".tif", ".gif", ".pdf"],
            editableExtensions: [".jpg", ".jpeg", ".png", ".jpg", ".tiff", ".tif", ".gif"],
            previewExtensions: [".jpg", ".jpeg", ".png", ".jpg", ".tiff", ".tif", ".gif", ".pdf", ".eps"],
            defaultThumbnails: [{ extension: "*.*", thumbnail: "/content/images/defaults/noselect.png" },
            { extension: ".jpg", thumbnail: "/content/images/defaults/Jpg.png" },
            { extension: ".bmp", thumbnail: "/content/images/defaults/uploaded.png" },
            { extension: ".gif", thumbnail: "/content/images/defaults/uploaded.png" },
            { extension: ".png", thumbnail: "/content/images/defaults/Png.png" },
            { extension: ".tiff", thumbnail: "/content/images/defaults/Tiff.png" },
            { extension: ".pdf", thumbnail: "/content/images/defaults/pdf.png" },
            { extension: ".avi", thumbnail: "/content/images/defaults/video.png" },
            { extension: ".wmv", thumbnail: "/content/images/defaults/video.png" },
            { extension: ".mpg", thumbnail: "/content/images/defaults/video.png" },
            { extension: ".mpeg", thumbnail: "/content/images/defaults/video.png" },
            { extension: ".mov", thumbnail: "/content/images/defaults/video.png" },
            { extension: ".rm", thumbnail: "/content/images/defaults/video.png" },
            { extension: ".ram", thumbnail: "/content/images/defaults/video.png" },
            { extension: ".swf", thumbnail: "/content/images/defaults/Swf.png" },
            { extension: ".flv", thumbnail: "/content/images/defaults/Flv.png" },
            { extension: ".mp4", thumbnail: "/content/images/defaults/video.png" },
            { extension: ".mid", thumbnail: "/content/images/defaults/video.png" },
            { extension: ".midi", thumbnail: "/content/images/defaults/audio.png" },
            { extension: ".mp3", thumbnail: "/content/images/defaults/audio.png" },
            { extension: ".wav", thumbnail: "/content/images/defaults/audio.png" },
            { extension: ".wma", thumbnail: "/content/images/defaults/audio.png" },
            { extension: ".doc", thumbnail: "/content/images/defaults/doc.png" },
            { extension: ".docx", thumbnail: "/content/images/defaults/doc.png" },
            { extension: ".xls", thumbnail: "/content/images/defaults/xls.png" },
            { extension: ".xlsx", thumbnail: "/content/images/defaults/xls.png" },
            { extension: ".ppt", thumbnail: "/content/images/defaults/ppt.png" },
            { extension: ".pptx", thumbnail: "/content/images/defaults/ppt.png" },
            { extension: ".csv", thumbnail: "/content/images/defaults/xls.png" },
            { extension: ".tif", thumbnail: "/content/images/defaults/tiff.png" },
            { extension: ".ai", thumbnail: "/content/images/defaults/ai.png" },
            { extension: ".eps", thumbnail: "/content/images/defaults/eps.png" },
            { extension: ".psd", thumbnail: "/content/images/defaults/psd.png" },
            { extension: ".zip", thumbnail: "/content/images/defaults/Zip.png" }],
            showFancyboxAfterEdit: false,
            fancyboxAfterEditHref: null,
            hiddenFieldName: null,
            hiddenFieldId: null,
            defaultValue: null,
            currentScale: 1,
            imageBankImages: [],
            previousImageValue: null,
            disabled: ""
        },
        edit: function (url, crop, close, isFixedAspectRatio, minHeight, minWidth) {
            var imageEditor = this;

            if (isFixedAspectRatio != null) {
                imageEditor.options.fixedAspectRatio = isFixedAspectRatio;
            }
            if (imageEditor.options.fixedAspectRatio == null) {
                imageEditor.options.fixedAspectRatio = false;
            }

            if (minHeight != null && minHeight > 0) {
                imageEditor.options.minHeight = minHeight;
            }

            if (minWidth != null && minWidth > 0) {
                imageEditor.options.minWidth = minWidth;
            }

            imageEditor.editImage(url, crop, close);
        },
        updateImageEditUrl: function (uid, url) {
            var that = this;
            $(that.options.images).each(function (e) {
                if (this.uid == uid) {
                    this.editedUrl = url;
                }
            });
        },
        generatePreviewQuerystring: function () {
            var that = this;
            if (that.options.resizePreviewImage) {
                return "w=" + that.options.previewWidth + "&h=" + that.options.previewHeight + "&format=png";
            } else {
                return "";
            }
        },
        value: function (value) {
            var that = this;
            if (value == null) {
                return (that.hiddenInput == null) ? "" : that.hiddenInput.val();
            } else {
                that.options.previousImageValue = that.hiddenInput.val();
                that.hiddenInput.val(value);
                if (that.getFileExtension(value) == ".eps") {
                    that.generatePreviewImage(value, function (previewPath) {
                        that.updateSelectedFile(value, previewPath, false);
                    });
                } else {
                    that.updateSelectedFile(value, null, false);
                }
            }
        },
        setImageBankImages: function (images, structId) {
            var that = this;
            if (images == null) {
                images = new Array();
            }
            that.options.imageBankImages = images;
            // build the image div now so the fancybox can size properly.
            var content = kendo.Template.compile(that._templates.imageBankTemplate)({ 
                data: that.options.imageBankImages, 
                structId: structId == undefined ? "" : structId, 
                cacheBuster: pageCacheBuster });
            //var content = kendo.Template.compile(that._templates.imageBankTemplate)(that.options.imageBankImages);
            var wrapper = $(that.element).find(".image-bank-wrapper");
            if (wrapper.length > 0) {
                wrapper.remove();
            }
            wrapper = $("<div />", {
                "class": "hidden image-bank-wrapper"
            });
            var modalWrapper = $("<div />", {
                "id": that.element.attr("id") + "_image_bank_wrapper"
            });
            modalWrapper.append(content);
            wrapper.append(modalWrapper);
            $(that.element).append(wrapper);
            wrapper = $(that.element).find(".image-bank-wrapper");
            var imageElements = wrapper.find("img.hand");
            $(imageElements).each(function (i, image) {
                image = $(image);
                image.click(function (e) {
                    var path = image[0].attributes['data-original'].value;
                    if (that.getFileExtension(path) == ".pdf" || that.getFileExtension(path) == ".eps") {
                        that.generatePreviewImage(path, function (previewPath) {
                            if (that.getFileExtension(path) == ".pdf") {
                                previewPath = previewPath[0].href;
                            }

                            //var initialImage = {
                            //    uid: kendo.guid(),
                            //    response: {
                            //        UploadFileUrl: path,
                            //        PreviewFileUrl: previewPath,
                            //        FileName: that.getFileName(path),
                            //        Extension: that.getFileExtension(path),
                            //        FileSize: 0,
                            //        IsMinHeight: true,
                            //        IsMinWidth: true
                            //    }
                            //};
                            //that.setInitialImage(initialImage);
                            that.updateSelectedFile(path, previewPath);
                            $.fancybox.close();
                            $("a[href='#divPersonalize']").click();
                        });
                    } else {
                        that.updateSelectedFile(image.attr("data-original"), image.attr("src"));
                        that.element.find(".k-upload-action-edit").click();
                    }


                    //that.updateSelectedFile(image.attr("data-original"), image.attr("src"));
                    //that.element.find(".k-upload-action-edit").click();
                });
            });
        },
        _templates: {
            kendoInputOptions: {
                async: {
                    saveUrl: "/Upload/Save",
                    removeUrl: "/Upload/Remove",
                    autoUpload: true
                },
                multiple: false,
                template: "<div class='file-wrapper'>" +
                "  <div class='floatl w50 h100 padu20'><img class='img-responsive' style='background-color:##f9f9f9;' /></div>  " +
                "  <div class='floatl w25 h100 padu20'><span class='text-center filename' /></div>  " +
                "  <div class='floatr w25 block padu20'>" +
                "     <a title='Remove' class='k-upload-action-remove btn btn-default'><i class='fa fa-remove hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>Remove</span></a>" +
                "     <a title='Edit Image' class='k-upload-action-edit btn btn-default'><i class='fa fa-pencil hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>Edit</span></a>" +
                "         <a title='Upload Image' class='k-upload-action-upload btn btn-default'><i class='fa fa-upload hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>Upload</span></a>" +
                "         <a title='Select New' class='k-upload-action-replace btn btn-default'><i class='fa fa-fa-hand-pointer-o hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>~{Select}~</span></a>" +
                "  </div>" +
                "</div>",
                success: function (e) {
                    if (e.operation == "upload") {
                        if (e.response.ReturnCode == ReturnCode.Success) {
                            var imageEditor = $(e.sender.element).closest("*[data-role=imageeditor]").getKendoImageEditor();
                            var data = e.response.Records;
                            imageEditor.options.images.push({ uid: e.files[0].uid, response: data });
                            if (data.Extension.toLowerCase() === ".eps") {
                                $(document).trigger(argosyEvents.START_LOADING);
                                imageEditor.generatePreviewImage(data.UploadFileUrl, function (filePaths) {
                                    if (filePaths != null && filePaths.length > 0) {
                                        $("#previewPagesDiv").show();
                                        imageEditor.setupPreviewUrls(filePaths);
                                    } else {
                                        $("#previewPagesDiv").hide();
                                    };
                                    $(document).trigger(argosyEvents.END_LOADING);
                                });
                            };
                            var target;
                            if (imageEditor.element[0] != undefined) {
                                target = imageEditor.element[0].id;
                            }
                            $(document).trigger(argosyEvents.KENDO_EDITOR_IMAGE_UPLOADED, { uid: e.files[0].uid, response: data, target: target, onSuccess: true });
                        } else {
                            prompt.notify({
                                question: e.response.Message + "| Ref: " + e.response.Guid,
                                type: "error"
                            });
                        }
                    }
                },
                complete: function (e) {
                    var imageEditor = $(e.sender.element).closest("*[data-role=imageeditor]").getKendoImageEditor();
                    var sender = $(e.sender.wrapper);
                    if (e.isDefaultImage == null) {
                        e.isDefaultImage = false;
                    }
                    if (imageEditor) {
                        if (imageEditor.options.images != null && imageEditor.options.images.length > 0) {
                            $(imageEditor.options.images).each(function(i) {
                                var data = this;
                                imageEditor.response = data.response;
                                var isEditable = $.inArray(imageEditor.response.Extension,
                                        imageEditor.options.editableExtensions) >
                                    -1;
                                var isPreviewable = $.inArray(imageEditor.response.Extension,
                                        imageEditor.options.previewExtensions) >
                                    -1;
                                var defaultImages = $.grep(imageEditor.options.defaultThumbnails,
                                    function(ext) {
                                        return ext.extension == imageEditor.response.Extension;
                                    });
                                var item;
                                if (e.isDefaultImage) {
                                    item = sender.find("li:first");
                                    this.uid = sender.find("li:first").attr("data-uid");
                                } else {
                                    item = sender.find("li[data-uid='" + data.uid + "']");
                                }
                                var image = item.find("img");
                                imageEditor.hiddenInput.val(imageEditor.response.UploadFileUrl);
                                if (isPreviewable) {
                                    image.attr("src", imageEditor.response.PreviewFileUrl + "?" + imageEditor.generatePreviewQuerystring());
                                    if (imageEditor.response.Extension == ".eps") {
                                        $(document).trigger(argosyEvents.KENDO_EDITOR_IMAGE_UPLOADED, {
                                            response: imageEditor.response,
                                            target: $(imageEditor.element).attr("id"),
                                            onSuccess: false
                                        });
                                    }


                                    //if (data.response.Extension == ".pdf" || data.response.Extension == ".eps") {
                                    //    $(image).bind("error", function (e) {
                                    //        var params = getUrlVars($(this).attr("src"));
                                    //        if (parseInt(params["q"]) < 100) {
                                    //            $(this).attr('src', imageEditor.response.PreviewFileUrl + "?q=" + (parseInt(params["q"]) + 1));
                                    //        } else if (params["q"] == undefined) {
                                    //            $(this).attr('src', imageEditor.response.PreviewFileUrl + "?q=1");
                                    //        }
                                    //    });
                                    //}
                                } else if (/*imageEditor.options.showFileName*/false) {
                                    var fileName = item.find("span.filename");
                                    fileName.text(imageEditor.response.FileName);
                                } else if (defaultImages.length > 0) {
                                    image.attr("src",
                                        defaultImages[0].thumbnail + "?" + imageEditor.generatePreviewQuerystring());
                                } else {
                                    image.attr("src",
                                        imageEditor.options.defaultThumbnails[0].thumbnail +
                                        "?" +
                                        imageEditor.generatePreviewQuerystring());
                                }
                                var edit = item.find(".k-upload-action-edit");
                                var replace = item.find(".k-upload-action-replace");
                                var remove = item.find(".k-upload-action-remove");
                                var upload = item.find(".k-upload-action-upload");
                                if (isEditable && !imageEditor.options.disabled) {
                                    edit.show();
                                } else {
                                    edit.hide();
                                }
                                if (imageEditor.options.allowUpload && !imageEditor.options.disabled) {
                                    upload.show();
                                } else {
                                    upload.hide();
                                }
                                if (imageEditor.value() === "" || (imageEditor.options.imageBankImages != null && imageEditor.options.imageBankImages.length > 0) || imageEditor.options.disabled) {
                                    remove.hide();
                                } else {
                                    remove.show();
                                }
                                if ((imageEditor.options.imageBankImages != null && imageEditor.options.imageBankImages.length > 0) && !imageEditor.options.disabled) {
                                    replace.show();
                                } else {
                                    replace.hide();
                                }

                                edit.unbind("click");
                                replace.unbind("click");
                                remove.unbind("click");
                                upload.unbind("click");
                                upload.bind("click",
                                    function(e) {
                                        var upload = imageEditor.getUpload();
                                        $(upload.element).click();
                                    });

                                edit.bind("click",
                                    function(e) {
                                        imageEditor.edit(imageEditor.response.UploadFileUrl,
                                            function(croppedImage) {
                                                imageEditor.croppedImage = croppedImage;
                                                image.attr("src",
                                                    croppedImage.UploadFileUrl +
                                                    "?" +
                                                    imageEditor.generatePreviewQuerystring());
                                                imageEditor.hiddenInput.val(window.location.origin +
                                                    imageEditor.croppedImage.UploadFileUrl);
                                                imageEditor.updateImageEditUrl(data.uid,
                                                    imageEditor.response.UploadFileUrl);
                                                if (imageEditor.options.showFancyboxAfterEdit &&
                                                    imageEditor.options.fancyboxAfterEditHref != null) {
                                                    $.fancybox({
                                                        href: "#" + imageEditor.options.fancyboxAfterEditHref
                                                    });
                                                } else {
                                                    $.fancybox.close();
                                                }
                                            },
                                            function() {
                                                if (imageEditor.options.showFancyboxAfterEdit &&
                                                    imageEditor.options.fancyboxAfterEditHref != null) {
                                                    $.fancybox({
                                                        href: "#" + imageEditor.options.fancyboxAfterEditHref
                                                    });
                                                } else {
                                                    $.fancybox.close();
                                                }
                                            });
                                    });
                                replace.bind("click",
                                    function(e) {
                                        if (imageEditor.options.imageBankImages.length > 0) {
                                            $.fancybox({
                                                href: "#" + imageEditor.element.attr("id") + "_image_bank_wrapper",
                                                modal: true
                                            });
                                        } else {
                                            imageEditor.options.images = [];
                                            sender.find(".k-dropzone").find("input[type=file]").click();
                                        }
                                    });
                                remove.bind("click",
                                    function(e) {
                                        sender.find(".k-dropzone").show();
                                        imageEditor.options.images = [];
                                        item.remove();
                                        imageEditor.hiddenInput.val("");
                                        $(document).trigger(argosyEvents.KENDO_EDITOR_IMAGE_REMOVED,
                                            ["", $(imageEditor.element).attr("id")]);
                                    });
                                if (!e.isDefaultImage && isEditable) {
                                    edit.click();
                                }
                            });
                            sender.find(".k-dropzone").hide();
                        } else {
                            sender.find(".k-upload-files").empty();
                            sender.find(".k-dropzone").show();
                            imageEditor.options.images = [];
                        }
                    }
                    setTimeout(function (e) {
                        $.fancybox.reposition();
                    }, 500);
                    sender.find(".k-upload-status").remove();
                },
                select: function (e) {
                    var imageEditor = $(e.sender.element).closest("*[data-role=imageeditor]").getKendoImageEditor();
                    var preventDefault = false;

                    $.each(e.files, function (index, value) {
                        var validExtension = false;
                        if (imageEditor.options.maxImageSize > 0 && imageEditor.options.maxImageSize < value.size) {
                            // show message about invalid image size.
                            prompt.error("Your file cannot be larger than " + formatBytes(imageEditor.options.maxImageSize, 1));
                            preventDefault = true;
                        }
                        $(imageEditor.options.acceptedExtensions).each(function (i) {
                            if (value.extension.toLowerCase() == this) {
                                validExtension = true;
                            }
                        });
                        if (!validExtension) {
                            // show message about invalid image extensions.
                            preventDefault = true;
                        }
                    });
                    if (preventDefault) {
                        e.preventDefault();
                    }
                }
            },
            kendoInputBaseTemplate: "<input type='file' name='files' /><input type='hidden' value='' data-is-upload='true' />",
            imageBankTemplate: "<div class='row'>" +
            "<h2>~{SelectImage}~</h2>" +
            "<div class='col-md-12'>" +
            "#" +
            "if (data == null || data.length < 1) return;" +
            "for (var i = 0; i < data.length; i++) {" +
            "#" +
            "<div id=\"divSelectDefault\" class=\"pad10\" style=\"display:inline-block;\"><div style=\"max-width:150px; max-height:150px;\">" +
            "<img  data-original='${data[i]}' id=\"${i}_imageBankUpload_${structId}\" onload=\"getPreviewImage('${data[i]}', '${i}_imageBankUpload_${structId}', '${cacheBuster}')\" src=\"/Content/images/generic.gif\" class=\"hover hand\"/>" +
            "</div></div >" +

            //"<div class='col-md-2'>" +
            //"<img src='${data[i]}?h=200&w=200' data-original='${data[i]}' class='hover hand' />" +
            //"</div>" +
            "#}#" +
            "</div>" +
            "</div>",
            jQueryImageCropperTemplate: "<div class='row' style='width: ${width}px; height: ${height}px;'>" +
            "   <div class='row'>" +
            "       <div class='col-md-5'>" +
            "           <h3 class='nobottommargin'>~{CropYourImage}~</h3>" +
            "           <p class='padb10 hidden-xs'>~{UseToolsToEditImage}~</p>" +
            "       </div>" +
            "       <div class='col-md-7'>" +
            "           <p class='text-danger' id='cropper-error-box'></p>" +
            "       </div>" +
            "   </div>" +
            "   <div class='row'>" +
            "       <div class='col-md-12' style='height: ${height-70}px'>" +
            "           <img id='cropper-image-source' class='img-responsive' src='${image}' />" +
            "       </div>" +
            "   </div>" +
            "       <div class='col_full padu20'>" +
            "       <div class='crp-btn col_three_fourth padl20'>" +
            "          <div class='floatl padr20'>" +
            "               <a type='button' class='btn btn-default mobile100'><i class='fa fa-upload'></i><span class='hidden-md hidden-sm hidden-xs hidden-xxs'> ~{UploadNewImage}~</span></a>" +
            "          </div>" +
            "          <div class='floatl padr10'>" +
            "               <a type='button' class='btn btn-default mobile100'><i class='fa fa-search-plus'></i><span class='hidden-md hidden-sm hidden-xs hidden-xxs'> ~{ZoomIn}~</span></a>" +
            "          </div>" +
            "          <div class='floatl padr10'>" +
            "               <a type='button' class='btn btn-default mobile100'><i class='fa fa-search-minus'></i><span class='hidden-md hidden-sm hidden-xs hidden-xxs'> ~{ZoomOut}~</span></a>" +
            "          </div>" +
            "          <div class='floatl padr10 hidden-xs'>" +
            "               <a type='button' class='btn btn-default mobile100'><i class='fa fa-rotate-left large'></i><span class='hidden-md hidden-sm hidden-xs hidden-xxs'> 15&deg;</span></a>" +
            "          </div>" +
            "          <div class='floatl padr10 hidden-xs'>" +
            "               <a type='button' class='btn btn-default mobile100'><i class='fa fa-rotate-left small'></i><span class='hidden-md hidden-sm hidden-xs hidden-xxs'> 1&deg;</span></a>" +
            "          </div>" +
            "          <div class='floatl padr10 hidden-xs'>" +
            "               <a type='button' class='btn btn-default mobile100'><i class='fa fa-rotate-right small'></i><span class='hidden-md hidden-sm hidden-xs hidden-xxs'> 1&deg;</span></a>" +
            "          </div>" +
            "          <div class='floatl padr10 hidden-xs'>" +
            "               <a type='button' class='btn btn-default mobile100'><i class='fa fa-rotate-right large'></i><span class='hidden-md hidden-sm hidden-xs hidden-xxs'> 15&deg;</span></a>" +
            "          </div>" +
            /*"          <div class='floatl padr10'>" +
            "               <input data-style='background-color' data-selector='.header-bottom, .mobiletitle, .mobile-nav ul' data-role='colorpicker' data-bind='events: {select: colorPickerSelect}' value='' data-buttons='false'>" +
            "          </div>" +*/
            "          <div class='floatl padr10 hidden-xs'>" +
            "               <a type='button' class='btn btn-default mobile100'><i class='fa fa-refresh'></i><span class='hidden-md hidden-sm hidden-xs hidden-xxs'> ~{Reset}~</span></a>" +
            "          </div>" +
            "          </div>" +
            "       <div class='crp-btn col_one_fourth col_last padr20'>" +
            "           <div class='floatr'>" +
            "               <a type='button' class='btn btn-primary mobile100'><i class='fa fa-save'></i><span class='hidden-md hidden-sm hidden-xs hidden-xxs'> ~{Save}~</span></a>" +
            "          </div>" +
            "           <div class='floatr padr20'>" +
            "               <a type='button' class='btn btn-default mobile100'><i class='fa fa-minus-circle'></i><span class='hidden-md hidden-sm hidden-xs hidden-xxs'> ~{Cancel}~</span></a>" +
            "           </div>" +
            "           </div>" +
            "       </div>" +
            "</div>"
        },
        _setupEvents: function () {
            var that = this;
            $(document).bind("cropper-image-load", function (e) {

                /**/
            });
        },
        _create: function () {
            var that = this;
            that.setupUpload();
        },
        _parseExtensions: function (options) {
            var that = this;
            if (options != null && options.acceptedExtensions != null && $.isArray(options.acceptedExtensions)) {
                that.options.acceptedExtensions = options.acceptedExtensions;
            }
        },
        _generateFileTypesString: function () {
            var that = this;
            var response = "";
            $(that.options.acceptedExtensions).each(function (i) {
                response += this;
                if (i != that.options.acceptedExtensions.length - 1) {
                    response += ",";
                }
            });
            return response;
        },
        _configureSaveUrl: function () {
            var that = this;
            var saveUrl = that._templates.kendoInputOptions.async.saveUrl;
            if (saveUrl.indexOf("?") < 0) {
                saveUrl += "?";
            }
            if (that.options.minHeight != null && that.options.minHeight > 0) {
                saveUrl += "MinHeight=" + that.options.minHeight + "&";
            }
            if (that.options.minWidth != null && that.options.minWidth > 0) {
                saveUrl += "MinWidth=" + that.options.minWidth + "&";
            }
            if (that.options.maxHeight != null && that.options.maxHeight > 0) {
                saveUrl += "MaxHeight=" + that.options.maxHeight + "&";
            }
            if (that.options.maxWidth != null && that.options.maxWidth > 0) {
                saveUrl += "MaxWidth=" + that.options.maxWidth + "&";
            }
            if (that.options.doNotConvertSpreadSheets != null && that.options.doNotConvertSpreadSheets === true) {
                saveUrl += "DoNotConvertSpreadSheets=" + that.options.doNotConvertSpreadSheets + "&"; 
            }
            
            that._templates.kendoInputOptions.async.saveUrl = saveUrl;
        },
        getUpload: function () {
            var that = this;
            var element = $(that.element);
            return element.find("input[type=file]").getKendoUpload();
        },
        setupUpload: function () {
            var that = this;
            var element = that.wrapper = $(that.element);
            that.setupFileInput();
            that._configureSaveUrl();
            that.hiddenInput = element.find("input[type=hidden]");
            that.value(that.options.defaultValue ? that.options.defaultValue : "");
        },
        setupFileInput: function () {
            var that = this;
            var element = that.element;
            if (element.find("input[type=hidden]").length === 0) {
                element.append($(that._templates.kendoInputBaseTemplate));
                var hiddenInput = element.find("input[type=hidden]");
                hiddenInput.attr("id", that.options.hiddenFieldId);
                hiddenInput.attr("name", that.options.hiddenFieldName);
                hiddenInput.val(that.options.defaultValue);
                hiddenInput.change(function (e) {
                });
            }
            var fileInput = element.find("input[type=file]");
            fileInput.attr("accept", that._generateFileTypesString());
            fileInput.attr("disabled", that.options.disabled);
        },
        compile: function (html, data) {
            return kendo.Template.compile(html)(data);
        },
        generatePreviewImage: function (file, callback) {
            var that = this;
            if (file != null && file !== "") {
                $.ajax({
                    url: "/Upload/Preview?filePath=" + file,
                    dataType: "json",
                    method: "POST",
                    success: function (result) {
                        callback(result);
                    },
                    error: function (e) {
                        callback(null);
                    },
                    complete: function (e) {
                    }
                });
            } else {
                callback(file);
            }
        },
        initializeImageList: function (file, previewFile) {
            var that = this;
            if (previewFile == null) {
                previewFile = file;
            }
            var initialImage = {
                uid: kendo.guid(),
                response: {
                    UploadFileUrl: file,
                    PreviewFileUrl: previewFile,
                    FileName: that.getFileName(file),
                    Extension: that.getFileExtension(file),
                    FileSize: 0,
                    IsMinHeight: true,
                    IsMinWidth: true
                }
            };
            that.options.images = [initialImage];
            that.options.response = initialImage;
            that._templates.kendoInputOptions.files = [
                {
                    name: initialImage.response.FileName,
                    extension: initialImage.response.Extension,
                    size: initialImage.response.FileSize,
                    uid: initialImage.uid
                }
            ];
            that.initializeInputControl();
        },
        initializeInputControl: function () {
            var that = this;
            if (that.inputControls != null && that.inputControls != undefined) {
                that.inputControls.destroy();
                $(that.element).find(".k-file-success").remove();
                $(that.element).find(".k-dropzone").remove();
                $(that.element).append("<input type='file' name='files' />");
            }

            that.inputControls = $(that.element).find("input[type=file]").kendoUpload(that._templates.kendoInputOptions);
            that.inputControls = that.inputControls.getKendoUpload();
            that.inputControls._events.complete[0]({
                sender: that.inputControls,
                isDefaultImage: true
            });
        },
        updateSelectedFile: function (file, previewFile, updatePreviousImage) {
            var that = this;
            if (updatePreviousImage == null || updatePreviousImage) {
                that.options.previousImageValue = that.hiddenInput.val();
            }
            if ((that.options.imageBankImages != null && that.options.imageBankImages.length > 0) || (file != null && file.trim().length > 0)) {
                that.initializeImageList(file, previewFile);
            } else {
                that.options.images = [];
                that.options.response = null;
                that._templates.kendoInputOptions.files = [];
            }
            that.initializeInputControl();
        },
        getFileName: function (path) {
            if (path == null) return "";
            return path.replace(/^.*[\\\/]/, '');
        },
        getFileExtension: function (path) {
            var ext = "";
            if (path != null) {
                ext = "." + path.split('.').pop();
            }
            return ext;
        },
        editImage: function (imageUrl, success, cancel) {
            var that = this;
            var data = {
                image: imageUrl,
                height: $(window).height() * .80,
                width: $(window).width() * .80
            };
            var html = that._templates.jQueryImageCropperTemplate;
            var kendoTemplate = kendo.template(html);
            var result = kendoTemplate(data);
            $.fancybox({
                content: result,
                scrolling: "no",
                modal: true,
                afterShow: function (e) {
                    var wrap = $.fancybox.wrap;
                    var aspectRatio = that.getAspectRatio();
                    wrap.find("#cropper-image-source").cropper({
                        aspectRatio: (that.options.fixedAspectRatio ? aspectRatio.w / aspectRatio.h : NaN),
                        viewMode: 1,
                        guides: true,
                        center: true,
                        highlight: true,
                        modal: true,
                        scalable: true,
                        zoomable: true,
                        rotatable: true,
                        responsive: true,
                        cropBoxMovable: true,
                        movable: true,
                        zoomOnWheel: false,
                        minCropBoxWidth: (that.options.minWidth != null ? that.options.minWidth : null),
                        minCropBoxHeight: (that.options.minHeight != null ? that.options.minHeight : null),
                        built: function (e) {
                            // dirty hack but simplifies the issue with the crop boundaries being off initially
                            // when the cropper has to resize and scale because of window size.
                            $("#cropper-image-source").cropper("zoom", 0.1);
                            $("#cropper-image-source").cropper("zoom", -0.1);
                        },
                    });
                    wrap.find(".fa-search-plus").parent().click(function (e) {
                        if (that.canScale(0.1)) {
                            $("#cropper-image-source").cropper("zoom", 0.1);
                        }
                    });
                    wrap.find(".fa-search-minus").parent().click(function (e) {
                        if (that.canScale(-0.1)) {
                            $("#cropper-image-source").cropper("zoom", -0.1);
                        }
                    });
                    wrap.find(".fa-rotate-left.large").parent().click(function (e) {
                        $("#cropper-image-source").cropper("rotate", -15);
                    });
                    wrap.find(".fa-rotate-right.large").parent().click(function (e) {
                        $("#cropper-image-source").cropper("rotate", 15);
                    });
                    wrap.find(".fa-rotate-left.small").parent().click(function (e) {
                        $("#cropper-image-source").cropper("rotate", -1);
                    });
                    wrap.find(".fa-rotate-right.small").parent().click(function (e) {
                        $("#cropper-image-source").cropper("rotate", 1);
                    });
                    wrap.find(".fa-upload").parent().click(function (e) {
                        that.options.images = [];
                        that.element.find(".k-dropzone").find("input[type=file]").click();
                    });
                    wrap.find(".fa-refresh").parent().click(function (e) {
                        $("#cropper-image-source").cropper("reset");
                        that.setupCanvasAndImage();
                        wrap.find("[data-role=colorpicker]").getKendoColorPicker().value("transparent");
                    });
                    wrap.find("[data-role=colorpicker]").kendoColorPicker({
                        value: "transparent",
                        opacity: true,
                        buttons: false,
                        select: function (e) {
                            $(".cropper-wrap-box").css('background-color', e.value);
                        },
                        change: function (e) {
                            $(".cropper-wrap-box").css('background-color', e.value);
                        }
                    });
                    wrap.find(".fa-save").parent().click(function (e) {
                        that.cropData = $("#cropper-image-source").cropper("getData");
                        that.cropBoxData = $("#cropper-image-source").cropper("getCropBoxData");
                        $(document).trigger(argosyEvents.START_LOADING);
                        $.ajax({
                            url: "/Upload/Crop",
                            dataType: "json",
                            method: "POST",
                            data: {
                                url: that.response.UploadFileUrl,
                                x: that.cropData.x,
                                y: that.cropData.y,
                                x2: that.cropData.x + that.cropData.width,
                                y2: that.cropData.y + that.cropData.height,
                                height: that.cropBoxData.height,
                                width: that.cropBoxData.width,
                                rotate: that.cropData.rotate,
                                scaleX: that.options.currentScale,
                                scaleY: that.options.currentScale,
                                format: ".png",
                                bgColor: "transparent",/*wrap.find("[data-role=colorpicker]").getKendoColorPicker().value()*/
                                anchor: "topleft",
                                quality: 100
                            },
                            success: function (result) {
                                if (result.ReturnCode == ReturnCode.Success) {
                                    success(result.Records);
                                    $(document).trigger(argosyEvents.KENDO_EDITOR_IMAGE_UPLOADED, [result.Records, $(that.element).attr("id")]);
                                } else {
                                    prompt.notify({
                                        type: "error",
                                        question: result.Message + " | Ref: " + result.Guid
                                    });
                                }
                            },
                            complete: function (e) {
                                $(document).trigger(argosyEvents.END_LOADING);
                                unblock();
                            }
                        });
                    });
                    wrap.find(".fa-minus-circle").parent().click(function (e) {
                        that.value(that.options.previousImageValue);
                        cancel();
                    });
                }
            });
        },
        canScale: function (scaleAmount) {
            var that = this;
            if (that.options.minimumScaleAmount != null && (that.options.currentScale + scaleAmount) < that.options.minimumScaleAmount) {
                return false;
            } else {
                that.options.currentScale = that.options.currentScale + scaleAmount;
                return true;
            }
        },
        setupCanvasAndImage: function () {
            var that = this;
            var imageData = $("#cropper-image-source").cropper("getImageData");
            var cropboxData = $("#cropper-image-source").cropper("getCropBoxData");
            var containerInfo = $("#cropper-image-source").cropper("getContainerData");
            var canvasData = {
                left: that.calculateOffset(containerInfo.width, imageData.naturalWidth),
                top: that.calculateOffset(containerInfo.height, imageData.naturalHeight),
                height: imageData.naturalHeight,
                width: imageData.naturalWidth
            };
            var cropData = {};
            if (that.options.minWidth != null && that.options.minWidth > 0) {
                cropData.width = that.options.minWidth;
            }
            if (that.options.minHeight != null && that.options.minHeight > 0) {
                cropData.height = that.options.minHeight;
            }

            if (imageData.naturalHeight > containerInfo.height || imageData.naturalWidth > containerInfo.width) {
                var scaledSize = that.scaleImageToContainer(containerInfo, imageData);
                canvasData = {
                    left: that.calculateOffset(containerInfo.width, scaledSize.width),
                    top: that.calculateOffset(containerInfo.height, scaledSize.height),
                    height: scaledSize.height,
                    width: scaledSize.width
                };

                if (that.options.minWidth == null || that.options.minWidth <= 0) {
                    cropData.width = canvasData.width;
                }
                if (that.options.minHeight == null || that.options.minHeight <= 0) {
                    cropData.height = canvasData.height;
                }
            }

            jsConsole.log("canvas left  : " + canvasData.left);
            jsConsole.log("canvas top   : " + canvasData.top);
            jsConsole.log("canvas height: " + canvasData.height);
            jsConsole.log("canvas width : " + canvasData.width);

            $("#cropper-image-source").cropper("setCanvasData", canvasData);
            if (cropData.width != null) {
                cropData.left = that.calculateOffset(containerInfo.width, cropData.width);
            } else {
                cropData.left = canvasData.left;
            }
            if (cropData.height != null) {
                cropData.top = that.calculateOffset(containerInfo.height, cropData.height);
            } else {
                cropData.top = canvasData.top;
            }
            $("#cropper-image-source").cropper("setCropBoxData", cropData);

            // if the image is smaller than the cropbox than we need to force the image to not scale outside the cropbox
            if (cropboxData.height > imageData.height || cropboxData.width > imageData.width) {
                var scaleHeight = cropboxData.height / imageData.height;
                var scaleWidth = cropboxData.width / imageData.width;
                var finalScale = (scaleHeight > scaleWidth ? scaleHeight : scaleWidth);
                that.options.minimumScaleAmount = finalScale;
                that.options.currentScale = finalScale;
                $("#cropper-image-source").cropper("zoom", (finalScale - 1));
            } else {
                that.options.minimumScaleAmount = null;
                that.options.currentScale = 1;
            }

            var messages = [];

            if (that.options.minWidth > imageData.naturalWidth && that.options.minHeight > imageData.naturalHeight) {
                messages.push("The image does not meet the minimum size of " + that.options.minWidth + "px by " + that.options.minHeight + "px and has been scaled to fit.");
            } else if (that.options.minWidth > imageData.naturalWidth || that.options.minHeight > imageData.naturalHeight) {
                if (that.options.minWidth > imageData.naturalWidth) {
                    messages.push("The image does not meet the minimum width of " + that.options.minWidth + "px and has been scaled to fit.");
                }
                if (that.options.minHeight > imageData.naturalHeight) {
                    messages.push("The image does not meet the minimum height of " + that.options.minHeight + "px and has been scaled to fit.");
                }
            }

            if (messages.length > 0) {
                var message = "";
                $(messages).each(function (i) {
                    message += this + "<br />";
                });
                $("#cropper-error-box").html(message);
            }
        },
        scaleImageToContainer: function (containerInfo, imageInfo) {
            var results = {
                height: containerInfo.height,
                width: containerInfo.width
            };
            var ratio = 0;  // Used for aspect ratio
            var width = imageInfo.naturalWidth;    // Current image width
            var height = imageInfo.naturalHeight;  // Current image height

            // Check if the current width is larger than the max
            if (width > results.width) {
                ratio = results.width / width;   // get ratio for scaling image
                results.width = results.width;
                results.height = height * ratio;
            } else if (height > results.height) {
                ratio = results.height / height; // get ratio for scaling image
                results.width = width * ratio;
                results.height = results.height;
            }
            return results;
        },
        calculateOffset: function (outer, inner) {
            return (outer / 2) - (inner / 2);
        },
        getAspectRatio: function () {
            var that = this;
            if (that.options.fixedAspectRatio) {
                var gcd = function (a, b) {
                    return (b == 0) ? a : gcd(b, a % b);
                };
                var r = gcd(that.options.minWidth, that.options.minHeight);
                return {
                    gcd: r,
                    w: that.options.minWidth / r,
                    h: that.options.minHeight / r
                };
            } else {
                return null;
            }
        },
        setupPreviewUrls: function (previewUrls) {
            $("#previewPagesLink").click(function () {
                $.fancybox(previewUrls,
                    {
                        nextEffect: "none",
                        prevEffect: "none",
                        padding: 0,
                        helpers: {
                            title: { type: "over" },
                            thumbs: {
                                width: 50,
                                height: 50,
                                source: function (item) {
                                    return item.href.replace("thumb_", "small_");
                                }
                            }
                        }
                    });
            });
        }
    });
    ui.plugin(ImageEditor);
})(jQuery);