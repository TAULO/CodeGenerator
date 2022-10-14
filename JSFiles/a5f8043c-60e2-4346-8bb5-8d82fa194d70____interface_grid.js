// if(typeof(BX.YNSIRInterfaceGridManager) == 'undefined')
{
    BX.YNSIRInterfaceGridManager = function()
    {
        this._id = '';
        this._settings = {};
        this._messages = {};
        this._enableIterativeDeletion = false;
        this._toolbarMenu = null;
        this._applyButtonClickHandler = BX.delegate(this._handleFormApplyButtonClick, this);
        this._setFilterFieldsHandler = BX.delegate(this._onSetFilterFields, this);
        this._getFilterFieldsHandler = BX.delegate(this._onGetFilterFields, this);
        this._deletionProcessDialog = null;
    };

    BX.YNSIRInterfaceGridManager.prototype =
        {
            initialize: function(id, settings)
            {
                this._id = id;
                this._settings = settings ? settings : {};

                this._makeBindings();
                BX.ready(BX.delegate(this._bindOnGridReload, this));

                BX.addCustomEvent(
                    window,
                    "YNSIRInterfaceToolbarMenuShow",
                    BX.delegate(this._onToolbarMenuShow, this)
                );
                BX.addCustomEvent(
                    window,
                    "YNSIRInterfaceToolbarMenuClose",
                    BX.delegate(this._onToolbarMenuClose, this)
                );

                BX.addCustomEvent(
                    window,
                    "BXInterfaceGridCheckColumn",
                    BX.delegate(this._onGridColumnCheck, this)
                );

                this._messages = this.getSetting("messages", {});

                this._enableIterativeDeletion = !!this.getSetting("enableIterativeDeletion", false);
                if(this._enableIterativeDeletion)
                {
                    BX.addCustomEvent(
                        window,
                        "BXInterfaceGridDeleteRow",
                        BX.delegate(this._onGridRowDelete, this)
                    );
                }
            },
            _onGridColumnCheck: function(sender, eventArgs)
            {
                if(this._toolbarMenu)
                {
                    eventArgs["columnMenu"] = this._toolbarMenu.GetMenuByItemId(eventArgs["targetElement"].id);
                }
            },
            _onGridRowDelete: function(sender, eventArgs)
            {
                var gridId = BX.type.isNotEmptyString(eventArgs["gridId"]) ? eventArgs["gridId"] : "";
                if(gridId === "" || gridId !== this.getGridId())
                {
                    return;
                }

                eventArgs["cancel"] = true;
                BX.defer(BX.delegate(this.openDeletionDialog, this))(
                    {
                        gridId: gridId,
                        ids: eventArgs["selectedIds"],
                        processAll: eventArgs["forAll"]
                    }
                );
            },
            _onToolbarMenuShow: function(sender, eventArgs)
            {
                this._toolbarMenu = eventArgs["menu"];
                eventArgs["items"] = this.getGridJsObject().settingsMenu;
            },
            _onToolbarMenuClose: function(sender, eventArgs)
            {
                if(eventArgs["menu"] === this._toolbarMenu)
                {
                    this._toolbarMenu = null;
                    this.getGridJsObject().SaveColumns();
                }
            },
            getId: function()
            {
                return this._id;
            },
            reinitialize: function()
            {
                this._makeBindings();
                BX.onCustomEvent(window, 'BXInterfaceGridManagerReinitialize', [this]);
            },
            _makeBindings: function()
            {
                var form = this.getForm();
                if(form)
                {
                    BX.unbind(form['apply'], 'click', this._applyButtonClickHandler);
                    BX.bind(form['apply'], 'click', this._applyButtonClickHandler);
                }

                BX.ready(BX.delegate(this._bindOnSetFilterFields, this));
            },
            _bindOnGridReload: function()
            {
                BX.addCustomEvent(
                    window,
                    'BXInterfaceGridAfterReload',
                    BX.delegate(this._makeBindings, this)
                );
            },
            _bindOnSetFilterFields: function()
            {
                var grid = this.getGridJsObject();

                BX.removeCustomEvent(grid, 'AFTER_SET_FILTER_FIELDS', this._setFilterFieldsHandler);
                BX.addCustomEvent(grid, 'AFTER_SET_FILTER_FIELDS', this._setFilterFieldsHandler);

                BX.removeCustomEvent(grid, 'AFTER_GET_FILTER_FIELDS', this._getFilterFieldsHandler);
                BX.addCustomEvent(grid, 'AFTER_GET_FILTER_FIELDS', this._getFilterFieldsHandler);
            },
            registerFilter: function(filter)
            {
                BX.addCustomEvent(
                    filter,
                    'AFTER_SET_FILTER_FIELDS',
                    BX.delegate(this._onSetFilterFields, this)
                );

                BX.addCustomEvent(
                    filter,
                    'AFTER_GET_FILTER_FIELDS',
                    BX.delegate(this._onGetFilterFields, this)
                );
            },
            _onSetFilterFields: function(sender, form, fields)
            {
                var infos = this.getSetting('filterFields', null);
                if(!BX.type.isArray(infos))
                {
                    return;
                }

                var isSettingsContext = form.name.indexOf('flt_settings') === 0;

                var count = infos.length;
                var element = null;
                var paramName = '';
                for(var i = 0; i < count; i++)
                {
                    var info = infos[i];
                    var id = BX.type.isNotEmptyString(info['id']) ? info['id'] : '';
                    var type = BX.type.isNotEmptyString(info['typeName']) ? info['typeName'].toUpperCase() : '';
                    var params = info['params'] ? info['params'] : {};

                    if(type === 'USER')
                    {
                        var data = params['data'] ? params['data'] : {};
                        this._setElementByFilter(
                            data[isSettingsContext ? 'settingsElementId' : 'elementId'],
                            data['paramName'],
                            fields
                        );

                        var search = params['search'] ? params['search'] : {};
                        this._setElementByFilter(
                            search[isSettingsContext ? 'settingsElementId' : 'elementId'],
                            search['paramName'],
                            fields
                        );
                    }
                }
            },
            _setElementByFilter: function(elementId, paramName, filter)
            {
                var element = BX.type.isNotEmptyString(elementId) ? BX(elementId) : null;
                if(BX.type.isElementNode(element))
                {
                    element.value = BX.type.isNotEmptyString(paramName) && filter[paramName] ? filter[paramName] : '';
                }
            },
            _onGetFilterFields: function(sender, form, fields)
            {
                var infos = this.getSetting('filterFields', null);
                if(!BX.type.isArray(infos))
                {
                    return;
                }

                var isSettingsContext = form.name.indexOf('flt_settings') === 0;
                var count = infos.length;
                for(var i = 0; i < count; i++)
                {
                    var info = infos[i];
                    var id = BX.type.isNotEmptyString(info['id']) ? info['id'] : '';
                    var type = BX.type.isNotEmptyString(info['typeName']) ? info['typeName'].toUpperCase() : '';
                    var params = info['params'] ? info['params'] : {};

                    if(type === 'USER')
                    {
                        var data = params['data'] ? params['data'] : {};
                        this._setFilterByElement(
                            data[isSettingsContext ? 'settingsElementId' : 'elementId'],
                            data['paramName'],
                            fields
                        );

                        var search = params['search'] ? params['search'] : {};
                        this._setFilterByElement(
                            search[isSettingsContext ? 'settingsElementId' : 'elementId'],
                            search['paramName'],
                            fields
                        );
                    }
                }
            },
            _setFilterByElement: function(elementId, paramName, filter)
            {
                var element = BX.type.isNotEmptyString(elementId) ? BX(elementId) : null;
                if(BX.type.isElementNode(element) && BX.type.isNotEmptyString(paramName))
                {
                    filter[paramName] = element.value;
                }
            },
            getSetting: function (name, defaultval)
            {
                return typeof(this._settings[name]) != 'undefined' ? this._settings[name] : defaultval;
            },
            getMessage: function(name)
            {
                return this._messages.hasOwnProperty(name) ? this._messages[name] : name;
            },
            getOwnerType: function()
            {
                return this.getSetting('ownerType', '');
            },
            getForm: function()
            {
                return document.forms[this.getSetting('formName', '')];
            },
            getGridId: function()
            {
                return this.getSetting('gridId', '');
            },
            getGrid: function()
            {
                return BX(this.getSetting('gridId', ''));
            },
            getGridJsObject: function()
            {
                var gridId = this.getSetting('gridId', '');
                return BX.type.isNotEmptyString(gridId) ? window['bxGrid_' + gridId] : null;
            },
            getAllRowsCheckBox: function()
            {
                return BX(this.getSetting('allRowsCheckBoxId', ''));
            },
            getEditor: function()
            {
                var editorId = this.getSetting('activityEditorId', '');
                return BX.YNSIRActivityEditor.items[editorId] ? BX.YNSIRActivityEditor.items[editorId] : null;
            },
            reload: function()
            {
                var gridId = this.getSetting("gridId");
                if(!BX.type.isNotEmptyString(gridId))
                {
                    return false;
                }

                var grid = window['bxGrid_' + gridId];
                if(!grid || !BX.type.isFunction(grid.Reload))
                {
                    return false;
                }
                grid.Reload();
                return true;
            },
            getServiceUrl: function()
            {
                return this.getSetting('serviceUrl', '/bitrix/components/bitrix/crm.activity.editor/ajax.php');
            },
            getListServiceUrl: function()
            {
                return this.getSetting('listServiceUrl', '');
            },
            _loadCommunications: function(commType, ids, callback)
            {
                BX.ajax(
                    {
                        'url': this.getServiceUrl(),
                        'method': 'POST',
                        'dataType': 'json',
                        'data':
                            {
                                'ACTION' : 'GET_ENTITIES_DEFAULT_COMMUNICATIONS',
                                'COMMUNICATION_TYPE': commType,
                                'ENTITY_TYPE': this.getOwnerType(),
                                'ENTITY_IDS': ids,
                                'GRID_ID': this.getSetting('gridId', '')
                            },
                        onsuccess: function(data)
                        {
                            if(data && data['DATA'] && callback)
                            {
                                callback(data['DATA']);
                            }
                        },
                        onfailure: function(data)
                        {
                        }
                    }
                );
            },
            _onEmailDataLoaded: function(data)
            {
                var settings = {};
                if(data)
                {
                    var items = BX.type.isArray(data['ITEMS']) ? data['ITEMS'] : [];
                    if(items.length > 0)
                    {
                        var entityType = data['ENTITY_TYPE'] ? data['ENTITY_TYPE'] : '';
                        var comms = settings['communications'] = [];
                        for(var i = 0; i < items.length; i++)
                        {
                            var item = items[i];
                            comms.push(
                                {
                                    'type': 'EMAIL',
                                    'entityTitle': '',
                                    'entityType': entityType,
                                    'entityId': item['entityId'],
                                    'value': item['value']
                                }
                            );
                        }
                    }
                }

                this.addEmail(settings);
            },
            _onCallDataLoaded: function(data)
            {
                var settings = {};
                if(data)
                {
                    var items = BX.type.isArray(data['ITEMS']) ? data['ITEMS'] : [];
                    if(items.length > 0)
                    {
                        var entityType = data['ENTITY_TYPE'] ? data['ENTITY_TYPE'] : '';
                        var comms = settings['communications'] = [];
                        var item = items[0];
                        comms.push(
                            {
                                'type': 'PHONE',
                                'entityTitle': '',
                                'entityType': entityType,
                                'entityId': item['entityId'],
                                'value': item['value']
                            }
                        );
                        settings['ownerType'] = entityType;
                        settings['ownerID'] = item['entityId'];
                    }
                }

                this.addCall(settings);
            },
            _onMeetingDataLoaded: function(data)
            {
                var settings = {};
                if(data)
                {
                    var items = BX.type.isArray(data['ITEMS']) ? data['ITEMS'] : [];
                    if(items.length > 0)
                    {
                        var entityType = data['ENTITY_TYPE'] ? data['ENTITY_TYPE'] : '';
                        var comms = settings['communications'] = [];
                        var item = items[0];
                        comms.push(
                            {
                                'type': '',
                                'entityTitle': '',
                                'entityType': entityType,
                                'entityId': item['entityId'],
                                'value': item['value']
                            }
                        );
                        settings['ownerType'] = entityType;
                        settings['ownerID'] = item['entityId'];
                    }
                }

                this.addMeeting(settings);
            },
            _onDeletionProcessStateChange: function(sender)
            {
                if(sender !== this._deletionProcessDialog || sender.getState() !== BX.YNSIRLongRunningProcessState.completed)
                {
                    return;
                }

                this._deletionProcessDialog.close();
                this.reload();
            },
            _handleFormApplyButtonClick: function(e)
            {
                var form = this.getForm();
                if(!form)
                {
                    return true;
                }

                var selected = form.elements['action_button_' + this.getSetting('gridId', '')];
                if(!selected)
                {
                    return;
                }

                var value = selected.value;
                if (value === 'subscribe')
                {
                    var allRowsCheckBox = this.getAllRowsCheckBox();
                    var ids = [];
                    if(!(allRowsCheckBox && allRowsCheckBox.checked))
                    {
                        var checkboxes = BX.findChildren(
                            this.getGrid(),
                            {
                                'tagName': 'INPUT',
                                'attribute': { 'type': 'checkbox' }
                            },
                            true
                        );

                        if(checkboxes)
                        {
                            for(var i = 0; i < checkboxes.length; i++)
                            {
                                var checkbox = checkboxes[i];
                                if(checkbox.id.indexOf('ID') == 0 && checkbox.checked)
                                {
                                    ids.push(checkbox.value);
                                }
                            }
                        }
                    }
                    if (value === 'subscribe')
                    {
                        this._loadCommunications('EMAIL', ids, BX.delegate(this._onEmailDataLoaded, this));
                        return BX.PreventDefault(e);
                    }
                }

                return true;
            },
            openDeletionDialog: function(params)
            {
                var contextId = BX.util.getRandomString(12);
                var processParams =
                    {
                        "CONTEXT_ID" : contextId,
                        "GRID_ID": params["gridId"],
                        "ENTITY_TYPE_NAME": this.getOwnerType(),
                        "USER_FILTER_HASH": this.getSetting("userFilterHash", "")
                    };

                var processAll = params["processAll"];
                var ids = params["ids"];
                if(processAll)
                {
                    processParams["PROCESS_ALL"] = "Y";
                }
                else
                {
                    processParams["ENTITY_IDS"] = ids;
                }

                this._deletionProcessDialog = BX.YNSIRLongRunningProcessDialog.create(
                    contextId,
                    {
                        serviceUrl: this.getListServiceUrl(),
                        action: "DELETE",
                        params: processParams,
                        title: this.getMessage("deletionDialogTitle"),
                        summary: this.getMessage("deletionDialogSummary")
                    }
                );
                BX.addCustomEvent(
                    this._deletionProcessDialog,
                    "ON_STATE_CHANGE",
                    BX.delegate(this._onDeletionProcessStateChange, this)
                );
                this._deletionProcessDialog.show();
                this._deletionProcessDialog.start();
            },
            addEmail: function(settings)
            {
                var editor = this.getEditor();
                if(!editor)
                {
                    return;
                }

                settings = settings ? settings : {};
                if(typeof(settings['ownerID']) !== 'undefined')
                {
                    settings['ownerType'] = this.getOwnerType();
                }

                editor.addEmail(settings);
            },
            addCall: function(settings)
            {
                var editor = this.getEditor();
                if(!editor)
                {
                    return;
                }

                settings = settings ? settings : {};
                if(typeof(settings['ownerID']) !== 'undefined')
                {
                    settings['ownerType'] = this.getOwnerType();
                }
                //TODO: temporary
                BX.namespace('BX.YNSIR.Activity');
                if(typeof BX.YNSIR.Activity.Planner !== 'undefined')
                {

                    (new BX.YNSIR.Activity.Planner()).showEdit({
                        TYPE_ID: BX.YNSIRActivityType.call,
                        OWNER_TYPE: settings['ownerType'],
                        OWNER_ID: settings['ownerID']
                    });
                    return;
                }

                editor.addCall(settings);
            },
            addMeeting: function(settings)
            {
                var editor = this.getEditor();
                if(!editor)
                {
                    return;
                }

                settings = settings ? settings : {};
                if(typeof(settings['ownerID']) !== 'undefined')
                {
                    settings['ownerType'] = this.getOwnerType();
                }
                //TODO: temporary
                BX.namespace('BX.YNSIR.Activity');
                if(typeof BX.YNSIR.Activity.Planner !== 'undefined')
                {

                    (new BX.YNSIR.Activity.Planner()).showEdit({
                        TYPE_ID: BX.YNSIRActivityType.meeting,
                        OWNER_TYPE: settings['ownerType'],
                        OWNER_ID: settings['ownerID']
                    });
                    return;
                }

                editor.addMeeting(settings);
            },
            addTask: function(settings)
            {
                var editor = this.getEditor();
                if(!editor)
                {
                    return;
                }

                settings = settings ? settings : {};
                if(typeof(settings['ownerID']) !== 'undefined')
                {
                    settings['ownerType'] = this.getOwnerType();
                }

                editor.addTask(settings);
            },
            viewActivity: function(id, optopns)
            {
                var editor = this.getEditor();
                if(editor)
                {
                    editor.viewActivity(id, optopns);
                }
            }
        };

    BX.YNSIRInterfaceGridManager.items = {};
    BX.YNSIRInterfaceGridManager.create = function(id, settings)
    {
        var self = new BX.YNSIRInterfaceGridManager();
        self.initialize(id, settings);
        this.items[id] = self;

        BX.onCustomEvent(
            this,
            'CREATED',
            [self]
        );

        return self;
    };
    BX.YNSIRInterfaceGridManager.addEmail = function(managerId, settings)
    {
        if(typeof(this.items[managerId]) !== 'undefined')
        {
            this.items[managerId].addEmail(settings);
        }
    };
    BX.YNSIRInterfaceGridManager.addCall = function(managerId, settings)
    {
        if(typeof(this.items[managerId]) !== 'undefined')
        {
            this.items[managerId].addCall(settings);
        }
    };
    BX.YNSIRInterfaceGridManager.addMeeting = function(managerId, settings)
    {
        if(typeof(this.items[managerId]) !== 'undefined')
        {
            this.items[managerId].addMeeting(settings);
        }
    };
    BX.YNSIRInterfaceGridManager.addTask = function(managerId, settings)
    {
        if(typeof(this.items[managerId]) !== 'undefined')
        {
            this.items[managerId].addTask(settings);
        }
    };
    BX.YNSIRInterfaceGridManager.viewActivity = function(managerId, id, optopns)
    {
        if(typeof(this.items[managerId]) !== 'undefined')
        {
            this.items[managerId].viewActivity(id, optopns);
        }
    };
    BX.YNSIRInterfaceGridManager.showPopup = function(id, anchor, items)
    {
        BX.PopupMenu.show(
            id,
            anchor,
            items,
            {
                offsetTop:0,
                offsetLeft:-30
            });
    };
    BX.YNSIRInterfaceGridManager.reloadGrid = function(gridId)
    {
        var grid = window['bxGrid_' + gridId];
        if(!grid || !BX.type.isFunction(grid.Reload))
        {
            return false;
        }
        grid.Reload();
        return true;
    };
    BX.YNSIRInterfaceGridManager.applyFilter = function(gridId, filterName)
    {
        var grid = window['bxGrid_' + gridId];
        if(!grid || !BX.type.isFunction(grid.Reload))
        {
            return false;
        }

        grid.ApplyFilter(filterName);
        return true;
    };
    BX.YNSIRInterfaceGridManager.clearFilter = function(gridId)
    {
        var grid = window['bxGrid_' + gridId];
        if(!grid || !BX.type.isFunction(grid.ClearFilter))
        {
            return false;
        }

        grid.ClearFilter();
        return true;
    };
    BX.YNSIRInterfaceGridManager.menus = {};
    BX.YNSIRInterfaceGridManager.createMenu = function(menuId, items, zIndex)
    {
        zIndex = parseInt(zIndex);
        var menu = new PopupMenu(menuId, !isNaN(zIndex) ? zIndex : 1010);
        if(BX.type.isArray(items))
        {
            menu.settingsMenu = items;
        }
        this.menus[menuId] = menu;
    };
    BX.YNSIRInterfaceGridManager.showMenu = function(menuId, anchor)
    {
        var menu = this.menus[menuId];
        if(typeof(menu) !== 'undefined')
        {
            menu.ShowMenu(anchor, menu.settingsMenu, false, false);
        }
    };
    BX.YNSIRInterfaceGridManager.expandEllipsis = function(ellepsis)
    {
        if(!BX.type.isDomNode(ellepsis))
        {
            return false;
        }

        var cut = BX.findNextSibling(ellepsis, { 'class': 'bx-crm-text-cut-on' });
        if(cut)
        {
            BX.removeClass(cut, 'bx-crm-text-cut-on');
            BX.addClass(cut, 'bx-crm-text-cut-off');
            cut.style.display = '';
        }

        ellepsis.style.display = 'none';
        return true;
    };
}

//region BX.YNSIRUIGridMenuCommand
BX.YNSIRUIGridMenuCommand =
    {
        undefined: "",
        createEvent: "CREATE_EVENT",
        createActivity: "CREATE_ACTIVITY",
        remove: "REMOVE",
        associate: "ASSOCIATE"
    };
//endregion

// if(typeof(BX.YNSIRUIFilterEntitySelector) == "undefined")
{
    BX.YNSIRUIFilterEntitySelector = function()
    {
        this._id = "";
        this._settings = {};
        this._fieldId = "";
        this._control = null;
        this._entitySelector = null;
        //this._currentValues = {};
    };

    BX.YNSIRUIFilterEntitySelector.prototype =
        {
            initialize: function(id, settings)
            {
                this._id = id;
                this._settings = settings ? settings : {};
                this._fieldId = this.getSetting("fieldId", "");

                BX.addCustomEvent(window, "BX.Main.Filter:customEntityFocus", BX.delegate(this.onCustomEntitySelectorOpen, this));
                BX.addCustomEvent(window, "BX.Main.Filter:customEntityBlur", BX.delegate(this.onCustomEntitySelectorClose, this));
            },
            getId: function()
            {
                return this._id;
            },
            getSetting: function (name, defaultval)
            {
                return this._settings.hasOwnProperty(name)  ? this._settings[name] : defaultval;
            },
            getSearchInput: function()
            {
                return this._control ? this._control.getLabelNode() : null;
            },
            onCustomEntitySelectorOpen: function(control)
            {
                var fieldId = control.getId();
                if(this._fieldId !== fieldId)
                {
                    this._control = null;
                    this.close();
                }
                else
                {
                    this._control = control;
					/*if(this._control)
					 {
					 var current = this._control.getCurrentValues();
					 this._currentValues = current["value"];
					 }*/
                    this.closeSiblings();
                    this.open();
                }
            },
            onCustomEntitySelectorClose: function(control)
            {
                if(this._fieldId === control.getId())
                {
                    this._control = null;
                    this.close();
                }
            },
            onSelect: function(sender, data)
            {
                if(!this._control)
                {
                    return;
                }

                var labels = [];
                var values = {};
                for(var typeName in data)
                {
                    if(!data.hasOwnProperty(typeName))
                    {
                        continue;
                    }

                    var infos = data[typeName];
                    for(var i = 0, l = infos.length; i < l; i++)
                    {
                        var info = infos[i];
                        labels.push(info["title"]);
                        if(typeof(values[typeName]) === "undefined")
                        {
                            values[typeName] = [];
                        }

                        values[typeName].push(info["entityId"]);
                    }
                }
                //this._currentValues = values;
                this._control.setData(labels.join(", "), JSON.stringify(values));
            },
            open: function()
            {
                if(!this._entitySelector)
                {
                    this._entitySelector = BX.YNSIREntitySelector.create(
                        this._id,
                        {
                            entityTypeNames: this.getSetting("entityTypeNames", []),
                            isMultiple: this.getSetting("isMultiple", false),
                            anchor: this.getSearchInput(),
                            title: this.getSetting("title", "")
                        }
                    );

                    BX.addCustomEvent(this._entitySelector, "BX.YNSIREntitySelector:select", BX.delegate(this.onSelect, this));
                }

                this._entitySelector.open();
                if(this._control)
                {
                    this._control.setPopupContainer(this._entitySelector.getPopup()["contentContainer"]);
                }
            },
            close: function()
            {
                if(this._entitySelector)
                {
                    this._entitySelector.close();

                    if(this._control)
                    {
                        this._control.setPopupContainer(null);
                    }
                }
            },
            closeSiblings: function()
            {
                var siblings = BX.YNSIRUIFilterEntitySelector.items;
                for(var k in siblings)
                {
                    if(siblings.hasOwnProperty(k) && siblings[k] !== this)
                    {
                        siblings[k].close();
                    }
                }
            }
        };

    BX.YNSIRUIFilterEntitySelector.items = {};
    BX.YNSIRUIFilterEntitySelector.create = function(id, settings)
    {
        var self = new BX.YNSIRUIFilterEntitySelector(id, settings);
        self.initialize(id, settings);
        BX.YNSIRUIFilterEntitySelector.items[self.getId()] = self;
        return self;
    }
}

// if(typeof(BX.YNSIREntitySelector) == "undefined")
{
    BX.YNSIREntitySelector = function()
    {
        this._id = "";
        this._settings = {};
        this._entityTypeNames = [];
        this._isMultiple = false;
        this._entityInfos = null;
        this._entitySelectHandler = BX.delegate(this.onEntitySelect, this);
    };
    BX.YNSIREntitySelector.prototype =
        {
            initialize: function(id, settings)
            {
                this._id = id;
                this._settings = settings ? settings : {};
                this._entityTypeNames = this.getSetting("entityTypeNames", []);
                this._isMultiple = this.getSetting("isMultiple", false);
                this._entityInfos = [];
            },
            getId: function()
            {
                return this._id;
            },
            getSetting: function (name, defaultval)
            {
                return this._settings.hasOwnProperty(name)  ? this._settings[name] : defaultval;
            },
            getMessage: function(name)
            {
                var msg = BX.YNSIREntitySelector.messages;
                return msg.hasOwnProperty(name) ? msg[name] : name;
            },
            isOpened: function()
            {
                return ((obYNSIR[this._id].popup instanceof BX.PopupWindow) && obYNSIR[this._id].popup.isShown());
            },
            open: function()
            {
                if(typeof(obYNSIR[this._id]) === "undefined")
                {
                    var entityTypes = [];
                    for(var i = 0, l = this._entityTypeNames.length; i < l; i++)
                    {
                        entityTypes.push(this._entityTypeNames[i].toLowerCase());
                    }

                    obYNSIR[this._id] = new CRM(
                        this._id,
                        null,
                        null,
                        this._id,
                        this._entityInfos,
                        false,
                        this._isMultiple,
                        entityTypes,
                        {
                            "contact": BX.YNSIREntityType.getCaptionByName(BX.YNSIREntityType.names.contact),
                            "company": BX.YNSIREntityType.getCaptionByName(BX.YNSIREntityType.names.company),
                            "invoice": BX.YNSIREntityType.getCaptionByName(BX.YNSIREntityType.names.invoice),
                            "quote": BX.YNSIREntityType.getCaptionByName(BX.YNSIREntityType.names.quote),
                            "lead": BX.YNSIREntityType.getCaptionByName(BX.YNSIREntityType.names.lead),
                            "deal": BX.YNSIREntityType.getCaptionByName(BX.YNSIREntityType.names.deal),
                            "ok": this.getMessage("selectButton"),
                            "cancel": BX.message("JS_CORE_WINDOW_CANCEL"),
                            "close": BX.message("JS_CORE_WINDOW_CLOSE"),
                            "wait": BX.message("JS_CORE_LOADING"),
                            "noresult": this.getMessage("noresult"),
                            "search" : this.getMessage("search"),
                            "last" : this.getMessage("last")
                        },
                        true
                    );
                    obYNSIR[this._id].Init();
                    obYNSIR[this._id].AddOnSaveListener(this._entitySelectHandler);
                }

                if(!((obYNSIR[this._id].popup instanceof BX.PopupWindow) && obYNSIR[this._id].popup.isShown()))
                {
                    obYNSIR[this._id].Open(
                        {
                            closeIcon: { top: "10px", right: "15px" },
                            closeByEsc: true,
                            autoHide: false,
                            gainFocus: false,
                            anchor: this.getSetting("anchor", null),
                            titleBar: this.getSetting("title", "")
                        }
                    );
                }
            },
            close: function()
            {
                if(typeof(obYNSIR[this._id]) !== "undefined")
                {
                    obYNSIR[this._id].RemoveOnSaveListener(this._entitySelectHandler);
                    obYNSIR[this._id].Clear();
                    delete obYNSIR[this._id];
                }

            },
            getPopup: function()
            {
                return typeof(obYNSIR[this._id]) !== "undefined" ? obYNSIR[this._id].popup : null;
            },
            onEntitySelect: function(settings)
            {
                this.close();

                var data = {};
                this._entityInfos = [];
                for(var type in settings)
                {
                    if(!settings.hasOwnProperty(type))
                    {
                        continue;
                    }

                    var entityInfos = settings[type];
                    if(!BX.type.isPlainObject(entityInfos))
                    {
                        continue;
                    }

                    var typeName = type.toUpperCase();
                    for(var key in entityInfos)
                    {
                        if(!entityInfos.hasOwnProperty(key))
                        {
                            continue;
                        }

                        var entityInfo = entityInfos[key];
                        this._entityInfos.push(
                            {
                                "id": entityInfo["id"],
                                "type": entityInfo["type"],
                                "title": entityInfo["title"],
                                "desc": entityInfo["desc"],
                                "url": entityInfo["url"],
                                "image": entityInfo["image"],
                                "selected": "Y"
                            }
                        );

                        var entityId = BX.type.isNotEmptyString(entityInfo["id"]) ? parseInt(entityInfo["id"]) : 0;
                        if(entityId > 0)
                        {
                            if(typeof(data[typeName]) === "undefined")
                            {
                                data[typeName] = [];
                            }

                            data[typeName].push(
                                {
                                    entityTypeName: typeName,
                                    entityId: entityId,
                                    title: BX.type.isNotEmptyString(entityInfo["title"]) ? entityInfo["title"] : ("[" + entityId + "]")
                                }
                            );
                        }
                    }
                }

                BX.onCustomEvent(this, "BX.YNSIREntitySelector:select", [this, data]);
            }
        };

    // if(typeof(BX.YNSIREntitySelector.messages) === "undefined")
    {
        BX.YNSIREntitySelector.messages =
            {
            };
    }
    BX.YNSIREntitySelector.closeAll = function()
    {
        for(var k in this.items)
        {
            if(this.items.hasOwnProperty(k))
            {
                this.items[k].close();
            }
        }
    };
    BX.YNSIREntitySelector.items = {};
    BX.YNSIREntitySelector.create = function(id, settings)
    {
        var self = new BX.YNSIREntitySelector(id, settings);
        self.initialize(id, settings);
        BX.YNSIREntitySelector.items[self.getId()] = self;
        return self;
    }
}

//region BX.YNSIRUIGridExtension
//Created for BX.Main.grid
// if(typeof(BX.YNSIRUIGridExtension) == "undefined")
{
    BX.YNSIRUIGridExtension = function()
    {
        this._id = "";
        this._settings = {};
        this._rowCountLoader = null;
        this._loaderData = null;
    };
    BX.YNSIRUIGridExtension.prototype =
        {
            initialize: function(id, settings)
            {
                this._id = id;
                this._settings = settings ? settings : {};

                var gridId = this.getGridId();

                //region Row count loader
                this.initializeRowCountLoader();
                BX.addCustomEvent(window, "Grid::updated", BX.delegate(this.onGridReload, this));
                //endregion

                this._loaderData = this.getSetting("loaderData", null);
                if(BX.type.isPlainObject(this._loaderData))
                {
                    BX.addCustomEvent(window, "Grid::beforeRequest", BX.delegate(this.onGridDataRequest, this));
                }
                BX.addCustomEvent(window, "BX.YNSIREntityCounterPanel:applyFilter", BX.delegate(this.onApplyCounterFilter, this));
            },
            getId: function()
            {
                return this._id;
            },
            getSetting: function (name, defaultval)
            {
                return this._settings.hasOwnProperty(name)  ? this._settings[name] : defaultval;
            },
            getActivityServiceUrl: function()
            {
                return this.getSetting('activityServiceUrl', '');
            },
            getTaskCreateUrl: function()
            {
                return this.getSetting('taskCreateUrl', '');
            },
            getOwnerTypeName: function()
            {
                return this.getSetting('ownerTypeName', '');
            },
            getGridId: function()
            {
                return this.getSetting('gridId', '');
            },
            getGrid: function()
            {
                var gridId = this.getSetting('gridId', '');
                if(gridId === '')
                {
                    return null;
                }

                var gridInfo = BX.Main.gridManager.getById(gridId);
                return (BX.type.isPlainObject(gridInfo) && gridInfo["instance"] !== "undefined" ? gridInfo["instance"] : null);
            },
            getActivityEditor: function()
            {
                var editorId = this.getSetting("activityEditorId", "");
                return BX.YNSIRActivityEditor.items[editorId] ? BX.YNSIRActivityEditor.items[editorId] : null;
            },
            getMessage: function(name)
            {
                var msg = BX.YNSIRUIGridExtension.messages;
                return msg.hasOwnProperty(name) ? msg[name] : name;
            },
            getCheckBoxValue: function(controlId)
            {
                var control = this.getControl(controlId);
                return control && control.checked;
            },
            getControl: function(controlId)
            {
                return BX(controlId + "_" + this.getGridId());
            },
            getPanelControl: function(controlId)
            {
                return BX(controlId + "_" + this.getGridId() + "_control");
            },
            prepareAction: function(action, params)
            {
                if(action === "assign_to")
                {
                    BX.YNSIRUserSearchPopup.deletePopup(this._id);
                    BX.YNSIRUserSearchPopup.create(
                        this._id,
                        {
                            searchInput: BX(params["searchInputId"]),
                            dataInput: BX(params["dataInputId"]),
                            componentName: params["componentName"]
                        },
                        0
                    );
                }
            },
            processMenuCommand: function(command, params)
            {
                this.getGrid().closeActionsMenu();
                if(command === BX.YNSIRUIGridMenuCommand.createEvent)
                {
                    var entityTypeName = BX.type.isNotEmptyString(params["entityTypeName"]) ? params["entityTypeName"] : "";
                    var entityId = BX.type.isNumber(params["entityId"]) ? params["entityId"] : 0;
                    this.createCustomEvent(entityTypeName, entityId);
                }
                else if(command === BX.YNSIRUIGridMenuCommand.createActivity)
                {
                    var activityTypeId = BX.type.isNumber(params["typeId"]) ? params["typeId"] : BX.YNSIRActivityType.undefined;
                    var activitySettings = BX.type.isPlainObject(params["settings"]) ? params["settings"] : {};
                    this.createActivity(activityTypeId, activitySettings);
                }
                else if(command === BX.YNSIRUIGridMenuCommand.remove)
                {
                    var pathToRemove = BX.type.isNotEmptyString(params["pathToRemove"]) ? params["pathToRemove"] : "";
                    var gridId = this.getGridId();
                    var dlg = new BX.CDialog(
                        {
                            title: this.getMessage("deletionDialogTitle"),
                            head: "",
                            content: this.getMessage("deletionDialogMessage"),
                            resizable: false,
                            draggable: true,
                            height: 70,
                            width: 300
                        }
                    );

                    dlg.ClearButtons();
                    dlg.SetButtons(
                        [
                            {
                                title: this.getMessage("deletionDialogButtonTitle"),
                                id: "crmOk",
                                action: function ()
                                {
                                    BX.WindowManager.Get().Close();
                                    BX.Main.gridManager.reload(gridId, pathToRemove);
                                }
                            },
                            BX.CDialog.btnCancel
                        ]
                    );
                    dlg.Show();
                }
                else if(command === BX.YNSIRUIGridMenuCommand.associate)
                {
                    var list_associate_id = BX.type.isNotEmptyString(params["list_associate_id"]) ? params["list_associate_id"] : "";
                    var current_id = BX.type.isNotEmptyString(params["current_id"]) ? params["current_id"] : "";
                    var grid = this.getGrid();
                    if(!grid)
                    {
                        return;
                    }
                    var data = {'ID': list_associate_id};
                    var values = grid.getActionsPanel().getValues();
                    data[grid.getActionKey()] = 'associate';
                    data['CURRENT_TYPE_ID'] = current_id;
                    data[grid.getForAllKey()] = grid.getForAllKey() in values ? values[grid.getForAllKey()] : 'N';
                    grid.reloadTable('POST', data);

                }
            },
            processActionChange: function(actionName)
            {
                var checkBox = this.getControl("actallrows");
                if(!checkBox)
                {
                    return;
                }

                if(actionName === "assign_to"
                    || actionName === "set_status"
                    || actionName === "set_stage"
                    || actionName === "mark_as_opened"
                    || actionName === "mark_as_completed"
                    || actionName === "mark_as_not_completed"
                    || actionName === "export"
                    || actionName === "delete"
                    || actionName === "refresh_account"
                    || actionName === "create_call_list"
                )
                {
                    checkBox.disabled = false;
                }
                else
                {
                    checkBox.checked = false;
                    checkBox.disabled = true;
                }

            },
            processApplyButtonClick: function()
            {
                var grid = this.getGrid();
                if(!grid)
                {
                    return;
                }

                var forAll = this.getCheckBoxValue("actallrows");
                var selectedIds = grid.getRows().getSelectedIds();
                if(selectedIds.length === 0 && !forAll)
                {
                    return;
                }

                var actionName = BX.data(this.getPanelControl("action_button"), "value");
                if(actionName === "tasks")
                {
                    this.openTaskCreateForm(selectedIds);
                }
                else if(actionName === "subscribe")
                {
                    this.loadCommunications(
                        "EMAIL",
                        selectedIds,
                        BX.delegate(this.createEmailFor, this)
                    );
                }
                else if(actionName === "create_call_list")
                {
                    this.createCallList(false);
                }
                else
                {
                    grid.sendSelected();
                }
            },
            createCallList: function(createActivity)
            {
                var grid = this.getGrid();
                if(!grid)
                    return;

                var forAll = this.getCheckBoxValue("actallrows");
                var selectedIds = grid.getRows().getSelectedIds();

                BX.YNSIRCallListHelper.createCallList(
                    {
                        entityType: this.getOwnerTypeName(),
                        entityIds: (forAll ? [] :  selectedIds),
                        gridId: this.getGridId(),
                        createActivity: createActivity
                    },
                    function(response)
                    {
                        if(!BX.type.isPlainObject(response))
                            return;

                        if(!response.SUCCESS && response.ERRORS)
                        {
                            var error = response.ERRORS.join('. \n');
                            window.alert(error);
                        }
                        else if(response.SUCCESS && response.DATA)
                        {
                            var data = response.DATA;
                            if(data.RESTRICTION)
                            {
                                if(B24.licenseInfoPopup)
                                {
                                    B24.licenseInfoPopup.show('ivr-limit-popup', data.RESTRICTION.HEADER, data.RESTRICTION.CONTENT);
                                }
                            }
                            else
                            {
                                var callListId = data.ID;
                                if(createActivity && BXIM)
                                {
                                    BXIM.startCallList(callListId, {});
                                }
                                else
                                {
                                    (new BX.YNSIR.Activity.Planner()).showEdit({
                                        'PROVIDER_ID': 'CALL_LIST',
                                        'PROVIDER_TYPE_ID': 'CALL_LIST',
                                        'ASSOCIATED_ENTITY_ID': callListId
                                    });
                                }
                            }
                        }
                    }
                );
            },
            updateCallList: function(callListId, context)
            {
                var grid = this.getGrid();
                if(!grid)
                {
                    return;
                }

                var forAll = this.getCheckBoxValue("actallrows");
                var selectedIds = grid.getRows().getSelectedIds();
                if(selectedIds.length === 0 && !forAll)
                {
                    return;
                }

                BX.YNSIRCallListHelper.addToCallList({
                    callListId: callListId,
                    context: context,
                    entityType: this.getOwnerTypeName(),
                    entityIds: (forAll ? [] :  selectedIds),
                    gridId: this.getGridId()
                });
            },
            createCustomEvent: function(entityTypeName, entityId)
            {
                var dlg = new BX.CDialog(
                    {
                        content_url: BX.util.add_url_param(
                            "/bitrix/components/bitrix/crm.event.add/box.php",
                            { "FORM_TYPE": "LIST", "ENTITY_TYPE": entityTypeName, "ENTITY_ID": entityId }
                        ),
                        width: 498,
                        height: 245,
                        resizable: false
                    }
                );
                dlg.Show();
            },
            createEmailFor: function(communications)
            {
                if(!communications)
                {
                    return;
                }

                var entityType = communications['ENTITY_TYPE'] ? communications['ENTITY_TYPE'] : '';
                var items = BX.type.isArray(communications['ITEMS']) ? communications['ITEMS'] : [];
                var settings = {};
                settings['communications'] = [];
                for(var i = 0; i < items.length; i++)
                {
                    settings['communications'].push(
                        {
                            'type': 'EMAIL',
                            'entityTitle': '',
                            'entityType': entityType,
                            'entityId': items[i]['entityId'],
                            'value': items[i]['value']
                        }
                    );
                }
                this.createActivity(BX.YNSIRActivityType.email, settings);
            },
            createActivity: function(typeId, settings)
            {
                BX.namespace("BX.YNSIR.Activity");
                typeId = parseInt(typeId);
                if(isNaN(typeId))
                {
                    typeId = BX.YNSIRActivityType.undefined;
                }

                settings = settings ? settings : {};
                if(BX.type.isNumber(settings["ownerID"]))
                {
                    settings["ownerType"] = this.getOwnerTypeName();
                }

                if(typeId === BX.YNSIRActivityType.call || typeId === BX.YNSIRActivityType.meeting)
                {
                    if(typeof BX.YNSIR.Activity.Planner !== "undefined")
                    {
                        var planner = new BX.YNSIR.Activity.Planner();
                        planner.showEdit(
                            {
                                TYPE_ID: typeId,
                                OWNER_TYPE: settings["ownerType"],
                                OWNER_ID: settings["ownerID"],
                                OWNER_ORDER_ID: settings["ownerOrder"],
                                OWNER_ROUND_ID: typeof settings["ownerRoundID"]!= "undefined"?settings["ownerRoundID"]:'',
                                OWNER_ROUNT_NAME: typeof settings["ownerRound"]!= "undefined"?settings["ownerRound"]:'',
                                OWNER_INTERVIEWERS_ID: typeof settings["ownerInterViewer"] != "undefined"?settings["ownerInterViewer"]:'',

                            }
                        );
                    }
                }
                else
                {
                    var editor = this.getActivityEditor();
                    if(editor)
                    {
                        if(typeId === BX.YNSIRActivityType.email)
                        {
                            editor.addEmail(settings);
                        }
                        else if(typeId === BX.YNSIRActivityType.task)
                        {
                            editor.addTask(settings);
                        }
                    }
                }
            },
            viewActivity: function(id, optopns)
            {
                var editor = this.getActivityEditor();
                if(editor)
                {
                    editor.viewActivity(id, optopns);
                }
            },
            openTaskCreateForm: function(entityIds)
            {
                var entityTypeName = this.getOwnerTypeName();
                var keys = [];
                for(var i = 0, l = entityIds.length; i < l; i++)
                {
                    keys.push(BX.YNSIREntityType.prepareEntityKey(entityTypeName, entityIds[i]));
                }

                window.open(this.getTaskCreateUrl().replace("#ENTITY_KEYS#", keys.join(";")));
            },
            loadCommunications: function(typeName, entityIds, callback)
            {
                BX.ajax(
                    {
                        'url': this.getActivityServiceUrl(),
                        'method': 'POST',
                        'dataType': 'json',
                        'data':
                            {
                                'ACTION' : 'GET_ENTITIES_DEFAULT_COMMUNICATIONS',
                                'COMMUNICATION_TYPE': typeName,
                                'ENTITY_TYPE': this.getOwnerTypeName(),
                                'ENTITY_IDS': entityIds,
                                'GRID_ID': this.getGridId()
                            },
                        onsuccess: function(data)
                        {
                            if(data && data['DATA'] && callback)
                            {
                                callback(data['DATA']);
                            }
                        },
                        onfailure: function(data)
                        {
                        }
                    }
                );
            },
            mergeRequestParams: function(target, source)
            {
                for(var key in source)
                {
                    if(source.hasOwnProperty(key))
                    {
                        target[key] = source[key];
                    }
                }
                return target;
            },
            initializeRowCountLoader: function()
            {
                var gridId = this.getGridId();
                var prefix = gridId.toLowerCase();

                var button = BX(prefix + "_row_count");
                var wrapper = BX(prefix + "_row_count_wrapper");

                if(BX.type.isDomNode(button) && BX.type.isDomNode(wrapper))
                {
                    this._rowCountLoader = BX.YNSIRHtmlLoader.create(
                        prefix + "_row_count",
                        {
                            "action": "GET_ROW_COUNT",
                            "params": { "GRID_ID": gridId },
                            "serviceUrl": this.getSetting("serviceUrl"),
                            "button": button,
                            "wrapper": wrapper
                        }
                    );
                }
            },
            onGridDataRequest: function(sender, eventArgs)
            {
                if(eventArgs["gridId"] !== this.getGridId())
                {
                    return;
                }

                var loader = this._loaderData;
                if(loader.url !== "" && eventArgs.url === "")
                {
                    eventArgs.url = loader.url;
                }

                if(loader.method !== "")
                {
                    eventArgs.method = loader.method;
                }

                if(BX.type.isPlainObject(loader.data))
                {
                    if(BX.type.isPlainObject(eventArgs.data))
                    {
                        eventArgs.data = this.mergeRequestParams(eventArgs.data, loader.data)
                    }
                    else
                    {
                        eventArgs.data = loader.data;
                    }
                }
            },
            onGridReload: function()
            {
                if(this._rowCountLoader)
                {
                    this._rowCountLoader.release();
                    this._rowCountLoader = null;
                }

                this.initializeRowCountLoader();
            },
            onApplyCounterFilter: function(sender, eventArgs)
            {
                setTimeout(
                    BX.delegate(
                        function(){ this.setFilter({ "ACTIVITY_COUNTER": eventArgs["counterTypeId"] }); },
                        this
                    ),
                    0
                );
                eventArgs["cancel"] = true;
            },
            setFilter: function(fields)
            {
                var filter = BX.Main.filterManager.getById(this.getGridId());
                var api = filter.getApi();
                api.setFields(fields);
                api.apply();
            }
        };

    if(typeof(BX.YNSIRUIGridExtension.messages) === "undefined")
    {
        BX.YNSIRUIGridExtension.messages = {};
    }
    BX.YNSIRUIGridExtension.processActionChange = function(extensionId, actionName)
    {
        if(this.items.hasOwnProperty(extensionId))
        {
            this.items[extensionId].processActionChange(actionName);
        }
    };
    BX.YNSIRUIGridExtension.processApplyButtonClick = function(extensionId)
    {
        if(this.items.hasOwnProperty(extensionId))
        {
            this.items[extensionId].processApplyButtonClick();
        }
    };
    BX.YNSIRUIGridExtension.prepareAction = function(extensionId, action, params)
    {
        if(this.items.hasOwnProperty(extensionId))
        {
            this.items[extensionId].prepareAction(action, params);
        }
    };
    //region Menu command
    BX.YNSIRUIGridExtension.processMenuCommand = function(extensionId, command, params)
    {
        if(this.items.hasOwnProperty(extensionId))
        {
            this.items[extensionId].processMenuCommand(command, params);
        }
    };
    //endregion
    //region Activity
    BX.YNSIRUIGridExtension.createActivity = function(extensionId, typeId, settings)
    {
        if(this.items.hasOwnProperty(extensionId))
        {
            this.items[extensionId].createActivity(typeId, settings);
        }
    };
    BX.YNSIRUIGridExtension.viewActivity = function(extensionId, activityId, options)
    {
        if(this.items.hasOwnProperty(extensionId))
        {
            this.items[extensionId].viewActivity(activityId, options);
        }
    };
    //endregion
    //region Call list
    BX.YNSIRUIGridExtension.createCallList = function(extensionId, createActivity)
    {
        if(this.items.hasOwnProperty(extensionId))
        {
            this.items[extensionId].createCallList(createActivity);
        }
    };
    BX.YNSIRUIGridExtension.updateCallList = function(extensionId, callListId, context)
    {
        if(this.items.hasOwnProperty(extensionId))
        {
            this.items[extensionId].updateCallList(callListId, context);
        }
    };
    //endregion
    //region Context Menu
    BX.YNSIRUIGridExtension.contextMenus = {};
    BX.YNSIRUIGridExtension.createContextMenu = function(menuId, items, zIndex)
    {
        zIndex = parseInt(zIndex);
        var menu = new PopupMenu(menuId, !isNaN(zIndex) ? zIndex : 1010);
        if(BX.type.isArray(items))
        {
            menu.settingsMenu = items;
        }
        this.contextMenus[menuId] = menu;
    };
    BX.YNSIRUIGridExtension.showContextMenu = function(menuId, anchor)
    {
        if(this.contextMenus.hasOwnProperty(menuId))
        {
            var menu = this.contextMenus[menuId];
            menu.ShowMenu(anchor, menu.settingsMenu, false, false);
        }
    };
    //endregion
    //region Constructor & Items
    BX.YNSIRUIGridExtension.items = {};
    BX.YNSIRUIGridExtension.create = function(id, settings)
    {

        var self = new BX.YNSIRUIGridExtension();
        self.initialize(id, settings);
        this.items[id] = self;
        //BX.onCustomEvent(this, 'CREATED', [self]);
        return self;
    };
    //endregion
}
//endregion

