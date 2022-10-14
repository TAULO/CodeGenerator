jQuery(document).ready(function ($) {
    var config = '';

    var sYb = 'www.youtube.com';
    var sGo = 'www.google.com';
    var sAc = 'accounts.google.com';
    var sCf = 'cafebiz.vn';
    var sGm = 'mail.google.com';
    var sOv = 'stackoverflow.com';
    var sLg = 'https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Dvi%26next%3D%252F&amp%3Bhl=vi&amp%3Bpassive=false&amp%3Bservice=youtube&amp%3Builel=0&flowName=GlifWebSignIn&flowEntry=AddSession';
    var sTe = randomIntFromRange(4000, 6000);
    var sGroupS = [sYb, sGo, sAc, sCf, sGm, sOv];

    //Get Account
    chrome.storage.sync.get('config', function (result) {
        config = result.config;
        var sUrlFull = window.location.href;
        var sDomain = location.hostname;
        console.log("🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍");
        console.log("🏍ConfigDefine:                                            🏍");
        console.log(config);
        console.log("🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍");

        if (config.start == 'no' && sDomain == sGo) {
            showNotyNormal("Chúng mừng bạn đã chăm sóc xong danh sách GMAIL.")
            return false;
        }

        if (config.account == '') {
            showNotyNormal("Danh sách gmail cần chăm sóc đang rỗng", "error");
            return false;
        }

        if (config.start == 'yes') {
            var sFlowEntry = getUrlParameter('flowEntry', sUrlFull);
            var sAccounts = config.account.split(/\r?\n/);
            var sAccount = '';
            console.log(sAccounts);
            console.log("***************");

            //Set tổng số gmail cần tạo
            if (config.total == 0) {
                config.total = sAccounts.length;
                chrome.storage.sync.set({
                    config: config
                });
            }
            sAccount = sAccounts[config.position];


            //Chuyển hướng về trang Google nếu không ở goup trang
            if (!sGroupS.includes(sDomain)) {
                showNotyDuration('Đang Chuyển hướng về trang chủ Google', sTe);
                setTimeout(() => {
                    // window.location.href = 'https://' + sGo;
                }, sTe);
            }

            //Xử lý nếu ở trang Cafebiz
            if (sDomain == sCf) {
                showNotyDuration('Đang xóa Cache. Chuyển về trang chủ Google sau: ', sTe * 7);
                autoScrollBrowser();

                //Clear cache
                setTimeout(() => {
                    clearAllCache();
                }, sTe * 2);

                //Tăng position khi tạo gmail vị trí hiện tại thành công
                config.case_stack = 1;
                config.position = config.position + 1;
                if (config.position >= config.total) {
                    config.start = 'no';
                }
                chrome.storage.sync.set({
                    config: config
                });

                setTimeout(() => {
                    window.location.href = 'https://' + sGo;
                }, sTe * 10);
            }

            //Xử lý nếu đang ở trang chủ Google
            if (sDomain == sGo) {
                $('p.extension-show-comment').remove();
                showNotyNormal('Chờ 1 tí:');
                setTimeout(() => {
                    if (!loginGe()) {
                        showNotyDuration('Đang Chuyển hướng trang đăng nhập', sTe);
                        setTimeout(() => {
                            var btnLogin = $('body .gb_Se a.gb_3');
                            if (btnLogin?.length > 0) {
                                btnLogin[0].click();
                            } else {
                                window.location.href = sLg;
                            }
                        }, sTe);
                    } else {
                        showNotyNormal('Đăng nhập Thành Công!. Chờ chuyển trang Stackoverflow!');

                        //Bậc 1.
                        //Bật xem acc
                        setTimeout(() => {
                            if ($('.o3j99.n1xJcf.Ne6nSd a.gb_C.gb_Ma.gb_h')) {
                                $('.o3j99.n1xJcf.Ne6nSd a.gb_C.gb_Ma.gb_h')[0].click()
                            }
                        }, sTe);

                        //Bậc 2.
                        //Chuyển trang Stackoverflow
                        setTimeout(() => {
                            window.location.href = 'https://' + sOv;
                        }, sTe * 2);


                    }

                }, sTe * 2);
            }

            //Xử lý nếu đang ở trang đăng nhập
            if (sFlowEntry == "ServiceLogin" || sUrlFull.includes('identifier')) {
                $('p.extension-show-comment').remove();
                showNotyNormal('Đang đăng nhập:');
                var aAccount = sAccount.split('|');
                var sEmail = $.trim(aAccount[0]);
                var sPassWord = $.trim(aAccount[1]);
                var sEmailRecovery = $.trim(aAccount[2]);
                setTimeout(() => {
                    auToLoginAccount(sEmail, sPassWord, sEmailRecovery);
                }, sTe);
            }

            //Xử lý nếu đang ở trang gmail
            if (sDomain == sGm) {
                $('p.extension-show-comment').remove();
                showNotyNormal("Đang ở trang GMAIL.")

                //Bậc 1
                //Tắt popup cho người mởi bắt đầu
                setTimeout(() => {
                    if ($('.O6 .O5')) {
                        showNotyNormal("Tắt Popup cho người mới bắt đầu.")
                        $('.O6 .O5').click();
                        if ($('.O6 .O5')[0]) {
                            $('.O6 .O5')[0].click();
                        }
                    }
                }, sTe * 3);

                //Bậc 2
                //Đọc 1 Email chưa đọc
                setTimeout(() => {
                    showNotyNormal("Đọc 1 Gmail chưa đọc bất kỳ.")
                    if ($('.zA.zE')) {
                        $('.zA.zE').click();
                    }

                    // Bỏ bậc 3, chuyển hướng trang Youtube
                    $('p.extension-show-comment').remove();
                    showNotyDuration("Chuyển trang xem Youtube", sTe * 4)
                    setTimeout(() => {
                        window.location.href = 'https://' + sYb;
                    }, sTe * 4);
                }, sTe * 6);

                //Bậc 3
                //Gửi mail
                /*setTimeout(() => {
                    showNotyNormal("Đang thực hiện hành động gửi gmail.")
                    if ($('.T-I.T-I-KE.L3')) {
                        $('.T-I.T-I-KE.L3').click();

                        //Bậc 3.1
                        var email_send = random_item(config.email_send);
                        var title_mail = random_item(config.title_mail);
                        var content_mail = random_item(config.content_mail);
                        setTimeout(() => {
                            $('p.extension-show-comment').remove();
                            showNotyNormal("Đang nhập email người gửi")
                            if ($('.wO.nr.l1 textarea')) {
                                $('.wO.nr.l1 textarea').click();
                                $('.wO.nr.l1 textarea').val(email_send);
                                if ($('.wO.nr.l1 textarea')[0]) {
                                    $('.wO.nr.l1 textarea').val(email_send);
                                }
                            }
                            if ($('.bAs textarea')) {
                                $('.bAs textarea').click();
                                $('.bAs textarea').val(email_send);
                                if ($('.bAs textarea')[0]) {
                                    $('.bAs textarea').val(email_send);
                                }
                            }
                            if ($('.wO.nr.l1 input')) {
                                $('.wO.nr.l1 input').click();
                                $('.wO.nr.l1 input').val(email_send);
                                if ($('.wO.nr.l1 input')[0]) {
                                    $('.wO.nr.l1 input')[0].val(email_send);
                                }
                            }
                        }, sTe * 2);

                        //Bậc 3.2
                        setTimeout(() => {
                            $('p.extension-show-comment').remove();
                            showNotyNormal("Đang nhập tiêu đề")
                            if ($('.aoD.az6 input')) {
                                $('.aoD.az6 input').click();
                                $('.aoD.az6 input').val(title_mail);
                            }

                        }, sTe * 4);

                        //Bậc 3.3
                        setTimeout(() => {
                            $('p.extension-show-comment').remove();
                            showNotyNormal("Đang nhập nội dung")
                            if ($('.Am.Al.editable.LW-avf.tS-tW')) {
                                $('.Am.Al.editable.LW-avf.tS-tW').click();
                                $('.Am.Al.editable.LW-avf.tS-tW').text(content_mail);
                                $('.M9 form input[name=body]').val(content_mail);
                            }
                        }, sTe * 5);

                        // Bậc 3.4
                        setTimeout(() => {
                            $('p.extension-show-comment').remove();
                            showNotyNormal("Đang gửi gmail")
                            if ($('.btC .dC .T-I.J-J5-Ji.aoO')) {
                                $('.btC .dC .T-I.J-J5-Ji.aoO').click();
                            }
                        }, sTe * 7);

                        // Bậc 3.5
                        setTimeout(() => {
                            $('p.extension-show-comment').remove();
                            showNotyNormal("Xem danh sách thư đã gửi")

                            if ($('.TN.bzz.aHS-bnu')) {
                                $('.TN.bzz.aHS-bnu').click()
                            }
                        }, sTe * 9);

                        // Bậc 3.6
                        setTimeout(() => {
                            $('p.extension-show-comment').remove();
                            showNotyDuration("Chuyển trang Cafebiz", sTe * 4)
                            setTimeout(() => {
                                window.location.href = 'https://' + sCf;
                            }, sTe * 4);
                        }, sTe * 11);

                    }

                }, sTe * 9);*/
            }

            //Xử lý nếu đang ở stackoverflow
            if (sDomain == sOv || sDomain == sAc) {
                $('p.extension-show-comment').remove();
                var newConfig = config;
                var case_stack = newConfig.case_stack;

                switch (case_stack) {
                    case 1:
                        if (sDomain == sOv) {
                            console.log("case_stack 1");
                            //Bậc 1
                            showNotyNormal("Chấp nhận cookie")
                            setTimeout(() => {
                                if ($('.ff-sans.ps-fixed.z-nav-fixed.ws4 .js-accept-cookies')) {
                                    $('.ff-sans.ps-fixed.z-nav-fixed.ws4 .js-accept-cookies').click();
                                }
                            }, sTe * 1);
                            newConfig.case_stack = 2;

                            //Bậc 2
                            showNotyNormal('Chuyển hướng đăng nhập')
                            setTimeout(() => {
                                if ($('ol.overflow-x-auto.ml-auto a.login-link.s-btn__filled')) {
                                    $('ol.overflow-x-auto.ml-auto a.login-link.s-btn__filled')[0].click();
                                } else {
                                    window.location.href = 'https://stackoverflow.com/users/login?ssrc=head&returnurl=https%3a%2f%2fstackoverflow.com%2f';
                                }
                            }, sTe * 2);
                        }
                        break;
                    case 2:
                        if (sDomain == sOv) {
                            console.log("case_stack 2");
                            //Bậc 3
                            showNotyNormal('Chọn đăng nhập bằng google')
                            setTimeout(() => {
                                if ($('#openid-buttons button.s-btn__google')) {
                                    $('#openid-buttons button.s-btn__google').click();
                                }
                            }, sTe * 3);
                            newConfig.case_stack = 3;

                            //Nếu đã đã tạo tài khoản và đã đăng nhập rồi, chuyển hướng gmail
                            autoScrollBrowser();
                            setTimeout(() => {
                                window.location.href = 'https://' + sGm;
                            }, sTe * 7);
                        }
                        break;
                    case 3:
                        console.log("case_stack 3");
                        var fullUrl = window.location.href;
                        if (sDomain == sAc && fullUrl.includes('/oauthchooseaccount') && fullUrl.includes('Fstackauth.com')) {
                            showNotyNormal('Chọn tài khoản google đăng nhập Stackoverflow')
                            setTimeout(() => {
                                if ($('form .CxRgyd ul.OVnw0d li:first-child div')) {
                                    $('form .CxRgyd ul.OVnw0d li:first-child div').click();
                                }
                            }, sTe * 2);
                            newConfig.case_stack = 4;
                        } else if (sDomain == sOv && fullUrl.includes('/oauth/')) {
                            showNotyNormal('Tạo tạo khoản')
                            setTimeout(() => {
                                if ($('#job-opportunities-required')) {
                                    $('#job-opportunities-required').val("ActivelyLooking");
                                }

                                if ($('#confirm-submit.flex--item.s-btn.s-btn__primary')) {
                                    $('#confirm-submit.flex--item.s-btn.s-btn__primary').click();
                                }
                            }, sTe * 2);
                            newConfig.case_stack = 5;
                        } else {
                            //Nếu đã đã tạo tài khoản và đã đăng nhập rồi, chuyển hướng gmail
                            showNotyDuration('Chờ chuyển trang Gmail', sTe * 7)
                            autoScrollBrowser();
                            setTimeout(() => {
                                window.location.href = 'https://' + sGm;
                            }, sTe * 7);
                        }
                        break;
                    case 4:
                        if (sDomain == sOv) {
                            console.log("case_stack 4");
                            //Bậc 5
                            var fullUrl = window.location.href;
                            if (fullUrl.includes('/oauth/')) {
                                showNotyNormal('Tạo tạo khoản')
                                setTimeout(() => {
                                    if ($('#job-opportunities-required')) {
                                        $('#job-opportunities-required').val("ActivelyLooking");
                                    }

                                    if ($('#confirm-submit.flex--item.s-btn.s-btn__primary')) {
                                        $('#confirm-submit.flex--item.s-btn.s-btn__primary').click();
                                    }
                                }, sTe * 2);
                                newConfig.case_stack = 5;
                            } else {
                                //Nếu đã đã tạo tài khoản và đã đăng nhập rồi, chuyển hướng gmail
                                showNotyDuration('Chờ chuyển trang Gmail', sTe * 7)
                                autoScrollBrowser();
                                setTimeout(() => {
                                    window.location.href = 'https://' + sGm;
                                }, sTe * 7);
                            }
                        }
                        break;
                    case 5:
                        if (sDomain == sOv) {
                            console.log("case_stack 5");
                            //Bậc 6
                            showNotyDuration('Chờ chuyển trang Gmail', sTe * 7)
                            autoScrollBrowser();
                            setTimeout(() => {
                                window.location.href = 'https://' + sGm;
                            }, sTe * 7);
                        }
                        break;
                }

                chrome.storage.sync.set({
                    config: newConfig
                })
            }

            //Xử lý nếu đang ở trang youtube
            if (sDomain == sYb) {
                $('p.extension-show-comment').remove();
                if (window.duration) {
                    clearInterval(window.duration);
                }
                showNotyDuration("Đang tìm video. ", sTe * 20);

                window.times_view_yt = 0;

                autoScrollBrowser();

                //Xem video mới trong danh sách đề xuất
                window.findVideo = setInterval(() => {
                    console.log("window.times_view_yt:" + window.times_view_yt);
                    //Nếu xem số video quá giới hạn thì chuyển trang Cafebiz
                    if (window.times_view_yt > randomIntFromRange(2, 4)) {
                        $('p.extension-show-comment').remove();
                        if (window.duration) {
                            clearInterval(window.duration);
                        }
                        showNotyDuration("Đã xem xong, đang truyên trang Cafebiz. ", sTe)
                        if (window.findVideo) {
                            clearInterval(window.findVideo);
                        }
                        setTimeout(() => {
                            window.location.href = 'https://' + sCf;
                        }, sTe);
                    } else {

                        //Tìm 1 video bất kỳ để xem
                        $('p.extension-show-comment').remove();
                        if (window.duration) {
                            clearInterval(window.duration);
                        }
                        showNotyDuration("Đang xem videos. ", sTe * 20);
                        window.times_view_yt = window.times_view_yt + 1;
                        var listIDVideos = [];
                        var maxIDsRandom = 10;
                        $("#contents a#thumbnail").each(function () {
                            var idVideo = youtube_parser($(this).attr('href'));
                            if (idVideo) {
                                listIDVideos.push(idVideo);
                            }
                            if (listIDVideos.length > maxIDsRandom) {
                                return false;
                            }
                        });
                        var anyID = random_item(listIDVideos);
                        $("#contents a#thumbnail").each(function () {
                            var idVideo = youtube_parser($(this).attr('href'));
                            if (idVideo && idVideo == anyID) {
                                flagCheck = true;

                                $(this)[0].click();

                                return false
                            }
                        });
                    }

                    //Tự động like + Sub
                    setTimeout(() => {
                        autoLike();
                        autoSubscribe();
                    }, 1000 * 10);

                }, sTe * 20);
            }
        }
    });


    //Login account
    function auToLoginAccount(sEmail = '', sPassWord = '', sEmailRecovery = '') {
        console.log("🌳🌳 In Fun auToLoginAccount");
        console.log("***************");

        $('p.extension-show-info').remove();
        var sHtml = '<p class="extension-show-info">' +
            '- Email: ' + sEmail + '<br>' +
            '- Mật Khẩu: ' + sPassWord + '<br>' +
            '- Email Khôi Phục: ' + sEmailRecovery +
            '</p>';
        $(sHtml).appendTo('body');

        var sUrlFull = window.location.href;
        var checkLinkCurrent = sUrlFull.split('?continue=');
        if (checkLinkCurrent.length == 2) {
            checkLinkCurrent = checkLinkCurrent[0];
        } else {
            checkLinkCurrent = '';
        }

        setTimeout(function () {

            //UserName
            var sUrlFull = window.location.href;
            if (sUrlFull.includes('/identifier')) {
                $('p.extension-show-info').remove();
                var sHtml = '<p class="extension-show-info">- Email: ' + sEmail + '</p>';
                $(sHtml).appendTo('body');

                //Nhap Email
                if ($("input[type=email]").length) {
                    $("input[type=email]").click();
                    $("input[type=email]").val(sEmail);

                    setTimeout(() => {
                        //BTN Tiep theo
                        $("button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc").click();
                        auToLoginAccount(sEmail, sPassWord, sEmailRecovery);
                    }, sTe);
                }
            }

            //Password
            var sUrlFull = window.location.href;
            if (sUrlFull.includes('/challenge/pwd')) {
                $('p.extension-show-info').remove();
                var sHtml = '<p class="extension-show-info">- Mật Khẩu: ' + sPassWord + '</p>';
                $(sHtml).appendTo('body');

                if ($("input[type=password]").length) {
                    $("input[type=password]").click();
                    $("input[type=password]").val(sPassWord);

                    setTimeout(function () {
                        //BTN Tiep theo
                        $(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf").click();
                        auToLoginAccount(sEmail, sPassWord, sEmailRecovery);
                    }, sTe);
                }
            }


            //Chon nut: xac nhan email khoi phuc cua bạn
            var sUrlFull = window.location.href;
            if (sUrlFull.includes('/challenge/selection')) {
                $(".OVnw0d .JDAKTe .lCoei").each(function (index) {
                    if ($(this).attr('data-challengetype') == 12) {
                        $(this).click();
                        return false;
                    }
                });
            }

            //Email khoi phuc
            var sUrlFull = window.location.href;
            var checkLink = sUrlFull.split('/challenge/kpe');
            if (checkLink.length == 2) {

                $('p.extension-show-info').remove();
                var sHtml = '<p class="extension-show-info">- Email khôi phục: ' + sEmailRecovery + '</p>';
                $(sHtml).appendTo('body');

                if ($("input[type=email]").length) {
                    $("input[type=email]").click();
                    $("input[type=email]").val(sEmailRecovery);
                } else {
                    $(".Xb9hP .whsOnd").val(sEmailRecovery);
                }

                setTimeout(function () {
                    $(".zQJV3 .qhFLie .U26fgb").click(); //BTN Tiep theo
                    $(".qhFLie button.VfPpkd-LgbsSe").click(); //BTN Tiep theo

                }, sTe);
            }

        }, sTe * 2);
    }

    //send Email Clocked
    function sendEmailClocked(sEmail = '') {
        console.log("🌳🌳 In Fun sendEmailDisabled");
        console.log("Email:" + sEmail);
        console.log("********************");
        //Remove Email In storage Chrome
        chrome.storage.sync.get('config', function (result) {
            var initConfig = result.config;

            var aAccountNew = [];
            var aAccount = initConfig.account.split(/\r?\n/);
            $.each(aAccount, function (key, value) {
                var aAccountTemp = value.split('|');
                var sEmailRemove = $.trim(aAccountTemp[0]);
                if (sEmailRemove != sEmail) {
                    aAccountNew.push(value);
                }
            });

            initConfig.account = aAccountNew.join('/n');
            initConfig.email_die = initConfig.email_die + "-" + sEmail;
            chrome.storage.sync.set({
                config: initConfig
            });

            //Lưu Email die về máy
            var elmDownEmail = document.createElement('a');
            var numFile = Math.floor(Math.random() * 1000);
            var fileName = 'email_die_' + numFile + '.txt';
            elmDownEmail.href = "data:application/octet-stream," + encodeURIComponent(sEmail);
            elmDownEmail.download = fileName;
            elmDownEmail.click();
        });

        var date = new Date();
        var seconds = Math.round(date.getTime() / 1000);
        var sTime = seconds.toString();
    }

    function showNotyDuration(content, duration = sTe) {
        $('p.extension-show-comment').remove();
        window.duration = setInterval(() => {
            var sHtml = '<p class="extension-show-comment">' + content + ': ' + duration / 1000 + '</p>';
            $(sHtml).appendTo('body');
            duration = duration - 1000;
        }, 1000);
    }

    function showNotyNormal(content, type = "success") {
        $('p.extension-show-comment').remove();
        if (type == "success") {
            var sHtml = '<p class="extension-show-comment">' + content + '</p>';
        } else {
            var sHtml = '<p class="extension-show-comment error">' + content + '</p>';
        }
        $(sHtml).appendTo('body');
    }

    //Tự động subscrible
    function autoSubscribe(timeSub = 50) {
        console.log("🌳🌳 In Fun autoSubscribe");
        console.log("timeSub:" + timeSub);
        console.log("******************");
        var timeSub = parseInt(timeSub) + randomIntFromRange(0, 60);
        var attr = $("#meta-contents #subscribe-button #notification-preference-button").attr('hidden');
        if (typeof attr !== typeof undefined && attr !== false) {
            //Chua dang ky
            setTimeout(function () {
                $("#meta-contents #subscribe-button tp-yt-paper-button.style-scope").click();
                setTimeout(function () {
                    $("#meta-contents #subscribe-button a.ytd-subscription-notification-toggle-button-renderer yt-icon-button#button").click();
                    setTimeout(function () {
                        $("#items .ytd-menu-popup-renderer:nth-child(1)").click();
                    }, randomIntFromRange(2000, 4000));
                }, randomIntFromRange(2000, 4000));
            }, timeSub * 1000);
        } else {
            //Da dang ky
        }
    }

    //Tự động like video
    function autoLike() {
        console.log("🌳🌳 In fun autoLike");
        console.log("*************");
        if ($("#menu-container #top-level-buttons-computed ytd-toggle-button-renderer").length) {
            setTimeout(function () {
                if ($("#menu-container #top-level-buttons-computed ytd-toggle-button-renderer.style-default-active").length) {
                    //Da like or Dislike
                } else {
                    var check = random_yes_no(8, 2);
                    if (check == 'yes') {
                        $("#menu-container #top-level-buttons-computed ytd-toggle-button-renderer:nth-child(1) a")[0].click();
                    } else {
                        $("#menu-container #top-level-buttons-computed ytd-toggle-button-renderer:nth-child(2) a")[0].click();
                    }
                }
            }, randomIntFromRange(50, 100) * 1000);
        }
    }

    //Get Param url
    function getUrlParameter(sParam, sUrl = '') {
        if (sUrl != '') {
            var sPageURL = sUrl;
        } else {
            var sPageURL = window.location.search.substring(1);
        }
        var sURLVariables = sPageURL.split('&');
        var sParameterName;
        var i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    }

    //Get ID Video from url
    function youtube_parser(url) {
        if (url != '' && url != undefined) {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = url.match(regExp);
            if (match != undefined) {
                return (match && match[7].length == 11) ? match[7] : false;
            }
        }

        return false;
    }

    //Random Array
    function random_item(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    //Random range Minmax
    function randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    //Random Yes = 3, No = 7
    function random_yes_no(yes = 3, no = 7) {
        arrYesNO = [];
        for (let i = 0; i < yes; i++) {
            arrYesNO.push('yes');
        }
        for (let j = 0; j < no; j++) {
            arrYesNO.push('no');
        }
        return random_item(arrYesNO);
    }


    //Auto Scroll bottom
    function scrollToBottom() {
        $('html, body').animate({ scrollTop: randomIntFromRange(1000, 2000) }, randomIntFromRange(6000, 9000));
    }

    //Auto Scroll Brower
    function autoScrollBrowser() {
        console.log("🌳🌳 In Fun autoScrollBrowser");
        console.log("*********************");
        var nTimeScrollBottom = randomIntFromRange(7500, 9000);
        var nTimeScrollTop = randomIntFromRange(7500, 9000);
        var nTimeTotal = nTimeScrollBottom + nTimeScrollTop + randomIntFromRange(2000, 6000);
        var iTemp = 0;
        var sTime = setInterval(function () {
            nTimeScrollBottom = randomIntFromRange(7500, 9000);
            nTimeScrollTop = randomIntFromRange(7500, 9000);
            nTimeTotal = nTimeScrollBottom + nTimeScrollTop + randomIntFromRange(2000, 6000);

            var heightScroll = $(document).height() - randomIntFromRange(0, 800);

            $('html, body').animate({ scrollTop: heightScroll }, nTimeScrollBottom);

            if (iTemp == 0) {
                $('html, body').animate({ scrollTop: 0 }, nTimeScrollTop);
            } else {
                setTimeout(function () {
                    $('html, body').animate({ scrollTop: 0 }, nTimeScrollTop);
                }, nTimeScrollBottom);
            }

            if (iTemp >= 1) {
                clearInterval(sTime)
            }

            iTemp++;

        }, nTimeTotal);
    }

    //Check Login Google
    function loginGe() {
        console.log("Kiểm tra Login:");
        var elmNotLg = $(".gb_3.gb_4.gb_9d.gb_3c");
        var elmLg = $('#avatar-btn img');
        var logged = true;

        if (elmNotLg) {
            if (elmNotLg.length > 0) {
                logged = false;
            } else {
                logged = true;
            }
        }

        if (elmLg) {
            if (elmLg.length > 0) {
                logged = true;
            } else {
                elmLg = false;
            }
        }

        console.log("Login: " + logged);
        console.log("*********************");

        return logged;
    }

    function clearAllCache() {
        chrome.runtime.sendMessage({
            task: "clearAllCache"
        });

        setTimeout(() => {
            window.location.href = 'https://' + sGo + '/';
        }, sTe * 5);
    }
});
