require("../../common/manifest.js")
require("../../debug/GenerateTestUserSig.js")
require("../../common/vendor.js")
global.webpackJsonpMpvue([16], {
    "4USg": function (t, e, s) {
        "use strict";
        var i = s("Bi6f"), o = s("UQFV");
        var n = function (t) {
            s("fSYR")
        }, a = s("ybqe")(i.a, o.a, n, null, null);
        e.a = a.exports
    }, Bi6f: function (t, e, s) {
        "use strict";
        var i = s("lHA8"), o = s.n(i), n = s("c/Tr"), a = s.n(n), c = s("Xxa5"), r = s.n(c), l = s("exGp"), u = s.n(l),
            d = s("Gu7T"), m = s.n(d), v = s("Dd8w"), p = s.n(v), h = s("NYxO"), g = s("lRgn"), f = s("0xDb"),
            C = s("Srkd"), y = wx.createInnerAudioContext(), _ = wx.getRecorderManager(),
            M = {duration: 6e4, sampleRate: 44100, numberOfChannels: 1, encodeBitRate: 192e3, format: "aac"};
        e.a = {
            data: function () {
                return {
                    messageContent: "",
                    conversation: {},
                    messageKey: "",
                    lastMsgTime: "",
                    count: 15,
                    isEmojiOpen: !1,
                    isMoreOpen: !1,
                    isFocus: !1,
                    isGroup: !1,
                    messageList: [],
                    emojiName: g.b,
                    emojiMap: g.a,
                    emojiUrl: g.c,
                    height: 0,
                    modalVisible: !1,
                    downloadInfo: {},
                    percent: 0,
                    sysInfo: {},
                    customModalVisible: !1,
                    customData: "",
                    customDescription: "",
                    customExtension: "",
                    focusedInput: "",
                    safeBottom: 34,
                    isRecord: !1,
                    isRecording: !1,
                    canSend: !0,
                    startPoint: 0,
                    title: "正在录音",
                    rateModal: !1,
                    rate: 5,
                    isShow: !1,
                    faceUrl: "https://webim-1252463788.file.myqcloud.com/assets/face-elem/",
                    emojiShow: !0,
                    revokeModal: !1,
                    revokeMessage: {},
                    currentTime: 0,
                    currentTimeID: "",
                    bigEmojiList: [{
                        icon: "yz00",
                        list: ["yz00", "yz01", "yz02", "yz03", "yz04", "yz05", "yz06", "yz07", "yz08", "yz09", "yz10", "yz11", "yz12", "yz13", "yz14", "yz15", "yz16", "yz17"]
                    }, {
                        icon: "ys00",
                        list: ["ys00", "ys01", "ys02", "ys03", "ys04", "ys05", "ys06", "ys07", "ys08", "ys09", "ys10", "ys11", "ys12", "ys13", "ys14", "ys15"]
                    }, {
                        icon: "gcs00",
                        list: ["gcs00", "gcs01", "gcs02", "gcs03", "gcs04", "gcs05", "gcs06", "gcs07", "gcs08", "gcs09", "gcs10", "gcs11", "gcs12", "gcs13", "gcs14", "gcs15", "gcs16"]
                    }],
                    curItemIndex: 0,
                    curBigEmojiItemList: [],
                    groupAt: !1,
                    listType: "",
                    groupAtList: [],
                    oldLength: 0,
                    action: "call",
                    callType: 1,
                    showGroupMemberList: !1
                }
            }, onShow: function () {
                wx.setNavigationBarTitle({title: decodeURIComponent(this.set)}), this.isShow = !0, this.isRecord = !1;
                var t = this;
                this.currentTimeID = setInterval(function () {
                    t.currentTime = (new Date).getTime() / 1e3
                }, 3e3)
            }, onLoad: function (t) {
                var e = this;
                this.set = decodeURIComponent(t.toAccount), this.height = this.sysInfo.windowHeight;
                var s = wx.createSelectorQuery(), i = this;
                wx.$app.on(this.TIM.EVENT.MESSAGE_RECEIVED, function () {
                    s.select("#chat").boundingClientRect(function (t) {
                        t.bottom - i.height < 150 && i.scrollToBottom()
                    }).exec()
                });
                var o = setInterval(function () {
                    0 !== e.currentMessageList.length && (e.scrollToBottom(), clearInterval(o))
                }, 600);
                _.onStart(function () {
                    console.log("recorder start")
                }), _.onPause(function () {
                    console.log("recorder pause")
                }), _.onStop(function (t) {
                    if (console.log("recorder stop"), wx.hideLoading(), e.canSend) if (t.duration < 1e3) e.$store.commit("showToast", {title: "录音时间太短"}); else {
                        var s = wx.$app.createAudioMessage({
                            to: e.$store.getters.toAccount,
                            conversationType: e.$store.getters.currentConversationType,
                            payload: {file: t}
                        });
                        e.$store.commit("sendMessage", s), wx.$app.sendMessage(s)
                    }
                })
            }, onUnload: function () {
                var t = this;
                clearInterval(this.currentTimeID), wx.$app.setMessageRead({conversationID: this.$store.state.conversation.currentConversationID}), this.isEmojiOpen = !1, this.rateModal = !1, this.isMoreOpen = !1, this.messageContent = "", this.isShow = !1, getCurrentPages().find(function (e) {
                    return e.options.type === t.TIM.TYPES.CONV_GROUP
                }) && wx.switchTab({url: "../index/main"})
            }, onPullDownRefresh: function () {
                Object(f.e)(this.getMessageList, 1e3)()
            }, computed: p()({}, Object(h.c)({
                currentMessageList: function (t) {
                    for (var e = t.conversation.currentMessageList, s = 0; s < e.length; s++) {
                        if ("TIMFaceElem" === e[s].type) {
                            var i = e[s].payload.data;
                            e[s].payload.data = i.indexOf("@2x") > 0 ? i : i + "@2x"
                        }
                        if (0 === t.conversation.currentConversationID.indexOf("C2C") && "TIMCustomElem" === e[s].type && e[s].payload.data.indexOf("businessID") > -1 && (e[s].virtualDom = [{
                            name: "1v1call",
                            text: wx.$TRTCCallingComponent.extractCallingInfoFromMessage(e[s])
                        }]), 0 === t.conversation.currentConversationID.indexOf("GROUP") && "TIMCustomElem" === e[s].type && e[s].payload.data.indexOf("businessID") > -1) {
                            var o = JSON.parse(e[s].payload.data);
                            e[s].payload.data = wx.$TRTCCallingComponent.extractCallingInfoFromMessage(e[s]), e[s].payload.userIDList = [].concat(m()(o.inviteeList)), e[s].payload.operationType = 256, e[s].type = "TIMGroupTipElem", e[s].virtualDom = Object(C.a)(e[s])
                        }
                    }
                    return e
                }, selectedMember: function (t) {
                    return t.conversation.selectedMember
                }, groupProfile: function (t) {
                    return t.conversation.currentConversation.groupProfile
                }, currentConversation: function (t) {
                    return t.conversation.currentConversation
                }, myInfo: function (t) {
                    return t.user.myInfo
                }, sysInfo: function (t) {
                    return t.global.systemInfo
                }, currentGroupMemberList: function (t) {
                    return t.group.currentGroupMemberList
                }
            }), Object(h.b)(["isIphoneX"])), methods: {
                onChange: function (t) {
                    this.rate = t.mp.detail.index
                }, toSettingPage: function (t) {
                    wx.showModal({
                        title: "授权提示", content: t.content, success: function (e) {
                            e.confirm ? wx.openSetting({
                                success: function (e) {
                                    t.suc && t.suc(e)
                                }, fail: function () {
                                    t.fail && t.fail()
                                }
                            }) : t.cancel && t.cancel()
                        }
                    })
                }, handleLongPress: function (t) {
                    var e = this;
                    this.startPoint = t.touches[0], "record" === t.target.id && wx.getSetting({
                        success: function (t) {
                            var s = t.authSetting["scope.record"];
                            !0 === s ? (e.title = "正在录音", e.isRecording = !0, e.startRecording(), e.canSend = !0) : !1 === s && e.toSettingPage({
                                content: "请前往设置页打开麦克风",
                                suc: function (t) {
                                    t.authSetting["scope.record"] || (e.isRecord = !1)
                                },
                                fail: function () {
                                    e.isRecord = !1
                                },
                                cancel: function () {
                                    e.isRecord = !1
                                }
                            })
                        }, fail: function () {
                        }
                    })
                }, chooseRecord: function () {
                    var t = this;
                    this.isRecord = !this.isRecord, this.isRecord && wx.getSetting({
                        success: function (e) {
                            !1 === e.authSetting["scope.record"] && t.toSettingPage({
                                content: "请前往设置页打开麦克风",
                                suc: function (e) {
                                    e.authSetting["scope.record"] || (t.isRecord = !1)
                                },
                                fail: function () {
                                    t.isRecord = !1
                                },
                                cancel: function () {
                                    t.isRecord = !1
                                }
                            })
                        }, fail: function () {
                            wx.showToast({title: "获取授权信息失败", icon: "none", duration: 1500})
                        }
                    })
                }, handleTouchMove: function (t) {
                    this.isRecording && (this.startPoint.clientY - t.touches[t.touches.length - 1].clientY > 100 ? (this.title = "松开手指，取消发送", this.canSend = !1) : this.startPoint.clientY - t.touches[t.touches.length - 1].clientY > 20 ? (this.title = "上划可取消", this.canSend = !0) : (this.title = "正在录音", this.canSend = !0))
                }, handleTouchEnd: function () {
                    this.isRecording = !1, wx.hideLoading(), _.stop()
                }, startRecording: function () {
                    _.start(M)
                }, scrollToBottom: function () {
                    this.isShow && wx.pageScrollTo({scrollTop: 99999})
                }, customModal: function () {
                    this.customModalVisible = !this.customModalVisible, this.handleClose()
                }, sendCustomMessage: function () {
                    if (0 !== this.customData.length || 0 !== this.customDescription.length || 0 !== this.customExtension.length) {
                        var t = wx.$app.createCustomMessage({
                            to: this.$store.getters.toAccount,
                            conversationType: this.$store.getters.currentConversationType,
                            payload: {
                                data: this.customData,
                                description: this.customDescription,
                                extension: this.customExtension
                            }
                        });
                        this.$store.commit("sendMessage", t), wx.$app.sendMessage(t), this.customModal(), this.customData = "", this.customDescription = "", this.customExtension = ""
                    } else this.$store.commit("showToast", {title: "不能为空"})
                }, loseFocus: function () {
                    this.handleClose()
                }, handleModalShow: function () {
                    this.modalVisible = !this.modalVisible
                }, handleDownload: function (t) {
                    var e = t.fileUrl.slice(t.fileUrl.lastIndexOf(".")).toLowerCase();
                    ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf"].indexOf(e) > -1 ? (this.percent = 0, this.downloadInfo = t, this.handleModalShow()) : this.$store.commit("showToast", {
                        title: "小程序不支持该文件预览哦",
                        icon: "none",
                        duration: 2e3
                    })
                }, download: function () {
                    var t = this, e = wx.downloadFile({
                        url: t.downloadInfo.fileUrl, success: function (t) {
                            console.log("start downloading: ")
                        }, fail: function (e) {
                            e.errMsg;
                            t.$store.commit("showToast", {
                                title: "文件下载出错",
                                icon: "none",
                                duration: 1500
                            }), t.handleModalShow()
                        }, complete: function (s) {
                            e = null, wx.openDocument({
                                filePath: s.tempFilePath, success: function (e) {
                                    console.log("open file fail", e), t.$store.commit("showToast", {
                                        title: "打开文档成功",
                                        icon: "none",
                                        duration: 1e3
                                    }), t.percent = 0, t.handleModalShow()
                                }, fail: function (e) {
                                    console.log("open file fail", e), t.$store.commit("showToast", {
                                        title: "小程序不支持该文件预览哦",
                                        icon: "none",
                                        duration: 2e3
                                    }), t.handleModalShow()
                                }
                            })
                        }
                    });
                    e.onProgressUpdate(function (e) {
                        t.percent = e.progress
                    })
                }, toDetail: function (t) {
                    var e = t.userID;
                    if (e) wx.navigateTo({url: "../user-profile/main?userID=" + e}); else {
                        var s = this.currentConversation.conversationID;
                        if (this.isGroup = this.currentConversation.type === this.TIM.TYPES.CONV_GROUP, this.isGroup) wx.navigateTo({url: "../group-profile/main"}); else {
                            var i = s.substring(3);
                            wx.navigateTo({url: "../user-profile/main?userID=" + i})
                        }
                    }
                }, getMessageList: function () {
                    this.$store.dispatch("getMessageList"), wx.stopPullDownRefresh()
                }, handleEmoji: function () {
                    this.isFocus ? (this.isFocus = !1, this.isMoreOpen = !1, this.isEmojiOpen = !0) : (this.isEmojiOpen = !this.isEmojiOpen, this.isMoreOpen = !1)
                }, handleMore: function () {
                    this.isFocus ? (this.isFocus = !1, this.isEmojiOpen = !1, this.isMoreOpen = !0) : (this.isMoreOpen = !this.isMoreOpen, this.isEmojiOpen = !1)
                }, handleClose: function () {
                    this.rateModal = !1, this.isFocus = !1, this.isMoreOpen = !1, this.isEmojiOpen = !1
                }, inputChange: function (t) {
                    var e = t.mp.detail.value, s = e.length;
                    if (this.oldLength > s) return this.oldLength = s, void (this.groupAt = !1);
                    this.oldLength = e.length, this.currentConversation.type === this.TIM.TYPES.CONV_GROUP && "@" === e.substring(e.length - 1, e.length) && (this.groupAt = !0, this.listType = "groupAt", this.handleClose(), this.isRecord = !0, wx.navigateTo({url: "/pages/selected-members/main"})), " " === e.substring(e.length - 1, e.length) && -1 !== this.messageContent.indexOf("@ ") && (this.groupAt = !1, this.listType = "")
                }, isnull: function (t) {
                    if ("" === t) return !0;
                    return new RegExp("^[ ]+$").test(t)
                }, sendMessage: function () {
                    var t = this;
                    if (this.isnull(this.messageContent)) this.$store.commit("showToast", {title: "消息不能为空"}); else {
                        if (this.$store.getters.currentConversationType === this.TIM.TYPES.CONV_GROUP && this.groupAt) {
                            var e = wx.$app.createTextAtMessage({
                                to: this.$store.getters.toAccount,
                                conversationType: this.$store.getters.currentConversationType,
                                payload: {text: this.messageContent, atUserList: this.selectedMember}
                            }), s = this.$store.state.conversation.currentMessageList.length;
                            return this.$store.commit("sendMessage", e), wx.$app.sendMessage(e).catch(function () {
                                t.$store.commit("changeMessageStatus", s)
                            }), this.groupAt = !1, void (this.messageContent = "")
                        }
                        var i = wx.$app.createTextMessage({
                            to: this.$store.getters.toAccount,
                            conversationType: this.$store.getters.currentConversationType,
                            payload: {text: this.messageContent}
                        }), o = this.$store.state.conversation.currentMessageList.length;
                        this.$store.commit("sendMessage", i), wx.$app.sendMessage(i).then(function () {
                        }).catch(function () {
                            t.$store.commit("changeMessageStatus", o)
                        }), this.messageContent = ""
                    }
                    this.isFocus = !1, this.isEmojiOpen = !1, this.isMoreOpen = !1
                }, sendPhoto: function (t) {
                    var e = this, s = this;
                    "album" === t ? this.chooseImage(t) : "camera" === t && wx.getSetting({
                        success: function (i) {
                            !1 === i.authSetting["scope.camera"] ? e.toSettingPage({content: "请前往设置页打开摄像头"}) : i.authSetting["scope.camera"] ? s.chooseImage(t) : wx.authorize({
                                scope: "scope.camera",
                                success: function () {
                                    s.chooseImage(t)
                                }
                            })
                        }
                    })
                }, videoError: function (t) {
                    console.log(t), this.$store.commit("showToast", {
                        title: "视频出现错误，错误信息" + t.mp.detail.errMsg,
                        duration: 1500
                    })
                }, chooseImage: function (t) {
                    var e = this, s = {};
                    wx.chooseImage({
                        sourceType: [t], count: 1, success: function (t) {
                            s = wx.$app.createImageMessage({
                                to: e.$store.getters.toAccount,
                                conversationType: e.$store.getters.currentConversationType,
                                payload: {file: t},
                                onProgress: function (t) {
                                    e.percent = t
                                }
                            }), e.$store.commit("sendMessage", s), wx.$app.sendMessage(s).then(function () {
                                e.percent = 0
                            }).catch(function (t) {
                                console.log(t)
                            })
                        }
                    }), this.handleClose()
                }, previewImage: function (t) {
                    wx.previewImage({current: t, urls: [t]})
                }, chooseEmoji: function (t) {
                    this.messageContent += t
                }, handleResend: function (t) {
                    "fail" === t.status && wx.$app.resendMessage(t)
                }, sendSurvey: function () {
                    if (this.customExtension) {
                        var t = wx.$app.createCustomMessage({
                            to: this.$store.getters.toAccount,
                            conversationType: this.$store.getters.currentConversationType,
                            payload: {data: "survey", description: String(this.rate), extension: this.customExtension}
                        });
                        this.rate = 0, this.customExtension = "", this.$store.commit("sendMessage", t), wx.$app.sendMessage(t), this.handleClose()
                    } else this.$store.commit("showToast", {title: "建议不要为空哦！"})
                }, openAudio: function (t) {
                    var e = this;
                    y.src = t.url, y.play(), y.onPlay(function () {
                    }), y.onEnded(function () {
                        wx.hideToast()
                    }), y.onError(function () {
                        e.$store.commit("showToast", {title: "小程序暂不支持播放该音频格式", icon: "none", duration: 2e3})
                    })
                }, video: function () {
                    var t = this;
                    wx.chooseVideo({
                        sourceType: ["album", "camera"],
                        maxDuration: 60,
                        camera: "back",
                        success: function (e) {
                            var s = wx.$app.createVideoMessage({
                                to: t.$store.getters.toAccount,
                                conversationType: t.$store.getters.currentConversationType,
                                payload: {file: e}
                            });
                            t.$store.commit("sendMessage", s), wx.$app.sendMessage(s), t.handleClose()
                        }
                    })
                }, getRandomInt: function (t, e) {
                    return t = Math.ceil(t), e = Math.floor(e), Math.floor(Math.random() * (e - t)) + t
                }, call: function (t) {
                    var e = this.$store.getters.currentConversationType;
                    if (this.action = "call", this.userIDList = [], this.callType = t, "GROUP" === e) return this.action = "groupCall", void wx.navigateTo({url: "/pages/selected-members/main?fr=calling"});
                    this.sendCalling(e)
                }, selectUserList: function () {
                    this.sendCalling(this.$store.getters.currentConversationType)
                }, groupCall: function () {
                    this.userIDList = [].concat(m()(this.selectedMember)), this.sendCalling(this.$store.getters.currentConversationType), this.$store.commit("updateSelectedMember", [])
                }, sendCalling: function (t) {
                    var e = this;
                    return u()(r.a.mark(function s() {
                        var i, o, n;
                        return r.a.wrap(function (s) {
                            for (; ;) switch (s.prev = s.next) {
                                case 0:
                                    return i = !1, o = [e.myInfo.userID, e.$store.getters.toAccount], "GROUP" === t && (i = !0, o = [].concat(m()(e.userIDList))), s.next = 5, Object(f.b)(o);
                                case 5:
                                    n = s.sent, e.$store.commit("setCalling", !0), e.$store.commit("setCallData", {
                                        isFromGroup: i,
                                        action: e.action,
                                        sponsor: e.myInfo.userID,
                                        to: e.$store.getters.toAccount,
                                        userIDList: e.userIDList,
                                        avatarList: n,
                                        inviteData: {callType: e.callType}
                                    }), wx.switchTab({url: "/pages/index/main"}), e.handleClose();
                                case 10:
                                case"end":
                                    return s.stop()
                            }
                        }, s, e)
                    }))()
                }, handleEmojiShow: function () {
                    this.emojiShow = !0
                }, handleMessage: function (t) {
                    if (t.from === this.myInfo.userID) {
                        (new Date).getTime() - 1e3 * t.time < 12e4 && (this.revokeModal = !0, this.revokeMessage = t)
                    }
                }, handleRevokeMessage: function () {
                    var t = this;
                    wx.$app.revokeMessage(this.revokeMessage).then(function (e) {
                        t.revokeModal = !1, t.$store.commit("showToast", {title: "撤回成功", duration: 500})
                    })
                }, reEdit: function (t) {
                    this.messageContent = t.payload.text
                }
            }, watch: {
                selectedMember: function (t) {
                    var e = this;
                    if (t.length > 0 && "groupCall" === this.action) setTimeout(function () {
                        e.groupCall()
                    }, 500); else {
                        var s = [];
                        "groupAt" === this.listType && (t.forEach(function (t) {
                            e.currentGroupMemberList.map(function (e) {
                                t === e.userID && s.push(e.nameCard || e.nick || e.userID), "__kImSDK_MesssageAtALL__" === t && s.push("所有人")
                            })
                        }), (s = a()(new o.a([].concat(m()(s))))).forEach(function (t, s) {
                            e.messageContent += 0 === s ? t + " " : "@" + t + " "
                        }))
                    }
                }
            }
        }
    }, UQFV: function (t, e, s) {
        "use strict";
        var i = {
            render: function () {
                var t = this, e = t.$createElement, s = t._self._c || e;
                return s("div", [s("div", {
                    staticClass: "chat",
                    style: {paddingBottom: t.isIphoneX ? t.safeBottom + 70 + "px" : "70px"},
                    attrs: {id: "chat", eventid: "35"},
                    on: {longpress: t.handleLongPress, touchmove: t.handleTouchMove, touchend: t.handleTouchEnd}
                }, [s("div", {
                    staticClass: "record-modal",
                    class: t.isRecording ? "" : "modal-display"
                }, [t._m(0), t._v(" "), s("div", {staticClass: "modal-title"}, [t._v("\n        " + t._s(t.title) + "\n      ")])]), t._v(" "), s("i-modal", {
                    attrs: {
                        title: "确认下载？",
                        visible: t.modalVisible,
                        eventid: "0",
                        mpcomid: "0"
                    }, on: {ok: t.download, cancel: t.handleModalShow}
                }, [s("div", {staticClass: "input-wrapper"}, [t._v("\n        进度" + t._s(t.percent) + "%\n      ")])]), t._v(" "), s("i-modal", {
                    attrs: {
                        title: "发送自定义消息",
                        visible: t.customModalVisible,
                        eventid: "4",
                        mpcomid: "1"
                    }, on: {ok: t.sendCustomMessage, cancel: t.customModal}
                }, [s("div", {staticClass: "custom-wrapper"}, [t.customModalVisible ? s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model.lazy:value",
                        value: t.customData,
                        expression: "customData",
                        modifiers: {"lazy:value": !0}
                    }],
                    staticClass: "custom-input",
                    class: {"input-focus": "data" === t.focusedInput},
                    attrs: {type: "text", placeholder: "输入数据", eventid: "1"},
                    domProps: {value: t.customData},
                    on: {
                        focus: function (e) {
                            t.focusedInput = "data"
                        }, blur: function (e) {
                            t.focusedInput = ""
                        }, input: function (e) {
                            e.target.composing || (t.customData = e.target.value)
                        }
                    }
                }) : t._e(), t._v(" "), t.customModalVisible ? s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model.lazy:value",
                        value: t.customDescription,
                        expression: "customDescription",
                        modifiers: {"lazy:value": !0}
                    }],
                    staticClass: "custom-input",
                    class: {"input-focus": "desc" === t.focusedInput},
                    attrs: {type: "text", placeholder: "输入描述", eventid: "2"},
                    domProps: {value: t.customDescription},
                    on: {
                        focus: function (e) {
                            t.focusedInput = "desc"
                        }, blur: function (e) {
                            t.focusedInput = ""
                        }, input: function (e) {
                            e.target.composing || (t.customDescription = e.target.value)
                        }
                    }
                }) : t._e(), t._v(" "), t.customModalVisible ? s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model.lazy:value",
                        value: t.customExtension,
                        expression: "customExtension",
                        modifiers: {"lazy:value": !0}
                    }],
                    staticClass: "custom-input",
                    class: {"input-focus": "ext" === t.focusedInput},
                    attrs: {type: "text", placeholder: "输入其他", eventid: "3"},
                    domProps: {value: t.customExtension},
                    on: {
                        focus: function (e) {
                            t.focusedInput = "ext"
                        }, blur: function (e) {
                            t.focusedInput = ""
                        }, input: function (e) {
                            e.target.composing || (t.customExtension = e.target.value)
                        }
                    }
                }) : t._e()])]), t._v(" "), s("i-modal", {
                    attrs: {
                        title: "对IM demo的评分和评价",
                        "i-class": "custom-modal",
                        visible: t.rateModal,
                        eventid: "7",
                        mpcomid: "3"
                    }, on: {
                        ok: t.sendSurvey, cancel: function (e) {
                            t.rateModal = !1
                        }
                    }
                }, [s("div", {staticClass: "custom-wrapper"}, [s("i-rate", {
                    attrs: {
                        value: t.rate,
                        eventid: "5",
                        mpcomid: "2"
                    }, on: {change: t.onChange}
                }), t._v(" "), t.rateModal ? s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model.lazy:value",
                        value: t.customExtension,
                        expression: "customExtension",
                        modifiers: {"lazy:value": !0}
                    }],
                    staticClass: "custom-input",
                    attrs: {type: "text", placeholder: "输入评价", eventid: "6"},
                    domProps: {value: t.customExtension},
                    on: {
                        input: function (e) {
                            e.target.composing || (t.customExtension = e.target.value)
                        }
                    }
                }) : t._e()], 1)]), t._v(" "), s("i-modal", {
                    attrs: {
                        title: "提示",
                        "i-class": "custom-modal",
                        visible: t.revokeModal,
                        eventid: "8",
                        mpcomid: "4"
                    }, on: {
                        ok: t.handleRevokeMessage, cancel: function (e) {
                            t.revokeModal = !1
                        }
                    }
                }, [s("div", {staticClass: "custom-wrapper"}, [t._v("\n        确定要撤回本消息吗？\n      ")])]), t._v(" "), s("div", {
                    attrs: {
                        id: "list",
                        eventid: "18"
                    }, on: {click: t.loseFocus}
                }, t._l(t.currentMessageList, function (e, i) {
                    return s("li", {
                        key: e.ID,
                        attrs: {id: e.ID}
                    }, ["TIMGroupTipElem" === e.type || "TIMGroupSystemNoticeElem" === e.type ? s("div", {staticClass: "notice"}, [s("div", {staticClass: "content"}, t._l(e.virtualDom, function (i, o) {
                        return s("span", {key: e.ID + o}, [(i.name, s("span", [t._v(t._s(i.text))]))])
                    }))]) : e.isRevoked ? s("div", {key: e.ID}, [s("div", {staticClass: "notice"}, [s("div", {staticClass: "content"}, [e.from === t.myInfo.userID ? [t._v("你撤回了一条消息")] : [t._v(t._s(e.from) + "撤回了一条消息")]], 2), t._v(" "), e.from === t.myInfo.userID ? [t.currentTime - e.time < 120 && "TIMTextElem" === e.type ? s("div", {
                        staticClass: "re-edit",
                        attrs: {eventid: "9_" + i},
                        on: {
                            click: function (s) {
                                t.reEdit(e)
                            }
                        }
                    }, [t._v("重新编辑")]) : t._e()] : t._e()], 2)]) : s("div", {class: "out" === e.flow ? "item-right" : "item-left"}, [s("div", {staticClass: "content"}, [s("div", {staticClass: "name"}, ["C2C" === t.currentConversation.type ? ["in" === e.flow ? [t._v("\n                  " + t._s(t.currentConversation.userProfile.nick || t.currentConversation.userProfile.userID) + "\n                ")] : [t._v("\n                  " + t._s(t.myInfo.nick || t.myInfo.userID) + "\n                ")]] : [t._v("\n                " + t._s(e.nameCard || e.nick || t.myInfo.nick || e.from) + "\n              ")]], 2), t._v(" "), s("div", {
                        staticClass: "wrapper",
                        attrs: {eventid: "15_" + i},
                        on: {
                            longpress: function (s) {
                                t.handleMessage(e)
                            }
                        }
                    }, ["C2C" === t.currentConversation.type && e.from === t.myInfo.userID && "success" === e.status ? s("div", {staticClass: "name read-receipts"}, [e.isPeerRead ? [t._v("已读")] : [t._v("未读")]], 2) : t._e(), t._v(" "), e.from === t.myInfo.userID ? s("div", {
                        staticClass: "load",
                        attrs: {eventid: "10_" + i},
                        on: {
                            click: function (s) {
                                t.handleResend(e)
                            }
                        }
                    }, [s("div", {class: e.status})]) : t._e(), t._v(" "), "TIMTextElem" === e.type ? s("div", {staticClass: "message"}, [s("div", {staticClass: "text-message"}, t._l(e.virtualDom, function (i, o) {
                        return s("span", {key: e.ID + o}, ["span" === i.name ? s("span", [t._v(t._s(i.text))]) : t._e(), t._v(" "), "img" === i.name ? s("image", {
                            staticStyle: {
                                width: "20px",
                                height: "20px"
                            }, attrs: {src: i.src}
                        }) : t._e()])
                    }))]) : "TIMImageElem" === e.type ? s("image", {
                        staticClass: "image-message",
                        attrs: {src: e.payload.imageInfoArray[1].url, mode: "widthFix", eventid: "11_" + i},
                        on: {
                            click: function (s) {
                                t.previewImage(e.payload.imageInfoArray[1].url)
                            }
                        }
                    }) : "TIMFileElem" === e.type ? s("div", {staticClass: "message"}, [s("div", {
                        staticClass: "file",
                        attrs: {eventid: "12_" + i},
                        on: {
                            click: function (s) {
                                t.handleDownload(e.payload)
                            }
                        }
                    }, [s("i-avatar", {
                        attrs: {
                            src: "../../../static/images/file.png",
                            size: "large",
                            shape: "square",
                            mpcomid: "14_" + i
                        }
                    }), t._v(" "), s("div", [t._v(t._s(e.payload.fileName))])], 1)]) : "TIMCustomElem" === e.type ? s("div", {staticClass: "message"}, ["survey" === e.payload.data ? s("div", {staticClass: "survey"}, [s("div", {staticClass: "title"}, [t._v("\n                    对IM DEMO的评分和建议\n                  ")]), t._v(" "), s("div", {staticClass: "description"}, [s("i-rate", {
                        attrs: {
                            disabled: "true",
                            value: e.payload.description,
                            mpcomid: "15_" + i
                        }
                    })], 1), t._v(" "), s("div", {staticClass: "suggestion"}, [s("div", [t._v(t._s(e.payload.extension))])])]) : "group_create" === e.payload.data ? s("div", [s("div", [t._v(t._s(e.payload.extension))])]) : "1v1call" === e.virtualDom[0].name ? s("div", {staticClass: "custom-elem"}, [s("div", [t._v(t._s(e.virtualDom[0].text))])]) : s("div", {staticClass: "custom-elem"}, [t._v("自定义消息")])]) : "TIMSoundElem" === e.type ? s("div", {
                        staticClass: "message",
                        attrs: {url: e.payload.url}
                    }, [s("div", {
                        staticClass: "box", attrs: {eventid: "13_" + i}, on: {
                            click: function (s) {
                                t.openAudio(e.payload)
                            }
                        }
                    }, [s("image", {
                        staticStyle: {height: "22px", width: "22px"},
                        attrs: {src: "/static/images/audio-play.png"}
                    }), t._v(" "), s("div", {staticStyle: {"padding-left": "4px"}}, [t._v(t._s(e.payload.second) + "s")])])]) : "TIMFaceElem" === e.type ? s("div", {staticClass: "message"}, [s("div", {staticClass: "custom-elem"}, [s("image", {
                        staticStyle: {
                            height: "90px",
                            width: "90px"
                        }, attrs: {src: t.faceUrl + e.payload.data + ".png"}
                    })])]) : "TIMVideoFileElem" === e.type ? s("div", {staticClass: "message"}, [s("video", {
                        staticClass: "video",
                        attrs: {
                            src: e.payload.videoUrl,
                            poster: e.payload.thumbUrl,
                            "object-fit": "contain",
                            eventid: "14_" + i
                        },
                        on: {error: t.videoError}
                    })]) : t._e()])]), t._v(" "), s("div", ["out" === e.flow ? s("i-avatar", {
                        attrs: {
                            "i-class": "avatar",
                            src: t.myInfo.avatar,
                            shape: "square",
                            mpcomid: "18_" + i
                        }
                    }) : "C2C" === t.currentConversation.type ? s("i-avatar", {
                        attrs: {
                            "i-class": "avatar",
                            shape: "square",
                            src: t.currentConversation.userProfile.avatar,
                            eventid: "16_" + i,
                            mpcomid: "16_" + i
                        }, on: {click: t.toDetail}
                    }) : s("i-avatar", {
                        attrs: {
                            "i-class": "avatar",
                            shape: "square",
                            src: e.avatar,
                            eventid: "17_" + i,
                            mpcomid: "17_" + i
                        }, on: {
                            click: function (s) {
                                t.toDetail({userID: e.from})
                            }
                        }
                    })], 1)])])
                })), t._v(" "), s("div", {
                    staticClass: "bottom",
                    style: {paddingBottom: t.isIphoneX ? t.safeBottom + "px" : ""}
                }, [s("div", {staticClass: "bottom-div"}, [s("div", {
                    staticClass: "btn-left",
                    attrs: {eventid: "19"},
                    on: {click: t.chooseRecord}
                }, [s("icon", {
                    attrs: {
                        src: t.isRecord ? "../../../static/images/record.png" : "../../../static/images/audio.png",
                        size: 28
                    }
                })], 1), t._v(" "), t.isRecord ? t._e() : s("div", {staticStyle: {width: "100%"}}, [s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model.lazy:value",
                        value: t.messageContent,
                        expression: "messageContent",
                        modifiers: {"lazy:value": !0}
                    }],
                    staticClass: "input",
                    attrs: {
                        type: "text",
                        "confirm-type": "send",
                        "cursor-spacing": "10",
                        focus: t.isFocus,
                        eventid: "20"
                    },
                    domProps: {value: t.messageContent},
                    on: {
                        focus: function (e) {
                            t.isFocus = !0
                        }, blur: function (e) {
                            t.isFocus = !1
                        }, input: [function (e) {
                            e.target.composing || (t.messageContent = e.target.value)
                        }, t.inputChange], confirm: t.sendMessage
                    }
                })]), t._v(" "), t.isRecord ? s("div", {
                    staticClass: "record",
                    attrs: {id: "record"}
                }, [t.isRecording ? t._e() : [t._v("\n            按住 说话\n          ")], t._v(" "), t.isRecording ? [t._v("\n            抬起 停止\n          ")] : t._e()], 2) : t._e(), t._v(" "), s("div", {
                    staticClass: "btn",
                    attrs: {eventid: "21"},
                    on: {
                        click: function (e) {
                            t.handleEmoji()
                        }
                    }
                }, [s("icon", {
                    attrs: {
                        src: "../../../static/images/smile.png",
                        size: 28
                    }
                })], 1), t._v(" "), 0 !== t.messageContent.length ? s("div", {
                    staticClass: "send",
                    attrs: {eventid: "23"},
                    on: {click: t.sendMessage}
                }, [t._v("\n            发送\n        ")]) : s("div", {
                    staticClass: "btn",
                    attrs: {eventid: "22"},
                    on: {
                        click: function (e) {
                            t.handleMore()
                        }
                    }
                }, [s("icon", {
                    attrs: {
                        src: "../../../static/images/more.png",
                        size: 28
                    }
                })], 1)]), t._v(" "), t.isEmojiOpen ? s("div", {staticClass: "bottom-emoji"}, [s("div", {staticClass: "emoji-tab"}, [s("div", {staticClass: "tabs"}, [s("div", {
                    staticClass: "single",
                    class: t.emojiShow ? "choosed" : "",
                    attrs: {eventid: "24"},
                    on: {click: t.handleEmojiShow}
                }, [s("image", {
                    staticStyle: {width: "100%", height: "100%"},
                    attrs: {src: "/static/images/smile.png"}
                })])])]), t._v(" "), t.emojiShow ? s("div", {staticClass: "emojis"}, t._l(t.emojiName, function (e, i) {
                    return s("div", {
                        key: e,
                        staticClass: "emoji",
                        attrs: {eventid: "25_" + i},
                        on: {
                            click: function (s) {
                                t.chooseEmoji(e)
                            }
                        }
                    }, [s("image", {
                        staticStyle: {width: "100%", height: "100%"},
                        attrs: {src: t.emojiUrl + t.emojiMap[e]}
                    })])
                })) : t._e()]) : t._e(), t._v(" "), t.isMoreOpen ? s("div", {staticClass: "bottom-image"}, [s("div", {staticClass: "images"}, [s("div", {
                    staticClass: "block",
                    attrs: {eventid: "26"},
                    on: {
                        click: function (e) {
                            t.sendPhoto("camera")
                        }
                    }
                }, [t._m(1), t._v(" "), s("div", {staticClass: "name"}, [t._v("\n              拍摄\n            ")])]), t._v(" "), s("div", {
                    staticClass: "block",
                    attrs: {eventid: "27"},
                    on: {
                        click: function (e) {
                            t.sendPhoto("album")
                        }
                    }
                }, [t._m(2), t._v(" "), s("div", {staticClass: "name"}, [t._v("\n              图片\n            ")])]), t._v(" "), s("div", {
                    staticClass: "block",
                    attrs: {eventid: "28"},
                    on: {
                        click: function (e) {
                            t.customModal()
                        }
                    }
                }, [t._m(3), t._v(" "), s("div", {staticClass: "name"}, [t._v("\n              自定义消息\n            ")])]), t._v(" "), s("div", {
                    staticClass: "block",
                    attrs: {eventid: "29"},
                    on: {
                        click: function (e) {
                            t.rateModal = !t.rateModal
                        }
                    }
                }, [t._m(4), t._v(" "), s("div", {staticClass: "name"}, [t._v("\n              评分\n            ")])])]), t._v(" "), s("div", {staticClass: "images"}, [s("div", {
                    staticClass: "block",
                    attrs: {eventid: "30"},
                    on: {click: t.video}
                }, [t._m(5), t._v(" "), s("div", {staticClass: "name"}, [t._v("\n              视频\n            ")])]), t._v(" "), s("div", {
                    staticClass: "block",
                    attrs: {eventid: "31"},
                    on: {
                        click: function (e) {
                            t.call(1)
                        }
                    }
                }, [t._m(6), t._v(" "), s("div", {staticClass: "name"}, [t._v("\n              音频通话\n            ")])]), t._v(" "), s("div", {
                    staticClass: "block",
                    attrs: {eventid: "32"},
                    on: {
                        click: function (e) {
                            t.call(2)
                        }
                    }
                }, [t._m(7), t._v(" "), s("div", {staticClass: "name"}, [t._v("\n              视频通话\n            ")])])])]) : t._e()]), t._v(" "), s("div", {staticClass: "float-button-list"}, ["C2C" === t.currentConversation.type ? s("img", {
                    staticClass: "video-icon",
                    attrs: {src: "/static/images/camera.png", eventid: "33"},
                    on: {
                        click: function (e) {
                            t.call(2)
                        }
                    }
                }) : t._e(), t._v(" "), s("img", {
                    attrs: {
                        src: "/static/images/conversation-profile.png",
                        eventid: "34"
                    }, on: {click: t.toDetail}
                })])], 1)])
            }, staticRenderFns: [function () {
                var t = this.$createElement, e = this._self._c || t;
                return e("div", {staticClass: "wrapper"}, [e("div", {staticClass: "modal-loading"})])
            }, function () {
                var t = this.$createElement, e = this._self._c || t;
                return e("div", {staticClass: "image"}, [e("image", {
                    staticClass: "icon",
                    attrs: {src: "/static/images/take-pic.png"}
                })])
            }, function () {
                var t = this.$createElement, e = this._self._c || t;
                return e("div", {staticClass: "image"}, [e("image", {
                    staticClass: "icon",
                    attrs: {src: "/static/images/picture.png"}
                })])
            }, function () {
                var t = this.$createElement, e = this._self._c || t;
                return e("div", {staticClass: "image"}, [e("image", {
                    staticClass: "icon",
                    attrs: {src: "/static/images/custom.png"}
                })])
            }, function () {
                var t = this.$createElement, e = this._self._c || t;
                return e("div", {staticClass: "image"}, [e("image", {
                    staticClass: "icon",
                    attrs: {src: "/static/images/rating.png"}
                })])
            }, function () {
                var t = this.$createElement, e = this._self._c || t;
                return e("div", {staticClass: "image"}, [e("image", {
                    staticClass: "icon",
                    attrs: {src: "/static/images/video-file.png"}
                })])
            }, function () {
                var t = this.$createElement, e = this._self._c || t;
                return e("div", {staticClass: "image"}, [e("image", {
                    staticClass: "icon",
                    attrs: {src: "/static/images/voice-call.png"}
                })])
            }, function () {
                var t = this.$createElement, e = this._self._c || t;
                return e("div", {staticClass: "image"}, [e("image", {
                    staticClass: "icon",
                    attrs: {src: "/static/images/video.png"}
                })])
            }]
        };
        e.a = i
    }, cSaW: function (t, e, s) {
        "use strict";
        Object.defineProperty(e, "__esModule", {value: !0});
        var i = s("5nAL"), o = s.n(i), n = s("4USg");
        new o.a(n.a).$mount()
    }, fSYR: function (t, e) {
    }
}, ["cSaW"]);