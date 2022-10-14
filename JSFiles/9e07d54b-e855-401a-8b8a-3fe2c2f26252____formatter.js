jQuery.sap.declare("com.sap.incture.IMO_PM.formatter.formatter");
com.sap.incture.IMO_PM.formatter.formatter = {

	styleSysCondn: function (condn, Activity) {

		if (Activity) {

			if (condn === "0" || condn === "1" || condn === "") {
				//this.getParent().removeStyleClass("cellStyleRed");
				//this.addStyleClass("cellStyleGreen");
				$("#" + this.getParent().getId() + "-col11").removeClass("cellStyleGreen");
				$("#" + this.getParent().getId() + "-col11").addClass("cellStyleRed");

			} else {
				$("#" + this.getParent().getId() + "-col11").removeClass("cellStyleRed");
				$("#" + this.getParent().getId() + "-col11").addClass("cellStyleGreen");
				//this.getParent().removeStyleClass("cellStyleGreen");
				//this.getParent().addStyleClass("cellStyleRed");
			}
		} else {

			$("#" + this.getParent().getId() + "-col11").removeClass("cellStyleRed");
			$("#" + this.getParent().getId() + "-col11").removeClass("cellStyleGreen");
		}
		return condn;

	},
	//nischal -- Notification Detail's CreateWO button Visibility function
	setBtnVisibleCreateOrder: function (sValue) {
		if (sValue == "NOPR") {
			return true;
		} else {
			return false;
		}
	},
	//nischal -- notification Detail Revert button visible
	setBtnVisibleRevert: function (sValue) {
		if (sValue == "NOCO" || sValue == "NOCO ORAS") {
			return true;
		} else {
			return false;
		}
	},
	//nischal -- set Notification Detail View Enabled/Disabled based on Notification Status
	setEnabledBasedOnStatus: function (sValue) {
		if (sValue == "NOCO" || sValue == "NOCO ORAS") {
			return false;
		} else {
			return true;
		}
	},

	//nischal -- notificationDetail Release button visible
	setBtnVisibleRelease: function (sValue) {
		if (sValue == "NOPR" || sValue == "NOPR ORAS" || sValue == "NOCO" || sValue == "NOCO ORAS") {
			return false;
		} else {
			return true;
		}
	},
	//nischal -- notification Update button visible
	setBtnVisibleUpdate: function (sValue) {
		if (sValue == "NOCO" || sValue == "NOCO ORAS") {
			return false;
		} else {
			return true;
		}
	},
	//nischal -- notification close button visibility
	setBtnVisibleClose: function (sValue) {
		if (sValue == "NOCO" || sValue == "NOCO ORAS") {
			return false;
		} else {
			return true;
		}
	},
	VisiblityCNFLongText: function (operationId) {

		if (operationId) {

			return true;
		} else {

			return false;
		}

	},

	styleCNFLongText: function (Activity, aComments) {

		if (aComments && Activity) {

			if (aComments.length >= 1) {

				return true;
			} else {

				return false;
			}

		}

		return true;

	},

	fnDateConversion: function (date, gwdate) {
		if (date) {
			var iDate = date.getDate();
			var iMon = date.getMonth() + 1;
			var iYear = date.getFullYear();

			if (iMon < 10) {
				iMon = "0" + iMon;
			}

			if (iDate < 10) {
				iDate = "0" + iDate;
			}

			if (gwdate) {
				return iYear + "-" + iMon + "-" + iDate;
			}
			return iDate + "-" + iMon + "-" + iYear;
		}
		return "";
	},

	fnPriorityConversion: function (priority) {

		if (priority === "1") {

			return "CRITICAL";

		} else if (priority === "2") {
			return "MEDIUM";
		} else if (priority === "3") {
			return "HIGH";
		} else if (priority === "4") {
			return "LOW";
		} else {
			return "";
		}

	},

	fnDateSeperator: function (date) {

		if (date) {
			var iYear = date.substr(0, 4);
			var iMon = date.substr(4, 2);
			var iDate = date.substr(6, 2);

			return iDate + "-" + iMon + "-" + iYear;
		}

	},

	formatDateobjToString: function (oDate) {
		if (typeof (oDate) === "string") {
			return oDate;
		}
		var dd = oDate.getDate();
		var MM = oDate.getMonth() + 1;
		var yy = oDate.getFullYear();
		if (dd < 10) {
			dd = "0" + dd;
		}
		if (MM < 10) {
			MM = "0" + MM;
		}
		var newDate = yy + "-" + MM + "-" + dd;
		newDate = newDate + "T00:00:00";
		return newDate;
	},
	//createNotif
	formatDateobjToStringNotif: function (oDate, isTimeRequired) {
		if (typeof (oDate) === "string") {
			return oDate;
		}
		var dd = oDate.getDate();
		var MM = oDate.getMonth() + 1;
		var yy = oDate.getFullYear();
		var hh = oDate.getHours();
		var mm = oDate.getMinutes();
		if (dd < 10) {
			dd = "0" + dd;
		}
		if (MM < 10) {
			MM = "0" + MM;
		}

		if (isTimeRequired) {
			if (hh < 10) {
				hh = "0" + hh;
			}
			if (mm < 10) {
				mm = "0" + mm;
			}
		} else {
			hh = "00";
			mm = "00";
		}
		var newDate = yy + "-" + MM + "-" + dd;
		newDate = newDate + "T" + hh + ":" + mm + ":00";
		return newDate;
	},
	formatDateobjToStringShiftReport: function (oDate, type) {
		if (typeof (oDate) === "string") {
			return oDate;
		} else if (oDate === null || oDate === "") {
			return "";
		}
		var dd = oDate.getDate();
		var MM = oDate.getMonth() + 1;
		var yy = oDate.getFullYear();
		if (dd < 10) {
			dd = "0" + dd;
		}
		if (MM < 10) {
			MM = "0" + MM;
		}
		var newDate = yy + "-" + MM + "-" + dd;
		if (type === "WORK_SUMMARY") {
			var time = this.formatTimeShiftEnd(oDate);
			if (time) {
				newDate = newDate + "T" + time;
			} else {
				newDate = newDate + "T00:00:00";
			}
		} else {
			newDate = newDate + "T00:00:00";
		}
		return newDate;
	},

	formatTimeShiftEnd: function (date) {
		if (!date) {
			return "";
		}

		date = new Date(date);
		var hh = date.getHours();
		/*	if (hh > 12) {

				hh = hh % 12;
			}*/
		if (hh < 10) {
			hh = "0" + hh;
		}
		hh = hh.toString();
		var mi = date.getMinutes();
		if (mi < 10) {
			mi = "0" + mi;
		}
		mi = mi.toString();
		var ss = date.getSeconds();
		if (ss < 10) {
			ss = "0" + ss;
		}
		ss = ss.toString();
		var date1 = hh + ":" + mi + ":" + ss;
		return date1;
	},

	styleFC: function (oprnstatus) {

		if (oprnstatus) {

			if (oprnstatus.indexOf("CNF") !== -1 && oprnstatus.indexOf("PCNF") === -1) {
				$("#" + this.getParent().getId() + "-col12").removeClass("cellStyleRed");
				$("#" + this.getParent().getId() + "-col12").addClass("cellStyleGreen");

			} else {
				$("#" + this.getParent().getId() + "-col12").removeClass("cellStyleGreen");
				$("#" + this.getParent().getId() + "-col12").addClass("cellStyleRed");

			}

		} else {
			$("#" + this.getParent().getId() + "-col12").removeClass("cellStyleRed");
			$("#" + this.getParent().getId() + "-col12").removeClass("cellStyleGreen");
		}

		return "";
	},

	//Function to format and get the First letter of the user name [View: WorkOrder Detail]
	formatTwoLetterUserName: function (userName) {
		if (userName) {
			var name = "";
			var splitName = userName.split(" ");
			var length = 0;
			if (splitName.length >= 2) {
				length = 2;
			} else {
				length = 1;
			}
			for (var i = 0; i < length; i++) {
				name = name + splitName[i].substring(0, 1);
			}
			return name;
		} else {
			return "";
		}
	},
	styleComonTime: function (oprnenddateActual) {

		if (oprnenddateActual) {

			var sPath = "/" + this.getBindingInfo("text").binding.getContext().getPath().split("/")[1];
			var OrderEndDate = this.getBindingInfo("text").binding.getContext().getModel().getProperty(sPath).FinishDate; // work order end date
			if (oprnenddateActual <= OrderEndDate) {
				$("#" + this.getParent().getId() + "-col13").removeClass("cellStyleRed");
				$("#" + this.getParent().getId() + "-col13").addClass("cellStyleGreen");
			} else {
				$("#" + this.getParent().getId() + "-col13").addClass("cellStyleRed");
				$("#" + this.getParent().getId() + "-col13").removeClass("cellStyleGreen");

			}
		} else {

			$("#" + this.getParent().getId() + "-col13").removeClass("cellStyleRed");
			$("#" + this.getParent().getId() + "-col13").removeClass("cellStyleGreen");
		}

		return "";
	},
	styleBDownHours: function (oprn, sIsBreakDown, iBDownHours) {

		if (sIsBreakDown === "YES" && !iBDownHours && !oprn) {
			$("#" + this.getParent().getId() + "-col18").removeClass("cellStyleGreen");
			$("#" + this.getParent().getId() + "-col18").addClass("cellStyleRed");
			//	this.removeStyleClass("cellStyleGreen");
			//	this.addStyleClass("cellStyleRed");
		} else {
			$("#" + this.getParent().getId() + "-col18").removeClass("cellStyleRed");
			$("#" + this.getParent().getId() + "-col18").removeClass("cellStyleGreen");

			//this.removeStyleClass("cellStyleRed");
			//	this.removeStyleClass("cellStyleGreen");
		}

		return iBDownHours;

	},
	styleLabHours: function (iLabHours, sOprn) {
		if (sOprn && !iLabHours) {
			$("#" + this.getParent().getId() + "-col19").removeClass("cellStyleGreen");
			$("#" + this.getParent().getId() + "-col19").addClass("cellStyleRed");
			//	this.removeStyleClass("cellStyleGreen");
			//	this.addStyleClass("cellStyleRed");
		} else {
			$("#" + this.getParent().getId() + "-col19").removeClass("cellStyleRed");
			$("#" + this.getParent().getId() + "-col19").removeClass("cellStyleGreen");
			//	this.removeStyleClass("cellStyleRed");
			//this.removeStyleClass("cellStyleGreen");
		}
		return iLabHours;
	},
	styleSPartsIss: function (iSPartsReq, iSPartsIss) {

		if (iSPartsReq > iSPartsIss) {
			$("#" + this.getParent().getId() + "-col21").removeClass("cellStyleGreen");
			$("#" + this.getParent().getId() + "-col21").addClass("cellStyleRed");
			//this.removeStyleClass("cellStyleGreen");
			//this.addStyleClass("cellStyleRed");
		} else {
			$("#" + this.getParent().getId() + "-col21").removeClass("cellStyleGreen");
			$("#" + this.getParent().getId() + "-col21").removeClass("cellStyleRed");
			//	this.removeStyleClass("cellStyleRed");
			//this.removeStyleClass("cellStyleGreen");
		}
		return iSPartsIss;
	},
	styleAttach: function (sIsAttach, oprn) {
		if (sIsAttach === "X") {
			$("#" + this.getParent().getId() + "-col23").removeClass("cellStyleRed");
			$("#" + this.getParent().getId() + "-col23").addClass("cellStyleGreen");
			sIsAttach = "Y";
			//	this.removeStyleClass("cellStyleRed");
			//this.addStyleClass("cellStyleGreen");
		} else if (sIsAttach !== null && !oprn) {
			$("#" + this.getParent().getId() + "-col23").removeClass("cellStyleRed");
			$("#" + this.getParent().getId() + "-col23").removeClass("cellStyleGreen");
			sIsAttach = "N";
			//	this.removeStyleClass("cellStyleRed");
			//	this.removeStyleClass("cellStyleGreen");
		}

		return sIsAttach;
	},
	formatDate: function (date) {
		if (!date) {
			return;
		}
		date = new Date(date);
		var dd = date.getDate();
		if (dd < 10) {
			dd = dd.toString();
			dd = "0" + dd;
		} else {
			dd = dd.toString();
		}
		var mm = date.getMonth() + 1;
		if (mm < 10) {
			mm = mm.toString();
			mm = "0" + mm;
		} else {
			mm = mm.toString();
		}
		var yyyy = date.getFullYear();
		yyyy = yyyy.toString();

		var date1 = mm + "-" + dd + "-" + yyyy;
		return date1;
	},

	formatTime: function (date) {
		if (!date) {
			return;
		}
		var daym;
		date = new Date(date);
		var hh = date.getHours();
		if (hh > 12) {
			daym = "PM";
			hh = hh % 12;
		} else {
			daym = "AM";
		}
		if (hh < 10) {
			hh = "0" + hh;
		}
		hh = hh.toString();
		var mi = date.getMinutes();
		if (mi < 10) {
			mi = "0" + mi;
		}
		mi = mi.toString();
		var ss = date.getSeconds();
		ss = ss.toString();
		var date1 = hh + ":" + mi + " " + daym;
		return date1;
	},

	formatCreatedBy: function (created) {
		if (!created) {
			return;
		}
		var a = "";
		var createdArr = created.split(" ");
		for (var i = 0; i < createdArr.length; i++) {
			a += createdArr[i].slice(0, 1);
		}
		a = a.toUpperCase();
		return a;
	},
	/*	setIconForFile: function (file) {
			if (!file) {
				return "";
			}
			var fileType = file.split(".");
			var ext = fileType[fileType.length - 1];
			var extension = ext.toLowerCase();
			if (extension === "txt") {
				return "sap-icon://attachment-text-file";
			} else if (extension === "doc" || extension === "docx") {
				return "sap-icon://doc-attachment";
			} else if (extension === "pptx" || extension === "ppt") {
				return "sap-icon://ppt-attachment";
			} else if (extension === "pdf") {
				return "sap-icon://pdf-attachment";
			} else if (extension === "xlsx" || extension === "xls" || extension === "xlsm" || extension === "xlsb" || extension === "csv" ||
				extension === "ods") {
				return "sap-icon://excel-attachment";
			} else if (extension === "gif" || extension === "jpg" || extension === "jpeg" || extension === "png") {
				return "sap-icon://attachment-photo";
			} else {
				return "sap-icon://document";
			}
		},*/

	//Function to get and display uploaded documents icon [View: WorkOrder Detail Part 1]
	setIconForFile: function (fileType) {
		var oType = "";
		if (!fileType) {
			return "";
		}
		var extension = fileType.toLowerCase();
		if (extension === "txt") {
			oType = "sap-icon://attachment-text-file";
		} else if (extension === "doc" || extension === "docx") {
			oType = "sap-icon://doc-attachment";
		} else if (extension === "pptx" || extension === "ppt") {
			oType = "sap-icon://ppt-attachment";
		} else if (extension === "pdf") {
			oType = "sap-icon://pdf-attachment";
		} else {
			oType = com.sap.incture.IMO_PM.formatter.formatter.setViewIconForFile(fileType);
		}
		return oType;
	},

	//Function set delete icon visible/invisible for upload section
	setDeleteVisible: function (bVal) {
		if (bVal) {
			return true;
		}
		return false;
	},
	//Function to get uploaded file sizes
	formatBytes: function (bytes, decimals) {
		if (bytes === 0) {
			return "0 Bytes";
		}
		var k = 1024,
			dm = decimals <= 0 ? 0 : decimals || 2,
			sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
			i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
	},
	//Function to show Notification count in Notification details panel
	formatNotificationCount: function (notifArray) {
		var notificationCount = 0;
		var oResourceModel = this.oResourceModel;
		if (notifArray) {
			notificationCount = notifArray.length;
		}
		var notifHeaderTxt = oResourceModel.getText("NOTIFICATIONS");
		notificationCount = notifHeaderTxt + " (" + notificationCount + ")";
		return notificationCount;
	},
	//Function to show Yes/No if an operation has long text entered
	isOperationLongTxtAvailable: function (longText) {
		if (longText) {
			return "Yes";
		} else {
			return "No";
		}
	},
	//Function to get total number of Spare parts to show in Operations table
	/*	getSparePartsCount: function (spareParts) {
			if (!spareParts) {
				return 0;
			} else {
				return spareParts.length;
			}
		},*/
	//Function to enable/disable Remove operations button in WO detail screen
	enableDisableRemoveBtn: function (sPaths) {
		if (sPaths) {
			if (sPaths.length !== 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	//Function to add logged in user name in Report by field
	setReportByUser: function (userName, woData) {
		if (woData) {
			woData.ReportedBy = userName;
		}
		return userName;
	},
	/*		//Function to add logged in user name in Report by field [View: WorkOrder Detail]
		setReportByUser: function (userName) {
			var oWorkOrderDetailModel = this.getModel("oWorkOrderDetailModel");
			oWorkOrderDetailModel.setProperty("/ReportedBy", userName);
			return userName;
		},*/

	formatName: function (sName) {

		if (sName) {

			sName = sName + " - ";
		}

		this.addStyleClass("styleName");
		return sName;
	},
	//Function to split Java date and return time [View: WorkOrder Detail]
	formatJavaDateTime: function (sDate, operationId) {
		if (operationId || sDate) {
			var newDateTime = new Date(sDate);
			if (operationId) {
				var hh = newDateTime.getHours();
				if (hh < 10) {
					hh = "0" + hh;
				}
				var mm = newDateTime.getMinutes();
				if (mm < 10) {
					mm = "0" + mm;
				}
				newDateTime = (parseInt(hh, 10) > 12) ? (parseInt(hh, 10) - 12 + ":" + mm + " PM") : (parseInt(hh, 10) + ":" + mm + " AM");
			} else {
				var dd = newDateTime.getDate();
				var MM = newDateTime.getMonth() + 1;
				var yy = newDateTime.getFullYear();
				if (dd < 10) {
					dd = "0" + dd;
				}
				if (MM < 10) {
					MM = "0" + MM;
				}
				newDateTime = dd + "-" + MM + "-" + yy;
			}
			return newDateTime;
		}
		return "";
	},
	//  Function to Generate months back Date
	GetMonthsBackDate: function (nMonths) {
		var d = new Date();
		d.setMonth(d.getMonth() - nMonths+1);
		return d.toLocaleDateString();
	},

	//Function to disable Review role field
	disableReviewField: function (userRole) {
		if (userRole) {
			if (userRole === "LEAD_TECH") {
				return true;
			} else {
				return false;
			}
		}
		return false;
	},

	// Function to disable Release Btn in notifList
	disableReleaseField: function (selectedIndices, selectedPaths, NotifList) {
		var bStatus = true;
		if (!selectedIndices || selectedIndices < 1) {
			return false;
		}
		for (var i = 0; i < selectedPaths.length; i++) {
			var SelectedIndex = selectedPaths[i].sPath.split("/")[2];
			var SysStatus = NotifList[SelectedIndex].SysStatus;
			if (SysStatus !== "OSNO") {
				bStatus = false;
			}
		}
		return bStatus;
	},
	//function to disable Create Btn in notifList
	disableMassCreateField: function (selectedIndices, selectedPaths, NotifList) {
		var bStatus = true;
		if (!selectedIndices || selectedIndices < 2) {
			return false;
		}
		for (var i = 0; i < selectedPaths.length; i++) {
			var SelectedIndex = selectedPaths[i].sPath.split("/")[2];
			var SysStatus = NotifList[SelectedIndex].SysStatus;
			if (SysStatus !== "NOPR") {
				bStatus = false;
			}
		}
		return bStatus;
	},

	fnWOStatusConversion: function (status) {

		if (status) {
			if (status.indexOf("TECO") !== -1) {
				return "TECO";
			} else if ((status.indexOf("CNF") !== -1) && (status.indexOf("PCNF") === -1)) {
				return "CNF";
			} else if (status.indexOf("PCNF") !== -1) {
				return "PCNF";
			} else if (status.indexOf("REL") !== -1) {
				return "REL";
			} else if (status.indexOf("CRTD") !== -1) {
				return "CRTD";
			}
		}
		return "";

	},
	//Function to set visible of fields on WO Release [View: WorkOrder Detail]
	setWOReleaseFieldsVisible: function (systemStatus, operationCommentVisible) {
		var bVal = false;
		if (systemStatus === "") {
			bVal = false;
		} else if (systemStatus === "CRTD") {
			bVal = false;
		} else if (systemStatus === "PCNF") {
			bVal = true;
		} else if (systemStatus === "CNF") {
			bVal = false;
		} else if (systemStatus === "REL") {
			if (operationCommentVisible === true) {
				bVal = true;
			} else if (operationCommentVisible === false) {
				bVal = false;
			} else {
				bVal = true;
			}
		} else if (systemStatus === "TECO") {
			bVal = true;
		}
		return bVal;
	},
	//Function to enable/disable Operation comment save button
	setOperationCmtSaveBtnVisible: function (operationLngTxt) {
		if (operationLngTxt) {
			return true;
		} else {
			return false;
		}
	},
	//Function to enable/disable fields before WO Relase status
	/*	fnSetWOUpdateStatusFields: function (operationStatus, systemStatus) {
			var bVal = false;
			if (systemStatus === "CRTD" || systemStatus === "") {
				bVal = true;
			} else if (systemStatus === "REL") {
				if (operationStatus === "C") {
					bVal = true;
				} else if (operationStatus === "N") {
					bVal = false;
				}
			}
			return bVal;
		},*/
	fnSetWOUpdateStatusFields: function (operationStatus, systemStatus, operSysStatus, systemCondition) {
		var bVal = false;
		if (operSysStatus === "CRTD" && systemCondition !== "") {
			bVal = false;
		} else if (systemStatus === "CRTD" || systemStatus === "") {
			bVal = true;
		} else if (systemStatus === "REL" || systemStatus === "PCNF" || systemStatus === "CNF") {
			if (operationStatus === "C") {
				bVal = true;
			} else if (operationStatus === "N") {
				bVal = false;
			}
		} else if (systemStatus === "TECO") {
			bVal = false;
		}
		return bVal;
	},

	//Function to enable/disable fields after WO Release status
	fnSetWOReleaseStatusFields: function (operationStatus, systemStatus, operCode) {
		var bVal = false;
		if (systemStatus === "CRTD" || systemStatus === "") {
			bVal = false;
		} else if (systemStatus === "REL" || systemStatus === "PCNF" || systemStatus === "CNF") {
			if (operationStatus === "" && operCode === "C") {
				bVal = true;
			} else if (operationStatus === "REL" || operationStatus === "PCNF") {
				bVal = true;
			} else if (operationStatus === "CNF") {
				bVal = false;
			}
		} else if (systemStatus === "TECO") {
			bVal = false;
		}
		return bVal;
	},

	//Function to format WO status 
	formatWOStatusTxt: function (status) {
		/*	var mLookupModel = this.getModel("mLookupModel");//new
			var oSelectedWODetails = mLookupModel.getProperty("/oSelectedWODetails");//new
			
			if(oSelectedWODetails) {
				var status = oSelectedWODetails.SysStatusDes;//new		
			}*/

		var woStatus;
		if (status === "CRTD") {
			woStatus = "Created";
		} else if (status === "REL") {
			woStatus = "Released";
		} else if (status === "TECO") {
			woStatus = "TECO Completed";
		} else if (status === "PCNF") {
			woStatus = "Partially Confirmed";
		} else if (status === "CNF") {
			woStatus = "Confirmed";
		} else {
			woStatus = "";
		}
		return woStatus;
	},

	//Function to red color is breakdown id true
	fnCheckIsBreakdown: function (equipment, status) {
		$("#" + this.getParent().getId() + "-col0").removeClass("cellStyleRed");
		if (status === "Break Down") {
			$("#" + this.getParent().getId() + "-col0").removeClass("cellStyleWhite");
			$("#" + this.getParent().getId() + "-col0").addClass("cellStyleRed");
		} else {
			$("#" + this.getParent().getId() + "-col0").removeClass("cellStyleRed");
			$("#" + this.getParent().getId() + "-col0").addClass("cellStyleWhite");
		}
		return equipment;
	},

	//Function to set Spare part count in Operation's table [View: WorkOrder Detail]
	getSparePartsCount: function (operationId) {
		var count = 0;
		if (!operationId) {
			count = 0;
		} else {
			var oWorkOrderDetailModel = this.getModel("oWorkOrderDetailModel");
			var aSpareParts = oWorkOrderDetailModel.getProperty("/HEADERTOCOMPONENTNAV");
			if (aSpareParts) {
				if (aSpareParts.length === 0) {
					count = 0;
				} else if (aSpareParts.length > 0) {
					for (var i = 0; i < aSpareParts.length; i++) {
						var iOperationId = aSpareParts[i].ActivityOperation;
						if (operationId === iOperationId) {
							count = count + 1;
						}
					}
				}
			} else {
				count = 0;
			}
		}
		return count;
	},
	//Function to get and display uploaded documents icon [View: WorkOrder Detail Part 2]
	setViewIconForFile: function (fileType) {
		var oType = "";
		if (!fileType) {
			return "";
		}
		var extension = fileType.toLowerCase();
		if (extension === "xlsx" || extension === "xls" || extension === "xlsm" || extension === "xlsb" || extension === "csv" ||
			extension === "ods") {
			oType = "sap-icon://excel-attachment";
		} else if (extension === "gif" || extension === "jpg" || extension === "jpeg" || extension === "png") {
			oType = "sap-icon://attachment-photo";
		} else if (extension === "url") {
			oType = "sap-icon://internet-browser";
		} else {
			oType = "sap-icon://document";
		}
		return oType;
	},
	//Function set delete icon visible/invisible for upload section [View: WorkOrder Detail]
	setAttachmentDeleteVisible: function (attachmentType, orderStatus) {
		var bVal = false;
		if (orderStatus === "TECO" || orderStatus === "CLSD" || orderStatus === "") {
			bVal = false;
		} else if (orderStatus === "CRTD" || orderStatus === "REL" || orderStatus === "PCNF" || orderStatus === "CNF") {
			bVal = true;
		}
		return bVal;
	},
	//Function to format Completed on Date in String from Date object [View: WorkOrder Detail]
	formatCompOnDateobjToString: function (oDate) {

		if (oDate === null || oDate === "") {
			return "";
		}
		var dd = oDate.getUTCDate();
		var MM = oDate.getUTCMonth() + 1;
		var yy = oDate.getUTCFullYear();

		if (dd < 10) {
			dd = "0" + dd;
		}
		if (MM < 10) {
			MM = "0" + MM;
		}
		var newDate = yy + "-" + MM + "-" + dd;
		// var time = this.formatTime(oDate);
		// if (time) {
		// 	newDate = newDate + "T" + time;
		// } else {
		// 	newDate = newDate + "T00:00:00";
		// }
		newDate = newDate + "T00:00:00";
		return newDate;
	},
	//Function to enable TECO fields
	enableTECOFields: function (status) {
		var bVal = false;
		if (status === "CNF") {
			bVal = true;
		}
		return bVal;
	},
	//Function to set visible of Comments view
	setVisibleCommentsView: function (systemStatus) {
		var bVal = false;
		if (systemStatus === "" || systemStatus === "CRTD") {
			bVal = false;
		} else {
			bVal = true;
		}
		return bVal;
	},
	setEnableWOStext: function (systemStatus) {
		var bVal = false;
		if (systemStatus === "" || systemStatus === "CRTD") {
			bVal = true;
		} else {
			bVal = false;
		}
		return bVal;
	},
	//Function to set Visible of Add/Remove buttons for Operations/Spares
	setAddRemoveVisible: function (status) {
		var bVal = true;
		if (status === "TECO") {
			bVal = false;
		}
		return bVal;
	},
	//Function to enable Complete TECO button
	enableTECOButton: function (operations, userRole) {
		var bVal = false;
		if (userRole === "LEAD_TECH") {
			if (operations) {
				var count = 0;
				for (var i = 0; i < operations.length; i++) {
					if (operations[i].systemstatustext === "CNF") {
						count = count + 1;
					}
				}
				if (count === 0) {
					bVal = false;
				} else if (operations.length === count) {
					bVal = true;
				}
			}
		}
		return bVal;
	},
	//Function to format String value to Boolean value for BreakDown
	formatBooleanBreakDown: function (stringVal) {
		if (typeof (stringVal) === "boolean") {
			return stringVal;
		}
		var bVal = false;
		if (stringVal === "X") {
			bVal = true;
		} else if (stringVal === " " || stringVal === "") {
			bVal = false;
		}
		return bVal;
	},
	//Function to get number of selected operations for mass update dialog header text
	formatMassUpdateHeader: function (selectedOperations) {
		var length = selectedOperations.length;
		var headerTxt = "Mass Update (" + length + " Operations)";
		return headerTxt;
	},
	//Functiont to set visible Add task and Add notification button
	fnSetTaskNotifBtnVisible: function (orderStatus) {
		var bVal = false;
		if (orderStatus === "TECO") {
			bVal = false;
		} else {
			bVal = true;
		}
		return bVal;
	},
	//Function to enable Spare part table fields
	setSpareFieldsEnabled: function (isMovement, userRole) {
		var bVal = false;
		if (isMovement || userRole === "REVIEWER") {
			bVal = false;
		} else {
			bVal = true;
		}
		return bVal;
	},
	//Function to set Attachment Tab visible if Work Order Id is generated
	setAttachmentsTabVisible: function (orderStatus, orderId) {
		var bVal = false;
		if (orderStatus === "CRTD" || orderStatus === "REL" || orderStatus === "PCNF" || orderStatus === "CNF" || orderStatus === "TECO") {
			if (orderId) {
				bVal = true;
			}
		}
		return bVal;
	},
	//Function to disable attaching documents after Work Order is TECOed
	disableUploadAttachment: function (orderStatus) {
		var bVal = false;
		if (orderStatus === "" || orderStatus === undefined || orderStatus === "TECO") {
			bVal = false;
		} else {
			bVal = true;
		}
		return bVal;
	},
	///Function to enable notification in Notification notifDetail view
	disableUploadNotifAttachment: function (notifStatus) {

		var bVal = false;
		if (notifStatus === "" || notifStatus === undefined) {
			bVal = false;
		} else {
			bVal = true;
		}
		return bVal;
	},
	// Function to Set min End Date greater than Start Date
	EndDateValidation: function (notifCreateStartDate) {
		debugger;
		if (notifCreateStartDate) {
			return new Date(notifCreateStartDate);
		}
		return null;
	},
	//Function to format Notifcation's Required Start and End date
	formatReqStartEndDate: function (date) {
		var formattedDate = "";
		if (date !== "00000000") {
			var dd = date.substring(0, 4);
			var mm = date.substring(4, 6);
			var yy = date.substring(6, 8);
			formattedDate = new Date(dd + "-" + mm + "-" + yy);
		}
		return formattedDate;
	},
	//Function to get current time
	formatCurrentTime: function (date) {
		var hh = date.getHours();
		var mm = date.getMinutes();
		if (hh < 10) {
			hh = "0" + hh;
		}
		if (mm < 10) {
			hh = "0" + mm;
		}
		var oTime = hh + ":" + mm;
		return oTime;
	},
	//Function to remove unwanted characters in hyperlink in attachment section
	formatHyperLink: function (hyperlink) {
		hyperlink = hyperlink.split("&KEY&")[1];
		return hyperlink;
	},
	//Function to enable Damahge & Cause code based on WO status and Breakdown
	enableBreakDownFields: function (breakDown, orderStatus) {
		var bVal = false;
		if (orderStatus !== "TECO") {
			if (breakDown === "X" || breakDown === true) {
				bVal = true;
			} else if (breakDown === " " || breakDown === false) {
				bVal = false;
			}
		}
		return bVal;
	},
	//Function to format Date in String to Date object [View: WorkOrder Detail]
	formatDateTimeobjToString: function (oDate, time) {

		var dd = oDate.getDate();
		var MM = oDate.getMonth() + 1;
		var yy = oDate.getFullYear();
		if (dd < 10) {
			dd = "0" + dd;
		}
		if (MM < 10) {
			MM = "0" + MM;
		}
		var newDate = yy + "-" + MM + "-" + dd;
		newDate = newDate + "T" + time + ":00";
		return newDate;
	},
	//Function to get Hours and Minutes from SAP EDM time
	getUTSHrsMins: function (time) {
		var hh = new Date(time).getUTCHours();
		if (hh < 10) {
			hh = "0" + hh;
		} else {
			hh = hh.toString();
		}
		var mm = new Date(time).getUTCMinutes();
		if (mm < 10) {
			mm = "0" + mm;
		} else {
			mm = mm.toString();
		}
		return [hh, mm];
	},
	//Function to format SAP edm time format
	getMalfunctionStTime: function (time) {
		var oTime = this.getUTSHrsMins(time);
		var newTime = oTime[0] + ":" + oTime[1];
		return newTime;
	},
	//Function to format Date in String to Date object [View: WorkOrder Detail]
	formatDtTimeObjToTString: function (oDate) {
		var dd = oDate.getDate();
		var MM = oDate.getMonth() + 1;
		var yy = oDate.getFullYear();
		var hh = oDate.getHours();
		var mm = oDate.getMinutes();
		if (dd < 10) {
			dd = "0" + dd;
		}
		if (MM < 10) {
			MM = "0" + MM;
		}
		if (hh < 10) {
			hh = "0" + hh;
		}
		if (mm < 10) {
			mm = "0" + mm;
		}

		var newDate = yy + "-" + MM + "-" + dd;
		var newTime = hh + ":" + mm + ":00";
		newDate = newDate + "T" + newTime;
		return newDate;
	},
	//Function to check for Safety stock
	fnCheckSafetyStock: function (materialId) {
		$("#" + this.getParent().getId() + "-col0").removeClass("cellStyleRed");
		if (materialId) {
			var oWorkOrderDetailModel = this.getModel("oWorkOrderDetailModel");
			var sPath = this.getBindingContext("oWorkOrderDetailModel").getPath();
			var oMaterial = oWorkOrderDetailModel.getProperty(sPath);
			var qtyIssued = oMaterial.IssueQty;
			if (qtyIssued === "") {
				qtyIssued = 0;
			} else {
				qtyIssued = parseFloat(qtyIssued);
			}

			var qtyOnOrder = oMaterial.OutQtyOrd;
			if (qtyOnOrder === "") {
				qtyOnOrder = 0;
			} else {
				qtyOnOrder = parseFloat(qtyOnOrder);
			}

			var qtyReturned = oMaterial.returnQty;
			if (qtyReturned === "") {
				qtyReturned = 0;
			} else {
				qtyReturned = parseFloat(qtyReturned);
			}

			var stockAvailable = oMaterial.StockAvail;
			if (stockAvailable === "") {
				stockAvailable = 0;
			} else {
				stockAvailable = parseFloat(stockAvailable);
			}

			var safetyStock = oMaterial.MinStockReq;
			if (safetyStock === "") {
				safetyStock = 0;
			} else {
				safetyStock = parseFloat(safetyStock);
			}

			var qtyReserved = oMaterial.RequirementQuantity;
			if (qtyReserved === "") {
				qtyReserved = 0;
			} else {
				qtyReserved = parseFloat(qtyReserved);
			}

			var sparesStockVal = stockAvailable + qtyOnOrder + qtyIssued - qtyReturned - qtyReserved;
			var isStockAvailable = sparesStockVal <= safetyStock;
			if (isStockAvailable) {
				$("#" + this.getParent().getId() + "-col0").removeClass("cellStyleWhite");
				$("#" + this.getParent().getId() + "-col0").addClass("cellStyleRed");
			} else {
				$("#" + this.getParent().getId() + "-col0").removeClass("cellStyleRed");
				$("#" + this.getParent().getId() + "-col0").addClass("cellStyleWhite");
			}
		}
		return materialId;
	},
	//Function to enable superior WO Button enabled
	setSuperiorWOEnabled: function (orderId) {
		if (orderId) {
			if (orderId.length > 7) {
				return true;
			}
		}
		return false;
	},
	//Function to set visible of Unconfirmed Checkbox in Operations table
	fnSetFilterOpsCBVisible: function (orderStatus, orderId) {
		var bVal = false;
		if (orderStatus === "REL" || orderStatus === "PCNF" || orderStatus === "CNF" || orderStatus === "TECO" || orderStatus === "CLSD") {
			if (orderId) {
				bVal = true;
			}
		}
		return bVal;
	},
	fnGetNamefromUserid: function (userid) {

		var oModel = this.getModel("oPortalDataModel");
		var mLookupModel = this.getModel("mLookupModel");
		if (userid && oModel && mLookupModel) {
			var oFilter = [];
			oFilter.push(new sap.ui.model.Filter("Bname", "EQ", userid));
			oModel.read("/UsersListSet", {
				filters: oFilter,
				async: false,
				success: function (oData, oResponse) {
					mLookupModel.setProperty("/AssigedTechName", oData.results[0].NameTextc);
					mLookupModel.refresh();
				},
				error: function (oResponse) {
					mLookupModel.setProperty("/AssigedTechName", "");
					mLookupModel.refresh();
				}
			});
		}
		return userid;

	},
	fnGetReportedByName: function (userid) {

		var oModel = this.getModel("oPortalDataModel");
		var mLookupModel = this.getModel("mLookupModel");
		if (userid && oModel && mLookupModel) {
			var oFilter = [];
			oFilter.push(new sap.ui.model.Filter("Bname", "EQ", userid));
			oModel.read("/UsersListSet", {
				filters: oFilter,
				async: false,
				success: function (oData, oResponse) {
					mLookupModel.setProperty("/ReportedByName", oData.results[0].NameTextc);
					mLookupModel.refresh();
				},
				error: function (oResponse) {
					mLookupModel.setProperty("/ReportedByName", "");
					mLookupModel.refresh();
				}
			});
		}
		return userid;

	},
	//Function to set Confirmation long text visible [View: WorkOrder Detail]
	setConfirmationLngTxtVisible: function (systemStatus) {
		var bVal = false;
		if (systemStatus === "STARTED") {
			bVal = false;
		} else if (systemStatus === "CREATED") {
			bVal = false;
		} else if (systemStatus === "RELEASED") {
			bVal = true;
		} else if (systemStatus === "TECHO_COMPLETE") {
			bVal = true;
		}
		return bVal;
	},
	//Function to set visible/invisible of Long text hbox if value is present
	setLongTextHboxVisible: function (longText) {
		var bVal = false;
		if (longText === undefined || longText.length === 0) {
			bVal = false;
		} else if (longText.length >= 1) {
			bVal = true;
		}
		return bVal;
	},
	//Function to format Planned Reactive X-axis date format
	formatUIDate: function (sDate) {
		if (sDate) {
			var mm = sDate.substring(4, 6);
			var yy = sDate.substring(0, 4);
			var formattedDate = mm + "/" + yy;
			return formattedDate;
		} else {
			return "";
		}
	},
	fnStyleDueDate: function (planneddate, comppercntg) {
		if (!planneddate) {
			return "";
		}
		var sToday = new Date();
		if (comppercntg === "100.00" || comppercntg === "100") {
			this.removeStyleClass("cellStyleRed");
			this.removeStyleClass("cellStyleAmber");
			this.addStyleClass("cellStyleGreen");
		} else {
			if (planneddate < sToday) {
				this.addStyleClass("cellStyleRed");
				this.removeStyleClass("cellStyleAmber");
				this.removeStyleClass("cellStyleGreen");
			} else {
				var iTimeDifference = planneddate.getTime() - sToday.getTime();
				var iDaysDifference = Math.ceil(iTimeDifference / (1000 * 3600 * 24));
				if (iDaysDifference <= 3) {
					this.addStyleClass("cellStyleAmber");
					this.removeStyleClass("cellStyleRed");
					this.removeStyleClass("cellStyleGreen");
				} else {
					this.removeStyleClass("cellStyleRed");
					this.removeStyleClass("cellStyleAmber");
					this.removeStyleClass("cellStyleGreen");
				}
			}
		}
		if (planneddate) {
			var iDate = planneddate.getDate();
			var iMon = planneddate.getMonth() + 1;
			var iYear = planneddate.getFullYear();
			if (iMon < 10) {
				iMon = "0" + iMon;
			}
			if (iDate < 10) {
				iDate = "0" + iDate;
			}
			return iDate + "-" + iMon + "-" + iYear;
		} else {
			this.removeStyleClass("cellStyleRed");
			this.removeStyleClass("cellStyleAmber");
			this.removeStyleClass("cellStyleGreen");
		}
		return "";
	},
	fnStyleReOrder: function (materialNo, isReorder) {
		this.removeStyleClass("cellStyleRed");
		if (isReorder === "Yes") {
			this.addStyleClass("cellStyleRed");
		}
		return materialNo;
	},
	fnFomatInteger: function (count) {
		if (count) {
			count = parseInt(count, 10);
		} else {
			count = "";
		}
		return count;
	},
	// formatter to disable/enable switch in notifDetail view
	setSwitchValue: function (sVal) {
		if (sVal === "M2") {
			return true;
		} else {
			return false;
		}
	}

};