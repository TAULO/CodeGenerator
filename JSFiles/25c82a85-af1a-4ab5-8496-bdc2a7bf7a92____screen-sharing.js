/*
var scripts = ["https://www.webrtc-experiment.com/socket.io.js",
    "https://webrtc.github.io/adapter/adapter-latest.js",
    "https://www.webrtc-experiment.com/IceServersHandler.js","iceServer.js",
    "https://www.webrtc-experiment.com/getScreenId.js",
    "https://www.webrtc-experiment.com/CodecsHandler.js",
    "https://www.webrtc-experiment.com/BandwidthHandler.js",
    "https://www.webrtc-experiment.com/screen.js",
    "screen-sharing-custom.js"];

scripts.map((script)=>{
    let currentScript = document.createElement('script');
    currentScript.src = script;
    document.head.appendChild(currentScript);
});
*/
    // alert("loading screen share");
    console.log("loading screen-share.js");
 var videosContainer = document.getElementById("videos-container") || document.body;
    var roomsList = document.getElementById('rooms-list');
    // alert(location.href);

/*Trying to these variable outside this file also;*/
var screensharing;
var channel;
var sender;
var SIGNALING_SERVER;
var socket;

    try {
        console.log(`Trying constructor`);
        let sss = new Screen();
        console.log(`After constructor`);
        setTimeout(()=> {
            console.log('IN SET Timeout of loading of screen-sharing.js');
            screensharing = new Screen();

            // alert(document.getElementById('roomIdScreen'));
            console.log(`Before replace : ${location.href}`);
            channel = location.href.replace(/\/|:|\?|-|=|#|%|\.|\[|\]/g, '');
            console.log(`CHANNEL : ${channel}`)
            console.log(`After replace : ${location.href}`);
            sender = Math.round(Math.random() * 999999999) + 999999999;
            console.log(`SENDER : ${sender}`);
            /*

                var channel = fullLocation;
                var sender = Math.round(Math.random() * 999999999) + 999999999;
            */

            SIGNALING_SERVER = 'https://socketio-over-nodejs2.herokuapp.com:443/';
            io.connect(SIGNALING_SERVER).emit('new-channel', {
                channel: channel,
                sender: sender
            });

            socket = io.connect(SIGNALING_SERVER + channel, {transports: ['polling', 'flashsocket'], origins: '*'});
            socket.on('connect', function () {
                // setup peer connection & pass socket object over the constructor!
                console.log(`IN SOCKET.ON`);
            });
            socket.send = function (message) {
                console.log(`IN SOCKET.SEND`);
                console.log('SENDING MESSAGE : ' + message);
                console.log('SENDER : ' + sender);
                socket.emit('message', {
                    sender: sender,
                    data: message
                });
            };

            // alert('here');

            screensharing.openSignalingChannel = function (callback) {
                console.log(`IN OPEN SIGNAL CHANNEL`);
                return socket.on('message', callback);
            };

            screensharing.onscreen = function (_screen) {
                var alreadyExist = document.getElementById(_screen.userid);
                alert("ON SCREEN Screen id = " + _screen.userid + " room id = " + _screen.roomid);
                console.log(`SCREENSHARING.ONSCREEN USERID = ${_screen.userid} Roomid = ${_screen.roomid}`);
                if (alreadyExist) return;

                if (typeof roomsList === 'undefined') roomsList = document.body;

                var tr = document.createElement('tr');

                tr.id = _screen.userid;
                tr.innerHTML = '<td>' + _screen.userid + ' shared his screen.</td>' +
                    '<td><button class="join">View</button></td>';
                roomsList.insertBefore(tr, roomsList.firstChild);

                var button = tr.querySelector('.join');
                button.setAttribute('data-userid', _screen.userid);
                button.setAttribute('data-roomid', _screen.roomid);
                button.onclick = function () {
                    var button = this;
                    button.disabled = true;

                    var _screen = {
                        userid: button.getAttribute('data-userid'),
                        roomid: button.getAttribute('data-roomid')
                    };
                    screensharing.view(_screen);
                };
            };

// on getting each new screen
            screensharing.onaddstream = function (media) {
                media.video.id = media.userid;

                /* This runs when another user joins the stream (); */
                console.log(`SCREENSHARING.ONADDSTREAM WITH USERID = ${media.userid}`);
                alert("ADDING STREAM with media.userid = " + media.userid);
                var video = media.video;
                videosContainer.insertBefore(video, videosContainer.firstChild);
                rotateVideo(video);

                var hideAfterJoin = document.querySelectorAll('.hide-after-join');
                for (var i = 0; i < hideAfterJoin.length; i++) {
                    hideAfterJoin[i].style.display = 'none';
                }

                if (media.type === 'local') {
                    addStreamStopListener(media.stream, function () {
                        location.reload();
                    });
                }
            };


// if someone leaves; just remove his screen

            screensharing.onuserleft = function (userid) {
                /*This runs when user who has joined a stream, leaves the stream*/

                //TEST SOCKET SEND;
                let message = {
                    "roomid": roomId,
                    "broadcasting":false,
                    "userid":userid
                };
                socket.send(JSON.stringify(message));

                alert("SCREENSHARING.ONUSERLEFT = " + userid);
                var video = document.getElementById(userid);
                video.srcObject.getTracks().forEach(track => track.stop());
                // socket.disconnect();
                if (video && video.parentNode) video.parentNode.removeChild(video);
                // location.reload();


            };

            screensharing.onmessage = function (message) {
                console.log(`in on message ${message}`);
                alert("IN ONMESSAGE");
            };
// check pre-shared screens
            screensharing.check();
            /*
                let userFromAuth = null;
                function setUserFromAuth(username){

                }
                */
            // alert('1 line before share-screen');
            document.getElementById('share-screen').onclick = function () {
                var username = document.getElementById('user-name');
                username.disabled = this.disabled = true;
                alert(`adding onclick function to : ${document.getElementById('share-screen')}` )
                screensharing.isModerator = true;
                screensharing.userid = username.value;

                screensharing.share();
            };

            function initiateScreenSharing(){
                var username = document.getElementById('user-name');
                username.disabled = this.disabled = true;
                alert(`INITIATING SCREEN SHARING  to : ${document.getElementById('share-screen')}` )
                screensharing.isModerator = true;
                screensharing.userid = username.value;
                alert("Initiating screen sharing with username.value, user.id : " + username.value  + " , " + screensharing.userid);

                screensharing.share();
            }

            function rotateVideo(video) {
                video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
                setTimeout(function () {
                    video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
                }, 1000);
            }

            screensharing.onNumberOfParticipantsChnaged = function (numberOfParticipants) {
                if (!screensharing.isModerator) return;
                alert("SCREENSHARING.ONNUMBEROFPARTICIPANTS CHANGED");
                document.title = numberOfParticipants + ' users are viewing your screen!';
                var element = document.getElementById('number-of-participants');
                if (element) {
                    element.innerHTML = numberOfParticipants + ' users are viewing your screen!';
                }
            };

// todo: need to check exact f browser because opera also uses chromium framework
            var isChrome = !!navigator.webkitGetUserMedia;

// DetectRTC.js - https://github.com/muaz-khan/WebRTC-Experiment/tree/master/DetectRTC
// Below code is taken from RTCMultiConnection-v1.8.js (http://www.rtcmulticonnection.org/changes-log/#v1.8)
            var DetectRTC = {};

            (function () {

                var screenCallback;

                DetectRTC.screen = {
                    chromeMediaSource: 'screen',
                    getSourceId: function (callback) {
                        if (!callback) throw '"callback" parameter is mandatory.';
                        screenCallback = callback;
                        window.postMessage('get-sourceId', '*');
                    },
                    isChromeExtensionAvailable: function (callback) {
                        if (!callback) return;

                        if (DetectRTC.screen.chromeMediaSource == 'desktop') return callback(true);

                        // ask extension if it is available
                        window.postMessage('are-you-there', '*');

                        setTimeout(function () {
                            if (DetectRTC.screen.chromeMediaSource == 'screen') {
                                callback(false);
                            } else callback(true);
                        }, 2000);
                    },
                    onMessageCallback: function (data) {
                        if (!(typeof data == 'string' || !!data.sourceId)) return;

                        console.log('chrome message', data);

                        // "cancel" button is clicked
                        if (data == 'PermissionDeniedError') {
                            DetectRTC.screen.chromeMediaSource = 'PermissionDeniedError';
                            if (screenCallback) return screenCallback('PermissionDeniedError');
                            else throw new Error('PermissionDeniedError');
                        }

                        // extension notified his presence
                        if (data == 'rtcmulticonnection-extension-loaded') {
                            if (document.getElementById('install-button')) {
                                document.getElementById('install-button').parentNode.innerHTML = '<strong>Great!</strong> <a href="https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk" target="_blank">Google chrome extension</a> is installed.';
                            }
                            DetectRTC.screen.chromeMediaSource = 'desktop';
                        }

                        // extension shared temp sourceId
                        if (data.sourceId) {
                            DetectRTC.screen.sourceId = data.sourceId;
                            if (screenCallback) screenCallback(DetectRTC.screen.sourceId);
                        }
                    },
                    getChromeExtensionStatus: function (callback) {
                        if (!!navigator.mozGetUserMedia) return callback('not-chrome');

                        var extensionid = 'ajhifddimkapgcifgcodmmfdlknahffk';

                        var image = document.createElement('img');
                        image.src = 'chrome-extension://' + extensionid + '/icon.png';
                        image.onload = function () {
                            DetectRTC.screen.chromeMediaSource = 'screen';
                            window.postMessage('are-you-there', '*');
                            setTimeout(function () {
                                if (!DetectRTC.screen.notInstalled) {
                                    callback('installed-enabled');
                                }
                            }, 2000);
                        };
                        image.onerror = function () {
                            DetectRTC.screen.notInstalled = true;
                            callback('not-installed');
                        };
                    }
                };

                // check if desktop-capture extension installed.
                if (window.postMessage && isChrome) {
                    DetectRTC.screen.isChromeExtensionAvailable();
                }
            })();

            DetectRTC.screen.getChromeExtensionStatus(function (status) {
                if (status == 'installed-enabled') {
                    if (document.getElementById('install-button')) {
                        document.getElementById('install-button').parentNode.innerHTML = '<strong>Great!</strong> <a href="https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk" target="_blank">Google chrome extension</a> is installed.';
                    }
                    DetectRTC.screen.chromeMediaSource = 'desktop';
                }
            });

            window.addEventListener('message', function (event) {
                if (event.origin != window.location.origin) {
                    return;
                }

                DetectRTC.screen.onMessageCallback(event.data);
            });

            console.log('current chromeMediaSource', DetectRTC.screen.chromeMediaSource);


            // alert("done loading screen share");
            console.log("done loading screen-share.js from try");
        },1500);
    }
    catch(e) {
        console.log(`in catch`);
        if (e){
            setTimeout(() =>{

                console.log('IN SET Timeout of loading of screen-sharing.js');
                screensharing = new Screen();

                // alert(document.getElementById('roomIdScreen'));
                console.log(`Before replace : ${location.href}`);
                channel = location.href.replace(/\/|:|\?|-|=|#|%|\.|\[|\]/g, '');
                console.log(`CHANNEL : ${channel}`)
                console.log(`After replace : ${location.href}`);
                sender = Math.round(Math.random() * 999999999) + 999999999;
                console.log(`SENDER : ${sender}`);
                /*

                    var channel = fullLocation;
                    var sender = Math.round(Math.random() * 999999999) + 999999999;
                */

                SIGNALING_SERVER = 'https://socketio-over-nodejs2.herokuapp.com:443/';
                io.connect(SIGNALING_SERVER).emit('new-channel', {
                    channel: channel,
                    sender: sender
                });

                socket = io.connect(SIGNALING_SERVER + channel, {transports: ['polling', 'flashsocket'], origins: '*'});
                socket.on('connect', function () {
                    // setup peer connection & pass socket object over the constructor!
                    console.log(`IN SOCKET.ON`);
                });
                socket.send = function (message) {
                    console.log(`IN SOCKET.SEND`);
                    console.log('SENDING MESSAGE : ' + message);
                    console.log('SENDER : ' + sender);
                    socket.emit('message', {
                        sender: sender,
                        data: message
                    });
                };

                // alert('here');

                screensharing.openSignalingChannel = function (callback) {
                    console.log(`IN OPEN SIGNAL CHANNEL`);
                    return socket.on('message', callback);
                };

                screensharing.onscreen = function (_screen) {
                    var alreadyExist = document.getElementById(_screen.userid);
                    alert("ON SCREEN Screen id = " + _screen.userid + " room id = " + _screen.roomid);
                    console.log(`SCREENSHARING.ONSCREEN USERID = ${_screen.userid} Roomid = ${_screen.roomid}`);
                    if (alreadyExist) return;

                    if (typeof roomsList === 'undefined') roomsList = document.body;

                    var tr = document.createElement('tr');

                    tr.id = _screen.userid;
                    tr.innerHTML = '<td>' + _screen.userid + ' shared his screen.</td>' +
                        '<td><button class="join">View</button></td>';
                    roomsList.insertBefore(tr, roomsList.firstChild);

                    var button = tr.querySelector('.join');
                    button.setAttribute('data-userid', _screen.userid);
                    button.setAttribute('data-roomid', _screen.roomid);
                    button.onclick = function () {
                        var button = this;
                        button.disabled = true;

                        var _screen = {
                            userid: button.getAttribute('data-userid'),
                            roomid: button.getAttribute('data-roomid')
                        };
                        screensharing.view(_screen);
                    };
                };

// on getting each new screen
                screensharing.onaddstream = function (media) {
                    media.video.id = media.userid;

                    /* This runs when another user joins the stream (); */
                    console.log(`SCREENSHARING.ONADDSTREAM WITH USERID = ${media.userid}`);
                    alert("ADDING STREAM with media.userid = " + media.userid);
                    var video = media.video;
                    videosContainer.insertBefore(video, videosContainer.firstChild);
                    rotateVideo(video);

                    var hideAfterJoin = document.querySelectorAll('.hide-after-join');
                    for (var i = 0; i < hideAfterJoin.length; i++) {
                        hideAfterJoin[i].style.display = 'none';
                    }

                    if (media.type === 'local') {
                        addStreamStopListener(media.stream, function () {
                            location.reload();
                        });
                    }
                };


// if someone leaves; just remove his screen

                screensharing.onuserleft = function (userid) {
                    /*This runs when user who has joined a stream, leaves the stream*/

                    //TEST SOCKET SEND;
                    let message = {
                        "roomid": roomId,
                        "broadcasting":false,
                        "userid":userid
                    };
                    socket.send(JSON.stringify(message));

                    alert("SCREENSHARING.ONUSERLEFT = " + userid);
                    var video = document.getElementById(userid);
                    video.srcObject.getTracks().forEach(track => track.stop());
                    socket.disconnect();
                    if (video && video.parentNode) video.parentNode.removeChild(video);
                    // location.reload();


                };

                screensharing.onmessage = function (message) {
                    console.log(`in on message ${message}`);
                    alert("IN ONMESSAGE");
                };
// check pre-shared screens
                screensharing.check();
                /*
                    let userFromAuth = null;
                    function setUserFromAuth(username){

                    }
                    */
                // alert('1 line before share-screen');
                document.getElementById('share-screen').onclick = function () {
                    var username = document.getElementById('user-name');
                    username.disabled = this.disabled = true;
                    alert(`adding onclick function to : ${document.getElementById('share-screen')}` )
                    screensharing.isModerator = true;
                    screensharing.userid = username.value;

                    screensharing.share();
                };

                function initiateScreenSharing(){
                    var username = document.getElementById('user-name');
                    username.disabled = this.disabled = true;
                    alert(`INITIATING SCREEN SHARING  to : ${document.getElementById('share-screen')}` )
                    screensharing.isModerator = true;
                    screensharing.userid = username.value;
                    alert("Initiating screen sharing with username.value, user.id : " + username.value  + " , " + screensharing.userid);

                    screensharing.share();
                }

                function rotateVideo(video) {
                    video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
                    setTimeout(function () {
                        video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
                    }, 1000);
                }

                screensharing.onNumberOfParticipantsChnaged = function (numberOfParticipants) {
                    if (!screensharing.isModerator) return;
                    alert("SCREENSHARING.ONNUMBEROFPARTICIPANTS CHANGED");
                    document.title = numberOfParticipants + ' users are viewing your screen!';
                    var element = document.getElementById('number-of-participants');
                    if (element) {
                        element.innerHTML = numberOfParticipants + ' users are viewing your screen!';
                    }
                };

// todo: need to check exact f browser because opera also uses chromium framework
                var isChrome = !!navigator.webkitGetUserMedia;

// DetectRTC.js - https://github.com/muaz-khan/WebRTC-Experiment/tree/master/DetectRTC
// Below code is taken from RTCMultiConnection-v1.8.js (http://www.rtcmulticonnection.org/changes-log/#v1.8)
                var DetectRTC = {};

                (function () {

                    var screenCallback;

                    DetectRTC.screen = {
                        chromeMediaSource: 'screen',
                        getSourceId: function (callback) {
                            if (!callback) throw '"callback" parameter is mandatory.';
                            screenCallback = callback;
                            window.postMessage('get-sourceId', '*');
                        },
                        isChromeExtensionAvailable: function (callback) {
                            if (!callback) return;

                            if (DetectRTC.screen.chromeMediaSource == 'desktop') return callback(true);

                            // ask extension if it is available
                            window.postMessage('are-you-there', '*');

                            setTimeout(function () {
                                if (DetectRTC.screen.chromeMediaSource == 'screen') {
                                    callback(false);
                                } else callback(true);
                            }, 2000);
                        },
                        onMessageCallback: function (data) {
                            if (!(typeof data == 'string' || !!data.sourceId)) return;

                            console.log('chrome message', data);

                            // "cancel" button is clicked
                            if (data == 'PermissionDeniedError') {
                                DetectRTC.screen.chromeMediaSource = 'PermissionDeniedError';
                                if (screenCallback) return screenCallback('PermissionDeniedError');
                                else throw new Error('PermissionDeniedError');
                            }

                            // extension notified his presence
                            if (data == 'rtcmulticonnection-extension-loaded') {
                                if (document.getElementById('install-button')) {
                                    document.getElementById('install-button').parentNode.innerHTML = '<strong>Great!</strong> <a href="https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk" target="_blank">Google chrome extension</a> is installed.';
                                }
                                DetectRTC.screen.chromeMediaSource = 'desktop';
                            }

                            // extension shared temp sourceId
                            if (data.sourceId) {
                                DetectRTC.screen.sourceId = data.sourceId;
                                if (screenCallback) screenCallback(DetectRTC.screen.sourceId);
                            }
                        },
                        getChromeExtensionStatus: function (callback) {
                            if (!!navigator.mozGetUserMedia) return callback('not-chrome');

                            var extensionid = 'ajhifddimkapgcifgcodmmfdlknahffk';

                            var image = document.createElement('img');
                            image.src = 'chrome-extension://' + extensionid + '/icon.png';
                            image.onload = function () {
                                DetectRTC.screen.chromeMediaSource = 'screen';
                                window.postMessage('are-you-there', '*');
                                setTimeout(function () {
                                    if (!DetectRTC.screen.notInstalled) {
                                        callback('installed-enabled');
                                    }
                                }, 2000);
                            };
                            image.onerror = function () {
                                DetectRTC.screen.notInstalled = true;
                                callback('not-installed');
                            };
                        }
                    };

                    // check if desktop-capture extension installed.
                    if (window.postMessage && isChrome) {
                        DetectRTC.screen.isChromeExtensionAvailable();
                    }
                })();

                DetectRTC.screen.getChromeExtensionStatus(function (status) {
                    if (status == 'installed-enabled') {
                        if (document.getElementById('install-button')) {
                            document.getElementById('install-button').parentNode.innerHTML = '<strong>Great!</strong> <a href="https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk" target="_blank">Google chrome extension</a> is installed.';
                        }
                        DetectRTC.screen.chromeMediaSource = 'desktop';
                    }
                });

                window.addEventListener('message', function (event) {
                    if (event.origin != window.location.origin) {
                        return;
                    }

                    DetectRTC.screen.onMessageCallback(event.data);
                });

                console.log('current chromeMediaSource', DetectRTC.screen.chromeMediaSource);


                // alert("done loading screen share");
                console.log("done loading screen-share.js");
            },1500);
        }
    }
/*

    var screensharing = new Screen();

    // alert(document.getElementById('roomIdScreen'));
        console.log(`Before replace : ${location.href}`);
        var channel = location.href.replace(/\/|:|\?|-|=|#|%|\.|\[|\]/g, '');
        console.log(`CHANNEL : ${channel}`)
        console.log(`After replace : ${location.href}`);
        var sender = Math.round(Math.random() * 999999999) + 999999999;
        console.log(`SENDER : ${sender}`);
/!*

    var channel = fullLocation;
    var sender = Math.round(Math.random() * 999999999) + 999999999;
*!/

    var SIGNALING_SERVER = 'https://socketio-over-nodejs2.herokuapp.com:443/';
    io.connect(SIGNALING_SERVER).emit('new-channel', {
        channel: channel,
        sender: sender
    });

    var socket = io.connect(SIGNALING_SERVER + channel, {transports: ['polling', 'flashsocket'], origins: '*'});
    socket.on('connect', function () {
        // setup peer connection & pass socket object over the constructor!
        console.log(`IN SOCKET.ON`);
    });
    socket.send = function (message) {
        console.log(`IN SOCKET.SEND`);
        console.log('SENDING MESSAGE : ' + message);
        console.log('SENDER : ' + sender);
        socket.emit('message', {
            sender: sender,
            data: message
        });
    };

    // alert('here');

    screensharing.openSignalingChannel = function (callback) {
        console.log(`IN OPEN SIGNAL CHANNEL`);
        return socket.on('message', callback);
    };

    screensharing.onscreen = function (_screen) {
        var alreadyExist = document.getElementById(_screen.userid);
        alert("ON SCREEN Screen id = " + _screen.userid + " room id = " + _screen.roomid);
        console.log(`SCREENSHARING.ONSCREEN USERID = ${_screen.userid} Roomid = ${_screen.roomid}`);
        if (alreadyExist) return;

        if (typeof roomsList === 'undefined') roomsList = document.body;

        var tr = document.createElement('tr');

        tr.id = _screen.userid;
        tr.innerHTML = '<td>' + _screen.userid + ' shared his screen.</td>' +
            '<td><button class="join">View</button></td>';
        roomsList.insertBefore(tr, roomsList.firstChild);

        var button = tr.querySelector('.join');
        button.setAttribute('data-userid', _screen.userid);
        button.setAttribute('data-roomid', _screen.roomid);
        button.onclick = function () {
            var button = this;
            button.disabled = true;

            var _screen = {
                userid: button.getAttribute('data-userid'),
                roomid: button.getAttribute('data-roomid')
            };
            screensharing.view(_screen);
        };
    };

// on getting each new screen
    screensharing.onaddstream = function (media) {
        media.video.id = media.userid;

        /!* This runs when another user joins the stream (); *!/
        console.log(`SCREENSHARING.ONADDSTREAM WITH USERID = ${media.userid}`);
        alert("ADDING STREAM with media.userid = " + media.userid);
        var video = media.video;
        videosContainer.insertBefore(video, videosContainer.firstChild);
        rotateVideo(video);

        var hideAfterJoin = document.querySelectorAll('.hide-after-join');
        for (var i = 0; i < hideAfterJoin.length; i++) {
            hideAfterJoin[i].style.display = 'none';
        }

        if (media.type === 'local') {
            addStreamStopListener(media.stream, function () {
                location.reload();
            });
        }
    };


// if someone leaves; just remove his screen

    screensharing.onuserleft = function (userid) {
        /!*This runs when user who has joined a stream, leaves the stream*!/

        //TEST SOCKET SEND;
        let message = {
            "roomid": roomId,
            "broadcasting":false,
            "userid":userid
        };
        socket.send(JSON.stringify(message));

        alert("SCREENSHARING.ONUSERLEFT = " + userid);
        var video = document.getElementById(userid);
        video.srcObject.getTracks().forEach(track => track.stop());
        this.socket.disconnect();``
        if (video && video.parentNode) video.parentNode.removeChild(video);
        // location.reload();


    };

    screensharing.onmessage = function (message) {
        console.log(`in on message ${message}`);
        alert("IN ONMESSAGE");
    };
// check pre-shared screens
    screensharing.check();
/!*
    let userFromAuth = null;
    function setUserFromAuth(username){

    }
    *!/
    // alert('1 line before share-screen');
    document.getElementById('share-screen').onclick = function () {
        var username = document.getElementById('user-name');
        username.disabled = this.disabled = true;
        alert(`adding onclick function to : ${document.getElementById('share-screen')}` )
        screensharing.isModerator = true;
        screensharing.userid = username.value;

        screensharing.share();
    };

function initiateScreenSharing(){
    var username = document.getElementById('user-name');
    username.disabled = this.disabled = true;
    alert(`INITIATING SCREEN SHARING  to : ${document.getElementById('share-screen')}` )
    screensharing.isModerator = true;
    screensharing.userid = username.value;
    alert("Initiating screen sharing with username.value, user.id : " + username.value  + " , " + screensharing.userid);

    screensharing.share();
}

    function rotateVideo(video) {
        video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
        setTimeout(function () {
            video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
        }, 1000);
    }

    screensharing.onNumberOfParticipantsChnaged = function (numberOfParticipants) {
        if (!screensharing.isModerator) return;
        alert("SCREENSHARING.ONNUMBEROFPARTICIPANTS CHANGED");
        document.title = numberOfParticipants + ' users are viewing your screen!';
        var element = document.getElementById('number-of-participants');
        if (element) {
            element.innerHTML = numberOfParticipants + ' users are viewing your screen!';
        }
    };

// todo: need to check exact f browser because opera also uses chromium framework
    var isChrome = !!navigator.webkitGetUserMedia;

// DetectRTC.js - https://github.com/muaz-khan/WebRTC-Experiment/tree/master/DetectRTC
// Below code is taken from RTCMultiConnection-v1.8.js (http://www.rtcmulticonnection.org/changes-log/#v1.8)
    var DetectRTC = {};

    (function () {

        var screenCallback;

        DetectRTC.screen = {
            chromeMediaSource: 'screen',
            getSourceId: function (callback) {
                if (!callback) throw '"callback" parameter is mandatory.';
                screenCallback = callback;
                window.postMessage('get-sourceId', '*');
            },
            isChromeExtensionAvailable: function (callback) {
                if (!callback) return;

                if (DetectRTC.screen.chromeMediaSource == 'desktop') return callback(true);

                // ask extension if it is available
                window.postMessage('are-you-there', '*');

                setTimeout(function () {
                    if (DetectRTC.screen.chromeMediaSource == 'screen') {
                        callback(false);
                    } else callback(true);
                }, 2000);
            },
            onMessageCallback: function (data) {
                if (!(typeof data == 'string' || !!data.sourceId)) return;

                console.log('chrome message', data);

                // "cancel" button is clicked
                if (data == 'PermissionDeniedError') {
                    DetectRTC.screen.chromeMediaSource = 'PermissionDeniedError';
                    if (screenCallback) return screenCallback('PermissionDeniedError');
                    else throw new Error('PermissionDeniedError');
                }

                // extension notified his presence
                if (data == 'rtcmulticonnection-extension-loaded') {
                    if (document.getElementById('install-button')) {
                        document.getElementById('install-button').parentNode.innerHTML = '<strong>Great!</strong> <a href="https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk" target="_blank">Google chrome extension</a> is installed.';
                    }
                    DetectRTC.screen.chromeMediaSource = 'desktop';
                }

                // extension shared temp sourceId
                if (data.sourceId) {
                    DetectRTC.screen.sourceId = data.sourceId;
                    if (screenCallback) screenCallback(DetectRTC.screen.sourceId);
                }
            },
            getChromeExtensionStatus: function (callback) {
                if (!!navigator.mozGetUserMedia) return callback('not-chrome');

                var extensionid = 'ajhifddimkapgcifgcodmmfdlknahffk';

                var image = document.createElement('img');
                image.src = 'chrome-extension://' + extensionid + '/icon.png';
                image.onload = function () {
                    DetectRTC.screen.chromeMediaSource = 'screen';
                    window.postMessage('are-you-there', '*');
                    setTimeout(function () {
                        if (!DetectRTC.screen.notInstalled) {
                            callback('installed-enabled');
                        }
                    }, 2000);
                };
                image.onerror = function () {
                    DetectRTC.screen.notInstalled = true;
                    callback('not-installed');
                };
            }
        };

        // check if desktop-capture extension installed.
        if (window.postMessage && isChrome) {
            DetectRTC.screen.isChromeExtensionAvailable();
        }
    })();

    DetectRTC.screen.getChromeExtensionStatus(function (status) {
        if (status == 'installed-enabled') {
            if (document.getElementById('install-button')) {
                document.getElementById('install-button').parentNode.innerHTML = '<strong>Great!</strong> <a href="https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk" target="_blank">Google chrome extension</a> is installed.';
            }
            DetectRTC.screen.chromeMediaSource = 'desktop';
        }
    });

    window.addEventListener('message', function (event) {
        if (event.origin != window.location.origin) {
            return;
        }

        DetectRTC.screen.onMessageCallback(event.data);
    });

    console.log('current chromeMediaSource', DetectRTC.screen.chromeMediaSource);


alert("done loading screen share");
console.log("done loading screen share");*/
