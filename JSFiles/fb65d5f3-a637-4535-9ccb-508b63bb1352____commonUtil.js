/**********************************************************************************************************
 *** Function Declarations 
 **********************************************************************************************************/
function fnGoToPage(pageNum) {
	//console.log("common function!! goTo::"+pageNum);
	$("#pageIndex").val(pageNum);
	var url = GLO_PAGE_URL;
	$("#SRCH_FORM").attr("method", "post");
	$("#SRCH_FORM").attr("action", url);
	$("#SRCH_FORM").submit();
	$(".loadingWrap").show(); 
};

/**********************************************************************************************************
 *** Common 
 **********************************************************************************************************/
var Common = {};
 
Common.serialize = function(form) {
    var obj = null;
    try {
        var arr = form.serializeArray();
        if (arr) {
            obj = {};
            jQuery.each(arr, function () {
                obj[this.name] = this.value;
            });
            $(':disabled[name]', form).each(function () {
                obj[this.name] = $(this).val();
            });
        }
    } catch (e) {
        alert(e.message);
    } finally {
    }
    return obj;
};

/**
 * Common.isNull
 * param : String
 */ 
Common.isNull = function(str){
	var rtn = false;
	if(typeof str == null || str == undefined || String(str).trim() == "") {
		rtn = true;
	}
	return rtn;
};

/**
 * Common.isNotNull
 * param : String
 */ 
Common.isNotNull = function(str){
	var rtn = true;
	if(typeof str == null || str == undefined || str.trim() == "") {
		rtn = false;
	}
	return rtn;
};

/**
 * Common.isEmpty
 * param : Object
 */ 
Common.isEmpty = function(value){
	var rtn = false;

	if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ) { 
		rtn = true;
	} 
	return rtn;
};

/**
 * Common.isNotEmpty
 * param : Object
 */ 
Common.isNotEmpty = function(value){
	var rtn = true;

	if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ) { 
		rtn = false;
	}
	return rtn;
};

/**
 * Common.alert
 * 3 seconds
 */ 
Common.alert = function(msgDiv, msgStr, callback) {
	//clearTimeout(Common.alert);
	if(msgDiv == "warning") {
		$("#warningMsg").text(msgStr);
		$("#warningDiv").show();
		setTimeout(function() {
			$("#warningDiv").hide();
			if(Common.isNotEmpty(callback)) callback();
		}, 5000);
	} else if(msgDiv == "success") {
		$("#successMsg").text(msgStr);
		$("#successDiv").show();
		setTimeout(function() {
			$("#successDiv").hide();
			if(Common.isNotEmpty(callback)) callback();
		}, 5000);
	}
};

/**
 * Common.pageMaker
 */
Common.pageMaker = function(pageTargetId, totalCnt) {
	
	var perPage = $("#pageListSize").val();
    var curPage = $("#pageIndex").val();
	var pageBlock = 5;
    var prePage = parseInt(curPage)-1;	
    var nextPage = parseInt(curPage)+1;	
    var totalPage = totalCnt / perPage;			
    var lastPage = Math.ceil(totalPage);

    if(prePage <= 1) prePage = 1;
    if(nextPage >= lastPage) nextPage = lastPage;

    var curBlock = Math.ceil(curPage/pageBlock);
    //var lastBlock = totalPage/pageBlock;
    var sNum = (curBlock-1)*pageBlock+1;
    var eNum = sNum+pageBlock-1;
    
    var html = "";	
    html += "<a class=\"direction l2\" href=\"javascript:fnGoToPage(1);\"></a>";
    html += "<a class=\"direction l1\" href=\"javascript:fnGoToPage("+prePage+");\"></a>";
    
    if(totalCnt == 0) {
    	html += "<a class=\"active\" href=\"javascript:void(0);\">1</a>";
    } else {
    	for(var i = sNum; i <= eNum; i++) {
        	if(i > lastPage) break;

        	if(i == curPage) {
        		html += "<a class=\"active\" href=\"javascript:void(0);\">"+i+"</a>";
        	} else {
        		html += "<a href=\"javascript:fnGoToPage("+i+");\">"+i+"</a>";
        	}
        }	
    }
    
    html += "<a class=\"direction r1\" href=\"javascript:fnGoToPage("+nextPage+");\"></a>";
    html += "<a class=\"direction r2\" href=\"javascript:fnGoToPage("+lastPage+");\"></a>";
    
    $("#"+pageTargetId).html(html);
    
    if($("#TOTAL_PAGE_INFO").find()) {
    	var totalInfo = "Total "+totalCnt+" ("+curPage+" / "+lastPage+" Page)";
        $("#TOTAL_PAGE_INFO").html(totalInfo);	
    }
    
};

/**
 * Common.pageMaker4Popup
 */
Common.pageMaker4Popup = function(popupId, totalCnt, perPageCnt) {
	
	var perPage = 10;	
	if(Common.isNotEmpty(perPageCnt)) {
		perPage = perPageCnt
	}
    var curPage = $("#pageIndex_"+popupId).val();	
	var pageBlock = 5;	
    var prePage = parseInt(curPage)-1;			
    var nextPage = parseInt(curPage)+1;			
    var totalPage = totalCnt / perPage;			
    var lastPage = Math.ceil(totalPage);		

    if(prePage <= 1) prePage = 1;
    if(nextPage >= lastPage) nextPage = lastPage;

    var curBlock = Math.ceil(curPage/pageBlock);
    //var lastBlock = totalPage/pageBlock;
    var sNum = (curBlock-1)*pageBlock+1;
    var eNum = sNum+pageBlock-1;
    
    var html = "";	
    html += "<a class=\"direction l2\" href=\"javascript:LayerGoToPage(1, '"+popupId+"');\"></a>";
    html += "<a class=\"direction l1\" href=\"javascript:LayerGoToPage("+prePage+", '"+popupId+"');\"></a>";
    
    if(totalCnt == 0) {
    	html += "<a class=\"active\" href=\"javascript:void(0);\">1</a>";
    } else {
    	for(var i = sNum; i <= eNum; i++) {
        	if(i > lastPage) break;

        	if(i == curPage) {
        		html += "<a class=\"active\" href=\"javascript:void(0);\">"+i+"</a>";
        	} else {
        		html += "<a href=\"javascript:LayerGoToPage("+i+", '"+popupId+"');\">"+i+"</a>";
        	}
        }	
    }
    
    html += "<a class=\"direction r1\" href=\"javascript:LayerGoToPage("+nextPage+", '"+popupId+"');\"></a>";
    html += "<a class=\"direction r2\" href=\"javascript:LayerGoToPage("+lastPage+", '"+popupId+"');\"></a>";
    
    $("#paging_"+popupId).html(html);
    
};

/**
 * Common.codeMaker
 * param : selectBoxId, selectedVal, param
 */
Common.codeMaker = function(selectBoxId, selectedVal, param) {
	var url = "/common/getCodeList.ajax";
	Ajax.setSelBox(url, param, selectBoxId, selectedVal);
};

Common.userCodeMaker = function(selectBoxId, selectedVal, param) {
	var url = "/common/getUserCodeList.ajax";
	Ajax.setSelBox(url, param, selectBoxId, selectedVal);
};

/**
 * Common.checkAll
 */
Common.checkAll = function(colName, rowName) {
	//console.log("Common.checkAll");
	var checkAll = $("input:checkbox[name='"+colName+"']").is(":checked");
	if(checkAll){
		$("input:checkbox[name='"+rowName+"']").each(function(){
			this.checked = true;
		});
	} else {
		$("input:checkbox[name='"+rowName+"']:checked").each(function(){
			this.checked = false;
    	});
	}
};

/**
 * Common.pageSize
 */
Common.pageSize = function(selectBoxId, value) {
	
	var pageArr = ["10","20","30","50","100"];
	
	for(var i = 0; i < pageArr.length; i++) {
		$("#"+selectBoxId).append("<option value='"+pageArr[i]+"'>"+pageArr[i]+"</option>");
	}

	if(!Common.isNull(value)) {
		$("#"+selectBoxId).val(value);
	}
	
};

Common.srchPageSize = function(selectBoxId, value) {
	
	var pageArr = ["10","50","100"];
	
	for(var i = 0; i < pageArr.length; i++) {
		$("#"+selectBoxId).append("<option value='"+pageArr[i]+"'>"+pageArr[i]+"</option>");
	}

	if(!Common.isNull(value)) {
		$("#"+selectBoxId).val(value);
	}
	
};

/**
 * Common.layerPopup : layer popup open 
 */
Common.layerPopup = function(param) {
	LayerPopupCall(param);
};

/**
 * Common.convert
 */
Common.convert = function(str) {
	if(Common.isNotNull(str)) {
		str = str.replace(/(\n|\r\n)/g, "<br>");
	}
	return str;
};

Common.convertPer = function(str) {
	if(Common.isNotNull(str)) {
		str = str.replace(/(%)/g, ",<br>");
	}
	return str;
};

/**
 * Common.nullToEmpty
 */
Common.nullToEmpty = function(str) {
	if(typeof str == null || str == undefined || str == "null") {
		str = "";
	}
	return str;
};

/**
 * Common.htmlRemove
 */
Common.htmlRemove = function(str) {
	if(Common.isNotNull(str)) {
		str = str.replace(/&amp;/g, "&");
		str = str.replace(/&lt;/g, "<");
		str = str.replace(/&gt;/g, ">");
		str = str.replace(/&quot;/g, "'");
		str = str.replace(/&nbsp;/g, " ");
		str = str.replace(/&shy;/g, "-");
	}
	return str;
};

/**
 * spaceRemove
 */
Common.spaceRemove = function(str) {
	if(Common.isNotNull(str)) {
		str = str.replace(/\s/gi, "");
	}
	return str;
};

/**
 * Common.onlyNumber
 */
Common.onlyNumber = function(event) {
    event = event || window.event;
    var keyID = (event.which) ? event.which : event.keyCode;
    if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) {
    	return;
    } else {
    	return false;
    }
}
/**
 * Common.removeChar
 */
Common.removeChar = function(event) {
    event = event || window.event;
    var keyID = (event.which) ? event.which : event.keyCode;
    if ( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) {
    	return;
    } else {
    	event.target.value = event.target.value.replace(/[^0-9]/g, "");
    }        
}

/**
 * Common.PopupOpen 
 * */
Common.PopupOpen = function(url, title, w, h) {
	//Fixes dual-screen position                         Most browsers      Firefox
	var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
	var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

	var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
	var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

	var left = ((width / 2) - (w / 2)) + dualScreenLeft;
	var top = ((height / 2) - (h / 2)) + dualScreenTop;
	
	GL_SINGLEPOP = window.open(url, title, 'scrollbars=yes, resizable=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}

/**
 * Common.sysdate
 * */
Common.sysdate = function(idx) {	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) dd = "0"+dd; 
	if(mm<10) mm = "0"+mm;
	
	var sysdate = "";
	if(idx=="YYYY/MM/DD") {
		sysdate = yyyy+"/"+mm+"/"+dd;
	} else if(idx=="DD/MM/YYYY") {
		sysdate = dd+"/"+mm+"/"+yyyy;
	} else {
		sysdate = yyyy+""+mm+""+dd;
	}
	return sysdate;
}
/**
 * Common.firstDate
 * */
Common.firstDate = function(idx) {
	var today = new Date();
	var dd = "01";
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
 
	if(mm<10) mm = "0"+mm;
	
	var firstDate = "";
	if(idx=="YYYY/MM/DD") {
		firstDate = yyyy+"/"+mm+"/"+dd;
	} else if(idx=="DD/MM/YYYY") {
		firstDate = dd+"/"+mm+"/"+yyyy;
	} else {
		firstDate = yyyy+""+mm+""+dd;
	}
	return firstDate;
}

Common.lpad = function(str, length, padStr){
	str = String(str || '');
	length = length || 0;
	padStr = padStr || '';
	
	if(length === 0 || padStr === '') return;
	var result = '';
	for(var i=0; i<length - str.length; i++){
		result += padStr;
	}
	result += str;
	return result;
}


/**********************************************************************************************************
 *** Ajax 
 **********************************************************************************************************/
var Ajax = {};

Ajax.request = function(url, jsonData, callback, addParam, progressBar) {
	var argLength = arguments.length;
	
	var paramQueryString = "";
	if(addParam == "" || addParam == null) {
	} else {
		paramQueryString = "?" + $.param(addParam);
	}
	
	var token = $('meta[name="_csrf"]').attr('content');
	var header = $('meta[name="_csrf_header"]').attr('content');
	var paramName = $("meta[name='_csrf_parameter']").attr("content");
	    
	$.ajax({
        type : "post",
        url : url + paramQueryString,
        dataType : "json",
        data : jsonData,
        beforeSend : function(xhr) {
        	if (token && header) {
                xhr.setRequestHeader(header, token);
                xhr.setRequestHeader('AJAX', true);
            }
        	
        	if(argLength == 5 && progressBar == true) {
        		$(".loadingWrap").show(); 
        	}
        },
        error : function(request, status, error) {
        	alert("La comunicación del servidor falló."+error);
        },
        success : function(data) {
        	if(callback == "" || callback == null) {
        	} else {
        		callback(data);
        	}
        },
        complete : function(request, status) {
        	if(argLength == 5 && progressBar == true) {
        		$(".loadingWrap").hide(); 
        	}
        },
        statusCode: {
            403: function() {
                alert("sorry! session or csrf token invalid ...");
            }
        }
    });
	
};

/**
 * Ajax.setSelBox
 */
Ajax.setSelBox = function(url, jsonData, selectBoxId, value) {	
	var argLength = arguments.length;
	
	var token = $('meta[name="_csrf"]').attr('content');
	var header = $('meta[name="_csrf_header"]').attr('content');
	var paramName = $("meta[name='_csrf_parameter']").attr("content");
	
	$.ajax({
        type : "post",
        url : url,
        dataType : "json",
        data : jsonData,
        beforeSend : function(xhr) {
        	if (token && header) {
                xhr.setRequestHeader(header, token);
                xhr.setRequestHeader('AJAX', true);
            }
        	
        	if(argLength == 5 && progressBar == true) {
        		$(".loadingWrap").show(); 
        	}
        },
        error : function(request, status, error) {
        	alert("La comunicación del servidor falló.");
        },
        success : function(data) {
        	var data_list = data.LIST;
        	var length = data_list.length;
        	if(length > 0) {
        		for(var i = 0; i < length; i++) {
        			var row = data_list[i];
        			$("#"+selectBoxId).append("<option value='"+row.VALUE+"' data-ref='"+row.REF+"'>"+row.NAME+"</option>");
        		}		
        	}
        	//console.log(selectBoxId+" : written by commonUtil");
        	if(Common.isNotNull(value)) {
        		$("#"+selectBoxId).val(value).prop("selected", true);
        		//console.log(selectBoxId+"("+value+") selected");
        	}
        },
        complete : function(request, status) {
        	if(argLength == 5 && progressBar == true) {
        		$(".loadingWrap").hide(); 
        	}
        },
        statusCode: {
            403: function() {
                alert("sorry! session or csrf token invalid ...");
            }
        }
    });
	
};



/**********************************************************************************************************
 *** Code 
 **********************************************************************************************************/
var Code = {};
/**
 * stdCodeList 
 * @param activeYn
 * @param tpCd
 * @param stdCd
 * @param pCd
 * @param lvl
 * @param ref1Cd
 * @param callback
 */
var codeResult;
Code.stdCodeList = function(activeYn, tpCd, stdCd, pCd, lvl, ref1Cd, callback){
	$.ajax({
		type: 'post',
		url: '/common/getStdCodeList.ajax',
		data : {'activeYn':activeYn,'tpCd':tpCd, 'stdCd':stdCd, 'pCd': pCd, 'lvl':lvl, 'ref1Cd' : ref1Cd},
		dataType: 'json',
		success: function (data) {
			codeResult = data.list;
			callback(codeResult);
		},error: function () {
			alert('Fallo de comunicación');
		}
	});
}

Code.stdSearchCodeList = function(activeYn, tpCd, stdCd, pCd, lvl, ref1Cd, classCd, classSpecCd, callback){
	$.ajax({
		type: 'post',
		url: '/common/getStdCodeList.ajax',
		data : {'activeYn':activeYn,'tpCd':tpCd, 'stdCd':stdCd, 'pCd': pCd, 'lvl':lvl, 'ref1Cd' : ref1Cd, 'classCd' :  classCd, 'classSpecCd' : classSpecCd},
		dataType: 'json',
		success: function (data) {
			codeResult = data.list;
			callback(codeResult);
		},error: function () {
			alert('Fallo de comunicación');
		}
	});
}

Code.stdCodeOrderList = function(activeYn, tpCd, stdCd, pCd, lvl, ref1Cd, orderBy, callback){
	$.ajax({
		type: 'post',
		url: '/common/getStdCodeList.ajax',
		data : {'activeYn':activeYn,'tpCd':tpCd, 'stdCd':stdCd, 'pCd': pCd, 'lvl':lvl, 'ref1Cd' : ref1Cd, 'strSort' : orderBy},
		dataType: 'json',
		success: function (data) {
			codeResult = data.list;
			callback(codeResult);
		},error: function () {
			alert('Fallo de comunicación');
		}
	});
}

Code.ownInfoCodeList = function(tpOwnCd, callback){
	$.ajax({
		type: 'post',
		url: '/common/getHipOwnInfoList.ajax',
		data : {'tpOwnCd' :tpOwnCd},
		dataType: 'json',
		success: function (data) {
			codeResult = data.list;
			callback(codeResult);
		},error: function () {
			alert('Fallo de comunicación');
		}
	});
}

Code.stdCodeSortList = function(activeYn, tpCd, stdCd, pCd, lvl, ref1Cd, sort, callback){
	$.ajax({
		type: 'post',
		url: '/common/getStdCodeList.ajax',
		data : {'activeYn':activeYn,'tpCd':tpCd, 'stdCd':stdCd, 'pCd': pCd, 'lvl':lvl, 'ref1Cd' : ref1Cd, 'strSort' : sort},
		dataType: 'json',
		success: function (data) {
			codeResult = data.list;
			callback(codeResult);
		},error: function () {
			alert('Fallo de comunicación');
		}
	});
}

Code.stdEthnCodeList = function(activeYn, tpCd, stdCd, pCd, lvl, ref1Cd, callback){
	$.ajax({
		type: 'post',
		url: '/common/getEthnStdCodeList.ajax',
		data : {'activeYn':activeYn,'tpCd':tpCd, 'stdCd':stdCd, 'pCd': pCd, 'lvl':lvl, 'refCdChk' : ref1Cd},
		dataType: 'json',
		success: function (data) {
			codeResult = data.list;
			callback(codeResult);
		},error: function () {
			alert('Fallo de comunicación');
		}
	});
}


/**
 * ubigeoCodeList 
 * @param lvl
 * @param activeYn
 * @param ubigeoNo
 * @param callback
 */
Code.ubigeoCodeList = function(lvl, activeYn, ubigeoNo, callback){
	$.ajax({
		type: 'post',
		url: '/common/getUbigeoCodeList.ajax',
		data : {'lvl':lvl,'activeYn':activeYn, 'ubigeoNo':ubigeoNo},
		dataType: 'json',
		success: function (data) {
			codeResult = data.list;
			callback(codeResult);
		},error: function () {
			alert('Fallo de comunicación');
		}
	});
}


/**
 * authCodeList 
 * @param stdCd
 * @param pCd
 * @param activeYn
 * @param callback
 */
Code.authCodeList = function (authCd, pCd, activeYn, callback) {
	$.ajax({
		type: 'post',
		url: '/common/getAuthInfoList.ajax',
        data: {'authCd': authCd, 'pCd': pCd, 'activeYn': activeYn},
		dataType: 'json',
		success: function (data) {
			codeResult = data.list;
			callback(codeResult);
		},error: function () {
			alert('Fallo de comunicación');
		}
	});
}

/**
 * LCT_INFO CODE 
 * @param tpLctCd
 * @param callback
 */
Code.lctInfoCodeList = function(tpLctCd, callback){
	$.ajax({
		type: 'post',
		url: '/common/getLctInfoCodeList.ajax',
		data : {'tpLctCd': tpLctCd},
		dataType: 'json',
		success: function (data) {
			codeResult = data.list;
			callback(codeResult);
		},error: function () {
			alert('Fallo de comunicación');
		}
	});
}

/**
 * USER_LCT_DATA CODE 
 * @param tpLctCd
 * @param callback
 */
Code.lctInfoUserCodeList = function(sqlid, tpLctCd, userseq, callback){
	$.ajax({
		type: 'post',
		url: '/common/getUserCodeList.ajax',
		data : {'SQL_ID': sqlid, 'TP_LCT_CD': tpLctCd, 'USER_SEQ': userseq},
		dataType: 'json',
		success: function (data) {
			codeResult = data.LIST;
			callback(codeResult);
		},error: function () {
			alert('Fallo de comunicación');
		}
	});
}


/**
 * HIP_ORGA_INFO CODE 
 * @param pSeq
 * @param lvl
 * @param activeYn
 * @param callback
 */
Code.orgaInfoCodeList = function(pSeq, lvl, activeYn, callback){
	$.ajax({
		type: 'post',
		url: '/common/getRgainfoCodeList.ajax',
		data : {'pSeq': pSeq, 'lvl' : lvl, 'activeYn' : activeYn},
		dataType: 'json',
		success: function (data) {
			codeResult = data.list;
			callback(codeResult);
		},error: function () {
			alert('Fallo de comunicación');
		}
	});
}



var Valid = {};

Valid.isEmpty = function(target) {
	if($('#'+target).val() == undefined || $('#'+target).val() == ''){
		$('#'+target).focus();
	}
};

Valid.email = function(str) {
	var rtn = true;
	var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
	if (str.match(regExp) != null) {
		// good
	} else {
		// bad
	  Common.alert("warning", "El formato de correo electrónico no es válido.", "");
	  rtn = false;
	}
	return rtn;
};

Valid.require = function(target) {
	var rtn = true; 
	var visible = $("#"+target).is(":visible");
	if(visible) {
		if(Common.isEmpty($("#"+target).val())) {
			$("#"+target).focus();
			var columns = $("#"+target).data("columns");
			Common.alert("warning", columns+" es una entrada requerida.", "");
			rtn = false;
		}	
	}
	return rtn;
};

Valid.arrRequire = function(targetArr) {
	var rtn = true;
	for(var i in targetArr) {

		var visible = $("#"+targetArr[i]).is(":visible");
		if(visible) {
			if(Common.isEmpty($("#"+targetArr[i]).val())) {
				$("#"+targetArr[i]).focus();
				var columns = $("#"+targetArr[i]).data("columns");
				Common.alert("warning", columns+" es una entrada requerida.", "");
				rtn = false;
				return false; // loop out
			}
		}	
	}
	return rtn;
};


var Upload = {};
var Download = {};

var GL_SINGLEPOP;
var GL_extensionAllowOrLimit = "1"; 
var GL_imgExtensionArr = "jpg,jpeg,gif,png,tif,tiff";
var GL_docExtensionArr = "doc,docx,ppt,pptx,xls,xlsx,pdf,txt";
var GL_pdfExtensionArr = "pdf";
var GL_3dExtensionArr = "bx,obj,gltf,glb";
var GL_singleExtensionArr = GL_imgExtensionArr+","+GL_docExtensionArr;


Upload.valid = function(params) {
	var rtn = true;
	if(Common.isEmpty(params.maxTotalFileCount)) {
		alert("maxTotalFileCount is Empty!");
		rtn = false;
	} else if(isNaN(params.maxTotalFileCount)) {
		alert("maxTotalFileCount is not Number!");
		rtn = false;
	} else if(Number(params.maxTotalFileCount) == 0) {
		alert("maxTotalFileCount is zero!");
		rtn = false;
	} else if(Common.isEmpty(params.filePath)) {
		alert("filePath is Empty!");
		rtn = false;
	}
	return rtn;
}
/**
 * img + doc
 */
Upload.singlePopOpen = function(params) {
	//console.log("Upload.singlePopOpen");
	Upload.valid(params);
	var url = "/common/include/singleUpload.do";

	Common.PopupOpen(url, "singlePopup", "550", "315");
	
	var $form = $("<form></form>");
	$form.attr("method", "post");
	$form.attr("action", url);
	$form.attr("target", "singlePopup");
	$form.appendTo("body");
	
	var maxTotalFileCount = $("<input type='hidden' value='"+params.maxTotalFileCount+"' name='maxTotalFileCount'>");
	var filePath = $("<input type='hidden' value='"+params.filePath+"' name='filePath'>");
	var thumbPath1 = $("<input type='hidden' value='"+params.thumbPath1+"' name='thumbPath1'>");
	var thumbPath2 = $("<input type='hidden' value='"+params.thumbPath2+"' name='thumbPath2'>");
	var preFileName = $("<input type='hidden' value='"+params.preFileName+"' name='preFileName'>");
	var customValue = $("<input type='hidden' value='"+params.customValue+"' name='customValue'>");
	var uploadId = $("<input type='hidden' value='"+params.uploadId+"' name='uploadId'>");
	var extensionAllowOrLimit = $("<input type='hidden' value='"+GL_extensionAllowOrLimit+"' name='extensionAllowOrLimit'>");
	var extensionArr = $("<input type='hidden' value='"+GL_singleExtensionArr+"' name='extensionArr'>");
	
	$form.append(maxTotalFileCount);
	$form.append(filePath);
	$form.append(thumbPath1);
	$form.append(thumbPath2);
	$form.append(preFileName);
	$form.append(customValue);
	$form.append(uploadId);
	$form.append(extensionAllowOrLimit);
	$form.append(extensionArr);
	$form.submit();
	
};
/**
 * img
 */
Upload.imagePopOpen = function(params) {
	//console.log("Upload.imagePopOpen");
	Upload.valid(params);
	var url = "/common/include/singleUpload.do";
	Common.PopupOpen(url, "singlePopup", "550", "315");	
	
	var $form = $("<form></form>");
	$form.attr("method", "post");
	$form.attr("action", url);
	$form.attr("target", "singlePopup");
	$form.appendTo("body");
	
	var maxTotalFileCount = $("<input type='hidden' value='"+params.maxTotalFileCount+"' name='maxTotalFileCount'>");
	var filePath = $("<input type='hidden' value='"+params.filePath+"' name='filePath'>");
	var thumbPath1 = $("<input type='hidden' value='"+params.thumbPath1+"' name='thumbPath1'>");
	var thumbPath2 = $("<input type='hidden' value='"+params.thumbPath2+"' name='thumbPath2'>");
	var preFileName = $("<input type='hidden' value='"+params.preFileName+"' name='preFileName'>");
	var customValue = $("<input type='hidden' value='"+params.customValue+"' name='customValue'>");
	var uploadId = $("<input type='hidden' value='"+params.uploadId+"' name='uploadId'>");
	var extensionAllowOrLimit = $("<input type='hidden' value='"+GL_extensionAllowOrLimit+"' name='extensionAllowOrLimit'>");
	var extensionArr = $("<input type='hidden' value='"+GL_imgExtensionArr+"' name='extensionArr'>");
	
	$form.append(maxTotalFileCount);
	$form.append(filePath);
	$form.append(thumbPath1);
	$form.append(thumbPath2);
	$form.append(preFileName);
	$form.append(customValue);
	$form.append(uploadId);
	$form.append(extensionAllowOrLimit);
	$form.append(extensionArr);
	$form.submit();
	
};
/**
 * doc
 */
Upload.docPopOpen = function(params) {
	//console.log("Upload.docPopOpen");
	Upload.valid(params);
	var url = "/common/include/singleUpload.do";
	Common.PopupOpen(url, "singlePopup", "550", "315");
	
	var $form = $("<form></form>");
	$form.attr("method", "post");
	$form.attr("action", url);
	$form.attr("target", "singlePopup");
	$form.appendTo("body");
	
	var maxTotalFileCount = $("<input type='hidden' value='"+params.maxTotalFileCount+"' name='maxTotalFileCount'>");
	var filePath = $("<input type='hidden' value='"+params.filePath+"' name='filePath'>");
	var thumbPath1 = $("<input type='hidden' value='"+params.thumbPath1+"' name='thumbPath1'>");
	var thumbPath2 = $("<input type='hidden' value='"+params.thumbPath2+"' name='thumbPath2'>");
	var preFileName = $("<input type='hidden' value='"+params.preFileName+"' name='preFileName'>");
	var customValue = $("<input type='hidden' value='"+params.customValue+"' name='customValue'>");
	var uploadId = $("<input type='hidden' value='"+params.uploadId+"' name='uploadId'>");
	var extensionAllowOrLimit = $("<input type='hidden' value='"+GL_extensionAllowOrLimit+"' name='extensionAllowOrLimit'>");
	var extensionArr = $("<input type='hidden' value='"+GL_docExtensionArr+"' name='extensionArr'>");
	
	$form.append(maxTotalFileCount);
	$form.append(filePath);
	$form.append(thumbPath1);
	$form.append(thumbPath2);
	$form.append(preFileName);
	$form.append(customValue);
	$form.append(uploadId);
	$form.append(extensionAllowOrLimit);
	$form.append(extensionArr);
	$form.submit();
	
};
/**
 * pdf
 */
Upload.pdfPopOpen = function(params) {
	//console.log("Upload.pdfPopOpen");
	Upload.valid(params);
	var url = "/common/include/singleUpload.do";
	Common.PopupOpen(url, "singlePopup", "550", "315");
	
	var $form = $("<form></form>");
	$form.attr("method", "post");
	$form.attr("action", url);
	$form.attr("target", "singlePopup");
	$form.appendTo("body");
	
	var maxTotalFileCount = $("<input type='hidden' value='"+params.maxTotalFileCount+"' name='maxTotalFileCount'>");
	var filePath = $("<input type='hidden' value='"+params.filePath+"' name='filePath'>");
	var thumbPath1 = $("<input type='hidden' value='"+params.thumbPath1+"' name='thumbPath1'>");
	var thumbPath2 = $("<input type='hidden' value='"+params.thumbPath2+"' name='thumbPath2'>");
	var preFileName = $("<input type='hidden' value='"+params.preFileName+"' name='preFileName'>");
	var customValue = $("<input type='hidden' value='"+params.customValue+"' name='customValue'>");
	var uploadId = $("<input type='hidden' value='"+params.uploadId+"' name='uploadId'>");
	var extensionAllowOrLimit = $("<input type='hidden' value='"+GL_extensionAllowOrLimit+"' name='extensionAllowOrLimit'>");
	var extensionArr = $("<input type='hidden' value='"+GL_pdfExtensionArr+"' name='extensionArr'>");
	
	$form.append(maxTotalFileCount);
	$form.append(filePath);
	$form.append(thumbPath1);
	$form.append(thumbPath2);
	$form.append(preFileName);
	$form.append(customValue);
	$form.append(uploadId);
	$form.append(extensionAllowOrLimit);
	$form.append(extensionArr);
	$form.submit();
	
};
/**
 * 3d file
 */
Upload.single3DPopOpen = function(params) {
	//console.log("Upload.singlePopOpen");
	Upload.valid(params);
	var url = "/common/include/singleUpload.do";

	Common.PopupOpen(url, "singlePopup", "550", "315");
	
	var $form = $("<form></form>");
	$form.attr("method", "post");
	$form.attr("action", url);
	$form.attr("target", "singlePopup");
	$form.appendTo("body");
	
	var maxTotalFileCount = $("<input type='hidden' value='"+params.maxTotalFileCount+"' name='maxTotalFileCount'>");
	var filePath = $("<input type='hidden' value='"+params.filePath+"' name='filePath'>");
	var thumbPath1 = $("<input type='hidden' value='"+params.thumbPath1+"' name='thumbPath1'>");
	var thumbPath2 = $("<input type='hidden' value='"+params.thumbPath2+"' name='thumbPath2'>");
	var preFileName = $("<input type='hidden' value='"+params.preFileName+"' name='preFileName'>");
	var customValue = $("<input type='hidden' value='"+params.customValue+"' name='customValue'>");
	var uploadId = $("<input type='hidden' value='"+params.uploadId+"' name='uploadId'>");
	var extensionAllowOrLimit = $("<input type='hidden' value='"+GL_extensionAllowOrLimit+"' name='extensionAllowOrLimit'>");
	var extensionArr = $("<input type='hidden' value='"+GL_3dExtensionArr+"' name='extensionArr'>");
	
	$form.append(maxTotalFileCount);
	$form.append(filePath);
	$form.append(thumbPath1);
	$form.append(thumbPath2);
	$form.append(preFileName);
	$form.append(customValue);
	$form.append(uploadId);
	$form.append(extensionAllowOrLimit);
	$form.append(extensionArr);
	$form.submit();
	
};

Upload.singlePopClose = function() {
	if(GL_SINGLEPOP != null) GL_SINGLEPOP.close();
};
/**
 * single upload
 */
Download.singlePopOpen = function(params) {
	var url = "/common/include/singleDownload.do";
	Common.PopupOpen(url, "singlePopup", "550", "350");
	
	var $form = $("<form></form>");
	$form.attr("method", "post");
	$form.attr("action", url);
	$form.attr("target", "singlePopup");
	$form.appendTo("body");
	var fileOrgName = $("<input type='hidden' value='"+params.fileOrgName+"' name='fileOrgName'>");
	var fileChgName = $("<input type='hidden' value='"+params.fileChgName+"' name='fileChgName'>");
	var filePath = $("<input type='hidden' value='"+params.filePath+"' name='filePath'>");
	var fileSize = $("<input type='hidden' value='"+params.fileSize+"' name='fileSize'>");
	$form.append(fileOrgName);
	$form.append(fileChgName);
	$form.append(filePath);
	$form.append(fileSize);
	$form.submit();

};


Common.setWindowCenter = function(width, height){
	var result = {
		setWidth : (window.screen.width/2) - (width/2),
		setHeight : (window.screen.height/2) - (height/2)
	};
	return result;
}

/**
 * Byte to format string.
 * @param bytes: {Number} bytes
 * @param digit: {Number} digit (option)
 * @return {String} Formatted string.
 * @author JKDS_gdchoi
 */
Common.toFileSizeString = function(bytes, digit){
	digit = arguments.length == 2 ? digit : 1;
	
	if(isNaN(parseInt(bytes))) throw new Error('byte is not number');
	if(isNaN(parseInt(digit))) throw new Error('digit is not number');
	
	var unitList = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	var size = bytes;
	var unitIdx = 0;
	while(size > 1024){
		size /= 1024;
		unitIdx++;
	}
	var roundSize = unitIdx == 0 ? Math.round(size) : size.toFixed(digit);
	var strUnit = unitList[unitIdx];
	return roundSize + ' ' + strUnit;
};


/**********************************************************************************************************
 * Grid 
 **********************************************************************************************************/
var Grid = window.Grid || {};
/**
 * Create a unique key generation function on element
 * @param gridId: {String} grid element id
 * @return {Boolean} created flag
 * @author JKDS_gdchoi
 */
Grid.createUniqueId = function(gridId){
	var targetGrid = document.getElementById(gridId);
	if(!!targetGrid){
		targetGrid.nextUniqueId = (function(){var id=1;return function(){ return id++;}})();
		return true;
	}
	return false;
};
/**
 * get next unique key on element
 * @param gridId: {String} grid element id
 * @return {Number} unique id
 * @author JKDS_gdchoi
 */
Grid.getUniqueId = function(gridId){
	var targetGrid = document.getElementById(gridId);
	if(!!targetGrid){
		if(targetGrid.nextUniqueId instanceof Function == false){
			var created = Grid.createUniqueId(gridId);
			if(!created) return;
		}
		return targetGrid.nextUniqueId();
	}
};


/*******************************************************************************************
* Report
* @param chkNm : check box
* @param mode : MVB(Patrimonio Mueble), HRE(Patrimonio Immueble Histórico)
* @param smode : FICHA, CERT
********************************************************************************************/
var Report = {};
var Report1 = {};
Report.request = function(reportUrl, chkNm, mode, smode, admyn){
	var checkedYN = $('input[name=' + chkNm + ']').is(':checked');
	if (checkedYN) {
		var chkedVal = $('input[name=' + chkNm + ']:checked').map(function(){
		    return $(this).val();
		}).get().join(",");
		$(".loadingCloseType").removeClass("hide");
		$(location).attr("href", reportUrl + "/exportForPDF.jsp?GEN_SEQ=" + chkedVal + "&mode=" + mode + "&sub_mode=" + smode + "&admyn=" + admyn); 
	} else {
		Common.alert('warning', "Puede continuar después de seleccionar la casilla de verificación.");
	}
};

Report1.request = function(reportUrl, chkNm, mode, smode, loading, admyn){
	var checkedYN = $('input[name=' + chkNm + ']').is(':checked');
	if (checkedYN) {
		var chkedVal = $('input[name=' + chkNm + ']:checked').map(function(){
		    return $(this).val();
		}).get().join(",");
		//$(".loadingCloseType").removeClass("hide");
		$(location).attr("href", reportUrl + "/exportForPDF.jsp?GEN_SEQ=" + chkedVal + "&mode=" + mode + "&sub_mode=" + smode + "&admyn=" + admyn); 
	} else {
		Common.alert('warning', "Puede continuar después de seleccionar la casilla de verificación.");
	}
};

Report.certRequest = function(reportUrl, certSeq, certNo, mode, smode, admyn){
	$(".loadingCloseType").removeClass("hide");
	$(location).attr("href", reportUrl + "/exportForPDF.jsp?CERT_SEQ=" + certSeq + "&CERT_NO=" + certNo + "&mode=" + mode + "&sub_mode=" + smode + "&admyn=" + admyn); 
};

Report.exposRequest = function(reportUrl, chkNm, mode, smode, admyn){
	var checkedYN = $('input[name=' + chkNm + ']').is(':checked');
	if (checkedYN) {
		var chkedVal = $('input[name=' + chkNm + ']:checked').map(function(){
		    return $(this).val();
		}).get().join(",");
		
		$(".loadingCloseType").removeClass("hide");
		var expos_seq = $('#exhOrgSeq').val();
		$(location).attr("href", reportUrl + "/exportForPDF.jsp?GEN_SEQ=" + chkedVal + "&mode=" + mode + "&sub_mode=" + smode + "&EXPOS_SEQ=" + expos_seq + "&admyn=" + admyn); 
	} else {
		Common.alert('warning', "Puede continuar después de seleccionar la casilla de verificación.");
	}
};