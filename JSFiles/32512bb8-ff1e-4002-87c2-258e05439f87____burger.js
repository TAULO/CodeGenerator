(function(_,PROTO, EventEmitter) {
	if(typeof(PROTO) === 'undefined') PROTO = {};

	var Burger = {GLOBAL: {RECORD_PROTOVERSION: 15, 
						   IDENTITY_GUID: "",
						   PRODUCT_CODE: 93, //https://cml.avast.com/display/FF/Avast+Analytics+Product+Code
						   PRODUCT_VARIANT: null, //Avast or AVG variant of safeprice: Avast = 0 AVG = 1
						   PRODUCT_VERSION: "",
						   PRODUCT_INTERNALVERSION: "",
						   PRODUCT_PLATAFORM: 0,
						   PRODUCT_PLATAFORMVERSION: "",
						   INIT_ME_CALLED: false, //to know if we have all we need to send to burger
						   ENV: "prod" //to change later via gulp config in the future -> ENV : {__EnvironmentType__}, /*"dev"*/ /* "sta"; */ /* "prod"; */
						},
				  Gpb : {},				  
				  Collection: {},
				  Query: {}};

	Burger.initGlobalData = function(data, sendAll){
		if (Burger.GLOBAL.INIT_ME_CALLED){
			Burger.mergeGlobalData(data);
		} 
		else{
			Burger.GLOBAL.IDENTITY_GUID = data.guid;
			Burger.GLOBAL.PRODUCT_VARIANT = data.variant;
			Burger.GLOBAL.PRODUCT_VERSION = data.version;
			Burger.GLOBAL.PRODUCT_INTERNALVERSION = data.internal_version;
			Burger.GLOBAL.PRODUCT_PLATAFORM = data.platform;
			Burger.GLOBAL.PRODUCT_PLATAFORMVERSION = data.platform_version;
			Burger.GLOBAL.INIT_ME_CALLED = true;
			//console.log("initGlobalData: " + JSON.stringify(Burger.GLOBAL));
		}
		AvastWRC.Burger.emitEvent("burger.sendAll", sendAll);
	};		

	Burger.mergeGlobalData = function(data){
		//console.log("before mergeGlobalData: " + JSON.stringify(Burger.GLOBAL));
		if (Burger.GLOBAL.IDENTITY_GUID != data.guid) Burger.GLOBAL.IDENTITY_GUID = data.guid;
		if(Burger.GLOBAL.PRODUCT_VARIANT != data.variant) Burger.GLOBAL.PRODUCT_VARIANT = data.variant;
		if(Burger.GLOBAL.PRODUCT_VERSION != data.version) Burger.GLOBAL.PRODUCT_VERSION = data.version;
		if(Burger.GLOBAL.PRODUCT_INTERNALVERSION != data.internal_version) Burger.GLOBAL.PRODUCT_INTERNALVERSION = data.internal_version;
		if(Burger.GLOBAL.PRODUCT_PLATAFORM != data.platform) Burger.GLOBAL.PRODUCT_PLATAFORM = data.platform;
		if(Burger.GLOBAL.PRODUCT_PLATAFORMVERSION != data.platform_version) Burger.GLOBAL.PRODUCT_PLATAFORMVERSION = data.platform_version;
		//console.log("after mergeGlobalData: " + JSON.stringify(Burger.GLOBAL));
	};  
	/**
	* Fuction to define Gpb type
	*/
	Burger.Gpb.GpbType = function(id, multilicity, typeFunc) {
		return {
			options: {},
			multiplicity: multilicity || PROTO.optional,
			type: typeFunc,
			id: id
		};
	},

	/* Gpb Definition helper */ 
	_.extend(Burger.Gpb, {
		GPBD : {
			bytes: function(id, repeated) {
				return Burger.Gpb.GpbType(id, repeated, function() { return PROTO.bytes; } );
			},
			string: function(id, repeated) {
				return Burger.Gpb.GpbType(id, repeated, function() { return PROTO.string; } );
			},
			bool: function(id, repeated) {
				return Burger.Gpb.GpbType(id, repeated, function() { return PROTO.bool; } );
			},
			sint32: function(id, repeated) {
				return Burger.Gpb.GpbType(id, repeated, function() { return  PROTO.sint32; } );
			},
			sint64: function(id, repeated) {
				return Burger.Gpb.GpbType(id, repeated, function() { return  PROTO.sint64; } );
			},
			int32: function(id, repeated) {
				return  Burger.Gpb.GpbType(id, repeated, function() { return  PROTO.int32; } );
			},
			int64: function(id, repeated) {
				return  Burger.Gpb.GpbType(id, repeated, function() { return  PROTO.int64; } );
			},
			Double: function(id, repeated) {
				return  Burger.Gpb.GpbType(id, repeated, function() { return  PROTO.Double; } );
			},
			cType : Burger.Gpb.GpbType
		},
	}),

	_.extend(Burger.Gpb, {		 
		/*******************************************************************************
		* > Avast Analytics Messaging 
		******************************************************************************/
		Request : PROTO.Message("Burger.Gpb.Request",{
			
			Envelope: PROTO.Message("Burger.Gpb.Request.Envelope",{
				record: Burger.Gpb.GPBD.cType(1, PROTO.repeated, function() { return Burger.Gpb.Request.Envelope.Record;}),  

				Record: PROTO.Message("Burger.Gpb.Request.Envelope.Record",{
					proto_version: Burger.Gpb.GPBD.int32(8,PROTO.optional),
					event: Burger.Gpb.GPBD.cType(2, PROTO.repeated, function() { return Burger.Gpb.Request.Envelope.Event;}), 
					identity: Burger.Gpb.GPBD.cType(1, PROTO.optional, function() { return Burger.Gpb.Request.Envelope.Identity;}),
					product: Burger.Gpb.GPBD.cType(4, PROTO.optional, function() { return Burger.Gpb.Request.Envelope.Product;}), 
					connection: Burger.Gpb.GPBD.cType(10, PROTO.optional, function() { return Burger.Gpb.Request.Envelope.Connection;})
				}),

				Event: PROTO.Message("Burger.Gpb.Request.Envelope.Event",{
					type: Burger.Gpb.GPBD.int32(1,PROTO.repeated),
					time: Burger.Gpb.GPBD.sint64(2,PROTO.optional),
					time_zone: Burger.Gpb.GPBD.sint32(5,PROTO.optional), 		
					blob: Burger.Gpb.GPBD.bytes(11,PROTO.optional),
					blob_type: Burger.Gpb.GPBD.int32(12,PROTO.optional), 
					
				}),

				Identity: PROTO.Message("Burger.Gpb.Request.Envelope.Identity",{					
					guid: Burger.Gpb.GPBD.string(9, PROTO.optional)
					
				}),

				Product: PROTO.Message("Burger.Gpb.Request.Envelope.Product",{
					code: Burger.Gpb.GPBD.int32(7, PROTO.optional),
					version: Burger.Gpb.GPBD.bytes(2, PROTO.optional), 
					internal_version: Burger.Gpb.GPBD.int32(9, PROTO.optional), 
					variant: Burger.Gpb.GPBD.int32(8, PROTO.optional), 
					platform: Burger.Gpb.GPBD.cType(3, PROTO.optional, function() { return Burger.Gpb.Request.Envelope.Product.Platform;}),
					platform_version: Burger.Gpb.GPBD.string(4, PROTO.optional), 

					Platform: PROTO.Enum("Burger.Gpb.Request.Envelope.Product.Platform",{
						WINDOWS: 1,
						OSX: 2,
						IOS: 3,
						LINUX: 4,
						ANDROID: 5
					}),
				}),

				Connection: PROTO.Message("Burger.Gpb.Request.Envelope.Connection",{
					origin: Burger.Gpb.GPBD.cType(1, PROTO.optional, function() { return Burger.Gpb.Request.Envelope.Connection.Origin;}),
					send_time: Burger.Gpb.GPBD.int64(2, PROTO.optional),
					
					Origin: PROTO.Enum("Burger.Gpb.Request.Envelope.Connection.Origin",{
						CLIENT: 1
						
					})
				}),
			}),

			/**************************************************************************/
			/* ende envelope  													      */
			/**************************************************************************/
		}),
		
		Response : PROTO.Message("Burger.Gpb.Response",{
        })
	});
	
	Burger.Build = {
		
		recordMessage : function(eventsToSend){
			var record = new Burger.Gpb.Request.Envelope.Record;
			record.proto_version = Burger.GLOBAL.RECORD_PROTOVERSION; 
			record.event = eventsToSend;
			record.identity = this.identityMessage();
			record.product = this.productMessage();
			record.connection = this.connectionMessage();
			//console.log("recordMessage: " + JSON.stringify(record));
			return record;
		},
		
		connectionMessage : function(){
			var connection = new Burger.Gpb.Request.Envelope.Connection;
			connection.origin = Burger.Gpb.Request.Envelope.Connection.Origin.CLIENT;
			connection.send_time = PROTO.I64.fromNumber(Math.round((new Date).getTime()/1000));
			//console.log("connectionMessage: " + connection);
			return connection;
		},
		
		productMessage : function(productVariant){
			var product  = new Burger.Gpb.Request.Envelope.Product;
			product.code = Burger.GLOBAL.PRODUCT_CODE;
			product.version = PROTO.encodeUTF8(Burger.GLOBAL.PRODUCT_VERSION); //bytes
			product.internal_version = Burger.GLOBAL.PRODUCT_INTERNALVERSION;
			product.variant = Burger.GLOBAL.PRODUCT_VARIANT;
			product.platform = Burger.Gpb.Request.Envelope.Product.Platform[Burger.GLOBAL.PRODUCT_PLATAFORM];
			product.platform_version = Burger.GLOBAL.PRODUCT_PLATAFORMVERSION;
			//console.log("productMessage: " + JSON.stringify(product));
			return product;
		},
		
		identityMessage : function(identityGuid){
			var identity = new Burger.Gpb.Request.Envelope.Identity;
			identity.guid = Burger.GLOBAL.IDENTITY_GUID;
			//console.log("identityMessage: " + JSON.stringify(identity));
			return identity;
		}, 

		eventMessage : function(eventType, blob){
			if(blob == undefined || blob == null)return null;

			var blobEventInfo = Burger.GLOBAL.BLOB_EVENTS_INFO[eventType];
			if(blobEventInfo == undefined)return null;

			var eventData = new Burger.Gpb.Request.Envelope.Event;	

			eventData.type.push(blobEventInfo.firstLevel);
			eventData.type.push(blobEventInfo.secondLevel);
			eventData.type.push(blobEventInfo.thirdLevel);
			eventData.blob_type = blobEventInfo.type;
			var eventDate = new Date();
			eventData.time = PROTO.I64.fromNumber(Math.round(eventDate.getTime()/1000.0));
			eventData.time_zone = eventDate.getTimezoneOffset();
			eventData.blob = blob;
			//console.log("eventMessage: " + JSON.stringify(eventData));

			return eventData;
		}
	};
	
	Burger.Collection = {
		events : {
			eventList : [],
			BATCH_MAX_MESSAGES : 20,
			//BATCH_MAX_SIZE : 65536 // 64k
		},
				
		addEvent : function(eventDetails){
			var blob = Burger.Build.blobMessage(eventDetails);
			if (blob == null){
				console.log("Error unable to bluild blob -- event details: " + eventDetails);
				return;
			}
			var event = Burger.Build.eventMessage(eventDetails.eventType, blob)
			if(event == null){
				console.log("Error unable to bluild event-- event type: " + eventDetails.eventType + " blob data: " + blob);
				return;
			}

			var numberOfEvents = Burger.Collection.events.eventList.length;
			
			if (numberOfEvents < Burger.Collection.events.BATCH_MAX_MESSAGES)
				Burger.Collection.events.eventList.push(event);
			else {
				Burger.Collection.sendEvents(numberOfEvents);//will be send only if the needed variables were initialized
				Burger.Collection.events.eventList.push(event);
			}
		},
		
		sendEvents : function(numberOfEvents){
			if(!Burger.GLOBAL.INIT_ME_CALLED){
				console.log("Burger was not initialized yet, can't send events");
				return;
			}
			//copy elements to be send remove all those elemments
			//make the request to burger.
			var eventsToSend = [];
			if(numberOfEvents <= Burger.Collection.events.BATCH_MAX_MESSAGES){
				var eventsToSend = this.events.eventList.splice(0,numberOfEvents);
				if (eventsToSend.length != 0){
					var record = Burger.Build.recordMessage(eventsToSend);
					//console.log("Record: " + JSON.stringify(record));
					var queryOptions = {record: record};
					new Burger.Query.Envelope(queryOptions);
				}		
			}else{
				while(numberOfEvents >=  Burger.Collection.events.BATCH_MAX_MESSAGES){
					Burger.Collection.sendEvents(Burger.Collection.events.BATCH_MAX_MESSAGES);
					numberOfEvents = Burger.Collection.events.eventList.length;
				}					
				if(numberOfEvents > 0)
					Burger.Collection.sendEvents(numberOfEvents);
			}			 						
		},

		sendAll : function(isWindowClosing){
			var numberOfEvents = 0;
			if(isWindowClosing && Burger.GLOBAL.INIT_ME_CALLED){
				numberOfEvents = Burger.Collection.events.eventList.length;
				while(numberOfEvents >  Burger.Collection.events.BATCH_MAX_MESSAGES){
					Burger.Collection.sendEvents(Burger.Collection.events.BATCH_MAX_MESSAGES);
					numberOfEvents = Burger.Collection.events.eventList.length;
				}					
				if(numberOfEvents > 0)
					Burger.Collection.sendEvents(numberOfEvents);
			}
		}
	};

	Burger.Query = {		
		HEADERS : {
			//"Accept": "binary",
			//dataType: 'binary',
			"Content-Type": "application/octet-stream",
			//"Connection": "keep-alive" // refused in Chrome
		},
		SERVER : {
			"dev" : "http://analytics-dev.ff.avast.com/receive3",
			"sta" : "",
			"prod" : "https://analytics.ff.avast.com:443/receive3"
		},
	};
	
	Burger.Query.__MASTER__ = {
		completed : false,
		/**
		 * Initialize UrlInfo request.
		 * @return {[type]} [description]
		 */
		init : function(){
			this.headers = _.extend({}, Burger.Query.HEADERS, this.headers);
			// Populate proto message
			this.message();
			// Send it to server
			if(this.options.go) this.post();
		},
		headers : {},
		/**
		 * Set an option value
		 * @param {String} option Property name
		 * @param {}     value  Property value
		 */
		set : function (option, value) {
			this.options[option] = value;
			return this;
		},
		/**
		 * Get an option value
		 * @param  {String} option Property name
		 * @return {}           Property value
		 */
		get : function (option) {
			return this.options[option];
		},
		/**
		 * return json string of the message
		 * @return {Object} Json representation of the GPB message
		 */
		toJSON : function(){
			var protoJSON = function (p) {
				var res = {};
				for(var prop in p.values_) {
				if(p.values_[prop].length) {
					// repeated message
					res[prop] = [];
					for(var i=0, j=p.values_[prop].length; i<j; i++) {
					res[prop].push(protoJSON(p.values_[prop][i]));
					}
				} else if(p.values_[prop].properties_){
					// composite message

					res[prop] = {};
					for(var krop in p.values_[prop].values_) {
					if(p.values_[prop].values_[krop] instanceof PROTO.I64) {
						// convert PROTO.I64 to number
						res[prop][krop] = p.values_[prop].values_[krop].toNumber();
					}else {
						res[prop][krop] = p.values_[prop].values_[krop];
					}
					}
				} else {
					// value :: deprecated - remove it
					res[prop] = p.values_[prop];
				}
				}
				return res;
			};
			return protoJSON(this.response);
		},
		/**
		 * Send request to server
		 * @return {Object} Self reference
		 */
		post : function(){
			if (this.options.server.indexOf(":null") !== -1) {
				return this;
			}

			var buffer = this.getBuffer(this.request);
			//console.log("Request:", JSON.stringify(this.request.message_type_), this.options.server, JSON.stringify(this.request.values_));

			var self = this;
			var xhr = new XMLHttpRequest();
			xhr.open(this.options.method.toUpperCase(), this.options.server, true);
			xhr.responseType = "arraybuffer";
			xhr.withCredentials = true;
			xhr.timeout = this.options.timeout || 0; // default to no timeout

			for(var prop in this.headers) {
				xhr.setRequestHeader(prop, this.headers[prop]);
			}

			xhr.onload = function(e) {    	  
				var status = 0;
				var errorCodes = [400, 401, 403, 405, 406, 408, 413, 414, 500];
				if(typeof e.srcElement !== "undefined"){
					status = e.srcElement.status;
				}
				else if(typeof e.target !== "undefined"){
					status = e.target.status;
				}								
				if(errorCodes[status]){
					var bodyEncodedInString = String.fromCharCode.apply(String, new Uint8Array(xhr.response));
					console.log("Response Status: "+status  +" Error: "+ bodyEncodedInString);	
					// TODO 
					//on error -> add the events to a new record to send again LATER:		
				} 
				else{
					var bodyEncodedInString = String.fromCharCode.apply(String, new Uint8Array(xhr.response));
					console.log("Response Status: "+status  +" Message: "+ bodyEncodedInString);
				}
				
				//self.callback(xhr.response);
			};
			xhr.onerror = function() {
				self.error(xhr);
			};
			xhr.ontimeout = function() {
				self.error(xhr);
			};
			
			xhr.send(buffer);
			
			return this;
		},
		/**
		 * Convert message to ArrayBuffer
		 * @param  {Object} message Message instance
		 * @return {Array}         Array Buffer
		 */
		getBuffer : function(message){

			var stream = new PROTO.ByteArrayStream;
			message.SerializeToStream(stream);
			return this.baToab(stream.getArray());
		},
		/**
		 * Handle server response
		 * @param  {Array}   arrayBuffer Incoming message
		 * @return {void}
		 */
		callback : function (arrayBuffer) {
			var format = this.options.format;
			var res = null;
			if ('string' === format) {
				res = String.fromCharCode.apply(String, this.abToba(arrayBuffer));
			} else {
				console.log('Response:', JSON.stringify(res));
				this.parser(arrayBuffer);

				if(this.updateCache) { this.updateCache(); }

				if('json' === format) {
				res = this.toJSON();
				}
				else if('object' === format) {
				res = this.format();
				}
				else {
				res = this.response;
				}
			}
			
			console.log('Response:', JSON.stringify(res));
			this.options.callback(res);
			this.completed = true;
		},
		/**
		 * Handle error responses
		 * @param  {Object} xhr xmlhttp request object
		 * @return {void}
		 */
		error : function(xhr){			
			if(this.options.error) this.options.error(xhr);
		},
		/**
		 * Placeholder - each Instance can override this to format the message
		 * @return {[type]} [description]
		 */

		format : function(){
			return { error : "This call has now formatting message.", message: this.response };
		},
		/**
		 * parse arrayBuffer into a ProtoJS response
		 * @param  {Array} arrayBuffer
		 * @return {void}
		 */
		parser : function (arrayBuffer){
			this.response.ParseFromStream(new PROTO.ByteArrayStream(this.abToba(arrayBuffer)));
		},
		/**
		 * ByteArray to ArrayBuffer
		 * @param  {Object} data [description]
		 * @return {Array}
		 */
		baToab: function(data){
			var buf = new ArrayBuffer(data.length);

			var bytes = new Uint8Array(buf);
			for(var i = 0; i < bytes.length; i++) {
				bytes[i] = data[i] % 256;
			}

			return bytes;
		},
		/**
		 * ArrayBuffer to ByteArray
		 * @param  {Array} arrayBuffer [description]
		 * @return {Array}             [description]
		 */
		abToba: function(arrayBuffer){
			if(arrayBuffer === null) return [];
			var bytes = new Uint8Array(arrayBuffer);
				var arr = [];
			for(var i = 0; i < bytes.length; i++) {
				arr[i] = bytes[i] % 256;
			}
				return arr;
		},			
	};

	Burger.Query.Envelope = function(options) {
		if (!options) return false; // no record data

		this.options = _.extend({
			server: Burger.Query.SERVER[Burger.GLOBAL.ENV],
			method: "post",
			timeout: 10000, // 10s
			callback: _.noop,
			format: "object", // return response in JSON
			go: true, // true = trigger the request immediately
		}, options);

		this.request = new Burger.Gpb.Request.Envelope;
		this.response = new Burger.Gpb.Response;
		this.init();
	};

	Burger.Query.Envelope.prototype = _.extend({}, Burger.Query.__MASTER__, {
		/**
		 * build PROTO message
		 */
		message: function() {
			this.request.record.push(this.options.record);
	
			return this;
		},
	});

	_.extend(Burger, {
		/**
		* EventEmitter instance to hangle background layer events.
		* @type {Object}
		*/
		_ee: new EventEmitter({wildcard:true, delimiter: ".",}),
		/**
		 * Register events with instance of EventEmitter.
		 * @param  {Object} callback to register with instance of eventEmitter
		 * @return {void}
		 */
		registerEvents: function(registerCallback, thisArg) {
			if (typeof registerCallback === "function") {
				registerCallback.call(thisArg, this._ee);
			}
		},
		// TODO mean to unregister the events
		/**
		 * Emit background event
		 * @param {String} event name
		 * @param {Object} [arg1], [arg2], [...] event arguments
		 */
		emitEvent: function() {
		// delegate to event emitter
			this._ee.emit.apply(this._ee, arguments);
		},
	});
	
	Burger.registerEvents(function(ee) {
		ee.on('burger.initme', Burger.initGlobalData); // to initialize some specific data and send all event if it is 
		ee.on('burger.newEvent', Burger.Collection.addEvent); //every time an event occur add it to the list to be send
		ee.on('burger.sendAll', Burger.Collection.sendAll); //to send all remaining events not used from client at the moment
															// use initme instead sending all needed info to be sure all events will
															//be send.
	});
	
	// export as AvastWRC.Burger
	AvastWRC.Burger = Burger;
}).call(this, _, AvastWRC.PROTO, EventEmitter2);

(function(_,Burger, PROTO) {
	_.extend(Burger.GLOBAL, {
		BLOB_EVENTS_INFO : {
			//SPMPClientEvents$ClientEvent
			"SAFE_SHOP_DOMAIN_VISITED" : {firstLevel: 55,secondLevel: 1, thirdLevel: 1, type: 1}, //SPMPClientEvents$ClientEvent 55.1.1
			"SHOW_BAR": {firstLevel: 55,secondLevel: 1, thirdLevel: 2, type: 1}, //SPMPClientEvents$ClientEvent 55.1.2
			"HIDE_ON_THIS_DOMAIN": {firstLevel: 55,secondLevel: 1, thirdLevel: 3, type: 1}, //SPMPClientEvents$ClientEvent 55.1.3
			"SHOW_ON_THIS_DOMAIN": {firstLevel: 55,secondLevel: 1, thirdLevel: 4, type: 1}, //SPMPClientEvents$ClientEvent 55.1.4
			"HIDE_ON_ALL_DOMAINS": {firstLevel: 55,secondLevel: 1, thirdLevel: 5, type: 1}, //SPMPClientEvents$ClientEvent 55.1.5
			"SHOW_ON_ALL_DOMAINS": {firstLevel: 55,secondLevel: 1, thirdLevel: 6, type: 1}, //SPMPClientEvents$ClientEvent 55.1.6
			"SHOW_HELP": {firstLevel: 55,secondLevel: 1, thirdLevel: 7, type: 1}, //SPMPClientEvents$ClientEvent 55.1.7
			"CLOSE_BAR": {firstLevel: 55,secondLevel: 1, thirdLevel: 8, type: 1}, //SPMPClientEvents$ClientEvent 55.1.8
			"BAR_SHOWN": {firstLevel: 55,secondLevel: 1, thirdLevel: 9, type: 1}, //SPMPClientEvents$ClientEvent 55.1.9
			"AVAST_WEBSITE": {firstLevel: 55,secondLevel: 1, thirdLevel: 10, type: 1}, //SPMPClientEvents$ClientEvent 55.1.10
			//SPMPClientEvents$PickedOfferEvent
			"OFFER_PICKED": {firstLevel: 55,secondLevel: 2, thirdLevel: 1, type: 1}, //SPMPClientEvents$PickedOfferEvent 55.2.1

		}
	});
	_.extend(Burger.Gpb,{
		Blob : PROTO.Message("Burger.Gpb.Blob",{	
			/**************************************************************************/
			/* Client Identity												  		  */
			/**************************************************************************/	
			ClientInfo: PROTO.Message("Burger.Gpb.Blob.ClientInfo",{
				language: Burger.Gpb.GPBD.string(1, PROTO.optional),
				referer: Burger.Gpb.GPBD.string(2, PROTO.optional), 
				extension_guid: Burger.Gpb.GPBD.string(3, PROTO.optional),
				browser: Burger.Gpb.GPBD.cType(4, PROTO.optional, function() { return Burger.Gpb.Blob.ClientInfo.Browser;}),     
				extension: Burger.Gpb.GPBD.cType(5, PROTO.optional, function() { return Burger.Gpb.Blob.ClientInfo.Extension;}),
				campaign_id: Burger.Gpb.GPBD.string(8, PROTO.optional),

				Browser: PROTO.Message("Burger.Gpb.Blob.ClientInfo.Browser",{
					type: Burger.Gpb.GPBD.cType(1, PROTO.optional, function() { return Burger.Gpb.Blob.ClientInfo.Browser.BrowserType;}), // same values as on UrlInfo-> BrowserType
					version: Burger.Gpb.GPBD.string(2, PROTO.optional),
					language: Burger.Gpb.GPBD.string(3, PROTO.optional),

					BrowserType: PROTO.Enum("Burger.Gpb.Blob.ClientInfo.Browser.BrowserType",{
						CHROME: 0,
						FIREFOX: 1,
						IE: 2,
						OPERA: 3,
						SAFARI: 4,
						MS_EDGE: 5
					})
				}),
				Extension: PROTO.Message("Burger.Gpb.Blob.ClientInfo.Extension",{		
					type: Burger.Gpb.GPBD.cType(1, PROTO.optional, function() { return Burger.Gpb.Blob.ClientInfo.Extension.ExtensionType;}), // same values as on UrlInfo ExtensionType
					version: Burger.Gpb.GPBD.string(2, PROTO.optional),

					ExtensionType: PROTO.Enum("Burger.Gpb.Blob.ClientInfo.Extension.ExtensionType",{
						SP: 0, // SafePrice multiprovider extension
						SPAP: 1 // SafePrice multiprovider together with AvastPay
					})
				})           
			}),
			/**************************************************************************/
			/* ende Client Identity												  	  */
			/**************************************************************************/
			/**************************************************************************/
			/* Picked offer										  					  */
			/**************************************************************************/
			PickedOffer : PROTO.Message("Burger.Gpb.Blob.PickedOffer",{

				GeneralOffer: PROTO.Message("Burger.Gpb.Blob.PickedOffer.GeneralOffer",{
					title: Burger.Gpb.GPBD.string(1, PROTO.optional),
					price: Burger.Gpb.GPBD.Double(2, PROTO.optional),
					formatted_price: Burger.Gpb.GPBD.string(3, PROTO.optional),
					url: Burger.Gpb.GPBD.string(4, PROTO.optional),
					affiliate: Burger.Gpb.GPBD.string(5, PROTO.optional),
					//recommended: Burger.Gpb.GPBD.bool(6, PROTO.optional),
					image: Burger.Gpb.GPBD.string(7, PROTO.optional),
				}),

				Product: PROTO.Message("Burger.Gpb.Blob.PickedOffer.Product",{
					offer: Burger.Gpb.GPBD.cType(1, PROTO.optional, function() { return Burger.Gpb.Blob.PickedOffer.GeneralOffer;}),
					availability: Burger.Gpb.GPBD.string(2,PROTO.optional),
					availability_code: Burger.Gpb.GPBD.string(3,PROTO.optional), 
					saving: Burger.Gpb.GPBD.string(4,PROTO.optional),  
					shipping: Burger.Gpb.GPBD.string(5,PROTO.optional),
				}),

				Accommodation: PROTO.Message("Burger.Gpb.Blob.PickedOffer.Accommodation",{
					AccommodationType: PROTO.Enum("Burger.Gpb.Blob.PickedOffer.Accommodation.AccommodationType",{
						UNKNOWN: 0,
						HOTEL: 1,
						CITY_HOTEL: 2,
						SIMILAR_HOTEL: 3
					}),
					offer: Burger.Gpb.GPBD.cType(1, PROTO.optional, function() { return Burger.Gpb.Blob.PickedOffer.GeneralOffer;}),
					priority: Burger.Gpb.GPBD.int32(2,PROTO.optional),
					address: Burger.Gpb.GPBD.string(3,PROTO.optional), 
					stars: Burger.Gpb.GPBD.int32(4,PROTO.optional),  
					additional_fees: Burger.Gpb.GPBD.bool(5,PROTO.optional),
					price_netto: Burger.Gpb.GPBD.Double(6,PROTO.optional),
					saving: Burger.Gpb.GPBD.string(7,PROTO.optional),  
					type: Burger.Gpb.GPBD.cType(8,PROTO.optional, function(){ return Burger.Gpb.Blob.PickedOffer.Accommodation.AccommodationType;})
				}),

				Voucher : PROTO.Message("Burger.Gpb.Blob.PickedOffer.Voucher",{
					VoucherType: PROTO.Enum("Burger.Gpb.Blob.PickedOffer.Voucher.VoucherType",{
						GENERAL: 0,
						PRODUCT: 1,
						ACCOMMODATION: 2,
					}),
					title: Burger.Gpb.GPBD.string(1, PROTO.optional),
					//category: Burger.Gpb.GPBD.string(2, PROTO.optional),
					url : Burger.Gpb.GPBD.string(3, PROTO.optional),
					affiliate: Burger.Gpb.GPBD.string(4, PROTO.optional),
					value: Burger.Gpb.GPBD.string(5, PROTO.optional),
					expire_date: Burger.Gpb.GPBD.string(6, PROTO.optional),
					code: Burger.Gpb.GPBD.string(7, PROTO.optional),
					text: Burger.Gpb.GPBD.string(8, PROTO.optional),
					free_shipping: Burger.Gpb.GPBD.bool(9, PROTO.optional),
					type: Burger.Gpb.GPBD.cType(10,PROTO.optional, function(){ return Burger.Gpb.Blob.PickedOffer.Voucher.VoucherType;})
				}), 

				product: Burger.Gpb.GPBD.cType(1, PROTO.optional, function() { return Burger.Gpb.Blob.PickedOffer.Product;}),
				voucher: Burger.Gpb.GPBD.cType(2, PROTO.optional, function() { return Burger.Gpb.Blob.PickedOffer.Voucher;}),
				accommodation: Burger.Gpb.GPBD.cType(3, PROTO.optional, function() { return Burger.Gpb.Blob.PickedOffer.Accommodation;})            
						
			}),
			/**************************************************************************/
			/* ende Picked offer								  					  */
			/**************************************************************************/
			/**************************************************************************/
			/* BLOB-SPMP  	SafepriceMultiprovider Events  					 	      */
			/**************************************************************************/
			/* Container for client events (except PickedOffer)						  */ 
			ClientEvent : PROTO.Message("Burger.Gpb.Blob.ClientEvent",{		
				client: Burger.Gpb.GPBD.cType(1, PROTO.optional, function() { return Burger.Gpb.Blob.ClientInfo;}),	
				url: Burger.Gpb.GPBD.string(2, PROTO.optional),
			}),
			/*Client Event (Picked offer)											  */
			PickedOfferEvent : PROTO.Message("Burger.Gpb.Blob.PickedOfferEvent",{		
				client: Burger.Gpb.GPBD.cType(1, PROTO.optional, function() { return Burger.Gpb.Blob.ClientInfo;}),	
				url: Burger.Gpb.GPBD.string(2, PROTO.optional),
				picked_offer: Burger.Gpb.GPBD.cType(3, PROTO.optional, function() { return Burger.Gpb.Blob.PickedOffer;}),
				provider_id: Burger.Gpb.GPBD.string(4, PROTO.optional),
				query: Burger.Gpb.GPBD.string(5, PROTO.optional), 
				best_offer:  Burger.Gpb.GPBD.bool(6, PROTO.optional) 
			}),
		})
	});
	_.extend(Burger.Build,{
		browserInfo: function(browserInfo){          
			var _browserInfo = new Burger.Gpb.Blob.ClientInfo.Browser;
			_browserInfo.type = browserInfo.type;
			_browserInfo.version = browserInfo.version;
			_browserInfo.language =browserInfo.language;
			//console.log("browserInfo: " + JSON.stringify(_browserInfo));
			return _browserInfo;
        },

		extensionInfo: function(extensionInfo){
			var _extensionInfo = new Burger.Gpb.Blob.ClientInfo.Extension;
			_extensionInfo.type = extensionInfo.type;
			_extensionInfo.version = extensionInfo.version;   
			//console.log("extensionInfo: " + JSON.stringify(_extensionInfo));
			return _extensionInfo;
		},

		clientInfoMessage: function(clientInfo){
			var _clientInfo = new Burger.Gpb.Blob.ClientInfo;
			_clientInfo.language = clientInfo.language;
			_clientInfo.referer = clientInfo.referer;
			_clientInfo.extension_guid = clientInfo.extension_guid;
			_clientInfo.browser = this.browserInfo(clientInfo.browser);
			_clientInfo.extension = this.extensionInfo(clientInfo.extension);
			_clientInfo.campaign_id = clientInfo.campaign_id;
			//console.log("clientInfoMessage: " + JSON.stringify(_clientInfo));
            return _clientInfo;
		},

		pickedOfferMessage: function (offer, offerCategory){
			
			var pickedOffer = new Burger.Gpb.Blob.PickedOffer;
			
			pickedOffer.product = new Burger.Gpb.Blob.PickedOffer.Product;
			pickedOffer.product.offer = new Burger.Gpb.Blob.PickedOffer.GeneralOffer;

			pickedOffer.voucher = new Burger.Gpb.Blob.PickedOffer.Voucher;

			pickedOffer.accommodation = new Burger.Gpb.Blob.PickedOffer.Accommodation;
			pickedOffer.accommodation.offer = new Burger.Gpb.Blob.PickedOffer.GeneralOffer;

			if(offerCategory == "PRODUCT"){
				pickedOffer.product.offer["title"] = offer["label"] || "";
				pickedOffer.product.offer["price"] = offer["price"] || 0;
				pickedOffer.product.offer["formatted_price"] = offer["fprice"] || "";
				pickedOffer.product.offer["url"] = offer["url"] || "";
				pickedOffer.product.offer["affiliate"] = offer["affiliate"] || "";
				//pickedOffer.product.offer["recommended"] = offer["recommended"] || 0;
				pickedOffer.product.offer["image"] = offer["image"] || "";
				pickedOffer.product["availability"] = offer["availability"] || "";
				pickedOffer.product["availability_code"] = offer["availability_code"] || "";
				pickedOffer.product["saving"] = offer["saving"] || "";
				pickedOffer.product["shipping"] = offer["shipping"] || "";
			}
			else if(offerCategory == "ACCOMMODATION"){	
				pickedOffer.accommodation.offer["title"] = offer["label"] || "";
				pickedOffer.accommodation.offer["price"] = offer["price"] || 0;
				pickedOffer.accommodation.offer["formatted_price"] = offer["fprice"] || "";
				pickedOffer.accommodation.offer["url"] = offer["url"] || "";
				pickedOffer.accommodation.offer["affiliate"] = offer["affiliate"] || "";
				//pickedOffer.accommodation.offer["recommended"] = offer["recommended"] || 0;
				pickedOffer.accommodation.offer["image"] = offer["image"] || "";
				pickedOffer.accommodation["priority"] = offer["priority"] || 0;
				pickedOffer.accommodation["address"] = offer["address"] || "";
				pickedOffer.accommodation["stars"] = offer["stars"] || 0;
				pickedOffer.accommodation["additional_fees"] = offer["additional_fees"] || 0;
				pickedOffer.accommodation["price_netto"] = offer["price_netto"] || 0;
				pickedOffer.accommodation["saving"] = offer["saving"] || "";
				pickedOffer.accommodation["type"] = offer["type"] || 0;		
			}
			else if(offerCategory == "VOUCHER"){
				pickedOffer.voucher["title"] = offer["label"] || "";
				//pickedOffer.voucher["category"] = offer["category"] || "";
				pickedOffer.voucher["url"] = offer["url"] || "";
				pickedOffer.voucher["affiliate"] = offer["affiliate"] || "";
				pickedOffer.voucher["expire_date"] = offer["expire_date"] || "";
				pickedOffer.voucher["code"] = offer["code"] || "";
				pickedOffer.voucher["text"] = offer["coupon_text"] || "";
				pickedOffer.voucher["free_shipping"] = offer["free_shipping"] || 0;
				pickedOffer.voucher["type"] = offer["type"] || 0;
			}
			//console.log("pickedOfferMessage: " + JSON.stringify(pickedOffer));
			return pickedOffer;
		},

		blobMessage : function(eventDetails){
			// safe price specific blob parameter			
		
			var blobEventInfo =  Burger.GLOBAL.BLOB_EVENTS_INFO[eventDetails.eventType];
			if(blobEventInfo == undefined){
				console.log("error blobMessage type not defined-- eventDetails: " + JSON.stringify(eventDetails));
				return null;
			}
			var blob;
			var offer = eventDetails.offer?eventDetails.offer:null;
			var offerCategory = eventDetails.offerCategory?eventDetails.offerCategory:"";
			if (blobEventInfo.secondLevel == 2  && offer != null && offerCategory != ""){
				blob = new Burger.Gpb.Blob.PickedOfferEvent;
				blob.picked_offer = this.pickedOfferMessage(offer, offerCategory);
				blob.provider_id = eventDetails.providerId?eventDetails.providerId:"";
				blob.query = eventDetails.query?eventDetails.query:"";
				blob.best_offer = eventDetails.bestOffer?eventDetails.bestOffer:"";
			}
			else if(blobEventInfo.secondLevel == 1){
				blob = new Burger.Gpb.Blob.ClientEvent;
			}else{
				//console.log("error on blobMessage type not recognized-- eventDetails: " + JSON.stringify(eventDetails) + " eventTypeSecondLevel: " + blobEventInfo.secondLevel);
				return null;
			}

			var clientInfo = eventDetails.clientInfo?eventDetails.clientInfo:null;
			if(clientInfo != null)
				blob.client = this.clientInfoMessage(clientInfo);

			blob.url = eventDetails.url?eventDetails.url:"";

			console.log("Burger-> blobMessage: " + JSON.stringify(blob));
			blob = Burger.Query.__MASTER__.abToba(AvastWRC.Query.__MASTER__.getBuffer(blob));
			return blob;
		}
		
	});
}).call(this, _, AvastWRC.Burger, AvastWRC.PROTO);