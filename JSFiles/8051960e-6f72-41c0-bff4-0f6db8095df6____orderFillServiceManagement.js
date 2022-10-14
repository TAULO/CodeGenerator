/*globals $, console, define */
"use strict";
define(['common', 'orderFillServiceManagementDataAccess', 'htmlHelper', 'addClearingFirmAccountToClearingFirm', 'addTradeAccountToUser'], function (common, dataAccess, htmlHelper, addClearingFirmAccounts, addTradeAccountToUser) {
    var result,
        wantReadOnlyView,
        currentMappingsfilter = { provider: '', username: '' },
        getCurrentMappingsFilter = function () {
            var username, provider;
            provider = $('#filterOfsSelect').val();
            username = $('#filterUsernamesSelect').val();
            return { provider: provider, username: username };
        },
        currentExemptionsFilter = { provider: '', username: '' },
        getCurrentExemptionsFilter = function () {
            var username, provider;
            provider = $('#filterOfsSelectExemptions').val();
            username = $('#filterUsernamesSelectExemptions').val();
            return { provider: provider, username: username };
        },
        showMappingControls = function () {
            $('#mappingsSummary').show();
            $('#tradeAccountMappings').fadeIn('slow');
        },
        hideMappingControls = function () {
            $('#mappingsSummary').hide();
            $('#addMappingControls').hide();
            $('#tradeAccountMappings').hide();
        },
        showExemptionControls = function () {
            $('#exemptionsSummary').show();
            $('#tradeAccountExemptions').fadeIn('slow');
        },
        hideExemptionControls = function () {
            $('#exemptionsSummary').hide();
            $('#addExemptionControls').hide();
            $('#tradeAccountExemptions').hide();
        },
        showCreateButtons = function () {
            $('#showAddMappingControlsImage').show();
            $('#showAddAccountToClearingFirmControlsImage').show();
            $('#showAddTradeAccountToUserControlsImage').show();
        },
        hideCreateButtons = function () {
            $('#showAddMappingControlsImage').hide();
            $('#showAddAccountToClearingFirmControlsImage').hide();
            $('#showAddTradeAccountToUserControlsImage').hide();
        },
        setMappingsTabActive = function () {
            $('#titleContainer').text("Manage Mappings");
            $('#navigation').show();
            $("#mappingsTab").css({
                "background-color": "rgb(233, 231, 231)",
                "color": "black"
            });
            $("#exemptionsTab").css({
                "background-color": "transparent",
                "color": "dimgray"
            });
        },
        setExemptionsTabActive = function () {
            $('#titleContainer').text("Manage Exemptions");
            $('#navigation').show();
            $("#exemptionsTab").css({
                "background-color": "rgb(233, 231, 231)",
                "color": "black"
            });
            $("#mappingsTab").css({
                "background-color": "transparent",
                "color": "dimgray"
            });
        },
        cancelAddMapping = function () {
            $('#addMappingControls').slideUp('slow');
        },
        showMappingsView = function () {
            hideExemptionControls();
            showCreateButtons();
            setMappingsTabActive();
            showMappingControls();
            common.disablePopup();
        },
        showExemptionsView = function (callback, exemption) {
            $('#addExemptionControls').hide();
            $('#addClearingFirmAccountToClearingFirmContainer').slideUp('slow');
            addTradeAccountToUser.hideMain();
            hideMappingControls();
            hideCreateButtons();
            setExemptionsTabActive();
            showExemptionControls();
            if (callback) {
                callback(exemption);
            }
        },
        canCreateEditOrDeleteExemption = function (provider) {
            return provider.toLowerCase() === 'ice' || provider.toLowerCase() === 'cme';
        },
        canSaveMapping = function () {
            var basicSaveCriteria = common.trimmedValueIsNullOrEmpty($('#ofsProvidersSelect')) === false &&
                common.trimmedValueIsNullOrEmpty($('#usernamesSelect')) === false &&
                common.trimmedValueIsNullOrEmpty($('#internalTradeAccountsSelect')) === false &&
                common.trimmedValueIsNullOrEmpty($('#clearingFirmsSelect')) === false &&
                common.trimmedValueIsNullOrEmpty($('#fcmAccountsSelect')) === false;
            return basicSaveCriteria;
        },
        addRowToExemptionsTable = function (exemption) {
            var found, row, userProviderRows, userRows, usernamesSelect, usernames, firstGreaterUsername, option;
            found = findExemptionRow(exemption);
            if (found) {
                highlightExemptionRow(found);
                return;
            }
            row = createExemptionRow(exemption, false);
            userProviderRows = findExemptionRowsForUserAndProvider(exemption.Username, exemption.Provider);
            if (userProviderRows.length > 0) {
                userProviderRows.first().after(row);
                highlightExemptionRow(row);
                return;
            }
            userRows = findExemptionRowsForUser(exemption.Username);
            if (userRows.length > 0) {
                userRows.first().after(row);
                highlightExemptionRow(row);
                return;
            }
            showRowSeparator(row, true);
            usernamesSelect = $('#filterUsernamesSelectExemptions');
            usernames = htmlHelper.getSelectValues(usernamesSelect);
            firstGreaterUsername = common.getFirstGreaterValue(exemption.Username, usernames);
            option = usernamesSelect.find('option[value="' + firstGreaterUsername + '"]');
            option.before(htmlHelper.createOption(exemption.Username, exemption.Username));
            if (firstGreaterUsername) {
                userRows = findExemptionRowsForUser(firstGreaterUsername);
                if (userRows.length > 0) {
                    userRows.first().before(row);
                    highlightExemptionRow(row);
                    filterByOfsAndUsernameExemptions();
                    return;
                }
            }
            $('#tradeAccountExemptionsTable').append(row);
            highlightExemptionRow(row);
            filterByOfsAndUsernameExemptions();
        },
        createExemptionCallback = function (position, exemption) {
            var updateExemptionControls = function () {
                showExemptionsView(addRowToExemptionsTable, exemption);
            };
            return function (response) {
                if (!response.Success) {
                    common.showToaster(target, "The exemption was not created.", 0, 25, true, null, 1000);
                    return;
                }
                currentExemptionsFilter = getCurrentExemptionsFilter();
                if (response.Success) {
                    common.showToaster(null, "Exemption created.", position.top, position.left + 25, false, null, 500, updateExemptionControls);
                }
            };
        },
        deleteExemption = function (evt) {
            var proceed, target, row, isvID, isvIDValue, sourceSessionId, sourceSessionIdValue, position, exemption;
            target = $(this);
            row = target.parents('tr');
            position = common.getMouseCoordinates(evt);
            isvIDValue = row.find('td.isvID').text();
            isvID = isvIDValue && isvIDValue.length > 0 ? isvIDValue : 0;
            sourceSessionIdValue = row.find('td.sourceSessionID').text();
            sourceSessionId = sourceSessionIdValue && sourceSessionIdValue.length > 0 ? sourceSessionIdValue : '';
            exemption = {
                Provider: row.find('td.provider').text(),
                Username: row.find('td.username').text(),
                InternalTradeAccount: row.find('td.internalTradeAccount').text(),
                ExternalTradeAccountID: row.find('td.externalTradeAccountID').text(),
                ClearingFirm: row.find('td.clearingFirm').text(),
                IsvID: isvID,
                SourceSessionID: sourceSessionId
            },
            proceed = function () {
                dataAccess.deleteOrderFillServiceUserTradeAccountExemption(exemption, deleteExemptionCallback(position, exemption));
            };
            common.confirmDialog($("#confirmDialog"), "<p/><p/><p>Are you sure you want to delete this exemption?", "Delete exemption</p>", position.Y, position.X, proceed);
        },
        appendDeleteExemptionImage = function (cell) {
            var image = $('#deleteMappingExemptionImage').clone();
            image.removeAttr('id');
            image.addClass('deleteMappingExemptionImage');
            image.attr('title', 'Delete exemption');
            image.click(deleteExemption);
            cell.append(image);
        },
        intializeMappingsTable = function (callback) {
            var table = $('#tradeAccountMappingsTable');
            table.empty();
            table.append(createMappingsHeader());
            callback();
        },
        deleteExemptionCallback = function (position, exemption) {
            var message,
                updateExemptionControls = function () {
                    showExemptionsView(deleteRowFromExemptionsTable, exemption);
                    //deleteRowFromExemptionsTable(exemption);
                };
            return function (response) {
                if (!response.Success) {
                    common.showToaster(null, "The exemption was not deleted.", position.top, position.left + 25, true, null, 1000);
                    return;
                }
                currentExemptionsFilter = getCurrentExemptionsFilter();
                if (response.Success) {
                    message = "Exemption deleted.";
                    common.showToaster(null, message, position.Y, position.X + 25, false, null, 500, updateExemptionControls);
                }
            };
        },
        deleteMappingCallback = function (position, mapping) {
            var message,
                updateMappingControls = function () {
                    deleteRowFromMappingsTable(mapping);
                    initializeCreateMappingSelects();
                    cancelAddMapping();
                };
            return function (response) {
                if (!response.Success) {
                    common.showToaster(null, "The mapping was not deleted.", position.top, position.left + 25, true, null, 1000);
                    return;
                }
                currentMappingsfilter = getCurrentMappingsFilter();
                if (response.Success) {
                    message = "The mapping was deleted.";
                    common.showToaster(null, message, position.top, position.left + 25, false, null, 1000, updateMappingControls);
                }
            };
        },
        deleteMapping = function () {
            var target, position, row, mapping, confirmDeleteMapping, message, proceed;
            target = $(this);
            position = target.position();
            row = target.parents('tr');
            mapping = {
                Provider: row.find('td.provider').text(),
                Username: row.find('td.username').text(),
                InternalTradeAccount: row.find('td.internalTradeAccount').text(),
                ClearingFirm: row.find('td.clearingFirm').text(),
                ExternalTradeAccountID: row.find('td.externalTradeAccountID').text(),
                Extension: row.find('td.extension').text()
            };
            confirmDeleteMapping = function (response) {
                if (response.Success && response.Payload.length > 0) {
                    message = "This mapping has an exemption. Delete the exemption first.";
                    common.showToaster(target, message, 0, 25, true, null, 1500);
                    return;
                }
                proceed = function () {
                    dataAccess.deleteOrderFillServiceUserTradeAccountMapping(mapping, deleteMappingCallback(position, mapping));
                };
                common.confirmDialog($("#confirmDialog"), "<p/><p/><p>Are you sure you want to delete this mapping?", "Delete Mapping</p>", position.top, position.left, proceed);
            };
            dataAccess.orderFillServiceUserTradeAccountSystemExemptionExists(mapping, confirmDeleteMapping);
        },
        appendDeleteMappingImage = function (cell) {
            var image = $('#deleteMappingExemptionImage').clone();
            image.addClass('deleteMappingExemptionImage');
            image.addClass('toggleable');
            image.attr('title', 'Delete this mapping');
            image.click(deleteMapping);
            cell.append(image);
        },
        appendDeriveExemptionFromMappingImage = function (cell, clickCallback) {
            var image = $('#deriveExemptionFromMappingImage').clone();
            image.removeClass('addButton');
            image.addClass('deriveExemptionFromMappingsImage');
            image.addClass('toggleable');
            image.attr('id', 'deriveExemptionFromMappingsImage');
            image.attr('title', 'Create an exemption for this mapping');
            image.click(clickCallback);
            cell.append(image);
        },
        appendEditMappingImage = function (cell, clickCallback) {
            var image = $('#editMappingImage').clone();
            image.addClass('toggleable');
            image.attr('title', 'Edit the extension for this mapping');
            image.click(clickCallback);
            cell.append(image);
        },
        appendSaveEditMappingImage = function (cell, clickCallback) {
            var image = $('#saveEditMappingImage').clone();
            image.removeAttr("id");
            image.addClass('saveEditMappingImage');
            image.attr('title', 'Update this mapping');
            image.click(clickCallback);
            cell.append(image);
        },
        toggleExemptionSelects = function (shouldShow) {
            $('#isvs').toggle(shouldShow);
            $('#sourceSessions').toggle(shouldShow);
        },
        fillExemptionSelects = function (response) {
            var isvIds, isvsHash, isvsSelect, sourceSessionSelect, sourceSessions, text;
            isvIds = [];
            isvsHash = [];
            isvsSelect = $('#isvsSelect');
            sourceSessionSelect = $('#sourceSessionSelect');
            htmlHelper.initializeSelect(sourceSessionSelect, 'Select a session');
            htmlHelper.initializeSelect(isvsSelect, 'Select an ISV');
            if (response.Success && response.Payload && response.Payload.length > 0) {
                sourceSessions = response.Payload;
                sourceSessions.forEach(function (sourceSession) {
                    if (isvIds.indexOf(sourceSession.ISVID) === -1) {
                        isvIds.push(sourceSession.ISVID);
                        isvsHash.push({ Key: sourceSession.ISVID, Value: sourceSession.ISV });
                    }
                    text = sourceSession.SourceSessionID + '  |  ' + sourceSession.ISV + '  |  ' + sourceSession.TraderID + '  |  ' + sourceSession.EntityName;
                    sourceSessionSelect.append(htmlHelper.createOption(text, sourceSession.SourceSessionID));
                });
                htmlHelper.fillSelectFromKeyValuePairs(isvsSelect, 'Select an ISV', isvsHash);
            }
        },
        populateExemptionControls = function (row) {
            var provider = row.find('td.provider').text(),
                username = row.find('td.username').text(),
                providerDescription = row.find('td.providerDescription').text(),
                internalTradeAccount = row.find('td.internalTradeAccount').text(),
                clearingFirm = row.find('td.clearingFirm').text(),
                externalTradeAccount = row.find('td.externalTradeAccount').text(),
                extension = row.find('td input.extension').val(),
                externalTradeAccountID = row.find('td.externalTradeAccountID').text(),
                shouldShowExemptionSelects = provider.toLowerCase() === 'cme';
            $('#providerHidden').val(provider);
            $('#ofsProviderLabel').text(providerDescription);
            $('#usernameLabel').text(username);
            $('#internalTradeAccountLabel').text(internalTradeAccount);
            $('#clearingFirmLabel').text(clearingFirm);
            $('#fcmAccountLabel').text(externalTradeAccount);
            $('#extensionLabel').text(extension);
            $('#externalTraderAccountIDHidden').val(externalTradeAccountID);
            toggleExemptionSelects(shouldShowExemptionSelects);
            if (shouldShowExemptionSelects) {
                $('#exemptionSelects').show();
                $('#addExemptionButtons').appendTo($('#exemptionSelects'));
                dataAccess.getCmeSourceSessionsByClearingFirm(clearingFirm, fillExemptionSelects);
            } else {
                $('#exemptionSelects').hide();
                $('#addExemptionButtons').appendTo($('#exemptionLabels'));
            }
        },
        deriveExemptionFromMapping = function () {
            var row;
            row = $(this).parents('tr');
            populateExemptionControls(row);
            $('#addMappingControls').hide();
            $('#addExemptionControls').show();
            $('#tradeAccountMappings').hide();
            $('#navigation').hide();
        },
        hideEditMapping = function (row) {
            var input, label;
            $('.saveEditMappingImage').removeClass('activeEdit');
            $('.saveEditMappingImage').hide();
            input = row.find('td > input.extension');
            label = row.find("label");
            input.val(label.text());
            input.hide();
            label.show();
        },
        showEditMapping = function () {
            var image, row, input, label;
            row = $(this).parents('tr');
            input = row.find('td > input.extension');
            label = row.find("label");
            label.hide();
            common.focusAndSelect(input);
            image = row.find('img.saveEditMappingImage');
            image.addClass('activeEdit');
            image.show();
        },
        filterByOfsAndUsername = function () {
            var rows, filter;
            filter = getCurrentMappingsFilter();
            if (filter.provider === '' && filter.username === '') {
                rows = $('.orderFillServiceMappingsRow');
                rows.show();
                resetRowSeparators(rows);
                return;
            }
            $('.orderFillServiceMappingsRow').hide();
            if (filter.provider === '') {
                rows = $('.orderFillServiceMappingsRow.' + filter.username);
                rows.show();
                resetRowSeparators(rows);
                return;
            }
            if (filter.username === '') {
                rows = $('.orderFillServiceMappingsRow.' + filter.provider);
                rows.show();
                resetRowSeparators(rows);
                return;
            }
            rows = $('.orderFillServiceMappingsRow.' + filter.provider + '.' + filter.username);
            rows.show();
            resetRowSeparators(rows);
        },
        createMappingsHeader = function () {
            var header, ofsCell, traderCell, filterOfsSelect, filterUsernamesSelect;
            header = htmlHelper.createRow("orderFillServiceMappingsHeader");
            htmlHelper.appendCell(header, "Provider", 0, true);
            htmlHelper.appendCell(header, "ExternalTradeAccountId", 0, true);
            traderCell = htmlHelper.appendCell(header, "Trader", 80, true, "username");
            filterUsernamesSelect = htmlHelper.createSelect('filterUsernamesSelect', '', 'Select a user name', 'All');
            filterUsernamesSelect.change(filterByOfsAndUsername);
            traderCell.append(filterUsernamesSelect);
            ofsCell = htmlHelper.appendCell(header, "OFS", 50, true, "ofsProvider");
            filterOfsSelect = htmlHelper.createSelect('filterOfsSelect', '', 'Select an order fill service', 'All');
            filterOfsSelect.change(filterByOfsAndUsername);
            ofsCell.append(filterOfsSelect);
            htmlHelper.appendCell(header, "Fill Account", 80, true);
            htmlHelper.appendCell(header, "Clearing Firm", 100, true);
            htmlHelper.appendCell(header, "FCM Account", 100, true);
            htmlHelper.appendCell(header, "Extension", 130, true);
            htmlHelper.appendCell(header, null, 150, true);
            return header;
        },
        findExemptionRowsForUser = function (username) {
            return $('.orderFillServiceExemptionsRow.' + username);
        },
        findExemptionRowsForUserAndProvider = function (username, provider) {
            return $('.orderFillServiceExemptionsRow.' + username + '.' + provider);
        },
        findMappingRowsForUser = function (username) {
            return $('.orderFillServiceMappingsRow.' + username);
        },
        findMappingRowsForUserAndProvider = function (username, provider) {
            return $('.orderFillServiceMappingsRow.' + username + '.' + provider);
        },
        findExemptionRow = function (exemption) {
            var row, internalTradeAccount, externalTradeAccountID, clearingFirm, isvID, sourceSessionID, rows;
            rows = [];
            var exemptionRows = findExemptionRowsForUserAndProvider(exemption.Username, exemption.Provider);
            exemptionRows.each(function () {
                row = $(this);
                internalTradeAccount = row.find('td.internalTradeAccount').text();
                externalTradeAccountID = row.find('td.externalTradeAccountID').text();
                clearingFirm = row.find('td.clearingFirm').text();
                isvID = row.find('td.isvID').text();
                sourceSessionID = row.find('td.sourceSessionID').text();
                if (internalTradeAccount === exemption.InternalTradeAccount &&
                    externalTradeAccountID === String(exemption.ExternalTradeAccountID) &&
                    clearingFirm === exemption.ClearingFirm &&
                   ((isvID.length === 0 && sourceSessionID.length === 0) ||
                       isvID === exemption.IsvID ||
                       sourceSessionID === exemption.SourceSessionID)) {
                    rows.push(row);
                }
            });
            if (rows.length > 1) {
                throw ("DuplicateRowsError");
            }
            if (rows.length === 1) {
                return rows[0];
            }
            return null;
        },
        findMappingRow = function (mapping) {
            var row, internalTradeAccount, externalTradeAccountID, clearingFirm, extension, rows;
            rows = [];
            findMappingRowsForUserAndProvider(mapping.Username, mapping.Provider).each(function () {
                row = $(this);
                internalTradeAccount = row.find('td.internalTradeAccount').text();
                externalTradeAccountID = row.find('td.externalTradeAccountID').text();
                clearingFirm = row.find('td.clearingFirm').text();
                extension = row.find('td.extension').text();
                if (internalTradeAccount === mapping.InternalTradeAccount &&
                    externalTradeAccountID === String(mapping.ExternalTradeAccountID) &&
                    clearingFirm === mapping.ClearingFirm &&
                    extension === mapping.Extension) {
                    rows.push(row);
                }
            });
            if (rows.length > 1) {
                throw ("DuplicateRowsError");
            }
            if (rows.length === 1) {
                return rows[0];
            }
            return null;
        },
        highlightExemptionRow = function (row) {
            row.css('background-color', 'aliceblue');
            $('html, body').animate({
                scrollTop: row.offset().top - 768
            }, 1000);
            setTimeout(function () { row.css('background-color', '#F9F9CE'); }, 6000);
        },
        highlightMappingRow = function (row) {
            row.css('background-color', '#F9F9CE');
            $('html, body').animate({
                scrollTop: row.offset().top - 768
            }, 1000);
            setTimeout(function () { row.css('background-color', 'aliceblue'); }, 6000);
        },
        deleteRowFromExemptionsTable = function (exemption) {
            var userRows, found, usernamesSelect, option;
            found = findExemptionRow(exemption);
            if (found) {
                userRows = findExemptionRowsForUser(exemption.Username);
                if (userRows.length === 1) {
                    usernamesSelect = $('#filterUsernamesSelectExemptions');
                    option = usernamesSelect.find('option[value="' + exemption.Username + '"]');
                    option.remove();
                }
                found.remove();
                filterByOfsAndUsernameExemptions();
            }
        },
        deleteRowFromMappingsTable = function (mapping) {
            var userRows, found, usernamesSelect, option;
            found = findMappingRow(mapping);
            if (found) {
                userRows = findMappingRowsForUser(mapping.Username);
                if (userRows.length === 1) {
                    usernamesSelect = $('#filterUsernamesSelect');
                    option = usernamesSelect.find('option[value="' + mapping.Username + '"]');
                    option.remove();
                }
                found.remove();
                filterByOfsAndUsername();
            }
        },
        updateMappingsTableRow = function (mapping) {
            var found = findMappingRow(mapping);
            if (found) {
                found.find("label").text(mapping.Extension);
                hideEditMapping(found);
                highlightMappingRow(found);
            }
        },
        addRowToMappingsTable = function (mapping) {
            var row, userProviderRows, userRows, found, usernames, firstGreaterUsername, usernamesSelect, option, visibleRows;
            found = findMappingRow(mapping);
            if (found && mapping.Extension) {
                found.find('input[type="text"]').val(mapping.Extension);
                found.find("label").text(mapping.Extension);
                highlightMappingRow(found);
                return;
            }
            row = createMappingRow(mapping, false);
            userProviderRows = findMappingRowsForUserAndProvider(mapping.Username, mapping.Provider);
            if (userProviderRows.length > 0) {
                userProviderRows.first().after(row);
                highlightMappingRow(row);
                return;
            }
            userRows = findMappingRowsForUser(mapping.Username);
            if (userRows.length > 0) {
                visibleRows = userRows.filter(':visible');
                showRowSeparator(row, visibleRows.length === 0);
                userRows.first().after(row);
                highlightMappingRow(row);
                return;
            }
            showRowSeparator(row, true);
            usernamesSelect = $('#filterUsernamesSelect');
            usernames = htmlHelper.getSelectValues(usernamesSelect);
            firstGreaterUsername = common.getFirstGreaterValue(mapping.Username, usernames);
            option = usernamesSelect.find('option[value="' + firstGreaterUsername + '"]');
            option.before(htmlHelper.createOption(mapping.Username, mapping.Username));
            if (firstGreaterUsername) {
                userRows = findMappingRowsForUser(firstGreaterUsername);
                if (userRows.length > 0) {
                    userRows.first().before(row);
                    highlightMappingRow(row);
                    filterByOfsAndUsername();
                    return;
                }
            }
            $('#tradeAccountMappingsTable').append(row);
            highlightMappingRow(row);
            filterByOfsAndUsername();
        },
        updateMappingCallback = function (position, mapping) {
            var updateMappingControls = function () {
                updateMappingsTableRow(mapping);
            };
            return function (response) {
                if (!response.Success) {
                    common.showToaster(target, "The extension was not updated.", 0, 25, true, null, 1000);
                    return;
                }
                currentMappingsfilter = getCurrentMappingsFilter();
                if (response.Success) {
                    common.showToaster(null, "Extension updated.", position.top, position.left + 25, false, null, 500, updateMappingControls);
                }
            };
        },
        createMappingCallback = function (target, mapping) {
            var updateMappingControls = function () {
                addRowToMappingsTable(mapping);
                initializeCreateMappingSelects();
                cancelAddMapping();
            };
            return function (response) {
                if (!response.Success) {
                    common.showToaster(target, "The mapping was not created.", 0, 25, true, null, 1000);
                    return;
                }
                currentMappingsfilter = getCurrentMappingsFilter();
                if (response.Success) {
                    common.showToaster(target, "Mapping created.", 0, 25, false, null, 1000, updateMappingControls);
                }
            };
        },
        updateMapping = function () {
            var row, mapping, position;
            position = $('.saveEditMappingImage.activeEdit').position();
            row = $(this).parents('tr');
            mapping = {
                Provider: row.find('td.provider').text(),
                Username: row.find('td.username').text(),
                InternalTradeAccount: row.find('td.internalTradeAccount').text(),
                ClearingFirm: row.find('td.clearingFirm').text(),
                Extension: row.find('td input.extension').val(),
                ExternalTradeAccountID: row.find('td.externalTradeAccountID').text()
            };
            dataAccess.createOrderFillServiceUserTradeAccountMapping(mapping, updateMappingCallback(position, mapping));
            return false;
        },
        createMapping = function () {
            var target = $('#addMappingImage'),
                 mapping = {
                     Provider: $('#ofsProvidersSelect').val(),
                     ProviderDescription: $('#ofsProvidersSelect option:selected').text(),
                     Username: $('#usernamesSelect').val(),
                     InternalTradeAccount: $('#internalTradeAccountsSelect').val(),
                     ClearingFirm: $('#clearingFirmsSelect').val(),
                     Extension: $('#extensionInput').val(),
                     ExternalTradeAccountID: $('#fcmAccountsSelect').val(),
                     ExternalTradeAccount: $('#fcmAccountsSelect option:selected').text()
                 };
            dataAccess.createOrderFillServiceUserTradeAccountMapping(mapping, createMappingCallback(target, mapping));
            return false;
        },
        validateSave = function () {
            var addMappingImage = $('#addMappingImage');
            addMappingImage.unbind('click');
            if (canSaveMapping()) {
                common.enableControl(addMappingImage);
                addMappingImage.click(createMapping);
                return;
            }
            common.disableControl(addMappingImage);
        },
        initializeCreateMappingSelects = function () {
            $('#ofsProvidersSelect').val('');
            $('#usernamesSelect').val('');
            htmlHelper.initializeSelect($('#internalTradeAccountsSelect'), 'Select an internal trade account');
            htmlHelper.initializeSelect($('#clearingFirmsSelect'), 'Select a clearing firm');
            htmlHelper.initializeSelect($('#fcmAccountsSelect'), 'Select an FCM account');
            $('#extensionInput').val('');
            validateSave();
        },
        applyCurrentMappingsFilter = function () {
            $('#filterOfsSelect').val(currentMappingsfilter.provider);
            $('#filterUsernamesSelect').val(currentMappingsfilter.username);
            filterByOfsAndUsername();
        },
        resetRowSeparators = function (rows) {
            var row, previousRow, username, previousUsername, i;
            if (!rows || rows.length < 2) {
                return;
            }
            for (i = 0; i < rows.length; i++) {
                row = $(rows[i]);
                if (i === 0) {
                    showRowSeparator(row, true);
                } else {
                    previousRow = $(rows[i - 1]);
                    previousUsername = previousRow.attr('class').split(/\s+/)[2];
                    username = row.attr('class').split(/\s+/)[2];
                    showRowSeparator(row, username !== previousUsername);
                }
            }
        },
        fillMappingFilterSelects = function (mappings) {
            var kvp, found, i, usernames = [], providers = [];
            mappings.forEach(function (mapping) {
                if (usernames.indexOf(mapping.Username) < 0) {
                    usernames.push(mapping.Username);
                }
                kvp = { Key: mapping.Provider, Value: mapping.ProviderDescription };
                found = false;
                for (i = 0; i < providers.length; i += 1) {
                    if (providers[i].Key === kvp.Key) {
                        found = true;
                    }
                }
                if (!found) {
                    providers.push(kvp);
                }
            });
            htmlHelper.fillSelectFromKeyValuePairs($('#filterOfsSelect'), 'filter by ofs', providers, "All");
            htmlHelper.fillSelectFromList($('#filterUsernamesSelect'), 'filter by user name', usernames, "All");
            applyCurrentMappingsFilter();
        },
        showRowSeparator = function (row, show) {
            row.css('border-top', show ? '1px solid lightblue' : '0');
            if (show) {
                row.find('td.username').removeClass('hideMappingUsername');
                return;
            }
            row.find('td.username').addClass('hideMappingUsername');
        },
        createMappingRow = function (mapping, showSeparator) {
            var row, actionsCell, textInput, label;
            row = htmlHelper.createRow('orderFillServiceMappingsRow');
            htmlHelper.appendCell(row, mapping.Provider, 0, false, "provider");
            htmlHelper.appendCell(row, mapping.ExternalTradeAccountID, 0, false, "externalTradeAccountID");
            htmlHelper.appendCell(row, mapping.Username, 80, false, "username");
            showRowSeparator(row, showSeparator);
            htmlHelper.appendCell(row, mapping.ProviderDescription, 50, false, "providerDescription");
            htmlHelper.appendCell(row, mapping.InternalTradeAccount, 80, false, "internalTradeAccount");
            htmlHelper.appendCell(row, mapping.ClearingFirm, 100, false, "clearingFirm");
            htmlHelper.appendCell(row, mapping.ExternalTradeAccount, 100, false, "externalTradeAccount");
            textInput = htmlHelper.createTextInput(null, mapping.Extension, 30, "extension", "extension");
            label = htmlHelper.createLabel(mapping.Extension, 'readonly');
            htmlHelper.appendReadWriteCell(row, 130, textInput, 130 - 3, label, "extension");
            actionsCell = htmlHelper.appendCell(row, null, 150, false, "actions");
            if (canCreateEditOrDeleteExemption(mapping.Provider)) {
                appendSaveEditMappingImage(actionsCell, updateMapping);
                appendEditMappingImage(actionsCell, showEditMapping);
                appendDeriveExemptionFromMappingImage(actionsCell, deriveExemptionFromMapping);
                appendDeleteMappingImage(actionsCell);
            }
            row.hover(function () {
                $(this).find('td').css('background-color', 'gainsboro');
                $(this).find('td.actions').css('border-left', '2px solid yellow');
                $(this).find('img.toggleable').show();
            }, function () {
                $(this).find('td').css('background-color', '');
                $(this).find('td.actions').css('border-left', '0');
                $(this).find('img.toggleable').hide();
                hideEditMapping($(this));
            });
            row.addClass(mapping.Provider);
            row.addClass(mapping.Username);
            return row;
        },
        displaySummary = function (caption, target, summary) {
            var container, header, item;
            container = htmlHelper.createContainer(null, 'mappingsExemptionsSummaryContainer');
            header = htmlHelper.createLabel(caption, 'mappingsExemptionsSummaryHeader');
            container.append(header);
            for (var prop in summary) {
                item = htmlHelper.createLabel(prop + ' : ' + summary[prop], 'mappingsExemptionsSummaryItem');
                container.append(item);
            }
            target.html(container);
        },
        populateMappingsTable = function (response) {
            var mappings, table, username, showSeparator, summary;
            table = $('#tradeAccountMappingsTable');
            mappings = response.Payload;
            if (response.Success && mappings) {
                username = '';
                summary = {};
                mappings.forEach(function (mapping) {
                    showSeparator = false;
                    if (!summary[mapping.Provider]) {
                        summary[mapping.Provider] = 1;
                    } else {
                        summary[mapping.Provider] += 1;
                    }
                    if (username !== mapping.Username) {
                        username = mapping.Username;
                        showSeparator = true;
                    }
                    table.append(createMappingRow(mapping, showSeparator));
                });
                displaySummary("Mappings Summary: ", $('#mappingsSummary'), summary);
                fillMappingFilterSelects(mappings); //TODO: move into main loop
                showMappingsView();
            }
        },
        fillMappingsTable = function () {
            dataAccess.getOrderFillServiceUserTradeAccounts(populateMappingsTable);
        },
        filterByOfsAndUsernameExemptions = function () {
            var filter = getCurrentExemptionsFilter();
            if (filter.provider === '' && filter.username === '') {
                $('.orderFillServiceExemptionsRow').show();
                return;
            }
            $('.orderFillServiceExemptionsRow').hide();
            if (filter.provider === '') {
                $('.orderFillServiceExemptionsRow.' + filter.username).show();
                return;
            }
            if (filter.username === '') {
                $('.orderFillServiceExemptionsRow.' + filter.provider).show();
                return;
            }
            $('.orderFillServiceExemptionsRow.' + filter.provider + '.' + filter.username).show();
        },
        applyCurrentExemptionsFilter = function () {
            $('#filterOfsSelectExemptions').val(currentExemptionsFilter.provider);
            $('#filterUsernamesSelectExemptions').val(currentExemptionsFilter.username);
            filterByOfsAndUsernameExemptions();
        },
        fillExemptionFilterSelects = function (exemptions) {
            var kvp, found, i, usernames = [], providers = [];
            exemptions.forEach(function (exemption) {
                if (usernames.indexOf(exemption.Username) < 0) {
                    usernames.push(exemption.Username);
                }
                kvp = { Key: exemption.Provider, Value: exemption.ProviderDescription };
                found = false;
                for (i = 0; i < providers.length; i += 1) {
                    if (providers[i].Key === kvp.Key) {
                        found = true;
                    }
                }
                if (!found) {
                    providers.push(kvp);
                }
            });
            htmlHelper.fillSelectFromKeyValuePairs($('#filterOfsSelectExemptions'), 'filter by ofs', providers, "All");
            htmlHelper.fillSelectFromList($('#filterUsernamesSelectExemptions'), 'filter by user name', usernames, "All");
            applyCurrentExemptionsFilter();
        },
        createExemptionsHeader = function () {
            var header, ofsCell, filterOfsSelect, traderCell, filterUsernamesSelect, sourceSessionIdCell;
            header = htmlHelper.createRow("orderFillServiceExemptionsHeader");
            htmlHelper.appendCell(header, "ExternalTradeAccountID", 0, true);
            htmlHelper.appendCell(header, "IsvID", 0, true);
            htmlHelper.appendCell(header, "Provider", 0, true);
            traderCell = htmlHelper.appendCell(header, "Trader", 80, true, "username");
            filterUsernamesSelect = htmlHelper.createSelect('filterUsernamesSelectExemptions', '', 'Select a user name', 'All');
            filterUsernamesSelect.change(filterByOfsAndUsernameExemptions);
            traderCell.append(filterUsernamesSelect);
            ofsCell = htmlHelper.appendCell(header, "OFS", 50, true, "ofsProvider");
            filterOfsSelect = htmlHelper.createSelect('filterOfsSelectExemptions', '', 'Select an order fill service', 'All');
            filterOfsSelect.change(filterByOfsAndUsernameExemptions);
            ofsCell.append(filterOfsSelect);
            htmlHelper.appendCell(header, "Fill Account", 80, true);
            htmlHelper.appendCell(header, "Clearing Firm", 100, true);
            htmlHelper.appendCell(header, "FCM Account", 100, true);
            htmlHelper.appendCell(header, "ISV", 160, true);
            sourceSessionIdCell = htmlHelper.appendCell(header, "SourceSessionID", 120, true);
            sourceSessionIdCell.attr('colspan', 2);
            return header;
        },
        createExemptionRow = function (exemption, showSeparator) {
            var actionsCell, usernameCell, row;
            row = htmlHelper.createRow("orderFillServiceExemptionsRow");
            row.css('border-top', showSeparator ? '1px solid lightblue' : '0');
            htmlHelper.appendCell(row, exemption.ExternalTradeAccountID, 0, false, "externalTradeAccountID");
            htmlHelper.appendCell(row, exemption.IsvID, 0, false, "isvID");
            usernameCell = htmlHelper.appendCell(row, exemption.Username, 80, false, "username");
            if (!showSeparator) {
                usernameCell.addClass('hideExemptionUsername');
            }
            htmlHelper.appendCell(row, exemption.Provider, 0, false, "provider");
            htmlHelper.appendCell(row, exemption.ProviderDescription, 50, false, "providerDescription");
            htmlHelper.appendCell(row, exemption.InternalTradeAccount, 80, false, "internalTradeAccount");
            htmlHelper.appendCell(row, exemption.ClearingFirm, 100, false, "clearingFirm");
            htmlHelper.appendCell(row, exemption.ExternalTradeAccount, 100, false, "externalTradeAccount");
            htmlHelper.appendCell(row, exemption.ISV, 160, false, "isv");
            htmlHelper.appendCell(row, exemption.SourceSessionID, 50, false, "sourceSessionID");
            actionsCell = htmlHelper.appendCell(row, null, 70, false, "actions");
            appendDeleteExemptionImage(actionsCell);
            row.hover(function () {
                $(this).find('td').css('background-color', 'gainsboro');
                $(this).find('td.actions').css('border-left', '2px solid yellow');
                $(this).find('img').show();
            }, function () {
                $(this).find('td').css('background-color', '');
                $(this).find('td.actions').css('border-left', '0');
                $(this).find('img').hide();
            });
            row.addClass(exemption.Provider);
            row.addClass(exemption.Username);
            return row;
        },
        populateExemptionsTable = function (response) {
            var table, header, exemptions, showSeparator, username, summary;
            table = $('#tradeAccountExemptionsTable');
            table.empty();
            header = createExemptionsHeader();
            table.append(header);
            exemptions = response.Payload;
            if (response.Success && exemptions) {
                username = '';
                summary = {};
                exemptions.forEach(function (exemption) {
                    showSeparator = false;
                    if (!summary[exemption.Provider]) {
                        summary[exemption.Provider] = 1;
                    } else {
                        summary[exemption.Provider] += 1;
                    }
                    if (username !== exemption.Username) {
                        username = exemption.Username;
                        showSeparator = true;
                    }
                    table.append(createExemptionRow(exemption, showSeparator));
                });
                displaySummary("Exemptions Summary: ", $('#exemptionsSummary'), summary);
                fillExemptionFilterSelects(exemptions);
            }
        },
        fillTraderAccountsSelect = function (response) {
            var select;
            if (response.Success && response.Payload) {
                select = $('#fcmAccountsSelect');
                htmlHelper.initializeSelect(select, 'Select an FCM account');
                response.Payload.forEach(function (element) {
                    select.append(htmlHelper.createOption(element.Account, element.Id));
                });
            }
        },
        getUserTradeAccounts = function () {
            var clearingFirm = $('#clearingFirmsSelect').val(),
                username = $('#usernamesSelect').val();
            if (clearingFirm.length === 0 || username.length === 0) {
                htmlHelper.initializeSelect($('#fcmAccountsSelect'), 'Select an FCM account');
                return;
            }
            dataAccess.getUserTradeAccounts(username, clearingFirm, fillTraderAccountsSelect);
        },
        fillInternalTradeAccounts = function (response) {
            var select, username;
            if (response.Success && response.Payload) {
                select = $('#internalTradeAccountsSelect');
                username = $('#usernamesSelect').val();
                htmlHelper.fillSelectFromList(select, 'Select an internal trade account', response.Payload);
                select.val(username);
            }
        },
        getInternalTradeAccountsForUser = function () {
            var username = $('#usernamesSelect').val();
            if (username.length === 0) {
                htmlHelper.initializeSelect($('#internalTradeAccountsSelect'), 'Select an internal trade account');
                return;
            }
            dataAccess.getInternalTradeAccounts(username, fillInternalTradeAccounts);
        },
        fillClearingFirmsSelect = function (response) {
            var select, option;
            if (response.Success && response.Payload) {
                select = $('#clearingFirmsSelect');
                htmlHelper.initializeSelect(select, 'Select a clearing firm');
                response.Payload.forEach(function (element) {
                    option = htmlHelper.createOption(element.Key, element.Key);
                    option.attr('title', element.Value);
                    select.append(option);
                });
            }
            htmlHelper.initializeSelect($('#fcmAccountsSelect'), 'Select an FCM account');
        },
        getClearingFirmsForUser = function () {
            var username = $('#usernamesSelect').val();
            if (username.length === 0) {
                htmlHelper.initializeSelect($('#clearingFirmsSelect'), 'Select a clearing firm');
                return;
            }
            dataAccess.getClearingFirmsForUser(username, fillClearingFirmsSelect);
        },
        fillOfsProvidersSelect = function (response) {
            if (response.Success && response.Payload) {
                htmlHelper.fillSelectFromKeyValuePairs($('#ofsProvidersSelect'), 'Select an order fill service', response.Payload);
            }
        },
        fillUsernamesSelect = function (response) {
            if (response.Success && response.Payload) {
                htmlHelper.fillSelectFromList($('#usernamesSelect'), 'Select a user name', response.Payload);
            }
        },
        showAddAccountToClearingFirmControls = function () {
            addTradeAccountToUser.hideMain();
            $('#addMappingControls').slideUp('slow');
            $('#addClearingFirmAccountToClearingFirmContainer').slideDown('slow');
        },
        showAddTradeAccountToUserControls = function () {
            $('#addMappingControls').slideUp('slow');
            $('#addClearingFirmAccountToClearingFirmContainer').slideUp('slow');
            addTradeAccountToUser.showMain();
        },
        showAddMappingControls = function () {
            initializeCreateMappingSelects();
            addTradeAccountToUser.hideMain();
            $('#addClearingFirmAccountToClearingFirmContainer').slideUp('slow');
            $('#addExemptionControls').hide();
            $('#tradeAccountMappings').show();
            $('#addMappingControls').slideDown('slow');
        },
        createExemption = function () {
            var exemption, position;
            exemption = {
                Provider: $('#providerHidden').val(),
                ProviderDescription: $('#ofsProviderLabel').text(),
                Username: $('#usernameLabel').text(),
                InternalTradeAccount: $('#internalTradeAccountLabel').text(),
                ClearingFirm: $('#clearingFirmLabel').text(),
                ExternalTradeAccountID: $('#externalTraderAccountIDHidden').val(),
                ExternalTradeAccount: $('#fcmAccountLabel').text(),
                IsvID: $('#isvsSelect').val(),
                SourceSessionID: $('#sourceSessionSelect').val()
            };
            position = $('#addExemptionImage').position();
            dataAccess.createOrderFillServiceUserTradeAccountSystemExemption(exemption, createExemptionCallback(position, exemption));
        },
        navigate = function () {
            if (this.id === 'mappingsTab') {
                showMappingsView();
                return;
            }
            if (this.id === 'exemptionsTab') {
                showExemptionsView();
                return;
            }
        },
        assignEventHandlers = function () {
            $('#mappingsTab').click(navigate);
            $('#exemptionsTab').click(navigate);
            $('#showAddMappingControlsImage').click(showAddMappingControls);
            $('#showAddAccountToClearingFirmControlsImage').click(showAddAccountToClearingFirmControls);
            $('#showAddTradeAccountToUserControlsImage').click(showAddTradeAccountToUserControls);
            $('#cancelAddExemptionImage').click(showMappingsView);
            $('#cancelAddMappingImage').click(cancelAddMapping);
            $('#addExemptionImage').click(createExemption);
            $('#ofsProvidersSelect').change(validateSave);
            $('#usernamesSelect').change(getInternalTradeAccountsForUser);
            $('#usernamesSelect').change(getClearingFirmsForUser);
            $('#usernamesSelect').change(validateSave);
            $('#internalTradeAccountsSelect').change(validateSave);
            $('#clearingFirmsSelect').change(getUserTradeAccounts);
            $('#clearingFirmsSelect').change(validateSave);
            $('#fcmAccountsSelect').change(validateSave);
            $('#isvsSelect').change(function () {
                if ($(this).val().length > 0) {
                    $('#sourceSessionSelect').val('');
                }
            });
            $('#sourceSessionSelect').change(function () {
                if ($(this).val().length > 0) {
                    $('#isvsSelect').val('');
                }
            });
        },
        initializeControls = function () {
            if (wantReadOnlyView) {
                return;
            }
            htmlHelper.initializeSelect($('#clearingFirmsSelect'), 'Select a clearing firm');
            htmlHelper.initializeSelect($('#fcmAccountsSelect'), 'Select an FCM account');
            htmlHelper.initializeSelect($('#internalTradeAccountsSelect'), 'Select an internal trade account');
            htmlHelper.initializeSelect($('#sourceSessionSelect'), 'Select a source session id');
            htmlHelper.initializeSelect($('#isvsSelect'), 'Select an ISV');
            common.disableControl($('#addMappingImage'));
            $('#showAddMappingControlsImage').attr("title", "Add a fill mapping");
            $('#showAddAccountToClearingFirmControlsImage').attr("title", "Add an account to a clearing firm");
            $('#showAddTradeAccountToUserControlsImage').attr("title", "Add a trade account a to user");
            $('#addMappingImage').attr("title", "Create a fill mapping");
            $('#cancelAddMappingImage').attr("title", "Cancel");
            $('#addExemptionImage').attr("title", "Create a fill mapping exemption");
            $('#cancelAddExemptionImage').attr("title", "Cancel");
        },
        showLoadingPopup = function () {
            var container;
            common.clearPopup();
            container = $('#loadingContainer');
            container.show();
            common.getPopup().append(container);
            common.assignPopupEvents();
            common.showPopup(200, 400);
        },
        styles = {
            mainContainer: 'ofsAddClearingFirmAccountToClearingFirmContainer',
            mainContainerLabel: 'addClearingFirmAccountToClearingFirmContainerLabel',
            mainContainerInput: 'ofsAddClearingFirmAccountToClearingFirmContainerInput',
            executingFirmsContainer: 'executingFirmsContainer',
            accountCommentContainerLabel: 'accountCommentContainerLabel',
            accountComment: 'ofsAccountComment',
            cancelButton: 'cancelClearingFirmAccountAddButton',
            addButton: 'clearingFirmAccountAddButton',
            clearingFirmLabel: 'clearingFirmLabel'
        },
        cancelAddAccountToClearingFirm = function () {
            $('#addClearingFirmAccountToClearingFirmContainer').slideUp('slow');
        };
    result = {
        initialize: function (isReadOnly) {
            wantReadOnlyView = isReadOnly;
            common.trapEnterKey($('form'));
            $('body').css({ 'width': '2000px', 'height': '2000px' });
            showLoadingPopup();
            initializeControls();
            assignEventHandlers();
            dataAccess.getOrderFillServiceProviders(fillOfsProvidersSelect);
            dataAccess.getUsernames(fillUsernamesSelect);
            dataAccess.getOrderFillServiceUserTradeAccountSystemExemptions(populateExemptionsTable);
            intializeMappingsTable(fillMappingsTable);
            if (wantReadOnlyView) {
                return;
            }
            addClearingFirmAccounts.applyStyles(styles, cancelAddAccountToClearingFirm);
        }
    };
    return result;
});
