/*
 * Controller Extension class for frmApprovalHome
 * Developer can edit the existing methods or can add new methods if required
 *
 */
kony = kony || {};
kony.sdk = kony.sdk || {};
kony.sdk.mvvm = kony.sdk.mvvm || {};
kony.sdk.mvvm.v2 = kony.sdk.mvvm.v2 || {};

/**
 * Creates a new Form Controller Extension.
 * @class frmApprovalHomeControllerExtension
 * @param {Object} controllerObj - Form Controller.
 */
kony.sdk.mvvm.frmApprovalHomeControllerExtension = Class(kony.sdk.mvvm.BaseFormControllerExtension, {
  constructor: function(controllerObj) {
    this.$class.$super.call(this, controllerObj);
  },
  /**
     * This method is an entry point for all fetch related flows. Developer can edit.
     * Default implementation fetches data for the form based on form config
     * @memberof frmApprovalHomeControllerExtension#
     */
  fetchData: function() {
    try {
      var scopeObj = this;
      kony.apps.coe.ess.Approvals.spa.formController = this;
      kony.sdk.mvvm.KonyApplicationContext.showLoadingScreen(kony.i18n.getLocalizedString("i18n.ess.common.loadingForm"));
      kony.print("---------Started execution of fetch data in the frmapproval Home controller extension----------");
      if (kony.apps.coe.ess.globalVariables.isSPA == true) { //Incase of SPA
        var approvalsData = {};
        this.$class.$superp.fetchData.call(this, function success(response) {
          kony.print("---------- employee ID: " + kony.apps.coe.ess.globalVariables.EmployeeID);
          //Parent table in the hierarchy 'approval_request' is called
          //ODATA query for approval_request under MYAPPROVALS entity
          kony.print("---- Hello world");
          var objSvc = kony.sdk.getCurrentInstance().getObjectService("MYAPPROVALS", { "access": "online" })
          var dataObject = new kony.sdk.dto.DataObject("approval_request");
          var options = { "dataObject": dataObject };
          objSvc.fetch(options, function(res) {
            //Processing of fetched requests is done for SPA records
            kony.apps.coe.ess.Approvals.spa.ProcessSpaRecords(res.records);
          }, function(err) {
            kony.print("---------- dataObject error: " + JSON.stringify(err));
          });
        }, function error(err) {
          kony.print("----------- in error callback response: " + JSON.stringify(err));
        });
      }
      //query for the retrival of the Approval Requests
      else if (kony.apps.coe.ess.globalVariables.isNative == true) {
        if (kony.apps.coe.ess.globalVariables.EmployeeID) {
          var Approval_request_query = "SELECT approval_request.id  AS ID," +
              "	   approval_request.due_date 		  AS Due_Date ," +
              " 	   approval_request.employee_id 	  AS CreatedByEmployeeid ," +
              "       approval_request.category_id       AS CategoryID," +
              "       approval_request.type_id           AS TypeID," +
              "       approval_request.islater           AS ISLater," +
              "       approval_request.isread            AS ISRead," +
              "       approval_request.request_date      AS RequestDate," +
              "       approval_request.leave_hours       AS Leave_hours," +
              "       approval_request.leave_days        AS Leave_days," +
              "       employee.first_name                AS FirstName," +
              "       employee.last_name                 AS LastName," +
              "       employee.Media_Id              	   AS MediaID," +
              "		CASE WHEN ([request_approver].[delegator_id] = '' OR  [request_approver].[delegator_id] ISNULL) THEN 0 ELSE 1 END AS [Delegated]," +
              "       request_type.NAME                  AS Type," +
              "       request_approver.status_id         AS StatusId," +
              "       status.status_name                 AS StatusName," +
              "       request_approver.approver_id       AS Employee_id," +
              "       t2.TEXT_DISPLAY                    As	Category,"+
              "       request_category.NAME              AS Category1," +
              "       attribute.id                       AS attributeID," +
              "       attribute.attribute_def_id         AS Attribute_DEF," +
              "       attribute_def.attribute_section_id AS AttributeSection," +
              "       Group_concat(attribute.value)      AS Attributevalue," +
              "       Group_concat(attribute_def.label)  AS AttributeNAME" +
              " FROM   approval_request" +
              "       LEFT JOIN request_type" +
              "              ON ( approval_request.type_id = request_type.id )" +
              "       LEFT JOIN employee" +
              "              ON ( approval_request.employee_id = employee.id )" +
              "       LEFT JOIN request_approver" +
              "              ON ( approval_request.id = request_approver.approval_id )" +
              "       LEFT JOIN status" +
              "              ON ( approval_request.status_id = status.id )" +
              "       LEFT JOIN request_category" +
              "              ON ( approval_request.category_id = request_category.id )" +
              " LEFT JOIN translation t1 "+
              " ON (request_category.name=t1.TEXT_DISPLAY) "+
			  " LEFT JOIN translation t2 ON(t2.TEXT_CODE=t1.TEXT_CODE) "+
              "       LEFT JOIN attribute" +
              "              ON ( approval_request.id = attribute.approval_id )" +
              "       LEFT JOIN attribute_def" +
              "              ON ( attribute.attribute_def_id = attribute_def.id )" +
              " WHERE  request_approver.approver_id = '" + kony.apps.coe.ess.globalVariables.EmployeeID+"'" +
              " and  t2.SPRAS like '"+kony.i18n.getCurrentLocale().substring(0, 2).toUpperCase()+"'"+
              " and attribute_def.attribute_section_id='1'" +
              " and (request_approver.status_id = '2' OR (request_approver.status_id = '0' AND approval_request.isRead = '0' AND approval_request.type_id='LEAVEINFO' and approval_request.category_id != 'NULL'))" +
              " and approval_request.islater='0'" +
              " GROUP  BY approval_request.id  ";
          var userPriority = kony.store.getItem(kony.apps.coe.ess.globalVariables.UserSortingKey);
          if (isEmpty(userPriority)) {
            //Not selected the option to show first
            //DO nothing no changes in the query
          } else {
            Approval_request_query += " ORDER  BY  CASE WHEN [request_type].[name] = '" + userPriority + "' THEN 0 ELSE approval_request.request_date END ";
          }

          //query for the retrival of the Islater requests count
          var IsLaterRequests_query = "SELECT request_type.NAME AS TYPE, " +
              "        Count (IsLaterRequests.type_id) AS COUNT ," +
              "			request_type.id AS id " +
              " FROM   request_type " +
              "        LEFT JOIN (SELECT * " +
              "                   FROM   approval_request " +
              "                          LEFT JOIN request_approver " +
              "                                 ON ( request_approver.approval_id = " +
              "                                      approval_request.id " +
              "                                    ) " +
              "                   WHERE  approval_request.islater = 1 " +
              "                          AND request_approver.approver_id = '" + kony.apps.coe.ess.globalVariables.EmployeeID + "'" +
              "                          AND request_approver.status_id = '2') IsLaterRequests " +
              "               ON ( IsLaterRequests.type_id = request_type.id ) " +
              " GROUP  BY request_type.id ";

          //retrving the approval requests whose islater value is 0
          var retriveApprovalRequestsData = function(ISLaterRequestsData) {

            kony.apps.coe.ess.MVVM.executeDBQuery("MYAPPROVALS", Approval_request_query, function(ISLaterRequestsData, res) {
              //sending the control to the process data
              var resultData = {
                "ISLaterRequestsData": ISLaterRequestsData,
                "ApprovalRequestData": res
              };
              scopeObj.getController().processData(resultData);
            }
                                                  .bind(this, ISLaterRequestsData),
                                                  function(err) {
              kony.print(err);
              handleError(new appException(kony.i18n.getLocalizedString("i18n.ess.frmApprovalHome.errorMessages.fetchApprovalRequest") + JSON.stringify(err)));
            });
          };

          // retriving the Islater requests and the request types

          kony.apps.coe.ess.MVVM.executeDBQuery("MYAPPROVALS", IsLaterRequests_query, function(retriveApprovalRequestsData, res) {
            //sending the control to the process data
            retriveApprovalRequestsData(res);
          }
                                                .bind(this, retriveApprovalRequestsData),
                                                function(err) {
            kony.print("------------ error in the retriving of the islater request");
            handleError(new appException(kony.i18n.getLocalizedString("i18n.ess.frmApprovalHome.errorMessages.fetchIslaterApprovalRequest") + JSON.stringify(err)));
          });

        } else {
          kony.print("error in fetching the value of the employee id ");
          //creating the exception for the employee
          handleError(new appException(kony.i18n.getLocalizedString("i18n.ess.frmApprovalRequestDetail.errorMessages.EmployeeRetival")));
        }
      }
      kony.print("---------End of fetch data in the frmapproval Home controller extension----------");

    } catch (err) {
      kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
      kony.sdk.mvvm.log.error("Error in fetchData of controllerExtension");
      var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_FETCH_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_FETCH_IN_CONTROLLER_EXTENSION, err);
      kony.sdk.mvvm.log.error(exception.toString());
      handleError(new appException(kony.i18n.getLocalizedString("i18n.ess.frmApprovalHome.errorMessages.fetchIslaterApprovalRequest")));
    }

  },
  /**
     * This method processes fetched data. Developer can edit.
     * Default implementation processes the provided data to required format for bind.
     * @param {Object} data - fetched data. (Default : data map, group id as key and records array as value)
     * @memberof frmApprovalHomeControllerExtension#
     * @returns {Object} - processed data
     */
  processData: function(data) {
    try {
      var scopeObj = this;
      //this.$class.$superp.processData.call(this, data);
      var processedData = kony.apps.coe.ess.Approvals.ApprovalsHome.process_data_ForSegement(data.ApprovalRequestData);
      var ISLaterRequestsData = data.ISLaterRequestsData;
      var processedIslaterRequestData = kony.apps.coe.ess.Approvals.ApprovalsHome.process_data_ForISlaterSegment(ISLaterRequestsData);

      var IslaterRequestsCount = 0;
      for (var index in ISLaterRequestsData) {

        IslaterRequestsCount += parseInt(ISLaterRequestsData[index].COUNT);
      }

      var resultData = {
        "ISLaterRequestsData": processedIslaterRequestData,
        "ApprovalRequestData": processedData,
        "IslaterRequestsCount": IslaterRequestsCount
      }
      this.getController().bindData(resultData);
      //return processedData;
    } catch (err) {
      kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
      kony.sdk.mvvm.log.error("Error in processData of controllerExtension");
      var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_PROCESSDATA_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_PROCESSDATA_IN_CONTROLLER_EXTENSION, err);
      kony.sdk.mvvm.log.error(exception.toString());
    };
  },
  /**
     * This method binds the processed data to the form. Developer can edit.
     * Default implementation binds the data to widgets in the form.
     * @param {Object} data - processed data.(Default : data map for each group, widget id as key and widget data as value)
     * @memberof frmApprovalHomeControllerExtension#
     */
  bindData: function(data) {
    try {
      kony.print("---- frmApprovalHome controller extension bind data start ----");
      kony.print("---- data of bindData: " + JSON.stringify(data));
      var formmodel = this.getController().getFormModel();
      formmodel.clear();
      this.getController().getFormModel().formatUI();
      //setting the data to the Islater segment
      var ISLaterRequestsData = data.ISLaterRequestsData;

      //creating filter buttons of all request types
      for (var index in ISLaterRequestsData) {
        var id = "btnFilter" + ISLaterRequestsData[index].ID;
        var request_type = ISLaterRequestsData[index].TYPE;
        if (frmApprovalHome[id]) {
          kony.print(" Already exsisting to the form ");
        } else {
		//this if condition has to be removed for getting timesheets
					if(ISLaterRequestsData[index].NAME == "LEAVE"){
          var lblBasic = {
            "id": id,
            "left": "3%",
            "centerY": "45%",
            "zIndex": 1,
            "width": kony.flex.USE_PREFERED_SIZE,
            "height": "89.7%",
            "isVisible": true,
            "minWidth": "20%",
            "skin": "sknBtn0OFont00000028px",
            "focusSkin": "sknBtn0OBor1pxFFFFFF100O",
            "text": " " + ISLaterRequestsData[index].NAME + " ",
          };
          var btn_filter = new kony.ui.Button(lblBasic, {
            contentAlignment: constants.CONTENT_ALIGN_CENTER
          }, {});
          btn_filter.onClick = kony.apps.coe.ess.Approvals.ApprovalsHome.filterApprovalDetails.bind(this, btn_filter, request_type)
          frmApprovalHome.flxScrlCategory.add(btn_filter);
			}
        }

      }
		// no pending request flex
      frmApprovalHome.flxNoPending.setVisibility(false);
      frmApprovalHome.lblNoRecordsFound.setVisibility(false);
      //elimination of the non-zero islater request types
      var processed_IslaterRequests = [];
      for (var index in ISLaterRequestsData) {
        if (parseInt(ISLaterRequestsData[index].COUNT) > 0) {
          processed_IslaterRequests.push(ISLaterRequestsData[index]);
        }
      }
      //setting the data to the islater segments
      var IslaterWidgetDataMap = {
        "imgApproval": "Image",
        "lblRequesType": "NAME",
        "lblRequestCount": "COUNT",
      }
      frmApprovalHome.segLaterApprovals.widgetDataMap = IslaterWidgetDataMap;
      frmApprovalHome.segLaterApprovals.setData(processed_IslaterRequests);

      if (data.IslaterRequestsCount || data.IslaterRequestsCount == 0) {
        frmApprovalHome.lblLaterCount.text = data.IslaterRequestsCount.toFixed();
      }
      //setting the data to the approval request Segement
      var WidgetDatamap = {
        "lblShortName": "CreatedUserShortName",
        // "imgCategory": "requestTypeImage",
        "lblUserName": "UserName",
        "lblCreateDate": "RequestDate",
        "lblDueDateValue": "dueDate",
        "lblDueDateHeader": "lblDueDateHeader",
        "lblRequestInfo": "RequestInfo",
        "btnAdditionalInfo": "AdditionalData",
        "flxTimer": "FlxTimerUi",
        "lblCategory": "category",
        //"flxBorder1": "requestTypeBorderSkin",
        // "flxBorder2": "requestTypeBorderSkin2",
        //"imgLeaveInfo": "requestTypeInfoImage",
        "lblRemainingHours": "remaingHours",
        "lblDelegated": "Delegated",
        "imgUser": "imgUser",
        "flxApprovalRequest": "flxApprovalRequest",
        "flxUserImg": "flxUserImg",
        "flxBorder1": "flxBorder1",
        "flxBorder2": "flxBorder2",
        "lblBorder1": "lblBorder1",
        "lblBorder2": "lblBorder2",
        "btnLaterSegment" : "btnLaterSegment",
        "btnReject" : "btnReject",
        "btnApprove" : "btnApprove",
      	"btnNoticed" : "btnNoticed"
      };
      if (kony.apps.coe.ess.globalVariables.isSPA === true) {
        WidgetDatamap.btnLaterSegment = "btnLaterSegment";
        WidgetDatamap.btnReject = "btnReject";
        WidgetDatamap.btnApprove = "btnApprove";
      }
      frmApprovalHome.segApprovalsList.widgetDataMap = WidgetDatamap;
      frmApprovalHome.segApprovalsList.setData(data.ApprovalRequestData);
      kony.print("---- after setting data to form");
      // Start Lazy loading for the approvals list Segment
      //kony.apps.coe.ess.Approvals.ApprovalsHome.lazyLoading();
      //Making label count
      var nowCount = 0;
      var laterCount = 0;
      var totalCount = 0;
      if (data.ApprovalRequestData && data.ApprovalRequestData.length) {
        nowCount = data.ApprovalRequestData.length.toFixed();
      }
      if (data.IslaterRequestsCount || data.IslaterRequestsCount === 0) {
        laterCount = data.IslaterRequestsCount.toFixed();
      }
      totalCount = parseFloat(nowCount) + parseFloat(laterCount);
      if(totalCount > 0){
        frmApprovalHome.lblNowCount.text = data.ApprovalRequestData.length.toFixed();
        flxNavigateFooter.lblNowCount.text = totalCount.toFixed();
        frmApprovalHome.lblNotificationsCount.text = data.ApprovalRequestData.length.toFixed();
      }else{
        frmApprovalHome.lblNowCount.text = "0";
        flxNavigateFooter.lblNowCount.text = "0";
        frmApprovalHome.lblNotificationsCount.text = "0";
        frmApprovalHome.flxNoPending.setVisibility(true);
        if(frmApprovalHome.flxFiter.isVisible === true){
      		frmApprovalHome.lblNoRecordsFound.setVisibility(true);
          frmApprovalHome.flxNoPending.setVisibility(false);
      	}
      }
      /*if (data.ApprovalRequestData && data.ApprovalRequestData.length) {
        frmApprovalHome.lblNowCount.text = data.ApprovalRequestData.length.toFixed();
        flxNavigateFooter.lblNowCount.text = data.ApprovalRequestData.length.toFixed();
        frmApprovalHome.lblNotificationsCount.text = data.ApprovalRequestData.length.toFixed();
      } else {
        frmApprovalHome.lblNowCount.text = "0";
        flxNavigateFooter.lblNowCount.text = "0";
        frmApprovalHome.lblNotificationsCount.text = "0";
      }*/
      //kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
      kony.print("---- before showing form ----");
      this.getController().showForm();
      kony.application.dismissLoadingScreen();
      //frmApprovalHome.show();
      if (kony.apps.coe.ess.Sync.syncOnLandingForm) {
        kony.apps.coe.ess.Sync.syncOnLandingForm = false;
        kony.apps.coe.ess.Sync.syncAsynchronously();
      }
      kony.print("---- frmApprovalHome controller extension bind data end ----");
    } catch (err) {
      kony.print("---- frmApprovalHome controller extension bind data error: " + JSON.stringify(err));
      handleError(new appException(kony.i18n.getLocalizedString("i18n.ess.frmApprovalApprovalHome.errorMessages.BindingData")));
      kony.sdk.mvvm.KonyApplicationContext.dismissLoadingScreen();
      kony.sdk.mvvm.log.error("Error in bindData of controllerExtension");
      var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_BINDDATA_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_BINDDATA_IN_CONTROLLER_EXTENSION, err);
      kony.sdk.mvvm.log.error(exception.toString());
    }

  },
  /**
     * This method is entry point for save flow. Developer can edit.
     * Default implementation saves the entity record from the data of widgets defined in form config
     * @memberof frmApprovalHomeControllerExtension#
     */
  saveData: function() {
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
     * @memberof frmApprovalHomeControllerExtension#
     */
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
  /**
     * This method shows form.
     * @memberof frmApprovalHomeControllerExtension#
     */
  showForm: function() {
    try {
      var formmodel = this.getController().getFormModel();
      formmodel.showView();
    } catch (e) {
      var exception = this.getController().getApplicationContext().getFactorySharedInstance().createExceptionObject(kony.sdk.mvvm.ExceptionCode.CD_ERROR_SHOWFORM_IN_CONTROLLER_EXTENSION, kony.sdk.mvvm.ExceptionCode.MSG_ERROR_SHOWFORM_IN_CONTROLLER_EXTENSION, err);
      kony.sdk.mvvm.log.error(exception.toString());
    }
  }
});
