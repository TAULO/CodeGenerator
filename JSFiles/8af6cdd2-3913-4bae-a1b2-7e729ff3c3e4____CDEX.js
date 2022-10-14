import React, { Component } from 'react';
// import ReactJson from 'react-json-view';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Client from 'fhir-kit-client';
import { createToken } from '../components/Authentication';
import { Link } from 'react-router-dom';
import { send } from 'q';
import DocumentInput from '../components/DocumentInput';
import Loader from 'react-loader-spinner';
import { Input, Checkbox, IconGroup } from 'semantic-ui-react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { faCommentDollar } from '@fortawesome/free-solid-svg-icons';
import Moment from 'react-moment';
import moment from "moment";
import Dropzone from 'react-dropzone';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';





class CDEX extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.config,
            comm_req: [],
            patient: {},
            form_load: false,
            loading: false,
            patient_name: "",
            docs_required: [],
            sender_resource: '',
            sender_name: '',
            files: [],
            contentStrings: [],
            communicationRequest: {},
            searchParameter: '',
            documentReference: {},
            startDate: '',
            endDate: '',
            recievedDate: '',
            check: false,
            documentCheck: false,
            content: [],
            providerOrganization: {},
            payerOrganization: {},
            valueString: '',
            communicationPayload: [],
            documentContent: [],
            observationValuestring: '',
            extensionUrl: '',
            extValueCodableConcept: '',
            error: false,
            errorMsg: '',
            success: false,
            successMsg: '',
            documentList: [],
            selectedDocs: [],
            config: sessionStorage.getItem('config') !== undefined ? JSON.parse(sessionStorage.getItem('config')) : {},

        };
        this.goTo = this.goTo.bind(this);
        this.getCommunicationRequests = this.getCommunicationRequests.bind(this);
        this.displayCommunicataionRequests = this.displayCommunicataionRequests.bind(this);
        this.getPatientDetails = this.getPatientDetails.bind(this);
        this.getSenderDetails = this.getSenderDetails.bind(this);
        this.getSenderResource = this.getSenderResource.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.updateDocuments = this.updateDocuments.bind(this);
        this.onChangeSearchParameter = this.onChangeSearchParameter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDocumentChange = this.handleDocumentChange.bind(this);
        this.showError = this.showError.bind(this);
        this.onDocSelect = this.onDocSelect.bind(this);
        this.renderDocs = this.renderDocs.bind(this);


    }

    goTo(title) {
        window.location = window.location.protocol + "//" + window.location.host + "/" + title;
    }

    componentDidMount() {
        if (!sessionStorage.getItem('isLoggedIn')) {
            sessionStorage.setItem('redirectTo', "/cdex");
            this.props.history.push("/login");
        }
        this.displayCommunicataionRequests();
    }

    indexOfFile(file) {
        for (var i = 0; i < this.state.files.length; i++) {
            console.log(this.state.files[i].name, file.name, 'lets check')
            if (this.state.files[i].name === file.name) {
                return i;
            }

        }
        return -1;

    }

    onDrop(files) {

        let new_files = [];

        new_files = this.state.files;
        // new_files.concat(this.state.files);
        // let old_files= this.state.files;
        for (var i = 0; i < files.length; i++) {
            console.log(files[i], 'what file', JSON.stringify(this.state.files).indexOf(JSON.stringify(files[i])), this.state.files)
            if (this.indexOfFile(files[i]) === - 1) {
                console.log(this.indexOfFile(files[i]), i)
                new_files = this.state.files.concat(files);
            }
        }
        // if( this.state.files.every((value, index) => value !== files[index])){
        //     new_files= this.state.files.concat(files);
        //     console.log('includes')
        // }
        this.setState({ files: new_files }, () => {
            this.showError()
        });


    }
    onCancel(file) {
        let new_files = this.state.files;
        for (var i = 0; i < new_files.length; i++) {
            if (new_files[i] === file) {
                new_files.splice(i, 1);
            }
        }
        this.setState({
            files: new_files
        });
    }
    onRemove(file) {
        var new_files = this.state.files;
        for (var i = 0; i < new_files.length; i++) {
            if (new_files[i] === file) {
                new_files.splice(i, 1);
            }
        }
        this.setState({ files: new_files }, () => {
            this.showError()
        })
    }
    async getCommunicationRequests() {
        if(this.state.config!==null){

        
        var tempUrl = this.state.config.provider_fhir_url;
        let headers = {
            "Content-Type": "application/json",
        }
        // const token = await createToken(this.state.config.provider_grant_type, 'provider', sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        // console.log(token, 'token')
        // if (this.state.config.provider_authorised) {
        //     console.log('The token is : ', token, tempUrl);
        //     headers['Authorization'] = 'Bearer ' + token
        // }
        const fhirResponse = await fetch(tempUrl + "/CommunicationRequest?_count=100000", {
            method: "GET",
            headers: headers
        }).then(response => {
            // console.log("Recieved response", response);
            return response.json();
        }).then((response) => {
            // console.log("----------response", response);
            return response;
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        return fhirResponse;
        }
    }

    async displayCommunicataionRequests() {
        let resources = [];
        let resp = await this.getCommunicationRequests();
        // console.log("resp------", resp);
        if (resp != undefined) {
            if (resp.entry != undefined) {
                Object.keys(resp.entry).forEach((key) => {
                    if (resp.entry[key].resource != undefined) {
                        if (resp.entry[key].resource.hasOwnProperty('payload')) {
                            if (resp.entry[key].resource.payload[0].extension[0].hasOwnProperty('valueCodeableConcept')) {
                                if (resp.entry[key].resource.payload[0].extension[0].valueCodeableConcept.coding[0].code !== 'pcde') {
                                    resources.push(resp.entry[key].resource);
                                }
                            }
                        }
                    }
                });
            }
        }
        else {
            console.log('no communications')
        }

        // console.log("-------", resources);
        this.setState({ comm_req: resources });
    }

    async getPatientDetails(patient_id, communication_request, identifier) {
        this.setState({ patient_name: "" });
        this.setState({ sender_resource: "" });
        this.setState({ sender_name: "" });
        this.setState({ observationList: [] });
        this.setState({ check: false });
        this.setState({ content: [] });
        this.setState({ documentContent: [] });
        this.setState({ communicationPayload: [] })
        this.setState({ observationValuestring: '' })
        this.setState({ extensionUrl: '' })
        this.setState({ extValueCodableConcept: '' })
        this.setState({ error: false })
        this.setState({ success: false })
        this.setState({ documentList: [] })
        this.setState({ files: [] })

        // let f = this.state.files;
        // f = null;
        // this.setState({ files: f });
        // console.log(this.state.files)
        var tempUrl = this.state.config.provider_fhir_url + "/" + patient_id;
        let token 
        // token= await createToken(this.state.config.provider_grant_type, 'provider', sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        let headers = {
            "Content-Type": "application/json",
        }
        // if (this.state.config.provider_authorised) {
        //     headers['Authorization'] = 'Bearer ' + token
        // }
        let patient = await fetch(tempUrl, {
            method: "GET",
            headers: headers
        }).then(response => {
            return response.json();
        }).then((response) => {
            // console.log("----------response", response);
            let patient = response;
            console.log("patient---", patient);
            if (patient) {
                this.setState({ patient: patient });
                if (patient.hasOwnProperty("name")) {
                    var name = '';
                    if (patient['name'][0].hasOwnProperty('given')) {
                        // patient['name'][0]['given'].map((n) => {
                        //     name += ' ' + n;
                        // });

                        name = patient['name'][0]['given'][0] + " " + patient['name'][0]['family'];
                        console.log("name---" + name);
                        this.setState({ patient_name: name })
                    }
                }
                console.log("patient name----------", this.state.patient_name, this.state.patient.resourceType + "?identifier=" + this.state.patient.identifier[0].value);
            }
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        // console.log("patient---", patient);
        // if (patient) {
        //     this.setState({ patient: patient });
        //     if (patient.hasOwnProperty("name")) {
        //         var name = '';
        //         if (patient['name'][0].hasOwnProperty('given')) {
        //             // patient['name'][0]['given'].map((n) => {
        //             //     name += ' ' + n;
        //             // });

        //             name = patient['name'][0]['given'][0] + patient['name'][0]['family'];
        //             console.log("name---"+name);
        //             this.setState({ patient_name: name })
        //         }
        //     }
        //     // console.log("patient name----------", this.state.patient_name);
        // }
        // console.log("state patient-------", this.state.patient);
        if (communication_request.hasOwnProperty('sender')) {
            let s = await this.getSenderDetails(communication_request, token);
        }
        if (communication_request.hasOwnProperty('payload')) {
            await this.getDocuments(communication_request['payload']);
        }
        if (communication_request.hasOwnProperty('occurrencePeriod')) {
            // await this.getDocuments(communication_request['payload']);
            this.setState({ startDate: communication_request.occurrencePeriod.start })
            this.setState({ endDate: communication_request.occurrencePeriod.end })
        }
        if (communication_request.hasOwnProperty('authoredOn')) {
            this.setState({ recievedDate: communication_request.authoredOn })
        }
        this.setState({ communicationRequest: communication_request });
        // communication_request.payload.map(async (p)=>{
        //     if(p.hasOwnProperty('extension')){
        //         console.log(p,'pp')
        //         if(p.extension[0].hasOwnProperty('valueString')){
        //             console.log('here-123')
        //             await this.getObservationDetails(p.extension[0].valueString);
        //         }

        //     }
        // })

        await this.getObservationDetails().then(() => {
            // this.showError()
        })

        // await this.getClinicalNoteDetails()


        this.setState({ form_load: true });
    }
    randomString() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomstring = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        return randomstring
    }
    async getDocuments(payload) {
        let strings = [];
        payload.map((c) => {
            // console.log("ccccccc", c);
            // if (c.hasOwnProperty('contentReference')) {
            //     if (c['contentReference']['reference'].replace('#', '')) {

            //     }
            // }
            // if (c.hasOwnProperty('extension')) {
            //     strings.push(c.extension[0]['valueCodeableConcept']['coding'][0]['display']);
            // }
            if (c.hasOwnProperty('contentString')) {
                strings.push(c.contentString)
            }
            this.setState({ contentStrings: strings })
        });


    }
    async showError() {
        if (this.state.documentList.length == 0 && this.state.files.length === 0) {
            this.setState({ error: true });
            this.setState({ errorMsg: "No Documents Found!!" })
        }
        else {
            this.setState({ error: false });

        }

    }
    async getObservationDetails() {
        // let searchParameter = this.state.searchParameter;
        // console.log(searchParameter,'search')
        let communicationRequest = this.state.communicationRequest
        let payload = communicationRequest.payload
        let code;
        let patientId = communicationRequest.subject.reference
        let dateParameter;
        let valueString;
        payload.map(async (p) => {
            if (p.hasOwnProperty('extension')) {
                let communicationPayload = this.state.communicationPayload
                if (p['extension'][0].hasOwnProperty('valueString')) {
                    valueString = p['extension'][0]['valueString'];
                    console.log(valueString, 'vallll')
                    var Url;
                    if ((valueString === 'Practitioner') || (valueString === 'Organization') || (valueString === 'SupplyRequest')) {
                        Url = this.state.config.provider_fhir_url + "/" + valueString;
                    }
                    else {
                        Url = this.state.config.provider_fhir_url + "/" + valueString + "&patient=" + this.state.patient.id;
                    }
                    // Url  = this.state.config.provider_fhir_url + "/"+valueString;
                    // if(valueString)
                    console.log(Url, 'url')

                    var extensionUrl = p['extension'][0].url
                    console.log(p['extension'][0].url, 'teeee')
                    // const token = await createToken(this.state.config.provider_grant_type, 'provider', sessionStorage.getItem('username'), sessionStorage.getItem('password'));
                    let headers = {
                        "Content-Type": "application/json",
                    }
                    // if (this.state.config.provider_authorised) {
                    //     headers['Authorization'] = 'Bearer ' + token
                    // }
                    let dataResult = await fetch(Url, {
                        method: "GET",
                        headers: headers
                    }).then(response => {
                        console.log(response, 'the reposnse')
                        return response.json();
                    }).then((response) => {
                        // console.log("----------response", response);
                        if (response.hasOwnProperty('entry')) {
                            return response
                        }
                        // console.log(response,'res')
                    }).catch(reason =>
                        console.log("No response recieved from the server", reason)
                    );
                    console.log(dataResult, 'dataResult')
                    var encoded = btoa(JSON.stringify(dataResult))
                    console.log(encoded, 'base64')
                    // let communicationPayload = this.state.communicationPayload

                    communicationPayload.push({
                        "extension": p['extension'],
                        "contentAttachment": {
                            "contentType": "application/json",
                            "data": encoded
                        }
                    })


                }
                else if (p['extension'][0].hasOwnProperty('valueCodeableConcept')) {
                    var extensionUrl = p['extension'][0]['url']
                    var code = p['extension'][0]['valueCodeableConcept'].coding[0].code;
                    var searchString = "?type=" + code + "&patient=" + this.state.patient.id
                    var Url = this.state.config.provider_fhir_url + "/DocumentReference" + searchString;
                    // var Url=''
                    // const token = await createToken(this.state.config.provider_grant_type, 'provider', sessionStorage.getItem('username'), sessionStorage.getItem('password'));
                    let headers = {
                        "Content-Type": "application/json",
                    }
                    // if (this.state.config.provider_authorised) {
                    //     headers['Authorization'] = 'Bearer ' + token
                    // }
                    let documents = await fetch(Url, {
                        method: "GET",
                        headers: headers
                    }).then(response => {
                        console.log(response)
                        return response.json();
                    }).then((response) => {
                        if (response.hasOwnProperty('entry')) {
                            return response
                        }
                    }).catch(reason =>
                        console.log("No response recieved from the server", reason)
                    );

                    if (documents !== undefined) {
                        if ("entry" in documents) {
                            documents.entry.map((documentObj) => {
                                // let documentList = this.state.documentList
                                // documentList.push(document)
                                documentObj.payload_value = {
                                    "extension": p['extension'],
                                    "contentAttachment": {
                                        'contentType': documentObj.resource.content[0].attachment.contentType,
                                        'data': documentObj.resource.content[0].attachment.data
                                    }
                                }
                                this.setState(prevState => ({
                                    documentList: [...prevState.documentList, documentObj]
                                }))
                                // communicationPayload.push({
                                //     "extension":p['extension'],
                                //     "contentAttachment":{
                                //         'contentType':document.resource.content[0].attachment.contentType,
                                //         'data':document.resource.content[0].attachment.data
                                //     }
                                // })
                            })
                        }
                    }


                }
                console.log('doclist', this.state.documentList)
                console.log(communicationPayload, 'police station')

                this.setState({ communicationPayload: communicationPayload }, () => {
                    this.showError();
                })


            }
        })
        // await this.showError()
    }


    onDocSelect(event) {

        console.log("event --", event, event.target, this.state.selectedDocs);
        let val = event.target.name;
        let selectedDocs = [...this.state.selectedDocs]
        let valueIndex = this.state.selectedDocs.indexOf(val)
        if (valueIndex == -1) {

            selectedDocs.push(val);

        }
        else {
            selectedDocs.splice(valueIndex, 1)
        }
        this.setState({ selectedDocs: selectedDocs })

    }

    renderDocs(item, key) {
        let resource = item.resource
        return (<div key={key}>
            <div key={key} style={{ padding: "15px", paddingTop: "0px", paddingBottom: "0px" }}>
                <label>
                    <input type="checkbox" name={resource.id}
                        onChange={this.onDocSelect} />
                </label>

                <span style={{ lineHeight: "0.1px" }}>{resource.type.coding[0].code + " - " + resource.type.coding[0].display + '  dated- ' + moment(resource.date).format(" YYYY-MM-DD")}</span>

            </div>
        </div>
        )
    }
    // async getClinicalNoteDetails() {
    //     // let searchParameter = this.state.searchParameter;
    //     // console.log(searchParameter,'search')
    //     let communicationRequest = this.state.communicationRequest
    //     let payload=communicationRequest.payload
    //     let patientId = communicationRequest.subject.reference
    //     let dateParameter;
    //     payload.map(async (p)=>{
    //         if(p.hasOwnProperty('extension')){
    //             if(p['extension'][0].hasOwnProperty('valueCodeableConcept')){
    //                 console.log(p['extension'][0]['url'],'urlle')
    //                 var code = p['extension'][0]['valueCodeableConcept'].coding[0].code;
    //                 console.log(code,'vallll')
    //                 console.log(p['contentString'],'yo whts goin on ')
    //                 var string = p['contentString'].split('during ')
    //                 console.log(string,'string')
    //                 var dates = string[1].split(" - ")
    //                 console.log(dates,'dates')
    //                 var searchString = "?type="+code+"&patient.identifier="+this.state.patient.identifier[0].value+"&period=gt"+dates[0]+"&period=lt"+dates[1]
    //                 console.log(searchString,'searchstring')
    //                 var Url  = this.state.config.provider_fhir_url + "/DocumentReference"+searchString;
    //                 // var Url=''
    //                 const token = await createToken(this.state.config.provider_grant_type,'provider',sessionStorage.getItem('username'), sessionStorage.getItem('password'));
    //                 let headers = {
    //                     "Content-Type": "application/json",
    //                 }
    //                 if(this.state.config.provider_authorised){
    //                     headers['Authorization'] = 'Bearer ' + token
    //                 }
    //                 let documents = await fetch(Url, {
    //                     method: "GET",
    //                     headers: headers
    //                 }).then(response => {
    //                     console.log(response)
    //                     return response.json();
    //                 }).then((response) => {
    //                     // console.log("----------response", response);
    //                     if (response.hasOwnProperty('entry')) {
    //                         return response
    //                     }
    //                     // console.log(response,'res')
    //                 }).catch(reason =>
    //                     console.log("No response recieved from the server", reason)
    //                 );
    //                 console.log(documents, 'documents')

    //                 let documentList = this.state.documentList
    //                 if(documents !== undefined ){
    //                     if ("entry" in documents) {
    //                         documents.entry.map((document) => {
    //                                 // observation['valueString']=valueString
    //                             // if (observationList.indexOf(observation.resource) == -1) {
    //                             //     observationList.push(observation.resource)
    //                             // }
    //                             documentList.push({
    //                                 "extension":p['extension'],
    //                                 "document":document.resource
    //                             })
    //                         })
    //                     }
    //                 }
    //                 console.log(documentList,'documentList')
    //                 // // observationList.push(observations)
    //                 this.setState({documentList:documentList})
    //                 // this.setState({valueString:valueString})
    //                 // this.setState()
    //             }
    //             else{
    //                 console.log('no Documents found')
    //             }   
    
    //         }
    //         // console.log(observationList,'ooo')
    //     })
    // }


    startLoading() {
        this.setState({ loading: true }, () => {
            if (!this.state.error) {
                this.submit_info();
            }
        })
    }

    async UpdateCommunicationRequest() {
        let headers = {
            "Content-Type": "application/json",
        }
        let comm_req = this.state.communicationRequest
        comm_req.status = 'completed'
        console.log(this.state.communicationRequest, 'what value')
        this.setState({ communicationRequest: comm_req })
        // const token = await createToken(this.state.config.payer_grant_type, 'payer', sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        // if (this.state.config.payer_authorised) {
        //     headers['Authorization'] = 'Bearer ' + token
        // }
        // var communicationUrl = '';
        var url = this.state.config.provider_fhir_url + "/CommunicationRequest/" + this.state.communicationRequest.id;

        let Communication = await fetch(url, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(this.state.communicationRequest)
        }).then(response => {
            return response.json();
        }).then((response) => {
            console.log(response, 'yes its working')
        }
        )

    }

    async submit_info() {
        let randomString = this.randomString()
        let fullUrl = this.randomString()
        let communicationRequest = this.state.communicationRequest;
        console.log(this.state.communicationRequest, 'submitted', communicationRequest.sender.reference)
        // let communicationRequestJson = {};
        let doc_ref = {};
        console.log(this.state.payerOrganization, this.state.providerOrganization)
        var date = new Date()
        var authoredOn = date.toISOString()
        // console.log(authoredOn,communicationRequest.occurrencePeriod,'timeeee')
        let communicationPayload = this.state.communicationPayload
        this.state.documentList.forEach((doc) => {
            let docIndex = this.state.selectedDocs.indexOf(doc.resource.id)
            if (docIndex > -1) {
                communicationPayload.push(doc.payload_value)
            }
        })
        // console.log("Commm PAYYYLOADDd !!!",communicationPayload);
        if (this.state.files != null) {
            for (var i = 0; i < this.state.files.length; i++) {
                (function (file) {
                    let content_type = file.type;
                    let file_name = file.name;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        // get file content  
                        communicationPayload.push({
                            "extension": [
                                {
                                    "url": "http://hl7.org/fhir/us/davinci-cdex/StructureDefinition/cdex-payload-clinical-note-type",
                                    "valueCodeableConcept": {
                                        "coding": [
                                            {
                                                "system": "http://loinc.org",
                                                "code": "11503-0"
                                            }
                                        ]
                                    }
                                }
                            ],
                            "contentAttachment": {
                                'contentType': content_type,
                                'data': reader.result
                            }
                        })
                    }
                    reader.readAsBinaryString(file);
                })(this.state.files[i])
            }
        }
        // this.setState({documentList:communicationPayload},() =>{
        //     this.showError()
        // })
        this.setState({ communicationPayload: communicationPayload })
        var commJson = {
            "resourceType": "Bundle",
            "type": "transaction",
            "entry": [{
                "fullUrl": "urn:uuid:" + fullUrl,
                "resource": {
                    "resourceType": "Communication",
                    "status": "completed",
                    "subject": {
                        "reference": this.state.patient.resourceType+"?identifier="+this.state.patient.identifier[0].value
                        // 'reference': "Patient?given=" + this.state.patient.name[0].given[0] + "&family=" + this.state.patient.name[0].family + "&address-postalcode=" + this.state.patient.address[0].postalCode + "&birthdate=" + this.state.patient.birthDate
                    },
                    // "recipient": [
                    //     {
                    //         "reference": this.state.payerOrganization.resourceType+"?identifier="+this.state.payerOrganization.identifier[0].value
                    //     }
                    // ],
                    // "sender": {
                    //     "reference": this.state.providerOrganization.resourceType+"?identifier="+this.state.providerOrganization.identifier[0].value                
                    // },
                    "occurrencePeriod": communicationRequest.occurrencePeriod,
                    "authoredOn": authoredOn,
                    "category": communicationRequest.category,
                    // "contained": communicationRequest.contained,
                    "basedOn": [
                        {
                            'reference': this.state.communicationRequest.resourceType + "?identifier=" + this.state.communicationRequest.identifier[0].value
                        }
                    ],
                    "identifier": [
                        {
                            "system": "http://www.providerco.com/communication",
                            "value": randomString
                        }
                    ],
                    "payload": this.state.communicationPayload
                },
                "request": {
                    'method': "POST",
                    "url": "Communication"
                }
            }

            ]
        }

        console.log(this.state.patient.id, 'iddd', communicationRequest)
        // let content = this.state.content;
        // let objJsonStr = JSON.stringify(this.state.observationList);
        // let objJsonB64 = Buffer.from(objJsonStr).toString("base64");
        // console.log(objJsonB64)
        // fileInputData.payload.push({
        //                 'extension': {'url':this.state.extensionUrl,'valueString':content.extension[0].valueString},
        //                 'cdex-payload-query-string': {'url':this.state.extensionUrl,'extension':content.extension,'valueString':content.extension[0].valueString},
        //                 "contentAttachment":{
        //                     "contentType":"application/json",
        //                     "data":objJsonB64
        //                 }})
        // commJson.entry[0].
        // for (var j = 0; j < this.state.content.length; j++) {
        //     (function (content) {
        //         // let url = observationList[j];
        //         console.log(content,'content',content.extension)
        //         fileInputData.payload.push({
        //             'extension': content.extension,
        //             'cdex-payload-query-string': {'url':content.extension[0].url,'extension':content.extension,'valueString':content.extension[0].valueString},
        //             "contentString":content.contentString})
        //     })(this.state.content[j])
        // }


        // for (var j = 0; j < this.state.documentContent.length; j++) {
        //     (function (content) {
        //         // let url = observationList[j];
        //         console.log(content,'content',content)
        //         fileInputData.payload.push({
        //             'extension': content.extension,
        //             'cdex-payload-clinical-string': {'url':content.extension[0].url,'extension':content.extension,'valueCodeableConcept':content.extension[0].valueCodeableConcept},
        //             "contentAttachment":content.contentAttachment})
        //     })(this.state.documentContent[j])
        // }


        // if (this.state.files != null) {
        //     for (var i = 0; i < this.state.files.length; i++) {
        //         (function (file) {
        //             let content_type = file.type;
        //             let file_name = file.name;
        //             var reader = new FileReader();
        //             reader.onload = function (e) {
        //                 // get file content  
        //                 fileInputData.payload.push({
        //                     // "cdex-payload-query-string":"",
        //                     //  "cdex-payload-clinical-note-type":[],
        //                     "content": {
        //                         "data": reader.result,
        //                         "contentType": content_type,
        //                         "title": file_name
        //                     }
        //                 })
        //             }
        //             reader.readAsBinaryString(file);
        //         })(this.state.files[i])
        //     }
        // }
        // console.log("Resource Json before communication--", fileInputData);
        let headers = {
            "Content-Type": "application/json",
        }
        // const token = await createToken(this.state.config.payer_grant_type, 'payer', sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        // if (this.state.config.payer_authorised) {
        //     headers['Authorization'] = 'Bearer ' + token
        // }
        // var communicationUrl = '';
        var communicationUrl = this.state.config.payer_fhir_url;

        let Communication = await fetch(communicationUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(commJson)
        }).then(response => {
            return response.json();
        }).then((response) => {
            console.log("----------response123", response);
            this.setState({ loading: false });
            this.UpdateCommunicationRequest();
            if (response.hasOwnProperty('entry')) {
                let communicaationId = response.entry[0].response.location.split('/')[1]

                this.setState({ success: true })
                this.setState({ successMsg: 'CLinical Document has been posted  successfully with id - ' + communicaationId })
                // NotificationManager.success('Communication has been posted to payer successfully.', 'Success');
                return response
            }

            // this.setState({response})
            console.log(response, 'res')
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );



        // this.props.saveDocuments(this.props.files,fileInputData)
        this.setState({ communicationJson: commJson })

    }
    onChangeSearchParameter(event) {
        let searchParameter = this.state.searchParameter;
        searchParameter = event.target.value
        this.setState({ searchParameter: searchParameter });
        this.getObservationDetails();
    }
    handleChange(obs, event) {
        let observation = obs.observation
        let check = this.state.check;
        let value;
        console.log(event.target.checked, "is it true")
        check = event.target.checked
        this.setState({ check: check });
        value = observation.code.coding[0].display + ": " + observation.valueQuantity.value + " " + observation.valueQuantity.unit

        // this.state.observationList.map((observation)=>{
        //     value = observation.valueQuantity.value +observation.valueQuantity.unit
        //     if (content.indexOf(value) == -1) {
        //         content.push(value)
        //     }
        // })
        let content = this.state.content;
        if (check == true) {
            content.push({
                "extension": obs.extension,
                "contentString": value
            })
        }
        else {
            for (var i = 0; i < content.length; i++) {
                console.log(content.hasOwnProperty('value'), 'check')
                if (content[i].hasOwnProperty('contentString') && content[i].contentString == value) {
                    console.log(content[i])
                    content.splice(i, 1)
                }
            }
        }
        console.log(content, 'content')
        this.setState({ content: content })


        // if(obs.hasOwnProperty('value')== false && check == true){
        //     // content.push(value)
        //     obs['value'] = value
        // }
        // else {
        //     var index = content.indexOf(value);
        //     if (obs.hasOwnProperty('value') === true){
        //         // content.splice(index, 1);
        //         delete obs['value']
        //     }
        //     // content.pop(value)
        // }
        // console.log(obs,'new checked observation')
        // this.setState({content:content})


    }

    handleDocumentChange(docs, event) {
        let document = docs.document
        let documentCheck = this.state.documentCheck;
        let value;
        console.log(event.target.checked, "is it true")
        documentCheck = event.target.checked
        this.setState({ documentCheck: documentCheck });
        let content = this.state.documentContent;
        let data = document.content[0].attachment.data

        console.log('doc', docs)
        if (documentCheck == true) {
            content.push({
                "extension": docs.extension,
                "contentAttachment": {
                    "contentType": document.content[0].attachment.contentType,
                    "data": document.content[0].attachment.data,
                    "title": document.content[0].attachment.title
                }
            })
        }
        else {
            for (var i = 0; i < content.length; i++) {
                console.log(content.hasOwnProperty('value'), 'check')
                if (content[i].hasOwnProperty('contentAttachment') && content[i].contentAttachment.data == data) {
                    console.log(content[i])
                    content.splice(i, 1)
                }
            }
        }
        console.log(content, 'content-111111111')
        this.setState({ documentContent: content })

    }
    updateDocuments(elementName, object) {
        this.setState({ [elementName]: object })
    }
    async getSenderDetails(communication_request, token) {
        let sender_obj;
        let senderreference;
        let recipientReference;
        if (communication_request.hasOwnProperty('sender')) {
            senderreference = communication_request.sender.reference
        }
        if (communication_request.hasOwnProperty('recipient')) {
            recipientReference = communication_request.recipient[0].reference
        }
        // communication_request['contained'].map((c) => {
        //     if (c['id'] == communication_request['sender']['reference'].replace('#', '')) {
        //         // console.log("------------sender", c);
        //         sender_obj = c;
        //     }
        // });
        var tempUrl = this.state.config.provider_fhir_url;
        // const token = await createToken(sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        let headers = {
            "Content-Type": "application/json",
        }
        // if (this.state.config.provider_authorised) {
        //     headers['Authorization'] = 'Bearer ' + token
        // }
        const fhirResponse = await fetch(tempUrl + "/" + senderreference, {
            method: "GET",
            headers: headers
        }).then(response => {
            console.log("Recieved response", response);
            return response.json();
        }).then((response) => {
            console.log("----------response", response);
            return response;
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        // return fhirResponse;
        console.log(fhirResponse, 'respo')
        if (fhirResponse) {
            this.setState({ payerOrganization: fhirResponse })
            this.setState({ sender_name: fhirResponse.name });
            // this.setState({ sender_resource: fhirResponse['resourceType'] });
            // const sender_res = await this.getSenderResource(sender_obj);
            // if (sender_res['resourceType'] == 'Patient' || sender_res['resourceType'] == 'Practitioner') {
            //     if (sender_res.hasOwnProperty("name")) {
            //         var sender_name = '';
            //         if (sender_res['name'][0].hasOwnProperty('given')) {
            //             sender_res['name'][0]['given'].map((n) => {
            //                 sender_name += ' ' + n;
            //             });
            //             this.setState({ sender_name: sender_name });
            //         }
            //     }
            // }
            // else 
            // if (sender_obj['resourceType'] === 'Organization') {
            //     if (sender_obj.hasOwnProperty("identifier")) {
            //         let sender = sender_obj['identifier'][0]['value'];
            //         this.setState({ sender_name:  sender});
            //     }
            // }
            // console.log("sender['name']", this.state.sender_name);
        }
        const recipientResponse = await fetch(tempUrl + "/" + recipientReference, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // 'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            console.log("Recieved response", response);
            return response.json();
        }).then((response) => {
            console.log("----------response", response);
            return response;
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        // return fhirResponse;
        console.log(recipientResponse, 'rest')
        if (fhirResponse) {
            this.setState({ providerOrganization: recipientResponse })
        }


    }

    async getSenderResource(c) {
        var sender_url = this.state.config.provider_fhir_url + "/" + c['resourceType'] + "?identifier=" + c['identifier'][0]['value'];
        console.log("url---------", sender_url);
        // const token = await createToken(this.state.config.provider_grant_type, 'provider', sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        let headers = {
            "Content-Type": "application/json",
        }
        // if (this.state.config.provider_authorised) {
        //     headers['Authorization'] = 'Bearer ' + token
        // }
        let sender = await fetch(sender_url, {
            method: "GET",
            headers: headers
        }).then(response => {
            return response.json();
        }).then((response) => {
            console.log("----------response", response);
            if (response.hasOwnProperty('entry')) {
                if (response['entry'][0].hasOwnProperty('resource')) {
                    return response['entry'][0]['resource'];
                }
            }
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        return sender;
    }

    render() {
        let data = this.state.comm_req;
        const files = this.state.files.map(file => (
            <div className='file-block' key={file.name}>
                <a onClick={() => this.onRemove(file)} className="close-thik" />
                {file.name}
            </div>
        ))
        console.log(data, 'how may')
        let content = data.map((d, i) => {
            // console.log(d, i);
            if (d['status'] === 'active') {
                let startDate
                let endDate;
                // console.log(d['occurrencePeriod'])
                if (d['occurrencePeriod'] != undefined) {
                    if (d['occurrencePeriod'].hasOwnProperty("start")) {
                        startDate = d["occurrencePeriod"]['start']
                    }
                    if (d['occurrencePeriod'].hasOwnProperty("end")) {
                        endDate = d["occurrencePeriod"]['end']
                    }
                    else {
                        endDate = "No End Date"
                    }
                }
                else {
                    startDate = false
                    endDate = false
                }


                let recievedDate = d["authoredOn"]
                // console.log(startDate.substring(0,10),'stdate')
                if (d.hasOwnProperty("subject")) {
                    let patientId = d['subject']['reference'];
                    // let patient_obj = d['contained'].map((c) => {
                    //     if (c.hasOwnProperty('id')) {
                    //         if (c['id'] == d['subject']['reference'].replace('#', '')) {
                    //             patientId = c['identifier'][0]['value'];
                    //         }
                    //     }
                    // })
                    if (startDate && endDate) {
                        return (
                            <div key={i} className="main-list">
                                {i + 1}.  {d['resourceType']} (#{d['id']}) for {patientId} Start Date ({startDate.substring(0, 10)}),End Date({endDate.substring(0, 10)}), Recieved On ({recievedDate.substring(0, 10)})
                            <button className="btn list-btn" onClick={() => this.getPatientDetails(patientId, d, patientId)}>
                                    Review</button>
                            </div>
                        )
                    }

                }
            }
        });
        let requests = this.state.contentStrings.map((request, key) => {
            if (request) {
                return (
                    <div key={key}>
                        {request}
                    </div>
                )

            }
        });
        // let observations = this.state.observationList.map((observation, key) => {
        //     if (observation) {
        //         return (
        //             <div key={key}>
        //                 <div className='data-label1'>
        //                 {observation.observation.code.coding[0].display+" : "}<span className="data2">{observation.observation.valueQuantity.value+" "+observation.observation.valueQuantity.unit}</span>
        //                     <span>
        //                         <input 
        //                             className='ui checkbox'
        //                             name = {key}
        //                             type="checkbox"
        //                             defaultChecked={this.state.check}
        //                             value={this.state.check}
        //                             onChange={(e)=>this.handleChange(observation,e)}
        //                         />
        //                     </span>
        //                 </div>
        //                 {/* <label for="ui checkbox">  {observation.observation.code.coding[0].display+":"}{observation.observation.valueQuantity.value+" "+observation.observation.valueQuantity.unit}</label> */}

        //             </div>
        //         )

        //     }
        // });
        // let documents = this.state.documentList.map((document, key) => {
        //     if (document) {
        //         console.log('document,doc',document.document)
        //         var label =  document.document.type.coding[0].display+" : "
        //         var value = document.document.description+document.document.context.period.start.substring(0,10)+" - "+document.document.context.period.end.substring(0,10)
        //         return (
        //             <div key={key}>
        //                 <div className="data-label1">
        //                     {document.document.type.coding[0].display+" : "}<span className="data2">{document.document.description+","+"  Status - "+document.document.status+","+"  Time Period - "+document.document.context.period.start.substring(0,10)+" - "+document.document.context.period.end.substring(0,10)}</span>
        //                     <span><input 
        //                     className='ui checkbox'
        //                     name = {key}
        //                     type="checkbox"
        //                     defaultChecked={this.state.documentCheck}
        //                     value={this.state.documentCheck}
        //                     onChange={(e)=>this.handleDocumentChange(document,e)}

        //                 /></span></div>

        //             </div>
        //         )

        //     }
        // });
        return (

            <React.Fragment>
                <div>
                    <header id="inpageheader">
                        <div className="container">

                            <div id="logo" className="pull-left">
                                <h1><a href="#intro" className="scrollto">Beryllium</a></h1>
                                {/* <a href="#intro"><img src={process.env.PUBLIC_URL + "/assets/img/logo.png"} alt="" title="" /></a> */}
                            </div>

                            <nav id="nav-menu-container">
                                <ul className="nav-menu">
                                    <li><a href={window.location.protocol + "//" + window.location.host + "/home"}>Home</a></li>
                                    <li className="menu-active menu-has-children"><a href="">Services</a>
                                        <ul>
                                            <li className="menu-active"><a href={window.location.protocol + "//" + window.location.host + "/provider_request"}>Prior Auth Submit</a></li>
                                            <li><a href={window.location.protocol + "//" + window.location.host + "/mips"}>MIPS Score</a></li>
                                            <li><a href={window.location.protocol + "//" + window.location.host + "/care_gaps"}>Gaps in care</a></li>
                                            <li><a href={window.location.protocol + "//" + window.location.host + "/cdex"}>Submit Clinical Documents</a></li>
                                        </ul>
                                    </li>
                                    <li><a href={window.location.protocol + "//" + window.location.host + "/configuration"}>Configuration</a></li>
                                    <li className="menu-has-children"><a href="">{sessionStorage.getItem('username')}</a>
                                        <ul>
                                            <li><a href="" onClick={this.onClickLogout}>Logout</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </header>
                    {/* <div>
                        <div className="main_heading">
                            <span style={{ lineHeight: "35px" }}>PILOT INCUBATOR - CDEX</span>
                            <div className="menu_conf" onClick={() => this.goTo('provider_request')}>
                                <i style={{ paddingLeft: "5px", paddingRight: "7px" }} className="fa fa-home"></i>
                                Home</div>
                            <div className="menu_conf" onClick={() => this.goTo('configuration')}>
                                <i style={{ paddingLeft: "5px", paddingRight: "7px" }} className="fa fa-cog"></i>
                                Configuration</div>

                        </div>
                    </div> */}
                    <main id="main" style={{ marginTop: "92px", marginBottom: "100px" }}>

                        <div className="section-header">
                            <h3>CDEX</h3>
                        </div>
                    </main>
                    <div className="content">
                        <div className="left-form" style={{ paddingLeft: "2%", paddingTop: "1%" }}>
                            <div style={{ paddingTop: "10px", color: "#8a6d3b", marginBottom: "10px" }}><strong> Requests for Clinical Document </strong></div>
                            <div>{content}</div>
                        </div>
                        {this.state.form_load &&
                            <div className="right-form" style={{ paddingTop: "1%",paddingBottom: "100px" }} >
                                <div className="data-label">
                                    Patient : <span className="data1">{this.state.patient_name}</span>
                                </div>
                                <div className="data-label">
                                    Sender {this.state.sender_resource} : <span className="data1">{this.state.sender_name}</span>
                                </div>
                                <div className="data-label">
                                    Start Date : <span className="data1">{moment(this.state.startDate).format(" YYYY-MM-DD, hh:mm a")}</span>
                                </div>
                                <div className="data-label">
                                    End Date : <span className="data1">{moment(this.state.endDate).format(" YYYY-MM-DD, hh:mm a")}</span>
                                </div>
                                <div className="data-label">
                                    Recieved Date : <span className="data1">{moment(this.state.recievedDate).format(" YYYY-MM-DD, hh:mm a")}</span>
                                </div>

                                <div className="data-label">
                                    Requested for : <span className="data1">{requests}</span>
                                </div>
                                {/* {this.state.observationList.length >0 &&
                                    <div className="data-label">
                                        Obsersvation : <span className="data1">{observations}</span>
                                    </div>
                                } */}
                                {/* {this.state.documentList.length >0 &&
                                    <div className="data-label">
                                        Documents : <span className="data1">{documents}</span>
                                    </div>  
                                } */}

                                <div className="data-label" style={{ paddingTop: "0px" }}>
                                    Select documents :

                                </div>
                                <div>
                                    {this.state.documentList.map((item, key) => {
                                        return this.renderDocs(item, key);
                                    })}
                                </div>
                                {this.state.documentList.length === 0 &&
                                    <div >
                                        {"No Documents found.Please Upload the required documents"}
                                    </div>
                                }
                                <div className="header">
                                    Upload Required/Additional Documentation
                                </div>
                                <div className="drop-box">
                                    <section>
                                        <Dropzone
                                            onDrop={this.onDrop.bind(this)}
                                            onFileDialogCancel={this.onCancel.bind(this)
                                            }
                                        >
                                            {({ getRootProps, getInputProps }) => (
                                                <div    >
                                                    <div className='drag-drop-box' {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <div className="file-upload-icon"><FontAwesomeIcon icon={faCloudUploadAlt} /></div>
                                                        <div>Drop files here, or click to select files </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Dropzone>
                                    </section>
                                    <div  >{files}</div>
                                </div>


                                {/* <div className='data-label'>
                                    <div>Search Observations form FHIR
                                        <small> - Enter a search keyword. (ex: height)</small>
                                    </div>
                                    <Input style={{ width: "100%" }}
                                        icon='search'
                                        placeholder='Search'
                                        className='ui fluid  input' type="text" name="searchParameter"
                                        onChange={this.onChangeSearchParameter}
                                    >
                                    </Input>
                                    // {/* <button style={{ width:"30%", float:"left"}}className="btn list-btn" onClick={() => this.getObservationDetails()}>
                                    //         Search</button> 
                                    {this.state.observationList.length > 0 &&
                                        <div className="data1">Found {this.state.observationList.length} observation(s)</div>
                                    }
                                    {this.state.observationList.length === 0 &&
                                        <div className="data1">When no observations found. Please upload requested documents.</div>
                                    }
                                </div> */}
                                {/* {(this.state.documentList.length<= 0 && this.state.observationList.length<=0 ) &&
                                    <div>
                                    <DocumentInput
                                        updateCallback={this.updateDocuments}
                                    />
                                    </div>
                                
                                } */}
                                {this.state.error &&
                                    <div className="decision-card alert-error">
                                        {this.state.errorMsg}
                                    </div>
                                }
                                {this.state.success &&
                                    <div className="decision-card alert-success">
                                        {this.state.successMsg}
                                    </div>
                                }
                                <div className='text-center'>
                                <button type="button" onClick={this.startLoading}>Submit
                                        <div id="fse" className={"spinner " + (this.state.loading ? "visible" : "invisible")}>
                                        <Loader
                                            type="Oval"
                                            color="#fff"
                                            height="15"
                                            width="15"
                                        />
                                    </div>
                                </button>
                                <NotificationContainer />
                                </div>
                            </div>}
                    </div>
                </div>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    console.log(state);
    return {
        config: state.config,
    };
};

export default withRouter(connect(mapStateToProps)(CDEX));