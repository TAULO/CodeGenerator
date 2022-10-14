/** 
 *	In this class, developer can change/override the existing methods or can create new methods if required
 */
/*
 * bussiness/orchestration/mediation logic class for frmOrdersViewsKA.
 */
kony = kony || {};
kony.sdk = kony.sdk || {};
kony.sdk.mvvm = kony.sdk.mvvm || {};
kony.sdk.mvvm.v2 = kony.sdk.mvvm.v2 || {};
kony.sdk.mvvm.frmOrdersViewsKAControllerExtension = Class(kony.sdk.mvvm.CustomFormControllerExtension, {
    $statics: {
        ORDERLIST_VIEWTYPE_STATUS: "Status_id",
        ORDERLIST_VIEWTYPE_PRIORITY: "Priority",
        ORDERLIST_VIEWTYPE_TODAY: "Today",
        ORDERLIST_VIEWTYPE_SCHEDULED: "Scheduled",
        ORDERLIST_VIEWTYPE_STARTED: "Started",
        PRIORITY_DISPLAY_ORDER: ["Critical", "High", "Medium", "Low"],
        STATUS_DISPLAY_ORDER: ["Scheduled", "Completed", "Rejected"],
        UNCHECKED_VIEW_IMAGE: "notification_circle_unchecked.png",
        FORWARD_CARET: "bf_forward_caret.png",
        FILTER_UNCHECKED_SKIN: "sknBtnUncheckedCheckboxKA",
        FILTER_CHECKED_SKIN: "sknBtnCheckedCheckboxKA",
        ORDER_VIEW: ["Today", "Status", "Priority", "Scheduled", "Started"],
        ORDER_FILTER: ["Date", "Status", "Priority"],
        DATE_FILTER_INDEX: 0,
        STATUS_FILTER_INDEX: 1,
        PRIORITY_FILTER_INDEX: 2,
        BUTTON_CLEAR_SKIN: "sknBtnFF5D6EClanProNews28KA"
    },
    constructor: function(controllerObj) {
        this.$class.$super.call(this, controllerObj);
        this.controllerExtensionGen = undefined;
    },
    fetchData: function() {
        try {
            var scopeObj = this;
            //this.$class.$superp.fetchData.call(this, success, error);
        } catch (err) {
            kony.appfoundation.log.error("Error in fetchData of controllerExtension");
            var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.appfoundation.v2.AppFoundationExceptionCode.CD_ERROR_FETCH_IN_CONTROLLER_EXTENSION, kony.appfoundation.v2.AppFoundationExceptionCode.MSG_ERROR_FETCH_IN_CONTROLLER_EXTENSION, err);
            kony.appfoundation.log.error(exception.toString());
        }

        function success(response) {
            kony.appfoundation.log.info("success fetching data ", response);
            scopeObj.formatData(response);
        }

        function error(err) {
            //Error fetching data
            kony.appfoundation.log.error("In fetchData errorcallback in controller extension ", err);
            var exception = scopeObj.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.appfoundation.v2.AppFoundationExceptionCode.CD_ERROR_FETCH_IN_CONTROLLER_EXTENSION, kony.appfoundation.v2.AppFoundationExceptionCode.MSG_ERROR_FETCH_IN_CONTROLLER_EXTENSION, err);
            kony.appfoundation.log.error(exception.toString());
        }
    },
    performFetchAndBindFormData: function(successcallback, errorcallback) {
        try {
            this.$class.$superp.performFetchAndBindFormData.call(this, successcallback, errorcallback);
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic perform fetch and bind data : " + error);
        }
    },
    prepareFetchAndBindDataStrategy: function() {
        try {
            this.$class.$superp.prepareFetchAndBindDataStrategy.call(this);
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic prepare fetch and bind data : " + error);
        }
    },
    updateBLogicContextData: function(widgetMapping) {
        try {
            this.$class.$superp.updateBLogicContextData.call(this, widgetMapping);
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic update context data : " + error);
        }
    },
    fetchAndBindDataByWidgetGroup: function(widgetGroupId) {
        try {
            this.$class.$superp.fetchAndBindDataByWidgetGroup.call(this, widgetGroupId);
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic fetch data for widget : " + error);
        }
    },
    bindData: function(dataMap) {
        try {
            var scopeObj = this;
            var INSTANCE = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
            var utilitiesObj = utilities.getUtilityObj();
            var viewType = this.getFormModelInfo("viewType");
            var controller = this.getController();
            var appContext = controller.getApplicationContext();
            var formmodel = controller.getFormModel();
            formmodel.clear();
            var lclSelectedIndex = scopeObj.getIndexOfView(viewType);
            var utilitiesObj = utilities.getUtilityObj();
            var filterHeader = utilitiesObj.geti18nValueKA("i18n.order.frmOrdersViewsKA.subHeader.filterValueKA");
            var viewHeader = utilitiesObj.geti18nValueKA("i18n.order.frmOrdersViewsKA.subHeader.ViewsValueKA");
            var btnClear = utilitiesObj.geti18nValueKA("i18n.order.frmOrdersViewsKA.subHeader.btnClearValueKA");
            var lclWidgetDataMap = formmodel.getViewAttributeByProperty("segOrderViewKA", "widgetDataMap");
            lclWidgetDataMap["lblHeaderTmpKA"] = "lblHeaderTmpKA";
            formmodel.setViewAttributeByProperty("segOrderViewKA", "widgetDataMap", lclWidgetDataMap);
            lclWidgetDataMap = formmodel.getViewAttributeByProperty("segFilterViewKA", "widgetDataMap");
            lclWidgetDataMap["lblFilterHeaderKA"] = "lblFilterHeaderKA";
            lclWidgetDataMap["btnClearKA"] = "btnClearKA";
            formmodel.setViewAttributeByProperty("segFilterViewKA", "widgetDataMap", lclWidgetDataMap);
            dataMap = [];
            var imgSelect = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.UNCHECKED_VIEW_IMAGE;
            var processedSegData = [];
            var processedSegRowData;
            var viewList = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDER_VIEW;
            var viewValues = "";
            for (var i in viewList) {
                processedSegRowData = {};
                viewValues = "i18n.order.frmOrdersViewsKA." + viewList[i] + ".ValueKA";
                viewValues = utilitiesObj.geti18nValueKA(viewValues);
                processedSegRowData["lblTaskViewKA"] = viewValues;
                processedSegRowData["imgSelectViewKA"] = imgSelect;
                processedSegData.push(processedSegRowData);
            }
            var lclViewHeader = {
                "lblHeaderTmpKA": viewHeader
            };
            var viewFinalSegData = [
                [lclViewHeader, processedSegData]
            ];
            dataMap["segOrderViewKA"] = {};
            dataMap["segOrderViewKA"]["segOrderViewKA"] = viewFinalSegData;
            var arrowImage = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.FORWARD_CARET;
            var filterList = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDER_FILTER;
            processedSegData = [];
            var selectedFilterValue = scopeObj.setSelectedFilterValue();
            var checkUncheckSkin = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.FILTER_UNCHECKED_SKIN;
            var selValue = "";
            viewValues = "";
            var taskKA;
            for (var i in filterList) {
                if (selectedFilterValue[i] && selectedFilterValue[i] != "") {
                    checkUncheckSkin = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.FILTER_CHECKED_SKIN;
                    selValue = selectedFilterValue[i];
                    lclSelectedIndex = null;
                    scopeObj.setFormModelInfo("ViewApplied", null);
                } else {
                    checkUncheckSkin = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.FILTER_UNCHECKED_SKIN;
                    selValue = "";
                }
                viewValues = "i18n.order.frmOrdersViewsKA." + filterList[i] + ".ValueKA";
                viewValues = utilitiesObj.geti18nValueKA(viewValues);
                if (selValue) {
                    taskKA = {
                        text: viewValues,
                        centerY: ""
                    };
                    selValue = {
                        isVisible: true,
                        text: selValue
                    };
                } else {
                    taskKA = {
                        text: viewValues,
                        centerY: "50%"
                    };
                    selValue = {
                        isVisible: false,
                        text: selValue
                    };
                }
                processedSegRowData = {};
                processedSegRowData["lblTaskKA"] = taskKA;
                processedSegRowData["selectFilterKA"] = {
                    skin: checkUncheckSkin,
                    text: ""
                };
                processedSegRowData["imgsegArrowKA"] = arrowImage;
                processedSegRowData["lblValueKA"] = selValue;
                processedSegData.push(processedSegRowData);
            }
            var lclTaskHeader = {
                btnClearKA: {
                    text: btnClear,
                    skin: kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.BUTTON_CLEAR_SKIN
                },
                lblFilterHeaderKA: filterHeader
            };
            var finalFilterSegData = [
                [lclTaskHeader, processedSegData]
            ];
            dataMap["segFilterViewKA"] = {};
            dataMap["segFilterViewKA"]["segFilterViewKA"] = finalFilterSegData;
            this.$class.$superp.bindData.call(this, dataMap);
            /* for (var widgetGroupId in dataMap) {
                bindDataObj = scopeObj.bLogicContextObj.getFetchDataStrategy(widgetGroupId);
                bindDataObj.bind(formmodel, dataMap[widgetGroupId], scopeObj.bLogicContextObj.getContext(widgetGroupId)["widgets"]);
            }*/
            formmodel.setViewAttributeByProperty("segOrderViewKA", "selectedRowIndex", lclSelectedIndex);
            if (lclSelectedIndex && lclSelectedIndex != null) {
                var statusFilterControllerExtension = appContext.getFormController("frmStatusFilterKA").getControllerExtensionObject();
                statusFilterControllerExtension.setFormModelInfo("orderViewFilters", null);
                scopeObj.selectFilterBasedOnView(lclSelectedIndex[1]);
            }
            var flag = scopeObj.getFormModelInfo("orderViewFilters1") ? true : false;
            var statusFilterControllerExtension = appContext.getFormController("frmStatusFilterKA").getControllerExtensionObject();
            var dateFilterControllerExtension = appContext.getFormController("frmDateFilterKA").getControllerExtensionObject();
            dateFilterControllerExtension.setFormModelInfo("DateFilterIndex", utilitiesObj.cloneValue(scopeObj.getFormModelInfo("DateFilterIndex1")));
            dateFilterControllerExtension.setFormModelInfo("DateFilter", utilitiesObj.cloneValue(scopeObj.getFormModelInfo("DateFilter1")));
            if (flag) {
                statusFilterControllerExtension.setFormModelInfo("orderViewFilters", utilitiesObj.cloneObject(scopeObj.getFormModelInfo("orderViewFilters1")));
            } else {
                statusFilterControllerExtension.setFormModelInfo("orderViewFilters", null);
            }
            scopeObj.getController().getFormModel().formatUI();
            formmodel.showView();
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic bind data : " + error);
        }
    },
    fetchMasterData: function(serviceName, options, successcallback, errorcallback) {
        try {
            var configObj = this.getController().getConfig();
            var serviceName = configObj.getObjectServiceName();
            var options = configObj.getObjectServiceOptions();
            this.$class.$superp.fetchMasterData.call(this, serviceName, options, successcallback, errorcallback);
        } catch (e) {
            kony.appfoundation.log.error("Error in fetchingMasterData", e);
        }
    },
    fetchMasterDataForWidget: function(propertyId, contextData, successcallback, errorcallback) {
        try {
            this.$class.$superp.fetchMasterDataForWidget.call(this, propertyId, contextData, successcallback, errorcallback);
        } catch (e) {
            kony.appfoundation.log.error("Error in fetchingMasterDataForWidget", e);
        }
    },
    saveRecord: function(recordObject, entityName, onSuccess, onError) {
        try {
            this.$class.$superp.saveRecord.call(this, recordObject, entityName, onSuccess, onError);
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic save entity : " + error);
        }
    },
    saveRecords: function(recordsArray, successcallback, errorcallback) {
        try {
            this.$class.$superp.saveRecords.call(this, recordsArray, successcallback, errorcallback);
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic save entities : " + error);
        }
    },
    getEntitiesDataMap: function() {
        try {
            return this.$class.$superp.getEntitiesDataMap.call(this);
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic prepare entity data map : " + error);
        }
    },
    saveData: function() {
        try {
            var scopeObj = this;
            this.$class.$superp.saveData.call(this, success, error);
        } catch (err) {
            var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.appfoundation.v2.AppFoundationExceptionCode.CD_ERROR_SAVEDATA_IN_CONTROLLER_EXTENSION, kony.appfoundation.v2.AppFoundationExceptionCode.MSG_ERROR_SAVEDATA_IN_CONTROLLER_EXTENSION, err);
            kony.appfoundation.log.error(exception.toString());
        }

        function success(res) {
            //Successfully created record
            kony.appfoundation.log.info("success saving record ", res);
        }

        function error(err) {
            //Handle error case
            kony.appfoundation.log.error("In saveData errorcallback in controller extension ", err);
            var exception = scopeObj.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.appfoundation.v2.AppFoundationExceptionCode.CD_ERROR_SAVEDATA_IN_CONTROLLER_EXTENSION, kony.appfoundation.v2.AppFoundationExceptionCode.MSG_ERROR_SAVEDATA_IN_CONTROLLER_EXTENSION, err);
            kony.appfoundation.log.error(exception.toString());
        }
    },
    deleteData: function() {
        try {
            var scopeObj = this;
            this.$class.$superp.deleteData.call(this, success, error);
        } catch (err) {
            var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.appfoundation.v2.AppFoundationExceptionCode.CD_ERROR_DELETEDATA_IN_CONTROLLER_EXTENSION, kony.appfoundation.v2.AppFoundationExceptionCode.MSG_ERROR_DELETEDATA_IN_CONTROLLER_EXTENSION, err);
            kony.appfoundation.log.error(exception.toString());
        }

        function success(res) {
            //Successfully deleting record
            kony.appfoundation.log.info("success deleting record " + JSON.stringify(res));
        }

        function error(err) {
            //Handle error case
            kony.appfoundation.log.error("In deleteData errorcallback in controller extension ", err);
            var exception = scopeObj.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.appfoundation.v2.AppFoundationExceptionCode.CD_ERROR_DELETEDATA_IN_CONTROLLER_EXTENSION, kony.appfoundation.v2.AppFoundationExceptionCode.MSG_ERROR_DELETEDATA_IN_CONTROLLER_EXTENSION, err);
            kony.appfoundation.log.error(exception.toString());
        }
    },
    formatData: function(data) {
        try {
            var scopeObj = this;
            var formattedData = this.$class.$superp.formatData.call(this, data);
            this.bindData(formattedData);
        } catch (err) {
            //kony.appfoundation.log.error("Error in formatData of controllerExtension");
            var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.appfoundation.v2.AppFoundationExceptionCode.CD_ERROR_FORMATDATA_IN_CONTROLLER_EXTENSION, kony.appfoundation.v2.AppFoundationExceptionCode.MSG_ERROR_FORMATDATA_IN_CONTROLLER_EXTENSION, err);
            kony.appfoundation.log.error(exception.toString());
        };
    },
    showPreviousForm: function(doReload) {
        this.$class.$superp.showPreviousForm.call(this, doReload);
    },
    navigateTo: function(formId, navObject) {
        this.$class.$superp.navigateTo.call(this, formId, navObject);
    },
    formatOrderListDataKA: function() { //formats the order list data depending on the selected view option
        try {
            var scopeObj = this;
            var controller = scopeObj.getController();
            var appContext = controller.getApplicationContext();
            var formmodel = controller.getFormModel();
            var controllerOrderList = appContext.getFormController("frmOrderListKA");
            var controllerExtension = controllerOrderList.getControllerExtensionObject();
            var utilitiesObj = utilities.getUtilityObj();
            var listData = controllerExtension.getFormModelInfo("segData");
            var formattedData = [];
            var workOrderStatus = kony.servicesapp.servicesStatus.key;
            //********** code need to be removed after UIRT_V2 supports segment header mapping starts here
            var lclWidgetDataMap = controllerOrderList.getFormModel().getViewAttributeByProperty("segOrderListKA", "widgetDataMap");
            lclWidgetDataMap["lblscheduledKA"] = "lblHeader";
            lclWidgetDataMap["imgScheduled"] = "imgHeader";
            controllerOrderList.getFormModel().setViewAttributeByProperty("segOrderListKA", "widgetDataMap", lclWidgetDataMap);
            //******* ends here
            var selectedRecords = formmodel.getViewAttributeByProperty("segOrderViewKA", "selectedRowIndex");
            var dateFilterControllerExtension = appContext.getFormController("frmDateFilterKA").getControllerExtensionObject();
            var statusFilterControllerExtension = appContext.getFormController("frmStatusFilterKA").getControllerExtensionObject();
            var orderFilter = {};
            orderFilter = statusFilterControllerExtension.getFormModelInfo("orderViewFilters");
            scopeObj.setFormModelInfo("orderViewFilters1", utilitiesObj.cloneObject(orderFilter));
            scopeObj.setFormModelInfo("DateFilterIndex1", utilitiesObj.cloneValue(dateFilterControllerExtension.getFormModelInfo("DateFilterIndex")));
            scopeObj.setFormModelInfo("DateFilter1", utilitiesObj.cloneValue(dateFilterControllerExtension.getFormModelInfo("DateFilter")));
            listData = scopeObj.filterData(listData);
            var flag = statusFilterControllerExtension.getFormModelInfo("orderViewFilters") ? true : false;
            var flag1 = dateFilterControllerExtension.getFormModelInfo("DateFilter") ? true : false;
            if (!flag1 && scopeObj.getFormModelInfo("dateFilterApplied")) {
                var toDay = (selectedRecords && selectedRecords.length > 1 && selectedRecords[1] == 0) ? true : false;
                scopeObj.setButtonEnabledOnOff(true, toDay);
            }
            if (selectedRecords && selectedRecords.length > 1) {
                switch (selectedRecords[1]) {
                case 0:
                    scopeObj.setFormModelInfo("viewType", kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_TODAY);
                    controllerExtension.setSegmentListDataKA("btnDay1KA", true, successCallBack, errorCallBack);

                    function successCallBack(response) {
                        kony.sdk.mvvm.log.info("successcallback of setSegmentListDataKA function in ordersviews form");
                        goToPreviousForm();
                    }

                    function errorCallBack(err) {
                        kony.sdk.mvvm.log.error("error in calling setSegmentListDataKA function in ordersviews form");
                        goToPreviousForm();
                    }
                    break;
                case 1:
                    scopeObj.setFormModelInfo("viewType", kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS);
                    formattedData = utilitiesObj.convertDataToGroup(listData, ["orgStatus"]);
                    var lclFormattedData = scopeObj.sortFormattedDataByStatus(formattedData);
                    controllerOrderList.getFormModel().setWidgetData("segOrderListKA", lclFormattedData);
                    goToPreviousForm();
                    break;
                case 2:
                    scopeObj.setFormModelInfo("viewType", kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_PRIORITY);
                    formattedData = utilitiesObj.convertDataToGroup(listData, ["orgPriority"]);
                    var lclFormattedData = scopeObj.sortFormattedDataByPriority(formattedData);
                    controllerOrderList.getFormModel().setWidgetData("segOrderListKA", lclFormattedData);
                    goToPreviousForm();
                    break;
                case 3:
                    scopeObj.setFormModelInfo("viewType", kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_SCHEDULED);
                    listData = scopeObj.filterDataForScheduledOrStarted(listData, workOrderStatus.Scheduled);
                    formattedData = utilitiesObj.convertDataToGroup(listData, ["orgStatus"]);
                    var lclFormattedData = scopeObj.sortFormattedDataByStatus(formattedData);
                    controllerOrderList.getFormModel().setWidgetData("segOrderListKA", lclFormattedData);
                    goToPreviousForm();
                    break;
                case 4:
                    scopeObj.setFormModelInfo("viewType", kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STARTED);
                    listData = scopeObj.filterDataForScheduledOrStarted(listData, workOrderStatus.Started);
                    formattedData = utilitiesObj.convertDataToGroup(listData, ["orgStatus"]);
                    var lclFormattedData = scopeObj.sortFormattedDataByStatus(formattedData);
                    controllerOrderList.getFormModel().setWidgetData("segOrderListKA", lclFormattedData);
                    goToPreviousForm();
                    break;
                }

                function goToPreviousForm() {
                    //controllerExtension.setMapPinImage(listData);
                    scopeObj.setFormModelInfo("orderViewFilters1", null);
                    statusFilterControllerExtension.setFormModelInfo("orderViewFilters", null);
                    scopeObj.navigateBackWithoutReload();
                }
            } else if (flag1) {
                var viewType = scopeObj.getFormModelInfo("viewType1");
                scopeObj.setFormModelInfo("viewType", viewType);
                scopeObj.applyDateFilter();
                //controllerExtension.setMapPinImage(listData);
                //scopeObj.navigateBack();
            } else if (flag) {
                var viewType = scopeObj.getFormModelInfo("viewType1");
                scopeObj.setFormModelInfo("viewType", viewType);
                scopeObj.navigateBack();
            } else {
                var utilitiesObj = utilities.getUtilityObj();
                var msg = utilitiesObj.geti18nValueKA("i18n.order.frmOrdersViewsKA.alert.viewOrFilter");
                alert(msg);
            }
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic formatOrderListDataKA : " + err);
        }
    },
    sortFormattedDataByPriority: function(formattedData) {
        try {
            var sortOrder = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.PRIORITY_DISPLAY_ORDER;
            var criticalFormattedData = [];
            var highFormattedData = [];
            var mediumFormattedData = [];
            var lowFormattedData = [];
            var finalFormattedData = [];
            var data;
            for (var i = 0; i < formattedData.length; i++) {
                data = formattedData[i][1][0]["orgPriority"];
                if (data == sortOrder[0]) {
                    criticalFormattedData = formattedData[i];
                } else if (data == sortOrder[1]) {
                    highFormattedData = formattedData[i];
                } else if (data == sortOrder[2]) {
                    mediumFormattedData = formattedData[i];
                } else if (data == sortOrder[3]) {
                    lowFormattedData = formattedData[i];
                }
            }
            if (criticalFormattedData.length > 0) {
                finalFormattedData.push(criticalFormattedData);
            }
            if (highFormattedData.length > 0) {
                finalFormattedData.push(highFormattedData);
            }
            if (mediumFormattedData.length > 0) {
                finalFormattedData.push(mediumFormattedData);
            }
            if (lowFormattedData.length > 0) {
                finalFormattedData.push(lowFormattedData);
            }
            return finalFormattedData;
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic sortFormattedDataByPriority : " + err);
        }
    },
    sortFormattedDataByStatus: function(formattedData) {
        try {
            var sortOrder = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.STATUS_DISPLAY_ORDER;
            var scheduledFormattedData = [];
            var completedFormattedData = [];
            var rejectedFormattedData = [];
            var statusFormattedData = [];
            var finalFormattedData = [];
            var data;
            for (var i = 0; i < formattedData.length; i++) {
                data = formattedData[i][1][0]["orgStatus"];
                if (data == sortOrder[0]) {
                    scheduledFormattedData = formattedData[i];
                } else if (data == sortOrder[1]) {
                    completedFormattedData = formattedData[i];
                } else if (data == sortOrder[2]) {
                    rejectedFormattedData = formattedData[i];
                } else {
                    statusFormattedData.push(formattedData[i]);
                }
            }
            if (scheduledFormattedData.length > 0) {
                finalFormattedData.push(scheduledFormattedData);
            }
            for (var i = 0; i < statusFormattedData.length; i++) {
                finalFormattedData.push(statusFormattedData[i]);
            }
            if (completedFormattedData.length > 0) {
                finalFormattedData.push(completedFormattedData);
            }
            if (rejectedFormattedData.length > 0) {
                finalFormattedData.push(rejectedFormattedData);
            }
            return finalFormattedData;
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic sortFormattedDataByStatus : " + err);
        }
    },
    navigateBack: function() {
        this.$class.$superp.showPreviousForm.call(this, true, "frmOrderListKA");
    },
    navigateBackWithoutReload: function() {
        this.$class.$superp.showPreviousForm.call(this, false, "frmOrderListKA");
    },
    filterDataForScheduledOrStarted: function(listData, filterBasedOnStatus) {
        try {
            var finalFilteredData = [];
            for (var i in listData) {
                if (listData[i]["orgStatus"] == filterBasedOnStatus) {
                    finalFilteredData.push(listData[i]);
                };
            }
            return finalFilteredData;
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic filterDataForScheduledOrStarted : " + err);
        }
    },
    filterData: function(listData) {
        try {
            var scopeObj = this;
            var controller = scopeObj.getController();
            var appContext = controller.getApplicationContext();
            var flag = scopeObj.getFormModelInfo("orderViewFilters1") ? true : false;
            var selectedFilter = {};
            var finalFilteredData = [];
            if (flag && listData) {
                selectedFilter = scopeObj.getFormModelInfo("orderViewFilters1");
                if (selectedFilter[kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS]) {
                    var listOfStatus = kony.sdk.mvvm.frmStatusFilterKAControllerExtension.STATUS_DISPLAY_ORDER;
                    var selectedStatusFilter = selectedFilter[kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS];
                    listData = scopeObj.getFilteredData(selectedStatusFilter, listOfStatus, "orgStatus", listData);
                }
                if (selectedFilter[kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_PRIORITY]) {
                    var listOfPriority = kony.sdk.mvvm.frmStatusFilterKAControllerExtension.PRIORITY_DISPLAY_ORDER;
                    var selectedPriorityFilter = selectedFilter[kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_PRIORITY];
                    listData = scopeObj.getFilteredData(selectedPriorityFilter, listOfPriority, "orgPriority", listData);
                }
            }
            return listData;
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic filterData : " + err);
        }
    },
    getFilteredData: function(selectedFilter, filterOptions, property, listData) {
        try {
            var finalFilteredData = [];
            var statusVal = [];
            if (selectedFilter.length > 0) {
                for (var i = 0; i < selectedFilter.length; i++) {
                    statusVal[i] = filterOptions[selectedFilter[i]];
                }
                for (var j in listData) {
                    for (var t = 0; t < statusVal.length; t++) {
                        if (listData[j][property] == statusVal[t]) {
                            finalFilteredData.push(listData[j]);
                            break;
                        }
                    }
                }
                return finalFilteredData;
            } else {
                return listData;
            }
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic getFilteredData : " + err);
        }
    },
    onRowClickOfSegView: function(contextData) {
        try {
            var scopeObj = this;
            var controller = scopeObj.getController();
            var formmodel = controller.getFormModel();
            var appContext = controller.getApplicationContext();
            var selectedFilterControllerExtension = appContext.getFormController("frmStatusFilterKA").getControllerExtensionObject();
            var dateFilterControllerExtension = appContext.getFormController("frmDateFilterKA").getControllerExtensionObject();
            scopeObj.setViewType(contextData);
            selectedFilterControllerExtension.setFormModelInfo("orderViewFilters", null);
            formmodel.setViewAttributeByProperty("segFilterViewKA", "selectedRowIndices", null);
            dateFilterControllerExtension.setFormModelInfo("DateFilter", null);
            dateFilterControllerExtension.setFormModelInfo("DateFilterIndex", null);
            //scopeObj.setFilterValue("ALL","");
            scopeObj.selectFilterBasedOnView(contextData);
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic onRowClickOfSegView : " + err);
        }
    },
    setViewType: function(contextData) {
        try {
            var scopeObj = this;
            switch (contextData) {
            case 0.0:
                scopeObj.setFormModelInfo("viewType1", kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_TODAY);
                break;
            case 1.0:
                scopeObj.setFormModelInfo("viewType1", kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS);
                break;
            case 2.0:
                scopeObj.setFormModelInfo("viewType1", kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_PRIORITY);
                break;
            case 3.0:
                scopeObj.setFormModelInfo("viewType1", kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_SCHEDULED);
                break;
            case 4.0:
                scopeObj.setFormModelInfo("viewType1", kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STARTED);
                break;
            }
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic setViewType : " + err);
        }
    },
    clearAllFilter: function() {
        try {
            var scopeObj = this;
            var controller = scopeObj.getController();
            var formmodel = controller.getFormModel();
            var appContext = controller.getApplicationContext();
            var selectedFilterControllerExtension = appContext.getFormController("frmStatusFilterKA").getControllerExtensionObject();
            var dateFilterControllerExtension = appContext.getFormController("frmDateFilterKA").getControllerExtensionObject();
            selectedFilterControllerExtension.setFormModelInfo("orderViewFilters", null);
            formmodel.setViewAttributeByProperty("segFilterViewKA", "selectedRowIndices", null);
            dateFilterControllerExtension.setFormModelInfo("DateFilter", null);
            dateFilterControllerExtension.setFormModelInfo("DateFilterIndex", null);
            scopeObj.reselectView();
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic clearAllFilter : " + err);
        }
    },
    reselectView: function() {
        try {
            var scopeObj = this;
            var controller = scopeObj.getController();
            var formmodel = controller.getFormModel();
            var flag = scopeObj.getFormModelInfo("viewType1") ? true : false;
            var viewType;
            if (flag) {
                viewType = scopeObj.getFormModelInfo("viewType1");
            } else {
                viewType = scopeObj.getFormModelInfo("viewType");
            }
            var lclSelectedIndex = scopeObj.getIndexOfView(viewType);
            formmodel.setViewAttributeByProperty("segOrderViewKA", "selectedRowIndex", lclSelectedIndex);
            //scopeObj.setFilterValue("ALL","");
            scopeObj.selectFilterBasedOnView(lclSelectedIndex[1]);
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic reselectView : " + err);
        }
    },
    getIndexOfView: function(viewType) {
        try {
            var lclSelectedIndex = [];
            switch (viewType) {
            case kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_TODAY:
                lclSelectedIndex = [0, 0];
                break;
            case kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS:
                lclSelectedIndex = [0, 1];
                break;
            case kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_PRIORITY:
                lclSelectedIndex = [0, 2];
                break;
            case kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_SCHEDULED:
                lclSelectedIndex = [0, 3];
                break;
            case kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STARTED:
                lclSelectedIndex = [0, 4];
                break;
            default:
                lclSelectedIndex = [0, 0];
            }
            return lclSelectedIndex;
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic getIndexOfView : " + err);
        }
    },
    applyDateFilter: function() {
        try {
            var scopeObj = this;
            var appContext = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
            var controller = appContext.getFormController("frmOrderListKA");
            var formmodel = controller.getFormModel();
            var dateFilterControllerExtension = scopeObj.getController().getApplicationContext().getFormController("frmDateFilterKA").getControllerExtensionObject();
            var dateFilterIndex = dateFilterControllerExtension.getFormModelInfo("DateFilterIndex");
            var selectedDate = dateFilterControllerExtension.getFormModelInfo("DateFilter");
            var nextDate;
            if (dateFilterIndex == kony.sdk.mvvm.frmDateFilterKAControllerExtension.SELECTED_DATE_FILTER) {
                selectedDate = selectedDate[2] + "-" + selectedDate[1] + "-" + selectedDate[0];
            }
            var lclSelectedDate = convertTimeZone(selectedDate, null, kony.servicesapp.remoteTimeZone, "YYYYMMDDHHmmss");
            nextDate = moment(convertTimeZone(selectedDate, null, kony.servicesapp.remoteTimeZone, "YYYY-MM-DD HH:mm:ss")).add(24, "hours");
            nextDate = moment(nextDate).subtract(1, "seconds").format("YYYYMMDDHHmmss");
            var navigationObject = new kony.sdk.mvvm.NavigationObject();
            navigationObject.setQueryParams("segOrderListKA", {
                "x": lclSelectedDate,
                "y": nextDate
            });
            scopeObj.setFormModelInfo("dateFilterApplied", true);
            scopeObj.setButtonEnabledOnOff(false);
            controller.loadDataAndShowForm(navigationObject);
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic getIndexOfView : " + err);
        }
    },
    setButtonEnabledOnOff: function(enabledFlag, toDay) {
        try {
            var lclDate;
            var scopeObj = this;
            var appContext = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
            var controller = appContext.getFormController("frmOrderListKA");
            var orderListControllerExtension = controller.getControllerExtensionObject();
            var formmodel = controller.getFormModel();
            for (var i = 0; i < 5; i++) {
                lclDate = "btnDay" + i + "KA";
                // frmOrderListKA[lclDate].setEnabled(enabledFlag);
                formmodel.performActionOnView(lclDate, "setEnabled", [enabledFlag]);
                formmodel.setViewAttributeByProperty(lclDate, "skin", kony.sdk.mvvm.frmOrderListKAControllerExtension.CALENDAR_BUTTON_NORMAL_SKIN);
            }
            if (enabledFlag) {
                if (!toDay) orderListControllerExtension.setSegmentListDataKA("btnDay1KA", true);
                scopeObj.setFormModelInfo("dateFilterApplied", false);
            }
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic setButtonEnabledOnOff : " + err);
        }
    },
    setSelectedFilterValue: function() {
        try {
            var scopeObj = this;
            var controller = scopeObj.getController();
            var appContext = controller.getApplicationContext();
            var dateFilterControllerExtension = appContext.getFormController("frmDateFilterKA").getControllerExtensionObject();
            var statusFilterControllerExtension = appContext.getFormController("frmStatusFilterKA").getControllerExtensionObject();
            var flagForStatusOrPriority = scopeObj.getFormModelInfo("orderViewFilters1") ? true : false;
            var flagForDate = scopeObj.getFormModelInfo("DateFilter1") ? true : false;
            var selectedFilterValues = [];
            for (var i = 0; i < 3; i++) {
                selectedFilterValues[1] = "";
            }
            if (flagForStatusOrPriority || flagForDate) {
                var utilitiesObj = utilities.getUtilityObj();
                var moreVal = utilitiesObj.geti18nValueKA("i18n.common.more.filterValueKA");
                var todayVal = utilitiesObj.geti18nValueKA("i18n.common.today.filterValueKA");
                var dateFormat = utilitiesObj.geti18nValueKA("i18n.common.dateFormat.filterValueKA")
                var flag1 = scopeObj.getFormModelInfo("orderViewFilters1") ? true : false;
                var selectedFilter = {};
                var viewValues = "";
                if (flag1) {
                    selectedFilter = scopeObj.getFormModelInfo("orderViewFilters1");
                    if (selectedFilter[kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS]) {
                        var listOfStatus = kony.sdk.mvvm.frmStatusFilterKAControllerExtension.STATUS_DISPLAY_ORDER;
                        var selectedStatusFilter = selectedFilter[kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS];
                        viewValues = listOfStatus[selectedStatusFilter[0]].replace(/\s/g, "");
                        viewValues = "i18n.order.frmStatusFilterKA." + viewValues + ".ValueKA";
                        viewValues = utilitiesObj.geti18nValueKA(viewValues);
                        selectedFilterValues[1] = viewValues;
                        if (selectedStatusFilter.length > 1) {
                            selectedFilterValues[1] = selectedFilterValues[1] + moreVal;
                        }
                    }
                    if (selectedFilter[kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_PRIORITY]) {
                        var listOfPriority = kony.sdk.mvvm.frmStatusFilterKAControllerExtension.PRIORITY_DISPLAY_ORDER;
                        var selectedPriorityFilter = selectedFilter[kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_PRIORITY];
                        viewValues = "i18n.order.frmStatusFilterKA." + listOfPriority[selectedPriorityFilter[0]] + ".ValueKA";
                        viewValues = utilitiesObj.geti18nValueKA(viewValues);
                        selectedFilterValues[2] = viewValues;
                        if (selectedPriorityFilter.length > 1) {
                            selectedFilterValues[2] = selectedFilterValues[2] + moreVal;
                        }
                    }
                }
                if (scopeObj.getFormModelInfo("DateFilterIndex1")) {
                    selectedFilterValues[0] = todayVal;
                    if (scopeObj.getFormModelInfo("DateFilterIndex1") == kony.sdk.mvvm.frmDateFilterKAControllerExtension.SELECTED_DATE_FILTER) {
                        var selectedDate = scopeObj.getFormModelInfo("DateFilter1");
                        if (selectedDate && selectedDate.length > 2) {
                            selectedDate = selectedDate[2] + "-" + selectedDate[1] + "-" + selectedDate[0];
                            selectedDate = moment(selectedDate, kony.sdk.mvvm.frmDateFilterKAControllerExtension.DATE_FORMAT).format(dateFormat);
                            selectedFilterValues[0] = selectedDate;
                        }
                    }
                }
            }
            return selectedFilterValues;
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic setSelectedFilterValue : " + err);
        }
    },
    setFilterValue: function(index, value, flagApplyView) {
        try {
            var scopeObj = this;
            var controller = scopeObj.getController();
            var formmodel = controller.getFormModel();
            var selectedIndices = formmodel.getViewAttributeByProperty("segFilterViewKA", "selectedRowIndices");
            var segFilterData = formmodel.getViewAttributeByProperty("segFilterViewKA", "data");
            var uncheckSkin = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.FILTER_UNCHECKED_SKIN;
            var checkSkin = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.FILTER_CHECKED_SKIN;
            if (segFilterData && segFilterData[0].length > 1) {
                var segData = segFilterData[0][1];
                if (index == "ALL") {
                    for (var i = 0; i < segData.length; i++) {
                        segData[i]["lblValueKA"] = value;
                        segData[i]["lblTaskKA"] = {
                            text: segData[i]["lblTaskKA"]["text"],
                            centerY: "50%"
                        };
                        segData[i]["selectFilterKA"] = {
                            skin: uncheckSkin,
                            text: ""
                        };
                    }
                } else {
                    segData[index]["lblValueKA"] = value;
                    if (value && value != "") {
                        segData[index]["lblTaskKA"] = {
                            text: segData[index]["lblTaskKA"]["text"],
                            centerY: ""
                        };
                        segData[index]["selectFilterKA"] = {
                            skin: checkSkin,
                            text: ""
                        };
                        var selectedRecords = formmodel.getViewAttributeByProperty("segOrderViewKA", "selectedRowIndex");
                        if (selectedRecords && selectedRecords[1]) {
                            scopeObj.setViewType(selectedRecords[1]);
                        } else if (!(scopeObj.getFormModelInfo("viewType1"))) {
                            var viewType = scopeObj.getFormModelInfo("viewType");
                            scopeObj.setFormModelInfo("viewType1", viewType);
                        }
                        if (!flagApplyView) {
                            formmodel.setViewAttributeByProperty("segOrderViewKA", "selectedRowIndex", null);
                            scopeObj.setFormModelInfo("ViewApplied", null);
                        }
                    } else {
                        segData[index]["lblTaskKA"] = {
                            text: segData[index]["lblTaskKA"]["text"],
                            centerY: "50%"
                        };
                        segData[index]["selectFilterKA"] = {
                            text: "",
                            skin: uncheckSkin
                        };
                    }
                }
                segFilterData[0][1] = segData;
                formmodel.setViewAttributeByProperty("segFilterViewKA", "data", segFilterData);
                formmodel.setViewAttributeByProperty("segFilterViewKA", "selectedRowIndices", selectedIndices);
            }
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic setFilterValue : " + err);
        }
    },
    checkUncheckFilter: function() {
        try {
            var scopeObj = this;
            var controller = scopeObj.getController();
            var appContext = controller.getApplicationContext();
            var formmodel = scopeObj.getController().getFormModel();
            var selRecord = formmodel.getViewAttributeByProperty("segFilterViewKA", "selectedItems")[0];
            var selectedRecords = formmodel.getViewAttributeByProperty("segFilterViewKA", "selectedRowIndex");
            if (selRecord.selectFilterKA.skin == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.FILTER_UNCHECKED_SKIN) {
                scopeObj.showOrderFilterForm(selectedRecords[1]);
            } else {
                var dateFilterControllerExtension = appContext.getFormController("frmDateFilterKA").getControllerExtensionObject();
                var statusFilterControllerExtension = appContext.getFormController("frmStatusFilterKA").getControllerExtensionObject();
                if (selectedRecords[1] == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.DATE_FILTER_INDEX) {
                    dateFilterControllerExtension.clearFilters();
                } else {
                    var filterType = (selectedRecords[1] == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.STATUS_FILTER_INDEX) ? kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS : kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_PRIORITY;
                    scopeObj.setFormModelInfo("filterType", filterType);
                    statusFilterControllerExtension.clearFilters()
                }
                var segFilterData = formmodel.getViewAttributeByProperty("segFilterViewKA", "data");
                var segData = segFilterData[0][1];
                var flag = true;
                var checkSkin = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.FILTER_CHECKED_SKIN;
                for (var i = 0; i < segData.length; i++) {
                    if ((i != selectedRecords[1]) && segData[i]["selectFilterKA"].skin == checkSkin) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    scopeObj.reselectView();
                }
            }
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic checkUncheckFilter : " + err);
        }
    },
    showOrderFilterForm: function(contextData) {
        try {
            var scopeObj = this;
            var appContext = scopeObj.getController().getApplicationContext();
            var controllerExtensionfrmDateFilterKA = appContext.getFormController("frmDateFilterKA").getControllerExtensionObject();
            var controllerExtensionfrmStatusFilterKA = appContext.getFormController("frmStatusFilterKA").getControllerExtensionObject();
            switch (contextData) {
            case kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.DATE_FILTER_INDEX:
                controllerExtensionfrmDateFilterKA.bindData();
                break;
            case kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.STATUS_FILTER_INDEX:
                scopeObj.setFormModelInfo("filterType", kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS);
                controllerExtensionfrmStatusFilterKA.bindData();
                //scopeObj.navigateTo("frmStatusFilterKA", null);
                break;
            case kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.PRIORITY_FILTER_INDEX:
                scopeObj.setFormModelInfo("filterType", kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_PRIORITY);
                controllerExtensionfrmStatusFilterKA.bindData();
                //scopeObj.navigateTo("frmStatusFilterKA", null);
                break;
            }
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic showOrderFilterForm : " + err);
        }
    },
    selectFilterBasedOnView: function(value) {
        try {
            var scopeObj = this;
            var filterList = [];
            var controller = scopeObj.getController();
            var formmodel = controller.getFormModel();
            var appContext = controller.getApplicationContext();
            var statusFilterIndex = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.STATUS_FILTER_INDEX;
            var dateFilterIndex = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.DATE_FILTER_INDEX;
            var selectedIndex;
            var utilitiesObj = utilities.getUtilityObj();
            var controllerOrderList = appContext.getFormController("frmOrderListKA");
            var controllerExtension = controllerOrderList.getControllerExtensionObject();
            var date = controllerExtension.getFormModelInfo("selectedDate");
            if (date) {
                var dateFormat = utilitiesObj.geti18nValueKA("i18n.common.dateFormat.filterValueKA");
                date = moment(date, "YYYY-MM-DD").format(dateFormat);
            }
            switch (value) {
            case 0.0:
                selectedIndex = [
                    [0, [dateFilterIndex]]
                ];
                var todayVal = utilitiesObj.geti18nValueKA("i18n.common.today.filterValueKA");
                scopeObj.setFilter(selectedIndex, todayVal);
                scopeObj.setFormModelInfo("ViewApplied", "Today");
                break;
            case 1.0:
                selectedIndex = [
                    [0, [dateFilterIndex]]
                ];
                scopeObj.setFilter(selectedIndex, date);
                scopeObj.setFormModelInfo("ViewApplied", "Status");
                break;
            case 2.0:
                selectedIndex = [
                    [0, [dateFilterIndex]]
                ];
                scopeObj.setFilter(selectedIndex, date);
                scopeObj.setFormModelInfo("ViewApplied", "Priority");
                break;
            case 3.0:
                selectedIndex = [
                    [0, [dateFilterIndex, statusFilterIndex]]
                ];
                scopeObj.setFilter(selectedIndex, date, "Scheduled");
                scopeObj.setFormModelInfo("ViewApplied", "Scheduled");
                break;
            case 4.0:
                selectedIndex = [
                    [0, [dateFilterIndex, statusFilterIndex]]
                ];
                scopeObj.setFilter(selectedIndex, date, "Started");
                scopeObj.setFormModelInfo("ViewApplied", "Started");
                break;
            }
        } catch (err) {
            kony.appfoundation.log.error("error in Blogic setScheduledOrStartedFilter : " + err);
        }
    },
    setFilter: function(selectedIndices, date, value) {
        try {
            var scopeObj = this;
            var controller = scopeObj.getController();
            var formmodel = controller.getFormModel();
            var segFilterData = formmodel.getViewAttributeByProperty("segFilterViewKA", "data");
            var checkSkin = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.FILTER_CHECKED_SKIN;
            var uncheckSkin = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.FILTER_UNCHECKED_SKIN;
            var dateFilterIndex = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.DATE_FILTER_INDEX;
            var statusFilterIndex = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.STATUS_FILTER_INDEX;
            var priorityFilterIndex = kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.PRIORITY_FILTER_INDEX;
            if (segFilterData && segFilterData[0].length > 1) {
                var segData = segFilterData[0][1];
                if (value == "Scheduled" || value == "Started") {
                    segData[statusFilterIndex]["lblValueKA"] = value;
                    segData[statusFilterIndex]["lblTaskKA"] = {
                        text: segData[statusFilterIndex]["lblTaskKA"]["text"],
                        centerY: ""
                    };
                    segData[statusFilterIndex]["selectFilterKA"] = {
                        skin: checkSkin,
                        text: ""
                    };
                } else {
                    segData[statusFilterIndex]["lblValueKA"] = "";
                    segData[statusFilterIndex]["lblTaskKA"] = {
                        text: segData[statusFilterIndex]["lblTaskKA"]["text"],
                        centerY: "50%"
                    };
                    segData[statusFilterIndex]["selectFilterKA"] = {
                        isVisible: true,
                        text: "",
                        skin: uncheckSkin
                    };
                }
                segData[priorityFilterIndex]["lblValueKA"] = "";
                segData[priorityFilterIndex]["lblTaskKA"] = {
                    text: segData[priorityFilterIndex]["lblTaskKA"]["text"],
                    centerY: "50%"
                };
                segData[priorityFilterIndex]["selectFilterKA"] = {
                    isVisible: true,
                    text: "",
                    skin: uncheckSkin
                };
                segData[dateFilterIndex]["lblValueKA"] = date;
                segData[dateFilterIndex]["lblTaskKA"] = {
                    text: segData[dateFilterIndex]["lblTaskKA"]["text"],
                    centerY: ""
                };
                segData[dateFilterIndex]["selectFilterKA"] = {
                    skin: checkSkin,
                    text: ""
                };
                segFilterData[0][1] = segData;
                formmodel.setViewAttributeByProperty("segFilterViewKA", "data", segFilterData);
                formmodel.setViewAttributeByProperty("segFilterViewKA", "selectedRowIndices", selectedIndices);
            }
        } catch (err) {
            kony.appfoundation.log.error("error in Blogic setFilter : " + err);
        }
    }
});