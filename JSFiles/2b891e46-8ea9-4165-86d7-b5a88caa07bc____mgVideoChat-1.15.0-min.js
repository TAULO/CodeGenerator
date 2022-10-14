/*
 magnoliyan
*/
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.findInternal = function(f, k, l) {
    f instanceof String && (f = String(f));
    for (var m = f.length, a = 0; a < m; a++) {
        var b = f[a];
        if (k.call(l, b, a, f))
            return {
                i: a,
                v: b
            }
    }
    return {
        i: -1,
        v: void 0
    }
}
;
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(f, k, l) {
    f != Array.prototype && f != Object.prototype && (f[k] = l.value)
}
;
$jscomp.getGlobal = function(f) {
    return "undefined" != typeof window && window === f ? f : "undefined" != typeof global && null != global ? global : f
}
;
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(f, k, l, m) {
    if (k) {
        l = $jscomp.global;
        f = f.split(".");
        for (m = 0; m < f.length - 1; m++) {
            var a = f[m];
            a in l || (l[a] = {});
            l = l[a]
        }
        f = f[f.length - 1];
        m = l[f];
        k = k(m);
        k != m && null != k && $jscomp.defineProperty(l, f, {
            configurable: !0,
            writable: !0,
            value: k
        })
    }
}
;
$jscomp.polyfill("Array.prototype.find", function(f) {
    return f ? f : function(f, l) {
        return $jscomp.findInternal(this, f, l).v
    }
}, "es6", "es3");
(function(f, k, l, m) {
    var a = {
        firefox: !1
    }
      , b = {};
    a.init = function(d) {
        a.config = d.rtc;
        a.firefox = -1 < navigator.userAgent.toLowerCase().indexOf("firefox");
        b = d;
        a.shim()
    }
    ;
    a.shim = function() {
        "addStream"in k.RTCPeerConnection.prototype || (k.RTCPeerConnection.prototype.addStream = function(a) {
            var d = this;
            a.getTracks().forEach(function(e) {
                d.addTrack(e, a)
            })
        }
        )
    }
    ;
    a._socket = null;
    a._events = {};
    a.on = function(d, b) {
        a._events[d] = a._events[d] || [];
        a._events[d].push(b)
    }
    ;
    a.fire = function(d, b) {
        a.debug("fired [" + d + "]");
        var e = a._events[d]
          , g = Array.prototype.slice.call(arguments, 1);
        if (e)
            for (var c = 0, h = e.length; c < h; c++)
                e[c].apply(null, g)
    }
    ;
    a.connections = {};
    a.connectionsLoaded = !1;
    a.id = null;
    a.compatible = !0;
    a.debug = function(a) {
        b.debug && console.log(a)
    }
    ;
    a.checkCompatibility = function(d, b, e) {
        e || (e = "call");
        a.compatible = !0;
        k.WebSocket || (d.websocket = !0,
        a.compatible = !1);
        k.RTCPeerConnection || k.PeerConnection || ("call" == e ? (d.peerconnection = !0,
        a.compatible = !1) : b.peerconnection = !0);
        navigator.mediaDevices.getUserMedia || ("call" == e ? (d.usermedia = !0,
        a.compatible = !1) : b.usermedia = !0);
        return a.compatible
    }
    ;
    a.loadDevices = function(a) {
        var d = {
            audio: [],
            video: []
        };
        navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices ? navigator.mediaDevices.enumerateDevices().then(function(e) {
            e.forEach(function(e) {
                "videoinput" === e.kind ? d.video.push({
                    value: e.deviceId,
                    text: e.label
                }) : "audioinput" === e.kind && d.audio.push({
                    value: e.deviceId,
                    text: e.label
                })
            });
            a(d)
        }) : a(d)
    }
    ;
    a.connect = function(d) {
        a._socket = new WebSocket(d);
        a._socket.onopen = function() {
            a.fire("connected")
        }
        ;
        a._socket.onmessage = function(d) {
            d = JSON.parse(d.data);
            a.debug("RECEIVED MESSAGE " + d.type);
            a.debug(d);
            a.fire(d.type, d.data)
        }
        ;
        a._socket.onerror = function(d) {
            a.debug("onerror");
            a.debug(d);
            a.fire("socket_error", d)
        }
        ;
        a._socket.onclose = function(d) {
            a.fire("socket_closed", {})
        }
    }
    ;
    a.on("connections", function(d) {
        a.connections = d;
        a.connectionsLoaded = !0
    });
    a.on("connectionId", function(d) {
        a.id = d.connectionId;
        a.fire("logged", d.data)
    });
    a.on("connection_add", function(d) {
        a.connections[d.connectionId] = d.data
    });
    a.on("connection_remove", function(d) {
        delete a.connections[d.connectionId]
        $('body').on('connection-ready', ()=>{
            a.fire("logged", d.data);
        });
    });
    a.on("call_invite", function(d) {
        a.setStatus(d.connectionId, "call_invited")
    });
    a.on("call_accept", function(d) {
        if (a.refuseIdleState(d.connectionId))
            return !1;
        a.setStatus(d.connectionId, "call_accepted");
        a.sdpOffer(d.connectionId)
    });
    a.setStatus = function(d, b) {
        a.debug("status [" + b + "] for connectionId: " + d);
        a.connections[d].status = b;
        a.fire("status", d, b)
    }
    ;
    a.refuseIdleState = function(d) {
        var b = d && "idle" == a.connections[d].status;
        b && a.debug("refusing idle state of connection id: " + d);
        return b
    }
    ;
    a.send = function(d) {
        a.debug("SENDING MSG " + d.type);
        a.debug(d);
        a._socket.send(JSON.stringify(d))
    }
    ;
    a.mediaReady = function() {
        a.send({
            type: "media_ready",
            data: {}
        })
    }
    ;
    a.rouletteNext = function() {
        a.send({
            type: "roulette_next",
            data: {}
        })
    }
    ;
    a.rouletteAccept = function(d) {
        a.send({
            type: "roulette_accept",
            data: {
                connectionId: d
            }
        })
    }
    ;
    a.chatMessage = function(d, b) {
        a.send({
            type: "chat_message",
            data: {
                connectionId: d,
                message: b
            }
        })
    }
    ;
    a.login = function(d) {
        a.send({
            type: "login",
            data: d
        })
    }
    ;
    a.invite = function(d, b) {
        a.debug("creating local media stream");
        a.setStatus(d, "call_inviting");
        a.createStream(d, b, function(e) {
            a.debug("inviting call for id: " + d);
            a.send({
                type: "call_invite",
                data: {
                    connectionId: d
                }
            })
        })
    }
    ;
    a.accept = function(d, b) {
        a.debug("creating local media stream");
        a.createStream(d, b, function(e) {
            a.debug("accepting call from id: " + d);
            a.send({
                type: "call_accept",
                data: {
                    connectionId: d
                }
            });
            a.setStatus(d, "call_accepting")
        })
    }
    ;
    a.drop = function(d, b, e) {
        a.debug("droping call");
        a.send({
            type: "call_drop",
            data: {
                connectionId: d
            }
        });
        a.connections[d] && a.stop(d, b, e)
    }
    ;
    a.busy = function(d) {
        a.debug("sending busy signal");
        a.send({
            type: "call_busy",
            data: {
                connectionId: d
            }
        })
    }
    ;
    a.stop = function(d, b, e) {
        if (!a.connections[d])
            return !1;
        !b && a.connections[d].pc && (a.connections[d].pc.close(),
        a.connections[d].pc = null);
        if (!e && a.connections[d].stream) {
            b = a.connections[d].stream.getTracks();
            for (var g in b)
                b[g].stop()
        }
        a.setStatus(d, "idle")
    }
    ;
    a.mergeConstraints = function(a, b) {
        for (var e in b.mandatory)
            a.mandatory[e] = b.mandatory[e];
        a.optional.concat(b.optional);
        return a
    }
    ;
    a.onCreateSessionDescriptionError = function(d) {
        a.debug("Failed to create session description: " + d.toString())
    }
    ;
    a.extractSdp = function(a, b) {
        return (a = a.match(b)) && 2 == a.length ? a[1] : null
    }
    ;
    a.setDefaultCodec = function(a, b) {
        a = a.split(" ");
        for (var e = [], d = 0, c = 0; c < a.length; c++)
            3 === d && (e[d++] = b),
            a[c] !== b && (e[d++] = a[c]);
        return e.join(" ")
    }
    ;
    a.removeCN = function(d, b) {
        for (var e = d[b].split(" "), g = d.length - 1; 0 <= g; g--) {
            var c = a.extractSdp(d[g], /a=rtpmap:(\d+) CN\/\d+/i);
            c && (c = e.indexOf(c),
            -1 !== c && e.splice(c, 1),
            d.splice(g, 1))
        }
        d[b] = e.join(" ");
        return d
    }
    ;
    a.preferAudioCodec = function(d) {
        if (!a.config.audio_receive_codec)
            return d;
        var b = a.config.audio_receive_codec.split("/");
        if (2 != b.length)
            return d;
        var e = b[0]
          , g = b[1];
        b = d.split("\r\n");
        for (var c = 0; c < b.length; c++)
            if (-1 !== b[c].search("m=audio")) {
                var h = c;
                break
            }
        if (null === h)
            return d;
        for (c = 0; c < b.length; c++)
            if (-1 !== b[c].search(e + "/" + g)) {
                (d = a.extractSdp(b[c], new RegExp(":(\\d+) " + e + "\\/" + g,"i"))) && (b[h] = a.setDefaultCodec(b[h], d));
                break
            }
        b = a.removeCN(b, h);
        return d = b.join("\r\n")
    }
    ;
    a.remoteSDReceive = function(d, b) {
        d.setRemoteDescription(new RTCSessionDescription(b)).then(function() {
            a.debug("Set remote session description success.");
            if (d.getRemoteStreams) {
                var e = d.getRemoteStreams();
                0 < e.length && 0 < e[0].getVideoTracks().length && a.debug("Waiting for remote video tracks")
            } else
                a.debug("getRemoteStreams does not exist on PC")
        }).catch(function(e) {
            a.debug("Set remote session description error " + e.toString())
        })
    }
    ;
    a.localSDSend = function(d, b, e, g) {
        e.sdp = a.preferAudioCodec(e.sdp);
        a.debug("Setting local sessionDescription and sending msg " + g);
        a.debug(e);
        d.setLocalDescription(e).then(function() {
            a.debug("Set local session description success.")
        }).catch(function(c) {
            a.debug("Set local session description error " + c.toString())
        });
        a.send({
            type: g,
            data: {
                connectionId: b,
                sdp: e
            }
        })
    }
    ;
    a.sdpOffer = function(d) {
        var b = a.createPeerConnection(d)
          , e = a.config.offerConstraints;
        a.debug("Sending offer to peer, with constraints: \n  '" + JSON.stringify(e) + "'.");
        b.createOffer(e).then(function(e) {
            a.localSDSend(b, d, e, "sdp_offer")
        }).catch(function(e) {
            a.onCreateSessionDescriptionError(e)
        });
        a.setStatus(d, "sdp_offering")
    }
    ;
    a.sdpAnswer = function(d) {
        a.debug("Answering call connectionId: " + d);
        var b = a.createPeerConnection(d);
        a.remoteSDReceive(b, a.connections[d].offerSdp);
        a.debug("Sending answer to peer, with constraints: \n  '" + JSON.stringify({}) + "'.");
        b.createAnswer().then(function(e) {
            a.localSDSend(b, d, e, "sdp_answer")
        }).catch(a.onCreateSessionDescriptionError);
        a.setStatus(d, "sdp_answering")
    }
    ;
    a.createStream = function(b, p, e, g) {
        e = e || function(c) {}
        ;
        g = g || function(c) {
            a.debug("Could not connect stream with error:");
            a.debug(c)
        }
        ;
        try {
            a.fire("media_request_start");
            var c = f.extend({}, a.config.mediaConstraints, p);
            navigator.mediaDevices.getUserMedia(c).then(function(h) {
                var d = function(c) {
                    a.fire("media_request_end");
                    if (a.refuseIdleState(b))
                        return h.stop(),
                        !1;
                    b && (a.connections[b].stream = h);
                    a.fire("stream_added", h, b);
                    e(h)
                };
                c.audioAppend ? a.addAudioTrack(h, d) : d(!0)
            }).catch(function(c) {
                a.fire("media_request_end");
                g(c);
                a.fire("stream_error", c)
            })
        } catch (h) {
            a.fire("media_request_end"),
            a.fire("stream_error", h)
        }
    }
    ;
    a.addAudioTrack = function(a, b) {
        navigator.mediaDevices.getUserMedia({
            audio: !0,
            video: !1
        }).then(function(e) {
            a.addTrack(e.getAudioTracks()[0]);
            b(!0)
        }).catch(function(e) {
            b(!1)
        })
    }
    ;
    a.createPeerConnection = function(b) {
        a.debug("createPeerConnection for id: " + b);
        try {
            a.connections[b].pc = new k.RTCPeerConnection(a.config.pcConfig),
            a.connections[b].pc.onicecandidate = function(e) {
                a.debug("pc.onicecandidate, event:");
                a.debug(e);
                e.candidate ? a.send({
                    type: "ice_candidate",
                    data: {
                        candidate: e.candidate.candidate,
                        connectionId: b,
                        label: e.candidate.sdpMLineIndex
                    }
                }) : a.debug("End of ICE candidates")
            }
            ,
            a.debug("Created RTCPeerConnnection with:\n  config: '" + JSON.stringify(a.config.pcConfig) + "';\n  constraints: '" + JSON.stringify(a.config.pcConstraints) + "'.")
        } catch (e) {
            return console.error(e),
            a.debug("Failed to create RTCPeerConnection, exception: " + e.message),
            a.fire("pc_error", e),
            alert("Cannot create PeerConnection object; Is the 'PeerConnection' flag enabled in about:flags?"),
            null
        }
        var d = a.connections[b].pc;
        d.onconnecting = function() {
            a.debug("Session connecting.")
        }
        ;
        d.onopen = function() {
            a.debug("Session opened.");
            a.fire("pc_opened", b)
        }
        ;
        "ontrack"in k.RTCPeerConnection.prototype ? d.ontrack = function(e) {
            a.debug("Remote stream/track added.");
            a.fire("rstream_added", e.streams[0], b);
            a.setStatus(b, "call")
        }
        : d.onaddstream = function(e) {
            a.debug("Remote stream added.");
            a.fire("rstream_added", e.stream, b);
            a.setStatus(b, "call")
        }
        ;
        d.onremovestream = function() {
            a.debug("Remote stream removed.")
        }
        ;
        a.connections[b].stream && d.addStream(a.connections[b].stream);
        d.onsignalingstatechange = function() {
            a.debug("PC Signaling state changed to: " + d.signalingState)
        }
        ;
        d.oniceconnectionstatechange = function() {
            a.debug("ICE connection state changed to: " + d.iceConnectionState)
        }
        ;
        return d
    }
    ;
    a.fileOffer = function(b, f) {
        a.debug("offering file to connection " + b);
        a.debug(f);
        a.send({
            type: "file_offer",
            data: {
                connectionId: b,
                fileDesc: f
            }
        })
    }
    ;
    a.fileAccept = function(b, f) {
        a.debug("accepting file from id: " + b);
        a.debug(f);
        a.send({
            type: "file_accept",
            data: {
                connectionId: b,
                fileDesc: f
            }
        })
    }
    ;
    a.fileCancel = function(b, f) {
        a.debug("canceling file sending to " + b);
        a.debug(f);
        a.send({
            type: "file_cancel",
            data: {
                connectionId: b,
                fileDesc: f
            }
        })
    }
    ;
    a.fileSdpOffer = function(b, f, e) {
        var d = a.fileGetPeerConnection(b, e, !0);
        d.createOffer(a.config.offerConstraints).then(function(c) {
            d.setLocalDescription(c);
            a.send({
                type: "file_sdp_offer",
                data: {
                    connectionId: b,
                    sdp: c,
                    fileDesc: f
                }
            })
        }).catch(function(c) {
            a.debug("Failed to create session description offer: " + c.toString())
        })
    }
    ;
    a.fileSdpAnswer = function(b, f, e) {
        a.debug("Answering call connectionId: " + b);
        var d = a.fileGetPeerConnection(b, e);
        d.setRemoteDescription(new RTCSessionDescription(a.connections[b].fileOfferSdp));
        d.createAnswer().then(function(c) {
            d.setLocalDescription(c);
            a.send({
                type: "file_sdp_answer",
                data: {
                    connectionId: b,
                    sdp: c,
                    fileDesc: f
                }
            })
        }).catch(function(c) {
            a.debug("Failed to create session description answer: " + c.toString())
        })
    }
    ;
    a.fileGetPeerConnection = function(b, f, e) {
        try {
            a.debug("fileGetPeerConnection for id: " + b + " does not exist, creating it"),
            a.connections[b].dpc = new k.RTCPeerConnection(a.config.pcConfig,{
                optional: []
            }),
            a.connections[b].dpc.onicecandidate = function(c) {
                c.candidate && a.send({
                    type: "file_ice_candidate",
                    data: {
                        candidate: c.candidate.candidate,
                        connectionId: b,
                        label: c.candidate.sdpMLineIndex
                    }
                })
            }
        } catch (h) {
            return a.debug("Failed to create RTCPeerConnection, exception: " + h.message),
            a.fire("dpc_error", h),
            alert("Cannot create PeerConnection object; Is the 'PeerConnection' flag enabled in about:flags?"),
            null
        }
        var d = a.connections[b].dpc;
        d.onopen = function() {
            a.debug("File peerconnection opened for conn id: " + b)
        }
        ;
        var c = function(c) {
            f.channelOnMessage && (c.onmessage = f.channelOnMessage);
            f.channelOnOpen && (c.onopen = f.channelOnOpen);
            f.channelOnClose && (c.onclose = f.channelOnClose);
            f.channelOnError && (c.onerror = f.channelOnError)
        };
        d.ondatachannel = function(h) {
            e || (a.debug("creating receive channel"),
            a.connections[b].receiveChannel = h.channel,
            a.connections[b].receiveChannel.binaryType = "arraybuffer",
            c(a.connections[b].receiveChannel))
        }
        ;
        e && (a.debug("creating send channel"),
        a.connections[b].sendChannel = a.connections[b].dpc.createDataChannel("sendDataChannel" + b),
        a.connections[b].sendChannel.binaryType = "arraybuffer",
        c(a.connections[b].sendChannel));
        return d
    }
    ;
    a.fileReceiveProgress = function(b, f, e) {
        a.send({
            type: "file_receive_progress",
            data: {
                connectionId: b,
                fileId: f,
                packets: e
            }
        })
    }
    ;
    a.on("file_ice_candidate", function(b) {
        a.connections[b.connectionId].dpc.addIceCandidate(new RTCIceCandidate({
            sdpMLineIndex: b.label,
            candidate: b.candidate
        }))
    });
    f.fn.mgRtc = function(b) {
        a.init(b);
        return a
    }
}
)(jQuery, window, document);
(function(f, k, l, m) {
    f.fn.mgFileHelper = function(a) {
        var b = {
            getDesc: function(b) {
                b.id || (b.id = (Math.random() * (new Date).getTime()).toString(36).toUpperCase().replace(/\./g, "-"));
                return {
                    name: b.name,
                    size: b.size,
                    type: b.type,
                    id: b.id,
                    connectionId: b.connectionId,
                    firefox: a.firefox,
                    transfered: 0
                }
            },
            send: function(b, f, e) {
                var d, c = new k.FileReader, h = function(c, g) {
                    c && (g = 0,
                    d = c.target.result);
                    c = d.byteLength <= g + 16384;
                    var n = d.slice(g, 16384 + g);
                    a.debug("Sending file packet of bytes:" + n.byteLength + ", offset was: " + g + ", of total file size: " + d.byteLength);
                    f.send(n);
                    n = {
                        transfered: n.byteLength,
                        fileId: b.id
                    };
                    if (e.onFileProgress)
                        e.onFileProgress(n, b);
                    if (c && e.onFileSent)
                        e.onFileSent(n);
                    var q = 0;
                    if (e.calcTimeout && (q = e.calcTimeout(n),
                    0 > q))
                        return;
                    c || setTimeout(function() {
                        h(null, g + 16384)
                    }, q)
                };
                c.onload = h;
                c.readAsArrayBuffer(b)
            },
            recContent: {},
            recNumberOfBytes: {},
            receive: function(d, f, e) {
                var g = d.id;
                b.recNumberOfBytes[g] || (b.recNumberOfBytes[g] = 0);
                b.recNumberOfBytes[g] += f.byteLength;
                if (e.onFileProgress)
                    e.onFileProgress({
                        transfered: f.byteLength,
                        fileId: g
                    }, g);
                a.debug("received file packet, file name: [" + d.name + "], bytes: [" + f.byteLength + "]");
                b.recContent[g] || (b.recContent[g] = []);
                b.recContent[g].push(f);
                if (b.recNumberOfBytes[g] === d.size) {
                    f = new k.Blob(b.recContent[g],{
                        type: d.type
                    });
                    var c = (k.URL || k.webkitURL).createObjectURL(f);
                    e.autoSaveToDisk && b.saveToDisk(c, d.name);
                    if (e.onFileReceived)
                        e.onFileReceived(d.name, {
                            blob: f,
                            dataURL: c,
                            url: c,
                            fileId: g
                        });
                    delete b.recContent[g]
                }
            },
            saveToDisk: function(b, a) {
                var e = l.createElement("a");
                e.href = b;
                e.target = "_blank";
                e.download = a || b;
                b = new MouseEvent("click",{
                    view: k,
                    bubbles: !0,
                    cancelable: !0
                });
                e.dispatchEvent(b);
                setTimeout(function() {
                    (k.URL || k.webkitURL).revokeObjectURL(e.href)
                }, 500)
            },
            dataUrlToBlob: function(b) {
                for (var a = atob(b.substr(b.indexOf(",") + 1)), e = [], d = 0; d < a.length; d++)
                    e.push(a.charCodeAt(d));
                try {
                    var c = b.substr(b.indexOf(":") + 1).split(";")[0]
                } catch (h) {
                    c = "text/plain"
                }
                return new Blob([new Uint8Array(e)],{
                    type: c
                })
            }
        };
        return b
    }
}
)(jQuery, window, document);
(function(f, k, l, m) {
    f.fn.mgNotifications = function(a) {
        return {
            grant: function(b) {
                if (this.checkActive())
                    return !0;
                k.Notification.requestPermission(function(a) {
                    b && b(a)
                })
            },
            checkActive: function() {
                if (!("Notification"in k))
                    return !1;
                if ("granted" === k.Notification.permission)
                    return !0;
                if ("denied" === k.Notification.permission)
                    return !1
            },
            notify: function(b, a, f) {
                if (!f && !l.hidden)
                    return !1;
                console.log("notify", b, f, l.hidden);
                if (!this.checkActive())
                    return !1;
                (new Notification(b,a)).onclick = function(b) {
                    b.preventDefault();
                    k.focus();
                    this.close()
                }
            }
        }
    }
}
)(jQuery, window, document);
(function(f, k, l, m) {
    f.fn.mgDesktopShare = function(a) {
        var b = {
            extensionAvailable: null,
            screenCallback: null,
            isExtensionAvailable: function(b) {
                var a = this;
                if (null !== this.extensionAvailable)
                    return b(this.extensionAvailable);
                k.postMessage({
                    message: "mgIsLoaded"
                }, "*");
                setTimeout(function() {
                    null == a.extensionAvailable && (a.extensionAvailable = !1);
                    b(a.extensionAvailable)
                }, 200)
            },
            getSourceId: function(b) {
                var a = this;
                this.isExtensionAvailable(function(e) {
                    e || b(!1, "no-extension");
                    a.screenCallback = b;
                    k.postMessage({
                        message: "mgGetSourceId"
                    }, "*")
                })
            }
        };
        k.addEventListener("message", function(a) {
            if (a.origin == k.location.origin)
                switch (a.data.message) {
                case "mgIsLoadedResult":
                    b.extensionAvailable = !0;
                    break;
                case "mgGetSourceIdResult":
                    a.data.success ? b.screenCallback(a.data.sourceId) : b.screenCallback && b.screenCallback(!1, "no-permission")
                }
        });
        return b
    }
}
)(jQuery, window, document);
(function(f, k, l, m) {
    f.fn.mgVideoChatUtils = function(a, b) {
        a.prototype.fixPath = function() {
            if ("{rel}" == this.config.dir) {
                var b = this;
                f("script").each(function() {
                    var c = f(this).attr("src")
                      , a = "mgVideoChat-";
                    c && -1 !== c.indexOf(a, this.length - a.length) ? (b.config.dir = c.replace(/\\/g, "/").replace(/\/[^\/]*\/?$/, ""),
                    a = /mgVideoChat\-(\d*\.\d*\.\d*)\.js/gi,
                    (a = a.exec(c)) && a[1] ? b.version = a[1] : (a = /mgVideoChat\-(\d*\.\d*\.\d*)\-min\.js/gi,
                    a = a.exec(c),
                    b.version = a && a[1] ? a[1] : 1)) : (a = "mgVideoChat",
                    c && -1 !== c.indexOf(a, this.length - a.length) && (b.config.dir = c.replace(/\\/g, "/").replace(/\/[^\/]*\/?$/, ""),
                    b.version = 1))
                })
            }
        }
        ;
        a.prototype.debug = function(a) {
            this.config.debug && console.log(a)
        }
        ;
        a.prototype.getErrorText = function(a) {
            var c = [];
            a.code && c.push(a.code);
            a.name && c.push(a.name);
            a.message && c.push(a.message);
            0 == c.length && c.push(a);
            if ("PermissionDeniedError" == c[0] || "PERMISSION_DENIED" == c[0])
                b.firefox ? c.push(this._("Please enable requested media devices")) : c.push(this._("Please enable requested media devices by clicking on the right hand icon in the address bar."));
            return c.join(".\n")
        }
        ;
        a.prototype.getReadableFileSizeString = function(a) {
            var c = -1;
            do
                a /= 1024,
                c++;
            while (1024 < a);return Math.max(a, .1).toFixed(1) + " kB; MB; GB; TB;PB;EB;ZB;YB".split(";")[c]
        }
        ;
        a.prototype.parseChatMessageText = function(a) {
            return function(c, a) {
                return (c + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + (a || "undefined" === typeof a ? "<br />" : "<br>") + "$2")
            }(function(c) {
                c = c.replace(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim, '<a href="$1" target="_blank">$1</a>');
                c = c.replace(/(^|[^\/])(www\.[\S]+(\b|$))/gim, '$1<a href="http://$2" target="_blank">$2</a>');
                return c = c.replace(/(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim, '<a href="mailto:$1">$1</a>')
            }(f.fn.mgVideoChat.htmlspecialchars(a)), !1)
        }
        ;
        var d = {};
        a.prototype.tmpl = function(a, c) {
            try {
                var b = /\W/.test(a) ? new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + a.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');") : d[a] = d[a] || tmpl(l.getElementById(a).innerHTML);
                return c ? b(c) : b
            } catch (q) {
                throw Error("Error parsing template [" + a.substr(0, 100) + "...]");
            }
        }
        ;
        var m = {};
        a.prototype.loadTplByName = function(a, c) {
            return this.loadTpl(this.config.dir + this.config[a] + "?v=" + this.version, c)
        }
        ;
        a.prototype.loadTpl = function(a, c) {
            null == m[a] ? f.get(a, function(b) {
                m[a] = b;
                c && c(b)
            }, "html") : c && c(m[a]);
            return m[a]
        }
        ;
        a.prototype.on = function(a, c) {
            this.events[a] = this.events[a] || [];
            this.events[a].push(c)
        }
        ;
        a.prototype.fire = function(a, c) {
            this.debug("mgVideoChat fired [" + a + "]");
            var b = this.events[a]
              , e = Array.prototype.slice.call(arguments, 1);
            if (b)
                for (var d = 0, f = b.length; d < f; d++)
                    b[d].apply(null, e)
        }
        ;
        var e = null;
        a.prototype.message = function(a, c, b) {
            e && k.clearTimeout(e);
            var h = this
              , d = h.$messagePanel.find(".alert")
              , f = h.$messagePanel.data("type");
            a ? (d.removeClass("alert-" + f).addClass("alert-" + c),
            d.find("div.text").html(a),
            h.$messagePanel.data("type", c),
            h.$messagePanel.show(),
            b && (e = k.setTimeout(function() {
                h.$messagePanel.hide();
                e = null
            }, 1E3 * b))) : h.$messagePanel.hide()
        }
        ;
        a.prototype.setCookie = function(a, c, b, e) {
            e = e && "localhost" != e ? "; domain=" + e : "";
            l.cookie = a + "=" + encodeURIComponent(c) + "; max-age=" + 86400 * b + "; path=/" + e
        }
        ;
        a.prototype._ = function(a, c, b) {
            return f.fn.mgVideoChat._(a, c, b)
        }
    }
}
)(jQuery, window, document);
(function(f, k, l, m) {
    f.fn.mgVideoChatRtcEvents = function(a, b, d, f) {
        a.prototype.initRtc = function() {
            var a = this;
            b.on("connected", function() {
                b.login(a.loginParams);
                a.onConnected()
            });
            b.on("connectionId", function(c) {
                a.connectionId = c.connectionId;
                a.userData = c.data.data.userData;
                a.roomOptions = c.room;
                a.usersCount = c.users_count;
                a.onRoomOptions();
                a.renderYouInfo()
            });
            b.on("logged", function() {
                a.fire("logged");
                a.onLogged()
            });
            b.on("message", function(c) {
                a.message(c.text, c.type)
            });
            b.on("chat_message", function(c) {
                a.fire("chat_message", c);
                a.renderChatMessage(a.roomOptions.group ? 0 : c.connectionId, c.connectionId, c.message);
                a.chatId != c.connectionId && (b.connections[c.connectionId].data.unread || (b.connections[c.connectionId].data.unread = 0),
                b.connections[c.connectionId].data.unread++,
                a.renderConnection(c.connectionId),
                a.notifySound());
                f.notify(a._("New chat message arrived"))
            });
            var g = 0;
            b.on("call_busy", function(c) {
                a.roomOptions.roulette && 5 > g ? (a.debug("Callee is busy, try again " + g),
                g++,
                a.rouletteNext()) : a.message(a._("Callee is busy at the moment, please try later :("), "danger", 3)
            });
            b.on("call_drop", function(c) {
                b.stop(c.connectionId, !1, a.roomOptions.roulette);
                a.roomOptions.roulette && (b.connections = {},
                a.renderConnections())
            });
            b.on("media_ready", function(c) {
                for (var h in c.data.connectionIds)
                    b.connections[c.data.connectionIds[h]].media_ready = !0,
                    a.localStream && !b.connections[c.data.connectionIds[h]].stream && (b.connections[c.data.connectionIds[h]].stream = a.localStream);
                a.debug(b.connections)
            });
            b.on("connections", function(c) {
                a.renderConnections()
            });
            var c = {};
            b.on("roulette_next", function(h) {
                if (!h || !h.connections)
                    return a.message(a._("No partner found at the moment. Please try later."), "warning", 3),
                    !1;
                a.usersCount = h.users_count;
                b.connections = {};
                c = h
            });
            b.on("roulette_accept", function(h) {
                b.connections = c.connections;
                b.connectionsLoaded = !0;
                c = {};
                for (var e in b.connections)
                    a.localVideoOpen(a.localStream, e);
                a.connectAllMediaReady();
                a.renderConnections();
                a.notifySound()
            });
            b.on("roulette_invitation", function(c) {
                a.usersCount = c.users_count;
                if (a.videoId) {
                    for (var h in c.connections)
                        ;
                    a.debug("Busy for invitation from " + h);
                    b.busy(h);
                    b.drop(h);
                    return !1
                }
                b.connections = c.connections;
                b.connectionsLoaded = !0;
                for (h in b.connections)
                    b.connections[h].stream = a.localStream;
                b.rouletteAccept(h);
                a.localVideoOpen(a.localStream, h);
                a.renderConnections();
                a.notifySound()
            });
            b.on("connection_add", function(c) {
                a.usersCount = c.users_count;
                a.renderConnection(c.connectionId)
            });
            b.on("connection_remove", function(c) {
                a.usersCount = c.users_count;
                a.onConnectionClose(c.connectionId)
            });
            b.on("rstream_added", function(c, e) {
                b.connections[e].rstream = c;
                a.roomOptions.group ? a.remoteVideoGroupSelect() : (a.remoteVideoOpen(c),
                a.onVideoOpen(e))
            });
            b.on("stream_added", function(c, b) {
                a.localStream = c;
                a.localVideoOpen(c, b)
            });
            b.on("media_request_start", function() {
                a.$elem.find("#requestDialog").modal("show")
            });
            b.on("media_request_end", function() {
                a.$elem.find("#requestDialog").modal("hide")
            });
            b.on("status", function(c, e) {
                a.fire("call_status", c, e);
                switch (e) {
                case "call_inviting":
                    a.callRing(!1);
                    break;
                case "call_invited":
                    a.videoId ? (b.busy(c),
                    b.drop(c)) : (a.inviteStart(c),
                    f.notify(a._("New call invitation")));
                    break;
                case "call_accepting":
                case "call_accepted":
                    a.$videoPanel.data("call_id", c);
                    a.inviteStop();
                    break;
                case "idle":
                    a.callRing(!0);
                    if (a.videoId == c)
                        a.onVideoClose();
                    a.videoInvitedId == c && a.inviteStop()
                }
                a.renderConnection(c)
            });
            b.on("socket_error", function(c) {
                a.message(a._("Error connecting to media server: {error_name} {error_message}", ["{error_name}", "{error_message}"], [c.name, c.message]), "danger");
                a.onDisconnected()
            });
            b.on("socket_closed", function(c) {
                a.message(a._("Websocket closed, please try reloading page later."), "danger");
                a.onDisconnected()
            });
            b.on("stream_error", function(c) {
                a.message(a._("Error getting local media stream: {error_message}", ["{error_message}"], [a.getErrorText(c)]), "danger")
            });
            b.on("pc_error", function(c) {
                a.message(a._("Error creating peer connection: {error_name} {error_message}", ["{error_name}", "{error_message}"], [c.name, c.message]), "danger")
            });
            b.on("sdp_offer", function(c) {
                if (b.refuseIdleState(c.connectionId))
                    return !1;
                b.connections[c.connectionId].offerSdp = c.sdp;
                b.setStatus(c.connectionId, "sdp_offered");
                a.loginParams.noPc || a.loginParams.noMedia || b.sdpAnswer(c.connectionId)
            });
            b.on("sdp_answer", function(a) {
                if (b.refuseIdleState(a.connectionId))
                    return !1;
                b.remoteSDReceive(b.connections[a.connectionId].pc, a.sdp);
                b.setStatus(a.connectionId, "sdp_answered")
            });
            b.on("ice_candidate", function(c) {
                if (b.refuseIdleState(c.connectionId) || a.loginParams.noPc || a.loginParams.noMedia)
                    return !1;
                var e = b.connections[c.connectionId].pc;
                b.debug("Adding ice candidate:");
                b.debug({
                    sdpMLineIndex: c.label,
                    candidate: c.candidate
                });
                e.addIceCandidate(new RTCIceCandidate({
                    sdpMLineIndex: c.label,
                    candidate: c.candidate
                })).then(function() {
                    b.debug("Remote candidate added successfully.")
                }).catch(function(a) {
                    b.debug("Failed to add remote candidate: " + a.toString())
                })
            });
            b.on("file_offer", function(c) {
                var e = c.connectionId
                  , d = b.connections[e].data.userData;
                a.files[c.fileDesc.id] = {
                    desc: c.fileDesc,
                    connectionId: e,
                    pending: !0
                };
                a.renderFiles();
                a.$fileAcceptDialog.data("file_desc", c.fileDesc);
                a.$fileAcceptDialog.data("connection_id", e);
                a.$fileAcceptDialog.find(".username").text(d.name);
                d.image && a.$fileAcceptDialog.find(".desc").html('<img src="' + d.image + '" alt="' + d.name + '"/>');
                a.$fileAcceptDialog.find(".fileName").text(c.fileDesc.name);
                a.$fileAcceptDialog.find(".fileSize").text(a.getReadableFileSizeString(c.fileDesc.size));
                a.$fileAcceptDialog.modal("show");
                a.notifySound();
                f.notify(a._("New file offer"))
            });
            b.on("file_accept", function(c) {
                b.fileSdpOffer(c.connectionId, c.fileDesc, {
                    channelOnOpen: function() {
                        a.debug("channelOnOpen connId: " + c.connectionId);
                        a.debug(c);
                        var e = c.fileDesc.id;
                        d.send(a.files[e].file, b.connections[c.connectionId].sendChannel, {
                            onFileProgress: function(b) {
                                a.debug("onFileProgress " + e + " connId: " + c.connectionId);
                                a.debug(b);
                                a.files[b.fileId] && (a.files[b.fileId].desc.transfered += b.transfered,
                                a.renderFileProgress(b.fileId))
                            },
                            onFileSent: function(b) {
                                a.debug("onFileSent " + e + " connId: " + c.connectionId);
                                a.debug(b);
                                delete a.files[b.fileId];
                                a.renderFiles()
                            },
                            calcTimeout: function(c) {
                                return a.files[c.fileId] ? b.firefox ? 5 : 500 : -1
                            }
                        })
                    }
                })
            });
            b.on("file_receive_progress", function(c) {
                a.files[c.fileId] && (a.files[c.fileId].packetsConfirmed = c.packets)
            });
            b.on("file_sdp_offer", function(c) {
                var e = c.connectionId
                  , h = c.fileDesc.id
                  , g = c.fileDesc;
                b.connections[c.connectionId].fileOfferSdp = c.sdp;
                b.fileSdpAnswer(c.connectionId, c.fileDesc, {
                    channelOnMessage: function(c) {
                        c = c.data;
                        a.debug("channelOnMessage connId: " + e);
                        d.receive(g, c, {
                            onFileProgress: function(c) {
                                a.debug("onFileProgress " + h + " connId: " + e);
                                a.debug(c);
                                a.files[c.fileId] && (a.files[c.fileId].desc.transfered += c.transfered,
                                a.renderFileProgress(c.fileId))
                            },
                            autoSaveToDisk: !0,
                            onFileReceived: function(c, b) {
                                a.debug("onFileReceived file: " + c + ", file id: " + h + " connId: " + e);
                                a.debug(b);
                                delete a.files[b.fileId];
                                a.renderFiles();
                                f.notify(a._("New file received"))
                            }
                        })
                    }
                })
            });
            b.on("file_sdp_answer", function(a) {
                b.connections[a.connectionId].dpc.setRemoteDescription(new RTCSessionDescription(a.sdp))
            });
            b.on("file_cancel", function(c) {
                delete a.files[c.fileDesc.id];
                a.renderFiles()
            })
        }
    }
}
)(jQuery, window, document);
(function(f, k, l, m) {
    f.fn.mgVideoChatUI = function(a, b, d, k) {
        a.prototype.updateLayout = function() {
            var a = this.$callPanel.is(":visible") || this.$chatPanel.is(":visible")
              , b = this.$elem.find("#mainContent")
              , c = this.$elem.find("#sideMenu");
            if (b.data("is_visible") === a)
                return !1;
            a ? (b.removeClass().addClass(b.data("chat_class")),
            c.removeClass().addClass(c.data("chat_class")),
            f("#offcanvasButton").show()) : (b.removeClass().addClass(b.data("no_chat_class")),
            c.removeClass().addClass(c.data("no_chat_class")));
            b.data("is_visible", a)
        }
        ;
        a.prototype.renderConnections = function() {
            var a = this;
            a.debug("connections");
            a.debug(b.connections);
            this.loadTplByName("tplConnections", function(e) {
                e = a.tmpl(e, {
                    rows: b.connections,
                    roomOptions: a.roomOptions,
                    usersCount: a.usersCount
                });
                a.$connectionsPanel.html(e);
                for (var c in b.connections)
                    a.renderConnection(c);
                b.connections.length || a.$connectionsPanel.find("#lonely").show();
                a.fire("connections", b.connections)
            })
        }
        ;
        a.prototype.renderConnection = function(a) {
            var e = this;
            this.getConnectionElement(a, function(c) {
                var d = e.$connectionsPanel.find("#connection_" + a);
                d.length ? (d.hasClass("active") && c.addClass("active"),
                d.replaceWith(c)) : e.$connectionsPanel.find("#connections").append(c);
                e.$connectionsPanel.find("#lonely").hide();
                e.fire("connections", b.connections)
            })
        }
        ;
        a.prototype.getConnectionElement = function(a, g) {
            var c = this;
            if (!b.connections[a])
                return !1;
            this.loadTplByName("tplConnection", function(e) {
                function h(a) {
                    c.$connectionsPanel.find(".connectionItem").removeClass("active");
                    a.addClass("active")
                }
                var n = b.connections[a]
                  , k = n.data.loginParams;
                e = f(c.tmpl(e, {
                    id: a,
                    status: n.status ? n.status : "idle",
                    userData: n.data.userData,
                    loginParams: n.data.loginParams,
                    videoId: c.videoId,
                    chatId: c.chatId,
                    unread: n.data.unread ? n.data.unread : 0,
                    connection: n,
                    roomOptions: c.roomOptions,
                    hasWebrtc: !c.loginParams.noPc && !c.loginParams.noMedia && !k.noPc && !k.noMedia,
                    selfLoginParams: c.loginParams
                }));
                c.roomOptions.group && n.rstream && c.videoSetStream(e.find("video"), n.rstream);
                c.roomOptions.group ? e.click(function() {
                    h(f(this));
                    var a = f(this).data("connection_id");
                    b.connections[a].rstream && c.remoteVideoOpen(b.connections[a].rstream, a)
                }) : e.click(function() {
                    h(f(this));
                    c.setChat(f(this).data("connection_id"))
                });
                e.find(".call.cmdBtn").click(function() {
                    b.invite(f(this).data("id"), c.getMediaOptions({
                        audio: !0,
                        video: !0
                    }))
                });
                e.find(".callDesktop.cmdBtn").click(function() {
                    var a = this;
                    c.getDesktopShareMedia(function(c) {
                        if (!c)
                            return !1;
                        b.invite(f(a).data("id"), c)
                    })
                });
                e.find(".callAudio.cmdBtn").click(function() {
                    b.invite(f(this).data("id"), c.getMediaOptions({
                        audio: !0,
                        video: !1
                    }))
                });
                e.find(".answer.cmdBtn").click(function() {
                    c.debug("Clicked to answer the connectionId: " + f(this).data("id"));
                    b.accept(f(this).data("id"), c.getMediaOptions({
                        audio: !0,
                        video: !0
                    }))
                });
                e.find(".drop.cmdBtn").click(function() {
                    c.debug("Clicked to drop the connectionId: " + f(this).data("id"));
                    b.drop(f(this).data("id"), !1, c.roomOptions.roulette)
                });
                e.find(".fileSend.cmdBtn").click(function() {
                    var a = f(this).data("id");
                    c.debug("Clicked to send file to the connectionId: " + a);
                    f("#fileDialog").off("change");
                    f("#fileDialog").val("");
                    f("#fileDialog").on("change", function(e) {
                        e = e.target.files;
                        for (var f = 0, h; h = e[f]; f++) {
                            h.connectionId = a;
                            var g = d.getDesc(h);
                            c.config.fileMaxSize && g.size > c.config.fileMaxSize ? c.message(c._("This file size of over maximum defined of {max_size}", ["{max_size}"], [c.getReadableFileSizeString(c.config.fileMaxSize)]), "danger") : (b.fileOffer(a, g),
                            c.files[h.id] = {
                                file: h,
                                desc: g,
                                connectionId: a
                            },
                            c.renderFiles())
                        }
                    });
                    f("#fileDialog").trigger("click")
                });
                c.chatId == a && e.addClass("active");
                g(e);
                $('body').trigger('connection-ready', function(){
                    return 'connection ready';
                });
            })
        }
        ;
        a.prototype.renderFiles = function() {
            var a = this;
            a.debug("files");
            a.debug(a.files);
            this.loadTplByName("tplFile", function(b) {
                var c = "", e;
                for (e in a.files) {
                    var d = a.tmpl(b, {
                        file: a.files[e],
                        fileId: e,
                        fileSize: a.getReadableFileSizeString(a.files[e].desc.size),
                        roomOptions: a.roomOptions
                    });
                    c += d
                }
                a.$filesPanel.find("#files").html(c);
                a.$filesPanel.find("a.fileAccept").click(function() {
                    var c = f(this).data("file_id");
                    a.fileAccept(a.files[c].desc, a.files[c].connectionId);
                    return !1
                });
                a.$filesPanel.find("a.fileCancel").click(function() {
                    var c = f(this).data("file_id");
                    a.fileCancel(a.files[c].desc, a.files[c].connectionId);
                    return !1
                });
                "" == c ? a.$filesPanel.hide() : a.$filesPanel.show()
            })
        }
        ;
        a.prototype.renderYouInfo = function() {
            var a = this;
            a.debug(a.userData);
            this.loadTplByName("tplYou", function(b) {
                a.$youInfoPanel.find("#youInfo").html(a.tmpl(b, {
                    userData: a.userData
                }));
                a.userData ? a.$youInfoPanel.show() : a.$youInfoPanel.hide()
            })
        }
        ;
        a.prototype.renderFileProgress = function(a) {
            var b = this.files[a].desc;
            if (!b)
                return !1;
            var c = 0;
            b.size && (c = b.transfered / b.size * 100);
            a = this.$filesPanel.find("#file_" + a);
            a.find(".progress-bar").css("width", c + "%");
            a.find(".progressText").text(c + "%")
        }
        ;
        a.prototype.renderChatMessage = function(a, d, c) {
            var e = this
              , f = this.getChatDiv(a);
            this.loadTplByName("tplChat", function(a) {
                var h = {
                    message: e.parseChatMessageText(c),
                    me: !1
                };
                d === e.connectionId ? (h.me = !0,
                h.userData = e.userData) : h.userData = b.connections[d].data.userData;
                a = e.tmpl(a, h);
                h = f.find(".messages");
                h.append(a).scrollTop(h.get(0).scrollHeight)
            })
        }
        ;
        a.prototype.getChatDiv = function(a) {
            var d = this
              , c = this.$chatPanel.find("#chat_" + a);
            c.length || (c = this.loadTplByName("tplChatInput"),
            c = f(d.tmpl(c, {
                chatId: a
            })),
            c.appendTo(d.$chatPanel.find("#chats")),
            c.find("textarea").keypress(function(c) {
                var e = f(this);
                if (13 === c.keyCode && c.shiftKey)
                    return e.val(e.val() + "\n"),
                    !1;
                if (13 === c.keyCode)
                    return b.chatMessage(a, e.val()),
                    d.renderChatMessage(a, d.connectionId, e.val()),
                    e.val(""),
                    !1
            }));
            return c
        }
    }
}
)(jQuery, window, document);
(function(f, k, l, m) {
    var a = {
        wsURL: "ws://localhost:8080",
        dir: "{rel}",
        tplMain: "/tpls/main.html",
        tplConnections: "/tpls/connections.html",
        tplConnection: "/tpls/connection.html",
        tplChat: "/tpls/chat.html",
        tplChatInput: "/tpls/chat_input.html",
        tplRoulette: "/tpls/roulette.html",
        tplFile: "/tpls/file.html",
        tplYou: "/tpls/you.html",
        sound: {
            mp3: "/sounds/ring.mp3",
            ogg: "/sounds/ring.ogg"
        },
        notifySound: {
            mp3: "/sounds/notify.mp3",
            ogg: "/sounds/notify.ogg"
        },
        debug: !1,
        login: null,
        rtc: {
            pcConfig: {
                iceServers: [{
                    urls: "stun:stun.l.google.com:19302"
                }]
            },
            pcConstraints: {
                optional: [{
                    DtlsSrtpKeyAgreement: !0
                }]
            },
            offerConstraints: {
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1
            },
            mediaConstraints: {
                audio: !0,
                video: !0
            },
            sdpConstraints: {
                mandatory: {
                    OfferToReceiveAudio: !0,
                    OfferToReceiveVideo: !0
                },
                optional: [{
                    VoiceActivityDetection: !1
                }]
            },
            audio_receive_codec: "opus/48000"
        },
        fileMaxSize: 512E3,
        chromeExtensionId: "jfepeciommhoefhfacjdpcmnclekenag",
        enableNotifications: !0
    }
      , b = null
      , d = null
      , p = null
      , e = null
      , g = function(c, h) {
        this.version = "1";
        this.elem = c;
        this.$elem = f(c);
        this.$connectionsPanel = null;
        this.options = h;
        this.metadata = this.$elem.data("mgVideoChat-options");
        this.config = f.extend({}, a, this.options);
        b = f.fn.mgRtc(this.config);
        d = f.fn.mgFileHelper(b);
        p = f.fn.mgDesktopShare(b);
        e = f.fn.mgNotifications(b);
        f.fn.mgVideoChatUtils(g, b);
        f.fn.mgVideoChatUI(g, b, d, p);
        f.fn.mgVideoChatRtcEvents(g, b, d, e);
        b.init(this.config);
        this.fixPath();
        this.init();
        this.$elem.data("mgVideoChat-instance", this);
        this.connectionId = this.videoInvitedId = this.videoId = this.chatId = null;
        this.userData = {};
        this.roomOptions = {};
        this.localStream = null;
        this.loginParams = {};
        this.files = {};
        this.isMuted = {
            audio: !1,
            video: !1
        };
        this.events = {}
    };
    g.prototype.init = function() {
        var a = this;
        this.loadTplByName("tplConnections", function(c) {
            a.loadTplByName("tplMain", function(c) {
                a.$elem.html(a.tmpl(c, {
                    config: a.config
                }));
                a.$connectionsPanel = a.$elem.find("#connectionsPanel");
                a.$messagePanel = a.$elem.find("#messagePanel");
                a.$loginPanel = a.$elem.find("#loginPanel");
                a.$videoPanel = a.$elem.find("#videoPanel");
                a.$loginDialog = a.$elem.find("#loginDialog");
                a.$callPanel = a.$elem.find("#callPanel");
                a.$answerDialog = a.$elem.find("#answerDialog");
                a.$shareDialog = a.$elem.find("#shareDialog");
                a.$fileAcceptDialog = a.$elem.find("#fileAcceptDialog");
                a.$chatPanel = a.$elem.find("#chatPanel");
                a.$filesPanel = a.$elem.find("#filesPanel");
                a.$youInfoPanel = a.$elem.find("#youInfoPanel");
                a.loginParams = {};
                c = {};
                var d = {}
                  , h = {
                    websocket: a._("Your browser does not support websocket."),
                    peerconnection: a._("Your browser does not support PeerConnections."),
                    usermedia: a._("Your browser does not support user media.")
                };
                if (b.checkCompatibility(c, d, "chat")) {
                    b.loadDevices(function(c) {
                        a.devices = c;
                        a.loginParams.hasAudioDevice = 0 < a.devices.audio.length;
                        a.loginParams.hasVideoDevice = 0 < a.devices.video.length;
                        a.loginParams.hasAudioDevice || a.$answerDialog.find("#answerAudio").hide();
                        a.loginParams.hasVideoDevice || a.$answerDialog.find("#answer").hide()
                    });
                    if (!f.isEmptyObject(d)) {
                        g = [];
                        for (k in d)
                            g.push(h[k]);
                        g.push(a._("You will not be able to make video calls."));
                        g.push(a._('Please try <a href="http://www.google.com/chrome" target="_blank">Google Chrome</a> or <a href="http://www.mozilla.org/en-US/firefox" target="_blank">Mozilla Firefox</a>'));
                        a.message(g.join("<br>"), "warning", 5)
                    }
                    d.peerconnection && (a.loginParams.noPc = !0);
                    d.usermedia && (a.loginParams.noMedia = !0);
                    b.connect(a.config.wsURL)
                } else {
                    a.debug(c);
                    var g = [], k;
                    for (k in c)
                        g.push(h[k]);
                    g.push(a._('Please try <a href="http://www.google.com/chrome" target="_blank">Google Chrome</a> or <a href="http://www.mozilla.org/en-US/firefox" target="_blank">Mozilla Firefox</a>'));
                    a.message(g.join("<br>"), "danger")
                }
                a.initDom();
                a.initRtc();
                a.config.enableNotifications && e.grant()
            });
            a.loadTplByName("tplChatInput", function(a) {})
        })
    }
    ;
    g.prototype.initDom = function() {
        var a = this;
        a.$loginPanel.find("#loginButton").click(function() {
            a.config.login ? a.config.login(function() {
                b.login(a.loginParams)
            }) : a.$loginDialog.modal("show")
        });
        a.$loginDialog.on("shown.bs.modal", function() {
            a.$loginDialog.find("#userName").focus()
        });
        var d = function() {
            a.$loginDialog.find("#userName").val() && (a.setCookie("mgVideoChatSimple", a.$loginDialog.find("#userName").val(), 30, k.location.hostname),
            a.$loginDialog.modal("hide"),
            k.location.reload())
        };
        a.$loginDialog.find("#userName").keypress(function(a) {
            if (13 === a.keyCode)
                return d(),
                !1
        });
        a.$loginDialog.find("button.login").click(d);
        a.$videoPanel.find("#videoFullScreen").click(function() {
            var c = a.$videoPanel.get(0);
            (c.requestFullScreen || c.webkitRequestFullScreen || c.mozRequestFullScreen).call(c)
        });
        a.$videoPanel.find("#videoExitFullScreen").click(function() {
            (l.cancelFullScreen || l.webkitCancelFullScreen || l.mozCancelFullScreen).call(l)
        });
        a.$videoPanel.find("#callHangup").click(function() {
            b.drop(a.videoId)
        });
        var e = function(c, b) {
            if (!a.localStream)
                return !1;
            var d = "audio" == b ? a.localStream.getAudioTracks() : a.localStream.getVideoTracks();
            if (0 === d.length)
                return !1;
            var e;
            for (e = 0; e < d.length; e++)
                d[e].enabled = a.isMuted[b];
            a.isMuted[b] = !a.isMuted[b];
            b = a.isMuted[b] ? "off" : "on";
            c.attr("title", c.data("title-" + b));
            c.find("span").removeClass(c.data("icon-on")).removeClass(c.data("icon-off")).addClass(c.data("icon-" + b))
        };
        a.$videoPanel.find("#videoMute").click(function() {
            e(f(this), "video")
        });
        a.$videoPanel.find("#audioMute").click(function() {
            e(f(this), "audio")
        });
        a.$answerDialog.find("#answer").click(function() {
            b.accept(a.$answerDialog.data("caller_id"), a.getMediaOptions({
                audio: !0,
                video: !0
            }));
            a.$answerDialog.modal("hide")
        });
        a.$answerDialog.find("#answerAudio").click(function() {
            b.accept(a.$answerDialog.data("caller_id"), a.getMediaOptions({
                audio: !0,
                video: !1
            }));
            a.$answerDialog.modal("hide")
        });
        a.$answerDialog.find("#cancelCall").click(function() {
            b.drop(a.$answerDialog.data("caller_id"));
            a.$answerDialog.modal("hide")
        });
        a.$shareDialog.find("#shareCam").click(function() {
            a.createGroupStream();
            a.$shareDialog.modal("hide")
        });
        a.$shareDialog.find("#shareDesktop").click(function() {
            a.getDesktopShareMedia(function(c) {
                if (!c)
                    return !1;
                a.createGroupStream(c)
            });
            a.$shareDialog.modal("hide")
        });
        a.$fileAcceptDialog.find("#fileAccept").click(function() {
            var c = a.$fileAcceptDialog.data("file_desc")
              , d = a.$fileAcceptDialog.data("connection_id");
            a.$fileAcceptDialog.modal("hide");
            c.firefox = b.firefox;
            a.fileAccept(c, d)
        });
        a.$fileAcceptDialog.find("#fileCancel").click(function() {
            var c = a.$fileAcceptDialog.data("file_desc")
              , b = a.$fileAcceptDialog.data("connection_id");
            a.fileCancel(c, b);
            a.$fileAcceptDialog.modal("hide")
        });
        f("#connectionsPanel").on("click", "#rouletteNext", function() {
            a.rouletteNext()
        });
        f("#offcanvasButton").click(function() {
            f(".row-offcanvas").toggleClass("active");
            event.stopPropagation()
        });
        f("body").click(function() {
            f(".row-offcanvas").removeClass("active")
        });
        f("#sideMenu").click(function(a) {
            a.stopPropagation()
        })
    }
    ;
    g.prototype.fileAccept = function(a, d) {
        this.files[a.id].pending = !1;
        this.renderFiles();
        b.fileAccept(d, a)
    }
    ;
    g.prototype.fileCancel = function(a, d) {
        delete this.files[a.id];
        this.renderFiles();
        b.fileCancel(d, a)
    }
    ;
    g.prototype.onConnected = function() {
        this.$loginPanel.show()
    }
    ;
    g.prototype.onDisconnected = function() {
        this.disableChat()
    }
    ;
    g.prototype.onLogged = function() {
        this.$loginPanel.hide()
    }
    ;
    g.prototype.onConnectionClose = function(a) {
        this.$connectionsPanel.find("#connection_" + a).remove();
        this.disableChat(a);
        if (this.videoId == a)
            this.onVideoClose();
        this.videoInvitedId == a && this.inviteStop();
        delete b.connections[a];
        this.fire("connections", b.connections)
    }
    ;
    g.prototype.onVideoOpen = function(a) {
        (this.videoId = a) && this.$callPanel.find(".panel-title").text(this._("Call with {username}", ["{username}"], [b.connections[a].data.userData.name]));
        this.$callPanel.show();
        this.updateLayout();
        this.roomOptions.group || this.renderConnections()
    }
    ;
    g.prototype.onVideoClose = function() {
        this.videoId = null;
        this.roomOptions.group || this.$elem.find("#localVideo").attr("src", "");
        this.$elem.find("#remoteVideo").attr("src", "");
        this.$callPanel.hide();
        this.inviteStop();
        this.renderConnections();
        this.remoteVideoGroupSelect()
    }
    ;
    g.prototype.inviteStart = function(a) {
        this.videoAnswerDialog(a);
        this.videoInvitedId = a;
        this.callRing(!1)
    }
    ;
    g.prototype.inviteStop = function() {
        this.$answerDialog.modal("hide");
        this.videoInvitedId = null;
        this.callRing(!0)
    }
    ;
    g.prototype.videoAnswerDialog = function(a) {
        var c = b.connections[a].data.userData;
        this.$answerDialog.data("caller_id", a);
        this.$answerDialog.find(".username").text(c.name);
        c.image && this.$answerDialog.find(".desc").html('<img src="' + c.image + '" alt="' + c.name + '"/>');
        this.$answerDialog.modal("show")
    }
    ;
    g.prototype.callRing = function(a) {
        var c = this.$elem.find("#ringSound").get(0);
        a ? c.pause() : c.play()
    }
    ;
    g.prototype.notifySound = function() {
        this.$elem.find("#notifySound").get(0).play()
    }
    ;
    g.prototype.rouletteNext = function() {
        this.videoId && b.drop(this.videoId, !1, !0);
        b.rouletteNext()
    }
    ;
    g.prototype.hasMedia = function(a, b) {
        try {
            return 0 < ("audio" == b ? a.getAudioTracks() : a.getVideoTracks()).length
        } catch (q) {
            return !1
        }
    }
    ;
    g.prototype.videoSetStream = function(a, b) {
        a.get(0).srcObject = b
    }
    ;
    g.prototype.localVideoOpen = function(a, b) {
        a ? (this.videoSetStream(this.$elem.find("#localVideo"), a),
        this.$elem.find("#localVideo").show(),
        this.isMuted = {
            audio: !1,
            video: !1
        },
        this.hasMedia(a, "video") || this.$elem.find("#videoMute"),
        this.hasMedia(a, "audio") || this.$elem.find("#audioMute")) : this.$elem.find("#localVideo").hide();
        this.onVideoOpen(b)
    }
    ;
    g.prototype.remoteVideoOpen = function(a, b) {
        a ? (this.videoSetStream(this.$elem.find("#remoteVideo"), a),
        this.$elem.find("#remoteVideo").show()) : this.$elem.find("#remoteVideo").hide();
        if (b)
            this.onVideoOpen(b)
    }
    ;
    g.prototype.remoteVideoGroupSelect = function() {
        if (this.roomOptions.group && !this.videoId)
            for (var a in b.connections)
                b.connections[a].rstream && this.$connectionsPanel.find("#connection_" + a + ".connectionItem").click()
    }
    ;
    g.prototype.getMediaOptions = function(a) {
        a.video = a.video && !this.roomOptions.disableVideo;
        a.audio = a.audio && !this.roomOptions.disableAudio;
        return a
    }
    ;
    g.prototype.onRoomOptions = function() {
        var a = -1 < navigator.userAgent.toLowerCase().indexOf("chrome");
        this.roomOptions.desktopShare = this.roomOptions.desktopShare && a;
        if (this.roomOptions.group || this.roomOptions.roulette)
            this.roomOptions.group ? (this.debug("This chat is group/conference chat"),
            this.$videoPanel.find("#callHangup").remove()) : (this.config.tplConnections = this.config.tplRoulette,
            this.debug("This chat is roulette chat")),
            b.debug("creating local media stream"),
            this.loginParams.noPc || this.loginParams.noMedia || this.roomOptions.disableVideo && this.roomOptions.disableAudio ? (b.debug("no webrtc support"),
            this.localStream = null,
            this.onMediaStreamGroup(!0)) : this.roomOptions.desktopShare ? (b.debug("sharing desktop dialog option"),
            this.$shareDialog.modal("show")) : this.createGroupStream();
        if (this.roomOptions.disableVideo) {
            this.$answerDialog.find("#answer").hide();
            a = this.$elem.find("#localVideoBg");
            var d = this.$elem.find("#remoteVideoBg");
            a.addClass("localAudio").show();
            d.addClass("remoteAudio").show();
            this.$elem.find("#localVideo").hide();
            this.$elem.find("#remoteVideo").hide()
        }
        this.roomOptions.disableAudio && this.$answerDialog.find("#answerAudio").hide()
    }
    ;
    g.prototype.createGroupStream = function(a) {
        var c = this;
        a = a ? a : this.getMediaOptions({
            audio: c.loginParams.hasAudioDevice,
            video: c.loginParams.hasVideoDevice
        });
        b.createStream(null, a, function(a) {
            b.debug("local stream added");
            c.onMediaStreamGroup(!0)
        }, function(a) {
            c.localStream = null;
            b.debug("local stream rejected");
            c.onMediaStreamGroup(!0)
        })
    }
    ;
    g.prototype.onMediaStreamGroup = function(a) {
        b.mediaReady();
        this.roomOptions.group && (this.connectAllMediaReady(),
        this.setChat(0));
        this.roomOptions.roulette && this.rouletteNext()
    }
    ;
    g.prototype.connectAllMediaReady = function() {
        var a = this;
        b.debug("connecting all media ready connections");
        if (b.connectionsLoaded) {
            if (!this.roomOptions.group && !this.roomOptions.roulette)
                return !1;
            for (var d in b.connections)
                if (!b.connections[d].rstream && b.connections[d].media_ready) {
                    b.connections[d].stream || (b.connections[d].stream = a.localStream);
                    if (b.refuseIdleState(d))
                        return !1;
                    b.sdpOffer(d)
                }
        } else
            b.debug("connections not loaded, wait 1s more..."),
            setTimeout(function() {
                a.connectAllMediaReady()
            }, 1E3)
    }
    ;
    g.prototype.getDesktopShareMedia = function(a) {
        var c = this;
        p.getSourceId(function(d, e) {
            if (!d)
                return "no-permission" == e && "https:" != location.protocol && c.message(c._("Desktop can be shared only over https secure connection."), "danger"),
                "no-extension" == e && (c.message(c._('Please <a href="#" class="btn btn-success extensionInstall">install</a> this chrome extension in order to use desktop sharing and reload this page.'), "danger"),
                c.$elem.find(".extensionInstall").click(function() {
                    try {
                        chrome.webstore.install("https://chrome.google.com/webstore/detail/" + c.config.chromeExtensionId, function() {
                            location.reload()
                        }, function(a) {
                            c.message(a, "danger")
                        })
                    } catch (r) {
                        k.open("https://chrome.google.com/webstore/detail/" + c.config.chromeExtensionId, "install")
                    }
                    return !1
                })),
                a(!1);
            d = {
                audio: !1,
                video: {
                    mandatory: {
                        chromeMediaSource: "desktop",
                        chromeMediaSourceId: d,
                        maxWidth: k.screen.width,
                        maxHeight: k.screen.height,
                        maxFrameRate: 3
                    }
                }
            };
            c.roomOptions.disableAudio || (d.audioAppend = !0);
            b.debug("mediaOptions");
            b.debug(d);
            return a(d)
        })
    }
    ;
    g.prototype.disableChat = function(a) {
        a ? this.$chatPanel.find("#chat_" + a + " .form-control").attr("disabled", "disabled") : this.$chatPanel.find(".form-control").attr("disabled", "disabled")
    }
    ;
    g.prototype.setChat = function(a) {
        this.chatId = a;
        this.$chatPanel.find(".chat").hide();
        this.getChatDiv(a).show();
        0 < a ? this.$chatPanel.find(".panel-title").text(this._("Chat with {username}", ["{username}"], [b.connections[a].data.userData.name])) : this.$chatPanel.find(".panel-title").text(this._("Group chat"));
        this.$chatPanel.show();
        this.updateLayout();
        a && b.connections[a].data.unread && (b.connections[a].data.unread = 0,
        this.renderConnection(a))
    }
    ;
    g.prototype.getRtc = function() {
        return b
    }
    ;
    f.fn.mgVideoChat = function(a, b, d) {
        if ("on" === a) {
            var c = f(this).data("mgVideoChat-instance");
            if (c)
                return c.on(b, d)
        } else {
            var e = [];
            this.each(function() {
                e.push(new g(this,a))
            });
            return 1 === e.length ? e[0] : e
        }
    }
    ;
    f.fn.mgVideoChat._ = function(a, b, d) {
        var c = a;
        f.fn.mgVideoChat.translate && f.fn.mgVideoChat.translate[a] && (c = f.fn.mgVideoChat.translate[a]);
        if (!b || !b.length)
            return c;
        for (var e = 0; e < b.length; e++)
            a = new RegExp(b[e],"g"),
            c = c.replace(a, d[e]);
        return c
    }
    ;
    f.fn.mgVideoChat.htmlspecialchars = function(a, b, d, e) {
        d = 0;
        var c = !1;
        if ("undefined" === typeof b || null === b)
            b = 2;
        a = a.toString();
        !1 !== e && (a = a.replace(/&/g, "&amp;"));
        a = a.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var f = {
            ENT_NOQUOTES: 0,
            ENT_HTML_QUOTE_SINGLE: 1,
            ENT_HTML_QUOTE_DOUBLE: 2,
            ENT_COMPAT: 2,
            ENT_QUOTES: 3,
            ENT_IGNORE: 4
        };
        0 === b && (c = !0);
        if ("number" !== typeof b) {
            b = [].concat(b);
            for (e = 0; e < b.length; e++)
                0 === f[b[e]] ? c = !0 : f[b[e]] && (d |= f[b[e]]);
            b = d
        }
        b & f.ENT_HTML_QUOTE_SINGLE && (a = a.replace(/'/g, "&#039;"));
        c || (a = a.replace(/"/g, "&quot;"));
        return a
    }
}
)(jQuery, window, document);
