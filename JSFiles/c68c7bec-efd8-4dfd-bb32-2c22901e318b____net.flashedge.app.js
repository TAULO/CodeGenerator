/**
 * VEGA HTML5 Responsive Template
 *
 * Author: Emanuele "flashedge" Manco
 * Profile: http://themeforest.net/user/flashedge
 * E-mail: hello@flashedge.net
 *
 * Version: 1.1.7
 **/

jQuery(document).ready(function ($) {

    var hash, scroller, clicked, bgTimer, bgDelay, bgN, compactMenu, title, extension;   // gugas, flags and stuff

    var initiated = false;  // global var to find out if it's already initiated

    var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())); // check if it's mobile
    var ipad = (/ipad/i.test(navigator.userAgent.toLowerCase()));   // check if it's on ipad

    var headerHeight = $('#header').height();	// global header height variable
    var headerOffset = 0;                       // the amount the header is augmented

    //if (!$.browser.msie && !mobile && screen.width > 767) {document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);} // this prevents issues with iscroll, not needed for now

    // check if we have css transitions, if not we fallback to animation
    if (!$.support.transition)
        $.fn.transition = $.fn.animate;

    // Fix for IE messing with code without console
    try{
        console
    }catch(e){
        console={}; console.log = function(){};
    }


    // Check out extension of current document, and make it global

    var url = $('#header .logo').children('a').attr('href'); /*window.location.pathname;*/
    var filename = url.substring(url.lastIndexOf('/')+1);

    extension = getExtension(filename);
    //console.log(url+' extension is:'+extension +' made up of ' +extension.length);

    function getExtension(filename) {
        return filename.split('.').pop();
    }


    //////////////////////////////////////////////////////////////////////
    // AJAX SCRIPTS & HASH												//
    //////////////////////////////////////////////////////////////////////

    hash = window.location.hash.substr(1);
    title = document.title;

    if (hash == '') sections(); // if nothing is there, launch the sections!

    var href = $('.nav-bar li a').each(function(index){

        var href = $(this).attr('href');
        var page = location.pathname.substr(location.pathname.lastIndexOf("/")+1,location.pathname.length);
        var p = page.substr(0, page.length-(extension.length+1));
        var toLoad = hash+'.'+extension+' #content .target';

        if(hash==href.substr(0,href.length-(extension.length+1)) ){

            // hash in menu
            hideContent();
            if (hash != '' && hash != p) $('#content .new').load(toLoad, '', showContent);	// called when hash is detected
        } else {
            if (index == $('.nav-bar li').length-1 ) processHash();   // if there is no link in registered in the menu, try to process it anyway
        }
    });

    function processHash() {

        //console.log('processing hash');
        var page = location.pathname.substr(location.pathname.lastIndexOf("/")+1,location.pathname.length);
        var p = page.substr(0, page.length-(extension.length+1));
        var toLoad = hash+'.'+extension+' #content .target';


        hideContent();
        if (hash != '' && hash != "#" && hash != p) $('#content .new').load(toLoad, '', showContent);	// called when hash is detected
    }

    $(window).bind( "hashchange", function(e) {

        //console.log('hash changed!')

        hash = window.location.hash;
        var l = hash+'.'+extension+' #content .target';
        hideContent();

        if (hash != '' && hash != "#") { $('#content .new').load(l.substr(1), '', showContent); } else { window.location.hash = '#index'; }

        //refreshTitle();

        //console.log('loading: '+l + 'hash: '+hash);
    });

    // this snippet hides the background on mobile devices and shows up again when the viewport focuses it.
    if ($(window).width() < 767){

        $(window).scroll( function(e) {
            //console.log('scroll');
            var wH = $(window).height();
            var sH = $(window).scrollTop();
            //console.log(wH+'+'+sH);
            if (sH > wH) {
                $('#bg').css({'display':'none', 'opacity':0});
            } else {
               if ($('#bg').css('opacity') == 0 ) $('#bg').css({'display':'block', 'opacity':0}).transition({'opacity':1});
            }
        });

    }

    function refreshTitle() {
        // takes out the title from hash
        var s;
        hash.indexOf('#') ? s = 0 : s = 1;
        var str = hash.substr(s);

        // converts first letter to uppercase
        str = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });

        var subtitle = $('h1.headline span').text();
        //console.log('subtitle is: '+subtitle);

        if (subtitle=="") subtitle = str;

        if (hash != 'index' && hash != '' && hash !='#index') {
            document.title = title + ' | '+ subtitle;
        } else {
            document.title = title;
        }
    }

    // click function for whole menu and logo in the header
    $('.nav-bar li a:not([target]):not([href^="#"]):not(.selected), .logo a').click(function(e){

        var active = false;

        if (Modernizr.touch && $(this).hasClass('selected') ) {
            active = true;
            e.preventDefault();
            $(this).trigger('mouseenter');

            if ($(this).hasClass('touched')) {
                $(this).removeClass('touched');
               active = false;
            } else {
                $(this).addClass('touched');
            }
        }

        if (active == false) {

            clicked = true;
            initiated = false;

            //adds a 'selected' class to the main menu and removes from the others
            $('.nav-bar li a, .logo a').each(function(){ if ($(this).hasClass('selected')) { $(this).removeClass('selected'); }; if ($(this).hasClass('touched')) { $(this).removeClass('touched'); }})
            if ($(this).hasClass('main')) { $(this).addClass('selected'); } else { $(this).parent().parent().parent().parent().children('.main').addClass('selected'); }


            var toLoad = $(this).attr('href')+' #content .target ';

            var selected = $(this).attr('href');
            var current = window.location.hash.substr(1);

            var page = location.pathname.substr(location.pathname.lastIndexOf("/")+1,location.pathname.length);
            //console.log('LOADING: '+ selected.substr(0,selected.length-(extension.length+1)) +', current location is: '+current );

            if ( $('.nav-bar li a'))

            if (selected.substr(0,selected.length-(extension.length+1)) != current) {	// check if it's already selected first
                if (current == '' && page == selected) { } else { hideContent(); loadContent(); }
            }

            if ($.browser.msie && parseInt($.browser.version, 10) < 8) {
                window.location = '#'+($(this).attr('href').substr(0,$(this).attr('href').length-(extension.length+1))).replace(/^.*[\\\/]/, '');
            } else {
                window.location.hash = $(this).attr('href').substr(0,$(this).attr('href').length-(extension.length+1));
            }


        }

        function loadContent() {

            if (!"onhashchange" in window || $.browser.msie ) {

                if ($.browser.msie ){
                    if (parseInt($.browser.version, 10) < 8 && selected !='#') $('#content .new ').load(toLoad,'',showContent);
                } else{
                    $('#content .new ').load(toLoad,'',showContent);
                }
            }

            // show fake load bar
            var barW = $('#header .bar').parent().width()+'px';
            $('#header .bar').css({'opacity':.5,'width':0}).stop().animate({'width':barW},'500');;
        }

        return false;
    });


    function hideContent() {

        //console.log('hiding content');

        $('#content .old').empty();	// purge old container

        var h = $(window).height() - $('#header').height();
        $('#content .wrapper').children('.old').css({height:h});

        if (window.location.hash.substr(1) != '') {
            $('#content .new').contents().clone().appendTo('#content .old');	// move actual content in old container
            if (mobile && !ipad) $('#content .new').empty();
        } else {
            $('#content .new').contents().clone().appendTo('#content .old');

        }


    }


    function showContent() {
        //console.log('showing content');

        clearContent();
        //if (!mobile && Modernizr.touch) hideNav();

        arrange();

        $('#content').delay(1000, slidePages() );

        // slide old and new wrappers

        function slidePages() {
            //console.log('sliding pages... new margin is: ' +$('#content').children('.new').css('height') + ' old margin is: '+ $('#content').children('.old').css('height') );
            hideNav();

            $('#header .bar').transition({'opacity':'0'}, 'slow'); // fade out fake loadbar, as it's already loaded

            function showBg() {
                $.browser.msie ? $('.bg-gallery').stop().animate({'opacity':1}, 'slow') : $('#bg').css({'opacity':1});	// show background if hidden
            }


            $('#content .wrapper').children('.old').transition({ height: 0},'1000',function() {

                $('#content .wrapper').children('.old').empty().css({height:0});	// get rid of old container

                if (!$('.new .target .portfolio').length && !$('.new .contact').length) showBg();

                sections();

                if ( $(window).width() < 767 && $('#main').attr('data-mobileautofocus') != "false") { $('html,body').animate({scrollTop: $('#content .new').offset().top}, 'slow'); }

            });

        }

    }


    function clearContent() {
        if (scroller != null) { scroller.destroy(); scroller = null; };

        if ($('#content .map').length) $('#content .map').remove(); // get rid of the heavy map at once!
        //if (isotopeEnabled) { $('#content .works').isotope('destroy');}// destroy any pending works holder

        if ($('.old .target .project').length) $('.old .target .project').css({'height':0});
    }


    //////////////////////////////////////////////////////////////////////
    // Initialize iScroll and clear previous instances					//
    //////////////////////////////////////////////////////////////////////

    function doScroll() {
        if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
            $('#shell').css({'overflow':'auto', 'overflow-x':'hidden', 'overflow-y':'auto'});
        } else {
            if ( $(window).width() > 767) {

                if ($('#main').attr('data-globalscroll') != "true"){
                    if (Modernizr.touch) $('#shell').attr('data-iscroll','true'); // this forces iscroll on touch devices


                    if (scroller != null) { scroller.destroy(); scroller = null; };
                    if (!mobile && $('#shell').length && $('#shell').attr('data-iscroll')!='false' ) {

                        scroller = new iScroll('shell', { zoom:false, checkDOMChanges: false, scrollbarClass: 'myScrollbar',
                            onBeforeScrollStart: function (e) {
                                var target = e.target;
                                while (target.nodeType != 1) target = target.parentNode;

                                if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                                    e.preventDefault();
                            }
                        });
                        if (scroller != null && scroller != undefined) scroller.refresh();
                        //console.log('scroller ready!');

                    } else {
                        $('#shell').jScrollPane();
                        //$('#shell #scroller').addClass('scroll-pane');
                        //$('#shell').css({'overflow-x':'hidden', 'overflow-y':'auto'});
                    }
                } else {
                    $('html, body').css({'overflow':'visible'})
                    $('body, #content, #scroller').css({'overflow':'visible'});
                    $('#content .wrapper, #shell').css({'height':'auto'});
                    $('#footer').css({'position':'fixed'});
                    $('#content').css({'border-bottom':'none'})
                }
            }
        }
    }


    //////////////////////////////////////////////////////////////////////
    // LATEST PROJECTS ON HOMEPAGE										//
    //////////////////////////////////////////////////////////////////////

    function latest() {
        $('.latest li a').each( function(){

            var obj = $(this);
            $(obj).hover(function(){
                if ( $(window).width() > 767) {
                    $(obj).children('img').transition({'opacity':0.1},500);
                    $(obj).children('.overlay').transition({'opacity':1},500);
                } else {
                    //$(obj).children('img').transition({'opacity':0.6},500);
                }
            }, function(){
                if ( $(window).width() > 767) {
                    $(obj).children('img').transition({'opacity':1},'fast');
                    $(obj).children('.overlay').transition({'opacity':0},'fast');
                } else {
                    //$(obj).children('img').transition({'opacity':1},'fast');
                }
            });

        });
    }

    //////////////////////////////////////////////////////////////////////
    // TWEETS WIDGET ON HOMEPAGE    									//
    //////////////////////////////////////////////////////////////////////

    function tweets() {
        //console.log("tweets!");
        var user = $('.tweets').attr('data-user');
        var number = $('.tweets').attr('data-number');

        $(".tweets").tweet({
            username: user,
            page: 1,
            count: number,
            loading_text: "Loading tweets..."
        }).bind("loaded", function() {
                $(this).find("a").attr("target","_blank");

                var ul = $(this).find(".tweet_list");

                ul.children('li').each(function() {
                    $(this).children('span').wrapAll('<div/>')
                });

                var ticker = function() {
                    setTimeout(function() {
                        var offset = '-100px';
                        if ( $(window).width() < 767) offset = '-130px';

                        ul.find('li:first').transition( {marginTop: offset}, 500, function() {
                            $(this).detach().appendTo(ul).removeAttr('style');
                        });
                        ticker();
                    }, 5000);
                };
                ticker();
            });
    }


    //////////////////////////////////////////////////////////////////////
    // BLOG MAIN FUNCTION												//
    //////////////////////////////////////////////////////////////////////


    function blog() {

        //console.log("blog!");

        $('#content .blog .thumbnail').each( function(index) {

            var m = $(this);
            var obj = $(this).find('img');

            obj.load( obj.attr('src'), function() {obj.transition({'opacity':1}, 500);  if (scroller != null && scroller != undefined) { scroller.refresh()}; });


            obj.parent().hover(function() {

                $(this).css({'background':'#000'});
                $(this).children('img').stop().transition({'opacity':0.5},500);
                $(this).children('span').addClass('active');

            }, function(){
                $(this).children('img').stop().transition({'opacity':1});
                if ( $(this).children('span').hasClass('active')) $(this).children('span').removeClass('active');
            });

        });

        $('#content .commentForm').click(function(){
            setTimeout(arrange, 20);    // ugly fix for commentform bug
        });

    }


    //////////////////////////////////////////////////////////////////////
    // WORKS MAIN FUNCTION												//
    //////////////////////////////////////////////////////////////////////


    function works() {

        //console.log('launching works!');
        if (scroller == null) { doScroll();}

        //$('.new .target .works').isotope('destroy');

        $('#content .new .target .works .item').each( function(index) {

            var w = $('#content .new .target .works').attr('data-width')+'px';
            var obj = $(this).children('a').children('img');
            var l = $('#content .new .target .works .item').length;

            obj.load( obj.attr('src'), function() {
                //console.log('loaded image number: '+index +'/'+ l);
                obj.parent().parent().transition({'opacity':1}, 500);
                $('#content .new .target .works').isotope('reLayout');
                if (scroller != null && scroller != undefined) scroller.refresh();
            });


            obj.parent().hover(function() {

                $(this).children('img').stop().transition({'opacity':0.5},
                    function() {
                        // if (index == (l-1) ) { $('#content .new .target .works').isotope('reLayout'); scroller.refresh();}
                    });

                if ($.browser.msie) {
                    $(this).children('span').animate({'opacity':1});
                } else {
                    $(this).children('span').addClass('active');
                }

            }, function(){
                $(this).children('img').stop().transition({'opacity':1});

                if ($.browser.msie) {
                    $(this).children('span').animate({'opacity':0});
                } else {
                    if ( $(this).children('span').hasClass('active')) $(this).children('span').removeClass('active');
                }
            });

            if (index == (l-1) ) { iso();}

        });



        function iso() {

            var $container = $('#content .new .target .works');
            var w = Math.floor ( $('#content .new .target .works').attr('data-width'));
            //console.log('launching isotope!');

            // isotope setup
            $container.isotope({
                /*masonry: {
                 columnWidth: w,
                 gutterWidth: 10
                 },*/
                // options
                itemSelector : '.item',
                layoutMode : 'masonry',
                onLayout: function() { }
            }, function() {
                $('.new .target .works').css({'opacity':'1'});
                arrange();

                if (scroller == null) { doScroll();}
            });


            function resetFilters() {
                $('#filters dd').each( function() {
                    if ( $(this).hasClass('active')) $(this).removeClass('active');
                });
            }

            // filter functions
            $('#filters a').click(function(){
                var selector = $(this).attr('data-filter');

                resetFilters();
                $(this).parent().addClass('active');

                $container.isotope({ filter: selector }, doLayout());

                function doLayout() {
                    var i = setInterval(resize, 100);

                    function resize() {
                        arrange();
                        if (scroller != null && scroller != undefined) scroller.refresh();
                        clearInterval(i);
                    }
                }

                return false;
            });

        }


    }

    //////////////////////////////////////////////////////////////////////
    // PROJECT MAIN FUNCTION											//
    //////////////////////////////////////////////////////////////////////


    function project() {
        //console.log('New portfolio!');

        if (!initiated) {

            //console.log('Initializing portfolio stuff....')
            initiated = true;

            $('.portfolio').unbind();

            $('.portfolio').orbit({
                animation: 'horizontal-push',                  // fade, horizontal-slide, vertical-slide, horizontal-push
                animationSpeed: 800,                // how fast animtions are
                timer: false, 			 // true or false to have the timer
                advanceSpeed: 4000, 		 // if timer is enabled, time between transitions
                pauseOnHover: false, 		 // if you hover pauses the slider
                startClockOnMouseOut: false, 	 // if clock should start on MouseOut
                startClockOnMouseOutAfter: 1000, 	 // how long after MouseOut should the timer start again
                directionalNav: true, 		 // manual advancing directional navs
                captions: false, 			 // do you want captions?
                captionAnimation: 'fade', 		 // fade, slideOpen, none
                captionAnimationSpeed: 800, 	 // if so how quickly should they animate in
                bullets: false,			 // true or false to activate the bullet navigation
                bulletThumbs: false,		 // thumbnails for the bullets
                bulletThumbLocation: '',		 // location from this file where thumbs will be
                afterSlideChange: function(){}, 	 // empty function
                fluid: true                         // or set a aspect ratio for content slides (ex: '4x3')
            });

            $.browser.msie ? $('.bg-gallery').stop().animate({'opacity':0}, 'slow') : $('#bg').css({'opacity':0});


            $('.portfolio .orbit-slide').each(function(index) {

                var slide = $(this).children('img');
                //console.log('initiaded slide portfolio: '+slide);

                $("<img />").attr('src', slide.attr('src'))
                    .load(function() {
                        //console.log('slide loaded!');
                        slide.transition({'opacity':1},1000);

                        //console.log(index+'/'+$('.portfolio .orbit-slide').length)

                        if (index == $('.portfolio .orbit-slide').length-1) {
                            setTimeout(function() {initiated = false;}, 2000);  // this avoids request flooding
                            if ( $('.portfolio .play').length) { $($('.portfolio .play')).css({'display':'block'}) }
                        }



                    });
            });

            // new addition, back/close button! :)
            if (history.length && $('.portfolio').attr('data-close') == "true") {
                $('.portfolio .orbit-slide').parent().parent().append('<div class="close">Close</div>');
                $('.close').click(function() { history.go(-1); })
            }

            // another new feature, social heart button!
            if ($('.portfolio').attr('data-heart') == "true") {
                $('.portfolio .orbit-slide').parent().parent().append('<div class="heart">'+$('.portfolio').attr('data-likes')+'</div>');
                $('.heart').click(function() {
                    var count = $('.portfolio').attr('data-likes');
                    count++;
                    $('.heart').html(count);
                })

                if ($('.portfolio').attr('data-addthis') == "true"){
                    /* this was an attempt to integrate addthis, but it looked so damn ugly I skipped it for now. Feel free to use it if you like. */
                    $('.heart').addClass('addthis_button_compact').attr('href','http://www.addthis.com/bookmark.php').attr('target','_blank');
                    addthis.button('.heart');
                }
            }

            projectOver();
            arrange();

        };
    }







    //////////////////////////////////////////////////////////////////////
    // CONTACT FORM FUNCTIONS											//
    //////////////////////////////////////////////////////////////////////

    function form() {


        function hideAlerts() {
            $('#content .contactForm .feedback div').each( function() {
                $(this).hide();   // hide all alerts
            })
        }

        hideAlerts();

        $('#content .contactForm input#submit').click( function(e) {

            //e.preventDefault();

            var name = $('.contactForm #name').val();
            var email = $('.contactForm #email').val();
            var message = $('.contactForm #message').val();

            var path = $('.contactForm form').attr('action');

            if (name == '' || email == '' || message == '' || name== 'Name' || email == 'Email' || message == 'Message' || !validateEmail(email)) {
                hideAlerts();
                $('#content .contactForm .feedback .warning').show();
            } else {

                $.ajax({

                    type: "POST", url: path, data: "name=" + name + "&email=" + email + "&message=" + message, dataType: "html",
                    success: function(msg)
                    { hideAlerts(); $('#content .contactForm .feedback .success').show(); },
                    error: function()
                    { hideAlerts();  $('#content .contactForm .feedback .error').show(); }
                });

            }

            function validateEmail(email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
        })

    }



    //////////////////////////////////////////////////////////////////////
    // GOOGLE MAP FUNCTION												//
    //////////////////////////////////////////////////////////////////////

    function map() {

        //console.log('new map!')

        setTimeout( loadMap, 10);
        //loadMap();

        $.browser.msie ? $('.bg-gallery').stop().animate({'opacity':0}, 'slow') : $('#bg').css({'opacity':0});
    }

    function loadMap() {

        //create placeholder
        //$('#content .new .map').gMap({ address: 'Krak�w, Poland', zoom:12 });
        //

        var a = $('#content .new .contact').attr('data-address');
        var z = Math.floor( $('#content .new .contact').attr('data-zoom') );

        //console.log('map properties are: '+a+z);


        $('#content .new').prepend('<div class="map" id="gMap"></div>');


        setTimeout(createMap, 10);

        function createMap() {
            //if (!$.browser.msie) {
            $('#gMap').gMap({ address: a, zoom:z, mapTypeControl: true, latitude: "fit", longitude: "fit", zoomControl: true, panControl: true, scaleControl:false, streetViewControl:false,
                controlsStyle:[{mapType: google.maps.MapTypeControlStyle.HORIZONTAL_BAR, zoom:google.maps.ZoomControlStyle.SMALL }],
                markers:[{address: a}],
                onComplete: showMap});
        }

    }

    function showMap() {



        //console.log('map loaded');
        if ( $('#content .new .contact').length ) {

            //console.log('showing map');
            arrange();

            function fixMap() { arrange(); /*console.log('map!')*/

                /*if( $('#main').attr('data-globalscroll') =="true") {
                    $('#gMap').css({'position':'relative'});
                }*/
            }
            var mapLoop = setInterval( fixMap, 200);

            setTimeout(function() { clearInterval(mapLoop); deepLinks();  }, 2000);


        }
    }



    //////////////////////////////////////////////////////////////////////
    // NAVIGATION FUNCTIONS AND EFFECTS									//
    //////////////////////////////////////////////////////////////////////

    // header hover effect
    $('.nav-bar').hover(function() {
        $.browser.msie ? $('.gradient').stop().animate({'opacity':1}) : $('.gradient').css({'background-position':'0px 0px'});
        $.browser.msie ? $('.pattern').stop().animate({'opacity':1}, 'fast') : $('.pattern').css({'opacity':1});
    }, function() {
        $.browser.msie ? $('.gradient').stop().animate({'opacity':0.5}) : $('.gradient').css({'background-position':'0px -200px'});
        $.browser.msie ? $('.pattern').stop().animate({'opacity':0.2}, 'fast') : $('.pattern').css({'opacity':0.2});
    });

    $('.nav-bar .main').hover(function() {
        $.browser.msie ? $('.gradient').stop().animate({'opacity':1}) : $('.gradient').css({'background-position':'0px 0px'});
        $.browser.msie ? $('.pattern').stop().animate({'opacity':1}, 'fast') : $('.pattern').css({'opacity':1});
    });




    // navigation functions
    $('.nav-bar>li.has-flyout').unbind(); // get rid of foundation functions

    // get properties of each submenu and store them as data attributes
    $('.nav-bar>li.has-flyout').each(function(e) {

        var h = $(this).children('.flyout').height();
        var p;

        !$.browser.msie? p = $(this).children('.flyout').css('padding') : p = '20px 20px 20px 0';

        $(this).children('.flyout').attr({'data-height':h});
        $(this).children('.flyout').attr({'data-padding':p });

        if (h > headerOffset) { headerOffset = h+20; }

        //console.log(h+ '/'+headerOffset);


    });


    // submenu effects
    $('.nav-bar>li.has-flyout').hover(

        function() {

            if ( $(window).width() < 767) {

                var f = $(this).children('.flyout');
                var fH = f.attr('data-height')+'px';
                var p = f.attr('data-padding');

                f.css({height:fH,'padding':p,'opacity':1});
                f.slideDown(500);

                //f.css({'display':'block', height:0, 'overflow':'hidden', 'padding':0, opacity:1}).transition({height:fH,'padding':p});

            } else {
                if ($(this).children('.flyout').css('display') == 'none') {	// extra check to avoid jumpy effect
                    $(this).children('.flyout').css({'display':'block', 'opacity':0, 'height':$(this).children('.flyout').attr('data-height'), 'padding':$(this).children('.flyout').attr('data-padding')});
                    $(this).children('.flyout').stop().transition({opacity:1}, 500);

                    setTimeout( function() { $(this).children('.flyout').css({'display':'block', 'opacity':1})} , 500);   // sometimes the submenu doesn't show up, this forces it

                    var o;
                    if ($.browser.msie && parseInt($.browser.version, 10) < 9) { o = 20 } else { o = 0; }
                    var h = $(this).children('.flyout').height()+o+20+'px';	// detect height of submenu

                    if ( $('#header').attr('data-fixed') != 'true') {
                    $.browser.msie ? $('#header').stop().animate({'margin-bottom':h},'fast') : $('#header').stop().css({'margin-bottom':h},300);	// and animate it
                    }
                }
            }

            $(this).children('.flyout-toggle').css({'background-position':'0px -13px'});
            $(this).children('.main').css({'border-bottom':'2px solid rgba(255, 255, 255, 1)'});

        }, function () {
            if ( $(window).width() < 767) { // for mobile

                //$(this).children('.flyout').transition({height:0, padding:0}, 500, function() { $(this).children('.flyout').css({'display':'none'}); } )
                $(this).children('.flyout').slideUp(500);


            } else {
                //$(this).children('.flyout').css({'display':'block'});
                $(this).children('.flyout').stop().transition({opacity:0}, 'fast', function() {$(this).css({'display':'none'})} );
                $.browser.msie ? $('#header').stop().animate({'margin-bottom':'0px'}, 'fast') : $('#header').stop().css({'margin-bottom':'0px'},300);

                $(this).css({'height':'auto'});
            }

            $(this).children('.flyout-toggle').css({'background-position':'0px 0px'});
            $(this).children('.main').css({'border-bottom':'2px solid rgba(255, 255, 255, 0.4)'});

        });


    var lockNav = false;
    function hideNav() {
        //console.log('hiding navigation...');
        if ($('.nav-bar').attr('data-autohide') != 'false' ) {

        $.browser.msie ? $('.gradient').stop().animate({'opacity':0.5}) : $('.gradient').css({'background-position':'0px -200px'});
        $.browser.msie ? $('.pattern').stop().animate({'opacity':0.2}, 'fast') : $('.pattern').css({'opacity':0.2});

        $('.nav-bar>li.has-flyout').each( function() {
            $(this).children('.flyout-toggle').css({'background-position':'0px 0px'});
            $(this).children('.main').css({'border-bottom':'2px solid rgba(255, 255, 255, 0.4)'});

            if ( $(window).width() < 767) { // for mobile

                // $(this).children('.flyout').transition({height:0, padding:0}, 500, function() { $(this).children('.flyout').css({'display':'none'}); } );
                $(this).children('.flyout').slideUp(500);
            } else {
                $('#header').stop().css({'margin-bottom':0});
                $(this).children('.flyout').css({'display':'none', 'height':0});
            }

        });

        }
    }

    //////////////////////////////////////////////////////////////////////
    // CUSTOM BACKGROUND SLIDESHOW MADE WITH PURE CSS3					//
    //////////////////////////////////////////////////////////////////////

    //background slideshow script

    function bgSlideshow() {
        var n = 1;
        var d = $('.bg-gallery').attr('data-delay');
        var img;

        $('.bg-gallery li').each( function(index) {

            var path = $(this).attr('data-image');
            var delay = (n*d)*.5+'s';
            var $this = $(this);

            if (index == 0 ) img = path; 	// find first slide

            $('<img/>').attr('src', path).load(function() {

                var p = path;
                //console.log('loaded: '+index+'/'+$('.bg-gallery li').length+': '+p);

                if ($.browser.msie && parseInt($.browser.version, 10) < 9) {	// use ie hack to arrange slides differently

                    $this.children('span').remove();
                    //var path = $(this).attr('data-image');
                    var src = "<img class='bg' src="+p+" />";
                    $this.append(src);
                    $this.children('.bg').css({'min-height':'100%','max-width':'none','position':'fixed','top':0,'left':0,'opacity':0});

                } else {
                    $this.children('span').css({"background-image" : "url("+ p +")"}).addClass('bg');
                }

               if (index == 0) bgTransition();

               if (index == $('.bg-gallery li').length-1 && $('.bg-gallery').children().length > 1) {
                   setInterval(bgTransition, $('.bg-gallery').attr('data-delay')*1000);
               }
            });

        });

    }

    bgN = 1;


    function bgTransition() {

        //if (bgTimer.active) { bgTimer.reset();}

        if ( $('#bg').css('opacity') == 1 && $('#bg').attr('data-enabled') != "false") {	// check if the background is visible

            // fade effect
            /*$('.bg-gallery li').each( function(index) {

                //$(this).children('.bg').css({'opacity':1});

                if (index == bgN) {

                    //$.browser.msie ? $(this).children('.bg').stop().animate({'opacity':1}, 'slow') : $(this).children('.bg').css({'opacity':1});
                } else {

                    //$.browser.msie ? $(this).children('.bg').stop().animate({'opacity':0}, 'slow') : $(this).children('.bg').css({'opacity':0});
                }
            });*/
            $('.bg-gallery li').children('.bg').css({'display':'none'});
            $('.bg-gallery li:last-child').children('.bg').css({'display':'block'});

            $('.bg-gallery li:first-child').children('.bg').css({'opacity':0, 'display':'none'});
            $('.bg-gallery li:first-child').remove().appendTo('.bg-gallery');
            $('.bg-gallery li:last-child').children('.bg').css({'opacity':0, 'display':'block'}).transition({'opacity':1}, ($('.bg-gallery').attr('data-delay')*500, 'out'));

            bgN+1 < $('.bg-gallery > li').size() ? bgN++ : bgN = 0;

        }

    }


    if ( $('.bg-gallery').length ) bgSlideshow();	// launch background slideshow function




    //////////////////////////////////////////////////////////////////////
    // RESIZE FIXES FOR FLUID LAYOUT									//
    //////////////////////////////////////////////////////////////////////

    if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
        $(window).resize(function() { arrange() ; });
    } else {
        // Detect whether device supports orientationchange event, otherwise fall back to
        // the resize event.
        var supportsOrientationChange = "onorientationchange" in window,
            orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

        window.addEventListener(orientationEvent, function() {
            //alert('HOLY ROTATING SCREENS BATMAN:' + window.orientation + " " + screen.width);
            arrange();
        }, false);

    }
    // resize functions
    // $(window).resize(function() { arrange() ; });


    function arrange() {
        //console.log('Arranging layout to:'+$(window).width()+'/'+$(window).height() );

        headerHeight = $('#header').height();

        var hH = headerHeight/*$('#header').height()*/;
        var wH = window.innerHeight ? window.innerHeight : $(window).height();
        var contentH = wH - hH;

        if ( $(window).width() < 767) {
            $('.flyout small').css({'opacity':1});
            $('#content, #content .wrapper, #content .wide').css({'height':'auto'});
            $('#content .target').css({'margin-top':0});
            if ( $('#content .works').length ) $('#content .works').css({'overflow':'visible'});

            if ( $('.portfolio').length )  $('.portfolio').parent().css({'height':'inherit'});
            if ( $('.nav-bar').hasClass('compact')) $('.nav-bar').removeClass('compact');

            if ($('.map').length) {$('.map').css({'height':'310px','position':'absolute'}); $('.subheader').transition({'margin-top':'200px'}); } else { $('.subheader').transition({'margin-top':0}); }

            if( $('.new .fullvideo').length ) { $('.fullvideo').css({height: 'auto', 'line-height':'normal'}); arrangeFullvideo();}

            // reset portfolio slide height fix
            if ( $('.portfolio').length ) {
                $('.portfolio').children('div').each( function() {$(this).css({'line-height':'normal'}); });
                $('.project').css({'height':'auto'});
            }

            $('.target').css({'height':'auto'});
            if ( $('.latest').length ) $('.latest li a .overlay').css({'opacity':1});
            fixPortfolio();

        } else {
            $('.flyout small').css({'opacity':0});
            $('#musicPlayer').css({'height':'6px'});

            if ($('#main').attr('data-globalscroll') == "true"){
                $('#content, #content .wrapper, #content .wide, #shell, #scroller').css({'height':'auto'});
                $('#content .target').css({'margin-top':0});
            } else {
                $('#content .wrapper').css({'height':contentH});
            }

            if ( $('.latest').length ) $('.latest li a .overlay').css({'opacity':0});
            if (compactMenu) $('.nav-bar').addClass('compact');

            if( $('.new .fullvideo').length ) { $('.fullvideo').css({height: wH - headerHeight, 'line-height':wH - headerHeight+'px'}); arrangeFullvideo(); }

            if ( $('.new .portfolio').length )  { $('.portfolio').parent().css({height:wH - headerHeight}); $('.project').css({'height':'140px'});}
            if ($('.new .map').length) {
                if ($('#main').attr('data-globalscroll') == "true"){
                    var mh = wH - headerHeight - $('.wide').height();
                    if (mh < 300) mh = 300;
                    $('.map').css({'position':'relative','height':mh+'px'}); $('.subheader').transition({'margin-top':-mh+'px'});
                    $('.subheader header').css({'padding-top':'20px'});
                } else {
                    $('.map').css({'position':'fixed','height':wH - headerHeight - $('.wide').height()+'px'}); $('.subheader').transition({'margin-top':'20px'});
                }

            }
            if ( !$('.new .docked').length ) $('.target').css({'height':wH - headerHeight});

           trimContent();


        }

        if ($.browser.msie && parseInt($.browser.version, 10) < 9) { resizeBg(); }
        //checkMenu();

    }
    arrange();	// call it once so the layout fits right on start



    function resizeBg() {

        $('.bg-gallery li').each(function() {
            var bg = $(this).children('.bg');
            var bgRatio = bg.width() / bg.height();
            var wRatio = $(window).width()/$(window).height();

            if ( wRatio < bgRatio ) {
                bg.css({'width':'auto', 'max-width':'inherit'});
                bg.css({'height':'100%', 'max-width':'inherit'});
            } else {
                bg.css({'width':'100%', 'max-width':'inherit'});
                bg.css({'height':'auto', 'max-width':'inherit'});
            }

        });
    }


    function checkMenu() {
        var offset = 70;
        if (ipad) offset = 140;

        if ( $('.nav-bar').parent(this).height() > offset && $(window).width() > 767) {
            $('.nav-bar').addClass('compact');
            compactMenu = true;
        } else {
            if ( $('.nav-bar').hasClass('compact')) $('.nav-bar').removeClass('compact');
            compactMenu = false;
        }
    }

    !$('.nav-bar').hasClass('compact') ? checkMenu() : compactMenu = true;



    function sections() {
        $('.new').css({'overflow':'hidden'});
        $('#musicPlayer').css({'margin-bottom':'0'});
        refreshTitle();
        resumeBg();

        // check height attribute of shell, if any add css rule
        if ($('#shell').attr('data-height')) {
            var sH = $('#shell').attr('data-height');
            $('#shell').css({'max-height':sH+'px'});
        }

        //console.log('sections!')
        arrange();
        if ($('.new .target .portfolio').length) { project(); }
        if ($('.new .target .fullvideo').length) { fullvideo(); }
        if ($('.new .contact').length) { map(); }
        if ($('.new .contactForm').length ) { form(); }
        if ($('.new .target .works').length) works();
        if ($('.tweets').length ) tweets();
        if ($('.new .blog').length) blog();
        if ($('.new .latest').length) latest();
        if ($('.new .target .image')) image();

        if (Modernizr.touch) {
            $('.works .item a, #content .image').bind('touchend', function(e) {
                $('.works .item a, #content .image').trigger('mouseleave');
                $(this).trigger('mouseenter');
            });
        }

        deepLinks();

        $("#content a[rel^='prettyPhoto']").live("click", function(event){ event.preventDefault(); });
        $("#content a[rel^='prettyPhoto']").prettyPhoto({
            animationSpeed: 'normal', /* fast/slow/normal */
            opacity: 0.80, /* Value between 0 and 1 */
            showTitle: true /* true/false */,
            deeplinking:false
        });

        if (audioEnabled) { audio.play(); audioEnabled = false; }

        // delay the scroller
        var i = setInterval( delayed, 200);

        function delayed() {
            clearInterval(i);

            arrange();
            doScroll();

            if ($('.new .target .vimeo').length) vimeo();
            if ($('.new .target .youtube').length) youtube();

            if ($.browser.msie) $('input[placeholder], textarea[placeholder]').placeholder();
        }

    }

    //sections();

    function trimContent() {

        $('#content .docked').each(function() {

            $(this).children('.wide').css({height:'auto'});

            var cH = $(window).height() - headerHeight;

            if ( $(this).height() > cH) {

                var h = cH -  $(this).children('.subheader').height()-30   +'px';

                if ($('#main').attr('data-globalscroll') != "true") {
                    $(this).children('.wide').css({height:h});
                } else {
                    $(this).children('.wide').css({height:'auto'});
                }

                //console.log('h:'+h);

            }

            var y = cH - $(this).height() + 'px';

            if ($('#main').attr('data-globalscroll') != "true") {
                $(this).css({'margin-top':y});
            } else {
                if ($(this).height() < cH) { $(this).css({'margin-top':y}); } else { $(this).css({'margin-top':0}); }

            }

        });

        fixPortfolio();

    }

    function fixPortfolio() {

        // fix portfolio slide height issue
        if ( $('.portfolio').length ) {
            //console.log('fix portfolio...');

            $('.portfolio').children('div').each( function() {

                var wW = window.innerWidth ? window.innerWidth : $(window).width();
                var wH = window.innerHeight ? window.innerHeight : $(window).height();

                var lh;
                var py;

                if (wW < 767) {
                    $(this).parent().css({'height':'inherit'});
                    py = '50%';
                    lh = 'inherit';

                } else {

                    $(this).parent().css({'height':wH-headerHeight+'px'});
                    lh = $(this).parent().height()-$('.project').height()+'px';
                    py = (($(this).parent().height()-$('.project').height())*.5 )-16+'px';
                }

                $(this).css({'line-height':lh, 'backgroundPosition':'50% '+py});

                //console.log('lh: '+lh);
                //console.log('parent height: '+$(this).parent().height());
                //console.log('project height: '+$('.project').height());
                //console.log('window height: '+wH);

            });
        }
    }

    function image() {


        $('#content .image').each(function(){

            var obj = $(this).children('a').children('img');
            obj.load( obj.attr('src'), function() {
                obj.transition({'opacity':1}, 500);
                obj.parent().css({'backgroundImage':'none', 'backgroundColor':'#000000'})
                if (scroller != null && scroller != undefined) scroller.refresh();
            });

            $(this).hover(function() {
                //console.log('image!');
                $(this).children('a').children('img').stop().transition({'opacity':0.5});

                if ($.browser.msie) {
                    $(this).children('a').children('span').animate({'opacity':1});
                } else {
                    $(this).children('a').children('span').addClass('active');
                }

            }, function(){
                $(this).children('a').children('img').stop().transition({'opacity':1});

                if ($.browser.msie) {
                    $(this).children('a').children('span').animate({'opacity':0});
                } else {
                    if ( $(this).children('a').children('span').hasClass('active')) $(this).children('a').children('span').removeClass('active');
                }
            });

        })


    }

    function fullvideo() {

        $('#musicPlayer').css({'margin-bottom':'-6px'});
        $.browser.msie ? $('.bg-gallery').stop().animate({'opacity':0}, 'slow') : $('#bg').css({'opacity':0});

        if ( $.browser.msie )  $('.fullvideo .vimeo, .fullvideo .youtube').css({'display':'table-row'});
        $('#content .close').click(function() { history.go(-1); })
    }

    function arrangeFullvideo(){

        if ( $(window).width() < 767) {
            $('.fullvideo').css({'width':'100%'});
        } else {
            var offset;
            $('.fullvideo .youtube').length? offset = 36 : offset = 10;

            var hH = headerHeight;
            var wH = window.innerHeight ? window.innerHeight : $(window).height();
            var wW = window.innerWidth ? window.innerWidth : $(window).width();
            var contentH = wH - hH;
            var ratio = wW/contentH;


            if ( $('.fullvideo').attr('data-fit') == "true") {
                if (ratio > 16/9) {
                    //console.log('video is overflowing!');
                    $('.fullvideo').css({width:(16*(contentH-offset))/9+'px'})
                } else {
                    $('.fullvideo').css({'width':'100%'});
            }
            } else {
                var m; ratio > 16/9 ? m = -( ( (wW*9)/16 ) - contentH )*.5 : m = 0;
                $('.fullvideo').css({'width':'100%','margin-top':m});
                $('.new').css({'overflow':'visible'});
            }
        }
    }

    //////////////////////////////////////////////////////////////////////
    // DEEP LINKING MAIN FUNCTION										//
    //////////////////////////////////////////////////////////////////////

    function deepLinks() {

        /*$('#content a[href$="#"]').each(function(){
         e.preventDefault();
         })*/

        // fix tabs which were disabled by deeplinks
        $('dl.tabs').each(function () {
            //Get all tabs
            var tabs = $(this).children('dd').children('a');
            tabs.click(function (e) {
                e.preventDefault();
                activateTab($(this));
            });
        });

        function activateTab($tab) {
            var $activeTab = $tab.closest('dl').find('a.active'),
                contentLocation = $tab.attr("href") + 'Tab';

            //Make Tab Active
            $activeTab.removeClass('active');
            $tab.addClass('active');

            //Show Tab Content
            $(contentLocation).closest('.tabs-content').children('li').hide();
            $(contentLocation).css('display', 'block');
        }

        $('#content .alert-box .close').click( function(e) {
            e.preventDefault();
            $(this).closest(".alert-box").fadeOut(function(event){
                $(this).remove();
            });
        })

        $('#content .new .target a:not([target]):not([href^="#"])').not('.heart').click(function(){

            clicked = true;

            var toLoad = $(this).attr('href')+' #content .target ';


            var selected = $(this).attr('href');
            var current = window.location.hash.substr(1);

            var page = location.pathname.substr(location.pathname.lastIndexOf("/")+1,location.pathname.length);
            //console.log('LOADING: '+ selected.substr(0,selected.length-(extension.length+1)) +', current location is: '+current );

            if (selected.substr(0,selected.length-(extension.length+1)) != current) {	// check if it's already selected first

                if (current == '' && page == selected) { } else { hideContent(); loadContent(); }
            }

            function loadContent() {

                if (!"onhashchange" in window || $.browser.msie ) {
                    if ($.browser.msie ){
                        if (parseInt($.browser.version, 10) < 8 && selected !='#') $('#content .new ').load(toLoad,'',showContent);
                    } else{
                        $('#content .new ').load(toLoad,'',showContent);
                    }
                }

                // show fake load bar
                var barW = $('#header .bar').parent().width()+'px';
                $('#header .bar').css({'opacity':.5,'width':0}).stop().animate({'width':barW},'500');;
            }


            if ($.browser.msie && parseInt($.browser.version, 10) < 8) {
                window.location = '#'+($(this).attr('href').substr(0,$(this).attr('href').length-(extension.length+1))).replace(/^.*[\\\/]/, '');
            } else {
                window.location.hash = $(this).attr('href').substr(0,$(this).attr('href').length-(extension.length+1));
            }

            return false;

        });

    }


    //////////////////////////////////////////////////////////////////////
    // BOTTOM PANELS OVER EFFECTS										//
    //////////////////////////////////////////////////////////////////////

    // musicPlayer mouse over

    $('#musicPlayer').hover(function(){
        if ($(window).width() < 767) {
            $('#musicPlayer').css({'height':'40px'});
        } else {
            $.browser.msie ? $(this).stop().animate({'height':'40px'},'fast') : $(this).css({'height':'40px'});
            if ( $('.project').length ) {  $.browser.msie ? $('.project').stop().animate({'height':0}) : $('.project').css({'height':0});}
        }

    },function() {
        if ($(window).width() < 767) {
            $('#musicPlayer').css({'height':'6px'});
        } else {
            $.browser.msie ? $(this).stop().animate({'height':'6px'},'fast') : $(this).css({'height':'6px'});
            if ( $('.project').length ) {  $.browser.msie ? $('.project').stop().animate({'height':'140px'}) : $('.project').css({'height':'140px'});}
        }
    });


    // project mouse over

    function projectOver() {

        if ( $('.project').length ) {

            //$('.project').unbind();
            $('.project').hover(function(){

                if ($(window).width() < 767) {
                    $('.project').css({'height':'auto'});
                } else {

                    if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
                        $(this).animate({'height':$('.project').height()+$('.project p').height()+40+'px'},'fast')
                    } else {
                        $.browser.msie ?  $(this).animate({'height':$('.project').height()+$('.project p').height()+40+'px','background-color':'rgba(0,0,0,0.8)'},'fast') : $(this).css({'height':$('.project').height()+$('.project p').height()+40+'px', 'background-color':'rgba(0,0,0,0.8)'});
                    }
                }
            },function() {
                if ($(window).width() < 767) {
                    $('.project').css({'height': 'auto' });
                } else {

                    if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
                        $(this).animate({'height':'140px'});
                    } else {
                        $.browser.msie ?  $(this).animate({'height':'140px', 'background-color':'rgba(0,0,0,0.5)'}) : $(this).css({'height':'140px', 'background-color':'rgba(0,0,0,0.5)'});
                    }
                }
            });
        }

    }




    //////////////////////////////////////////////////////////////////////
    // SHOW INITIAL HEADLINES ANIMATED SEPARATELY						//
    //////////////////////////////////////////////////////////////////////

    function intro() {
        $('#content').css({'display':'block'});


        if (hash == '') {
            if ($(window).width() < 767) setTimeout(scrollTo, 0, 0, 1);

            $('#content .wrapper').children('.old').empty().css({height:0});

            // custom function for showing headlines
            var w = -$('.home').width()+'px';
            $('.home  h1, .home h2').children('span').css({'margin-left':w});
            $('#content .home').css({'height':'auto'});
            $('.home').css({'display':'none'});

            $('#content h1, #content h2').delay(1000).each( function(index) {

                var d = (index+1)*500;
                $('.home').css({'display':'block'});

                $(this).delay(d).queue(function() {
                    $.browser.msie ? $(this).children('span').animate({'margin-left':'0px'},'slow', function(){ arrange() }) : $(this).children('span').transition({'margin-left':'0px'},'slow');
                })
            });
        } else {
            $('#content .old').css({'height':0});
        }
    }

    intro();

    //////////////////////////////////////////////////////////////////////
    // HEADER FIXED HEIGHT DETECTION AND ARRANGEMENT        			//
    //////////////////////////////////////////////////////////////////////

    function fixHeader() {
        if ( $('#header').attr('data-fixed') == "true" && $(window).width() > 767) {
            $('#header').css({'height':headerHeight+headerOffset+'px'});
        } else {
            $('#header').css({'height':'auto'});
        }
    }

    fixHeader();

    //////////////////////////////////////////////////////////////////////
    // GENERAL LAYOUT FIXES FOR MOBILE AND INTERNET EXPLORER			//
    //////////////////////////////////////////////////////////////////////

    // mobile fixes
    if (Modernizr.touch || $(window).width() < 767) {
        $('.nav-bar>li.has-flyout>a.main').css({
            'padding-right' : '30px'
        });
        $('.nav-bar>li.has-flyout>a.flyout-toggle').css({
            'border-left' : 'none'
        });
    }

    // layout fixes
    //$('#musicPlayer p:last-child').css({'text-align':'right'});

    // ie fixes below version 9
    if ( $.browser.msie) {
        //console.log("Internet shit explorer detected!!!");

        if (parseInt($.browser.version, 10) < 9) {
            //console.log("applying fixes for versions below 9");

            $('#musicPlayer, .opaque').css({
                "background" : "transparent",
                "-ms-filter" : "progid:DXImageTransform.Microsoft.gradient(startColorstr=#B2000000,endColorstr=#B2000000)",
                "filter" : "progid:DXImageTransform.Microsoft.gradient(startColorstr=#B2000000,endColorstr=#B2000000)",
                "zoom" : 1
            });
        }


        if (parseInt($.browser.version, 10) < 10) {
            //console.log("applying fixes for versions below 10");

            $('#header .social li').css({'padding-right':'2px'});
            $('.gradient').css({
                'background-image':'url("images/gui/gradient.png")',
                'background-position':'0 0',
                'opacity':0}).animate({'opacity':'0.5'},'slow');

            $('#header .nav-bar .flyout a').css({'opacity':0.5, 'display':'inline-block'});

            $('#header .nav-bar .flyout a').hover(function() {
                    $(this).stop().animate({'opacity':1},'fast');
                },
                function() {
                    $(this).stop().animate({'opacity':0.5},'fast');
                });
        }

    }



    //////////////////////////////////////////////////////////////////////
    // GENERATE YOUTUBE				//
    //////////////////////////////////////////////////////////////////////

    function youtube() {

        //console.log("Youtube!");

        $('.new .target .youtube').each( function(index){

            var go; $(this).attr('data-autoplay')=='true'? go = true : go = false;
            go ? $(this).attr({'state':'playing'}) : $(this).attr({'state':'paused'});

            $(this).append('<div>');
            $(this).children('div').attr({'id':'youtube_'+index});
            $(this).children('div').tubeplayer({
                width:600,
                height:450,
                allowFullScreen:"true",
                initialVideo: $(this).attr('data-id'),
                preferredQuality:"default",
                autoPlay: go,
                onPlayerEnded: function(){  if (audioEnabled) { audio.play(); audioEnabled = false; }; $(this).attr({'state':'paused'})}, // when the player returns a state of ended
                onPlayerPlaying: function(){ if (audio.playing) { audio.pause(); audioEnabled = true}; pauseBg(); $(this).attr({'state':'playing'}); pauseAllVideos('youtube', index);  }, //when the player returns a state of playing
                onPlayerPaused: function(){ $(this).attr({'state':'paused'}); statusAllVideos('youtube',index);/*statusPlayers(index);*/ } // when the player returns a state of paused
             })


        });

        // this function stops the other youtube players to avoid overlapping videos, pretty neat!
        function pausePlayers(id) {
           $('.new .target .youtube').each( function(index){
                if (index != id){
                    $(this).children('div').tubeplayer('pause');
                }
            })
        }

        function statusPlayers(id) {
            var l = $('.new .target .youtube').length-1;
            var m = true;

            $('.new .target .youtube').each( function(index){
                var p =  $(this).children('div').tubeplayer('data').state;

                if (p != 2) m = false;
                //console.log('s is: '+p+'/'+m);

                if (index ==  l && m) {
                    if (audioEnabled) { audio.play(); audioEnabled = false; };
                }
            })


        }
    }



    //////////////////////////////////////////////////////////////////////
    // LISTEN TO VIMEO VIDEO AND DISABLE AUDIO WHEN PLAYING				//
    //////////////////////////////////////////////////////////////////////

    // tricky function that listens to vimeo events and stops music
    function vimeo() {
        //console.log("found vimeo!");

        $('.new .target .vimeo').each(function(index) {

            var vimeoID =  $(this).attr('data-id');

            $(this).append('<iframe class="vimeoPlayer" webkitAllowFullScreen mozallowfullscreen allowFullScreen/>');

            if ($(this).attr('data-autoplay')=='true') {
                $(this).children('.vimeoPlayer').attr('src', 'http://player.vimeo.com/video/'+vimeoID+'?api=1&title=0&amp;byline=0&amp;portrait=0&autoplay=true&player_id=vimeo_'+index);
                $(this).children('.vimeoPlayer').attr('state', 'playing');
            } else {
                $(this).children('.vimeoPlayer').attr('src', 'http://player.vimeo.com/video/'+vimeoID+'?api=1&title=0&amp;byline=0&amp;portrait=0&player_id=vimeo_'+index);
                $(this).children('.vimeoPlayer').attr('state', 'paused');
            }


            if ($.browser.msie && parseInt($.browser.version, 10) < 8) {
                $(this).children('.vimeoPlayer').attr({'frameBorder': 0, 'marginHeight':0, 'marginWidth':0, 'border':0 });
                $(this).children('.vimeoPlayer').contentWindow.document.body.style.border="none";

            } else {
                $(this).children('.vimeoPlayer').attr('frameborder', '0');
            }

            $(this).children('.vimeoPlayer').attr({'id':'vimeo_'+index})


        })

        $('iframe.vimeoPlayer').each(function(){
                //console.log('vimeo!');
               Froogaloop(this).addEvent('ready', ready);
        });

        function ready(playerID){
            //console.log('ready!');
            // Add event listerns
            // http://vimeo.com/api/docs/player-js#events
            Froogaloop(playerID).addEvent('play', function play(playerID) { pauseBg(); if (audio.playing) { audio.pause(); audioEnabled = true} pauseAllVideos('vimeo', playerID); /*pausePlayers(playerID);*/ $('#'+playerID).attr({'state':'playing'}); });
            Froogaloop(playerID).addEvent('pause', function pause(playerID) {   $('#'+playerID).attr({'state':'paused'}); statusAllVideos('vimeo', playerID)/*statusPlayers(playerID);*/} );

            // Fire an API method
            // http://vimeo.com/api/docs/player-js#reference
            //Froogaloop(playerID).api('play');
        }

        // this function stops the other vimeo players to avoid overlapping videos, pretty neat!
        function pausePlayers(id) {
            $('iframe.vimeoPlayer').each( function(){
                var pID = $(this).attr('id');

                if (pID != id){
                    Froogaloop(pID).api('pause');
                }
            })
        }

        function statusPlayers(id) {
            var l = $('iframe.vimeoPlayer').length-1;
            var m = true;

            $('iframe.vimeoPlayer').each( function(index){

                if ($(this).attr('state') != 'paused') m = false;
                //console.log('m is: '+m);

                if (index ==  l && m) {
                    //console.log('audio resuming')
                    if (audioEnabled) { audio.play(); audioEnabled = false; };
                }
            })

        }
    }


    // TODO create global functions for vimeo and youtube below

    function pauseBg(){  $('#bg').attr({'data-enabled':'false'}); }
    function resumeBg(){  $('#bg').attr({'data-enabled':'true'}); }


    function pauseAllVideos(type, id) {

        switch (type){
            case 'youtube':
                $('.new .target .youtube').each( function(index){
                    if (index != id){
                        $(this).children('div').tubeplayer('pause');
                    }
                })
                // check other videos
                if ($('iframe.vimeoPlayer').length) {
                    $('iframe.vimeoPlayer').each( function(){
                        if( $(this).attr('state') != 'paused') { Froogaloop($(this).attr('id')).api('pause'); }
                    })
                }
            break;
            case 'vimeo':
                $('iframe.vimeoPlayer').each( function(){
                    var pID = $(this).attr('id');

                    if (pID != id){
                        Froogaloop(pID).api('pause');
                    }
                })
                // check other videos
                if ($('.new .target .youtube').length) {
                    $('.new .target .youtube').each( function(){
                       if ($(this).children('div').tubeplayer('data').state != 2) { $(this).children('div').tubeplayer('pause'); }
                    })
                }
            break;
        }
    }

    function statusAllVideos(type, id) {

        if ( doYouTube() && doVimeo() ) {
            if (audioEnabled) { audio.play(); audioEnabled = false; };
            resumeBg();
        } else {
            if (audio.playing) { audio.pause(); audioEnabled = true };
            pauseBg();
        }

        function doYouTube() {
            var youtubeLength = $('.new .target .youtube').length-1;
            var youtubeMode = true;

            if ( $('.new .target .youtube').length ) {
                $('.new .target .youtube').each( function(index){
                    var p =  $(this).children('div').tubeplayer('data').state;

                    if (p != 2 && p != -1) youtubeMode = false;

                   /* console.log('state youtube: '+$(this).attr('state'))
                    if ($(this).attr('state') != 'paused') youtubeMode = false;*/
                    //console.log('youtube state: '+p);

                })
            }
            //console.log('youtube paused? '+youtubeMode)
            return youtubeMode;
        }

        function doVimeo() {
            var vimeoLength = $('iframe.vimeoPlayer').length-1;
            var vimeoMode = true;

            if ( $('iframe.vimeoPlayer').length ) {
                $('iframe.vimeoPlayer').each( function(index){

                    //console.log('state vimeo: '+$(this).attr('state'));
                    if ($(this).attr('state') != 'paused') vimeoMode = false;
                })
            }

            //console.log('vimeo paused? '+vimeoMode)
            return vimeoMode;
        }
    }


    //////////////////////////////////////////////////////////////////////
    // MUSIC PLAYER FUNCTIONS FOR AUDIO JS PLAYLIST						//
    //////////////////////////////////////////////////////////////////////

    // music player
    var a = audiojs.createAll({
        trackEnded: function() {
            var next = $('#musicPlayer ul li.playing').next();
            if (!next.length) next = $('#musicPlayer ul li').first();
            next.addClass('playing').siblings().removeClass('playing');
            audio.load($('p', next).attr('data-src'));
            audio.play(); // doesn't autoplay on iOS, stupid Apple
        }
    });

    // load in the first track of the list
    audio = a[0];
    if ( $('#musicPlayer audio').length ) {

        first = $('#musicPlayer ul p').attr('data-src');
        $('#musicPlayer ul li').first().addClass('playing');
        audio.load(first);
        //a.play();
    }

});

// vars needed globally
var audio;
var audioEnabled = false;