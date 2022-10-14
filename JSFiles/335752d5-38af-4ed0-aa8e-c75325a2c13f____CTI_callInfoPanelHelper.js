({
    addEventListeners: function(){
        
        sforce.opencti.onClickToDial({listener: this.Click2DialListener.bind(this)});
    },


    Click2DialListener: function(payload){
        //console.log('Click2DialListener: ' + payload.number +' '+ payload.objectType +' '+ payload.recordId +' '+ payload.recordName );
        window.localStorage.setItem('_callType', "C2DOutbound");
        this.cmp.set("v.C2DObjectType", payload.objectType);
        this.cmp.set("v.C2DRecordId", payload.recordId);

        // Fire ClickToDial event to be processed in component
        this.fireCTIinfoEvent("ClickToDial", payload);

    },


    C2DCallback: function (response) {
        if(response.success) {
            //console.log('Click-to-Dial status: '+response.returnValue);
        }else{
            console.error('Click-to-Dial Errors:', response.errors);
        }
    },


    registerHandlers: function(url, username, component){
        try{
            let query = {};
            query[window._agentid] = username;
            var socket = io.connect(url,{ 
                secure: true, 
                rejectUnauthorized: false, 
                query : query
            });
            this.cmp = component;
            socket.on('connect', this.connect.bind(this));
            socket.on('reconnect', this.connect.bind(this));
            socket.on('agentsynchro', this.agentsynchro.bind(this));
            socket.on('getstatus', this.getstatus.bind(this));
            socket.on('agentstatus', this.agentstatus.bind(this));
            socket.on('disconnect', this.disconnect.bind(this));
            socket.on('assignevent', this.assignevent.bind(this));
            socket.on('infocall', this.infocall.bind(this));
            socket.on('heldcall', this.heldcall.bind(this));
            socket.on('retrievedcall', this.retrievedcall.bind(this));

            window._socket = socket;

            this.addLogRecord('DBG', 'SOCKET', '{}', 'Socket created', component);

        }catch(err){
            var message = err.message;
            this.fireCTIinfoEvent("error", message);
            this.addLogRecord('DBG', 'SOCKET', '{}', 'Socket error: '+ message, component);
        }
    },


    // Wrap Call Center event to Lightning event
    fireCTIinfoEvent: function(event, data){
        var eventData = { event: event, data: data };
        var compEvent = this.cmp.getEvent("CTIinfoEvent");
        compEvent.setParams({"eventData" : eventData });
        compEvent.fire();
    },


    // Call Center events handlers
    
    // Socket connected
    connect: function(){
        // Forward event to component
        this.fireCTIinfoEvent("connect", "");
        this.addLogRecord('RECV', 'CONNECT', '{}', '');
    },


    // Socket disconnected
    disconnect: function(msg){
        // Forward event to component
        this.fireCTIinfoEvent("disconnect", msg);
        this.addLogRecord('RECV', 'DISCONNECT', '{}' ,'msg:'+msg);
    },


    // Fired right after connect, msg is full agents list
    agentsynchro: function(msg){
        try{
            var data = JSON.parse(msg);

            this.cmp.set("v.agentsList", data);

            for (const item in data) {     
                const agent = data[item];

                /*if(agent.departmentname == ""){
                console.log(agent.agentID + ','+agent.departmentname+','+ agent.firstname + ','+ agent.lastname + ','+ agent.extension);
                }*/

                // Popoulate agents map
                window._agentsMap.set(agent.agentID, agent);

                // Populate teams set
                // if(agent.departmentname != "" && agent.departmentname != "SALES" && agent.departmentname != "Test SFDC1" && agent.departmentname != "Test SFDC2"){
                    window._teamsSet.add(agent.departmentname);
                // }

                // Select current agent and process
                if(agent.agentID == window._agentid){
                    
                    // Update agent
                    window._agent = agent;

                    this.cmp.set("v.departmentName", agent.departmentname);
                    this.cmp.set("v.agentName", agent.firstname + ' ' + agent.lastname);

                    // Forward agent status update to component
                    this.fireCTIinfoEvent("agentStatusUpdate", agent);
                    this.addLogRecord('RECV', 'AGENTSYNCHRO', JSON.stringify(agent), '');
                }
            }

            // Refresh Teams List
            this.cmp.set("v.teamsList", Array.from(window._teamsSet));

            // Read team selection
            var depName = window.localStorage.getItem('_selectedDepartmentName');
            this.cmp.set("v.selectedDepartmentName", depName);
        
        }catch(err){
            var message = err.message;
            this.fireCTIinfoEvent("error", message);
            this.addLogRecord('DBG', 'SOCKET', '{}', 'agentsynchro error: '+ message);
        }
    },


    // Fired on any agent status update
    agentstatus:  function(msg){
        try{
            var data = JSON.parse(msg);
            
            // Update agents map
            var target = window._agentsMap.get(data.agentID);

            if(target != undefined){
                target.status = data.status;
                target.extension = data.extension;
                target.departmentname = data.departmentname;
                target.department = data.department;

                window._agentsMap.set(data.agentID, target);
            }

            // Update agents list
            var agents = Array.from(window._agentsMap.values());
            this.cmp.set("v.agentsList", agents);
            
            if(data.key == window._agent.key){
                
                window._agent = data;

                // Forward agent status update to component
                this.fireCTIinfoEvent("agentStatusUpdate", data);
                this.addLogRecord('RECV', 'AGENTSTATUS', msg, '');
            }

        }catch(err){
            var message = err.message;
            this.fireCTIinfoEvent("error", message);
            this.addLogRecord('DBG', 'SOCKET', '{}', 'agentstatus error: '+ message);
        }
    },


    getstatus: function(){
        window._socket.emit('getstatus', { });
        this.addLogRecord('EMIT', 'GETSTATUS', '{}', '');
    },


    // Incoming event: Assign call to agent
    assignevent: function(msg) {
        try{
            var data = JSON.parse(msg);

            if (data.id == window._agentid){      
                if(data.channel != 'callback') {
                    this.saveDataForHistory(data, 'assignEvent');
                }

                // Update call state
                window.localStorage.setItem('_callState', "Ringing");

                window._agent = data;

                // Update current call id
                window.localStorage.setItem('_pendingCallID', data.callid);
                window._infocallCount = 0;
                
                var ani = window._agent.currentcall.ani;
                
                if(ani == '0'){
                    ani = 'Hidden';
                }

                // Set IVR data
                var ivr = this.cmp.get("v.contactData");
                if(data.currentcall.contactdata != null && data.currentcall.contactdata.length > 0){

                    data.currentcall.contactdata.forEach(function (item, index) {
                        if(item.key == 'country'){
                            ivr['Country'] = item.value;
                        }

                        if(item.key == 'language'){
                            ivr['Language'] = item.value;
                        }
                    });
                    ivr.Redirected = 'IVR';
                    this.cmp.set("v.contactData", ivr);
                    this.cmp.set("v.showContactData", true);
                }

                // Forward assignevent event to component
                if(data.channel == 'callback'){
                    this.fireCTIinfoEvent("assignevent", {channel : data.channel, ani: data.currentcall.callbackdata.telephonenumber});
                    window.localStorage.setItem('_callBackData', JSON.stringify({callbackId : data.callid, extension : data.extension, callid: '', state : 'created', switch: true}));
                    ivr.Redirected = 'Callback';
                    this.cmp.set("v.contactData", ivr);

                } else {
                    this.fireCTIinfoEvent("assignevent", ani);
                }
                this.addLogRecord('RECV', 'ASSIGNEVENT', msg, '');

            }
        }catch(err){
            var message = err.message;
            this.fireCTIinfoEvent("error", message);
            this.addLogRecord('DBG', 'SOCKET', '{}', 'assignevent error: '+ message);
        }
    },


    infocall: function(data){
        try{
            var msg = JSON.parse(data);
            var debugMsg = '';
            // Process originated calls
            if (msg.action == "originated"){
        
                // Outgoing call originated
                if (this.getOriginatedCallType(msg) == "OUTGOING"){
                    this.saveDataForHistory(msg, 'outbound');

                    window.localStorage.setItem('_pendingCallID', msg.callid);
                    window.localStorage.setItem('_callState', "Ringing");
                    window._infocallCount = 0;

                    // Set IVR data
                    this.setIVRData(msg, 'IVR');

                    // Forward event to component
                    this.fireCTIinfoEvent("infocall", msg);
                    debugMsg = 'OUTGOING';
                    this.addLogRecord('RECV', 'INFOCALL', data, 'Processed Call State: ' + debugMsg);
                }

                // Incoming Internal call originated
                if (this.getOriginatedCallType(msg) == "INTERNAL") {

                    window.localStorage.setItem('_pendingCallID', msg.callid);
                    window.localStorage.setItem('_callState', "Ringing");
                    
                    // Forward event to component
                    this.fireCTIinfoEvent("infocall", msg);
                    debugMsg = 'INTERNAL';
                    this.addLogRecord('RECV', 'INFOCALL', data, 'Processed Call State: ' + debugMsg);
                }

                // Callback originated
                if(this.getOriginatedCallType(msg) == "CALLBACK"){
                    this.saveDataForHistory(msg, 'outbound');
                    window.localStorage.setItem('_pendingCallID', msg.callid);
                    window.localStorage.setItem('_callState', "Ringing");
                    window._infocallCount = 0;

                    // Update callback state info
                    this.updateCallbackInfo(msg.callid, 'originated');

                    // Forward event to component
                    this.fireCTIinfoEvent("infocall", msg);
                    debugMsg = 'CALLBACK';
                    this.addLogRecord('RECV', 'INFOCALL', data, 'Processed Call State: ' + debugMsg);
                }

                // Incoming Consultation call originated
                if(this.getOriginatedCallType(msg) == "CONSULT_IN"){

                    window.localStorage.setItem('_pendingCallID', msg.callid);
                    window.localStorage.setItem('_callState', "CONSULT_IN");
                    this.setRedirectedByInfo(msg.fromparty);

                    // Forward event to component
                    this.fireCTIinfoEvent("infocall", msg);
                    debugMsg = 'CONSULT_IN';
                    this.addLogRecord('RECV', 'INFOCALL', data, 'Processed Call State: ' + debugMsg);
                }

                // Outgoing Consultation call originated
                if(this.getOriginatedCallType(msg) == "CONSULT_OUT"){
                    
                    window.localStorage.setItem('_callState', "CONSULT_OUT");
                    window.localStorage.setItem('_consultTarget', msg.toparty);
                    window.localStorage.setItem('_consultPartyState', "originated");
                    window.localStorage.setItem('_retrieveType', "reconnectcall");

                    if(window.localStorage.getItem('_transferType') == "Direct"){
                        window.setTimeout(function(){ this.transfercall(window._agent.extension); }.bind(this), 4000);
                    }

                    // Forward event to component
                    this.fireCTIinfoEvent("infocall", msg);
                    debugMsg = 'CONSULT_OUT';
                    this.addLogRecord('RECV', 'INFOCALL', data, 'Processed Call State: ' + debugMsg);
                }
            }

            // Filter infocalls by call id
            if (window.localStorage.getItem('_pendingCallID') == msg.callid) {
                window._call = msg;
                debugMsg = '';

                // Process diverted call type
                if (msg.action == 'diverted'){

                    if(msg.ani != window._agent.extension){
                        // Ignore Service numbers starting from 777
                        if(msg.extension.substring(0, 3) == '777'){
                            window.localStorage.setItem('_pendingCallID', "0");
                            window.localStorage.setItem('_callState', "Disconnected");

                            // Forward infocall event to component
                            this.fireCTIinfoEvent("infocall", msg);

                        }
                    }

                    //STCP1-1246 Set Away agent status for diverted call if agent did not picked up
                    if(msg.ani == msg.fromparty && msg.dnis == msg.toparty){
                        if(msg.extension != msg.ani){
                            //STCP1-1274 Set Away status only for incoming consultation call 
                            if( window.localStorage.getItem('_callState') == "CONSULT_IN" ){
                                var status = 3; //Away
                                window._socket.emit('setagent', { key: window._agent.key, routing: status });
                            }
                        }
                    }                    

                    this.updateHistoryData(msg, 'diverted');
                }

                // Process established call types
                if (msg.action=='established') {
                    this.cmp.set("v.disconectedCount", 0);
                    this.updateHistoryData(msg, 'established');
                    
                    // Call type 1 = ContactType_RoutedVoice. Incoming routed external call. Create call task.
                    if(msg.typ == 1 && msg.state == 15){
                        if(window._infocallCount == 0){
                            window._infocallCount++;

                            window.localStorage.setItem('_callState', "Talking");
                            window.localStorage.setItem('_customerPartyState',"established");
                            
                            // Enable Consultation \ Transfer features
                            this.setConsultEnabled(true);

                            // Set IVR data
                            this.setIVRData(msg, 'IVR');
                            
                            var phone = msg.ani;
                            var callid = msg.callid;

                            // Search and create Call Task
                            this.searchForInboundCall(phone, callid);
                        }
                    }

                    // Call type 3 = ContactType_DirectOutgoingVoice. Outbound direct external call. Create call task.
                    if(msg.typ == 3 && msg.state == 15){

                        if(window._infocallCount == 0){
                            window._infocallCount++;
                            
                            window.localStorage.setItem('_callState', "Talking");  
                            window.localStorage.setItem('_customerPartyState',"established");

                            // Enable Consultation \ Transfer features
                            this.setConsultEnabled(true);

                            var phone = msg.dnis;
                            var callid = msg.callid;

                            // Search and create Call Task
                            this.searchForOutboundCall(phone, callid);
                        }
                    }

                    // Call type 4 = ContactType_DirectInternalVoice. Internal call.
                    if(msg.typ == 4 && msg.state == 15){
                        // Disable Consultation \ Transfer features
                        this.setConsultEnabled(false);
                    }

                    // Call type 5 = ContactType_RoutedCallback. Create call task.
                    if(msg.typ == 5 && msg.state == 15){
                        
                        if(window._infocallCount == 0){
                            window._infocallCount++;

                            window.localStorage.setItem('_callState', "Talking");
                            window.localStorage.setItem('_customerPartyState',"established");
                            
                            // Update callback state info
                            this.updateCallbackInfo(msg.callid, 'established');

                            // Disable Consultation \ Transfer features
                            this.setConsultEnabled(true);

                            this.updateHistoryData(msg, 'callback');

                            // Set IVR data
                            this.setIVRData(msg, 'Callback');

                            var phone = msg.dnis;
                            var callid = msg.callid;

                            // Search and create Call Task
                            this.searchForCallback(phone, callid);
                        }
                    }

                    // Established Consultation call
                    if(msg.state == 19){
                        debugMsg = 'Consulting party established: '+msg.extension;
                        window.localStorage.setItem('_consultPartyState', "established");
                        window.localStorage.setItem('_retrieveType', "reconnectcall");
                    }

                    // Forward event to component
                    this.fireCTIinfoEvent("infocall", msg);
                }

                // Process disconnected calls
                if (msg.action=='disconnected') {
                    if(window._agent.status == 4 && window._agent.handlingstate == 7){
                        window.localStorage.setItem('_retrieveType', "unhold");

                        if(msg.extension == window.localStorage.getItem('_consultTarget')){
                            debugMsg = 'Consulting party disconnected: ' + msg.extension;
                            window.localStorage.setItem('_consultPartyState',"disconnected");
                        }else{
                            if(msg.extension == msg.ani){
                                debugMsg = 'Customer party disconnected: ' + msg.extension;
                                window.localStorage.setItem('_customerPartyState',"disconnected");
                            }
                        }
                    }else{
                        // STCP1-1172 Complete callback if call was disconnected
                        let callbackInfo = this.getCallbackInfo();
                        if(callbackInfo != null && msg.callid == callbackInfo.callid){
                            if(callbackInfo.state == 'established'){
                                this.completeCallback(callbackInfo.callbackId, callbackInfo.extension, 2);
                            }
                            
                        }
                        let disconectedCount = this.cmp.get("v.disconectedCount");
                        if(disconectedCount == 0) {
                            this.updateHistoryData(msg, 'disconnected');
                        }
                        disconectedCount++;
                        this.cmp.set("v.disconectedCount", disconectedCount);
                        this.cmp.set("v.establishedCount", 0);

                    }

                    // Forward event to component
                    this.fireCTIinfoEvent("infocall", msg);

                }

                this.addLogRecord( 'RECV', 'INFOCALL', data, 'Processed Call ID ' + msg.callid + ' ' + debugMsg);
            }
        }catch(err){
            var message = err.message;
            this.fireCTIinfoEvent("error", message);
            this.addLogRecord('DBG', 'SOCKET', '{}', 'infocall error: '+ message);
            console.log(err.stack);
        }

    },


    // Incoming event: Fired on Hold Call
    heldcall: function(msg) {
        try{
            var data = JSON.parse(msg);
            if(data.callid == window.localStorage.getItem('_pendingCallID')){
                var debugMsg = "Reason for Hold: "+ window.localStorage.getItem('_holdReason');

                if(window.localStorage.getItem('_holdReason') == "Consult"){
                    window.localStorage.setItem('_callState', "Consulting");
                }else{
                    window.localStorage.setItem('_callState', "Holding");
                }

                // Forward event to component
                this.fireCTIinfoEvent("heldcall", data);
                this.addLogRecord( 'RECV', 'HELDCALL', msg, debugMsg);
            }

        }catch(err){
            var message = err.message;
            this.fireCTIinfoEvent("error", message);
            this.addLogRecord('DBG', 'SOCKET', '{}', 'heldcall error: '+ message);
        }
    },


    // Incoming event: Fired on Retrieve Call
    retrievedcall: function(msg) {
        try{
            var data = JSON.parse(msg);
            if(data.callid == window.localStorage.getItem('_pendingCallID')){
                
                window.localStorage.setItem('_callState', "Talking");
                window.localStorage.setItem('_retrieveType', "reconnectcall");

                // Forward event to component
                this.fireCTIinfoEvent("retrievedcall", data);
                this.addLogRecord( 'RECV', 'RETRIEVEDCALL', msg, '');
            }
        }catch(err){
            var message = err.message;
            this.fireCTIinfoEvent("error", message);
            this.addLogRecord('DBG', 'SOCKET', '{}', 'retrievedcall error: '+ message);
        }
    },


    // Detect originated call type
    getOriginatedCallType: function(msg){
        //console.log('getOriginatedCallType', JSON.parse(JSON.stringify(msg)));
        // Outgoing call originated
        if(msg.typ == 0){
            if (msg.ani == window._agent.extension && msg.extension == window._agent.extension && msg.fromparty == window._agent.extension){
                return "OUTGOING";
            }
        }
        
        // Incoming Internal call originated
        if (msg.dnis == window._agent.extension){
            return "INTERNAL";
        }

        // Detect Consultation call for RoutedVoice
        if(msg.typ == 1){ 
            // Consultation call originated
            if (msg.ani != window._agent.extension && msg.dnis != window._agent.extension && msg.extension != window._agent.extension){
                if (msg.toparty == window._agent.extension){
                    return "CONSULT_IN";
                }

                if (msg.fromparty == window._agent.extension){
                    return "CONSULT_OUT";
                }
            }
        }

        // Detect Consultation call for DirectOutgoingVoice
        if(msg.typ == 3){ 
            
            if(msg.ani == msg.extension && msg.ani == msg.fromparty && msg.ani != window._agent.extension ){
                if (msg.toparty == window._agent.extension){
                    return "CONSULT_IN";
                }
            }

            if(msg.ani == msg.extension && msg.ani == msg.toparty && msg.ani == window._agent.extension){
                if(msg.dnis !== window._agent.extension && msg.fromparty != window._agent.extension){
                    return "CONSULT_IN";
                }

            }

            // Consultation call originated
            if (msg.ani == window._agent.extension && msg.dnis != window._agent.extension && msg.extension == window._agent.extension){
                if (msg.fromparty == window._agent.extension){
                    return "CONSULT_OUT";
                }
            }
        }

        // RoutedCallback originated
        if(msg.typ == 5){
            if(msg.ani == msg.extension && msg.ani == msg.fromparty && msg.ani == window._agent.extension ){
                if(msg.dnis == msg.toparty){
                    return "CALLBACK";
                }else{
                    return "CONSULT_OUT";
                }  
            }

            if(msg.ani == msg.extension && msg.ani == msg.fromparty && msg.ani != window._agent.extension ){
                if(msg.toparty == window._agent.extension){
                    return "CONSULT_IN";
                }
            }
        }

        return "NONE";

    },


    // CALLBACKS

    callback: function(response) {

    },

    isPanelVisibleCallback: function(response) {
        if (response.success) {
           var isVisible = response.returnValue;
           //console.log('isPanelVisible=', isVisible);

           if(isVisible.visible == false){
                sforce.opencti.setSoftphonePanelVisibility({visible: true, callback: function(response){} });
           }
        } else { 
           console.error('isPanelVisibleCallback Errors:', response.errors);
        }
    },


    // UI BUTTON HANDLERS

    // Agent Login button handler
    agentLogin: function() {
        try{
            window._socket.emit('agentlogin', { key: window._agent.key, extension: window._extension });
            this.addLogRecord( 'EMIT', 'AGENTLOGIN', '{}' , 'agentKey: '+ window._agent.key + ', extension:' +window._extension);
        }catch(err){
            var message = err.message;
            this.fireCTIinfoEvent("error", message);
            this.addLogRecord('DBG', 'SOCKET', '{}', 'agentLogin error: '+ message);
        }
    },
    
    
    // Agent Logout button handler
    agentLogout: function() {
        try{
        window._socket.emit('agentlogout', { key: window._agent.key });
        this.addLogRecord( 'EMIT', 'AGENTLOGOUT', '{}', 'agentKey: '+ window._agent.key );
        }catch(err){
            var message = err.message;
            this.fireCTIinfoEvent("error", message);
            this.addLogRecord('DBG', 'SOCKET', '{}', 'agentLogout error: '+ message);
        }
    },
    
    
    // Answer Call button handler
    answerCall: function() {
        window._socket.emit( 'connectcall', { extension: window._agent.extension, id: window.localStorage.getItem('_pendingCallID') } );
        this.addLogRecord( 'EMIT', 'CONNECTCALL','{}', 'callid: '+ window.localStorage.getItem('_pendingCallID'));
    },


    // Place Call button handler
    placeCall: function(phone) {
        window._socket.emit('callnumber', { extension: window._agent.extension, number: phone } );
        this.addLogRecord( 'EMIT', 'CALLNUMBER', '{}', 'extension:' + window._agent.extension + ', phone:' + phone);
        // 000420266108978 - Alex desktop phone 420266108978, 0266108978
        // Filter phone to have numbers only. Excluding spaces and dashes
        // 00420 775 97 61 97 - Alex mobile phone
        // 0040 721 205 296 - Alex Romanian phone
    },
    

    // Hangup Call button handler
    disconnectCall: function() {
        window._socket.emit( 'disconnectcall', { extension: window._agent.extension, id: window.localStorage.getItem('_pendingCallID') } );
        this.addLogRecord( 'EMIT', 'DISCONNECTCALL', '{}', 'callid: '+ window.localStorage.getItem('_pendingCallID'));
    },
    

    // Hold and Retrieve Call button handler. type=1 for Hold, type=0 for Retrieve
    holdCall: function(type) {
        var ext = window._agent.extension;
        var callid = window.localStorage.getItem('_pendingCallID');

        window._socket.emit('hold', { extension: ext, id: callid, type: type });
        this.addLogRecord( 'EMIT', 'HOLDCALL', '{}', 'holdExtention: '+ext+', callId:'+callid+', type:'+type);
    },


    transfercall: function(ext) {
        window._socket.emit('transfercall', { id: window.localStorage.getItem('_pendingCallID'), extension: ext } );

        // Don't receive updates for this call id after call was transfered
        window.localStorage.setItem('_pendingCallID', "0");
        this.addLogRecord( 'EMIT', 'TRANSFERCALL', '{}', 'callid: '+window.localStorage.getItem('_pendingCallID')+', toExtension: '+ext );
    },
      
    
    consultcall: function(ext) {
        window.localStorage.setItem('_holdReason', "Consult");
        window._socket.emit('consultcall', { id: window.localStorage.getItem('_pendingCallID'), extension: window._agent.extension, to: ext } );
        this.addLogRecord( 'EMIT','CONSULTCALL', '{}', 'callid: '+window.localStorage.getItem('_pendingCallID')+', toExtension:'+ext );
    },


    reconnectcall: function() {
        window._socket.emit('reconnectcall', { id: window.localStorage.getItem('_pendingCallID'), extension: window._agent.extension } );
        this.addLogRecord( 'EMIT', 'RECONNECTCALL', '{}' , 'callid: '+window.localStorage.getItem('_pendingCallID'));
    },


    retrievecall: function() {
        var ext = window._agent.extension;
        var callid = window.localStorage.getItem('_pendingCallID');

        window._socket.emit('hold', { extension: ext, id: callid, type: 2 });
        this.addLogRecord( 'EMIT', 'RETRIEVECALL', '{}', 'callid: '+callid+', extension:'+ext);
    },

    // Callback processing methods
    acceptCallback: function(cbid, extention) {
        window._socket.emit('acceptcallback', { id: cbid, extention: extention });
        this.addLogRecord( 'EMIT', 'ACCEPTCALLBACK', '{}', 'cbid: '+cbid+', extension:'+extention);
    },


    completeCallback: function(cbid, extention, reason) {
        window._socket.emit('completecallback', { id: cbid, extention: extention, reason: reason });
        // Update callback state info
        let callid = this.getCallbackInfo().callid;
        this.updateCallbackInfo(callid,'submitted');
        this.cmp.find("submitCallbackButton").set("v.disabled", true);
        this.addLogRecord( 'EMIT', 'COMPLETECALLBACK', '{}', 'cbid: '+cbid+', extension:'+extention+', reason:'+reason);
    },

    
    uncompleteCallback: function(cbid, extention, reason, interval) {
        console.log('uncompletecallback '+ cbid + ' ' + extention + ' ' + reason + ' ' + interval);
        window._socket.emit('uncompletecallback', { id: cbid, extention: extention, reason: reason, retryinterval: interval });
        // Update callback state info
        let callid = this.getCallbackInfo().callid;
        this.updateCallbackInfo(callid,'submitted');
        this.cmp.find("submitCallbackButton").set("v.disabled", true);
        this.addLogRecord( 'EMIT', 'UNCOMPLETECALLBACK', '{}', 'cbid: '+cbid+', extension:'+extention+', reason:'+reason+', interval:'+interval);
    },
    

    // Set Agent Status button handler
    setAgentStatus: function(cmp, status) {
    
        window._socket.emit('setagent', { key: window._agent.key, routing: status });

        if(window._agent.handlingstate == 10){
            // set 1-3 sec timeout before call to endwrapup
            window.setTimeout(function(){ 
                window._socket.emit('endwrapup', { key: window._agent.key });  
                this.addLogRecord( 'EMIT', 'ENDWRAPUP', '{}' , 'key: '+ window._agent.key);
            }.bind(this), 2000);
        }
        
        this.addLogRecord( 'EMIT', 'SETAGENT', '{}', 'key: '+ window._agent.key+', status: '+status);
    },


    // Refresh agents
    syncAgents: function(){
        window._socket.emit('getstatus', { });
        this.addLogRecord( 'EMIT', 'GETSTATUS', '{}', '');
    },


    // COMPONENT UI UTILS

    expandCallingSection: function(cmp,event,helper){
        var sectionDiv = cmp.find("callingLineOneSection");
        var isClosed = $A.util.hasClass(sectionDiv, "slds-is-close");
        if(isClosed) {
            $A.util.removeClass(sectionDiv, "slds-is-close");
            $A.util.addClass(sectionDiv, "slds-is-open");
        }
    },


    toggleConsultingSection: function(cmp,action){
        var sectionDiv = cmp.find("consultingAgentSection");
        var isClosed = $A.util.hasClass(sectionDiv, "slds-is-close");
        
        if(action){
            if(isClosed) {
                $A.util.removeClass(sectionDiv, "slds-is-close");
                $A.util.addClass(sectionDiv, "slds-is-open");
            }
        }
        else {
            if(!isClosed) {
                $A.util.removeClass(sectionDiv, "slds-is-open");
                $A.util.addClass(sectionDiv, "slds-is-close");
            }
        }

    },


    toggleConsultButton: function(component, state){
        component.set("v.consultExtButtonDisabled", !state);
    },


    toggleRetrieveButton: function(component, state){
        component.set("v.retrieveExtButtonDisabled", !state);
    },


    toggleTransferButton: function(component, state){
        component.set("v.transferExtButtonDisabled", !state);
    },


    getConsultEnabled: function(){
        var state = window.localStorage.getItem('_consultEnabled');
        return state;
    },


    setConsultEnabled: function(state){
        window.localStorage.setItem('_consultEnabled', state);
    },


    getCustomerInfoByPhone: function(component, phoneNumber){
        if(phoneNumber != "0"){

            var action = component.get("c.searchAccountAndContacts");
            action.setParams({
                phoneNumber: phoneNumber
            });
            
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var returnValue = response.getReturnValue();
                    var accountList = returnValue.Account;
                    var contactList = returnValue.Contact;
                    var accountName = this.setCustomerInfo(component, accountList, "v.accountName");
                    var contactName = this.setCustomerInfo(component, contactList, "v.contactName");
                    if(accountName != 'Unknown' && accountName != 'Multiple'){
                        component.set('v.relatedAccountId', accountList[0].Id);
                        this.linkHistoryItemToAccount(accountList[0].Id, window.localStorage.getItem('_pendingCallID'));
                    }
                } else {
                    //console.log('searchAccountAndContacts Error', response.getError());
                    this.addLogRecord('DBG', 'ERROR', '{}', 'getCustomerInfoByPhone.c.searchAccountAndContacts Error' + response.getError() );
                }
            })
            $A.enqueueAction(action);

        } else {

            component.set("v.accountName", "Unknown");
            component.set("v.contactName", "Unknown");

        }
    },


    getCustomerInfoByType: function(component, phoneNumber, objectType, recordId){
        if(phoneNumber != "0"){

            var action = component.get("c.getRelatedAccountsAndContacts");
            action.setParams({
                objectType: objectType,
                recordId: recordId
            });
            
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var returnValue = response.getReturnValue();
                    var accountList = returnValue.Account;
                    var contactList = returnValue.Contact;
                    var accountName = this.setCustomerInfo(component, accountList, "v.accountName");
                    var contactName = this.setCustomerInfo(component, contactList, "v.contactName");
                    if(accountName != 'Unknown' && accountName != 'Multiple'){
                        component.set('v.relatedAccountId', accountList[0].Id);
                        this.linkHistoryItemToAccount(window.localStorage.getItem('_pendingCallID'), accountList[0].Id)
                    }
                } else {
                    //console.log('getRelatedAccountsAndContacts Error', response.getError());
                    this.addLogRecord('DBG', 'ERROR', '{}', 'getCustomerInfoByType.c.getRelatedAccountsAndContacts Error' + response.getError() );
                }
            })
            $A.enqueueAction(action);

        } else {

            component.set("v.accountName", "Unknown");
            component.set("v.contactName", "Unknown");

        }
    },


    setCustomerInfo: function(component, itemList, attributeName){
        //console.log('setCustomerInfo: ', itemList);
        var itemName;
        if(itemList && itemList.length == 1){
            itemName = itemList[0].Name;
        } else if (!itemList || itemList.length < 1){
            itemName = 'Unknown';
        } else {
            itemName = 'Multiple';
        }
        component.set(attributeName, itemName);
        return itemName;
    },


    findCallTask: function(component, phoneNumber){
        var action = component.get("c.getTasksByPhone");
        action.setParams({
            phoneNumber: phoneNumber
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnValue = response.getReturnValue();
                if(returnValue.length == 1){
                    if(returnValue[0].Account__c){
                        component.set('v.accountName', returnValue[0].Account__r.Name);
                    }
                } else if(returnValue.length > 1){
                    component.set('v.accountName', 'Multiple');
                }
            } else {
                console.log('Error', response.getError());
            }
        })
        $A.enqueueAction(action);
    },


    formatPhoneNumber: function(number){
        return number.replace(/\D/g,'');
    },


    validateExtension: function(number){
        return number.replace(/\D/g,'');
    },


    saveDataForHistory: function(eventData, eventType) {
        var dataToSave = this.prepareDataToSave(eventData, eventType);
        
        var action = this.cmp.get("c.saveEventData");
        action.setParams({
            eventData : dataToSave
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {

            }
            else {
                console.log('ERROR', response.getError());
            }
        })
        $A.enqueueAction(action);
    },


    prepareDataToSave: function(eventData, eventType) {
        var preparedData = {
            eventType : eventType,
            callId : eventData.callid,
            extension : eventData.extension
        };
        
        if(eventType === 'assignEvent') {
            preparedData.time = eventData.currentcall.timefrom;
            preparedData.phoneNumber = eventData.currentcall.ani;
            preparedData.state = eventData.currentcall.state;
            preparedData.status = eventData.currentcall.typ;
            preparedData.action = eventData.currentcall.action;
            preparedData.callType = 'Inbound';
        } else if(eventType === 'outbound') {
            preparedData.time = eventData.timefrom;
            preparedData.phoneNumber = eventData.dnis;
            preparedData.state = eventData.state;
            preparedData.status = eventData.typ;
            preparedData.action = eventData.action;
            preparedData.callType = 'Outbound';
        }
        if(preparedData.time == "0001-01-01T00:00:00"){
            preparedData.time = new Date(Date.now());
        }
        var accountId = this.cmp.get("v.relatedAccountId");
        if(accountId && accountId != ''){
            preparedData.accountId = accountId;
        }
        return preparedData;
    },


    updateHistoryData: function(eventData, eventType) {
        var dataToUpdate = this.prepareDataToUpdate(eventData, eventType);
        var action = this.cmp.get("c.updateEventData");
        action.setParams({
            eventData : dataToUpdate
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {

            }
            else {
                console.log('ERROR', response.getError());
            }
        })
        $A.enqueueAction(action);
        if(dataToUpdate['endTime']) {
            this.saveDurationCallInTask(dataToUpdate);
        }
    },


    prepareDataToUpdate: function(eventData, eventType) {
        var preparedData = {
            callId: eventData.callid,
            action: eventData.action,
            eventType: eventType
        };
        if(eventType == 'established') {
            preparedData.startTime = eventData.timefrom;
        } 
        else if(eventType == 'disconnected') {
            preparedData.endTime = eventData.timefrom;
        } 
        return preparedData;
    },


    linkHistoryItemToAccount : function (accId, callid) {
        var action = this.cmp.get("c.linkHistoryItemToAccount");
        action.setParams({
            accountId : accId,
            callId : callid
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //console.log('===LINKED!!!');
            }
            else{
                console.log('===LINK ERROR==');
            }
        })
        $A.enqueueAction(action);
    },


    // Update UI elements for agent status updates
    updateAgentState: function(cmp, agentState){
            
            // Set component variables
            cmp.set("v.state", agentState.state);
            cmp.set("v.agentStatus", agentState.agentStatus);

            // Set Login button state
            var login = cmp.find("powerButton");

            if(agentState.connected){
                login.set("v.disabled", false);
            }else{
                login.set("v.disabled", true);
            }

            if(agentState.loginState){
                cmp.set('v.loginButtonName', 'Logoff');
            }else{
                cmp.set('v.loginButtonName', 'Login');

            }

            // Update status selector state
            if(!agentState.manualChange){
                
                var item = cmp.find("statAvailableSpan");
                $A.util.addClass(item, 'inactive');
                item = cmp.find("statBusySpan");
                $A.util.addClass(item, 'inactive');
                item = cmp.find("statAwaySpan");
                $A.util.addClass(item, 'inactive');
                
            }else{
                
                var item = cmp.find("statAvailableSpan");
                $A.util.removeClass(item, 'inactive');
                item = cmp.find("statBusySpan");
                $A.util.removeClass(item, 'inactive');
                item = cmp.find("statAwaySpan");
                $A.util.removeClass(item, 'inactive');
            }

            // Update status avatar
            cmp.set("v.statusAvatar", agentState.icon);
    },


    // Update Click to Dial feature
    updateC2DState: function(cmp, C2DState){
        if(C2DState){
            cmp.set('v.isC2DEnabled', true);
                sforce.opencti.enableClickToDial({callback: this.C2DCallback});
            }else{
                sforce.opencti.disableClickToDial({callback: this.C2DCallback});
                cmp.set('v.isC2DEnabled', false);
        }
    },


    updateCallControls: function(cmp, callControlsState){
        // Set Answer-Call button state
        var ac_btn = cmp.find("answerCallButton");
        ac_btn.set("v.disabled", !callControlsState.answerButton);
        if(callControlsState.answerButton){
            ac_btn.set("v.label", callControlsState.answerButtonLabel);
        }

        // Set Hold button state
        var holdButton = cmp.find("holdCallButton");
        holdButton.set("v.disabled", !callControlsState.holdButton);
        if(callControlsState.holdButton){
            holdButton.set("v.label", callControlsState.holdButtonLabel);
        }
        

        // Set HangUp button state
        cmp.find("hangupCallButton").set("v.disabled", !callControlsState.hangupButton);

        // Set Dial Pad state
        cmp.set("v.dialPadDisabled", !callControlsState.dialPad);
    },


    toggleAnswerCallButton: function(component, state, label){
        component.set("v.callButtonDisabled", !state);
        if(state){
            component.set("v.callButtonLabel", label);
        }
        

    },


    toggleHoldButton: function(component, state, label){
        component.set("v.holdButtonDisabled", !state);
        if(state){
            component.set("v.holdButtonLabel", label);
        }
    },


    toggleHangupButton: function(component, state){
        component.set("v.hangupButtonDisabled", !state);
    },


    toggleDialPad: function(component, state){
        component.set("v.dialPadDisabled", !state);
    },


    clearDialPadEx: function(component){
        component.set("v.extension", '');
    },


    // Update Team Status dial pad and buttons states
    updateTeamStatusControls: function(cmp, tsControlsState){
        // Update Consulting Agent info section
        this.toggleConsultingSection(cmp, tsControlsState.showAgentInfo);
                
    },


    updateRetrieveControl: function(component, state){
        component.set("v.retrieveExtButtonDisabled", !state);
    },


    saveAgentState: function(agent){
        window.localStorage.setItem('_agentStatus', agent.status);
        window.localStorage.setItem('_agentHandlingState', agent.handlingstate);
        console.log('saveAgentState', agent);
    },


    setIVRData: function(msg, redirectedBy){
        var ivr = this.cmp.get("v.contactData");
        if(msg.contactdata != null && msg.contactdata.length > 0){
            msg.contactdata.forEach(function (item, index) {
                if(item.key == 'country'){
                    ivr['Country'] = item.value;
                }

                if(item.key == 'language'){
                    ivr['Language'] = item.value;
                }
            });
            ivr.Redirected = redirectedBy;
            this.cmp.set("v.contactData", ivr);
            this.cmp.set("v.showContactData", true);
        }
    },


    clearCallerInfo: function(cmp){
        cmp.set("v.phone", "- - - - - - - - -");
        cmp.set("v.outboundPhone", "");
        cmp.set("v.accountName", "");
        cmp.set("v.relatedAccountId", "");
        cmp.set("v.contactName", "");
        cmp.set("v.showContactData", false);
    },


    clearConsultationInfo: function(cmp){
        cmp.set("v.consultAgentName", "");
        cmp.set("v.extension", "");
        cmp.set("v.selectedAgentId", "0");
        
    },


    searchForInboundCall: function(phone, callid){
        // Dont search if number is Hidden
        if(phone != "0"){
            var actionSearch = this.cmp.get("c.searchAccountAndContacts");
            actionSearch.setParams({
                phoneNumber: phone
            });

            actionSearch.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    //console.log('Search result, Accounts='+ result.Account.length+' Contacts='+result.Contact.length);
                    this.addLogRecord('DBG', 'RESULT', '{}', 'searchForInboundCallc.searchAccountAndContacts, Accounts='+ result.Account.length+' Contacts='+result.Contact.length );

                    if(result.Account.length > 1 || result.Contact.length > 1){
                        sforce.opencti.screenPop({
                            type: sforce.opencti.SCREENPOP_TYPE.URL, 
                            params: { url: '/apex/CTI_linkCallTask?phone='+phone+'&callid='+callid }
                        });
                    }else{
                        var accId = null;
                        var conId = null;

                        if(result.Account.length == 1){
                            accId = result.Account[0].Id;
                            this.linkHistoryItemToAccount(accId, callid);
                        }

                        if(result.Contact.length == 1){
                            conId = result.Contact[0].Id;
                        }

                        //createNewTask(phone, callid, accId, conId);
                        var actionCreateNewTask = this.cmp.get("c.createNewTask");
                            actionCreateNewTask.setParams({
                                phoneNumber: phone,
                                callID: callid,
                                AccountId: accId,
                                ContactId: conId
                            });

                        actionCreateNewTask.setCallback(this, function(response) {
                            var state = response.getState();
                            if (state === "SUCCESS") {
                                var taskId = response.getReturnValue();
                                window._callTaskID = taskId;
                                    
                                // Fire callTaskCreated event
                                this.fireCTIinfoEvent("callTaskCreated", taskId);
                                //console.log('Created Task ID', taskId);
                                this.addLogRecord('DBG', 'RESULT', '{}', 'Created Task ID: '+ taskId );
                                }
                                else{
                                    //console.log('error', response.getError());
                                    this.addLogRecord('DBG', 'ERROR', '{}', 'actionCreateNewTask error: '+ response.getError() );
                                }
                            });
                        $A.enqueueAction(actionCreateNewTask);
                    }
                    
                }
                else{
                    //console.log('Search error', response.getError());
                    this.addLogRecord('DBG', 'ERROR', '{}', 'actionSearch error: '+ response.getError() );
                }
            });
            $A.enqueueAction(actionSearch);

        }else{
            // Create task with blank Account and Contact for Hidden number
            var actionCreateNewTask = this.cmp.get("c.createNewTask");
            actionCreateNewTask.setParams({
                phoneNumber: phone,
                callID: callid,
                AccountId: null,
                ContactId: null
            });

            actionCreateNewTask.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var taskId = response.getReturnValue();
                    window._callTaskID = taskId;
                        
                    // Fire callTaskCreated event
                    this.fireCTIinfoEvent("callTaskCreated", taskId);
                    //console.log('Created Task ID', taskId);
                    this.addLogRecord('DBG', 'RESULT', '{}', 'Created Task ID: '+ taskId );
                    }
                    else{
                        //console.log('error', response.getError());
                        this.addLogRecord('DBG', 'ERROR', '{}', 'actionCreateNewTask error: '+ response.getError() );
                    }
                });
            $A.enqueueAction(actionCreateNewTask);

        }

    },//<<searchForInboundCall


    searchForOutboundCall: function(phone, callid){
        var callType = window.localStorage.getItem('_callType');

        // For Click-To-Dial initiated outbound call
        if(callType == "C2DOutbound"){
            var objType = this.cmp.get("v.C2DObjectType");
            var recId = this.cmp.get("v.C2DRecordId");

            // Create Call Task
            var actionCreateC2DTask = this.cmp.get("c.createC2DTask");
            actionCreateC2DTask.setParams({
                phone: phone,
                callId: callid,
                objectType: objType,
                recordId: recId
            });

            actionCreateC2DTask.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var taskId = response.getReturnValue();
                    window._callTaskID = taskId;
                        
                    // Fire callTaskCreated event
                    this.fireCTIinfoEvent("callTaskCreated", taskId);
                    //console.log('Created Task ID', taskId);
                    this.addLogRecord('DBG', 'RESULT', '{}', 'Created Task ID'+ taskId );
                    }
                    else{
                        //console.log('error', response.getError());
                        this.addLogRecord('DBG', 'ERROR', '{}', 'actionCreateC2DTask error: '+ response.getError() );
                    }
            });

            $A.enqueueAction(actionCreateC2DTask);

        }

        // For Dial Pad initiated outbound external call
        if(callType == "DialPadOutbound"){
            // Dont search if number is Hidden
            if(phone != "0"){

                var actionSearch = this.cmp.get("c.searchAccountAndContacts");
                actionSearch.setParams({
                    phoneNumber: phone
                });

                actionSearch.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var result = response.getReturnValue();
                        //console.log('Search result, Accounts='+ result.Account.length+' Contacts='+result.Contact.length);
                        this.addLogRecord('DBG', 'RESULT', '{}', 'actionSearch result, Accounts='+ result.Account.length+' Contacts='+result.Contact.length );

                        if(result.Account.length > 1 || result.Contact.length > 1){
                            sforce.opencti.screenPop({
                                type: sforce.opencti.SCREENPOP_TYPE.URL, 
                                params: { url: '/apex/CTI_linkCallTask?phone='+phone+'&callid='+callid }
                            });
                        }else{
                            var accId = null;
                            var conId = null;

                            if(result.Account.length == 1){
                                accId = result.Account[0].Id;
                                this.linkHistoryItemToAccount(accId, callid);
                            }

                            if(result.Contact.length == 1){
                                conId = result.Contact[0].Id;
                            }

                            //createNewTask(phone, callid, accId, conId);
                            var actionCreateNewTask = this.cmp.get("c.createNewTask");
                            actionCreateNewTask.setParams({
                                    phoneNumber: phone,
                                    callID: callid,
                                    AccountId: accId,
                                    ContactId: conId
                                });

                            actionCreateNewTask.setCallback(this, function(response) {
                                var state = response.getState();
                                if (state === "SUCCESS") {
                                    var taskId = response.getReturnValue();
                                    window._callTaskID = taskId;
                                        
                                    // Fire callTaskCreated event
                                    this.fireCTIinfoEvent("callTaskCreated", taskId);
                                    //console.log('Created Task ID', taskId);
                                    this.addLogRecord('DBG', 'RESULT', '{}', 'Created Task ID'+ taskId );
                                    }
                                    else{
                                        //console.log('error', response.getError());
                                        this.addLogRecord('DBG', 'ERROR', '{}', 'actionCreateNewTask error'+ response.getError() );
                                    }
                                });
                            $A.enqueueAction(actionCreateNewTask);
                        }
                        
                    }
                    else{
                        //console.log('Search error', response.getError());
                        this.addLogRecord('DBG', 'ERROR', '{}', 'actionSearch error' + response.getError() );
                    }
                });
                $A.enqueueAction(actionSearch);

            }
        }
    },//<<<searchForOutboundCall


    searchForCallback: function(phone, callid){
        // Dont search if number is Hidden
        if(phone != "0"){

            var actionSearch = this.cmp.get("c.searchAccountAndContacts");
                actionSearch.setParams({
                phoneNumber: phone
            });

            actionSearch.setCallback(this, function(response) {
                var state = response.getState();
                    if (state === "SUCCESS") {
                        var result = response.getReturnValue();
                        //console.log('Search result, Accounts='+ result.Account.length+' Contacts='+result.Contact.length);
                        this.addLogRecord('DBG', 'RESULT', '{}', 'actionSearch result, Accounts='+ result.Account.length+' Contacts='+result.Contact.length );

                        if(result.Account.length > 1 || result.Contact.length > 1){
                            sforce.opencti.screenPop({
                                type: sforce.opencti.SCREENPOP_TYPE.URL, 
                                params: { url: '/apex/CTI_linkCallTask?phone='+phone+'&callid='+callid }
                                });
                        }else{
                            var accId = null;
                            var conId = null;

                            if(result.Account.length == 1){
                                accId = result.Account[0].Id;
                                this.linkHistoryItemToAccount(accId, callid);
                            }

                            if(result.Contact.length == 1){
                                conId = result.Contact[0].Id;
                            }

                            //createNewTask(phone, callid, accId, conId);
                            var actionCreateNewTask = this.cmp.get("c.createNewTask");
                                actionCreateNewTask.setParams({
                                                phoneNumber: phone,
                                                callID: callid,
                                                AccountId: accId,
                                                ContactId: conId
                                });

                            actionCreateNewTask.setCallback(this, function(response) {
                                            var state = response.getState();
                                            if (state === "SUCCESS") {
                                                var taskId = response.getReturnValue();
                                                window._callTaskID = taskId;
                                                    
                                                // Fire callTaskCreated event
                                                var eventData = { event: "callTaskCreated", data: taskId };
                                                var compEvent = this.cmp.getEvent("CTIinfoEvent");
                                                compEvent.setParams({"eventData" : eventData });
                                                compEvent.fire();
                                                    
                                                //console.log('Created Task ID', taskId);
                                                this.addLogRecord('DBG', 'RESULT', '{}', 'Created Task ID'+ taskId );
                                                }
                                                else{
                                                    //console.log('error', response.getError());
                                                    this.addLogRecord('DBG', 'ERROR', '{}', 'actionCreateNewTask error'+ response.getError() );
                                                }
                                            });
                            $A.enqueueAction(actionCreateNewTask);
                        }
                                    
                    }else{
                        //console.log('Search error', response.getError());
                        this.addLogRecord('DBG', 'ERROR', '{}', 'actionSearch error' + response.getError() );
                    }
            });
            $A.enqueueAction(actionSearch);

        }
    },


    setRedirectedByInfo : function(extension) {
        let component = this.cmp;
        let agents = Array.from(window._agentsMap.values());
        let redirectedByAgent = agents.filter((agent)=>{
            return agent.currentcall.extension == extension;
        });
        if(redirectedByAgent && redirectedByAgent.length) {
            this.setIVRData(redirectedByAgent[0].currentcall, redirectedByAgent[0].firstname + ' ' + redirectedByAgent[0].lastname);
        }
    },


    addLogRecord: function(type, method, paramsJson, message, cmp){
        if(!cmp) {
            cmp = this.cmp;
        }
        var timestamp, logRecord;

        if(cmp.get("v.ShowLog") == 'true'){
            timestamp = this.getDateTime();
            logRecord = timestamp +',' + type +','+ method +','+ paramsJson +','+ message;
            console.log(timestamp+'|' +type +'|'+ method +'|' + message, JSON.parse(paramsJson));
        }
            
        if(cmp.get("v.SaveLog") == 'true'){
            timestamp = this.getDateTime();
            logRecord = timestamp +',' + type +','+ method +','+ paramsJson +','+ message;
            var logs = cmp.get("v.Log");
            if(logs.length < 10){
                logs.push(logRecord);
                cmp.set("v.Log", logs);
                    
            }else{
                var actionLog = cmp.get("c.writeDebugLog");
                actionLog.setParams({
                    logsList: JSON.parse(JSON.stringify(logs))
                });
                actionLog.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        console.log('SAVING LOGS..');
                    }else{
                        console.log('Error saving logs', response.getError());
                    }
                });
                $A.enqueueAction(actionLog);
                logs.length = 0;
                logs.push(logRecord);
                cmp.set("v.Log", logs);
                    
            }
        }
        
    },

    getDateTime: function(){
        return Date.now();
    },

    isMinimized: function(){
        if(document.hidden !== 'undefined'){
            return document.hidden;
        }

        /*if(document.msHidden !== 'undefined'){
            return document.hidden;
        }

        if(document.webkitHidden !== 'undefined'){
            return document.hidden;
        }*/

    },


    getUrlParameters : function(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    },


    popUpCallingTab : function(){
        var origin = this.getUrlParameters('sfdcIframeOrigin');
        window.open(origin+"/apex/UnifyCallNotification", "_blank");
    },
    

    updateCallbackInfo : function(callid,state){
        let callbackData = JSON.parse(window.localStorage.getItem('_callBackData'));
        callbackData.callid = callid;
        callbackData.state = state;
        if(state == 'established' || state == 'submitted'){
            callbackData.switch = false;
        }
        window.localStorage.setItem('_callBackData', JSON.stringify(callbackData));
    },


    getCallbackInfo : function(){
        return JSON.parse(window.localStorage.getItem('_callBackData'));
    },


    saveDurationCallInTask : function(dataToUpdate) {
        let taskId = window._callTaskID;
        var saveCallDuration = this.cmp.get("c.saveCallDuration");
        saveCallDuration.setParams({
            taskId : taskId,
            eventData : dataToUpdate
        });
        saveCallDuration.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
            }
            else {
                console.log('ERROR', response.getError());
            }
        })
        $A.enqueueAction(saveCallDuration);
    }

})