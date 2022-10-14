if ("undefined" == typeof jQuery) {
    throw new Error("This Management System JavaScript needs jQuery JS file.");
}

function emailValidate(mail) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(mail)) {
        return (false)
    }
    return (true)
}

function credit_card(feild_value, type) {
    var text = feild_value.replace(/-/g, "");
    text = text.replace(/ /g, "");

    var card = /^(?:5[1-5][0-9]{14})$/;
    if (type == 'visa') {
        card = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    } else if (type == 'mastercard') {
        card = /^(?:5[1-5][0-9]{14})$/;
    }

    if (card.test(text)) {
        return true;
    }
    return false;
}

function formatString(e) {
    var inputChar = String.fromCharCode(event.keyCode);
    var code = event.keyCode;
    var allowedKeys = [8];
    if (allowedKeys.indexOf(code) !== -1) {
        return;
    }

    event.target.value = event.target.value.replace(
        /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
    ).replace(
        /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
    ).replace(
        /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
    ).replace(
        /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
    ).replace(
        /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
    ).replace(
        /[^\d\/]|^[\/]*$/g, '' // To allow only digits and `/`
    ).replace(
        /\/\//g, '/' // Prevent entering more than 1 `/`
    );
}

function formatCard(value) {
    var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    var matches = v.match(/\d{4,16}/g);
    var match = matches && matches[0] || ''
    var parts = []
    for (i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
        return parts.join(' ')
    } else {
        return value
    }
}

function cardValidationCheck(error) {
    var payment_type = parseInt($(".payment_type:checked").val());
    var card = $("#card-number").val();
    if (card.length >= 19) {
        $(".cvv2_div").fadeIn();
        $("#cvv2").focus();
    }
    if (payment_type === 2 || payment_type === 3) {
        card = formatCard(card);
        $("#card-number").val(card);
        var errorField = $("#card-number").parent("div").siblings(".error-notice");
        if (payment_type === 2) {
            if (credit_card(card, 'mastercard')) {
                errorField.text("");
            } else {
                errorField.text("Invalid Master Card!");
                error++;
            }
        } else if (payment_type === 3) {
            if (credit_card(card, 'visa')) {
                errorField.text("");
            } else {
                errorField.text("Invalid Credit Card!");
                error++;
            }
        }
    }
    return error;
}

function cvv2ValidationCheck(error) {

    var cvv2 = $("#cvv2").val(), cvv2Len = cvv2.length,
        errorField = $("#cvv2").parent("div").siblings(".error-notice");
    if (cvv2Len >= 4) {
        $("#cvv2").val(cvv2.substring(0, 4));
        $("#card_expire").focus();
    } else if (cvv2Len > 2 && cvv2Len < 5) {
        if (cvv2Len == 3) {
            $(".card_expire_div").fadeIn();
        }
        errorField.text("");
    } else {
        errorField.text("Invalid CVV2");
        error++;
    }
    return error;
}

function cardExpireValidationCheck(error) {
    var card_expire = $("#card_expire").val(),
        errorField = $("#card_expire").parent("div").siblings(".error-notice");
    if (datemonthValiate(card_expire)) {
        errorField.text("");
    } else {
        errorField.text("Invalid Year and Month");
        error++;
    }
    return error;
}

function datemonthValiate(dateExpire) {
    var validate = /^[0-9]{2}\/[0-9]{4}$/;
    if (validate.test(dateExpire)) {
        return true;
    }
    return false;
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


function lenValidation(field, minLenth, error) {
    var length = $("#" + field).val().length,
        errorField = $("#" + field).siblings(".error-notice");
    if (length > minLenth) {
        errorField.text("");
    } else {
        errorField.text("This filed is required.");
        error++;
    }
    return error;
}

var domainExtension = [".aero", ".biz", ".cat", ".com", ".coop", ".edu", ".gov", ".info", ".int", ".jobs", ".mil", ".mobi", ".museum",
    ".name", ".net", ".org", ".travel", ".co", ".club", ".design", ".shop", ".site", ".online", ".me", ".adult", '.art', '.asia', '.computer', '.technology', '.tech',
    ".ac", ".ad", ".ae", ".af", ".ag", ".ai", ".al", ".am", ".an", ".ao", ".aq", ".ar", ".as", ".at", ".au", ".aw", ".az", ".ba", ".bb", ".bd", ".be", ".bf", ".bg", ".bh", ".bi", ".bj", ".bm", ".bn", ".bo", ".br", ".bs", ".bt", ".bv", ".bw", ".by", ".bz", ".ca", ".cc", ".cd", ".cf", ".cg", ".ch", ".ci", ".ck", ".cl", ".cm", ".cn", ".co", ".cr", ".cs", ".cu", ".cv", ".cx", ".cy", ".cz", ".de", ".dj", ".dk", ".dm", ".do", ".dz", ".ec", ".ee", ".eg", ".eh", ".er", ".es", ".et", ".eu", ".fi", ".fj", ".fk", ".fm", ".fo", ".fr", ".ga", ".gb", ".gd", ".ge", ".gf", ".gg", ".gh",
    ".gi", ".gl", ".gm", ".gn", ".gp", ".gq", ".gr", ".gs", ".gt", ".gu", ".gw", ".gy", ".hk", ".hm", ".hn", ".hr", ".ht", ".hu", ".id", ".ie", ".il", ".im",
    ".in", ".io", ".iq", ".ir", ".is", ".it", ".je", ".jm", ".jo", ".jp", ".ke", ".kg", ".kh", ".ki", ".km", ".kn", ".kp", ".kr", ".kw", ".ky", ".kz", ".la", ".lb",
    ".lc", ".li", ".lk", ".lr", ".ls", ".lt", ".lu", ".lv", ".ly", ".ma", ".mc", ".md", ".mg", ".mh", ".mk", ".ml", ".mm", ".mn", ".mo", ".mp", ".mq",
    ".mr", ".ms", ".mt", ".mu", ".mv", ".mw", ".mx", ".my", ".mz", ".na", ".nc", ".ne", ".nf", ".ng", ".ni", ".nl", ".no", ".np", ".nr", ".nu",
    ".nz", ".om", ".pa", ".pe", ".pf", ".pg", ".ph", ".pk", ".pl", ".pm", ".pn", ".pr", ".ps", ".pt", ".pw", ".py", ".qa", ".re", ".ro", ".ru", ".rw",
    ".sa", ".sb", ".sc", ".sd", ".se", ".sg", ".sh", ".si", ".sj", ".sk", ".sl", ".sm", ".sn", ".so", ".sr", ".st", ".su", ".sv", ".sy", ".sz", ".tc", ".td", ".tf",
    ".tg", ".th", ".tj", ".tk", ".tm", ".tn", ".to", ".tp", ".tr", ".tt", ".tv", ".tw", ".tz", ".ua", ".ug", ".uk", ".um", ".us", ".uy", ".uz", ".va", ".vc",
    ".ve", ".vg", ".vi", ".vn", ".vu", ".wf", ".ws", ".ye", ".yt", ".yu", ".za", ".zm", ".zr", ".zw"
];

function removeLastCharacter(value, selector) {
    var newVal = value.substr(0, value.length - 1);
    selector.val(newVal);
    return newVal;
}

function atozValidate(text) {
    var filter = /^[a-zA-Z]*$/;
    if (filter.test(text)) {
        return true;
    }
    return false;
}

var validEmailExtension = '';
var validEmailExtension2 = '';


function validateCustomEmail(selector, email, emailLength) {
    var errorCount = 0;
    var error = '';
    if (emailLength > 0) {
        var numberFilter = /^([a-zA-Z0-9_\.\-])/;
        if (!numberFilter.test(email)) {
            removeLastCharacter(email, selector);
            //console.log("numberFilter " + numberFilter);
            errorCount++;
            error = 'Email Invalid!';
        } else {
            var str = email.split('@');
            if (str.length == 2) {
                var strDot = str[1].split('.');
                var strDotLen = strDot[0].length;
                var filter = /^[a-zA-Z0-9.-]*$/;
                // var filter = /^([a-zA-Z\-]{2,25})+\.+([a-zA-Z0-9]{2,10})$/;
                if (str[1] && !filter.test(str[1])) {
                    //console.log("filter str[0] " + str[0] + " str[1] " + str[1]);
                    removeLastCharacter(email, selector);
                } else if (strDotLen < 21) {
                    //console.log("elseif str[0] " + str[0] + " str[1] " + str[1]);
                    if (strDot[1]) {
                        var extension = "." + strDot[1];
                        if (!atozValidate(strDot[1])) {
                            removeLastCharacter(email, selector);
                            extension = extension.substr(0, extension.length - 1);
                        }
                        //console.log(strDot);
                        if (jQuery.inArray(extension, domainExtension) > -1) {
                            validEmailExtension = extension;
                            if (strDot.length > 2) {
                                //console.log('countryExtension dot');
                                var countryExtension = "." + strDot[2];
                                if (!atozValidate(strDot[2])) {
                                    removeLastCharacter(email, selector);
                                    countryExtension = countryExtension.substr(0, countryExtension.length - 1);
                                }
                                if (extension !== countryExtension && jQuery.inArray(countryExtension, domainExtension) > -1) {
                                    //console.log('countryExtension ok');
                                    validEmailExtension2 = countryExtension;
                                    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z\-]{2,10})+\.)+([a-zA-Z0-9]{2,10})$/;
                                    if (!filter.test(email)) {
                                        errorCount++;
                                        error = 'Email Invalid!';
                                    } else {
                                        removeError(selector);
                                    }
                                } else {
                                    //console.log("countryExtension " + countryExtension + " " + countryExtension.length);
                                    if (countryExtension.length > 2) {
                                        selector.val(str[0] + "@" + strDot[0] + validEmailExtension + validEmailExtension2);
                                    } else {
                                        errorCount++;
                                        error = 'Email Invalid!';
                                    }
                                }
                            } else {
                                //console.log('extension ok ' + extension);
                                var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z\-]{2,10})+\.)+([a-zA-Z0-9]{2,10})$/;
                                if (!filter.test(email)) {
                                    errorCount++;
                                    error = 'Email Invalid!';
                                } else {
                                    removeError(selector);
                                }
                            }
                        } else {
                            // console.log("test");
                            if (strDot[2]) {
                                selector.val(str[0] + "@" + strDot[0] + "." + strDot[1]);
                            }
                            if (extension.length > 11) {
                                selector.val(str[0] + "@" + strDot[0] + validEmailExtension);
                            } else {
                                errorCount++;
                                error = 'Invalid Email, We don\'t take this extension.';
                            }
                        }
                    } else {
                        errorCount++;
                        error = 'Email Invalid!';
                    }
                } else {
                    errorCount++;
                    if (strDotLen > 20) {
                        selector.val(str[0] + "@" + strDot[0].substr(0, 20));
                    }
                    error = 'Domain name must be less then 21 characters!';
                }
            } else {
                email = email.replace(/\s/g, '');
                removeLastCharacter(email, selector);
                if (str.length > 2) {
                    selector.val(str[0] + "@" + str[1]);
                } else {
                    selector.val(str[0].substr(0, 20));
                }
                //console.log("else str[0] " + str[0]);
                errorCount++;
                error = 'Email Invalid!';
            }
        }
    }
    return {
        error: errorCount,
        message: error
    }
}

function removeCharactersIfNotMatch(str, match) {
    var newStr = '';
    for (var chr in str) {
        var check = str[chr];
        if (jQuery.inArray(check, match) > -1) {
            newStr += check;
        }
    }
    return newStr;
}

var validUrlExtension = '';
var validUrlExtension2 = '';

function validateCustomUrl(selector, url, urlLen) {
    var errorCount = 0;
    var error = '';
    if (urlLen > 0) {
        var urlSplit = url.split('/');
        //console.log(urlSplit);
        if (urlSplit.length === 3 && (urlSplit[0] === 'http:' || urlSplit[0] === 'https:')) {

            var filter = /^[a-zA-Z0-9.-]*$/;
            var domain = urlSplit[2];
            if (!filter.test(domain)) {
                removeLastCharacter(url, selector);
                domain = domain.substr(0, domain.length - 1);
            }
            // //console.log("valid step " + domain);
            var domainArray = domain.split('.');
            var domainLength = domainArray.length;
            //www.test.com.bd
            if (domainArray[0].length > 20) {
                removeLastCharacter(url, selector);
                errorCount++;
                error = 'Domain Name Length must be less then 20 characters!';
            } else {
                //console.log(domainArray);
                if (domainArray[0].toLowerCase() === 'www') {
                    domainArray.splice(0, 1);
                }
                //console.log(domainArray);
                domainLength = domainArray.length;
                if (domainLength > 0) {
                    var domainNameLength = (domainArray[0]).length;


                    if (domainNameLength < 21) {
                        ////console.log("elseif str[0] " + str[0] + " str[1] " + str[1]);
                        if (domainArray[1]) {
                            var extension = "." + domainArray[1];
                            if (!atozValidate(domainArray[1])) {
                                removeLastCharacter(url, selector);
                                extension = extension.substr(0, extension.length - 1);
                            }
                            //console.log("extension "+extension);
                            if (jQuery.inArray(extension, domainExtension) > -1) {
                                validUrlExtension = extension;
                                if (domainLength > 2) {
                                    var countryExtension = "." + domainArray[2];
                                    if (!atozValidate(domainArray[2])) {
                                        removeLastCharacter(url, selector);
                                        countryExtension = countryExtension.substr(0, countryExtension.length - 1);
                                    }
                                    //console.log('countryExtension '+countryExtension);
                                    if (extension !== countryExtension && jQuery.inArray(countryExtension, domainExtension) > -1) {                                      ////console.log('countryExtension ok');
                                        validUrlExtension2 = countryExtension;
                                        if (!isUrlValid(url)) {
                                            errorCount++;
                                            error = 'URL Invalid!';
                                        } else {
                                            removeError(selector);
                                        }
                                    } else {
                                        ////console.log("countryExtension " + countryExtension + " " + countryExtension.length);
                                        if (countryExtension.length > 2) {
                                            selector.val(urlSplit[0] + "//" + domainArray[0] + validUrlExtension + validUrlExtension2);
                                        } else {
                                            errorCount++;
                                            error = 'URL Invalid!';
                                        }
                                    }
                                } else {
                                    //console.log('extension ok ' + extension);
                                    if (!isUrlValid(url)) {
                                        errorCount++;
                                        error = 'URL Invalid!';
                                    } else {
                                        removeError(selector);
                                    }
                                }
                            } else {
                                if (domainArray[2]) {
                                    selector.val(urlSplit[0] + "//" + domainArray[0] + "." + domainArray[1]);
                                }
                                if (extension.length > 11) {
                                    selector.val(urlSplit[0] + "//" + domainArray[0] + validUrlExtension);
                                } else {
                                    errorCount++;
                                    error = 'URL Email, We don\'t take this extension.';
                                }
                            }
                        } else {
                            errorCount++;
                            error = 'URL Invalid!';
                        }
                    } else {
                        errorCount++;
                        removeLastCharacter(url, selector);
                        error = 'Domain name must be less then 21 characters!';
                    }
                } else {
                    errorCount++;
                    error = 'URL Invalid!';
                }

            }
            // removeLastCharacter(url, selector);
        } else {
            url = removeCharactersIfNotMatch(url, ['h', 't', 'p', 's', ':', '/']);
            selector.val(url);
            errorCount++;
            error = 'URL Invalid!';
        }

    }

    return {
        error: errorCount,
        message: error
    }
}

function isCustomerLoggedIn(data) {
    var isUserLoggedIn = 0;
    var websiteUrl = window.location.origin + '/';
    $.ajax({
        type: 'get',
        url: websiteUrl + 'is-customer-logged-in',
        data: data,
        async: false,
        success: function (response) {
            isUserLoggedIn = parseInt(response);

            // console.log("res " + isUserLoggedIn);
        }
    });
    return isUserLoggedIn;
}

(function ($) {
    "use strict"

    /** Menu **/
    $('.main-menu').find('.' + method).addClass("active");


    if ($(".close-icon").length > 0) {
        $(".close-icon").on("click", function () {
            $(this).parent(".successful-popup").parent(".successful-popup-wrap").fadeOut();
        });
    }

    function search_on_nptl_search() {
        var search_text = $("#search_text").val();
        alert(search_text);

        var _token = $('#table_csrf_token').val();
        if (search_text.length > 0) {
            $.ajax({
                url: url + "main_search",
                type: 'post',
                data: {search_text: search_text, _token: _token},
                success: function (response) {
                    $('.search-html').html(response);
                    // $("#searchbtn").html('<i class="fa fa-search"></i>');
                },
                error: function (errors) {
                    var errorRes = errors.responseJSON.errors;
                    // console.log(errorRes);
                    $("#search-html").html('');
                }
            });
        } else {
            $("#search-html").html('Write Something');
        }
    }

    if ($('.cb_detail_price').length > 0) {
        $('.cb_detail_price').on('change', function () {
            calculatePackage2Price($(this))
        });
    }
    if ($('.package_qty').length > 0) {
        $('.package_qty').on('keyup', function () {
            calculatePackage2Price($(this))
        });
        $('.package_qty').on('change', function () {
            calculatePackage2Price($(this))
        });
    }
    if ($('.package_words').length > 0) {
        $('.package_words').on('keyup', function () {
            calculatePackage2Price($(this))
        });
        $('.package_words').on('change', function () {
            calculatePackage2Price($(this))
        });
    }

    function calculatePackage2Price($this) {
        var id = $this.data("parent");
        // console.log('click id ' + id);
        var iteration, total_price = 0;
        $("#" + id + " .packageInfo").each(function () {
            iteration = $(this).data('iteration');
            var row = $(this).data('row');
            var perWords = parseInt($(this).data('words'));
            perWords = (isNaN(perWords)) ? 100 : perWords;

            var qtyVal = $("#" + id).find(".package_qty_" + iteration + "_" + row).val();
            if (qtyVal.length <= 0) {
                qtyVal = 0;
            }
            var qty = parseInt(qtyVal);

            var wordsVal = $("#" + id).find(".package_words_" + iteration + "_" + row).val();
            if (wordsVal.length <= 0) {
                wordsVal = 0;
            }
            var words = parseInt(wordsVal);
            var totalWords = words * qty;
            $("#" + id).find(".total_words_" + iteration + "_" + row).text(totalWords);
            var price = parseFloat($(this).data('price'));
            var total = (words / perWords) * qty * price;

            // console.log("iteration = " + iteration + " row = " + row + " qty = " + qty + " total = " + total);

            if ($("#" + id).find(".cb_" + iteration + "_" + row).is(':checked')) {
                $("#" + id).find(".total_" + iteration + "_" + row).text(total.toFixed(2));
                total_price += total;
            } else {
                $("#" + id).find(".total_" + iteration + "_" + row).text("0");
            }
        });
        $("#" + id).find(".total_price_" + iteration).text(total_price.toFixed(2));
    }

    /**
     * package order
     */

    if ($('.package_order_submit').length > 0) {
        $('.package_order_submit').on('click', function () {
            var $this = $(this), type = parseInt($this.data('type')),
                form = $this.data('form'),
                href = $this.attr('href');
            if (!href) {
                form = $("#" + form);
                var data = form.serialize();
                href = form.attr('action') + '?' + data;
            }
            // console.log("type = "+type+" href ="+href+" form = "+form);
            var isUserLoggedIn = isCustomerLoggedIn({href: href});
            // console.log("out res "+isUserLoggedIn);
            // console.log("final out res "+isUserLoggedIn);
            if (isUserLoggedIn == 0) {
                $("#guestForm").fadeIn();
                return false;
            }
        });
    }
    /**
     * Guest Login
     */
    $('.guestLogin').on('click', function () {
        var token = $('#table_csrf_token').val();
        $.ajax({
            type: 'post',
            url: url + '/guest-login',
            data: {_token: token},
            success: function (response) {
                if (response != '') {
                    window.location.href = response;
                }
            }
        });
        return false;
    });
    /**
     * Payment Type
     */
    if ($(".single-payment").length > 0) {
        $(".single-payment").on("click", "label", function () {
            var type = parseInt($(this).siblings(".payment_type").val());
            if (type === 2 || type === 3) {
                $('.master_and_visa').slideDown();
            } else {
                $('.master_and_visa').slideUp();
            }
        });
    }
    $('.smAuthForm').on('submit', function () {
        var currentURL = window.location.pathname;
        var loc = location.host + "/checkout";
        var websiteUrl = window.location.origin;
        // alert(loc)
        var $this = $(this),
            id = $this.attr("id"),
            data = $this.serialize(),
            action = $this.attr('action'),
            method = $this.attr('method');
        $this.find("span.error-notice").text("");
        $.ajax({
            type: method,
            url: action,
            data: data,
            success: function (response) {
                if (id == 'forgotPassword') {
                    console.log(response);
                    $this.find("span.success-notice").text(response.status);
                } else {
                    if (response.username != undefined) {
                        var html = '<div class="dropdown ">\n' +
                            '<a class="current-open" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#"><span>' + response.username + '</span></a>\n' +
                            '<ul class="dropdown-menu mega_dropdown" role="menu">\n' +
                            '<li><a href="' + websiteUrl + '/dashboard">Profile</a></li>\n' +
                            '<li><a href="' + websiteUrl + '/dashboard/wishlist"">Wishlists</a></li>\n' +
                            '<li><a href="' + websiteUrl + '/logout">Logout</a></li>\n' +
                            '</ul>\n' +
                            '</div>';
                        // if (currentURL == '/cart') {
                        //     window.location.href = loc;
                        // }
                        $("#user-info-top").html(html);
                        // $(".loginModal").fadeOut();
                        $('.loginModal').modal('hide');
                        location.reload();
                    }
                }
            },
            error: function (errorResponse) {
                var errors = errorResponse.responseJSON;
                console.log(errors);
                for (var error in errors) {
                    var field = $this.find('[name="' + error + '"]').siblings("span.error-notice");
                    if (Array.isArray(errors[error])) {
                        field.text(errors[error][0]);
                    } else {
                        field.text(errors[error]);
                    }
                }
            }
        });
        return false;
    });
    var currentURL = window.location.pathname;
    if (currentURL == '/login') {
        $('.loginModal').modal('show');
    }


    /** subscription form end  **/

    /** user profile picture update end ***/

    if ($("#profile_picture_form").length > 0) {
        $("#profile_picture_form").on("change", function () {
            $(".change-profile-pic i").removeClass("fa-camera");
            $(".change-profile-pic i").addClass("fa-refresh fa-spin");
            $.ajax({
                type: 'post',
                url: $(this).attr("action"),
                data: new FormData(this),
                contentType: false,
                cache: false,
                processData: false,
                success: function (response) {
                    $("#profile_picture_img").attr("src", response.src);
                    $(".change-profile-pic i").removeClass("fa-refresh fa-spin");
                    $(".change-profile-pic i").addClass("fa-camera");
                },
                error: function (error) {
                    console.log(error);
                }
            });
            return false;
        });
    }
    /** user profile picture update start ***/
    /** Comment */
    var isUserLoggedIn = 0;

    function commentValidation($this) {
        $("#commentErrors").html("");
        var comments = $this.val();
        var commentsLength = comments.length;
        if (isUserLoggedIn == 0) {
            isUserLoggedIn = isCustomerLoggedIn({});
            if (isUserLoggedIn == 0) {
                // if (!$('.login-form-wraper').hasClass("active")) {
                //     $('.login-form-wraper').addClass('active');
                //     $('.login-form-wraper').fadeIn();
                $('.loginModal').modal('show');
                // }
            }
        }
        var limitMax = 500;
        var leftChar = limitMax - commentsLength;
        var text = leftChar + ' ' + (leftChar > 1 ? 'Characters Left' : 'Character Left');
        $("#commentLeft").fadeIn();
        $("#commentLeft").text(text);
        // console.log("commentsLength "+commentsLength);
        if (commentsLength < 10 || commentsLength > limitMax) {
            if (commentsLength > limitMax) {
                $this.val(comments.substr(0, limitMax));
            } else {
                $("#commentSubmit").prop("disabled", true);
                $("#commentValidity").fadeIn();
                $("#commentLeft").removeClass('color-green');
                if (!$("#commentLeft").hasClass('help-block')) {
                    $("#commentLeft").addClass('help-block');
                }
            }
        } else {
            $("#commentValidity").fadeOut();
            $("#commentLeft").removeClass('help-block');
            $("#commentSubmit").removeAttr("disabled");
            if (!$("#commentLeft").hasClass('color-green')) {
                $("#commentLeft").addClass('color-green');
            }
        }
    }

    $(function () {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "1500",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        if ($("#commentForm").length > 0) {
            $(".blog-comments-area").on("click", '.replay', function () {
                var parent_comment_id = $(this).data("comment");
                $("#parent_comment_id").val(parent_comment_id);
                document.getElementById('leaveAComment').scrollIntoView({block: 'start', behavior: 'smooth'});
            });
            $("#comments").on("click", function () {
                commentValidation($(this));
            });
            $("#comments").on("keyup", function () {
                commentValidation($(this));
            });
            $("#comments").on("change", function () {
                commentValidation($(this));
            });
            $("#commentForm").on("submit", function () {
                $("#commentErrors").html("");
                // console.log("type = "+type+" href ="+href+" form = "+form);
                isUserLoggedIn = isCustomerLoggedIn({});
                // console.log('isUserLoggedIn = ' + isUserLoggedIn);
                if (isUserLoggedIn == 1) {
                    $.ajax({
                        type: 'post',
                        url: $(this).attr("action"),
                        data: $(this).serialize(),
                        success: function (response) {
                            $("#comments").val("");
                            $("#parent_comment_id").val("0");
                            toastr.success(response);
                            // $("#newsletterPopUp .popup_title").html("Success");
                            // $("#newsletterPopUp .popup_message").html(response);
                            // $("#newsletterPopUp").fadeIn();
                        },
                        error: function (error) {
                            // toastr.error(data.message, data.title);
                            var html = '<div class="alert alert-danger">';
                            var errors = error.responseJSON.errors.comments;
                            for (var err in errors) {
                                html += errors[err];
                            }
                            html += '</div>';
                            $("#commentErrors").html(html);
                        }
                    });
                } else {
                    $('.loginFormShow').click();
                }
                return false;
            })
        }
    });

    /** Contact Mail **/
    if ($("#contactMail").length > 0) {
        // $(".loading").fadeIn();

        var rules = {
            fullname: {
                notEmpty: {
                    message: 'The name field is Required!'
                },
                stringLength: {
                    min: 3,
                    max: 40,
                    message: 'Name must be between 3 to 40 characters.'
                }
            },
            email: {
                notEmpty: {
                    message: 'The email field is Required!'
                },
                custom: {
                    callback: validateCustomEmail
                }
            },
            subject: {
                notEmpty: {
                    message: 'The subject field is Required!'
                },
                stringLength: {
                    min: 3,
                    max: 100,
                    message: 'Subject must be between 3 to 40 characters.'
                }
            },
            message: {
                notEmpty: {
                    message: 'The message field is Required!'
                },
                stringLength: {
                    min: 5,
                    max: 500,
                    message: 'Message must be between 5 to 500 characters.'
                }
            }
        };
        var callback = function (response) {
            if (response.isSuccess) {
                $("#newsletterPopUp .popup_title").html("Success");
                $("#newsletterPopUp .popup_message").html(response.response);
                $("#newsletterPopUp").fadeIn();
            }
        };
        smValidator("contactMail", rules, 3, callback);
    }
    /** service mail **/
    if ($("#serviceMail").length > 0) {
        var rules = {
            full_name: {
                notEmpty: {
                    message: 'The name field is Required!'
                },
                stringLength: {
                    min: 2,
                    message: 'Name must be minimum 2 characters.'
                }
            },
            email: {
                notEmpty: {
                    message: 'The email field is Required!'
                },
                custom: {
                    callback: validateCustomEmail
                }
            },
            phone: {
                notEmpty: {
                    message: 'The mobile field is Required!'
                },
                mobile: {
                    message: 'Mobile no is Invalid!'
                }
            },
            recaptcha: {
                reCaptcha: {
                    message: 'Please select recaptcha!'
                }
            }
        };
        var srviceCallback = function (response) {
            if (response.is_success) {
                $("#newsletterPopUp .popup_title").html("Success");
                $("#newsletterPopUp .popup_message").html(response.message);
                $("#newsletterPopUp").fadeIn();
            }
        };
        smValidator("serviceMail", rules, 3, srviceCallback);
    }


    /**
     * ajax loading
     */

    /**
     * global ajax pagination
     */
    if ($('#sm_list').length > 0) {
        $("#sm_list").on('click', '.pagination-blog a', function () {
            $(this).html('<i class="fa fa-refresh fa-spin"></i>');
            var href = $(this).attr('href');
            $.ajax({
                type: 'get',
                url: href,
                success: function (response) {
                    $("#sm_list").html(response);
                    var position = $('#sm_list').offset().top - 100;
                    $('html, body').animate({scrollTop: position}, 'slow');
                },
                error: function (err) {
                    console.log("AJAX Error");
                }
            });
            return false;
        });
    }

    /**
     * like
     */
    if ($('.nptl_like').length > 0) {
        $('.nptl_like').on('click', function () {
            var $this = $(this),
                id = $this.data("id"),
                type = $this.data("type"),
                suffix = $this.data("suffix");

            var _token = $('#table_csrf_token').val();
            $.ajax({
                type: 'post',
                url: url + "likes",
                data: {_token: _token, id: id, type: type, suffix: suffix},
                success: function (response) {
                    $this.html('<i class="fa fa-heart"></i> ' + response.likesTitle);
                    if (response.isAlreadyLiked == 1 && !$this.hasClass('nptl_liked')) {
                        $this.addClass('nptl_liked')
                    } else {
                        $this.removeClass('nptl_liked')
                    }
                },
                error: function () {

                }
            });
            return false;
        });
    }
    /**
     * check already liked or not
     */
    if ($(".nptl_like").length > 0) {
        $(".nptl_like").filter(function () {
            var $this = $(this),
                id = $this.data("id"),
                type = $this.data("type"),
                suffix = $this.data("suffix");
            likeAjax($this, id, type, suffix);
            return false;
        });
    }

    function likeAjax($this, id, type, suffix) {
        // console.log("id "+id+" type "+type);
        var _token = $('#table_csrf_token').val();
        $.ajax({
            type: 'post',
            url: url + "is-already-liked",
            data: {_token: _token, id: id, type: type, suffix: suffix},
            success: function (response) {
                if (response.isAlreadyLiked == 1 && !$this.hasClass('nptl_liked')) {
                    $this.addClass('nptl_liked')
                } else {
                    $this.removeClass('nptl_liked')
                }
            },
            error: function () {

            }
        });
    }

    if ($(".support-comment-list").length > 0) {
        $('.support-comments-area').scrollTop($('.support-comment-list').height());
    }
    //support reply form submit
    if ($("#support_ticket_reply").length > 0) {
        $("#support_ticket_reply").on('submit', function () {
            var $this = $(this), data = $this.serialize();
            $.ajax({
                type: 'post',
                url: $this.attr('action'),
                data: data,
                success: function (response) {
                    $(".no_support_reply").fadeOut();
                    $("#last_loaded_support").val(response.id);
                    $("#support_ticket_reply").find(".error-notice").html("");
                    $("#support_message").val("");
                    $('.support-comment-list').append(response.html);
                    $('.support-comments-area').scrollTop($('.support-comment-list').height());
                },
                error: function (error) {
                    $("#support_ticket_reply").find(".error-notice").html(error.responseJSON.errors.message[0]);
                }
            });
            return false;
        });

        // load older post
        $("#load_more_support").on("click", function () {
            var $this = $(this), last = $this.attr("data-last"), current = parseInt($this.attr("data-current")) + 1,
                href = $this.attr("href") + "?page=" + current;
            $this.html('<i class="fa fa-refresh fa-spin"></i> Loading Older Message');
            if (last <= current) {
                $this.fadeOut();
            }
            $.ajax({
                type: 'get',
                url: href,
                success: function (response) {
                    $this.html('<i class="fa fa-refresh"></i> Load Older Message');
                    $this.attr("data-current", current);
                    $('.support-comment-list').prepend(response);
                }
            });
            return false;
        });
    }
})
(jQuery);