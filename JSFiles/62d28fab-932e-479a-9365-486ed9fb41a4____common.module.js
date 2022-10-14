/************************************************
 * 각 화면에 대한 메뉴정보, 사용자정보 및 필수적인 공통 함수들을 제공
 * 각 사이트별 커스터마이징하여 사용 가능
 * version 2.0
 ************************************************/
function AppKit() {
	var extension = cpr.core.Module.require("module/extension");
	
	this._activeLoadMask = null;
	this._activeSubmission = [];
	
	this.Validator = new Validator(this);
	
	this.Auth = new AppAuthKit(this);
	this.Msg = new extension.MsgKit(this);
	this.Dialog = new extension.DialogKit(this);
	this.Group = new extension.GroupKit(this);
	this.Control = new extension.ControlKit(this);
	this.SelectCtl = new extension.SelectKit(this);
	this.Tree = new extension.TreeKit(this);
	this.Tab = new extension.TabKit(this);
	this.DataSet = new extension.DataSetKit(this);
	this.DataMap = new extension.DataMapKit(this);
	this.Grid = new extension.GridKit(this);
	this.FreeForm = new extension.FreeFormKit(this);
	this.Submit = new extension.SubmissionKit(this);
	this.EmbApp = new extension.EmbeddedAppKit(this);
	this.MDI = new extension.MDIKit(this);
	this.Header = new extension.HeaderKit(this);
	this.ComUdcBtn = new extension.ComUdcBtnKit(this);
	
};

/**
 * App 화면의 Layout에 맞게 컨트롤 배치 조건 래핑.
 * - 사이트별 Customizing 필요
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {cpr.controls.layouts.Constraint}constraint 래핑할 배치조건
 * @param {cpr.core.AppInstance} poApp 앱인스턴스
 * @returns 래핑된 배치조건
 */
AppKit.prototype.wrapConstraints = function(app, constraint, poApp) {
	var isPopup = false;
	if(app.getHost() && app.getHost().modal === true){
		isPopup = true;
	}
	
	var layout;
	var container = null;
	if(poApp == null){
		container = isPopup ? app.getContainer() : app.getRootAppInstance().getContainer();
		poApp = isPopup ? app : app.getRootAppInstance();
	}else{
		container = poApp.getContainer();
	}
	layout = container.getLayout();
	
	if (layout instanceof cpr.controls.layouts.ResponsiveXYLayout) {
		var positionConstraints = [];
		var allMedia = poApp.allSupportedMedias;
		allMedia.forEach(function(media) {
			var newConst = _.clone(constraint);
			newConst["media"] = media;
			positionConstraints[positionConstraints.length] = newConst;
		});
		return {
			"positions" : positionConstraints
		};
	}
	
	return constraint;
};


/**
 * 화면에 LoadMask 출력
 * @param {cpr.core.AppInstance} app 앱인스턴스
 */
AppKit.prototype.showLoadMask = function(app, maskType) {
	var isPopup = false;
	if(app.getHost() && app.getHost().modal === true){
		isPopup = true;
	}
	
	this.hideLoadMask(app);
	
	var showConstraint = {
			"position" : "absolute",
			"top" : "0",
			"bottom" : "0",
			"left" : "0",
			"right" : "0"
	};
	showConstraint = this.wrapConstraints(app, showConstraint);
	
	var container = isPopup ? app.getContainer() : app.getRootAppInstance().getContainer();
	var layout = container.getLayout();
	var loadmask = null;
	if(maskType == "pro") {
		loadmask = container.getAppInstance().lookup("__loadmask_pro__");
		if(loadmask) {
			container.replaceConstraint(loadmask, showConstraint);
		} else {
			loadmask = new udc.cmn.ProgressLoader("__loadmask_pro__");
			container.addChild(loadmask, showConstraint);
			container.getAppInstance().register(loadmask);
		}
		loadmask.module.start();
	} else {
		loadmask = container.getAppInstance().lookup("__loadmask__");
		try{
			if(loadmask) {
				if(layout instanceof cpr.controls.layouts.FormLayout){
					app.floatControl(loadmask, showConstraint);
				}else{
					container.replaceConstraint(loadmask, showConstraint);
				}
			} else {
				loadmask = new udc.loadmask.loadmask("__loadmask__");
//				loadmask  = new udc.loadmask.loadmask();
				if(layout instanceof cpr.controls.layouts.FormLayout){
					app.floatControl(loadmask, showConstraint);
				}else{
					container.addChild(loadmask, showConstraint);
				}
				container.getAppInstance().register(loadmask);
			}
		}catch(ex){showConstraint = null;}
	}
	
	this._activeLoadMask = loadmask;
};

/**
 * LoadMask를 감춤
 * @param {cpr.core.AppInstance} app 앱인스턴스
 */
AppKit.prototype.hideLoadMask = function(app) {
	if(this._activeLoadMask) {
		if(this._activeLoadMask.module && this._activeLoadMask.module.end) {
			this._activeLoadMask.module.end();
		}
		var hideConstraint = {
				"position" : "absolute",
				"top" : "-1px",
				"left" : "-1px",
				"width" : "1px",
				"height" : "1px"
		};

		//앱 객체가 사라진 경우... ROOT앱을 기본으로 하여 처리
		if(app == null || app.getRootAppInstance() == null){

			app = this._getRootApp();
		}

		var isPopup = false;
		if(app.getHost() && app.getHost().modal === true){
			isPopup = true;
		}

		var container = isPopup ? app.getContainer() : app.getRootAppInstance().getContainer();

		try{

			var layout = container.getLayout();
			if(layout instanceof cpr.controls.layouts.FormLayout){
				app.getRootAppInstance().removeFloatingControl(this._activeLoadMask);
			}else{

				hideConstraint = this.wrapConstraints(app, hideConstraint);
				container.replaceConstraint(this._activeLoadMask, hideConstraint);
			}
			if(this._activeLoadMask){

				this._activeLoadMask.module.count(0);
				this._activeLoadMask.module.hide();

			}
		}catch(ex){hideConstraint = null;}

		this._activeLoadMask = null;
	}
};

/**
 * 최상위 루트 AppInstance를 반환한다.
 * - 사이트별 Customizing 필요
 * @private
 */
AppKit.prototype._getRootApp = function() {
	return cpr.core.Platform.INSTANCE.lookup("app/com/inc/main").getInstances()[0];
};

/**
 * 메인 앱에 대한 인스턴스를 반환한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @returns 
 */
AppKit.prototype.getMainApp = function(app) {
	if(app.isRootAppInstance()) {
		return app;
	}else{
		if(app.getHostAppInstance().isRootAppInstance()) return app;
		else return this.getMainApp(app.getHostAppInstance());
	}
};

/**
 * 모바일 접속여부를 반환한다.
 */
AppKit.prototype.isAccessMobile = function() {
	var info = cpr.utils.Util.detectBrowser();
	if(info.mobile || info.os.indexOf("Android") > -1) return true;
	return false;
};

/**
 * 메인 화면에 데이터 변경사항이 있는지 여부를 체크한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {String} psAftMsg (Optional) 메시지구분
 * @returns {Boolean} 데이터 변경여부
 */
AppKit.prototype.isAppModified = function(app, psAftMsg) {
	var mainApp = this.getMainApp(app);
	if(mainApp == null) return false;
	
	var vaDataCtrls = new Array();
	var container = mainApp.getContainer();
	function getChildRecursive(poContainer){
	    var vaChildCtrls = poContainer.getAllRecursiveChildren();
	    for (var i=0, len=vaChildCtrls.length; i<len; i++) {
	        if (vaChildCtrls[i].type == "grid") {
	        	vaDataCtrls.push(vaChildCtrls[i]);
	        }else if (vaChildCtrls[i] instanceof cpr.controls.Container && vaChildCtrls[i].style.getClasses().indexOf("form-box") != -1) {
	        	vaDataCtrls.push(vaChildCtrls[i]);
	        }else if(vaChildCtrls[i] instanceof cpr.controls.UDCBase){
	        	var voUdcApp = vaChildCtrls[i].getEmbeddedAppInstance();
	        	if(voUdcApp) getChildRecursive(voUdcApp.getContainer());
	        }else if(vaChildCtrls[i] instanceof cpr.controls.EmbeddedApp){
	        	var voEmbApp = vaChildCtrls[i].getEmbeddedAppInstance();
	        	if(voEmbApp) getChildRecursive(voEmbApp.getContainer());
	        }
	    }
	}
	getChildRecursive(container);
	
	var modify = false;
	var ctrl = null;
	var vsFieldLabel = "";
	for(var i=0, len=vaDataCtrls.length; i<len; i++){
		ctrl = vaDataCtrls[i];
		if(ctrl.type == "grid"){
			if(ctrl.userAttr("ignoreModify") === "Y" || ctrl.dataSet == null) continue;
			if(ctrl.dataSet.isModified()){
				modify = true;
				vsFieldLabel = ctrl.fieldLabel;
				break;
			}
		}else{
			var dataSet = this.Group.getBindDataSet(ctrl.getAppInstance(), ctrl);
			if(dataSet != null && dataSet.isModified()) {
				modify = true;
				vsFieldLabel = ctrl.fieldLabel;
				break;
			}
		}
	}
	if(modify && psAftMsg != null && psAftMsg.toUpperCase() == "CRM"){//변경사항이 반영되지 않았습니다. 계속 하시겠습니까? confirm
		if(!this.Msg.confirm("CRM-M003", [vsFieldLabel])) return true;
		else return false;
	}
	return modify;
};

/**
 * 메인 화면에 데이터 변경사항이 있는지 여부를 체크한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @returns {Object Array} 변경된 데이터셋 객체 배열
 */
AppKit.prototype.getAllAppModifiedDataSet = function(app) {
	var mainApp = this.getMainApp(app);
	if(mainApp == null) return false;
	
	var vaDataCtrls = new Array();
	var vaDataSets = new Array();
	var container = mainApp.getContainer();
	function getChildRecursive(poContainer){
	    var vaChildCtrls = poContainer.getAllRecursiveChildren();
	    for (var i=0, len=vaChildCtrls.length; i<len; i++) {
	        if (vaChildCtrls[i].type == "grid") {
	        	vaDataCtrls.push(vaChildCtrls[i]);
	        }else if (vaChildCtrls[i] instanceof cpr.controls.Container && vaChildCtrls[i].style.getClasses().indexOf("form-box") != -1) {
	        	vaDataCtrls.push(vaChildCtrls[i]);
	        }else if(vaChildCtrls[i] instanceof cpr.controls.UDCBase){
	        	var voUdcApp = vaChildCtrls[i].getEmbeddedAppInstance();
	        	if(voUdcApp) getChildRecursive(voUdcApp.getContainer());
	        }else if(vaChildCtrls[i] instanceof cpr.controls.EmbeddedApp){
	        	var voEmbApp = vaChildCtrls[i].getEmbeddedAppInstance();
	        	if(voEmbApp) getChildRecursive(voEmbApp.getContainer());
	        }
	    }
	}
	getChildRecursive(container);
	
	var ctrl = null;
	for(var i=0, len=vaDataCtrls.length; i<len; i++){
		ctrl = vaDataCtrls[i];
		if(ctrl.type == "grid"){
			vaDataSets.push(ctrl.dataSet);
		}else{
			var dataSet = this.Group.getBindDataSet(ctrl.getAppInstance(), ctrl);
			if(dataSet == null) continue;
			vaDataSets.push(dataSet);
		}
	}
	
	return vaDataSets;
};

/**
 * 메인화면에 막(Cover)를 쒸운다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 */
AppKit.prototype.coverPage = function(app) {
	var coverCtl = new cpr.controls.Container("comPageCover");
	coverCtl.style.css({"background-color":"#ededed", "opacity":"0.5"});
	coverCtl.setLayout(new cpr.controls.layouts.XYLayout());
	var mainApp = this.getMainApp(app);
	
	var container = mainApp.getContainer();
	var layout = container.getLayout();
	if(layout instanceof cpr.controls.layouts.ResponsiveXYLayout){
		container.addChild(coverCtl, {
				positions: [{
						"media": "all and (min-width: 1320px)",
						"top": "0px",
						"right": "0px",
						"bottom": "0px",
						"left": "0px"
					},
					{
						"media": "all and (min-width: 1024px) and (max-width: 1319px)",
						"top": "0px",
						"right": "0px",
						"bottom": "0px",
						"left": "0px"
					},
					{
						"media": "all and (min-width: 500px) and (max-width: 1023px)",
						"hidden": false,
						"top": "0px",
						"right": "0px",
						"bottom": "0px",
						"left": "0px"
					}, 
					{
						"media": "all and (max-width: 499px)",
						"hidden": false,
						"top": "0px",
						"right": "0px",
						"bottom": "0px",
						"left": "0px"
					}
		]});
	}else if(layout instanceof cpr.controls.layouts.FormLayout){
		app.floatControl(coverCtl, {
			"top": "0px",
			"right": "0px",
			"bottom": "0px",
			"left": "0px"
		});
	}else{
		container.addChild(coverCtl, {
			"top": "0px",
			"right": "0px",
			"bottom": "0px",
			"left": "0px"
		});
	}
};

/**
 * 컨트롤(그룹) 또는 Grid의 내의 입력 값에 대한 유효성 체크를 수행한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol | Array} paCtlId 컨트롤 ID
 * @param {String} dataScope (all:그리드의 전체 데이터, modify:변경된 전체 Row, current:현재  Row)
 * @returns {Boolean} Valid true, Invalid false.
 */
AppKit.prototype.validate = function(app, paCtlId, dataScope) {
	dataScope = dataScope != null ? dataScope : "upd";
	if(!(paCtlId instanceof Array)){
		paCtlId = [paCtlId];
	}
	
	var valid = true;
	for(var i=0, len=paCtlId.length; i<len; i++) {
		var ctrlId = paCtlId[i];
		var ctrl = app.lookup(paCtlId[i]);
		if(ctrl instanceof cpr.controls.Grid){
			valid = this._validateGrid(ctrl, dataScope);
		}else if(ctrl instanceof cpr.controls.Container){
			/** @type cpr.bind.BindContext */
			var voBindContext = this.Group.getBindContext(app, ctrl);
			if(voBindContext){
				/**@type cpr.data.DataSet */
				var voDs = voBindContext.grid ? voBindContext.grid.dataSet : voBindContext.dataSet;
				var rowIndex = voBindContext.grid ? voBindContext.grid.getSelectedRowIndex() : voBindContext.rowIndex;
				//프리폼의 상태가 삭제상태이면... 유효성 체크에서 제외함
				if(voDs.getRowState(rowIndex) == cpr.data.tabledata.RowState.DELETED) continue;
			}
			
			valid = this._validateControl(ctrl);
		}else{
			valid = this._validateControl(ctrl);
		}
		
		if(valid == false) {
			return false;
		}
	}
	
	return true;
};

/**
 * @private
 * 일반 컨트롤에 대한 Validation 체크
 * @param {cpr.controls.UIControl} ctrl
 * @param {cpr.controls.UIControl} poParentCtl
 */
AppKit.prototype._validateControl = function(ctrl, poParentCtl) {
	if(!ctrl) return true;
	
	var valid = true;
	var _this = this;
	if(ctrl instanceof cpr.controls.Container) { // Group 일 경우 체크
		var children = this._getChildren(ctrl);
		var child;
		for(var i=0, len=children.length; i<len; i++){
			child = children[i];
			// 컨트롤별 Validation Check
			if(this._validateControl(child, ctrl) == false) {
				valid = false;
				break;
			}
		}
		return valid;
	} else if(ctrl instanceof cpr.controls.UDCBase){ //UDC인 경우
		var embApp = ctrl.getEmbeddedAppInstance();
		var children = embApp.getContainer().getAllRecursiveChildren();
		var child;
		for(var i=0, len=children.length; i<len; i++){
			child = children[i];
			// 컨트롤별 Validation Check
			if(this._validateControl(child, ctrl) == false) {
				valid = false;
				break;
			}
		}
		return valid;
	} else {
		valid = this.Validator.validate(ctrl, ctrl.value, poParentCtl);
		if(valid == false) {
			//탭내에 컨트롤이 존재하는 경우... 해당 탭페이지 포커싱
			this._focusToTabItem(ctrl);
			ctrl.focus();
		}
		return valid;
	}
};


/**
 * @private
 * Grid의 변경된 전체 데이터에 대한 Validation 체크
 * - 사이트별 Customizing 필요
 * 가능한 한 Validation 체크시 validate 메소드를 사용
 * @param {cpr.controls.Grid} poGrid 체크할 Grid
 * @param {String} dataScope (all:그리드의 전체 데이터, modify:변경된 전체 Row, current:현재  Row)
 * @returns {Boolean}
 */
AppKit.prototype._validateGrid = function(poGrid, dataScope) {
	dataScope = dataScope != null ? dataScope : "modify";
	/** @type cpr.controls.Grid */
	var grd = poGrid;
	if(!grd) return false;
	
	var vsDataBindCtxId = grd.userAttr("bindDataFormId");
	
	var _this = this;
	/**
	 * @type cpr.controls.gridpart.GridBand
	 */
	var detailBand = grd.detail;
	var cellCnt = detailBand.cellCount;
	
	/**
	 * @type cpr.data.DataSet
	 */
	var dataSet = grd.dataSet;
	var rowIndexs = null;
	if(dataScope == "all"){
		rowIndexs = dataSet.getRowStatedIndices(cpr.data.tabledata.RowState.INSERTED | cpr.data.tabledata.RowState.UPDATED | cpr.data.tabledata.RowState.DELETED | cpr.data.tabledata.RowState.UNCHANGED);
	}else{
		rowIndexs = dataSet.getRowStatedIndices(cpr.data.tabledata.RowState.INSERTED | cpr.data.tabledata.RowState.UPDATED);
	}
	var _this = this;
	var invalid = rowIndexs.some(function(idx) {
		var row = dataSet.getRow(idx);
		var col = null;
		for(var i = 0; i < cellCnt; i++) {
			/**  @type cpr.controls.gridpart.GridColumn */
			col = detailBand.getColumn(i);
			//컬럼 매핑노드가 없으면... SKIP
			if(col.columnName == null || col.columnName == "") continue;
			if(col.columnType == "checkbox" || col.columnType == "rowindex") continue;
			//컬럼 유형이 output이면... SKIP
			if(col.controlType == null || col.controlType == "output" || col.controlType == "button" || col.controlType == "img") continue;
			//신규행  PK 체크 무시... SKIP
			if(row.getState() == cpr.data.tabledata.RowState.INSERTED && (col.control && col.control.userAttr("ignorePk") == "Y")) continue;
			
			// 컨트롤별 Validation Check
			if(_this.Validator.validate(col.control, row.getValue(col.columnName), grd, idx, i) == false) {
				//유효성 체크로 인해 selection-change 발생여부 셋팅 
				grd.userAttr("selectionChangeByValidation", "true");
				//탭내에 컨트롤이 존재하는 경우... 해당 탭페이지 포커싱
				_this._focusToTabItem(grd);
				if(ValueUtil.isNull(vsDataBindCtxId)){
					grd.setEditRowIndex(idx, true);
					grd.focusCell(idx, i);
					//포커싱할 컬럼이 UDC인 경우에...
					var dctrl = grd.detail.getColumn(i).control;
					if(dctrl instanceof cpr.controls.UDCBase){
						var empApp = dctrl.getEmbeddedAppInstance();
						dctrl = AppUtil.getUDCBindValueControl(dctrl);
						if(dctrl) empApp.focus(dctrl.id);
					}
				}else{
					grd.selectRows(idx);
					var cctrl = _this.Group.getDataBindedControl(dataSet.getAppInstance(), vsDataBindCtxId, col.columnName);
					if(cctrl) _this.Control.setFocus(cctrl.getAppInstance(), cctrl.id);
				}
				
				return true;
			}
		}
		return false;
	});
	if(invalid == true) {
		return false;
	}
	
	return true;
};


/**
 * @private
 * Validation 체크시 컨트롤이 속한 탭폴더 선택용
 * @param {cpr.controls.UIControl} ctrl - 컨트롤 객체
 */
AppKit.prototype._focusToTabItem = function(ctrl) {
	/**@type cpr.controls.TabFolder */
	var tab = null;
	ctrl.findParent(function(pctrl){
		if(pctrl instanceof cpr.controls.TabFolder){
			tab = pctrl;
			return true;
		}
		return false;
	});
	if(tab){
		var tabItem = null;
		var tabItems = tab.getTabItems();
		ctrl.findParent(function(pctrl){
			tabItems.some(function(each){
				if( each.content == pctrl){
					tabItem = each;
					return true;
				}
				return false;
			});
			return tabItem != null;
		});
		if(tabItem && tabItem != tab.getSelectedTabItem()){
			tab.setSelectedTabItem(tabItem);
		}
	}
};

/**
 * @private
 * 그룹 컨트롤내의 자식 컨트롤 목록을 반환한다.
 * @param {cpr.controls.Container} pcGroup - 그룹컨트롤
 */
AppKit.prototype._getChildren = function(pcGroup) {
	var children = pcGroup.getAllRecursiveChildren();
	function getNextControls(each,children){
		var order = [each];
		var next = each;
		while(next != null){
			next = next.getNextControl();
			if(next != null && children.indexOf(next) > -1 && order.indexOf(next) == -1) order.push(next);
			else next = null;
		}
		return order;
	} 
	
	var orderCtrls = [];
	children.forEach(function(each){
		if(children.indexOf(each.getPrevControl()) ==-1 && each.getNextControl() != null){
			orderCtrls = getNextControls(each,children);
		}
	});
	
	var etcCtrls = [];
	children.forEach(function(each){
		if(orderCtrls.indexOf(each) == -1){
			etcCtrls.push(each);
		}
	});
	
	return orderCtrls.concat(etcCtrls);
};

/**
 * 디폴트 언어키 취득
 * - 사이트별 Customizing 필요 getDefaultLocale 메소드 필요.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @returns {String} 디폴트 언어키
 */
AppKit.prototype.getDefaultLocale = function(app) {
	var rootApp = app.getRootAppInstance();
	if(rootApp.hasAppMethod("getDefaultLocale")){
		return rootApp.callAppMethod("getDefaultLocale");
	}
};


function AppAuthKit(appKit){
	this._appKit = appKit;
};

/**
 * 로그인 사용자의 정보를 취득
 * - 사이트별 Customizing 필요 
 *   Root App에 getUserInfo 생성 필요.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {String} psUserInfoType (Optional) 사용자정보 TYPE 세션정보 참고
 * 					   또는 
 * 					   var mapUserInfo = util.getUserInfo();
 * 					   mapUserInfo.get("USER_ID");
 * 	USER_ID 		: 사용자 ID
 *  USER_NM			: 사용자명
 * 	USER_DIV_CD		: 사용자구분코드(STAFF:직원/PROF:교원/STUD:학생/GRAD_STUD:대학원생)
 *  STAFF_NO		: 교직원번호(교원원인에 한함)
 *  STUD_NO			: 학번(학생/대학원생에 한함)
 *  UNIV_CD			: 소속대학코드(학생/대학원생에 한함)
	ASGN_DEPT_CD	: 소속부서코드
	ASGN_DEPT_NM	: 소속부서명
	CUR_RCD_NM		: 학점은행제 교육과정명
 * @returns {String | cpr.data.DataMap} psUserInfoType 미지정시 Map 형태의 사용자 정보 리턴 
 */
AppAuthKit.prototype.getUserInfo = function(app, psUserInfoType) {
	var rootApp = app.getRootAppInstance();
	if(rootApp.hasAppMethod("getUserInfo")){
		if(ValueUtil.isNull(psUserInfoType)){
			return rootApp.callAppMethod("getUserInfo");
		}else{
			return rootApp.callAppMethod("getUserInfo", [psUserInfoType]);
		}
	}
};

/**
 * 메뉴를 바로 오픈할 경우 부모페이지에서 전달한 파라미터를 꺼내는 함수 (JSON 형태로 리턴됨)
 * 
 * [ 메뉴 파람 담는 법 및 메뉴 다이렉트 오픈 예제 ]
 * var voParam = { SUBJ_NO : util.Grid.getCellValue(app, "grdMain", "SUBJ_NO")};
 * util.MDI.open(app, "rptCSubjMstMng", voParam);
 * 
 * [ 사용법 ]
 * var voMenuParam = util.Auth.getMenuParam(app);
 * var vsSubjNo = voMenuParam.SUBJ_NO;
 * 
 * - 사이트별 Customizing 필요 
 *    Root App에 getMenuParam 메소드 생성 필요
 * @param {cpr.core.AppInstance} app
 * 
 */
AppAuthKit.prototype.getMenuParam = function(app) {
    var rootApp = app.getRootAppInstance();
    if(rootApp.hasAppMethod("getMenuParam")){
        return JSON.parse(rootApp.callAppMethod("getMenuParam"));
    }
};

/**
 * 메뉴 정보 취득
 * - 사이트별 Customizing 필요
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {String} (Optional) psMenuType  메뉴 정보 TYPE
 *                 생략시 메뉴 정보 MAP 리턴
 * @returns psMenuType 생략시 
 *          {cpr.utils.ObjectMap} 
 * 			getMenuInfo.get("OPRT_ROLE_ID");		//업무역할ID
			getMenuInfo.get("MENU_ID");				//메뉴ID
			getMenuInfo.get("PGM_ID");				//프로그램ID
			getMenuInfo.get("MENU_NM");				//메뉴명
			getMenuInfo.get("USE_AUTH_RCD"); 	//메뉴권한구분코드[CMN045]
			getMenuInfo.get("DEPT_AUTH_RCD"); 	 	//권한볌위코드[CMN035]
			getMenuInfo.get("UNIT_SYS_RCD");		//단위시스템코드[CMN003]
			getMenuInfo.get("CALL_PAGE");			//호출페이지
			getMenuInfo.get("TOP_MENU_ID");			//최상위 메뉴ID
			getMenuInfo.get("DOWNLD_YN");			//파일다운로드 여부
 */
AppAuthKit.prototype.getMenuInfo = function(app, psMenuType){
	var voMap = new cpr.utils.ObjectMap();
	
	var _mainApp = this._appKit.getMainApp(app);
	var vsData = null;
	if(_mainApp.__menuInfo != null){
		vsData = _mainApp.__menuInfo;
	}else{
		var rootApp = app.getRootAppInstance();
		/** @type cpr.controls.MDIFolder */
		var vcMdi = rootApp.lookup("mdiMainContent");
		if(vcMdi){
			var vcTabItem = vcMdi.getSelectedTabItem();
			if(vcTabItem != null){
				vsData = vcTabItem.userAttr("__menuInfo");
				_mainApp.__menuInfo = vsData;
			}
		}
	}
	if(!ValueUtil.isNull(vsData)){
		var voData = JSON.parse(vsData);
		if(psMenuType != null){
			return ValueUtil.fixNull(voData[psMenuType]);
		}else{
			for(var key in voData){
				voMap.put(key, ValueUtil.fixNull(voData[key]));
			}
			return voMap;
		}
	}else{
		return voMap;
	}
};

/**
 * 해당 화면이 소속권한 화면인지 여부(true/false) 반환한다.
 * - 사이트별 Customizing 필요
 * @param {cpr.core.AppInstance} app 앱인스턴스
 */
AppAuthKit.prototype.isAsgnDeptAuth = function(app){
	var vsDeptAuthRcd = this._appKit.Auth.getMenuInfo(app, "DEPT_AUTH_RCD");
	// 소속부서 or 소속관리부서
	return vsDeptAuthRcd == "CMN035.0003" || vsDeptAuthRcd == "CMN035.0007" ? true : false;
};

/**
 * 해당 화면이 개인권한 화면인지 여부(true/false) 반환한다.
 * - 사이트별 Customizing 필요
 * @param {cpr.core.AppInstance} app 앱인스턴스
 */
AppAuthKit.prototype.isPrivateAuth = function(app){
	var vsDeptAuthRcd = this._appKit.Auth.getMenuInfo(app, "DEPT_AUTH_RCD");
	return vsDeptAuthRcd == "CMN035.0009" ? true : false;
};

/**
 * 해당 화면이 학과장 권한으로 할당되었는지 여부(true/false) 반환한다.
 * - 사이트별 Customizing 필요
 * @param {cpr.core.AppInstance} app 앱인스턴스
 */
AppAuthKit.prototype.isDepartMentDeanAuth = function(app){
	var vsOprtRoleId = this._appKit.Auth.getMenuInfo(app, "OPRT_ROLE_ID");
	return vsOprtRoleId == "USER_CSR_POS" ? true : false;
};

/**
 * 해당 화면이 관리권한 화면인지 여부(true/false) 반환한다.
 * - 사이트별 Customizing 필요
 * @param {cpr.core.AppInstance} app 앱인스턴스
 */
AppAuthKit.prototype.isMenuMngAuth = function(app){
	/**@type cpr.core.AppInstance */
	var vsMenuAuthRcd = this._appKit.Auth.getMenuInfo(app, "USE_AUTH_RCD");
	return vsMenuAuthRcd == "CMN045.0003" ? true : false;
};

/**
 * 해당 화면이 조회전용 화면인지 여부(true/false) 반환한다.
 * - 사이트별 Customizing 필요
 * @param {cpr.core.AppInstance} app 앱인스턴스
 */
AppAuthKit.prototype.isReadUseAuth = function(app){
	/**@type cpr.core.AppInstance */
	var vsUseAuthRcd = this._appKit.Auth.getMenuInfo(app, "USE_AUTH_RCD");
	return vsUseAuthRcd == "CMN045.0002" ? true : false;
};

/**
 * 사용자 권한에 따라 핸들링되어야 하는 UI 컨트롤 목록을 지정한다.
 * 기본적으로 공통처리되며, 추가 예외적으로 적용되어야 하는 컨트롤들만을 지정하면 된다.
 * - 사이트별 Customizing 필요
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol | Array} paCtrls - 대상 컨트롤 ID 또는 ID 배열
 */
AppAuthKit.prototype.setAuthCtrls = function(app, paCtrls){
	/**@type cpr.core.AppInstance */
	var _app = this._appKit.getMainApp(app);
	
	if(!(paCtrls instanceof Array)){
		paCtrls = [paCtrls];
	}
	if(_app.__AUTH_TARGET_CTRLS == null || _app.__AUTH_TARGET_CTRLS == undefined){
		_app.__AUTH_TARGET_CTRLS = [];
	}
	_app.__AUTH_TARGET_CTRLS.concat(paCtrls);
};

/**
 * 화면 권한에 따른 컨트롤 제어를 수행한다.
 * - 사이트별 Customizing 필요
 * ex) 조회권한인 경우 권한 컨트롤 비활성화처리
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {String} psMenuAuthDivRcd - 메뉴권한코드[CMN045]
 * @param {String} psSearchBoxId - (Optional) 검색조건 그룹ID
 */
AppAuthKit.prototype.applyAuthForCtrls = function(app, psMenuAuthDivRcd, psSearchBoxId){
	if(app.isRootAppInstance()) return;
	
	var getParameterByName = function(name, url) {
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	    var results = regex.exec(url);
	    return results == null ? "" : results[2];
	}
	
	//새창으로 띄웠는지 여부 Flag, 새창으로 띄운 경우... 무조건 조회용임
	var vsFlag = getParameterByName("flag", top.location.href); 
	
	if(vsFlag !== "R" && psMenuAuthDivRcd != "CMN045.0002") return;
	
	var vaSearchBoxIds = ValueUtil.split((!ValueUtil.isNull(psSearchBoxId) ? psSearchBoxId : ""), ",");
	
	var vaTargetCtrls = new Array();
	var container = app.getContainer();
	function getChildRecursive(poContainer){
	    var vaChildCtrls = poContainer ? poContainer.getAllRecursiveChildren() : container.getAllRecursiveChildren();
	    for (var i=0, len=vaChildCtrls.length; i<len; i++) {
	        if (vaChildCtrls[i].type == "udc.com.comButton"
	        	|| vaChildCtrls[i].type == "udc.com.comButtonAddDel"
	        	|| vaChildCtrls[i].type == "grid"
	        	|| vaChildCtrls[i].type == "button"
	        	|| vaChildCtrls[i].type == "container" && vaSearchBoxIds.indexOf(vaChildCtrls[i].id) == -1 && (vaChildCtrls[i].getLayout() instanceof cpr.controls.layouts.FormLayout)) {
	        	vaTargetCtrls.push(vaChildCtrls[i]);
	        }else if (vaChildCtrls[i] instanceof cpr.controls.Container ) {
	        	getChildRecursive(vaChildCtrls[i]);
	        }
	    }
	    vaChildCtrls = null;
	}
	
	//하위의 대상 컨트롤들을 모두 취합
	getChildRecursive(container);
	
	//추가적으로 화면단에 대한 넘겨준 대상 컨트롤이 있는 경우 
	if(!ValueUtil.isNull(app.__AUTH_TARGET_CTRLS)){
		vaTargetCtrls.concat(app.__AUTH_TARGET_CTRLS);
	}
	
	var header = this._appKit.Group.getAllChildrenByType(app, "udc.com.appHeader");
	if(header != null && header.length > 0){
		var vcCtrl = header[0].getEmbeddedAppInstance().lookup("grpButtons");
		if(vcCtrl){
			vcCtrl.visible = false;
		}
	}
	
	vaTargetCtrls.forEach(function(ctrl){
		//공통 작업버튼 UDC인 경우
		if(ctrl.type == "udc.com.comButton" || ctrl.type == "udc.com.comButtonAddDel"){
			ctrl.visible = false;
		//그리드인 경우
		}else if(ctrl.type == "grid"){
			if(ctrl.readOnly !== true) ctrl.readOnly = true;
		//프리폼인 경우
		}else if(ctrl.type == "container"){
			if(ctrl.style && ctrl.style.getClasses().join(";").indexOf("form-box") != -1 && ctrl.getBindContext() != null) ctrl.enabled = false;
		//버튼인 경우
		}else if(ctrl.type == "button"){
			var vsStyle = ctrl.style ? ctrl.style.getClasses().join(";") : "";
			//커밋 버튼, 신규 버튼, 삭제 버튼, 프리폼 삭제 버튼, 저장 버튼
			if(vsStyle.indexOf("btn-commit") != -1 || vsStyle.indexOf("btn-new") != -1 || vsStyle.indexOf("btn-delete") != -1 || vsStyle.indexOf("btn-delete-save") != -1 || vsStyle.indexOf("btn-save") != -1){
				ctrl.visible = false;
			}
		}
	});
};

// 모든 selection-change 이벤트에시 그리드에 대한  필터만 추가.
//- 사이트별 Customizing 필요
cpr.events.EventBus.INSTANCE.addFilter("selection-change", function(e) {
    // 이벤트를 발생 시킨 컨트롤
    var control = e.control;
    /** @type cpr.core.AppInstance */
    var _app = control.getAppInstance();
    
    // 이벤트 발송자가 그리드 이고.
    if (control instanceof cpr.controls.Grid) {
    	/** @type cpr.controls.Grid */
    	var grid = control;
    	if(grid.selectionUnit == "cell" && grid.getSelectedIndices()[0] == null){
    		 e.stopPropagation();
    	}else{
    		var rowIndex = grid.selectionUnit != "cell" ? grid.getSelectedRowIndex() : grid.getSelectedIndices()[0]["rowIndex"];
	        // 그리드 선택 ROW가 -1이라면...
	        if (rowIndex < 0) {
	            // 이벤트 전파를 차단시킵니다.
	            e.stopPropagation();
	        }
    	}
    }
});



// 모든 before-selection-change 이벤트에시 그리드에 대한  필터만 추가.
//- 사이트별 Customizing 필요
cpr.events.EventBus.INSTANCE.addFilter("before-selection-change", function(e) {
    // 이벤트를 발생 시킨 컨트롤
    var control = e.control;
    /** @type cpr.core.AppInstance */
    var _app = control.getAppInstance();
    
    // 이벤트 발송자가 그리드 이고.
    if (control instanceof cpr.controls.Grid) {
    	if(e.newSelection[0] == null || e.newSelection[0] == undefined){
    		// 이벤트 전파를 차단시킵니다.
            e.stopPropagation();
		}
    }
});

//모든 before-value-change 이벤트에시 인풋박스에 대한 대소문자 자동변환.
//- 사이트별 Customizing 필요
cpr.events.EventBus.INSTANCE.addFilter("before-value-change", function(e) {
    // 이벤트를 발생 시킨 컨트롤
    var control = e.control;
    /** @type cpr.core.AppInstance */
    
    // 이벤트 발송자가 인풋박스이면.
    if (control.type === "inputbox") {
    	var inputLetter = control.userAttr("inputLetter");
		if (inputLetter == "uppercase") {
			if (/[a-z]/g.test(e.newValue)) {
				var newValue = e.newValue.toUpperCase();
				control.value = newValue;
				e.preventDefault();
				e.stopPropagation();
			}
		} else if (inputLetter == "lowercase") {
			if (/[A-Z]/g.test(e.newValue)) {
				var newValue = e.newValue.toLowerCase();
				control.value = newValue;
				e.preventDefault();
				e.stopPropagation();
			}
		}
    }
});

//cpr.core.Platform.INSTANCE.onerror = function(report){
//	console.log(JSON.stringify(report.stack, null, "  "));
//};

exports.AppKit = AppKit;


globals.createModel = function(){
	return new AppKit();
}

globals.createCommonUtil = function(){
//	var vsMainAppId = "app/com/inc/main"; //메인 APP-ID를 지정
//	try {
//		/**
//		 * @type cpr.core.AppInstance
//		 */
//		var rootApp = cpr.core.Platform.INSTANCE.lookup(vsMainAppId).getInstances()[0];
//		return rootApp.callAppMethod("getCommonUtil");
//	} catch (ex){
		return new AppKit();
//	}
};


//round 함수
cpr.expression.ExpressionEngine.INSTANCE.registerFunction("getRound", function(value, position) {
	if(isNaN(value)) return 0;
	else if(value == Infinity || value == -Infinity) return 0;
	if(position == undefined || position == null) return Math.round(value);
	else return Math.round(value * (10 * position))/(10 * position);
});
//floor 함수
cpr.expression.ExpressionEngine.INSTANCE.registerFunction("getFloor", function(value, position) {
	if(isNaN(value)) return 0;
	else if(value == Infinity || value == -Infinity) return 0;
	if(position == undefined || position == null) return Math.floor(value);
	else return Math.floor(value * (10 * position))/(10 * position);
});
//숫자 천단위 콤마 포맷
cpr.expression.ExpressionEngine.INSTANCE.registerFunction("formatToNumber", function(value) {
	if(isNaN(value)) return value;
	return new String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});