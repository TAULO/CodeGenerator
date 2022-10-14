/// <reference path="/Scripts/jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />



; (function ($, snap, kendo, OT, global) {
    "use strict";

    snap.define("deviceapi", function () {
        var devicesById = {};

        var getDeviceLabel = function (device, currentMode) {
            currentMode = currentMode || "videoSource";
            if (device.label) {
                return device.label;
            }
            return (currentMode !== 'audioSource' ? 'Camera' : 'Mic') +
                ' (' + device.deviceId.substring(0, 8) + ')';
        };

        var extractDevice = function (device) {
            devicesById[device.deviceId] = device;
            return {
                value: device.deviceId,
                label: getDeviceLabel(device)
            };
        };

        var extractAudioDevice = function (device) {
            devicesById[device.deviceId] = device;
            return {
                value: device.deviceId,
                label: getDeviceLabel(device, "audioSource")
            };
        };

        var manageVideoDeviceList = function (devices) {
            var tmpList = [];
            if (devices.length > 0) {
                devices.map(extractDevice).map(function (tag) {
                    tmpList.push(tag);
                });

            }
            return tmpList;
        };
        var manageAudioDeviceList = function (devices) {
            var tmpList = [];
            if (devices.length > 0) {
                devices.map(extractAudioDevice).map(function (tag) {
                    tmpList.push(tag);
                });

            }
            return tmpList;
        };
        this.getVideoDeviceList = function () {

            var $def = $.Deferred();
            OT.getDevices(function (error, devices) {

                if (error) {
                    return;
                }
                var audioList = manageVideoDeviceList(devices.filter(function (device) {
                    return device.kind === 'videoInput';
                }));
                $def.resolve(audioList);

            });
            return $def.promise();
        };

        this.getAudioDeviceList = function () {
            var $def = $.Deferred();
            OT.getDevices(function (error, devices) {

                if (error) {
                    return;
                }
                var cameraList = manageAudioDeviceList(devices.filter(function (device) {
                    return device.kind === 'audioInput';
                }));
                $def.resolve(cameraList);

            });
            return $def.promise();
        };

    });
    
    var openConsultationTokboxViewModel = function ($snapNotification, $snapHttp, $snapLoader, $participantStatusCodes, $eventaggregator, $tokboxTest,
        $layoutManager, $deviceapi, $consultationHub, $mainHub, $meetingHub, $screenTypes, $consultationParticipants, $participantsService) {
        this.mainHub = $mainHub;
        this.meetingHub = $meetingHub;
        this.snapNotification = $snapNotification;
        this.snapHttp = $snapHttp;
        this.snapLoader = $snapLoader;
        this.participantStatusCodes = $participantStatusCodes;
        this.consultationParticipants = $consultationParticipants;
        this.eventaggregator = $eventaggregator;
        this.layoutManager = $layoutManager;
        this.consultationHub = $consultationHub;
        this.tokboxTest = $tokboxTest;
        this.deviceapi = $deviceapi;

        // Screen type
        this.screenTypes = $screenTypes;
        this.screenType = this.screenTypes.provider;

        this.isGuestPage = function () {
            return this.screenType === this.screenTypes.guest;
        };

        this.subscribers = [];
        this.videoSourceList = [];
        this.audioSourceList = [];

        //Default Value
        this._defaultUser = {
            profileImage: global.getDefaultProfileImageForClinician()
        };
        this.providerDetailsInformation = this._defaultUser;
        this.currentSelectedProvider = this._defaultUser;
        this.annotation = null;

        this.consultationParticipants.setContext(this);

        this.consultationParticipants.setContext(
            this, 
            $participantsService.createParticipantsServiceForOpenConsultation(this)
        );

        this.subscribeToEvents();
    };
    openConsultationTokboxViewModel.prototype.init = function (isGuestPage) {
        // init all vm fields
        var _this = this;
        this.connectionFailedCheckerInterval = null;
        this.isReenterStarted = false;
        this.cacheProvidersDetails = {};
        this.reconnectInterval = null;
        this.mediaStream = null;
        this.isChrome = window.isChrome;
        this.isFirefox = window.isFirefox;
        this.isKubiVisible = false;
        this.isConnectionReconnecting = false;
        this.meetingInformation = null;
        this.isStarted = false;
        this.consultButtonTitle = "Start Consultation";
        this.isSessionEnding = false;
        this.providerDetails = false;
        this.infoPanel = false;
        this.mobileInfoPanel = false;
        this.isShowMobileVideoControl = false;
        this.scopeActive = false;
        this.scopeUnActive = true;
        this.pillBtnFullOpacity = true;


        this.primaryActive = true;
        this.primaryInActive = false;

        this.primaryActive = true;
        this.primaryInActive = false;

        this.isGuestPage = function () {
            return this.screenType === this.screenTypes.guest;
        };

        this.stethoscopes = [];

        //Sesssion Data

        this.sessionInformation = {};
        this.session = null;
        this.sessionConnectEvent = null;
        this.sessionError = null;

        this.publisher = null;
        this.publishError = null;

        this.screenPublisher = null;


        //#region viewModel Property
        this.consultationInfo = null;
        this.isPatientInMobileDevice = false;
        this.clientconnected = false;
        this.clientNotconnected = true;
        this.isSelfView = false;
        this.isVideoBtn = false;
        this.isVideoMute = false;
        this.isVideoUnMute = true;
        this.hasVideoInititlized = false;
        this.isMuteMicrophone = false;
        this.isUnMuteMicrophone = true;
        this.isMicrophoneBtn = false;
        this.isUnMute = true;
        this.isMute = false;
        this.isBeta = false;
        this.videoDisconnected = false;
        this.selectedVideoSource = null;
        this.selectedAudioSource = null;
        this.selectedStethoscopesAudioSource = null;
        this.sessionTime = "00:00";
        this.isStethoscopeEnable = false;

        this.isMeidiaInfoShown = false;
        this.isMeidiaInfoInitialized = false;
        this.mediaInfoVM = null;

        this.customerSafeDisconnect = false;

        //side bar
        this.activeSetting = false;
        this.activeShare = false;
        this.activeParticipants = false;
        this.activeImages = false;


        this.subscribers = [];
        this.videoSourceList = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    _this.deviceapi.getVideoDeviceList().then(function (data) {
                        options.success(data);

                    }).fail(function () {
                        options.success([]);
                    });
                }
            }
        });
        this.audioSourceList = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    _this.deviceapi.getAudioDeviceList().then(function (data) {
                        options.success(data);
                    }).fail(function () {
                        options.success([]);
                    });
                }
            }
        });

        if (isGuestPage) {
            this.initGuestUI();
        }
        this.layoutManager.onViewChange(function () {
            this.refreshAnnotationCanvas();
        }.bind(this));

        window.onresize = function () {
            this.refreshAnnotationCanvas();
        }.bind(this);
        if (this.isKubiEnable()) {
            this.initKubi().then(function () {
                this.showKubiPad(true);
            }.bind(this));
        }

    };
    openConsultationTokboxViewModel.prototype.setConsultButtonTitle = function () {
        var providerUserId = null;

        if(this.consultationParticipants != null && this.consultationParticipants.physicianInformation != null) {
            providerUserId = this.consultationParticipants.physicianInformation.userId;
        }

        this.set("consultButtonTitle", (this.screenType === this.screenTypes.provider && providerUserId === snap.profileSession.userId) ? "End Consultation" : "Disconnect Consultation");
    };
    openConsultationTokboxViewModel.prototype.onSessionStarted = function () {
        this.set("isStarted", true);
        this.setConsultButtonTitle();
        this.set("isVideoBtn", true);
        this.set("isMicrophoneBtn", true);
        this.set("isMuteBtn", true);
    };
    openConsultationTokboxViewModel.prototype.canShowSCope = function () {
        return this.stethoscopes.length > 1;
    };
    openConsultationTokboxViewModel.prototype.countSScope = function () {
        return this.stethoscopes.length;
    };

    //#region Participants
    openConsultationTokboxViewModel.prototype.subscribeToMeetingHub = function () {
        var _this = this;
        this.meetingHub.on("start", function () {
            if (_this.sessionInformation.callStartTime) {
                // if session is already started
                _this.meetingHub.getOpenConsultationSeconds().then(function (seconds) {
                    _this.startTimerUI(_this.sessionInformation.callStartTime, seconds);
                });
            }
        });
    };

    openConsultationTokboxViewModel.prototype.setParticipantsData = function (participants) {
        this.consultationParticipants.setParticipants(participants);
    };

    //#endregion

    //#region basic set function
    openConsultationTokboxViewModel.prototype.setPatientConnectedDevice = function (flag) {
        this.isPatientInMobileDevice = flag;
    };
    openConsultationTokboxViewModel.prototype.setProviderData = function (data) {
        this.consultationParticipants.setPhysicianInformation(data);
        this.trigger("change", { field: "consultationParticipants" });

        this.setConsultButtonTitle();
    };
    openConsultationTokboxViewModel.prototype.startTimer = function (hrs, min, sec) {
        var _this = this;
        min = min || 0;
        sec = sec || 0;
        hrs = hrs || 0;
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
        this._timerInterval = setInterval(function () {
            sec++;
            if (sec == 60) {
                sec = 0;
                min++;
            }
            if (min == 60) {
                min = 0;
                hrs++;
            }
            var minStr;
            var secStr;
            var hrsStr;
            if (min < 10) {
                minStr = "0" + min;
            } else {
                minStr = "" + min;
            }
            if (sec < 10) {
                secStr = "0" + sec;
            } else {
                secStr = "" + sec;
            }
            if (hrs < 10) {
                hrsStr = "0" + hrs;
            } else {
                hrsStr = "" + hrs;
            }

            if (hrs === 0) {
                _this.set("sessionTime", minStr + ":" + secStr);
            } else {
                _this.set("sessionTime", hrsStr + ":" + minStr + ":" + secStr);
            }
        }, 1000);
    };

    openConsultationTokboxViewModel.prototype.setBetaParameter = function (isEnable) {
        this.set("isBeta", isEnable);
        global.isVideoBeta = isEnable && this.screenType === this.screenTypes.provider;
        this.set("isMultiParticipantFeatureEnable", true);

    };
    openConsultationTokboxViewModel.prototype.canShowAnnotation = function () {
        return (snap.hospitalSettings && snap.hospitalSettings.showAnnotation) ? true : false;
    };
    openConsultationTokboxViewModel.prototype.initGuestUI = function () {
        this.screenType = this.screenTypes.guest;
        this.trigger("change", { field: "isGuestPage" });
        this.trigger("change", { field: "isCustomerOrGuest" });
    };
    openConsultationTokboxViewModel.prototype.showProviderDetails = function (e) {
                this.set("providerDetails", true);
    };
    openConsultationTokboxViewModel.prototype.hideProviderDetails = function () {
        this.set("providerDetails", false);
    };
    openConsultationTokboxViewModel.prototype.isCustomerOrGuest = function () {
        return (this.screenType === this.screenTypes.patient || this.screenType === this.screenTypes.guest);
    };
    openConsultationTokboxViewModel.prototype.isPhysician = function () {
        return this.screenType === 1;
    };

    openConsultationTokboxViewModel.prototype.isStethoscopeAvailable = function () {
        return this.stethoscopes.length > 0;
    };

    //#endregion


    //#region tokbox related mvvm function
    //Not sure if onKeyUp is needed, merge is unclear
	openConsultationTokboxViewModel.prototype.onKeyUp = function () {
        var msg = $("#chatMessageCtl").val();
        this.meetingHub.broadcastChatMessage(this.meetingInformation.meetingId, msg).then(function () {
            $("#chatMessageCtl").val("");
        });
    };
    openConsultationTokboxViewModel.prototype.sendDisconnectInformation = function () {
        this.session.signal({
            data: "droppedconsultation",
            type: "all"
        });
    };
    openConsultationTokboxViewModel.prototype.setSessionInformation = function (meeting, session) {
        var _this = this;
        this.meetingInformation = meeting;
        $("#snapImageholder").kendoMobileScroller({
            contentHeight: "84px;"
        });

        this.layoutManager.initElement($("#pluginPlaceholder"));
        this.sessionInformation = $.extend(session, {
            screensharing: {
                extensionID: 'padchhoieclaaocgjbfepahaakajgllb',
                annotation: false
            }
        });
        this.eventaggregator.published("onInitHub", {});
        _this.deviceapi.getVideoDeviceList().then(function (data) {
            _this.startTokboxConection(data);
        });

        /*
        this.tokboxTest.setSessionId(session.sessionKey);
        this.tokboxTest.setToken(session.tokenKey);
       

        this.tokboxTest.loadConfig().then(function () {
            _this.tokboxTest.startTests(function () {
                var allDone = true;

                for (var key in global.results) {
                    if (key == "testWebSocketSecureConnection") {
                        allDone = allDone && true;
                    } else {
                        var result = global.results[key];
                        if (result.passed === true) {
                            allDone = allDone && true;
                            $("#" + key).addClass("green");


                        } else {
                            allDone = allDone && false;

                        }
                    }
                }
                if (allDone) {
                    _this.deviceapi.getVideoDeviceList().then(function (data) {
                        _this.startTokboxConection(data);
                    });

                }
            }, function (testName, result) {
                if (typeof result == "number") {
                    $("#" + testName).find(".progress").html(result + "%");
                } else if (result) {
                    global.results[testName] = result;
                    $("#" + testName).find(".progress").html("100%");//.addClass("circle");

                }
            });
        }).fail(function () {
            _this.deviceapi.getVideoDeviceList().then(function (data) {
                _this.startTokboxConection(data);
            });
        });
        */

    };

    openConsultationTokboxViewModel.prototype.initAll = function (_this) {
        var $def = $.Deferred();
        try {
            _this.initPublisher().then(function () {
                _this.initSession().then(function () {
                    _this.connectPublisher();
                    var subsId = _this.publisher.id;
                    var elInfo = $("#" + subsId);
                    elInfo.addClass("OT_Full");
                    _this.set("hasVideoInititlized", true);
                    _this.eventaggregator.published("videoInitialized");
                    $def.resolve();
                });
            }.bind(this));
        }
        finally {
            return $def.promise();
        }
    };

    openConsultationTokboxViewModel.prototype.subscribeToEvents = function() {
        var that = this;
        this.eventaggregator.subscriber("ud_showProviderDetails", function() {
            that.showProviderDetails();
        });
        this.eventaggregator.subscriber("forceLogout", function() {
            snap.clearUnLoadEvent();
            that.mainHub.stop();
            if (that.session) {
                that.session.disconnect();
            }
        });
    };

    openConsultationTokboxViewModel.prototype.tryToReconnect = function (event, that) {
        var _this = that || this;

        if (_this.session) {
            _this.session.connect(_this.sessionInformation.tokenKey, function (err, event) {
                if (!err) {
                    if (_this.publisher) {
                        _this.publisher.destroy();
                    }
                    var publishAudio = true;
                    if (_this.isMuteMicrophone) {
                        publishAudio = false;
                    }
                    _this.initPublisher({
                        publishAudio: publishAudio
                    }).then(function () {
                        _this.connectPublisher();
                        _this.onSessionReconnected();
                    });
                };
            });
        }
    };

    openConsultationTokboxViewModel.prototype.onSessionReconnecting = function () {
        this.set("isConnectionReconnecting", true);
        var hardReconnectAfter = 90000;

        if (this.reconnectInterval)
            window.clearInterval(this.reconnectInterval);

        this.reconnectInterval = window.setInterval(this.tryToReconnect, hardReconnectAfter, 'event', this);
    };

    openConsultationTokboxViewModel.prototype.onSessionReconnected = function () {
        this.set("isConnectionReconnecting", false);

        if (this.reconnectInterval)
            window.clearInterval(this.reconnectInterval);
    };

    openConsultationTokboxViewModel.prototype.showSubscribAudioDisabled = function (stream, hasAudio) {
        var subscribers = this.session.getSubscribersForStream(stream);
        if (subscribers && subscribers.length > 0) {
            var streamId = subscribers[0].id;
            var streamDivId = "#" + streamId;
            var mainEL = $(streamDivId).find(".OT_mute");

            if (!hasAudio) {
                mainEL.addClass("OT_active");
            } else {
                mainEL.removeClass("OT_active");
            }

        }
    };
    openConsultationTokboxViewModel.prototype.onSubscribVideoDisabled = function (stream) {
        var subscribers = this.session.getSubscribersForStream(stream);
        if (subscribers && subscribers.length > 0) {
            var streamId = subscribers[0].id;
            var streamDivId = "#" + streamId;

            this.displayUserImage(streamDivId, 2);

        }
    };
    openConsultationTokboxViewModel.prototype.displayUserImage = function (streamDivId, screenType) {
        var mainEL = $(streamDivId);
        var img = mainEL.find("img");

        if (img && img.length === 0) {
            img = $("<img />");
            var userimage = screenType == this.screenTypes.patient ? mainEL.find("span.userimage").text() : this.getProfilePic();

            var imgContainer = $("<div />");
            imgContainer.addClass("userpic userpic--is-consult-no-video");
            imgContainer.append(img);
            mainEL.find(".OT_video-poster").append(imgContainer);
            img.attr("src", userimage);
        }
    };
    openConsultationTokboxViewModel.prototype._initSubscriberEvent = function (sub) {
        var _this = this;
        sub.on("videoDisabled", function (event) {
            _this.onSubscribVideoDisabled(event.target.stream);
        });
        sub.on("videoEnabled", function (event) {
            var streamId = event.target.id;
            $('.OT_root').each(function () {
                if ($(this).attr('id') == streamId) {
                    $(this).find(".OT_video-poster").html("");
                }
            });
        });
    };
    openConsultationTokboxViewModel.prototype.isStethoscopeAudio = function () {
        if (OT.sessions.where().length == 0) {
            return false;
        }
        var session = OT.sessions.find(function (item) {
            return item.currentState === 'connected';
        });
        var isAud = session.streams.find(function (item) {
            return item.name.indexOf('patientAudio') >= 0;
        });
        return isAud ? true : false;
    }
    openConsultationTokboxViewModel.prototype.setPatientAudioListener = function (listen, pubSub) {
        var scopeLevel = function (scopeAudioLevel) {
            if (!scopeAudioLevel) {
                return '';
            } else if (scopeAudioLevel < 3) {
                return 'one';
            } else if (scopeAudioLevel < 6) {
                return 'two';
            } else if (scopeAudioLevel < 8) {
                return 'three';
            } else {
                return 'four';
            }
        }
        if (listen) {
            // let movingAvg = null;
            /*
            pubSub.on('audioLevelUpdated', function(event) {
                if (movingAvg === null || movingAvg <= event.audioLevel) {
                    movingAvg = event.audioLevel;
                } else {
                    movingAvg = 0.7 * movingAvg + 0.3 * event.audioLevel;
                }
                let logLevel = (Math.log(movingAvg) / Math.LN10) / 1.5 + 1;
                logLevel = Math.min(Math.max(logLevel, 0), 1);
                var cssLevel = scopeLevel(logLevel);
                $(".scope").removeClass("one two three four").addClass(cssLevel);
            });*/
        } else {
            if (pubSub) {
                //$(".scope").removeClass("one two three four");
                pubSub.off();
            }
        }
    }
    openConsultationTokboxViewModel.prototype.initSubscriber = function (stream, isAudioOnly) {
        var isStethoscopeAudio = stream.name.indexOf('patientAudio') >= 0;
        var container = isStethoscopeAudio ? 'patientAudio' : 'pluginPlaceholder';
        var elInfo = null;
        var _this = this;
        var props = {
            showControls: true,
            width: '120px',
            height: '120px',
            insertMode: 'append'
        };
        if (!isStethoscopeAudio) {
            props.subscribeToVideo = true;
            props.subscribeToAudio = true;
            if (isAudioOnly) {
                props.subscribeToVideo = false;
            }
        } else {
            props.subscribeToVideo = false;
            props.subscribeToAudio = false;
            props.style = {
                buttonDisplayMode: 'off'
            };
            //this.scopeActive = stream.hasAudio;
            //this.scopeUnActive = !stream.hasAudio;
            this.trigger("change", { field: "isStethoscopeAudio" });
            this.trigger("change", { field: "canShowSCope" });
            this.trigger("change", { field: "countSScope" });
            this.trigger("change", { field: "scopeActive" });
            this.trigger("change", { field: "scopeUnActive" });

            if (this.isStethoscopeAudio) {
                this.set("pillBtnFullOpacity", true);
                setTimeout(function () {
                    _this.set("pillBtnFullOpacity", false)
                }, 5000)
            }
        }

        var subs = this.session.subscribe(stream, container, props, function (error) {
            if (!error) {
                if (isStethoscopeAudio) {
                    _this.patientAudioSubscriber = subs;
                    _this.refreshStethoscope();
                    _this.setPatientAudioListener(true, subs);
                    return;
                }
                _this.subscribers.push(subs);
                if (!stream.hasVideo) {
                    _this.onSubscribVideoDisabled(stream);
                }
                if (!stream.hasAudio) {
                    _this.showSubscribAudioDisabled(stream, false);
                }

                if (_this.mediaInfoVM) {
                    _this.mediaInfoVM.setSubscribers(_this.subscribers)
                }

                $(".OT_root").removeClass("OT_Full");
                var subsId = subs.id;
                elInfo = $("#" + subsId);
                elInfo.addClass("OT_Full");
                elInfo.find(".OT_widget-container").attr("id", stream.id);
                _this.set("clientconnected", true);
                _this.set("clientNotconnected", false);
                _this._initSubscriberEvent(subs);
                if (subs) {
                    subs.setStyle('videoDisabledDisplayMode', 'on');
                    _this.initAnnotationSubscriber(subs);
                }
            }
        });
    };


    /* Annotation  */
    openConsultationTokboxViewModel.prototype.initAnnotationSubscriber = function (_subscriber) {
        if (_subscriber && this.annotation) {
            var pubEli = $(_subscriber.element)[0];
            var options = {
                lineWidth: toolbar.lineWidth || 2,
                selectedColor: toolbar.selectedColor || '',
                selectedItem: toolbar.selectedItem
            };

            this.annotation.linkCanvas(_subscriber, pubEli, options);
            this._initAnnotationEvent();
        }
    };


    openConsultationTokboxViewModel.prototype.startScreenShareAnnotation = function () {
        if (this.screenPublisher) {
            var pubEli = $(this.screenPublisher.element)[0];
            var options = {
                lineWidth: toolbar.lineWidth || 2,
                selectedColor: toolbar.selectedColor || '',
                selectedItem: toolbar.selectedItem
            };

            this.annotation.linkCanvas(this.screenPublisher, pubEli, options);
            this._initAnnotationEvent();
        }

    };
    openConsultationTokboxViewModel.prototype._initAnnotationEvent = function () {
        setTimeout(function () {
            var width = $("#pluginPlaceholder").width();
            var height = $("#pluginPlaceholder").height();
            $(".opentok_canvas").width(width);
            $(".opentok_canvas").height(height);
            $(".opentok_canvas").attr("width", width + "px");
            $(".opentok_canvas").attr("height", height + "px");

        }, 1000);
        $(window).off('resize').on('resize', function () {
            var width = $("#pluginPlaceholder").width();
            var height = $("#pluginPlaceholder").height();
            $(".opentok_canvas").width(width);
            $(".opentok_canvas").height(height);
            $(".opentok_canvas").attr("width", width + "px");
            $(".opentok_canvas").attr("height", height + "px");

        });
    }

    openConsultationTokboxViewModel.prototype.initAnnotationPublisher = function () {
        if (this.publisher && this.annotation) {
            var pubEli = $(this.publisher.element)[0];
            this.annotation.linkCanvas(this.publisher, pubEli);
            this._initAnnotationEvent();
        }
    };

    openConsultationTokboxViewModel.prototype.initAnnotation = function () {
        if (this.canShowAnnotation()) {
            this.annotation = new AnnotationAccPack({
                session: this.session,
                canvasContainer: $("#pluginPlaceholder")[0]
            });
            this.annotation.start(this.session, {
                toolbarId: 'toolbar',
            });
        }
    };
    /*end of Annotation */

    openConsultationTokboxViewModel.prototype.listenToPrimary = function () {
        console.log(this.selectedStethoscopeId);
        this.session.signal({ type: 'listenToPrimary', data: JSON.stringify({ listen: !this.primaryActive, id: this.selectedStethoscopeId }) }, function (error_info) {
            if (!error_info) {
                this.set("primaryActive", !this.primaryActive);
                this.set("primaryInActive", !this.primaryInActive);
            }
        }.bind(this));
    };

    openConsultationTokboxViewModel.prototype.refreshStethoscope = function () {
        var session = OT.sessions.find(function (item) {
            return item.currentState === 'connected';
        });
        var _this = this;
        this.stethoscopes = [];
        if (session) {
            session.streams.where(function (item) {
                return item.name.indexOf('patientAudio') >= 0;
            }).forEach(function (item) {
                var isOwnStream = false;
                if (this.patientAudioPublisher && this.patientAudioPublisher.streamId === item.streamId) {
                    isOwnStream = true;
                }
                if (!isOwnStream) {
                    var nameArray = item.name.split('-');
                    var userType = nameArray[1];
                    var userName = nameArray[2];
                    var pId = nameArray[3];
                    item.displayName = userName;
                    item.participant = {
                        id: pId,
                        name: userName,
                        userType: userType
                    };
                    this.stethoscopes.push(item);
                    this.trigger("change", { field: "stethoscopes" });
                    this.trigger("change", { field: "isStethoscopeAvailable" });
                    setTimeout(function () {
                        $.each($("input.eqSlider"), function () {
                            var slider = $(this).data("kendoSlider");
                            if (slider) {
                                slider.unbind('change').bind('change', function (e) {
                                    var el = $(this);
                                    var _id = $(el[0].element).data("id");
                                    var volumn = e.value;
                                    var volIcon = $(".consult-settings__steth-toggler-icon[data-id='" + _id + "']");
                                    var correctStreams = _this.stethoscopes.find(function (_item) {
                                        return _item.participant.id == _id;
                                    });

                                    if (volumn > 0) {
                                        if (!volIcon.hasClass("icon_speaker"))
                                            volIcon.removeClass("icon_speaker_mute");
                                        volIcon.addClass("icon_speaker");
                                    } else {
                                        volIcon.removeClass("icon_speaker");
                                        volIcon.addClass("icon_speaker_mute");
                                    }

                                    if (correctStreams) {
                                        console.log(correctStreams);
                                        var subscribers = _this.session.getSubscribersForStream(correctStreams);
                                        if (subscribers) {
                                            subscribers[0].setAudioVolume(volumn * 10);
                                        }

                                    }

                                });
                            }
                        });
                    }, 700);
                }
            }.bind(this));
            this.trigger("change", { field: "isStethoscopeAudio" });
            this.trigger("change", { field: "canShowSCope" });
            this.trigger("change", { field: "countSScope" });
            this.trigger("change", { field: "stethoscopes" });
            this.trigger("change", { field: "isStethoscopeAvailable" });
            var fist = $('.consult-settings__circle-btn').first();
            if (fist.length > 0) {
                fist.parent().addClass('is-active');
                this.selectedStethoscopeId = fist.data('id');
                this.syncStethoscopeIcon();
            }
            $('.consult-settings__circle-btn').off('click').on('click', function () {
                console.log($(this).data('id'));
                $(this).parent().toggleClass('is-active');
                $('.consult-settings__circle-btn').parent().removeClass("is-active");
                $(this).parent().addClass('is-active');
                _this.selectedStethoscopeId = $(this).data('id');
                _this.syncStethoscopeIcon();

            });
        }
    };

    openConsultationTokboxViewModel.prototype.syncStethoscopeIcon = function () {
        this.session.signal({ type: 'getPrimaryChannelStatus', data: JSON.stringify({ id: this.selectedStethoscopeId }) });
    };
    openConsultationTokboxViewModel.prototype.listenToStethoscope = function () {
        if (OT.sessions.where().length == 0) {
            return false;
        }
        var session = OT.sessions.find(function (item) {
            return item.currentState === 'connected';
        });
        var selectedStream = session.streams.find(function (item) {
            return item.name.indexOf(this.selectedStethoscopeId) >= 0;
        }.bind(this));
        if (selectedStream) {
            var subscribers = session.getSubscribersForStream(selectedStream);
            if (subscribers && subscribers.length > 0) {
                var subInfo = subscribers[0];
                this.scopeActive = !this.scopeActive;
                this.scopeUnActive = !this.scopeUnActive;
                this.trigger("change", { field: "scopeActive" });
                this.trigger("change", { field: "scopeUnActive" });
                subInfo.subscribeToAudio(this.scopeActive);
            }
        }
    };
    openConsultationTokboxViewModel.prototype.listenToPrimary = function () {
        this.session.signal({ type: 'listenToPrimary', data: JSON.stringify({ listen: !this.primaryActive, id: this.selectedStethoscopeId }) }, function (error_info) {
            if (!error_info) {
                this.set("primaryActive", !this.primaryActive);
                this.set("primaryInActive", !this.primaryInActive);
            }
        }.bind(this));

    };
    openConsultationTokboxViewModel.prototype.onStreamCreated = function (event) {
        if (event.stream) {
            if (this.isReenterStarted) {
                var streamId = event.stream.id;
                var alreadySubs = OT.subscribers.where(function (subscriber) {
                    return subscriber.streamId === streamId;
                });
                if (alreadySubs.length > 0) {
                    return;
                }
            }
            if (!event.stream.hasVideo && event.stream.name.indexOf('patientAudio') < 0) {
                this.snapNotification.info("Video stream is not available");
            }

            if (!event.stream.hasAudio && event.stream.videoType !== "screen" && event.stream.name.indexOf('patientAudio') < 0) {
                this.snapNotification.info("Audio stream is not available");
            }

        }
        /*
        var isStethoscopeAudio = event.stream.name.indexOf('patientAudio') >= 0;
        if (isStethoscopeAudio) {
            this.refreshStethoscope();
            return;
        } */
        this.initSubscriber(event.stream);
        this.layoutManager.refreshLayout();
        this.set("videoDisconnected", false);
    };

    openConsultationTokboxViewModel.prototype.restartConnection = function () {

        if (this.session && this.session.isConnected()) {
            //if already connected do nothing
            if (this.connectionFailedCheckerInterval) {
                clearInterval(this.connectionFailedCheckerInterval);
                this.connectionFailedCheckerInterval = null;
                this.isReenterStarted = false;
            }

            return;
        }

        var _this = this;
        if (this.publisher) {
            this.publisher.destroy();
            this.publisher = null;
        }
        this.initPublisher().then(function () {
            _this.initSession().then(function () {
                _this.connectPublisher();
            });
        });


    };
    openConsultationTokboxViewModel.prototype.detectAndReconnct = function () {

        var _this = this;
        if (!(this.session && this.session.isConnected())) {
            if (this.connectionFailedCheckerInterval) {
                clearInterval(this.connectionFailedCheckerInterval);
                this.connectionFailedCheckerInterval = null;
            }
            this.connectionFailedCheckerInterval = setInterval(function () {
                _this.restartConnection();
            }, 10 * 1000);
        }
    };
    openConsultationTokboxViewModel.prototype.onSessionDisconnected = function (event) {
        if (event && event.reason == "networkDisconnected") {
            this.isReenterStarted = true;
            this.detectAndReconnct();
        }
    };
    openConsultationTokboxViewModel.prototype.onStreamPropertyChanged = function (event) {
        if (event.changedProperty == "hasAudio") {
            this.showSubscribAudioDisabled(event.stream, event.newValue);
            this.syncStethoscopeIcon();
            if (event.stream.name.indexOf('patientAudio') >= 0) {
                var hasAudio = event.stream.hasAudio;
                this.scopeActive = hasAudio;
                this.scopeUnActive = !hasAudio;
                this.trigger("change", { field: "scopeActive" });
                this.trigger("change", { field: "scopeUnActive" });
            }

        }
    };
    openConsultationTokboxViewModel.prototype._convertToDatePart = function (ms) {
        var d, h, m, s;
        s = Math.abs(Math.floor(ms / 1000));
        m = Math.abs(Math.floor(s / 60));
        s = s % 60;
        h = Math.abs(Math.floor(m / 60));
        m = m % 60;
        d = Math.abs(Math.floor(h / 24));
        h = h % 24;
        return { d: d, h: h, m: m, s: s };
    };

    openConsultationTokboxViewModel.prototype._initSessionEvents = function () {
        var _this = this;
        this.session.on({
            sessionReconnecting: function (event) {
                window.console.log("Disconnected from the session. Attempting to reconnect...");
                _this.onSessionReconnecting(event);
            },
            sessionReconnected: function (event) {
                window.console.log('Reconnected to the session.');
                _this.onSessionReconnected(event);
            },
            sessionDisconnected: function (event) {
                window.console.log('Disconnected from the session.');
                _this.onSessionDisconnected(event);
            },
            streamCreated: function (event) {
                setTimeout(function () {
                    _this.onStreamCreated(event);
                }, 300);
            },
            streamDestroyed: function (event) {
                _this.layoutManager.refreshLayout();
                if (event.stream.name.indexOf('patientAudio') >= 0) {
                    _this.setPatientAudioListener(false, _this.patientAudioSubscriber);
                    _this.refreshStethoscope();
                }
            },
            streamPropertyChanged: function (event) {
                _this.onStreamPropertyChanged(event);
            },
            connectionCreated: function (stream) {
                if (stream.connectionId === _this.session.connection.connectionId) {
                    return;
                }
                _this.set("isPhysicianReady", _this.screenType == _this.screenTypes.provider && _this.hasVideoInititlized);
                _this.set("videoDisconnected", false);
                _this.eventaggregator.publish("clientconnected", true);
            }
        });

        /*openConsultationTokboxViewModel.prototype.listenToPrimary = function () {
        this.session.signal({ type: 'listenToPrimary', data: JSON.stringify({ listen: !this.primaryActive, id: this.selectedStethoscopeId }) }, function (error_info) {
            if (!error_info) {
               
        this.set("primaryActive", !this.primaryActive);
        this.set("primaryInActive", !this.primaryInActive);
    }
}.bind(this));

    };
        */

        this.session.on("signal:listenToPrimary", function (_data) {
            var data = JSON.parse(_data.data);
            var stethoscopetempuserid = +sessionStorage.getItem("snap_stethoscopetempuserid");
            if (data && data.id === stethoscopetempuserid) {
                if (data.listen) {
                    _this.publisher.publishAudio(true);
                } else {
                    _this.publisher.publishAudio(false);
                }
                _this.set("isMuteMicrophone", !data.listen);
                _this.set("isMicrophoneBtn", data.listen);
                _this.trigger("change", { field: "muteMicTitle" });
            }

        });

        this.session.on("signal:listenToScope", function (_data) {
            var data = JSON.parse(_data.data);
            var stethoscopetempuserid = +sessionStorage.getItem("snap_stethoscopetempuserid");
            if (data && data.id === stethoscopetempuserid) {
                _this.patientAudioPublisher.publishAudio(data.listen);
            }
        });
        this.session.on("signal:sendPrimaryChannelStatus", function (_data) {
            var data = JSON.parse(_data.data);
            if (data && data.id === _this.selectedStethoscopeId) {
                _this.set("primaryActive", data.hasAudio);
                _this.set("primaryInActive", !data.hasAudio);
            }
        });

        this.session.on("signal:getPrimaryChannelStatus", function (_data) {
            var data = JSON.parse(_data.data);
            var stethoscopetempuserid = +sessionStorage.getItem("snap_stethoscopetempuserid");
            if (data && data.id === stethoscopetempuserid && _this.publisher && _this.publisher.stream) {
                var hasAudio = _this.publisher.stream.hasAudio;
                _this.session.signal({ type: 'sendPrimaryChannelStatus', data: JSON.stringify({ hasAudio: hasAudio, id: stethoscopetempuserid }) });

            }
        });

        //tokbox signal
        this.session.on("signal:openconsultationtime", function (_data) {
            if (snap.publicPage) {
                var time = _data.data;
                if (time) {
                    time = +time;
                }
                var startDate = new Date(time);
                var diffDate = _this._convertToDatePart(new Date() - startDate);

                var hour = diffDate.h;
                var min = diffDate.m;
                var sec = diffDate.s;
                if (sec >= 0) {

                    _this.startTimer(hour, min, sec);
                }
            }
        });

        if (window.addEventListener) {
            window.addEventListener('online', function () {
                _this.set("isConnectionReconnecting", false);
            }, false);
        }
    };
    openConsultationTokboxViewModel.prototype.clearAndRedirectFromConsultation = function () {

        var _this = this;
        clearInterval(this._timerInterval);
        snap.clearUnLoadEvent();
        snap.clearSnapMeetingSession();
        snap.clearSnapGuestSession();
        sessionStorage.removeItem("snap_participantId");
        _this.meetingHub.onLeaveOpenConsultation();
        _this.mainHub.stop();
        window.setTimeout(function () {
            if (_this.annotation) {
                _this.annotation.end();
            }
            if ( _this.screenType === _this.screenTypes.provider) {
                window.location.href = snap.getClinicianHome();
                // no need to reload
            } else {
                window.location.href = "/Public/#/joinexit";
            }
        }, 3000);
    };
    openConsultationTokboxViewModel.prototype.initSession = function () {
        var $def = $.Deferred();
        var _this = this;
        this.session = OT.initSession(this.sessionInformation.apiKey, this.sessionInformation.sessionKey);
        this._initSessionEvents();
        this.session.connect(this.sessionInformation.tokenKey, function (error, sessionConnectEvent) {
            if (error) {
                _this.sessionError = error;
                $def.reject();
            } else {
                _this.sessionConnectEvent = sessionConnectEvent;
                $def.resolve();
            }
        });
        return $def.promise();
    };
    openConsultationTokboxViewModel.prototype.getName = function () {
        if (this.screenType == this.screenTypes.provider || this.screenType == this.screenTypes.patient) {
            return snap.profileSession.fullName || "";
        } else {
            return snap.guestSession.participantName;
        }
    };

    openConsultationTokboxViewModel.prototype.getProfilePic = function () {
        var profilePic;
        if (snap.profileSession) {
            profilePic = snap.profileSession.profileImage;
        } else {
            profilePic = snap.guestSession.participantPhotoUrl;
        }
        return profilePic || global.getDefaultProfileImageForPatient();
    };

    openConsultationTokboxViewModel.prototype._initPublisherEvent = function () {
        var _this = this;
        var _allowCameraNotification = null;

        this.publisher.on({
            destroyed: function () {
                window.console.log("destroyed");
                _this.layoutManager.refreshLayout();
            },
            accessDenied: function () {
                $("#resultInfo").addClass("red").find(".details")
                    .html("Permission is denied to access the camera. Please change permission setting for camera access").end()
                    .find(".progress").html("100%");
                if (_this.publisher && _this.publisher.id) {
                    var elId = this.publisher.id;
                    $("#" + elId).remove();
                }
                _this.layoutManager.refreshLayout();
            },
            accessDialogOpened: function () {
                // Show allow camera message
                _allowCameraNotification = _this.snapNotification.info("Please allow the camera access");
            },
            accessDialogClosed: function () {
                // Empty is intentional
            },
            accessAllowed: function () {
                $(".networktest").hide();

                if (_allowCameraNotification && _allowCameraNotification.hide) {
                    _allowCameraNotification.hide();
                    _allowCameraNotification = null;
                }
            },
            streamDestroyed: function () {
                if (_this.isPatientInMobileDevice) {
                    setTimeout(function () {
                        if (_this.publisher) {
                            _this.publisher.publishVideo(true);
                        }
                    }, 2000);
                }
                return;
            }
        });
    };

    openConsultationTokboxViewModel.prototype.onStethoscopeEnable = function () {
        setTimeout(function () {
            if (!this.isStethoscopeEnable) {
                if (this.patientAudioPublisher) {
                    this.session.unpublish(this.patientAudioPublisher);
                    this.set("selectedStethoscopesAudioSource", null);
                }
            }
        }.bind(this), 500);
    };

    openConsultationTokboxViewModel.prototype.publishStethoscope = function (deviceId) {
        var _this = this;
        var targetDeviceLabel = deviceId;
        var name = "";
        var tmpId = Math.round((new Date()).getTime() / 1000);
        sessionStorage.setItem("snap_stethoscopetempuserid", tmpId);
        var isProvider = this.screenType === this.screenTypes.provider;
        if (isProvider) {
            name = ["patientAudio", "provider", snap.profileSession.fullName, tmpId].join('-');
        } else if (this.screenType === this.screenTypes.patient) {
            name = ["patientAudio", "patient", snap.consultationSession.patientName, tmpId].join('-');
        } else { // guest page
            var gName = snap.guestSession.participantName;
            name = ["patientAudio", "guest", gName, tmpId].join('-');
        }
        const baseOptions = {
            name: name,
            publishAudio: true,
            publishVideo: false,
            disableAudioProcessing: true,
            audioBitrate: 256000,
            insertMode: 'append',
        };
        this.patientAudioPublisher = null;
        this.patientAudioPublisherEl = null;
        OT.getDevices(function (error, devices) {

            var stethoscope;
            for (var i = 0; i < devices.length; i++) {
                if (devices[i].deviceId === targetDeviceLabel) {
                    stethoscope = devices[i];
                    break;
                }
            }
            //commented out because of uglify error
            //var stethoscope = devices.find(d => d.deviceId === targetDeviceLabel);

            if (!stethoscope) {
                console.info('Could not find target device');
            }
            var audioSource = stethoscope ? { audioSource: stethoscope } : {};
            var publisherOptions = Object.assign({}, baseOptions, audioSource)
            _this.patientAudioPublisher = OT.initPublisher(document.getElementById('patientAudio'), publisherOptions, function (error) {
                if (!error) {
                    _this.session.publish(_this.patientAudioPublisher, function (_, pubInfo) {
                        _this.patientAudioPublisherEl = pubInfo;
                        _this.refreshStethoscope();
                    });
                }
            });


        })
    }
    openConsultationTokboxViewModel.prototype.connectPublisher = function () {
        var _this = this;
        var $def = $.Deferred();

        if (this.session && (this.session.connected ||
            (this.session.isConnected && this.session.isConnected()))) {
            _this.mediaStream = this.session.publish(_this.publisher, function (err) {
                if (err) {
                    if (err.code === 1553 || (err.code === 1500 && err.message.indexOf("Publisher PeerConnection Error:") >= 0)) {
                        _this.snapNotification.error("Streaming connection failed. This could be due to a restrictive firewall.");
                    } else if (err.code == 2001) {
                        console.log("TokBox Bug");
                        $def.resolve();
                        return
                    }
                    $def.reject();
                    _this.publishError = err;
                } else {
                    $def.resolve();
                }
            });
            this.layoutManager.refreshLayout();
        }
        return $def.promise();
    };

    openConsultationTokboxViewModel.prototype.initPublisher = function (prop) {
        prop = prop || {};
        var $def = $.Deferred();
        var _this = this;
        var name = "<span>" + this.getName() + "<span class='userimage' style='display:none;'>" + this.getProfilePic() + "</span></span>";

        var defaultProp = $.extend(prop, {
            name: name,
            testNetwork: true,
            showControls: true,
            insertMode: 'append',
            mirror: false,
            width: '120px',
            height: '120px'
        });

        this.publisher = OT.initPublisher('pluginPlaceholder', defaultProp, function (err) {
            if (err) {
                if (err.code === 1500 && err.message.indexOf('Publisher Access Denied:') >= 0) {
                    _this.snapNotification.error('Please allow access to the Camera and Microphone and try publishing again.');
                } else {
                    _this.snapNotification.error('Failed to get access to your camera or microphone. Please check that your webcam' + ' is connected and not being used by another application and try again.');
                }
                _this.publisher.destroy();
                _this.publisher = null;
                $def.reject();
            } else {
                $def.resolve();
            }
        });
        this._initPublisherEvent();
        return $def.promise();
    };
    openConsultationTokboxViewModel.prototype.startTimerUI = function (callStartTime, callSeconds) {
        if (callStartTime) {
            this.sessionInformation.callStartTime = callStartTime;
            var diffDate = this._convertToDatePart(callSeconds * 1000);
            var hour = diffDate.h;
            var min = diffDate.m;
            var sec = diffDate.s;
            if (sec >= 0) {
                this.startTimer(hour, min, sec);
            }
        }
    };
    openConsultationTokboxViewModel.prototype.startTokboxConection = function () {
        var _this = this;
        //  this.initAll(_this);  //This was removed per merge request, please look at this
        this.initPublisher().then(function () {
            _this.initSession().then(function () {
                _this.initAnnotation();
                _this.initAnnotationPublisher();
                _this.connectPublisher();
                var subsId = _this.publisher.id;
                var elInfo = $("#" + subsId);
                elInfo.addClass("OT_Full");
                _this.set("hasVideoInititlized", true);
                _this.eventaggregator.published("videoInitialized");
            });
        });
    };
    openConsultationTokboxViewModel.prototype.startSession = function (e) {
        var _this = this;
        e.preventDefault();
        if (!this.mainHub.isHubStarted()) {
            _this.snapNotification.info("Please wait... Consultation is not ready.");
            return;
        }
        this.snapNotification.confirmationWithCallbacks("You currently have a consultation in progress.\n Are you sure you want to disconnect this consultation?", function () {
            _this.set("isSessionEnding", true);
            _this.meetingHub.leaveOpenConsultation(_this.meetingInformation.meetingId).then(function () {
                _this.clearAndRedirectFromConsultation();
            }).always(function() {
                _this.set("isSessionEnding", false);
            });
        });
    };
    //#endregion

    //#region tokbox related screenshare function
    openConsultationTokboxViewModel.prototype.extensionAvailable = function () {
        var _this = this;
        var deferred = $.Deferred();
        OT.registerScreenSharingExtension('chrome', this.sessionInformation.screensharing.extensionID);

        OT.checkScreenSharingCapability(function (response) {
            var errorMessage;
            if (!response.supported || !response.extensionRegistered) {
                if (OT.$.browser() === 'Firefox' && response.extensionInstalled) {
                    deferred.resolve();
                } else if (OT.$.browser() === 'Firefox' && !response.extensionInstalled) {
                    deferred.resolve(); //it could actually be in the ff browser but we can't see extensionInstalled
                    errorMessage = "You need an extension to share your screen. Install Screensharing Extension. Once you have installed, refresh your browser and click the share screen button again. Press Yes to install extension";
                    _this.snapNotification.confirmationWithCallbacks(errorMessage, function () {
                        if (OT.$.browser() === 'Firefox') {
                            window.open('https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/');
                        }
                        else {
                            _this.installScreenshareExtension();
                        }
                    });
                    deferred.reject('screensharing extension not installed');
                } else {
                    deferred.reject('This browser does not support screen sharing! Please use Chrome, Firefox or IE!');
                }
            } else if (!response.extensionInstalled) {
                errorMessage = "You need an extension to share your screen. Install Screensharing Extension. Once you have installed, refresh your browser and click the share screen button again. Press Yes to install extension";
                _this.snapNotification.confirmationWithCallbacks(errorMessage, function () {
                    if (OT.$.browser() === 'Firefox') {
                        window.open('https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/');
                    }
                    else {
                        _this.installScreenshareExtension();
                    }
                });
                deferred.reject('screensharing extension not installed');
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise();

    };
    openConsultationTokboxViewModel.prototype._initScreenSharePublisher = function () {
        var _this = this;
        var createPublisher = function () {
            var innerDeferred = $.Deferred();
            var properties = {

            };
            $.extend(properties, {
                name: "Screen Share By : " + _this.getName(),
                showControls: true,
                width: '120px',
                height: '120px',
                style: {
                    buttonDisplayMode: 'off',
                },
                videoSource: 'window',
                insertMode: 'append'
            });
            _this.screenPublisher = OT.initPublisher('pluginPlaceholder', properties, function (error) {
                if (error) {
                    innerDeferred.reject('Error starting the screen sharing');
                } else {
                    innerDeferred.resolve();
                }
            });
            _this.screenPublisher.on("accessDenied", function (flag) {
                if (flag && flag.target) {
                    $("#" + flag.target.id).remove();
                    _this.screenPublisher = null;
                }

            });
            return innerDeferred.promise();
        };
        var outerDeferred = $.Deferred();
        createPublisher().then(function () {
            outerDeferred.resolve();
        });
        return outerDeferred.promise();

    };
    openConsultationTokboxViewModel.prototype.installScreenshareExtension = function () {
        var _this = this;
        window.chrome.webstore.install('https://chrome.google.com/webstore/detail/' + this.sessionInformation.screensharing.extensionID,
            function () {
                _this.snapNotification.success('successfully installed');
            }, function () {
                window.open('https://chrome.google.com/webstore/detail/' + _this.sessionInformation.screensharing.extensionID);
            });
    };
    openConsultationTokboxViewModel.prototype._publishScreenShare = function () {
        var _this = this;
        var $def = $.Deferred();
        this.session.publish(this.screenPublisher, function (error) {
            if (error) {
                var errorMessage;
                if (error.code === 1500 && navigator.userAgent.indexOf('Firefox') !== -1) {
                    errorMessage = "You need an extension to share your screen. Install Screensharing Extension. Once you have installed, refresh your browser and click the share screen button again. Press Yes to install extension";
                    _this.snapNotification.confirmationWithCallbacks(errorMessage, function () {
                        if (OT.$.browser() === 'Firefox') {
                            window.open('https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/');
                        }
                        else {
                            _this.installScreenshareExtension();
                        }
                    });
                } else {
                    if (error.code === 1010) {
                        errorMessage = 'Check your network connection';
                    } else {
                        errorMessage = 'Error sharing the screen';
                    }
                    _this.snapNotification.error(errorMessage);
                }
                $def.reject();
                return;
            }
            $def.resolve();
            return;
        });
        return $def.promise();
    };
    openConsultationTokboxViewModel.prototype.startScreenSharing = function () {
        var _this = this;
        this.extensionAvailable()
            .then(function () {
                _this._initScreenSharePublisher().then(function () {
                    _this._publishScreenShare().then(function () {
                        _this.startScreenShareAnnotation();
                    })
                    _this.layoutManager.refreshLayout();
                }).fail(function () {
                    _this.snapNotification.error('Error starting screensharing');
                });
            });
    };
    openConsultationTokboxViewModel.prototype.endScreenSharing = function () {
        this.session.unpublish(this.screenPublisher);
        this.screenPublisher = null;
        this.layoutManager.refreshLayout();
    };
    openConsultationTokboxViewModel.prototype.toggleScreen = function () {
        if (this.screenPublisher) {
            this.endScreenSharing();
        } else {
            this.startScreenSharing();
        }

    };
    //#endregion


    //#region ViewModel function
    openConsultationTokboxViewModel.prototype.disconnect = function () {
        var _this = this;
        this.snapNotification.confirmationWithCallbacks("You currently have a consultation in progress.\n Are you sure you want to end this consultation?", function () {
            if (_this.session) {
                _this.session.disconnect();
            }
        });
    };
    openConsultationTokboxViewModel.prototype.showSettingTab = function () {
        if (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) {
            return true;
        }
        return false;
    };
    openConsultationTokboxViewModel.prototype.showSelfView = function () {
        if (this.clientconnected) {
            if (this.publisher && this.publisher.id) {
                var id = "#" + this.publisher.id;
                $(id).toggle();
                this.set("isSelfView", !this.isSelfView);
            }
            this.trigger("change", { field: "isSelfView" });
        }
        else {
            this.muteVideo();
        }
    };
    //mute video
    openConsultationTokboxViewModel.prototype.muteVideo = function () {
        var _this = this;
        if (!this.publisher) {
            this.initPublisher().then(function () {
                _this.connectPublisher();

            });
            return;
        }
        this.isVideoMute = !this.isVideoMute;
        this.isVideoBtn = !this.isVideoBtn;
        if (this.isVideoMute) {
            this.publisher.publishVideo(false);
            var streamDivId = "#" + this.publisher.id;
            this.displayUserImage(streamDivId, 1);
        } else {
            this.publisher.publishVideo(true);
            this.layoutManager.refreshLayout();
            this.hasVideoInititlized = true;
        }
        this.trigger("change", { field: "isVideoMute" });
        this.trigger("change", { field: "isVideoUnMute" });
        this.trigger("change", { field: "isVideoBtn" });
        this.trigger("change", { field: "muteVideoTitle" });
        this.trigger("change", { field: "hasVideoInititlized" });

    };
    openConsultationTokboxViewModel.prototype.muteVideoTitle = function () {
        return this.isVideoMute ? "Unmute Camera" : "Mute Camera";
    };

    var loadMediaInfoBoxTemplate = function (viewModel) {
        var templatePath = "/content/templates/consultationMediaInfoBox.html";
        var infoBoxId = "#mediaInfoBox";
        var $contentLoader = snap.common.contentLoader();

        $contentLoader.bindViewModel(viewModel, infoBoxId, templatePath)
            .then(function () {
                viewModel.set("isShown", !viewModel.isShown);
            });
    };

    openConsultationTokboxViewModel.prototype.showMediaInfo = function () {
        if (!this.isMeidiaInfoShown) {

            if (!this.isMeidiaInfoInitialized) {
                // load and bind template
                if (!this.mediaInfoVM) {
                    this.mediaInfoVM = snap.shared.ConsultationMediaInfo();
                }

                loadMediaInfoBoxTemplate(this.mediaInfoVM);
                this.isMeidiaInfoInitialized = true;

            } else {
                this.mediaInfoVM.set("isShown", !this.mediaInfoVM.isShown);
            }
            // add this ↓ to subscriber connect event
            var fullScrVideoId = $('.OT_Full').attr('id');
            this.mediaInfoVM.init({
                subscribers: this.subscribers,
                currentId: fullScrVideoId
            });

            this.mediaInfoVM.set("isRealtime", false);
            this.mediaInfoVM.setTimerState();

        } else {
            //just turn it off and delete timer (it will be inside vm)
            this.mediaInfoVM.turnOffTimer();
            this.mediaInfoVM.set("isShown", !this.mediaInfoVM.isShown);
        }
        this.set("isMeidiaInfoShown", !this.isMeidiaInfoShown);
    };

    openConsultationTokboxViewModel.prototype.muteMicrophone = function () {
        if (this.isMuteMicrophone) {
            this.publisher.publishAudio(true);
        } else {
            this.publisher.publishAudio(false);
        }
        this.set("isMuteMicrophone", !this.isMuteMicrophone);
        this.set("isMicrophoneBtn", !this.isMicrophoneBtn);
        this.trigger("change", { field: "muteMicTitle" });

    };
    openConsultationTokboxViewModel.prototype.muteMicTitle = function () {
        return this.isMuteMicrophone ? "Unmute Microphone" : "Mute Microphone";
    };

    openConsultationTokboxViewModel.prototype.muteVoice = function () {
        var _this = this;
        if (this.clientconnected) {
            this.set("isMute", !this.isMute);
            this.set("isMuteBtn", !this.isMuteBtn);
            this.trigger("change", { field: "muteVoiceTitle" });
            $.each(this.subscribers, function () {
                if (_this.isMute) {
                    this.subscribeToAudio(false);
                } else {
                    this.subscribeToAudio(true);
                }
            });

        }
    };
    openConsultationTokboxViewModel.prototype.muteVoiceTitle = function () {
        return this.isMute ? "Unmute Speakers" : "Mute Speakers";
    };

    openConsultationTokboxViewModel.prototype.resetMedia = function () {
        var _this = this;

        if (this.publisher) {
            this.session.unpublish(this.publisher);
        }
        setTimeout(function () {
            _this.initPublisher().then(function () {
                _this.connectPublisherOrRetry();
            });
        }, 100);
    }

    openConsultationTokboxViewModel.prototype.selectVideoTab = function (e) {
        var _this = this;
        var el = $(e.currentTarget),
            id = el.attr("data-id");
        if (id == "activeSetting") {
            if (!(window.isChrome || window.isFirefox)) {
                _this.resetMedia();
                return;
            }
        }
        if (id === "activeParticipants") {
            this.set("activeParticipants", !this.activeParticipants);
            this.set("activeSetting", false);
        }
        if (id == "activeSetting") {
            this.set("activeSetting", !this.activeSetting);
            this.set("activeParticipants", false);
        }
        if (id == "activeShare") {
            this.set("activeShare", !this.activeShare);
        }
    };

    openConsultationTokboxViewModel.prototype.refreshAnnotationCanvas = function () {
        if (this.annotation) {
            var allCanvas = $(".opentok_canvas");
            $.each(allCanvas, function (__index, currentCanvas) {
                this.annotation.refreshCanvas([currentCanvas]);
            }.bind(this));
        }
    };
    openConsultationTokboxViewModel.prototype.onFullScreen = function () {
        var element = document.getElementById("pluginPlaceholder");
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        var _this = this;
        var exitHandler = function () {
            _this.refreshAnnotationCanvas();
        }
        if (element.addEventListener) {
            element.addEventListener('webkitfullscreenchange', exitHandler, false);
            element.addEventListener('mozfullscreenchange', exitHandler, false);
            element.addEventListener('fullscreenchange', exitHandler, false);
            element.addEventListener('MSFullscreenChange', exitHandler, false);
        }
        exitHandler();


    };
    openConsultationTokboxViewModel.prototype.onStethoscopesAudioComboOpen = function () {
        this.audioSourceList.read();
    };
    openConsultationTokboxViewModel.prototype.onAudioComboOpen = function () {
        this.audioSourceList.read();
    };
    openConsultationTokboxViewModel.prototype.onVideoComboOpen = function () {
        this.videoSourceList.read();
    };
    openConsultationTokboxViewModel.prototype.onVideoChange = function () {
        var _this = this;
        if (this.selectedVideoSource !== null) {
            if (this.publisher) {
                this.publisher.destroy();
                this.publisher = null;
            }
            var publishAudio = true;
            if (this.isMuteMicrophone) {
                publishAudio = false;
            }
            _this.initPublisher({
                videoSource: _this.selectedVideoSource.value,
                publishAudio: publishAudio
            }).then(function () {
                _this.connectPublisher();
            });


        }
    };
    openConsultationTokboxViewModel.prototype.onAudioStethoscopesChange = function () {
        if (this.selectedStethoscopesAudioSource !== null) {
            if (this.patientAudioPublisher) {
                this.session.unpublish(this.patientAudioPublisher);
            }
            setTimeout(function () {
                this.publishStethoscope(this.selectedStethoscopesAudioSource.value);
            }.bind(this), 300);
        }
    };
    openConsultationTokboxViewModel.prototype.onAudioChange = function () {
        if (this.selectedAudioSource !== null) {
            if (this.publisher) {
                this.publisher.destroy();
            }
            var publishVideo = true;
            if (this.isVideoMute) {
                publishVideo = false;
            }
            this.initPublisher({
                audioSource: this.selectedAudioSource.value,
                publishVideo: publishVideo
            }).then(function () {
                this.connectPublisher().then(function () {
                    if (this.isVideoMute) {
                        var streamDivId = "#" + this.publisher.id;
                        this.displayUserImage(streamDivId, 1);
                    }
                }.bind(this));
            }.bind(this));
        }
    };

    //#endregion


    /* Kubi Integration */

    openConsultationTokboxViewModel.prototype.initKubi = function () {
        var $def = $.Deferred();
        if (snap.cachedGetScript) {
            snap.cachedGetScript("/Scripts/kubi/kubi.control.js").done(function () {
                this.kubiControl = new snap.kubi.kubiControl();
                $def.resolve();
            }.bind(this)).fail(function () {
                $def.reject();
            });
        } else {
            $def.reject();
        }
        return $def.promise();
    };

    openConsultationTokboxViewModel.prototype.showKubiPad = function (flag) {
        if (this.kubiControl) {
            this.kubiControl.initKubiControl();
        }
    };
    openConsultationTokboxViewModel.prototype.showKubiWindow = function (flag) {
       // this.set("isKubiVisible", !this.isKubiVisible);
       // this.kubiControl.toggleKubi(this.isKubiVisible);
       // return;
        if (!this.kubiControl.isConnected) {
            this.kubiControl.connectAndMoveCenter('6817EB').then(function () {
                this.set("isKubiVisible", true);
                this.kubiControl.toggleKubi(this.isKubiVisible);
            }.bind(this)).fail(function(){
                this.snapNotification.error("Kubi is not connected. Please connect kubi and try again.");
            }.bind(this));
        } else {
            this.set("isKubiVisible", !this.isKubiVisible);
            this.kubiControl.toggleKubi(this.isKubiVisible);
        }
    };
    openConsultationTokboxViewModel.prototype.isKubiEnable = function () {
        return (snap.hospitalSettings && snap.hospitalSettings.showKubi) ? true : false;
    };

    //#region Mobile view
    openConsultationTokboxViewModel.prototype.toggleMobileInfoPanel = function (e) {
        e.preventDefault();

        this.set('mobileInfoPanel', !this.mobileInfoPanel);
        this.set('infoPanel', !this.infoPanel);

        if (this.isShowMobileVideoControl || this.activeParticipants || this.activeShare) {
            this.set('isShowMobileVideoControl', false);
            this.set('activeParticipants', false);
            this.set('activeShare', false);

        }
    };
    openConsultationTokboxViewModel.prototype.isSnapImageDisabled = function () {
        return true; // intentional untill we implement snapshot  
    };
    openConsultationTokboxViewModel.prototype.showSnapImageHolder = function () {
        // Empty is intentional
    };
    openConsultationTokboxViewModel.prototype.showMobileControl = function () {
        this.set("isShowMobileVideoControl", !this.isShowMobileVideoControl);

        if (this.activeParticipants) {
            this.set("providerDetails", false);
            this.set("activeParticipants", false);
        }
        if (this.activeSetting) {
            this.set("activeSetting", false);
        }
        if ($('#patientContainer').hasClass('is-active')) {
            $('#patientContainer').removeClass('is-active');
            this.set('infoPanel', false);
        }
    };
    //#endregion

    snap.namespace("snap.shared").use(["snapNotification", "snapHttp", "snapLoader", "snap.enums.ParticipantStatusCodes",
        "eventaggregator", "snap.tokbox.TokboxTest", "snap.UI.LayoutManager", "deviceapi", "snap.hub.ConsultationHub", "snap.hub.mainHub",
        "snap.hub.MeetingHub", "snap.enums.screenTypes", 
        "snap.shared.consultationParticipants.consultationParticipantsPanel", 
        "snap.shared.consultationParticipants.participantsService"])
        .extend(kendo.observable)
        .define("OpenConsultationTokboxViewModel", openConsultationTokboxViewModel).singleton(); //make it singleton because we only need 1 instance no matter to share the same sesssion
}(jQuery, snap, kendo, OT, window));
