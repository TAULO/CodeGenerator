/*
 *   productUpdatesTaskController.js
 *
 *   Copyright (c) 2017 HEB
 *   All rights reserved.
 *
 *   This software is the confidential and proprietary information
 *   of HEB.
 */
'use strict';
/**
 * Component of eCommerce task summary. Used to fetch and display list of eCommerce task only. This component does not
 * show details of any particular task.
 *
 * @author vn40486
 * @since 2.16.0
 */
(function () {
	angular.module('productMaintenanceUiApp').controller('ProductUpdatesController',productUpdatesController);
	productUpdatesController.$inject = ['$rootScope', '$scope','ProductUpdatesTaskApi', 'ngTableParams', '$stateParams', 'ImageApi',
		'DownloadService', 'urlBase', 'ProductSearchService', '$state', 'appConstants','productGroupApi', 'ECommerceViewApi',
		'ProductSearchApi', '$filter', '$timeout', 'DownloadImageService'];
	function productUpdatesController($rootScope, $scope, productUpdatesTaskApi, ngTableParams, $stateParams, imageApi,
			downloadService, urlBase, productSearchService, $state, appConstants,productGroupApi, eCommerceViewApi,
			productSearchApi, $filter, $timeout, downloadImageService) {
		var self = this;
		/**
		 * Denotes whether back end should fetch total counts or not. Accordingly server side will decide on executing
		 * additional logic to fetch count information.
		 *
		 * @type {boolean}
		 */
		self.includeCounts = false;

		/**
		 * The number of rows per page constant.
		 * @type {int}
		 */
		self.DEFAULT_PAGE_SIZE = 25;
		/**
		 * The number of rows per page constant when navigate to Home page.
		 * @type {int}
		 */
		self.NAVIGATE_PAGE_SIZE = 100;

		/**
		 * Tracks whether or not the user is waiting for a download.
		 *
		 * @type {boolean}
		 */
		self.downloading = false;

		/**
		 * Max time to wait for excel download.
		 *
		 * @type {number}
		 */
		self.WAIT_TIME = 1200;

		/**
		 * The total number of records in the report.
		 * @type {int}
		 */
		self.totalRecordCount = null;

		/**
		 * The parameters passed to the application from ng-tables getData method. These need to be stored
		 * until all the data are fetched from the backend.
		 *
		 * @type {null}
		 */

		self.dataResolvingParams = null;
		/**
		 * The promise given to the ng-tables getData method. It should be called after data is fetched.
		 *
		 * @type {null}
		 */
		self.defer = null;

		/**
		 * The data being shown in the report.
		 * @type {Array}
		 */
		$scope.data = null;

		/**
		 * The message to display about the number of records viewing and total (eg. Result 1-100 of 130).
		 * @type {String}
		 */
		self.resultMessage = null;

		/**
		 * maintains state of data call.
		 * @type {boolean}
		 */
		self.firstFetch = true;

		/**
		 * Represents the currently selected work request referenced task.
		 * @type {null}
		 */
		self.selectedWorkRequest = null;

		/**
		 * Map of task type and description.
		 * @type {{MYTSK: string}}
		 */
		self.alertTypes = [
			{code:'PRUPD', desc:'Product Updates'},
			{code:'PRRVW', desc:'Product Review'},
			{code:'NWPRD', desc:'New Products'}
		];

		/**
		 * default alert type to be used on initial page loading.
		 * @type {{code: string, desc: string}}
		 */
		const DEFAULT_ALERT_TYPE = {code:'PRUPD', desc:'Product Updates'};
		/**
		 * Presently selected alert type.
		 * @type {{code: string, desc: string}}
		 */
		self.alertType = DEFAULT_ALERT_TYPE;

		/**
		 * Code table of update reasons filter option.
		 * @type {[*]}
		 */
		self.updateReasons = [
			{code:'1664', desc:'Display name', checked: true},
			{code:'1666', desc:'Romance copy', checked: true},
			{code:'1667', desc:'Size', checked: true},
			{code:'1784', desc:'Dimensions', checked: true},
			{code:'1672', desc:'Brand', checked: true},
			{code:'1674', desc:'Ingredients', checked: true},
			{code:'1676', desc:'Directions', checked: true},
			{code:'1677', desc:'Warnings', checked: true},
			{code:'1679', desc:'Nutrition', checked: true},
			{code:'1678', desc:'Image Update', checked: true},
			{code:'1727', desc:'Primary UPC Update', checked: true}
		];
		/**
		 * Currently displayed update reasons.
		 * @type {*}
		 */
		self.displayUpdateReasons = angular.copy(self.updateReasons);

		/**
		 * Keeps track of user selected update reason.
		 * @type {*}
		 */
		self.selectedUpdateReasons = angular.copy(self.updateReasons);

		/**
		 * Code table of show on site filter option.
		 * @type {[*]}
		 */
		self.showOnSiteOptions = [
			{code:'Y', desc:'Yes', checked: true},
			{code:'N', desc:'No', checked: true}
		];

		/**
		 * Currently displayed show on site user selection.
		 * @type {*}
		 */
		self.displayShowOnSiteOptions = angular.copy(self.showOnSiteOptions);

		/**
		 * Keeps track of user's show on site selection.
		 * @type {*}
		 */
		self.selectedShowOnSiteOptions = angular.copy(self.showOnSiteOptions);

		/**
		 * Hierarchy context code for eCommerce
		 * @type {string}
		 */
		self.hierarchyContextCode = 'CUST';

		/**
		 * Logical attribute id of PDP template.
		 * @type {number}
		 */
		const LOGICAL_ATTR_PDP_TEMPLATE = 515;

		/**
		 * Sales channel of HEB.Com
		 * @type {string}
		 */
		const SALES_CHANNEL_HEB_COM = '01';

		/**
		 * Action to process on batch
		 * 		1: save data after mass fill
		 * 		2: assign product to BDM
		 * 	    3: assign product to eBM
		 * 	    4: publish product
		 * 	    5: delete alerts
		 * @type {number}
		 */
		const ACTION_TYPE_SAVE = 1;
		const ACTION_TYPE_ASSIGN_BDM = 2;
		const ACTION_TYPE_ASSIGN_eBM = 3;
		const ACTION_TYPE_PUBLISH = 4;
		const ACTION_TYPE_DELETE_ALERT = 5;

		/**
		 * No image url constant.
		 * @type {string}
		 */
		self.NO_IMAGE_URL = 'images/no_image.png';

		/**
		 * Represents the supported imaged response data uri's mime and charset part. The <img> tags data uri
		 * representation generally looks like "data:[<mime type>][;charset=<charset>][;base64],<encoded data>". The
		 * "<ecoded data>" part represents the binary data expected from the server.
		 * @type {string}
		 */
		const RESP_IMAGE_DATA_TYPE = 'data:image/png;base64,';

		/**
		 * Thumbnail Image height constant.
		 * @type {number}
		 */
		const IMAGE_THUMBNAIL_HEIGHT = 40;

		/**
		 * Thumbnail Image width constant.
		 * @type {number}
		 */
		const IMAGE_THUMBNAIL_WIDTH = 40;
		/**
		 *	alert id field
		 * @type {string}
		 */
		const ALERT_ID='alertID';

		self.CONFIRM_SELECTED_PRODUCT_TITLE = 'Task Message';
		self.CONFIRM_SELECTED_PRODUCT_MESSAGE = 'Please select at least one Product to Mass Fill';
		self.CONFIRM_CHECK_STATUS_TITLE = 'Mass Update Message';

		/**
		 * Search criteria used during Add Products to Task.
		 */
		self.searchCriteria;

		/**
		 * Keeps track of selected selected products/Rows.
		 * @type {Array}
		 */
		self.selectedAlerts = [];

		/**
		 * Keeps track of excluded products/Rows when "Select All" is checked.
		 * @type {Array}
		 */
		self.excludedAlerts = [];
		/**
		 * Represents state of Select-All check box.
		 */
		self.allAlerts = false;

		/**
		 * Defaul user. Load all user's data.
		 * @type {{uid: string, fullName: string}}
		 */
		self.defaultUser = {uid:'',fullName:'All'};

		/**
		 * Currently logged in user.
		 * @type {{uid, fullName}}
		 */
		self.currentUser = {uid:$rootScope.currentUser.id, fullName: $rootScope.currentUser.name};

		/**
		 * Currently selected user/assignee initialized with the logged in user name.
		 * @type {{uid, fullName}}
		 */
		self.assignedTo = self.defaultUser;

		/**
		 * List of assignee of products in the displayed task.
		 * @type {Array}
		 */
		self.assignedToUsers = [];

		/**
		 * Represents the task edit status.
		 * @type {boolean}
		 */
		self.isEditingTask =false;
		/**
		 * Search type product for ecommerce view
		 * @type {String}
		 */
		const SEARCH_TYPE = "basicSearch";
		/**
		 * Selection type product for ecommerce view
		 * @type {String}
		 */
		const SELECTION_TYPE = "Product ID";
		/**
		 * Ecommerce view tab
		 * @type {String}
		 */
		const ECOMMERCE_VIEW_TAB = 'ecommerceViewTab';

		/**
		 * Currently selected image.
		 * @type {ProductScanImageURI}
		 */
		self.selectedImage = '';

		/**
		 * image downloading status.
		 * @type {boolean}
		 */
		self.isImageDownloading = false;

		/**
		 * The saleschannel.
		 * @type {Object}
		 */
		self.salesChannel;
		/**
		 * The list of channels.
		 * @type {Array}
		 */
		self.salesChannels=[];
		/**
		 * The pdf templates.
		 * @type {Object}
		 */
		self.pdpTemplate;
		/**
		 * The list of pdf templates.
		 * @type {Array}
		 */
		self.pdpTemplates = [];
		/**
		 * The list of fulfillmentProgram selected.
		 * @type {Array}
		 */
		self.fulfillmentProgramsSelected = [];
		/**
		 * List of FulfillmentPrograms of one channel.
		 * @type {Array}
		 */
		self.fulfillmentPrograms=[];
		/**
		 * Holds the list of FulfillmentPrograms of all channels.
		 * @type {Array}
		 */
		self.allFulfillmentPrograms=[];
		/**
		 * The showOnsite.
		 * @type {Object}
		 */
		self.showOnSite;
		/**
		 * The showOnsite select.
		 * @type {Array}
		 */
		self.showOnSiteSelect;
		/**
		 * The tomorrow date.
		 * @type {Object}
		 */
		self.tomorrow;
		/**
		 * Options for datepicker
		 */
		self.options = {
			minDate: new Date(),
			maxDate: new Date("12/31/9999")
		};
		/**
		 * The effectiveDate.
		 * @type {Object}
		 */
		self.effectiveDate;
		/**
		 * The expirationDate.
		 * @type {Object}
		 */
		self.expirationDate;
		/**
		 * Flag for show on site start date open date picker
		 * @type {boolean}
		 */
		self.showOnSiteStartDateOpen = false;
		/**
		 * Flag for show on site end date open date picker
		 * @type {boolean}
		 */
		self.showOnSiteEndDateOpen = false;
		/**
		 * The object default select.
		 */
		self.objectSelectTemp = {
			id : null,
			description : "--Select--"
		};
		/**
		 * Setting for dropdown multiple select
		 */
		$scope.dropdownMultiselectSettings = {
			showCheckAll: false,
			showUncheckAll: false,
			smartButtonMaxItems: 1,
			scrollableHeight: '250px',
			scrollable: true,
			checkBoxes: true
		};
		self.dataChanged = [];
		/**
		 * Constant.
		 */
		const SPACE_STRING = ' ';
		/**
		 * Mass fill data default cached on javascript.
		 * @type {{isSelectAll: boolean, alertType: string, effectiveDate: string, expirationDate: string, assigneeId: string, attributes: Array, showOnSiteFilter: string, lstFulfillmentChannel: Array}}
		 */
		self.massFillInfoCachedDefault = {
			isSelectAll:false,
			alertType: '',
			effectiveDate:'',
			expirationDate:'',
			assigneeId: '',
			attributes: [],
			showOnSiteFilter: '',
			lstFulfillmentChannel:[]
		};
		/**
		 * Mass fill data cached to save
		 * @type {{isSelectAll: boolean, alertType: string, effectiveDate: string, expirationDate: string, assigneeId: string, attributes: Array, showOnSiteFilter: string, lstFulfillmentChannel: Array, excludedAlerts: Array}}
		 */
		self.massFillInfoCached = {
			isSelectAll:false,
			alertType: '',
			effectiveDate:'',
			expirationDate:'',
			assigneeId: '',
			attributes: [],
			showOnSiteFilter: '',
			lstFulfillmentChannel:[],
			excludedAlerts:[]
		};
		/**
		 * Mass fill data cached when select all
		 * @type {{isSelectAll: boolean, alertType: string, effectiveDate: string, expirationDate: string, assigneeId: string, attributes: Array, showOnSiteFilter: string, lstFulfillmentChannel: Array, excludedAlerts: Array}}
		 */
		self.massFillInfoCachedSelectAll = {
			isSelectAll:false,
			alertType: '',
			effectiveDate:'',
			expirationDate:'',
			assigneeId: '',
			attributes: [],
			showOnSiteFilter: '',
			lstFulfillmentChannel:[],
			excludedAlerts:[]
		};
		/**
		 * Reset data
		 */
		self.resetData = function(){
			self.massFillInfoCachedSelectAll = angular.copy(self.massFillInfoCachedDefault);
			self.massFillInfoCached = angular.copy(self.massFillInfoCachedDefault);
			self.selectedAlerts = [];
			self.fulfillmentProgramsSelected=[];
			self.dataChanged=[];
			self.allAlerts = false;
			self.salesChannel=null;
			self.pdpTemplate=null;
			self.excludedAlerts=[];
		};
		/**
		 * Init function called during loading of this controller.
		 */
		self.init = function () {
			self.getDataForMassFill();
			self.tableParams = self.buildTable();
			self.fetchProductsAssignee(self.alertType.code);
			self.tomorrow = new Date();
			self.tomorrow.setDate(new Date().getDate() + 1);
		};

		/**
		 * Constructs the ng-table based data table.
		 */
		self.buildTable = function () {
			return new ngTableParams(
				{
					page: 1,
					count: self.DEFAULT_PAGE_SIZE
				}, {
					counts: [25,50,100],
					getData: function ($defer, params) {
						self.isWaiting = true;
						self.isNoRecordsFound = false;
						self.defer = $defer;
						self.dataResolvingParams = params;
						self.includeCounts = false;
						if (self.firstFetch) {
							self.includeCounts = true;
						}
						self.getTaskDetail(params.page() - 1);
					}
				}
			)
		};

		/**
		 * Fetches details of the task displayed on screen from database with pagination.
		 * @param page  selected page number.
		 */
		self.getTaskDetail = function(page) {
			///self.clearMessage();
			self.massFillInfoCachedSelectAll = {
				alertType: self.alertType.code,
				assigneeId: self.assignedTo.uid,
				attributes: self.getSelectedUpdateReasonsAttrs(),
				showOnSiteFilter: self.getSelectedShowOnSite()
			};
			self.massFillInfoCached = {
				alertType: self.alertType.code,
				assigneeId: self.assignedTo.uid,
				attributes: self.getSelectedUpdateReasonsAttrs(),
				showOnSiteFilter: self.getSelectedShowOnSite()
			};
			productUpdatesTaskApi.getProducts(
				{
					alertType: self.alertType.code,
					assignee: self.assignedTo.uid,
					includeCounts: self.includeCounts,
					attributes: self.getSelectedUpdateReasonsAttrs(),
					showOnSite: self.getSelectedShowOnSite(),
					page : page,
					pageSize : self.tableParams.count()
				},
				self.loadData,self.handleError);
		};

		/**
		 * Callback for a successful call to get data from the backend.
		 *
		 * @param results The data returned by the backend.
		 */
		self.loadData = function (results) {
			// If this was the fist page, it includes record count and total pages.
			if (results.complete) {
				self.totalRecordCount = results.recordCount;
				self.dataResolvingParams.total(self.totalRecordCount);
				self.firstFetch = false;
			}
			self.resultMessage = self.getResultMessage(results.data.length, self.tableParams.page() -1);
			self.renderUserSelection(results.data, self.allAlerts, self.selectedAlerts, self.excludedAlerts);
			$scope.data = results.data;
			self.bindingDataCached();
			self.defer.resolve(results.data);
			if (results.data && results.data.length === 0) {
				self.isNoRecordsFound = true;
			}

			self.isWaiting = false;
			self.fetchProductImages(results.data);


		};
		/**
		 * Binding data on cached when change page
		 */
		self.bindingDataCached = function(){
			_.forEach(self.dataChanged, function(itemCached){
				var indexAlert=_.findIndex($scope.data, function(item){	return itemCached.alertID==item.alertID;});
				$scope.data[indexAlert]=itemCached;
			});

			if(self.massFillInfoCached.isSelectAll){
				self.doMassFill();
			}
		};
		/**
		 * Check change data
		 * @returns {boolean}
		 */
		self.checkChangeData = function(){
			var isChange=false;
			$scope.data.forEach(function(item){
				if(item.isChange){
					isChange=true;
					return;
				}
			});
			if(!isChange && self.dataChanged.length>0){
				isChange=true;
			}
			return isChange;
		};
		/**
		 * Used to reload table data.
		 */
		self.refreshTable = function (page, clearMsg) {
			if(self.checkChangeData()){
				$('#confirmLossChangeModal').modal("show");
			}else{
				self.forceReloadData(page, clearMsg);
			}
		};
		/**
		 * Force reload data
		 * @param page
		 * @param clearMsg
		 */
		self.forceReloadData = function(page, clearMsg){
			self.resetData();
			if(clearMsg) {self.clearMessage();}
			self.firstFetch = true;
			self.resetWorkRequestsSelection(true);
			self.tableParams.page(page);
			self.tableParams.reload();
			self.salesChannel = angular.copy(self.objectSelectTemp);
			self.pdpTemplate = angular.copy(self.objectSelectTemp);
			self.showOnSite = angular.copy(self.objectSelectTemp);
			self.fulfillmentProgramsSelected = [];
			self.effectiveDate = null;
			self.expirationDate  = null;
			self.isErrorMassFillData = false;
			self.isErrorRequireMess = null;
			self.errorMassFillDataLst = [];
		};
		/**
		 * When click open date picker for anther attribute, store current status for date picker.
		 */
		self.openDatePicker = function (fieldName) {
			switch (fieldName) {
				case "showOnSiteStartDate":
					self.showOnSiteStartDateOpen = true;
					break;
				case "showOnSiteEndDate":
					self.showOnSiteEndDateOpen = true;
					break;
				default:
					break;
			}
			self.options = {
				minDate: new Date(),
				maxDate: new Date("12/31/9999")
			};
		};
		/**
		 * Return of back end after a user removes an alert. Based on the size of totalRecordCount,
		 * this method will either:
		 * 	--reset view to initial state
		 * 	--re-issue call to back end to update information displayed
		 *
		 * @param results Results from back end.
		 */
		self.handleSuccess = function(resp){
			self.refreshTable(1, false);
			self.displayMessage(resp.data.message, false);
		};

		/**
		 * Callback that will respond to errors sent from the backend.
		 *
		 * @param error The object with error information.
		 */
		self.handleError = function(error){
			if (error && error.data && error.data.message) {
				self.displayMessage(error.data.message, true);
			} else if(error) {
				self.displayMessage(error.data, true);
			} else {
				self.displayMessage("An unknown error occurred.", true);
			}
			self.isWaiting = false;
		};

		/**
		 * Generates the message that shows how many records and pages there are and what page the user is currently
		 * on.
		 *
		 * @param dataLength The number of records there are.
		 * @param currentPage The current page showing.
		 * @returns {string} The message.
		 */
		self.getResultMessage = function(dataLength, currentPage){
			return "" + (self.tableParams.count() * currentPage + 1) +
				" - " + (self.tableParams.count() * currentPage + dataLength) + "  of  " +
				self.totalRecordCount.toLocaleString();
		};

		/**
		 * Used to reload table data.
		 */
		self.reloadTable = function (page, clearMsg) {
			if(clearMsg) {self.clearMessage();}
			self.firstFetch = true;
			self.tableParams.page(page);
			self.tableParams.reload();
		};

		/**
		 * Used to display any success of failure messages above the data table.
		 * @param message message to be displayed.
		 * @param isError is error or not; True - message displayed in red. False- message get displayed in blue.
		 */
		self.displayMessage = function(message, isError) {
			self.isError = isError;
			self.message = message;
		};

		/**
		 * Used to clear any success/failure message displayed as result of last action by the user.
		 */
		self.clearMessage = function() {
			self.isError = false;
			self.message = '';
		};

		/**
		 * Used to display fulfillment Channel description as a comma separated values.
		 * @param productFullfilmentChanels
		 * @returns {string}
		 */
		self.displayFulfilmentChannels = function(productFullfilmentChanels) {
			var fulfillmentChannelNames = [];
			_.forEach(productFullfilmentChanels, function (o) {
				fulfillmentChannelNames.push(SPACE_STRING + o.fulfillmentChannel.description.trim());
			});
			if(fulfillmentChannelNames.length >0){
				if(productFullfilmentChanels[0].hasMassFill){
					return productFullfilmentChanels[0].fulfillmentChannel.salesChannel.description.trim() + " - " + fulfillmentChannelNames.join();
				}
			}
			return fulfillmentChannelNames.join();
		};

		/**
		 * Used to pull out PDP attribute info out of all the attribute information of a particular product.
		 * @param masterDataExtensionAttributes
		 * @returns {string}
		 */
		self.displayPDPTemplate = function (masterDataExtensionAttributes) {
			return _.pluck(_.filter(masterDataExtensionAttributes,
				{key :{'attributeId': LOGICAL_ATTR_PDP_TEMPLATE}}), 'attributeValueText').join();
		};

		/**
		 * Used to pull out PDP attribute info out of all the attribute information of a particular product.
		 * @param masterDataExtensionAttributes
		 * @returns {string}
		 */
		self.displayUpdateReasonAttributes = function (attributesCSV) {
			var name = [];
			if(attributesCSV) {
				var attributesArray = attributesCSV.split(',');
				_.forEach(attributesArray, function (attr) {
					var reason = _.find(self.updateReasons, function(o) { return o.code == parseInt(attr, 10);});
					if(reason) {
						var index = _.findIndex(name, function(o) { return o == reason.desc;});
						if (!(index >= 0)) {name.push(reason.desc);}
					}
				});
			}
			return name.join();
		};

		/**
		 * Used to show the status of show on site based on the show on site data for HEB.Com. It is assumed the default
		 * sales channel for Ecommerce Task screen is HEB.com
		 * @param productOnlines
		 * @returns {*}
		 */
		self.displayShowOnSite = function (productOnlines) {
			return _.pluck(_.filter(productOnlines,
				{key :{'saleChannelCode': SALES_CHANNEL_HEB_COM}}), 'showOnSiteByExpirationDate')[0];
		};

		/**
		 * Used to fetch primary image of product referenced by the work request.
		 * @param workRequests
		 */
		self.fetchProductImages = function (workRequests) {
			if (workRequests) {
				_.forEach(workRequests, function (wrkRqst) {
					if(wrkRqst.productMaster){
						self.fetchProductImage(wrkRqst.productMaster);
					}
				});
			}
		};

		/**
		 * Used to fetch primary image of product referenced by the Product Master.
		 * @param productMaster
		 */
		self.fetchProductImage = function (productMaster) {
			if(productMaster) {
				imageApi.getPrimaryImageByProductId(
					{
						productId : productMaster.prodId,
						salesChannelCode : SALES_CHANNEL_HEB_COM,
						width: IMAGE_THUMBNAIL_WIDTH,
						height: IMAGE_THUMBNAIL_HEIGHT
					},
					function(result) {
						if(result.data && result.data.image && result.data.image.length>0) {
							productMaster.image =  RESP_IMAGE_DATA_TYPE+result.data.image;
						} else {
							productMaster.image = self.NO_IMAGE_URL;
						}
					},
					function(error) {
						productMaster.image = self.NO_IMAGE_URL;
					}
				);
			}
		};

		/**
		 * called by product-search-criteria when search button pressed
		 * @param searchCriteria
		 */
		self.updateSearchCriteria = function(searchCriteria) {
			self.searchCriteria = searchCriteria;
		};

		/**
		 * Resets all previous row selections when "Select All" is checked/unchecked.
		 */
		self.resetWorkRequestsSelection = function(includeSelectAll) {
			if (includeSelectAll) {
				self.allAlerts = false;
			}
			if(self.allAlerts){
				_.forEach( $scope.data, function(item){
					item.checked = true;
				})
				self.selectedAlerts = $scope.data;
			}else{
				_.forEach( $scope.data, function(item){
					item.checked = false;
				})
				self.selectedAlerts = [];
			}
			self.excludedAlerts = [];
		};

		/**
		 * Keeps track of row selection and exclusions in consideration to the state of "Select All" option.
		 *
		 * @param alertChecked selected row state. True/False.
		 * @param alert	data (Alert) object of the row that was modified.
		 */
		self.toggleProductSelection = function(alert) {
			if (self.allAlerts) {//checking if "Select All" is checked?
				!alert.checked ? self.excludedAlerts.push(alert)
					: _.remove(self.excludedAlerts, function(o) {
					return o.alertID == alert.alertID;
				});
			} else {
				alert.checked ? self.selectedAlerts.push(alert)
					: _.remove(self.selectedAlerts, function(o) {
					return o.alertID == alert.alertID;
				});
			}
		};

		/**
		 * Used to send selected products to back end to be deleted. If select-all is chosen, then it displays the
		 * remove-all confirmation modal for user to confirm his action, otherwise it just proceeds with sending the
		 * selected products and tracking id (task id) to the backend service for removal from the task.
		 */
		self.removeProducts = function(){
			self.clearMessage();
			if (self.allAlerts) {
				$('#removeAllProductsModal').modal("show");
			} else {
				var data = {trackingId: self.task.alertKey.trim(), productIds: self.getProducts(self.selectedAlerts)};
				productUpdatesTaskApi.removeProducts(data,self.handleSuccess,self.handleError);
			}
		};

		/**
		 * Handles removing all the products from the task. The backend service implementaion for this is a Batch handling,
		 * hence this method's service callback does not wait for all products to be removed and so simply confirms on
		 * successful submit of the batch.
		 */
		self.removeAllProducts = function() {
			var data = {trackingId : self.task.alertKey.trim(), productIds : self.getProducts(self.excludedAlerts)};
			productUpdatesTaskApi.removeAllProducts(data,self.handleSuccess,self.handleError);
		};

		/**
		 * Utility function - used to collect product-ids from the given work requests.
		 * @param workRqstArr array of work requests.
		 * @returns {Array} array of product Ids.
		 */
		self.getProducts = function(workRqstArr) {
			var productIds = [];
			_.forEach(workRqstArr, function (o) {
				productIds.push(o.productId);
			});
			return productIds;
		};

		/**
		 * Used to maintain the state of previous row selections by the user. Checks/Unchecks rows during data-loading (as
		 * result of refresh or pagination).
		 *
		 * @param workRqstDataArr		new list of data fetched from backend.
		 * @param allWorkRqstChecked 	is select all checked; true/false.
		 * @param selectedAlerts 		list of selected work requests/products.
		 * @param excludedWorkRqst 		list of excluded work requests/products.
		 */
		self.renderUserSelection = function(alertsDataArr, allAlertsChecked, selectedAlerts, excludedAlerts) {
			if (allAlertsChecked) {
				_.forEach(alertsDataArr, function (alert) {
					var index = _.findIndex(excludedAlerts, function(o) { return o.alertID == alert.alertID;});
					alert.checked = !(index > -1);
				});
			} else {
				_.forEach(alertsDataArr, function (alert) {
					var index = _.findIndex(selectedAlerts, function(o) { return o.alertID == alert.alertID;});
					alert.checked = index > -1;
				});
			}
		};

		/**
		 * Fetch list of users to whom the products in the task has been assgined to.
		 * @param task
		 */
		self.fetchProductsAssignee = function(alertType) {
			productUpdatesTaskApi.getProductsAssignee(
				{alertType : alertType},
				function(result) {
					self.assignedToUsers = result;
				},
				self.handleError
			);
		};

		/**
		 * Handle change to assignee from the drop down. On change of user, this function sets the selected assignee
		 * and kick starts refresh of the table with newly changed assingee name.
		 * @param user selected user/assignee.
		 */
		self.toggleAssignee = function(user) {
			self.assignedTo = user;
			self.refreshTable(1, true);
		};

		/**
		 * Handle change to alert type from the drop down. On change of type, this function sets the selected alert type
		 * and kick starts refresh of the table with newly changed alert type.
		 * @param user selected alert type.
		 */
		self.toggleAlertType = function(alertType) {
			self.alertType = alertType;
			self.presetTaskSearchCondition();
			self.fetchProductsAssignee(alertType.code);
			self.refreshTable(1, true);
		};
		/**
		 * Preset task search condition
		 */
		self.presetTaskSearchCondition = function () {
			self.assignedTo = self.defaultUser;
			self.resetFilterUpdateReason();
		};

		/**
		 * Handles loading the currently logged in user's task information(products).
		 */
		self.loadMyTask = function () {
			self.toggleAssignee(self.currentUser);
		};

		/**
		 * Handles applying filter change for update reason. Eventually tiggeres reloading of data table based on user selection.
		 */
		self.applyFilterUpdateReason = function() {
			self.selectedUpdateReasons = angular.copy(self.displayUpdateReasons);
			var selectedAttrs = _.pluck(_.filter(self.selectedUpdateReasons, function(o){ return o.checked == true;}),'code');
			if(selectedAttrs.length > 0){
				self.refreshTable(1, true);
				$('#updateReasonFilter').removeClass("open");
			}else {
				self.isError = true;
				self.message = "Please select at least one Update Reason.";
			}
		};

		/**
		 * Resets update reason selections to initial state.
		 */
		self.resetFilterUpdateReason = function() {
			self.displayUpdateReasons = angular.copy(self.updateReasons);
			self.selectedUpdateReasons = angular.copy(self.updateReasons);
		};

		/**
		 * Cancels users selection. Changes displayed options state to previously saved state.
		 */
		self.cancelFilterUpdateReason = function() {
			self.displayUpdateReasons = angular.copy(self.selectedUpdateReasons);
			$('#updateReasonFilter').removeClass("open");
		};

		/**
		 * Used to build list of attributes code/numbers based on the user selection. If user havent made any selection,
		 * it returns null instead of sending all the default-selected attributes code. This is done to save query fetch performance.
		 */
		self.getSelectedUpdateReasonsAttrs = function() {
			if(self.alertType.code == 'PRUPD'){//Update reason applies only to the PRUPD alert type.
				var selectedAttrs = _.pluck(_.filter(self.selectedUpdateReasons, function(o){ return o.checked == true;}),'code');
				return (selectedAttrs.length != self.updateReasons.length) ? selectedAttrs.join() : null;
			}
			return null;
		};

		/**
		 * Handles applying filter change for update reason. Eventually tiggeres reloading of data table based on user selection.
		 */
		self.applyFilterShowOnSite = function() {
			self.selectedShowOnSiteOptions = angular.copy(self.displayShowOnSiteOptions);
			var optionsSelected = _.pluck(_.filter(self.selectedShowOnSiteOptions, function(o){ return o.checked == true;}),'code');
			if(optionsSelected.length > 0){
				self.refreshTable(1, true);
				$('#showOnSiteFilter').removeClass("open");
			} else {
				self.isError = true;
				self.message = "Please select at least one Show On Site.";
			}
		};

		/**
		 * Resets show on site selections to initial state.
		 */
		self.resetFilterShowOnSite = function() {
			self.displayShowOnSiteOptions = angular.copy(self.showOnSiteOptions);
			self.selectedShowOnSiteOptions = angular.copy(self.showOnSiteOptions);
		};

		/**
		 * Cancels users selection. Changes displayed options state to previously saved state.
		 */
		self.cancelFilterShowOnSite = function() {
			self.displayShowOnSiteOptions = angular.copy(self.selectedShowOnSiteOptions);
			$('#showOnSiteFilter').removeClass("open");
		};

		/**
		 * Used to show on site status of Y/N based on user selection. Returns null if both options are selected or
		 * unselected, meaning to fetch all records.
		 * @returns {null}
		 */
		self.getSelectedShowOnSite = function() {
			var optionsSelected = _.pluck(_.filter(self.selectedShowOnSiteOptions, function(o){ return o.checked == true;}),'code');
			return (optionsSelected.length == 1) ? optionsSelected[0] : null;
		};

		/**
		 * Called from child component productCustomHierarchyAssignment when the assignment changes are saved
		 */
		self.updateAssignment = function() {
			self.refreshTable();
		};

		/**
		 * Initiates a download of all the records.
		 */
		self.export = function() {
			var encodedUri = self.generateExportUrl();
			if(encodedUri !== self.EMPTY_STRING) {
				self.downloading = true;
				downloadService.export(encodedUri, 'productUpdates.csv', self.WAIT_TIME,
					function () {
						self.downloading = false;
					});
			}
		};

		/**
		 * Generates the URL to ask for the export.
		 *
		 * @returns {string} The URL to ask for the export.
		 */
		self.generateExportUrl = function() {
			var attributes = self.getSelectedUpdateReasonsAttrs();
			if (attributes === null) {
				attributes = '';
			}

			var showOnSite = self.getSelectedShowOnSite();
			if (showOnSite === null) {
				showOnSite = '';
			}

			return urlBase + '/pm/task/productUpdates/exportProductUpdatesToCsv?' +
				'alertType=' + self.alertType.code +
				'&assignee=' + self.assignedTo.uid +
				'&attributes=' + attributes +
				'&showOnSite=' + showOnSite;
		};

        /**
		 * Backup search condition product  for ecommerce View
         * @param productId the product id.
         * @param alertId the alert id.
         * @param productPosition the current position of product on grid.
         */
		self.navigateToEcommerView = function(productId, alertId, productPosition) {
			//Set search condition
			productSearchService.setSearchType(SEARCH_TYPE);
			productSearchService.setSelectionType(SELECTION_TYPE);
			productSearchService.setSearchSelection(productId);
			productSearchService.setListOfProducts($scope.data);
			//Backup alert id
			productSearchService.setAlertId(alertId);
			//Set selected tab is ecommerceViewTab tab to navigate ecommerce view page
			productSearchService.setSelectedTab(ECOMMERCE_VIEW_TAB);
			//productGroupService.setProductGroupId(self.cusProductGroup.customerProductGroup.custProductGroupId);
			//Set from page navigated to
			productSearchService.setFromPage(appConstants.PRODUCT_UPDATES_TASK);
			productSearchService.setDisableReturnToList(false);

			productSearchService.productUpdatesTaskCriteria = {};
			productSearchService.productUpdatesTaskCriteria.alertType = self.alertType.code;
			productSearchService.productUpdatesTaskCriteria.assignee = self.assignedTo.uid;
			productSearchService.productUpdatesTaskCriteria.attributes = self.getSelectedUpdateReasonsAttrs();
			productSearchService.productUpdatesTaskCriteria.showOnSite = self.getSelectedShowOnSite();
			productSearchService.productUpdatesTaskCriteria.pageIndex = self.convertPagePerCurrentPageSizeToPagePerOneHundred(productPosition);
			productSearchService.productUpdatesTaskCriteria.pageSize = self.NAVIGATE_PAGE_SIZE;

			$state.go(appConstants.HOME_STATE);
		};
        /**
         * Convert page per current page size to page per one hundred.
         * @param productPosition the position of product on grid table.
         * @returns {number} the position of product per one hundred.
         */
        self.convertPagePerCurrentPageSizeToPagePerOneHundred = function(productPosition){
            var productPositionInDataBase = (self.tableParams.page()-1) * self.tableParams.count() + productPosition;
            return Math.floor(productPositionInDataBase/self.NAVIGATE_PAGE_SIZE) + 1;
        }
		/**
		 * Show full primary image, and allow user download
		 */
		self.showFullImage  = function (prodId) {
			$('#imageModal').modal({backdrop: 'static', keyboard: true});
			self.fetchProductFullImage(prodId);
		};

		/**
		 * Used to fetch primary image of product referenced by the product id.
		 * @param productMaster
		 */
		self.fetchProductFullImage = function (prodId) {
			self.selectedImage = null;
			self.isImageDownloading = true;
			imageApi.getPrimaryImageByProductId(
				{
					productId : prodId,
					salesChannelCode : SALES_CHANNEL_HEB_COM
				},
				function(result) {
					self.isImageDownloading = false;
					if(result.data) {
						self.selectedImage =  result.data;
					}
				},
				function(error) {
					self.isImageDownloading = false;
				}
			);
		};

		/**
		 * Download current image.
		 */
		self.downloadImage = function () {
			if(self.selectedImage != null){
				var imageFormat = (self.selectedImage.imageFormat=='' ? 'png' : self.selectedImage.imageFormat).trim();
				var imageBytes = self.selectedImage.image;
				downloadImageService.download(imageBytes, imageFormat);
			}
		};
		/**
		 * Get data for mass fill.
		 */
		self.getDataForMassFill = function(){
			self.salesChannel = angular.copy(self.objectSelectTemp);
			self.pdpTemplate = angular.copy(self.objectSelectTemp);
			self.showOnSite = angular.copy(self.objectSelectTemp);
			self.fulfillmentProgramsSelected = [];
			self.effectiveDate = null;
			self.expirationDate  = null;
			self.showOnSiteSelects = [
				{
					id : null,
					description : "--Select--"
				},
				{
					id : 1,
					description : "Yes"
				},
				{
					id : 0,
					description : "No"
				}
			];
			self.loadSalesChannels();
			self.loadPDPTemplates();
			self.loadFulfillmentPrograms();
			$scope.handleEventSelectDropdown = {
				onSelectionChanged: function() {
					if(self.fulfillmentProgramsSelected == null || self.fulfillmentProgramsSelected.length ==0){
						self.showOnSite = angular.copy(self.objectSelectTemp);
						self.effectiveDate = null;
						self.expirationDate  = null;
					}
				},
				onItemSelect: function(item){
					if(_.trim(item.key.fulfillmentChannelCode)==='03'){
						_.forEach(self.fulfillmentPrograms,function(option){
							option.disabled = true;
						});
						item.disabled = false;
						self.fulfillmentProgramsSelected = [];
						self.fulfillmentProgramsSelected.push(item);
					}else{
						_.forEach(self.fulfillmentPrograms,function(option){
							option.disabled = false;
						});
					}
				},
				onItemDeselect: function(item){
					if(_.trim(item.key.fulfillmentChannelCode)==='03'){
						_.forEach(self.fulfillmentPrograms,function(option){
							option.disabled = false;
						});
					}
				}

			};
		};
		/**
		 * Load the list of channels from api.
		 */
		self.loadSalesChannels = function(){
			productGroupApi.findAllSaleChanel(
				//success
				function (results) {
					self.salesChannels.push(self.salesChannel);
					self.salesChannels = self.salesChannels.concat(results);
				}
				, self.handleError
			);
		};
		/**
		 * Load the list of pdf templates from api.
		 */
		self.loadPDPTemplates = function () {
			eCommerceViewApi.findAllPDPTemplate(
				//success
				function (results) {
					self.pdpTemplates.push(self.pdpTemplate);
					self.pdpTemplates = self.pdpTemplates.concat(results);
				}
				,self.handleError
			);
		};
		/**
		 * Load the list of fulfillments for all sales channels from api.
		 */
		self.loadFulfillmentPrograms = function(){
			productSearchApi.queryFulfilmentChannels(function(results){
				self.allFulfillmentPrograms = results;
				var salesChannelsTemp = [];
				self.salesChannels.forEach(function(salesChannel, index){
					var hasExist = false;
					self.allFulfillmentPrograms.forEach(function(fulfillmentProgram){
						if(salesChannel.id == null || fulfillmentProgram.salesChannel.id ==  salesChannel.id){
							hasExist = true;
						}
					});
					if(hasExist){
						salesChannelsTemp.push(salesChannel);
					}
				});
				self.salesChannels = salesChannelsTemp;
			}, self.handleError);
		};
		/**
		 * Get the list of FulfillmentPrograms by sales channel id.
		 *
		 * @return the list of FulfillmentPrograms.
		 */
		self.getFulfillmentPrograms = function(channelId){
			var results = [];
			self.allFulfillmentPrograms.forEach(function(item, index){
					if(item.salesChannel.id ==  channelId){
						item.id = index;
						item.label = item.description.trim();
						results.push(item);
					}
				}
			);
			results.sort();
			results.reverse();
			return results;
		};

		/**
		 * Handle data when change sale channel.
		 */
		self.handleChangeSalesChannel = function(){
			self.fulfillmentProgramsSelected = [];
			self.showOnSite = angular.copy(self.objectSelectTemp);
			self.effectiveDate = null;
			self.expirationDate  = null;
			self.fulfillmentPrograms = self.getFulfillmentPrograms(self.salesChannel.id);
			_.forEach(self.fulfillmentPrograms,function(option){
				option.disabled = false;
			});
		};

		/**
		 * Handle data show on site date.
		 */
		self.handleShowOnSiteDate = function() {
			if(self.showOnSite == null || self.showOnSite.id == null || self.showOnSite.id == 0){
				self.effectiveDate = null;
				self.expirationDate  = null;
			}else{
				self.effectiveDate = self.tomorrow;
				self.expirationDate  = new Date("12/31/9999");
			}
		};

		/**
		 * Mass fill data with product.
		 */
		self.massFillDataWithProduct = function(){
			if(!self.validateMassFillData()){
				if(!self.allAlerts && self.selectedAlerts.length == 0){
					$('#confirmSelectProductsModal').modal("show");
				}else {
					if(self.allAlerts){
						self.massFillInfoCachedSelectAll.isSelectAll = true;
						self.massFillInfoCachedSelectAll = {
							isSelectAll: self.massFillInfoCachedSelectAll.isSelectAll,
							alertType: self.massFillInfoCached.alertType ,
							effectiveDate: self.massFillInfoCached.effectiveDate,
							expirationDate: self.massFillInfoCached.expirationDate,
							assigneeId: self.massFillInfoCached.assigneeId,
							attributes: self.massFillInfoCached.attributes,
							showOnSiteFilter: self.massFillInfoCached.showOnSiteFilter,
							lstFulfillmentChannel: self.fulfillmentProgramsSelected,
							pdpTemplate:self.pdpTemplate,
							excludedAlerts:self.excludedAlerts
						};
					}
					self.massFillInfoCached = {
						isSelectAll: self.massFillInfoCachedSelectAll.isSelectAll,
						alertType: self.massFillInfoCached.alertType ,
						effectiveDate: self.massFillInfoCached.effectiveDate,
						expirationDate: self.massFillInfoCached.expirationDate,
						assigneeId: self.massFillInfoCached.assigneeId,
						attributes: self.massFillInfoCached.attributes,
						showOnSiteFilter: self.massFillInfoCached.showOnSiteFilter,
						lstFulfillmentChannel: self.fulfillmentProgramsSelected,
						pdpTemplate:self.pdpTemplate,
						excludedAlerts:self.excludedAlerts
					};
					self.doMassFill();
				}
			}
		};
		/**
		 * Mass fill data
		 */
		self.doMassFill = function(){
			self.isWaiting = true;
			if(self.massFillInfoCached.isSelectAll){
				self.doMassFillSelectAll();
			}
			if(!self.allAlerts){
				self.doMassFillNotSelectAll();
			}
			$timeout(function() {
				self.isWaiting = false;
			}, 1500);
		};
		/**
		 * Mass fill data with select all
		 */
		self.doMassFillSelectAll = function(){
			$scope.data.forEach(function(item, index){
				var itemExcluded=_.find(self.massFillInfoCachedSelectAll.excludedAlerts,function (itemEx) {
					return item.alertID===itemEx.alertID;
				})
				if(itemExcluded==null && item.productMaster){
					item.isChange = true;
					if(self.massFillInfoCachedSelectAll.pdpTemplate != null &&
						(item.productMaster.masterDataExtensionAttributes==null
						|| item.productMaster.masterDataExtensionAttributes.length==0)){
						var masterDataExtensionAttribute = {
							key : {attributeId : LOGICAL_ATTR_PDP_TEMPLATE},
							attributeValueText : self.massFillInfoCachedSelectAll.pdpTemplate.description,
						}
						item.productMaster.masterDataExtensionAttributes=[];
						item.productMaster.masterDataExtensionAttributes.push(masterDataExtensionAttribute);
					}
					else if(self.massFillInfoCachedSelectAll.pdpTemplate != null && self.massFillInfoCachedSelectAll.pdpTemplate.id != null
						&& self.isChangeMassFillPdpTemplate(item.productMaster,self.massFillInfoCachedSelectAll.pdpTemplate)){
						item.productMaster.masterDataExtensionAttributes.forEach(function(masterDataExtensionAttribute, index){
							if(masterDataExtensionAttribute.key.attributeId ==  LOGICAL_ATTR_PDP_TEMPLATE){
								masterDataExtensionAttribute.attributeValueText = self.massFillInfoCachedSelectAll.pdpTemplate.description;
								item.productMaster.pdpTemplate = masterDataExtensionAttribute;
							}
						});
					}
					self.massFillFullfilment(item.productMaster,self.massFillInfoCachedSelectAll.lstFulfillmentChannel);
					self.dataChanged.push(item);
				}
			});
		};
		/**
		 * Mass fill data with not select all
		 */
		self.doMassFillNotSelectAll = function(){
			$scope.data.forEach(function(item, index){
				self.selectedAlerts.forEach(function(itemSelected, index){
					if(item.alertID == itemSelected.alertID && item.productMaster){
						item.isChange = true;
						if(self.massFillInfoCached.pdpTemplate != null &&
							(item.productMaster.masterDataExtensionAttributes==null
							|| item.productMaster.masterDataExtensionAttributes.length==0)){
							var masterDataExtensionAttribute = {
								key : {attributeId : LOGICAL_ATTR_PDP_TEMPLATE},
								attributeValueText : self.massFillInfoCached.pdpTemplate.description,
							}
							item.productMaster.masterDataExtensionAttributes=[];
							item.productMaster.masterDataExtensionAttributes.push(masterDataExtensionAttribute);
						}
						else if(self.massFillInfoCached.pdpTemplate != null && self.massFillInfoCached.pdpTemplate.id != null
							&& self.isChangeMassFillPdpTemplate(item.productMaster,self.massFillInfoCached.pdpTemplate)){
							item.productMaster.masterDataExtensionAttributes.forEach(function(masterDataExtensionAttribute, index){
								if(masterDataExtensionAttribute.key.attributeId ==  LOGICAL_ATTR_PDP_TEMPLATE){
									masterDataExtensionAttribute.attributeValueText = self.massFillInfoCached.pdpTemplate.description;
									item.productMaster.pdpTemplate = masterDataExtensionAttribute;
									itemSelected.productMaster.pdpTemplate = masterDataExtensionAttribute;
								}
							});
						}
						self.massFillFullfilment(item.productMaster,self.massFillInfoCached.lstFulfillmentChannel);
						self.dataChanged.push(item);
					}
				});
			});
		};
		/**
		 * Mass fill pdp template
		 * @param productMaster
		 * @returns {boolean}
		 */
		self.isChangeMassFillPdpTemplate = function(productMaster,pdpTemplate){
			var isChangePdp = false;
			var pdpOrigin = _.find(productMaster.masterDataExtensionAttributes, function(attr){
				return attr.key.attributeId ==  LOGICAL_ATTR_PDP_TEMPLATE;
			});
			if(pdpOrigin==null || _.trim(pdpOrigin.attributeValueText)!==_.trim(pdpTemplate.description)){
				isChangePdp = true;
			}
			return isChangePdp;
		};
		/**
		 * Mass fill fullfilmentChanels
		 */
		self.massFillFullfilment =function(productMaster,lstFulfillmentChannel){
			var productFullfilmentChanels=[];
			if(lstFulfillmentChannel==null || lstFulfillmentChannel.length==0)
				return;
			_.forEach(lstFulfillmentChannel, function (fullfilment) {
				var productFullfilmentChanel = {
					expirationDate: self.convertDateToStringWithYYYYMMDD(self.expirationDate),
					fulfillmentChannel: angular.copy(fullfilment),
					effectDate: self.convertDateToStringWithYYYYMMDD(self.effectiveDate),
					key: {
						productId: productMaster.prodId,
						salesChanelCode: fullfilment.key.salesChannelCode,
						fullfillmentChanelCode: fullfilment.key.fulfillmentChannelCode
					}
				};
				productFullfilmentChanel.hasMassFill = true;
				productFullfilmentChanels.push(productFullfilmentChanel);
			});

			productMaster.productFullfilmentChanels=productFullfilmentChanels;
		};
		/**
		 * Validate data mass fill.
		 */
		self.validateMassFillData = function(){
			self.isErrorMassFillData = false;
			self.isErrorRequireMess = null;
			self.errorMassFillDataLst = [];
			if((self.pdpTemplate == null || self.pdpTemplate.id == null)
				&& (self.salesChannel == null || self.salesChannel.id == null || self.fulfillmentProgramsSelected == null || self.fulfillmentProgramsSelected.length == 0)){
				self.isErrorMassFillData = true;
				self.isErrorRequireMess = "Please select value for Mass Fill."
			}else if(self.salesChannel != null && self.salesChannel.id != null && self.fulfillmentProgramsSelected != null && self.fulfillmentProgramsSelected.length > 0){
				if(self.showOnSite == null || self.showOnSite.id == null){
					self.isErrorMassFillData = true;
					self.errorMassFillDataLst.push("Fulfillment Program Value is a mandatory field.");
				}else if(self.showOnSite.id == 1){
					if (self.isDate1GreaterThanDate2(self.tomorrow, self.effectiveDate)) {
						self.errorMassFillDataLst.push("Start Date must be greater than Current Date.");
						self.isErrorMassFillData = true;
					}
					if(!self.isDate1GreaterThanDate2(self.expirationDate, self.effectiveDate)) {
						self.isErrorMassFillData = true;
						if (!self.isDate1GreaterThanDate2(self.tomorrow, self.effectiveDate)) {
							self.errorMassFillDataLst.push("Effective Date must be less than End Date.");
						}
						self.errorMassFillDataLst.push("End Date must be greater than Effective Date and less than 12/31/9999.");
					}
				}
			}
			return self.isErrorMassFillData;
		};
		/**
		 * Save data mass fill. Call api to create tracking id then send to batch process asyn
		 * and create candidate work request
		 */
		self.saveData = function(){
			var massFillData = {
				isSelectAll:self.massFillInfoCached.isSelectAll,
				selectedAlertStaging:self.dataChanged,
				excludedAlerts:_.pluck(self.massFillInfoCached.excludedAlerts, ALERT_ID),
				description:self.descriptionRequest,
				alertType: self.massFillInfoCached.alertType,
				effectiveDate:self.convertDateToStringWithYYYYMMDD(self.massFillInfoCached.effectiveDate),
				expirationDate:self.convertDateToStringWithYYYYMMDD(self.massFillInfoCached.expirationDate),
				assigneeId: self.massFillInfoCached.assigneeId,
				attributes: _.trim(self.massFillInfoCached.attributes)===''?null:_.trim(self.massFillInfoCached.attributes).split(","),
				showOnSiteFilter: self.massFillInfoCached.showOnSiteFilter,
				lstFulfillmentChannel:self.massFillInfoCached.lstFulfillmentChannel,
				pdpTemplate:self.massFillInfoCached.pdpTemplate,
				actionType:ACTION_TYPE_SAVE
			};
			self.isWaiting = true;
			productUpdatesTaskApi.saveData(massFillData,function (response) {
				self.isWaiting = false;
				self.trackingId=response.data;
				$('#confirmCheckStatusModal').modal("show");
			},self.handleError)
		};
		/**
		 * Check status screen.
		 */
		self.checkStatus= function(){
			$('#confirmCheckStatusModal').modal("hide");
			$('#confirmCheckStatusModal').on('hidden.bs.modal', function () {
				$state.go(appConstants.CHECK_STATUS,{trackingId:self.trackingId});
			});
		};
		/**
		 * Fetch data change to save
		 */
		self.fetchDataChanged = function(){
			//remove the duplicate item on selected alert data
			self.dataChanged = _.filter(self.dataChanged, function(itemChanged){
				return _.find($scope.data, function(item){
						return itemChanged.alertID==item.alertID;
					})==null;
			});
			if($scope.data && $scope.data!=null && $scope.data.length>0){
				$scope.data.forEach(function(item){
					if(item.isChange){
						item.alertStagingsFromDB = false;
						self.dataChanged.push(item);
					}
				});
			}

		};

		/**
		 * Compare the date is greater than date 2 or not.
		 *
		 * @param date1 the date.
		 * @param date2 the date.
		 * @returns {boolean} true if the date1 is greater than date 2 or false.
		 */
		self.isDate1GreaterThanDate2 = function (date1, date2) {
			if ((new Date(self.convertDateToStringWithYYYYMMDD(date1)).getTime() > new Date(self.convertDateToStringWithYYYYMMDD(date2)).getTime())) {
				return true;
			}
			return false;
		};

		/**
		 * Convert the date to string with format: YYYY-MM-dd.
		 * @param date the date object.
		 * @returns {*} string
		 */
		self.convertDateToStringWithYYYYMMDD = function (date) {
			return $filter('date')(date, 'yyyy-MM-dd');
		};
		/**
		 * Get total record mass fill.
		 */
		self.getTotalRecordMassFill = function() {
			if(self.massFillInfoCached.isSelectAll){
				if(self.massFillInfoCachedSelectAll.excludedAlerts && self.massFillInfoCachedSelectAll.excludedAlerts.length>0){
					var finalExclude = _.filter(self.massFillInfoCachedSelectAll.excludedAlerts, function(itemChanged){
						return _.find(self.dataChanged, function(item){
								return itemChanged.alertID==item.alertID;
							})==null;
					});
					return self.totalRecordCount-finalExclude.length;
				}
				return self.totalRecordCount;
			}else{
				return self.dataChanged.length;
			}
		};

		/**
		 * Get title for FufillmentProgram select dropdown.
		 */
		self.getTitleForFulfillmentProgram = function() {
			var fulfillmentChannelNames = [];
			_.forEach(self.fulfillmentProgramsSelected, function (o) {
				fulfillmentChannelNames.push(SPACE_STRING + o.description.trim());
			});
			return fulfillmentChannelNames.join();
		};
		/**
		 * Call api to assign product to BDM
		 */
		self.assignToBDM = function(){
			var massFillData = {
				isSelectAll: self.allAlerts,
				selectedAlertStaging:self.selectedAlerts,
				alertType: self.massFillInfoCached.alertType,
				effectiveDate:self.convertDateToStringWithYYYYMMDD(self.massFillInfoCached.effectiveDate),
				expirationDate:self.convertDateToStringWithYYYYMMDD(self.massFillInfoCached.expirationDate),
				assigneeId: self.massFillInfoCached.assigneeId,
				attributes: _.trim(self.massFillInfoCached.attributes)===''?null:_.trim(self.massFillInfoCached.attributes).split(","),
				showOnSiteFilter: self.massFillInfoCached.showOnSiteFilter,
				excludedAlerts:_.pluck(self.excludedAlerts, ALERT_ID),
				actionType:ACTION_TYPE_ASSIGN_BDM
			};
			self.isWaiting = true;
			productUpdatesTaskApi.assignToBDM(massFillData,function (response) {
				self.isWaiting = false;
				$('#successAssignToBDMModal').modal("show");
			},self.handleError)
		};
		/**
		 * Call api to assign product to eBM
		 */
		self.assignToEBM = function(){
			var massFillData = {
				isSelectAll: self.allAlerts,
				selectedAlertStaging:self.selectedAlerts,
				alertType: self.massFillInfoCached.alertType,
				effectiveDate:self.convertDateToStringWithYYYYMMDD(self.massFillInfoCached.effectiveDate),
				expirationDate:self.convertDateToStringWithYYYYMMDD(self.massFillInfoCached.expirationDate),
				assigneeId: self.massFillInfoCached.assigneeId,
				attributes: _.trim(self.massFillInfoCached.attributes)===''?null:_.trim(self.massFillInfoCached.attributes).split(","),
				showOnSiteFilter: self.massFillInfoCached.showOnSiteFilter,
				excludedAlerts:_.pluck(self.excludedAlerts, ALERT_ID),
				actionType:ACTION_TYPE_ASSIGN_eBM
			};
			self.isWaiting = true;
			productUpdatesTaskApi.assignToEBM(massFillData,function (response) {
				self.isWaiting = false;
				$('#successAssignToeBMModal').modal("show");
			},self.handleError)
		};
		/**
		 * Call api to publish product
		 */
		self.publishProduct = function(){
			var massFillData = {
				isSelectAll: self.allAlerts,
				selectedAlertStaging:self.selectedAlerts,
				alertType: self.massFillInfoCached.alertType,
				effectiveDate:self.convertDateToStringWithYYYYMMDD(self.massFillInfoCached.effectiveDate),
				expirationDate:self.convertDateToStringWithYYYYMMDD(self.massFillInfoCached.expirationDate),
				assigneeId: self.massFillInfoCached.assigneeId,
				attributes: _.trim(self.massFillInfoCached.attributes)===''?null:_.trim(self.massFillInfoCached.attributes).split(","),
				showOnSiteFilter: self.massFillInfoCached.showOnSiteFilter,
				excludedAlerts:_.pluck(self.excludedAlerts, ALERT_ID),
				actionType:ACTION_TYPE_PUBLISH
			};
			self.isWaiting = true;
			productUpdatesTaskApi.publishProduct(massFillData,function (response) {
				self.isWaiting = false;
				self.trackingId=response.data;
				$('#confirmCheckStatusModal').modal("show");
			},self.handleError)
		};
		/**
		 * Call api to delete alerts
		 */
		self.deleteAlerts = function(){
			var massFillData = {
				isSelectAll: self.allAlerts,
				selectedAlertStaging:self.selectedAlerts,
				alertType: self.massFillInfoCached.alertType,
				effectiveDate:self.convertDateToStringWithYYYYMMDD(self.massFillInfoCached.effectiveDate),
				expirationDate:self.convertDateToStringWithYYYYMMDD(self.massFillInfoCached.expirationDate),
				assigneeId: self.massFillInfoCached.assigneeId,
				attributes: _.trim(self.massFillInfoCached.attributes)===''?null:_.trim(self.massFillInfoCached.attributes).split(","),
				showOnSiteFilter: self.massFillInfoCached.showOnSiteFilter,
				excludedAlerts:_.pluck(self.excludedAlerts, ALERT_ID),
				actionType:ACTION_TYPE_DELETE_ALERT
			};
			self.isWaiting = true;
			productUpdatesTaskApi.deleteAlerts(massFillData,function (response) {
				self.isWaiting = false;
				self.message=response.message;
				self.forceReloadData(1,false);
			},self.handleError)
		};
		/**
		 * Check data before save by functionality
		 * @param id
		 */
		self.checkDataBeforeSave = function(){
			self.clearMessage();
			self.fetchDataChanged();
			if((self.massFillInfoCached.lstFulfillmentChannel && self.massFillInfoCached.lstFulfillmentChannel.length>0) || self.massFillInfoCached.pdpTemplate){
				$('#confirmSubmitModal').modal("show");
			}else{
				self.CONFIRM_SELECTED_PRODUCT_MESSAGE = 'There are no changes on this page to be saved. Please make any changes to update';
				$('#confirmSelectProductsModal').modal("show");
			}
		};
		/**
		 * Check data before assgin to BDM by functionality
		 * @param id
		 */
		self.checkDataBeforeAssignToBDM = function(){
			self.clearMessage();
			if((self.selectedAlerts && self.selectedAlerts.length>0) || self.allAlerts ){
				$('#confirmationBDMAssignModal').modal("show");
			}else{
				self.CONFIRM_SELECTED_PRODUCT_MESSAGE = 'Please select at least one Product to assign to BDM';
				$('#confirmSelectProductsModal').modal("show");
			}
		};
		/**
		 * Check data before assign to eBM by functionality
		 * @param id
		 */
		self.checkDataBeforeeBM = function(){
			self.clearMessage();
			if((self.selectedAlerts && self.selectedAlerts.length>0) || self.allAlerts ){
				$('#confirmationeBMAssignModal').modal("show");
			}else{
				self.CONFIRM_SELECTED_PRODUCT_MESSAGE = 'Please select at least one Product to assign to eBM';
				$('#confirmSelectProductsModal').modal("show");
			}
		};
		/**
		 * Check data before publish by functionality
		 * @param id
		 */
		self.checkDataBeforePublish = function(){
			self.clearMessage();
			if((self.selectedAlerts && self.selectedAlerts.length>0) || self.allAlerts ){
				$('#confirmatioPublishProductModal').modal("show");
			}else{
				self.CONFIRM_SELECTED_PRODUCT_MESSAGE = 'Please select at least one Product to Publish';
				$('#confirmSelectProductsModal').modal("show");
			}
		};
		/**
		 * Check data before publish by functionality
		 * @param id
		 */
		self.checkDataBeforeDelete = function(){
			self.clearMessage();
			if((self.selectedAlerts && self.selectedAlerts.length>0) || self.allAlerts ){
				$('#confirmationDeleteAlertModal').modal("show");
			}else{
				self.CONFIRM_SELECTED_PRODUCT_MESSAGE = 'Please select at least one Alert to Delete';
				$('#confirmSelectProductsModal').modal("show");
			}
		};

		/**
		 * Handle reset button.
		 */
		self.onReset = function(){
			self.assignedTo = self.defaultUser;
			self.forceReloadData(1,true);
			self.resetFilterUpdateReason();
			self.resetFilterShowOnSite();
			for (var i = 0; i < self.alertTypes.length; i++){
				self.fetchProductsAssignee(self.alertTypes[i].code);
			}
		};
	}

})();
