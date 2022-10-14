import APPCONFIG from "./config.js";
let COMMON = {
    baseUrl: `https://${APPCONFIG.runEnv[0]}zoom${APPCONFIG.runEnv[1]}.us/`,
    loginUrl: "mimo/login",
    logoutUrl: "mimo/logout",
    scheduleMeetingUrl: "mimo/schedule",
    schedulePMIMeetingUrl: "mimo/pmi",
    schedulePACMeetingUrl: "mimo/schedule_pac",
    editMeetingUrl: "mimo/editMeeting",
    deleteMeetingUrl: "mimo/deleteMeeting",
    validateTokenURL: "mimo/validtoken",
    saveSettingURL: "mimo/save_setting",
    validAlternativeHost: "mimo/valid_althost",
    syncEidMeetingMapUrl: "mimo/getWebExtMapping",
    updateTimeAndTimezoneUrl: "mimo/updateScheduleTimeAndTimezone",
    logUrl: "mimo/log4zm",
    logTimeDelayer: null,
    logDataArr: [],
    populateZak: function(e) {
        var o = COMMON.getZoomZakRequestToken();
        if (o) {
            $.extend(e, {
                zak: o
            })
        }
    },
    getOAuthURL: function() {
        return `https://${APPCONFIG.runEnv[0]}zoom${APPCONFIG.runEnv[1]}.us/mimo/google_signin`
    },
    schedulePACMeeting: function(e, o, t) {
        var i = COMMON.getUserBaseUrl() + COMMON.schedulePACMeetingUrl;
        var a = COMMON.getValue("zoom_config_pacindex") || "1";
        if (isNaN(parseInt(a, 10))) {
            a = "1"
        }
        var n = {
            selectedPAC: a,
            trackfields: e.trackfields
        };
        COMMON.populateZak(n);
        $.ajax({
            type: "POST",
            url: i,
            data: n,
            timeout: 1e4,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "x-zm-cluster-id": COMMON.getClusterHeader(),
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(e) {
                if (e.status) {
                    if (e.result) {
                        COMMON.saveZoomZakRequestToken(e.result["_zm_zak"]);
                        COMMON.saveZoomDataModifiedDate(new Date);
                        e.result.addJoinUrl = COMMON.getValue("zoom_config_joinurl") == null ? true : !!COMMON.getValue("zoom_config_joinurl")
                    }
                    o(e)
                } else {
                    t(e)
                }
            },
            error: function(e) {
                t(e)
            }
        })
    },
    scheduleMeeting: function(e, o, t) {
        COMMON._scheduleMeeting(true, e, o, t)
    },
    encodeHtml: function(e) {
        let o = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
        return typeof e != "string" ? e : e.replace(o, function(e) {
            var o = e.charCodeAt(0),
                t = ["&#"];
            o = o == 32 ? 160 : o;
            t.push(o);
            t.push(";");
            return t.join("")
        })
    },
    checkNeedPassword: function() {
        let e = !!COMMON.getValue("zoom_config_pmi"),
            o = !!COMMON.getValue("zoom_config_jbh"),
            t = COMMON.getValue("zoom_config_jbh_pwd");
        let i = COMMON.getZoomData();
        let a = false;
        let n = false;
        try {
            a = i.scheduleDefaultLockOption.password === "true"
        } catch (e) {}
        let r = false;
        try {
            r = i.scheduleDefaultLockOption.password_locked === "true"
        } catch (e) {}
        if (e) {
            if (a) {
                if (o && r) {
                    n = true
                } else if (t === null) {
                    n = o
                } else {
                    n = !!t
                }
            } else {
                n = !!COMMON.getValue("zoom_config_all_pmi_pwd")
            }
        } else {
            n = !!COMMON.getValue("zoom_config_one_time_pwd")
        }
        return n
    },
    checkNeedPasswordForPopup: function() {
        let e = !!COMMON.getValue("zoom_config_pmi"),
            o = !!COMMON.getValue("zoom_config_jbh");
        let t = COMMON.getZoomData();
        let i = false;
        try {
            i = t.scheduleDefaultLockOption.password_locked === "true"
        } catch (e) {}
        let a = COMMON.getValue("zoom_config_jbh_pwd");
        let n = false;
        let r = false;
        let s = false;
        try {
            n = t.scheduleDefaultLockOption.password === "true"
        } catch (e) {}
        if (e) {
            if (n) {
                if (o && i) {
                    r = true
                } else if (a === null) {
                    r = o
                } else {
                    r = !!a;
                    if (!r && o) {
                        r = true;
                        s = true
                    }
                }
            } else {
                r = !!COMMON.getValue("zoom_config_all_pmi_pwd");
                let e = false;
                try {
                    e = t.scheduleDefaultLockOption.password4PMI === "true"
                } catch (e) {}
                if (!r && e) {
                    r = true;
                    s = true
                }
            }
        } else {
            r = "2" == COMMON.getValue("zoom_config_pwdtype") && !!COMMON.getValue("zoom_config_one_time_pwd")
        }
        return {
            needPassword: r,
            voidable: s
        }
    },
    editNeedPasswordState: function(e) {
        e = !!e;
        let o = !!COMMON.getValue("zoom_config_pmi");
        let t = false;
        try {
            t = COMMON.getZoomData().scheduleDefaultLockOption.password === "true"
        } catch (e) {}
        if (o) {
            if (t) {
                COMMON.saveValue("zoom_config_jbh_pwd", e)
            } else {
                COMMON.saveValue("zoom_config_all_pmi_pwd", e)
            }
        } else {
            COMMON.saveValue("zoom_config_one_time_pwd", e)
        }
    },
    _scheduleMeeting: function(e, o, t, i) {
        var a = !!COMMON.getValue("zoom_config_jbh");
        var n = COMMON.checkNeedPassword();
        var r = !!COMMON.getValue("zoom_config_mute_upon_entry");
        var s = !!COMMON.getValue("zoom_config_public_cal");
        var u = COMMON.getValue("zoom_config_video_host") || "off";
        var l = COMMON.getValue("zoom_config_video_participants") || "off";
        var M = COMMON.getValue("zoom_config_audio") || "both";
        var O = COMMON.getValue("zoom_config_schedule_for") || "";
        var c = COMMON.getValue("zoom_config_rectype");
        let _ = "";
        try {
            let e = COMMON.getZoomData()["enableJBHPriorStartMeeting"];
            if (!COMMON.getValue("zoom_config_pmi") && a && e) {
                _ = COMMON.getJbhTimeMinutes()
            }
        } catch (e) {
            console.log(e)
        }
        var m = "";
        var d = {};
        COMMON.populateZak(d);
        var p = COMMON.getUserBaseUrl() + COMMON.scheduleMeetingUrl;
        if (n) {
            var g = o.password;
            if (g && "" != g) {
                m = g
            } else if (!COMMON.getValue("zoom_config_pmi")) {
                m = COMMON.generatePassword()
            }
        }
        var f = "Zoom Meeting";
        var N = COMMON.getZoomData();
        if (N) {
            var C = N["assistants"];
            if (O && C && C.length > 0) {
                $.each(C, function(e, o) {
                    if (o.id == O) f = COMMON.resolveUserName(o.name) + " Zoom Meeting"
                })
            } else {
                f = COMMON.resolveUserName(N.displayName) + " Zoom Meeting"
            }
            let e = N["authentication"];
            if (e && e.support) {
                d.enableAuthentication = !!COMMON.getValue("enableAuthentication");
                if (d.enableAuthentication) {
                    try {
                        let e = COMMON.getUpdateAuthOptionItem();
                        if ($.type(e) == "object") {
                            d.authOptionsJson = JSON.stringify({
                                selectAuthName: e.name,
                                option_enforce_signed_in: parseInt(e.type),
                                selectAuthId: e.id,
                                authDomain: e.domain
                            });
                            d.option_enforce_signed_in = parseInt(e.type)
                        }
                    } catch (e) {
                        console.log(e);
                        COMMON.sendLog({
                            msgType: 4,
                            msg: {
                                msg: "append authOptionsJson failed",
                                function: "_scheduleMeeting",
                                errorStack: e.stack
                            }
                        })
                    }
                }
            }
        }
        var h = COMMON.getValue("zoom_config_althost");
        if (h && h != "") {
            $.extend(d, {
                mtg_alternative_host: h.replace(/,/g, ";")
            })
        }
        $.extend(d, {
            ext_version: APPCONFIG.extVersion,
            topic: f,
            scheduleTime: o.scheduleTime,
            option_jbh: a,
            mute_upon_entry: r,
            public_cal: s,
            password: m,
            option_video_host: u,
            option_video_participants: l,
            option_schedule_for: O,
            option_audio_type: M,
            option_record_type: c,
            trackfields: o.trackfields,
            timezone: o.timezone,
            jbhTimeMinutes: _
        });
        COMMON._ajaxScheduleMtg(e, p, d, t, i)
    },
    _ajaxScheduleMtg: function(e, o, t, i, a) {
        $.ajax({
            type: "POST",
            url: o,
            data: t,
            async: e,
            timeout: 15e3,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "x-zm-cluster-id": COMMON.getClusterHeader(),
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(e) {
                if (e.status) {
                    if (e.result) {
                        COMMON.saveZoomZakRequestToken(e.result["_zm_zak"]);
                        COMMON.saveZoomDataModifiedDate(new Date);
                        e.result.addJoinUrl = COMMON.getValue("zoom_config_joinurl") == null ? true : !!COMMON.getValue("zoom_config_joinurl")
                    }
                    i(e)
                } else if (e.errorCode == 201) {
                    COMMON.clearAllData();
                    a(e)
                } else if (e.errorCode == 3001) {
                    alert(e.errorMessage)
                } else {
                    if (e.errorCode == 3068) {
                        COMMON.editNeedPasswordState(true)
                    }
                    a(e)
                }
            },
            error: function(e) {
                a(e)
            }
        });
        COMMON.sendLog({
            msgType: 5,
            msg: {
                msg: "Send a schedule meeting request, method name: _ajaxScheduleMtg",
                parameters: t
            },
            operaType: 3
        })
    },
    editMeeting: function(e, o, t) {
        var e = {
            ext_version: APPCONFIG.extVersion,
            meetingNumber: e.number,
            duration: e.duration,
            scheduleTime: e.startTime,
            timezone: e.timezone,
            isRepeat: e.isRepeat,
            zoomrooms: e.zoomrooms,
            topic: e.topic,
            zm_eid: e.zm_eid,
            event_baseid: e.event_baseid || ""
        };
        COMMON.populateZak(e);
        $.ajax({
            type: "POST",
            url: COMMON.getUserBaseUrl() + COMMON.editMeetingUrl,
            data: e,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "x-zm-cluster-id": COMMON.getClusterHeader(),
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(i) {
                if (i.status) {
                    if (e.meetingNumber && e.zm_eid) {
                        COMMON.updateEidMeetingMap(e.zm_eid, e.meetingNumber, e.event_baseid)
                    }
                    o(i)
                } else if (i.errorCode == 201) {
                    COMMON.clearAllData()
                } else {
                    t(i)
                }
            }
        });
        COMMON.sendLog({
            msgType: 5,
            msg: {
                msg: "Send a editMeeting request, method name: editMeeting",
                parameters: e
            },
            operaType: 3
        })
    },
    createMeetingMp: function(e, o, t) {
        var e = {
            ext_version: APPCONFIG.extVersion,
            meeting_number: e.number,
            calendarId: e.calendarId,
            event_baseid: e.event_baseid || ""
        };
        COMMON.populateZak(e);
        $.ajax({
            type: "POST",
            url: COMMON.getUserBaseUrl() + "mimo/crmapping",
            data: e,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "x-zm-cluster-id": COMMON.getClusterHeader(),
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(i) {
                if (i.status) {
                    COMMON.updateEidMeetingMap(e.calendarId, e.meeting_number, e.event_baseid);
                    o(i)
                } else {
                    t(i)
                }
            }
        });
        COMMON.sendLog({
            msgType: 5,
            msg: {
                msg: "Send a crmapping request, method name: createMeetingMp",
                parameters: e
            },
            operaType: 3
        })
    },
    removeMeetingMp: function(e, o, t) {
        var e = {
            ext_version: APPCONFIG.extVersion,
            zm_eid: e.calendarId || "",
            event_baseid: e.event_baseid || ""
        };
        COMMON.populateZak(e);
        $.ajax({
            type: "POST",
            url: COMMON.getUserBaseUrl() + COMMON.deleteMeetingUrl,
            data: e,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "x-zm-cluster-id": COMMON.getClusterHeader(),
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(i) {
                if (i.status) {
                    if (e.zm_eid || e.event_baseid) {
                        COMMON.updateEidMeetingMap(e.zm_eid, "", e.event_baseid)
                    }
                    o(i)
                } else {
                    t(i)
                }
            }
        });
        COMMON.sendLog({
            msgType: 5,
            msg: {
                msg: "Send a delete meeting request, method name: removeMeetingMp",
                parameters: e
            },
            operaType: 3
        })
    },
    getMeetingMp: function(e, o, t) {
        var e = {
            calendarId: e.calendarId
        };
        COMMON.populateZak(e);
        $.ajax({
            type: "POST",
            url: COMMON.getUserBaseUrl() + "mimo/getmapping",
            data: e,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "x-zm-cluster-id": COMMON.getClusterHeader(),
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(e) {
                if (e.status) {
                    o(e)
                } else {
                    t(e)
                }
            }
        })
    },
    deleteMeeting: function(e, o, t) {
        var e = {
            ext_version: APPCONFIG.extVersion,
            number: e.number,
            zm_eid: e.zm_eid || "",
            event_baseid: e.event_baseid || ""
        };
        COMMON.populateZak(e);
        $.ajax({
            type: "POST",
            url: COMMON.getUserBaseUrl() + COMMON.deleteMeetingUrl,
            data: e,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "x-zm-cluster-id": COMMON.getClusterHeader(),
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(i) {
                if (i.status) {
                    if (e.zm_eid) {
                        COMMON.updateEidMeetingMap(e.zm_eid, e.number, e.event_baseid)
                    }
                    o(i)
                } else {
                    t(i)
                }
            }
        });
        COMMON.sendLog({
            msgType: 5,
            msg: {
                msg: "Send a delete meeting request, method name: deleteMeeting",
                parameters: e
            },
            operaType: 3
        })
    },
    updateMeetingTimeAndTimezone: function(e, o, t) {
        return;
        let i = COMMON.getEidMeetingMap();
        if ($.type(i) === "object") {
            let a = i[e.calendarId];
            if (a) {
                let i = {
                    calendarId: e.calendarId,
                    meetingNumber: a,
                    scheduleTime: e.startTime,
                    duration: e.duration,
                    timezoneid: e.timezone
                };
                COMMON.populateZak(i);
                $.ajax({
                    type: "POST",
                    url: COMMON.getUserBaseUrl() + COMMON.updateTimeAndTimezoneUrl,
                    data: i,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "x-zm-cluster-id": COMMON.getClusterHeader(),
                        "X-Requested-From": "ZOOM-EXTENSION"
                    },
                    dataType: "json",
                    success: function(e) {
                        if (e.status) {
                            o(e)
                        } else {
                            t(e)
                        }
                    }
                })
            } else {
                COMMON.recordDataError(`${APPCONFIG.errors[16]} ${COMMON.convertToString(e.calendarId)}`, "common.js -- updateMeetingTimeAndTimezone")
            }
        } else {
            COMMON.recordDataError(`${APPCONFIG.errors[15]} ${COMMON.convertToString(i)}`, "common.js -- updateMeetingTimeAndTimezone")
        }
    },
    getZoomSetting: function() {
        var e = {};
        let o = COMMON.getZoomData() || {};
        e.zoom_config_schedule_for = COMMON.getValue("zoom_config_schedule_for");
        e.zoom_assistants = o["assistants"];
        e.zoom_config_video_host = COMMON.getValue("zoom_config_video_host") || "off";
        e.zoom_config_video_participants = COMMON.getValue("zoom_config_video_participants") || "off";
        e.zoom_config_audio = COMMON.getValue("zoom_config_audio") || "both";
        e.zoom_config_hasOther = !!o["option_has3rd"];
        e.zoom_config_noBoth = !!o["option_noboth"];
        e.zoom_config_jbh = !!COMMON.getValue("zoom_config_jbh");
        e.jbhTimeMinutes = COMMON.getJbhTimeMinutes();
        e.enableJBHPriorStartMeeting = !!o["enableJBHPriorStartMeeting"];
        e.zoom_config_watermark = !!COMMON.getValue("zoom_config_watermark");
        e.zoom_config_audiomark = !!COMMON.getValue("zoom_config_audiomark");
        e.zoom_config_pwdtype = COMMON.getValue("zoom_config_pwdtype") || "1";
        e.zoom_config_mute_upon_entry = !!COMMON.getValue("zoom_config_mute_upon_entry");
        e.zoom_config_waiting_room = !!COMMON.getValue("zoom_config_waiting_room");
        e.zoom_config_hasPubCal = !!o["option_haspublic_cal"];
        e.zoom_config_public_cal = !!COMMON.getValue("zoom_config_public_cal");
        e.zoom_config_pmi = !!COMMON.getValue("zoom_config_pmi");
        e.zoom_config_pmiNum = o["PMI"];
        e.zoom_config_pmi_saved_pwd = COMMON.getPmiSavedPwd();
        e.zoom_config_one_time_pwd = COMMON.getValue("zoom_config_one_time_pwd");
        e.zoom_config_jbh_pwd = COMMON.getValue("zoom_config_jbh_pwd");
        e.zoom_config_all_pmi_pwd = COMMON.getValue("zoom_config_all_pmi_pwd");
        e.authentication = o["authentication"];
        e.enableAuthentication = !!COMMON.getValue("enableAuthentication");
        e.updateAuthOptionItem = COMMON.getUpdateAuthOptionItem();
        e.zoom_support_althost = !(o["alt_hosts"] === undefined);
        e.zoom_config_althost = COMMON.getValue("zoom_config_althost");
        e.zoom_config_fixed_popup = !!COMMON.getValue("zoom_config_fixed_popup");
        e.zoom_config_enable_watermark = !!o["option_enable_watermark"];
        e.zoom_config_enable_audiomark = !!o["scheduleDefaultLockOption"] && "true" === o["scheduleDefaultLockOption"].audioWaterMark;
        e.zoom_audiomarkLocked = !!o["scheduleDefaultLockOption"] && "true" === o["scheduleDefaultLockOption"].audioWaterMark_locked;
        e.zoom_config_joinurl = COMMON.getValue("zoom_config_joinurl") == null ? true : !!COMMON.getValue("zoom_config_joinurl");
        e.zoom_trackfields = o["trackfields"];
        e.zoom_record_type = COMMON.getValue("zoom_config_rectype");
        try {
            e.zoom_local_record = o["recording"].option_local_recording;
            e.zoom_cloud_record = o["recording"].option_cloud_recording
        } catch (o) {
            e.zoom_local_record = false;
            e.zoom_cloud_record = false
        }
        e.lockOpts = o["lockedoptions"];
        e.host_email = o["email"] || "";
        e.option_enable_reg = Boolean(o["option_enable_reg"]);
        e.zoom_option_require_reg = Boolean(COMMON.getValue("zoom_option_require_reg"));
        e.pmi_jbh2pwd = !!o["option_pmi_jbhpwd"];
        var t = false;
        if (o["scheduleDefaultLockOption"] && "true" === o["scheduleDefaultLockOption"].usePMISchedule_locked) {
            t = true
        }
        e.schedulePmiLock = t;
        e.jbhPwd_default = false;
        e.jbhLock = false;
        e.allPimLock = false;
        e.oneTimeLock = false;
        try {
            e.jbhPwd_default = o.scheduleDefaultLockOption.password === "true";
            e.allPmiPwd_default = o.scheduleDefaultLockOption.password4PMI === "true";
            e.jbhLock = o.scheduleDefaultLockOption.password_locked === "true";
            e.allPimLock = o.scheduleDefaultLockOption.password4PMI_locked === "true";
            e.oneTimeLock = o.scheduleDefaultLockOption.password4Schedule_locked === "true"
        } catch (e) {}
        return e
    },
    updateZoomSetting: function(e, o) {
        COMMON.saveValue("zoom_config_schedule_for", e.zoom_config_schedule_for);
        COMMON.saveValue("zoom_config_video_host", e.zoom_config_video_host);
        COMMON.saveValue("zoom_config_video_participants", e.zoom_config_video_participants);
        COMMON.saveValue("zoom_config_audio", e.zoom_config_audio);
        COMMON.saveValue("zoom_config_jbh", e.zoom_config_jbh);
        COMMON.saveValue("zoom_config_watermark", e.zoom_config_watermark);
        COMMON.saveValue("zoom_config_audiomark", e.zoom_config_audiomark);
        COMMON.saveValue("zoom_config_mute_upon_entry", e.mute_upon_entry);
        COMMON.saveValue("zoom_config_waiting_room", e.waiting_room);
        COMMON.saveValue("zoom_config_public_cal", e.public_cal);
        COMMON.saveValue("zoom_config_pmi", e.zoom_config_pmi);
        COMMON.saveValue("zoom_config_one_time_pwd", e.option_password4Schedule);
        COMMON.saveValue("zoom_config_jbh_pwd", e.option_password);
        COMMON.saveValue("zoom_config_all_pmi_pwd", e.option_password4PMI);
        e.zoom_config_pwdtype = COMMON.getValue("zoom_config_pwdtype");
        e.zoom_config_pacindex = COMMON.getValue("zoom_config_pacindex");
        COMMON.saveValue("enableAuthentication", e.enableAuthentication);
        if (e.updateAuthOptionItem) {
            COMMON.setUpdateAuthOptionItem(e.updateAuthOptionItem)
        }
        e.updateAuthOptionItem = JSON.stringify(COMMON.getUpdateAuthOptionItem());
        if (e.jbhTimeMinutes) {
            COMMON.setJbhTimeMinutes(e.jbhTimeMinutes);
            delete e.jbhTimeMinutes
        }
        COMMON.saveValue("zoom_config_althost", e.zoom_config_alternativehost);
        COMMON.saveValue("zoom_config_rectype", e.record_type);
        COMMON.saveValue("zoom_config_joinurl", e.zoom_config_joinurl);
        COMMON.saveValue("zoom_option_require_reg", e.zoom_option_require_reg);
        e.zoom_config_fixed_popup = COMMON.getValue("zoom_config_fixed_popup");
        e.require_reg = e.zoom_option_require_reg;
        delete e.zoom_option_require_reg;
        if (e.zoom_config_pmi_saved_pwd) {
            e.pmi_saved_pwd = e.zoom_config_pmi_saved_pwd;
            delete e.zoom_config_pmi_saved_pwd
        } else {
            e.pmi_saved_pwd = COMMON.getPmiSavedPwd()
        }
        COMMON.saveZoomSetting(e, o, function(e) {}, function() {})
    },
    updateSettingForQucik: function(e, o) {
        let t = COMMON.getLocalStorageZoomOptions();
        if (e.changepwd) {
            COMMON.saveValue("zoom_config_pmi_saved_pwd", e.password);
            t.pmi_saved_pwd = e.password
        }
        if (e.mandatorypwd) {
            let e = false;
            try {
                e = COMMON.getZoomData().scheduleDefaultLockOption.password === "true"
            } catch (e) {}
            if (e) {
                COMMON.saveValue("zoom_config_jbh_pwd", true);
                t.option_password = true
            } else {
                COMMON.saveValue("zoom_config_all_pmi_pwd", true);
                t.option_password4PMI = true
            }
        }
        COMMON.saveZoomSetting(t, o, function(e) {}, function() {})
    },
    getLocalStorageZoomOptions: function() {
        return {
            zoom_config_schedule_for: COMMON.getValue("zoom_config_schedule_for"),
            zoom_config_pmi: !!COMMON.getValue("zoom_config_pmi"),
            zoom_config_jbh: !!COMMON.getValue("zoom_config_jbh"),
            public_cal: !!COMMON.getValue("zoom_config_public_cal"),
            mute_upon_entry: !!COMMON.getValue("zoom_config_mute_upon_entry"),
            waiting_room: !!COMMON.getValue("zoom_config_waiting_room"),
            zoom_config_video_host: COMMON.getValue("zoom_config_video_host") || "off",
            zoom_config_video_participants: COMMON.getValue("zoom_config_video_participants") || "off",
            zoom_config_audio: COMMON.getValue("zoom_config_audio") || "both",
            zoom_config_pacindex: COMMON.getValue("zoom_config_pacindex"),
            zoom_config_pwdtype: COMMON.getValue("zoom_config_pwdtype") || "1",
            record_type: COMMON.getValue("zoom_config_rectype"),
            zoom_config_watermark: !!COMMON.getValue("zoom_config_watermark"),
            zoom_config_audiomark: !!COMMON.getValue("zoom_config_audiomark"),
            enableAuthentication: !!COMMON.getValue("enableAuthentication"),
            updateAuthOptionItem: COMMON.getUpdateAuthOptionItem(),
            zoom_config_alternativehost: COMMON.getValue("zoom_config_althost"),
            zoom_config_fixed_popup: !!COMMON.getValue("zoom_config_fixed_popup"),
            zoom_config_joinurl: COMMON.getValue("zoom_config_joinurl") == null ? true : !!COMMON.getValue("zoom_config_joinurl"),
            require_reg: !!COMMON.getValue("zoom_option_require_reg"),
            pmi_saved_pwd: COMMON.getPmiSavedPwd(),
            option_password4Schedule: !!COMMON.getValue("zoom_config_one_time_pwd"),
            option_password: !!COMMON.getValue("zoom_config_jbh_pwd"),
            option_password4PMI: !!COMMON.getValue("zoom_config_all_pmi_pwd")
        }
    },
    validAlternateHost: function(e, o, t) {
        var i = {
            alternativehost: e
        };
        COMMON.populateZak(i);
        $.ajax({
            type: "POST",
            url: COMMON.getUserBaseUrl() + COMMON.validAlternativeHost,
            data: i,
            async: false,
            timeout: 6e3,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "x-zm-cluster-id": COMMON.getClusterHeader(),
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(e) {
                o(e)
            },
            error: function(e) {
                t(e)
            }
        })
    },
    checkSyncForDataVersion: function() {
        if (!(parseInt(COMMON.getValue("dataVersion")) > 0)) {
            COMMON.toSyncImmediate().done(function(e) {
                COMMON.saveValue("dataVersion", "1")
            }).fail(function() {
                COMMON.saveValue("dataVersion", "1")
            })
        }
    },
    saveZoomSetting: function(e, o, t, i, a) {
        e.zoom_config_alternativehost = (e.zoom_config_alternativehost || "").replace(/,/g, ";");
        var n = {
            ext_version: APPCONFIG.extVersion
        };
        COMMON.populateZak(n);
        $.extend(n, e);
        $.ajax({
            type: "POST",
            url: COMMON.getUserBaseUrl() + COMMON.saveSettingURL,
            timeout: 1e4,
            data: n,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-Requested-From": "ZOOM-EXTENSION",
                "x-zm-cluster-id": COMMON.getClusterHeader()
            },
            dataType: "json",
            success: function(e) {
                var a = e.result;
                if (e && e.status) {
                    COMMON.saveZoomZakRequestToken(a["_zm_zak"]);
                    COMMON.saveZoomDataModifiedDate(new Date);
                    COMMON.saveValue("zoom_config_fte", false);
                    o()
                } else if (e.errorCode == 1113 || e.errorCode == 1114 || e.errorCode == 1115) {
                    t(e)
                } else if (e.errorCode == 201) {
                    if ($.type(i) === "function") {
                        i()
                    }
                } else {
                    alert(e.errorMessage)
                }
            },
            complete: function() {
                if ($.type(a) === "function") {
                    a()
                }
            }
        })
    },
    govLogin: function(e, o, t, i, a, n, r, s) {
        var u = COMMON.getUserBaseUrl() + COMMON.loginUrl;
        if (e) {
            u = u + "?r_uid=1";
            COMMON._termAndlogin(o, t, u, a, r, s);
            return
        }
        if (i) {
            u = i + "/mimo/login"
        }
        COMMON._login(u, a, n, r, s)
    },
    login: function(e, o, t, i) {
        COMMON._login(COMMON.getUserBaseUrl() + COMMON.loginUrl, e, o, t, i)
    },
    _ssologin: function(e, o, t, i, a) {
        var n = e + "/" + COMMON.loginUrl;
        if (!e) {
            n = COMMON.getUserBaseUrl() + COMMON.loginUrl
        }
        COMMON._login(n, o, t, i, a)
    },
    _login: function(e, o, t, i, a) {
        $.ajax({
            type: "POST",
            url: e,
            data: {
                snstype: 1,
                accesstoken: o
            },
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(e) {
                if (e.status) {
                    var o = e.result;
                    if ($.type(o) !== "object") {
                        COMMON.recordZoomDataError(`${APPCONFIG.errors[1]} ${COMMON.convertToString(o)}`, "common.js--_login");
                        return
                    }
                    COMMON.saveZoomData(o);
                    COMMON.resetZoomOptions(o);
                    COMMON.saveSyncTime(new Date);
                    COMMON.toSyncEidMeetingMap();
                    i()
                } else {
                    COMMON.clearAllData();
                    a()
                }
            },
            error: function() {
                COMMON.clearAllData();
                a()
            }
        })
    },
    _termAndlogin: function(e, o, t, i, a, n) {
        $.ajax({
            type: "POST",
            url: t,
            data: {
                snstype: 1,
                first_name: e,
                last_name: o,
                term: true,
                accesstoken: i
            },
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(e) {
                if (e.status) {
                    var o = e.result;
                    if ($.type(o) !== "object") {
                        COMMON.recordZoomDataError(`${APPCONFIG.errors[1]} ${COMMON.convertToString(o)}`, "common.js--_termAndlogin");
                        return
                    }
                    COMMON.saveZoomData(o);
                    COMMON.resetZoomOptions(o);
                    COMMON.saveSyncTime(new Date);
                    COMMON.toSyncEidMeetingMap();
                    a()
                } else {
                    COMMON.clearAllData();
                    n()
                }
            },
            error: function() {
                COMMON.clearAllData();
                n()
            }
        })
    },
    signin: function(e, o, t, i) {
        $.ajax({
            type: "POST",
            timeout: 15e3,
            url: COMMON.getUserBaseUrl() + "signin",
            data: e,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(e) {
                if (e.status) {
                    o(e.result)
                } else {
                    t(e.errorMessage)
                }
            },
            complete: function(e, o) {
                i(o)
            }
        })
    },
    govSignin: function(e, o, t, i, a) {
        COMMON.saveValue("zoom_govurl", o.substring(0, o.indexOf("/signin")) + "/");
        $.ajax({
            type: "POST",
            timeout: 15e3,
            url: o,
            data: e,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(e) {
                if (e.status) {
                    t(e.result)
                } else {
                    i(e.errorMessage)
                }
            },
            complete: function(e, o) {
                a(o)
            }
        })
    },
    _signin: function(e, o, t, i, a) {
        $.ajax({
            type: "POST",
            timeout: 15e3,
            url: o,
            data: e,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(e) {
                if (e.status) {
                    t(e.result)
                } else {
                    i(e.errorMessage)
                }
            },
            complete: function() {
                a()
            }
        })
    },
    logout: function(e, o) {
        var t = COMMON.getZoomZakRequestToken();
        var i = {};
        COMMON.populateZak(i);
        if (t) {
            $.ajax({
                type: "POST",
                timeout: 1e4,
                url: COMMON.getUserBaseUrl() + COMMON.logoutUrl,
                data: i,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "x-zm-cluster-id": COMMON.getClusterHeader(),
                    "X-Requested-From": "ZOOM-EXTENSION"
                },
                dataType: "json",
                success: function(o) {
                    COMMON.clearAllData();
                    e()
                },
                error: function() {
                    COMMON.clearAllData();
                    e()
                }
            })
        } else {
            COMMON.clearAllData();
            e()
        }
    },
    resolveZoomUrl: function(e) {
        if (e.indexOf("?") >= 0) {
            e += "&"
        } else {
            e += "?"
        }
        var o = COMMON.getZoomZakRequestToken();
        if (o) {
            return e + "zak=" + COMMON.getZoomZakRequestToken()
        }
    },
    getMeetingWithVideoUrl: function() {
        return COMMON.resolveZoomUrl(COMMON.getUserBaseUrl() + "start/videomeeting")
    },
    getMeetingWithoutVideoUrl: function() {
        return COMMON.resolveZoomUrl(COMMON.getUserBaseUrl() + "start/webmeeting")
    },
    getMyMeetingsUrl: function() {
        return COMMON.getUserBaseUrl() + "profile"
    },
    getUserBaseUrl: function() {
        var e = COMMON.baseUrl;
        var o = COMMON.getZoomData();
        var t = COMMON.getValue("zoom_govurl") || "";
        if (t) {
            e = t
        } else if (o && o["_zm_baseurl"] && "" != o["_zm_baseurl"]) {
            e = COMMON.replaceComDomain(o["_zm_baseurl"] + "/")
        }
        return e
    },
    replaceComDomain: function(e) {
        return e
    },
    getClusterHeader: function() {
        return COMMON.getValue("zoom_cluster") || ""
    },
    getGoogleCalendarUrl: function(e) {
        Date.prototype.addHours = function(e) {
            this.setHours(this.getHours() + e);
            return this
        };

        function o(e) {
            return e.toISOString().replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.\d+Z/gi, "$1$2$3T$4$5$6Z")
        }
        var t = new Date,
            i, a, n;
        t.setHours(t.getHours() + 1);
        t.setMinutes(0);
        i = o(t);
        t.setHours(t.getHours() + 1);
        a = o(t);
        n = "http://calendar.google.com/calendar/event?action=TEMPLATE";
        n += "&dates=";
        n += i + "/" + a;
        n += "&trp=true&zoomrd=" + t.getTime();
        if (e) {
            n += "&zoompmi=true"
        }
        return n
    },
    resolveUserName: function(e) {
        e = $.trim(e);
        if (e.charAt(e.length - 1) === "s") {
            return e + "'"
        } else {
            return e + "'s"
        }
    },
    getZoomData: function() {
        let e = "";
        try {
            e = JSON.parse(COMMON.getValue("zoom_data"))
        } catch (e) {}
        return e
    },
    saveZoomData: function(e) {
        COMMON.dataValidityCheck(e);
        COMMON.saveValue("zoom_data", JSON.stringify(e));
        COMMON.saveZoomDataModifiedDate(new Date);
        COMMON.saveZoomZakRequestToken(e["_zm_zak"]);
        COMMON.saveValue("zoom_zpk_exp", e["_zm_zpk_exp"] || "");
        COMMON.saveValue("zoom_locale", e["_zm_locale"])
    },
    dataValidityCheck: function(e) {
        if ($.inArray(e.option_video_host, ["on", "off"]) < 0) {
            COMMON.recordZoomDataError(`option_video_host illegal: ${COMMON.convertToString(e.option_video_host)}`);
            e.option_video_host = "on"
        }
        if ($.inArray(e.option_video_participant, ["on", "off"]) < 0) {
            COMMON.recordZoomDataError(`option_video_participant illegal: ${COMMON.convertToString(e.option_video_participant)}`);
            e.option_video_participant = "on"
        }
        if ($.inArray(e.option_audio_type, ["telephony", "voip", "both", "other"]) < 0) {
            COMMON.recordZoomDataError(`option_audio_type illegal: ${COMMON.convertToString(e.option_audio_type)}`);
            e.option_audio_type = "both"
        }
        if ($.inArray(e.option_pmi_jbhpwd, [true, false]) < 0) {
            COMMON.recordZoomDataError(`option_pmi_jbhpwd illegal: ${COMMON.convertToString(e.option_pmi_jbhpwd)}`);
            e.option_pmi_jbhpwd = false
        }
        if ($.inArray(e.option_require_jbh, [true, false]) < 0) {
            COMMON.recordZoomDataError(`option_require_jbh illegal: ${COMMON.convertToString(e.option_require_jbh)}`);
            e.option_require_jbh = false
        }
        if (e.PMI !== "0" && !/^\d+-\d+-\d+$/.test(e.PMI)) {
            COMMON.recordZoomDataError(`PMI illegal: ${COMMON.convertToString(e.PMI)}`);
            e.PMI = "0"
        }
        if ($.inArray(e.option_use_pmi, [true, false]) < 0) {
            COMMON.recordZoomDataError(`option_use_pmi illegal: ${COMMON.convertToString(e.option_use_pmi)}`);
            e.option_use_pmi = false
        }
        if ($.inArray(e.option_require_pwd, [true, false]) < 0) {
            COMMON.recordZoomDataError(`option_require_pwd illegal: ${COMMON.convertToString(e.option_require_pwd)}`);
            e.option_require_pwd = false
        }
        if ($.inArray(e.option_pwd_type, ["1", "2"]) < 0) {
            COMMON.recordZoomDataError(`option_pwd_type illegal: ${COMMON.convertToString(e.option_pwd_type)}`);
            e.option_pwd_type = "1"
        }
        if ($.inArray(e.option_joinurl, [true, false]) < 0) {
            COMMON.recordZoomDataError(`option_joinurl illegal: ${COMMON.convertToString(e.option_joinurl)}`);
            e.option_joinurl = false
        }
        if ($.inArray(e.option_watermark, [true, false]) < 0) {
            COMMON.recordZoomDataError(`option_watermark illegal: ${COMMON.convertToString(e.option_watermark)}`);
            e.option_watermark = false
        }
        if ($.inArray(e.option_audio_watermark, [true, false, undefined]) < 0) {
            COMMON.recordZoomDataError(`option_audio_watermark illegal: ${COMMON.convertToString(e.option_audio_watermark)}`);
            delete e.option_audio_watermark
        }
        if ($.inArray(e.option_mute_upon_entry, [true, false]) < 0) {
            COMMON.recordZoomDataError(`option_mute_upon_entry illegal: ${COMMON.convertToString(e.option_mute_upon_entry)}`);
            e.option_mute_upon_entry = false
        }
        if ($.inArray(e.option_waiting_room, [true, false]) < 0) {
            COMMON.recordZoomDataError(`option_waiting_room illegal: ${COMMON.convertToString(e.option_waiting_room)}`);
            e.option_waiting_room = false
        }
        if ($.inArray(e.option_public_cal, [true, false]) < 0) {
            COMMON.recordZoomDataError(`option_public_cal illegal: ${COMMON.convertToString(e.option_public_cal)}`);
            e.option_public_cal = false
        }
        if ($.type(e.scheduleDefaultLockOption) !== "object") {
            COMMON.recordZoomDataError(`scheduleDefaultLockOption illegal: ${COMMON.convertToString(e.scheduleDefaultLockOption)}`);
            e.scheduleDefaultLockOption = {}
        }
        if ($.inArray(e.option_fte, [true, false]) < 0) {
            COMMON.recordZoomDataError(`option_fte illegal: ${COMMON.convertToString(e.option_fte)}`);
            e.option_fte = false
        }
        if ($.type(e.option_schedulefor_host) !== "string") {
            COMMON.recordZoomDataError(`option_schedulefor_host illegal: ${COMMON.convertToString(e.option_schedulefor_host)}`);
            e.option_schedulefor_host = ""
        }
        if (e.option_pacindex === undefined) {
            e.option_pacindex = "1"
        } else if ($.inArray(e.option_pacindex, ["1", "2"]) < 0) {
            COMMON.recordZoomDataError(`option_pacindex illegal: ${COMMON.convertToString(e.option_pacindex)}`);
            e.option_pacindex = "1"
        }
        if ($.inArray(e.option_enforce_login, [true, false]) < 0) {
            COMMON.recordZoomDataError(`option_enforce_login illegal: ${COMMON.convertToString(e.option_enforce_login)}`);
            e.option_enforce_login = false
        }
        if ($.type(e.option_domain_info) !== "string") {
            COMMON.recordZoomDataError(`option_domain_info illegal: ${COMMON.convertToString(e.option_domain_info)}`);
            e.option_domain_info = ""
        }
        if (e.alt_hosts !== undefined && e.alt_hosts !== "" && $.type(e.alt_hosts) !== "array") {
            COMMON.recordZoomDataError(`alt_hosts illegal: ${COMMON.convertToString(e.alt_hosts)}`);
            e.alt_hosts = ""
        }
        if ($.inArray(e.option_fixed_popup, [true, false]) < 0) {
            COMMON.recordZoomDataError(`option_fixed_popup illegal: ${COMMON.convertToString(e.option_fixed_popup)}`);
            e.option_fixed_popup = false
        }
        if (e._zm_locale === null) {
            e._zm_locale = "en_US"
        } else if ($.type(e._zm_locale) !== "string") {
            COMMON.recordZoomDataError(`_zm_locale illegal: ${COMMON.convertToString(e._zm_locale)}`);
            e._zm_locale = "en_US"
        }
        if ($.inArray(e.option_record_type, [-1, 0, 1, 2]) < 0) {
            COMMON.recordZoomDataError(`option_record_type illegal: ${COMMON.convertToString(e.option_record_type)}`);
            e.option_record_type = -1
        }
        if ($.type(e._zm_cluster) !== "string") {
            COMMON.recordZoomDataError(`_zm_cluster illegal: ${COMMON.convertToString(e._zm_cluster)}`);
            e._zm_cluster = ""
        }
        if ($.inArray(e.option_require_reg, [true, false]) < 0) {
            COMMON.recordZoomDataError(`option_require_reg illegal: ${COMMON.convertToString(e.option_require_reg)}`);
            e.option_require_reg = false
        }
        if ($.type(e.option_pmi_savepwd) !== "string") {
            COMMON.recordZoomDataError(`option_pmi_savepwd illegal: ${COMMON.convertToString(e.option_pmi_savepwd)}`);
            e.option_pmi_savepwd = ""
        }
        if (e.authentication === undefined) {
            e.authentication = {
                support: false,
                enable: false,
                locked: false,
                optionLists: [],
                updateItem: "",
                enableAuthentication: false
            }
        } else if ($.type(e.authentication) !== "object") {
            COMMON.recordZoomDataError(`authentication illegal: ${COMMON.convertToString(e.authentication)}`);
            e.authentication = {
                support: false,
                enable: false,
                locked: false,
                optionLists: [],
                updateItem: "",
                enableAuthentication: false
            }
        } else {
            if ($.type(e.authentication.updateItem) !== "string") {
                COMMON.recordZoomDataError(`authentication.updateItem illegal: ${COMMON.convertToString(e.authentication.updateItem)}`);
                e.authentication.updateItem = ""
            } else {
                let o = e.authentication.updateItem;
                if (o) {
                    try {
                        e.authentication.updateItem = JSON.parse(o) || ""
                    } catch (o) {
                        COMMON.recordZoomDataError(`authentication.updateItem cannot be parsed into a json object: ${COMMON.convertToString(e.authentication.updateItem)}`);
                        e.authentication.updateItem = COMMON.getUpdateAuthOptionItem()
                    }
                }
            }
            if ($.type(e.authentication.optionLists) !== "array") {
                COMMON.recordZoomDataError(`authentication.optionLists illegal: ${COMMON.convertToString(e.authentication.optionLists)}`);
                e.authentication.optionLists = []
            } else {
                let i = e.authentication.optionLists;
                for (var o = 0, t = i.length; o < t; o++) {
                    let t = i[o];
                    if ($.type(t) !== "object") {
                        COMMON.recordZoomDataError(`authentication.optionLists's items illegal: ${COMMON.convertToString(t)}`);
                        e.authentication.optionLists.splice(o, 1);
                        o--
                    }
                }
                if (e.authentication.updateItem) {
                    if (e.authentication.enable) {
                        let o = COMMON.getType0ItemInAuth(e.authentication.optionLists);
                        if (o && e.authentication.updateItem.type == 0 && o.id !== e.authentication.updateItem.id) {
                            e.authentication.updateItem = ""
                        }
                    } else {
                        if (i.length == 1 && e.authentication.updateItem.type == 0) {
                            e.authentication.optionLists = []
                        }
                    }
                }
            }
        }
    },
    getType0ItemInAuth: function(e) {
        for (var o = 0, t = e.length; o < t; o++) {
            let t = e[o];
            if (t && t.type == "0") {
                return t
            }
        }
        return ""
    },
    convertToString: function(e) {
        if (Object.is(e, NaN) || e === undefined) {
            return String(e)
        } else {
            let o = "";
            try {
                o = JSON.stringify(e)
            } catch (o) {
                COMMON.sendLog({
                    msgType: 4,
                    msg: {
                        msg: "convertToString failed, data: " + e,
                        errorStack: o.stack
                    }
                })
            }
            return o
        }
    },
    recordZoomDataError: function(e, o) {
        o = o || "common.js -- dataValidityCheck";
        COMMON.sendLog({
            msgType: 1,
            msg: {
                tag: "zoom_data error",
                msg: e,
                source: o
            }
        })
    },
    recordDataError: function(e, o) {
        COMMON.sendLog({
            msgType: 1,
            msg: {
                tag: "data error",
                msg: e,
                source: o
            }
        })
    },
    getPmiSavedPwd: function() {
        return COMMON.pwdDataValidity(COMMON.getValue("zoom_config_pmi_saved_pwd"))
    },
    pwdDataValidity: function(e) {
        e = $.trim(e).slice(0, 10);
        return e
    },
    resetZoomOptions: function(e) {
        COMMON.saveValue("zoom_config_video_host", e.option_video_host);
        COMMON.saveValue("zoom_config_video_participants", e.option_video_participant);
        COMMON.saveValue("zoom_config_audio", e.option_audio_type);
        COMMON.saveValue("zoom_config_pwdtype", e.option_pwd_type);
        COMMON.saveValue("zoom_config_one_time_pwd", !!e.option_password4Schedule);
        if (e.option_password !== undefined) {
            COMMON.saveValue("zoom_config_jbh_pwd", !!e.option_password)
        }
        COMMON.saveValue("zoom_config_all_pmi_pwd", !!e.option_password4PMI);
        COMMON.saveValue("zoom_config_jbh", e.option_require_jbh);
        COMMON.saveValue("zoom_config_joinurl", !!e.option_joinurl);
        COMMON.saveValue("zoom_config_watermark", e.option_watermark);
        COMMON.saveValue("zoom_config_audiomark", !!e.option_audio_watermark);
        COMMON.saveValue("zoom_config_mute_upon_entry", e.option_mute_upon_entry);
        COMMON.saveValue("zoom_config_waiting_room", e.option_waiting_room);
        COMMON.saveValue("zoom_config_public_cal", e.option_public_cal);
        COMMON.saveValue("zoom_config_pmi", "0" === e.PMI ? false : e.option_use_pmi || !!e["scheduleDefaultLockOption"] && "true" === e["scheduleDefaultLockOption"].usePMISchedule_locked);
        COMMON.saveValue("zoom_config_fte", e.option_fte);
        COMMON.saveValue("zoom_config_schedule_for", e.option_schedulefor_host);
        COMMON.saveValue("zoom_config_pacindex", e.option_pacindex);
        COMMON.saveValue("zoom_config_althost", e.alt_hosts || "");
        COMMON.saveValue("zoom_config_fixed_popup", !!e.option_fixed_popup);
        COMMON.saveValue("zoom_locale", e._zm_locale);
        COMMON.saveValue("zoom_config_rectype", e.option_record_type);
        COMMON.saveValue("zoom_cluster", e._zm_cluster || "");
        COMMON.saveValue("zoom_option_require_reg", Boolean(e.option_require_reg));
        COMMON.saveValue("zoom_config_pmi_saved_pwd", e.option_pmi_savepwd || e.option_pmipwd || "");
        COMMON.removeValue("zoom_govurl");
        let o = e.authentication,
            t;
        if (!o.locked && o.enableAuthentication !== undefined) {
            t = o.enableAuthentication
        } else {
            t = o.enable
        }
        COMMON.saveValue("enableAuthentication", Boolean(t));
        COMMON.setUpdateAuthOptionItem(o.updateItem)
    },
    setUpdateAuthOptionItem: function(e) {
        e = e || "";
        COMMON.saveValue("updateAuthOptionItem", JSON.stringify(e))
    },
    getUpdateAuthOptionItem: function() {
        let e = "";
        try {
            e = JSON.parse(COMMON.getValue("updateAuthOptionItem")) || ""
        } catch (e) {}
        return e
    },
    saveSyncTime: function(e) {
        COMMON.saveValue("zoom_sync_date", e.getTime())
    },
    removeZoomData: function() {
        COMMON.removeValue("zoom_data")
    },
    getZoomDataModifiedDate: function() {
        var e = COMMON.getValue("zoom_token_modified_date");
        if (e) {
            return new Date(parseInt(e, 10))
        }
        return undefined
    },
    saveZoomDataModifiedDate: function(e) {
        COMMON.saveValue("zoom_token_modified_date", e.getTime())
    },
    removeZoomDataModifiedDate: function() {
        COMMON.removeValue("zoom_token_modified_date")
    },
    hasZoomRqToken: function() {
        var e = COMMON.getZoomZakRequestToken();
        if (e) {
            return true
        } else {
            return false
        }
    },
    getZoomZakRequestToken: function() {
        var e = COMMON.getZoomDataModifiedDate();
        var o = COMMON.getExpirationTime();
        if (!e || e && new Date - e > o) {
            COMMON.clearAllData();
            return undefined
        }
        return COMMON.getValue("zoom_zak")
    },
    ssoCheck: function(e, o, t, i, a) {
        COMMON.removeValue("zoom_govurl");
        COMMON._ssoCheck(COMMON.getUserBaseUrl() + "mimo/ssocheck", e, o, t, i, a)
    },
    govSsoCheck: function(e, o, t, i, a) {
        COMMON._ssoCheck(e + "/mimo/ssocheck", o, t, i, a, function() {})
    },
    _ssoCheck: function(e, o, t, i, a, n) {
        $.ajax({
            type: "POST",
            timeout: 6e3,
            url: e,
            data: o,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json",
            success: function(e) {
                if (e.status && e.result && e.result.ssoVanityUrl) {
                    t(e.result.ssoVanityUrl)
                } else if (e.status && e.result && e.result.redirectUrl) {
                    n(e.result.redirectUrl)
                } else {
                    i()
                }
            },
            complete: function() {
                a()
            }
        })
    },
    toSync: function(e, o) {
        if (COMMON.hasZoomRqToken()) {
            var t = new Date;
            var i = new Date;
            var a = COMMON.getValue("zoom_sync_date");
            if (a) {
                i = new Date(parseInt(a, 10))
            } else {
                i = new Date(t.getTime() - 48 * 60 * 60 * 1e3)
            }
            var n = {
                ext_version: APPCONFIG.extVersion,
                snstype: 1,
                accesstoken: ""
            };
            COMMON.populateZak(n);
            if (t - i >= 12 * 60 * 60 * 1e3) {
                e();
                $.ajax({
                    type: "POST",
                    timeout: 5e3,
                    url: COMMON.getUserBaseUrl() + COMMON.loginUrl,
                    data: n,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "x-zm-cluster-id": COMMON.getClusterHeader(),
                        "X-Requested-From": "ZOOM-EXTENSION"
                    },
                    dataType: "json",
                    success: function(e) {
                        if (e.status) {
                            var o = e.result;
                            if ($.type(o) !== "object") {
                                COMMON.recordZoomDataError(`${APPCONFIG.errors[1]} ${COMMON.convertToString(o)}`, "common.js--toSync");
                                return
                            }
                            COMMON.saveZoomData(o);
                            COMMON.resetZoomOptions(o);
                            COMMON.saveSyncTime(new Date)
                        }
                    },
                    complete: function() {
                        o()
                    }
                })
            } else {
                o()
            }
        } else {
            e();
            o()
        }
    },
    toSyncImmediate: function() {
        let e = {
            ext_version: APPCONFIG.extVersion,
            snstype: 1,
            accesstoken: ""
        };
        COMMON.populateZak(e);
        return $.ajax({
            type: "POST",
            timeout: 5e3,
            url: COMMON.getUserBaseUrl() + COMMON.loginUrl,
            data: e,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "x-zm-cluster-id": COMMON.getClusterHeader(),
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json"
        }).done(function(e) {
            if (e.status) {
                let o = e.result;
                if ($.type(o) !== "object") {
                    COMMON.recordZoomDataError(`${APPCONFIG.errors[1]} ${COMMON.convertToString(o)}`, "common.js--toSyncImmediate");
                    return
                }
                COMMON.saveZoomData(o);
                COMMON.resetZoomOptions(o);
                COMMON.saveSyncTime(new Date)
            }
        })
    },
    getEidMeetingMap: function() {
        let e = JSON.parse(COMMON.getValue("zoom_eid_meeting_map"));
        if ($.type(e) !== "object" && $.type(e) !== "null") {
            COMMON.recordDataError(`${APPCONFIG.errors[14]} ${COMMON.convertToString(e)}`, "common.js -- getEidMeetingMap")
        }
        return e
    },
    setEidMeetingMap: function(e) {
        if ($.type(e) === "object") {
            COMMON.saveValue("zoom_eid_meeting_map", JSON.stringify(e))
        } else {
            COMMON.recordDataError(`${APPCONFIG.errors[13]} ${COMMON.convertToString(e)}`, "common.js -- setEidMeetingMap")
        }
    },
    checkSyncEidMeetingMap: function() {
        let e = COMMON.getEidMeetingMap();
        if (e && e.synctime && new Date - e.synctime < 12 * 60 * 60 * 1e3) {
            return false
        }
        return true
    },
    toSyncEidMeetingMap: function(e, o) {
        return;
        let t = {
            zak: COMMON.getZoomZakRequestToken(),
            prevdur: "7",
            nextdur: "7",
            limit: "1000"
        };
        return $.ajax({
            type: "POST",
            timeout: 5e3,
            url: COMMON.getUserBaseUrl() + COMMON.syncEidMeetingMapUrl,
            data: t,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "x-zm-cluster-id": COMMON.getClusterHeader(),
                "X-Requested-From": "ZOOM-EXTENSION"
            },
            dataType: "json"
        }).done(function(t) {
            if (t.status) {
                let i = t.result;
                if ($.type(i) !== "array") {
                    COMMON.recordDataError(`${APPCONFIG.errors[12]} ${COMMON.convertToString(i)}`, "common.js -- toSyncEidMeetingMap");
                    return
                }
                COMMON.converEidMeetingMap(i, e, o)
            }
        }).fail(function(e, o) {
            console.log("toSyncEidMeetingMap fail: ", o)
        })
    },
    converEidMeetingMap: function(e, o, t) {
        let i = {
            synctime: (new Date).getTime()
        };
        $.each(e, function(e, o) {
            if (o.calendarId && o.meetingNumber) {
                i[o.calendarId] = o.meetingNumber
            }
        });
        if (o && t) {
            i[o] = t
        }
        COMMON.setEidMeetingMap(i)
    },
    updateEidMeetingMap: function(e, o, t) {
        return;
        if (!e) {
            return
        }
        if (COMMON.checkSyncEidMeetingMap()) {
            COMMON.toSyncEidMeetingMap(e, o)
        } else {
            let t = COMMON.getEidMeetingMap();
            if (o) {
                t[e] = o
            } else if (t[e]) {
                delete t[e]
            }
            COMMON.setEidMeetingMap(t)
        }
    },
    saveZoomZakRequestToken: function(e) {
        COMMON.saveValue("zoom_zak", e || "")
    },
    getGoogleToken: function() {
        return COMMON.getValue("google_token")
    },
    saveGoogleToken: function(e) {
        COMMON.saveValue("google_token", e)
    },
    getExpirationTime: function() {
        var e = 2592e3 * 1e3;
        var o = COMMON.getValue("zoom_zpk_exp");
        if (o) {
            e = parseInt(o, 10) * 1e3
        }
        return e
    },
    removeGoogleToken: function() {
        COMMON.removeValue("google_token")
    },
    clearAllData: function() {
        COMMON.removeGoogleToken();
        COMMON.removeZoomData();
        COMMON.removeZoomDataModifiedDate();
        COMMON.removeValue("zoom_zpk");
        COMMON.removeValue("zoom_zak");
        COMMON.removeValue("zoom_zpk_exp");
        COMMON.removeValue("zoom_govurl");
        COMMON.removeValue("zoom_cluster");
        COMMON.removeValue("zoom_eid_meeting_map");
        COMMON.removeValue("zoom_config_one_time_pwd");
        COMMON.removeValue("zoom_config_jbh_pwd");
        COMMON.removeValue("zoom_config_all_pmi_pwd")
    },
    getValue: function(e) {
        var o = localStorage.getItem(e);
        if (o !== null) {
            o = COMMON.dataUntrans(o)
        }
        if (o === "false") {
            return false
        } else if (o === "true") {
            return true
        } else {
            return o
        }
    },
    saveValue: function(e, o) {
        o = COMMON.dataTrans(o);
        localStorage.setItem(e, o)
    },
    removeValue: function(e) {
        localStorage.removeItem(e)
    },
    getJbhTimeMinutes: function() {
        let e = COMMON.getValue("jbhTimeMinutes"),
            o = ["0", "5", "10", "15"];
        if ($.inArray(e, o) > -1) {
            return e
        }
        return ""
    },
    setJbhTimeMinutes: function(e) {
        let o = ["0", "5", "10", "15"];
        if ($.inArray(e, o) > -1) {
            COMMON.saveValue("jbhTimeMinutes", e)
        } else {
            console.log("Illegal value of jbhTimeMinutes to be saved.")
        }
    },
    generatePassword: function() {
        let e = [];
        for (let o = 0; o < 6; o++) {
            e.push(parseInt(Math.random() * 10, 10))
        }
        return e.join("")
    },
    getReturnChar: function() {
        var e = COMMON.getOS();
        if (e === "Windows") {
            return "\r\n"
        } else {
            return "\r"
        }
    },
    getOS: function() {
        var e = navigator.appVersion;
        if (e.indexOf("Win") >= 0) {
            return "Windows"
        } else if (e.indexOf("Mac") >= 0) {
            return "Mac"
        } else if (e.indexOf("X11") >= 0) {
            return "Unix"
        } else if (e.indexOf("Linux") >= 0) {
            return "Linux"
        } else {
            return "unknown"
        }
    },
    empty: function() {},
    generateAlphanumeric: function(e) {
        let o = [],
            t = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        for (let i = 0; i < e; i++) {
            o.push(t[parseInt(Math.random() * 62, 10)])
        }
        return o.join("")
    },
    dataTrans: function(e) {
        let o = "";
        try {
            let t = COMMON.utf8_to_b64(e),
                i = "",
                a = "";
            for (let e = 0, o = t.length; e < o; e++) {
                if (e % 2 == 0) {
                    i += t[e]
                } else {
                    a += t[e]
                }
            }
            let n = Math.floor(Math.random() * 7) + 3;
            o = COMMON.generateAlphanumeric(n) + COMMON.utf8_to_b64(i + "=#=#" + a) + n
        } catch (o) {
            COMMON.sendLog({
                msgType: 4,
                msg: {
                    msg: "dataTrans failed, data: " + e,
                    errorStack: o.stack
                }
            })
        }
        return o
    },
    dataUntrans: function(e) {
        let o = e;
        try {
            let t = COMMON.b64_to_utf8(e.substring(parseInt(e[e.length - 1]), e.length - 1)).split("=#=#");
            let i = t[0],
                a = t[1],
                n = "";
            for (let e = 0, o = i.length; e < o; e++) {
                n += i[e];
                if (a[e]) n += a[e]
            }
            o = COMMON.b64_to_utf8(n)
        } catch (o) {
            COMMON.sendLog({
                msgType: 4,
                msg: {
                    msg: "dataUntrans failed, data: " + e,
                    errorStack: o.stack
                }
            })
        }
        return o
    },
    utf8_to_b64: function(e) {
        return window.btoa(unescape(encodeURIComponent(e)))
    },
    b64_to_utf8: function(e) {
        return decodeURIComponent(escape(window.atob(e)))
    },
    signWithGoogle: function() {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(e) {
            let o = e[0].id;
            chrome.tabs.create({
                url: COMMON.getOAuthURL(),
                active: true
            }, function(e) {
                COMMON.saveValue("zoom_login_request_tabid", o);
                COMMON.saveValue("zoom_oauth_tabid", e.id)
            })
        })
    },
    ssoSignin: function(e, o) {
        COMMON.ssoCheck({
            email: e.email,
            domain: e.domain
        }, function(e) {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(o) {
                let t = o[0].id;
                chrome.tabs.create({
                    url: e,
                    active: true
                }, function(e) {
                    COMMON.saveValue("zoom_login_request_tabid", t);
                    COMMON.saveValue("zoom_oauth_tabid", e.id)
                })
            })
        }, function() {
            o({
                state: 2,
                msg: APPCONFIG.errors[0]
            })
        }, function() {
            o({
                state: 3
            })
        }, function(t) {
            checkGovPermission(function() {
                COMMON.govSsoCheck(t, {
                    email: e.email,
                    domain: e.domain
                }, function(e) {
                    COMMON.saveValue("zoom_govurl", e.substring(0, e.indexOf("/saml/login")) + "/");
                    chrome.tabs.query({
                        active: true,
                        currentWindow: true
                    }, function(o) {
                        let t = o[0].id;
                        chrome.tabs.create({
                            url: e,
                            active: true
                        }, function(e) {
                            COMMON.saveValue("zoom_login_request_tabid", t);
                            COMMON.saveValue("zoom_oauth_tabid", e.id)
                        })
                    })
                }, function() {
                    o({
                        state: 2,
                        msg: APPCONFIG.errors[0]
                    })
                }, function() {
                    o({
                        state: 3
                    })
                })
            })
        })
    },
    checkGovPermission: function(e) {
        chrome.permissions.contains({
            origins: ["https://*.zoomgov.com/"]
        }, function(o) {
            if (!o) {
                chrome.tabs.create({
                    url: chrome.extension.getURL("permission.html"),
                    selected: false
                }, function(e) {
                    chrome.tabs.update(e.id, {
                        selected: true
                    })
                })
            } else {
                e()
            }
        })
    },
    getLoginUrl: function(e) {
        var o;
        var t = /https:\/\/([^\/]+)/gi.exec(e);
        if (t && t.length) {
            o = t[0]
        }
        return o
    },
    workemailSignin: function(e, o) {
        COMMON.removeValue("zoom_govurl");
        COMMON.signin(e, function(t) {
            if (t instanceof Object && t.redirectUrl) {
                COMMON.checkGovPermission(function() {
                    COMMON.govSignin(e, t.redirectUrl, function() {
                        COMMON.login("", "", function() {
                            o({
                                state: 1
                            })
                        }, function() {
                            o({
                                state: 2,
                                msg: APPCONFIG.errors[2]
                            })
                        })
                    }, function() {}, function(e) {
                        let t = "";
                        if (e === "error") {
                            t = APPCONFIG.errors[3]
                        } else if (e === "timeout") {
                            t = APPCONFIG.errors[4]
                        }
                        o({
                            state: 3,
                            msg: t
                        })
                    })
                })
            } else if (t.indexOf("/signin") > 0) {
                var i = t.substring(0, t.indexOf("/signin")) + "/saml/login?from=extension";
                chrome.tabs.create({
                    url: i,
                    selected: false
                }, function(e) {
                    chrome.tabs.update(e.id, {
                        selected: true
                    });
                    COMMON.saveValue("zoom_oauth_tabid", e.id)
                })
            } else {
                let i = COMMON.getLoginUrl(t);
                let a;
                if (i) {
                    a = i + "/" + COMMON.loginUrl
                } else {
                    a = COMMON.getUserBaseUrl() + COMMON.loginUrl
                }
                let n = /https?:\/\/\w*\.?zoom\.com\.cn\/?/gi.exec(t);
                if (n && n.length && n[0].indexOf("zoom.com.cn") > 0) {
                    COMMON.checkCNPermission(function() {
                        COMMON._signin({
                            email: e.email,
                            password: e.password,
                            type: 100
                        }, i + "/signin", function() {
                            COMMON._login(a, "", "", function() {
                                o({
                                    state: 1
                                })
                            }, function() {
                                o({
                                    state: 2,
                                    msg: APPCONFIG.errors[2]
                                })
                            })
                        }, function() {
                            o({
                                state: 2,
                                msg: APPCONFIG.errors[2]
                            })
                        }, function() {
                            o({
                                state: 3,
                                msg: ""
                            })
                        })
                    })
                } else {
                    COMMON._login(a, "", "", function() {
                        o({
                            state: 1
                        })
                    }, function() {
                        o({
                            state: 2,
                            msg: APPCONFIG.errors[2]
                        })
                    })
                }
            }
        }, function(e) {
            o({
                state: 2,
                msg: APPCONFIG.errors[2]
            })
        }, function(e) {
            let t = "";
            if (e === "error") {
                t = APPCONFIG.errors[3]
            } else if (e === "timeout") {
                t = APPCONFIG.errors[4]
            }
            o({
                state: 3,
                msg: t
            })
        })
    },
    getLoginUrl: function(e) {
        var o;
        var t = /https:\/\/([^\/]+)/gi.exec(e);
        if (t && t.length) {
            o = t[0]
        }
        return o
    },
    checkCNPermission: function(e) {
        chrome.permissions.contains({
            origins: ["https://*.zoom.com.cn/"]
        }, function(o) {
            if (!o) {
                chrome.tabs.create({
                    url: chrome.extension.getURL("permission2.html"),
                    selected: false
                }, function(e) {
                    chrome.tabs.update(e.id, {
                        selected: true
                    })
                })
            } else {
                e()
            }
        })
    },
    sendLog: function(e) {
        if (e && e.msg) {
            let o = {
                msgType: e.msgType || 0,
                msg: COMMON.convertToString(e.msg),
                operaType: e.operaType || 0
            };
            COMMON.logDataArr.push(o);
            if (!COMMON.logTimeDelayer) {
                COMMON.logTimeDelayer = setTimeout(function() {
                    try {
                        COMMON.logSender()
                    } catch (e) {}
                    COMMON.logTimeDelayer = null
                }, 6e4)
            }
        }
    },
    logSender: function() {
        if (COMMON.logDataArr.length) {
            let e = COMMON.getUserBaseUrl() + COMMON.logUrl;
            let o = {
                msgType: 0,
                msg: JSON.stringify(COMMON.logDataArr),
                operaType: 0
            };
            COMMON.populateZak(o);
            COMMON.logDataArr = [];
            $.ajax({
                type: "POST",
                url: e,
                data: o,
                timeout: 5e3,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "x-zm-cluster-id": COMMON.getClusterHeader(),
                    "X-Requested-From": "ZOOM-EXTENSION"
                }
            })
        }
    }
};
window.addEventListener("error", e => {
    COMMON.sendLog({
        msgType: 1,
        msg: {
            msg: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            stack: e.error.stack
        }
    })
}, true);
export default COMMON;