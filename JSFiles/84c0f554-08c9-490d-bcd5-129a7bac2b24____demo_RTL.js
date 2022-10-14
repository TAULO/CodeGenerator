
var wedcsFlag = false;
var minimumConsentDate;
var cookieName;

// Handling Redirection URL
var name = getQryStrParamValues('source');
if (name == "fre") {
    var browserVersion = (navigator.userAgent.substr(navigator.userAgent.length - 5, 5));
    if (browserVersion == 10240 || browserVersion == 10586) {
        window.location.replace("https://go.microsoft.com/fwlink/?LinkId=822218");
    }
    else if (browserVersion > 14393) {
        window.location.replace("https://go.microsoft.com/fwlink/?LinkId=730760");
    }
}

function getQryStrParamValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0].toLowerCase() == param.toLowerCase()) {
            if (urlparam[1] != null)
                return urlparam[1].toLowerCase();
        }
    }
}

//Tab Function
var bannerFlagForTab = false;
var isMSCCCookie = false;
//Cookie Banner
var isConsentRequired = false;
var market = document.getElementById('marketId').value;

var URL = "https://uhf.microsoft.com/" + market + "/shell/api/mscc?sitename=Microsoft Edge Welcome(RS1-Bunnies)&domain=microsoft.com";

var mscc_eudomain = getQryStrParamValues('mscc_eudomain');
if (mscc_eudomain) {
    if (mscc_eudomain.toLowerCase() == "true")
        URL += "&mscc_eudomain=true";
    else
        URL += "&mscc_eudomain=false";
}

// JSLL Scripts
$('head').append("<meta name='ms.appid' content='JS:Msedgefre'/>");


$.ajax({
    url: URL,
    cache: false,
    success: function (response) {
        var output = JSON.stringify(response);

        isConsentRequired = response.IsConsentRequired;
        minimumConsentDate = response.MinimumConsentDate;
        cookieName = response.CookieName;

        var JSURL = response.Js;
        var CSSURL = response.Css;
        var Banner = response.Markup;
        var Error = response.Error;
        if (isConsentRequired) {

            minimumConsentDate = Math.floor((Date.parse(new Date(response.MinimumConsentDate))) / 1e3);
            validateMinimumConsentDate();

            $('head').append("<script type='text/javascript' src='" + JSURL + "'></script>");
            $('head').append("<link rel='stylesheet' href='" + CSSURL + "'>");
            $('body').prepend(Banner);
            document.getElementById("msccLearnMore").setAttribute("tabIndex", "0");

            $("#msccBanner").css({
                opacity: "0"
            });
            setTimeout(function () {
                $("#msccBanner").css({
                    opacity: "1"
                });
                if (window.innerWidth >= 1296) {
                    $("#msccLearnMore").css({ 'margin-right': '15px' });
                }
            }, 300);
            if (window.matchMedia("(max-height:740px)").matches) {
                $("html").css({
                    'overflow-y': 'scroll',
                    'height': '740px'
                });
            }
            bannerFlagForTab = true;

            if (getCookie(cookieName)) {
                addTrackingScript(null);
            }
        }
        else {
            //Add the All tracking events            
            addTrackingScript(null);
        }
    },
    async: false

});

//Validates whether Consent Date is older than the MinimumConsentDate and if so deletes the MSCC cookie
function validateMinimumConsentDate() {
    var consentDate = getCookieValue(cookieName);
    if (consentDate < minimumConsentDate)
        deleteCookie(cookieName);
}

//Deletes MSCC cookie
function deleteCookie(cookieName) {
    if (getCookie(cookieName)) {
        var date = new Date();
        date.setTime(date.getTime() - (1 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        var domain = "domain=." + window.location.hostname;
        var cname = cookieName;
        var cvalue = "";
        var path = "path=/";
        //Checking Production Domain
        if (domain.includes(".microsoft.com"))
            domain = "domain=.microsoft.com";
        document.cookie = cname + "=" + cvalue + ";" + domain + ";" + expires + ";" + path;
    }
}

//Function to get cookie value
function getCookieValue(c_name) {
    var aCookie = document.cookie.split("; ");
    var aCrumb;
    var i;
    for (i = 0; i < aCookie.length; i++) {
        aCrumb = aCookie[i].split("=");
        if (c_name === aCrumb[0]) {
            return aCrumb[1];
        }
    }
    return 0;
}

//Function to get cookie availability after user consent
function getCookie(c_name) {
    var cookieValue = false;
    var aCookie = document.cookie.split("; ");
    var aCrumb;
    var i;
    for (i = 0; i < aCookie.length; i++) {
        aCrumb = aCookie[i].split("=");
        if (c_name === aCrumb[0]) {
            cookieValue = true;
        }
    }
    return cookieValue;
}

//To Check if Script is added already
function validateScriptReference() {
    var isScriptAlreadyLoaded = [];
    var scriptArray = isScriptLoaded();
    var noScriptArray = isNoScriptLoaded();
    var url = ["//cdn.optimizely.com/js/3325070522.js", "//ad.atdmt.com/m/a.js;m=11087203742450;", "//ad.atdmt.com/m/a.html;m=11087203742450;", "//c.microsoft.com/ms.js"];

    $.each(url, function (i, val) {
        var matchedURLInScript = scriptArray.find(function (currentValue, index, arr) {
            return currentValue.includes(val);
        });

        if (matchedURLInScript != null)
            isScriptAlreadyLoaded.push(true);
        else if (matchedURLInNoScript == null) {
            var matchedURLInNoScript = noScriptArray.find(function (currentValue, index, arr) {
                return currentValue.includes(val);
            });
            if (matchedURLInNoScript != null)
                isScriptAlreadyLoaded.push(true);
            else
                isScriptAlreadyLoaded.push(false);
        }
    });
    return isScriptAlreadyLoaded;
}

//To get all the Script src in the page
function isScriptLoaded() {
    var scripts = document.getElementsByTagName('script');
    var scriptArray = [];
    for (var i = scripts.length; i--;) {
        scriptArray.push(scripts[i].src);
    }
    return scriptArray;
}

//To get all the No Script src in the page
function isNoScriptLoaded() {
    var noScripts = document.getElementsByTagName('noscript');
    var noScriptArray = [];
    for (var i = noScripts.length; i--;) {
        noScriptArray.push(noScripts[i].innerHTML);
    }
    return noScriptArray;
}

function addTrackingScript(isDynamicScriptLoaded) {

    //Optimizely
    
    isDynamicScriptLoaded == null ? $('head').append("<script src='https://cdn.optimizely.com/js/3325070522.js'><\/script>")
    : isDynamicScriptLoaded[0] == true ? null : $('head').append("<script src='https://cdn.optimizely.com/js/3325070522.js'><\/script>");

    //Atlas Tag
    var AtlasScript = "var e = document.createElement(\"script\");\n";
    AtlasScript += "e.async = true;\n";
    AtlasScript += "e.src = \"https://ad.atdmt.com/m/a.js;m=11087203742450;cache=\" + Math.random() + \"?\";\n";
    AtlasScript += "var s = document.getElementsByTagName(\"script\")[0];\n";
    AtlasScript += "s.parentNode.insertBefore(e, s);\n";

    isDynamicScriptLoaded == null ? $('body').append("<script>\n" + AtlasScript + " <\/script>")
        : isDynamicScriptLoaded[1] == true ? null : $('body').append("<script>\n" + AtlasScript + " <\/script>");

    var AtlasNoScript = "<iframe \n";
    AtlasNoScript += "style=\"display:none;\"\n";
    AtlasNoScript += "src=\"https://ad.atdmt.com/m/a.html;m=11087203742450;noscript=1?\">\n";
    AtlasNoScript += "<\/iframe>\n";

    isDynamicScriptLoaded == null ? $('body').append("<noscript>\n" + AtlasNoScript + " <\/noscript>")
  : isDynamicScriptLoaded[2] == true ? null : $('body').append("<noscript>\n" + AtlasNoScript + " <\/noscript>");

    // WEDCS Scripts    
    if (isDynamicScriptLoaded != null) {
        if (isConsentRequired && getCookie(cookieName)) {
            if (!wedcsFlag) {
                isDynamicScriptLoaded == null ? document.write('<script type="text/javascript" src="https://c.microsoft.com/ms.js"></script>')
                 : isDynamicScriptLoaded[3] == true ? null : document.write('<script type="text/javascript" src="https://c.microsoft.com/ms.js"></script>');
                wedcsFlag = true;
            }
        }
    }
}

document.write = function (content) {
    $('<div></div>')
      .html(content)
      .insertAfter('noscript');
};

function documentWriteMsccScript(scriptURL) {
    if (!isConsentRequired || getCookie(cookieName)) {
        if (!wedcsFlag) {
            document.write('<script type="text/javascript" src="' + scriptURL + '"></script>');
            wedcsFlag = true;
        }
    }
}

$(window).keyup(function (e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 9) {
        setTabIndex(0)
    }
});

$(window).on('click', function (e) {
    removeTabIndex();
});

function removeTabIndex() {
    setTabIndex(-1);
}

function setTabIndex(value) {
    if (bannerFlagForTab) {
        document.getElementById("imgFavorites").tabIndex = value;
        document.getElementById("fav").tabIndex = value;
        document.getElementById("imgSurfSafely").tabIndex = value;
        document.getElementById("learn").tabIndex = value;
        document.getElementById("LR").tabIndex = value;
        document.getElementById("extension").tabIndex = value;
        document.getElementById("divDiscoverySection").tabIndex = value;
        document.getElementById("more-tips").tabIndex = value;
    }
}

var targetId = "";
function findTargetId(target) {
    return target == targetId;
}
var keyCode = 0;
$(document).keydown(function (event) {
    keyCode = event.keyCode;
    setTabIndex(0);
});
//To check whether user has clicked any predefined links if so enables the scripts
var filteredIdArray = ["imgFavorites", "fav", "imgSurfSafely", "learn", "LR", "extension", "more-tips"];
$(document).click(function (event) {
    targetId = event.target.id;
    if (filteredIdArray.find(findTargetId)) {
        if (keyCode == 13) {
            mscc.setConsent() == true;
        }
        var isDynamicScriptLoaded = validateScriptReference();
        setTimeout(function () {
            validateMinimumConsentDate();
            if (isConsentRequired && getCookie(cookieName) && !isMSCCCookie) {
                addTrackingScript(isDynamicScriptLoaded);
                isMSCCCookie = true;
            }
        }, 500);
    }
});

$(document).mousedown(function (event) {
    if (event.which === 2) {
        targetId = event.target.id;
        if (filteredIdArray.find(findTargetId)) {
            var isDynamicScriptLoaded = validateScriptReference();
            setTimeout(function () {
                validateMinimumConsentDate();
                if (isConsentRequired && getCookie(cookieName) && !isMSCCCookie) {
                    addTrackingScript(isDynamicScriptLoaded);
                    isMSCCCookie = true;
                }
            }, 500);
        }
    }
});


$(document).ready(function () {

    //To check whether user has clicked (using Enter button) any predefined links if so enables the scripts
    //For fav & more-tips link, ping is sent by default. Hence ignoring it here
    var filteredLinksIdArray = ["learn", "extension"];
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            targetId = event.target.id;
         
            if (filteredLinksIdArray.find(findTargetId)) {
                setTimeout(function () {
                    sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.CLICK, "KE", targetId + "-LinkClick")
                }, 500);
            };
        }
    });

    removeTabIndex();

    // Load 1,2 and 3 number images based on High Contrast mode is enabled / not
    if (window.matchMedia("(-ms-high-contrast: active)").matches) {
        $("#imgNumber1").attr("src", "../img/FRE_VD_RS2_v1_icon_1_highcontrast.png");
        $("#imgNumber2").attr("src", "../img/FRE_VD_RS2_v1_icon_2_highcontrast.png");
        $("#imgNumber3").attr("src", "../img/FRE_VD_RS2_v1_icon_3_highcontrast.png");
    }
    else {
        $("#imgNumber1").attr("src", "../img/FRE_RS1_icon_1.png");
        $("#imgNumber2").attr("src", "../img/FRE_RS1_icon_2.png");
        $("#imgNumber3").attr("src", "../img/FRE_RS1_icon_3.png");
    }

    var bIsPageLoaded = false;
    // Animation: Initial images and texts are loading
    setTimeout(function () {
        //$("#imgFavorites").css({ opacity: '1' });
        $("#imgFavorites").stop(true, true).fadeTo(300, 1);
    }, 100);

    setTimeout(function () {
        //$("#imgSurfSafely").css({ opacity: '1' });
        $("#imgSurfSafely").stop(true, true).fadeTo(300, 1);
        $("#imgSurfExpand").css({ opacity: '0' });
    }, 300);

    setTimeout(function () {
        //$("#LR").css({ opacity: '1' });
        $("#LR").stop(true, true).fadeTo(300, 1);

    }, 500);

    setTimeout(function () {
        $("#divImgNumber1").stop(false, true).fadeTo(800, 1);
    }, 550);

    setTimeout(function () {
        $("#divImgNumber2").stop(false, true).fadeTo(800, 1);
    }, 600);

    setTimeout(function () {
        $("#divImgNumber3").stop(false, true).fadeTo(800, 1);
    }, 650);

    //$("#scaleWrap").focus();

    // Variables to check user visited corressponding section
    var bFavoritesCheck = false;
    var bSecureCheck = false;
    var bExtensionsCheck = false;

    // Timer Variable
    var favoritesTimer;
    var secureTimer;
    var extensionTimer;

    // Flag to handle Hover message & description display after some delay 
    var bFavoritesDelay = false;
    var bSecureDelay = false;
    var bExtensionDelay = false;
    var bDiscoveryMsgDisplay = false;

    // Flag to store click events happen
    var bFavoritesTappClick = false;
    var bFavoritesAnimated = false;
    var bSecureTappClick = false;
    var bSecureAnimated = false;
    var bExtensionTappClick = false;
    var bExtensionAnimated = false;
    var bBounchingAnimationStop = false;
    var bFavoritesFocusStop = false;

    var bFavoritesAnimatedOpen = false;
    var bSecureAnimatedOpen = false;
    var bExtensionAnimatedOpen = false;
    var sKeyPressed = "";

    //WEDCS flag
    var bwedcsDiscovery = false;
    var bwedcsFaventer = true; var bwedcsFavleave = false;
    var bwedcsSurfenter = true; var bwedcsSurfleave = false;
    var bwedcsExtnenter = true; var bwedcsExtnleave = false;

    // Start Bounching Animation     
    setTimeout(function () {
        bounchingAnimation();
        bIsPageLoaded = true;
    }, 1000);

    //$("#scaleWrap").focus();

    //media query handling in Jquery
    $(window).resize(function () {
        if (window.innerWidth >= 1296) {
            $("#msccLearnMore").css({ 'margin-right': '15px' });
        }
        if (window.innerWidth <= 1295) {
            $("#msccLearnMore").css({ 'margin-right': '0px' });
        }

        if (window.innerWidth <= 500) {
            //For Favourites Image
            $("#imgFavorites").width(115);
            $("#imgFavorites").height(95);

            //For Sheild image
            $("#imgSurfSafely").width(105);
            $("#imgSurfSafely").height(106);
            $("#imgSurfSafely").css({
                top: "60px"
            });

            //For Puzzle position
            $("#LR").css({
                left: "20px",
                top: "-168px"
            });

            //For Puzzle position if animation open
            if (bExtensionAnimated) {
                $("#LR").css({
                    left: "34.5px"
                });
            }

            //For number and check mark images
            $("#imgNumber1 #imgNumber2 #imgNumber3").width(19);
            $("#imgNumber1 #imgNumber2 #imgNumber3").height(19);
        }

        else if (window.innerWidth >= 501 && window.innerWidth < 701) {
            //For Favourites Image
            $("#imgFavorites").width(135);
            $("#imgFavorites").height(115);

            //For Sheild image
            $("#imgSurfSafely").width(125);
            $("#imgSurfSafely").height(126);
            $("#imgSurfSafely").css({
                top: "0px"
            });

            //For Puzzle position
            $("#LR").css({
                left: "27px",
                top: "-237.5px"
            });

            //For Puzzle position if animation open
            if (bExtensionAnimated) {
                $("#LR").css({
                    left: "54px"
                });
            }

            //For number and check mark images
            $("#imgNumber1 #imgNumber2 #imgNumber3").width(21);
            $("#imgNumber1 #imgNumber2 #imgNumber3").height(21);
        }
        else if ((window.innerWidth >= 701) && (window.innerWidth < 916)) {
            //For Favourites Image
            $("#imgFavorites").width(175);
            $("#imgFavorites").height(158);

            //For Sheild image
            $("#imgSurfSafely").width(145);
            $("#imgSurfSafely").height(140);
            $("#imgSurfSafely").css({
                top: "35px"
            });

            //For Puzzle position
            $("#LR").css({
                left: "90px",
                top: "15px"
            });

            //For Puzzle position if animation open
            if (bExtensionAnimated) {
                $("#LR").css({
                    left: "111.5px"
                });
            }

            //For number and check mark images
            $("#imgNumber1 #imgNumber2 #imgNumber3").width(21);
            $("#imgNumber1 #imgNumber2 #imgNumber3").height(21);
        }
        else if ((window.innerWidth >= 916) && (window.innerWidth < 1296)) {
            //Required only for puzzle animation, as we don't have any resizing

            //For Favourites image
            $("#imgFavorites").width(205);
            $("#imgFavorites").height(184);

            //For Sheild image
            $("#imgSurfSafely").width(177);
            $("#imgSurfSafely").height(184);
            $("#imgSurfSafely").css({
                top: "0px"
            });

            //For Puzzle position
            $("#LR").css({
                left: "0px",
                top: "-409px"
            });

            //For Puzzle position if animation open
            if (bExtensionAnimated) {
                $("#LR").css({
                    left: "22px"
                });
            }

            //For number and check mark images
            $("#imgNumber1 #imgNumber2 #imgNumber3").width(21);
            $("#imgNumber1 #imgNumber2 #imgNumber3").height(21);
        }
        else {

            //For Favourites image
            $("#imgFavorites").width(205);
            $("#imgFavorites").height(184);

            //For Sheild image
            $("#imgSurfSafely").width(177);
            $("#imgSurfSafely").height(184);
            $("#imgSurfSafely").css({
                top: "0px"
            });
            //For Puzzle position
            $("#LR").css({
                left: "-95px",
                top: "-77px"
            });

            //For Puzzle position if animation open
            if (bExtensionAnimated) {
                $("#LR").css({
                    left: "-76px"
                });
            }

            //For number and check mark images
            $("#imgNumber1 #imgNumber2 #imgNumber3").width(24);
            $("#imgNumber1 #imgNumber2 #imgNumber3").height(24);
        }
    });

    $(document).keydown(function (event) {
        if (event.shiftKey && event.keyCode == 9)
            sKeyPressed = "shifttab";
        else if (event.keyCode == 9)
            sKeyPressed = "tab";
    });

    // Favorites Section Events
    $("#imgFavorites").click(function () {
        if (bFavoritesAnimated) {
            //Already animated/Animation is in progress. So need to check click status
            if (bFavoritesTappClick) {
                //Need to collapse the favorites items
                //Change the Tap flag to false- to denote the release of tap
                bFavoritesTappClick = false;
                //favoritesBlur();
            }
            else {
                //Not clicked already, this is the first time user have clicked. So keep the animated part open.
                bFavoritesTappClick = true;
                bFavoritesFocusStop = true;
            }
        }
        else {
            //Probably not required to add.
            //Item is not animated at all. so animate it and mark click flag
            bFavoritesFocusStop = true;
        }
    });
    $("#imgFavorites").mouseenter(function () {
        if (bIsPageLoaded) {
            if (!bFavoritesTappClick) {
                bFavoritesAnimated = true;
                bFavoritesFocusStop = true;
                favoritesClick();
            }
        }
    });
    $("#divFavoritesSection").mouseleave(function () {
        if (bFavoritesTappClick) {
            return;
        }
        else {
            bFavoritesDelay = true;
            if (bFavoritesAnimatedOpen) {
                favoritesCollapse();

                setTimeout(function () {
                    if (!bFavoritesAnimatedOpen) {

                        $("#imgOpenFav").stop(false, true).animate({ scale: '0.9' }, 300, 'easeOutCubic');

                        setTimeout(function () {
                            $("#imgOpenFav").stop(false, true).animate({ opacity: '0' }, 200, 'easeOutCubic');
                            $("#imgFavorites").stop(false, true).animate({ opacity: '1' }, 10);
                            //$("#imgFavorites").css({ opacity: '1' },10);
                            $("#imgFavorites").stop(false, true).stop(false, true).animate({ scale: '1.0' }, 200);
                            $("#imgOpenFav").stop(false, true).animate({ scale: '1.0' }, 10);

                        }, 150);

                        setTimeout(function () {
                            if (bFavoritesAnimated) {

                                $("#imgOpenFav").stop(false, true).animate({ opacity: 1 }, 5);
                                $("#imgFavorites").stop(false, true).animate({ opacity: 0 }, 10);
                                $("#imgOpenFav").stop(false, true).animate({ scale: '1.1' }, 10);
                            }
                        }, 350);

                        if (window.innerWidth <= 500) {
                            $('#imgFavorites').width(115);
                        }
                        else if (window.innerWidth >= 501 && window.innerWidth < 701) {
                            $('#imgFavorites').width(135);
                        }
                        else if (window.innerWidth >= 701 && window.innerWidth < 916) {
                            $('#imgFavorites').width(175);
                        }
                        else if ((window.innerWidth >= 916) && (window.innerWidth < 1296)) {
                            $('#imgFavorites').width(205);
                        }
                        else {
                            $('#imgFavorites').width(205); // Units are assumed to be pixels
                        }
                        //$("#imgFavorites").css({
                        //    zoom: "1.0"
                        //});
                    }
                }, 400);
            }
            // Hide favorites box
            $("#favorites-box").stop(true, true).fadeTo(100, 0);
            $("#divImgNumber1").stop(true, true).fadeTo(350, 1);

            /*
            $("#favorites-box").css({
                transform: 'scale(1.0)',
                display: 'none'
            });*/

            // Show / hide Discovery center
            show_Discovery_Center();
            bFavoritesAnimated = false;
        }
    });
    $("#imgFavorites").focus(function (e) {
        if (bFavoritesAnimated) {
            return;
        }
        else {
            if (sKeyPressed == "tab" || !bFavoritesAnimated) {
                favoritesFocus();
            }
        }
    });
    $("#imgFavorites").blur(function () {
        bFavoritesTappClick = false;

        if (sKeyPressed == "shifttab" || bFavoritesAnimated) {
            favoritesBlur();
            bFavoritesAnimated = false;
        }
    });
    $("#fav").focus(function () {
        bBounchingAnimationStop = true;
        bDiscoveryMsgDisplay = false;
        //show_Discovery_Center_Changes();
        if (sKeyPressed == "shifttab") {

            // Collapse all other section except Favorites
            clearCollapse("favorites");
            favoritesExpand();

            // Display the favorites box
            $("#favorites-box").stop(true, true).fadeTo(550, 1);
            $("#favorites-box").css({
                transform: 'scale(1.0)',
                display: 'block'

            });

            // Hide Discovery center section 
            //$("#divDiscoverySection").stop(true, true).fadeTo(100, 0);
            //$("#divDiscoverySection").css({
            //    opacity: '0'
            //});
            $("#divDiscoverySection").css({
                display: 'none'
            });
        }
        if (bFavoritesFocusStop) {
            $("#fav").css({
                "pointer-events": "inherit",
                cursor: "pointer"
            });
        }
    });
    $("#fav").blur(function () {
        bFavoritesTappClick = false;
        bFavoritesFocusStop = false;
        if (sKeyPressed == "tab") {
            favoritesCollapse();

            $("#imgOpenFav").stop(false, true).animate({ scale: '0.9' }, 300, 'easeOutCubic');

            setTimeout(function () {
                $("#imgOpenFav").stop(false, true).animate({ opacity: '0' }, 200, 'easeOutCubic');
                $("#imgFavorites").stop(false, true).animate({ opacity: '1' }, 10);
                //$("#imgFavorites").css({ opacity: '1' },10);
                $("#imgFavorites").stop(false, true).stop(false, true).animate({ scale: '1.0' }, 200);
                $("#imgOpenFav").stop(false, true).animate({ scale: '1.0' }, 10);

            }, 150);

            setTimeout(function () {
                if (bFavoritesAnimated) {

                    $("#imgOpenFav").stop(false, true).animate({ opacity: 1 }, 5);
                    $("#imgFavorites").stop(false, true).animate({ opacity: 0 }, 10);
                    $("#imgOpenFav").stop(false, true).animate({ scale: '1.1' }, 10);
                }
            }, 350);

            if (window.innerWidth <= 500) {
                $('#imgFavorites').width(115);
            }
            else if (window.innerWidth >= 501 && window.innerWidth < 701) {
                $('#imgFavorites').width(135);
            }
            else if (window.innerWidth >= 701 && window.innerWidth < 916) {
                $('#imgFavorites').width(175);
            }
            else if ((window.innerWidth >= 916) && (window.innerWidth < 1296)) {
                $('#imgFavorites').width(205);
            }
            else {
                $('#imgFavorites').width(205); // Units are assumed to be pixels
            }

            // Hide favorites box
            $("#favorites-box").stop(true, true).fadeTo(100, 0);
            /*
            $("#favorites-box").css({
                transform: 'scale(1.0)',
                display: 'block'
            });*/
            $("#divImgNumber1").stop(true, true).fadeTo(350, 1);

            // Call discovery center function to show / hide discovery msg
            show_Discovery_Center_Changes();
        }
    });

    // Surf Safely Section Events
    $("#imgSurfSafely").click(function () {

        if (bSecureAnimated) {
            //Already animated/Animation is in progress. So need to check click status
            if (bSecureTappClick) {
                //Need to collapse the favorites items
                //Change the Tap flag to false- to denote the release of tap
                bSecureTappClick = false;
            }
            else {
                //Not clicked already, this is the first time user have clicked.So keep the animated part open.
                bSecureTappClick = true;
            }

        }
        else {
            //Probably not required to add.
            //Item is not animated at all. so animate it and mark click flag
        }
    });
    $("#imgSurfSafely").mouseenter(function () {
        if (bIsPageLoaded) {
            if (!bSecureTappClick) {
                bSecureAnimated = true;
                surfSaferClick();
            }
        }
    });
    $("#divSurfSafelySection").mouseleave(function () {
        if (bSecureTappClick) {
            return;
        }
        else {
            bSecureDelay = true;
            surfSaferCollapse();
            $("#divImgSurfSafelyContent").stop(true, true).fadeTo(100, 0);
            // Hide Surf safely content section 
            /*
            $("#divImgSurfSafelyContent").css({
                transform: 'scale(1.0)',
                display: 'none'
            });*/

            $("#divImgNumber2").stop(true, true).fadeTo(350, 1);

            // Call discovery center function to show / hide discovery msg
            show_Discovery_Center();
            bSecureAnimated = false;
        }
    });
    $("#imgSurfSafely").focus(function () {
        if (bSecureAnimated) {
            return;
        }
        else {
            if (sKeyPressed == "tab" || !bSecureAnimated) {
                surfSaferFocus();
            }
        }
    });
    $("#imgSurfSafely").blur(function () {
        bSecureTappClick = false;

        if (sKeyPressed == "shifttab" || bSecureAnimated) {
            surfSaferBlur();
            bSecureAnimated = false;
        }

    });
    $("#learn").focus(function () {

        bBounchingAnimationStop = true;
        bDiscoveryMsgDisplay = false;
        //show_Discovery_Center_Changes();
        if (sKeyPressed == "shifttab") {
            // Collapse all other section except Surf safer
            clearCollapse("surfsafer");
            surfSaferExpand();

            $("#divImgSurfSafelyContent").stop(true, true).fadeTo(550, 1);
            // Show Surf safely content section 
            $("#divImgSurfSafelyContent").css({
                transform: 'scale(1.0)',
                display: 'block'
            });

            // Hide Discovery section 
            //$("#divDiscoverySection").stop(true, true).fadeTo(50, 0);
            //$("#divDiscoverySection").css({
            //    opacity: '0'
            //});
        }
        $("#divDiscoverySection").css({
            display: 'none'
        });
        $("#learn").css({
            "pointer-events": "inherit",
            cursor: "pointer"
        });
    });
    $("#learn").blur(function () {
        bSecureTappClick = false;
        if (sKeyPressed == "tab") {
            surfSaferCollapse();

            // Hide Surf safely content section 
            $("#divImgSurfSafelyContent").stop(true, true).fadeTo(100, 0);
            /*
            $("#divImgSurfSafelyContent").css({
                transform: 'scale(1.0)',
                display: 'block'
            });*/
            $("#divImgNumber2").stop(true, true).fadeTo(350, 1);

            // Call discovery center function to show / hide discovery msg
            show_Discovery_Center_Changes();
        }
    });

    // Extension Section Events
    $("#LR").click(function () {
        if (bExtensionAnimated) {
            //Already animated/Animation is in progress. So need to check click status
            if (bExtensionTappClick) {
                //Need to collapse the favorites items
                //Change the Tap flag to false- to denote the release of tap
                bExtensionTappClick = false;
            }
            else {
                //Not clicked already, this is the first time user have clicked.So keep the animated part open.
                bExtensionTappClick = true;
            }

        }
        else {
            //Probably not required to add.
            //Item is not animated at all. so animate it and mark click flag
        }
    });
    $("#LR").mouseenter(function () {
        if (bIsPageLoaded) {
            if (!bExtensionTappClick) {
                bExtensionAnimated = true;
                extensionClick();
            }
        }
    });
    $("#divExtensionSection").mouseleave(function () {
        if (bExtensionTappClick) {
            return;
        }
        else {
            bExtensionAnimated = false;
            bExtensionDelay = true;

            extensionCollapse();

            // Hide Extension content section 
            $("#divExtensionContent").stop(true, true).fadeTo(100, 0);
            /*
            $("#divExtensionContent").css({
                transform: 'scale(1.0)',
                display: 'none'
            });*/

            $("#divImgNumber3").stop(true, true).fadeTo(350, 1);

            // Call discovery center function to show / hide discovery msg
            show_Discovery_Center();
            bExtensionAnimated = false;
        }
    });
    $("#LR").focus(function () {
        if (bExtensionAnimated) {
            return;
        }
        else {
            if (sKeyPressed == "tab" || !bExtensionAnimated) {
                extensionFocus();
            }
        }
    });
    $("#LR").blur(function () {
        bExtensionTappClick = false;
        if (sKeyPressed == "shifttab" || bExtensionAnimated) {
            extensionBlur();
            bExtensionAnimated = false;
        }
    });
    $("#extension").focus(function () {
        bBounchingAnimationStop = true;
        bDiscoveryMsgDisplay = false;
        $("#divDiscoverySection").css("animation", "none");
        //show_Discovery_Center_Changes();
        if (sKeyPressed == "shifttab") {

            // Collapse all other section except extension
            clearCollapse("extension");
            extensionExpand();

            // Show Extension content section 
            $("#divExtensionContent").stop(true, true).fadeTo(550, 1);
            $("#divExtensionContent").css({
                transform: 'scale(1.0)',
                display: 'block'
            });

            // Hide Discovery Section 
            $("#divDiscoverySection").stop(true, true).fadeTo(50, 0);
            //$("#divDiscoverySection").css({
            //    opacity: '0'
            //});
        }
        $("#extension").css({
            "pointer-events": "inherit",
            cursor: "pointer"
        });
    });
    $("#extension").blur(function () {
        bExtensionTappClick = false;
        if (sKeyPressed == "tab") {
            extensionCollapse();

            // Hide Extension content section 
            $("#divExtensionContent").stop(true, true).fadeTo(100, 0);
            /*
            $("#divExtensionContent").css({
                transform: 'scale(1.0)',
                display: 'block'
            });*/
            $("#divImgNumber3").stop(true, true).fadeTo(350, 1);

            // Call discovery center function to show / hide discovery msg
            show_Discovery_Center_Changes();
        }
    });

    // Button Events
    $("#learn").click(function () {
        surfSaferCollapse();
        $("#imgNumber2").attr("src", "../img/FRE_RS1_check.png");
        bSecureCheck = true;

        $("#divImgNumber2").stop(true, true).fadeTo(350, 1);
        // Hide Surf safely content section 
        $("#divImgSurfSafelyContent").stop(true, true).fadeTo(300, 0);
        $("#divImgSurfSafelyContent").css({
            transform: 'scale(1.0)',
            display: 'none'
        });

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center();
    });
    $("#extension").click(function () {
        extensionCollapse();
        $("#imgNumber3").attr("src", "../img/FRE_RS1_check.png");
        bExtensionsCheck = true;

        $("#divImgNumber3").stop(true, true).fadeTo(350, 1);
        // Hide Extension content section 
        $("#divExtensionContent").stop(true, true).fadeTo(300, 0);
        $("#divExtensionContent").css({
            transform: 'scale(1.0)',
            display: 'none'
        });

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center();
    });

    // Favorites section click / mouse enter events
    function favoritesClick() {
        staticImgPosition();
        bFavoritesDelay = false;
        bDiscoveryMsgDisplay = false;

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center_Changes();

        // Collapse all other section except Favorites
        clearCollapse("favorites");

        setTimeout(function () {
            if (bFavoritesDelay)
                return;
            bBounchingAnimationStop = true;
            favoritesExpand();

            $("#favorites-box").stop(true, true).fadeTo(550, 1);
            // Show Favorites content section 
            $("#favorites-box").css({
                transform: 'scale(1.0)',
                display: 'block'
            });

            // Hide Discovery section 
            $("#divDiscoverySection").css({
                //opacity: '0'
                display: 'none'
            });
        }, 50);
    }

    // Favorites section focus events
    function favoritesFocus() {
        bBounchingAnimationStop = true;
        bDiscoveryMsgDisplay = false;
        bFavoritesOpen = true;

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center_Changes();

        // Collapse all other section except Favorites
        clearCollapse("favorites");
        favoritesExpand();

        // Show Favorites content section 
        $("#favorites-box").stop(true, true).fadeTo(550, 1);

        $("#favorites-box").css({
            transform: 'scale(1.0)',
            display: 'block'
        });

        // Hide Discovery section 
        //$("#divDiscoverySection").stop(true, true).fadeTo(50, 0);
        //$("#divDiscoverySection").css({
        //    opacity: '0'
        //});

        $("#divDiscoverySection").css({
            display: 'none'
        });
    }

    // Favorites section blur events
    function favoritesBlur() {
        favoritesCollapse();
        setTimeout(function () {
            if (!bFavoritesAnimatedOpen) {
                $("#imgOpenFav").stop(false, true).animate({ scale: '0.9' }, 300, 'easeOutCubic');

                setTimeout(function () {
                    $("#imgOpenFav").stop(false, true).animate({ opacity: '0' }, 200, 'easeOutCubic');
                    $("#imgFavorites").stop(false, true).animate({ opacity: '1' }, 10);
                    //$("#imgFavorites").css({ opacity: '1' },10);
                    $("#imgFavorites").stop(false, true).stop(false, true).animate({ scale: '1.0' }, 200);
                    $("#imgOpenFav").stop(false, true).animate({ scale: '1.0' }, 10);

                }, 150);

                setTimeout(function () {
                    if (bFavoritesAnimated) {

                        $("#imgOpenFav").stop(false, true).animate({ opacity: 1 }, 5);
                        $("#imgFavorites").stop(false, true).animate({ opacity: 0 }, 10);
                        $("#imgOpenFav").stop(false, true).animate({ scale: '1.1' }, 10);
                    }
                }, 350);

                if (window.innerWidth <= 500) {
                    $('#imgFavorites').width(115);
                }
                else if (window.innerWidth >= 501 && window.innerWidth < 701) {
                    $('#imgFavorites').width(135);
                }
                else if (window.innerWidth >= 701 && window.innerWidth < 916) {
                    $('#imgFavorites').width(175);
                }
                else if ((window.innerWidth >= 916) && (window.innerWidth < 1296)) {
                    $('#imgFavorites').width(205);
                }
                else {
                    $('#imgFavorites').width(205); // Units are assumed to be pixels
                }
                //$("#imgFavorites").css({
                //    zoom: "1.0"
                //});
            }
        }, 400);

        // Hide Favorites content section 
        $("#favorites-box").stop(true, true).fadeTo(100, 0);
        /*
        $("#favorites-box").css({
            transform: 'scale(1.0)',
            display: 'block'
        });*/
        $("#divImgNumber1").stop(true, true).fadeTo(350, 1);

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center_Changes();
    }

    // Surf safer section click / mouse enter events
    function surfSaferClick() {
        staticImgPosition();
        bSecureDelay = false;
        bDiscoveryMsgDisplay = false;

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center_Changes();

        // Collapse all other section except Surf safer
        clearCollapse("surfsafer");
        setTimeout(function () {
            if (bSecureDelay)
                return;
            bBounchingAnimationStop = true;
            surfSaferExpand();

            $("#divImgSurfSafelyContent").stop(true, true).fadeTo(550, 1);
            // Show Surf safer content section 
            $("#divImgSurfSafelyContent").css({
                transform: 'scale(1.0)',
                display: 'block'
            });

            // Hide Discovery content section
            $("#divDiscoverySection").css({
                display: 'none'
            });

        }, 50);
    }

    // Surf safer section focus events
    function surfSaferFocus() {
        bBounchingAnimationStop = true;
        bDiscoveryMsgDisplay = false;

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center_Changes();

        // Collapse all other section except Surf safer
        clearCollapse("surfsafer");
        surfSaferExpand();

        // Show Surf safer content section 
        $("#divImgSurfSafelyContent").stop(true, true).fadeTo(550, 1);
        $("#divImgSurfSafelyContent").css({
            transform: 'scale(1.0)',
            display: 'block'
        });

        // Hide Discovery content section
        //$("#divDiscoverySection").fadeTo(50, 0);
        //$("#divDiscoverySection").css({
        //    opacity: '0'
        //});

        $("#divDiscoverySection").css({
            display: 'none'
        });
    }

    // Surf safer section blur events
    function surfSaferBlur() {
        surfSaferCollapse();

        // Show Surf safer content section 
        $("#divImgSurfSafelyContent").stop(true, true).fadeTo(100, 0);
        /*
        $("#divImgSurfSafelyContent").css({
            transform: 'scale(1.0)',
            display: 'block'

        });*/
        $("#divImgNumber2").stop(true, true).fadeTo(350, 1);

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center_Changes();
    }

    // Extension section click / mouse enter events
    function extensionClick() {
        staticImgPosition();
        bExtensionDelay = false;
        bDiscoveryMsgDisplay = false;

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center_Changes();

        // Collapse all other section except extension
        clearCollapse("extension");
        setTimeout(function () {
            if (bExtensionDelay)
                return;
            bBounchingAnimationStop = true;
            extensionExpand();

            $("#divExtensionContent").stop(true, true).fadeTo(550, 1);
            // Show extension content section 
            $("#divExtensionContent").css({
                transform: 'scale(1.0)',
                display: 'block'
            });

            // Hide Discovery content section 
            $("#divDiscoverySection").css({
                display: 'none'
            });

        }, 50);
    }

    // Extension section focus events
    function extensionFocus() {
        bBounchingAnimationStop = true;
        bDiscoveryMsgDisplay = false;

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center_Changes();

        // Collapse all other section except extension
        clearCollapse("extension");
        extensionExpand();

        // Show extension content section 
        $("#divExtensionContent").stop(true, true).fadeTo(550, 1);
        $("#divExtensionContent").css({
            transform: 'scale(1.0)',
            display: 'block'
        });

        $("#divDiscoverySection").css("animation", "none");
        // Hide Discovery content section 
        $("#divDiscoverySection").stop(true, true).fadeTo(50, 0);
        //$("#divDiscoverySection").css({
        //    opacity: '0'
        //});
    }

    // Extension section blur events
    function extensionBlur() {
        extensionCollapse();

        // Show extension content section 
        $("#divExtensionContent").stop(true, true).fadeTo(100, 0);
        /*
        $("#divExtensionContent").css({
            transform: 'scale(1.0)',
            display: 'block'

        });*/
        $("#divImgNumber3").stop(true, true).fadeTo(350, 1);

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center_Changes();
    }

    // Collapse other 2 section
    function clearCollapse(currentSection) {
        if (currentSection != "favorites") {
            //If Favorites animated, need not invoke collapse
            if (bFavoritesAnimatedOpen) {
                favoritesCollapse();

                setTimeout(function () {

                    $("#imgOpenFav").stop(false, true).animate({ scale: '0.9' }, 300, 'easeOutCubic');

                    setTimeout(function () {
                        $("#imgOpenFav").stop(false, true).animate({ opacity: '0' }, 200, 'easeOutCubic');
                        $("#imgFavorites").stop(false, true).animate({ opacity: '1' }, 10);
                        //$("#imgFavorites").css({ opacity: '1' },10);
                        $("#imgFavorites").stop(false, true).stop(false, true).animate({ scale: '1.0' }, 200);
                        $("#imgOpenFav").stop(false, true).animate({ scale: '1.0' }, 10);

                    }, 1);

                    //setTimeout(function () {
                    //    if (bFavoritesAnimated) {

                    //        $("#imgOpenFav").stop(false, true).animate({ opacity: 1 }, 5);
                    //        $("#imgFavorites").stop(false, true).animate({ opacity: 0 }, 10);
                    //        $("#imgOpenFav").stop(false, true).animate({ scale: '1.1' }, 10);
                    //    }
                    //}, 350);

                    if (window.innerWidth <= 500) {
                        $('#imgFavorites').width(115);
                    }
                    else if (window.innerWidth >= 501 && window.innerWidth < 701) {
                        $('#imgFavorites').width(135);
                    }
                    else if (window.innerWidth >= 701 && window.innerWidth < 916) {
                        $('#imgFavorites').width(175);
                    }
                    else if ((window.innerWidth >= 916) && (window.innerWidth < 1296)) {
                        $('#imgFavorites').width(205);
                    }
                    else {
                        $('#imgFavorites').width(205); // Units are assumed to be pixels
                    }
                    //$("#imgFavorites").css({
                    //    zoom: "1.0"
                    //});
                }, 1);
            }
            $("#favorites-box").stop(true, true).fadeTo(100, 0);
            /*
            $("#favorites-box").css({
                transform: 'scale(1.0)',
                display: 'block'

            });*/
            $("#divImgNumber1").stop(true, true).fadeTo(350, 1);
            bFavoritesTappClick = false;
            //}
            bFavoritesAnimated = false;
        }
        if (currentSection != "surfsafer") {
            //If Surf safely animated, need not invoke collapse
            if (bSecureAnimatedOpen) {
                surfSaferCollapse();
            }
            $("#divImgSurfSafelyContent").stop(true, true).fadeTo(100, 0);
            /*
            $("#divImgSurfSafelyContent").css({
                transform: 'scale(1.0)',
                display: 'block'

            });*/
            $("#divImgNumber2").stop(true, true).fadeTo(350, 1);
            bSecureTappClick = false;
            // }
            bSecureAnimated = false;
        }
        if (currentSection != "extension") {
            //If Extension animated, need not invoke collapse
            if (bExtensionAnimatedOpen) {
                extensionCollapse();
            }
            $("#divExtensionContent").stop(true, true).fadeTo(100, 0);
            /*
            $("#divExtensionContent").css({
                transform: 'scale(1.0)',
                display: 'block'

            });*/
            $("#divImgNumber3").stop(true, true).fadeTo(350, 1);
            bExtensionTappClick = false;
            //}
            bExtensionAnimated = false;
        }
    }

    // Bounching Animation Block
    function bounchingAnimation() {

        $('#imgFavorites').delay(50).animate({ rotate: '-4deg' }, 70);
        $('#imgFavorites').delay(12).animate({ rotate: '0deg' }, 70);
        $('#imgFavorites').delay(12).animate({ rotate: '4deg' }, 70);
        $('#imgFavorites').delay(12).animate({ rotate: '0deg' }, 70);
        $('#imgFavorites').delay(12).animate({ rotate: '-4deg' }, 70);
        $('#imgFavorites').delay(12).animate({ rotate: '0deg' }, 70);
        //$('#imgFavorites').delay(10).animate({ rotate: '4deg' }, 40);
        //$('#imgFavorites').delay(10).animate({ rotate: '0deg' }, 40);

        $('#imgSurfSafely').delay(450).animate({ rotate: '-4deg' }, 70);
        $('#imgSurfSafely').delay(12).animate({ rotate: '0deg' }, 70);
        $('#imgSurfSafely').delay(12).animate({ rotate: '4deg' }, 70);
        $('#imgSurfSafely').delay(12).animate({ rotate: '0deg' }, 70);
        $('#imgSurfSafely').delay(12).animate({ rotate: '-4deg' }, 70);
        $('#imgSurfSafely').delay(12).animate({ rotate: '0deg' }, 70);
        //$('#imgSurfSafely').delay(10).animate({ rotate: '4deg' }, 40);
        //$('#imgSurfSafely').delay(10).animate({ rotate: '0deg' }, 40);

        $('#LR').delay(850).animate({ rotate: '-4deg' }, 70);
        $('#LR').delay(12).animate({ rotate: '0deg' }, 70);
        $('#LR').delay(12).animate({ rotate: '4deg' }, 70);
        $('#LR').delay(12).animate({ rotate: '0deg' }, 70);
        $('#LR').delay(12).animate({ rotate: '-4deg' }, 70);
        $('#LR').delay(12).animate({ rotate: '0deg' }, 70);
        //$('#LR').delay(10).animate({ rotate: '4deg' }, 40);
        //$('#LR').delay(10).animate({ rotate: '0deg' }, 40);

        setTimeout(function () {
            if (bBounchingAnimationStop) {
                staticImgPosition();
                return;
            }
            bounchingAnimation();
        }, 2000);
    }

    // Discovery Center Show / Hide logic if user use mouseenter/mouseleave eventes
    function show_Discovery_Center() {
        if (bFavoritesAnimatedOpen || bSecureAnimatedOpen || bExtensionAnimatedOpen) {
            $("#divDiscoverySection").css({
                opacity: '1',
                display: 'none'
            });
            return;
        }

        if (bFavoritesCheck && bSecureCheck && bExtensionsCheck) {
            $("#divDiscoverySection").attr("aria-hidden", "false");
            bDiscoveryMsgDisplay = true;
            setTimeout(function () {
                if (!(bFavoritesAnimatedOpen || bSecureAnimatedOpen || bExtensionAnimatedOpen)) {
                    if (bDiscoveryMsgDisplay) {
                        $("#divDiscoverySection").attr("aria-hidden", "false");
                        $("#more-tips").attr("role", "button");
                        $("#more-tips").attr("aria-hidden", "false");
                        //$("#divDiscoverySection").fadeTo(100, 1);
                        //$("#divDiscoverySection").css({
                        //    opacity: '1',
                        //    display: 'block',
                        //});
                        $("#divDiscoverySection").css("animation", "mymove 0.6s forwards");
                        $("#divDiscoverySection").stop(true, true).fadeTo(400, 1);
                        //$("#divDiscoverySection").stop(true,true).animate({ top: '60px', opacity: '0' }, "fast");
                        //$("#divDiscoverySection").stop(true,true).animate({ top: '10px', opacity: '1' }, "slow");
                    }
                }
            }, 700);

            // WEDCS Discovery Section Tracking
            if (!bwedcsDiscovery) {
                if (typeof (MscomCustomEvent) == "function") {
                    MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'DiscoverySectionDisplay');
                }
                sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.OTHER, "O", "DiscoverySectionDisplay");
                bwedcsDiscovery = true;
            }
        }
        else {
            $("#divDiscoverySection").attr("aria-hidden", "true");
            $("#more-tips").attr("aria-hidden", "true");
            $("#more-tips").attr("role", "button");
            $("#divDiscoverySection").css({
                display: 'none',
                opacity: '1'
            });
        }

    }

    // Discovery Center Show (Opacity 1) / Hide (Opacity 0) logic if user use keyboard events (Foucs, blur)
    function show_Discovery_Center_Changes() {
        if (bFavoritesAnimatedOpen || bSecureAnimatedOpen || bExtensionAnimatedOpen) {
            $("#divDiscoverySection").stop(true, true).fadeTo(50, 0);
            $("#divDiscoverySection").css({
                display: 'none'
            });
            return;
        }
        if (bFavoritesCheck && bSecureCheck && bExtensionsCheck) {
            $("#divDiscoverySection").attr("aria-hidden", "false");
            bDiscoveryMsgDisplay = true;
            setTimeout(function () {
                if (!(bFavoritesAnimatedOpen || bSecureAnimatedOpen || bExtensionAnimatedOpen)) {
                    if (bDiscoveryMsgDisplay) {
                        $("#divDiscoverySection").attr("aria-hidden", "false");
                        //$("#divDiscoverySection").attr("tabindex", "7");
                        $("#more-tips").attr("role", "button");
                        $("#more-tips").attr("aria-hidden", "false");
                        //$("#more-tips").attr("tabindex", "8");
                        /*
                        $("#divDiscoverySection").stop(true, true).fadeTo(400, 1);
                        $("#divDiscoverySection").css({                        
                            display: 'block'
                        });*/

                        //$("#divDiscoverySection").css({
                        //    opacity: '1',
                        //    display: 'block'
                        //});

                        $("#divDiscoverySection").css("animation", "mymove 0.6s forwards");
                        $("#divDiscoverySection").stop(false, true).fadeTo(400, 1);

                        //$("#divDiscoverySection").stop(true,true).animate({ top: '60px', opacity: '0' }, "fast");
                        //$("#divDiscoverySection").stop(true,true).animate({ top: '10px', opacity: '1' }, "slow");
                    }
                }
            }, 700);

            // WEDCS Discovery Section Tracking
            if (!bwedcsDiscovery) {
                if (typeof (MscomCustomEvent) == "function") {
                    MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'DiscoverySectionDisplay');
                }
                sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.OTHER, "O", "DiscoverySectionDisplay");
                bwedcsDiscovery = true;
            }
        }
        else {
            $("#divDiscoverySection").attr("aria-hidden", "true");
            //$("#divDiscoverySection").removeAttr("tabindex");
            $("#more-tips").attr("aria-hidden", "true");
            $("#more-tips").attr("role", "button");
            //$("#more-tips").removeAttr("tabindex");

            //$("#divDiscoverySection").stop(true, true).fadeTo(50, 0);
            $("#divDiscoverySection").css({
                display: 'none'
            });
        }

    }

    // Favorites section expand
    function favoritesExpand() {
        favoritesTimer = new Date();
        $("#imgStar").css({
            opacity: '1'
        });
        staticImgPosition();
        $("#imgFavorites").stop(true, true).animate({
            rotate: '0'
        }, 'slow');
        $("#imgFavorites").stop(true, true).animate({
            rotate: '0'
        }, 'slow');



        $("#imgOpenFav").stop(false, true).animate({ opacity: 1 }, 10);
        $("#imgFavorites").stop(false, true).animate({ opacity: 0 }, 20);
        $("#imgOpenFav").stop(false, true).animate({ scale: '1.1' }, 200);

        $("#imgStar").stop(false, true).animate({
            top: "-50%"
        }, 419, 'easeOutCubic');



        $("#divImgNumber1").stop(false, true).fadeTo(100, 0);
        /*$("#divImgNumber1").css({
            opacity: '0'
        });*/
        $("#divDiscoverySection").css({
            //opacity: '0'
            display: 'none'
        });
        bFavoritesAnimatedOpen = true;

        /* Link click after collapse issue v-abselv*/
        $("#fav").css({
            "pointer-events": "inherit",
            cursor: "pointer"
        });
        /* Link click after collapse issue v-abselv*/

        // WEDCS Favorites Expand
        if (bwedcsFaventer) {
            if (typeof (MscomCustomEvent) == "function") {
                MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'FavoritesExpand');
            }
            sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.EXPAND, "PH", "FavoritesExpand");
            bwedcsFaventer = false;
            bwedcsFavleave = true;
        }
    }

    // Favorites section collapse
    function favoritesCollapse() {

        $("#imgStar").stop(false, true).animate({
            top: "20%"
        }, 'slow');



        //$("#divImgNumber1").css({
        //    opacity: '1'
        //});

        if (!bFavoritesCheck) {
            if (favoritesTimer != "") {
                var elapsedTime = new Date() - favoritesTimer;
                favoritesTimer = "";
                if (elapsedTime > 300) {
                    $("#imgNumber1").attr("src", "../img/FRE_RS1_check.png");
                    bFavoritesCheck = true;
                }
            }
        }
        bFavoritesAnimatedOpen = false;

        /* Link click after collapse issue v-abselv*/
        $("#fav").css({
            "pointer-events": "none",
            cursor: "default"
        });
        /* Link click after collapse issue v-abselv*/

        // WEDCS Favorites Collapse
        if (bwedcsFavleave) {
            if (typeof (MscomCustomEvent) == "function") {
                MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'FavoritesCollapse');
            }
            sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.REDUCE, "PL", "FavoritesCollapse");
            bwedcsFavleave = false;
            bwedcsFaventer = true;
        }
    }

    // Surf safely section expand
    function surfSaferExpand() {
        secureTimer = new Date();
        staticImgPosition();
        if (window.innerWidth <= 500) {
            $("#imgSurfSafely").stop(true, true).animate({
                rotate: '0',
                top: "50px"
            }, 700, 'easeOutCubic');
        }
        else if (window.innerWidth >= 701 && window.innerWidth < 916) {
            $("#imgSurfSafely").stop(true, true).animate({
                rotate: '0',
                top: "3px"
            }, 700, 'easeOutCubic');
        }
        else {
            $("#imgSurfSafely").stop(true, true).animate({
                rotate: '0',
                top: "-20px"
            }, 700, 'easeOutCubic');
        }

        $("#imgSurfExpand").stop(false, true).animate({ scale: '1.0', opacity: '1.0' }, 150, 'easeOutCubic');

        $("#divImgNumber2").stop(false, true).fadeTo(100, 0);
        /*$("#divImgNumber2").css({
            opacity: '0'
        });*/
        $("#divDiscoverySection").css({
            //opacity: '0'
            display: 'none'
        });
        bSecureAnimatedOpen = true;

        /* Link click after collapse issue v-abselv*/
        $("#learn").css({
            "pointer-events": "inherit",
            cursor: "pointer"
        });
        /* Link click after collapse issue v-abselv*/

        // WEDCS SurfSafely Expand
        if (bwedcsSurfenter) {
            if (typeof (MscomCustomEvent) == "function") {
                MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'SurfSafelyExpand');
            }
            sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.EXPAND, "PH", "SurfSafelyExpand");
            bwedcsSurfenter = false;
            bwedcsSurfleave = true;
        }
    }

    // Surf safely section collapse
    function surfSaferCollapse() {

        $("#imgSurfExpand").stop(false, true).animate({ scale: '0.1', opacity: '0' }, 100);
        if (window.innerWidth <= 500) {
            $("#imgSurfSafely").width(105);
            $("#imgSurfSafely").height(106);
            $("#imgSurfSafely").stop(true, true).animate({
                top: "60px"
            }, 'slow');
        }
        else if (window.innerWidth >= 701 && window.innerWidth < 916) {
            $("#imgSurfSafely").stop(true, true).animate({
                top: "35px"
            }, 'slow');
        }
        else {

            $("#imgSurfSafely").stop(true, true).animate({
                top: "0px"
            }, 'slow');
        }

        //$("#divImgNumber2").stop(true, true).fadeTo(350, 1);
        //$("#divImgNumber2").css({
        //    opacity: '1.0'
        //});

        if (!bSecureCheck) {
            if (secureTimer != "") {
                var elapsedTime = new Date() - secureTimer;
                secureTimer = "";
                if (elapsedTime > 300) {
                    $("#imgNumber2").attr("src", "../img/FRE_RS1_check.png");
                    bSecureCheck = true;
                }
            }
        }
        bSecureAnimatedOpen = false;

        /* Link click after collapse issue v-abselv*/
        $("#learn").css({
            "pointer-events": "none",
            cursor: "default"
        });
        /* Link click after collapse issue v-abselv*/

        // WEDCS Surf Safely Collapse
        if (bwedcsSurfleave) {
            if (typeof (MscomCustomEvent) == "function") {
                MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'SurfSafelyCollapse');
            }
            sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.REDUCE, "PL", "SurfSafelyCollapse");
            bwedcsSurfleave = false;
            bwedcsSurfenter = true;
        }
    }

    // Extension section expand
    function extensionExpand() {
        extensionTimer = new Date();
        staticImgPosition();
        if (window.innerWidth <= 500) {
            $("#LR").stop(true, true).animate({
                rotate: '0',
                left: "34px"
            }, 550, 'easeOutCubic');
        }
        else if (window.innerWidth >= 501 && window.innerWidth < 701) {
            $("#LR").stop(true, true).animate({
                rotate: '0',
                left: "54px"
            }, 550, 'easeOutCubic');
        }
        else if (window.innerWidth >= 701 && window.innerWidth < 916) {
            $("#LR").stop(true, true).animate({
                rotate: '0',
                left: "111.5px"
            }, 550, 'easeOutCubic');
        }
        else if ((window.innerWidth >= 916) && (window.innerWidth < 1296)) {
            $("#LR").stop(true, true).animate({
                rotate: '0',
                left: "22px"
            }, 550, 'easeOutCubic');
        }
        else {

            $("#LR").stop(true, true).animate({
                rotate: '0',
                left: "-76px"
            }, 550, 'easeOutCubic');
        }
        /*
        $("#UR").stop(true, true).animate({
            opacity: "1"
        }, 1000);
        $("#UL").stop(true, true).animate({
            opacity: "1"
        }, 1500);
        $("#LL").stop(true, true).animate({
            opacity: "1"
        }, 2000);*/

        $("#UR").stop(true, true).fadeTo(100, 1);
        $("#UL").stop(true, true).fadeTo(450, 1);
        $("#LL").stop(true, true).fadeTo(534, 1);

        $("#divImgNumber3").stop(false, true).fadeTo(100, 0);

        //$("#divImgNumber3").stop(true, true).animate({ opacity: 0 }, 100);
        /*
        $("#divImgNumber3").css({
            opacity: '0'
        });
        */
        bExtensionAnimatedOpen = true;

        /* Link click after collapse issue v-abselv*/
        $("#extension").css({
            "pointer-events": "inherit",
            cursor: "pointer"
        });
        /* Link click after collapse issue v-abselv*/

        // WEDCS Extension Expand
        if (bwedcsExtnenter) {
            if (typeof (MscomCustomEvent) == "function") {
                MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'ExtensionExpand');
            }
            sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.EXPAND, "PH", "ExtensionExpand");
            bwedcsExtnenter = false;
            bwedcsExtnleave = true;
        }
    }

    // Extension section collapse
    function extensionCollapse() {
        /*
        $("#LL").stop(true, true).animate({
            opacity: "0"
        }, 100);
        $("#UL").stop(true, true).animate({
            opacity: "0"
        }, 800);
        $("#UR").stop(true, true).animate({
            opacity: "0"
        }, 1000);*/

        $("#UR").stop(false, true).fadeTo(100, 0);
        $("#UL").stop(false, true).fadeTo(250, 0);
        $("#LL").stop(false, true).fadeTo(350, 0);

        if (window.innerWidth <= 500) {
            $("#LR").stop(true, true).animate({
                left: "20px"
            }, 500, 'easeOutCubic');
        }
        else if (window.innerWidth >= 501 && window.innerWidth < 701) {
            $("#LR").stop(true, true).animate({
                rotate: '0',
                left: "27px"
            }, 500, 'easeOutCubic');
        }
        else if (window.innerWidth >= 701 && window.innerWidth < 916) {
            $("#LR").stop(true, true).animate({
                rotate: '0',
                left: "90px"
            }, 500, 'easeOutCubic');
        }
        else if ((window.innerWidth >= 916) && (window.innerWidth < 1296)) {
            $("#LR").stop(true, true).animate({
                rotate: '0',
                left: "0px"
            }, 500, 'easeOutCubic');
        }
        else {
            $("#LR").stop(true, true).animate({
                left: "-95px"
            }, 500, 'easeOutCubic');
        }

        //$("#divImgNumber3").stop(true, true).fadeTo(350, 1);
        //$("#divImgNumber3").css({
        //    opacity: '1.0'
        //});

        if (!bExtensionsCheck) {
            if (extensionTimer != "") {
                var elapsedTime = new Date() - extensionTimer;
                extensionTimer = "";
                if (elapsedTime > 300) {
                    $("#imgNumber3").attr("src", "../img/FRE_RS1_check.png");
                    bExtensionsCheck = true;
                }
            }
        }
        bExtensionAnimatedOpen = false;

        /* Link click after collapse issue v-abselv*/
        $("#extension").css({
            "pointer-events": "none",
            cursor: "default"
        });
        /* Link click after collapse issue v-abselv*/

        // WEDCS Extension Collapse
        if (bwedcsExtnleave) {
            if (typeof (MscomCustomEvent) == "function") {
                MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'ExtensionCollapse');
            }
            sendJSLLPing(typeof (awa) == "undefined" ? null : typeof (awa) == "undefined" ? null : awa.behavior.REDUCE, "PL", "ExtensionCollapse");
            bwedcsExtnleave = false;
            bwedcsExtnenter = true;
        }
    }

    // Static Image Position with 0 degree for all 3 section
    function staticImgPosition() {
        if (bFavoritesAnimatedOpen) {
            $('#imgFavorites').stop(true, true).animate({ rotate: '0deg' }, 10);
        }
        if (bSecureAnimatedOpen) {
            $('#imgSurfSafely').stop(true, true).animate({ rotate: '0deg' }, 10);
        }
        if (bExtensionAnimatedOpen) {
            $('#LR').stop(true, true).animate({ rotate: '0deg' }, 10);
        }
    }

    $(document).on("click", function (e) {
        document.body.addEventListener('click', boxCloser, true);
    });

    $('.btn').on('click', function () {
        $(this).addClass("showBox");
    });

    function boxCloser(e) {
        if (e.target.hasClass != 'showBox') {
            document.body.removeEventListener('click', boxCloser, false);
            $('.btn').removeClass("showBox");
        }
    };

    $("#fav").click(function (e) {
        e.preventDefault();
        var browserVersion = navigator.userAgent.substr(navigator.userAgent.length - 5, 5);

        if (browserVersion >= 10558) {
            window.external.OpenFavoritesSettings();
        }
        else {
            window.open('https://go.microsoft.com/fwlink/p/?LinkId=691010', '_blank');
        }

        favoritesCollapse();
        $("#imgNumber1").attr("src", "../img/FRE_RS1_check.png");
        bFavoritesCheck = true;

        $("#imgOpenFav").stop(false, true).animate({ scale: '0.9' }, 300, 'easeOutCubic');

        setTimeout(function () {
            $("#imgOpenFav").stop(false, true).animate({ opacity: '0' }, 200, 'easeOutCubic');
            $("#imgFavorites").stop(false, true).animate({ opacity: '1' }, 10);
            //$("#imgFavorites").css({ opacity: '1' },10);
            $("#imgFavorites").stop(false, true).stop(false, true).animate({ scale: '1.0' }, 200);
            $("#imgOpenFav").stop(false, true).animate({ scale: '1.0' }, 10);

        }, 150);

        if (window.innerWidth <= 500) {
            $('#imgFavorites').width(115);
        }
        else if (window.innerWidth >= 501 && window.innerWidth < 701) {
            $('#imgFavorites').width(135);
        }
        else if (window.innerWidth >= 701 && window.innerWidth < 916) {
            $('#imgFavorites').width(175);
        }
        else if ((window.innerWidth >= 916) && (window.innerWidth < 1296)) {
            $('#imgFavorites').width(205);
        }
        else {
            $('#imgFavorites').width(205); // Units are assumed to be pixels
        }

        // Hide Favorites content section
        /*
        $("#favorites-box").css({
            transform: 'scale(1.0)',
            opacity: '0',
            display: 'none'
        });*/

        // Hide favorites box
        $("#favorites-box").stop(true, true).fadeTo(100, 0);
        $("#divImgNumber1").stop(true, true).fadeTo(350, 1);

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center();

    });

    //Sends JSLL Pings
    function sendJSLLPing(behaviorName, actionTypeValue, contentNameValue) {

        if ("undefined" != typeof awa) {
            //awa.init(jsllConfig);
            var overrideValues = {
                behavior: behaviorName,
                actionType: actionTypeValue,
                content: { contentName: contentNameValue },
            };
            awa.ct.captureContentPageAction(overrideValues);
        }
    }

});