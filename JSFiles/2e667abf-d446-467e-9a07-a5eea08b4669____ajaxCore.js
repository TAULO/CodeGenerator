// global Services
var Services = Services || {};

Services.Primary = {
Name: 'IPrimaryWebService',
BaseUrl: 'http://impactmade.com:8080',
Test: function( successFunction, errorFunction) {$.ajax({
                                url: Services.Primary.BaseUrl + '/' + Services.Primary.Name + '/Test',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
CheckAvailableNumbers: function( successFunction, errorFunction) {$.ajax({
                                url: Services.Primary.BaseUrl + '/' + Services.Primary.Name + '/CheckAvailableNumbers',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
Login: function(email,password, successFunction, errorFunction) {$.ajax({
                                url: Services.Primary.BaseUrl + '/' + Services.Primary.Name + '/Login',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'email': email, 'password': password},
                                success: successFunction,
                                error: errorFunction
                            });
},
CreateAccount: function(verificationCode,firstName,lastName,email,password,companyName,keepExistingNumber,virtualNumber, successFunction, errorFunction) {$.ajax({
                                url: Services.Primary.BaseUrl + '/' + Services.Primary.Name + '/CreateAccount',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'verificationCode': verificationCode, 'firstName': firstName, 'lastName': lastName, 'email': email, 'password': password, 'companyName': companyName, 'keepExistingNumber': keepExistingNumber, 'virtualNumber': virtualNumber},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetAccountInfo: function( successFunction, errorFunction) {$.ajax({
                                url: Services.Primary.BaseUrl + '/' + Services.Primary.Name + '/GetAccountInfo',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
UpdateAccountInfo: function(firstName,lastName,companyName,email,mobileNumber,imageBase64,subscribeToNewsLetter, successFunction, errorFunction) {$.ajax({
                                url: Services.Primary.BaseUrl + '/' + Services.Primary.Name + '/UpdateAccountInfo',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'firstName': firstName, 'lastName': lastName, 'companyName': companyName, 'email': email, 'mobileNumber': mobileNumber, 'imageBase64': imageBase64, 'subscribeToNewsLetter': subscribeToNewsLetter},
                                success: successFunction,
                                error: errorFunction
                            });
},
UpdatePassword: function(oldPassword,newPassword, successFunction, errorFunction) {$.ajax({
                                url: Services.Primary.BaseUrl + '/' + Services.Primary.Name + '/UpdatePassword',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'oldPassword': oldPassword, 'newPassword': newPassword},
                                success: successFunction,
                                error: errorFunction
                            });
},
SignUpRequest: function(firstName,lastName,companyName,contactPhone,emailAddress,numberEmployees, successFunction, errorFunction) {$.ajax({
                                url: Services.Primary.BaseUrl + '/' + Services.Primary.Name + '/SignUpRequest',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'firstName': firstName, 'lastName': lastName, 'companyName': companyName, 'contactPhone': contactPhone, 'emailAddress': emailAddress, 'numberEmployees': numberEmployees},
                                success: successFunction,
                                error: errorFunction
                            });
},
ContactUs: function(firstName,emailAddress,subject,message, successFunction, errorFunction) {$.ajax({
                                url: Services.Primary.BaseUrl + '/' + Services.Primary.Name + '/ContactUs',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'firstName': firstName, 'emailAddress': emailAddress, 'subject': subject, 'message': message},
                                success: successFunction,
                                error: errorFunction
                            });
},
PingLinuxCoreService: function(idLinuxCoreService, successFunction, errorFunction) {$.ajax({
                                url: Services.Primary.BaseUrl + '/' + Services.Primary.Name + '/PingLinuxCoreService',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idLinuxCoreService': idLinuxCoreService},
                                success: successFunction,
                                error: errorFunction
                            });
}}
Services.Local = {
Name: 'ILocalWebService',
BaseUrl: localStorage['url'],
Test: function( successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/Test',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetExamples: function( successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetExamples',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetExample: function(idOfExample, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetExample',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idOfExample': idOfExample},
                                success: successFunction,
                                error: errorFunction
                            });
},
Logout: function(token, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/Logout',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'token': token},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetVirtualNumbers: function( successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetVirtualNumbers',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
UpdateVirtualNumber: function(sidVirtualNumber,friendlyName,timeZoneOffset, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/UpdateVirtualNumber',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'sidVirtualNumber': sidVirtualNumber, 'friendlyName': friendlyName, 'timeZoneOffset': timeZoneOffset},
                                success: successFunction,
                                error: errorFunction
                            });
},
DeleteVirtualNumber: function(sidVirtualNumber, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/DeleteVirtualNumber',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'sidVirtualNumber': sidVirtualNumber},
                                success: successFunction,
                                error: errorFunction
                            });
},
PurchaseVirtualNumber: function(virtualNumber, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/PurchaseVirtualNumber',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'virtualNumber': virtualNumber},
                                success: successFunction,
                                error: errorFunction
                            });
},
IsAuthenticated: function(token, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/IsAuthenticated',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'token': token},
                                success: successFunction,
                                error: errorFunction
                            });
},
ValidateXml: function(xmlEncoded,isVoice, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/ValidateXml',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'xmlEncoded': xmlEncoded, 'isVoice': isVoice},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetLogics: function(sidVirtualNumber, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetLogics',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'sidVirtualNumber': sidVirtualNumber},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetLogicXml: function(idLogic, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetLogicXml',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idLogic': idLogic},
                                success: successFunction,
                                error: errorFunction
                            });
},
CreateLogic: function(sidVirtualNumber,xmlEncoded,name,description,isVoice,isTemp, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/CreateLogic',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'sidVirtualNumber': sidVirtualNumber, 'xmlEncoded': xmlEncoded, 'name': name, 'description': description, 'isVoice': isVoice, 'isTemp': isTemp},
                                success: successFunction,
                                error: errorFunction
                            });
},
UpdateLogic: function(idLogic,xmlEncoded,name,description,weekDaysToAdd, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/UpdateLogic',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idLogic': idLogic, 'xmlEncoded': xmlEncoded, 'name': name, 'description': description, 'weekDaysToAdd': weekDaysToAdd},
                                success: successFunction,
                                error: errorFunction
                            });
},
DeleteLogic: function(idLogic, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/DeleteLogic',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idLogic': idLogic},
                                success: successFunction,
                                error: errorFunction
                            });
},
ListUsageSms: function(virtualNumberSid,startDate,endDate, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/ListUsageSms',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'virtualNumberSid': virtualNumberSid, 'startDate': startDate, 'endDate': endDate},
                                success: successFunction,
                                error: errorFunction
                            });
},
ListUsageSmsMedia: function(virtualNumberSid,startDate,endDate, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/ListUsageSmsMedia',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'virtualNumberSid': virtualNumberSid, 'startDate': startDate, 'endDate': endDate},
                                success: successFunction,
                                error: errorFunction
                            });
},
ListSms: function(virtualNumberSid,startDate,endDate,pageNumber,filterFrom,filterTo,filterBody,filterIsIncoming, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/ListSms',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'virtualNumberSid': virtualNumberSid, 'startDate': startDate, 'endDate': endDate, 'pageNumber': pageNumber, 'filterFrom': filterFrom, 'filterTo': filterTo, 'filterBody': filterBody, 'filterIsIncoming': filterIsIncoming},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetSms: function(sidSms, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetSms',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'sidSms': sidSms},
                                success: successFunction,
                                error: errorFunction
                            });
},
ListUsageCalls: function(virtualNumberSid,startDate,endDate, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/ListUsageCalls',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'virtualNumberSid': virtualNumberSid, 'startDate': startDate, 'endDate': endDate},
                                success: successFunction,
                                error: errorFunction
                            });
},
ListCalls: function(virtualNumberSid,startDate,endDate,pageNumber,filterFrom,filterTo,filterHasRecordings,filterIsIncoming, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/ListCalls',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'virtualNumberSid': virtualNumberSid, 'startDate': startDate, 'endDate': endDate, 'pageNumber': pageNumber, 'filterFrom': filterFrom, 'filterTo': filterTo, 'filterHasRecordings': filterHasRecordings, 'filterIsIncoming': filterIsIncoming},
                                success: successFunction,
                                error: errorFunction
                            });
},
ListUsageRecordings: function(virtualNumberSid,startDate,endDate, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/ListUsageRecordings',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'virtualNumberSid': virtualNumberSid, 'startDate': startDate, 'endDate': endDate},
                                success: successFunction,
                                error: errorFunction
                            });
},
ListRecordings: function(virtualNumberSid,startDate,endDate, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/ListRecordings',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'virtualNumberSid': virtualNumberSid, 'startDate': startDate, 'endDate': endDate},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetCall: function(sidCall, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetCall',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'sidCall': sidCall},
                                success: successFunction,
                                error: errorFunction
                            });
},
Call: function(virtualNumberSid,fromNumber,toNumber, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/Call',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'virtualNumberSid': virtualNumberSid, 'fromNumber': fromNumber, 'toNumber': toNumber},
                                success: successFunction,
                                error: errorFunction
                            });
},
InitiateOutboundCall: function(sidVirtualNumber,toNumber,idLogic,label, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/InitiateOutboundCall',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'sidVirtualNumber': sidVirtualNumber, 'toNumber': toNumber, 'idLogic': idLogic, 'label': label},
                                success: successFunction,
                                error: errorFunction
                            });
},
ListRecentCalls: function(sidVirtualNumber,filterFrom,filterTo, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/ListRecentCalls',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'sidVirtualNumber': sidVirtualNumber, 'filterFrom': filterFrom, 'filterTo': filterTo},
                                success: successFunction,
                                error: errorFunction
                            });
},
RedirectCall: function(sidCall,idLogic,label, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/RedirectCall',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'sidCall': sidCall, 'idLogic': idLogic, 'label': label},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetLocationOfCall: function(callSid,currentLocation, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetLocationOfCall',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'callSid': callSid, 'currentLocation': currentLocation},
                                success: successFunction,
                                error: errorFunction
                            });
},
ImportContacts: function(vCardContactactsEncoded, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/ImportContacts',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'vCardContactactsEncoded': vCardContactactsEncoded},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetActivePeriodInfo: function( successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetActivePeriodInfo',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
PortNumber: function(phoneNumberToPort,data,doc1,doc2,doc3,doc4, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/PortNumber',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'phoneNumberToPort': phoneNumberToPort, 'data': data, 'doc1': doc1, 'doc2': doc2, 'doc3': doc3, 'doc4': doc4},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetVariableCategories: function(sidVirtualNumber, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetVariableCategories',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'sidVirtualNumber': sidVirtualNumber},
                                success: successFunction,
                                error: errorFunction
                            });
},
AutoCompleteGetVariableCategories: function(sidVirtualNumber,partialCategoryName, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/AutoCompleteGetVariableCategories',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'sidVirtualNumber': sidVirtualNumber, 'partialCategoryName': partialCategoryName},
                                success: successFunction,
                                error: errorFunction
                            });
},
CreateVariableCategory: function(sidVirtualNumber,name,description, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/CreateVariableCategory',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'sidVirtualNumber': sidVirtualNumber, 'name': name, 'description': description},
                                success: successFunction,
                                error: errorFunction
                            });
},
UpdateVariableCategory: function(idVariableCategory,newName,newDescription, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/UpdateVariableCategory',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idVariableCategory': idVariableCategory, 'newName': newName, 'newDescription': newDescription},
                                success: successFunction,
                                error: errorFunction
                            });
},
DeleteVariableCategory: function(idVariableCategory, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/DeleteVariableCategory',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idVariableCategory': idVariableCategory},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetVariables: function(idVariableCategory, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetVariables',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idVariableCategory': idVariableCategory},
                                success: successFunction,
                                error: errorFunction
                            });
},
AutoCompleteGetVariables: function(idCategory,partialVariableName, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/AutoCompleteGetVariables',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idCategory': idCategory, 'partialVariableName': partialVariableName},
                                success: successFunction,
                                error: errorFunction
                            });
},
CreateVariable: function(idVariableCategory,variableName,variableType,variableOptionsSeparatedByComma, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/CreateVariable',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idVariableCategory': idVariableCategory, 'variableName': variableName, 'variableType': variableType, 'variableOptionsSeparatedByComma': variableOptionsSeparatedByComma},
                                success: successFunction,
                                error: errorFunction
                            });
},
UpdateVariable: function(idVariable,variableName,variableType,variableOptionsSeparatedByComma, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/UpdateVariable',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idVariable': idVariable, 'variableName': variableName, 'variableType': variableType, 'variableOptionsSeparatedByComma': variableOptionsSeparatedByComma},
                                success: successFunction,
                                error: errorFunction
                            });
},
DeleteVariable: function(idVariable, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/DeleteVariable',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idVariable': idVariable},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetVariableValues: function(idVariableSeparatedByComma,phoneNumbersSeparatedByComma, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetVariableValues',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idVariableSeparatedByComma': idVariableSeparatedByComma, 'phoneNumbersSeparatedByComma': phoneNumbersSeparatedByComma},
                                success: successFunction,
                                error: errorFunction
                            });
},
UpdateOrCreateVariableValue: function(idVariable,phoneNumber,valueEncoded, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/UpdateOrCreateVariableValue',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idVariable': idVariable, 'phoneNumber': phoneNumber, 'valueEncoded': valueEncoded},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetRecording: function(idRecording, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetRecording',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'audio/mpeg',
                                data: {'idRecording': idRecording},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetEvents: function(startDate,endDate,pageNumber, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/GetEvents',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'startDate': startDate, 'endDate': endDate, 'pageNumber': pageNumber},
                                success: successFunction,
                                error: errorFunction
                            });
},
DeleteEvent: function(id, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/DeleteEvent',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'id': id},
                                success: successFunction,
                                error: errorFunction
                            });
},
CreateEvent: function(idVirtualNumber,idLogic,title,subtitle,date,recipientsSeparatedByComma, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/CreateEvent',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idVirtualNumber': idVirtualNumber, 'idLogic': idLogic, 'title': title, 'subtitle': subtitle, 'date': date, 'recipientsSeparatedByComma': recipientsSeparatedByComma},
                                success: successFunction,
                                error: errorFunction
                            });
},
UpdateEvent: function(idEvent,idVirtualNumber,idLogic,title,subtitle,date,recipientsSeparatedByComa, successFunction, errorFunction) {$.ajax({
                                url: Services.Local.BaseUrl + '/' + Services.Local.Name + '/UpdateEvent',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idEvent': idEvent, 'idVirtualNumber': idVirtualNumber, 'idLogic': idLogic, 'title': title, 'subtitle': subtitle, 'date': date, 'recipientsSeparatedByComa': recipientsSeparatedByComa},
                                success: successFunction,
                                error: errorFunction
                            });
}}
Services.PBX = {
Name: 'IPBX',
BaseUrl: localStorage['url'],
Test: function( successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/Test',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
HandleCall: function( successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/HandleCall',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'xml',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
OnCallTerminated: function( successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/OnCallTerminated',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
DownloadSipConf: function(id, successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/DownloadSipConf',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'text',
                                data: {'id': id},
                                success: successFunction,
                                error: errorFunction
                            });
},
DownloadDialplanConf: function(id, successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/DownloadDialplanConf',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'text',
                                data: {'id': id},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetModelsOfPhonesThatCanBeConfiguredRemotely: function( successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/GetModelsOfPhonesThatCanBeConfiguredRemotely',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
CreateExecutableToConfigureIpPhone: function(idIpPhone,ipPhoneModel,ipAddressOfIpPhone, successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/CreateExecutableToConfigureIpPhone',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'text',
                                data: {'idIpPhone': idIpPhone, 'ipPhoneModel': ipPhoneModel, 'ipAddressOfIpPhone': ipAddressOfIpPhone},
                                success: successFunction,
                                error: errorFunction
                            });
},
DownloadExecuatbleConfiguration: function(id, successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/DownloadExecuatbleConfiguration',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'application/octet-stream',
                                data: {'id': id},
                                success: successFunction,
                                error: errorFunction
                            });
},
UpdateSip: function( successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/UpdateSip',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
UpdateDialplan: function( successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/UpdateDialplan',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
CanWeSshIntoPbx: function( successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/CanWeSshIntoPbx',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
CreateIpPhone: function(displayName,blockInterationalCalling,callerId,hasVoicemail,voicemailPin,sendVoicemailToEmail,deleteVoicemailIfSentByEmail,logicVacation,logicUnavailable,logicBusy,isOnVacation,sipPassword, successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/CreateIpPhone',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'displayName': displayName, 'blockInterationalCalling': blockInterationalCalling, 'callerId': callerId, 'hasVoicemail': hasVoicemail, 'voicemailPin': voicemailPin, 'sendVoicemailToEmail': sendVoicemailToEmail, 'deleteVoicemailIfSentByEmail': deleteVoicemailIfSentByEmail, 'logicVacation': logicVacation, 'logicUnavailable': logicUnavailable, 'logicBusy': logicBusy, 'isOnVacation': isOnVacation, 'sipPassword': sipPassword},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetIpPhones: function( successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/GetIpPhones',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetIpPhonesStatus: function( successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/GetIpPhonesStatus',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
UpdateIpPhone: function(idIpPhone,displayName,blockInterationalCalling,callerId,hasVoicemail,voicemailPin,sendVoicemailToEmail,deleteVoicemailIfSentByEmail,logicVacation,logicUnavailable,logicBusy,isOnVacation,sipPassword, successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/UpdateIpPhone',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idIpPhone': idIpPhone, 'displayName': displayName, 'blockInterationalCalling': blockInterationalCalling, 'callerId': callerId, 'hasVoicemail': hasVoicemail, 'voicemailPin': voicemailPin, 'sendVoicemailToEmail': sendVoicemailToEmail, 'deleteVoicemailIfSentByEmail': deleteVoicemailIfSentByEmail, 'logicVacation': logicVacation, 'logicUnavailable': logicUnavailable, 'logicBusy': logicBusy, 'isOnVacation': isOnVacation, 'sipPassword': sipPassword},
                                success: successFunction,
                                error: errorFunction
                            });
},
RemoveIpPhone: function(idIpPhone, successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/RemoveIpPhone',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idIpPhone': idIpPhone},
                                success: successFunction,
                                error: errorFunction
                            });
},
CreateExtension: function(idIpPhone,extension, successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/CreateExtension',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idIpPhone': idIpPhone, 'extension': extension},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetExtensions: function( successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/GetExtensions',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
UpdateExtension: function(idExtension,newExtension, successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/UpdateExtension',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idExtension': idExtension, 'newExtension': newExtension},
                                success: successFunction,
                                error: errorFunction
                            });
},
DeleteExtension: function(idExtension, successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/DeleteExtension',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idExtension': idExtension},
                                success: successFunction,
                                error: errorFunction
                            });
},
CreateConference: function(confName,extension, successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/CreateConference',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'confName': confName, 'extension': extension},
                                success: successFunction,
                                error: errorFunction
                            });
},
GetConferences: function( successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/GetConferences',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {},
                                success: successFunction,
                                error: errorFunction
                            });
},
UpdateConference: function(idConference,confName,extension, successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/UpdateConference',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idConference': idConference, 'confName': confName, 'extension': extension},
                                success: successFunction,
                                error: errorFunction
                            });
},
DeleteConference: function(idConference, successFunction, errorFunction) {$.ajax({
                                url: Services.PBX.BaseUrl + '/' + Services.PBX.Name + '/DeleteConference',
                                headers: { 'x-token': localStorage['x-token'] },
                                method: 'POST',
                                crossDomain: true,
                                dataType: 'json',
                                data: {'idConference': idConference},
                                success: successFunction,
                                error: errorFunction
                            });
}}
