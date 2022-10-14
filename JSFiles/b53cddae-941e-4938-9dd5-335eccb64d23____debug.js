Type.registerNamespace("Telerik.Sitefinity.Modules.Libraries.Web.UI.Designers");

Telerik.Sitefinity.Modules.Libraries.Web.UI.Designers.InsertEditImageView = function (element) {
    Telerik.Sitefinity.Modules.Libraries.Web.UI.Designers.InsertEditImageView.initializeBase(this, [element]);
    this._extensionLabel = null;
    this._dateLabel = null;
    this._dateFormat = "dddd, MMM d, yyyy";
    this._sizeLabel = null;
    this._changeImageButton = null;
    this._editImageButton = null;
    this._titleTxt = null;
    this._altTextField = null;
    this._imageElement = null;
    this._imageId = null;
    this._providerName = "";
    this._image = null;
    this._src = "";
    this._sizesChoiceField = null;
    this._customImageSizeViewControl = null;
    this._alignment = "None";
    this._openOriginalChoiceField = null;
    this._imageServiceUrl = "";
    this._clientManager = null;
    this._isUploaded = false;
    this._regularExpression = null;
    this._trim = true;
    this._toLower = true;
    this._replaceWith = null;
    this._windowManager = null;
    this._imageEditorDialogUrl = "";
    this._urlVersionQueryParam = "sfvrsn";
    this._thumbnailExtensionPrefix = "tmb-";
    this._marginExpander = null;
    this._marginTopField = null;
    this._marginBottomField = null;
    this._marginLeftField = null;
    this._marginRightField = null;
    this._marginSection = null;
    this._onLoadDelegate = null;
    this._marginExpanderClickDelegate = null;
    this._selectedThumbnailName = null;
    this._tmbUrl = "";
    this._customSizeOptionValue = "--custom--size--";
    this._libraryType = null;
    this._thumbnailServiceUrl = null;
    this._viewType = null;
}

Telerik.Sitefinity.Modules.Libraries.Web.UI.Designers.InsertEditImageView.prototype = {
    initialize: function () {
        Telerik.Sitefinity.Modules.Libraries.Web.UI.Designers.InsertEditImageView.callBaseMethod(this, "initialize");
        this._attachHandlers(true);
        this._onLoadDelegate = Function.createDelegate(this, this._onLoad);
        Sys.Application.add_load(this._onLoadDelegate);

        this._marginExpanderClickDelegate = Function.createDelegate(this, this._marginExpanderClickHandler);
        $addHandler(this.get_marginExpander(), "click", this._marginExpanderClickDelegate);
    },

    dispose: function () {
        this._attachHandlers(false);
        if (this._onLoadDelegate) {
            Sys.Application.remove_load(this._onLoadDelegate);
            delete this._onLoadDelegate;
        }

        if (this._marginExpanderClickDelegate) {
            if (this.get_marginExpander()) {
                $removeHandler(this.get_marginExpander(), "click", this._marginExpanderClickDelegate);
            }
            delete this._marginExpanderClickDelegate;
        }

        Telerik.Sitefinity.Modules.Libraries.Web.UI.Designers.InsertEditImageView.callBaseMethod(this, "dispose");
    },
    _onLoad: function () {
        setTimeout(function () { dialogBase.resizeToContent(); }, 500);
    },
    _attachHandlers: function (toAttach) {
        this._attachButtonHandlers(toAttach);
        this._attachChooseSizeHandlers(toAttach);

        if (toAttach) {
            this._closeDialogExtensionDelegate = Function.createDelegate(this, this._closeDialogExtension);
        }
        else {
            if (this._closeDialogExtensionDelegate)
                delete this._closeDialogExtensionDelegate;
        }
    },
    _attachButtonHandlers: function (toAttach) {
        var changeImgBtn = this.get_changeImageButton();
        var editImgBtn = this.get_editImageButton();
        if (toAttach) {
            this._changeImageDelegate = Function.createDelegate(this, this._changeImageClick);
            $addHandler(changeImgBtn, "click", this._changeImageDelegate);

            if (editImgBtn) {
                this._editImageDelegate = Function.createDelegate(this, this._editImageClick);
                $addHandler(editImgBtn, "click", this._editImageDelegate);
            }
        }
        else {
            if (this._changeImageDelegate) {
                $removeHandler(changeImgBtn, "click", this._changeImageDelegate);
                delete this._changeImageDelegate;
            }

            if (this._editImageDelegate) {
                $removeHandler(editImgBtn, "click", this._editImageDelegate);
                delete this._editImageDelegate;
            }
        }
    },
    _attachChooseSizeHandlers: function (toAttach) {
        var sizesChoiceField = this.get_sizesChoiceField();
        if (toAttach) {
            this._sizesChoiceFieldValueChangedDelegate = Function.createDelegate(this, this._sizesChoiceFieldValueChangedHandler);
            sizesChoiceField.add_valueChanged(this._sizesChoiceFieldValueChangedDelegate);
        }
        else {
            if (this._sizesChoiceFieldValueChangedDelegate) {
                sizesChoiceField.remove_valueChanged(this._sizesChoiceFieldValueChangedDelegate);
                delete this._sizesChoiceFieldValueChangedDelegate;
            }
        }
    },

    _changeImageClick: function (args) {
        this.raiseEvent("changeImageClick");
    },

    _editImageClick: function (args) {
        if (dialogBase) {
            dialogBase.setWndWidth("1000px");
            dialogBase.setWndHeight("700px");
            var oWnd = dialogBase.get_radWindow();
            if (oWnd) {
                if ($(oWnd._popupElement).closest(".sfSelectorDialog").length > 0) {
                    oWnd._popupElement.style.top = "0";
                    oWnd._popupElement.style.left = "0";
                } else {
                    oWnd.center();
                    oWnd._popupElement.style.top = "50px";
                }
                oWnd.get_contentFrame().contentWindow.document.body.style.position = "static";
            }
        }
        this.openDialog("imageEditor", "?Id=" + this.get_imageId() + "&Status=Live&provider=" + this.get_providerName(), true);

        this.raiseEvent("editImageClick");
    },

    _sizesChoiceFieldValueChangedHandler: function (sender, args) {
        var selectedValue = sender.get_value();

        this._setEditImageButtonVisibility(selectedValue);

        if (selectedValue === this._customSizeOptionValue) {
            jQuery(this.get_customImageSizeViewControl().get_customImgSizeWrp()).show();
        } else {
            jQuery(this.get_customImageSizeViewControl().get_customImgSizeWrp()).hide();
        }

        if (dialogBase._implementsDesigner || dialogBase._hostedInRadWindow) {
            dialogBase.resizeToContent();
        }
    },

    _setEditImageButtonVisibility: function (selectedThumbnailValue) {
        var editImageBtnElement = this.get_editImageButton();
        if (editImageBtnElement) {
            var editImgBtn = jQuery("#" + editImageBtnElement.id);
            if (editImgBtn) {
                if (!selectedThumbnailValue || selectedThumbnailValue == "" || selectedThumbnailValue == this._customSizeOptionValue)
                    editImgBtn.show();
                else
                    editImgBtn.hide();
            }
        }
    },

    _checkSizeExists: function (choise) {
        var choices = this.get_sizesChoiceField().get_choices();
        for (var i = 0; i < choices.length; i++) {
            if (choise == choices[i].Value) return true;
        }
        return false;
    },

    _marginExpanderClickHandler: function (e) {
        jQuery(this.get_marginSection()).toggleClass("sfExpandedSection");
        dialogBase.resizeToContent();
    },

    //Properties START

    //gets the file extension label
    get_extensionLabel: function () { return this._extensionLabel; },
    set_extensionLabel: function (value) { this._extensionLabel = value; },

    //gets the size label
    get_sizeLabel: function () { return this._sizeLabel; },
    set_sizeLabel: function (value) { this._sizeLabel = value; },

    //gets the date label when the image was uploaded
    get_dateLabel: function () { return this._dateLabel; },
    set_dateLabel: function (value) { this._dateLabel = value; },

    //gets the dateFormat
    get_dateFormat: function () { return this._dateFormat; },
    set_dateFormat: function (value) { this._dateFormat = value; },

    //gets the button that changes the current image of the view
    get_changeImageButton: function () { return this._changeImageButton; },
    set_changeImageButton: function (value) { this._changeImageButton = value; },

    //gets the button that changes the current image of the view
    get_editImageButton: function () { return this._editImageButton; },
    set_editImageButton: function (value) { this._editImageButton = value; },

    //gets the input used for specifying the title
    get_titleTxt: function () { return this._titleTxt; },
    set_titleTxt: function (value) { this._titleTxt = value; },

    //gets the TextField used for setting the Alternate text of the image
    get_altTextField: function () { return this._altTextField; },
    set_altTextField: function (value) { this._altTextField = value; },

    //gets the TextField used for setting the top margin of the image
    get_marginTopField: function () { return this._marginTopField; },
    set_marginTopField: function (value) { this._marginTopField = value; },

    //gets the TextField used for setting the bottom margin of the image
    get_marginBottomField: function () { return this._marginBottomField; },
    set_marginBottomField: function (value) { this._marginBottomField = value; },

    //gets the TextField used for setting the left margin of the image
    get_marginLeftField: function () { return this._marginLeftField; },
    set_marginLeftField: function (value) { this._marginLeftField = value; },

    //gets the TextField used for setting the right margin of the image
    get_marginRightField: function () { return this._marginRightField; },
    set_marginRightField: function (value) { this._marginRightField = value; },

    //gets the ChoicesField used for choosing image size
    get_sizesChoiceField: function () { return this._sizesChoiceField; },
    set_sizesChoiceField: function (value) { this._sizesChoiceField = value; },

    //gets a reference to the CustomImageSizeView component
    get_customImageSizeViewControl: function () { return this._customImageSizeViewControl; },
    set_customImageSizeViewControl: function (value) { this._customImageSizeViewControl = value; },

    //gets the client label manager that manages the localization strings 
    get_clientLabelManager: function () { return this._clientLabelManager; },
    set_clientLabelManager: function (value) { this._clientLabelManager = value; },

    //gets the window manager that manages window that contains the ImageEditor dialog
    get_windowManager: function () { return this._windowManager; },
    set_windowManager: function (value) { this._windowManager = value; },

    //gets the image element
    get_imageElement: function () { return this._imageElement; },
    set_imageElement: function (value) { this._imageElement = value; },

    get_src: function () { return this._src; },
    set_src: function (value) {
        this._src = this.appendRnd(value);
        this.get_imageElement().src = this._src;
    },

    appendRnd: function (value) {
        var appender = "?";
        var qIndex = value.lastIndexOf("?");
        if (qIndex > 0) {
            var query = value.substring(qIndex + 1);
            var queryString = new Telerik.Sitefinity.Web.SitefinityJS.Utility.Querystring(query);
            if (queryString.contains(this._urlVersionQueryParam)) {
                queryString.set(this._urlVersionQueryParam, Math.random());
                return (value.substring(0, qIndex)) + queryString.toString(true);
            }
            appender = "&";
        }
        return value + "?" + this._urlVersionQueryParam + "=" + Math.random();
    },

    //gets the alignment of the image
    get_alignment: function () { return this._alignment; },
    set_alignment: function (value) {
        jQuery('input[value="' + value + '"]').attr("checked", "checked");
        this._alignment = value;
    },

    get_providerName: function () { return this._providerName; },
    set_providerName: function (value) {
        this._providerName = value;
    },

    //gets the Id of the edited image
    get_imageId: function () { return this._imageId; },
    set_imageId: function (value, forceRefreshUI) {
        if (value != this._imageId) {
            this._imageId = value;
            this.refreshUI(forceRefreshUI);
        }
    },

    get_tmbUrl: function () { return this._tmbUrl; },
    set_tmbUrl: function (value) {
        this._tmbUrl = value;
    },

    //gets the edited image
    get_image: function () { return this._image; },
    set_image: function (value) {
        this._image = value;
        //this.get_sizesChoiceField().set_value("original");
        this.readDataFromImage(value);
    },

    get_openOriginalChoiceField: function () { return this._openOriginalChoiceField; },
    set_openOriginalChoiceField: function (value) { this._openOriginalChoiceField = value; },

    //gets the client WebService manager
    get_clientManager: function () {
        if (this._clientManager == null) this._clientManager = new Telerik.Sitefinity.Data.ClientManager();
        return this._clientManager;
    },

    //gets a bool value that indicates whether an image has been uploaded
    get_isUploaded: function () { return this._isUploaded; },
    set_isUploaded: function (value) { this._isUploaded = value; },

    //gets the margin section
    get_marginSection: function () {
        return this._marginSection;
    },
    set_marginSection: function (value) {
        this._marginSection = value;
    },

    //gets the margin expander
    get_marginExpander: function () {
        return this._marginExpander;
    },
    set_marginExpander: function (value) {
        this._marginExpander = value;
    },

    //gets the selected thumbnail name
    get_selectedThumbnailName: function () {
        return this._selectedThumbnailName;
    },
    set_selectedThumbnailName: function (value) {
        this._selectedThumbnailName = value;
    },

    // gets the control view type
    get_viewType: function () {
        return this._viewType;
    },
    // sets the control view type
    set_viewType: function (value) {
        this._viewType = value;
    },

    // gets the library type
    get_libraryType: function () {
        return this._libraryType;
    },
    set_libraryType: function (value) {
        this._libraryType = value;
    },

    // gets the thumbnail service Url
    get_thumbnailServiceUrl: function () {
        return this._thumbnailServiceUrl;
    },
    set_thumbnailServiceUrl: function (value) {
        this._thumbnailServiceUrl = value;
    },

    //Properties END

    //Methods START

    setSize: function (value, isInBytes) {
        //by default the value is sent in Kb
        if (isInBytes) value = parseInt(value / 1024);

        if (value < 1024) this.get_sizeLabel().innerHTML = value + " " + this.get_clientLabelManager().getLabel("LibrariesResources", "Kb");
        else this.get_sizeLabel().innerHTML = parseInt(value / 1024) + " " + this.get_clientLabelManager().getLabel("LibrariesResources", "Mb");
    },
    setExtension: function (value) {
        this.get_extensionLabel().innerHTML = value;
    },
    setDate: function (value) {
        var realDate = (typeof (value) === 'string')
                ? new Date(value.match(/\d+/)[0] * 1)
                : value;
        this.get_dateLabel().innerHTML = realDate.format(this.get_dateFormat());
    },
    setTitle: function (value) {
        this.get_titleTxt().set_value(value);
    },
    setAltText: function (value) {
        this.get_altTextField().set_value(value);
    },
    setOpenOriginalImage: function (state) {
        this.get_openOriginalChoiceField().set_value(state);
    },
    setImageProcessingMethod: function (value) {
        this.get_customImageSizeViewControl().setImageProcessingMethod(value);
    },
    setMethodControlsProperties: function (methodControlsProperties) {
        this.get_customImageSizeViewControl().setMethodControlsProperties(methodControlsProperties);
    },
    hideOpenOriginalImage: function (hide) {
        if (hide)
            jQuery(this.get_openOriginalChoiceField().get_element()).hide()
        else
            jQuery(this.get_openOriginalChoiceField().get_element()).show()
    },
    setMargins: function (top, right, bottom, left) {
        top = parseInt(top);
        if (isNaN(top)) top = null;
        right = parseInt(right);
        if (isNaN(right)) right = null;
        bottom = parseInt(bottom);
        if (isNaN(bottom)) bottom = null;
        left = parseInt(left);
        if (isNaN(left)) left = null;
        if (!(top == null && bottom == null && left == null && right == null)) {
            jQuery(this.get_marginSection()).addClass("sfExpandedSection");
        }
        this.get_marginTopField().set_value(top);
        this.get_marginRightField().set_value(right);
        this.get_marginBottomField().set_value(bottom);
        this.get_marginLeftField().set_value(left);
    },

    setThumbnailName: function (thumbnailName) {
        if (thumbnailName) {
            this.set_selectedThumbnailName(thumbnailName);
            this.get_sizesChoiceField().set_value(thumbnailName);
        }
    },

    getThumbnailName: function () {
        var result = this.get_sizesChoiceField().get_value();
        if (result === this._customSizeOptionValue) {
            return "";
        }
        return result;
    },

    selectSizeOptionCustom: function () {
        this.set_selectedThumbnailName(this._customSizeOptionValue);
    },

    validateImageData: function () {
        var thumbnailName = this.get_sizesChoiceField().get_value();		
        if (thumbnailName == this._customSizeOptionValue) {
            return this.get_customImageSizeViewControl().validateCustomSizeMethodProperties();
        }

        return true;
    },

    getImageData: function () {
        var thumbnailName = this.get_sizesChoiceField().get_value();

        // DisplayMode following the enum Telerik.Sitefinity.Web.UI.PublicControls.Enums.ImageDisplayMode
        var displayMode = "Original";
        var method = "";
        var customSizeMethodProperties = "";
        var customSizeMethodPropertiesDictionary = {};
        if (thumbnailName) {
            if (thumbnailName === this._customSizeOptionValue) {
                displayMode = "Custom";

                var customSizeMethodPropertiesData = this.get_customImageSizeViewControl().getCustomSizeMethodProperties();
                method = customSizeMethodPropertiesData.Method;
                customSizeMethodProperties = customSizeMethodPropertiesData.CustomSizeMethodProperties;
                customSizeMethodPropertiesDictionary = customSizeMethodPropertiesData.CustomSizeMethodPropertiesDictionary;
            }
            else
                displayMode = "Thumbnail"; 
        }

        var mediaUrl = this.get_src();
        var thumbnailUrl;
        if (thumbnailName && thumbnailName != "" && thumbnailName != this._customSizeOptionValue) {
            thumbnailUrl = this.resolveThumbnailUrl(thumbnailName);
        }
        else {
            thumbnailName = "";
        }

        return {
            Alignment: jQuery('input:checked[name="radiosAlignment"]').attr('value'),
            VerticalAlign: "",
            AlternateText: this.get_altTextField().get_value(),
            Title: this.get_titleTxt().get_value(),
            DisplayMode: displayMode,
            CustomSizeMethodProperties: customSizeMethodProperties,
            CustomSizeMethodPropertiesDictionary: customSizeMethodPropertiesDictionary,
            Method: method,
            Width: 0,
            Height: 0,
            ThumbnailName: thumbnailName,
            ImageId: this.get_imageId(),
            ThumbnailUrl: thumbnailUrl,
            MediaUrl: mediaUrl,
            OpenOriginalImageOnClick: this.get_openOriginalChoiceField() && this.get_openOriginalChoiceField().get_value() === "true",
            MarginTop: this._getMarginFieldValue(this.get_marginTopField()),
            MarginLeft: this._getMarginFieldValue(this.get_marginLeftField()),
            MarginRight: this._getMarginFieldValue(this.get_marginRightField()),
            MarginBottom: this._getMarginFieldValue(this.get_marginBottomField())
        };
    },
    //reads data from an <img /> element or jQuery object
    readDataFromHTML: function (value) {
        if (value) {
            if (value.tagName && value.tagName.toLowerCase() == "img") {
                //read from HTML element
                this.set_src(value.getAttribute("src"));
                this.setAltText(value.getAttribute("alt"));
                this.setTitle(value.getAttribute("title"));
            }
            else {
                //read from jQuery object
                this.set_src(value.attr("src"));
                this.setAltText(value.attr("alt"));
                this.setTitle(value.attr("title"));
            }
        }
    },
    //reads data from image object (image data item)
    readDataFromImage: function (image) {
        if (image) {
            this.set_src(image.MediaUrl);
            this.setAltText(image.AlternativeText);
            this._imageId = image.Id;
            this.setTitle(image.Title);
            this.setExtension(image.Extension);
            this.setDate(image.DateCreated);
            this.setSize(image.TotalSize);
            this.bindThumbnailSizesChoiceFields();
            this.set_tmbUrl(image.ThumbnailUrl);
            this._setEditImageButtonVisibility(this.get_sizesChoiceField().get_value());
        }
    },
    //reads data from image object (image data item)
    readDataFromImageService: function (image) {
        if (image) {
            this.setExtension(image.Extension);
            this.setDate(image.DateCreated);
            this.setSize(image.TotalSize, true);
            this.set_src(image.MediaUrl);
            this.bindThumbnailSizesChoiceFields();
            this.set_tmbUrl(image.ThumbnailUrl);
            this._setEditImageButtonVisibility(this.get_sizesChoiceField().get_value());
        }
    },

    resolveThumbnailUrl: function (tmbName) {
        if (tmbName) {
            var tmbUrl = this.get_tmbUrl();
            if (tmbUrl && tmbUrl != "") {
                if (tmbName != "") {
                    //var re = new RegExp("\.tmb-[\w\d]*\.", "g");
                    //return tmbUrl.replace(re, ".tmb-" + tmbName + ".");
                    var parts = tmbUrl.split(".");
                    if (parts.length > 1) {
                        var url = "";
                        for (var i = 0; i < parts.length; i++) {
                            if (url.length > 0)
                                url = url + "."
                            if (parts[i].indexOf(this._thumbnailExtensionPrefix) == 0)
                                url = url + this._thumbnailExtensionPrefix + tmbName;
                            else
                                url = url + parts[i];
                        }
                        return url;
                    }
                }
                return tmbUrl;
            }
        }
        return this.get_src();
    },

    bindThumbnailSizesChoiceFields: function () {
        var that = this;

        this.getAvailableThumbnailProfilesAsync(function (profiles) {
            var selectThumbSizeField = that.get_sizesChoiceField();
            selectThumbSizeField.clearListItems();

            var choices = that.getThumbnailChoices(profiles);
            for (var i = 0; i < choices.length; i++) {
                selectThumbSizeField.addListItem(choices[i].key, choices[i].value);
            }

            selectThumbSizeField.set_value(that.get_selectedThumbnailName());
        });
    },

    getAvailableThumbnailProfilesAsync: function (callback) {
        var profiles = [];
        var requestUrl = String.format(
            "{0}/thumbnail-profiles/?libraryType={1}&viewType={2}",
            this.get_thumbnailServiceUrl(),
            this.get_libraryType(),
            this.get_viewType());

        jQuery.ajax({
            type: 'GET',
            url: requestUrl,
            processData: false,
            contentType: "application/json",
            success: function (data) {
                var result = [];
                for (var i = 0; i < data.Items.length; i++) {
                    var name = data.Items[i].Id;
                    var title = data.Items[i].Title;
                    result.push({ key: name, value: title });
                }
                profiles = result;
            },
            complete: function () {
                callback(profiles);
            }
        });
    },

    getThumbnailChoices: function (profiles) {
        var originalSizeChoice = { key: "", value: this.get_clientLabelManager().getLabel("LibrariesResources", "OriginalSize") };
        var customSizeChoice = { key: this._customSizeOptionValue, value: this.get_clientLabelManager().getLabel("ImagesResources", "CustomSize") };

        if (profiles[0] && profiles[0].key != originalSizeChoice.key && profiles[0].value != originalSizeChoice.value) {
            profiles.splice(0, 0, originalSizeChoice);
            profiles.push(customSizeChoice);
        } else if (profiles.length < 1) {
            profiles.push(originalSizeChoice);
            profiles.push(customSizeChoice);
        }

        return profiles;
    },

    refreshUI: function (forceRefresh) {
        if (forceRefresh || !this._image) {
            this._invokeGet();
        }
    },

    _invokeGet: function (arg) {
        var imageId = this.get_imageId();
        if (imageId && imageId != "00000000-0000-0000-0000-000000000000") {
            var url = this._imageServiceUrl + "/" + this.get_imageId() + "/?published=true&provider=" + this.get_providerName();
            var succeeded = Function.createDelegate(this, this._successGet);
            var failed = Function.createDelegate(this, this._failGet);
            this.get_clientManager().InvokeGet(url, [], [], succeeded, failed, arg, this);
        }
    },

    _successGet: function (arg, result, obj, context) {
        this._data = result;
        switch (arg) {
            case "upload":
                this._invokePut(result);
                break;
            default:
                this.readDataFromImageService(result.Item);
                break;
        }
    },

    _failGet: function (error, arg, context) {
        console.log(error.Detail);
        alert(error.Detail);
    },

    //request the image by Id, and on success uploads it with the new data: Title and AlternativeText
    uploadImage: function () {
        if (this.get_isUploaded() === true && this._image) {
            if (this._image.Title != this.get_titleTxt().get_value() || this._image.AlternativeText != this.get_altTextField().get_value()) {
                this._invokeGet("upload");
                return true;
            }
        }
        return false;
    },

    _getMarginFieldValue: function (field) {
        var val = parseInt(field.get_value());
        return isNaN(val) ? null : val;
    },

    _invokePut: function (data) {
        var imageData = this.get_image();
        data = this._updateAltAndTitle(data);
        var url = this._imageServiceUrl + "/parent/" + imageData.ParentId + "/00000000-0000-0000-0000-000000000000/?itemType=Telerik.Sitefinity.Libraries.Model.Image&parentItemType=Telerik.Sitefinity.Libraries.Model.Album&workflowOperation=Publish";
        var succeeded = Function.createDelegate(this, this._successPut);
        var failed = Function.createDelegate(this, this._failPut);
        this.get_clientManager().InvokePut(url, [], [], data, succeeded, failed, this);
    },

    _updateAltAndTitle: function (data) {
        data.Item.Id = data.Item.OriginalContentId;
        data.Item.OriginalContentId = "00000000-0000-0000-0000-000000000000";
        data.Item.Status = 0;
        data.Item.Title.PersistedValue = this.get_titleTxt().get_value();
        data.Item.AlternativeText.PersistedValue = this.get_altTextField().get_value();
        data.Item.UrlName.PersistedValue = this._getFilteredlValue(this.get_titleTxt().get_value()); //transcribe the value
        return data;
    },

    _successPut: function (sender, args) {
        var mediaUrl = args.Item.MediaUrl;
        mediaUrl = mediaUrl.substr(0, mediaUrl.lastIndexOf("?"));
        this.raiseEvent("updateParameters", { Success: true, MediaUrl: mediaUrl });
    },
    _failPut: function (error, arg) {
        console.log(error.Detail);
        alert(error.Detail);
        this.raiseEvent("updateParameters", { Success: false, MediaUrl: "" });
    },

    _getFilteredlValue: function (value) {
        var filteredValue = value;
        if (this._toLower)
            filteredValue = filteredValue.toLowerCase();
        if (this._trim)
            filteredValue = filteredValue.trim();

        var regularExpressionObj = this._get_regularExpression();
        if (regularExpressionObj) {
            if (this._replaceWith === undefined || this._replaceWith === null)
                this._replaceWith = "";

            filteredValue = filteredValue.replace(regularExpressionObj, this._replaceWith);
        }

        return filteredValue;
    },

    _get_regularExpression: function () {
        if (!this._regularExpressionObj)
            this._regularExpressionObj = new XRegExp(this._regularExpression, "g");
        return this._regularExpressionObj;
    },

    openDialog: function (commandName, queryString, assignCloseEvent) {
        var dialog = this.get_windowManager().getWindowByName(commandName);
        if (dialog) {
            dialog.set_skin("Default");
            dialog.set_showContentDuringLoad(false);

            if (queryString) {
                var url = dialog.get_navigateUrl();
                var idx = url.indexOf("?");
                if (idx > -1) {
                    url = url.substring(0, idx);
                }
                dialog.set_navigateUrl(url + queryString);
            }
            if (assignCloseEvent) {
                if (!dialog._sfCloseDialogExtension) {
                    dialog._sfCloseDialogExtension = this._closeDialogExtensionDelegate;
                }
                dialog.add_close(dialog._sfCloseDialogExtension);
            }

            dialog.show();
            //Telerik.Sitefinity.centerWindowHorizontally(dialog);

            dialog.maximize();
        }
    },

    _closeDialogExtension: function (sender, args) {
        var argument = args.get_argument();
        sender.remove_close(this._closeDialogExtensionDelegate);
        if (argument.CommandName == "save") {
            this.set_imageId(argument.ImageId, true);
            this.set_src(this.get_src());
        }

        if (dialogBase) {
            dialogBase.setWndHeight("550px");
            dialogBase.setWndWidth("450px");
            var oWnd = dialogBase.get_radWindow();
            if (oWnd) {
                oWnd.center();
                oWnd._popupElement.style.top = "50px";
                oWnd.get_contentFrame().contentWindow.document.body.style.position = "";
            }
        }

        this.raiseEvent("closeEditImageDialog", args);
    },

    //Methods END

    //Events START
    raiseEvent: function (eventName, eventArgs) {
        var handler = this.get_events().getHandler(eventName);
        if (handler) {
            if (!eventArgs) {
                eventArgs = Sys.EventArgs.Empty;
            }
            handler(this, eventArgs);
        }
    },
    add_changeImageClick: function (handler) {
        this.get_events().addHandler("changeImageClick", handler);
    },
    remove_changeImageClick: function (handler) {
        this.get_events().removeHandler("changeImageClick", handler);
    },
    add_editImageClick: function (handler) {
        this.get_events().addHandler("editImageClick", handler);
    },
    remove_editImageClick: function (handler) {
        this.get_events().removeHandler("editImageClick", handler);
    },
    add_updateParameters: function (handler) {
        this.get_events().addHandler("updateParameters", handler);
    },
    remove_updateParameters: function (handler) {
        this.get_events().removeHandler("updateParameters", handler);
    },
    add_closeEditImageDialog: function (handler) {
        this.get_events().addHandler("closeEditImageDialog", handler);
    },
    remove_closeEditImageDialog: function (handler) {
        this.get_events().removeHandler("closeEditImageDialog", handler);
    }
    //Events END
}

Telerik.Sitefinity.Modules.Libraries.Web.UI.Designers.InsertEditImageView.registerClass("Telerik.Sitefinity.Modules.Libraries.Web.UI.Designers.InsertEditImageView", Telerik.Sitefinity.Web.UI.AjaxDialogBase);
