/*********************************************************************************************************************
* Project: SCT                                                                                                       *
*                                                                                           Sergio A. Acosta         *
*                                                                          sergiox.a.acosta.lozano@intel.com         *
*                                                                                                      Intel         *
*                                                                                                 01/31/2013         *
* Init page client methods                                                                                           *
**********************************************************************************************************************/

var header, session, loading, logoutLink, campusLink, dialog, wwidForm, wwidTable, wwidRow, wwid, wwidFind;
var addTitle, deleteTitle, deleteDevicesTag;
var addPhoneInput, secondDeviceCheckbox, modelSelect, classServiceSelect, macAddressInput, submitAddPhone, resetAddPhone,lyncOption;
var deleteList, checkAllButton, deletePhoneButton;
var movePhoneSwapButton, movePhoneButton;
var validator;
var userFullName, useridsid;
var lyncAccordion, lyncOnly, lyncCompanion, buttonLyncOnly, lyncOnlyModelSelect, lyncOnlyMacAddress, buttonRemoveLyncOnly, buttonAddLyncCompanion, buttonRemoveLyncCompanion;
var fileinput, linkNewBulkRequest;
var havingProfile;
var nextAvailable, buttonRefresh;
var currentOpenIncident, closeIncident, incidentLabel;
var authorized;

$(document).ready(function () {
    havingProfile = false;
    header = $("#td_headerContent").get(0);
    loading = new loading();
    session = $.cookie("session");
    dialog = $("#div_dialog").get(0);
    wwidForm = $("#div_wwid").get(0);
    wwidTable = $("#table_wwid").get(0);
    wwidRow = $("#tr_wwid").get(0);
    wwid = $("#input_wwid").get(0);
    wwidFind = $("#input_find").get(0);

    addTitle = $("#addPhoneTitle").get(0);
    deleteTitle = $("#deletePhoneTitle").get(0);
    deleteDevicesTag = $("#deletePhoneUserTag").get(0);
    submitAddPhone = $("#BtnSubmitAdd").get(0);
    resetAddPhone = $("#BtnResetAdd").get(0);

    deleteList = $("#div_listOfDevices").get(0);
    checkAllButton = $("#BtnCheckAllDelete").get(0);
    deletePhoneButton = $("#BtnSubmitDelete").get(0);

    movePhoneSwapButton = $("#btnSwapMove").get(0);
    movePhoneButton = $("#btnSubmitMove").get(0);

    $(movePhoneButton).click(function () { moveCluster(); });

    lyncAccordion = $("#div_lyncAccordion").get(0);
    lyncOnly = $("#div_lyncOnly").get(0);
    lyncCompanion = $("#div_lyncCompanion").get(0);
    buttonLyncOnly = $("#buttonAddLyncOnly").get(0);
    lyncOnlyModelSelect = $("#selectRemoveLyncPhoneModel").get(0);
    lyncOnlyMacAddress = $("#inputRemoveLyncPo").get(0);
    $(lyncOnlyMacAddress).attr("disabled", "true");
    buttonRemoveLyncOnly = $("#buttonRemoveLyncOnlySubmit").get(0);
    buttonAddLyncCompanion = $("#buttonAddLyncCompanion").get(0);
    buttonRemoveLyncCompanion = $("#buttonRemoveLyncCompanion").get(0);
    linkNewBulkRequest = $("#link_newBulkRequest").get(0);
    lyncOption = $("#lyncOption").get(0);

    nextAvailable = $("#next_available").get(0);
    buttonRefresh = $("#button_refresh").get(0);
   
    currentOpenIncident = $("#open_incident").get(0);//display SCT incidents
    closeIncident = $("#button_close_incident").get(0);
    incidentLabel = $("#incidentNotification").get(0);


    authorized = false;
    $("#tabs").tabs({ disabled: [0, 1, 2, 3, 6], active: 7 });

    $(buttonRefresh).click(function () { getAvailableNumber(); });

    $(closeIncident).click(function () { closeDSBIncident(); });//close incident

    $(buttonAddLyncCompanion).click(function () { addLyncCompanion() });
    $(buttonRemoveLyncCompanion).click(function () { removeLyncCompanion() });

    $(buttonLyncOnly).click(function () { setLyncOnly(); });
    $(buttonRemoveLyncOnly).click(function () { removeLyncOnly(); });

    $(lyncAccordion).accordion({ header: 'h2'
                               , animated: 'bounceslide'
                               , autoHeight: false
    });

    $(resetAddPhone).click(function () { resetAddPhoneForm(); });
    $(submitAddPhone).click(function () { submitAddPhoneForm(); });

    addPhoneInput = $("#TxPhoneNumber").get(0);
    modelSelect = $("#cbPhoneModel").get(0);

    $(modelSelect).change(function () {
        $(macAddressInput).unbind("click");
        if ($(this).val() == "CIPC") {
            $(classServiceSelect).removeAttr("disabled");
            $(macAddressInput).removeAttr("disabled");
            $(macAddressInput).attr("maxlength", "3");
            $(macAddressInput).val("");
            $(macAddressInput).keyup(function () { validator.minchars(macAddressInput, 3) });
        } else if ($(this).val() == "Lync") {
            $(classServiceSelect).val("LD");
            $(classServiceSelect).attr("disabled", "true");
            $(secondDeviceCheckbox).attr("disabled", "true");
            $(secondDeviceCheckbox).removeAttr("checked");
            $(macAddressInput).val("");
            $(macAddressInput).attr("disabled", "true");
        } else if ($(secondDeviceCheckbox).is(':checked') && $(this).val() == "CIPC") {
            $(addPhoneInput).val("");
            $(addPhoneInput).attr("disabled", "true");
            $(classServiceSelect).removeAttr("disabled");
            $(macAddressInput).removeAttr("disabled");
            $(macAddressInput).attr("maxlength", "3");
            $(macAddressInput).val("");
            $(macAddressInput).keyup(function () { validator.minchars(macAddressInput, 3) });
        } else if ($(secondDeviceCheckbox).is(':checked')) {
            $(addPhoneInput).val("");
            $(addPhoneInput).attr("disabled", "true");
        } else {
            $(addPhoneInput).removeAttr("disabled");
            $(classServiceSelect).removeAttr("disabled");
            $(secondDeviceCheckbox).removeAttr("disabled");
            $(macAddressInput).attr("disabled", "true");
            $(macAddressInput).val("");
        }
    });

    $(lyncOnlyModelSelect).change(function () {
        if ($(this).val() == "CIPC") {
            $(lyncOnlyMacAddress).removeAttr("disabled");
            $(lyncOnlyMacAddress).val("");
            $(lyncOnlyMacAddress).keyup(function () { validator.minchars(lyncOnlyMacAddress, 3) });
        } else {
            $(lyncOnlyMacAddress).attr("disabled", "true");
            $(lyncOnlyMacAddress).val("");
        }
    });

    classServiceSelect = $("#cbClassService").get(0);
    secondDeviceCheckbox = $("#chbSecondDevice").get(0);
    macAddressInput = $("#TxPOMac").get(0);

    validator = new validator();
    $(wwid).keyup(function () { validator.mincharsAndNumber(wwid, 8) });
    $(addPhoneInput).keyup(function () { validator.phoneField(addPhoneInput, 8) });

    $(secondDeviceCheckbox).change(function () {
        $(macAddressInput).unbind("click");
        if ($(this).is(':checked')) {
            $(addPhoneInput).val("");
            $(addPhoneInput).attr("disabled", "true");
            deleteSiblings(addPhoneInput);
            if ($(modelSelect).val() == "CIPC") {
                $(macAddressInput).val("");
                $(macAddressInput).removeAttr("disabled");
                $(macAddressInput).attr("maxlength", "3");
                $(macAddressInput).keyup(function () { validator.minchars(macAddressInput, 3) });
            }
        } else {
            $(addPhoneInput).removeAttr("disabled");
            $(macAddressInput).val("");
            deleteSiblings(macAddressInput);
            if ($(modelSelect).val() == "CIPC") {
                $(macAddressInput).val("");
                $(macAddressInput).removeAttr("disabled");
                $(macAddressInput).attr("maxlength", "3");
                $(macAddressInput).keyup(function () { validator.minchars(macAddressInput, 3) });
            } else {
                $(macAddressInput).attr("disabled", "true");
                $(macAddressInput).val("");
            }
        }
    });

    $(btnSwapMove).click(function () { swapSourceAndDestination() });

    $(wwidFind).click(function () { findWwid() });

    $(wwid).keydown(function (event) {
        if (event.which == 13) {
            findWwid();
        }
    });
    checkLogin();

    $(checkAllButton).click(function () { checkAll(deleteList); });

    $(deletePhoneButton).click(function () { deletePhone(); });

    //LyncBulkTool Request
    getLyncBulkRequests();
    getAvailableNumber();

    $(linkNewBulkRequest).click(function () { openNewRequestDialog(); });

    setInterval(function () { getLyncBulkRequestsBody() }, 1000 * 60);

    //Anoj H2R Available number changes: BOC
    setInterval(function () { getAvailableNumber() }, 1000 * 60);
    //Anoj H2R Available number changes: EOC


    getHungJobs();
    setInterval(function () { getHungJobs() }, 1000 * 60);

    getBulkIncidents();
    getOpenIncidents();

    setInterval(function () { getBulkIncidents() }, 1000 * 60);

    setInterval(function () { getOpenIncidents() }, 1000 * 60);
    

    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        alert("The file Bulk Tab is not fully supported in this browser");
    }

    var idletime = 1000 * 60 * 30;
    $.idleTimer(idletime);

    $(document).bind("idle.idleTimer", function () {
        $(dialog).empty();
        $.cookie("session", null);
        var text = createElement("span", dialog, "", "Your session has expired, please login again", "", "");
        $(dialog).dialog({
            resizable: false
            , title: "ERROR"
            , draggable: true
            , dialogClass: "alert"
            , height: 160
            , modal: true
            , show: { effect: "bounce" }
            , hide: { effect: "explode" }
            , buttons: {
                "Ok": function () {
                    $(this).dialog("close");
                    $(location).attr('href', "default.aspx");
                }
            }
            , close: function (event, ui) { $(dialog).empty(); $(location).attr('href', "default.aspx"); }
        });
    });
    $("#link_killJobs").click(killSelectedProcesses);
});

function checkLogin() {
    if (session == undefined || session == null || session == "null") {
        $(dialog).empty();
        var text = createElement("span", dialog, "", "You must be loggedin, you'll be redirected.", "", "");
        $(dialog).dialog({
            resizable: false
                , title: "ERROR"
                , draggable: true
                , dialogClass: "alert"
                , width: 300
                , height: 160
                , modal: true
                , show: { effect: "bounce" }
                , hide: { effect: "explode" }
                , buttons: { "Ok": function () {
                    $(this).dialog("close");
                    $(location).attr('href', "default.aspx"); }

                  }
                , close: function (event, ui) {
                    $(dialog).empty();
                    $(location).attr('href', "default.aspx");
                }
        });
    } else {
        loading.start();
        $.ajax({
            type: "POST"
                , dataType: "xml"
                , url: "clientAsync.aspx"
                , data: { method: "checkLogin", session: session }
                , success: function (xml) {
                    loading.stop();
                    var response = $(xml).find("response");
                    if ($(response[0]).text() == "false") {
                        $.cookie("session", null);
                        $(dialog).empty();
                        var text = createElement("span", dialog, "", "You must be loggedin, you'll be redirected.", "", "");
                        $(dialog).dialog({
                            resizable: false
                            , title: "ERROR"
                            , draggable: true
                            , dialogClass: "alert"
                            , height: 160
                            , modal: true
                            , show: { effect: "bounce" }
                            , hide: { effect: "explode" }
                            , close: function (event, ui) {
                                $(location).attr('href', "default.aspx");
                            }
                            , buttons: { "Ok": function () {
                                $(this).dialog("close");
                                $(dialog).empty();
                                $(location).attr('href', "default.aspx");
                            }
                            }
                        });
                    } else {
                        var date = new Date();
                        var headerString = "Welcome: " + $(xml).find("firstname").text() + " " + $(xml).find("lastname").text() + " | Campus: ";
                        createElement("span", header, "", headerString, "", "");

                        campusLink = createElement("a", header, "link_campus", $(xml).find("campus").text(), "", "href=#");
                        $(campusLink).click(function () { changeCampus($(campusLink).text()) });

                        $(addTitle).text("Add Phone Campus " + $(xml).find("campus").text());
                        $(deleteTitle).text("Delete Phone Campus " + $(xml).find("campus").text());

                        headerString = " | " + (date.getMonth() + 1).toString() + "/" + date.getDate().toString() + "/" + date.getFullYear().toString() + " | ";
                        createElement("span", header, "", headerString, "", "");

                        logoutLink = createElement("a", header, "link_logout", "Logout", "", "href=#");
                        $(logoutLink).click(function () { logout() });

                        $("#appVersion").text($(xml).find("version").text());

                        if ($(xml).find("authorizedForKilling").text() == "true") {
                            authorized = true;
                            $("#tabs").tabs({ disabled: [0, 1, 2, 3], active: 7 });
                        } else {
                            $("#tabs").tabs({ disabled: [0, 1, 2, 3, 6], active: 7 });
                        }
                    }
                }
                , error: function (xml) {
                    loading.stop();
                    $(dialog).empty();
                    var text = createElement("span", dialog, "", "Please contact the system administrator.", "", "");
                    $(dialog).dialog({
                        resizable: false
                        , title: "ERROR"
                        , draggable: true
                        , dialogClass: "alert"
                        , height: 160
                        , modal: true
                        , show: { effect: "bounce" }
                        , hide: { effect: "explode" }
                        , buttons: { "Ok": function () { $(this).dialog("close"); $(dialog).empty(); } }
                    });
                }
        });
    }
}

function logout() {
    $(dialog).empty();
    var text = createElement("span", dialog, "", "Are you sure you want to logout?", "", "");
    $(dialog).dialog({
        resizable: false
        , title: "Question"
        , draggable: true
        , dialogClass: "alert"
        , width: 400
        , height: 160
        , modal: true
        , show: { effect: "bounce" }
        , hide: { effect: "explode" }
        , buttons: {
            "Ok": function () {
                $(this).dialog("close");
                $(dialog).empty();
                $.cookie("session", null);
                $(location).attr('href', "default.aspx");
            }
            , Cancel: function () { $(this).dialog("close"); $(dialog).empty(); }
         }
    });
}

function changeCampus(selected) {
    $(dialog).empty();
    loading.start();
    var text = createElement("span", dialog, "", "Select the campus that you want to login", "", "");
    addBr(dialog); addBr(dialog);
    var select = createElement("select", dialog, "", "", "", "");
    //cucm cluster consolidation changes BOC : Anoj
    getCampusList(select, selected);
    loading.stop();
    //var clusterdata = getCampusList(select, selected, text);
    
    //$(text).text("Select the " + $(clusterdata[0]).val() + "campus that you want to login");
    //cucm cluster consolidation changes EOC : Anoj

    $(dialog).dialog({
        resizable: false
        , title: "Change Campus"
        , draggable: true
        , dialogClass: "alert"
        , height: 180
        , modal: true
        , show: { effect: "bounce" }
        , hide: { effect: "explode" }
        , buttons: {
            "Ok": function () {
                loading.start();
                var newCampus = $(select).val();
                $.ajax({
                    type: "POST"
                    , dataType: "xml"
                    , url: "clientAsync.aspx"
                    , data: { method: "changeCampus", campus: newCampus, session: session }
                    , success: function (xml) {
                        loading.stop();
                        var response = $(xml).find("sessionid");
                        if (response.length > 0) {
                            $.cookie("session", $(response[0]).text());
                            session = $.cookie("session");

                            $(campusLink).text($(select).val());
                            $(addTitle).text("Add Phone Campus " + $(select).val());
                            $(deleteTitle).text("Delete Phone Campus " + $(select).val());
                            //H2R changes - Brought Available Number call MUCH before dialog close: BOC
                            loading.start();
                            getAvailableNumber(false);
                            if ($(wwid).val() != "") {
                                findWwid();
                            }

                            $(dialog).dialog("close");
                            loading.stop();
                            //H2R changes - Brought Available Number call before dialog close: EOC
                        } else {
                            deleteSiblings(select);
                            addBr(dialog);
                            createElement("span", dialog, "dialog_error", "Access denied to campus: " + newCampus, "error", "");
                        }
                    }
                    , error: function (xml) {
                        loading.stop();
                        $(dialog).empty();
                        var text = createElement("span", dialog, "", "ERROR changingCampus, Please contact the system administrator.", "", "");
                        $(dialog).dialog({
                            resizable: false
                            , title: "ERROR"
                            , draggable: true
                            , dialogClass: "alert"
                            , height: 160
                            , modal: true
                            , show: { effect: "bounce" }
                            , hide: { effect: "explode" }
                            , buttons: {
                                "Ok": function () { $(this).dialog("close"); $(dialog).empty(); }
                            }
                        });
                    }
                });
            }, Cancel: function () { $(this).dialog("close"); $(dialog).empty(); }
        }
    });
}

function findWwid() {
    $(deleteList).empty();
    validator.mincharsAndNumber(wwid,8);
    if (validator.validForm(wwidForm) == 0) {
        loading.start();
        $.ajax({
            type: "POST"
                , dataType: "xml"
                , url: "clientAsync.aspx"
                , data: { method: "getUserInfo", wwid: $(wwid).val(), session: session }
                , success: function (xml) {
                    loading.stop();
                    deleteSiblings(wwidRow);
                    if ($(xml).find("shortid").text() == "") {
                        if (authorized == true) {
                            $("#tabs").tabs({ disabled: [0, 1, 2, 3], active: 7 });
                        } else {
                            $("#tabs").tabs({ disabled: [0, 1, 2, 3, 6], active: 7 });
                        }
                        $(dialog).empty();
                        var text = createElement("span", dialog, "", "The wwid " + $(wwid).val() + " is not registered", "", "");
                        $(dialog).dialog({
                            resizable: false
                            , title: "ERROR"
                            , draggable: true
                            , dialogClass: "alert"
                            , height: 160
                            , modal: true
                            , close: function (event, ui) { loading.stop() }
                            , show: { effect: "bounce" }
                            , hide: { effect: "explode" }
                            , buttons: {
                                "Ok": function () { $(this).dialog("close"); $(dialog).empty(); }
                            }
                        });
                    } else {
                        var tr;
                        if ($(xml).find("shortid").text() != "") {
                            tr = createElement("tr", wwidTable, "", "", "", "");
                            createElement("td", tr, "", "IDSID: ", "", "");
                            var td = createElement("td", tr, "", $(xml).find("shortid").text(), "strong", "colspan=2");

                            createElement("input", td, "email", "", "", "type=hidden&value=" + $(xml).find("email").text());
                            if (authorized == true) {
                                $("#tabs").tabs({ disabled: [], active: 0 });
                            } else {
                                $("#tabs").tabs({ disabled: [6], active: 0 });
                            }
                            useridsid = $(xml).find("shortid").text();
                        }
                        if ($(xml).find("firstname").text() != "") {
                            tr = createElement("tr", wwidTable, "", "", "", "");
                            createElement("td", tr, "", "Name: ", "", "");
                            createElement("td", tr, "", $(xml).find("firstname").text() + " " + $(xml).find("lastname").text(), "strong", "colspan=2");
                            $(deleteDevicesTag).text("List of devices for " + $(xml).find("firstname").text() + " " + $(xml).find("lastname").text());
                            userFullName = $(xml).find("firstname").text() + " " + $(xml).find("lastname").text();
                        }
                        if ($(xml).find("telephoneNumber").text() != "") {
                            tr = createElement("tr", wwidTable, "", "", "", "");
                            createElement("td", tr, "", "Phone number: ", "", "");
                            td = createElement("td", tr, "", $(xml).find("telephoneNumber").text(), "strong", "colspan=2");
                            createElement("input", td, "telephoneNumber", "", "", "type=hidden&value=" + $(xml).find("telephoneNumber").text());
                        }
                        if ($(xml).find("primaryExtension").text() != "") {
                            tr = createElement("tr", wwidTable, "", "", "", "");
                            createElement("td", tr, "", "Line: ", "", "");
                            createElement("td", tr, "", $(xml).find("primaryExtension").text().substring(0, 8), "strong", "colspan=2");
                            createElement("input", td, "primaryExtension", "", "", "type=hidden&value=" + $(xml).find("primaryExtension").text());
                            createElement("input", deleteList, "deleteLine_" + $(xml).find("primaryExtension").text(), "", "checkbox", "type=checkbox");
                            createElement("label", deleteList, "", "Line: " + $(xml).find("primaryExtension").text().substring(0, 8), "", "for=deleteLine_" + $(xml).find("primaryExtension").text());
                            addBr(deleteList);
                        }

                        $(addPhoneInput).removeAttr("disabled");
                        if ($(xml).find("primaryExtension").text() == "" && $(xml).find("telephoneNumber").text() == "") {
                            $(secondDeviceCheckbox).hide();
                            $("#labelSecondDevice").hide();
                            $(lyncOption).show();
                        } else {
                            $(secondDeviceCheckbox).show();
                            $("#labelSecondDevice").show();
                            $(lyncOption).hide();
                        }
                        tr = createElement("tr", wwidTable, "", "", "", "");
                        var devicesCol = createElement("td", tr, "", "Devices: ", "topRow", "");
                        var profilesCol = createElement("td", tr, "", "Profiles: ", "topRow", "");
                        createElement("td", tr, "", "", "", "");

                        var device;
                        if ($(xml).find("device").length > 0) {
                            for (var i = 0; i < $(xml).find("device").length; i++) {
                                addBr(devicesCol);
                                device = $(xml).find("device").get(i);
                                createElement("span", devicesCol, "", $(device).find("product").text(), "strong", "");
                                createElement("input", devicesCol, "device_" + i.toString(), "", "", "type=hidden&value=" + $(device).find("devicename").text());

                                createElement("input", deleteList, "deleteDevice_" + $(device).find("devicename").text(), "", "checkbox", "type=checkbox");
                                createElement("label", deleteList, "", "Device: " + $(device).find("devicename").text(), "", "for=deleteDevice_" + $(device).find("devicename").text());
                                addBr(deleteList);
                            }
                        } else {
                            addBr(devicesCol);
                            createElement("span", devicesCol, "", "None", "strong", "");
                        }
                        var profile;
                        if ($(xml).find("profile").length > 0) {
                            havingProfile = true;
                            for (i = 0; i < $(xml).find("profile").length; i++) {
                                addBr(profilesCol);
                                profile = $(xml).find("profile").get(i);
                                createElement("span", profilesCol, "", $(profile).text(), "strong", "");
                                createElement("input", profilesCol, "profile_" + i.toString(), "", "", "type=hidden&value=" + $(profile).text());

                                if ($(xml).find("telephoneNumber").text() != $(profile).text() || ($(xml).find("telephoneNumber").text() == "" && $(xml).find("primaryExtension").text() != $(profile).text())) {
                                    createElement("input", deleteList, "deleteProfile_" + $(profile).text(), "", "checkbox", "type=checkbox");
                                    createElement("label", deleteList, "", "Profile: " + $(profile).text(), "", "for=deleteProfile_" + $(profile).text());
                                    addBr(deleteList);
                                }
                            }
                        } else {
                            addBr(profilesCol);
                            createElement("span", profilesCol, "", "None", "strong", "");
                        }

                        if ($(xml).find("prefixValidation").text() == "false" && $(campusLink).text() != "Folsom PreProd") {
                            tr = createElement("tr", wwidTable, "", "", "", "");
                            var noLineMsg = "This user has not registered any line<br /> at campus " + $(campusLink).text()
                            var td = createElement("td", tr, "", "", "error", "colspan=2");
                            $(td).append(noLineMsg);
                        } else if ($(campusLink).text() == "Folsom") {
                            if (authorized == true) {
                                $("#tabs").tabs({ disabled: [], active: 0 });
                            } else {
                                $("#tabs").tabs({ disabled: [6], active: 0 });
                            }
                        } else {
                            if (authorized == true) {
                                $("#tabs").tabs({ disabled: [1], active: 0 });
                            } else {
                                $("#tabs").tabs({ disabled: [1,6], active: 0 });
                            }
                        }
                    }
                }
                , error: function (xml) {
                    loading.stop();
                    $(dialog).empty();
                    var text = createElement("span", dialog, "", "Error getting user info, Please contact the system administrator.", "", "");
                    $(dialog).dialog({
                        resizable: false
                            , title: "ERROR"
                            , draggable: true
                            , dialogClass: "alert"
                            , height: 160
                            , modal: true
                            , show: { effect: "bounce" }
                            , hide: { effect: "explode" }
                        //, close: function (event, ui) { loading.stop(); }
                            , buttons: { "Ok": function () { $(this).dialog("close"); $(dialog).empty(); } }
                    });
                }
        });
    }
}

/****************************************************************************************************************************************
Add Phone Form
****************************************************************************************************************************************/

function resetAddPhoneForm(){
    var disableFields = new Array($(macAddressInput).get(0));
    clearForm($("#tabs-1").get(0), disableFields);
}

function submitAddPhoneForm() {
    deleteSiblings(submitAddPhone);
    if (!validator.validForm($("#tabs-1").get(0))) {
        var secondDevice = "false";
        if ($(secondDeviceCheckbox).is(':checked') == true) {
            secondDevice = "true";
            phoneNumber = $("#telephoneNumber").val();
            if (phoneNumber == undefined) {
                phoneNumber = $("#primaryExtension").val().substring(0, 8);
            }
        } else {
            phoneNumber = $(addPhoneInput).val();
        }
        $(dialog).empty();
        var text = createElement("span", dialog, "", "Are you sure you want to add a new phone?", "", "");
        $(dialog).dialog({
            resizable: false
                , title: "Question"
                , draggable: true
                , dialogClass: "alert"
                , width: 400
                , height: 160
                , modal: true
                , show: { effect: "bounce" }
                , hide: { effect: "explode" }
                , buttons: { "Ok": function () {
                    $(this).dialog("close");
                    $(dialog).empty();
                    loading.start();
                    $.ajax({
                        type: "POST"
                        , dataType: "xml"
                        , url: "clientAsync.aspx"
                        , data: { method: "addPhone", wwid: $(wwid).val(), email: $("#email").val(), session: session, fullName: userFullName, phoneNumber: phoneNumber, model: $(modelSelect).val(), poMac: $(macAddressInput).val(), classOfService: $(classServiceSelect).val(), useridsid: useridsid, secondDevice: secondDevice }
                        , success: function (xml) {
                            loading.stop();
                            if ($(xml).find("error").text() != "") {
                                validator.error(submitAddPhone, $(xml).find("error").text());
                            } else if ($(xml).find("success").text() == "true") {
                                var responseString = "";
                                if ($(xml).find("device2").text() != "") {
                                    responseString = "<br />Phone added successfully <br/>Device: " + $(xml).find("device2").text();
                                } else {
                                    responseString = "<span>Phone added successfully <br/>Phone number: " + $(xml).find("number").text() + "<br />Device name: " + $(xml).find("device").text();
                                }
                                responseString += "</span>";
                                $(dialog).empty();
                                $(dialog).append(responseString);
                                $(dialog).dialog({
                                    resizable: false
                                        , title: "SUCCESS"
                                        , draggable: true
                                        , dialogClass: "alert"
                                        , height: 160
                                        , modal: true
                                        , show: { effect: "bounce" }
                                        , hide: { effect: "explode" }
                                    //, close: function (event, ui) { loading.stop(); }
                                        , buttons: { "Ok": function () {
                                            $(this).dialog("close");
                                            $(dialog).empty();
                                            clearForm($("#tabs-1").get(0), [$(macAddressInput).get(0)]);
                                            findWwid();
                                        } 
                                        }
                                });
                            }
                        }
                        , error: function (xml) {
                            loading.stop();
                        }
                    });
                }
                , Cancel: function () { $(this).dialog("close"); $(dialog).empty(); }
                }
        });
    } else {
        validator.error(submitAddPhone,"Please correct the form first");
    }
}

/****************************************************************************************************************************************
Move Phone Form
****************************************************************************************************************************************/

function swapSourceAndDestination() {
    if ($("#p_source").text() == "Folsom") {
        $("#p_source").text("Folsom PreProd");
        $("#p_destination").text("Folsom");
    }else if ($("#p_source").text() == "Folsom PreProd") {
        $("#p_source").text("Folsom");
        $("#p_destination").text("Folsom PreProd");
    }
}

function moveCluster() {
    deleteSiblings(movePhoneButton);
    var inet,phoneNumber;
    if ($("#primaryExtension").val() == undefined) {
        inet = "";
    } else {
        inet = $("#primaryExtension").val().substring(0, 8);
    }
    if ($("#telephoneNumber").val() == undefined) {
        phoneNumber = "";
    } else {
        phoneNumber = $("#telephoneNumber").val();
    }
    if (phoneNumber == "" && inet == "") {
        validator.error(movePhoneButton, "to move to a cluster the selected user must have a line number first.");
    } else {
        var dialogMessage;
        dialogMessage = "<span>Are you sure that you want to move from " + $("#p_source").text() + " to " + $("#p_destination").text() + "?</span>";
        $(dialog).empty();
        $(dialog).append(dialogMessage);
        $(dialog).dialog({
            resizable: false
                , title: "Question"
                , draggable: true
                , dialogClass: "alert"
                , height: 160
                , modal: true
                , show: { effect: "bounce" }
                , hide: { effect: "explode" }
                , buttons: { "Ok": function () {
                    $(this).dialog("close");
                    $(dialog).empty();
                    loading.start();
                    $.ajax({
                        type: "POST"
                        , dataType: "xml"
                        , url: "clientAsync.aspx"
                        , data: { method: "moveCluster", session: session, idsid: useridsid, wwid: $(wwid).val(), fullName: userFullName, source: $("#p_source").text(), destination: $("#p_destination").text() }
                        , success: function (xml) {
                            loading.stop();
                            if ($(xml).find("error").text() != "") {
                                validator.error(movePhoneButton, $(xml).find("error").text());
                            } else {
                                $(dialog).empty();
                                $(dialog).append("<span>Line moved to " + $("#p_destination").text() + "</span>");
                                $(dialog).dialog({
                                    resizable: false
                                        , title: "SUCCESS"
                                        , draggable: true
                                        , dialogClass: "alert"
                                        , height: 160
                                        , modal: true
                                        , show: { effect: "bounce" }
                                        , hide: { effect: "explode" }
                                    //, close: function (event, ui) { loading.stop(); }
                                        , buttons: { "Ok": function () {
                                            $(this).dialog("close");
                                            $(dialog).empty();
                                            findWwid();
                                        }
                                        }
                                });
                            }
                        }
                        , error: function () { loading.stop(); }
                    });
                }
                , Cancel: function () { $(this).dialog("close"); $(dialog).empty(); }
                }
        });
    }
}


/****************************************************************************************************************************************
Delete phone Form
****************************************************************************************************************************************/

function checkAll(form) {
    var inputs = $(form).find("input");
    for (var i = 0; i < inputs.length; i++) {
        if ($(inputs[i]).attr("type") == "checkbox") {
            $(inputs[i]).prop("checked", true);
        }
    }
}

function deletePhone() {
    var removingLine = false;
    var inputs = $(deleteList).find("input");
    var lines = new Array();
    var devices = new Array();
    var profiles = new Array();

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].id.indexOf("deleteLine_") != -1 && $(inputs[i]).is(':checked') == true) {
            lines.push(inputs[i].id.split("_")[1]);
            removingLine = true;
        } else if (inputs[i].id.indexOf("deleteDevice_") != -1 && $(inputs[i]).is(':checked') == true) {
            devices.push(inputs[i].id.split("_")[1]);
        } else if (inputs[i].id.indexOf("deleteProfile_") != -1 && $(inputs[i]).is(':checked') == true) {
            profiles.push(inputs[i].id.split("_")[1]);
        }
    }
    var linesString = "";
    var devicesString = "";
    var profilesString = "";

    if (lines.length > 0) {
        if (lines.length == 1) {
            linesString = lines[0];
        } else {
            for (i = 0; i < lines.length; i++) {
                if (i != 0 && i <= lines.length - 1) {
                    linesString += ":"
                }
                linesString += lines[i];
            }
        }
    }

    if (devices.length > 0) {
        if (devices.length == 1) {
            devicesString = devices[0];
        } else {
            for (i = 0; i < devices.length; i++) {
                if (i != 0 && i <= devices.length - 1) {
                    devicesString += ":"
                }
                devicesString += devices[i];
            }
        }
    }

    if (profiles.length > 0) {
        if (profiles.length == 1) {
            profilesString = profiles[0];
        } else {
            for (i = 0; i < profiles.length; i++) {
                if (i != 0 && i <= profiles.length - 1) {
                    profilesString += ":"
                }
                profilesString += profiles[i];
            }
        }
    }

    deleteSiblings(deletePhoneButton);
    if (linesString == "" && devicesString == "" && profilesString == "") {
        validator.error(deletePhoneButton, "You must check at least one option");
    } else {
        if (removingLine && !havingProfile || !removingLine || (removingLine && havingProfile && $("#profile_0").val() != $("#telephoneNumber").val())) {
            $(dialog).empty();
            $(dialog).append("<span>Are you sure that you want to delete the selected items?</span>");
            $(dialog).dialog({
                resizable: false
                , title: "Question"
                , draggable: true
                , dialogClass: "alert"
                , height: 160
                , modal: true
                , show: { effect: "bounce" }
                , hide: { effect: "explode" }
                , buttons: { "Ok": function () {
                    $(this).dialog("close");
                    $(dialog).empty();
                    loading.start();
                    $.ajax({
                        type: "POST"
                        , dataType: "xml"
                        , url: "clientAsync.aspx"
                        , data: { method: "deleteLinePhoneProfile", session: session, useridsid: useridsid, lines: linesString, phones: devicesString, profiles: profilesString }
                        , success: function (xml) {
                            loading.stop();
                            if ($(xml).find("error").text() != "") {
                                validator.error(deletePhoneButton, $(xml).find("error").text());
                            } else {
                                $(dialog).empty();

                                var linesDeleted = $(xml).find("linesDeleted").text();
                                var phonesDeleted = $(xml).find("phonesDeleted").text();
                                var profilesDeleted = $(xml).find("profilesDeleted").text();

                                var msg = "<span>";
                                if (linesDeleted != "0") {
                                    msg += "deleted lines: " + linesDeleted + "<br/>";
                                }
                                if (phonesDeleted != "0") {
                                    msg += "deleted phones: " + phonesDeleted + "<br/>";
                                }
                                if (profilesDeleted != "0") {
                                    msg += "deleted profiles: " + profilesDeleted + "<br/>";
                                }
                                msg += "</span>";

                                $(dialog).append(msg);
                                $(dialog).dialog({
                                    resizable: false
                                        , title: "SUCCESS"
                                        , draggable: true
                                        , dialogClass: "alert"
                                        , height: 160
                                        , modal: true
                                        , show: { effect: "bounce" }
                                        , hide: { effect: "explode" }
                                      //, close: function (event, ui) { loading.stop(); }
                                        , buttons: { "Ok": function () {
                                            $(this).dialog("close");
                                            $(dialog).empty();
                                            clearForm($("#tabs-3").get(0));
                                            findWwid();
                                        }
                                        }
                                });
                            }
                        }
                        , error: function (xml) {
                            loading.stop();
                        }
                    });
                }
                , Cancel: function () { $(this).dialog("close"); $(dialog).empty(); }
                }
            });
        } else {
            $(dialog).empty();
            $(dialog).append("<span>You must remove Lync Companion Mode first</span>");
            $(dialog).dialog({
                resizable: false
                , title: "Warning"
                , draggable: true
                , dialogClass: "alert"
                , height: 160
                , modal: true
                , show: { effect: "bounce" }
                , hide: { effect: "explode" }
                , buttons: { "Ok": function () {
                    $(this).dialog("close");
                    $(dialog).empty();
                }}
            });
        }
    }
}

/****************************************************************************************************************************************
Lync Methods
****************************************************************************************************************************************/

function setLyncOnly() {
    deleteSiblings(buttonLyncOnly);
    deleteSiblings(buttonRemoveLyncOnly);
    var inet,phoneNumber;
    if ($("#primaryExtension").val() == undefined) {
        inet = "";
    } else {
        inet = $("#primaryExtension").val().substring(0, 8);
    }
    if ($("#telephoneNumber").val() == undefined) {
        phoneNumber = "";
    } else {
        phoneNumber = $("#telephoneNumber").val();
    }
    if (phoneNumber == "" && inet == "") {
        validator.error(buttonLyncOnly, "To set lync only mode the selected user must have a line number first.");
    } else if ($("#profile_0").get(0) != undefined && ($("#profile_0").val() == inet || $("#profile_0").val() == phoneNumber)) {
        validator.error(buttonLyncOnly, "You must remove Lync Companion mode first");
    } else {
        $(dialog).empty();
        var text = createElement("span", dialog, "", "Are you sure you want to remove the hardphone and set Lync only mode?", "", "");
        $(dialog).dialog({
            resizable: false
        , title: "Question"
        , draggable: true
        , dialogClass: "alert"
        , width: 400
        , height: 160
        , modal: true
        , show: { effect: "bounce" }
        , hide: { effect: "explode" }
        , buttons: { "Ok": function () {
            $(this).dialog("close");
            $(dialog).empty();
            loading.start();
            $.ajax({
                type: "POST"
                , dataType: "xml"
                , url: "clientAsync.aspx"
                , data: { method: "addLyncOnly", session: session, email: $("#email").val(), idsid: useridsid, inet: inet, phoneNumber: phoneNumber }
                , success: function (xml) {
                    loading.stop();
                    if ($(xml).find("error").text() != "") {
                        validator.error(buttonLyncOnly, $(xml).find("error").text());
                    } else {
                        $(dialog).empty();
                        $(dialog).append("<span>Lync only set</span>");
                        $(dialog).dialog({
                            resizable: false
                                , title: "SUCCESS"
                                , draggable: true
                                , dialogClass: "alert"
                                , height: 160
                                , modal: true
                                , show: { effect: "bounce" }
                                , hide: { effect: "explode" }
                            //, close: function (event, ui) { loading.stop(); }
                                , buttons: { "Ok": function () {
                                    $(this).dialog("close");
                                    $(dialog).empty();
                                    findWwid();
                                } 
                                }
                        });
                    }
                }
        , error: function (xml) {
            loading.stop();
        }
            });
        }
            , Cancel: function () { $(this).dialog("close"); $(dialog).empty(); }
        }
        });
    }
}

function removeLyncOnly() { 
    deleteSiblings(buttonRemoveLyncOnly);
    deleteSiblings(buttonLyncOnly);
    if ($("#device_0").get(0) != undefined) {
        validator.error(buttonRemoveLyncOnly, "The selected user is not on lync only mode");
    } else {
    if ($(lyncOnlyModelSelect).val() == "CIPC" && $(lyncOnlyMacAddress).val() == "") {
        validator.error(buttonRemoveLyncOnly, "Please correct the form first");
    }  else if ($(lyncOnlyModelSelect).val() == "CIPC" && $(lyncOnlyMacAddress).val().length != 3) {
        validator.error(buttonRemoveLyncOnly, "You must enter 3 random characters");
    } else {
        var inet = "";
        if ($("#primaryExtension").val() == "" || $("#primaryExtension").val() == undefined || $("#primaryExtension").val() == null) {
            if ($("#telephoneNumber").val() != undefined)
                inet = $("#telephoneNumber").val().substring(0, 8);
        } else {
            inet = $("#primaryExtension").val().substring(0, 8);
        }
        if (inet == "") {
            validator.error(buttonRemoveLyncOnly, "The selected user does not have any line");
        } else {
            $(dialog).empty();
            $(dialog).append("<span>Are you sure you want to remove the lync only mode?</span>");
            $(dialog).dialog({
                resizable: false
                    , title: "Question"
                    , draggable: true
                    , dialogClass: "alert"
                    , width: 400
                    , height: 160
                    , modal: true
                    , show: { effect: "bounce" }
                    , hide: { effect: "explode" }
                    , buttons: { "Ok": function () {
                        $(this).dialog("close");
                        $(dialog).empty();
                        loading.start();
                        $.ajax({
                            type: "POST"
                            , dataType: "xml"
                            , url: "clientAsync.aspx"
                            , data: { method: "removeLyncOnly", wwid: $(wwid).val(), session: session, email: $("#email").val(), fullName: userFullName, inet: inet, model: $(lyncOnlyModelSelect).val(), po: $(lyncOnlyMacAddress).val(), classOfService: $(classServiceSelect).val(), idsid: useridsid, phoneNumber: $("#telephoneNumber").val() }
                            , success: function (xml) {
                                loading.stop();
                                if ($(xml).find("error").text() != "") {
                                    validator.error(buttonRemoveLyncOnly, $(xml).find("error").text());
                                } else if ($(xml).find("success").text() == "true") {
                                    $(dialog).empty();
                                    $(dialog).append("<span>Lync only succesfully removed <br/>device name: " + $(xml).find("device").text() + "</span>");
                                    $(dialog).dialog({
                                        resizable: false
                                            , title: "SUCCESS"
                                            , draggable: true
                                            , dialogClass: "alert"
                                            , height: 160
                                            , modal: true
                                            , show: { effect: "bounce" }
                                            , hide: { effect: "explode" }
                                        //, close: function (event, ui) { loading.stop(); }
                                            , buttons: { "Ok": function () {
                                                $(this).dialog("close");
                                                $(dialog).empty();
                                                clearForm($("#tabs-4").get(0), [$(lyncOnlyMacAddress).get(0)]);
                                                findWwid();
                                            }
                                            }
                                    });
                                }
                            }
                            , error: function (xml) {
                                loading.stop();
                            }
                        });
                    }
                    , Cancel: function () { $(this).dialog("close"); $(dialog).empty(); }
                    }
            });
        }
    }
    } 
}

function addLyncCompanion() {
    deleteSiblings(buttonAddLyncCompanion);
    deleteSiblings(buttonRemoveLyncCompanion);
    var inet = $("#primaryExtension").val();
    if (inet != undefined) {
        inet = inet.substring(0, 8);
    } else {
        inet = "";
    }
    if ($("#profile_0").get(0) != undefined && $("#profile_0").val() == inet) {
        validator.error(buttonAddLyncCompanion, "The selected user already has a profile");
    }else if (inet == "") {
        validator.error(buttonAddLyncCompanion, "The selected user does not have any line");
    } else {
        $(dialog).empty();
        var text = createElement("span", dialog, "", "Are you sure you want to set lync companion mode to the line number: "+ inet +"?", "", "");
        $(dialog).dialog({
            resizable: false
        , title: "Question"
        , draggable: true
        , dialogClass: "alert"
        , width: 400
        , height: 160
        , modal: true
        , show: { effect: "bounce" }
        , hide: { effect: "explode" }
        , buttons: { "Ok": function () {
            $(this).dialog("close");
            $(dialog).empty();
            loading.start();
            $.ajax({
                type: "POST"
                , dataType: "xml"
                , url: "clientAsync.aspx"
                , data: { method: "addLyncCompanion", session: session, email: $("#email").val(), fullName: userFullName, inet: inet, idsid: useridsid }
                , success: function (xml) {
                    loading.stop();
                    if ($(xml).find("error").text() != "") {
                        validator.error(buttonAddLyncCompanion, $(xml).find("error").text());
                    } else if ($(xml).find("success").text() != "") {
                        havingProfile = true;
                        $(dialog).empty();
                        $(dialog).append("<span>Lync Companion mode succesfully set to the line number: " + inet + "</span>");
                        $(dialog).dialog({
                            resizable: false
                                , title: "SUCCESS"
                                , draggable: true
                                , dialogClass: "alert"
                                , height: 160
                                , modal: true
                                , show: { effect: "bounce" }
                                , hide: { effect: "explode" }
                            //, close: function (event, ui) { loading.stop(); }
                                , buttons: { "Ok": function () {
                                    $(this).dialog("close");
                                    $(dialog).empty();
                                    clearForm($("#tabs-4").get(0));
                                    findWwid();
                                } 
                                }
                        });
                    }
                }
        , error: function (xml) {
            loading.stop();
        }
            });
        }
        , Cancel: function () { $(this).dialog("close"); $(dialog).empty(); }
        }
        });
    }
}

function removeLyncCompanion() {
    deleteSiblings(buttonRemoveLyncCompanion);
    deleteSiblings(buttonAddLyncCompanion);
    var inet = $("#primaryExtension").val();
    if (inet != undefined) {
        inet = inet.substring(0, 8);
    } else {
        inet = "";
    }
    if ($("#profile_0").get(0) == undefined || $("#profile_0").val() != inet) {
        validator.error(buttonRemoveLyncCompanion, "This user does not have any profile");
    } else {
        $(dialog).empty();
        $(dialog).append("<span>Are you sure you want to remove Lync Companion mode?</span>");
        $(dialog).dialog({
            resizable: false
            , title: "Question"
            , draggable: true
            , dialogClass: "alert"
            , width: 400
            , height: 160
            , modal: true
            , show: { effect: "bounce" }
            , hide: { effect: "explode" }
            , buttons: { "Ok": function () {
                $(this).dialog("close");
                $(dialog).empty();
                loading.start();
                $.ajax({
                    type: "POST"
                    , dataType: "xml"
                    , url: "clientAsync.aspx"
                    , data: { method: "removeLyncCompanion", session: session, inet: $("#primaryExtension").val().substring(0, 8), idsid: useridsid, fullName: userFullName }
                    , success: function (xml) {
                        loading.stop();
                        if ($(xml).find("error").text() != "") {
                            validator.error(buttonRemoveLyncCompanion, $(xml).find("error").text());
                        } else if ($(xml).find("success").text() != "") {
                            havingProfile = false;
                            $(dialog).empty();
                            $(dialog).append("<span>Lync Companion succesfully removed</span>");

                            $(dialog).dialog({
                                resizable: false
                                    , title: "SUCCESS"
                                    , draggable: true
                                    , dialogClass: "alert"
                                    , width: 300
                                    , height: 160
                                    , modal: true
                                    , show: { effect: "bounce" }
                                    , hide: { effect: "explode" }
                                //, close: function (event, ui) { loading.stop(); }
                                    , buttons: { "Ok": function () {
                                        $(this).dialog("close");
                                        $(dialog).empty();
                                        clearForm($("#tabs-4").get(0));
                                        findWwid();
                                    }
                                    }
                            });
                        }
                    }
            , error: function (xml) {
                loading.stop();
            }
                });
            }
                        , Cancel: function () { $(this).dialog("close"); $(dialog).empty(); }
            }
        });
    }
}

/****************************************************************************************************************************************
Bulk Methods
****************************************************************************************************************************************/

function getLyncBulkRequests() {
    $.ajax({
        type: "POST"
            , dataType: "xml"
            , url: "clientAsync.aspx"
            , data: { method: "loadGridBulkRequest" }
            , success: function (xml) {
                var bulkContainer = $("#bulkContainer").get(0);
                $(bulkContainer).empty();
                var rows = $(xml).find("row");
                grid(bulkContainer, "grdReqs", rows, "tbodyReqs");
            }
            , error: function (xml) {}
    });
}

function getLyncBulkRequestsBody() {
    $.ajax({
        type: "POST"
            , dataType: "xml"
            , url: "clientAsync.aspx"
            , data: { method: "loadGridBulkRequest" }
            , success: function (xml) {                                
                var rows = $(xml).find("row");
                gridContent(rows, "grdReqs", "tbodyReqs");
            }
            , error: function (xml) {
            }
    });
}

function openNewRequestDialog() {
    $(dialog).empty();
    var table = createElement("table",dialog,"","","","");
    var tr = createElement("tr", table, "", "", "", "");
    var td = createElement("td", tr, "", "", "", "");
    var label = createElement("label", td, "labelCSV", "CSV File: ", "", "for=fieldCSV");
    td = createElement("td", tr, "", "", "", "");
    var file = createElement("input", td, "fieldCSV", "", "", "type=file");
    tr = createElement("tr", table, "", "", "", "");
    td = createElement("td", tr, "", "", "top", "");
    label = createElement("label", td, "labelValidation", "Validation: ", "", "for=fieldValidation");
    td = createElement("td", tr, "", "", "", "");
    var textarea = createElement("textarea", td, "textareaValidation", "", "", "rows=25&cols=80");
    $(textarea).attr('readonly', true);

    $(dialog).dialog({
              resizable: true
            , title: "NEW BULK REQUEST"
            , draggable: true
            , dialogClass: "alert"
            , width: 800
            , height: 600
            , modal: true
            , show: { effect: "bounce" }
            , hide: { effect: "explode" }
            , buttons: { "Validate": function () { validateBulkRequest(); }
                        , "Submit": function () {
                            submitBulkRequest();
                            $(this).dialog("close");
                            $(dialog).empty();
                           }
                       }
    });
    $(".ui-dialog-buttonpane button:contains('Submit')").button("disable");
    $(file).change(function () {
        $(".ui-dialog-buttonpane button:contains('Submit')").button("disable");
        $(textarea).val("");
    });
}

function validateBulkRequest(evt) {
    var files = document.getElementById('fieldCSV').files;
    if (!files.length) {
        alert('Please select a file!');
        return false;
    }
    var file = files[0];
    if (file.name.substring(file.name.lastIndexOf('.') + 1) != "csv") {
        alert('The file must have a csv extension!');
        return false;
    }
    var reader = new FileReader();
    var textarea = $("#textareaValidation").get(0);
    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            loading.start();
            $.ajax({
                type: "POST"
                , dataType: "xml"
                , url: "clientAsync.aspx"
                //Anoj H2R Available Number Changes BOC for format validation : added session as additional parameter BOC
                , data: { method: "validateCsvFile", file: evt.target.result.toString(), session: session }
                //Anoj H2R Available Number Changes BOC for format validation : EOC
                , success: function (xml) {
                    loading.stop();
                    if ($(xml).find("error").text() != "") {
                        validator.error(textarea, $(xml).find("error").text());
                    } else if ($(xml).find("success").text() != "") {
                        validator.success(textarea, $(xml).find("success").text());
                        $(".ui-dialog-buttonpane button:contains('Submit')").button("enable");
                    }
                    var msgs = $(xml).find("msg");
                    var result = "";
                    for (var i = 0; i < msgs.length; i++) {
                        result += $(msgs[i]).text() + "\n";
                    }
                    $("#textareaValidation").val(result);
                }
                , error: function (xml) {
                    loading.stop();
                }
            });
        }
    };
    var blob = file.slice(0, file.size);
//    reader.readAsBinaryString(blob);
    reader.readAsText(blob);
}

function submitBulkRequest() {
    var files = document.getElementById('fieldCSV').files;
    if (!files.length) {
        alert('Please select a file!');
        return false;
    }
    var file = files[0];
    if (file.name.substring(file.name.lastIndexOf('.') + 1) != "csv") {
        alert('The file must have a csv extension!');
        return false;
    }
    var reader = new FileReader();
    var textarea = $("#textareaValidation").get(0);
    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            loading.start();
            $.ajax({
                type: "POST"
                , dataType: "xml"
                , url: "clientAsync.aspx"
                , data: { method: "submitCsvFile", file: evt.target.result.toString(), session: session }
                , success: function (xml) {
                    loading.stop();
                    if ($(xml).find("error").text() != "") {
                        validator.error(textarea, $(xml).find("error").text());
                    } else if ($(xml).find("success").text() != "") {
                        $(dialog).dialog("close");
                        $(dialog).empty();
                        $(dialog).append($(xml).find("success").text());
                        $(dialog).dialog({
                            resizable: true
                            , title: "SUCCESS"
                            , draggable: true
                            , dialogClass: "alert"
                            , width: 300
                            , height: 160
                            , modal: true
                            , show: { effect: "bounce" }
                            , hide: { effect: "explode" }
                            //, close: function (event, ui) { loading.stop(); }
                            , buttons: { "Ok": function () {
                                getLyncBulkRequests();
                                $(this).dialog("close");
                                $(dialog).empty();
                            }}
                        });
                    }
                    var msgs = $(xml).find("msg");
                    var result = "";
                    for (var i = 0; i < msgs.length; i++) {
                        result += $(msgs[i]).text() + "\n";
                    }
                    $("#textareaValidation").val(result);
                }
                , error: function (xml) {
                    loading.stop();
                }
            });
        }
    };
    var blob = file.slice(0, file.size);
    reader.readAsText(blob);
}

//Anoj H2R Available Number Change : BOC
function getAvailableNumber(LoaderUIEnabled = true) {
    if (LoaderUIEnabled) {
        loading.start();
    }
    $.ajax({
        type: "POST"
        , dataType: "xml"
        , url: "clientAsync.aspx"
        , data: { method: "getAvailableNumber", session: session }
        , success: function (xml) {
            var availableNumber = $(xml).find("availableNumber");
            $(nextAvailable).empty();
            for (var i = 0; i < availableNumber.length; i++) {
                $(nextAvailable).append($(availableNumber[i]).text() + "<br />");
            }
            if (LoaderUIEnabled) {
                loading.stop();
            }
        }
        , error: function (xml) {
            var availableNumber = $(xml).find("error");
            $(nextAvailable).empty();
            for (var i = 0; i < availableNumber.length; i++) {
                $(nextAvailable).append("Error Loading Available Numbers for the site! Please contact Team.cia@intel.com for support" + "<br />");
            }
            if (LoaderUIEnabled) {
                loading.stop();
            }
           
        }
    });
}
//Anoj H2R Available Number Change : EOC

/****************************************************************************************************************************************
DSB incident Methods
****************************************************************************************************************************************/
function getOpenIncidents() {    
    loading.start();
    $.ajax({
        type: "POST"
        , dataType: "xml"
        , url: "clientAsync.aspx"
        , data: { method: "getOpenIncidents"}
        , success: function (xml) {
            var openIncident = $(xml).find("ServiceNowTicket");
            $(currentOpenIncident).empty();
            $(incidentLabel).empty();
            if (openIncident.length < 1) {
                $(currentOpenIncident).append("There are no incidents");
            } else {
                for (var i = 0; i < openIncident.length; i++) {
                    $(currentOpenIncident).append($(openIncident[i]).text());
                }
                    $(incidentLabel).append("SCT is currently experiencing problems. Please do not submit more requests while we are working to resolve this incident.");
             
            }          

            loading.stop();
        }
        , error: function (xml) {
            loading.stop();
        }
    });
}

function getBulkIncidents() {
    $.ajax({
        type: "POST"
            , dataType: "xml"
            , url: "clientAsync.aspx"
            , data: { method: "loadGridBulkIncidents" }
            , success: function (xml) {
                var bulkIncidentContainer = $("#bulkIncidentContainer").get(0);
                $(bulkIncidentContainer).empty();
                var rows = $(xml).find("row");
                gridIncidentsContent(bulkIncidentContainer, "grdInc", rows, "tbodyInc");
            }
            , error: function (xml) { }
    });
}

function closeDSBIncident() {
    loading.start();
    $.ajax({
        type: "POST"
        , dataType: "xml"
        , url: "clientAsync.aspx"
        , data: { method: "closeDSBIncident" }
        , success: function (xml) {
            $(dialog).dialog({
                resizable: true
                , title: "Ticket has been closed"
                , draggable: true
                , dialogClass: "alert"
                , width: 300
                , height: 160
                , modal: true
                , show: { effect: "bounce" }
                , hide: { effect: "explode" }
                //, close: function (event, ui) { loading.stop(); }
                , buttons: {
                    "Ok": function () {
                        getBulkIncidents();
                        getOpenIncidents();
                        $(this).dialog("close");
                        $(dialog).empty();
                    }
                }
            });
            loading.stop();
        }
        , error: function (xml) {
            loading.stop();
        }
    });    
}

/////////////////////////////////////
function getHungJobs() {
    $.ajax({
        type: "POST"
            , dataType: "xml"
            , url: "clientAsync.aspx"
            , data: { method: "getHungJobs" }
            , success: function (xml) {
                var container = $("#progressJobsContainer").get(0);
                $(container).empty();
                var rows = $(xml).find("row");
                if (rows.length > 0) {
                    grid(container, "grdHungJobs", rows, "tbodyHungJobs");
                } else {
                    createElement("p",container,"", "There are no in-progress jobs right now.","red","");
                }
            }
            , error: function (xml) {
            }
    });
}

function killSelectedProcesses() {
    var inputs = $('input').get();
    var killinputs = Array();
    for (var i = 0; i < inputs.length; i++) {
        if ($(inputs[i]).attr("type") == "checkbox" && $(inputs[i]).attr("id").indexOf("kill") != -1 && $(inputs[i]).attr("checked")) {
            killinputs.push($(inputs[i]).attr("id"));
        }
    }
    $(dialog).empty();
    if (killinputs.length == 0) {
        createElement("p", dialog, "", "You didn't select any job to stop.", "", "");
        $(dialog).dialog({
            resizable: false
            , title: "WARNING"
            , draggable: true
            , dialogClass: "alert"
            , height: 160
            , modal: true
            , close: function (event, ui) { loading.stop() }
            , show: { effect: "bounce" }
            , hide: { effect: "explode" }
            , buttons: {
                "Ok": function () { $(this).dialog("close"); $(dialog).empty(); }
            }
        });
    } else {
        createElement("p", dialog, "", "Are you sure you want to stop the selected jobs?", "", "");
        $(dialog).dialog({
            resizable: false
            , title: "WARNING"
            , draggable: true
            , dialogClass: "alert"
            , height: 160
            , modal: true
            , close: function (event, ui) { loading.stop() }
            , show: { effect: "bounce" }
            , hide: { effect: "explode" }
            , buttons: {
                "Yes": function () {
                    loading.start();
                    $.ajax({
                        type: "POST"
                        , dataType: "xml"
                        , url: "clientAsync.aspx"
                        , data: { method: "kill", session: session, jobs: killinputs.join() }
                        , success: function (xml) {
                            $(dialog).dialog("close");
                            $(dialog).empty();
                            getHungJobs();
                            loading.stop();
                        }
                        , error: function (xml) {
                            loading.stop();
                        }
                    });
                },
                "Cancel": function () { $(this).dialog("close"); $(dialog).empty(); }
            }
        });
    }
}
