var campaignAccordionService = function () {

    var currentValues = {
        companyNote: "",
        contactNote: "",
        companyDetails: {toDialExtension: '', toDialDirectory: '', toDialOperator: ''},
        contactDetails: {
            name: '',
            directDial: '',
            ext: '',
            title: '',
            mobile: '',
            email: '',
            aaEmail: '',
            linkedinUrl: '',
            zoomInfoUrl: ''
        }
    }
    
    const elementIds = {
        company_details_hq: 'company_details_hq',
        company_details_to_dial_extension: 'company_details_to_dial_extension',
        company_details_to_dial_directory: 'company_details_to_dial_directory',
        company_details_to_dial_operator: 'company_details_to_dial_operator',
        company_details_company_url: 'company_details_company_url',
        company_details_linkedin_profile: 'company_details_linkedin_profile',
        company_details_zoominfo_profile: 'company_details_zoominfo_profile',

        contacts_table_div: 'contacts_table_div',
        companies_table: 'companies_table',
        contacts_table: 'contacts_table',
        contacts_table_body: 'contacts_table_body', 

        no_contacts_div: 'no_contacts_div',

        contact_details_prospect_name: 'contact_details_prospect_name',
        contact_details_title: 'contact_details_title',
        contact_details_email: 'contact_details_email',
        contact_details_aa_email: 'contact_details_aa_email',
        contact_details_linkedin_profile: 'contact_details_linkedin_profile',
        contact_details_linkedin_profile_url: 'contact_details_linkedin_profile_url',
        contact_details_zoominfo_profile: 'contact_details_zoominfo_profile',
        contact_details_zoominfo_profile_url: 'contact_details_zoominfo_profile_url',
        contact_details_direct_dial: 'contact_details_direct_dial',
        contact_details_ext: 'contact_details_ext',
        contact_details_mobile: 'contact_details_mobile',

        notes: 'notes',

        update_contact_btn: 'update_contact_btn',
        // edit_contact_btn: 'edit_contact_btn',
        dismiss_contact_edit_btn: 'dismiss_contact_edit_btn',

        update_contact_note_btn: 'update_contact_note_btn',
        // edit_contact_note_btn: 'edit_contact_note_btn',
        dismiss_contact_note_edit_btn: 'dismiss_contact_note_edit_btn',

        company_notes: 'company_notes',

        update_company_note_btn: 'update_company_note_btn',
        // edit_company_note_btn: 'edit_company_note_btn',
        dismiss_company_note_edit_btn: 'dismiss_company_note_edit_btn',

        update_company_btn: 'update_company_btn',
        // edit_company_btn: 'edit_company_btn',
        dismiss_company_edit_btn: 'dismiss_company_edit_btn',

        add_new_contact_btn: 'add_new_contact_btn',
        request_to_delete_contact_btn: 'request_to_delete_contact_btn',

        request_to_delete_contact_modal: 'request_to_delete_contact_modal',
        request_contact_delete_btn: 'request_contact_delete_btn',
        reason: 'reason',

        create_new_contact_modal: 'create_new_contact_modal',
        store_new_contact_btn: 'store_new_contact_btn',

        salutation: 'salutation',
        contactFirstName: 'contactFirstName',
        contactLastName: 'contactLastName',
        jobTitle: 'jobTitle',
        directPhoneNumber: 'directPhoneNumber',
        dialExtension: 'dialExtension',
        mobilePhone: 'mobilePhone',
        emailAddress: 'emailAddress',
        zoominfoCompanyProfileURL: 'zoominfoCompanyProfileURL',
        linkedinCompanyProfileURL: 'linkedinCompanyProfileURL',

        request_contact_btn: 'request_contact_btn',
        request_contact_modal: 'request_contact_modal',

        companyName: 'companyName',
        prospectTitle: 'prospectTitle',
        store_new_contact_request_btn: 'store_new_contact_request_btn',
    }

    const classes = {
        change_status: 'change_status'
    }

    var statusesObject = {};
    var statusesObjectArrayOrignal = [];
    var statusesObjectArray = [];

    addEventListeners = function () {
        emptyCompanyInfo();
        emptyContactTableBody();
        hideUpdateContactButton();
        hideEditContactButton();

        hideUpdateContactNoteButton();
        // hideEditContactNoteButton();

        hideUpdateCompanyNoteButton();
        hideEditCompanyNoteButton();

        hideUpdateCompanyButton();
        hideEditCompanyButton();

        helpersService.hide(elementIds.add_new_contact_btn);
        helpersService.hide(elementIds.request_to_delete_contact_btn);

        // Contact Inputs change show edit contact buttons
        $("#" + elementIds.contact_details_prospect_name).keyup(checkIfContactInfoChanged);
        $("#" + elementIds.contact_details_direct_dial).keyup(checkIfContactInfoChanged);
        $("#" + elementIds.contact_details_ext).keyup(checkIfContactInfoChanged);
        $("#" + elementIds.contact_details_title).keyup(checkIfContactInfoChanged);
        $("#" + elementIds.contact_details_mobile).keyup(checkIfContactInfoChanged);
        $("#" + elementIds.contact_details_email).keyup(checkIfContactInfoChanged);
        $("#" + elementIds.contact_details_aa_email).keyup(checkIfContactInfoChanged);
        $("#" + elementIds.contact_details_linkedin_profile).keyup(checkIfContactInfoChanged);
        $("#" + elementIds.contact_details_zoominfo_profile).keyup(checkIfContactInfoChanged);
        function checkIfContactInfoChanged() {
            var contactData = {
                "name": $("#" + elementIds.contact_details_prospect_name).val(),
                "contact_details_title": $("#" + elementIds.contact_details_title).val(),
                "contact_details_email": $("#" + elementIds.contact_details_email).val(),
                "contact_details_aa_email": $("#" + elementIds.contact_details_aa_email).val(),
                "contact_details_linkedin_profile": $("#" + elementIds.contact_details_linkedin_profile).val(),
                "contact_details_zoominfo_profile": $("#" + elementIds.contact_details_zoominfo_profile).val(),
                "contact_details_direct_dial": $("#" + elementIds.contact_details_direct_dial).val(),
                "contact_details_ext": $("#" + elementIds.contact_details_ext).val(),
                "contact_details_mobile": $("#" + elementIds.contact_details_mobile).val(),
            }
            if(currentValues.contactDetails.name != contactData.name) {
                showUpdateContactButton();
                return;
            }
            if(currentValues.contactDetails.title != contactData.contact_details_title) {
                showUpdateContactButton();
                return;
            }
            if(currentValues.contactDetails.email != contactData.contact_details_email) {
                showUpdateContactButton();
                return;
            }
            if(currentValues.contactDetails.aaEmail != contactData.contact_details_aa_email) {
                showUpdateContactButton();
                return;
            }
            if(currentValues.contactDetails.linkedinUrl != contactData.contact_details_linkedin_profile) {
                showUpdateContactButton();
                return;
            }
            if(currentValues.contactDetails.zoomInfoUrl != contactData.contact_details_zoominfo_profile) {
                showUpdateContactButton();
                return;
            }
            if(currentValues.contactDetails.directDial != contactData.contact_details_direct_dial) {
                showUpdateContactButton();
                return;
            }
            if(currentValues.contactDetails.ext != contactData.contact_details_ext) {
                showUpdateContactButton();
                return;
            }
            if(currentValues.contactDetails.mobile != contactData.contact_details_mobile) {
                showUpdateContactButton();
                return;
            }
            hideUpdateContactButton();
        }

        // Key Up Company Note
        $("#" + elementIds.company_notes).keyup(checkIfCompanyNoteChanges);
        function checkIfCompanyNoteChanges() {
            var companyNote = $("#" + elementIds.company_notes).val();
            if(currentValues.companyNote != companyNote) {
                showUpdateCompanyNoteButton();
                return;
            }
            hideUpdateCompanyNoteButton();
        }

        // Key Up Contact Note
        $("#" + elementIds.notes).keyup(checkIfContactNoteChanges);
        function checkIfContactNoteChanges() {
            var contactNote = $("#" + elementIds.notes).val();
            if(currentValues.contactNote != contactNote) {
                showUpdateContactNoteButton();
                return;
            }
            hideUpdateContactNoteButton();
        }

        // Keyup Company Details
        $("#" + elementIds.company_details_to_dial_extension).keyup(checkIfCompanyInfoChanged);
        $("#" + elementIds.company_details_to_dial_directory).keyup(checkIfCompanyInfoChanged);
        $("#" + elementIds.company_details_to_dial_operator).keyup(checkIfCompanyInfoChanged);
        function checkIfCompanyInfoChanged() {
            var companyData = {
                "company_details_to_dial_extension": $("#" + elementIds.company_details_to_dial_extension).val(),
                "company_details_to_dial_directory": $("#" + elementIds.company_details_to_dial_directory).val(),
                "company_details_to_dial_operator": $("#" + elementIds.company_details_to_dial_operator).val(),
            }
            if(currentValues.companyDetails.toDialExtension != companyData.company_details_to_dial_extension) {
                showUpdateCompanyButton();
                return;
            }
            if(currentValues.companyDetails.toDialDirectory != companyData.company_details_to_dial_directory) {
                showUpdateCompanyButton();
                return;
            }
            if(currentValues.companyDetails.toDialOperator != companyData.company_details_to_dial_operator) {
                showUpdateCompanyButton();
                return;
            }
            hideUpdateCompanyButton();
        }

        // Companies Table Click
        $('#' + elementIds.companies_table + ' tbody tr').click(function(evt) {
            if ( $(evt.target).is("a") ) {
                return;
            }
            $(this).addClass('table-light').siblings().removeClass('table-light');

            var campaignId = $(this).attr('data-campaign-id');
            var companyId = $(this).attr('id');

            var url = urls.getCompany;
            url = url.replace(':id', companyId);
            url += `?campaign-id=${campaignId}`;
            ajaxService.makeAjaxRequest("GET", url).done(function(data) {
                emptyCompanyInfo();
                emptyContactInfo();

                currentValues.contactNote = "";

                populateCompanyInfo(data['company'], companyId);

                hideUpdateContactButton();
                // hideEditContactButton();
                makeContactInputsNonEditable();

                hideUpdateContactNoteButton();
                // hideEditContactNoteButton();
                makeContactNoteInputsNonEditable();

                hideUpdateCompanyButton();
                // showEditCompanyButton();
                makeCompanyInputsEditable();

                hideUpdateCompanyNoteButton();
                // showEditCompanyNoteButton();
                makeCompanyNoteInputsEditable();


                $("#" + elementIds.update_company_note_btn).attr("data-campaign-id", campaignId);
                $("#" + elementIds.update_company_note_btn).attr("data-company-id", companyId);

                helpersService.show(elementIds.add_new_contact_btn);
                helpersService.hide(elementIds.request_to_delete_contact_btn);
                $("#" + elementIds.add_new_contact_btn).attr("data-company-id", companyId);
                $("#" + elementIds.request_to_delete_contact_btn).attr("data-company-id", "");
                $("#" + elementIds.request_to_delete_contact_btn).attr("data-contact-id", "");

                emptyContactTableBody();
                populateContactTableBody(data['company']['contacts'], campaignId, companyId);
            }).fail(function(err) {
                emptyCompanyInfo();
                emptyContactInfo();

                hideUpdateContactButton();
                hideEditContactButton();
                makeContactInputsNonEditable();

                hideUpdateContactNoteButton();
                // hideEditContactNoteButton();
                makeContactNoteInputsNonEditable();

                hideUpdateCompanyButton();
                // hideEditCompanyButton();
                makeCompanyInputsEditable();

                hideUpdateCompanyNoteButton();
                hideEditCompanyNoteButton();
                makeCompanyNoteInputsNonEditable();

                $("#" + elementIds.update_company_note_btn).attr("data-campaign-id", "");
                $("#" + elementIds.update_company_note_btn).attr("data-company-id", "");

                helpersService.hide(elementIds.add_new_contact_btn);
                helpersService.hide(elementIds.request_to_delete_contact_btn);
                $("#" + elementIds.add_new_contact_btn).attr("data-company-id", "");
                $("#" + elementIds.request_to_delete_contact_btn).attr("data-company-id", "");
                $("#" + elementIds.request_to_delete_contact_btn).attr("data-contact-id", "");

                toastr["error"](`Invalid company selected, if error persists refresh the page and try again!`);
            });
        });

        // Update Contact Event Listener
        $("#" + elementIds.update_contact_btn).on("click", function() {
            var contactId = $("#" + elementIds.update_contact_btn).attr("data-contact-id");
            var contactData = {
                "name": $("#" + elementIds.contact_details_prospect_name).val(),
                "contact_details_title": $("#" + elementIds.contact_details_title).val(),
                "contact_details_email": $("#" + elementIds.contact_details_email).val(),
                "contact_details_aa_email": $("#" + elementIds.contact_details_aa_email).val(),
                "contact_details_linkedin_profile": $("#" + elementIds.contact_details_linkedin_profile).val(),
                "contact_details_zoominfo_profile": $("#" + elementIds.contact_details_zoominfo_profile).val(),
                "contact_details_direct_dial": $("#" + elementIds.contact_details_direct_dial).val(),
                "contact_details_ext": $("#" + elementIds.contact_details_ext).val(),
                "contact_details_mobile": $("#" + elementIds.contact_details_mobile).val(),
            }
            if(contactData.name.length <= 0) {
                $("#" + elementIds.contact_details_prospect_name).addClass("is-invalid");
                return;
            } else {
                $("#" + elementIds.contact_details_prospect_name).removeClass("is-invalid");
            }
            if(contactData.contact_details_title.length <= 0) {
                $("#" + elementIds.contact_details_title).addClass("is-invalid");
                return;
            }else {
                $("#" + elementIds.contact_details_title).removeClass("is-invalid");
            }
            if(contactData.contact_details_linkedin_profile.length <= 0) {
                $("#" + elementIds.contact_details_linkedin_profile).addClass("is-invalid");
                return;
            }else {
                $("#" + elementIds.contact_details_linkedin_profile).removeClass("is-invalid");
            }
            if(contactData.contact_details_zoominfo_profile.length <= 0) {
                $("#" + elementIds.contact_details_zoominfo_profile).addClass("is-invalid");
                return;
            }else {
                $("#" + elementIds.contact_details_zoominfo_profile).removeClass("is-invalid");
            }
            if(contactData.contact_details_direct_dial.length <= 0) {
                $("#" + elementIds.contact_details_direct_dial).addClass("is-invalid");
                return;
            }else {
                $("#" + elementIds.contact_details_direct_dial).removeClass("is-invalid");
            }
            var url = urls.miniUpdateContact;
            url = url.replace(':id', contactId);
            ajaxService.makeAjaxRequest("POST", url, contactData).done(function(data) {
                toastr["success"](`Contact Updated Successfully!`);
                // showEditContactButton();
                hideUpdateContactButton();
                // makeContactInputsNonEditable();

                currentValues.contactDetails.name = contactData.name;
                currentValues.contactDetails.directDial = contactData.contact_details_direct_dial;
                currentValues.contactDetails.ext = contactData.contact_details_ext;
                currentValues.contactDetails.title = contactData.contact_details_title;
                currentValues.contactDetails.mobile = contactData.contact_details_mobile;
                currentValues.contactDetails.email = contactData.contact_details_email;
                currentValues.contactDetails.aaEmail = contactData.contact_details_aa_email;
                currentValues.contactDetails.linkedinUrl = contactData.contact_details_linkedin_profile;
                currentValues.contactDetails.zoomInfoUrl = contactData.contact_details_zoominfo_profile;

            }).fail(function(err){
                // showEditContactButton();
                hideUpdateContactButton();
                // makeContactInputsNonEditable();
                toastr["error"](`Something unexpected happened please refresh and try again!`);
            });
        });

         // Update Contact Note Event Listener
         $("#" + elementIds.update_contact_note_btn).on("click", function() {
            var campaignId = $("#" + elementIds.update_contact_note_btn).attr("data-campaign-id");
            var companyId = $("#" + elementIds.update_contact_note_btn).attr("data-company-id");
            var contactId = $("#" + elementIds.update_contact_note_btn).attr("data-contact-id");
            var contactData = {
                campaignId: campaignId,
                companyId: companyId,
                contactId: contactId,
                notes: $("#" + elementIds.notes).val()
            }
            var url = urls.miniUpdateContactNote;
            ajaxService.makeAjaxRequest("POST", url, contactData).done(function(data) {
                toastr["success"](`Note added to this contact Successfully!`);
                currentValues.contactNote = contactData.notes;
                // showEditContactNoteButton();
                hideUpdateContactNoteButton();
                // makeContactNoteInputsNonEditable();
            }).fail(function(err){
                // showEditContactNoteButton();
                // hideUpdateContactNoteButton();
                // makeContactNoteInputsNonEditable();
                toastr["error"](`Something unexpected happened please refresh and try again!`);
            });
        });

        // Update Company Note Event Listener
        $("#" + elementIds.update_company_note_btn).on("click", function() {
            var contactData = {
                campaignId: $("#" + elementIds.update_company_note_btn).attr("data-campaign-id"),
                companyId: $("#" + elementIds.update_company_note_btn).attr("data-company-id"),
                companyNotes: $("#" + elementIds.company_notes).val()
            }
            var url = urls.miniUpdateCompanyNote;
            ajaxService.makeAjaxRequest("POST", url, contactData).done(function(data) {
                currentValues.companyNote = contactData.companyNotes;

                toastr["success"](`Note added to company Successfully!`);
                // showEditCompanyNoteButton();
                hideUpdateCompanyNoteButton();
                // makeCompanyNoteInputsNonEditable();
                currentValues.companyNote = contactData.companyNotes;
            }).fail(function(err) {
                // showEditCompanyNoteButton();
                hideUpdateCompanyNoteButton();
                // makeCompanyNoteInputsNonEditable();
                toastr["error"](`Something unexpected happened please refresh and try again!`);
            });
        });

        // Update Company Event Listener
        $("#" + elementIds.update_company_btn).on("click", function() {
            var companyId = $("#" + elementIds.update_company_btn).attr("data-company-id");
            var companyData = {
                "company_details_to_dial_extension": $("#" + elementIds.company_details_to_dial_extension).val(),
                "company_details_to_dial_directory": $("#" + elementIds.company_details_to_dial_directory).val(),
                "company_details_to_dial_operator": $("#" + elementIds.company_details_to_dial_operator).val(),
            }
            
            var url = urls.miniUpdateCompany;
            url = url.replace(':id', companyId);
            ajaxService.makeAjaxRequest("POST", url, companyData).done(function(data) {
                toastr["success"](`Company details updated Successfully!`);
                currentValues.companyDetails.toDialExtension = companyData.company_details_to_dial_extension;
                currentValues.companyDetails.toDialDirectory = companyData.company_details_to_dial_directory;
                currentValues.companyDetails.toDialOperator = companyData.company_details_to_dial_operator;
                // showEditCompanyButton();
                hideUpdateCompanyButton();
                // makeCompanyInputsEditable();
            }).fail(function(err){
                // showEditCompanyButton();
                hideUpdateCompanyButton();
                // makeCompanyInputsNonEditable();
                toastr["error"](`Something unexpected happened please refresh and try again!`);
            });
        });

        // Get Statuses
        ajaxService.makeAjaxRequest("GET", urls.campaignCompanyStatusesFetchAll).done(function(data) {
        data.forEach(element => {
            statusesObjectArray[element.status_name] = [];
            statusesObjectArrayOrignal[element.status_name] = [];
            statusesObject[element.id] = element.status_name.toUpperCase().replaceAll("-", " ");
        });
        });

        //  Status Change
        $("." + classes.change_status).on('click', function(e) {
            e.preventDefault();
            var companyId = $(this).attr('data-company-id');
            var campaignId = $(this).attr('data-campaign-id');
            var statusId = $(this).attr('data-status-id');
            var that = this;

            Swal.fire({
                title: 'Add Status to Company in a Campaign',
                input: 'select',
                inputOptions: statusesObject,
                inputPlaceholder: 'Please Select a Status',
                showCancelButton: true,
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        if (value !== '') {
                            ajaxService.makeAjaxRequest("POST", urls.campaignUpdateStatus, {campaignId: campaignId, companyId: companyId, status: value}).done(function(data) {
                            }).done(function(data){
                                if(data.success) {
                                    // $(that).parent().parent().attr("data-status", statusesObject[value].toLowerCase().replaceAll(" ", "-"))
                                    $(that).text(statusesObject[value].toUpperCase().replace("-", " "));
                                    resolve();
                                } else {
                                    resolve('Something unexpected happened on server, please refresh and try again.');
                                }
                            }).fail(function(err){
                                resolve('Something unexpected happened on server, please refresh and try again.');
                            });

                        } else {
                            resolve('You need to select one option.');
                        }
                    });
                }
                }).then(function (result) {
                    if (result.isConfirmed) {
                        toastr["success"](`Status Updated successfully!`);
                        // setTimeout(() => {
                        //     window.location.href = "{{ route('admin.campaign.company', $campaign->id) }}";
                        // }, 1000);
                        Swal.fire({
                            icon: 'success',
                            html: 'Status updated successfully!'
                        });
                    }
                });
        });

        // Show update contact button and make inputs editable
        // $("#" + elementIds.edit_contact_btn).on("click", function() {
        //     showUpdateContactButton();
        //     hideEditContactButton();
        //     makeContactInputsEditable();
        // });
        // Hide update contact button and make inputs non editable
        $("#" + elementIds.dismiss_contact_edit_btn).on("click", function() {
            hideUpdateContactButton();
            showEditContactButton();
            // makeContactInputsNonEditable();

            $("#"+elementIds.contact_details_prospect_name).val(currentValues.contactDetails.name);
            $("#"+elementIds.contact_details_title).val(currentValues.contactDetails.title);
            $("#"+elementIds.contact_details_email).val(currentValues.contactDetails.email);
            $("#"+elementIds.contact_details_aa_email).val(currentValues.contactDetails.aaEmail);
            $("#"+elementIds.contact_details_linkedin_profile).val(currentValues.contactDetails.linkedinUrl);
            $("#"+elementIds.contact_details_linkedin_profile_url).html(`<a href="${currentValues.contactDetails.linkedinUrl}" target="_blank"><i class="ri-links-line" id=""></i></a>`);
            $("#"+elementIds.contact_details_zoominfo_profile).val(currentValues.contactDetails.zoomInfoUrl);
            $("#"+elementIds.contact_details_zoominfo_profile_url).html('<a href="${currentValues.contactDetails.zoomInfoUrl}" target="_blank"><i class="ri-links-line" id=""></i></a>');
            $("#"+elementIds.contact_details_direct_dial).val(currentValues.contactDetails.directDial);
            $("#"+elementIds.contact_details_ext).val(currentValues.contactDetails.ext);
            $("#"+elementIds.contact_details_mobile).val(currentValues.contactDetails.mobile);
        });

        // Show update contact note button and make inputs editable
        // $("#" + elementIds.edit_contact_note_btn).on("click", function() {
        //     showUpdateContactNoteButton();
        //     hideEditContactNoteButton();
        //     makeContactNoteInputsEditable();
        // });
        // Hide update contact note button and make inputs non editable
        $("#" + elementIds.dismiss_contact_note_edit_btn).on("click", function() {
            hideUpdateContactNoteButton();
            // showEditContactNoteButton();
            // makeContactNoteInputsNonEditable();
            $("#" + elementIds.notes).val(currentValues.contactNote);
        });

        // Show update company button and make inputs editable
        // $("#" + elementIds.edit_company_btn).on("click", function() {
        //     showUpdateCompanyButton();
        //     hideEditCompanyButton();
        //     makeCompanyInputsEditable();
        // });
        // Hide update company button and make inputs non editable
        $("#" + elementIds.dismiss_company_edit_btn).on("click", function() {
            hideUpdateCompanyButton();
            // showEditCompanyButton();
            // makeCompanyInputsNonEditable();
                $("#" + elementIds.company_details_to_dial_extension).val(currentValues.companyDetails.toDialExtension);
                $("#" + elementIds.company_details_to_dial_directory).val(currentValues.companyDetails.toDialDirectory);
                $("#" + elementIds.company_details_to_dial_operator).val(currentValues.companyDetails.toDialOperator);

        });

         // Show update company note button and make inputs editable
        // $("#" + elementIds.edit_company_note_btn).on("click", function() {
        //     showUpdateCompanyNoteButton();
        //     hideEditCompanyNoteButton();
        //     makeCompanyNoteInputsEditable();
        // });
        // Hide update company note button and make inputs non editable
        $("#" + elementIds.dismiss_company_note_edit_btn).on("click", function() {
            hideUpdateCompanyNoteButton();
            $("#" + elementIds.company_notes).val(currentValues.companyNote);

            // showEditCompanyNoteButton();
            // makeCompanyNoteInputsNonEditable();
        });

        // Create Contact Button click show modal
        $("#" + elementIds.add_new_contact_btn).on("click", function() {
            var companyId = $("#" + elementIds.add_new_contact_btn).attr("data-company-id");
            $("#" + elementIds.store_new_contact_btn).attr("data-company-id", companyId);
            emptyCreateContactModalInfo();
            $("#" + elementIds.create_new_contact_modal).modal("show");
        });

        // Store contact
        $("#" + elementIds.store_new_contact_btn).on("click", function() {
            handleStoreContact($("#" + elementIds.store_new_contact_btn).attr("data-company-id"));
        });

        // Show Delete contact request modal
        $("#" + elementIds.request_to_delete_contact_btn).on("click", function() {
            var contactId = $("#" + elementIds.request_to_delete_contact_btn).attr("data-contact-id");
            $("#" + elementIds.request_contact_delete_btn).attr("data-contact-id",contactId);
            $("#" + elementIds.reason).val("");
            $("#" + elementIds.request_to_delete_contact_modal).modal("show");
        });

        // Delete contact request button
        $("#" + elementIds.request_contact_delete_btn).on("click", function() {
            var contactId = $("#" + elementIds.request_contact_delete_btn).attr("data-contact-id");
            var reason = $("#" + elementIds.reason).val();

            if(reason.trim().length <= 0) {
                $("#" + elementIds.reason).addClass("is-invalid");
                return;
            } else {
                $("#" + elementIds.reason).removeClass("is-invalid");
            }

            // var url = urls.requestDeleteContact;
            // url = url.replace(':id', contactId);
            ajaxService.makeAjaxRequest("POST", urls.requestDeleteContact, {contactId: contactId, reason: reason}).done(function(data) {
                toastr["success"](`Contact delete request submitted!`);
                $('#' + elementIds.contacts_table + " tr#" + contactId).remove();
                emptyContactInfo();
                $("#" + elementIds.request_contact_delete_btn).attr("data-contact-id", "");
                $("#" + elementIds.request_to_delete_contact_btn).attr("data-contact-id", "");
                helpersService.hide(elementIds.request_to_delete_contact_btn);
                // hideEditContactButton();
                hideUpdateContactButton();
                // hideEditContactNoteButton();
                hideUpdateContactNoteButton();
                makeContactInputsNonEditable();
                makeContactNoteInputsNonEditable();
                $("#" + elementIds.request_to_delete_contact_modal).modal("hide");
            }).fail(function(err) {
                // emptyContactInfo();
                $("#" + elementIds.request_contact_delete_btn).attr("data-contact-id", "");
                // $("#" + elementIds.request_to_delete_contact_btn).attr("data-contact-id", "");
                // helpersService.hide(elementIds.request_to_delete_contact_btn);
                // hideEditContactButton();
                // hideUpdateContactButton();
                // hideEditContactNoteButton();
                // hideUpdateContactNoteButton();
                // makeContactInputsNonEditable();
                switch(err.responseJSON.type) {
                    case "contact-not-found":
                        toastr["error"](`Invalid contact selected, please refresh the page and try again!.`);
                        break;
                    default:
                        toastr["error"](`Something unexpected happened please refresh and try again!`);
                }
                $("#" + elementIds.request_to_delete_contact_modal).modal("hide");
            });
        });

        // Contact Request Show Modal
        $("#" + elementIds.request_contact_btn).on("click", function() {
            emptyCreateContactRequestModalInfo();
            $("#" + elementIds.request_contact_modal).modal("show");
        })
        // Add Contact Request Event
        $("#" + elementIds.store_new_contact_request_btn).on("click", function() {
            var contactRequestData = {
                companyName: $("#" + elementIds.companyName).val(),
                prospectTitle: $("#" + elementIds.prospectTitle).val(),
            }
            // validate
            if(contactRequestData.companyName.trim().length <= 0) {
                $("#" + elementIds.companyName).addClass("is-invalid");
                return;
            } else {
                $("#" + elementIds.companyName).removeClass("is-invalid");
            }
            if(contactRequestData.prospectTitle.trim().length <= 0) {
                $("#" + elementIds.prospectTitle).addClass("is-invalid");
                return;
            } else {
                $("#" + elementIds.prospectTitle).removeClass("is-invalid");
            }
            
            ajaxService.makeAjaxRequest("POST", urls.requestCreateContact, contactRequestData).done(function(data) {
                $("#" + elementIds.request_contact_modal).modal("hide");
                toastr["success"](`Contact Request sent Successfully!`);
            }).fail(function(err){
                $("#" + elementIds.request_contact_modal).modal("hide");
                toastr["error"](`Something unexpected happened please refresh and try again!`);
            });
        })

    }

    function contactTableRowClickEventListener() {
        // Contacts Table Click
        $('#' + elementIds.contacts_table + '  tbody tr').click(function() {
            $(this).addClass('table-light').siblings().removeClass('table-light');
            var contactId = $(this).attr('id');
            var campaignId = $(this).attr('data-campaign-id');
            var companyId = $(this).attr('data-company-id');
            var url = urls.getContact;
            var payload = {contactId: contactId, campaignId: campaignId, companyId: companyId};
            ajaxService.makeAjaxRequest("POST", url, payload).done(function(data) {
                emptyContactInfo();
                populateContactInfo(data['contact'], payload);

                // showEditContactButton();
                hideUpdateContactButton();
                // makeContactInputsNonEditable();
                makeContactInputsEditable();

                // showEditContactNoteButton();
                hideUpdateContactNoteButton();
                makeContactNoteInputsEditable();

                $("#" + elementIds.request_to_delete_contact_btn).attr("data-company-id", companyId);
                $("#" + elementIds.request_to_delete_contact_btn).attr("data-contact-id", contactId);
                helpersService.show(elementIds.request_to_delete_contact_btn);

            }).fail(function(err) {
                emptyContactInfo();
                hideEditContactButton();
                hideUpdateContactButton();
                // makeContactInputsNonEditable();
                makeContactInputsEditable();

                // hideEditContactNoteButton();
                hideUpdateContactNoteButton();
                makeContactNoteInputsEditable();

                $("#" + elementIds.request_to_delete_contact_btn).attr("data-company-id", "");
                $("#" + elementIds.request_to_delete_contact_btn).attr("data-contact-id", "");
                helpersService.hide(elementIds.request_to_delete_contact_btn);

                toastr["error"](`Invalid contact selected, reselect the company or refresh the page!`);
            });
        })
    }

    function emptyCompanyInfo() {
        $("#"+elementIds.company_details_hq).text("");
        $("#"+elementIds.company_details_to_dial_extension).val("");
        $("#"+elementIds.company_details_to_dial_directory).val("");
        $("#"+elementIds.company_details_to_dial_operator).val("");
        $("#"+elementIds.company_details_company_url).text("");
        $("#"+elementIds.company_details_linkedin_profile).text("");
        $("#"+elementIds.company_details_zoominfo_profile).text("");
    }
    function emptyContactInfo() {
        $("#"+elementIds.contact_details_prospect_name).val("");
        $("#"+elementIds.contact_details_title).val("");
        $("#"+elementIds.contact_details_email).val("");
        $("#"+elementIds.contact_details_aa_email).val("");
        $("#"+elementIds.contact_details_linkedin_profile).val("");
        $("#"+elementIds.contact_details_linkedin_profile_url).html('<i class="ri-links-line" id=""></i>');
        $("#"+elementIds.contact_details_zoominfo_profile).val("");
        $("#"+elementIds.contact_details_zoominfo_profile_url).html('<i class="ri-links-line" id=""></i>');
        $("#"+elementIds.contact_details_direct_dial).val("");
        $("#"+elementIds.contact_details_ext).val("");
        $("#"+elementIds.contact_details_mobile).val("");
        $("#"+elementIds.notes).val("");
    }
    function emptyCreateContactModalInfo() {
        $("#" + elementIds.salutation).val("");
        $("#" + elementIds.contactFirstName).val("");
        $("#" + elementIds.contactLastName).val("");
        $("#" + elementIds.jobTitle).val("");
        $("#" + elementIds.directPhoneNumber).val("");
        $("#" + elementIds.dialExtension).val("");
        $("#" + elementIds.mobilePhone).val("");
        $("#" + elementIds.emailAddress).val("");
        $("#" + elementIds.zoominfoCompanyProfileURL).val("");
        $("#" + elementIds.linkedinCompanyProfileURL).val("");
    }
    function emptyCreateContactRequestModalInfo() {
        $("#" + elementIds.companyName).val("");
        $("#" + elementIds.prospectTitle).val("");
    }

    function populateCompanyInfo(data, companyId) {
        $("#"+elementIds.company_notes).text(data.notes);
        $("#"+elementIds.company_details_hq).text(data.hq_phone);
        $("#"+elementIds.company_details_to_dial_extension).val(data.to_dial_extension);
        $("#"+elementIds.company_details_to_dial_directory).val(data.to_dial_directory);
        $("#"+elementIds.company_details_to_dial_operator).val(data.to_dial_operator);
        $("#"+elementIds.company_details_company_url).html(`<a href='//${data.website}' target='_blank'>${data.website}</a>`);
        $("#"+elementIds.company_details_linkedin_profile).html(`<a href='${data.linkedin_company_profile_url}' target='_blank'><i class="ri-external-link-line"></i></a>`);
        $("#"+elementIds.company_details_zoominfo_profile).html(`<a href='${data.zoominfo_company_profile_url}' target='_blank'><i class="ri-external-link-line"></i></a>`);

        $("#" + elementIds.update_company_btn).attr("data-company-id", companyId);

        currentValues.companyNote = data.notes;
        currentValues.companyDetails.toDialExtension = (data.to_dial_extension)? data.to_dial_extension : "";
        currentValues.companyDetails.toDialDirectory = (data.to_dial_directory)?data.to_dial_directory:"";
        currentValues.companyDetails.toDialOperator = (data.to_dial_operator)?data.to_dial_operator:"";
    }
    function populateContactInfo(data, payload) {
        $("#"+elementIds.contact_details_prospect_name).val(data.first_name + " " + data.last_name);
        $("#"+elementIds.contact_details_title).val(data.job_title);
        $("#"+elementIds.contact_details_email).val(data.email_address);
        $("#"+elementIds.contact_details_aa_email).val(data.aa_email);
        $("#"+elementIds.contact_details_linkedin_profile).val(data.linkedin_contact_profile_url);
        $("#"+elementIds.contact_details_linkedin_profile_url).html(`<a href='${data.linkedin_contact_profile_url}' target='_blank'><i class="ri-links-line" id=""></i></a>`);
        $("#"+elementIds.contact_details_zoominfo_profile).val(data.zoominfo_contact_profile_url);
        $("#"+elementIds.contact_details_zoominfo_profile_url).html(`<a href='${data.zoominfo_contact_profile_url}' target='_blank'><i class="ri-links-line" id=""></i></a>`);
        $("#"+elementIds.contact_details_direct_dial).val(data.direct_phone_number);
        $("#"+elementIds.contact_details_ext).val(data.dial_extension);
        $("#"+elementIds.contact_details_mobile).val(data.mobile_phone);
        $("#"+elementIds.notes).val(data.notes);

        $("#" + elementIds.update_contact_btn).attr("data-campaign-id", payload.campaignId);
        $("#" + elementIds.update_contact_btn).attr("data-company-id", payload.companyId);
        $("#" + elementIds.update_contact_btn).attr("data-contact-id", data.id);
        $("#" + elementIds.update_contact_note_btn).attr("data-campaign-id", payload.campaignId);
        $("#" + elementIds.update_contact_note_btn).attr("data-company-id", payload.companyId);
        $("#" + elementIds.update_contact_note_btn).attr("data-contact-id", data.id);

        currentValues.contactDetails.name = data.first_name + " " + data.last_name;
        currentValues.contactDetails.directDial = (data.direct_phone_number)? data.direct_phone_number : "";
        currentValues.contactDetails.ext = (data.dial_extension)? data.dial_extension : "";
        currentValues.contactDetails.title = (data.job_title)? data.job_title : "";
        currentValues.contactDetails.mobile = (data.mobile_phone)? data.mobile_phone : "";
        currentValues.contactDetails.email = (data.email_address)? data.email_address : "";
        currentValues.contactDetails.aaEmail = (data.aa_email)? data.aa_email : "";
        currentValues.contactDetails.linkedinUrl = (data.linkedin_contact_profile_url)? data.linkedin_contact_profile_url : "";
        currentValues.contactDetails.zoomInfoUrl = (data.zoominfo_contact_profile_url)? data.zoominfo_contact_profile_url : "";

        currentValues.contactNote = (data.notes)? data.notes : "";
    }

    function emptyContactTableBody() {
        $("#" + elementIds.contacts_table_body).html('');
        $("#" + elementIds.contacts_table_div).hide('slow');
        $("#" + elementIds.no_contacts_div).show('slow');
    }

    function populateContactTableBody(data, campaignId, companyId) {
        if(data.length > 0) {
            $("#" + elementIds.contacts_table_div).show('slow');
            $("#" + elementIds.no_contacts_div).hide('slow');
            var contactTableRow = '<tr id=":contact_id" data-campaign-id="'+campaignId+'" data-company-id="'+companyId+'" style="cursor: pointer;">'+
            '                         <td>:prospect_name</td>'+
            '                         <td>:title</td>'+
            '                         <td>:management_level</td>'+
            '                         <td>:direct_dial</td>'+
            '                         <td>:ext</td>'+
            '                         <td>:mobile</td>'+
            '                     </tr>';
            data.forEach(element => {
                var rowHTML = contactTableRow.replace(":id", element.id);
                rowHTML = rowHTML.replace(":contact_id", element.id);
                rowHTML = rowHTML.replace(":id", element.id);
                rowHTML = rowHTML.replace(":prospect_name", element.first_name + " " + element.last_name);
                rowHTML = rowHTML.replace(":title", element.job_title);
                rowHTML = rowHTML.replace(":management_level", element.management_level);
                rowHTML = rowHTML.replace(":direct_dial", (element.direct_phone_number)?element.direct_phone_number:"");
                rowHTML = rowHTML.replace(":ext", (element.dial_extension)?element.dial_extension:"");
                rowHTML = rowHTML.replace(":mobile", (element.mobile_phone)?element.mobile_phone:"");
                $("#" + elementIds.contacts_table_body).append(rowHTML);
            });
            contactTableRowClickEventListener();
        }
    }

    function showUpdateContactButton() {
        $("#" + elementIds.update_contact_btn).show('slow');
        $("#" + elementIds.dismiss_contact_edit_btn).show('slow');
    }
    function hideUpdateContactButton() {
        $("#" + elementIds.update_contact_btn).hide('slow');
        $("#" + elementIds.dismiss_contact_edit_btn).hide('slow');
    }
    function showEditContactButton() {
        // $("#" + elementIds.edit_contact_btn).show('slow');
    }
    function hideEditContactButton() {
        // $("#" + elementIds.edit_contact_btn).hide('slow');
    }

    function showUpdateContactNoteButton() {
        $("#" + elementIds.update_contact_note_btn).show('slow');
        $("#" + elementIds.dismiss_contact_note_edit_btn).show('slow');
    }
    function hideUpdateContactNoteButton() {
        $("#" + elementIds.update_contact_note_btn).hide('slow');
        $("#" + elementIds.dismiss_contact_note_edit_btn).hide('slow');
    }
    function showEditContactNoteButton() {
        // $("#" + elementIds.edit_contact_note_btn).show('slow');
    }
    function hideEditContactNoteButton() {
        // $("#" + elementIds.edit_contact_note_btn).hide('slow');
    }

    function showUpdateCompanyButton() {
        $("#" + elementIds.update_company_btn).show('slow');
        $("#" + elementIds.dismiss_company_edit_btn).show('slow');
    }
    function hideUpdateCompanyButton() {
        $("#" + elementIds.update_company_btn).hide('slow');
        $("#" + elementIds.dismiss_company_edit_btn).hide('slow');
    }
    function showEditCompanyButton() {
        // $("#" + elementIds.edit_company_btn).show('slow');
    }
    function hideEditCompanyButton() {
        // $("#" + elementIds.edit_company_btn).hide('slow');
    }

    function showUpdateCompanyNoteButton() {
        $("#" + elementIds.update_company_note_btn).show('slow');
        $("#" + elementIds.dismiss_company_note_edit_btn).show('slow');
    }
    function hideUpdateCompanyNoteButton() {
        $("#" + elementIds.update_company_note_btn).hide('slow');
        $("#" + elementIds.dismiss_company_note_edit_btn).hide('slow');
    }
    function showEditCompanyNoteButton() {
        // $("#" + elementIds.edit_company_note_btn).show('slow');
    }
    function hideEditCompanyNoteButton() {
        // $("#" + elementIds.edit_company_note_btn).hide('slow');
    }

    function makeContactInputsEditable() {
        $("#" + elementIds.contact_details_prospect_name).removeAttr("disabled");
        $("#" + elementIds.contact_details_direct_dial).removeAttr("disabled");
        $("#" + elementIds.contact_details_ext).removeAttr("disabled");
        $("#" + elementIds.contact_details_title).removeAttr("disabled");
        $("#" + elementIds.contact_details_mobile).removeAttr("disabled");
        $("#" + elementIds.contact_details_email).removeAttr("disabled");
        $("#" + elementIds.contact_details_aa_email).removeAttr("disabled");
        $("#" + elementIds.contact_details_linkedin_profile).removeAttr("disabled");
        $("#" + elementIds.contact_details_zoominfo_profile).removeAttr("disabled");
    }
    function makeContactInputsNonEditable() {
        $("#" + elementIds.contact_details_prospect_name).prop("disabled", "true");
        $("#" + elementIds.contact_details_direct_dial).prop("disabled", "true");
        $("#" + elementIds.contact_details_ext).prop("disabled", "true");
        $("#" + elementIds.contact_details_title).prop("disabled", "true");
        $("#" + elementIds.contact_details_mobile).prop("disabled", "true");
        $("#" + elementIds.contact_details_email).prop("disabled", "true");
        $("#" + elementIds.contact_details_aa_email).prop("disabled", "true");
        $("#" + elementIds.contact_details_linkedin_profile).prop("disabled", "true");
        $("#" + elementIds.contact_details_zoominfo_profile).prop("disabled", "true");
    }

    function makeContactNoteInputsEditable() {
        $("#" + elementIds.notes).removeAttr("disabled");
    }
    function makeContactNoteInputsNonEditable() {
        $("#" + elementIds.notes).val(currentValues.contactNote);
        $("#" + elementIds.notes).prop("disabled", "true");
    }
    function makeCompanyInputsEditable() {
        $("#" + elementIds.company_details_to_dial_extension).removeAttr("disabled");
        $("#" + elementIds.company_details_to_dial_directory).removeAttr("disabled");
        $("#" + elementIds.company_details_to_dial_operator).removeAttr("disabled");
    }
    function makeCompanyInputsNonEditable() {
        $("#" + elementIds.company_details_to_dial_extension).prop("disabled", "true");
        $("#" + elementIds.company_details_to_dial_directory).prop("disabled", "true");
        $("#" + elementIds.company_details_to_dial_operator).prop("disabled", "true");

        $("#" + elementIds.company_details_to_dial_extension).val(currentValues.companyDetails.toDialExtension);
        $("#" + elementIds.company_details_to_dial_directory).val(currentValues.companyDetails.toDialDirectory);
        $("#" + elementIds.company_details_to_dial_operator).val(currentValues.companyDetails.toDialOperator);
    }

    function makeCompanyNoteInputsEditable() {
        $("#" + elementIds.company_notes).val(currentValues.companyNote);
        $("#" + elementIds.company_notes).removeAttr("disabled");

    }
    function makeCompanyNoteInputsNonEditable() {
        $("#" + elementIds.company_notes).val(currentValues.companyNote);
        $("#" + elementIds.company_notes).prop("disabled", "true");
    }

    function handleStoreContact(companyId) {
        var contactData = {
            companyId: companyId,
            salutation: $("#" + elementIds.salutation).val(),
            contactFirstName: $("#" + elementIds.contactFirstName).val(),
            contactLastName: $("#" + elementIds.contactLastName).val(),
            jobTitle: $("#" + elementIds.jobTitle).val(),
            directPhoneNumber: $("#" + elementIds.directPhoneNumber).val(),
            dialExtension: $("#" + elementIds.dialExtension).val(),
            mobilePhone: $("#" + elementIds.mobilePhone).val(),
            emailAddress: $("#" + elementIds.emailAddress).val(),
            zoominfoCompanyProfileURL: $("#" + elementIds.zoominfoCompanyProfileURL).val(),
            linkedinCompanyProfileURL: $("#" + elementIds.linkedinCompanyProfileURL).val(),
        }
        // validate
        if(contactData.contactFirstName.length <= 0) {
            $("#" + elementIds.contactFirstName).addClass("is-invalid");
            return;
        } else {
            $("#" + elementIds.contactFirstName).removeClass("is-invalid");
        }
        if(contactData.contactLastName.length <= 0) {
            $("#" + elementIds.contactLastName).addClass("is-invalid");
            return;
        } else {
            $("#" + elementIds.contactLastName).removeClass("is-invalid");
        }
        if(contactData.emailAddress.length <= 0) {
            $("#" + elementIds.emailAddress).addClass("is-invalid");
            return;
        } else {
            $("#" + elementIds.emailAddress).removeClass("is-invalid");
        }
        
        ajaxService.makeAjaxRequest("POST", urls.storeContactMini, contactData).done(function(data) {
            $("#" + elementIds.create_new_contact_modal).modal("hide");
            toastr["success"](`Contact created Successfully!`);
        }).fail(function(err){
            $("#" + elementIds.create_new_contact_modal).modal("hide");
            toastr["error"](`Something unexpected happened please refresh and try again!`);
        });
        // message
    }

    return {
        addEventListeners: addEventListeners
    }

}();

$(document).ready(function() {

    campaignAccordionService.addEventListeners();

})
