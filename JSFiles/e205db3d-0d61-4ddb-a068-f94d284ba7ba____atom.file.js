/*  2012-02-19 file        版本1.0beta
 **  Atom  file页面底层部分             联系邮箱：xuchen011@sina.com
 **  制作人：徐晨(cssghost)
 */

(function($) {
	$.fn.extend({
		/******************************************************************
		 *	atom file system obj.atomFile()
		 *  @param [data]	[ uid : user id, did : file id, url : storage url ]
		 *	@param [type]	[ full : all files | directory : file directory | share : share directory ]
		 * 	@param [isDrag]	is drag drop [ true | false ]	
		 *	@param [box]	file wrap class	
		 *	@param [directory]	directory class	
		 *	@param [callback]	callback function
		 ******************************************************************/
		"atomFile": function(options){
			options = $.extend({
				data : { uid : "", did : "", url : ""},
				type : "full",
				isDrag : true,
				box : "#fileMain",
				directory :"folder",
				callBack : null
			}, options);
			return this.each(function(){
				//alert("js-ok");
				//console.log(options.data.uid, options.data.did, options.data.url);
				var $this = $(this);
				var $div = $this.children("li[bind=off]");
				var $drag = $this.children("li[bind=off][drag=true]");
				var $box = $(options.box);
				var $hidden = { file : $("#hiddenFile"), directory : $("#hiddenDirectory"), position : $("#hiddenPosition")};
				//元素属性[ w : 操作元素位移时的宽 | h : 操作元素位移时的高 | inlineW : 未移动元素的宽 | inlineH : 未移动元素的高 | inlineHW : 未移动元素半宽 | inlineHH : 未移动元素半高 ]
				var attribute = { width : $div.width(), height : $div.children("section").height(), inlineW : 0, inilneH : 0, inlineHW : $div.width() / 2, inlineHH : $div.children("section").height() / 2 };
				//元素偏移量[ x : 原始x偏移值 | y : 原始y偏移值 | moveX : 选中元素的left值 | moveY : 选中元素的top值  ]
				var range = { x : 0, y : 0, moveX : 0 , moveY : 0 };
				//元素位置[ x : 原始left值 | y : 原始top值 | inlineX : 未移动元素的left值 | inlineY : 未移动元素的top值 ]
				var position = { x : 0, y : 0, inlineX : 0, inlineY :0 };
				//move return position
				var movePosition = { left : 0, top : 0 };
				var aBlock = new Array();
				var bMove = bTrigger = bDrop = false;
				var oShow;
				var sUrl = sData = "";
				var nCol = 0;
				var result = { contact : "", obj : ""};
				var key = "";
				var supportsTouches = ("createTouch" in document),//判断是否支持触摸
				    startEvent = supportsTouches ? "touchstart" : "mousedown",//支持触摸式使用相应的事件替代
				    moveEvent = supportsTouches ? "touchmove" : "mousemove",
				    endEvent = supportsTouches ? "touchend" : "mouseup"
				//updata position
				//console.log(aBlock);
				$div.attr("bind", "on");
				//close file information
				$("#closeFileInformation").off("click");
				$("#closeFileInformation").on("click" ,function(){
					$("#fileInformation").atomFly({ 
						type : "fadeOut" ,
						callBack : function(){
							$("#fileInformation").children().children("header").children("p").text("");
							$("#fileInformation").children().children(".fileOperations").children(".downloadFile").children("a").attr({href: "", title : ""});
							$("#fileInformation").children().children(".fileOperations").children(".downloadFile").children("p").text("");
							$("#fileInformation").children().children(".fileSareFrame").children("header").text("");
							clearTimeout($setcommentList); 
							emptyHidden([$hidden.file]);
							getFileUpdates();
						}
					});
				});
				//double click to open the folder or file
				$div.children("section").on("dblclick", function(event){
					event.stopPropagation();
					event.preventDefault();
					$(this).next("aside").children("label.fileNameInfo").click();
				});
				//$(document).off("keydown");
				$(document).on("keydown",function(event){
					var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
					//console.log(keyCode);
					switch(keyCode){
						case 16:
						key = "shift";
						break;
						case 17:
						key = "ctrl";
						break;
						default:
						break;
					}
					//console.log(key);
				});
				//$(document).off("keyup");
				$(document).on("keyup",function(event){
						key = "";
				});
				$div.children("section").on("click", function(event){
					event.stopPropagation();
					var oSelect = $(this).parent();
					//event.preventDefault();
					//console.log(key);
					switch(key){
						case "ctrl":
							oSelect.addClass("selected");
							//$("input.fileNameText:visible").blur();
						break;
						case "shift":
							//console.log(oSelect.prevAll("li.selected"));
							if (oSelect.prevAll("li.selected").length != 0){
								oSelect.prevUntil(oSelect.prevAll("li.selected").first()).addClass("selected");
								oSelect.addClass("selected");
							}
							else if (oSelect.nextAll("li.selected").length != 0) {
								oSelect.nextUntil(oSelect.nextAll("li.selected").last()).addClass("selected");
								oSelect.addClass("selected");
							}else{
								oSelect.addClass("selected");
							}
							//$("input.fileNameText:visible").blur();
							//oSelect
						break;
						default:
							$("#fileMain").find(".selected").removeClass("selected");
							oSelect.addClass("selected")
							//$("input.fileNameText:visible").blur();
						break;
					}
					if ($("#fileList").children(".selected").length == 1 ) {
						$("#operationList").children(".shareDisabled").attr("class", "share");
						$("#operationList").children(".downloadDisabled").attr("class", "download");
						$("#operationList").children(".renameDisabled").attr("class", "rename");
						$("#operationList").children(".deleteDisabled").attr("class", "delete");
						$("#operationList").children(".rename").show();
					}
					if ($("#fileList").children(".selected").length > 1 ) {
						$("#operationList").children(".rename").hide();
						$("#operationList").children(".shareDisabled").attr("class", "share");
						$("#operationList").children(".downloadDisabled").attr("class", "download");
						$("#operationList").children(".renameDisabled").attr("class", "rename");
						$("#operationList").children(".deleteDisabled").attr("class", "delete");
					}
				});
				//darg drop is true
				if (options.isDrag){
					$drag.on(startEvent, function(e){
						e.preventDefault();
						var $move = $(this);
						if($move.hasClass("folder")){return false;}
						//console.log(key);
						if (!$("#fileList").children("li").is(":animated") && key == ""){
							position.x = movePosition.left = $move.position().left;
							position.y = movePosition.top = $move.position().top;
							range.x = e.pageX - position.x;
							range.y = e.pageY - position.y;
							$move.clone().attr("drag", "flase").addClass("siteBlock").insertBefore($move);
							$move.css({ "left" : position.x, "top" : position.y, "height" : attribute.height, "zIndex" : 10}).addClass("moveBlock").siblings("li").addClass("inlineBlock");
							//bind $move move funciton
							$(document).on(moveEvent, function(eMove){
								range.moveX = eMove.pageX - range.x;
								range.moveY = eMove.pageY - range.y;
								$move.css({left : range.moveX, top : range.moveY});
								switch (options.type){
									case "full":
									//console.log(range.moveX);
										bTrigger = isContact($("#hiddenPosition").data("position"), range.moveX, range.moveY, result);
										//isContact($("#hiddenPosition").data("position"), range.moveX, range.moveY);
										if(bTrigger.contact && bTrigger.obj.hasClass("inlineBlock")){ bTrigger.obj.addClass("folderDash"); }
										else { $(".folderDash").removeClass("folderDash"); }
									break;
									case "directory":
										var inBox = isVisible($(".folderBox"), $move);
										if(!inBox){ $move.addClass("moveOut"); }
										else{ $move.removeClass("moveOut"); }
									break;
									default:
									break;
								}
							});
							//bind #move move finish function
							$(document).on(endEvent, function(eUp){
								$(document).off(moveEvent);
								if(e.pageX == eUp.pageX && e.pageY == eUp.pageY){
									//alert(1);
									$(".siteBlock").remove();
									$move.removeClass("moveBlock").removeAttr("style").siblings().removeClass("inlineBlock");
								}else{
									$move.removeClass("selected");
									switch (options.type){
										case "full" :
											if($(".folderDash").length == 1 ){
												var oTempDiv = $(".folderDash");
												if (oTempDiv.attr("drag") != "true"){
													//sData = { fid : oMove.attr("fileID"), tpdid : oTempDiv.attr("folderID") };
													$(".siteBlock").remove();
													$move.removeClass("moveBlock").removeAttr("style");
													//移动文件
													$("body").atomPop({
														headerText : "Move File",
														content : "Are you sure to move the file ?",
														done : function(){
															//alert("js-ok");
															fileOperations({uid : options.data.uid, fid : $move.attr("fileID"), tpdid : oTempDiv.attr("folderID")}, options.data.url, "moveFile", { remove : $move, temp : oTempDiv});
														},
														cancel : function(){
															$("#fileList").children("li.inlineBlock").removeClass("inlineBlock");
														}
													});
													
												}
												if(oTempDiv.attr("drag") == "true"){
													//sData = {uid : options.uID, fid_first : oMove.attr("fileID"), fid_second : oTempDiv.attr("fileID") };
													$(".siteBlock").remove();
													$move.removeClass("moveBlock").removeAttr("style");
													oTempDiv.removeClass("folderDash");
													//合并文件
													$("body").atomPop({
														headerText : "Combine Files",
														content : "Are you sure want to Combine the files ?",
														done : function(){
															//alert("js-ok");
															fileOperations({uid : options.data.uid, fid_first : $move.attr("fileID"), fid_second : oTempDiv.attr("fileID")}, options.data.url, "combineFiles", { remove : $move, temp : oTempDiv});
														},
														cancel : function(){
															$("#fileList").children("li.inlineBlock").removeClass("inlineBlock");
														}
													});
												}							
											}
											else{
												$move.animate({
													left : movePosition.left + "px",
													top : movePosition.top + "px"
												},"400", function(){
													$(".siteBlock").remove();
													$move.removeClass("moveBlock").removeAttr("style").siblings().removeClass("inlineBlock");
												});
												
											}
										break;
										case "directory":
											if ($move.hasClass("moveOut")){
												//move file out to directory
												$(".siteBlock").remove();
												$move.removeClass("moveBlock").removeAttr("style");
												$("body").atomPop({
													headerText : "Moveout Files",
													content : "Are you sure want to moveout the file of the folder ?",
													done : function(){
														//alert("js-ok");
														fileOperations( {uid : options.data.uid, fid : $move.attr("fileID"), tpdid : 0}, options.data.url, "moveoutFile", { remove : $move });
													},
													cancel : function(){
														$("#fileList").children("li.inlineBlock").removeClass("inlineBlock");
													}
												});
											}
											else{
												$move.animate({
													left : movePosition.left + "px",
													top : movePosition.top + "px"
												},"400", function(){
													$(".siteBlock").remove();
													$move.removeClass("moveBlock").removeAttr("style").siblings().removeClass("inlineBlock");
												});
											}
										break; 
										default :
										break;
									}
								}
								$(document).off(endEvent);
							});
						}
					});
				}
				//drag drop is flase
				else {
//					$div.children("section").on("click", function(event){
//						event.stopPropagation();
//						event.preventDefault();
//						var oFolder = $(this).parent();
//						oFolder.addClass("selected").siblings("li").removeClass("selected");
//					});
				}
				//rename
				$div.children("aside").mousedown(function(event){
					event.stopPropagation();	
				});
				$div.children("aside").children("label.fileNameText").mousedown(function(event){
					event.stopPropagation();	
					event.preventDefault;
				});
				//open folder or show file information
				$div.children("aside").children("label.fileNameInfo").click(function(event){
					event.stopPropagation();
					event.preventDefault();
					if ($(this).next("input.fileNameText").is(":hidden")){
						var oFolder = $(this).parent().parent();
						nLength = $this.children("li").length;
						//alert(nLength);
						//if( oFolder.attr("drag") == "true" || !oFolder.hasClass("folder") || $(".folderBox").is(":visible")){ return false; }
						if (oFolder.hasClass("folder")){
							var nIndex = oFolder.index();
							//alert(nIndex);
							var n = 0;
							nCol = parseInt($box.width() / 157);
							n = nCol - 1 - nIndex % nCol;
							//alert(n);
							var hMask = $("<div>", {
								width: $(window).width(),
								height: $(document).height(),
								id: "fileMask"
							});
							$("body").append(hMask);
							$("#fileMask").fadeIn();
							//console.log(nIndex, nCol, n);
							$("<li class=\"folderBox folderBox"+ nIndex % nCol +"\" folderid=\"" + oFolder.attr("folderid") + "\"><ul class=\"fileSubList\"></ul></li>").insertAfter($("#fileList").children("li").eq(nIndex + n >=  nLength ? nLength -1 : nIndex + n)).slideDown("fast",function(){
								//alert("3");
								$hidden.directory.val(oFolder.attr("folderid"));
								clearTimeout($setFileUpdate);
								$("#fileList").find(".selected").removeClass("selected");
								getFileList({uid : options.data.uid, did : $hidden.directory.val(), url : options.data.url}, "directory", {box : $(".fileSubList")}, true );
							});
							$(".folderBox").click(function(event){
								event.stopPropagation();
								event.preventDefault();
								$(this).find(".selected").removeClass("selected");
							});
							$("#fileMask").click(function(){
								if($(".folderBox").is(":visible")){
									$(".folderBox").slideUp("fast",function(){
										$(this).remove();
										emptyHidden([$hidden.directory]);
										$("#fileMask").remove();
										$("li.folder").removeAttr("style");
										getFileUpdates();
										updataPosition($("#fileList"));
									});
									
								}
							});
						}else{
							if($("#fileInformation").is(":hidden")){
								$hidden.file.val(oFolder.attr("fileid"));
								clearTimeout($setFileUpdate); 
								getFile($hidden.file.val(), "#fileInformation", options.data.url);
							}
						}
					}
				});
				//rename
				$div.children("aside").children("input.fileNameText").blur(function(){
					$(this).hide();
					$(this).prev("label.fileNameInfo").show();
					if($(this).val() != ""){
						$(this).prev("label.fileNameInfo").text($(this).val());
						if ($(this).parent().parent().hasClass("folder")){
							//directory rename
							fileOperations({ uid : options.data.uid, did : $(this).parent().parent().attr("folderid"), name : $(this).val()}, options.data.url, "renameDirectory", "" );						
						}
						if ($(this).parent().parent().attr("drag") == "true"){
							//file rename
							fileOperations({ uid : options.data.uid, fid : $(this).parent().parent().attr("fileid"), name : $(this).val()}, options.data.url, "renameFile", "" );	
						}
					}
				});
				$div.children("aside").children("input.fileNameText").keydown(function(e){
					var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
					if (keyCode == 13){ $(this).blur();}
				});
				//is contact function
				function isContact(a, left, top, result){
					var i = j = 0;
					var h = 160 * 10;
					var col = Math.ceil($("#fileList").outerHeight()/160);
					var nRow = parseInt($("#fileMain").width() / 157);
					var nFor = nRow * 10;
					var col = parseInt(top / h);
					//console.log(left);
					if (left < -45){result.contact = false;}
					else {
						for ( j ; j < nFor ; j++){
							try{
								result.contact = left > a[col][j].left - attribute.inlineHW && left < a[col][j].left + attribute.inlineHW && top > a[col][j].top - attribute.inlineHH && top < a[col][j].top + attribute.inlineHH;
								if ( result.contact ) {
									result.obj = a[col][j].obj;
									break;
								}
							}
							catch(err){}
						}
					}
					//console.log(result);
					return result;
				}
				
			});
		}
		//new
	});
})(jQuery);
//updata position function
function updataPosition(obj){
	var aBlock = [];
	var li = obj.children("li").not("li.siteBlock");
	var n = li.length;
	var col = Math.ceil(obj.outerHeight()/160);
	var nRow = parseInt($("#fileMain").width() / 157);
	var nFor = Math.ceil(col / 10);
	var m = 0, num = 0 , line = nRow * 10;
	var i, j;
	for ( i = 0 ; i < nFor ; i++ ){
		aBlock[i] = [];
		for ( j = 0 ; j < line  ; j ++ ){
			try{aBlock[i][j] = { left : li.eq(j + m).position().left, top : li.eq(j + m).position().top, obj : li.eq(j + m)};}
			catch(err){}
		}
		m = (m + nRow * 10) > n ? m : (m + nRow * 10);
		(m + line) > n ? (line = (n - m)) : line;
	}
	$("#hiddenPosition").data("position", aBlock);
}
/**************************************************
 *	读取文件更新列表 getFileUpdates()
 *	@param [fileID]	文件ID	
 *	@param [box]	填入容器	
 * 	@param [operationUrl]	操作链接	
 ***************************************************/
function getFileUpdates(){
	var strData = { "directories": $("#hiddenBaseDirectory").val(), "files" : $("#hiddenBaseFile").val()};
	var arrExtension = fileExtension();
	var strExtension = ""; 
	$.ajax({
		type : "post",
		url : "/file/GetDirectoryContentUpdates",
		data : strData,
		dataType : "json",
		cache : true,
		beforeSend : function(XMLHttpRequest){
		},
		success : function (json){
			if(json.success){
				//console.log(json.all_files_count, json.my_files_count);
				//console.log($("#hiddenBaseDirectory").data("directory"), $("#hiddenBaseDirectory").val());
				
				$("#allFiles").children("span.tips").text(json.all_files_count);
				$("#myFiles").children("span.tips").text(json.my_files_count);
				if(json.has_updates){
					var strBaseDirectory = $("#hiddenBaseDirectory").data("directory");
					var strBaseFile = $("#hiddenBaseFile").data("file");
					//console.log(json);
					//console.log(strBaseDirectory);
					var oJson;
					var i = 0;
					var html = "";
					if(json.dirs_to_add != null){
						oJson = json.dirs_to_add;
						for ( i in oJson){
							//console.log(i);
							if($("li[folderid=" + oJson[i].storage_directory_id + "]").length == 0){
								html +="<li class=\"folder\" folderID=\""+ oJson[i].storage_directory_id +"\" bind=\"off\">";
								html +="<section>";
								html +="<span></span>";
								html +="</section>";
								html +="<aside>";
								html +="<label for=\""+ oJson[i].storage_directory_id +"\" class=\"fileNameInfo Rows\">"+ oJson[i].name +"</label>";
								html +="<input type=\"text\" id=\""+ oJson[i].storage_directory_id +"\" class=\"fileNameText\" />";
								//htmlFile +="<div class=\"fileDate\">"+ data.updated +"</div>";
								html +="</aside>";
								html +="</li>";
								$(html).insertBefore($("#fileList").children("li").first());
							}
							//delete strBaseDirectory[i];
							//alert(strBaseDirectory);
							if(strBaseDirectory == "") {
								strBaseDirectory = oJson[i];
							}else{
								strBaseDirectory[i] = oJson[i];
							}
							//strBaseDirectory.push(oJson[i]);
							//console.log(strBaseDirectory);
						}
						//console.log(strBaseDirectory);
						$("#hiddenBaseDirectory").data("directory", strBaseDirectory).val(JSON.stringify(strBaseDirectory));
					}
					if(json.dirs_to_update != null){
						oJson = json.dirs_to_update;
						for ( i in oJson){
							$("#fileList").children("li[folderid=" + oJson[i].storage_directory_id + "]").find("label.fileNameInfo").text(oJson[i].name);
							//delete strBaseDirectory[i];
							strBaseDirectory[i] = oJson[i];
						}
						//console.log(strBaseDirectory);
						$("#hiddenBaseDirectory").data("directory", strBaseDirectory).val(JSON.stringify(strBaseDirectory));
					}
					if(json.dirs_to_remove != null){
						oJson = json.dirs_to_remove;
						for ( i in oJson){
							//console.log(oJson[i].storage_file_id);
							$("#fileList").children("li[folderid=" + oJson[i].storage_directory_id + "]").remove();
							delete strBaseDirectory[i];
						}
						$("#hiddenBaseDirectory").data("directory", strBaseDirectory).val(JSON.stringify(strBaseDirectory));	
					}
					if(json.files_to_add != null){
						//alert("11");
						oJson = json.files_to_add;
						for ( i in oJson){
							if($("li[fileid=" + oJson[i].storage_file_index_id + "]").length == 0){
								strExtension = arrExtension[oJson[i].extension] == undefined ? "file" : arrExtension[oJson[i].extension];
								html +="<li class=\"" + strExtension + "\" drag=\"true\" fileID=\""+ oJson[i].storage_file_index_id +"\" bind=\"off\">";
								html +="<section>";
								html +="<span></span>";
								html +="</section>";
								html +="<aside>";
								html +="<label for=\""+ oJson[i].storage_file_index_id +"\" class=\"fileNameInfo Rows\">"+ oJson[i].file_name +"</label>";
								html +="<input type=\"text\" id=\""+ oJson[i].storage_file_index_id +"\" class=\"fileNameText\" />";
								//htmlFile +="<div class=\"fileDate\">"+ data.updated +"</div>";
								html +="</aside>";
								html +="</li>";
							}
							//strBaseFile.push(oJson[i]);
						}
						//alert(html);
						$("#fileList").children("li[uploadid=true]").remove();
						if(strBaseFile == "") {
							$(html).appendTo($("#fileList"));
							strBaseFile = oJson[i];
						}else{
							$(html).appendTo($("#fileList"));
							strBaseFile[i] = oJson[i];
						}
						$("#hiddenBaseFile").data("file", strBaseFile).val(JSON.stringify(strBaseFile));
					}
					if(json.files_to_remove != null){
						oJson = json.files_to_remove;
						for ( i in oJson){
							//console.log(oJson[i].storage_file_id);
							$("#fileList").children("li[fileid=" + oJson[i].storage_file_index_id + "]").remove();
							delete strBaseFile[i];
						}
						$("#hiddenBaseFile").data("file", strBaseFile).val(JSON.stringify(strBaseFile));	
					}
					if(json.files_to_update != null){
						oJson = json.files_to_update;
						for ( i in oJson){
							//console.log(oJson[i].storage_file_id);
							$("#fileList").children("li[fileid=" + oJson[i].storage_file_index_id + "]").find("label.fileNameInfo").text(oJson[i].file_name);
							strBaseFile[i] = oJson[i];
						}
						$("#hiddenBaseFile").data("file", strBaseFile).val(JSON.stringify(strBaseFile));
					}
					updataPosition($("#fileList"));
					//console.log($("#hiddenPosition").data("position"));
					$("#fileList").atomFile({data : {uid : $("#hiddenUser").data("uid"), did : "", url : "/"}, type : "full" });
				}
			}
			clearTimeout($setFileUpdate); 
			$setFileUpdate = setTimeout(getFileUpdates, 5000); 
			
		},
		complete: function (XMLHttpRequest, textStatus)
		{
			//HideLoading();
			
		},
		error: function (error)
		{
			console.log(error);
			//alert("error");
			//请求出错处理
		}
	});
}
/******************************************************************
 *	file operations
 *	@param data [ ajax data ]
 *	@param url [ ajax url ]
 *	@param type [ moveFile : 移动文件到文件夹 | moveoutFile : 从文件夹里移出文件 | combineFiles : 合并文件 | removeFile : 删除文件 | renameFile : 文件重命名 | renameDirectory : 文件夹重命名]
 *	@param obj [ operations obj ]
 ******************************************************************/
function fileOperations( data, url, type, obj ){
	var strUrl = strData = "";
	//console.log(data);
	switch (type){
		case "renameFile":
			strUrl = url + "file/renamefile";
			strData = data;
		break;
		case "renameDirectory":
			strUrl = url + "file/renamedirectory";
			strData = data;
		break;
		case "combineFiles":
			strUrl = url + "file/combinefiles";
			strData = data;
		break;
		case "moveFile":
			strUrl = url + "file/movefile";
			strData = data;
		break;
		case "moveoutFile":
			strUrl = url + "file/movefile";
			strData = data;
		break;
		case "removeItems":
			strUrl = url + "file/removeItems";
			strData = data;
			//console.log(strUrl, strData);
		break;
		case "addComment":
			strUrl = url + "file/addComment";
			strData = data;
		break;
		case "getComment":
			strUrl = url + "file/getComments";
			strData = data;
		break;
		default :
		break;
	}
	$.ajax({
		type : "get",
		url : strUrl,
		data : strData,
		dataType : "jsonp",
		cache : true,
		beforeSend : function(XMLHttpRequest){
			//console.log(XMLHttpRequest.readyState);
			if(XMLHttpRequest.readyState == 0){
				$("body").atomFly({ type : "loading", isMask : false });
			}
		},
		success : function (json){
			//alert("js-ok")
			if(json.success){
				switch (type){
					//combe files
					case "combineFiles":
						obj.remove.remove();	
						obj.temp.removeAttr("drag");
						obj.temp.removeAttr("fileID").attr("folderID", json.did);
						//obj.children("section").children("div.Option").remove();
						obj.temp.children("aside").children("label.fileNameInfo").text(json.dname);
						obj.temp.attr("class","folder");
						//$("#fileList").children("li.inlineBlock").removeClass("inlineBlock");
						//obj.temp.children("aside").children("label.fileNameInfo").click();
						obj.temp.children("section").click();
						updataPosition($("#fileList"));
						$("#tipsPop").find(".cancel").click();
						obj.temp.addClass("selected");
						$("#operationList").children("li.rename").click();
					break;
					//move file in diretory
					case "moveFile":
						obj.remove.remove();	
						updataPosition($("#fileList"));
						obj.temp.attr("class","folder");
						//$("#fileList").children("li.inlineBlock").removeClass("inlineBlock");
						$("#tipsPop").find(".cancel").click();
					break;
					case "moveoutFile":
					//console.log(removeObj.closest(".folderBox").prevAll().length % nCol);
						var nCol = parseInt($("#fileMain").width() / 157);
						if (obj.remove.closest(".folderBox").prevAll().length % nCol > 0){
							obj.remove.clone().attr("bind", "off").removeClass().removeAttr("style").insertBefore(obj.remove.closest(".folderBox"));	
						}else{
							obj.remove.clone().attr("bind", "off").removeClass().removeAttr("style").appendTo(".fileList");	
						}
						obj.remove.remove();
						updataPosition($("#fileList"));
						$("#fileList").atomFile({data : {uid : $("#hiddenUser").data("uid"), did : "", url : "/"}, type : "full" });
						$("#tipsPop").find(".cancel").click();
					break;
					case "removeItems":
						$(".commonPop").find(".cancel").click();
						obj.remove.remove();
						updataPosition($("#fileList"));
					break;
					case "addComment":
						var comment = json.commentList;
						var html = "";
						for ( var i = 0 ; i < comment.length ; i++){
							html += '<li>'+
								'<span class="time">' + comment[i].created + '</span>'+
								'<img src="' + comment[i].avatar + '" class="userPhoto fl" alt="' + comment[i].firstname + ' ' + comment[i].lastname + '" />'+
								'<aside class="fl">'+
									'<h6 class="Rows">' + comment[i].firstname + ' ' + comment[i].lastname + '</h6>'+
									'<p>' + comment[i].content + '</p>'+
								'</aside>'+
								'<div class="ClearBoth"></div>'+
						   '</li>';
						}
					   $("#fileInformation").find(".commentsList").html("").append(html).scrollTop(1000000);
					   $("#fileInformation").find(".sendText").val("").focus();;
					break
					default :
					break;
				}
			}else{
				//console.log(json.error);
				//alert(json.error);
			}
		},
		complete: function (XMLHttpRequest, textStatus)
		{
			$("#atomLoading").atomFly({ type : "fadeOut", callBack : function(){ $("#atomLoading").remove(); }});
			//HideLoading();
		},
		error: function (json)
		{
			//alert("error");
		}
	});
}
/******************************************************************
 *	分享文件 shareOperations()
 *	@param [sData]		data 
 *	@param [sType]		操作类别   [ shareDirectory : 分享文件夹 | shareFile : 分享文件 ]
 *  @param [operationsUrl]	操作链接
 *	@param [obj]		操作对象列表 [ html : 需要加入的字符串 | box : 字符串容器 | hidden : 数据容器 | remove : 需要隐藏或删除的容器 ] 
 *
 ******************************************************************/
function shareOperations( data, sType, operationUrl, obj ){
	var sUrl = "";
	switch (sType){
		case "shareDirectory":
			sUrl = operationUrl + "file/sharedirectory";
		break;
		case "shareFile":
			sUrl = operationUrl + "file/sharefile";
		break;
		case "shareItemsFile":
			sUrl = operationUrl + "file/sharefile";
		break;
		case "shareitems":
			sUrl = operationUrl + "file/ShareItems";
		break;
		case "unShareFile":
			sUrl = operationUrl + "file/setfilepermissions";
		break;
		case "unShareItemsFile":
			sUrl = operationUrl + "file/setfilepermissions";
		break;
		case "unShareDirectory":
			sUrl = operationUrl + "file/setdirectorypermissions";
		break;
		default :
		break;
	}
	$.ajax({
		type : "get",
		url : sUrl,
		data : data,
		dataType : "jsonp",
		cache : true,
		beforeSend : function(XMLHttpRequest){
		},
		success : function (json){
			//alert("js");
			//console.log(json);
			if(json.success){
				switch (sType){
					case "shareDirectory":
						$(obj.html).insertBefore(obj.box);
						obj.remove.hide();
						$("#hiddenCancel").data("close", "true");
						//get left sharing user list
						getShareList( {uid : data.uid }, operationUrl, "allShareUsers", {box : $("#fileUserList ul.userList")} );
					break;
					case "shareItemsFile":
						$(obj.html).insertBefore(obj.box);
						obj.remove.hide();
						$("#hiddenCancel").data("close", "true");
						//send newsfeed
						//sendNewsfeed({share_ids : data.users, type : "share_file", file_id : data.fid});
						//get left sharing user list
						getShareList( {uid : data.uid }, operationUrl, "allShareUsers", {box : $("#fileUserList ul.userList")} );
					break;
					case "shareFile":
						getFile($("#hiddenFile").val(), "#fileInformation", operationUrl);
						//$(obj.html).insertBefore(obj.box.find("#addShare"));
						obj.remove.hide();
						//send newsfeed
						//sendNewsfeed({share_ids : data.users, type : "share_file", file_id : data.fid});
						//get left sharing user list
						getShareList( {uid : data.uid }, operationUrl, "allShareUsers", {box : $("#fileUserList ul.userList")} );
					break;
					case "shareitems":
						$("#tipsPop").find(".cancel").click();
						getShareList( {uid : $("#hiddenUser").data("uid") }, operationUrl, "allShareUsers", {box : $("#fileUserList ul.userList")} );
					break;
					case "unShareFile":
						getFile($("#hiddenFile").val(), "#fileInformation", operationUrl);
						//obj.hidden.val(obj.hidden.val().replace((sData.uid+ "_"),""));
						//obj.remove.remove();
						//get left sharing user list
						getShareList( {uid : data.own }, operationUrl, "allShareUsers", {box : $("#fileUserList ul.userList")} );
					break;
					case "unShareItemsFile":
						obj.hidden.val(obj.hidden.val().replace((data.uid+ "_"),""));
						obj.hiddenShare.val(obj.hiddenShare.val().replace((data.uid+ "_"),""));
						obj.remove.remove();
						//getFile($("#hiddenFile").val(), "#fileInformation", operationUrl);
						//obj.hidden.val(obj.hidden.val().replace((sData.uid+ "_"),""));
						//obj.remove.remove();
						//get left sharing user list
						getShareList( {uid : data.own }, operationUrl, "allShareUsers", {box : $("#fileUserList ul.userList")} );
					break;
					case "unShareDirectory":
						//getFile($("#fileInformation").attr("fileid"), "#fileInformation", operationUrl);
						obj.hidden.val(obj.hidden.val().replace((data.uid+ "_"),""));
						obj.hiddenShare.val(obj.hiddenShare.val().replace((data.uid+ "_"),""));
						obj.remove.remove();
						//get left sharing user list
						getShareList( {uid : data.own }, operationUrl, "allShareUsers", {box : $("#fileUserList ul.userList")} );
					break;
					default :
					break;
				}
			}else if (json.success){
				switch (sType){
					case "shareDirectory":
						$("#closeShareBox").click();
					break;
					default :
					break;
				}
			}else{
				//alert(json.error);
			}
		},
		complete: function (XMLHttpRequest, textStatus)
		{
			//HideLoading();
		},
		error: function (json)
		{
			console.log(json);
			//alert(json.error);
		}
	});
}
/**************************************************
 *	getFileList
 *	@param [data] data [ uid : user id | did : directory id ]
 *	@param [type] type
 *  @param [obj] obj
 *	@param [isDrag] is drag and drop
 ***************************************************/
function getFileList(data, type, obj, isDrag){
	var strData = strUrl = strBaseDirectory = strBaseFile = "";
	var arrExtension = fileExtension();
	var strExtension = ""; 
	//console.log(data);
	switch (type){
		case "allFiles":
			strUrl = data.url + "file/listdirectorycontent";
			strData = { uid : data.uid, did : data.did};
		break;
		case "myFiles":
			strUrl = data.url + "file/GetMyFiles";
			strData = { uid : data.uid};
		break;
		case "directory":
			strUrl = data.url + "file/listdirectorycontent";
			strData = { uid : data.uid, did : data.did};
		break;
		case "sharingDirectory":
			strUrl = data.url + "file/GetSharedItems";
			strData = { uid1 : data.uid, uid2 : data.shareUsers};
		break;
		default:
		break;
	}
	$.ajax({
		type : "get",
		url : strUrl,
		data : strData,
		dataType : "jsonp",
		cache : true,
		beforeSend : function(XMLHttpRequest){
			//console.log(XMLHttpRequest.readyState);
			if(XMLHttpRequest.readyState == 0){
				$("body").atomFly({ type : "loading" });
			}
		},
		success : function (json){
			//console.log(json);
			var htmlFile = "";
			switch(type){
				case "allFiles":
					if(json.directories != null){
						//globalFile = json.directories;
						//strBaseDirectory = JSON.stringify(json.directories);
						strBaseDirectory = json.directories;
						$.each(json.directories, function(index, data){
							//if(data.permissions == 5){htmlFile +="<li class=\"folder\" folderID=\""+ data.storage_directory_id +"\">";}
							//else{htmlFile +="<li class=\"folder share\" folderID=\""+ data.storage_directory_id +"\">";}
							htmlFile +="<li class=\"folder\" folderID=\""+ data.storage_directory_id +"\" bind=\"off\">";
							htmlFile +="<section>";
							htmlFile +="<span></span>";
							htmlFile +="</section>";
							htmlFile +="<aside>";
							htmlFile +="<label for=\""+ data.storage_directory_id +"\" class=\"fileNameInfo Rows\">"+ data.name +"</label>";
							htmlFile +="<input type=\"text\" id=\""+ data.storage_directory_id +"\" class=\"fileNameText\" />";
							//htmlFile +="<div class=\"fileDate\">"+ data.updated +"</div>";
							htmlFile +="</aside>";
							htmlFile +="</li>";
						});
					}
				break;
				case "directory":
					htmlFile +="<div class=\"folderTitle\" folderID =\"" + data.did + "\">" + json.name + " </div>";
					//htmlFile +="<div class=\"folderTitle\" folderID =\"" + data.did + "\">" + json.name + " <span class=\"share\">share list</span></div>";
				break;
				case "sharingDirectory":
					if(json.directories != null){
						//strBaseDirectory = JSON.stringify(json.directories);
						strBaseDirectory = json.directories;
						$.each(json.directories, function(index, data){
							//if(data.permissions == 5){htmlFile +="<li class=\"folder\" folderID=\""+ data.storage_directory_id +"\">";}
							//else{htmlFile +="<li class=\"folder share\" folderID=\""+ data.storage_directory_id +"\">";}
							htmlFile +="<li class=\"folder\" folderID=\""+ data.storage_directory_id +"\" bind=\"off\">";
							htmlFile +="<section>";
							htmlFile +="<span></span>";
							htmlFile +="</section>";
							htmlFile +="<aside>";
							htmlFile +="<label for=\""+ data.storage_directory_id +"\" class=\"fileNameInfo Rows\">"+ data.name +"</label>";
							htmlFile +="<input type=\"text\" id=\""+ data.storage_directory_id +"\" class=\"fileNameText\" />";
							//htmlFile +="<div class=\"fileDate\">"+ data.updated +"</div>";
							htmlFile +="</aside>";
							htmlFile +="</li>";
						});
					}
				break;
				default:
				break;
			}
			if(json.files != null){
				//strBaseFile = JSON.stringify(json.files);
				strBaseFile = json.files;
				$.each(json.files, function(index, data){
					strExtension = arrExtension[data.extension] == undefined ? "file" : arrExtension[data.extension];
					htmlFile +="<li class=\"" + strExtension + "\" drag=\"true\" fileID=\""+ data.storage_file_index_id +"\" bind=\"off\">";
					htmlFile +="<section>";
					htmlFile +="<span></span>";
					htmlFile +="</section>";
					htmlFile +="<aside>";
					htmlFile +="<label for=\""+ data.storage_file_index_id +"\" class=\"fileNameInfo Rows\">"+ data.file_name +"</label>";
					htmlFile +="<input type=\"text\" id=\""+ data.storage_file_index_id +"\" class=\"fileNameText\" />";
					//htmlFile +="<div class=\"fileDate\">"+ data.updated +"</div>";
					htmlFile +="</aside>";
					htmlFile +="</li>";
				});
			}
			$(obj.box).html("").append(htmlFile);
			switch(type){
				case "allFiles":
					//console.log(strBaseDirectory);
					$("#hiddenBaseDirectory").data("directory", strBaseDirectory).val(JSON.stringify(strBaseDirectory));
					
					$("#hiddenBaseFile").data("file", strBaseFile).val(JSON.stringify(strBaseFile));
					//console.log($("#hiddenBaseFile").val());
					//console.log($("#hiddenBaseDirectory").data("directory"));
					//console.log(strBaseFile["76"]);
					
					//console.log($("#hiddenBaseFile").data("file"));
					
					updataPosition($("#fileList"));
					//console.log($("#hiddenPosition").data("position"));
					getFileUpdates();
					obj.box.atomFile({data : {uid : data.uid, did : data.did, url : data.url}, type : "full" });
				break;
				case "myFiles":
					obj.box.atomFile({data : {uid : data.uid, did : data.did, url : data.url}, type : "full", isDrag : false});
				break;
				case "directory":
					if(isDrag){obj.box.atomFile({data : {uid : data.uid, did : data.did, url : data.url}, type : "directory"});}
					else{obj.box.atomFile({data : {uid : data.uid, did : data.did, url : data.url}, type : "directory", isDrag : false});}					
				break;
				case "sharingDirectory":
					obj.box.atomFile({data : {uid : data.uid, did : data.did, url : data.url}, type : "sharingDirectory", isDrag : false});
				break;
				default:
				break;
			}
		},
		complete: function (XMLHttpRequest, textStatus)
		{	
			$("#atomLoading").atomFly({ type : "fadeOut", callBack : function(){ $("#atomLoading").remove(); }});
			//HideLoading();
			
		},
		error: function (json)
		{
			//alert(111);
			//alert(json.error);
			//请求出错处理
		}
	});
}

/**************************************************
 *	读取文件列表 getFile()
 *	@param [fileID]	文件ID	
 *	@param [box]	填入容器	
 * 	@param [operationUrl]	操作链接	
 ***************************************************/
function getFile(fileID, box, operationUrl){
	$.ajax({
		type : "get",
		url : operationUrl + "file/fileinfo",
		data : "fid="+fileID+"&callback=?",
		dataType : "jsonp",
		cache : true,
		beforeSend : function(XMLHttpRequest){
			//console.log(XMLHttpRequest.readyState);
			if(XMLHttpRequest.readyState == 0){
				$("body").atomFly({ type : "loading" });
			}
		},
		success : function (json){
			//alert("js-ok");
			//alert(nRandom);
			//fileName
			//console.log(json);
			var strUers = {own : "", others : ""};
			var html = "";
			$(box).children().children("header").children("h3").text(json.filename);
			//fileUpdateTime
			$(box).children().children("header").children("p").text(json.updated);
			$(box).children().children(".fileOperations").children(".downloadFile").children("a").attr({href: operationUrl + "file/download?fids=" + fileID + "&callback=?", title : "down" + "-" + json.filename + "-" + formatSize(json.size)});
			$(box).children().children(".fileOperations").children(".downloadFile").children("p").text( "(" + formatSize(json.size) + ")");
			$(box).children().children(".fileSareFrame").children("header").text( "Share with " + json.sharecount + " people :");
			
			for (var i in json.users){
				//console.log(json.users[i]);
				if(json.users[i][0] == 5){
					//console.log(json[i][1]);
					html +="<li class=\"name\"><img src=\"" + json.users[i][3] + "\" alt=\"" + json.users[i][1]+ " " + json.users[i][2] + "\" /></li>";
					strUers.own = i + "_";
				}else{
					html +="<li class=\"name\"><img src=\"" + json.users[i][3] + "\" alt=\"" + json.users[i][1] + " " + json.users[i][2] + "\" /><a href=\"#\" class=\"deleteName\" title=\"stop sharing this file with " + json.users[i][1] + " " + json.users[i][2] + "\" nameid=\"" + i + "\"></a></li>";
					strUers.others += i + "_";
				}
			}
			$(box).find(".hiddenShare").val(strUers.others.replace("remove_in_array_",""));
			$(box).find(".hiddenPeople").val(strUers.others.replace("remove_in_array_","") + strUers.own);
			
			$(box).find("#addShare").prevAll().remove();
			$(html).insertBefore($(box).find("#addShare"));
		},
		complete: function (XMLHttpRequest, textStatus)
		{
			$("#atomLoading").atomFly({ type : "fadeOut", callBack : function(){ $("#atomLoading").remove(); }});
			getCommentList($("#hiddenFile").val(), $("#fileInformation").find(".commentsList"));
			$("#fileInformation").atomFly({type: "fadeIn"});
			$("#fileInformation").find("input.sendText").focus();
			//HideLoading();
			
		},
		error: function ()
		{
			//请求出错处理
		}
	});
}

/******************************************************************
 *	获取分享列表	 getShareList()
 *	@param [data]		data [did : directory id]
 *  @param [url]		ajax url
 *	@param [type]		[ shareDirectory : share directory | shareFile : share file ]
 *	@param [obj]		操作对象列表 [ html : 需要加入的字符串 | box : 字符串容器 | hidden : 数据容器 | remove : 需要隐藏或删除的容器 ] 
 *
 ******************************************************************/
function getShareList( data, url, type, obj ){
	var strUrl = "";
	switch (type){
		case "directoryList":
			strUrl = url + "file/getDirectoryUsers";
		break;
		case "fileList":
			strUrl = url + "file/getfileUsers";
		break;
		case "allShareUsers":
			strUrl = url + "file/getSharingUsers";
		break;
		default :
		break;
	}
	var strUers = { own : "", others : ""};
	$.ajax({
		type : "get",
		url : strUrl,
		data : data,
		dataType : "jsonp",
		cache : true,
		beforeSend : function(XMLHttpRequest){
		},
		success : function (json){
			//console.log(json);
			var html = "";
			switch (type){
				case "directoryList":
					for (var i in json){
						//console.log(json[i]);
						if(json[i][0] == 5){
							//console.log(json[i][1]);
							html +="<li class=\"name\"><img src=\"" + json[i][3] + "\" alt=\"" + json[i][1]+ " " + json[i][2] + "\" /></li>";
							strUers.own = i + "_";
						}else{
							html +="<li class=\"name\"><img src=\"" + json[i][3] + "\" alt=\"" + json[i][1] + " " + json[i][2] + "\" /><a href=\"#\" class=\"deleteName\" title=\"stop sharing this file with " + json[i][1] + " " + json[i][2] + "\" nameid=\"" + i + "\"></a></li>";
							strUers.others += i + "_";
						}
					}
					obj.box.find(".hiddenShare").val(strUers.others.replace("remove_in_array_",""));
					obj.box.find(".hiddenPeople").val(strUers.others.replace("remove_in_array_","") + strUers.own);
					
					obj.box.find(".textLi").prevAll().remove();
					$(html).insertBefore(obj.box.find(".textLi"));
					//读取分享人员列表
					//atomGetUser("directoryShareUsers", strUers, {beforeBox : obj.box.find(".textLi")});
				break;
				case "fileList":
					for (var i in json){
						//console.log(json[i]);
						if(json[i][0] == 5){
							//console.log(json[i][1]);
							html +="<li class=\"name\"><img src=\"" + json[i][3] + "\" alt=\"" + json[i][1]+ " " + json[i][2] + "\" /></li>";
							strUers.own = i + "_";
						}else{
							html +="<li class=\"name\"><img src=\"" + json[i][3] + "\" alt=\"" + json[i][1] + " " + json[i][2] + "\" /><a href=\"#\" class=\"deleteName\" title=\"stop sharing this file with " + json[i][1] + " " + json[i][2] + "\" nameid=\"" + i + "\"></a></li>";
							strUers.others += i + "_";
						}
					}
					obj.box.find(".hiddenShare").val(strUers.others.replace("remove_in_array_",""));
					obj.box.find(".hiddenPeople").val(strUers.others.replace("remove_in_array_","") + strUers.own);
					
					obj.box.find(".textLi").prevAll().remove();
					$(html).insertBefore(obj.box.find(".textLi"));
					//读取分享人员列表
					//atomGetUser("directoryShareUsers", strUers, {beforeBox : obj.box.find(".textLi")});
				break;
				case "allShareUsers":
					obj.box.html("");
					var ajaxObj = {box : obj.box, operationUrl : url, userID : [], shareNum : []};
					strUers.own = data.uid;
					if(json != ""){
						for (var i in json){
							//console.log(json[i]);
							html +="<li nameID=\"" + i + "\">";
							html +="<span class=\"tips\">" + json[i][0] + "</span>";
							html +="<a href=\"#\" target=\"_blank\" title=\"" + json[i][1]+ " " + json[i][2] + "\"><img src=\"" + json[i][3] + "\" class=\"userPhoto fl\" alt=\"\" /></a>";
							html +="<aside class=\"fl\">";
							html +="<h6 class=\"Rows\">" + json[i][1] + " " + json[i][2] + "</h6>";
							html +="</aside>";
							html +="<div class=\"ClearBoth\"></div>";
							html +="</li>";
							//strUers.others += i + "_";
							//ajaxObj.userID.push(i);
							//ajaxObj.shareNum.push(json[i]);
						}
						$(html).appendTo(obj.box);
						//show share user's file list
						obj.box.children("li").click(function() {
							$("#fileUserList").find(".selected").removeClass("selected");
							$(this).addClass("selected");
							clearTimeout($setFileUpdate);
							getFileList({ uid : strUers.own, shareUsers : $(this).attr("nameID"), url : url}, "sharingDirectory", {box : $("#fileMain ul.fileList")});
							//getShareFileList(users.own, $(this).attr("nameID"), obj.operationUrl, $("#fileMain ul.fileList"));
						});
					}
					//atomGetUser("allShareUsers", strUers, ajaxObj);
					clearTimeout($setAllShareUsers);
					$setAllShareUsers = setTimeout(function(){getShareList( data, url, type, obj )}, 5000); 
				break;
				default :
				break;
			}
		},
		complete: function (XMLHttpRequest, textStatus)
		{
			//HideLoading();
		},
		error: function (json)
		{
			//alert(json);
		}
	});
}
/******************************************************************
 *	获取分享列表	 getCommentList()
 *	@param [data]		data [did : directory id]
 *  @param [url]		ajax url
 *	@param [type]		[ shareDirectory : share directory | shareFile : share file ]
 *	@param [obj]		操作对象列表 [ html : 需要加入的字符串 | box : 字符串容器 | hidden : 数据容器 | remove : 需要隐藏或删除的容器 ] 
 *
 ******************************************************************/
function getCommentList( data, obj){
	$.ajax({
		type : "get",
		url : "/file/GetComments",
		data : "&intfileId=" + data,
		dataType : "jsonp",
		cache : true,
		beforeSend : function(XMLHttpRequest){
		},
		success : function (json){
			//console.log(json);
			var comment = json.commentList;
			if (comment != null ){
				var html = "";
				for ( var i = 0 ; i < comment.length ; i++){
					html += '<li>'+
						'<span class="time">' + comment[i].created + '</span>'+
						'<img src="' + comment[i].avatar + '" class="userPhoto fl" alt="' + comment[i].firstname + ' ' + comment[i].lastname + '" />'+
						'<aside class="fl">'+
							'<h6 class="Rows">' + comment[i].firstname + ' ' + comment[i].lastname + '</h6>'+
							'<p>' + comment[i].content + '</p>'+
						'</aside>'+
						'<div class="ClearBoth"></div>'+
				   '</li>';
				}
			   obj.html("").append(html);
			   clearTimeout($setcommentList); 
			   $setcommentList = setTimeout(function(){getCommentList(data, obj)}, 5000); 
		  	}else{
		  		obj.html("");
		  	}
		},
		complete: function (XMLHttpRequest, textStatus)
		{
			//HideLoading();
		},
		error: function (json)
		{
			//alert(json);
		}
	});
}
/**************************************************
 *	返回文件大小 formatSize()
 *	@param [bytes] file size
 ***************************************************/
function formatSize(bytes){
	var i = -1;                                    
	do {
		bytes = bytes / 1024;
		i++;  
	} while (bytes > 99);
	
	return Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];          
}
/**************************************************
 *	返回文件引用css fileExtension()
 *	@param [extension] file extension
 ***************************************************/
function fileExtension(){
	//var strClass = "";
	var strExtension = [];
	strExtension["rar"] = "rar";
	strExtension["zip"] = "zip";
	strExtension["jpg"] = "image";
	strExtension["gif"] = "image";
	strExtension["png"] = "image";
	strExtension["bmp"] = "image";
	strExtension["psd"] = "image";
	strExtension["avi"] = "video";
	strExtension["wmv"] = "video";
	strExtension["flv"] = "video";
	strExtension["mp4"] = "video";
	strExtension["mkv"] = "video";
	strExtension["rmvb"] = "video";
	strExtension["mp3"] = "audio";
	strExtension["doc"] = "doc";
	strExtension["docx"] = "doc";
	strExtension["xls"] = "xls";
	strExtension["xlsx"] = "xls";
	strExtension["ppt"] = "ppt";
	strExtension["pptx"] = "ppt";
	strExtension["pdf"] = "pdf";
	return strExtension;
}
