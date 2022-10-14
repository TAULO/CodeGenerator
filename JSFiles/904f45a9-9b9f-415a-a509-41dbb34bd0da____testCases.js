var NO_ERROR_CODE = -1;
var dbPath = '../SFtest';
var sqldb;
var INSTANCE, duration = 5000;
var apptype = {"APPTYPE":"AFN"};
kony.appfoundation.v2.KonyApplicationContext.init(apptype);
describe("OrderResources module: Load database, i18n", function(){
    var flag, errCode;
	beforeEach(function() {
        errCode = NO_ERROR_CODE;
		flag = false;
    });
    function loadDBFile(){
		try{
			var xhr = new XMLHttpRequest();
			xhr.open('GET', dbPath, true);
			xhr.responseType = 'arraybuffer';
			xhr.onload = function(e) {
				flag = true;
				var data = new Uint8Array(this.response);
				var arr = new Array();
				for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
				data = (arr.join(""));
				sqldb = new SQL.Database(data);
			};
			xhr.send();
		}catch(err){
			errCode = err.code;
			flag = true;
		}
    };
    it("Load DB file", function(){
        runs(function(){
            loadDBFile();
        });
        waitsFor(function(){
            return flag;
        });
        runs(function(){
            kony.appfoundation.log.info("db file loaded -> ");
            expect(flag).toBe(true);
            expect(sqldb).not.toBeUndefined();
			expect(errCode).toEqual(NO_ERROR_CODE);
        })
    });
	it("Load i18n file", function(){
        runs(function(){
			try{
			jQuery.i18n.properties({
				name:'i18n', 
				path:'../../OrderExecution/',
				mode:'both',
				callback: function() {
					flag = true;
				}
			});
			}catch(err){
				errCode = err.code;
				flag = true;
			}
        });
        waitsFor(function(){
            return flag;
        });
        runs(function(){
            kony.appfoundation.log.info("i18n file loaded -> ");
            expect(flag).toBe(true);
			expect(errCode).toEqual(NO_ERROR_CODE);
        })
    });
});
	
describe("OrderResources module: Create dummy records", function() {
	overrideMethods();
	var errCode, formController, controllerextension;
	beforeEach(function() {
        errCode = NO_ERROR_CODE;
		kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.PROCESSING;
    });
	it("Login", function() {
        function loginSuccess(response) {
			try{
				kony.appfoundation.log.info("Login success ** " + JSON.stringify(response));
				INSTANCE = kony.appfoundation.v2.KonyApplicationContext.getAppInstance();
				INSTANCE.setOnlineStatus(false);
				kony.appfoundation.v2.initApplicationForms(INSTANCE);
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;	
			}catch(err){
				errCode = err.code;
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}
        };
        function loginError(err) {
			kony.appfoundation.log.info("Login error ** " + JSON.stringify(err));
            errCode = err.code;
            kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
        };
        runs(function() {
			var isMocked = {
                "isMocked": true,
                "mockDbPath" : "../SFtest"
            };
            var syncOptions = {
                "syncMetadata": true,
                "syncData": false
            };
            var authParams = {
                "username": "postgres",
                "password": "",
                "tenant": "test",
                "hostName": "dummy"
            };
            var configParams = {
                "DataService" : "kony.appfoundation.MockDataService",
                "UIConfigService": "kony.appfoundation.MockUIConfigService",
                "MetadataService":"kony.appfoundation.MockMetadataService"
            };
            var params = {
                "authParams": authParams,
                "configParams" : configParams,
				"syncOptions" : syncOptions
            };
            kony.appfoundation.v2.KonyApplicationContext.appServicesLogin(params, loginSuccess, loginError);
        });
        waitsFor(function() {
			return kony.appfoundation.v2.applicationStatus === kony.appfoundation.constants.applicationStatus.COMPLETED;
		}, duration);
		
		runs(function() {
			expect(errCode).toEqual(NO_ERROR_CODE);
		});
    });
	
	it("Create Material type records", function() {
		var mtypeSuccess = function(res) {
			try{
				kony.appfoundation.log.info("** Material type records create success ** " + JSON.stringify(res));
				var len = kony.servicesapp.MOCKED_DATA_MATERIAL_TYPE.length;
				for (var i = 0; i <len; i++) {
					kony.servicesapp.MOCKED_DATA_MATERIAL_TYPE[i]["id"] = res[i].id;
				}
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}catch(err){
				errCode = err.code;
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}
		};
		var mtypeError = function(err) {
			errCode = err.code;
			kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
		};
		runs(function() {
			try{
				var mtypeRecordObjects = [];
				var swRecordObject;
				formController = INSTANCE.getFormController("frmOrderResourcesListKA");
				controllerextension = formController.getControllerExtensionObject();
				var mtypeData = kony.servicesapp.MOCKED_DATA_MATERIAL_TYPE;
				for (var i = 0; i < mtypeData.length; i++) {
				    swRecordObject = new kony.appfoundation.v2.persistent.Record("MaterialType");
					swRecordObject.set("Name", mtypeData[i]["Name"]);
					mtypeRecordObjects.push(swRecordObject);
				}
				controllerextension.saveRecords(mtypeRecordObjects, mtypeSuccess, mtypeError);
			}catch(err){
				errCode = err.code;
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}
		});
		waitsFor(function() {
			return kony.appfoundation.v2.applicationStatus === kony.appfoundation.constants.applicationStatus.COMPLETED;
		}, duration);
		runs(function() {
			expect(errCode).toEqual(NO_ERROR_CODE);
		});
	});
	
	it("Create Unit records", function() {
		var unitSuccess = function(res) {
			try{
				kony.appfoundation.log.info("** Unit records create success ** " + JSON.stringify(res));
				var len = kony.servicesapp.MOCKED_DATA_UNIT.length;
				for (var i = 0; i <len; i++) {
					kony.servicesapp.MOCKED_DATA_UNIT[i]["id"] = res[i].id;
				}
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}catch(err){
				errCode = err.code;
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}
		};
		var unitError = function(err) {
			errCode = err.code;
			kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
		};
		runs(function() {
			try{
				var UnitRecordObjects = [];
				var swRecordObject;
				formController = INSTANCE.getFormController("frmOrderResourcesListKA");
				controllerextension = formController.getControllerExtensionObject();
				var unitData = kony.servicesapp.MOCKED_DATA_UNIT;
				for (var i = 0; i < unitData.length; i++) {
				    swRecordObject = new kony.appfoundation.v2.persistent.Record("Unit");
					swRecordObject.set("Description", unitData[i]["Description"]);
					UnitRecordObjects.push(swRecordObject);
				}
				controllerextension.saveRecords(UnitRecordObjects, unitSuccess, unitError);
			}catch(err){
				errCode = err.code;
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}
		});
		waitsFor(function() {
			return kony.appfoundation.v2.applicationStatus === kony.appfoundation.constants.applicationStatus.COMPLETED;
		}, duration);
		runs(function() {
			expect(errCode).toEqual(NO_ERROR_CODE);
		});
	});

	it("Create material records", function() {
		var materialSuccess = function(res) {
			try{
				kony.appfoundation.log.info("** Material records create success ** " + JSON.stringify(res));
				var len = kony.servicesapp.MOCKED_DATA_MATERIAL.length;
				for (var i = 0; i <len; i++) {
					kony.servicesapp.MOCKED_DATA_MATERIAL[i]["id"] = res[i].id;
				}
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}catch(err){
				errCode = err.code;
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}
		};
		var materialError = function(err) {
			errCode = err.code;
			kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
		};
		runs(function() {
			try{
				var materialRecordObjects = [];
				var materialData = kony.servicesapp.MOCKED_DATA_MATERIAL;
				var unitData = kony.servicesapp.MOCKED_DATA_UNIT;
				var typedata= kony.servicesapp.MOCKED_DATA_MATERIAL_TYPE;
				var swRecordObject;
				for (var i = 0; i < materialData.length; i++) {
					swRecordObject = new kony.appfoundation.v2.persistent.Record("Material");
					swRecordObject.set("Unit_id", unitData[i]["id"]);
					swRecordObject.set("Type_id", typedata[i]["id"]);
					swRecordObject.set("Description", materialData[i]["Description"]);
					swRecordObject.set("ModelNumber", materialData[i]["ModelNumber"]);
					swRecordObject.set("Barcode", materialData[i]["Barcode"]);					
					materialRecordObjects.push(swRecordObject);
				}
				formController = INSTANCE.getFormController("frmOrderResourcesListKA");
				controllerextension = formController.getControllerExtensionObject();
				controllerextension.saveRecords(materialRecordObjects, materialSuccess, materialError);
			}catch(err){
				errCode = err.code;
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}
		});
		waitsFor(function() {
			return kony.appfoundation.v2.applicationStatus === kony.appfoundation.constants.applicationStatus.COMPLETED;
		}, duration);
		runs(function() {
			expect(errCode).toEqual(NO_ERROR_CODE);
		});
	});
	
	
	it("Create Inventory records", function() {
		var invSuccess = function(res) {
			try{
				kony.appfoundation.log.info("** Inventory records create success ** " + JSON.stringify(res));
				var len = kony.servicesapp.MOCKED_DATA_INVENTORY.length;
				for (var i = 0; i <4; i++) {
					kony.servicesapp.MOCKED_DATA_INVENTORY[i]["id"] = res[i].id;
				}
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}catch(err){
				errCode = err.code;
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}
		};
		var invError = function(err) {
			errCode = err.code;
			kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
		};
		runs(function() {
			try{
				var invRecordObjects = [];
				var swRecordObject;
				formController = INSTANCE.getFormController("frmOrderResourcesListKA");
				controllerextension = formController.getControllerExtensionObject();
				var invData = kony.servicesapp.MOCKED_DATA_INVENTORY;
				var mockMatData= kony.servicesapp.MOCKED_DATA_MATERIAL
				for (var i = 0; i < 4; i++) {
				    swRecordObject = new kony.appfoundation.v2.persistent.Record("Inventory");
					swRecordObject.set("Quantity", invData[i]["Quantity"]);
					swRecordObject.set("Material_id", mockMatData[i]["id"]);
					kony.servicesapp.MOCKED_DATA_INVENTORY.push({	
						"Material_id": mockMatData[i]["id"],
				    });
					invRecordObjects.push(swRecordObject);
				}
				
				controllerextension.saveRecords(invRecordObjects, invSuccess, invError);
				
			}catch(err){
				errCode = err.code;
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}
		});
		waitsFor(function() {
			return kony.appfoundation.v2.applicationStatus === kony.appfoundation.constants.applicationStatus.COMPLETED;
		}, duration);
		runs(function() {
			expect(errCode).toEqual(NO_ERROR_CODE);
		});
	});
	
	
	it("Create workordermaterial records", function() {
		var workordermaterialSuccess = function(res) {
			kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
		};
		var workordermaterialError = function(err) {
			errCode = err.code;
			kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
		};
		runs(function() {
			try{
				var workorderRecordObjects = [];
				var taskData = kony.servicesapp.MOCKED_DATA_TASK;
				var orderdata= kony.servicesapp.MOCKED_DATA_ORDER_LIST;
				var materialData = kony.servicesapp.MOCKED_DATA_MATERIAL;
				var swRecordObject,taskRecordObject, orderRecordObject, materialRecordObject;
				for (var i = 0; i < 4; i++) {
					swRecordObject = new kony.appfoundation.v2.persistent.Record("WorkOrderMaterial");
					taskRecordObject = new kony.appfoundation.v2.persistent.Record("Task");
					orderRecordObject = new kony.appfoundation.v2.persistent.Record("WorkOrder");
					materialRecordObject = new kony.appfoundation.v2.persistent.Record("Material");
					materialRecordObject.set("id", materialData[i]["id"]);
					taskRecordObject.set("id", taskData[i]["id"]);
					orderRecordObject.set("id", orderdata[i]["id"]);
					swRecordObject.set("TaskComp_id", taskRecordObject);
					swRecordObject.set("Material_id", materialRecordObject);
					swRecordObject.set("RequestedUnit_id", kony.servicesapp.MOCKED_DATA_UNIT[i]["id"]);
					swRecordObject.set("WorkOrder_id", orderRecordObject);
					swRecordObject.set("RequestedQuantity", kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL[i]["RequestedQuantity"]);
					swRecordObject.set("isConsumable", kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL[i]["isConsumable"]);
					swRecordObject.set("isConsumed", kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL[i]["isConsumed"]);
					kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL.push({
						"TaskComp_id": taskData[i]["id"],
						"Material_id": materialData[i]["id"],
						"WorkOrder_id": orderdata[i]["id"],
						"RequestedUnit_id": kony.servicesapp.MOCKED_DATA_UNIT[i]["id"]
					});
					workorderRecordObjects.push(swRecordObject);
				}
				formController = INSTANCE.getFormController("frmOrderResourcesListKA");
				controllerextension = formController.getControllerExtensionObject();
				controllerextension.saveRecords(workorderRecordObjects, workordermaterialSuccess, workordermaterialError);
			}catch(err){
				errCode = err.code;
				kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
			}
		});
		waitsFor(function() {
			return kony.appfoundation.v2.applicationStatus === kony.appfoundation.constants.applicationStatus.COMPLETED;
		}, duration);
		runs(function() {
			expect(errCode).toEqual(NO_ERROR_CODE);
		});
	});
});
describe("OrderResources module: Controller extension valid cases", function() {
    overrideMethods();
    var errCode, formController,formcontroller,controllerExtension, controllerextension,timeFormat;
	var utilitiesObj = utilities.getUtilityObj();
    beforeEach(function() {
        errCode = NO_ERROR_CODE;
        kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.PROCESSING;
    });
    it("Login", function() {
        function loginSuccess(response) {
            try {
                kony.appfoundation.log.info("Login success ** " + JSON.stringify(response));
                INSTANCE = kony.appfoundation.v2.KonyApplicationContext.getAppInstance();
                INSTANCE.setOnlineStatus(false);
                kony.appfoundation.v2.initApplicationForms(INSTANCE);
                kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
            } catch (err) {
                errCode = err.code;
                kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
            }
        };

        function loginError(err) {
            kony.appfoundation.log.info("Login error ** " + JSON.stringify(err));
            errCode = err.code;
            kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
        };
        runs(function() {
			var isMocked = {
                "isMocked": true,
                "mockDbPath" : "../SFtest"
            };
            var syncOptions = {
                "syncMetadata": true,
                "syncData": false
            };
            var authParams = {
                "username": "postgres",
                "password": "",
                "tenant": "test",
                "hostName": "dummy"
            };
            var configParams = {
                "DataService" : "kony.appfoundation.MockDataService",
                "UIConfigService": "kony.appfoundation.MockUIConfigService",
                "MetadataService":"kony.appfoundation.MockMetadataService"
            };
            var params = {
                "authParams": authParams,
                "configParams" : configParams,
				"syncOptions" : syncOptions
            };
            kony.appfoundation.v2.KonyApplicationContext.appServicesLogin(params, loginSuccess, loginError);
        });

        waitsFor(function() {
            return kony.appfoundation.v2.applicationStatus === kony.appfoundation.constants.applicationStatus.COMPLETED;
        }, duration);

        runs(function() {
            expect(errCode).toEqual(NO_ERROR_CODE);
        });
    });
	
	it("Resource Execution : Validate that data displayed is of same Order Resource selected", function() {
        formController = INSTANCE.getFormController("frmResourceExecutionKA");
        controllerextension = formController.getControllerExtensionObject();
        //var segData = dataMap["segOrderListKA"];
        formModel = formController.getFormModel();
		formcontroller = INSTANCE.getFormController("frmOrderExecutionKA");
        controllerExtension = formcontroller.getControllerExtensionObject();
		controllerExtension.setFormModelInfo("workorderStatus",kony.servicesapp.MOCKED_DATA_STATUS[1]["Description"]);
		var len= kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL.length
		var mockMatData = kony.servicesapp.MOCKED_DATA_MATERIAL[0];
		var taskMockData = kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL;
		var MockUnitData = kony.servicesapp.MOCKED_DATA_UNIT;
		var mockMatTypeData= kony.servicesapp.MOCKED_DATA_MATERIAL_TYPE;
		var matID=taskMockData[22]["Material_id"];
        var taskID = taskMockData[22]["TaskComp_id"];
		var wID= taskMockData[22]["WorkOrder_id"];
        runs(function() {
            try {
                var datamodel = new kony.appfoundation.v2.DataModel();
                datamodel.setPrimaryFieldValue(matID);
                datamodel.setMasterEntityName(controllerextension.getController().getConfig().getEntity());
                var navigationObject = new kony.appfoundation.v2.NavigationObject();
                navigationObject.setDataModel(datamodel, kony.appfoundation.v2.OperationType.FILTER_BY_PRIMARY_KEY, "form");
               // datamodel.setMasterEntityName('Material');
                navigationObject.setQueryParams("form", {
                    "y": matID,
                    "z": taskID
                });
				kony.print("navigationObject"+JSON.stringify(navigationObject));
				 navigationObject.addCustomInfo("WorkOrderId",wID);
				 navigationObject.addCustomInfo("TaskId",taskID);
				 navigationObject.addCustomInfo("MaterialId",matID);
				kony.servicesapp.NavStack.getInstance().registerForm("frmOrderResourcesListKA");
                formController.loadDataAndShowForm(navigationObject);
            } catch (err) {
                errCode = err.code;
                kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
            }
        });
        waitsFor(function() {
            return kony.appfoundation.v2.applicationStatus === kony.appfoundation.constants.applicationStatus.COMPLETED;
        }, duration);
        runs(function() {
            expect(errCode).toEqual(NO_ERROR_CODE);
			expect(formModel.getWidgetData("lblResourceNameKA").getData()).toEqual(mockMatData["Description"]);
			//expect(formModel.getWidgetData("lblResourceNumberKA").getData()).toEqual(mockMatData["id"]);
			expect(formModel.getWidgetData("lblResourceUnitKA").getData()).toEqual(String(utilitiesObj.roundNumber(taskMockData[0]["RequestedQuantity"],2)));
			expect(formModel.getWidgetData("lblMeasureValueKA").getData()).toEqual(MockUnitData[0]["Description"]);
			expect(formModel.getWidgetData("lblMaterialTypeKA").getData()).toEqual(mockMatTypeData[0]["Name"]);
			expect(formModel.getWidgetData("lblModelValueKA").getData()).toEqual(mockMatData["ModelNumber"]);
			expect(formModel.getWidgetData("lblBarcodeValueKA").getData()).toEqual(mockMatData["Barcode"]);
			expect(formModel.getWidgetData("lblUnitKA").getData()).toEqual(MockUnitData[0]["Description"]);
			expect(formModel.getWidgetData("lblDescriptionValueKA").getData()).toEqual(mockMatData["Description"]);
			
        });
    });
	
	it("ResourceExecution : Validate that the resource cannot be edited or deleted unless the workorder and the task status is started", function() {
        var formController = INSTANCE.getFormController("frmResourceExecutionKA");
        var controllerextension = formController.getControllerExtensionObject();
		var mockIndex = 0;
		var mockMatData = kony.servicesapp.MOCKED_DATA_MATERIAL[0];
		var taskMockData = kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL;
		var MockUnitData = kony.servicesapp.MOCKED_DATA_UNIT;
		var mockMatTypeData= kony.servicesapp.MOCKED_DATA_MATERIAL_TYPE;
		var matID=taskMockData[22]["Material_id"];
        var taskID = taskMockData[22]["TaskComp_id"];
		var wID= taskMockData[22]["WorkOrder_id"];
		var navigationObject 
        //var segData = dataMap["segOrderListKA"];
        formModel = formController.getFormModel();
        runs(function() {
		    try {
				var datamodel = new kony.appfoundation.v2.DataModel();
				datamodel.setPrimaryFieldValue(matID);
				datamodel.setMasterEntityName(controllerextension.getController().getConfig().getEntity());
				navigationObject = new kony.appfoundation.v2.NavigationObject();
				navigationObject.setDataModel(datamodel, kony.appfoundation.v2.OperationType.FILTER_BY_PRIMARY_KEY, "form");
				navigationObject.addCustomInfo("TaskId", taskID);
				navigationObject.addCustomInfo("TaskStatus",kony.servicesapp.MOCKED_DATA_STATUS[1]["Description"]);
				navigationObject.addCustomInfo("WOStatus", kony.servicesapp.MOCKED_DATA_STATUS[1]["Description"]);
				navigationObject.addCustomInfo("MaterialId", matID);				
				navigationObject.setQueryParams("form", {
					"y": matID,
					"z": taskID
				});
				kony.servicesapp.NavStack.getInstance().registerForm("frmTaskExecutionKA");
                formController.loadDataAndShowForm(navigationObject);
            } catch (err) {
                errCode = err.code;
                kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
            }
		 
        });
        waitsFor(function() {
                return kony.appfoundation.v2.applicationStatus === kony.appfoundation.constants.applicationStatus.COMPLETED;
        }, duration);
        runs(function() {
            timeFormat = utilitiesObj.geti18nValueKA("i18n.common.TimeFormatKA");
            expect(errCode).toEqual(NO_ERROR_CODE);
            var flxFooterKAVisibility = controllerextension.getController().getFormModel().getViewAttributeByProperty("flxFooterKA", "isVisible");
			//var contextData = controllerextension.getController().getContextData();
            if (controllerextension.getFormModelInfo("workorderStatus")=="Started" && controllerextension.getFormModelInfo("taskStatus")=="Started"){
                expect(flxFooterKAVisibility).toEqual(true);
            } else {
                expect(flxFooterKAVisibility).toEqual(false);
            }
        });
    });
	
	it("Show frmOrderResourcesListKA form", function() {
        formController = INSTANCE.getFormController("frmOrderResourcesListKA");
        controllerextension = formController.getControllerExtensionObject();
		formcontroller = INSTANCE.getFormController("frmOrderExecutionKA");
        controllerExtension = formcontroller.getControllerExtensionObject();
		controllerExtension.setFormModelInfo("WorkOrderStatus",kony.servicesapp.MOCKED_DATA_STATUS[0]["Description"]);
        formModel = formController.getFormModel();
		var len= kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL.length;
        var wID = kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL[22]["WorkOrder_id"];
        runs(function() {
            try {
				var datamodel = new kony.appfoundation.v2.DataModel();
				datamodel.setPrimaryFieldValue(wID);
				datamodel.setMasterEntityName(controllerextension.getController().getConfig().getEntity());
				var navigationObject = new kony.appfoundation.v2.NavigationObject();
				navigationObject.setDataModel(datamodel, kony.appfoundation.v2.OperationType.FILTER_BY_PRIMARY_KEY, "form");
				navigationObject.setQueryParams("segDetailskA", {
					"x":wID
				});
				navigationObject.addCustomInfo("WorkOrderId",wID);
				//kony.servicesapp.NavStack.getInstance().registerForm("frmOrderResourcesListKA");
				formController.loadDataAndShowForm(navigationObject);
            } catch (err) {
                errCode = err.code;
                kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
            }
        });
        waitsFor(function() {
            return kony.appfoundation.v2.applicationStatus === kony.appfoundation.constants.applicationStatus.COMPLETED;
        }, duration);
        runs(function() {
            expect(errCode).toEqual(NO_ERROR_CODE);
			var segData=formModel.getWidgetData("segDetailskA").getData();
            var mockedMatData = kony.servicesapp.MOCKED_DATA_MATERIAL;
			var mockUnitdata= kony.servicesapp.MOCKED_DATA_UNIT;
            var mockedDataLength = mockedMatData.length;
            var j = 0;
            var flag = false;
			var segRowData, mockedRow;
            for (var i in segData) {
                while (j <= mockedDataLength) {
                    if (parseInt(segData[i][1][i]["Code"]) === mockedMatData[j]["id"]) {
						segRowData = segData[i][1][i];
						mockedRow = j;
                        flag = true;
						break;
                    }
					j++;
                }
				if(segRowData){
					expect(parseInt(segRowData["Code"])).toEqual(mockedMatData[mockedRow]["id"]);
					expect(segRowData["MaterialType"]).toEqual(kony.servicesapp.MOCKED_DATA_MATERIAL_TYPE[mockedRow]["Name"]);						
					expect(segRowData["RequestedQuantity"]).toEqual(String(utilitiesObj.roundNumber(kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL[mockedRow]["RequestedQuantity"],2)+" "+mockUnitdata[mockedRow]["Description"]));
					expect(segRowData["AvailableQuantity"]).toEqual(String(utilitiesObj.roundNumber(kony.servicesapp.MOCKED_DATA_INVENTORY[mockedRow]["Quantity"],2)+" "+mockUnitdata[mockedRow]["Description"]));
					expect(segRowData["Description"]).toEqual(utilitiesObj.dataTruncation(mockedMatData[mockedRow]["Description"],28,3,"...").value);
				}
                j = 0;
            }
            
        });
    });
	
	
	it("Uncheck resource Functionality", function() {
        formController = INSTANCE.getFormController("frmOrderResourcesListKA");
        controllerextension = formController.getControllerExtensionObject();
		formcontroller = INSTANCE.getFormController("frmOrderExecutionKA");
        controllerExtension1 = formcontroller.getControllerExtensionObject();
		controllerExtension1.setFormModelInfo("WorkOrderStatus",kony.servicesapp.MOCKED_DATA_STATUS[3]["Description"]);
		var formcontroller2 = INSTANCE.getFormController("frmTaskExecutionKA");
		var controllerExtension2 = formcontroller2.getControllerExtensionObject();
		var formmodel2 = formcontroller2.getFormModel();
		controllerExtension2.setFormModelInfo("taskStatus",kony.servicesapp.MOCKED_DATA_STATUS[3]["Description"]);
        formModel = formController.getFormModel();
		var len= kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL.length;
        var wID = kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL[23]["WorkOrder_id"];
        runs(function() {
            try {
				var datamodel = new kony.appfoundation.v2.DataModel();
				datamodel.setPrimaryFieldValue(wID);
				datamodel.setMasterEntityName(controllerextension.getController().getConfig().getEntity());
				var navigationObject = new kony.appfoundation.v2.NavigationObject();
				navigationObject.setDataModel(datamodel, kony.appfoundation.v2.OperationType.FILTER_BY_PRIMARY_KEY, "form");
				navigationObject.setQueryParams("segDetailskA", {
					"x":wID
				});
				navigationObject.addCustomInfo("WorkOrderId",wID);
				//kony.servicesapp.NavStack.getInstance().registerForm("frmOrderResourcesListKA");
				formController.loadDataAndShowForm(navigationObject);
            } catch (err) {
                errCode = err.code;
                kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
            }
        });
        waitsFor(function() {
            return kony.appfoundation.v2.applicationStatus === kony.appfoundation.constants.applicationStatus.COMPLETED;
        }, duration);
        runs(function() {
            expect(errCode).toEqual(NO_ERROR_CODE);
			var workorderStatus = controllerExtension1.getFormModelInfo("WorkOrderStatus");
			var tstataus=controllerExtension2.getFormModelInfo("taskStatus");
			var segData=formModel.getWidgetData("segDetailskA").getData();
            var mockedMatData = kony.servicesapp.MOCKED_DATA_MATERIAL;
			var mockUnitdata= kony.servicesapp.MOCKED_DATA_UNIT;
            var mockedDataLength = mockedMatData.length;
            var j = 0;
            var flag = false;
			var segRowData, mockedRow;
            for (var i in segData) {
                while (j <= mockedDataLength) {
                    if (parseInt(segData[i][1][i]["Code"]) === mockedMatData[j]["id"]) {
						segRowData = segData[i][1][i];
						mockedRow = j;
                        flag = true;
						break;
                    }
					j++;
                }
				if(segRowData["isConsumedImage"]["skin"]== "btnResourceCheckedKA" &&(workorderStatus=="Completed"||tstataus=="Completed")){
					expect(segRowData["isConsumed"]).toEqual(kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL[mockedRow]["isConsumed"]);
				}
				else if(segRowData["isConsumedImage"]["skin"]== "btnResourceUncheckedKA"){
					expect(segRowData["isConsumed"]).toEqual(kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL[mockedRow]["isConsumed"]);
				}
                j = 0;
            }
            
        });
    });
	
	
	
	it("Order Resources Details P0 test case", function() {
        formController = INSTANCE.getFormController("frmOrderResourceDetailsKA");
        controllerextension = formController.getControllerExtensionObject();
        formModel = formController.getFormModel();
        var mockMatDetails = {};
		var mockOrderDetails = {};
        mockMatDetails = kony.servicesapp.MOCKED_DATA_MATERIAL[0];
		var len=kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL.length;
		mockWOMDetails= kony.servicesapp.MOCKED_DATA_WORKORDER_MATERIAL;
		
        runs(function() {
            try {
			
			    formcontroller = INSTANCE.getFormController("frmResourceExecutionKA");
                controllerExtension = formcontroller.getControllerExtensionObject();
                var contextData = controllerExtension.getController().getContextData();
				var datamodel = new kony.appfoundation.v2.DataModel();
				var contextData = controllerExtension.getController().getContextData();
				datamodel.setPrimaryFieldValue(contextData.getCustomInfo("MaterialId"));
				var queryParams = {};
				var materialInfo = contextData.getCustomInfo("MaterialId");
				queryParams["x"] = materialInfo;
				if (contextData.getCustomInfo("TaskId")) {
					queryParams["z"] = contextData.getCustomInfo("TaskId");
					queryParams["y"] = "";
				} else if (contextData.getCustomInfo("WorkOrderId")) {
					queryParams["y"] = contextData.getCustomInfo("WorkOrderId");
					queryParams["z"] = "";
				}
				kony.print("navigateToResourceDetails" + JSON.stringify(queryParams));
				datamodel.setMasterEntityName(controllerextension.getController().getConfig().getEntity());
				var navigationObject = new kony.appfoundation.v2.NavigationObject();
				navigationObject.setDataModel(datamodel, kony.appfoundation.v2.OperationType.FILTER_BY_PRIMARY_KEY, "form");
				navigationObject.setQueryParams("form", queryParams);

				formController.loadDataAndShowForm(navigationObject);
            } catch (err) {
                errCode = err.code;
                kony.appfoundation.v2.applicationStatus = kony.appfoundation.constants.applicationStatus.COMPLETED;
            }
        });
        waitsFor(function() {
            return kony.appfoundation.v2.applicationStatus === kony.appfoundation.constants.applicationStatus.COMPLETED;
        }, duration);
        runs(function() {
            expect(errCode).toEqual(NO_ERROR_CODE);
            expect(formModel.getWidgetData("lblMaterialNameValueKA").getData()).toEqual(mockMatDetails["Description"]);
            expect(parseInt(formModel.getWidgetData("lblMatrialIdNumberValueKA").getData())).toEqual(mockMatDetails["id"]);
			expect(formModel.getWidgetData("lblQuantityNeededValueKA").getData()).toEqual(String(utilitiesObj.roundNumber(mockWOMDetails[0]["RequestedQuantity"],2)));
        });
    });
});