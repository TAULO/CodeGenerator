/// <reference path="jquery-1.12.3.min.js" />

$(document).ready(function () {
    
    //Attach optimizely script only if needed
    $('head').append("<script type='text/javascript' src='https://cdn.optimizely.com/js/3325070522.js'></script>");

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
        $("#imgFavorites").stop(true, true).fadeTo(300, 1);
    }, 100);

    setTimeout(function () {
        $("#imgSurfSafely").stop(true, true).fadeTo(300, 1);
        $("#imgSurfExpand").css({ opacity: '0' });
    }, 300);

    setTimeout(function () {
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

    // Flags for handle, treat mouse enter like click
    var bFavEnter = false;
    var bSafetyEnter = false;
    var bExtEnter = false;

    // Start Bounching Animation     
    setTimeout(function () {
        //bounchingAnimation();
        bIsPageLoaded = true;
        if (!bSecureAnimatedOpen && !bExtensionAnimatedOpen) {
            favoritesExpand();
            $("#favorites-box").stop(true, true).fadeTo(550, 1);
            bFavoritesAnimated = true;
            bFavEnter = true;

            // Surf Safely & Extension buttons cursor changed to default one
            $("#learn").css({
                "pointer-events": "none",
                cursor: "default"
            });
            $("#extension").css({
                "pointer-events": "none",
                cursor: "default"
            });

        }
    }, 2200);

    $("#scaleWrap").focus();

    //media query handling in Jquery
    $(window).resize(function () {

        if (bFavoritesAnimated || bFavoritesAnimatedOpen) {
            favoritesCollapse();
            $("#favorites-box").stop(true, true).fadeTo(100, 0);
            $("#divImgNumber1").stop(true, true).fadeTo(350, 1);
            bFavoritesAnimated = false;
            bFavoritesTappClick = false;
            bFavEnter = false;
            show_Discovery_Center();
        }

        if (window.innerWidth <= 500) {

            //For Sheild image
            $("#imgSurfSafely").width(105);
            $("#imgSurfSafely").height(106);
            $("#imgSurfSafely").css({
                top: "60px"
            });

            if (bSecureAnimated || bSecureAnimatedOpen) {
                $("#imgSurfSafely").css({
                    top: "50px"
                });
            }

            //For Puzzle position
            $("#LR").css({
                left: "20px",
                top: "95px"
            });

            //For Puzzle position if animation open
            if (bExtensionAnimated || bExtensionAnimatedOpen) {
                $("#LR").css({
                    left: "34.5px"
                });
            }

            //For number and check mark images
            $("#imgNumber1 #imgNumber2 #imgNumber3").width(19);
            $("#imgNumber1 #imgNumber2 #imgNumber3").height(19);
        }

        else if (window.innerWidth >= 501 && window.innerWidth < 701) {

            //For Sheild image
            $("#imgSurfSafely").width(125);
            $("#imgSurfSafely").height(126);
            $("#imgSurfSafely").css({
                top: "0px"
            });

            if (bSecureAnimated || bSecureAnimatedOpen) {
                $("#imgSurfSafely").css({
                    top: "-20px"
                });
            }

            //For Puzzle position
            $("#LR").css({
                left: "27px",
                top: "95px"
            });

            //For Puzzle position if animation open
            if (bExtensionAnimated || bExtensionAnimatedOpen) {
                $("#LR").css({
                    left: "54px"
                });
            }

            //For number and check mark images
            $("#imgNumber1 #imgNumber2 #imgNumber3").width(21);
            $("#imgNumber1 #imgNumber2 #imgNumber3").height(21);
        }
        else if ((window.innerWidth >= 701) && (window.innerWidth < 916)) {

            //For Sheild image
            $("#imgSurfSafely").width(145);
            $("#imgSurfSafely").height(140);
            $("#imgSurfSafely").css({
                top: "35px"
            });

            if (bSecureAnimated || bSecureAnimatedOpen) {
                $("#imgSurfSafely").css({
                    top: "3px"
                });
            }
            //For Puzzle position
            $("#LR").css({
                left: "90px",
                top: "16px"
            });

            //For Puzzle position if animation open
            if (bExtensionAnimated || bExtensionAnimatedOpen) {
                $("#LR").css({
                    left: "111px"
                });
            }

            //For number and check mark images
            $("#imgNumber1 #imgNumber2 #imgNumber3").width(21);
            $("#imgNumber1 #imgNumber2 #imgNumber3").height(21);
        }
        else {

            //For Sheild image
            $("#imgSurfSafely").width(177);
            $("#imgSurfSafely").height(184);
            $("#imgSurfSafely").css({
                top: "0px"
            });

            if (bSecureAnimated || bSecureAnimatedOpen) {
                $("#imgSurfSafely").css({
                    top: "-20px"
                });
            }
            //For Puzzle position
            $("#LR").css({
                left: "105px",
                top: "100px"
            });

            //For Puzzle position if animation open
            if (bExtensionAnimated || bExtensionAnimatedOpen) {
                $("#LR").css({
                    left: "130px"
                });
            }

            //For number and check mark images
            $("#imgNumber1 #imgNumber2 #imgNumber3").width(24);
            $("#imgNumber1 #imgNumber2 #imgNumber3").height(24);
        }


        // Instantly yours section; Resize
        if ((window.innerWidth >= 916) && (window.innerWidth < 1001)) {

            commonResizingBlock_gt916_lt1269();
            if (bSecureAnimated || bSecureAnimatedOpen) {
                $("#imgSurfSafely").css({
                    top: "-20px"
                });
            }

            //For Puzzle position
            $("#LR").css({
                left: "90px",
                top: "100px"
            });
            //For Puzzle position if animation open
            if (bExtensionAnimated || bExtensionAnimatedOpen) {
                $("#LR").css({
                    left: "111px"
                });
            }
        }
        else if ((window.innerWidth >= 1001) && (window.innerWidth < 1296)) {
            //Required only for puzzle animation, as we don't have any resizing

            commonResizingBlock_gt916_lt1269();
            if (bSecureAnimated || bSecureAnimatedOpen) {
                $("#imgSurfSafely").css({
                    top: "-20px"
                });
            }

            //For Puzzle position
            $("#LR").css({
                left: "90px",
                top: "100px"
            });
            //For Puzzle position if animation open
            if (bExtensionAnimated || bExtensionAnimatedOpen) {
                $("#LR").css({
                    left: "111px"
                });
            }
        }


    });

    function commonResizingBlock_gt916_lt1269() {
        //For Sheild image
        $("#imgSurfSafely").width(177);
        $("#imgSurfSafely").height(184);
        $("#imgSurfSafely").css({
            top: "0px"
        });

        //For number and check mark images
        $("#imgNumber1 #imgNumber2 #imgNumber3").width(21);
        $("#imgNumber1 #imgNumber2 #imgNumber3").height(21);
    }

    $(document).keydown(function (event) {
        if (event.shiftKey && event.keyCode == 9)
            sKeyPressed = "shifttab";
        else if (event.keyCode == 9)
            sKeyPressed = "tab";
    });

    $(document).mouseup(function (e) {
        var strActiveElement = document.activeElement.id.toString();

        var bFavConClicked = false;
        var bSurfConClicked = false;
        var bExtConClicked = false;

        $("#favorites-box").click(function () {
            bFavConClicked = true;
        });
        $("#divImgSurfSafelyContent").click(function () {
            bSurfConClicked = true;
        });
        $("#divExtensionContent").click(function () {
            bExtConClicked = true;
        });

        setTimeout(function () {

            if (bFavEnter && !bFavoritesTappClick && (strActiveElement == "scaleWrap" || strActiveElement == "") && !bFavConClicked) {
                favoritesCollapse();
                $("#favorites-box").stop(true, true).fadeTo(100, 0);
                $("#divImgNumber1").stop(true, true).fadeTo(350, 1);
                bFavoritesAnimated = false;
                bFavEnter = false;
                show_Discovery_Center();
            }
            if (bSafetyEnter && !bSecureTappClick && (strActiveElement == "scaleWrap" || strActiveElement == "") && !bSurfConClicked) {
                surfSaferCollapse();
                $("#divImgSurfSafelyContent").stop(true, true).fadeTo(100, 0);
                $("#divImgNumber2").stop(true, true).fadeTo(350, 1);
                bSecureAnimated = false;
                bSafetyEnter = false;
                show_Discovery_Center();
            }
            if (bExtEnter && !bExtensionTappClick && (strActiveElement == "scaleWrap" || strActiveElement == "") && !bExtConClicked) {
                extensionCollapse();
                $("#divExtensionContent").stop(true, true).fadeTo(100, 0);
                $("#divImgNumber3").stop(true, true).fadeTo(350, 1);
                bExtensionAnimated = false;
                bExtEnter = false;
                show_Discovery_Center();
            }
        }, 50);

        if ((!bFavEnter && !bSafetyEnter && !bExtEnter) && (document.activeElement.tabIndex) == (-1)) {
            clearCollapse("favorites");
            clearCollapse("surfsafer");
            clearCollapse("extension");
            bFavoritesAnimated = false;
            bSecureAnimated = false;
            bExtensionAnimated = false;
            show_Discovery_Center();
        }

    });

    // Favorites Section Events
    $("#divFavoritesBox").click(function () {
        if (bFavoritesAnimated) {
            //Already animated/Animation is in progress. So need to check click status
            if (bFavoritesTappClick) {
                //Need to collapse the favorites items
                //Change the Tap flag to false- to denote the release of tap
                bFavoritesTappClick = false;
                if (bFavEnter) {
                    bFavEnter = false;
                }
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
    $("#divFavoritesBox").mouseenter(function () {
        if (bIsPageLoaded) {
            //debugger;
            if (!bFavoritesTappClick) {
                bFavoritesFocusStop = true;
                bFavoritesAnimated = true;
                bFavEnter = true;
                bSafetyEnter = false;
                bExtEnter = false;
                setTimeout(function () {
                    if (bFavEnter) {
                        //alert('test');
                        favoritesClick();
                    }
                }, 50);
            }
        }
    });
    $("#divFavoritesSection").mouseleave(function () {
        mouseLeaveHandler();
    });

    function mouseLeaveHandler() {
        if (bFavoritesTappClick || bFavEnter) {
            return;
        }
        else {
            bFavoritesDelay = true;
            favoritesCollapse();
            // Hide favorites box
            $("#favorites-box").stop(true, true).fadeTo(100, 0);
            $("#divImgNumber1").stop(true, true).fadeTo(350, 1);

            // Show / hide Discovery center
            show_Discovery_Center();
            bFavoritesAnimated = false;
        }
    }
    $("#divFavoritesBox").focus(function (e) {
        bFavEnter = true;
        if (bFavoritesAnimated) {
            return;
        }
        else {
            if (sKeyPressed == "tab" || !bFavoritesAnimated) {
                favoritesFocus();
            }
        }
    });
    $("#divFavoritesBox").blur(function () {
        bFavoritesTappClick = false;
        bFavEnter = false;
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

            // Hide favorites box
            $("#favorites-box").stop(true, true).fadeTo(100, 0);
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
                if (bSafetyEnter) {
                    bSafetyEnter = false;
                }
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
                bSafetyEnter = true;
                bFavEnter = false;
                bExtEnter = false;
                setTimeout(function () {
                    if (bSafetyEnter) {
                        surfSaferClick();
                    }
                }, 50);
            }
        }
    });
    $("#divSurfSafelySection").mouseleave(function () {
        if (bSecureTappClick || bSafetyEnter) {
            return;
        }
        else {
            bSecureDelay = true;
            surfSaferCollapse();
            $("#divImgSurfSafelyContent").stop(true, true).fadeTo(100, 0);
            $("#divImgNumber2").stop(true, true).fadeTo(350, 1);

            // Call discovery center function to show / hide discovery msg
            show_Discovery_Center();
            bSecureAnimated = false;
        }
    });
    $("#imgSurfSafely").focus(function () {
        bSafetyEnter = true;
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
        bSafetyEnter = false;
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
                if (bExtEnter) {
                    bExtEnter = false;
                }
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
                bExtEnter = true;
                bFavEnter = false;
                bSafetyEnter = false;
                setTimeout(function () {
                    if (bExtEnter) {
                        extensionClick();
                    }
                }, 50);
            }
        }
    });
    $("#divExtensionSection").mouseleave(function () {
        if (bExtensionTappClick || bExtEnter) {
            return;
        }
        else {
            bExtensionAnimated = false;
            bExtensionDelay = true;

            extensionCollapse();

            // Hide Extension content section 
            $("#divExtensionContent").stop(true, true).fadeTo(100, 0);
            $("#divImgNumber3").stop(true, true).fadeTo(350, 1);

            // Call discovery center function to show / hide discovery msg
            show_Discovery_Center();
            bExtensionAnimated = false;
        }
    });
    $("#LR").focus(function () {
        bExtEnter = true;
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
        bExtEnter = false;
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

        //staticImgPosition();
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
        }, 1);
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

        $("#divDiscoverySection").css({
            display: 'none'
        });
    }

    // Favorites section blur events
    function favoritesBlur() {
        favoritesCollapse();

        // Hide Favorites content section 
        $("#favorites-box").stop(true, true).fadeTo(100, 0);
        $("#divImgNumber1").stop(true, true).fadeTo(350, 1);

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center_Changes();
    }

    // Surf safer section click / mouse enter events
    function surfSaferClick() {
        //staticImgPosition();
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

        }, 1);
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

        $("#divDiscoverySection").css({
            display: 'none'
        });
    }

    // Surf safer section blur events
    function surfSaferBlur() {
        surfSaferCollapse();

        // Show Surf safer content section 
        $("#divImgSurfSafelyContent").stop(true, true).fadeTo(100, 0);
        $("#divImgNumber2").stop(true, true).fadeTo(350, 1);

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center_Changes();
    }

    // Extension section click / mouse enter events
    function extensionClick() {
        //staticImgPosition();
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

        }, 1);
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
            }
            $("#favorites-box").stop(true, true).fadeTo(100, 0);

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
            $("#divImgNumber3").stop(true, true).fadeTo(350, 1);
            bExtensionTappClick = false;
            //}
            bExtensionAnimated = false;
        }
    }

    // Bounching Animation Block
    function bounchingAnimation() {

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
                        $("#divDiscoverySection").css("animation", "mymove 0.6s forwards");
                        $("#divDiscoverySection").stop(true, true).fadeTo(400, 1);
                    }
                }
            }, 700);

            // WEDCS Discovery Section Tracking
            if (!bwedcsDiscovery) {
                if (typeof (MscomCustomEvent) == "function") {
                    MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'DiscoverySectionDisplay');
                    bwedcsDiscovery = true;
                }
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
                        $("#more-tips").attr("role", "button");
                        $("#more-tips").attr("aria-hidden", "false");

                        $("#divDiscoverySection").css("animation", "mymove 0.6s forwards");
                        $("#divDiscoverySection").stop(false, true).fadeTo(400, 1);
                    }
                }
            }, 700);

            // WEDCS Discovery Section Tracking
            if (!bwedcsDiscovery) {
                if (typeof (MscomCustomEvent) == "function") {
                    MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', 'DiscoverySectionDisplay');
                    bwedcsDiscovery = true;
                }
            }
        }
        else {
            $("#divDiscoverySection").attr("aria-hidden", "true");
            $("#more-tips").attr("aria-hidden", "true");
            $("#more-tips").attr("role", "button");

            //$("#divDiscoverySection").stop(true, true).fadeTo(50, 0);
            $("#divDiscoverySection").css({
                display: 'none'
            });
        }

    }

    var setTimeOutFlag;
    var SetOpacity;
    // Favorites section expand
    function favoritesExpand() {
        SetOpacity = false;
        clearTimeout(setTimeOutFlag);
        favoritesTimer = new Date();
        //staticImgPosition();
        bBounchingAnimationStop = true;

        if (window.innerWidth <= 500) {

            $("#imgFavoritesMigration").stop(false, false).css({ animation: 'RotateZoom 0.2s forwards, 3.8s fadeUser 4.1s forwards' });
            $("#favoriteIconMigration").stop(false, false).css({ animation: 'RotateFav_lt500px 0.2s forwards, 0.9s moveStarIcon_lt500px 0.4s forwards, 0.2s moveStarIconReverse_lt500px 1.8s forwards, 0.8s fadeInStarIconReverse_lt500px 2.1s forwards, 0.9s moveStarIconCopy_lt500px 3.3s forwards' });
            $("#passwordIconMigration").stop(false, false).css({ animation: 'rotatePassword_lt500px 0.2s forwards, 0.9s movePassword_lt500px 0.6s forwards, 0.2s movePasswordReverse_lt500px 1.8s forwards, 0.8s fadeInPasswordReverse_lt500px 2.1s forwards, 0.9s movePasswordCopy_lt500px 3.5s forwards' });
            $("#gearIcon").stop(false, false).css({ animation: 'rotateGear_lt500px 0.2s forwards, 0.9s moveGearIcon_lt500px 0.8s forwards, 0.2s moveGearIconReverse_lt500px 1.8s forwards, 0.8s fadeInGearIconReverse_lt500px 2.1s forwards, 0.9s moveGearIconCopy_lt500px 3.7s forwards' });
            $("#EdgeIconMigration").stop(true, false).css({ animation: 'fadeInEdge_lt500px 1s forwards, 0.4s moveEdgeLeft_lt500px 4.6s forwards' });

        }
        else if (window.innerWidth >= 501 && window.innerWidth < 701) {

            $("#imgFavoritesMigration").stop(false, false).css({ animation: 'RotateZoom_501 0.2s forwards, 3.8s fadeUser_501 4.1s forwards' });
            $("#favoriteIconMigration").stop(false, false).css({ animation: 'RotateFav_501 0.2s forwards, 0.9s moveStarIcon_501 0.4s forwards, 0.2s moveStarIconReverse_501 1.8s forwards, 0.8s fadeInStarIconReverse_501 2.1s forwards, 0.9s moveStarIconCopy_501 3.3s forwards' });
            $("#passwordIconMigration").stop(false, false).css({ animation: 'rotatePassword_501 0.2s forwards, 0.9s movePassword_501 0.6s forwards, 0.2s movePasswordReverse_501 1.8s forwards, 0.8s fadeInPasswordReverse_501 2.1s forwards, 0.9s movePasswordCopy_501 3.5s forwards' });
            $("#gearIcon").stop(false, false).css({ animation: 'rotateGear_501 0.2s forwards, 0.9s moveGearIcon_501 0.8s forwards, 0.2s moveGearIconReverse_501 1.8s forwards, 0.8s fadeInGearIconReverse_501 2.1s forwards, 0.9s moveGearIconCopy_501 3.7s forwards' });
            $("#EdgeIconMigration").stop(true, false).css({ animation: 'fadeInEdge_501 1s forwards, 0.4s moveEdgeLeft_501 4.6s forwards' });
        }
        else if (window.innerWidth >= 701 && window.innerWidth < 916) {

            $("#imgFavoritesMigration").stop(false, false).css({ animation: 'RotateZoom 0.2s forwards, 3.8s fadeUser 4.1s forwards' });
            $("#favoriteIconMigration").stop(false, false).css({ animation: 'RotateFav 0.2s forwards, 0.9s moveStarIcon 0.4s forwards, 0.2s moveStarIconReverse 1.8s forwards, 0.8s fadeInStarIconReverse 2.1s forwards, 0.9s moveStarIconCopy 3.3s forwards' });
            $("#passwordIconMigration").stop(false, false).css({ animation: 'rotatePassword 0.2s forwards, 0.9s movePassword_701 0.6s forwards, 0.2s movePasswordReverse_701 1.8s forwards, 0.8s fadeInPasswordReverse_701 2.1s forwards, 0.9s movePasswordCopy_701 3.5s forwards' });
            $("#gearIcon").stop(false, false).css({ animation: 'rotateGear_701 0.2s forwards, 0.9s moveGearIcon_701 0.8s forwards, 0.2s moveGearIconReverse_701 1.8s forwards, 0.8s fadeInGearIconReverse_701 2.1s forwards, 0.9s moveGearIconCopy_701 3.7s forwards' });
            $("#EdgeIconMigration").stop(true, false).css({ animation: 'fadeInEdge_701 1s forwards, 0.4s moveEdgeLeft_701 4.6s forwards' });

        }
        else if (window.innerWidth >= 916 && window.innerWidth < 1001) {

            $("#imgFavoritesMigration").stop(false, false).css({ animation: 'RotateZoom 0.2s forwards, 3.8s fadeUser 4.1s forwards' });
            $("#favoriteIconMigration").stop(false, false).css({ animation: 'RotateFav 0.2s forwards, 0.9s moveStarIcon 0.4s forwards, 0.2s moveStarIconReverse 1.8s forwards, 0.8s fadeInStarIconReverse 2.1s forwards, 0.9s moveStarIconCopy 3.3s forwards' });
            $("#passwordIconMigration").stop(false, false).css({ animation: 'rotatePassword 0.2s forwards, 0.9s movePassword 0.6s forwards, 0.2s movePasswordReverse 1.8s forwards, 0.8s fadeInPasswordReverse 2.1s forwards, 0.9s movePasswordCopy 3.5s forwards' });
            $("#gearIcon").stop(false, false).css({ animation: 'rotateGear 0.2s forwards, 0.9s moveGearIcon 0.8s forwards, 0.2s moveGearIconReverse 1.8s forwards, 0.8s fadeInGearIconReverse 2.1s forwards, 0.9s moveGearIconCopy 3.7s forwards' });
            $("#EdgeIconMigration").stop(true, false).css({ animation: 'fadeInEdge_916 1s forwards, 0.4s moveEdgeLeft 4.6s forwards' });

        }
        else {

            $("#imgFavoritesMigration").stop(false, false).css({ animation: 'RotateZoom 0.2s forwards, 3.8s fadeUser 4.1s forwards' });
            $("#favoriteIconMigration").stop(false, false).css({ animation: 'RotateFav 0.2s forwards, 0.9s moveStarIcon 0.4s forwards, 0.2s moveStarIconReverse 1.8s forwards, 0.8s fadeInStarIconReverse 2.1s forwards, 0.9s moveStarIconCopy 3.3s forwards' });
            $("#passwordIconMigration").stop(false, false).css({ animation: 'rotatePassword 0.2s forwards, 0.9s movePassword 0.6s forwards, 0.2s movePasswordReverse 1.8s forwards, 0.8s fadeInPasswordReverse 2.1s forwards, 0.9s movePasswordCopy 3.5s forwards' });
            $("#gearIcon").stop(false, false).css({ animation: 'rotateGear 0.2s forwards, 0.9s moveGearIcon 0.8s forwards, 0.2s moveGearIconReverse 1.8s forwards, 0.8s fadeInGearIconReverse 2.1s forwards, 0.9s moveGearIconCopy 3.7s forwards' });
            $("#EdgeIconMigration").stop(true, false).css({ animation: 'fadeInEdge 1s forwards, 0.4s moveEdgeLeft 4.6s forwards' });
        }
        setTimeOutFlag = setTimeout(function () {
            SetOpacity = true;
        }, 5100);

        $("#divImgNumber1").stop(false, true).fadeTo(10, 0);

        // Show Favorites content section 
        $("#favorites-box").css({
            transform: 'scale(1.0)',
            display: 'block'
        });

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
                bwedcsFaventer = false;
                bwedcsFavleave = true;
            }
        }
    }

    // Favorites section collapse
    function favoritesCollapse() {
        if (bFavEnter) {
            bFavEnter = false;

        }

        if (window.innerWidth <= 500) {
            if (SetOpacity) {
                $("#EdgeIconMigration").stop(true, true).css({ animation: 'fadeOutEdgewithOpacity_500 0.5s forwards' });

            }
            else {
                $("#EdgeIconMigration").stop(true, true).css({ animation: 'fadeOutEdge_lt500px 0.5s forwards' });
            }
            $("#passwordIconMigration").stop(false, false).css({ animation: 'FadeInGear 1.2s forwards' });
            $("#gearIcon").stop(false, false).css({ animation: 'FadeInGear 1.2s forwards' });
            $("#imgFavoritesMigration").stop(false, false).css({ animation: 'FadeInGear 1.2s forwards' });
            $("#favoriteIconMigration").stop(false, false).css({ animation: 'FadeInGear 1.2s forwards' });
        }
        else if (window.innerWidth >= 501 && window.innerWidth < 701) {
            if (SetOpacity) {
                $("#EdgeIconMigration").stop(true, true).css({ animation: 'fadeOutEdgewithOpacity_501 0.5s forwards' });

            }
            else {
                $("#EdgeIconMigration").stop(true, true).css({ animation: 'fadeOutEdge_501 0.5s forwards' });
            }
            $("#passwordIconMigration").stop(false, false).css({ animation: 'FadeInGear 1.2s forwards' });
            $("#gearIcon").stop(false, false).css({ animation: 'FadeInGear 1.2s forwards' });
            $("#imgFavoritesMigration").stop(false, false).css({ animation: 'FadeInGear 1.2s forwards' });
            $("#favoriteIconMigration").stop(false, false).css({ animation: 'FadeInGear 1.2s forwards' });
        }
        else {
            if (SetOpacity) {
                $("#EdgeIconMigration").stop(true, true).css({ animation: 'fadeOutEdgewithOpacity 0.5s forwards' });

            }
            else {
                $("#EdgeIconMigration").stop(true, true).css({ animation: 'fadeOutEdge 0.5s forwards' });
            }

            $("#passwordIconMigration").stop(false, false).css({ animation: 'FadeInGear 1.2s forwards' });
            $("#gearIcon").stop(false, false).css({ animation: 'FadeInGear 1.2s forwards' });
            $("#imgFavoritesMigration").stop(false, false).css({ animation: 'FadeInGear 1.2s forwards' });
            $("#favoriteIconMigration").stop(false, false).css({ animation: 'FadeInGear 1.2s forwards' });
        }
        clearTimeout(setTimeOutFlag);
        SetOpacity = false;

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
                bwedcsFavleave = false;
                bwedcsFaventer = true;
            }
        }

    }

    // Surf safely section expand
    function surfSaferExpand() {
        secureTimer = new Date();
        //staticImgPosition();
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
                bwedcsSurfenter = false;
                bwedcsSurfleave = true;
            }
        }
    }

    // Surf safely section collapse
    function surfSaferCollapse() {
        if (bSafetyEnter) {
            bSafetyEnter = false;
        }
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
                bwedcsSurfleave = false;
                bwedcsSurfenter = true;
            }
        }
    }

    // Extension section expand
    function extensionExpand() {
        extensionTimer = new Date();
        //staticImgPosition();
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
                left: "111px"
            }, 550, 'easeOutCubic');
        }
        else {

            $("#LR").stop(true, true).animate({
                rotate: '0',
                left: "130px"
            }, 550, 'easeOutCubic');
        }

        $("#UR").stop(true, true).fadeTo(100, 1);
        $("#UL").stop(true, true).fadeTo(450, 1);
        $("#LL").stop(true, true).fadeTo(534, 1);

        $("#divImgNumber3").stop(false, true).fadeTo(100, 0);

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
                bwedcsExtnenter = false;
                bwedcsExtnleave = true;
            }
        }
    }

    // Extension section collapse
    function extensionCollapse() {
        if (bExtEnter) {
            bExtEnter = false;
        }
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
                left: "90px"
            }, 500, 'easeOutCubic');
        }
        else {
            $("#LR").stop(true, true).animate({
                left: "105px"
            }, 500, 'easeOutCubic');
        }

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
                bwedcsExtnleave = false;
                bwedcsExtnenter = true;
            }
        }
    }

    // Static Image Position with 0 degree for all 3 section
    function staticImgPosition() {

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

        // Hide favorites box
        $("#favorites-box").stop(true, true).fadeTo(100, 0);
        $("#divImgNumber1").stop(true, true).fadeTo(350, 1);

        // Call discovery center function to show / hide discovery msg
        show_Discovery_Center();
    });

});
