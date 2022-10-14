jingo.declare({
  require: [
    "com.christy.web.clazz.JClass",
    "com.christy.web.utils.StringUtils"
  ],
  name: "com.christy.web.xmpp.XmppStanza",
  as: function() {
  	var JClass = com.christy.web.clazz.JClass;
  	var StringUtils = com.christy.web.utils.StringUtils;
  	
  	com.christy.web.xmpp.XmppStanza = function(){};
	// start of XmlStanza
	com.christy.web.xmpp.XmppStanza.XmlStanza = JClass.extend({
		init: function(){
			
		},
		
		toXml: function(){
			return null;
		}
	});
	// end of XmlStanza
	
	var XmlStanza = com.christy.web.xmpp.XmppStanza.XmlStanza;
	
	// start of AbstractXmlStanza
	com.christy.web.xmpp.XmppStanza.AbstractXmlStanza = XmlStanza.extend({
		init: function() {
		    this._super();
		},
		
		getStanzaId: function(){
	        if (this.stanzaId != null
	        	&& AbstractXmlStanza.ID_NOT_AVAILABLE == this.stanzaId) {
	                return null;
	        }
	
	        if (this.stanzaId == null) {
	                this.stanzaId = AbstractXmlStanza.nextID();
	        }
	        return this.stanzaId;
	    },
	    
	    setStanzaId: function(stanzaId){
	    	this.stanzaId = stanzaId;
	    }
	    
	
	});
	
	var AbstractXmlStanza = com.christy.web.xmpp.XmppStanza.AbstractXmlStanza;
	
	AbstractXmlStanza.ID_NOT_AVAILABLE = "ID_NOT_AVAILABLE"
	
	AbstractXmlStanza.prefix = StringUtils.randomString(5) + "-";
	
	AbstractXmlStanza.id = 0;
	
	AbstractXmlStanza.nextID = function(){
		return AbstractXmlStanza.prefix + (AbstractXmlStanza.id++);
	}
	
	// end of AbstractXmlStanza
	
	
	
	// start of PacketExtension
	
	com.christy.web.xmpp.XmppStanza.PacketExtension = XmlStanza.extend({
		init: function() {
		    this._super();
		},
		
		getElementName: function(){
			return null;
		},
		
		getNamespace: function(){
			return null;
		}
	});
	
	// end of PacketExtension
	
	var PacketExtension = com.christy.web.xmpp.XmppStanza.PacketExtension;
	
	// start of UnknownExtension
	com.christy.web.xmpp.XmppStanza.UnknownExtension = PacketExtension.extend({
		init: function(xmlElement) {
		    this._super();
		    this.xmlElement = xmlElement;
		},
		
		getElementName: function() {
			return xmlElement.nodeName;
		},
		
		getNamespace: function() {
			return xmlElement.getAttribute("xmlns");
		},
		
		generateXml: function(element) {
			var xml = "";
			if (element.nodeType == 1) {
				xml += "<" + element.nodeName;
				var attributes = element.attributes;
				for (var i = 0; i < attributes.length; ++i) {
					var attribute = attributes[i];
					xml += " " + attribute.nodeName + "=\"" + attribute.nodeValue + "\"";
					
				}
				xml += ">";
				var childNodes = element.childNodes;
				for (var i = 0; i < childNodes.length; ++i) {
					var childNode = childNodes[i];
					if (childNode.nodeType == 1) {
						xml += this.generateXml(childNode);
					} else if (childNode.nodeType == 3) {
						xml += childNode.nodeValue;
					}
				}
				
				xml += "</" + element.nodeName + ">";
			}
			return xml;
		},
		
		toXml: function() {
			return this.generateXml(this.xmlElement);
		}
	});
	// end of UnknownExtension
	
	var PacketExtension = com.christy.web.xmpp.XmppStanza.PacketExtension;
	
	
	// start of XmppError
	com.christy.web.xmpp.XmppStanza.ErrorType = {
		WAIT: 'wait',
		CANCEL: 'cancel',
		MODIFY: 'modify',
		AUTH: 'auth',
		CONTINUE: 'continue'
	}
	
	com.christy.web.xmpp.XmppStanza.XmppError = XmlStanza.extend({
		init: function(code, type) {
		    this._super();
		    this.code = code;
		    this.type = type;
		    this.conditions = new Array();
		    this.packetExtensions = new Array();
		},
		
		setCode: function(code) {
	    	this.code = code;
		},
		
		getCode: function(){
			return this.code;
		},
		
		setType: function(type) {
	    	this.type = type;
		},
		
		getType: function() {
			return this.type;
		},
		
		addCondition: function(element, namespace) {
			this.conditions.push({
				element: element,
				namespace: namespace
			});
		},
		
		removeCondition: function(element, namespace) {
			for (var i = 0; i < this.conditions.length; ++i) {
				if (this.conditions[i].element == element
					&& this.conditions[i].namespace == namespace) {
					this.conditions.splice(i,1);
				}
			}
		},
		
		getConditions: function() {
			return this.conditions;
		},
		
		setMessage: function(message) {
			this.message = message;
		},
		
		getMessage: function() {
			return this.message;
		},
		
		addPacketExtension: function(extension) {
			this.packetExtensions.push(extension);
		},
		
		removePacketExtension: function(extension) {
			for (var i = 0; i < this.packetExtensions.length; ++i) {
				if (this.packetExtensions[i] == exten) {
					this.packetExtensions.splice(i,1);
				}
			}
		},
		
		getPacketExtensions: function() {
			return this.packetExtensions;
		},
		
		toXml: function() {
		    var xml = "";
		    xml += "<error code=\"" + this.code + "\"";
		    
		    if (this.type != null) {
		    	xml += " type=\"";
		    	xml += this.type;
		    	xml += "\"";
		    }
		    xml += ">";
		    
		    for (var i = 0; i < this.conditions.length; ++i) {
				xml += "<" + this.conditions[i].element + 
					" xmlns=\"" + this.conditions[i].namespace + "\"/>";
			}
		    
		    if (this.message != null) {
		    	xml += "<text xmlns=\"urn:ietf:params:xml:ns:xmpp-stanzas\">";
				xml += StringUtils.escapeXml(this.message);
				xml += "</text>";
		    }
		    
		    for (var j = 0; j < this.packetExtensions.length; ++j) {
		            xml += this.packetExtensions[j].toXml();
		    }
		    
			xml += "</error>";
		    return xml;
	    }
		
	});
	
	// end of XmppError
	
	
	// start of Packet
	com.christy.web.xmpp.XmppStanza.Packet = AbstractXmlStanza.extend({
		init: function() {
			this._super();
			this.packetExtensions = new Array();
		},
		
		setTo: function(to) {
			this.to = to;
		},
		
		getTo: function() {
			return this.to
		},
		
	    setFrom: function(from) {
	    	this.from = from;
	    },
	    
		getFrom: function() {
	    	return this.from;
	    },
	    
	    setLanguage: function(language) {
	    	this.language = language;
	    },
	    
		getLanguage: function() {
	    	return this.language;
	    },
	    
	    setXmppError: function(xmppError) {
			this.xmppError = xmppError;
		},
		
		getXmppError: function() {
			return this.xmppError
		},
		
		addPacketExtension: function(extension) {
			this.packetExtensions.push(extension);
		},
		
		removePacketExtension: function(extension) {
			for (var i = 0; i < this.packetExtensions.length; ++i) {
				if (this.packetExtensions[i] == exten) {
					this.packetExtensions.splice(i,1);
					break;
				}
			}
		},
		
		getPacketExtensions: function() {
			return this.packetExtensions;
		},
		
		getPacketExtension: function(elementName, namespace) {
			for (var i = 0; i < this.packetExtensions.length; ++i) {
				var extension = this.packetExtensions[i];
				if (extension.getElementName() == elementName
					 && extension.getNamespace() == namespace) {
					return extension;
				}
			}
			return null;
		},
		
		getExtensionsXml: function() {
			var xml = "";
			
			for (var i = 0; i < this.packetExtensions.length; ++i) {
				xml += this.packetExtensions[i].toXml();
			}
			return xml;
		}
		
	});
	
	// end of Packet
	
	var Packet = com.christy.web.xmpp.XmppStanza.Packet;
	
	// start of Iq
	com.christy.web.xmpp.XmppStanza.IqType = {
		GET: 'get',
		SET: 'set',
		ERROR: 'error',
		RESULT: 'result'
	}
	
	com.christy.web.xmpp.XmppStanza.Iq = Packet.extend({
		init: function(type) {
		    this._super();
		    this.type = type;
		},
		
		setType: function(type){
			this.type = type;
		},
		
		getType: function(){
			return this.type;
		},
		
		toXml: function(){
	        var xml = "";
	        xml += "<iq";
	        
	        if (this.getLanguage() != null){
	        	xml += " xml:lang=\"" + this.getLanguage() + "\"";
	        }
	        
	        if (this.getStanzaId() != null){
				xml += " id=\"" + this.getStanzaId() + "\"";
	        }
	        
	        if (this.getTo() != null){
				xml += " to=\"" + this.getTo().toFullJID() + "\"";
	        }
	        
	        if (this.getFrom() != null){
				xml += " from=\"" + this.getFrom().toFullJID() + "\"";
	        }
	        
	        if (this.type == null){
	        	xml += " type=\"get\">";
	        } else {
	            xml += " type=\"" + this.getType() + "\">";
	        }
	
	        var extensionXml = this.getExtensionsXml();
	        if (extensionXml != null){
	        	xml += extensionXml;
	        }
	        // Add the error sub-packet, if there is one.
	        var error = this.getXmppError();
	        
	        if (error != null){
				xml += error.toXml();
	        }
	        xml += "</iq>";
	        return xml;
	    }
		
	});
	
	// end of Iq
	
	
	// start of Presence
	
	com.christy.web.xmpp.XmppStanza.PresenceType = {
		
		AVAILABLE: "available",
		
	    UNAVAILABLE: "unavailable",
	
	    SUBSCRIBE: "subscribe",
	
	    SUBSCRIBED: "subscribed",
	
	    UNSUBSCRIBE: "unsubscribe",
	
	    UNSUBSCRIBED: "unsubscribed",
	
	    PROBE: "probe",
	
	    ERROR: "error"
		
	}
	
	var PresenceType = com.christy.web.xmpp.XmppStanza.PresenceType;
	
	com.christy.web.xmpp.XmppStanza.PresenceShow = {
		
		CHAT: "chat",
	
	    AVAILABLE: "available",
	
	    AWAY: "away",
	
	    XA: "xa",
	
	    DND: "dnd"
	
	}
	
	var PresenceShow = com.christy.web.xmpp.XmppStanza.PresenceShow;
	
	com.christy.web.xmpp.XmppStanza.Presence = Packet.extend({
		init: function(type) {
		    this._super();
		    this.type = type;
		},
		
		isAvailable: function(){
	    	return this.type == PresenceType.AVAILABLE;
	    },
	    
	    isAway: function(){
			return this.type == PresenceType.AVAILABLE
					&& (this.show == PresenceShow.AWAY 
							|| this.show == PresenceShow.XA
							|| this.show == PresenceShow.DND);
		},
		
		setType: function(type){
			this.type = type;
		},
		
		getType: function(){
			return this.type;
		},
		
		setUserStatus: function(userStatus){
			this.userStatus = userStatus
		},
		
		getUserStatus: function(){
			return this.userStatus;
		},
		
		setPriority: function(priority){
			if (priority < -128 || priority > 128){
	        	throw new Error(0, 
	        					"Priority value " + 
	        					priority + 
	        					" is not valid. Valid range is -128 through 128.");
	        }
			
			this.priority = priority;
		},
		
		getPriority: function(){
			return this.priority;
		},
		
		setShow: function(show){
			this.show = show;
		},
		
		getShow: function(){
			return this.show;
		},
		
		toXml: function(){
	        var xml = "";
	        xml += "<presence";
	        if (this.getLanguage() != null){
	        	xml += " xml:lang=\"" + this.getLanguage() + "\"";
	        }
	        if (this.getStanzaId() != null){
				xml += " id=\"" + this.getStanzaId() + "\"";
	        }
	        if (this.getTo() != null){
	        	xml += " to=\"" + this.getTo().toFullJID() + "\"";
	        }
	        if (this.getFrom() != null){
				xml += " from=\"" + this.getFrom().toFullJID() + "\"";
	        }
	        if (this.type != PresenceType.AVAILABLE){
				xml += " type=\"" + this.type + "\"";
	        }
	        xml += ">";
	        if (this.getUserStatus() != null){
				xml += "<status>" + StringUtils.escapeXml(this.getUserStatus()) + "</status>";
	        }
	        if (this.priority != null){
				xml += "<priority>" + this.priority + "</priority>";
	        }
	        if (this.show != null && this.show != PresenceShow.AVAILABLE){
				xml += "<show>" + this.show + "</show>";
	        }
	
			var extensionXml = this.getExtensionsXml();
	        if (extensionXml != null){
	        	xml += extensionXml;
	        }
	
	        // Add the error sub-packet, if there is one.
	        var error = this.getXmppError();
	        if (error != null){
				xml += error.toXml();
	        }
	
	        xml += "</presence>";
	
	        return xml;
		}
	
	});
	// end of Presence
	
	//start of Message
	com.christy.web.xmpp.XmppStanza.MessageType = {
		
		NORMAL: "normal",
	
		CHAT: "chat",
	
		GROUPCHAT: "groupchat",
	
		HEADLINE: "headline",
	
		ERROR: "error"
		
	}
	
	var MessageType = com.christy.web.xmpp.XmppStanza.MessageType;
	
	com.christy.web.xmpp.XmppStanza.MessageBody = XmlStanza.extend({
		init: function(language, body) {
		    this._super();
		    this.language = language;
		    this.body = body;
		},
		
		setLanguage: function(language){
			this.language = language;
		},
		
		getLanguage: function(){
			return this.language;
		},
		
		setBody: function(body){
			this.body = body;
		},
		
		getBody: function(){
			return this.body;
		},
		
		toXml: function(){
			var xml = "";         
	        xml += "<body xml:lang=\"" + this.language + "\">";
	        xml += StringUtils.escapeXml(this.body);
	        xml += "</body>";
	        return xml;
			
		}
	});
	
	var MessageBody = com.christy.web.xmpp.XmppStanza.MessageBody
	
	
	com.christy.web.xmpp.XmppStanza.MessageSubject = XmlStanza.extend({
		init: function(language, subject) {
		    this._super();
		    this.language = language;
		    this.subject = subject;
		},
		
		setLanguage: function(language){
			this.language = language;
		},
		
		getLanguage: function(){
			return this.language;
		},
		
		setSubject: function(subject){
			this.subject = subject;
		},
		
		getSubject: function(){
			return this.subject;
		},
		
		toXml: function(){
			var xml = "";         
	        xml += "<subject xml:lang=\"" + this.language + "\">";
	        xml += StringUtils.escapeXml(this.subject);
	        xml += "</subject>";
	        return xml;
			
		}
	});
	
	var MessageSubject = com.christy.web.xmpp.XmppStanza.MessageSubject;
	
	com.christy.web.xmpp.XmppStanza.Message = Packet.extend({
		init: function(type) {
		    this._super();
		    this.type = type;
		    this.bodies = new Array();
		    this.subjects = new Array();
		},
		
		setType: function(type){
			this.type = type;
		},
		
		getType: function(){
			return this.type;
		},
		
		setThread: function(thread){
			this.thread = thread;
		},
		
		getThread: function(){
			return this.thread;
		},
		
		setBody: function(body){
			this.body = body;
		},
		
		getBody: function(){
			return this.body;
		},
		
		addBody: function(body){
			this.bodies.push(body);
		},
		
		removeBody: function(body){
			if (body instanceof MessageBody){
				for (var i = 0; i < this.bodies.length; ++i){
					if (this.bodies[i] == body){
						this.bodies.splice(i,1);
						break;
					}
				}
			} else if (body instanceof String){
				for (var i = 0; i < this.bodies.length; ++i){
					if (this.bodies[i].getLanguage() == body){
						this.bodies.splice(i,1);
						break;
					}
				}
			}
			
		},
		
		getBodies: function(){
			return this.bodies;
		},
		
		setSubject: function(subject){
			this.subject = subject;
		},
		
		getSubject: function(){
			return this.subject;
		},
		
		addSubject: function(subject){
			this.subjects.push(subject);
		},
		
		removeSubject: function(subject){
			if (subject instanceof MessageSubject){
				for (var i = 0; i < this.subjects.length; ++i){
					if (this.subjects[i] == subject){
						this.subjects.splice(i,1);
						break;
					}
				}
			} else if (subject instanceof String){
				for (var i = 0; i < this.subjects.length; ++i){
					if (this.subjects[i].getLanguage() == body){
						this.subjects.splice(i,1);
						break;
					}
				}
			}
			
		},
		
		getSubjects: function(){
			return this.subjects;
		},
		
		toXml: function(){
			var xml = "";
	        xml += "<message";
	        if (this.getLanguage() != null){
				xml += " xml:lang=\"" + this.getLanguage() + "\"";
	        }
	        if (this.getStanzaId() != null){
				xml += " id=\"" + this.getStanzaId() + "\"";
	        }
	        if (this.getTo() != null){
				xml += " to=\"" + StringUtils.escapeXml(this.getTo().toFullJID()) + "\"";
	        }
	        if (this.getFrom() != null){
				xml += " from=\"" + this.getFrom().toFullJID() + "\"";
	        }
	        if (this.type != MessageType.NORMAL){
				xml += " type=\"" + this.type + "\"";
	        }
	        xml += ">";
	        
	        if (this.subject != null){
				xml += "<subject>" + StringUtils.escapeXml(this.subject) + "</subject>";
	        }
	        
	        for (var i = 0; i < this.subjects.length; ++i){
				xml += this.subjects[i].toXml();
			}
	        
	        // Add the body in the default language
	        if (this.getBody() != null){
				xml += "<body>" + StringUtils.escapeXml(this.getBody()) + "</body>";
	        }
	
	        for (var i = 0; i < this.bodies.length; ++i){
				xml += this.bodies[i].toXml();
			}
	
	        if (this.thread != null){
				xml += "<thread>" + this.thread + "</thread>";
	        }
	
			var extensionXml = this.getExtensionsXml();
	        if (extensionXml != null){
	        	xml += extensionXml;
	        }
	
	        // Add the error sub-packet, if there is one.
	        var error = this.getXmppError();
	        if (error != null){
				xml += error.toXml();
	        }
	        xml += "</message>";
	        return xml;
			
		}
		
	});
	// end of Message
	
	// start of Auth
	com.christy.web.xmpp.XmppStanza.Auth = XmlStanza.extend({
		init: function(){
			this._super();
		},
		
		getMechanism: function(){
			return this.mechanism;
		},
	
		setMechanism: function(mechanism){
			this.mechanism = mechanism;
		},
		
		getContent: function(){
			return this.content;
		},
		
		setContent: function(content){
			this.content = content;
		},
		
		toXml: function(){
			var xml = "";
			
			xml += "<auth";
			if (this.getMechanism() != null){
				xml += " mechanism=\"" + this.getMechanism() + "\"";
			}
			xml += " xmlns=\"urn:ietf:params:xml:ns:xmpp-sasl\"";
			if (this.getContent() != null){
				xml += ">" + this.getContent() + "</auth>";
			} else {
				xml += "/>";
			}
			
			
			return xml;
		}
	});
	// end of Auth
	
	// start of Challenge
	com.christy.web.xmpp.XmppStanza.Challenge = XmlStanza.extend({
		init: function(content){
			this._super();
			this.content = content;
		},
		
		getContent: function(){
			return this.content;
		},
	
		setContent: function(content){
			this.content = content;
		},
		
		toXml: function(){
			var xml = "";
			
			xml += "<challenge xmlns=\"urn:ietf:params:xml:ns:xmpp-sasl\">";
			if (this.getContent() != null){
				xml += this.getContent();
			}
			xml += "</challenge>";
			
			
			return xml;
		}
	});
	// end of Challenge
	
	// start of Failure
	com.christy.web.xmpp.XmppStanza.FailureError = {
		aborted: "aborted",
		incorrect_encoding: "incorrect-encoding",
		invalid_authzid: "invalid-authzid",
		invalid_mechanism: "invalid-mechanism",
		mechanism_too_weak: "mechanism-too-weak",
		not_authorized: "not-authorized",
		temporary_auth_failure: "temporary-auth-failure"
	}
	
	var FailureError = com.christy.web.xmpp.XmppStanza.FailureError;
	
	com.christy.web.xmpp.XmppStanza.Failure = XmlStanza.extend({
		init: function(namespace){
			this._super();
			this.namespace = namespace;
		},
		
		getNamespace: function(){
			return this.namespace;
		},
	
		setNamespace: function(namespace){
			this.namespace = namespace;
		},
	
		getError: function(){
			return this.error;
		},
		
		setError: function(error){
			this.error = error;
		},
		
		toXml: function(){
			var xml = "";
			xml += "<failure xmlns=\"" + this.getNamespace() + "\"";
			if (this.getError() != null){
				xml += ">" + this.getError() + "</failure>";
			} else {
				buf.append("/>");
			}
			
			return xml;
		}
	});
	
	com.christy.web.xmpp.XmppStanza.Failure.SASL_FAILURE_NS = "urn:ietf:params:xml:ns:xmpp-sasl";
	com.christy.web.xmpp.XmppStanza.Failure.TLS_FAILURE_NS = "urn:ietf:params:xml:ns:xmpp-tls";
	
	// end of Failure
	
	
	
	// start of IqBind
	com.christy.web.xmpp.XmppStanza.IqBind = PacketExtension.extend({
		init: function(){
			this._super();
		},
		
		getElementName: function(){
			return com.christy.web.xmpp.XmppStanza.IqBind.ELEMENTNAME;
		},
		
		getNamespace: function(){
			return com.christy.web.xmpp.XmppStanza.IqBind.NAMESPACE;
		},
		
		getResource: function(){
			return this.resource;
		},
	
		setResource: function(resource){
			this.resource = resource;
		},
	
		getJid: function(){
			return this.jid;
		},
		
		setJid: function(jid){
			this.jid = jid;
		},
		
		toXml: function(){
			var xml = "";
			xml += "<" + this.getElementName() + " xmlns=\"" + this.getNamespace() + "\">";
			if (this.getResource() != null){
				xml += "<resource>" + this.getResource() + "</resource>";
			}
			if (this.getJid() != null){
				xml += "<jid>" + this.getJid().toFullJID() + "</jid>";
			}
			xml += "</" +  this.getElementName() + ">";
			return xml;
		}
	});
	com.christy.web.xmpp.XmppStanza.IqBind.ELEMENTNAME = "bind";
	com.christy.web.xmpp.XmppStanza.IqBind.NAMESPACE = "urn:ietf:params:xml:ns:xmpp-bind";
	
	// end of IqBind
	
	// start of IqRoster
	
	com.christy.web.xmpp.XmppStanza.IqRosterAsk = {
		subscribe: "subscribe",
		unsubscribe: "unsubscribe"
	}
	
	var IqRosterAsk = com.christy.web.xmpp.XmppStanza.IqRosterAsk;
	
	com.christy.web.xmpp.XmppStanza.IqRosterSubscription = {
		none: "none",
		to: "to",
		from: "from",
		both: "both",
		remove: "remove"
	}
	
	var IqRosterSubscription = com.christy.web.xmpp.XmppStanza.IqRosterSubscription;
	
	com.christy.web.xmpp.XmppStanza.IqRosterItem = XmlStanza.extend({
		init: function(jid, rosterName) {
		    this._super();
		    this.jid = jid;
		    this.rosterName = rosterName;
		    this.groups = new Array();
		},
		
		getJid: function(){
			return this.jid;
		},
		
		getRosterName: function(){
				return this.rosterName;
		},
		
		setRosterName: function(rosterName){
			this.rosterName = rosterName;
		},
		
		getSubscription: function(){
			return this.subscription;
		},
		
		setSubscription: function(subscription){
			this.subscription = subscription;
		},
		
		getAsk: function(){
			return this.ask;
		},
		
		setAsk: function(ask){
			this.ask = ask;
		},
		
		getGroups: function(){
			return this.groups;
		},
		
		containGroup: function(group){
			for (var i = 0; i < this.groups.length; ++i){
				if (this.groups[i] == group){
					return true;
				}
			}
			return false;
		},
		
		addGroup: function(group){
			if (this.groups != null){
				this.groups.push(group);
			}
		},
		
		removeGroupName: function(group){
			for (var i = 0; i < this.groups.length; ++i){
				if (this.groups[i] == group){
					this.groups.splice(i,1);
				}
			}
		},
		
		toXml: function(){
			var xml = "";
			xml += "<item jid=\"" + this.jid.toBareJID() + "\"";
			if (this.getRosterName() != null){
				xml += " name=\"" + StringUtils.escapeXml(this.getRosterName()) + "\"";
			}
			
			if (this.getSubscription() != null){
				xml += " subscription=\"" + this.getSubscription() + "\"";
			}
			if (this.getAsk() != null){
				xml += " ask=\"" + this.getAsk() + "\"";
			}
			xml += ">";
			for (var i = 0; i < this.groups.length; ++i){
				xml += "<group>" + StringUtils.escapeXml(this.groups[i]) + "</group>";
			}
			xml += "</item>";
			return xml;
		}
	});
	
	var IqRosterItem = com.christy.web.xmpp.XmppStanza.IqRosterItem;
	
	com.christy.web.xmpp.XmppStanza.IqRoster = PacketExtension.extend({
		init: function(){
			this._super();
			this.rosterItems = new Array();
		},
		
		getElementName: function(){
			return com.christy.web.xmpp.XmppStanza.IqRoster.ELEMENTNAME;
		},
		
		getNamespace: function(){
			return com.christy.web.xmpp.XmppStanza.IqRoster.NAMESPACE;
		},
		
		addRosterItem: function(rosterItem){
			this.rosterItems.push(rosterItem);
		},
		
		getRosterItemCount: function(){
			return this.rosterItems.length;
		},
		
		getRosterItems: function(){
			return this.rosterItems;
		},
		
		getRosterItem: function(jid){
			for (var i = 0; i < this.rosterItems.length; ++i){
					if (this.rosterItems[i].getJid().equalsWithBareJid(jid)){
						return this.rosterItems[i];
					}
			}
			return null;
		},
		
		containRosterItem: function(jid){
			for (var i = 0; i < this.rosterItems.length; ++i){
					if (this.rosterItems[i].getJid().equalsWithBareJid(jid)){
						return true;
					}
			}
			return false;
		},
		
		
		toXml: function(){
			var xml = "";
			
			xml += "<" + this.getElementName() + " xmlns=\"" + this.getNamespace() + "\">";
			for (var i = 0; i < this.rosterItems.length; ++i){
					xml += this.rosterItems[i].toXml();
			}
			
			xml += "</" +  this.getElementName() + ">";
			return xml;
		}
	});
	com.christy.web.xmpp.XmppStanza.IqRoster.ELEMENTNAME = "query";
	com.christy.web.xmpp.XmppStanza.IqRoster.NAMESPACE = "jabber:iq:roster";
	
	// end of IqRoster
	
	
	
	// start of IqSession
	com.christy.web.xmpp.XmppStanza.IqSession = PacketExtension.extend({
		init: function(){
			this._super();
		},
		
		getElementName: function(){
			return com.christy.web.xmpp.XmppStanza.IqSession.ELEMENTNAME;
		},
		
		getNamespace: function(){
			return com.christy.web.xmpp.XmppStanza.IqSession.NAMESPACE;
		},
		
		toXml: function(){
			var xml = "";
			xml += "<" + this.getElementName() + " xmlns=\"" + this.getNamespace() + "\"/>";
			return xml;
		}
	});
	com.christy.web.xmpp.XmppStanza.IqSession.ELEMENTNAME = "session";
	com.christy.web.xmpp.XmppStanza.IqSession.NAMESPACE = "urn:ietf:params:xml:ns:xmpp-session";
	
	// end of IqSession
	
	
	// start of PrivacyItem
	com.christy.web.xmpp.XmppStanza.PrivacyItemSubscription = {
		both: "both",
		
		to: "to",
		
		from: "from",
		
		none: "none"
	}
	
	var PrivacyItemSubscription = com.christy.web.xmpp.XmppStanza.PrivacyItemSubscription;
	com.christy.web.xmpp.XmppStanza.PrivacyItemType = {
				/**
			 * JID being analyzed should belong to a roster group of the
			 * list's owner.
			 */
			group: "group",
			/**
			 * JID being analyzed should have a resource match, domain
			 * match or bare JID match.
			 */
			jid: "jid",
			/**
			 * JID being analyzed should belong to a contact present in
			 * the owner's roster with the specified subscription
			 * status.
			 */
			subscription: "subscription"
	}
	
	var PrivacyItemType = com.christy.web.xmpp.XmppStanza.PrivacyItemType;
	
	com.christy.web.xmpp.XmppStanza.PrivacyItem = PacketExtension.extend({
		init: function(type, value, action, order){
			this._super();
			this.setType(type);
			this.setValue(value);
			this.setAction(action);
			this.setOrder(order);
		},
		
		getType: function(){
			return this.type;
		},
		
		setType: function(type){
			this.type = type;
		},
		
		getValue: function(){
			return this.value;
		},
		
		setValue: function(value){
			this.value = value;
		},
		
		isAction: function(){
			return this.action == null ? false : this.action;
		},
	
		setAction: function(action){
			this.action = action;
		},
		
		getOrder: function(){
			return this.order;
		},
	
		setOrder: function(order){
			this.order = order;
		},
		
		 isFilterIQ: function(){
			return this.filterIQ;
		},
		
		setFilterIQ: function(filterIQ){
			this.filterIQ = filterIQ;
		},
	
		isFilterMessage: function(){
			return this.filterMessage;
		},
		
		setFilterMessage: function(filterMessage){
			this.filterMessage = filterMessage;
		},
		
		isFilterPresence_in: function(){
			return this.filterPresence_in;
		},
		
		setFilterPresence_in: function(filterPresence_in){
			this.filterPresence_in = filterPresence_in;
		},
		
		isFilterPresence_out: function(){
			return this.filterPresence_out;
		},
		
		setFilterPresence_out: function(filterPresence_out){
			this.filterPresence_out = filterPresence_out;
		},
		
		isFilterEverything: function(){
			return !(this.isFilterIQ() || this.isFilterMessage() || this.isFilterPresence_in() || this.isFilterPresence_out());
		},
		
		isFilterEmpty: function(){
			return !this.isFilterIQ() && !this.isFilterMessage() && !this.isFilterPresence_in() && !this.isFilterPresence_out();
		},
		
		toXml: function(){
			var xml = "";
			xml += "<item";
			if (this.isAction()){
				xml += " action=\"allow\"";
			} else {
				xml += " action=\"deny\"";
			}
			xml += " order=\"" + this.getOrder() + "\"";
			if (this.getType() != null){
				xml += " type=\"" + this.getType() + "\"";
			}
			if (this.getValue() != null){
				xml += " value=\"" + StringUtils.escapeXml(this.getValue()) + "\"";
			}
			if (this.isFilterEverything()){
				xml += "/>";
			} else {
				xml += ">";
				if (this.isFilterIQ()){
					xml += "<iq/>";
				}
				if (this.isFilterMessage()){
					xml += "<message/>";
				}
				if (this.isFilterPresence_in()){
					xml += "<presence-in/>";
				}
				if (this.isFilterPresence_out()){
					xml += "<presence-out/>";
				}
				xml += "</item>";
			}
			return xml;
		}
	});
	
	// end of PrivacyItem
	
	var PrivacyItem = com.christy.web.xmpp.XmppStanza.PrivacyItem;
	
	// start of PrivacyList
	com.christy.web.xmpp.XmppStanza.PrivacyList = XmlStanza.extend({
		init: function(listName){
			this._super();
			this.listName = listName;
			this.items = new Array();
		},
		
		isActiveList: function(){
			return this.isActiveList;
		},
		
		setActiveList: function(isActiveList){
			this.isActiveList = isActiveList;
		},
		
		isDefaultList: function(){
			return this.isDefaultList;
		},
		
		setDefaultList: function(isDefaultList){
			this.isDefaultList = isDefaultList;
		},
		
		getListName: function(){
			return this.listName;
		},
		
		setListName: function(listName){
			this.listName = listName;
		},
		
		addItem: function(item){
			this.items.push(item);
		},
		
		removeItem: function(item){
			for (var i = 0; i < this.items.length; ++i){
					if (this.items[i] == item){
						this.items.splice(i,1);
						break;
					}
			}
		},
		
		getItem: function(order){
			for (var i = 0; i < this.items.length; ++i){
					if (this.items[i].getOrder() == order){
						return this.items[i];
					}
			}
			return null;
		},
		
		getItems: function(){
			return this.items;
		},
		
		toXml: function(){
			var xml = "";
			xml += "<list";
			if (this.getListName() != null){
				xml += " name=\"" + this.getListName() + "\"";
			}
			if (this.items.length == 0){
				xml += "/>";
			} else {
				xml += ">";
				for (var i = 0; i < this.items.length; ++i){
						xml += this.items[i].toXml();
				}
		
				xml += "</list>";
			}
			
			return xml;
		}
	});
	
	// end of PrivacyList
	
	var PrivacyList = com.christy.web.xmpp.XmppStanza.PrivacyList;
	
	// start of Privacy
	com.christy.web.xmpp.XmppStanza.Privacy = PacketExtension.extend({
		init: function(){
			this._super();
			this.privacyLists = new Array();
		},
		
		getElementName: function(){
			return com.christy.web.xmpp.XmppStanza.Privacy.ELEMENTNAME;
		},
		
		getNamespace: function(){
			return com.christy.web.xmpp.XmppStanza.Privacy.NAMESPACE;
		},
		
		getActiveName: function(){
			return this.activeName;
		},
		
		setActiveName: function(activeName){
			this.activeName = activeName;
		},
		
		getDefaultName: function(){
			return this.defaultName;
		},
		
		setDefaultName: function(defaultName){
			this.defaultName = defaultName;
		},
		
		addPrivacyList: function(privacyList){
			this.privacyLists.push(privacyList);
		},
		
		removePrivacyList: function(listName){
			for (var i = 0; i < this.privacyLists.length; ++i){
					if (this.privacyLists[i].getListName() == listName){
						this.privacyLists.splice(i,1);
					}
			}
		},
		
		getPrivacyList: function(listName){
			for (var i = 0; i < this.privacyLists.length; ++i){
					if (this.privacyLists[i].getListName() == listName){
						return this.privacyLists[i];
					}
			}
			return null;
		},
		
		getPrivacyLists: function(){
			return this.privacyLists;
		},
		
		isDeclineActiveList: function(){
			return this.declineActiveList;
		},
		
		setDeclineActiveList: function(declineActiveList){
			this.declineActiveList = declineActiveList;
		},
		
		isDeclineDefaultList: function(){
			return this.declineDefaultList;
		},
		
		setDeclineDefaultList: function(declineDefaultList){
			this.declineDefaultList = declineDefaultList;
		},
		
		toXml: function(){
			var xml = "";
			xml += "<" + this.getElementName() + " xmlns=\"" + this.getNamespace() + "\">";
	
			// Add the active tag
			if (this.isDeclineActiveList()){
				xml += "<active/>";
			} else {
				if (this.getActiveName() != null){
					xml += "<active name=\"" + this.getActiveName() + "\"/>";
				}
			}
			// Add the default tag
			if (this.isDeclineDefaultList()){
				xml += "<default/>";
			} else {
				if (this.getDefaultName() != null){
					xml += "<default name=\"" + this.getDefaultName() + "\"/>";
				}
			}
			
			for (var i = 0; i < this.privacyLists.length; ++i){
					xml += this.privacyLists[i].toXml();
			}
			
			xml += "</" + this.getElementName() + ">";
			return xml;
		}
	});
	com.christy.web.xmpp.XmppStanza.Privacy.ELEMENTNAME = "query";
	com.christy.web.xmpp.XmppStanza.Privacy.NAMESPACE = "jabber:iq:privacy";
	
	// end of Privacy
	
	
	// start of Proceed
	com.christy.web.xmpp.XmppStanza.Proceed = XmlStanza.extend({
		init: function(){
			this._super();
		},
		
		toXml: function(){
			return "<proceed xmlns=\"urn:ietf:params:xml:ns:xmpp-tls\"/>";
		}
	});
	// end of Proceed
	
	
	// start of Response
	com.christy.web.xmpp.XmppStanza.Response = XmlStanza.extend({
		init: function(content){
			this._super();
			this.content = content;
		},
		
		getContent: function(){
			return this.content;
		},
		
		setContent: function(content){
			this.content = content;
		},
		
		toXml: function(){
			var xml = "";
			xml += "<response xmlns=\"urn:ietf:params:xml:ns:xmpp-sasl\"";
			if (this.getContent() != null){
				xml += ">" + this.getContent() + "</response>";
			} else {
				 xml += "/>";
			}
	
			return xml;
		}
	});
	// end of Response
	
	// start of StartTls
	com.christy.web.xmpp.XmppStanza.StartTls = XmlStanza.extend({
		init: function(){
			this._super();
		},
		
		toXml: function(){
			return "<starttls xmlns=\"urn:ietf:params:xml:ns:xmpp-tls\"/>";
		}
	});
	// end of StartTls
	
	
	// start of Stream
	com.christy.web.xmpp.XmppStanza.Stream = AbstractXmlStanza.extend({
		init: function(){
			this._super();
			this.version = "1.0";
		},
		
		getTo: function(){
			return this.to;
		},
		
		setTo: function(to){
			this.to = to;
		},
		
		getFrom: function(){
			return this.from;
		},
		
		setFrom: function(from){
			this.from = from;
		},
		
		getVersion: function(){
			return this.version;
		},
		
		setVersion: function(version){
			this.version = version;
		},
		
		getLang: function(){
			return this.lang;
		},
		
		setLang: function(lang){
			this.lang = lang;
		},
		
		toXml: function(){
			var xml = "";
			xml += "<stream:stream";
	
			if (this.getStanzaId() != null){
				xml += " id=\"" + this.getStanzaId() + "\"";
			}
			if (this.getTo() != null){
				xml += " to=\"" + this.getTo().toFullJID() + "\"";
			}
			if (this.getFrom() != null){
				xml += " from=\"" + this.getFrom().toFullJID() + "\"";
			}
			if (this.getVersion() != null){
				xml += " version=\"" + this.getVersion() + "\"";
			}
			if (this.getLang() != null){
				xml += " xml:lang=\"" + this.getLang() + "\"";
			}
			
			var streamNs = com.christy.web.xmpp.XmppStanza.Stream.JABBER_CLIENT_NAMESPACE;
			var clientNs = com.christy.web.xmpp.XmppStanza.Stream.JABBER_CLIENT_NAMESPACE;
			xml += " xmlns:stream=\"" + streamNs + "\" xmlns=\"" + clientNs + "\"";
			xml += ">";
			return xml;
		}
	});
		
	com.christy.web.xmpp.XmppStanza.Stream.JABBER_CLIENT_NAMESPACE = "jabber:client";
	com.christy.web.xmpp.XmppStanza.Stream.STREAM_NAMESPACE = "http://etherx.jabber.org/streams";
	
	// end of Stream
	
	// start of StreamError
	com.christy.web.xmpp.XmppStanza.StreamErrorCondition = {
			/**
			 * The entity has sent XML that cannot be processed; this
			 * error MAY be used instead of the more specific
			 * XML-related errors, such as
			 * &lt;bad-namespace-prefix/&gt;, &lt;invalid-xml/&gt;,
			 * &lt;restricted-xml/&gt;, &lt;unsupported-encoding/&gt;,
			 * and &lt;xml-not-well-formed/&gt;, although the more
			 * specific errors are preferred.
			 */
			bad_format: "bad-format",
	
			/**
			 * The entity has sent a namespace prefix that is
			 * unsupported, or has sent no namespace prefix on an
			 * element that requires such a prefix.
			 */
			bad_namespace_prefix: "bad-namespace-prefix",
	
			/**
			 * The server is closing the active stream for this entity
			 * because a new stream has been initiated that conflicts
			 * with the existing stream.
			 */
			conflict: "conflict",
	
			/**
			 * The entity has not generated any traffic over the stream
			 * for some period of time (configurable according to a
			 * local service policy).
			 */
			connection_timeout: "connection-timeout",
	
			/**
			 * The value of the 'to' attribute provided by the
			 * initiating entity in the stream header corresponds to a
			 * hostname that is no longer hosted by the server.
			 */
			host_gone: "host-gone",
	
			/**
			 * The value of the 'to' attribute provided by the
			 * initiating entity in the stream header does not
			 * correspond to a hostname that is hosted by the server.
			 */
			host_unknown: "host-unknown",
	
			/**
			 * A stanza sent between two servers lacks a 'to' or 'from'
			 * attribute (or the attribute has no value).
			 */
			improper_addressing: "improper-addressing",
	
			/**
			 * The server has experienced a misconfiguration or an
			 * otherwise-undefined internal error that prevents it from
			 * servicing the stream.
			 */
			internal_server_error: "internal-server-error",
	
			/**
			 * The JID or hostname provided in a 'from' address does not
			 * match an authorized JID or validated domain negotiated
			 * between servers via SASL or dialback, or between a client
			 * and a server via authentication and resource binding.
			 */
			invalid_from: "invalid-from",
	
			/**
			 * The stream ID or dialback ID is invalid or does not match
			 * an ID previously provided.
			 */
			invalid_id: "invalid-id",
	
			/**
			 * the streams namespace name is something other than
			 * "http://etherx.jabber.org/streams" or the dialback
			 * namespace name is something other than
			 * "jabber:server:dialback".
			 */
			invalid_namespace: "invalid-namespace",
	
			/**
			 * The entity has sent invalid XML over the stream to a
			 * server that performs validation.
			 */
			invalid_xml: "invalid-xml",
	
			/**
			 * The entity has attempted to send data before the stream
			 * has been authenticated, or otherwise is not authorized to
			 * perform an action related to stream negotiation; the
			 * receiving entity MUST NOT process the offending stanza
			 * before sending the stream error.
			 */
			not_authorized: "not-authorized",
	
			/**
			 * The entity has violated some local service policy; the
			 * server MAY choose to specify the policy in the <text/>
			 * element or an application-specific condition element.
			 */
			policy_violation: "policy-violation",
	
			/**
			 * The server is unable to properly connect to a remote
			 * entity that is required for authentication or
			 * authorization.
			 */
			remote_connection_failed: "remote-connection-failed",
	
			/**
			 * The server lacks the system resources necessary to
			 * service the stream.
			 */
			resource_constraint: "resource-constraint",
	
			/**
			 * The entity has attempted to send restricted XML features
			 * such as a comment, processing instruction, DTD, entity
			 * reference, or unescaped character.
			 */
			restricted_xml: "restricted-xml",
	
			/**
			 * The server will not provide service to the initiating
			 * entity but is redirecting traffic to another host; the
			 * server SHOULD specify the alternate hostname or IP
			 * address (which MUST be a valid domain identifier) as the
			 * XML character data of the &lt;see-other-host/&gt;
			 * element.
			 */
			see_other_host: "see-other-host",
	
			/**
			 * The server is being shut down and all active streams are
			 * being closed.
			 */
			system_shutdown: "system-shutdown",
	
			/**
			 * The error condition is not one of those defined by the
			 * other conditions in this list; this error condition
			 * SHOULD be used only in conjunction with an
			 * application-specific condition.
			 */
			undefined_condition: "undefined-condition",
	
			/**
			 * The initiating entity has encoded the stream in an
			 * encoding that is not supported by the server.
			 */
			unsupported_encoding: "unsupported-encoding",
	
			/**
			 * The initiating entity has sent a first-level child of the
			 * stream that is not supported by the server.
			 */
			unsupported_stanza_type: "unsupported-stanza-type",
	
			/**
			 * the value of the 'version' attribute provided by the
			 * initiating entity in the stream header specifies a
			 * version of XMPP that is not supported by the server; the
			 * server MAY specify the version(s) it supports in the
			 * &lt;text/&gt; element.
			 */
			unsupported_version: "unsupported-version",
	
			/**
			 * The initiating entity has sent XML that is not
			 * well-formed.
			 */
			xml_not_well_formed: "xml-not-well-formed"
	
	}
	
	var StreamErrorCondition = com.christy.web.xmpp.XmppStanza.StreamErrorCondition;
	
	com.christy.web.xmpp.XmppStanza.StreamErrorAppCondition = XmlStanza.extend({
		init: function(elementName, namespace){
			this._super();
			this.elementName = elementName;
			this.namespace = namespace;
		},
		
		getElementName: function(){
			return this.elementName;
		},
		
		getNamespace: function(){
			return this.namespace;
		},
		
		toXml: function(){
			var xml = "";
			xml += "<" + this.getElementName() + " xmlns=\"" + this.getNamespace() + "\"/>";
			return xml;
		}
	});
	
	var StreamErrorAppCondition = com.christy.web.xmpp.XmppStanza.StreamErrorAppCondition;
	
	com.christy.web.xmpp.XmppStanza.StreamErrorAppErrorText = XmlStanza.extend({
		init: function(text){
			this._super();
			this.text = text;
		},
		
		getLang: function(){
			return this.lang;
		},
		
		setLang: function(lang){
			this.lang = lang;
		},
		
		getText: function(){
			return this.text;
		},
		
		setText: function(text){
			this.text = text;
		},
		
		toXml: function(){
			var xml = "";
			xml += "<text xmlns=\"urn:ietf:params:xml:ns:xmpp-streams\"";
			if (this.getLang() != null){
				xml += " xml:lang=\"" + this.getLang() + "\"";
			}
			xml += ">" + this.getText() + "</text>";
			
			return xml;
		}
	});
	
	var StreamErrorAppErrorText = com.christy.web.xmpp.XmppStanza.StreamErrorAppErrorText;
	
	com.christy.web.xmpp.XmppStanza.StreamError = XmlStanza.extend({
		init: function(condition){
			this._super();
			this.condition = condition;
			this.applicationConditions = new Array();
		},
	
		getCondition: function(){
			return this.condition;
		},
		
		setCondition: function(condition){
			this.condition = condition;
		},
		
		getText: function(){
			return this.text;
		},
		
		setText: function(text){
			this.text = text;
		},
		
		setText: function(textStr, lang){
			this.text = new StreamErrorAppErrorText(textStr);
			if (lang != null){
				this.text.setLang(lang);
			}
		},
		
		addApplicationCondition: function(elementName, namespace){
			var appCondition = new StreamErrorAppCondition(elementName, namespace);
			return this.applicationConditions.push(appCondition);
		},
		
		removeAppCondition: function(elementName, namespace){
			for (var i = 0; i < this.applicationConditions.length; ++i){
					if (this.applicationConditions[i].getElementName() == elementName
						&& this.applicationConditions[i].getNamespace() == namespace){
						this.applicationConditions.splice(i,1);
						break;
					}
			}
		},
		
		getAppConditions: function(){
			return this.applicationConditions;
		},
		
		toXml: function(){
			var xml = "";
			xml += "<stream:error>";
			if (this.getCondition() != null){
				xml += "<" + this.getCondition() + " xmlns=\"urn:ietf:params:xml:ns:xmpp-streams\"/>";
			}
			var text = this.getText();
			if (text != null){
				xml += text.toXml();
			}
			if (this.applicationConditions.length != 0){
				for (var i = 0; i < this.applicationConditions.length; ++i){			
					xml += this.applicationConditions[i].toXml();
				}
			}
			xml += "</stream:error>";
			return xml;
		}
	});
	
	// end of StreamError
	
	// end of StreamFeature
	com.christy.web.xmpp.XmppStanza.StreamFeatureFeature = XmlStanza.extend({
		init: function(elementName, namespace){
			this._super();
			this.elementName = elementName;
			this.namespace = namespace;
		},
		
		getElementName: function(){
			return this.elementName;
		},
		
		getNamespace: function(){
			return this.namespace;
		},
		
		isRequired: function(){
			return this.required;
		},
		
		setRequired: function(required){
			this.required = required;
		},
		
		toXml: function(){
			var xml = "";
			xml += "<" + this.getElementName() + " xmlns=\"" + this.getNamespace() + "\"";
			
			if (this.isRequired()){
				xml += "><required/></" + this.getElementName() + ">";
			} else {
				xml += "/>";
			}
			
			return xml;
		}
	});
	
	var StreamFeatureFeature = com.christy.web.xmpp.XmppStanza.StreamFeatureFeature;
	
	com.christy.web.xmpp.XmppStanza.StreamFeature = XmlStanza.extend({
		init: function(){
			this._super();
			this.mechanisms = new Array();
			this.compressionMethods = new Array();
			this.features = new Array();
		},
		
		addFeature: function(elementName, namespace, required){
			var feature = new StreamFeatureFeature(elementName, namespace);
			feature.setRequired(required);
			this.addStreamFeatureFeature(feature);
		},
		
		addStreamFeatureFeature: function(feature){
			this.features.push(feature);
		},
		
		removeFeature: function(elementName, namespace){
			for (var i = 0; i < this.features.length; ++i){
				if (this.features[i].getElementName() == elementName
					&& this.features[i].getNamespace() == namespace){
					this.features.splice(i,1);
					break;
				}
			}
		},
		
		removeFeature: function(feature){
			this.removeFeature(feature.getElementName(), feature.getNamespace());
		},
		
		getFeatures: function(){
			return this.features;
		},
		
		containFeature: function(elementName, namespace) {
			for (var i = 0; i < this.features.length; ++i){
				if (this.features[i].getElementName() == elementName
					&& this.features[i].getNamespace() == namespace){
					return true;
				}
			}
			return false;
		},
		
		addMechanism: function(mechanism){
			if (mechanism != null){
				this.mechanisms.push(mechanism);
			}
		},
		
		addMechanismCollection: function(mechanisms){
			this.mechanisms = this.mechanisms.concat(mechanisms);
		},
		
		removeMechanism: function(mechanism){
			for (var i = 0; i < this.mechanisms.length; ++i){
				if (this.mechanisms[i] == mechanism){
					this.mechanisms.splice(i,1);
					break;
				}
			}
		},
		
		removeAllMechanism: function(){
			this.mechanisms = new Array();
		},
		
		getMechanisms: function(){
			return this.mechanisms;
		},
		
		getCompressionMethod: function(){
			return this.compressionMethods;
		},
		
		addCompressionMethod: function(compressionMethod){
			if (compressionMethod != null){
				this.compressionMethods.push(compressionMethod);
			}
		},
	
		
		toXml: function(){
			var xml = "";
			xml += "<stream:features>";
			
			for (var i = 0; i < this.features.length; ++i){
				xml += this.features[i].toXml();
			}
			
			if (this.compressionMethods.length != 0)
			{
				xml += "<compression xmlns=\"http://jabber.org/features/compress\">";
				for (var i = 0; i < this.compressionMethods.length; ++i){
					xml += "<method>" + this.compressionMethods[i] + "</method>";
				}
				xml += "</compression>";
			}
			if (this.mechanisms.length != 0){
				xml += "<mechanisms xmlns='urn:ietf:params:xml:ns:xmpp-sasl'>";
				for (var i = 0; i < this.mechanisms.length; ++i){
					xml += "<mechanism>" + this.mechanisms[i] + "</mechanism>";
				}
				xml += "</mechanisms>";
			}
			
			xml += "</stream:features>";
			return xml;
		}
	});
	
	// end of StreamFeature
	
	
	// start of Success
	com.christy.web.xmpp.XmppStanza.Success = XmlStanza.extend({
		init: function(successData){
			this._super();
			this.successData = successData;
		},
		
		getSuccessData: function(){
			return this.successData;
		},
		
		setSuccessData: function(successData){
			this.successData = successData;
		},
		
		toXml: function(){
			var xml = "";
	
			xml += "<success xmlns=\"urn:ietf:params:xml:ns:xmpp-sasl\"";
			
			if (this.getSuccessData() != null){
				xml += ">" + this.getSuccessData() + "</success>";
			} else {
				xml += "/>";
			}
			
			return xml;
		}
	});
	// end of Success
	
	// start of Body
	com.christy.web.xmpp.XmppStanza.Body = XmlStanza.extend({
		init: function() {
		    this._super();
		    this.attributes = {};
		    this.stanzas = new Array();
		},
		
		setAttribute: function(key, value) {
			this.attributes[key] = value;
		},
		
		getAttribute: function(key) {
			return this.attributes[key];
		},
		
		getAttributes: function() {
			return this.attributes;
		},
		
		removeAttribute: function(key) {
			delete this.attributes[key];
		},
		
		removeAllAttributes: function() {
			this.attributes = {};
		},
		
		addStanza: function(stanza) {
	        this.stanzas.push(stanza);
	    },
	    
	    removeStanza: function(stanza) {
	    	for (var i = 0; i < this.stanzas.length; ++i){
				if (this.stanzas[i] == stanza){
					this.stanzas.splice(i,1);
					break;
				}
			}
	    },
	    
	    getStanzas: function() {
	    	return this.stanzas;
	    },
	    
	    toXml: function() {
	    	var xml = "";
	    	
	    	xml += "<body";
	    	
	    	var containNamespace = false;
	    	for ( var key in this.attributes ) {
	    		if (key == "xmlns") {
	    			containNamespace = true;
	    		}
	    		var value = this.attributes[key];
	    		if (value != null) {
	    			xml += " " + key + "=\"" + value + "\"";
	    		}
	    	}

			if (!containNamespace) {
				xml += " xmlns=\"http://jabber.org/protocol/httpbind\"";
			}
	    	
	    	if (this.stanzas.length > 0) {
				xml += ">";
	    		for (var i = 0; i < this.stanzas.length; ++i){
					xml += this.stanzas[i].toXml();
				}
				
				xml += "</body>";
	    	} else {
	    		xml += " />";
	    	}
	    	
	    	return xml;
	    }
	    
	});
	// end of Body
  }
});
