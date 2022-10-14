var sTransferNumber;
var oRingTone, oRingbackTone;
var oSipStack, oSipSessionRegister, oSipSessionCall, oSipSessionTransferCall;
var videoRemote, videoLocal, audioRemote;
var bFullScreen = false;
var oNotifICall;
var bDisableVideo = false;
var viewVideoLocal, viewVideoRemote, viewLocalScreencast; // <video> (webrtc) or <div> (webrtc4all)
var oConfigCall;
var oReadyStateTimer;
var llamadaOk = {};
var timer;
var enLlamada = false;
var idPausa = "";
var marcacionManual5 = false;
var marcacionManual4 = false;
var marcacionCallback = false;
var precierre = false;
var timerFin = 0;
var timerFin_ = 0;
var entroAfinLlamada = false;

var timerTiempoEnLlamada = 0;
var contactoseleccionado = {};
const { ipcRenderer, dialog } = require('electron');

var _s1 = 0;
var _m1 = 0;

let sRemoteNumbervar = ""
var timerFinalizarLlamadaacw="0";

function mostrarTeclado() {
   
    if (!$('#contactosDiv').is(':visible')) {
        $("#teclado").addClass("d-flex")
        $("#teclado").removeClass("d-none")
        $("#contactosDiv").show()
        $("#actividadesPendientes").hide()
        $("#chats").hide()
    } else {
        $("#teclado").removeClass("d-flex")
        $("#teclado").addClass("d-none")
        $("#contactosDiv").hide()
        //$("#actividadesPendientes").show()

    }
}

function mostrarActividades() {

    if (!$('#actividadesPendientes').is(':visible')) {
        $("#actividadesPendientes").show()
        $("#teclado").removeClass("d-flex")
        $("#teclado").removeClass("d-none")
        $("#teclado").addClass("d-none")
        $("#contactosDiv").hide()
        $("#chats").hide()
    } else {
        $("#actividadesPendientes").hide()
        //$("#actividadesPendientes").show()

    }
}

function marcar(numero) {

    if (oSipSessionCall) {
        $("#numeroMarcar").val($("#numeroMarcar").val() + numero);
        $("#numeroMarcar_").val($("#numeroMarcar_").val() + numero);
        sipSendDTMF(numero)
    } else {
        $("#numeroMarcar").val($("#numeroMarcar").val() + numero);
        $("#numeroMarcar_").val($("#numeroMarcar_").val() + numero);
        try { dtmfTone.play(); } catch (e) { }
    }
}

function backspace() {
    if ($('#numeroMarcar').length) {
        $("#numeroMarcar").val($("#numeroMarcar").val().slice(0, -1))
    }
    if ($('#numeroMarcar_').length) {
        $("#numeroMarcar_").val($("#numeroMarcar_").val().slice(0, -1))
    }
    try { dtmfTone.play(); } catch (e) { }

}

function clearMarcador() {

    $("#numeroMarcar").val("")
    $("#numeroMarcar_").val("")

    try { dtmfTone.play(); } catch (e) { }
}

function hacerLlamada() {

    var marcar = {
        marcionManual: urls.marcionManual,
        agente: agenteOk.id,
        extension: areaIniciada == "IBD" ? agenteOk.extension : agenteOk.extension,
        folio: "",
        telefono: $("#numeroMarcar").val()
    };
    ipcRenderer.send('marcacionManual', marcar)

}

ipcRenderer.on('consultarFechaHoraResult', (event, datos) => {


    if(datos != "OK"){
        if (datos.horaLlam.length > 0) {
            cerrarTipificacion(datos.horaLlam[0]);
        } else {
            cerrarTipificacion(datos.hora[0]);
        }
    }else{
        llamadaOk = {};
        clienteSeleccionado = {}
    }
    oSipSessionCall = null;
    
    if (precierre) {
        ipcRenderer.send('CerrarSesion', { idAgente: usuarioOk.CNUSERID, tipoCierre: "CIERRE_SESION" })
    } else {
        if (areaIniciada == "OBD") {
            ipcRenderer.send('actulizarAgenteO', { IdAgente: usuarioOk.CNUSERID, estatus: "DISPONIBLE", areaIniciada })
        } else {
            ipcRenderer.send('actulizarAgente', { IdAgente: usuarioOk.CNUSERID, estatus: "DISPONIBLE", areaIniciada })
        }
    }
    socket.emit('cambioEnllamadaAgente', {});
});



ipcRenderer.on('marcacionManualResult', (event, datos) => {

    if (datos.valor) {
        $("#numeroMarcar").val("")
        $("#numeroMarcar_").val("")
    }
});


ipcRenderer.on('consultaridllamivrcrmResult', (event, datos) => {
    llamadaOk = datos;
    $("#btnRecuperarDatosLlamada").hide()
    if (datos.error == "NO") {
        $("#chats").hide()
        $("#displayScript").show()
        $("#displayScript").show()
        $("#displayCliente").hide()
        $("#btnRecuperarDatosLlamada").show()
        return;
    }
    $("#chats").hide()
   // llamadaOk = datos;
    var d = new Date(llamadaOk.fecha);
    llamadaOk.fechaLlamada = formatoFecha(d);
    llamadaOk.horaLlamada = formatoHora(d);
    $("#tiempoEnLlamada").html("00:00:00");
    $("#horaLlamada").html("Hora llamada: " + llamadaOk.horaLlamada);
    $("#idLlamada").html("Id de interacción: <br>" + llamadaOk.idLlamada);
    $("#idLlamada_").html("Id de interacción: <br> " + llamadaOk.idLlamada);
    $("#navegacionIvr").html(llamadaOk.rutaIVR);    
    document.getElementById("navegacionIvr").style.visibility = "hidden"; 
    if(timerTiempoEnLlamada != 0){timerTiempoEnLlamada.parar()}
    timerTiempoEnLlamada = new TimerBsw("#tiempoEnLlamada", llamadaOk.fecha, llamadaOk.fecha, 1000)
    timerTiempoEnLlamada.iniciar();
    
    if (areaIniciada == "IBD") {
        if (clienteAuto == "true") {
            abrirBuscarCliente();
            //consultarCliente("listClientes", "");
            consultarCliente('listClientes_', llamadaOk.telefonoCliente)
        }
    }
    $("#displayScript").show()
    $("#displayScript").show()
    $("#displayCliente").hide()
   
    socket.emit('cambioEnllamadaAgente', {});
    if(llamadaOk.campo01=='QUEJA'){             
        llamadaOk.telefonoCliente='anonymus';
        numeroRemoto.innerHTML = llamadaOk.telefonoCliente;  
        ipcRenderer.send('consultarTipoRespuesta', '7');
        //consultarCliente("listClientes", "USUARIO QUEJA");
         
    }
    console.log(llamadaOk);

});

ipcRenderer.on('consultaridllamOutResult', (event, datos) => {
    $("#btnRecuperarDatosLlamada").hide();
    if (datos == "NO") {
        $("#chats").hide()
        $("#btnRecuperarDatosLlamada").show();
        return;
    }
    $("#chats").hide()
    if (datos == "LLAMADA_NO_REALIZADA") {
        ipcRenderer.send('recargarPantalla', "")
    } else {
        document.getElementById("navegacionIvr").style.visibility = "hidden"; 
        llamadaOk = datos;
        var d = new Date(llamadaOk.fecha);
        llamadaOk.fechaLlamada = formatoFecha(d);
        llamadaOk.horaLlamada = formatoHora(d);
        $("#tiempoEnLlamada").html("00:00:00");
        $("#horaLlamada").html("Hora llamada: " + llamadaOk.horaLlamada);
        $("#idLlamada").html("Id de interacción: <br>" + llamadaOk.idLlamada);
        $("#idLlamada_").html("Id de interacción: <br>" + llamadaOk.idLlamada);
        $("#navegacionIvr").html(llamadaOk.RutaIvr);
        $("#idCliente").html(llamadaOk.noCliente);
        $("#nombreCliente").html(llamadaOk.nombreCompleto);
        $("#idCampana").html(llamadaOk.btAgenteCmpId);
        $("#nombreCampana").html(llamadaOk.motivoLlamada);
        $("#observaciones").val(llamadaOk.obs);
        if (obtenerCanal() == 9) {
            $("#nombreClienteCall").html(llamadaOk.nombreCompleto);
        }
        if(timerTiempoEnLlamada != 0){timerTiempoEnLlamada.parar()}
        timerTiempoEnLlamada = new TimerBsw("#tiempoEnLlamada", llamadaOk.fecha, llamadaOk.fecha, 1000)
        timerTiempoEnLlamada.iniciar();

        if (marcacionManual5 || marcacionCallback) {
            ipcRenderer.send('consultarEstatus', '')
            if (clienteAuto == "true") {
                abrirBuscarCliente();
              //  consultarCliente('listClientes_', llamadaOk.telefonoCliente);
            }
        } else {
            ipcRenderer.send('consultarEstatus', '')
            clienteSeleccionado = {
                nombrecompleto: llamadaOk.nombreCompleto,
                id: llamadaOk.noCliente
            }
            tipificacion();
        }
        //$("#displayScript").show()
        //$("#displayCliente").hide()
    }
});

ipcRenderer.on('consultarEstatusResult', (event, datos) => {

    $("#tipificacionEstatus").html("");
    $("#tipificacionEstatus").html('<option value="0"> Seleccione un estatus</option>');
    datos.forEach(dato => {
        $("#tipificacionEstatus").append("<option value='" + dato.sptestatusllam + "'>" + dato.sptestatusllamnoml + "</option>")
    });
})

function cambioEstatus() {

    ipcRenderer.send('consultarTipificacion', $("#tipificacionEstatus").val(),agenteOk.campana);

}

ipcRenderer.on('consultarTipificacionResult', (event, datos) => {    
    $("#tipificacionCombo").html("");
    datos.forEach(dato => {
        $("#tipificacionCombo").append(`<option value='${dato.id}-${dato.remarcar} '>${dato.dsc}</option>`)
    });
});

function guardarEstatusTipificacion() {

    var estatus = {
        idLlamada: llamadaOk.idLlamada,
        idAgente: agenteOk.id,
        estatusLlamada: $('#tipificacionEstatus').val(),
        estatusLlamadaDsc: $('#tipificacionEstatus').find('option:selected').text(),
        tipificacionLlamada: $('#tipificacionCombo').val().split("-")[0],
        tipificacionLlamadarRemarcar: $('#tipificacionCombo').val().split("-")[1],
        tipificacionLlamadaDsc: $('#tipificacionCombo').find('option:selected').text(),
        observaciones: $('#observaciones').val(),
        telefonoCliente: llamadaOk.telefonoCliente,
        extension: areaIniciada == "IBD" ? agenteOk.extension : agenteOk.extension,
        campana: llamadaOk.btAgenteCmpId,
        consecutivo: llamadaOk.id,
    };

    if (enLlamada) {
        ipcRenderer.send('GuardarEstatus', estatus)
    } else {

        $("#idAlertTipf").remove();
        $("#displayCliente").prepend('<div id="idAlertTipf" class="alert alert-danger" role="alert">No esta en llamada</div>');
        setTimeout(function () {
            $("#idAlertTipf").remove();
        }, 3000);
    }


}

ipcRenderer.on('GuardarEstatusResult', (event, datos) => {

    $("#idAlertTipf").remove();
    $("#displayCliente").prepend('<div id="idAlertTipf" class="alert alert-secondary" role="alert">Se ha guardo la información correctamente</div>');
    setTimeout(function () {
        $("#idAlertTipf").remove();
    }, 3000);

})

ipcRenderer.on('insertarPausaResult', (event, datos) => {


    if (datos == "NO") {

        sipToggleMute()

    } else {

        $("#btnMute").show()
        $("#btnMute_").show()
        $("#btnMute2").hide()
        if (datos.length != 0) {
            idPausa = datos[0].MAXIMO;
        }
    }



});

ipcRenderer.on('actualizarPausaResult', (event, datos) => {

    $("#btnMute").show()
    $("#btnMute_").show()
    $("#btnMute2").hide()
    idPausa = "";
});

ipcRenderer.on('actulizarAgenteResult', (event, datos) => {
    if (autorizado) {
        tomarReceso();
    } else {
        estatus = "DISPONIBLE"
        $("#usuario").html(usuarioOk.CNUSERID + " - " + usuarioOk.CNUSERDSC + " (" + estatus + ") ");
        socket.emit('cambioEstatusAgente', { estatus: "DISPONIBLE", agenteOk, areaIniciada });
    }
    console.log(datos)
});

function contador(_s, _m) {
    var contador_s = _s;
    var contador_m = _m;
    var s = 0;
    var m = 0;
    if (m < 10) {
        m = '0' + m;
    }

    timer = setInterval(function () {

        if (contador_s == 59) {
            contador_s = 0;
            contador_m++;
            m = contador_m;
            if (m == 59) { m = 0; }
            if (m < 10) { m = '0' + m; }
        }
        s = contador_s;
        contador_s++;
        if (s < 10) { s = '0' + s; }
        $("#tiempoEnLlamada").html("00" + ":" + m + ":" + s);
        $("#tiempoEnLlamada_").html("00" + ":" + m + ":" + s);

        _s1 = s;
        _m1 = m;
    }
        , 1000);
}

C =
{
    divKeyPadWidth: 220
};

function connectarSipml() {

    window.console && window.console.info && window.console.info("location=" + window.location);

    videoLocal = document.getElementById("video_local");
    videoRemote = document.getElementById("video_remote");
    audioRemote = document.getElementById("audio_remote");
    SIPml.setDebugLevel((window.localStorage && window.localStorage.getItem('org.doubango.expert.disable_debug') == "true") ? "error" : "info");

    loadCredentials();
    loadCallOptions();
    var getPVal = function (PName) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === PName) {
                return decodeURIComponent(pair[1]);
            }
        }
        return null;
    }

    var preInit = function () {
        // set default webrtc type (before initialization)
        var s_webrtc_type = getPVal("wt");
        var s_fps = getPVal("fps");
        var s_mvs = getPVal("mvs"); // maxVideoSize
        var s_mbwu = getPVal("mbwu"); // maxBandwidthUp (kbps)
        var s_mbwd = getPVal("mbwd"); // maxBandwidthUp (kbps)
        var s_za = getPVal("za"); // ZeroArtifacts
        var s_ndb = getPVal("ndb"); // NativeDebug

        if (s_webrtc_type) SIPml.setWebRtcType(s_webrtc_type);

        // initialize SIPML5
        SIPml.init(postInit);

        // set other options after initialization
        if (s_fps) SIPml.setFps(parseFloat(s_fps));
        if (s_mvs) SIPml.setMaxVideoSize(s_mvs);
        if (s_mbwu) SIPml.setMaxBandwidthUp(parseFloat(s_mbwu));
        if (s_mbwd) SIPml.setMaxBandwidthDown(parseFloat(s_mbwd));
        if (s_za) SIPml.setZeroArtifacts(s_za === "true");
        if (s_ndb == "true") SIPml.startNativeDebug();

        //var rinningApps = SIPml.getRunningApps();
        //var _rinningApps = Base64.decode(rinningApps);
        //tsk_utils_log_info(_rinningApps);
    }

    oReadyStateTimer = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(oReadyStateTimer);
            // initialize SIPML5
            preInit();
        }
    },
        500);
};

function postInit() {
    // check for WebRTC support
    if (!SIPml.isWebRtcSupported()) {
        // is it chrome?
        if (SIPml.getNavigatorFriendlyName() == 'chrome') {
            if (confirm("You're using an old Chrome version or WebRTC is not enabled.\nDo you want to see how to enable WebRTC?")) {
                window.location = 'http://www.webrtc.org/running-the-demos';
            }
            else {
                window.location = "index.html";
            }
            return;
        }
        else {
            if (confirm("webrtc-everywhere extension is not installed. Do you want to install it?\nIMPORTANT: You must restart your browser after the installation.")) {
                window.location = 'https://github.com/sarandogou/webrtc-everywhere';
            }
            else {
                // Must do nothing: give the user the chance to accept the extension
                // window.location = "index.html";
            }
        }
    }

    // checks for WebSocket support
    if (!SIPml.isWebSocketSupported()) {
        if (confirm('Your browser don\'t support WebSockets.\nDo you want to download a WebSocket-capable browser?')) {
            window.location = 'https://www.google.com/intl/en/chrome/browser/';
        }
        else {
            window.location = "index.html";
        }
        return;
    }

    // FIXME: displays must be per session
    viewVideoLocal = videoLocal;
    viewVideoRemote = videoRemote;

    if (!SIPml.isWebRtcSupported()) {
        if (confirm('Your browser don\'t support WebRTC.\naudio/video calls will be disabled.\nDo you want to download a WebRTC-capable browser?')) {
            window.location = 'https://www.google.com/intl/en/chrome/browser/';
        }
    }

    //btnRegister.disabled = false;
    document.body.style.cursor = 'default';
    oConfigCall = {
        audio_remote: audioRemote,
        video_local: viewVideoLocal,
        video_remote: viewVideoRemote,
        screencast_window_id: 0x00000000, // entire desktop
        bandwidth: { audio: undefined, video: undefined },
        video_size: { minWidth: undefined, minHeight: undefined, maxWidth: undefined, maxHeight: undefined },
        events_listener: { events: '*', listener: onSipEventSession },
        sip_caps: [
            { name: '+g.oma.sip-im' },
            { name: 'language', value: '\"en,fr\"' }
        ]
    };

    sipRegister();
}


function loadCallOptions() {
    if (window.localStorage) {
        var s_value;
        if ((s_value = window.localStorage.getItem('org.doubango.call.phone_number'))) txtPhoneNumber.value = s_value;
        bDisableVideo = (window.localStorage.getItem('org.doubango.expert.disable_video') == "true");
        //txtCallStatus.innerHTML = '<i>Video ' + (bDisableVideo ? 'disabled' : 'enabled') + '</i>';
    }
}

function saveCallOptions() {
    if (window.localStorage) {
        window.localStorage.setItem('org.doubango.call.phone_number', txtPhoneNumber.value);
        window.localStorage.setItem('org.doubango.expert.disable_video', bDisableVideo ? "true" : "false");
    }
}

function loadCredentials() {
    
    //$("#exampleModalNavidad").modal()
    window.localStorage.setItem('org.doubango.expert.disable_video', "true");
    window.localStorage.setItem('org.doubango.expert.enable_rtcweb_breaker', "true");
    window.localStorage.setItem('org.doubango.expert.websocket_server_url', areaIniciada == "IBD" ? urls.webSocket : urls.webSocket2);
    window.localStorage.setItem('org.doubango.expert.sip_outboundproxy_url', "");
    window.localStorage.setItem('org.doubango.expert.ice_servers', urls.ice);
    window.localStorage.setItem('org.doubango.expert.bandwidth', "");
    window.localStorage.setItem('org.doubango.expert.video_size', "");
    window.localStorage.setItem('org.doubango.expert.disable_early_ims', "true");
    window.localStorage.setItem('org.doubango.expert.disable_debug', "true");
    window.localStorage.setItem('org.doubango.expert.enable_media_caching', "true");
    window.localStorage.setItem('org.doubango.expert.disable_callbtn_options', "true");

    txtDisplayName.value = areaIniciada == "IBD" ? agenteOk.extension : agenteOk.extension;
    txtPrivateIdentity.value = areaIniciada == "IBD" ? agenteOk.extension : agenteOk.extension;
    txtPublicIdentity.value = "sip:" + (areaIniciada == "IBD" ? agenteOk.extension : agenteOk.extension) + "@" + (areaIniciada == "IBD" ? urls.ipMarcador : urls.ipMarcadorOut);
    txtPassword.value = urls.prefijoPsswExt + (areaIniciada == "IBD" ? agenteOk.extension : agenteOk.extension);
    txtRealm.value = areaIniciada == "IBD" ? urls.ipMarcador : urls.ipMarcadorOut;
    txtPhoneNumber.value = "";

    nombreAgente.innerHTML = "<span class='datosAgente mr-2'>Agente:</span>" + agenteOk.nombre;
    campanaAgente.innerHTML = "<span class='datosAgente mr-2'>Campaña:</span>" + agenteOk.campanaid + " - " + agenteOk.cmpdsc;
    campanaAgente.innerHTML += "<br><span class='datosAgente mr-2'>Campaña asignado:</span>" + agenteOk.campana + " - " + agenteOk.cmpdsc;
    extAgente.innerHTML = "<span class='datosAgente mr-2'>Extensión:</span>" + (areaIniciada == "IBD" ? agenteOk.extension : agenteOk.extension);
    supervisorAgente.innerHTML = "<span class='datosAgente mr-2'>Supervisor:</span>" + agenteOk.supervisor;
   
};


function saveCredentials() {
    if (window.localStorage) {
        window.localStorage.setItem('org.doubango.identity.display_name', txtDisplayName.value);
        window.localStorage.setItem('org.doubango.identity.impi', txtPrivateIdentity.value);
        window.localStorage.setItem('org.doubango.identity.impu', txtPublicIdentity.value);
        window.localStorage.setItem('org.doubango.identity.password', txtPassword.value);
        window.localStorage.setItem('org.doubango.identity.realm', txtRealm.value);
    }
};

// sends SIP REGISTER request to login
function sipRegister() {
    // catch exception for IE (DOM not ready)
    try {
        //btnRegister.disabled = true;
        if (!txtRealm.value || !txtPrivateIdentity.value || !txtPublicIdentity.value) {
            txtRegStatus.innerHTML = '<b>Please fill madatory fields (*)</b>';
            //btnRegister.disabled = false;
            return;
        }
        var o_impu = tsip_uri.prototype.Parse(txtPublicIdentity.value);
        if (!o_impu || !o_impu.s_user_name || !o_impu.s_host) {
            txtRegStatus.innerHTML = "<b>[" + txtPublicIdentity.value + "] is not a valid Public identity</b>";
            //btnRegister.disabled = false;
            return;
        }

        // enable notifications if not already done
        if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
            window.webkitNotifications.requestPermission();
        }

        // save credentials
        saveCredentials();

        // update debug level to be sure new values will be used if the user haven't updated the page
        SIPml.setDebugLevel((window.localStorage && window.localStorage.getItem('org.doubango.expert.disable_debug') == "true") ? "error" : "info");

        // create SIP stack
        oSipStack = new SIPml.Stack({
            realm: txtRealm.value,
            impi: txtPrivateIdentity.value,
            impu: txtPublicIdentity.value,
            password: txtPassword.value,
            display_name: txtDisplayName.value,
            websocket_proxy_url: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.websocket_server_url') : null),
            outbound_proxy_url: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.sip_outboundproxy_url') : null),
            ice_servers: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.ice_servers') : null),
            enable_rtcweb_breaker: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.enable_rtcweb_breaker') == "true" : false),
            events_listener: { events: '*', listener: onSipEventStack },
            enable_early_ims: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.disable_early_ims') != "true" : true), // Must be true unless you're using a real IMS network
            enable_media_stream_cache: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.enable_media_caching') == "true" : false),
            bandwidth: (window.localStorage ? tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.bandwidth')) : null), // could be redefined a session-level
            video_size: (window.localStorage ? tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.video_size')) : null), // could be redefined a session-level
            sip_headers: [
                { name: 'User-Agent', value: 'IM-client/OMA1.0 sipML5-v1.2016.03.04' },
                { name: 'Organization', value: 'Doubango Telecom' }
            ]
        }
        );
        if (oSipStack.start() != 0) {
            txtRegStatus.innerHTML = '<b>Failed to start the SIP stack</b>';
        }
        else return;
    }
    catch (e) {
        txtRegStatus.innerHTML = "<b>2:" + e + "</b>";
    }
    //btnRegister.disabled = false;
}

// sends SIP REGISTER (expires=0) to logout
function sipUnRegister() {
    if (oSipStack) {
        oSipStack.stop(); // shutdown all sessions
    }
}

// makes a call (SIP INVITE)
function sipCall(s_type) {
    if (oSipStack && !oSipSessionCall && !tsk_string_is_null_or_empty(txtPhoneNumber.value)) {
        if (s_type == 'call-screenshare') {
            if (!SIPml.isScreenShareSupported()) {
                //alert('Screen sharing not supported. Are you using chrome 26+?');

                return;
            }
            if (!location.protocol.match('https')) {
                if (confirm("Screen sharing requires https://. Do you want to be redirected?")) {
                    sipUnRegister();
                    window.location = 'https://ns313841.ovh.net/call.htm';
                }
                return;
            }
        }

        console.log("sipCall")
        $("#btnHangUp").show()
        $("#displayLlamada").show()
        $("#displayUsuario").hide()
        if ($("#divOpen").hasClass("d-flex") && oSipSessionCall) {
            $("#mydiv").removeClass("d-none")
        }
        //btnCall.disabled = true;
        //btnHangUp.disabled = false;

        if (window.localStorage) {
            oConfigCall.bandwidth = tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.bandwidth')); // already defined at stack-level but redifined to use latest values
            oConfigCall.video_size = tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.video_size')); // already defined at stack-level but redifined to use latest values
        }

        // create call session
        oSipSessionCall = oSipStack.newSession(s_type, oConfigCall);
        // make call
        if (oSipSessionCall.call(txtPhoneNumber.value) != 0) {
            oSipSessionCall = null;
            txtCallStatus.value = 'Failed to make call';
            btnCall.disabled = false;
            //btnHangUp.disabled = true;
            $("#btnHangUp").hide()
            return;
        }
        saveCallOptions();
    }
    else if (oSipSessionCall) {
        //txtCallStatus.innerHTML = '<i>Connecting...</i>';
        txtCallStatus.innerHTML = '<i>Conectando...</i>';
        txtCallStatus_.innerHTML = '<i>Conectando...</i>';
        oSipSessionCall.accept(oConfigCall);
    }
}

// Share entire desktop aor application using BFCP or WebRTC native implementation
function sipShareScreen() {
    if (SIPml.getWebRtcType() === 'w4a') {
        // Sharing using BFCP -> requires an active session
        if (!oSipSessionCall) {
            txtCallStatus.innerHTML = '<i>No active session</i>';
            txtCallStatus_.innerHTML = '<i>No active session</i>';
            return;
        }
        if (oSipSessionCall.bfcpSharing) {
            if (oSipSessionCall.stopBfcpShare(oConfigCall) != 0) {
                txtCallStatus.value = 'Failed to stop BFCP share';
                txtCallStatus_.value = 'Failed to stop BFCP share';
            }
            else {
                oSipSessionCall.bfcpSharing = false;
            }
        }
        else {
            oConfigCall.screencast_window_id = 0x00000000;
            if (oSipSessionCall.startBfcpShare(oConfigCall) != 0) {
                txtCallStatus.value = 'Failed to start BFCP share';
                txtCallStatus_.value = 'Failed to start BFCP share';
            }
            else {
                oSipSessionCall.bfcpSharing = true;
            }
        }
    }
    else {
        sipCall('call-screenshare');
    }
}


function sipTransferRapido() {
    if (oSipSessionCall) {
        var s_destination = agenteOk.btcampanasmarcacionrapida;
        let date = new Date();
        console.log(" envia transfer  - " + date)
        if (!tsk_string_is_null_or_empty(s_destination)) {
            //btnTransfer.disabled = true;
            if (oSipSessionCall.transfer(s_destination) != 0) {
                txtCallStatus.innerHTML = '<i>Call transfer failed</i>';
                txtCallStatus_.innerHTML = '<i>Call transfer failed</i>';
                //btnTransfer.disabled = false;
                return;
            }
            let date = new Date();
            console.log(" acepta transfer  - " + date)
            txtCallStatus.innerHTML = '<i>Transfering the call...</i>';
            txtCallStatus_.innerHTML = '<i>Transfering the call...</i>';
            sipHangUp('Transferencia');
        }
    }
}

function sipTransferRapido2() {
    if (oSipSessionCall) {
        var s_destination = $("#transferenciasCombo").val();
        if (!tsk_string_is_null_or_empty(s_destination)) {
            //btnTransfer.disabled = true;
            if (oSipSessionCall.transfer(s_destination) != 0) {
                txtCallStatus.innerHTML = '<i>Call transfer failed</i>';
                txtCallStatus_.innerHTML = '<i>Call transfer failed</i>';
                //btnTransfer.disabled = false;
                return;
            }
            let date = new Date();
            console.log(" acepta transfer  - " + date)
            txtCallStatus.innerHTML = '<i>Transfering the call...</i>';
            txtCallStatus_.innerHTML = '<i>Transfering the call...</i>';
            sipHangUp('Transferencia');
        }
    }
}




// transfers the call
function sipTransfer() {
    if (oSipSessionCall) {
        var s_destination = $("#numeroMarcar_").val();
        let date = new Date();
        console.log(" envia transfer  - " + date)
        if (!tsk_string_is_null_or_empty(s_destination)) {
            //btnTransfer.disabled = true;
            if (oSipSessionCall.transfer(s_destination) != 0) {
                txtCallStatus.innerHTML = '<i>Call transfer failed</i>';
                txtCallStatus_.innerHTML = '<i>Call transfer failed</i>';
                //btnTransfer.disabled = false;
                return;
            }
            let date = new Date();
            console.log(" acepta transfer  - " + date)
            $("#numeroMarcar_").val("")
            txtCallStatus.innerHTML = '<i>Transfering the call...</i>';
            txtCallStatus_.innerHTML = '<i>Transfering the call...</i>';
            sipHangUp('Transferencia');
        }
    }
}

// holds or resumes the call #NO FUNCIONA

function sipToggleHoldResume() {
    if (oSipSessionCall) {
        var i_ret;
        btnHoldResume.disabled = true;
        txtCallStatus.innerHTML = oSipSessionCall.bHeld ? '<i>Reanudando llamada...</i>' : '<i>Pausando llamada...</i>';
        txtCallStatus_.innerHTML = oSipSessionCall.bHeld ? '<i>Reanudando llamada...</i>' : '<i>Pausando llamada...</i>';
        i_ret = oSipSessionCall.bHeld ? oSipSessionCall.resume() : oSipSessionCall.hold();
        if (i_ret != 0) {
            txtCallStatus.innerHTML = '<i>Pausa / Reanudación fallida</i>';
            txtCallStatus_.innerHTML = '<i>Pausa / Reanudación fallida</i>';
            btnHoldResume.disabled = false;
            return;
        }
    }
}

// Mute or Unmute the call
function sipToggleMute() {
    if (oSipSessionCall) {
        var i_ret;
        var bMute = !oSipSessionCall.bMute;
        txtCallStatus.innerHTML = bMute ? '<i>En pausa...</i>' : '<i>En llamada...</i>';
        txtCallStatus_.innerHTML = bMute ? '<i>En pausa...</i>' : '<i>En llamada...</i>';
        i_ret = oSipSessionCall.mute('audio'/*could be 'video'*/, bMute);
        if (i_ret != 0) {
            txtCallStatus.innerHTML = '<i>Fallo pausa</i>';
            txtCallStatus_.innerHTML = '<i>Fallo pausa</i>';
            return;
        }
        oSipSessionCall.bMute = bMute;

        var objPausa = {

            idLlamada: llamadaOk.idLlamada,
            extension: areaIniciada == "IBD" ? agenteOk.extension : agenteOk.extension,
            idAgente: usuarioOk.CNUSERID,
            telefono: llamadaOk.telefonoCliente,
            idPausa: idPausa,

        };

        if (bMute) {

            $("#btnMute").addClass("bg-info")
            $("#btnMute").removeClass("bg-dark")

            $("#btnMute_").addClass("bg-info")
            $("#btnMute_").removeClass("bg-dark")

            $("#btnMute").hide()
            $("#btnMute_").hide()
            $("#btnMute2").show()


            if (areaIniciada == "OBD") {
                ipcRenderer.send('insertarPausaO', objPausa)
            } else {
                ipcRenderer.send('insertarPausa', objPausa)
            }



        } else {

            $("#btnMute").removeClass("bg-info")
            $("#btnMute").addClass("bg-secondary")

            $("#btnMute_").removeClass("bg-info")
            $("#btnMute_").addClass("bg-secondary")

            $("#btnMute").hide()
            $("#btnMute_").hide()
            $("#btnMute2").show()

            if (areaIniciada == "OBD") {
                ipcRenderer.send('actualizarPausaO', objPausa)
            } else {
                ipcRenderer.send('actualizarPausa', objPausa)
            }

        }

        btnMute.innerHTML = bMute ? '<img src="img/mic-mute.png" style="width: 30px;margin: 0 auto;" >' : '<img src="img/mic.png" style="width: 30px;margin: 0 auto;" >';
        btnMute_.innerHTML = bMute ? '<img src="img/mic-mute.png" style="width: 20px" >' : '<img src="img/mic.png" style="width: 20px" >';
    }
}

// terminates the call (SIP BYE or CANCEL)
function sipHangUp(motivoColgar) {
    llamadaOk.motivoColgar=motivoColgar;
    if (oSipSessionCall) {
        txtCallStatus.innerHTML = '<i>Terminating the call...</i>';
        txtCallStatus_.innerHTML = '<i>Terminating the call...</i>';
        setTimeout(function () {
            txtCallStatus.innerHTML = "";
            txtCallStatus_.innerHTML = "";
        }, 3000);
        oSipSessionCall.hangup({ events_listener: { events: '*', listener: onSipEventSession } });
    }
}

// cancelar llamada

function cancelarLlamada() {
   /*
    ipcRenderer.send('cancelarllamada', { id_: llamadaOk.idLlamada_, id: llamadaOk.idLlamada, telefono: llamadaOk.telefonoCliente, extension: agenteOk.extension, 
        url: urls.ipCRM });
*/
    /*$(".alert").remove();
    $("#AREAINICIADA_").before(
      
      '<div class="alert alert-danger" role="alert" style="background: transparent; border: none;"> Cancelar tipificacion </div>'

    );*/
    $(".loader").hide();
    $("#mensajeModal").html("Cancelar tipificacion:");
    $("#modalCancelarLlam").modal({ backdrop: 'static', keyboard: false}, 'show' );

}

function cancelarLlamadaPor(motivoCancelar) {
    var acw =  $("#timerParaFin").html().trim().replace('seg','').replace(' ','');
    if(acw==''){
        acw='0';
    }
    var totalacw= parseInt(timerFinalizarLlamadaacw) - parseInt(acw);
    ipcRenderer.send('cancelarllamada', { id_: llamadaOk.idLlamada_, id: llamadaOk.idLlamada, telefono: llamadaOk.telefonoCliente, extension: agenteOk.extension, 
        url: urls.ipCRM , motivoCancelar: motivoCancelar, acw:totalacw});
}
ipcRenderer.on('cancelarLlamadaResult', (event, datos) => {
    if(datos == "OK"){
        timerFinalizarLlamadaacw="0";
        $("#modalCancelarLlam").modal( 'hide' );

        $("#alertPrincipal").slideUp(0);
        $("#alertPrincipal").html("<strong>Aviso.</strong> Se cancelo la tipificacion");
        $("#alertPrincipal").fadeTo(3000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(2000);
        });
    }else{
        var acw =  $("#timerParaFin").html().trim().replace('seg','').replace(' ','');
    if(acw==''){
        acw='0';
    }
    var totalacw= parseInt(timerFinalizarLlamadaacw) - parseInt(acw);
    ipcRenderer.send('cancelarllamada', { id_: llamadaOk.idLlamada_, id: llamadaOk.idLlamada, telefono: llamadaOk.telefonoCliente, extension: agenteOk.extension, 
        url: urls.ipCRM , motivoCancelar: motivoCancelar, acw:totalacw});
    }   
});

function sipSendDTMF(c) {
    if (oSipSessionCall && c) {
        if (oSipSessionCall.dtmf(c) == 0) {
            try { dtmfTone.play(); } catch (e) { }
        }
    }
}

function startRingTone() {
    try { ringtone.play(); }
    catch (e) { }
}

function stopRingTone() {
    try { ringtone.pause(); }
    catch (e) { }
}

function startRingbackTone() {
    try { ringbacktone.play(); }
    catch (e) { }
}

function stopRingbackTone() {
    try { ringbacktone.pause(); }
    catch (e) { }
}

function toggleFullScreen() {
    if (videoRemote.webkitSupportsFullscreen) {
        fullScreen(!videoRemote.webkitDisplayingFullscreen);
    }
    else {
        fullScreen(!bFullScreen);
    }
}

function openKeyPad() {
    divKeyPad.style.visibility = 'visible';
    divKeyPad.style.left = ((document.body.clientWidth - C.divKeyPadWidth) >> 1) + 'px';
    divKeyPad.style.top = '70px';
    divGlassPanel.style.visibility = 'visible';
}

function closeKeyPad() {
    divKeyPad.style.left = '0px';
    divKeyPad.style.top = '0px';
    divKeyPad.style.visibility = 'hidden';
    divGlassPanel.style.visibility = 'hidden';
}

function fullScreen(b_fs) {
    bFullScreen = b_fs;
    if (tsk_utils_have_webrtc4native() && bFullScreen && videoRemote.webkitSupportsFullscreen) {
        if (bFullScreen) {
            videoRemote.webkitEnterFullScreen();
        }
        else {
            videoRemote.webkitExitFullscreen();
        }
    }
    else {
        if (tsk_utils_have_webrtc4npapi()) {
            try { if (window.__o_display_remote) window.__o_display_remote.setFullScreen(b_fs); }
            catch (e) { divVideo.setAttribute("class", b_fs ? "full-screen" : "normal-screen"); }
        }
        else {
            divVideo.setAttribute("class", b_fs ? "full-screen" : "normal-screen");
        }
    }
}

function showNotifICall(s_number) {
    // permission already asked when we registered
    if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0) {
        if (oNotifICall) {
            oNotifICall.cancel();
        }
        oNotifICall = window.webkitNotifications.createNotification('images/sipml-34x39.png', 'Incaming call', 'Incoming call from ' + s_number);
        oNotifICall.onclose = function () { oNotifICall = null; };
        oNotifICall.show();
    }
}

function onKeyUp(evt) {
    evt = (evt || window.event);
    if (evt.keyCode == 27) {
        fullScreen(false);
    }
    else if (evt.ctrlKey && evt.shiftKey) { // CTRL + SHIFT
        if (evt.keyCode == 65 || evt.keyCode == 86) { // A (65) or V (86)
            bDisableVideo = (evt.keyCode == 65);
            txtCallStatus.innerHTML = '<i>Video ' + (bDisableVideo ? 'disabled' : 'enabled') + '</i>';
            window.localStorage.setItem('org.doubango.expert.disable_video', bDisableVideo);
        }
    }
}

function onDivCallCtrlMouseMove(evt) {
    try { // IE: DOM not ready
        if (tsk_utils_have_stream()) {
            btnCall.disabled = (!tsk_utils_have_stream() || !oSipSessionRegister || !oSipSessionRegister.is_connected());
            document.getElementById("divCallCtrl").onmousemove = null; // unsubscribe
        }
    }
    catch (e) { }
}

function uiOnConnectionEvent(b_connected, b_connecting) { // should be enum: connecting, connected, terminating, terminated
    //btnRegister.disabled = b_connected || b_connecting;
    //btnUnRegister.disabled = !b_connected && !b_connecting;
    btnCall.disabled = !(b_connected && tsk_utils_have_webrtc() && tsk_utils_have_stream());
    //btnHangUp.disabled = !oSipSessionCall;

    if (!oSipSessionCall) {
        $("#btnHangUp").hide()
    } else {
        $("#btnHangUp").hide()
    }
}

function uiVideoDisplayEvent(b_local, b_added) {
    var o_elt_video = b_local ? videoLocal : videoRemote;

    if (b_added) {
        o_elt_video.style.opacity = 1;
        uiVideoDisplayShowHide(true);
    }
    else {
        o_elt_video.style.opacity = 0;
        fullScreen(false);
    }
}

function uiVideoDisplayShowHide(b_show) {
    if (b_show) {
        tdVideo.style.height = '340px';
        divVideo.style.height = navigator.appName == 'Microsoft Internet Explorer' ? '100%' : '340px';
    }
    else {
        tdVideo.style.height = '0px';
        divVideo.style.height = '0px';
    }
    btnFullScreen.disabled = !b_show;
}

function uiDisableCallOptions() {
    if (window.localStorage) {
        window.localStorage.setItem('org.doubango.expert.disable_callbtn_options', 'true');
        //uiBtnCallSetText('Call');
        //alert('Use expert view to enable the options again (/!\\requires re-loading the page)');
    }
}

function uiBtnCallSetText(s_text) {
    switch (s_text) {
        case "Call":
            {
                var bDisableCallBtnOptions = (window.localStorage && window.localStorage.getItem('org.doubango.expert.disable_callbtn_options') == "true");
                btnCall.value = btnCall.innerHTML = bDisableCallBtnOptions ? 'Call' : 'Call <span id="spanCaret" class="caret">';
                btnCall.setAttribute("class", bDisableCallBtnOptions ? "btn btn-primary" : "btn btn-primary dropdown-toggle");
                btnCall.onclick = bDisableCallBtnOptions ? function () { sipCall(bDisableVideo ? 'call-audio' : 'call-audiovideo'); } : null;
                ulCallOptions.style.visibility = bDisableCallBtnOptions ? "hidden" : "visible";
                if (!bDisableCallBtnOptions && ulCallOptions.parentNode != divBtnCallGroup) {
                    divBtnCallGroup.appendChild(ulCallOptions);
                }
                else if (bDisableCallBtnOptions && ulCallOptions.parentNode == divBtnCallGroup) {
                    document.body.appendChild(ulCallOptions);
                }

                break;
            }
        default:
            {
                btnCall.value = btnCall.innerHTML = s_text;
                btnCall.setAttribute("class", "btn btn-primary");
                btnCall.onclick = function () { sipCall(bDisableVideo ? 'call-audio' : 'call-audiovideo'); };
                ulCallOptions.style.visibility = "hidden";
                if (ulCallOptions.parentNode == divBtnCallGroup) {
                    document.body.appendChild(ulCallOptions);
                }
                break;
            }
    }
}

function uiCallTerminated(s_description) {
  
   if(llamadaOk.motivoColgar==""){
       llamadaOk.motivoColgar="Cliente";
   }
    let date = new Date();
    console.log(" se termino la llamada  - " + date)

    if (!entroAfinLlamada) {
        entroAfinLlamada = true;

        $("#alertPrincipal").html("<strong>Aviso.</strong> Se colgó la llamada");
        $("#alertPrincipal").fadeTo(3000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(2000);
        });
        finalizarCrm();

        var tiempoParaFin = areaIniciada == "IBD" ? agenteOk.tiempoTip : agenteOk.tiempoFRM;
        timerFinalizarLlamadaacw=tiempoParaFin;
        if (tiempoParaFin > 0) {

            $("#timerParaFin").show();
            timerFin_ = tiempoParaFin;
            timerFin = setInterval(function () {
                $("#timerParaFin").html(timerFin_ + " seg ");
                timerFin_ = timerFin_ - 1;

            }, 1000);

            setTimeout(function () {
                finalizarLlamadas(s_description)
                $("#timerParaFin").html("");
                $("#timerParaFin").hide();
                clearInterval(timerFin)
                entroAfinLlamada = false;

            }, (tiempoParaFin + 1) * 1000);
        } else {

            finalizarLlamadas(s_description)
            entroAfinLlamada = false;
        }

        stopRingbackTone();
        stopRingTone();

        if (idPausa != "") {
            var objPausa = {
                idLlamada: llamadaOk.idLlamada,
                extension: areaIniciada == "IBD" ? agenteOk.extension : agenteOk.extension,
                idAgente: usuarioOk.CNUSERID,
                telefono: llamadaOk.telefonoCliente,
                idPausa: idPausa,
            };
            if (areaIniciada == "OBD") {
                ipcRenderer.send('actualizarPausaO', objPausa)
            } else {
                ipcRenderer.send('actualizarPausa', objPausa)
            }

        }
        $("#btnMute").removeClass("bg-info")
        $("#btnMute").addClass("bg-secondary")
        $("#btnMute_").removeClass("bg-info")
        $("#btnMute_").addClass("bg-dark")
        btnMute.innerHTML = '<img src="img/mic.png" style="width: 30px;margin: 0 auto;" >';
        btnMute_.innerHTML = '<img src="img/mic.png" style="width: 20px;" >';

    }
}

// Callback function for SIP Stacks
function onSipEventStack(e /*SIPml.Stack.Event*/) {
    tsk_utils_log_info('==stack event = ' + e.type);
    switch (e.type) {
        case 'started':
            {
                // catch exception for IE (DOM not ready)
                try {
                    // LogIn (REGISTER) as soon as the stack finish starting
                    oSipSessionRegister = this.newSession('register', {
                        expires: 200,
                        events_listener: { events: '*', listener: onSipEventSession },
                        sip_caps: [
                            { name: '+g.oma.sip-im', value: null },
                            //{ name: '+sip.ice' }, // rfc5768: FIXME doesn't work with Polycom TelePresence
                            { name: '+audio', value: null },
                            { name: 'language', value: '\"en,fr\"' }
                        ]
                    });
                    oSipSessionRegister.register();
                }
                catch (e) {
                    txtRegStatus.value = txtRegStatus.innerHTML = "<b>1:" + e + "</b>";
                    btnRegister.disabled = false;
                }
                break;
            }
        case 'stopping': case 'stopped': case 'failed_to_start': case 'failed_to_stop':
            {
                var bFailure = (e.type == 'failed_to_start') || (e.type == 'failed_to_stop');
                oSipStack = null;
                oSipSessionRegister = null;
                oSipSessionCall = null;
                //uiOnConnectionEvent(false, false);
                stopRingbackTone();
                stopRingTone();
                uiVideoDisplayShowHide(false);
                txtCallStatus.innerHTML = '';
                txtCallStatus_.innerHTML = '';
                txtRegStatus.innerHTML = bFailure ? "<i>Disconnected: <b>" + e.description + "</b></i>" : "<i>Disconnected</i>";
                circulo_estatus.style.background = "red";
                if (motivoDesco == "")
                    alertaConexionLlamada(false, "llamada")
                break;
            }
        case 'i_new_call':
            {
                if (oSipSessionCall) {
                    // do not accept the incoming call if we're already 'in call'
                    e.newSession.hangup(); // comment this line for multi-line support
                }
                else {
                    oSipSessionCall = e.newSession;
                    // start listening for events
                    oSipSessionCall.setConfiguration(oConfigCall);
                    startRingTone();
                    ipcRenderer.send('consultarRespuestas', { campana: agenteOk.campana, canal: areaIniciada });
                    $("#preguntaTitulo").html("...");
                    $("#respuestaText").html("...");
                    setTimeout(function () {
                        if (oSipSessionCall) {
                            oSipSessionCall.accept(oConfigCall);
                        }
                        var date2 = new Date();
                        console.log("ACEPTA LLAMADA - " + date2)
                        if (areaIniciada == "IBD") {
                            $("#displayScript").show()
                            $("#displayCliente").hide();
                            ipcRenderer.send('consultarTipoRespuesta', '')
                            ipcRenderer.send('consultarNumTransferencias', '')
                            
                        }
                    }, 3000);
                    console.log("i_new_call")
                    var date = new Date();
                    console.log("LLEGA LLAMADA - " + date)
                    var sRemoteNumber = (oSipSessionCall.getRemoteFriendlyName() || 'unknown');
                    txtCallStatus.innerHTML = "<i>Llamada de entrada de: </i>";
                    txtCallStatus_.innerHTML = "<i>Llamada de entrada de: </i>";
                    estatus = "EN LLAMADA";
                    $("#usuario").html(usuarioOk.CNUSERID + " - " + usuarioOk.CNUSERDSC + " (" + estatus + ") ");
                    socket.emit('cambioEstatusAgente', { estatus: estatus, agenteOk, areaIniciada });
                    var telefonoEspecifico=sRemoteNumber;
                    if(telefonoEspecifico=="unknown" || telefonoEspecifico=="null"||  telefonoEspecifico==null  || telefonoEspecifico=="navailable" || telefonoEspecifico=="unavailable"|| telefonoEspecifico=="" || telefonoEspecifico==" "|| telefonoEspecifico=="invalid" ){
                        telefonoEspecifico="anonymus";
                    }

                    numeroRemoto.innerHTML = telefonoEspecifico;
                    numeroRemoto_.innerHTML = telefonoEspecifico;
                    sRemoteNumbervar = telefonoEspecifico;
                    showNotifICall(telefonoEspecifico);
                    var objAgente = {
                        ipCRM: urls.ipCRM,
                        canalId: obtenerCanal(),
                        idLlamada: "",
                        extension: areaIniciada == "IBD" ? agenteOk.extension : agenteOk.extension,
                        telefonoCliente: telefonoEspecifico,
                        idCliente: "0",
                        idAgente: agenteOk.id,
                        nombreAgente: agenteOk.nombre,
                        idFolio: "0",
                        supervisor: agenteOk.supervisor,
                        marcacionManulaAct: marcacionManual5,
                        campanaId: agenteOk.campana,
                        marcacionManual4,
                        marcacionCallback,
                        contactoseleccionado,
                        llamadaEjec,
                    }
                    if (obtenerCanal() == 1) {
                        ipcRenderer.send('consultaridllamivrcrm', objAgente)
                    } else {

                        setTimeout(function () {
                            ipcRenderer.send('consultaridllamOut', objAgente)
                            var date3 = new Date();
                            console.log("CONSULTA LLAMADA - " + date3)
                        }, 4000);


                    }
                    enLlamada = true;
                }
                break;
            }

        case 'm_permission_requested':
            {
                divGlassPanel.style.visibility = 'visible';
                break;
            }
        case 'm_permission_accepted':
        case 'm_permission_refused':
            {
                divGlassPanel.style.visibility = 'hidden';
                if (e.type == 'm_permission_refused') {
                    uiCallTerminated('Media stream permission denied');
                }
                break;
            }

        case 'starting': default: break;
    }
};

// Callback function for SIP sessions (INVITE, REGISTER, MESSAGE...)
function onSipEventSession(e /* SIPml.Session.Event */) {
    tsk_utils_log_info('==session event = ' + e.type);

    switch (e.type) {
        case 'connecting': case 'connected':
            {
                var bConnected = (e.type == 'connected');
                if (e.session == oSipSessionRegister) {
                    if (e.description == "Connected") {
                        circulo_estatus.style.background = "#16e016";
                        txtRegStatus.innerHTML = "<i>Conectado</i>";
                        connectarWebSoket();
                        setTimeout(function () {
                            if (areaIniciada == "OBD") {
                                //actulizar agente des pues de inicial el softphone para outbound                      
                                ipcRenderer.send('ActualizarAgenteExtesionConectada', { IdAgente: usuarioOk.CNUSERID, estatus: "DISPONIBLE", areaIniciada })
                            }
                        }, 3000);
                    } else if (e.description == "Connecting...") {
                        circulo_estatus.style.background = "#ffc107";
                        txtRegStatus.innerHTML = "<i>Conectando...</i>";
                    } else {
                        circulo_estatus.style.background = "red";
                        txtRegStatus.innerHTML = "<i>" + e.description + "</i>";
                    }

                }
                else if (e.session == oSipSessionCall) {
                    $("#btnHangUp").show()
                    $("#displayLlamada").show()
                    if ($("#divOpen").hasClass("d-flex") && oSipSessionCall) {
                        $("#mydiv").removeClass("d-none")
                    }
                    $("#displayUsuario").hide()
                    if (bConnected) {
                        stopRingbackTone();
                        stopRingTone();

                        if (oNotifICall) {
                            oNotifICall.cancel();
                            oNotifICall = null;
                        }
                    }
                    txtCallStatus.innerHTML = "<i>" + e.description + "</i>";
                    txtCallStatus_.innerHTML = "<i>" + e.description + "</i>";
                    if (e.description == "In call") {

                        txtCallStatus.innerHTML = "<i>En Llamada</i>";
                        txtCallStatus_.innerHTML = "<i>En Llamada</i>";
                    }
                    if (SIPml.isWebRtc4AllSupported()) { // IE don't provide stream callback
                        uiVideoDisplayEvent(false, true);
                        uiVideoDisplayEvent(true, true);
                    }
                }
                break;
            } // 'connecting' | 'connected'
        case 'terminating': case 'terminated':
            {
                if (e.session == oSipSessionRegister) {
                    //uiOnConnectionEvent(false, false);
                    oSipSessionCall = null;
                    oSipSessionRegister = null;
                    circulo_estatus.style.background = "red";
                    txtRegStatus.innerHTML = "<i>" + e.description + "</i>";
                }
                else if (e.session == oSipSessionCall) {
                    uiCallTerminated(e.description);
                }
                break;
            } // 'terminating' | 'terminated'

        case 'm_stream_video_local_added':
            {
                if (e.session == oSipSessionCall) {
                    uiVideoDisplayEvent(true, true);
                }
                break;
            }
        case 'm_stream_video_local_removed':
            {
                if (e.session == oSipSessionCall) {
                    uiVideoDisplayEvent(true, false);
                }
                break;
            }
        case 'm_stream_video_remote_added':
            {
                if (e.session == oSipSessionCall) {
                    uiVideoDisplayEvent(false, true);
                }
                break;
            }
        case 'm_stream_video_remote_removed':
            {
                if (e.session == oSipSessionCall) {
                    uiVideoDisplayEvent(false, false);
                }
                break;
            }

        case 'm_stream_audio_local_added':
        case 'm_stream_audio_local_removed':
        case 'm_stream_audio_remote_added':
        case 'm_stream_audio_remote_removed':
            {
                break;
            }

        case 'i_ect_new_call':
            {
                oSipSessionTransferCall = e.session;
                let date = new Date();
                console.log(" i_ect_new_call  - " + date)
                break;
            }

        case 'i_ao_request':
            {
                if (e.session == oSipSessionCall) {
                    var iSipResponseCode = e.getSipResponseCode();
                    if (iSipResponseCode == 180 || iSipResponseCode == 183) {
                        startRingbackTone();
                        var date = new Date();
                        console.log("SUENA LLAMADA - " + date)
                        txtCallStatus.innerHTML = '<i>Remote ringing...</i>';
                        txtCallStatus_.innerHTML = '<i>Remote ringing...</i>';
                    }
                }
                break;
            }

        case 'm_early_media':
            {
                if (e.session == oSipSessionCall) {
                    stopRingbackTone();
                    stopRingTone();
                    txtCallStatus.innerHTML = '<i>Early media started</i>';
                    txtCallStatus_.innerHTML = '<i>Early media started</i>';
                }
                break;
            }

        case 'm_local_hold_ok':
            {
                if (e.session == oSipSessionCall) {
                    if (oSipSessionCall.bTransfering) {
                        oSipSessionCall.bTransfering = false;
                        // this.AVSession.TransferCall(this.transferUri);
                    }
                    //btnHoldResume.innerHTML = '<img src="img/resume.png" style="width: 30px" >';
                    //btnHoldResume.disabled = false;
                    txtCallStatus.innerHTML = '<i>Call placed on hold</i>';
                    txtCallStatus_.innerHTML = '<i>Call placed on hold</i>';
                    oSipSessionCall.bHeld = true;
                }
                break;
            }
        case 'm_local_hold_nok':
            {
                if (e.session == oSipSessionCall) {
                    oSipSessionCall.bTransfering = false;
                    //btnHoldResume.innerHTML = '<span class="icon-pause2 mx-auto"></span>';
                    //btnHoldResume.disabled = false;
                    txtCallStatus.innerHTML = '<i>Failed to place remote party on hold</i>';
                    txtCallStatus_.innerHTML = '<i>Failed to place remote party on hold</i>';
                }
                break;
            }
        case 'm_local_resume_ok':
            {
                if (e.session == oSipSessionCall) {
                    oSipSessionCall.bTransfering = false;
                    //btnHoldResume.innerHTML = '<span class="icon-pause2 mx-auto"></span>';
                    //btnHoldResume.disabled = false;
                    txtCallStatus.innerHTML = '<i>Call taken off hold</i>';
                    txtCallStatus_.innerHTML = '<i>Call taken off hold</i>';
                    oSipSessionCall.bHeld = false;

                    if (SIPml.isWebRtc4AllSupported()) { // IE don't provide stream callback yet
                        uiVideoDisplayEvent(false, true);
                        uiVideoDisplayEvent(true, true);
                    }
                }
                break;
            }
        case 'm_local_resume_nok':
            {
                if (e.session == oSipSessionCall) {
                    oSipSessionCall.bTransfering = false;
                    //btnHoldResume.disabled = false;
                    txtCallStatus.innerHTML = '<i>Failed to unhold call</i>';
                    txtCallStatus_.innerHTML = '<i>Failed to unhold call</i>';
                }
                break;
            }
        case 'm_remote_hold':
            {
                if (e.session == oSipSessionCall) {
                    txtCallStatus.innerHTML = '<i>Placed on hold by remote party</i>';
                    txtCallStatus_.innerHTML = '<i>Placed on hold by remote party</i>';
                }
                break;
            }
        case 'm_remote_resume':
            {
                if (e.session == oSipSessionCall) {
                    txtCallStatus.innerHTML = '<i>Taken off hold by remote party</i>';
                    txtCallStatus_.innerHTML = '<i>Taken off hold by remote party</i>';
                }
                break;
            }
        case 'm_bfcp_info':
            {
                if (e.session == oSipSessionCall) {
                    txtCallStatus.innerHTML = 'BFCP Info: <i>' + e.description + '</i>';
                    txtCallStatus_.innerHTML = 'BFCP Info: <i>' + e.description + '</i>';
                }
                break;
            }

        case 'o_ect_trying':
            {
                if (e.session == oSipSessionCall) {
                    txtCallStatus.innerHTML = '<i>Call transfer in progress...</i>';
                    txtCallStatus_.innerHTML = '<i>Call transfer in progress...</i>';
                }
                break;
            }
        case 'o_ect_accepted':
            {
                if (e.session == oSipSessionCall) {
                    txtCallStatus.innerHTML = '<i>Call transfer accepted</i>';
                    txtCallStatus_.innerHTML = '<i>Call transfer accepted</i>';
                }
                break;
            }
        case 'o_ect_completed':
        case 'i_ect_completed':
            {
                if (e.session == oSipSessionCall) {
                    txtCallStatus.innerHTML = '<i>Call transfer completed</i>';
                    txtCallStatus_.innerHTML = '<i>Call transfer completed</i>';
                    //btnTransfer.disabled = false;
                    if (oSipSessionTransferCall) {
                        oSipSessionCall = oSipSessionTransferCall;
                    }
                    oSipSessionTransferCall = null;
                }
                break;
            }
        case 'o_ect_failed':
        case 'i_ect_failed':
            {
                if (e.session == oSipSessionCall) {
                    txtCallStatus.innerHTML = '<i>Call transfer failed</i>';
                    txtCallStatus_.innerHTML = '<i>Call transfer failed</i>';
                    //btnTransfer.disabled = false;
                }
                break;
            }
        case 'o_ect_notify':
        case 'i_ect_notify':
            {
                if (e.session == oSipSessionCall) {
                    txtCallStatus.innerHTML = "<i>Call Transfer: <b>" + e.getSipResponseCode() + " " + e.description + "</b></i>";
                    txtCallStatus_.innerHTML = "<i>Call Transfer: <b>" + e.getSipResponseCode() + " " + e.description + "</b></i>";
                    if (e.getSipResponseCode() >= 300) {
                        if (oSipSessionCall.bHeld) {
                            oSipSessionCall.resume();
                        }
                        //btnTransfer.disabled = false;
                    } else if (e.getSipResponseCode() == 200) {
                        sipHangUp('i_ect_notify');
                    }
                }
                break;
            }
        case 'i_ect_requested':
            {
                if (e.session == oSipSessionCall) {
                    var s_message = "Do you accept call transfer to [" + e.getTransferDestinationFriendlyName() + "]?";//FIXME
                    if (confirm(s_message)) {
                        txtCallStatus.innerHTML = "<i>Call transfer in progress...</i>";
                        txtCallStatus_.innerHTML = "<i>Call transfer in progress...</i>";
                        oSipSessionCall.acceptTransfer();
                        break;
                    }
                    oSipSessionCall.rejectTransfer();
                }
                break;
            }
    }
}
var mensajeMostrado = false;
var deDondeActual = ""
var alertLLamda = false;
var esDesconectado = false;
var tiempoTotalDesLlamada = 0;
var tiempoTotalDesInicio = 0;

function alertaConexionLlamada() {
    alertLLamda = true;
    if ($('#elertDescone').is(':visible')) {
        if (mensajeMostrado) {
            document.getElementById("elertDescone").style.display = "block";
            contadorRec = 6;
            conteoTiempo2();
        }
    }
    else {
        mensajeMostrado = true;
        document.getElementById("elertDescone").style.display = "block";
        contadorRec = 6;
        conteoTiempo2();
    }

}

function alertaConexionIncio(online, deDonde) {
    if (!alertLLamda) {
        if (online) {
            document.getElementById("elertDescone").style.display = "none";
            mensajeMostrado = false;
            setTimeout("isOnline()", 3000);

            if (esDesconectado) {
                ipcRenderer.send('insertarMovimientoDesconexionInicio', agenteOk.id, tiempoTotalDesInicio)
                esDesconectado = false;
                tiempoTotalDesLlamada = 0
                tiempoTotalDesInicio = 0
            }
        }
        else {
            if ($('#elertDescone').is(':visible')) {
                if (mensajeMostrado) {
                    document.getElementById("elertDescone").style.display = "block";
                    contadorRec = 6;
                    conteoTiempo();
                    esDesconectado = true;
                }
            }
            else {
                esDesconectado = true;
                mensajeMostrado = true;
                document.getElementById("elertDescone").style.display = "block";
                contadorRec = 6;
                conteoTiempo();
            }
        }
    }
}

var contadorRec = 6;
function conteoTiempo() {
    contadorRec--;
    document.getElementById('segDesc').innerHTML = contadorRec;
    if (contadorRec > 1) {
        setTimeout("conteoTiempo()", 1000);
        tiempoTotalDesInicio++;
    }
    if (contadorRec == 1)
        isOnline();
}

function conteoTiempo2() {
    contadorRec--;
    document.getElementById('segDesc').innerHTML = contadorRec;
    if (contadorRec > 1) {
        setTimeout("conteoTiempo2()", 1000);
        tiempoTotalDesLlamada++
    }
    if (contadorRec == 1) {
        const isOnline2 = require('is-online');

        isOnline2().then(online => {
            if (online) {
                ipcRenderer.send('insertarMovimientoDesconexion', agenteOk.id, tiempoTotalDesLlamada)
            }
            else {
                contadorRec = 6;
                conteoTiempo2()
            }
        });
    }
}

const isOnline3 = require('is-online');
function reoconexionDIrecta() {

    contadorRec = 6;
    isOnline3().then(online => {
        if (online) {
            if (alertLLamda) {
                ipcRenderer.send('insertarMovimientoDesconexion', agenteOk.id, tiempoTotalDesLlamada)
            }
            else {
                document.getElementById("elertDescone").style.display = "none";
                mensajeMostrado = false;
                setTimeout("isOnline()", 3000);
                if (esDesconectado) {
                    ipcRenderer.send('insertarMovimientoDesconexionInicio', agenteOk.id, tiempoTotalDesInicio)
                    esDesconectado = false;
                    tiempoTotalDesLlamada = 0
                    tiempoTotalDesInicio = 0
                }
            }
        }
    });
}

ipcRenderer.on('insertarMovimientoDesconexionResult', (event, datos) => {
    ipcRenderer.send('recargarPantalla', "");
})


function recuperarDatosLlamada() {
    var idllamadaConsulta="";
    if (llamadaOk!=undefined){
        idllamadaConsulta=llamadaOk.idLlamada
    }
    var objAgente = {
        ipCRM: urls.ipCRM,
        canalId: obtenerCanal(),
        idLlamada: idllamadaConsulta,
        extension: areaIniciada == "IBD" ? agenteOk.extension : agenteOk.extension,
        telefonoCliente: sRemoteNumbervar,
        idCliente: "0",
        idAgente: agenteOk.id,
        nombreAgente: agenteOk.nombre,
        campanaId: agenteOk.campana,
        idFolio: "0",
        supervisor: agenteOk.supervisor,
        marcacionManulaAct: marcacionManual5,
        marcacionManual4,
        marcacionCallback,
        contactoseleccionado,
        llamadaEjec,
    }
    if(timerTiempoEnLlamada != 0){timerTiempoEnLlamada.parar()}
    if (obtenerCanal() == 1) {
        ipcRenderer.send('consultaridllamivrcrm', objAgente)
    } else {
        ipcRenderer.send('consultaridllamOut', objAgente)
    }

}

function mostrarChats() {
    if (!$('#chats').is(':visible')) {
        $("#chats").show()
        $("#teclado").removeClass("d-flex")
        $("#teclado").removeClass("d-none")
        $("#teclado").addClass("d-none")
        $("#contactosDiv").hide()
        $("#actividadesPendientes").hide()
    } else {
        $("#chats").hide()
    }
}

function finalizarLlamadas(s_description) {   
    enLlamada = false;
    sRemoteNumbervar = "";
    mostrarChats();
    if(timerTiempoEnLlamada != 0){timerTiempoEnLlamada.parar()}
    $("#tiempoEnLlamada").html("00:00:00");
    $("#horaLlamada").html("");
    $("#idLlamada").html("");
    $("#idLlamada_").html("");
    $("#navegacionIvr").html("");
    $("#btnHangUp").hide()
    $("#buscarCliente").hide();
    $("#displayLlamada").hide()
    $("#displayUsuario").show()
    numeroRemoto.innerHTML = "";
    numeroRemoto_.innerHTML = "";
    if (areaIniciada == "IBD") { 
        ipcRenderer.send('consultarFechaHora', { id_: llamadaOk.idLlamada_, id: llamadaOk.idLlamada, telefono: llamadaOk.telefonoCliente, extension: agenteOk.extension, 
            url: urls.ipCRM,  motivoColgar: llamadaOk.motivoColgar })
    } else {
        ipcRenderer.send('consultarFechaHoraO', llamadaOk.idLlamada)
    }
    if (areaIniciada == "OBD") {
        ipcRenderer.send('consultarContactos', agenteOk.id)
        ipcRenderer.send('consultarActCRM', agenteOk.id)
    }
    if ($("#divOpen").hasClass("d-flex")) {
        $("#divOpen").removeClass("d-flex")
    }
    $("#divOpen").hide()
    $("#nombreClienteCall").html("");
    $("#webview").remove()
    $("#divLlamada").addClass("d-flex")
    $("#mydiv").addClass("d-none")
    $("#modulosCont").hide();
    $("#displayTipificacion").hide()
    $("#buscarCliente").hide()
    $("#quitarTipificacion").hide()
    $("#seleccionarCliente").hide();
    $("#cancelarSeleccion").hide();
    $("#webviewTipificacion").remove();
    $(".datoCliente span").html("");
    if (!marcacionManual5) {
        ipcRenderer.send("actualizarContactoO", { estatus: "ATENDIDA", id: llamadaOk.id, idCampana: llamadaOk.btAgenteCmpId })
    }
    $("#teclado_").removeClass("d-flex")
    $("#teclado_").addClass("d-none")
    $("#btnVerTeclado").removeClass("bg-info")
    $("#btnVerTeclado").addClass("bg-secondary")
    $("#imgUser").show()
    $("#editarCliente").hide();
    $("#displayClienteNuevo").hide();
    $("#displayScript").hide()
    $("#displayScript").hide()
    $("#displayCliente").show();
    $("#altadecitaContenedor").hide()
    $("#idCliente").html("");
    $("#nombreCliente").html("");
    $("#idCampana").html("");
    $("#nombreCampana").html("");
    $("#observaciones").val("");
    $("#tipificacionEstatus").html("");
    $("#tipificacionCombo").html("");
    llamadaOk.motivoColgar="";
    setTimeout(() => {
        _s1 = 0;
        _m1 = 0;
    }, 1500);
    if (window.btnBFCP) window.btnBFCP.disabled = true;
    
    
    
    if (s_description = "Call terminating...") {

        txtCallStatus.innerHTML = "<i>Llamada terminada...</i>";
        txtCallStatus_.innerHTML = "<i>Llamada terminada...</i>";
        setTimeout(function () {
            txtCallStatus.innerHTML = "";
            txtCallStatus_.innerHTML = ""
        }, 3000);

    } else {
        txtCallStatus.innerHTML = "<i>" + s_description + "</i>";
        txtCallStatus_.innerHTML = "<i>" + s_description + "</i>";
    }
    if (oNotifICall) {
        oNotifICall.cancel();
        oNotifICall = null;
    }
    setTimeout(function () { if (!oSipSessionCall) txtCallStatus.innerHTML = ''; txtCallStatus_.innerHTML = ''; }, 2500);
}





function finalizarCrm() {  
ipcRenderer.send('finalizarCrm', { id_: llamadaOk.idLlamada_, id: llamadaOk.idLlamada, telefono: llamadaOk.telefonoCliente, extension: agenteOk.extension, 
            url: urls.ipCRM,  motivoColgar: llamadaOk.motivoColgar });
  
}
ipcRenderer.on('finalizarCrmResult', (event, datos) => {
    if(datos == "OK"){
       
    }else{
        
    }
    
  
});

function restablecerAgente()
{
    if (estatus == "EN LLAMADA")
    {
        $("#alertPrincipal").html("<strong>Aviso.</strong> Tiene llamada asignada.");
        $("#alertPrincipal").fadeTo(16000, 500).slideUp(500, function () {
            $("#alertPrincipal").slideUp(16000);
        });
    }
    else
    {
        ipcRenderer.send('restablecerAgente', { campana: agenteOk.campana, canal: areaIniciada,idAgente: usuarioOk.CNUSERID });                   
    }
}

function marcar_out(numero) {

    if (oSipSessionCall) {
        $("#numeroMarcar").val($("#numeroMarcar").val() + numero);
        $("#numeroMarcar_out").val($("#numeroMarcar_out").val() + numero);
        sipSendDTMF(numero)
    } else {
        $("#numeroMarcar").val($("#numeroMarcar").val() + numero);
        $("#numeroMarcar_out").val($("#numeroMarcar_out").val() + numero);
        try { dtmfTone.play(); } catch (e) { }
    }
}

function sipMarcar() {
    //var marcar = {
    //    marcionManual: urls.marcionManual,
    //    agente: agenteOk.id,
    //    extension: areaIniciada == "IBD" ? agenteOk.extension : agenteOk.extension,
    //    folio: "",
    //    telefono: $("#numeroMarcar").val()
    //};
    //ipcRenderer.send('marcacionManual', marcar)
    if (!oSipSessionCall && $("#numeroMarcar_out").val() != '' ) {
        var s_destination = $("#numeroMarcar_out").val();
        let date = new Date();
        ipcRenderer.send('GenerarLlamada', { 
            IdAgente: usuarioOk.CNUSERID, 
            servidor: agenteOk.servidor ,
            telefono: s_destination ,
            extension: areaIniciada == "IBD" ? agenteOk.extension : agenteOk.extension,
            campana: agenteOk.campana,
            idinteraccion:0,
            url: urls.asteriskservlet 
        });
        
    }
}

function clearMarcador_out() {

    $("#numeroMarcar").val("")
    $("#numeroMarcar_out").val("")

    try { dtmfTone.play(); } catch (e) { }
}

function backspace_out() {
    if ($('#numeroMarcar').length) {
        $("#numeroMarcar").val($("#numeroMarcar").val().slice(0, -1))
    }
    if ($('#numeroMarcar_out').length) {
        $("#numeroMarcar_out").val($("#numeroMarcar_out").val().slice(0, -1))
    }
    try { dtmfTone.play(); } catch (e) { }

}

function maxLengthCheck(object)
{
    if (object.value.length > object.maxLength)
      object.value = object.value.slice(0, object.maxLength)
      //console.log(object.value)
}