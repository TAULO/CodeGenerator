/*!
 * MediaValet v0.0.1
 * Copyright 2015-2016 MediaValet. 
 */
//check mvCore dependencies
+function ($, mvCore) {
    'use strict';
    if (typeof mvCore === "undefined") {
        throw new Error("MediaValetSdk Error: Media Valet Sdk Core is not loaded. First load Media Valet Core then load SDK.");
    }
}(jQuery, mvCore);

+function ($, source, mvCore) {
    'use strict';
    var containersId = '';
    var pageName = '';

    //paging variables
    var recentlyviewedoffset = 0;
    var recentlyviewedcount = 10;
    var mostviewedoffset = 0;
    var mostviewedcount = 10;

    var searchingimagecount = 0;
    var searchingimageoffset = 0;
    //will use later i have to think how to use
    var mostviewedassetsglobal = new Object();
    var recentlyviewedassetsglobal = new Object();

    //// counter helping us to create new image and event to perform futher task
    var imagecounter = 0;

    /// var defaultOptions = {
    /// ApiUrl: "https://api-test.mediavalet.net/"

    ///}
    //create all basic Template model
    var TemplateModel = {
        Loader: function (activity) {
            var loader = "<div id='mv-loader'><span></span><h1>Loading.....</h1></div>";
            if (activity === true)
                $('body').append(loader).show();
            else
                $('#mv-loader').remove();
        },
        Message: function (msg) {
            var message = '<div id="mv-message" style="background-color: rgba(255, 0, 0, 0.18); color:#000; width:300">' + msg + '</div>';
            $('body').append(message).show();
            setTimeout(function () {
                $('#mv-message').fadeOut().delay();
                setTimeout(function () { $('#mv-message').remove(); }, 1000);
            },
                4000);
        },
        LoginTemplate: function (options) {
            // debugger;
            var defaults = {
                customText: 'Welcome'
            }
            defaults = options;
            return '<div id="" ><div class="padding" style="background-color:skyblue;height:70px;top:0;position:absolute;width:100%"><h1 style="color:#fff;font-family:Time New Roman;">' + defaults.customText + '</h1>' +
             '</div></div>     <div id="content-main" style="margin-top:70px"><div class="padding">' +
             '<table class="table table-reponsive"  style="font-size:15px">' + '<tr><td>User Domain</td><td><input type="text" id="urltxt" placeholder="Enter URL" style="min-width:100px" value="https://api-test.mediavalet.net" /></td></tr>' +
             ' <tr><td>User Name</td><td><input id="usernametxt" value="philippeadmin@mediavalet.net" style="min-width:100px" />' +
             '</td></tr> <tr><td>Password</td><td><input type="password" id="passwordtxt" value="1234test!" style="min-width:100px" /></td></tr>' + '<tr><td><input type="button" value="Login" id="mv-login"  /><td></td></tr>' + ' </table> <p id="errormessage"></p>  </div> <div>';
        },

        SeachingTemplate: '<div class="medialibraryMain"><div class="searchBox"> <input type="search"  placeholder="Search.." id="searchtxt" /><button class="search" id="searchbtn"><img src="images/search-icon.png"></button>' +
            '<button class="dots" id="menubtn" href="#modal"><img src="images/dots.png"></button>' +
            '<button class="settings" id="searchsettingsbtn"><img src="images/setting.png"></button> ' +
            '<button class="edit"><img src="images/edit.png"></button>' +
            '<div class="menu1"><ol><li>Sort by Name</li><li>Sort by Date</li><li>About</li><li>Logout</li></ol></div>' +
            '<div class="menu2"><ol><li>Default</li><li>Small</li><li>Medium</li><li>Large</li></ol></div>' +
            '<div class="menu3"><ol><li>3.Menu1</li><li>3.Menu2</li><li>3.Menu3</li><li>3.Menu4</li></ol></div>' +
            '</div>' +
            '<div class="clear"></div><div class="medialibrary"><div class="clear"></div>' +
            '<p id="mediavaletlibraryparaid"></p><div class="contentBox" id="bindsearchdatadiv" ></div>' + '</div></div>',


        DefaultSearchTemplate: '<section class="ac-container"><div><input id="ac-1" name="accordion-1" checked type="checkbox"><label for="ac-1">Recently Uploaded</label><article class="ac-small"><div class="imageBox" id="recentlyuploaeddiv"></div></article></div><div><input id="ac-2" name="accordion-1" checked  type="checkbox"><label for="ac-2">Most Viewed</label><article class="ac-small"><div class="imageBox1" id="mostviweddiv"></div></article></div></section>'
    };
    /*
     create basic model with all functions
    */
    var Model = (function () {
        return {
            ShowLoader: function () {
                TemplateModel.Loader(true);
            },
            HideLoader: function () {
                TemplateModel.Loader(false);
            },
            LoginPanel: function (options) {
                return TemplateModel.LoginTemplate(options);
            },
            SearchPanel: function () {
                if (pageName === "Search")
                    return TemplateModel.SeachingTemplate;
            },
            DefaultSearchPanel: function () {
                if (pageName === "Search")
                    return TemplateModel.DefaultSearchTemplate;
            },
            Message: function (message) {
                return TemplateModel.Message(message);
            }
        };
    })();

    /**
    * Code to show popup menus on Settings and Menu button click and Large View
    */
    var ButtonClickPopup = (function () {
        return {
            ButtonPopup: function () {
                return;
                var imgs = $('.box img'),
                    contBox = $('.imageBox'),
                    popup = $('#popup');
                imgs.each(function () {
                    $(this).on('click', function (evt) {
                        var $th = $(this),
                            x = $th.position().left,
                            y = $th.position().top,
                            h = this.height,
                            winW = $(window).width(),
                            winH = $(window).height(),
                            src = $th.attr('src'),
                            a = 0,
                            last = imgs.last(),
                            shiftingDown = (winW / winH) * popup.height() - 12 * h,
                            lastY = last.position().top;
                        popup.detach();
                        imgs.each(function (index) {
                            var thY = $(this).position().top;
                            if (thY > y) {
                                if (a == 0) {
                                    var nextRowFirstItem = $(this).parent();
                                    popup.detach();
                                    popup.children('img').attr('src', src);
                                    popup.css({ 'display': 'block' }).animate({ 'margin-top': 0 });
                                    popup.insertBefore(nextRowFirstItem);
                                    $(this).parent().stop().animate({ 'margin-top': shiftingDown }).slideDown("slow");
                                    a = 1;
                                }
                            } else if (thY == lastY) {
                                popup.detach();
                                popup.children('img').attr('src', src);
                                popup.css({ 'display': 'block', 'margin-top': '10px' }).animate({ 'margin-top': 0 });
                                contBox.append(popup);
                            } else {
                                imgs.each(function (index) {
                                    $(this).parent().stop().animate({ 'margin-top': 0 });
                                });
                            }
                        });
                    });
                });
                popup.children('#close').on('click', function (e) {
                    e.preventDefault();
                    popup.hide();
                    imgs.each(function () {
                        $(this).parent().animate({ 'margin-top': "0" });
                    });
                });
                $('.dots').click(function () {
                    $(this).data('clicked', true);
                    $('.menu1').slideToggle('fast');

                    if ($('.settings').data('clicked')) {
                        $('.menu2').hide();
                    }
                });

                $('.settings').click(function () {
                    $(this).data('clicked', true);
                    $('.menu2').slideToggle('fast');

                    if ($('.dots').data('clicked')) {
                        $('.menu1').hide();
                    }
                });

            }
        }
    }
    )();


    var SearchingScreen = (function () {
        return {
            ImageLoading: function (asset, offset) {
                var databind = '';
                var inc = offset;
                var payload = asset.assets.payload;
                /** 
                 if offset is 0 means image div loading,
                 first time so it should b empty befoe going to
                 load alll images into it
                */
                if (offset === 0) {
                    $('#bindsearchdatadiv').html('');
                }
                /**
                 * Now Here we are
                 * going to bind all
                 * image fetches from API
                 */
                var assets = payload.assets;
                $(assets).each(function (index, alllinks) {
                    $(alllinks).each(function (k, medialinks) {
                        $(medialinks.media).each(function (index, links) {
                            inc++;
                            var large = 'noimage', small = 'noimage', original = 'noimage', thumbs = 'noimage', medium = 'noimage';
                            if (links.large !== 'undefined') {
                                large = mvCore.CheckExtension(links.large.trim());
                            }
                            if (links.small !== 'undefined') {
                                small = mvCore.CheckExtension(links.small.trim());
                            }
                            if (links.original !== 'undefined') {
                                original = mvCore.CheckExtension(links.original.trim());
                            }
                            if (links.thumb !== 'undefined') {
                                thumbs = mvCore.CheckExtension(links.thumb.trim());
                            }
                            if (links.medium !== 'undefined') {
                                medium = mvCore.CheckExtension(links.medium.trim());
                            }
                            var imagesmallhidden = 'imagesmallhidden' + inc;
                            var imagelargehidden = 'imagelargehidden' + inc;
                            var imagemediumhidden = 'imagemediumhidden' + inc;
                            var imageoriginalhidden = 'imageoriginalhidden' + inc;
                            var imagethumbhidden = 'imagethumbhidden' + inc;
                            var recentlyviewedimagedivid = 'mostviewedimagedivid' + inc;
                            var recentlyviewedimgid = 'mostviewedimgid' + inc;
                            databind = databind + '<div class="box" id="' + recentlyviewedimagedivid + '"><img id="' + recentlyviewedimgid + '" src="' + links.thumb + '"></div>';
                            var imgid = '#images' + inc;
                        });
                    });
                });
                if (inc === 0 && offset === 0) {
                    $('#bindsearchdatadiv').html('');
                    $('#bindsearchdatadiv').html('<h3 style="color:red;font-family:Times New Roman;">Your search did not match any documents.</h3>');
                } else {
                    $('#bindsearchdatadiv').append(databind);
                }
            }
        }
    })();
    var DefaultScreenLoading = (function () {
        return {
            ImageLoading: function (mostviewed, recentlyviewed) {
                var databind = '';
                var inc = 0;
                var payload = mostviewed.assets.payload;
                var assets = payload.assets;
                $(assets).each(function (index, alllinks) {
                    $(alllinks).each(function (k, medialinks) {
                        //console.log(medialinks)
                        $(medialinks.media).each(function (index, links) {
                            inc++;
                            // counter helping us to create new image and event to perform futher task
                            imagecounter++;
                            var large = 'noimage', small = 'noimage', original = 'noimage', thumbs = 'noimage', medium = 'noimage';
                            if (links.large !== 'undefined') {
                                large = mvCore.CheckExtension(links.large.trim());
                            }
                            if (links.small !== 'undefined') {
                                small = mvCore.CheckExtension(links.small.trim());
                            }
                            if (links.original !== 'undefined') {
                                original = mvCore.CheckExtension(links.original.trim());
                            }
                            if (links.thumb !== 'undefined') {
                                thumbs = mvCore.CheckExtension(links.thumb.trim());
                            }
                            if (links.medium !== 'undefined') {
                                medium = mvCore.CheckExtension(links.medium.trim());
                            }
                            var imagesmallhidden = 'imagesmallhidden' + imagecounter;
                            var imagelargehidden = 'imagelargehidden' + imagecounter;
                            var imagemediumhidden = 'imagemediumhidden' + imagecounter;
                            var imageoriginalhidden = 'imageoriginalhidden' + imagecounter;
                            var imagethumbhidden = 'imagethumbhidden' + imagecounter;
                            var mostviewedimagedivid = 'mostviewedimagedivid' + imagecounter;
                            var mostviewedimgid = 'mostviewedimgid' + imagecounter;
                            databind += '<div class="box" id="' + mostviewedimagedivid + '"><img id="' + mostviewedimgid + '" src="' + links.thumb + '"></div>';
                            var imgid = '#images' + imagecounter;
                        });
                    });

                });
                databind += '<div class="clearfix"></div><button id="recentlyviewedmorebtn" class="dsMoreButton" >More</button>';
                if (inc === 0) {
                    $('#mostviweddiv').html('');
                    $('#mostviweddiv').html('<h3 style="color:red;font-family:Times New Roman;">Your search did not match any documents.</h3>');
                } else {
                    $('#mostviweddiv').html('');
                    $('#mostviweddiv').html(databind);
                }
                // Recently Viewe Uploading
                databind = '';
                inc = 0;
                payload = recentlyviewed.assets.payload;
                assets = payload.assets;
                $(assets).each(function (index, alllinks) {
                    $(alllinks).each(function (k, medialinks) {
                        //console.log(medialinks)
                        $(medialinks.media).each(function (index, links) {
                            inc++;
                            // counter helping us to create new image and event to perform futher task
                            imagecounter++;
                            var large = 'noimage', small = 'noimage', original = 'noimage', thumbs = 'noimage', medium = 'noimage';
                            if (links.large !== 'undefined') {
                                large = mvCore.CheckExtension(links.large.trim());
                            }
                            if (links.small !== 'undefined') {
                                small = mvCore.CheckExtension(links.small.trim());
                            }
                            if (links.original !== 'undefined') {
                                original = mvCore.CheckExtension(links.original.trim());
                            }
                            if (links.thumb !== 'undefined') {
                                thumbs = mvCore.CheckExtension(links.thumb.trim());
                            }
                            if (links.medium !== 'undefined') {
                                medium = mvCore.CheckExtension(links.medium.trim());
                            }
                            var imagesmallhidden = 'imagesmallhidden' + imagecounter;
                            var imagelargehidden = 'imagelargehidden' + imagecounter;
                            var imagemediumhidden = 'imagemediumhidden' + imagecounter;
                            var imageoriginalhidden = 'imageoriginalhidden' + imagecounter;
                            var imagethumbhidden = 'imagethumbhidden' + imagecounter;
                            var recentlyviewedimagedivid = 'mostviewedimagedivid' + imagecounter;
                            var recentlyviewedimgid = 'mostviewedimgid' + imagecounter;
                            databind = databind + '<div class="box" id="' + recentlyviewedimagedivid + '"><img id="' + recentlyviewedimgid + '" src="' + links.thumb + '"></div>';
                            var imgid = '#images' + imagecounter;
                        });

                    });

                });
                databind += '<div class="clearfix"></div><button id="mostviewedmorebtn" class="dsMoreButton" >More</button>';
                if (inc === 0) {
                    $('#recentlyuploaeddiv').html('');
                    $('#recentlyuploaeddiv').html('<h3 style="color:red;font-family:Times New Roman;">Your search did not match any documents.</h3>');
                } else {
                    $('#recentlyuploaeddiv').html('');
                    $('#recentlyuploaeddiv').html(databind);
                    $('#recentlyuploaeddiv').append('<div id="popup"><img src=""> <a id="close" href=""><img src="images/close.png"></a>' +
                        '<div class="description"><h5>Title</h5><h5>Description</h5><h5>Categories</h5><h5>Ratings</h5></div>'
                        + '</div>');
                }
            }
        }
    })();

    /* *
     * These are event for login click 
     */
    var Events = (function () {
        return {
            Login: function (username, password, containerid, urlApi) {
                //check if all field have values 
                var message = '';
                if (mvCore.Validation('password', password.trim()) === '' && mvCore.Validation('email', username.trim()) === '' && mvCore.Validation('url', urlApi.trim()) === '') {

                    var data = mvCore.authentication(username.trim(), password.trim(), urlApi);
                    if (data.Token != null) {
                        message = "Success";
                        mvCore.SetCookies('cookiestkn', 'Bearer ' + data.Token, 300);
                        mvCore.SetCookies('cookiesreftkn', data.RefreshToken, 300);
                        mvCore.SetCookies('cookiesrextkn', data.ExpiryToken, 300);
                        mvCore.SetCookies('cookiesrcreatedtkndate', data.loginDate, 300);
                        mvCore.SetCookies('settingofapp', 'medium', 300);
                        mvCore.SetCookies('filtersofapp', '', 300);

                    }
                } else {
                    message = "Check your Login Details";
                }
                return message;
            },
            Searching: function (searchingtext) {
                //Put here Some Loader 
                // Model.ShowLoader();
                /**
                 * Coding and logic will be here 
                 */
                searchingimagecount = mvCore.NumberOfImageForInfiniteScroll('#bindsearchdatadiv');
                searchingimageoffset = searchingimagecount;
                var token = mvCore.GetCookies('cookiestkn');
                var urlapi = mvCore.GetCookies('urlapi');
                var assets = mvCore.SearchingAssets(urlapi, searchingtext, token, 'setting', 'filters', searchingimagecount, 0);
                SearchingScreen.ImageLoading(assets, 0);
                //Media Valtet Link Liabrary code start 
                $('#mediavaletlibraryparaid').html('<button id="mediavaletlibraryid" style="background: none !important; font: inherit; margin: 10px; padding: 0px !important; border: currentColor; border-image: none; color: rgb(39, 38, 17); cursor: pointer; font-size-adjust: inherit; font-stretch: inherit;">Media Liabrary</button><label>> Searched Images</label>');
                //even bind for Media Liarary link to get back to home page
                $(containersId).bind().on("click", "#mediavaletlibraryid", function () {
                    $('#bindsearchdatadiv').html(Model.DefaultSearchPanel());
                    $('#mediavaletlibraryparaid').html('');
                    var token = mvCore.GetCookies('cookiestkn');
                    var url = mvCore.GetCookies('urlapi');
                    var viewportinformation = mvCore.NumberOfImagesToLoad('#bindsearchdatadiv');
                    if (Number(viewportinformation) != NaN && Number(viewportinformation) != 0) {
                        var recentlyviwed = mvCore.RecentlyUploadedAsset(url, 'medium', 'filter', token, 0, viewportinformation * 2);
                        var mostviwed = mvCore.MostViwedAsset(url, 'medium', 'filter', token, 0, viewportinformation * 2);
                        DefaultScreenLoading.ImageLoading(mostviwed, recentlyviwed);
                    } else {
                        $('#bindsearchdatadiv').html('Due To Some Error Image Cann"t Be Loaded ');
                    }
                });
                //Media Valet Link Liabrary should end here


                //Binding Evento for Scrolling 
                $('#bindsearchdatadiv').on('scroll', function () {
                    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                        searchingimagecount = 10;
                        var _assets = mvCore.SearchingAssets(urlapi, searchingtext, token, 'setting', 'filters', searchingimagecount, searchingimageoffset);
                        SearchingScreen.ImageLoading(_assets, searchingimageoffset);
                        searchingimageoffset = searchingimageoffset + searchingimagecount;
                    }
                });

                //Hide here Loader
                // Model.HideLoader();
                //  UserSearchImages.Binding(assets,0);
            }
        };
    })();
    var Logout = (function () {
        return {
            SigningOff: function () {
                // SetCookies.CookiesStores('cookiestkn', '', 0);
            }
        }
    })();
    /*
    *Function LoginUI
    * These Code are for making plugin accesable and reusable
    * @param {continaerId} cid  to bind Container Id to perform some task on div if requires 
      @param {customertext} custom text for changing the heading of the welcome page 
    * @returns {JsonObject.assets will be returned with token value , refreshtoken   Cokkies created date setting ,defaultfilters and expirydate of cookies
       and it will reutrn error message or exception if login failed and exception also 
    } 
    */
    $.fn.LoginUI = function (options) {
        var Message = new Object();
        var settings = {};
        var defaults = {
            customText: 'Welcome',
            redirect: '',
            view: {
                recentview: true,
                mostvisited: false
            }
        }

        settings = $.extend({}, defaults, options);
        this.html(Model.LoginPanel(settings));

        $(this.selector).bind().on("click", "#mv-login", function () {
            Message.text = Events.Login($('#usernametxt').val(), $('#passwordtxt').val(), this.selector, $('#urltxt').val().trim());
            window.location.href = "index2.html";
        });
        return Message;
    }
    /**
     * Function Default UI 
     * @param {} cookiestoken will have token 
     * @param {} refreshcookiestoken will have refresh token value
     * @param {} tokenepxirydate  will have the expiry of token
     * @param {} url will have urlapi for mapping and all
     * @param {} containerid will have div to bind search UI 
     * @returns {} 
     */
    $.fn.DefaultUI = function (options) {
        var settings = {
        };
        var defaultsetting = {
            token: '',
            refreshtoken: '',
            expirytoken: '',
            redirect: '',
            view: {
                recentview: true,
                mostvisited: false
            }
        }
        settings = $.extend({}, defaultsetting, options);


        // Model.SearchPanel();
        //this.html(Model.LoginPanel(customText));
    }
    $.fn.mediaValet = function (options) {
        try {
            ///defaultOptions = $.extend({
            //}, defaultOptions, options || {
            //});

            var container = this;
            containersId = container.selector;
            //var containerwidth = $(window).width();
            //var imagecount = containerwidth / 200;
            var cookiesvalue = mvCore.GetCookies('cookiestkn');
            if (cookiesvalue == null) {
                if (container.selector !== 'undefined' && container.selector != null) {
                    pageName = "Login";
                }
                Model.ShowLoader();
                setTimeout(function () {
                    $(containersId).html(Model.LoginPanel());
                    Model.HideLoader();
                }, 1000);
                $(containersId).bind().on("click", "#mv-login", function () { Events.Login($('#usernametxt').val(), $('#passwordtxt').val(), containersId, $('#urltxt').val().trim()); });
                //  $('#bindsearchdatadiv').bind().on("scroll", function () { alert('scroll'); });

            }
            else {
                pageName = "Search";
                $(containersId).html(Model.SearchPanel());
                $('#bindsearchdatadiv').html(Model.DefaultSearchPanel());
                $(containersId).html(Model.SearchPanel());
                $('#bindsearchdatadiv').html(Model.DefaultSearchPanel());
                $(containersId).bind().on("click", "#searchbtn", function () { Events.Searching($('#searchtxt').val(), containersId); });
                var token = mvCore.GetCookies('cookiestkn');
                var url = mvCore.GetCookies('urlapi');

                // Get Container Size
                $('#bindsearchdatadiv').css('max-height', $(document).height() - 20 + 'px');
                //number of Images for sending count in API
                var numberofimagecount = mvCore.NumberOfImagesToLoad('#bindsearchdatadiv');
                if (Number(numberofimagecount) != NaN && Number(numberofimagecount) != 0) {
                    // fecthing image for recently viewed 
                    var recentlyviwed = mvCore.RecentlyUploadedAsset(url, 'medium', 'filter', token, 0, numberofimagecount);
                    // fetching imagbe for Most Viewed Images
                    var mostviwed = mvCore.MostViwedAsset(url, 'medium', 'filter', token, 0, numberofimagecount);
                    // Image loading in Default Screen
                    DefaultScreenLoading.ImageLoading(mostviwed, recentlyviwed);
                }
                //Binding Even on Recently More btn  
                $(containersId).bind().on("click", "#recentlyviewedmorebtn", function () {
                    $('#mediavaletlibraryparaid').html('<button id="mediavaletlibraryid" style="background: none !important; font: inherit; margin: 10px; padding: 0px !important; border: currentColor; border-image: none; color: rgb(39, 38, 17); cursor: pointer; font-size-adjust: inherit; font-stretch: inherit;">Media Liabrary</button><label>> Recently Viewed</label>');

                    //event bind for Media Liarary link to get back to home page
                    $(containersId).bind().on("click", "#mediavaletlibraryid", function () {
                        $('#bindsearchdatadiv').html(Model.DefaultSearchPanel());
                        $('#mediavaletlibraryparaid').html('');
                        var token = mvCore.GetCookies('cookiestkn');
                        var url = mvCore.GetCookies('urlapi');
                        var viewportinformation = mvCore.NumberOfImagesToLoad('#bindsearchdatadiv');
                        if (Number(viewportinformation) != NaN && Number(viewportinformation) != 0) {
                            var recentlyviwed = mvCore.RecentlyUploadedAsset(url, 'medium', 'filter', token, 0, viewportinformation * 2);
                            var mostviwed = mvCore.MostViwedAsset(url, 'medium', 'filter', token, 0, viewportinformation * 2);
                            DefaultScreenLoading.ImageLoading(mostviwed, recentlyviwed);
                        } else {
                            $('#bindsearchdatadiv').html('Due To Some Error Image Cann"t Be Loaded ');
                        }
                    });


                    var count = mvCore.NumberOfImageForInfiniteScroll('#bindsearchdatadiv');
                    recentlyviewedoffset = count;
                    recentlyviewedcount = 0;
                    var _recentlyviwed = mvCore.RecentlyUploadedAsset(url, 'medium', 'filter', token, 0, count);
                    SearchingScreen.ImageLoading(_recentlyviwed, 0);
                    //Binding Evento for Scrolling 
                    $('#bindsearchdatadiv').on('scroll', function () {
                        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                            recentlyviewedcount = 10;
                            var _recentlyviwed = mvCore.RecentlyUploadedAsset(url, 'medium', 'filter', token, recentlyviewedoffset, recentlyviewedcount);
                            SearchingScreen.ImageLoading(_recentlyviwed, recentlyviewedoffset);
                            recentlyviewedoffset = recentlyviewedoffset + recentlyviewedcount;
                        }
                    });


                });

                $(containersId).on("load", ButtonClickPopup.ButtonPopup()); //access images in large view

                //Binding Event on MostViewed More Btn and Scrolling event 
                $(containersId).bind().on("click", "#mostviewedmorebtn", function () {
                    /**
                     * Binding Event and funtion for MostViewed to Main page
                     */
                    $('#mediavaletlibraryparaid').html('<button id="mediavaletlibraryid" style="background: none !important; font: inherit; margin: 10px; padding: 0px !important; border: currentColor; border-image: none; color: rgb(39, 38, 17); cursor: pointer; font-size-adjust: inherit; font-stretch: inherit;">Media Liabrary</button><label>> Most Viewed</label>');

                    //even bind for Media Liarary link to get back to home page
                    $(containersId).bind().on("click", "#mediavaletlibraryid", function () {
                        $('#bindsearchdatadiv').html(Model.DefaultSearchPanel());
                        $('#mediavaletlibraryparaid').html('');
                        var token = mvCore.GetCookies('cookiestkn');
                        var url = mvCore.GetCookies('urlapi');
                        var viewportinformation = mvCore.NumberOfImagesToLoad('#bindsearchdatadiv');
                        if (Number(viewportinformation) != NaN && Number(viewportinformation) != 0) {
                            var recentlyviwed = mvCore.RecentlyUploadedAsset(url, 'medium', 'filter', token, 0, viewportinformation * 2);
                            var mostviwed = mvCore.MostViwedAsset(url, 'medium', 'filter', token, 0, viewportinformation * 2);
                            DefaultScreenLoading.ImageLoading(mostviwed, recentlyviwed);
                        } else {
                            $('#bindsearchdatadiv').html('Due To Some Error Image Cann"t Be Loaded ');
                        }
                    });


                    var count = mvCore.NumberOfImageForInfiniteScroll('#bindsearchdatadiv');
                    mostviewedoffset = count;
                    mostviewedcount = 10;
                    var _mostviwed = mvCore.MostViwedAsset(url, 'medium', 'filter', token, 0, count);
                    SearchingScreen.ImageLoading(_mostviwed, 0);
                    //Binding Evento for Scrolling 
                    $('#bindsearchdatadiv').on('scroll', function () {
                        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                            mostviewedcount = 10;
                            var _mostviwed = mvCore.MostViwedAsset(url, 'medium', 'filter', token, mostviewedoffset, mostviewedcount);
                            SearchingScreen.ImageLoading(_mostviwed, mostviewedoffset);
                            mostviewedoffset = mostviewedoffset + mostviewedcount;
                        }
                    });
                });

            }
        } catch (exception) {

        }
    };
}(jQuery, typeof window !== "undefined" ? window : this, mvCore);