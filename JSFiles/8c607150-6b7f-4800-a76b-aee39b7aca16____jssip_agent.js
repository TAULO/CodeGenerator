var ua;
var my_sip_uri = document.getElementById('my_sip_uri');
var pc_config = document.getElementById('pc_config');
var sip_password = document.getElementById('sip_password');
var currentSession = null;
var remoteStream = document.getElementById('remoteView');
var selfStream = document.getElementById('selfView');
var persistStream = document.getElementById('persistView');
var call_option_buttons = document.getElementById('call-option-buttons');
var mute_audio_button = document.getElementById('mute-audio');
var hide_video_button = document.getElementById('hide-video');
var mute_audio_icon = document.getElementById('mute-audio-icon');
var mute_captions_button = document.getElementById('mute-captions');
var mute_captions_off_icon = document.getElementById('mute-captions-off-icon');
var transcript_overlay = document.getElementById('transcriptoverlay');
var hide_video_icon = document.getElementById('mute-camera-off-icon');
var hold_button = document.getElementById('hold-call');
var screenShareEnabled = false;
var debug = true; // console logs event info if true
var jssip_debug = true; // enables debugging logs from jssip library 
// if true NOTE: may have to refresh a lot to update change
var incomingCall = null;
var recording = false;
var outbound_timer = null;
var callParticipantsExt = [];
var isMuted = false;
var showTransferModal = false;
var isMultipartyCall = false;
var activeParticipantCount;
var activeParticipants = [];
var isMonitorInSession = false;
var reinviteMonitorMultipartyInvite = false;
var reinviteMonitorMultipartyTransition = false;
var monitorCaptions = false;

//setup for the call. creates and starts the User Agent (UA) and registers event handlers
function register_jssip() {
  // Events
  var eventHandlers = {
    connected: function (e) {
      console.log('--- WV: Connected ---\n');
      console.log('True for connected' + e.stream);
    },
    sipConfirmed: function (e) {
      console.log('--- WV: sipConfirmed ---\n');
      // TRY REINVITE
      // console.log('\n\nHERE TRY sipReinvite()...');
      // acekurento.sipReinvite();

      // TRY SIPUPDATE
      // console.log('\n\nHERE TRY sipUpdate()...');
      // acekurento.sipUpdate();

      // TRY ICERESTART
      // console.log('\n\nHERE TRY iceRestart()...');
      // acekurento.iceRestart();
      console.log('--- WV: after new calls ---\n');
    },
    newMessage: function (e) {
      console.log('--- WV: New Message---\n');
      try {
        var transcripts = JSON.parse(e.msg);
        if (transcripts.transcript) {
          if (acekurento.isMultiparty) {
            console.log('sending multiparty caption:', transcripts.transcript, extensionMe);
                        socket.emit('multiparty-caption-agent', {
              transcript: transcripts.transcript,
              final: transcripts.final,
              language: transcripts.langCd,
              displayname: $('#callerFirstName').val() + ' ' + $('#callerLastName').val(),
              agent: false,
              participants: callParticipantsExt
            });
          } else {
            if (beingMonitored) {
              socket.emit('multiparty-caption-agent', {
                transcript: transcripts.transcript,
                final: transcripts.final,
                language: transcripts.langCd,
                displayname: $('#callerFirstName').val() + ' ' + $('#callerLastName').val(),
                agent: false,
                participants: callParticipantsExt,
                hasMonitor: true,
                monitorExt: monitorExt
              });
            }
            // Acedirect will skip translation service if languages are the same
            console.log('sending caption:', transcripts.transcript, extensionMe);
            socket.emit('translate-caption', {
              transcripts: transcripts,
              callerNumber: extensionMe,
              displayname: $('#callerFirstName').val() + ' ' + $('#callerLastName').val()
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    participantsUpdate: function (e) {
      console.log('--- WV: Participants Update ---\n');
      console.log('--- WV: ' + JSON.stringify(e));
      var participants = [];
      activeParticipantCount = 0;
      acekurento.activeAgentList = [];
      activeParticipants = [];
      isMonitorInSession = false;
      var isConsumerInSession = false;
      participants = e.participants.map(function (p) { return p; });
      callParticipantsExt = participants.map(function (p) { return p.ext; });

      activeParticipantCount = participants.length;

      for (var i = 0; i < participants.length; i++) {
        activeParticipants.push(participants[i]);
        if (participants[i].isMonitor) {
          activeParticipants.pop();
          // a monitor is in the call. ignore them
          activeParticipantCount = activeParticipantCount -1;
          monitorExt = participants[i].ext;
          isMonitorInSession = true;
        } else if (participants[i].isAgent) {
          acekurento.activeAgentList.push(participants[i]);
        } else if(participants[i].type === 'participant:webrtc') {
          // webrtc consumer. enable chat and file share
          isConsumerInSession = true;
          consumerType = 'webrtc';
          enable_chat_buttons();
          socket.emit('begin-file-share', { vrs: $('#callerPhone').val(), agentExt: extensionMe });
        }  else if (participants[i].type === 'participant:rtp') {
          // provider consumer. disable chat and file share
          isConsumerInSession = true;
          consumerType = 'provider';
          disable_chat_buttons();
          document.getElementById('fileInput').disabled = true;
          document.getElementById('sendFileButton').removeAttribute('class');
          document.getElementById('sendFileButton').disabled = true;
          document.getElementById('sendFileButton').removeAttribute('style');
        }
      }

      if (!isConsumerInSession && isMonitoring) {
        // catch provider hangups
        setTimeout(() => {
          stopMonitoringCall();
        }, 500);
      }

      if (acekurento.activeAgentList.length === participants.length) {
        allAgentCall = true;
        beingMonitored = false;
        // disable chat, file share, and screenshare buttons
        disable_chat_buttons();
        document.getElementById('fileInput').disabled = true;
        document.getElementById('sendFileButton').removeAttribute('class');
        document.getElementById('sendFileButton').disabled = true;
        document.getElementById('sendFileButton').removeAttribute('style');
        document.getElementById('screenShareButton').removeAttribute('class');
        document.getElementById('screenShareButton').disabled = true;
        document.getElementById('screenShareButton').removeAttribute('style');
        $('#end-call').attr('onclick', 'terminate_call()');
      } else {
        allAgentCall = false;
      }
      if (isMonitoring) {
        disable_chat_buttons();
        document.getElementById('fileInput').disabled = true;
        document.getElementById('sendFileButton').removeAttribute('class');
        document.getElementById('sendFileButton').disabled = true;
        document.getElementById('sendFileButton').removeAttribute('style');
        document.getElementById('screenShareButton').removeAttribute('class');
        document.getElementById('screenShareButton').disabled = true;
        document.getElementById('screenShareButton').removeAttribute('style');
        $('#end-call').attr('onclick', 'stopMonitoringCall(' + extensionBeingMonitored + ')');
      } else if(activeParticipantCount > 2) {
        if (!isMultipartyCall && !monitorCaptions) {
          // new multiparty call
          multipartyCaptionsStart();
          monitorCaptions = true;
        }
        isMultipartyCall = true;

        // the last agent to join will be the backup host
        backupHostAgent = activeParticipants[activeParticipants.length - 1].ext;
        $('#end-call').attr('onclick', 'multipartyHangup()');

        if (activeParticipantCount > 3) {
          // set the transition agent
          for (var i = 0; i < activeParticipants.length; i++) {
            if (activeParticipants[i].ext !== hostAgent && activeParticipants[i].ext !== backupHostAgent && activeParticipants[i].isAgent) {
              transitionExt = activeParticipants[i].ext;
            }
          }
        
        }
        if (activeParticipantCount === 3 && backupHostAgent === transitionExt) {
          // this should only happen after the host leaves a four person call
          transitionAgent = null;
          transitionExt = null;
        } else if (activeParticipantCount === 3 && transitionExt && !isMultipartyTransfer) {
          // transition agent left the call
          transitionAgent = null;
          transitionExt = null;
        }
      } else if (activeParticipantCount === 2) {
        isMultipartyCall = false;
        multipartyCaptionsEnd();

        if (allAgentCall) {
          $('#end-call').attr('onclick', 'terminate_call()');
          if (beingMonitored) {
            socket.emit('force-monitor-leave', { monitorExt: monitorExt, reinvite: false });
            beingMonitored = false;
            acekurento.isMonitoring = false;
          }
        } else {
          // one to one call with consumer
          hostAgent = extensionMe;
          backupHostAgent = null; // remove backup host if it existed
          if (beingMonitored) {
            $('#end-call').attr('onclick', 'monitorHangup()');
          } else {
            $('#end-call').attr('onclick', 'terminate_call()');
          }
        }
        multipartyTransition = false;
      }
    },
    registerResponse: function (error) {
      console.log('--- WV: Register response:', error || 'Success ---');
      if (!error) {
      }
    },
    pausedQueue: function (e) {
      console.log('--- WV: Paused Agent Member in Queue ---\n');
    },
    unpausedQueue: function (e) {
      console.log('--- WV: Unpaused Agent Member in Queue ---\n');
    },
    callResponse: function (e) {
      console.log('--- WV: Call response ---\n', e);
      console.log('True for callResponse ' + e.stream);
    },
    incomingCall: function (call) {
      console.log('--- WV: Incoming call ---\n');

      incomingCall = call;
      direction = 'incoming';
      // accept_call()
      console.log('Agent status is ' + $('#user-status').text());
      // if(agentStatus.toString() === 'READY' || agentStatus.toString() === 'INCOMING_CALL'){
      console.log($('#user-status').text() === 'Ready');
      console.log($('#user-status').text() === 'Incoming Call');
      console.log('Is multiparty ' + acekurento.isMultiparty);
      /* if(acekurento.isMultiparty){
        $('#myRingingModal').addClass('fade');
        changeStatusLight('INCOMING_CALL');
        changeStatusIcon(incoming_call_color, 'incoming-call', incoming_call_blinking);
        $('#user-status').text('Incoming Call');
        $('#myRingingModalPhoneNumber').html('Incoming Third Party Invite');
        $('#myRingingModal').modal({
          show: true,
          backdrop: 'static',
          keyboard: false
        });
      } */
    },
    progress: function (e) {
      console.log('--- WV: Calling... ---\n');
    },
    startedRecording: function (e) {
      console.log('--- WV: Started Recording:', (e.success) ? 'Success ---' : 'Error ---');
      if (e.success) {
      }
    },
    stoppedRecording: function (e) {
      console.log('--- WV: Stopped Recording:', (e.success) ? 'Success ---' : 'Error ---');
      if (e.success) {
      }
    },
    failed: function (e) {
      console.log('--- WV: Failed ---\n' + e);
    },
    restartCallResponse: function (e) {
      console.log('--- WV: restartCallResponse ---\n' + JSON.stringify(e));
      if (selfStream.srcObject) {
        selfStream.srcObject.getVideoTracks()[0].onended = function () {
          if (beingMonitored) {
            // force monitor to leave the session first
            if (!acekurento.isMultiparty) {
              multipartyCaptionsEnd();
            }
            socket.emit('force-monitor-leave', { 'monitorExt': monitorExt, 'reinvite': true });

            setTimeout(() => {
              screenShareEnabled = false;
              acekurento.screenshare(false);
            }, 500);
          } else {
            screenShareEnabled = false;
            acekurento.screenshare(false);
          }
        };
      }
      if (remoteStream.srcObject) {
        remoteStream.srcObject.getVideoTracks()[0].onended = function () {
          screenShareEnabled = false;
        };
      }

      if (beingMonitored) {
        // bring the monitor back to the session
        socket.emit('reinvite-monitor', { monitorExt: monitorExt });
      }
    },
    ended: function (e) {
      screenShareEnabled = false;
      if (multipartyTransition) {
        terminate_call();
        unpauseQueues();
      } else if (monitorTransition) {
        terminate_call();
        monitorTransition = false;
      } else if (isMultipartyTransfer) {
        // do nothing
      } else {
        if (acekurento.isMultiparty === false) {
          // Wont enter wrap up
        }
        console.log('--- WV: Call ended ---\n');
        terminate_call();
        if (isMonitoring) {
          // dont add to call history
          isMonitoring = false;
        } else {
          duration = $('#duration').html();
          var currentTime = new Date();
          callDate = (currentTime.getHours() + ':'
            + (currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes()) + ' '
            + (currentTime.getMonth() + 1) + '/'
            + (currentTime.getDate()) + '/'
            + (currentTime.getFullYear()));
          socket.emit('callHistory', {
            callerName: callerName,
            callerNumber: callerNumber,
            direction: direction,
            duration: duration,
            endpoint: endpoint,
            callDate: callDate
          });
          loadCallHistory();
        }
        console.log('REASON: ' + e.reason);
        clearScreen();
        if (e.reason !== undefined && e.reason.includes('failed')) {
          // show modal saying why call failed
          // reason seems to be undefined when agent hangs up or consumer declines call
          $('#outboundFailedBody').html(e.reason);
          $('#modalOutboundFailed').modal({
            backdrop: 'static',
            keyboard: false,
          });

        }
        /* for(var i = 0; i < acekurento.activeAgentList.length; i++){
          if(acekurento.activeAgentList[i].ext == extensionMe){
            console.log('Found extension');
          }
        } */
        $('#duration').timer('pause');
        $('#user-status').text('Wrap Up');
        $('#complaintsInCall').hide();
        $('#geninfoInCall').hide();
        socket.emit('wrapup', null);
        changeStatusIcon(wrap_up_color, 'wrap-up', wrap_up_blinking);
        changeStatusLight('WRAP_UP');

        if (showTransferModal) {
          $('#modalWrapupTransfer').modal('show');
          $('#modalWrapupTransfer').modal({
            backdrop: 'static',
            keyboard: false
          });
          showTransferModal = false;
        } else {
          $('#modalWrapup').modal('show');
          $('#modalWrapup').modal({
            backdrop: 'static',
            keyboard: false
          });
        }

        if (document.getElementById('persistCameraCheck').checked === true) {
          enable_persist_view();
        }

        // reset monitor variables
        monitorExt = null;
        beingMonitored = false;
        if (acekurento) {
          acekurento.isMonitoring = false;
        }
        $('#hide-video').show();
        $('#mute-audio').show();
      }
    },
    inviteResponse: function (e) {
      console.log('--- WV: inviteResponse ---\n' + JSON.stringify(e));
      if ((e.success && beingMonitored && e.ext !== monitorExt && !reinviteMonitorMultipartyTransition) || (reinviteMonitorMultipartyInvite && e.ext !== monitorExt)){
        // reinvite the monitor back after the new agent joins
        setTimeout(() => {
          socket.emit('reinvite-monitor', { monitorExt: monitorExt });
          reinviteMonitorMultipartyInvite = false;
        }, 1000);
      } else if (e.ext === monitorExt && reinviteMonitorMultipartyTransition) {
        reinviteMonitorMultipartyTransition = false;
      }
    }
  };

  acekurento.eventHandlers = Object.assign(acekurento.eventHandlers, eventHandlers);
  acekurento.ua.onopen = function () { acekurento.register(extensionMe + '', extensionMePassword, true); };
}

$('#modalOutboundFailed').on('hidden.bs.modal', function () {
  console.log('wrapping up...');
  $('#duration').timer('pause');
  $('#user-status').text('Wrap Up');
  $('#complaintsInCall').hide();
  $('#geninfoInCall').hide();
  socket.emit('wrapup', null);
  changeStatusIcon(wrap_up_color, 'wrap-up', wrap_up_blinking);
  changeStatusLight('WRAP_UP');
  $('#modalWrapup').modal({
    backdrop: 'static',
    keyboard: false
  });
});
function callTimedOut() {
  console.log('*** ACE Direct TIME OUT (' + outVidTimeout + ' seconds) waiting for videomail server response ***');
  terminate_call();
  clearScreen();
  $('#outboundFailedBody').html('Could not leave videomail. Please try again later.');
  $('#modalOutboundFailed').modal({
    backdrop: 'static',
    keyboard: false
  });
}

// makes a call
// @param other_sip_uri: is the sip uri of the person to call
function start_call(other_sip_uri) {
  outbound_timer = setTimeout(callTimedOut, outVidTimeout); //config var
  exitVideomail();
  // Used for call history
  callerNumber = other_sip_uri;
  disable_persist_view();
  $('#sidebar-dialpad').off('click');
  $('#sidebar-callHistory').off('click');
  document.getElementById('sidebar-dialpad').removeAttribute('onclick');
  document.getElementById('sidebar-callHistory').removeAttribute('onclick');
  document.getElementById('status-dropdown-button').disabled = true;
  document.getElementById('persistCameraCheck').disabled = true;
  document.getElementById('muteAudio').disabled = true;
  var options = {
    mediaConstraints: {
      audio: true,
      video: true
    },
    pcConfig: {
      rtcpMuxPolicy: 'negotiate',
      iceServers: [{
        urls: [
          pc_config.getAttribute('name')
        ]
      }]
    }
  };

  selfStream.removeAttribute('hidden');
  toggle_incall_buttons(true);
  start_self_video();
  $('#start-call-buttons').hide();
  acekurento.call(other_sip_uri, false);

  $('#remoteView')[0].onplay = function () {
    $('#modalOutboundCall').modal('hide');
    console.log('ANSWER -- Option 1: add onplay event to the remoteVideo after acekurento.call. Good: fires after video stream starts. Bad: in the case of 1 way video this may not fire.');
    clearTimeout(outbound_timer);
    if (document.getElementById('muteAudio').checked === true) {
      mute_audio();
    }
    $('#outboundCallAlert').hide();
    if (!captionsMuted()) {
      show_captions();
    }
    setTimeout(() => {
      calibrateVideo(2000);
    }, 1000);
  };
}

function toggleSelfview(duration) {
  return;
  console.log('TOGGLE START')
  hide_video();
  setTimeout( function () {
    unhide_video();
    console.log('TOGGLE END');
  }, duration);
}

var calibrating = false;
function calibrateVideo(duration) {
  return //disable calibrate video
  console.log('Calibrate Video');
  let mediaStream = acekurento.mediaStream();

  if (!calibrating && mediaStream.getVideoTracks()[0] && mediaStream.getVideoTracks()[0].enabled) {
    start_video_calibration();
    calibrating = true;
    setTimeout(function () {
      calibrating = false;
      end_video_calibration();
    }, duration);
  }
}

// answers an incoming call
function accept_call() {
  if (!captionsMuted()) {
    show_captions();
  }

  stopVideomail();
  disable_persist_view();
  document.getElementById('sidebar-dialpad').removeAttribute('onclick');
  // document.getElementById('sidebar-callHistory').removeAttribute('onclick');
  document.getElementById('status-dropdown-button').disabled = true;
  document.getElementById('persistCameraCheck').disabled = true;
  document.getElementById('muteAudio').disabled = true;
  // document.getElementById('language-select').disabled = true;
  if ($('#language-select') && $('#language-select').data('dd')) {
    $('#language-select').data('dd').set('disabled', true); // Disable the msdropdown
  }
  if (!isMonitoring) {
    // Enable in call buttons
    document.getElementById('fileInput').disabled = false;
    document.getElementById('sendFileButton').className = 'demo-btn';
    document.getElementById('sendFileButton').disabled = false;
    document.getElementById('sendFileButton').style = 'cursor: pointer';
    document.getElementById('screenShareButton').className = 'demo-btn';
    document.getElementById('screenShareButton').disabled = false;
    document.getElementById('screenShareButton').style = 'cursor: pointer';
  }
  if (incomingCall) {
    console.log('Accepting a call');
    selfStream.removeAttribute('hidden');
    // Test to assign remoteView
    // remoteView.srcObject = pc.getRemoteStreams()[0];
    toggle_incall_buttons(true);
    start_self_video();
    if (isMonitoring) {
      incomingCall.monitor();
    } else {
      incomingCall.accept();
    }
    $('#start-call-buttons').hide();
    $('#outboundCallAlert').hide();// Does Not Exist - ybao: recover this to remove the Calling screen
    setTimeout(() => {
      if (document.getElementById('muteAudio').checked === true) {
        mute_audio();
      }

      if (transitionAgent && transitionAgent !== extensionMe) {
        // invite the transition agent back to the call
        multipartyinvite(transitionAgent);
      }

      if (isTransfer) {
        socket.emit('joiningTransfer', { extension : extensionMe, originalExt: originalExt });
        isTransfer = false;
        originalExt = null;
        transferExt = null;
        transferAccepted = true;
        isBlindTransfer = null;
      }

      if (beingMonitored) {
        reinviteMonitorMultipartyTransition = true;
        setTimeout(() => {
          socket.emit('reinvite-monitor', { monitorExt: monitorExt });
        }, 1000);
      }
      try {
        calibrateVideo(2000);
      } catch(e) {

      }

      $('#multipartyTransitionModal').modal('hide');
    }, 1000);

    if (isMonitoring) {
      $('#selfView').hide();
      $('#end-call').attr('onclick', 'stopMonitoring(' + extensionBeingMonitored + ')');
      // not needed because monitor has no audio or video 
      $('#hide-video').hide();
      $('#mute-audio').hide();
        } else {
      $('#end-call').attr('onclick', 'terminate_call()');
    }
  }

  multipartyTransition = false;
  isMultipartyTransfer = false;
  autoAnswer = false;
}

// Functions for enabling and disabling persist view
function enable_persist_view() {
  document.getElementById('persistCameraCheck').disabled = false;
  document.getElementById('muteAudio').disabled = false;
  document.getElementById('persistView').hidden = false;
  document.getElementById('selfView').hidden = true;
  document.getElementById('remoteView').hidden = true;
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  }).then(function (stream) {
    if ('srcObject' in persistStream) {
      persistStream.srcObject = stream;
    } else {
      persistStream.src = window.URL.createObjectURL(stream);
    }
    persistStream.onloadedmetadata = function (e) {
      persistStream.play();
      mirrorMode('persistView', true);
    };

  }).catch(function (err) {
    console.log(err.name + ': ' + err.message);
  });
}

function disable_persist_view() {
  document.getElementById('persistView').hidden = true;
  document.getElementById('selfView').hidden = false;
  document.getElementById('remoteView').hidden = false;
  persistStream.pause();
  persistStream.src = '';

  if (persistStream.srcObject) {
    if (persistStream.srcObject.getTracks()) {
      if (persistStream.srcObject.getTracks()[0]) persistStream.srcObject.getTracks()[0].stop();
      if (persistStream.srcObject.getTracks()[1]) persistStream.srcObject.getTracks()[1].stop();
    }
  }

  removeElement('selfView');
  removeElement('remoteView');
  addElement('agent-webcam', 'video', 'remoteView');
  remoteView.setAttribute('autoplay', 'autoplay');
  remoteView.setAttribute('poster', 'images/acedirect-logo-trim.png');
  addElement('agent-webcam', 'video', 'selfView');
  selfView.setAttribute('style', 'right: 11px');
  selfView.setAttribute('autoplay', 'autoplay');
  selfView.setAttribute('muted', true);
  selfView.setAttribute('hidden', true);
  selfView.muted = true;
  remoteStream = document.getElementById('remoteView');
  selfStream = document.getElementById('selfView');

  if (acekurento !== null) {
    acekurento.remoteStream = document.getElementById('remoteView');
    acekurento.selfStream = document.getElementById('selfView');
  }

  toggle_incall_buttons(false);
}

// starts the local streaming video. Works with some older browsers, 
// if it is incompatible it logs an error message, 
// and the selfStream html box stays hidden
function start_self_video() {
  if (isMonitoring) {
    // dont start self video
    return;
  }
  // if (selfStream.hasAttribute('hidden')) //then the video wasn't already started
  // {
  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia = navigator.msGetUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }

  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  })
    //navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    .then(function (stream) {
      selfStream.removeAttribute('hidden');
      // Older browsers may not have srcObject
      if ('srcObject' in selfStream) {
        selfStream.srcObject = stream;

      } else {
        // Avoid using this in new browsers, as it is going away.
        selfStream.src = window.URL.createObjectURL(stream);
      }


      selfStream.classList.add('mirror-mode');
      // Seems to cause error for getTracks
      // backup the camera video stream
      /* var senders = currentSession.connection.getSenders();
      var tracks = stream.getTracks();
      var videoTrack = stream.getVideoTracks()[0];
      var audioTrack = stream.getAudioTracks()[0]; */

      backupStream = stream;

      window.self_stream = stream;
      selfStream.onloadedmetadata = function (e) {
        selfStream.play();
      };
    })
    .catch(function (err) {
      console.log(err.name + ': ' + err.message);
    });
  //}
}

// toggles showing the call option buttons at the bottom of the video window (ie end call, mute, etc).
// The buttons themselves are in acedirect and the complaint_form, this simply un-hides them
// @param make_visible: boolean whether or not to show the call option buttons
function toggle_incall_buttons(make_visible) {
  if (make_visible) call_option_buttons.style.display = 'block';
  else call_option_buttons.style.display = 'none';
}

function terminate_call() {
  console.log('Recording is ' + recording);
  if (recording === true) {
    acekurento.stopRecording();
    $('#recordIcon').attr('class', 'fa fa-circle text-red');
    recording = false;
  }
  clearTimeout(outbound_timer);
  $('#outboundCallAlert').hide();
  mute_audio_button.setAttribute('onclick', 'javascript: mute_audio();');
  mute_audio_icon.classList.add('fa-microphone');
  mute_audio_icon.classList.remove('fa-microphone-slash');
  if (false && !acekurento.isMultiparty) { // placeholder for transfer hangups.
    acekurento.callTransfer('hangup', true);
  }
  acekurento.stop(false);
  remove_video();
  // mute_captions();
  hide_captions();
  disable_chat_buttons();
  enable_initial_buttons();
  multipartyCaptionsEnd();
  $('#start-call-buttons').show();
  exitFullscreen();
  $('#sidebar-dialpad').on('click', showDialpad);
  $('#sidebar-callHistory').on('click', showCallHistory);
  document.getElementById('status-dropdown-button').disabled = false;
  $('#dtmfpad').hide();
  // RemoteView is not currently set to value so line gives an error
  // remoteView.srcObject.getTracks().forEach(track => track.stop());
  /* if (document.getElementById('persistCameraCheck').checked == true) {
    // this causes the webcam to stay active when the agent disables self-view after a call
    enable_persist_view();
  } */
  document.getElementById('muteAudio').disabled = false;
  // document.getElementById('language-select').disabled = false;
  if ($('#language-select') && $('#language-select').data('dd')) {
    $('#language-select').data('dd').set('disabled', false); // Enable the msdropdown
  }
  document.getElementById('persistCameraCheck').disabled = false;
  $('#screenshareButtons').hide();
  // Disable in call buttons
  document.getElementById('fileInput').disabled = true;
  document.getElementById('sendFileButton').removeAttribute('class');
  document.getElementById('sendFileButton').disabled = true;
  document.getElementById('sendFileButton').removeAttribute('style');
  document.getElementById('screenShareButton').removeAttribute('class');
  document.getElementById('screenShareButton').disabled = true;
  document.getElementById('screenShareButton').removeAttribute('style');

  if ($('#callerPhone').val()) {
    socket.emit('call-ended', { agentExt: extensionMe });
    socket.emit('chat-leave-ack', { vrs: $('#callerPhone').val() });
  }

  originalExt = null;
  transferExt = null;
  transferVRS = null;
  transferAccepted = false;
  isBlindTransfer = false;

  hostAgent = null;
  allAgentCall = false;
  isMultipartyCall = false;

  activeParticipantCount = 0;
}

function unregister_jssip() {
  terminate_call();
  localStorage.clear();
  sessionStorage.clear();
}

// removes both the remote and self video streams and replaces it with default image. 
// stops allowing camera to be active. also hides call_options_buttons.
function remove_video() {
  selfStream.setAttribute('hidden', true);
  selfStream.pause();
  remoteStream.pause();
  selfStream.src = '';
  remoteView.src = '';

  console.log('Disabling video privacy button');
  hide_video_button.setAttribute('onclick', 'javascript: enable_video_privacy();');
  hide_video_icon.style.display = 'none';

  // stops remote track
  if (remoteView.srcObject) {
    if (remoteView.srcObject.getTracks()) {
      if (remoteView.srcObject.getTracks()[0]) remoteView.srcObject.getTracks()[0].stop();
      if (remoteView.srcObject.getTracks()[1]) remoteView.srcObject.getTracks()[1].stop();
    }
  }

  // stops the camera from being active
  if (window.self_stream) {
    if (window.self_stream.getVideoTracks()) {
      if (window.self_stream.getVideoTracks()[0]) {
        window.self_stream.getVideoTracks()[0].stop();
      }
    }
    if (window.self_stream.getAudioTracks()) {
      if (window.self_stream.getAudioTracks()[0]) {
        window.self_stream.getAudioTracks()[0].stop();
      }
    }
  }
  removeElement('selfView');
  removeElement('remoteView');
  addElement('agent-webcam', 'video', 'remoteView');
  remoteView.setAttribute('autoplay', 'autoplay');
  remoteView.setAttribute('poster', 'images/acedirect-logo-trim.png');
  addElement('agent-webcam', 'video', 'selfView');
  selfView.setAttribute('style', 'right: 11px');
  selfView.setAttribute('autoplay', 'autoplay');
  selfView.setAttribute('muted', true);
  selfView.setAttribute('hidden', true);
  selfView.muted = true;
  remoteStream = document.getElementById('remoteView');
  selfStream = document.getElementById('selfView');

  toggle_incall_buttons(false);
  if (acekurento !== null) {
    acekurento.remoteStream = document.getElementById('remoteView');
    acekurento.selfStream = document.getElementById('selfView');
  }
}

// swaps remote and local videos for videomail recording
// puts user's own video in the big video
function swap_video() {
  // local becomes remote and remote becomes local
  $('#remoteView').attr('id', 'tempView');
  $('#selfView').attr('id', 'remoteView');
  $('#tempView').attr('id', 'selfView');

  $('#selfView').attr('width', 0);
  $('#selfView').attr('height', 0);
  $('#selfView').attr('muted', true);
  $('#selfView').attr('hidden', true);
}

// Adds an element to the document
function addElement(parentId, elementTag, elementId, html) {
  var p = document.getElementById(parentId);
  var newElement = document.createElement(elementTag);
  newElement.setAttribute('id', elementId);
  newElement.setAttribute('class', elementId);
  newElement.innerHTML = html;
  p.appendChild(newElement);
}

// Removes an element from the document
function removeElement(elementId) {
  var element = document.getElementById(elementId);
  element.parentNode.removeChild(element);
}

// mutes self audio so remote cannot hear you
function mute_audio() {
  if (acekurento !== null) {
    try {
      console.log('MUTING AUDIO');
      let a = acekurento.mediaStream();
      console.log(a.getAudioTracks()[0].enabled);
      acekurento.enableDisableTrack(false, true); // mute audio
      mute_audio_button.setAttribute('onclick', 'javascript: unmute_audio();');
      mute_audio_icon.classList.add('fa-microphone-slash');
      mute_audio_icon.classList.remove('fa-microphone');
      isMuted = true;
    } catch {
      console.log('Mute broken trying again');
      setTimeout(function() {mute_audio();},1000);
    }
  }
}

// unmutes self audio so remote can hear you
function unmute_audio() {
  if (acekurento !== null) {
    console.log('UNMUTING AUDIO');
    acekurento.enableDisableTrack(true, true); // unmute audio
    mute_audio_button.setAttribute('onclick', 'javascript: mute_audio();');
    mute_audio_icon.classList.add('fa-microphone');
    mute_audio_icon.classList.remove('fa-microphone-slash');
    isMuted = false;
  }
}

function show_captions() {
  $('#agent-webcam').css('height', '70%');
  $('#agent-captions').show();
  $('#agent-divider').show();
}

function hide_captions() {
  $('#agent-webcam').css('height', '100%');
  $('#agent-captions').hide();
  $('#agent-divider').hide();
}

function captionsMuted() {
  return mute_captions_off_icon.style.display === 'block';
}

function toggle_captions() {
  if (!captionsMuted()) {
    mute_captions_off_icon.style.display = 'block';
    transcript_overlay.style.display = 'none';
    hide_captions();
  } else {
    mute_captions_off_icon.style.display = 'none';
    transcript_overlay.style.display = 'block';
    show_captions();
  }
}

// hides self video so remote cannot see you
function hide_video() {
  if (acekurento !== null) {
    acekurento.enableDisableTrack(false, false); // mute video
    console.log('Hide video reached');
    selfStream.setAttribute('hidden', true);
  }
}

// unhides self video so remote can see you
function unhide_video() {
  if (acekurento !== null) {
    acekurento.enableDisableTrack(true, false); // unmute video
    console.log('Unhide video reached');
    selfStream.removeAttribute('hidden');
  }
}
function generateKeyframe(){
  acekurento.generateKeyframe()
}
function enable_video_privacy() {
  if (acekurento !== null) {
    if (isMonitorInSession) {
      if(!acekurento.isMultiparty) {
        multipartyCaptionsEnd();
      }
      socket.emit('force-monitor-leave', { monitorExt: monitorExt, reinvite: true });
      setTimeout(() => {
        console.log('Enabling video privacy with monitor in session');
        acekurento.enableDisableTrack(false, false); //mute video
        hide_video_icon.style.display = 'block';
        hide_video_button.setAttribute('onclick', 'javascript: disable_video_privacy();');
        acekurento.privateMode(true, privacy_video_url);
        socket.emit('reinvite-monitor', { monitorExt: monitorExt });
      }, 500);
    } else {
      console.log('Enabling video privacy');
      acekurento.enableDisableTrack(false, false); //mute video
      hide_video_icon.style.display = 'block';
      hide_video_button.setAttribute('onclick', 'javascript: disable_video_privacy();');
      acekurento.privateMode(true, privacy_video_url);
    }
  }
}

function disable_video_privacy() {
  if (acekurento !== null) {
    if (isMonitorInSession) {
      if(!acekurento.isMultiparty) {
        multipartyCaptionsEnd();
      }
      socket.emit('force-monitor-leave', { monitorExt: monitorExt, reinvite: true });
      setTimeout(() => {
        console.log('Disabling video privacy with monitor in session');
        mirrorMode('selfView', true);
        acekurento.enableDisableTrack(true, false); // unmute video
        hide_video_icon.style.display = 'none';
        hide_video_button.setAttribute('onclick', 'javascript: enable_video_privacy();');
        acekurento.privateMode(false);
        socket.emit('reinvite-monitor', { monitorExt: monitorExt });
      }, 500);
    } else {
      console.log('Disabling video privacy');
      mirrorMode('selfView', true);
      acekurento.enableDisableTrack(true, false); // unmute video
      hide_video_icon.style.display = 'none';
      hide_video_button.setAttribute('onclick', 'javascript: enable_video_privacy();');
      acekurento.privateMode(false);
    }
  }
}


function start_video_calibration() {
  if (acekurento !== null) {
    console.log('Start video calibration');
    acekurento.enableDisableTrack(false, false); // mute video
    acekurento.privateMode(true, calibrate_video_url);
  }
}

function end_video_calibration() {
  if (acekurento !== null) {
    console.log('End video calibration');
    mirrorMode('selfView', true);
    acekurento.enableDisableTrack(true, false); // unmute video
    acekurento.privateMode(false);
  }
}

// times out and ends call after 30 or so seconds. agent gets event 'ended' with cause 'RTP Timeout'.
// puts session on hold
function hold() {
  if (currentSession) {
    var options = {
      'useUpdate': true
    };
    currentSession.hold(options);
    hold_button.setAttribute('onclick', 'javascript: unhold();');
    hold_button.innerHTML = 'Unhold';
  }
}

// resumes session
function unhold() {
  if (currentSession) {
    currentSession.unhold();
    hold_button.setAttribute('onclick', 'javascript: hold();');
    hold_button.innerHTML = 'Hold';
  }
}

// this function may or may not solve our H264 codec issue. Calls to this function are currently commented out as it seems to not be helping.
// Edits the request to remove H264 modes other than 97, and adds H264 mode 97
// @ param request is the request message to edit
// @ return request_lines.join(' ') the edited request
function edit_request(request) {
  console.log('EDITING REQUEST');
  var video_section = false; // if we've reached the 'm=video' section. Don't want to add H264 to the audio section
  var added_new_codec = false; // if we've added the new codec. If we reach the end and havent added it, we append it to the end of the file (possibly in the wrong order)

  if (request !== undefined) {
    var request_lines = request.split('\n');
    for (var i = 0; i < request_lines.length; i++) {
      if (request_lines[i].includes('m=video')) {
        request_lines[i] = request_lines[i].replace(' 126', ''); // getting rid of other h264
        request_lines[i] = request_lines[i].replace(' 99', ''); // getting rid of other h264
        request_lines[i] = request_lines[i].replace(' 97', ''); // getting rid of 97 so we don't have it twice
        request_lines[i] = request_lines[i] + ' 97'; // adding h264 97
        video_section = true;
      }

      // getting rid of h264
      if (request_lines[i].includes('H264/90000')) {
        request_lines.splice(i, 1);
        i--; // preventing wrong index because line was deleted
      }
      if ((request_lines[i].includes('a=rtcp-fb:99')) || (request_lines[i].includes('a=rtcp-fb:126')) || (request_lines[i].includes('a=rtcp-fb:97'))) {
        request_lines.splice(i, 1);
        i--;
      }
      if ((request_lines[i].includes('a=fmtp:99')) || (request_lines[i].includes('a=fmtp:126')) || (request_lines[i].includes('a=fmtp:97'))) {
        request_lines.splice(i, 1);
        i--;
      }

      // adding h264 97
      if (video_section) {
        // we want to add the lines in the correct order. 'a=fmtp' lines should be added where all the other 'a=fmtp' lines are
        if (request_lines[i].includes('a=fmtp')) {
          // we want to add the new line at the end of all the 'a=fmtp' lines
          if (request_lines[i + 1].includes('a=fmtp') == false) {
            request_lines[i] = request_lines[i] + '\na=fmtp:97 profile-level-id=42e01f;level-asymmetry-allowed=1';
            added_new_codec = true;
          }
        }
        if (request_lines[i].includes('a=rtcp')) {
          if (request_lines[i + 1].includes('a=rtcp') == false) {
            request_lines[i] = request_lines[i] + '\na=rtcp-fb:97 nack\na=rtcp-fb:97 nack pli\na=rtcp-fb:97 ccm fir\na=rtcp-fb:97 goog-remb';
            added_new_codec = true;
          }
        }
        if (request_lines[i].includes('a=rtpmap')) {
          if (request_lines[i + 1].includes('a=rtpmap') === false) {
            request_lines[i] = request_lines[i] + '\na=rtpmap:97 H264/90000';
            added_new_codec = true;
          }
        }
      }
    }
    var new_request = request_lines.join('\n');
    if (!added_new_codec) {
      new_request = new_request + 'a=fmtp:97 profile-level-id=42e01f;level-asymmetry-allowed=1\na=rtcp-fb:97 nack\na=rtcp-fb:97 nack pli\na=rtcp-fb:97 ccm fir\na=rtcp-fb:97 goog-remb\na=rtpmap:97 H264/90000';
    }
  } else {
    var new_request = request;
  }

  return new_request;
}

//
// This function is added to address the issue that Chrome 66, 67 cannot handle incoming SDP without packetization-mode
// or with packetization-mode=0. When this issue happens, Chrome fails peerConnection.SetLocalDescription() call, which
// further causes JSSIP 500 Internal Error towards incoming request.
//
// This bug affects ZVRS Z20 (no packetization-mode) and ZVRS i3 (packetization-mode=0), along with Global Android device
//
// The fix: adding or replacing the packetization-mode so that the incoming SDP always contains packetization-mode=1.
//
//
//
function edit_request_with_packetizationmode(request) {
  console.log('EDITING REQUEST with packetization-mode=1');

  if (request !== undefined) {
    var request_lines = request.split('\n');
    for (var i = 0; i < request_lines.length; i++) {
      if (request_lines[i].includes('profile-level-id')) {
        if (!request_lines[i].includes('packetization-mode')) { // add if does not include - Z20
          request_lines[i] = request_lines[i] + ';packetization-mode=1';
          console.log('ADD incoming SDP with packetization-mode=1');
        }

        if (request_lines[i].includes('packetization-mode=0')) { // change it to packetiation-mode 1
          request_lines[i].replace('packetization-mode=0', 'packetization-mode=1');
          console.log('REPALCE with packetization-mode=1');
        }
      }

    }
    var new_request = request_lines.join('\n');
  } else {
    var new_request = request;
  }

  return new_request;
}

// Used to exit fullscreen if active when call is teminated
function exitFullscreen() {
  if (document.fullscreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

// New 4.0 feature functions
function shareScreen() {
  if (agentStatus === 'IN_CALL' && !isMonitoring) {
    if (beingMonitored) {
      // kick the monitor from the session before screensharing
      if(!acekurento.isMultiparty) {
        multipartyCaptionsEnd();
      }
      socket.emit('force-monitor-leave', {'monitorExt': monitorExt, 'reinvite':true});
    }
    if (screenShareEnabled == true) {
      if (acekurento !== null) {
        acekurento.remoteStream = document.getElementById('remoteView');
        acekurento.selfStream = document.getElementById('selfView');
      }
    }
    acekurento.screenshare(true);
    screenShareEnabled = true;
  }
}

// Scripts for capturing chrome screenshare button has been clicked.
// this.getUserMedia.addEventListener('ended', () => console.log('screenshare has ended'));
/*if(acekurento != null){
  acekurento.remoteStream.srcObject.getVideoTracks()[0].addEventListener('ended', () => console.log('Third party call has ended'));
}*/
if (selfStream.srcObject) {
  selfStream.srcObject.getVideoTracks()[0].addEventListener('ended', () => console.log('screensharing has ended'));
}
if (remoteStream.srcObject) {
  remoteStream.srcObject.getVideoTracks()[0].addEventListener('ended', () => console.log('screensharing has ended'));
}

function monitorHangup() {
  if (beingMonitored) {
    // kick the monitor from the session first
    socket.emit('force-monitor-leave', {'monitorExt': monitorExt, 'reinvite': false});
    monitorExt = null;
    beingMonitored = false;
    acekurento.isMonitoring = false;
  }
  setTimeout(() => {
    terminate_call();
  }, 500);
}

function multipartyinvite(extension) {
  if (isMonitorInSession) { 
    reinviteMonitorMultipartyInvite = true;
    if(!acekurento.isMultiparty) {
      multipartyCaptionsEnd();
    }
    socket.emit('force-monitor-leave', { monitorExt: monitorExt, reinvite: true });

    setTimeout(() => {
      acekurento.invitePeer(extension.toString(), false);
      socket.emit('multiparty-invite', {
        extensions: extension.toString(),
        callerNumber: extensionMe,
        vrs: $('#callerPhone').val()
      });
    }, 500);
  } else {
    acekurento.invitePeer(extension.toString(), false);
    socket.emit('multiparty-invite', {
      extensions: extension.toString(),
      callerNumber: extensionMe,
      vrs: $('#callerPhone').val()
    });
  }
  /*if(agentStatus == 'IN_CALL'){
    console.log(incomingCall + ' is incomingCall');
    acekurento.invitePeer(document.getElementById('inviteExtension').value);
    socket.emit('multiparty-invite',{
      'extensions' : document.getElementById('inviteExtension').value
    })
  }*/
}

function multipartyHangup() {
  if (beingMonitored) {
    // remove the monitor
    socket.emit('force-monitor-leave', { monitorExt: monitorExt, reinvite: false});
    monitorExt = null;
    beingMonitored = false;
    acekurento.isMonitoring = false;
  } else if (isMonitorInSession && !beingMonitored) {
    // a monitor is in the session
    // but not monitoring the agent hanging up
    if (hostAgent === extensionMe) {
      if(!acekurento.isMultiparty) {
        multipartyCaptionsEnd();
      }
      socket.emit('force-monitor-leave', { monitorExt: monitorExt, reinvite: true, multipartyHangup: true, multipartyTransition: true });
    } else {
      if (!acekurento.isMultiparty) {
        multipartyCaptionsEnd();
      }
      socket.emit('force-monitor-leave', { monitorExt: monitorExt, reinvite: true, multipartyHangup: true, multipartyTransition: false });
    }
    
    monitorExt = null;
    acekurento.isMonitoring = false;
  }
  
  if (acekurento.isMultiparty && hostAgent === extensionMe) {
    // host agent is leaving call
    // refer the session to the other agent in the call
    var tempAgent = backupHostAgent;
    multipartyCaptionsEnd();

    socket.emit('multiparty-hangup', { newHost :backupHostAgent, transitionAgent: transitionExt, vrs: $('#callerPhone').val() });

    setTimeout(() => {
      acekurento.callTransfer(tempAgent.toString(), false);
      terminate_call();
      
      hostAgent = null;
      backupHostAgent = null;
      transitionAgent = null;
      transitionExt = null;
    }, 500);
  
  } else {
    // non-host leaving multiparty call
    hostAgent = null;
    backupHostAgent = null;
    transitionAgent = null;
    transitionExt = null;
    terminate_call();
  }
}

function getTransferType(ext) {
  $('#modalCallTransfer').modal({
    show: true,
    backdrop: 'static',
    keyboard: false
  });
  $('#transferExtension').val(ext);
}

/**
 * @param {boolean} isCold 
 */
function sendTransferInvite(isCold) {
  if (agentStatus === 'IN_CALL') {
    transferExt = $('#transferExtension').val();
    showAlert('info', 'Call transfer initiated. Waiting for response...');

    if (isCold) {
      isColdTransfer = true;
    } else {
      isColdTransfer = false;
    }

    socket.emit('transferCallInvite', {
      transferExt: transferExt, 
      originalExt: extensionMe, 
      vrs: $('#callerPhone').val()
    });
  }
}

function recordScreen() {
  if (recording === false) {
    console.log('Recording screen');
    acekurento.startRecording();
    showAlert('info', 'This video is now being recorded.  You can click this button again to stop the recording.');
    $('#recordIcon').attr('class', 'fa fa-circle text-green');
    recording = true;
  } else if (recording == true) {
    console.log('Stopping record');
    acekurento.stopRecording();
    showAlert('info', 'This video recording was stopped.');
    $('#recordIcon').attr('class', 'fa fa-circle text-red');
    recording = false;
  }
}

function mirrorMode(elementName, isMirror) {
  let videoElements = document.getElementsByClassName(elementName);
  for (let i = 0; i < videoElements.length; i++) {
    let v = videoElements[i];
    if (isMirror) {
      console.log('Adding Mirror Mode to ' + elementName)
      v.classList.add('mirror-mode');
    } else {
      console.log('Removing Mirror Mode from ' + elementName)
      v.classList.remove('mirror-mode');
    }
  }
}

function changeCaption(id) {
  var value = id.split('-')[1];
  var target = id.split('-')[0];

  if (target === 'bg') {
    var alpha = $('#opacity-slider-agent').val();
    if (alpha === 0) {
      alpha = 1;
      $('#opacity-slider-agent').val(1);
    }
    var color;
    switch (value) {
      case 'black':
        color = 'rgba(0,0,0,' + alpha + ')';
        break;
      case 'grey':
        color = 'rgba(128,128,128,' + alpha + ')';
        break;
      case 'white':
        color = 'rgba(255,255,255,' + alpha + ')';
        break;
    }
    document.documentElement.style.setProperty('--caption-bg-color', color);
  } else if (target ==='font') {
    document.documentElement.style.setProperty('--caption-font-color', value);
  } else {
    document.documentElement.style.setProperty('--caption-font-size', id + 'rem');
  }
}

$('#bg-transparent').click(function () {
  $('#opacity-slider-agent').val(0);
  $('#opacity-slider-agent').trigger('mousemove');
})

$('#opacity-slider-agent').on('change mousemove', function () {
  var alpha = $(this).val();
  var current = document.documentElement.style.getPropertyValue('--caption-bg-color');
  if (current == '') { current = 'rgba(128,128,128,0'; }
  var color = current.substring(0, current.lastIndexOf(',') + 1) + alpha + ')';
  document.documentElement.style.setProperty('--caption-bg-color', color);
})

var demo_running = false;
function testCaptions() {

  if (!demo_running) {
    demo_running = true;
    var temp = document.createElement('div');
    temp.classList.add('transcripttext');

    document.getElementById('transcriptoverlay').appendChild(temp);
    temp.innerHTML = 'Hi - I am having trouble with captions on my TV';

    var count = 0;
    var intervalId = window.setInterval(function () {
      switch (count) {
        case 0:
          temp.innerHTML = 'They were working fine all day yesterday, but, stopped at 4:00';
          break;
        case 1:
          temp.innerHTML = 'Do you think that will fix the problem?';
          break;
        case 2:
          temp.innerHTML = 'Looks like that did it, everything seems to be working again';
          break;
        case 3:
          temp.innerHTML = 'Thanks for the help and have a nice day';
          break;
      }
      count++;

      if (count > 4) {
        window.clearInterval(intervalId);
        temp.innerHTML = '';
        demo_running = false;
      }
    }, 6000);
  } else { console.log('demo running'); }
}


function createCaptionHtml(displayName, transcripts) {
  console.log(displayName, transcripts)
  let caption = transcripts.transcript;
  if (!transcripts.final) {
    caption += '...';
  }
  let timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  return '<span class="timestamp">' + timestamp + '</span><strong>' + displayName + ':</strong> ' + caption;
}

function updateCaptions(transcripts) {
  
  console.log('transcripts in UC are ', transcripts)
  var tDiv = document.getElementById(transcripts.msgid);
  
  if (!tDiv) {
    var temp = document.createElement('div');
    temp.id = transcripts.msgid;
    temp.innerHTML = createCaptionHtml('Consumer', transcripts); 
    
    temp.classList.add('transcripttext');
    document.getElementById('transcriptoverlay').prepend(temp);
  } else {
    tDiv.innerHTML = createCaptionHtml('Consumer', transcripts); 
    if (transcripts.final) {
      $('#caption-messages').append("<div class='agent-scripts'><div class='direct-chat-text'>" + transcripts.transcript + "</div></div>");
      $('#caption-messages').scrollTop($('#caption-messages')[0].scrollHeight);

    }
  }
}

function updateCaptionsMultiparty(transcripts) {
  var tDiv = document.getElementById(transcripts.msgid);
  if (!tDiv) { // prevents duplicate captions
    var temp = document.createElement('div');
    temp.id = transcripts.msgid;
    temp.innerHTML = createCaptionHtml(transcripts.displayname, transcripts);
    temp.classList.add('transcripttext');
    document.getElementById('transcriptoverlay').prepend(temp);
    // setTimeout(function () { temp.remove() }, 5000);
  }
}


$('#language-select').on('change', function () {
  console.log('Setting agent language', this.value, extensionMe)
  socket.emit('set-agent-language', {
    language: this.value,
    extension: extensionMe
  });
});

var recognition = null;
function multipartyCaptionsStart() {
  var language = $('#language-select').val();
  switch (language) {
    case 'en': // English US
      language = 'en-US';
      break;
    case 'es': // Spanish (Mexican)
      language = 'es-US';
      break;
    case 'ar': // Arabic (Modern Standard)
      language  = 'ar-EG';
      break;
    case 'pt': // Brazilian Portuguese
      language = 'pt-PT';
      break;
    case 'zh': // Chinese (Mandarin)
      language = 'zh';
      break;
    case 'nl': // Dutch
      language = 'nl-NL';
      break;
    case 'fr': // French
      language = 'fr-FR';
      break;
    case 'de': // German
      language = 'de-DE';
      break;
    case 'it': // Italian
      language = 'it-IT';
      break;
    case 'ja': // Japanese
      language = 'ja-JP';
      break;
    case 'ko': // Korean
      language = 'ko-KR';
      break;
    default:
      language = 'en-US';
    }
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = language;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = function (event) {
    if (!isMuted && event && event.results && (event.results.length > 0)) {
      var lastResult = event.results.length - 1;
      console.log('sending multiparty-caption-agent caption:', event.results[lastResult][0].transcript, extensionMe);
      socket.emit('multiparty-caption-agent', {
        transcript:event.results[lastResult][0].transcript,
        final: event.results[lastResult].isFinal, 
        language: language,
        displayname: $('#agentname-sidebar').html().trim(),
        extension: extensionMe,
        agent: true,
        participants: callParticipantsExt,
        hasMonitor: beingMonitored,
        monitorExt: monitorExt
      });
    }
  };

  recognition.onend = function (event) {
    if((acekurento.isMultiparty && (activeParticipantCount > 2)) || (beingMonitored && isMonitorInSession))
      multipartyCaptionsStart();	
  }
  recognition.start();
}

function multipartyCaptionsEnd() {
  if(recognition)
    recognition.abort();
  recognition = null;
  callParticipantsExt = [];
  monitorCaptions = false;
}
