/* 27Mya2014 Sathish Added Bind and persist for federal extension and bank information   */
/* 27May2014 Sathish Added Federal extension filed date  */

var BankDetails;
var ThirdPartyDesignee;
var BankAccountTypeCode;
var taxData;
var taxWrapUpData;

$(document).ready(function () {
    //Added by Praveen T on 29 May 2014
    $('.Title').html(TITLE);    
    NumbersOnly('txtFederalExtensionAmount');
    NumbersOnly('txtBankRoutingNumber');
    NumbersOnly('txtBankAccountNumber');
    NumbersOnly('txtPhoneNumber');
    NumbersOnly('txtPhoneno');

    jQuery.validator.addMethod("validateRoutingNumber",
function (value, element) {
    if ((value != null && value != '')) {

        if (value.length == 9) {
            var firstDigit = parseInt(value.substring(0, 1));
            var secondDigit = parseInt(value.substring(1, 2));


            if (firstDigit == 0) {

                return true;
            }
            else {
                var firstTwoDigit = parseInt(value.substring(0, 2));

                if ((firstTwoDigit >= 10 && firstTwoDigit <= 12) || (firstTwoDigit >= 20 && firstTwoDigit <= 32)) {

                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }
    else
        return true;
}, ""
);


    $("#taxesandwrapupinfo").validate({
        rules: {
            txtFederalExtensionFiledDate:
                {
                    validateDate: function () { $('#divFederalExtensionFiledDate').html(''); true; },
                },
            txtDatePaid:
                {
                    validateDate: function () { $('#divDatePaid').html(''); true; }
                },
            txtDateOfFiling:
                {
                    validateDate: function () { $('#divDateOfFiling').html(''); true; }
                },
            txtPhoneNumber:
                {
                    minlength: 12,
                    maxlength: 12,
                    validatePhoneNumber: true
                },
            txtPhoneno:
                {
                    minlength: 12,
                    maxlength: 12,
                    validatePhoneNumber: true
                },
            txtBankRoutingNumber:
                {
                    minlength: 9,
                    maxlength: 9,
                    validateRoutingNumber: true
                },
            txtBankAccountNumber:
                  {
                      minlength: 4,
                      maxlength: 17,
                  }
        },
        messages: {
            txtFederalExtensionFiledDate:
                {
                    validateDate: function () { $('#divFederalExtensionFiledDate').html('Enter a valid date'); }
                },
            txtDatePaid:
                {
                    validateDate: function () { $('#divDatePaid').html('Enter a valid date'); }
                },
            txtDateOfFiling:
                {
                    validateDate: function () { $('#divDateOfFiling').html('Enter a valid date'); }
                },
            txtPhoneNumber:
                {
                    minlength: "Invalid Phone Number",
                    maxlength: "Invalid Phone Number",
                    validatePhoneNumber: "Invalid Phone Number"
                },
            txtPhoneno:
                {
                    minlength: "Invalid Phone Number",
                    maxlength: "Invalid Phone Number",
                    validatePhoneNumber: "Invalid Phone Number"
                },
            txtBankRoutingNumber:
                {
                    minlength: "Invalid Routing Number",
                    maxlength: "Invalid Routing Number",
                    validateRoutingNumber: "Invalid Routing Number",
                },
            txtBankAccountNumber:
                  {
                      minlength: "Invalid Account Number",
                      maxlength: "Invalid Account Number"
                  }
        }
    });

    //Thileep added datepicker event on 12Jun2014
    //vivek modified by vivek for the future year before 15-Apr-2015 modified on 17-jun-14
    //18-Jun-2014, BalaRemoved hard code filing date
    $('#divExtensionFiledDate').datepicker({
        format: "mm/dd/yyyy",
        // endDate: '+0d',
        //startView: "decade",
        minViewMode: "day",
        startDate: FILING_START_DATE,
        endDate: FILING_END_DATE,
        autoclose: true,
        forceParse: false,
        onClose: function () { $(this).valid(); },
    });

    $('#divExtensionFiledDate').on('changeDate', function (ev) {
        $(this).datepicker('hide');
        $('#divFederalExtensionFiledDate').html('');

        if ($('#txtFederalExtensionFiledDate').val() != "") {
            $('#divFederalExtensionFiledDate').html('');
        }
        else {
            $('#divFederalExtensionFiledDate').html('Missing Extension Filing Date');
        }
    });

    //Thileep added datepicker event on 12Jun2014
    //Modified by prasana for displaying date between 01.01.2015 to 04.15.2015
    //18-Jun-2014, BalaRemoved hard code filing date
    $('#divAmountPaidDate').datepicker({
        format: "mm/dd/yyyy",
        //startView: "decade",
        minViewMode: "day",
        startDate: FILING_START_DATE,
        endDate: FILING_END_DATE,
        autoclose: true,
       // endDate: '+0d',
        forceParse: false,
        onClose: function () { $(this).valid(); },
    });

    $('#divAmountPaidDate').on('changeDate', function (ev) {
        $(this).datepicker('hide');
        $('#divDatePaid').html('');

        if ($('#txtDatePaid').val() != "") {
            $('#divDatePaid').html('');
        }
        else {
            $('#divDatePaid').html('Missing Paid Date');
        }
    });

    //Thileep added datepicker event on 12Jun2014
    //18-Jun-2014, BalaRemoved hard code filing date
    $('#divFilingDate').datepicker({
        format: "mm/dd/yyyy",
        minViewMode: "day",
        startDate: FILING_END_DATE,
        autoclose: true,
      //  endDate: '+0d',
        forceParse: false,
        onClose: function () { $(this).valid(); },
    });

    $('#divFilingDate').on('changeDate', function (ev) {
        $(this).datepicker('hide');
        $('#divDateOfFiling').html('');

        if ($('#txtDateOfFiling').val() != "") {
            $('#divDateOfFiling').html('');
        }
        else {
            $('#divDateOfFiling').html('Missing Filing Date');
        }
    });
    //vivek 30-june-14 for the calendar focus
    $('#chkFiledForm4868').focusin(function () {
        $('#divExtensionFiledDate').datepicker('hide');
    });
    //vivek 30-june-14 for the calendar focus
    $('#chkFederalExtensionPaid').focusin(function () {
        $('#divExtensionFiledDate').datepicker('hide');
    });
    //vivek 30-june-14 for the calendar focus
    $('#chklateFiling').focusin(function () {
        $('#divAmountPaidDate').datepicker('hide');
    });
    //vivek 30-june-14 for the calendar focus
    $('#txtFederalExtensionAmount').focusin(function () {
        $('#divAmountPaidDate').datepicker('hide');
    });
    //vivek 30-june-14 for the calendar focus
    $('#btnSubmitOne').focusin(function () {
        $('#divFilingDate').datepicker('hide');
    });
    //vivek 30-june-14 for the calendar focus
    $('#chklateFiling').focusin(function () {
        $('#divFilingDate').datepicker('hide');
    });
    $("#txtFederalExtensionAmount").bind("keyup paste", function () {
        setTimeout(jQuery.proxy(function () {
            this.val(this.val().replace(/[^0-9.]/g, ''));
        }, $(this)), 0);
    });



    $('.spanFillingYear').html(FILLING_YEAR);


    $('#chkFiledForm4868').change(function () {
        if ($('#chkFiledForm4868').prop('checked'))
            $('#divFiledForm4868ForFederalExtension').show();
        else {
            $('#divFiledForm4868ForFederalExtension').hide();
            $('#txtFederalExtensionFiledDate').val('');
        }
    });

    $('#chkFederalExtensionPaid').change(function () {
        if ($('#chkFederalExtensionPaid').prop('checked'))
            $('#divFederalExtensionPaidShow').show();
        else {
            $('#divFederalExtensionPaidShow').hide();
            $('#txtFederalExtensionAmount').val('');
            $('#txtDatePaid').val('');
        }
    });
    $('#chklateFiling').change(function () {
        if ($('#chklateFiling').prop('checked')) {
            $('#divLateFilingShow').show();
            //18Jun2014, Bala, Since Datepicker showing date from filing due date, so code commented
            //$('#txtDateOfFiling').val($.datepicker.formatDate('mm/dd/yy', new Date()));
        }
        else {
            $('#divLateFilingShow').hide();
            $('#txtDateOfFiling').val('');
        }
    });

    $("[name='radIsDirectDeposit']").change(function () {
        if ($('#radIsDirectDepositYes').prop('checked')) {
            $("#divDirectDepositofFederalTaxRefund").show();
        }
        else if ($('#radIsDirectDepositNo').prop('checked')) {
            $("#divDirectDepositofFederalTaxRefund").hide();
            $('#txtBankName').val('');
            $('#txtBankRoutingNumber').val('');
            $('#txtBankAccountNumber').val('');
            $("#radChecked").prop("checked", false);
            $("#radSaved").prop("checked", false);
        }
    });

    $("[name='radIsAllowOtherPerson']").change(function () {
        if ($('#radIsAllowOtherPersonYes').prop('checked')) {
            $("#divOtherPerson").show();

        }
        else if ($('#radIsAllowOtherPersonNo').prop('checked')) {
            $("#divOtherPerson").hide();
            $('#txtDesignName').val('');
            $('#txtPhoneno').val('');
            $('#txtPersonalIdentificationNumber').val('');

        }
    });

    //Get Tax and Wrap up data
    $.ajax({
        url: serviceUrl + 'taxesandwrapup/gettaxandwrapup',
        async: false,
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader("X-Token", window.sessionStorage.getItem("EncryptedTocken"));
        },
        data: JSON.stringify({
            userId: userId,
            userDataId: userDataId,
        }
        ),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        error: function (jqXHR, textStatus, errorThrown) {
            ErrorHandling(jqXHR, errorThrown);
        },
        success: function (data, textStatus) {
            if (data != null) {
                if (data.m_Item1 != null) {
                    taxWrapUpData = data.m_Item1;
                    $('#chkFiledForm4868').prop('checked', data.m_Item1.HasFiledForm4868);
                    $('#chkFiledForm4868').trigger('change');
                    if (data.m_Item1.FederalExtensionFiledDate != null)
                        $("#txtFederalExtensionFiledDate").val($.datepicker.formatDate('mm/dd/yy', new Date(data.m_Item1.FederalExtensionFiledDate)));
                    $('#chkFederalExtensionPaid').prop('checked', data.m_Item1.HasPaidFederalExtensionWithForm4868);
                    $('#chkFederalExtensionPaid').trigger('change');
                    $("#txtFederalExtensionAmount").val(data.m_Item1.FederalExtensionAmount);
                    if (data.m_Item1.FederalExtensionAmountPaidDate != null)
                        $("#txtDatePaid").val($.datepicker.formatDate('mm/dd/yy', new Date(data.m_Item1.FederalExtensionAmountPaidDate)));

                    $('#chklateFiling').prop('checked', data.m_Item1.IsFilingReturnAfterDueDate);
                    $('#chklateFiling').trigger('change');
                    if (data.m_Item1.FilingDate != null)
                        //filingDate = data.m_Item1.FilingDate;
                        $("#txtDateOfFiling").val($.datepicker.formatDate('mm/dd/yy', new Date(data.m_Item1.FilingDate)));

                    $('#radIsDirectDepositYes').prop('checked', data.m_Item1.HasToDepositTaxRefundsToBankAccount);
                    $("[name='radIsDirectDeposit']").trigger('change');
                    if (data.m_Item1.BankDetails != null) {
                        $("#txtBankRoutingNumber").val(data.m_Item1.BankDetails.RoutingTransitNumber);
                        $("#txtBankAccountNumber").val(data.m_Item1.BankDetails.AccountNumber);
                        $("#txtBankName").val(data.m_Item1.BankDetails.BankName);
                        if (data.m_Item1.BankDetails.BankAccountTypeCode == 1) {
                            $("#radChecked").prop("checked", true);
                        }
                        else if (data.m_Item1.BankDetails.BankAccountTypeCode == 2) {
                            $('#radSaved').prop('checked', true);
                        }
                    }

                    $('#radIsAllowOtherPersonYes').prop('checked', data.m_Item1.HasThirdPartyDesignee),
                    $("[name='radIsAllowOtherPerson']").trigger('change');
                    if (data.m_Item1.ThirdPartyDesignee != null) {
                        $("#txtDesignName").val(data.m_Item1.ThirdPartyDesignee.DesigneeName),
                        $("#txtPhoneno").val(data.m_Item1.ThirdPartyDesignee.PhoneNumber),
                        $("#txtPersonalIdentificationNumber").val(data.m_Item1.ThirdPartyDesignee.PIN)
                    }
                    $("#txtIncareof").val(data.m_Item1.InCareOf),
                   $("#txtPhoneNumber").val(data.m_Item1.InCareOfPhoneNumber)

                }
            }
            //19Jun2014, Bala, Since Datepicker showing date from filing due date, so code commented
            //if (data == null || data.m_Item1 == null || data.m_Item1.FilingDate == null) {
            //    if (data.m_Item1.IsFilingReturnAfterDueDate && data.m_Item3 != null)
            //        $("#txtDateOfFiling").val($.datepicker.formatDate('mm/dd/yy', new Date(data.m_Item3)));
            //}
        }
    });

    $('#btnSubmitOne').click(function () {
        $('#collapselinkOne').removeClass('accordion-toggle').addClass('accordion-toggle collapsed');
        $('#collapselinktwo').removeClass('accordion-toggle collapsed').addClass('accordion-toggle ');
        if ($("#taxesandwrapupinfo").valid()) {
            $('#collapseTwo').removeClass('panel-collapse collapse').addClass('panel-collapse collapse in');
            $('#collapseOne').removeClass('panel-collapse collapse in').addClass('panel-collapse collapse');
        }
        return false;
    });

    //Added by Prasana on 04.06.2014
    $(function () {
        $("#DateFiledForExtension").popover({ title: '', content: "<h5>Date Filed for Extension</h5>Enter the filed date of your Form 4868 -Individual tax return Extension.<br/><a href='' target='_blank' class='more'>Read Common Question</a>" });
        $("#FederalExtensionAmount").popover({ title: '', content: "<h5>Federal Extension Amount</h5>Enter the tax extension amount that you paid along with Federal Form 4868.<br/><a href='' target='_blank' class='more'>Read Common Question</a>" });
        $("#DatePaid").popover({ title: '', content: "<h5>Date Paid</h5>Enter the paid date of Federal tax extension amount.<br/> <a href='' target='_blank' class='more'>Read Common Question</a>" });
        $("#DateOfFiling").popover({ title: '', content: "<h5>Date of Filing Your Tax return</h5>Select your filing date of your federal tax return.  The penalties and Interest for Late filing and late payment will be calculated up to filing date of tax return.<br/> <a href='' target='_blank' class='more'>Read Common Question</a>" });
        $("#BankName").popover({ title: '', content: "<h5>Bank Name</h5>Enter your Bank name for direct deposit of Your Federal tax refund.<br/> <a href='' target='_blank' class='more'>Read Common Question</a>" });
        $("#BankRoutingNumber").popover({ title: '', content: "<h5>Bank Routing Number</h5>Enter your 9 digit Routing transit number of your Bank account. (Example – 125698696).<br/> <a href='' target='_blank' class='more'>Read Common Question</a>" });
        $("#BankAccountNumber").popover({ title: '', content: "<h5>Bank Account Number</h5>Enter your Bank account number for direct deposit of Federal tax refund. (Example   A/c no:  01569658968969).<br/> <a href='' target='_blank' class='more'>Read Common Question</a>" });
        $("#DesignName").popover({ title: '', content: "<h5>Designee Name</h5>Enter the Third party designee name of the person that you allow discussion return by IRS.<br/> <a href='' target='_blank' class='more'>Read Common Question</a>" });
        $("#Phoneno").popover({ title: '', content: "<h5>Phone No</h5>Enter the Third party designee phone Number of the person that you allow discussion return by IRS. (Example – (818) – 896-8965).<br/> <a href='' target='_blank' class='more'>Read Common Question</a>" });
        $("#PersonalIdentificationNumber").popover({ title: '', content: "<h5>Personal Identification No</h5>Enter the Third party designee Personal identification number of the person that you allow discussion return by IRS. (Example – 256-68-9856).<br/> <a href='' target='_blank' class='more'>Read Common Question</a>" });
        $("#Incareof").popover({ title: '', content: "<h5>In Care of</h5>Enter your Bookkeeper or Accountant name of the person who taking care of your books.<br/><a href='' target='_blank' class='more'>Read Common Question</a>" });
        $("#PhoneNumber").popover({ title: '', content: "<h5>Phone Number</h5>Enter the 10 digits phone number of your In Care provider. Example – (818)915-6589.<br/> <a href='' target='_blank' class='more'>Read Common Question</a>" });
    });


    pageURL = window.location.search.substring(1);
    parameterName = pageURL.split('-');
    if (parameterName.length == 2) {
        var divToExpand = parameterName[0];
        var controlToFocus = parameterName[1];
        $('#collapseOne').removeClass('panel-collapse collapse in').addClass('panel-collapse collapse');
        $('#' + divToExpand).addClass('panel-collapse collapse in');
        $('#' + controlToFocus).focus();
    }


});



// 28May2014 Sathish Persist Tax and wrap up data
function PersistTaxAndwrapup(isContinue) {

    if ($("#taxesandwrapupinfo").valid()) {


        if ($('#radChecked').prop('checked')) {
            BankAccountTypeCode = 1;
        }
        else if ($('#radSaved').prop('checked')) {
            BankAccountTypeCode = 2;
        }
        if ($('#radIsDirectDepositYes').prop('checked')) {
            BankDetails = {
                RoutingTransitNumber: $('#txtBankRoutingNumber').val(),
                AccountNumber: $('#txtBankAccountNumber').val(),
                BankName: $('#txtBankName').val(),
                BankAccountTypeCode: BankAccountTypeCode
            }
        }
        else {
            BankDetails = null;
        }
        if ($('#radIsAllowOtherPersonYes').prop('checked')) {
            ThirdPartyDesignee =
            {
                DesigneeName: $('#txtDesignName').val(),
                PhoneNumber: $('#txtPhoneno').val(),
                PIN: $('#txtPersonalIdentificationNumber').val(),
            }
        }
        else {
            ThirdPartyDesignee = null;
        }

        var federalExtensionFiledDate = null;
        if ($('#chkFiledForm4868').prop('checked'))
            federalExtensionFiledDate = $('#txtFederalExtensionFiledDate').val();

        var federalExtensionAmount = null;
        var federalExtensionAmountPaidDate = null;
        if ($('#chkFederalExtensionPaid').prop('checked')) {
            federalExtensionAmount = $('#txtFederalExtensionAmount').val();
            federalExtensionAmountPaidDate = $('#txtDatePaid').val();
        }


        var filingDate = null;
        if ($('#chklateFiling').prop('checked')) {
            filingDate = $('#txtDateOfFiling').val();
        }


        if (taxWrapUpData != null) {
            taxData = {
                HasOwedHouseholdEmploymentTax: taxWrapUpData.HasOwedHouseholdEmploymentTax,
                HasAlternativeMinimumTax: taxWrapUpData.HasAlternativeMinimumTax,
                HasAdditionalSocialSecurityOrMedicareTax: taxWrapUpData.HasAdditionalSocialSecurityOrMedicareTax,
                HasFederalQuarterlyEstimatesPaid: taxWrapUpData.HasFederalQuarterlyEstimatesPaid,
                HasFiledForm4868: $('#chkFiledForm4868').prop('checked'),
                FederalExtensionFiledDate: federalExtensionFiledDate,
                HasPaidFederalExtensionWithForm4868: $('#chkFederalExtensionPaid').prop('checked'),
                FederalExtensionAmount: federalExtensionAmount,
                FederalExtensionAmountPaidDate: federalExtensionAmountPaidDate,
                IsFilingReturnAfterDueDate: $('#chklateFiling').prop('checked'),
                FilingDate: filingDate,
                HasToDepositTaxRefundsToBankAccount: $('#radIsDirectDepositYes').prop('checked'),
                HasThirdPartyDesignee: $('#radIsAllowOtherPersonYes').prop('checked'),
                InCareOf: $('#txtIncareof').val(),
                InCareOfPhoneNumber: $('#txtPhoneNumber').val(),
                BankDetails: BankDetails,
                ThirdPartyDesignee: ThirdPartyDesignee
            }
        }
        else {
            taxData = {
                HasFiledForm4868: $('#chkFiledForm4868').prop('checked'),
                FederalExtensionFiledDate: federalExtensionFiledDate,
                HasPaidFederalExtensionWithForm4868: $('#chkFederalExtensionPaid').prop('checked'),
                FederalExtensionAmount: federalExtensionAmount,
                FederalExtensionAmountPaidDate: federalExtensionAmountPaidDate,
                IsFilingReturnAfterDueDate: $('#chklateFiling').prop('checked'),
                FilingDate: filingDate,
                HasToDepositTaxRefundsToBankAccount: $('#radIsDirectDepositYes').prop('checked'),
                HasThirdPartyDesignee: $('#radIsAllowOtherPersonYes').prop('checked'),
                InCareOf: $('#txtIncareof').val(),
                InCareOfPhoneNumber: $('#txtPhoneNumber').val(),
                BankDetails: BankDetails,
                ThirdPartyDesignee: ThirdPartyDesignee
            }
        }

        $.ajax({
            url: serviceUrl + 'taxesandwrapup/persisttaxesandwrapupdata',
            async: false,
            dataType: "json",
            beforeSend: function (request) {
                request.setRequestHeader("X-Token", window.sessionStorage.getItem("EncryptedTocken"));
            },
            data: JSON.stringify({
                userId: userId,
                TaxReturnData:
                     {
                         userDataId: userDataId,
                         TaxData: JSON.stringify(taxData),
                     }
            }),
            type: "POST",
            contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                ErrorHandling(jqXHR, errorThrown);
            },
            success: function (data, textStatus) {
                window.sessionStorage.setItem("UserDataId", data.m_Item1);
                if (isContinue) {
                    PageNavigate(data.m_Item2);
                    return false;
                }
            }
        });
    }
}

function PageNavigate(isdiagonstics) {

    if (isdiagonstics) {
        setTimeout(function () {
            window.location.href = '../Diagnostics/finaldiagnostics.html?Topic=TaxesAndWrapUp';
        });
    }
    else {
        setTimeout(function () {
            window.location.href = '../TaxesAndWrapUp/federaltaxsummary.html';
        });
    }
}



