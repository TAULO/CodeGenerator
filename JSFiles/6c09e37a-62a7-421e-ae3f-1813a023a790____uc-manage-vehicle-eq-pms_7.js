// CHANGE LOG:
// 2015/12/04 - MSHUSSAI - updated user permissions in order to allow UC_FLEETMANAGER and UC-SYSADMIN roles to edit Vehicle Description and Comments

var emNameLabelConfig = {lengthLimit : 150, textTemplate : "<span style='color:#FF0000;'>{0}</span>", nameFieldTemplate : "{0} {1}<br/>{2}<br/>{3}",
        textColor : "#000000", defaultValue : "", raw : false };
var vehicleClassLabelConfig = {lengthLimit : 50, textTemplate : "<span style='color:#FF0000;'>{0}</span>", nameFieldTemplate : "{0}<br/>{1}",
        textColor : "#000000", defaultValue : "", raw : false };
var labelClassLabelConfig = {lengthLimit : 50, textTemplate : "<span style='color:#FF0000;'>{0}</span>", nameFieldTemplate : "{0}",
        textColor : "#000000", defaultValue : "", raw : false };


var vehicleCreateBasicController = View.createController("vehicleBasicController", {
	quest : null,
	currentStatus: null,
	afterViewLoad: function() {
		View.setToolbarButtonVisible('printButton', false);
		View.setToolbarButtonVisible('emailButton', false);
		View.setToolbarButtonVisible('alterButton', false);
		View.setToolbarButtonVisible('favoritesButton', false);
		docCntrl.docTable='vehicle';
		docCntrl.docPkeyLabel = ['vehicle','Vehicle','wr','Work Request'];
		docCntrl.docPdf=false;
		var sectionLabels = document.getElementsByName("sectionLabels");
		 for (var i = 0, len = sectionLabels.length; i < len; i++) {
					this.removeTextChildNodes(sectionLabels[i]);
					var td = sectionLabels[i].parentNode;
					this.removeTextChildNodes(td);
					var tr = td.parentNode;
					tr.deleteCell(0);
					td.colSpan = 4;
					td.width = '100%';
					td.style.padding = "0px";
		}

		//vehiclerisk_details.getElementField('vehicle.haz_doc')

			//setNameField: function(id, panel, fieldName, nameTable, nameField, restrictValues, configObj)

		BRG.UI.setNameField('haz_doc_span', this.vehicle_details, 'vehicle.haz_doc','<span style="color:#FF0000;">(if applicable)</span>')
		BRG.UI.setNameField('ins_peril_span', this.vehiclerisk_details, 'vehicle.cost_ins_perils','<span style="color:#FF0000;">(excluding Windshield)</span>')
		BRG.UI.setNameField('ins_prem_span', this.vehiclerisk_details, 'vehicle.cost_ins_premium','<span style="color:#FF0000;">(July 1 - June 30)</span>')


	},

	afterInitialDataFetch: function() {
		this.vehicleManagementTabs.addEventListener('beforeTabChange', this.beforeTabChange.createDelegate(this));
	//	var selectBox = $("vehicle_details_vehicle.status");
		var selectBox = $("vstatus");
		selectBox.remove(selectBox.length - 1)
		this.disableTabs();

	},

	beforeTabChange: function(tabPanel, selectedTabName, newTabName){
		if (newTabName == 'reportsTab') {
			var vehicleId = this.vehicle_details.getFieldValue('vehicle.vehicle_id');
			var restriction = new Ab.view.Restriction();
			restriction.addClause("vehicle.vehicle_id", vehicleId, '=');
			var mainTab = View.panels.get("vehicleManagementTabs");
			var reportsTab = mainTab.findTab('reportsTab');
			//reportsTab.useParentRestriction = true;
			reportsTab.restriction = restriction;
			reportsTab.refresh(restriction);
			reportsTab.loadView();
		}
		else if (newTabName == 'docsTab') {
			this.additionalDocsGrid.addParameter('vehicleIdParam', this.vehicle_details.getFieldValue('vehicle.vehicle_id'));
			this.additionalDocsGrid.refresh();
			this.additionalDocsGrid.show(true);
		}
    },

	showVehicle: function(row) {
		var rest = "vehicle.vehicle_type_id='" + row['vehicle_type.vehicle_type_id'].replace(/'/g, "''") + "'"
		vehicleCreateBasicController.vehicle_drilldown.refresh(rest);
		vehicleCreateBasicController.vehicle_details.show(false);
		vehicleCreateBasicController.vehiclerisk_details.show(false);
		vehicleCreateBasicController.doc_grid.show(false);
		vehicleCreateBasicController.additionalDocsGrid.show(false);
		vehicleCreateBasicController.pms_grid.show(false);
		vehicleCreateBasicController.disableTabs();
	},
	vehicle_type_drilldown_onRefresh: function(){
		this.vehicle_type_drilldown.refresh();
		this.vehicle_drilldown.show(false);
		this.vehicle_details.show(false);
		this.vehiclerisk_details.show(false);;
		this.doc_grid.show(false);
		this.additionalDocsGrid.show(false);
		this.pms_grid.show(false);
		this.disableTabs();
	},
	vehicle_drilldown_onVehicle_addNew : function(){
		this.vehicle_details.refresh(null,true);
		this.eq_details.refresh(null,true);
		this.doc_grid.show(false);
		this.additionalDocsGrid.show(false);
		this.pms_grid.show(false);
		setInsertFlag()
		this.vehicleManagementTabs.disableTab('riskMGRTab');
		this.vehicleManagementTabs.disableTab('docsTab');
	},
/*	<command type="showPanel" panelId="vehicle_details" newRecord="true"/>
			<command type="showPanel" panelId="vehiclerisk_details" newRecord="true"/>
			<command type="showPanel" panelId="eq_details" newRecord="true"/>

			<command type="clearPanel" panelId="doc_grid"/>
			<command type="showPanel" panelId="doc_grid" show="false"/>
			<!--command type="clearPanel" panelId="eq_riskdocs"/>
			<command type="showPanel" panelId="eq_riskdocs" show="false"/-->
			<command type="clearPanel" panelId="pms_grid"/>
			<command type="showPanel" panelId="pms_grid" show="false"/>
			<command type="callFunction" functionName="setInsertFlag"/>
			<command type="selectTabPage" tabPageName="riskMGRTab" newRecord="true"/>
			<command type="selectTabPage" tabPageName="fleetMGRTab" newRecord="true"/>
*/
	disableTabs: function(){
		//this.vehicleManagementTabs.disableTab('fleetMGRTab');
		//this.vehicleManagementTabs.disableTab('riskMGRTab');
		//this.vehicleManagementTabs.disableTab('docsTab');
		//this.vehicleManagementTabs.disableTab('reportsTab');
	},

	veh_search_onActionSearchBarcode: function(){
		// get the barcode from the inputbox.
		var vehCode = this.veh_search.getFieldValue("vehicle.vehicle_id");

		this.vehicle_drilldown.refresh("vehicle_id = '"+vehCode.replace(/'/g, "''")+"'");
	},


	vehicle_details_afterRefresh: function() {
/* 		var vehicleId = this.vehicle_details.getFieldValue('vehicle.vehicle_id');
		var restriction = 'vehicle.vehicle_id='+vehicleId+"'";
		var mainTab = View.panels.get("vehicleManagementTabs");
		mainTab.findTab('reportsTab').restriction = restriction; */

		var status = this.vehicle_details.getFieldValue("vehicle.status");
		this.vehicle_details.setFieldValue("vstatus",status);
		var q_id = 'FLEET - VEHICLE SAFETY';
		this.quest = new Ab.questionnaire.Quest(q_id, 'vehicle_details', !(View.user.role=='UC_FLEETMANAGER' || View.user.role=='UC-SYSDEV'));

		BRG.UI.addNameField('vehicle_type_info', this.vehicle_details, 'vehicle.vehicle_type_id', 'vehicle_type', ['description','class_id'], {'vehicle_type.vehicle_type_id' : 'vehicle.vehicle_type_id'}, vehicleClassLabelConfig);
		BRG.UI.addNameField('perm_em', this.vehicle_details, 'vehicle.em_id', 'em', ['name_first','name_last','phone','email'], {'em.em_id' : 'vehicle.em_id'}, emNameLabelConfig);
		BRG.UI.addNameField('org_contact_info', this.vehicle_details, 'vehicle.org_contact', 'em', ['name_first','name_last','phone','email'], {'em.em_id' : 'vehicle.org_contact'}, emNameLabelConfig);
		BRG.UI.addNameField('org_admin_info', this.vehicle_details, 'vehicle.org_admin', 'em', ['name_first','name_last','phone','email'], {'em.em_id' : 'vehicle.org_admin'}, emNameLabelConfig);
		BRG.UI.addNameField('budget_owner_info', this.vehicle_details, 'vehicle.budget_owner', 'em', ['name_first','name_last','phone','email'], {'em.em_id' : 'vehicle.budget_owner'}, emNameLabelConfig);
		BRG.UI.addNameField('inspected_by_info', this.vehicle_details, 'vehicle.inspected_by', 'em', ['name_first','name_last','phone','email'], {'em.em_id' : 'vehicle.inspected_by'}, emNameLabelConfig);
		BRG.UI.addNameField('disposal_requestor_info', this.vehicle_details, 'vehicle.disposal_requestor', 'em', ['name_first','name_last','phone','email'], {'em.em_id' : 'vehicle.disposal_requestor'}, emNameLabelConfig);
		BRG.UI.addNameField('disposal_authorizer_info', this.vehicle_details, 'vehicle.disposal_authorizer', 'em', ['name_first','name_last','phone','email'], {'em.em_id' : 'vehicle.disposal_authorizer'}, emNameLabelConfig);
		BRG.UI.addNameField('vn_id_info', this.vehicle_details, 'vehicle.vn_id', 'vn', ['company'], {'vn.vn_id' : 'vehicle.vn_id'}, labelClassLabelConfig);

		loadVehAcctCode(this.vehicle_details.getFieldValue("vehicle.ac_id"));
	},



	vehicle_details_beforeSave : function() {
    	// beforeSaveQuestionnaire() adds questionnaire answers to virtual XML field
    	this.quest.beforeSaveQuestionnaire();
    	return true;
    },

	vehiclerisk_details_afterRefresh: function() {
		BRG.UI.addNameField('vehiclerisk_type_info', this.vehiclerisk_details, 'vehicle.vehicle_type_id', 'vehicle_type', ['description','class_id'], {'vehicle_type.vehicle_type_id' : 'vehicle.vehicle_type_id'}, vehicleClassLabelConfig);
		document.getElementById("old_hazmat_types").value = this.vehiclerisk_details.getFieldValue('vehicle.hazmat_types');
		document.getElementById("old_hazmat_from").value = this.vehiclerisk_details.getFieldValue('vehicle.hazmat_from');
		document.getElementById("old_hazmat_to").value = this.vehiclerisk_details.getFieldValue('vehicle.hazmat_to');
		document.getElementById("vehicle.risk_comments.old").value = this.vehiclerisk_details.getFieldValue('vehicle.risk_comments');
	},

   removeTextChildNodes:function(element){
		var node =  undefined;
		var i = (element.childNodes.length)-1;
		for (;i>-1;i--){
			node = element.childNodes[i];
			if ((node!=undefined) && (node.nodeName=="#text")){
				element.removeChild(node);;
			}
		}
	},
	checkDisablePMS: function() {
        if (this.currentStatus == null) {
            this.eq_details.record.oldValues['eq.status'];
        }

        var newStatus = this.eq_details.record.values['eq.status'];
        if (this.currentStatus != newStatus) {
            var interval_freq = 1;
            switch(newStatus) {
            case 'out':
            case 'dec':
                interval_freq = 4;
                break;
            default:
                interval_freq = 1;
                break;
            }

            // change the interval_freq of all the pms
            this.pms_grid.gridRows.each(function (row) {
                var record = row.getRecord();
				var pms_id = record.getValue('pms.pms_id');
				var saveRecord = new Ab.data.Record();
				saveRecord.isNew = false;
				saveRecord.setValue('pms.pms_id', pms_id);
                saveRecord.setValue('pms.interval_freq', interval_freq);

				//delete record.oldValues['pms.interval_freq'];   // ensure the interval_freq saves
				saveRecord.oldValues = new Object();
				saveRecord.oldValues['pms.pms_id'] = pms_id;

				View.dataSources.get('pms_ds').saveRecord(saveRecord);
            });

            // rerun the pmdd generation for this equipment
            var eq_id = this.eq_details.getFieldValue('eq.eq_id');
            var PMSRest = "pms.eq_id = '"+eq_id.replace(/'/g, "''")+"'"

            var parameters = {
                "pmsidRestriction": PMSRest
            }

            try {
                var result = Workflow.call('AbBldgOpsOnDemandWork-pmddScheduledDates-BRGPmScheduleGenerator', parameters);
            }
            catch (e) {
                Workflow.handleError(e);
            }


        }

        this.pms_grid.refresh("pms.eq_id='"+this.eq_details.getFieldValue('eq.eq_id').replace(/'/g,"''")+"'");
        this.currentStatus = newStatus;
    },
	schedule_edit_saveForm: function() {

		frm = this.schedule_edit
		bolPMDD = frm.record.isNew

		if (!bolPMDD) {bolPMDD = frm.record.getValue('pms.interval_type') != frm.getFieldValue('pms.interval_type')}

		if (!bolPMDD) {bolPMDD = frm.record.getValue('pms.interval_freq') != frm.getFieldValue('pms.interval_freq')}
		if (!bolPMDD) {
			var interval = "pms.interval_" + frm.record.getValue('pms.interval_freq')
			bolPMDD = frm.record.getValue(interval) != frm.getFieldValue(interval)
		}
		if (!bolPMDD) {bolPMDD = frm.record.getValue('pms.fixed') != frm.getFieldValue('pms.fixed')}
		if (!bolPMDD) {bolPMDD = frm.record.getValue('pms.date_first_todo').dateFormat('Y-m-j' ) != frm.getFieldValue('pms.date_first_todo')}

		if (!bolPMDD) {bolPMDD = frm.record.getValue('pms.interval_type') != frm.getFieldValue('pms.interval_type')}

		if (!bolPMDD) {bolPMDD = frm.record.getValue('pms.interval_freq') != frm.getFieldValue('pms.interval_freq')}
		if (!bolPMDD) {
			var interval = "pms.interval_" + frm.record.getValue('pms.interval_freq')
			bolPMDD = frm.record.getValue(interval) != frm.getFieldValue(interval)
		}
		if (!bolPMDD) {bolPMDD = frm.record.getValue('pms.fixed') != frm.getFieldValue('pms.fixed')}
		if (!bolPMDD) {bolPMDD = frm.record.getValue('pms.date_first_todo').dateFormat('Y-m-j' ) != frm.getFieldValue('pms.date_first_todo')}

		if (this.schedule_edit.save()) {
			this.pms_grid.refresh();
			if (bolPMDD) {
				PMSRest = "pms.pms_id in (" + frm.getFieldValue('pms.pms_id') + ")"
				PMSRest = PMSRest + " and (exists (select 1 from pmp where pmp.pmp_id = pms.pmp_id and pmp.pmp_type <> 'EQ')"
				PMSRest = PMSRest + " or exists (select 1 from eq where eq.eq_id = pms.eq_id and eq.status IN ('in', 'rep')))"

				var parameters = {
					"pmsidRestriction": PMSRest
				}

				try {
					var result = Workflow.call('AbBldgOpsOnDemandWork-pmddScheduledDates-BRGPmScheduleGenerator', parameters);
				}
				catch (e) {
					Workflow.handleError(e);
				}
			}

			//View.closeDialog();
			this.schedule_edit.closeWindow();
		}
	},
	pms_grid_afterRefresh: function() {
        var eqStatus = this.eq_details.getFieldValue('eq.status');
        if (eqStatus == 'out' || eqStatus == 'dec' || this.eq_details.getFieldValue('eq.eq_id') == "") {
            this.pms_grid.actions.get('standard_add').enable(false);
        }
    },

	updatePmsAcctDesc: function() {
	},

	updateVehAcctDesc: function() {
	},
    
    schedule_edit_afterRefresh: function() {
        loadAcctCode(this.schedule_edit.getFieldValue('pms.ac_id'));
		
		var vehicle_id = this.vehicle_details.getFieldValue('vehicle.eq_id');
		//alert(vehicle_id);
		this.schedule_edit.setFieldValue("pms.eq_id",vehicle_id);
		
		//var schedule_edit = View.panels.get("schedule_edit");
		//var vehicle_details = View.panels.get("vehicle_details");
		//alert(vehicle_details);
		//schedule_edit.setFieldValue("pms.eq_id",vehicle_details.getFieldValue("vehicle.eq_id"));
    }

});

function getEquipmentDetails() {
	var row = this;
	// Hidden equipment panel
	var eq_details = View.panels.get("eq_details");
	var eq_restriction = {"eq.eq_id":row["vehicle.eq_id"]};

	eq_details.refresh(eq_restriction, false);
	eq_details.show(true);

	var vehicle_details = View.panels.get("vehicle_details");

	var vehicle_restriction = {"vehicle.vehicle_id":row["vehicle.vehicle_id"]};

	vehicle_details.refresh(vehicle_restriction, false);
	vehicle_details.show(true);

	// PM Schedule Panel
	var pms_grid = View.panels.get("pms_grid");
	var wr_grid = View.panels.get("wr_grid");
	var eq_id = eq_details.getFieldValue("eq.eq_id");

	var where_clause = " and pms.eq_id = '" + eq_id + "'";
	var wr_where_clause = " and wrhwr.eq_id = '" + eq_id + "'";

	pms_grid.addParameter("clientRestriction", where_clause);
	pms_grid.refresh();
	pms_grid.show(true);
	
	wr_grid.addParameter("clientRestriction", wr_where_clause);
	wr_grid.refresh();
	wr_grid.show(true);
	

	// Risk tab panels
	var vehiclerisk_details = View.panels.get("vehiclerisk_details");

	vehiclerisk_details.refresh(vehicle_restriction, false);

	if(row["vehicle.cost_ins_perils"]!="" && parseFloat(row["vehicle.cost_ins_perils"])!=0){
		document.getElementById('insCheckBox').checked = true;
		vehiclerisk_details.fields.get('vehicle.cost_ins_perils').dom.parentElement.parentElement.style.display='';
		vehiclerisk_details.fields.get('vehicle.cost_ins_premium').dom.parentElement.parentElement.style.display='';
		vehiclerisk_details.fields.get('vehicle.hailstorm_writeoff').dom.parentElement.parentElement.style.display='none';
		//vehiclerisk_details.fields.get('vehicle.hailstorm_repair').dom.parentElement.parentElement.style.display='none';
	} else {
		document.getElementById('insCheckBox').checked = false;
		vehiclerisk_details.fields.get('vehicle.cost_ins_perils').dom.parentElement.parentElement.style.display='none';
		//vehiclerisk_details.fields.get('vehicle.cost_ins_premium').dom.parentElement.parentElement.style.display='none';
		vehiclerisk_details.fields.get('vehicle.hailstorm_writeoff').dom.parentElement.parentElement.style.display='';
		//vehiclerisk_details.fields.get('vehicle.hailstorm_repair').dom.parentElement.parentElement.style.display='';
	}

	if(row["vehicle.hazmat_types"]!="") {
		document.getElementById('hazCheckBox').checked = true;
		vehiclerisk_details.fields.get('vehicle.hazmat_types').dom.parentElement.parentElement.style.display='';
		//vehiclerisk_details.fields.get('vehicle.haz_doc').dom.parentElement.parentElement.style.display='';
		vehiclerisk_details.fields.get('vehicle.hazmat_from').dom.parentElement.parentElement.style.display='';
		//vehiclerisk_details.fields.get('vehicle.hazmat_to').dom.parentElement.parentElement.style.display='';
	} else {
		document.getElementById('hazCheckBox').checked = false;
		vehiclerisk_details.fields.get('vehicle.hazmat_types').dom.parentElement.parentElement.style.display='none';
		//vehiclerisk_details.fields.get('vehicle.haz_doc').dom.parentElement.parentElement.style.display='none';
		vehiclerisk_details.fields.get('vehicle.hazmat_from').dom.parentElement.parentElement.style.display='none';
		//vehiclerisk_details.fields.get('vehicle.hazmat_to').dom.parentElement.parentElement.style.display='none';
	}

	if(!(View.user.role=='UC_FLEETRISKMANAGER' || View.user.role=='UC-SYSDEV')){
		//alert("disable 1");
		document.getElementById('insCheckBox').disabled = true;
		document.getElementById('hazCheckBox').disabled = true;
		//document.getElementById("vehicle.risk_comments.new").style.display='none';
		//document.getElementById("vehiclerisk_details_field_gen22_labelCell").style.display='none';
		//document.getElementById("vehicle.risk_comments.new").parentElement.previousSibling.style.display='none';
		document.getElementById("vehicle.risk_comments.old").readOnly = true;
		document.getElementById("vehicle.risk_comments.old").className="defaulteditform_textareaabdata_readonly"
	}

	if(!(View.user.role=='UC_FLEETRISKMANAGER' || View.user.role=='UC-SYSDEV' || View.user.role=='UC_FLEETMANAGER' || View.user.role=='UC-SYSADMIN')){
		//alert("disable 2");
		document.getElementById("vehicle.description.new").readOnly = true;
		document.getElementById("vehicle.description.new").className="defaulteditform_textareaabdata_readonly"
		document.getElementById("vehicle.comments.new").readOnly = true;
		document.getElementById("vehicle.comments.new").className="defaulteditform_textareaabdata_readonly"
	}

	document.getElementById("vehicle.description.new").value = vehicle_details.getFieldValue("vehicle.description");
	document.getElementById("vehicle.comments.new").value = vehicle_details.getFieldValue("vehicle.comments");
	//document.getElementById("vehicle.risk_comments.new").value = "";
	//document.getElementById("vehicle.risk_comments.old").readOnly = true;

	vehiclerisk_details.show(true);

	// Documents Panels
	var eq_docs = View.panels.get('doc_grid');
//	var eq_riskdocs = View.panels.get('eq_riskdocs');
/*
	var eq_id = eq_details.getFieldValue("eq.eq_id");

	var where_clause = " and uc_docs_extension.table_name in('eq','wr') and uc_docs_extension.pkey in(select convert(char(30),wr_id) wr_id from wr where eq_id='" + eq_id + "' " +
					   " union select convert(char(30),wr_id) wr_id from hwr where eq_id='" + eq_id + "' union select eq_id from vehicle where eq_id='" + eq_id + "')";

	eq_docs.addParameter("clientRestriction", where_clause);
	eq_docs.refresh();
	eq_docs.show(true);
	*/
	docCntrl.docPkey= vehicle_details.getFieldValue("vehicle.vehicle_id");
	rest = "(uc_docs_extension.table_name='"+docCntrl.docTable+"' and uc_docs_extension.pkey='" + docCntrl.docPkey+ "')"
	rest += " or (uc_docs_extension.table_name='wr' and exists (select 1 from wr inner join vehicle on wr.eq_id=vehicle.eq_id where vehicle.vehicle_id = '" +  docCntrl.docPkey+ "' and wr.wr_id=uc_docs_extension.pkey))"
	eq_docs.refresh(rest)
/*
	eq_riskdocs.addParameter("clientRestriction", where_clause);
	eq_riskdocs.refresh();
	eq_riskdocs.show(true);
*/
	setUpdateFlag();
}

function getNewEquipmentDetails(eqId) {
	// Hidden equipment panel
	var eq_details = View.panels.get("eq_details");
	var eq_restriction = {"eq.eq_id":eqId};

	eq_details.refresh(eq_restriction, false);
	eq_details.show(true);

	var vehicle_details = View.panels.get("vehicle_details");

	var vehicle_restriction = {"vehicle.eq_id":eqId};

	vehicle_details.refresh(vehicle_restriction, false);
	vehicle_details.show(true);

	// PM Schedule Panel
	var pms_grid = View.panels.get("pms_grid");
	var eq_id = eq_details.getFieldValue("eq.eq_id");

	var where_clause = " and pms.eq_id = '" + eq_id + "'";

	pms_grid.addParameter("clientRestriction", where_clause);
	pms_grid.refresh();
	pms_grid.show(true);

	// Risk tab panels
	var vehiclerisk_details = View.panels.get("vehiclerisk_details");
	vehicle_restriction = {"vehicle.vehicle_id":vehicle_details.getFieldValue("vehicle.vehicle_id")};
	vehiclerisk_details.refresh(vehicle_restriction, false);

	if(vehiclerisk_details.getFieldValue("vehicle.cost_ins_perils")!="" && parseFloat(vehiclerisk_details.getFieldValue("vehicle.cost_ins_perils"))!=0){
		document.getElementById('insCheckBox').checked = true;
		vehiclerisk_details.fields.get('vehicle.cost_ins_perils').dom.parentElement.parentElement.style.display='';
	//	vehiclerisk_details.fields.get('vehicle.cost_ins_premium').dom.parentElement.parentElement.style.display='';
		vehiclerisk_details.fields.get('vehicle.hailstorm_writeoff').dom.parentElement.parentElement.style.display='none';
	//	vehiclerisk_details.fields.get('vehicle.hailstorm_repair').dom.parentElement.parentElement.style.display='none';
	} else {
		document.getElementById('insCheckBox').checked = false;
		vehiclerisk_details.fields.get('vehicle.cost_ins_perils').dom.parentElement.parentElement.style.display='none';
	//	vehiclerisk_details.fields.get('vehicle.cost_ins_premium').dom.parentElement.parentElement.style.display='none';
		vehiclerisk_details.fields.get('vehicle.hailstorm_writeoff').dom.parentElement.parentElement.style.display='';
	//	vehiclerisk_details.fields.get('vehicle.hailstorm_repair').dom.parentElement.parentElement.style.display='';
	}

	if(vehiclerisk_details.getFieldValue("vehicle.hazmat_types")!="") {
		document.getElementById('hazCheckBox').checked = true;
		vehiclerisk_details.fields.get('vehicle.hazmat_types').dom.parentElement.parentElement.style.display='';
	//	vehiclerisk_details.fields.get('vehicle.haz_doc').dom.parentElement.parentElement.style.display='';
		vehiclerisk_details.fields.get('vehicle.hazmat_from').dom.parentElement.parentElement.style.display='';
	//	vehiclerisk_details.fields.get('vehicle.hazmat_to').dom.parentElement.parentElement.style.display='';
	} else {
		document.getElementById('hazCheckBox').checked = false;
		vehiclerisk_details.fields.get('vehicle.hazmat_types').dom.parentElement.parentElement.style.display='none';
	//	vehiclerisk_details.fields.get('vehicle.haz_doc').dom.parentElement.parentElement.style.display='none';
		vehiclerisk_details.fields.get('vehicle.hazmat_from').dom.parentElement.parentElement.style.display='none';
	//	vehiclerisk_details.fields.get('vehicle.hazmat_to').dom.parentElement.parentElement.style.display='none';
	}

	if(!(View.user.role=='UC_FLEETRISKMANAGER' || View.user.role=='UC-SYSDEV')){
		alert("disable 3");
		document.getElementById('insCheckBox').disabled = true;
		document.getElementById('hazCheckBox').disabled = true;
		//document.getElementById("vehicle.risk_comments.new").style.display='none';
		document.getElementById("vehicle.risk_comments.old").readOnly = true;
		document.getElementById("vehicle.risk_comments.old").className="defaulteditform_textareaabdata_readonly"
	}

	if(!(View.user.role=='UC_FLEETMANAGER' || View.user.role=='UC-SYSDEV' || View.user.role=='UC_FLEETMANAGER' || View.user.role=='UC-SYSADMIN')){
		document.getElementById("vehicle.description.new").readOnly = true;
		document.getElementById("vehicle.description.new").className="defaulteditform_textareaabdata_readonly"
		document.getElementById("vehicle.comments.new").readOnly = true;
		document.getElementById("vehicle.comments.new").className="defaulteditform_textareaabdata_readonly"
	}

	document.getElementById("vehicle.description.new").value = vehicle_details.getFieldValue("vehicle.description");
	document.getElementById("vehicle.comments.new").value = vehicle_details.getFieldValue("vehicle.comments");
	//document.getElementById("vehicle.risk_comments.new").value = "";
	//document.getElementById("vehicle.risk_comments.old").readOnly = true;

	vehiclerisk_details.show(true);

	// Documents Panels

	var eq_docs = View.panels.get('doc_grid');
	//var eq_riskdocs = View.panels.get('eq_riskdocs');

	/*var eq_id = eq_details.getFieldValue("eq.eq_id");

	var where_clause = " and uc_docs_extension.table_name in('eq','wr') and uc_docs_extension.pkey in(select convert(char(30),wr_id) wr_id from wr where eq_id='" + eq_id + "' " +
					   " union select convert(char(30),wr_id) wr_id from hwr where eq_id='" + eq_id + "' union select eq_id from vehicle where eq_id='" + eq_id + "')";

	eq_docs.addParameter("clientRestriction", where_clause);
	eq_docs.refresh();
	eq_docs.show(true);

	eq_riskdocs.addParameter("clientRestriction", where_clause);
	eq_riskdocs.refresh();
	eq_riskdocs.show(true);
*/
	docCntrl.docPkey= vehicle_details.getFieldValue("vehicle.vehicle_id");
	rest = "(uc_docs_extension.table_name='"+docCntrl.docTable+"' and uc_docs_extension.pkey='" + docCntrl.docPkey+ "')"
	rest += " or (uc_docs_extension.table_name='wr' and exists (select 1 from wr inner join vehicle on wr.eq_id=vehicle.eq_id where vehicle.vehicle_id = '" +  docCntrl.docPkey+ "' and wr.wr_id=uc_docs_extension.pkey))"
	eq_docs.refresh(rest)

	setUpdateFlag();
}

function setUpdateFlag() {
	$('update_or_insert').value = 'update';
}

function setInsertFlag() {
	$('update_or_insert').value = 'insert';
	$('vehicle.description.new').value = '';
	$('vehicle.comments.new').value = '';
	$('vehicle.risk_comments.old').value = '';
	//$('vehicle.risk_comments.new').value = '';
}

function showCheckedFields(){
	var vehiclerisk_details = View.panels.get("vehiclerisk_details");
	if(document.getElementById('insCheckBox').checked){
		vehiclerisk_details.fields.get('vehicle.cost_ins_perils').dom.parentElement.parentElement.style.display='';
		//vehiclerisk_details.fields.get('vehicle.cost_ins_premium').dom.parentElement.parentElement.style.display='';
		vehiclerisk_details.fields.get('vehicle.hailstorm_writeoff').dom.parentElement.parentElement.style.display='none';
		//vehiclerisk_details.fields.get('vehicle.hailstorm_repair').dom.parentElement.parentElement.style.display='none';
	} else {
		vehiclerisk_details.fields.get('vehicle.cost_ins_perils').dom.parentElement.parentElement.style.display='none';
		//vehiclerisk_details.fields.get('vehicle.cost_ins_premium').dom.parentElement.parentElement.style.display='none';
		vehiclerisk_details.fields.get('vehicle.hailstorm_writeoff').dom.parentElement.parentElement.style.display='';
		//vehiclerisk_details.fields.get('vehicle.hailstorm_repair').dom.parentElement.parentElement.style.display='';
	}
	if(document.getElementById('hazCheckBox').checked){
		vehiclerisk_details.fields.get('vehicle.hazmat_types').dom.parentElement.parentElement.style.display='';
		//vehiclerisk_details.fields.get('vehicle.haz_doc').dom.parentElement.parentElement.style.display='';
		vehiclerisk_details.fields.get('vehicle.hazmat_from').dom.parentElement.parentElement.style.display='';
		//vehiclerisk_details.fields.get('vehicle.hazmat_to').dom.parentElement.parentElement.style.display='';
	} else {
		vehiclerisk_details.fields.get('vehicle.hazmat_types').dom.parentElement.parentElement.style.display='none';
		//vehiclerisk_details.fields.get('vehicle.haz_doc').dom.parentElement.parentElement.style.display='none';
		vehiclerisk_details.fields.get('vehicle.hazmat_from').dom.parentElement.parentElement.style.display='none';
		//svehiclerisk_details.fields.get('vehicle.hazmat_to').dom.parentElement.parentElement.style.display='none';
	}
}

function saveVehicleData() {
	var eq_details = View.panels.get("eq_details");
	var vehicle_details = View.panels.get("vehicle_details");

	vehicle_details.clearValidationResult();

	var status = vehicle_details.getFieldValue("vstatus");
	vehicle_details.setFieldValue("vehicle.status",status);
	vehicle_details.setFieldValue("vehicle.description",document.getElementById("vehicle.description.new").value);
	vehicle_details.setFieldValue("vehicle.comments",document.getElementById("vehicle.comments.new").value);
	var invalid = "false";

	if(status=='DISP'){
	//	vehicle_details.addInvalidField('vehicle.status','');
		vehicle_details.addInvalidField('vstatus','');
		invalid = "true";
	}
	else if(status=='AVAIL'){eq_details.setFieldValue("eq.status","in");}
	else if(status=='UPRM'){eq_details.setFieldValue("eq.status","rep");}
	else if(status=='URPR'){eq_details.setFieldValue("eq.status","rep");}
	else if(status=='UACC'){eq_details.setFieldValue("eq.status","rep");}
	else if(status=='URTN'){eq_details.setFieldValue("eq.status","out");}
	else if(status=='UOTH'){eq_details.setFieldValue("eq.status","out");}
	else {eq_details.setFieldValue("eq.status","out");}

	var eqId = vehicle_details.getFieldValue('vehicle.eq_id');

	if(invalid=="true"){
		vehicle_details.displayValidationResult();
	} else {

		if(document.getElementById('update_or_insert').value=='update') {

			eq_details.setFieldValue('eq.eq_id',eqId);
			eq_details.setFieldValue('eq.dv_id',vehicle_details.getFieldValue('vehicle.dv_id'));
			eq_details.setFieldValue('eq.dp_id',vehicle_details.getFieldValue('vehicle.dp_id'));
			eq_details.setFieldValue('eq.option1',vehicle_details.getFieldValue('vehicle.mfr_id'));
			eq_details.setFieldValue('eq.option2',vehicle_details.getFieldValue('vehicle.model_id'));
			eq_details.setFieldValue('eq.use1','FLEET VEHICLE');
			eq_details.setFieldValue('eq.eq_std','VEHCL-XXXX-XXXXX');
			eq_details.setFieldValue('eq.meter',vehicle_details.getFieldValue('vehicle.meter'));
			eq_details.setFieldValue('eq.meter_units',vehicle_details.getFieldValue('vehicle.meter_units'));
			eq_details.setFieldValue('eq.comments',vehicle_details.getFieldValue('vehicle.description'));

			if (eq_details.save()) {
				if (!vehicle_details.save()){
					return false
				}
			}
			else {
				return false
			}



		} else if(document.getElementById('update_or_insert').value=='insert') {

			eq_details.refresh({}, true);

			eq_details.setFieldValue('eq.eq_id',vehicle_details.getFieldValue('vehicle.eq_id'));
			eq_details.setFieldValue('eq.dv_id',vehicle_details.getFieldValue('vehicle.dv_id'));
			eq_details.setFieldValue('eq.dp_id',vehicle_details.getFieldValue('vehicle.dp_id'));
			eq_details.setFieldValue('eq.option1',vehicle_details.getFieldValue('vehicle.mfr_id'));
			eq_details.setFieldValue('eq.option2',vehicle_details.getFieldValue('vehicle.model_id'));
			eq_details.setFieldValue('eq.use1','FLEET VEHICLE');
			eq_details.setFieldValue('eq.eq_std','VEHCL-XXXX-XXXXX');
			eq_details.setFieldValue('eq.meter',vehicle_details.getFieldValue('vehicle.meter'));
			eq_details.setFieldValue('eq.meter_units',vehicle_details.getFieldValue('vehicle.meter_units'));
			eq_details.setFieldValue('eq.comments',vehicle_details.getFieldValue('vehicle.comments'));
			eq_details.setFieldValue('eq.bl_id','PP');

			if(eq_details.save()) {
				if(!vehicle_details.save()) {
					eq_details.deleteRecord();
					return false;
				} else {
					getNewEquipmentDetails(eqId);
				}
			} else {
				return false;
			}
		} else {
			View.showMessage("Insert / Update flag not set.");
			return false;
		};
	}
}

function dispVehicle() {
	var eq_details = View.panels.get("eq_details");
	var vehicle_details = View.panels.get("vehicle_details");
	var pms_grid = View.panels.get("pms_grid");
	var eq_docs = View.panels.get('doc_grid');
	//var eq_riskdocs = View.panels.get('eq_riskdocs');
	var vehiclerisk_details = View.panels.get("vehiclerisk_details");
	var vehicle_log_panel = View.panels.get("vehicle_log_panel");
	var vehicle_drilldown = View.panels.get("vehicle_drilldown");



	vehicle_details.clearValidationResult();

	var invalid = "false";

	if(vehicle_details.getFieldValue("vehicle.disposal_no")==""){
		invalid = "true";
		vehicle_details.addInvalidField('vehicle.disposal_no','');
	}
	if(vehicle_details.getFieldValue("vehicle.date_excessed")==""){
		invalid = "true";
		vehicle_details.addInvalidField('vehicle.date_excessed','');
	}
	if(vehicle_details.getFieldValue("vehicle.disposal_requestor")==""){
		invalid = "true";
		vehicle_details.addInvalidField('vehicle.disposal_requestor','');
	}
	if(vehicle_details.getFieldValue("vehicle.disposal_authorizer")==""){
		invalid = "true";
		vehicle_details.addInvalidField('vehicle.disposal_authorizer','');
	}
	if(vehicle_details.getFieldValue("vehicle.date_reg_cancelled")==""){
		invalid = "true";
		vehicle_details.addInvalidField('vehicle.date_reg_cancelled','');
	}
	if(vehicle_details.getFieldValue("vehicle.date_ins_cancelled")==""){
		invalid = "true";
		vehicle_details.addInvalidField('vehicle.date_ins_cancelled','');
	}



	if(invalid=="true") {
		pms_grid.show(false);
		vehicle_details.displayValidationResult();
	} else {

		var message = "The selected vehicle will be sent to archive and no longer available in this view. Are you sure?";
		View.confirm(message, function(button) {
			if (button == 'yes') {
				eq_details.setFieldValue("eq.status","dec");
				vehicle_details.setFieldValue("vehicle.status","DISP");

				if(vehicle_details.save()) {
					eq_details.save();
					vehicleCreateBasicController.checkDisablePMS()
					vehicle_details.show(false);
					pms_grid.show(false);
					eq_details.show(false);
					eq_docs.show(false);
					//eq_riskdocs.show(false);
					vehiclerisk_details.show(false);
					vehicle_log_panel.show(false);
					//vehicle_drilldown.show(false);
					vehicle_drilldown.refresh();
					this.disableTabs();
				} else {
					return false;
				}
			}
		});
	}
}

function saveVehicleRiskData() {
	var vehiclerisk_details = View.panels.get("vehiclerisk_details");
	var vehicle_log_panel = View.panels.get("vehicle_log_panel");
	var invalid = "false";

	vehiclerisk_details.clearValidationResult();

	//var status = vehiclerisk_details.getFieldValue("vehicle.status");
	//var status = vehiclerisk_details.getFieldValue("vstatus");

	if (document.getElementById("old_hazmat_types").value != vehiclerisk_details.getFieldValue('vehicle.hazmat_types') ||
		document.getElementById("old_hazmat_from").value != vehiclerisk_details.getFieldValue('vehicle.hazmat_from') ||
		document.getElementById("old_hazmat_to").value != vehiclerisk_details.getFieldValue('vehicle.hazmat_to'))
	{
		vehicle_log_panel.setFieldValue('uc_vehicle_log.vehicle_id',vehiclerisk_details.getFieldValue('vehicle.vehicle_id'));
		vehicle_log_panel.setFieldValue('uc_vehicle_log.hazmat_types',vehiclerisk_details.getFieldValue('vehicle.hazmat_types'));
		vehicle_log_panel.setFieldValue('uc_vehicle_log.hazmat_from',vehiclerisk_details.getFieldValue('vehicle.hazmat_from'));
		vehicle_log_panel.setFieldValue('uc_vehicle_log.hazmat_to',vehiclerisk_details.getFieldValue('vehicle.hazmat_to'));
		vehicle_log_panel.setFieldValue('uc_vehicle_log.safety_quest',vehiclerisk_details.getFieldValue('vehicle.vehicle_quest'));
		vehicle_log_panel.setFieldValue('uc_vehicle_log.em_id',View.user.name);
		vehicle_log_panel.save();
	}

	if(document.getElementById('insCheckBox').checked){
		if(vehiclerisk_details.getFieldValue('vehicle.cost_ins_perils')=="") {
			invalid = "true";
			vehiclerisk_details.addInvalidField('vehicle.cost_ins_perils', getMessage('costInsPerils'));
		}
		if(vehiclerisk_details.getFieldValue('vehicle.cost_ins_premium')=="") {
			invalid = "true";
			vehiclerisk_details.addInvalidField('vehicle.cost_ins_premium', getMessage('costInsPremium'));
		}
	} else if(!document.getElementById('insCheckBox').checked){
		vehiclerisk_details.setFieldValue('vehicle.cost_ins_perils','');
		vehiclerisk_details.setFieldValue('vehicle.cost_ins_premium','');
		vehiclerisk_details.setFieldValue('vehicle.hailstorm_writeoff','0');
		vehiclerisk_details.setFieldValue('vehicle.hailstorm_repair','0');
	}
	if(document.getElementById('hazCheckBox').checked){
		if(vehiclerisk_details.getFieldValue('vehicle.hazmat_types')=="") {
			invalid = "true";
			vehiclerisk_details.addInvalidField('vehicle.hazmat_types', getMessage('hazmatMaterialsCarried'));
		}
		if(vehiclerisk_details.getFieldValue('vehicle.hazmat_from')=="") {
			invalid = "true";
			vehiclerisk_details.addInvalidField('vehicle.hazmat_from', getMessage('hazmatMaterialsFrom'));
		}
		if(vehiclerisk_details.getFieldValue('vehicle.hazmat_to')=="") {
			invalid = "true";
			vehiclerisk_details.addInvalidField('vehicle.hazmat_to', getMessage('hazmatMaterialsTo'));
		}
	} else if(!document.getElementById('hazCheckBox').checked){
		vehiclerisk_details.setFieldValue('vehicle.hazmat_types','');
		vehiclerisk_details.setFieldValue('vehicle.hazmat_from','');
		vehiclerisk_details.setFieldValue('vehicle.hazmat_to','');
	}

	vehiclerisk_details.setFieldValue("vehicle.risk_comments",document.getElementById("vehicle.risk_comments.old").value);
/*
	var newNotes = document.getElementById("vehicle.risk_comments.new").value;
	if (newNotes != "") {
		var currentUser = View.user.name;		// use View.user.employee.name for the em name instead.
		var currentDate = new Date();
		var dateString = currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1)
			+ "/" + currentDate.getDate();


		//Parse the hours to get the correct time.
		var curr_hour = currentDate.getHours();
		var am_pm = "";
		if (curr_hour < 12) {
			am_pm = "AM";
		}
		else {
			am_pm = "PM";
		}
		if (curr_hour == 0) {
			curr_hour = 12;
		}
		if (curr_hour > 12) {
			curr_hour = curr_hour - 12;
		}

		// add leading 0 to minutes if needed.
		var curr_min = currentDate.getMinutes();
		curr_min = curr_min + "";
		if (curr_min.length == 1) {
			curr_min = "0" + curr_min;
		}

		var timeString = curr_hour + ":" + curr_min + " " + am_pm;

		var comments_mgr = vehiclerisk_details.getFieldValue("vehicle.risk_comments");
		if(comments_mgr != ""){
			comments_mgr = comments_mgr + "   ";
		}


		// For Firefox: (replace lone \n chars with \r\n)
		newNotes = replaceLF(newNotes);

		comments_mgr = comments_mgr + currentUser + " - " + dateString + "-" + timeString + " : " + newNotes + "\r\n";

		vehiclerisk_details.setFieldValue("vehicle.risk_comments",comments_mgr);
		document.getElementById("vehicle.risk_comments.new").value = "";
		document.getElementById("vehicle.risk_comments.old").value = comments_mgr;
	}
*/
	if(invalid=="true"){
		vehiclerisk_details.displayValidationResult();
	} else {
		if(vehiclerisk_details.save()) {
			vehicle_log_panel.refresh(null,true);
		} else {
			return false;
		}
	}
}
/*
function addNewDocument() {
	var eq_details = View.panels.get('eq_details');
	var ds_docs = View.dataSources.get('ds_docs');

	var record = new Ab.data.Record({
		'uc_docs_extension.pkey': eq_details.getFieldValue('eq.eq_id'),
		'uc_docs_extension.table_name': 'eq',
		'uc_docs_extension.created_by': View.user.name,
		'uc_docs_extension.modified_by': View.user.name},
		true); // true means new record
	var ds_object = ds_docs.saveRecord(record);

	var restriction = {'uc_docs_extension.uc_docs_extension_id':ds_object.getValue('uc_docs_extension.uc_docs_extension_id')};
	View.openDialog('uc-vehicle-management-docs-dialog-addNew.axvw', restriction, false, {
		width: 800,
		height: 400,
		closeButton: false,
		maximize: false
	});
}

function newDocDialogOnLoad() {
    var addnew_doc_form = View.panels.get('addnew_doc_form');
	addnew_doc_form.show(true);
	addnew_doc_form.fields.get('uc_docs_extension.doc_name').actions.get('addnew_doc_form_uc_docs_extension.doc_name_checkInNewDocument').button.dom.onclick();
}

function checkInDocument() {
	var addnew_doc_form = View.panels.get('addnew_doc_form');
	if(addnew_doc_form.getFieldValue('uc_docs_extension.doc_name')=="") {
		addnew_doc_form.fields.get('uc_docs_extension.doc_name').actions.get('addnew_doc_form_uc_docs_extension.doc_name_checkInNewDocument').button.dom.onclick();
	}
	else {
		closeDocumentsDialog();
	}
}

function editDocument() {
	var row = this;
	var uc_docs_extension_id = row['uc_docs_extension.uc_docs_extension_id'];

	var restriction = {'uc_docs_extension.uc_docs_extension_id':uc_docs_extension_id};
	View.openDialog('uc-vehicle-management-docs-dialog.axvw', restriction, false, {
		width: 800,
		height: 400,
		closeButton: false,
		maximize: false
	});
}


function closeDocumentsDialog() {
	var openingView = View.getOpenerWindow().View;
	var eq_details = openingView.panels.get('eq_details');
	var eq_docs = openingView.panels.get('eq_docs');
	var eq_riskdocs = openingView.panels.get('eq_riskdocs');

	var eq_id = eq_details.getFieldValue("eq.eq_id");

	var where_clause = " and uc_docs_extension.table_name in('eq','wr') and uc_docs_extension.pkey in(select convert(char(30),wr_id) wr_id from wr where eq_id='" + eq_id + "' " +
					   " union select convert(char(30),wr_id) wr_id from hwr where eq_id='" + eq_id + "' union select eq_id from vehicle where eq_id='" + eq_id + "')";

	eq_docs.addParameter("clientRestriction", where_clause);
	eq_docs.refresh();
	eq_docs.show(true);

	eq_riskdocs.addParameter("clientRestriction", where_clause);
	eq_riskdocs.refresh();
	eq_riskdocs.show(true);

	openingView.closeDialog() ;
}

function resetNewDocDialog() {
	var openingView = View.getOpenerWindow().View;
	var eq_details = openingView.panels.get('eq_details');
	var eq_docs = openingView.panels.get('eq_docs');
	var eq_riskdocs = openingView.panels.get('eq_riskdocs');

	var eq_id = eq_details.getFieldValue("eq.eq_id");

	var where_clause = " and uc_docs_extension.table_name in('eq','wr') and uc_docs_extension.pkey in(select convert(char(30),wr_id) wr_id from wr where eq_id='" + eq_id + "' " +
					   " union select convert(char(30),wr_id) wr_id from hwr where eq_id='" + eq_id + "' union select eq_id from vehicle where eq_id='" + eq_id + "')";

	eq_docs.addParameter("clientRestriction", where_clause);
	eq_docs.refresh();
	eq_docs.show(true);

	eq_riskdocs.addParameter("clientRestriction", where_clause);
	eq_riskdocs.refresh();
	eq_riskdocs.show(true);

	var ds_docs = View.dataSources.get('ds_docs');

	var record = new Ab.data.Record({
		'uc_docs_extension.pkey': eq_id,
		'uc_docs_extension.table_name': 'eq',
		'uc_docs_extension.created_by': View.user.name,
		'uc_docs_extension.modified_by': View.user.name},
		true); // true means new record
	var ds_object = ds_docs.saveRecord(record);
	var restriction = {'uc_docs_extension.uc_docs_extension_id':ds_object.getValue('uc_docs_extension.uc_docs_extension_id')};

	var addnew_doc_form = View.panels.get('addnew_doc_form');
	addnew_doc_form.refresh(restriction);
	addnew_doc_form.show(true);
}

function resetEditDocDialog() {
	var openingView = View.getOpenerWindow().View;
	var eq_details = openingView.panels.get('eq_details');
	var eq_docs = openingView.panels.get('eq_docs');
	var eq_riskdocs = openingView.panels.get('eq_riskdocs');

	var eq_id = eq_details.getFieldValue("eq.eq_id");

	var where_clause = " and uc_docs_extension.table_name in('eq','wr') and uc_docs_extension.pkey in(select convert(char(30),wr_id) wr_id from wr where eq_id='" + eq_id + "' " +
					   " union select convert(char(30),wr_id) wr_id from hwr where eq_id='" + eq_id + "' union select eq_id from vehicle where eq_id='" + eq_id + "')";

	eq_docs.addParameter("clientRestriction", where_clause);
	eq_docs.refresh();
	eq_docs.show(true);

	eq_riskdocs.addParameter("clientRestriction", where_clause);
	eq_riskdocs.refresh();
	eq_riskdocs.show(true);

	var ds_docs = View.dataSources.get('ds_docs');

	var record = new Ab.data.Record({
		'uc_docs_extension.pkey': eq_id,
		'uc_docs_extension.table_name': 'eq',
		'uc_docs_extension.created_by': View.user.name,
		'uc_docs_extension.modified_by': View.user.name},
		true); // true means new record
	var ds_object = ds_docs.saveRecord(record);
	var restriction = {'uc_docs_extension.uc_docs_extension_id':ds_object.getValue('uc_docs_extension.uc_docs_extension_id')};

	var eq_doc_form = View.panels.get('eq_doc_form');
	eq_doc_form.refresh(restriction);
	eq_doc_form.show(true);
	eq_doc_form.fields.get('uc_docs_extension.doc_name').actions.get('eq_doc_form_uc_docs_extension.doc_name_checkInNewDocument').button.dom.onclick();
}

function grid_onShow(row) {
    var docId = row['uc_docs_extension.uc_docs_extension_id'];
    var DocFileName = row['uc_docs_extension.doc_name'];
    var keys = { 'uc_docs_extension_id': docId };

    View.showDocument(keys, 'uc_docs_extension', 'doc_name', DocFileName);
}

function docDialogOnLoad() {
    var eq_doc_form = View.panels.get('eq_doc_form');
	eq_doc_form.show(true);
}
*/
function saveCloseDialog(){
	var eq_details = View.panels.get("eq_details");
	if(eq_details.save()){
		var openingView = View.getOpenerWindow().View;
		openingView.closeDialog() ;
	}
}

function onChangeInfoOrgContact(){

}

function afterSeletectOrgContact(fieldName, selectedValue, previousValue){
	//alert(selectedValue);
}

function setVehicleBarcode(){
	
	//var schedule_edit = View.panels.get("schedule_edit");
	//var vehicle_details = View.panels.get("vehicle_details");
	//alert(vehicle_details);
	//schedule_edit.setFieldValue("pms.eq_id",vehicle_details.getFieldValue("vehicle.eq_id"));
}

// *****************************************************************************
// Replaces lone LF (\n) with CR+LF (\r\n)
// *****************************************************************************
function replaceLF(value)
{
	String.prototype.reverse = function () {
		return this.split('').reverse().join('');
	};

	return value.reverse().replace(/\n(?!\r)/g, "\n\r").reverse();
}

function emailRiskManager() {
	var vehicle_details = View.panels.get("vehicle_details");

	try {
		var result = Workflow.callMethod('AbCommonResources-ucEmailService-sendEmail', 'AbBldgOpsOnDemandWork', 'UC_EMAIL_WFR',
		'UC_FLEET_RISKMGR_NOTIFY_BODY','UC_FLEET_RISKMGR_NOTIFY_SUBJECT','vehicle','vehicle_id',vehicle_details.getFieldValue('vehicle.vehicle_id'),
		'', vehicle_details.getFieldValue('em.email'));
	}
		catch (ex) {
	}

}

function emailFleetManager() {
	var vehiclerisk_details = View.panels.get("vehiclerisk_details");

	try {
		var result = Workflow.callMethod('AbCommonResources-ucEmailService-sendEmail', 'AbBldgOpsOnDemandWork', 'UC_EMAIL_WFR',
		'UC_FLEET_FLTMGR_NOTIFY_BODY','UC_FLEET_FLTMGR_NOTIFY_SUBJECT','vehicle','vehicle_id',vehiclerisk_details.getFieldValue('vehicle.vehicle_id'),
		'', vehiclerisk_details.getFieldValue('em.email'));
	}
		catch (ex) {
	}

}

// ************************************************************************
// Checks the Account Code (through PHP) and call the saveFormCallback function
// if successful.  Valid Account codes are automatically inserted into the
// ac table.
// ************************************************************************
function checkAcctAndSave()
{
	//check to see if the ac_id entered is null
	var parsed_ac_id = $('ac_id_part1').value +
				$('ac_id_part2').value +
				$('ac_id_part3').value +
				$('ac_id_part4').value +
				$('ac_id_part5').value +
				$('ac_id_part6').value +
				$('ac_id_part7').value +
				$('ac_id_part8').value;
	parsed_ac_id.replace(" ", "");

	//if parsed is null then save form directly
	if (parsed_ac_id=="") {
		saveFormCallback("");
	}
	else {
		// check account code through php
		uc_psAccountCode(
			$('ac_id_part1').value,
			$('ac_id_part2').value,
			$('ac_id_part3').value,
			$('ac_id_part4').value,
			$('ac_id_part5').value,
			$('ac_id_part6').value,
			$('ac_id_part7').value,
			$('ac_id_part8').value,
			'saveFormCallback');
	}
}

function saveFormCallback(acct)
{
	var success = false;
	var ac_id=acct.replace("\r\n\r\n", "");

	//check to see if the ac_id entered is null
	var parsed_ac_id = $('ac_id_part1').value +
				$('ac_id_part2').value +
				$('ac_id_part3').value +
				$('ac_id_part4').value +
				$('ac_id_part5').value +
				$('ac_id_part6').value +
				$('ac_id_part7').value +
				$('ac_id_part8').value;
	parsed_ac_id.replace(" ", "");

	//if parsed is not null, ensure that the returned ac_id isn't blank.
	if (parsed_ac_id != "" && ac_id == "") {
		ac_id = "0";
	}

	switch(ac_id)
	{
	case "1":
		View.showMessage(getMessage('error_Account1'));
		success = false;
		break;
	case "2":
		View.showMessage(getMessage('error_Account2'));
		success = false;
		break;
	case "3":
		View.showMessage(getMessage('error_Account3'));
		success = false;
		break;
	case "4":
		View.showMessage(getMessage('error_Account4'));
		success = false;
		break;
	case "5":
		View.showMessage(getMessage('error_Account5'));
		success = false;
		break;
	case "6":
		View.showMessage(getMessage('error_Account6'));
		success = false;
		break;
	case "7":
		View.showMessage(getMessage('error_Account7'));
		success = false;
		break;
	case "8":
		View.showMessage(getMessage('error_Account8'));
		success = false;
		break;
	case "99":
		View.showMessage(getMessage('error_Account99'));
		success = false;
		break;
	case "0":
		View.showMessage(getMessage('error_invalidAccount'));
		success = false;
		break;
	default:
		success = true;
	};

	// Set the valid account code
	if (success) {
		View.panels.get("schedule_edit").setFieldValue("pms.ac_id", ac_id);
		vehicleCreateBasicController.schedule_edit_saveForm();
	}
}

function loadAcctCode(acct) {
	var position = 0;
	var mark = acct.indexOf('-', position);
	var bu = acct.substring(position, mark);
	//fund
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var fund= acct.substring(position, mark);
	//dept
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var dept= acct.substring(position, mark);
	//account
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var account= acct.substring(position, mark);
	//program
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var program= acct.substring(position, mark);
	//internal
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var internal= acct.substring(position, mark);
	//project
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var project= acct.substring(position, mark);
	//affiliate
	position=mark+1;
	//mark=acct.indexOf('-',mark+1);
	var affiliate= acct.substring(position);

	$('ac_id_part1').value = bu;
	$('ac_id_part2').value = fund;
	$('ac_id_part3').value = dept;
	$('ac_id_part4').value = account;
	$('ac_id_part5').value = program;
	$('ac_id_part6').value = internal;
	$('ac_id_part7').value = project;
	$('ac_id_part8').value = affiliate;
}

function onPMPChange(){
	var panel = View.panels.get('schedule_edit');
	var records = BRG.Common.getDataRecords("pmp", ["pmp.interval_rec","pmp.interval_type","pmp.pmp_cat"], "pmp.pmp_id='" + panel.getFieldValue('pms.pmp_id').replace(/'/g, "''") +"'") ;
	if (records.length>0){
		record = records[0];
		panel.setFieldValue('pmp.interval_rec', record["pmp.interval_rec"]);
		panel.setFieldValue('pms.interval_1', record["pmp.interval_rec"]);
		panel.setFieldValue('pmp.interval_type', record["pmp.interval_type.raw"]);
		panel.setFieldValue('pms.interval_type', record["pmp.interval_type.raw"]);
		pmpSelValAfterSelect('pmp.pmp_cat',null,record["pmp.pmp_cat"]);
	}
}

function pmpSelValAfterSelect(field_name, selectedValue, prevValue, selectedValueRaw) {
	//if (field_name == 'pms.interval_type') {
		// Fixes Archibus issue where the selected value doesn't change the
		// drop down box.
	//	View.panels.get('schedule_edit').setFieldValue('pms.interval_type', selectedValueRaw);
	//}
	//else
	var panel = View.panels.get('schedule_edit');

	if (field_name == 'pmp.pmp_cat') {
		// if LPM make interval readOnly
		//Something wrong with
		panel.setFieldValue('pms.interval_type', panel.getFieldValue('pmp.interval_type'));
        if (selectedValue == 'LPM') {
			panel.enableField('pms.interval_1', false);
			panel.enableField('pms.interval_type', false);
		}
		else {
			panel.enableField('pms.interval_1', true);
			panel.enableField('pms.interval_type', true);
		}
	}
	else if (field_name == 'pms.interval_1') {
		panel.setFieldValue('pmp.interval_rec', selectedValue);
	}
	else if (field_name == 'pms.interval_type') {
		// Fixes Archibus issue where the selected value doesn't change the
		// drop down box.
		panel.setFieldValue('pmp.interval_type', selectedValueRaw);
	}
}

function mfrOnchange(fieldName, selectedValue, previousValue){
	View.panels.get('vehicle_details').setFieldValue("vehicle.model_id","");
}

function modelOnchange(){
	var model = View.panels.get('vehicle_details').getFieldValue("vehicle.model_id");
	var mfr = "";
	if (model != "") {
		var record = UC.Data.getDataRecord('flt_model', ['flt_model.mfr_id'], "flt_model.model_id='" + model.replace(/'/g, "''") + "'");
		mfr=record['flt_model.mfr_id'].l
	}
	View.panels.get('vehicle_details').setFieldValue("vehicle.mfr_id",mfr);
}

function regType(){
	var pnl = View.panels.get('vehicle_details')
	var val = pnl.getFieldValue("vehicle.occ");
	var rt = "<4,500 kg"
	if (val > 10){
		rt = ">10 Passengers"
	}
	else {
		val = pnl.getFieldValue("vehicle.gvw");
		if (val > 11794) {
			rt = ">11,794 kg"
		}
		else if (val >= 4500) {
			rt = "4,500 to 11,794 kg"
		}
	}
	pnl.setFieldValue("eq.option1",rt);
}



// ************************************************************************
// Checks the Account Code (through PHP) and call the saveFormCallback function
// if successful.  Valid Account codes are automatically inserted into the
// ac table.
// ************************************************************************
var vechicleDetailsSaveType = null;
var K_VECHICLE_SAVETYPE_SAVE = 'save';
var K_VECHICLE_SAVETYPE_NOTIFYRISK = 'notifyRisk';

function checkAcctSaveVehicleData() {
	vehicleDetailsSaveType = K_VECHICLE_SAVETYPE_SAVE;
	checkAcctSaveVehicleDetails();
}

function checkAcctNotifyRiskData() {
	vehicleDetailsSaveType = K_VECHICLE_SAVETYPE_NOTIFYRISK;
	checkAcctSaveVehicleDetails();

}

function checkAcctSaveVehicleDetails()
{
	//check to see if the ac_id entered is null
	var parsed_ac_id = $('vac_id_part1').value +
				$('vac_id_part2').value +
				$('vac_id_part3').value +
				$('vac_id_part4').value +
				$('vac_id_part5').value +
				$('vac_id_part6').value +
				$('vac_id_part7').value +
				$('vac_id_part8').value;
	parsed_ac_id.replace(" ", "");

	//if parsed is null then save form directly
	if (parsed_ac_id=="") {
		saveVehFormCallback("");
	}
	else {
		// check account code through php
		uc_psAccountCode(
			$('vac_id_part1').value,
			$('vac_id_part2').value,
			$('vac_id_part3').value,
			$('vac_id_part4').value,
			$('vac_id_part5').value,
			$('vac_id_part6').value,
			$('vac_id_part7').value,
			$('vac_id_part8').value,
			'saveVehFormCallback');
	}
}

function saveVehFormCallback(acct)
{
	var success = false;
	var ac_id=acct.replace("\r\n\r\n", "");

	//check to see if the ac_id entered is null
	var parsed_ac_id = $('vac_id_part1').value +
				$('vac_id_part2').value +
				$('vac_id_part3').value +
				$('vac_id_part4').value +
				$('vac_id_part5').value +
				$('vac_id_part6').value +
				$('vac_id_part7').value +
				$('vac_id_part8').value;
	parsed_ac_id.replace(" ", "");

	//if parsed is not null, ensure that the returned ac_id isn't blank.
	if (parsed_ac_id != "" && ac_id == "") {
		ac_id = "0";
	}

	switch(ac_id)
	{
	case "1":
		View.showMessage(getMessage('error_Account1'));
		success = false;
		break;
	case "2":
		View.showMessage(getMessage('error_Account2'));
		success = false;
		break;
	case "3":
		View.showMessage(getMessage('error_Account3'));
		success = false;
		break;
	case "4":
		View.showMessage(getMessage('error_Account4'));
		success = false;
		break;
	case "5":
		View.showMessage(getMessage('error_Account5'));
		success = false;
		break;
	case "6":
		View.showMessage(getMessage('error_Account6'));
		success = false;
		break;
	case "7":
		View.showMessage(getMessage('error_Account7'));
		success = false;
		break;
	case "8":
		View.showMessage(getMessage('error_Account8'));
		success = false;
		break;
	case "99":
		View.showMessage(getMessage('error_Account99'));
		success = false;
		break;
	case "0":
		View.showMessage(getMessage('error_invalidAccount'));
		success = false;
		break;
	default:
		success = true;
	};

	// Set the valid account code
	if (success) {
		View.panels.get("vehicle_details").setFieldValue("vehicle.ac_id", ac_id);
		if (!saveVehicleData()) {
			return false;
		}

		if (vehicleDetailsSaveType === K_VECHICLE_SAVETYPE_NOTIFYRISK) {
			emailRiskManager();
		}

		View.panels.get('vehicle_drilldown').refresh();
		View.panels.get('vehicle_log_panel').show(false);
		setUpdateFlag();
	}
}

function loadVehAcctCode(acct, panel_id) {
    if (panel_id == null) {
        panel_id = 'vac_id_part';
    }

	var position = 0;
	var mark = acct.indexOf('-', position);
	var bu = acct.substring(position, mark);
	//fund
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var fund= acct.substring(position, mark);
	//dept
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var dept= acct.substring(position, mark);
	//account
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var account= acct.substring(position, mark);
	//program
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var program= acct.substring(position, mark);
	//internal
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var internal= acct.substring(position, mark);
	//project
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var project= acct.substring(position, mark);
	//affiliate
	position=mark+1;
	//mark=acct.indexOf('-',mark+1);
	var affiliate= acct.substring(position);

	$(panel_id+'1').value = bu;
	$(panel_id+'2').value = fund;
	$(panel_id+'3').value = dept;
	$(panel_id+'4').value = account;
	$(panel_id+'5').value = program;
	$(panel_id+'6').value = internal;
	$(panel_id+'7').value = project;
	$(panel_id+'8').value = affiliate;
}
