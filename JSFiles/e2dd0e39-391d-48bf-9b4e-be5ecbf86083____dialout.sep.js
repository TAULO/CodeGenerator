var lWSC = null;
var dialNumber ='';
var UniqueID ='';
var transferTo = '';
var dialPlan= '';
initConnectServer();
$(document).ready(function () 
{

if (window.rebootaddon =="1")
{
TINY.box.show({html:'Please ask to Administarter to restart SugarCRM Asterisk Add-on..<br>',animate:true,width:400,height:70,close:false,mask:false,boxid:'success',autohide:12,top:200,left:750})


}

	
    //.asterisk_phoneNumber is the deprecated v1.x class
$('.panelContainer [type="phone"],.inlineEdit[type="phone"],inlineEdit phone,.phone,#phone_work,#phone_other,#phone_office,#phone_mobile,.asterisk_phoneNumber,#phone_mobile_span,#list_subpanel_phone_phones_contacts td[scope="row"]:first-child').each(function()
	{
        var phoneNr = $(this).text();
        phoneNr = $.trim(phoneNr); // IE needs trim on separate line.

        // Regex searches the inner html to see if a child element has phone class,
        // this prevents a given number having more then one click to dial icon.
        // ? after the " is required for IE compatibility.  IE strips the " around the class names apparently.
        // The /EDV.show_edit/ regex allows it to work with Letrium's Edit Detail View module.
        if (phoneNr.length > 1 && ( !/(class="?phone"?|id="?#phone|class="?asterisk_placeCall"?)/.test($(this).html()) || /EDV.show_edit/.test($(this).html()) )) 
        {
            var contactId = $('input[name="record"]', document.forms['DetailView']).attr('value');
            if (!contactId) 
            {
                contactId = $('input[name="mass[]"]', $(this).parents('tr:first')).attr('value');
            }
		tellJarToDoSomething(window.no_Of_users);
            if (window.PhoneExtension) 
            {
                $(this).append('<img title="Click To Call from extension is: ' + window.PhoneExtension + '" src="custom/modules/Asterisk/include/images/call.png" class= "activeCall" record="' + contactId + '" value="anrufen" style="cursor: pointer;"></div>');
                
                //$(this).append('&nbsp;&nbsp;<img title="Click To Call from extension is: ' + window.PhoneExtension + '" src="custom/modules/TECHEXTENSION/include/images/click-to-dial-calling.gif" class="asterisk_placeCall" value="anrufen" style="cursor: pointer;"/>&nbsp;');
                //$(this).append('<div title="Extension Configured for Click To Dial is: ' + window.PhoneExtension + '" class="asterisk_placeCall activeCall" record="' + contactId + '" value="anrufen"></div>');
            }
            else {
                $(this).append('&nbsp;&nbsp;<img title="No extension configured!  Go to user preferences to set your extension" src="custom/modules/Asterisk/include/images/icon-phone.png" class="asterisk_placeCall" value="anrufen" style="cursor: pointer;"/>&nbsp;');
                //alert('Please Register your Extension First on Asterisk/Asterisk IP :'+window.AsteriskIP);
                //RegisterExtension(window.AsteriskIP);
                var a = $("<a>").attr("href", "index.php?module=Users&action=EditView&record=1");
				$(this).wrap(a);
            }


$(this).click(function () 
{

	var record = $(this).attr('record');
	//change to spinner
	$("img").find("[record='" + record + "']").removeClass('activeCall').addClass('dialedCall');

	var call = null;
	phoneNr = phoneNr.replace(/[^a-zA-Z0-9]/g,'');
	DialNumber(phoneNr);
});

            
        }

        function getModule(){
            if(window.module_sugar_grp1 == undefined){
                return getUrlParam('module');
            }else{
                return window.module_sugar_grp1;
            }
        }

        //internal function to assist in getting sugarcrm url parameters
        function getUrlParam(name) {

            var decodedUri = decodeURIComponent(window.location.href);
            var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(decodedUri);
            if (!results) {
                return null;
            } else {
                return results[1];
            }
        }
    });
	
	// for home dashlet
	
	  $('#dashletPanel .oddListRowS1 td[scope="row"]').each(function()
	 {
        var phoneNr = $(this).text();
        phoneNr = $.trim(phoneNr); // IE needs trim on separate line.

		phoneNr   = phoneNr.replace(/[^a-zA-Z0-9]/g,'');
       

        // Regex searches the inner html to see if a child element has phone class,
        // this prevents a given number having more then one click to dial icon.
        // ? after the " is required for IE compatibility.  IE strips the " around the class names apparently.
        // The /EDV.show_edit/ regex allows it to work with Letrium's Edit Detail View module.
        if (phoneNr.length > 1 && (phoneNr.match(/^\d+$/) && parseInt(phoneNr) > 0) &&( !/(class="?phone"?|id="?#phone|class="?asterisk_placeCall"?)/.test($(this).html()) || /EDV.show_edit/.test($(this).html()) )) 
        {
            var contactId = $('input[name="record"]', document.forms['DetailView']).attr('value');
            if (!contactId) 
            {
                contactId = $('input[name="mass[]"]', $(this).parents('tr:first')).attr('value');
            }
		
            if (window.PhoneExtension) 
            {
                $(this).append('<img title="Click To Call from extension is: ' + window.PhoneExtension + '" src="custom/modules/Asterisk/include/images/call.png" class= "activeCall" record="' + contactId + '" value="anrufen" style="cursor: pointer;"></div>');
                
                //$(this).append('&nbsp;&nbsp;<img title="Click To Call from extension is: ' + window.PhoneExtension + '" src="custom/modules/TECHEXTENSION/include/images/click-to-dial-calling.gif" class="asterisk_placeCall" value="anrufen" style="cursor: pointer;"/>&nbsp;');
                //$(this).append('<div title="Extension Configured for Click To Dial is: ' + window.PhoneExtension + '" class="asterisk_placeCall activeCall" record="' + contactId + '" value="anrufen"></div>');
            }
            else {
                $(this).append('&nbsp;&nbsp;<img title="No extension configured!  Go to user preferences to set your extension" src="custom/modules/Asterisk/include/images/icon-phone.png" class="asterisk_placeCall" value="anrufen" style="cursor: pointer;"/>&nbsp;');
                //alert('Please Register your Extension First on Asterisk/Asterisk IP :'+window.AsteriskIP);
                //RegisterExtension(window.AsteriskIP);
                var a = $("<a>").attr("href", "index.php?module=Users&action=EditView&record=1");
				$(this).wrap(a);
            }


$(this).click(function () 
{

	var record = $(this).attr('record');
	//change to spinner
	$("img").find("[record='" + record + "']").removeClass('activeCall').addClass('dialedCall');

	var call = null;
	phoneNr   = phoneNr.replace(/[^a-zA-Z0-9]/g,'');
	DialNumber(phoneNr);
});

            
        }

        function getModule(){
            if(window.module_sugar_grp1 == undefined){
                return getUrlParam('module');
            }else{
                return window.module_sugar_grp1;
            }
        }

        //internal function to assist in getting sugarcrm url parameters
        function getUrlParam(name) {

            var decodedUri = decodeURIComponent(window.location.href);
            var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(decodedUri);
            if (!results) {
                return null;
            } else {
                return results[1];
            }
        }
    });
	
	
});
//~ function RegisterExtension(AsteriskIP)
//~ {
	//~ alert('Please Register Your Extension on Asterisk/Asterisk IP : '+AsteriskIP);
//~ }




function tellJarToDoSomething(no)
{
setTimeout(function(){
    console.log("THIS IS");

	
	var lMessageToken =
	{
	ns: lWSC.NS,
	type: "techinfo",
	user:no,
	extension:window.PhoneExtension,
	ip:window.AsteriskIP
	};
					
	var lCallbacks = 
	{
	OnFailure: function( aToken )
	{
		alert("fail");
	}
	};
	var lRes=lWSC.sendToken( lMessageToken, lCallbacks );
console.log(lRes);
}, 2000);
}




var _enabled=true;


var INVALID_NODES = ['SCRIPT', 'STYLE', 'INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'A', 'CODE'];



/** add listener for DOM changes, to parse the new nodes for phone numbers **/
/** document.addEventListener('DOMSubtreeModified', handleDomChange, true); **/

/** stupid WebKit won't trigger DOMNodeInserted on innerHTML with plain text and no HTML tags **/
document.addEventListener('DOMCharacterDataModified', handleDomChange, true);
document.addEventListener('DOMNodeInserted'         , handleDomChange, true);

/** prevent it from going into an infinite loop **/
var parsing = false;

    
parseDOM(document.body);

function handleDomChange(e) {
  var ext_enabled = _enabled;
  if (ext_enabled) {
    if (parsing) {
      return;
    }

    var newNodeClass = e.srcElement.className;
    if ( newNodeClass != undefined ) {
      if (/techextension\-message\-box/.test(newNodeClass) || newNodeClass == 'techextension-click-to-call-icon') {
        return;
      }
    }

    var targetNode = (e.relatedNode) ? e.relatedNode : e.target;
    parsing = true;
    setTimeout(function() {
      parseDOM(targetNode);
      parsing = false;
    }, 10);
  }
}




/** Parse DOM and convert phone numbers to click-to-call links **/
function parseDOM (node) {
  var nodeName = node && node.nodeName && node.nodeName.toUpperCase() || '';
  var childNodesLength = node && node.childNodes.length || 0;

  if ($.inArray(nodeName, INVALID_NODES) > -1 || $(node).hasClass('techextension-message-box')) {
    return 0;
  }

  for (var n = 0; n < childNodesLength; n++) {
    var found = parseDOM(node.childNodes[n]);
    if (found > 0) {
      parseDOM(node);
      return 0;
    }
  }

  if (nodeName === 'IFRAME') {
    var doc;
    try {
      doc = node.contentDocument;
    } catch (e) {
      
    }
    if (doc) {
      parseDOM(doc.body);
    }
  }

  if (node.nodeType == Node.TEXT_NODE) {
    return parsePhoneNumbers(node);
  } else {
    addEvents(node);
  }
  return 0;
}

/** Replace phone numbers **/
function parsePhoneNumbers (node) {
  var isStringNumber = false;

  /** SIP address **/
  var sipAddressNumber = /sip:[a-zA-Z0-9_.\-]+@[a-zA-Z0-9_.\-]+\.[a-z]{1,4}/;

  /** Eliminate the obvious cases **/
  if (!node || node.nodeValue.length < 10 ||
      node.nodeValue.search(/\d/) == -1 &&
      node.nodeValue.match(sipAddressNumber) == null) {
        return 0;
  }

  var phoneNumber                          = /((((\+|(00))[1-9]\d{0,3}[\s\-.]?)?\d{2,4}[\s\/\-.]?)|21)\d{5,9}/;
  /** Modified phoneNumberNorthAmerica reg expression to allow for no spaces phone num support (i.e. 17328829922) **/
  //var phoneNumberNorthAmerica              = /\+?(1[\s-.])?((\(\d{3}\))|(\d{3}))[\s.\-]\d{3}[\s.\-]\d{4}/;
  var phoneNumberNorthAmerica              = /\+?(1[\s-.]?)?((\(\d{3}\))|(\d{3}))[\s.\-]?\d{3}[\s.\-]?\d{4}/;

  /** Phone number with an extension **/
  var phoneNumberNorthAmericaWithExtension = /\+?(1[\s-.])?((\(\d{3}\))|(\d{3}))[\s.\-]\d{3}[\s.\-]\d{4}\s{1,5}(ext|x|ex)\s{0,3}.{0,3}\d{2,5}/;
  var phoneNumberExtension                 = /(ext|x|ex)\s{0,3}.{0,3}\d{2,5}/g;
  var phoneNumberDelimiter                 = /[\s.,;:|]/;
  var text                                 = node.nodeValue;
  var offset                               = 0;
  var number                               = "";

  /** Extension **/
  var extension                            = null;
  var found                                = false;
  var foundNorthAmerica                    = false;

  /** Find the first phone number in the text node **/
  while (!found) {
    var result = text.match(phoneNumberNorthAmerica);

    /** Handling extension **/
    var resultWithExtension = text.match(phoneNumberNorthAmericaWithExtension);
    if (resultWithExtension) {
      extension  = text.match(phoneNumberExtension);
      extension  = extension[0];
    }

    if (result == null) {
      result = text.match(sipAddressNumber);
      if (result != null) {
        isStringNumber = true;
      }
    }

    if (result) {
      foundNorthAmerica = true;
    }
    else {
      foundNorthAmerica = false;
    }

    if (!result) {
      return 0;
    }
    number = result[0];
    if (!isStringNumber) {
      var pos = result.index;
      offset += pos;

      /** Make sure we have a reasonable delimiters around our matching number **/
      if (pos && !text.substr(pos - 1, 1).match(phoneNumberDelimiter)
          || pos + number.length < text.length
          && !text.substr(pos + number.length, 1).match(phoneNumberDelimiter)) {

        offset += number.length;
        text = text.substr(pos + number.length);
        continue;
      }
    } else{
      var pos = result.index;
      offset += pos;
    }
    /** looks like we found a phone number **/
    found = true;
  }

  var spanNode;
  /** handle string address **/
  if (isStringNumber) {
    var stringNumber = number.replace(/sip:/,'');
    spanNode     = $('<a  title="Click-to-Call '             + stringNumber +
      '" class="techextension-click-to-call"></a>')[0];
  } else {
    /** wrap the phone number in a span tag **/


    var spanNode = $('<a  title="Click-to-Call ' + number +
      '" class="techextension-click-to-call"></a>')[0];
  }

  var range   = node.ownerDocument.createRange();

  range.setStart(node, offset);
  range.setEnd  (node, offset + number.length);

  var docfrag = range.extractContents();
  var before  = range.startContainer.splitText(range.startOffset);
  var parent  = before.parentNode;

  spanNode.appendChild(docfrag);

  parent.insertBefore(spanNode, before);

  return 1;
}



function addEvents(node) {
  $('.techextension-click-to-call', node).unbind().bind({
    click : function(e){
     
      e.preventDefault();
      callNumber (this.innerHTML);
      if (e.stopPropagation) e.stopPropagation();
    },
    mouseover : function() {
      var offset, top, left;
      var $this = $(this);
      offset    = $this.offset();
      top       = offset.top-10;
      top       = (top > 0) ? top : 0;
      left      = offset.left - 30;
      left      = (left > 0) ? left : 0;

      var icon  = $('<div class="techextension-click-to-call-icon"></div>');
      iconFile  = 'custom/modules/Asterisk/include/images/icon-phone.png';
      icon.css  ({ 'background-image' : 'url(' + iconFile + ')',
        'top' : top + 'px', 'left' : left + 'px'}).appendTo('body').fadeIn(200);
      $this.data('icon', icon);
    },
    mouseout  : function() {
      var $this  = $(this);
      $this.data('icon').fadeOut(200, function() {
        $(this).remove();
      });
    }
  });
}

/** Call the given number **/
function callNumber(phone_no) {
  
  //chrome.storage.local.set({'PhoneNumber': phone_no});
  //alert(phone_no);
   phone_no=phone_no.replace(/[^0-9]/g,'');
   DialNumber(phone_no)
  
}



function DialNumber(callto)
{
	if(window.DialoutPrefix =='' || !window.DialoutPrefix)
	{
		window.DialoutPrefix=null;
		//window.DialPlan='default';
	}
	if(window.DialPlan =='' || !window.DialPlan)
	{
		//window.DialPlan='SIP/';
		window.DialPlan='from-internal';
	}
	window.dialNumber = callto;
//console.log(lWSC);

var lMessageToken = 
{
	ns: lWSC.NS,
	type: "call",
	cphonenumber:callto, 
	CustomContext:window.DialPlan,
	CustomChannel:window.DialoutPrefix,
	extension:window.PhoneExtension,
	ip:window.AsteriskIP
};
					
var lCallbacks = 
{
OnFailure: function( aToken )
{
	alert("fail");
}};

	
	var lRes=lWSC.sendToken( lMessageToken, lCallbacks );
	console.log(lRes.code);
	if(lRes.code=='-1')
	{
		alert('Request cannot sent to Asterisk to make call');
	}
	
}

function HangUpCall(UniqueID)
{
	window.UniqueID = UniqueID;
			//console.log(lWSC);
			var lMessageToken =
			{
					ns: lWSC.NS,
					type: "HangUp",
					UniqueID:UniqueID, 
					extension:window.PhoneExtension,
					ip:window.AsteriskIP
			};
					
			var lCallbacks = 
			{
					OnFailure: function( aToken )
					{
								alert("fail");
					}
			};

			var lRes=lWSC.sendToken( lMessageToken, lCallbacks );

}

function TransferCall(UniqueID,transferTo,dialPlan)
{
	
	if(dialPlan =='' || !dialPlan)
	{
		//window.DialPlan='SIP/';
		CustomContext='default';
	}
	window.transferto= transferTo;
	window.dialplan= dialPlan;
	window.UniqueID= UniqueID;
			//console.log(lWSC);
			var lMessageToken =
			{
					ns: lWSC.NS,
					type: "TransferCall",
					UniqueID:UniqueID, 
					TransferTo:transferTo, 
					extension:window.PhoneExtension,
					ip:window.AsteriskIP,
					CustomContext:dialPlan,
					transfer : "null",
					identifier : "identifier"
			};
					
			var lCallbacks = 
			{
					OnFailure: function( aToken )
					{
								alert("fail");
					}
			};

			var lRes=lWSC.sendToken( lMessageToken, lCallbacks );
//console.log(lRes);
}

 function initConnectServer()
{

	if (jws.browserSupportsWebSockets())
	{
		lWSC = new jws.jWebSocketJSONClient(
				{
				});
	}
	ConnectServer();
}

function ConnectServer()
{
	var hangupId='';
	var lURL = jws.getDefaultServerURL();
	var lRes = lWSC.logon(lURL,window.PhoneExtension, window.PhoneExtension,
			{
				OnOpen: function(aEvent)
				{
				},
				OnGoodBye: function(aEvent)
				{
				},
				OnMessage: function(aToken, aEvent)
				{
					
					if(aEvent.action != undefined)
					{
						//console.log(aEvent.action);
						//console.log(aEvent);
						if(aEvent.action=="DialEvent")
						{ 
							var phoneNumber = aEvent.PhoneNumber;
							var extension = aEvent.Extension;
							
							
							var phoneLength = phoneNumber.length;
							var extensionLength = extension.length;
							console.log("index.php?entryPoint=getCallStatus&AsteriskCallID="+aEvent.uniqueid+"&PhoneNumber="+aEvent.PhoneNumber+"&CurrentRequest="+aEvent.action+"&Direction="+aEvent.Direction);
							
							
							TECHEXTENSION.checkForNewStates(aEvent.uniqueid,aEvent.PhoneNumber,aEvent.action,aEvent.Direction,aEvent.Extension,null);
						
						}
						if(aEvent.action=="CONNECTED")
						{ 
							//console.log("index.php?entryPoint=getCallStatus&AsteriskCallID="+aEvent.uniqueid+"&PhoneNumber="+aEvent.PhoneNumber+"&CurrentRequest="+aEvent.action+"&Direction="+aEvent.Direction);
							var phoneNumber = aEvent.PhoneNumber;
							var extension = aEvent.Extension;


							var phoneLength = phoneNumber.length;
							var extensionLength = extension.length;
							//console.log("index.php?entryPoint=getCallStatus&AsteriskCallID="+aEvent.uniqueid+"&PhoneNumber="+aEvent.PhoneNumber+"&CurrentRequest="+aEvent.action+"&Direction="+aEvent.Direction);
							if(phoneLength<5 && extensionLength<5 )
							{
															if(!hangupId)
								{
								TECHEXTENSION.checkForNewStates(aEvent.uniqueid,aEvent.PhoneNumber,aEvent.action,aEvent.Direction,aEvent.Extension,null);
								}

							}
							else
							{
								if(!hangupId)
								{
								TECHEXTENSION.checkForNewStates(aEvent.uniqueid,aEvent.PhoneNumber,aEvent.action,aEvent.Direction,aEvent.Extension,null);
								}
							}
						}
						if(aEvent.action=="HANGUP")
						{
							//console.log('In Hangup');
							hangupId = hangupId;
							var phoneNumber = aEvent.PhoneNumber;
							var extension = aEvent.Extension;
							
							
							var phoneLength = phoneNumber.length;
							var extensionLength = extension.length;
							
							if(phoneLength<5 && extensionLength<5 )
							{
															TECHEXTENSION.checkForNewStates(aEvent.UniqueId,aEvent.PhoneNumber,aEvent.action,aEvent.Direction,aEvent.Extension,aEvent.Duration);
							
							}
							else
							{
								TECHEXTENSION.checkForNewStates(aEvent.UniqueId,aEvent.PhoneNumber,aEvent.action,aEvent.Direction,aEvent.Extension,aEvent.Duration);
							}
						}
						
						
								
						if(aEvent.action=="UnregisterExtension")
						{ 
							console.log("Unregister");
							
TINY.box.show({html:'Your Extension ( '+aEvent.Extension+' ) is Not registered at Asterisk IP<br>( '+aEvent.AsteriskIP+' ) ! Please Register your Extension in SoftPhone<br><br>NOTE : After Registration of Your Extension Please Refresh this Page  ',animate:true,width:500,height:100,close:false,mask:false,boxid:'success',autohide:12,top:200,left:750})
							//alert('Please Register Your Extension ( '+aEvent.Extension+' ) on Asterisk IP :'+aEvent.AsteriskIP);
							
							//TECHEXTENSION.checkForNewStates(null,null,aEvent.action,aEvent.AsteriskIP,aEvent.Extension,null);
						}




						if(aEvent.action=="maxUsers")
						{ 
							console.log("MaxUser");
							TINY.box.show({html:'You have Reached Maximum Users Limit '+aEvent.User+',You need to buy More User Lisence<br><br>NOTE : Please Contact Us at support@techextension.com  ',animate:true,width:500,height:100,close:false,mask:false,boxid:'success',autohide:12,top:200,left:750})

						}









						
					}
				},
				OnClose: function(aEvent)
				{
					//alert('Closed');
				}
			});

}
