sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/core/mvc/ControllerExtension",
	"sap/ui/generic/app/navigation/service/NavError",
	"sap/suite/ui/generic/template/listTemplates/listUtils",
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/ui/comp/state/UIState",
	"sap/suite/ui/generic/template/genericUtilities/FeLogger",
	"sap/base/util/deepEqual",
	"sap/base/util/extend",
	"sap/suite/ui/generic/template/genericUtilities/FeError",
	"sap/suite/ui/generic/template/js/placeholderHelper"
], function(BaseObject, ControllerExtension, NavError, listUtils, SelectionVariant, UIState, FeLogger, deepEqual, extend, FeError, placeholderHelper) {
	"use strict";

	var	sClassName = "ListReport.controller.IappStateHandler";
	var oFeLogger = new FeLogger(sClassName);
	var oLogger = oFeLogger.getLogger();
	var oLevel = oFeLogger.Level;
	// Constants which are used as property names for storing custom filter data and generic filter data
	var dataPropertyNameCustom = "sap.suite.ui.generic.template.customData",
		dataPropertyNameExtension = "sap.suite.ui.generic.template.extensionData",
		dataPropertyNameGeneric = "sap.suite.ui.generic.template.genericData";

	// variant contexts which should not lead to change the iappstate
	var aIrrelevantVariantLoadContext = ["INIT", "DATA_SUITE", "CANCEL", "RESET", "SET_VM_ID"];

	function fnNullify(oObject) {
		if (oObject) {
			for (var sProp in oObject) {
				oObject[sProp] = null;
			}
		}
	}

	function fnLogInfo(sMessage, vDetails){
		if (sap.ui.support) { //only if support assistant is loaded
			var iLevel = oLogger.getLevel();
			if (iLevel < oLevel.INFO) {
				oLogger.setLevel(oLevel.INFO);
			}
		}
		var sDetails;
		if (typeof vDetails === "string"){
			sDetails = vDetails;
		} else {
			sDetails = "";
			var sDelim = "";
			for (var sKey in vDetails){
				sDetails = sDetails + sDelim + sKey + ": " + vDetails[sKey];
				sDelim = "; ";
			}
		}
		oLogger.info(sMessage, sDetails, "sap.suite.ui.generic.template.ListReport.controller.IappStateHandler");
	}

	function getMethods(oState, oController, oTemplateUtils) {

		var oNavigationHandler = oTemplateUtils.oServices.oApplication.getNavigationHandler();
		var bSmartVariantManagement = oController.getOwnerComponent().getSmartVariantManagement();

		var bIgnoreFilterChange = false; // In some cases we trigger the filter change event ourselves but do not want to update the appState. Then this flag is temporarily set.
		var bIsAutoBinding;
		var autoBindingFromView;
		var oSettings = oTemplateUtils.oComponentUtils.getSettings();
		
		// Promise and its resolve function to control whether the adapt filter dialog is open 
		var fnResolveAdaptFiltersDialog;
		var oAdaptFiltersDialogOpenPromise = Promise.resolve(); // initially, the dialog is not open
		// Flag to remember whether variant was dirty when opening the dialog
		// only meaningful, when the adapt filters dialog is open
		var bDialogOpenedWithDirtyVariant = false;

		oState.oSmartFilterbar.setSuppressSelection(true);

		var getByDefaultNonVisibleCustomFilterNames = (function(){
			var aNonVisibleCustomFilterNames;
			return function(){
				aNonVisibleCustomFilterNames = aNonVisibleCustomFilterNames || oState.oSmartFilterbar.getNonVisibleCustomFilterNames();
				return aNonVisibleCustomFilterNames;
			};
		})();

		function areDataShownInTable(){
			var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
			return oTemplatePrivateModel.getProperty("/generic/bDataAreShownInTable");
		}

		function getPageState() {
			var oCustomAndGenericData = {}; // object to be returned by this function

			// first determine the generic information
			// Determine information about visible custom filters
			var aVisibleCustomFieldNames = [];
			var aByDefaultNonVisibleCustomFilterNames = getByDefaultNonVisibleCustomFilterNames();
			for (var i = 0; i < aByDefaultNonVisibleCustomFilterNames.length; i++){ // loop over all custom fields which are not visible in filterbar by default
				var sName = aByDefaultNonVisibleCustomFilterNames[i];
				if (oState.oSmartFilterbar.isVisibleInFilterBarByName(sName)){ // custom field is visible in filterbar now
					aVisibleCustomFieldNames.push(sName);
				}
			}
			var oGenericData = {
				suppressDataSelection: !areDataShownInTable(),
				visibleCustomFields: aVisibleCustomFieldNames,
				variantDirty: oController.byId('template::PageVariant') && oController.byId('template::PageVariant').currentVariantGetModified()
			};
			oCustomAndGenericData[dataPropertyNameGeneric] = oGenericData;
			if (oTemplateUtils.oComponentUtils.isDraftEnabled()) {
				var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
				oGenericData.editStateFilter = oTemplatePrivateModel.getProperty("/listReport/vDraftState");
				var bActiveStateFilter = oTemplatePrivateModel.getProperty("/listReport/activeObjectEnabled");
				oGenericData.activeStateFilter = bActiveStateFilter;
			}
			var sSelectedKeyPropertyName = oState.oMultipleViewsHandler.getSelectedKeyPropertyName();
			if (sSelectedKeyPropertyName) {
				var oTableViewData = oState.oMultipleViewsHandler.getContentForIappState();
				if (oTableViewData){
					oGenericData[sSelectedKeyPropertyName] = oTableViewData.state;
				}
			}

			// search related data is saved in both iappstate and variant, adding it to custom data here to save state of worklist
			if (oState.oWorklistData.bWorkListEnabled) {
				var sSearchString = oState.oWorklistData.oSearchField ? oState.oWorklistData.oSearchField.getValue() : "";
				var oWorklistState = {
					"searchString": sSearchString
				};
				oGenericData.Worklist = oWorklistState;
			}

			// second allow classical break-outs to add their custom state
			var oCustomData = {};
			oCustomAndGenericData[dataPropertyNameCustom] = oCustomData;
			oController.getCustomAppStateDataExtension(oCustomData);

			// thirdallow all extensions to add their custom state
			var oExtensionData; // collects all extension state information (as map extension-namespace -> state). Initialized on demand
			var bIsAllowed = true; // check for synchronous calls
			// the following function will be passed to all extensions. It gives them the possibility to provide their state as oAppState
			// Therefore, they must identify themselves via their instance of ControllerExtension.
			var fnSetAppStateData = function(oControllerExtension, oAppState){
				if (!(oControllerExtension instanceof ControllerExtension)){
					throw new FeError(sClassName, "State must always be set with respect to a ControllerExtension");
				}
				if (!bIsAllowed){
					throw new FeError(sClassName, "State must always be provided synchronously");
				}
				if (oAppState){ // faulty app-state information will not be stored
					oExtensionData = oExtensionData || Object.create(null);
					var sExtensionId = oControllerExtension.getMetadata().getNamespace(); // extension is identified by its namespace
					oExtensionData[sExtensionId] = oAppState;
				}
			};
			oController.templateBaseExtension.provideExtensionAppStateData(fnSetAppStateData);
			bIsAllowed = false;
			if (oExtensionData){
				oCustomAndGenericData[dataPropertyNameExtension] = oExtensionData;
			}

			return oCustomAndGenericData;
		}

		function getCurrentAppState() {
			/*
			 * Special handling for selection fields, for which defaults are defined: If a field is visible in the
			 * SmartFilterBar and the user has cleared the input value, the field is not included in the selection
			 * variant, which is returned by getDataSuiteFormat() of the SmartFilterBar. But since it was cleared by
			 * purpose, we have to store the selection with the value "", in order to set it again to an empty value,
			 * when restoring the selection after a back navigation. Otherwise, the default value would be set.
			 */
			var oSFBUiState = oState.oSmartFilterbar.getUiState();
			var sCurrentSelectionVariant = JSON.stringify(oSFBUiState.getSelectionVariant());
			//var sCurrentSelectionVariant = oState.oSmartFilterbar.getDataSuiteFormat();
			var oSelectionVariant = new SelectionVariant(sCurrentSelectionVariant);
			var aVisibleFields = oController.getVisibleSelectionsWithDefaults();
			for (var i = 0; i < aVisibleFields.length; i++) {
				if (!oSelectionVariant.getValue(aVisibleFields[i])) {
					oSelectionVariant.addSelectOption(aVisibleFields[i], "I", "EQ", "");
				}
			}

			//If variant is dirty and if the selection variant has id, making the same empty for the filters to be applied correctly.
			if (oController.byId('template::PageVariant') && oController.byId('template::PageVariant').currentVariantGetModified() && oSelectionVariant.getID()){
				oSelectionVariant.setID("");
			}

			/*State saving for worklist application*/
			if (oState.oWorklistData.bWorkListEnabled) {
				var oSearchField = oState.oWorklistData.oSearchField ? oState.oWorklistData.oSearchField.getValue() : "";
				oSelectionVariant.addSelectOption("Worklist.SearchField","I","EQ",oSearchField);
			}

			return {
				selectionVariant: oSelectionVariant.toJSONString(),
				tableVariantId: (!bSmartVariantManagement && oState.oSmartTable.getCurrentVariantId()) || "",
				customData: getPageState(),
				semanticDates: oSFBUiState.getSemanticDates()
			};
		}

		function fnRestoreGenericFilterState(oGenericData, bApplySearchIfConfigured) {
			var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
			if (oGenericData && oTemplateUtils.oComponentUtils.isDraftEnabled()){
				oTemplatePrivateModel.setProperty("/listReport/vDraftState", oGenericData.editStateFilter || "0");
				oTemplatePrivateModel.setProperty("/listReport/activeObjectEnabled", !!oGenericData.activeStateFilter);
				oState.oMultipleViewsHandler.restoreActiveButtonState(oGenericData);
			}
			// Restore information about visible custom filters
			var aVisibleCustomFields = oGenericData && oGenericData.visibleCustomFields;
			if (aVisibleCustomFields && aVisibleCustomFields.length > 0){
				var aItems = oState.oSmartFilterbar.getAllFilterItems();
				for (var i = 0; i < aItems.length; i++){
					var oItem = aItems[i];
					var sName = oItem.getName();
					if (aVisibleCustomFields.indexOf(sName) !== -1){
						oItem.setVisibleInFilterBar(true);
					}
				}
			}
			setDataShownInTable(bApplySearchIfConfigured && !(oGenericData && oGenericData.suppressDataSelection));
			// In worklist, search is called at a different place
			if (areDataShownInTable() && !oState.oWorklistData.bWorkListEnabled){
				oState.oSmartFilterbar.search();
				//collapse header in case of bookmark or if iappstate is preserved on load of LR
				collapseLRHeaderonLoad();
			}
			var sSelectedKeyPropertyName = oState.oMultipleViewsHandler.getSelectedKeyPropertyName();
			if (sSelectedKeyPropertyName && oGenericData[sSelectedKeyPropertyName]) {
				oState.oMultipleViewsHandler.restoreFromIappState(oGenericData[sSelectedKeyPropertyName]);
			}

		}

		function handleVariantIdPassedViaURLParams(oNewUrlParameters,bSmartVariantManagement) {
			if (bSmartVariantManagement) {
				var sPageVariantId = oNewUrlParameters['sap-ui-fe-variant-id'];
				if (sPageVariantId && sPageVariantId[0]) {
					oState.oSmartFilterbar.getSmartVariant().setCurrentVariantId(sPageVariantId[0]);
				}
			} else {
				var aPageVariantId = oNewUrlParameters['sap-ui-fe-variant-id'],
					aFilterBarVariantId = oNewUrlParameters['sap-ui-fe-filterbar-variant-id'],
					aChartVariantId = oNewUrlParameters['sap-ui-fe-chart-variant-id'],
					aTableVariantId = oNewUrlParameters['sap-ui-fe-table-variant-id'];

				applyControlVariantId(aFilterBarVariantId && aFilterBarVariantId[0], aChartVariantId && aChartVariantId[0], aTableVariantId && aTableVariantId[0], aPageVariantId && aPageVariantId[0]);
			}
		}
		function applyControlVariantId(sFilterBarVariantId, sChartVariantId, sTableVariantId, sPageVariantId) {
			if (sFilterBarVariantId || sPageVariantId) {
				oState.oSmartFilterbar.getSmartVariant().setCurrentVariantId(sFilterBarVariantId || sPageVariantId);
			}

			if (oState.oSmartTable && (sTableVariantId || sPageVariantId)) {
				oState.oSmartTable.attachAfterVariantInitialise(function (oEvent) {
					oState.oSmartTable.setCurrentVariantId(sTableVariantId || sPageVariantId);
				});
				// incase the control variant is already initialized
				oState.oSmartTable.setCurrentVariantId(sTableVariantId || sPageVariantId);
			}

			oState.oMultipleViewsHandler.setControlVariant(sChartVariantId, sTableVariantId, sPageVariantId);
		}

		// method is responsible for retrieving custom filter state. The corresponding extension-method has a more generic name
		// for historical reasons (change would be incompatible).
		function fnRestoreCustomFilterState(oCustomData) {
			oController.restoreCustomAppStateDataExtension(oCustomData || {});
		}

		// method is responsible for retrieving state for all extensions.
		// More precisely, oExtensionData is a map Extension-namespace -> state that has been stored by the corresponding extension.
		// This method enables each extension to restore its state accordingly.
		function fnRestoreExtensionFilterState(oExtensionData){
			if (!oExtensionData){
				return; // the app-state does not contain state information for extensions
			}
			var bIsAllowed = true; // check for synchronous calls
			// the following function will be passed to all extensions. It gives them the possibility to retrieve their state.
			// Therefore, they must identify themselves via their instance of ControllerExtension.
			var fnGetAppStateData = function(oControllerExtension){
				if (!(oControllerExtension instanceof ControllerExtension)){
					throw new FeError(sClassName, "State must always be retrieved with respect to a ControllerExtension");
				}
				var sExtensionId = oControllerExtension.getMetadata().getNamespace();
				if (!bIsAllowed){
					throw new FeError(sClassName, "State must always be restored synchronously");
				}
				return oExtensionData[sExtensionId];
			};
			oController.templateBaseExtension.restoreExtensionAppStateData(fnGetAppStateData);
			bIsAllowed = false;
		}

		// This method is responsible for restoring the data which have been stored via getPageState.
		// However, it must be taken care of data which have been stored with another (historical) format.
		// Therefore, it is checked whether oCustomAndGenericData possesses two properties with the right names.
		// If this is this case it is assumed that the data have been stored according to curreent logic. Otherwise, it is
		// assumed that the data have been stored with the current logic. Otherwise, it is assumed that the properties have been
		// stored with a logic containing only custom properties (with possible addition of _editStateFilter).
		function fnRestorePageState(oCustomAndGenericData, bApplySearchIfConfigured) {
			oCustomAndGenericData = oCustomAndGenericData || {};
			if (oCustomAndGenericData.hasOwnProperty(dataPropertyNameCustom) && oCustomAndGenericData.hasOwnProperty(dataPropertyNameGeneric)) {
				fnRestoreExtensionFilterState(oCustomAndGenericData[dataPropertyNameExtension]);
				fnRestoreCustomFilterState(oCustomAndGenericData[dataPropertyNameCustom]);
				fnRestoreGenericFilterState(oCustomAndGenericData[dataPropertyNameGeneric], bApplySearchIfConfigured);
			} else {
				// historic format. May still have property _editStateFilter which was used generically.
				if (oCustomAndGenericData._editStateFilter !== undefined) {
					fnRestoreGenericFilterState({
						editStateFilter: oCustomAndGenericData._editStateFilter
					});
					delete oCustomAndGenericData._editStateFilter;
				}
				fnRestoreCustomFilterState(oCustomAndGenericData);
			}

			// according to SFB needed to recalculate adapt filters count also for extension filters
			oState.oSmartFilterbar.fireFilterChange();
			if (oCustomAndGenericData[dataPropertyNameGeneric]) {
				// Restore the state of the variant
				// variantDirty could be undefined for previously bookmarked links, in that case we still show the variant dirty
				if (oCustomAndGenericData[dataPropertyNameGeneric].variantDirty === undefined) {
					oCustomAndGenericData[dataPropertyNameGeneric].variantDirty = true;
				}
				oController.byId('template::PageVariant') && oController.byId('template::PageVariant').currentVariantSetModified(oCustomAndGenericData[dataPropertyNameGeneric].variantDirty);
			}
		}

		function setDataShownInTable(bDataAreShown) {
			var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
			oTemplatePrivateModel.setProperty("/generic/bDataAreShownInTable", bDataAreShown);
		}

		// This method is called when some filters or settings are changed (bFilterOrSettingsChange = true) or the data selection for the table is triggered (bDataAreShown = true).
		// It is responsible for:
		// - triggering the creation of a new appState if neccessary
		function changeIappState(bFilterOrSettingsChange, bDataAreShown){
			fnLogInfo("changeIappState called", {
				bFilterOrSettingsChange: bFilterOrSettingsChange,
				bDataAreShown: bDataAreShown,
				bDataAreShownInTable: areDataShownInTable(),
				bIgnoreFilterChange: bIgnoreFilterChange
			});
			// don't consider filter changes while the dialog is open 
			if (oState.oSmartFilterbar.isDialogOpen()){
				return;
			}
			if (bIgnoreFilterChange){
				return;
			}
			setDataShownInTable(bDataAreShown);
			
			// inform statePreserver about change already here (not just in fnStoreCurrentAppStateAndAdjustURL) to allow own handling of dealing with multiple state changes
			// overlapping each other
			// no need to check whether the state actually has changed (just pressing go again to refresh the data is no state change) - this is done by statePreserver
			oTemplateUtils.oComponentUtils.stateChanged();
		}

		/*
		The function is to add default values in Display Currency parameter if it is not there in the Selection Variant
        @param {object} Selection Variant
`		@param {object} App data
		*/
		function addDisplayCurrency(oAppData) {
			var aMandatoryFilterItems = oState.oSmartFilterbar.determineMandatoryFilterItems(),
			sDisplayCurrency;
			for (var item = 0; item < aMandatoryFilterItems.length; item++) {
				if (aMandatoryFilterItems[item].getName().indexOf("P_DisplayCurrency") !== -1) {
					if (oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency") && oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0] && oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low) {
						sDisplayCurrency = oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low;
						if (sDisplayCurrency) {
							oAppData.oSelectionVariant.addParameter("P_DisplayCurrency", sDisplayCurrency);
						}
					}
					break;
				}
			}
		}

		/*
		The function checks if the Mandatory Filters are filled. Returns true if not filled
		*/
		function checkForMandatoryFilters() {
			var aMandatoryFilterItems = oState.oSmartFilterbar.determineMandatoryFilterItems();
			var filtersWithValues = oState.oSmartFilterbar.getFiltersWithValues();
			for (var i = 0; i < aMandatoryFilterItems.length; i++) {
				if (filtersWithValues.indexOf(aMandatoryFilterItems[i]) === -1) {
					return true;
				}
			}
			return false;
		}
		
		
		
		function fnAdaptToAppStateIappState(oAppData){
			// incase semantic date field is present, parseNavigation returns semanticDates in stringified format and otherwise an empty object
			var oSemanticDates = (typeof oAppData.semanticDates === "string" ? JSON.parse(oAppData.semanticDates) : oAppData.semanticDates) || {};
			// if there is a navigation from external application to worklist,
			// the filters from external application should not be applied since the worklist does not show smartfilterbar
			// and there is no way for the user to modify the applied filters. Hence not applying the filters only if it is worklist
			if (!oState.oWorklistData.bWorkListEnabled) {
				fnApplySelectionVariantToSFB(oAppData.oSelectionVariant || "",  oAppData.selectionVariant || "", true, oSemanticDates, false);
			}
			if (!bSmartVariantManagement && oAppData.tableVariantId) {
				oState.oSmartTable.setCurrentVariantId(oAppData.tableVariantId);
			}
			// in case of navigation with URL parameters but no xAppState, no CustomData is provided
			oAppData.customData = oAppData.customData || {};

			if (oState.oWorklistData.bWorkListEnabled) {
				// null check done as fix for incident 1870150212
				var oWorklistState = oAppData.customData[dataPropertyNameGeneric] && oAppData.customData[dataPropertyNameGeneric].Worklist ? oAppData.customData[dataPropertyNameGeneric].Worklist : {};
				// restore the state of worklist from IappState
				oState.oWorklistHandler.restoreWorklistStateFromIappState(oWorklistState);
			}
			setPlaceHolderValue(areDataShownInTable());
			fnRestorePageState(oAppData.customData, true);
		}

		function fnAdaptToAppStateNavigation(oAppData, oURLParameters){
			handleVariantIdPassedViaURLParams(oURLParameters || {}, bSmartVariantManagement);
			//Apply sort order coming from the XAppState to the smart table.
			if (oAppData.presentationVariant !== undefined) {
				oTemplateUtils.oCommonUtils.setControlSortOrder(oState, oAppData.presentationVariant);
			}
			if ((oAppData.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("DisplayCurrency") === -1) && (oAppData.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("P_DisplayCurrency") === -1) && (oAppData.oSelectionVariant.getParameterNames().indexOf("P_DisplayCurrency") === -1)) {
				addDisplayCurrency(oAppData);
			}
			var oStartupObject = {
					selectionVariant: oAppData.oSelectionVariant,
					urlParameters: oURLParameters,
					selectedQuickVariantSelectionKey: "",
					// incase semantic date field is present, parseNavigation returns semanticDates in stringified format and otherwise an empty object
					semanticDates: (typeof oAppData.semanticDates === "string" ? JSON.parse(oAppData.semanticDates) : oAppData.semanticDates) || {}
			};
			// if there is a navigation from external application to worklist,
			// the filters from external application should not be applied since the worklist does not show smartfilterbar
			// and there is no way for the user to modify the applied filters. Hence not applying the filters only if it is worklist
			if (!oState.oWorklistData.bWorkListEnabled) {
				// Call the extension to modify selectionVariant or semanticDates or set tab for NavType !== iAppState as iAppState would have the modified SV values
				// or saved selected tab and hence there is no need to modify them again
				oController.modifyStartupExtension(oStartupObject);
				
				fnApplySelectionVariantToSFB(oStartupObject.selectionVariant, oAppData.selectionVariant || "", true, oStartupObject.semanticDates, false);
			}
			if (!bSmartVariantManagement && oAppData.tableVariantId) {
				oState.oSmartTable.setCurrentVariantId(oAppData.tableVariantId);
			}
			// in case of navigation with URL parameters but no xAppState, no CustomData is provided
			oAppData.customData = oAppData.customData || {};
			
			if (oState.oWorklistData.bWorkListEnabled) {
				// null check done as fix for incident 1870150212
				var oWorklistState = oAppData.customData[dataPropertyNameGeneric] && oAppData.customData[dataPropertyNameGeneric].Worklist ? oAppData.customData[dataPropertyNameGeneric].Worklist : {};
				// restore the state of worklist from IappState
				oState.oWorklistHandler.restoreWorklistStateFromIappState(oWorklistState);
			}
			fnRestorePageState(oAppData.customData, true);
			
			oState.oMultipleViewsHandler.handleStartUpObject(oStartupObject);
			
			// originally global variable, now local, with same initialization
			var bDataAreShownInTable; 
			// If the NavType is iAppState the question of automated data selection is already settled.
			// Otherwise it must be done now. Note that automatisms have been disabled during startup
			// This is the case in FCL scenarios, when navigating from an automatically filled list to a detail.
			// Treat Worklist differently
			if (!oState.oWorklistData.bWorkListEnabled){
				// If the app is reached via cross-app navigation by UX decision the data should be shown immediately
				if (oState.oSmartFilterbar.isCurrentVariantStandard()) {
					// Check if apply automatically is set by User
					bDataAreShownInTable = oState.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardByUser;
				} else {
					bDataAreShownInTable = oState.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled();
				}
				if (bDataAreShownInTable === null || oState.oSmartFilterbar.getLiveMode()) {
					bDataAreShownInTable = true;
				}
				setDataShownInTable(bDataAreShownInTable);
				if (bDataAreShownInTable) {
					oState.oSmartFilterbar.search();
					//collapse header if execute on select is checked or enableautobinding is set
					collapseLRHeaderonLoad();
				}
				setPlaceHolderValue(bDataAreShownInTable);
			}
			
			// IappState needs to be created on app launch in every scenario, irrespective of filter(s) set or load behavior of the application
			changeIappState(true, bDataAreShownInTable);
		}
		

		function fnAdaptToAppStateStartUpInitial(){

			//oStartupObject to be passed to the extension where urlParameters and selectedQuickVariantSelectionKey are optional
			var oStartupObject = {
					selectionVariant: "",
					urlParameters: {},
					selectedQuickVariantSelectionKey: "",
					// incase semantic date field is present, parseNavigation returns semanticDates in stringified format and otherwise an empty object
					semanticDates:  {}
			};
			var oSFBUiState = oState.oSmartFilterbar.getUiState();
			var oSFBSelectionVariant = new SelectionVariant(JSON.stringify(oSFBUiState.getSelectionVariant()));

			// this condition is used to modify selection variant or semantic date when sNavType is initial.
			// do not expose generic and custom data through ext for modification
			fnRemoveCustomAndGenericData(oSFBSelectionVariant);
			var oSFBSelectionVariantCopy = JSON.parse(JSON.stringify(oSFBSelectionVariant));

			var oSFBSemanticDates = oSFBUiState.getSemanticDates();
			oStartupObject.selectionVariant = oSFBSelectionVariant;
			oStartupObject.semanticDates = oSFBSemanticDates;
			oController.modifyStartupExtension(oStartupObject);
			if (!(deepEqual(JSON.parse(JSON.stringify(oStartupObject.selectionVariant)), oSFBSelectionVariantCopy) && deepEqual(oStartupObject.semanticDates, oSFBSemanticDates))) {
				fnApplySelectionVariantToSFB(oStartupObject.selectionVariant, "", true, oStartupObject.semanticDates, true);
			}
			
			oState.oMultipleViewsHandler.handleStartUpObject(oStartupObject);
			
			// originally global variable, now local, with same initialization
			var bDataAreShownInTable; 

			// If the NavType is iAppState the question of automated data selection is already settled.
			// Otherwise it must be done now. Note that automatisms have been disabled during startup
			// However, if bDataAreShownInTable is already true, the data have already been selected and nothing needs to be done anymore.
			// This is the case in FCL scenarios, when navigating from an automatically filled list to a detail.
			// Treat Worklist differently
			if (oState.oWorklistData.bWorkListEnabled) {
				if (oState.oSmartFilterbar.isCurrentVariantStandard()) {
					oState.oWorklistHandler.restoreWorklistStateFromIappState();
				}
			} else {
				if (oState.oSmartFilterbar.isCurrentVariantStandard()) {
					// Check if apply automatically is set by User
					bDataAreShownInTable = oState.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardByUser;
				} else {
					bDataAreShownInTable = oState.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled();
				}
				if (bDataAreShownInTable === null || oState.oSmartFilterbar.getLiveMode()) {
					if (!oState.bLoadListAndFirstEntryOnStartup) {
						var enableAutoBindingForMultiViews = oState.oMultipleViewsHandler.getOriginalEnableAutoBinding();
						var bIsMandatoryFilterNotFilled = checkForMandatoryFilters();
						var sLoadBehaviour = oSettings.dataLoadSettings && oSettings.dataLoadSettings.loadDataOnAppLaunch;
						if ((sLoadBehaviour === null || sLoadBehaviour === undefined) && (enableAutoBindingForMultiViews !== null && enableAutoBindingForMultiViews !== undefined)) {
							bDataAreShownInTable = enableAutoBindingForMultiViews && !bIsMandatoryFilterNotFilled;
						} else {
							bDataAreShownInTable = isDataShown(sLoadBehaviour, bIsMandatoryFilterNotFilled);
						}
					} else {
						bDataAreShownInTable = true;
					}
					if (!bDataAreShownInTable && oState.oSmartFilterbar.isCurrentVariantStandard() && !oState.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardByUser && oState.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardViaXML) {
						oState.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardViaXML = false;
						bDataAreShownInTable = false;
					}
				}
				setDataShownInTable(bDataAreShownInTable);
				if (bDataAreShownInTable) {
					oState.oSmartFilterbar.search();
					//collapse header if execute on select is checked or enableautobinding is set
					collapseLRHeaderonLoad();
				}
				setPlaceHolderValue(bDataAreShownInTable);
			}

			//Set the variant to clean when the user has not altered the filters on the initial load of the app(no navigation context).
			oController.byId('template::PageVariant') && oController.byId('template::PageVariant').currentVariantSetModified(false);

			// IappState needs to be created on app launch in every scenario, irrespective of filter(s) set or load behavior of the application
			changeIappState(true, bDataAreShownInTable);
		}
		
		
		function fnAdaptToAppStateStartUpWithParameters(oAppData, oURLParameters){
			
			handleVariantIdPassedViaURLParams(oURLParameters,bSmartVariantManagement); // not needed in iAppState-case
			
			//oStartupObject to be passed to the extension where urlParameters and selectedQuickVariantSelectionKey are optional
			var oStartupObject = {
					selectionVariant: oAppData.oSelectionVariant,
					urlParameters: oURLParameters,
					selectedQuickVariantSelectionKey: "",
					// incase semantic date field is present, parseNavigation returns semanticDates in stringified format and otherwise an empty object
					semanticDates: (typeof oAppData.semanticDates === "string" ? JSON.parse(oAppData.semanticDates) : oAppData.semanticDates) || {}
			};
			//Apply sort order coming from the XAppState to the smart table.
			if (oAppData.presentationVariant !== undefined) {
				oTemplateUtils.oCommonUtils.setControlSortOrder(oState, oAppData.presentationVariant);
			}
			var oSFBUiState = oState.oSmartFilterbar.getUiState();
			var oSFBSelectionVariant = new SelectionVariant(JSON.stringify(oSFBUiState.getSelectionVariant()));
			var oSFBSelectionVariantCopy = JSON.parse(JSON.stringify(oSFBSelectionVariant));
			var oSFBSemanticDates = oSFBUiState.getSemanticDates();
			if ((oAppData.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("DisplayCurrency") === -1) && (oAppData.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("P_DisplayCurrency") === -1) && (oAppData.oSelectionVariant.getParameterNames().indexOf("P_DisplayCurrency") === -1)) {
				addDisplayCurrency(oAppData);
			}
			// if there is a navigation from external application to worklist,
			// the filters from external application should not be applied since the worklist does not show smartfilterbar
			// and there is no way for the user to modify the applied filters. Hence not applying the filters only if it is worklist
			if (!oState.oWorklistData.bWorkListEnabled) {
				// Call the extension to modify selectionVariant or semanticDates or set tab for NavType !== iAppState as iAppState would have the modified SV values
				// or saved selected tab and hence there is no need to modify them again
				if (oState.oSmartFilterbar.isCurrentVariantStandard()) {
					// given variant has only default values (set by user in FLP), and variant (already loaded) is not user specific
					// => default values have to be added without removing existing values (but overriding them if values for the same filter exist)
					// in case of modify extension, if given variant has only default values, if these values are modified through extension,
					// then they will be replaced in the filterbar accordingly
					oController.modifyStartupExtension(oStartupObject);
					
					fnApplySelectionVariantToSFB(listUtils.getMergedVariants([oSFBSelectionVariant, oStartupObject.selectionVariant]), oAppData.selectionVariant, true, oStartupObject.semanticDates, false);
				} else {
					// if oAppData selection variant is not present, then use filter bar's variant
					fnRemoveCustomAndGenericData(oSFBSelectionVariant);
					oStartupObject.selectionVariant = oSFBSelectionVariant;
					oStartupObject.semanticDates = oSFBSemanticDates;
					oController.modifyStartupExtension(oStartupObject);
					// only if the extension modifies the selection variant or the semanticDates, then set it to smart filter bar again
					if (!(deepEqual(JSON.parse(JSON.stringify(oStartupObject.selectionVariant)), oSFBSelectionVariantCopy) && deepEqual(oStartupObject.semanticDates, oSFBSemanticDates))) {
						fnApplySelectionVariantToSFB(oStartupObject.selectionVariant, oAppData.selectionVariant, true, oStartupObject.semanticDates, false);
					}
				}
			}
			if (!bSmartVariantManagement && oAppData.tableVariantId) {
				oState.oSmartTable.setCurrentVariantId(oAppData.tableVariantId);
			}
			// in case of navigation with URL parameters but no xAppState, no CustomData is provided
			oAppData.customData = oAppData.customData || {};
			
			if (oState.oWorklistData.bWorkListEnabled) {
				// null check done as fix for incident 1870150212
				var oWorklistState = oAppData.customData[dataPropertyNameGeneric] && oAppData.customData[dataPropertyNameGeneric].Worklist ? oAppData.customData[dataPropertyNameGeneric].Worklist : {};
				// restore the state of worklist from IappState
				oState.oWorklistHandler.restoreWorklistStateFromIappState(oWorklistState);
			}
			fnRestorePageState(oAppData.customData, true);
				
			oState.oMultipleViewsHandler.handleStartUpObject(oStartupObject);
			
			// originally global variable, now local, with same initialization
			var bDataAreShownInTable; 
			
			// If the NavType is iAppState the question of automated data selection is already settled.
			// Otherwise it must be done now. Note that automatisms have been disabled during startup
			// However, if bDataAreShownInTable is already true, the data have already been selected and nothing needs to be done anymore.
			// This is the case in FCL scenarios, when navigating from an automatically filled list to a detail.
			// Treat Worklist differently
			if (!oState.oWorklistData.bWorkListEnabled) {
				// If the app is reached via cross-app navigation by UX decision the data should be shown immediately
				if (oState.oSmartFilterbar.isCurrentVariantStandard()) {
					// Check if apply automatically is set by User
					bDataAreShownInTable = oState.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardByUser;
				} else {
					bDataAreShownInTable = oState.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled();
				}
				if (bDataAreShownInTable === null || oState.oSmartFilterbar.getLiveMode()) {
					if (!oState.bLoadListAndFirstEntryOnStartup) {
						var enableAutoBindingForMultiViews = oState.oMultipleViewsHandler.getOriginalEnableAutoBinding();
						var bIsMandatoryFilterNotFilled = checkForMandatoryFilters();
						var sLoadBehaviour = oSettings.dataLoadSettings && oSettings.dataLoadSettings.loadDataOnAppLaunch;
						if ((sLoadBehaviour === null || sLoadBehaviour === undefined) && (enableAutoBindingForMultiViews !== null && enableAutoBindingForMultiViews !== undefined)) {
							bDataAreShownInTable = enableAutoBindingForMultiViews && !bIsMandatoryFilterNotFilled ? true : false;
						} else {
							bDataAreShownInTable = isDataShown(sLoadBehaviour, bIsMandatoryFilterNotFilled);
						}
					} else {
						bDataAreShownInTable = true;
					}
					if (!bDataAreShownInTable && oState.oSmartFilterbar.isCurrentVariantStandard() && !oState.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardByUser && oState.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardViaXML) {
						oState.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardViaXML = false;
						bDataAreShownInTable = false;
					}
				}
				setDataShownInTable(bDataAreShownInTable);
				if (bDataAreShownInTable) {
					oState.oSmartFilterbar.search();
					//collapse header if execute on select is checked or enableautobinding is set
					collapseLRHeaderonLoad();
				}
				setPlaceHolderValue(bDataAreShownInTable);
			}
			
			//Set the variant to clean when the filters are set through FLP Settings or vendor layer and the user has not altered the filters.
			oController.byId('template::PageVariant') && oController.byId('template::PageVariant').currentVariantSetModified(false);
			
			// IappState needs to be created on app launch in every scenario, irrespective of filter(s) set or load behavior of the application
			changeIappState(true, bDataAreShownInTable);
		}
		
		
		// This method is called asynchronously from fnParseUrlAndApplyAppState in case of external navigation (xAppState or UrlParameters) or initial startup
		// as soon as the appstate-information from the url has been parsed completely.
		// In case of  restoring from iAppState, it's called by applyState, which is in turn called from statePreserver, that
		// already takes care of not trying to apply an appstate that is not valid anymore.
		// task of this method is (now always when it's called!) only to adapt the state of all relevant controls to the provided one
		function fnAdaptToAppState(oAppData, oURLParameters, sNavType){
			fnLogInfo("fnAdaptToAppState called", {
				sNavType: sNavType
			});

			oState.oSmartFilterbar.setSuppressSelection(false);
			// separate 3 different cases
			// - restore from iAppState
			// - adapt to navigation parameters
			// - initial startup from scratch (including parameters provided from FLP!)
			
			switch (sNavType){
			case sap.ui.generic.app.navigation.service.NavType.iAppState:
				fnAdaptToAppStateIappState(oAppData);
				break;
			case sap.ui.generic.app.navigation.service.NavType.initial:
				fnAdaptToAppStateStartUpInitial();
				break;
			case sap.ui.generic.app.navigation.service.NavType.xAppState:
			case sap.ui.generic.app.navigation.service.NavType.URLParams:
				if (oAppData.bNavSelVarHasDefaultsOnly){
					fnAdaptToAppStateStartUpWithParameters(oAppData, oURLParameters);
				} else {
					fnAdaptToAppStateNavigation(oAppData, oURLParameters);
				}
				break;
			default:
				fnAdaptToAppState.apply(this, arguments);
			}
		}
		
		

		function applyState(oState){
			if (!oState) {
				return;
			}

			// enhance appData to the format needed by fnAdaptToAppState
			var oAppData = extend({
// data from appState (i.e. provided by getCurrentState, thus stored in LREP and retrieved from there, and therefore provided in oState again)
// just providing defaults				
//				customData: {}, // not necessary, as we have a fallback in fnAdaptToAppState again
//				selectionVariant: undefined,
//				tableVariantId: "",    // -> sTableVariantId, not necessary, as we have a fallback in fnAdaptToAppState again
// id for the appState in the URL - as storing and restoring from URL is task of the statePreserver, we should only be interested in the data here
// data provided with fixed values from navigationHandler in case of iAppState
//				bNavSelVarHasDefaultsOnly: false,	// -> bHasOnlyDefaults, not needed as ndefined is faulthy anyway
				oDefaultedSelectionVariant: new SelectionVariant(), // only accessed to check for P_DisplayCurrency - can this be relevant?
// data that seems to be irrelevant as we don't access them
//				presentationVariant: {}, // only accessed if navType not iAppState (intended for navigation ...)
//				valueTexts: {},
// data that needs to be derived from the other data
				// analysis of navigationHandler -> seems to be wrong. oState.selectionVariant is already stringified
				//				oSelectionVariant: new SelectionVariant(JSON.stringify(oState.selectionVariant || {}))  // -> oSelectionVariant
				oSelectionVariant: new SelectionVariant(oState && oState.selectionVariant)  // -> oSelectionVariant
// remaining: still to be analyzed which category they belong to
			}, oState
//			, {
// data that needs to be derived and override original values				
//				selectionVariant: JSON.stringify(oState.selectionVariant || {})  // -> sSelectionVariant, fallback to "" (instead of "{}")?! - immer auch oSelectionVariant verfügbar (simplification possible), sSelectionVaraint used to compare with realized appState, unteschied zwischen "" und "{}" relevant?
//			}
			);
			fnAdaptToAppState(oAppData, {} /* URLparameter are irrelevant if restoring from iAppState */, sap.ui.generic.app.navigation.service.NavType.iAppState);
		}

		function fnParseUrlAndApplyAppState(){
			var oRet = new Promise(function(fnResolve){
				try {
					var oParseNavigationPromise = oNavigationHandler.parseNavigation();
					oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType){
						if (sNavType !== sap.ui.generic.app.navigation.service.NavType.iAppState) { // handled via state preserver
							// navType initial has also to be handled here, as in that case the call from state preserver happens to early (we don't even know
							// at that time, whether navtype is initial, URLparams or xAppState when started from FLP with user default values set)
							fnAdaptToAppState(oAppData, oURLParameters, sNavType);
						}
						fnResolve();
					});
					oParseNavigationPromise.fail(function(oNavError, oURLParameters, sNavType){
						/* Parsing app state has failed, so we cannot set the correct state
						 * But at least we should get into a consistent state again, so the user can continue using the app
						 */
						oLogger.warning(oNavError.getErrorCode() + "app state could not be parsed - continuing with empty state");
						fnAdaptToAppState({}, oURLParameters, sap.ui.generic.app.navigation.service.NavType.initial); // Use NavType initial, as this will enforce selection in case auto-binding is true.
						fnResolve();
					});
				} catch (oError){
					// in case of an appState key in URL, but no ushell service, navigation handler throws an error (without any additional information)
					// => treat like NavType initial
					// RemarK: Without call to fnAdaptToApState (i.e. assuming (empty) iAppState is being handled by statePreserver), we would miss to apply e.g. dataload settings
					// could be improved by better separation of parsing iAppState from parameters
					// (i.e. if URL contains iAppState
					//		that can be parsed: restore from that one
					//		that cannot be parsed (for whatever reason): initial startup
					//	only if URL contains no iAppState: parse URL parameters)
					fnAdaptToAppState({}, {}, sap.ui.generic.app.navigation.service.NavType.initial); // Use NavType initial, as this will enforce selection in case auto-binding is true.
					fnResolve();
				}
			});
			return oRet;
		}

		// The smart filterbar is triggering this event in order to ensure that we update all stat information within the Smart Filterbar
		// This happens in two scenarios:
		// a) The user saves the current state as a variant -> In this case the SFB needs to know what to save
		// b) The user opens the 'Adapt filters' dialog -> In this case the current state needs to be remembered by the SFB, such that they can reset to this state if the user wants to
		function onBeforeSFBVariantFetch(){
			// In scenario b) no new appstate needs to be created (this only needs to happen when the user changes some filters on the dialog and closes the dialog)
			// In scenario a) a new appstate should be written (containing the new variant name) but the filters should not be considered as being changed.
			// The creation of a new appstate will be triggered by event onAfterSFBVariantSave.
			// Conclusion: We can disconnect from the filter change event while this method is running
			bIgnoreFilterChange = true;

			// check whether variant is dirty when dialog is opened already here, because it would marked as dirty anyway in fireFilterChange
			// as this event is also called in other cases (e.g. scenario a) above), only rely the flag if the dialog is opened
			bDialogOpenedWithDirtyVariant = oController.byId('template::PageVariant') && oController.byId('template::PageVariant').currentVariantGetModified();
			
			// To store the filter data, when the user creates a new variant, the variant management requests the data from the SFB. To enable also data for custom filters to be
			// stored, therefore we have to provide the custom data to the SFB. (Format doesn't matter - when the variant is loaded, in onAfterSFBVariantLoad we just get the same
			// data back by getFilterData and call the extension to restore its data.)
			
			var oCurrentAppState = getCurrentAppState();
			oState.oSmartFilterbar.setCustomFilterData(oCurrentAppState.customData) ;
			
			bIgnoreFilterChange = false; // connect to the filter change event again
		}

		function onAfterSFBVariantSave(){
			changeIappState(true, areDataShownInTable());
		}

		function onAfterSFBVariantLoad(oEvent) {
			var sContext = oEvent.getParameter("context");
			var oData = oState.oSmartFilterbar.getFilterData(true);
			if (oData._CUSTOM !== undefined) {
				if (oState.oWorklistData.bWorkListEnabled) {
					var oCustomData = oData._CUSTOM[dataPropertyNameGeneric]["Worklist"];
					// if worklist data is saved in variant, then it should be applied to
					// searchfield and table rebinding has to be done to restore the state of the app
					oState.oSmartFilterbar.setSuppressSelection(false);
					oState.oWorklistData.oSearchField.setValue(oCustomData.searchString);
					oState.oWorklistData.oSearchField.fireSearch();
				} else {
					fnRestorePageState(oData._CUSTOM);
				}
			} else {
				// make sure that the custom data are nulled for the STANDARD variant
				var oCustomAndGenericData = getPageState();
				fnNullify(oCustomAndGenericData[dataPropertyNameCustom]);
				fnNullify(oCustomAndGenericData[dataPropertyNameGeneric]);
				fnRestorePageState(oCustomAndGenericData);
			}
			// store navigation context
			if (aIrrelevantVariantLoadContext.indexOf(sContext) < 0) {
				setDataShownInTable(oEvent.getParameter("executeOnSelect"));
				collapseLRHeaderonLoad();
				changeIappState(true, areDataShownInTable());
			}
			// reset is only available on the adapt filters dialog, so it makes sense to check bDialogOpenedWithDirtyVariant
			if (sContext === "RESET" && bDialogOpenedWithDirtyVariant){
				// reset on the dialog reset to the persisted version of the variant, even if cancel is used later - but does not trigger a selection
				// (even if variant is marked as execute on select)
				// Thus, as variant was dirty before, this is a change in filter, but no (current) data are shown in the table afterwards
				oAdaptFiltersDialogOpenPromise.then(changeIappState.bind(null, true, false));
			}
		}
		
		function onFiltersDialogBeforeOpen(){
			oAdaptFiltersDialogOpenPromise = new Promise(function(resolve){
				fnResolveAdaptFiltersDialog = resolve;
			});
			
		}
		
		function onFiltersDialogClosed(){
			fnResolveAdaptFiltersDialog();
			// resetting bDialogOpenedWithDirtyVariant here is of no value, as it would also be set in other cases (e.g. when saving the current state as variant)
			// i.e. it makes only sense to check the flag when the adapt filters dialog is open
		}

		function onAfterTableVariantSave() {
			if (!bSmartVariantManagement){
				changeIappState(true, areDataShownInTable());
			}
		}

		function onAfterApplyTableVariant() {
			if (!bSmartVariantManagement){
				changeIappState(true, areDataShownInTable());
			}
		}

		function isDataShown(sLoadBehaviour, bIsMandatoryFilterNotFilled) {
			var bDataLoad;
			var filtersWithValues = oState.oSmartFilterbar.getFiltersWithValues();
			switch (sLoadBehaviour) {
				case "always":
					bDataLoad = !bIsMandatoryFilterNotFilled ? true : false;
					break;
				case "never":
					bDataLoad = false;
					break;
				default:
					bDataLoad = filtersWithValues.length && !bIsMandatoryFilterNotFilled ? true : false;
			}
			return bDataLoad;
		}

		function onSmartFilterBarInitialise(){
			bIsAutoBinding = oState.oSmartTable.getEnableAutoBinding();
			oState.oSmartFilterbar.attachFiltersDialogClosed(oTemplateUtils.oComponentUtils.stateChanged);
			// clarify: do we need to attach oTemplateUtils.oComponentUtils.stateChanged here?
			// actually, it seems that filterChange event is anyway raised again by SFB after dialog is closed (with "go")
		}

		/*
		The function sets executeOnSelect to true if enableAutobinding is true
		*/
		function onSFBVariantInitialise() {
			var sLoadBehaviour = oSettings.dataLoadSettings && oSettings.dataLoadSettings.loadDataOnAppLaunch;
			var multiplePropertyViewName = oState.oMultipleViewsHandler.getSelectedKeyPropertyName();
			var oMultiVieworMultiTabApp = multiplePropertyViewName === "tableTabData" || multiplePropertyViewName === "tableViewData" ? true : false;
			autoBindingFromView = oMultiVieworMultiTabApp ? false : true;
			var multiView = sLoadBehaviour === null || sLoadBehaviour === undefined ? oState.oMultipleViewsHandler.getEnableAutoBinding() : true;
			bIsAutoBinding = autoBindingFromView || multiView;
			if (bIsAutoBinding) {
				var oDataTemplate = new sap.ui.core.CustomData({key:"executeStandardVariantOnSelect", value:true});
				oState.oSmartFilterbar.addCustomData(oDataTemplate);
			}
		}

		//collapse dynamic header if data is preloaded in LR on launch
		function collapseLRHeaderonLoad(){
			// if no data is shown, expand header
			// if data is supposed to be shown and there are mandatory filters, expand header
			// if data is shown and there are no mandatory filters, collapse header
			var oTemplatePrivateModel = oController.getOwnerComponent().getModel("_templPriv");
			oTemplatePrivateModel.setProperty("/listReport/isHeaderExpanded", !areDataShownInTable() || checkForMandatoryFilters());
		}

		/* This function calls the setUiState API of smartfilterbar to set the Ui State
		 * @param  {object} oSelectionVariant -  Selection variant object
		 * @param {boolean} bReplace -  Property bReplace decides whether to replace existing filter data
                 * @param {boolean} bStrictMode - Defines the filter/parameter determination, based on the name.
		*/
		function fnSetFiltersUsingUIState(oSelectionVariant, bReplace, bStrictMode, oSemanticDates) {
			var oUiState = new UIState({
				selectionVariant : oSelectionVariant,
				semanticDates: oSemanticDates
			});
			oState.oSmartFilterbar.setUiState(oUiState, {
				replace: bReplace,
				strictMode: bStrictMode
			});
		}
		
        /*
		The function removes superfluos Custom and Generic data from the SelectVariant (these dataproperies are meant only for the _custom data in iAppState) 
		@param {object} Selection Variant
		*/
		function fnRemoveCustomAndGenericData(oSelectionVariant) {
			oSelectionVariant.removeSelectOption(dataPropertyNameCustom);
			oSelectionVariant.removeSelectOption(dataPropertyNameGeneric);
		}

		/**
		 * This function apply selection properties to the smart filter bar
		 * @param  {object} oSelectionVariant
		 * @param  {string} sSelectionVariant
		 * @return {void}
		 */
		function applySelectionProperties(oSelectionVariant, sSelectionVariant, bNavTypeInitial) {
			// even when the nav type is initial, due to modifystartup extension,new fields can be added to smartfilterbar
			if (oSelectionVariant && (sSelectionVariant !== "" || bNavTypeInitial)){
				var aSelectionVariantProperties = oSelectionVariant.getParameterNames().concat(
					oSelectionVariant.getSelectOptionsPropertyNames());
				for (var i = 0; i < aSelectionVariantProperties.length; i++) {
					oState.oSmartFilterbar.addFieldToAdvancedArea(aSelectionVariantProperties[i]);
				}
			}
		}

		// map property values for property with name sFirstProperty to values for property with name sSecondProperty in oSelectionVariant
		function fnAlignSelectOptions(oSelectionVariant, sFirstProperty, sSecondProperty){
			if (oSelectionVariant.getParameter(sFirstProperty) && !oSelectionVariant.getParameter(sSecondProperty)){
				oSelectionVariant.addParameter(sSecondProperty, oSelectionVariant.getParameter(sFirstProperty));
			}
			if (oSelectionVariant.getSelectOption(sFirstProperty) && !oSelectionVariant.getSelectOption(sSecondProperty)){
				var aSelectOption = oSelectionVariant.getSelectOption(sFirstProperty);
				aSelectOption.forEach(function(oSelectOption){
					oSelectionVariant.addSelectOption(sSecondProperty, oSelectOption.Sign, oSelectOption.Option, oSelectOption.Low, oSelectOption.High);
				});
			}
		}

		function fnMapEditableFieldFor(oSelectionVariant){
			var oMetaModel = oController.getOwnerComponent().getModel().getMetaModel();
			var sEntitySet = oController.getOwnerComponent().getEntitySet();
			var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
			oEntityType.property.forEach(function(oProperty){
				if (oProperty["com.sap.vocabularies.Common.v1.EditableFieldFor"]){
					// annotation property names follow their type, so PropertyPath is the right property to look at - String has to be supported for compatibility reasons
					var sKeyProperty = oProperty["com.sap.vocabularies.Common.v1.EditableFieldFor"].PropertyPath || oProperty["com.sap.vocabularies.Common.v1.EditableFieldFor"].String;
					var sForEditProperty = oProperty.name;
					// map key fields to corresponding for edit properties to provide values in SFB (without mapping in FLP)
					fnAlignSelectOptions(oSelectionVariant, sKeyProperty, sForEditProperty);
					// and vice versa if field is mapped in FLP (formerly recommended), but original field used in SFB (never recommended)
					fnAlignSelectOptions(oSelectionVariant, sForEditProperty, sKeyProperty);
				}
			});
		}

		function fnApplySelectionVariantToSFB(oSelectionVariant, sSelectionVariant, bReplace, oSemanticDates, bNavTypeInitial){
			fnMapEditableFieldFor(oSelectionVariant);
			if (bReplace) {
				oState.oSmartFilterbar.clearVariantSelection();
			}
			applySelectionProperties(oSelectionVariant, sSelectionVariant, bNavTypeInitial);
			fnSetFiltersUsingUIState(oSelectionVariant.toJSONObject(), bReplace, /* bStrictMode = */ false, oSemanticDates);
		}

		//Incase the URL is given with FE-DATA-LOADED/FE-HEADER-LOADED but the app is not configured to load the data on load, the removal of placeholder will not happen at the data-received of the table on LR, so this logic makes sure to remove the placeholder in such case when the app is loaded and no data is shown on the table. 
		function setPlaceHolderValue(bDataAreShownInTable){
			if (!bDataAreShownInTable){
				var aConditionToRemovePlaceholder = ['FE-DATA-LOADED','FE-DATA-LOADED-FIRSTTIMEONLY','FE-HEADER-LOADED','FE-HEADER-LOADED-FIRSTTIMEONLY'];
				placeholderHelper.resetPlaceHolders(oTemplateUtils,aConditionToRemovePlaceholder);
			}
		}

		
		return {
			areDataShownInTable: areDataShownInTable,
			setDataShownInTable: setDataShownInTable,
			parseUrlAndApplyAppState: fnParseUrlAndApplyAppState,
			changeIappState: changeIappState,
			onFiltersDialogBeforeOpen: onFiltersDialogBeforeOpen,
			onFiltersDialogClosed: onFiltersDialogClosed,
			onSmartFilterBarInitialise: onSmartFilterBarInitialise,
			onBeforeSFBVariantFetch: onBeforeSFBVariantFetch,
			onAfterSFBVariantSave: onAfterSFBVariantSave,
			onAfterSFBVariantLoad: onAfterSFBVariantLoad,
			onAfterTableVariantSave: onAfterTableVariantSave,
			onAfterApplyTableVariant: onAfterApplyTableVariant,
			onSFBVariantInitialise: onSFBVariantInitialise,
			applyState: applyState,
			getCurrentAppState: getCurrentAppState, // separation of concerns - only provide state, statePreserver responsible for storing it
			setFiltersUsingUIState : fnSetFiltersUsingUIState
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.ListReport.controller.IappStateHandler", {
		constructor: function(oState, oController, oTemplateUtils) {
			extend(this, getMethods(oState, oController, oTemplateUtils));
		}
	});
});
