"use strict";
// @ts-nocheck
// Imports
// Make the dropdowns searchable (must be initiated after data is added)
// Source: https://bluzky.github.io/nice-select2/
// Library code
!function (e, t) { "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.NiceSelect = t() : e.NiceSelect = t(); }(self, (function () { return (() => {
    "use strict";
    var e = { d: (t, i) => { for (var s in i)
            e.o(i, s) && !e.o(t, s) && Object.defineProperty(t, s, { enumerable: !0, get: i[s] }); }, o: (e, t) => Object.prototype.hasOwnProperty.call(e, t), r: e => { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }); } }, t = {};
    function i(e) { var t = document.createEvent("MouseEvents"); t.initEvent("click", !0, !1), e.dispatchEvent(t); }
    function s(e) { var t = document.createEvent("HTMLEvents"); t.initEvent("change", !0, !1), e.dispatchEvent(t); }
    function o(e) { var t = document.createEvent("FocusEvent"); t.initEvent("focusin", !0, !1), e.dispatchEvent(t); }
    function n(e) { var t = document.createEvent("FocusEvent"); t.initEvent("focusout", !0, !1), e.dispatchEvent(t); }
    function d(e, t) { return e.getAttribute(t); }
    function r(e, t) { return !!e && e.classList.contains(t); }
    function l(e, t) { if (e)
        return e.classList.add(t); }
    function a(e, t) { if (e)
        return e.classList.remove(t); }
    e.r(t), e.d(t, { default: () => p, bind: () => u });
    var c = { data: null, searchable: !1 };
    function p(e, t) { this.el = e, this.config = Object.assign({}, c, t || {}), this.data = this.config.data, this.selectedOptions = [], this.placeholder = d(this.el, "placeholder") || this.config.placeholder || "Select an option", this.dropdown = null, this.multiple = d(this.el, "multiple"), this.disabled = d(this.el, "disabled"), this.create(); }
    function u(e, t) { return new p(e, t); }
    return p.prototype.create = function () { this.el.style.display = "none", this.data ? this.processData(this.data) : this.extractData(), this.renderDropdown(), this.bindEvent(); }, p.prototype.processData = function (e) { var t = []; e.forEach((e => { t.push({ data: e, attributes: { selected: !1, disabled: !1, optgroup: "optgroup" == e.value } }); })), this.options = t; }, p.prototype.extractData = function () { var e = this.el.querySelectorAll("option,optgroup"), t = [], i = [], s = []; e.forEach((e => { if ("OPTGROUP" == e.tagName)
        var s = { text: e.label, value: "optgroup" };
    else
        s = { text: e.innerText, value: e.value }; var o = { selected: null != e.getAttribute("selected"), disabled: null != e.getAttribute("disabled"), optgroup: "OPTGROUP" == e.tagName }; t.push(s), i.push({ data: s, attributes: o }); })), this.data = t, this.options = i, this.options.forEach((function (e) { e.attributes.selected && s.push(e); })), this.selectedOptions = s; }, p.prototype.renderDropdown = function () { var e = `<div class="${["nice-select", d(this.el, "class") || "", this.disabled ? "disabled" : "", this.multiple ? "has-multiple" : ""].join(" ")}" tabindex="${this.disabled ? null : 0}">\n  <span class="${this.multiple ? "multiple-options" : "current"}"></span>\n  <div class="nice-select-dropdown">\n  ${this.config.searchable ? '<div class="nice-select-search-box">\n<input type="text" class="nice-select-search" placeholder="Search..."/>\n</div>' : ""}\n  <ul class="list"></ul>\n  </div></div>\n`; this.el.insertAdjacentHTML("afterend", e), this.dropdown = this.el.nextElementSibling, this._renderSelectedItems(), this._renderItems(); }, p.prototype._renderSelectedItems = function () { if (this.multiple) {
        var e = "";
        "auto" == window.getComputedStyle(this.dropdown).width || this.selectedOptions.length < 2 ? (this.selectedOptions.forEach((function (t) { e += `<span class="current">${t.data.text}</span>`; })), e = "" == e ? this.placeholder : e) : e = this.selectedOptions.length + " selected", this.dropdown.querySelector(".multiple-options").innerHTML = e;
    }
    else {
        var t = this.selectedOptions.length > 0 ? this.selectedOptions[0].data.text : this.placeholder;
        this.dropdown.querySelector(".current").innerHTML = t;
    } }, p.prototype._renderItems = function () { var e = this.dropdown.querySelector("ul"); this.options.forEach((t => { e.appendChild(this._renderItem(t)); })); }, p.prototype._renderItem = function (e) { var t = document.createElement("li"); if (t.innerHTML = e.data.text, e.attributes.optgroup)
        t.classList.add("optgroup");
    else {
        t.setAttribute("data-value", e.data.value);
        var i = ["option", e.attributes.selected ? "selected" : null, e.attributes.disabled ? "disabled" : null];
        t.addEventListener("click", this._onItemClicked.bind(this, e)), t.classList.add(...i);
    } return e.element = t, t; }, p.prototype.update = function () { if (this.extractData(), this.dropdown) {
        var e = r(this.dropdown, "open");
        this.dropdown.parentNode.removeChild(this.dropdown), this.create(), e && i(this.dropdown);
    } }, p.prototype.disable = function () { this.disabled || (this.disabled = !0, l(this.dropdown, "disabled")); }, p.prototype.enable = function () { this.disabled && (this.disabled = !1, a(this.dropdown, "disabled")); }, p.prototype.clear = function () { this.selectedOptions = [], this._renderSelectedItems(), this.updateSelectValue(), s(this.el); }, p.prototype.destroy = function () { this.dropdown && (this.dropdown.parentNode.removeChild(this.dropdown), this.el.style.display = ""); }, p.prototype.bindEvent = function () { this.dropdown.addEventListener("click", this._onClicked.bind(this)), this.dropdown.addEventListener("keydown", this._onKeyPressed.bind(this)), this.dropdown.addEventListener("focusin", o.bind(this, this.el)), this.dropdown.addEventListener("focusout", n.bind(this, this.el)), window.addEventListener("click", this._onClickedOutside.bind(this)), this.config.searchable && this._bindSearchEvent(); }, p.prototype._bindSearchEvent = function () { var e = this.dropdown.querySelector(".nice-select-search"); e && e.addEventListener("click", (function (e) { return e.stopPropagation(), !1; })), e.addEventListener("input", this._onSearchChanged.bind(this)); }, p.prototype._onClicked = function (e) { if (this.multiple ? this.dropdown.classList.add("open") : this.dropdown.classList.toggle("open"), this.dropdown.classList.contains("open")) {
        var t = this.dropdown.querySelector(".nice-select-search");
        t && (t.value = "", t.focus());
        var i = this.dropdown.querySelector(".focus");
        a(i, "focus"), l(i = this.dropdown.querySelector(".selected"), "focus"), this.dropdown.querySelectorAll("ul li").forEach((function (e) { e.style.display = ""; }));
    }
    else
        this.dropdown.focus(); }, p.prototype._onItemClicked = function (e, t) { var i = t.target; r(i, "disabled") || (this.multiple ? r(i, "selected") ? (a(i, "selected"), this.selectedOptions.splice(this.selectedOptions.indexOf(e), 1), this.el.querySelector('option[value="' + i.dataset.value + '"]').selected = !1) : (l(i, "selected"), this.selectedOptions.push(e)) : (this.selectedOptions.forEach((function (e) { a(e.element, "selected"); })), l(i, "selected"), this.selectedOptions = [e]), this._renderSelectedItems(), this.updateSelectValue()); }, p.prototype.updateSelectValue = function () { if (this.multiple) {
        var e = this.el;
        this.selectedOptions.forEach((function (t) { var i = e.querySelector('option[value="' + t.data.value + '"]'); i && i.setAttribute("selected", !0); }));
    }
    else
        this.selectedOptions.length > 0 && (this.el.value = this.selectedOptions[0].data.value); s(this.el); }, p.prototype._onClickedOutside = function (e) { this.dropdown.contains(e.target) || this.dropdown.classList.remove("open"); }, p.prototype._onKeyPressed = function (e) { var t = this.dropdown.querySelector(".focus"), s = this.dropdown.classList.contains("open"); if (32 == e.keyCode || 13 == e.keyCode)
        i(s ? t : this.dropdown);
    else if (40 == e.keyCode) {
        if (s) {
            var o = this._findNext(t);
            o && (a(this.dropdown.querySelector(".focus"), "focus"), l(o, "focus"));
        }
        else
            i(this.dropdown);
        e.preventDefault();
    }
    else if (38 == e.keyCode) {
        if (s) {
            var n = this._findPrev(t);
            n && (a(this.dropdown.querySelector(".focus"), "focus"), l(n, "focus"));
        }
        else
            i(this.dropdown);
        e.preventDefault();
    }
    else
        27 == e.keyCode && s && i(this.dropdown); return !1; }, p.prototype._findNext = function (e) { for (e = e ? e.nextElementSibling : this.dropdown.querySelector(".list .option"); e;) {
        if (!r(e, "disabled") && "none" != e.style.display)
            return e;
        e = e.nextElementSibling;
    } return null; }, p.prototype._findPrev = function (e) { for (e = e ? e.previousElementSibling : this.dropdown.querySelector(".list .option:last-child"); e;) {
        if (!r(e, "disabled") && "none" != e.style.display)
            return e;
        e = e.previousElementSibling;
    } return null; }, p.prototype._onSearchChanged = function (e) { var t = this.dropdown.classList.contains("open"), i = e.target.value; if ("" == (i = i.toLowerCase()))
        this.options.forEach((function (e) { e.element.style.display = ""; }));
    else if (t) {
        var s = new RegExp(i);
        this.options.forEach((function (e) { var t = e.data.text.toLowerCase(), i = s.test(t); e.element.style.display = i ? "" : "none"; }));
    } this.dropdown.querySelectorAll(".focus").forEach((function (e) { a(e, "focus"); })), l(this._findNext(null), "focus"); }, t;
})(); }));
// Set options
var options = { searchable: true };
// Get HTML elements from the popup.html DOM
var redmineTaskNumberDiv = document.getElementById("task_id_input");
var fieldDiv = document.getElementById("field"); // Casting — or more properly, type assertion
var valueDiv = document.getElementById("addValue");
var createAlertDiv = document.getElementById("createAlert");
var activeAlertsListTbody = document.getElementById("activeAlertsListTbody");
var triggeredAlertsListTbody = document.getElementById("triggeredAlertsListTbody");
var addButton = document.getElementById("addButton");
var clearButton = document.getElementById("clearButton");
var version = document.getElementById("version");
var valueDivInstance; // prettifier object for value dropdown
// Settings module
var openSettingsIcon = document.getElementById("openSettingsIcon");
var settingsModal = document.getElementById('settingsModalId');
var closeSettingsSpan = document.getElementById('closeSettingsModuleIcon');
var extensionContent = document.getElementById('extensionContent');
// Settings sliders
var newTabEnabledSwitch = document.getElementById('newTabEnabledSwitch');
var browserAlertEnabledSwitch = document.getElementById('browserAlertEnabledSwitch');
var iconBadgeEnabledSwitch = document.getElementById('iconBadgeEnabledSwitch');
var osNotificationEnabledSwitch = document.getElementById('osNotificationEnabledSwitch');
// Settings text input
var settingsRefreshIntervalInMinutes = document.getElementById('refreshIntervalInMinutes');
var settingsDomainName = document.getElementById('domainName');
// Settings save button
var saveSettingsButton = document.getElementById('saveSettingsButton');
function removeCreateAlertAndAddWarningWhenUserNotInRedmineTaskPage(callback1, callback2) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const isCurrentTabARedminePage = /https:\/\/redmine\.tribepayments\.com\/issues\/.+/.test(tabs[0].url);
        if (isCurrentTabARedminePage === false) {
            createAlertDiv.classList.add("displayNone");
            createAlertWarning.classList.remove("displayNone");
        }
        else if (isCurrentTabARedminePage === true) {
            if (callback1) {
                callback1(redmineTaskNumberDiv);
            }
            if (callback2) {
                callback2(true, setRedmineTaskDropdownValues);
            }
        }
    });
}
async function getAndSetActiveTabRedmineTaskNumber(htmlElement) {
    if (htmlElement) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let redmineTaskNumber = tabs[0].url.split("/issues/")[1].substring(0, 5);
            htmlElement.value = redmineTaskNumber;
        });
    }
}
// Regex validators
function redmineTaskNumberValidationAndStyling() {
    if (redmineTaskNumberDiv.value) {
        if (/[0-9]{5}/.test(redmineTaskNumberDiv.value) === true) {
            addButton.disabled = false;
            redmineTaskNumberDiv.classList.remove("validationFailedRedBorder");
        }
        else {
            addButton.disabled = true;
            redmineTaskNumberDiv.classList.add("validationFailedRedBorder");
        }
    }
}
const validatorIntegerMoreThanOne = (input) => {
    return /^[1-9]{1,}/.test(input) && /^[0-9]+$/.test(input);
};
const validatorNotEmpty = (input) => {
    return input !== "";
};
const textFieldValidator = (textInputElement, validator, buttonElement = null) => {
    if (textInputElement.value !== undefined) {
        if (validator(textInputElement.value) === true) {
            textInputElement.classList.remove("validationFailedRedBorder");
            if (buttonElement !== null) {
                buttonElement.disabled = false;
            }
        }
        else {
            textInputElement.classList.add("validationFailedRedBorder");
            if (buttonElement !== null) {
                buttonElement.disabled = true;
            }
        }
    }
};
async function setRedmineTaskDropdownFields(initialElementCreation = false, callback = null) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, new Object({ 'action': "parseRedmineTaskDropdownFieldsToArrayOfObjects" }), function (response) {
            response.data.forEach((fieldObject, index) => {
                fieldDiv?.insertAdjacentHTML("beforeend", `<option value="${fieldObject.id}" ${index === 0 ? "selected" : ""}>${fieldObject.label}</option>`);
            });
            if (callback) {
                callback(initialElementCreation);
            }
            if (initialElementCreation === true) {
                NiceSelect.bind(fieldDiv, options);
            }
        });
    });
}
async function setRedmineTaskDropdownValues(initialElementCreation = false) {
    const selectedFieldId = fieldDiv.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, new Object({ 'action': "parseRedmineTaskDropdownFieldsToArrayOfObjects" }), function (response) {
            response.data.forEach((fieldObject) => {
                if (fieldObject.id === selectedFieldId) {
                    fieldObject.value.options.forEach((option, index) => {
                        if (index === 0) {
                            valueDiv?.insertAdjacentHTML("beforeend", `<option value="notEmpty"><< Not empty >></option>`);
                        }
                        valueDiv?.insertAdjacentHTML("beforeend", `<option value="${option.optionValue}" ${option.isSelected === true ? "selected" : ""}>${option.optionText}</option>`);
                    });
                }
            });
            if (initialElementCreation === true) {
                valueDivInstance = NiceSelect.bind(valueDiv, options);
            }
            else {
                valueDivInstance.update();
            }
        });
    });
}
function clearAllDropdownOptions(dropdownElement) {
    let L = dropdownElement.options.length - 1;
    for (let i = L; i >= 0; i--) {
        dropdownElement.remove(i);
    }
}
function initializeStorageLocalObject(callback = null) {
    chrome.storage.sync.get(null, function (data) {
        if (data.redmineTaskNotificationsExtension === undefined) {
            chrome.storage.sync.set({ 'redmineTaskNotificationsExtension': [] }, function () {
                console.log('chrome.storage.sync initial value was set...');
                if (callback) {
                    callback();
                }
            });
        }
    });
}
function saveAlertToStorageLocal() {
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //   chrome.tabs.sendMessage(tabs[0].id, new Object({'action': "parseRedmineTaskDropdownFieldsToArrayOfObjects"}), function(response) {
    //     response.data.forEach((fieldObject, index) => {
    //       // Find selected value of the desired field
    //     })
    //   })
    // })
    let d = new Date();
    let newDateFormatted = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    let alertObject = new Object({
        uniqueTimestampId: new Date().getTime(),
        redmineTaskId: redmineTaskNumberDiv.value,
        itemAddedOnReadableDate: newDateFormatted,
        fieldToCheckLabel: fieldDiv.options[fieldDiv.selectedIndex].text,
        fieldToCheckValue: fieldDiv.value,
        valueToCheckLabel: valueDiv.options[valueDiv.selectedIndex].text,
        valueToCheckValue: valueDiv.value,
        // initialValue: ,
        // initialLabel: ,
        triggeredInThePast: false,
        triggeredAtTimestamp: "",
        triggeredAtReadableDate: ""
    });
    chrome.storage.sync.get(null, function (data) {
        if (data.redmineTaskNotificationsExtension) {
            let alertObjectArray = data.redmineTaskNotificationsExtension;
            alertObjectArray.push(alertObject);
            chrome.storage.sync.set({ 'redmineTaskNotificationsExtension': alertObjectArray }, function () {
                console.log('chrome.storage.sync new alert was created...');
            });
        }
        clearAndDisplayAlerts();
    });
    // User analytics
    (async () => {
        try {
            const storageLocalObjects = await asyncGetStorageLocal(null);
            const settings = storageLocalObjects.redmineTaskNotificationsExtensionSettings;
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, new Object({ 'action': "getUserInitials" }), function (response) {
                    response.data;
                });
            });
            fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSeCG85Vno3ZbydBiJjwP6P-nYj-1ZElDBEznt7n4LK5cfJFag/formResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    "entry.1257070925": newDateFormatted,
                    "entry.1232033723": response.data,
                    "entry.1273942264": redmineTaskNumberDiv.value,
                    "entry.1822505748": fieldDiv.options[fieldDiv.selectedIndex].text,
                    "entry.1949912164": valueDiv.options[valueDiv.selectedIndex].text,
                    "entry.879864049": settings, // settings object      
                })
            });
        }
        catch (e) {
            console.log(e);
        }
    });
}
// Rewrite into async func
// const asyncQueryContentScript = (action) => {
//   return new Promise((chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//     chrome.tabs.sendMessage(tabs[0].id, new Object({'action': action, 'data': requestData}), function(response) {
//         if (response) {
//             console.log('background.js worker received a response from content.js...')
//         }
//     })
//   ))
//   return new Promise((resolve) => {
//     chrome.storage.sync.get(key, resolve);
//   });
// })
// }
function clearChromeStorageSync() {
    if (confirm('Are you sure you want to delete all alerts and settings?')) {
        chrome.storage.sync.clear(function () {
            initializeStorageLocalSettingsObject();
            initializeStorageLocalObject(clearAndDisplayAlerts);
            console.log("chrome.storage.sync was cleared...");
        });
    }
}
;
function clearAndDisplayAlerts() {
    chrome.storage.sync.get(null, function (data) {
        if (data.redmineTaskNotificationsExtension) {
            activeAlertsListTbody.innerHTML = "";
            triggeredAlertsListTbody.innerHTML = "";
            data.redmineTaskNotificationsExtension.forEach(object => {
                if (object.triggeredInThePast === false) {
                    activeAlertsListTbody?.insertAdjacentHTML("beforeend", `
              <tr id="trId${object.uniqueTimestampId}">
                <td>${object.redmineTaskId}</td>
                <td>${object.fieldToCheckLabel}</td>
                <td>${object.valueToCheckLabel}</td>
                <td class="textAlignCenter"><button class="genericButton activeAlertDelete" id="activeAlertDelete${object.uniqueTimestampId}">Delete</button></td>
              </tr>
            `);
                    let deleteButton = document.getElementById(`activeAlertDelete${object.uniqueTimestampId}`);
                    let deleteTr = document.getElementById(`trId${object.uniqueTimestampId}`);
                    deleteButton.addEventListener("click", function () {
                        deleteTr.classList.add('opacityZero');
                        deleteTr.addEventListener('transitionend', () => {
                            deleteSingleAlertFromStorageLocal(object.uniqueTimestampId);
                        });
                    });
                }
                else if (object.triggeredInThePast === true) {
                    triggeredAlertsListTbody?.insertAdjacentHTML("beforeend", `
              <tr>
                <td>${object.redmineTaskId}</td>
                <td>${object.fieldToCheckLabel}</td>
                <td>${object.valueToCheckLabel}</td>
                <td>${object.itemAddedOnReadableDate}</td>
              </tr>
            `);
                }
            });
        }
    });
}
function deleteSingleAlertFromStorageLocal(uniqueTimestampId) {
    chrome.storage.sync.get(null, function (data) {
        if (data.redmineTaskNotificationsExtension) {
            let alertObjectArray = data.redmineTaskNotificationsExtension;
            alertObjectArray.forEach(function (object, index) {
                if (object.uniqueTimestampId === uniqueTimestampId) {
                    alertObjectArray.splice(index, 1);
                    chrome.storage.sync.set({ 'redmineTaskNotificationsExtension': alertObjectArray }, function () {
                        console.log('chrome.storage.sync active alert was deleted...');
                        clearAndDisplayAlerts();
                    });
                }
            });
        }
    });
}
function asyncGetStorageLocal(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, resolve);
    });
}
function asyncSetStorageLocal(key, newValue) {
    return new Promise((resolve) => {
        chrome.storage.sync.set({ [key]: newValue }, resolve);
    });
}
const initializeStorageLocalSettingsObject = async () => {
    const storageLocalObjects = await asyncGetStorageLocal(null);
    const settings = storageLocalObjects.redmineTaskNotificationsExtensionSettings;
    if (settings === undefined) {
        // default settings
        await asyncSetStorageLocal('redmineTaskNotificationsExtensionSettings', new Object({
            newTabEnabled: true,
            browserAlertEnabled: true,
            iconBadgeEnabled: true,
            osNotificationEnabled: false,
            newWindowEnabled: false,
            playASoundEnabled: false,
            refreshIntervalInMinutes: 10,
            domainName: '',
        }));
        console.log('chrome.storage.sync initial settings value was set...');
    }
};
const closeActions = () => {
    settingsModal.style.display = 'none';
    openSettingsIcon.style.display = 'block';
    closeSettingsSpan.style.display = 'none';
    extensionContent.classList.remove('blackOpaque', 'hideScrollbar');
};
const settingModalDisplay = async () => {
    // When the user clicks the button, open the settingModal
    openSettingsIcon?.addEventListener('click', function () {
        clearAndDisplaySettings();
        settingsModal.style.display = 'block';
        openSettingsIcon.style.display = 'none';
        closeSettingsSpan.style.display = 'block';
        extensionContent.classList.add('blackOpaque', 'hideScrollbar');
    });
    // When the user clicks on <span> (x), close the settingModal
    closeSettingsSpan?.addEventListener('click', function () {
        closeActions();
    });
    // When the user clicks anywhere outside of the settingModal, close it
    // Note: for this to work, there needs to be a background div
    // window?.addEventListener('click', function (event) {
    //   if (event.target !== settingsModal) {
    //     closeActions()
    //   }
    // });
};
const clearAndDisplaySettings = async () => {
    const storageLocalObjects = await asyncGetStorageLocal(null);
    let settingsObject = storageLocalObjects.redmineTaskNotificationsExtensionSettings;
    if (settingsObject) {
        // Set settings values
        // Sliders
        const ifValueTrueThenCheckboxChecked = (value, checkboxElement) => {
            if (value && checkboxElement) {
                if (value === true) {
                    checkboxElement.checked = true;
                }
            }
        };
        ifValueTrueThenCheckboxChecked(settingsObject.newTabEnabled, newTabEnabledSwitch);
        ifValueTrueThenCheckboxChecked(settingsObject.browserAlertEnabled, browserAlertEnabledSwitch);
        ifValueTrueThenCheckboxChecked(settingsObject.osNotificationEnabled, osNotificationEnabledSwitch);
        // Input fields
        const setInputFieldValue = (value, inputFieldElement) => {
            if (value && inputFieldElement) {
                inputFieldElement.value = value;
            }
        };
        setInputFieldValue(settingsObject.refreshIntervalInMinutes, settingsRefreshIntervalInMinutes);
        setInputFieldValue(settingsObject.domainName, settingsDomainName);
        // re-run validations since opening the module last time
        settingsRefreshIntervalInMinutesValidation();
        settingsDomainNameValidation();
    }
};
const settingsRefreshIntervalInMinutesValidation = () => {
    textFieldValidator(settingsRefreshIntervalInMinutes, validatorIntegerMoreThanOne, saveSettingsButton);
};
const settingsDomainNameValidation = () => {
    textFieldValidator(settingsDomainName, validatorNotEmpty, saveSettingsButton);
};
function addMultipleEventListener(element, events, handler) {
    events.forEach(e => element.addEventListener(e, handler));
}
const saveSettingsFromUiToStorageLocal = () => {
    // Get values from UI and build a new settings object
    let updatedSettingsObject = new Object({
        browserAlertEnabled: browserAlertEnabledSwitch.checked ? true : false,
        newTabEnabled: newTabEnabledSwitch.checked ? true : false,
        iconBadgeEnabled: iconBadgeEnabledSwitch.checked ? true : false,
        newWindowEnabled: false,
        osNotificationEnabled: osNotificationEnabledSwitch.checked ? true : false,
        playASoundEnabled: false,
        refreshIntervalInMinutes: settingsRefreshIntervalInMinutes.value,
        domainName: settingsDomainName.value,
    });
    asyncSetStorageLocal('redmineTaskNotificationsExtensionSettings', updatedSettingsObject);
};
// You can't await async function within forEach loop.
// Debugging all of the changes
// - Displayed alerts should be ordered by date created for active alerts, and date triggered for triggered alerts.
// https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
// - Persistent service worker - https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
// callback or async await
// https://stackoverflow.com/questions/30763496/how-to-promisify-nodes-child-process-exec-and-child-process-execfile-functions
// https://www.sohamkamani.com/nodejs/executing-shell-commands/
// I can only think of a callback / .then() solution but not async await. Unless the function should be called from another function
// https://www.google.com/search?q=refactor+callback+to+promise&oq=refactor+callbacks+&aqs=chrome.1.69i57j0i22i30l2j0i390l3.3102j1j1&sourceid=chrome&ie=UTF-8
// Await is basically syntactic sugar for Promises. It makes your asynchronous code look more like synchronous/procedural code, which is easier for humans to understand.
// Create CSS layout for active / triggered alerts
// Research payment integration such as stripe (it has to be linked with google account?)
// limit alert count for non paying users to 3, but also think about this policy, research extension monetization on indie hackers
// Don't allow adding two identical alerts
// User statistic logging
// Implement TypeScript
// This is the most common usecase
// Implement settings
// Sticky setting icon in the corner (perhaps bottom right) (cuz triggered alerts will overtake the icon)
// popup module when clicked (copy code from tampermonkey module)
// 3 radio buttons of alert types
// Get tips on UI design
// Alerts for queries
// Select queries somewhere
// Request and parsing for queries
// Personal journal about your progress (newest on top)
// 21-09-2022
// chrome.storage.sync.get('someKey', func(e) {console.log(e)} -> returns {'someKey': {...}} and NOT just {...}
// 19-09-2022
// Got a lot more to learn about web workers and their specialized service workers. 
// Found out that DOMparser does not work with background scripts.
// Need to find a way to keep a background service worker alive because it will turn idle.
// 11-09-2022
// Had to figure out how extensions work - popup.js / content.js / background.js -> no sources of clear information.
// Refactored old code
// Not much time to work on this, maybe 10 hours a week
// When I do get to work on this, after my job I'm a bit tired
// My code structure has improved, my functions are more neat and nice.
// [DONE 22-09] Alert API implemented.
// [DONE 21-09] Regex search implemented, a text DOM can now be parsed and triggered alerts are found.
// [DONE 20-09] Track the array index. If an object is edited, slice out the part of index and add the new object to the same index. So that it's truly edited. -> update, instead, if a difference is found old array's items get replaced with new array's items.
// [DONE 20-09] Promisify chrome.storage.sync - https://www.reddit.com/r/learnjavascript/comments/nr1zvn/how_to_return_value_from_chromestorage/
// [DONE 19-09] Add "non-empty" options when creating a task. A function of "custom option". Marked as @todo in the function above
// [DONE 19-09] Add fieldToCheck and valueToCheck labels, also rename fieldToCheck to fieldToCheckValue in saveAlertToStorageLocal
// Testing
// User creation and payment system.
// @feature
// --> Statuses need to have numbers assigned
/*
Let's say that we're looking for when status == "REVIEW",
but in the span of time when the task status is being checked
it goes from WIP to DONE (or when your PC is turned off
before work).

0 NONE <-- When adding a new item
1 WIP
2 REVIEW <-- Expected
3 DONE <-- Current
*/
(function main() {
    // Remove chrome extension notification badge 
    chrome.action.setBadgeText({ text: "" });
    // Check if user is on a Redmine page, if yes, prefill extension fields
    removeCreateAlertAndAddWarningWhenUserNotInRedmineTaskPage(getAndSetActiveTabRedmineTaskNumber, setRedmineTaskDropdownFields);
    fieldDiv.addEventListener('change', function () {
        clearAllDropdownOptions(valueDiv);
        setRedmineTaskDropdownValues();
    });
    redmineTaskNumberDiv.addEventListener('input', function () {
        redmineTaskNumberValidationAndStyling();
    });
    // Initialize values for new users (or after clearing storage.local)
    initializeStorageLocalObject();
    initializeStorageLocalSettingsObject();
    // Display alerts
    clearAndDisplayAlerts();
    // Save alerts
    addButton.addEventListener('click', function () {
        saveAlertToStorageLocal();
    });
    // Settings
    settingModalDisplay();
    // Settings - Validators
    addMultipleEventListener(settingsRefreshIntervalInMinutes, ['input'], settingsRefreshIntervalInMinutesValidation); // change is unneeded: ['input', 'change']
    settingsDomainName.addEventListener('input', () => settingsDomainNameValidation());
    // Save settings
    saveSettingsButton?.addEventListener('click', () => {
        saveSettingsFromUiToStorageLocal();
        // close module on save
        closeActions();
    });
    // Other
    version.addEventListener("click", function () {
        clearChromeStorageSync();
    });
})();
