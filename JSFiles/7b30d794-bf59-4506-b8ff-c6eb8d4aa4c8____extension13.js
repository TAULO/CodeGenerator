//https://lefds.github.io/extensions/extension13.js
//http://savaka2.github.io/scratch-extensions-directory/
//https://github.com/LLK/scratchx/wiki
//https://mryslab.github.io/s2-pi/
//Using: https://www.eclipse.org/paho/downloads.php
// More sources helping
//   - https://pt.slideshare.net/DarrenAdkinson/understanding-scratchx-extensions-with-javascript
// Tested with: http://www.hivemq.com/demos/websocket-client/ 
//  IP: 192.168.100.100
//  Port: 9001
//  ClientID: LightingServer
//
//  Lighting Server														              Scratcher
//     =>  /SACN/CameoFXBar/29CHMODE/Ready
//
//															<= /SACN/CameoFXBar/29CHMODE/Ready/Derby1
//
//    (When all control sets are requested by scratchers)
//     =>  /SACN/CameoFXBar/29CHMODE/AcceptControl
//                                                             
//

// Nota:Na extensão 
//    https://khanning.github.io/scratch-isstracker-extension/iss_extension.js
// usam um método que corre uma função de x em x milisegundos
// updateISSLocation();
//  var poller = setInterval(updateISSLocation, 2000);
// e no shutdow desligam a função




(function(ext) {
    // TODO: public repo + documentation + samples
    // GH pages	

	//Enable WebSockets
	ws: true

	//Several global variables important to track the extension status

	
	//29CHMODE Channel:Value Map initialization
	const CameoCH29ModeChannels_FIRST_CHANNEL = 1;
	const CameoCH29ModeChannels_LAST_CHANNEL = 29;
	var CameoCH29ModeChannels = new Map([[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],
										[11,0],[12,0],[13,0],[14,0],[15,0],[16,0],[17,0],[18,0],[19,0],[20,0],
										[21,0],[22,0],[23,0],[24,0],[25,0],[26,0],[27,0],[28,0],[29,0]]);
										
	var CameoCH29ModeChannelsString = "";
	
	
	//Extension Status progress (reported over the green exttension led on the Scratch GUI)
	//  0/6: Fatal error (used to stop extension execution)
	//  1/6: SCAN DMX Extension being loaded
	//	2/6: MQTT: API Sucessfully loaded.
	//  3/6: MQTT: connection established & alive
	//  4/6: Lighting Server: on-line & waiting scratch clients
	//  5/6: Lighting Server: on-line, accepted our control request & waiting more scratchers
	//  6/6: Lighting Server: on-line, accepting our control requests
	
	const NO_STATUS = -1;
	const FATAL_ERROR_STATUS = 0;
	const EXTENSION_LOADING_STATUS = 1;
	const MQTT_API_LOADED_STATUS = 2;
	const MQTT_CONNECTED_STATUS = 3;
	const LIGHTING_SERVER_ONLINE_STATUS = 4;
	const LIGHTING_SERVER_CONTROL_REQUESTED_STATUS = 5;
	const LIGHTING_SERVER_ONCONTROL_STATUS = 6;
	
	
	var ExtensionStatusValue = {
		0:0,
		1:2,
		2:2,
		3:2,
		4:2,
		5:2,
		6:2,
	}
		
	//Verbose status descrition
	var ExtensionStatusReport = {
		0:"Erro fatal (a extensão vai parar)!",
		1:"A nossa extensão para seres DJ foi bem carregada.",
		2:"A extensão para falar com o porteiro da discoteca foi bem carregada.",
		3:"O porteiro deixou-te entrar.",
		4:"Estamos a aguardar pela equipa de DJs ...",
		5:"Bem vindo à equipa de DJs. Vamos esperar pelos teus colegas ...",
		6:"A festa vai começar! Vai dando ordens às luzes para animar a discoteca."
	};


	//Called by scratch two times per second	
	//Value	Color	Meaning
	//0		red		error
	//1		yellow	not ready
	//2		green	ready
	//=> IF a 0 or 1 is returned the Scratch simply stops the extension at all!
	//The _getStatus functions is immediattly and periodically called.
	//We can use a global message and variable to flag important events
	var Current_Extension_Status = EXTENSION_LOADING_STATUS;
	
	//Used to append more detailed information (help on debugging ...)
	var Detailed_Extension_Status_Report = "";
	
	//Used by the hat block that can keep the programmer informed about the extension status evolution
	var Previous_ExtensionStatus = NO_STATUS;
	var Previous_Detailed_Extension_Status_Report = "";
	
	
	ext._getStatus = function() {
		//console.log("get status:<" + ExtensionStatusValue[Current_Extension_Status] + ">:" + "<" + ExtensionStatusReport[Current_Extension_Status] + ">:");
		return { status: ExtensionStatusValue[Current_Extension_Status], msg: ExtensionStatusReport[Current_Extension_Status] + "["+ Detailed_Extension_Status_Report  +"]"};
	};


	Update_CameoCH29ModeChannelsString = function () {
		console.log("Update_CameoCH29ModeChannelsString");
		CameoCH29ModeChannelsString = "";
		function build_channel_string(value, key, map) {				
		  CameoCH29ModeChannelsString = CameoCH29ModeChannelsString + key + ":" + value + " ";
		}
		CameoCH29ModeChannels.forEach(build_channel_string);
	}

	// ======================== MQTT Broker stuff =======================================

	//MQTT needs that every session is identified by a client ID. I will use a random mumber to avoid collisions
	//When one client attempts to connect to the broker using the same ID another session is using
	//the first client session is closed (by default).
	//An universe size of 100.000 must be enough to handle a class of 100 diferents student IDs
	var MQTTClientID =  Math.floor(Math.random() * Math.floor(100000)) + ".SACN.ISEC.PT";
	console.log('Client ID = ' + MQTTClientID);

	
	//MQTT Topic used by the Lighting server to flag the Scratch clients it is wating for them
	var LightingReadyTopic = "/SACN/CameoFXBar/29CHMODE/Ready";	
	
	//Flags when this Scratch client is notified that the Lighting robot (Cameo) is ready to be accept control requests
	var SACN_CameoFXBar_29CHMODE_Ready_Published = false;
	
	
	//MQTT Topic used by the Lighting server to flag the party can begin
	var LightingAcceptControlTopic = "/SACN/CameoFXBar/29CHMODE/AcceptControl";
	                                  
	//Flags when this Scratch client is notified that the Lighting robot (Cameo) is ready to be controlled
	var SACN_CameoFXBar_29CHMODE_OnControl_Published = false;
	
	//MQTT Topic used by the Lighting server to terminate the party
	var LightingStopAcceptControlTopic = "/SACN/CameoFXBar/29CHMODE/StopAcceptControl";

	//Flags when this Scratch client is notified that the Lighting robot (Cameo) is no longer accepting to be controlled
	var SACN_CameoFXBar_29CHMODE_OffControl_Published = false;
	
	
	//MQTT Topic prefix used by the scratcher to control the Lighting server
	//The full topic is: "/SACN/CameoFXBar/29CHMODE/<ClientId>/<cameoSet>/
	//The message is a set of channel:value pairs: 1:255 29:127 ...
	var LightingControlTopic = "/SACN/CameoFXBar/29CHMODE/" + MQTTClientID + "/Control";	
	

	// Cleanup function when the extension is unloaded
    ext._shutdown = function() {
		if(MQTT_Client !== null) {
			MQTT_Client.disconnect();
		}
	};


	var mqtt_success_onConnect = function onConnect() {
		console.log("mqtt_success_onConnect: The MQTT broker is online.");
		Current_Extension_Status = MQTT_CONNECTED_STATUS;
		MQTT_Connection_Established = true;
		  
		// Once a MQTT connection has been made, subcribe the topic that used by the Lihting server to flag it is ready.
		console.log("mqtt_success_onConnect: Subscribing the topic: " + LightingReadyTopic);
		MQTT_Client.subscribe(LightingReadyTopic);
		Detailed_Extension_Status_Report = "Waiting for the Lighting Control to become active ..."
	};


	var mqtt_failure_onConnect = function onConnectionFailure() {
		console.log("mqtt_failure_onConnect: Connection failue");
		Current_Extension_Status = MQTT_API_LOADED_STATUS;
		MQTT_Connection_Established = false;		
		MQTT_Client = null;
	};


	var mqtt_onConnectionLost = function onConnectionLost(responseObject) {
		console.log("mqtt_onConnectionLost: Connection lost with the MQTT broker <" + responseObject.errorMessage  +">");
		// ;
		
		Current_Extension_Status = FATAL_ERROR_STATUS;
		MQTT_Connection_Established = false;		
		MQTT_Client = null;
	};
	
	var mqtt_onMessageArrived = function onMessageArrived(message) {
		  console.log("mqtt_onMessageArrived: MQTT Message Arrived - Destination name: " + message.destinationName);
		  console.log("mqtt_onMessageArrived: MQTT Message Arrived - Payload: " + message.payloadString);		  
		  //Inspect the messages arrived: we must check the related topic and messge payload
		  //by now we are assuming it is the "ready" topic the single one being published by the broker
		  if (message.destinationName == LightingReadyTopic) {
			  Current_Extension_Status = LIGHTING_SERVER_ONLINE_STATUS;
			  Detailed_Extension_Status_Report = "";
			  SACN_CameoFXBar_29CHMODE_Ready_Published = true;
		  } else if (message.destinationName == LightingAcceptControlTopic) {
			  Current_Extension_Status = LIGHTING_SERVER_ONCONTROL_STATUS;
			  SACN_CameoFXBar_29CHMODE_OnControl_Published = true; 
		  }	;
	};



	
	// ======================== MQTT Paho API Module stuff =======================================

	
	var MQTT_API_Loaded = false;
	
	var MQTT_Connection_Established = false;
		
	//MQTT handle to talk with the MQTT broker (Mosquitto - WebSocket protocol)
	var MQTT_Client = null;

	
	//Perform an asynchronous HTTP (Ajax) request.
	// Use AJAX to dynamically load the MQTT JavaScript Broker API (paho-mqtt.js)
	// Actually currently I'm hosting "paho-mqtt.js" on my own GitHub
	// https://github.com/eclipse/paho.mqtt.javascript/blob/master/src/paho-mqtt.js	 
	// Documented at: http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings	
	$.ajax({
		async:false,	//this may temporarely lock the browser but it is the price to pay ...
		type:'GET',
		url:'https://lefds.github.io/extensions/paho-mqtt.js',
		data:null,
		success: function(){
			console.log("MQTT Java Script module sucessufuly loaded!");
			MQTT_API_Loaded  = true;
			Current_Extension_Status = MQTT_API_LOADED_STATUS;
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log("Error while loading MQTT JavaScript API: <"+ textStatus + ">");
			Current_Extension_Status = FATAL_ERROR_STATUS; 
		},
	   dataType:'script'
	});	


	
	//DJ Scratch extension blocks ------------------------------------------------------


	//Block: ConnectToMQTTBroker
	//Type: Report block that waits
	//Help: //https://github.com/LLK/scratchx/wiki#reporter-blocks-that-wait
	//Hints:
	//  - This block returns just when the callback function is called
	//Algorithm:
	//  - Disconnect from the current MQTT broker (if any)
	//  - Attempt to connect to the specified MQTT broker
	//  - Report connection status after a given milliseconds timeout	
	const MQTT_CONNECTION_TIMEOUT = 2000;  // miliseconds
	
	ext.ConnectToMQTTBroker = function(mqtt_server, mqtt_port, callback) {
		console.log("ConnectToMQTTBroker: Preparing to connect to the MQTT broker at " + mqtt_server + ":" +  mqtt_port);
		
		// Disconnect from the current MQTT broker (if any)
		if (MQTT_Client != null) {
			MQTT_Client.disconnect();	//Disconnect from a previous selected MQTT broker
			Current_Extension_Status = MQTT_API_LOADED_STATUS;
			MQTT_Connection_Established = false;
		}
		
		MQTT_Connection_Established = null;
		
		// Connect to the specified MQTT broker
		MQTT_Client = new Paho.MQTT.Client(mqtt_server, mqtt_port, MQTTClientID);
		console.log('ConnectToMQTTBroker: New MQTT Client handle created ...');		
		MQTT_Client.onConnectionLost = mqtt_onConnectionLost;
		MQTT_Client.onMessageArrived = mqtt_onMessageArrived;
		console.log('ConnectToMQTTBroker: Attemping to connect to the MQTT broker now ...');
		MQTT_Client.connect({onSuccess: mqtt_success_onConnect, onFailure: mqtt_failure_onConnect});
		console.log('ConnectToMQTTBroker: Connection in course ...');

		window.setTimeout(function() {
            callback(MQTT_Connection_Established);
			return;
        }, MQTT_CONNECTION_TIMEOUT);		
	}
	
	//Block: WConnectToMQTTBroker
	//Type: Command block that waits
	//Help: https://github.com/LLK/scratchx/wiki#command-blocks-that-wait
	//Hints:
	//  - This block returns just when the callback function is called
	//Algorithm:
	//  - Disconnect from the current MQTT broker (if any)
	//  - Attempt to connect to the specified MQTT broker
	//  - Report connection status after a given milliseconds timeout
	
	ext.WConnectToMQTTBroker = function(mqtt_server, mqtt_port, callback) {
		console.log("WConnectToMQTTBroker: Preparing to connect to the MQTT broker at " + mqtt_server + ":" +  mqtt_port);
		
		// Disconnect from the current MQTT broker (if any)
		if (MQTT_Client != null) {
			MQTT_Client.disconnect();	//Disconnect from a previous selected MQTT broker
			Current_Extension_Status = MQTT_API_LOADED_STATUS;
			MQTT_Connection_Established = false;
		}
		
		MQTT_Connection_Established = null;
		
		// Connect to the specified MQTT broker
		MQTT_Client = new Paho.MQTT.Client(mqtt_server, mqtt_port, MQTTClientID);
		console.log('WConnectToMQTTBroker: New MQTT Client handle created ...');
		MQTT_Client.onConnectionLost = mqtt_onConnectionLost;
		MQTT_Client.onMessageArrived = mqtt_onMessageArrived;
		console.log('WConnectToMQTTBroker: Attemping to connect to the MQTT broker now ...');
		MQTT_Client.connect({onSuccess: mqtt_success_onConnect, onFailure: mqtt_failure_onConnect});
		console.log('WConnectToMQTTBroker: Connection in course ...');

		window.setTimeout(function() {
            callback();
			return;
        }, MQTT_CONNECTION_TIMEOUT);		
	}

		
	
	//Block: FlagDJExtensionStatusChanges
	//Type: Hat block that wait
	//Help: https://github.com/LLK/scratchx/wiki#hat-blocks
	//Hints:
	// - Not well documented anywhere.
	// - The hat block code is running all the time on its own thread.
	// - whenever it returns true the following blocks are executed but the hat block function
	// - remains being called. If the functions returns false the following blocks are not called. 	
	//Algorithm:
	//  - This specific block is used to trigger DJ Scratch Extension status changes.
	//    The full report can be obtained with the ReportDJExtensionStatus block.'
	ext.FlagDJExtensionStatusChanges = function() {
		var changes = false;
		
		if (Current_Extension_Status != Previous_ExtensionStatus) {
			Previous_ExtensionStatus = Current_Extension_Status;
			changes = true;
		}
		
		if ( Detailed_Extension_Status_Report != Previous_Detailed_Extension_Status_Report) {
			Previous_Detailed_Extension_Status_Report = Detailed_Extension_Status_Report;
			changes = true;
		}		
		return (changes);
    };
		
	//Block: ReportDJExtensionStatus
	//Type: reporter block
	//Help: https://github.com/LLK/scratchx/wiki#reporter-blocks
	//Algorithm:
	//  - This block is used to return a String with the current DJ Scratch Extension status.
	ext.ReportDJExtensionStatus = function() {
			if(Detailed_Extension_Status_Report != "") {
				return ExtensionStatusReport[Current_Extension_Status] + "\n["+ Detailed_Extension_Status_Report  + "]";
			} else {
				return ExtensionStatusReport[Current_Extension_Status];
			}
	}
	
	//Block: WaitLightingServerBecomesReady
	//Type: Hat block that wait
	//Help: https://github.com/LLK/scratchx/wiki#hat-blocks
	//Hints:
	// - Not well documented anywhere.
	// - The hat block code is running all the time on its own thread.
	// - whenever it returns true the following blocks are executed but the hat block function
	// - remains being called. If the functions returns false the following blocks are not called. 	
	//Algorithm:
	// - Hat block that flags a ready Lighting Server
	ext.WaitLightingServerBecomesReady = function() {
       if (SACN_CameoFXBar_29CHMODE_Ready_Published === true) {
           SACN_CameoFXBar_29CHMODE_Ready_Published = false;		  
		   //console.log("WaitLightingServerBecomesReady: Lighting server announces it is ready");
           return true;
       }
	   //console.log("WaitLightingServerBecomesReady: Lighting server not yet ready!");
       return false;
    };

	//Block: WaitLightingServerBecomesOncontrol
	//Type: Hat block that wait
	//Help: https://github.com/LLK/scratchx/wiki#hat-blocks
	//Hints:
	// - Not well documented anywhere.
	// - The hat block code is running all the time on its own thread.
	// - whenever it returns true the following blocks are executed but the hat block function
	// - remains being called. If the functions returns false the following blocks are not called. 	
	//Algorithm:
	// - Hat block that flags a ready Lighting Server
	ext.WaitLightingServerBecomesOncontrol = function() {	   
       if (SACN_CameoFXBar_29CHMODE_OnControl_Published === true) {
           SACN_CameoFXBar_29CHMODE_OnControl_Published = false;
		   console.log("WaitLightingServerBecomesOncontrol: Lighting server announces it is accepting control from scratchers");
           return true;
       }
		   //console.log("WaitLightingServerBecomesOncontrol: Lighting server not yet ready to accept control from scratchers");
       return false;
    };
	

	//Block: WaitLightingServerBecomesOffcontrol
	//Type: Hat block
	//Help: https://github.com/LLK/scratchx/wiki#hat-blocks
	//Hints:
	// - Not well documented anywhere.
	// - The hat block code is running all the time on its own thread.
	// - whenever it returns true the following blocks are executed but the hat block function
	// - remains being called. If the functions returns false the following blocks are not called. 	
	//Algorithm:
	// - Hat block that flags a ready Lighting Server
	ext.WaitLightingServerBecomesOffcontrol = function() {
       if (SACN_CameoFXBar_29CHMODE_OffControl_Published === true) {
           SACN_CameoFXBar_29CHMODE_OffControl_Published = false;
		   console.log("WaitLightingServerBecomesOffcontrol: Lighting server announces it is no longer accepting control from scratchers");
           return true;
       }
		   //console.log("WaitLightingServerBecomesOffcontrol: Lighting server is still accepting control from scratchers");
       return false;
    };

	
	//Block: RequestLightingControl
	//Type: Command block that wait
	//Help: https://github.com/LLK/scratchx/wiki#command-blocks-that-wait
	//Hints:
	//  - This block returns just when the callback function is called
	//Algorithm:
	//  - Check if the current status is the correct
	//  - Subscribe interest on the selected Cameo Set
    ext.RequestLightingControl = function(cameo_controlset, callback) {
		if (Current_Extension_Status == LIGHTING_SERVER_ONLINE_STATUS) {
			
			//First subscribe interest on the needed topic to know the party will begin
			MQTT_Client.subscribe(LightingAcceptControlTopic); 
			console.log("Subcribing interested on <" + LightingAcceptControlTopic + "> topic to know the party will begin.");
			Detailed_Extension_Status_Report = "Subscribe interest on being informed about party begin <" + LightingAcceptControlTopic +">";

			//Then subscribe interest on the needed topic to know the party is over
			MQTT_Client.subscribe(LightingStopAcceptControlTopic); 
			console.log("Subcribing interested on <" + LightingStopAcceptControlTopic + "> topic to know the party is over.");
			Detailed_Extension_Status_Report = "Subscribe interest on being informed when the party is over <" + LightingStopAcceptControlTopic +">";
			
			//Then publish interest on controlling the selected cameo control set
			message = new Paho.MQTT.Message(MQTTClientID);
			message.destinationName = LightingReadyTopic + "/" + cameo_controlset;
			MQTT_Client.send(message);

			console.log("Requested interest on controlling the <" + cameo_controlset + "> by publishing on topic <" + message.destinationName + ">.");
			Current_Extension_Status = LIGHTING_SERVER_CONTROL_REQUESTED_STATUS;
			Detailed_Extension_Status_Report = "Requested control over <" + cameo_controlset + ">.";
		} else {
			Detailed_Extension_Status_Report = "Warning: a control request over the Lighting equipment can happen just when the Ligthing server is on-line!";			
		}
		callback();
		return;		
    };
	
		
	//Block: Cameo29CHMODE_Command
	//Type: Command block that wait
	//Help: https://github.com/LLK/scratchx/wiki#command-blocks-that-wait
	//Help: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach
	//Hints:
	//  - This block returns just when the callback function is called
	//Algorithm:
	//  - Send the channel:value map for the Cameo FX BAr operating on the 29CHMODE_Command
    ext.Cameo29CHMODE_Command = function(callback) {
		console.log("Cameo29CHMODE_Command: Begin");
		if (Current_Extension_Status == LIGHTING_SERVER_ONCONTROL_STATUS) {
			console.log("Cameo29CHMODE_Command: The party in running ...");
			//Then publish the current Cameo CH29Mode channels
			Update_CameoCH29ModeChannelsString();
			console.log("Lighting control commands to be sent to the party:");
			console.log(CameoCH29ModeChannelsString);
			message = new Paho.MQTT.Message(CameoCH29ModeChannelsString);
			message.destinationName = LightingControlTopic;
			MQTT_Client.send(message);
			Detailed_Extension_Status_Report = "Lighting control commands sent to the party.";
		} else {
			console.log("Cameo29CHMODE_Command: The party in still not running ...");
			Detailed_Extension_Status_Report = "Warning: Lighting equipment can be commanded just after the party begins!";
		}
		callback();
		return;
	}
			
		
	
	//Block: Cameo29CHMODE_Blackout
	//Type: Command block
	//Help: https://github.com/LLK/scratchx/wiki#command-blocks
	//Hints:
	//  - Parameter range are fixed internally
	//Algorithm:
	//  - 
	ext.Cameo29CHMODE_Blackout = function () {
		for(key = CameoCH29ModeChannels_FIRST_CHANNEL; key <= CameoCH29ModeChannels.size; key++) {
			CameoCH29ModeChannel.set(key) = 0;
		}
		Update_CameoCH29ModeChannelsString();
		console.log("Cameo29CHMODE_Blackout: " + CameoCH29ModeChannelsString);
	}
		
		
		
	//Block: Cameo29CHMODE_DerbyRGB
	//Type: Command block
	//Help: https://github.com/LLK/scratchx/wiki#command-blocks
	//Hints:
	//  - Parameter range are fixed internally
	//Algorithm:
	//  - 
	ext.Cameo29CHMODE_DerbyRGB = function (derby, color, value) {
		if (value < 0) val = 0; else if (value > 100) value = 100;
		value = Math.round((value / 100) * 255);
		var derby_initial_channel = 0;
		if (derby == "Derby1") {derby_initial_channel=1} else {derby_initial_channel=6} 
		var rgb_channel = {
			"Red": derby_initial_channel,
			"Green": derby_initial_channel+1,
			"Blue": derby_initial_channel +2,
		};
		CameoCH29ModeChannels.set(rgb_channel[color], value);
		Update_CameoCH29ModeChannelsString();
		console.log("Cameo29CHMODE_DerbyRGB: " + CameoCH29ModeChannelsString);
	}
	
	
    // Block and block menu descriptions
	//Help on menus: https://mryslab.github.io/s2-pi/#creating-a-javascript-extension-file
    var descriptor = {
        blocks: [
		['h', 'When the DJ Extension Status change', 'FlagDJExtensionStatusChanges'],
		['r', 'Current DJ Extension status.', 'ReportDJExtensionStatus'],
		['R', 'Is the MQTT Broker at IP %s : %n ?', 'ConnectToMQTTBroker', '192.168.100.100', 9001],
		['w', 'Connect to the MQTT Broker at IP %s : %n', 'WConnectToMQTTBroker', '192.168.100.100', 9001],
		['h', 'When Lighting Controller is ready', 'WaitLightingServerBecomesReady'],
		['h', 'When the party begins', 'WaitLightingServerBecomesOncontrol'],
		['h', 'When the party is over', 'WaitLightingServerBecomesOffcontrol'],		
		['w', 'Request control over %m.CameoSets', 'RequestLightingControl','Derby1'],
		['w', 'Command Cameo FX Bar', 'Cameo29CHMODE_Command'],
		[' ', 'Blackout', 'Cameo29CHMODE_Blackout'],
		[' ', 'Change %m.Derbys color %m.RGB %n%', 'Cameo29CHMODE_DerbyRGB','Derby1','Red',0],
		],
	    'menus': {
			'CameoSets': ['Derby1', 'Derby2', 'Par1', 'Par2', 'Laser', 'Flash', 'Player'],
			'Derbys': ['Derby1', 'Derby2'],
			'RGB': ['Red','Green', 'Blue'] 
		},		
		url: 'https://lefds.github.io/extensions/index.html',
		displayName: 'DJ Scratch Extension'
    };	
    // Register the extension
    ScratchExtensions.register('sACN DMX Extension', descriptor, ext);
})({});