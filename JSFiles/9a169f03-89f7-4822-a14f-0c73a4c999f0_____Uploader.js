var motorsazanClient = motorsazanClient || {};
motorsazanClient.uploader = function () {

    const state = {
        config: null,
        fileReferences: [],
        isFileUploaded: false,
        multipleFileSelectionNewNameModes: {
            disabled: 0,
            requiredForAll: 1,
            optional: 2
        },
        accepts: {
            "compress/*": ".zip,.rar,.7z",
            "access/*": ".adp,.accdb,.accda,.mdb,.mda,.mdf",
            "powerpoint/*": ".ppt,.pps,.pptx,.ppsx,.sldx",
            "excel/*": ".xls,.xlsx",
            "document/*": ".doc,.docx,.pdf",
            "video/*": ".ogm,.wmv,.qt,.asx,.mpeg,.mpg,.webm,.ogv,.mp4,.m4v,.avi",
            "audio/*": ".opus,.flac,.webm,.weba,.wav,.ogg,.m4a,.mp3,.oga,.mid,.amr,.aiff,.wma,.au,.acc",
            "image/*": ".tif,.pjp,.svgz,.jpg,.JPG,.jpeg,.JPEG,.ico,.tiff,.gif,.GIF,.svg,.SVG,.jfif,.webp,.png,.PNG,.bmp,.xbm,.pjpeg,.avif"
        },
        uploadedFiles: [],
        namesOfUploadedFiles: [],
        countOfTotalUploadedLargeFiles: 0,
        countOfTotalLargeFilesThatMustBeUploaded: 0,
        loadingModalOldText: "",
        totalPartsCount: 0
    };
    let dom = {};
    const tools = motorsazanClient.tools;
    const controllerName = "/Uploader/";

    async function clearUploader(_, shouldDeleteUploadedFile = true) {
        const isMultiSelectionUploader = state.config.isMultipleSelection;

        if (isMultiSelectionUploader) {
            generateUploaderElementsForMultipleFileSelectionMode(state.config);
            resetMultiSelectionDemo();
            tools.disableItem($(dom.multiSelectionClearBtn));
        }
        else {
            updateUploaderStatus();
            generateUploaderElementsForSingleFileSelectionMode(state.config);
            resetDemo();
        }

        const fileNamesToBeDeleted = state.fileReferences.map(file => file.fileNameOnDataBase || file.fileNameForSaving || file.fileName);

        shouldDeleteUploadedFile && deleteUploadedFiles(fileNamesToBeDeleted);

        state.isFileUploaded = false;
        state.fileReferences = [];
        state.uploadedFiles = [];

        state.namesOfUploadedFiles = [];

        setDom(state.config.id);
        setEvents();
    }

    function convertFileToBase64(file) {
        motorsazanClient.loadingModal.show();
        const reader = new FileReader();
        reader.onload = (fileReader) => handleFileConvertToBase64Complete(fileReader, file);
        reader.onerror = showConvertToBase64Error;
        reader.readAsDataURL(file);
    }

    function create(config) {
        const canInitUploader = isConfigObjectValid(config);
        if (!canInitUploader) {
            printSample();
            return null;
        }

        state.config = setDefaultsInConfigFile(config);

        if (state.config.isMultipleSelection) {
            generateUploaderElementsForMultipleFileSelectionMode(state.config);
        }
        else {
            generateUploaderElementsForSingleFileSelectionMode(state.config);
        }

        setDom(state.config.id);
        setEvents();

        return {
            getBase64Value: getBase64Value,
            getFileRef: getFileRef,
            clear: (shouldDeleteUploadedFile = true) => clearUploader(null, shouldDeleteUploadedFile),
            saveNameOfUploadedFiles: saveNameOfUploadedFiles,
            showUploadedFileDemoLink: showUploadedFileDemoLink,
            showUploadedFileDemoLinksForMultiSelection: showUploadedFileDemoLinksForMultiSelection,
            enable: enable,
            disable: disable,
            isValid: isFileUploaded
        }
    }

    async function deleteFilesUploadedToClient(fileNames) {
        if (fileNames != null && fileNames != undefined && !Array.isArray(fileNames))
            fileNames = [fileNames];

        const url = controllerName + "DeleteFiles";
        const apiParam = {
            fileNames
        }
        await motorsazanClient.connector.post(url, apiParam);

        state.namesOfUploadedFiles = state.namesOfUploadedFiles.filter(fn => !fileNames.includes(fn));
    }

    async function deleteUploadedFiles(fileNames) {
        motorsazanClient.loadingModal.show();

        if (fileNames.length < 1) {
            motorsazanClient.loadingModal.hide();
            return;
        }

        const deletedFiles = state.fileReferences.filter(file => fileNames.includes(file.fileName) || fileNames.includes(file.fileNameOnDataBase));

        if (state.config.isLargeFileUploader) {
            await deleteFilesUploadedToClient(fileNames);
        }

        if (state.config.deleteUploadedFilesCallback) {

            if (state.config.isLargeFileUploader && state.config.isMultipleSelection) {
                state.config.deleteUploadedFilesCallback(fileNames);
            }
            else if (!state.config.isLargeFileUploader && state.config.isMultipleSelection) {
                const deletedFilesBase64s = deletedFiles.map(file => file.base64);
                fileNames = deletedFiles.map(file => file.fileName);

                state.config.deleteUploadedFilesCallback(deletedFilesBase64s, fileNames);
            }
            else if (state.config.isLargeFileUploader && !state.config.isMultipleSelection) {
                state.config.deleteUploadedFilesCallback(fileNames[0]);
            }
            else {
                const deletedFilesBase64s = deletedFiles.map(file => file.base64);

                state.config.deleteUploadedFilesCallback(deletedFilesBase64s[0], fileNames[0]);
            }


            state.uploadedFiles =
                state.uploadedFiles.filter(ref =>
                    !(
                        (!tools.isNullOrEmpty(ref.fileNameForSaving) && fileNames.includes(ref.fileNameForSaving))
                        || fileNames.includes(ref.fileName)
                    )
                );

            state.namesOfUploadedFiles = state.uploadedFiles.map(file => file.fileNameOnDataBase || file.fileNameForSaving || file.fileName);
        }

        motorsazanClient.loadingModal.hide();
    }

    function disable(shouldDeleteUploadedFile = true) {
        clearUploader(null, shouldDeleteUploadedFile);

        const isMultiSelectionUploader = state.config.isMultipleSelection;
        const isLargeFileUploader = state.config.isLargeFileUploader;

        if (isMultiSelectionUploader) {
            dom.multiSelectionClearBtn.removeEventListener("click", clearUploader, true);
            $(dom.root).addClass("app__disable");
            dom.selectBtn.setAttribute("disabled", "disabled");
            dom.multiSelectionClearBtn.setAttribute("disabled", "disabled");
            return;
        }

        if (isLargeFileUploader) {
            dom.uploadBtn.removeEventListener("click", startUploadLargeFileToServer, true);
        }
        else {
            dom.uploadBtn.removeEventListener("click", startUploadFileToServer, true);
        }

        dom.fileInput.removeEventListener("change", handleFileChange, true);
        dom.clearBtn.removeEventListener("click", clearUploader, true);

        dom.fileInput.removeAttribute("type");

        $(dom.root).addClass("app__disable");

        $(dom.fileInput).text();

        dom.selectBtn.setAttribute("disabled", "disabled");
        dom.uploadBtn.setAttribute("disabled", "disabled");
        dom.clearBtn.setAttribute("disabled", "disabled");
    }

    function enable(shouldDeleteUploadedFile = true) {
        setEvents();

        const isMultiSelectionUploader = state.config.isMultipleSelection;
        const isLargeFileUploader = state.config.isLargeFileUploader;

        if (isMultiSelectionUploader) {
            dom.selectBtn.addEventListener("click", handleMultiSelectionModalSelectBtnClick, true);
            dom.multiSelectionClearBtn.addEventListener("click", clearUploader, true);
            $(dom.root).removeClass("app__disable");
            dom.selectBtn.removeAttribute("disabled");
            dom.multiSelectionClearBtn.removeAttribute("disabled");

            clearUploader(null, shouldDeleteUploadedFile);
            return;
        }

        if (isLargeFileUploader) {
            dom.uploadBtn.addEventListener("click", startUploadLargeFileToServer, true);
        }
        else {
            dom.uploadBtn.removeEventListener("click", startUploadFileToServer, true);
        }

        dom.fileInput.setAttribute("type", "file");

        $(dom.root).removeClass("app__disable");

        dom.selectBtn.removeAttribute("disabled");
        dom.uploadBtn.removeAttribute("disabled");
        dom.clearBtn.removeAttribute("disabled");

        clearUploader(null, shouldDeleteUploadedFile);
    }

    function generateUploaderElementsForModalOfMultipleFileSelectionMode() {
        const config = state.config;

        const rootElement = document.createElement("div");
        $(rootElement).addClass("uploader__multi-selection-modal");

        const warningsSectionNode = document.createElement("div");
        $(warningsSectionNode).addClass("uploader__multi-selection-modal__warnings-section");

        const limitationsTitleLabel = document.createElement("label");
        limitationsTitleLabel.innerHTML = "محدودیت ها:";

        const limitationsUl = document.createElement("ul");

        const limits = [];
        if (config.multipleSelectionConfig.numberOfMinimumFileCanBeSelected) {
            const min = config.multipleSelectionConfig.numberOfMinimumFileCanBeSelected;
            const max = config.multipleSelectionConfig.numberOfMaximumFileCanBeSelected;

            let limit = `تعداد فایل های انتخاب شده باید حداقل ${min}`;

            if (max) {
                limit += ` و حداکثر ${max}`;
            }

            if (min == max) {
                limit = `تعداد فایل های انتخابی بایستی حداکثر ${min}`;
            }

            limit += " باشد";

            limits.push(limit);
        }

        if (state.config.maxSize) {
            const maxSizeLimitMessage = `حداکثر سایز قابل انتخاب برای فایل ها ${state.config.maxSize / 1024}MB می باشد`
            limits.push(maxSizeLimitMessage);
        }

        const newNameForSelectedFilesMode = config.multipleSelectionConfig.newNameForSelectedFilesMode;
        if (newNameForSelectedFilesMode === state.multipleFileSelectionNewNameModes.requiredForAll) {
            let limit = `تعیین نام جدید برای تمامی فایل های انتخاب شده اجباری است`;
            limits.push(limit);
        }
        else if (newNameForSelectedFilesMode === state.multipleFileSelectionNewNameModes.optional) {
            let limit = `تعیین نام جدید برای فایل های انتخاب شده اختیاری است`;
            limits.push(limit);
        }
        else if (newNameForSelectedFilesMode === state.multipleFileSelectionNewNameModes.disabled) {
            let limit = `نمی توانید نام فایل های انتخاب شده را تغییر دهید`;
            limits.push(limit);
        }

        if (state.config.isMultipleSelection && state.config.multipleSelectionConfig.additionalLimitMessage) {
            limits.push(state.config.multipleSelectionConfig.additionalLimitMessage);
        }

        limits.forEach(limit => {
            const limitLi = document.createElement("li");
            limitLi.textContent = limit;
            limitationsUl.appendChild(limitLi);
        });


        const selectBtnWrapper = document.createElement("div");
        $(selectBtnWrapper).addClass("uploader__multi-selection-modal__select-button-wrapper");

        const selectBtn = document.createElement("button");
        $(selectBtn).addClass("btn btn-primary");
        selectBtn.setAttribute("id", config.id + "ModalSelectBtn");
        selectBtn.textContent = "انتخاب فایل جدید";

        const fileInput = document.createElement("input");
        fileInput.setAttribute("id", config.id + "FileInput");
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", config.accept);
        fileInput.setAttribute("multiple", "multiple");
        $(fileInput).css("display", "none");


        const selectedFilesDemoWrapper = document.createElement("div");
        $(selectedFilesDemoWrapper).addClass("uploader__multi-selection-modal__selected-files-demo-wrapper");
        state.fileReferences.length < 1 && $(selectedFilesDemoWrapper).addClass("app__hide");
        selectedFilesDemoWrapper.setAttribute("id", config.id + "SelectedFilesDemoWrapper");

        const selectedFilesDemoTable = document.createElement("table");

        if (state.config.multipleSelectionConfig.newNameForSelectedFilesMode ===
            state.multipleFileSelectionNewNameModes.disabled) {
            selectedFilesDemoTable.innerHTML =
                `
                <thead>
                    <tr>
                        <th>ردیف</th>
                        <th>فایل انتخاب شده</th>
                        <th>حذف</th>
                    </tr>
                </thead>
            `;
        }
        else {
            selectedFilesDemoTable.innerHTML =
                `
                <thead>
                    <tr>
                        <th>ردیف</th>
                        <th>فایل انتخاب شده</th>
                        <th>نام فایل برای ذخیره</th>
                        <th>حذف</th>
                    </tr>
                </thead>
            `;
        }


        const selectedFilesDemoTableBody = document.createElement("tbody");
        selectedFilesDemoTableBody.setAttribute("id", config.id + "Demos");

        const actionsWrapper = document.createElement("div");
        $(actionsWrapper).addClass("uploader__multi-selection-modal__actions-wrapper");


        const actionsWrapperDiv = document.createElement("div");

        const actionsCancelBtn = document.createElement("button");
        $(actionsCancelBtn).addClass("btn");
        actionsCancelBtn.setAttribute("id", config.id + "CancelBtn");
        actionsCancelBtn.textContent = "انصراف";
        actionsCancelBtn.addEventListener("click", motorsazanClient.contentModal.hide);

        const actionsUploadBtn = document.createElement("button");
        $(actionsUploadBtn).addClass("btn");
        actionsUploadBtn.setAttribute("id", config.id + "UploadBtn");
        actionsUploadBtn.textContent = "آپلود همه";
        actionsUploadBtn.addEventListener("click", handleMultiSelectionModalUploadBtnClick);

        limits.length > 0 && rootElement.appendChild(warningsSectionNode);
        rootElement.appendChild(selectBtnWrapper);
        rootElement.appendChild(selectedFilesDemoWrapper);
        rootElement.appendChild(actionsWrapper);

        warningsSectionNode.appendChild(limitationsTitleLabel);
        warningsSectionNode.appendChild(limitationsUl);

        selectBtnWrapper.appendChild(selectBtn);
        selectBtnWrapper.appendChild(fileInput);

        selectedFilesDemoWrapper.appendChild(selectedFilesDemoTable);
        selectedFilesDemoTable.appendChild(selectedFilesDemoTableBody);

        actionsWrapper.appendChild(actionsWrapperDiv);
        actionsWrapperDiv.appendChild(actionsCancelBtn);
        actionsWrapperDiv.appendChild(actionsUploadBtn);


        return rootElement;
    }

    function generateUploaderElementsForMultipleFileSelectionMode(config) {
        const uploaderRootNode = document.getElementById(config.id);
        $(uploaderRootNode).addClass("uploader__wrapper uploader__wrapper--multi-selection");

        const selectBtn = document.createElement("button");
        selectBtn.textContent = config.selectBtnText;
        selectBtn.setAttribute("id", config.id + "SelectBtn");
        $(selectBtn).addClass("uploader__action");
        config.small && $(selectBtn).addClass("uploader__action__small");

        const clearBtn = document.createElement("button");
        clearBtn.textContent = config.clearBtnText;
        clearBtn.setAttribute("id", config.id + "MultiSelectionClearBtn");
        clearBtn.setAttribute("disabled", "disabled");
        $(clearBtn).addClass("uploader__action uploader__action--clear-btn");
        config.small && $(clearBtn).addClass("uploader__action__small uploader__action--clear-btn");

        const demoLinksNode = document.createElement("div");
        demoLinksNode.setAttribute("id", config.id + "DemoLinks");
        $(demoLinksNode).addClass("uploader__demo uploader__demo--multi-selection app__hide");

        const tempWrapperNode = document.createElement("div");
        tempWrapperNode.appendChild(selectBtn);
        tempWrapperNode.appendChild(clearBtn);

        uploaderRootNode.parentNode.appendChild(demoLinksNode);

        uploaderRootNode.innerHTML = tempWrapperNode.innerHTML;
    }

    function generateUploaderElementsForSingleFileSelectionMode(config) {
        let uploaderRootNode = document.getElementById(config.id);
        $(uploaderRootNode).addClass("uploader__wrapper");

        let textNode = document.createElement("span");
        textNode.textContent = config.placeholder;
        textNode.setAttribute("id", config.id + "Text");
        $(textNode).addClass("uploader__text");

        let fileInputNode = document.createElement("input");
        fileInputNode.setAttribute("accept", config.accept);
        fileInputNode.setAttribute("type", "file");
        fileInputNode.setAttribute("id", config.id + "FileInput");
        $(fileInputNode).addClass("uploader__input");

        let selectBtn = document.createElement("button");
        selectBtn.textContent = config.selectBtnText;
        selectBtn.setAttribute("id", config.id + "SelectBtn");
        $(selectBtn).addClass("uploader__action").css("left", config.small ? "45px" : "80px");
        config.small && $(selectBtn).addClass("uploader__action__small");

        let uploadBtn = document.createElement("button");
        uploadBtn.textContent = config.uploadBtnText;
        uploadBtn.setAttribute("id", config.id + "UploadBtn");
        uploadBtn.setAttribute("disabled", "");
        $(uploadBtn).addClass("uploader__action").addClass("uploader__action--upload-btn");
        config.small && $(uploadBtn).addClass("uploader__action__small");

        let clearBtn = document.createElement("button");
        clearBtn.textContent = config.clearBtnText;
        clearBtn.setAttribute("id", config.id + "ClearBtn");
        clearBtn.setAttribute("disabled", "");
        $(clearBtn).addClass("uploader__action").addClass("uploader__action--clear-btn").css("left", config.small ? "90px" : "160px");
        config.small && $(clearBtn).addClass("uploader__action__small");

        let tempWrapperNode = document.createElement("div");
        tempWrapperNode.appendChild(textNode);
        tempWrapperNode.appendChild(fileInputNode);
        tempWrapperNode.appendChild(selectBtn);
        tempWrapperNode.appendChild(uploadBtn);
        tempWrapperNode.appendChild(clearBtn);

        let isDemoAlreadyCreated = document.getElementById(config.id + "DemoParent") != null;
        if (!isDemoAlreadyCreated) {
            let demoLabel = document.createElement("label");
            demoLabel.textContent = "پیش نمایش فایل آپلود شده :";
            $(demoLabel).addClass("uploader__demo__label");

            let demoLink = document.createElement("a");
            demoLink.setAttribute("Id", config.id + "DemoLink");
            demoLink.setAttribute("target", "_blank");
            demoLink.setAttribute("href", "#");

            let demoLinkParentDiv = document.createElement("div");
            demoLinkParentDiv.setAttribute("Id", config.id + "DemoParent");
            $(demoLinkParentDiv).addClass("uploader__demo").addClass("app__hide");
            demoLinkParentDiv.appendChild(demoLabel);
            demoLinkParentDiv.appendChild(demoLink);

            uploaderRootNode.parentNode.insertBefore(demoLinkParentDiv, uploaderRootNode.nextSibling);
        }

        uploaderRootNode.innerHTML = tempWrapperNode.innerHTML;
    }

    function getBase64Value(i = 0) {
        return getFileRef(i).base64;
    }

    function getFileRef(i = 0) {
        return state.fileReferences[i];
    }

    function getFileExtension(fileItem) {
        if (tools.isNullOrEmpty(fileItem)) return "";

        const fileExtensionStartIndex = fileItem.name.lastIndexOf(".");
        const fileExtension = fileItem.name.substr(fileExtensionStartIndex);
        return fileExtension;
    }

    function handleFileChange(event) {
        motorsazanClient.loadingModal.show();
        const target = event.target;
        const file = target.files[0];

        const isValid = file && isSelectedFileValid(file);
        if (!isValid) {
            target.value = "";
            event.preventDefault();
            clearUploader();
        } else {
            state.fileReferences = [
                {
                    fileName: file.name,
                    file: file,
                    base64: "",
                    fileNameForSaving: "",
                    fileNameOnDataBase: "",
                    isUploaded: false
                }];

            if (state.config.extensionForSavedFiles) {
                const splitFileName = file.name.split(".");
                splitFileName.pop();
                state.fileReferences[0].fileName = splitFileName.join(".") + state.config.extensionForSavedFiles;
            }

            if (!state.config.isLargeFileUploader)
                convertFileToBase64(file);
        };


        state.isFileUploaded = false;

        resetDemo();
        updateUploaderStatus();
        motorsazanClient.loadingModal.hide();

    }

    function handleFileConvertToBase64Complete(fileReader, file) {
        const fullBase64 = fileReader.srcElement.result;
        const separator = ";base64,";
        const base64OfFile = fullBase64.split(separator)[1];

        const reference = state.fileReferences.filter(ref => ref.file === file);

        if (reference) {
            const index = state.fileReferences.findIndex(ref => ref.file === file);
            state.fileReferences[index].base64 = base64OfFile;
        }

        motorsazanClient.loadingModal.hide();
    }

    function handleMultiSelectionFileChange(event) {
        motorsazanClient.loadingModal.show();
        const target = event.target;
        const files = Array.from(target.files);

        const maxNumberOfFiles = state.config.multipleSelectionConfig.numberOfMaximumFileCanBeSelected;

        if (maxNumberOfFiles && state.fileReferences.length + files.length > maxNumberOfFiles) {
            motorsazanClient.messageModal.error(`حداکثر می توانید ${maxNumberOfFiles} فایل را انتخاب کنید`);
            motorsazanClient.loadingModal.hide();
            return;
        }

        const duplicateFiles = [];

        files.forEach(file => {

            const isValid = file && isSelectedFileValid(file);
            if (!isValid) {
                duplicateFiles.push(file.name);
            }
            else if (isFileAlreadySelected(file)) {
                duplicateFiles.push(file.name);
            }
            else {
                state.fileReferences.push({
                    fileName: file.name,
                    file: file,
                    base64: ""
                });

                if (!state.config.isLargeFileUploader)
                    convertFileToBase64(file);
            }
        });

        if (duplicateFiles.length > 0) {
            let message = `<ul style='text-align: right;'>فایل های زیر قبلا انتخاب شده اند و یا نامعتبر و یا سایز بیش از اندازه (<bdi>${state.config.maxSize / 1024} MB</bdi>) می باشند:`;
            message += duplicateFiles.map(fileName => `<li><bdi>${fileName}</bdi></li>`).join("\n");
            message += "</ul>";
            motorsazanClient.messageModal.error(message);
        }


        updateMultiSelectionUploaderStatus();
        motorsazanClient.loadingModal.hide();
    }

    function handleMultiSelectionModalSelectBtnClick() {
        const maxNumberOfFiles = state.config.multipleSelectionConfig.numberOfMaximumFileCanBeSelected;

        if (maxNumberOfFiles && state.fileReferences.length >= maxNumberOfFiles) {
            motorsazanClient.messageModal.error(`حداکثر می توانید ${maxNumberOfFiles} فایل را انتخاب کنید`);
            return;
        }

        $(dom.fileInput).val("");
        $(dom.fileInput).trigger("click");
    }

    function handleMultiSelectionModalRemoveBtn(fileName) {
        const fileRefs =
            state.fileReferences.filter(ref =>
                ref.isUploaded &&
                ((!tools.isNullOrEmpty(ref.fileNameForSaving) && ref.fileNameForSaving === fileName)
                    || (!tools.isNullOrEmpty(ref.fileNameOnDataBase) && ref.fileNameOnDataBase === fileName)
                    || ref.fileName === fileName
                )
            );

        const fileNamesOnDataBase = fileRefs.map(ref => ref.fileNameOnDataBase || ref.fileName);

        const isAlreadyUploaded = fileRefs.length > 0;

        if (isAlreadyUploaded) {
            deleteUploadedFiles(fileNamesOnDataBase);

            // Remove the related demo link (if file is already uploaded)
            const demoLinks = Array.from(dom.multiSelectionDemoLinks.children);
            const nodesToRemove = demoLinks.filter(demoLink => demoLink.innerText === fileRefs[0].fileNameForSaving || demoLink.innerText === fileRefs[0].fileNameOnDataBase || demoLink.innerText === fileRefs[0].fileName);
            nodesToRemove.forEach(nodeToRemove => dom.multiSelectionDemoLinks.removeChild(nodeToRemove));

            if (dom.multiSelectionDemoLinks.children.length === 0) {
                resetMultiSelectionDemo();
            }
        }

        state.fileReferences = state.fileReferences.filter(ref =>
            ref.fileName !== fileName
            && ref.fileNameOnDataBase !== fileName
            && ref.fileNameForSaving !== fileName);

        updateMultiSelectionUploaderStatus();

        state.namesOfUploadedFiles = state.fileReferences.filter(file => file.isUploaded).map(file => file.fileNameOnDataBase || file.fileNameForSaving || file.fileName);

        state.config.showDemoLinksAfterUpload && showUploadedFileDemoLinksForMultiSelection(state.namesOfUploadedFiles, state.namesOfUploadedFiles);
    }

    function handleMultiSelectionModalUploadBtnClick() {
        const isAnyFileSelected = state.fileReferences.length > 0;

        if (!isAnyFileSelected) {
            motorsazanClient.messageModal.error("فایلی برای آپلود انتخاب نشده است");
            return;
        }

        const numberOfMinimumFileCanBeSelected = state.config.multipleSelectionConfig.numberOfMinimumFileCanBeSelected;

        const isCountOfSelectedFilesLessThanMinimum = state.fileReferences.length < numberOfMinimumFileCanBeSelected;

        if (isCountOfSelectedFilesLessThanMinimum) {
            motorsazanClient.messageModal.error(`حداقل باید ${numberOfMinimumFileCanBeSelected} فایل انتخاب کنید`);
            return;
        }

        const newNameForSelectedFilesMode = state.config.multipleSelectionConfig.newNameForSelectedFilesMode;

        const duplicates = [];
        let errorMessage = "";

        if (newNameForSelectedFilesMode === state.multipleFileSelectionNewNameModes.requiredForAll) {
            const isAnyFileThatHasNotNewName = state.fileReferences.filter(ref => tools.isNullOrEmpty(ref.fileNameForSaving)).length > 0;

            if (isAnyFileThatHasNotNewName) {
                motorsazanClient.messageModal.error("باید برای همه فایل های انتخاب شده نام جدید تعیین کنید");
                return;
            }
        }
        else if (newNameForSelectedFilesMode === state.multipleFileSelectionNewNameModes.optional) {

            state.fileReferences.forEach(ref => {
                const name = ref.fileNameForSaving || ref.fileName;

                const isDuplicate = state.fileReferences.filter(reference => reference !== ref).filter(reference =>
                    (!tools.isNullOrEmpty(reference.fileNameForSaving) && reference.fileNameForSaving === name) ||
                    reference.fileName === name).length > 0;

                isDuplicate && duplicates.push(name);
            });

            if (duplicates.length > 0) {
                errorMessage += "<ul style='text-align: right;'>فایل های زیر قبلا انتخاب شده اند و یا نامشان تکراری می باشد:";
                errorMessage += Array.from(new Set(duplicates.map(fileName => `<li><bdi>${fileName}</bdi></li>`))).join("\n");
                errorMessage += "</ul>";
            }
        }

        if (state.config.isLargeFileUploader) {
            startUploadMultiSelectionLargeFilesToServer();
            motorsazanClient.contentModal.hide();
            return;
        }

        //----------------------------
        // Checking base64 duplicates
        //----------------------------

        const seen = new Set();
        const duplicatesBasedOnTheirBase64Values = state.fileReferences.filter(ref => {
            return seen.size === seen.add(ref.base64).size;
        });

        const isThereAnyDuplicateBase64Values = duplicatesBasedOnTheirBase64Values.length > 0;

        if (isThereAnyDuplicateBase64Values) {
            errorMessage += "<ul style='text-align: right;'>فایل های زیر تکراری می باشند:";
            errorMessage += duplicatesBasedOnTheirBase64Values.map(ref => `<li><bdi>${ref.fileNameForSaving || ref.fileName}</bdi></li>`).join("\n");
            errorMessage += "</ul>";
        }

        if (!tools.isNullOrEmpty(errorMessage)) {
            motorsazanClient.messageModal.error(errorMessage);
            return;
        }

        startUploadMultiSelectionFilesToServer();

        motorsazanClient.contentModal.hide();
    }

    function isConfigObjectValid(config) {
        if (!config) {
            motorsazanClient.messageModal.error("فایل تنظیمات آپلودر به درستی پیکربندی نشده است!");
            return false;
        }

        const hasId = !tools.isNullOrEmpty(config.id || null);
        if (!hasId) {
            motorsazanClient.messageModal.error("شناسه آپلودر در فایل تنظیمات ، مقداردهی نشده است!");
            return false;
        }

        const uploaderRoot = document.getElementById(config.id);
        if (!uploaderRoot) {
            motorsazanClient.messageModal.error("آیتمی با شناسه ارسال شده، یافت نشد!");
            return false;
        }

        const hasUploadCallback = !tools.isNullOrEmpty(config.uploadCallback || null);
        if (!hasUploadCallback) {
            motorsazanClient.messageModal.error("آدرس اِندپونت ذخیره سازی فایل، در فایل تنظیمات مقدار دهی نشده است!");
            return false;
        }

        const hasDeleteUploadedFilesCallback = !tools.isNullOrEmpty(config.deleteUploadedFilesCallback || null);
        if (!config.isLargeFileUploader && !hasDeleteUploadedFilesCallback) {
            motorsazanClient.messageModal.error("کالبک مربوط به حذف فایل ها از سرور تعریف نشده است!");
            return false;
        }

        return true;
    }

    function isFileAlreadySelected(file) {
        return state.fileReferences.filter(ref =>
            (!tools.isNullOrEmpty(ref.fileNameForSaving) && ref.fileNameForSaving === file.name)
            || ref.fileName === file.name
            || ref.base64 === file.base64)
            .length > 0;
    }

    function isFileExtensionValid(fileItem) {
        const fileExtension = getFileExtension(fileItem);
        let accept = state.config.accept;
        const acceptAll = "*.*";
        if (accept === acceptAll) return true;

        Object.keys(state.accepts).forEach(accept => {
            const fileExtensions = state.accepts[accept];
            accept = accept.replace(accept, fileExtensions);
        });

        const acceptArray = accept.split(",");
        const isValid = acceptArray.includes(fileExtension);
        if (!isValid) {
            motorsazanClient.messageModal.error("فرمت فایل انتخابی صحیح نمی باشد");
        }

        return isValid;
    }

    function isFileSizeValid(fileItem) {
        const fileSize = fileItem.size;
        const fileSizeInKb = fileSize / 1024;
        const isSizeValid = fileSizeInKb <= state.config.maxSize;

        if (!isSizeValid) {
            const message = "سایز فایل انتخاب شده بیشتر از " + state.config.maxSize + " کیلوبایت می باشد";
            motorsazanClient.messageModal.error(message);
        }

        return isSizeValid;
    }

    function isFileUploaded() {
        return state.isFileUploaded;
    }

    function isSelectedFileValid(fileItem) {
        const hasValidExtension = isFileExtensionValid(fileItem);
        const hasValidSize = (!state.config.maxSize && state.config.isLargeFileUploader) || isFileSizeValid(fileItem);

        return hasValidExtension && hasValidSize;
    }

    function printSample() {
        const configDescription = {
            uploadCallback: "تابع کابک برای انجام انتقال فایل به سرور، این تابع بیس64 فایل انتخابی و  فرمت آن را به عنوان ورودی میتواند دریافت کند",
            deleteUploadedFilesCallback: "تابع کابک برای انجام حذف فایل ها سرور، این تابع نام فایل هارا به صورت لیست دریافت می کند و آن ها حذف میکند",
            placeholder: "متن هنگام خالی بودن آپلودر",
            accept: "لیست فایلهای مجاز که با کاما جدا شده اند",
            id: "شناسه اصلی آپلودر",
            selectBtnText: "متن برای نمایش دکمه انتخاب فایل در حالت خالی بودن آپلودر",
            maxSize: "حداکثر سایز مجاز برای فایل به صورت کیلوبایت",
            small: "(col-md-8 کمتر از) نمایش آپلود کننده برای سایز کوچک",
            isMultipleSelection: " آیا آپلودر از نوع انتخاب چند فایلی است؟ (اگر 'multipleSelectionConfig' مقدار دهی شود نوع انتخاب از نوع چند فایلی در نظر گرفته میشود)",
            multipleSelectionConfig: "تنظیمات مربوط به آپلودر چند فایلی",
            multipleSelectionConfig_numberOfMinimumFileCanBeSelected: "محدودیت حداقل تعداد فایل انتخابی مجاز برای آپلود",
            multipleSelectionConfig_numberOfMaximumFileCanBeSelected: "محدودیت حداکثر تعداد فایل انتخابی مجاز برای آپلود",
            multipleSelectionConfig_newNameForSelectedFilesMode: "تعیین کننده حالت تغییر اسم فایل برای فایل هلی انتخاب شده حین آپلود",
            multipleSelectionConfig_newNameInputPlaceHolderWhenNewNameIsRequired: "Placeholer نمایشی برای input های 'نام فایل برای ذخیره' در زمانی که نام جدید برای فایل اجباری است",
            multipleSelectionConfig_additionalLimitMessage: "پیغام اختیاری جهت نمایش در بخش محدودیت ها",
            isLargeFileUploader: " آیا آپلودر از نوع آپلودر فایل های حجیم است؟ (اگر 'largeFileModeConfig' مقدار دهی شود نوع انتخاب از نوع آپلودر فایل های حجیم  در نظر گرفته میشود)",
            largeFileModeConfig: "تنظیمات مربوط به آپلودر فایل های حجیم",
            largeFileModeConfig_fileChunckSizeMB: "حجم تیکه های فایل های ارسالی به مگابایت",
            largeFileModeConfig_changeFileNameToUniqueName: "تغییر اسم فایل به یک اسم غیر تکراری و یونیک؟",
            uploadedFileBaseAddress: "آدرس پایه فایل آپلود شده (برای نمایش در demo link ها)",
            extensionForSavedFiles: "پسوندی که تمامی فایل ها با آن ذخیره میشوند (اختیاری)",
            showDemoLinksAfterUpload: "نمایش لینک های پیشنمایش پس از اتمام آپلود (فعال به صورت پیش فرض)",
        };
        const configSample = {
            uploadCallback: function (base64, type) { alert("start upload"); },
            deleteUploadedFilesCallback: function (fileNames) { alert("files deleted"); },
            placeholder: "برای انتخاب کلیک نمایید",
            accept: "image/*,audio/*,video/*,compress/*,excel/*,document/*,powerpoint/*,.cdr",
            id: "testUploader",
            selectBtnText: "انتخاب فایل",
            maxSize: 1024,
            small: false,
            extensionForSavedFiles: ".png",
            isMultipleSelection: true,
            multipleSelectionConfig: {
                numberOfMinimumFileCanBeSelected: 1,
                numberOfMaximumFileCanBeSelected: 10,
                newNameForSelectedFilesMode: state.multipleFileSelectionNewNameModes.requiredForAll,
                newNameInputPlaceHolderWhenNewNameIsRequired: "کد پرسنلی را وارد کنید",
                additionalLimitMessage: "لطفا در قسمت 'نام فایل برای ذخیره' کد پرسنلی کاربر وارد شود"
            },
            isLargeFileUploader: true,
            largeFileModeConfig: {
                fileChunckSizeMB: 5,
                changeFileNameToUniqueName: false
            },
            uploadedFileBaseAddress: "/UploadedFiles/",
            showDemoLinksAfterUpload: true
        };
        console.log("برای فعال شدن آپلودر تنظیمات زیر باید ست شود");
        console.table(configDescription);
        console.log("نمونه مثال از فایل کانفیگ");
        console.log(configSample);
        console.log("انواع accept ها:");
        console.table(state.accepts);
    }

    function resetDemo() {
        tools.hideItem($(dom.demoParent));
        dom.demoLink.textContent = "";
        dom.demoLink.removeAttribute("href");
    }

    function resetMultiSelectionDemo() {
        dom.multiSelectionDemoLinks.innerHTML = "";
        tools.hideItem($(dom.multiSelectionDemoLinks));
    }

    function setDefaultsInConfigFile(config) {
        const localConfig = Object.assign({}, config);

        const isMultipleSelection = !tools.isNullOrEmpty(localConfig.isMultipleSelection || null);
        if (!isMultipleSelection) {
            localConfig.isMultipleSelection = false;
        }
        else {
            localConfig.multipleSelectionConfig = Object.assign({}, localConfig.multipleSelectionConfig);
        }

        const isConfigSetForMultipleSelection =
            !tools.isNullOrEmpty(localConfig.multipleSelectionConfig || null) && Object.keys(localConfig.multipleSelectionConfig).length > 0;

        if (localConfig.isMultipleSelection && !isConfigSetForMultipleSelection) {

            localConfig.multipleSelectionConfig = Object.assign({}, localConfig.multipleSelectionConfig);

            const isValueSetForNumberOfMinimumFileCanBeSelected =
                !tools.isNullOrEmpty(localConfig.multipleSelectionConfig.numberOfMinimumFileCanBeSelected || null);
            if (!isValueSetForNumberOfMinimumFileCanBeSelected) {
                localConfig.multipleSelectionConfig.numberOfMinimumFileCanBeSelected = 1;
            }

            const isValueSetForNewNameForSelectedFilesMode =
                !tools.isNullOrEmpty(localConfig.multipleSelectionConfig.newNameForSelectedFilesMode || null);
            if (!isValueSetForNewNameForSelectedFilesMode) {
                localConfig.multipleSelectionConfig.newNameForSelectedFilesMode = state.multipleFileSelectionNewNameModes.optional;
            }
        }

        if (localConfig.isMultipleSelection) {
            const isNewNameInputPlaceHolderWhenNewNameIsRequiredValueSet =
                !tools.isNullOrEmpty(localConfig.multipleSelectionConfig.newNameInputPlaceHolderWhenNewNameIsRequired);
            if (!isNewNameInputPlaceHolderWhenNewNameIsRequiredValueSet) {
                localConfig.multipleSelectionConfig.newNameInputPlaceHolderWhenNewNameIsRequired = "نام فایل برای ذخیره را وارد کنید";
            }
        }

        const isLargeFileMode = !tools.isNullOrEmpty(localConfig.isLargeFileUploader || null);
        if (!isLargeFileMode) {
            localConfig.isLargeFileUploader = false;
        }
        else {
            localConfig.largeFileModeConfig = Object.assign({}, localConfig.largeFileModeConfig);
        }

        if (localConfig.isLargeFileUploader) {

            localConfig.largeFileModeConfig = Object.assign({}, localConfig.largeFileModeConfig);

            const isValueSetForFileChunckSizeMB =
                !tools.isNullOrEmpty(localConfig.largeFileModeConfig.fileChunckSizeMB || null);
            if (!isValueSetForFileChunckSizeMB) {
                localConfig.largeFileModeConfig.fileChunckSizeMB = 5;
            }

            const isValueSetForChangeFileNameToUniqueName =
                Object.keys(localConfig.largeFileModeConfig).includes("changeFileNameToUniqueName") || !tools.isNullOrEmpty(localConfig.largeFileModeConfig.changeFileNameToUniqueName || null);
            if (!isValueSetForChangeFileNameToUniqueName) {
                localConfig.largeFileModeConfig.changeFileNameToUniqueName = true;
            }
        }

        const isSmallValueSet = Object.keys(localConfig).includes("small") || !tools.isNullOrEmpty(localConfig.small || null);
        if (!isSmallValueSet) {
            localConfig.small = false;
        }

        const hasPlaceHolder = !tools.isNullOrEmpty(localConfig.placeholder || null);
        if (!hasPlaceHolder) {
            localConfig.placeholder = localConfig.small ? "انتخاب فایل" : "برای انتخاب کلیک نمایید";
        }

        const hasAccept = !tools.isNullOrEmpty(localConfig.accept || null);
        if (!hasAccept) {
            localConfig.accept = "*.*";
        }
        else {
            Object.keys(state.accepts).forEach(accept => {
                const fileExtensions = state.accepts[accept];
                localConfig.accept = localConfig.accept.replace(accept, fileExtensions);
            });
        }

        const isSelectBtnTextSet = !tools.isNullOrEmpty(localConfig.selectBtnText || null);
        if (!isSelectBtnTextSet) {
            localConfig.selectBtnText = localConfig.small ? "انتخاب" : "انتخاب فایل";

            if (isConfigSetForMultipleSelection) {
                localConfig.selectBtnText = "انتخاب فایل ها";
            }
        }

        const isUploadBtnTextSet = !tools.isNullOrEmpty(localConfig.uploadBtnText || null);
        if (!isUploadBtnTextSet) {
            localConfig.uploadBtnText = localConfig.small ? "آپلود" : "آپلود فایل";
        }

        const isClearBtnTextSet = !tools.isNullOrEmpty(localConfig.clearBtnText || null);
        if (!isClearBtnTextSet) {
            localConfig.clearBtnText = localConfig.small ? "حذف" : "پاک کردن";
        }

        const hasMaxSize = !tools.isNullOrEmpty(localConfig.maxSize || null);
        if (!isLargeFileMode && !hasMaxSize) {
            localConfig.maxSize = 1024;
        }

        const isUploadedFileBaseAddressValueSet = !tools.isNullOrEmpty(localConfig.uploadedFileBaseAddress || null);
        if (!isUploadedFileBaseAddressValueSet) {
            localConfig.uploadedFileBaseAddress = "/UploadedFiles/";
        }

        const isShowDemoLinksAfterUploadValueSet = Object.keys(localConfig).includes("showDemoLinksAfterUpload") || !tools.isNullOrEmpty(localConfig.showDemoLinksAfterUpload || null);
        if (!isShowDemoLinksAfterUploadValueSet) {
            localConfig.showDemoLinksAfterUpload = true;
        }

        if (isMultipleSelection &&
            isLargeFileMode &&
            localConfig.largeFileModeConfig.changeFileNameToUniqueName &&
            localConfig.multipleSelectionConfig.newNameForSelectedFilesMode === state.multipleFileSelectionNewNameModes.requiredForAll) {
            const message = `<div style='text-align: start;'>هنگامی که آپلودر از نوع چند انتخابی و فایل حجیم می باشد، گزینه های زیر نمی توانند هردو فعال باشند:
<ul style='direction: ltr;'><li>multipleSelectionConfig.newNameForSelectedFilesMode = requiredForAll</li><li>largeFileModeConfig.changeFileNameToUniqueName</li></ul>
<br/>* توجه داشته باشید که مقدار changeFileNameToUniqueName به صورت پیشفرض برای آپلودر حجیم فعال می باشد</div>`;
            motorsazanClient.messageModal.error(message, "خطا در ایجاد آپلودر")
        }

        const isExtensionForSavedFilesValueSet = !tools.isNullOrEmpty(localConfig.extensionForSavedFiles || null);
        if (isExtensionForSavedFilesValueSet) {
            localConfig.extensionForSavedFiles = localConfig.extensionForSavedFiles.replaceAll(' ', '');
            if (localConfig.extensionForSavedFiles[0] != ".") {
                localConfig.extensionForSavedFiles = `.${localConfig.extensionForSavedFiles}`;
            }
        }

        return localConfig;
    }

    function setDom(rootId) {
        dom = {
            root: document.getElementById(rootId),
            text: document.getElementById(rootId + "Text"),
            fileInput: document.getElementById(rootId + "FileInput"),
            selectBtn: document.getElementById(rootId + "SelectBtn"),
            uploadBtn: document.getElementById(rootId + "UploadBtn"),
            clearBtn: document.getElementById(rootId + "ClearBtn"),
            multiSelectionClearBtn: document.getElementById(rootId + "MultiSelectionClearBtn"),
            demoLink: document.getElementById(rootId + "DemoLink"),
            multiSelectionDemoLinks: document.getElementById(rootId + "DemoLinks"),
            demoParent: document.getElementById(rootId + "DemoParent"),
            modalSelectBtn: document.getElementById(rootId + "ModalSelectBtn")
        };
    }

    function setEvents() {
        const isMultipleSelectionUploader = state.config.isMultipleSelection;

        if (isMultipleSelectionUploader) {
            dom.selectBtn.addEventListener("click", showMultiSelectionModal, true);
            dom.modalSelectBtn && dom.modalSelectBtn.addEventListener("click", handleMultiSelectionModalSelectBtnClick, true);
            dom.fileInput && dom.fileInput.addEventListener("change", handleMultiSelectionFileChange, true);
            dom.multiSelectionClearBtn.addEventListener("click", clearUploader, true);
            return;
        }

        const isLargeFileUploader = state.config.isLargeFileUploader;
        if (isLargeFileUploader) {
            dom.uploadBtn.addEventListener("click", startUploadLargeFileToServer, true);
        }
        else {
            dom.uploadBtn.addEventListener("click", startUploadFileToServer, true);
        }

        dom.fileInput.addEventListener("change", handleFileChange, true);
        dom.clearBtn.addEventListener("click", clearUploader, true);
    }

    function setNameForFile(fileName, inputNewFileNameForSaving) {
        var fileNameForSaving = inputNewFileNameForSaving.value;
        fileNameForSaving = fileNameForSaving.trim();

        // If new name does not contain extension pick file's extension
        if (fileNameForSaving.split(".").filter(ch => ch.trim().length > 0).length < 2) {
            if (state.config.extensionForSavedFiles) {
                fileNameForSaving += state.config.extensionForSavedFiles;
            } else {
                if (fileNameForSaving[fileNameForSaving.length - 1] !== ".") {
                    fileNameForSaving += ".";
                }

                const fileNameSplitByDot = fileName.split(".").filter(ch => ch.trim().length > 0);
                fileNameForSaving += fileNameSplitByDot[fileNameSplitByDot.length - 1];
            }
        }

        if (!isFileExtensionValid({ name: fileNameForSaving })) {
            $(inputNewFileNameForSaving).val("");
            $(inputNewFileNameForSaving).focus();

            motorsazanClient.messageModal.error("نام فایل دارای پسوند معتبر نمی باشد");
            return;
        }

        const newNameForSelectedFilesMode = state.config.multipleSelectionConfig.newNameForSelectedFilesMode;

        const isNewNameForSelectedFilesModeOptional =
            newNameForSelectedFilesMode === state.multipleFileSelectionNewNameModes.optional;

        // If file name and fileNameForSaving became equal, 
        // the number for checking duplication must be 1 
        //(if more than 1 item found it mean there are duplication)
        const duplicationCheckerLimitNumber = fileName === fileNameForSaving && isNewNameForSelectedFilesModeOptional ? 1 : 0;

        const isFileNameForSavingDuplicate = state.fileReferences.filter(ref =>
            ref.fileName === fileNameForSaving &&
            tools.isNullOrEmpty(ref.fileNameForSaving) || ref.fileNameForSaving === fileNameForSaving
        ).length > duplicationCheckerLimitNumber;

        if (isFileNameForSavingDuplicate) {
            $(inputNewFileNameForSaving).val("");
            $(inputNewFileNameForSaving).focus();

            motorsazanClient.messageModal.error("این نام برای فایل دیگری انتخاب شده است");
            return;
        }

        const index = state.fileReferences.findIndex(ref => ref.fileName === fileName);
        state.fileReferences[index].fileNameForSaving = fileNameForSaving;
    }

    function saveNameOfUploadedFiles(fileNames) {
        if (fileNames != null && fileNames != undefined && !Array.isArray(fileNames))
            fileNames = [fileNames];

        state.namesOfUploadedFiles.push(...fileNames);
        state.namesOfUploadedFiles = Array.from(new Set(state.namesOfUploadedFiles));

        state.fileReferences.forEach((ref, index) => ref.fileNameOnDataBase = state.namesOfUploadedFiles[index]);
    }

    function showConvertToBase64Error(error) {
        motorsazanClient.messageModal.error(error);
    }

    function showMultiSelectionModal() {
        const rootElementOfUi = generateUploaderElementsForModalOfMultipleFileSelectionMode();
        motorsazanClient.contentModal.clientShow("انتخاب فایل های ضمیمه", rootElementOfUi);
        setDom(state.config.id);
        setEvents();
        updateMultiSelectionUploaderStatus();
    }

    function showUploadedFileDemoLink(fileName, linkTitle, downloadAddress = null) {
        if (tools.isNullOrEmpty(downloadAddress)) downloadAddress = state.config.uploadedFileBaseAddress;

        dom.demoLink.setAttribute("href", downloadAddress + fileName);
        dom.demoLink.setAttribute("download", "");
        dom.demoLink.textContent = linkTitle || fileName;
        tools.showItem($(dom.demoParent));
    }

    function showUploadedFileDemoLinksForMultiSelection(fileNames, linkTitles, downloadAddresses = null) {
        tools.hideItem($(dom.multiSelectionDemoLinks));
        dom.multiSelectionDemoLinks.innerHTML = "";

        if (!fileNames || fileNames.length < 1) return;

        if (tools.isNullOrEmpty(downloadAddresses)) downloadAddresses = state.config.uploadedFileBaseAddress;
        if (!linkTitles) linkTitles = [];

        fileNames.forEach((fileName, index) => {
            const linkTitle = index < linkTitles.length ? linkTitles[index] : fileName;
            dom.multiSelectionDemoLinks.innerHTML += `<a href='${downloadAddresses}${fileName}' target="_blank" download><bdi>${linkTitle}</bdi></a>\n`;
        });
        tools.showItem($(dom.multiSelectionDemoLinks));
    }

    function startUploadFileToServer() {
        const fileRef = getFileRef();

        state.config.uploadCallback(getBase64Value(), fileRef.fileNameForSaving || fileRef.fileName);

        $(dom.uploadBtn).attr("disabled", "");

        state.isFileUploaded = true;

        const fileName = state.namesOfUploadedFiles[0];

        const uploadedFiles = state.namesOfUploadedFiles;

        state.namesOfUploadedFiles = [fileRef.fileNameForSaving || fileRef.fileName];

        state.uploadedFiles.push(fileRef);

        state.config.showDemoLinksAfterUpload && showUploadedFileDemoLink(state.namesOfUploadedFiles[0], state.namesOfUploadedFiles[0]);

        if (uploadedFiles.length > 0 && state.config.deleteUploadedFilesCallback) {
            var base64OfDeletedFile = state.uploadedFiles.filter(file => file.fileNameOnDataBase == fileName || file.fileName == fileName)[0].base64;

            state.config.deleteUploadedFilesCallback(base64OfDeletedFile, fileName);
        }
    }

    async function startUploadLargeFileToServer() {
        const fileRef = getFileRef();

        state.totalPartsCount = 0;
        state.uploadedCount = 0;

        state.countOfTotalLargeFilesThatMustBeUploaded = 1;
        var nameOfUploadedFiles = uploadLargeFile(fileRef);

        $(dom.uploadBtn).attr("disabled", "");

        state.isFileUploaded = true;

        const nameOfUploadedFile = state.namesOfUploadedFiles[0];

        if (state.namesOfUploadedFiles.length > 0 && state.config.deleteUploadedFilesCallback) {
            await deleteFilesUploadedToClient(nameOfUploadedFile);

            state.config.deleteUploadedFilesCallback(nameOfUploadedFile);

            state.namesOfUploadedFiles = [];
        }

        saveNameOfUploadedFiles(nameOfUploadedFiles);

        state.uploadedFiles.push(fileRef);

        state.config.showDemoLinksAfterUpload && showUploadedFileDemoLink(state.namesOfUploadedFiles[0], state.namesOfUploadedFiles[0]);

        state.config.uploadCallback(nameOfUploadedFiles);
    }

    function startUploadMultiSelectionFilesToServer() {
        motorsazanClient.loadingModal.show();

        const notUploadedFileReferences = state.fileReferences.filter(ref => !ref.isUploaded);

        const base64Values = notUploadedFileReferences.map(ref => ref.base64);
        const files = notUploadedFileReferences.filter(ref => !ref.isUploaded);
        const fileNames = files.map(ref => ref.fileNameForSaving || ref.fileName);

        if (files.length < 1) return;

        state.isFileUploaded = true;

        notUploadedFileReferences.forEach(ref => ref.isUploaded = true);

        state.uploadedFiles.push(...notUploadedFileReferences);
        state.uploadedFiles = Array.from(new Set(state.uploadedFiles));

        state.namesOfUploadedFiles.push(...fileNames);
        state.namesOfUploadedFiles = Array.from(new Set(state.namesOfUploadedFiles));

        const uploadedFileNames = state.fileReferences.map(file => file.fileNameOnDataBase || file.fileNameForSaving || file.fileName);
        const uploadedFileTitles = state.fileReferences.map(file => file.fileName || file.fileNameForSaving || file.fileNameOnDataBase);

        state.config.showDemoLinksAfterUpload && showUploadedFileDemoLinksForMultiSelection(uploadedFileNames, uploadedFileTitles);

        if (base64Values.length > 0 && fileNames.length > 0) {
            state.config.uploadCallback(base64Values, fileNames);
        }

        motorsazanClient.loadingModal.hide();
    }

    function startUploadMultiSelectionLargeFilesToServer() {
        const notUploadedFileReferences = state.fileReferences.filter(ref => !ref.isUploaded);

        const files = notUploadedFileReferences.filter(ref => !ref.isUploaded);

        if (files.length < 1) return;

        state.uploadedCount = 0;
        state.totalPartsCount = 0;
        showUploaderLoadingModal();

        const uploadedFiles = [];

        state.countOfTotalLargeFilesThatMustBeUploaded = files.length;

        files.forEach(fileRef => {
            var nameOfFileUploadedToClient = uploadLargeFile(fileRef);
            fileRef.file.name = nameOfFileUploadedToClient;
            uploadedFiles.push(nameOfFileUploadedToClient);
            fileRef.isUploaded = true;
        });

        saveNameOfUploadedFiles(uploadedFiles);

        state.isFileUploaded = true;

        notUploadedFileReferences.forEach(ref => ref.isUploaded = true);

        state.uploadedFiles.push(...notUploadedFileReferences);
        state.uploadedFiles.push(...notUploadedFileReferences);
        state.uploadedFiles = Array.from(new Set(notUploadedFileReferences));

        const uploadedFileNames = state.fileReferences.map(file => file.fileNameOnDataBase || file.fileNameForSaving || file.fileName);
        const uploadedFileTitles = state.fileReferences.map(file => file.fileName || file.fileNameForSaving || file.fileNameOnDataBase);

        state.config.showDemoLinksAfterUpload && showUploadedFileDemoLinksForMultiSelection(uploadedFileNames, uploadedFileTitles);

        state.config.uploadCallback(uploadedFiles);
    }

    function updateMultiSelectionUploaderStatus() {
        const selectedFilesDemoWrapper = $(`#${state.config.id}SelectedFilesDemoWrapper`);
        const attachmentUploaderDemos = $(`#${state.config.id}Demos`);
        attachmentUploaderDemos.empty();

        const isAnyFileSelected = state.fileReferences.length > 0;
        if (!isAnyFileSelected) {
            selectedFilesDemoWrapper.addClass("app__hide");
            tools.disableItem($(dom.multiSelectionClearBtn));
            return;
        }

        tools.enableItem($(dom.multiSelectionClearBtn));

        selectedFilesDemoWrapper.removeClass("app__hide");

        state.fileReferences.forEach((reference, index) => {
            const fileName = reference.fileName;
            const fileNameForSaving = reference.fileNameForSaving;

            const tr = document.createElement("tr");

            const tdIndex = document.createElement("td");
            tdIndex.textContent = index + 1;

            tr.appendChild(tdIndex);

            const tdFileName = document.createElement("td");
            tdFileName.textContent = fileName;

            tr.appendChild(tdFileName);

            const newNameForSelectedFilesMode = state.config.multipleSelectionConfig.newNameForSelectedFilesMode;

            if (newNameForSelectedFilesMode !== state.multipleFileSelectionNewNameModes.disabled) {

                const tdNewName = document.createElement("td");

                const inputNewName = document.createElement("input");

                const inputNewNameId = `inputNewName_${index}`;

                inputNewName.setAttribute("id", inputNewNameId);
                inputNewName.setAttribute("type", "text");

                if (!tools.isNullOrEmpty(fileNameForSaving)) {
                    $(inputNewName).val(fileNameForSaving);
                }
                else if (newNameForSelectedFilesMode === state.multipleFileSelectionNewNameModes.requiredForAll) {
                    inputNewName.setAttribute("placeholder", state.config.multipleSelectionConfig.newNameInputPlaceHolderWhenNewNameIsRequired);
                }
                else {
                    inputNewName.setAttribute("placeholder", "نام فایل برای ذخیره (اختیاری)");
                }

                reference.isUploaded && $(inputNewName).attr("disabled", "disabled");

                $(inputNewName).css("direction", "ltr");
                inputNewName.addEventListener("change", () => setNameForFile(fileName, inputNewName));

                tdNewName.appendChild(inputNewName);
                tr.appendChild(tdNewName);
            }

            const tdRemove = document.createElement("td");
            const btnRemove = document.createElement("button");
            btnRemove.textContent = "X";
            btnRemove.addEventListener("click", () => handleMultiSelectionModalRemoveBtn(fileName));

            tdRemove.appendChild(btnRemove);

            tr.appendChild(tdRemove);

            attachmentUploaderDemos.append(tr);
        });
    }

    function updateUploaderStatus() {
        const fileSelected = !!state.fileReferences.length > 0;

        const textValue = fileSelected ? getFileRef().fileName : state.config.placeholder;
        dom.text.textContent = textValue;

        if (fileSelected) {
            $(dom.clearBtn).removeAttr("disabled");
            $(dom.uploadBtn).removeAttr("disabled");
        } else {
            $(dom.clearBtn).attr("disabled", "");
            $(dom.uploadBtn).attr("disabled", "");
        }
    }

    function uploadLargeFile(fileRef) {
        showUploaderLoadingModal();

        let fileName = state.config.largeFileModeConfig.changeFileNameToUniqueName
            ? fileRef.fileNameForSaving || `${tools.createUUId()}.${(state.config.extensionForSavedFiles && state.config.extensionForSavedFiles.slice(1)) || fileRef.fileName.split('.').slice(-1)[0]}`
            : fileRef.fileNameForSaving || fileRef.fileNameOnDataBase || fileRef.fileName || fileRef.file.name;

        if (state.config.extensionForSavedFiles) {
            const splitFileName = fileName.split(".");
            splitFileName.pop();
            fileName = splitFileName.join(".") + state.config.extensionForSavedFiles;
        }

        const file = fileRef.file;

        // create array to store the buffer chunks  
        const fileChunk = [];
        // set up other initial vars  
        const maxFileSizeMB = state.config.largeFileModeConfig.fileChunckSizeMB;
        const bufferChunkSize = maxFileSizeMB * (1024 * 1024);
        let fileStreamPos = 0;
        // set the initial chunk length  
        let endPos = bufferChunkSize;
        const size = file.size;

        // add to the FileChunk array until we get to the end of the file  
        while (fileStreamPos < size) {
            // "slice" the file from the starting position/offset, to  the required length  
            fileChunk.push(file.slice(fileStreamPos, endPos));
            fileStreamPos = endPos; // jump by the amount read  
            endPos = fileStreamPos + bufferChunkSize; // set next chunk length  
        }
        // get total number of "files" we will be sending  
        let totalParts = fileChunk.length;
        let partCount = 0;

        state.totalPartsCount += totalParts;

        const files = [];
        while (chunk = fileChunk.shift()) {
            partCount++;
            let filePartName = fileName + ".part_" + partCount + "." + totalParts;
            files.push({ fileChunk: chunk, fileName: filePartName });
        }

        const delayForUploadingEachLimitPart = 5000;
        const partsSplitLimit = 1000;

        // If total chunks' count is more that limit,
        // split the chunks to be sended with delay
        if (totalParts > partsSplitLimit) {

            for (let i = 0; i < partsSplitLimit; i++) {
                const file = files[i];
                const chunk = file.fileChunk;
                const fileName = file.fileName;
                uploadAChunckOfLargeFileChunk(chunk, fileName);
            }

            setTimeout(() => {
                for (let i = partsSplitLimit; i < files.length; i++) {
                    const file = files[i];
                    const chunk = file.fileChunk;
                    const fileName = file.fileName;
                    uploadAChunckOfLargeFileChunk(chunk, fileName);
                }
            }, delayForUploadingEachLimitPart);
        }
        else {
            files.forEach(file => {
                const chunk = file.fileChunk;
                const fileName = file.fileName;

                uploadAChunckOfLargeFileChunk(chunk, fileName);
            });
        }

        return fileName;
    }

    async function uploadAChunckOfLargeFileChunk(chunk, fileName) {
        const formData = new FormData();
        formData.append('file', chunk, fileName);

        const result = await $.ajax({
            type: "POST",
            url: controllerName + 'Upload',
            contentType: false,
            processData: false,
            data: formData
        });

        if (result.isFileUploadFinished) {
            state.countOfTotalUploadedLargeFiles++;
            if (state.countOfTotalUploadedLargeFiles == state.countOfTotalLargeFilesThatMustBeUploaded) {
                hideUploaderLoadingModal();
                state.countOfTotalUploadedLargeFiles = 0;
                return;
            }
        }

        const fileNames = result.fileNames;

        fileNames.forEach(_ => {
            state.uploadedCount++;

            const loaded = state.uploadedCount;
            const total = state.totalPartsCount;

            const percent = `${Math.round((loaded / total) * 100)}%`;

            $("#uploaderProgress").attr({
                value: loaded,
                max: total
            });

            if (Number(percent.replace('%', '')) >= 100) {
                hideUploaderLoadingModal();
                motorsazanClient.loadingModal.show("در حال تکمیل فرایند آپلود ...");
            }
            else {
                $("#uploaderProgressLabel").text(percent);
            }
        });
    }

    function showUploaderLoadingModal() {
        if ($("#uploaderProgressWrapper").toArray().length > 0) return;

        const wrapper = document.createElement("div");
        wrapper.setAttribute("Id", "uploaderProgressWrapper");
        $(wrapper).css({
            position: "relative",
            width: "180px",
            display: "flex"
        });

        const progress = document.createElement("progress");
        progress.setAttribute("Id", "uploaderProgress");
        $(progress).css({
            width: "70%",
            height: "20px",
            "margin-left": "5px"
        });

        const label = document.createElement("label");
        label.setAttribute("Id", "uploaderProgressLabel");
        $(label).css({
            "margin-bottom": "1px",
            "vertical-align": "text-bottom",
            display: "inline-block",
            width: "20%",
            height: "10px",
            "margin-top": "-5px"
        });

        $(wrapper).append(progress);
        $(wrapper).append(label);
        $(".loading__form").append(wrapper);

        motorsazanClient.loadingModal.show();

        state.loadingModalOldText = $(".loading__text").text();
        $(".loading__text").text("در حال آپلود ...");
    }

    function hideUploaderLoadingModal() {
        motorsazanClient.loadingModal.hide();
        $(".loading__form #uploaderProgressWrapper").remove();
        $(".loading__text").text(state.loadingModalOldText);
    }

    return {
        create: create
    };
};