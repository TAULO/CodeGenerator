/* Released under BSD license (see license.txt) */
/*
 * dojofirebugextension 
 * Copyright IBM Corporation 2010, 2010. All Rights Reserved. 
 * U.S. Government Users Restricted Rights -  Use, duplication or disclosure restricted by GSA ADP 
 * Schedule Contract with IBM Corp. 
 */


/**
 * Firebug dojo extension main file.
 * @author preyna@ar.ibm.com
 * @author fergom@ar.ibm.com
 */
var DojoExtension = FBL.ns(function() { with (FBL) {

// ****************************************************************
// GLOBAL FUNCTIONS IN THIS NAMESPACE
// ****************************************************************
	var DOJO_BUNDLE = "dojostrings";
	var VERSION = "1.0a6";
	var DOJO_PREF_MAP_IMPL = "dojofirebugextension.hashCodeBasedDictionaryEnabled";
	var DOJO_PREF_BP_PLACE = "dojofirebugextension.breakPointPlaceDisabled";
	var DOJO_PREF_EVENT_BASED_PROXY_ENABLED = "dojofirebugextension.useEventBasedProxy";
	
	var nsIInterfaceRequestor = Ci.nsIInterfaceRequestor;
	var nsISelectionDisplay = Ci.nsISelectionDisplay;
	var nsISelectionController = Ci.nsISelectionController;
	
	/**
	 * Scroll search found selection. 
	 */
	function scrollSelectionIntoView(panel)	{
	    var selCon = getSelectionController(panel);
	    selCon.scrollSelectionIntoView(
	            nsISelectionController.SELECTION_NORMAL,
	            nsISelectionController.SELECTION_FOCUS_REGION, true);
	}

	function getSelectionController(panel) {
	    var browser = Firebug.chrome.getPanelBrowser(panel);
	    return browser.docShell.QueryInterface(nsIInterfaceRequestor)
	        .getInterface(nsISelectionDisplay)
	        .QueryInterface(nsISelectionController);
	}
	
	/**
	 * returns the DojoAccessor service.
	 */
	var getDojoAccessor = function(context) {
		var service = context.dojo.dojoAccessor;
		return service;
	};
	
	/**
	 * returns the DojoDebugger service.
	 */
	var getDojoDebugger = function(context) {
		var service = context.dojo.dojoDebugger;
		return service;
	};

	/**
	 * returns the current context.
	 */
	/*context*/var _safeGetContext = function(panel) {
		var ctx = panel.context;
		if(!ctx) {
			ctx = FirebugContext;
		}
		return ctx;
	};

	/**
	 * sets our default css styles to a given document.
	 * This method is used by the panels on this file.
	 */
    var _addStyleSheet = function(doc) {
    	appendStylesheet(doc, "chrome://dojofirebugextension/skin/dojofirebugextension.css");
    };
    
    /**
     * verify if the hashCodeBasedDictionary implementation is enabled.
     */
    var _isHashCodeBasedDictionaryImplementationEnabled = function(){
    	var value = Firebug.getPref(Firebug.prefDomain, DOJO_PREF_MAP_IMPL);
    	return value;
    };
    
    /**
     * toggle the map implementation in use (performance vs non-intrusive implementations).
     */
    var _switchMapImplementation = function(){
    	var currentValue = _isHashCodeBasedDictionaryImplementationEnabled();
    	Firebug.setPref(Firebug.prefDomain, DOJO_PREF_MAP_IMPL, !currentValue);
    };
    
    /**
     * verify if the breakpoint place support is enabled.
     */
    var _isBreakPointPlaceSupportDisabled = function(){
    	var value = Firebug.getPref(Firebug.prefDomain, DOJO_PREF_BP_PLACE);
    	return value;
    };
    
    /**
     * enable/disable the breakpoint place support.
     */
    var _switchBreakPointPlaceEnabled = function(){
    	var currentValue = _isBreakPointPlaceSupportDisabled();
    	Firebug.setPref(Firebug.prefDomain, DOJO_PREF_BP_PLACE, !currentValue);
    };
    
    /**
     * verify if the html event based communication mechanism is enabled.
     */
    var _isUseEventBasedProxyEnabled = function(){
    	var value = Firebug.getPref(Firebug.prefDomain, DOJO_PREF_EVENT_BASED_PROXY_ENABLED);
    	return value;
    };
    
    /**
     * enable/disable the html event based communication mechanism.
     */
    var _switchUseEventBasedProxy = function(){
    	var currentValue = _isUseEventBasedProxyEnabled();
    	Firebug.setPref(Firebug.prefDomain, DOJO_PREF_EVENT_BASED_PROXY_ENABLED, !currentValue);
    };
    
    var _setNeedsReload = function(context, flag) {
    	context.needReload = flag;
    };
    
    var _needsReload = function(context) {
    	return context.needReload;
    };
    
    
    /**
	 * returns the version of this extension
	 */
	var getVersion = function() {
		return VERSION;
	};
	
	
// ****************************************************************
// HELPER OBJECTS IN THIS NAMESPACE
// ****************************************************************	
	var DomHighlightSelector = function(){
		// The selectors
		this._selectors = [];
		
		/**
		 * Add a selector.
		 * @param className the class name to search
		 * @param isSelection the function to identify the selection in the repObjects.
		 */
		this.addSelector = function(/*String*/className, /*Function*/isSelection){
			this._selectors.push({
				className: className,
				isSelection: isSelection
			});
		};
		
		/**
		 * This method highlight the selection param in the parentNode element.
		 * @param parentNode the node where the main panel info is contained.
		 * @param selection the selection.
		 * @param focus boolean to decide if the object should be focus
		 */
		this.highlightSelection = function(parentNode, selection, /*boolean*/focus) {
			var occurrence;
			var firstOccurrence;
			for (var i = 0; i < this._selectors.length; i++) {
				occurrence = this._highlightSelection(parentNode, selection, this._selectors[i].className, this._selectors[i].isSelection);
				firstOccurrence = (firstOccurrence) ? firstOccurrence : occurrence ;
			}
			if (focus && firstOccurrence) scrollIntoCenterView(firstOccurrence);
		};
				
		/**
		 * This function highlight the current dojo tab selection in the main panel.
		 * @param parentNode the node where the main panel info is contained.
		 * @param selection the selection.
		 * @param className the class name to look the elements in the dom.
		 * @param isSelection function that verify if an object is the selection.
		 */
		this._highlightSelection = function(parentNode, selection, className, isSelection){
			var domElements = getElementsByClass(parentNode, className);
	    	var node;
	    	var obj;
	    	var firstOccurrence;
	    	for (var i = 0; i < domElements.length; i++) {
	    		node = domElements[i];
	    		obj = node.referencedObject;
	    		if (isSelection(selection, obj)){
	    			firstOccurrence = (firstOccurrence) ? firstOccurrence : node ;
	    			setClass(node, "currentSelection");
	    		} else {
	    			removeClass(node, "currentSelection");
	    		}
	    	}
	    	return firstOccurrence;
		};
	};
	
	/**
	 * This class admin the a message box.
	 */
	var ActionMessageBox = function(id, parentNode, msg, btnName, action){
		// Message box identifier
		this._actionMessageBoxId = "actionMessageBoxId-" + id; 
		
		// The parentNode
		this._parentNode = parentNode; 
		
		// The message
		this._message = msg;
		
		// The button message
		this._btnName = btnName;
		
		// The action
		this._action = action;
		
		/**
		 * Load the message box in the parentPanel
		 * @param visibility boolean that define if the box should be visible or not.
		 */
		this.loadMessageBox = function(visibility){
			DojoReps.ActionMessageBox.tag.append({actionMessageBoxId: this._actionMessageBoxId,
											  visibility: this._getVisibilityValue(visibility),
											  message: this._message, btnName: this._btnName,
											  actionMessageBox: this}, this._parentNode);
		};
		
		/**
		 * Show the message box (if it exist).
		 */
		this.showMessageBox = function(){
			this._setMessageBoxVisibility(true);
		};
		
		/**
		 * Hide the message box (if it exist).
		 */
		this.hideMessageBox = function(){
			this._setMessageBoxVisibility(false);
		};
		
		/**
		 * Set message box visibility.
		 */
		this._setMessageBoxVisibility = function(visibility){
			// FIXME: Use $() function. Find out why this._parentNode has no getElementById method.
			//var msgbox = $(this._actionMessageBoxId, this._parentNode);
			//var msgbox = this._parentNode.firstElementChild;
			var msgbox = this._getMessageBox(this._parentNode, this._actionMessageBoxId);
			msgbox = (msgbox && (msgbox.id == this._actionMessageBoxId)) ? msgbox :null ;
			
			if (msgbox) msgbox.style.display = this._getVisibilityValue(visibility);
		};
		
		/**
		 * Find the msg box.
		 */
		this._getMessageBox = function(parentNode, boxId){
			var children = parentNode.children;
			for ( var int = 0; int < children.length; int++) {
				var child = children[int];
				if (child.id == boxId) { 
					return child;
				}
			}
			return null;
		};
		
		/**
		 * Return the visibility value for the parameter.
		 * @param visibility the visibility
		 */
		this._getVisibilityValue = function(visibility){
			return visibility ? 'inherit' : 'none';
		};
		
		/**
		 * Execute the action.
		 */
		this.executeAction = function(){
			this._action(this);
		};
	};
	
	/**
	 * Configuration for panel rendering.
	 */
	var PanelRenderConfig = function(/*boolean*/ refreshMainPanel, /*PanelView*/mainPanelView,
									 /*boolean*/ highlight, /*boolean*/ scroll,
									 /*boolean*/ refreshSidePanel, /*String*/sidePanelView){
		this.refreshMainPanel = refreshMainPanel;
		this.mainPanelView = mainPanelView;
		this.highlight = highlight;
		this.scroll = scroll;
		this.refreshSidePanel = refreshSidePanel;
		this.sidePanelView = sidePanelView;
		
		/**
		 * Verify if the parameter view is the selected one.
		 */
		this.isViewSelected = function(view){
			return (this.mainPanelView == view);
		};
	};
	PanelRenderConfig.VIEW_WIDGETS = "view_widgets";
	PanelRenderConfig.VIEW_CONNECTIONS = "view_connections";
	PanelRenderConfig.VIEW_SUBSCRIPTIONS = "view_subscriptions";
	
	
	
    /**
	 * @abstract
	 * @class ObjectMethodProxier Class to easily create and set proxies to objects.
	 */
    var ObjectMethodProxier = function() {};
    ObjectMethodProxier.prototype = {
		/**
		 * This method create proxy around a function.
		 * @param obj the object that own the method to be proxied
		 * @param method the method to be proxied
		 * @param funcPreInvocation the function to be called before the original method invocation
		 * @param funcPostInvocation the function to be called after the original method invocation
		 * @return the proxied function
		 */
    	getProxiedFunction : function (obj, method, funcPreInvocation, funcPostInvocation) {
			var functionToProxy = obj[method];
	    	var theProxy = function() {
				var funcPreInvParams = (funcPreInvocation != null) ? funcPreInvocation.apply(obj, arguments) : null;
				var returnValue = functionToProxy.apply(obj, arguments);
				var postInvocationReturnValue = (funcPostInvocation != null) ? funcPostInvocation.call(obj, returnValue, arguments, funcPreInvParams) : null;
				return (postInvocationReturnValue) ? postInvocationReturnValue : returnValue;
			};
			theProxy.internalClass = "dojoext-added-code";
			theProxy.proxiedFunction = functionToProxy;
			return theProxy;
		},
		
		/**
		 * @abstract
		 * This method replace an object method with a proxy that include the invocation of 
		 * the functions passed as parameter.
		 * @param obj the object that own the method to be proxied
		 * @param functionToProxy the method to be proxied
		 * @param funcPreInvocation the function to be called before the original method invocation
		 * @param funcPostInvocation the function to be called after the original method invocation
		 */
		proxyFunction : function(obj, functionToProxy, funcPreInvocation, funcPostInvocation){
			throw("proxyFunction is an abstract method in ObjectMethodProxier");
		}
    };
    
    /**
	 * @class ObjectMethodProxierDirectAccessBased
	 */
    var ObjectMethodProxierDirectAccessBased = function() {};
    ObjectMethodProxierDirectAccessBased.prototype = extend(ObjectMethodProxier.prototype, 
    {
		/**
		 * This method wrap the function passed as parameter and return a new one that handle any exception
		 * raised and log the error in the console. 
		 * @param func the proxy function
		 */
    	_protectProxyFromExceptions : function(func){
    		var protectedFunction = function(){
    			try{
    				return func.apply(this, arguments);
    			} catch (e) {
    				var msj = "An error at Dojo Firebug extension have occurred.";
    				Firebug.Console.log(msj, _safeGetContext(this), "error", FirebugReps.Text);
    			}
    		};
    		protectedFunction.internalClass = "dojoext-added-code";
    		return protectedFunction;
    	},
    	
    	/**
		 * @override
		 */
    	proxyFunction : function(obj, functionToProxy, funcPreInvocation, funcPostInvocation){
			if (!DojoModel.isDojoExtProxy(obj[functionToProxy]) && !obj[functionToProxy]._listeners) {
				obj[functionToProxy] = this._protectProxyFromExceptions(this.getProxiedFunction(obj, functionToProxy, funcPreInvocation, funcPostInvocation));
			} else {
				var msj = "Dojo Firebug Extension: A proxied function is attempted to be reproxied: " + functionToProxy +
						  ". Please report the bug.";
				Firebug.Console.log(msj, _safeGetContext(this), "error", FirebugReps.Text);
			}
		},
    
	    /**
		 * Destructor
		 */ 
		destroy : function(){
		   
		}
    });
    
    /**
	 * @class ObjectMethodProxierEventBased
	 */
    var ObjectMethodProxierEventBased = function(context) {
    	// FB context
    	this.context = context;
    	
    	// Registered events
    	this.registeredEvents = {};
    	
    	/**
    	 * Verify if an event was registered.
    	 * @param event the event
    	 */
    	this.isEventAlreadyRegistered = function (event){
    		return this.registeredEvents[event];
    	};
    	
    	/**
    	 * Record listener registering for event.
    	 * @param event the event
    	 * @param listener the listener
    	 */
    	this.recordListenerRegistering = function (event, listener){
    		this.registeredEvents[event] = listener;
    	};
    	
    	/**
    	 * Retrieve the list of listeners registered for event.
    	 */
    	this.getListenersList = function (event, listener){
    		var reg = [];
    		for (var i in this.registeredEvents) {
    			reg.push({event: i, listener: this.registeredEvents[i]});
    		}
    		return reg;
    	};
    };
    ObjectMethodProxierEventBased.prototype = extend(ObjectMethodProxierDirectAccessBased.prototype,
	{
    	/**
    	 * This method replace an object method with a proxy that include the invocation of 
		 * the functions passed as parameter.
		 * @param evtKey the object that own the method to be proxied
		 * @param func the method to be proxied
		 * @param funcPreInvocation the function to be called before the original method invocation
    	 */
    	eventFireFunctionWrapper : function(evtKey, func){
    		  var context = this.context;
    		//FIXME remove use of wrappedJSObject. Use unwrapObject() fn instead.
    		  var docPage = context.window.wrappedJSObject.document;
    		  if (!this.isEventAlreadyRegistered(evtKey)){
    			  var listener = function(e) {  
    		        	//var args = e.target['args'];
    		        	// FIXME[issue target property]: the arguments are setted to the document. 
    		        	// This is a patch, the arguments should be setted to the event.target, but
    		        	// it is not working, if you inspect in FB the e.target you will be able to see 
    		        	// the property setted, but when you try access it via code it return undefined.
    		        	// Probably this problem occurs due to security issues.
    				  	
    				  	// Get parameters
       		   	   		/*****************************************/
    				    var argKey = e.target.getAttribute("argKey");
    				    var args = docPage.dojoArguments[argKey];
    				    delete docPage.dojoArguments[argKey];
    				    /*****************************************/
    				    
    				    func.apply(this, args);
    			  };

    			  docPage.addEventListener(evtKey, listener, false, true);
    			  this.recordListenerRegistering(evtKey, listener);
    		   }
    		   
    		   return function(){
    			   var element = docPage.createElement("DojoExtensionDataElement");  
    			   
    			   // Configure parameters
    		   	   /*****************************************/
    			   element['args'] = arguments;
    		   	   // FIXME: [issue target property] (Hack)
    		   	   var dojoArgs = docPage['dojoArguments'];
    		   	   if (!dojoArgs) {
    		   		   dojoArgs = docPage['dojoArguments'] = {};
    		   		   dojoArgs.counter = 0;
    		   	   }
    		   	   var argKey = "args-" + dojoArgs.counter++;
    		   	   element.setAttribute("argKey", argKey);
    		   	   dojoArgs[argKey] = arguments;
    		   	   /*****************************************/
    			   
    			   docPage.documentElement.appendChild(element); 
    			   
    			   var evt = docPage.createEvent("Events");  
    			   evt.initEvent(evtKey, true, false);
    			   element.dispatchEvent(evt);
    			   
    			   docPage.documentElement.removeChild(element);
    		   };
    	},
    	
	   /**
	    * @override
	    */
	   proxyFunction : function(obj, functionToProxy, funcPreInvocation, funcPostInvocation){
	    	var eventKey = "DojoExtensionEventPre" + functionToProxy;
			var newFuncPreInvocation = (funcPreInvocation) ? this.eventFireFunctionWrapper(eventKey, funcPreInvocation) : null;
			
			eventKey = "DojoExtensionEventPos" + functionToProxy;
			var newFuncPostInvocation = (funcPostInvocation) ? this.eventFireFunctionWrapper(eventKey, funcPostInvocation) : null;
			
			ObjectMethodProxierDirectAccessBased.prototype.proxyFunction.call(this, obj, functionToProxy, newFuncPreInvocation, newFuncPostInvocation);
	   },
    	
    	/**
    	 * Destructor
    	 */ 
		destroy : function(){
		 //FIXME remove use of wrappedJSObject. Use unwrapObject() fn instead.
		    var docPage = this.context.window.wrappedJSObject.document;
		    var list = this.getListenersList();
			for (var i = 0; i < list.length; i++){
				docPage.removeEventListener(list[i].event, list[i].listener, false);
				this.registeredEvents[list[i].event] = null;
				delete this.registeredEvents[list[i].event];
			}
			this.registeredEvents = null;
			ObjectMethodProxierDirectAccessBased.prototype.destroy();
		}
    
	});

// ****************************************************************
// MAIN PANEL
// ****************************************************************
var CONNECTIONS_BP_OPTION = "connections_bp_option";
var SUBSCRIPTIONS_BP_OPTION = "subscriptions_bp_option";
var DOCUMENTATION_OPTION = "documentation_option";
var WIDGET_OPTION = "widget_option";

var DojoPanelMixin =  {
    		
	/**
	 * @override
	 */	
    getContextMenuItems: function(realObject, target) {
		var items = [];
	
		// Check if the selected object is a connection
		var conn = this._getReferencedObjectFromNodeWithType(target, "dojo-connection");
		if (conn){
			items = this._getConnectionContextMenuItems(conn);
		}
		
		// Check if the selected object is a subscription
		var sub = this._getReferencedObjectFromNodeWithType(target, "dojo-subscription");
		if (sub){
			items = this._getSubscriptionContextMenuItems(sub);
		}
		
		if (realObject) {
			var docItems = this.getDocumentationContextMenuItems(realObject, target);
			if(docItems) {
				items = items.concat(docItems);
			}
		}
		
		// Check if the selected object is a widget
		var widget = this._getReferencedObjectFromNodeWithType(target, "dojo-widget");
		if (widget){
			items = items.concat(this._getWidgetContextMenuItems(widget));
		}
		
		// Check if the selected object is a connection event
		var /*IncomingConnectionDescriptor*/ incDesc = this._getReferencedObjectFromNodeWithType(target, "dojo-eventFunction");
		if (incDesc){
			items = items.concat(this._getFunctionContextMenuItems(incDesc.getEventFunction(), 'menuitem.breakon.event', incDesc.event));
		}
		
		// Check if the selected object is a connection target
		var /*OutgoingConnectionDescriptor*/ outDesc = this._getReferencedObjectFromNodeWithType(target, "dojo-targetFunction");
		if (outDesc){
			var fnListenerLabel = (typeof(outDesc.method) == "string") ? outDesc.method : null;
			items = items.concat(this._getFunctionContextMenuItems(outDesc.getListenerFunction(), 'menuitem.breakon.target', fnListenerLabel));
		}
		
		return items;

    },
    
    /**
     * returns the referencedObject associated to an ancestor node with class objectType
     */
    _getReferencedObjectFromNodeWithType: function(target, objectType) {
		var connNode = getAncestorByClass(target, objectType);
		if(!connNode)
			return;
		
		return connNode.referencedObject;
    },
    
    _getFunctionContextMenuItems: function(func, msgKey, label){
    	var context = this.context;
		var dojoDebugger = getDojoDebugger(context);

		//info about the function.
		var listener = dojoDebugger.getDebugInfoAboutFunction(context, func, label);

		return [
	        { label: $STRF(msgKey, [listener.getFnName()], DOJO_BUNDLE), nol10n: true, disabled: !listener.fnExists, type: "checkbox", checked: listener.hasBreakpoint(), command: bindFixed(dojoDebugger.toggleBreakpointInFunction, dojoDebugger, listener)}
	    ];
    },
    
    _getWidgetContextMenuItems: function(widget){
    	if (!widget)
        return;

    
    	return [
    	    "-",
	        {label: $STR('menuitem.Show Connections', DOJO_BUNDLE), nol10n: true, command: bindFixed(this._showConnections, this, widget), disabled: !this._hasConnections(widget), optionType: WIDGET_OPTION},
	        {label: $STR('menuitem.Show Subscriptions', DOJO_BUNDLE), nol10n: true, command: bindFixed(this._showSubscriptions, this, widget), disabled: !this._hasSubscriptions(widget), optionType: WIDGET_OPTION },
    	];
    },
    
    _getConnectionContextMenuItems: function(conn) {
		var context = this.context;
		
		var dojoDebugger = getDojoDebugger(context);

		//info about listener fn..
		var fnListener = conn.getListenerFunction();
		var fnListenerLabel = (typeof(conn.method) == "string") ? conn.method : null;
		var listener = dojoDebugger.getDebugInfoAboutFunction(context, fnListener, fnListenerLabel);

		//info about original fn..
		var fnModel = conn.getEventFunction();
		var model = dojoDebugger.getDebugInfoAboutFunction(context, fnModel, conn.event);
		
		//info about place where the connection was made
		var caller = conn.callerInfo;
		
		var connectPlaceCallerFnName;
		if(_isBreakPointPlaceSupportDisabled()) {			
			connectPlaceCallerFnName = $STR('menuitem.breakon.disabled', DOJO_BUNDLE);
		} else {
			connectPlaceCallerFnName = (caller) ? caller.getFnName() : null;
		}
		
	    return [
	        { label: $STRF('menuitem.breakon.target', [listener.getFnName()], DOJO_BUNDLE), nol10n: true, disabled: !listener.fnExists, type: "checkbox", checked: listener.hasBreakpoint(), command: bindFixed(dojoDebugger.toggleBreakpointInFunction, dojoDebugger, listener), optionType: CONNECTIONS_BP_OPTION },
	        { label: $STRF('menuitem.breakon.event', [model.getFnName()], DOJO_BUNDLE), nol10n: true, disabled: !model.fnExists, type: "checkbox", checked: model.hasBreakpoint(), command: bindFixed(dojoDebugger.toggleBreakpointInFunction, dojoDebugger, model), optionType: CONNECTIONS_BP_OPTION },
	        { label: $STRF('menuitem.breakon.connect', [connectPlaceCallerFnName], DOJO_BUNDLE), nol10n: true, disabled: (!caller || !caller.fnExists), type: "checkbox", checked: (caller && caller.hasBreakpoint()), command: bindFixed(dojoDebugger.toggleBreakpointInFunction, dojoDebugger, caller), optionType: CONNECTIONS_BP_OPTION }
	    ];

    },
    
    _getSubscriptionContextMenuItems: function(sub) {
		var context = this.context;
		
		var dojoDebugger = getDojoDebugger(context);

		//info about listener fn..
		var fnListener = sub.getListenerFunction();
		var fnListenerLabel = (typeof(sub.method) == "string") ? sub.method : null;
		var listener = dojoDebugger.getDebugInfoAboutFunction(context, fnListener, fnListenerLabel);

		//info about place where the subscription was made
		var caller = sub.callerInfo;
		
		var subscribePlaceCallerFnName;
		if(_isBreakPointPlaceSupportDisabled()) {
			subscribePlaceCallerFnName = $STR('menuitem.breakon.disabled', DOJO_BUNDLE);
		} else {
			subscribePlaceCallerFnName = (caller) ? caller.getFnName() : null;
		}

		return [
	        { label: $STRF('menuitem.breakon.target', [listener.getFnName()], DOJO_BUNDLE), nol10n: true, disabled: !listener.fnExists, type: "checkbox", checked: listener.hasBreakpoint(), command: bindFixed(dojoDebugger.toggleBreakpointInFunction, dojoDebugger, listener), optionType: SUBSCRIPTIONS_BP_OPTION },
	        { label: $STRF('menuitem.breakon.subscribe', [subscribePlaceCallerFnName], DOJO_BUNDLE), nol10n: true, disabled: (!caller || !caller.fnExists), type: "checkbox", checked: (caller && caller.hasBreakpoint()), command: bindFixed(dojoDebugger.toggleBreakpointInFunction, dojoDebugger, caller), optionType: SUBSCRIPTIONS_BP_OPTION }
	    ];

    },
    
    /*boolean*/_hasConnections: function(widget) {
    	var api = _safeGetContext(this).connectionsAPI;
		return (!api) ? false : api.areThereAnyConnectionsFor(widget);
	},
	
	/*boolean*/_hasSubscriptions: function(widget) {
		var api = _safeGetContext(this).connectionsAPI;
		return (!api) ? false : api.areThereAnySubscriptionFor(widget);
	},
    
    _showConnections: function(widget, context) {
		DojoExtension.dojofirebugextensionPanel.prototype.showObjectInConnectionSidePanel(widget);
	},
	
	_showSubscriptions: function(widget, context) {
		DojoExtension.dojofirebugextensionPanel.prototype.showObjectInSubscriptionSidePanel(widget);
	},
    
    /*array*/getDocumentationContextMenuItems: function(realObject, target) {
    	//'this' is a panel instance
    	var context = this.context;
    	var dojoAccessor = getDojoAccessor(context);
    	var docUrl = dojoAccessor.getDojoApiDocURL(realObject, context);
    	
    	var refDocUrl = dojoAccessor.getReferenceGuideDocUrl(realObject, context);
    	
    	if(!docUrl && !refDocUrl) {
    		return;
    	}
    	
	    return [
	            "-",
//	            { label: $STR('menuitem.Open_Doc', DOJO_BUNDLE), nol10n: true, disabled: !docUrl, command: bindFixed(this.openBrowserWindowWithURL, this, docUrl, context), optionType: DOCUMENTATION_OPTION },
		        { label: $STR('menuitem.Open_Doc_In_New_Tab', DOJO_BUNDLE), nol10n: true, disabled: !docUrl, command: bindFixed(this.openBrowserTabWithURL, this, docUrl, context), optionType: DOCUMENTATION_OPTION },
//		        { label: $STR('menuitem.Open_Doc_In_New_Window', DOJO_BUNDLE), nol10n: true, disabled: !docUrl, command: bindFixed(this.openBrowserWindowWithURL, this, docUrl, context), optionType: DOCUMENTATION_OPTION },
		        "-",
		        { label: $STR('menuitem.Open_Doc_From_RefGuide_In_New_Tab', DOJO_BUNDLE), nol10n: true, disabled: !refDocUrl, command: bindFixed(this.openBrowserTabWithURL, this, refDocUrl, context), optionType: DOCUMENTATION_OPTION },
//		        { label: $STR('menuitem.Open_Doc_From_RefGuide_In_New_Window', DOJO_BUNDLE), nol10n: true, disabled: !refDocUrl, command: bindFixed(this.openBrowserWindowWithURL, this, refDocUrl, context), optionType: DOCUMENTATION_OPTION }
		    ];
    },
    
    openBrowserTabWithURL: function(url, context) {
    	openNewTab(url);
    },
    
    openBrowserWindowWithURL: function(url, context) {
    	//FIXME make this work!
    	var h = context.window.height;
    	var w = context.window.width;
        var args = {
                browser: context.browser
        };
    	openWindow("DojoDoc", url, "width="+w+",height="+h, args);
    }
	
};


var SHOW_WIDGETS = 10;
var SHOW_CONNECTIONS = 20;
var SHOW_CONNECTIONS_TABLE = 30;
var SHOW_SUBSCRIPTIONS = 40;

var ActivablePanelPlusMixin = extend(Firebug.ActivablePanel, DojoPanelMixin);

/**
 * @panel Main dojo extension panel
 */
DojoExtension.dojofirebugextensionPanel = function() {};
DojoExtension.dojofirebugextensionPanel.prototype = extend(ActivablePanelPlusMixin,
{	
    name: "dojofirebugextension",

    title: $STR('panel.dojofirebugextensionPanel.title', DOJO_BUNDLE),
    
    searchable: true,
    inspectable: true,
    inspectOnlySupportedObjects: true,

    /**
     * @override
     */
    initialize: function() {
    	Firebug.ActivablePanel.initialize.apply(this, arguments);
    	
    	// DomHighlightSelector       
        this._domHighlightSelector = new DomHighlightSelector();
        this._domHighlightSelector.addSelector("dojo-connection", function(selection, connection){
    		return connection && ((connection['obj'] === selection) || (connection['context'] === selection));
    	});
        this._domHighlightSelector.addSelector("dojo-subscription", function(selection, subscription){
    		return subscription && (subscription['context'] === selection);
    	});
        this._domHighlightSelector.addSelector("dojo-widget", function(selection, widget){
    		return (widget === selection);
    	});
        
        // Message boxes
        var self = this;
        var ctx = _safeGetContext(self);
        
        /* Message box for connections */
        var conMsgBox = this.connectionsMessageBox = new ActionMessageBox("connectionsMsgBox", this.panelNode, 
        													$STR('warning.newConnectionsMade', DOJO_BUNDLE),
        													$STR('warning.newConnectionsMade.button.update', DOJO_BUNDLE),
        													function(actionMessageBox){
        														actionMessageBox.hideMessageBox();
        														self.showConnectionsInTable(ctx);
        													});
        var showConnectionsMessageBox = function() { conMsgBox.showMessageBox(); };
        ctx.connectionsAPI.addListener(DojoModel.ConnectionsAPI.ON_CONNECTION_ADDED, showConnectionsMessageBox);
        ctx.connectionsAPI.addListener(DojoModel.ConnectionsAPI.ON_CONNECTION_REMOVED, showConnectionsMessageBox);
        
        /* Message box for subscriptions */
        var subMsgBox = this.subscriptionsMessageBox = new ActionMessageBox("subscriptionsMsgBox", this.panelNode, 
				$STR('warning.newSubscriptionsMade', DOJO_BUNDLE),
				$STR('warning.newSubscriptionsMade.button.update', DOJO_BUNDLE),
				function(subscriptionMsgBox){
        			subscriptionMsgBox.hideMessageBox();
					self.showSubscriptions(ctx);
				});
        var showSubscriptionsMessageBox = function() { subMsgBox.showMessageBox(); };
        ctx.connectionsAPI.addListener(DojoModel.ConnectionsAPI.ON_SUBSCRIPTION_ADDED, showSubscriptionsMessageBox);
        ctx.connectionsAPI.addListener(DojoModel.ConnectionsAPI.ON_SUBSCRIPTION_REMOVED, showSubscriptionsMessageBox);
        
        // StyleSheet
    	_addStyleSheet(this.document);
	},
	
	/**
     * @state: persistedPanelState plus non-persisted hide() values 
     * @override
     */
    show: function(state) {
		this.showToolbarButtons("fbStatusButtons", true);
		
		// Sync the selected toolbar button with the selected view.
		var ctx = _safeGetContext(this);
		this._setOption(ctx.dojo.mainMenuSelectedOption, ctx);
	},
	
	/**
     * This method shows the first view for a loaded page.
     */
    showInitialView: function(context) {
		var widgets = this.getWidgets(context);
		var connsAPI = context.connectionsAPI;
		if (widgets.length > 0){
			this.showWidgets(context);
		} else if (connsAPI && connsAPI.getConnections().length > 0) {
			this.showConnectionsInTable(context);
		} else if (connsAPI && connsAPI.getSubscriptions().getKeys().length > 0) {
			this.showSubscriptions(context);
		} else { //Default
			this.showWidgets(context);
		}
	},

	/**
	 * Refresh the panel.
	 * @override
	 */
	 refresh: function() {
	 	var context = _safeGetContext(this);
	 	
	 	// Select the current main view.
	 	if(this._isOptionSelected(SHOW_WIDGETS, context)) {
	 		this.showWidgets(context);
	 	} else if(this._isOptionSelected(SHOW_CONNECTIONS_TABLE, context)) {
	 		this.showConnectionsInTable(context);
	 	} else if(this._isOptionSelected(SHOW_SUBSCRIPTIONS, context)) {
	 		this.showSubscriptions(context);
	    }
	 },
	
    /**
     * Returns a number indicating the view's ability to inspect the object.
     * Zero means not supported, and higher numbers indicate specificity.
     * @override
     */
    supportsObject: function(object, type) {
    	var context = _safeGetContext(this);
    	var support = this.supportsActualObject(context, object, type);
    	
    	if(support == 0) {
    		support = this.doesNodeBelongToWidget(context, object, type);
    	}

    	return support;
    },
    
    
    /**
     * Support verification for actual object
     */
    supportsActualObject: function(context, object, type) {
    	var dojoAccessor = getDojoAccessor(context);
    	if (dojoAccessor.isWidgetObject(object)){
    		return 1;
    	}
    	
    	//delegate to side panels...
    	return ((this._isConnection(object, type) || this._isSubscription(object, type))) ? 1 : 0;
    },

    /**
     * Support verification for a potential widget that contains the node.
     */
    /*int: 0|1*/doesNodeBelongToWidget: function(context, object, type) {
    	var dojoAccessor = getDojoAccessor(context);
    	var widget = dojoAccessor.getEnclosingWidget(context, object);
    	return widget ? 1 : 0;
    },
    
    /**
     * returns whether the given object is a connection.
     * @param obj the obj to check
     * @param type optional
     */
    _isConnection: function(obj, type) {
    	if(!obj) {
    		return false;
    	}
    	return DojoExtension.ConnectionsSidePanel.prototype.supportsObject(obj, type);
    },

    /**
     * returns whether the given object is a connection.
     * @param obj the obj to check
     * @param type optional
     */
    _isSubscription: function(obj, type) {
    	if(!obj) {
    		return false;
    	}
    	return DojoExtension.SubscriptionsSidePanel.prototype.supportsObject(obj, type);
    },


    /**
     * Return the path of selections shown in the extension toolbar.
     * @override
     */
    getObjectPath: function(object) {
	     return [object];
    },
    
    /**
     * Highlight the found row.
     */
    highlightRow: function(row) {
        if (this.highlightedRow) {
            cancelClassTimed(this.highlightedRow, "jumpHighlight", this.context);
        }

        this.highlightedRow = row;

        if (row){
            setClassTimed(row, "jumpHighlight", this.context);
        }
    },
    
    /**
     * Panel search.
     * @override
     */
    search: function(text, reverse) {
    	if (!text) {
            delete this.currentSearch;
            this.highlightRow(null);
            this.document.defaultView.getSelection().removeAllRanges();
            return false;
        }

        var row;
        if (this.currentSearch && text == this.currentSearch.text) {
            row = this.currentSearch.findNext(true, false, reverse, Firebug.Search.isCaseSensitive(text));
        } else {
            this.currentSearch = new TextSearch(this.panelNode);
            row = this.currentSearch.find(text, reverse, Firebug.Search.isCaseSensitive(text));
        }

        if (row) {
        	var sel = this.document.defaultView.getSelection();
            sel.removeAllRanges();
            sel.addRange(this.currentSearch.range);

            scrollSelectionIntoView(this);
            this.highlightRow(row);

            return true;
        } else {
            this.document.defaultView.getSelection().removeAllRanges();
            return false;
        }
    	
    },
    
    _showReloadBoxIfNeeded: function(context) { 
		// Verify if the context is consistent.
	    if (_needsReload(context)/*context.needReload*/) {
	    	/* Message box for Reload page */
	        var conMsgBox = new ActionMessageBox("MsgBox", this.panelNode, 
	        												$STR('warning.pageNeedToBeReload', DOJO_BUNDLE),
	        												$STR('warning.pageNeedToBeReload.button', DOJO_BUNDLE),
	        												function(actionMessageBox){
	        													FirebugContext.window.location.reload();
	        												});
	        conMsgBox.loadMessageBox(true);
    	}
    },
    
    /**
     * Update panel view.
     * @param panelConfig the configuration
     * @param context the FB context
     */
    updatePanelView: function(/*PanelRenderConfig*/panelConfig, context){
	    var selection = context.dojoExtensionSelection;
	    var dojoAccessor = getDojoAccessor(context);
	    
    	// Main panel view.
    	if (panelConfig.refreshMainPanel){
    		// Clear the main panel
    		this.panelNode.innerHTML = "";
    		 
    		// Verify if the context is consistent.
    		this._showReloadBoxIfNeeded(context);
    		
    		// Select the most suitable main panel to show the info about the object.
    		
    		if (panelConfig.isViewSelected(PanelRenderConfig.VIEW_WIDGETS) || 
    			(!panelConfig.mainPanelView && dojoAccessor.isWidgetObject(selection))) {
	    		this._renderWidgets(context);
	    		
	    	} else if (panelConfig.isViewSelected(PanelRenderConfig.VIEW_CONNECTIONS) ||
				(!panelConfig.mainPanelView && this._isConnection(selection))) {
				this._renderConnectionsInTable(context);
			
	    	} else if (panelConfig.isViewSelected(PanelRenderConfig.VIEW_SUBSCRIPTIONS) || 
				(!panelConfig.mainPanelView && this._isSubscription(selection))) {
				this._renderSubscriptions(context);
			} else {
				//if no other option...
				this._renderWidgets(context);
			}
	    }
	    
    	// Highlight and Scroll the selection in the current view.
    	//FIXME why are we passing in 3 args if the target function receives only 2?
    	this.highlightSelection(selection, panelConfig.highlight, panelConfig.scroll);
    	
    	// Side panel view
    	if (panelConfig.refreshSidePanel) {
	    	var sidePanel = null;
    		if (panelConfig.sidePanelView) {
    			Firebug.chrome.selectSidePanel(panelConfig.sidePanelView);
	    	} else {
	    		// Select the most suitable side panel to show the info about the object.
				if (this._isConnection(selection)) {
					Firebug.chrome.selectSidePanel(DojoExtension.ConnectionsSidePanel.prototype.name);
				} else if(this._isSubscription(selection)){
					Firebug.chrome.selectSidePanel(DojoExtension.SubscriptionsSidePanel.prototype.name);
				}
	    	}
	    }
    },
    
    /**
     * Firebug wants to show an object to the user and this panel has the best supportsObject() result for the object.
     * Should we also focus now a side panel?
     * @override
     */
    updateSelection: function(object) {
    	var ctx = _safeGetContext(this);
    	if (this.supportsActualObject(ctx, object) == 0) {
    		var dojoAccessor = getDojoAccessor(ctx);
    		this.select(dojoAccessor.getEnclosingWidget(ctx, object));
    	} else {
    	
	    	Firebug.ActivablePanel.updateSelection.call(this, object);
	    	
	    	if (!ctx.sidePanelSelectionConfig) {
	    		this.updatePanelView(new PanelRenderConfig(/*refreshMainPanel*/true, /*mainPanelView*/null, /*highlight*/true, /*scroll*/true,
	    												   /*refreshSidePanel*/true, /*sidePanelView*/null), ctx);
	    	} else {
	    		this.updatePanelView(ctx.sidePanelSelectionConfig, ctx);
	    	}    	

    	}
    },
    
    /**
	 * This method highlight the selection in the main panel.
	 * @param selection the selection.
	 * @param focus boolean to decide if the object should be focus
	 */
	highlightSelection : function(selection, /*boolean*/focus) {
    	this._domHighlightSelector.highlightSelection(this.panelNode, selection, focus);
	},
    
    /**
     * This method show the object in the Connection sidePanel.
     * @param object the object to show
     */
    showObjectInConnectionSidePanel : function(object){
    	this.updateSelectionAndSelectSidePanel(object, DojoExtension.ConnectionsSidePanel.prototype.name);
    },
    
    /**
     * This method show the object in the Subscription sidePanel.
     * @param object the object to show
     */
    showObjectInSubscriptionSidePanel : function(object){
    	this.updateSelectionAndSelectSidePanel(object, DojoExtension.SubscriptionsSidePanel.prototype.name);
    },
    
    /**
     * This method show the object in the sidePanelName without changing the dojo main panel
     * @param object the object to show
     * @param sidePanelName the side panel where the object should be shown
     */
    updateSelectionAndSelectSidePanel : function(object, sidePanelName){
    	var ctx = _safeGetContext(this);
    	
    	// Set in the context the render configurations.
    	ctx.sidePanelSelectionConfig = new PanelRenderConfig(/*refreshMainPanel*/false, /*mainPanelView*/null, /*highlight*/false, /*scroll*/false,
    														 /*refreshSidePanel*/true, /*sidePanelView*/sidePanelName);
    	Firebug.chrome.select(object, this.name, sidePanelName, true);
    	// Clean from the context the render configurations.
    	ctx.sidePanelSelectionConfig = null;
    },
    
    /**
     * The select method is extended to force the panel update always.
     * @override 
     */
    select: function(object, forceUpdate) {
    	_safeGetContext(this).dojoExtensionSelection = object;
    	ActivablePanelPlusMixin.select.call(this, object, true);
    },    
    
    /**
     *  returns true is the given option is selected on this context
     */
    /*boolean*/_isOptionSelected: function(option, ctx) {
    	return (ctx.dojo.mainMenuSelectedOption) && (ctx.dojo.mainMenuSelectedOption == option); 
    },
    
    _setOption: function(option, ctx) {
    	ctx.dojo.mainMenuSelectedOption = option;
    	
    	var doc = this.panelNode.document;
    	$("widgetsButton", doc).checked = (option == SHOW_WIDGETS);
    	$("connectionsInTableButton", doc).checked = (option == SHOW_CONNECTIONS_TABLE);
    	$("subscriptionsButton", doc).checked = (option == SHOW_SUBSCRIPTIONS);
    },
    
    /**
     * returns panel's main menu items
     * @override
     */
    getOptionsMenuItems: function() {
        // {label: 'name', nol10n: true,  type: "checkbox", checked: <value>, command:function to set <value>}
    	
    	var context = _safeGetContext(this);
    	return [
    	        { label: $STR('label.Widgets', DOJO_BUNDLE), nol10n: true, type: 'checkbox', checked: this._isOptionSelected(SHOW_WIDGETS, context), command: bindFixed(this.showWidgets, this, context)  },
    	        { label: $STR('label.Connections', DOJO_BUNDLE), nol10n: true, type: 'checkbox', checked: this._isOptionSelected(SHOW_CONNECTIONS_TABLE, context), command: bindFixed(this.showConnectionsInTable, this, context)  },
    	        { label: $STR('label.Subscriptions', DOJO_BUNDLE), nol10n: true, type: 'checkbox', checked: this._isOptionSelected(SHOW_SUBSCRIPTIONS, context), command: bindFixed(this.showSubscriptions, this, context)  },
    	        "-",
    	        { label: $STR('label.HashCodeBasedDictionary', DOJO_BUNDLE), nol10n: true, type: 'checkbox', checked: _isHashCodeBasedDictionaryImplementationEnabled(), command: bindFixed(this._switchConfigurationSetting, this, _switchMapImplementation, context) },
    	        { label: $STR('label.BreakPointPlaceEnable', DOJO_BUNDLE), nol10n: true, type: 'checkbox', disabled: _isUseEventBasedProxyEnabled(), checked: !_isBreakPointPlaceSupportDisabled(), command: bindFixed(this._switchConfigurationSetting, this, _switchBreakPointPlaceEnabled, context) },
    	        { label: $STR('label.UseEventBasedProxy', DOJO_BUNDLE), nol10n: true, type: 'checkbox', disabled:!_isBreakPointPlaceSupportDisabled(), checked: _isUseEventBasedProxyEnabled(), command: bindFixed(this._switchConfigurationSetting, this, _switchUseEventBasedProxy, context) },
    	        "-",
    	        { label: $STR('label.About', DOJO_BUNDLE), nol10n: true, command: bindFixed(this.showAbout, this) },
    	        "-",
    	        { label: $STR('label.Refresh', DOJO_BUNDLE), nol10n: true, command: bindFixed(this.refresh, this) }
        ];
    },

    _switchConfigurationSetting: function(switchSettingFn, context) {
    	switchSettingFn.apply(this);
    	_setNeedsReload(context, true);
    	this.refresh();
    },
    
    /*
     * old about dialog 
     * @deprecated
     */
    showAbout: function() {
    	//alert($STRF('about.message', [ getVersion() ], DOJO_BUNDLE));
    	this.openAboutDialog();
    },

    /*
     * method copied from chrome.js
     */
    openAboutDialog: function()
    {
        if (FBTrace.DBG_WINDOWS)
            FBTrace.sysout("dojofirebugextension.openAboutDialog");

        try
        {
            // Firefox 4.0 implements new AddonManager. In case of Firefox 3.6 the module
            // is not avaialble and there is an exception.
            Components.utils.import("resource://gre/modules/AddonManager.jsm");
        }
        catch (err)
        {
        }

        if (typeof(AddonManager) != "undefined")
        {
            AddonManager.getAddonByID("dojo@silvergate.ar.ibm.com", function(addon) {
                openDialog("chrome://mozapps/content/extensions/about.xul", "",
                "chrome,centerscreen,modal", addon);
            });
        }
        else
        {
            var extensionManager = FBL.CCSV("@mozilla.org/extensions/manager;1",
                "nsIExtensionManager");

            openDialog("chrome://mozapps/content/extensions/about.xul", "",
                "chrome,centerscreen,modal", "urn:mozilla:item:dojo@silvergate.ar.ibm.com",
                extensionManager.datasource);
        }
    },
    
    /**
     * returns current page's widgets
     */
    /*array*/getWidgets: function(context) {
    	var accessor = getDojoAccessor(context);
    	if(!accessor) {
    		return [];
    	}
    	return accessor.getWidgets(context);
    },

    /**
     * Show the widget list.
     */
    showWidgets: function(context) {
    	this.updatePanelView(
    			new PanelRenderConfig(/*refreshMainPanel*/true, /*mainPanelView*/PanelRenderConfig.VIEW_WIDGETS, /*highlight*/true, /*scroll*/true,
    								  /*refreshSidePanel*/false, /*sidePanelView*/null), context);
    },
    	
    /**
     * Render the Widget list view
     * !Do not invoke this method directly. It must be just invoked from the updatePanelView method.
     */
    _renderWidgets: function(context) {
    	this._setOption(SHOW_WIDGETS, context);
    	
    	var widgets = this.getWidgets(context);
    	
	    var areThereAnyWidgets = widgets.length > 0; 
	   
	    if(areThereAnyWidgets) {
	    	// Function to show specific widget info.
	    	var funcWidgetProperties = getDojoAccessor(context).getSpecificWidgetProperties;
	    	DojoReps.WidgetListRep.tag.append({object: widgets, propertiesToShow: funcWidgetProperties}, this.panelNode);
	    } else {
	    	DojoReps.Messages.infoTag.append({object: $STR('warning.nowidgets.msg1', DOJO_BUNDLE)}, this.panelNode);
	    	DojoReps.Messages.simpleTag.append({object: $STR("warning.nowidgets.msg2", DOJO_BUNDLE)}, this.panelNode);
	  	}
	    return areThereAnyWidgets;
    },

	/**
	 * Show the connections
	 */
    showConnectionsInTable: function(context) {
    	this.updatePanelView(
    			new PanelRenderConfig(/*refreshMainPanel*/true, /*mainPanelView*/PanelRenderConfig.VIEW_CONNECTIONS, /*highlight*/true, /*scroll*/true,
    								  /*refreshSidePanel*/false, /*sidePanelView*/null), context);
    },
    
    /**
     * Render the Connections view
     * !Do not invoke this method directly. it must be just invoked from the updatePanelView method.
     */
    _renderConnectionsInTable: function(context) {
    	this._setOption(SHOW_CONNECTIONS_TABLE, context);
    	
    	if(!context.connectionsAPI) {
    		return;
    	}

		// TODO: Add comments (priorityCriteriaArray)
    	var criterias = [DojoModel.ConnectionArraySorter.OBJ,
             			 DojoModel.ConnectionArraySorter.EVENT,
              			 DojoModel.ConnectionArraySorter.CONTEXT,
              			 DojoModel.ConnectionArraySorter.METHOD];
    	
    	// Sort the connection array.
    	priorityCriteriaArray = context.priorityCriteriaArray || criterias; 
    	
    	var cons = context.connectionsAPI.getConnections(priorityCriteriaArray);
    	
    	var document = this.document;
    	
    	// Show the visual content.
    	this.connectionsMessageBox.loadMessageBox(false);
    	
    	// There are connections registered
    	if (cons.length > 0) {
    	
	    	var self = this;
	    	var sorterFunctionGenerator = function(criteriaPriorityArray){
	    		return function(){
	    			context.priorityCriteriaArray = criteriaPriorityArray;
	    			self.showConnectionsInTable.call(self, context);
	    		};
	    	};
	    	
	    	DojoReps.ConnectionsTableRep.tag.append({connections: cons,
	    											 priorityCriteriaArray: priorityCriteriaArray,
	    											 sorterObject: sorterFunctionGenerator([DojoModel.ConnectionArraySorter.OBJ,
	    											                            			DojoModel.ConnectionArraySorter.EVENT,
	    											                              			DojoModel.ConnectionArraySorter.CONTEXT,
	    											                              			DojoModel.ConnectionArraySorter.METHOD]),
	    											                              			
	    											 sorterEvent: sorterFunctionGenerator([DojoModel.ConnectionArraySorter.EVENT,
	    											                                        DojoModel.ConnectionArraySorter.OBJ,
	    											                              			DojoModel.ConnectionArraySorter.CONTEXT,
	    											                              			DojoModel.ConnectionArraySorter.METHOD]),
	    											                              			
	    											 sorterContext: sorterFunctionGenerator([DojoModel.ConnectionArraySorter.CONTEXT,
	    											                              			DojoModel.ConnectionArraySorter.METHOD,
	    											                              			DojoModel.ConnectionArraySorter.OBJ,
	    											                              			DojoModel.ConnectionArraySorter.EVENT]),
	    											                              			
	    											 sorterMethod: sorterFunctionGenerator([DojoModel.ConnectionArraySorter.METHOD,
	    											                                        DojoModel.ConnectionArraySorter.CONTEXT,
	    											                              			DojoModel.ConnectionArraySorter.OBJ,
	    											                              			DojoModel.ConnectionArraySorter.EVENT])}, this.panelNode);
	    	
    	} else {
    		DojoReps.Messages.infoTag.append({object: $STR('warning.noConnectionsRegistered', DOJO_BUNDLE)}, this.panelNode);
    	}
    	
    },
    
    /**
     * Show the Subscriptions
     */
    showSubscriptions: function(context) {
    	this.updatePanelView(
    			new PanelRenderConfig(/*refreshMainPanel*/true, /*mainPanelView*/PanelRenderConfig.VIEW_SUBSCRIPTIONS, /*highlight*/true, /*scroll*/true,
    								  /*refreshSidePanel*/false, /*sidePanelView*/null), context);
    },
    	
    /**
     * Render the Subscriptions view
     * !Do not invoke this method directly. it must be just invoked from the updatePanelView method.
     */
    _renderSubscriptions: function(context) {
    	this._setOption(SHOW_SUBSCRIPTIONS, context);
    	
    	if(!context.connectionsAPI) {
    		return;
    	}

    	var document = this.document;
    	
    	// Show the visual content.
    	this.subscriptionsMessageBox.loadMessageBox(false);
    	
    	// There are connections registered
    	var subs = context.connectionsAPI.getSubscriptions();
    	if (subs.getValues().length > 0) {
    		DojoReps.SubscriptionsRep.tag.append({object: subs}, this.panelNode);
    	} else {
    		DojoReps.Messages.infoTag.append({object: $STR('warning.noSubscriptionsRegistered', DOJO_BUNDLE)}, this.panelNode);
    	}
    },
    
    /**
     * Support for panel activation.
     */
    onActivationChanged: function(enable)
    {
        if (enable) {
        	DojoExtension.dojofirebugextensionModel.addObserver(this);
        } else {
        	DojoExtension.dojofirebugextensionModel.removeObserver(this);
        }
    }

});

// ****************************************************************
// SIDE PANELS
// ****************************************************************
/**
 * @panel Info Side Panel.
 * This side panel shows general information about the dojo version and configuration use in the page. 
 */
DojoExtension.DojoInfoSidePanel = function() {};
DojoExtension.DojoInfoSidePanel.prototype = extend(Firebug.Panel,
{
    name: "dojoInformationSidePanel",
    title: $STR('panel.dojoInformationSidePanel.title', DOJO_BUNDLE),
    parentPanel: DojoExtension.dojofirebugextensionPanel.prototype.name,
    order: 1,
    enableA11y: true,
    deriveA11yFrom: "console",
    
    _COUTER_UPDATE_DELAY : 100,
    
    _connectionCounterId: "connectionCounterId",
    _subscriptionCounterId: "subscriptionCounterId",

    _getDojoInfo: function(context) {		
		var accessor = getDojoAccessor(context);
		if(!accessor)
			return;
				
		return accessor.getDojoInfo(context);
	},

    initialize: function() {
    	Firebug.Panel.initialize.apply(this, arguments);
    	
    	// Listeners registration for automatic connections and subscriptions counter.
    	var ctx = _safeGetContext(this);
    	var self = this;
    	var eventsRegistrator = new DojoModel.EventsRegistrator(ctx.connectionsAPI);
    	var connectionsCounterGetter = function() {
    		if(!ctx.connectionsAPI) return;
    		self._updateCounter(this.connectionCounterNode, ctx.connectionsAPI.getConnections().length);
    	};
    	var subscriptionsCounterGetter = function() {
    		if(!ctx.connectionsAPI) return;
			self._updateCounter(this.subscriptionCounterNode, ctx.connectionsAPI.getSubscriptionsList().length);
		};
    	eventsRegistrator.registerListenerForEvent(
    			[DojoModel.ConnectionsAPI.ON_CONNECTION_ADDED, DojoModel.ConnectionsAPI.ON_CONNECTION_REMOVED], connectionsCounterGetter);
    	eventsRegistrator.registerListenerForEvent(
    			[DojoModel.ConnectionsAPI.ON_SUBSCRIPTION_ADDED, DojoModel.ConnectionsAPI.ON_SUBSCRIPTION_REMOVED], subscriptionsCounterGetter);
    	ctx.infoPanelCoutersRefreshEventsReg = eventsRegistrator;
        
    	_addStyleSheet(this.document);
	},

	show: function(state) {
		var ctx = _safeGetContext(this);
		this.showInfo(ctx);
		if (ctx.infoPanelCoutersRefreshEventsReg){
			ctx.infoPanelCoutersRefreshEventsReg.setPropertyToListenersContext(
					"connectionCounterNode", this._getCounterNode(this._connectionCounterId));
			ctx.infoPanelCoutersRefreshEventsReg.setPropertyToListenersContext(
					"subscriptionCounterNode", this._getCounterNode(this._subscriptionCounterId));
			ctx.infoPanelCoutersRefreshEventsReg.addAllListeners();
		}
	},
	
	hide: function(state) {
		var ctx = _safeGetContext(this);
		if (ctx.infoPanelCoutersRefreshEventsReg){
			ctx.infoPanelCoutersRefreshEventsReg.removeAllListeners();
		}
	},
	
	_getCounterNode: function(counterId){
		// FIXME: Use $() function. Find out why this.panelNode has no getElementById method. 
		var counters = getElementsByClass(this.panelNode, counterId);
		return (counters.length > 0) ? counters[0] : null;//$('connectionCounterId', this.panelNode);
	},
	
	_updateCounter: function(counterNode, number) {
		if (counterNode) {
			counterNode.innerHTML = number;
		}
	},
	
    /**
     * added custom method (this one) instead of updateSelection to avoid changing the contents of
     * this panel when not needed.
     */
	showInfo: function(context) {
		var dojoInfo = this._getDojoInfo(context);
	
		if(!dojoInfo) {
			clearNode(this.panelNode);
			return;
		}
		
		//Dojo version
		var versionLabel = $STR('dojo.version.label', DOJO_BUNDLE);
		var versionObject = {};
		versionObject[versionLabel] = dojoInfo.version;
		Firebug.DOMPanel.DirTable.tag.replace({object: versionObject }, this.panelNode);
		
		//Dojo config
		Firebug.DOMPanel.DirTable.tag.append({object: dojoInfo.djConfig}, this.panelNode);

		//Module prefixes
		var modLabel = $STR('dojo.modulesPrefixes.label', DOJO_BUNDLE);
		var modPrefixes = {};
		modPrefixes[modLabel] = dojoInfo.modulePrefixes;
		Firebug.DOMPanel.DirTable.tag.append({object: modPrefixes}, this.panelNode);

		//Global connections count
		var globalConnectionsCount = (context.connectionsAPI)?context.connectionsAPI.getConnections().length:0;
		DojoReps.CounterLabel.tag.append({label: $STR('conn.count.title', DOJO_BUNDLE),
										  object: globalConnectionsCount, 
										  counterLabelClass:"countOfConnectionLabel",
										  counterValueId: this._connectionCounterId}, this.panelNode);
		
		//Global subscriptions count
		var globalSubscriptionsCount = (context.connectionsAPI)?context.connectionsAPI.getSubscriptionsList().length:0;
		DojoReps.CounterLabel.tag.append({label: $STR('subs.count.title', DOJO_BUNDLE),
										  object: globalSubscriptionsCount, 
										  counterLabelClass:"countOfSubscriptionLabel",
										  counterValueId: this._subscriptionCounterId}, this.panelNode);
		
	},
	
    refresh: function() {
		this.showInfo(_safeGetContext(this));
	},

    getOptionsMenuItems: function() {
        return [
            {label: $STR('label.Refresh', DOJO_BUNDLE), nol10n: true, command: bind(this.refresh, this) }
        ];
    }
	
});


var SimplePanelPlusMixin = extend(Firebug.Panel, DojoPanelMixin);
SimplePanelPlusMixin = extend(SimplePanelPlusMixin, {
	/**
	 * The select method is extended to assure that the selected object
	 * is the same one at this side panel and in the main panel.
	 * @override 
	 */
	select: function(object, forceUpdate) {
		var mainSO = _safeGetContext(this).dojoExtensionSelection;
		if (mainSO == object) {
			Firebug.Panel.select.call(this, object, true);
		}
	}
});

/**
 * @panel Connections Side Panel.
 * This side panel shows the connections information for the selected object. 
 */
DojoExtension.ConnectionsSidePanel = function() {};
DojoExtension.ConnectionsSidePanel.prototype = extend(SimplePanelPlusMixin,
{
    name: "connectionsSidePanel",
    title: $STR('panel.connections.title', DOJO_BUNDLE),
    parentPanel: DojoExtension.dojofirebugextensionPanel.prototype.name,
    order: 2,
    enableA11y: true,
    deriveA11yFrom: "console",
    breakable: true,   
    
    initialize: function() {
    	Firebug.Panel.initialize.apply(this, arguments);
    	_addStyleSheet(this.document);
	},

    /**
     * Returns a number indicating the view's ability to inspect the object.
     * Zero means not supported, and higher numbers indicate specificity.
     */
    supportsObject: function(object, type) {
		var api = _safeGetContext(this).connectionsAPI;
    	return (api && api.areThereAnyConnectionsFor(object)) ? 2001 : 0;
    },

    /**
     * triggered when there is a Firebug.chrome.select() that points to the parent panel.
     */
	updateSelection: function(object) {
    	var api = _safeGetContext(this).connectionsAPI;
		var objectInfo = (api) ? api.getConnection(object) : null;
		var connectionsTracker  = (objectInfo) ? objectInfo.getConnectionsTracker() : null;
    	
    	if(connectionsTracker && !connectionsTracker.isEmpty()) {
    		DojoReps.ConnectionsInfoRep.tag.replace({ object: connectionsTracker }, this.panelNode);
    	} else {
    		DojoReps.Messages.infoTag.replace({object: $STR('warning.noConnectionsInfoForTheObject', DOJO_BUNDLE)}, this.panelNode);
    	}
	}
	
});

/**
 * @panel Subscriptions Side Panel.
 * This side panel shows the subscriptions information for the selected object. 
 */
DojoExtension.SubscriptionsSidePanel = function() {};
DojoExtension.SubscriptionsSidePanel.prototype = extend(SimplePanelPlusMixin,
{
    name: "subscriptionsSidePanel",
    title: $STR('panel.subscriptions.title', DOJO_BUNDLE),
    parentPanel: DojoExtension.dojofirebugextensionPanel.prototype.name,
    order: 3,
    enableA11y: true,
    deriveA11yFrom: "console",
    breakable: true,

    initialize: function() {
    	Firebug.Panel.initialize.apply(this, arguments);
    	_addStyleSheet(this.document);
	},

    /**
     * Returns a number indicating the view's ability to inspect the object.
     * Zero means not supported, and higher numbers indicate specificity.
     */
    supportsObject: function(object, type) {
		var api = _safeGetContext(this).connectionsAPI;
    	return (api && api.areThereAnySubscriptionFor(object)) ? 2000 : 0;
    },
    
    /**
     * triggered when there is a Firebug.chrome.select() that points to the parent panel.
     */
	updateSelection: function(object) {
    	var api = _safeGetContext(this).connectionsAPI;
		var objectInfo = (api) ? api.getConnection(object) : null;
		var subscriptionsTracker = (objectInfo) ? objectInfo.getSubscriptionsTracker() : null;
    	
    	if(subscriptionsTracker && !subscriptionsTracker.isEmpty()) {
    		DojoReps.SubscriptionsArrayRep.tag.replace({ object: subscriptionsTracker}, this.panelNode);
    	} else {
    		DojoReps.Messages.infoTag.replace({object: $STR('warning.noSubscriptionsInfoForTheObject', DOJO_BUNDLE)}, this.panelNode);
    	}
	}

});

//************************************************************************************************

/**
 * @panel DOM Side Panel.
 * This side panel shows the same info the the DOM panel shows for the selected object. 
 */
DojoExtension.DojoDOMSidePanel = function(){};
DojoExtension.DojoDOMSidePanel.prototype = extend(Firebug.DOMBasePanel.prototype,
{
    name: "dojoDomSidePanel",
    title: "DOM",
    parentPanel: DojoExtension.dojofirebugextensionPanel.prototype.name,
    order: 4,
    enableA11y: true,
    deriveA11yFrom: "console",
    
    updateSelection: function(object)
    {
	   if (_safeGetContext(this).dojoExtensionSelection) {
    		return Firebug.DOMBasePanel.prototype.updateSelection.apply(this, arguments);
	   }
    }

});

// ************************************************************************************************

/**
 * @panel HTML Side Panel.
 * This side panel shows the same info the the HTML panel shows for the selected object. 
 */
DojoExtension.DojoHTMLPanel = function(){};
DojoExtension.DojoHTMLPanel.prototype = extend(Firebug.HTMLPanel.prototype,
{
    name: "dojoHtmlSidePanel",
    title: "HTML",
    parentPanel: DojoExtension.dojofirebugextensionPanel.prototype.name,
    order: 5,
    enableA11y: true,
    deriveA11yFrom: "console",

    initialize: function(context, doc)
    {
		Firebug.HTMLPanel.prototype.initialize.apply(this, arguments);
		_addStyleSheet(this.document);
    },

    show: function(state)
    {
        Firebug.HTMLPanel.prototype.show.apply(this, arguments);
        this.showToolbarButtons("fbHTMLButtons", false);
    },

    updateSelection: function(object)
    {
    	var dojoPanelSelection = _safeGetContext(this).dojoExtensionSelection;
    	// Verify if selected object is the same one that is setted in the dojo panel.
    	if (dojoPanelSelection && 
    		((object == dojoPanelSelection) || (dojoPanelSelection['domNode'] == object))) {
		    // Verify if the object is a widget in order to show the domNode info.
	    	var dojoAccessor = getDojoAccessor(_safeGetContext(this));
	    	if (dojoAccessor.isWidgetObject(object)){
	    		this.select(object.domNode);
	    	} else {
	    		if (!object.nodeType){
	    			DojoReps.Messages.infoTag.replace({object: $STR('warning.noHTMLInfoForTheObject', DOJO_BUNDLE)}, this.panelNode);
	    		}
	    		return Firebug.HTMLPanel.prototype.updateSelection.apply(this, arguments);
	    	}
	   }
    }
});

//****************************************************************
//SIDE PANELS (END)
//****************************************************************



//****************************************************************
// DOJO MODULE
//****************************************************************
/**
 * @module Dojo Firebug extension module.
 */
DojoExtension.dojofirebugextensionModel = extend(Firebug.ActivableModule,
{
	
	extensionLoaded: false, //if the extension has already registered its stuff.

	//FIXME this shouldn't be here! model doesn't need to know the view! 
	//should base on listeners..
	_getDojoPanel: function(context) {
		return context.getPanel("dojofirebugextension");
	},
	    
    initialize: function() {
		Firebug.ActivableModule.initialize.apply(this, arguments);

		if (this.isExtensionEnabled() && Firebug.Debugger) {
    		Firebug.Debugger.addListener(this);
        }
    },

    shutdown: function() {
        Firebug.ActivableModule.shutdown.apply(this, arguments);
        if (Firebug.Debugger) {
            Firebug.Debugger.removeListener(this);
        }
    },
    
    initContext: function(context, persistedState) {
        Firebug.ActivableModule.initContext.apply(this, arguments);
        var dojoAccessor = new DojoModel.DojoAccessor();

		// Save the initial extension preferences values.
        context.initialConfig = {
        		hashCodeBasedDictionaryImplementationEnabled: _isHashCodeBasedDictionaryImplementationEnabled(),
        		breakPointPlaceSupportEnabled: !_isBreakPointPlaceSupportDisabled(),
        		useEventBasedProxy: _isUseEventBasedProxyEnabled()
        };
        
        context.objectMethodProxier = (_isUseEventBasedProxyEnabled()) ?
        								new ObjectMethodProxierEventBased(context) : 
        								new ObjectMethodProxierDirectAccessBased();

        context.dojo = { 
        		mainMenuSelectedOption: SHOW_WIDGETS,
        		dojoAccessor: dojoAccessor,
        		dojoDebugger: new DojoModel.DojoDebugger(dojoAccessor)
        };
        context.connectionsAPI = new DojoModel.ConnectionsAPI(_isHashCodeBasedDictionaryImplementationEnabled());
        
        // FIXME: HACK to find out if the page need to be reloaded due to data inconsistencies issues.
        var dojo = DojoAccess._dojo(context);
        _setNeedsReload(context, (dojo && dojo["subscribe"]));
    },

    destroyContext: function(context, persistedState) {
    	Firebug.ActivableModule.destroyContext.apply(this, arguments);
  
    	//destroy what we created on initContext
    	context.dojo.dojoDebugger.destroy();
    	context.dojo.dojoAccessor.destroy();
    	context.connectionsAPI.destroy();
    	context.objectMethodProxier.destroy();
    	
    	delete context.dojo.dojoDebugger;
    	delete context.dojo.dojoAccessor;
    	delete context.connectionsAPI;
    },
    
    /**
     * Called after a context's page gets DOMContentLoaded
     */
    loadedContext: function(context)
    {
    	var panel = this._getDojoPanel(context);
    	
    	if (panel) {
	    	// Show the initial view.
	    	panel.showInitialView(context);
    	}
    	
    },
    
    /**
     * invoked whenever the user selects a tab.
     */
	showPanel: function(browser, panel) {
    	//TODO is this code right (to be here)?
    	
    	// this test on name is a sign that this code belongs in panel.show()
		var isdojofirebugextensionPanel = panel && panel.name == "dojofirebugextension";
        var dojofirebugextensionButtons = browser.chrome.$("fbdojofirebugextensionButtons");
        collapse(dojofirebugextensionButtons, !isdojofirebugextensionPanel);

        //if (!isdojofirebugextensionPanel) {return;}                              
    },

    /**
     * show the about message
     */
    onAboutButton: function(/*fbug context*/context) {
    	this._getDojoPanel(context).showAbout();
    },

    /**
     * display all connections
     */
    onShowConnectionsInTableButton: function(/*fbug context*/context) {
    	this._getDojoPanel(context).showConnectionsInTable(context);
    },

    /**
     * display all widgets from dijit registry
     */
    onShowWidgetsButton: function(/*fbug context*/context) {
    	this._getDojoPanel(context).showWidgets(context);
    },
    
    /**
     * display all subscriptions
     */
    onShowSubscriptionsButton: function(/*fbug context*/context) {
    	this._getDojoPanel(context).showSubscriptions(context);
    },
    
    /**
     * called on each dojo file loaded (actually for every file).
     * This way, we can detect when dojo.js is loaded and take action. 
     */
    onSourceFileCreated : function (context, sourceFile) {
    	//var panelIsEnable = Firebug.getPref("extensions.firebug.dojofirebugextension", "enableSites");
    	var panelIsEnable = this.isExtensionEnabled();
    	
        if (panelIsEnable) {
	       var href = sourceFile.href;
		   
		   var dojo = DojoAccess._dojo(context);
		   if (!context.connectHooked && dojo && dojo.connect) {
			   context.connectHooked = true;
			   
			   context.objectMethodProxier.proxyFunction(dojo, "_connect", null, this._proxyConnect(context));
			   context.objectMethodProxier.proxyFunction(dojo,  "disconnect", this._proxyDisconnect(context), null);
			   context.objectMethodProxier.proxyFunction(dojo,  "subscribe", null, this._proxySubscribe(context));
			   context.objectMethodProxier.proxyFunction(dojo, "unsubscribe", this._proxyUnsubscribe(context), null);
			   
			   // FIXME[BugTicket#91]: Replace this hack fix for a communication mechanism based on events.
			   this._protectProxy(context, '_connect', 'disconnect', 'subscribe', 'unsubscribe');
		   }
		   
		   // Check if the _connect function was overwritten.
		   if (context.connectHooked && (!context.connectREHOOKED) && !DojoModel.isDojoExtProxy(dojo._connect) && !dojo._connect._listeners) {
			   context.connectREHOOKED = true;
			   
			   context.objectMethodProxier.proxyFunction(dojo, "_connect", null, this._proxyConnect(context));
				
			   // FIXME[BugTicket#91]: Replace this hack fix for a communication mechanism based on events.
			   this._protectProxy(context, "_connect");
		   }
       }
	},
	
	// FIXME[BugTicket#91]: Replace this hack fix for a communication mechanism based on events.
	/**
	 * This function is a hack that wrap the proxies to avoid errors happen when the 
	 * property __parent__ are invoked for the functions.
	 */
	_protectProxy : function(context){
		var dojo = DojoAccess._dojo(context);
		var f = function(){};
		f.internalClass = 'dojoext-added-code';
		for (var i = 1; i < arguments.length; i++) {
			dojo.connect(dojo, arguments[i], f);
		}
	},

    _proxyConnect : function(context){
		var dojo = DojoAccess._dojo(context);  
		var self = this;
		var dojoDebugger = getDojoDebugger(context);
		return (function(ret, args){
				   
				   // FIXME[BugTicket#91]: Defensive code to avoid registering a connection made as part of a hack solution.  
				   if (args[3] && args[3].internalClass == 'dojoext-added-code') {
					   return ret; 
				   }
			
				   var obj =  args[0] || dojo.global;
		   		   var event = args[1];

			   		/* The context parameter could be null, in that case it will be determined according to the dojo.hitch implementation.
			   		 * See the dojo.hitch comment at [dojo directory]/dojo/_base/lang.js and 
			   		 * dojo.connect comment at [dojo directory]/dojo/_base/connect.js
			   		 */
		   		   var handlerContext = args[2];
		   		   if (!handlerContext) {
		   			   if (typeof(args[3]) == 'function') {
		   					handlerContext = obj;
		   			   } else {
		   					handlerContext = dojo.global;
		   			   }
		   		   }
		   		   
		   		   var method = args[3];
		   		   var dontFix = (args.length>=5) ? args[4] : null;

		   		   var callerInfo = (context.initialConfig.breakPointPlaceSupportEnabled) ? dojoDebugger.getDebugInfoAboutConnectCaller(context) : null;
				   
		   		   context.connectionsAPI.addConnection(obj, event, handlerContext, method, dontFix, ret, callerInfo);
				   return ret;
				});
   },
   
   
   _proxyDisconnect : function(context){
	   var dojo = DojoAccess._dojo(context);
	   return (function(disc){
	   				context.connectionsAPI.removeConnection(disc);
	   	   	  });
   },

   _proxySubscribe : function(context){
	   var dojo = DojoAccess._dojo(context);
	   var dojoDebugger = getDojoDebugger(context);
	   return (function(ret, args){
			   		var callerInfo = (context.initialConfig.breakPointPlaceSupportEnabled) ? dojoDebugger.getDebugInfoAboutSubscribeCaller(context) : null;
			   		var method = (args[2]) ? args[2] : args[1];
			   		var scope = (args[2]) ? args[1] : null;
			   		if (!scope) {
			   			scope = (typeof(method) == 'string') ? dojo.global : dojo;
			   		}
			   		context.connectionsAPI.addSubscription(args[0], scope, method, ret, callerInfo);
			   		return ret;
		   	   });
   },
  
   _proxyUnsubscribe : function(context){
	   var dojo = DojoAccess._dojo(context);
	   return (function(disc){
		   			context.connectionsAPI.removeSubscription(disc);
		   	   });
   },
   
   // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   // Activation logic
   
   onObserverChange: function(observer) {
	   Firebug.ActivableModule.onObserverChange.apply(this, arguments);
	   
	   if(!this.hasObservers()) {
		   this.disableExtension();
	   } else {
		   this.enableExtension();
	   }
   },
   
   isExtensionEnabled: function() {
	   return Firebug.getPref("extensions.firebug.dojofirebugextension", "enableSites");
   },
   
   enableExtension: function() {
	   if(this.extensionLoaded)
		   return;
	   
	   
	   DojoReps.registerReps();

	   //last step
	   this.extensionLoaded = true;
   },
   
   disableExtension: function() {
	   if(!this.extensionLoaded)
		   return;
	   
	   DojoReps.unregisterReps();
	   
	   //last step
	   this.extensionLoaded = false;
   },

   // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   // FBTest

   // Expose our test list to the FBTest console for automated testing.
   onGetTestList: function(testLists) {
       testLists.push({
           extension: "dojofirebugextension",
           testListURL: "chrome://dojofirebugextension/content/fbtest/testlists/testList.html"
       });
   }/*,
   
   
   inspectFromContextMenu: function(elt)
   {
       var panel, inspectingPanelName;
       var context = Firebug.TabWatcher.getContextByWindow(elt.ownerDocument.defaultView);

       inspectingPanelName = "dojofirebugextension";

       Firebug.toggleBar(true, inspectingPanelName);
       Firebug.chrome.select(elt, inspectingPanelName);

       panel = Firebug.chrome.selectPanel(inspectingPanelName);
       panel.panelNode.focus();
   },
   
   canInspect: function(context, elt)
   {
	   return this._getDojoPanel(context).supportsObject(elt);
   }
	*/
    
});

 /***********************************************************************************************************************/

Firebug.registerActivableModule(DojoExtension.dojofirebugextensionModel);

Firebug.registerPanel(DojoExtension.dojofirebugextensionPanel);
Firebug.registerPanel(DojoExtension.DojoInfoSidePanel);
Firebug.registerPanel(DojoExtension.ConnectionsSidePanel);
Firebug.registerPanel(DojoExtension.SubscriptionsSidePanel);
Firebug.registerPanel(DojoExtension.DojoDOMSidePanel);
Firebug.registerPanel(DojoExtension.DojoHTMLPanel);
//Firebug.registerStylesheet("chrome://dojofirebugextension/skin/dojofirebugextension.css");
}});
