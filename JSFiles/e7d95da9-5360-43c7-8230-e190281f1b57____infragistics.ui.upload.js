/*
 * Infragistics.Web.ClientUI Upload localization resources 12.2.20122.1021
 *
 * Copyright (c) 2011-2012 Infragistics Inc.
 *
 * http://www.infragistics.com/
 *
 */
$.ig = $.ig || {};
if (!$.ig.Upload) {
    $.ig.Upload = {};
    $.extend($.ig.Upload, {
        locale: {
            labelUploadButton: "Upload File",
            labelAddButton: "Add",
            labelClearAllButton: "Clear Uploaded",
            labelSummaryTemplate: "{0} of {1} uploaded",
            labelSummaryProgressBarTemplate: "{0}/{1}",
            labelShowDetails: "Show Details",
            labelHideDetails: "Hide Details",
            labelSummaryProgressButtonCancel: "Cancel",
            labelSummaryProgressButtonContinue: "Upload",
            labelSummaryProgressButtonDone: "Done",
            labelProgressBarFileNameContinue: "...",
            errorMessageFileSizeExceeded: "Max file size exceeded.",
            errorMessageGetFileStatus: "Could not get your current file status! Probably connection dropped.",
            errorMessageCancelUpload: "Could not send to server command to cancel upload! Probably connection dropped.",
            errorMessageNoSuchFile: "The file you requested could not be found. Probably this file is too big.",
            errorMessageOther: "There is internal error uploading file. Error code: {0}.",
            errorMessageValidatingFileExtension: "File extension validation failed.",
            errorMessageAJAXRequestFileSize: "AJAX error while trying to get file size.",
            errorMessageMaxUploadedFiles: "Maximum count of uploading files exceeded.",
            errorMessageMaxSimultaneousFiles: "Value of maxSimultaneousFilesUploads is incorrect. It should be more than 0 or null.",
            errorMessageTryToRemoveNonExistingFile: "You are trying to remove non-existing file with id {0}.",
            errorMessageTryToStartNonExistingFile: "You are trying to start non-existing file with id {0}.",
            titleUploadFileButtonInit: "Upload File",
            titleAddFileButton: "Add",
            titleCancelUploadButton: "Cancel",
            titleSummaryProgressButtonContinue: "Upload",
            titleClearUploaded: "Clear Uploaded",
            titleShowDetailsButton: "Show Details",
            titleHideDetailsButton: "Hide Details",
            titleSummaryProgressButtonCancel: "Cancel",
            titleSummaryProgressButtonDone: "Done",
            titleSingleUploadButtonContinue: "Upload",
            titleClearAllButton: "Clear Uploaded"
        }
    });
    /*
     * Infragistics.Web.ClientUI jQuery File Upload 12.2.20122.1021
     *
     * Copyright (c) 2011-2012 Infragistics Inc.
     *
     * http://www.infragistics.com/
     *
     * Depends on:
     *  jquery-1.4.2.js
     *	jquery.ui.core.js
     *	jquery.ui.widget.js
     *  infragistics.util.js
     *  infragistics.ui.shared.js
     */
}
if (typeof jQuery !== "function") {
    throw new Error("jQuery is undefined")
}
( function (a) {
    a.widget("ui.igBrowseButton", a.ui.igButton, {
        _const: {
            filePickerWidth: "220px",
            filePickerHeight: "30px"
        },
        css: {
            filePickerClass: "ui-igbrowsebutton-filepicker"
        },
        options: {
            autoselect: true,
            multiplefiles: false
        },
        _id: function (b) {
            return this.element[0].id + b
        },
        _create: function () {
            var b = this._id("_fp");
            a.extend(a.ui.igBrowseButton.prototype.options, a.ui.igButton.prototype.options);
            a.extend(a.ui.igBrowseButton.prototype.css, a.ui.igButton.prototype.css);
            a.ui.igButton.prototype._create.apply(this);
            this._createFilePicker(b);
            this._attachBrowseButtonEvents();
            if (this.options.disabled === true) {
                this._enableFilePicker(true)
            } else {
                this.element.bind({
                    click: function (c) {
                        c.preventDefault()
                    }
                })
            }
        },
        _createFilePicker: function (b) {
            a("#" + b).remove();
            this.filePicker = a('<input type="file" id="' + b + '" />').appendTo(a(document.body));
            this.filePicker.css({
                position: "absolute",
                margin: "-5px 0 0 -175px",
                padding: "0",
                width: "1px",
                height: "1px",
                fontSize: "14px",
                opacity: "0",
                cursor: "pointer",
                display: "block",
                zIndex: "1000000",
                filter: "alpha(opacity=0)"
            });
            this._setTitle(this.options.title)
        },
        _setTitle: function (c) {
            var b = a("#" + this._id("_fp"));
            if (c === false) {
                b.removeAttr("title")
            } else {
                b.attr("title", c)
            }
        },
        _attachBrowseButtonEvents: function () {
            var b = this;
            this.mouseMoveEvent = {
                mousemove: function (c) {
                    b._mousemove(c)
                }
            };
            this._internalEvents = {
                mouseover: function () {
                    b._attachMouseMove(true)
                }
            };
            b.element.bind(this._internalEvents);
            b._filePickerBindChange()
        },
        _filePickerBindChange: function () {
            var d = this, b, c = a("#" + this._id("_fp"));
            d.tempClicked = false;
            d._filePickerEvents = {
                change: function (e) {
                    b = d._fileFromPath(c.val());
                    if (!d._trigger("fileselect", e, {
                        filePath: b
                    })) {
                        return
                    }
                },
                click: function (e) {
                    if (!d._trigger("click", e)) {
                        return false
                    }
                }
            };
            c.bind(d._filePickerEvents)
        },
        attachFilePicker: function (c, h) {
            var l = this, k, b, g = l.element, d = this.filePicker, j = g.offset(), i = parseInt(j.left, 10), m = parseInt(j.top, 10), f = d[0];
            k = parseInt(i + g[0].offsetWidth, 10);
            b = parseInt(m + g[0].offsetHeight, 10);
            if (c.pageX >= i && c.pageX <= k && c.pageY >= m && c.pageY <= b) {
                f.style.top = c.pageY + "px";
                f.style.left = c.pageX + "px";
                if (h === true) {
                    d.css({
                        width: "1px",
                        height: "1px"
                    })
                } else {
                    l.isVisibleFilePicker = true;
                    d.css({
                        width: l._const.filePickerWidth,
                        height: l._const.filePickerHeight
                    })
                }
                f.style.display = "block";
                l._onMouseOver(c)
            }
        },
        getFilePicker: function () {
            var c = this._id("_fp"), b = a("#" + c);
            b.attr("id", "").css({
                display: "none"
            });
            this._createFilePicker(c);
            this._filePickerBindChange();
            return b
        },
        _mousemove: function (c) {
            var k = this, j, b, g = k.element, d = this.filePicker, i = g.offset(), h = parseInt(i.left, 10), l = parseInt(i.top, 10), f = d[0];
            j = parseInt(h + g[0].offsetWidth, 10);
            b = parseInt(l + g[0].offsetHeight, 10);
            if (c.pageX >= h && c.pageX <= j && c.pageY >= l && c.pageY <= b) {
                f.style.top = c.pageY + "px";
                f.style.left = c.pageX + "px";
                if (!k.isVisibleFilePicker) {
                    d.css({
                        width: k._const.filePickerWidth,
                        height: k._const.filePickerHeight
                    });
                    k.isVisibleFilePicker = true
                }
                f.style.display = "block";
                k._onMouseOver(c)
            } else {
                if (k.isVisibleFilePicker) {
                    d.css({
                        width: "1px",
                        height: "1px"
                    });
                    k.isVisibleFilePicker = false
                }
                k._attachMouseMove(false);
                k._onMouseOut(c)
            }
        },
        _attachMouseMove: function (b) {
            if (b) {
                a(document).bind(this.mouseMoveEvent)
            } else {
                a(document).unbind(this.mouseMoveEvent)
            }
        },
        _setOption: function (b, c) {
            a.ui.igButton.prototype._setOption.apply(this, arguments);
            a.Widget.prototype._setOption.apply(this, arguments);
            switch (b) {
                case"disabled":
                    this._enableFilePicker(c);
                    a.ui.igButton.prototype._setOption.apply(this, arguments);
                    break;
                case"title":
                    this._setTitle(c);
                    break;
                default:
                    break
            }
        },
        _enableFilePicker: function (c) {
            var b = a("#" + this._id("_fp"));
            if (c === false) {
                this.isVisibleFilePicker = false;
                this._attachMouseMove(true);
                this.element.bind(this._internalEvents).mouseover()
            } else {
                this._attachMouseMove(false);
                b.css({
                    width: "1px",
                    height: "1px"
                });
                this.element.unbind(this._internalEvents)
            }
        },
        destroy: function () {
            this.element.unbind(this._internalEvents);
            this.element.unbind(this.mouseMoveEvent);
            a.Widget.prototype.destroy.apply(this, arguments);
            a.ui.igButton.prototype.destroy.apply(this);
            a("#" + this._id("_fp")).remove()
        },
        _fileFromPath: function (b) {
            return b.replace(/(\/|\\)$/, "")
        }
    });
    a.extend(a.ui.igBrowseButton, {
        version: "12.2.20122.1021"
    });
    a.widget("ui.igUpload", {
        _const: {
            fileNameLimit: 100,
            AjaxQueueName: "uploadrequestsqueue",
            debug: true,
            isProgressBarAnimationEnabled: true,
            isProgressBarRange: false,
            timeoutGetFileSize: 1000,
            status: {
                NotStarted: 0,
                Started: 1,
                Finished: 2,
                NoSuchFile: 3,
                Canceled: 4
            },
            errorCode: {
                MimeTypeValidation: 1,
                FileSizeExceeded: 2
            },
            clientSideErrorCode: {
                maxAllowedUploadingFiles: 1,
                extensionValidation: 2,
                startUpload: 3,
                ajaxErrorGetFileStatus: 4,
                ajaxErrorCancelUpload: 5,
                removeFileUpload: 6,
                ajaxErrorRequestFileSize: 7,
                checkCanUpload: 8
            },
            fileStatusNoError: -1,
            progressUpdateInterval: 800,
            animateProgressBarInterval: 200,
            showHideDetailsAnimationTimeout: 500,
            doubleCheckRequestInterval: 1000,
            removeSingleUploadAnimationTimeout: 300,
            maxUploadFilesDefault: -1
        },
        defaultFileExtensionIcons: [
            {
                ext: [],
                css: "ui-icon ui-icon-document ui-igupload-progressbar-icon ui-igupload-progressbar-icon-default",
                def: true
            },
            {
                ext: ["exe", "app"],
                css: "ui-icon ui-icon-gear ui-igupload-progressbar-icon ui-igupload-progressbar-icon-exe",
                def: false
            },
            {
                ext: ["gif", "jpg", "jpeg", "png", "bmp", "yuv", "tif", "thm", "psd"],
                css: "ui-icon ui-icon-image ui-igupload-progressbar-icon ui-igupload-progressbar-icon-images",
                def: false
            },
            {
                ext: ["mp3", "wav", "mp4", "aac", "mid", "wma", "ra", "iff", "aif", "m3u", "mpa"],
                css: "ui-icon ui-icon-volume-on ui-icon ui-icon-image ui-igupload-progressbar-icon ui-igupload-progressbar-icon-music",
                def: false
            },
            {
                ext: ["doc", "docx", "xls", "xlsx", "txt", "ppt", "pptx", "pdf"],
                css: "ui-icon ui-icon-document ui-igupload-progressbar-icon ui-igupload-progressbar-icon-docs",
                def: false
            },
            {
                ext: ["3gp", "asf", "asx", "avi", "flv", "mov", "mp4", "mpg", "rm", "swf", "vob", "wmv"],
                css: "ui-icon ui-icon-video ui-igupload-progressbar-icon ui-igupload-progressbar-icon-video",
                def: false
            }
        ],
        css: {
            clearClass: "ui-helper-clearfix",
            hiddenClass: "ui-helper-hidden",
            baseClassIE6: "ui-ie6",
            baseClassIE7: "ui-ie7",
            baseClassMoz: "ui-moz",
            baseClassOpera: "ui-opera",
            baseClassWebkit: "ui-webkit",
            startupBrowseButtonClasses: "ui-igstartupbrowsebutton",
            baseClass: "ui-widget ui-widget ui-widget-content ui-corner-all ui-igupload",
            baseMainContainerClass: "ui-igupload-basemaincontainer",
            multipleDialogClasses: "ui-iguploadmultiple",
            singleDialogClass: "ui-iguploadsingle",
            browseButtonClass: "ui-igupload-browsebutton",
            containerClass: "ui-igupload-container ui-widget-content",
            uploadProgressClass: "ui-igupload-uploadprogress",
            fileInfoMainContainer: "ui-igupload-fimaincontainer",
            progressContainer: "ui-helper-clearfix",
            progressBarUploadClass: "ui-igupload-progressbar-upload ui-igupload-progressbar-upload-single ui-helper-clearfix",
            progressBarFileNameClass: "ui-igupload-progressbar-filename",
            progressBarFileSizeClass: "ui-igupload-progressbar-filesize",
            progressBarInnerHTMLContainerClass: "ui-igupload-progressbar-container ui-helper-clearfix",
            containerButtonCancelClass: "ui-container-button-cancel-class  ui-helper-clearfix",
            summaryProgressBarClass: "ui-igupload-summaryprogressbar",
            summaryProgressContainerClass: "ui-igupload-summaryprogresscontainer",
            summaryProgressbarLabelClass: "ui-igupload-summaryprogress-label",
            summaryInformationContainerClass: "ui-igupload-summaryinformation-container ui-helper-clearfix",
            summaryUploadedFilesLabelClass: "ui-igupload-summaryuploadedfiles-label",
            summaryShowHideDetailsButtonClass: "ui-igupload-showhidedetails-button",
            summaryButtonClass: "ui-igupload-summary-button",
            summaryProgressBarInnerProgress: "ui-igupload-summaryprogres_summpbar_progress",
            summaryProgressBarSecondaryLabel: "ui-igupload-summaryprogress-label ui-igupload-summaryprogress-secondary-label",
            containerFUS: "ui-widget-content ui-igupload-progress-container ui-corner-all ui-helper-clearfix"
        },
        options: {
            width: "",
            height: "",
            autostartupload: false,
            labelUploadButton: a.ig.Upload.locale.labelUploadButton,
            labelAddButton: a.ig.Upload.locale.labelAddButton,
            labelClearAllButton: a.ig.Upload.locale.labelClearAllButton,
            labelSummaryTemplate: a.ig.Upload.locale.labelSummaryTemplate,
            labelSummaryProgressBarTemplate: a.ig.Upload.locale.labelSummaryProgressBarTemplate,
            labelShowDetails: a.ig.Upload.locale.labelShowDetails,
            labelHideDetails: a.ig.Upload.locale.labelHideDetails,
            labelSummaryProgressButtonCancel: a.ig.Upload.locale.labelSummaryProgressButtonCancel,
            labelSummaryProgressButtonContinue: a.ig.Upload.locale.labelSummaryProgressButtonContinue,
            labelSummaryProgressButtonDone: a.ig.Upload.locale.labelSummaryProgressButtonDone,
            labelProgressBarFileNameContinue: a.ig.Upload.locale.labelProgressBarFileNameContinue,
            errorMessageMaxFileSizeExceeded: a.ig.Upload.locale.errorMessageFileSizeExceeded,
            errorMessageGetFileStatus: a.ig.Upload.locale.errorMessageGetFileStatus,
            errorMessageCancelUpload: a.ig.Upload.locale.errorMessageCancelUpload,
            errorMessageNoSuchFile: a.ig.Upload.locale.errorMessageNoSuchFile,
            errorMessageOther: a.ig.Upload.locale.errorMessageOther,
            errorMessageValidatingFileExtension: a.ig.Upload.locale.errorMessageValidatingFileExtension,
            errorMessageAJAXRequestFileSize: a.ig.Upload.locale.errorMessageAJAXRequestFileSize,
            errorMessageTryToRemoveNonExistingFile: a.ig.Upload.locale.errorMessageTryToRemoveNonExistingFile,
            errorMessageTryToStartNonExistingFile: a.ig.Upload.locale.errorMessageTryToStartNonExistingFile,
            errorMessageMaxUploadedFiles: a.ig.Upload.locale.errorMessageMaxUploadedFiles,
            errorMessageMaxSimultaneousFiles: a.ig.Upload.locale.errorMessageMaxSimultaneousFiles,
            uploadUrl: "ig_fua34sf345sdf13sdf3454erdsf2345asd3425df5235d54df345.aspx",
            progressUrl: "IGUploadStatusHandler.ashx",
            allowedExtensions: [],
            showFileExtensionIcon: true,
            css: null,
            fileExtensionIcons: [
                {
                    ext: [],
                    css: "",
                    def: false
                }
            ],
            mode: "single",
            maxUploadedFiles: -1,
            maxSimultaneousFilesUploads: 1,
            fileSizeMetric: "auto",
            controlId: "",
            fileSizeDecimalDisplay: 2
        },
        events: {
            fileSelecting: "fileSelecting",
            fileSelected: "fileSelected",
            fileUploading: "fileUploading",
            fileUploaded: "fileUploaded",
            fileUploadAborted: "fileUploadAborted",
            cancelAllClicked: "cancelAllClicked",
            onError: "onError"
        },
        summaryButtonModes: {
            cancel: 1,
            startupload: 2,
            done: 3
        },
        container: function () {
            return a("#" + this.element[0].id + "_wrprinit")
        },
        widget: function () {
            return this.element
        },
        _id: function (d, b) {
            var c = this.element[0].id;
            if (b !== undefined) {
                return c + "_" + b + "_" + d
            }
            return c + d
        },
        _create: function () {
            var b = {
                formNumber: 0,
                iframe: {
                    ids: []
                },
                pendingQueueIDs: [],
                uploadingIDs: [],
                batch: [],
                lastId: -1,
                filesInfo: [],
                countUploadingFiles: 0,
                countTotalFiles: 0,
                fileSizeUploaded: 0,
                fileSizeTotal: 0
            };
            this.allCancelled = false;
            this.fileInfoData = b;
            this._renderStartupBrowseButton();
            this.container().width(this.options.width).height(this.options.height);
            this._attachFakeIframe();
            this._analyzeFileExtensionIcons()
        },
        _analyzeFileExtensionIcons: function () {
            var d, f, b = this.options.fileExtensionIcons, h, c = a.extend(true, [], this.defaultFileExtensionIcons), g = c.length, k = [], e = false;
            if (b === undefined || b === null) {
                this.options.fileExtensionIcons = c;
                return
            }
            h = b.length;
            if (h === 1 && b[0].css === "") {
                this.options.fileExtensionIcons = c;
                return
            }
            for (f = 0; f < h; f++) {
                for (d = 0; d < g; d++) {
                    c[d].ext = this._removeCommonElementsInArrays(c[d].ext, b[f].ext)
                }
                if (b[f].def === true) {
                    e = true
                }
                k.push(b[f])
            }
            for (d = 0; d < g; d++) {
                if (c[d].ext.length > 0 || (e === false && c[d].def === true)) {
                    k.push(c[d])
                }
            }
            this.options.fileExtensionIcons = k
        },
        _removeCommonElementsInArrays: function (b, c) {
            return a.grep(b, function (d) {
                return a.inArray(d, c) === -1
            })
        },
        _attachFakeIframe: function () {
            var c = this._id("_tempIframe"), b = a.browser.version.slice(0, 1);
            if (a.browser.msie === true && (b === "6" || b === "7" || b === "8")) {
                a("#" + c).remove();
                setTimeout(a('<iframe src="javascript:false;" id="' + c + '" style="display: none;"></iframe>').appendTo(a("#" + this._id("_fu"))), 300)
            }
        },
        _renderStartupBrowseButton: function () {
            var i = this, f = i.css, g = i.element, h = i.options, b = this._id("_ibb"), j = this._id("_wrprinit"), d, c;
            this.originalElement = g;
            d = '<div id="' + j + '"></div>';
            g.wrap(d);
            g.hide();
            g = a("#" + j);
            b = this._id("_ibb");
            if (a.browser.msie === true && a.browser.version.slice(0, 1) === "6") {
                g.addClass(f.baseClassIE6)
            } else {
                if (a.browser.msie === true && a.browser.version.slice(0, 1) === "7") {
                    g.addClass(f.baseClassIE7)
                } else {
                    if (a.browser.opera === true) {
                        g.addClass(f.baseClassOpera)
                    } else {
                        if (a.browser.mozilla === true) {
                            g.addClass(f.baseClassMoz)
                        } else {
                            if (a.browser.webkit === true) {
                                g.addClass(f.baseClassWebkit)
                            }
                        }
                    }
                }
            }
            c = a("<button></button>").appendTo(g).attr("id", b).addClass(f.startupBrowseButtonClasses);
            c.igBrowseButton({
                labelText: h.labelUploadButton,
                title: a.ig.Upload.locale.titleUploadFileButtonInit,
                fileselect: function (e) {
                    a(this).css({
                        display: "none"
                    });
                    i._HTMLUpload();
                    i._onBrowseButtonFileSelected(e, true)
                },
                disabled: h.disabled,
                click: function (e) {
                    var k = false;
                    if (i._trigger(i.events.fileSelecting, e) === false) {
                        k = true
                    }
                    return !k
                }
            })
        },
        _HTMLUpload: function () {
            var n = this._id("_fu"), b = this._id("_bmncntr"), k = this.options, h = this.container(), l = this, g = l.css, i = this._id("_fc"), c = this._id("_bb"), f = this._id("_clrabtn"), m = this._id("_fi_main_cntnr"), d, j = "";
            if (k.mode === "single") {
                j += '<div  class="' + g.singleDialogClass + '" id="$baseMainContainerId">';
                j += '   <div id="$uploaderId$" class="$baseMainContainerClass">';
                j += '       <div id="$fileContainerId$"></div>';
                j += '       <button id="$browseButtonId$" class="$browseButtonClass$"></button>';
                j += "   </div>";
                j += "</div>"
            } else {
                if (k.mode === "multiple") {
                    j = '<div class="' + g.multipleDialogClasses + '" id="$baseMainContainerId">';
                    j += '   <div  id="$uploaderId$" class="$baseMainContainerClass">';
                    j += '       <div id="$uploaderFilesContainer" class="$fuMainContainerClass">';
                    j += '           <button id="$browseButtonId$" class="$browseButtonClass$"></button>';
                    j += '           <button id="$clearAllButtonId$"></button>';
                    j += '           <div id="$fileContainerId$"></div>';
                    j += "       </div>";
                    j += "   </div>";
                    j += "</div>"
                }
            }
            j = j.replace("$uploaderId$", n).replace("$browseButtonId$", c).replace("$baseMainContainerId", b).replace("$browseButtonClass$", g.browseButtonClass).replace("$fileContainerId$", i).replace("$clearAllButtonId$", f).replace("$uploaderFilesContainer", m).replace("$fuMainContainerClass", g.fileInfoMainContainer).replace("$baseMainContainerClass", g.baseMainContainerClass);
            a(j).appendTo(h).css({
                width: k.width,
                height: k.height
            }).addClass(g.baseClass);
            d = a("#" + f);
            if (d.length > 0) {
                d.igButton({
                    title: a.ig.Upload.locale.titleClearAllButton,
                    labelText: k.labelClearAllButton,
                    disabled: true,
                    click: function (e) {
                        e.preventDefault();
                        l.clearAll()
                    },
                    css: {
                        buttonClasses: "ui-igbutton ui-igupload-button-clear-all",
                        buttonHoverClasses: "",
                        buttonActiveClasses: "",
                        buttonFocusClasses: "",
                        buttonLabelClass: ""
                    }
                })
            }
            a("#" + c).igBrowseButton({
                labelText: this.options.labelAddButton,
                title: a.ig.Upload.locale.titleAddFileButton,
                fileselect: function (e) {
                    l._onBrowseButtonFileSelected(e, false)
                },
                click: function (e) {
                    var o = false;
                    if (l._trigger(l.events.fileSelecting, e) === false) {
                        o = true
                    }
                    return !o
                }
            });
            a("#" + i).addClass(g.containerClass);
            if (k.mode === "multiple") {
                l._spbRenderInit()
            }
        },
        _disableBrowseButton: function (b) {
            a("#" + this._id("_bb")).igBrowseButton("option", "disabled", b);
            a("#" + this._id("_ibb")).igBrowseButton("option", "disabled", b)
        },
        _checkMaxUploadingFilesCount: function () {
            var c = this.options, b = true, d = this.fileInfoData.countTotalFiles + 1;
            if (c.maxUploadedFiles !== this._const.maxUploadFilesDefault && c.maxUploadedFiles !== null && d > c.maxUploadedFiles) {
                b = false
            }
            return b
        },
        _onBrowseButtonFileSelected: function (c, d) {
            var f = this, b = this.fileInfoData, e = f.options, g = a("#" + this._id("_fu"));
            if (f._checkMaxUploadingFilesCount() === false) {
                f._setError(e.errorMessageMaxUploadedFiles, f._const.clientSideErrorCode.maxAllowedUploadingFiles, "clientside");
                f._disableBrowseButton(true);
                return
            }
            if (e.maxUploadedFiles !== null && e.maxUploadedFiles !== this._const.maxUploadFilesDefault && e.maxUploadedFiles === (b.countTotalFiles + 1)) {
                f._disableBrowseButton(true)
            }
            if (e.mode === "single") {
                if (b.iframe.ids.length === 0) {
                    f._removeSingleUpload(b.lastId);
                    if (f._attachIframe(c, g, d) === true) {
                        f._disableBrowseButton(true)
                    }
                }
            } else {
                if (e.mode === "multiple") {
                    if (f._attachIframe(c, g, d) === false) {
                        f._disableBrowseButton(false)
                    }
                }
            }
        },
        clearAll: function () {
            var c = this.container(), b = c.data("finishedIDs"), d, f;
            if (b === undefined) {
                return
            }
            f = b.length;
            for (d = 0; d < f; d++) {
                this._removeSingleUpload(b[d])
            }
            b = [];
            c.data("finishedIDs", b);
            this._disableClearAllButton()
        },
        _enableClearAllButton: function () {
            a("#" + this._id("_clrabtn")).igButton({
                disabled: false
            })
        },
        _disableClearAllButton: function () {
            a("#" + this._id("_clrabtn")).igButton("option", "disabled", true)
        },
        _attachIframe: function (f, t, n) {
            var r = this, q = r.options, e = this.fileInfoData, c = this._id("_bb"), b = a("#" + c), h = e.formNumber++, m = this._id("_ifrm", h), k = this._id("_frm", h), i, g = this.fileInfoData, l, j, p = r._randomString(30), s = r._const.status.Started, d = q.controlId, u = q.uploadUrl + "?key=" + p + "&cid=" + d;
            if (n === true) {
                i = a("#" + this._id("_ibb")).igBrowseButton("getFilePicker")
            } else {
                i = b.igBrowseButton("getFilePicker")
            }
            if (r._validateFileExtension(i[0].value) === false) {
                i.remove();
                r._setError(q.errorMessageValidatingFileExtension, r._const.clientSideErrorCode.extensionValidation, "clientside");
                if (q.mode === "multiple") {
                    r._spbRenderProgress()
                }
                if (q.maxUploadedFiles !== null && q.maxUploadedFiles >= (e.countTotalFiles + 1)) {
                    r._disableBrowseButton(false)
                }
                return false
            }
            g.filesInfo[h] = {
                path: i.val(),
                key: p,
                sizeBytes: 0,
                uploadedBytes: 0,
                status: r._const.status.NotStarted,
                checksNoSuchFile: 0,
                innerStatus: r._const.status.NotStarted
            };
            g.countTotalFiles++;
            r._spbRenderProgress();
            l = a('<iframe src="javascript:false;" id="' + m + '" name="' + m + '"></iframe>').appendTo(a(document.body)).css({
                display: "none"
            });
            j = a('<form method="post" enctype="multipart/form-data"></form>').attr("id", k).attr("target", m).attr("action", u).appendTo(a(document.body));
            i.attr("name", k + "_if").attr("id", k + "_if").appendTo(j);
            r._HTMLSingleUpload(h);
            if (q.autostartupload === true) {
                if (r._checkCanUpload() === true) {
                    r.startUpload(h)
                } else {
                    r._addPendingId(h);
                    s = r._const.status.NotStarted;
                    r._getFileSize(h, p)
                }
            } else {
                if (q.mode === "single") {
                    r._showSingleUploadStartUpload(true, h);
                    r._getFileSize(h, p)
                } else {
                    r._addIDBatch(h);
                    s = r._const.status.NotStarted;
                    r._getFileSize(h, p)
                }
            }
            e.iframe.ids[e.iframe.ids.fileId] = {
                id: h,
                status: s
            };
            if (q.mode === "multiple") {
                r._spbCheckModeButton()
            }
            r._trigger(r.events.fileSelected, f, {
                fileId: h,
                filePath: r._getOnlyFileName(i.val())
            });
            return true
        },
        _showSingleUploadStartUpload: function () {
            var d = this, c = d.options, f = "_strtuplbtn", e = a("#" + this._id(f)), b = a("#" + this._id("_bb"));
            if (e.length === 0) {
                a('<button id="' + d._id(f) + '"></button>').appendTo(a("#" + d._id("_fu"))).igButton({
                    labelText: c.labelSummaryProgressButtonContinue,
                    title: a.ig.Upload.locale.titleSingleUploadButtonContinue,
                    click: function (g) {
                        g.preventDefault();
                        d.startUpload((d.fileInfoData.formNumber - 1), g);
                        b.igBrowseButton("attachFilePicker", g, true)
                    }
                });
                e = a("#" + this._id(f))
            }
            b.hide();
            e.show()
        },
        _removeIframe: function (f) {
            var g = this, c = this.fileInfoData, e = this._id("_ifrm", f), d = this._id("_frm", f), b = a("#" + g._id("_bb"));
            a("#" + e).remove();
            a("#" + d).remove();
            c.iframe.ids = g._removeElementArrayById(c.iframe.ids, f);
            if (g.options.mode === "single") {
                b.igBrowseButton("option", "disabled", false);
                c.lastId = f
            }
            this._attachFakeIframe()
        },
        _HTMLSingleUpload: function (l) {
            var v = this, q = this.options, c = v.css, e = v._id("_fc"), j = v._id("_fus", l), x = v._id("_snglpbar", l), p = v._id("_icn", l), k = v._id("_frm", l), b = v._id("_cbtn", l), h = k + "_if", d = a("#" + e), g = a("#" + h), i, f = g.val(), m, s = v._id("_pbrflnm", l), u = v._id("_pbrflsz", l), r, t, w, n = v._getFileExtensionIconPath(v._getFileExtension(f));
            m = '<div id="' + j + '">';
            m += '   <div class="' + c.containerFUS + '">';
            m += '       <div class="' + c.containerButtonCancelClass + '">';
            m += '           <button id="' + b + '"></button>';
            m += "       </div>";
            m += '       <div class="' + c.progressContainer + '">';
            m += '           <div class="' + c.progressBarInnerHTMLContainerClass + '" title="' + f + '">';
            m += '               <span id="' + p + '" class="' + n + '"></span>';
            m += '               <span class="' + c.progressBarFileNameClass + '" id="' + s + '"></span>';
            m += '               <span class="' + c.progressBarFileSizeClass + '" id="' + u + '"></span>';
            m += "           </div>";
            m += '           <div id="' + x + '" class="' + c.progressBarUploadClass + '"></div>';
            m += "       </div>";
            m += "   </div>";
            m += "</div>";
            a(m).appendTo(d);
            i = a("#" + j).addClass(c.uploadProgressClass + " " + c.clearClass);
            w = a("#" + x);
            a("#" + b).igButton({
                onlyIcons: true,
                icons: {
                    primary: "ui-icon-closethick"
                },
                title: a.ig.Upload.locale.titleCancelUploadButton,
                click: function (o) {
                    o.preventDefault();
                    v.cancelUpload(l);
                    a("#" + b).igButton("option", "disabled", true).igButton("option", "icons", {
                        primary: "ui-icon-check",
                        secondary: null
                    })
                },
                css: {
                    buttonClasses: "ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-igbutton ui-igupload-cancel-button",
                    buttonHoverClasses: "ui-state-hover",
                    buttonActiveClasses: "ui-state-active",
                    buttonFocusClasses: "ui-state-focus",
                    buttonLabelClass: "ui-button-text",
                    buttonDisabledClass: "ui-state-disabled",
                    buttonPrimaryIconClass: "ui-button-icon-primary ui-icon",
                    buttonMainElementPrimaryIconClass: " ui-button-text-icon-primary",
                    buttonMainElementSecondaryIconClass: " ui-button-text-icon-secondary",
                    buttonSecondaryIconClass: "ui-button-icon-secondary ui-icon",
                    buttonIconsOnly: "ui-button-icons-only",
                    buttonIconOnly: "ui-button-icon-only",
                    buttonIcons: "ui-button-text-icons",
                    buttonTextOnlyClass: "ui-button-text-only"
                }
            });
            w.igProgressBar({
                animate: v._const.isProgressBarAnimationEnabled,
                animateTimeout: v._const.animateProgressBarInterval,
                range: v._const.isProgressBarRange,
                value: 0
            });
            if (!q.showFileExtensionIcon) {
                a("#" + p).css("display", "none")
            }
            r = a("#" + s);
            t = a("#" + u);
            f = v._getOnlyFileName(f);
            w.data("originalFileName", f);
            if (f.length > v._const.fileNameLimit) {
                f = f.substr(0, v._const.fileNameLimit)
            }
            r.text(v._formatFilePath(f));
            v._renderFileName(l, 0, f)
        },
        _renderFileName: function (e, c, d) {
            var l = this, f = l.options, b = d, h = "", g, i = a("#" + l._id("_pbrflnm", e)), j = a("#" + l._id("_pbrflsz", e)), n = a("#" + l._id("_snglpbar", e)).width(), m = a("#" + l._id("_snglpbar", e)), k = j.width();
            if (i.length === 0) {
                return
            }
            if (b === undefined || b === null) {
                b = m.data("fileName")
            }
            if (n <= 0) {
                b = f.labelProgressBarFileNameContinue;
                i.text(b)
            } else {
                if (c !== 0 && c !== undefined && c !== null) {
                    g = j.text();
                    k = j.text(l._formatFileSize(c) + "/" + l._formatFileSize(c)).width();
                    j.text(g)
                }
                while (i.position().left + i.width() + k >= n && (h !== b)) {
                    h = b;
                    b = b.substr(0, b.length / 2);
                    if (h === b && b.length - 1 > 1) {
                        b = b.substr(0, (b.length - 1) / 2)
                    }
                    i.text(b + f.labelProgressBarFileNameContinue)
                }
                if (i.position().left + i.width() + j.width() >= n) {
                    b = f.labelProgressBarFileNameContinue
                }
            }
            m.data("fileName", b)
        },
        _removeSingleUpload: function (d) {
            var e = this, b = e._id("_fus", d), c = b + "_" + e._randomString(20);
            if (e.options.mode === "multiple") {
                a("#" + b).attr("id", c);
                e._renderAnimatedRemovingUpload(c)
            } else {
                if (e.options.mode === "single") {
                    a("#" + b).hide().remove()
                }
            }
        },
        _renderAnimatedRemovingUpload: function (b) {
            a("#" + b).slideUp(this._const.removeSingleUploadAnimationTimeout, function () {
                a(this).remove()
            })
        },
        startUpload: function (d) {
            var e = this, c = e._id("_frm", d), b = this.fileInfoData;
            if (d === null || b.filesInfo[d] === null || b.filesInfo[d] === undefined) {
                e._setError(e.options.errorMessageTryToStartNonExistingFile.replace("{0}", d), e._const.clientSideErrorCode.startUpload, "clientside");
                return
            }
            if (b.filesInfo[d].status !== e._const.status.NotStarted) {
                return
            }
            a("#" + c).submit();
            e._addUploadingID(d);
            e._removeIDBatch(d);
            e._spbCheckModeButton();
            b.filesInfo[d].status = e._const.status.Started;
            b.filesInfo[d].innerStatus = e._const.status.Started;
            e._spbRenderProgress();
            if (this.options.mode === "single") {
                a("#" + e._id("_strtuplbtn")).hide();
                a("#" + e._id("_bb")).igBrowseButton("option", "disabled", true).show()
            }
            setTimeout(function () {
                e._getFileStatus(d, true)
            }, e._const.progressUpdateInterval)
        },
        _getFileStatus: function (j, m) {
            var q = this, p = q.options, i = q._id("_frm", j), g = i + "_if", l = false, t = "", b = 0, h = 0, f = a("#" + g), s = this._getFileInfo(j), d = this.fileInfoData, n = q._getKey(j), e = d.filesInfo[j], c, k, r = "";
            if (n === null || n === undefined) {
                return
            }
            n = n.replace("-$#", "").replace("#$-", "");
            a.ajaxQueue("uploadrequestsqueue", {
                url: q._formatURL(p.progressUrl, a.param({
                    key: n,
                    command: "status"
                })),
                dataType: "json",
                cache: false,
                success: function (o) {
                    b = parseInt(o.bytesUploaded, 10);
                    t = parseInt(o.status, 10);
                    h = parseInt(o.size, 10);
                    r = o.serverMessage;
                    l = (t === q._const.status.Finished);
                    c = parseInt(o.error, 10);
                    k = (!isNaN(c) && c !== q._const.fileStatusNoError);
                    if (e.innerStatus === q._const.status.Canceled && k) {
                        return
                    }
                    if (k === true && t !== q._const.status.NoSuchFile) {
                        q._removeUploadSetError(j, p.errorMessageOther.replace("{0}", c), c, "serverside", r);
                        return
                    }
                    if (s !== null && s.status !== q._const.status.Canceled) {
                        d.fileSizeUploaded -= s.uploadedBytes;
                        if (s.sizeBytes === 0 || s.sizeBytes === null) {
                            s.sizeBytes = h;
                            d.fileSizeTotal += h
                        } else {
                            if (s.sizeBytes !== h) {
                                h = s.sizeBytes
                            }
                        }
                        if (l) {
                            d.countUploadingFiles++
                        }
                        s.uploadedBytes = b;
                        s.status = t;
                        d.fileSizeUploaded += s.uploadedBytes;
                        q._spbRenderProgress();
                        if (q._trigger(q.events.fileUploading, null, {
                            fileId: j,
                            filePath: q._getOnlyFileName(f.val()),
                            totalSize: h,
                            uploadedBytes: b,
                            fileStatus: t
                        }) === false) {
                            q.cancelUpload(j)
                        }
                    }
                    if (l || t === q._const.status.Started) {
                        if (l) {
                            q._removeUploadingID(j);
                            if (p.mode === "multiple") {
                                q._spbCheckModeButton();
                                q._submitNextPendingId()
                            }
                        }
                        q._renderStatus(j, b, h, l, m);
                        if (!l) {
                            setTimeout(function () {
                                q._getFileStatus(j, false)
                            }, q._const.progressUpdateInterval)
                        }
                    } else {
                        if (t === q._const.status.NoSuchFile) {
                            if (e !== null && e !== undefined && e.checksNoSuchFile === 0) {
                                e.checksNoSuchFile++;
                                setTimeout(function () {
                                    q._getFileStatus(j, false)
                                }, q._const.doubleCheckRequestInterval)
                            } else {
                                q._removeUploadSetError(j, p.errorMessageNoSuchFile, "nosuchfilekeyid", "serverside", r)
                            }
                        }
                    }
                },
                error: function () {
                    q._setError(p.errorMessageGetFileStatus, q._const.clientSideErrorCode.ajaxErrorGetFileStatus, "clientside")
                }
            })
        },
        _removeUploadSetError: function (e, c, b, d, h) {
            var g = this, f = this.options;
            g._removeIframe(e);
            g._removeFileUpload(e);
            g._setError(c, b, d, h);
            if (f.mode === "multiple") {
                g._spbCheckModeButton();
                g._submitNextPendingId()
            }
        },
        cancelUpload: function (g) {
            var j = this, i = j.options, d = null, m = j._id("_snglpbar", g), l = a("#" + m), f = a("#" + j._id("_frm", g) + "_if"), e = f.val(), n = 0, c = 0, b = null, h = this._getKey(g), k = this._getFileInfo(g);
            n = l.data("totalSize");
            c = l.data("bytesUploaded");
            if (n === undefined) {
                n = 0
            }
            if (c === undefined) {
                c = 0
            }
            if (k !== null) {
                if (k.status === j._const.status.Started) {
                    k.innerStatus = j._const.status.Canceled;
                    a.ajaxQueue("uploadrequestsqueue", {
                        url: j._formatURL(i.progressUrl, a.param({
                            key: h,
                            command: "cancel"
                        })),
                        dataType: "json",
                        cache: false,
                        success: function () {
                            if (i.autostartupload === false && i.mode === "multiple") {
                                d = a("#" + j._id("_spbtncncl"));
                                b = d.data("ids");
                                b = j._removeElementFromArray(b, g);
                                d.data("ids", b)
                            }
                            j._trigger(j.events.fileUploadAborted, null, {
                                fileId: g,
                                filePath: j._getOnlyFileName(e),
                                uploadedBytes: c,
                                totalSize: n,
                                status: j._const.status.Canceled
                            });
                            j._removeFileUpload(g)
                        },
                        error: function () {
                            j._setError(i.errorMessageCancelUpload, j._const.clientSideErrorCode.ajaxErrorCancelUpload, "clientside");
                            j._removeFileUpload(g)
                        }
                    })
                } else {
                    if (k.status === j._const.status.NotStarted) {
                        if (i.mode === "single") {
                            a("#" + this._id("_strtuplbtn")).hide();
                            a("#" + this._id("_bb")).igBrowseButton("option", "disabled", "false").show()
                        }
                        j._trigger(j.events.fileUploadAborted, null, {
                            fileId: g,
                            filePath: j._getOnlyFileName(e),
                            uploadedBytes: 0,
                            totalSize: n,
                            status: j._const.status.NotStarted
                        });
                        j._removeFileUpload(g)
                    }
                }
            }
        },
        _removeFileUpload: function (e) {
            var g = this, f = g.options, c = g._id("_cbtn", e), j = g._id("_snglpbar", e), i = a("#" + j), k = 0, b = 0, d = this.fileInfoData, h = this._getFileInfo(e);
            if (h === null) {
                g._setError(f.errorMessageTryToRemoveNonExistingFile.replace("{0}", e), g._const.clientSideErrorCode.removeFileUpload, "clientside");
                return
            }
            k = i.data("totalSize");
            b = i.data("bytesUploaded");
            if (k === undefined) {
                k = 0
            }
            if (b === undefined) {
                b = 0
            }
            d.countTotalFiles--;
            h.status = g._const.status.Canceled;
            d.fileSizeUploaded -= h.uploadedBytes;
            d.fileSizeTotal -= h.sizeBytes;
            g._spbRenderProgress();
            if (f.mode === "multiple") {
                g._removeUploadingID(e);
                g._removePendingId(e);
                g._removeIDBatch(e);
                if (this.allCancelled === false) {
                    g._submitNextPendingId()
                }
                g._spbCheckModeButton()
            }
            a("#" + c).remove();
            g._removeIframe(e);
            g._removeSingleUpload(e);
            g._disableBrowseButton(!g._checkMaxUploadingFilesCount())
        },
        _getKey: function (c) {
            var b = this.fileInfoData.filesInfo[c];
            if (b !== null && b !== undefined) {
                return b.key
            }
            return null
        },
        _singleFileUploadFinished: function (d) {
            var c = this.container(), f = this, b;
            a("#" + f._id("_cbtn", d)).igButton("option", "disabled", true).igButton("option", "icons", {
                primary: "ui-icon-check",
                secondary: null
            });
            f._removeIframe(d);
            if (f.options.mode === "multiple") {
                f._enableClearAllButton();
                b = c.data("finishedIDs");
                if (b === undefined) {
                    b = []
                }
                b.push(d);
                c.data("finishedIDs", b)
            }
        },
        _renderStatus: function (f, b, e, g) {
            var j = this, c, h, m = a("#" + j._id("_pbrflsz", f)), l = j._id("_snglpbar", f), k = a("#" + l), i = 0, d;
            if (g) {
                b = e;
                j._singleFileUploadFinished(f)
            }
            if (e !== 0 && isNaN(b) === false && isNaN(e) === false) {
                i = (b / e) * 100
            }
            k.data("totalSize", e);
            k.data("bytesUploaded", b);
            d = k.data("isFileNameRendered");
            c = k.data("fileName");
            h = k.data("originalFileName");
            k.igProgressBar("option", "value", i);
            m.text(j._formatFileSize(b) + "/" + j._formatFileSize(e));
            if (d !== true) {
                k.data("isFileNameRendered", true);
                j._renderFileName(f, e)
            }
            if (g) {
                j._trigger(j.events.fileUploaded, null, {
                    fileId: f,
                    filePath: h,
                    totalSize: b
                });
                if (j._checkMaxUploadingFilesCount() === false) {
                    j._disableBrowseButton(true);
                    return
                }
            }
        },
        _formatURL: function (c, b) {
            if (c.indexOf("?") === -1) {
                c += "?"
            }
            c += b;
            return c
        },
        _showHideIcons: function (d) {
            var b = this.fileInfoData.filesInfo, c;
            for (c in b) {
                if (b[c] !== undefined) {
                    a("#" + this._id("_icn", c)).css(d)
                }
            }
        },
        _setWidthHeightAllUploads: function (f, d) {
            var b = this.fileInfoData.filesInfo, e = ((d) ? "height" : "width"), c;
            for (c in b) {
                if (b[c] !== undefined) {
                    a("#" + this._id("_snglpbar", c)).igProgressBar("option", e, f)
                }
            }
        },
        _setOption: function (b, e) {
            var d = this.options.mode, c = this.options.autostartupload;
            a.Widget.prototype._setOption.apply(this, arguments);
            switch (b) {
                case"width":
                    this.container().width(e);
                    a("#" + this._id("_bmncntr")).width(e);
                    this._reRenderFileSizeMetrics();
                    this._reRenderFileNames();
                    break;
                case"height":
                    this.container().height(e);
                    a("#" + this._id("_bmncntr")).height(e);
                    break;
                case"labelUploadButton":
                    a("#" + this._id("_ibb")).igBrowseButton("option", "labelText", e);
                    break;
                case"labelAddButton":
                    a("#" + this._id("_bb")).igBrowseButton("option", "labelText", e);
                    break;
                case"labelClearAllButton":
                    a("#" + this._id("_clrabtn")).igButton("option", "labelText", e);
                    break;
                case"labelSummaryTemplate":
                case"labelSummaryProgressBarTemplate":
                    this._spbRenderProgress();
                    break;
                case"labelShowDetails":
                case"labelHideDetails":
                    this._setShowHideDetailsButtonText(a("#" + this._id("_shdbtn")).is("hidden"));
                    a("#" + this._id("_shdbtn")).text(e);
                    break;
                case"labelSummaryProgressButtonCancel":
                    if (this.spbButtonMode === this.summaryButtonModes.cancel) {
                        a("#" + this._id("_spbtncncl")).igButton("option", "labelText", e)
                    }
                    break;
                case"labelSummaryProgressButtonContinue":
                    if (this.spbButtonMode === this.summaryButtonModes.startupload) {
                        a("#" + this._id("_spbtncncl")).igButton("option", "labelText", e)
                    }
                    break;
                case"labelSummaryProgressButtonDone":
                    if (this.spbButtonMode === this.summaryButtonModes.done) {
                        a("#" + this._id("_spbtncncl")).igButton("option", "labelText", e)
                    }
                    break;
                case"showFileExtensionIcon":
                    this._showHideIcons({
                        display: ((!e) ? "none" : "block")
                    });
                    break;
                case"fileSizeMetric":
                    this._reRenderFileSizeMetrics();
                    break;
                case"fileSizeDecimalDisplay":
                    this._reRenderFileSizeMetrics();
                    break;
                case"maxUploadedFiles":
                    this._disableBrowseButton(!this._checkMaxUploadingFilesCount());
                    break;
                case"mode":
                    if (d !== e) {
                        this._destroyMarkup();
                        this._create()
                    }
                    break;
                case"disabled":
                    this._disableBrowseButton(e);
                    break;
                case"autostartupload":
                    if (e === true && e !== c) {
                        this._spbSubmitAllButton()
                    }
                    break
            }
        },
        _reRenderFileSizeMetrics: function () {
            var c = this.fileInfoData.filesInfo, g = c.length, f, b = 0, k = this, e, d, h, n, m, j = 0;
            for (f = 0; f < g; f++) {
                n = a("#" + k._id("_pbrflsz", f));
                if (n.length === 0) {
                    continue
                }
                e = c[f].sizeBytes;
                b = c[f].uploadedBytes;
                m = a("#" + k._id("_snglpbar", f));
                if (e !== 0 && isNaN(b) === false && isNaN(e) === false) {
                    j = (b / e) * 100
                }
                d = m.data("fileName");
                h = m.data("originalFileName");
                n.text(k._formatFileSize(b) + "/" + k._formatFileSize(e));
                m.data("isFileNameRendered", true);
                k._renderFileName(f, e);
                a("#" + k._id("_summpbrlbl_1")).width(a("#" + this._id("_summpbar")).width())
            }
            this._spbRenderProgress()
        },
        _destroyMarkup: function () {
            var d = a("#" + this._id("_ibb")), c = a("#" + this._id("_bb")), b = a("#" + this._id("_bmncntr"));
            this.originalElement.show().unwrap();
            d.igBrowseButton("destroy");
            c.igBrowseButton("destroy");
            d.remove();
            b.remove();
            this.container().remove()
        },
        destroy: function () {
            this._destroyMarkup();
            a.Widget.prototype.destroy.apply(this, arguments)
        },
        _getFileSize: function (e, g) {
            var i = this, h = this.options, d = this._id("_fszfrm", e), b = a("#" + i._id("_frm", e) + "_if"), f = this._id("_fszifrm", e), c, j = i._formatURL(h.uploadUrl, a.param({
                key: g,
                command: "fileSize"
            }));
            a('<iframe src="javascript:false;" id="' + f + '" name="' + f + '"></iframe>').appendTo(a(document.body)).css({
                display: "none"
            });
            a('<form method="post" id="' + d + '" target="' + f + '" enctype="multipart/form-data"></form>').appendTo(a(document.body)).css({
                display: "none"
            }).attr("action", j);
            c = a("#" + d);
            b.appendTo(c);
            c.submit();
            c.remove();
            a("#" + f).ready(function () {
                setTimeout(function () {
                    i._sendRequestFileSize(e, g)
                }, i._const.timeoutGetFileSize)
            });
            b.appendTo(a("#" + i._id("_frm", e)))
        },
        _removeGetFileSizeHTML: function (c) {
            var d = a("#" + this._id("_fszifrm", c)), b = a("#" + this._id("_fszfrm", c));
            d.remove();
            b.remove()
        },
        _sendRequestFileSize: function (d, e) {
            var g = this, j = g._id("_snglpbar", d), i = a("#" + j), f = this.options, c = 0, b = this.fileInfoData, h = this._getFileInfo(d);
            if (h.sizeBytes !== 0) {
                return
            }
            a.ajaxQueue("uploadrequestsqueue", {
                url: g._formatURL(f.progressUrl, a.param({
                    key: e,
                    command: "fileSize"
                })),
                dataType: "json",
                cache: false,
                success: function (k) {
                    c = parseInt(k.fileSize, 10);
                    if (isNaN(c) === true) {
                        return
                    }
                    i.data("totalSize", c);
                    if (h !== null) {
                        h.sizeBytes = c;
                        b.fileSizeTotal += c;
                        g._spbRenderProgress()
                    }
                    g._renderStatus(d, 0, c, false, false);
                    g._removeGetFileSizeHTML(d)
                },
                error: function () {
                    g._setError(f.errorMessageAJAXRequestFileSize, g._const.clientSideErrorCode.ajaxErrorRequestFileSize, "clientside");
                    g._removeGetFileSizeHTML(d)
                }
            })
        },
        _onShowHideDetailsClick: function () {
            var e = this, b = a("#" + e._id("_fc")), d = b.css("margin-top"), c = b.css("margin-bottom");
            if ((a.browser.msie === true && a.browser.version.slice(0, 1) === "6") || (a.browser.msie === true && a.browser.version.slice(0, 1) === "7")) {
                e._setShowHideDetailsButtonText(b.is(":hidden"));
                if (b.is(":hidden")) {
                    b.show();
                    e._reRenderFileNames()
                } else {
                    b.hide()
                }
                e._setShowHideDetailsButtonText(b.is(":hidden"))
            } else {
                b.css({
                    "margin-top": 0,
                    "margin-bottom": 0
                });
                b.slideToggle(e._const.showHideDetailsAnimationTimeout, function () {
                    b.css({
                        "margin-top": d,
                        "margin-bottom": c
                    });
                    e._setShowHideDetailsButtonText(b.is(":hidden"));
                    if (b.is(":hidden") === false) {
                        e._reRenderFileNames()
                    }
                })
            }
        },
        _reRenderFileNames: function () {
            var b = this.fileInfoData.filesInfo, d = b.length, c, e;
            for (c = 0; c < d; c++) {
                e = a("#" + this._id("_snglpbar", c)).data("originalFileName");
                a("#" + this._id("_pbrflnm", c)).text(e);
                this._renderFileName(c, 0, e)
            }
        },
        _setShowHideDetailsButtonText: function (b) {
            var c = this.options, d = a("#" + this._id("_shdbtn"));
            if (b) {
                d.text(c.labelShowDetails);
                d.attr("title", a.ig.Upload.locale.titleShowDetailsButton)
            } else {
                d.text(c.labelHideDetails);
                d.attr("title", a.ig.Upload.locale.titleHideDetailsButton)
            }
        },
        getFileInfoData: function () {
            return this.fileInfoData
        },
        cancelAll: function () {
            var d, c = this.fileInfoData, j = c.uploadingIDs, g = j.length, h = c.pendingQueueIDs, f = h.length, b = c.batch, e = b.length;
            this.allCancelled = true;
            for (d = 0; d < g; d++) {
                if (j[d] !== undefined) {
                    this.cancelUpload(j[d])
                }
            }
            for (d = 0; d < f; d++) {
                if (h[d] !== undefined) {
                    this.cancelUpload(h[d])
                }
            }
            for (d = 0; d < e; d++) {
                if (b[d] !== undefined) {
                    this.cancelUpload(b[d])
                }
            }
            j = [];
            h = [];
            b = [];
            a("#" + this._id("_spbtncncl")).data("ids", []);
            this.allCancelled = false
        },
        _submitAllFormsUpload: function () {
            var g = this, b, c, d = this.fileInfoData.batch, e = d.length, f = [];
            for (b = 0; b < e; b++) {
                c = d[b];
                if (g._checkCanUpload()) {
                    g.startUpload(c)
                } else {
                    g._addPendingId(c);
                    f.push(c)
                }
            }
            this.fileInfoData.batch = []
        },
        _spbRenderInit: function () {
            var h = this, f = this.options, b = h.css, s = this._id("_fu"), e = f.labelSummaryProgressButtonContinue, n = this._id("_spbcntr"), l = this._id("_summpbrlbl"), k = this._id("_summpbar"), q = this._id("_summplbl"), i = this._id("_shdbtn"), m = this._id("_spbtncncl"), p = this._id("_spdtlbtn"), j, d = "", c, g = "progressData", r = a.ig.Upload.locale.titleSummaryProgressButtonContinue;
            d += '<div id="$summaryProgressContainerId$">';
            d += '   <div  class="' + b.summaryInformationContainerClass + '">';
            d += '       <span id="$summaryProgressLabelId$" class="' + b.summaryUploadedFilesLabelClass + '"></span><a href="javascript:void(0);" id="$showHideDetailsId$" class="' + b.summaryShowHideDetailsButtonClass + '">$labelShowHideDetails$</a>';
            d += "   </div>";
            d += '   <div class="' + b.clearClass + '">';
            d += '       <button id="$summaryProgressButtonCancelId$"></button>';
            d += '       <div id="$summaryProgressBarId$"></div>';
            d += "   </div>";
            d += "</div>";
            d = d.replace("$summaryProgressContainerId$", n).replace("$summaryProgressLabelId$", q).replace("$summaryProgressDetailsButtonId$", p).replace("$summaryProgressBarId$", k).replace("$showHideDetailsId$", i).replace("$labelShowHideDetails$", f.labelHideDetails).replace("$labelSummaryProgressButtonCancel$", f.labelSummaryProgressButtonCancel).replace("$summaryProgressButtonCancelId$", m);
            a(d).appendTo(a("#" + s));
            c = {
                IDs: {},
                CurrentUploadedFiles: 0,
                CurrentUploadedSize: 0,
                TotalFileSize: 0,
                TotalFiles: 0,
                UploadingFiles: 0
            };
            a("#" + n).data(g, c).addClass(b.summaryProgressContainerClass + " " + b.clearClass);
            j = a("#" + k);
            a('<span id="' + l + '"></span>').addClass(b.summaryProgressbarLabelClass).appendTo(j.igProgressBar({
                animate: h._const.isProgressBarAnimationEnabled,
                animateTimeout: h._const.animateProgressBarInterval,
                range: h._const.isProgressBarRange,
                value: 0
            }).addClass(b.summaryProgressBarClass));
            a('<div id="' + l + '_1"></div>').width(j.width()).addClass(b.summaryProgressBarSecondaryLabel).appendTo(a("#" + this._id("_summpbar_progress")).addClass(b.summaryProgressBarInnerProgress));
            a("#" + i).bind({
                click: function (o) {
                    o.preventDefault();
                    h._onShowHideDetailsClick()
                }
            });
            if (a.ig.Upload.locale.titleHideDetailsButton !== false) {
                a("#" + i).attr("title", a.ig.Upload.locale.titleHideDetailsButton)
            }
            if (f.autostartupload) {
                e = f.labelSummaryProgressButtonCancel;
                r = a.ig.Upload.locale.titleSummaryProgressButtonCancel;
                this.spbButtonMode = this.summaryButtonModes.cancel
            }
            a("#" + m).igButton({
                labelText: e,
                title: r,
                disabled: false,
                click: function (o) {
                    o.preventDefault();
                    h._spbOnClickButton(o)
                }
            }).addClass(b.summaryButtonClass)
        },
        _spbRenderProgress: function () {
            var e = this.options, f = a("#" + this._id("_summpbar")), i = a("#" + this._id("_summplbl")), g = a("#" + this._id("_summpbrlbl")), h = a("#" + this._id("_summpbrlbl_1")), j = "", k = 0, b = this.fileInfoData, c = b.fileSizeTotal, d = b.fileSizeUploaded;
            if (c !== 0 && isNaN(c) === false) {
                k = (d / c) * 100
            } else {
                if (c === 0) {
                    k = 0
                }
            }
            if (b.countUploadingFiles === b.countTotalFiles) {
                if (b.countTotalFiles === 0) {
                    k = 0
                } else {
                    k = 100
                }
                d = c
            }
            f.igProgressBar("option", "value", k);
            j = e.labelSummaryProgressBarTemplate.replace("{0}", this._formatFileSize(d)).replace("{1}", this._formatFileSize(c)).replace("{2}", k);
            i.html(e.labelSummaryTemplate.replace("{0}", b.countUploadingFiles).replace("{1}", b.countTotalFiles));
            g.text(j);
            h.text(j)
        },
        _spbOnClickButton: function (b) {
            var d = this.summaryButtonModes, c = this.spbButtonMode;
            b.preventDefault();
            if (c === d.cancel) {
                this._trigger(this.events.cancelAllClicked, b);
                this.cancelAll()
            } else {
                if (c === d.startupload) {
                    this._spbSubmitAllButton()
                }
            }
        },
        _spbSubmitAllButton: function () {
            this._submitAllFormsUpload();
            this._spbCheckModeButton()
        },
        _spbCheckModeButton: function () {
            var b = this.fileInfoData;
            if (this.options.autostartupload) {
                if (b.pendingQueueIDs.length > 0 || b.uploadingIDs.length > 0) {
                    this._spbSetCancelButton()
                } else {
                    this._spbSetButtonDone()
                }
            } else {
                if (b.pendingQueueIDs.length === 0 && b.uploadingIDs.length === 0) {
                    if (b.batch.length > 0) {
                        this._spbSetContinueButton()
                    } else {
                        this._spbSetButtonDone()
                    }
                } else {
                    this._spbSetCancelButton()
                }
            }
        },
        _spbSetButtonDone: function () {
            var c = this.options, b = a("#" + this._id("_spbtncncl"));
            this.spbButtonMode = this.summaryButtonModes.done;
            b.igButton("option", "labelText", c.labelSummaryProgressButtonDone).igButton("option", "title", a.ig.Upload.locale.titleSummaryProgressButtonDone).igButton("option", "disabled", true)
        },
        _spbSetContinueButton: function () {
            var c = this.options, b = a("#" + this._id("_spbtncncl"));
            this.spbButtonMode = this.summaryButtonModes.startupload;
            b.igButton({
                title: a.ig.Upload.locale.titleSummaryProgressButtonContinue,
                labelText: c.labelSummaryProgressButtonContinue,
                disabled: false
            })
        },
        _spbSetCancelButton: function () {
            var b = a("#" + this._id("_spbtncncl"));
            this.spbButtonMode = this.summaryButtonModes.cancel;
            b.igButton("option", "labelText", this.options.labelSummaryProgressButtonCancel).igButton("option", "title", a.ig.Upload.locale.titleSummaryProgressButtonCancel).igButton("option", "disabled", false)
        },
        _getFileInfo: function (c) {
            var b = this.fileInfoData.filesInfo[c];
            if (b === undefined || b === null) {
                return null
            }
            return b
        },
        _formatFilePath: function (b) {
            var c = b.lastIndexOf("/");
            b = b.replace(/(\/|\\)$/, "");
            if (c === -1) {
                c = b.lastIndexOf("\\")
            }
            return b.substring(c + 1)
        },
        _checkCanUpload: function () {
            var e = this.options, c = this.fileInfoData, b = true, d = e.maxSimultaneousFilesUploads;
            if (e.mode === "multiple" && d !== null && c.uploadingIDs.length >= d) {
                b = false;
                if (d <= 0) {
                    this._setError(e.errorMessageMaxSimultaneousFiles, this._const.clientSideErrorCode.checkCanUpload, "clientside")
                }
            }
            return b
        },
        _addPendingId: function (b) {
            this.fileInfoData.pendingQueueIDs.push(b)
        },
        _removePendingId: function (b) {
            var d = this.fileInfoData.pendingQueueIDs, c;
            if (b !== undefined && b !== null) {
                c = b;
                this.fileInfoData.pendingQueueIDs = this._removeElementFromArray(d, c)
            } else {
                c = d.shift();
                if (c === undefined) {
                    c = null
                }
            }
            return c
        },
        _addUploadingID: function (b) {
            this.fileInfoData.uploadingIDs.push(b)
        },
        _removeUploadingID: function (b) {
            this.fileInfoData.uploadingIDs = this._removeElementFromArray(this.fileInfoData.uploadingIDs, b)
        },
        _addIDBatch: function (b) {
            this.fileInfoData.batch.push(b)
        },
        _removeIDBatch: function (b) {
            this.fileInfoData.batch = this._removeElementFromArray(this.fileInfoData.batch, b)
        },
        _submitNextPendingId: function () {
            var c = this, b;
            if (c._checkCanUpload() === true) {
                b = c._removePendingId();
                if (b !== null) {
                    c.startUpload(b)
                }
            }
        },
        _randomString: function (f) {
            var b = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz", d = "", c, e;
            for (c = 0; c < f; c++) {
                e = Math.floor(Math.random() * b.length);
                d += b.substring(e, e + 1)
            }
            return d
        },
        _cutFilePath: function (b, d) {
            var c = b.length;
            if (c <= d) {
                return b
            }
        },
        _getOnlyFileName: function (c) {
            var b = "";
            if (c === null || c === undefined) {
                return ""
            }
            if (c.indexOf("/") !== -1) {
                b = "/"
            } else {
                if (c.indexOf("\\") !== -1) {
                    b = "\\"
                }
            }
            if (b !== "") {
                c = c.substr(c.lastIndexOf(b) + 1)
            }
            return c
        },
        _getFileExtension: function (b) {
            return b.substring(b.lastIndexOf(".") + 1)
        },
        _validateFileExtension: function (d) {
            var c = "", b = this.options.allowedExtensions;
            if (b.length === 0) {
                return true
            }
            c = d.substring(d.lastIndexOf(".") + 1);
            return a.inArray(c, b) >= 0
        },
        _getFileExtensionIconPath: function (c) {
            var b = this.options.fileExtensionIcons, d, e = "", f = b.length;
            c = String(c).toLowerCase();
            for (d = 0; d < f; d++) {
                if (b[d].ext !== undefined && (b[d].ext === c || a.inArray(c, b[d].ext) !== -1)) {
                    e = b[d].css;
                    break
                } else {
                    if (e === "" && (b[d].def === true || (a.isArray(b[d].ext) && b[d].ext.length === 0))) {
                        e = b[d].css
                    }
                }
            }
            return e
        },
        _setError: function (e, c, d, g) {
            var f = this.options, b = this._const.errorCode;
            if (g === undefined) {
                g = ""
            }
            if (d === "serverside") {
                switch (c) {
                    case b.MimeTypeValidation:
                        e = f.errorMessageValidatingFileExtension;
                        break;
                    case b.FileSizeExceeded:
                        e = f.errorMessageMaxFileSizeExceeded;
                        break
                }
            }
            this._trigger(this.events.onError, null, {
                errorCode: c,
                errorMessage: e,
                errorType: d,
                serverMessage: g
            })
        },
        _formatFileSize: function (d) {
            var b = this.options.fileSizeMetric, c = d;
            switch (b) {
                case"bytes":
                    c = d + "B";
                    break;
                case"kbytes":
                    c = this._convertToKBytes(d);
                    break;
                case"mbytes":
                    c = this._convertToMBytes(d);
                    break;
                case"gbytes":
                    c = this._convertToGBytes(d);
                    break;
                case"auto":
                    if (d < 1024) {
                        c = d + "B"
                    } else {
                        if (d < 1024 * 1024) {
                            c = this._convertToKBytes(d)
                        } else {
                            if (d < 1024 * 1024 * 1024) {
                                c = this._convertToMBytes(d)
                            } else {
                                c = this._convertToGBytes(d)
                            }
                        }
                    }
                    break;
                default:
                    break
            }
            return c
        },
        _convertToKBytes: function (c) {
            var b = c / 1024;
            return b.toFixed(this.options.fileSizeDecimalDisplay) + "KB"
        },
        _convertToMBytes: function (c) {
            var b = c / (1024 * 1024);
            return b.toFixed(this.options.fileSizeDecimalDisplay) + "MB"
        },
        _convertToGBytes: function (c) {
            var b = c / (1024 * 1024 * 1024);
            return b.toFixed(this.options.fileSizeDecimalDisplay) + "GB"
        },
        _removeElementArrayById: function (b, c) {
            if (b === undefined || b === null) {
                return []
            }
            return a.grep(b, function (d) {
                return (d.id !== c)
            })
        },
        _removeElementFromArray: function (b, c) {
            if (b === undefined || b === null) {
                return []
            }
            return a.grep(b, function (d) {
                return (d !== c)
            })
        }
    });
    a.extend(a.ui.igUpload, {
        version: "12.2.20122.1021"
    })
}(jQuery));
( function (a) {
    a(document).ready(function () {
        var b = a("#__ig_wm__").length > 0 ? a("#__ig_wm__") : a('<div id="__ig_wm__"></div>').appendTo(document.body);
        b.css({
            position: "fixed",
            bottom: 0,
            right: 0,
            zIndex: 1000
        }).addClass("ui-igtrialwatermark")
    })
}(jQuery));