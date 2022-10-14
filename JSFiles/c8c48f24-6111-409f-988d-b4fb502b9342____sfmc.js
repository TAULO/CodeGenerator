'use strict';
var util = require('util');
var FuelRest = require('fuel-rest');
const uuidv1 = require('uuid/v1');
var moment = require('moment-timezone');
var FuelSoap = require('fuel-soap');
const { rejects } = require('assert');
const { resolve } = require('path');
var axios = require('axios');
var sandyalexander  = require('./sandyalexander');

//Retrieves Data Extension Rows for use in frontend. 

exports.dataextensionrows = function (req,res){
    console.log("Data Extension rows: " + JSON.stringify(req.query));
    
    var xml2js = require('xml2js');

    let soapMessage = '<?xml version="1.0" encoding="UTF-8"?>'
    +'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
    +'    <s:Header>'
    +'        <a:Action s:mustUnderstand="1">Retrieve</a:Action>'
    +'        <a:To s:mustUnderstand="1">'+process.env.SfmcSoapUrl+'Service.asmx</a:To>'
    +'        <fueloauth xmlns="http://exacttarget.com">'+req.query.token+'</fueloauth>'
    +'    </s:Header>'
    +'    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
    +'        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">'
    +'            <RetrieveRequest>'
    +'                <ObjectType>DataExtensionObject['+process.env.SfmcActivityDEExternalKey+']</ObjectType>'
    +'      <Properties>ActivityName</Properties>'
    +'        <Properties>CreatedDate</Properties>'
    +'        <Properties>JourneyID</Properties>'
    +'        <Properties>MailClass</Properties>'
    +'        <Properties>QueueSize</Properties>'
    +'        <Properties>ProductId</Properties>'
    +'        <Properties>JourneyActive</Properties>'
    +'        <Properties>Frequency</Properties>'
    +'        <Properties>Conditional</Properties>'
    +'        <Properties>ProductType</Properties>'
    +'        <Properties>ActiveDate</Properties>'
    +'            </RetrieveRequest>'
    +'        </RetrieveRequestMsg>'
    +'    </s:Body>'
    +'</s:Envelope>';

    console.log('soapMessage '+soapMessage);
     var configs = {
         method: 'post',
         url: process.env.SfmcSoapUrl+'Service.asmx',
         headers: {
             'Content-Type': 'text/xml'
            },
            data : soapMessage
    };

    axios(configs)
    .then(function (response) {
                
        let rawdata = response.data;
             
        var parser = new xml2js.Parser();
        parser.parseString(rawdata, function(err,result){
                  
            let rawData = result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0];
            if(rawData){
                res.status(200).send(rawData);
            } else {
                let empList = [];
                res.status(301).send(empList);
            }
        });
    })
    .catch(function (error) {
        res.status(500).send('Something went wrong for retrieving rows from SandyActivity list!!!'+error);
        console.log('Retrieving all rows error '+error);
    });
    
}

exports.derowsforapp = function (req,res){
    console.log("Data Extension rows: " + JSON.stringify(req.query));
    
    var xml2js = require('xml2js');

    var data = { 
        grant_type: 'client_credentials',
        client_id: process.env.SfmcClientId,
        client_secret: process.env.SfmcClientSecret,
        account_id: process.env.accountID,
    };
    
    var config = {
        method: 'post',
        url: process.env.SfmcAuthUrl+'v2/token',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };
    
    axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
        
        let soapMessage = '<?xml version="1.0" encoding="UTF-8"?>'
        +'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
        +'    <s:Header>'
        +'        <a:Action s:mustUnderstand="1">Retrieve</a:Action>'
        +'        <a:To s:mustUnderstand="1">'+process.env.SfmcSoapUrl+'Service.asmx</a:To>'
        +'        <fueloauth xmlns="http://exacttarget.com">'+response.data.access_token+'</fueloauth>'
        +'    </s:Header>'
        +'    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
        +'        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">'
        +'            <RetrieveRequest>'
        +'                <ObjectType>DataExtensionObject['+process.env.SfmcActivityDEExternalKey+']</ObjectType>'
        +'      <Properties>ActivityName</Properties>'
        +'        <Properties>CreatedDate</Properties>'
        +'        <Properties>JourneyID</Properties>'
        +'        <Properties>MailClass</Properties>'
        +'        <Properties>QueueSize</Properties>'
        +'        <Properties>ProductId</Properties>'
        +'        <Properties>JourneyActive</Properties>'
        +'        <Properties>Frequency</Properties>'
        +'        <Properties>Conditional</Properties>'
        +'        <Properties>ProductType</Properties>'
        +'        <Properties>ActiveDate</Properties>'
        +'            </RetrieveRequest>'
        +'        </RetrieveRequestMsg>'
        +'    </s:Body>'
        +'</s:Envelope>';

        console.log('soapMessage '+soapMessage);
        var configs = {
            method: 'post',
            url: process.env.SfmcSoapUrl+'Service.asmx',
            headers: {
                'Content-Type': 'text/xml'
                },
                data : soapMessage
        };

        axios(configs)
        .then(function (response) {
                    
            let rawdata = response.data;
                
            var parser = new xml2js.Parser();
            parser.parseString(rawdata, function(err,result){
                    
                let rawData = result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0];
                if(rawData){
                    res.status(200).send(rawData);
                } else {
                    let empList = [];
                    res.status(301).send(empList);
                }
            });
        })
        .catch(function (error) {
            res.status(500).send('Something went wrong for retrieving rows from SandyActivity List for app!!!'+error);
            console.log('Retrieving all rows error an app '+error);
        });
    })
    .catch(function (error) {
        console.log('Getting Access token : '+error);
    });
}

exports.queuederowsforapp = function (req,res){
    console.log("Queue Data Extension rows: " + JSON.stringify(req.query));
    
    var xml2js = require('xml2js');

    var data = { 
        grant_type: 'client_credentials',
        client_id: process.env.SfmcClientId,
        client_secret: process.env.SfmcClientSecret,
        account_id: process.env.accountID,
    };
    
    var config = {
        method: 'post',
        url: process.env.SfmcAuthUrl+'v2/token',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };
    
    axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
        
        let soapMessage = '<?xml version="1.0" encoding="UTF-8"?>'
        +'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
        +'    <s:Header>'
        +'        <a:Action s:mustUnderstand="1">Retrieve</a:Action>'
        +'        <a:To s:mustUnderstand="1">'+process.env.SfmcSoapUrl+'Service.asmx</a:To>'
        +'        <fueloauth xmlns="http://exacttarget.com">'+response.data.access_token+'</fueloauth>'
        +'    </s:Header>'
        +'    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
        +'        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">'
        +'            <RetrieveRequest>'
        +'                <ObjectType>DataExtensionObject['+process.env.SfmcQueueDEExternalKey+']</ObjectType>'
        +'      <Properties>ActivityName</Properties>'
        +'        <Properties>ContactKey</Properties>'
        +'        <Properties>MappedData</Properties>'
        +'        <Properties>Status</Properties>'
        +'            </RetrieveRequest>'
        +'        </RetrieveRequestMsg>'
        +'    </s:Body>'
        +'</s:Envelope>';

        console.log('soapMessage '+soapMessage);
        var configs = {
            method: 'post',
            url: process.env.SfmcSoapUrl+'Service.asmx',
            headers: {
                'Content-Type': 'text/xml'
                },
                data : soapMessage
        };

        axios(configs)
        .then(function (response) {
                    
            let rawdata = response.data;
                
            var parser = new xml2js.Parser();
            parser.parseString(rawdata, function(err,result){
                    
                let rawData = result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0];
                if(rawData){
                    res.status(200).send(rawData);
                } else {
                    let empList = [];
                    res.status(301).send(empList);
                }
            });
        })
        .catch(function (error) {
            res.status(500).send('Something went wrong for retrieving rows from SandyActivity List for app!!!'+error);
            console.log('Retrieving all rows error an app '+error);
        });
    })
    .catch(function (error) {
        console.log('Getting Access token : '+error);
    });
}

//Retrieve Journey Data Extension Name
exports.getdename = function (req,res){
    console.log("Get DE Name: " + JSON.stringify(req.body));
    var eventId = req.query.eventId;
    var fuel2token = req.query.fuelToken;
    var requestUrl = process.env.SfmcRestUrl;

    var request = require('request'),
        url = requestUrl + "interaction/v1/eventDefinitions/" + eventId,
        auth = "Bearer " + fuel2token;
    
    request(
        {
            url : url,
            headers : {
                "Authorization" : auth,
                "Content-type": "application/json"
            }
        },
        function (error, response, body) {
            if(error){
                console.log('*** EventDefinitionFuelApi ERROR ***');
                console.log(error);
            }
            console.log('*** EventDefinitionFuelApi RESPONSE ***');
            console.log(res);
            res.status(200).json(JSON.parse(body));
        }
    );

}

//Creating Static Data Extension Template Handler for / route of Activity (this is executed when Custom Activity opening).
exports.staticDataExtension = function (req, res) {
    
    console.log('request DEName is '+JSON.stringify(req.body));
    var xml2js = require('xml2js');
    
    let soapMessage = '<?xml version="1.0" encoding="UTF-8"?>'
    +'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
    +'    <s:Header>'
    +'        <a:Action s:mustUnderstand="1">Retrieve</a:Action>'
    +'        <a:To s:mustUnderstand="1">'+process.env.SfmcSoapUrl+'Service.asmx</a:To>'
    +'        <fueloauth xmlns="http://exacttarget.com">'+req.body.token+'</fueloauth>'
    +'    </s:Header>'
    +'    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
    +'        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">'
    +'            <RetrieveRequest>'
    +'                <ObjectType>DataExtension</ObjectType>'
    +'                <Properties>ObjectID</Properties>'
    +'                <Properties>CustomerKey</Properties>'
    +'                <Properties>Name</Properties>'
    +'                <Properties>IsSendable</Properties>'
    +'                <Properties>SendableSubscriberField.Name</Properties>'
    +'                <Filter xsi:type="SimpleFilterPart">'
    +'                    <Property>CustomerKey</Property>'
    +'                    <SimpleOperator>equals</SimpleOperator>'
    +'                    <Value>Mailpath_Activity_List_'+process.env.accountID+'</Value>'
    +'                </Filter>'
    +'            </RetrieveRequest>'
    +'        </RetrieveRequestMsg>'
    +'    </s:Body>'
    +'</s:Envelope>';
    
    var dataconfig = {
      method: 'post',
      url: process.env.SfmcSoapUrl+'Service.asmx',
      headers: { 
        'Content-Type': 'text/xml'
      },
      data : soapMessage
    };
    
    axios(dataconfig)
    .then(function (response) {
        
        let rawdata = response.data;
        var soapMsg = '';
        var parser = new xml2js.Parser();
        let resultData;
        parser.parseString(rawdata, function(err,result){
            //console.log('result static body'+JSON.stringify(result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0]['Results']));
            resultData = result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0]['Results'];
        });

        if(!resultData){
            
            soapMsg = '<?xml version="1.0" encoding="UTF-8"?>'
            +'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
            +'    <s:Header>'
            +'        <a:Action s:mustUnderstand="1">Create</a:Action>'
            +'        <a:To s:mustUnderstand="1">'+process.env.SfmcSoapUrl+'Service.asmx</a:To>'
            +'        <fueloauth xmlns="http://exacttarget.com">'+req.body.token+'</fueloauth>'
            +'    </s:Header>'
            +'    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
            +'        <CreateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">'
            +'<Objects xsi:type="DataExtension">'
            +'<CategoryID>'+req.body.catID+'</CategoryID>'
            +'<CustomerKey>Mailpath_Activity_List_'+process.env.accountID+'</CustomerKey>'
            +'<Name>Mailpath Activity List '+process.env.accountID+'</Name>'
            +'<IsSendable>false</IsSendable>'
            +'<Fields>'
            +'<Field>'
            +'<CustomerKey>ActivityName</CustomerKey>'
            +'<Name>ActivityName</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>100</MaxLength>'
            +'<IsRequired>true</IsRequired>'
            +'<IsPrimaryKey>true</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>CreatedDate</CustomerKey>'
            +'<Name>CreatedDate</Name>'
            +'<FieldType>Date</FieldType>'
            +'<IsRequired>true</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>JourneyID</CustomerKey>'
            +'<Name>JourneyID</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>50</MaxLength>'
            +'<IsRequired>true</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>MailClass</CustomerKey>'
            +'<Name>MailClass</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>20</MaxLength>'
            +'<IsRequired>true</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>QueueSize</CustomerKey>'
            +'<Name>QueueSize</Name>'
            +'<FieldType>Number</FieldType>'
            +'<IsRequired>true</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>ProductId</CustomerKey>'
            +'<Name>ProductId</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>50</MaxLength>'
            +'<IsRequired>true</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>JourneyActive</CustomerKey>'
            +'<Name>JourneyActive</Name>'
            +'<FieldType>Boolean</FieldType>'
            +'<IsRequired>true</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>Frequency</CustomerKey>'
            +'<Name>Frequency</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>50</MaxLength>'
            +'<IsRequired>true</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>FrequencyPrevious</CustomerKey>'
            +'<Name>FrequencyPrevious</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>50</MaxLength>'
            +'<IsRequired>false</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>ActiveDate</CustomerKey>'
            +'<Name>ActiveDate</Name>'
            +'<FieldType>Date</FieldType>'
            +'<IsRequired>false</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>ActiveDatePrevious</CustomerKey>'
            +'<Name>ActiveDatePrevious</Name>'
            +'<FieldType>Date</FieldType>'
            +'<IsRequired>false</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>QueueSizePrevious</CustomerKey>'
            +'<Name>QueueSizePrevious</Name>'
            +'<FieldType>Number</FieldType>'
            +'<IsRequired>false</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>Conditional</CustomerKey>'
            +'<Name>Conditional</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>5</MaxLength>'
            +'<IsRequired>true</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>ConditionalPrevious</CustomerKey>'
            +'<Name>ConditionalPrevious</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>5</MaxLength>'
            +'<IsRequired>false</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>ProductType</CustomerKey>'
            +'<Name>ProductType</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>50</MaxLength>'
            +'<IsRequired>true</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'</Fields>'
            +'</Objects>'
            +'        </CreateRequest>'
            +'    </s:Body>'
            +'</s:Envelope>';
            
            console.log('soapMsg : '+soapMsg);
            var dataconfg = {
            method: 'post',
            url: process.env.SfmcSoapUrl+'Service.asmx',
            headers: { 
            'Content-Type': 'text/xml'
            },
            data : soapMsg
            };
            
            axios(dataconfg)
            .then(function (response) {
                
                let rawdata = response.data;

                var parser = new xml2js.Parser();
                parser.parseString(rawdata, function(err,result){
                    //console.log('result res body'+JSON.stringify(result['soap:Envelope']['soap:Body'][0]['CreateResponse'][0]['Results']));
                    let resData = result['soap:Envelope']['soap:Body'][0]['CreateResponse'][0]['Results'];
                    if(resData){
                        //console.log('StatusCode '+resData[0].StatusCode+'StatusMessage '+resData[0].StatusMessage);
                        res.status(200).send('creating Mailpath Activity List '+resData[0].StatusMessage);
                    } else {
                        res.status(400).send('creating Mailpath Activity List Some thing went wrong!');
                    }
                });
            })
            .catch(function (error) {
                console.log('Creating Mailpath Activity List error '+error);
                res.status(500).send('Something went wrong for creating Mailpath Activity List!!!'+error);
            });
        } else {
		    res.status(202).send('Already created Mailpath Activity List');
	    }
    })
    .catch(function (error) {
        res.status(500).send('Something went wrong for checking Mailpath Activity List available or not!!!'+error);
        console.log('Exist Mailpath Activity List error '+error);
    });
};

exports.staticDataExtensionSync = function (req, res) {
    
    console.log('request DEName is '+JSON.stringify(req.body));
    var xml2js = require('xml2js');
    
    let soapMessage = '<?xml version="1.0" encoding="UTF-8"?>'
    +'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
    +'    <s:Header>'
    +'        <a:Action s:mustUnderstand="1">Retrieve</a:Action>'
    +'        <a:To s:mustUnderstand="1">'+process.env.SfmcSoapUrl+'Service.asmx</a:To>'
    +'        <fueloauth xmlns="http://exacttarget.com">'+req.body.token+'</fueloauth>'
    +'    </s:Header>'
    +'    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
    +'        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">'
    +'            <RetrieveRequest>'
    +'                <ObjectType>DataExtension</ObjectType>'
    +'                <Properties>ObjectID</Properties>'
    +'                <Properties>CustomerKey</Properties>'
    +'                <Properties>Name</Properties>'
    +'                <Properties>IsSendable</Properties>'
    +'                <Properties>SendableSubscriberField.Name</Properties>'
    +'                <Filter xsi:type="SimpleFilterPart">'
    +'                    <Property>CustomerKey</Property>'
    +'                    <SimpleOperator>equals</SimpleOperator>'
    +'                    <Value>Mailpath_Sync_'+process.env.accountID+'</Value>'
    +'                </Filter>'
    +'            </RetrieveRequest>'
    +'        </RetrieveRequestMsg>'
    +'    </s:Body>'
    +'</s:Envelope>';
    
    var dataconfig = {
      method: 'post',
      url: process.env.SfmcSoapUrl+'Service.asmx',
      headers: { 
        'Content-Type': 'text/xml'
      },
      data : soapMessage
    };
    
    axios(dataconfig)
    .then(function (response) {
        
        let rawdata = response.data;
        var soapMsg = '';
        var parser = new xml2js.Parser();
        let resultData;
        parser.parseString(rawdata, function(err,result){
            //console.log('result static body'+JSON.stringify(result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0]['Results']));
            resultData = result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0]['Results'];
        });

        if(!resultData){
            
            soapMsg = '<?xml version="1.0" encoding="UTF-8"?>'
            +'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
            +'    <s:Header>'
            +'        <a:Action s:mustUnderstand="1">Create</a:Action>'
            +'        <a:To s:mustUnderstand="1">'+process.env.SfmcSoapUrl+'Service.asmx</a:To>'
            +'        <fueloauth xmlns="http://exacttarget.com">'+req.body.token+'</fueloauth>'
            +'    </s:Header>'
            +'    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
            +'        <CreateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">'
            +'<Objects xsi:type="DataExtension">'
            +'<CategoryID>'+req.body.catID+'</CategoryID>'
            +'<CustomerKey>Mailpath_Sync_'+process.env.accountID+'</CustomerKey>'
            +'<Name>Mailpath Sync '+process.env.accountID+'</Name>'
            +'<IsSendable>false</IsSendable>'
            +'<Fields>'
            +'<Field>'
            +'<CustomerKey>ActivityName</CustomerKey>'
            +'<Name>ActivityName</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>100</MaxLength>'
            +'<IsRequired>false</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>ContactKey</CustomerKey>'
            +'<Name>ContactKey</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>50</MaxLength>'
            +'<IsRequired>false</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>MappedData</CustomerKey>'
            +'<Name>MappedData</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>50</MaxLength>'
            +'<IsRequired>false</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>Status</CustomerKey>'
            +'<Name>Status</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>20</MaxLength>'
            +'<IsRequired>false</IsRequired>'
	    +'<DefaultValue>Queued</DefaultValue>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'</Fields>'
            +'</Objects>'
            +'        </CreateRequest>'
            +'    </s:Body>'
            +'</s:Envelope>';
            
            console.log('soapMsg : '+soapMsg);
            var dataconfg = {
            method: 'post',
            url: process.env.SfmcSoapUrl+'Service.asmx',
            headers: { 
            'Content-Type': 'text/xml'
            },
            data : soapMsg
            };
            
            axios(dataconfg)
            .then(function (response) {
                
                let rawdata = response.data;

                var parser = new xml2js.Parser();
                parser.parseString(rawdata, function(err,result){
                    //console.log('result res body'+JSON.stringify(result['soap:Envelope']['soap:Body'][0]['CreateResponse'][0]['Results']));
                    let resData = result['soap:Envelope']['soap:Body'][0]['CreateResponse'][0]['Results'];
                    if(resData){
                        //console.log('StatusCode '+resData[0].StatusCode+'StatusMessage '+resData[0].StatusMessage);
                        res.status(200).send('creating Mailpath Sync '+resData[0].StatusMessage);
                    } else {
                        res.status(400).send('creating Mailpath Sync Some thing went wrong!');
                    }
                });
            })
            .catch(function (error) {
                console.log('Creating Mailpath Sync error '+error);
                res.status(500).send('Something went wrong for creating Mailpath Sync!!!'+error);
            });
        } else {
		    res.status(202).send('Already created Mailpath Sync');
	    }
    })
    .catch(function (error) {
        res.status(500).send('Something went wrong for checking Mailpath Sync available or not!!!'+error);
        console.log('Exist Mailpath Sync error '+error);
    });
};

exports.staticDataExtensionQueue = function (req, res) {
    
    console.log('request DEName is '+JSON.stringify(req.body));
    var xml2js = require('xml2js');
    
    let soapMessage = '<?xml version="1.0" encoding="UTF-8"?>'
    +'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
    +'    <s:Header>'
    +'        <a:Action s:mustUnderstand="1">Retrieve</a:Action>'
    +'        <a:To s:mustUnderstand="1">'+process.env.SfmcSoapUrl+'Service.asmx</a:To>'
    +'        <fueloauth xmlns="http://exacttarget.com">'+req.body.token+'</fueloauth>'
    +'    </s:Header>'
    +'    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
    +'        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">'
    +'            <RetrieveRequest>'
    +'                <ObjectType>DataExtension</ObjectType>'
    +'                <Properties>ObjectID</Properties>'
    +'                <Properties>CustomerKey</Properties>'
    +'                <Properties>Name</Properties>'
    +'                <Properties>IsSendable</Properties>'
    +'                <Properties>SendableSubscriberField.Name</Properties>'
    +'                <Filter xsi:type="SimpleFilterPart">'
    +'                    <Property>CustomerKey</Property>'
    +'                    <SimpleOperator>equals</SimpleOperator>'
    +'                    <Value>Mailpath_Queue_'+process.env.accountID+'</Value>'
    +'                </Filter>'
    +'            </RetrieveRequest>'
    +'        </RetrieveRequestMsg>'
    +'    </s:Body>'
    +'</s:Envelope>';
    
    var dataconfig = {
      method: 'post',
      url: process.env.SfmcSoapUrl+'Service.asmx',
      headers: { 
        'Content-Type': 'text/xml'
      },
      data : soapMessage
    };
    
    axios(dataconfig)
    .then(function (response) {
        
        let rawdata = response.data;
        var soapMsg = '';
        var parser = new xml2js.Parser();
        let resultData;
        parser.parseString(rawdata, function(err,result){
            //console.log('result static body'+JSON.stringify(result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0]['Results']));
            resultData = result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0]['Results'];
        });

        if(!resultData){
            
            soapMsg = '<?xml version="1.0" encoding="UTF-8"?>'
            +'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
            +'    <s:Header>'
            +'        <a:Action s:mustUnderstand="1">Create</a:Action>'
            +'        <a:To s:mustUnderstand="1">'+process.env.SfmcSoapUrl+'Service.asmx</a:To>'
            +'        <fueloauth xmlns="http://exacttarget.com">'+req.body.token+'</fueloauth>'
            +'    </s:Header>'
            +'    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
            +'        <CreateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">'
            +'<Objects xsi:type="DataExtension">'
            +'<CategoryID>'+req.body.catID+'</CategoryID>'
            +'<CustomerKey>Mailpath_Queue_'+process.env.accountID+'</CustomerKey>'
            +'<Name>Mailpath Queue '+process.env.accountID+'</Name>'
            +'<IsSendable>false</IsSendable>'
            +'<Fields>'
            +'<Field>'
            +'<CustomerKey>ActivityName</CustomerKey>'
            +'<Name>ActivityName</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>100</MaxLength>'
            +'<IsRequired>false</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>ContactKey</CustomerKey>'
            +'<Name>ContactKey</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>50</MaxLength>'
            +'<IsRequired>false</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>MappedData</CustomerKey>'
            +'<Name>MappedData</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>500</MaxLength>'
            +'<IsRequired>false</IsRequired>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'<Field>'
            +'<CustomerKey>Status</CustomerKey>'
            +'<Name>Status</Name>'
            +'<FieldType>Text</FieldType>'
            +'<MaxLength>20</MaxLength>'
            +'<IsRequired>false</IsRequired>'
	    +'<DefaultValue>Queued</DefaultValue>'
            +'<IsPrimaryKey>false</IsPrimaryKey>'
            +'</Field>'
            +'</Fields>'
            +'</Objects>'
            +'        </CreateRequest>'
            +'    </s:Body>'
            +'</s:Envelope>';
            
            console.log('soapMsg : '+soapMsg);
            var dataconfg = {
            method: 'post',
            url: process.env.SfmcSoapUrl+'Service.asmx',
            headers: { 
            'Content-Type': 'text/xml'
            },
            data : soapMsg
            };
            
            axios(dataconfg)
            .then(function (response) {
                
                let rawdata = response.data;

                var parser = new xml2js.Parser();
                parser.parseString(rawdata, function(err,result){
                    //console.log('result res body'+JSON.stringify(result['soap:Envelope']['soap:Body'][0]['CreateResponse'][0]['Results']));
                    let resData = result['soap:Envelope']['soap:Body'][0]['CreateResponse'][0]['Results'];
                    if(resData){
                        //console.log('StatusCode '+resData[0].StatusCode+'StatusMessage '+resData[0].StatusMessage);
                        res.status(200).send('creating Mailpath Queue '+resData[0].StatusMessage);
                    } else {
                        res.status(400).send('creating Mailpath Queue Some thing went wrong!');
                    }
                });
            })
            .catch(function (error) {
                console.log('Creating Mailpath Queue error '+error);
                res.status(500).send('Something went wrong for creating Mailpath Queue!!!'+error);
            });
        } else {
		    res.status(202).send('Already created Mailpath Queue');
	    }
    })
    .catch(function (error) {
        res.status(500).send('Something went wrong for checking Mailpath Queue available or not!!!'+error);
        console.log('Exist Mailpath Queue error '+error);
    });
};

//Saves activity record
exports.saveactivity = function (req,res){
    console.log("Save activity Body: " + JSON.stringify(req.body));
    console.log("Save activity Query: " + JSON.stringify(req.query));
    
    var values = req.body;
    
    var today = new Date();
    today = moment.tz(today, process.env.TZ);

    var insData = 
        {
            "Keys":{
                "ActivityName": values.summaryactivityname
            },
            "values":{
                "CreatedDate": today.format(),
                "JourneyID": values.journeyId,
                "MailClass": values.summarymailclass,
                "QueueSize": Number(values.summaryquantity),
                "ProductId": values.summaryproductid,
                "JourneyActive": false,
                "Frequency": values.summarycadence,
                "Conditional": values.summaryqueuerule,
                "ProductType":values.summaryproducttype    
            }
        };
    
    console.log('insData '+JSON.stringify(insData));
    console.log('token '+req.query.token);
    
    var config = {
        method: 'post',
        url: process.env.SfmcRestUrl+'hub/v1/dataevents/key:'+process.env.SfmcActivityDEExternalKey+'/rowset',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+req.query.token
        },
        data : insData
    };
        
    axios(config)
    .then(function (response) {
        res.status(200).send(response.data);

        sandyalexander.saveActivity(insData);


    })
    .catch(function (error) {
        console.log('insert rows error '+error);
        res.status(500).send(error);
    });
}

//validating MailPath folder
exports.createFolder = function (req, res) {
    
    var xml2js = require('xml2js');
    
    let soapMessage = '<?xml version="1.0" encoding="UTF-8"?>'
    +'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
    +'    <s:Header>'
    +'        <a:Action s:mustUnderstand="1">Retrieve</a:Action>'
    +'        <a:To s:mustUnderstand="1">'+process.env.SfmcSoapUrl+'Service.asmx</a:To>'
    +'        <fueloauth xmlns="http://exacttarget.com">'+req.body.token+'</fueloauth>'
    +'    </s:Header>'
    +'    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
    +'        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">'
    +'            <RetrieveRequest>'
    +'                <ObjectType>DataFolder</ObjectType>'
    +'                <Properties>ID</Properties>'
    +'                <Properties>CustomerKey</Properties>'
    +'                <Properties>Name</Properties>'
    +'                <Properties>ParentFolder.ID</Properties>'
    +'                <Properties>ParentFolder.Name</Properties>'
    +'                <Filter xsi:type="SimpleFilterPart">'
    +'                    <Property>Name</Property>'
    +'                    <SimpleOperator>equals</SimpleOperator>'
    +'                    <Value>MailPath Activity</Value>'
    +'                </Filter>'
    +'            </RetrieveRequest>'
    +'        </RetrieveRequestMsg>'
    +'    </s:Body>'
    +'</s:Envelope>';
    
    var dataconfig = {
      method: 'post',
      url: process.env.SfmcSoapUrl+'Service.asmx',
      headers: { 
        'Content-Type': 'text/xml'
      },
      data : soapMessage
    };
    
    axios(dataconfig)
    .then(function (response) {
        
        let rawdata = response.data;
        let resData;     
        var parser = new xml2js.Parser();
        parser.parseString(rawdata, function(err,result){
            resData = result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0]['Results'];
        });
        
        if(resData){
                res.status(200).send(resData[0].ID);
        } else {
            
            let folderData = '<?xml version="1.0" encoding="UTF-8"?>'
                +'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
                +'    <s:Header>'
                +'        <a:Action s:mustUnderstand="1">Retrieve</a:Action>'
                +'        <a:To s:mustUnderstand="1">'+process.env.SfmcSoapUrl+'Service.asmx</a:To>'
                +'        <fueloauth xmlns="http://exacttarget.com">'+req.body.token+'</fueloauth>'
                +'    </s:Header>'
                +'    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
                +'        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">'
                +'            <RetrieveRequest>'
                +'                <ObjectType>DataFolder</ObjectType>'
                +'                <Properties>ID</Properties>'
                +'                <Properties>CustomerKey</Properties>'
                +'                <Properties>Name</Properties>'
                +'                <Properties>ParentFolder.ID</Properties>'
                +'                <Properties>ParentFolder.Name</Properties>'
                +'                <Filter xsi:type="SimpleFilterPart">'
                +'                    <Property>Name</Property>'
                +'                    <SimpleOperator>equals</SimpleOperator>'
                +'                    <Value>Data Extensions</Value>'
                +'                </Filter>'
                +'            </RetrieveRequest>'
                +'        </RetrieveRequestMsg>'
                +'    </s:Body>'
                +'</s:Envelope>';
                
                var configData = {
                    method: 'post',
                    url: process.env.SfmcSoapUrl+'Service.asmx',
                    headers: { 
                        'Content-Type': 'text/xml'
                    },
                    data : folderData
                 };
                
                axios(configData)
                .then(function (response) {
                    
                    let rawdata1 = response.data;
                    let parentData;     
                    var parser = new xml2js.Parser();
                    parser.parseString(rawdata1, function(err,result){
                        parentData = result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0]['Results'];
                    });
                    
                    if(parentData){
                        
                        let createFolderData = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
                                 +'<soapenv:Header>'
                                 +'<fueloauth>'+req.body.token+'</fueloauth>'
                                 +'</soapenv:Header>'
                                 +'<soapenv:Body>'
                                 +'<CreateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">'
                                 +'<Options/>'
                                 +'<ns1:Objects xmlns:ns1="http://exacttarget.com/wsdl/partnerAPI" xsi:type="ns1:DataFolder">'
                                 +'<ns1:ModifiedDate xsi:nil="true"/>'
                                 +'<ns1:ObjectID xsi:nil="true"/>'
                                 +'<ns1:CustomerKey>MailPath Activity</ns1:CustomerKey>'
                                 +'<ns1:ParentFolder>'
                                 +'<ns1:ModifiedDate xsi:nil="true"/>'
                                 +'<ns1:ID>'+parentData[0]['ID']+'</ns1:ID>'
                                 +'<ns1:ObjectID xsi:nil="true"/>'
                                 +'</ns1:ParentFolder>'
                                 +'<ns1:Name>MailPath Activity</ns1:Name>'
                                 +'<ns1:Description>MailPath Activity Folder</ns1:Description>'
                                 +'<ns1:ContentType>dataextension</ns1:ContentType>'
                                 +'<ns1:IsActive>true</ns1:IsActive>'
                                 +'<ns1:IsEditable>true</ns1:IsEditable>'
                                 +'<ns1:AllowChildren>true</ns1:AllowChildren>'
                                 +'</ns1:Objects>'
                                 +'</CreateRequest>'
                                 +'</soapenv:Body>'
                                 +'</soapenv:Envelope>';
                        
                        var folderConfig = {
                            method: 'post',
                            url: process.env.SfmcSoapUrl+'Service.asmx',
                            headers: { 
                                'Content-Type': 'text/xml',
                                'SOAPAction': 'Create'
                            },
                            data : createFolderData
                        };
                        
                        axios(folderConfig)
                        .then(function (response) {
                            
                            let rawdata2 = response.data;
                            let resultData;     
                            var parser = new xml2js.Parser();
                            parser.parseString(rawdata2, function(err,result){
                                resultData = result['soap:Envelope']['soap:Body'][0]['CreateResponse'][0]['Results'];
                            });
                            
                            if(resultData){
                                res.status(200).send(resultData[0].NewID);
                            } else {
                                res.status(400).send('Some thing went wrong!');
                            }
                        })
                        .catch(function (error) {
                            console.log('Creating MailPath error '+error);
                            res.status(500).send('Something went wrong for creating MailPath folder!!!'+error);
                        });                        
                    }
                })
                .catch(function (error) {
                    console.log('Data Extension parent folder ID error :'+error);
                    res.status(500).send('Something went wrong for getting Data Extension parent folder ID!!!'+error);
                });
        }
    })
    .catch(function (error) {
        console.log('MailPath retrieve error '+error);
        res.status(500).send('Something went wrong for getting MailPath folder ID!!!'+error);
    });
    
};

//Retrieves Queue Status for Sandy sync(/QueueStatus endpoint)
exports.queuestatus = function (req, res){
 var optionsV1 = {
        auth: {
            // options you want passed when Fuel Auth is initialized
            clientId: process.env.SfmcClientId,
            clientSecret: process.env.SfmcClientSecret
        },
        uri: ''
    };
    
    var optionsV2 = {
        auth: {
            // options you want passed when Fuel Auth is initialized
            clientId: process.env.SfmcClientId,
            clientSecret: process.env.SfmcClientSecret,
            authVersion: Number(process.env.AuthVersion),
            authUrl: process.env.SfmcAuthUrl,
            authOptions:{
                authVersion: Number(process.env.AuthVersion)
            }
        },
        uri: ''
    };

    var activityName = req.query.activityName;

    var options = process.env.AuthVersion == "2" ? optionsV2 : optionsV1;
    options.uri = '/data/v1/customobjectdata/key/' + process.env.SfmcQueueDEExternalKey + '/rowset/';

    var RestClient = new FuelRest(options);

    RestClient.get(options)
        .then(response => {
            var count = 0;
            var jsonResults = response.body.items;    
            jsonResults.forEach(function(item, index){
                if(item.keys.activityname == activityName && item.values.status == "Queued"){
                    count = count + 1;
                }
            });
            res.status(200).json({
                "Activity Name" : activityName,
                "Records Queued" : count
            });           
        })
        .catch(err => console.log(err));
}

//Sandy sync(/Sync endpoint)
exports.sync = function (req, res){
    var optionsV1 = {
           auth: {
               // options you want passed when Fuel Auth is initialized
               clientId: process.env.SfmcClientId,
               clientSecret: process.env.SfmcClientSecret
           },
           uri: ''
       };
       
       var optionsV2 = {
           auth: {
               // options you want passed when Fuel Auth is initialized
               clientId: process.env.SfmcClientId,
               clientSecret: process.env.SfmcClientSecret,
               authVersion: Number(process.env.AuthVersion),
               authUrl: process.env.SfmcAuthUrl,
               authOptions:{
                   authVersion: Number(process.env.AuthVersion)
               }
           },
           uri: ''
       };
   
       var activityName = req.query.activityName;
   
       var options = process.env.AuthVersion == "2" ? optionsV2 : optionsV1;
       options.uri = '/data/v1/customobjectdata/key/' + process.env.SfmcActivityDEExternalKey + '/rowset/';
   
       var RestClient = new FuelRest(options);
   
       RestClient.get(options)
           .then(response => {
               var queueSize = 0;
               var activities = response.body.items;
                activities.forEach(function(activity, index){
                    if(activity.keys.activityname == activityName && activity.values.journeyactive == "True"){
                        queueSize = activity.values.queuesize;
                    }
                });
                retrieveQueue(activityName, queueSize).then(response => {
                    res.status(200).send("Sync Started for activity " + activityName);
                }).catch(err => res.status(400).send(err));                  
           })
           .catch(err => res.status(400).send(err));
   }

function insertActivitySfmcRecord(decoded, fn){
    var values = decoded.body;
    
    /*var clientID = [{ 
        ID: Number(process.env.accountID)
    }];

    var optionsV1 = {
        auth: {
        clientId: process.env.SfmcClientId, 
        clientSecret: process.env.SfmcClientSecret
        }
        , soapEndpoint: process.env.SfmcSoapUrl
        , clientIDs: clientID
    };

    var optionsV2 = {
    auth: {
        clientId: process.env.SfmcClientId, 
        clientSecret: process.env.SfmcClientSecret,
        authVersion: Number(process.env.AuthVersion),
        authUrl: process.env.SfmcAuthUrl+'v2/token/',
        authOptions:{
            authVersion: Number(process.env.AuthVersion)
        }
    }
    , soapEndpoint: process.env.SfmcSoapUrl+'/Service.asmx'
    };

    var options = process.env.AuthVersion == "2" ? optionsV2 : optionsV1;
    var client = new FuelSoap(options);

    var today = new Date();
    today = moment.tz(today, process.env.TZ);

    var co = {
        "CustomerKey": process.env.SfmcActivityDEExternalKey,
        "Keys":{
            "Key":[
                {"Name":"ActivityName","Value":values.summaryactivityname}
            ]
        },
        "Properties":[
            {"Property":
                [
                    {"Name":"CreatedDate","Value":today.format() },
                    {"Name":"JourneyID","Value": values.journeyId},
                    {"Name":"MailClass","Value":values.summarymailclass},
                    {"Name":"QueueSize","Value": Number(values.summaryquantity)},
                    {"Name":"ProductId","Value": values.summaryproductid},
                    {"Name":"JourneyActive","Value": false},
                    {"Name":"Frequency","Value": values.summarycadence},
                    {"Name":"Conditional","Value": values.summaryqueuerule},
                    {"Name":"ProductType","Value":values.summaryproducttype}
                ]
            }
        ]
    };

    var uo = {
        SaveOptions: [{"SaveOption":{PropertyName:"DataExtensionObject",SaveAction:"UpdateAdd"}}]
    };
    
    client.update('DataExtensionObject',co,uo, function(err, response){
        fn(err,response);
    });*/    
}

function createSyncRecord(record, fn){
    var co = record;
    
    var optionsV1 = {
        auth: {
        clientId: process.env.SfmcClientId, 
        clientSecret: process.env.SfmcClientSecret
        }
        , soapEndpoint: process.env.SfmcSoapUrl
    };

    var optionsV2 = {
    auth: {
        clientId: process.env.SfmcClientId, 
        clientSecret: process.env.SfmcClientSecret,
        authVersion: Number(process.env.AuthVersion),
        authUrl: process.env.SfmcAuthUrl,
        authOptions:{
            authVersion: Number(process.env.AuthVersion)
        }
    }
    , soapEndpoint: process.env.SfmcSoapUrl
    };

    var options = process.env.AuthVersion == "2" ? optionsV2 : optionsV1;
    var client = new FuelSoap(options);

    var uo = {
        SaveOptions: [{"SaveOption":{PropertyName:"DataExtensionObject",SaveAction:"UpdateAdd"}}]
    };
    
    client.update('DataExtensionObject',co,uo, function(err, response){
        fn(err,response);
    });
}

function retrieveQueue(activityName, queuesize){
    var activityName = activityName;
    var queueSize = queuesize;
    return new Promise(function(resolve,reject){
        var customerKey = process.env.SfmcQueueDEExternalKey;
    
        var optionsV1 = {
            auth: {
            clientId: process.env.SfmcClientId, 
            clientSecret: process.env.SfmcClientSecret
            }
            , soapEndpoint: process.env.SfmcSoapUrl
        };
    
        var optionsV2 = {
        auth: {
            clientId: process.env.SfmcClientId, 
            clientSecret: process.env.SfmcClientSecret,
            authVersion: Number(process.env.AuthVersion),
            authUrl: process.env.SfmcAuthUrl,
            authOptions:{
                authVersion: Number(process.env.AuthVersion)
            }
        }
        , soapEndpoint: process.env.SfmcSoapUrl
        };
    
        var options = process.env.AuthVersion == "2" ? optionsV2 : optionsV1;
        var client = new FuelSoap(options);
    
        var filter = {
            filter: {
                leftOperand: 'ActivityName',
                operator: 'equals',
                rightOperand: activityName
                }
          };
    
        var type = "DataExtensionObject[" + customerKey + "]";
        var props = ["ActivityName", "ContactKey", "MappedData", "Status"];
        
        client.retrieve(
            type,
            props,
            filter,
            function( err, response ) {
                if (err) {
                    console.log("error retrieving the queue:" + err);
                    reject(error);
                } else {
                    var count = 0;
                    var results = response.body.Results;
                    results.forEach(function(result, index){
                        var data = result.Properties.Property;
                        if(count <= queueSize && data[3].Value == "Queued"){
                            var queueItem = {
                                "CustomerKey": process.env.SfmcSyncDEExternalKey,
                                "Keys":{
                                    "Key":[
                                        {"Name":"ActivityName","Value":data[0].Value},
                                        {"Name":"ContactKey","Value":data[1].Value}
                                    ]
                                },
                                "Properties":[
                                    {"Property":
                                        [
                                            {"Name":"MappedData","Value":data[2].Value}
                                        ]
                                    }
                                ]
                            };

                            createSyncRecord(queueItem,function (err, res) {
                                if(err){
                                     console.log("Record not saved" + err);
                                } else {
                                     console.log("Record Saved");
                                }
                             });

                            count = count+1;
                        }
                    });
                    resolve(response);
                }
            });
    });
}