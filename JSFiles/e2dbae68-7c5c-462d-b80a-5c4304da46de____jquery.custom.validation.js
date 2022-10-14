/*!
 * jQuery Custom Validation Plugin v1.0
 * Copyright (c) 2016 Velocity Software Solutions
 */
 

$(function () {

    "use strict";

    //Add New Method for - Price - Mandatory + Minimum Length 1 + Maximum Length 16 (Including Decimal Dot & 2 decimal values)
    jQuery.validator.addMethod("price", function (value, element) {
        if ($.trim(value) == "" || $.trim(value).length < 1 || $.trim(value).length > 16 || !/^\d{0,16}(\.\d{0,2})?$/.test(value)) {
            return false;
        } else {
            return true;
        }
    }, messages.price);

    //Add New Method for - Decimal - Optional + Minimum Length 1 + Maximum Length 16 (Including Decimal Dot & 2 decimal values)
    jQuery.validator.addMethod("decimalNotRequired", function (value, element) {
        if ($.trim(value).length > 16 || !/^\d{0,16}(\.\d{0,2})?$/.test(value)) {
            return false;
        } else {
            return true;
        }
    }, messages.price);

    //Add New Method for - Email - Mandatory + Email Validation
    jQuery.validator.addMethod("email", function (value, element) {
        if ($.trim(value) == "" || !/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)) {
            return false;
        } else {
            return true;
        }
    }, messages.email);

    //Add New Method for - Password - Mandatory + Minimum Length 5 + Maximum Length 10 + At least one Capital Letter + At least one Special Character + At least one Number
    jQuery.validator.addMethod("passwd", function (value, element) {
        if ($.trim(value) == "" || $.trim(value).length < 5 || $.trim(value).length > 10 || !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,10}/.test(value)) {
            return false;
        } else {
            if (/[A-Z]/.test(value) == true) {
                return true;
            } else {
                return false;
            }
        }
    }, messages.passwd);

    //Add New Method for - Password Edit - Optional + Minimum Length 5 + Maximum Length 10 + At least one Capital Letter + At least one Special Character + At least one Number
    jQuery.validator.addMethod("notRequiredPasswd", function (value, element) {
        if ($.trim(value) == "") {
            return true;
        } else if ($.trim(value) != "" && ($.trim(value).length < 5 || $.trim(value).length > 10 || !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,10}/.test(value))) {
            return false;
        } else {
            if (/[A-Z]/.test(value) == true) {
                return true;
            } else {
                return false;
            }
        }
    }, messages.notRequiredPasswd);

    //Add New Method for - Mobile No. - Mandatory + Number + Total Length 10
    jQuery.validator.addMethod("mobile", function (value, element) {
        if ($.trim(value) == "" || $.trim(value).length != 10 || !/^\d{10}?$/.test(value)) {
            return false;
        } else {
            return true;
        }
    }, messages.mobile);


    //Add New Method for - Address Line 1 - Mandatory + Minimum Length 2 + Maximum Length 255
    jQuery.validator.addMethod("addressLine1", function (value, element) {
        if ($.trim(value) == "" || $.trim(value).length < 2 || $.trim(value).length > 255) {
            return false;
        } else {
            return true;
        }
    }, messages.addressLine1);

    //Add New Method for - Address Line 2 - Optional + Minimum Length 2 + Maximum Length 255
    jQuery.validator.addMethod("addressLine2", function (value, element) {
        if ($.trim(value) == "") {
            return true;
        } else if ($.trim(value) != "" && ($.trim(value).length < 2 || $.trim(value).length > 255)) {
            return false;
        } else {
            return true;
        }
    }, messages.addressLine2);

    //Add New Method for - Digits - Mandatory + Only Number
    jQuery.validator.addMethod("digit", function (value, element) {
        if ($.trim(value) == "" || !/^\d+$/.test(value)) {
            return false;
        } else {
            return true;
        }
    }, messages.digit);

    //Add New Method for - Digits - Optional + Only Number
    jQuery.validator.addMethod("notRequiredDigit", function (value, element) {
        if ($.trim(value) == "") {
            return true;
        } else if (!/^\d+$/.test(value)) {
            return false;
        } else {
            return true;
        }
    }, messages.notRequiredDigit);


    //Add New Method for - Mandatory
    jQuery.validator.addMethod("mandatory", function (value, element) {
        if ($.trim(value) == "") {
            return false;
        } else {
            return true;
        }
    }, messages.mandatory);

    //Add New Method for - Mandatory + Minimum Length 1 + Maximum Length 60
    jQuery.validator.addMethod("firstname", function (value, element) {
        if ($.trim(value) == "" || $.trim(value).length < 1 || $.trim(value).length > 60) {
            return false;
        } else {
            return true;
        }
    }, messages.firstname);

    //Add New Method for - Mandatory + Minimum Length 1 + Maximum Length 60
    jQuery.validator.addMethod("lastname", function (value, element) {
        if ($.trim(value) == "" || $.trim(value).length < 1 || $.trim(value).length > 60) {
            return false;
        } else {
            return true;
        }
    }, messages.lastname);

    //Add New Method for - Optional + Minimum Length 1 + Maximum Length 60
    jQuery.validator.addMethod("middlename", function (value, element) {
        if ($.trim(value) == "") {
            return true;
        } else if ($.trim(value) != "" && ($.trim(value).length < 1 || $.trim(value).length > 60)) {
            return false;
        } else {
            return true;
        }
    }, messages.middlename);

    //Add New Method for - Mandatory + Minimum Length 2 + Maximum Length 60 + No Special Character
    jQuery.validator.addMethod("requiredMin2Max60NoSpecial", function (value, element) {
        if ($.trim(value) == "" || $.trim(value).length < 2 || $.trim(value).length > 60 || !/^[a-zA-Z0-9]+$/.test(value)) {
            return false;
        } else {
            return true;
        }
    }, messages.requiredMin2Max60NoSpecial);

    //Add New Method for - Mandatory + IP
    jQuery.validator.addMethod("requiredip", function (value, element) {
//var testip = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
        var testip4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
//		var testip6 = ^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$;
        
		if ($.trim(value) == "" || !value.match(testip4)) {
            return false;
        } else {
            return true;
        }
    }, messages.requiredip);

    //Add New Method for - Optional + IP
    jQuery.validator.addMethod("optionalip", function (value, element) {

        var testip = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if ($.trim(value) == "" || !value.match(testip)) {
            return false;
        } else {
            return true;
        }
    }, messages.optionalip);

    //Add New Method for - Mandatory + Image(gif, png,jpeg,jpg) + Maximum size 2 MB
    jQuery.validator.addMethod("requiredimage", function (value, element) {
        if ($.trim(value) != "") {
            var Extension = value.substring(value.lastIndexOf('.') + 1).toLowerCase();
            var jquery_object = jQuery(element);
            if (Extension == "jpeg" || Extension == "JPEG" || Extension == "png" || Extension == "jpg" || Extension == "gif") {
                if (jquery_object.prop("files")[0].size > 2097152) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }, messages.requiredimage);

    //Add New Method for - Optional + Image(gif, png,jpeg,jpg) + Maximum size 2 MB
    jQuery.validator.addMethod("optionalimage", function (value, element) {
        if ($.trim(value) != "") {
            var Extension = value.substring(value.lastIndexOf('.') + 1).toLowerCase();
            var jquery_object = jQuery(element);
            if (Extension == "jpeg" || Extension == "JPEG" || Extension == "png" || Extension == "jpg" || Extension == "gif") {
                if (jquery_object.prop("files")[0].size > 2097152) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return true;
        }
    }, messages.optionalimage);

    //Add New Method for - Madatory + Albhabets only
    jQuery.validator.addMethod("requiredcharonly", function (value, element) {
        if ($.trim(value) == "" || !/^[a-z]+$/i.test(value)) {
            return false;
        } else {
            return true;
        }
    }, messages.requiredcharonly);

    //Add New Method for - optional + Albhabets only
    jQuery.validator.addMethod("optionalcharonly", function (value, element) {
        if ($.trim(value) != "") {
            if (!/^[a-z]+$/i.test(value)) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }

    }, messages.optionalcharonly);

    //Add New Method for - optional + No speical character + Minimum Length 2 + Maximum Length 255
    jQuery.validator.addMethod("barcode", function (value, element) {
        if ($.trim(value) != "") {
            if ($.trim(value).length < 2 || $.trim(value).length > 255) {
                return false;
            } else {
                if (/^[ A-Za-z0-9_+./#-]*$/.test(value)) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return true;
        }
    }, messages.barcode);

    //Add New Method for - optional + No speical character + Minimum Length 2 + Maximum Length 255
    jQuery.validator.addMethod("ean", function (value, element) {
        if ($.trim(value) != "") {
            if ($.trim(value).length < 2 || $.trim(value).length > 14) {
                return false;
            } else {
                if (/^[ A-Za-z0-9_+./#-]*$/.test(value)) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return true;
        }
    }, messages.ean);

    //Add New Method for - optional + No speical character +  Minimum Length 2 + Maximum Length 12
    jQuery.validator.addMethod("upc", function (value, element) {
        if ($.trim(value) != "") {
            if ($.trim(value).length < 2 || $.trim(value).length > 12) {
                return false;
            } else {
                if (/^[ A-Za-z0-9_+./#-]*$/.test(value)) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return true;
        }
    }, messages.upc);

    //Add New Method for - optional + No speical character +  Minimum Length 1 + Maximum Length 10
    jQuery.validator.addMethod("size", function (value, element) {
        if ($.trim(value) != "") {
            if ($.trim(value).length < 1 || $.trim(value).length > 10) {
                return false;
            } else {
                if (/^[ A-Za-z0-9_+./#-]*$/.test(value)) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return true;
        }
    }, messages.size);

    //Add New Method for - Mandatory + URL +  Minimum Length 5 + Maximum Length 2083
    jQuery.validator.addMethod("requiredurl", function (value, element) {
        if ($.trim(value) != "") {
            if ($.trim(value).length < 5 || $.trim(value).length > 2083) {
                return false;
            } else {
                var res = value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
                if (res == null)
                    return false;
                else
                    return true;
            }
        } else {
            return false;
        }
    }, messages.requiredurl);

    //Add New Method for - Optional + URL +  Minimum Length 5 + Maximum Length 2083
    jQuery.validator.addMethod("optionalurl", function (value, element) {
        if ($.trim(value) != "") {
            if ($.trim(value).length < 5 || $.trim(value).length > 2083) {
                return false;
            } else {
                var res = value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
                if (res == null)
                    return false;
                else
                    return true;
            }
        } else {
            return true;
        }
    }, messages.optionalurl);

    //Add New Method for - optional +  Minimum Length 2 + Maximum Length 255
    jQuery.validator.addMethod("carrier", function (value, element) {
        if ($.trim(value) != "") {
            if ($.trim(value).length < 2 || $.trim(value).length > 255) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }, messages.carrier);

    //Add New Method for - optional +  Minimum Length 2 + Maximum Length 64
    jQuery.validator.addMethod("brand", function (value, element) {
        if ($.trim(value) != "") {
            if ($.trim(value).length < 2 || $.trim(value).length > 64) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }, messages.brand);

    //Add New Method for - optional +  Minimum Length 2 + Maximum Length 32
    jQuery.validator.addMethod("optionalcompany", function (value, element) {
        if ($.trim(value) != "") {
            if ($.trim(value).length < 2 || $.trim(value).length > 32) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }, messages.optionalcompany);

    //Add New Method for - Mandatory +  Minimum Length 2 + Maximum Length 32
    jQuery.validator.addMethod("requiredcompany", function (value, element) {
        if ($.trim(value) == "" || $.trim(value).length < 2 || $.trim(value).length > 32) {
            return false;
        } else {
            return true;
        }
    }, messages.requiredcompany);

    //Add New Method for - optional + No speical character + Minimum Length 2 + Maximum Length 64
    jQuery.validator.addMethod("sku", function (value, element) {
        if ($.trim(value) != "") {
            if ($.trim(value).length < 2 || $.trim(value).length > 64) {
                return false;
            } else {
                if (/^[ A-Za-z0-9_+./#-]*$/.test(value)) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return true;
        }
    }, messages.sku);

    //Add New Method for - Mandatory + date in mmddyy format
    jQuery.validator.addMethod("requiredmmddyy", function (value, element) {
        if ($.trim(value) != "") {
            var dateformat = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
            var val = $.trim(value);
            if (val != '') {
                if (val.match(dateformat)) {
                    var opera1 = val.split('/');
                    var opera2 = val.split('-');
                    var lopera1 = opera1.length;
                    var lopera2 = opera2.length;
                    // Extract the string into month, date and year  
                    if (lopera1 > 1)
                    {
                        var pdate = val.split('/');
                    }
                    else if (lopera2 > 1)
                    {
                        var pdate = val.split('-');
                    }
                    var mm = parseInt(pdate[0]);
                    var dd = parseInt(pdate[1]);
                    var yy = parseInt(pdate[2]);
                    if (yy < 1970) {
                        return false;
                    }
                    // Create list of days of a month [assume there is no leap year by default]  
                    var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if (mm == 1 || mm > 2)
                    {
                        if (dd > ListofDays[mm - 1])
                        {
                            return false;
                        }
                    }
                    if (mm == 2)
                    {
                        var lyear = false;
                        if ((!(yy % 4) && yy % 100) || !(yy % 400))
                        {
                            lyear = true;
                        }
                        if ((lyear == false) && (dd >= 29))
                        {
                            return false;
                        }
                        if ((lyear == true) && (dd > 29))
                        {
                            return false;
                        }
                    }
                }
                else
                {
                    return false;
                }
            } else {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }, messages.requiredmmddyy);

    //Add New Method for - Optional + date in mmddyy format
    jQuery.validator.addMethod("optionalmmddyy", function (value, element) {
        if ($.trim(value) != "") {
            var dateformat = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
            var return_val = true;
            var val = $.trim(value);
            if (val != '') {
                if (val.match(dateformat)) {
                    var opera1 = val.split('/');
                    var opera2 = val.split('-');
                    var lopera1 = opera1.length;
                    var lopera2 = opera2.length;
                    // Extract the string into month, date and year  
                    if (lopera1 > 1)
                    {
                        var pdate = val.split('/');
                    }
                    else if (lopera2 > 1)
                    {
                        var pdate = val.split('-');
                    }
                    var mm = parseInt(pdate[0]);
                    var dd = parseInt(pdate[1]);
                    var yy = parseInt(pdate[2]);
                    if (yy < 1970) {
                        return false;
                    }
                    // Create list of days of a month [assume there is no leap year by default]  
                    var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if (mm == 1 || mm > 2)
                    {
                        if (dd > ListofDays[mm - 1])
                        {
                            return false;
                        }
                    }
                    if (mm == 2)
                    {
                        var lyear = false;
                        if ((!(yy % 4) && yy % 100) || !(yy % 400))
                        {
                            lyear = true;
                        }
                        if ((lyear == false) && (dd >= 29))
                        {
                            return false;
                        }
                        if ((lyear == true) && (dd > 29))
                        {
                            return false;
                        }
                    }
                }
                else
                {
                    return false;
                }
            } else {
                return false;
            }
            return true;
        } else {
            return true;
        }
    }, messages.optionalmmddyy);

    //Add New Method for - Mandatory + date in ddmmyy format
    jQuery.validator.addMethod("requiredddmmyy", function (value, element) {
        if ($.trim(value) != "") {

            var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
            var return_val = true;
            var val = $.trim(value);
            if (val != '') {
                if (val.match(dateformat))
                {
                    var opera1 = val.split('/');
                    var opera2 = val.split('-');
                    var lopera1 = opera1.length;
                    var lopera2 = opera2.length;
                    if (lopera1 > 1)
                    {
                        var pdate = val.split('/');
                    }
                    else if (lopera2 > 1)
                    {
                        var pdate = val.split('-');
                    }
                    var dd = parseInt(pdate[0]);
                    var mm = parseInt(pdate[1]);
                    var yy = parseInt(pdate[2]);
                    if (yy < 1970) {
                        return false;
                    }
                    var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if (mm == 1 || mm > 2)
                    {
                        if (dd > ListofDays[mm - 1])
                        {
                            return false;
                        }
                    }
                    if (mm == 2)
                    {
                        var lyear = false;
                        if ((!(yy % 4) && yy % 100) || !(yy % 400))
                        {
                            lyear = true;
                        }
                        if ((lyear == false) && (dd >= 29))
                        {
                            return_val = velovalidation.error('invalid_date');
                        }
                        if ((lyear == true) && (dd > 29))
                        {
                            return false;
                        }
                    }
                }
                else
                {
                    return false;
                }
            } else {
                return false;
            }
            return true;
            ;
        } else {
            return false;
        }
    }, messages.requiredddmmyy);

    //Add New Method for - Optional + date in ddmmyy format
    jQuery.validator.addMethod("optionalddmmyy", function (value, element) {
        if ($.trim(value) != "") {

            var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
            var return_val = true;
            var val = $.trim(value);
            if (val != '') {
                if (val.match(dateformat))
                {
                    var opera1 = val.split('/');
                    var opera2 = val.split('-');
                    var lopera1 = opera1.length;
                    var lopera2 = opera2.length;
                    if (lopera1 > 1)
                    {
                        var pdate = val.split('/');
                    }
                    else if (lopera2 > 1)
                    {
                        var pdate = val.split('-');
                    }
                    var dd = parseInt(pdate[0]);
                    var mm = parseInt(pdate[1]);
                    var yy = parseInt(pdate[2]);
                    if (yy < 1970) {
                        return false;
                    }
                    var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if (mm == 1 || mm > 2)
                    {
                        if (dd > ListofDays[mm - 1])
                        {
                            return false;
                        }
                    }
                    if (mm == 2)
                    {
                        var lyear = false;
                        if ((!(yy % 4) && yy % 100) || !(yy % 400))
                        {
                            lyear = true;
                        }
                        if ((lyear == false) && (dd >= 29))
                        {
                            return_val = velovalidation.error('invalid_date');
                        }
                        if ((lyear == true) && (dd > 29))
                        {
                            return false;
                        }
                    }
                }
                else
                {
                    return false;
                }
            } else {
                return false;
            }
            return true;
            ;
        } else {
            return true;
        }
    }, messages.optionalddmmyy);

    //Add New Method for - Optioanl + number only + between 0 and 100
    jQuery.validator.addMethod("optionalpercentage", function (value, element) {
        if ($.trim(value) != "") {
            if (!value.match(/^-?\d*(\.\d+)?$/)) {
                return false;
            } else if (value < 0 || value > 100) {
                return false;
            }
            return true;
        } else {
            return true;
        }
    }, messages.optionalpercentage);

    //Add New Method for - Mandatory + number only + between 0 and 100
    jQuery.validator.addMethod("requiredpercentage", function (value, element) {
        if ($.trim(value) != "") {
            if (!value.match(/^-?\d*(\.\d+)?$/)) {
                return false;
            } else if (value < 0 || value > 100) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }, messages.requiredpercentage);

    //Add New Method for - No iframe tags + no script tags + no style tags
    jQuery.validator.addMethod("checktags", function (value, element) {
        if ($.trim(value) != "") {
            var script_regex = /(<script[\s\S]*?>[\s\S]*?<\/script>)|(<script[\s\S]*?>)|([\s\S]*?<\/script>)/i;
            var style_regex = /(<style[\s\S]*?>[\s\S]*?<\/style>)|(<style[\s\S]*?>)|([\s\S]*?<\/style>)/i;
            var iframe_regex = /(<iframe[\s\S]*?>[\s\S]*?<\/iframe>)|(<iframe[\s\S]*?>)|([\s\S]*?<\/iframe>)/i;
            if (script_regex.test($.trim(value))) {
                return false;
            } else if (style_regex.test($.trim(value))) {
                return false;
            } else if (iframe_regex.test($.trim(value))) {
                return false;
            }
            return true;
        } else {
            return true;
        }
    }, messages.checktags);

    //Add New Method for - No html tags
    jQuery.validator.addMethod("checkhtmltags", function (value, element) {
        if ($.trim(value) != "") {
            if (value.match(/([\<])([^\>]{1,})*([\>])/i)) {
                return false;
            }
            return true;
        } else {
            return true;
        }
    }, messages.checkhtmltags);

    //Add New Method for - Mandatory + docs(gif, png,jpeg,jpg, docx, ppt, xlsx etc) + Maximum size 2 MB
    jQuery.validator.addMethod("requireddocs", function (value, element) {
        if ($.trim(value) != "") {
            var jquery_object = jQuery(element);
            var Extension = value.substring(value.lastIndexOf('.') + 1).toLowerCase();
            if (Extension == "jpeg" || Extension == "JPEG" || Extension == "png" || Extension == "jpg" || Extension == "gif"
                    || Extension == "docx" || Extension == "ppt" || Extension == "xlsx") {
                if (jquery_object.prop("files")[0].size > 2097152) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }, messages.requireddocs);

    //Add New Method for - Optional + docs(gif, png,jpeg,jpg, docx, ppt, xlsx etc) + Maximum size 2 MB
    jQuery.validator.addMethod("optionaldocs", function (value, element) {
        if ($.trim(value) != "") {
            var Extension = value.substring(value.lastIndexOf('.') + 1).toLowerCase();
            var jquery_object = jQuery(element);
            if (Extension == "jpeg" || Extension == "JPEG" || Extension == "png" || Extension == "jpg" || Extension == "gif"
                    || Extension == "docx" || Extension == "ppt" || Extension == "xlsx") {
                if (jquery_object.prop("files")[0].size > 2097152) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return true;
        }
    }, messages.optionaldocs);

    //Add New Method for - Mandatory + color only
    jQuery.validator.addMethod("requiredcolor", function (value, element) {
        value = $.trim(value);
        if (value != '') {
            var firstchar = value.charAt(0);
            value = value.substr(1);
            if (firstchar != '#') {
                return false;
            }
            var myRegExp = /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i;
            if (!myRegExp.test(value)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }, messages.requiredcolor);

    //Add New Method for - Optional + color only
    jQuery.validator.addMethod("optionalcolor", function (value, element) {
        value = $.trim(value);
        if (value != '') {
            var firstchar = value.charAt(0);
            value = value.substr(1);
            if (firstchar != '#') {
                return false;
            }
            var myRegExp = /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i;
            if (!myRegExp.test(value)) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }, messages.optionalcolor);

	
	//Add New Method for - Optional + color only
    jQuery.validator.addMethod("ocmultiselect", function (value, element) {
        if(value == undefined) {
			return false;
		} else {
			return true;
		}
    },' ');
	
	
	
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    $("#sample").validate({
        highlight: function (label) {
            $(label).closest('.form-group').removeClass('has-success').addClass('has-error');
        },
        success: function (label) {
            $(label).closest('.form-group').removeClass('has-error');
            label.remove();
        }
    });
});