var ZohodeskTooltipCommonShowHideVariable = undefined;
var ConfigureObjectForEdit;

var zdtt_elementSelectorObj = undefined;
var zd_tt_addTPBlocked = false;
var zdttContainers = {};
var zdttTabs = {};
var zdtt_lastHighlighted = [];
var zdtt_nowStatus = "new";
var Trigger_option = "HOVER";
var zd_tt_arrayOfElements = [];
var zd_tt_addTooltipObj = {
    "components": [{
        "type": "ARTICLESNIPPET",
        "preferences": null,
        "order": "0",
        "solutionId": undefined,
        "content": ""
    }],
    "isEnabled": true,
    "name": undefined,
    "preferences": {
        "bgColor": "#ffffff",
        "viewSize": "LARGE"
    },
    "triggers": [],
    "viewtype": "TOOLTIP"
};

function zdttCommonEventsBinder() {
    document.addEventListener('click', zdtt_mousedownActionShow, true);
}

function zdttCommonEventsRemover() {
    document.removeEventListener('click', zdtt_mousedownActionShow, true);
}

function zdtt_mousedownActionShow(e) {
    if (ZohodeskTooltipCommonShowHideVariable != undefined) {
        if (e.path) {
            if (e.path.length) {
                if (e.path[0].classList) {
                    if (e.path[0].classList.value.indexOf("zohodesk-Tooltip-dotcircleIn") != -1) {
                        return
                    }
                }
            }
        }
        zdtt_popupHide(ZohodeskTooltipCommonShowHideVariable);
    }
}


function objInitializer() {
    chrome_addons_inner_text = "";
    if (zdtt_lastHighlightedObj != undefined) {
        delete zdtt_lastHighlightedObj["dontEdit"];
        zdtt_lastHighlightedObj = undefined;
    }
    finalizedColor = "rgb(250,250,250)";
    zdttTriggerOldFocused = undefined;
    zd_tt_addTooltipObj = {
        "components": [{
            "type": "ARTICLESNIPPET",
            "preferences": null,
            "order": "0",
            "solutionId": undefined,
            "content": ""
        }],
        "isEnabled": true,
        "name": undefined,
        "preferences": {
            "bgColor": "#ffffff",
            "viewSize": "LARGE"
        },
        "triggers": [],
        "viewtype": "TOOLTIP"
    };
    ConfigureObjectForEdit = undefined;
    zd_tt_arrayOfElements = [];
    Trigger_option = "HOVER";
    zdtt_nowStatus = "new";
    lastArticleKBshortContent = undefined;
    lastObjectOfUpdatedTriggerFUB = undefined;
};


function zdtt_popupHide(element) {
    if (element != undefined) {
        element.parentElement.className = element.parentElement.className.split(" zohodesk-Tooltip-active").join("");
        var getClass = element.className;
        var splitClass = getClass.split(" ");
        if (element.className.indexOf("zohodesk-displayBlock") != -1) {
            element.className = element.className.split(" zohodesk-displayBlock").join("");
        }
        ZohodeskTooltipCommonShowHideVariable = undefined;
    }
}


function zdtt_popupShow(elem) {
    return function(e) {
        if (elem != undefined) {
            if (elem.id != "triggerTapDropdown" && elem.id != "zohoDeskUserDetailsInfoPopup") {
                elem.parentElement.className += " zohodesk-Tooltip-active";
            }
            if (elem.className.indexOf("zohodesk-displayBlock") == -1) {
                elem.className += " zohodesk-displayBlock";
            }
            ZohodeskTooltipCommonShowHideVariable = elem;
        }
    }
}



function zdttSidePanelAlignmentEvent(parent, switchElem) {
    this.switchElem = switchElem.getElementsByTagName("use")[0];
    this.parent = parent;
    this.status = "Right";
    this.toggle = this.toggle.bind(this);
    switchElem.onclick = this.toggle;
}
zdttSidePanelAlignmentEvent.prototype.toggle = function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.switchElem.href.baseVal = this.status == "Right" ? "#Tooltip-alignleft" : "#Tooltip-alignright";
    this.status == "Right" ? this.status = "Left" : this.status = "Right";
    this.parent.className.indexOf('zohodesk-Tooltip-panel-left') == -1 ? this.parent.className += " zohodesk-Tooltip-panel-left" : this.parent.className = this.parent.className.split(' zohodesk-Tooltip-panel-left').join('');
};

function zdTT_logOut() {
    let url = "https://accounts." + commomDomainNameForAPI.split(".")[1] + ".com/logout";
    zdaTTcommonAPIcaller(url, "get", sessionLogOutCB);
}






function zdttAddTrigerPointer() {
    return {
        bind: function() {
            var noteText = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector("#zd_tt_elementAlertBox");
            if (noteText) {
                if (noteText.className.indexOf("mesaageHideAnim") == -1) {
                    noteText.className += " mesaageHideAnim";
                }
            }
            if (zdtt_elementSelectorObj) {
                zdtt_elementSelectorObj.detachClickListener();
            }
            zdttContainers.addTrigerBtn.addEventListener("click", zd_tt_addTrggerPoint, true);
            if (zdttContainers.addTrigerBtn.className.indexOf("zohodesk-Tooltip-panel-form-field-notallowed") != -1) {
                zdttContainers.addTrigerBtn.className = zdttContainers.addTrigerBtn.className.split(" zohodesk-Tooltip-panel-form-field-notallowed").join("");
            }
            if (zdttContainers.addTrigerCancelBtn.className.indexOf("zohodesk-Tooltip-hide") == -1) {
                zdttContainers.addTrigerCancelBtn.className += " zohodesk-Tooltip-hide";
            }
            blurPosition();
        },
        unbind: function(type = "limitNotReached") {
            zdttContainers.addTrigerBtn.removeEventListener("click", zd_tt_addTrggerPoint, true);
            if (zdttContainers.addTrigerBtn.className.indexOf("zohodesk-Tooltip-panel-form-field-notallowed") == -1) {
                zdttContainers.addTrigerBtn.className += " zohodesk-Tooltip-panel-form-field-notallowed";
            }
            if (type != "limitReached") {
                if (zdttContainers.addTrigerCancelBtn.className.indexOf("zohodesk-Tooltip-hide") != -1) {
                    zdttContainers.addTrigerCancelBtn.className = zdttContainers.addTrigerCancelBtn.className.split(" zohodesk-Tooltip-hide").join("");
                }
            }
        }
    }
}


function objectCreaters(type) {
    var tempObj = undefined;
    if (type == "new") {
        tempObj = zd_tt_addTooltipObj;
    } else if (type == "update") {
        tempObj = ConfigureObjectForEdit;
    }
    return {
        'triggerObjUpdater': function(e) {
            var errorElem = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector("#zd_tt_tnError");
            _zdattElemHighlighter.changeName(e.target.value.trim());
            if (e.target.value.trim() == "") {
                tempObj.name = undefined;
                if (errorElem.innerText.trim() == "") {
                    errorElem.innerHTML = "* " + extensionI18N.get('desk.asap.extention.triggers.nameerrormessage');
                    errorElem.className = errorElem.className.split(" mesaageHideAnim").join("");
                }
                blurPosition();
            } else {
                tempObj.name = e.target.value.trim();
                if (errorElem.className.indexOf("mesaageHideAnim") == -1) {
                    errorElem.className += " mesaageHideAnim";
                }
                errorElem.innerHTML = "";
                blurPosition();
            }
        },
        'elementsArrayCreater': function(obj) {
            if (obj.type == "add") {
                var blrDiv = zdttContainers.zdtt_sidepanelSwitchingComp.querySelectorAll(".zohodesk-Tooltip-plurdiv")
                if (blrDiv.length) {
                    var len = blrDiv.length;
                    for (var i = 0; i < len; i++) {
                        blrDiv[0].parentElement.removeChild(blrDiv[0]);
                    }
                    var parentOfForm = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector(".zohodesk-Tooltip-panel-contentplur");
                    if (parentOfForm) {
                        parentOfForm.className = parentOfForm.className.split(" zohodesk-Tooltip-panel-contentplur").join("");
                    }
                }
                zd_tt_arrayOfElements.push(obj.elemSelector);
                _zdattElemHighlighter.singleElemHighlighter(obj.elemSelector, tempObj, false, true);
                var addTPInput = zdttContainers.addTrigerBtn.querySelector("#zdTT_triggerPointCount");
                if (zd_tt_arrayOfElements.length == 0) {
                    if (addTPInput.className.indexOf("zohodesk-Tooltip-hide") == -1) {
                        addTPInput.className = " zohodesk-Tooltip-hide";
                    }
                } else {
                    if (addTPInput.className.indexOf("zohodesk-Tooltip-hide") != -1) {
                        addTPInput.className = addTPInput.className.split(" zohodesk-Tooltip-hide").join("");
                    }
                    addTPInput.innerText = zd_tt_arrayOfElements.length;
                }
            } else if (obj.type == "remove") {
                var element = document.querySelector(obj.elemSelector);
                _zdattElemHighlighter.remove();
                zd_tt_arrayOfElements = zd_tt_arrayOfElements.filter(function(elementSelector) {
                    return elementSelector != obj.elemSelector;
                });
                var addTPInput = zdttContainers.addTrigerBtn.querySelector("#zdTT_triggerPointCount");
                if (zd_tt_arrayOfElements.length == 0) {
                    if (addTPInput.className.indexOf("zohodesk-Tooltip-hide") == -1) {
                        addTPInput.className += " zohodesk-Tooltip-hide";
                    }
                } else {
                    if (addTPInput.className.indexOf("zohodesk-Tooltip-hide") != -1) {
                        addTPInput.className = addTPInput.className.split(" zohodesk-Tooltip-hide").join("");
                    }
                    addTPInput.innerText = zd_tt_arrayOfElements.length;
                    zd_tt_arrayOfElements.forEach(function(elem, ind, array) {
                        _zdattElemHighlighter.singleElemHighlighter(elem, tempObj, false, true);
                    })
                }
                if (zd_tt_arrayOfElements.length == 0) {
                    var contPlurParent = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector(".zohodesk-Tooltip-panel-content");
                    if (contPlurParent.className.indexOf("zohodesk-Tooltip-panel-contentplur") == -1) {
                        contPlurParent.className += " zohodesk-Tooltip-panel-contentplur";
                        contPlurParent.scrollTop = 0;
                    }
                    var contPlurChild = domElement.create({
                        elemName: "div",
                        attributes: {
                            class: "zohodesk-Tooltip-plurdiv"
                        },
                        parent: contPlurParent
                    });
                    blurPosition();
                }
                if (zd_tt_arrayOfElements.length < 5 && zd_tt_addTPBlocked) {
                    zdttAddTrigerPointer().bind();
                    zd_tt_addTPBlocked = false;
                }
            }
        },

    }
};


function blurPosition(id = "zdtt_plurPositionElem") {
    var blurElem = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector(".zohodesk-Tooltip-plurdiv");
    if (blurElem) {
        var lastElem = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector("#" + id);
        blurElem.style.top = (lastElem.offsetHeight + lastElem.offsetTop + 3) + "px";
    }
}

function zd_tt_addTrggerPoint(e) {
    e.preventDefault();
    e.stopPropagation();
    var successMsg = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector("#zdtt_triggerSelectedMsg");
    var noteText = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector("#zd_tt_elementAlertBox");
    if (successMsg.className.indexOf("zohodesk-Tooltip-hide") == -1) {
        successMsg.className += " zohodesk-Tooltip-hide";
    }
    if (noteText) {
        noteText.className = noteText.className.split(" mesaageHideAnim").join("");
    }
    zdtt_elementSelectorObj.attachListeners();
    zdttAddTrigerPointer().unbind();
    blurPosition("zd_tt_elementAlertBox");
};


function getArticleName(searchStr) {
    searchStr = searchStr + "*";
    window.postMessage({
        name: "zdttArticleSearch",
        searchStr: searchStr
    }, "*");
};

function zdttArticleSearch(popup) {
    return function(e) {
        if (e.target.value.trim() == "") {
            zdtt_popupHide(zdttContainers.searchRes);
        } else {
            getArticleName(e.target.value);
        }
    }
}

function parentHighlighter(elem, action) {
    if (action) {
        if (action.when == "click") {
            action.element.tabIndex = -1;
        }
    }
    return {
        focus: function(e) {
            if (elem.className.indexOf("zohodesk-Tooltip-active") == -1) {
                elem.className += " zohodesk-Tooltip-active";
            }
            if (e.target.parentElement.className.indexOf("zd_tt_notfilledErrorStyle") != -1) {
                e.target.parentElement.className = e.target.parentElement.className.split(" zd_tt_notfilledErrorStyle").join("");
            }

        },
        unfocus: function(e) {
            if (elem.className.indexOf("zohodesk-Tooltip-active") != -1) {
                elem.className = elem.className.split(" zohodesk-Tooltip-active").join("");
            }
            if (this.callback) {
                this.callback(e.target);
            }
        }
    }
}

function triggerSizeCallback(type, switchElem, obj) {
    var countElem = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector("#zdttSizeCharInform");
    return function(event) {
        switchElem.innerHTML = type == "zohodesk-Tooltip-large" ? extensionI18N.get('desk.asap.extention.triggers.large') : type == "zohodesk-Tooltip-medium" ? extensionI18N.get('desk.asap.extention.triggers.medium') : extensionI18N.get('desk.asap.extention.triggers.small');
        obj.preferences.viewSize = type == "zohodesk-Tooltip-large" ? "LARGE" : type == "zohodesk-Tooltip-medium" ? "MEDIUM" : "SMALL"
        if (countElem) {
            countElem.innerHTML = type == "zohodesk-Tooltip-large" ? extensionI18N.get('desk.asap.extention.triggers.max') + ". 150 " + extensionI18N.get('desk.asap.extention.triggers.characters') : type == "zohodesk-Tooltip-medium" ? extensionI18N.get('desk.asap.extention.triggers.max') + ". 100 " + extensionI18N.get('desk.asap.extention.triggers.characters') : extensionI18N.get('desk.asap.extention.triggers.max') + ". 75 " + extensionI18N.get('desk.asap.extention.triggers.characters')
        }
    }
}

function triggerActionCallback(type, switchElem) {
    return function(event) {
        switchElem.innerHTML = type == "zohodesk_tooltip_trigger_options_onClick" ? extensionI18N.get('desk.asap.extention.triggers.onclick') : extensionI18N.get('desk.asap.extention.triggers.onhover')
        Trigger_option = type == "zohodesk_tooltip_trigger_options_onHover" ? "HOVER" : "CLICK"
    }
}

function triggerNameChecker(elem) {
    return function(target) {
        if (target.value.trim() == "") {
            if (target.parentElement.className.indexOf("zd_tt_notfilledErrorStyle") == -1) {
                target.parentElement.className += " zd_tt_notfilledErrorStyle";
            }
            elem.innerHTML = "* " + extensionI18N.get('desk.asap.extention.triggers.nameerrormessage');
            elem.className = elem.className.split(" mesaageHideAnim").join("");
            blurPosition();
        }
    }
}

function articleSelectedChecker(elem) {
    return function(target) {
        if (zd_tt_articleSelected != true) {
            if (target.parentElement.className.indexOf("zd_tt_notfilledErrorStyle") == -1) {
                target.parentElement.className += " zd_tt_notfilledErrorStyle";
            }
            elem.innerText = "* " + extensionI18N.get('desk.asap.extention.triggers.articleerrormessage');
            elem.className = elem.className.split(" mesaageHideAnim").join("");
        }
    }
}

function updateArticleSearchBox(elem, obj) {
    elem.disabled = true;
    let url = "https://" + commomDomainNameForAPI + "/portal/api/kbArticles/" + obj.components["0"].solutionId + "?portalId=" + asapPortalID;
    let updateArticleSearchBox_successCB = updateArticleSearchBox_successCBGetter(elem);
    zdaTTcommonAPIcaller(url, "get", updateArticleSearchBox_successCB);
}

function zdattJustPrevent(e) {
    e.preventDefault();
    e.stopPropagation();
}

function zdttFormElementCreater(type, callback) {
    var zdtt_saveBtnTxt = "";
    var addBtnTxt = "";
    if (zdtt_nowStatus == "new") {
        var obj = zd_tt_addTooltipObj;
        zdtt_saveBtnTxt = extensionI18N.get('desk.asap.extention.save');
        addBtnTxt = extensionI18N.get('desk.asap.extention.triggers.addtrigger');
    } else if (zdtt_nowStatus == "update") {
        zd_tt_arrayOfElements = [];
        var obj = ConfigureObjectForEdit;
        if (typeof(obj.preferences) == "string") {
            obj.preferences = JSON.parse(obj.preferences);
        }
        finalizedColor = obj.preferences.bgColor;
        zdtt_saveBtnTxt = extensionI18N.get('desk.asap.extention.update');
        obj.triggers.forEach(function(elem) {
            zd_tt_arrayOfElements.push(elem.element);
        });
        Trigger_option = obj.triggers["0"].event;
        addBtnTxt = "Change Trigger";
        var countElem = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector("#zdttSizeCharInform");
        countElem.innerHTML = obj.preferences.viewSize == "LARGE" ? extensionI18N.get('desk.asap.extention.triggers.max') + ". 150 " + extensionI18N.get('desk.asap.extention.triggers.characters') : obj.preferences.viewSize == "MEDIUM" ? extensionI18N.get('desk.asap.extention.triggers.max') + ". 100 " + extensionI18N.get('desk.asap.extention.triggers.characters') : extensionI18N.get('desk.asap.extention.triggers.max') + ". 75 " + extensionI18N.get('desk.asap.extention.triggers.characters');
    }


    zdttContainers.triggerNameInp = domElement.create({
        elemName: "input",
        attributes: {
            class: "zohodesk-Tooltip-text-box zohodesk-Tooltip-input",
            id: "zd_tt_triggerName",
            placeholder: "eg,.Header info icon",
            type: "text"
        },
        elementData: {
            value: obj.name
        },
        callbackList: [{
            input: callback.triggerObjUpdater
        }]
    });
    var triggerNameBox = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-panel-form-field"
        },
        elementData: {
            child: [zdttContainers.triggerNameInp]
        }
    });
    var triggerNameAction = parentHighlighter(triggerNameBox);
    zdttContainers.triggerNameInp.onfocus = triggerNameAction.focus;
    var tnbe = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector("#zd_tt_tnError");
    zdttContainers.triggerNameInp.onblur = triggerNameAction.unfocus.bind({
        callback: triggerNameChecker(tnbe)
    });
    tnbe.parentElement.insertBefore(triggerNameBox, tnbe);

    var addTriggerBtnClass = "zohodesk-Tooltip-button zohodesk-Tooltip-button-primary";
    if (zd_tt_arrayOfElements.length >= 5) {
        addTriggerBtnClass += " zohodesk-Tooltip-panel-form-field-notallowed";
    }

    zdttContainers.addTrigerBtn = domElement.create({
        elemName: "span",
        attributes: {
            class: addTriggerBtnClass,
            id: "zd_tt_changePointer"
        },
        callbackList: [{
            mousedown: zdattJustPrevent,
            mouseup: zdattJustPrevent
        }],
        elementData: {
            innerHTML: `<span id="zd_tt_changePointer_nameValue">` + addBtnTxt + `</span><span class="zdtt_numberCountSpan zohodesk-Tooltip-hide" id="zdTT_triggerPointCount"></span>`
        }
    });
    zdttContainers.addTrigerCancelBtn = domElement.create({
        elemName: "input",
        attributes: {
            class: "zohodesk-Tooltip-button zohodesk-Tooltip-button-secondary zohodesk-Tooltip-hide",
            id: "zdTT_changeTriggerCancel",
            type: "button",
            value: extensionI18N.get('desk.asap.extention.cancel')
        },
        callbackList: [{
            click: zdttAddTrigerPointer().bind,
            mousedown: zdattJustPrevent,
            mouseup: zdattJustPrevent
        }]
    });
    var tnatb = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector("#zdtt_triggerSelectedMsg");
    tnatb.parentElement.insertBefore(zdttContainers.addTrigerBtn, tnatb);
    tnatb.parentElement.insertBefore(zdttContainers.addTrigerCancelBtn, tnatb);
    if (zd_tt_arrayOfElements.length) {
        var totalPointCount = zdttContainers.addTrigerBtn.querySelector("#zdTT_triggerPointCount");
        totalPointCount.innerHTML = zd_tt_arrayOfElements.length;
        totalPointCount.className = totalPointCount.className.split(" zohodesk-Tooltip-hide").join("");
        var formPrnt = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector(".zohodesk-Tooltip-panel-contentplur");
        if (formPrnt) {
            formPrnt.className = formPrnt.className.split(" zohodesk-Tooltip-panel-contentplur").join("")
        }
        var plrDiv = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector(".zohodesk-Tooltip-plurdiv")
        if (plrDiv) {
            plrDiv.parentElement.removeChild(plrDiv);
        }
    }
    if (zd_tt_arrayOfElements.length < 5) {
        zdttAddTrigerPointer().bind();
    }


    zdttContainers.searchRes = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-Selectbox-dropdown zohodesk-Tooltip-Selectbox-dropdown-search",
            id: "searchDisplay"
        },
        elementData: {
            innerHTML: `<div class="zohodesk-Tooltip-dropdown-content" id="zohodesk_Tooltip_dropdown_articles_parent_id1"></div>`
        }
    });
    zdttContainers.searchInp = domElement.create({
        elemName: "input",
        attributes: {
            class: "zohodesk-Tooltip-text-box zohodesk-Tooltip-input",
            id: "searchArticleBox",
            placeholder: "Search...",
            type: "text"
        },
        callbackList: [{
            input: zdttArticleSearch(zdttContainers.searchRes)
        }]
    });
    if (zdtt_nowStatus == "update") {
        updateArticleSearchBox(zdttContainers.searchInp, obj)
    }
    var searchBox = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-panel-form-field",
            id: "zdtt_aserchParent"
        },
        elementData: {
            innerHTML: `<div class="zohodesk-Tooltip-form-field-icons">
                 <span class="zohodesk-Tooltip-editor-iconarticle">
                    <svg class="zohodesk-tooltip-svg-icon">
                       <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="#Tooltip-article"></use>
                    </svg>
                 </span>
              </div>`,
            child: [zdttContainers.searchInp, zdttContainers.searchRes]
        }
    });
    var searchAction = parentHighlighter(searchBox);
    zdttContainers.searchInp.onfocus = searchAction.focus;
    var searchBeforeElem = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector("#zd_tt_artInpError");
    zdttContainers.searchInp.onblur = searchAction.unfocus.bind({
        callback: articleSelectedChecker(searchBeforeElem)
    });
    searchBeforeElem.parentElement.insertBefore(searchBox, searchBeforeElem);


    var triggerSizePopup = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-Selectbox-dropdown",
            id: "zohodesk_tooltip_size_dropDown_id"
        },
        elementData: {
            innerHTML: `<div class="zohodesk-Tooltip-dropdown-content"><ul class="zohodesk-Tooltip-list"></ul></div>`
        }
    });
    var triggerSizeSwitch = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-panel-form-selectbox",
            id: "zohodesk_tooltip_size_shown_id"
        },
        elementData: {
            innerHTML: obj.preferences.viewSize == "LARGE" ? extensionI18N.get('desk.asap.extention.triggers.large') : obj.preferences.viewSize == "MEDIUM" ? extensionI18N.get('desk.asap.extention.triggers.medium') : extensionI18N.get('desk.asap.extention.triggers.small')
        }
    });

    var opts = [{
        id: "zohodesk-Tooltip-small",
        name: extensionI18N.get('desk.asap.extention.triggers.small')
    }, {
        id: "zohodesk-Tooltip-medium",
        name: extensionI18N.get('desk.asap.extention.triggers.medium')
    }, {
        id: "zohodesk-Tooltip-large",
        name: extensionI18N.get('desk.asap.extention.triggers.large')
    }]
    for (opt of opts) {
        var li = domElement.create({
            elemName: "li",
            attributes: {
                class: "zohodesk-Tooltip-dropdown-options",
                id: opt.id
            },
            elementData: {
                innerHTML: opt.name
            },
            callbackList: [{
                click: triggerSizeCallback(opt.id, triggerSizeSwitch, obj)
            }]
        });
        triggerSizePopup.querySelector(".zohodesk-Tooltip-list").appendChild(li);
    }
    var triggerSizeBox = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-panel-form-field"
        },
        elementData: {
            child: [triggerSizeSwitch, triggerSizePopup]
        },
        parent: zdttContainers.zdtt_sidepanelSwitchingComp.querySelectorAll(".zohodesk-Tooltip-panel-form-field-label")[0].parentElement
    });

    var sizeAction = parentHighlighter(triggerSizeBox, {
        when: "click",
        element: triggerSizeSwitch
    });
    triggerSizeSwitch.onfocus = sizeAction.focus;
    triggerSizeSwitch.onblur = sizeAction.unfocus;

    var popupCallback = zdtt_popupShow(triggerSizePopup);
    triggerSizeSwitch.onclick = popupCallback;

    /* trigger action popup */

    var triggerActionPopup = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-Selectbox-dropdown",
            id: "zohodesk_tooltip_size_dropDown_id"
        },
        elementData: {
            innerHTML: `<div class="zohodesk-Tooltip-dropdown-content"><ul class="zohodesk-Tooltip-list"></ul></div>`
        }
    });
    var triggerActionSwitch = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-panel-form-selectbox",
            id: "zohodesk_tooltip_trigger"
        },
        elementData: {
            innerHTML: Trigger_option == "CLICK" ? extensionI18N.get('desk.asap.extention.triggers.onclick') : extensionI18N.get('desk.asap.extention.triggers.onhover')
        }
    });

    var opts = [{
        id: "zohodesk_tooltip_trigger_options_onClick",
        name: extensionI18N.get('desk.asap.extention.triggers.onclick')
    }, {
        id: "zohodesk_tooltip_trigger_options_onHover",
        name: extensionI18N.get('desk.asap.extention.triggers.onhover')
    }]
    for (opt of opts) {
        var li = domElement.create({
            elemName: "li",
            attributes: {
                class: "zohodesk-Tooltip-dropdown-options",
                id: opt.id
            },
            elementData: {
                innerHTML: opt.name
            },
            callbackList: [{
                click: triggerActionCallback(opt.id, triggerActionSwitch)
            }]
        });
        triggerActionPopup.querySelector(".zohodesk-Tooltip-list").appendChild(li);
    }
    var triggerSizeBox = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-panel-form-field"
        },
        elementData: {
            child: [triggerActionSwitch, triggerActionPopup]
        },
        parent: zdttContainers.zdtt_sidepanelSwitchingComp.querySelectorAll(".zohodesk-Tooltip-panel-form-field-label")[1].parentElement
    });

    var sizeAction = parentHighlighter(triggerSizeBox, {
        when: "click",
        element: triggerActionSwitch
    });
    triggerActionSwitch.onfocus = sizeAction.focus;
    triggerActionSwitch.onblur = sizeAction.unfocus;

    var popupCallback = zdtt_popupShow(triggerActionPopup);
    triggerActionSwitch.onclick = popupCallback;

    zdttContainers.editorParent = domElement.create({
        elemName: "div",
        attributes: {
            id: "editerToolsContainer"
        }
    });
    zdttContainers.zdtt_sidepanelSwitchingComp.querySelector(".zohodesk-Tooltip-editor-content").prepend(zdttContainers.editorParent)

    var manualBCInp = domElement.create({
        elemName: "input",
        attributes: {
            id: "ChromeAddonManualBackgroundColorInput",
            placeholder: "eg.,#000000",
            class: "zohodesk-Tooltip-color-value"
        },
        callbackList: [{
            input: manualBackgroundColorSetter
        }],
        parent: zdttContainers.zdtt_sidepanelSwitchingComp.querySelector(".zohodesk-Tooltip-color-name")
    });
    zdttInstantBGColorsCreater(zdttContainers.zdtt_sidepanelSwitchingComp.querySelector("#zd_tt_toggleTapsParent"));


    zdttContainers.saveBtn = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-footer-button zohodesk-Tooltip-footer-button-save",
            id: "TooltipSave"
        },
        elementData: {
            innerHTML: zdtt_saveBtnTxt
        },
        callbackList: [{
            click: zdtt_saveTrigger
        }],
        parent: zdttContainers.zdtt_sidepanelSwitchingComp.querySelector(".zohodesk-Tooltip-panel-footer")
    });
    zdttContainers.cancelBtn = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-footer-button zohodesk-Tooltip-footer-button-delete",
            id: "TooltipCancel"
        },
        elementData: {
            innerHTML: extensionI18N.get('desk.asap.extention.cancel')
        },
        callbackList: [{
            click: function() {
                listTabClicked(true)
            }
        }],
        parent: zdttContainers.zdtt_sidepanelSwitchingComp.querySelector(".zohodesk-Tooltip-panel-footer")
    });
    setTimeout(function() {
        let editorPlace = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector(".KB_Editor_iframe");
        if (editorPlace != undefined) {
            editorPlace.contentDocument.body.style.backgroundColor = obj.preferences.bgColor;
        }
    }, 200);

}






function zd_tt_addNewTrigger(type) {
    if (type == "new") {
        zdtt_nowStatus = "new";
        chrome_addons_inner_text = "";
    }
    if (type == "update") {
        zdtt_nowStatus = "update";
        chrome_addons_inner_text = ConfigureObjectForEdit.components["0"].content;
    }
    var func = objectCreaters(type);

    var topBanner = `<div class="zohodesk-Tooltip-TriggersTitle zohodesk-Tooltip-cl-both" id="zig">
        <div class="zohodesk-Tooltip-TriggersTitlelft"></div>
    </div>`;

    var html = `<div class="zohodesk-Tooltip-panel-content zohodesk-Tooltip-panel-contentplur">
        <div class="zohodesk-Tooltip-plurdiv" ></div>
       <div class="zohodesk-Tooltip-panel-headline-text">` + extensionI18N.get('desk.asap.extention.triggers.tooltipname') + ` <span style="color: #ff6f64;"> *</span> </div>
       <span class="zd_tt_errorbox mesaageHideAnim" id="zd_tt_tnError"></span>
        <div class="zohodesk-Tooltip-container" id="zdtt_plurPositionElem">
            <span class="zdtt-done zohodesk-Tooltip-hide" id="zdtt_triggerSelectedMsg">
                <span class="zohodesk-Tooltip-circlesvg">
                    <span class="zohodesk-Tooltip-tick"></span>
                    <svg class="zohodesk-Tooltip-part">  
                        <g class="zohodesk-Tooltip-g"> 
                            <circle class="zohodesk-Tooltip-circle"></circle>
                        </g> 
                    </svg>
                </span>
                <span class="zohodesk-Tooltip-selected">` + extensionI18N.get('desk.asap.extention.triggers.changedsuccessfully') + `</span>
            </span>
       </div>
       <div class="zohodesk-Tooltip-container" id="zd_tt_elementAlertBox">
            <div class="zohodesk-Tooltip-descriptionBox">
                <div class="zohodesk-Tooltip-descriptionBox-text">` + extensionI18N.get('desk.asap.extention.triggers.addtriggermessage') + `</div>
            </div>
        </div>
       <div class="zohodesk-Tooltip-panel-headline-text">` + extensionI18N.get('desk.asap.extention.triggers.choosearticle') + ` <span style="color: #ff6f64;"> *</span> </div>
       
       <span class="zd_tt_errorbox mesaageHideAnim" id="zd_tt_artInpError"></span>
       <div class="zohodesk-Tooltip-multi-form-field">
          <div class="zohodesk-Tooltip-fields">
             <div class="zohodesk-Tooltip-panel-form-field-label">` + extensionI18N.get('desk.asap.extention.triggers.tooltipsize') + `</div>
          </div>
          <div class="zohodesk-Tooltip-fields">
             <div class="zohodesk-Tooltip-panel-form-field-label">` + extensionI18N.get('desk.asap.extention.triggers.activatetrigger') + `</div>
          </div>
       </div>
       <div class="zohodesk-Tooltip-panel-headline-text">` + extensionI18N.get('desk.asap.extention.triggers.addtooltiptext') + ` <div class="zohodesk-Tooltip-charactertxt" id="zdttSizeCharInform">` + extensionI18N.get('desk.asap.extention.triggers.max') + `. 150 ` + extensionI18N.get('desk.asap.extention.triggers.characters') + `</div></div>
       <div class="zohodesk-Tooltip-editor-content">
          <div class="zohodesk-Tooltip-color-picker zohodesk-Tooltip-cl-both">
             <div class="zohodesk-Tooltip-lft-bar zohodesk-Tooltip-fl-lft">
                <ul class="zohodesk-Tooltip-cl-both zohodesk-Tooltip-list" id="zd_tt_toggleTapsParent">
                   
                </ul>
             </div>
             <div class="zohodesk-Tooltip-rt-bar zohodesk-Tooltip-fl-rt">
                <div class="zohodesk-Tooltip-user-input">
                   <span class="zohodesk-Tooltip-color-name"></span>
                </div>
             </div>
          </div>
       </div>
    </div>
    <div class="zohodesk-Tooltip-panel-footer">
    </div>
    `;
    var parent = zdttContainers.zdtt_sidepanelSwitchingComp;
    parent.innerHTML = topBanner + html;
    parent.querySelector(".zohodesk-Tooltip-panel-content").className += " zohodesk-Tooltip-Update-triggerFormHeight";
    domElement.create({
        elemName: "span",
        elementData: {
            innerHTML: `<span class="zdtbckarowcont" style="vertical-align: sub;">
                <svg class="zdtbckarow" style="padding: 0px 0px;">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#zdtarrowleft"></use>
                </svg>
            </span>
            <span class="zdtbckarowtxt">` + extensionI18N.get('desk.asap.extention.back') + `</span>`
        },
        callbackList: [{
            click: function() {
                listTabClicked(true)
            }
        }],
        parent: parent.querySelector(".zohodesk-Tooltip-TriggersTitlelft")
    });
    zdttFormElementCreater(type, func);
    functionLoaderCheck()

    zdtt_elementSelectorObj = new zd_tt_elementSelector({
        "elementsArrayCreater": func.elementsArrayCreater
    });
    zdttContainers.triggerNameInp.focus();
};

function zdttCommonHeaderCreater() {
    var headerChild = `<div class="zohodesk-Tooltip-cl-both">
         <div class="zohodesk-Tooltip-fl-lft">
            <span class="zohodesk-Tooltip-panel-header-text zohodesk-Tooltip-clrWhite">` + extensionI18N.get('desk.asap.extention.asap') + `</span>
            
         </div>
         <div id="zdttHeaderCom" class="zohodesk-Tooltip-fl-rt">
            
            <div class="zohodesk-Tooltip-inline-icons"></div>
         </div>
      </div>`;
    var tempElem = domElement.create({
        elemName: "div",
        elementData: {
            innerHTML: headerChild
        }
    });
    var closeIconParent = tempElem.querySelector(".zohodesk-Tooltip-inline-icons");
    var closeIcon = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-editor-iconclose panel-close",
            id: "closeEditor"
        },
        elementData: {
            innerHTML: `<svg class="zohodesk-tooltip-svg-icon-medium"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#Tooltip-close"></use></svg>`
        },
        callbackList: [{
            click: minimiseZDTTsidePanel
        }],
        parent: closeIconParent
    });

    var headerCom = tempElem.querySelector("#zdttHeaderCom");
    var userIcon = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-inline-icons",
            id: "userInfoIcon"
        },
        elementData: {
            innerHTML: `<div class="zohodesk-Tooltip-usricon"><img></div><div class="zohodesk-Tooltip-usrinfopopup zohodesk-Tooltip-Selectbox-dropdown" id="zohoDeskUserDetailsInfoPopup"><div class="zohodesk-Tooltip-usrinfoHead"><div class="zohodesk-Tooltip-usricon"><img></div><div class="zohodesk-Tooltip-usrinfoCont"></div></div><div class="zohodesk-Tooltip-usrinfoFoot"></div></div>`
        }
    });
    var popupCallback = zdtt_popupShow(userIcon.querySelector("#zohoDeskUserDetailsInfoPopup"));
    userIcon.onclick = popupCallback;
    headerCom.prepend(userIcon);
    var userImgParents = tempElem.querySelectorAll(".zohodesk-Tooltip-usricon");
    for (userImg of userImgParents) {
        var imgTag = userImg.getElementsByTagName("img");
        if (imgTag.length) {
            imgTag[0].src = zdTT_user.img;
        }
    }
    var userDetailsPopupParent = tempElem.querySelector(".zohodesk-Tooltip-usrinfoCont");
    var logoutParent = tempElem.querySelector(".zohodesk-Tooltip-usrinfoFoot");

    var toggleElem = domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-inline-icons zohodesk-Tooltip-selected-inline-icons",
            id: "sidePanel_float"
        },
        elementData: {
            innerHTML: `<span class="zohodesk-Tooltip-editor-iconalignleft"><svg class="zohodesk-tooltip-svg-icon-medium"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#Tooltip-alignright"></use></svg></span>`
        }
    });
    headerCom.prepend(toggleElem);
    domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-usrName",
            title: zdTT_user.name
        },
        elementData: {
            innerHTML: zdTT_user.name
        },
        parent: userDetailsPopupParent
    });
    domElement.create({
        elemName: "div",
        attributes: {
            class: "zohodesk-Tooltip-usrId",
            title: zdTT_user.mId
        },
        elementData: {
            innerHTML: zdTT_user.mId
        },
        parent: userDetailsPopupParent
    });

    domElement.create({
        elemName: "input",
        attributes: {
            id: "ZDTT_logOutBtn",
            type: "button"
        },
        elementData: {
            value: extensionI18N.get('desk.asap.extention.logout')
        },
        callbackList: [{
            click: zdTT_logOut
        }],
        parent: logoutParent
    });

    return tempElem.querySelector(".zohodesk-Tooltip-cl-both")
}

function zdttHighlighterRemover(obj) {
    for (trigger of obj.triggers) {
        var elem = document.querySelector(trigger.element);
        if (elem) {
            elem.className = elem.className.replace(" zohodesk-Tooltip-Configureborder", "");
            var nameBoard = elem.querySelector('.zohodesk-Tooltip-ConfigureCnt');
            if (nameBoard) {
                elem.removeChild(nameBoard);
            }
        }
    }
}



function emptyPageSlide(btns, panels) {
    this.lastFocused;
    this.panels = panels;
    this.btns = btns;
    this.timer;
    this.displayedPanel;
    this.autoSlide = this.autoSlide.bind(this);
    this.autoSlideCB = this.autoSlideCB.bind(this);
    this.focus = this.focus.bind(this);
    this.unfocus = this.unfocus.bind(this);
    this.binder = this.binder.bind(this);
    this.click = this.click.bind(this);
}
emptyPageSlide.prototype.unfocus = function(btn, panel) {
    if (btn) {
        btn.className = btn.className.split(" zohodesk-Tooltip-dotActivated").join("");
    }
    if (panel.elem) {
        panel.elem.className = panel.elem.className.split(" zdt-slideActive").join("");
        panel.elem.style.transform = panel.trans;
    }
}
emptyPageSlide.prototype.focus = function(ind) {
    if (this.btns[ind]) {
        if (this.btns[ind].className.indexOf("zohodesk-Tooltip-dotActivated") == -1) {
            this.btns[ind].className += " zohodesk-Tooltip-dotActivated";
            this.lastFocused = this.btns[ind];
        }
        if (this.panels[ind].className.indexOf("zdt-slideActive") == -1) {
            this.panels[ind].className += " zdt-slideActive";
            this.panels[ind].style.transform = "translate3d(-95px, 0%, 0px) scale(1)";
            this.displayedPanel = this.panels[ind];
        }
    }
    this.lastInd = ind;
}
emptyPageSlide.prototype.autoSlideCB = function() {
    if (this.lastFocused) {
        if (this.displayedPanel) {
            var trnsText = "translate3d(49px, 0%, 0px) scale(0.875)";
            if (this.lastInd == 1) {
                trnsText = "translate3d(-239px, 0%, 0px) scale(0.875)";
            }
            this.unfocus(this.lastFocused, {
                elem: this.displayedPanel,
                trans: trnsText
            });
        } else {
            this.unfocus(this.lastFocused);
        }
    }
    if (this.lastInd != undefined) {
        this.lastInd += 1;
        if (this.lastInd > this.btns.length || this.lastInd == this.btns.length) {
            this.lastInd = 0;
        }
    } else {
        this.lastInd = 0;
    }
    this.btns[this.lastInd].click();
};
emptyPageSlide.prototype.autoSlide = function() {
    this.timer = setInterval(this.autoSlideCB, 7000);
};
emptyPageSlide.prototype.click = function(ind) {
    return function() {
        clearInterval(this.timer);
        setTimeout(this.autoSlide(), 7000);
        if (this.lastFocused) {
            if (this.displayedPanel) {
                var trnsText = "translate3d(49px, 0%, 0px) scale(0.875)";
                if (ind == 1) {
                    trnsText = "translate3d(-239px, 0%, 0px) scale(0.875)";
                }
                this.unfocus(this.lastFocused, {
                    elem: this.displayedPanel,
                    trans: trnsText
                });
            } else {
                this.unfocus(this.lastFocused);
            }
        }
        this.focus(ind);
    }.bind(this)
};
emptyPageSlide.prototype.binder = function() {
    var ind = 0;
    for (btn of this.btns) {
        btn.onclick = this.click(ind);
        ind++
    }
};


function emptyListPageCreater() {
    if (listOfTriggersObj.length == 0) {
        var slide1 = domElement.create({
            elemName: "li",
            attributes: {
                class: "zohodesk-Tooltip-slidenext zdt-activeTrigList"
            },
            elementData: {
                innerHTML: `<div class="posrel">
                    <div class="zohodesk-Tooltip-notrigsvg">
                        <svg>
                            <use xlink:href="#slide_1"></use>
                        </svg>
                    </div>
                    <div class="zdtgray2 zdtfw500 zdtmt24">` + extensionI18N.get('desk.asap.extention.triggers.slide.one.heading') + `</div>
                    <div class="zdtgrayDis zdtpdng40 zdtmt24">` + extensionI18N.get('desk.asap.extention.triggers.slide.one.content') + `</div>
                </div>`
            }
        });
        var slide2 = domElement.create({
            elemName: "li",
            attributes: {
                class: "zohodesk-Tooltip-slidenext zdt-activeTrigList"
            },
            elementData: {
                innerHTML: `<div class="posrel">
                    <div class="zohodesk-Tooltip-notrigsvg">
                        <svg>
                            <use xlink:href="#slide_2"></use>
                        </svg>
                    </div>
                    <div class="zdtgray2 zdtfw500 zdtmt24">` + extensionI18N.get('desk.asap.extention.triggers.slide.two.heading') + `</div>
                    <div class="zdtgrayDis zdtpdng40 zdtmt24">` + extensionI18N.get('desk.asap.extention.triggers.slide.two.content') + `</div>
                </div>`
            }
        });
        var ul = domElement.create({
            elemName: "ul",
            elementData: {
                child: [slide1, slide2]
            }
        });

        var empParentFirstChild = domElement.create({
            elemName: "div",
            attributes: {
                class: "zohodesk-Tooltip-notrigHead"
            },
            elementData: {
                innerHTML: `<svg class="zdtw18 zdth18 zdtgray2"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#zdtinfo"></use></svg><span class="zdtgray2 zdtfw500 pl10">` + extensionI18N.get('desk.asap.extention.triggers.empheading') + `</span>`
            }
        });

        var slideSwitches = [];

        for (var i = 0; i < 2; i++) {
            slideSwitches.push(domElement.create({
                elemName: "span",
                attributes: {
                    class: "zohodesk-Tooltip-dotcircleIn"
                }
            }))
        }
        var slideSwitchParent = domElement.create({
            elemName: "div",
            attributes: {
                class: "zohodesk-Tooltip-dotcircle"
            },
            elementData: {
                child: slideSwitches
            }
        });
        var empObj = new emptyPageSlide(slideSwitches, [slide1, slide2]);
        empObj.binder();
        slideSwitches[0].click();

        var addNewBtn = domElement.create({
            elemName: "div",
            attributes: {
                class: "zdtbtn zdtbtn-success"
            },
            callbackList: [{
                click: function() {
                    addNewTabClicked()
                }
            }],
            elementData: {
                innerHTML: extensionI18N.get('desk.asap.extention.addtooltip'),
            }
        });

        var addNewBtnPrnt = domElement.create({
            elemName: "div",
            attributes: {
                class: "zdtfnt0 zdtmt41"
            },
            elementData: {
                child: [addNewBtn]
            }
        });

        var slideParent = domElement.create({
            elemName: "div",
            attributes: {
                class: "zohodesk-Tooltip-slideIn"
            },
            elementData: {
                innerHTML: `<div class="zohodesk-Tooltip-slidemainDiv"><div class="zohodesk-Tooltip-slides" id="zdttEmptySlides"></div></div>`,
                child: [slideSwitchParent, addNewBtnPrnt]
            }
        });
        slideParent.querySelector("#zdttEmptySlides").appendChild(ul);

        var empParentLastChild = domElement.create({
            elemName: "div",
            attributes: {
                class: "zohodesk-Tooltip-slidemain"
            },
            elementData: {
                child: [slideParent]
            }
        });

        var empParent = domElement.create({
            elemName: "div",
            attributes: {
                class: "zdttxtAlgnCntr zohodesk-Tooltip-notrigsvg"
            },
            elementData: {
                child: [empParentFirstChild, empParentLastChild]
            }
        });

        if (lastLoadingElem) {
            lastLoadingElem.remove();
            lastLoadingElem = undefined;
        }
        if (!TriggerListAllObjMaintanense.length) {
            if (zdttContainers.headerTabsParent) {
                zdttContainers.headerTabsParent.parentElement.removeChild(zdttContainers.headerTabsParent);
                delete zdttContainers.headerTabsParent;
                zdttContainers.zdtt_sidepanelSwitchingComp.className += " zohodesk-Tooltip-height";
            }
            zdttContainers.zdtt_sidepanelSwitchingComp.innerHTML = "";
            zdttContainers.zdtt_sidepanelSwitchingComp.appendChild(empParent);
        } else {
            zdttCommonListPage(empParent);
            zdttContainers.ListParent.appendChild(empParent);
        }
    }
}



function zd_tt_triggerListFilter(inp) {
    return function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (inp == "ALL") {
            if (zd_tt_triggerListing != "ALL") {
                unHighlightTheOld();
                _zdattElemHighlighter.remove();
                if (zdttContainers.ListParent) {
                    zdttContainers.ListParent.parentElement.removeChild(zdttContainers.ListParent);
                    delete zdttContainers.ListParent;
                }
                lastLoadingElem = zdttLoading(zdttContainers.zdtt_sidepanelSwitchingComp);
                lastLoadingElem.inject();
                listOfTriggersObj = TriggerListAllObjMaintanense.slice();
                zd_tt_triggerListInitiater(listOfTriggersObj, lastLoadingElem);
                zd_tt_triggerListing = "ALL";
                zdttContainers.filterSwitch.innerHTML = extensionI18N.get('desk.asap.extention.all');
            }
        } else if (inp == "CREATED_BY_ME") {
            if (zd_tt_triggerListing != "CREATED_BY_ME") {
                unHighlightTheOld();
                _zdattElemHighlighter.remove();
                if (zdttContainers.ListParent) {
                    zdttContainers.ListParent.parentElement.removeChild(zdttContainers.ListParent);
                    delete zdttContainers.ListParent;
                }
                lastLoadingElem = zdttLoading(zdttContainers.zdtt_sidepanelSwitchingComp);
                lastLoadingElem.inject();
                if (zdTT_user.proId) {
                    let filteredArray = [];
                    for (triggerObj of TriggerListAllObjMaintanense) {
                        if (zdTT_user.proId == triggerObj.modifiedBy.id) {
                            filteredArray.push(triggerObj);
                        }
                    }
                    listOfTriggersObj = filteredArray;
                    zd_tt_triggerListInitiater(listOfTriggersObj, lastLoadingElem);
                    zd_tt_triggerListing = "CREATED_BY_ME";
                    zdttContainers.filterSwitch.innerHTML = extensionI18N.get('desk.asap.extention.createdbyme');
                }
            }
        }
    }
}


function deleteCallBackCreater(elem, cls) {
    return function(res) {
        if (res.responseStatus === 200) {
            unHighlightTheOld();
            _zdattElemHighlighter.remove();
            if (elem.parentElement != null) {
                if (elem.className.indexOf("zohodesk-Tooltip-animatt") != -1) {
                    elem.parentElement.removeChild(elem);
                } else {
                    setTimeout(function() {
                        elem.parentElement.removeChild(elem);
                    }, 300);
                }
            }
            var ind = 0
            for (trigger of listOfTriggersObj) {
                if (elem.id == trigger.id) {
                    zdttElementEventRemover(trigger);
                    zdttHighlighterRemover(trigger);
                    listOfTriggersObj.splice(ind, 1);
                    if (TriggerListAllObjMaintanense.length != 0) {
                        var Ind = 0;
                        for (Triger of TriggerListAllObjMaintanense) {
                            if (Triger.id == elem.id) {
                                TriggerListAllObjMaintanense.splice(Ind, 1);
                            }
                            Ind++
                        }
                    }
                    emptyListPageCreater();
                }
                ind++
            }
        } else {
            if (res.obj.message == "You Have No Permission to Perform this Action") {
                createToolTipErrorPopupBox({
                    id: "editorBody",
                    buttons: [{
                        id: "zd_tt_permissionErrors",
                        content: "ok",
                        callbackList: [{
                            mousedown: closeEPwithcloseExtension
                        }]
                    }],
                    content: "<b>You have no permission to configure this portal.</b> Please contact your PORTAL admin."
                });
            } else {
                elem.className = elem.className.split(cls).join("");
                elem.className = elem.className.split(" zohodesk-Tooltip-heightAnim").join("");
            }
        }
    }
}

function unfocusOtherTabs(elems) {
    for (elem of elems) {
        if (elem) {
            if (elem.className.indexOf("zohodesk-Tooltip-selectedOpts") != -1) {
                elem.className = elem.className.split(" zohodesk-Tooltip-selectedOpts").join("")
            }
        }
    }
}

function listTabClicked(e) {
    if (zdtt_nowStatus == "update") {
        if (lastObjectOfUpdatedTriggerFUB) {
            zdttElementEventRemover(lastObjectOfUpdatedTriggerFUB);
            Chrome_Extension_RequireFunctionFlow([lastObjectOfUpdatedTriggerFUB]);
        }
    }
    if (zdttTabs.list) {
        if (zdttTabs.update.className.indexOf("zohodesk-Tooltip-hide") == -1) {
            zdttTabs.update.className += " zohodesk-Tooltip-hide";
        }
        if (zdttTabs.list.className.indexOf("zohodesk-Tooltip-selectedOpts") == -1 || e == true) {
            zdttTabs.list.className += " zohodesk-Tooltip-selectedOpts";
            objInitializer();
            zd_tt_articleSelected = false;
            if (zdtt_elementSelectorObj) {
                zdtt_elementSelectorObj.detachClickListener();
                zdtt_elementSelectorObj = undefined;
            }
            zd_tt_removeMouseOverElements();
            zd_tt_triggerListInitiater(listOfTriggersObj);
        }
        unfocusOtherTabs([
            zdttTabs.update,
            zdttTabs.guide
        ]);
    } else {
        objInitializer();
        zd_tt_articleSelected = false;
        if (zdtt_elementSelectorObj) {
            zdtt_elementSelectorObj.detachClickListener();
            zdtt_elementSelectorObj = undefined;
        }
        zd_tt_removeMouseOverElements();
        zd_tt_triggerListInitiater(listOfTriggersObj)
    }
}

function addNewTabClicked(e) {
    if (zdttTabs.list) {
        if (zdttTabs.update.className.indexOf("zohodesk-Tooltip-hide") == -1) {
            zdttTabs.update.className += " zohodesk-Tooltip-hide";
        }
        if (zdttTabs.list.className.indexOf("zohodesk-Tooltip-selectedOpts") == -1) {
            zdttTabs.list.className += " zohodesk-Tooltip-selectedOpts";
        }
        objInitializer();
        zd_tt_removeMouseOverElements();
        zd_tt_addNewTrigger("new");
        unfocusOtherTabs([
            zdttTabs.guide
        ]);
    } else {
        zd_tt_addNewTrigger("new");
    }
}

function updateTabClicked(name) {
    if (zdttTabs.update) {
        zdttTabs.update.className = zdttTabs.update.className.split(" zohodesk-Tooltip-hide").join("");
        zdttTabs.update.innerHTML = name;
        if (zdttTabs.update.className.indexOf("zohodesk-Tooltip-selectedOpts") == -1) {
            zdttTabs.update.className += " zohodesk-Tooltip-selectedOpts";
        }
        unfocusOtherTabs([zdttTabs.addNew, zdttTabs.guide, zdttTabs.list]);
    }
}

function zdTTSwitchGuideTab() {
    getConfiguredWalkthroughList();
}

var guideUI;

function guideTabClicked(e) {
    if (zdtt_nowStatus == "update") {
        if (lastObjectOfUpdatedTriggerFUB) {
            zdttElementEventRemover(lastObjectOfUpdatedTriggerFUB);
            Chrome_Extension_RequireFunctionFlow([lastObjectOfUpdatedTriggerFUB]);
        }
    }
    if (zdttTabs.guide) {
        if (zdttTabs.update.className.indexOf("zohodesk-Tooltip-hide") == -1) {
            zdttTabs.update.className += " zohodesk-Tooltip-hide";
        }
        if (zdttTabs.guide.className.indexOf("zohodesk-Tooltip-selectedOpts") == -1) {
            zdttTabs.guide.className += " zohodesk-Tooltip-selectedOpts";
            objInitializer();
            zd_tt_articleSelected = false;
            if (zdtt_elementSelectorObj) {
                zdtt_elementSelectorObj.detachClickListener();
                zdtt_elementSelectorObj = undefined;
            }
            zd_tt_removeMouseOverElements();
            zdTTSwitchGuideTab();
            if (!guideUI) {
                guideUI = new createGuideAllUI(zdttContainers.zdtt_sidepanelSwitchingComp);
            }
            guideUI.create();
        }
        unfocusOtherTabs([
            zdttTabs.list,
            zdttTabs.update
        ]);
    }
}

function ZDTT_topHeaderTapsCreater() {
    if (!zdttContainers.headerTabsParent) {
        if (!zdttTabs.list && !zdttTabs.update) { //  && !zdttTabs.addNew 
            zdttTabs.list = domElement.create({
                elemName: "li",
                attributes: {
                    class: "zohodesk-Tooltip-toggleTap-li zohodesk-Tooltip-fl-lft zohodesk-Tooltip-selectOpts",
                    id: "triggerListViewTap"
                },
                elementData: {
                    innerHTML: extensionI18N.get('desk.asap.extention.tooltips')
                },
                callbackList: [{
                    click: listTabClicked
                }]
            });
            zdttTabs.guide = domElement.create({
                elemName: "li",
                attributes: {
                    class: "zohodesk-Tooltip-toggleTap-li zohodesk-Tooltip-fl-lft zohodesk-Tooltip-selectOpts",
                    id: "zdttGuideTab"
                },
                elementData: {
                    innerHTML: extensionI18N.get('desk.asap.extention.guides')
                },
                callbackList: [{
                    click: guideTabClicked
                }]
            });
            zdttTabs.update = domElement.create({
                elemName: "li",
                attributes: {
                    class: "zohodesk-Tooltip-toggleTap-li zohodesk-Tooltip-fl-lft zohodesk-Tooltip-selectOpts zohodesk-Tooltip-hide",
                    id: "updateTriggerNameTap"
                },
                elementData: {
                    innerHTML: ""
                }
            });
        }
        zdttTabs.list.className = zdttTabs.list.className.split(" zohodesk-Tooltip-selectedOpts").join("");
        zdttTabs.guide.className = zdttTabs.guide.className.split(" zohodesk-Tooltip-selectedOpts").join("");
        zdttTabs.update.className = zdttTabs.update.className.split(" zohodesk-Tooltip-selectedOpts").join("");
        var ul = domElement.create({
            elemName: "ul",
            attributes: {
                class: "zohodesk-Tooltip-cl-both zohodesk-Tooltip-list",
                id: "zdtt-taps-parent"
            },
            elementData: {
                child: [
                    zdttTabs.list,
                    zdttTabs.guide,
                    zdttTabs.update
                ]
            }
        });

        zdttContainers.headerTabsParent = domElement.create({
            elemName: "div",
            attributes: {
                class: "zohodesk-Tooltip-selectOptsContent",
                id: "header-comenContainer"
            },
            elementData: {
                child: [ul]
            }
        });
        zdttContainers.zdtt_sidepanelHeader.appendChild(zdttContainers.headerTabsParent);
    }
}

function zdttInstantBGColorsCreater(elem) {
    for (var i = 1; i < 10; i++) {

        var span = domElement.create({
            elemName: "span",
            attributes: {
                class: "zohodesk-Tooltip-color",
                id: "zohodesk-Tooltip-color-" + i
            },
            callbackList: [{
                click: separateColorHighliter
            }]
        })

        var li = domElement.create({
            elemName: "li",
            attributes: {
                class: "zohodesk-Tooltip-clr-box"
            },
            elementData: {
                child: [span]
            },
            parent: elem
        })

    }

}


function zdtt_saveTrigger(e) {
    var finalObj = undefined;
    if (zdtt_nowStatus == "new") {
        finalObj = zd_tt_addTooltipObj;
        var msg = "desk.asap.extention.saving";
    } else if (zdtt_nowStatus == "update") {
        finalObj = ConfigureObjectForEdit;
        var msg = "desk.asap.extention.uploading";
    }
    var errorElems = [];
    if (finalObj.name == undefined || finalObj.name == "") {
        if (zdttContainers.triggerNameInp.parentElement.className.indexOf("zd_tt_notfilledErrorStyle") == -1) {
            zdttContainers.triggerNameInp.parentElement.className += " zd_tt_notfilledErrorStyle";
        }
        var errorElem = zdttContainers.triggerNameInp.parentElement.nextElementSibling;
        errorElem.innerText = "* " + extensionI18N.get('desk.asap.extention.triggers.nameerrormessage');
        errorElem.className = errorElem.className.split(" mesaageHideAnim").join("");
        errorElems.push(zdttContainers.triggerNameInp);
    }
    if (finalObj.components["0"].solutionId == undefined) {
        if (zdttContainers.searchInp.parentElement.className.indexOf("zd_tt_notfilledErrorStyle") == -1) {
            zdttContainers.searchInp.parentElement.className += " zd_tt_notfilledErrorStyle";
        }
        var articleErrorElem = zdttContainers.searchInp.parentElement.nextElementSibling;
        articleErrorElem.innerText = "* " + extensionI18N.get('desk.asap.extention.triggers.articleerrormessage');
        articleErrorElem.className = articleErrorElem.className.split(" mesaageHideAnim").join("");
        errorElems.push(zdttContainers.searchInp);
    }
    if (zd_tt_arrayOfElements.length == 0) {
        createToolTipErrorPopupBox({
            id: "editorBody",
            buttons: [{
                id: "zd_tt_ok",
                content: "ok"
            }],
            content: "select the atleast one trigger point to save message ."
        });
    }
    if (finalObj.name != undefined && finalObj.name != "") {
        if (finalObj.components["0"].solutionId != undefined) {
            if (zd_tt_arrayOfElements.length != 0) {
                let formParent = zdttContainers.zdtt_sidepanelSwitchingComp.querySelector(".zohodesk-Tooltip-panel-content");
                formParent.scrollTop = 0;
                if (formParent != undefined && formParent != null) {
                    if (formParent.className.indexOf("zohodesk-Tooltip-panel-contentplur") == -1) {
                        formParent.className += " zohodesk-Tooltip-panel-contentplur";
                        let plurdiv = domElement.create({
                            elemName: "div",
                            attributes: {
                                class: "zohodesk-Tooltip-plurdiv"
                            }
                        })
                        formParent.prepend(plurdiv);
                        lastLoadingElem = zdttLoading(formParent, msg);
                        lastLoadingElem.inject({
                            pzi: 99999,
                            pleft: 0
                        });
                        plurdiv.style.top = 0;
                        plurdiv.style.cursor = "default";
                    }
                }
                zdtt_saveTriggerAPIcall(e);
            }
        }
    }
};

function errorMsgs(msg) {
    var message = "Sorry , unable to reach the server .";
    if (msg == "Invalid Value For Param bgColor") {
        message = "Please give a valid colour value ."
    }
    if (msg == "Invalid Value For Param name") {
        message = "Invalid Trigger Name . please check the trigger name .";
    }

    return message
}

function zdtt_saveTriggerAPIcall(e) {
    e.target.removeEventListener("click", zdtt_saveTrigger, true);
    var windowLocationHref = encodeURI(decodeURI(window.location.pathname)); //+"#"+window.location.href.split("#")[1];
    var finalObj = undefined;
    if (zdtt_nowStatus == "new") {
        finalObj = zd_tt_addTooltipObj;
    } else if (zdtt_nowStatus == "update") {
        delete ConfigureObjectForEdit.modifiedBy;
        delete ConfigureObjectForEdit.viewCount;
        if (typeof(ConfigureObjectForEdit.preferences) != "object") {
            if (typeof(ConfigureObjectForEdit.preferences) == "string") {
                ConfigureObjectForEdit.preferences = JSON.parse(ConfigureObjectForEdit.preferences)
            } else if (typeof(ConfigureObjectForEdit.preferences) == "undefined") {
                ConfigureObjectForEdit.preferences = {};
            }
        }
        finalObj = ConfigureObjectForEdit;
    }
    finalObj.triggers = [];
    zd_tt_arrayOfElements.forEach(function(arg) {
        finalObj.triggers.push({
            "element": arg,
            "event": Trigger_option,
            "url": windowLocationHref
        });
    });
    var popupBackgroundColor = finalizedColor;
    popupBackgroundColor = popupBackgroundColor.toLocaleLowerCase();
    if (popupBackgroundColor == "") {
        popupBackgroundColor = "#ffffff";
    }
    if (popupBackgroundColor.indexOf("#") == -1) {
        if (popupBackgroundColor.indexOf("rgba") != -1) {
            var arrayOfRGBA = popupBackgroundColor.split("rgba(")[1].split(")")[0].split(",");
            var arrayOfRGB = zd_colorValueChanger.RGBAtoRGB(arrayOfRGBA[0], arrayOfRGBA[1], arrayOfRGBA[2], arrayOfRGBA[3], 255, 255, 255);
            arrayOfRGB = arrayOfRGB.split("rgb(")[1].split(")")[0].split(",");
            popupBackgroundColor = zd_colorValueChanger.rgbToHex(parseInt(arrayOfRGB[0]), parseInt(arrayOfRGB[1]), parseInt(arrayOfRGB[2]));
        } else if (popupBackgroundColor.indexOf("rgb") != -1) {
            var arrayOfRGB = popupBackgroundColor.split("rgb(")[1].split(")")[0].split(",");
            popupBackgroundColor = zd_colorValueChanger.rgbToHex(parseInt(arrayOfRGB[0]), parseInt(arrayOfRGB[1]), parseInt(arrayOfRGB[2]));
        }
    }
    if (finalObj.preferences.selector != undefined) {
        delete finalObj.preferences["selector"];
    }
    finalObj.preferences.bgColor = popupBackgroundColor;
    finalObj.components[0].content = zdttContainers.editorParent.querySelector(".KB_Editor_iframe").contentDocument.body.innerHTML;
    if (zdtt_nowStatus == "new") {
        var Zohodesk_Chrome_Extension_Save_Configure_Snippet_Url = "https://" + commomDomainNameForAPI + "/api/web/extensions/" + ExtensionProjectId + "/messages?orgId=" + organitationID;


        let url = "https://" + commomDomainNameForAPI + "/api/web/extensions/" + ExtensionProjectId + "/messages?orgId=" + organitationID;
        zdaTTcommonAPIcaller(url, "post", tooltipDataSave_successCB, tooltipDataSaveUpate_failCB, finalObj, '', "editorBody");
    } else if (zdtt_nowStatus == "update") {
        if (ConfigureObjectForEdit.dontEdit != undefined) {
            delete ConfigureObjectForEdit.dontEdit
        }
        var Zohodesk_Chrome_Extension_Update_Configure_Snippet_Url = "https://" + commomDomainNameForAPI + "/api/web/extensions/" + ExtensionProjectId + "/messages/" + ConfigureObjectForEdit.id + "?orgId=" + organitationID;

        let url = "https://" + commomDomainNameForAPI + "/api/web/extensions/" + ExtensionProjectId + "/messages/" + ConfigureObjectForEdit.id + "?orgId=" + organitationID;
        zdaTTcommonAPIcaller(url, "put", tooltipDataUpate_successCB, tooltipDataSaveUpate_failCB, ConfigureObjectForEdit, '', "editorBody");
    }
}


zdttContainers.zdtt_sidepanelSwitchingComp = domElement.create({
    elemName: "div",
    attributes: {
        id: "ZDTT_switching_comonElem",
        class: "zohodesk-Tooltip-pstnrltv zohodesk-Tooltip-height"
    }
})
var zdtt_CommonHeader = zdttCommonHeaderCreater();
zdttContainers.zdtt_sidepanelHeader = domElement.create({
    elemName: "div",
    attributes: {
        id: "zdtt_headerContainer",
        class: "zohodesk-Tooltip-panel-header"
    },
    elementData: {
        child: [zdtt_CommonHeader]
    }
})
zdttContainers.zdtt_sidePanelDirectChild = domElement.create({
    elemName: "div",
    attributes: {
        id: "editorBody",
        class: "zohodesk-Tooltip-panel"
    },
    elementData: {
        child: [zdtt_Temp.sidePanelSVG.content.cloneNode(true), zdttContainers.zdtt_sidepanelHeader, zdttContainers.zdtt_sidepanelSwitchingComp]
    }
})

zdttContainers.zdtt_sidePanel = domElement.create({
    elemName: "div",
    attributes: {
        id: "ToolTipEditorPosition",
        class: "zohodesk-tooltip-displayinline zohodesk-Tooltip-panel-right"
    },
    elementData: {
        child: [zdttContainers.zdtt_sidePanelDirectChild]
    }
})

var zdtt_minimizeIconHost = domElement.create({
    elemName: "div",
    attributes: {
        id: "zdtt_minimizeIconHost"
    },
    parent: zdttTempParent
})
shadowRootCreater(zdtt_minimizeIconHost, zdtt_Temp.minimizeIcon);

zdtt_minimizeIconHost.shadowRoot.querySelector("#maxiIcon").onclick = maximizeSidePanel;

var zdtt_sidePanelHost = domElement.create({
    elemName: "div",
    attributes: {
        id: "zdtt_sidePanelHost"
    },
    parent: zdttTempParent
})
shadowRootCreater(zdtt_sidePanelHost, zdtt_Temp.sidePanel, [zdttContainers.zdtt_sidePanel])
window.postMessage({
    name: "Zohodesk_Chrome_Extension_AsapDetails"
}, "*");

var maxZIndexValue = findHighestZIndex('div');
var editerBodyZI = zdtt_pageMaxZIndexValue + 5;
var ASapBodyZI = zdtt_pageMaxZIndexValue + 8;
zdttContainers.zdtt_sidePanel.style.zIndex = editerBodyZI;
var asapCondainerSItimer = setInterval(function() {
    if (document.getElementById("zohohc-asap-viewers") != undefined) {
        document.getElementById("zohohc-asap-viewers").style.zIndex = ASapBodyZI;
        clearInterval(asapCondainerSItimer);
    }
}, 500);

var panelToggle = new zdttSidePanelAlignmentEvent(zdttContainers.zdtt_sidePanel, zdtt_CommonHeader.querySelector("#sidePanel_float"));
zdttCommonEventsBinder();