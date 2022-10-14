
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
            return urlparam[1].toLowerCase();
        }
    }
}


$(document).ready(function () {

    // Load 1,2 and 3 number images based on High Contrast mode is enabled / not
    if (window.matchMedia("(-ms-high-contrast: active)").matches) {
        $("#imgNumber1").attr("src", "img/FRE_VD_RS2_v1_icon_1_highcontrast.png");
        $("#imgNumber2").attr("src", "img/FRE_VD_RS2_v1_icon_2_highcontrast.png");
        $("#imgNumber3").attr("src", "img/FRE_VD_RS2_v1_icon_3_highcontrast.png");
    }
    else {
        $("#imgNumber1").attr("src", "img/FRE_RS1_icon_1.png");
        $("#imgNumber2").attr("src", "img/FRE_RS1_icon_2.png");
        $("#imgNumber3").attr("src", "img/FRE_RS1_icon_3.png");
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

    $("#scaleWrap").focus();

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

    $("#scaleWrap").focus();
    
    //media query handling in Jquery
    $(window).resize(function () {
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
        $("#imgNumber2").attr("src", "img/FRE_RS1_check.png");
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
        $("#imgNumber3").attr("src", "img/FRE_RS1_check.png");
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
                MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'DiscoverySectionDisplay');
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
                MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'DiscoverySectionDisplay');
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
            MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'FavoritesExpand');
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
                    $("#imgNumber1").attr("src", "img/FRE_RS1_check.png");
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
            MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'FavoritesCollapse');
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
            MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'SurfSafelyExpand');
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
                    $("#imgNumber2").attr("src", "img/FRE_RS1_check.png");
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
            MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'SurfSafelyCollapse');
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
            MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'ExtensionExpand');
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
                    $("#imgNumber3").attr("src", "img/FRE_RS1_check.png");
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
            MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'ExtensionCollapse');
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
        $("#imgNumber1").attr("src", "img/FRE_RS1_check.png");
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

});