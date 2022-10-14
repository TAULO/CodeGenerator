var devices;
(function (devices) {
    var ExtensionForIPhone = (function () {
        function ExtensionForIPhone() {
        }
        return ExtensionForIPhone;
    }());
    devices.ExtensionForIPhone = ExtensionForIPhone;
    var AdminDevices = (function () {
        function AdminDevices(containerId) {
            this.MainContainer = $("#" + containerId);
            this.BuildMainTabs();
        }
        AdminDevices.prototype.BuildMainTabs = function () {
            var _this = this;
            this.MainContainer.html("");
            var tabsContainer = $("<div></div>");
            var ulTabs = $("<ul></ul>");
            ulTabs.addClass("nav nav-tabs");
            ulTabs.attr("role", "tablist");
            var liIpPhoneOption = $("<li></li>");
            liIpPhoneOption.attr("role", "presentation");
            liIpPhoneOption.addClass("active");
            var aTextPhoneOption = $("<a></a>");
            aTextPhoneOption.attr("href", "#ipphoneTab");
            aTextPhoneOption.attr("aria-controls", "ipphoneTab");
            aTextPhoneOption.attr("role", "tab");
            aTextPhoneOption.attr("data-toggle", "tab");
            aTextPhoneOption.html("Ip Phones");
            aTextPhoneOption.click(function (ev) { _this.BuildTableIpPhones(); });
            aTextPhoneOption.css({ "font-weight": "bolder", "color": "black" });
            liIpPhoneOption.append(aTextPhoneOption);
            var liConferenceOption = $("<li></li>");
            liConferenceOption.attr("role", "presentation");
            var aTextConferenceOption = $("<a></a>");
            aTextConferenceOption.attr("href", "#conferenceTab");
            aTextConferenceOption.attr("aria-controls", "conferenceTab");
            aTextConferenceOption.attr("role", "tab");
            aTextConferenceOption.attr("data-toggle", "tab");
            aTextConferenceOption.html("Conferences");
            aTextConferenceOption.click(function (ev) { _this.BuildTableConferences(); });
            aTextConferenceOption.css({ "font-weight": "bolder", "color": "black" });
            liConferenceOption.append(aTextConferenceOption);
            ulTabs.append(liIpPhoneOption);
            ulTabs.append(liConferenceOption);
            tabsContainer.append(ulTabs);
            var tabContents = $("<div></div>");
            tabContents.addClass("tab-content");
            var tabIpPhoneContent = $("<div></div>");
            tabIpPhoneContent.attr("role", "tabpanel");
            tabIpPhoneContent.addClass("tab-pane active");
            tabIpPhoneContent.attr("id", "ipphoneTab");
            var tabConferenceContent = $("<div></div>");
            tabConferenceContent.attr("role", "tabpanel");
            tabConferenceContent.addClass("tab-pane");
            tabConferenceContent.attr("id", "conferenceTab");
            tabContents.append(tabIpPhoneContent);
            tabContents.append(tabConferenceContent);
            tabsContainer.append(tabContents);
            this.MainContainer.append(tabsContainer);
            this.BuildTableIpPhones();
        };
        AdminDevices.prototype.BuildFormEditConference = function (conference) {
            var _this = this;
            var content = $("#conferenceTab");
            content.html("");
            var form = $("<form></form>");
            var divName = $("<div></div>");
            divName.addClass("form-group");
            var labelName = $("<label></label>");
            labelName.html("Name");
            labelName.addClass("control-label");
            labelName.attr("for", "inputName");
            var inputName = $("<input />");
            inputName.attr("id", "inputName");
            inputName.attr("type", "text");
            inputName.val(conference.Name);
            inputName.addClass("col-sm-6 form-control");
            var inputIdConference = $("<input />");
            inputIdConference.attr("id", "inputIdConference");
            inputIdConference.attr("type", "hidden");
            inputIdConference.val(conference.Id);
            divName.append(inputIdConference);
            divName.append(labelName);
            divName.append(inputName);
            var divExtension = $("<div></div>");
            divExtension.addClass("form-group");
            var labelExtension = $("<label></label>");
            labelExtension.html("Extension");
            labelExtension.addClass("control-label");
            labelExtension.attr("for", "inputExtension");
            var inputExtension = $("<input />");
            inputExtension.attr("id", "inputExtension");
            inputExtension.attr("type", "text");
            inputExtension.val(conference.Extension);
            inputExtension.addClass("col-sm-6 form-control");
            divExtension.append(labelExtension);
            divExtension.append(inputExtension);
            var divButtons = $("<div></div>");
            divButtons.css({ "margin-top": "10px" });
            divButtons.addClass("form-group");
            var btnSubmit = $("<input />");
            btnSubmit.attr("type", "button");
            btnSubmit.attr("value", "Submit");
            btnSubmit.addClass("col-sm-1 btn btn-success");
            btnSubmit.click(function (ev) {
                ev.preventDefault();
                var name = $("#inputName").val();
                var extension = $("#inputExtension").val();
                if (name != "" && extension != "") {
                    Services.PBX.UpdateConference(conference.Id, name, extension, function (success) {
                        alert("The conference was updated correctly.");
                        _this.BuildTableConferences();
                    }, function (error) {
                        alert(error);
                        alert("Error on updated process. Please. Try again");
                        $("#inputName").focus();
                    });
                }
            });
            var btnCancel = $("<input />");
            btnCancel.attr("type", "button");
            btnCancel.attr("value", "Cancel");
            btnCancel.css({ "margin-left": "10px" });
            btnCancel.addClass("col-sm-1 btn btn-danger");
            btnCancel.click(function (ev) {
                ev.preventDefault();
                _this.BuildTableConferences();
            });
            divButtons.append(btnSubmit);
            divButtons.append(btnCancel);
            form.append(divName);
            form.append(divExtension);
            form.append(divButtons);
            content.append("<div style='margin-bottom: 10px;'><h2>Edit Conference</h2></div>");
            content.append(form);
            $("#inputName").focus();
        };
        AdminDevices.prototype.BuildFormAddConference = function () {
            var _this = this;
            var content = $("#conferenceTab");
            content.html("");
            var form = $("<form></form>");
            var divName = $("<div></div>");
            divName.addClass("form-group");
            var labelName = $("<label></label>");
            labelName.html("Name");
            labelName.addClass("control-label");
            labelName.attr("for", "inputName");
            var inputName = $("<input />");
            inputName.attr("id", "inputName");
            inputName.attr("type", "text");
            inputName.addClass("col-sm-6 form-control");
            divName.append(labelName);
            divName.append(inputName);
            var divExtension = $("<div></div>");
            divExtension.addClass("form-group");
            var labelExtension = $("<label></label>");
            labelExtension.html("Extension");
            labelExtension.addClass("control-label");
            labelExtension.attr("for", "inputExtension");
            var inputExtension = $("<input />");
            inputExtension.attr("id", "inputExtension");
            inputExtension.attr("type", "text");
            inputExtension.addClass("col-sm-6 form-control");
            divExtension.append(labelExtension);
            divExtension.append(inputExtension);
            var divButtons = $("<div></div>");
            divButtons.css({ "margin-top": "10px" });
            divButtons.addClass("form-group");
            var btnSubmit = $("<input />");
            btnSubmit.attr("type", "button");
            btnSubmit.attr("value", "Submit");
            btnSubmit.addClass("col-sm-1 btn btn-success");
            btnSubmit.click(function (ev) {
                ev.preventDefault();
                var name = $("#inputName").val();
                var extension = $("#inputExtension").val();
                if (name != "" && extension != "") {
                    Services.PBX.CreateConference(name, extension, function (success) {
                        alert("The conference was registered correctly.");
                        _this.BuildTableConferences();
                    }, function (error) {
                        alert(error);
                        alert("Error on registration process. Please. Try again");
                        $("#inputName").focus();
                    });
                }
            });
            var btnCancel = $("<input />");
            btnCancel.attr("type", "button");
            btnCancel.attr("value", "Cancel");
            btnCancel.css({ "margin-left": "10px" });
            btnCancel.addClass("col-sm-1 btn btn-danger");
            btnCancel.click(function (ev) {
                ev.preventDefault();
                _this.BuildTableConferences();
            });
            divButtons.append(btnSubmit);
            divButtons.append(btnCancel);
            form.append(divName);
            form.append(divExtension);
            form.append(divButtons);
            content.append("<div style='margin-bottom: 10px;'><h2>Add New Conference</h2></div>");
            content.append(form);
            $("#inputName").focus();
        };
        AdminDevices.prototype.BuildFormAddIpPhone = function () {
            var _this = this;
            var content = $("#ipphoneTab");
            content.html("");
            var form = $("<form></form>");
            var divDisplayName = $("<div></div>");
            divDisplayName.addClass("form-group");
            var labelDisplayName = $("<label></label>");
            labelDisplayName.html("Display name");
            labelDisplayName.addClass("control-label");
            labelDisplayName.attr("for", "inputDisplayName");
            var inputDisplayName = $("<input />");
            inputDisplayName.attr("id", "inputDisplayName");
            inputDisplayName.attr("type", "text");
            inputDisplayName.addClass("col-sm-6 form-control");
            divDisplayName.append(labelDisplayName);
            divDisplayName.append(inputDisplayName);
            var divBlockInternCalling = $("<div></div>");
            divBlockInternCalling.addClass("checkbox");
            var labelBlockInterCalling = $("<label></label>");
            var inputBlockInterCalling = $("<input />");
            inputBlockInterCalling.attr("id", "inputBlockInternCalling");
            inputBlockInterCalling.attr("type", "checkbox");
            labelBlockInterCalling.append(inputBlockInterCalling);
            labelBlockInterCalling.append("Block international calling");
            divBlockInternCalling.append(labelBlockInterCalling);
            var divHasVoiceMail = $("<div></div>");
            divHasVoiceMail.addClass("checkbox");
            var labelHasVoiceMail = $("<label></label>");
            var inputHasVoiceMail = $("<input />");
            inputHasVoiceMail.attr("id", "inputHasVoiceMail");
            inputHasVoiceMail.attr("type", "checkbox");
            labelHasVoiceMail.append(inputHasVoiceMail);
            labelHasVoiceMail.append("Has voice mail?");
            divHasVoiceMail.append(labelHasVoiceMail);
            var divCallerNumber = $("<div></div>");
            divCallerNumber.addClass("form-group");
            var labelCallerNumber = $("<label></label>");
            labelCallerNumber.html("Caller number");
            labelCallerNumber.addClass("control-label");
            labelCallerNumber.attr("for", "inputCallerNumber");
            var inputCallerNumber = $("<input />");
            inputCallerNumber.attr("id", "inputCallerNumber");
            inputCallerNumber.attr("type", "text");
            inputCallerNumber.addClass("col-sm-6 form-control");
            divCallerNumber.append(labelCallerNumber);
            divCallerNumber.append(inputCallerNumber);
            var divOnVacation = $("<div></div>");
            divOnVacation.addClass("checkbox");
            var labelOnVacation = $("<label></label>");
            var inputOnVacation = $("<input />");
            inputOnVacation.attr("id", "inputOnVacation");
            inputOnVacation.attr("type", "checkbox");
            labelOnVacation.append(inputOnVacation);
            labelOnVacation.append("Is on Vacation");
            divOnVacation.append(labelOnVacation);
            var divSipPassword = $("<div></div>");
            divSipPassword.addClass("form-group");
            var labelSipPassword = $("<label></label>");
            labelSipPassword.html("Sip Password");
            labelSipPassword.addClass("control-label");
            labelSipPassword.attr("for", "inputSipPassword");
            var inputSipPassword = $("<input />");
            inputSipPassword.attr("id", "inputSipPassword");
            inputSipPassword.attr("type", "password");
            inputSipPassword.addClass("col-sm-6 form-control");
            divSipPassword.append(labelSipPassword);
            divSipPassword.append(inputSipPassword);
            var divButtons = $("<div></div>");
            divButtons.css({ "margin-top": "10px" });
            divButtons.addClass("form-group");
            var btnSubmit = $("<input />");
            btnSubmit.attr("type", "button");
            btnSubmit.attr("value", "Submit");
            btnSubmit.addClass("col-sm-1 btn btn-success");
            btnSubmit.click(function (ev) {
                ev.preventDefault();
                _this.SubmitDataIpPhone(false);
            });
            var btnCancel = $("<input />");
            btnCancel.attr("type", "button");
            btnCancel.attr("value", "Cancel");
            btnCancel.css({ "margin-left": "10px" });
            btnCancel.addClass("col-sm-1 btn btn-danger");
            btnCancel.click(function (ev) {
                ev.preventDefault();
                _this.BuildTableIpPhones();
            });
            divButtons.append(btnSubmit);
            divButtons.append(btnCancel);
            form.append(divDisplayName);
            form.append(divBlockInternCalling);
            form.append(divCallerNumber);
            form.append(divHasVoiceMail);
            form.append(divOnVacation);
            form.append(divSipPassword);
            form.append(divButtons);
            content.append("<div style='margin-bottom: 10px;'><h2>Add Ip Phone</h2></div>");
            content.append(form);
        };
        AdminDevices.prototype.SubmitDataIpPhone = function (edit) {
            var _this = this;
            var displayName = $("#inputDisplayName").val();
            var blockInternCalling = $("#inputBlockInternCalling").prop("checked");
            var callerNumber = $("#inputCallerNumber").val();
            var onVacation = $("#inputOnVacation").prop("checked");
            var sipPassword = $("#inputSipPassword").val();
            var hasVoiceMail = $("#inputHasVoiceMail").prop("checked");
            if (displayName != "") {
                if (!edit) {
                    Services.PBX.CreateIpPhone(displayName, blockInternCalling, callerNumber, hasVoiceMail, null, null, null, null, null, null, onVacation, sipPassword, function (success) {
                        alert("The IpPhone was registered correctly.");
                        _this.BuildTableIpPhones();
                    }, function (error) {
                        alert(error);
                        alert("Error on registration process. Please. Try again");
                        $("#inputDisplayName").focus();
                    });
                }
                else {
                    var idPhone = $("#inputIdIpPhone").val();
                    Services.PBX.UpdateIpPhone(idPhone, displayName, blockInternCalling, callerNumber, hasVoiceMail, null, null, null, null, null, null, onVacation, sipPassword, function (success) {
                        alert("The IpPhone was edited correctly.");
                        _this.BuildTableIpPhones();
                    }, function (error) {
                        alert(error);
                        alert("Error on registration process. Please. Try again");
                        $("#inputDisplayName").focus();
                    });
                }
            }
            else
                alert("Please, try again.");
        };
        AdminDevices.prototype.SubmitNewExtension = function (IdIpPhone, extension) {
            var _this = this;
            var extensionNumber = $("#inputExtensionNumber").val();
            if (extensionNumber != "") {
                Services.PBX.CreateExtension(IdIpPhone, extension, function (success) {
                    alert("The extension was registered correctly.");
                    _this.BuildTableIpPhones();
                }, function (error) {
                    alert(error);
                    alert("Error on registration process. Please. Try again");
                    $("#inputExtensionNumber").focus();
                });
            }
            else
                alert("Please, try again.");
        };
        AdminDevices.prototype.BuildTableIpPhones = function () {
            var _this = this;
            var content = $("#ipphoneTab");
            content.html("");
            var btnAddIpPhone = $("<input />");
            btnAddIpPhone.attr("type", "button");
            btnAddIpPhone.attr("value", "Add ip Phone");
            btnAddIpPhone.addClass("btn btn-success");
            btnAddIpPhone.css({ "margin-bottom": "10px" });
            btnAddIpPhone.click(function () {
                _this.BuildFormAddIpPhone();
            });
            content.append(btnAddIpPhone);
            Services.PBX.GetIpPhones(function (success) {
                var iphones = success;
                if (iphones.length > 0) {
                    var table = $("<table></table>");
                    table.addClass("table table-striped tableAdminDevices");
                    var thead = $("<thead></thead>");
                    var trHead = $("<tr></tr>");
                    var tdHead = $("<th></th>");
                    tdHead.html("Id");
                    trHead.append(tdHead);
                    thead.append(trHead);
                    tdHead = $("<th></th>");
                    tdHead.html("Name");
                    trHead.append(tdHead);
                    thead.append(trHead);
                    tdHead = $("<th></th>");
                    tdHead.html("Has Voice mail");
                    trHead.append(tdHead);
                    thead.append(trHead);
                    tdHead = $("<th></th>");
                    tdHead.html("Block Inter. Calling");
                    trHead.append(tdHead);
                    thead.append(trHead);
                    tdHead = $("<th></th>");
                    tdHead.html("Vacation?");
                    trHead.append(tdHead);
                    thead.append(trHead);
                    tdHead = $("<th></th>");
                    tdHead.html("Caller Id");
                    trHead.append(tdHead);
                    thead.append(trHead);
                    tdHead = $("<th></th>");
                    tdHead.html("Extensions");
                    trHead.append(tdHead);
                    thead.append(trHead);
                    tdHead = $("<th></th>");
                    tdHead.html("Status");
                    trHead.append(tdHead);
                    thead.append(trHead);
                    tdHead = $("<th></th>");
                    tdHead.html("Options");
                    trHead.append(tdHead);
                    thead.append(trHead);
                    var tbody = $("<tbody></tbody>");
                    for (var i = 0; i < iphones.length; i++) {
                        var trBody = $("<tr></tr>");
                        var tdBody = $("<td></td>");
                        tdBody.html(iphones[i].Id.toString());
                        trBody.append(tdBody);
                        tdBody = $("<td></td>");
                        tdBody.html(iphones[i].DisplayName);
                        trBody.append(tdBody);
                        tdBody = $("<td></td>");
                        var checkHasVoiceMail = $("<input />");
                        checkHasVoiceMail.attr("type", "checkbox");
                        checkHasVoiceMail.prop("disabled", true);
                        if (iphones[i].HasVoicemail)
                            checkHasVoiceMail.prop("checked", true);
                        else
                            checkHasVoiceMail.prop("checked", false);
                        tdBody.append(checkHasVoiceMail);
                        trBody.append(tdBody);
                        tdBody = $("<td></td>");
                        var checkBlockInternationalCalling = $("<input />");
                        checkBlockInternationalCalling.attr("type", "checkbox");
                        checkBlockInternationalCalling.prop("disabled", true);
                        if (iphones[i].BlockInternationalCalling)
                            checkBlockInternationalCalling.prop("checked", true);
                        else
                            checkBlockInternationalCalling.prop("checked", false);
                        tdBody.append(checkBlockInternationalCalling);
                        trBody.append(tdBody);
                        tdBody = $("<td></td>");
                        var checkIsVacation = $("<input />");
                        checkIsVacation.attr("type", "checkbox");
                        checkIsVacation.prop("disabled", true);
                        if (iphones[i].IsOnVacation)
                            checkIsVacation.prop("checked", true);
                        else
                            checkIsVacation.prop("checked", false);
                        tdBody.append(checkIsVacation);
                        trBody.append(tdBody);
                        tdBody = $("<td></td>");
                        tdBody.html(iphones[i].CallerId);
                        trBody.append(tdBody);
                        tdBody = $("<td></td>");
                        var divExtensions = $("<div></div>");
                        divExtensions.attr("id", "ipPhoneExtension_" + iphones[i].Id);
                        divExtensions.html("&nbsp;");
                        tdBody.append(divExtensions);
                        trBody.append(tdBody);
                        tdBody = $("<td></td>");
                        var divStatus = $("<div></div>");
                        divStatus.attr("id", "ipPhone_" + iphones[i].Id);
                        divStatus.html("&nbsp;");
                        tdBody.append(divStatus);
                        trBody.append(tdBody);
                        tdBody = $("<td></td>");
                        var btnEdit = $("<input />");
                        btnEdit.attr("type", "button");
                        btnEdit.addClass("btn btn-primary");
                        btnEdit.attr("data-iphones", JSON.stringify(iphones[i]));
                        btnEdit.attr("value", "Edit");
                        btnEdit.click(function (ev) {
                            var data = JSON.parse($(ev.currentTarget).attr("data-iphones"));
                            _this.BuildEditFormIPhone(data);
                        });
                        tdBody.append(btnEdit);
                        var btnDelete = $("<input />");
                        btnDelete.attr("type", "button");
                        btnDelete.addClass("btn btn-danger");
                        btnDelete.css({ "margin-left": "10px" });
                        btnDelete.attr("data-ipId", iphones[i].Id);
                        btnDelete.attr("value", "Delete");
                        btnDelete.click(function (ev) {
                            if (confirm("Do you confirm this action?")) {
                                var idPhone = parseInt($(ev.currentTarget).attr("data-ipId"));
                                Services.PBX.RemoveIpPhone(idPhone, function (success) {
                                    alert("The IpPhone was removed correctly.");
                                    _this.BuildTableIpPhones();
                                }, function (error) {
                                    alert(error);
                                    alert("Error on registration process. Please. Try again");
                                });
                            }
                        });
                        tdBody.append(btnDelete);
                        var btnExtensions = $("<input />");
                        btnExtensions.attr("type", "button");
                        btnExtensions.addClass("btn btn-warning");
                        btnExtensions.css({ "margin-left": "10px" });
                        btnExtensions.attr("value", "Extensions");
                        btnExtensions.attr("data-ipId", iphones[i].Id);
                        btnExtensions.click(function (ev) {
                            var idPhone = parseInt($(ev.currentTarget).attr("data-ipId"));
                            _this.BuildFormExtension(idPhone);
                        });
                        tdBody.append(btnExtensions);
                        var btnDownload = $("<input />");
                        btnDownload.attr("type", "button");
                        btnDownload.addClass("btn btn-info");
                        btnDownload.css({ "margin-left": "10px" });
                        btnDownload.attr("data-ipId", iphones[i].Id);
                        btnDownload.attr("value", "Download");
                        btnDownload.click(function (ev) {
                            var idPhone = parseInt($(ev.currentTarget).attr("data-ipId"));
                            Services.PBX.GetModelsOfPhonesThatCanBeConfiguredRemotely(function (models) {
                                var modelList = models;
                                var content = $("#ipphoneTab");
                                content.html("");
                                var form = $("<form></form>");
                                var divDIpAddress = $("<div></div>");
                                divDIpAddress.addClass("form-group");
                                var labelIpAddress = $("<label></label>");
                                labelIpAddress.html("Ip Address");
                                labelIpAddress.addClass("control-label");
                                labelIpAddress.attr("for", "inputIpAddress");
                                var inputIpAddress = $("<input />");
                                inputIpAddress.attr("id", "inputIpAddress");
                                inputIpAddress.attr("type", "text");
                                inputIpAddress.addClass("col-sm-6 form-control");
                                divDIpAddress.append(labelIpAddress);
                                divDIpAddress.append(inputIpAddress);
                                var divModelRouter = $("<div></div>");
                                divModelRouter.addClass("form-group");
                                var labelModelRouter = $("<label></label>");
                                labelModelRouter.html("Model Router");
                                labelModelRouter.addClass("control-label");
                                labelModelRouter.attr("for", "selectModelRouter");
                                var selectModelRouter = $("<select></select>");
                                selectModelRouter.attr("id", "selectModelRouter");
                                selectModelRouter.addClass("col-sm-6 form-control");
                                for (var i = 0; i < modelList.length; i++) {
                                    selectModelRouter.append("<option value='" + modelList[i] + "'>" + models[i] + "</option>");
                                }
                                divModelRouter.append(labelModelRouter);
                                divModelRouter.append(selectModelRouter);
                                var divButtons = $("<div></div>");
                                divButtons.css({ "margin-top": "10px" });
                                divButtons.addClass("form-group");
                                var btnSubmit = $("<input />");
                                btnSubmit.attr("type", "button");
                                btnSubmit.attr("value", "Submit");
                                btnSubmit.addClass("col-sm-1 btn btn-success");
                                btnSubmit.click(function (ev) {
                                    ev.preventDefault();
                                    var ip = $("#inputIpAddress").val();
                                    var modelRouter = $("#selectModelRouter").val();
                                    Services.PBX.CreateExecutableToConfigureIpPhone(idPhone, modelRouter, ip, function (success) {
                                        console.log(success);
                                        window.location.href = success;
                                        _this.BuildTableIpPhones();
                                    }, function (error) {
                                        alert(error);
                                        alert("Error on registration process. Please. Try again");
                                    });
                                });
                                var btnCancel = $("<input />");
                                btnCancel.attr("type", "button");
                                btnCancel.attr("value", "Cancel");
                                btnCancel.css({ "margin-left": "10px" });
                                btnCancel.addClass("col-sm-1 btn btn-danger");
                                btnCancel.click(function (ev) {
                                    ev.preventDefault();
                                    _this.BuildTableIpPhones();
                                });
                                divButtons.append(btnSubmit);
                                divButtons.append(btnCancel);
                                form.append(divDIpAddress);
                                form.append(divModelRouter);
                                form.append(divButtons);
                                content.append("<div style='margin-bottom: 10px;'><h2>Download exe</h2></div>");
                                content.append(form);
                                $("#inputIpAddress").focus();
                            }, function (error) {
                                alert(error);
                                alert("Error on download process. Please. Try again");
                            });
                        });
                        tdBody.append(btnDownload);
                        trBody.append(tdBody);
                        trBody.append(tdBody);
                        tbody.append(trBody);
                    }
                    table.append(thead);
                    table.append(tbody);
                    content.append(table);
                    _this.GetIpPhonesStatus();
                    _this.GetExtensionIpPhones(iphones);
                }
            }, function (error) {
            });
        };
        AdminDevices.prototype.BuildEditFormIPhone = function (ipPhone) {
            var _this = this;
            var content = $("#ipphoneTab");
            content.html("");
            var form = $("<form></form>");
            var divDisplayName = $("<div></div>");
            divDisplayName.addClass("form-group");
            var inputIdPhoneHidden = $("<input />");
            inputIdPhoneHidden.attr("type", "hidden");
            inputIdPhoneHidden.attr("id", "inputIdIpPhone");
            inputIdPhoneHidden.val(ipPhone.Id);
            divDisplayName.append(inputIdPhoneHidden);
            var labelDisplayName = $("<label></label>");
            labelDisplayName.html("Display name");
            labelDisplayName.addClass("control-label");
            labelDisplayName.attr("for", "inputDisplayName");
            var inputDisplayName = $("<input />");
            inputDisplayName.attr("id", "inputDisplayName");
            inputDisplayName.attr("type", "text");
            inputDisplayName.val(ipPhone.DisplayName);
            inputDisplayName.addClass("col-sm-6 form-control");
            divDisplayName.append(labelDisplayName);
            divDisplayName.append(inputDisplayName);
            var divBlockInternCalling = $("<div></div>");
            divBlockInternCalling.addClass("checkbox");
            var labelBlockInterCalling = $("<label></label>");
            var inputBlockInterCalling = $("<input />");
            inputBlockInterCalling.attr("id", "inputBlockInternCalling");
            inputBlockInterCalling.prop("checked", ipPhone.BlockInternationalCalling);
            inputBlockInterCalling.attr("type", "checkbox");
            labelBlockInterCalling.append(inputBlockInterCalling);
            labelBlockInterCalling.append("Block international calling");
            divBlockInternCalling.append(labelBlockInterCalling);
            var divHasVoiceMail = $("<div></div>");
            divHasVoiceMail.addClass("checkbox");
            var labelHasVoiceMail = $("<label></label>");
            var inputHasVoiceMail = $("<input />");
            inputHasVoiceMail.attr("id", "inputHasVoiceMail");
            inputHasVoiceMail.prop("checked", ipPhone.HasVoicemail);
            inputHasVoiceMail.attr("type", "checkbox");
            labelHasVoiceMail.append(inputHasVoiceMail);
            labelHasVoiceMail.append("Has voice mail?");
            divHasVoiceMail.append(labelHasVoiceMail);
            var divCallerNumber = $("<div></div>");
            divCallerNumber.addClass("form-group");
            var labelCallerNumber = $("<label></label>");
            labelCallerNumber.html("Caller number");
            labelCallerNumber.addClass("control-label");
            labelCallerNumber.attr("for", "inputCallerNumber");
            var inputCallerNumber = $("<input />");
            inputCallerNumber.attr("id", "inputCallerNumber");
            inputCallerNumber.attr("type", "text");
            inputCallerNumber.val(ipPhone.CallerId);
            inputCallerNumber.addClass("col-sm-6 form-control");
            divCallerNumber.append(labelCallerNumber);
            divCallerNumber.append(inputCallerNumber);
            var divOnVacation = $("<div></div>");
            divOnVacation.addClass("checkbox");
            var labelOnVacation = $("<label></label>");
            var inputOnVacation = $("<input />");
            inputOnVacation.attr("id", "inputOnVacation");
            inputOnVacation.prop("checked", ipPhone.IsOnVacation);
            inputOnVacation.attr("type", "checkbox");
            labelOnVacation.append(inputOnVacation);
            labelOnVacation.append("Is on Vacation");
            divOnVacation.append(labelOnVacation);
            var divSipPassword = $("<div></div>");
            divSipPassword.addClass("form-group");
            var labelSipPassword = $("<label></label>");
            labelSipPassword.html("Sip Password");
            labelSipPassword.addClass("control-label");
            labelSipPassword.attr("for", "inputSipPassword");
            var inputSipPassword = $("<input />");
            inputSipPassword.attr("id", "inputSipPassword");
            inputSipPassword.attr("type", "password");
            inputSipPassword.addClass("col-sm-6 form-control");
            divSipPassword.append(labelSipPassword);
            divSipPassword.append(inputSipPassword);
            var divButtons = $("<div></div>");
            divButtons.css({ "margin-top": "10px" });
            divButtons.addClass("form-group");
            var btnSubmit = $("<input />");
            btnSubmit.attr("type", "button");
            btnSubmit.attr("value", "Submit");
            btnSubmit.addClass("col-sm-1 btn btn-success");
            btnSubmit.click(function (ev) {
                ev.preventDefault();
                _this.SubmitDataIpPhone(true);
            });
            var btnCancel = $("<input />");
            btnCancel.attr("type", "button");
            btnCancel.attr("value", "Cancel");
            btnCancel.css({ "margin-left": "10px" });
            btnCancel.addClass("col-sm-1 btn btn-danger");
            btnCancel.click(function (ev) {
                ev.preventDefault();
                _this.BuildTableIpPhones();
            });
            divButtons.append(btnSubmit);
            divButtons.append(btnCancel);
            form.append(divDisplayName);
            form.append(divBlockInternCalling);
            form.append(divCallerNumber);
            form.append(divHasVoiceMail);
            form.append(divOnVacation);
            form.append(divSipPassword);
            form.append(divButtons);
            content.append("<div style='margin-bottom: 10px;'><h2>Edit Ip Phone</h2></div>");
            content.append(form);
        };
        AdminDevices.prototype.BuildFormExtension = function (idPhone) {
            var _this = this;
            var content = $("#ipphoneTab");
            content.html("");
            var form = $("<form></form>");
            var divExtensionNumber = $("<div></div>");
            divExtensionNumber.addClass("form-group");
            var labelExtensionNumber = $("<label></label>");
            labelExtensionNumber.html("Extension");
            labelExtensionNumber.addClass("control-label");
            labelExtensionNumber.attr("for", "inputExtensionNumber");
            var inputExtensionNumber = $("<input />");
            inputExtensionNumber.attr("id", "inputExtensionNumber");
            inputExtensionNumber.attr("type", "text");
            inputExtensionNumber.addClass("col-sm-4 form-control");
            var inputEditExtensionNumber = $("<input />");
            inputEditExtensionNumber.attr("id", "inputExtensionNumberId");
            inputEditExtensionNumber.attr("type", "hidden");
            inputEditExtensionNumber.val("");
            divExtensionNumber.append(inputEditExtensionNumber);
            divExtensionNumber.append(labelExtensionNumber);
            divExtensionNumber.append(inputExtensionNumber);
            var divButtons = $("<div></div>");
            divButtons.css({ "margin-top": "10px" });
            divButtons.addClass("form-group");
            var btnSubmit = $("<input />");
            btnSubmit.attr("type", "button");
            btnSubmit.attr("value", "Submit");
            btnSubmit.attr("id", "submitNewControlExtension");
            btnSubmit.addClass("col-sm-1 btn btn-success");
            btnSubmit.click(function (ev) {
                ev.preventDefault();
                var id = $("#inputExtensionNumberId").val();
                if (id == "")
                    _this.SubmitNewExtension(idPhone, $("#inputExtensionNumber").val());
                else {
                    var id = $("#inputExtensionNumberId").val();
                    var num = $("#inputExtensionNumber").val();
                    if (num != "") {
                        Services.PBX.UpdateExtension(id, num, function (success) {
                            alert("The extension was edited correctly.");
                            _this.BuildFormExtension(idPhone);
                        }, function (error) {
                            alert(error);
                            alert("Error on registration process. Please. Try again");
                            $("#inputExtensionNumber").focus();
                        });
                    }
                }
            });
            var btnCancel = $("<input />");
            btnCancel.attr("type", "button");
            btnCancel.attr("value", "Cancel");
            btnCancel.css({ "margin-left": "10px" });
            btnCancel.attr("id", "CancelNewControlExtension");
            btnCancel.addClass("col-sm-1 btn btn-danger");
            btnCancel.click(function (ev) {
                ev.preventDefault();
                var id = $("#inputExtensionNumberId").val();
                if (id == "")
                    _this.BuildTableIpPhones();
                else {
                    $("#inputExtensionNumberId").val("");
                    $("#inputExtensionNumber").val("");
                    $("#titleControlExtension").html("Add Extension");
                    $("#inputExtensionNumberId").focus();
                }
            });
            divButtons.append(btnSubmit);
            divButtons.append(btnCancel);
            form.append(divExtensionNumber);
            form.append(divButtons);
            content.append("<div style='margin-bottom: 10px;'><h2 id='titleControlExtension'>Add Extension</h2></div>");
            content.append(form);
            var table = $("<table></table>");
            table.addClass("table table-striped tableExtensions");
            this.GetExtensionIpPhones(null, function (array) {
                var search = _this.SearchExtensionInIpPhone(array, idPhone);
                var extensions = array[search.index].Extensions;
                var thead = $("<thead></thead>");
                var trHead = $("<tr></tr>");
                var tdHead = $("<th></th>");
                tdHead = $("<th></th>");
                tdHead.html("Extension");
                trHead.append(tdHead);
                thead.append(trHead);
                tdHead = $("<th></th>");
                tdHead.html("Options");
                trHead.append(tdHead);
                thead.append(trHead);
                var tbody = $("<tbody></tbody>");
                for (var i = 0; i < extensions.length; i++) {
                    var trBody = $("<tr></tr>");
                    var tdBody = $("<td></td>");
                    tdBody = $("<td></td>");
                    tdBody.html(extensions[i].Extension);
                    trBody.append(tdBody);
                    tdBody = $("<td></td>");
                    var btnEdit = $("<input />");
                    btnEdit.attr("type", "button");
                    btnEdit.addClass("btn btn-primary");
                    btnEdit.attr("data-extension", JSON.stringify(extensions[i]));
                    btnEdit.attr("value", "Edit");
                    btnEdit.click(function (ev) {
                        var data = JSON.parse($(ev.currentTarget).attr("data-extension"));
                        $("#inputExtensionNumberId").val(data.Id);
                        $("#inputExtensionNumber").val(data.Extension);
                        $("#titleControlExtension").html("Edit Extension");
                        $("#inputExtensionNumber").focus();
                    });
                    tdBody.append(btnEdit);
                    var btnDelete = $("<input />");
                    btnDelete.attr("type", "button");
                    btnDelete.addClass("btn btn-danger");
                    btnDelete.css({ "margin-left": "10px" });
                    btnDelete.attr("data-extension", extensions[i].Id);
                    btnDelete.attr("value", "Delete");
                    btnDelete.click(function (ev) {
                        var data = $(ev.currentTarget).attr("data-extension");
                        if (confirm("Do you confirm this action?")) {
                            Services.PBX.DeleteExtension(data, function (success) {
                                alert("The extension was deleted correctly.");
                                _this.BuildFormExtension(idPhone);
                            }, function (error) {
                                alert(error);
                                alert("Error on registration process. Please. Try again");
                                $("#inputExtensionNumber").focus();
                            });
                        }
                    });
                    tdBody.append(btnDelete);
                    trBody.append(tdBody);
                    trBody.append(tdBody);
                    tbody.append(trBody);
                }
                table.append(thead);
                table.append(tbody);
            });
            content.append("<div style='margin-bottom: 10px;margin-top: 30px;'><h2>List Extension</h2></div>");
            content.append(table);
            $("#inputExtensionNumber").focus();
        };
        AdminDevices.prototype.BuildTableConferences = function () {
            var _this = this;
            var content = $("#conferenceTab");
            content.html("");
            var btnAddConference = $("<input />");
            btnAddConference.attr("type", "button");
            btnAddConference.attr("value", "Add Conference");
            btnAddConference.addClass("btn btn-success");
            btnAddConference.css({ "margin-bottom": "10px" });
            btnAddConference.click(function () {
                _this.BuildFormAddConference();
            });
            content.append(btnAddConference);
            Services.PBX.GetConferences(function (success) {
                var conferences = success;
                var table = $("<table></table>");
                table.addClass("table table-striped tableAdminConferences");
                var thead = $("<thead></thead>");
                var trHead = $("<tr></tr>");
                var tdHead = $("<th></th>");
                tdHead.html("Id");
                trHead.append(tdHead);
                thead.append(trHead);
                tdHead = $("<th></th>");
                tdHead.html("Name");
                trHead.append(tdHead);
                thead.append(trHead);
                tdHead = $("<th></th>");
                tdHead.html("Extension");
                trHead.append(tdHead);
                thead.append(trHead);
                tdHead = $("<th></th>");
                tdHead.html("Options");
                trHead.append(tdHead);
                thead.append(trHead);
                var tbody = $("<tbody></tbody>");
                for (var i = 0; i < conferences.length; i++) {
                    var trBody = $("<tr></tr>");
                    var tdBody = $("<td></td>");
                    tdBody.html(conferences[i].Id.toString());
                    trBody.append(tdBody);
                    tdBody = $("<td></td>");
                    tdBody.html(conferences[i].Name);
                    trBody.append(tdBody);
                    tdBody = $("<td></td>");
                    tdBody.html(conferences[i].Extension);
                    trBody.append(tdBody);
                    tdBody = $("<td></td>");
                    var btnEdit = $("<input />");
                    btnEdit.attr("type", "button");
                    btnEdit.addClass("btn btn-primary");
                    btnEdit.attr("value", "Edit");
                    btnEdit.attr("data-conference", JSON.stringify(conferences[i]));
                    btnEdit.click(function (ev) {
                        var data = JSON.parse($(ev.currentTarget).attr("data-conference"));
                        _this.BuildFormEditConference(data);
                    });
                    tdBody.append(btnEdit);
                    var btnDelete = $("<input />");
                    btnDelete.attr("type", "button");
                    btnDelete.addClass("btn btn-danger");
                    btnDelete.css({ "margin-left": "10px" });
                    btnDelete.attr("value", "Delete");
                    btnDelete.attr("data-conferenceId", conferences[i].Id);
                    btnDelete.click(function (ev) {
                        var conferenceId = $(ev.currentTarget).attr("data-conferenceId");
                        if (confirm("Do you confirm this action?")) {
                            Services.PBX.DeleteConference(conferenceId, function (success) {
                                alert("The conference was deleted correctly.");
                                _this.BuildTableConferences();
                            }, function (error) {
                                alert(error);
                                alert("Error on deleting process. Please. Try again");
                            });
                        }
                    });
                    tdBody.append(btnDelete);
                    trBody.append(tdBody);
                    trBody.append(tdBody);
                    tbody.append(trBody);
                }
                table.append(thead);
                table.append(tbody);
                content.append(table);
            }, function (error) {
            });
        };
        AdminDevices.prototype.UpdateSip = function () {
            Services.PBX.UpdateSip(function (success) {
            }, function (error) {
            });
        };
        AdminDevices.prototype.UpdateDialplan = function () {
            Services.PBX.UpdateDialplan(function (success) {
            }, function (error) {
            });
        };
        AdminDevices.prototype.SearchExtensionInIpPhone = function (extensions, ipPhone) {
            if (extensions.length > 0) {
                for (var i = 0; i < extensions.length; i++) {
                    if (extensions[i].IdIpPhone == ipPhone)
                        return { index: i, found: true };
                }
            }
            return { index: -1, found: false };
        };
        AdminDevices.prototype.GetExtensionIpPhones = function (iphonesRef, functionBack) {
            var _this = this;
            if (functionBack === void 0) { functionBack = null; }
            Services.PBX.GetExtensions(function (success) {
                var extensions = success;
                var extensionForIp = new Array();
                for (var i = 0; i < extensions.length; i++) {
                    var search = _this.SearchExtensionInIpPhone(extensionForIp, extensions[i].IdIpPhone);
                    if (!search.found) {
                        if (search.index == -1) {
                            var arrayExtensions = new Array();
                            arrayExtensions.push(extensions[i]);
                            var exts = new ExtensionForIPhone();
                            exts.IdIpPhone = extensions[i].IdIpPhone;
                            exts.Extensions = arrayExtensions;
                            extensionForIp.push(exts);
                        }
                    }
                    else {
                        var extIphones = extensionForIp[search.index].Extensions;
                        extIphones.push(extensions[i]);
                    }
                }
                if (functionBack != null) {
                    functionBack(extensionForIp);
                }
                else {
                    for (var j = 0; j < iphonesRef.length; j++) {
                        $("#ipPhoneExtension_" + iphonesRef[j].Id).removeClass();
                        var search = _this.SearchExtensionInIpPhone(extensionForIp, iphonesRef[j].Id);
                        if (search.found) {
                            var extensionsNumber = Array();
                            var extensionIe = extensionForIp[search.index].Extensions;
                            for (var k = 0; k < extensionIe.length; k++) {
                                extensionsNumber.push(extensionIe[k].Extension);
                            }
                            $("#ipPhoneExtension_" + iphonesRef[j].Id).html(extensionsNumber.join(","));
                        }
                    }
                }
            }, function (error) {
            });
        };
        AdminDevices.prototype.GetIpPhonesStatus = function () {
            var _this = this;
            Services.PBX.GetIpPhonesStatus(function (success) {
                _this.IpPhonesStatus = success;
                for (var i = 0; i < _this.IpPhonesStatus.length; i++) {
                    $("#ipPhone_" + _this.IpPhonesStatus[i].Id).removeClass();
                    if (_this.IpPhonesStatus[i].IsConnected)
                        $("#ipPhone_" + _this.IpPhonesStatus[i].Id).addClass("blink-layer circle-green");
                    else
                        $("#ipPhone_" + _this.IpPhonesStatus[i].Id).addClass("blink-layer circle-red");
                }
            }, function (error) {
            });
        };
        return AdminDevices;
    }());
    devices.AdminDevices = AdminDevices;
})(devices || (devices = {}));
