var CORESTATE_UNCONNECTED   = 0;
var CORESTATE_CONNECTING    = 1;
var CORESTATE_CONNECTED     = 2;
var CORESTATE_SUSPENDED     = 3;
var CORESTATE_RECONNECTING  = 4;
var CORESTATE_DISCONNECTED  = 5;
var coreState = CORESTATE_UNCONNECTED;

function getCoreState(){
    return coreState;
}

/**
 * Change the protocol state of the CGPCore.
 */
function changeCoreState(newState) {
	writeHTML5Log(0, "SESSION :|: CGP :|: STATE :|: CGP-CORE :|: Changing core state from :" + coreState + " To " + newState);
	coreState = newState;
}

function CGPCore (user, services, socket, callBackWrapper, SRTimeOut) {
	var STATE_UNREADY         = -1;
    var STATE_SIGNATURE       = 0;
    var STATE_FIRST_LEN_BYTE  = 1;
    var STATE_SECOND_LEN_BYTE = 2;
    var STATE_COMMAND_BYTE    = 3;
    var STATE_PAYLOAD         = 4;
    
	function networkStateChange(){
		writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Network Disruption Detected");
		if (coreState === CORESTATE_CONNECTED) {
			writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Suspending session");
			socket.Suspend();
		} else {
			writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Session already suspended. State: " + coreState);
		}
	}

    //private static final var CORE_STATE_UNDEFINED  = -1;

    // Packet parsing state
    var inputState        = STATE_UNREADY;
    var inputPacketLength;
    var inputCommand;
    var inputData = new CGPBuffer();

    // Core state
    coreState        	   = CORESTATE_UNCONNECTED;
    var finishIsRestart;
    var finishInitiator        = false;
    var finishRequestReceived  = false;
    var finishResponseReceived = false;

    //var             coreState  = CORE_STATE_UNDEFINED;

    // For Unit Test Compatibility.
    var fns = {};

    // Services data
    var knownServices;
    var boundServices;
    var serviceIds     = {};

    // Channels data
    var channels   = {};
    var realtimeChannel = null;
    var nextChannelId = 0;

    // var sendData = provider;
    //  Reliability data
    var reliable                = true;
    var unackedPackets          = {};		// Empty Hash containing the packet Numbers and Packet Data
    var packetNo                = 0;		// Contains the Packet Serial Number
    var unackedPacketsSize      = 0;		// Contains teh
    var maxUnackedData          = 64 * 1024;// how big? 64kb?

    var reconnectTicketVersion;
    var reconnectTicket         = null;
    var sentCapabilities;

    var lastReceivedPacket      = 0;
    var lastSentAck             = 0;

    var nextMessageInSentList   = 1;
	var nextMessageToSend		= 0;
    // Security tickets
    var securityTicketSet = false;
    var securityTicketType;
    var securityTicketData;

    // First Packet Data
    var numCapBlocks =0; 					// This contains the total number of capability blocks to be supported by the CGP
    var bindRequest;
	
	// Session Reliability Paramaters
	var reliabilityTimeOut	= SRTimeOut;	// default.
	var UIFlags 			= CGPConstants.CGP_RELIABILITY_UIFLAG_DIMMING;
	var UIDimmingPercentage = 25;			// default.
	var estimatedTCPTimeout = 10;			//Server ignores this value anyway.
	
	
    var Send = socket.Send;

    // Used to Monitor if the Server is sending data or not.
    var isServerActive = true;
    var keepAliveTimer;                     // This is used to Detect Network disconnects in ChromeOS

	/**
	* Creates a CGPCore object.
	* @param user the CGPUser implementation that the CGPCore uses to
	*             communicate with the user program.
	* @param services the list of CGP services that should be provided by the
	*                 CGP connection.
     */
    this.user = user;

	// make sure we don't have any duplicate classes/null services?
    knownServices = services;

    // Use this as global reference to CgpCore elsewhere.
    var myself = this;

    for (var i = 0; i < knownServices.length; i++) {

        // Supply the service with an Interface to the core.
        //knownServices[i].register(new ServiceToCore(knownServices[i]));
        knownServices[i].register(myself);
    }
        //knownServices = new CGPService[] { new TcpProxyService() };

	/**
	* Starts the connection close procedure.
	* @param restart true if the connection should be kept open following the
	* disconnect sequence.
    */
    this.Close = function _Close() {
        if (coreState != CORESTATE_CONNECTED) {
            ////throw new IllegalStateException("The CGPCore has not been connected")
        }
	    // Give services and user program a chance to write out any final data.
	    //notifyConnectionClosing();
	
	    // Tell the server that the connection is being closed.
	    //finishIsRestart = restart;
	    finishInitiator = true;
        sendFinishRequest(CGPConstants.CGP_FINISH_TYPE_CLOSE);

	};



    this.Suspend = function _Suspend() {
        if (coreState != CORESTATE_CONNECTED) {
            ////throw new IllegalStateException("The CGPCore is not connected");
        }

        if (!reliable) {
            ////throw new IllegalStateException("The CGP session is not reliable, cannot suspend");
        }
        changeCoreState(CORESTATE_SUSPENDED);
		//myself.StopServerAliveCheckTimer();
    };

    /**
     * Causes the CGPCore to connect to a CGP server.
     */
    this.connect = function _Connect() {
        if (coreState != CORESTATE_UNCONNECTED) {
            ////throw new IllegalStateException("The CGPCore has already been connected");
            // Write log for HTML5
        }

        changeCoreState(CORESTATE_CONNECTING);
        var caps = getAllCapabilities();
                if (reliable) {
            // Store capabilities for resending if a reconnect is required.
            sentCapabilities = caps;
        }
        bindRequest = createBindRequest(sentCapabilities);
        // we MUST send the signature and the bind request in one packet,
        // otherwise XTE will trap.
        var packet = new Uint8Array(CGPConstants.CGP_HEADER.length + bindRequest.length);
        packet.set(CGPConstants.CGP_HEADER, 0);
        packet.set(bindRequest, CGPConstants.CGP_HEADER.length);
        writeData(packet, 0, packet.length);
        inputState = STATE_SIGNATURE;
    };


    this.resume = function _Resume() {
        if (coreState != CORESTATE_SUSPENDED) {
            ////throw new IllegalStateException("The CGPCore is not suspended");
        }
        changeCoreState(CORESTATE_RECONNECTING);
        inputState = STATE_SIGNATURE;
        var resumeCaps = sentCapabilities;
        writeHTML5Log(0, "SESSION :|: CGP :|: RE-CONNECTION :|: CGP-CORE :|: Scanning old capability blocks...");
        for(var i = 0; i < numCapBlocks; i++) {
            if (resumeCaps[i].capabilityId == CGPConstants.CGP_CAPABILITY_SESSION_RELIABILITY) {
                // Replace reliability capability with new one
                resumeCaps[i].set(reconnectTicketVersion, reconnectTicket, (lastReceivedPacket+1), [getSentOpenRequests()])

            } else if (resumeCaps[i].capabilityId == CGPConstants.CGP_CAPABILITY_SECURITY_TICKET) {
                // Replace security ticket with new one
                resumeCaps[i].set(securityTicketType,securityTicketData);
            }
        }
        bindRequest = createBindRequest(resumeCaps);
        // we MUST send the signature and the bind request in one packet,
        // otherwise XTE will trap.
        var packet = new Uint8Array(CGPConstants.CGP_HEADER.length + bindRequest.length);
        packet.set(CGPConstants.CGP_HEADER, 0);
        packet.set(bindRequest, CGPConstants.CGP_HEADER.length);
        writeData(packet, 0, packet.length);
        // By performing a resume we automatically ack all received packets.
        lastSentAck = lastReceivedPacket;
    };

	this.getReliabilityParams = function(){
		return {'reliabilityTimeOut' : reliabilityTimeOut, 'UIFlags': UIFlags, 'UIDimmingPercentage' : UIDimmingPercentage};
	};

    function getSentOpenRequests() {
        var requests = {};
        //var e = channels.elements();
        var totalReqLength = 0;
        var offset;
        for(var e in channels) {
            var c = channels[e];
            requests[e] = c.getOpenRequest();
            totalReqLength += requests[e].length;
        }
        var finalRequest = new Uint8Array(totalReqLength);
        for (e in requests){
            finalRequest.set(requests[e],offset);
            offset += requests[e].length;
        }
        return finalRequest;
    }

    /**
     * Send data to the peer (via the user program.)
	 */
  function writeData(byteData, offset, length) {

		var data = new Uint8Array(byteData.subarray(offset, offset + length));

        Send(data);
    }

    /**
     */
    this.setSecurityTicket = function _SetSecurityTicket(ticketType, ticketData) {
        if (coreState != CORESTATE_UNCONNECTED) {
            ////throw new IllegalStateException("You can only set a security ticket before the CGPCore has been connected");
        }

        if (ticketType != CGPConstants.CGP_TICKET_TYPE_STA) {
            ////throw new IllegalArgumentException("Unknown security ticket type");
        }

        securityTicketSet  = true;
        securityTicketData = ticketData;
        securityTicketType = ticketType;
        //SecurityTicketCapability.set(ticketType, ticketData);
    }

    /**
     * Returns an array containing all services which have been successfully
     * negotiated with the CGP server.
     */
    function getBoundServices() {
        if (coreState != CORESTATE_CONNECTED &&
            coreState != CORESTATE_SUSPENDED)
        {
            ////throw new IllegalStateException("Services have not been bound yet");
        }
        return (boundServices);
    }

    /**
     * Returns true if the CGP core is connected.
     */
    function isConnected() {
        if(coreState == CORESTATE_CONNECTED){
        	return true;
        }
        return false;
    }

    /**
     * Returns true if the CGP core is suspended.
     */
    function isSuspended() {
        if(coreState == CORESTATE_SUSPENDED){
        	return true;
        }
        return false;
    }

    /**
     * Generates an array of CGPCapabilities listing containing capabilities
     * from the CGP core and all known/registered services.
     */
    function getAllCapabilities() {
         var allCaps = {};
        // Add CGPCore capabilities
        var caps = getCoreCapabilities();
        for(var j = 0; j < numCapBlocks; j++) {
            //allCaps.add(caps[j]);
            allCaps[j] = caps[j];
        }
        for(var i = 0; i < knownServices.length; i++) {
            caps = knownServices[i].getCapabilities();
            if (caps != null) {
                for(j = 0; j < numCapBlocks; j++) {
                    allCaps[j] = caps[j];
                }
            }
        }
        return allCaps;
    }

     /**
     * Creates a byte array containing a capability block.
     */
    function getCoreCapabilities(){
         var coreCaps = {};
         if(reliable){
             coreCaps[numCapBlocks++]  = new ReliabilityCapability();
         }
		 coreCaps[numCapBlocks++] = new ReliabilityParamsCapability();
         coreCaps[numCapBlocks++]  = new KeepAliveCapability();
         coreCaps[numCapBlocks++]  = new BindCapability(knownServices);
         if(securityTicketSet){
             coreCaps[numCapBlocks++]  = new SecurityTicketCapability(securityTicketType, securityTicketData);
             if(securityTicketType == CGPConstants.CGP_TICKET_TYPE_STA){
                 var endPointCap = new EndPointCapability();
                 endPointCap.securityTicketEndPoint();
                 coreCaps[numCapBlocks++]  = endPointCap;
             }
         }
        return coreCaps;
    }

    function createBindRequest(capabilities){
        var noCaps = numCapBlocks;//capabilities.length;
        var capsBytes = new Array(noCaps);
        var capsPayloadSize = 0;
        for(var i = 0; i< noCaps; i++){
            capsBytes[i] = capabilities[i].getBytes();
            capsPayloadSize += capsBytes[i].length;
        }
        var totalSize = 1 + 1 + 2// 1 cmd byte, 1 extension flags, 2 reserved bytes
                        + getVarLenLength(noCaps)
                        + capsPayloadSize;

        bindRequest = new Uint8Array(getVarLength(totalSize));
        var offset = 0;

        offset = cgpWriteVarLength(totalSize, offset, bindRequest);
        bindRequest[offset++] = CGPConstants.CGP_BIND_REQUEST;
        bindRequest[offset++] = 0;                // extension flags, MUST be 0
        bindRequest[offset++] = CGPConstants.CGP_RESERVED;     // reserved byte
        bindRequest[offset++] = CGPConstants.CGP_RESERVED;     // reserved byte
        offset = cgpWriteVarLength(noCaps, offset, bindRequest);
        for(i =0; i< noCaps; i++){
            Utility.CopyArray(capsBytes[i], 0, bindRequest, offset,capsBytes[i].length);
            offset += capsBytes[i].length;
        }
        return bindRequest;
    }


    // Packet sending
    // ==============
    var EMPTY_BYTE_ARRAY = new Uint8Array(0);

    /**
     */
    function sendNop() {
		
        sendPacket(CGPConstants.CGP_NOP, EMPTY_BYTE_ARRAY, false, true);
    }

    /**
     */
    function sendFinishRequest(closeType) {
    	
        sendPacket(CGPConstants.CGP_FINISH_REQUEST, [[closeType, CGPConstants.CGP_RESERVED]], false);
    }

    /**
     */
    function sendFinishResponse(closeType) {
        sendPacket(CGPConstants.CGP_FINISH_RESPONSE, [[closeType, CGPConstants.CGP_RESERVED]], false);
    }

    /**
     */
    this.sendChannelClose = function _SendChannelClose(channelId, statusCode, svcStatusCode)
    {
        var data = new Uint8Array(getVarLenLength(channelId) +
                               2 + // 2 reserved bytes
                               2 + // status code
                               2); // service status code
        var offset = 0;

        offset = CgpEncodeVarlen(data, offset, channelId);
        data[offset++] = CGPConstants.CGP_RESERVED;
        data[offset++] = CGPConstants.CGP_RESERVED;
        offset = writeUint16(data, offset, statusCode);
        offset = writeUint16(data, offset, svcStatusCode);

        sendPacket(CGPConstants.CGP_CHANNEL_CLOSE, data, true);
    };

    this.sendData = function _SendData(channel, inbuf, inoff, inlen) {
        var header = new Uint8Array(getVarLenLength(channel.channelId));
        CgpEncodeVarlen(header, 0, channel.channelId);


        if (inoff != 0 || inlen != inbuf.length) {
            var newinbuf = new Uint8Array(inlen);
            Utility.CopyArray(inbuf, inoff, newinbuf, 0, inlen);
            inbuf = newinbuf;
        }
        var data = [header, inbuf];
        sendPacket(CGPConstants.CGP_DATA, data , true);
    };


    //function sendOpenChannelRequest
    function sendOpenChannelRequest (serviceId, channelId, channelFraming, channelPriority, params)
    {

    	// serviceId, channelId, channel framing, channel priority, 2 reserved bytes, opaque param block
        var headerLength = 2 + getVarLenLength(channelId) +  1 + 1 + 2 + getVarLenLength(params.length);

        var offset = 0;
        var header = new Uint8Array(headerLength);
        offset = writeUint16(serviceId, offset, header);
        offset = CgpEncodeVarlen(channelId, offset, header);
        header[offset++] = channelFraming;
        header[offset++] = channelPriority;
        header[offset++] = CGPConstants.CGP_RESERVED;
        header[offset++] = CGPConstants.CGP_RESERVED;
        offset = CgpEncodeVarlen(params.length, offset, header);


        return sendPacket(CGPConstants.CGP_CHANNEL_OPEN_REQUEST, [header, new Uint8Array(params)], true);

    }



    this.sendRealtimeData = function (inbuf, inoff, inlen) {
        var ackDelta = getAndResetAckDelta();

        var payloadLength = 1 + inlen + (ackDelta == 0 ? 0 : getVarLenLength(ackDelta));
        var packetLength = getVarLength(payloadLength);

        var packet = new Uint8Array(packetLength);

        var offset = 0;
        var ackOffset = -1;

        offset = CgpEncodeVarlen(payloadLength, offset, packet);

        if (ackDelta == 0) {
            packet[offset++] = CGPConstants.CGP_DATA_REALTIME;
        } else {
            packet[offset++] = CGPConstants.CGP_DATA_REALTIME_WITH_ACK;
            ackOffset = offset;
            offset = CgpEncodeVarlen(ackDelta, offset, packet);
        }

        Utility.CopyArray(inbuf, inoff, packet, offset, inlen);

        if (coreState == CORESTATE_CONNECTED) {
            writeData(packet, 0, packet.length);
        }

        // Pass to reliability support

        // Clear acks for resending
        if (ackOffset != -1) {
            if (getVarLenLength(ackDelta) > 1) {
                packet[ackOffset]     = 0x80;
                packet[ackOffset + 1] = 0;
            } else {
                packet[ackOffset] = 0;
            }
        }
        recordPacket(packet);
    };

    this.Send = function(cmd, payload, addExtensions) {
        return sendPacket(cmd, [payload], addExtensions);
    };

    /**
     */
    function sendPacket(cmd, payloads, isReliable, isAckRequired) {
        var payloadLength = 0;

        for(var i = 0; i < payloads.length; i++) {
            payloadLength += payloads[i].length;
        }

        var packet;

        var reliablePacket = false;

        var packetLength = 2 + payloadLength;

        var ackOffset = -1;
        var offset    = 0;
        var ackDelta  = 0;

        if (isReliable || isAckRequired) {
            var extensionFlags = 0x00;//1 << CGPConstants.CGP_HEADER_EXT_LENGTH__INDEX;

            // calculate header extension size and generate extension flags
            if (reliable) {
                // All packets that get a header extension at all need a reliability
                // header.
				reliablePacket = true;
                // Record ack delta.
                ackDelta = getAndResetAckDelta();

                packetLength++; // +1 for reliability flags
                packetLength += ackDelta > 0 ? getVarLenLength(ackDelta) : 0;

                extensionFlags |= 1 << CGPConstants.CGP_HEADER_RELIABILITY__INDEX;
            }

            // Create packet structure
            packet = new Uint8Array(getVarLength(packetLength));

            // Write length of packet
            offset = CgpEncodeVarlen(packetLength, offset, packet);

            // Write packet command byte
            packet[offset++] = cmd;

            // Write extension flag(s) FIXME: support multiple byte flags if necessary
            packet[offset++] = extensionFlags; // no header extension flags yet...

            // generate header extensions
            if (reliablePacket) {
                if (ackDelta > 0) {
                    packet[offset++] = ((isReliable) ? CGPConstants.CGP_RELIABILITY_EXTENSION_TRACK_MESSAGE : 0)|
                                       ((isAckRequired) ? CGPConstants.CGP_RELIABILITY_EXTENSION_ACK : 0);
                    ackOffset = offset;
                    offset = CgpEncodeVarlen(ackDelta, offset, packet);
                } else {
                    packet[offset++] = CGPConstants.CGP_RELIABILITY_EXTENSION_TRACK_MESSAGE;
                }
            }
        } else {
            // Simple case, no headers required/allowed
            // Create packet structure
            packet = new Uint8Array(getVarLength(packetLength));

            // Write length of packet
            offset = CgpEncodeVarlen(packetLength, offset, packet);
            // Write packet command byte
            packet[offset++] = cmd;

            // Write 0 extension flags
            packet[offset++] = 0;
        }

        // Add payloads to packet
        for (var i = 0; i < payloads.length; i++) {
            Utility.CopyArray(payloads[i], 0, packet, offset, payloads[i].length);
            offset += payloads[i].length;
        }

        if (coreState == CORESTATE_CONNECTED) {
            writeData(packet, 0, packet.length);
        }

        // Pass to reliability support
        if (reliablePacket) {
            // Clear acks for resending
            if (ackOffset != -1) {
                if (getVarLenLength(ackDelta) > 1) {
                    packet[ackOffset]     = 0x80;
                    packet[ackOffset + 1] = 0;
                } else {
                    packet[ackOffset] = 0;
                }
            }
			if(isReliable){
				recordPacket(packet);
			}
        }

        return packet;
    }

    // Input packet parsing
    // ====================
    /**
     * Provide the CGPCore with data received from the CGP peer.
     *
     * @param data the data.
     * @param off the start offset in the data.
     * @param len the number of bytes available.
     */
    this.consumeData = function(data, off, len) {
        // Any kind of Data we receive from data means that Server is alive.
        isServerActive = true;
        // Now process that data.
        if (coreState != CORESTATE_CONNECTING &&
            coreState != CORESTATE_RECONNECTING &&
            coreState != CORESTATE_CONNECTED)
        {
            ////throw new ProtocolException("Can't receive data, not connected/connecting");
        }

        while(len > 0) {
            switch(inputState) {
                case STATE_FIRST_LEN_BYTE:
                    // Read first length byte in packet
                    inputPacketLength = data[off];
                    off++;
                    len--;

                    // is there a second length byte?
                    if ((inputPacketLength & 0x80) == 0x0) {
                        // No
                        inputState = STATE_COMMAND_BYTE;
                        break;
                    }
                    inputPacketLength &= 0x7f;
                    inputState = STATE_SECOND_LEN_BYTE;
                    if (len == 0) break;
                    // Fallthrough

                case STATE_SECOND_LEN_BYTE:
                    // Read second length byte in packet
                    inputPacketLength |= (data[off++] & 0xff) << 7;
                    len--;
                    inputState = STATE_COMMAND_BYTE;
                    if (len == 0) break;
                    // Fallthrough

                case STATE_COMMAND_BYTE:
                    inputPacketLength--;
                    inputCommand = data[off++] & 0xff;
                    len--;
                    inputState = STATE_PAYLOAD;
                    inputData.offset = 0;
                    inputData.length = 0;

                    if (len == 0 && inputPacketLength != 0) break;
                    // Fallthrough

                case STATE_PAYLOAD:
                    if (inputPacketLength > 0) {
                        // Ensure input buffer is sufficiently big
                        if (inputData.length < inputPacketLength) {
							var prev = inputData.data, prevLen = inputData.length;
                            inputData.data = new Uint8Array(inputPacketLength);
							Utility.CopyArray(prev, 0, inputData.data, 0, prevLen);
                        }
                        // Read more payload data
                        var dataToCopy = Math.min(len, inputPacketLength - inputData.length);
                        Utility.CopyArray(data, off, inputData.data, inputData.length, dataToCopy);
                        inputData.length += dataToCopy;
                        off += dataToCopy;
                        len -= dataToCopy;
                    }

                    if (inputData.length == inputPacketLength) {
						// Got the entire command, execute it
                        executeCommand(inputCommand, inputData);
                        inputState = STATE_FIRST_LEN_BYTE;
                    } else {
                        preprocessCommand(inputCommand, inputData);
                    }
					if (getNopRequired()) {
                        // Send a nop which will have an ACK attached to it
                        sendNop();
                    }
					
                    break;

                case STATE_SIGNATURE:
                    // TODO: may want to make this more resiliant against receiving bogus data
                    writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: Hit the State Signature");
                    inputData.offset  = 0;
                    inputData.length  = 0;
                    inputPacketLength = CGPConstants.CGP_HEADER.length;
                    inputCommand      = CGPConstants.CGP_SIGNATURE_COMMAND;
                    inputState        = STATE_PAYLOAD;
                    break;

                case STATE_UNREADY:
                    ////throw new IllegalStateException("Not ready for data");

                default:
                    ////throw new IllegalStateException("Unknown state in packet parsing");
                    writeHTML5Log(0, "SESSION :|: CGP :|: CGP_CORE :|: ERROR :|: Unknown state in packet parsing");
            }
        }
    }

    /**
     * Processes header extensions and then dispatches the command to the
     * appropriate method for processing.
     */
    function executeCommand(cmd, packet) {
        var payload = processHeaderExtensions(cmd, packet);

        if ((coreState == CORESTATE_CONNECTING ||
            coreState == CORESTATE_RECONNECTING) &&
            cmd != CGPConstants.CGP_BIND_RESPONSE &&
            cmd != CGPConstants.CGP_SIGNATURE_COMMAND) {
            ////throw new ProtocolException("Command " + cmd + " not expected before BIND_RESPONSE");
        }

        switch(cmd) {
            case CGPConstants.CGP_SIGNATURE_COMMAND:
                processSignature(payload);
                break;

            case CGPConstants.CGP_BIND_REQUEST:
                processBindRequest(payload);
                break;

            case CGPConstants.CGP_BIND_RESPONSE:
                processBindResponse(payload);
                break;

            case CGPConstants.CGP_FINISH_REQUEST:
                processFinishRequest(payload);
                break;

            case CGPConstants.CGP_FINISH_RESPONSE:
                processFinishResponse(payload);
                break;

            case CGPConstants.CGP_NOP:
				//Commenting as we do not process the data
                //processNop(payload);
                break;

            case CGPConstants.CGP_CHANNEL_OPEN_REQUEST:
                processChannelOpenRequest(payload);
                break;

            case CGPConstants.CGP_CHANNEL_OPEN_RESPONSE:
                processChannelOpenResponse(payload);
                break;

            case CGPConstants.CGP_CHANNEL_CLOSE:
                processChannelClose(payload);
                break;

            case CGPConstants.CGP_DATA:
                processData(payload);
                break;

            case CGPConstants.CGP_DATA_REALTIME:
                processDataRealtime(payload);
                break;

            case CGPConstants.CGP_DATA_REALTIME_WITH_ACK:
                processDataRealtimeWithAck(payload);
                break;

            default:
                ////throw new ProtocolException("Unknown command " + cmd);
        }
    }

    /**
     * Deals with partially received commands.  Currently only used to check for errors
     * in the CGP signature block.
     */
    function preprocessCommand(cmd, packet) {
        if (cmd === CGPConstants.CGP_SIGNATURE_COMMAND) {
            // Make sure that the signature we've received so far looks like a CGP
            // handshake.
            processSignature(packet);
        }
    }

    /**
     * Processes header extension flags and associated extension data.
     *
     * @param cmd the command number of this packet.
     * @param data the entire remaining data for this packet
     *
     * @return the remaining data after header extensions are removed and processed.
     */
    function processHeaderExtensions(cmd, data){
        var processedData = new CGPBuffer(data.data);

        if (cmd == CGPConstants.CGP_SIGNATURE_COMMAND ||
            cmd == CGPConstants.CGP_DATA_REALTIME     ||
            cmd == CGPConstants.CGP_DATA_REALTIME_WITH_ACK)
        {
            // CGP_DATA_REALTIME and CGP_DATA_REALTIME_WITH_ACK do not have
            // header extensions and CGP_SIGNATURE_COMMAND isn't even a real
            // command.
            return processedData;
        } else if (cmd == CGPConstants.CGP_BIND_REQUEST ||
                   cmd == CGPConstants.CGP_BIND_RESPONSE)
        {
            if (processedData.readUInt8() != 0) {
                // ERROR: CGP_BIND_REQUEST and CGP_BIND_RESPONSE must have 0 flags.
                //throw new ProtocolException("CGP_BIND_REQUEST/RESPONSE must not have header extensions");
            }
        } else {
            // All remaining commands have normal header extensions

            var extensions   = new Array(CGPConstants.MAX_HEADER_EXTENSIONS);
            var noExtensions = 0;

            var flagsBase = 0;

            // Iterate through all header extension flag bytes extracting
            // enabled headers.
            var flags;
            do {
                flags = processedData.readUInt8();

                for(var bit = 0; bit < 7; bit++) {
                    if ((flags & (1 << bit)) != 0) {
                        extensions[noExtensions++] = flagsBase + bit;
                    }
                }

                flagsBase += 7;
            } while((flags & 0x80) == 0x80 &&
                    flagsBase < CGPConstants.MAX_HEADER_EXTENSIONS);

            if (flagsBase > CGPConstants.MAX_HEADER_EXTENSIONS) {
                // Header extension flags are only allowed to use up to 32 bytes.
                ////throw new ProtocolException("Too many header extension flag bytes");
            }

            var extensionData = processedData;

            for (var i = 0; i < noExtensions; i++) {
                switch(extensions[i]) {
                    case CGPConstants.CGP_HEADER_EXT_LENGTH__INDEX:
                        var extLength = extensionData.readVarInt();
                        // We know exactly how much extension data should now remain,
                        // consume data from this block so we can perform bounds checking.
                        extensionData = extensionData.readBuffer(extLength);
                        break;

                    case CGPConstants.CGP_HEADER_MONITORING__INDEX:
                        //throw new UnsupportedOperationException("Channel monitoring is not supported");

                    case CGPConstants.CGP_HEADER_COMPRESSION__INDEX:
                        //throw new UnsupportedOperationException("Compression is not supported");

                    case CGPConstants.CGP_HEADER_RELIABILITY__INDEX:
                        if (!reliable) {
                            //throw new ProtocolException("Reliabilty header received but reliability not enabled");
                        }

                        processReliabilityHeader(extensionData);
                        break;

                    default:
                        //throw new ProtocolException("Unknown header extension");
                }
            }
        }

        return processedData;
    }

    /**
     */
    function processSignature(data) {
        // Add support for future CGP versions, should not be a problem at the
        // moment because the server should not elevate the version on us.
        writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Start process Signature");
        for (var i = 0; data.length > 0; i++) {
            if (data.readUInt8() != CGPConstants.CGP_HEADER[i]) {
                //throw new ProtocolException("Unrecognised CGP signature");
                writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Unrecognised CGP Signature");
            }
        }
    }

    /**
    function processBindRequest(data) {
        // Should not get a bind request, we're a client only SDK for the
        // moment.
        //throw new ProtocolException("CGP_BIND_REQUEST not supported");
    }*/

    function processBindResponse(data) {
        writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Processing Bind response");
        data.readReservedByte(); // discard reserved byte
        data.readReservedByte(); // discard reserved byte
        var noCaps = data.readVarInt();

        // Read capabilities
        for (var i = 0; i < noCaps; i++) {
            var capLength = data.readVarInt();
            var svcId     = data.readUInt16();
            var capId     = data.readUInt16();
            data.readReservedByte(); // discard reserved byte
            data.readReservedByte(); // discard reserved byte

            var capBody = data.readBuffer(capLength - 6);
            switch(coreState) {
                case CORESTATE_CONNECTING:
                    //console.log("Setting Capabilities");
                    setCapability(svcId, capId, capBody);
                    break;

                case CORESTATE_RECONNECTING:
                    setReconnectCapability(svcId, capId, capBody);
                    break;

                default:
                    //throw new IllegalStateException("Bind response when not in appropriate state");
                    writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: ERROR :|: Bind response when not in appropriate state");
            }
        }

        var oldState = coreState;

        if (coreState == CORESTATE_RECONNECTING) {
            // Resend all unacked messages
            // USing A Hash for unackedPackets.
            var i=0;            // To ensure that i is Integer.
            for(i in unackedPackets){
                var packet = unackedPackets[i];
                writeData(packet, 0, packet.length);
            }
        }

        changeCoreState(CORESTATE_CONNECTED);

        // CGP Connection handshake has been completed, tell the user program
        if (oldState == CORESTATE_CONNECTING) {
            user.sessionAccepted();
            writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Session Connected after Bind Response");
        } else {
            // oldState == CORESTATE_RECONNECTING
            user.sessionResumed();
            callBackWrapper.hideReconnectingOverlay();
			callBackWrapper.CGP_Resume();
            writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Session Resumed after Bind Response");
        }
        writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: End of Processing Bind Response data");
    }

    
    /**
     */
    function processFinishRequest(data){
        writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Processing Finish Request");
        var subCommand = data.readUInt8();
        data.readReservedByte(); // discard reserved byte
        if (subCommand != CGPConstants.CGP_FINISH_TYPE_CLOSE &&
            subCommand != CGPConstants.CGP_FINISH_TYPE_RESTART)
        {
            //throw new ProtocolException("Only CLOSE and RESTART finish sub commands are supported");
        }
        finishRequestReceived = true;
        if (finishInitiator) {
            if (!finishResponseReceived) {
                // This appears to be a simultaneous close
            } else {
                // We initiated the close so we are now done.
                finishIsRestart = subCommand == CGPConstants.CGP_FINISH_TYPE_RESTART;

                changeCoreState(CORESTATE_DISCONNECTED);

                // Inform the user program that the connection has been closed.
                notifyConnectionClosed();
            }
            // Tell the server that the connection has been closed.
            sendFinishResponse(subCommand);
        } else {
            // Give services and user program a chance to write out any final data.
            notifyConnectionClosing();
            // Tell the server that the connection has been closed.
            sendFinishResponse(subCommand);
            // The server initiated the disconnect, now tell it to close too
            sendFinishRequest(subCommand);
        }
    }

    /**
     * This would never have been hit.
     */
    function processFinishResponse(data){
        writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Processing Finish Response");
        var subCommand = data.readUInt8();
        data.readReservedByte(); // discard reserved byte

        if (subCommand != CGPConstants.CGP_FINISH_TYPE_CLOSE &&
            subCommand != CGPConstants.CGP_FINISH_TYPE_RESTART)
        {
            //throw new ProtocolException("Only CLOSE and RESTART finish sub commands are supported");
        }
        finishResponseReceived = true;
        if (!finishInitiator || finishRequestReceived) {
            // Other side initiated the disconnect, we are now done.
            changeCoreState(CORESTATE_DISCONNECTED);
            // Tell everyone we're closed
            notifyConnectionClosed();
        }
    }

    /**
     * Calls connectionClosing on all bound CGPServices and then calls
     * sessionClosing on the registered CGPUser.
     */
    function notifyConnectionClosing() {
        // Inform all services that the connection is being closed.
        for(var i = 0; i < boundServices.length; i++) {
            boundServices[i].connectionClosing();
        }
        // Inform the user program that the connection is being closed.
        user.sessionClosing();
    }

    /**
     * Calls connectionClosed on all bound CGPServices and then calls
     * sessionClosed on the registered CGPUser.
     */
    function notifyConnectionClosed() {
        // Inform all services that the connection has been closed.
        for(var i = 0; i < boundServices.length; i++) {
            boundServices[i].connectionClosed();
        }
        // Inform the user program that the connection has been closed.
        user.sessionClosed();
    }
    /**
		This is a hack to inform TD on network disconnects in ChromeOS.
     */
     


    function processNop(data) {
        //No processing necessary
    }
    /**
     */
    function processChannelOpenRequest(data) {
        //throw new UnsupportedOperationException("CGP_CHANNEL_OPEN_REQUEST not supported");
    }

    function processChannelOpenResponse(data) {
        var channelId     = data.readVarInt();
        var status        = data.readUInt16();
        var serviceStatus = data.readUInt16();
        data.readReservedByte(); // discard reserved byte
        data.readReservedByte(); // discard reserved byte
        var paramsLen     = data.readVarInt();

        // Find the channel object that we have received an open response for.
        var channel = getChannel(channelId);

        if (channel == null) {
            // We don't know about the channel.
            //throw new ProtocolException("Unknown channel");
        }
        // Tell the service what happpened
        channel.service.channelOpenResponse(channel, data, status, serviceStatus);

        // TODO: should we destroy the channel before telling the service that it
        // has not been opened correctly?
        if (status != CGPConstants.CGP_CHANNEL_OPEN_STATUS_ACCEPTED) {
            // Channel has not been opened, remove it from the channel Id
            // mapping table.
            channel.destroy();
        }
    }

    /**
     */
    function processChannelClose(data) {
        writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Processing Channel Close");
        var channelId = data.readVarInt();
        data.readReservedByte(); // discard reserved byte
        data.readReservedByte(); // discard reserved byte
        var status        = data.readUInt16();
        var serviceStatus = data.readUInt16();
        // Find the channel that should be asked to close.
        var channel = getChannel(channelId);
        if (channel == null) {
            // The channel has either never been opened or has been closed.
            //throw new ProtocolException("Unknown channel");
        }
        // Tell the channel that it should close.
        channel.closeReceived(status, serviceStatus);
    }

    function processData(data) {
        var flags     = data.readUInt8();
        var channelId = data.readVarInt();

        // Find the channel that should be processing this data.
        var channel = getChannel(channelId);
        if (channel == null) {
            // The channel has either never been opened or has been closed.
            //throw new ProtocolException("Unknown channel");
        }
        // Does the packet contain a partial message?
        var partial = ((flags & CGPConstants.CGP_DATA_FLAG_PARTIAL) == CGPConstants.CGP_DATA_FLAG_PARTIAL);
        // Deliver the data to the channel
        channel.dataArrived(data, partial);
    }



    function processDataRealtimeWithAck(data) {


        var ackDelta = data.readVarInt();

        // TODO: should we process the data first?
        // The channel's meant to be realtime after all!
        //	("Flush packets As this is real time Data with Ack");
        processAckDelta(ackDelta);
        var realTimeData = data.readBuffer(data.length);
        processDataRealtime(realTimeData);
     }

    /** */

    function processDataRealtime(data) {
        // Realtime data packets use a prearanged channel rather than identifying
        // it by number.  Retrieve that channel if there is one.
        var channel = getRealtimeChannel();
        if (channel == null) {
            // There does not appear to be a realtime channel, rant.
            //throw new ProtocolException("No realtime channel available");
        }
        // Realtime packets have an implied CGP_RELIABILITY_EXTENSION_TRACK_MESSAGE
        if (reliable) {
            lastReceivedPacket++;
        }
        // Deliver the data to the channel
        channel.dataArrived(data, false);
    }

    // Channel handling
    // ================

    /**
     * Returns true when the CGPCore is running in server mode (ie. the peer initiated
     * the connection.)
     * @return true, if the CGP sdk is running as the CGP server, false otherwise.
     *
     */
    function isServer() {
        // This does not currently support server mode
        return false;
    }
    /**
     * Generates a channel number for a new channel opened by this end of the
     * connection.
     * @return the new channel number.
    */
    function assignChannelNumber() {
        while(channels[nextChannelId] != null) {
            nextChannelId++;
        }

        var channelId = nextChannelId;
        var channelNo = (channelId << 1) | CGPConstants.CHANNEL_ID_CLIENT_BIT;
        // Assuming always to return Channel 0//;
        nextChannelId++;
        return channelNo;
    }

    function createAndRegisterChannel(service, framed, priority) {
        // Is this channel to be opened as a real time channel?
        var realTime = CGPConstants.CGP_CHANNEL_PRIORITY_REALTIME;
        if (realTime && realtimeChannel != null) {
            // Only one realtime channel can be opened at a time.
            //throw new IllegalStateException("A realtime channel has already been opened");
        }
        // Generate an id number for the new channel.
        var id = assignChannelNumber();
        // Create a new channel object
        var channel = new CGPChannel(myself, service, id, framed, realTime);
        // Put the channel object in the channel mapping table
        channels[channel.channelId] =  channel;
        // If the channel is a realtime one register it as such.
        if (realTime) {
            realtimeChannel = channel;
        }
        return channel;
    }
    /**
     * Creates a new CGPChannel object with a unique Id and stores it in the id->channel
     * lookup table.  If the channel is a realtime priority channel it also stores it
     * in the realtime channel slot.
     * @param service the service to which the new channel object is to be bound.
     * @param framed true if the channel is to run in framed connection mode.
     * @param priority the priority of the channel, one of:
     * @return the new CGPChannel object.
     */
     this.openChannel = function(boundService, framed, priority, channelOpenHeader) {
        // Create a channel object and register it with the CGP core.
        var channel = createAndRegisterChannel(boundService, framed, priority);

        // Tell the server that we want to open a channel
        var openRequest = sendOpenChannelRequest(boundService.getServiceId(),
                                                    channel.channelId,
                                                        framed ? CGPConstants.CGP_CHANNEL_FRAMING_MESSAGE :
                                                    CGPConstants.CGP_CHANNEL_FRAMING_STREAM,   // TODO: handle other framing types?
                                                    priority,
                                                    channelOpenHeader);

        if (reliable) {
            channel.storeOpenRequest(openRequest);
        }
        return channel;
     };

    /**
     * Removes the supplied channel from the channel mapping table.
     * Also deregisters the realtimeChannel if it is the registered one.
     * @param channel the channel to deregister.
     */
    this.deregisterChannel = function(channel) {
        // Remove the channel from the channel mapping table
        delete channels[channel.channelId];

        // If this channel is registered as the realtime channel deregister
        // it from there too.
        if (realtimeChannel == channel) {
            realtimeChannel = null;
        }
    };

    /**
     * Retrieves a channel from the channel mapping table.
    */
    function getChannel(channelId) {
        return channels[channelId];
    }
    /**
     * Retrives the realtime channel if there is one.
     */
    function getRealtimeChannel() {
        return realtimeChannel;
    }


    // Reliability support
    // ===================

    function processReliabilityHeader(header) {
        var flags = header.readUInt8();

        if ((flags & CGPConstants.CGP_RELIABILITY_EXTENSION_TRACK_MESSAGE) != 0) {
            // This packet should be acked
            lastReceivedPacket++;
        }
        if ((flags & CGPConstants.CGP_RELIABILITY_EXTENSION_ACK) != 0) {
            // Header contains an ack
            var ackDelta = header.readVarInt();
            processAckDelta(ackDelta);
        }
    }

    /**
     * Discards buffered packets that have been acknowledged by the server.
     * @param delta the number of buffered packets to discard.
     */
    function processAckDelta(delta) {
		if(delta == 0){
			return;
		}

        if (delta < 0) {
            //throw new ProtocolException("Cannot unack packets: delta = " + delta);
            writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: ERROR :|: Cannot unack packets: delta = " + delta);
            return -1;
        }
        nextMessageInSentList += delta;

        try {
            var i = 0;
            var j = 0;
			var temp =-1;
            for(i in unackedPackets){
                if(j<delta){
                    j++;
                    var b = unackedPackets[i];
                    delete unackedPackets[i];
                    unackedPacketsSize -= b.length;
                } else{
					if(temp == -1){
						temp = i;
					}
					//break;
				}
            }
        }catch (e){
            //throw new ProtocolException("More ACKs have been received than packets sent: delta = " + delta);
            writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: ERROR :|: More ACKs have been received than packets sent: delta = ", delta);
        }
    }

    /**
     * Returns the number of packets to ack.
     */
    function getAndResetAckDelta() {
        var ackDelta = lastReceivedPacket - lastSentAck;
        if (ackDelta > 0) {
            lastSentAck = lastReceivedPacket;
            return ackDelta;
        }
        return 0;
    }

    /**
     * Determines whether a nop is due to be sent.
     * @returns true if a nop with ACK should be sent.
     */
    function getNopRequired() {
        if (!reliable || coreState != CORESTATE_CONNECTED)
        {
            return CGPConstants.CGP_FALSE;
        }


        var ackDelta = lastReceivedPacket - lastSentAck;
		//lastSentAck = lastReceivedPacket;
        // TODO: use correct value
        return (ackDelta > 5);
        //
		//return (ackDelta > 0) ? true : false;
    }
    //
    function recordPacket(packet) {
        if (!reliable) return;
        unackedPackets[packetNo++] = packet;
        unackedPacketsSize += packet.length;
    }


    function setReconnectCapability(svcId, capId, body)
    {
        if (svcId == CGPConstants.CGP_SERVICEID_CORE) {
            switch(capId) {
                case CGPConstants.CGP_CAPABILITY_SERVICES_BINDING:
                case CGPConstants.CGP_CAPABILITY_KEEP_ALIVES:
                case CGPConstants.CGP_CAPABILITY_ENDPOINT_ADDRESS:
                case CGPConstants.CGP_CAPABILITY_CHANNEL_MONITORING:
                case CGPConstants.CGP_CAPABILITY_COMPRESSION:
                    // TODO: verify that everything else is the same as the original connection?
                    break;

                case CGPConstants.CGP_CAPABILITY_SECURITY_TICKET:
                    var securityTicketCapability = new SecurityTicketCapability(securityTicketType, securityTicketData);
                    handleSecurityTicketCapability(securityTicketCapability.read(body));
                    break;

                case CGPConstants.CGP_CAPABILITY_SESSION_RELIABILITY:
                    var reliabilityCapability = new ReliabilityCapability();
                    handleReconnectReliabilityCapability(reliabilityCapability.read(body));
                    break;

                default:
                    //throw new ProtocolException("Capability " + capId + " not known");
            }
        }
    }


    function handleReliabilityCapability(cap) {
        // TODO: configure reliability
        reconnectTicketVersion = cap.reconnectTicketVersion;
        reconnectTicket        = cap.reconnectTicket;
    }

    /**
     */
    function handleReconnectReliabilityCapability(cap){
        reconnectTicketVersion = cap.reconnectTicketVersion;
        reconnectTicket        = cap.reconnectTicket;
		nextMessageToSend	   = cap.nextMessageNumber;
        if(nextMessageToSend == 0){
            writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Server Does not want to reconnect. Closing the connection");
            socket.Disconnect();
        }

        if (nextMessageToSend < nextMessageInSentList) {
            writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: THIS SHOULD NOT BE HIT");
        }
        writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Next Message Number is : " + nextMessageToSend + "Next Message in List is : " + nextMessageInSentList);
        var ackDelta = nextMessageToSend - nextMessageInSentList;
        // Flush packets that have already been received by the server
        processAckDelta(ackDelta);
    }


    function handleSecurityTicketCapability(cap) {
        securityTicketType = cap.ticketType;
        securityTicketData = cap.ticketData;
    }

    // other stuff
    

    function setCapability(svcId, capId, body)
    {
        writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Setting Capability of service ID: " + svcId);
        writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Setting Capability of capability ID: " + capId);

        if (svcId == CGPConstants.CGP_SERVICEID_CORE) {
            // These capabilities are handled directly here rather than
            // being passed to a service.

            switch(capId) {
                case CGPConstants.CGP_CAPABILITY_SERVICES_BINDING:
                    writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Bind Capability Handling hit");
                    var bindCapability = new BindCapability(knownServices);
                    handleBindCapability(bindCapability.read(body))
                    break;

                case CGPConstants.CGP_CAPABILITY_KEEP_ALIVES:
                    writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Keep Alives Capability Handling hit");
                    var keepAliveCapability = new KeepAliveCapability();
                    handleKeepAliveCapability(keepAliveCapability.read(body));
                    break;

                case CGPConstants.CGP_CAPABILITY_SESSION_RELIABILITY:
                    writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Session Reliability Capability Handling hit");
                    var reliabilityCapability = new ReliabilityCapability();
                    handleReliabilityCapability(reliabilityCapability.read(body));
					//var newtworkMonitor = new NetworkMonitor(networkStateChange, networkStateChange);
					if (!window.chrome || !window.chrome.app || !window.chrome.app.window){
						//HTML5 session
						window.addEventListener("offline", networkStateChange);
					}else{
						//Chrome app session
						var networkMonitor = new ChromeNetworkMonitor(networkStateChange, networkStateChange);
					}
                    break;

                case CGPConstants.CGP_CAPABILITY_SECURITY_TICKET:
                    writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Security Ticket Capability Handling hit");
                    var securityTicketCapability = new SecurityTicketCapability(securityTicketType, securityTicketData);
                    handleSecurityTicketCapability(securityTicketCapability.read(body));
                    break;
				case CGPConstants.CGP_CAPABILITY_RELIABILITY_PARAMS:
					writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Reliability Params Capability Handling hit");
					var reliabilityParamsCapability = new ReliabilityParamsCapability();
					handleReliabilityParamsCapability(reliabilityParamsCapability.read(body));
					break;
				
                case CGPConstants.CGP_CAPABILITY_ENDPOINT_ADDRESS:
                case CGPConstants.CGP_CAPABILITY_CHANNEL_MONITORING:
                case CGPConstants.CGP_CAPABILITY_COMPRESSION:
                default:
                    //throw new ProtocolException("Capability " + capId + " not supported");
                    writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Capability with " + capId +" not supported." );
            }
        } else {
            // Find the service which owns this capability
            var svc = serviceIds[svcId];

            if (svc != null) {
                // Tell the service about the capability block.
                svc[capId] = body;
            } else {
                // We don't know about the service this capability is varended for.
                //throw new ProtocolException("Capability for unregistered service delivered");
                writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: Capability for unregistered service delivered");
            }
        }
    }


    function handleBindCapability(cap) {
        boundServices = new Array(cap.noServices);
        // Iterate through all services in the bind capability block.
        for(var i = 0; i < boundServices.length; i++) {
            // Get the service from the list of known services.
            boundServices[i] = getKnownServiceByName(cap.names[i]);
            if (boundServices[i] == null) {
                // We do not have a service with the specified name.
                //throw new ProtocolException("Unrecognised service name '" + cap.names[i] + "' in BindCapability");
                return 0    ;
            }
            // Tell the service the version it should be running as and its id.
            boundServices[i].bind(cap.versions[i], cap.ids[i]);
            // Add the service to the svcid -> service mapping table.
            serviceIds[cap.ids[i]] =  boundServices[i];
        }
    }

    /**
     * Retrieves the CGPService object with the supplied name from the known services list.
     * @param name the name of the service to find.
     * @returns the CGPService if a matching one was found, null otherwise.
     */
    function getKnownServiceByName(name) {
        // Iterate over the list of known services.
        var strName = String.fromCharCode.apply(null, new Uint8Array(name));
        for(var i = 0; i < knownServices.length; i++) {
            // Perform a case insensitive comparison of the service name.
            if (knownServices[i].getServiceName() === strName) {
                // Found the service.
                return knownServices[i];
            }
        }
        // Failed to find the service, return null.
        return null;
    }

    /**
     */
    function handleKeepAliveCapability(cap) {
        // TODO: configure keepalives
    }
	
	function handleReliabilityParamsCapability(cap){
		reliabilityTimeOut	= cap.getReliabilityTimeout();	//	read the server sent values
		UIFlags 			= cap.getUIFlag();				// 
		UIDimmingPercentage = cap.getUIDimmingPercentage();	//	Override if any.
		estimatedTCPTimeout = cap.getEstimatedTCPTimeout();	//	This value is ignored as of now.
		writeHTML5Log(0, "SESSION :|: CGP :|: CGP-CORE :|: INFO:|: The server sent values of  RELIABILITY TIMEOUT : " + reliabilityTimeOut + " UI FLAGS : " + UIFlags + " UI DIMMING PERCENTAGE : " + UIDimmingPercentage + " TCP TIMEOUT: " + estimatedTCPTimeout);
		if(!dependency.testEnv){
			CEIP.add('network:reconnectionTimeOut',reliabilityTimeOut);
		}
	}

    /* Exposing the functions as public in case of UT
       To be used only for UT shouldn't affect the code*/
    if(dependency.testEnv === true) {
        var myself = this;
        var arr = [sendFinishRequest];

        /*CreateWrapper function creates a wrapper around the private functions
         that need to be verified in UT scripts.
         The wrapper is created by routing the private function calls
         through exposed public functions so that UT framework detects the private function call references. */
        for(var i=0;i<arr.length;i++){
            //To ensure UT runs successfully with correct function reference
            var wrapperObj = unitTestUtils.createWrapper(myself,arr[i]);
            this[arr[i].name] = wrapperObj.actualFn;
            fns[arr[i].name] = wrapperObj.wrapper;
        }

		//this.sendPacket = sendPacket;
        this.networkStateChange = networkStateChange;
        this.getSentOpenRequests  = getSentOpenRequests;
        this.sendNop = sendNop;
        this.processAckDelta = processAckDelta;
        this.getAndResetAckDelta = getAndResetAckDelta;
        this.isConnected = isConnected;
        this.isSuspended = isSuspended;
        this.isServer = isServer;
        this.sendFinishResponse = sendFinishResponse;
        this.sendFinishRequest = sendFinishRequest;
        this.getKnownServiceByName = getKnownServiceByName;

        this.setCapability = setCapability;
        this.assignChannelNumber = assignChannelNumber;
        this.createAndRegisterChannel = createAndRegisterChannel;
        //this.sendOpenChannelRequest = sendOpenChannelRequest;
    }

}
