var interval;
var triggerList;
var Chrome_Extension_CommonMousePointElement;
var bodyDimensions = document.body.getBoundingClientRect();
var scriptElem = document.createElement("script");
scriptElem.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js";
document.head.appendChild(scriptElem);


function asapZDTT() {};

asapZDTT.prototype.hoverEvent = function(e) {
    console.log(this);
}

asapZDTT.prototype.registerTooltipElement = function(obj) {
    var element = document.querySelector(obj.element);
    if (element != undefined) {
        if (obj.event == "HOVER") {
            var func = zd_tt_onhover(obj);
            element.addEventListener('mouseover', func, true);
            element.addEventListener('mouseleave', function Chrome_Extension_hide(e) {
                setTimeout(function() {
                    document.addEventListener('mouseover', Chrome_Extension_hideTooltip, true)
                }, 1000);
            });
        } else if (obj.event == "CLICK") {
            var func = zd_tt_onclick(obj);
            element.addEventListener('click', func, true);
        }
    }
};

function deletePopup(e) {
    document.removeEventListener("scroll", deletePopup);
    if (document.body.children.Chrome_Extension_showContentId); {
        while (document.body.children.Chrome_Extension_showContentId) {
            document.body.removeChild(document.getElementById("Chrome_Extension_showContentId"));
        }
    }
    document.removeEventListener("mouseover", Chrome_Extension_hideTooltip, true);

}

asapZDTT.prototype.caller = function(list) {
    for (var i = 0; i < list.length; i++) {
        console.log(list[i] , "levins");
        var obj = list[i] ;
        var parseObj={};
        parseObj.content=obj.components["0"].content;
        parseObj.element = obj.triggers["0"].element ;
        parseObj.event = obj.triggers["0"].event ;
        parseObj.style = {} ;
        parseObj.articleId = obj.components["0"].solutionId;
        parseObj.style.position = "top";
        if(typeof(obj.preferences) != "object"){
            obj.preferences=JSON.parse(obj.preferences);
        }
        if(obj.preferences.selector!=undefined && obj.preferences.selector!="undefined"){
            parseObj.anchorId = obj.preferences.selector ;
        }
        parseObj.style.bgColor = obj.preferences.bgColor ;
        parseObj.style.viewSize = obj.preferences.viewSize ;
        parseObj.arrow = true ;
        parseObj.init = function(){"init callback called"};
        parseObj.ready = function(){"ready callback called"};
        parseObj.onShown = function(){"onshown callback called"};
        parseObj.onBefourShow = function(){"befour of onShown callback called"} 
        this.registerTooltipElement(parseObj);
    }
};

function zd_tt_onclick(details) {
    return function(e) {
        this.details = {};
        this.details.obj = details;
        document.removeEventListener("scroll", deletePopup);
        document.addEventListener("scroll", deletePopup);
        setTimeout(elementMouseOverListener.bind(this.details, e), 400);
    }
};


function zd_tt_onhover(details) {
    return function(e) {
        this.details = {};
        this.details.obj = details;
        clearInterval(interval);
        document.removeEventListener("scroll", deletePopup);
        document.addEventListener("scroll", deletePopup);
        document.addEventListener('mouseover', TempMouseOver, true);
        interval = setTimeout(elementMouseOverListener.bind(this.details, e), 400);
    }
};

var zd_tt_toolTip = new asapZDTT();



var Zohodesk_Chrome_Extension_Update_Configure_Snippet_Url = "https://desk.zoho.com/portal/api/extensions/124509000000486002/messages?orgId=629583843";

var intervel = setInterval(function() {
    if ($) {
        request();
    }
}, 1000)

function request() {
    clearInterval(intervel)
    $.get(Zohodesk_Chrome_Extension_Update_Configure_Snippet_Url, function(data, status) {
        zd_tt_toolTip.caller(data);
        console.log(status);
    });
}




/* userside show old codes start */

function Chrome_Extension_popupdesign() {
    var Chrome_Extension_ttdesign = document.createElement("div");
    Chrome_Extension_ttdesign.setAttribute("id", "Chrome_Extension_showContentId");
    Chrome_Extension_ttdesign.setAttribute("class", "zohodesk-Tooltip-showContentClass zohodesk-Tooltip-tooltip-hide");
    document.body.appendChild(Chrome_Extension_ttdesign);
    document.getElementById("Chrome_Extension_showContentId").innerHTML = `<div style="height: 0; width: 0; position: absolute; visibility: hidden">
        <svg xmlns="http://www.w3.org/2000/svg">
            <symbol id="Tooltip-close" viewBox="0 0 32 32">
    <path d="M16,0.4C7.4,0.4,0.4,7.4,0.4,16s7,15.6,15.6,15.6s15.6-7,15.6-15.6S24.6,0.4,16,0.4C16,0.4,16,0.4,16,0.4z M21.9,21.9
        c-0.6,0.6-1.6,0.6-2.3,0L16,18.4L12.4,22c-0.6,0.6-1.6,0.6-2.3,0s-0.6-1.6,0-2.3l3.7-3.7l-3.5-3.5c-0.6-0.6-0.6-1.6,0-2.3
        s1.6-0.6,2.3,0l3.5,3.5l3.3-3.3c0.6-0.6,1.6-0.6,2.3,0s0.6,1.6,0,2.3l-3.3,3.3l3.6,3.6C22.5,20.3,22.5,21.3,21.9,21.9L21.9,21.9z"/>
    </symbol>
        </svg>
    </div><div class='zohodesk-Tooltip-popup-header'><span class='zohodesk-Tooltip-close'><svg class="zohodesk-tooltip-svg-icon icon zohodesk-tooltip-cl-white" id="zohodesk_Tooltip_close_tooltip">
            <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="#Tooltip-close"></use>
          </svg></span></div><span class='zohodesk-Tooltip-tooltiparrow'></span><div class='zohodesk-Tooltip-tooltipcontText' id='Chrome_Extension_showContentContainerId'><p class='zohodesk-Tooltip-para' id='Chrome_Extension_showContentContainerSpanId'></p><div id="Chrome_Extension_ToolTip_View_More"></div></div>`
}

function Chrome_Extension_tooltipPopup(Chrome_Extension_tooltipContent, Chrome_Extension_node, Chrome_Extension_size, Chrome_Extension_backgroundColor, Chrome_Extension_ArticleId , userPosition) {
    Chrome_Extension_popupdesign();
    var descriptionArray = Chrome_Extension_tooltipContent.split(" ");
    if (Chrome_Extension_ArticleId == "") {
        document.getElementById("Chrome_Extension_showContentContainerSpanId").innerHTML = Chrome_Extension_tooltipContent;
        document.getElementById("Chrome_Extension_showContentContainerSpanId").className += " zohodesk-Tooltip-overflow";
    } else {
        var shortenedDescription = descriptionArray.slice(0, 10);
        document.getElementById("Chrome_Extension_showContentContainerSpanId").innerHTML = (shortenedDescription.join(" ") + "...");
        document.getElementById("Chrome_Extension_ToolTip_View_More").innerHTML = `<div class="zohodesk-Tooltip-popup-button zohodesk-Tooltip-popup-button-small" id="Chrome_Extension_showContentContainerHrefId"><span></span>VIEW MORE</div>`;
    }
    if (Chrome_Extension_ArticleId != "") {
        document.getElementById("Chrome_Extension_showContentContainerHrefId").children[0].id = Chrome_Extension_ArticleId;
        document.getElementById("Chrome_Extension_showContentContainerHrefId").onclick = function(e) {
            console.log(e);
            var articleId = document.getElementById("Chrome_Extension_showContentContainerHrefId").children[0].id;
            console.log(articleId);
            ZohoHCAsap.KB.Articles.Open({
                id: articleId
            });
        }
    }
    document.getElementById("Chrome_Extension_showContentContainerId").className += " " + Chrome_Extension_size;
    document.getElementById("Chrome_Extension_showContentContainerId").style.backgroundColor = Chrome_Extension_backgroundColor;
    document.getElementsByClassName("zohodesk-Tooltip-tooltiparrow")[0].style.backgroundColor = Chrome_Extension_backgroundColor;
    document.getElementById("zohodesk_Tooltip_close_tooltip").onclick = function(e) {
        Chrome_Extension_hideTooltip("zohodeskTooltipCloseTooltip");
        if (CloseIconMouseOverAction == true) {
            EditorListener = true;
        }
    }
    Chrome_Extension_ele = document.getElementsByClassName("zohodesk-Tooltip-showContentClass")[0];
    Chrome_Extension_leng = Chrome_Extension_ele.classList;
    if (Chrome_Extension_leng == 0) {
        Chrome_Extension_ele.className += "zohodesk-Tooltip-tooltip-hide"
    } else {
        Chrome_Extension_inde = Chrome_Extension_ele.className.indexOf("zohodesk-Tooltip-tooltip-hide");
        if (Chrome_Extension_inde == -1) {
            Chrome_Extension_ele.className += " zohodesk-Tooltip-tooltip-hide"
        }
    }

    if (Chrome_Extension_tooltipContent != undefined) {
        positionBinder(Chrome_Extension_node.target, userPosition );
    } else {
        Chrome_Extension_ele = document.getElementsByClassName("zohodesk-Tooltip-showContentClass")[0];
        Chrome_Extension_leng = Chrome_Extension_ele.classList;
        if (Chrome_Extension_leng == 0) {
            Chrome_Extension_ele.className += "zohodesk-Tooltip-tooltip-hide"
        } else {
            Chrome_Extension_inde = Chrome_Extension_ele.className.indexOf("zohodesk-Tooltip-tooltip-hide");
            if (Chrome_Extension_inde == -1) {
                Chrome_Extension_ele.className += " zohodesk-Tooltip-tooltip-hide"
            }
        }
    }
}

function TempMouseOver(e) {
    Chrome_Extension_CommonMousePointElement = e.target;
}

function elementMouseOverListener(e) {
    console.log(this , "element bind");
    var TempVar;
    if (Chrome_Extension_CommonMousePointElement != undefined) {
        document.removeEventListener('mouseover', TempMouseOver, true);
        if (e.target == Chrome_Extension_CommonMousePointElement) {
            TempVar = "CheckIsDone";
        }
        Chrome_Extension_CommonMousePointElement = undefined;
    } else {
        TempVar = "CheckIsDone";
        Chrome_Extension_CommonMousePointElement = undefined;
    }
    if (TempVar == "CheckIsDone") {
        if (this.obj.style.viewSize == "LARGE") {
            this.obj.style.viewSize = "zohodesk-Tooltip-popup-large";
        } else if (this.obj.style.viewSize == "MEDIUM") {
            this.obj.style.viewSize = "zohodesk-Tooltip-popup-medium";
        } else if (this.obj.style.viewSize == "SMALL") {
            this.obj.style.viewSize = "zohodesk-Tooltip-popup-small";
        }
        Chrome_Extension_tooltipPopup( this.obj, e , this.id );
    }
}


function Chrome_Extension_hideTooltip(e) {
    var Chrome_Extension_ele = document.getElementsByClassName("zohodesk-Tooltip-showContentClass")[0];
    var tooltipElement = false;
    if (e != "zohodeskTooltipCloseTooltip") {
        tooltipElement = findInnerElements("Chrome_Extension_showContentId", e.target);
    }
    if (Chrome_Extension_ele != undefined && tooltipElement != true) {
        if (document.body.children.Chrome_Extension_showContentId); {
            while (document.body.children.Chrome_Extension_showContentId) {
                document.body.removeChild(document.getElementById("Chrome_Extension_showContentId"));
            }
        }
        document.removeEventListener("mouseover", Chrome_Extension_hideTooltip, true);
    }
}

function findInnerElements(parentEleId, checkEle) {
    try {
        var innerElement = false
        var parentEle = document.getElementById(parentEleId);
        var parentEleChild = parentEle.getElementsByTagName("*")
        var parentEleChildLen = parentEleChild.length
        for (i = 0; i < parentEleChildLen; i++) {
            if (checkEle == parentEleChild[i]) {
                innerElement = true
                break
            }
        }
        return innerElement
    } catch (err) {
        //console.log(err);
    }
}
/* userside show old codes end */




/* below code is used for analyse and fix the position of tooltip */

function positionBinder(elem, obj) {
    toolTip = document.getElementById("Chrome_Extension_showContentContainerId");
    elemDimensions = elem.getBoundingClientRect();
    ttDimensions = {
        height: toolTip.offsetHeight,
        width: toolTip.offsetWidth
    };
    tooltipPositions = {
        top: topPopUp(elemDimensions, ttDimensions),
        bottom: bottomPopUp(elemDimensions, ttDimensions),
        left: leftPopUp(elemDimensions, ttDimensions),
        right: rightPopUp(elemDimensions, ttDimensions)
    };
    if (obj.position != undefined) {
        if (obj.position === "top") {
            if (tooltipPositions.top.position != "topFailed") {
                return applyposition(tooltipPositions.top);
            } else {
                return defaultView()
            }
        } else if (obj.position === "bottom") {
            if (tooltipPositions.bottom.position != "bottomFailed") {
                return applyposition(tooltipPositions.bottom);
            } else {
                return defaultView()
            }
        } else if (obj.position === "left") {
            if (tooltipPositions.left.position != "leftFailed") {
                return applyposition(tooltipPositions.left);
            } else {
                return defaultView()
            }
        } else if (obj.position === "right") {
            if (tooltipPositions.right.position != "rightFailed") {
                return applyposition(tooltipPositions.right);
            } else {
                return defaultView()
            }
        }
    } else {
        return defaultView()
    }
}


function topPopUp(elem, ttip) {
    if (elem.top > (ttip.height + 10)) {
        if ((elem.left + (elem.width / 2)) > (ttip.width / 2) && (((bodyDimensions.right - elem.right) + (elem.width / 2)) > (ttip.width / 2))) {
            return {
                position: "topOk",
                "ttipLeft": ((elem.left + (elem.width / 2)) - (ttip.width / 2)),
                "ttipTop": (elem.top - (10 + ttip.height)),
                "arrowLeft": (ttip.width / 2) - 10,
                "arrowTop": (ttip.height - 9),
                "deg": "rotate(225deg)"
            }
        } else if ((elem.left + (elem.width / 2)) < (ttip.width / 2) && (((bodyDimensions.right - elem.right) + (elem.width)) > (ttip.width))) {
            return {
                position: "topRightOk",
                "ttipLeft": 2,
                "ttipTop": (elem.top - (10 + ttip.height)),
                "arrowLeft": (elem.width / 2) - 10,
                "arrowTop": ttip.height - 9,
                "deg": "rotate(225deg)"
            }
        } else if ((elem.left + (elem.width / 2)) > (ttip.width / 2) && (((bodyDimensions.right - elem.right) + (elem.width)) < (ttip.width))) {
            return {
                position: "topLeftOk",
                "ttipLeft": ((window.innerWidth - ttip.width)),
                "ttipTop": (elem.top - (10 + ttip.height)),
                "arrowLeft": ((elem.left - (window.innerWidth - ttip.width)) + elem.width / 2) - 10,
                "arrowTop": ttip.height - 9,
                "deg": "rotate(225deg)"
            }
        }
    }
    return {
        position: "topFailed"
    }
}

function bottomPopUp(elem, ttip) {
    if (document.getElementsByTagName('body')[0].style.margin === "") {
        var winHeight = window.innerHeight - 16;
    } else {
        var winHeight = window.innerHeight - document.getElementsByTagName('body')[0].style.margin;
    }

    if ((winHeight - elem.bottom) > (ttip.height + 10)) {
        if ((elem.left + (elem.width / 2)) > (ttip.width / 2) && (((bodyDimensions.right - elem.right) + (elem.width / 2)) > (ttip.width / 2))) {
            return {
                position: "bottomOk",
                "ttipLeft": ((elem.left + (elem.width / 2)) - (ttip.width / 2)),
                "ttipTop": (elem.bottom + 5),
                "arrowLeft": (ttip.width / 2) - 10,
                "arrowTop": -7,
                "deg": "rotate(45deg)"
            }
        } else if ((elem.left + (elem.width / 2)) < (ttip.width / 2) && (((bodyDimensions.right - elem.right) + (elem.width)) > (ttip.width))) {
            return {
                position: "bottomRightOk",
                "ttipLeft": elem.left,
                "ttipTop": (elem.bottom + 5),
                "arrowLeft": (elem.width / 2) - 10,
                "arrowTop": -7,
                "deg": "rotate(45deg)"
            }
        } else if ((elem.left + (elem.width / 2)) > (ttip.width / 2) && (((bodyDimensions.right - elem.right) + (elem.width)) < (ttip.width))) {
            return {
                position: "bottomLeftOk",
                "ttipLeft": ((elem.right - ttip.width)),
                "ttipTop": (elem.bottom + 5),
                "arrowLeft": ((elem.left - ttip.left) + elem.width / 2) - 10,
                "arrowTop": -7,
                "deg": "rotate(45deg)"
            }
        }
    }
    return {
        position: "bottomFailed"
    }
}

function leftPopUp(elem, ttip) {
    if (document.getElementsByTagName('body')[0].style.margin === "") {
        var winHeight = window.innerHeight - 16;
    } else {
        var winHeight = window.innerHeight - document.getElementsByTagName('body')[0].style.margin;
    }

    if ((elem.left) > (ttip.width + 10)) {
        if ((elem.top + (elem.height / 2)) > (ttip.height / 2) && (((winHeight - elem.bottom) + (elem.height / 2)) > (ttip.height / 2))) {
            return {
                position: "leftOk",
                "ttipLeft": ((elem.left) - (5 + ttip.width)),
                "ttipTop": ((elem.top + elem.height / 2) - (ttip.height / 2)),
                "arrowLeft": (ttip.width - 9),
                "arrowTop": (ttip.height / 2) - 5,
                "deg": "rotate(135deg)"
            }
        } else if ((elem.top + (elem.height / 2)) < (ttip.height / 2) && (((winHeight - elem.bottom) + (elem.height / 2)) > (ttip.height / 2))) {
            return {
                position: "leftBottomOk",
                "ttipLeft": ((elem.left) - (5 + ttip.width)),
                "ttipTop": 0,
                "arrowLeft": (ttip.width - 9),
                "arrowTop": (elem.top + elem.height / 2) - 5,
                "deg": "rotate(135deg)"
            }
        } else if ((elem.top + (elem.height / 2)) > (ttip.height / 2) && (((winHeight - elem.bottom) + (elem.height / 2)) < (ttip.height / 2))) {
            return {
                position: "leftTopOk",
                "ttipLeft": ((elem.left) - (5 + ttip.width)),
                "ttipTop": (window.innerHeight - ttip.height),
                "arrowLeft": (ttip.width - 9),
                "arrowTop": (ttip.height - ((window.innerHeight - elem.bottom) + elem.height / 2)) - 5,
                "deg": "rotate(135deg)"
            }
        }
    }
    return {
        position: "leftFailed"
    }
}

function rightPopUp(elem, ttip) {
    if (document.getElementsByTagName('body')[0].style.margin === "") {
        var winHeight = window.innerHeight - 16;
    } else {
        var winHeight = window.innerHeight - document.getElementsByTagName('body')[0].style.margin;
    }

    if ((bodyDimensions.right - elem.right) > (ttip.width + 10)) {
        if ((elem.top + (elem.height / 2)) > (ttip.height / 2) && (((winHeight - elem.bottom) + (elem.height / 2)) > (ttip.height / 2))) {
            return {
                position: "rightOk",
                "ttipLeft": (elem.right + 5),
                "ttipTop": ((elem.top + elem.height / 2) - (ttip.height / 2)),
                "arrowLeft": -8 ,
                "arrowTop": (ttip.height / 2) - 5,
                "deg": "rotate(315deg)"
            }
        } else if ((elem.top + (elem.height / 2)) < (ttip.height / 2) && (((winHeight - elem.bottom) + (elem.height / 2)) > (ttip.height / 2))) {
            return {
                position: "rightBottomOk",
                "ttipLeft": (elem.right + 5),
                "ttipTop": 0,
                "arrowLeft": -8,
                "arrowTop": (elem.top + elem.height / 2) - 5,
                "deg": "rotate(315deg)"
            }
        } else if ((elem.top + (elem.height / 2)) > (ttip.height / 2) && (((winHeight - elem.bottom) + (elem.height / 2)) < (ttip.height / 2))) {
            return {
                position: "rightTopOk",
                "ttipLeft": (elem.right + 5),
                "ttipTop": (window.innerHTML - ttip.height),
                "arrowLeft": -8,
                "arrowTop": (ttip.height - ((window.innerHeight - elem.bottom) + elem.height / 2)) - 5,
                "deg": "rotate(315deg)"
            }
        }
    }
    return {
        position: "rightFailed"
    }
}


function applyposition(posObj) {
    var arrow = document.getElementsByClassName('zohodesk-Tooltip-tooltiparrow')[0];
    var pop = document.getElementById("Chrome_Extension_showContentId");
    document.getElementsByClassName("zohodesk-Tooltip-showContentClass")[0].className = document.getElementsByClassName("zohodesk-Tooltip-showContentClass")[0].className.split(" zohodesk-Tooltip-tooltip-hide")[0];
    arrow.style.top = posObj.arrowTop + "px";
    arrow.style.left = posObj.arrowLeft + "px";
    arrow.style.transform = posObj.deg;
    pop.style.top = posObj.ttipTop + "px";
    pop.style.left = posObj.ttipLeft + "px";
    pop.style.visibility = "visible";
    // console.log(posObj)
}

function defaultView() {
    if (tooltipPositions.left.position === "leftOk") {
        return applyposition(tooltipPositions.left);
    } else if (tooltipPositions.right.position === "rightOk") {
        return applyposition(tooltipPositions.right);
    } else if (tooltipPositions.top.position === "topOk") {
        return applyposition(tooltipPositions.top);
    } else if (tooltipPositions.bottom.position === "bottomOk") {
        return applyposition(tooltipPositions.bottom);
    } else {
        if (tooltipPositions.left.position != "leftFailed") {
            return applyposition(tooltipPositions.left);
        } else if (tooltipPositions.right.position != "rightFailed") {
            return applyposition(tooltipPositions.right);
        } else if (tooltipPositions.top.position != "topFailed") {
            return applyposition(tooltipPositions.top);
        } else if (tooltipPositions.bottom.position != "bottomFailed") {
            return applyposition(tooltipPositions.bottom);
        }
    }
    return "positioning failed"
}

/* below code is used for analyse and fix the position of tooltip ended */