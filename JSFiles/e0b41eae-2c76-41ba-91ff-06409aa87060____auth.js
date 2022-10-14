var mailboxSettingsAvailable = true;
var userPropertyExtensionsAvailable = true;
var userPropertyExtensionId = "frm-hdr-user-properties";
var userPropertyExtensionExists = false;
var languagePropertyExtensionExists = false;
var timeZonePropertyExtensionExists = false;
var themePropertyExtensionExists = false;
var languagePropertyExtension;
var timeZonePropertyExtension;
var themePropertyExtension;
var ADAL = null; 
var storageObj = null;
// we do try/catch here because Edge can't access the storage when used locally
try { 
   storageObj = isIEBrowser() ? localStorage : sessionStorage;
} catch (e) {
}
var adalErrorReported = false;

const ADAL_RECURSION_COUNT = 'adal_recursion_count';
const ADAL_EXPIRATION_FOR_RECURSION = 'adal_expiration_for_recursion';
const ADAL_LAST_INIT = 'adal_last_init';

// output ADAL logs to the console
Logging = {
   level: 3,
   log: function (message) {
      console.log(message);
   }
};

var currentUser = {
    name: "",
    uid: "",
    member: false,
    personal: false
};

function _getJWTInfo() {
    var IDToken = {
        "header" : null,
        "payload" : null,
        "signature" : null
    };
    if (ADAL!=null) {
        try {
            var encodedIdToken = ADAL._getItem(ADAL.CONSTANTS.STORAGE.IDTOKEN);
            var decodedToken = ADAL._decodeJwt(encodedIdToken);
            if (decodedToken) {
                try {
                    var base64DecodedHeader = ADAL._base64DecodeStringUrlSafe(decodedToken.header);
                    if (base64DecodedHeader) {
                        IDToken.header=JSON.parse(base64DecodedHeader);
                    }
                } catch (e) {
                    console.log("The id_token's header could not be decoded",e);
                }
                try {
                    var base64DecodedJWSPayload = ADAL._base64DecodeStringUrlSafe(decodedToken.JWSPayload);
                    if (base64DecodedJWSPayload) {
                        IDToken.payload=JSON.parse(base64DecodedJWSPayload);
                    }
                } catch (e) {
                    console.log("The id_token's payload could not be decoded",e);
                }
                IDToken.signature = decodedToken.JWSSig;
            }
        } catch (err) {
            console.log("The id_token could not be decoded",err);
        }
    }
    return IDToken;
}


function parseJwt (token) {
   var base64Url = token.split('.')[1];
   var base64 = base64Url.replace('-', '+').replace('_', '/');
   return JSON.parse(atob(base64));
}

function isADALCallback() {
   var hash = getHash(window.location.hash);
   var parameters = deserializeHash(hash);
   return (
      parameters.hasOwnProperty('error_description') ||
      parameters.hasOwnProperty('access_token') ||
      parameters.hasOwnProperty('id_token')
   );   
}

function deserializeHash(query) {
   var match,
      pl = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=([^&]*)/g,
      decode = function (s) {
          return decodeURIComponent(s.replace(pl, ' '));
      },
      obj = {};
   match = search.exec(query);
   while (match) {
      obj[decode(match[1])] = decode(match[2]);
      match = search.exec(query);
   }

   return obj;   
}

function getHash(hash) {
   if (hash.indexOf('#/') > -1) {
      hash = hash.substring(hash.indexOf('#/') + 2);
   } else if (hash.indexOf('#') > -1) {
      hash = hash.substring(1);
   }

   return hash;
}
   
function isIEBrowser() {
    var mybrowser = window.navigator.userAgent;
    if (mybrowser.indexOf('MSIE')>0 || mybrowser.indexOf('Trident/')>0){
        return true;
    }
                
    return false;
}

function isIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {   
        console.log('error while checking iframe...');
            return true;
    }
}   

function parse_query_string(query) {
    return parse_string(query,"&");
} 

function parse_string(str,del) {
    var vars = str.split(del);
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        
        // If first entry with this name
        var pn = decodeURIComponent(pair[0]);
        var pv = decodeURIComponent(pair[1]);
        if (typeof query_string[pn] === "undefined") {
            query_string[pn] = pv;
            
            // If second entry with this name
        } else if (typeof query_string[pn] === "string") {
            var arr = [query_string[pn], pv];
            query_string[pn] = arr;
            // If third or later entry with this name
        } else {
            query_string[pn].push(pv);
        }
    }
    
    return query_string;
}

function readRecursionInfo(resource,errcode) {
   // read the recursion count for given resource and error code
   var r_cnt = storageObj.getItem(ADAL_RECURSION_COUNT+resource+errcode);
   if (r_cnt) {
      r_cnt = parseInt(r_cnt);
      if (r_cnt>0) {
         try {
            // in the case recursion count is >0, determine if the recursion "blocking" is expired or not - if expired, reset recursion info
            var exp = parseInt(storageObj.getItem(ADAL_EXPIRATION_FOR_RECURSION+resource+errcode));
            var li = parseInt(storageObj.getItem(ADAL_LAST_INIT));
            var ct = new Date().getTime();
            console.log('Recursion info for resource='+resource+', errcode='+errcode+': recursion count='+r_cnt+', recursion block expires='+exp+', ADAL last inited='+li+', current time='+ct);
            if (ct>exp && ct>li+60000) {
               r_cnt=0;
               console.log('ADAL recursion blocking expired for resource='+resource+', errcode='+errcode);
               resetRecursionInfo(resource,errcode);
            } else {
               console.log('ADAL recursion will be blocked for resource='+resource+', errcode='+errcode);
            }
         } catch (e) {}
      }
   } else {
      r_cnt = 0;
   }
   return r_cnt;
}

function writeADALInitTime() {
   var ait = new Date().getTime();
   console.log('Writting adal init time to '+ait);
   storageObj.setItem(ADAL_LAST_INIT,ait);
}

function writeRecursionInfo(resource,errcode,aelc) {   
   var exp_time = new Date().getTime()+60000;
   console.log('Writting adal error recursion info for resource='+resource+', errcode='+errcode+', value='+aelc+', exp='+exp_time);
   storageObj.setItem(ADAL_RECURSION_COUNT+resource+errcode,aelc);
   storageObj.setItem(ADAL_EXPIRATION_FOR_RECURSION+resource+errcode,exp_time);
}

function resetRecursionInfo(resource,errcode) {
   console.log('Reseting adal error recursion info for resource='+resource+', errcode='+errcode);
   storageObj.setItem(ADAL_RECURSION_COUNT+resource+errcode,0);
   storageObj.setItem(ADAL_EXPIRATION_FOR_RECURSION+resource+errcode,0);
}

function getFunctionName(funct) {
   if (isIEBrowser()) {
      var ret = funct.toString();
      ret = ret.substr('function '.length);
      ret = ret.substr(0, ret.indexOf('('));
      return ret;
   } else {
      return funct.name;
   }
}

/**
 * Performs a generic API call on ADAL
 * @param {string} resource Resource identifier of the API. For example it is "https://graph.microsoft.com" for Microsoft Graph API
 * @param {string} url URL of the API
 * @param {string} method HTTP request method. If an empty string is passed GET is used
 * @param {object} payload JSON object which is passed to the API function in payload
 * @param {function} onsuccesscallback Success callback function which receives a response payload as a parameter
 * @param {function} onfailurecallback Optional failure callback
 */
function performApiFunctionCall(resource, url, method, payload, onsuccesscallback, onfailurecallback) {
    executeAjaxRequestWithAdalLogic(resource, callApiFunction, url, payload, {"method": method ? method : "GET"}, onsuccesscallback, onfailurecallback, onfailurecallback);
}

function callApiFunction(token, url, payload, conf, onsuccesscallback, onfailurecallback) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": conf.method,        
        "headers": {
            "Authorization": "Bearer " + token
        }
    };
    
    if (payload) {
        settings.data = JSON.stringify(payload);
    }
    
    $.ajax(settings).done(function (data,textStatus,request) {
        console.log('callApiFunction successfully executed');
        if (data) {
            onsuccesscallback(data);
        } else if (onfailurecallback) {
            onfailurecallback();
        }
        
        console.log('Data successfully retrieved! payload: ' + (data!=null ? JSON.stringify(data) : null));
    }).fail(function (err, textStatus, errorThrown) {
        console.log('callApiFunction failed');
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
        if (onfailurecallback) {
            onfailurecallback();
        }
    });
}

/**
 * Queries for mailbox settings (language and time zone)
 * @param {string} url Microsoft API function URL for getting user mailbox settings.
 *        If we use Microsoft Graph API Beta it is https://graph.microsoft.com/beta/me/mailboxSettings
 * @param {function} onsuccesscallback called when language and time zone settings has been successfully
 *        retreived passing language and time zone aliases as arguments
 * @param {function} onfailurecallback optional callback called when we recieve an error from Microsoft
 *        API function or get no data
 */
function getmailboxsettingsdata(url, onsuccesscallback, onfailurecallback) {
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com", getdatanoadalmailboxsettings, url, {}, {}, onsuccesscallback, onfailurecallback, onfailurecallback);
}

function getdatanoadalmailboxsettings(token, url, data, conf, onsuccesscallback, onfailurecallback) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": "GET",        
        "headers": {
            "Authorization": "Bearer " + token
        }
    };
    
    $.ajax(settings).done(function (data,textStatus,request) {
        console.log('getmailboxsettingsdata call successfully executed');
        if (data) {
            onsuccesscallback((data["language"] ? data["language"]["locale"] : null), data["timeZone"]);
        } else if (onfailurecallback) {
            onfailurecallback();
        }
        
        console.log('Data successfully retrieved! payload: ' + (data!=null ? JSON.stringify(data) : null));
    }).fail(function (err, textStatus, errorThrown) {
        mailboxSettingsAvailable = false;
        console.log('getmailboxsettingsdata call failed');
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
        if (onfailurecallback) {
            onfailurecallback();
        }
    });
}

/**
 * Queries Microsoft Graph API for supported time zones in the user mailbox
 * @param {function} onsuccesscallback called when supported time zones has been successfully
 *        retreived passing supported time zones as arguments
 * @param {function} onfailurecallback optional callback called when we recieve an error from Microsoft
 *        Graph API function or get no data
 */
function getSupportedTimeZones(onsuccesscallback, onfailurecallback) {
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com", getDataOnAdalSupportedTimeZones, 'https://graph.microsoft.com/beta/me/outlook/supportedTimeZones', {}, {}, onsuccesscallback, onfailurecallback, onfailurecallback);
}

function getDataOnAdalSupportedTimeZones(token, url, payload, conf, onsuccesscallback, onfailurecallback) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": "GET",        
        "headers": {
            "Authorization": "Bearer " + token
        }
    };
    
    $.ajax(settings).done(function (data, textStatus, request) {
        console.log('getSupportedTimeZones call successfully executed');
        if (data && data["value"]) {
            onsuccesscallback(data["value"]);
            console.log('Supported time zones successfully retrieved! payload: ' + (data!=null ? JSON.stringify(data) : null));
        } else {
            console.log("Invalid response format!");
            if (onfailurecallback) {
                onfailurecallback();
            }
        }
    }).fail(function (err, textStatus, errorThrown) {
        mailboxSettingsAvailable = false;
        console.log('getSupportedTimeZones call failed');
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
        if (onfailurecallback) {
            onfailurecallback();
        }
    });
}

function patchmailboxsettingsdata(url, payload) {
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com",patchdatanoadal,url,payload);
}

function patchdatanoadal(token, url, payload) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": "PATCH",        
        "headers": {
            "Authorization": "Bearer " + token
        },
        "data": JSON.stringify(payload),
        "contentType": "application/json"
    };
    
    $.ajax(settings).done(function (data,textStatus,request) {
        if (payload.language) {
            TogFormViewer.setProperty("storedUserLanguage", payload.language);
        }
        
        if (payload.timeZone) {
            TogFormViewer.setProperty("storedUserTimeZone", payload.timeZone);
        }
        
        console.log('patchmailboxsettingsdata call successfully executed');
        console.log('Data successfully updated! DATA='+(data!=null ? JSON.stringify(data) : null));
    }).fail(function (err, textStatus, errorThrown) {
        if (payload.language) {
            TogFormViewer.setProperty("storedUserLanguage", "");
        }
        
        if (payload.timeZone) {
            TogFormViewer.setProperty("storedUserTimeZone", "");
        }
        
        console.log('patchmailboxsettingsdata call failed');
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
    });
}

function getuserphotometadata() {
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com",getdatanoadalphotometadata,"https://graph.microsoft.com/beta/me/photo");
}

function getdatanoadalphotometadata(token,url) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": "GET",        
        "headers": {
            "Authorization": "Bearer " + token
        }
    };
    
    $.ajax(settings).done(function (data,textStatus,request) {
        console.log('getuserphotometadata call successfully executed');
        
        if (data && data["width"] && data["width"] > 1) {
            getuserphoto();
        } else {
            console.log("User hasn't set his photo.");
        }
        
        console.log('Data successfully retrieved! payload: ' + (data!=null ? JSON.stringify(data) : null));
    }).fail(function (err, textStatus, errorThrown) {
        console.log('getuserphotometadata call failed');
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
    });
}

function getuserphoto() {
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com",getdatanoadalphoto,"https://graph.microsoft.com/beta/me/photo/$value");
}

function getdatanoadalphoto(token,url) {
    var request = new XMLHttpRequest;
    request.open("GET", url);
    request.setRequestHeader("Authorization", "Bearer " + token);
    request.responseType = "blob";
    request.onload = function () {
        if (request.readyState === 4 && request.status === 200) {
            console.log('getuserphoto call successfully executed');
            
            var reader = new FileReader();
            reader.onload = function () {
                $('.userphoto').attr('src', reader.result).show();
            }
            
            reader.readAsDataURL(request.response);
        } else {
            console.log('getdatanoadalphoto call failed');
            console.log("AJAX REQUEST FAILED:"+request.statusText);
        }
    };
    request.send(null);
}

function getUserThumbnailPhoto() {
    executeAjaxRequestWithAdalLogic("https://graph.windows.net",getdatanoadalphoto,"https://graph.windows.net/me/thumbnailPhoto?api-version=1.6");
}

function getdatanoadalthumbnailphoto(token, url) {
    var request = new XMLHttpRequest;
    request.open("GET", url);
    request.setRequestHeader("Authorization", "Bearer " + token);
    request.responseType = "blob";
    request.onload = function () {
        if (request.readyState === 4 && request.status === 200) {
            console.log('getUserThumbnailPhoto call successfully executed');
            
            var reader = new FileReader();
            reader.onload = function () {
                $('.userphoto').attr('src', reader.result).show();
            }
            
            reader.readAsDataURL(request.response);
        } else {
            console.log('getdatanoadalthumbnailphoto call failed');
            console.log("AJAX REQUEST FAILED:"+request.statusText);
        }
    };
    request.send(null);
}

/**
 * Creates a new user property extension on AAD and stores user's language and time zone there
 * @param {string} language Alias of user's language. It should be null if the language shouldn't be stored.
 * @param {string} timeZone Alias of ser's time zone. It should be null if the time zone shouldn't be stored.
 */
function createLanguageTimeZonePropertyExtension(language, timeZone) {
    if (language !== null && timeZone !== null) {
        var payload = {
            "@odata.type": "microsoft.graph.openTypeExtension",
            "extensionName": userPropertyExtensionId,
            "language": language,
            "timeZone": timeZone
        };
    } else if (language !== null) {
        var payload = {
            "@odata.type": "microsoft.graph.openTypeExtension",
            "extensionName": userPropertyExtensionId,
            "language": language
        };
    } else if (timeZone !== null) {
        var payload = {
            "@odata.type": "microsoft.graph.openTypeExtension",
            "extensionName": userPropertyExtensionId,
            "timeZone": timeZone
        };
    } else {
        console.log("createLanguageTimeZonePropertyExtension failed because both language and timeZone are null");
        
        return;
    }
    
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com", postuserpropertyextensiononadal, "https://graph.microsoft.com/beta/me/extensions", payload);
}

function createThemePropertyExtension(theme) {
    var payload = {
        "@odata.type": "microsoft.graph.openTypeExtension",
        "extensionName": userPropertyExtensionId,
        "theme": theme
    };
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com", postuserpropertyextensiononadal, "https://graph.microsoft.com/beta/me/extensions", payload);
}

function postuserpropertyextensiononadal(token, url, payload) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": "POST",        
        "headers": {
            "Authorization": "Bearer " + token
        },
        "data": JSON.stringify(payload),
        "contentType": "application/json"
    };
    
    $.ajax(settings).done(function (data,textStatus,request) {
        userPropertyExtensionExists = true;
        if (payload.theme) {
            TogFormViewer.setProperty("storedUserTheme", payload.theme);
        }
        
        if (payload.language) {
            TogFormViewer.setProperty("storedUserLanguage", payload.language);
        }
        
        if (payload.timeZone) {
            TogFormViewer.setProperty("storedUserTimeZone", payload.timeZone);
        }
        
        console.log('postuserpropertyextensiononadal call successfully executed');
        console.log('Data successfully updated! DATA='+(data!=null ? JSON.stringify(data) : null));
    }).fail(function (err, textStatus, errorThrown) {
        userPropertyExtensionsAvailable = false;
        console.log('postuserpropertyextensiononadal call failed');
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
    });
}

/**
 * Send feedback content to specific url.
 * @param {string} url is link where Feedback content should be sent.
 * @param {object} payload is Feedback content that should be sent to url parameter. 
 */
function sendfeedback(url, payload) {
    executeAjaxRequestWithAdalLogic(ADAL.config.clientId, postfeedbackformadal, url, payload);
}

/**
 * Post Feedback content with security token to specific url.
 * @param {string} token is a Security token that should prevent interception by an unintended party. 
 * @param {string} url is link where Feedback content should be sent.
 * @param {object} payload is Feedback content that should be sent to url parameter.
 */
function postfeedbackformadal(token, url, payload) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": "POST",        
        "headers": {
            "Authorization": "Bearer " + token
        },
        "data": JSON.stringify(payload),
        "contentType": "application/json"
    };
    
    $.ajax(settings).done(function (data,textStatus,request) {
        console.log('Feedback successfully submitted');
    }).fail(function (err, textStatus, errorThrown) {
        console.log('postfeedbackformadal failed');
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
    });  
}

function getUserPropertyExtensions(fetchLTZ, onsuccesscallback, onfailurecallback) {
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com", getdatanoadaluserpropertyextensions, "https://graph.microsoft.com/beta/me/?$select=id,displayName&$expand=extensions", {},
        {}, onsuccesscallback, onfailurecallback,onfailurecallback);
}

/**
 * Queries for user's property extensions used by the header APP. Updates GUI or just updates global variables depending
 * on the justCheck parameter. Can call a callback function on success.
 * @param {string} token Security token which is passed in the request header of the API call
 * @param {string} url URL of the API function which is called to retrieve the open property extensions
 * @param {object} payload Payload which should be sent in the request. This is not used in this function.
 * @param {object} configuration Wrapps in additional needed specifically in this function. Structure:
 *     {boolean} fetchLTZ Specifies if the function should update the GUI with language and time zone data (true) or just update global variables with language and time zone settins.
 *     {boolean} justCheck If the value is true the function just updates the global varioables with a current open property extension values
 *     {function} callbackfunc A function which will be called after a success response from the API has been received.
 *     {any} callbackParam1 The first parameter which will be passed to the callback function.
 *     {any} callbackParam2 The second parameter which will be passed to the callback function.
 * @param {function} onsuccesscallback optional called when user property extensions have been successfully retreived
 * @param {function} onfailurecallback optional callback called when we recieve an error from Microsoft Graph API function or get no data
 */
function getdatanoadaluserpropertyextensions(token, url, payload, configuration, onsuccesscallback, onfailurecallback) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": "GET",        
        "headers": {
            "Authorization": "Bearer " + token
        }
    };
    
    $.ajax(settings).done(function (data,textStatus,request) {
        console.log('getUserPropertyExtensions call successfully executed');
        userPropertyExtensionExists = false;
        languagePropertyExtensionExists = false;
        timeZonePropertyExtensionExists = false;
        themePropertyExtensionExists = false;
        
        // Parse the payload data and create or use existing property extension
        if (data && data.extensions && data.extensions.length > 0) {
            for (var i = 0; i < data.extensions.length; i++) {
                if (data.extensions[i].id === userPropertyExtensionId && data.extensions[i].language) {
                    languagePropertyExtensionExists = true;
                    languagePropertyExtension = data.extensions[i].language;
                    console.log("Language property in open extension: " + languagePropertyExtension);
                }
                
                if (data.extensions[i].id === userPropertyExtensionId && data.extensions[i].timeZone) {
                    timeZonePropertyExtensionExists = true;
                    timeZonePropertyExtension = data.extensions[i].timeZone;
                    console.log("Time zone property in open extension: " + timeZonePropertyExtension);
                }
                
                if (data.extensions[i].id === userPropertyExtensionId && data.extensions[i].theme) {
                    themePropertyExtensionExists = true;
                    themePropertyExtension = data.extensions[i].theme;
                    console.log("Theme property in open extension: " + data.extensions[i].theme);
                }
                
                if (languagePropertyExtensionExists || timeZonePropertyExtensionExists || themePropertyExtensionExists) {
                    userPropertyExtensionExists = true;
                    
                    break;
                }
            }
        }
        
        if (typeof configuration.callbackfunc !== 'undefined') {
            configuration.callbackfunc(configuration.callbackParam1, configuration.callbackParam2);
        }
        
        if (onsuccesscallback) {
            onsuccesscallback(languagePropertyExtensionExists ? languagePropertyExtension : "",
                timeZonePropertyExtensionExists ? timeZonePropertyExtension : "",
                themePropertyExtensionExists ? themePropertyExtension : "");
        }
        
        console.log('Data successfully retrieved! payload: ' + (data!=null ? JSON.stringify(data) : null));
    }).fail(function (err, textStatus, errorThrown) {
        userPropertyExtensionExists = false;
        userPropertyExtensionsAvailable = false;
        console.log('getUserPropertyExtensions call failed');
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
        if (onfailurecallback) {
            onfailurecallback();
        }
    });
}

/**
 * Updates language and time zone stored in user's property extensions on AAD
 * @param {string} language Alias of a new user's language. It should be null if the language hasn't been changed.
 * @param {string} timeZone Alias of a new user's time zone. It should be null if the time zone hasn't been changed.
 */
function updateLanguageTimeZonePropertyExtensions(language, timeZone) {
    var additionalConfiguration = {
        callbackfunc: updateLanguageTimeZonePropertyExtensionsCallback,
        callbackParam1: language,
        callbackParam2: timeZone
    };
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com", getdatanoadaluserpropertyextensions, "https://graph.microsoft.com/beta/me/?$select=id,displayName&$expand=extensions", {}, additionalConfiguration);
}

function updateLanguageTimeZonePropertyExtensionsCallback(language, timeZone) {
    if (!userPropertyExtensionExists) {
        createLanguageTimeZonePropertyExtension(language, timeZone);
    } else if (language !== null && timeZone !== null) {
        var payload = {
            "language": language,
            "timeZone": timeZone
        };
        
        if (themePropertyExtensionExists) {
            payload.theme = themePropertyExtension;
        }
        executeAjaxRequestWithAdalLogic("https://graph.microsoft.com", patchUserPropertyExtensionOnAdal, "https://graph.microsoft.com/beta/me/extensions/" + userPropertyExtensionId, payload);
    } else if (language !== null) {
        var payload = {
            "language": language
        };
        
        if (timeZonePropertyExtensionExists) {
            payload.timeZone = timeZonePropertyExtension;
        }
        
        if (themePropertyExtensionExists) {
            payload.theme = themePropertyExtension;
        }
        
        executeAjaxRequestWithAdalLogic("https://graph.microsoft.com", patchUserPropertyExtensionOnAdal, "https://graph.microsoft.com/beta/me/extensions/" + userPropertyExtensionId, payload);
    } else if (timeZone !== null) {
        var payload = {
            "timeZone": timeZone
        };
        
        if (languagePropertyExtensionExists) {
            payload.language = languagePropertyExtension;
        }
        
        if (themePropertyExtensionExists) {
            payload.theme = themePropertyExtension;
        }
        
        executeAjaxRequestWithAdalLogic("https://graph.microsoft.com", patchUserPropertyExtensionOnAdal, "https://graph.microsoft.com/beta/me/extensions/" + userPropertyExtensionId, payload);
    }
}

function updateThemePropertyExtension(theme) {
    var additionalConfiguration = {
        callbackfunc: updateThemePropertyExtensionCallback,
        callbackParam1: theme
    };
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com", getdatanoadaluserpropertyextensions, "https://graph.microsoft.com/beta/me/?$select=id,displayName&$expand=extensions", {}, additionalConfiguration);
}

function updateThemePropertyExtensionCallback(theme) {
    if (userPropertyExtensionExists) {
        var payload = {
            "theme": theme
        };
        
        if (languagePropertyExtensionExists) {
            if (appConfiguration.useOutlookSettings) {
                payload.language = languagePropertyExtension;
            } else {
                payload.language = languageSelector.currentLanguage;
            }
        }
        
        if (timeZonePropertyExtensionExists) {
            if (appConfiguration.useOutlookSettings) {
                payload.timeZone = timeZonePropertyExtension;
            } else {
                payload.timeZone = timeZoneSelector.currentTimeZone;
            }
        }
        
        executeAjaxRequestWithAdalLogic("https://graph.microsoft.com", patchUserPropertyExtensionOnAdal, "https://graph.microsoft.com/beta/me/extensions/" + userPropertyExtensionId, payload);
    } else {
        createThemePropertyExtension(theme);
    }
}

function patchUserPropertyExtensionOnAdal(token, url, payload) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": "PATCH",        
        "headers": {
            "Authorization": "Bearer " + token
        },
        "data": JSON.stringify(payload),
        "contentType": "application/json"
    };
    
    $.ajax(settings).done(function (data,textStatus,request) {
        if (payload.theme) {
            TogFormViewer.setProperty("storedUserTheme", payload.theme);
        } else {
            TogFormViewer.setProperty("storedUserTheme", "");
        }
        
        if (payload.language) {
            TogFormViewer.setProperty("storedUserLanguage", payload.language);
        } else {
            TogFormViewer.setProperty("storedUserLanguage", "");
        }
        
        if (payload.timeZone) {
            TogFormViewer.setProperty("storedUserTimeZone", payload.timeZone);
        } else {
            TogFormViewer.setProperty("storedUserTimeZone", "");
        }
        
        console.log('patchUserPropertyExtensionOnAdal call successfully executed');
        console.log("User's theme property extension successfully updated! DATA="+(data!=null ? JSON.stringify(data) : null));
    }).fail(function (err, textStatus, errorThrown) {
        if (payload.theme) {
            TogFormViewer.setProperty("storedUserTheme", "");
        }
        
        if (payload.language) {
            TogFormViewer.setProperty("storedUserLanguage", "");
        }
        
        if (payload.timeZone) {
            TogFormViewer.setProperty("storedUserTimeZone", "");
        }
        
        console.log('patchUserPropertyExtensionOnAdal call failed');
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
    });
}