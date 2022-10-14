/*************Jquery-Mobile自定义属性*************/
//该段代码必须放在引入Jquery-mobile.js之前才能有效
$(document).bind('mobileinit', function(){
    $.event.special.swipe.horizontalDistanceThreshold = 150; // 修改触发 swipe 事件的最小水平拖曳距离为 100(px)
    $.event.special.swipe.verticalDistanceThreshold = 100; // 修改触发 swipe 事件的最大垂直拖曳距离为 120 (px)
    $.mobile.orientationChangeEnabled = false; // 默认禁止触发 orientationChangeEnabled
});


/*********************提供HTML5移动开发， 基本前端框架  by wangfeng*********************************/
var os;//当前操作系统类型
var os_android = "android";//安卓操作系统
var os_ios = "ios";//苹果操作系统
var device;//当前硬件设备类型
var device_pad="pad";//当前硬件设备类型:PAD
var device_phone="phone";//当前硬件设备类型:PHONE
var device_pc="pc";//当前硬件设备类型:pc
var depUrl="http://localhost:8080/seeyon/cmp.do";
var fontSize = 13;//字体大小
if(typeof _CallBackCache == 'undefined'){
	var _CallBackCache = {};
	var _CallBackIndex = 0;
}

if(window.seeyonMobile==null||window.seeyonMobile==undefined){
	//需要判断是是否为PC  还是  iOS  直接从操作系统平台判断
	if((navigator.platform == "Win32") || (navigator.platform == "Windows")){
		os = device_pc;
	}else{
		os = device_pc;
	}
}else{
	os = device_pc;
}

var CurrentUser;
//这两个对象用于多次同一类型的请求只响应最后一次
//关键是怎么样来判断两个doType属于同一类型
var _requestCacheId = {}, _requestCacheIdIndex = 0;

var fromModule_Msg = 7;
var fromModule_TimeView = 14;


/**
 * CMP用于保存全局变量
 * 比如当前登录人员信息等
 */
var CMP  ={
		activepage : $("body")//保存目标页面
};


/**
 * 首次加载页面会执行$();
 * 其他通过转场加载的页面不会执行$(),而是通过pagebeforechange触发compPage
 */
$(function(){
	$(".comp").compPage();
});


/**
 * 判断是否为开发模式
 * 非开发模式：运行于android、ios系统下，可以调用拍照、录音、关联上传等组件
 * 开发模式：直接使用浏览器访问页面，所有请求都使用ajax来获取后台数据
 * 浏览器运行于Windows则为调试
 */
function isDevMode(){
	try{
		var href = window.location.href;
		if((navigator.platform == "Win32") || (navigator.platform == "Windows")){
			depUrl = href.substring(0, href.indexOf("seeyon")+6)+"/cmp/cmp.do";
			return true;
		}else{
			return true;
		}
	}catch(e){
		return false;
	}
}


/**
 * 判断加载的页面是pad端页面还是phone端页面
 * @returns {String}
 */
function testDevice(){
	var name = window.location+"";
	if(name.indexOf("/"+device_phone+"/")>=0){
		return device_pc;
	}else if(name.indexOf("/"+device_pad+"/")>=0){
		return device_pc;
	}else{
		return device_pc;
	}
	return device_pc;
}

//调用客户端接口向服务器请求数据
function smRequest(doType,param,callBack){
	//showLoader("loading",true,"b",false,"");
	param.doType = doType;
	if(isDevMode()){
		spcRequest(doType,encodeURI(encodeURI($.toJSON(param))),callBack);
	}else{
		var idCache = "cache"+_requestCacheIdIndex;
		_requestCacheId[idCache] = idCache;
		_requestCacheIdIndex++;
		param.requestCacheId = idCache;
		//缓存回调函数
		var callbackId = "cbc"+_CallBackIndex;
		param.callbackId = callbackId;
		param.requestType = 1;//0表示本地请求，1表示远程请求
		_CallBackCache[callbackId] = {
			func : callBack
			,requestType : param.requestType
		};
		_CallBackIndex++;
		var paramJson = encodeURI(encodeURI($.toJSON(param)));

		if(testOS()==os_android){
			//第三个参数是一个json作为预留参数，以后可以扩展
			window.seeyonMobile.smRequest(doType,paramJson,callbackId);
		}else if(testOS()==os_ios){
			MJS_IOS_CommandParam_SMRequest(doType, param);
		}
	}
}

function MJS_IOS_CommandParam_SMRequest(MJSCommandNumber,paramObject){
	var jsonObject = {doType:MJSCommandNumber,param:paramObject};
	var paramJson = encodeURI(encodeURI($.toJSON(jsonObject)));
	window.location.href = "MJSCommand?" + paramJson;
}
String.prototype.TrimAll = function()
{
  return this.replace(/(^\s*)|(\s*$)|(\n)/g,"");
};
//服务器端请求数据的回调函数
function smResponse(callbackId,returnValue){
//	var requestCacheId = returnValue.requestCacheId;
	if(returnValue!=null){
		//将+替换为%20  后解码，否则空格显示为+
		returnValue = decodeURIComponent(returnValue);
		returnValue = returnValue.replace(/\+/g,"%20");
		returnValue = decodeURIComponent(returnValue);
		var temp = _CallBackCache[callbackId];
		if(temp==null){
			//hideLoader();
			return;
		}
		try{
			var r = returnValue;
			if(typeof returnValue == 'string' && returnValue.TrimAll().length != 0){
				r = $.parseJSON(returnValue);
			}
			if(temp.requestType==1){
				if(r!=null && r.success){
					doIt(temp.func,r.result);
				}
			}else if(temp.requestType==0){
				addLocalResponseInner(temp.func, r);
			}
		}catch(e){alert(e.message);};
		delete _CallBackCache[callbackId];
	}
	//hideLoader();
}


function doIt(tempFunc,msg){
	if(typeof tempFunc == 'function'){
		tempFunc(msg);
	}
	tempFunc = null;
}
//拍照、录音、附件上传的接口调用函数
//1、拍照 2、录音 3、附件 4、当前登录者信息（返回值是一个json，属性名和属性值类型由王显康来定义）
//5、打开附件（包括下载） 6、选择关联文档 7、打开关联文档 8、停止上传 9、是否下载附件 10 是否下载文件格式的关联文档 11 ios下打开本地文件
//100 回到首页

function addLocalRequest(doType, callBack, selected){
	if(isDevMode()){
		CurrentUser = {
				orgID:"-2262166639906043681",
				orgName:"周二",
				cmpBaseUrl:"http://10.5.5.57:9999",
				clientType:"pc",
				JSESSIONID:"JSESSIONID=1234131313"
		};
		if (!isBlank(currentuser_cmpBaseUrl))
		  CurrentUser.cmpBaseUrl = currentuser_cmpBaseUrl;
		else
		  CurrentUser.cmpBaseUrl = window.location.href.substring(0, window.location.href.indexOf("/seeyon"));

		callBack(CurrentUser);
		return;
	}
	var param = {};
	var callbackId = "cbc"+_CallBackIndex;
	param.doType = doType;
	param.callbackId = callbackId;
	param.selected = selected || [];//选中的关联文档
	param.requestType = 0;//0表示本地请求，1表示远程请求
	_CallBackCache[callbackId] = {
		func : callBack
		,requestType : param.requestType
	};
	_CallBackIndex++;
	var paramJson = encodeURI(encodeURI($.toJSON(param)));

	if(testOS()==os_android){
		//第三个参数是一个json作为预留参数，以后可以扩展
		window.seeyonMobile.smRequest(doType, paramJson, callbackId);
	}else if(testOS()==os_ios){
		//ios中貌似只能用json传递参数了，而且方便扩展
		MJS_IOS_CommandParam_SMRequest(doType, param);
	}
	return callbackId;
}
//拍照、录音、附件上传的接口回调函数，回调的时候传入附件的id
function addLocalResponse(callbackId,returnValue){
	var temp = _CallBackCache[callbackId];
	addLocalResponseInner(temp.func, returnValue);
	delete _CallBackCache[callbackId];
}
function addLocalResponseInner(tempFunc, returnValue){
	if(typeof tempFunc == 'function'){
		if(typeof returnValue == 'string' && returnValue.length != 0){
			returnValue = $.parseJSON(returnValue);
		}
		tempFunc(returnValue);
	}
	tempFunc = null;
}
function log(txt){
	var dom = $("#receiptContent");
	var text = dom.val();
	dom.val(text+txt);
	dom = null;
}

//上传进度number表示第几个附件（从第0个开始），percent表示上传的百分比1-100
function loadingLocalResource(resourceObj){
	if(resourceObj!=null){
		if(typeof resourceObj == 'string'){
			resourceObj = $.parseJSON(resourceObj);
		}
		var attArea = $("div.uploadArea ul");
		var attEle = attArea.find("[id=local"+resourceObj.attID+"]");
		if(attEle.size()==0){
			if(testDevice()==device_pad){
				attEle = addLocalElePad(attArea, resourceObj);
			}else{
				attEle = addLocalElePhone(attArea, resourceObj);
			}
		}else{
			if(resourceObj.progress>0){
				addLocalProgress(attEle, resourceObj.progress, resourceObj);
			}
		}
		attArea = attEle = null;
	}
}

//添加上传附件的进度
function addLocalProgress(attEle, progress, att){
	if(progress<0){
		progress = 0;
	}else if(progress>100){
		progress = 100;
	}
	if(progress>0){
		if(progress==100){
//			attEle.find("div.accessory_underway").removeClass("accessory_underway_content").addClass("accessory_finish");
			if(testDevice()==device_pad){
//				attEle.replaceWith(addLocalAttHuiTianPad(null, att, null));
				var temp = addLocalAttHuiTianPad(null, att, null);
				attEle.html("");
				attEle.append(temp.children());
				temp = null;
			}else{
				attEle.replaceWith(addLocalAttHuiTianPhone(null, att, null));
			}
		}else{
			attEle.find("p.accessory_underway_bar").css("width",progress+"%");
		}
	}
	attEle = null;
}

//删除附件
//TODO
function deleteLocalRequest(id){
	if(testOS()==os_android){
		//第三个参数是一个json作为预留参数，以后可以扩展
		window.seeyonMobile.addLocalRequest(doType, paramJson, callbackId);
	}else if(testOS()==os_ios){
		//ios中貌似只能用json传递参数了，而且方便扩展
		//TODO
		window.location.href= "MJSCommand?"+param;
	}
}

function addLocalRelateDocPhone(attArea, resourceObj, delFunc){
	var id = resourceObj.identifier;
	if(id==undefined||id==""){
		id = resourceObj.attID;
	}
	if(id == undefined || id == ""){
		id = resourceObj.reference;
	}
	var fileName = resourceObj.name;
	var preName = "";
	var index = fileName.lastIndexOf(".");
    var ext = '';
	if(index>-1){
		preName = fileName.substr(0,index);
        ext = fileName.substr(index);
	}else{
		preName = fileName;
	}
    preName = preName.replace(/&/g,"&amp;");
    var iconClass = getAttOrRelateIconClass(resourceObj);
	var html = '<li id="local'+id+'"><div class="accessory_finish margin_tb_15">'+
		'<div class="accessory_icon padding_lr_10">'+
		'<span class="'+iconClass+' "></span>'+
		' </div>'+
	    '<p class="accessory_underway_bar" style="width:0;"></p>'+
	    '<span class="ico_phone_48 cancel_upload_48 model_info_close" onclick="delThisAtt(this)"></span>'+
        '<div class="accessory_name">' +
        '<p class="receipt_accessory_content" name="'+preName+'" suffix="'+resourceObj.extension+'">'+
            '<label id="nameLabel">'+preName+ext+'</label>'+
//            '<label>'+resourceObj.extension+'</label>'+
        '</p>'+((resourceObj.size==null||resourceObj.size==0)?'':'<p class="accessory_size">'+resourceObj.size+'</p>')+
    '</div>'+
	'</div></li>';
	var ele = $(html);
	attArea.append(ele);
    //TODO 协同V5 OA-84259【兼容ios9】iphone客户端，会议震荡回复，添加了多个附件和关联文档，部分附件不显示图标
    attArea.hide();
    setTimeout(function(){
        attArea.show();
	},600);
	//添加单击事件，单击后下载或者打开
	addAttOrRelateClick(ele, resourceObj, true);
	return ele;
}

function addLocalRelateDocPad(attArea, resourceObj, delFunc){
	var id = resourceObj.identifier;
	if(id==undefined||id==""){
		id = resourceObj.attID;
	}
	var fileName = resourceObj.name;
	var preName = "",ext="";
	var index = fileName.lastIndexOf(".");
	if(index>-1){
		preName = fileName.substr(0,index);
        ext = fileName.substr(index);
	}else{
		preName = fileName;
	}
    preName = preName.replace(/&/g,"&amp;");
    var iconClass = getAttOrRelateIconClass(resourceObj);
	var html = '<li id="local'+id+'"><div class="accessory_finish margin_5 margin_b_10">'+
		'<div class="padding_lr_10">'+
		'<span class="'+iconClass+' margin_t_10"></span>'+
		' </div>'+
	    '<p class="accessory_underway_bar" style="width:0;"></p>'+
	    '<span class="ico_phone_48 cancel_upload_48 model_info_close" onclick="delThisAtt(this)"></span>'+
        '<div class="accessory_name">' +
            '<p class="receipt_accessory_content" name="'+preName+'" suffix="'+resourceObj.extension+'">'+
            '<label id="nameLabel">'+preName + ext +'</label>'+
            '</p>'+
            ((resourceObj.size==null||resourceObj.size==0)?'':'<p class="accessory_size">'+resourceObj.size+'</p>')+
        '</div>'+
	'</div></li>';
	var ele = $(html);
	attArea.append(ele);
	//添加单击事件，单击后下载或者打开
	addAttOrRelateClick(ele, resourceObj, true);
	return ele;
}

function getSize(size){
	if(size==null){
		return "";
	}
	var fileSize;
	if(size==0){
		fileSize = "";
	}else{
		var k=0;
		fileSize = size;
		while(fileSize>1024){
			fileSize = fileSize/(1024);
			k++;
		}
		fileSize = fileSize.toString();
		var inte = fileSize.indexOf(".")>0?fileSize.substring(0,fileSize.indexOf(".")):fileSize;
		var flot = fileSize.indexOf(".")>0?fileSize.substring(fileSize.indexOf(".")):"";
		if(flot.length>=3){
			flot = flot.substring(0,2);
		}
		fileSize = inte+flot;
		var suf = ["B","KB","MB","GB","TB"];
		fileSize = fileSize+suf[k];
	}
	return fileSize;
}

function addLocalAttHuiTianPhone(attArea, resourceObj, delFunc){
	var id = resourceObj.identifier;
	if(id==undefined||id==""){
		id = resourceObj.attID;
	}

	if(id==undefined||id==""){
		id = resourceObj.reference;
	}

	var iconClass = getAttOrRelateIconClass(resourceObj);
    resourceObj.name = resourceObj.name.replace(/&/g,"&amp;");

    var html = '<li id="local'+id+'">' +
                    '<div class="accessory_finish margin_tb_15">'+
                        '<div class="accessory_icon padding_lr_10">'+
                            '<span class="'+iconClass+' "></span>'+
                        '</div>'+
                        '<span class="ico_phone_48 cancel_upload_48 model_info_close" onclick="delThisAtt(this)"></span>'+
                        '<div class="accessory_name" >' +
                            '<p class="receipt_accessory_content" name="'+resourceObj.name+'" suffix="'+resourceObj.suffix+'">'+
                            '<label id="nameLabel">'+resourceObj.name+'</label>'+
                                (resourceObj.suffix==null?'':('<label>'+'</label>'))+
                            '</p>'+
                        ((resourceObj.size==null||resourceObj.size==0)?'':'<p class="accessory_size">'+getSize(resourceObj.size)+'</p>')+
                        '</div>'+
                    '</div>' +
                '</li>';
	var ele = $(html);
	if(attArea!=null){
		attArea.append(ele);
	}
	//添加单击事件，单击后下载或者打开
	addAttOrRelateClick(ele, resourceObj, true);
	return ele;
}

function addLocalAttHuiTianPad(attArea, resourceObj, delFunc){
	var id = resourceObj.identifier;
	if(id==undefined||id==""){
		id = resourceObj.attID;
	}
	var iconClass = getAttOrRelateIconClass(resourceObj);
    resourceObj.name = resourceObj.name.replace(/&/g,"&amp;");
    var html = '<li id="local'+id+'"><div class="accessory_finish margin_5 margin_b_10">'+
	'<div class="padding_lr_10">'+
		'<span class="'+iconClass+' margin_t_10"></span>'+
		' </div>'+
	    '<span class="ico_phone_48 cancel_upload_48 model_info_close" onclick="delThisAtt(this)"></span>'+
        '<div class="accessory_name"><p class="receipt_accessory_content">'+
            resourceObj.name+
        '</p>'+
        ((resourceObj.size==null||resourceObj.size==0)?'':'<p class="accessory_size">'+getSize(resourceObj.size)+'</p>')+
    '</div>'+
	'</div></li>';
	var ele = $(html);
	if(attArea!=null){
		attArea.append(ele);
	}
	//添加单击事件，单击后下载或者打开
	addAttOrRelateClick(ele, resourceObj, true);
	return ele;
}
//上传附件时，将附件元素添加到页面上
function addLocalElePhone(attArea, resourceObj, delFunc){
	var id = resourceObj.identifier;
	if(id==undefined || id==""){
		id = resourceObj.attID;
	}
	var fileName = resourceObj.name;
	var index = fileName.lastIndexOf(".");
	var preName = "";
	if(index>-1){
		preName = fileName.substr(0,index);
	}else{
		preName = fileName;
	}
	var iconClass = getAttOrRelateIconClass(resourceObj);
	var html = "";
    resourceObj.name = resourceObj.name.replace(/&/g,"&amp;");
    if(resourceObj.progress>0){
		html = '<li id="local'+id+'"><div class="accessory_finish margin_tb_15">'+
		'<div class="accessory_icon padding_lr_10">'+
			'<span class="'+iconClass+' "></span>'+
			' </div>'+
		    '<span class="ico_phone_48 cancel_upload_48 model_info_close" onclick="delThisAtt(this)"></span>'+
	        '<div class="accessory_name"><p class="receipt_accessory_content" name="'+resourceObj.name+'" suffix="'+resourceObj.suffix+'">'+
	            '<label id="nameLabel">'+resourceObj.name+'</label>'+
	            (resourceObj.suffix==null?'':('<label>'+'</label>'))+
	        '</p>'+
	        ((resourceObj.size==null||resourceObj.size==0)?'':'<p class="accessory_size">'+getSize(resourceObj.size)+'</p>')+
	    '</div>'+
		'</div></li>';
	}else{
		html = '<li id="local'+resourceObj.attID+'"><div class="accessory_underway margin_tb_10 '+(testDevice()==device_pad?" margin_lr_15":"")+'">'+
				'<div class="accessory_underway_content"><div class="accessory_icon padding_lr_10">'+
					'<span class="'+iconClass+' "></span>'+
					'</div>'+
                    '<div class="accessory_name"><p class="receipt_accessory_content" name="'+preName+'" suffix="'+resourceObj.extension+'">'+
                        '<label id="nameLabel">'+resourceObj.name+'</label>'+
                        (resourceObj.suffix==null?'':('<label>.'+resourceObj.suffix+'</label>'))+
                    '</p>'+
                    ((resourceObj.size==null||resourceObj.size==0)?'':'<p class="accessory_size">'+getSize(resourceObj.size)+'</p>')+
                '</div></div>'+
                '<p class="accessory_underway_bar" style="width:0;"></p>'+
            	'<span class="ico_phone_48 cancel_upload_48 model_info_close" onclick="delThisAtt(this)"></span>'+
            	'</div></li>';
	}
    var ele = $(html);
	attArea.append(ele);
	//TODO 协同V5 OA-84259【兼容ios9】iphone客户端，会议震荡回复，添加了多个附件和关联文档，部分附件不显示图标
	attArea.hide();
	setTimeout(function(){
		attArea.show();
	},600);
	//添加单击事件，单击后下载或者打开
	addAttOrRelateClick(ele, resourceObj, true);
    return ele;
}
function addLocalElePad(attArea, resourceObj, delFunc){
	var id = resourceObj.identifier;
	if(id==undefined||id==""){
		id = resourceObj.attID;
	}


	var fileName = resourceObj.name;
	var index = fileName.lastIndexOf(".");
	var preName = "";
	if(index>-1){
		preName = fileName.substr(0,index);
	}else{
		preName = fileName;
	}
	var iconClass = getAttOrRelateIconClass(resourceObj);
	var html = "";
	if(resourceObj.progress < 0){
		resourceObj.progress == 0;
	}else if(resourceObj.progress>100){
		resourceObj.progress = 100;
	}
    resourceObj.name = resourceObj.name.replace(/&/g,"&amp;");
    if(resourceObj.progress==100){
		html = '<li id="local'+id+'"><div class="accessory_finish margin_5 margin_b_10">'+
		'<div class="padding_lr_10">'+
			'<span class="'+iconClass+' margin_t_10"></span>'+
			' </div>'+
		    '<span class="ico_phone_48 cancel_upload_48 model_info_close" onclick="delThisAtt(this)"></span>'+
	        '<div class="accessory_name"><p class="receipt_accessory_content">'+
	        	fileName+
	        '</p>'+
	        ((resourceObj.size==null||resourceObj.size==0)?'':'<p class="accessory_size">'+getSize(resourceObj.size)+'</p>')+
	    '</div>'+
		'</div></li>';
	}else{
		html = '<li id="local'+resourceObj.attID+'"><div class="accessory_underway margin_5 margin_b_10">'+
				'<div class="accessory_underway_content"><div class="padding_lr_10">'+
					'<span class="'+iconClass+' margin_t_10"></span>'+
					'</div>'+
                    '<div class="accessory_name"><p class="receipt_accessory_content"">'+
                    '<label>'+fileName + (resourceObj.suffix==null?'':resourceObj.suffix)+'</label>'+
                    '</p>'+
                    ((resourceObj.size==null||resourceObj.size==0)?'':'<p class="accessory_size">'+getSize(resourceObj.size)+'</p>')+
                '</div></div>'+
                '<p class="accessory_underway_bar" style="width:0;"></p>'+
            	'<span class="ico_pad_28 cancel_upload_28 model_info_close" onclick="delThisAtt(this)"></span>'+
            	'</div></li>';
	}
    var ele = $(html);
	attArea.append(ele);
	//添加单击事件，单击后下载或者打开
	addAttOrRelateClick(ele, resourceObj, true);
    return ele;
}

function delThisAtt(ele){
	//阻止冒泡，避免同时出发打开事件
	//eventObj.stopPropagation();
	var ele = $(ele).closest("li");
	var id = ele.attr("id").substr(5);
	ele.remove();
	if(typeof delFunc == 'function'){
		delFunc(id);
	}else if(typeof deleteAtt == 'function'){
		deleteAtt(id);
	}
	deleteLocalRequest(id);
	ele = null;
}

function spcRequest(doType,param,callBack){
	$.ajax({
		url:depUrl
		,async:true
		,data:"param="+param
		,success:function(data, textStatus, jqXHR){
			data = decodeURIComponent(data).replace(/\+/g,"%20");
			data = decodeURIComponent(data);
			try{
				data = $.parseJSON(data);
				callBack(data.result);
			}catch(e){};
		}
		,error:function(jqXHR, textStatus, errorThrown){
			alert("请求失败！");
		}
	});
}
//判断移动端操作系统
function testOS(){
	if(os!=null){return os;}
	if(window.seeyonMobile==null||window.seeyonMobile==undefined){
		os = os_ios;
	}else{
		os = os_android;
	}
	return os;
}


function compPage(){
	$(".comp").compPage();
	$(".goHome").on("tap",function(){
		$.goHome();
	});
	$(".ui-icon-return").unbind().bind("tap",function(){
		return $.goback();
	});
}

$.goback = function(){
	//如果是iphone 直接a链接到上一页
		$(document).unbind("pagebeforechange");
		$.mobile.back();
		if(CurrentUser.clientType !== "iphone"){
			return false;
		}
};
$.returnMain = function(){
	addLocalRequest('0',null,null);
};
$.fn.compPage = function (){
	$(this).each(function(){
		var compParam = $(this).attr("comp");
		try{
			var compObj = eval("({"+compParam+"})");
			switch(compObj.type){
				case "localResource" : {
					localResourceFunction($(this),compObj);
					break;
				}
				case "attachment":{
					var attdata = $(this).attr("attdata");
					var attArray = eval("("+attdata+")");
					attachmentViewFunction($(this),attArray);
					break;
				}
			}
		}catch(e){alert(e.message);}
	});
};


function localResourceFunction(domObj, param){
	if(testDevice()==device_phone){
		localResourceFunctionPhone(domObj, param);
	}else if(testDevice()==device_pad){
		localResourceFunctionPad(domObj, param);
	}else if(testDevice()==device_pc){
		localResourceFunctionPhone(domObj, param);
	}
}

//附件定时器集合
var att_intervals = {};
/**
 * 添加附件本地请求
 * @param dotype
 * @param callback
 * @param param
 */
function addAttLocalRequest(dotype,callback,param){
	//获取本地请求生成的CallBackID
	var callBackId = addLocalRequest(dotype,callback);
	//根据CallBackId开启一个循环定时器并保存到一个全局变量中
	att_intervals[callBackId] = setInterval(function() {
	    var jsonStr = window.seeyonMobile.getAttProgress(callBackId);
		if(jsonStr!=null && jsonStr!=""){
		    var att = $.parseJSON(jsonStr);
		    var temp = _CallBackCache[callBackId].func;
	    	//android 回调函数 触发
		    temp(att);
	    	//如果进度等于100或者大于100并且附件的serverID不等于空，那么代表附件已经上传完成执行清除定时器操作
	    	if((att.progress == 100 || att.progress>100) && att.serverID!=null && att.serverID!=""){
				att.type=0;
				param.callBack(translateCmpAtt2V5Att(att));
		    	clearInterval(att_intervals[callBackId]);
			}
	    }
	}, 1);
}

//上传附件、拍照、录音、关联文档的功能
//添加附件按钮
function localResourceFunctionPhone(domObj, param){
	var html = '<div class="ui-grid-c accessory_upload_type receipt_accessory_center">';
	if(param.photo){
    	html += '<div class="ui-block-a margin_tb_10" id="photoBtn">'+
                '<a href="#" class="ui-btn ui-btn-inline ui-btn-icon-top ui-btn-icon-a ui-icon-photo">'+meeting_handle_i18N.takepic+'</a>'+
            	'</div>';
	}
	if(param.voice){
		html += '<div class="ui-block-b margin_tb_10" id="voiceBtn">'+
                '<a href="#" class="ui-btn ui-btn-inline ui-btn-icon-top ui-btn-icon-a ui-icon-voice">'+meeting_handle_i18N.voice+'</a>'+
            	'</div>';
	}
	if(param.relateDoc){
		html += '<div class="ui-block-c margin_tb_10" id="relateDocBtn">'+
                '<a href="#" data-transition="slide" class="ui-btn ui-btn-inline ui-btn-icon-top ui-btn-icon-a ui-icon-associate">'+meeting_handle_i18N.assDoc+'</a>'+
            	'</div>';
	}
	if(param.att){
		if(os==os_ios){
			html += '<div class="ui-block-d margin_tb_10" id="localFile">'+
                '<a href="#" class="ui-btn ui-btn-inline ui-btn-icon-top ui-btn-icon-a ui-icon-local_doc ui-btn-icon-lineheight2em">'+meeting_handle_i18N.localFile+'</a>'+
            	'</div><div class="ui-block-a margin_tb_10" id="localPhoto">'+
                '<a href="#" class="ui-btn ui-btn-inline ui-btn-icon-top ui-btn-icon-a ui-icon-pic ui-btn-icon-lineheight2em">'+meeting_handle_i18N.localImg+'</a>'+
            	'</div>';
		}else{
			html += '<div class="ui-block-d margin_tb_10" id="attBtn">'+
                '<a href="#" class="ui-btn ui-btn-inline ui-btn-icon-top ui-btn-icon-a ui-icon-local_doc ui-btn-icon-lineheight2em">'+meeting_handle_i18N.video+'</a>'+
            	'</div>';
		}
	}
	html += '</div>';
	var newObj = $(html);
	if(os==os_ios){
		newObj.find("#photoBtn a").click(function(){
			addLocalRequest("1",function(obj){
				obj.type=0;
	    		param.callBack(translateCmpAtt2V5Att(obj));
	    	});
		});
		newObj.find("#voiceBtn a").click(function(){
			addLocalRequest("2",function(obj){
				obj.type=0;
	    		param.callBack(translateCmpAtt2V5Att(obj));
	    	});
		});
		newObj.find("#localFile a").click(function(){
			addLocalRequest("11",function(obj){
				obj.type=0;
	    		param.callBack(translateCmpAtt2V5Att(obj));
	    	});
		});
		newObj.find("#localPhoto a").click(function(){
			addLocalRequest("3",function(obj){
				obj.type=0;
	    		param.callBack(translateCmpAtt2V5Att(obj));
	    	});
		});
	}else{
		newObj.find("#photoBtn a").click(function(){
			addAttLocalRequest("1",loadingLocalResource,param);
		});
		newObj.find("#voiceBtn a").click(function(){
			addAttLocalRequest("2",loadingLocalResource,param);
		});
		newObj.find("#attBtn a").click(function(){
            //TODO att
			addAttLocalRequest("3",loadingLocalResource,param);
		});
	}
	newObj.find("#relateDocBtn").click(function(e){
		var selected = [];
		e.preventDefault();
		addLocalRequest("6",function(obj){
			selected = obj;
			//在回调里面将选中的关联文档显示在页面上
			var attArea = $("div.uploadArea ul");
			var newObjArray = [];
			if(obj.length && obj.length>0){
				for(var i=0,len=obj.length; i<len; i++){
					var attDoc = obj[i];
					var mtype = 'km';
					var moduleType = attDoc.moduleType;
					if(moduleType==1){
						mtype = 'collaboration';
					}else if(moduleType==4){
						mtype = 'edoc';
					}else if(moduleType==6){
						mtype = 'meeting';
					}else if(moduleType==3){
						mtype = "km";
					}
					attDoc.type = 2;
					attDoc.mimeType = mtype;
					attDoc.serverID = attDoc.sourceID;
					if(testDevice()==device_pad){
						addLocalRelateDocPad(attArea, attDoc, param.delFunc);
					}else{
						addLocalRelateDocPhone(attArea, attDoc, param.delFunc);
					}
					newObjArray.push(translateCmpAtt2V5Att(attDoc));
				}
			}
			attArea = null;
    		param.callBack(newObjArray);
    	}, selected);
	});
	var attArea = $('<div class="code receipt_accessory uploadArea"><ul class="receipt_accessory_type padding_lr_10"></ul></div>');
	try{
		var attdata = domObj.attr("attdata");
		if(attdata!=null && $.trim(attdata)!=''){
			var attArray = eval("("+attdata+")");
			if(attArray.length && attArray.length>0){
				var attAreaTemp = attArea.find("ul");
				for(var i=0,len=attArray.length; i<len; i++){
					var obj = attArray[i];
                    console.log("=============>>.obj："+ $.toJSON(obj));
					var attDoc = translateV5Att2CmpAtt(obj);
					if(testDevice()==device_pad){
						addLocalAttHuiTianPad(attAreaTemp, attDoc,param.delFunc);
					}else{
						addLocalAttHuiTianPhone(attAreaTemp, attDoc,param.delFunc);
					}
				}
				attAreaTemp = null;
			}
		}
	}catch(e){alert(e);}
	domObj.after(attArea);
	domObj.replaceWith(newObj);
	attArea = null;
}
//TODO 手机和pad复用时，只有一个样式不同，手机端为margin_tb_10，ipad端应该为margin_tb_25
function localResourceFunctionPad(domObj, param){
	localResourceFunctionPhone(domObj, param);
}
function attachmentViewFunction(domObj, attArray){
	if(testDevice()==device_phone){
		attachmentViewFunctionPhone(domObj, attArray);
	}else if(testDevice()==device_pad){
		attachmentViewFunctionPad(domObj, attArray);
	}else if(testDevice()==device_pc){
		attachmentViewFunctionPad(domObj, attArray);
	}
}
//显示附件
function attachmentViewFunctionPhone(domObj, attArray){
	if(attArray.length && attArray.length>0){
		//多个
		var html = '<div class="code receipt_accessory"><ul class="receipt_accessory_type">';
		for(var i=0,len=attArray.length; i<len; i++){
			var att = attArray[i];
			var fileName = att.filename;
            var preName = "",ext="";
            if(att.extension != ""){
                var index = fileName.lastIndexOf(".");
                if(index>-1){
                    preName = fileName.substring(0,index);
                    ext =  fileName.substring(index+1);
                }else{
                    preName = fileName;
                }
            }else{
                preName = fileName;
            }
            preName = preName.replace(/&/g,"&amp;");
			var iconClass = getOldAttOrRelateIconClass(att);
			html += '<li><div class="accessory_finish margin_tb_10">'
	            +'<div class="accessory_icon padding_lr_10">'
	            +'    <span class="'+iconClass+'"></span>'
	            +'</div>'
	            +'<div class="accessory_name">'
	            +'    <p class="receipt_accessory_content">'
	            +'        <label>'+preName+'</label>'
				+'        <label>'+(att.extension==""?"":"."+att.extension)+'</label>'
	            +'    </p>'
	            +'    <p class="accessory_size">'+getSize(att.size)+'</p>'
	            +'</div>';
	        if(att.type==0){
	        	html += '<div class="accessory_icon padding_lr_10">'
                	+'	<span class="ico_phone_48 accessory_download_48"></span>'
                	+'</div>'
	        }
	       html += '</div></li>';
		}
		html += '</ul></div>';
		var newObj = $(html);
		//给每一个附件或者关联绑定事件，可以下载或者查看
		newObj.find("li").each(function(index){
			var flag = false;
			var dom = $(this).find("div.accessory_download_icon");
			if(dom.size()<=0){
				flag = true;
			}
			var att = attArray[index];
			addAttOrRelateClickView($(this), att);
		});
		domObj.replaceWith(newObj);
		newObj = null;
	}
}

function attachmentViewFunctionPad(domObj, attArray){
	if(attArray.length && attArray.length>0){
		//多个
		var html = '<div class="code receipt_accessory"><ul class="details_accessory padding_10 clearFlow">';
		for(var i=0,len=attArray.length; i<len; i++){
			var att = attArray[i];
			var fileName = att.filename;
			var index = fileName.lastIndexOf(".");
			var preName = "",ext="";
			if(att.extension != ""){
				var index = fileName.lastIndexOf(".");
				if(index>-1){
					preName = fileName.substring(0,index);
					ext =  fileName.substring(index+1);
				}else{
					preName = fileName;
				}
			}else{
				preName = fileName;
			}
            preName = preName.replace(/&/g,"&amp;");
			var iconClass = getOldAttOrRelateIconClass(att);
			html += '<li>'
	                    +'<div class="accessory_finish margin_5 margin_b_10">'
	                        +'<div class="padding_lr_10">'
	                            +'<span class="'+iconClass+' margin_t_10"></span>'
	                        +'</div>'
	                        +'<div class="accessory_name">'
	                            +'<p class="receipt_accessory_content">'
	                            +preName+(att.extension==""?"":"."+att.extension)
	                            +'</p>'
	                            +'<p class="accessory_size">'+getSize(att.size)+'</p>'
	                        +'</div>';
	        if(att.type==0){
				html += '<div class="accessory_download_icon padding_lr_10">'
			                +'	<span class="ico40 accessory_download_40"></span>'
			                +'</div>';
	        }
	        html += '</div></li>';
		}
		html += '</ul></div>';
		var newObj = $(html);
		domObj.replaceWith(newObj);
		newObj.find("li").each(function(index){
			var flag = false;
			var dom = $(this).find("div.accessory_download_icon");
			if(dom.size()<=0){
				flag = true;
			}
			var att = attArray[index];
			addAttOrRelateClickView($(this), att, flag);
		});
		newObj = null;
	}
}
//给显示的附件或者关联文档添加事件，以供查看或者下载
function addAttOrRelateClickView(dom, att, flag){
	var newAtt = translateV5Att2CmpAtt(att);
	addAttOrRelateClick(dom, newAtt, flag);
}
//给上传之后的附件或者关联文档添加事件，以供查看或下载
function addAttOrRelateClick(dom, att, flag){
	if(flag){
		dom.find("div.accessory_name").unbind("tap").bind("tap",function(){
			if(att.progress!=null){//表示是附件
				addLocalRequest(5, null, [att]);
			}else if(att.reference!=null){//表示是关联文档
				addLocalRequest(7, null, [att]);
			}
		});
	}else{
		var temp = false;
		dom.unbind("tap").bind("tap",function(){
			if(temp==false){//间隔时间太短，表示是taphold事件触发的，不去执行
				if(att.progress!=null){//表示是附件
					addLocalRequest(5, null, [att]);
				}else if(att.reference!=null){//表示是关联文档
					addLocalRequest(7, null, [att]);
				}
			}
			temp = false;
		});
		if(att.progress!=null || (att.reference!=null && att.moduleType==3)){
			dom.unbind("taphold").bind("taphold",function(){//显示查看或者下载界面
				temp = true;
				if(att.progress!=null){//表示是附件
					addLocalRequest(9, null, [att]);
				}else if(att.reference!=null){//表示是关联文档
					addLocalRequest(10, null, [att]);
				}
			});
		}
	}
	dom = null;
}
function translateCmpAtt2V5Att(att){
	var result = {};
	if(att.type==2||att.reference!=null){
		//2表示是关联文档
		var mtype = "";
		switch(att.moduleType){
			case 1:{
				mtype='collaboration';
				break;
			}
			case 3:{
				mtype='km';
				break;
			}
			case 4:{
				mtype='edoc';
				break;
			}
			case 6:{
				mtype='meeting';
				break;
			}
			default:{
				mtype = 'km';
			}
		}
		result.id = att.identifier;
		result.category = att.category;
		result.fileUrl = att.docID;
		result.filename = att.name;
		result.mimeType = att.mimeType;
		result.createdate = att.createDate;
		result.reference = att.reference;
		result.subReference = att.subReference;
		result.description = att.sourceID;
		result.v = att.vCode;
		result.mimeType = mtype;
		result.attID =att.attID;
        if(result.fileUrl == -1) result.fileUrl = att.sourceID;
	}else if(att.type==0||att.contentType!=null){
		//0表示是附件
		result.fileUrl = att.serverID;
		result.id =att.attID;
		result.attID =att.attID;
		result.filename = att.name;
		result.extension = att.suffix;
		result.mimeType = att.mimeType;
		result.createdate = att.createDate;
		result.description = att.serverID;
		result.v = att.vCode;
	}
	result.type = att.type;
	result.size = att.size;
	return result;
}
//将V5的附件对象或关联文档对象转换成CMP的附件或关联文档对象。
function translateV5Att2CmpAtt(att){
	var result = {};
	if(att.type==2){
		//2表示是关联文档
		var mtype = att.mimeType;
		var moduleType = 3;
		if(mtype=='collaboration'){
			moduleType = 1;
		}else if(mtype=='edoc'){
			moduleType = 4;
		}else if(mtype=='meeting'){
			moduleType = 6;
		}
		result.identifier = att.id;
		result.category = att.category;
		result.docID = att.fileUrl;
		result.name = att.filename;
		result.mimeType = att.mimeType;
		result.createDate = att.createdate;
		result.reference = att.reference;
		result.subReference = att.subReference;
		result.sourceID = att.description;
		result.serverID = att.description;
		result.vCode = att.v;
		result.moduleType = moduleType;
	}else if(att.type==0){
		//0表示是附件
		result.attID = att.id;
		result.progress = 100;
		result.docID = att.fileUrl;
		result.sourceID = att.fileUrl;
		result.serverID =att.fileUrl;
		result.name = att.filename;
		result.suffix = att.extension;
		result.mimeType = att.mimeType;
		result.createDate = att.createdate;
		result.attType = 2;//表示是服务器上的附件
		result.contentType = att.contentType ? att.contentType : 0;//表示是附件
		result.vCode = att.v;
	}
	result.type = att.type;
	result.size = att.size;
	return result;
}
//
/**
 * 转场之前对目标页面进行操作后并转场。
 * 		思路：1.为下一面绑定pageinit事件，在下一页面显示时初始化页面UI
 * 			   2.要跳转到下一页面，JQM会在创建下一页面之后执行本页面的pagebeforechange方法，此时调用下一页面请求数据等初始化方法
 *
 * @param pageUrl   目标页面的URL
 * @param sectionId   目标页面sectionID
 * @param func 处理目标页面的方法 参数(目标section的Jquery对象，转场data，obj对象)
 */
function setNextPageData(pageUrl,sectionId,func){
	$(document).undelegate("#"+sectionId, "pageshow").delegate("#"+sectionId, "pageshow", function() {
		//初始化页面
		compPage();
		if(typeof(pageInit) == "function" ){
			pageInit();
		}
	});

	/**
	 * pagebeforechange 每次页面切换都会触发.貌似不能绑定在某一个页面上，只能绑定document
	 *
	 * **/
	$(document).unbind("pagebeforechange").bind("pagebeforechange", function(e,data){
		if (typeof data.toPage != "string") {
			func(e,data);
		}
	});
	$.mobile.changePage(pageUrl, {
		transition: "slidefade"
		//,reloadPage:true
		});

}


/**
 * 显示一个加载器
 * @param text
 * @param text_visible
 * @param theme
 * @param text_only
 * @param html_content
 */
function showLoader(text,text_visible,theme,text_only,html_content) {
        $.mobile.loading('show', {
            text: text,                  //加载器中显示的文字
            textVisible: text_visible,  //是否显示文字
            theme: theme,                //加载器主题样式a-b
            textonly: text_only,        //是否只显示文字
            html: html_content           //要显示的html内容，如图片等
        });
}

/**
 * 隐藏加载器jQuery Mobile
 */
function hideLoader()
{
    //隐藏加载器
    $.mobile.loading('hide');
}

/**
 * 显示提示信息，1S后关闭
 * @param text
 * @param theme
 */
$.showMsg = function(text,theme){
	showLoader(text,true,theme,true,"");
	setTimeout(hideLoader,1000);
};

$.goHome = function(){
	$.showMsg("goHome");
	addLocalRequest(100);
};



/****************************** 以下为修改部分 ******************************/



/**
 * 目标WebView设置
 */
var activitysNames = {
		BASE_PACKAGE : "",
		MEETING_DETAILS:{activityName:"",titleText:MEETING_DETAILS_Text},
		MEETING_SUMMARY:{activityName:"",titleText:MEETING_SUMMARY_Text},
		MEETING_RETURN:{activityName:"",titleText:MEETING_RETURN_Text},
		MEETING_COMMENT:{activityName:"",titleText:MEETING_COMMENT_Text},
		MEETING_ATTEND_USERS:{activityName:"",titleText:MEETING_ATTEND_USERS_Text},
		MEETING_USERS_NAME:{activityName:"",titleText:MEETING_USERS_NAME_Text},
		REPROT_LIST:{activityName:"",titleText:"报表分析"},
		REPORT_DETAILS:{activityName:"",titleText:"报表详情"}
};


/**
 * JS和native代码通信指令代码
 */
var MJSDotype = {
		CHANGE_VIEW  :1001,//切换页面
		BACK_VIEW    :1002,//返回页面
		SET_BTUTTONS :1003,//设置按钮
		OPEN_LOADING :1004,//打开Loading动画
		CLOSE_LOADING:1005,//关闭Loading动画
		BACK_MAIN_PAGE:1006,//点击头部返回主页
		OPEN_MESSAGE_VIEW:1007//ios打开消息界面
};


/**
 * IOS JS与native代码通信参数组装以及发出指令
 * @param MJSCommandNumber
 * @param paramObject
 */
function MJS_IOS_CommandParam(MJSCommandNumber,paramObject,callBack){
	var callbackId = "cbc"+_CallBackIndex;
	paramObject.callbackId = callbackId;
	paramObject.requestType = 0;//0表示本地请求，1表示远程请求
	_CallBackCache[callbackId] = {
		func : callBack
		,requestType : paramObject.requestType
	};
	_CallBackIndex++;
	var jsonObject = {doType:MJSCommandNumber,param:paramObject};
	window.location.href = "MJSCommand?" + encodeURIComponent(JSON.stringify(jsonObject));
}

/**
 * 页面切换
 * @param url
 * @param activityName
 * @param isLocal
 */
function changeWebView(base,url,activityObj,isLocal){
	if(isDevMode()){
		 window.location.href=url;
	}else{
		if(testOS()==os_android){
			//第三个参数是一个json作为预留参数，以后可以扩展
			window.seeyonMobile.changeWebView(base+url,activitysNames.BASE_PACKAGE + activityObj.activityName,activityObj.titleText,isLocal);
		}else if(testOS()==os_ios){
			var jsonObject = {url:base+url,activityObj:activityObj,isLocal:isLocal};
			MJS_IOS_CommandParam(MJSDotype.CHANGE_VIEW, jsonObject,function(){});
		}
	}
}




/**
 * 返回WebView
 */
function backWebView(){
	if(testOS()==os_android){
		//第三个参数是一个json作为预留参数，以后可以扩展
		window.seeyonMobile.backWebView();
	}else if(testOS()==os_ios){
		var jsonObject = {};
		MJS_IOS_CommandParam(MJSDotype.BACK_VIEW, jsonObject,function(){});
	}
}
/**
 * 设置Button工具对象
 */
var ButtonSetUtil = {
	getButton : function(type,point,text,callBackName){
		return {type:type,point:point,text:text,callBackName:callBackName};
	},
	getButtonStr : function(btnObjArray){
		return JSON.stringify(btnObjArray);
	}
};


/**
 * 设置TilteBar的按钮
 * @param btnParam 数组
 */
function setTitleBarBtns(btnParams,callBack){
	if(testOS()==os_android){
		//第三个参数是一个json作为预留参数，以后可以扩展
		window.seeyonMobile.setTitleBarByTextBtns(JSON.stringify(btnParams));
		callBack();
	}else if(testOS()==os_ios){
		var jsonObject = {btnArray:btnParams};
		MJS_IOS_CommandParam(MJSDotype.SET_BTUTTONS, jsonObject,callBack);
	}else{
		callBack();
	}
}
/**
 * 设置TitleBar显示文本
 * @param titleText
 */
function setTitleText(titleText){
	window.seeyonMobile.setTitleText(titleText);
}


/**
 * 显示Loading加载界面
 */
function showLoading(callBack){
	if(testOS()==os_android){
		//第三个参数是一个json作为预留参数，以后可以扩展
		window.seeyonMobile.openLoading();
		callBack();
	}else if(testOS()==os_ios){
		var jsonObject = {};
		MJS_IOS_CommandParam(MJSDotype.OPEN_LOADING, jsonObject,callBack);
	}else{
		callBack();
	}
}

/**
 * 隐藏Loading加载界面
 */
function hideLoading(callBack){
	if(testOS()==os_android){
		//第三个参数是一个json作为预留参数，以后可以扩展
		window.seeyonMobile.colseLoading();
		callBack();
	}else if(testOS()==os_ios){
		var jsonObject = {};
		MJS_IOS_CommandParam(MJSDotype.CLOSE_LOADING, jsonObject,callBack);
	}else{
		callBack();
	}
}

/**
 * 页面之间传对象参数Key
 */
var PAGE_PARAM_KEYS = {
	MEETING_RETURN : "metting_return_param",
	MEETING_ATTEND_USERS : "meeting_attend_users",
	MYREPLYOBJ:"myReplyObj",
	REPLYRETOBJ:"replyRetObj",
	SUMMARYSCOPE:"summaryScope"
};

/**
 * 设置页面传参
 * @param key
 * @param value
 */
function setPageParam(key,value){
	window.localStorage.setItem(key, value);
}

/**
 * 获取页面参数
 * @param key
 * @returns
 */
function getPageParam(key){
	return window.localStorage.getItem(key);
}

/**
 * 清除所有页面参数
 */
function clearPageParam() {
	window.localStorage.clear();
}

/**
 * 移除某个页面参数
 * @param key
 */
function removePageParam(key){
	window.localStorage.removeItem(key);
}

/**
 * 获取地址栏参数
 * @param name
 * @returns {String}
 */
function getParam (name){
	var sHref = window.location.href.toString();
	var args = sHref.split("?");
	var retval = "";
	if (args[0] == sHref){/* 参数为空 */
		return retval;
		/* 无需做任何处理 */
	}
	var str = args[1];
	args = str.split("&");
	for (var i = 0; i < args.length; i++){
		str = args[i];
		var arg = str.split("=");
		if (arg.length <= 1) continue;
		if (arg[0] == name) retval = arg[1];
	}
	return retval;
}


/**
 * 重写Alert（设置Title）
 * @param title
 * @param messsage
 */
function M1Alert(title,messsage){
	alert(title + "CMPWebApp" + messsage);
}

/**
 * 重写Confirm(设置Title)
 * @param title
 * @param message
 * @returns
 */
function M1Confirm(title,message){
	return confirm(title + "CMPWebApp" + message);
}

/**
 * 点击Ttile 返回首页
 */
function backMainPage(){
	if(testOS()==os_android){
		window.seeyonMobile.backMainPage();
	}else if(testOS()==os_ios){//doType:1006
		MJS_IOS_CommandParam(1006,{},function(){});
	}
}

function messageBtnAction(){
	if(testOS()==os_android){
		window.seeyonMobile.messageBtnAction();
	}else if(testOS()==os_ios){//doType:1006
		MJS_IOS_CommandParam(1007,{},function(){});
	}else{
		console.log("messageBtnAction");
	}
}


function convertImgUrlV52CMP (V5Url,jsessionID){
    var args = V5Url.split("?");
    if (args[0] == V5Url){/* 参数为空 */
        return V5Url;
        /* 无需做任何处理 */
    }
    var str = args[1];
    args = str.split("&");

    var _args = {};
    for (var i = 0; i < args.length; i++){
        str = args[i];
        var arg = str.split("=");
        if(arg.length <= 1){
            _args[arg[0]] = "";
        }else{
            _args[arg[0]] = arg[1];
        }
    }
    var CMPUrl = "";
    if(jsessionID){
        var jsessionid = jsessionID.split(";")[0].split("=")[1];
        CMPUrl = "/seeyon/servlet/SeeyonMobileBrokerServlet;jsessionid="+jsessionid+"?serviceProcess=A6A8_File&method=download";
    }else{
        CMPUrl = "/seeyon/servlet/SeeyonMobileBrokerServlet?serviceProcess=A6A8_File&method=download";
    }


    CMPUrl += "&fileId=" + _args["fileId"];
    CMPUrl += "&createDate=" + _args["createDate"];
    CMPUrl += "&type=" + 2;

    return CMPUrl;
};

/**
 * 获取附件和关联文档前面的图标class
 * @param att
 * @returns {String}
 */

function getOldAttOrRelateIconClass(att){
	att = translateV5Att2CmpAtt(att);
	return getAttOrRelateIconClass(att);
}

function getAttOrRelateIconClass(att){
	var result = '', result2 = '';
	if(testDevice()==device_phone){//手机端
		result = 'doc_unknown_48';
		result2 = 'ico_phone_48';
		if(att!=null){
			if(att.type==2||att.reference!=null){//关联文档
				var extension = '';
				switch(att.moduleType){
					case 1:{//协同
						result = 'collaborative_48';
						break;
					}
					case 3:{//文档
						var index = att.name.lastIndexOf(".");
						if(index>-1){
							extension = att.name.substr(index+1);
						}else{
                            result = "doc_ass_phone_48";
                        }
						break;
					}
					case 4:{//公文
						result = 'bumf_48';
						break;
					}
					case 6:{//会议
						result = 'meeting_48';
						break;
					}
				}
			}else if(att.type==0||att.contentType!=null){//附件
				extension = att.extension||att.suffix;
				if(extension==null||extension==""){
					var index = att.name.lastIndexOf(".");
					if(index>-1){
						extension = att.name.substr(index+1);
					}
				}
			}
			switch(extension){
				case 'doc':{
					result = 'word_suffix_doc_48';
					break;
				}
				case 'docx':{
					result = 'word_suffix_docx_48';
					break;
				}
				case 'xls':{
					result = 'excel_suffix_xls_48';
					break;
				}
				case 'xlsx':{
					result = 'excel_suffix_xlsx_48';
					break;
				}
				case 'ppt':{
					result = 'ppt_suffix_ppt_48';
					break;
				}
				case 'pptx':{
					result = 'ppt_suffix_pptx_48';
					break;
				}
				case 'vsd':{
					result = 'visio_suffix_vsd_48';
					break;
				}
				case 'vsdx':{
					result = 'visio_suffix_vsdx_48';
					break;
				}
				case 'jpg':{
					result = 'pic_suffix_jpg_48';
					break;
				}
				case 'png':{
					result = 'pic_suffix_png_48';
					break;
				}
				case 'bmp':{
					result = 'pic_suffix_bmp_48';
					break;
				}
				case 'gif':{
					result = 'pic_suffix_gif_48';
					break;
				}
				case 'amr':{
					result = 'audio_amr_48';
					break;
				}
				case 'caf':{
					result = 'audio_caf_48';
					break;
				}
				case 'mp3':{
					result = 'mp3_48';
					break;
				}
				case 'mp4':{
					result = 'mp4_48';
					break;
				}
				case 'wps':{
					result = 'wps_48';
					break;
				}
				case 'et':{
					result = 'et_48';
					break;
				}
				case 'txt':{
					result = 'txt_48';
					break;
				}
				case 'htm':{
					result = 'htm_48';
					break;
				}
				case 'html':{
					result = 'html_48';
					break;
				}
				case 'rar':{
					result = 'rar_48';
					break;
				}
				case 'zip':{
					result = 'zip_48';
					break;
				}
				case 'tif':{
					result = 'tif_48';
					break;
				}
				case 'pdf':{
					result = 'pdf_48';
					break;
				}
			}
		}
	}else{//pad和桌面端
		result2 = 'ico35';
		result = 'doc_unknown_35';
		if(att!=null){
			if(att.type==2||att.reference!=null){//关联文档
				var extension = '';
				switch(att.moduleType){
					case 1:{//协同
						result = 'collaborative_35';
						break;
					}
					case 3:{//文档
						var index = att.name.lastIndexOf(".");
						if(index>-1){
							extension = att.name.substr(index+1);
						}else{
                            result = "doc_ass_pad_35";
                        }
						break;
					}
					case 4:{//公文
						result = 'bumf_35';
						break;
					}
					case 6:{//会议
						result = 'meeting_35';
						break;
					}
				}
			}else if(att.type==0||att.contentType!=null){//附件
				extension = att.extension||att.suffix;
				if(extension==null||extension==""){
					var index = att.name.lastIndexOf(".");
					if(index>-1){
						extension = att.name.substr(index+1);
					}
				}
			}
			switch(extension){
				case 'doc':{
					result = 'word_suffix_doc_35';
					break;
				}
				case 'docx':{
					result = 'word_suffix_docx_35';
					break;
				}
				case 'xls':{
					result = 'excel_suffix_xls_35';
					break;
				}
				case 'xlsx':{
					result = 'excel_suffix_xlsx_35';
					break;
				}
				case 'ppt':{
					result = 'ppt_suffix_ppt_35';
					break;
				}
				case 'pptx':{
					result = 'ppt_suffix_pptx_35';
					break;
				}
				case 'vsd':{
					result = 'visio_suffix_vsd_35';
					break;
				}
				case 'vsdx':{
					result = 'visio_suffix_vsdx_35';
					break;
				}
				case 'jpg':{
					result = 'pic_suffix_jpg_35';
					break;
				}
				case 'png':{
					result = 'pic_suffix_png_35';
					break;
				}
				case 'bmp':{
					result = 'pic_suffix_bmp_35';
					break;
				}
				case 'gif':{
					result = 'pic_suffix_gif_35';
					break;
				}
				case 'amr':{
					result = 'audio_amr_35';
					break;
				}
				case 'caf':{
					result = 'audio_caf_35';
					break;
				}
				case 'mp3':{
					result = 'mp3_35';
					break;
				}
				case 'mp4':{
					result = 'mp4_35';
					break;
				}
				case 'wps':{
					result = 'wps_35';
					break;
				}
				case 'et':{
					result = 'et_35';
					break;
				}
				case 'txt':{
					result = 'txt_35';
					break;
				}
				case 'htm':{
					result = 'htm_35';
					break;
				}
				case 'html':{
					result = 'html_35';
					break;
				}
				case 'rar':{
					result = 'rar_35';
					break;
				}
				case 'zip':{
					result = 'zip_35';
					break;
				}
				case 'tif':{
					result = 'tif_35';
					break;
				}
				case 'pdf':{
					result = 'pdf_35';
					break;
				}
			}
		}
	}
	return result2+' '+result+" ";
}

function dealContent(content){
	if(content!=null&&content!=""){
		//文件下载路径修改
		//content = content.replace(/seeyon\/fileUpload.do/g,"seeyon/seeyon/fileUpload.do");
	}
	return content;
}

function openEditorAssociate(id,mimeType,description,reference,category,createDate,filename,v){

	var obj = {};
	obj.id=id;
	obj.mimeType=mimeType;
	obj.description=description;
	obj.reference=reference;
	obj.category=category;
	obj.createDate=createDate;
	obj.filename=filename;
	obj.v=v;
	addLocalRequest(7, null, [translateV5Att2CmpAtt(obj)]);
}