/*******************************************************************************
 * Confidential and Proprietary
 *  Copyright © 2016  Genalpha.  All Rights Reserved.
 *******************************************************************************/
var app = angular.module('configApp',['ngTouch', 'ui.bootstrap','ngAnimate', 'angular-loading-bar', 'ngSanitize']);
app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
	//cfpLoadingBarProvider.includeSpinner = false;
	//cfpLoadingBarProvider.parentSelector = 'loading-bar-container';
    //cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    //cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';
  }]);
app.service('moldService', function ($http, $filter) {
	this.toMilliMeter = function(newVal){
		if((newVal) && !isNaN(newVal)){
			return parseFloat((25.400 * newVal).toFixed(2));
		}else{
			return null;
		}
	};
	
	this.toInch = function(newVal){
		if((newVal) && !isNaN(newVal)){
			return parseFloat((newVal / 25.400).toFixed(2));
		}else{
			return null;
		}
	};
	
	this.toCelsius = function(newVal){
		if((newVal) && !isNaN(newVal)){
			return parseFloat(((newVal  -32) * 5 / 9).toFixed(2));
		}else{
			return null;
		}
	};
	
	this.toFahrenheit = function(newVal){
		if((newVal) && !isNaN(newVal)){
			return parseFloat((newVal * 9 / 5 + 32).toFixed(2));
		}else{
			return null;
		}
	};
	
	this.getSelectedObject = function(dataCollection){
		if(dataCollection){
			var newObject = ( $filter('filter')(dataCollection, { selected: "true" }) )[0];
			if(!newObject){
				newObject = dataCollection[0];
			}
			return newObject;
		}
	};
});

app.factory('moldActions', function ($http, $filter, $q, moldService) {
	
	var _onLoadConfigDataCall = function(hrConfiguratorId){
		var dataToPost={"hrConfiguratorId" : hrConfiguratorId};
		var postRef = $http({ method: 'POST', url: 'onloadConfig', data: dataToPost,
			headers: {'Content-Type': undefined}
		});
		if(hrConfiguratorId == ""){
			var mmCadenasSrc = "//moldmasters-embedded.partcommunity.com?info=mold_masters/master_series/ms_pico/hot_runner_assemblies_sprue/h_sub_manf_spr_gat_asmtab.prj";
			$("#iFrameId").attr("src",mmCadenasSrc);
		}
		return postRef;
	};
	var _loadToolTips = function(){
		var getTipsRef = $http.get("cataloglink");
	    return getTipsRef;
	};
	var _requestCadenasLink= function(cadenasData){
		var postRef = $http.post('imagePreview', cadenasData, {headers: {'Content-Type': undefined}});
		return postRef;
	};
	var _saveConfigurator = function(dataToPost){
		var postRef= $http.post('saveConfigurator', dataToPost, {headers: {'Content-Type': undefined}});
		return postRef;
	};
	var _fetchPrice = function(dataToGetPrice){
		var postRef= $http.post('getPriceForConfigurator', dataToGetPrice, {headers: {'Content-Type': undefined}});
		return postRef;
	};	
	return{
		onLoadConfig: function(hrConfiguratorId){
			return _onLoadConfigDataCall(hrConfiguratorId);
		},
		createToolTips: function(){
			return _loadToolTips();
		},
		getCadenasLink: function(dataToPost){
			return _requestCadenasLink(dataToPost);
		},
		saveConfigurator: function(dataToPost){
			return _saveConfigurator(dataToPost);
		},
		getConfiPrice: function(dataToGetPrice){
			return _fetchPrice(dataToGetPrice);
		}
	};
	
});

app.controller('configController',function($scope , $http, $filter, $parse, moldService, moldActions){
	$scope.init = function() {
	
		$scope.mmGeneral ={};
		$scope.mmComponent ={};
		$scope.mmGeneral.configCollection = {};
		$scope.mmComponent.configCollection ={};
		$scope.mmCadenas={};
		$scope.helpTips = {};
		$scope.helpTips.tooltip ={};
		$scope.selectedCollection = {};
		$scope.responseCollection ={};
		$scope.mmController={};
		$scope.permissions={};
		$scope.mmprice={};
		
		//My VAR NULS : INITILIZING
		$scope.changeInGeneral = $scope.changeInNozzles = $scope.changeInComponents = $scope.changeInControllers = false;
		
		$scope.mmGeneral.genShotWeight = $scope.mmGeneral.genFillTime = $scope.mmGeneral.genMethods =  null;
		$scope.mmGeneral.genProductLineId = $scope.mmGeneral.Pitch1 = $scope.mmGeneral.Pitch2 = null;
		
		$scope.mmGeneral.showXCoordinates = $scope.mmGeneral.showYCoordinates = $scope.mmGeneral.showXeqlYComment = false;
		$scope.mmGeneral.disableButons = true;
		$scope.mmGeneral.genProductLine = '';
		
		$scope.mmGeneral.Pitch1Max = $scope.mmGeneral.Pitch1Min = $scope.mmGeneral.Pitch2Max = $scope.mmGeneral.Pitch2Min = 0;
		
		/*$scope.mmGeneral.configCollection.gPlasticMat.processTempMin = 0;
    	$scope.mmGeneral.configCollection.gPlasticMat.processTempMax = 0;
    	$scope.mmGeneral.configCollection.gPlasticMat.moldTempMin = 0;
    	$scope.mmGeneral.configCollection.gPlasticMat.moldTempMax = 0;*/
		
		$scope.mmComponent.DegreeSymbol ="&#8451;";
		$scope.mmComponent.genNozzleLength = null;
		$scope.mmComponent.showElements = true;
		$scope.mmComponent.inletComponentsCollection = {};
		$scope.mmComponent.cCenterHeaterPkgCollection = {};
		$scope.mmComponent.isControllerIncluded = false;
		$scope.mmComponent.cGateDiameterMinVal =0;
		$scope.mmComponent.cGateDiameterMaxVal =10;
		$scope.mmComponent.cGateDiameter =null;
		$scope.mustShowNozzleImage = true;
		$scope.mmConfiguratorForm.valvePinActuatorValidation = false;
		$scope.manifoldId = null;
		$scope.configuratorName ="";
		
		//For roles and permissions
		$scope.permissions.hasPriceAccess = $scope.permissions.hasQuoteAccess = $scope.permissions.hasOrderAccess = $scope.permissions.CanPlaceOrderPOCC = false;
		$scope.permissions.CanCreateQuote = $scope.permissions.CreateQuoteForNotMappedOrg = false;
		
		$scope.mmCadenas.disableRefreshBtn = $scope.mmprice.disableRefreshBtn = $scope.isOnLoadCall = true;
		$scope.changeNotFromProductLineCall =  $scope.isProductLineOnFire = true;
		
		$scope.mmController.partId ={};
		$scope.mmGeneral.configCollection.gUnit = {};
    	$scope.mmGeneral.configCollection.gNoDrops = {};
    	$scope.mmGeneral.configCollection.gViscosity = {};
    	$scope.mmGeneral.configCollection.gPlasticMat = {};
    	$scope.mmGeneral.configCollection.gGatingType = {};
    	
		$scope.hrConfiguratorId = document.getElementById("configuratorId").value;
		moldActions.onLoadConfig($scope.hrConfiguratorId)
		.then(
			function(response) {
				$scope.prePopulatingValues(response.data);
			},
			function(errResponse){
				console.error(errResponse);
			}
		);
		moldActions.createToolTips().then(
			function(response) {
				$scope.helpTips = response.data;
			},
			function(errResponse){
				console.error(errResponse);
			}
		);
	};
	$scope.init();
	
	$scope.getSelectedObject = function(dataObj){
		return moldService.getSelectedObject(dataObj);
	};
	
	$scope.isNumeric = function (e) {
        if (!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode == 8) || (e.keyCode == 9))) {
            return e.preventDefault();
        }
    };
	/**************************************************************************
	 * SETTING DEFAULTS / PRE-SELECTED VALUES (EDIT)
	 **************************************************************************/
	$scope.prePopulatingValues = function(data){
		$scope.mmGeneral.configCollection.gUnit = data.unit;
    	$scope.mmGeneral.configCollection.gNoDrops = data.drop;
    	$scope.mmGeneral.configCollection.gViscosity = data.viscosity;
    	$scope.mmGeneral.configCollection.gPlasticMat = data.plasticMaterials;
    	
    	$scope.mmGeneral.configCollection.gGatingType = data.gatingTypes;
    	$scope.mmGeneral.genShotWeight = parseFloat(data.shotweightId) ? parseFloat(data.shotweightId): null;
    	$scope.mmGeneral.genFillTime = parseFloat(data.fillTime) ? parseFloat(data.fillTime): null;
    	$scope.configuratorName = data.configuratorName;
    	$scope.mmGeneral.Pitch1 = data.x1Pitch;
    	$scope.mmGeneral.Pitch2 = (data.x2Pitch)? data.x2Pitch : data.yPitch;
    	
    	$scope.mmComponent.isControllerIncluded = data.isControllerIncluded;

		$scope.isProductLineOnFire = true;
		//Units
		$scope.mmGeneral.genUnit = moldService.getSelectedObject($scope.mmGeneral.configCollection.gUnit).unitId;
		if($scope.mmGeneral.genUnit ==2 ) {
    		$scope.mmGeneral.Pitch1 = moldService.toInch($scope.mmGeneral.Pitch1);
			$scope.mmGeneral.Pitch2 = moldService.toInch($scope.mmGeneral.Pitch2);
			$scope.mmGeneral.unitLabel ="in";
    	};
		//Drops
		$scope.mmGeneral.genNoDrops =  moldService.getSelectedObject($scope.mmGeneral.configCollection.gNoDrops);
		//PlasticMaterial
		var _tempPlMaterial = moldService.getSelectedObject($scope.mmGeneral.configCollection.gPlasticMat);
		$scope.mmGeneral.genPlasticMaterial = _tempPlMaterial.materialId;
		//Mold Temperature
		$scope.mmComponent.cMoldTemperature = _tempPlMaterial.moldTemperatue;
		//Processing Temperature
		$scope.mmComponent.cProTemperature = _tempPlMaterial.processTemperature;
		//Viscosity
		$scope.mmGeneral.genViscosity = moldService.getSelectedObject($scope.mmGeneral.configCollection.gViscosity).viscosityId;
		//GatingType
		$scope.mmGeneral.genTypes = moldService.getSelectedObject($scope.mmGeneral.configCollection.gGatingType).gateTypeId;
		//ManifoldStyle
		$scope.selectedCollection.gManifoldStyle = moldService.getSelectedObject($scope.mmGeneral.genNoDrops.ManifoldStyle);
		
		$scope.permissions.hasPriceAccess = data.hasPriceAccess;
		$scope.permissions.hasQuoteAccess = data.hasQuoteAccess;
		$scope.permissions.hasOrderAccess = data.hasOrderAccess;
		$scope.permissions.CanPlaceOrderPOCC = data.CanPlaceOrderPOCC;
		$scope.permissions.CanCreateQuote = data.CanCreateQuote;
		$scope.permissions.CreateQuoteForNotMappedOrg = data.CreateQuoteForNotMappedOrg;
		
		$scope.onManifoldStyleChange();
		
		$scope.mmCadenas.disableRefreshBtn = true;
		$scope.isProductLineOnFire = false;
	};
	
	/************************************************
	 * 	ACTION CALLS START FROM HERE
	 ***********************************************/
	$scope.highlightTabChange = function(tabNames){
		for(var i=0;i<tabNames.length; i++){
			if( ($scope.tab == 1 && tabNames[i] != "General") ||
				($scope.tab == 2 && tabNames[i] != "Nozzles") ||
				($scope.tab == 3 && tabNames[i] != "Components") ||
				($scope.tab == 3 && tabNames[i] != "Controllers")
			){
				var newRef =$parse( "changeIn" + tabNames[i]);
				newRef.assign($scope, true);
			};
		}
	};
	
	$scope.convertMPitchValues = function(){
		if($scope.mmGeneral.genUnit == 1){
			$scope.mmGeneral.Pitch1 = moldService.toMilliMeter($scope.mmGeneral.Pitch1);
			$scope.mmGeneral.Pitch2 = moldService.toMilliMeter($scope.mmGeneral.Pitch2);
			$scope.mmGeneral.unitLabel ="mm";
			
			$scope.mmGeneral.Pitch1Max = ($scope.manifoldId[0].Xmax) ? parseFloat($scope.manifoldId[0].Xmax) : 0;
			$scope.mmGeneral.Pitch1Min = ($scope.manifoldId[0].Xmin) ? parseFloat($scope.manifoldId[0].Xmin) : 0;
			$scope.mmGeneral.Pitch2Max = ($scope.manifoldId[0].Ymax) ? parseFloat($scope.manifoldId[0].Ymax) : 0;
			$scope.mmGeneral.Pitch2Min = ($scope.manifoldId[0].Ymin) ? parseFloat($scope.manifoldId[0].Ymin) : 0;
		}else if($scope.mmGeneral.genUnit ==2){
			$scope.mmGeneral.Pitch1 = moldService.toInch($scope.mmGeneral.Pitch1);
			$scope.mmGeneral.Pitch2 = moldService.toInch($scope.mmGeneral.Pitch2);
			$scope.mmGeneral.unitLabel ="in";

			$scope.mmGeneral.Pitch1Max = moldService.toInch($scope.mmGeneral.Pitch1Max);
			$scope.mmGeneral.Pitch1Min = moldService.toInch($scope.mmGeneral.Pitch1Min);
			$scope.mmGeneral.Pitch2Max = moldService.toInch($scope.mmGeneral.Pitch2Max);
			$scope.mmGeneral.Pitch2Min = moldService.toInch($scope.mmGeneral.Pitch2Min);
		}
	};
	
	$scope.convertTemperatureValues = function(){
		if($scope.mmGeneral.genUnit == 1){
			//to Celsius
			$scope.mmComponent.cMoldTemperature = moldService.toCelsius($scope.mmComponent.cMoldTemperature);
			$scope.mmComponent.cProTemperature =  moldService.toCelsius($scope.mmComponent.cProTemperature);
			$scope.mmComponent.DegreeSymbol = "&#8451;";

			$scope.mmGeneral.configCollection.gPlasticMat.processTempMin = moldService.toCelsius($scope.mmGeneral.configCollection.gPlasticMat.processTempMin);
			$scope.mmGeneral.configCollection.gPlasticMat.processTempMax =  moldService.toCelsius($scope.mmGeneral.configCollection.gPlasticMat.processTempMax);
	    	$scope.mmGeneral.configCollection.gPlasticMat.moldTempMin =  moldService.toCelsius($scope.mmGeneral.configCollection.gPlasticMat.moldTempMin);
	    	$scope.mmGeneral.configCollection.gPlasticMat.moldTempMax =  moldService.toCelsius($scope.mmGeneral.configCollection.gPlasticMat.moldTempMax);
			
		}else if($scope.mmGeneral.genUnit ==2){
			//to Fahrenheit 
			$scope.mmComponent.cMoldTemperature =  moldService.toFahrenheit($scope.mmComponent.cMoldTemperature);
			$scope.mmComponent.cProTemperature = moldService.toFahrenheit($scope.mmComponent.cProTemperature);
			$scope.mmComponent.DegreeSymbol = "&#8457;";

			$scope.mmGeneral.configCollection.gPlasticMat.processTempMin = moldService.toFahrenheit($scope.mmGeneral.configCollection.gPlasticMat.processTempMin);
			$scope.mmGeneral.configCollection.gPlasticMat.processTempMax =  moldService.toFahrenheit($scope.mmGeneral.configCollection.gPlasticMat.processTempMax);
	    	$scope.mmGeneral.configCollection.gPlasticMat.moldTempMin =  moldService.toFahrenheit($scope.mmGeneral.configCollection.gPlasticMat.moldTempMin);
	    	$scope.mmGeneral.configCollection.gPlasticMat.moldTempMax =  moldService.toFahrenheit($scope.mmGeneral.configCollection.gPlasticMat.moldTempMax);
		}
	};
		
	$scope.changeInUnit = function(){
		$scope.convertMPitchValues();
		$scope.convertTemperatureValues();
		$scope.highlightTabChange(['Components']);
		
		if($scope.mmGeneral.genProductLineId){
			var manifoldStyleId = ($scope.selectedCollection.gManifoldStyle.manifoldStyleId)? $scope.selectedCollection.gManifoldStyle.manifoldStyleId : null;
			var unitId = ($scope.mmGeneral.genUnit)? $scope.mmGeneral.genUnit : null;
			var manifoldId = ($scope.manifoldId)? $scope.manifoldId[0].manifoldId : null;
			var productLine = ($scope.mmGeneral.genProductLineId)? $scope.mmGeneral.genProductLineId : null;
		  	var gatingType = ($scope.mmGeneral.genTypes)? $scope.mmGeneral.genTypes : null;
		  	var gmplId = ($scope.gatingmethodProductLineId)? $scope.gatingmethodProductLineId : null;
		  	var gatingMethodderivation = 'onChangeOfUnit?manifoldStyle='+manifoldStyleId+'&unitId='+unitId+'&productLine='+productLine+'&gatingType='+gatingType+'&manifoldId='+manifoldId+'&gmplId='+gmplId;
		  	var getRef = $http.get(gatingMethodderivation);
		  	getRef.success(function(data) {
			    
		  		if(data.inletDisplay){
					$scope.mmComponent.configCollection.cSphericalRadius = data.inletDisplay.spericalRadiusValue;
					$scope.mmComponent.cSphericalRadius = moldService.getSelectedObject($scope.mmComponent.configCollection.cSphericalRadius);
					
					if(data.inletDisplay.inletLength){
						$scope.mmComponent.configCollection.cInletExtensionLength = data.inletDisplay.inletLength;
						$scope.mmComponent.cInletExtensionLength 	= moldService.getSelectedObject(data.inletDisplay.inletLength);
						$scope.mmComponent.inletExtensionLengthId 	= $scope.mmComponent.cInletExtensionLength;
					}
					if(data.inletDisplay.inletStyle){
						$scope.mmComponent.configCollection.cInletExtenstionStyle=data.inletDisplay.inletStyle;
						$scope.mmComponent.cInletExtenstionStyle	= moldService.getSelectedObject(data.inletDisplay.inletStyle);
						$scope.mmComponent.inletExtensionStyleId 	= $scope.mmComponent.cInletExtenstionStyle .inletExtensionStyleId
					}
					if(data.inletDisplay.inletExtensionType){
						$scope.mmComponent.cInletComponent = data.inletDisplay.inletExtensionType;
						$scope.mmComponent.inletComponentTypeId =data.inletDisplay.inletExtensionTypeId;
						if($scope.mmComponent.inletComponentTypeId == 3){
							$scope.mmComponent.showElements = true;
						}
						else if(($scope.mmComponent.inletComponentTypeId == 1) && (data.inletComponents)){
							var tempFilterObj = $filter('filter')(
								data.inletComponents, { spericalRadiusValue: $scope.mmComponent.cSphericalRadius.radiusValue}
				 			);
							if(tempFilterObj){
								$scope.mmComponent.cCenterHeaterPkgCollection =tempFilterObj;
								$scope.mmComponent.cCenterHeaterPkg = moldService.getSelectedObject(tempFilterObj);
								$scope.mmComponent.showElements = false;
							};
						}else{
							$scope.mmComponent.showElements = false;
						}
						
					}
				};
				if(data.inletComponents){
					$scope.mmComponent.inletComponentsCollection = data.inletComponents;
					$scope.getinletComponent();
					
					if($scope.mmComponent.inletExtensionLengthId){
						inletExtensionLengthId: $scope.mmComponent.inletExtensionLengthId.inletExtensionLengthId
						inletExtensionStyleId: $scope.mmComponent.inletExtensionStyleId
					}
				}
				if(data.valveActuatorsList){
					$scope.mmComponent.configCollection.cValvePinActuator = data.valveActuatorsList;
					$scope.mmComponent.cValvePinActuator = moldService.getSelectedObject(data.valveActuatorsList);
				}
				if(data.locatingRingList){
					//LocatingRing
					$scope.mmComponent.configCollection.clocatingRing = data.locatingRingList;
					$scope.mmComponent.clocatingRing =moldService.getSelectedObject(data.locatingRingList);
				}
		  		
		  	})
		    .error(function(data) {
		    	//$scope.mmGeneral = data;
	            //alert( "failure");
	            //alert( data);
	        });
		}
	};
	$scope.changeInNoDrops = function(){
		var manifoldStyleObj =moldService.getSelectedObject($scope.mmGeneral.genNoDrops.ManifoldStyle);
		if($scope.mmGeneral.genNoDrops.dropsId==1   && ($scope.mmGeneral.genProductLineId ==1 || $scope.mmGeneral.genProductLineId ==2)){
			$scope.selectedCollection.gManifoldStyle = $scope.mmGeneral.genNoDrops.ManifoldStyle[1];
		}else{
			$scope.selectedCollection.gManifoldStyle = manifoldStyleObj;
		}
		$scope.onManifoldStyleChange();
		var mPitches = $scope.selectedCollection.gManifoldStyle.axis.split(";"); //$scope.mmGeneral.genNoDrops.ManifoldStyle[0].axis.split(";");
		$scope.mmGeneral.PitchesLbl1 = mPitches[0];
		$scope.mmGeneral.PitchesLbl2 = mPitches[1];
		$scope.isOnLoadCall=false;
		$scope.changeNotFromProductLineCall = true;
	};
	$scope.onGatingSealPackageChange = function(){
		var _tempGatesealPkg = ($filter('filter')(
			$scope.mmComponent.configCollection.cGatingSealPackage, {gatesealId: $scope.mmComponent.cGatingSealPackage}
		))[0];
		//Range
		var _tempDiameterAry 					= _tempGatesealPkg.gateDiameter.split("-");
		$scope.mmComponent.cGateDiameterMinVal	= (parseFloat(_tempDiameterAry[0])) ? parseFloat(_tempDiameterAry[0]): 0;
		$scope.mmComponent.cGateDiameterMaxVal	= (_tempDiameterAry[1]) ? parseFloat(_tempDiameterAry[1]) : parseFloat(_tempDiameterAry[0]);
		$scope.mmComponent.cGateDiameter = (parseFloat(_tempDiameterAry[0]))? parseFloat(_tempDiameterAry[0]): 0;
		$scope.mmCadenas.disableRefreshBtn = false;
	};
	$scope.onSphericalRadiusChange = function(){
		if(($scope.mmComponent.inletComponentTypeId == 1) && ($scope.mmComponent.inletComponentsCollection)){
			var tempFilterObj = $filter('filter')(
				$scope.mmComponent.inletComponentsCollection, { spericalRadiusValue: $scope.mmComponent.cSphericalRadius.radiusValue}
 			);
			if(tempFilterObj){
				$scope.mmComponent.cCenterHeaterPkgCollection =tempFilterObj;
				$scope.mmComponent.cCenterHeaterPkg = moldService.getSelectedObject(tempFilterObj);
				$scope.mmComponent.showElements = false;
			};
		}
		$scope.mmCadenas.disableRefreshBtn = false;
		$scope.getinletComponent();
	};
	$scope.onManifoldStyleChange = function(){
		$scope.mmGeneral.showXeqlYComment = false;
		if($scope.selectedCollection.gManifoldStyle.manifoldStyleId == 4 || $scope.selectedCollection.gManifoldStyle.manifoldStyleId == 5 || $scope.selectedCollection.gManifoldStyle.manifoldStyleId == 6){
			$scope.mmGeneral.showXeqlYComment = true;
			if($scope.selectedCollection.gManifoldStyle.manifoldStyleId == 4){
				$scope.mmGeneral.showXeqlYCommentText = "* Manifold Pitches X2 = (X1 * 3)";
			}else{
				$scope.mmGeneral.showXeqlYCommentText = "* Manifold Pitches X = Y";
			}
			
		}else{
			$scope.mmGeneral.showXeqlYComment = false;
		}
		$scope.changeNotFromProductLineCall = true;
		if($scope.mmConfiguratorForm.inputManifoldPitch1){$scope.mmConfiguratorForm.inputManifoldPitch1.$pristine = true};
		if($scope.mmConfiguratorForm.inputManifoldPitch2){$scope.mmConfiguratorForm.inputManifoldPitch2.$pristine = true}
	};
	$scope.onXPitchesChange = function(){
		if($scope.mmGeneral.showXeqlYComment && $scope.selectedCollection.gManifoldStyle.manifoldStyleId == 4 ){
			$scope.mmGeneral.Pitch2 = parseFloat($scope.mmGeneral.Pitch1) * 3;
			
		}else if($scope.mmGeneral.showXeqlYComment){
			$scope.mmGeneral.Pitch2 = $scope.mmGeneral.Pitch1;
		}
		$scope.mmCadenas.disableRefreshBtn = false;
	};
	$scope.loadNozzleImg = function(){
		$scope.mustShowNozzleImage = true;
	};
	$scope.hideNozzleImg = function(){
		$scope.mustShowNozzleImage = false;
	};
	$scope.showDialog = function(dText){
		$('.alertModal .modal-body.custom-modal-body').text(dText);
		$(".alertModal").show();
        $(".alertModal .modal-dialog").draggable({
            handle: ".modal-header"
        });
	}
	$scope.unitBasedValue = function(){
		var tempUnitObj = {};
		if($scope.mmGeneral.genUnit == 2){
			tempUnitObj.Pitch1 = moldService.toMilliMeter($scope.mmGeneral.Pitch1);
			tempUnitObj.Pitch2 = moldService.toMilliMeter($scope.mmGeneral.Pitch2);
			//to Celsius
			tempUnitObj.cMoldTemperature = moldService.toCelsius($scope.mmComponent.cMoldTemperature);
			tempUnitObj.cProTemperature = moldService.toCelsius($scope.mmComponent.cProTemperature);
		}
		else{
			tempUnitObj.Pitch1 = ($scope.mmGeneral.Pitch1) ?  Math.round(($scope.mmGeneral.Pitch1), 2) : null;
			tempUnitObj.Pitch2 = ($scope.mmGeneral.Pitch2) ?  Math.round(($scope.mmGeneral.Pitch2), 2) : null;
			//to Fahrenheit 
			tempUnitObj.cMoldTemperature = ($scope.mmComponent.cMoldTemperature) ? ($scope.mmComponent.cMoldTemperature) : null;
			tempUnitObj.cProTemperature = ($scope.mmComponent.cProTemperature) ? ($scope.mmComponent.cProTemperature) : null;
		}
		return tempUnitObj;
	};
	
	$scope.getinletComponent = function(){
		var inletComponentObj =
		($filter('filter')(
				$filter('filter')(
				$scope.mmComponent.inletComponentsCollection, {inletComponentTypeId: $scope.mmComponent.inletComponentTypeId}
				),{spericalRadiusValue: ($scope.mmComponent.cSphericalRadius.radiusValue)? $scope.mmComponent.cSphericalRadius.radiusValue: null}
		));
		if($scope.mmComponent.cInletExtensionLength && $scope.mmComponent.cInletExtenstionStyle){
			inletComponentObj =
				($filter('filter')(	
					$filter('filter')(
						inletComponentObj, {inletExtensionStyleId: $scope.mmComponent.cInletExtenstionStyle.inletExtensionStyleId}
		 			),{inletExtensionLengthId: $scope.mmComponent.cInletExtensionLength.inletExtensionLengthId}
				))[0];
		};
		if($scope.mmComponent.cCenterHeaterPkg){
			inletComponentObj =
			$filter('filter')(
				inletComponentObj, {inletComponentProductNumber: $scope.mmComponent.cCenterHeaterPkg.inletComponentProductNumber}
 			);
		};
		if(inletComponentObj.length > 0){
			inletComponentObj = inletComponentObj[0];
		}
		
		$scope.mmComponent.cInletComponentObj = (inletComponentObj)? inletComponentObj : null;
		if($scope.mmComponent.cInletComponentObj){
			$scope.mmComponent.cInletComponentId = $scope.mmComponent.cInletComponentObj.inletComponentId;
		}
		$scope.mmCadenas.disableRefreshBtn = false;
	};
	
	$scope.postDataCollection = function(controllerName){
		var tempUnitObj = $scope.unitBasedValue();	
		_tempCollection ={
			 "productLineId"	: ($scope.mmGeneral.genProductLineId)? $scope.mmGeneral.genProductLineId : null,
			 "gatingTypeId"		: ($scope.mmGeneral.genTypes)? $scope.mmGeneral.genTypes : null,
			 "gateDiameter"		: ($scope.mmComponent.cGateDiameter)? $scope.mmComponent.cGateDiameter : null,
			 "moldTemperature"	: tempUnitObj.cMoldTemperature,
			 "processingTemperature": tempUnitObj.cProTemperature
		};
		
		if (controllerName == "Cadenas"){
			_tempCollection.manifoldLocator = 'ML0015';
			_tempCollection.GatingMethodId = ($scope.mmGeneral.genMethods.GatingMethodId)? $scope.mmGeneral.genMethods.GatingMethodId : null;
			_tempCollection.inletcomponent = ($scope.mmComponent.cInletComponentObj.inletComponentProductNumber)?$scope.mmComponent.cInletComponentObj.inletComponentProductNumber : null;
			_tempCollection.locatingRing = ($scope.mmComponent.clocatingRing)? (($scope.mmComponent.clocatingRing.locatingRingProductNumber)? $scope.mmComponent.clocatingRing.locatingRingProductNumber: null) : null; 
			_tempCollection.manifoldStyle = ($scope.selectedCollection.gManifoldStyle.manifoldStyleId)? $scope.selectedCollection.gManifoldStyle.manifoldStyleId : null;
			_tempCollection.nozzleId = ($scope.mmComponent.genNozzleLength)? ( ($scope.mmComponent.genNozzleLength.nozzlePackage) ? $scope.mmComponent.genNozzleLength.nozzlePackage: null) : null;									 
			_tempCollection.pitches = '{'+(($scope.mmGeneral.PitchesLbl1 )? $scope.mmGeneral.PitchesLbl1 +"="+ tempUnitObj.Pitch1 : null )+'}'+','+'{'+ (($scope.mmGeneral.PitchesLbl2 )? $scope.mmGeneral.PitchesLbl2 + "="+ tempUnitObj.Pitch2 : null )+'}';
			_tempCollection.valveActuator = ($scope.mmComponent.cValvePinActuator)?( ($scope.mmComponent.cValvePinActuator.valvepinProductNumber) ? $scope.mmComponent.cValvePinActuator.valvepinProductNumber: null) : null;
		}
		else if (controllerName == "Save" || controllerName == "GetPrice" || controllerName == "RequestQuote" || controllerName == "CreateOrder" || controllerName =="ProductLine"){
			_tempCollection.hrConfiguratorId = ($scope.hrConfiguratorId)? $scope.hrConfiguratorId: null;
			_tempCollection.configuratorName = ($scope.configuratorName)? $scope.configuratorName: 'Test' + Math.round(Math.random() * 1000);
			_tempCollection.unitId 		= ($scope.mmGeneral.genUnit)? $scope.mmGeneral.genUnit : null;
			_tempCollection.dropsId = ($scope.mmGeneral.genNoDrops.dropsId)? $scope.mmGeneral.genNoDrops.dropsId : null;
			_tempCollection.plasticmaterialId = ($scope.mmGeneral.genPlasticMaterial)? $scope.mmGeneral.genPlasticMaterial : null;
			_tempCollection.shotweightId = ($scope.mmGeneral.genShotWeight)? $scope.mmGeneral.genShotWeight : null;
			_tempCollection.fillTime = ($scope.mmGeneral.genFillTime)? $scope.mmGeneral.genFillTime : null;
			_tempCollection.nozzleLength = ($scope.mmComponent.genNozzleLength.nozzleLength)? $scope.mmComponent.genNozzleLength.nozzleLength : null;
			_tempCollection.gatingMethodId = ($scope.mmGeneral.genMethods.GatingMethodId)? $scope.mmGeneral.genMethods.GatingMethodId : null;

			_tempCollection.manifoldId = ($scope.manifoldId)? $scope.manifoldId[0].manifoldId : null;
			_tempCollection.manifoldStyleId = ($scope.selectedCollection.gManifoldStyle.manifoldStyleId)? $scope.selectedCollection.gManifoldStyle.manifoldStyleId : null;
			_tempCollection.nozzleId = ($scope.mmComponent.genNozzleLength.nozzleId)? $scope.mmComponent.genNozzleLength.nozzleId : null;
			_tempCollection.x1Pitch = tempUnitObj.Pitch1;
			_tempCollection.x2Pitch = ($scope.mmGeneral.PitchesLbl2 =="X2")? (tempUnitObj.Pitch2) : null;
			_tempCollection.yPitch = ($scope.mmGeneral.PitchesLbl2 =="Y")? (tempUnitObj.Pitch2) : null;
			_tempCollection.spericalRadiusValue = ($scope.mmComponent.cSphericalRadius.radiusValue)? $scope.mmComponent.cSphericalRadius.radiusValue : null;
			_tempCollection.inletcomponentId = ($scope.mmComponent.cInletComponentId)? $scope.mmComponent.cInletComponentId : null;
			_tempCollection.inletExtensionLengthId = ($scope.mmComponent.cInletExtensionLength) ? (($scope.mmComponent.cInletExtensionLength.inletExtensionLengthId)? $scope.mmComponent.cInletExtensionLength.inletExtensionLengthId : null) : null;
			_tempCollection.inletExtensionStyleId = ($scope.mmComponent.cInletExtenstionStyle)? (($scope.mmComponent.cInletExtenstionStyle.inletExtensionStyleId)? $scope.mmComponent.cInletExtenstionStyle.inletExtensionStyleId : null): null;
			_tempCollection.gatesealId = ($scope.mmComponent.cGatingSealPackage)? $scope.mmComponent.cGatingSealPackage : null;
			_tempCollection.locatingRingId = ($scope.mmComponent.clocatingRing.locatingRingId)? $scope.mmComponent.clocatingRing.locatingRingId : null;
			_tempCollection.valveActuatorId = ($scope.mmComponent.cValvePinActuator) ? (($scope.mmComponent.cValvePinActuator.valveActuatorId)? $scope.mmComponent.cValvePinActuator.valveActuatorId : null): null;
			_tempCollection.isControllerIncluded = ($scope.mmComponent.isControllerIncluded)? $scope.mmComponent.isControllerIncluded : false;
			_tempCollection.controllerPartId = ($scope.mmController.partId)? $scope.mmController.partId : 0;
			_tempCollection.viscosityId = ($scope.mmGeneral.genViscosity )? $scope.mmGeneral.genViscosity  : null;
		}
		return _tempCollection;
	};
	
	$scope.refeshCadenasSrc = function(){
		
		/************************************************************
		 * 	CALLING Cadenas
		 *************************************************************/
		 var cadenasData= $scope.postDataCollection("Cadenas");
		 moldActions.getCadenasLink(cadenasData).then(
			function(response) {
				$scope.mmCadenas.disableRefreshBtn = true;
				$scope.mmCadenas.tempSource= response.data;
				$("#iFrameId").attr("src",$scope.mmCadenas.tempSource);
			},
			function(errResponse){
				console.error(errResponse);
			}
		);
	};
	$scope.saveConfigurator = function(){
		//alert("Saving...");
		if(!($scope.mmGeneral.genShotWeight && $scope.mmGeneral.genFillTime && $scope.configuratorName &&
			 $scope.mmGeneral.genProductLineId && $scope.mmComponent.genNozzleLength)
		  ){
			if(!$scope.configuratorName){
				$scope.mmConfiguratorForm.inputSaveName.$pristine = false;
				$scope.mmConfiguratorForm.inputSaveName.$invalid = true;
			}
			$scope.showDialog("Required values are missing!");
			return false;
		};
		var dataToSave= $scope.postDataCollection("Save");
		moldActions.saveConfigurator(dataToSave).then(
			function(response) {
				if(response.data){
					$scope.hrConfiguratorId = response.data;
				}
				$scope.showDialog(this.savemsg);
			},
			function(errResponse){
				$scope.showDialog("Failure message: " + errResponse );
			}
		);
	};
	//getPrice
	$scope.getPriceConfigurator = function(){
		//alert("Get Price");
		if(!(
			($scope.mmGeneral.genShotWeight && $scope.mmGeneral.genFillTime && $scope.mmGeneral.genProductLineId) && 
			(($scope.mmGeneral.showXCoordinates)? !isNaN((parseFloat($scope.mmGeneral.Pitch1))) : true) && 
			($scope.mmComponent.genNozzleLength && $scope.mmComponent.cProTemperature &&
			  $scope.mmComponent.cMoldTemperature && $scope.mmComponent.cGateDiameter)
			)
		   ){
			$scope.showDialog("Required values are missing!");
			return false;
		};
		var dataToPrice = $scope.postDataCollection("GetPrice");
		moldActions.getConfiPrice(dataToPrice).then(
			function(response) {
				console.log('price resp'+ response);
				if((typeof response.data) == "object"){
					$(".save-configurator-section.price_list").fadeIn();
					$(".save-configurator-section.error_price").hide();
					$(".price_list .listPrice, .price_list .youSaveAmt, .price_list .itemTotalAmt").hide();
					$(".price_list .yourPrice, .price_list .itemTotalAmt").removeClass("text-bold").removeClass("mtop70");
					if(response.data.msrpStr != 0){
						$scope.mmComponent.listPrice = response.data.msrpStr +" "+ response.data.currencyCode;
						$scope.mmComponent.youSaveAmt = response.data.savedPriceStr +" "+ response.data.currencyCode;
						$scope.mmComponent.itemTotalAmt = response.data.totalPriceStr +" "+ response.data.currencyCode;
						$(".price_list .listPrice, .price_list .youSaveAmt, .price_list .itemTotalAmt").show();
						$(".price_list .itemTotalAmt").addClass("text-bold");
					}else{
						
						/*$(".price_list .yourPrice").addClass("text-bold").addClass("mtop10");*/
						if( response.data.priceStr != 0){
							 $(".price_list .yourPrice").addClass("text-bold").addClass("mtop10");
							}else{
							 $(".save-configurator-section.price_list").hide();
							 $(".save-configurator-section.error_price").fadeIn();
							}
						
					}
					$scope.mmComponent.yourPrice =	response.data.priceStr +" "+ response.data.currencyCode;
				}else if(response.data.indexOf("Multiple sessions") > -1){
					document.location.href = "concurrentsessionerror";
				}else{
					$(".save-configurator-section.price_list").hide();
					$(".save-configurator-section.error_price").fadeIn();
				}
			},
			function(errResponse){
				$scope.showDialog("Failure message: " + errResponse );
			}
		);
	};
	//Request Quote
	$scope.requestQuoteConfigurator = function(){
		//alert("Request Quote");
		if(!(
			($scope.mmGeneral.genShotWeight && $scope.mmGeneral.genFillTime && $scope.mmGeneral.genProductLineId && $scope.configuratorName) && 
			(($scope.mmGeneral.showXCoordinates)? !isNaN((parseFloat($scope.mmGeneral.Pitch1))) : true) && 
			($scope.mmComponent.genNozzleLength && $scope.mmComponent.cProTemperature &&
			  $scope.mmComponent.cMoldTemperature && $scope.mmComponent.cGateDiameter)
			)
		  ){
			$scope.showDialog("Required values are missing!");
			return false;
		};
		var tempUnitObj = $scope.unitBasedValue();
		var dataToPostConfigurator ={
			"hrConfiguratorId" 	: ($scope.hrConfiguratorId)? $scope.hrConfiguratorId: null,
			"configuratorName"	: ($scope.configuratorName)? $scope.configuratorName: 'Test' + Math.round(Math.random() * 1000),
			"unitId"			: ($scope.mmGeneral.genUnit)? $scope.mmGeneral.genUnit : null,
			"dropsId"			: ($scope.mmGeneral.genNoDrops.dropsId)? $scope.mmGeneral.genNoDrops.dropsId : null,
			"plasticmaterialId"	: ($scope.mmGeneral.genPlasticMaterial)? $scope.mmGeneral.genPlasticMaterial : null,
			"shotweightId"		: ($scope.mmGeneral.genShotWeight)? $scope.mmGeneral.genShotWeight : null,
			"fillTime"			: ($scope.mmGeneral.genFillTime)? $scope.mmGeneral.genFillTime : null,
			"productLineId"		: ($scope.mmGeneral.genProductLineId)? $scope.mmGeneral.genProductLineId : null,
			"gatingTypeId"		: ($scope.mmGeneral.genTypes)? $scope.mmGeneral.genTypes : null,
			"gatingMethodId"	: ($scope.mmGeneral.genMethods.GatingMethodId)? $scope.mmGeneral.genMethods.GatingMethodId : null,
			"nozzleId"			: ($scope.mmComponent.genNozzleLength.nozzleId)? $scope.mmComponent.genNozzleLength.nozzleId : null,
			"nozzleLength"		: ($scope.mmComponent.genNozzleLength.nozzleLength)? $scope.mmComponent.genNozzleLength.nozzleLength : null,
			"manifoldId"		: ($scope.manifoldId)? $scope.manifoldId[0].manifoldId : null,
			"manifoldStyleId"	: ($scope.selectedCollection.gManifoldStyle.manifoldStyleId)? $scope.selectedCollection.gManifoldStyle.manifoldStyleId : null,
			"x1Pitch"			: tempUnitObj.Pitch1,
			"x2Pitch"			: ($scope.mmGeneral.PitchesLbl2 =="X2")? (tempUnitObj.Pitch2) : null,
			"yPitch"			: ($scope.mmGeneral.PitchesLbl2 =="Y")? (tempUnitObj.Pitch2) : null,
			"spericalRadiusValue":($scope.mmComponent.cSphericalRadius.radiusValue)? $scope.mmComponent.cSphericalRadius.radiusValue : null,
			"inletcomponentId"	: ($scope.mmComponent.cInletComponentId)? $scope.mmComponent.cInletComponentId : null,
			"inletExtensionLengthId":($scope.mmComponent.cInletExtensionLength)? (($scope.mmComponent.cInletExtensionLength.inletExtensionLengthId)? $scope.mmComponent.cInletExtensionLength.inletExtensionLengthId : null): null,
			"inletExtensionStyleId": ($scope.mmComponent.cInletExtenstionStyle)? (($scope.mmComponent.cInletExtenstionStyle.inletExtensionStyleId)? $scope.mmComponent.cInletExtenstionStyle.inletExtensionStyleId : null): null,
			"gatesealId"		: ($scope.mmComponent.cGatingSealPackage)? $scope.mmComponent.cGatingSealPackage : null,
			"locatingRingId"	: ($scope.mmComponent.clocatingRing.locatingRingId)? $scope.mmComponent.clocatingRing.locatingRingId : null,
			"valveActuatorId"	: ($scope.mmComponent.cValvePinActuator)?(($scope.mmComponent.cValvePinActuator.valveActuatorId)? $scope.mmComponent.cValvePinActuator.valveActuatorId : null):null,
			"gateDiameter"		: (parseFloat($scope.mmComponent.cGateDiameter))? $scope.mmComponent.cGateDiameter : null,
			"moldTemperature"	: tempUnitObj.cMoldTemperature,
			"processingTemperature": tempUnitObj.cProTemperature,
			"isControllerIncluded" : ($scope.mmComponent.isControllerIncluded)? $scope.mmComponent.isControllerIncluded : false,
			"controllerPartId" 	: ($scope.mmController.partId)? $scope.mmController.partId : 0,
			"viscosityId" 		: ($scope.mmGeneral.genViscosity )? $scope.mmGeneral.genViscosity  : null
		};
		var postRef= $http.post('requestQuoteConfigurator', dataToPostConfigurator, {headers: {
			'Content-Type': undefined
        }});
		postRef.success(function(data, status, headers, config) {
			console.log(data); // Testing ProductLine resp.
			if(data.indexOf("Multiple sessions") > -1){
				window.location.href = "concurrentsessionerror";
			}else{
				window.location.href= data;
			}
    	});
		postRef.error(function(data, status, headers, config) {
			//alert( "failure message: " + JSON.stringify({data: data}));
		});
	};
	
	//Create Order
	$scope.createOrderConfigurator = function(){
		//alert("Create order");
		if(!(
			($scope.mmGeneral.genShotWeight && $scope.mmGeneral.genFillTime && $scope.mmGeneral.genProductLineId && $scope.configuratorName ) && 
			(($scope.mmGeneral.showXCoordinates)? !isNaN((parseFloat($scope.mmGeneral.Pitch1))) : true) && 
			($scope.mmComponent.genNozzleLength && $scope.mmComponent.cProTemperature &&
			  $scope.mmComponent.cMoldTemperature && $scope.mmComponent.cGateDiameter)
			)
		){
			//alert("Required values are missing!!! ::Note: This Alert box will be formated.");
			$scope.showDialog('Required values are missing!');
			return false;
		};
		var tempUnitObj = $scope.unitBasedValue();
		var dataToPostConfigurator ={
			"hrConfiguratorId" 	: ($scope.hrConfiguratorId)? $scope.hrConfiguratorId: null,
			"configuratorName"	: ($scope.configuratorName)? $scope.configuratorName: 'Test' + Math.round(Math.random() * 1000),
			"unitId"			: ($scope.mmGeneral.genUnit)? $scope.mmGeneral.genUnit : null,
			"dropsId"			: ($scope.mmGeneral.genNoDrops.dropsId)? $scope.mmGeneral.genNoDrops.dropsId : null,
			"plasticmaterialId"	: ($scope.mmGeneral.genPlasticMaterial)? $scope.mmGeneral.genPlasticMaterial : null,
			"shotweightId"		: ($scope.mmGeneral.genShotWeight)? $scope.mmGeneral.genShotWeight : null,
			"fillTime"			: ($scope.mmGeneral.genFillTime)? $scope.mmGeneral.genFillTime : null,
			"productLineId"		: ($scope.mmGeneral.genProductLineId)? $scope.mmGeneral.genProductLineId : null,
			"gatingTypeId"		: ($scope.mmGeneral.genTypes)? $scope.mmGeneral.genTypes : null,
			"gatingMethodId"	: ($scope.mmGeneral.genMethods.GatingMethodId)? $scope.mmGeneral.genMethods.GatingMethodId : null,
			"nozzleId"			: ($scope.mmComponent.genNozzleLength.nozzleId)? $scope.mmComponent.genNozzleLength.nozzleId : null,
			"nozzleLength"		: ($scope.mmComponent.genNozzleLength.nozzleLength)? $scope.mmComponent.genNozzleLength.nozzleLength : null,
			"manifoldId"		: ($scope.manifoldId)? $scope.manifoldId[0].manifoldId : null,
			"manifoldStyleId"	: ($scope.selectedCollection.gManifoldStyle.manifoldStyleId)? $scope.selectedCollection.gManifoldStyle.manifoldStyleId : null,
			"x1Pitch"			: tempUnitObj.Pitch1,
			"x2Pitch"			: ($scope.mmGeneral.PitchesLbl2 =="X2")? (tempUnitObj.Pitch2) : null,
			"yPitch"			: ($scope.mmGeneral.PitchesLbl2 =="Y")? (tempUnitObj.Pitch2) : null,
			"spericalRadiusValue":($scope.mmComponent.cSphericalRadius.radiusValue)? $scope.mmComponent.cSphericalRadius.radiusValue : null,
			"inletcomponentId"	: ($scope.mmComponent.cInletComponentId)? $scope.mmComponent.cInletComponentId : null,
			"inletExtensionLengthId":($scope.mmComponent.cInletExtensionLength)? (($scope.mmComponent.cInletExtensionLength.inletExtensionLengthId)? $scope.mmComponent.cInletExtensionLength.inletExtensionLengthId : null): null,
			"inletExtensionStyleId": ($scope.mmComponent.cInletExtenstionStyle)? (($scope.mmComponent.cInletExtenstionStyle.inletExtensionStyleId)? $scope.mmComponent.cInletExtenstionStyle.inletExtensionStyleId : null): null,
			"gatesealId"		: ($scope.mmComponent.cGatingSealPackage)? $scope.mmComponent.cGatingSealPackage : null,
			"locatingRingId"	: ($scope.mmComponent.clocatingRing.locatingRingId)? $scope.mmComponent.clocatingRing.locatingRingId : null,
			"valveActuatorId"	: ($scope.mmComponent.cValvePinActuator)?(($scope.mmComponent.cValvePinActuator.valveActuatorId)? $scope.mmComponent.cValvePinActuator.valveActuatorId : null):null,
			"gateDiameter"		: (parseFloat($scope.mmComponent.cGateDiameter))? $scope.mmComponent.cGateDiameter : null,
			"moldTemperature"	: tempUnitObj.cMoldTemperature,
			"processingTemperature": tempUnitObj.cProTemperature,
			"isControllerIncluded" : ($scope.mmComponent.isControllerIncluded)? $scope.mmComponent.isControllerIncluded : false,
			"controllerPartId" 	: ($scope.mmController.partId)? $scope.mmController.partId : 0,
			"viscosityId" 		: ($scope.mmGeneral.genViscosity )? $scope.mmGeneral.genViscosity  : null
		};
		var postRef= $http.post('createOrderConfigurator', dataToPostConfigurator, {headers: {
			'Content-Type': undefined
        }});
		postRef.success(function(data, status, headers, config) {
			console.log(data); // Testing ProductLine resp.
			if(data.indexOf("Multiple sessions") > -1){
				window.location.href = "concurrentsessionerror";
			}else{
				window.location.href=data; //"createorderfromcartinit?organizationId=3&isFromCartBrand=true&isDivisionMapped=true";
			}
		});
		postRef.error(function(data, status, headers, config) {
			//alert( "failure message: " + JSON.stringify({data: data}));
		});
	};
	
	//populateProductLine
	$scope.populateProductLine = function(){
		var dataToPost={
			"unitId"			:($scope.mmGeneral.genUnit)? $scope.mmGeneral.genUnit : null,
			"drop"				:($scope.mmGeneral.genNoDrops.dropsId)? $scope.mmGeneral.genNoDrops.dropsId : null,
			"filltime"			:($scope.mmGeneral.genFillTime)? $scope.mmGeneral.genFillTime : null,
		    "gatingMethod"		:($scope.mmGeneral.genMethods)?(($scope.mmGeneral.genMethods.GatingMethodId)? $scope.mmGeneral.genMethods.GatingMethodId : null): null,
    		"gatingTypes"		:($scope.mmGeneral.genTypes)? $scope.mmGeneral.genTypes : null,
		    "manifoldStyle"		:($scope.selectedCollection.gManifoldStyle)?(($scope.selectedCollection.gManifoldStyle.manifoldStyleId)? $scope.selectedCollection.gManifoldStyle.manifoldStyleId : null): null,
    		"shotweight"		:($scope.mmGeneral.genShotWeight)? $scope.mmGeneral.genShotWeight : null,
    		"viscosity"			:($scope.mmGeneral.genViscosity)? $scope.mmGeneral.genViscosity : null,
    		"material"			:($scope.mmGeneral.genPlasticMaterial)? $scope.mmGeneral.genPlasticMaterial : null,
			"hrConfiguratorId" 	: ($scope.hrConfiguratorId)? $scope.hrConfiguratorId: null
		};
		if(!$scope.isOnLoadCall){
			dataToPost.hrConfiguratorId = null;
		}
		var postRef= $http.post('productlineDerivation', dataToPost,{headers: {
			'Content-Type': undefined
		}});
		postRef.success(function(data, status, headers, config) {
			$scope.isProductLineOnFire = true; 
			$scope.messages={};
	         // console.log('product line data-> '+data); // Testing ProductLine resp.
			  $scope.resetComponents();
			  $('#mmconfigurator-wrapper h3 p ').css('color','#fff');
	          if(data=='failure'){
	        	  $scope.mmGeneral.genProductLine="Consult Your TSE";
	        	  
	        	  $scope.mmGeneral.disableButons = true;
	        	  $scope.mmComponent.genNozzleLength = null;
	      		  $scope.responseCollection.genNozzleLength = null;
	      		  $("#productLine-hldr").addClass("error-obj");
	      		  $('#mmconfigurator-wrapper h3 p ').css('color','#c80000');
	      		 // $scope.showDialog("Configuration is outside of configuratible range, please contact your TSE or reconfigure.");
	          }
	          else{
				/****************************************************
				 * POPULATING VALUES RELATED WITH PRODUCT LINE
				 ***************************************************/
	        	if(data.productline){
	        		$scope.mmGeneral.genProductLineId = (data.productline.productLineId)? data.productline.productLineId: null;
					$scope.mmGeneral.genProductLine= (data.productline.productLineDesc)?data.productline.productLineDesc: null;
	        	}
				
				$scope.gatingmethodProductLineId = (data.GMPLID)? data.GMPLID: null; // What ?
				
				if(data.gatingMethod){
					$scope.responseCollection.gatingMethods ={};
				    $scope.responseCollection.gatingMethods= data.gatingMethod;
				    $scope.mmGeneral.genMethods = moldService.getSelectedObject($scope.responseCollection.gatingMethods);
				}
				if(data.gatesealPackage){
					if(data.gatesealPackage.length>0){
						//$scope.mmComponent.gateSealPackageId = _tempGatesealPkg.gatesealId;
						$scope.mmComponent.configCollection.cGatingSealPackage =data.gatesealPackage;
						var _tempGatesealPkg =  moldService.getSelectedObject(data.gatesealPackage);
						if(_tempGatesealPkg){
							$scope.mmComponent.cGatingSealPackage = _tempGatesealPkg.gatesealId;
							//Range
							var _tempDiameterAry 					= _tempGatesealPkg.gateDiameter.split("-");
							$scope.mmComponent.cGateDiameterMinVal	=(parseFloat(_tempDiameterAry[0])) ? parseFloat(_tempDiameterAry[0]): 0;
							$scope.mmComponent.cGateDiameterMaxVal	= (_tempDiameterAry[1]) ? parseFloat(_tempDiameterAry[1]) : parseFloat(_tempDiameterAry[0]);
							$scope.mmComponent.cGateDiameter =(parseFloat(_tempDiameterAry[0]))? parseFloat(_tempDiameterAry[0]):0;
							$scope.mmComponent.cGatingSealPackageName 	= _tempGatesealPkg.GateSealPackage;
						}
					}
				}
				if(data.inletDisplay){
					$scope.mmComponent.configCollection.cSphericalRadius = data.inletDisplay.spericalRadiusValue;
					$scope.mmComponent.cSphericalRadius = moldService.getSelectedObject($scope.mmComponent.configCollection.cSphericalRadius);
					
					if(data.inletDisplay.inletLength){
						$scope.mmComponent.configCollection.cInletExtensionLength = data.inletDisplay.inletLength;
						$scope.mmComponent.cInletExtensionLength 	= moldService.getSelectedObject(data.inletDisplay.inletLength);
						$scope.mmComponent.inletExtensionLengthId 	= $scope.mmComponent.cInletExtensionLength;
					}
					if(data.inletDisplay.inletStyle){
						$scope.mmComponent.configCollection.cInletExtenstionStyle=data.inletDisplay.inletStyle;
						$scope.mmComponent.cInletExtenstionStyle	= moldService.getSelectedObject(data.inletDisplay.inletStyle);
						$scope.mmComponent.inletExtensionStyleId 	= $scope.mmComponent.cInletExtenstionStyle .inletExtensionStyleId
					}
					if(data.inletDisplay.inletExtensionType){
						$scope.mmComponent.cInletComponent = data.inletDisplay.inletExtensionType;
						$scope.mmComponent.inletComponentTypeId =data.inletDisplay.inletExtensionTypeId;
						if($scope.mmComponent.inletComponentTypeId == 3){
							$scope.mmComponent.showElements = true;
						}
						else if(($scope.mmComponent.inletComponentTypeId == 1) && (data.inletComponents)){
							var tempFilterObj = $filter('filter')(
								data.inletComponents, { spericalRadiusValue: $scope.mmComponent.cSphericalRadius.radiusValue}
				 			);
							if(tempFilterObj){
								$scope.mmComponent.cCenterHeaterPkgCollection =tempFilterObj;
								$scope.mmComponent.cCenterHeaterPkg = moldService.getSelectedObject(tempFilterObj);
								$scope.mmComponent.showElements = false;
							};
						}else{
							$scope.mmComponent.showElements = false;
						}
						
					}
				}
				if(data.inletComponents){
					$scope.mmComponent.inletComponentsCollection = data.inletComponents;
					$scope.getinletComponent();
					
					if($scope.mmComponent.inletExtensionLengthId){
						inletExtensionLengthId: $scope.mmComponent.inletExtensionLengthId.inletExtensionLengthId
						inletExtensionStyleId: $scope.mmComponent.inletExtensionStyleId
					}
					
				}
				if(data.valveActuatorsList){
					$scope.mmComponent.configCollection.cValvePinActuator = data.valveActuatorsList;
					$scope.mmComponent.cValvePinActuator = moldService.getSelectedObject(data.valveActuatorsList);
				}
				if(data.locatingRingList){
					//LocatingRing
					$scope.mmComponent.configCollection.clocatingRing = data.locatingRingList;
					$scope.mmComponent.clocatingRing =moldService.getSelectedObject(data.locatingRingList);
				}
				$scope.mmGeneral.Pitch1 = (data.x1Pitch) ? data.x1Pitch : null;
				$scope.mmGeneral.Pitch2 = (data.x2Pitch) ? data.x2Pitch : ((data.yPitch)? data.yPitch : null);
				
				$scope.manifoldId = (data.manifoldList)? data.manifoldList: null;
				if($scope.manifoldId!=null){
					if($scope.mmGeneral.genUnit == 1){
						$scope.mmGeneral.unitLabel ="mm";
						$scope.mmGeneral.Pitch1Max = ($scope.manifoldId[0].Xmax) ? parseFloat($scope.manifoldId[0].Xmax) : 0;
						$scope.mmGeneral.Pitch1Min = ($scope.manifoldId[0].Xmin) ? parseFloat($scope.manifoldId[0].Xmin) : 0;
						$scope.mmGeneral.Pitch2Max = ($scope.manifoldId[0].Ymax) ? parseFloat($scope.manifoldId[0].Ymax) : 0;
						$scope.mmGeneral.Pitch2Min = ($scope.manifoldId[0].Ymin) ? parseFloat($scope.manifoldId[0].Ymin) : 0;
						
					}else if($scope.mmGeneral.genUnit ==2){
						$scope.mmGeneral.Pitch1 = moldService.toInch($scope.mmGeneral.Pitch1);
						$scope.mmGeneral.Pitch2 = moldService.toInch($scope.mmGeneral.Pitch2);
						$scope.mmGeneral.unitLabel ="in";

						$scope.mmGeneral.Pitch1Max = moldService.toInch($scope.manifoldId[0].Xmax);
						$scope.mmGeneral.Pitch1Min = moldService.toInch($scope.manifoldId[0].Xmin);
						$scope.mmGeneral.Pitch2Max = moldService.toInch($scope.manifoldId[0].Ymax);
						$scope.mmGeneral.Pitch2Min = moldService.toInch($scope.manifoldId[0].Ymin);
					}
				}
				$scope.mmCadenas.disableRefreshBtn = false;
				
				//For Femto & pico == Blank is coming in Place of SNHR . Which shud be removed.
				/*if($scope.mmGeneral.genNoDrops.dropsId==1   && ($scope.mmGeneral.genProductLineId ==1 || $scope.mmGeneral.genProductLineId ==2)){
        	  		$("#cmb-manifold-list option[label*='Single Nozzle']").remove();
	          	}*/
				$scope.changeNotFromProductLineCall = false;
				$scope.mmGeneral.configCollection.gNoDrops = data.drop;
				$scope.mmGeneral.genNoDrops =  moldService.getSelectedObject($scope.mmGeneral.configCollection.gNoDrops);
				$scope.selectedCollection.gManifoldStyle = moldService.getSelectedObject($scope.mmGeneral.genNoDrops.ManifoldStyle);
				$scope.mmGeneral.disableButons = false;
	          }
	          if(!$scope.isOnLoadCall){
	        	  $scope.highlightTabChange(['Nozzles', 'Components']);
	          }
	          $scope.isProductLineOnFire = false;
	          
	          //Call Price and Cadenas
	          if(($scope.hrConfiguratorId) && (
	      			($scope.mmGeneral.genShotWeight && $scope.mmGeneral.genFillTime && $scope.mmGeneral.genProductLineId) && 
	    			(($scope.mmGeneral.showXCoordinates)? !isNaN((parseFloat($scope.mmGeneral.Pitch1))) : true) && 
	    			($scope.mmComponent.genNozzleLength && $scope.mmComponent.cProTemperature &&
	    			  $scope.mmComponent.cMoldTemperature && $scope.mmComponent.cGateDiameter)
    			)){
	        	  $scope.refeshCadenasSrc();
		          $scope.getPriceConfigurator(); 
	          }
	          
	          
		});
		postRef.error(function(data, status, headers, config) {
			//alert( "failure message no: " + JSON.stringify({data: data}));
		});
	};
	
	$scope.resetComponents = function(){
		$scope.mmGeneral.genProductLineId = null;
		$scope.gatingmethodProductLineId = null;
		$scope.mmGeneral.genProductLine = null;
		$scope.mmComponent.configCollection.cSphericalRadius = null;
		$scope.mmComponent.cSphericalRadius = null;
		$scope.mmComponent.configCollection.cGatingSealPackage = null;
		$scope.mmComponent.cGatingSealPackage = null;
		$scope.mmComponent.cGateDiameter = null;
	  
		$scope.mmComponent.cGatingSealPackageName = null;
		$scope.mmComponent.configCollection.cInletExtensionLength = null;
		$scope.mmComponent.cInletExtensionLength = null;
		$scope.mmComponent.inletExtensionLengthId = null;
		$scope.mmComponent.configCollection.cInletExtenstionStyle = null;
		$scope.mmComponent.cInletExtenstionStyle = null;
		$scope.mmComponent.inletExtensionStyleId = null;
		$scope.mmComponent.cInletComponent = null;
		$scope.mmComponent.inletComponentTypeId = null;
	  
		$scope.mmComponent.inletComponentsCollection = null;
		$scope.mmComponent.cInletComponentObj = null;
		$scope.mmComponent.cInletComponentId = null;
		$scope.mmComponent.configCollection.cValvePinActuator = null;
		$scope.mmComponent.cValvePinActuator = null;
		$scope.mmComponent.configCollection.clocatingRing = null;
		$scope.mmComponent.cCenterHeaterPkg = null;
		
		$scope.mmComponent.clocatingRing = null;
		//$scope.mmComponent.genNozzleLength = null;
		//$scope.responseCollection.genNozzleLength = null;
		
		$scope.mmGeneral.Pitch1 = null;
		$scope.mmGeneral.Pitch2 = null;
		$scope.mmGeneral.Pitch1Min = 0;
		$scope.mmGeneral.Pitch2Min = 0;
		$scope.mmGeneral.Pitch1Max = 0;
		$scope.mmGeneral.Pitch2Max = 0;
		
		$scope.manifoldId = null;
		$scope.mmCadenas.disableRefreshBtn = true;
		$scope.mmConfiguratorForm.ValidationMsg ="";
		$(".save-configurator-section.price_list").fadeOut();
		$("#productLine-hldr").removeClass("error-obj");
		if($scope.mmConfiguratorForm.inputManifoldPitch1){$scope.mmConfiguratorForm.inputManifoldPitch1.$pristine = true};
		if($scope.mmConfiguratorForm.inputManifoldPitch2){$scope.mmConfiguratorForm.inputManifoldPitch2.$pristine = true};
	};
	
	/******************************************************
	 * LISTENERS START FROM HERE...
	 *****************************************************/
	
	//Listener on PlasticMaterial, Gating Type
	$scope.$watchGroup(['mmGeneral.genPlasticMaterial', 'mmGeneral.genTypes'], function(newValues, oldValues, scope) {
		//console.log(newValues[0] + " - " + newValues[1] );		
		//Gating Type Validation for Inlet Extension Length, Extenstion Style and Valve Pin Actuator
		//Assuming Gating Type 1 = to Valve Gate.
		if($scope.isProductLineOnFire){
			return false;
		};
		if(newValues[1] == 1){
			$scope.mmComponent.showElements = true;
		}else{
			$scope.mmComponent.showElements = false;
			$scope.resetComponents();
		}
		if(newValues[0] && newValues[1]){
			//AJAX Call starts here.
			 var gatingMethodderivation = 'gatingMethodderivation?material='+$scope.mmGeneral.genPlasticMaterial+'&gatingType='+$scope.mmGeneral.genTypes+'&hrConfiguratorId=';
			 if($scope.isOnLoadCall){
				 gatingMethodderivation += $scope.hrConfiguratorId;
			 }
			 var getRef = $http.get(gatingMethodderivation);
			 getRef.success(function(data) {
			     console.log(data);
			     $scope.responseCollection.gatingMethods ={};
			     $scope.responseCollection.gatingMethods= data.gatingMethod;
			     /*if($scope.responseCollection.gatingMethods.length==0){
			    	 alert(' no gating method ');
			     }*/
			     //console.log($scope.responseCollection.gatingMethods);
			     $scope.mmGeneral.genMethods = moldService.getSelectedObject($scope.responseCollection.gatingMethods);
			     
			     var newCollection = ( $filter('filter')($scope.mmGeneral.configCollection.gPlasticMat, { materialId: $scope.mmGeneral.genPlasticMaterial }) );
			     $scope.mmComponent.cMoldTemperature = newCollection[0].moldTemperatue;
			     $scope.mmComponent.cProTemperature = newCollection[0].processTemperature;
			     
			     $scope.mmGeneral.configCollection.gPlasticMat.processTempMin = newCollection[0].processTemMin;
			     $scope.mmGeneral.configCollection.gPlasticMat.processTempMax = newCollection[0].processTemMax;
			    	$scope.mmGeneral.configCollection.gPlasticMat.moldTempMin = newCollection[0].moldTemMin;
			    	$scope.mmGeneral.configCollection.gPlasticMat.moldTempMax = newCollection[0].moldTemax;
		    	if($scope.mmGeneral.genUnit ==2){
		    		$scope.convertTemperatureValues();
		    	}	
			    $scope.mmGeneral.configCollection.gGatingType = data.gatingTypes;
			    $scope.mmGeneral.genTypes = moldService.getSelectedObject($scope.mmGeneral.configCollection.gGatingType).gateTypeId;
			    	$scope.changeNotFromProductLineCall = false;
			    // if($scope.mmGeneral.genProductLine){
			     if($scope.mmGeneral.genShotWeight && $scope.mmGeneral.genFillTime && $scope.mmGeneral.genViscosity ){
		        	  $scope.populateProductLine();
			     }
			     if(!$scope.isOnLoadCall){
			    	 $scope.highlightTabChange(['Components']);
			     }
			 })
			 .error(function(data) {
	              $scope.mmGeneral = data;
	            //alert( "failure");
	            //alert( data);
	        });
		}
	});
	
	//Listener on No of drops and Manifold style
	$scope.$watchGroup(['mmGeneral.genNoDrops', 'selectedCollection.gManifoldStyle'], function(newValues, oldValues, scope) {
		if($scope.isProductLineOnFire){
			return false;
		};
		if(newValues[0] && newValues[1] && $scope.changeNotFromProductLineCall){
			if(newValues[0].dropsId ==1 && newValues[1].manifoldStyleId ==1){
				$scope.mmComponent.showElements = false;
			}else{
				$scope.mmComponent.showElements = true;
			}
			
			var dataToPost={
				"drop":($scope.mmGeneral.genNoDrops.dropsId)? $scope.mmGeneral.genNoDrops.dropsId : null,
				"manifoldStyle":($scope.selectedCollection.gManifoldStyle.manifoldStyleId)? $scope.selectedCollection.gManifoldStyle.manifoldStyleId : null
			}
			var postRef= $http.post('controllerDerivation', dataToPost,{headers: {
	            'Content-Type': undefined
	        }});
			postRef.success(function(data, status, headers, config) {
		          //console.log('controller data -> '+data); 
		          
		          $scope.mmController.cPartNumber=data.partNumber;
		          $scope.mmController.CommercialDescription=data.partCommercialDescription;
		          $scope.mmController.EngineeringDescription=data.partEngineeringDescription;
		          $scope.mmController.Organization=data.partOrganization;
		          $scope.mmController.media=data.media[0].mediaId;
		          $scope.mmController.partId = data.partId;
		          // Testing ProductLine resp.
		          //$scope.mmComponent.cGateDiameter = $scope.responseCollection.cGateDiameter;
		          //if($scope.mmGeneral.genProductLine){
		          if($scope.mmGeneral.genShotWeight && $scope.mmGeneral.genFillTime && $scope.mmGeneral.genViscosity ){
		        	  $scope.populateProductLine();
		          }
		          if(!$scope.isOnLoadCall){
		        	  $scope.highlightTabChange(['Nozzles','Components']);
		          }
			});
			postRef.error(function(data) {
				 //alert( "failure");
	        });
		}
	});
	var timeoutCode;
	//Listener on FillTime, Viscosity and ShotWeight, productlineDerivation
	$scope.$watchGroup(['mmGeneral.genFillTime', 'mmGeneral.genShotWeight'],
	function(newValues, oldValues, scope) {
		if($scope.isProductLineOnFire){
			return false;
		};
		var delayInMs = 2000;
		clearTimeout(timeoutCode);//Set timeout
		timeoutCode = setTimeout(function(){
			//console.log(" wtch " + $scope.mmGeneral.genShotWeight + " - " +  $scope.mmGeneral.genFillTime);
			if(newValues[0] && newValues[1]) {
				$scope.populateProductLine();
			}
		},delayInMs);
	});
	$scope.$watch('mmGeneral.genViscosity',
	function(newValues, oldValues, scope) {
		if($scope.isProductLineOnFire){
			return false;
		};
		if(newValues && $scope.mmGeneral.genMethods && $scope.mmGeneral.genNoDrops && $scope.mmGeneral.genFillTime &&  $scope.mmGeneral.genShotWeight ) {
			$scope.populateProductLine();
		}
	});
	$scope.$watch('mmGeneral.genMethods',
	function(newValues, oldValues, scope) {
		if($scope.isProductLineOnFire){
			return false;
		};
		if(newValues && $scope.mmGeneral.genViscosity && $scope.mmGeneral.genNoDrops && $scope.mmGeneral.genFillTime &&  $scope.mmGeneral.genShotWeight ) {
			if((newValues.GatingMethodId) != ((oldValues)? oldValues.GatingMethodId : 0 )){
				$scope.populateProductLine();
			}
		}
	});
	//Listener on FillTime
	$scope.$watch('mmComponent.cGatingSealPackage', function(newValues, oldValues, scope) {
		if($scope.isProductLineOnFire){
			return false;
		};
		if(newValues){
			//AJAX Call starts here.
			var productlineURL = 'nozzleLengthDerivation?gatesealid='+$scope.mmComponent.cGatingSealPackage+'&GMPLId='+$scope.gatingmethodProductLineId+'&manifoldStyleId='+$scope.selectedCollection.gManifoldStyle.manifoldStyleId+'&hrConfiguratorId=';
			if($scope.isOnLoadCall){
				productlineURL += $scope.hrConfiguratorId;
			 }
			var getRef = $http.get(productlineURL);
			getRef.success(function(data) {
				console.log(data); 
				$scope.responseCollection.genNozzleLength = null;
	       		$scope.responseCollection.genNozzleLength = data.nozzlePackage;
	       		$scope.mmComponent.genNozzleLength = moldService.getSelectedObject($scope.responseCollection.genNozzleLength);
	       		$scope.mmCadenas.disableRefreshBtn = !($scope.mmGeneral.genProductLineId);
	       		if(!$scope.isOnLoadCall){
	       			$scope.highlightTabChange(['Components']);
				}
			});
		    getRef.error(function(data) {
	           //alert( "failure");
	           //alert( data);
		    });
		}
	});
	//Listener on ManifoldStyle
	$scope.$watch('selectedCollection.gManifoldStyle', function(newValues, oldValues, scope) {
		if($scope.isProductLineOnFire){
			return false;
		};
		if(newValues){
			if(newValues.axis){
				var mPitches = newValues.axis.split(";");
				$scope.mmGeneral.showXCoordinates = false;
				$scope.mmGeneral.showYCoordinates = false;
				if(mPitches[0]){
					$scope.mmGeneral.showXCoordinates = true;
					$scope.mmGeneral.PitchesLbl1 = mPitches[0];
				/*	$scope.mmGeneral.Pitch1Max = ($scope.manifoldId)? parseFloat($scope.manifoldId[0].Xmax) : 0;
					$scope.mmGeneral.Pitch1Min = ($scope.manifoldId)? parseFloat($scope.manifoldId[0].Xmin) : 0;
					$scope.mmGeneral.Pitch2Max = ($scope.manifoldId)? parseFloat($scope.manifoldId[0].Xmax) : 0;
					$scope.mmGeneral.Pitch2Min = ($scope.manifoldId)? parseFloat($scope.manifoldId[0].Xmin) : 0;*/
					//console.log("second mm check - > "+$scope.mmGeneral.Pitch1Max+ " 2 .) "+$scope.mmGeneral.Pitch1Min);
				}
				if(mPitches[1]){
					$scope.mmGeneral.showYCoordinates = true;
					$scope.mmGeneral.PitchesLbl2 = mPitches[1];
					/*if(mPitches[1]!="X2" ){
						$scope.mmGeneral.Pitch2Max = $scope.mmGeneral.Pitch1Max;
						$scope.mmGeneral.Pitch2Min = $scope.mmGeneral.Pitch1Min;
					}*/
				}
			}else{
				$scope.mmGeneral.showXCoordinates = false;
				$scope.mmGeneral.showYCoordinates = false;
				$scope.mmGeneral.Pitch1= null;
				$scope.mmGeneral.Pitch2= null;
			}
			if(newValues.imagePath){
				var manifoldImgs = newValues.imagePath.split(";");
				$scope.mmGeneral.manifoldImg1 = (manifoldImgs[0]) ?  "../images/" + manifoldImgs[0] : "";
				$scope.mmGeneral.manifoldImg2 = (manifoldImgs[1]) ?  "../images/" + manifoldImgs[1] : "";
				$scope.mustShowNozzleImage = false;
			}
			$scope.mmCadenas.disableRefreshBtn = !($scope.mmGeneral.genProductLineId);
			if(!$scope.isOnLoadCall){
				$scope.highlightTabChange(['Nozzles']);	
			}
		}
	});
		
	//Listener on Inlet Extension Length + Inlet Extenstion Style + Valve Pin Actuator + Nozzle Length + Product Line+  Gating Method
	 $scope.$watchGroup(['mmComponent.cInletExtensionLength','mmComponent.cInletExtenstionStyle', 'mmComponent.cValvePinActuator', 
	                     'mmComponent.genNozzleLength'],
	 function(newValues, oldValues, scope) {
		 console.log(newValues);
		 if($scope.isProductLineOnFire){
				return false;
			};
		 if(newValues[0] && newValues[1] && newValues[2] && newValues[3]){
			$scope.getinletComponent();
			var valveData={
				    "gatingMethodId"	: ($scope.mmGeneral.genMethods.GatingMethodId)? $scope.mmGeneral.genMethods.GatingMethodId : null,
				    "productLineId"		: ($scope.mmGeneral.genProductLineId)? $scope.mmGeneral.genProductLineId : null,
					"inletComponentlengthId" : ($scope.mmComponent.cInletExtensionLength.inletExtensionLengthId)? $scope.mmComponent.cInletExtensionLength.inletExtensionLengthId : null,
					"inletComponentStyleId" : ($scope.mmComponent.cInletExtenstionStyle.inletExtensionStyleId)? $scope.mmComponent.cInletExtenstionStyle.inletExtensionStyleId : null,
					"valveActuator"		: ($scope.mmComponent.cValvePinActuator.valveActuatorId)? $scope.mmComponent.cValvePinActuator.valveActuatorId : null,	
					"nozzleId"			: ($scope.mmComponent.genNozzleLength.nozzleId)? $scope.mmComponent.genNozzleLength.nozzleId : null,
					"inletComponentId" 	: ($scope.mmComponent.cInletComponentId)? $scope.mmComponent.cInletComponentId : null	
			 }
			 var postValveData=  $http.post('validateValvePin', valveData,{headers: {
	          'Content-Type': undefined
			 }});
			 postValveData.success(function(data, status, headers, config) {
				$scope.mmConfiguratorForm.inletExtensionLengthValidation = data.ILValidation;
				$scope.mmConfiguratorForm.nozzLeLengthValidation= data.NLValidation;
				$scope.mmConfiguratorForm.valvePinActuatorValidation = data.VAValidation;
				
				$scope.mmConfiguratorForm.ValidationMsg = data.ValidationMsg;
				
				$scope.mmCadenas.disableRefreshBtn = !($scope.mmGeneral.genProductLineId);
				if(!$scope.isOnLoadCall){
					$scope.highlightTabChange(['Components']);
				}
			});
			postValveData.error(function(data, status, headers, config) {
				//alert( "failure message no: " + JSON.stringify({data: data}));
			});
		 }
	 });
});
