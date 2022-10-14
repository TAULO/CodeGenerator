/**
 * @class
 * @description Class that manage data about one Ticket
 * @author jonathanj & nicolasl
 * @version 2.1
 * <br/>Changed for version 2.1:
 * <ul>
 * <li>Use the common way to encode/decode fields for the communication to the backend</li>
 * </ul>
 * <br/>Changed for version 2.0:
 * <ul>
 * <li>Add the coloring of solved tickets</li>
 * <li>Add the icons for new items</li>
 * <li>Allow to have items that are hyperlinks</li>
 * <li>Addition of the service area</li>
 * <li>Use a constant for empty HRW values</li>
 * </ul>
 */
var SCM_Ticket = Class.create( /** @lends SCM_Ticket.prototype */{
	/**
	 * @type JSON Object
	 * @description Representation of the main information about a ticket as a Json.
	 * @since 1.0
	 */
	_mainObject : null,

	/**
	 * @type JSON Object
	 * @description Representation of the ticket information about last documents as a Json.
	 * @since 1.0
	 */
	_lastDocsObject : null,
    
    /**
	 * @type JSON Object
	 * @description Representation of the ticket information about last action as a Json.
	 * @since 1.0
	 */
    _lastActionsObject: null,
	
    /**
	 * @type String
	 * @description Current status for the SLA.
	 * @since 1.0
	 */
    _currentSLAStatus: null,
    
	/**
	 * @param {Object} ticketObject Ticket with a Json format
	 * @description Initialize the ticket content.
	 * @since 1.0
	 */
	initialize : function() {
	    this._currentSLAStatus = null;
	},

	/**
	 * @param {JSON Object} mainObject Main information about the ticket.
	 * @description Set the main ticket informations.
	 * @since 1.0
	 * @see SCM_Ticket#_mainObject
	 */
	addMainInfo : function(mainObject) {
		this._mainObject = mainObject;
	},

	/**
	 * @param {Object} lastDocsObject Information about a ticket
	 * @description Set the ticket information about last documents.
	 * @since 1.0
	 * @see SCM_Ticket#_lastDocsObject
	 */
	addLastDocs : function(lastDocsObject) {
		this._lastDocsObject = lastDocsObject;
	},
	
	/**
	 * @param {Object} lastDocsObject Information about a tickett
	 * @description Set the ticket information about last actions.
	 * @since 1.0
	 * @see SCM_Ticket#_lastActionsObject
	 */
	addLastActions: function(lastActionsObject) {
	    this._lastActionsObject = lastActionsObject;
	},

	/**
	 * @param {String} columnId Identifier of the column to get value
	 * @param {Integer} itemNum Number of the last action or of the last document
	 * @description Method that allow to find the different ticket properties. This method could be extended
	 *              to order the different column to optimize
	 * @returns {String} The value of the field
	 * @since 1.0
	 */
	getValue : function(columnId, itemNum) {
		switch (columnId) {
		case 'STATUS':
			return this.getTagContent('Status');
		case 'ICON':
			return this._getStatusIcon();
		case 'STATUS_TXT':
			return this._getStatusText();
		case 'TICKET_ID':
			return this.getTagContent('TicketId');
	    case 'DESCR':
			return this._getDescription();
	    case 'SERV_NAME':
	        return this.getTagContent('ServiceName');
	    case 'LAST_ACTION':
	        return this._getLastAction(itemNum);
	    case 'LAST_DOC':
	        return this._getLastDoc(itemNum);
		case 'CREATE_DATE':
	    	return this._getCreationDate();
		case 'DUE_DATE':
			return this._getDueDate();
	    case 'SERV_GROUP':
	        return this.getTagContent('ServiceGroupName');    
		case 'LAST_ACT':
			return this._getLastActionDateTime();
		case 'EMPLOYEE':
			return this._getEmployeeName();
	    case 'EMPLOYEE_ID':
	        return this.getTagContent('EmployeeId');
	    case 'REQUESTOR':
	        return this._getRequestorName();
	    case 'REQUESTOR_ID':
	        return this.getTagContent('SecEmployeeId');
	    case 'COMPANY':
	        return this.getTagContent('CustomerName');
	    case 'PRIORITY':
	        return this.getTagContent('PriorityName');
	    case 'ASSIGNED_TO':
	        return this.getTagContent('CurrentAgentName');
		case 'ASSIGNED_TO_ID':
	        return this.getTagContent('CurrentAgentId');	
		case 'COMPANY_ID':
			return this.getTagContent('CompanySkillId');
		//since 2.0 Addition of the service area
		case 'SERV_AREA':
			return this.getTagContent('ServiceAreaName');
		default:
		    return this.getTagContent(columnId);
		}
	},
	
	/**
	 * @param {String} tagName Name of the tag to give
	 * @description Generic method to give a property without treatement
	 * @returns {String} The value in the given tag
	 * @since 1.0
	 */
	getTagContent: function(tagName) {
	    var tagValue = eval('this._mainObject.' + tagName);
	    if(Object.isEmpty(tagValue)) return '';
	    return tagValue;
	},

	/**
	 * @description Get the CSS class with icon for the ticket status.
	 * @returns {String} CSS class of the status icon
	 * @since 1.0
	 * <br/> Modification for version 2.0
	 * <ul>
	 * <li>Add the icons for new item icons</li>
	 * </ul>
	 * @see SCM_Ticket#statuses
	 */
	_getStatusIcon : function() {
		if(this._mainObject.Type === '0' && this._mainObject.HasBeenChanged === 'false')
		    return SCM_Ticket.statuses.get(this.getValue('STATUS')).classNameExt;
		//since 2.0 If the ticket has not been changed, the status icon is for new items
		else if(this._mainObject.Type === '0' && this._mainObject.HasBeenChanged === 'true')
			return SCM_Ticket.statuses.get(this.getValue('STATUS')).classNameExtNew;
		else if(this._mainObject.Type === '1' && this._mainObject.HasBeenChanged === 'false')
		    return SCM_Ticket.statuses.get(this.getValue('STATUS')).classNameInt;
		//since 2.0 If the ticket has not been changed, the status icon is for new items
		else if(this._mainObject.Type === '1' && this._mainObject.HasBeenChanged === 'true')
		    return SCM_Ticket.statuses.get(this.getValue('STATUS')).classNameIntNew;
	},

	/**
	 * @description Get the label for the status.
	 * @returns {String} Status text
	 * @since 1.0
	 */
	_getStatusText : function() {
		return global.getLabel('SCM_status_' + this.getValue('STATUS'));
	},

    /**
	 * @description Get the due date date of the ticket in display format.
	 * @returns {String} Ticket due date
	 * @since 1.0
	 */
	_getDueDate : function() {
	    var dueDate = this._mainObject.DueDate;
		if(Object.isEmpty(dueDate)) return '';
        else return SCM_Ticket.convertDateTime(dueDate);
	},
    
    /**
	 * @description Get the creation date of the ticket in display format.
	 * @returns {String} Ticket creation date
	 * @since 1.0
	 */
    _getCreationDate: function() {
	    var creationDate = this._mainObject.CreationDateTime;
	    if(Object.isEmpty(creationDate)) return '';
	    else return SCM_Ticket.convertDateTime(creationDate);
	},
	
	/**
	 * @description Get the last action date of the ticket in display format.
	 * @returns {String} Ticket last action date
	 * @since 1.0
	 */
	_getLastActionDateTime: function() {
		var lastActionDate = this._mainObject.LastActionDateTime;
	    if(Object.isEmpty(lastActionDate)) return '';
	    else return SCM_Ticket.convertDateTime(lastActionDate);
	},
	
	/**
	 * @description Get the ticket description.
	 * @returns {String} Description of the ticket
	 * @since 1.0
	 * <br/>Modifications for 2.1:
	 * <ul>
	 * <li>Use the standard encoding before sending to HRW</li>
	 * </ul>
	 */
	_getDescription: function() {
		//since 2.1 Use the standard encoding
	    return HrwRequest.decode(this.getTagContent('Description').stripScripts().stripTags());
	},
	
	/**
	 * @description Get the name of the tickets affected employee.
	 * @returns {String} Tickets affected employee name
	 * @since 1.0
	 */
	_getEmployeeName : function() {
	    if(!Object.isEmpty(this._mainObject.EmployeeLastName) && !Object.isEmpty(this._mainObject.EmployeeFirstName))
	        return this._mainObject.EmployeeLastName + ' ' + this._mainObject.EmployeeFirstName;
	        
	    else if(!Object.isEmpty(this._mainObject.EmployeeFirstName))
	        return this._mainObject.EmployeeFirstName;
	    
	    else if(!Object.isEmpty(this._mainObject.EmployeeLastName))
	        return this._mainObject.EmployeeLastName;
	    
	    else return '';
	},
	
	/**
	 * @description Get the name of the tickets requestor.
	 * @returns {String} Tickets requestor name
	 * @since 1.0
	 */
	_getRequestorName : function() {
	    if(!Object.isEmpty(this._mainObject.SecEmployeeLastName) && !Object.isEmpty(this._mainObject.SecEmployeeFirstName))
	        return this._mainObject.SecEmployeeLastName + ' ' + this._mainObject.SecEmployeeFirstName;
	        
	    else if(!Object.isEmpty(this._mainObject.SecEmployeeFirstName))
	        return this._mainObject.SecEmployeeFirstName;
	    
	    else if(!Object.isEmpty(this._mainObject.SecEmployeeLastName))
	        return this._mainObject.SecEmployeeLastName;
	    
	    else return '';
	},
	
	/**
	 * @description Get the last update date of the ticket.
	 * @returns {String} Last update date
	 * @since 1.0
	 */
	_getLastUpdate : function() {
		var creationDate = this._mainObject.CreationDateTime;
	    if(Object.isEmpty(creationDate)) return;
	    else return SCM_Ticket.convertDateTime(creationDate);
	},
    
    /**
     * @param {Integer} numAction Number of the action to set in the revert order (get the number total - numAction)
	 * @description Get the parameters of one of the last actions to be able to display a text.
	 * @returns {JSON Object} Parameters of the last action:
	 * <ul>
	 * 	<li><b>date</b>(<i>String</i>): Date of the action</li>
	 * 	<li><b>title</b>(<i>String</i>): Name of the last action</li>
	 * 	<li><b>icon</b>(<i>String</i>): Name of the CSS class to display the action icon</li>
	 * 	<li><b>agent</b>(<i>String</i>): Name of the agent that did the change</li>
	 * 	<li><b>descr</b>(<i>String</i>): Description of the action</li>
	 * 	<li><b>style</b>(<i></i>): CSS class to apply on the action if any</li>
	 * </ul>
	 * @since 1.0
	 * @see SCM_Ticket#actionsToDisplay
	 */
    _getLastAction: function(numAction) {
        if(Object.isEmpty(this._lastActionsObject)) return '';
		
		//Get the list of actions to display in the ticket details
        var actions = objectToArray(this._lastActionsObject.HrwTicketAction);
		actions = actions.reject(function(action) {return (Object.isEmpty(SCM_Ticket.actionsToDisplay.get(action.Type)));});
        
		var index = actions.size() - 1 - numAction;
		
		//Build the texts to display in the action description and the styles to use
		if(index >= 0) {
			return {
				date	: (Object.isString(actions[index].CompletedTime))?SCM_Ticket.convertDateTime(actions[index].CompletedTime):''	, 
				title	: global.getLabel('SCM_Action_' + actions[index].Type)													,
				icon	: SCM_Ticket.actionsToDisplay.get(actions[index].Type).iconClass										, 
				agent	: (!Object.isEmpty(actions[index].ScAgentName))?actions[index].ScAgentName:''							,
				descr	: (!Object.isEmpty(actions[index].Description))?actions[index].Description.stripScripts().stripTags():'',
				style	: SCM_Ticket.actionsToDisplay.get(actions[index].Type).textClass										};
		}

        return {date: '', title: '', icon: '', agent: '', descr: '', style: ''};
    },
    
    /**
     * @param {Integer} numDoc Number of the document to set in the revert order (get the number total - numDoc)
	 * @description Get the parameters of one of the last documents.
	 * @version 1.0
	 * @returns {JSON Object} Document paramters: 
	 * <ul>
	 * 	<li><b>id</b>(<i>String</i>): Id of the item</li>
	 * 	<li><b>name</b>(<i>String</i>): Name of the document</li>
	 * 	<li><b>iconType</b>(<i>String</i>): Name of the CSS class to display the type icon</li>
	 * 	<li><b>mimeType</b>(<i>String</i>): Mime type of the document</li>
	 * 	<li><b>extension</b>(<i>String</i>): Extension of the document</li>
	 * 	<li><b>date</b>(<i>String</i>): Date of the document add</li>
	 * 	<li><b>parent</b>(<i>String</i>): If there is a parent document, its id</li>
	 * </ul>
	 * 
	 */
    _getLastDoc: function(numDoc) {
        var doc = null;

        if(!Object.isEmpty(this._lastDocsObject)) {
            var docs    = objectToArray(this._lastDocsObject.HrwTicketItem);
            var index   = docs.size() - 1 - numDoc;
            if(index >= 0) doc = docs[index];
        }

        var extension  	= this._getLastDocExtension(doc);
        var docInfo		= this._getLastDocInfo(doc, extension);
		var docDate		= (doc === null)? '' : SCM_Ticket.convertDateTime(doc.CreationDateTime);
		var docParent	= (doc === null)? '-1' : doc.RelatedTicketItemId;

        return {
            id          : this._getLastDocId(doc)					, 
            name        : this._getLastDocName(doc)					, 
            iconType    : ((docInfo === null)?'':docInfo.iconClass)	,
			mimeType	: ((docInfo === null)?'':docInfo.mimeType)	,
            extension   : extension									,
			date		: ((docDate === null)?'':docDate)			,
			parent		: ((docParent >= 0)?docParent:'-1')
        };
    },
    
     /**
      * @param {JSON Object} doc Document informations
	  * @description Get the id of one of the last documents.
	  * @returns {String} Id of the document
	  */
    _getLastDocId: function(doc) {
        if(Object.isEmpty(doc)) return '';
        else if(Object.isEmpty(doc.Attachment.match(/[^0-9]/))) return doc.Attachment;
		else return doc.TicketItemId;
    },
    
     /**
      * @param {JSON Object} doc Document informations
	  * @description Get the name of one of the last documents.
	  * @returns {String} Name of the document
	  * @since 1.0
	  * <br/>Modification for 1.1
	  * <ul>
	  * <li>For child tickets, display the linked ticket id</li>
	  * </ul>
	  * <br/>Modification for 1.2
	  * <ul>
	  * <li>Replace the extension of emails from txt to html</li>
	  * </ul>
	  */
    _getLastDocName: function(doc) {
        if(Object.isEmpty(doc)) return '';
        else if(doc.AttachmentType === '0')
			//since 1.2 Replace the extension of emails from txt to html
			return SCM_Ticket.convertDateTime(doc.CreationDateTime) + ' - '+ global.getLabel('From') + ': ' + doc.MailFrom + '.html';
		else if(doc.AttachmentType === '9')
			return doc.Attachment;
		else
			return doc.AttachmentFilename;
    },

    /**
     * @param {JSON Object} doc Document informations
     * @param {String} extension Extension of the file
	 * @description Get the document type of one of the last documents.
	 * @returns {String} Doctype of the document
	 * @since 1.0
	 * @see SCM_Ticket#docTypes
	 */
    _getLastDocInfo: function(doc, extension) {
        var docType;
         
        //If there is no document => return nothing
        if(Object.isEmpty(doc)) return null;
        
        docType = SCM_Ticket.docTypes.get(doc.AttachmentType);
        
        //If the document type is unknow => add the default icon
        if(Object.isEmpty(docType))
            return SCM_Ticket.docTypes.get('OTHERS');
        
        if(!Object.isEmpty(docType.extensions)) {
            if(Object.isEmpty(docType.extensions.get(extension)))
                return docType.extensions.get('OTHERS');
            else 
                return docType.extensions.get(extension);
            
        } else return docType;
    },    
    
	/**
     * @param {Object} doc Document information
	 * @description Get the extension of one of the last documents.
	 * @returns {String} Document extension
	 * @since 1.0
	 * <br/>Modification for 1.1
	 * <ul>
	 * <li>If there is no document filename, return ''</li>
	 * </ul>
	 * <br/>Modification for 1.2
	  * <ul>
	  * <li>Replace the extension of emails from txt to html</li>
	  * </ul>
	 */
    _getLastDocExtension: function(doc) {
        if(Object.isEmpty(doc)) return '';
		//since 1.2 Replace the extension of emails from txt to html
        if(doc.AttachmentType === '0') return 'html';
		
		//since 1.1 If there is no filename, return empty
		if(Object.isEmpty(doc.AttachmentFilename)) return '';
		var lastPoint = doc.AttachmentFilename.lastIndexOf('.');
            
        if(lastPoint < 0) extension = '';
        else extension = doc.AttachmentFilename.substr(lastPoint + 1).toLowerCase();
        
        return extension;
    },
	
	/**
	 * @description Get if the ticket is out of SLA
	 * @returns {Integer} The SLA status can be <ul><li>0 => no alert</li><li>1 => Nearly out of SLA</li><li>2 => Out of SLA</li></ul>
	 * @since 1.0<br>
	 * Changed in version 2.0:<ul><li>Test if the ticket is marked solved</li></ul>
	 * @see SCM_Ticket#_currentSLAStatus
	 */
	getOutOfSLA : function() {
	    if(this._currentSLAStatus !== null) return this._currentSLAStatus;
	    
		if(this._mainObject.Solved == "true"){
			this._currentSLAStatus = 3;
		    return this._currentSLAStatus;
		}else{
		    var dueDate;
		    if(Object.isString(this._mainObject.DueDate)) {  
		        dueDate = sapToObject(this._mainObject.DueDate.substr(0, 10), this._mainObject.DueDate.substr(11, 8));
		        if(dueDate.isBefore()) {
		            this._currentSLAStatus = 2;
		            return this._currentSLAStatus;
		        }
		    }
		    
		    var amberDate;
		    if(Object.isString(this._mainObject.AmberDate)) {  
		        amberDate = sapToObject(this._mainObject.AmberDate.substr(0, 10), this._mainObject.AmberDate.substr(11, 8));
		        if(amberDate.isBefore()) {
		            this._currentSLAStatus = 1;
		            return this._currentSLAStatus;
		        }
		    }
		    
		    this._currentSLAStatus = 0;
		    return 0;
		}
	},
	
	/**
	 * @description Get the style associate to the current SLA status
	 * @returns {JSON Object} The parameters associated to the SLA status
	 * @since 1.0
	 * @see  SCM_Ticket#SLAStatuses
	 */
	getOutOfSLAStyle: function() {	        
	    return SCM_Ticket.SLAStatuses.get(this.getOutOfSLA());
	}
});
/**
 * @class
 * @description Ticket that are more convenient in {@link scm_MyCurrentTicket}
 * @augments SCM_Ticket
 * @author jonathanj & nicolasl
 * @version 1.0
 */
var SCM_Ticket_MyCurrent = Class.create(SCM_Ticket, /** @lends SCM_Ticket_MyCurrent.prototype */{
    /**
	 * @param {String} columnId Identifier of the column to get value
	 * @param {Integer} itemNum Number of the last action or of the last document
	 * @description Limit the number of possible values to those for MyCurrentTicket.
	 *              TICKET_ID has the last position because it is rarely called in this application.
	 *              If there is a call for a non foreseen column, the parent method is called
	 * @returns {String} The ticket parameter value
	 * @since 1.0
	 * @see SCM_Ticket#getValue
	 */
	getValue : function($super, columnId, itemNum) {
		switch (columnId) {
	    case 'SERV_NAME':
	        return this.getTagContent('ServiceName'); 
		case 'EMPLOYEE':
			return this._getEmployeeName();
	    case 'EMPLOYEE_ID':
	        return this.getTagContent('EmployeeId');
	    case 'REQUESTOR':
	        return this._getRequestorName();
	    case 'REQUESTOR_ID':
	        return this.getTagContent('SecEmployeeId');
	    case 'TICKET_ID':
			return this.getTagContent('TicketId');
		default:
		    return $super(columnId, itemNum);
		}
	}
});
/**
 * @class
 * @description Tickets that are more convenient for the display of documents
 * @author jonathanj & nicolasl
 * @version 1.1
 * <br/>Changes for version 1.1:
 * <ul>
 * <li>If the document is not a file, there is no document type</li>
 * </ul>
 * @augments SCM_Ticket
 */
 var SCM_Ticket_docDisplayer = Class.create(SCM_Ticket, /** @lends SCM_Ticket_docDisplayer.prototype */{
 	
	/**
	 * @type String
	 * Id of the ticket
	 * @since 1.0
	 */
    ticketId: null,
	
	/**
	 * @type JSON Object
	 * @description Ticket information about last action.
	 * @since 1.0
	 */
	_documentTypes: null,
	
	/**
	 * @type String
	 * @description Id of the company of the ticket
	 * @since 1.0
	 */
	companyId: null,
	
	/**
	 * @type String
	 * @description Id of the service of the ticket
	 * @since 1.0
	 */
	serviceId: null,
	
	/**
	 * @type Boolean
	 * @description Are there document types defined for the service?
	 * @since 1.0
	 */
	hasDocTypes: null,
	
	/**
	 * @param {String} columnId Identifier of the column to get value
	 * @param {Integer} itemNum Number of the last action or of the last document
	 * @description Limit the number of possible values to those for MyCurrentTicket.
	 *              TICKET_ID has the last position because it is rarely called in this application.
	 *              If there is a call for a non foreseen column, the parent method is called
	 * @returns {String} The ticket parameter value
	 * @since 1.0
	 * @see SCM_Ticket#getValue
	 */
	getValue : function($super, columnId, itemNum) {
		if (columnId === 'LAST_DOC')
			return this._getLastDoc(itemNum);
		else if(columnId === 'TICKET_ID')
			return this.ticketId;
	    else
		    return $super(columnId, itemNum);
	},
	
	/**
	 * @param {JSON Object} documentTypesObject List of the possible document types
	 * @description Set the ticket information about the existant document types.
	 * @since 1.0
	 * @see SCM_Ticket#hasDocTypes
	 * @see SCM_Ticket#_documentTypes
	 */
	addDocumentTypes: function(documentTypesObject) {
		this._documentTypes = $H();
		if(documentTypesObject && documentTypesObject.EWS.HrwResponse.HrwResult.ArrayOfKeyValue && documentTypesObject.EWS.HrwResponse.HrwResult.ArrayOfKeyValue.KeyValue) {
			objectToArray(documentTypesObject.EWS.HrwResponse.HrwResult.ArrayOfKeyValue.KeyValue).each(function(docType) {
				this._documentTypes.set(docType.Key, docType.Value);
			}.bind(this));
		}
		
		if (this._documentTypes.size() === 0) {
			this._documentTypes.set('-1', '');
			this.hasDocTypes = false;
		} else
			this.hasDocTypes = true;
	},
	
	/**
	 * @description Remove the list of document types.
	 * @since 1.0
	 * @see SCM_Ticket#_documentTypes
	 */
	removeDocumentTypes: function() {
	    this._documentTypes =  null;
	},
	
	/**
	 * @description Check if the list of document types is already loaded.
	 * @returns {Boolean} Document types are loaded
	 * @since 1.0
	 */
	documentsTypesLoaded: function() {
		return (this.companyId !== null && this.serviceId !== null && this._documentTypes !== null);
	},
	
	/**
	 * @description Check if there are document types defined for this company and this service.
	 * @returns {Boolean} There are no document type defined
	 * @since 1.0
	 */
	noDocumentTypes: function() {
	    if(this.hasDocTypes === true) return false;
		var noDocTypes 	= true;
	    var docs    	= objectToArray(this._lastDocsObject.HrwTicketItem);
        docs.each(function (doc){
            if(new Number(doc.DocumentType) >= 0) noDocTypes = false;
        }.bind(this));
		return noDocTypes;
	},
	
	/**
	 * @param {Boolean} withDef Check to make sure there is a default value in the coming list
	 * @description Get the list of documents type with the format as for autocomplete fields.
	 * @returns {Array} List of document types with name and id.
	 * @since 1.0
	 */
	getDocumentsTypes: function(withDef) {
		var docTypes = $A();
		if(!this.documentsTypesLoaded()) return null;
		if(withDef !== true) withDef = false;
		
		this._documentTypes.each(function(docType, index) {
			if(withDef && index === 0)
				docTypes.push({
					data	: docType.key, 
					text	: docType.value,
					def		: 'X'
				});
			else
				docTypes.push({
					data	: docType.key, 
					text	: docType.value
				});
		}.bind(this));
		
		return docTypes;
	},
	
    /**
     * @param {Integer} numDoc Number of the document to set in the revert order (get the number total - numDoc)
	 * @description Get the parameters of one of the last documents with the doctype name and the doctype id.
	 * @returns {JSON Object} Document paramters
	 * @version 1.0
	 * @see SCM_Ticket#_getLastDoc
	 */
    _getLastDoc: function(numDoc) {
        var doc = null;
		
        if(!Object.isEmpty(this._lastDocsObject)) {
            var docs    = objectToArray(this._lastDocsObject.HrwTicketItem);
            var index   = docs.size() - 1 - numDoc;
            if(index >= 0) doc = docs[index];
        }

        var extension  	= this._getLastDocExtension(doc);
        var docInfo		= this._getLastDocInfo(doc, extension);
		var docDate		= (doc === null)? '' : SCM_Ticket.convertDateTime(doc.CreationDateTime);
		var docParent	= (doc === null)? '-1' : doc.RelatedTicketItemId;
		//since 2.0 Use a constant for the absence of value
		var docTypeId	= (doc === null || doc.DocumentType === HrwEngine.NO_VALUE)? '-1' : doc.DocumentType;

        return {
            id          : this._getLastDocId(doc)					, 
            name        : this._getLastDocName(doc)					, 
            iconType    : ((docInfo === null)?'':docInfo.iconClass)	,
			mimeType	: ((docInfo === null)?'':docInfo.mimeType)	,
            extension   : extension									,
			date		: ((docDate === null)?'':docDate)			,
			parent		: ((docParent >= 0)?docParent:'-1')			,
			docTypeId	: docTypeId									,
			//since 1.1 Add the "doc" in the parameters
			docType		: this._getLastDocDocType(docTypeId, doc)
        };
    },
	
	/**
     * @param {String} docTypeId Id of the document type
     * @param {JSON Object} doc (since 1.1) Document informations
	 * @description Get the name of the document type that match the given id.<br/>
	 * @returns {String} Name of the doc type
	 * @since 1.0
	 * <br/>Modification for 1.2
	 * <ul>
	 * <li>For email documents, there is a doctype</li>
	 * </ul>
	 * <br/>Modification for 1.1
	 * <ul>
	 * <li>For non file documents, there is no doctype</li>
	 * </ul>
	 */
	_getLastDocDocType: function(docTypeId, doc) {
		//since 1.1 If the document is not a file, there is no document type
		//since 1.2 If the document is an email, it also need a document type
		if(doc === null || (doc.AttachmentType != '1' && doc.AttachmentType != '0')) return '';
		
		var docType = this._documentTypes.get(docTypeId);
		
		if(Object.isUndefined(docType)) return global.getLabel('BadDocType');
		else return docType;
	}
});
/**
 * @type Hash
 * @description List of the columns names and class names.
 * @since 1.0
 * <br/>Modifications for 2.0:
 * <ul>
 * <li>Addition of the icons for new items</li>
 * </ul>
 */
SCM_Ticket.statuses = $H( {
	'0'  : {
		id				: 'Closed'       							, 
		classNameExt	: 'SCM_DotBrownIcon SCM_DotIconsSize'		, 
		classNameInt	: 'SCM_DotBrownTicon SCM_DotIconsSize' 		, 
		classNameExtNew	: 'SCM_DotBrownNicon SCM_DotIconsSize' 		,
		classNameIntNew	: 'SCM_DotBrownNTicon SCM_DotIconsSize'		},
	'1'  : {
		id				: 'Open'         							, 
		classNameExt	: 'SCM_DotIconsSize'						, 
		classNameInt	: 'SCM_DotIconsSize' 						,	 
		classNameExtNew	: 'SCM_DotIconsSize' 						,
		classNameIntNew	: 'SCM_DotIconsSize'						},
	'2'  : {
		id				: 'Proc'         							, 
		classNameExt	: 'SCM_DotOrangeIcon SCM_DotIconsSize'		, 
		classNameInt	: 'SCM_DotOrangeTicon SCM_DotIconsSize' 	,	 
		classNameExtNew	: 'SCM_DotOrangeNicon SCM_DotIconsSize' 	,
		classNameIntNew	: 'SCM_DotOrangeNTicon SCM_DotIconsSize'	},
	'3'  : {
		id				: 'Sched'        							, 
		classNameExt	: 'SCM_DotBlueIcon SCM_DotIconsSize'		, 
		classNameInt	: 'SCM_DotBlueTicon SCM_DotIconsSize' 		,	 
		classNameExtNew	: 'SCM_DotBlueNicon SCM_DotIconsSize' 		,
		classNameIntNew	: 'SCM_DotBlueNTicon SCM_DotIconsSize'		},
	'4'  : {
		id				: 'Wait'         							, 
		classNameExt	: 'SCM_DotGreenIcon SCM_DotIconsSize'		, 
		classNameInt	: 'SCM_DotGreenTicon SCM_DotIconsSize' 		,	 
		classNameExtNew	: 'SCM_DotGreenNicon SCM_DotIconsSize' 		,
		classNameIntNew	: 'SCM_DotGreenNTicon SCM_DotIconsSize'		},
	'5'  : {
		id				: 'Unknown'									, 
		classNameExt	: 'SCM_DotIconsSize'						, 
		classNameInt	: 'SCM_DotIconsSize' 						,	 
		classNameExtNew	: 'SCM_DotIconsSize' 						,
		classNameIntNew	: 'SCM_DotIconsSize'						},
	'6'  : {
		id				: 'Pend'         							, 
		classNameExt	: 'SCM_DotMauveIcon SCM_DotIconsSize'		, 
		classNameInt	: 'SCM_DotMauveTicon SCM_DotIconsSize' 		,	 
		classNameExtNew	: 'SCM_DotMauveNicon SCM_DotIconsSize' 		,
		classNameIntNew	: 'SCM_DotMauveNTicon SCM_DotIconsSize'		},
	'7'  : {
		id				: 'Ext'          							, 
		classNameExt	: 'SCM_DotGrayIcon SCM_DotIconsSize'		, 
		classNameInt	: 'SCM_DotGrayTicon SCM_DotIconsSize' 		,	 
		classNameExtNew	: 'SCM_DotGrayNicon SCM_DotIconsSize' 		,
		classNameIntNew	: 'SCM_DotGrayNTicon SCM_DotIconsSize'		},
	'8'  : {
		id				: 'PendSched'    							, 
		classNameExt	: 'SCM_DotMauveBlueIcon SCM_DotIconsSize'	, 
		classNameInt	: 'SCM_DotMauveBlueTicon SCM_DotIconsSize' 	,	 
		classNameExtNew	: 'SCM_DotMauveBlueNicon SCM_DotIconsSize' 	,
		classNameIntNew	: 'SCM_DotMauveBlueNTicon SCM_DotIconsSize'	},
	'9'  : {
		id				: 'ProcOth'     						 	, 
		classNameExt	: 'SCM_DotRedIcon SCM_DotIconsSize'      	, 
		classNameInt	: 'SCM_DotRedTicon SCM_DotIconsSize' 		,	 
		classNameExtNew	: 'SCM_DotRedNicon SCM_DotIconsSize' 		,
		classNameIntNew	: 'SCM_DotRedNTicon SCM_DotIconsSize'		},
	'10' : {
		id				: 'PendNotAssign'							, 
		classNameExt	: 'SCM_DotMauveBlackIcon SCM_DotIconsSize'	, 
		classNameInt	: 'SCM_DotMauveBlackTicon SCM_DotIconsSize' ,	 
		classNameExtNew	: 'SCM_DotMauveBlackNicon SCM_DotIconsSize' ,
		classNameIntNew	: 'SCM_DotMauveBlackNTicon SCM_DotIconsSize'},
	'11' : {
		id				: 'NotAssign'    							, 
		classNameExt	: 'SCM_DotBlackIcon SCM_DotIconsSize'		, 
		classNameInt	: 'SCM_DotBlackTicon SCM_DotIconsSize' 		,	 
		classNameExtNew	: 'SCM_DotBlackNicon SCM_DotIconsSize' 		,
		classNameIntNew	: 'SCM_DotBlackNTicon SCM_DotIconsSize'		}
});
/**
 * @type Hash
 * @description Name of the documents types with there icons.
 * @since 1.0
 * <br/>Modification for 1.2
 * <ul>
 * <li>Set the mime-type of emails to text/html</li>
 * </ul>
 */
SCM_Ticket.docTypes = $H({
	//since 1.2 Change the mime type of emails from text/plain -> text/html
    '0'     : {label: 'Email'           , iconClass: 'SCM_ItemMail SCM_itemSize'	, mimeType: 'text/html' },
    '1'     : {label: 'File'            , extensions: $H({
        'mdb'   : {label: 'Access'      , iconClass: 'SCM_ItemAccess SCM_itemSize'    , mimeType: 'application/ms-access'				},
        'mdbx'  : {label: 'Access'      , iconClass: 'SCM_ItemAccess SCM_itemSize'    , mimeType: 'application/vnd.ms-access'			},
        'doc'   : {label: 'Word'        , iconClass: 'SCM_ItemWord SCM_itemSize'      , mimeType: 'application/msword'					},
        'docx'  : {label: 'Word'        , iconClass: 'SCM_ItemWord SCM_itemSize'      , mimeType: 'application/vnd.ms-word.document.12'	},
        'ppt'   : {label: 'PowerPoint'  , iconClass: 'SCM_ItemPowerPoint SCM_itemSize', mimeType: 'application/ms-powerpoint'			},
        'pptx'  : {label: 'PowerPoint'  , iconClass: 'SCM_ItemPowerPoint SCM_itemSize', mimeType: 'application/vnd.ms-powerpoint'		},   
        'xls'   : {label: 'Excel'       , iconClass: 'SCM_ItemExcel SCM_itemSize'     , mimeType: 'application/ms-excel'				},
        'xlsx'  : {label: 'Excel'       , iconClass: 'SCM_ItemExcel SCM_itemSize'     , mimeType: 'application/vnd.ms-excel'			},
        'html'  : {label: 'HTML'        , iconClass: 'SCM_ItemHTML SCM_itemSize'      , mimeType: 'text/html'							},
        'htm'   : {label: 'HTML'        , iconClass: 'SCM_ItemHTML SCM_itemSize'      , mimeType: 'text/html'							},
        'txt'   : {label: 'Text'        , iconClass: 'SCM_ItemText SCM_itemSize'      , mimeType: 'text/plain'							},
        'pdf'   : {label: 'PDF'         , iconClass: 'SCM_ItemPDF SCM_itemSize'       , mimeType: 'application/pdf'						},
        'bmp'   : {label: 'Picture'     , iconClass: 'SCM_ItemImage SCM_itemSize'     , mimeType: 'image/x-ms-bmp'						},
		'png'	: {label: 'Picture'		, iconClass: 'SCM_ItemImage SCM_itemSize'	  , mimeType: 'image/png'							},	
        'jpg'   : {label: 'Picture'     , iconClass: 'SCM_ItemImage SCM_itemSize'     , mimeType: 'image/jpeg'							},
        'gif'   : {label: 'Picture'     , iconClass: 'SCM_ItemImage SCM_itemSize'     , mimeType: 'image/gif'							},
        'OTHERS': {label: 'File'        , iconClass: 'SCM_ItemBinary SCM_itemSize'    , mimeType: 'binary/octet-stream'					}})},
    '2'     : {label: 'Note'            , iconClass: 'SCM_ItemNote SCM_itemSize'	, mimeType: ''     },
    '4'     : {label: 'SAP Shortcut'    , iconClass: 'SCM_ItemSap SCM_itemSize'     , mimeType: ''     },
    '5'     : {label: 'Executable'      , iconClass: 'SCM_itemSize'                 , mimeType: ''     },
	//since 2.0 Indicate that the mime-type for HTTP links is hyperlink
    '6'     : {label: 'hyperlink'       , iconClass: 'SCM_ItemHTML SCM_itemSize'    , mimeType: 'hyperlink'},
    '7'     : {label: 'hyperlinkSIR'    , iconClass: 'SCM_ItemHTML SCM_itemSize'    , mimeType: ''     },
    '8'     : {label: 'Parent Ticket'   , iconClass: 'SCM_TicketItem SCM_itemSize'  , mimeType: ''     },
    '9'     : {label: 'Child Ticket'    , iconClass: 'SCM_TicketItem SCM_itemSize'  , mimeType: ''     },
    '10'    : {label: 'Shortcut'        , extensions: $H({
        'mdb'   : {label: 'Access'      , iconClass: 'SCM_ItemAccess SCM_itemSize'    , mimeType: 'application/ms-access'				},
        'mdbx'  : {label: 'Access'      , iconClass: 'SCM_ItemAccess SCM_itemSize'    , mimeType: 'application/vnd.ms-access'			},
        'doc'   : {label: 'Word'        , iconClass: 'SCM_ItemWord SCM_itemSize'      , mimeType: 'application/msword'					},
        'docx'  : {label: 'Word'        , iconClass: 'SCM_ItemWord SCM_itemSize'      , mimeType: 'application/vnd.ms-word.document.12'	},
        'ppt'   : {label: 'PowerPoint'  , iconClass: 'SCM_ItemPowerPoint SCM_itemSize', mimeType: 'application/ms-powerpoint'			},
        'pptx'  : {label: 'PowerPoint'  , iconClass: 'SCM_ItemPowerPoint SCM_itemSize', mimeType: 'application/vnd.ms-powerpoint'		},   
        'xls'   : {label: 'Excel'       , iconClass: 'SCM_ItemExcel SCM_itemSize'     , mimeType: 'application/ms-excel'				},
        'xlsx'  : {label: 'Excel'       , iconClass: 'SCM_ItemExcel SCM_itemSize'     , mimeType: 'application/vnd.ms-excel'			},
        'html'  : {label: 'HTML'        , iconClass: 'SCM_ItemHTML SCM_itemSize'      , mimeType: 'text/html'							},
        'htm'   : {label: 'HTML'        , iconClass: 'SCM_ItemHTML SCM_itemSize'      , mimeType: 'text/html'							},
        'txt'   : {label: 'Text'        , iconClass: 'SCM_ItemText SCM_itemSize'      , mimeType: 'text/plain'							},
        'pdf'   : {label: 'PDF'         , iconClass: 'SCM_ItemPDF SCM_itemSize'       , mimeType: 'application/pdf'						},
        'bmp'   : {label: 'Picture'     , iconClass: 'SCM_ItemImage SCM_itemSize'     , mimeType: 'image/x-ms-bmp'						},
		'png'	: {label: 'Picture'		, iconClass: 'SCM_ItemImage SCM_itemSize'	  , mimeType: 'image/png'							},	
        'jpg'   : {label: 'Picture'     , iconClass: 'SCM_ItemImage SCM_itemSize'     , mimeType: 'image/jpeg'							},
        'gif'   : {label: 'Picture'     , iconClass: 'SCM_ItemImage SCM_itemSize'     , mimeType: 'image/gif'							},
        'OTHERS': {label: 'File'        , iconClass: 'SCM_ItemBinary SCM_itemSize'    , mimeType: 'binary/octet-stream'					}})},
    'OTHERS': {label: 'Unknow'          , iconClass: 'SCM_ItemBinary SCM_itemSize'  , mimeType: ''     }
});
/**
 * @type Hash
 * @description Name of the SLA statuses with there styles.
 * @since 1.0<br>
 * Changed in version 2.0:<ul><li>Add of an entry for solved tickets</li></ul>
 */	
SCM_Ticket.SLAStatuses = $H({
    0: {label: 'In time'       , classStyle: ''                            },
    1: {label: 'Near due date' , classStyle: 'SCM_PoolTable_SLAAmberAlert' },
    2: {label: 'After due date', classStyle: 'SCM_PoolTable_OutOfSLA'      },
	3: {label: 'Solved'		   , classStyle: 'SCM_PoolTable_Solved'		   }
});
/**
 * @type Hash
 * @description List of the actions that could be displayed by action type.
 * @since 1.0
 */
SCM_Ticket.actionsToDisplay = $H({
	'0'	: {iconClass: 'SCM_ActionsIconSize SCM_ActionServicesIcon', textClass: '' },		//Create ticket
	'1'	: {iconClass: 'SCM_ActionsIconSize'	, textClass: ''},								//Closed Ticket
	'4'	: {iconClass: 'SCM_ActionNewUserIcon SCM_ActionsIconSize', textClass: ''},			//Assign Ticket
	'9'	: {iconClass: 'SCM_ActionNewItemIcon SCM_ActionsIconSize', textClass: ''},			//Add attachement
	'10': {iconClass: 'SCM_ActionNewItemIcon SCM_ActionsIconSize', textClass: ''},			//Add Mail
	'12': {iconClass: 'SCM_ActionsIconSize'	, textClass: ''},								//Custom Action
	'22': {iconClass: 'SCM_ActionsIconSize SCM_ActionServicesIcon', textClass: ''},			//ReOpen Ticket
	'38': {iconClass: 'SCM_ActionsIconSize'	, textClass: 'SCM_PoolTable_OutOfSLA'		},	//Due date elapsed
	'39': {iconClass: 'SCM_ActionsIconSize'	, textClass: 'SCM_PoolTable_SLAAmberAlert'	}	//AmberDate elapsed
});
/**
 * @param {String} poolType Indicate which type of ticket to create
 * @description Static method that create a ticket of the fine type.
 * @returns {SCM_Ticket} The ticket instance
 * @since 1.0
 */
SCM_Ticket.factory = function(poolType) {
	switch (poolType) {
	case 'MyPool'           :
	case 'GeneralPool'      :
	case 'TeamPool'         :
	case 'OPMPool'          :
	case 'MyActivity'       :
	case 'EmpHistory'       :
	case 'SearchTicket'		:
	    return new SCM_Ticket();
	case 'MyCurrentTicket'  :
	    return new SCM_Ticket_MyCurrent();
	case 'DisplayDocs'		:
		return new SCM_Ticket_docDisplayer();
	}
};

/**
 * Method that convert the date in a HRW format to a JS Date.
 * @param {String} dateTime Date time with the HRW format
 * @returns {Date} The corresponding date object.
 * @since 1.0
 */
SCM_Ticket.convertDateTimeToObjects = function(dateTime) {
	if(!Object.isString(dateTime)) return null;
	return sapToObject(dateTime.substr(0, 10), dateTime.substr(11, 8));
};

/**
 * Method that convert the date in a HRW format to a display format.
 * @param {String} dateTime Date time with the HRW format
 * @returns {String} The corresponding date to display.
 * @since 1.0
 */
SCM_Ticket.convertDateTime = function(dateTime) {
    //Date and time in GMT
    if(!Object.isString(dateTime)) return null;
    var date = SCM_Ticket.convertDateTimeToObjects(dateTime);
    return objectToDisplay(date) + ' ' + objectToDisplayTime(date);
};

/**
 * Get the parameters of a file from its name.
 * @param {String} filename Name of the file
 * @returns {JSON Object} Determine, the extension, the icon for the type, the label for the type and the mimetype of the file.
 * @since 1.0
 */
SCM_Ticket.getFilenameParams = function(filename) {
	var extension 	= '';
	var type;
    var lastPoint 	= filename.lastIndexOf('.');
    var filesData	= SCM_Ticket.docTypes.get('1');  
	      
    if(lastPoint >= 0)  extension = filename.substr(lastPoint + 1).toLowerCase();
	
	type = filesData.extensions.get(extension);
	if(Object.isEmpty(type)) type = filesData.extensions.get('OTHERS');

	return {
		extension	: extension		,
		docIcon		: type.iconClass,
		docLabel	: type.label	,
		mimeType	: type.mimeType
	};
};