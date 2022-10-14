/*-------------------------------------------------
Copyright@2016, colloa system. All rights reserved.
-------------------------------------------------*/
var _nContextId=0;var _eLastActiveSource=null;var _eLastActiveEvent=null;var _vGlobal=null;function setCookie(N,V){document.cookie=N+"="+escape(V)+";expires=Thu, 31 Dec 2050 00:00:00 GMT;path=/;";};function getCookie(N){var ac=document.cookie.match(new RegExp("(^| )"+N+"=([^;]*)(;|$)"));if(ac!=null) return unescape(ac[2]);else return null;};function ajax(url,fM){var aI;try{aI=new XMLHttpRequest();}catch(e){try{aI=new ActiveXObject("Msxml2.XMLHTTP");}catch(e){try{aI=new ActiveXObject("Microsoft.XMLHTTP");}catch(e){alert("your browser does not support ajax");return null;}}}if(aI){if(typeof(fM)=="object"){var be,O,e;for(var i=0;i<fM.length;i++){e=fM[i];if(e.name||e.id){if(e.type=="select-one"){O=e.options[e.selectedIndex].value;}else if(e.type=="radio"){if(e.checked) O=e.value;else continue;}else if(e.type=="button"||e.type=="submit"||e.type=="reset"||e.type=="image"){continue;}else{O=e.value;}be=(be?be+"&":"")+(e.name?e.name:e.id)+"="+encodeURIComponent(O);}}aI.open("POST",url+"&_ajax=1&"+Math.random(),false);aI.setRequestHeader("Content-Type","application/x-www-form-urlencoded");aI.send(be);}else if(typeof(fM)=="string"){aI.open("POST",url+"&_ajax=1&"+Math.random(),false);aI.setRequestHeader("Content-Type","application/x-www-form-urlencoded");aI.send(fM);}else{aI.open("GET",url+"&_ajax=1&"+Math.random(),false);aI.send(null);}return aI.responseText;}};function htmlEncode(aS){if(aS.length==0)return "";else return aS.replace(/&/g,"&amp;").replace(/ /g,"&nbsp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");};function htmlDecode(aS){if(aS.length==0)return "";else return aS.replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/&amp;/g,"&");};function treeBuild(az,bU,aj){var aU=",0,";var O=document.getElementById(az).childNodes;if(bU!=null){var av=false;for(var i=O.length-1;i>=0;i--){if(O[i].getAttribute("sid")==bU){if(!av){av=true;O[i].className+=" textHighlight";}aU+=bU+",";bU=O[i].getAttribute("psid");if(bU=="0")break;}}}var ah=0;var bp=false;var bG=false;for(var i=O.length-1;i>=0;i--){if(O[i].getAttribute("indent")>=ah){bp=false;}else{bp=true;}bG=(O[i].getAttribute("href")&&O[i].getAttribute("href").length>0);ah=O[i].getAttribute("indent");if(aU.indexOf(","+O[i].getAttribute("sid")+",")>=0){O[i].innerHTML=(bp?"<img src='../images/minus"+(aj?"Flag":"")+".gif' border=0"+(bG?" onclick=\"javascript:return treeDisplay0('"+az+"',"+i+(aj?",true":"")+");\"":"")+">":"<img src='../images/blank16.gif' border=0>")+O[i].innerHTML;}else{if(ah>0&&aU.indexOf(","+O[i].getAttribute("psid")+",")<0){O[i].style.display="none";}O[i].innerHTML=(bp?"<img src='../images/plus"+(aj?"Flag":"")+".gif' border=0"+(bG?" onclick=\"javascript:return treeDisplay0('"+az+"',"+i+(aj?",true":"")+");\"":"")+">":"<img src='../images/blank16.gif' border=0>")+O[i].innerHTML;}if(bp&& !bG){O[i].setAttribute(O[i].tagName=="A"?"href":"onclick","javascript:treeDisplay0('"+az+"',"+i+(aj?",true":"")+");void(0);");}}};function treeDisplay0(az,bv,aj){var O=document.getElementById(az).childNodes;var bi=O[bv].childNodes[0].src.indexOf("plus")>0?true:false;if(bi&&aj){var bM=O[bv].getAttribute("psid");var ad=O[bv].getAttribute("indent");for(var i=O.length-1;i>=0;i--){if(i!=bv&&O[i].getAttribute("psid")==bM&&O[i].getAttribute("indent")==ad&&O[i].childNodes[0].src.indexOf("minus")>0){O[i].childNodes[0].src="../images/plusFlag.gif";treeDisplay(O,i,false);break;}}}O[bv].childNodes[0].src=(bi?"../images/minus":"../images/plus")+(aj?"Flag":"")+".gif";treeDisplay(O,bv,bi);if(window.event){event.cancelBubble=true;}return false;};function treeDisplay(O,bv,bi){var ab=Number(O[bv].getAttribute("indent"));var ad;var i=bv+1;if(bi){for(;i<O.length;i++){ad=Number(O[i].getAttribute("indent"));if(ad==ab+1){O[i].style.display="";if(O[i].childNodes[0].src.indexOf("minus")>0){i=treeDisplay(O,i,bi);}}else if(ad<=ab){break;}}}else{for(;i<O.length;i++){ad=Number(O[i].getAttribute("indent"));if(ad==ab+1){O[i].style.display="none";if(O[i].childNodes[0].src.indexOf("blank")<0){i=treeDisplay(O,i,bi);}}else if(ad<=ab){break;}}}return i-1;};function treeBuildByTable(az){var aU=",0,";var O=document.getElementById(az).childNodes;var ah=0;var bp=false;for(var i=O.length-1;i>=0;i--){if(O[i].getAttribute("indent")>=ah){bp=false;}else{bp=true;}ah=O[i].getAttribute("indent");if(aU.indexOf(","+O[i].getAttribute("sid")+",")>=0){O[i].childNodes[0].innerHTML=(bp?"<a href=\"javascript:treeDisplay0ByTable('"+az+"',"+i+");void(0);\"><img src='../images/minus.gif' border=0>":"<span><img src='../images/blank16.gif' border=0></span>")+O[i].childNodes[0].innerHTML+(bp?"</a>":"");}else{if(ah>0&&aU.indexOf(","+O[i].getAttribute("psid")+",")<0){O[i].style.display="none";}O[i].childNodes[0].innerHTML=(bp?"<a href=\"javascript:treeDisplay0ByTable('"+az+"',"+i+");void(0);\"><img src='../images/plus.gif' border=0>":"<span><img src='../images/blank16.gif' border=0></span>")+O[i].childNodes[0].innerHTML+(bp?"</a>":"");}}};function treeDisplay0ByTable(az,bv){var O=document.getElementById(az).childNodes;var bi=O[bv].childNodes[0].childNodes[0].childNodes[0].src.indexOf("plus")>0?true:false;O[bv].childNodes[0].childNodes[0].childNodes[0].src=bi?"../images/minus.gif":"../images/plus.gif";treeDisplayByTable(O,bv,bi);if(window.event){event.cancelBubble=true;}return false;};function treeDisplayByTable(o,bv,bi){var nip=Number(o[bv].getAttribute("indent"));var ni;var i=bv+1;if(bi){for(;i<o.length;i++){ni=Number(o[i].getAttribute("indent"));if(ni==nip+1){o[i].style.display="";if(o[i].childNodes[0].childNodes[0].childNodes[0].src.indexOf("minus")>0){i=treeDisplayByTable(o,i,bi);}}else if(ni<=nip){break;}}}else {for(;i<o.length;i++){ni=Number(o[i].getAttribute("indent"));if(ni==nip+1){o[i].style.display="none";if(o[i].childNodes[0].childNodes[0].childNodes[0].src.indexOf("blank")<0){i=treeDisplayByTable(o,i,bi);}}else if(ni<=nip){break;}}}return i-1;};function catalogue(aT,by,J){var s=location.href;var n=s.indexOf("&ex.stype");if(n>0)s=s.substr(0,n);else{n=s.indexOf("&page");if(n>0)s=s.substr(0,n);}location.href=s+(aT!=null?"&ex.stype="+aT+"&ex.sid="+by+"&ex.name="+escape(J):"");};function cataloguePages(bF,bo){var T=Math.ceil(bF/bo);if(T==0)T=1;var v=1;var s=location.href;var n=s.indexOf("&page=");if(n>0){v=parseInt(s.substr(n+6));s=s.substr(0,n);}if(v<1)v=1;else if(v>T)v=T;document.write("<div style='padding:20px 0px;'><a class='button1 button1L' title='"+$translate("first page")+"' href=\"javaScript:location.href='"+s+"&page=1';\"><i class='fa fa-step-backward'></i></a><a class='button1 button1M' title='"+$translate("previous page")+"' href=\"javaScript:location.href='"+s+"&page="+(v>1?v-1:v)+"';\"><i class='fa fa-backward'></i></a><span class='button1M'>"+$translate("total record(s)",bF)+$translate("current page",v+"/"+T)+"</span><a class='button1 button1M' title='"+$translate("next page")+"' href=\"javaScript:location.href='"+s+"&page="+(v<T?v+1:v)+"';\"><i class='fa fa-forward'></i></a><a class='button1 button1R' title='"+$translate("last page")+"' href=\"javaScript:location.href='"+s+"&page="+T+"';\"><i class='fa fa-step-forward'></i></a></div>");};function catalogueSelectAll(bh,aE){var o;if(aE)o=document.getElementById(aE);if(o==null)o=document.body;var V=o.getElementsByTagName("INPUT");for(var i=0;i<V.length;i++){var e=V[i];if(e.type=="checkbox"&&e.id){if(bh)e.checked=true;else e.checked=false;}}};function catalogueSelection(aE){var o;if(aE)o=document.getElementById(aE);if(o==null)o=document.body;var V=o.getElementsByTagName("INPUT");var s="";for(var i=0;i<V.length;i++){var e=V[i];if(e.type=="checkbox"&&e.id){if(e.checked)s+=e.id+",";}}if(s==""){alert(translate["selectionRequired"]);return null;}else{return s;}};function workflowListInit(b){var s;if(window.opener&&location.href.indexOf("/catalogue")<0) s="<a class='button1 button1L' title='"+$translate("refresh")+"' href='javaScript:location.reload();'><i class='fa fa-bolt fa-lg'></i></a><span id=oWorkflowList1></span><a class='button1 button1R' title='"+$translate("close")+"' href='javaScript:window.close();'><i class='fa fa-times-circle fa-lg'></i></a>";else s="<a class='button1 button1L' title='"+$translate("back")+"' href='javaScript:history.back();'><i class='fa fa-angle-left fa-lg'></i></a><span id=oWorkflowList1></span><a class='button1 button1R' title='"+$translate("refresh")+"' href='javaScript:location.reload();'><i class='fa fa-bolt fa-lg'></i></a>";if(document.getElementById("oWorkflowList")) document.getElementById("oWorkflowList").innerHTML=s;else document.write(s);};function windowOpen(s,b){if(b||getCookie("colloaV8.appName")) location.href=s;else window.open(s);};function workflow(J,au,bx,bB){windowOpen("workflow.aspx?sid="+au+"&name="+escape(J)+"&"+bx,bB);};function workflowTask(J,aP){windowOpen("workflowTask.aspx?taskSid="+aP+"&name="+escape(J));};function workflowActionShow(J,aD,ao,ag,bc){var s="<a class='button' href='javascript:' onclick=\"javaScript:workflowAction('"+J+"',"+aD+","+ao+");return false;\">"+J+"</a>";if(ag)document.getElementById("_vWorkflowActionsShow").innerHTML=s+document.getElementById("_vWorkflowActionsShow").innerHTML;else document.getElementById("_vWorkflowActionsShow").innerHTML+=s;};function workflowActionsShow(J,aH){document.write("<br>"+(aH?"<div id=_vWorkflowActionsStatus style='float:left;'>"+aH+"</div>":""));document.write("<div id=_vWorkflowActionsShow align=right>");if(J){if(J=="okAllCancel"){workflowActionShow(translate["okAll"],2,0);workflowActionShow(translate["ok"],1,0);workflowActionShow(translate["cancel"],0,0);}else if(J=="okCancel"){workflowActionShow(translate["ok"],1,0);workflowActionShow(translate["cancel"],0,0);}else if(J=="okCancelWithForm"){workflowActionShow(translate["ok"],1,1);workflowActionShow(translate["cancel"],0,0);}else if(J=="saveOKCancelWithForm"){workflowActionShow(translate["saveDraft"],10,1);workflowActionShow(translate["saveAndQuit"],1,1);workflowActionShow(translate["cancel"],0,0);}else if(J=="ok"){workflowActionShow(translate["ok"],1,0);}else if(J=="cancel"){workflowActionShow(translate["cancel"],0,0);}else if(J=="cancelByOK"){workflowActionShow(translate["ok"],0,0);}else if(J=="quit"){workflowActionShow(translate["quit"],0,0);}else{var aK=J.split(",");for(var i=0;i<aK.length-1;i++){workflowActionShow(aK[i],1,1);}workflowActionShow(translate["cancel"],0,0);}}document.write("</div><br>");};function removeUrlAbsolute(l){if(!l||l.length==0)return "";var ak;var C=location.href;var bA=C.indexOf("http://");if(bA>=0){var aV=C.indexOf("/",bA+7);if(aV>0){var aW=C.indexOf("/",aV+1);if(aW>0){if(C.indexOf("/",aW+1)>0)ak=C.substring(bA,aW);else ak=C.substring(bA,aV);}}}return ak?l.replace(new RegExp(ak,"g"),".."):l;};function workflowAction(J,aD,ao){if(_eLastActiveSource){_eLastActiveSource.style.display="none";_eLastActiveSource=null;}if(aD==5){windowOpen("print.aspx"+location.search);return;}if(aD>0&&location.href.indexOf("/trial") >0){alert(translate["notAllowedForTrail"]);return;}if(formOnAction(aD,J,ao)>0){if(ao){var V=document.forms[0].getElementsByTagName("TEXTAREA");for(var i=0;i<V.length;i++){var e=V[i];if(e.id&&e.id.indexOf("e.")==0&&e.style.display=="none"){if(e.value.length>512000){alert($translate("ckeditor overflowed",e.value.length));return;}CKEDITOR.instances[e.id].destroy();}}V=document.forms[0].elements;for(var i=0;i<V.length;i++){var e=V[i];if(e.tagName=="INPUT"){if(e.type=="checkbox"||e.type=="radio"){if(e.checked)e.setAttribute("checked",true);else e.removeAttribute("checked");}else e.setAttribute("value",e.value);}else if(e.tagName=="TEXTAREA"){try{e.innerHTML=htmlEncode(e.value);}catch(err){}}}var ak;var C=location.href;var bA=C.indexOf("http://");if(bA>=0){var aV=C.indexOf("/",bA+7);if(aV>0){var aW=C.indexOf("/",aV+1);if(aW>0){if(C.indexOf("/",aW+1)>0)ak=C.substring(bA,aW);else ak=C.substring(bA,aV);}}}document.forms[1].viewState.value=(ak?document.forms[0].innerHTML.replace(new RegExp(ak,"g"),".."):document.forms[0].innerHTML).replace(new RegExp("style= ","g"),"");document.forms[1].action=(document.forms[1].action?document.forms[1].action:location.href)+'&action='+aD+"&actionName="+escape(J);_nContextId=0;document.forms[1].submit();}else if(aD>0&&document.forms.length>1){_nContextId=0;location.href=(document.forms[1].action?document.forms[1].action:location.href)+'&action='+aD+"&actionName="+escape(J)+"&viewState="+document.forms[1].viewState.value;}else{_nContextId=0;location.href=location.href+'&action='+aD+"&actionName="+escape(J);}}};

function catalogueOrderBy(vReserved) {
  var aTH=document.getElementsByTagName("TH");
  for(var i=0;i<aTH.length;i++) {
    if(aTH[i].id.indexOf("dbf.orderBy.")==0) {
      aTH[i].style.cursor="n-resize";
      aTH[i].onclick=function (evt) {
        var nPos=location.href.indexOf("&orderBy=");
        if(nPos>0) location.replace(location.href.substr(0,nPos+9)+this.id.replace("dbf.orderBy.","")+(location.href.indexOf("desc",nPos)>0?"":" desc"));
        else {
          nPos=location.href.indexOf("&page=");
          if(nPos>0) location.replace(location.href.substr(0,nPos)+"&orderBy="+this.id.replace("dbf.orderBy.",""));
          else location.replace(location.href+"&orderBy="+this.id.replace("dbf.orderBy.",""));
        }
      }
    }
  }
  var nPos=location.href.indexOf("&orderBy=");
  if(nPos>0) {
    for(var i=0;i<aTH.length;i++) {
      if(location.href.indexOf(aTH[i].id.replace("dbf.orderBy.",""),nPos)>0) {
        aTH[i].innerHTML+=(location.href.indexOf("desc",nPos)>0?" &darr;":" &uarr;");
        break;
      }
    }
  }
}

function formOnLoad() {
  var sSearch = location.search;
  var nPos = sSearch.indexOf("context=");
  if (nPos > 0) {
    sSearch = sSearch.substr(nPos + 8);
    nPos = sSearch.indexOf("&");
    if (nPos > 0)
      _nContextId = parseInt(sSearch.substr(0, nPos));
    else
      _nContextId = parseInt(sSearch);

    if(getCookie("colloaV8.appName") == null) {
      window.onbeforeunload = function () {
        if (_nContextId > 0) return (translate["pageNotSaved"]);
      }
      window.onunload = function () {
        if (_nContextId > 0) {
          ajax("../view/workflowStop.aspx?context=" + _nContextId + "&flag=1");
        }
      }
    }

    try { //no supported by some browsers on some mobiles
      var ec = document.getElementsByTagName("TEXTAREA");
      for (var i = 0; i < ec.length; i++) {
        var e = ec[i];
        if (e.id && e.id.indexOf("e.") == 0) {
            var st = e.parentNode.getAttribute("dbf.type");
            if (st && st.indexOf("html") >= 0) {
              e.value=htmlDecode(e.innerHTML);
              CKEDITOR.replace(e.id, { height: e.style.height, language: _sCkeditorLang }).on('focus', function (e) {
                if (_eLastActiveSource) {
                  _eLastActiveSource.style.display = "none";
                  _eLastActiveSource = null;
                }
              });
            }
        }
      }
    } catch(err) {}
  }
  else if(location.href.indexOf("finder.aspx")>0) {
    if(getCookie("colloaV8.viewType") == "viewPhone") return;
    var aWords = new Array(eWords, eWords2);
    for(var i=0; i<aWords.length; i++) {
      aWords[i].onfocus = function() {
        if(ecType == null || ecType.indexOf("date") < 0) return;
        var eFieldGetValueBySource = document.getElementById("fieldGetValueBySource."+this.id);
        if(eFieldGetValueBySource) {
          if (_eLastActiveSource) _eLastActiveSource.style.display = "none";
          eFieldGetValueBySource.style.display = "inline";
          _eLastActiveSource = eFieldGetValueBySource;
          _eLastActiveEvent = this;
        }
        else {
          eFieldGetValueBySource = document.createElement("DIV");
          eFieldGetValueBySource.id = "fieldGetValueBySource."+this.id;
          eFieldGetValueBySource.innerHTML = "<iframe src='../common/fieldDatetime.htm?words' style='width:100%;height:95%;' frameborder=0></iframe>";
          var oStyle = eFieldGetValueBySource.style;
          oStyle.position = "absolute";
          oStyle.zIndex = "10";
          oStyle.backgroundColor = "#fff";
          oStyle.cursor = "default";
          oStyle.border = "1px solid #ddd";
          oStyle.height = "250px";
          oStyle.width = (this.clientWidth+25)+"px";
          var eLoop = this;
          var nTop= eLoop.offsetParent.clientHeight;
          var nLeft= eLoop.offsetLeft;
          while(eLoop=eLoop.offsetParent) {nTop+=eLoop.offsetTop; nLeft+=eLoop.offsetLeft;}
          oStyle.top = nTop+"px";
          oStyle.left = nLeft+"px";
          document.body.appendChild(eFieldGetValueBySource);
          if (_eLastActiveSource) _eLastActiveSource.style.display = "none";
          _eLastActiveSource = eFieldGetValueBySource;
          _eLastActiveEvent = this;
        }
      }
    }
  }
    
  document.body.onclick = function (evt) {
    if (_eLastActiveSource) {
      var e;
      if (evt) e = evt.target; else e = event.srcElement;
      if (e != _eLastActiveEvent) {
        var x = 0; var y = 0;
        if (window.event) { x = event.clientX; y = event.clientY; }
        else { x = evt.clientX; y = evt.clientY; }
        if (x < _eLastActiveSource.offsetLeft || y < _eLastActiveSource.offsetTop || x > (_eLastActiveSource.offsetLeft + _eLastActiveSource.offsetWidth) || y > (_eLastActiveSource.offsetTop + _eLastActiveSource.offsetHeight)) {
          _eLastActiveSource.style.display = "none"; _eLastActiveSource = null;
        }
      }
    }
  }
  if (typeof(window.onLoad) == "function") onLoad();
}

function onFileUploadedDefault(sFieldName, sContentType, sName, sExtension, sFile, nSize) {
  if (sExtension == "doc" || sExtension == "docx" || sExtension == "dot" || sExtension == "wps") sExtension = "file-word-o";
  else if (sExtension.indexOf("xls") == 0) sExtension = "file-excel-o";
  else if (sExtension.indexOf("ppt") == 0) sExtension = "file-powerpoint-o";
  else if (sExtension == "pdf")  sExtension = "file-pdf-o";
  else if (sExtension == "jpg" || sExtension == "jpeg" || sExtension == "gif" || sExtension == "png" || sExtension == "bmp" || sExtension == "tif" || sExtension == "pic") sExtension = "file-image-o";
  else if (sExtension == "txt" || sExtension == "htm" || sExtension == "html") sExtension = "file-text-o";
  else if (sExtension == "mp3" || sExtension == "mid" || sExtension == "wav" || sExtension == "au") sExtension = "file-audio-o";
  else if (sExtension == "rm" || sExtension == "mpg" || sExtension == "mpeg" || sExtension == "mov" || sExtension == "wmv" || sExtension == "avi") sExtension = "file-video-o";
  else if (sExtension == "zip" || sExtension == "rar" || sExtension == "iso" || sExtension == "arj" || sExtension == "gz" || sExtension == "z") sExtension = "file-archive-o";
  else sExtension = "file-o";
  var sSource = _eLastActiveEvent.parentNode.getAttribute("dbf.source");
  if (sSource.indexOf("file.image") == 0)
    _eLastActiveEvent.parentNode.lastChild.innerHTML = "<img src='../view/file.aspx?attachment=1&name=" + encodeURIComponent(sName) + "&contentType=" + encodeURIComponent(sContentType) + "&file=" + encodeURIComponent(sFile) + "' border=0>";
  else if (sSource.indexOf("files") == 0)
    _eLastActiveEvent.parentNode.lastChild.innerHTML += "<a href='javaScript:' onclick=\"javaScript:windowOpen('../view/file.aspx?attachment=1&name=" + encodeURIComponent(sName) + "&contentType=" + encodeURIComponent(sContentType) + "&file=" + encodeURIComponent(sFile) + "');return false;\"><i class='fa fa-" + sExtension + " fa-lg'></i>&nbsp;" + sName + "</a> (" + (parseInt(nSize / 1024) + 1) + "k) ";
  else
    _eLastActiveEvent.parentNode.lastChild.innerHTML = "<a href='javaScript:' onclick=\"javaScript:windowOpen('../view/file.aspx?attachment=1&name=" + encodeURIComponent(sName) + "&contentType=" + encodeURIComponent(sContentType) + "&file=" + encodeURIComponent(sFile) + "');return false;\"><i class='fa fa-" + sExtension + " fa-lg'></i>&nbsp;" + sName + "</a> (" + (parseInt(nSize / 1024) + 1) + "k) ";
}
function onFieldFileUploaded(sFieldName, sContentType, sName, sExtension, sFile, nSize) {
  if (_eLastActiveSource) {
    _eLastActiveSource.style.display = "none";
    _eLastActiveSource = null;
  }
  if (typeof(window.onFileUploaded) == "function") {
    onFileUploaded(sFieldName, sContentType, sName, sExtension, sFile, nSize);
  }
  else if(_eLastActiveEvent) {
    onFileUploadedDefault(sFieldName, sContentType, sName, sExtension, sFile, nSize);
    if (typeof(window.onFileUploadedAfter) == "function") {
      onFileUploadedAfter(sFieldName, sContentType, sName, sExtension, sFile, nSize);
    }
  }
}

function quickFilter(aO,l,bI){if(l.length>0){var ll=l.toLowerCase();for(var i=bI;i<aO.length;i++){if(aO[i].childNodes[0].tagName=="INPUT"&&aO[i].childNodes[0].name.toLowerCase().indexOf(ll)>=0)aO[i].style.display="block";else aO[i].style.display="none";}}else{for(var i=bI;i<aO.length;i++){aO[i].style.display="block";}}};

function workflowListOne(sUrlX, sName, nWorkflowId, sPicture, nCatalogue, sObjects, bPortal, bSelf) {
  var s = "<a href=\"";
  if(sUrlX.indexOf("javaScript:")>=0){
    s += sUrlX;
  }
  else{
   s += "javaScript:";
   if(sObjects) {
    if(sObjects.indexOf("catalogueSelection")==0)
      s += "var sObjects="+sObjects+";if(sObjects) windowOpen('"+sUrlX+"?sid="+nWorkflowId+"&name="+escape(sName)+"&catalogue="+nCatalogue+"&objects='+sObjects";
    else
      s += "windowOpen('"+sUrlX+"?sid="+nWorkflowId+"&name="+escape(sName)+"&catalogue="+nCatalogue+(sObjects.indexOf("&")!=0?"&objects=":"")+sObjects+"'";
    }
   else if(nWorkflowId){
    s += "windowOpen('"+sUrlX+"?sid="+nWorkflowId+"&name="+escape(sName)+"&catalogue="+nCatalogue+"'";
   }
   else {
    s += "windowOpen('"+sUrlX+"'";
   }
   s += (bSelf?",1":"")+");";
  }
  if(bPortal) document.write(s+"\" class='buttonPortal' title='"+sName+"'>"+sPicture+"</a>");
  else document.getElementById("oWorkflowList1").innerHTML += s+"\" class='button1 button1M'>"+(sPicture&&sPicture.indexOf("fa-plus")>0?"&#10010; ":"")+sName+"</a>";
}
function workflowListOneByPhone(sUrlX, sName, nWorkflowId, sPicture, nCatalogue, sObjects) {
  var s = "<a href=\"";
  if(sUrlX.indexOf("javaScript:")>=0){
    s += sUrlX;
  }
  else{
   s += "javaScript:";
   if(sObjects) {
    if(sObjects.indexOf("catalogueSelection")==0)
      s += "var sObjects="+sObjects+";if(sObjects) windowOpen('"+sUrlX+"?sid="+nWorkflowId+"&name="+escape(sName)+"&catalogue="+nCatalogue+"&objects='+sObjects";
    else
      s += "windowOpen('"+sUrlX+"?sid="+nWorkflowId+"&name="+escape(sName)+"&catalogue="+nCatalogue+(sObjects.indexOf("&")!=0?"&objects=":"")+sObjects+"'";
    }
   else if(nWorkflowId){
    s += "windowOpen('"+sUrlX+"?sid="+nWorkflowId+"&name="+escape(sName)+"&catalogue="+nCatalogue+"'";
   }
   else {
    s += "windowOpen('"+sUrlX+"'";
   }
   s += ");";
  }
  s += "\">"+sPicture.replace(" fa-lg","")+" "+sName+"</a>";
  if(document.getElementById("oWorkflowList")) {
    document.getElementById("oWorkflowList").innerHTML += s;
    var o=document.getElementById("colloaWorkflow");
    if(o && o.innerHTML.length==0){
      o.onclick=function(){if(document.getElementById('oWorkflowList').style.display=='none') document.getElementById('oWorkflowList').style.display='block';else document.getElementById('oWorkflowList').style.display='none';}
      o.innerHTML="<img src='../phone/more.png' width=24px>";
    }
  }
  else document.write(s);
}
function fieldGetValueBySource(sFieldName, eEvent) {
  var eField = eEvent.parentNode;
  var sSource = eField.getAttribute("dbf.source");
  var sFieldGetValueBySource = "fieldGetValueBySource." + sFieldName;
  var eFieldGetValueBySource = document.getElementById(sFieldGetValueBySource);
  if (eFieldGetValueBySource) {
    if (eFieldGetValueBySource.style.display=="none"||_eLastActiveEvent != eEvent) {
      if (_eLastActiveSource) _eLastActiveSource.style.display = "none";
      if (sSource.indexOf("prompt:") >= 0) {
        var sPrompt = eField.lastChild.innerHTML.replace("<br>","").replace(/&nbsp;/g, "").replace(/(^\s*)|(\s*$)/g, "");
        if (typeof(window.onFieldPromptBefore)=="function" && sSource.indexOf("select") < 0) {
          if(sPrompt != eFieldGetValueBySource.getAttribute("lastPrompt")) {
            eFieldGetValueBySource.setAttribute("lastPrompt", sPrompt);
            sPrompt = onFieldPromptBefore(eField, sPrompt);
            if(sPrompt.indexOf("select") == 0) eFieldGetValueBySource.innerHTML = ajax("invoke.aspx?key=table"+(eField.getAttribute("dbf.colMax")?"&colMax="+eField.getAttribute("dbf.colMax"):"")+"&objects="+escape(sPrompt));
            else if(sPrompt.length > 0) eFieldGetValueBySource.innerHTML = sPrompt;
          }
        }
        else {
          if(sPrompt.indexOf('"')>=0||sPrompt.indexOf("'")>=0||sPrompt.indexOf("%")>=0||sPrompt.indexOf("#")>=0) {
            eFieldGetValueBySource.setAttribute("lastPrompt", "");
            eFieldGetValueBySource.innerHTML = "* "+translate["promptRequiredWithout"]+"\" ' % #";
          }
          else if(sPrompt != eFieldGetValueBySource.getAttribute("lastPrompt")){
            eFieldGetValueBySource.setAttribute("lastPrompt", sPrompt);
            eFieldGetValueBySource.innerHTML = ajax("invoke.aspx?key=table"+(eField.getAttribute("dbf.colMax")?"&colMax="+eField.getAttribute("dbf.colMax"):"")+"&objects="+escape(sSource.substr(sSource.indexOf("prompt:")+7).replace("[!prompt]",sPrompt)));
          }
        }
      }
      else if (sSource.indexOf("list2:") >= 0) {
        if(typeof(window.onFieldBefore)=="function") {
          var sInnerHTML = "";
          var v = window.onFieldBefore(eField);
          if(typeof(v)=="object") { //Array object
            for(var i=0; i<v.length; i++) {
              sInnerHTML += "<div onmouseover=\"this.className='fieldEditable';\" onmouseout=\"this.className='';\" id=\"" + v[i][0] + "\" style='height:auto;'>" + v[i][1] + "</div>";
            }
            eFieldGetValueBySource.innerHTML = sInnerHTML;
          }
          else if(typeof(v)=="string"&&v.length>0) {
            var aValues = v.split(",");
            for(var i=0; i<aValues.length; i++) {
              var aValue = aValues[i].split("=");
              sInnerHTML += "<div onmouseover=\"this.className='fieldEditable';\" onmouseout=\"this.className='';\" id=\"" + aValue[0] + "\" style='height:auto;'>" + aValue[1] + "</div>";
            }
            eFieldGetValueBySource.innerHTML = sInnerHTML;
          }
        }
      }
      else if (sSource.indexOf("list:") >= 0) {
        if(typeof(window.onFieldBefore)=="function") {
          var s = window.onFieldBefore(eField);
          if(typeof(s)=="string"&&s.length>0) {
            var aValues =  s.split(",");
            var sInnerHTML = "";
            for(var i=0; i<aValues.length; i++) {
              sInnerHTML += "<div id='0' onmouseover=\"this.className='fieldEditable';\" onmouseout=\"this.className='';\" style='height:auto;'>" + aValues[i] + "</div>";
            }
            eFieldGetValueBySource.innerHTML = sInnerHTML;
          }
        }
      }
      else if(typeof(window.onFieldBefore)=="function") {
        window.onFieldBefore(eField); //used for data checking or synchronizing 
      }
      setFieldSourceStyle(eFieldGetValueBySource, eEvent, eField, sSource, false);
      eFieldGetValueBySource.style.display = "inline";
      _eLastActiveSource = eFieldGetValueBySource;
      _eLastActiveEvent = eEvent;
    }
    else {
      eFieldGetValueBySource.style.display = "none";
      _eLastActiveSource = null;
    }
  }
  else{
    if (sSource) {
      if (_eLastActiveSource) _eLastActiveSource.style.display = "none";
      var eNew = document.createElement("DIV");
      eNew.id = sFieldGetValueBySource;
      if (sSource.indexOf("prompt:") >= 0) {
        var sPrompt = eField.lastChild.innerHTML.replace("<br>","").replace(/&nbsp;/g, "").replace(/(^\s*)|(\s*$)/g, "");
        if (typeof(window.onFieldPromptBefore)=="function" && sSource.indexOf("select") < 0) {
          eNew.setAttribute("lastPrompt", sPrompt);
          sPrompt = onFieldPromptBefore(eField, sPrompt);
          if(sPrompt.indexOf("select") == 0) eNew.innerHTML = ajax("invoke.aspx?key=table"+(eField.getAttribute("dbf.colMax")?"&colMax="+eField.getAttribute("dbf.colMax"):"")+"&objects="+escape(sPrompt));
          else if(sPrompt.length > 0) eNew.innerHTML = sPrompt;
        }
        else {
          if(sPrompt.indexOf('"')>=0||sPrompt.indexOf("'")>=0||sPrompt.indexOf("%")>=0||sPrompt.indexOf("#")>=0) {
            eNew.setAttribute("lastPrompt", "");
            eNew.innerHTML = "* "+translate["promptRequiredWithout"]+"\" ' % #";
          }
          else {
            eNew.setAttribute("lastPrompt", sPrompt);
            eNew.innerHTML = ajax("invoke.aspx?key=table"+(eField.getAttribute("dbf.colMax")?"&colMax="+eField.getAttribute("dbf.colMax"):"")+"&objects="+escape(sSource.substr(sSource.indexOf("prompt:")+7).replace("[!prompt]",sPrompt)));
          }
        }
        eNew.onclick = function (evt) {
          var e; if(window.event) { event.cancelBubble = true; e = event.srcElement; } else { evt.stopPropagation(); e = evt.target; }
          if (e.tagName=="TD") {
            var ecTDs = e.parentNode.childNodes;
            if(ecTDs[0].getAttribute("dbf.key") != null) _eLastActiveEvent.parentNode.setAttribute("dbf.key", ecTDs[0].getAttribute("dbf.key"));
            _eLastActiveEvent.parentNode.setAttribute("dbf.value", ecTDs[0].innerHTML); //remember the value then check changed or not while submitting
            _eLastActiveEvent.parentNode.lastChild.innerHTML = ecTDs[0].innerHTML;
            this.setAttribute("lastPrompt", ecTDs[0].innerHTML);
            if(typeof(window.onFieldPromptAfter)=="function")
              onFieldPromptAfter(_eLastActiveEvent.parentNode, ecTDs);
            this.style.display = "none";
            _eLastActiveSource = null;
          }
        }
      }
      else if (sSource.indexOf("files")==0) {
        if (sSource.indexOf("(") > 0 && sSource.indexOf(")") > 0)
          eNew.innerHTML = "<iframe src='fieldFile.aspx?type=" + sSource.substring(sSource.indexOf("(") + 1, sSource.indexOf(")")) + "&field=" + sFieldName + "&n=5' style='width:100%;height:100%;' frameborder=0></iframe>";
        else
          eNew.innerHTML = "<iframe src='fieldFile.aspx?field=" + sFieldName + "&n=5' style='width:100%;height:95%;' frameborder=0></iframe>";
      }
      else if (sSource.indexOf("file")==0) {
        if (sSource.indexOf("(") > 0 && sSource.indexOf(")") > 0)
          eNew.innerHTML = "<iframe src='fieldFile.aspx?type=" + sSource.substring(sSource.indexOf("(") + 1, sSource.indexOf(")")) + "&field=" + sFieldName + "' style='width:100%;height:100px;' frameborder=0></iframe>";
        else
          eNew.innerHTML = "<iframe src='fieldFile.aspx?field=" + sFieldName + "' style='width:100%;height:95%;' frameborder=0></iframe>";
      }
      else if (sSource.indexOf("datetime")==0) {
        eNew.innerHTML = "<iframe src='../common/fieldDatetime.htm?" + sSource + "' style='width:100%;height:95%;' frameborder=0></iframe>";
      }
      else if (sSource.indexOf("date")==0) {
        eNew.innerHTML = "<iframe src='../common/fieldDate.htm?" + sSource + "' style='width:100%;height:95%;' frameborder=0></iframe>";
      }
      else if (sSource.indexOf("time") == 0) {
        eNew.innerHTML = "<iframe src='../common/fieldTime.htm?" + sSource + "' style='width:100%;height:95%;' frameborder=0></iframe>";
      }
      else if (sSource.indexOf("signature")==0) {
        eNew.innerHTML = ajax("catalogue1.aspx?name=form.fieldSource.signature");
        eNew.onclick = function (evt) {
            var e; if(window.event) { event.cancelBubble = true; e = event.srcElement; } else { evt.stopPropagation(); e = evt.target; }
            if (e.id && e!=this) {
						_eLastActiveEvent.parentNode.lastChild.innerHTML = (e.id=="0") ? "" : e.getAttribute("_pictureX");
            this.style.display = "none";
            _eLastActiveSource = null;
          }
        }
      }
      else if (sSource.indexOf("images:")==0) {
        var sInnerHTML = "";
        var aValues = sSource.substr(7).split(",");
        for(var i=0; i<aValues.length; i++) {
          sInnerHTML += "<img id='0' style='cursor:pointer;' src='" + aValues[i] + "'> ";
        }
        eNew.innerHTML = sInnerHTML;
        eNew.onclick = function (evt) {
          var e; if(window.event) { event.cancelBubble = true; e = event.srcElement; } else { evt.stopPropagation(); e = evt.target; }
					if (e.id && e.tagName=="IMG") {
            _eLastActiveEvent.parentNode.lastChild.innerHTML = "<img border=0 src='"+e.src+"'>";
            this.style.display = "none";
            _eLastActiveSource = null;
          }
        }
      }
      else if (sSource.indexOf("list2:")==0) {
        var sInnerHTML = "";
        if(typeof(window.onFieldBefore)=="function") {
          var v = window.onFieldBefore(eField);
          if(typeof(v)=="object") { //Array object
            for(var i=0; i<v.length; i++) {
              sInnerHTML += "<div onmouseover=\"this.className='fieldEditable';\" onmouseout=\"this.className='';\" id=\"" + v[i][0] + "\" style='height:auto;'>" + v[i][1] + "</div>";
            }
          }
          else if(typeof(v)=="string"&&v.length>0) sSource = v;
          else sSource = sSource.substr(6);
        }
        else
          sSource = sSource.substr(6);
        if(sInnerHTML.length==0) {
          var aValues = sSource.split(",");
          for(var i=0; i<aValues.length; i++) {
            var aValue = aValues[i].split("=");
            sInnerHTML += "<div onmouseover=\"this.className='fieldEditable';\" onmouseout=\"this.className='';\" id=\"" + aValue[0] + "\" style='height:auto;'>" + aValue[1] + "</div>";
          }
        }
        eNew.innerHTML = sInnerHTML;
        eNew.onclick = function (evt) {
          var e; if(window.event) { event.cancelBubble = true; e = event.srcElement; } else { evt.stopPropagation(); e = evt.target; }
          if (e.id && e!=this) {
            if(_eLastActiveEvent.parentNode.getAttribute("dbf.key")!=null) _eLastActiveEvent.parentNode.setAttribute("dbf.key",e.id);
            _eLastActiveEvent.parentNode.lastChild.innerHTML = e.innerHTML;
            this.style.display = "none";
            _eLastActiveSource = null;
          }
        }
      }
      else if (sSource.indexOf("list:")==0) {
        if(typeof(window.onFieldBefore)=="function") {
          var s = window.onFieldBefore(eField);
          if(typeof(s)=="string"&&s.length>0) sSource = s;
          else sSource = sSource.substr(5);
        }
        else
          sSource = sSource.substr(5);
        var aValues =  sSource.split(",");
        var sInnerHTML = "";
        for(var i=0; i<aValues.length; i++) {
          sInnerHTML += "<div id='0' onmouseover=\"this.className='fieldEditable';\" onmouseout=\"this.className='';\" style='height:auto;'>" + aValues[i] + "</div>";
        }
        eNew.innerHTML = sInnerHTML;
        eNew.onclick = function (evt) {
          var e; if(window.event) { event.cancelBubble = true; e = event.srcElement; } else { evt.stopPropagation(); e = evt.target; }
          if (e.id && e!=this) {
            _eLastActiveEvent.parentNode.lastChild.innerHTML = e.innerHTML;
            this.style.display = "none";
            _eLastActiveSource = null;
          }
        }
      }
      else {
        eNew.innerHTML = ajax("catalogue1.aspx?pageRows=200&name=" + (sSource.indexOf("select ")==0?sSource.indexOf(",stype")>0?"form.fieldSource.tree&sql=":"form.fieldSource.list&sql=":"") + sSource);
        eNew.onclick = function (evt) {
          var e; if(window.event) { event.cancelBubble = true; e = event.srcElement; } else { evt.stopPropagation(); e = evt.target; }
          if (e.tagName=="INPUT" && e.type=="checkbox") {
            var ec = this.getElementsByTagName("INPUT"); var s = ""; var s2 = "";
            for (var i = 0; i < ec.length; i++) { e = ec[i]; if (e.type=="checkbox" && e.checked) { s += e.id + ","; s2 += e.name + ","; } }
            if(_eLastActiveEvent.parentNode.getAttribute("dbf.key")!=null) _eLastActiveEvent.parentNode.setAttribute("dbf.key", s);
            _eLastActiveEvent.parentNode.lastChild.innerHTML = s2;
          }
          else if (e.id && e!=this) {
            if(_eLastActiveEvent.parentNode.getAttribute("dbf.key")!=null) _eLastActiveEvent.parentNode.setAttribute("dbf.key",e.id);
            _eLastActiveEvent.parentNode.lastChild.innerHTML = e.innerHTML;
            this.style.display = "none";
            _eLastActiveSource = null;
          }
        }
        //initilize
        var s = eField.lastChild.innerHTML;
        var ec = eNew.getElementsByTagName("INPUT"); var e;
        for (var i = 0; i < ec.length; i++) { e = ec[i]; if (e.type=="checkbox" && s.indexOf(e.name + ",") >= 0) { e.setAttribute("checked", true); } }
      }
      setFieldSourceStyle(eNew, eEvent, eField, sSource, true);
      document.body.appendChild(eNew);
      _eLastActiveSource = eNew;
      _eLastActiveEvent = eEvent;
    }
  }
}
function setFieldSourceStyle(eSource, eEvent, eField, sSource, bInit) {
  if(getCookie("colloaV8.viewType")=="viewPhone") {
    if(eSource.innerHTML.indexOf("times-circle")<0) eSource.innerHTML="<div style='position:fixed;top:15px;right:15px;' onclick=\"document.getElementById('"+eSource.id+"').style.display='none';void(0);\"><i class='fa fa-times-circle fa-2x'></i></div>"+eSource.innerHTML;
    if(bInit) {
      var oStyle = eSource.style;
      oStyle.position = "fixed";
      oStyle.zIndex = "10";
      oStyle.backgroundColor = "#fff";
      oStyle.cursor = "default";
      oStyle.border = "10px solid #ddd";
      oStyle.boxSizing="border-box";
      oStyle.padding = "10px";
      oStyle.overflowX = "hidden";
      oStyle.overflowY = "auto";
      oStyle.width="100%";
      oStyle.height="100%";
      oStyle.top="0px";
      oStyle.left="0px";
      oStyle.overflow="auto";
    }
  }
  else {
    var oStyle = eSource.style;
    if(bInit) {
      oStyle.position = "absolute";
      oStyle.zIndex = "10";
      oStyle.backgroundColor = "#fff";
      oStyle.cursor = "default";
      oStyle.border = "1px solid #ddd";
      oStyle.boxSizing="border-box";
      oStyle.padding = "5px";
      oStyle.overflowX = "hidden";
      oStyle.overflowY = "auto";
      oStyle.height = "250px";
      var vWidth = eField.clientWidth;
      oStyle.width = (eField.getAttribute("dbf.width") ? eField.getAttribute("dbf.width") : (sSource.indexOf("file")==0 ? (vWidth > 500 ? vWidth-40 : 500) : (vWidth > 350 ? vWidth-40 : 350)))+"px";
    }
    var eLoop = eEvent;
    var nTop= eLoop.offsetParent.clientHeight;
    var nLeft= 0;
    while(eLoop=eLoop.offsetParent) {nTop+=eLoop.offsetTop; nLeft+=eLoop.offsetLeft;}
    oStyle.top = nTop+"px";
    oStyle.left = nLeft+"px";
  }
}

function fieldCheckByForm(bP,l,e){var bC=l.replace("<br>","").replace(/&nbsp;/g," ").replace(/(^\s*)|(\s*$)/g,"");var F=1;if(bP){if(F>0&&bP.indexOf("required")>=0&&bC.length==0){alert(translate["inputRequired"]);F=0;}if(F>0&&bP.indexOf("required!0")>=0&&l=="0"){alert(translate["inputRequired"]);F=0;}if(F>0&&bP.indexOf("!quotation")>=0&&(l.indexOf("\"")>=0||l.indexOf("'")>=0)){alert(translate["quotationForbidden"]);F=0;}if(F>0&&bC.length>0&&bP.indexOf("number")>=0&& !(/^-?\d+$/.test(bC))){alert(translate["numberRequired"]);F=0;}if(F>0&&bC.length>0&&bP.indexOf("number+")>=0&&Number(bC)<=0){alert(translate["numberRequired"]+" (>0)");F=0;}if(F>0&&bC.length>0&&bP.indexOf("amount")>=0&& !(/^-?\d+\.?\d{0,2}$/.test(bC))){alert(translate["amountRequired"]);F=0;}if(F>0&&bC.length>0&&bP.indexOf("amount+")>=0&&Number(bC)<=0){alert(translate["amountRequired"]+" (>0)");F=0;}if(F>0&&bC.length>0&&bP.indexOf("date")>=0){bC=bC.replace("<br>","");var reg=/^(\d+)\/(\d{1,2})\/(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;var r=bC.match(reg);if(r){r[2]=r[2]-1;var d=new Date(r[1],r[2],r[3],r[4],r[5],r[6]);if(d.getFullYear()!=r[1]||d.getMonth()!=r[2]||d.getDate()!=r[3]||d.getHours()!=r[4]||d.getMinutes()!=r[5]||d.getSeconds()!=r[6])F=0;}else{reg=/^(\d+)\/(\d{1,2})\/(\d{1,2})$/;r=bC.match(reg);if(r){r[2]=r[2]-1;var d=new Date(r[1],r[2],r[3]);if(d.getFullYear()!=r[1]||d.getMonth()!=r[2]||d.getDate()!=r[3])F=0;}else{F=0;}}if(F>0){if(e.tagName=="DIV")e.innerHTML=bC;}else alert(translate["dateRequired"]);}if(F>0){var n=bP.indexOf("unique(");if(n>=0){var s=bP.substr(n+7);s=s.substr(0,s.indexOf(")"));var bQ;var bN;if(s.indexOf(" where ")>0){bQ=s.substr(s.indexOf(" where "))+" and ";s=s.substr(0,s.indexOf(" where "));}else{bQ=" where ";}if(s.indexOf(".")>0){bN=s.substr(s.indexOf(".")+1);s=s.substr(0,s.indexOf("."));}else{bN=e.id.substr(e.id.lastIndexOf(".")+1);}if(bP.indexOf("number")>=0)s="select count(*) from "+s+bQ+bN+"="+l;else s="select count(*) from "+s+bQ+bN+"=\""+l.replace("\"","\"\"")+"\"";if(ajax("catalogue1.aspx?name=form.fieldScalar&sql="+escape(s))!="0"){alert(translate["uniqueRequired"]);F=0;}}}if(F>0&&l!="0"){var n=bP.indexOf("existed(");if(n>=0){var s=bP.substr(n+8);s=s.substr(0,s.indexOf(")"));var bN;if(s.indexOf(".")>0){bN=s.substr(s.indexOf(".")+1);s=s.substr(0,s.indexOf("."));}else{bN=e.id.substr(e.id.lastIndexOf(".")+1);}if(bP.indexOf("number")>=0)s="select count(*) from "+s+" where "+bN+"="+l;else s="select count(*) from "+s+" where "+bN+"=\""+l.replace("\"","\"\"")+"\"";if(ajax("catalogue1.aspx?name=form.fieldScalar&sql="+escape(s))=="0"){alert(translate["existRequired"]);F=0;}}}}return F;};

function fieldsCheckByForm() {
  var ec = document.getElementsByTagName("INPUT");
  for (var i = 0; i < ec.length; i++) {
    var e = ec[i];
    if (e.type=="number" && !e.validity.valid) { // supported by html5
      if(e.getAttribute("step")=="1") alert(translate["numberRequired"]);
      else alert(translate["amountRequired"]);
      e.style.backgroundColor = "lightyellow";
      e.focus();
      return 0;
    }
    if (e.type=="text"||e.type=="number") {
      if(e.id && e.id.indexOf("e.")==0) {
        if (fieldCheckByForm(e.parentNode.getAttribute("dbf.type"), e.value, e)==0) {
          e.style.backgroundColor = "lightyellow";
          e.focus();
          return 0;
        }
        else e.style.backgroundColor = "";
      }
      else if(e.getAttribute("dbf.type")) {
        if (fieldCheckByForm(e.getAttribute("dbf.type"), e.value, e)==0) {
          e.focus();
          return 0;
        }
        else e.style.backgroundColor = "";
      }
    }
  }
  ec = document.getElementsByTagName("DIV");
  for (var i = 0; i < ec.length; i++) {
    var e = ec[i];
    if (e.id && e.id.indexOf("e.")==0) {
      var ep = e.parentNode;
      if(ep.getAttribute("dbf.source")&&ep.getAttribute("dbf.source").indexOf("prompt:")>=0&& ep.getAttribute("dbf.key")!=null && ep.getAttribute("dbf.value")!=null){
        if(ep.getAttribute("dbf.value") != e.innerHTML){ //value changed after prompted choosing
          if(e.innerHTML.replace("<br>","").replace(/&nbsp;/g, " ").replace(/(^\s*)|(\s*$)/g, "").length>0 && ep.getAttribute("dbf.type").indexOf("checkPrompt")>=0){
            e.style.backgroundColor = "lightyellow";
            alert(translate["inputRequired"]);
            return 0;
          }
          else {
            e.style.backgroundColor = "";
            ep.setAttribute("dbf.key","0");
          }
        }
      }
      if (fieldCheckByForm(ep.getAttribute("dbf.type"), ep.getAttribute("dbf.key")||e.innerHTML, e)==0) {
        if(e.getAttribute("contentEditable") || e.innerHTML.length>0) e.style.backgroundColor = "lightyellow";
        else ep.style.backgroundColor = "lightyellow";
        return 0;
      }
      else e.style.backgroundColor = "";
    }
  }
  ec = document.getElementsByTagName("TEXTAREA");
  for (var i = 0; i < ec.length; i++) {
    var e = ec[i];
    if (e.id && e.id.indexOf("e.")==0) {
      if (e.style.display=="none") {
        e.value = CKEDITOR.instances[e.id].getData();
        if (fieldCheckByForm(e.parentNode.getAttribute("dbf.type"), e.value, e)==0) {
          CKEDITOR.instances[e.id].focus();
          return 0;
        }
      }
      else {
        if (fieldCheckByForm(e.parentNode.getAttribute("dbf.type"), e.value, e)==0) {
          e.style.backgroundColor = "lightyellow";
          e.focus();
          return 0;
        }
        else e.style.backgroundColor = "";
      }
    }
  }
  return 1;
}

function formOnAction(aD,J,ao){var F=1;if(typeof(window.onActionBefore)=="function")F=onActionBefore(aD,J,ao);if(F==1&&aD>0&&location.href.indexOf("formToSelectResponsor")<0)F=fieldsCheckByForm();if(F==1&&typeof(window.onActionAfter)=="function")F=onActionAfter(aD,J,ao);return F;};function _slide(ar){var o=document.getElementById(ar);var a=o.getElementsByTagName("a");var b=false,i=0;if(a.length>1){var s="<div align=right style='margin:-30px 20px 0px 0px;'><img src='../images/dotGray.gif' onmouseover='_"+ar+".change(0);'>";for(i=1;i<a.length;i++){a[i].style.display="none";s+="<img src='../images/dotGray.gif' onmouseover='_"+ar+".change("+i+");'>";}o.innerHTML+=s+"</div>";i=0;setInterval("_"+ar+".change();",8000);}this.change=function(j){if(j!=null){a[i].style.display='none';i=j;a[i].style.display='inline';b=true;}else{if(b) b=false;else{a[i].style.display="none";if(++i>=a.length) i=0;a[i].style.display="inline";}}}};function $slide(ar){return (new _slide(ar));}