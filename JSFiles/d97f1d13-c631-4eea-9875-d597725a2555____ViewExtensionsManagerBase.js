System.register(["PosApi/Extend/Views/AppBarCommands", "PosApi/Extend/Views/CustomControls", "PosApi/Extend/Views/CustomGridColumns", "PosApi/Extend/Views/CustomGridItemSubfield", "PosApi/Extend/Views/CustomSearchFilters", "PosApi/Extend/Views/MenuCommands", "PosApi/Extend/Views/ViewControllers", "PosApi/TypeExtensions", "../../Extension", "../../ExtensionNameGenerator"], function (exports_1, context_1) {
    "use strict";
    var __assign = (this && this.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var AppBarCommands_1, CustomControls_1, CustomGridColumns_1, CustomGridItemSubfield_1, CustomSearchFilters_1, MenuCommands_1, ViewControllers_1, TypeExtensions_1, Extension_1, Extensibility, ExtensionPointType, Messaging, ExtensionNameGenerator_1, ViewExtensionsManagerBase;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (AppBarCommands_1_1) {
                AppBarCommands_1 = AppBarCommands_1_1;
            },
            function (CustomControls_1_1) {
                CustomControls_1 = CustomControls_1_1;
            },
            function (CustomGridColumns_1_1) {
                CustomGridColumns_1 = CustomGridColumns_1_1;
            },
            function (CustomGridItemSubfield_1_1) {
                CustomGridItemSubfield_1 = CustomGridItemSubfield_1_1;
            },
            function (CustomSearchFilters_1_1) {
                CustomSearchFilters_1 = CustomSearchFilters_1_1;
            },
            function (MenuCommands_1_1) {
                MenuCommands_1 = MenuCommands_1_1;
            },
            function (ViewControllers_1_1) {
                ViewControllers_1 = ViewControllers_1_1;
            },
            function (TypeExtensions_1_1) {
                TypeExtensions_1 = TypeExtensions_1_1;
            },
            function (Extension_1_1) {
                Extension_1 = Extension_1_1;
            },
            function (ExtensionNameGenerator_1_1) {
                ExtensionNameGenerator_1 = ExtensionNameGenerator_1_1;
            }
        ],
        execute: function () {
            Extensibility = Commerce.Extensibility;
            ExtensionPointType = Commerce.Extensibility.ExtensionPointType;
            Messaging = Commerce.Messaging;
            ViewExtensionsManagerBase = (function () {
                function ViewExtensionsManagerBase(viewName, loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    this.viewName = viewName;
                    this._appBarCommandsByAppBarName = Object.create(null);
                    this._menuCommandsByMenuName = Object.create(null);
                    this._customColumnSetCreatorsByListName = Object.create(null);
                    this._viewControllerDetails = [];
                    this._customControls = [];
                    this._searchFilterDetails = [];
                    this._customGridColumnsMap = Object.create(null);
                    this._customGridItemSubfieldsMap = Object.create(null);
                    this.loadModuleImpl = loadModuleImpl;
                    this._createAndInsertHtmlImpl = createAndInsertHtmlImpl;
                    this._renderHtmlImpl = renderHtmlImpl;
                }
                ViewExtensionsManagerBase.prototype.getCustomControlId = function (controlName, publisherName, packageName) {
                    return Commerce.StringExtensions.format(ViewExtensionsManagerBase.CUSTOM_CONTROL_ID_FORMAT_STRING, this.viewName, publisherName, packageName, controlName);
                };
                ViewExtensionsManagerBase.prototype._loadAppBarCommands = function (extensionPackage, appBarCommands, targetAppBar) {
                    var _this = this;
                    appBarCommands = Commerce.ObjectExtensions.isNullOrUndefined(appBarCommands) ? [] : appBarCommands;
                    var commandLoadSequence = Promise.resolve();
                    appBarCommands.forEach(function (appBarCommand) {
                        commandLoadSequence = commandLoadSequence.then(function () {
                            return _this._loadAppBarCommand(extensionPackage, appBarCommand, targetAppBar);
                        });
                    });
                    return commandLoadSequence;
                };
                ViewExtensionsManagerBase.prototype._getAppBarCommands = function (appBarName) {
                    appBarName = appBarName || ViewExtensionsManagerBase.DEFAULT_APP_BAR_NAME;
                    var extensionCommands = [];
                    var commandDetails = this._appBarCommandsByAppBarName[appBarName] || [];
                    commandDetails.forEach(function (commandDetail) {
                        var extensionPackage = commandDetail.package;
                        var posToCommandPort = new Messaging.PosMessagePort();
                        var commandToPosPort = new Messaging.PosMessagePort();
                        var commandContext = __assign({}, extensionPackage.context, { messageChannel: new Messaging.MessageChannelEndpoint(commandToPosPort, posToCommandPort) });
                        var command = new commandDetail.extension(commandContext);
                        var extensionCommand = new Extensibility.ExtensionCommand(command, new Messaging.MessageChannelEndpoint(posToCommandPort, commandToPosPort), extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.name, extensionPackage.packageInfo.version);
                        extensionCommands.push(extensionCommand);
                    });
                    return extensionCommands;
                };
                ViewExtensionsManagerBase.prototype._loadMenuExtensions = function (extensionPackage, menuConfig, targetMenu) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(menuConfig.customCommands)) {
                        return Promise.resolve();
                    }
                    var commandLoadSequence = Promise.resolve();
                    menuConfig.customCommands.forEach(function (menuCommand) {
                        commandLoadSequence = commandLoadSequence.then(function () {
                            return _this._loadMenuCommand(extensionPackage, menuCommand, targetMenu);
                        });
                    });
                    return commandLoadSequence;
                };
                ViewExtensionsManagerBase.prototype._getMenuCommands = function (menuName) {
                    var menuCommands = [];
                    var commandDetails = this._menuCommandsByMenuName[menuName] || [];
                    commandDetails.forEach(function (commandDetail) {
                        var extensionPackage = commandDetail.package;
                        var posToCommandPort = new Messaging.PosMessagePort();
                        var commandToPosPort = new Messaging.PosMessagePort();
                        var commandContext = __assign({}, extensionPackage.context, { messageChannel: new Messaging.MessageChannelEndpoint(commandToPosPort, posToCommandPort) });
                        var command = new commandDetail.extension(commandContext);
                        var extensionCommand = new Extensibility.ExtensionMenuCommandViewModel(command, new Messaging.MessageChannelEndpoint(posToCommandPort, commandToPosPort), extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.name, extensionPackage.packageInfo.version);
                        menuCommands.push(extensionCommand);
                    });
                    return menuCommands;
                };
                ViewExtensionsManagerBase.prototype._getCustomColumns = function (listName) {
                    var columnSetCreator = this._customColumnSetCreatorsByListName[listName];
                    return Commerce.ObjectExtensions.isFunction(columnSetCreator) ? columnSetCreator() : [];
                };
                ViewExtensionsManagerBase.prototype._loadCustomListLayout = function (extensionPackage, customListLayout, targetList) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(customListLayout) || Commerce.StringExtensions.isNullOrWhitespace(customListLayout.modulePath)) {
                        return Promise.resolve();
                    }
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPath = this._getExtensionPath(extensionPackage.packageInfo.baseUrl, customListLayout.modulePath);
                    var extensionPointName = "CustomColumnSet";
                    var extensionPointType = ExtensionPointType.CustomColumnSet;
                    var extensionName = ExtensionNameGenerator_1.default.getCustomColumnSetExtensionName(customListLayout);
                    return this.loadModuleImpl(extensionPath)
                        .then(function (columnSetCreatorModule) {
                        var columnSetCreator = (function () {
                            return columnSetCreatorModule.default(extensionPackage.context);
                        });
                        _this._customColumnSetCreatorsByListName[targetList] = columnSetCreator;
                        Commerce.RetailLogger.viewExtensionsLoaderCustomColumnSetAdded(_this.viewName, targetList, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.resolve();
                    }, function (reason) {
                        Commerce.RetailLogger.viewExtensionsLoaderCustomColumnsLoadFailedDueToErrorImportingModule(extensionPath, _this.viewName, targetList, Commerce.ErrorHelper.serializeError(reason));
                        return Promise.reject(reason);
                    }).then(function () {
                        extensionPointName = _this.viewName + "." + targetList;
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadViewController = function (extensionPackage, viewController) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(viewController)) {
                        return Promise.resolve();
                    }
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "ViewController";
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.ViewController;
                    var extensionName = ExtensionNameGenerator_1.default.getViewControllerExtensionName(viewController);
                    var extensionPath = this._getExtensionPath(extensionPackage.packageInfo.baseUrl, viewController.modulePath);
                    return this.loadModuleImpl(extensionPath)
                        .then(function (viewControllerModule) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(viewControllerModule)) {
                            var extensionViewControllerType = viewControllerModule.default;
                            if (extensionViewControllerType.prototype instanceof ViewControllers_1.ExtensionViewControllerBase) {
                                var viewControllerDetails = {
                                    package: extensionPackage,
                                    extension: extensionViewControllerType
                                };
                                _this._viewControllerDetails.push(viewControllerDetails);
                                Commerce.RetailLogger.viewExtensionsLoaderViewControllerAdded(_this.viewName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.resolve();
                            }
                            else {
                                Commerce.RetailLogger.viewExtensionsLoaderViewControllerFailedDueToInvalidModule(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                var loadError = new Error("Invalid module");
                                return Promise.reject(loadError);
                            }
                        }
                        else {
                            var loadError = new Error("Invalid module");
                            return Promise.reject(loadError);
                        }
                    }, function (error) {
                        Commerce.RetailLogger.viewExtensionsLoaderViewControllerLoadFailedDueToErrorImportingModule(extensionPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(error);
                    }).then(function () {
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._getViewControllers = function () {
                    var viewControllers = [];
                    if (Commerce.ArrayExtensions.hasElements(this._viewControllerDetails)) {
                        this._viewControllerDetails.forEach(function (viewControllerDetails) {
                            var extensionPackage = viewControllerDetails.package;
                            var posToViewControllerPort = new Messaging.PosMessagePort();
                            var viewControllerToPosPort = new Messaging.PosMessagePort();
                            var viewControllerContext = __assign({}, extensionPackage.context, { messageChannel: new Messaging.MessageChannelEndpoint(viewControllerToPosPort, posToViewControllerPort) });
                            var extensionViewController = new viewControllerDetails.extension(viewControllerContext);
                            var viewController = new Extensibility.ExtensionViewController(extensionViewController, new Messaging.MessageChannelEndpoint(posToViewControllerPort, viewControllerToPosPort), extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.name, extensionPackage.packageInfo.version);
                            viewControllers.push(viewController);
                        });
                    }
                    return viewControllers;
                };
                ViewExtensionsManagerBase.prototype._loadCustomControls = function (extensionPackage, manifestItems) {
                    var _this = this;
                    manifestItems = Commerce.ObjectExtensions.isNullOrUndefined(manifestItems) ? [] : manifestItems;
                    var controlLoadSequence = Promise.resolve();
                    manifestItems.forEach(function (manifestItem) {
                        controlLoadSequence = controlLoadSequence.then(function () {
                            return _this._loadCustomControl(extensionPackage, manifestItem);
                        });
                    });
                    return controlLoadSequence;
                };
                ViewExtensionsManagerBase.prototype._getCustomControls = function () {
                    var controlWrappers = [];
                    if (Commerce.ArrayExtensions.hasElements(this._customControls)) {
                        this._customControls.forEach(function (controlDetails) {
                            var extensionPackage = controlDetails.package;
                            var posToControlPort = new Messaging.PosMessagePort();
                            var controlToPosPort = new Messaging.PosMessagePort();
                            var commandContext = __assign({}, extensionPackage.context, { messageChannel: new Messaging.MessageChannelEndpoint(controlToPosPort, posToControlPort) });
                            var controlWrapper = {
                                extension: new controlDetails.extension(controlDetails.id, commandContext),
                                messageChannel: new Messaging.MessageChannelEndpoint(posToControlPort, controlToPosPort),
                                extensionPackage: extensionPackage
                            };
                            controlWrappers.push(controlWrapper);
                        });
                    }
                    return controlWrappers;
                };
                ViewExtensionsManagerBase.prototype._loadCustomSearchFilters = function (extensionPackage, manifestItems) {
                    var _this = this;
                    manifestItems = Commerce.ObjectExtensions.isNullOrUndefined(manifestItems) ? [] : manifestItems;
                    var searchFilterLoadSequence = Promise.resolve();
                    manifestItems.forEach(function (searchFilterConfig) {
                        searchFilterLoadSequence = searchFilterLoadSequence.then(function () {
                            return _this._loadCustomSearchFilter(extensionPackage, searchFilterConfig);
                        });
                    });
                    return searchFilterLoadSequence;
                };
                ViewExtensionsManagerBase.prototype._getCustomSearchFilters = function () {
                    var searchFilterDefinitions = this._searchFilterDetails.map(function (details) {
                        var context = __assign({}, details.package.context);
                        return new details.extension(context);
                    });
                    return searchFilterDefinitions;
                };
                ViewExtensionsManagerBase.prototype._getCustomGridColumns = function (gridName) {
                    var customGridColumns = this._customGridColumnsMap[gridName];
                    return Commerce.ObjectExtensions.isNullOrUndefined(customGridColumns) ? Object.create(null) : customGridColumns;
                };
                ViewExtensionsManagerBase.prototype._getCustomGridItemSubfields = function (gridName) {
                    var customGridItemSubfields = this._customGridItemSubfieldsMap[gridName];
                    customGridItemSubfields = Commerce.ObjectExtensions.isNullOrUndefined(customGridItemSubfields) ? [] : customGridItemSubfields;
                    return customGridItemSubfields.map(function (itemSubfieldInfo) { return itemSubfieldInfo.itemSubfield; });
                };
                ViewExtensionsManagerBase.prototype._getExtensionPath = function (baseUrl, relativeModulePath) {
                    return baseUrl + "/" + relativeModulePath;
                };
                ViewExtensionsManagerBase.prototype._loadCustomGridColumnSet = function (extensionPackage, linesGrid, targetGrid) {
                    var _this = this;
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(linesGrid)) {
                        Object.keys(linesGrid).forEach(function (columnName) {
                            extensionLoadPromises.push(_this._loadCustomGridColumn(extensionPackage, linesGrid[columnName], targetGrid, columnName));
                        });
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                ViewExtensionsManagerBase.prototype._loadCustomGridColumn = function (extensionPackage, customColumn, targetGrid, columnName) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "CustomGridColumn";
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.CustomGridColumn;
                    var extensionName = ExtensionNameGenerator_1.default.getCustomGridColumnExtensionName(customColumn);
                    return Promise.resolve().then(function () {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(customColumn) ||
                            Commerce.StringExtensions.isNullOrWhitespace(customColumn.modulePath)) {
                            return Promise.reject("Loading the custom grid column failed because the module path is not defined.");
                        }
                        var viewName = _this.viewName;
                        if (viewName !== "CartView" || (targetGrid !== "LinesGrid" && targetGrid !== "PaymentsGrid" && targetGrid !== "DeliveryGrid")) {
                            return Promise.reject("Loading the custom grid column failed because the viewName or targetGrid are wrong.");
                        }
                        if (Commerce.ObjectExtensions.isNullOrUndefined(_this._customGridColumnsMap[targetGrid])) {
                            _this._customGridColumnsMap[targetGrid] = Object.create(null);
                        }
                        var extensionPath = _this._getExtensionPath(extensionPackage.packageInfo.baseUrl, customColumn.modulePath);
                        return _this.loadModuleImpl(extensionPath).then(function (columnCreatorModule) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(columnCreatorModule)) {
                                var customGridColumnType = columnCreatorModule.default;
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(customGridColumnType) &&
                                    customGridColumnType.prototype instanceof CustomGridColumns_1.CustomGridColumnBase) {
                                    _this._customGridColumnsMap[targetGrid][columnName] = new customGridColumnType(extensionPackage.context);
                                    Commerce.RetailLogger.viewExtensionsLoaderCustomGridColumnAdded(_this.viewName, targetGrid, columnName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    return Promise.resolve();
                                }
                                else {
                                    return Promise.reject("Loading the custom grid column failed because the module does not extend from CustomGridColumnBase.");
                                }
                            }
                            else {
                                return Promise.reject("Loading the custom grid column failed because the module is invalid.");
                            }
                        }, function (error) {
                            Commerce.RetailLogger.viewExtensionsLoaderCustomGridColumnLoadFailedDueToErrorImportingModule(extensionPath, _this.viewName, targetGrid, columnName, Commerce.ErrorHelper.serializeError(error));
                            return Promise.reject(error);
                        });
                    }).then(function () {
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadCustomItemSubfield = function (extensionPackage, customItemSubfield, targetGrid) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "CustomGridItemSubfield";
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.CustomGridItemSubfield;
                    var extensionName = ExtensionNameGenerator_1.default.getCustomGridItemSubfieldExtensionName(customItemSubfield);
                    var viewName = this.viewName;
                    return Promise.resolve().then(function () {
                        var gridNamesByViewName = new Commerce.Dictionary();
                        gridNamesByViewName.setItem("CartView", ["LinesGrid"]);
                        gridNamesByViewName.setItem("ShowJournalView", ["LinesGrid"]);
                        if (!gridNamesByViewName.hasItem(viewName) || !Commerce.ArrayExtensions.hasElement(gridNamesByViewName.getItem(viewName), targetGrid)) {
                            return Promise.reject("Loading the custom item subfield failed because the viewName or gridName is wrong.");
                        }
                        if (Commerce.ObjectExtensions.isNullOrUndefined(_this._customGridItemSubfieldsMap[targetGrid])) {
                            _this._customGridItemSubfieldsMap[targetGrid] = [];
                        }
                        var extensionPath = _this._getExtensionPath(extensionPackage.packageInfo.baseUrl, customItemSubfield.modulePath);
                        return _this.loadModuleImpl(extensionPath)
                            .then(function (itemSubfieldCreatorModule) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(itemSubfieldCreatorModule)) {
                                var customGridItemSubfieldType = itemSubfieldCreatorModule.default;
                                if (Commerce.ObjectExtensions.isNullOrUndefined(customGridItemSubfieldType) ||
                                    !(customGridItemSubfieldType.prototype instanceof CustomGridItemSubfield_1.CustomGridItemSubfieldBase)) {
                                    Commerce.RetailLogger.extensibilityFrameworkGridCustomItemSubfieldMustDerive(customItemSubfield.modulePath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    return Promise.reject("Loading the custom grid item subfield failed because the module does not derive from CustomGridItemSubfieldBase.");
                                }
                                var isCustomGridItemSubfieldNameDuplicate = _this._customGridItemSubfieldsMap[targetGrid].some(function (itemSubfieldInfo) {
                                    return itemSubfieldInfo.itemSubfieldName === customItemSubfield.itemSubfieldName;
                                });
                                if (isCustomGridItemSubfieldNameDuplicate) {
                                    Commerce.RetailLogger.extensibilityFrameworkGridCustomItemSubfieldDuplicateName(customItemSubfield.modulePath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version, customItemSubfield.itemSubfieldName);
                                    return Promise.reject("Loading the custom grid item subfield failed because the name has already been used.");
                                }
                                var customGridItemSubfieldCount = _this._customGridItemSubfieldsMap[targetGrid].length;
                                if (customGridItemSubfieldCount >= ViewExtensionsManagerBase.MAX_CUSTOM_GRID_ITEM_SUBFIELDS_COUNT) {
                                    Commerce.RetailLogger.extensibilityFrameworkGridCustomItemSubfieldMaxCountExceeded(customItemSubfield.modulePath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version, ViewExtensionsManagerBase.MAX_CUSTOM_GRID_ITEM_SUBFIELDS_COUNT);
                                    return Promise.reject("Loading the custom grid item subfield failed because the max count has been exceeded.");
                                }
                                var itemSubfield = new customGridItemSubfieldType(extensionPackage.context);
                                _this._customGridItemSubfieldsMap[targetGrid].push({ itemSubfield: itemSubfield, itemSubfieldName: customItemSubfield.itemSubfieldName });
                                Commerce.RetailLogger.viewExtensionsLoaderCustomGridItemSubfieldAdded(_this.viewName, targetGrid, customItemSubfield.itemSubfieldName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.resolve();
                            }
                            else {
                                return Promise.reject("Loading the custom grid item subfield failed because the module is invalid.");
                            }
                        }, function (error) {
                            Commerce.RetailLogger.viewExtensionsLoaderCustomGridItemSubfieldLoadFailedDueToErrorImportingModule(extensionPath, _this.viewName, targetGrid, customItemSubfield.itemSubfieldName, JSON.stringify(error));
                            return Promise.reject(error);
                        });
                    }).then(function () {
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadAppBarCommand = function (extensionPackage, appBarCommand, targetAppBar) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "AppBarCommand";
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.AppBarCommand;
                    var extensionName = ExtensionNameGenerator_1.default.getAppBarCommandExtensionName(appBarCommand);
                    var extensionPath = this._getExtensionPath(extensionPackage.packageInfo.baseUrl, appBarCommand.modulePath);
                    return this.loadModuleImpl(extensionPath)
                        .then(function (commandModule) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(commandModule)) {
                            var extensionCommandType = commandModule.default;
                            if (extensionCommandType.prototype instanceof AppBarCommands_1.ExtensionCommandBase) {
                                var appBarKey = targetAppBar || ViewExtensionsManagerBase.DEFAULT_APP_BAR_NAME;
                                if (Commerce.ObjectExtensions.isNullOrUndefined(_this._appBarCommandsByAppBarName[appBarKey])) {
                                    _this._appBarCommandsByAppBarName[appBarKey] = [];
                                }
                                _this._appBarCommandsByAppBarName[appBarKey].push({ extension: extensionCommandType, package: extensionPackage });
                                targetAppBar = targetAppBar || "";
                                var appBarFriendlyName = targetAppBar + "AppBar";
                                Commerce.RetailLogger.viewExtensionsLoaderAppBarCommandAdded(_this.viewName, appBarFriendlyName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.resolve();
                            }
                            else {
                                Commerce.RetailLogger.viewExtensionsLoaderCommandLoadFailedDueToInvalidCommandModule(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                var loadError = new Error("Invalid module");
                                return Promise.reject(loadError);
                            }
                        }
                        else {
                            var loadError = new Error("Invalid module");
                            return Promise.reject(loadError);
                        }
                    }, function (error) {
                        Commerce.RetailLogger.viewExtensionsLoaderCommandLoadFailedDueToErrorImportingModule(extensionPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(error);
                    }).then(function () {
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadMenuCommand = function (extensionPackage, menuCommand, menu) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "MenuCommand";
                    var extensionPointType = ExtensionPointType.MenuCommand;
                    var extensionName = ExtensionNameGenerator_1.default.getMenuCommandExtensionName(menuCommand);
                    var extensionPath = this._getExtensionPath(extensionPackage.packageInfo.baseUrl, menuCommand.modulePath);
                    return this.loadModuleImpl(extensionPath)
                        .then(function (commandModule) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(commandModule)) {
                            var extensionCommandType = commandModule.default;
                            if (extensionCommandType.prototype instanceof MenuCommands_1.ExtensionMenuCommandBase) {
                                if (Commerce.ObjectExtensions.isNullOrUndefined(_this._menuCommandsByMenuName[menu])) {
                                    _this._menuCommandsByMenuName[menu] = [];
                                }
                                _this._menuCommandsByMenuName[menu].push({ extension: extensionCommandType, package: extensionPackage });
                                Commerce.RetailLogger.viewExtensionsLoaderMenuCommandAdded(_this.viewName, menu, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.resolve();
                            }
                            else {
                                Commerce.RetailLogger.viewExtensionsLoaderMenuCommandLoadFailedDueToInvalidCommandModule(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.reject("Load menu command failed due to invalid command module.");
                            }
                        }
                        else {
                            return Promise.reject("Load menu command failed due to invalid command module.");
                        }
                    }, function (error) {
                        Commerce.RetailLogger.viewExtensionsLoaderMenuCommandLoadFailedDueToErrorImportingModule(extensionPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(error);
                    }).then(function () {
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadCustomControl = function (extensionPackage, manifestItem) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "CustomControl";
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.CustomControl;
                    var extensionName = ExtensionNameGenerator_1.default.getCustomControlExtensionName(manifestItem);
                    return Promise.resolve().then(function () {
                        var manifestValidationErrorDetails;
                        var controlId;
                        if (Commerce.ObjectExtensions.isNullOrUndefined(manifestItem)) {
                            manifestValidationErrorDetails = {
                                errorMessage: "Manifest item cannot be null or undefined.",
                                controlName: "Unknown"
                            };
                        }
                        else if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.controlName)) {
                            manifestValidationErrorDetails = {
                                errorMessage: "Manifest item must contain a control name.",
                                controlName: "Unknown"
                            };
                        }
                        else if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.htmlPath)) {
                            manifestValidationErrorDetails = {
                                errorMessage: "Manifest item must contain an html path.",
                                controlName: manifestItem.controlName
                            };
                        }
                        else if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.modulePath)) {
                            manifestValidationErrorDetails = {
                                errorMessage: "Manifest item must contain a module path.",
                                controlName: manifestItem.controlName
                            };
                        }
                        else {
                            controlId = _this.getCustomControlId(manifestItem.controlName, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.name);
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(ViewExtensionsManagerBase.controlsByControlId[controlId])) {
                                manifestValidationErrorDetails = {
                                    errorMessage: "Control with id '" + controlId + "' already exists.",
                                    controlName: manifestItem.controlName
                                };
                            }
                        }
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(manifestValidationErrorDetails)) {
                            Commerce.RetailLogger.viewExtensionsLoaderCustomControlManifestValidationFailed(manifestValidationErrorDetails.controlName, manifestValidationErrorDetails.errorMessage, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            return Promise.resolve();
                        }
                        var extensionPath = _this._getExtensionPath(extensionPackage.packageInfo.baseUrl, manifestItem.modulePath);
                        return _this._loadControlHtmlFragment(extensionPackage, manifestItem.htmlPath).then(function () {
                            return _this.loadModuleImpl(extensionPath)
                                .then(function (controlModule) {
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(controlModule) &&
                                    !Commerce.ObjectExtensions.isNullOrUndefined(controlModule.default)) {
                                    var controlType = controlModule.default;
                                    if (controlType.prototype instanceof CustomControls_1.CustomControlBase) {
                                        var controlDetails = { extension: controlType, package: extensionPackage, id: controlId };
                                        _this._customControls.push(controlDetails);
                                        ViewExtensionsManagerBase.controlsByControlId[controlId] = controlDetails;
                                        Commerce.RetailLogger.viewExtensionsLoaderCustomControlAdded(_this.viewName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                        return Promise.resolve();
                                    }
                                    else {
                                        Commerce.RetailLogger.viewExtensionsLoaderCustomControlLoadFailedDueToInvalidControlType(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                        var loadError = new Error("Invalid control type");
                                        return Promise.reject(loadError);
                                    }
                                }
                                else {
                                    Commerce.RetailLogger.viewExtensionsLoaderCustomControlLoadFailedDueToInvalidModule(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    var loadError = new Error("Invalid module");
                                    return Promise.reject(loadError);
                                }
                            }, function (error) {
                                Commerce.RetailLogger.viewExtensionsLoaderCustomControlLoadFailedDueToErrorImportingModule(extensionPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.reject(error);
                            });
                        }, function (error) {
                            Commerce.RetailLogger.viewExtensionsLoaderCustomControlLoadFailedDueToErrorImportingModule(extensionPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            return Promise.reject(error);
                        });
                    }).then(function () {
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadControlHtmlFragment = function (extensionPackage, htmlPath) {
                    var _this = this;
                    var promise = new Promise(function (resolve, reject) {
                        if (Commerce.StringExtensions.isNullOrWhitespace(htmlPath)) {
                            resolve();
                        }
                        else {
                            var htmlFragmentPath = extensionPackage.packageInfo.baseUrl + "/" + htmlPath;
                            var fragmentWrapper_1 = _this._createAndInsertHtmlImpl(encodeURIComponent(htmlFragmentPath));
                            if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(fragmentWrapper_1)) {
                                var errorMessage = "Unable to create and insert html for extension control.";
                                Commerce.RetailLogger.extensibilityFrameworkUnableToCreateAndInsertHtmlFragmentForControl(errorMessage, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                throw new Error(errorMessage);
                            }
                            _this._renderHtmlImpl(htmlFragmentPath, fragmentWrapper_1).then(function () {
                                resolve();
                            }).catch(function (error) {
                                fragmentWrapper_1.parentNode.removeChild(fragmentWrapper_1);
                                Commerce.RetailLogger.extensibilityFrameworkControlsUnableToLoadControlFailedToRenderHtmlFragment(Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                reject(error);
                            });
                        }
                    });
                    return promise.catch(function (reason) {
                        Commerce.RetailLogger.extensibilityFrameworkControlsUnableToLoadControlHtmlFragment(Commerce.ErrorHelper.serializeError(reason), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(reason);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadCustomSearchFilter = function (extensionPackage, manifestItem) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "CustomSearchFilter";
                    var extensionPointType = ExtensionPointType.CustomSearchFilter;
                    var extensionName = ExtensionNameGenerator_1.default.getCustomSearchFilterExtensionName(manifestItem);
                    var extensionPath = this._getExtensionPath(extensionPackage.packageInfo.baseUrl, manifestItem.modulePath);
                    return this.loadModuleImpl(extensionPath)
                        .then(function (filterModule) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(filterModule)) {
                            var searchFilterType = filterModule.default;
                            if (searchFilterType.prototype instanceof CustomSearchFilters_1.CustomSearchFilterDefinitionBase) {
                                _this._searchFilterDetails.push({ extension: searchFilterType, package: extensionPackage });
                                Commerce.RetailLogger.viewExtensionsLoaderCustomSearchFilterAdded(_this.viewName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.resolve();
                            }
                            else {
                                Commerce.RetailLogger.viewExtensionsLoaderCustomSearchFilterLoadFailedDueToInvalidModule(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.reject("Loading custom search filter failed due to invalid module");
                            }
                        }
                        else {
                            return Promise.reject("Loading custom search filter failed due to invalid module");
                        }
                    }, function (error) {
                        Commerce.RetailLogger.viewExtensionsLoaderCustomSearchFilterLoadFailedDueToErrorImportingModule(extensionPath, _this.viewName, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(error);
                    }).then(function () {
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.DEFAULT_APP_BAR_NAME = "default";
                ViewExtensionsManagerBase.MAX_CUSTOM_GRID_ITEM_SUBFIELDS_COUNT = 10;
                ViewExtensionsManagerBase.CUSTOM_CONTROL_ID_FORMAT_STRING = "posCustomControl_{0}_{1}_{2}_{3}";
                ViewExtensionsManagerBase.controlsByControlId = Object.create(null);
                return ViewExtensionsManagerBase;
            }());
            exports_1("ViewExtensionsManagerBase", ViewExtensionsManagerBase);
        }
    };
});
//# sourceMappingURL=ViewExtensionsManagerBase.js.map
// SIG // Begin signature block
// SIG // MIIjpgYJKoZIhvcNAQcCoIIjlzCCI5MCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // MIOJAuGxP5TRB8odo5Jk46HgQ//QJHMVU6flFZ8O3Syg
// SIG // gg2BMIIF/zCCA+egAwIBAgITMwAAAQNeJRyZH6MeuAAA
// SIG // AAABAzANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTE4MDcxMjIwMDg0OFoX
// SIG // DTE5MDcyNjIwMDg0OFowdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // 0ZR2NuaGqzb+aflGfIuIUMuQcH+wVakkHX455wWfD6x7
// SIG // l7LOcwr71JskXBa1Od0bfjNsEfw7JvOYql1Ta6rD7BO4
// SIG // 0u/PV3/MZcuvTS4ysVYrTjQHif5pIb0+RPveEp2Fv3x2
// SIG // hn1ysXabYeaKZExGzrbVOox3k3dnIZy2WgZeR4b1PNEJ
// SIG // yg09zbLpoVB40YSI4gE8IvyvlgjMXZnA7eulWpiS9chA
// SIG // Tmpzr97jdHrTX0aXvOJnKHeZrMEOMRaPAA8B/kteVA/K
// SIG // xGU/CuOjRtv2LAM6Gb5oBRac5n80v6eHjWU5Jslj1O/F
// SIG // 3b0l/v0o9DSGeawq1V8wkTvkFGrrscoEIwIDAQABo4IB
// SIG // fjCCAXowHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFEe+wMvhpj/9ZdY48gNdt693
// SIG // 90D/MFAGA1UdEQRJMEekRTBDMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEWMBQG
// SIG // A1UEBRMNMjMwMDEyKzQzNzk2NTAfBgNVHSMEGDAWgBRI
// SIG // bmTlUAXTgqoXNzcitW2oynUClTBUBgNVHR8ETTBLMEmg
// SIG // R6BFhkNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
// SIG // b3BzL2NybC9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3JsMGEGCCsGAQUFBwEBBFUwUzBRBggrBgEFBQcw
// SIG // AoZFaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9w
// SIG // cy9jZXJ0cy9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3J0MAwGA1UdEwEB/wQCMAAwDQYJKoZIhvcNAQEL
// SIG // BQADggIBAJ/1yVMNPw0m7KJE2A3Rn2OWBks/HlzFM6Ok
// SIG // w2yvH8ABuutl7J4zEA+nrFvUvZBhF+cx58MmtKz1J9NI
// SIG // k4aI/hI1kWQi0WstO6gsFZQp0jeW5jX/DM7IBhYWniSx
// SIG // 4jn5bg542AwbtilgJ3Y0JJvduZd1ywE7rYISFiKAiRWE
// SIG // u5hQILAXJoZJr859RRVDNJbPgVwYLNST8mer4nPIPaPN
// SIG // /DIeYBzpsBsw+yy7By6WhJNFKFRczZb9oNuB2LYwykOx
// SIG // 80jAskYcXV52Klif1O7y9PpITLVhi7CMQemquJ2Q9P9q
// SIG // Qg+5PukO7JT8jYC7eOMjp3hbsm0f+VnBfbbROcl54IMc
// SIG // YAraPbDR7Ta/RQfpGzZu5T07BQOn1KclEo/mdqMTs0Va
// SIG // QzGC2tiErrmwH3X19h19URE3J+i1NYRx91eqrvqJccmY
// SIG // 0p5aZHa+jMN9FWqR8RT08tk1Mbjbcvq0dciIm2q/mEXH
// SIG // ZrLX/86SkHXk6+aG0sgb2yfAW5VvSW9YXWkq3lNL+OjK
// SIG // e/ZsFfkDGQ8RhapPmr+qV91gxvVxIPRRqJrK6dHrNEc9
// SIG // dfoi7FU/ahk5axDpWj+O9CN4MLLypjjLNY2qmFkkQLg6
// SIG // Z6QHX6D+2DtJE/sM4e0LbYNQzvB/PuDZCOiMIUpBwt7r
// SIG // jlvuA8Mdbm7mVDVmZ3J8GupS9iLEcj+uMIIHejCCBWKg
// SIG // AwIBAgIKYQ6Q0gAAAAAAAzANBgkqhkiG9w0BAQsFADCB
// SIG // iDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWlj
// SIG // cm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
// SIG // IDIwMTEwHhcNMTEwNzA4MjA1OTA5WhcNMjYwNzA4MjEw
// SIG // OTA5WjB+MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQD
// SIG // Ex9NaWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDEx
// SIG // MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA
// SIG // q/D6chAcLq3YbqqCEE00uvK2WCGfQhsqa+laUKq4Bjga
// SIG // BEm6f8MMHt03a8YS2AvwOMKZBrDIOdUBFDFC04kNeWSH
// SIG // fpRgJGyvnkmc6Whe0t+bU7IKLMOv2akrrnoJr9eWWcpg
// SIG // GgXpZnboMlImEi/nqwhQz7NEt13YxC4Ddato88tt8zpc
// SIG // oRb0RrrgOGSsbmQ1eKagYw8t00CT+OPeBw3VXHmlSSnn
// SIG // Db6gE3e+lD3v++MrWhAfTVYoonpy4BI6t0le2O3tQ5GD
// SIG // 2Xuye4Yb2T6xjF3oiU+EGvKhL1nkkDstrjNYxbc+/jLT
// SIG // swM9sbKvkjh+0p2ALPVOVpEhNSXDOW5kf1O6nA+tGSOE
// SIG // y/S6A4aN91/w0FK/jJSHvMAhdCVfGCi2zCcoOCWYOUo2
// SIG // z3yxkq4cI6epZuxhH2rhKEmdX4jiJV3TIUs+UsS1Vz8k
// SIG // A/DRelsv1SPjcF0PUUZ3s/gA4bysAoJf28AVs70b1FVL
// SIG // 5zmhD+kjSbwYuER8ReTBw3J64HLnJN+/RpnF78IcV9uD
// SIG // jexNSTCnq47f7Fufr/zdsGbiwZeBe+3W7UvnSSmnEyim
// SIG // p31ngOaKYnhfsi+E11ecXL93KCjx7W3DKI8sj0A3T8Hh
// SIG // hUSJxAlMxdSlQy90lfdu+HggWCwTXWCVmj5PM4TasIgX
// SIG // 3p5O9JawvEagbJjS4NaIjAsCAwEAAaOCAe0wggHpMBAG
// SIG // CSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBRIbmTlUAXT
// SIG // gqoXNzcitW2oynUClTAZBgkrBgEEAYI3FAIEDB4KAFMA
// SIG // dQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUw
// SIG // AwEB/zAfBgNVHSMEGDAWgBRyLToCMZBDuRQFTuHqp8cx
// SIG // 0SOJNDBaBgNVHR8EUzBRME+gTaBLhklodHRwOi8vY3Js
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
// SIG // aWNSb29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3JsMF4G
// SIG // CCsGAQUFBwEBBFIwUDBOBggrBgEFBQcwAoZCaHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNS
// SIG // b29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3J0MIGfBgNV
// SIG // HSAEgZcwgZQwgZEGCSsGAQQBgjcuAzCBgzA/BggrBgEF
// SIG // BQcCARYzaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Br
// SIG // aW9wcy9kb2NzL3ByaW1hcnljcHMuaHRtMEAGCCsGAQUF
// SIG // BwICMDQeMiAdAEwAZQBnAGEAbABfAHAAbwBsAGkAYwB5
// SIG // AF8AcwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3
// SIG // DQEBCwUAA4ICAQBn8oalmOBUeRou09h0ZyKbC5YR4WOS
// SIG // mUKWfdJ5DJDBZV8uLD74w3LRbYP+vj/oCso7v0epo/Np
// SIG // 22O/IjWll11lhJB9i0ZQVdgMknzSGksc8zxCi1LQsP1r
// SIG // 4z4HLimb5j0bpdS1HXeUOeLpZMlEPXh6I/MTfaaQdION
// SIG // 9MsmAkYqwooQu6SpBQyb7Wj6aC6VoCo/KmtYSWMfCWlu
// SIG // WpiW5IP0wI/zRive/DvQvTXvbiWu5a8n7dDd8w6vmSiX
// SIG // mE0OPQvyCInWH8MyGOLwxS3OW560STkKxgrCxq2u5bLZ
// SIG // 2xWIUUVYODJxJxp/sfQn+N4sOiBpmLJZiWhub6e3dMNA
// SIG // BQamASooPoI/E01mC8CzTfXhj38cbxV9Rad25UAqZaPD
// SIG // XVJihsMdYzaXht/a8/jyFqGaJ+HNpZfQ7l1jQeNbB5yH
// SIG // PgZ3BtEGsXUfFL5hYbXw3MYbBL7fQccOKO7eZS/sl/ah
// SIG // XJbYANahRr1Z85elCUtIEJmAH9AAKcWxm6U/RXceNcbS
// SIG // oqKfenoi+kiVH6v7RyOA9Z74v2u3S5fi63V4GuzqN5l5
// SIG // GEv/1rMjaHXmr/r8i+sLgOppO6/8MO0ETI7f33VtY5E9
// SIG // 0Z1WTk+/gFcioXgRMiF670EKsT/7qMykXcGhiJtXcVZO
// SIG // SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFX0w
// SIG // ghV5AgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAm
// SIG // BgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENB
// SIG // IDIwMTECEzMAAAEDXiUcmR+jHrgAAAAAAQMwDQYJYIZI
// SIG // AWUDBAIBBQCggdAwGQYJKoZIhvcNAQkDMQwGCisGAQQB
// SIG // gjcCAQQwHAYKKwYBBAGCNwIBCzEOMAwGCisGAQQBgjcC
// SIG // ARUwLwYJKoZIhvcNAQkEMSIEIFhr9EUYC2Tee8aBmfXz
// SIG // ULs6s7oRe0AqioJ6riFucuqiMGQGCisGAQQBgjcCAQwx
// SIG // VjBUoDaANABnAGwAbwBiAGEAbABpAHoAZQAuAGMAdQBs
// SIG // AHQAdQByAGUALgBsAHYALQBMAFYALgBqAHOhGoAYaHR0
// SIG // cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEB
// SIG // AQUABIIBAEOjbYN9tU8UzCfTKFR4xgj2ZtwBafRaozBj
// SIG // iMwQHLpC5vtUaOTXUFcJjFfwyRP4maHKddksqtfxMxjP
// SIG // V5VahcR0G44k7cL15KvYnJ1MhFgZn9nf2GfBRPOREIpK
// SIG // eZZYIxGUhyzea3CXgzRVDnlMkJ4h5Kj9BhaEDFUeL0l9
// SIG // utnOezR+4fP89r+HKKrxBQC2h+dhjAWvlMnK+4VJmdUl
// SIG // w96ihU7ktMuD9HzNnBqBpWbe7bsoREATZA+ltdlirHwt
// SIG // HrZK7RrFcZLtPnVMeukdqUMoqsSd310W3Dn5+Yiw2JM+
// SIG // mSSem0jge7+mpwVo+85vg0bfG4HdCWVfnk9UGha30KKh
// SIG // ghLlMIIS4QYKKwYBBAGCNwMDATGCEtEwghLNBgkqhkiG
// SIG // 9w0BBwKgghK+MIISugIBAzEPMA0GCWCGSAFlAwQCAQUA
// SIG // MIIBUQYLKoZIhvcNAQkQAQSgggFABIIBPDCCATgCAQEG
// SIG // CisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQgDDRP
// SIG // 7EWEWQmu3pg5br7sCjCR/Z8c21WCbrvipWBym0ACBlx1
// SIG // QL2ThxgTMjAxOTAzMTIwOTUyNTIuMzg1WjAEgAIB9KCB
// SIG // 0KSBzTCByjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldB
// SIG // MRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xLTArBgNVBAsTJE1pY3Jv
// SIG // c29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEm
// SIG // MCQGA1UECxMdVGhhbGVzIFRTUyBFU046ODZERi00QkJD
// SIG // LTkzMzUxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIHNlcnZpY2Wggg48MIIE8TCCA9mgAwIBAgITMwAA
// SIG // AN41674JVMTsPQAAAAAA3jANBgkqhkiG9w0BAQsFADB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xODA4
// SIG // MjMyMDI3MDBaFw0xOTExMjMyMDI3MDBaMIHKMQswCQYD
// SIG // VQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNVBAcTB1Jl
// SIG // ZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3Jh
// SIG // dGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IElyZWxhbmQg
// SIG // T3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQLEx1UaGFs
// SIG // ZXMgVFNTIEVTTjo4NkRGLTRCQkMtOTMzNTElMCMGA1UE
// SIG // AxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgc2VydmljZTCC
// SIG // ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAN15
// SIG // d2liCJOruuptJ7gkSPtGh8wttJKNdNE32a4HP2SRABHM
// SIG // 1L1jCCNKPQg4Xrl5nrq6GnWaW6Fe9BXLIvqJJLEOMZcY
// SIG // oO8lxmT6+1iQdf3yajj6FVzS0CKF12yyaEqSMPlLYO7T
// SIG // vkuFIGVOXP4kZzmtyujd+7y0AmYqru7nDd0IsnsHwnby
// SIG // f12eaYXkk2x/syfb6ThBCzvgoLbtdBqN+nVJLltqLH1m
// SIG // bITZowG2IkF08AkZ8JTP2gpykFxR4T/4c5udJru0cHgd
// SIG // OtaBdAq2rJXR8BdOr60ObGmEM7UOVov5uoDlBLxzzexE
// SIG // DyL7u2cNFhugdqve5YFjkY+tV8otXgkCAwEAAaOCARsw
// SIG // ggEXMB0GA1UdDgQWBBTHTLCBGH+fIgogH5vz3DEyb+3q
// SIG // rjAfBgNVHSMEGDAWgBTVYzpcijGQ80N7fEYbxTNoWoVt
// SIG // VTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1p
// SIG // Y3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNU
// SIG // aW1TdGFQQ0FfMjAxMC0wNy0wMS5jcmwwWgYIKwYBBQUH
// SIG // AQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1p
// SIG // Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNydDAMBgNVHRMBAf8EAjAAMBMG
// SIG // A1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEBCwUA
// SIG // A4IBAQAJoMkOg0U+0W4HDrw7LWjoJEFhmOe6lkZtSAWX
// SIG // WY+k4hICwG5MlG0cq45Lln+vUh+FgyKlw2WVEo8L5UbI
// SIG // ZzAMoWFwt8rnHerUGH3AKxwqOdvCI5Yxayc577CpN1A/
// SIG // T33bXPf+dLSR6vsBNCr+87T4QwnSQDCBGayPHqDi2xEb
// SIG // /5gp2QERZbk2No/ul9aowV1iACjmE1Wke/eFyboGZsZ+
// SIG // Fbm1UiWjD0RdTbvlund+KGNNeA0d/5VQnxOcHIFYgf0y
// SIG // TKs8DLy2bR1C8moebVtri8pvBNO/iz/w++ua751//00s
// SIG // UvhYvZ9USxI5tjcDFO9T/f8dho2jN8uNM4ehHzO3MIIG
// SIG // cTCCBFmgAwIBAgIKYQmBKgAAAAAAAjANBgkqhkiG9w0B
// SIG // AQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldh
// SIG // c2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNV
// SIG // BAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UE
// SIG // AxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0
// SIG // aG9yaXR5IDIwMTAwHhcNMTAwNzAxMjEzNjU1WhcNMjUw
// SIG // NzAxMjE0NjU1WjB8MQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYw
// SIG // JAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0Eg
// SIG // MjAxMDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBAKkdDbx3EYo6IOz8E5f1+n9plGt0VBDVpQoAgoX7
// SIG // 7XxoSyxfxcPlYcJ2tz5mK1vwFVMnBDEfQRsalR3OCROO
// SIG // fGEwWbEwRA/xYIiEVEMM1024OAizQt2TrNZzMFcmgqNF
// SIG // DdDq9UeBzb8kYDJYYEbyWEeGMoQedGFnkV+BVLHPk0yS
// SIG // wcSmXdFhE24oxhr5hoC732H8RsEnHSRnEnIaIYqvS2SJ
// SIG // UGKxXf13Hz3wV3WsvYpCTUBR0Q+cBj5nf/VmwAOWRH7v
// SIG // 0Ev9buWayrGo8noqCjHw2k4GkbaICDXoeByw6ZnNPOcv
// SIG // RLqn9NxkvaQBwSAJk3jN/LzAyURdXhacAQVPIk0CAwEA
// SIG // AaOCAeYwggHiMBAGCSsGAQQBgjcVAQQDAgEAMB0GA1Ud
// SIG // DgQWBBTVYzpcijGQ80N7fEYbxTNoWoVtVTAZBgkrBgEE
// SIG // AYI3FAIEDB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYw
// SIG // DwYDVR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBTV9lbL
// SIG // j+iiXGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEugSaBH
// SIG // hkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2Ny
// SIG // bC9wcm9kdWN0cy9NaWNSb29DZXJBdXRfMjAxMC0wNi0y
// SIG // My5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAC
// SIG // hj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2Nl
// SIG // cnRzL01pY1Jvb0NlckF1dF8yMDEwLTA2LTIzLmNydDCB
// SIG // oAYDVR0gAQH/BIGVMIGSMIGPBgkrBgEEAYI3LgMwgYEw
// SIG // PQYIKwYBBQUHAgEWMWh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9QS0kvZG9jcy9DUFMvZGVmYXVsdC5odG0wQAYI
// SIG // KwYBBQUHAgIwNB4yIB0ATABlAGcAYQBsAF8AUABvAGwA
// SIG // aQBjAHkAXwBTAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJ
// SIG // KoZIhvcNAQELBQADggIBAAfmiFEN4sbgmD+BcQM9naOh
// SIG // IW+z66bM9TG+zwXiqf76V20ZMLPCxWbJat/15/B4vceo
// SIG // niXj+bzta1RXCCtRgkQS+7lTjMz0YBKKdsxAQEGb3FwX
// SIG // /1z5Xhc1mCRWS3TvQhDIr79/xn/yN31aPxzymXlKkVIA
// SIG // rzgPF/UveYFl2am1a+THzvbKegBvSzBEJCI8z+0DpZaP
// SIG // WSm8tv0E4XCfMkon/VWvL/625Y4zu2JfmttXQOnxzplm
// SIG // kIz/amJ/3cVKC5Em4jnsGUpxY517IW3DnKOiPPp/fZZq
// SIG // kHimbdLhnPkd/DjYlPTGpQqWhqS9nhquBEKDuLWAmyI4
// SIG // ILUl5WTs9/S/fmNZJQ96LjlXdqJxqgaKD4kWumGnEcua
// SIG // 2A5HmoDF0M2n0O99g/DhO3EJ3110mCIIYdqwUB5vvfHh
// SIG // AN/nMQekkzr3ZUd46PioSKv33nJ+YWtvd6mBy6cJrDm7
// SIG // 7MbL2IK0cs0d9LiFAR6A+xuJKlQ5slvayA1VmXqHczsI
// SIG // 5pgt6o3gMy4SKfXAL1QnIffIrE7aKLixqduWsqdCosnP
// SIG // GUFN4Ib5KpqjEWYw07t0MkvfY3v1mYovG8chr1m1rtxE
// SIG // PJdQcdeh0sVV42neV8HR3jDA/czmTfsNv11P6Z0eGTgv
// SIG // vM9YBS7vDaBQNdrvCScc1bN+NR4Iuto229Nfj950iEkS
// SIG // oYICzjCCAjcCAQEwgfihgdCkgc0wgcoxCzAJBgNVBAYT
// SIG // AlVTMQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVy
// SIG // YXRpb25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBU
// SIG // U1MgRVNOOjg2REYtNEJCQy05MzM1MSUwIwYDVQQDExxN
// SIG // aWNyb3NvZnQgVGltZS1TdGFtcCBzZXJ2aWNloiMKAQEw
// SIG // BwYFKw4DAhoDFQBb95YJcfZ00gwbyE9C4jNPFR++zKCB
// SIG // gzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNV
// SIG // BAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEw
// SIG // MA0GCSqGSIb3DQEBBQUAAgUA4DGLMzAiGA8yMDE5MDMx
// SIG // MjA5MzQ0M1oYDzIwMTkwMzEzMDkzNDQzWjB3MD0GCisG
// SIG // AQQBhFkKBAExLzAtMAoCBQDgMYszAgEAMAoCAQACAhsB
// SIG // AgH/MAcCAQACAhFUMAoCBQDgMtyzAgEAMDYGCisGAQQB
// SIG // hFkKBAIxKDAmMAwGCisGAQQBhFkKAwKgCjAIAgEAAgMH
// SIG // oSChCjAIAgEAAgMBhqAwDQYJKoZIhvcNAQEFBQADgYEA
// SIG // IhFmk+/BqzIrQy800WMkK4CTeGKS1QidNUUnKjJS0Epl
// SIG // d+DrgRFpVYS+7VlG8xFqoM7MKFcQDJOInIphYNjvxhAM
// SIG // tSLgeuCw1JMe8ixok1DaQfKvPhyV9L24DhhZA+yR/9Iw
// SIG // wMWG+fEv97pWcUaaINp5PoVocdz/gKCo2SzonuYxggMN
// SIG // MIIDCQIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYw
// SIG // JAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0Eg
// SIG // MjAxMAITMwAAAN41674JVMTsPQAAAAAA3jANBglghkgB
// SIG // ZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0GCyqGSIb3
// SIG // DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCBArSk7fhlHGo6c
// SIG // KR7BASAXkzbo/RsX2RIoHmr/SjLs8zCB+gYLKoZIhvcN
// SIG // AQkQAi8xgeowgecwgeQwgb0EIMLhAk6rJWwcjxUvFUCD
// SIG // uMvq81HbvvY8d/GVE/CMVFVJMIGYMIGApH4wfDELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAADeNeu+CVTE
// SIG // 7D0AAAAAAN4wIgQgpBYYXtSn8GIqMJ8jUdomT2DPAkoQ
// SIG // GD01vBbMDNurDUgwDQYJKoZIhvcNAQELBQAEggEAxy4n
// SIG // hXyStd4vmWlehJZeQG/lqiyfnqCWDD5B4uimVo93ZQWN
// SIG // nUYwSF0kZF45dG2OGsDsqruFloF5brA4ph+g3KEDgsYe
// SIG // m1SrQdc5c8Zh1VvNV8vzv7FH79tWFtaf8zxVyn4Dg47g
// SIG // BEFOn+nG3btqI/r8qPDmBgn0KkzdPAB2QGFvwZRcjCzx
// SIG // cSV8dhdKVg96nxBF0pZSUnXfWQNwfyytSxFEb7Dj0mcg
// SIG // ndJdRXYoMz57Do35MjFyIn4Gsmaz49mml9xiGr1uVpRJ
// SIG // DNatJSenSaH0cwjlrN3BTiXlqMI2QjE2Pm/h0MbWmg7S
// SIG // ubA5lQKpQZz2ep4YzUTKRuwrKtHbaQ==
// SIG // End signature block
