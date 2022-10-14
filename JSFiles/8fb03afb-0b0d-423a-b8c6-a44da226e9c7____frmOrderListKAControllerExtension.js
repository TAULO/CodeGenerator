/** 
 *	In this class, developer can change/override the existing methods or can create new methods if required
 */
/*
 * bussiness/orchestration/mediation logic class for frmOrderListKA.
 */
kony = kony || {};
kony.sdk = kony.sdk || {};
kony.sdk.mvvm = kony.sdk.mvvm || {};
kony.sdk.mvvm.v2 = kony.sdk.mvvm.v2 || {};
kony.sdk.mvvm.frmOrderListKAControllerExtension = Class(kony.sdk.mvvm.CustomFormControllerExtension, {
    $statics: {
        CALENDAR_BUTTON_NORMAL_SKIN: "sknBtnFFFFFFClanProNews24KA",
        CALENDAR_BUTTON_FOCUS_SKIN: "sknBtnE4E8ECBorder1C3F64Font456484KA",
        ORDERLIST_DATABASE_DATEFORMAT: "YYYY-MM-DD",
        TAB_NORMAL_SKIN: "sknBtnFF5D6EClanProNews28BackgroundFFFFFFKA",
        TAB_FOCUS_SKIN: "sknBtnFFFFFFClanProNews28BackgroundFF5D6EKA",
        MAP_CURRENT_LOCATION_IMAGE: "current_location.png",
        MAP_NAVIGATION_IMAGE: "notification_map_navigation.png",
        MAP_CALLOUT_DOWN_ARROW_IMAGE: "map_down_arrow.png",
        MAP_CURRENT_LOCATION_DESC: "Current Location",
        NO_OF_DAYS: 5,
        DESCRIPTION_LENGTH: 42,
        MAP_DESCRIPTION_LENGTH: 30,
        ADDRESS_LENGTH: 46,
        NO_OF_DOTS_AFTERTRUNCATION: 3
    },
    constructor: function(controllerObj) {
        this.$class.$super.call(this, controllerObj);
        this.setFormModelInfo("isCalendarSet", false);
        this.controllerExtensionGen = undefined;
    },
    fetchData: function() {
        try {
            if (!this.getFormModelInfo("isCalendarSet")) {
                this.setOrderListCalendarKA();
            }
            this.$class.$superp.fetchData.call(this);
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic fetch data : " + error);
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
    bindData: function(dataMap) { //binding data to segment
        try {
            var scopeObj = this;
            //alert("dataMap"+dataMap);
            var controller = scopeObj.getController();
            var appContext = controller.getApplicationContext();
            var orderListFormController = appContext.getFormController("frmOrderListKA");
            var ordeViewscontrollerExtension = appContext.getFormController("frmOrdersViewsKA").getControllerExtensionObject();
            var formmodel = controller.getFormModel();
            var utilitiesObj = utilities.getUtilityObj();
            var processedSegData = [];
            var segData = dataMap["segOrderListKA"];
            var bindDataObj;
            var viewType = ordeViewscontrollerExtension.getFormModelInfo("viewType");
            processedSegData = scopeObj.formatData(segData, scopeObj, viewType);
            processedSegData = ordeViewscontrollerExtension.filterData(processedSegData);
            scopeObj.setFormModelInfo("segData", processedSegData);
            var groupByHeader = false;
            if ((viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS) || (viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_PRIORITY)) {
                var lclViewType = (viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS) ? "orgStatus" : "orgPriority";
                var lclProcessSegData = utilitiesObj.convertDataToGroup(processedSegData, [lclViewType]);
                if (viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS) {
                    processedSegData = ordeViewscontrollerExtension.sortFormattedDataByStatus(lclProcessSegData);
                }
                if (viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_PRIORITY) {
                    processedSegData = ordeViewscontrollerExtension.sortFormattedDataByPriority(lclProcessSegData);
                }
                groupByHeader = true;
            } else if ((viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_SCHEDULED) || (viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STARTED)) {
                var filterFlag = ordeViewscontrollerExtension.getFormModelInfo("orderViewFilters1") ? true : false;
                var dateFilterFlag = ordeViewscontrollerExtension.getFormModelInfo("dateFilterApplied");
                if (!filterFlag && !dateFilterFlag) {
                    var workOrderStatus = kony.servicesapp.servicesStatus.key;
                    var filterBasedOnStatus = (viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_SCHEDULED) ? workOrderStatus.Scheduled : workOrderStatus.Started;
                    processedSegData = ordeViewscontrollerExtension.filterDataForScheduledOrStarted(processedSegData, filterBasedOnStatus);
                    scopeObj.setFormModelInfo("segData", processedSegData);
                }
                var lclProcessSegData = utilitiesObj.convertDataToGroup(processedSegData, ["orgStatus"]);
                processedSegData = ordeViewscontrollerExtension.sortFormattedDataByStatus(lclProcessSegData);
                groupByHeader = true;
            }
            if (groupByHeader) {
                //********** code need to be removed after UIRT_V2 supports segment header mapping starts here
                var lclWidgetDataMap = formmodel.getViewAttributeByProperty("segOrderListKA", "widgetDataMap");
                lclWidgetDataMap["lblscheduledKA"] = "lblHeader";
                lclWidgetDataMap["imgScheduled"] = "imgHeader";
                formmodel.setViewAttributeByProperty("segOrderListKA", "widgetDataMap", lclWidgetDataMap);
                //******* ends here
            }
            dataMap["segOrderListKA"] = {};
            dataMap["segOrderListKA"]["segOrderListKA"] = processedSegData;
            this.$class.$superp.bindData.call(this, dataMap);
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic bind data : " + error);
        }
    },
    fetchMasterData: function(successcallback, errorcallback) {
        this.$class.$superp.fetchMasterData.call(this, successcallback, errorcallback);
    },
    fetchMasterDataForWidget: function(widgetId, successcallback, errorcallback) {
        try {
            this.$class.$superp.fetchMasterDataForWidget.call(this, widgetId, successcallback, errorcallback);
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic fetch metadata : " + error);
        }
    },
    saveRecord: function(recordObject, onSuccess, onError) {
        try {
            this.$class.$superp.saveRecord.call(this, recordObject, onSuccess, onError);
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
    saveData: function(successCallback, errorCallback) {
        try {
            this.$class.$superp.saveData.call(this, successCallback, errorCallback);
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic save data : " + error);
        }
    },
    deleteData: function() {
        try {
            this.$class.$superp.deleteData.call(this);
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic delete data : " + error);
        }
    },
    performAction: function(actionName, argsArray) {
        try {
            return this.$class.$superp.performAction.call(this, actionName, argsArray);
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic perform action : " + err);
        }
    },
    showPreviousForm: function(doReload) {
        //this.$class.$superp.showPreviousForm.call(this, doReload);
    },
    navigateTo: function(formId, navObject) {
        this.$class.$superp.navigateTo.call(this, formId, navObject);
    },
    setOrderListCalendarKA: function() { //Populating working dates and days to Calender buttons
        try {
            var scopeObj = this;
            var formModel = scopeObj.getController().getFormModel();
            var finalDateArray = utilities.getUtilityObj().getWorkingDayListKA();
            var lclDay = "";
            var lclDate = "";
            var utilityObj = utilities.getUtilityObj();
            scopeObj.setFormModelInfo("isCalendarSet", true);
            scopeObj.setFormModelInfo("workingDays", finalDateArray);
            formModel.setViewAttributeByProperty("btnDay1KA", "skin", kony.sdk.mvvm.frmOrderListKAControllerExtension.CALENDAR_BUTTON_FOCUS_SKIN);
            for (var i = 0; i < finalDateArray.length; i++) {
                lclDay = "lblDay" + i + "KA";
                lclDate = "btnDay" + i + "KA";
                formModel.setViewAttributeByProperty(lclDate, "text", finalDateArray[i][0]);
                formModel.setViewAttributeByProperty(lclDay, "text", utilityObj.geti18nValueKA("i18n.order.frmOrderListKA.lbl" + finalDateArray[i][1] + "KA.ValueKA"));
            }
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic setOrderListCalendarKA : " + err);
        }
    },
    performFetchFormData: function(serviceName, options, successcallback, errorcallback) {
        try {
            this.$class.$superp.performFetchFormData.call(this, serviceName, options, successcallback, errorcallback);
        } catch (error) {
            kony.appfoundation.log.error("Error in Blogic perform fetch and bind data : " + error);
        }
    },
    setSegmentListDataKA: function(contextData, flag, successCallBack, errorCallBack) { //on click of calender button
        try {
            var scopeObj = this;
            var formModel = scopeObj.getController().getFormModel();
            var getBoundFlag = flag ? false : true;
            if (getBoundFlag) {
                var bounds = {};
                bounds = scopeObj.getController().getFormModel().performActionOnView("mapMyOrderListKA", "getBounds", null);
                scopeObj.setFormModelInfo("bounds", bounds);
            }
            scopeObj.setCalendarSkinKA(contextData);
            var lclIndex = contextData.charAt(6);
            var navigationObject = scopeObj.getController().getContextData();
            var lclCurrentDate = convertTimeZone(moment((scopeObj.getFormModelInfo("workingDays"))[lclIndex][2]).format("YYYY-MM-DD"), null, kony.servicesapp.remoteTimeZone, "YYYYMMDDHHmmss");
            var nextDate = moment(convertTimeZone(moment((scopeObj.getFormModelInfo("workingDays"))[lclIndex][2]).format("YYYY-MM-DD"), null, kony.servicesapp.remoteTimeZone, "YYYY-MM-DD HH:mm:ss")).add(24, "hours");
            nextDate = moment(nextDate).subtract(1, "seconds").format("YYYYMMDDHHmmss");
            navigationObject.setQueryParams("segOrderListKA", {
                "x": lclCurrentDate,
                "y": nextDate
            });
            scopeObj.setFormModelInfo("selectedDate", moment((scopeObj.getFormModelInfo("workingDays"))[lclIndex][2]).format("YYYY-MM-DD"));
            scopeObj.fetchData();
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic setSegmentListDataKA : " + err);
        }
    },
    setCalendarSkinKA: function(contextData) { //Assinging skin to calender button
        try {
            var scopeObj = this;
            var formModel = this.getController().getFormModel();
            var lclDate = "";
            var orderViewControllerExtension = scopeObj.getController().getApplicationContext().getFormController("frmOrdersViewsKA").getControllerExtensionObject();
            for (var i = 0; i < kony.sdk.mvvm.frmOrderListKAControllerExtension.NO_OF_DAYS; i++) {
                lclDate = "btnDay" + i + "KA";
                formModel.setViewAttributeByProperty(lclDate, "skin", kony.sdk.mvvm.frmOrderListKAControllerExtension.CALENDAR_BUTTON_NORMAL_SKIN);
                formModel.performActionOnView(lclDate, "setEnabled", [true]);
            }
            if (contextData != "btnDay1KA" && orderViewControllerExtension.getFormModelInfo("viewType") == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_TODAY) {
                orderViewControllerExtension.setFormModelInfo("viewType", "");
            } else if (contextData == "btnDay1KA" && orderViewControllerExtension.getFormModelInfo("viewType") == "") {
                orderViewControllerExtension.setFormModelInfo("viewType", kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_TODAY);
            }
            formModel.setViewAttributeByProperty(contextData, "skin", kony.sdk.mvvm.frmOrderListKAControllerExtension.CALENDAR_BUTTON_FOCUS_SKIN);
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic setCalendarSkinKA : " + err);
        }
    },
    actionForList: function() //On click of List button in OrderList form
    {
        try {
            var scopeObj = this;
            var formModel = scopeObj.getController().getFormModel();
            formModel.setViewAttributeByProperty("flexListKA", "top", "0%");
            formModel.setViewAttributeByProperty("flexListKA", "height", "76%");
            formModel.setViewAttributeByProperty("segOrderListKA", "isVisible", true);
            formModel.setViewAttributeByProperty("mapMyOrderListKA", "isVisible", false);
            formModel.setViewAttributeByProperty("btnCurrenLocation", "isVisible", false);
            formModel.setViewAttributeByProperty("btnListOrderKA", "skin", kony.sdk.mvvm.frmOrderListKAControllerExtension.TAB_FOCUS_SKIN);
            formModel.setViewAttributeByProperty("btnMapShowKA", "skin", kony.sdk.mvvm.frmOrderListKAControllerExtension.TAB_NORMAL_SKIN);
            var bound = {};
            bound = this.getController().getFormModel().performActionOnView("mapMyOrderListKA", "getBounds", null);
            this.setFormModelInfo("bounds", bound);
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic actionForList : " + err);
        }
    },
    actionForMap: function() //On click of map button in OrderList form
    {
        try {
            var scopeObj = this;
            var formModel = scopeObj.getController().getFormModel();
            formModel.setViewAttributeByProperty("flexListKA", "top", "-18%");
            formModel.setViewAttributeByProperty("flexListKA", "height", "94%");
            formModel.setViewAttributeByProperty("mapMyOrderListKA", "isVisible", true);
            formModel.setViewAttributeByProperty("segOrderListKA", "isVisible", false);
            formModel.setViewAttributeByProperty("btnCurrenLocation", "isVisible", true);
            formModel.setViewAttributeByProperty("btnMapShowKA", "skin", kony.sdk.mvvm.frmOrderListKAControllerExtension.TAB_FOCUS_SKIN);
            formModel.setViewAttributeByProperty("btnListOrderKA", "skin", kony.sdk.mvvm.frmOrderListKAControllerExtension.TAB_NORMAL_SKIN);
            scopeObj.getCurrentLocation(false);
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic actionForList : " + err);
        }
    },
    orderListPostShow: function() {
        try {
            var scopeObj = this;
            var isEmpty = utilities.getUtilityObj().isObjectEmpty(scopeObj.getFormModelInfo("bounds"));
            if (!isEmpty) {
                var bounds = scopeObj.getFormModelInfo("bounds");
                if ((bounds.center.lat) && (bounds.center.lon) && bounds.center.lat != 0 && bounds.center.lon != 0) {
                    scopeObj.setMapBounds(bounds);
                }
            }
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic orderListPostShow : " + err);
        }
    },
    resetMapPinData: function() {
        try {
            var scopeObj = this;
            var flag = scopeObj.getFormModelInfo("focusPinApplied");
            flag = flag ? true : false;
            if (flag) {
                var formModel = scopeObj.getController().getFormModel();
                scopeObj.setFormModelInfo("focusPinApplied", false);
                formModel.setViewAttributeByProperty("mapMyOrderListKA", "locationData", scopeObj.getFormModelInfo("mapData"));
                var bounds = this.getController().getFormModel().performActionOnView("mapMyOrderListKA", "getBounds", null);
                this.setFormModelInfo("bounds", bounds);
                if ((bounds.center.lat) && (bounds.center.lon) && bounds.center.lat != 0 && bounds.center.lon != 0) {
                    scopeObj.setMapBounds(bounds);
                }
            }
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic orderListPostShow : " + err);
        }
    },
    showOrderListView: function() {
        try {
            var scopeObj = this;
            var bound = {};
            bound = scopeObj.getController().getFormModel().performActionOnView("mapMyOrderListKA", "getBounds", null);
            scopeObj.setFormModelInfo("bounds", bound);
            var appContext = scopeObj.getController().getApplicationContext();
            var controllerExtension = appContext.getFormController("frmOrdersViewsKA").getControllerExtensionObject();
            //controllerExtension.setFormModelInfo("viewType1",null);
            controllerExtension.bindData();
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic showOrderListView : " + err);
        }
    },
    setMapPinImage: function(segData) {
        try {
            var scopeObj = this;
            var utilitiesObj = utilities.getUtilityObj();
            var controller = scopeObj.getController();
            var appContext = controller.getApplicationContext();
            var ordeViewscontrollerExtension = appContext.getFormController("frmOrdersViewsKA").getControllerExtensionObject();
            var groupByHeader = ordeViewscontrollerExtension.getFormModelInfo("viewType");
            for (var i in segData) {
                segData[i]["pinImage"] = (groupByHeader == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS) ? utilitiesObj.getstatusMapPinImageKA(segData[i]["orgStatus"]) : utilitiesObj.getpriorityMapPinImageKA(segData[i]["orgPriority"], groupByHeader);
            }
            if ((groupByHeader != kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_TODAY)) {
                this.setMapDataMap(segData, false);
            }
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic setMapPinImage : " + err);
        }
    },
    getCurrentLocation: function(flag) {
        try {
            var scopeObj = this;
            var utilitiesObj = utilities.getUtilityObj();
            var msg = utilitiesObj.geti18nValueKA("i18n.common.map.enableGPS.ValueKA");
            var gpsSuccess = function(location) {
                    scopeObj.setFormModelInfo("currentlocationFlag", true);
                    var currentLocations = [];
                    currentLocations.lat = location.coords.latitude;
                    currentLocations.lon = location.coords.longitude;
                    scopeObj.setFormModelInfo("currentLocations", currentLocations);
                    scopeObj.setMapDataMap(scopeObj.getFormModelInfo("segData"), flag);
                }
            var gpsFailure = function(err) {
                    var flag = scopeObj.getFormModelInfo("EnableGPS");
                    flag = flag ? true : false;
                    if (!flag) {
                        alert(msg);
                        scopeObj.setFormModelInfo("EnableGPS", true);
                    }
                    kony.print("gpsFailure() ---------> START");
                    kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
                }
            kony.location.getCurrentPosition(gpsSuccess, gpsFailure);
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic getCurrentLocation : " + err);
        }
    },
    setMapDataMap: function(processedSegData, flag) {
        try {
            var scopeObj = this;
            var locationData = "";
            var formModel = scopeObj.getController().getFormModel();
            var mapLocationOrderList = [];
            var index = -1;
            var data = {
                imgDirectionKA: "key1",
                lblTimeKA: "key2",
                imgStatusMachineStartedKA: "key3",
                lblStatusKA: "key4",
                imgPriorityKA: "key5",
                lblPriorityKA: "key6",
                lblInfoKA: "key7",
                img1KA: "key8"
            };
            formModel.setViewAttributeByProperty("mapMyOrderListKA", "widgetDataMapForCallout", data);
            if (scopeObj.getFormModelInfo("currentlocationFlag")) {
                index = 0;
                var currentLocations = scopeObj.getFormModelInfo("currentLocations");
                var currentLat = currentLocations.lat;
                var currentLon = currentLocations.lon;
                currentLocation = {
                    id: index,
                    lat: currentLat,
                    lon: currentLon,
                    name: kony.sdk.mvvm.frmOrderListKAControllerExtension.MAP_CURRENT_LOCATION_DESC,
                    desc: kony.sdk.mvvm.frmOrderListKAControllerExtension.MAP_CURRENT_LOCATION_DESC,
                    image: kony.sdk.mvvm.frmOrderListKAControllerExtension.MAP_CURRENT_LOCATION_IMAGE,
                    meta: {
                        color: "blue",
                        label: "A"
                    },
                    showcallout: false
                };
                mapLocationOrderList.push(currentLocation);
            }
            if (processedSegData) {
                for (var i in processedSegData) {
                    if (processedSegData[i]["lattitude"] && processedSegData[i]["longitude"] && processedSegData[i]["lattitude"] != "" && processedSegData[i]["longitude"] != "") {
                        locationData = "locationData" + i;
                        ++index;
                        locationData = {
                            id: index,
                            lat: processedSegData[i]["lattitude"],
                            lon: processedSegData[i]["longitude"],
                            name: processedSegData[i]["PlannedStartDate"],
                            desc: processedSegData[i]["MapDescription"],
                            image: processedSegData[i]["pinImage"],
                            showcallout: true,
                            calloutData: {
                                "key1": kony.sdk.mvvm.frmOrderListKAControllerExtension.MAP_NAVIGATION_IMAGE,
                                "key2": processedSegData[i]["PlannedStartDate"],
                                "key3": processedSegData[i]["StatusImage"],
                                "key4": processedSegData[i]["Status_id"],
                                "key5": processedSegData[i]["PriorityImage"],
                                "key6": processedSegData[i]["Priority"],
                                "key7": processedSegData[i]["MapDescription"],
                                "key8": kony.sdk.mvvm.frmOrderListKAControllerExtension.MAP_CALLOUT_DOWN_ARROW_IMAGE,
                                template: flx1
                            }
                        };
                        mapLocationOrderList.push(locationData);
                    }
                }
            }
            this.setFormModelInfo("mapData", mapLocationOrderList);
            formModel.setViewAttributeByProperty("mapMyOrderListKA", "locationData", mapLocationOrderList);
            if (!flag) {
                var isEmpty = utilities.getUtilityObj().isObjectEmpty(scopeObj.getFormModelInfo("bounds"));
                if (!isEmpty) {
                    var bounds = scopeObj.getFormModelInfo("bounds");
                    if ((bounds.center.lat) && (bounds.center.lon) && bounds.center.lat != 0 && bounds.center.lon != 0) {
                        scopeObj.setMapBounds(bounds);
                    }
                }
            }
            kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic setMapDataMap : " + err);
        }
    },
    changePinImage: function(id) {
        try {
            var scopeObj = this;
            var appContext = scopeObj.getController().getApplicationContext();
            var controllerExtension = appContext.getFormController("frmOrdersViewsKA").getControllerExtensionObject();
            var viewType = controllerExtension.getFormModelInfo("viewType");
            var formModel = scopeObj.getController().getFormModel();
            formModel.setViewAttributeByProperty("mapMyOrderListKA", "locationData", scopeObj.getFormModelInfo("mapData"));
            var utilitiesObj = utilities.getUtilityObj();
            var locationDataVal = formModel.getViewAttributeByProperty("mapMyOrderListKA", "locationData");
            var flag = locationDataVal[id] ? true : false;
            var flag1 = flag ? (locationDataVal[id].image ? true : false) : false;
            if (flag1 && locationDataVal[id].image != kony.sdk.mvvm.frmOrderListKAControllerExtension.MAP_CURRENT_LOCATION_IMAGE) {
                scopeObj.setFormModelInfo("focusPinApplied", true);
                var status = locationDataVal[id]["calloutData"]["key4"];
                var groupByStatusFlag = false;
                if ((viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS || viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_SCHEDULED || viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STARTED)) {
                    groupByStatusFlag = true;
                }
                locationDataVal[id].image = (groupByStatusFlag == true) ? utilitiesObj.getstatusMapPinImageFocusKA(status) : utilitiesObj.getPriorityOrTodayMapPinImageFocusKA();
                if (id != 0) {
                    var firstElement = locationDataVal[0];
                    locationDataVal[0] = locationDataVal[id];
                    locationDataVal[id] = firstElement;
                }
                formModel.setViewAttributeByProperty("mapMyOrderListKA", "locationData", locationDataVal);
                formModel.performActionOnView("mapMyOrderListKA", "navigateToLocation", [locationDataVal[0], true, true]);
            }
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic changePinImage : " + err);
        }
    },
    showOrderExecutionForm: function() { //navigating to Order Execution form with data
        try {
            var formmodel = this.getController().getFormModel();
            var selRecord = formmodel.getViewAttributeByProperty("segOrderListKA", "selectedItems")[0];
            var datamodel = new kony.sdk.mvvm.DataModel();
            var utilitiesObj = utilities.getUtilityObj();
            var obj = {
                "id": selRecord.id
            };
            datamodel.setPrimaryKeyValueMap(obj);
            var navigationObject = new kony.sdk.mvvm.NavigationObject();
            navigationObject.setDataModel(datamodel, kony.sdk.mvvm.OperationType.FILTER_BY_PRIMARY_KEY, "form");
            if (selRecord.Status_id == utilitiesObj.geti18nValueKA("i18n.common.rejectedValueKA")) {
                var rejectedRecordError = utilitiesObj.geti18nValueKA("i18n.order.RejectedRecordAccessError.ValueKA");
                alert(rejectedRecordError);
                return;
            }
            navigationObject.setQueryParams("segDetailsKA", {
                "x": selRecord.id
            });
            navigationObject.setQueryParams("FlxTmpOrderListKA", {
                "y": selRecord.id
            });
            navigationObject.setQueryParams("FlxTmpWorkOrderMaterialKA", {
                "z": selRecord.id
            });
            navigationObject.addCustomInfo("WorkOrderId", selRecord.id);
            this.navigateTo("frmOrderExecutionKA", navigationObject);
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic showOrderExecutionForm : " + err);
        }
    },
    formatData: function(segData, scopeObj, viewType) {
        try {
            var utilitiesObj = utilities.getUtilityObj();
            var processedSegData = [];
            var processedRowObj = {};
            var timeFormat = utilitiesObj.geti18nValueKA("i18n.order.frmOrderListKA.timeFormat.ValueKA");
            for (var i in segData) {
                processedRowObj = {};
                processedRowObj["PlannedStartDate"] = convertTimeZone(moment(segData[i]["PlannedStartDate"], "YYYYMMDDhhmmss"), kony.servicesapp.remoteTimeZone, null, timeFormat);
                processedRowObj["orgPriority"] = segData[i]["Priority"] ? segData[i]["Priority"] : "";
                processedRowObj["Priority"] = processedRowObj["orgPriority"] ? utilitiesObj.getPriorityTextKA(processedRowObj["orgPriority"]) : "";
                processedRowObj["PriorityImage"] = utilitiesObj.getPriorityImageKA(segData[i]["Priority"]);
                processedRowObj["StatusImage"] = utilitiesObj.getStatusImageKA(segData[i]["Status_id"]);
                processedRowObj["MapDescription"] = (utilitiesObj.dataTruncation(segData[i]["Description"], kony.sdk.mvvm.frmOrderListKAControllerExtension.MAP_DESCRIPTION_LENGTH, kony.sdk.mvvm.frmOrderListKAControllerExtension.NO_OF_DOTS_AFTERTRUNCATION, "...")).value;
                processedRowObj["Description"] = (utilitiesObj.dataTruncation(segData[i]["Description"], kony.sdk.mvvm.frmOrderListKAControllerExtension.DESCRIPTION_LENGTH, kony.sdk.mvvm.frmOrderListKAControllerExtension.NO_OF_DOTS_AFTERTRUNCATION, "...")).value;
                /* var finalAddress = utilitiesObj.getOrderAddress(segData[i]["Address_id"]);
                processedRowObj["Address_id"] = finalAddress ? (utilitiesObj.dataTruncation(finalAddress, kony.sdk.mvvm.frmOrderListKAControllerExtension.ADDRESS_LENGTH, kony.sdk.mvvm.frmOrderListKAControllerExtension.NO_OF_DOTS_AFTERTRUNCATION, "...")).value : " ";
                processedRowObj["lattitude"] = segData[i]["Address_id"].get("Latitude") ? (segData[i]["Address_id"].get("Latitude")) : "";
                processedRowObj["longitude"] = segData[i]["Address_id"].get("Logitude") ? (segData[i]["Address_id"].get("Logitude")) : "";*/
                processedRowObj["orgStatus"] = segData[i]["Status_id"];
                processedRowObj["Status_id"] = processedRowObj["orgStatus"] ? utilitiesObj.getStatusTextKA(processedRowObj["orgStatus"]) : "";
                processedRowObj["Code"] = segData[i]["Code"];
                processedRowObj["id"] = segData[i]["id"];
                if ((viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STATUS || viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_SCHEDULED || viewType == kony.sdk.mvvm.frmOrdersViewsKAControllerExtension.ORDERLIST_VIEWTYPE_STARTED)) {
                    processedRowObj["pinImage"] = utilitiesObj.getstatusMapPinImageKA(processedRowObj["orgStatus"]);
                } else {
                    processedRowObj["pinImage"] = utilitiesObj.getpriorityMapPinImageKA(processedRowObj["orgPriority"], viewType);
                }
                processedSegData.push(processedRowObj);
            }
            return processedSegData;
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic formatData : " + err);
        }
    },
    setMapBounds: function(bound) {
        try {
            var scopeObj = this;
            var formModel = scopeObj.getController().getFormModel();
            var lat1 = bound.center.lat;
            var lon1 = bound.center.lon;
            var locationData = {
                lat: lat1,
                lon: lon1,
                name: "1",
                desc: "1"
            };
            formModel.performActionOnView("mapMyOrderListKA", "navigateToLocation", [locationData, false, false]);
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic setMapBounds : " + err);
        }
    }
});