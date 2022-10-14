/*
 * Controller Extension class for frmListKA
 * Developer can edit the existing methods or can add new methods if required
 *
 */
kony = kony || {};
kony.sdk = kony.sdk || {};
kony.sdk.mvvm = kony.sdk.mvvm || {};
kony.sdk.mvvm.v2 = kony.sdk.mvvm.v2 || {};
kony.sdk.mvvm.frmListKAControllerExtension = Class(kony.sdk.mvvm.BaseFormControllerExtension, {
	constructor: function(controllerObj) {
		this.$class.$super.call(this, controllerObj);
		this.selectedRecords = [];
		this.isStatusOn = false;
		this.isDateTimeOn = false;
		this.isTechnicianOn = false;
		this.selectedsegmentIndexes = [];
		this.stopWatchFields = [];
      	this.previousSelectedIndex = [];
	},
	fetchData: function() {
		try {
			var scopeObj = this;
			kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen("Loading Data");
			scopeObj.GlobalSearch();
		} catch (err) {
			kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
			alert(err.getErrorObj().errmsg);
			kony.sdk.mvvm.log.error("Error in fetchData of controllerExtension");
			var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_FETCH_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_FETCH_IN_CONTROLLER_EXTENSION, err);
			kony.sdk.mvvm.log.error(exception.toString());
		}

		function success(response) {
			kony.sdk.mvvm.log.info("success fetching data ", response);
			
			scopeObj.getController().processData(response);
			
			
		}

		function error(err) {
			//Error fetching data
			kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();


			alert(err.getErrorObj().errmsg);
			kony.sdk.mvvm.log.error("In fetchData errorcallback in controller extension ", err);
			var exception = scopeObj.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_FETCH_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_FETCH_IN_CONTROLLER_EXTENSION, err);
			kony.sdk.mvvm.log.error(exception.toString());
		}
	},
	processData: function(data) {
		try {
			var scopeObj = this;
			var processedData = this.$class.$superp.processData.call(this, data);
			this.getController().bindData(processedData);
			//scopeObj.ImplementBatching(false, data["_raw_response_"].segListKA.nextBatchId);	
			//  return processedData;
		} catch (err) {
			kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
			//kony.sdk.mvvm.log.error("Error in processData of controllerExtension");
			var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_FORMATDATA_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_FORMATDATA_IN_CONTROLLER_EXTENSION, err);
			kony.sdk.mvvm.log.error(exception.toString());
		};

	},
	getPriorityImage: function(priority) {
		switch (priority && priority.toLowerCase()) {
			case "critical":
				return "critical.png";
			case "medium":
				return "medium.png";
			case "high":
				return "high.png";
			default:
				return "low.png";
		}
	},
	formatDate: function(dateToFormat) {
		if (dateToFormat)
			return dateToFormat.slice(6, 8) + "/" + dateToFormat.slice(4, 6) + "/" + dateToFormat.slice(0, 4)
		else
			return " ";
	},
	formatTime: function(timeToFormat) {
		if (timeToFormat) {
			var hrs = timeToFormat.slice(0, 2);
			var mts = timeToFormat.slice(2, 4);
			var Longhrs = parseInt(hrs) % 12;
			if (parseInt(hrs) == 0)
				return "12" + ":" + mts + " " + "AM";
			if (parseInt(hrs) == 12)
				return "12" + ":" + mts + " " + "PM";
			if (parseInt(hrs) < 12)
				return hrs + ":" + mts + " " + "AM";
			else
				return ((Longhrs < 10) ? ("0" + Longhrs) : Longhrs) + ":" + mts + " " + "PM";
		} else
			return " ";
	},
	getStatusFromCode: function(statusObj) {
		var statusDesc = {};
		switch (statusObj) {
			case "E0001":
				statusDesc.text = "Pending";
				statusDesc.img = "status_machine_pending_gray.png"
				break;
			case "E0002":
				statusDesc.text = "Scheduled";
				statusDesc.img = "status_machine_scheduled_gray.png";
				break;
			case "E0003":
				statusDesc.text = "On Route";
				statusDesc.img = "status_machine_on_route_gray.png";
				break;
			case "E0004":
				statusDesc.text = "Started";
				statusDesc.img = "status_machine_started_gray.png";
				break;
			case "E0005":
				statusDesc.text = "Paused";
				statusDesc.img = "status_machine_paused_gray.png";
				break;
			case "E0006":
				statusDesc.text = "Completed";
				statusDesc.img = "status_machine_technical_completed_gray.png";
				break;
			default:
				statusDesc.text = "Scheduled";
				statusDesc.img = "status_machine_scheduled_gray.png";
		}
		return statusDesc;
	},
	getTrackingImage: function(responseData) {
        var modifiedData = {};
        var statusList = [];
        var currentDateTime = moment().format("YYYYMMDDHHmmss");
        var plannedStartDate = moment(responseData["PlannedStartDate"], "DD/MM/YYYYhh:mm A").format("YYYYMMDDHHmmss");
        if (parseInt(responseData["PlannedEndDate"]) && moment(currentDateTime, "YYYYMMDDHHmmss").diff(moment(responseData["PlannedEndDate"], "YYYYMMDDHHmmss"), 'seconds') > 0) {
            //Delayed icon
            statusList =["Started", "Paused","On Route"];
            if (statusList.indexOf(responseData["Status_id"]) > -1) {
                return {
                    "skin": "sknBtnDelayIconKA",
                    "text": "Delayed"
                };
            }

            //Expired icon
            statusList =  ["Scheduled","Pending"];
            if (statusList.indexOf(responseData["Status_id"]) > -1) {
                return {
                    "skin": "sknBtnExpireIconKA",
                    "text": "Expired"
                };
            }
        }
        if (parseInt(plannedStartDate) && (moment(currentDateTime, "YYYYMMDDHHmmss").diff(moment(plannedStartDate, "YYYYMMDDHHmmss"), 'seconds') > 0) && (moment(responseData["PlannedEndDate"], "YYYYMMDDHHmmss").diff(moment(currentDateTime, "YYYYMMDDHHmmss"), 'seconds') > 0)) {
            //Late icon
            statusList = ["Scheduled"];
            if (statusList.indexOf(responseData["Status_id"]) > -1) {
                return {
                    "skin": "sknBtnLateIconKA",
                    "text": "Late"
                };
            }
        }

        if (parseInt(plannedStartDate) && moment(currentDateTime, "YYYYMMDDHHmmss").diff(moment(plannedStartDate, "YYYYMMDDHHmmss"), 'seconds') > 0) {

            //Missed icon
            statusList = ["Pending"];
            if (statusList.indexOf(responseData["Status_id"]) > -1) {
                return {
                    "skin": "sknBtnMissedIconKA",
                    "text": "Missed"
                };
            }
        }

        if (parseInt(responseData["PlannedEndDate"]) && moment(responseData["PlannedEndDate"], "YYYYMMDDHHmmss").diff(moment(currentDateTime, "YYYYMMDDHHmmss"), 'seconds') > 0) {
            //Ontime icon
            statusList = ["Started", "Paused","On Route"];
            if (statusList.indexOf(responseData["Status_id"]) > -1) {
                return {
                    "skin": "sknBtnOntimeKA",
                    "text": "ontime"
                };
            }
        }
        //blank icon
        return {
            "skin": "sknBtnDefTrackingKA",
            "text": "default"
        };
    },
	getAddresField: function(dataObj) {
		var formmodel = this.getController().getFormModel();
		var ArrayObj = dataObj["segListKA"]["segListKA"].getData();
		for (var i = 0; i < ArrayObj.length; i++) {
			ArrayObj[i]["PriorityType"] = this.getPriorityImage(ArrayObj[i]["Priority"]);
			var statusObj = this.getStatusFromCode(ArrayObj[i]["Status_id"]);
			ArrayObj[i]["Status_id"] = statusObj.text;
			if(ArrayObj[i]["Status_id"] == "Completed"){
				ArrayObj[i]["lastmodifiedts"] = {
					"skin": "sknGreyKA",
					"text": " ",
					"isVisible": true
				};
			}else{
				ArrayObj[i]["lastmodifiedts"] = {
					"skin": "sknLbl5E5050ClanProBook25KA",
					"text": " ",
					"isVisible": true
				};
			}
			ArrayObj[i]["MaintenancePlant"] = statusObj.img;
			ArrayObj[i]["PlannedStartDate"] = convertTimeZone(moment(ArrayObj[i]["PlannedStartDate"], "YYYYMMDDHHmmss").format(), kony.BPT.remoteTimeZone, null, 'DD/MM/YYYYhh:mm A');
			ArrayObj[i]["PlannedEndDate"] = convertTimeZone(moment(ArrayObj[i]["PlannedEndDate"], "YYYYMMDDHHmmss").format(), kony.BPT.remoteTimeZone, null,'YYYYMMDDHHmmss');
			ArrayObj[i]["Instructions"] = this.getTrackingImage(ArrayObj[i]);
			ArrayObj[i]["PlannedStartDate"] = ArrayObj[i]["PlannedStartDate"].slice(0, 10) + "\n" + ArrayObj[i]["PlannedStartDate"].slice(10);
			ArrayObj[i]["Address1Map"] = ArrayObj[i]["Address1Map"] + ArrayObj[i]["Address2Map"] + " " + "," + ArrayObj[i]["Address3Map"] + "," + ArrayObj[i]["CityMap"] + "," + ArrayObj[i]["RegionMap"] + "," + ArrayObj[i]["ZipcodeMap"] + " ";		
			if(!ArrayObj[i]["Description"])
				ArrayObj[i]["Description"]=" ";
			ArrayObj[i]["TechnicianSecHeader"] = ArrayObj[i]["Technician"] + " " + ArrayObj[i]["LastName"];
			ArrayObj[i]["Technician"] = ArrayObj[i]["Technician"] + " " + ArrayObj[i]["LastName"];
			if (ArrayObj[i]["Technician"].length > 9)
				ArrayObj[i]["Technician"] = ArrayObj[i]["Technician"].substring(0, 9) + "...";
			ArrayObj[i]["Code1"] = ArrayObj[i]["Code"];
			ArrayObj[i]["Code"] = {
				"skin": "sknUnselectedTrackingKA",
				"focusSkin": "sknSelectedTrackingIconKA",
				"text": " ",
				"isVisible": false
			};
          ArrayObj[i]["Status_id"] = kony.i18n.getLocalizedString("i18n.BPT.MasterData.Status."+statusObj.text);
		}
		
		dataObj["segListKA"]["segListKA"].setData(ArrayObj);
		return dataObj

	},
	bindData: function(data) {
		try {
			var formmodel = this.getController().getFormModel();
			if (kony.BPT.isLogin) {
				frmListKA.btnListViewKA.skin="sknBtnFF5D6EClanProNews30FFFFFFKA";
                frmListKA.btnListViewKA.focusSkin="sknBtnFFFFFFClanProNews30FF5D6EKA";
                frmListKA.btnMapViewKA.skin="sknBtnFFFFFFClanProNews30FF5D6EKA";
                frmListKA.btnMapViewKA.focusSkin="sknBtnFF5D6EClanProNews30FFFFFFKA";
              	frmListKA.flxListMapKA.setVisibility(false);
                frmListKA.flxSegHeadingKA.setVisibility(true);
                frmListKA.flxViewTypeKA.setEnabled(true);
				kony.BPT.isLogin = 0;
				formmodel.clear();
				var statusArr = data.segSingleSelectStatusKA.segSingleSelectStatusKA.getData();
				var filterStatusArr = data.segStatusKA.segStatusKA.getData();
				var techArr = data.segTechSearchKA.segTechSearchKA.getData();				
				var priorityArr = data.segPriorityKA.segPriorityKA.getData();
				recentAppliedTechnician = [];
				noOfRecentTechnicianStored = 3;
				selectedTechnicians = [];
				for (var j = 0; j < techArr.length; j++) {
					techArr[j].MobilePhone = techArr[j].FirstName;
					techArr[j].FirstName = techArr[j].FirstName + " " + techArr[j].LastName;
                  	}
				formmodel.setWidgetData("segTechSearchKA", techArr);
              	kony.BPT.sortBy.key = 1;
   				kony.BPT.sortType = "FirstName";
              	performSortOnMasterData(frmListKA, "segTechSearchKA");
              	kony.BPT.tempTechData = JSON.parse(JSON.stringify(frmListKA.segTechSearchKA.data));
				kony.BPT.TechnicianData = [];
				/*var segTechnicianNameWidgetDataMap = formmodel.getViewAttributeByProperty("segTechnicianNameKA", "widgetDataMap");
				segTechnicianNameWidgetDataMap["lblTechHeaderKA"] = "sectionHeader";
				formmodel.setViewAttributeByProperty("segTechnicianNameKA", "widgetDataMap", segTechnicianNameWidgetDataMap);
				var finalData = [];
				var dataObj = {};
				dataObj["sectionHeader"] = kony.i18n.getLocalizedString("i18n.BPT.frmListKA.lblAllKA.valueKA");
				finalData.push(dataObj);
				var tempArr = new Array();
				
				for (var i = 0; i < techArr.length; i++) {
					techArr[i]["btnTmpUncheckKA"] = {
						skin: sknBtnPatchKA
					};
					techArr[i]["lblLineTechnicianTmpKA"]={
						"text":" "
					}
					tempArr.push(techArr[i]);
				}
				
				finalData.push(tempArr);			
				formmodel.setWidgetData("segTechnicianNameKA", finalData);
				frmListKA.segTechnicianNameKA.data = finalData;
				kony.BPT.TechnicianData = finalData;*/

				for (var i = 0; i < statusArr.length; i++) {
					var  StatusVal=this.getStatusFromCode(filterStatusArr[i].Code).text;
					statusArr[i].Code = kony.i18n.getLocalizedString("i18n.BPT.MasterData.Status."+StatusVal);;
					statusArr[i]["lblTmpHideStatusKA"]={"text":StatusVal,"isVisible":false};
				}

				formmodel.setWidgetData("segSingleSelectStatusKA", statusArr);
				for (var i = 0; i < filterStatusArr.length; i++) {					
                  	var  StatusVal=this.getStatusFromCode(filterStatusArr[i].Code).text;
                  	kony.BPT.statusList[i] = StatusVal;
                  	filterStatusArr[i]["lblTmpHideStatusKA"]={"text":StatusVal,"isVisible":false};
					filterStatusArr[i].Code = kony.i18n.getLocalizedString("i18n.BPT.MasterData.Status."+StatusVal);
                  
					
					filterStatusArr[i]["btnTmpUncheckKA"] = {
						skin: sknBtnPatchKA
					};
					filterStatusArr[i]["lblLineStatusTmpKA"]={
						"text":" "
					}
				}

				formmodel.setWidgetData("segStatusKA", filterStatusArr);
				kony.BPT.savestatusData = filterStatusArr;
				for (var i = 0; i < priorityArr.length; i++) {
					var prioritVal=priorityArr[i]["Description"];
					kony.BPT.priorityList[i] = priorityArr[i]["Description"];
					priorityArr[i]["btnTmpUncheckKA"] = {
						skin: sknBtnPatchKA
					};
					priorityArr[i]["lblLineStatusTmpKA"]={
						"text":" "
					};
					priorityArr[i]["lblTmpHideStatusKA"]={"text":prioritVal,"isVisible":false};
					priorityArr[i]["Description"]=kony.i18n.getLocalizedString("i18n.BPT.MasterData.Priority."+prioritVal);
				}
				formmodel.setWidgetData("segPriorityKA", priorityArr);
				kony.BPT.savepriorityData = priorityArr;
				if (kony.BPT.userDetails) {
					var userName = kony.BPT.userDetails[0].FirstName + " " + kony.BPT.userDetails[0].LastName;
					if (userName.length > 10)
					   userName = userName.substring(0, 10) + "...";
					formmodel.setViewAttributeByProperty("lblNameKA", "text", userName);

				}
				LoadFilterValues("Today", formmodel);				
				formmodel.showView();
              	kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
			}
			var segListWidgetDataMap = formmodel.getViewAttributeByProperty("segListKA", "widgetDataMap");
			segListWidgetDataMap["lblListHeaderKA"] = "sectionHeader";
			var data = this.getAddresField(data);
			var customInfo = this.getGroupingRelatedInfo();
			var finalSegdata = (customInfo["useCustomGrouping"] === true) ? this.getGroupedData(data["segListKA"]["segListKA"].getData(), customInfo):data["segListKA"]["segListKA"].getData();		
			if(kony.BPT.isFirstBatch){
				formmodel.setViewAttributeByProperty("segListKA", "widgetDataMap", segListWidgetDataMap);
				formmodel.setWidgetData("segListKA", finalSegdata);
				if(customInfo["useCustomGrouping"]){
					frmListKA.segListKA.dockSectionHeaders = true;
				}else{
					frmListKA.segListKA.dockSectionHeaders = false;
				}
			}
			else{
				//Add a condition for bulk edit
				if(frmListKA.flxBulkActionBarKA.isVisible)
					finalSegdata = this.setBulkEdit(finalSegdata);
				frmListKA.segListKA.addAll(finalSegdata);
			}
			
			this.getController().getFormModel().formatUI();
			kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
			if (kony.BPT.fromViews) {
				kony.BPT.fromViews = 0;
				LoadFilterValues(kony.BPT.currentView, formmodel);
			}

		} catch (err) {
			kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
			alert(err.getErrorObj().errmsg);
			//kony.sdk.mvvm.log.error("Error in bindData of controllerExtension");
			var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_BINDDATA_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_BINDDATA_IN_CONTROLLER_EXTENSION, err);
			kony.sdk.mvvm.log.error(exception.toString());
		}

	},
	ImplementPagination:function()
	{		
			//if(kony.BPT.saveDataForFutureGrouping[kony.BPT.pageIndex])	
				try
				{					
					if(kony.BPT.saveDataForFutureGrouping.length)
					{
					var response={};
					response.segListKA=kony.BPT.saveDataForFutureGrouping.slice(0,10);
					kony.BPT.saveDataForFutureGrouping.splice(0,10);
					if(response.segListKA)
						this.processData(response);	  
					}
				}
				catch(err)
				{
					doNothing();
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
			this.$class.$superp.fetchMasterDataForWidget.call(this, propertyId, contextData, successcallback, errorcallback);
		} catch (e) {
			kony.sdk.mvvm.log.error("Error in fetchingMasterDataForWidget", e);
		}
	},
	ImplementBatching: function(isFirstBatch, batchid) {	
		var scopeObj = this;
		kony.BPT.batchSizeConfig = "100000";//Maintaining BatchSize as 100KB
		/*if (isFirstBatch) {
			kony.BPT.isFirstBatch = true;
			kony.BPT.FinalBatchQuery = kony.BPT.FinalQuery + "&$" + "batchsize=" + kony.BPT.batchSizeConfig;
		} else {
			kony.BPT.isFirstBatch = false;
			if(kony.BPT.otherRequest)
				{
					return;
				}
			
			if (batchid)
				kony.BPT.FinalBatchQuery = kony.BPT.FinalQuery + "&$" + "batchid=" + batchid;
			else {
				return;
			}
		}     */      		
			var contextData = this.getController().getContextData();
			contextData.setQuery("segListKA", kony.BPT.FinalQuery, "sql");
			var groupwidgetcontext = this.createGroupWidgetsContext();
			if(!kony.BPT.isFirstBatch)
			{	
              if(kony.BPT.otherRequest)
                {
                  return;
                }
			groupwidgetcontext.fetchDataForGroupWidget("segListKA", sucCallback, errorcallback);
			}			
			else
			{	
		
			if (kony.BPT.isLogin)
			{
				scopeObj.$class.$superp.fetchData.call(this, sucCallbackForNew, errorNewcallback);				
			}
			else
			{
				groupwidgetcontext.fetchDataForGroupWidget("segListKA", sucCallbackForNew, errorNewcallback);
			}
			}
			function sucCallbackForNew(response) {				
					kony.BPT.otherRequest=false;
					sucCallback(response);		
					
				}
			function sucCallback(response) {
				if(kony.BPT.otherRequest)
				{
					return;
				}
				//kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
				if(kony.BPT.isFirstBatch)	
				{
				kony.BPT.otherRequest=false;
				var firstPageData=(response.segListKA)&&(response.segListKA.slice(0,10));
				kony.BPT.saveDataForFutureGrouping=kony.BPT.saveDataForFutureGrouping.concat((response.segListKA)&&(response.segListKA.slice(10)));
				response.segListKA=firstPageData;
				
				scopeObj.getController().processData(response);   
				}				
				else{
					scopeObj.saveDataForPagination(response);
				}
			
				kony.BPT.isFirstBatch = false;			
				//scopeObj.ImplementBatching(false, response["_raw_response_"].segListKA.nextBatchId);	
			}
			function errorNewcallback(err) {
				kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
				kony.BPT.otherRequest=false;
				errorcallback(err);
				//alert("error" + JSON.stringify(err));
			}   
			function errorcallback(err) {
				if(kony.BPT.otherRequest)
					return;
              
				kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
              	if(err && err.getErrorObj())
				{
					if(err.getErrorObj().errcode==1011)                	
						alert(kony.i18n.getLocalizedString("i18n.common.alert.error.NetworkError"));
				}
              	else                  
                  {
                    kony.print(err); 
                  }
				
			}        
	},
	saveDataForPagination:function(response)
	{				
		kony.BPT.saveDataForFutureGrouping=kony.BPT.saveDataForFutureGrouping.concat(response.segListKA);		
	},
	 GlobalSearch: function(SearchText) {
		kony.BPT.otherRequest = true;
	 kony.BPT.isFirstBatch = true;
	var contextData = this.getController().getContextData();		
	kony.BPT.saveDataForFutureGrouping = [];
	kony.BPT.pageIndex = 0;
	kony.BPT.saveViewForBatchFailure = kony.BPT.currentView;
	var scopeObj = this;
	if (SearchText) {
	   kony.BPT.FinalFilterQuery= prepareSearchQuery(SearchText, true);
	   frmListKA.segViewsKA.selectedRowIndex= null;
		kony.BPT.previousViewIndex=[0,null];
	  frmListKA.lblCreatedKA.text = "Select View";
	} else {
		if (kony.BPT.manualFilterQuery)
			kony.BPT.FinalFilterQuery = (kony.BPT.manualFilterQuery == " ") ? kony.BPT.manualFilterQuery.trim() : (kony.BPT.manualFilterQuery);
		else
			kony.BPT.FinalFilterQuery = kony.BPT.Finalview[kony.BPT.currentView].filter;
	}
	kony.BPT.FinalQuery = kony.BPT.viewQuery + " " + kony.BPT.FinalFilterQuery + kony.BPT.ManualSortQuery + kony.BPT.GroupExpand;



this.ImplementBatching(true);
},
	performActionOnTechnician: function(segName, fields, searchText) {
		var contextData = this.getController().getContextData();
		var scopeObj = this;
		var query = "";
		if (fields.indexOf("SORT") > -1) {
			fields.pop(fields.indexOf("SORT"));
			for (var i = 0; i < fields.length - 1; i++) {
				query = query + fields[i] + ",";
			}
			query = "&$orderby=" + query + fields[i];
			if (frmListKA.btnDescendingKA.skin == "sknBtnAtoZFilterKA") {
				query = query + " asc";
			} else {
				query = query + " desc";
			}

		}
		var searchquery = "";
		if (searchText) {
			for (var i = 0; i < fields.length - 1; i++) {
				searchquery = searchquery + "substringof(" + fields[i] + ",'" + searchText + "')" + " or ";
			}
			searchquery = "&$filter=" + searchquery + "substringof(" + fields[i] + ",'" + searchText + "')";
		}
		query = query + searchquery;
		contextData.setQuery(segName, query, "odata");
		var groupwidgetcontext = this.createGroupWidgetsContext();
		groupwidgetcontext.fetchDataForGroupWidget(segName, sucCallback, errorcallback);

		function sucCallback(response) {
			kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
			var formmodel = scopeObj.getController().getFormModel();
			var techArr = response[segName];
			for (var j = 0; j < techArr.length; j++) {
				techArr[j].FirstName = techArr[j].FirstName + " " + techArr[j].LastName;
			}
			formmodel.setWidgetData(segName, techArr);
		}

		function errorcallback(err) {
			kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
			alert(kony.i18n.getLocalizedString("i18n.common.alert.error.valueKA")+JSON.stringify(err));
		}
	},
	stopWatchCreate: function(stopWatchFields) {
		var scopeObj = this;
		var modelObj = this.getController().getModel("StopWatch", "BPTService", {
			"access": "online",
			"objectName": "BPTService"
		});
		var dataObject = new kony.sdk.dto.DataObject("StopWatch");
		var createFields = {};
		createFields.WorkOrder_id = stopWatchFields.id;
		createFields.Status_id = stopWatchFields.Status_id;
		var tempDateObj = new Date();
		createFields.ChangeTime = convertTimeZone(moment(tempDateObj).toString(), null, kony.BPT.remoteTimeZone, 'YYYYMMDDHHmmss');
		createFields.Task_id = "";
		dataObject.setRecord(createFields);
		modelObj.create(dataObject, OnSuccess, OnError);

		function OnSuccess(res) {
			//alert("record Updated");
		}

		function OnError(res) {
			//alert("Error");
		}

	},

	saveData: function(fieldTobeUpdated) {
		try {
			var scopeObj = this;
			this.stopWatchFields = [];
			//alert("Im here");
			//this.$class.$superp.saveData.call(this, success, error);
			var modelObj = this.getController().getModel("WorkOrder", "BPTService", {
				"access": "online",
				"objectName": "BPTService"
			});
			var dataObject = new kony.sdk.dto.DataObject("WorkOrder");
			var tempRec = frmListKA.segListKA.selectedItems[0];
			var updateField = {};
			updateField.id = tempRec.primaryKeyValueMap.id;
			var lisFormModel = this.getController().getFormModel();
			//alert(fieldTobeUpdated);
			switch (fieldTobeUpdated) {
				case "Description":
					var Description = frmListKA.txtAreaKA.text;
					updateField.Description = Description;
					kony.BPT.Field = "Description";
					break;
				case "Status":
					var selRec = frmListKA.segSingleSelectStatusKA.selectedItems[0]["Code"];
					var Status = ((typeof selRec == 'object') ? selRec.text : selRec);
					var Statusid = frmListKA.segSingleSelectStatusKA.selectedItems[0]["primaryKeyValueMap"]["Code"];
					updateField.Status_id = Statusid;
					frmListKA.lblTmpStatusKA.text = Status;
					kony.BPT.Field = "Status";
					this.stopWatchFields.push(updateField);
					break;
				case "Date":
					var initialDuration=1;
					 var utcDate;
					var updatedPlannedStartDate = frmListKA.lblStartedTimeKA.text;
					var initialplannedStartDate= kony.BPT.revertFailedFieldUpdate.replace("\n"," ");
					var initalplannedEndDate=(typeof tempRec.PlannedEndDate == 'object') ? (tempRec.PlannedEndDate.text) : (tempRec.PlannedEndDate);
					var updatePlannedEndDate="";
					var doUpdatePlannedEndDate;
					if(parseInt(initalplannedEndDate))
					{					
					 if((moment(initalplannedEndDate,"YYYYMMDDHHmmss").diff(moment(updatedPlannedStartDate, "YYYYMMDDHHmmss"),'seconds'))<0)
					 {
						initialDuration=moment(initalplannedEndDate,"YYYYMMDDHHmmss").diff(moment(initialplannedStartDate, "DD/MM/YYYYhh:mm A"),'seconds'); 
						 doUpdatePlannedEndDate=true;
						updatePlannedEndDate=convertTimeZone(moment(updatedPlannedStartDate,"YYYYMMDDHHmmss").add(initialDuration,'seconds').format(),null, kony.BPT.remoteTimeZone, 'YYYYMMDDHHmmss');
					}
					else
						doUpdatePlannedEndDate=false;						
					}
					else
					{
						updatePlannedEndDate=convertTimeZone(moment(updatedPlannedStartDate,"YYYYMMDDHHmmss").add(initialDuration,'seconds').format(), null, kony.BPT.remoteTimeZone, 'YYYYMMDDHHmmss');                     
					 doUpdatePlannedEndDate=true;
					}	
				   utcDate = convertTimeZone(moment(updatedPlannedStartDate, "YYYYMMDDHHmmss").format(), null, kony.BPT.remoteTimeZone, 'YYYYMMDDHHmmss')						
					updateField.PlannedStartDate = utcDate;
					if(doUpdatePlannedEndDate)				
					{						
					updateField.PlannedEndDate=updatePlannedEndDate;	
					frmListKA.lblPlannedEndDateKA.text=updatePlannedEndDate;
					}					
					kony.BPT.revertPlannedEndDate=initalplannedEndDate;
					
					kony.BPT.Field = "Date";
					break;
				case "Technician":
					var selRec = frmListKA.segTechSearchKA.selectedItems[0];
					var techName = selRec["FirstName"];
					var LastName = selRec.LastName;
					var FirstName = selRec["MobilePhone"];
					FirstName = ((typeof FirstName == 'object') ? FirstName.text : FirstName);
					techName = ((typeof techName == 'object') ? techName.text : techName);
					LastName = ((typeof LastName == 'object') ? LastName.text : LastName);

					frmListKA.lblTmpTechnicianKA.text = techName;
					frmListKA.lblTechFullNameKA.text = techName;
					var techId = frmListKA.segTechSearchKA.selectedItems[0]["primaryKeyValueMap"]["WorkCenter_id"];
					updateField.WorkCenter_id = techId;
					updateField.SystemUserFirstName = FirstName;
					updateField.SystemUserLastName = LastName;
					kony.BPT.Field = "Technician";
					break;
			}
			dataObject.setRecord(updateField);
			modelObj.update(dataObject, OnSuccess, OnError);

			function OnSuccess(res) {              
				if (kony.BPT.Field == "Status" && scopeObj.stopWatchFields[0]) {
					scopeObj.stopWatchCreate(scopeObj.stopWatchFields[0]);
				}
			}

			function OnError(err) {
				switch (kony.BPT.Field) {
					case "Date":
						frmListKA.lblStartedDateKA.text = kony.BPT.revertFailedFieldUpdate;
						frmListKA.lblPlannedEndDateKA.text=kony.BPT.revertPlannedEndDate;
						break;
					case "Description":
						frmListKA.lblTmpDescKA.text = kony.BPT.revertFailedFieldUpdate;
						break;
					case "Status":
						frmListKA.lblTmpStatusKA.text = kony.BPT.revertFailedFieldUpdate;
						break;
					case "Technician":
						frmListKA.lblTmpTechnicianKA.text = kony.BPT.revertFailedFieldUpdate;
						break;


				}
                if(err && err.getRootErrorObj())
                  {
                  	alert(err.getRootErrorObj().errmsg);
                  }
                 // getBackFlex();
			}
		} catch (err) {
			var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_SAVEDATA_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_SAVEDATA_IN_CONTROLLER_EXTENSION, err);
			kony.sdk.mvvm.log.error(exception.toString());
		}

		function success(res) {
			//Successfully created record
			kony.sdk.mvvm.log.info("success saving record ", res);
		}

		function error(err) {
			//Handle error case
			kony.sdk.mvvm.log.error("In saveData errorcallback in controller extension ", err);
			var exception = scopeObj.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_SAVEDATA_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_SAVEDATA_IN_CONTROLLER_EXTENSION, err);
			kony.sdk.mvvm.log.error(exception.toString());
		}

	},
	deleteData: function() {
		try {
			var scopeObj = this;
			this.$class.$superp.deleteData.call(this, success, error);
		} catch (err) {
			var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_DELETEDATA_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_DELETEDATA_IN_CONTROLLER_EXTENSION, err);
			kony.sdk.mvvm.log.error(exception.toString());
		}

		function success(res) {
			//Successfully deleting record
			kony.sdk.mvvm.log.info("success deleting record " + JSON.stringify(res));
		}

		function error(err) {
			//Handle error case
			kony.sdk.mvvm.log.error("In deleteData errorcallback in controller extension ", err);
			var exception = scopeObj.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_DELETEDATA_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_DELETEDATA_IN_CONTROLLER_EXTENSION, err);
			kony.sdk.mvvm.log.error(exception.toString());
		}
	},

	showDetailsForm: function() { //navigating to Details form with data
		try {
			var formmodel = this.getController().getFormModel();
			var selRecord = formmodel.getViewAttributeByProperty("segListKA", "selectedItems")[0];
			var datamodel = new kony.sdk.mvvm.DataModel();			
			datamodel.setPrimaryKeyValueMap(selRecord.primaryKeyValueMap);
			var navigationObject = new kony.sdk.mvvm.NavigationObject();
			navigationObject.setDataModel(datamodel, kony.sdk.mvvm.OperationType.FILTER_BY_PRIMARY_KEY, "form");
          	navigationObject.setCustomInfo("priorityImage",(typeof selRecord["PriorityType"] == 'object') ? (selRecord["PriorityType"].src) : (selRecord["PriorityType"]));
			var controller = kony.sdk.mvvm.KonyApplicationContext.getAppInstance().getFormController("frmDetailsKA")
			controller.loadDataAndShowForm(navigationObject);
		} catch (err) {
          	if(err && err.getRootErrorObj())
              {
              	alert(err.getRootErrorObj().errmsg);
                kony.BPT.otherRequest=false;
              }
			kony.appfoundation.log.error("error in Blogic showOrderExecutionForm : " + err);
		}
	},
	showAnimatedFlex: function(callback) {
		var formModel = this.getController() && this.getController().getFormModel();
		if(formModel.getViewAttributeByProperty("flxOnClickFlxViewsKA","isVisible"))
			return;
		formModel.performActionOnView("flxMain2KA","setEnabled",[false]);
		if(formModel.getViewAttributeByProperty("flxBulkActionBarKA","isVisible")){
			var selectedIndexVal;
			selectedIndexVal = formModel.getViewAttributeByProperty("segListKA","selectedRowIndex"); //frmListKA.segListKA.selectedRowIndex;
			var poppingIndex = selectedIndexVal.pop();
		} else {
			var selectedRecord = formModel.getViewAttributeByProperty("segListKA","selectedItems")[0];
			var statusData = (typeof selectedRecord["Status_id"] == 'object') ? (selectedRecord["Status_id"].text) : (selectedRecord["Status_id"]);
			if (statusData == "Completed") {
				return;
			}
			animation(callback);
			formModel.performActionOnView("imgStatusKA","setVisibility",[true]);
			formModel.setViewAttributeByProperty("btnInFlxTrackingKA","skin",selectedRecord["Instructions"].skin);
			formModel.setViewAttributeByProperty("lblTmpTypeKA","text",(typeof selectedRecord["Type_id"] == 'object') ? (selectedRecord["Type_id"].text) : (selectedRecord["Type_id"]));
			formModel.setViewAttributeByProperty("lblTmpDescKA","text",(typeof selectedRecord["Description"] == 'object') ? (selectedRecord["Description"].text) : (selectedRecord["Description"]));
			formModel.setViewAttributeByProperty("lblTmpLocationKA","text",(typeof selectedRecord["Address1Map"] == 'object') ? (selectedRecord["Address1Map"].text) : (selectedRecord["Address1Map"]));
			formModel.setViewAttributeByProperty("imgStatusKA","src",(typeof selectedRecord["MaintenancePlant"] == 'object') ? (selectedRecord["MaintenancePlant"].src) : (selectedRecord["MaintenancePlant"]));
			formModel.setViewAttributeByProperty("lblTmpStatusKA","text",statusData);
			formModel.setViewAttributeByProperty("imgPriorityKA","src",(typeof selectedRecord["PriorityType"] == 'object') ? (selectedRecord["PriorityType"].src) : (selectedRecord["PriorityType"]));
			formModel.setViewAttributeByProperty("lblTmpPriorityKA","text",(typeof selectedRecord["Priority"] == 'object') ? (selectedRecord["Priority"].text) : (selectedRecord["Priority"]));
			formModel.setViewAttributeByProperty("lblStartedTmpKA","text","Started at");
			formModel.setViewAttributeByProperty("lblStartedDateKA","text",(typeof selectedRecord["PlannedStartDate"] == 'object') ? (selectedRecord["PlannedStartDate"].text) : (selectedRecord["PlannedStartDate"]));
			formModel.setViewAttributeByProperty("lblStartedTimeKA","text",(typeof selectedRecord["PlannedStartDate"] == 'object') ? (selectedRecord["PlannedStartDate"].text) : (selectedRecord["PlannedStartDate"]));
			formModel.setViewAttributeByProperty("lblPlannedEndDateKA","text",(typeof selectedRecord["PlannedEndDate"] == 'object') ? (selectedRecord["PlannedEndDate"].text) : (selectedRecord["PlannedEndDate"]));
			formModel.performActionOnView("lblPlannedEndDateKA","setVisibility",[false]);
			formModel.setViewAttributeByProperty("lblTmpTechnicianKA","text",(typeof selectedRecord["Technician"] == 'object') ? (selectedRecord["Technician"].text) : (selectedRecord["Technician"]));
			formModel.setViewAttributeByProperty("lblTechFullNameKA","text",(typeof selectedRecord["TechnicianSecHeader"] == 'object') ? (selectedRecord["TechnicianSecHeader"].text) : (selectedRecord["TechnicianSecHeader"]));
			kony.BPT.lattitudeOfRec = (typeof selectedRecord["Latitude"] == 'object') ? (selectedRecord["Latitude"].text) : (selectedRecord["Latitude"]);
			kony.BPT.longitudeOfRec = (typeof selectedRecord["Longitude"] == 'object') ? (selectedRecord["Longitude"].text) : (selectedRecord["Longitude"]);
			kony.BPT.primaryMap = selectedRecord.primaryKeyValueMap;
			formModel.performActionOnView("flxListMainKA","setEnabled",[false]);			
		}
	},
	getGroupingRelatedInfo: function() {
		/* Enables or diables grouping related custom Info based on the current view applied */
		var frmConfig = new kony.sdk.mvvm.ConfigClass(frmListKAConfig);
		var customInfo = frmConfig.getCustomInfo("segListKA");
		if (kony.BPT.currentView === "High priority" || kony.BPT.currentView === "Available") {
			customInfo["useCustomGrouping"] = true;
			customInfo["groupBy"] = "PlannedStartDate";
			customInfo[""] = "";
		} else if (kony.BPT.currentView === "In Progress" || kony.BPT.currentView === "By Technician") {
			customInfo["useCustomGrouping"] = true;
			customInfo["groupBy"] = "TechnicianSecHeader";
			customInfo[""] = "";
		} else {
			customInfo["useCustomGrouping"] = false;
			customInfo["groupBy"] = "";
			customInfo[""] = "";
		}
		return customInfo;
	},
	getGroupedData: function(data, customInfo) {
		var finalData = [];
		var count = 0;
		var sectionKey = customInfo.groupBy;
		var sectionHeader = {};
		var sectionVal;
		var dataObj = {};
		if (data !== undefined && data !== null) {
			for (var index = 0; index < data.length; index++) {
				if (data[index][sectionKey] !== null && data[index][sectionKey] !== undefined) {
					sectionVal = data[index][sectionKey];
					if (sectionVal.hasOwnProperty("text")) {
						sectionVal = sectionVal.text;
					}
					if (sectionVal && sectionVal.trim() !== "") {
						switch (sectionKey) {
							case "PlannedStartDate":
								sectionVal = this.getDate(sectionVal);
								break;
							default:
								sectionVal = sectionVal.trim();
								break;
						}
					} else {
						sectionVal = " ";
					}
				} else {
					sectionVal = " ";
				}
				if (!sectionHeader.hasOwnProperty(sectionVal)) { //Creating a new section header 
					dataObj = {};
					dataObj["sectionHeader"] = sectionVal;
					var platFormName = kony.sdk.mvvm.Utils.getPlatformName();
					if ((platFormName === kony.sdk.mvvm.Platforms["IPHONE"] || platFormName === kony.sdk.mvvm.Platforms["IPAD"]) && customInfo["useCustomGrouping"]) {
						dataObj["metainfo"] = {
							'sectionTitle': sectionVal
						};
					}
					finalData[count] = new Array();
					finalData[count].push(dataObj);
					var tempArr = new Array();
					tempArr.push(data[index]);
					finalData[count].push(tempArr);
					var tempObj = {};
					tempObj["index"] = count;
					tempObj["noofrows"] = 1;
					sectionHeader[sectionVal] = tempObj;
					count++;
				} else { //existing section
					finalData[sectionHeader[sectionVal]["index"]][1].push(data[index]);
					sectionHeader[sectionVal]["noofrows"] += 1;
				}
			}
		}
		return finalData;
	},
	getDate: function(timestamp) {
		if (timestamp !== null && timestamp !== undefined && timestamp.length > 0) {
			timestamp = timestamp.substr(0, 10);
		}
		return timestamp;
	},
	showBulkEdit: function() {
		var formModel = this.getController().getFormModel();
		formModel.setViewAttributeByProperty("flxBulkActionBarKA", "isVisible", "true");
		formModel.setViewAttributeByProperty("flxBlockHeaderKA", "isVisible", "true");
		var rowTemplate = formModel.getViewAttributeByProperty("segListKA", "rowTemplate");
		//alert("Row Template" + rowTemplate);
		rowTemplate.btnSelectRowKA.skin = sknUnselectedTrackingKA;
		rowTemplate.btnSelectRowKA.focusSkin = sknUnselectedTrackingKA;
		rowTemplate.btnSelectRowKA.text = "";
		rowTemplate.flxImgTrackingKA.skin = sknFlxEBEEEEKA;
		rowTemplate.btnSelectRowKA.isVisible = true;
		formModel.setViewAttributeByProperty("segListKA", "rowTemplate", rowTemplate);
		formModel.performActionOnView("flxTrackingKA", "setEnabled", [false]);
		formModel.performActionOnView("flxTypeKA", "setEnabled", [false]);
		formModel.performActionOnView("flxDescKA", "setEnabled", [false]);
		formModel.performActionOnView("flxLocationAK", "setEnabled", [false]);
		formModel.performActionOnView("flxStatusPriorityKA", "setEnabled", [false]);
		formModel.performActionOnView("flxStartDateKA", "setEnabled", [false]);
		formModel.performActionOnView("flxTechnicianKA", "setEnabled", [false]);
		formModel.performActionOnView("tbxSearchKA", "setEnabled", [false]);
		var segmentData = formModel.getWidgetData("segListKA").getData();
		if (this.isGroupingEnabled()) {
			for (var section_index = 0; section_index < segmentData.length; section_index++) {
				for (var row_index = 0; row_index < segmentData[section_index][1].length; row_index++) {
					if((typeof(segmentData[section_index][1][row_index]["Status_id"]) == 'object' ? segmentData[section_index][1][row_index]["Status_id"].text : segmentData[section_index][1][row_index]["Status_id"]) !="Completed"){
						segmentData[section_index][1][row_index]["Code"]["skin"] = "sknUnselectedTrackingKA";
						segmentData[section_index][1][row_index]["Code"]["focusSkin"] = "sknSelectedTrackingIconKA";
						segmentData[section_index][1][row_index]["Code"]["isVisible"] = true;
					}
				}
			}
		} else {
			for (var section_index = 0; section_index < segmentData.length; section_index++) {
				if((typeof(segmentData[section_index]["Status_id"]) == 'object' ? segmentData[section_index]["Status_id"].text : segmentData[section_index]["Status_id"]) !="Completed"){
					segmentData[section_index]["Code"]["skin"] = "sknUnselectedTrackingKA";
					segmentData[section_index]["Code"]["focusSkin"] = "sknSelectedTrackingIconKA";
					segmentData[section_index]["Code"]["isVisible"] = true;
				}
			}
		}
		formModel.setWidgetData("segListKA", segmentData);
		formModel.setViewAttributeByProperty("lblNoOfSelectedKA", "text", "0 Items Selected");
	},
	selectRecordsForEdit: function() {
		var formModel = this.getController().getFormModel();
		var selectedRecord = formModel.getViewAttributeByProperty("segListKA", "selectedItems");
		var rowIndex = formModel.getViewAttributeByProperty("segListKA", "selectedIndex");
		if((typeof(selectedRecord[0]["Status_id"]) == 'object' ? selectedRecord[0]["Status_id"].text : selectedRecord[0]["Status_id"]) !="Completed"){
			if (selectedRecord[0]["Code"]["skin"] === "sknSelectedTrackingIconKA") {
				selectedRecord[0]["Code"]["skin"] = "sknUnselectedTrackingKA";
				selectedRecord[0]["Code"]["focusSkin"] = "sknSelectedTrackingIconKA";				
				//selectedRecord[0]["Code"]["isVisible"] = true;
				this.removeUnselectedItems(selectedRecord);
			} else {
				selectedRecord[0]["Code"]["skin"] = "sknSelectedTrackingIconKA";
				selectedRecord[0]["Code"]["focusSkin"] = "sknUnselectedTrackingKA";
				//selectedRecord[0]["Code"]["isVisible"] = true;
				var tempRec={};
				tempRec=selectedRecord[0]["primaryKeyValueMap"];
				tempRec.PlannedStartDate=selectedRecord[0]["PlannedStartDate"].replace("\n"," ");
				tempRec.PlannedEndDate=selectedRecord[0]["PlannedEndDate"];
				this.selectedRecords.push(tempRec);
				//this.selectedsegmentIndexes.push(rowIndex);
			}
		}		
		var len = this.selectedRecords.length;
		var str = String(len) + " Items Selected";
		formModel.setViewAttributeByProperty("lblNoOfSelectedKA", "text", str);  
        var tempData=frmListKA.segListKA.data;
      try
        {
        if((tempData.length==1)&&(!tempData[0].length))
                  {                    
                    frmListKA.segListKA.setData(selectedRecord) ;
                  }
         else                                                      		 
			formModel.performActionOnView("segListKA", "setDataAt", [selectedRecord[0], rowIndex[1], rowIndex[0]]);
        }
      catch(err)
        {
         formModel.performActionOnView("segListKA", "setDataAt", [selectedRecord[0], rowIndex[1], rowIndex[0]]); 
        }
	},
	removeUnselectedItems: function(selectedRecord) {
		var index = this.selectedRecords.indexOf(selectedRecord[0]["primaryKeyValueMap"]);
		this.selectedRecords.splice(index, 1);
		//this.selectedsegmentIndexes.splice(index, 1);
	},
	showStatusList: function() {
	var formModel = this.getController().getFormModel();
	if (this.isStatusOn) {
		formModel.performActionOnView("flxSelectStatusKA", "setVisibility", [false]);
		this.isStatusOn = false;
	} else {
		formModel.setViewAttributeByProperty("flxSingleSelectHeadKA", "left", "9%");
		formModel.setViewAttributeByProperty("flxSingleSelectHeadKA", "top", "12%");
		formModel.setViewAttributeByProperty("imgToolTipSingleStatusKA", "left", "23%");
		formModel.setViewAttributeByProperty("imgToolTipSingleStatusKA", "top", "10%");
		formModel.setViewAttributeByProperty("flxMergeSingleStatusKA", "left", "9%");
		formModel.setViewAttributeByProperty("flxMergeSingleStatusKA", "top", "18%");
		formModel.setViewAttributeByProperty("flxScrollStatusSegKA", "left", "9%");
		formModel.setViewAttributeByProperty("flxScrollStatusSegKA", "top", "18%");
		formModel.setViewAttributeByProperty("flxLeftBlockKA", "width", "9%");
		formModel.setViewAttributeByProperty("flxTopBlockKA", "height", "10%");
		formModel.setViewAttributeByProperty("flxRightBlockKA", "width", "60%");
		formModel.setViewAttributeByProperty("flxBottomBlockKA", "height", "55%");
		formModel.performActionOnView("flxSelectStatusKA", "setVisibility", [true]);
		//Dismissing the Date and Technician popups
		formModel.setViewAttributeByProperty("flxMaindateTimeKA", "left", "-100%");
		formModel.performActionOnView("imgToolTipTechTopKA", "setVisibility", [false]);
		formModel.performActionOnView("imgToolTipTechKA", "setVisibility", [true]);
		formModel.performActionOnView("flxTechSearchInListKA", "setVisibility", [false]);
		this.isStatusOn = true;
	}
},
showTechnicianList: function() {
	var formModel = this.getController().getFormModel();
	if (this.isTechnicianOn) {
		formModel.performActionOnView("imgToolTipTechTopKA", "setVisibility", [false]);
		formModel.performActionOnView("imgToolTipTechKA", "setVisibility", [true]);
		formModel.performActionOnView("flxTechSearchInListKA", "setVisibility", [false]);
		this.isTechnicianOn = false;
	} else {
		formModel.setViewAttributeByProperty("flxTechHeadKA", "right", "39%");
		formModel.setViewAttributeByProperty("flxTechMergeKA", "right", "39%");
		formModel.setViewAttributeByProperty("flxTechBodyKA", "right", "39%");
		formModel.performActionOnView("flxTechSearchInListKA", "setVisibility", [true]);
		formModel.performActionOnView("imgToolTipTechTopKA", "setVisibility", [true]);
		formModel.performActionOnView("imgToolTipTechKA", "setVisibility", [false]);
		//Dismissing the status and Date popups
		formModel.setViewAttributeByProperty("flxMaindateTimeKA", "left","-100%");
		formModel.performActionOnView("flxSelectStatusKA", "setVisibility", [false]);
		this.isTechnicianOn = true;
	}
},
	showDateTime: function() {      
		var formModel = this.getController().getFormModel();
		if (this.isDateTimeOn) {
			formModel.setViewAttributeByProperty("flxMaindateTimeKA", "left", "-100%");
          	frmListKA.flxMaindateTimeKA.forceLayout();
			this.isDateTimeOn = false;
		} else {
			try
			{
			var tempDateString=moment().format('DD,MM,YYYY,hh,mm,A');
			var dateCompList=tempDateString.split(",");
			frmListKA.calDateTimeKA.dateComponents = [parseFloat(dateCompList[0]), parseFloat(dateCompList[1]), parseFloat(dateCompList[2]), parseFloat(dateCompList[3]), parseFloat(dateCompList[4]), 0.0];
			frmListKA.lblDateValKA.text = moment().format("ddd, DD MMM YYYY");
			frmListKA.lblTimeKA.text = dateCompList[3] + ":" + dateCompList[4] + " " + dateCompList[5];
			frmListKA.pickerViewTImeKA.selectedKeys = [dateCompList[3], dateCompList[4], dateCompList[5]];
			formModel.setViewAttributeByProperty("flxMaindateTimeKA", "left", "0%");
			//Dismissing the Status and Technician popups					
			formModel.performActionOnView("flxSelectStatusKA", "setVisibility", [false]);
			formModel.performActionOnView("imgToolTipTechTopKA", "setVisibility", [false]);
			formModel.performActionOnView("imgToolTipTechKA", "setVisibility", [true]);
			formModel.performActionOnView("flxTechSearchInListKA", "setVisibility", [false]);
          	frmListKA.flxMaindateTimeKA.forceLayout();
			this.isDateTimeOn = true;
			}
			catch(err)
			{
				kony.print(err);
			}
		}
	},
	clearAllSelected: function() {
		this.selectedRecords.splice(0, this.selectedRecords.length);
		this.isStatusOn = false;
		this.isDateTimeOn = false;
		this.isTechnicianOn = false;
		var formModel = this.getController().getFormModel();
		formModel.setViewAttributeByProperty("flxBulkActionBarKA", "isVisible", false);
		formModel.setViewAttributeByProperty("flxBlockHeaderKA", "isVisible", false);
		var rowTemplate = formModel.getViewAttributeByProperty("segListKA", "rowTemplate");
		//alert("Row Template"+ rowTemplate);
		rowTemplate.btnSelectRowKA.skin = "sknUnselectedTrackingKA";
		rowTemplate.btnSelectRowKA.focusSkin = "sknUnselectedTrackingKA";
		rowTemplate.btnSelectRowKA.text = "";
		rowTemplate.flxImgTrackingKA.skin = "sknFlxFDFDFDKA";
		rowTemplate.btnSelectRowKA.isVisible = false;
		formModel.setViewAttributeByProperty("segListKA", "rowTemplate", rowTemplate);
		var segmentData = formModel.getWidgetData("segListKA").getData();
		formModel.performActionOnView("flxTrackingKA", "setEnabled", [true]);
		formModel.performActionOnView("flxTypeKA", "setEnabled", [true]);
		formModel.performActionOnView("flxDescKA", "setEnabled", [true]);
		formModel.performActionOnView("flxLocationAK", "setEnabled", [true]);
		formModel.performActionOnView("flxStatusPriorityKA", "setEnabled", [true]);
		formModel.performActionOnView("flxStartDateKA", "setEnabled", [true]);
		formModel.performActionOnView("flxTechnicianKA", "setEnabled", [true]);
		formModel.performActionOnView("tbxSearchKA", "setEnabled", [true]);
		formModel.setViewAttributeByProperty("flxSingleSelectHeadKA", "left", "54%");
		formModel.setViewAttributeByProperty("flxSingleSelectHeadKA", "top", "35%");
		formModel.setViewAttributeByProperty("imgToolTipSingleStatusKA", "top", "32.9%");
		formModel.setViewAttributeByProperty("imgToolTipSingleStatusKA", "left", "68%");
		formModel.setViewAttributeByProperty("flxMergeSingleStatusKA", "left", "54%");
		formModel.setViewAttributeByProperty("flxMergeSingleStatusKA", "top", "41%");
		formModel.setViewAttributeByProperty("flxScrollStatusSegKA", "left", "54%");
		formModel.setViewAttributeByProperty("flxScrollStatusSegKA", "top", "41%");
		
		if (this.isGroupingEnabled()) {
			for (var section_index = 0; section_index < segmentData.length; section_index++) {
				for (var row_index = 0; row_index < segmentData[section_index][1].length; row_index++) {
					if((typeof(segmentData[section_index][1][row_index]["Status_id"]) == 'object' ? segmentData[section_index][1][row_index]["Status_id"].text : segmentData[section_index][1][row_index]["Status_id"]) !="Completed"){
						segmentData[section_index][1][row_index]["Code"]["skin"] = "sknUnselectedTrackingKA";
						segmentData[section_index][1][row_index]["Code"]["focusSkin"] = "sknSelectedTrackingIconKA";
						segmentData[section_index][1][row_index]["Code"]["isVisible"] = false;
					}
				}
			}
		} else {
			for (var section_index = 0; section_index < segmentData.length; section_index++) {
				if((typeof(segmentData[section_index]["Status_id"]) == 'object' ? segmentData[section_index]["Status_id"].text : segmentData[section_index]["Status_id"]) !="Completed"){
					segmentData[section_index]["Code"]["skin"] = "sknUnselectedTrackingKA";
					segmentData[section_index]["Code"]["focusSkin"] = "sknSelectedTrackingIconKA";
					segmentData[section_index]["Code"]["isVisible"] = false;
				}
			}
		}
		formModel.setWidgetData("segListKA", segmentData);
	},
	selectAllRecords: function() {
		var formModel = this.getController().getFormModel();
		var rowTemplate = formModel.getViewAttributeByProperty("segListKA", "rowTemplate");
		rowTemplate.btnSelectRowKA.skin = "sknSelectedTrackingIconKA";
		rowTemplate.btnSelectRowKA.focusSkin = "sknUnselectedTrackingKA";
		rowTemplate.btnSelectRowKA.text = "";
		rowTemplate.flxImgTrackingKA.skin = "sknFlxEBEEEEKA";
		rowTemplate.btnSelectRowKA.isVisible = true;
		formModel.setViewAttributeByProperty("segListKA", "rowTemplate", rowTemplate);
		this.selectedRecords.splice(0, this.selectedRecords.length);
		var segmentData = formModel.getWidgetData("segListKA").getData();
		if (this.isGroupingEnabled()) {
			for (var section_index = 0; section_index < segmentData.length; section_index++) {
				for (var row_index = 0; row_index < segmentData[section_index][1].length; row_index++) {
					if((typeof(segmentData[section_index][1][row_index]["Status_id"]) == 'object' ? segmentData[section_index][1][row_index]["Status_id"].text : segmentData[section_index][1][row_index]["Status_id"]) !="Completed"){
						segmentData[section_index][1][row_index]["Code"]["skin"] = "sknSelectedTrackingIconKA";
						segmentData[section_index][1][row_index]["Code"]["focusSkin"] = "sknSelectedTrackingIconKA";
						segmentData[section_index][1][row_index]["Code"]["isVisible"] = true;
						this.selectedRecords.push(segmentData[section_index][1][row_index]["primaryKeyValueMap"]);
					}
				}
			}
		} else {
			for (var section_index = 0; section_index < segmentData.length; section_index++) {
				if((typeof(segmentData[section_index]["Status_id"]) == 'object' ? segmentData[section_index]["Status_id"].text : segmentData[section_index]["Status_id"]) !="Completed"){
					segmentData[section_index]["Code"]["skin"] = "sknSelectedTrackingIconKA";
					segmentData[section_index]["Code"]["focusSkin"] = "sknSelectedTrackingIconKA";
					segmentData[section_index]["Code"]["isVisible"] = true;
					this.selectedRecords.push(segmentData[section_index]["primaryKeyValueMap"]);
				}
			}
		}
		formModel.setWidgetData("segListKA", segmentData);
		var len = this.selectedRecords.length;
		var str = String(len) + " Items Selected";
		formModel.setViewAttributeByProperty("lblNoOfSelectedKA", "text", str);
	},
	clearSelected: function() {
		var formModel = this.getController().getFormModel();
		this.isStatusOn = false;
		this.isDateTimeOn = false;
		this.isTechnicianOn = false;
		formModel.performActionOnView("flxSelectStatusKA", "setVisibility", [false]);
		formModel.performActionOnView("imgToolTipTechTopKA", "setVisibility", [false]);
		formModel.performActionOnView("imgToolTipTechKA", "setVisibility", [true]);
		formModel.performActionOnView("flxTechSearchInListKA", "setVisibility", [false]);
		formModel.setViewAttributeByProperty("flxMaindateTimeKA", "left", "-100%");
	},
	saveRecords: function(updateField) {
		if (this.selectedRecords.length >= 1) {
			var updateRecord = {};
			this.stopWatchFields = [];
			var modelObj = this.getController().getModel("WorkOrder", "BPTService", {
				"access": "online",
				"objectName": "BPTService"
			});
			var dataObject = new kony.sdk.dto.DataObject("WorkOrder");
			var formModel = this.getController().getFormModel();
			kony.BPT.count = 0;
			var scopeObj = this;
			if(updateField === "Technician"){
				if(!frmListKA.segTechSearchKA.selectedItems){
					this.isTechnicianOn = false;
					alert(kony.i18n.getLocalizedString("i18n.frmListKA.alert.selectTechnician.valueKA"));
					return;
				}
			}
          	kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen("Loading Data");
			for (var index = 0; index < this.selectedRecords.length; index++) {
				updateRecord = {};
				updateRecord.id = this.selectedRecords[index]["id"];
				switch (updateField) {
					case "Status":
						var selectedStatus = formModel.getViewAttributeByProperty("segSingleSelectStatusKA", "selectedItems");
						selectedStatus = selectedStatus[0]["primaryKeyValueMap"]["Code"];
						var status = ((typeof selectedStatus == 'object') ? selectedStatus.text : selectedStatus);
						updateRecord.Status_id = status;
						this.stopWatchFields.push(updateRecord);
						break;
					case "Technician":
						var techRecord = formModel.getViewAttributeByProperty("segTechSearchKA", "selectedItems");
						var techName = techRecord[0]["FirstName"];
						var techLastName = techRecord[0]["LastName"];
						var techFirstName = techRecord[0]["MobilePhone"];
						techName = ((typeof techName == 'object') ? techName.text : techName);
						techLastName = ((typeof techLastName == 'object') ? techLastName.text : techLastName);
						techFirstName = ((typeof techFirstName == 'object') ? techFirstName.text : techFirstName);
						var technicianId = techRecord[0]["primaryKeyValueMap"]["WorkCenter_id"];
						updateRecord.WorkCenter_id = technicianId;
						updateRecord.SystemUserFirstName = techFirstName;
						updateRecord.SystemUserLastName = techLastName;
						break;
					case "Date":
						updateRecord={};
						updateRecord=this.selectedRecords[index];
						var initialDuration=1;
						 var utcDate;
						var updatedPlannedStartDate = frmListKA.lblStartedTimeKA.text;
						var initialplannedStartDate= updateRecord.PlannedStartDate;
						var initalplannedEndDate=(typeof updateRecord.PlannedEndDate == 'object') ? (updateRecord.PlannedEndDate.text) : (updateRecord.PlannedEndDate);
						var updatePlannedEndDate="";
						var doUpdatePlannedEndDate;
						if(parseInt(initalplannedEndDate))
						{					
						 if((moment(initalplannedEndDate,"YYYYMMDDHHmmss").diff(moment(updatedPlannedStartDate, "YYYYMMDDHHmmss"),'seconds'))<0)
						 {
							initialDuration=moment(initalplannedEndDate,"YYYYMMDDHHmmss").diff(moment(initialplannedStartDate, "DD/MM/YYYYhh:mm A"),'seconds'); 
							 doUpdatePlannedEndDate=true;
							updatePlannedEndDate=convertTimeZone(moment(updatedPlannedStartDate,"YYYYMMDDHHmmss").add(initialDuration,'seconds').format(),null, kony.BPT.remoteTimeZone, 'YYYYMMDDHHmmss');
						}
						else
							doUpdatePlannedEndDate=false;						
						}
						else
						{
							updatePlannedEndDate=convertTimeZone(moment(updatedPlannedStartDate,"YYYYMMDDHHmmss").add(initialDuration,'seconds').format(), null, kony.BPT.remoteTimeZone, 'YYYYMMDDHHmmss');                     
						 doUpdatePlannedEndDate=true;
						}	
					   utcDate = convertTimeZone(moment(updatedPlannedStartDate, "YYYYMMDDHHmmss").format(), null, kony.BPT.remoteTimeZone, 'YYYYMMDDHHmmss')						
						updateRecord.PlannedStartDate = utcDate;
						if(doUpdatePlannedEndDate)				
						{						
						updateRecord.PlannedEndDate=updatePlannedEndDate;					
						}										
						break;
					}
					dataObject.setRecord(updateRecord);
					modelObj.update(dataObject, successCallback, errorCallback);

				function successCallback(response) {
					if (kony.BPT.count == (scopeObj.selectedRecords.length - 1))
						scopeObj.reloadDataAfterBulkEdit();
					if (scopeObj.stopWatchFields[kony.BPT.count]) {
						scopeObj.stopWatchCreate(scopeObj.stopWatchFields[kony.BPT.count]);
					}
					kony.BPT.count++;
				}

				function errorCallback(err) {
					kony.BPT.count++;
					if (kony.BPT.count == (scopeObj.selectedRecords.length - 1))
						scopeObj.reloadDataAfterBulkEdit();
				}
			}
		} else {
          	this.clearSelected();
			alert(kony.i18n.getLocalizedString("i18n.frmListKA.alert.selectAtleastOne.valueKA"));
		}
	},
	reloadDataAfterBulkEdit: function() {
		//kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen("Loading Data");
		this.clearAllSelected();
      	if(frmListKA.tbxSearchKA.text){
			this.getController().performAction("GlobalSearch",[frmListKA.tbxSearchKA.text]);
        }
      	else
          	this.getController().performAction("GlobalSearch");
	},
	isGroupingEnabled: function() {
		if (kony.BPT.currentView === "High priority" || kony.BPT.currentView === "Available" || kony.BPT.currentView === "In Progress" || kony.BPT.currentView === "By Technician") {
			return true;
		} else {
			return false;
		}
	},
	setBulkEdit :  function(segmentData){
	/* If bulk edit is enabled then the incoming batch records should have bulk edit enabled. This function enables the bulk edit to the incoming records */
		if (this.isGroupingEnabled()) {
			for (var section_index = 0; section_index < segmentData.length; section_index++) {
				for (var row_index = 0; row_index < segmentData[section_index][1].length; row_index++) {
					if((typeof(segmentData[section_index][1][row_index]["Status_id"]) == 'object' ? segmentData[section_index][1][row_index]["Status_id"].text : segmentData[section_index][1][row_index]["Status_id"]) !="Completed"){
						segmentData[section_index][1][row_index]["Code"]["skin"] = "sknUnselectedTrackingKA";
						segmentData[section_index][1][row_index]["Code"]["focusSkin"] = "sknSelectedTrackingIconKA";
						segmentData[section_index][1][row_index]["Code"]["isVisible"] = true;
					}
				}
			}
		} else {
			for (var section_index = 0; section_index < segmentData.length; section_index++) {
				if((typeof(segmentData[section_index]["Status_id"]) == 'object' ? segmentData[section_index]["Status_id"].text : segmentData[section_index]["Status_id"]) !="Completed"){
					segmentData[section_index]["Code"]["skin"] = "sknUnselectedTrackingKA";
					segmentData[section_index]["Code"]["focusSkin"] = "sknSelectedTrackingIconKA";
					segmentData[section_index]["Code"]["isVisible"] = true;
				}
			}
		}
		return segmentData;
	},
	showMapView: function(){
		var scopeObj = this;
		var controller = scopeObj.getController();
      	//kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen("Loading Data");
		var formModel = controller.getFormModel();
        var segData = formModel.getWidgetData("segListKA").getData();
        var newSegData = [];
		var locationDataWO = "";
		var latitude = "";
		var longitude = "";
		kony.BPT.WOLocation = [];
		var data = {
			lblWOLine1KA: "key1",
			imgMaplTipKA : "tooltipforpin.png"
		};
		formModel.setViewAttributeByProperty("mapListKA", "widgetDataMapForCallout", data);
        if (scopeObj.isGroupingEnabled()) {
          	var index = 0;
          	if(segData && segData.length){
                for (var section_index = 0; section_index < segData.length; section_index++) {
                    for (var row_index = 0; row_index < segData[section_index][1].length; row_index++) {
                        newSegData[index] = {};
                        newSegData[index]["lblTypeKA"] = segData[section_index][1][row_index]["Type_id"];
                        newSegData[index]["lblDesc1KA"] = segData[section_index][1][row_index]["Description"];
                        newSegData[index]["lblAddress1KA"] = segData[section_index][1][row_index]["Address1Map"];
                        newSegData[index]["PlannedStartDate"] = segData[section_index][1][row_index]["PlannedStartDate"];
                      	newSegData[index]["lblTechnicianName1KA"] = segData[section_index][1][row_index]["TechnicianSecHeader"];
                        newSegData[index]["lblStartTImeValKA"] = segData[section_index][1][row_index]["PlannedStartDate"].slice(11) + "," + segData[section_index][1][row_index]["PlannedStartDate"].slice(0, 10);
                        newSegData[index]["lblLine1KA"] = {"text": " "};
						newSegData[index]["imgStatusKA"] = {"src": segData[section_index][1][row_index]["MaintenancePlant"]};
						newSegData[index]["imgPriorityKA"] = {"src": segData[section_index][1][row_index]["PriorityType"]};
                        newSegData[index]["lblLineTmpKA"] = {"text": " "};
                        newSegData[index]["btnChevron1KA"] = {"text" : " "};
                      	newSegData[index]["lblStartTimeKA"] = "START TIME";
						newSegData[index]["lblDurationKA"] = "DURATION";
						newSegData[index]["lblAssignedKA"] = "Assigned";
                      	newSegData[index]["btnTrackingKA"] = segData[section_index][1][row_index]["Instructions"];
                        newSegData[index]["lblStatusKA"] = segData[section_index][1][row_index]["Status_id"];
                        newSegData[index]["lblPriorityKA"] = segData[section_index][1][row_index]["Priority"];
                        newSegData[index]["lblOrderIDKA"] = segData[section_index][1][row_index]["Code1"];
                      	newSegData[index]["lblGreyKA"] = {"skin": "sknLbl5E5050ClanProBook25KA","isVisible":true,"text": " "};
                      	newSegData[index]["TechnicianSecHeader"] = segData[section_index][1][row_index]["TechnicianSecHeader"];
                        newSegData[index]["primaryKeyValueMap"] = segData[section_index][1][row_index]["primaryKeyValueMap"];
                        latitude = segData[section_index][1][row_index]["Latitude"];
                        longitude = segData[section_index][1][row_index]["Longitude"];
                        if (latitude && longitude && latitude != "" && longitude != "") {
                            locationData = {
                                lat: latitude,
                                lon: longitude,
                                image: "highprioritypincopy.png",
                                showcallout: true,
                                calloutData: {
                                     "key1" : segData[section_index][1][row_index]["Description"],
                                     template: flxMainListTmpKA
                                }
                            };
                            kony.BPT.WOLocation.push(locationData);
                        }
                        index ++; 
                    }
                }
            }
        } else {
          	if(segData && segData.length){
				for (var row_index = 0; row_index < segData.length; row_index++) {
					newSegData[row_index] = {};
					newSegData[row_index]["lblTypeKA"] = segData[row_index]["Type_id"];
					newSegData[row_index]["lblDesc1KA"] = segData[row_index]["Description"];
					newSegData[row_index]["lblAddress1KA"] = segData[row_index]["Address1Map"];
                  	newSegData[row_index]["PlannedStartDate"] = segData[row_index]["PlannedStartDate"];
					newSegData[row_index]["lblTechnicianName1KA"] = segData[row_index]["TechnicianSecHeader"];
					newSegData[row_index]["lblStartTImeValKA"] = segData[row_index]["PlannedStartDate"].slice(11) +","+segData[row_index]["PlannedStartDate"].slice(0, 10);
					newSegData[row_index]["lblLine1KA"] = {"text": " "};
					newSegData[row_index]["lblLineTmpKA"] = {"text": " "};
					newSegData[row_index]["btnChevron1KA"] = {"text" : " "};
					newSegData[row_index]["imgStatusKA"] = {"src": segData[row_index]["MaintenancePlant"]};
					newSegData[row_index]["imgPriorityKA"] = {"src": segData[row_index]["PriorityType"]};
                  	newSegData[row_index]["lblStartTimeKA"] = "START TIME";
					newSegData[row_index]["lblDurationKA"] = "DURATION";
					newSegData[row_index]["lblAssignedKA"] = "Assigned";
                  	newSegData[row_index]["lblStatusKA"] = segData[row_index]["Status_id"];
                  	newSegData[row_index]["btnTrackingKA"] = segData[row_index]["Instructions"];
                    newSegData[row_index]["lblPriorityKA"] = segData[row_index]["Priority"];
                    newSegData[row_index]["lblOrderIDKA"] = segData[row_index]["Code1"];
					newSegData[row_index]["lblGreyKA"] = {"skin": "sknLbl5E5050ClanProBook25KA","isVisible":true,"text":" "};
					newSegData[row_index]["TechnicianSecHeader"] = segData[row_index]["TechnicianSecHeader"];
					newSegData[row_index]["primaryKeyValueMap"] = segData[row_index]["primaryKeyValueMap"];
					latitude = segData[row_index]["Latitude"];
					longitude = segData[row_index]["Longitude"];
					if (latitude && longitude && latitude != "" && longitude != "") {
						locationData = {
							lat: latitude,
							lon: longitude,
							image: "highprioritypincopy.png",
							showcallout: true,
							calloutData: {
								"key1": segData[row_index]["Description"],
								 template: flxMainListTmpKA
							}
						};
						kony.BPT.WOLocation.push(locationData);
					}
				}
			}
        }
		var dataSuccess = function(response) {
			if(response){
				for(var i = 0 ; i < response.length ; i++){
					if(kony.sdk.mvvm.userObj["username"] && response[i]["id"] && kony.sdk.mvvm.userObj["username"].toLowerCase() != response[i]["id"].toLowerCase()){
						latitude = response[i]["Latitude"];
						longitude = response[i]["Longitude"];
						
						if (latitude && longitude && latitude != "" && longitude != "") {
							locationData = {
								lat: latitude,
								lon: longitude,
								id : response[i]["id"],
								image: "technicianpin.png",
								showcallout: true,
								calloutData: {
									"key1": response[i]["FirstName"],
									template: flxMainListTmpKA
								}
							};
							kony.BPT.WOLocation.push(locationData);
						}
					}
				
				}
				formModel.setViewAttributeByProperty("mapListKA", "locationData", kony.BPT.WOLocation);
			}
			
        }
        var dataError = function(err) {
            alert(err);
        }
		var configObj = scopeObj.getController().getConfig();
		var systemUserController = controller.getApplicationContext().getModel("SystemUser", configObj.getObjectServiceName(), configObj.getObjectServiceOptions());
		var query = "select sysuser.id,sysuser.FirstName,sysuser.LastName,sysuser.Latitude,sysuser.Longitude,sysuser.MobilePhone from SystemUser sysuser";
        var queryobj = new kony.sdk.mvvm.Query(query, "sql");
        systemUserController.executeSelectQuery(queryobj.getQuery().query, dataSuccess, dataError);
      	if(newSegData.length > 0){
            this.selectedRecords = newSegData[0];
            this.previousSelectedIndex = [0,0];
            newSegData[0]["lblGreyKA"] = {"skin": "sknLblE6EAEDFocusOpacity50KA","isVisible":true,"text":" "};
            formModel.performActionOnView("segLeftListKA","setVisibility",[true]);
        }
        formModel.performActionOnView("flxOrderDetailsKA","setVisibility",[false]);
      	if (this.isGroupingEnabled()) {
          	var segListWidgetDataMap = formModel.getViewAttributeByProperty("segLeftListKA", "widgetDataMap");
			segListWidgetDataMap["lblListHeaderKA"] = "sectionHeader";
          	formModel.setViewAttributeByProperty("segLeftListKA", "widgetDataMap", segListWidgetDataMap);
          	var customInfo = this.getGroupingRelatedInfo();
        	newSegData = this.getGroupedData(newSegData,customInfo);
        }
      	formModel.performActionOnView("segLeftListKA", "setData", [newSegData]);
		formModel.setViewAttributeByProperty("mapListKA", "locationData", kony.BPT.WOLocation);
      	frmListKA.mapListKA.zoomLevel = 10;
		if(kony.BPT.WOLocation && kony.BPT.WOLocation.length>0){
          frmListKA.mapListKA.navigateTo(0, true);
        }
      	frmListKA.flxListMapKA.setVisibility(true);
        frmListKA.flxSegHeadingKA.setVisibility(false);
	},
	naviagteToMapViewDetails: function(){
      	kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen("Loading Data");
    	var formmodel = this.getController().getFormModel();
        var selRecord = this.selectedRecords;
      	var scopeObj = this;
        var contextData = this.getController().getContextData();
        var params = {};
        params.WorkOrder_id = selRecord.primaryKeyValueMap.id;
        contextData.setQueryParams("flxOrderDetailsKA", params);	
      	var groupwidgetcontext = this.createGroupWidgetsContext();
      	this.getController().setContextData(contextData);
        groupwidgetcontext.fetchDataForGroupWidget("flxOrderDetailsKA", successCallback, errorCallback);
      	function successCallback(response){
          	var contextData = scopeObj.getController().getContextData();
            var params = {};
          	var finalResponse = response;
          	var resultIndex = 0;
            if((response["flxOrderDetailsKA"][0]["WorkOrderContact"]) && (response["flxOrderDetailsKA"][0]["WorkOrderContact"][0])) {
                params.Contact_id = response["flxOrderDetailsKA"][0]["WorkOrderContact"][0]["Contact_id"];
                contextData.setQueryParams("flxCustomerKA", params);	
                scopeObj.getController().setContextData(contextData);
              	resultIndex ++;
            }
            if((response["flxOrderDetailsKA"][0]["OrderAsset"] && response["flxOrderDetailsKA"][0]["OrderAsset"][0])) {
                params.Asset_id = response["flxOrderDetailsKA"][0]["OrderAsset"][0]["Asset_id"];
                contextData.setQueryParams("flxScrollDashBoardKA", params);	
                scopeObj.getController().setContextData(contextData);
              	resultIndex ++;
            }
          	var groupwidgetcontext = scopeObj.createGroupWidgetsContext();
          	kony.BPT.count = 0;
          	if(params.Contact_id)
				groupwidgetcontext.fetchDataForGroupWidget("flxCustomerKA", succCallback, errorCallback);
			if(params.Asset_id)
				groupwidgetcontext.fetchDataForGroupWidget("flxScrollDashBoardKA", succCallback, errorCallback);
          	function succCallback(response){
              	++kony.BPT.count;
                finalResponse["flxScrollDashBoardKA"] = response["flxScrollDashBoardKA"] || finalResponse["flxScrollDashBoardKA"];
                finalResponse["flxCustomerKA"] = response["flxCustomerKA"] || finalResponse["flxCustomerKA"];
              	if (kony.BPT.count == resultIndex)
					scopeObj.setDataToDetails(finalResponse);
            }
        }
      	function errorCallback(error){
          	alert(error);
        }
    },
  	setDataToDetails : function(data){
      	var formModel = this.getController().getFormModel();
        formModel.setViewAttributeByProperty("lblTypeValKA","text",data["flxOrderDetailsKA"][0]["Type_id"]);
        formModel.setViewAttributeByProperty("lblDescKA","text",data["flxOrderDetailsKA"][0]["Description"]);
        formModel.setViewAttributeByProperty("lblWorkOrderCodeKA","text",data["flxOrderDetailsKA"][0]["Code"]);
        formModel.setViewAttributeByProperty("lblProbDescValKA","text",data["flxOrderDetailsKA"][0]["Description"]);
      	formModel.setViewAttributeByProperty("lblAssetValKA","text",data["flxScrollDashBoardKA"][0]["Description"]);
        formModel.setViewAttributeByProperty("lblCustomerValKA","text",data["flxCustomerKA"][0]["FirstName"]+" "+data["flxCustomerKA"][0]["LastName"]);
        formModel.setViewAttributeByProperty("lblCustomerEmailKA","text",data["flxCustomerKA"][0]["Email"]);
        formModel.setViewAttributeByProperty("lblCustomerNumbKA","text",data["flxCustomerKA"][0]["PrimaryPhone"]);
      	var address = data["flxOrderDetailsKA"][0]["Address"][0]["Address1"] + "," + data["flxOrderDetailsKA"][0]["Address"][0]["Address2"] + "," + data["flxOrderDetailsKA"][0]["Address"][0]["Address3"] + "," + data["flxOrderDetailsKA"][0]["Address"][0]["City_id"]+ "," + data["flxOrderDetailsKA"][0]["Address"][0]["ZipCode"];
        formModel.setViewAttributeByProperty("lblAssignedTechnicianNameKA","text",data["flxOrderDetailsKA"][0]["WorkCenterWO"][0]["SystemUserWO"][0]["FirstName"] + " " + data["flxOrderDetailsKA"][0]["WorkCenterWO"][0]["SystemUserWO"][0]["LastName"]);
        formModel.setViewAttributeByProperty("lblAssignedTechnicianNumbKA","text",data["flxOrderDetailsKA"][0]["WorkCenterWO"][0]["SystemUserWO"][0]["MobilePhone"]);
        formModel.setViewAttributeByProperty("lblPriorityDetailsKA","text",data["flxOrderDetailsKA"][0]["WorkOrderPriority"][0]["Description"]);
      	var status = this.getStatusFromCode(data["flxOrderDetailsKA"][0]["Status_id"]);
      	formModel.setViewAttributeByProperty("lblStatusDetailsKA","text",status.text);
      	formModel.setViewAttributeByProperty("lblAddress1KA","text",address);
      	formModel.setViewAttributeByProperty("imgStatusDetailsKA","src",status.img);
      	formModel.setViewAttributeByProperty("imgPriorityDetailsKA","src",this.getPriorityImage(data["flxOrderDetailsKA"][0]["WorkOrderPriority"][0]["Description"]));
		var lastUpdatedDts = data["flxOrderDetailsKA"][0]["lastmodifiedts"];
        if (parseInt(lastUpdatedDts))
            lastUpdatedDts = convertTimeZone(moment(lastUpdatedDts, "YYYYMMDDHHmmss").format(), kony.BPT.remoteTimeZone, null, 'hh:mm A | DD/MM/YYYY');
        else
            lastUpdatedDts = this.formatTime(lastUpdatedDts.slice(8, 14)) + " | " + this.formatDate(lastUpdatedDts.slice(0, 8));
        formModel.setViewAttributeByProperty("lblLastUpdatedTimeKA","text",lastUpdatedDts);
      	kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
      	formModel.performActionOnView("segLeftListKA","setVisibility",[false]);
        formModel.performActionOnView("flxOrderDetailsKA","setVisibility",[true]);
    },
  	highlightSelectedRow : function(){
      	var formModel = this.getController().getFormModel();
        var selectedRecord = formModel.getViewAttributeByProperty("segLeftListKA", "selectedItems");
        var rowIndex = formModel.getViewAttributeByProperty("segLeftListKA", "selectedIndex");
        selectedRecord[0]["lblGreyKA"] = {"skin": "sknLblE6EAEDFocusOpacity50KA","isVisible":true,"text": " "};
      	this.selectedRecords["lblGreyKA"] = {"skin": "sknLbl5E5050ClanProBook25KA","isVisible":true,"text": " "};
      	formModel.performActionOnView("segLeftListKA", "setDataAt", [this.selectedRecords, this.previousSelectedIndex[1], this.previousSelectedIndex[0]]);
        formModel.performActionOnView("segLeftListKA", "setDataAt", [selectedRecord[0], rowIndex[1], rowIndex[0]]);
		formModel.setViewAttributeByProperty("mapListKA","zoomLevel",10);
		formModel.performActionOnView("mapListKA","navigateTo",[rowIndex[1], true]);
      	this.selectedRecords = selectedRecord[0];
      	this.previousSelectedIndex = rowIndex;
		frmListKA.mapListKA.zoomLevel = 10;
		frmListKA.mapListKA.navigateTo(rowIndex[1], true);
    },
  	showListView: function(){
        var formModel = this.getController().getFormModel();
        formModel.performActionOnView("flxListMapKA","setVisibility",[false]);
        formModel.performActionOnView("flxSegHeadingKA","setVisibility",[true]);
        formModel.performActionOnView("flxViewTypeKA","setEnabled",[true]);
        this.selectedRecords = [];
    }
});