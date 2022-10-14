if (!(typeof window.CocoonJS === 'undefined' || window.CocoonJS === null)) { // BEGIN - CHECK FOR COCOONJS
(function() {
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating the extension types.");
    if (typeof window.CocoonJS.Social === 'undefined' || window.CocoonJS.Social === null) throw("The CocoonJS.Social object must exist and be valid before creating the extension types.");
    /**
     * @class
     * @constructor
     * Represents a type that mimics the original Facebook API with the addition of the possibility to
     * retrieve an abstract high level interface API to handle a SocialGamingService (APIs defined by Ludei).
     */
    CocoonJS.Social.FacebookExtension = function (){
        this.nativeExtensionName = "IDTK_SRV_FACEBOOK";
        this.extensionName = "Social.Facebook";
        this.nativeExtensionObjectAvailable =  CocoonJS.nativeExtensionObjectAvailable && typeof window.ext[this.nativeExtensionName] !== 'undefined';
        this.Event = new CocoonJS.Social.FacebookEvent(this.nativeExtensionObjectAvailable);
        var me = this;
        if (this.nativeExtensionObjectAvailable) {
            this.onFacebookSessionStateChanged = new CocoonJS.EventHandler(this.nativeExtensionName, this.extensionName, "onFacebookSessionStateChanged");
            CocoonJS.Social.Facebook = this; //the object it's being created but the addEventListener needs it now
            this.onFacebookSessionStateChanged.addEventListener(function(session, error) {
                var data = fromCocoonFBSessionToFBAPISession(session,error);
                if (session.state == 0) {
                    me.Event.notify("auth.login", data);
                }
                me.Event.notify("auth.authResponseChange", data);
                me.Event.notify("auth.statusChange", data);
            });
        }
        return this;
    };
    CocoonJS.Social.FacebookExtension.prototype = {
        _currentSession: null,
        _appId: null,
        _socialService: null,

        /**
         * Initialize the SDK with your app ID. This will let you make calls against the Facebook API. All FB.API methods must be called after FB.init.
         * @param {object} options. Check available options here: https://developers.facebook.com/docs/reference/javascript/FB.init/
         */
        init: function(options) {
            if (!options || !options.appId) {
                throw "appId must be specified!";
            }

            this._appId = options.appId;

            if (this.nativeExtensionObjectAvailable) {
                CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "init", [options], true);
            }
            else {
                FB.init(options);
            }

            var me = this;
            this.Event.subscribe("auth.authResponseChange", function(session) {
                me._currentSession = session;
                if (session.authResponse && !session.authResponse.user){
                    me.api("me?fields=username", function(response) {
                        me._currentSession.authResponse.user = response;
                    });
                }
            });
        },

        /**
         * Return a CocoonJS SocialGaming interface for the Facebook Extension
         * You can use the Facebook extension in two ways, with the official SDK API equivalent or with the CocoonJS Social API abstraction
         * @see CocoonJS.Social.SocialGamingService
         * @returns {CocoonJS.Social.SocialGamingService}
         */
        getSocialInterface: function() {

            if (!this._appId) {
                throw "You must call init() before getting the Social Interface";
            }
            if (!this._socialService) {
                this._socialService = new CocoonJS.Social.SocialGamingServiceFacebook(this);
            }
            return this._socialService;
        },

        /**
         * Authenticate the user
         * By default, calling login will attempt to authenticate the user with only the basic permissions.
         * If you want one or more additional permissions, call login with an option object,
         * and set the scope parameter with a comma-separated list of the permissions you wish to request from the user
         * @param {object} login options
         * @params {function} callback The callback function with received session data or error.
         */
        login: function(callback, options) {
            var me = this;
            if (this.nativeExtensionObjectAvailable) {
                CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "login", [options, function(response, error) {
                    me._currentSession = fromCocoonFBSessionToFBAPISession(response,error);
                    if (callback) {
                        callback(me._currentSession);
                    }

                }], true);
            }
            else {
                FB.login(function(response){
                    me._currentSession = response;
                    if (callback)
                        callback(response);
                }, options);
            }

        },

        /**
         * Log the user out of your application
         * You will need to have a valid access token for the user in order to call the function.
         * @param {function} callback called when the user is logged out
         */
        logout: function(callback) {
            if (this.nativeExtensionObjectAvailable) {
                CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "logout", [function(response, error) {
                    if (callback) {
                        callback(fromCocoonFBSessionToFBAPISession(response, error));
                    }

                }],true);
            }
            else {
                FB.logout(function(response){
                    if (callback) {
                        callback(response);
                    }
                });
            }

        },

        /**
         * Synchronous accessor for the current authResponse
         * @returns {object} current Facebook session data
         */
        getAuthResponse: function() {

            if (this.nativeExtensionObjectAvailable) {
                var response = CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "getFacebookSession", []);
                return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "ui", [params, callback], true);
            }
            else if (!navigator.isCocoonJS)
            {
                FB.ui(params,cb);
            }
        },

        /**
         * Allows you to determine if a user is logged in to Facebook and has authenticated your app.
         * There are three possible states for a user:
         * 1. the user is logged into Facebook and has authenticated your application (connected)
         * 2. the user is logged into Facebook but has not authenticated your application (not_authorized)
         * 3. the user is not logged into Facebook at this time and so we don't know if they've authenticated your application or not
         * @param {function} callback The callback function.
         * @param {boolean} force Force reloading the login status (default false).
         */
        getLoginStatus: function(callback, force) {
            if (this.nativeExtensionObjectAvailable) {

                var me = this;
                setTimeout(function(){
                    var response = CocoonJS.makeNativeExtensionObjectFunctionCall(me.nativeExtensionName, "getFacebookSession", []);
                    if (callback) {
                        callback(fromCocoonFBSessionToFBAPISession(response));
                    }

                },50);
            }
            else {
                FB.getLoginStatus(callback, force);
            }

        },
        /**
         * Makes API calls to the Graph API.
         * @param path The Graph API url path
         * @param method the http method (default "GET")
         * @param params the parameters for the query
         * @param cb the callback function to handle the response
         */
        api: function(path, method, params, cb ) {

            if (this.nativeExtensionObjectAvailable) {
                var openGraph = arguments[0];
                var httpMethod = arguments.length > 3 ? arguments[1] : "GET";
                var options = null;
                if (arguments.length == 3) options = arguments[1];
                if (arguments.length == 4) options = arguments[2];
                var callback = arguments.length > 1 ? arguments[arguments.length -1 ] : function(){};

                return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "api", [openGraph, httpMethod, options, callback], true);
            }
            else {
                FB.api(path,method,params,cb);
            }
        },

        /**
         * A generic method for triggering Dialogs which allow the user to take some action.
         * @param params The required arguments vary based on the method being used, but specifying the method itself is mandatory
         * @param cb Callback function to handle the result. Not all methods may have a response.
         */
        ui: function(params, cb) {

            if (this.nativeExtensionObjectAvailable){
                var params = arguments[0];
                var callback = arguments.length > 1 ? arguments[1]: function(){};

                return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "ui", [params, callback], true);
            }
            else if (!navigator.isCocoonJS)
            {
                FB.ui(params,cb);
            }
        },


        /**
         * @param {string} permissionsType "read" or "publish"
         * @param permissions comma separated Facebook permission names
         * @param callback response authResponse callback
         */

        requestAdditionalPermissions: function(permissionsType, permissions, callback) {
            if (this.nativeExtensionObjectAvailable) {

                var permsArray = permissions.split(',');
                CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "requestAdditionalPermissions", [permissionsType, permsArray, function(session, error){
                    if (callback) {
                        callback(fromCocoonFBSessionToFBAPISession(session,error));
                    }
                }], true);
            }
            else {
                FB.login(callback, {scope:permissions});
            }
        },

        /**
         * Query the current user facebook permissions
         * @param callback Handler function which receives a dictionary with the granted permissions
         */
        getPermissions: function(callback) {
            this.api('me/permissions', function(response) {
                callback(response.data && response.data[0] ? response.data[0] : {});
            });
        },

        /**
         * Presents a dialog in the Facebook application that allows the user to share a status update
         * If the Facebook Application is not available it does a fallback to a feed dialog
         * No publish permissions are required.
         * @param params Dialog params (description, caption, name, link, picture)
         * @param callback Handler with response data or error
         */
        showShareDialog: function(params, callback) {
            if (this.nativeExtensionObjectAvailable) {
                CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "showShareDialog", [params, callback], true);
            }
            else {
                params.method = "feed";
                FB.ui(params, callback);
            }
        },

        /**
         * Upload a local image file to Facebook and get response
         * @param file The local file url to submit to Facebook (For example the one capture with screenCapture API)
         * @param callback Handler to process response with the photoid and other data or the error
         */
        uploadPhoto: function(file, callback) {
            if (this.nativeExtensionObjectAvailable) {
                CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "uploadPhoto", [file, callback], true);
            }
            else {
                //TODO
                callback({error: {message: "Not implemented"}});
            }
        },

        /**
         * Shows a native UI component that can be used to pick friends.
         * @param callback Handlerv function. The response contains the boolen 'donePressed' value and an array of selected users in the 'selection' property.
         */
        showFriendPicker: function(callback) {
            if (this.nativeExtensionObjectAvailable) {
                CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "showFriendPicker", [callback], true);
            }
            else {
                //TODO
                callback({error: {message: "Not implemented"}});
            }
        }

    };
    CocoonJS.Social.FacebookEvent = function(nativeAvailable ) {
        this.nativeExtensionObjectAvailable = nativeAvailable;
        return this;
    };
    CocoonJS.Social.FacebookEvent.prototype = {
        /**
         * Global Events to which you can subscribe:
         * auth.login - fired when the auth status changes from unknown to connected
         * auth.authResponseChange - fired when the authResponse changes
         * auth.statusChange - fired when the status changes
         * @param name Name of the event
         * @param callback The handler function
         */
        subscribe: function(name, callback){
            if (this.nativeExtensionObjectAvailable)
            {
                var eventKey = name + 'listeners';
                this[eventKey] = this[eventKey] || [];
                this[eventKey].push(callback);
            }
            else if (!navigator.isCocoonJS)
            {
                FB.Event.subscribe(name,callback);
            }
        },
        /**
         * Removes handlers on events so that it no longer invokes your callback when the event fires.
         * @param name Name of the event.
         * @param callback The handler function.
         */
        unsubscribe: function(name, callback) {
            if (this.nativeExtensionObjectAvailable)
            {
                var eventKey = name + 'listeners';
                var array = this[eventKey];
                if (array) {
                    var index = array.indexOf(callback);
                    if (index !== -1) {
                        array.splice(index,1);
                    }
                }
            }
            else if (!navigator.isCocoonJS)
            {
                FB.Event.unsubscribe(name,callback);
            }
        },
        /**
         * @ignore
         */
        notify: function(name, param) {
            var eventKey = name + 'listeners';
            var array = this[eventKey];
            if (array) {
                for (var i = 0; i< array.length; ++i) {
                    array[i](param);
                }
            }
        }
    };
    CocoonJS.Social.Facebook = new CocoonJS.Social.FacebookExtension();
    /**
     * @ignore
     */
    function fromCocoonFBStatusToFBAPIState(state) {
        if (state === 0) {
            return "connected";
        }
        else if (state === 1) {
            return "not_authorized";
        }
        else {
            return "unknown";
        }
    }
    /**
     * @ignore
     */
    function fromCocoonFBSessionToFBAPISession(response, error) {
        var authResponse = null;
        if (response.state === 0) {
            authResponse = {
                accessToken: response.accessToken,
                expirationDate: response.expirationDate,
                userID: response.user ? response.userID : null,
                permissions: response.permissions,
                user: response.user
            }
        }
        return {
            status: fromCocoonFBStatusToFBAPIState(response.state),
            authResponse: authResponse,
            error: error
        }
    };

    CocoonJS.Social.User = function(userID, userName, userImage)
    {
        this.userID = userID;
        this.userName = userName;
        this.userImage = userImage;

        return this;
    };

    CocoonJS.Social.Score = function(userID, score, userName, imageURL, leaderboardID)
    {
        this.userID = userID;
        this.score = score || 0;
        this.userName = userName;
        this.imageURL = imageURL;
        this.leaderboardID = leaderboardID;

        return this;
    };

    CocoonJS.Social.SocialGamingServiceFacebook = function (fbExtension) {
        this.fb = fbExtension;
        var me = this;
        return this;
    };

    CocoonJS.Social.SocialGamingServiceFacebook.prototype =  {

        currentPermissions: null,

        isLoggedIn: function() {
            return this.fb._currentSession && this.fb._currentSession.status === "connected";
        },
        login : function(callback) {
            var me = this;
            this.fb.login(function(response){
                if (callback)
                    callback(me.isLoggedIn(), response.error);
            });
        },
        logout: function(callback) {
            this.fb.logout(function(response){
                if (callback)
                    callback(response.error);
            });
        },
        getLoggedInUser : function() {
            var authResponse = this.fb._currentSession ? this.fb._currentSession.authResponse : null;
            if (authResponse && authResponse.user) {
                return fromFBUserToCocoonUser(authResponse.user);
            }
            else if (authResponse && authResponse.userID) {
                return new CocoonJS.Social.User(authResponse.userID, "Loading...");
            }
            return null;
        },
        hasPublishPermissions: function(callback) {
            this.fb.getPermissions(function(perms, error){
               callback(perms.publish_actions, error);
            });
        },
        requestPublishPermissions: function(callback) {
            var me = this;
            this.fb.requestAdditionalPermissions("publish", "publish_actions", function(response){
                if (response.error)
                    callback(false, error);
                else {
                    me.hasPublishPermissions(function(granted, error){
                        callback(granted,error);
                    });
                }
            });
        },
        requestUser: function(calback, userId) {
            var apiCall = (userId || "me");
            this.fb.api(apiCall, function(response){
                var user = response.error ? null : fromFBUserToCocoonUser(response);
                calback(user, response.error);
            });
        },
        requestUserImage: function(callback, userID, imageSize) {
            if (!userID && this.isLoggedIn()) {
                userID = this.fb._currentSession.authResponse.userID;
            }
            var fbPictureSize = "small";
            if (imageSize === CocoonJS.Social.ImageSize.THUMB) {
                  fbPictureSize = "square"
            }
            else if (imageSize === CocoonJS.Social.ImageSize.MEDIUM) {
                fbPictureSize = "normal";
            }
            else if (imageSize === CocoonJS.Social.ImageSize.LARGE) {
                fbPictureSize = "large";
            }
            var url = "https://graph.facebook.com/" + userID + "/picture?type=" + fbPictureSize;
            callback(url);
        },
        requestFriends: function(callback, userId) {
            var apiCall = (userId || "me") + "/friends";
            this.fb.api(apiCall, function(response){
                var friends = [];
                if (!response.error) {
                    for (var i=0; i<response.data.length; i++)
                    {
                        friends.push(fromFBUserToCocoonUser(response.data[i]));
                    }
                }
                callback(friends, response.error);
            });
        },

        //internal utility function
        preparePublishAction: function(callback) {
            if (!this.currentPermissions) {
                var me = this;
                this.fb.getPermissions(function(perms){
                    me.currentPermissions = perms;
                    if (perms)
                        me.preparePublishAction(callback);
                });
            }
            else if (this.currentPermissions.publish_actions) {
                callback(true);
            }
            else{
                this.currentPermissions = null;
                this.fb.requestAdditionalPermissions("publish", "publish_actions", function(response) {
                     callback(response.error ? false : true);
                });
            }

        },
        publishMessage: function(message, callback) {
            this.preparePublishAction(function(granted) {
                if (granted) {
                    var params = fromCocoonMessageToFBMessage(message);
                    var apiCall = "me/feed";
                    this.fb.api(apiCall, params, function(response) {
                        if (callback)
                            callback(response.error);
                    });
                }
                else {
                    if (callback)
                        callback({message: "No publish_actions permission granted"});
                }
            });
        },

        publishMessageWithDialog: function(message, callback) {
            this.fb.showShareDialog(fromCocoonMessageToFBMessage(message), function(response){
                 if (callback) {
                     callback(response.error);
                 }
            });
        },

        requestScore: function(callback, params) {
            var apiCall = ((params && params.userID) ? params.userID : "me") + "/scores";
            this.fb.api(apiCall, function(response) {
                if (response.error) {
                    callback(null, response.error)
                }
                else if (response.data && response.data.length > 0) {
                    var data = fromFBScoreToCocoonScore(response.data[0]);
                    callback(data, null);
                }
                else {
                    //No score has been submitted yet for the user
                    callback(null,null);
                }

            });
        },

        submitScore: function(score, callback, params) {
            var me = this;
            this.preparePublishAction(function(granted) {
                if (granted) {
                    me.requestScore(function(currentScore, error) {
                        if (error) {
                            //can't get the user top score. Don't send the new one because it might be worse than the top score
                            if (callback)
                                callback(error);
                           return;
                        }
                        var topScore = currentScore ? currentScore.score : 0;
                        if (score <= topScore) {
                            //don't submit the new score because a better score is already submitted
                            if (callback)
                                callback(null);
                            return;
                        }
                        var apiCall = "/" + ((params && params.userID) ? params.userID : "me") + "/scores";
                        me.fb.api(apiCall, 'POST', {score:score}, function (response) {
                             if (callback)
                                callback(response.error);
                        });
                    }, params)
                }
                else {
                    if (callback)
                        callback({message: "No publish_actions permission granted"});
                }

            })
        },

        requestLeaderboard : function(callback, params) {
            var me = this;
            this.fb.api(me.fb._appId + "/scores", function(response) {
                if (response.error) {
                    if (callback) {
                        callback(null, response.error);
                    }
                    return;
                }
                var scores = [];
                if (response.data && response.data.length) {
                    for (var i = 0; i< response.data.length; ++i) {
                        var score = fromFBScoreToCocoonScore(response.data[i]);
                        score.position = i;
                        score.imageURL = "https://graph.facebook.com/" + score.userID + "/picture";
                        score.me = score.userID === me.fb._currentSession.authResponse.userID;
                        scores.push(score);
                    }
                }
                if (callback) {
                    callback(scores, response.error);
                }
            });
        },

        showLeaderboard : function(callback, params) {
            if (!this._leaderboardsTemplate)
                throw "Please, provide a html template for leaderboards with the setTemplates method";
            var dialog = new CocoonJS.App.WebDialog();
            var callbackSent = false;
            dialog.show(this._leaderboardsTemplate, function(error) {
                dialog.closed = true;
                if (!callbackSent && callback)
                    callback(error);
            });
            var me = this;
            this.fb.api(me.fb._appId + "/scores", function(response) {
                if (dialog.closed)
                    return;
                if (response.error) {
                    if (callback) {
                        callbackSent = true;
                        callback(response.error);
                        dialog.close();
                    }
                    return;
                }
                var scores = [];
                if (response.data && response.data.length) {
                    for (var i = 0; i< response.data.length; ++i) {
                        var score = fromFBScoreToCocoonScore(response.data[i]);
                        score.position = i;
                        score.imageURL = "https://graph.facebook.com/" + score.userID + "/picture";
                        score.me = score.userID === me.fb._currentSession.authResponse.userID;
                        scores.push(score);
                    }
                }
                var js = "addScores(" + JSON.stringify(scores) + ")";
                dialog.eval(js);
            });
        },

        //internal utility function
        prepareAchievements: function(reload, callback) {

            if (!this._cachedAchievements || reload) {
                var me = this;
                this.fb.api(this.fb._appId + '/achievements', function(response) {
                    if (!response.error) {
                        var achievements = [];
                        if (response.data) {
                            for (var i = 0; i < response.data.length; i++) {
                                achievements.push(fromFBAchievementToCocoonAchievement(response.data[i]))
                            }
                        }
                        me.setCachedAchievements(achievements);
                        callback(achievements, null);
                    }
                    else {
                        callback([], response.error);
                    }
                });
            }
            else {
                callback(this._cachedAchievements, null);
            }
        },

        requestAllAchievements : function(callback) {
            this.prepareAchievements(true, callback);
        },

        requestAchievements : function(callback, userID) {
            var me = this;
            this.prepareAchievements(false, function(allAchievements, error){

                if (error) {
                    callback([], error);
                    return;
                }
                var apiCall = (userID || "me") + "/achievements";
                me.fb.api(apiCall, function(response) {
                    if (!response.error) {
                        var achievements = [];
                        if (response.data) {
                            for (var i = 0; i < response.data.length; i++) {
                                var ach = me.findAchievement((response.data[i].achievement || response.data[i].data.achievement).id);
                                if (ach)
                                    achievements.push(ach);
                            }
                        }
                        callback(achievements, null);
                    }
                    else {
                        callback([], response.error);
                    }
                });

            });
        },
        submitAchievement: function(achievementID, callback) {
            if (achievementID === null || typeof achievementID === 'undefined')
                throw "No achievementID specified";
            var achID = this.translateAchievementID(achievementID);
            var me = this;
            this.preparePublishAction(function(granted) {
                if (granted) {
                    me.fb.api("me/achievements", "POST", {achievement:achID}, function (response) {
                        if (callback) {
                            callback(response.error);
                        }
                    });
                }
                else {
                    if (callback)
                        callback({message: "No publish_actions permission granted"});
                }

            });
        },
        resetAchievements : function(callback) {
            var me = this;
            this.preparePublishAction(function(granted) {
                if (granted) {
                    me.requestAchievements(function(achievements, error){
                        if (error) {
                            if (callback)
                                callback(error);
                            return;
                        }
                        var someError = null;
                        var remaining = achievements.length;
                        for (var i = 0; i < achievements.length; ++i) {
                            me.fb.api("me/achievements", "DELETE", {achievement:achievements[i].fbAchievementData.url}, function (response) {
                                if (response.error) {
                                   someError = response.error;
                                }
                                remaining--;
                                if (remaining == 0 && callback) {
                                    callback(someError);
                                }
                            });
                        }

                    });
                }
                else {
                    if (callback)
                        callback({message: "No publish_actions permission granted"});
                }

            });
        },
        showAchievements : function(callback) {
            if (!this._achievementsTemplate)
                throw "Please, provide a html template for achievements with the setTemplates method";
            var dialog = new CocoonJS.App.WebDialog();
            var callbackSent = false;
            dialog.show(this._achievementsTemplate, function(error) {
                dialog.closed = true;
                if (!callbackSent && callback)
                    callback(error);
            });
            var me = this;
            this.requestAchievements(function(achievements, error){
                if (dialog.closed)
                    return;
                if (error) {
                    callbackSent = true;
                    if (callback)
                        callback(error);
                    return;
                }

                var achs = [];
                if (me._cachedAchievements) {
                    for (var i = 0; i < me._cachedAchievements.length; ++i) {
                        var ach = me._cachedAchievements[i];
                        achs.push(ach);
                        if (achievements && achievements.length) {
                            for (var j = 0; j< achievements.length; ++j) {
                                if (achievements[j].achievementID === ach.achievementID) {
                                    ach.achieved = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                var js = "addAchievements(" + JSON.stringify(achs) + ");";
                dialog.eval(js);
            });
        }   
    };

    /**
     *@ignore
     */
    function fromFBUserToCocoonUser (facebookUser) {
        return new CocoonJS.Social.User (facebookUser.id, facebookUser.username);
    }

    /**
     *@ignore
     */
    function fromCocoonMessageToFBMessage(message) {
        return {
            link: message.linkURL,
            description: message.message,
            name: message.linkText,
            caption: message.linkCaption,
            picture: message.mediaURL
        }
    }
    /**
     *@ignore
     */
    function fromFBScoreToCocoonScore(fbResponse, requestScoreParams) {
        var result = new CocoonJS.Social.Score(fbResponse.user.id, fbResponse.score, fbResponse.user.name);
        if (requestScoreParams) {
            result.leaderboardID = requestScoreParams.leaderboardID;
        }
        result.imageURL = 'https://graph.facebook.com/' + fbResponse.user.id + '/picture';
        return result;
    }
    /**
     *@ignore
     */
    function fromFBAchievementToCocoonAchievement(fbResponse) {
        var result = new CocoonJS.Social.Achievement (
            fbResponse.id,
            fbResponse.title,
            fbResponse.description,
            fbResponse.image[0].url,
            fbResponse.data.points
        );
        result.fbAchievementData = fbResponse;
        return result;
    }

    CocoonJS.Social.FacebookGaming = new CocoonJS.Social.SocialGamingServiceFacebook(CocoonJS.Social.Facebook);
})();
} // END - CHECK FOR COCOONJS


// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.CJSExtended = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.CJSExtended.prototype;
		
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};

    var fbAppID = null;
    var fbScoreImageURL = null;
    var fbScore = null;
    var fbUserID = null;
    var fbUsername = null;

	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
        this.socialServiceAvailable = false;
        var self = this;

		if (!this.runtime.isCocoonJs)
		{
		 	cr.logexport("[Construct 2 - CocoonJS Extended] CocoonJS Extended plugin not supported on this platform - the object will not be created");
		 	return;
		}
        fbAppID = this.properties[0];
        this.facebookService = CocoonJS["Social"]["Facebook"];
        this.facebookServiceAvailable = !!this.facebookService["nativeExtensionObjectAvailable"];
        this.facebookGamingService = CocoonJS["Social"]["FacebookGaming"];
        console && console.log("[CocoonJS Extended] Social Gaming Service: " + JSON.stringify(this.facebookGamingService));
        console && console.log("[CocoonJS Extended] Requesting Facebook Initialization with App ID: " + fbAppID);
        this.facebookService.init({
            appId: fbAppID
        });
        setTimeout(function() {
            if (self.facebookServiceAvailable) {
                console && console.log("[CocoonJS Extended] Triggering OnFBReady");
                self.runtime.trigger(pluginProto.cnds.OnFBReady, self);
            } else {
                console && console.log("[CocoonJS Extended] Triggering OnFBInitFail");
                self.runtime.trigger(pluginProto.cnds.OnFBInitFail, self);
            }
        }, 2000);
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function () {};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function () {
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o) {
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx) {};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw) {};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections) {
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "CocoonJS Extended",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.IsFBAvailable = function ()
    {
        return this.socialServiceAvailable;
    };
    
    Cnds.prototype.IsFBLoggedIn = function ()
    {
        console && console.log("[CocoonJS Extended] IsFBLoggedIn");
        return this.facebookGamingService.isLoggedIn();
    };
    
    Cnds.prototype.OnFBLoginSuccess = function ()
    {
        return true;
    };
    
    Cnds.prototype.OnFBLoginFail = function ()
    {
        return true;
    };
    
    Cnds.prototype.OnFBLogout = function ()
    {
        return true;
    };
    
    Cnds.prototype.OnFBScoreReceived = function ()
    {
        return true;
    };
    
    Cnds.prototype.OnFBScoreUnavailable = function ()
    {
        return true;
    };
    
    Cnds.prototype.OnFBScoreSubmitSuccess = function ()
    {
        return true;
    };
    
    Cnds.prototype.OnFBScoreSubmitFail = function ()
    {
        return true;
    };
    
    Cnds.prototype.OnFBLeaderboardSucceeded = function ()
    {
        return true;
    };

    Cnds.prototype.OnFBLeaderboardFailed = function ()
    {
        return true;
    };
    
    Cnds.prototype.OnFBLeaderboardClose = function ()
    {
        return true;
    };

    Cnds.prototype.OnFBReady = function ()
    {
        return true;
    };

    Cnds.prototype.IsFBReady = function ()
    {
        return this.socialServiceAvailable;
    };

    Cnds.prototype.OnFBInitFail = function ()
    {
        return true;
    };

    Cnds.prototype.OnFBLeaderboardScore = function ()
    {
        return true;
    };
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.FBLogin = function ()
    {
        console && console.log("[Construct 2 - CocoonJS Extended] FBLogin");
        var self = this;
        this.facebookGamingService.login(function(loggedIn, error) {
            if (loggedIn) {
                self.runtime.trigger(pluginProto.cnds.OnFBLoginSuccess, self);
            } else {
                self.runtime.trigger(pluginProto.cnds.OnFBLoginFail, self);
            }

            if (error) {
                console && console.error(JSON.stringify(error));
            }
        }, {});
    };
    
    Acts.prototype.FBLogout = function ()
    {
        console && console.log("[Construct 2 - CocoonJS Extended] FBLogout");
        var self = this;
        this.facebookGamingService.logout(function(error) {
            self.runtime.trigger(pluginProto.cnds.OnFBLogout, self);

            if (error) {
                console && console.error(JSON.stringify(error));
            }
        }, {});
    };
    
    Acts.prototype.FBSubmitScore = function (score_)
    {
        console && console.log("[Construct 2 - CocoonJS Extended] FBSubmitScore");
        var self = this;
        this.facebookGamingService.submitScore(score_, function(error) {
            if (!error) {
                console && console.log("[Construct 2 - CocoonJS Extended] Score submited: " + score_);
                self.runtime.trigger(pluginProto.cnds.OnFBScoreSubmitSuccess, self);
            } else {
                console && console.error(JSON.stringify(error));
                self.runtime.trigger(pluginProto.cnds.OnFBScoreSubmitFail, self);
            }
        }, {});
    };
    
    Acts.prototype.FBRequestScore = function ()
    {
        console && console.log("[Construct 2 - CocoonJS Extended] FBRequestScore");
        var self = this;
        this.facebookGamingService.requestScore(function(data, error) {
            if (data) {
                console && console.log("[Construct 2 - CocoonJS Extended] Data: " + JSON.stringify(data));
                fbScore = data["score"] || 0;
                self.runtime.trigger(pluginProto.cnds.OnFBScoreReceived, self);
            } else {
                console && console.log("[Construct 2 - CocoonJS Extended] No Score Available for User");
                fbScore = 0;
            }

            if (error) {
                self.runtime.trigger(pluginProto.cnds.OnFBScoreUnavailable, self);
                console && console.error(JSON.stringify(error));
            }
        }, {});
    };
    
    Acts.prototype.FBRequestScoreboard = function ()
    {
        console && console.log("[Construct 2 - CocoonJS Extended] FBRequestScoreboard");
        var self = this;
        this.facebookGamingService.requestLeaderboard(function(scores, error) {
            if (scores) {
                console && console.log("[Construct 2 - CocoonJS Extended] Scores: " + JSON.stringify(scores));
                for (var i = 0; i < scores.length; i++) {
                    var score = scores[i];
                    fbScoreImageURL = score.imageURL;
                    fbScore = score.score;
                    fbUserID = score.userID;
                    fbUsername = score.userName;
                    fbRank = i + 1;

                    self.runtime.trigger(pluginProto.cnds.OnFBLeaderboardScore, self);
                }
                self.runtime.trigger(pluginProto.cnds.OnFBLeaderboardSucceeded, self);
            } else {
                console && console.log("[Construct 2 - CocoonJS Extended] No Scores Available");
            }

            if (error) {
                self.runtime.trigger(pluginProto.cnds.OnFBLeaderboardFailed, self);
                console && console.error(JSON.stringify(error));
            }
        }, {});
    };
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.FacebookScore = function (ret)
    {
        ret.set_int(fbScore);
    };

    Exps.prototype.FacebookImageUrl = function (ret)
    {
        ret.set_string(fbScoreImageURL);
    };

    Exps.prototype.FacebookUserID = function (ret)
    {
        ret.set_int(fbUserID);
    };

    Exps.prototype.FacebookUsername = function (ret)
    {
        ret.set_string(fbUsername);
    };

    Exps.prototype.FacebookRank = function (ret)
    {
        ret.set_int(fbRank);
    };

    Exps.prototype.CurrentTimestamp = function (ret)
    {
        ret.set_int(Math.round(Date.now() / 1000));
    };
	
	pluginProto.exps = new Exps();

}());