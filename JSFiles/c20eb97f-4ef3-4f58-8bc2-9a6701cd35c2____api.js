/**
 * Created by rzm on 15/3/18.
 */


(function(W, $){
    try {
        document.domain = 'qq.com';
    } catch (e) {}

    if(typeof console === "undefined"){
        console = { log: function() { } };
    }

    var JSON = JSON || {};
    // implement JSON.stringify serialization
    JSON.stringify = JSON.stringify || function (obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"'+obj+'"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n]; t = typeof(v);
                if (t == "string") v = '"'+v+'"';
                else if (t == "object" && v !== null) v = JSON.stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };

    var html; 
    /*tips 值说明：
     * 对应弹框方式：
     * * dialog.alert() -> 1
     * * dialog.show()  -> 2
     * * dialog.open()  -> 非1、2
     * 10：未知错误，活动太火爆
     * 9：非QQ浏览器提示语；
     * 8：活动已结束
     * 7：QQ浏览器版本过低
     * 0：活动开抢，type == true，成功抢到、false -> 物品被抢空，name -> 物品名称
     * 1：获得拆红包的机会
     * 2：拆红包，type == 1 抽中途牛抵用券、type == 2 抽中 QB、type == 3 谢谢参与、else 未知错误 活动太火爆，QB == true 已经是默认浏览器、 QB == false 需要设默
     */
    var tips = {
        10 : function(){
            html = "<div class='align-middle'>\
                <p style='margin: 60px 0 80px;font-size: 18px;'>活动太火爆了，请稍后再试！</p>\
                <div class='btnBox'>\
                    <a href='javascript:void(0);' class='btn-red' onclick='api.dialog.hide();'><span>确定</span></a>\
                </div>\
            </div>";
            return html
        },
        9 : function(){
            html = "<div class='align-middle'>\
                            <p style='margin-top: 40px;font-size: 18px;padding-bottom: 10px;'>亲，本次活动已经结束</p>\
                            <p style='margin-bottom: 40px;font-size: 18px;'>敬请期待更多QQ浏览器特权活动！</p>\
                            <div class='btnBox'>\
                              <a href='javascript:void(0);' class='btn-red' onclick='api.dialog.hide();'><span>确定</span></a>\
                            </div>\
                          </div>";
            return html
        },
        8 : function(){
            var _url = '';
            if(!isIpad){
                _url = "http://dldir1.qq.com/invc/tt/QQBrowser_Setup_April4.exe";
            }else{
                _url = "https://itunes.apple.com/cn/app/id426097375/";
            }
            html = "<div class='align-middle'>\
                            <p style='margin-top: 40px;font-size: 18px;padding-bottom: 10px;'>亲，用QQ浏览器才能参与本次活动哦~</p>\
                            <p style='margin-bottom: 40px;font-size: 18px;'>现在秒装一个（仅需4M），即可参加。</p>\
                            <div class='btnBox'>\
                              <a href='"+ _url +"' class='btn-auto' onclick='api.dialog.hide();'><span>下载QQ浏览器</span></a>\
                            </div>\
                          </div>";
            return html
        },
        7 : function(){
            var _url = '', _lowHtml;
            var isQBLow = !!(/QQBrowser\/9/i.test(navigator.userAgent));
            if(!isIpad){
                _url = "http://dldir1.qq.com/invc/tt/QQBrowser_Setup_April4.exe";
            }else{
                _url = "https://itunes.apple.com/cn/app/id426097375/";
            }
            if(isQBLow){
                _lowHtml = "<p style='margin-top: 40px;font-size: 18px;padding-bottom: 10px;'>亲，您的QQ浏览器版本不符合</p>\
                            <p style='margin-bottom: 40px;font-size: 18px;'>请下载专用版本，即可参加。</p>\
                            <div class='btnBox'>\
                              <a href='"+ _url +"' class='btn-auto' onclick='api.dialog.hide();'><span>下载专用版QQ浏览器</span></a>\
                            </div>";
            }else{
                _lowHtml = "<p style='margin-top: 40px;font-size: 18px;padding-bottom: 10px;'>亲，您的QQ浏览器版本过低</p>\
                            <p style='margin-bottom: 40px;font-size: 18px;'>升级到最新版本，即可参加。</p>\
                            <div class='btnBox'>\
                              <a href='"+ _url +"' class='btn-auto' onclick='api.dialog.hide();'><span>下载最新版QQ浏览器</span></a>\
                            </div>";
            }
            html = "<div class='align-middle'>\
                            "+ _lowHtml +"\
                          </div>";
            return html
        },
        6 : function(){
            html = "<div class='align-middle'>\
                            <p style='margin-top: 70px; margin-bottom: 12px;'>豪气的QQ浏览器送你一个红包！</p>\
                            <p>上午11：00 和下午16：00 还可以0元抢豪华游等好礼哦~</p>\
                            <a href='javascript:void(0);' class='btn btn-open'>拆</a>\
                          </div>";
            return html
        },
        0 : function(type, name){
            var typeHtml = '', _isHtml = '';
            if(type == 1){
                typeHtml = "<p style='margin-top: 40px;font-size: 18px;'>好手气！恭喜您抢到</p>\
                            <p style='font-size: 24px;padding: 15px 0; margin-bottom: 65px;'>"+ name +"</p>\
                            <div class='btnBox'>\
                              <a href='http://vip.qq.com/my/index.html#address' target='_blank' class='btn-information' onclick='api.dialog.hide()'><span>确认支付0元，并填写信息</span></a> 　 <a href='javascript:void(0);' class='btn-cancel' onclick='api.dialog.hide()'><span>取消</span></a>\
                            </div>";
            }else{
                if(type == 2){
                    _isHtml = "<p style='font-size: 16px; margin-bottom: 45px; text-align: left; padding:0 15px;'>别失望，送您一个红包宽宽心~~</p>\
                            <div class='btnBox'>\
                              <a href='javascript:void(0);' class='btn-red' id='getLucky'><span>领取礼包</span></a> 　 <a href='javascript:void(0);' class='btn-cancel' onclick='api.dialog.hide()'><span>取消</span></a>";
                }else if(type == 3){
                    _isHtml = "<p style='font-size: 16px; margin-bottom: 45px; text-align: left; padding:0 15px;'>红包您也领过了~其他好礼明天在这等着您！</p>\
                            <div class='btnBox'>\
                              <a href='javascript:void(0);' class='btn-red' onclick='api.dialog.hide()'><span>确定</span></a>";
                }
                typeHtml = "<p style='font-size: 16px; margin-top: 40px; text-align: left; padding:0 15px 25px;'>好遗憾，"+ name +" 已被抢购一空了...</p>\
                                "+ _isHtml +"\
                            </div>";
            }
            html = "<div class='align-middle'>"+ typeHtml +"</div>";
            return html
        },
        1 : function(){
            html = "<div class='align-middle'>\
                            <p style='margin-top: 70px;'>豪气的QQ浏览器</p>\
                            <p>给你发了一个红包</p>\
                            <a href='javascript:void(0);' class='btn btn-open'>拆</a>\
                          </div>";
            return html
        },
        2 : function(type, QB){
            var typeHtml = '',QBHtml = '';
            if(type == 1){
                typeHtml = "<p style='margin-top: 115px;font-size: 18px;'>恭喜你抽中</p>\
                            <p style='font-size: 24px;padding: 15px 0;'>途牛抵用券30元</p>\
                            <p style='margin-bottom: 25px;'>已放进 <a class='auto' href='http://vip.qq.com/my/gift.html' target='_blank'>我的钱包</a></p>";
            } else if(type == 2){
                typeHtml = "<p style='margin-top: 115px;font-size: 18px;'>恭喜你抽中</p>\
                            <p style='font-size: 24px;padding: 15px 0;'>1Q币</p>\
                            <p style='margin-bottom: 25px;'>已放进 <a class='auto' href='http://my.pay.qq.com/account/index.shtml?aid=pay.index.header.acct' target='_blank'>我的账户</a></p>";
            } else if(type == 3){
                typeHtml = "<p style='margin-top: 120px;'>非常遗憾，您没有抽中</p>\
                            <p style='margin-bottom: 50px;'>不要气馁，还有更多大奖等你来拿！</p>"
            }  else if(type == 4){
                typeHtml = "<p style='margin-top: 120px;'>你今天拆红包的机会已经用完了</p>\
                            <p style='margin-bottom: 50px;'>不要气馁，还有更多大奖等你来拿！</p>"
            } else{
                typeHtml = "<p style='padding: 150px 0 60px;'>活动太火爆了，请稍后再试！</p>"
            }
            if(!QB){
                QBHtml = "<a href='javascript:void(0);' class='btn-red' onclick='api.dialog.hide()'><span>关闭</span></a>";
            }else{
                QBHtml = "<a href='javascript:void(0);' class='btn-defaultQB' id='defaultQB'><span>设为默认浏览器</span></a>\
                          <p style='font-size: 12px; color: #999; padding-top: 10px;'>把QQ浏览器设为默认浏览器</p>\
                          <p style='font-size: 12px; color: #999; line-height: 1.3em;'>可以再拆一次红包哟~</p>";
            }
            html = "<div class='align-middle'>\
                            "+ typeHtml + QBHtml +"\
                          </div>";
            return html
        },
        3 : function(type){
            if(type){
                html = "<div class='align-middle'>\
                            <p style='margin-top: 45px;margin-bottom: 55px; font-size: 16px;'>设置默认浏览器的操作被拦截了</p>\
                            <a href='http://browser.qq.com/help_v7/faq6.html' target='_blank' class='btn-red' onclick='api.dialog.open(api.tips[3](false));'><span>查看解决方法</span></a> 　 <a href='javascript:void(0);' class='btn-cancel' onclick='api.dialog.hide()'><span>不再提示</span></a>\
                          </div>";
            }else{
                html = "<div class='align-middle'>\
                            <p style='margin-top: 45px;margin-bottom: 55px; font-size: 16px;'>设置默认浏览器的操作被拦截了</p>\
                            <a href='javascript:void(0);' class='btn-red' id='defaultQB' onclick='api.dialog.hide()'><span>再试一次</span></a> 　 <a href='javascript:void(0);' class='btn-cancel' onclick='api.dialog.hide()'><span>下次再说</span></a>\
                          </div>";
            }

            return html
        }
    };
    var isQQBrowser = !!(/QQBrowser/i.test(navigator.userAgent));
    var isIpad = (window.navigator.platform.toLowerCase().indexOf("ipad") > -1);
    var isQQIpad  =  isQQBrowser &&  isIpad;

    var isQQIE = (window.external && window.external.extension && /QQBrowser/i.test(navigator.userAgent)) ? true : false;
    var isQQCT = (window.getExtension && /Chrome.*QQBrowser/i.test(navigator.userAgent)) ? true : false;

    var getPCGuid = function(cb){
        if (isQQIE) {
            try {
                var guid = window.external.getGuid();
                guid ? cb(0, guid.split('-').join('')) : cb(-1);
            }catch(e){
                cb(-5);
            }
        }
        else if (isQQCT) {
            var web_page_extension_id = '{A3C609B3-3E61-4508-8953-117B7286068B}';
            var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';
            var extension;
            try {
                extension = window.getExtension(web_page_extension_id);
                extension.sendMessage(platform_extension_id, {serviceId: "hardware.getGuid", args: []}, function (data) {
                    data[0] ? cb(0, data[0].split('-').join('')) : cb(-2);
                });
            }catch(e){
                cb(-3);
            }
        }
        else{
            cb(-4);
        }
    };

    //return （-1）: 不是QQ浏览器
    //       （-2）: QQ浏览器版本太低
    //       （0,true）: QQ浏览器是默认浏览器
    //       （0,false）: QQ浏览器不是默认浏览器
    var isQBDefault = function(cb){
        if (isQQIE) {
            try {
                window.external.extension.nativeApi.isQQBrowserDefaultBrowser(function(ret){
                    cb(0, ret);
                });
            }catch(e){
                cb(-2);
            }
        }
        else if (isQQCT) {
            var web_page_extension_id = '{A3C609B3-3E61-4508-8953-117B7286068B}';
            var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';
            var extension;
            try {
                extension = window.getExtension(web_page_extension_id);
                extension.sendMessage(platform_extension_id, {serviceId: "nativeApi.isQQBrowserDefaultBrowser", args: []}, function (ret) {
                    cb(0, ret[0]);
                });
            }catch(e){
                cb(-2);
            }
        }
        else{
            cb(-1);
        }
    };

    var setQBDefault = function(cb){
        if (isQQIE) {
            try {
                window.external.extension.nativeApi.setQQBrowserDefaultBrowser(function(ret){
                    cb(0, ret);
                });
            }catch(e){
                cb(-2);
            }
        }
        else if (isQQCT) {
            var web_page_extension_id = '{A3C609B3-3E61-4508-8953-117B7286068B}';
            var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';
            var extension;
            try {
                extension = window.getExtension(web_page_extension_id);
                extension.sendMessage(platform_extension_id, {serviceId: "nativeApi.setQQBrowserDefaultBrowser", args: []}, function (ret) {
                    cb(0, ret[0]);
                });
            }catch(e){
                cb(-2);
            }
        }
        else{
            cb(-1);
        }
    };

    var doIpadLogin = function(cb){
        try{
            x5.exec(function(data){
                if(typeof data === 'object'){
                    if(data.uin && data.qbid){
                        delCookie('uin');
                        if(window.qb && !window.qb.hasIpadLogin){
                            _fillIpadUserInfo(data);
                            window.qb.hasIpadLogin = true;
                        }
                        cb(true, data);
                    }
                    else{
                        cb(false);
                    }
                }
            }, function(err){
                cb(false);
            }, "login", "showLoginPanel",[]);
        }catch(e){
            cb(false);
        }
    };

    var isIpadLogin = function(cb,flag){
        var ver = window.navigator.userAgent.match(/MQQBrowser\/([^\s]+)\s/);
        if(ver && ver[1] && ver[1] >= '4.8') {
            try{
                x5.exec(function(data){
                    if(typeof data === 'object'){
                        if(data.uin && data.qbid){
                            delCookie('uin');
                            if(window.qb && !window.qb.hasIpadLogin){
                                _fillIpadUserInfo(data);
                                window.qb.hasIpadLogin = true;
                            }
                            cb(true, data);
                        }
                        else{
                            cb(false);
                        }
                    }
                }, function(err){
                    cb(false);
                }, "login", "getAccountInfo",[]);
            }catch(e){
                cb(false);
            }    
        }
        else if(flag){
            ensureIpad47Login(cb);
        }    
    };

    var ensureIpadLogin = function(cb){
        isIpadLogin(function(isLogin,data){
            isLogin? cb(true,data) : doIpadLogin(cb);
        });
    };

    var ensureIpad47Login = function(cb){
        try {
            x5.exec(function (data) {
                if (typeof data === 'object') {
                    if (data.uin && data.sid) {
                        var obj = {
                            uin: data.uin,
                            qbid: data.sid,
                            nickname: '' + data.uin,
                            head: "http://q4.qlogo.cn/g?b=qq&nk=" + data.uin + "&s=40"
                        };
                        if (window.qb && !window.qb.hasIpadLogin) {
                            _fillIpadUserInfo(obj);
                            window.qb.hasIpadLogin = true;
                        }
                        cb(true, obj);
                    }
                    else {
                        cb(false);
                    }
                }
            }, function (err) {
                cb(false);
            }, "login", "getSidAndUin", []);
        }catch(e){
            cb(false);
        }
    };

/*
    param 可选
    param : {
        needQB， 是否限制必须PC上必须使用QB，默认true,IPAD上由于接口原因必须使用IAP QQ浏览器
        pc:{minVer}，minVer PC QQ浏览器允许的最低版本，如2959
        ipad:{minVer}，minVer ipad QQ浏览器允许的最低版本，如4.8 默认4.8
    }
 */
    var ensureLogin = function(cb,param){

        var obj = param || {};
        var ver;
        if(!isIpad){
            var needQB = !(obj.needQB===false);
            if(!needQB){
                return zUtil.ensureLogin(cb);
            }

            if(!isQQBrowser){
                return api.dialog.open(api.tips['8'](),true);
            }
            else if(obj.pc && obj.pc.minVer){
                //检查版本是否符合
                try {
                    ver = navigator.userAgent.match(/QQBrowser\/(\d+)\.(\d+)\.(\d+)\.\d+/);
                    if (ver && ver[3] >= obj.pc.minVer) {
                        getPCGuid(function (err) {
                            if (err) return  spi.dialog.open(api.tips['7']());
                            else return zUtil.ensureLogin(cb);
                        });
                    }
                    else {
                        return  api.dialog.open(api.tips['7']());
                    }
                }catch(e){
                    return  api.dialog.open(api.tips['7']());
                }
            }
            else{
                //判断是否能取到GUID
                getPCGuid(function(err){
                    if(err) return  dialog.open(tips['7']());
                    else return zUtil.ensureLogin(cb);
                });
            }
        }

        if(isIpad){
            obj.ipad = obj.ipad || {};
            obj.ipad.minVer = obj.ipad.minVer || '4.8';

            if(!isQQBrowser){
                //提示下载
                return api.dialog.open(api.tips['8']());
            }
            else if(obj.ipad && obj.ipad.minVer){
                //检查版本是否符合
                ver = window.navigator.userAgent.match(/MQQBrowser\/([^\s]+)\s/);
                if(ver && ver[1] && ver[1] >= obj.ipad.minVer){
                    return ensureIpadLogin(cb);
                }
                else if(ver && ver[1] && ver[1] >= '4.7.1'){
                    return ensureIpad47Login(cb);    
                }
                else{
                    return api.dialog.open(api.tips['7']());    
                }
            }
            else{
                return ensureIpadLogin(cb);
            }
        }
    };

    //needQB  默认true ，意味着必须同时获取GUID
    var requestAMS = function(obj,cb){
        var param ={};
        if(obj.needQB === false){
            param.needQB = false;
        }

        ensureLogin(function(err, data){ //只有ipad会返回 所以不需要用ua判断平台
            var _url = "http://festival.browser.qq.com/valentineOperation?";
            if(data && data.qbid){ //ipad need sid, not need guid
                obj.sid = data.qbid;
                qq.login.logout();
                if(obj.needQB === false){
                    zHttp.send(obj,cb);    
                }
                else{
                    zHttp.send(_url+ $.param(obj),cb);    
                }
            }
            else{ //pc
                if(obj.needQB === false){
                    zHttp.send(obj,cb);
                }
                else{
                    getPCGuid(function(err,guid){ //error不需要验证，ensureLogin里面确认过了
                        obj.guid = guid;
                        zHttp.send(_url+ $.param(obj),cb);
                    });
                }
            }
        },param);
    };

    function delCookie(name) {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = name + "=; expire=" + date.toGMTString() + "; path=/;domain=.qq.com";
    }

    //基本参数、常量
    var COOKIE_INIT_ARG = {domain:'vip.qq.com',path:'/',expires:24*60*60};
    var m_temp = {
        notLogin: '登录才能0元抢，请<a href="#" class="bt_login">登录</a>',
       isLogin: '<a href="#" id="myGift" onclick="page.queryGift()">抢购记录</a><span class="user_pic"><img src="{avatar}" width="30" height="30" ></span><span class="user_nick" title="欢迎">{nick}</span><a class="mod_st_logout" href="#" title="注销">【注销】</a>'
    };

    //填充用户信息
    var _fillUserInfo = function(nick, uin){
        var _arHtml = [];
        var _data = {};
        if(nick){
            _data.nick = qv.string.encodeHTML(nick);
        }
        if(uin){
            _data.avatar = "http://q4.qlogo.cn/g?b=qq&nk=" + uin + "&s=40";
        }
        if(!qq.login.getUin()){
            _arHtml.push(m_temp.notLogin);
        }else{
            _arHtml.push(qv.string.format(m_temp.isLogin, _data));
        }
        $('#navUserInfo').html(_arHtml.join(''));
        //登录
        $('.bt_login').click(function(e) {
            e.preventDefault();
            qq.login.open(null, {appid: 8000201});
        });

        //退出
        $('.mod_st_logout').click(function(e) {
            e.preventDefault();
            qq.login.logout();
        });
        qq.login.trigger('navrendered');

    };

    var _fillIpadUserInfo = function(data){
        var _arHtml = [];
        if(!data){
            _arHtml.push(m_temp.notLogin);
        }else{
            var _data = {};
            _data.nick      = qv.string.encodeHTML(data.nickname);
            _data.avatar    = data.head;
            _arHtml.push(qv.string.format(m_temp.isLogin, _data));
        }

        $('#navUserInfo').html(_arHtml.join(''));
        //登录
        $('.bt_login').click(function(e) {
            e.preventDefault();
            ensureLogin(function(){});
        });

        //退出
        $('.mod_st_logout').click(function(e) {
            e.preventDefault();
            window.qb.hasIpadLogin = false;
            _fillIpadUserInfo();
        });
        //qq.login.trigger('navrendered');
    };

    //设置登录
    var _setLogin = function(){
        qq.login.init({
            loginMaskShow  : true,
            loginMaskStyle : {'z-index' : 1000},
            loginUIStyle   : {'z-index' : 1001},
            event: {
                login: function() { return false; },
                logout: function() { return false; }
            }
        });

        if(isIpad){
            _fillIpadUserInfo();
            isIpadLogin(function(isLogin,data){ //isIpadLogin 若登录自动填充信息    
            });
            return;
        }

        qq.login.bind('login', function() {
            var _uin = qv.cookie.get('_uin');
            var _nick = qv.cookie.get('_nick');

            if (_uin == qq.login.getUin() && _nick) {
                _fillUserInfo(_nick, _uin);
            } else {
                var options = {
                    url: 'http://pf.vip.qq.com/common/yii.php',
                    dataType: 'jsonp',
                    data: {
                        r: 'user/info',
                        g_tk: qq.security.getCSRFToken()
                    },
                    success: function(data, textStatus, jqXHR) {
                        qv.cookie.set('_uin', qq.login.getUin(), COOKIE_INIT_ARG);
                        qv.cookie.set('_nick', data.nickname, COOKIE_INIT_ARG);

                        _fillUserInfo(data.nickname, qq.login.getUin());
                        if(data.nickname === undefined){
                            qq.login.logout();
                        }
                    }
                };

                $.ajax(options);
            }
        });

        qq.login.bind('logout', function() {
            qv.cookie.clear('_uin');
            qv.cookie.clear('_nick');
            if(!isQQIpad) {
                location.href = location.href;
            }
        });

        if (qq.login.getUin()) {
            qq.login.trigger('login');
        }else{
            _fillUserInfo();
        }
    };

    function clickReport(hottagValue) {
        if(typeof(pgvSendClick) == 'function') {
            pgvSendClick({hottag: hottagValue});
        }
    }
    function pvReport() {
        if (typeof(pgvMain) == 'function') {
            pgvMain("pathtrace", {pathStart: true, tagParamName: "ADTAG", useRefUrl: true, override: true, careSameDomainRef: false});
        }
    }

    var getRealUin = function(str){
        if(/(\d+)/.test(str)){
            return parseInt(RegExp.$1,10);
        }
        else{
            return 0;
        }
    };

    var getAvatarUrl = function(uin, size){
        var _uin = uin;
        var _size = size ? size : 100;
        if(typeof uin === 'string'){
            _uin = getRealUin(uin);
        }
        return "http://q4.qlogo.cn/g?b=qq&nk="+ _uin + "&s=" + _size;
    };

    var dialog = {
        id : 0,
        store: [],

        init : function(keepBefore, msg, Css){
            var popWrap, popBox, popClose, popBg;
            var ObjCss = Css || '';
            var id = '' + new Date().getTime();
            if(!keepBefore && this.store.length!==0){
                for(var i=0; i<this.store.length; i++){
                    this.hide(this.store[i]);
                }
                 this.store = [id];
            }
            else{
                this.store.push(id);
            }
            popBg = document.createElement('div');
            popBg.id = "popBg_" + id;
            popBg.className = "popBg";
            document.body.appendChild(popBg);

            popBox = document.createElement('div');
            popBox.className = 'popMsg ' + ObjCss;
            popBox.id = 'popMsg_'+id;
            document.body.appendChild(popBox);

            var content = msg || '';
            popBox.innerHTML = '<div class="popWrap"><a href="javascript:void(0);" class="popClose" onclick="api.dialog.hide()"></a><div class="popContainer">'+ content +'</div></div>';
            popBox.style.marginTop = popBox.offsetHeight/-2 +'px';
        },
        alert : function(msg, flag){
            this.init(flag, msg,"popNoOpen");
        },
        show : function(msg, flag){
            this.init(flag, msg,"popOpen");
        },
        open : function(msg, flag){
            this.init(flag, msg);
        },
        hide : function(id){
            if(!id){
                id = this.store.pop();
            }
            document.body.removeChild(document.getElementById("popBg_" + id));
            document.body.removeChild(document.getElementById('popMsg_'+id));
        }
    };
    var getRandomNum = function(num){ //获得0-num(num小于60)之间的随机数
      return new Date().getSeconds() % (num+1);
    };
    var getWebsiteUrl = function(){
        return "http://event.browser.qq.com/stdl/high/index.html";
    };

    //分享组件
    var shareFunc = function(type,url){
        clickReport('BROWSER.ACTIVITY.YURENJIE.'+type);
        var shareObj={
            qzone: function(a) {
                var b = {
                    url: a.url,
                    showcount: "1",
                    desc: a.description || "",
                    summary: a.description || "",
                    title: a.title,
                    pics: a.pic || null,
                    style: "203",
                    width: 98,
                    height: 22
                };
                var s = [];
                for(var i in b){
                    s.push(i + '=' + encodeURIComponent(b[i]||''));
                }
                return "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + s.join('&');
            },
            tencent: function(a) {
                var b = {
                    title: a.description || "",
                    url: a.url,
                    pic: a.pic
                };
                var s = [];
                for(var i in b){
                    s.push(i + '=' + encodeURIComponent(b[i]||''));
                }
                return "http://share.v.t.qq.com/index.php?c=share&a=index&" + s.join('&');
            },
            renren: function(a) {
                var b = {
                    resourceUrl: a.url,
                    srcUrl:a.url,
                    pic: a.pic || null,
                    description: a.description
                };
                var s = [];
                for(var i in b){
                    s.push(i + '=' + encodeURIComponent(b[i]||''));
                }
                return "http://widget.renren.com/dialog/share?" + s.join('&');
            },
            sina: function(a) {
                var b = {
                    title: a.description,
                    frefer: a.url,
                    url: a.url,
                    pic: a.pic||null
                };
                var s = [];
                for(var i in b){
                    s.push(i + '=' + encodeURIComponent(b[i]||''));
                }
                return "http://service.weibo.com/share/share.php?uid=1&" + s.join('&');
            },
            qq: function(a){
                return "http://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent(a.url)
                    +"&desc="+encodeURIComponent(a.description)
                    +"&pics="+encodeURIComponent(a.pic)
                    +"&summary="+encodeURIComponent(a.description)
                    +"&title="+encodeURIComponent(a.title)
                    +"&flash=&site=QB&style=100&width=98&height=22";
            }
        };
        var wording = [{
            url: getWebsiteUrl()+"?ADTAG="+type,
            pic: "http://stdl.qq.com/stdl/temp/yurenjie_share.png",
            title: "#QQ浏览器#愚人节不愚人哦~还不快来抢",
            description: "0元买不了吃亏，0元买不了上当！休闲泰国游，追星韩国游、任性云南游、文艺厦门游，还有Rayban墨镜，iPhone镜头……全部0元！！#QQ浏览器#愚人节不愚人哦~还不快来抢！"
        },
        {
            url: getWebsiteUrl()+"?ADTAG="+type,
            pic: "http://stdl.qq.com/stdl/temp/yurenjie_share.png",
            title: "任性，愚人节玩儿真的！有钱，豪华游0元送！",
            description: "任性，愚人节玩儿真的！有钱，豪华游0元送！泰国游，韩国游、云南游、三亚游，还有Rayban墨镜、iPhone镜头、水下相机、5万涨途牛券，也都0元哦~还不来抢？你任性，#QQ浏览器#买单！"
        }];

        var index = new Date().getTime()%2;
        url ? wording[index].url = url : null;

        if(isQQIpad) {
            var ver = window.navigator.userAgent.match(/MQQBrowser\/([^\s]+)\s/);
            if(ver && ver[1] && ver[1] >= '4.8') { //x5分享接口是4.8才引入的
                var to_app = {
                    'sina': "11",
                    'tencent': "2",
                    'qzone': "3",
                    'qq': "4"
                };
                var obj = {
                    url: wording[index].url,
                    title: wording[index].description,
                    img_url: wording[index].pic,
                    to_app: to_app[type]
                };
                x5.exec(function (data) {
                }, function (err) {
                }, "app", "share", [obj]);
            }
            else{
                window.open(shareObj[type](wording[index]));
            }
        }
        else{
            window.open(shareObj[type](wording[index]));
        }
    };

    //微信弹框
    function weixinPop(url){
        var _image;
        if(url){
            _image = '<img src="http://qr.liantu.com/api.php?w=240&m=0&text='+encodeURIComponent(url)+'">';
        }
        else{
            _image = '<img src="http://stdl.qq.com/stdl/temp/lover_share.png">';
        }
        var _html = '<p style="text-align: center; z-index:10001; position: relative; top: -35px">' + _image + '</p><p style="font-size: 20px;text-align: center;">微信扫一扫</p>';
        //dialog({body:_html});
    }

    W.api = {
        initHeader      : _setLogin,
        clickReport     : clickReport,
        pvReport        : pvReport,
        isQQBrowser     : isQQBrowser,
        tips            : tips,
        getAvatarUrl    : getAvatarUrl,
        getRealUin      : getRealUin,
        dialog          : dialog,
        getRandomNum    : getRandomNum,
        share           : shareFunc,
        weixinPop       : weixinPop,
        requestAMS      : requestAMS,
        ensureLogin     : ensureLogin,
        isQBDefault     : isQBDefault,
        setQBDefault    : setQBDefault,
        isQQIpad        : isQQIpad,
        isIpadLogin     : isIpadLogin,
        delCookie       : delCookie
    };
})(window, jQuery);


(function(){
        var x5 = {
            commandQueue:[],
            commandQueueFlushing:false,
            resources: {
                base: !0
            }
        };

        x5.callbackId = 0;
        x5.callbacks = {};
        x5.callbackStatus = {
            NO_RESULT:0,
            OK:1,
            CLASS_NOT_FOUND_EXCEPTION:2,
            ILLEGAL_ACCESS_EXCEPTION:3,
            INSTANTIATION_EXCEPTION:4,
            MALFORMED_URL_EXCEPTION:5,
            IO_EXCEPTION:6,
            INVALID_ACTION:7,
            JSON_EXCEPTION:8,
            ERROR:9
        };

        x5.createBridge = function () {
            var bridge = document.createElement("iframe");
            bridge.setAttribute("style", "display:none;");
            bridge.setAttribute("height", "0px");
            bridge.setAttribute("width", "0px");
            bridge.setAttribute("frameborder", "0");
            document.documentElement.appendChild(bridge);
            return bridge;
        };

        x5.exec = function (successCallback, errorCallback, service, action, options) {

            var callbackId = null;
            var command = {
                className:service,
                methodName:action,
                options:{},
                arguments:[]
            };

            if (successCallback || errorCallback) {
                callbackId = service + x5.callbackId++;
                x5.callbacks[callbackId] = {
                    success:successCallback,
                    fail:errorCallback
                };
            }

            if (callbackId != null) {
                command.arguments.push(callbackId);
            }

            for (var i = 0; i < options.length; ++i) {
                var arg = options[i];
                if (arg == undefined || arg == null) {
                    continue;
                } else if (typeof(arg) == 'object') {
                    command.options = arg;
                } else {
                    command.arguments.push(arg);
                }
            }

            x5.commandQueue.push(JSON.stringify(command));
            if (x5.commandQueue.length == 1 && !x5.commandQueueFlushing) {
                if (!x5.bridge) {
                    x5.bridge = x5.createBridge();
                }
                x5.bridge.src = "mtt:" + service + ":" + action;
            }
        };

        // 浏览器调用接口
        x5.getAndClearQueuedCommands = function () {
            var json = JSON.stringify(x5.commandQueue);
            x5.commandQueue = [];
            return json;
        };

        // 浏览器执行成功的回调函数
        x5.callbackSuccess = function (callbackId, args) {
            if (x5.callbacks[callbackId]) {
                if (args.status === x5.callbackStatus.OK) {
                    try {
                        if (x5.callbacks[callbackId].success) {
                            x5.callbacks[callbackId].success(args.message);
                        }
                    } catch (e) {
                        console.log("Error in success callback: " + callbackId + " = " + e);
                    }
                }
                if (!args.keepCallback) {
                    delete x5.callbacks[callbackId];
                }
            }
        };

        // 浏览器执行失败的回调函数
        x5.callbackError = function (callbackId, args) {
            if (x5.callbacks[callbackId]) {
                try {
                    if (x5.callbacks[callbackId].fail) {
                        x5.callbacks[callbackId].fail(args.message);
                    }
                } catch (e) {
                    console.log("Error in error callback: " + callbackId + " = " + e);
                }
                if (!args.keepCallback) {
                    delete x5.callbacks[callbackId];
                }
            }
        };
        window.x5 = x5;
    }
)();
