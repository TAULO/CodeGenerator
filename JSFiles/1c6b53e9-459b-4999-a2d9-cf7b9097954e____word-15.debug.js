/* Word specific JavaScript OM library */
/* Version: 15.0.3612 */
/*
	Copyright (c) Microsoft Corporation.  All rights reserved.
*/

OSF.DDA.RichInitializationReason={
	1: Microsoft.Office.WebExtension.InitializationReason.Inserted,
	2: Microsoft.Office.WebExtension.InitializationReason.DocumentOpened
};
OSF.DDA.CustomXmlPartEvents={
	NodeDeleted: "nodeDeleted",
	NodeInserted: "nodeInserted",
	NodeReplaced: "nodeReplaced"
};
(function () {
	for (var event in OSF.DDA.CustomXmlPartEvents) {
		Microsoft.Office.WebExtension.EventType[event]=OSF.DDA.CustomXmlPartEvents[event];
	}
})();
OSF.DDA.EventTypeToDispId[Microsoft.Office.WebExtension.EventType.NodeDeleted]=OSF.DDA.EventDispId.dispidDataNodeDeletedEvent;
OSF.DDA.EventTypeToDispId[Microsoft.Office.WebExtension.EventType.NodeInserted]=OSF.DDA.EventDispId.dispidDataNodeAddedEvent;
OSF.DDA.EventTypeToDispId[Microsoft.Office.WebExtension.EventType.NodeReplaced]=OSF.DDA.EventDispId.dispidDataNodeReplacedEvent;
OSF.DDA.Settings.prototype.saveAsync=function OSF_DDA_Settings$saveAsync(options) {
	var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, []);
	options=options || {};
	var settings=this._getSerializedSettings();
	var keys=[];
	var values=[];
	for (var key in settings) {
		keys.push(key);
		values.push(settings[key]);
	}
	var errorArgs;
	try {
		window.external.GetContext().GetSettings().Write(keys, values);
	}
	catch (ex) {
		errorArgs={};
		errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=OSF.DDA.AsyncResultEnum.ErrorCode.Failed;
		errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=ex.message;
	}
	if(callback) {
		var initArgs={};
		initArgs[OSF.DDA.AsyncResultEnum.Properties.Context]=options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext];
		initArgs[OSF.DDA.AsyncResultEnum.Properties.Value]=this;
		var asyncResult=new OSF.DDA.AsyncResult(initArgs, errorArgs);
		callback(asyncResult);
	}
};
OSF.DDA.Settings.prototype.refreshAsync=function OSF_DDA_Settings$refreshAsync(options) {
};
OSF.DDA.RichDocumentContainer=function OSF_DDA_RichDocumentContainer(officeAppContext, application, omFacade) {
	OSF.DDA.RichDocumentContainer.uber.constructor.call(this,
		officeAppContext,
		application);
	this._eventDispatch=new OSF.EventDispatch([
		Microsoft.Office.WebExtension.EventType.ActiveSelectionChanged,
		Microsoft.Office.WebExtension.EventType.DocumentOpened,
		Microsoft.Office.WebExtension.EventType.DocumentClosed
	]);
	this._omFacade=omFacade;
};
OSF.OUtil.extend(OSF.DDA.RichDocumentContainer, OSF.DDA.DocumentContainer);
OSF.DDA.RichDocumentContainer.prototype.getActiveSelectedDataAsync=function OSF_DDA_RichDocumentContainer$getActiveSelectedDataAsync(options) {
	var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, []);
	options=options || {};
	var coercionType=options[Microsoft.Office.WebExtension.OptionalParameters.CoercionType];
	var valueFormat=options[Microsoft.Office.WebExtension.OptionalParameters.ValueFormat] || Microsoft.Office.WebExtension.ValueFormat.Unformatted;
	var filter=options[Microsoft.Office.WebExtension.OptionalParameters.FilterType] || Microsoft.Office.WebExtension.FilterType.All;
	this._omFacade.getSelectedData(
		coercionType,
		valueFormat,
		filter,
		callback,
		options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
	);
};
OSF.DDA.RichDocumentContainer.prototype.setActiveSelectedDataAsync=function OSF_DDA_RichDocumentContainer$setActiveSelectedDataAsync(data, options) {
	var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [{ name: "data"}]);
	var sourceType=OSF.DDA.DataCoercion.determineCoercionType(data);
	var coercionType=options[Microsoft.Office.WebExtension.OptionalParameters.CoercionType] || sourceType;
	this._omFacade.setSelectedData(coercionType, data, callback, options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]);
};
OSF.DDA.RichDocumentContainer.prototype.addHandlerAsync=function OSF_DDA_RichDocumentContainer$addHandlerAsync(eventType, handler, options) {
	var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [
			{ name: "eventType", type: String },
			{ name: "handler", type: Function }
		]);
	if (callback==handler)
		callback=null;
	options=options || {};
	if (this._eventDispatch.getEventHandlerCount(eventType)==0) {
		this._omFacade.registerEvent("" , eventType, this._eventDispatch);
	}
	var errorArgs;
	var succeeded=this._eventDispatch.addEventHandler(eventType, handler);
	if (!succeeded) {
		errorArgs={};
		errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=OSF.DDA.AsyncResultEnum.ErrorCode.Failed;
		errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=OSF.OUtil.formatString(Strings.OfficeOM.L_EventHandlerAdditionFailed);
	}
	var asyncInitArgs={};
	asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Context]=options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext];
	asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Value]=this;
	if (callback)
		callback(new OSF.DDA.AsyncResult(asyncInitArgs, errorArgs));
};
OSF.DDA.RichDocumentContainer.prototype.removeHandlerAsync=function OSF_DDA_RichDocumentContainer$removeHandlerAsync(eventType, handler, options) {
	var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [
			{ name: "eventType", type: String },
			{ name: "handler", type: Function }
		]);
	if (callback==handler)
		callback=null;
	options=options || {};
	if (this._eventDispatch.getEventHandlerCount(eventType)==1) {
		this._omFacade.unregisterEvent("" , eventType);
	}
	var succeeded;
	if (handler) {
		succeeded=this._eventDispatch.removeEventHandler(eventType, handler);
	} else {
		this._eventDispatch.clearEventHandlers(eventType);
		succeeded=true;
	}
	var errorArgs;
	if (!succeeded) {
		errorArgs={};
		errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=OSF.DDA.AsyncResultEnum.ErrorCode.Failed;
		errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=OSF.OUtil.formatString(Strings.OfficeOM.L_EventHandlerRemovalFailed);
	}
	var asyncInitArgs={};
	asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Context]=options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext];
	asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Value]=this;
	if (callback)
		callback(new OSF.DDA.AsyncResult(asyncInitArgs, errorArgs));
};
OSF.DDA.CustomXmlParts=function OSF_DDA_CustomXmlParts(omFacade) {
	this._omFacade=omFacade;
	this._eventDispatches=[];
};
OSF.DDA.CustomXmlParts.prototype={
	addAsync: function OSF_DDA_CustomXmlParts$addAsync(xml, options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [{ name: "xml", type: String}]);
		options=options || {};
		this._omFacade.addDataPart(
			xml,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	},
	getByIdAsync: function OSF_DDA_CustomXmlParts$getByIdAsync(id, options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [{ name: "id", type: String}]);
		options=options || {};
		this._omFacade.getDataPartById(
			id,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	},
	getByNamespaceAsync: function OSF_DDA_CustomXmlParts$getByNamespaceAsync(ns, options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [{ name: "ns", type: String}]);
		options=options || {};
		this._omFacade.getDataPartsByNamespace(
			ns,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	}
};
OSF.DDA.CustomXmlPart=function OSF_DDA_CustomXmlPart(customXmlParts, id, builtIn) {
	this._customXmlParts=customXmlParts;
	Object.defineProperties(this, {
		"builtIn": {
			value: builtIn,
			writeable: false,
			configurable: false
		},
		"id": {
			value: id,
			writeable: false,
			configurable: false
		},
		"namespaceManager": {
			value: new OSF.DDA.CustomXmlPrefixMappings(customXmlParts._omFacade, id),
			writeable: false,
			configurable: false
		}
	});
};
OSF.DDA.CustomXmlPart.prototype={
	deleteAsync: function OSF_DDA_CustomXmlPart$deleteAsync(options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, []);
		options=options || {};
		this._customXmlParts._omFacade.deleteDataPart(
			this.id,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	},
	getNodesAsync: function OSF_DDA_CustomXmlPart$getNodesAsync(xPath, options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [{ name: "xPath", type: String}]);
		options=options || {};
		this._customXmlParts._omFacade.getDataPartNodes(
			this.id,
			xPath,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	},
	getXmlAsync: function OSF_DDA_CustomXmlPart$getXmlAsync(options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, []);
		options=options || {};
		this._customXmlParts._omFacade.getDataPartXml(
			this.id,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	},
	addHandlerAsync: function OSF_DDA_CustomXmlPart$addHandlerAsync(eventType, handler, options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [
			{ name: "eventType", type: String },
			{ name: "handler", type: Function }
		]);
		if (callback==handler)
			callback=null;
		options=options || {};
		if (!this._customXmlParts._eventDispatches[this.id]) {
			this._customXmlParts._eventDispatches[this.id]=new OSF.EventDispatch(OSF.DDA.CustomXmlPartEvents);
		}
		var eventDispatch=this._customXmlParts._eventDispatches[this.id];
		if (eventDispatch.getEventHandlerCount(eventType)==0) {
			this._customXmlParts._omFacade.registerEvent(this.id, eventType, eventDispatch);
		}
		var errorArgs;
		var succeeded=eventDispatch.addEventHandler(eventType, handler);
		if (!succeeded) {
			errorArgs={};
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=OSF.DDA.AsyncResultEnum.ErrorCode.Failed;
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=OSF.OUtil.formatString(Strings.OfficeOM.L_EventHandlerAdditionFailed);
		}
		var asyncInitArgs={};
		asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Context]=options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext];
		asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Value]=this;
		if (callback)
			callback(new OSF.DDA.AsyncResult(asyncInitArgs, errorArgs));
	},
	removeHandlerAsync: function OSF_DDA_CustomXmlPart$removeHandlerAsync(eventType, handler, options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [
			{ name: "eventType", type: String },
			{ name: "handler", type: Function }
		]);
		if (callback==handler)
			callback=null;
		options=options || {};
		var id=this.id;
		var succeeded=false;
		if (this._customXmlParts._eventDispatches[id]) {
			var eventDispatch=this._customXmlParts._eventDispatches[id];
			if (eventDispatch.getEventHandlerCount(eventType)==1) {
				this._customXmlParts._omFacade.unregisterEvent(id, eventType);
			}
			if (handler) {
				succeeded=eventDispatch.removeEventHandler(eventType, handler);
			} else {
				eventDispatch.clearEventHandlers(eventType);
				succeeded=true;
			}
		}
		var errorArgs;
		if (!succeeded) {
			errorArgs={};
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=OSF.DDA.AsyncResultEnum.ErrorCode.Failed;
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=OSF.OUtil.formatString(Strings.OfficeOM.L_EventHandlerRemovalFailed);
		}
		var asyncInitArgs={};
		asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Context]=options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext];
		asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Value]=this;
		if (callback)
			callback(new OSF.DDA.AsyncResult(asyncInitArgs, errorArgs));
	}
};
OSF.DDA.CustomXmlPrefixMappings=function OSF_DDA_CustomXmlPrefixMappings(omFacade, partId) {
	this._omFacade=omFacade;
	this._partId=partId;
};
OSF.DDA.CustomXmlPrefixMappings.prototype={
	addNamespaceAsync: function OSF_DDA_CustomXmlPrefixMappings$addNamespaceAsync(prefix, ns, options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [
			{ name: "prefix", type: String },
			{ name: "ns", type: String }
		]);
		options=options || {};
		this._omFacade.addDataPartNamespace(
			this._partId,
			prefix,
			ns,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	},
	getNamespaceAsync: function OSF_DDA_CustomXmlPrefixMappings$getNamespaceAsync(prefix, options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [{ name: "prefix", type: String}]);
		options=options || {};
		this._omFacade.getDataPartUriByPrefix(
			this._partId,
			prefix,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	},
	getPrefixAsync: function OSF_DDA_CustomXmlPrefixMappings$getPrefixAsync(ns, options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [{ name: "ns", type: String}]);
		options=options || {};
		this._omFacade.getDataPartPrefixByUri(
			this._partId,
			ns,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	}
};
OSF.DDA.CustomXmlNode=function OSF_DDA_CustomXmlNode(omFacade, handle, nodeType, ns, baseName) {
	this._omFacade=omFacade;
	this._handle=handle;
	Object.defineProperties(this, {
		"baseName": {
			value: baseName,
			writeable: false,
			configurable: false
		},
		"namespaceUri": {
			value: ns,
			writeable: false,
			configurable: false
		},
		"nodeType": {
			value: nodeType,
			writeable: false,
			configurable: false
		}
	});
};
OSF.DDA.CustomXmlNode.prototype={
	getNodesAsync: function OSF_DDA_CustomXmlNode$getNodesAsync(xPath, options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [{ name: "xPath", type: String}]);
		options=options || {};
		this._omFacade.getDataNodes(
			this._handle,
			xPath,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	},
	getNodeValueAsync: function OSF_DDA_CustomXmlNode$getNodeValueAsync(options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, []);
		options=options || {};
		this._omFacade.getDataNodeValue(
			this._handle,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	},
	getXmlAsync: function OSF_DDA_CustomXmlNode$getXmlAsync(options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, []);
		options=options || {};
		this._omFacade.getDataNodeXml(
			this._handle,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	},
	setNodeValueAsync: function OSF_DDA_CustomXmlNode$setNodeValueAsync(value, options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [{ name: "value", type: String}]);
		options=options || {};
		this._omFacade.setDataNodeValue(
			this._handle,
			value,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	},
	setXmlAsync: function OSF_DDA_CustomXmlNode$setXmlAsync(xml, options) {
		var callback=OSF.OUtil.checkParamsAndGetCallback(arguments, [{ name: "xml", type: String}]);
		options=options || {};
		this._omFacade.setDataNodeXml(
			this._handle,
			xml,
			callback,
			options[Microsoft.Office.WebExtension.OptionalParameters.AsyncContext]
		);
	}
};
OSF.DDA.NodeInsertedEventArgs=function OSF_DDA_NodeInsertedEventArgs(newNode, inUndoRedo) {
	Object.defineProperties(this, {
		"newNode": {
			value: newNode,
			writeable: false,
			configurable: false
		},
		"inUndoRedo": {
			value: inUndoRedo,
			writeable: false,
			configurable: false
		}
	});
};
OSF.DDA.NodeReplacedEventArgs=function OSF_DDA_NodeReplacedEventArgs(oldNode, newNode, inUndoRedo) {
	Object.defineProperties(this, {
		"oldNode": {
			value: oldNode,
			writeable: false,
			configurable: false
		},
		"newNode": {
			value: newNode,
			writeable: false,
			configurable: false
		},
		"inUndoRedo": {
			value: inUndoRedo,
			writeable: false,
			configurable: false
		}
	});
};
OSF.DDA.NodeDeletedEventArgs=function OSF_DDA_NodeDeletedEventArgs(oldNode, oldNextSibling, inUndoRedo) {
	Object.defineProperties(this, {
		"oldNode": {
			value: oldNode,
			writeable: false,
			configurable: false
		},
		"oldNextSibling": {
			value: oldNextSibling,
			writeable: false,
			configurable: false
		},
		"inUndoRedo": {
			value: inUndoRedo,
			writeable: false,
			configurable: false
		}
	});
};
OSF.OUtil.setNamespace("SafeArray", OSF.DDA);
OSF.DDA.SafeArray.Response={
	Status: 0,
	Payload: 1
};
OSF.DDA.SafeArray.StatusEnum={
	Succeeded: 0,
	Failed: 1
};
OSF.DDA.SafeArray.BindingProperties={
	Id: 0,
	Type: 1,
	SpecificData: 2,
	RowCount: 0,
	ColumnCount: 1,
	HasHeaders: 2
};
OSF.DDA.SafeArray.TableDataProperties={
	TableRows: 0,
	TableHeaders: 1
};
OSF.DDA.SafeArray.DataPartProperties={
	Id: 0,
	BuiltIn: 1
};
OSF.DDA.SafeArray.DataNodeProperties={
	Handle: 0,
	BaseName: 1,
	NamespaceUri: 2,
	NodeType: 3
};
OSF.DDA.SafeArray.DataType=[
	Microsoft.Office.WebExtension.CoercionType.Text,
	Microsoft.Office.WebExtension.CoercionType.Matrix,
	Microsoft.Office.WebExtension.CoercionType.Table
];
OSF.DDA.SafeArray.CoercionType={
	Text: 0,
	Matrix: 1,
	Table: 2,
	Html: 3,
	Ooxml: 4
};
OSF.DDA.SafeArray.ValueFormat={
	Unformatted: 0,
	Formatted: 1
};
OSF.DDA.SafeArray.FilterType={
	All: 0,
	OnlyVisible: 1
};
OSF.DDA.SafeArray.BindingType={
	Text: 0,
	Matrix: 1,
	Table: 2
};
OSF.DDA.SafeArray.EnumToArgument={};
OSF.DDA.SafeArray.ArgumentToEnum={};
(function () {
	for (var ns in Microsoft.Office.WebExtension) {
		var args=OSF.DDA.SafeArray[ns];
		if (args) {
			OSF.DDA.SafeArray.EnumToArgument[ns]={};
			OSF.DDA.SafeArray.ArgumentToEnum[ns]={};
			for (var name in args) {
				var en=Microsoft.Office.WebExtension[ns][name];
				var arg=OSF.DDA.SafeArray[ns][name];
				OSF.DDA.SafeArray.EnumToArgument[ns][en]=arg;
				OSF.DDA.SafeArray.ArgumentToEnum[ns][arg]=en;
			}
		}
	}
})();
OSF.DDA.SafeArrayFacade=function OSF_DDA_SafeArrayFacade(appOm) {
	this._appOm=appOm;
};
OSF.DDA.SafeArrayFacade.prototype={
	execute: function OSF_DDA_SafeArrayFacade$execute(dispId, executeArgs, callback, userContext, onSucceeded, onFailed) {
		var me=this;
		OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall);
		window.external.Execute(
			dispId,
			executeArgs,
			function SafeArrayFacade$OnResponse(response) {
				OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse);
				var result=response.toArray();
				var status=result[OSF.DDA.SafeArray.Response.Status];
				var payload;
				if (result.length > 2) {
					payload=[];
					for (var i=1; i < result.length; i++)
						payload[i - 1]=result[i];
				}
				else {
					payload=result[OSF.DDA.SafeArray.Response.Payload];
				}
				if (status==OSF.DDA.SafeArray.StatusEnum.Succeeded) {
					payload=onSucceeded ? onSucceeded.call(me, payload) : payload;
				} else {
					payload=onFailed ? onFailed.call(me, status, payload) : payload;
				}
				if (callback)
					callback(me.getAsyncResult(status, payload, userContext));
			}
		);
	},
	registerEvent: function OSF_DDA_SafeArrayFacade$RegisterEvent(targetId, eventType, eventDispatch, callback) {
		var me=this;
		window.external.RegisterEvent(
			OSF.DDA.EventTypeToDispId[eventType],
			targetId,
			function SafeArrayFacade$OnEvent(eventDispId, payload) {
				eventDispatch.fireEvent(me._processEventPayload(eventType, payload));
			}
		);
		if (callback) {
			callback(true);
		}
	},
	unregisterEvent: function OSF_DDA_SafeArrayFacade$UnregisterEvent(targetId, eventType, callback) {
		window.external.UnregisterEvent(OSF.DDA.EventTypeToDispId[eventType], targetId);
		if (callback) {
			callback(true);
		}
	},
	getAsyncResult: function OSF_DDA_SafeArrayFacade$getAsyncResult(status, payload, userContext) {
		var asyncInitArgs={};
		asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Context]=userContext;
		var errorArgs;
		if (status==OSF.DDA.SafeArray.StatusEnum.Succeeded ) {
			asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Value]=payload;
		} else {
			errorArgs={};
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=status;
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=payload;
		}
		return new OSF.DDA.AsyncResult(asyncInitArgs, errorArgs);
	},
	_processListPayload: function OSF_DDA_SafeArrayFacade$_processListPayload(listPayload, processForEach) {
		var ret=[];
		if (listPayload==null) {
			return ret;
		} else {
			listPayload=listPayload.toArray();
		}
		for (var item in listPayload)
			ret.push(processForEach.call(this, listPayload[item]));
		return ret;
	},
	_processEventPayload: function OSF_DDA_SafeArrayFacade$_processEventPayload(eventType, payload) {
		var args;
		switch (eventType) {
			case Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged:
				args=new OSF.DDA.DocumentSelectionChangedEventArgs(this._appOm);
				break;
			case Microsoft.Office.WebExtension.EventType.DocumentOpened:
				args=new OSF.DDA.DocumentOpenedEventArgs(this._appOm);
				break;
			case Microsoft.Office.WebExtension.EventType.DocumentClosed:
				args=new OSF.DDA.DocumentClosedEventArgs(this._appOm);
				break;
			case Microsoft.Office.WebExtension.EventType.BindingSelectionChanged:
				args=new OSF.DDA.BindingSelectionChangedEventArgs(this._processBindingPayload(payload));
				break;
			case Microsoft.Office.WebExtension.EventType.BindingDataChanged:
				args=new OSF.DDA.BindingDataChangedEventArgs(this._processBindingPayload(payload));
				break;
			case Microsoft.Office.WebExtension.EventType.NodeInserted:
				payload=payload.toArray();
				args=new OSF.DDA.NodeInsertedEventArgs(
					this._processDataNodePayload(payload[1]),
					payload[0]
				);
				break;
			case Microsoft.Office.WebExtension.EventType.NodeReplaced:
				payload=payload.toArray();
				args=new OSF.DDA.NodeReplacedEventArgs(
					this._processDataNodePayload(payload[1]),
					this._processDataNodePayload(payload[2]),
					payload[0]
				);
				break;
			case Microsoft.Office.WebExtension.EventType.NodeDeleted:
				payload=payload.toArray();
				args=new OSF.DDA.NodeReplacedEventArgs(
					this._processDataNodePayload(payload[1]),
					this._processDataNodePayload(payload[2]),
					payload[0]
				);
				break;
		}
		return args;
	},
	_processReadPayload: function OSF_DDA_SafeArrayFacade$_processReadPayload(readPayload, coercionType) {
		var ret;
		switch (coercionType) {
			case Microsoft.Office.WebExtension.CoercionType.Text:
			case Microsoft.Office.WebExtension.CoercionType.Html:
			case Microsoft.Office.WebExtension.CoercionType.Ooxml:
				ret=readPayload;
				break;
			case Microsoft.Office.WebExtension.CoercionType.Matrix:
				ret=this._2DVBArrayToJaggedArray(readPayload);
				break;
			case Microsoft.Office.WebExtension.CoercionType.Table:
				readPayload=readPayload.toArray();
				ret=new Microsoft.Office.WebExtension.TableData(
					this._2DVBArrayToJaggedArray(readPayload[OSF.DDA.SafeArray.TableDataProperties.TableRows]),
					this._2DVBArrayToJaggedArray(readPayload[OSF.DDA.SafeArray.TableDataProperties.TableHeaders])
				);
				break;
		}
		return ret;
	},
	_generateWriteData: function OSF_DDA_SafeArrayFacade$_generateWriteData(data, sourceType) {
		sourceType=sourceType || OSF.DDA.DataCoercion.determineCoercionType(data);
		var ret;
		switch (sourceType) {
			case Microsoft.Office.WebExtension.CoercionType.Table:
				ret=[];
				ret[OSF.DDA.SafeArray.TableDataProperties.TableRows]=data.rows;
				ret[OSF.DDA.SafeArray.TableDataProperties.TableHeaders]=data.headers;
				break;
			case Microsoft.Office.WebExtension.CoercionType.Text:
			case Microsoft.Office.WebExtension.CoercionType.Matrix:
			default:
				ret=data;
				break;
		}
		return ret;
	},
	_processBindingPayload: function OSF_DDA_SafeArrayFacade$_processBindingPayload(bindingPayload) {
		bindingPayload=bindingPayload.toArray();
		var id=bindingPayload[OSF.DDA.SafeArray.BindingProperties.Id];
		var specificData=bindingPayload[OSF.DDA.SafeArray.BindingProperties.SpecificData];
		if (specificData !=undefined)
			specificData=specificData.toArray();
		var binding;
		switch (OSF.DDA.SafeArray.ArgumentToEnum["BindingType"][bindingPayload[OSF.DDA.SafeArray.BindingProperties.Type]]) {
			case Microsoft.Office.WebExtension.BindingType.Text:
				binding=new OSF.DDA.TextBinding(id, this._appOm);
				break;
			case Microsoft.Office.WebExtension.BindingType.Matrix:
				binding=new OSF.DDA.MatrixBinding(
					id,
					this._appOm,
					specificData[OSF.DDA.SafeArray.BindingProperties.RowCount],
					specificData[OSF.DDA.SafeArray.BindingProperties.ColumnCount]
				);
				break;
			case Microsoft.Office.WebExtension.BindingType.Table:
				binding=new OSF.DDA.TableBinding(
					id,
					this._appOm,
					specificData[OSF.DDA.SafeArray.BindingProperties.RowCount],
					specificData[OSF.DDA.SafeArray.BindingProperties.ColumnCount],
					specificData[OSF.DDA.SafeArray.BindingProperties.HasHeaders]
				);
				break;
		}
		return binding;
	},
	_processDataPartPayload: function OSF_DDA_SafeArrayFacade$_processDataPartPayload(dataPartPayload) {
		dataPartPayload=dataPartPayload.toArray();
		return new OSF.DDA.CustomXmlPart(
			this._appOm.customXmlParts,
			dataPartPayload[OSF.DDA.SafeArray.DataPartProperties.Id],
			dataPartPayload[OSF.DDA.SafeArray.DataPartProperties.BuiltIn]
		);
	},
	_processDataNodePayload: function OSF_DDA_SafeArrayFacade$_processDataNodePayload(dataNodePayload) {
		dataNodePayload=dataNodePayload.toArray();
		return new OSF.DDA.CustomXmlNode(
			this,
			dataNodePayload[OSF.DDA.SafeArray.DataNodeProperties.Handle],
			dataNodePayload[OSF.DDA.SafeArray.DataNodeProperties.NodeType],
			dataNodePayload[OSF.DDA.SafeArray.DataNodeProperties.NamespaceUri],
			dataNodePayload[OSF.DDA.SafeArray.DataNodeProperties.BaseName]
		);
	},
	_2DVBArrayToJaggedArray: function OSF_DDA_SafeArrayFacade$_2DVBArrayToJaggedArray(vbArr) {
		var ret;
		try {
			var rows=vbArr.ubound(1);
			var cols=vbArr.ubound(2);
			vbArr=vbArr.toArray();
			if (rows==1 && cols==1) {
				ret=[vbArr];
			} else {
				ret=[];
				for (var row=0; row < rows; row++) {
					var rowArr=[];
					for (var col=0; col < cols; col++) {
						var index=row * cols+col;
						rowArr.push(vbArr[index] !=undefined ? vbArr[index] : "");
					}
					ret.push(rowArr);
				}
			}
		} catch (ex) {
		}
		return ret;
	},
	getSelectedData: function OSF_DDA_SafeArrayFacade$getSelectedData(coercionType, valueFormat, filter, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidGetSelectedDataMethod,
			[
				OSF.DDA.SafeArray.EnumToArgument["CoercionType"][coercionType],
				OSF.DDA.SafeArray.EnumToArgument["ValueFormat"][valueFormat],
				OSF.DDA.SafeArray.EnumToArgument["FilterType"][filter]
			],
			callback,
			userContext,
			function onSuccess(payload) { return this._processReadPayload(payload, coercionType); }
		);
	},
	setSelectedData: function OSF_DDA_SafeArrayFacade$setSelectedData(coercionType, data, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidSetSelectedDataMethod,
			[
				OSF.DDA.SafeArray.EnumToArgument["CoercionType"][coercionType],
				this._generateWriteData(data)
			],
			callback,
			userContext
		);
	},
	addBindingFromSelection: function OSF_DDA_SafeArrayFacade$addBindingFromSelection(bindingId, bindingType, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidAddBindingFromSelectionMethod,
			[
				bindingId,
				OSF.DDA.SafeArray.EnumToArgument["BindingType"][bindingType]
			],
			callback,
			userContext,
			function onSuccess(payload) { return this._processBindingPayload(payload); }
		);
	},
	addBindingFromPrompt: function OSF_DDA_SafeArrayFacade$addBindingFromPrompt(bindingId, bindingType, bindingPrompt, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidAddBindingFromPromptMethod,
			[
				bindingId,
				OSF.DDA.SafeArray.EnumToArgument["BindingType"][bindingType],
				bindingPrompt
			],
			callback,
			userContext,
			function onSuccess(payload) { return this._processBindingPayload(payload); }
		);
	},
	releaseBinding: function OSF_DDA_SafeArrayFacade$releaseBinding(bindingId, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidReleaseBindingMethod,
			[
				bindingId
			],
			callback,
			userContext
		);
	},
	getBinding: function OSF_DDA_SafeArrayFacade$getBinding(bindingId, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidGetBindingMethod,
			[
				bindingId
			],
			callback,
			userContext,
			function onSuccess(payload) { return this._processBindingPayload(payload); }
		);
	},
	getAllBindings: function OSF_DDA_SafeArrayFacade$getAllBindings(callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidGetAllBindingsMethod,
			null ,
			callback,
			userContext,
			function onSuccess(payload) { return this._processListPayload(payload, this._processBindingPayload); }
		);
	},
	getBindingData: function OSF_DDA_SafeArrayFacade$getBindingData(bindingId, coercionType, valueFormat, filter, subset, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidGetBindingDataMethod,
			[
				bindingId,
				OSF.DDA.SafeArray.EnumToArgument["CoercionType"][coercionType],
				OSF.DDA.SafeArray.EnumToArgument["ValueFormat"][valueFormat],
				OSF.DDA.SafeArray.EnumToArgument["FilterType"][filter],
				subset
			],
			callback,
			userContext,
			function onSuccess(payload) { return this._processReadPayload(payload, coercionType); }
		);
	},
	setBindingData: function OSF_DDA_SafeArrayFacade$setBindingData(bindingId, coercionType, data, offset, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidSetBindingDataMethod,
			[
				bindingId,
				OSF.DDA.SafeArray.EnumToArgument["CoercionType"][coercionType],
				this._generateWriteData(data),
				offset
			],
			callback,
			userContext
		);
	},
	addTableRows: function OSF_DDA_SafeArrayFacade$addTableRows(bindingId, rows, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidAddRowsMethod,
			[
				bindingId,
				rows
			],
			callback,
			userContext
		);
	},
	clearAllRows: function OSF_DDA_SafeArrayFacade$clearAllRows(bindingId, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidClearAllRowsMethod,
			[
				bindingId
			],
			callback,
			userContext
		);
	},
	addDataPart: function OSF_DDA_SafeArrayFacade$addDataPart(xml, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidAddDataPartMethod,
			[
				xml
			],
			callback,
			userContext,
			function onSuccess(payload) { return this._processDataPartPayload(payload); }
		);
	},
	getDataPartById: function OSF_DDA_SafeArrayFacade$getDataPartById(id, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidGetDataPartByIdMethod,
			[
				id
			],
			callback,
			userContext,
			function onSuccess(payload) { return this._processDataPartPayload(payload); }
		);
	},
	getDataPartsByNamespace: function OSF_DDA_SafeArrayFacade$getDataPartsByNamespace(namespaceUri, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidGetDataPartsByNamespaceMethod,
			[
				namespaceUri
			],
			callback,
			userContext,
			function onSuccess(payload) { return this._processListPayload(payload, this._processDataPartPayload); }
		);
	},
	getDataPartXml: function OSF_DDA_SafeArrayFacade$getDataPartXml(partId, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidGetDataPartXmlMethod,
			[
				partId
			],
			callback,
			userContext,
			function onSuccess(payload) {
				return this._processReadPayload(payload, Microsoft.Office.WebExtension.CoercionType.Ooxml);
			}
		);
	},
	getDataPartNodes: function OSF_DDA_SafeArrayFacade$getDataPartNodes(partId, xPath, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidGetDataPartNodesMethod,
			[
				partId,
				xPath
			],
			callback,
			userContext,
			function onSuccess(payload) { return this._processListPayload(payload, this._processDataNodePayload); }
		);
	},
	deleteDataPart: function OSF_DDA_SafeArrayFacade$deleteDataPart(partId, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidDeleteDataPartMethod,
			[
				partId
			],
			callback,
			userContext
		);
	},
	getDataNodeValue: function OSF_DDA_SafeArrayFacade$getDataNodeValue(handle, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidGetDataNodeValueMethod,
			[
				handle
			],
			callback,
			userContext,
			function onSuccess(payload) {
				return this._processReadPayload(payload, Microsoft.Office.WebExtension.CoercionType.Ooxml);
			}
		);
	},
	getDataNodeXml: function OSF_DDA_SafeArrayFacade$getDataNodeXml(handle, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidGetDataNodeXmlMethod,
			[
				handle
			],
			callback,
			userContext,
			function onSuccess(payload) {
				return this._processReadPayload(payload, Microsoft.Office.WebExtension.CoercionType.Ooxml);
			}
		);
	},
	getDataNodes: function OSF_DDA_SafeArrayFacade$getDataNodes(handle, xPath, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidGetDataNodesMethod,
			[
				handle,
				xPath
			],
			callback,
			userContext,
			function onSuccess(payload) { return this._processListPayload(payload, this._processDataNodePayload); }
		);
	},
	setDataNodeValue: function OSF_DDA_SafeArrayFacade$setDataNodeValue(handle, value, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidSetDataNodeValueMethod,
			[
				handle,
				value
			],
			callback,
			userContext
		);
	},
	setDataNodeXml: function OSF_DDA_SafeArrayFacade$setDataNodeXml(handle, xml, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidSetDataNodeXmlMethod,
			[
				handle,
				xml
			],
			callback,
			userContext
		);
	},
	addDataPartNamespace: function OSF_DDA_SafeArrayFacade$addDataPartNamespace(partId, prefix, namespaceUri, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidAddDataNamespaceMethod,
			[
				partId,
				prefix,
				namespaceUri
			],
			callback,
			userContext
		);
	},
	getDataPartUriByPrefix: function OSF_DDA_SafeArrayFacade$getDataPartUriByPrefix(partId, prefix, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidGetDataUriByPrefixMethod,
			[
				partId,
				prefix
			],
			callback,
			userContext,
			function onSuccess(payload) {
				return this._processReadPayload(payload, Microsoft.Office.WebExtension.CoercionType.Text);
			}
		);
	},
	getDataPartPrefixByUri: function OSF_DDA_SafeArrayFacade$getDataPartPrefixByUri(partId, namespaceUri, callback, userContext) {
		this.execute(
			OSF.DDA.MethodDispId.dispidGetDataPrefixByUriMethod,
			[
				partId,
				namespaceUri
			],
			callback,
			userContext,
			function onSuccess(payload) {
				return this._processReadPayload(payload, Microsoft.Office.WebExtension.CoercionType.Text);
			}
		);
	}
};
OSF.DDA.WordBindingFacade=function OSF_DDA_WordBindingFacade(document) {
	OSF.DDA.WordBindingFacade.uber.constructor.call(this, document);
};
OSF.OUtil.extend(OSF.DDA.WordBindingFacade, OSF.DDA.BindingFacade);
OSF.DDA.WordBindingFacade.prototype.addFromPromptAsync=function OSF_DDA_WordBindingFacade$addFromPromptAsync(bindingId, promptText, bindingType, callback, userContext) {
	throw OSF.OUtil.formatString(Strings.OfficeOM.L_NotImplemented, 'WordBindingFacade$addBindingFromPrompt');
};
OSF.DDA.WordDocument=function OSF_DDA_WordDocument(officeAppContext, application) {
	OSF.DDA.WordDocument.uber.constructor.call(this,
		officeAppContext,
		application,
		new OSF.DDA.SafeArrayFacade(this),
		new OSF.DDA.WordBindingFacade(this)
	);
	Object.defineProperty(this, "customXmlParts", {
		value: new OSF.DDA.CustomXmlParts(this._omFacade),
		writeable: false,
		configurable: false
	});
};
OSF.OUtil.extend(OSF.DDA.WordDocument, OSF.DDA.Document);
OSF.DDA.WordContainer=function OSF_DDA_WordContainer(officeAppContext, application) {
	OSF.DDA.WordContainer.uber.constructor.call(
		this,
		officeAppContext,
		application,
		new OSF.DDA.SafeArrayFacade(this));
};
OSF.OUtil.extend(OSF.DDA.WordContainer, OSF.DDA.RichDocumentContainer);

