
/** 
 *	In this class, developer can change/override the existing methods or can create new methods if required
 */
/*
 * bussiness/orchestration/mediation logic class for frmTaskResourcesListKA.
 */
kony = kony || {};
kony.sdk = kony.sdk || {};
kony.sdk.mvvm = kony.sdk.mvvm || {};
kony.sdk.mvvm.v2 = kony.sdk.mvvm.v2 || {};
StockLocationListData={};

kony.sdk.mvvm.frmTaskResourcesListKAControllerExtension = Class(kony.sdk.mvvm.CustomFormControllerExtensionMF, {

    $statics: {
        RESOURCELIST_VIEWTYPE_LOCAL_TASK: "TASK_LOCAL",
        RESOURCELIST_VIEWTYPE_AVAILABLE: "AVAILABLE",
        RESOURCELIST_VIEWTYPE_INTASK: "TASK",
        RESOURCELIST_VIEWTYPE_GLOBAL: "GLOBAL",
        UNCHECKED_VIEW_IMAGE: "notification_circle_unchecked.png",
        FORWARD_CARET: "bf_forward_caret.png",
        FILTER_UNCHECKED_SKIN: "sknBtnUncheckedCheckboxKA",
        FILTER_CHECKED_SKIN: "sknBtnCheckedCheckboxKA",
        RESOURCES_VIEW: ["i18n.task.frmTaskViewFiltersKA.InTask.ValueKA", "i18n.task.frmTaskViewFiltersKA.Local.ValueKA", "i18n.task.frmTaskViewFiltersKA.Global.ValueKA"],
        BUTTON_CLEAR_SKIN: "sknBtnFF5D6EClanProNews28KA",
		VIEW_ENABLED : false,
        ONSEARCH : false
    },
    constructor: function(controllerObj) {
        this.$class.$super.call(this,controllerObj);
      	this.records = {};
    },
    performFetchFormData: function(serviceName, options, successcallback, errorcallback) {
        try {
            this.$class.$superp.performFetchFormData.call(this, serviceName, options, successcallback, errorcallback);
        } catch (error) {
            kony.appfoundation.log.error("Error in Blogic perform fetch and bind data : " + error);
        }
    },
    prepareFetchStrategy: function(serviceName, options) {
        try {
            this.$class.$superp.prepareFetchStrategy.call(this, serviceName, options);
        } catch (error) {
            kony.appfoundation.log.error("Error in Blogic prepare fetch and bind data : " + error);
        }
    },

   fetchData: function() {
        try {           
            if( Object.keys(kony.servicesapp.swipedIndices).length>0){
				var animObj=kony.servicesapp.getEndStateTransAnimDefinition("-50%","0%",true);
				animObj["callbacks"]={
					"animationEnd":function(){ 
						var INSTANCE = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
						var controller = INSTANCE.getFormController(kony.application.getCurrentForm().id);
						kony.servicesapp.swipedIndices={};
						kony.servicesapp.coords=[];
						kony.servicesapp.isAnimationInProgress=false;
						return controller.$class.$superp.fetchData.call(controller);
					}
				}
				frmTaskResourcesListKA.segSwipeKA.animateRows({
					rows: [{
						sectionIndex: kony.servicesapp.swipedIndices["secIndex"],
						rowIndex: kony.servicesapp.swipedIndices["rowIndex"]
					}],
					widgets: ["flxChildKA"],
					animation: animObj
				});
			}
			else if(kony.servicesapp.isAnimationInProgress && kony.application.getCurrentForm().id=="frmTaskResourcesListKA"){return;}
			else{this.$class.$superp.fetchData.call(this);}
        } catch (err) {
            kony.sdk.mvvm.log.error("Error in fetchData of controllerExtension");
            var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.appfoundation.v2.AppFoundationExceptionCode.CD_ERROR_FETCH_IN_CONTROLLER_EXTENSION, kony.appfoundation.v2.AppFoundationExceptionCode.MSG_ERROR_FETCH_IN_CONTROLLER_EXTENSION, err);
            kony.sdk.mvvm.log.error(exception.toString());
        }
        function success(response) {
            kony.sdk.mvvm.log.info("success fetching data ", response);
            //scopeObj.formatData(response);
        }
        function error(err) {
            //Error fetching data
            kony.sdk.mvvm.log.error("In fetchData errorcallback in controller extension ", err);
            var exception = scopeObj.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.appfoundation.v2.AppFoundationExceptionCode.CD_ERROR_FETCH_IN_CONTROLLER_EXTENSION, kony.appfoundation.v2.AppFoundationExceptionCode.MSG_ERROR_FETCH_IN_CONTROLLER_EXTENSION, err);
            kony.sdk.mvvm.log.error(exception.toString());
        }
    },
    bindData: function(dataMap) {
        try {
          	var scopeObj = this;
          	var pData = dataMap["segSwipeKA"];
          	for(var i=0;i<pData.length;i++){
              if((pData[i]["IsLeaf"]=='X')&&(kony.servicesapp.CONNECTOR!="CRM"))
                pData[i]["IsLeaf"] = {"text":"X","isVisible":true};
            }
          	dataMap["segSwipeKA"]=pData;
          	scopeObj.records=pData;
			kony.sdk.mvvm.frmTaskResourcesListKAControllerExtension.VIEW_ENABLED = false;
            var controller = scopeObj.getController();
            var appContext = controller.getApplicationContext();
            var resourcesListFormController = appContext.getFormController("frmOrderResourcesListKA");
            var orderExecutionFormControllerExtension = appContext.getFormController("frmOrderExecutionKA").getControllerExtensionObject();
            var workorderStatus = orderExecutionFormControllerExtension.getFormModelInfo("WorkOrderStatus");
            var formmodel = controller.getFormModel();
            var utilitiesObj = utilities.getUtilityObj();
            scopeObj.setFormModelInfo("fromBarCode", false);
            var processedSegData = [];
            var segData = dataMap["segSwipeKA"];
            kony.sdk.mvvm.log.info("@@@ bindData : segData is : "+JSON.stringify(segData));
            var isListEmpty=(!(segData.length));
            // alert("@bindData : isListEmpty : \n"+isListEmpty);
			formmodel.performActionOnView("btnOptionsKA","setEnabled",[true]);
			formmodel.performActionOnView("flxMainKA","setEnabled", [true]);	
			formmodel.performActionOnView("flexDetailsKA","setEnabled",[true]);
			formmodel.performActionOnView("btnBackKA","setEnabled",[true]);
			var viewType = scopeObj.getFormModelInfo("viewType")?scopeObj.getFormModelInfo("viewType"):scopeObj.RESOURCELIST_VIEWTYPE_INTASK;
			if(kony.application.getCurrentForm().id != 'frmResourceExecutionKA' && kony.application.getCurrentForm().id != 'frmTaskResourcesListKA'){
					formmodel.setViewAttributeByProperty("tbxSearchKA", "text", '');
					viewType = scopeObj.RESOURCELIST_VIEWTYPE_INTASK;			
					 scopeObj.setFormModelInfo("viewType", viewType);
					 scopeObj.setFormModelInfo("searchData",{});
			}
            processedSegData = scopeObj.formatSegData(segData, scopeObj);
            //********** code need to be removed after UIRT_V2 supports segment header mapping starts here
            var lclWidgetDataMap = formmodel.getViewAttributeByProperty("segSwipeKA", "widgetDataMap");
            lclWidgetDataMap["lblResourceKA"] = "lblHeader";
            formmodel.setViewAttributeByProperty("segSwipeKA", "widgetDataMap", lclWidgetDataMap);
            //******* ends here
            var resourcesLength = processedSegData.length;
            if (resourcesLength == 1) {
                resourcesLength = resourcesLength + " " + utilitiesObj.geti18nValueKA("i18n.common.resourceValueKA");
            } else {
                resourcesLength = resourcesLength + " " + utilitiesObj.geti18nValueKA("i18n.common.resourcesValueKA");
            }

            var isNotGlobalView=(scopeObj.getFormModelInfo("viewType")!= scopeObj.RESOURCELIST_VIEWTYPE_GLOBAL);
            var OnlineSearchResult=true;
            

            var lclTaskHeader = {
                "lblHeader": resourcesLength
            };
            var finalProcessedSegData = [
                [lclTaskHeader, processedSegData]
            ];
			scopeObj.setFormModelInfo("segmentId", "segSwipeKA");
            dataMap["segSwipeKA"] = {};
            dataMap["segSwipeKA"]["segSwipeKA"] = finalProcessedSegData;

            if(kony.sdk.mvvm.frmTaskResourcesListKAControllerExtension.ONSEARCH && isListEmpty && isNotGlobalView){
                frmTaskResourcesListKA.lblEmptyListKA.text="No result found.\n"+"Click the below icon to make a global search";
                formmodel.setViewAttributeByProperty("flxEmptyListKA", "isVisible", true);
                formmodel.setViewAttributeByProperty("segSwipeKA", "isVisible", false);
            }else{
                formmodel.setViewAttributeByProperty("flxEmptyListKA", "isVisible", false);
                formmodel.setViewAttributeByProperty("segSwipeKA", "isVisible", true);
            }
            kony.sdk.mvvm.frmTaskResourcesListKAControllerExtension.ONSEARCH=false;

            var prevForm=kony.application.getCurrentForm().id;

            if(!isNotGlobalView){
                flxSegmentMainKA.lblAvailabaleQuantityKA.text=" ";
                if(prevForm == "frmResourceExecutionKA"){
                    scopeObj.$class.$superp.bindData.call(scopeObj, dataMap);
                    formmodel.showView();
                }else{
                    // formmodel.setViewAttributeByProperty("lblAvailabaleQuantityKA", "isVisible", false);
                    var segLength=segData.length;
                    kony.sdk.mvvm.log.info("@@@ bindData : segData value is : "+segData);
                    kony.sdk.mvvm.log.info("@@@ bindData : segData.length is : "+segLength);
                    if(segLength==1){
                        var MaterialID=segData[0]["Code"];
                        kony.sdk.mvvm.log.info("@@@ bindData : MaterialID is : "+MaterialID);
                        // OnlineSearchResult=scopeObj.performOnlineSearch(MaterialID, segLength, scb, ecb);
                        var baseUnit=segData[0]["baseUnit"];
                        scopeObj.performOnlineSearch(MaterialID, baseUnit, segLength, dataMap, scb, ecb);
                        function scb(){
                            scopeObj.$class.$superp.bindData.call(scopeObj, dataMap);
                            formmodel.showView();
                        }
                        function ecb(){
                            // alert("### Error");
                        }

                    }else{
                        scopeObj.$class.$superp.bindData.call(scopeObj, dataMap);
                        formmodel.showView();
                    }
                }
                
            }else{
                // formmodel.setViewAttributeByProperty("lblAvailabaleQuantityKA", "isVisible", true);
                flxSegmentMainKA.lblAvailabaleQuantityKA.text=utilitiesObj.geti18nValueKA("i18n.common.available.ValueKA");
                scopeObj.$class.$superp.bindData.call(scopeObj, dataMap);
                formmodel.showView();
            }
        } catch (err) {
            //kony.sdk.mvvm.log.error("Error in bindData of controllerExtension");
            var exception = new kony.sdk.mvvm.Exception(kony.sdk.mvvm.ExceptionCode.CD_ERROR_BINDDATA_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_BINDDATA_IN_CONTROLLER_EXTENSION, err);
            kony.sdk.mvvm.log.error(exception.toString());
        }
    },
    performOnlineSearch: function(MaterialID, baseUnit, segLength, dataMap, scb, ecb){
        if (kony.sdk.mvvm.isNetworkAvailabile()) {
            var scopeObj = this;
            var options = {"access":"online"};
            objectService = kony.sdk.getCurrentInstance().getObjectService("OrderExecution",options);
            var headers = {}; 
            var dataObject = new kony.sdk.dto.DataObject("ExternalInventory");
            // var query="&$filter=Material_id eq "+MaterialID+"&$top=10";
            var query="&$filter=Material_id eq "+MaterialID+"&$top="+kony.servicesapp.NUMOFSTOCKLOCATIONS;
            dataObject.setOdataUrl(query);
            var options = {"dataObject":dataObject, "headers":headers};
            var LoadingMessage="Please wait while we\n"+"find your resources";
            kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen(LoadingMessage);
            objectService.fetch(options, success,error);
            function success(res) 
            {
                kony.sdk.mvvm.log.info("@@@ performOnlineSearch : OnlineCall Response is : "+JSON.stringify(res));    
                var tempRecords=[];
                scopeObj.getCurrentLocation(successCallback,errorCallback);
                function successCallback(TchnLocation){
                    kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen(LoadingMessage);
                    if(TchnLocation){
                        if(TchnLocation.lat){
                            var i=0;
                            for(i=0; i<res.records.length ; i++){
                                kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen(LoadingMessage);
                                var StockJson=res.records[i];
                                // kony.sdk.mvvm.log.info("@@@ performOnlineSearch : StockJson : "+JSON.stringify(StockJson));
                                var StockLat=StockJson.Latitude;
                                var StockLon=StockJson.Longitude;

                                var StockLocation = {lat: StockLat, lon:StockLon};
                                var distance=kony.map.distanceBetween(TchnLocation,StockLocation);
                                distanceInKms=distance/1000;
                                distanceInMiles=distance*0.000621371;

                                var utilitiesObj = utilities.getUtilityObj();
                                var extension= utilitiesObj.geti18nValueKA("i18n.common.uom.distance");
                                distanceInMiles=Math.ceil(distanceInMiles)+" "+extension;
                                if (kony.servicesapp.constants.getServiceConstantsObj().getUOM("UOM") == "KMS") {
                                    extension = utilitiesObj.geti18nValueKA("i18n.common.Map.lblKilometerKA.valueKA");
                                    distanceInMiles=Math.ceil(distanceInKms)+" "+extension;
                                }
                                
                                kony.sdk.mvvm.log.info("@@@ performOnlineSearch : distance is : "+distanceInMiles);
                                // res.records[i].Latitude=distanceInMiles;
                                tempRecords[i]=res.records[i];
                                tempRecords[i].distance=distanceInMiles;
                                var quantity=parseFloat(res.records[i].Quantity);
                                
                                var availableText=utilitiesObj.geti18nValueKA("i18n.common.available.ValueKA");
                                // tempRecords[i].Quantity=availableText+": "+quantity+" each";
                                tempRecords[i].Quantity=availableText+": "+quantity+" "+baseUnit;
                                kony.sdk.mvvm.log.info("@@@ performOnlineSearch : res.records[i] is : "+JSON.stringify(res.records[i]));
                            }
                        }
                    }
                    // StockLocationListData=res;
                    StockLocationListData=tempRecords;
                    kony.sdk.mvvm.log.info("@@@ performOnlineSearch : tempRecords : "+JSON.stringify(tempRecords));
                    
                    if(segLength==1){
                        scopeObj.$class.$superp.bindData.call(scopeObj, dataMap);
                        var controller = scopeObj.getController();
                        var formmodel = controller.getFormModel();
                        formmodel.showView();
                        scopeObj.navigateToStockLocationList(false);
                    }else{
                        scb();
                        kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
                    }
                    
                    // return true;
                }
                function errorCallback(err){
                    kony.sdk.mvvm.log.error("@@@ in errorCallback of getCurrentLocation : \n" + err);
                    StockLocationListData=tempRecords;
                    kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
                    ecb();
                }
            }

            function error(err)
            {
                kony.sdk.mvvm.log.error("@@@ in errorCallback: Online Fetch Call : \n" + err); 
                kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();      
                ecb();
            }
        }else{
            alert("Please connect to internet to perform online Resource Search");
            kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();      
            ecb();
        }
        
    },
    getCurrentLocation: function(successCallback,errorCallback) {
        try {
            var scopeObj = this;
            var TchnLocation={};
            var gpsSuccess = function(location) {
                TchnLocation.lat = location.coords.latitude;
                TchnLocation.lon = location.coords.longitude;
                kony.sdk.mvvm.log.info("@@@ getCurrentLocation Success : TchnLocation : "+JSON.stringify(TchnLocation));
                successCallback(TchnLocation);
            };
            var gpsFailure = function(err) {
                alert(utilities.getUtilityObj().geti18nValueKA("i18n.common.map.enableGPS.ValueKA"));
                errorCallback(TchnLocation);
                // kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
            };
            var positionoptions = {timeout:kony.servicesapp.MAP_GPS_TIMEOUT, enableHighAccuracy : true};
            kony.location.getCurrentPosition(gpsSuccess, gpsFailure,positionoptions);
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic getCurrentLocation : " + err);
        }
    },
    triggerGlobalSearch: function(){
        try{
            var scopeObj = this;
            var LoadingMessage="Please wait while we\n"+"find your resources";
            kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen(LoadingMessage);
            
            scopeObj.setFormModelInfo("viewType", scopeObj.RESOURCELIST_VIEWTYPE_GLOBAL);
            scopeObj.doSearch();
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic clearFilters : " + err);
        }
    },
    fetchMasterData: function(successcallback, errorcallback) {
        try {
            this.$class.$superp.fetchMasterData.call(this, successcallback, errorcallback);
        } catch (e) {
            kony.sdk.mvvm.log.error("Error in fetchingMasterData", e);
        }
    },
    fetchMasterDataForWidget: function(propertyId, contextData, successcallback, errorcallback) {
        try {
            this.$class.$superp.fetchMasterDataForWidget.call(this, widgetId, successcallback, errorcallback);

        } catch (e) {
            kony.sdk.mvvm.log.error("Error in fetchingMasterDataForWidget", e);
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
	removeRecord: function(record, successcallback, errorcallback) {
        try {
		    var scopeObj=this;
            scopeObj.$class.$superp.removeRecord.call(scopeObj, record, success, error);
			function success(res) {
				 successcallback.call(scopeObj, res);
			}
			function error(err) {
				//Handle error case
				errorcallback.call(scopeObj, err);
				kony.appfoundation.log.error("In removeData errorcallback in controller extension ", err);
				var exception = scopeObj.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.appfoundation.v2.AppFoundationExceptionCode.CD_ERROR_SAVEDATA_IN_CONTROLLER_EXTENSION, kony.appfoundation.v2.AppFoundationExceptionCode.MSG_ERROR_SAVEDATA_IN_CONTROLLER_EXTENSION, err);
				kony.appfoundation.log.error(exception.toString());
			}
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic save entities : " + error);
        }
    },
    formatSegData: function(segData, scopeObj) {
        try {
			var scopeObj=this;
            var utilitiesObj = utilities.getUtilityObj();
            var processedSegData = [];
            var appContext = scopeObj.getController().getApplicationContext();
            var processedRowObj = {};
            for (var i in segData) {
                processedRowObj = {};
                processedRowObj["Material_id"] = segData[i]["Code"];
                processedRowObj["ItemNumber"] = segData[i]["ItemNumber"];
                processedRowObj["InvID"] = segData[i]["InvID"];
                processedRowObj["RequestedQuantityNumber"] = utilitiesObj.roundNumber(segData[i]["RequestedQuantity"],2);
                processedRowObj["InventoryQuantity"] = utilitiesObj.roundNumber(segData[i]["InventoryQuantity"], 2);
				if(segData[i]["RequestedQuantity"]!== null && segData[i]["RequestedQuantity"]!== undefined && segData[i]["RequestedQuantity"]!=='' )
                {processedRowObj["AssignedQuantity"] = utilitiesObj.roundNumber(segData[i]["RequestedQuantity"], 2);}
                processedRowObj["Code"] = utilitiesObj.dataTruncation(segData[i]["Code"], 10, 3, "...").value;
                processedRowObj["Description"] = utilitiesObj.dataTruncation(segData[i]["Description"], 28, 3, "...").value;
				processedRowObj["MaterialDescription"]=segData[i]["Description"];
				processedRowObj["MaterialName"]=segData[i]["MaterialType"];
                processedRowObj["MaterialType"] = utilitiesObj.dataTruncation(segData[i]["MaterialType"], 20, 3, "...").value;
				processedRowObj["RequestedQuantity"] = segData[i]["RequestedQuantity"] ?utilitiesObj.roundNumber(segData[i]["RequestedQuantity"], 2) + " " : " ";
                processedRowObj["AvailableQuantity"] = utilitiesObj.roundNumber(segData[i]["AvailableQuantity"], 2) + " ";
                processedRowObj["baseunitId"] = segData[i]["baseunitId"];
				processedRowObj["ReqUnitDescription"] = segData[i]["ReqUnitDescription"];
                processedRowObj["ReqId"] = segData[i]["ReqId"];
                if (segData[i]["ReqUnitDescription"]) {
                    processedRowObj["RequestedQuantity"] += segData[i]["ReqUnitDescription"];
                }
                if (segData[i]["baseUnit"]) {
                    processedRowObj["AvailableQuantity"] += segData[i]["baseUnit"];
                }
                var isGlobalView=(scopeObj.getFormModelInfo("viewType")== scopeObj.RESOURCELIST_VIEWTYPE_GLOBAL);
                if(isGlobalView){
                    processedRowObj["RequestedQuantity"] = processedRowObj["AvailableQuantity"];
                    processedRowObj["AvailableQuantity"] = " ";
                }
                var taskStatus = segData[i]["taskStatus"];
                processedRowObj["isConsumable"] = segData[i]["isConsumable"];
                processedRowObj["isConsumed"] = segData[i]["isConsumed"];
                processedRowObj["womID"] = segData[i]["womID"];
                processedRowObj["taskStatus"] = segData[i]["taskStatus"];
              	processedRowObj["IsLeaf"] = segData[i]["IsLeaf"];
                if (taskStatus && taskStatus.toUpperCase() != "SCHEDULED"   && segData[i]["isConsumable"]=='Y'  && processedRowObj["RequestedQuantityNumber"]) {
                   switch (taskStatus.toUpperCase()){
				   case "STARTED":
						if (segData[i]["isConsumed"].toUpperCase() == "Y") {
							processedRowObj["isConsumedImage"] = {
								skin: "sknBtnCheckedEnabledKA",
								focusSkin: "sknBtnCheckedEnabledKA",
								text: " "
							};
						} else {
							  if(processedRowObj["RequestedQuantity"]!=0){     
									processedRowObj["metaInfo"] = {
										editMode: constants.SEGUI_EDIT_MODE_DELETE,
										editModeCustomConfig: [{
											title: utilitiesObj.geti18nValueKA("i18n.common.delete.valueKA"),
											backgroundColor: "ff5d6e",
											callback: kony.servicesapp.deleteCallback
										}, {
											title: utilitiesObj.geti18nValueKA("i18n.common.deitValueKA"),
											backgroundColor: "9b9b9b",
											callback: kony.servicesapp.editCallback
											}
											
										]
								}
							}
							processedRowObj["isConsumedImage"] = {
								skin: "sknBtnUncheckedEnabledKA",
								focusSkin: "sknBtnUncheckedEnabledKA",
								text: " "
							};
						}
						break;					
					 default:
						if (segData[i]["isConsumed"].toUpperCase() == "Y") {
							processedRowObj["isConsumedImage"] = {
								skin: "sknBtnResourceCheckedKA",
								focusSkin: "sknBtnResourceCheckedKA",
								text: " "
							};
						} else {
							processedRowObj["isConsumedImage"] = {
								skin: "sknBtnResourceUncheckedKA",
								focusSkin: "sknBtnResourceUncheckedKA",
								text: " "
							};
						}
					}
                } else {
                    processedRowObj["isConsumedImage"] = {
                        skin: "sknBtnTransKA",
                        focusSkin: "sknBtnTransKA",
                        text: " "
                    }
                }
                kony.sdk.mvvm.log.info("@@@ formatSegData : isGlobalView is : "+isGlobalView);
                if(isGlobalView){
                    processedRowObj["isConsumedImage"] = {
                        skin: "sknBtnStockAdd",
                        focusSkin: "sknBtnStockAdd",
                        text: " "
                    };
                }

                processedSegData.push(processedRowObj);
            }
            return processedSegData;
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic formatSegData : " + err);
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
    navigateBack: function(doReload) {
        var utilitiesObj = utilities.getUtilityObj();
        flxSegmentMainKA.lblAvailabaleQuantityKA.text=utilitiesObj.geti18nValueKA("i18n.common.available.ValueKA");
        this.$class.$superp.showPreviousForm.call(this, true, "frmTaskExecutionKA");
    },
    formatData: function(data) {
        try {
            var scopeObj = this;
            var formattedData = scopeObj.$class.$superp.formatData.call(scopeObj, data);
            scopeObj.bindData(formattedData);
        } catch (err) {
            //kony.appfoundation.log.error("Error in formatData of controllerExtension");
            var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.appfoundation.v2.AppFoundationExceptionCode.CD_ERROR_FORMATDATA_IN_CONTROLLER_EXTENSION, kony.appfoundation.v2.AppFoundationExceptionCode.MSG_ERROR_FORMATDATA_IN_CONTROLLER_EXTENSION, err);
            kony.appfoundation.log.error(exception.toString());
        };
    },
    onSegChevronClick:function(){
        try{
            kony.print("onRowClick kony.servicesapp.rowreset"+kony.servicesapp.rowreset);
            /*alert("onRowClick swiped indices length"+Object.keys(kony.servicesapp.swipedIndices).length);
            alert("onRowClick coord"+kony.servicesapp.coords.length);
            alert("onRowClick kony.servicesapp.isAnimationInProgress"+kony.servicesapp.isAnimationInProgress);*/
            var scopeObj = this;
            if(kony.servicesapp.isAnimationInProgress){return;}
            else if(((Object.keys(kony.servicesapp.swipedIndices).length>0))){ 
              
            frmTaskResourcesListKA.segSwipeKA.animateRows({
                            rows: [{
                                sectionIndex: kony.servicesapp.swipedIndices["secIndex"],
                                rowIndex: kony.servicesapp.swipedIndices["rowIndex"]
                            }],
                            widgets: ["flxChildKA"],
                            animation: kony.servicesapp.getEndStateTransAnimDefinition("-50%","0%",true)
                        });
            }
            else if(kony.servicesapp.coords.length == 0 ){
                scopeObj.navigateToResourceExecution();
            }
        }catch(err){
            kony.appfoundation.log.error("error in Blogic onSegChevronClick from Task Resources List: " + err);
        }
    },
    onSegRowClick:function(){
        try{
            kony.print("onRowClick kony.servicesapp.rowreset"+kony.servicesapp.rowreset);
            /*alert("onRowClick swiped indices length"+Object.keys(kony.servicesapp.swipedIndices).length);
            alert("onRowClick coord"+kony.servicesapp.coords.length);
            alert("onRowClick kony.servicesapp.isAnimationInProgress"+kony.servicesapp.isAnimationInProgress);*/
            var scopeObj = this;
            var isGlobalView=(scopeObj.getFormModelInfo("viewType")== scopeObj.RESOURCELIST_VIEWTYPE_GLOBAL);
            if(isGlobalView){
                scopeObj.onSegChevronClick();
            }else{
            if(kony.servicesapp.isAnimationInProgress){return;}
            else if(((Object.keys(kony.servicesapp.swipedIndices).length>0))){ 
              
            frmTaskResourcesListKA.segSwipeKA.animateRows({
                            rows: [{
                                sectionIndex: kony.servicesapp.swipedIndices["secIndex"],
                                rowIndex: kony.servicesapp.swipedIndices["rowIndex"]
                            }],
                            widgets: ["flxChildKA"],
                            animation: kony.servicesapp.getEndStateTransAnimDefinition("-50%","0%",true)
                        });
            }
            else if(kony.servicesapp.coords.length == 0 ){
                scopeObj.navigateToResourceExecution();
            }
        }
        }catch(err){
            kony.appfoundation.log.error("error in Blogic onSegRowClick from Task Resources List: " + err);
        }
    },
    performOnlineSearchManual: function() {
        try {
            var scopeObj = this;
            var controller = scopeObj.getController();
            var loadingMessage="Please wait while we\n"+"find your resources";
            kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen(loadingMessage);
            
            var selRecord = controller.getFormModel().getViewAttributeByProperty("segSwipeKA", "selectedItems")[0];

            var MaterialID=selRecord.Material_id;
            kony.sdk.mvvm.log.info("@@@ performOnlineSearchManual : MaterialID is : "+MaterialID);

            var dataMap={};
            // baseUnit
            kony.sdk.mvvm.log.info("@@@ performOnlineSearchManual : selRecord is : "+selRecord);
            var RequestedQuantityUnit=selRecord.RequestedQuantity;
            var baseUnit="";
            if(RequestedQuantityUnit && RequestedQuantityUnit.split(" ").length==2){
                baseUnit=RequestedQuantityUnit.split(" ")[1];
            }
            kony.sdk.mvvm.log.info("@@@ performOnlineSearchManual : baseUnit is : "+baseUnit);
            scopeObj.performOnlineSearch(MaterialID, baseUnit, 2, dataMap, scb, ecb);
            function scb(){
                scopeObj.navigateToStockLocationList(true);
            }
            function ecb(err){
                kony.sdk.mvvm.log.info("@@@ performOnlineSearchManual : ECB is : "+err);
            }

        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic performOnlineSearchManual from Task Resources List: " + err);
        }
    },
    navigateToStockLocationList: function(isManual) {
        try {
            var scopeObj = this;
            var controller = scopeObj.getController();
            var selRecord = {};
            var loadingMessage="Please wait while we\n"+"find your resources";
            kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen(loadingMessage);
            if(isManual){
                selRecord = controller.getFormModel().getViewAttributeByProperty("segSwipeKA", "selectedItems")[0];
            }else{
                var formModel = controller && controller.getFormModel();
                var FirstRecord=formModel.getViewAttributeByProperty("segSwipeKA", "data")[0];
                selRecord=FirstRecord[1][0];
            }
            kony.sdk.mvvm.log.info("@@@ navigateToStockLocationList : selRecord is : "+selRecord);

            var contextData = controller.getContextData();
            var datamodel = new kony.sdk.mvvm.DataModel();
            datamodel.setPrimaryKeyValueMap({"id":selRecord.Code});
            var woInfo = contextData.getCustomInfo("WorkOrderId");
            var navigationObject = new kony.sdk.mvvm.NavigationObject();           
            navigationObject.setDataModel(datamodel, kony.sdk.mvvm.OperationType.FILTER_BY_PRIMARY_KEY, "form");
            navigationObject.addCustomInfo("WorkOrderId",woInfo);  
            navigationObject.addCustomInfo("TaskId",contextData.getCustomInfo("TaskId "));            
            navigationObject.addCustomInfo("MaterialId", selRecord.Material_id);
            navigationObject.addCustomInfo("womID", selRecord.womID);

            kony.sdk.mvvm.log.info("@@@ navigateToStockLocationList : Material_id is : "+selRecord.Material_id);
            navigationObject.setQueryParams("flxMaterialDetailsKA", {
               "x": selRecord.Material_id
            });
            scopeObj.navigateTo("frmStockLocationListKA", navigationObject);
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic navigateToStockLocationList from Task Resources List: " + err);
        }
    },
    navigateToResourceExecution: function() {
        try {
			var scopeObj = this;
			var controller = scopeObj.getController();
            var selRecord = controller.getFormModel().getViewAttributeByProperty("segSwipeKA", "selectedItems")[0];
            var contextData = controller.getContextData();
            var datamodel = new kony.sdk.mvvm.DataModel();
            datamodel.setPrimaryKeyValueMap({"id":selRecord.Code});
            var woInfo = contextData.getCustomInfo("WorkOrderId");
            var navigationObject = new kony.sdk.mvvm.NavigationObject();           
            navigationObject.setDataModel(datamodel, kony.sdk.mvvm.OperationType.FILTER_BY_PRIMARY_KEY, "form");
            navigationObject.addCustomInfo("WorkOrderId",woInfo);  
            navigationObject.addCustomInfo("TaskId",contextData.getCustomInfo("TaskId "));            
            navigationObject.addCustomInfo("MaterialId", selRecord.Material_id);
			navigationObject.addCustomInfo("womID", selRecord.womID);
            var isGlobalView=(scopeObj.getFormModelInfo("viewType")== scopeObj.RESOURCELIST_VIEWTYPE_GLOBAL);
            navigationObject.addCustomInfo("isGlobalSearch", isGlobalView);
            if(selRecord.AssignedQuantity >=0){
				navigationObject.addCustomInfo("WorkOrderId", woInfo);
				navigationObject.setQueryParams("form", {
					"y": selRecord.Material_id,
					"x": selRecord.womID,
				});
            }else{
                navigationObject.setQuery("form", kony.servicesapp.ResourcesQuery[kony.servicesapp.RESOURCEEXECINVENTORY], "sql");
            	navigationObject.setQueryParams("form", {
					"x": selRecord.Material_id
				});            
            }
            navigationObject.setQueryParams("FlexFetchDataUoMKA", {
               "x": selRecord.Material_id
            });
            scopeObj.navigateTo("frmResourceExecutionKA", navigationObject);
        } catch (err) {
            kony.appfoundation.log.error("error in Blogic navigateToResourceExecution from Order Resources List: " + err);
        }
    },
    changeConsumedStatus: function() {
        try {
			var scopeObj = this;
            var isGlobalView=(scopeObj.getFormModelInfo("viewType")== scopeObj.RESOURCELIST_VIEWTYPE_GLOBAL);
            if(isGlobalView){
                // scopeObj.navigateToStockLocationList(true);
                scopeObj.performOnlineSearchManual();
            }
			var controller = scopeObj.getController();
            var formmodel = controller.getFormModel();
            var selRecord = formmodel.getViewAttributeByProperty("segSwipeKA", "selectedItems")[0];
            var appContext = controller.getApplicationContext();
            var objHandler = kony.sdk.mvvm.persistent.Record;
            var utilitiesObj = utilities.getUtilityObj();
			var configObj = scopeObj.getController().getConfig();
			var objServName = configObj.getObjectServiceName();
			var objServOptions = configObj.getObjectServiceOptions();
			var uomentityController = appContext.getModel("UnitConversion",objServName,objServOptions);
            var orderExecutionFormControllerExtension = appContext.getFormController("frmOrderExecutionKA").getControllerExtensionObject();
			var taskExecutioncontrollerextension = appContext.getFormController("frmTaskExecutionKA").getControllerExtensionObject();
            var workorderStatus = orderExecutionFormControllerExtension.getFormModelInfo("WorkOrderStatus");
            if ((selRecord.isConsumable && selRecord.isConsumable != '' && selRecord.isConsumable.toUpperCase() == "Y") && workorderStatus.toLowerCase() == "started" && taskExecutioncontrollerextension.getFormModelInfo("tStatusID").toUpperCase() == "STARTED") {
                var isConsumed = selRecord.isConsumed;
                var updatedConsumedStatus = "Y";
                if (isConsumed.toUpperCase() == "Y") {
                    updatedConsumedStatus = "N";
                }
                var recordObject = new objHandler("TaskMaterial");
                recordObject.set("Id", selRecord.womID);
                recordObject.set("isConsumed", updatedConsumedStatus);
                recordObject.set("WorkOrder_id", orderExecutionFormControllerExtension.getFormModelInfo("WorkOrderId"));
                recordObject.setInfo("serviceName", objServName);
				recordObject.setInfo("options", objServOptions);
  				var invError = function(){
					alert(utilitiesObj.geti18nValueKA("i18n.order.inventoryUpdate.ErrorKA"));
					kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
  				}
                var invSuccess = function() {
                    scopeObj.fetchData();
                    kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
                    if (kony.appfoundation.isNetworkAvailabile()) {
                        kony.appfoundation.backgroundSyncOnStatusChangeKA();
                    }
                }
                var onError = function() {
                    kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
                }
                var onSuccess = function() {
					var dataSuccess = function(response) {
						var factor = 1;
						if (response.length != 0) {
							factor = response[0]["Factor"];
						}
						var requestedValueInBase = utilitiesObj.roundNumber(selRecord.RequestedQuantityNumber,2)* utilitiesObj.roundNumber(factor,2);
						var invRecordObject = new objHandler(kony.servicesapp.ENTITY_INVENTORY);
						if(updatedConsumedStatus == 'Y'){ 
							invRecordObject.set("Quantity", selRecord.InventoryQuantity - requestedValueInBase);
						}else{ 
							invRecordObject.set("Quantity", selRecord.InventoryQuantity + requestedValueInBase);
						}
						invRecordObject.set("id", selRecord.InvID);
						invRecordObject.set("Material_id", selRecord.Material_id);
						invRecordObject.setInfo("serviceName", objServName);
						invRecordObject.setInfo("options", objServOptions);
						var invSuccess = function() {
							scopeObj.fetchData();
							kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
							if (kony.sdk.mvvm.isNetworkAvailabile()) {
								kony.servicesapp.backgroundSyncOnStatusChangeKA();
							}
						};					   
						scopeObj.saveRecord(invRecordObject, invSuccess, invError);
					}
					var dataError = function(response) {
						return -1;
					}
					var query = "select uom.Factor from UnitConversion uom where uom.UnitFrom_id = '" + selRecord.ReqId + "' and uom.UnitTo_id = '" +selRecord.baseunitId + "' and uom.Material_id = '" + selRecord.Material_id + "'";
					var queryobj = new kony.sdk.mvvm.Query(query, "sql");
					uomentityController.executeSelectQuery(queryobj.getQuery().query, dataSuccess, dataError);
                }
                scopeObj.saveRecord(recordObject, onSuccess, onError);
            }
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic change status from Order Resources List: " + err);
        }
    },
    showFilters: function(toShow) {
		try{
			var scopeObj=this;
			var formModel = scopeObj.getController().getFormModel();
			showHideHamburgerMenuKA(frmTaskResourcesListKA,frmHamburgerMenuWOKA,toShow,"flxViewsKA");
			if(!toShow) {
				scopeObj.setFormModelInfo("viewType", scopeObj.getFormModelInfo("viewType"));
				formModel.performActionOnView("flxMainKA","setEnabled", [true]);
				kony.sdk.mvvm.frmTaskResourcesListKAControllerExtension.VIEW_ENABLED = false;				
			}else{
				scopeObj.bindDataForViews();
				formModel.performActionOnView("flxMainKA","setEnabled", [false]);
				kony.sdk.mvvm.frmTaskResourcesListKAControllerExtension.VIEW_ENABLED = true;
			}
		}catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic showFilters : " + err);
        }		
    },
    applyView: function(onCancel) {
		try{
			var scopeObj = this;
			var controller = scopeObj.getController();
			var utilitiesObj = utilities.getUtilityObj();
			var formmodel = controller.getFormModel();
			var appContext = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
			var taskexecutioncontrollerextension = appContext.getFormController("frmTaskExecutionKA").getControllerExtensionObject();
			var selectedRecords  = scopeObj.getIndexOfView(scopeObj.getFormModelInfo("viewType"));		
			if(!onCancel){			
				selectedRecords = formmodel.getViewAttributeByProperty("segViewsKA", "selectedRowIndex");
			}
			formmodel.setViewAttributeByProperty("tbxSearchKA", "text", '');
			scopeObj.setFormModelInfo("searchData",{});
			switch (selectedRecords[1]) {
				case 0:
					scopeObj.setFormModelInfo("viewType", scopeObj.RESOURCELIST_VIEWTYPE_INTASK);
					scopeObj.refreshSegData(kony.servicesapp.ResourcesQuery.INTASK, {
						'x': taskexecutioncontrollerextension.getFormModelInfo("taskID"),
						'search':'%%'
					});
					break;
				case 1:
					scopeObj.setFormModelInfo("viewType", scopeObj.RESOURCELIST_VIEWTYPE_LOCAL_TASK);
					scopeObj.refreshSegData(kony.servicesapp.ResourcesQuery.TASK_LOCAL,{'y':taskexecutioncontrollerextension.getFormModelInfo("taskID"),'search':'%%'});
					break;
                case 2:
                    if(kony.servicesapp.CONNECTOR == "ECC"){
                        scopeObj.setFormModelInfo("viewType", scopeObj.RESOURCELIST_VIEWTYPE_GLOBAL);
                        //setSegDatatoEmpty
                        var response={"segSwipeKA":[]};
                        scopeObj.bindData(response);    
                    }else{
                        alert( utilitiesObj.geti18nValueKA("i18n.order.common.WorkinProgressKA"));                        
                    }
                    break;
				default :
					scopeObj.setFormModelInfo("viewType", scopeObj.getFormModelInfo("viewType"));
					alert( utilitiesObj.geti18nValueKA("i18n.order.common.WorkinProgressKA"));
					break;
			}
			scopeObj.showFilters(false);
		}catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic applyView : " + err);
        }
    },
    deviceBack: function() {
		try{
			utilities.getUtilityObj().doNothingOnDeviceBackKA();
		}catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic deviceBack : " + err);
        }
    },
    refreshSegData: function(query, queryParams) {
		try{
			var scopeObj = this;
			var contextData = scopeObj.getController().getContextData();
			var sucCallback=function(response){scopeObj.bindData(response);}
			var errorcallback=function(err){alert("Unable to fetch data");}
			contextData.setQuery("segSwipeKA", query, "sql");
			if (queryParams) {
				contextData.setQueryParams("segSwipeKA", queryParams);
			}
			scopeObj.fetchDataByWidgetId("segSwipeKA", sucCallback, errorcallback);
		}catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic refreshSegData : " + err);
        }
    },
	fetchDataByWidgetId : function(widgetId,successCallback,errorCallback){
		try {
            this.$class.$superp.fetchDataByWidgetId.call(this,widgetId,successCallback,errorCallback);
        } catch (err) {
            kony.sdk.mvvm.log.error("Error in fetchData of controllerExtension");
            var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.appfoundation.v2.AppFoundationExceptionCode.CD_ERROR_FETCH_IN_CONTROLLER_EXTENSION, kony.appfoundation.v2.AppFoundationExceptionCode.MSG_ERROR_FETCH_IN_CONTROLLER_EXTENSION, err);
            kony.sdk.mvvm.log.error(exception.toString());
        }
	},
    bindDataForViews: function(dataMap) {
		try{
			var scopeObj = this;
			var INSTANCE = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
			var utilitiesObj = utilities.getUtilityObj();
			var controller = scopeObj.getController();
			var formmodel = controller.getFormModel();
			var lclSelectedIndex = scopeObj.getIndexOfView(scopeObj.getFormModelInfo("viewType"));
			var viewHeader = utilitiesObj.geti18nValueKA("i18n.order.frmOrdersViewsKA.subHeader.ViewsValueKA");
			var lclWidgetDataMap = formmodel.getViewAttributeByProperty("segViewsKA", "widgetDataMap");
			lclWidgetDataMap["lblHeaderKA"] = "lblHeaderKA";
			formmodel.setViewAttributeByProperty("segViewsKA", "widgetDataMap", lclWidgetDataMap);
			dataMap = [];
			var imgSelect = scopeObj.UNCHECKED_VIEW_IMAGE;
			var processedSegData = [];
			var processedSegRowData;
			var viewList = scopeObj.RESOURCES_VIEW;
			for (var i in viewList) {
				processedSegRowData = {};
				processedSegRowData["lblTaskViewKA"] = utilitiesObj.geti18nValueKA(viewList[i]);
				processedSegRowData["imgSelectViewKA"] = imgSelect;
				processedSegRowData["lblLineKA"] = " ";
				processedSegData.push(processedSegRowData);
			}
			var lclViewHeader = {
				"lblHeaderTmpKA": viewHeader,
				"lblLineBottomKA":" ",
				"lblLineKA":" "
			};
			var viewFinalSegData = [
				[lclViewHeader, processedSegData]
			];
			formmodel.performActionOnView("segViewsKA", "setData", [viewFinalSegData]);
			formmodel.setViewAttributeByProperty("segViewsKA", "selectedRowIndex", lclSelectedIndex);
		} catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic bindDataForViews : " + err);
        }
    },
    getIndexOfView: function(viewType) {
        try {
            var lclSelectedIndex = [];
            switch (viewType) {
                case kony.sdk.mvvm.frmTaskResourcesListKAControllerExtension.RESOURCELIST_VIEWTYPE_INTASK:
                    lclSelectedIndex = [0, 0];
                    break;
                case kony.sdk.mvvm.frmTaskResourcesListKAControllerExtension.RESOURCELIST_VIEWTYPE_LOCAL_TASK:
                    lclSelectedIndex = [0, 1];
                    break;
                case kony.sdk.mvvm.frmTaskResourcesListKAControllerExtension.RESOURCELIST_VIEWTYPE_AVAILABLE:
                    lclSelectedIndex = [0, 3];
                    break;
                case kony.sdk.mvvm.frmTaskResourcesListKAControllerExtension.RESOURCELIST_VIEWTYPE_GLOBAL:
                    lclSelectedIndex = [0, 2];
                    break;
                default:
                    lclSelectedIndex = [0, 0];
            }
            return lclSelectedIndex;
        } catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic getIndexOfView Resources: " + err);
        }
    },
    clearFilters: function() {
		try{
			var scopeObj = this;
			scopeObj.setFormModelInfo("viewType", scopeObj.RESOURCELIST_VIEWTYPE_INTASK);
			var contextData = scopeObj.getController().getContextData();
			scopeObj.refreshSegData(kony.servicesapp.ResourcesQuery.ORDER, {
				'x': contextData.getCustomInfo("WorkOrderId")
			});
		} catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic clearFilters : " + err);
        }
    },
    doSearch:function(){
		try{
			var scopeObj=this;
			var controller = scopeObj.getController();
			var formmodel = controller.getFormModel(); 
			var utilitiesObj = utilities.getUtilityObj();
			var searchText =formmodel.getViewAttributeByProperty("tbxSearchKA", "text");
			if(searchText.length!=0 && searchText.length <=2){
				alert(utilitiesObj.geti18nValueKA("i18n.order.common.searchErrorKA"));
				return;
			}
			scopeObj.setFormModelInfo("searchData",{"text":searchText,"isSearch":true});
            if(kony.servicesapp.CONNECTOR == "ECC"){
                kony.sdk.mvvm.frmTaskResourcesListKAControllerExtension.ONSEARCH=true;
            }
			var contextData = controller.getContextData();
			if(scopeObj.getFormModelInfo("viewType")== scopeObj.RESOURCELIST_VIEWTYPE_LOCAL_TASK){
				if(scopeObj.getFormModelInfo("fromBarCode")){					
					scopeObj.refreshSegData(kony.servicesapp.ResourcesQuery.TASK_LOCAL_BARCODE, {
						'x':'',
						'y':contextData.getCustomInfo("TaskId"),
						'search': formmodel.getViewAttributeByProperty("tbxSearchKA", "text")
					});
				}else{
					scopeObj.refreshSegData(kony.servicesapp.ResourcesQuery.TASK_LOCAL, {
						'x':'',
						'y':contextData.getCustomInfo("TaskId"),
						'search': '%'+formmodel.getViewAttributeByProperty("tbxSearchKA", "text")+'%'
					});
				}
			}else if(scopeObj.getFormModelInfo("viewType")== scopeObj.RESOURCELIST_VIEWTYPE_GLOBAL){
                if(scopeObj.getFormModelInfo("fromBarCode")){                   
                    scopeObj.refreshSegData(kony.servicesapp.ResourcesQuery.TASK_LOCAL_BARCODE, {
                        'x':'',
                        'y':contextData.getCustomInfo("TaskId"),
                        'search': formmodel.getViewAttributeByProperty("tbxSearchKA", "text")
                    });
                }else{
                    scopeObj.refreshSegData(kony.servicesapp.ResourcesQuery.TASK_LOCAL, {
                        'x':'',
                        'y':contextData.getCustomInfo("TaskId"),
                        'search': '%'+formmodel.getViewAttributeByProperty("tbxSearchKA", "text")+'%'
                    });
                }
            }else{
				if(scopeObj.getFormModelInfo("fromBarCode")){
					scopeObj.refreshSegData(kony.servicesapp.ResourcesQuery.INTASK_BARCODE,{
						'x':contextData.getCustomInfo("TaskId"),
						'search': formmodel.getViewAttributeByProperty("tbxSearchKA", "text")
					});
				}else{
					scopeObj.refreshSegData(kony.servicesapp.ResourcesQuery.INTASK,{
						'x':contextData.getCustomInfo("TaskId"),
						'search': '%'+formmodel.getViewAttributeByProperty("tbxSearchKA", "text")+'%'
					});
				}
			}
            
		} catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic doSearch : " + err);
        }
	 },
	deviceBackForAndroidTaskResourcesList : function() {
		try{
			var scopeObj = this;
			if(kony.sdk.mvvm.frmTaskResourcesListKAControllerExtension.VIEW_ENABLED){
				scopeObj.showFilters(false);
			}else{
				scopeObj.navigateBack(false);
				kony.sdk.mvvm.frmTaskResourcesListKAControllerExtension.VIEW_ENABLED = false;
			}
		} catch (err) {
            kony.sdk.mvvm.log.error("error in Blogic deviceBackForAndroidOrderList : " + err);
        }		
	},
  	showBOM:function(segRow){
      try{
        var scopeObj=this;
        var controller = scopeObj.getController();
        var formmodel = controller.getFormModel();
        var index = segRow[1];
        var Mat_id = scopeObj.records[index]["Code"];
        var datamodel = new kony.sdk.mvvm.DataModel();
        var navigationObject = new kony.sdk.mvvm.NavigationObject();
        var query = "&$filter=Parent_id eq '{x}'";
        navigationObject.setQuery("segBOMKA",query,"sql")
        navigationObject.setQueryParams("segBOMKA", {
              	"x":Mat_id,
            });
        	navigationObject.addCustomInfo("WOId",Mat_id);
        	navigationObject.addCustomInfo("Obj_type","MAT");
        	scopeObj.navigateTo("frmBillOfMaterialKA", navigationObject);
      }
      catch(e){
        var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_SHOWFORM_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_SHOWFORM_IN_CONTROLLER_EXTENSION, e);
            kony.sdk.mvvm.log.error(exception.toString());
      }
    }
});