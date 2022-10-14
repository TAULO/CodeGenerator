/*
 * Controller Extension class for frmOrderObjectKA
 * Developer can edit the existing methods or can add new methods if required
 *
 */

kony = kony || {};
kony.sdk = kony.sdk || {};
kony.sdk.mvvm = kony.sdk.mvvm || {};
kony.sdk.mvvm.v2 = kony.sdk.mvvm.v2 || {};

/**
 * Creates a new Form Controller Extension.
 * @class frmMeasurementExecutionKAControllerExtension
 * @param {Object} controllerObj - Form Controller.
 */
kony.sdk.mvvm.frmMeasurementExecutionKAControllerExtension = Class(kony.sdk.mvvm.CustomFormControllerExtensionMF, {
		constructor : function (controllerObj) {

			var scopeObj = this;
			scopeObj.$class.$super.call(this, controllerObj);

			scopeObj.tDuration = 0;
            scopeObj.numOfReadings=0;

		},
		/**
		 * This method is an entry point for all fetch related flows. Developer can edit.
		 * Default implementation fetches data for the form based on form config
		 * @memberof frmMeasurementExecutionKAControllerExtension#
		 */
		fetchData : function () {
			var scopeObj = this;
			try {
				if (Object.keys(kony.servicesapp.swipedIndices).length > 0) {
					var animObj = kony.servicesapp.getEndStateTransAnimDefinition("-50%", "0%", true);
					animObj["callbacks"] = {
						"animationEnd" : function () {
							var controller = kony.sdk.mvvm.KonyApplicationContext.getAppInstance().getFormController(kony.application.getCurrentForm().id);
							kony.servicesapp.rowreset = true;
							kony.servicesapp.swipedIndices = {};
							kony.servicesapp.coords = [];
							kony.servicesapp.isAnimationInProgress = false;
							return controller.$class.$superp.fetchData.call(controller);
						}
					}
					frmMeasurementExecutionKA.segMeasurementKA.animateRows({
						rows : [{
								sectionIndex : kony.servicesapp.swipedIndices["secIndex"],
								rowIndex : kony.servicesapp.swipedIndices["rowIndex"]
							}
						],
						widgets : ["flxChildKA"],
						animation : animObj
					});
				} else if (kony.servicesapp.isAnimationInProgress && kony.application.getCurrentForm().id == kony.servicesapp.FRMMEASUREMENTEXECUTIONKA) {
					return;
				} else {
					scopeObj.$class.$superp.fetchData.call(scopeObj);
				}
			} catch (err) {
				kony.sdk.mvvm.log.error("Error in fetchData of controllerExtension");
                kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
				var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_FETCH_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_FETCH_IN_CONTROLLER_EXTENSION, err);
				kony.sdk.mvvm.log.error(exception.toString());
			}

			function success(response) {
				kony.sdk.mvvm.log.info("success fetching data ", response);                
				scopeObj.formatData(response);
			}

			function error(err) {
				//Error fetching data
				kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
				kony.sdk.mvvm.log.error("In fetchData errorcallback in controller extension ", err);
				var exception = scopeObj.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_FETCH_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_FETCH_IN_CONTROLLER_EXTENSION, err);
				kony.sdk.mvvm.log.error(exception.toString());
			}
		},
		/**
		 * This method processes fetched data. Developer can edit.
		 * Default implementation processes the provided data to required format for bind.
		 * @param {Object} data - fetched data. (Default : data map, group id as key and records array as value)
		 * @memberof frmMeasurementExecutionKAControllerExtension#
		 * @returns {Object} - processed data
		 */
		processData : function (data) {
			try {
				var scopeObj = this;
				var processedData = this.$class.$superp.processData.call(this, data);
				this.getController().bindData(processedData);
				return processedData;
			} catch (err) {
				kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
				kony.sdk.mvvm.log.error("Error in processData of controllerExtension");
				var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_PROCESSDATA_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_PROCESSDATA_IN_CONTROLLER_EXTENSION, err);
				kony.sdk.mvvm.log.error(exception.toString());
			};
		},
        formatData: function(data) {
          try {
              var scopeObj = this;
              scopeObj.bindData(scopeObj.$class.$superp.formatData.call(scopeObj, data));
          } catch (err) {
              var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.appfoundation.v2.AppFoundationExceptionCode.CD_ERROR_FORMATDATA_IN_CONTROLLER_EXTENSION, kony.appfoundation.v2.AppFoundationExceptionCode.MSG_ERROR_FORMATDATA_IN_CONTROLLER_EXTENSION, err);
              kony.appfoundation.log.error(exception.toString());
          };
      },
		
		performFetchFormData: function(serviceName, options, successcallback, errorcallback) {
        try {
            var scopeObj = this;
			function successCallback(res) {
                var woInfo = scopeObj.getController().getContextData().getCustomInfo("woTaskInfo");
                scopeObj.taskID = woInfo["taskID"];
                scopeObj.woStatusID = woInfo["woStatusID"];
                scopeObj.woID = woInfo["woID"];
                scopeObj.taskNumber = woInfo["taskNumber"];
                scopeObj.setFormModelInfo("taskID", woInfo["taskID"]);
                scopeObj.setFormModelInfo("woStatusID", woInfo["woStatusID"]);
                scopeObj.setFormModelInfo("woID", woInfo["woID"]);
                scopeObj.setFormModelInfo("taskNumber", woInfo["taskNumber"]);
                successcallback.call(scopeObj, res);
            };
            function errorCallback(err) {
                errorcallback.call(scopeObj, err);
            };
            scopeObj.$class.$superp.performFetchFormData.call(scopeObj, serviceName, options, successCallback, errorCallback);
        } catch (error) {
            kony.sdk.mvvm.log.error("Error in Blogic perform fetch and bind data : " + error);
        }
    },
		/**
		 * This method binds the processed data to the form. Developer can edit.
		 * Default implementation binds the data to widgets in the form.
		 * @param {Object} data - processed data.(Default : data map for each group, widget id as key and widget data as value)
		 * @memberof frmMeasurementExecutionKAControllerExtension#
		 */
		bindData : function (dataMap) {
			try {
				var scopeObj = this;
				var formmodel = scopeObj.getController().getFormModel();
				dataMap = scopeObj.formatTime(dataMap);
				formmodel.clear();
				var formData = dataMap["form"][0];
				var segData = [];
				var flexData = [];
				var processedData = {};
				var processedSegData = [];
                var AssetprocessedData={};                
				var utilitiesObj = utilities.getUtilityObj();
                if (dataMap["segMeasurementKA"]) {
                segData = dataMap["segMeasurementKA"];
                }
                var assetData = dataMap["flxObjectNameKA"]? dataMap["flxObjectNameKA"]:[];
                var str_asset ="";
			    var assetDataLength = assetData.length;
			    var index=0,isAsset = false;
                for(var i=0;i<assetDataLength;i++){
                  if(assetData[i]["ObjectType"]=='IE')
                    {
                      isAsset=true;
                      index=i;
                      break;
                    }
                }
			    str_asset+=assetData[index]?assetData[index]["Description"]:"";
                AssetprocessedData["lblObjectNameKA"] = str_asset;                
                if (dataMap["flxStrtKA"]) {
                    flexData = dataMap["flxStrtKA"];
                }               
				var measurement = utilitiesObj.geti18nValueKA("i18n.common.MeasurementTextLabelKA").toUpperCase();
				formmodel.setViewAttributeByProperty("lblPageNameValueKA", "text", measurement);				
				//// Timer ///////////////////////////////////////////
				var woInfo = scopeObj.getController().getContextData().getCustomInfo("woTaskInfo");
				scopeObj.setWOInformation(woInfo, formData);
				processedSegData = scopeObj.formatSegData(dataMap["segMeasurementKA"], scopeObj);
                var status = scopeObj.getFormModelInfo("tStatusID");
                if(!processedSegData[0] && (status=="Started")){
                  formmodel.setViewAttributeByProperty("flxNoMeasurementReadingKA","isVisible",true);
                  formmodel.setViewAttributeByProperty("segMeasurementKA","isVisible",false);
                }
                else{
                  formmodel.setViewAttributeByProperty("segMeasurementKA","isVisible",true);
                  formmodel.setViewAttributeByProperty("flxNoMeasurementReadingKA","isVisible",false);
                }
				////////////////////////////////////////////////////////////
				// The below block of code is to display the group header on task execution form.This need to be removed after UIRT_V2 supports segment header mapping
				var lclWidgetDataMap = formmodel.getViewAttributeByProperty("segMeasurementKA", "widgetDataMap");
				lclWidgetDataMap["lblscheduledKA"] = "lclMeasurementTaskHeader";
				formmodel.setViewAttributeByProperty("segMeasurementKA", "widgetDataMap", lclWidgetDataMap);
				//block ends here
				var measureReadingsListLength = scopeObj.numOfReadings;
				if(measureReadingsListLength == 0) {
					measureReadingsListLength = utilitiesObj.geti18nValueKA("i18n.common.noMesurementReadingsTextKA");
				} else if (measureReadingsListLength == 1){
					measureReadingsListLength = measureReadingsListLength + " " + utilitiesObj.geti18nValueKA("i18n.task.frmMeasurementReading.lblTitleKA.ValueKA");
				}
                else{
                  measureReadingsListLength = measureReadingsListLength + " " + utilitiesObj.geti18nValueKA("i18n.common.MeasurementReadingsTextKA");
                }
				var lclMeasurementTaskHeader = {
					"lclMeasurementTaskHeader" : measureReadingsListLength
				};
				var finalProcessedSegData = [
					[lclMeasurementTaskHeader, processedSegData]
				];
				dataMap["segMeasurementKA"] = {};
				dataMap["segMeasurementKA"]["segMeasurementKA"] = finalProcessedSegData;
				//// Timer /////////////////////////////////////////////
				var result = scopeObj.processSegData(processedData, flexData, formData, woInfo);
				processedData = result[0];
				flexData = result[1];
				////////////////////////////////////////////////////////////

				// Timer /////////////////////////////////////////
				var startTimer = function () {
					try {
						kony.timer.schedule("SecondTimer", updateDuration, kony.servicesapp.TIMER_FREQUENCY, true);
					} catch (e) {
						kony.sdk.mvvm.log.error("error in Blogic startTimer : " + e);
					}
				};

				var updateDuration = function () {
					var tD = scopeObj.getFormModelInfo("tDuration");
					tD = tD + kony.servicesapp.TIMER_FREQUENCY;
					scopeObj.setFormModelInfo("tDuration", tD);
					formmodel.setViewAttributeByProperty("lblTimerKA", "text", utilitiesObj.dateFormat(tD, kony.servicesapp.TIMER_FORMAT));
				};

				var taskStatus = kony.servicesapp.servicesStatus.key;
				if (formData["Status_id"] == taskStatus.Started) {
					startTimer();
				} else {
					scopeObj.cancelTimer();
				}
				//////////////////////////////////////////////////
				var taskStatus = kony.servicesapp.servicesStatus.key;
				dataMap["form"] = processedData;
				dataMap["flxStrtKA"] = flexData;
                dataMap["flxObjectNameKA"] = AssetprocessedData;
				scopeObj.$class.$superp.bindData.call(scopeObj, dataMap);
				formmodel.formatUI();
				formmodel.showView();
			} catch (error) {
                kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
				kony.sdk.mvvm.log.error("Error in Blogic bind data : " + error);
			}
		},
		//To set the value in Work Order info object
		setWOInformation : function (woInfo, formData) {
			try {
				var scopeObj = this;
				var formModel = scopeObj.getController().getFormModel();
				scopeObj.setFormModelInfo("taskID", woInfo["taskID"]);
				scopeObj.setFormModelInfo("woStatusID", woInfo["woStatusID"]);
				scopeObj.setFormModelInfo("woID", woInfo["woID"]);
				scopeObj.setFormModelInfo("taskNumber", woInfo["taskNumber"]);
				scopeObj.setFormModelInfo("tStatusID", formData["Status_id"]);
				scopeObj.setFormModelInfo("segmentInfo", frmMeasurementExecutionKA.segMeasurementKA);
				formModel.performActionOnView("flexDetailsKA", "setEnabled", [true]);
				formModel.performActionOnView("btnBackKA", "setEnabled", [true]);
				scopeObj.materialIDs = [];
				if (formData["Status_id"] == 'Completed' || woInfo["woStatusID"] == 'Scheduled' || woInfo["woStatusID"] == 'On Route') {
					formModel.setViewAttributeByProperty("segMeasurementKA", "height", "77%");
				} else {
					formModel.setViewAttributeByProperty("segMeasurementKA", "height", "67%");
				}
			} catch (err) {
				kony.sdk.mvvm.log.error("error in Blogic setWOInformation : " + err);
			}
		},

		////This function is used to show the status in the view
		showStatusMachine : function (woStatus, tStatus) {
			try {
				var scopeObj = this;
				var formModel = scopeObj.getController().getFormModel();
				var taskStatus = kony.servicesapp.servicesStatus.key;
				if (woStatus == taskStatus.Scheduled || woStatus == taskStatus.OnRoute || woStatus == taskStatus.Rejected || woStatus == taskStatus.Paused) {
					formModel.setViewAttributeByProperty("flxFooterKA", "isVisible", false);
					return;
				}
				var constants = kony.servicesapp.constants.getServiceConstantsObj().getValue(kony.servicesapp.MEASUREMENT_EXECUTION_STATUS, tStatus);
				switch (constants.length) {
				case 1:
					formModel.setViewAttributeByProperty("flxFooterKA", "isVisible", true);
					formModel.setViewAttributeByProperty("btnCompleteKA", "isVisible", false);
					formModel.setViewAttributeByProperty("btnHoldKA", "isVisible", true);
					formModel.setViewAttributeByProperty("btnHoldKA", "text", constants[0] ? constants[0] : "");
					formModel.setViewAttributeByProperty("btnHoldKA", "width", "95%");
					formModel.setViewAttributeByProperty("btnHoldKA", "left", "2%");
					formModel.setViewAttributeByProperty("btnCancelKA", "isVisible", false);
					break;
				case 2:
					formModel.setViewAttributeByProperty("flxFooterKA", "isVisible", true);
					formModel.setViewAttributeByProperty("btnCompleteKA", "text", constants[0] ? constants[0] : "");
					formModel.setViewAttributeByProperty("btnCompleteKA", "isVisible", true);
					formModel.setViewAttributeByProperty("btnCancelKA", "isVisible", true);
					formModel.setViewAttributeByProperty("btnHoldKA", "isVisible", false);
					formModel.setViewAttributeByProperty("btnCancelKA", "text", constants[1] ? constants[1] : "");
					break;
				case 3:
					formModel.setViewAttributeByProperty("flxFooterKA", "isVisible", true);
					formModel.setViewAttributeByProperty("btnCompleteKA", "isVisible", true);
					formModel.setViewAttributeByProperty("btnCompleteKA", "text", constants[0] ? constants[0] : "");
					formModel.setViewAttributeByProperty("btnHoldKA", "isVisible", true);
					formModel.setViewAttributeByProperty("btnHoldKA", "text", constants[1] ? constants[1] : "");
					formModel.setViewAttributeByProperty("btnCancelKA", "isVisible", true);
					formModel.setViewAttributeByProperty("btnCancelKA", "text", constants[2] ? constants[2] : "");
					break;
				default:
					formModel.setViewAttributeByProperty("flxFooterKA", "isVisible", false);
					break;
				}
			} catch (err) {
				kony.sdk.mvvm.log.error("error in Blogic showStatusMachine : " + err);
			}
		},
  
        cancelTimer: function() {
            try {
                kony.timer.cancel("SecondTimer");
            } catch (e) {
                kony.sdk.mvvm.log.error("error in Blogic cancelTimer : " + e);
            }
        },

		changeStatusOnPauseCompleteRejectWorkorder : function (woID, taskID, taskNumber, currentStatusID, updatedStatusID) {
			try {
				var scopeObj = this;
				var utilitiesObj = utilities.getUtilityObj();
				var configObj = scopeObj.getController().getConfig();
				var taskStatus = kony.servicesapp.servicesStatus.key;
				if (currentStatusID == taskStatus.Scheduled && updatedStatusID == taskStatus.Paused) {
					return;
				}
				var objHandler = kony.sdk.mvvm.persistent.Record;
				var recordObject = new objHandler(kony.servicesapp.ENTITY_TASK);
				var momentFormat = convertTimeZone(moment().format(), null, kony.servicesapp.remoteTimeZone, kony.servicesapp.DB_DATE_FORMAT);
				recordObject.set("WorkOrder_id", woID);
				recordObject.set("Task_num", taskNumber);
				recordObject.set("Status_id", updatedStatusID);
                recordObject.set("id",taskID);
				if (currentStatusID == taskStatus.Scheduled && (updatedStatusID == taskStatus.Rejected || updatedStatusID == taskStatus.Completed)) {
					recordObject.set("StartDate", momentFormat);
					recordObject.set("EndDate", momentFormat);
				} else if (currentStatusID == taskStatus.Paused || currentStatusID == taskStatus.Started && (updatedStatusID == taskStatus.Rejected || updatedStatusID == taskStatus.Completed)) {
					recordObject.set("EndDate", momentFormat);
				}
				var onSuccess = function (res) {
					if (currentStatusID != updatedStatusID && updatedStatusID != taskStatus.Rejected && currentStatusID != taskStatus.Scheduled) {
						if (currentStatusID == taskStatus.Started || currentStatusID == taskStatus.Paused) {
							var swRecordObject = new objHandler("StopWatch");
							// StopWatch requires Task_num instead of Task_id
							swRecordObject.set("Task_id", taskNumber);
							swRecordObject.set("WorkOrder_id", woID);
							swRecordObject.set("Status_id", updatedStatusID);
							swRecordObject.set("ChangeTime", convertTimeZone(moment().format(), null, kony.servicesapp.remoteTimeZone, kony.servicesapp.DB_DATE_FORMAT));
							swRecordObject.setInfo("serviceName", configObj.getObjectServiceName());
							swRecordObject.setInfo("options", configObj.getObjectServiceOptions());
							swRecordObject.setInfo("operation", kony.sdk.mvvm.OperationType.ADD);
							var swSuccess = function () {
								kony.sdk.mvvm.log.info("Update successful");
							};
							var swError = function () {
								kony.sdk.mvvm.log.info(utilitiesObj.geti18nValueKA("i18n.common.taskUpdateError.ValueKA"));
							};
							scopeObj.saveRecord(swRecordObject, swSuccess, swError);
						}
					}
				}
				var onError = function () {
					alert(utilitiesObj.geti18nValueKA("i18n.common.taskUpdateError.ValueKA"));
				}
				try {
					scopeObj.saveRecord(recordObject, onSuccess, onError);
				} catch (err) {
					alert(utilitiesObj.geti18nValueKA("i18n.common.trycatcherror.ValueKA"));
				};
			} catch (err) {
				kony.sdk.mvvm.log.error("error in Blogic changeStatusOnPauseCompleteRejectWorkorder : " + err);
			}
		},

		//This function is used to complete or reject task
		completeOrRejectTask : function () {
			try {
				var scopeObj = this;
				var controller = scopeObj.getController();
				var utilitiesObj = utilities.getUtilityObj();
				kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen(utilitiesObj.geti18nValueKA("i18n.common.TaskUpdate.ValueKA"));
				var taskStatus = kony.servicesapp.servicesStatus.key;
				var noofresources = scopeObj.materialIDs.length;
				var objServName = controller.getConfig().getObjectServiceName();
				var objServOptions = controller.getConfig().getObjectServiceOptions();
				var uomentityController = controller.getApplicationContext().getModel("UnitConversion", objServName, objServOptions);
				var statusID = scopeObj.getFormModelInfo("tStatusID");
				var currentStatus = statusID;
				if (currentStatus == taskStatus.Started || currentStatus == taskStatus.Paused) {
					statusID = taskStatus.Completed;
				} else {
					alert(utilitiesObj.geti18nValueKA("i18n.common.taskUpdateError.ValueKA"));
					return statusID;
				}
				var objHandler = kony.sdk.mvvm.persistent.Record;
				var recordObject = new objHandler(kony.servicesapp.ENTITY_TASK);
				recordObject.set("WorkOrder_id", scopeObj.getFormModelInfo("woID"));
				recordObject.set("Task_num", scopeObj.getFormModelInfo("taskNumber"));
				recordObject.set("Status_id", statusID);
                recordObject.set("id", scopeObj.getFormModelInfo("taskID"));
				recordObject.set("EndDate", convertTimeZone(moment().format(), null, kony.servicesapp.remoteTimeZone, kony.servicesapp.DB_DATE_FORMAT));
				recordObject.setInfo("serviceName", objServName);
				recordObject.setInfo("options", objServOptions);
				var onSuccess = function (res) {
					var swRecordObject = new objHandler(kony.servicesapp.ENTITY_STOPWATCH);
					swRecordObject.set("Task_id", scopeObj.getFormModelInfo("taskNumber"));
					swRecordObject.set("WorkOrder_id", scopeObj.getFormModelInfo("woID"));
					swRecordObject.set("Status_id", statusID);
					swRecordObject.set("ChangeTime", convertTimeZone(moment().format(), null, kony.servicesapp.remoteTimeZone, kony.servicesapp.DB_DATE_FORMAT));
					swRecordObject.setInfo("serviceName", objServName);
					swRecordObject.setInfo("options", objServOptions);
					swRecordObject.setInfo("operation", kony.sdk.mvvm.OperationType.ADD);
					var swSuccess = function () {
						scopeObj.fetchData();
						if (kony.sdk.mvvm.isNetworkAvailabile()) {
							kony.servicesapp.backgroundSyncOnStatusChangeKA();
						}
						kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
						return;

					}
					scopeObj.saveRecord(swRecordObject, swSuccess, swError);
					kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
				}
				var swError = function () {
					kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
				};
				var onError = function () {
					alert(utilitiesObj.geti18nValueKA("i18n.common.taskUpdateError.ValueKA"));
					kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
				}
				try {
					scopeObj.saveRecord(recordObject, onSuccess, onError);
				} catch (err) {
					alert(utilitiesObj.geti18nValueKA("i18n.common.trycatcherror.ValueKA"));
				};
			} catch (err) {
				kony.sdk.mvvm.log.error("error in Blogic completeOrRejectTask : " + err);
			}
		},

		//This function is used to change status for task
		changeStatusForTask : function () {
			try {
				var scopeObj = this;
                var formModel = scopeObj.getController().getFormModel();               
				var utilitiesObj = utilities.getUtilityObj();
				kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen(utilitiesObj.geti18nValueKA("i18n.common.TaskUpdate.ValueKA"));
				var statusID = scopeObj.getFormModelInfo("tStatusID");
				var currentStatus = statusID;
				var taskStatus = kony.servicesapp.servicesStatus.key;
				switch (currentStatus) {
				case taskStatus.Scheduled:
					statusID = taskStatus.Started;
					break;
				case taskStatus.Rejected:
					break;
				case taskStatus.Started:
                    scopeObj.completeOrRejectTask();
                    return;
					//statusID = taskStatus.Paused;
					break;
				case taskStatus.Paused:
					statusID = taskStatus.Started;
					break;
				}
				var objHandler = kony.sdk.mvvm.persistent.Record;
				var recordObject = new objHandler(kony.servicesapp.ENTITY_TASK);
				var configObj = scopeObj.getController().getConfig();
				recordObject.set("WorkOrder_id", scopeObj.getFormModelInfo("woID"));
                recordObject.set("id", scopeObj.getFormModelInfo("taskID"));
				recordObject.set("Task_num", scopeObj.getFormModelInfo("taskNumber"));
				recordObject.set("Status_id", statusID);
				var momentFormat = convertTimeZone(moment().format(), null, kony.servicesapp.remoteTimeZone, kony.servicesapp.DB_DATE_FORMAT);
				if (currentStatus == taskStatus.Scheduled) {
					recordObject.set("StartDate", momentFormat);
				}
				var objServName = configObj.getObjectServiceName();
				var objServOptions = configObj.getObjectServiceOptions();
				recordObject.setInfo("serviceName", objServName);
				recordObject.setInfo("options", objServOptions);
				var onSuccess = function (res) {
					var swRecordObject = new objHandler("StopWatch");
					swRecordObject.set("Task_id", scopeObj.getFormModelInfo("taskNumber"));
					swRecordObject.set("WorkOrder_id", scopeObj.getFormModelInfo("woID"));
					swRecordObject.set("Status_id", statusID);
					swRecordObject.set("ChangeTime", convertTimeZone(moment().format(), null, kony.servicesapp.remoteTimeZone, kony.servicesapp.DB_DATE_FORMAT));
					swRecordObject.setInfo("serviceName", objServName);
					swRecordObject.setInfo("options", objServOptions);
					swRecordObject.setInfo("operation", kony.sdk.mvvm.OperationType.ADD);
					var swSuccess = function () {
						scopeObj.fetchData();
						kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
						if (kony.sdk.mvvm.isNetworkAvailabile()) {
							kony.servicesapp.backgroundSyncOnStatusChangeKA();
						}
					};
					var swError = function () {
						kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
					};
					scopeObj.saveRecord(swRecordObject, swSuccess, swError);
				}
				var onError = function () {
					alert(utilitiesObj.geti18nValueKA("i18n.common.taskUpdateError.ValueKA"));
					kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
				}
				try {
					scopeObj.saveRecord(recordObject, onSuccess, onError);
				} catch (err) {
					alert(utilitiesObj.geti18nValueKA("i18n.common.trycatcherror.ValueKA"));
				};
			} catch (err) {
				kony.sdk.mvvm.log.error("error in Blogic changeStatusForTask : " + err);
			}
		},

		processSegData : function (processegData, flexData, formData, woInfo) {
			try {
				var scopeObj = this;
				var formModel = scopeObj.getController().getFormModel();
				var utilitiesObj = utilities.getUtilityObj();
				//scopeObj.setFormModelInfo("segmentId", "segMeasurementKA");
                 var INSTANCE = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
                 var controller = INSTANCE.getFormController("frmOrderDetailsKA");                
                 var currentFormControllerExtension=controller.getControllerExtensionObject();
                processegData["lblObjectNameKA"] = currentFormControllerExtension.getFormModelInfo("ObjectName");
				processegData["lblCurrentDayKA"] = formData["StartDate"];
				processegData["lblStatusKA"] = utilitiesObj.getStatusTextKA(formData["Status_id"]);
				var appContext = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
				var createMeasureDescriptionFormControllerExtension = appContext.getFormController("frmCreateMeasurementDescriptionKA").getControllerExtensionObject();
				//var MeasureDescription = createMeasureDescriptionFormControllerExtension.getFormModelInfo("MeasureDescription");
				var description1 = utilitiesObj.dataTruncation(formData["Description"], kony.servicesapp.DESCRIPTION_LENGTH, kony.servicesapp.NO_OF_DOTS_AFTERTRUNCATION, "...");
				processegData["lblMeasurementDescriptionKA"] = description1["value"];
				if (flexData.length != 0) {
					if (flexData[0]["Timer"] != null) {
						scopeObj.setFormModelInfo("tDuration", parseInt(flexData[0]["Timer"]));
					} else {
						scopeObj.setFormModelInfo("tDuration", 0);
					}
				} else {
					scopeObj.setFormModelInfo("tDuration", 0);
				}
				flexData["lblTimerKA"] = utilitiesObj.dateFormat(scopeObj.getFormModelInfo("tDuration"), kony.servicesapp.TIMER_FORMAT);
				this.TASK_NUM = woInfo["taskNumber"];
				scopeObj.taskID = woInfo["taskID"];
				scopeObj.woStatusID = woInfo["woStatusID"];
				scopeObj.woID = woInfo["woID"];
				scopeObj.taskNumber = woInfo["taskNumber"];
				scopeObj.showStatusMachine(woInfo["woStatusID"], formData["Status_id"]);
				formModel.setViewAttributeByProperty("imgPlayPauseKA", "src", utilitiesObj.getStatusImageKA(formData["Status_id"]));
				processegData["lblStatusKA"] = processegData["lblStatusKA"].toUpperCase();
				return [processegData, flexData];
			} catch (err) {
				kony.sdk.mvvm.log.error("error in Blogic processSegData : " + err);
			}
		},
		formatSegData : function (segData, scopeObj) {
			try {
				var scopeObj = this; 
                scopeObj.numOfReadings=0;
				var utilitiesObj = utilities.getUtilityObj();
				var processedSegData = [];
				var processedRowObj,taskStatus;             
				for (var i in segData) {
                   if(segData&& segData[i]&&segData[i]["OPMODE"]!='D'){
					processedRowObj = {};
					processedRowObj["MeasurePoint_id"] = segData[i]["MeasurePoint_id"];
					processedRowObj["Description"] = segData[i]["Description"];
                    if (segData[i]["Readings"] == 0) {
					segData[i]["Readings"] = utilitiesObj.geti18nValueKA("i18n.common.noReadingsKA");
                    } else {
                        scopeObj.numOfReadings=scopeObj.numOfReadings+segData[i]["Readings"];
                        segData[i]["Readings"] = segData[i]["Readings"]==1?segData[i]["Readings"] + " " + utilitiesObj.geti18nValueKA("i18n.common.readingKA"):segData[i]["Readings"] + " " + utilitiesObj.geti18nValueKA("i18n.common.readingsKA");
                    }
					processedRowObj["Readings"] = segData[i]["Readings"];	
                    var status = scopeObj.getFormModelInfo("tStatusID");
                    if (status && (status.toUpperCase() == "STARTED")){
                    processedRowObj["metaInfo"] = {
                      editMode : constants.SEGUI_EDIT_MODE_DELETE,
                      editModeCustomConfig : [{
                            title : "REMOVE",
                            backgroundColor : "ff5d6e",
                            callback : kony.servicesapp.removeReadingCallback
                          }, {
                            title : "ADD",
                            backgroundColor : "9b9b9b",
                            callback : kony.servicesapp.addReadingCallback
                          }
                      ]
                    }	
                    }
					processedSegData.push(processedRowObj);
				}
                }
				return processedSegData;
			} catch (err) {
				kony.sdk.mvvm.log.error("error in Blogic formatSegData : " + err);
			}
		},
		/**
		 * This method is entry point for save flow. Developer can edit.
		 * Default implementation saves the entity record from the data of widgets defined in form config
		 * @memberof frmMeasurementExecutionKAControllerExtension#
		 */
		saveData : function () {
			try {
				var scopeObj = this;
				this.$class.$superp.saveData.call(this, success, error);
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
		/**
		 * This method is entry point for delete/remove flow. Developer can edit.
		 * Default implementation deletes the entity record displayed in form (primary keys are needed)
		 * @memberof frmMeasurementExecutionKAControllerExtension#
		 */
		deleteData : function () {
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
		formatTime : function (dataMap) {
			try {
				dataMap["form"][0]["StartDate"] = moment(dataMap["form"][0]["StartDate"], kony.servicesapp.DB_DATE_FORMAT).isValid() ? convertTimeZone(moment(dataMap["form"][0]["StartDate"], kony.servicesapp.DB_DATE_FORMAT).format(), kony.servicesapp.remoteTimeZone, null, kony.servicesapp.constants.getServiceConstantsObj().getDateTimeFormat("DAYANDTIME")) : "";
				return dataMap;
			} catch (error) {
				kony.sdk.mvvm.log.error("Error in Blogic formatTime : " + error);
			}
		},
		navigateBack : function () {
			try {
				 this.$class.$superp.showPreviousForm.call(this, true, kony.servicesapp.FRMORDEREXECUTIONKA);
			} catch (err) {
				kony.sdk.mvvm.log.error("error in Blogic navigateBack action : " + err);
			}
		},
		showMeasurementPoints : function () {
			try {
				var scopeObj = this;
				var navigationObject = new kony.sdk.mvvm.NavigationObject();
				navigationObject.addCustomInfo("taskID", scopeObj.TASK_NUM);
              	navigationObject.setQueryParams("segMeasurementPointsKA",{"Task_id": scopeObj.TASK_NUM,"search_text":"%%"});
				scopeObj.navigateTo(kony.servicesapp.FRMMEASUREMENTSKA, navigationObject);
			} catch (err) {
				kony.sdk.mvvm.log.error("Error in blogic showMeasurementPoints" + err);
			}
		},
        addMeasurementReading : function (selrecord) {
			try {								
				var scopeObj = this;
                var viewModel = scopeObj.getController().getFormModel();
			    var selRecord = viewModel.getViewAttributeByProperty("segMeasurementKA", "selectedItems");
                var platFormName = kony.sdk.mvvm.Utils.getPlatformName();
			    if(selRecord && selRecord[0]&& platFormName == kony.sdk.mvvm.Platforms["ANDROID"] ){
				selRecord = selRecord[0];	
                }               
			    if (platFormName == kony.sdk.mvvm.Platforms["IPHONE"] || platFormName == 'ipad') {
                  selRecord = selrecord;
                }
				var navigationObject = new kony.sdk.mvvm.NavigationObject();
                navigationObject.addCustomInfo("MeasurementPoint_id", selRecord.MeasurePoint_id);                
			    navigationObject.addCustomInfo("Task_id", scopeObj.TASK_NUM);
                navigationObject.addCustomInfo("Action","ADD");
                navigationObject.addCustomInfo("navigatingFrom", "MeasurementExecution");
				navigationObject.setQueryParams("flxTimeKA", {
				 "id" : selRecord.MeasurePoint_id,				
				}); 
				navigationObject.setQueryParams("flxUnit", {"Task_id":scopeObj.TASK_NUM,"wo_id":scopeObj.woID});
                scopeObj.navigateTo(kony.servicesapp.FRMREADINGEXECUTION, navigationObject);                
			} catch (err) {
				kony.sdk.mvvm.log.error("Error in blogic showReadimgExecution" + err);
			}
		},
        removeReadings:function(rowData){ 
            var scopeObj=this;
			var INSTANCE = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
            var controller = INSTANCE.getFormController(kony.application.getCurrentForm().id);
			var formModel = controller.getFormModel();            
            var appContext = controller.getApplicationContext();
            var configObj = controller.getConfig();
            var objServiceName = configObj.getObjectServiceName();
			var objServiceOptions = configObj.getObjectServiceOptions();
            var mventityController = appContext.getModel("MeasureValue", objServiceName, objServiceOptions);
            var query = "select mv.id from measureValue mv where mv.measurePoint_id='"+rowData.MeasurePoint_id+"' and mv.task_id='"+scopeObj.TASK_NUM+"'";
            var queryobj = new kony.sdk.mvvm.Query(query, "sql");     
            var recordsToBeUpdated=[];
            var measureValueSuccess=function(response){              
            kony.print(""+JSON.stringify(response));
             for(var i in response){               
               recordsToBeUpdated.push(response[i]["id"]);
             }
            scopeObj.setFormModelInfo("recordsToBeUpdated",recordsToBeUpdated);
            showHideHamburgerMenuKA(kony.application.getCurrentForm(),frmHamburgerMenuWOKA,true,"flxRemoveKA");			  
   			dismissPopUp("deleteReadingsTimer",3, scopeObj.updateReadings);
			//var selRecord = formModel.getViewAttributeByProperty("segTaskExecutionKA", "selectedItems")[0];			
			formModel.setViewAttributeByProperty("lblmeasurepointNumberKA","text",rowData.MeasurePoint_id);
			formModel.setViewAttributeByProperty("lblmeasurepointNameKA","text",rowData.Description);
			formModel.setViewAttributeByProperty("lblReadingsKA","text",rowData.Readings);
			
            //formModel.setViewAttributeByProperty("flxDeleteKA", "isVisible",true);			
			formModel.performActionOnView("flexDetailsKA","setEnabled",[false]);
			formModel.performActionOnView("btnBackKA","setEnabled",[false]);
			formModel.performActionOnView("btnBackKA","setEnabled",[false]);	
            }
            var measureValuefail=function(){
              alert("error in fetch for measureValue IDs");
            }
            mventityController.executeSelectQuery(queryobj.getQuery().query, measureValueSuccess, measureValuefail);                      
		   		  
         },         
       updateReadings:function () {
         var scopeObj=this;
         var section = kony.servicesapp.currIndices["secIndex"];
		 var row = kony.servicesapp.currIndices["rowIndex"]; 
         var INSTANCE = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
         var controller = INSTANCE.getFormController(kony.application.getCurrentForm().id);
         var formmodel = controller.getFormModel();
         var currentFormControllerExtension=controller.getControllerExtensionObject();
		 var rowData = formmodel.getViewAttributeByProperty("segMeasurementKA", "data")[section][1][row];					
		 formmodel.performActionOnView("flexDetailsKA", "setEnabled", [true]);
		 formmodel.performActionOnView("btnBackKA", "setEnabled", [true]);
		 currentFormControllerExtension.setFormModelInfo("isDelete",true);
		 currentFormControllerExtension.updateMeasureValue(rowData.MeasurePoint_id, rowData.Description, rowData.Readings);	
       }, 
  
       updateMeasureValue: function(MeasurePoint_id,MeasurePoint_Name,Readings) {        
           var objHandler = kony.sdk.mvvm.persistent.Record;
           var utilitiesObj = utilities.getUtilityObj();
           var appContext = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
           var controller = appContext.getFormController(kony.application.getCurrentForm().id);
           var currentFormControllerExtension=controller.getControllerExtensionObject();
           var configObj = controller.getConfig();
           var recordsToBeUpdated=this.getFormModelInfo("recordsToBeUpdated");
           var INSTANCE = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
           var measureValueRecordObjects=[];
           var measureValueModelObject = INSTANCE.getModel("MeasureValue", kony.servicesapp.OE_OBJECT_SERVICE_NAME, kony.servicesapp.APP_OPTIONS);           
           
            for(var i=0; i < recordsToBeUpdated.length; i++){
                 var dataObject = new kony.sdk.dto.DataObject("MeasureValue"); 
                 var measureValueRecordObject={};
                 measureValueRecordObject.id= recordsToBeUpdated[i];
                 measureValueRecordObject.OPMODE= "D";   
                 measureValueRecordObject.MeasurePoint_id= MeasurePoint_id;
                 measureValueRecordObject.WorkOrder_id= this.getFormModelInfo("woID");                 
                 dataObject.setRecord(measureValueRecordObject);
                 var measureValueSuccess = function() {
                     kony.print(" update success for measureValue delete")
                     kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();					
                 };			           
                 var measureValueError = function(err) {
                     alert("error in updatefor measureValue delete");
                     kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
                   };
                 measureValueModelObject.update(dataObject, measureValueSuccess, measureValueError);             
              }  
              kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
              showHideHamburgerMenuKA(kony.application.getCurrentForm(),frmHamburgerMenuWOKA,false,"flxRemoveKA");
              kony.timer.cancel("deleteReadingsTimer");                            			
              currentFormControllerExtension.fetchData();
              kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
       },  
		/**
		 * This method shows form.
		 * @memberof frmMeasurementExecutionKAControllerExtension#
		 */
		showForm : function () {
			try {
				var formmodel = this.getController().getFormModel();
				formmodel.showView();
			} catch (e) {
				var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_SHOWFORM_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_SHOWFORM_IN_CONTROLLER_EXTENSION, err);
				kony.sdk.mvvm.log.error(exception.toString());
			}
		},
        navigateToMeasurementReadings: function(){	
            try{
                var scopeObj = this;
                var controller = scopeObj.getController();
                var formModel = controller.getFormModel();
                var selectedRecord = formModel.getViewAttributeByProperty("segMeasurementKA","selectedItems")[0];
                var navigationObject = new kony.sdk.mvvm.NavigationObject();
                navigationObject.setQueryParams("form", {
                "id": selectedRecord.MeasurePoint_id
                });		
                navigationObject.addCustomInfo("navigatingFrom", "MeasurementExecution");
                navigationObject.addCustomInfo("MeasurementPoint_id", selectedRecord.MeasurePoint_id);
                navigationObject.addCustomInfo("Task_id", scopeObj.TASK_NUM);
                navigationObject.setQueryParams("segSwipeKA", {"Task_id":scopeObj.TASK_NUM,"MeasurePoint_id":selectedRecord.MeasurePoint_id});
				navigationObject.setQueryParams("flxTimeKA", {"Task_id":scopeObj.TASK_NUM,"wo_id":scopeObj.getFormModelInfo("woID")});
              	navigationObject.setQueryParams("flexDetailsKA", {"Task_id":scopeObj.TASK_NUM});
                scopeObj.navigateTo(kony.servicesapp.FRMMEASUREMENTREADINGS, navigationObject);
            } catch(err){
                kony.sdk.mvvm.log.error("Error in navigateToMeasurementReadings of controllerExtension");
            }
          },
      
		showMeasurementAttachment : function()
  {
    try{
     		 var scopeObj = this;
			var utilitiesObj = utilities.getUtilityObj();
			var applicationContext = scopeObj.getController() && scopeObj.getController().getApplicationContext();
			var frmOrderAttachmentsKAController = applicationContext && applicationContext.getFormController(kony.servicesapp.FRMORDERATTACHMENTKA );
			var frmOrderAttachmentsKAFormModel = frmOrderAttachmentsKAController && frmOrderAttachmentsKAController.getFormModel();
			frmOrderAttachmentsKAFormModel && frmOrderAttachmentsKAFormModel.setViewAttributeByProperty("lblOrderAttachmentsKA", "text",utilitiesObj.geti18nValueKA("i18n.common.MeasurementAttachment"));
			var taskId = scopeObj.getFormModelInfo("taskID");
			taskId = taskId && taskId.split("-");
			var query = "select TaskAttachment .BINARY_NAME AS BINARY_NAME,TaskAttachment .CREATED_TSTAMP AS createdts FROM TaskAttachment LEFT JOIN task ON TaskAttachment.operation=task.task_num  LEFT JOIN media ON TaskAttachment .BINARY_NAME = media.name  WHERE LOWER(media.type) = 'documents' AND task.type_id = 'MEAS' AND TaskAttachment .ORDER_NUM = '{x}' AND TaskAttachment .OPERATION = '{y}' AND LOWER(TaskAttachment .EXTENSION) = 'pdf'";
			var navigationObject = new kony.sdk.mvvm.NavigationObject();
			navigationObject.setQuery("segOrderAttachmentKA", query, "sql");
			navigationObject.setQueryParams("segOrderAttachmentKA", {
				"x": scopeObj.getFormModelInfo("woID"),
				"y": taskId[0]
			});
			navigationObject.addCustomInfo("WorkOrderId", scopeObj.getFormModelInfo("woID"));
			navigationObject.addCustomInfo("TaskId", taskId[0]);
			var controllerExtension = kony.sdk.mvvm.KonyApplicationContext.getAppInstance().getFormController(kony.servicesapp.FRMORDERATTACHMENTKA).getControllerExtensionObject();
			controllerExtension.setFormModelInfo("previousForm", "frmMeasurementExecutionKA");
			scopeObj.navigateTo(kony.servicesapp.FRMORDERATTACHMENTKA, navigationObject);
      }
    catch(err)
      {
      		kony.sdk.mvvm.log.error("Error in Blogic showTaskAttachments : " + err);
      }
  },
  //This function is used to show Measurement Images form
 showMeasurementImages: function() {
  try {
   var navigationObject = new kony.sdk.mvvm.NavigationObject();
   var scopeObj = this;
   var utilitiesObj = utilities.getUtilityObj();
   var applicationContext = scopeObj.getController() && scopeObj.getController().getApplicationContext();
   var frmTaskAttachmentsKAController = applicationContext && applicationContext.getFormController(kony.servicesapp.FRMTASKATTACHMENTKA);
   var frmTaskAttachmentsKAFormModel = frmTaskAttachmentsKAController && frmTaskAttachmentsKAController.getFormModel();
   frmTaskAttachmentsKAFormModel && frmTaskAttachmentsKAFormModel.setViewAttributeByProperty("lblHeaderKA", "text",utilitiesObj.geti18nValueKA("i18n.common.MeasurementImages"));
   var query = "select TaskAttachment.BINARY_NAME FROM TaskAttachment LEFT JOIN task ON TaskAttachment.operation=task.task_num LEFT JOIN media ON TaskAttachment.BINARY_NAME = media.name  WHERE  LOWER(TaskAttachment.DOC_TYPE) != 'signature' AND TaskAttachment.ORDER_NUM = '{x}' and  TaskAttachment.OPERATION='{y}' and task.type_id = 'MEAS' and (LOWER(TaskAttachment.EXTENSION) = 'png'  OR LOWER(TaskAttachment.EXTENSION) = 'jpeg'  OR LOWER(TaskAttachment.EXTENSION) = 'jpg')";
   navigationObject.setQuery("form", query, "sql");
   navigationObject.getQuery(kony.servicesapp.FRMTASKATTACHMENTKA);  
   var taskId = scopeObj.getFormModelInfo("taskID");
   taskId = taskId && taskId.split("-");
   navigationObject.setQueryParams("form", {
    'x': scopeObj.getFormModelInfo("woID"),
    'y': taskId[0]
   });
   navigationObject.addCustomInfo("WorkOrderId", scopeObj.getFormModelInfo("woID"));
   navigationObject.addCustomInfo("TaskId", taskId[0]);
           navigationObject.addCustomInfo("MeasId", "MEASUREMENT");
   var appContext = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
   var controllerExtension = appContext.getFormController(kony.servicesapp.FRMTASKATTACHMENTKA).getControllerExtensionObject();
   controllerExtension.setFormModelInfo("previousForm", "frmMeasurementExecutionKA");
   scopeObj.navigateTo(kony.servicesapp.FRMTASKATTACHMENTKA, navigationObject);
  } catch (error) {
   kony.sdk.mvvm.log.error("Error in Blogic showTaskImages : " + error);
  }
 }
	});
