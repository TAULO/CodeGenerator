var apps4cashback = Backbone.Model.extend({
    models: ["user", "merchants", "offers", "tabs"],
    history: [],

    defaults: {
        "merchants": new Merchants(),
        "offers": new Offers(),
        "user": new User(),
        "tabs": new Tabs(),
        "currentMerchant": null,
        "currentPopupTab": 'stores',
        "visitedMerchants": []
    },

    initialize: function () {
        var self = this;
        //-- initialize jQuery specific options
        $.support.cors = true;
        self.initPopup();
        self.onInstalledAndDelete();
        Button.standard();

        _.extend(this, _.object(
            _.map(self.models,
                function (name) {
                    return [name, self.attributes[name]];
                }
            )
        ));

        self.merchants.listenTo(self.user, "change:viewed", function (model, value) {
            console.log('change:viewed');
            self.merchants.setViewed(value);
        });
        self.merchants.listenTo(self.user, "change:favorites", function (model, value) {
            console.log('change:favorites');
            self.merchants.setFavorites(value);
        });
        self.merchants.listenTo(self.user, "change:recommended", function (model, value) {
            console.log('change:recommended');
            self.merchants.setRecommended(value);
        });
        self.merchants.listenTo(self.user, "change:rates", function (model, value) {
            console.log('change:rates');
            self.merchants.setPersonalCashback(value);
        });
        self.merchants.listenTo(self.user, "change:token", function (model, value) {
            if (!self.user.isLogin())
                console.log('change:token');
            self.merchants.resetAll();
        });
        self.merchants.listenTo(self.user.get("rates"), "reset", function (collection) {
            self.merchants.setPersonalCashback(collection.toJSON());
        });
        self.user.listenTo(self.merchants, "reset", function (collection) {
            if (self.user.isLogin()) {
                collection.setViewed(self.user.get("viewed"));
                collection.setRecommended(self.user.get("recommended"));
                collection.setFavorites(self.user.get("favorites"));
                if (self.user.get("rates")) {
                    collection.setPersonalCashback(self.user.get("rates").toJSON());
                }
            }
        });
        self.listenTo(self.tabs, 'change:url', self.initializeInterstitialPageActivationHandler);
        self.on(CASHBACK_ACTIVATE, self.activateFromPopup); // is used in store card

        self.requestPeriodicData('offers');
        self.requestPeriodicData('merchants');
        self.requestNotificationPermissions();
        self.usersNotifyHandler();

        self.initializeNotificationHandler();
        self.initializeParamsHandler();
        self.initializeCookieHandler();
        self.initializeIconAnimation();
        self.initializeGoogleAnalyticsHandler();

        _.delay(function () {
            Storage.get(POPUP_FIRST_OPENING_TOKEN, function (token) {
                if (!token && !self.user.isLogin()) {
                    Button.setBadge("!");
                }
            });
        }, 4000);

        setInterval(_.bind(function () {
            self.periodicPushViewedMerchant(self.get('visitedMerchants'), API.visitedMerchants());
            self.set('visitedMerchants', []);
        }, self), PERIODIC_SHOP_VIEWED);

        setInterval(_.bind(function () {
            self.merchants.setPersonalCashback(self.user.rates.toJSON())
        }, self), 1000*2);
    },

    /*GET OFFERS TOGETHER WITH MERCHANT INFO*/

    getPreparedOffers: function () {
        var self = this;
        var topOffer = self.offers.getTopOffer();
        var offers = self.offers.getNoTopOffers();
        console.log(topOffer,offers);
        if ((topOffer && (topOffer.length > 0 || Object.keys(topOffer).length > 0)) || (offers && offers.length > 0)) {
            return _.object(
                [
                    "specialOffer",
                    "offers"
                ],
                [
                    _.extend(
                        topOffer.toJSON(),
                        self.merchants.getInfoForOffer(topOffer.get("shopId"))),
                    _.map(
                        offers,
                        function (offer, index, arr) {
                            return _.extend(
                                offer.toJSON(),
                                self.merchants.getInfoForOffer(offer.get("shopId"))
                            )
                        }
                    )
                ]
            )
        } else {
            return null;
        }
    },

    /*WHEN ACTIVATE FROM POPUP*/

    activateFromPopup: function (merchantId, callback) {
        var self = this;
        var merchant = self.merchants.selectById(merchantId);
        if (merchant) {
            var tab = self.tabs.selectById();
            if (tab && (new RegExp(tab.get("domain")).test(merchant.get("pattern")))) {
                // Client's deep linking
                /*tab && tab.set('deepLink', tab.get("url"));
                 var aliasDomain = merchant.get("domain");*/
                if (self.user.isLogin()) {
                    /*merchant && merchant.trigger(CASHBACK_ACTIVATE);*/
                    framework.browser.navigate({
                            tabId: tab.id,
                            // back-end's deep linking (parametr)
                            url: API.root() + merchant.get("activateUrl") + PARAMETER_DEEP_LINK + '&utm_source=extension&utm_content=partner_info&utm_campaing=' + framework.browser.name.toLowerCase() + '&' + encodeURIComponent(tab.get("url"))
                        }
                    );
                } else {
                    /* tab && tab.set('merchantToNavigateAfterLogin', aliasDomain);*/
                    framework.browser.navigate({
                            tabId: tab.id,
                            url: API.root() + merchant.get("url") + PARAMETER_DEEP_LINK + '&utm_source=extension&utm_content=partner_info&utm_campaing=' + framework.browser.name.toLowerCase() + '&' + encodeURIComponent(tab.get("url"))
                        }
                    );
                }
            } else {
                if (self.user.isLogin()) {
                    //merchant && merchant.trigger(CASHBACK_ACTIVATE);
                    framework.browser.navigate({
                            tabId: framework.browser.NEWTAB,
                            url: API.root() + merchant.get("activateUrl")
                        }
                    );
                } else {
                    var browser = framework.browser.name.toLowerCase();
                    framework.browser.navigate({
                            tabId: framework.browser.NEWTAB,
                            url: API.root() + merchant.get("url") + '?auth=1&utm_source=extension&utm_content=popup_login&utm_campaing=' + browser
                        }
                    );
                }
            }
            callback && callback();
        }
    },

    /*MAIN HANDLERS*/

    initializeNotificationHandler: function () {
        var self = this;
        framework.extension.attachEvent(NOTIFICATION_DISMISS, function (event, callback) {
            if (event.data) {
                var merchant = self.merchants.selectById(event.data);
                merchant && merchant.trigger(MERCHANT_SUPPRESSED);
                callback && callback();
            }
        });
        framework.extension.attachEvent(NOTIFICATION_CASHBACK_ACTIVATE, function (event, callback) {
            if (event.data) {
                var merchant;
                if (event.data && event.data.merchantId) merchant = self.merchants.selectById(event.data.merchantId);
                else merchant = self.merchants.selectByDomain(Utils.getDomain(event.url));
                framework.extension.fireEvent(CLOSE_ALL_NOTIFICATION, {
                    tabId: framework.browser.ALLTABS,
                    data: merchant.toJSON()
                });
                if (merchant) {
                    var tab = self.tabs.selectById(event.tabId);
                    // Client's deep linking
                    /*tab && tab.set('deepLink', event.url);
                     var aliasDomain = merchant.get("domain");*/
                    Storage.get(LOGIN_TOKEN, function (token) {
                        if (!token) {
                            /*tab && tab.set('merchantToNavigateAfterLogin', aliasDomain);*/
                        } else {
                            /*merchant && merchant.trigger(CASHBACK_ACTIVATE);*/
                        }
                    });
                }
            }
        });
        framework.extension.attachEvent(NOTIFICATION_GET_INFO, _.bind(self.globalPageHandler, self));
        framework.browser.attachEvent(framework.browser.DOCUMENTCOMPLETE, _.bind(self.globalPageHandler, self));
        framework.browser.attachEvent(framework.browser.TABCHANGED, _.bind(self.globalPageHandler, self));

        //framework.extension.attachEvent(USER_NOTIFY_GET_INFO, _.bind(self.usersNotifyHandler, self));
        framework.extension.attachEvent(USER_NOTIFICATION_DISMISS, _.bind(self.usersNotifyDismiss, self));
        framework.extension.attachEvent(UPDATE_FAVORITE_STATUS_FROM_NOTIFICATION, _.bind(self.onFavoriteClick, self));
        framework.extension.attachEvent(ANIMATE_ICON, _.bind(self.animateIcon, self));
        framework.extension.attachEvent(SEND_GA_CID, _.bind(self.writeGoogleAnalyticsCID, self));
        framework.extension.attachEvent(SEND_ACTIVATION_DATA, _.bind(self.sendActivationData, self));
        framework.extension.attachEvent(SAW_REWRITE, _.bind(self.unRewrite, self));
        framework.extension.attachEvent(BUTTON_UPDATE, _.bind(function () {
            var self = this,
                merchant = self.get('currentMerchant') ? self.merchants.selectById(self.get('currentMerchant')) : false;
            if (!merchant) {
                Button.standard();
            } else if (merchant.get('isActivated')) {
                Button.green();
            } else {
                Button.red();
            }
        }, self));
    },

    globalPageHandler: function (event, callback) {
        var self = this;
        var domain = Utils.getDomain(event.url);
        var tab = self.tabs.selectById(event.tabId);
        var merchant = domain && self.merchants.selectByDomain(domain);
        if (merchant && self.tabs.currentTabId == event.tabId) {
            self.set("currentMerchant", merchant.id);
            var _visitedMerchant = self.get('visitedMerchants');
            if (!_.findWhere(_visitedMerchant, {shop_id: merchant.id})) {
                _visitedMerchant.push({
                    shop_id: merchant.id,
                    date: new Date().toISOString()
                });
                self.set('visitedMerchants', _visitedMerchant);
            }
            if (merchant && merchant.get("settings").browserAction && self.tabs.currentTabId == tab.id)
                if (merchant.get("isActivated")) {
                    Button.green()
                } else if (merchant.get('animated') !== 'red' && !tab.get('animation')) {
                    merchant.set('animated', 'red');
                    tab.set('animation', true);
                    _.delay(function () {
                        tab.set('animation', false)
                    }, 1500);
                    framework.extension.fireEvent(ANIMATE_ICON, {tabId: null});
                } else {
                    Button.red();
                }
            else if (merchant && self.tabs.currentTabId == tab.id) Button.standard();
        } else {
            self.set("currentMerchant", null);
            if (tab && self.tabs.currentTabId == tab.id)
                Button.standard();
        }
        var tabState = tab.get('state');
        var interstitialPageId = tab.get('interstitialPageId');
        if (event.name == framework.browser.DOCUMENTCOMPLETE && !INTERSTITIAL_PAGE_REG_EXP.test(event.url)) {
            tab.immediateReset();
        }
        if (!merchant || !tab || !domain) return;
        // Client's deep linking (now performs on server)
        /*if (tab.has("deepLink")) {
         var deepLink = tab.get("deepLink");
         tab.unset("deepLink");
         framework.browser.navigate({
         tabId: event.tabId,
         url: deepLink
         }
         );
         return;
         }*/

        if (!(TAB_STATE_INTERSTITIAL_REDIRECT === (tabState & TAB_STATE_INTERSTITIAL_REDIRECT))
            && (TAB_STATE_3RD_PARTY === (tabState & TAB_STATE_3RD_PARTY ))) {
            merchant.trigger(MERCHANT_SUPPRESSED);
        }
        else if (TAB_STATE_INTERSTITIAL_REDIRECT === (tabState & TAB_STATE_INTERSTITIAL_REDIRECT)) {
            if (self.user.isLogin() && (merchant.id == interstitialPageId || _.contains(merchant.get('promo'), parseInt(interstitialPageId)))) {
                merchant.trigger(CASHBACK_ACTIVATE);  // if after certain interstitial page we are visiting this merchant than activation !
                framework.extension.fireEvent(SAVE_PARAMS, {tabId: null, data: {url: tab.get('url')}});
            }
            if (merchant && merchant.get("settings").browserAction && self.tabs.currentTabId == tab.id) {
                if (!tab.get('animation')) {
                    if (merchant.get("isActivated")) {
                        tab.set('animation', true);
                        _.delay(function () {
                            tab.set('animation', false)
                        }, 1500);
                        framework.extension.fireEvent(ANIMATE_ICON, {tabId: null});
                    } else {
                        Button.red();
                    }
                }
            }
        }
        var promo = merchant.get("hasPromoActivated") ? self.offers.get(+merchant.get("hasPromoActivated")) : null;
        callback && callback({
                merchant: merchant.toJSON(),
                promo: promo && promo.toJSON(),
                tab: tab
            }
        );
    },

    requestPeriodicData: function (param) {
        this[param].fetch();
        if (this[param].length == 0) {
            var _request = _.bind(this.requestPeriodicData, this);
            _.delay(_request, REQUESTS_PERIOD_IN_CASE_OF_ERROR, param);
        }
    },

    /*INTERSTITIAL PAGE*/

    initializeInterstitialPageActivationHandler: function (tab, url, options) {
        var self = this;
        if (!url) return;
        if (url.indexOf(API.domain) !== -1) {
            if (INTERSTITIAL_PAGE_REG_EXP.test(url)) {
                var id = url.match(/letyshops\.ru\/view\/(\d+)/i)[1];
                if (id) {
                    //framework.extension.fireEvent(ANIMATE_ICON, {tabId: null});
                    var merchant = self.merchants.selectById(id);
                    if (!merchant) {
                        merchant = _.filter(self.merchants.models, _.bind(function (model) {
                            return _.contains(model.get('promo'), parseInt(id))
                        }, self))
                    }
                    if (merchant) {
                        //merchant.unset('savedCookie');
                        merchant.set('savedCookie', null);
                        tab.set('state', tab.get('state') | TAB_STATE_INTERSTITIAL_REDIRECT);
                        tab.set('interstitialPageId', id); // mark who interstitial page I was visited
                        tab.set('shopId', id);
                        tab.set('interstitialPage', url);
                        merchant.reset && merchant.reset();
                        console.log(merchant);
                        // console.log(merchant);
                        if (merchant && self.user && self.user.isLogin())
                            self.user && self.user.pushViewedMerchant(merchant.id);
                    }
                }
            }
        } else {
            $.each(THIRD_PARTY_LINKS, function (i, link) {
                if (url.indexOf(link) !== -1) {
                    tab.set('state', tab.get('state') | TAB_STATE_3RD_PARTY);
                    return false;
                }
            });
        }
    },

    sendActivationData: function (data) {
        console.warn(data);
        var self = this,
            tab = data.data.tab.cid ? data.data.tab : self.tabs.selectById(data.data.tab.id),
            merchant = data.data.merchant;
        var referer = _.findWhere(tab.get('history'), {url: tab.get('interstitialPage')}),
            activateData = {
                shop_id: tab.get('shopId'),
                interstitial_page: {
                    url: tab.get('interstitialPage'),
                    referer: referer && referer.referer,
                    date: referer && referer.date
                },
                cookies: self.merchants.selectById(merchant.id).get('savedCookie'),
                transitions: _.partition(tab.get('history'), _.bind(function (info) {
                    if (info.date && referer && info.date >= referer.date) {
                        return true
                    } else {
                        return false;
                    }
                }, this))[0]
            };
        self.merchants.selectById(merchant.id).activationLog = activateData;
        // $.post(API.logactivate(), activateData);
    },

    /*USER NOTIFY*/

    usersNotifyHandler: function () {
        var self = this;
        if (self.user) {
            var notifications = self.user.get("notifications");
            var filteredNotifications = _.where(notifications, {"status": "1", showed: false});
            if (filteredNotifications && filteredNotifications.length) {
                self.user.set("notifications", _.map(notifications, function (notification) {
                    notification.showed = true;
                    return notification;
                }));
                Storage.get("showed_notifications", function (lastShowedNotifications) {
                    var updatedShowedNotifications;
                    if (lastShowedNotifications || typeof lastShowedNotifications == "string") {
                        lastShowedNotifications = JSON.parse(lastShowedNotifications);
                        filteredNotifications = _.filter(filteredNotifications, function (n) {
                            return !_.contains(lastShowedNotifications, n.id);
                        });
                        updatedShowedNotifications = lastShowedNotifications.concat(_.pluck(filteredNotifications, "id"));
                    } else {
                        updatedShowedNotifications = _.pluck(filteredNotifications, "id");
                    }
                    Storage.set("showed_notifications", JSON.stringify(updatedShowedNotifications));
                    if (filteredNotifications && filteredNotifications.length) {
                        $.each(filteredNotifications, function (i, value) {
                            var notify = self.createNotification(value['markup'].replace(/<\/?[^>]+(>|$)/g, ""), 'images/btn/logo65.png', 'Новое сообщение!');
                            // notify.onclose = _.bind(function(event){
                            //     self.user.pushReviewedNotifications(value.id)
                            // }, this);
                            notify.onclick = _.bind(function () {
                                self.user.pushReviewedNotifications(value.id)
                                notify.close();
                            }, this);
                        });
                        /*callback && callback({
                         notifications: filteredNotifications
                         }

                         );*/
                    }
                });
            }
        }
        setTimeout(function () {
            self.usersNotifyHandler();
        }, USER_NOTIFY_INTERVAL);
    },

    /*DON'T USE*/

    usersNotifyDismiss: function (event, callback) {
        var self = this;
        if (event.data)
            self.user && self.user.pushReviewedNotifications(event.data);
        callback && callback();
    },

    /*INITIALIZE HANDLERS (PARAMS, COOKIE)*/

    initializeParamsHandler: function () {
        var self = this;
        framework.browser.attachEvent(framework.browser.DOCUMENTCOMPLETE, _.bind(self.onParameterResearch, self));
        framework.extension.attachEvent(SAVE_PARAMS, _.bind(self.onParameterSave, self));
        framework.extension.attachEvent(GET_EXTENSION_INFO, function (event) {
            framework.extension.fireEvent(SEND_EXTENSION_INFO, {
                tabId: event.tabId,
                data: {version: framework.extension.version, name: framework.extension.name}
            });
        });
    },

    /*HANDLER OF CHECKING REWRITE COOKIE*/

    initializeCookieHandler: function () {
        var self = this;
        framework.extension.attachEvent(SET_MERCHANT_COOKIES, function (event, callback) {
            if (event.data) {
                var merchant = self.merchants.selectById(event.data.merchantId);
                merchant.set("savedCookie", event.data.cookie);
            }
        });
        framework.extension.attachEvent(CASHBACK_DEACTIVATE, function (event, callback) {
            if (event.data) {
                Button.red();
                var merchant = self.merchants.selectById(event.data.merchantId);
                merchant.reset();
                merchant.set({rewrite: true});
                /*framework.extension.fireEvent(SHOW_NOTIFICATION_BY_FORCE, {
                 tabId: event.tabId,
                 data: {merchant: merchant}
                 });*/
                console.warn(merchant);
                var tab = self.tabs.selectById(event.tabId),
                    _history = JSON.parse(JSON.stringify(merchant.activationLog.transitions.concat(self.history.slice(-5)))),
                    rewriteData = {
                        shop_id: merchant.id,
                        rewrite_type: "cookie",
                        transitions: _history
                    };
                console.warn(rewriteData);
                // $.post(API.logrewrite(), rewriteData);
            }
        });
        framework.extension.attachEvent(CHECK_MERCHANT_COOKIES, function (event, callback) {
            var domain = Utils.getDomain(event.url);
            var merchant = domain && self.merchants.selectByDomain(domain);
            if (merchant && merchant.get("checkCookieParams") && merchant.get("checkCookieParams").length /* && merchant.get("isActivated")*/) {
                callback && callback({merchant: merchant.toJSON()});
            }
        });
        framework.extension.attachEvent(CLEAR_COOKIES, function (event, callback) {
            var domain = Utils.getDomain(event.url);
            var merchant = domain && self.merchants.selectByDomain(domain);
            if (merchant) {
                merchant.set('savedCookie', null);
            }
        });
    },

    /*HANDLER OF CHECKING REWRITE PARAMS*/

    onParameterResearch: function (event) {
        var self = this;
        var url = event.url,
            domain = Utils.getDomain(url),
            merchant = self.merchants.selectByDomain(domain);
        if (merchant && merchant.get("checkUrlParams") && merchant.get("checkUrlParams").length && merchant.get("isActivated")) {
            var checkParamsCollection = merchant.get("checkUrlParams");
            if (merchant.get("savedParams") && merchant.get("savedParams").length > 0) {
                var cashbackParams = merchant.get("savedParams"),
                    flag = false;
                _.each(cashbackParams, function (params) {
                    var rightSetForCheck = _.filter(checkParamsCollection, function (checkParamsSet) {
                        return _.isEqual(_.keys(checkParamsSet), _.keys(params));
                    });
                    var checkedParams = {};
                    _.each(rightSetForCheck[0], function (pattern, paramName) {
                        var paramValue = new RegExp(paramName + "=([^&]+)", "i").exec(url);
                        if (paramValue != null && new RegExp(pattern, "i").test(paramValue[1])) {
                            checkedParams[paramName] = paramValue[1];
                        } else {
                            checkedParams[paramName] = null;
                        }
                        //checkedParams[paramName] = paramValue;
                    });
                    console.log([params, checkedParams]);
                    console.log([_.size(params), _.compact(_.uniq(_.values(checkedParams))).length]);
                    if (JSON.stringify(params) == JSON.stringify(checkedParams) || _.compact(_.uniq(_.values(checkedParams))).length < _.size(params)) {
                        flag = true;
                    }
                });
                if (flag == false) {
                    // deactivate merchant because params were rewritten
                    var tab = self.tabs.selectById(event.tabId),
                        _history = JSON.parse(JSON.stringify(tab.get('history'))),
                        rewriteData = {
                            shop_id: merchant.id,
                            rewrite_type: "get",
                            transitions: _history
                        };
                    // $.post(API.logrewrite(), rewriteData);
                    merchant.reset();
                    merchant.set({rewrite: true});
                    if (self.tabs.currentTabId == event.tabId) {
                        Button.red();
                    }
                }
            } else {
                // var complete = false;
                // _.each(checkParamsCollection, function (checkParamsSet) {
                //     if (complete) return;
                //     var paramValues = _.chain(checkParamsSet)
                //         .map(function (pattern, paramName) {
                //             var paramValue = new RegExp(paramName + "=([^&]+)", "i").exec(url)[1];
                //             if (new RegExp(pattern, "i").test(paramValue)) {
                //                 return [paramName, paramValue];
                //             }
                //             return null;
                //         })
                //         .compact()
                //         .object()
                //         .value();
                //     //if (_.keys(paramValues).length == _.keys(checkParamsSet).length) {
                //     var params = merchant.get('savedParams');
                //     params.push(paramValues);
                //     console.log(params);
                //     console.log(paramValues);
                //     merchant.set("savedParams", params);
                //     complete = true;
                //     //}
                // });
            }
        }
    },

    onParameterSave: function (event) {
        var self = this;
        var url = event.data.url,
            domain = Utils.getDomain(url),
            merchant = self.merchants.selectByDomain(domain);
        // console.log('parameter saved');
        if (merchant && merchant.get("checkUrlParams") && merchant.get("checkUrlParams").length && merchant.get("isActivated")) {
            var checkParamsCollection = merchant.get("checkUrlParams");
            var complete = false;
            _.each(checkParamsCollection, function (checkParamsSet) {
                if (complete) return;
                var paramValues = _.chain(checkParamsSet)
                    .map(function (pattern, paramName) {
                        //try{
                        var paramValue = new RegExp(paramName + "=([^&]+)", "i").exec(url);

                        if (paramValue != null && new RegExp(pattern, "i").test(paramValue[1])) {
                            return [paramName, paramValue[1]];
                        }
                        return [paramName, null];
                        //} catch(err) {

                        //}
                    })
                    .compact()
                    .object()
                    .value();
                //console.log(paramValues);
                //if (_.keys(paramValues).length == _.keys(checkParamsSet).length) {
                var params = merchant.get('savedParams');
                if(!params.push) {
                    params = [];
                }
                // console.log(params, merchant);
                params.push(paramValues);
                console.log('new params', params);
                merchant.set("savedParams", params);
                complete = true;
                //}
            });
        }
    },

    unRewrite: function (data) {
        var self = this,
            merchant = self.merchants.selectById(data.data.id);
        merchant.set({rewrite: false});
        merchant.reset();
        // console.log('reset params');
        merchant.resetSavedParams();
    },

    /*FAVORITE HANDLERS*/

    onFavoriteClick: function (event) {
        //console.log('on favorite click');
        var self = this;
        if (event.data) {
            var id = event.data.id;
            var isFavorite = event.data.isFavorite;
            isFavorite ? self.user.pushDisliked(id) : self.user.pushLiked(id);
            var merchant = self.merchants.selectById(id);
            merchant.set("isFavorite", !isFavorite);
        }
    },

    updateFavoriteStatusInContent: function (data) {
        // console.log('update');
        framework.extension.fireEvent(UPDATE_FAVORITE_STATUS_FROM_BG,
            {
                tabId: framework.browser.ALLTABS,
                data: data
            }
        );
    },

    /*POPUP BEHAVIOR*/

    initPopup: function () {
        var self = this;
        framework.ui.button.setPopup({
            'url': 'popup/popup.html',
            'width': POPUP_WIDTH,
            'height': POPUP_HEIGHT
        });
    },

    onPopupFirstOpening: function () {
        Button.setBadge("");
        Storage.get(POPUP_FIRST_OPENING_TOKEN, function (token) {
            if (!token) {
                Storage.set(POPUP_FIRST_OPENING_TOKEN, "Wow!");
            }
        });
    },

    // ACTIVITIES AFTER INSTALL OR DELETE EXTENSION (chrome)

    onInstalledAndDelete: function () {
        Storage.get('afterInstallPageIsShown', function (afterInstallPageIsShown) {
                if (!afterInstallPageIsShown) {
                    Storage.set('afterInstallPageIsShown', true);
                    //after install
                    _.delay(function () {
                        framework.browser.navigate({
                            tabId: framework.browser.NEWTAB, url: API.afterInstall()
                        })
                    }, 500)
                    //after delete
                    var browser = framework.browser.name;
                    if (browser == BROWSER_NAME_CHROME) {
                        chrome.runtime.setUninstallURL(API.afterDelete());
                    } else if (browser == BROWSER_NAME_FF) {
                        var UninstallObserver = {
                            'onUninstalling': function (ffaddon) {
                                if (ffaddon['id'] == 'letyshops@LetyShops') {
                                    framework.browser.navigate({
                                        tabId: framework.browser.NEWTAB,
                                        url: API.afterDelete()
                                    });
                                }
                            },
                            'register': function () {
                                var observerService = Components['classes']['@mozilla.org/observer-service;1']['getService'](Components['interfaces']['nsIObserverService']);
                                observerService['addObserver'](UninstallObserver, 'quit-application-granted', false);
                                Components['utils']['import']('resource://gre/modules/AddonManager.jsm');
                                AddonManager['addAddonListener'](UninstallObserver);
                            }
                        }
                        UninstallObserver.register();
                    }
                }
            }
        );
    },

    periodicPushViewedMerchant: function (data, url) {
        var self = this;
        //post
        if(data) {
            /*$.ajax({
                    url: url,
                    type: "POST",
                    data: {shops_viewed: data},
                    processData: true,
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status == '400' || jqXHR.statusText == "Bad Request") {
                            framework.extension.log("pushViewedMerchant - Forbidden");
                        }
                    }
                }
            );*/
        }
    },

    // ICON ANIMATION

    ease: function (x) {
        return (1 - Math.sin(Math.PI / 2 + x * Math.PI)) / 2;
    },

    initializeIconAnimation: function () {
        var self = this;
        $(function () {
            $('<canvas/>', {
                id: 'canvas_id',
                width: 19,
                height: 19
            }).appendTo('body');

            $('#canvas_id').attr('width', 19).attr('height', 19);

            $('<img/>', {
                id: 'animate_icon',
                src: 'images/btn/logo19colorful.png'
            }).appendTo('body');

            self.animationFrames = framework.browser.name == 'Safari' ? 1 : 270;
            self.animationSpeed = 1;
            self.canvas = document.getElementById('canvas_id');
            self.animateIco = document.getElementById('animate_icon');
            self.canvasContext = self.canvas.getContext('2d');
            self.rotation = 0;
        });

    },

    animateIcon: function (iconPath) {
        //console.log('animate');
        var self = this;
        iconPath = 'images/btn/logo19colorful.png';
        self.rotation += 1 / self.animationFrames;
        self.drawRotatedIcon();

        if (self.rotation <= 1) {
            setTimeout(function () {
                self.animateIcon(iconPath);
            }, self.animationSpeed);
        } else {
            self.rotation = 0;
            self.firstAnimation = false;
            //Button.standard();
            var merchant = self.get('currentMerchant') ? self.merchants.selectById(self.get('currentMerchant')) : false;
            if (!merchant) {
                Button.standard();
            } else if (merchant && merchant.get('isActivated')) {
                Button.green()
            } else {
                Button.red()
            }
        }
    },

    drawRotatedIcon: function () {
        var self = this;
        self.canvasContext.save();
        self.canvasContext.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.canvasContext.translate(
            Math.ceil(self.canvas.width / 2),
            Math.ceil(self.canvas.height / 2));
        self.canvasContext.rotate(8 * Math.PI * self.ease(self.rotation));
        self.canvasContext.drawImage(self.animateIco,
            -Math.ceil(self.canvas.width / 2),
            -Math.ceil(self.canvas.height / 2));
        self.canvasContext.restore();

        framework.ui.button.setIcon(self.canvas.toDataURL());
    },


    //PUSH notifications

    requestNotificationPermissions: function () {
        Notification.requestPermission();
    },

    createNotification: function (Body, Icon, Title) {
        var options = {
            body: Body,
            icon: Icon
        };
        return new Notification(Title, options);
    },

    //-- google analytics
    initializeGoogleAnalyticsHandler: function () {
        var self = this;
        framework.extension.attachEvent(SEND_GOOGLE_ANALYTICS, function (event) {
            var data = event.data;
            if (data.type == 'pageview') {
                self.sendGoogleAnalyticsPageView(data.page);
            } else if (data.type == 'event') {
                self.sendGoogleAnalyticsEvent(data.category, data.action, data.label, data.value);
            }
        });
    },

    writeGoogleAnalyticsCID: function (event) {
        this.user.set('googleAnalyticsCID', event.data);
    },

    sendGoogleAnalyticsPageView: function (documentPage) {
        //console.log(documentPage + ' visited');
        var self = this,
            options = {
                v: 1,
                tid: googleAnalyticsTID,
                cid: self.user.get('googleAnalyticsCID') || 'anonymous',
                t: 'pageview',
                dp: documentPage,
                cd1: self.user.get('token'),
                cd2: self.user.get('googleAnalyticsCID') || 'anonymous',
                cd4: Date.now()
            };
        if (!options.cd1) {
            delete options['cd1'];
        }
        $.post(googleAnalyticsURLCollect, options);
    },

    sendGoogleAnalyticsEvent: function (category, action, label, value) {
        //console.log(category + ': ' + action + ' has triggered');
        var self = this,
            options = {
                v: 1,
                tid: googleAnalyticsTID,
                cid: self.user.get('googleAnalyticsCID') || 'anonymous',
                t: 'event',
                ec: category,
                ea: action,
                el: label,
                ev: value,
                cd1: self.user.get('token'),
                cd2: self.user.get('googleAnalyticsCID') || 'anonymous',
                cd4: Date.now()
            };
        if (!options.cd1) {
            delete options['cd1'];
        }
        $.post(googleAnalyticsURLCollect, options);
    }
})
