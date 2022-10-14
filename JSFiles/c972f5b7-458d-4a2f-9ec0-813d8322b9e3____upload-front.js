angular.module("upload-front", ["upload-back", "instruments-back", "experiments-back", "files-back", "formatters", "background-upload", "laboratories", 
    "front-end", "experiments-back", "error-catcher", "enums"])
    .controller("new-upload", function ($scope, $rootScope, OperatedInstruments, Upload, ExperimentSpecies, Files, uploadStats, InstrumentTechnologyTypes,
                                        updateIndicators, UploadItem, startNewUpload, updateResumeUploadButton, UnfinishedUploads, InstrumentVendors, Instruments,
                                        Laboratories, FileUploadPaths, formatInstrument, backgroundUpload, updateBackgroundUpload, InstrumentModels, BillingFeatures, LabFeatures,
                                        ZipItem, backgroundUploader, zipAndUploadHelper, clearRoot, ExperimentAttachments, InstrumentStudyType) {
        //todo[tymchenko]: replace all the *Formatted methods with AngularJS custom formatters
        CommonLogger.setTags(["UPLOAD", "NEW-UPLOAD-CONTROLLER"]);

        $rootScope.isNewUpload = true;
        $rootScope.uploadFinished = false;
        $rootScope.uploadInBackground = false;
        $scope.clearRoot = clearRoot;

        $scope.isFolderArchiveSupport = isFolderArchiveSupport;
        $scope.isMultipleFilesSupport = isMultipleFilesSupport;
        $scope.isUploadSupported = isUploadSupported;
        $scope.getItemsForLabeling = getItemsForLabeling;
        $scope.selectNextLabel = selectNextLabel;
        $scope.isFileChooserDisabled = isFileChooserDisabled;
        $scope.isFormInvalid = isFormInvalid;
        $scope.beginUpload = beginUpload;
        $scope.zipAndUpload = zipAndUpload;
        $scope.onCancel = onCancel;
        $scope.getUploadItems = getUploadItems;
        $scope.hideConfirm = hideConfirm;
        $scope.onRemoveUploadingItem = onRemoveUploadingItem;
        $scope.onCancelConfirm = onCancelConfirm;
        $scope.getInstrumentSN = getInstrumentSN;
        $scope.getAllowedExtensions = getAllowedExtensions;
        $scope.removeFile = removeFile;
        $scope.isPauseDisabled = isPauseDisabled;
        $scope.getPauseButtonText = getPauseButtonText;
        $scope.pause = pause;
        $scope.hide = hide;
        $scope.getModalReturnUrl = getModalReturnUrl;
        $scope.showLabSelector = showLabSelector;
        $scope.showNoDefaultModelError = showNoDefaultModelError;
        $scope.showInstrumentSelector = showInstrumentSelector;

        var DEFAULT_INSTRUMENT_NAME = "Default";
        var DEFAULT_INSTRUMENT_MODEL_NAME = "Default";
        var DEFAULT_INSTRUMENT = {id: null, name: DEFAULT_INSTRUMENT_NAME};
        var NOT_SELECTED = undefined;
        var DOM = {
            FILE_CHOOSER: "#fileChooser",
            UPLOAD_DIALOG: "#uploadDialog",
            FILES_PREVIEW: "#files-preview",
            DROPBOX_OVERLAY: "#drop-box-overlay",
            UPLOAD_FILES_ALERT: ".upload-files-alert > li"
        };
        var labelsTable = null;
        var uploader = null;
        var dragNDropHelper = null;

        init();


        function init() {

            setupWatchers();
            initDragAndDropHelper();
            initUploader();
            initLabelsTableModel();
            initMaxSizeLimit();

            if (!$rootScope.newUpload) {
                $rootScope.newUpload = {};
                $rootScope.newUpload.paused = false;
            }

            if ($rootScope.uploadInProgress) {
                $scope.step = 4;
            } else {
                initFromFirstStep();
            }

            if ($scope.step != 4) {
                labelsTable.startWatchingModifications($scope);
            }

            function setupWatchers() {

                $scope.$watch("droppedFiles", onDroppedFilesChanged);
                $scope.$watch("filesToUpload", onFilesToUploadChanged);
                $scope.$watch("uploadItems", onUploadItemsChanged);
                $scope.$watch("uploadItems.state", onUploadItemsStateChanged);
                $scope.$watch("uploadItems.uploaded", onUploadItemsUploadedChanged);
                $scope.$watch("filesToUpload.length", onFilesToUploadLengthChanged);
                $scope.$watch("step", onStepChanged);
                $scope.$watch("uploadItems", onUploadItemsChanged);
                $scope.$watch("selectedInstrument.id", onSelectedInstrumentIdChanged);
                $scope.$watch("defaultSpecie.id", onDefaultSpeciesIdChanged);
                $scope.$watch("selectedTechType.id", onSelectedTechnologyTypeIdChanged);
                $scope.$watch("selectedVendor.id", onSelectedVendorIdChanged);
                $scope.$watch("selectedLab.id", onSelectedLabIdChanged);


                function onSelectedInstrumentIdChanged(newVal, oldVal) {

                    if(!newVal && oldVal || newVal && newVal != oldVal) {
                        clearFiles();
                    }
                    
                    if (!newVal || newVal == oldVal) return;

                    var selectedInstrument = $.grep($scope.instruments, function (item) {
                        return item.id == newVal;
                    })[0];
                    //noinspection JSUnresolvedVariable
                    var instrumentTechType = selectedInstrument.vendor.studyTypeItem.name;

                    $scope.selectedInstrument.lab = selectedInstrument.lab;
                    $scope.selectedInstrument.translationAvailable = instrumentTechType != InstrumentStudyType.NG
                        && $rootScope.isFeatureAvailable(LabFeatures.TRANSLATION) 
                        && $rootScope.isBillingFeatureAvailable(BillingFeatures.TRANSLATION);
                    $scope.selectedInstrument.autotranslate = selectedInstrument.autotranslate;
                    
                    function clearFiles() {
                        dragNDropHelper.setAllFiles([]);
                        $rootScope.filesToUpload = [];
                        $rootScope.filesToZip = [];
                        $rootScope.multipleFilesItems = [];
                    }
                }

                function onDroppedFilesChanged() {
                    CommonLogger.log("\"Dropped Files\" list has been changed");
                }

                function onFilesToUploadChanged() {
                    CommonLogger.log("\"Files to Upload\" list has been changed", $rootScope.filesToUpload);
                }

                function onUploadItemsUploadedChanged() {
                    CommonLogger.log("Item upload percentage has been changed");
                }

                function onUploadItemsStateChanged() {
                    CommonLogger.log("Item status has been changed");
                }

                function onDefaultSpeciesIdChanged(value) {
                    CommonLogger.log("The default specie has been changed: " + value);
                    $($rootScope.filesToUpload).each(function () {
                        var item = this;
                        if (item.specie < 0) {
                            item.specie = $scope.defaultSpecie.id;
                        }
                    });
                }

                function onFilesToUploadLengthChanged() {
                    if (!isMultipleFilesSupport() || $scope.step != 2) {
                        $scope.isPairsInvalid = false;
                        return;
                    }

                    $scope.isPairsInvalid = isMultiplePairsInvalid();
                    CommonLogger.log("\nForm invalid: " + $scope.isPairsInvalid)
                }

                function onStepChanged(step, previousStep) {
                    if(step == 2 && previousStep == 1) {
                        createDefaultInstrumentIfNeeded(afterCheck);
                    } else {
                        afterCheck();
                    }

                    function afterCheck() {
                        $scope.isPairsInvalid = false;
                        dragNDropHelper.init(step == 2 && !dragNDropHelper.isInit());
                        if (step == 3 && isMultipleFilesSupport()) {
                            $rootScope.multipleFilesItems = [];
                            processMultipleFiles();
                        }
                    }
                }

                function onUploadItemsChanged() {

                    CommonLogger.log("Upload progress items have been changed.");

                    if (!$rootScope.isZipping && $scope.step == 4 && $.grep($rootScope.uploadItems, function (item) {
                            return item.status != "done";
                        }).length == 0) {
                        $scope.newUpload.paused = false;
                        uploader.cancel();
                        hideModal();
                    }
                }

                function onSelectedTechnologyTypeIdChanged(typeId, previousTypeId) {
                    
                    if(!typeId || typeId == previousTypeId) return;

                    updateInstrumentModels();
                }

                function onSelectedVendorIdChanged(vendorId, previousVendorId) {

                    if(!vendorId || vendorId == previousVendorId || !$scope.selectedTechType.id) return;

                    updateInstrumentModels();
                }

                function onSelectedLabIdChanged(labId, previousId) {
                    if(!labId || labId == previousId) return;
                    updateAvailableInstruments();
                }
                
                function updateAvailableInstruments() {
                    
                    if(!$scope.selectedTechType.id || !$scope.selectedVendor.id || !$scope.selectedLab.id) {
                        $scope.filteredInstruments = [];
                    } else {
                        $scope.filteredInstruments = $.grep($scope.instruments, function (it) {
                            //noinspection JSUnresolvedVariable
                            return it.lab == $scope.selectedLab.id
                                && it.vendor.id == $scope.selectedVendor.id
                                && it.vendor.studyTypeItem.id == $scope.selectedTechType.id;
                        });
                    }
                    
                    $scope.selectedInstrument.id = $scope.filteredInstruments.length > 0 && getDefaultOptionValue($scope.filteredInstruments) || DEFAULT_INSTRUMENT.id;
                }
                
                function createDefaultInstrumentIfNeeded(fn) {
                    var selectedInstrument = getSelectedInstrument();
                    if(!selectedInstrument && hasDefaultModel()) {
                        var labId = $scope.selectedLab.id;
                        var modelId = $.grep($scope.instrumentModels, function (it) {
                            return it.name == DEFAULT_INSTRUMENT_MODEL_NAME;
                        })[0].id;
                        var request = {
                            labId: labId,
                            modelId: modelId
                        };
                        Instruments.createDefault(request, function (response) {
                            getInstruments(function () {
                                $scope.selectedInstrument.id = response.value;
                                fn();
                            });
                        });
                    } else {
                        fn();
                    }
                }
                
                function updateInstrumentModels() {
                    if(!$scope.selectedVendor.id || !$scope.selectedTechType.id) {
                        $scope.instrumentModels = [];
                        return;
                    }
                    InstrumentModels.getByTechnologyTypeAndVendor({vendor: $scope.selectedVendor.id, technologyType: $scope.selectedTechType.id}, function (modelsResponse) {
                        $scope.instrumentModels = modelsResponse.value;
                        updateAvailableInstruments();
                    });
                }
            }

            function initDragAndDropHelper() {
                dragNDropHelper = new DragNDropHelper({
                    containerSelector: DOM.UPLOAD_DIALOG, dropOverlaySelector: DOM.DROPBOX_OVERLAY,
                    previewAreaSelector: DOM.FILES_PREVIEW,
                    getAllFilesFunction: function () {
                        return $rootScope.filesToUpload
                    },
                    maxAttachmentSize: $scope.maxSizeInBytes,
                    setAllFilesFunction: function (files) {
                        $rootScope.filesToUpload = files;
                    },
                    wrapFileFunction: function (name, date, size, type, originalFile, ext) {
                        var extension = /*"." +*/ ext;
                        var primary = getPrimary(extension);
                        return new FileCandidate(name, date, size, type, originalFile,
                            $scope.defaultSpecie.id, extension, primary ? primary.zip : "");
                    },
                    allowedExtensionsFn: function () {
                        return isFolderArchiveSupport() && !isMultipleFilesSupport() ? [] : getFileUploadExtensions();
                    },
                    onNotAllowedSizeCallback: function () {
                        $scope.alerts.push("The attachment size exceeds " + $scope.maxSizeInBytes / 1048576 + " MB");
                    },
                    onNotAllowedExtensionCallback: function () {
                        $scope.alerts.push(DragNDropMessages.UNSUPPORTED_FILES_FILTERED);
                    },
                    onEmptyFolderCallback: function () {
                        $scope.alerts.push(DragNDropMessages.EMPTY_FOLDERS_FILTERED);
                    },
                    onFilesDroppedCallback: function () {
                        var filesToUploadAll = $rootScope.filesToUpload;

                        //Filter out those files which have already been dropped to avoid duplicates
                        var fileDescriptions = filesToUploadAll.map(function (item) {
                            return {fileName : item.name, directory : !item.size, readyToUpload : true}
                        });

                        var request = {instrumentId : $scope.selectedInstrument.id, fileDescriptions: fileDescriptions};

                        Files.isReadyToUpload(request, function (response) {
                            $rootScope.filesToUpload = $.grep($rootScope.filesToUpload, function (item) {
                                var readyToUpload = true;
                                $.each(response.value.fileDescriptions, function (i, fileDescription) {
                                    if (item.name == fileDescription.fileName){
                                        readyToUpload = fileDescription.readyToUpload;
                                    }
                                });

                                return readyToUpload;
                            });

                            if ($rootScope.filesToUpload < filesToUploadAll) {
                                $scope.alerts.push(DragNDropMessages.DUPLICATES_REMOVED);
                            }
                            setTimeout(function () {
                                showAlerts($(DOM.UPLOAD_FILES_ALERT), 700);
                            }, 300);
                            //show dropbox overlay if no files are left after filtration
                            if ($rootScope.filesToUpload.length == 0) {
                                $(DOM.DROPBOX_OVERLAY).fadeIn(0);
                                $(DOM.FILES_PREVIEW).fadeOut(0);
                            }

                            $scope.$$phase || $scope.$apply();
                        });
                    },
                    getDynamicAllowedExtensionsFn: function dynExtensions() {
                        var extensions = getDirZippedExtensions();
                        if (extensions) {
                            return extensions;
                        } else {
                            return [];
                        }
                    },
                    zipFunctions: {
                        isFolderAllowedToZipFn: function shouldDirBeZipped(dirEntry) {
                            var dirZippedExtensions = getDirZippedExtensions();
                            var isToZip = false;
                            $.each(dirZippedExtensions, function (i, extension) {
                                isToZip = endsWith(dirEntry.name, extension);
                            });
                            if (isToZip) {
                                dirEntry.progress = 0;
                                //$rootScope.filesToZip.push(dirEntry);
                            }
                            return isToZip;
                        }
                    },
                    fileChooserId: DOM.FILE_CHOOSER
                });
            }

            function initUploader() {
                uploader = backgroundUploader($scope, {
                    onUploadStart: function (/*fileId*/) {
                        CommonLogger.log("Upload started for New Upload Dialog");
                    },
                    progressHandler: function () {
                    },
                    onUploadFinished: function () {
                        CommonLogger.log("Upload finished for New Upload Dialog");
                    },
                    onUploadFailed: function () {
                        CommonLogger.log("Upload failed for New Upload");
                    }
                });
            }

            function initLabelsTableModel() {
                labelsTable = new TableModel(
                    function () {
                        return 1
                    },
                    function () {
                        var isMulti = isMultipleFilesSupport();
                        return isMulti ? $rootScope.multipleFilesItems.length : $rootScope.filesToUpload.length
                    },
                    function (x, y) {
                        var isMulti = isMultipleFilesSupport();
                        return isMulti ? $rootScope.multipleFilesItems[y].original.labels : $rootScope.filesToUpload[y].labels;
                    },
                    function (x, y, value) {
                        var isMulti = isMultipleFilesSupport();
                        if (isMulti) {
                            $rootScope.multipleFilesItems[y].original.labels = value;
                        } else {
                            $rootScope.filesToUpload[y].labels = value;
                        }
                    }
                );
            }

            function initMaxSizeLimit() {
                ExperimentAttachments.maxSizeInBytes(function (result) {
                    $scope.maxSizeInBytes = result.value;
                });
            }

            function initFromFirstStep() {

                updateResumeUploadButton();

                $scope.existingFiles = [];
                $scope.formatInstrument = formatInstrument;
                $scope.step = 1;
                $scope.selectedLab = {id: NOT_SELECTED};
                $scope.selectedTechType = {id: NOT_SELECTED};
                $scope.selectedVendor = {id: NOT_SELECTED};
                $scope.selectedModel = {id: NOT_SELECTED};
                $scope.selectedInstrument = {id: NOT_SELECTED};
                $scope.droppedFiles = []; //the batch of the files just dropped to the page
                $scope.unfinishedFileItems = [];
                $scope.defaultSpecie = {id: 1};
                $rootScope.isZipping = false;
                $rootScope.zippingProcess = {isZipping: false, progress: 0, completed: 0};
                $rootScope.zippingProcess.dir = {progress: 0};
                $scope.alerts = [];
                $scope.labitems = $rootScope.laboratories;
                $scope.selectedLab.id = getDefaultOptionValue($rootScope.laboratories);
                $scope.filteredInstruments = [];
                $scope.instrumentModels = [];
                $scope.instruments = [];
                $scope.species = [];
                $scope.techTypes = [];
                $scope.vendors = [];

                InstrumentTechnologyTypes.query(function (techTypes) {
                    $scope.techTypes = techTypes;
                    $scope.selectedTechType.id = getDefaultOptionValue($scope.techTypes);
                    InstrumentVendors.all(function (vendors) {
                        $scope.vendors = vendors;
                        $scope.selectedVendor.id = getDefaultOptionValue($scope.vendors);
                    });
                });
                
                getInstruments();
                
                ExperimentSpecies.query(function (items) {
                    $scope.species = items;
                });

                $rootScope.zipAndUploadHelper = zipAndUploadHelper($scope, uploader);
                
            }
            
            function getInstruments(fn) {
                OperatedInstruments.query(function (items) {
                    $scope.instruments = items;
                    checkNamesInInstruments();
                    fn && fn();
                });
            }

            function checkNamesInInstruments() {
                for (var i = 0; i < $scope.instruments.length - 1; i++) {
                    if ($scope.instruments[i].name.toUpperCase() === $scope.instruments[i + 1].name.toUpperCase()) {
                        $scope.instruments[i].showSerial = true;
                        $scope.instruments[i + 1].showSerial = true;
                    }
                }
            }

        }

        function showLabSelector() {
            return $scope.labitems.length > 1;
        }

        function showNoDefaultModelError() {
            return $scope.selectedLab.id
                && $scope.selectedTechType.id
                && $scope.selectedVendor.id
                && $scope.filteredInstruments.length == 0
                && !hasDefaultModel();
        }

        function hasDefaultModel() {
            return $.grep($scope.instrumentModels, function (it) {
                return it.name == DEFAULT_INSTRUMENT_MODEL_NAME;
            }).length > 0;
        }

        function showInstrumentSelector() {
            return $scope.filteredInstruments.length > 1 
                || ($scope.filteredInstruments.length == 1 && $scope.filteredInstruments[0].name != DEFAULT_INSTRUMENT_NAME)
        }

        function isUploadSupported(type) {
            switch (type) {
                case "folder-upload":
                    return ($.browser.chrome && ZipHelper.isZippingSupport());
                case "multiple-files-upload":
                    return ZipHelper.isZippingSupport();
                default:
                    return true;
            }
        }

        function getDirZippedExtensions() {
            if (!$scope.selectedInstrument.id) {
                return false;
            }
            var selectedInstrumentObj = getSelectedInstrument();
            var vendor = selectedInstrumentObj.vendor;
            if (vendor.folderArchiveUploadSupport) {
                if (vendor.multipleFiles) {
                    return getFileUploadPrimaryExtensions();
                } else {
                    return getFileUploadExtensions();
                }
            } else {
                return [];
            }
        }

        function isFolderArchiveSupport() {
            if (!$scope.selectedInstrument.id) {
                return false;
            }
            var selectedInstrumentObj = getSelectedInstrument();
            return selectedInstrumentObj.vendor.folderArchiveUploadSupport;
        }

        function isMultipleFilesSupport() {
            if (!$scope.selectedInstrument.id) {
                return false;
            }
            var selectedInstrumentObj = getSelectedInstrument();
            return selectedInstrumentObj.vendor.multipleFiles;
        }

        function getSelectedInstrument() {
            return $.grep($scope.instruments, function (instr) {
                return instr.id == $scope.selectedInstrument.id;
            })[0];
        }

        function getAdditionalExtensions(primary) {
            var selectedInstrumentObj = getSelectedInstrument();
            var extensions = selectedInstrumentObj.vendor.fileUploadExtensions;
            var allExtensions = [];
            $.each(extensions, function (i, ext) {
                $.each(this.additionalExtensions, function (key, val) {
                    if (primary && ext.name == primary) {
                        allExtensions.push(key);
                        return;
                    }
                    allExtensions.push(key);
                });
            });
            return allExtensions;
        }

        function isFileExtensionAdditional(name) {
            if (!isMultipleFilesSupport()) return false;
            var extensions = getAdditionalExtensions();
            return $.grep(extensions, function (extension) {
                    return endsWith(name, extension);
                }).length > 0
        }

        function isFileExtensionPrimary(fileName) {
            var selectedInstrumentObj = getSelectedInstrument();
            var extensions = selectedInstrumentObj.vendor.fileUploadExtensions;
            return $.grep(extensions, function (val) {
                return endsWith(fileName, val.name);
            })[0];
        }

        function getPrimaryByAdditional(additional) {
            var selectedInstrumentObj = getSelectedInstrument();
            var extensions = selectedInstrumentObj.vendor.fileUploadExtensions;
            var primary;
            $.each(extensions, function (i, ext) {
                $.each(this.additionalExtensions, function (key, val) {
                    if (key == additional) {
                        primary = ext;
                    }
                });
            });
            return primary;
        }

        function getPrimary(name) {
            var primary = getPrimaryByName(name);
            if (!primary) {
                primary = getPrimaryByAdditional(name);
            }
            return primary;
        }

        function getPrimaryByName(name) {
            var selectedInstrumentObj = getSelectedInstrument();
            var extensions = selectedInstrumentObj.vendor.fileUploadExtensions;
            return $.grep(extensions, function (val) {
                return val.name == name
            })[0];
        }

        function getMultipleCombinations() {
            var combinations = [];
            $.each(getFileUploadExtensions(), function (i, ext) {
                if (getPrimaryByName(ext)) {
                    var additionalExtensions = getAdditionalExtensions(ext);
                    $.each(additionalExtensions, function (i, additional) {
                        combinations.push([additional].concat([ext]));
                    });
                    combinations.push(additionalExtensions.concat([ext]));
                    combinations.push(getRequiredAdditionalExt(ext).concat([ext]));
                }
            });
            return combinations;
        }

        function getRequiredAdditionalExt(primary) {
            var selectedInstrumentObj = getSelectedInstrument();
            var extensions = selectedInstrumentObj.vendor.fileUploadExtensions;
            var allExtensions = [];
            $.each(extensions, function (i, ext) {
                $.each(this.additionalExtensions, function (key, val) {
                    if (ext && ext.name == primary && val == "REQUIRED") {
                        allExtensions.push(key);
                    }
                });
            });
            return allExtensions;
        }

        function getFileUploadPrimaryExtensions() {
            return getFileUploadExtensions(true);
        }

        function getFileUploadExtensions(onlyMain) {
            if (!$scope.selectedInstrument.id) {
                return [];
            }
            var selectedInstrumentObj = getSelectedInstrument();
            var extensions = selectedInstrumentObj.vendor.fileUploadExtensions;
            var allExtensions = [];
            $.each(extensions, function () {
                allExtensions.unshift(this.name);
                if (!onlyMain) {
                    $.each(this.additionalExtensions, function (key, val) {
                        allExtensions.push(key);
                    });
                }
            });

            return allExtensions;
        }

        function endsWith(str, suffix) {
            if (!suffix) return false;
            return str.toLowerCase().indexOf(suffix.toLowerCase(), str.length - suffix.length) !== -1;
        }

        function getClearFileName(name, extension) {
            return name.substr(0, name.toLowerCase().indexOf(extension.toLowerCase()));
        }

        function getItemsForLabeling() {
            if (!isMultipleFilesSupport()) {
                return $rootScope.filesToUpload;
            }
            return $rootScope.multipleFilesItems;
        }

        function selectNextLabel(name, event) {
            CommonLogger.log("\"Select Next Label\" for file with ID = " + name);
            for (var i = 0; i < $rootScope.filesToUpload.length; i++) {
                var item = $rootScope.filesToUpload[i];
                if (item.name == name) {
                    $(event.target).blur();
                    if (i < $rootScope.filesToUpload.length - 1) {
                        var nextItem = $rootScope.filesToUpload[i + 1];
                        $("#" + nextItem.labelId()).focus();
                    }
                }
            }
            event.preventDefault();
        }

        function isFileChooserDisabled() {
            var isArchive = isFolderArchiveSupport();
            var isMultiple = isMultipleFilesSupport();
            return (isArchive && !isMultiple) ||
                ($scope.selectedInstrument.id == NOT_SELECTED) ||
                (isMultiple && !$scope.isUploadSupported("multiple-files-upload"));
        }

        function isMultiplePairsInvalid() {
            if (!$scope.selectedInstrument.id) {
                return true;
            }
            var selectedInstrumentObj = getSelectedInstrument();
            if (selectedInstrumentObj.vendor.name == "Sciex") {
                return filesNotMatchExtensionCombinations([
                    [".wiff", ".wiff.scan", ".wiff.mtd"],
                    [".wiff", ".wiff.scan"],
                    [".wiff"]]);
            }

            return filesNotMatchExtensionCombinations(getMultipleCombinations());
        }

        function filesNotMatchExtensionCombinations(multipleCombinations) {
            var files = {};
            var invalid = true;
            $.each(multipleCombinations, function (i, combo) {
                $.each($rootScope.filesToUpload, function (i, file) {
                    $.each(combo, function (i, ext) {
                        if (endsWith(file.name, ext)) {
                            var clearFileName = getClearFileName(file.name, ext);
                            if (!files[clearFileName]) {
                                files[clearFileName] = [];
                            }
                            if ($.inArray(ext, files[clearFileName]) == -1) {
                                files[clearFileName].push(ext);
                            }
                        }
                    });
                });
            });
            for (var k in files) {
                //CommonLogger.log("For file: " + k);
                invalid = $.grep(multipleCombinations, function (c) {
                        /*CommonLogger.log("Combination: ");CommonLogger.log(c.sort());
                         CommonLogger.log("Presented: ");CommonLogger.log(files[k].sort());*/
                        return c.sort().toString() == files[k].sort().toString();
                    }).length == 0;
                if (invalid) {
                    break;
                }
            }
            //CommonLogger.log("Is Form Invalid called: " + invalid);
            return invalid;
        }

        function isFormInvalid(step) {

            if (step > 2) {
                return false;
            }
            if (step == 1) {
                return showNoDefaultModelError() || (!$scope.selectedInstrument.id && !hasDefaultModel());
            }
            var invalid = true;

            CommonLogger.log("Form invalid called");

            if (isMultipleFilesSupport()) {
                return isMultiplePairsInvalid();
            }

            invalid = $scope.form.$invalid || $rootScope.filesToUpload.length == 0;

            return invalid;
        }

        function mapUploadItems(files) {
            $rootScope.uploadItems = $.map(files, function (file) {
                var uploadItem = new UploadItem($scope, file.fileItemID, file.name, file.size);
                uploadItem.unfinishedUpload = file.unfinishedUpload;
                uploadItem.originalFile = file;
                return uploadItem;
            });
        }

        function beginUpload() {
            var checkFilesValidRequest = {instrument: $scope.selectedInstrument.id, fileNames: []};
            checkFilesValidRequest.fileNames = $.map($rootScope.filesToUpload, function (item) {
                return item.name;
            });
            if (isMultipleFilesSupport()) {
                Upload.checkMultipleFilesValid(checkFilesValidRequest, function (response) {
                    if (response.value) {
                        beginUpload();
                    }
                    else {
                        clearRoot();
                        $(".modal").modal("hide");
                        $("#server-error-message").dialog(serverErrorDialogProps);
                    }
                });
            } else {
                beginUpload();
            }

            function beginUpload() {
                $rootScope.uploadInProgress = true;
                $rootScope.newUpload.paused = false;

                if (isFolderArchiveSupport() && !isMultipleFilesSupport()) {
                    $scope.zipAndUpload();
                    return;
                }
                if (isMultipleFilesSupport()) {
                    zipAndUploadMultiple();
                    return;
                }
                startUpload();
            }
        }

        function startUpload() {

            var checkUploadLimitRequest =
            {
                instrumentId: $scope.selectedInstrument.id,
                bytesToUpload: 0,
                labId: $scope.selectedInstrument.lab
            };

            $.each($rootScope.filesToUpload, function (i, item) {
                checkUploadLimitRequest.bytesToUpload += item.size;
            });

            Upload.checkUploadLimit(checkUploadLimitRequest, function (response) {
                if (response.value) {
                    uploadFunction();
                } else {
                    clearRoot();
                    uploadLimitExceptionHandler();
                }
            });

            function uploadFunction() {

                var uploadRequest = {instrument: $scope.selectedInstrument.id, files: []};

                uploadRequest.files = $.map($rootScope.filesToUpload, function (item) {
                    return {
                        name: item.name,
                        labels: item.labels,
                        size: item.size,
                        specie: item.specie,
                        archive: item.archive,
                        autotranslate: !!$scope.selectedInstrument.autotranslateSelected
                    };
                });

                //in here
                Upload.uploadItems(uploadRequest, function (data) {
                    CommonLogger.log("Upload request posted successfully. Response:" + JSON.stringify(data));

                    // *** Uploading binary contents after the meta data has been successfully posted *** //

                    var files = $rootScope.filesToUpload.map(function (item) {

                        //find the fileItemID which is an ID for the item stored in the database
                        var storedItem = $.grep(data.files, function (storedItem) {
                            return storedItem.name == replaceAllWhiteSpacesWithUnderscores(item.name);
                        })[0];

                        item.originalFile.fileItemID = storedItem.storedItemId;
                        return item.originalFile;
                    });

                    mapUploadItems(files);
                    uploader.start();
                });

                function getDefaultInstrumentModelId() {
                    var defaultInstrumentModel = $.grep($scope.instrumentModels, function (it) {
                        return it.name == DEFAULT_INSTRUMENT_MODEL_NAME;
                    })[0];
                    return defaultInstrumentModel && defaultInstrumentModel.id || null;
                }

            }


        }

        function zipAndUploadMultiple() {
            $rootScope.zipAndUploadHelper.processZipping($rootScope.multipleFilesItems, function (itemsForZipAndUpload, currentIndex) {

                function completeZip(zipped) {
                    CommonLogger.log("Zip completed");
                    var zippedEntry = $.grep(itemsForZipAndUpload, function (item) {
                        return item.uploadName + ".zip" == zipped.name;
                    })[0].original;
                    $rootScope.zipAndUploadHelper.updateZippedEntry(zippedEntry, zipped);
                    $rootScope.zipAndUploadHelper.startUploadZipped(zippedEntry, $scope.selectedInstrument);
                }

                var item = itemsForZipAndUpload[currentIndex];
                var allFilesToZipEntry = [];
                $.each(item.additional, function (i, file) {
                    allFilesToZipEntry.push(file.originalFile);
                });

                CommonLogger.log(allFilesToZipEntry);

                if (isFolderArchiveSupport()) {
                    $rootScope.zipHelper.zipDirWithFiles(item.original.originalFile, item.uploadName, allFilesToZipEntry, completeZip, zipFailed);
                } else {
                    allFilesToZipEntry.push(item.original.originalFile);
                    $rootScope.zipHelper.zipFiles(item.uploadName, allFilesToZipEntry, completeZip, zipFailed);
                }
            });
        }

        function zipAndUpload() {

            $rootScope.zipAndUploadHelper.processZipping($rootScope.filesToUpload, function (itemsForZipAndUpload, index) {
                var item = itemsForZipAndUpload[index];
                $rootScope.zipHelper.zipDir(item.originalFile, item.uploadName, function (zipped) {
                    CommonLogger.log("Zip completed");
                    var zippedEntry = $.grep(itemsForZipAndUpload, function (item) {
                        return item.uploadName + ".zip" == zipped.name;
                    })[0];
                    $rootScope.zipAndUploadHelper.updateZippedEntry(zippedEntry, zipped);
                    $rootScope.zipAndUploadHelper.startUploadZipped(zippedEntry, $scope.selectedInstrument);
                }, zipFailed);
            });
        }

        function getUploadItems() {
            return [].concat($rootScope.uploadItems, $rootScope.zipItems);
        }

        function zipFailed(error) {
            $scope.$apply(function () {
                CommonLogger.error("Zip failed, errorMessage: " + error);

                $scope.zipFailed = error;
                $rootScope.uploadInProgress = false;
                $rootScope.isZipping = false;
                angular.forEach($rootScope.zipItems, function (item) {
                    item.status = "failed";
                });
            });

        }

        function terminateZipping() {
            $rootScope.zipHelper.stop(function () {
                CommonLogger.log("Terminate zipping...");
            });
        }

        function onCancel() {
            if ($scope.zipFailed) {
                $rootScope.filesToUpload = [];
                $scope.onCancelConfirm();
                hideModal();
                return;
            }
            if ($scope.showCancelConfirm) return;
            if ($scope.step == 4 && $rootScope.uploadInProgress) {
                if (!$rootScope.newUpload.paused) {
                    $rootScope.newUpload.paused = true;
                    uploader.pause();
                }
                $scope.showCancelConfirm = true;
                return;
            }
            cancelUpload();
            clearRoot();
        }

        function hideConfirm() {
            if ($scope.itemToRemove) {
                delete $scope.itemToRemove;
            }
            $scope.showCancelConfirm = false;
        }

        function onRemoveUploadingItem(itemToRemove) {
            if ($scope.showCancelConfirm) return;
            $scope.itemToRemove = itemToRemove;
            $scope.showCancelConfirm = true;
            if (!$rootScope.newUpload.paused) {
                $rootScope.newUpload.paused = true;
                uploader.pause();
            }
        }

        function onCancelConfirm() {
            if ($scope.itemToRemove) {
                if ($scope.itemToRemove.status == "in-progress") {
                    $rootScope.newUpload.paused = false;
                }
                removeUploadingItem(0, $scope.itemToRemove);
                $scope.showCancelConfirm = false;

                delete $scope.itemToRemove;
                return;
            }
            cancelUpload();
        }

        function cancelUpload() {
            $scope.newUpload.paused = false;
            if ($scope.uploadFinished) {
                hideModal();
                return;
            }

            function cancelUpload(cancelUploadRequest) {
                Upload.cancelUpload(cancelUploadRequest, function () {
                    updateResumeUploadButton();
                    hideModal();
                });
            }

            uploader.stopActive();
            //case if press cancel button  or close  dialog before starting upload
            if ($scope.step != 4) {
                hideModal();
                return;
            }
            //case if close dialog when all files have been already uploaded.
            var uploadingFiles = $.grep($rootScope.uploadItems, function (item) {
                return item.status != "done";
            });
            if (!$rootScope.isZipping && $scope.step == 4 && uploadingFiles.length == 0) {
                //an appropriate $scope.$watch("uploadItems") will be called
                return;
            }

            //case if press cancel button or close dialog while uploading
            var fileItems = $.map($rootScope.uploadItems, function (item) {
                return {id: item.fileItemID};
            });
            //case if press cancel button while zipping
            if ($rootScope.isZipping && $scope.step == 4) {
                if (fileItems.length > 0 && (uploadingFiles.length > 0 || $rootScope.zipItems > 0)) {
                    cancelUpload({files: fileItems});
                } else {
                    hideModal();
                }
                terminateZipping();
                uploader.cancel();
                return;
            }

            if (!$rootScope.isZipping && $scope.step == 4 && fileItems.length > 0) {
                var cancelUploadRequest = {files: fileItems};
                CommonLogger.log("Cancelling uploaded files: " + JSON.stringify(cancelUploadRequest));
                cancelUpload(cancelUploadRequest);
                uploader.cancel();
                return;
            }
            updateResumeUploadButton();
            hideModal();
        }

        function showAlerts(elem, fadeInTime) {
            var arrayLength = elem.length;
            for (var i = 0; i < arrayLength; i++) {
                $(elem[i]).fadeIn(fadeInTime + i * 1000).delay(1000).fadeOut(2000);
            }
            CommonLogger.log("Alerts were hidden. Clearing the old messages...");
            $scope.alerts = [];
        }

        function getInstrumentSN(instrument) {
            return instrument.showSerial ? "S/N: " + instrument.serial : "";
        }

        function getAllowedExtensions() {
            var extensions = getFileUploadExtensions();
            var result = "";
            $.each(extensions, function (i, ext) {
                //Extensions like "wiff.scan", "wiff.mtd" etc. are not supported by IE and by MAC. Substring it.
                ext = ext.substring(ext.lastIndexOf("."), ext.length);
                result += ext + ",";
            });
            return result;
        }

        function replaceAllWhiteSpacesWithUnderscores(fileName) {
            if (fileName) {
                return fileName.replace(/ /g, "_");
            }
        }

        function processMultipleFiles() {

            function getMultipleFileFromAdditional(name) {
                return $.grep($rootScope.multipleFilesItems, function (item) {
                    var extension = $.grep(getAdditionalExtensions(), function (ext) {
                        return endsWith(name, ext)
                    })[0];
                    var fileName = getClearFileName(name, extension);
                    var clearFileName = getClearFileName(item.name, item.ext);
                    return fileName == clearFileName;
                })[0];
            }

            //First - add primary file extensions
            $.each($rootScope.filesToUpload, function (i, item) {
                var ext = isFileExtensionPrimary(item.name);
                if (ext) {
                    $rootScope.multipleFilesItems.push(
                        new MultipleFilesItem(item.name, item, ext.name, ext.zip));
                }
            });
            //Second - add to each multiple file additional extensions
            $.each($rootScope.filesToUpload, function (i, item) {
                if (isFileExtensionAdditional(item.name)) {
                    var name = item.name;
                    var file = getMultipleFileFromAdditional(item.name);
                    if (file == undefined) {
                        CommonLogger.warn("Unresolved pair for additional file with name filename: " + name);
                        return;
                    }
                    file.additional.push(item);
                    CommonLogger.log($rootScope.multipleFilesItems);
                }
            });
        }

        function removeFile(index) {
            dragNDropHelper.removeFile(index);
        }

        function removeUploadingItem(index, itemToRemove) {
            var timeout = 0;

            var oldStatus = itemToRemove.status;
            if (oldStatus == "in-progress") {
                uploader.stopActive();
                timeout = 1000;
            }

            var fileToRemove = $.grep($rootScope.uploadItems, function (item) {
                return item == itemToRemove;
            });
            var fileItem = $.map(fileToRemove, function (item) {
                return {id: item.fileItemID};
            });
            itemToRemove.status = "removing";
            var cancelUploadRequest = {files: fileItem};
            CommonLogger.log("Cancelling file uploading: " + JSON.stringify(cancelUploadRequest));
            setTimeout(function () {
                Upload.cancelFileUpload(cancelUploadRequest, function () {
                    $rootScope.uploadItems = $.grep($rootScope.uploadItems, function (item) {
                        return item != itemToRemove;
                    });
                    setTimeout(function () {
                        $scope.$apply()
                    });
                });
            }, timeout);

        }

        function isPauseDisabled() {
            return $rootScope.isZipping && $.grep($rootScope.uploadItems, function (item) {
                    return item.status == "done" || item.status == "failed";
                }).length == $rootScope.uploadItems.length;
        }

        function getPauseButtonText() {
            return $rootScope.newUpload.paused ? "Continue" : "Pause";
        }

        function pause() {
            CommonLogger.log("pause clicked");
            CommonLogger.log("current pause state: " + $rootScope.newUpload.paused);

            $rootScope.newUpload.paused = !$rootScope.newUpload.paused;
            //BackgroundUploader.pause()
            uploader.pause();
            CommonLogger.log("after pause state: " + $rootScope.newUpload.paused);
        }

        function hide() {
            $scope.hide = true;
            $rootScope.uploadInBackground = true;
            hideModal();
        }

        function getModalReturnUrl() {
            return "/files/my/instrument/" + $scope.selectedInstrument.id;
        }

        // *********  Utility classes for DTO's *********

        var MultipleFilesItem = function (name, originalFile, ext, extZip) {
            this.original = originalFile;
            this.name = name;
            this.uploadName = getClearFileName(name, ext) + extZip;
            this.ext = ext;
            this.extZip = extZip;
            this.additional = [];
        };

        var FileCandidate = function (name, date, size, type, originalFile, defaultSpecie, ext, extZip, toReplace) {
            this.name = name;
            this.uploadName = getClearFileName(name, ext) + extZip;
            this.size = size;
            this.date = date;
            this.ext = ext;
            this.type = type;
            this.extZip = extZip;
            this.archive = originalFile.archive;
            this.labels = "";
            this.labelsFocused = false;
            this.mouseover = false;
            this.specie = defaultSpecie;
            this.originalFile = originalFile;
            this.toReplace = toReplace;

            this.labelId = function () {
                var name = this.name;
                var hash = 0, i, character;
                if (this.length == 0) return hash;
                for (i = 0; i < name.length; i++) {
                    character = name.charCodeAt(i);
                    hash = ((hash << 5) - hash) + character;
                    hash = hash & hash; // Convert to 32bit integer
                }
                return hash;
            }
        };

        FileCandidate.hasDuplicate = function (fileName, files) {
            var filesWithSameName = $.grep(files, function (item) {
                if (item.toReplace) {
                    return false;
                }
                if (endsWith(item.name, ".zip")) {
                    return item.name == fileName + ".zip";
                }
                return item.name == fileName;
            });
            return filesWithSameName.length > 0;
        };

        FileCandidate.unique = function (files) {
            var fileNames = {};
            for (var i = 0; i < files.length; i++)
                fileNames[files[i].name] = files[i];
            files = [];
            for (key in fileNames)
                files.push(fileNames[key]);
            return files;
        };


    })
    .controller("resume-upload", function ($scope, $rootScope, uploadStats, updateIndicators, UploadItem, UnfinishedUploads, startNewUpload, 
                                           updateResumeUploadButton, $filter, backgroundUploader, clearRoot) {
        CommonLogger.setTags(["UPLOAD", "RESUME-UPLOAD-CONTROLLER"]);
        CommonLogger.log("Resume upload");
        $scope.dontUpdateUploadButton = false;
        $rootScope.uploadFinished = false;
        $rootScope.isNewUpload = false;
        $scope.refreshNote = true;
        if (!$rootScope.resumeUpload) {
            $rootScope.resumeUpload = {};
            $rootScope.resumeUpload.paused = false;
        }
        if (!$rootScope.uploadInProgress) {
            UnfinishedUploads.query(function (files) {
                var items = $.grep(files, function (file) {
                    return !file.isArchive;

                });

                $rootScope.uploadItems = $.map(items, function (file) {
                    var uploadItem = new UploadItem($scope, file.id, file.name, file.sizeInBytes);
                    uploadItem.status = "select-file";
                    uploadItem.uploaded = file.uploaded;
                    uploadItem.unfinishedUpload = file;
                    return uploadItem;
                });

                $scope.$watch("uploadItems", function () {
                    if ($rootScope.uploadItems.length == 0) {
                        setTimeout(function () {
                            updateResumeUploadButton();
                            $scope.resumeUpload.paused = false;
                            $(".modal").modal("hide");
                        }, 0);
                        return;
                    }
                    if (!$scope.dontUpdateUploadButton) {
                        setTimeout(function () {
                            updateResumeUploadButton();
                        }, 0);
                    }
                });
            });
        }


        // ispired by https://github.com/angular/angular.js/issues/757 and http://jsfiddle.net/marcenuc/ADukg/89/

        $scope.setFile = function (element) {
            $scope.$apply(function () {
                var item = $rootScope.uploadItems[angular.element(element).attr("fileIndex")];
                if (item.name != element.files[0].name) {
                    $scope.errorMessage = "Please select file named " + item.name;
                } else if (item.size != element.files[0].size && !(item.unfinishedUpload && !item.size)) {
                    $scope.errorMessage = "Size of file " + item.name + " should be " + $filter("fileSize")(item.size);
                }
                else {
                    item.originalFile = element.files[0];
                    item.size = item.originalFile.size;
                    item.originalFile.uploaded = item.uploaded;
                    item.uploaded = item.originalFile.uploaded;
                    item.status = "waiting";
                    $scope.errorMessage = null;
                    $scope.refreshNote = !isAllFilesSet();
                }
            });
        };

        function isAllFilesSet() {
            return $.grep($scope.uploadItems, function (item) {
                    return item.status == "select-file";
                }).length == 0;
        }

        var uploader = backgroundUploader($scope, {
            onUploadStart: function (/*fileId*/) {
                CommonLogger.log("Upload started for Resume Upload Dialog");
            },
            progressHandler: function () {
            },
            onUploadFinished: function () {
                CommonLogger.log("Upload finished for Resume Upload Dialog");
                if ($rootScope.uploadFinished && $.grep($rootScope.uploadItems, function (item) {
                        return item.status == "select-file";
                    }).length > 0) {
                    $rootScope.uploadStarted = false;
                }
            },
            onUploadFailed: function () {
                CommonLogger.log("Upload failed for Resume Upload");
            }
        });

        $scope.isUploadStarted = function () {
            return $rootScope.uploadStarted;
        };

        $scope.uploadFinished = function () {
            return $rootScope.uploadFinished;
        };

        $scope.nothingToUpload = function () {
            return $.grep($rootScope.uploadItems, function (item) {
                    return item.status == "done" || item.status == "failed";
                }).length == $rootScope.uploadItems.length;
        };

        $scope.getPauseButtonText = function () {
            return $rootScope.resumeUpload.paused ? "Continue" : "Pause";
        };

        $scope.onCancel = function () {
            if (!$rootScope.uploadInProgress) {
                clearRoot();
                hideModal();
                setTimeout(function () {
                    updateResumeUploadButton();
                }, 1000);
                return;
            }
            if ($scope.showCancelConfirm) {
                return;
            }
            $scope.showCancelConfirm = true;
            if (!$rootScope.resumeUpload.paused) {
                $rootScope.resumeUpload.paused = true;
                uploader.pause();
            }
        };

        $scope.onCancelAll = function () {
            if ($scope.showCancelConfirm) {
                return;
            }
            $scope.showCancelConfirm = true;
            $scope.cancelAll = true;
            if (!$rootScope.resumeUpload.paused) {
                $rootScope.resumeUpload.paused = true;
                uploader.pause();
            }
        };

        $scope.onCancelItem = function (item) {
            if ($scope.showCancelConfirm) {
                return;
            }
            if (item.status == "select-file") {
                $scope.remove(item);
            } else {
                if (!$rootScope.resumeUpload.paused) {
                    $rootScope.resumeUpload.paused = true;
                    uploader.pause();
                }
                $scope.showCancelConfirm = true;
                $scope.itemToRemove = item;
            }
        };

        $scope.hideConfirm = function () {
            $scope.itemToRemove = null;
            $scope.cancelAll = false;
            $scope.showCancelConfirm = false;
        };

        $scope.onCancelConfirm = function () {
            $scope.showCancelConfirm = false;
            if ($scope.itemToRemove) {
                $scope.remove($scope.itemToRemove);
                $scope.itemToRemove = null;
                return;
            } else if ($scope.cancelAll) {
                $scope.dontUpdateUploadButton = true;
                $scope.removeAll();
                $scope.dontUpdateUploadButton = false;
            }

            $rootScope.uploadFinished = true;
            $rootScope.uploadInProgress = false;
            $rootScope.resumeUpload.paused = false;
            uploader.cancel();
            hideModal();
            setTimeout(function () {
                updateResumeUploadButton();
            }, 1000);
        };

        $scope.showMinimizeButton = function () {
            return !$scope.showCancelConfirm && $rootScope.uploadInProgress && !$rootScope.uploadFinished;
        };

        $scope.resume = function () {
            $rootScope.uploadFinished = false;
            $rootScope.uploadInProgress = true;
            $rootScope.resumeUpload.paused = false;
            uploader.start(true, true);
        };

        $scope.readyToResume = function () {
            return $rootScope.uploadItems && $.grep($rootScope.uploadItems, function (item) {
                    return item.status == "waiting";
                }).length > 0;
        };

        $scope.remove = function (itemToRemove) {
            itemToRemove.status = "removing";
            itemToRemove.unfinishedUpload.$remove(function () {
                $rootScope.uploadItems = $.grep($rootScope.uploadItems, function (item) {
                    return item != itemToRemove;
                });
            });
        };

        $scope.removeAll = function () {
            CommonLogger.log("Removing all");
            $.each($rootScope.uploadItems, function (index, item) {
                $scope.remove(item);
            });
        };

        $scope.pause = function () {
            $rootScope.resumeUpload.paused = !$rootScope.resumeUpload.paused;
            uploader.pause();
        };

        $rootScope.$watch("uploadInProgress", function (n) {
            if (!n) {
                setTimeout(function () {
                    updateResumeUploadButton();
                }, 0);
            }
        })

    });

function uploadLimitExceptionHandler() {
    $(".modal").modal("hide");

    $("#upload-limit-error-message").dialog({
        title: "Upload Limit Exceeded",
        draggable: false,
        dialogClass: "message-dialog warning",
        modal: true,
        resizable: false,
        width: 450,
        buttons: {
            OK: function () {
                $(this).dialog("close")
            }
        }
    });
}

var serverErrorDialogProps = {
    title: "Server Error",
    draggable: false,
    dialogClass: "message-dialog error",
    modal: true,
    resizable: false,
    width: 450,
    buttons: [{
        text: "Close",
        click: function () {
            $(this).dialog("close");
        },
        class: "secondary-action"
    }]
};
