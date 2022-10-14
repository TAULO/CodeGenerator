import React from 'react';
import '.././Profile.css';
import { Redirect, withRouter } from 'react-router-dom';
import CountryCode from '../../../config/CountryCode.json';
import { formDataToJson } from '../../../utilities/utility';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { subYears } from 'date-fns';
import DarkMode from '../../DarkMode';

import {
    uploadProfilePic,
    getUserDetails,
    getProfilePicLink,
    getInpFileLink,
    getModelLink,
    getSimulationFile,
    getVtkFileLink,
    updateUserDetails,
    isAuthenticated,
    VerifyNumber
} from '../../../apis';

import { UncontrolledAlert,
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
    Button,
    Col,
    Row
} from 'reactstrap';

import Footer from '../../Footer';

import DownloadBtn from '../../Buttons/Download3dProfile';
import store from '../../../Store';
import {
    darkThemeActiveSetter,
    darkThemeInactiveSetter,
    resetSignedInSucceeded,
    militaryVersion
} from '../../../Actions';
import { getStatusOfDarkmode } from '../../../reducer';
import Spinner from '../../Spinner/Spinner';
import Img from 'react-fix-image-orientation'


class verify extends React.Component {
    constructor(props) {
        super(props);

        let search = window.location.search;
        let params = new URLSearchParams(search);

        let user_profile_to_view = params.get('id') ;
        console.log('user_profile_to_view',user_profile_to_view)
        if(!user_profile_to_view){
            user_profile_to_view = '';
        }

        this.state = {
            selectedFile: null,
            isLoading: true,
            user: {},
            isFileBeingUploaded: false,
            isUploading: false,
            foundInpLink: false,
            isAuthenticated: false,
            isCheckingAuth: true,
            disableInput: [true, true, true, true, true],
            inputs: ['email', 'age', 'sex', 'contact', 'organization'],
            isDarkMode: false,
            mode: 'Dark mode',
            militaryVersion: 'Military version',
            militaryStatus: false,
            isFileUploaded: false,
            profile_to_view : user_profile_to_view,
            CountryCode: [CountryCode],
            selectedCountryCode: '+1',
            slectedCountryName: 'USA',
            startDate: '',
            avatar_zip_file_url_details : '',
            vtk_file_url_details : '',
            isRefreshing : false,
            phone_number: ''
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.refreshProfileData = this.refreshProfileData.bind(this);
    }
    onChangeHandler = (event) => {
        event.persist();

        this.setState({
            selectedFile: event.target.files[0]
        });
        this.onClickHandler(event.target.files[0]);
    };

    handeChange = (e) => {
        const eventValue = e.target.value.split(' ');
        this.setState({
            selectedCountryCode: eventValue[0],
            slectedCountryName: eventValue[1]
        });
    };

    handleDateChange = (date) => {

        this.setState((prevState) => {
            prevState = JSON.parse(JSON.stringify(this.state.user));
            if("dob" in prevState){
                prevState.dob = date ;
            }
            else{
                prevState["dob"] = date ;
            }
            return { user: prevState };
        });
    };

    getUploadFileExtension(url){

        if(new RegExp(".jpg").test(url)){
            return ".jpg";
        }
        if(new RegExp(".jpeg").test(url)){
            return ".jpeg";
        }
        if(new RegExp(".JPEG").test(url)){
            return ".JPEG";
        }
        if(new RegExp(".JPG").test(url)){
            return ".JPG";
        }
        if(new RegExp(".png").test(url)){
            return ".png";
        }
        if(new RegExp(".PNG").test(url)){
            return ".PNG";
        }
        if(new RegExp(".tiff").test(url)){
            return ".tiff";
        }
        if(new RegExp(".TIFF").test(url)){
            return ".TIFF";
        }
    }

    getCountryName = (e) => {};


    onClickHandler = (profile_pic) => {
        const data = new FormData();
        this.setState({
            isFileBeingUploaded: true,
            isUploading: true,
            isFileUploaded: false,
            fileUploadError: ''
        });
        var user_id = '';
        if(this.state.profile_to_view){
            user_id = this.state.profile_to_view ;
        }
        else{
            user_id = this.state.user.user_cognito_id ;
        }

        data.append('profile_pic', profile_pic);
        data.append('user_cognito_id', user_id);

        // console.log("THIS IS FORM DATA ",data);
        // console.log("VALUE TO BE PRINTED ",user_id);
        var profile_data = {
            profile_picture_url :'', // Not a user key
            avatar_url : '',
            is_selfie_image_uploaded : false,
            is_selfie_model_uploaded : false,
            foundInpLink: false,
            isUploading: false,
            is_selfie_inp_uploaded: false,
            inp_file_url:'',
            avatar_url : '',
            vtk_file_url : '',
            inp_latest_url_details : '',
            selfie_latest_url_details : '',
            simulation_file_url_details : '',
            avatar_zip_file_url_details : '',
            vtk_file_url_details : ''
        }
        uploadProfilePic(data)
        .then((response) => {
            console.log(response);

            if (response.data.message === 'success') {
                // Fetch only image url again
                getProfilePicLink(
                    JSON.stringify({ user_cognito_id: user_id })
                )
                .then((res) => {
                    console.log(res.data);
                    profile_data.profile_picture_url = res.data.profile_picture_url ;
                    if (
                        res.data.avatar_url !== undefined &&
                        res.data.avatar_url.length !== 0
                    ) {
                        profile_data.avatar_url = res.data.avatar_url;
                        profile_data.is_selfie_image_uploaded = true;

                        // profile_data.is_selfie_model_uploaded = true;
                        if(res.data.profile_picture_url) {
                            let file_extension = this.getUploadFileExtension(res.data.profile_picture_url);
                            let details = res.data.profile_picture_url.split(file_extension)[0].split('/');

                            let timestamp = details[details.length - 1]

                            let date = new Date(parseInt(timestamp));

                            profile_data.selfie_latest_url_details = [date.toLocaleDateString(),date.toLocaleTimeString({},{hour12:true})]
                        }
                        else{
                            if (
                                res.data.avatar_url !== undefined &&
                                res.data.avatar_url.length !== 0
                            ) {
                                let file_extension = this.getUploadFileExtension(res.data.avatar_url);
                                let details = res.data.avatar_url.split(".png")[0].split('/');

                                let timestamp = details[details.length - 1]

                                let date = new Date(parseInt(timestamp));

                                profile_data.selfie_latest_url_details = [date.toLocaleDateString(),date.toLocaleTimeString({},{hour12:true})]
                            }
                        }

                        this.setState((prevState) => {
                            prevState = JSON.parse(JSON.stringify(this.state.user));
                            prevState.profile_picture_url = res.data.profile_picture_url;
                            if (
                                res.data.avatar_url !== undefined &&
                                res.data.avatar_url.length !== 0
                            ) {
                                prevState.avatar_url = res.data.avatar_url;
                                prevState.is_selfie_image_uploaded = true;
                            }
                            return { user: prevState, selfie_latest_upload_details : profile_data.selfie_latest_url_details };
                        });
                    }

                    // this.setState({
                    //     profile_picture_url: res.data.profile_picture_url
                    //
                    // });
                    this.setState({ isUploading: false, isFileUploaded : true });


                    // this.setState({ foundInpLink: false });

                })
                .catch((err) => {
                    console.log(err);

                    this.setState({ isUploading: false, fileUploadError : "Failed to fetch Inp Link"});
                });
            } else {

                this.setState({ isUploading: false, fileUploadError : "Failed to upload selfie !"});
                console.log(response);
            }
        })
        .catch((err) => {
            console.log(err);
            this.setState({ isUploading: false, fileUploadError : "Internal Server Error : Failed to upload Selfie !"});

        });
    };
    refreshProfileData(){
        if(this.state.isRefreshing){
            return ;
        }
        this.setState({
            isRefreshing : true
        })
        var user_id = '';
        if(this.state.profile_to_view){
            user_id = this.state.profile_to_view ;
        }
        else{
            user_id = this.state.user.user_cognito_id ;
        }

        // console.log("THIS IS FORM DATA ",data);
        // console.log("VALUE TO BE PRINTED ",user_id);
        var profile_data = {
            profile_picture_url :'', // Not a user key
            avatar_url : '',
            is_selfie_image_uploaded : false,
            is_selfie_model_uploaded : false,
            foundInpLink: false,
            isUploading: false,
            is_selfie_inp_uploaded: false,
            inp_file_url:'',
            avatar_url : '',
            vtk_file_url : '',
            inp_latest_url_details : '',
            selfie_latest_url_details : '',
            simulation_file_url_details : '',
            avatar_zip_file_url_details : '',
            vtk_file_url_details : ''
        }
        getUserDetails({user_cognito_id : user_id})
        .then(response => {
            // If Selfie is uploaded
            var user_data = response.data.data;
            getProfilePicLink(
                JSON.stringify({ user_cognito_id: user_id })
            )
            .then(res => {
                profile_data.profile_picture_url = res.data.profile_picture_url ;
                if (
                    res.data.avatar_url !== undefined &&
                    res.data.avatar_url.length !== 0
                ) {
                    profile_data.avatar_url = res.data.avatar_url;
                    profile_data.is_selfie_image_uploaded = true;

                    // profile_data.is_selfie_model_uploaded = true;
                    if(res.data.profile_picture_url) {
                        let file_extension = this.getUploadFileExtension(res.data.profile_picture_url);
                        let details = res.data.profile_picture_url.split(file_extension)[0].split('/');

                        let timestamp = details[details.length - 1]

                        let date = new Date(parseInt(timestamp));

                        profile_data.selfie_latest_url_details = [date.toLocaleDateString(),date.toLocaleTimeString({},{hour12:true})]
                    }
                    else{
                        if (
                            res.data.avatar_url !== undefined &&
                            res.data.avatar_url.length !== 0
                        ) {
                            let file_extension = this.getUploadFileExtension(res.data.avatar_url);
                            let details = res.data.avatar_url.split(".png")[0].split('/');

                            let timestamp = details[details.length - 1]

                            let date = new Date(parseInt(timestamp));

                            profile_data.selfie_latest_url_details = [date.toLocaleDateString(),date.toLocaleTimeString({},{hour12:true})]
                        }
                    }
                }

                getModelLink(
                    JSON.stringify({
                        user_cognito_id: user_id
                    })
                )
                .then((response) => {
                    if (response.data.message === 'success') {
                        if(user_data.is_selfie_model_uploaded){
                            profile_data.avatar_url = response.data.avatar_url ;
                            let details = response.data.avatar_url.split(".zip")[0].split('/');
                            let timestamp = details[details.length - 1]
                            let date = new Date(parseInt(timestamp))
                            profile_data.avatar_zip_file_url_details = [date.toLocaleDateString(),date.toLocaleTimeString({},{hour12:true})]
                        }

                        // this.setState((prevState) => {
                        //     prevState = JSON.parse(
                        //         JSON.stringify(this.state.user)
                        //     );
                        //
                        //     prevState.avatar_url = response.data.avatar_url;
                        //     return { user: prevState };
                        // });
                        getVtkFileLink(JSON.stringify({
                            user_cognito_id : user_id
                        }))
                        .then(response => {
                            if(response.data.message == "success"){
                                if(user_data.is_selfie_inp_uploaded){
                                    profile_data.vtk_file_url = response.data.vtk_file_url;
                                    let details = response.data.vtk_file_url.split(".vtk")[0].split('/');
                                    let timestamp = details[details.length - 1]
                                    let date = new Date(parseInt(timestamp))
                                    profile_data.vtk_file_url_details = [date.toLocaleDateString(),date.toLocaleTimeString({},{hour12:true})]

                                }

                                this.setState((prevState) => {
                                    prevState = JSON.parse(
                                        JSON.stringify(this.state.user)
                                    );
                                    prevState.profile_picture_url = profile_data.profile_picture_url
                                    prevState.is_selfie_image_uploaded = user_data.is_selfie_image_uploaded;
                                    prevState.is_selfie_model_uploaded = user_data.is_selfie_model_uploaded;
                                    prevState.is_selfie_inp_uploaded = user_data.is_selfie_inp_uploaded;
                                    prevState.inp_file_url = profile_data.inp_file_link;
                                    prevState.vtk_file_url =
                                    profile_data.vtk_file_url;
                                    prevState.avatar_url = profile_data.avatar_url;
                                    return { user: prevState,
                                        profile_picture_url: profile_data.profile_picture_url,
                                        foundInpLink: false,
                                        selfie_latest_upload_details : profile_data.selfie_latest_url_details,
                                        simulation_file_latest_upload_details : profile_data.simulation_file_url_details,
                                        avatar_zip_file_url_details : profile_data.avatar_zip_file_url_details,
                                        vtk_file_url_details : profile_data.vtk_file_url_details,
                                        isRefreshing : false
                                    };
                                });
                            }
                            else{
                                this.setState({ isUploading: false, isRefreshing : false, fileUploadError : "Invalid Request to fetch VTK File"});
                            }

                        })
                        .catch(err => {
                            this.setState({ isUploading: false, isRefreshing : false, fileUploadError : "Failed to find the VTK File Link"});
                        })

                    } else {

                        this.setState({ isUploading: false, isRefreshing : false, fileUploadError : "Failed to find the model link"});
                    }
                })
                .catch((err) => {

                    this.setState({ isUploading: false, isRefreshing : false, fileUploadError : "Failed to find the model link"});
                });
            })
            .catch(err => {
                this.setState({ isUploading: false, isRefreshing : false, fileUploadError : "Failed to Fetch User Details"});
            })
        })
        .catch(err => {
            this.setState({ isUploading: false, isRefreshing : false, fileUploadError : "Failed to Fetch User Details"});
        })

    }
    isProfilePictureExists = () => {
        if (this.state.user.profile_picture_url !== '') {
            return true;
        } else {
            return false;
        }
    };

    enableDisabe = (e) => {
        const index = e.currentTarget.dataset.inptno;
        const element = this.refs[this.state.inputs[index]];
        const inputDisable = [...this.state.disableInput];
        inputDisable[index] = !this.state.disableInput;
        this.setState({ disableInput: inputDisable }, () => {
            element.focus();
            element.classList.add('input-outline');
        });
    };

    elementsOfDarkMode = (
        darkThemereSetterFunc,
        bgColor,
        fontColor,
        darkModeColor
    ) => {
        store.dispatch(darkThemereSetterFunc());
        this.refs.lightDark.style.background = bgColor[0];
        document.getElementsByTagName('html')[0].style.background = bgColor[1];
        document.getElementsByTagName('body')[0].style.background = bgColor[1];
        this.refs.profileBorder.style.border = `10px solid ${bgColor[1]}`;
        this.refs.nameColor.style.color = fontColor;
        this.refs.chooserColor.style.color = fontColor;
        this.refs.darkMode.style.color = fontColor;
        const allInputs = this.state.inputs;
        allInputs.forEach((element) => {
            this.refs[element].setAttribute('id', darkModeColor);
        });
        this.props.isDarkModeSet(this.state.isDarkMode);
    };

    darkMode = (e) => {
        this.setState(
            { isDarkMode: !this.state.isDarkMode, mode: 'Light mode' },
            () => {
                if (this.state.isDarkMode === true) {
                    this.elementsOfDarkMode(
                        darkThemeActiveSetter,
                        ['#232838', '#171b25'],
                        '#fff',
                        'dark-mode-color'
                    );
                    for (let i = 1; i <= 4; i++) {
                        this.refs['p' + i].style.color = '#fff';
                    }
                } else {
                    this.setState({ mode: 'Dark mode' });
                    this.elementsOfDarkMode(darkThemeInactiveSetter, ['', ''], '', '');
                }
            }
        );
    };

    militaryVersionHandler = () => {
        if (this.state.militaryStatus === false) {
            this.setState({ militaryStatus: true }, () => {
                store.dispatch(militaryVersion(true));
            });
        } else {
            this.setState({ militaryStatus: false }, () => {
                store.dispatch(militaryVersion(false));
            });
        }
    };
    Change = (e)=>{
        const {name, value} = e.target;
        console.log(name, value)
        this.setState({[name]:value, number_verified: 'false'})
    }
    VerifyNumber=(e)=>{
         e.preventDefault();
        console.log('e',this.state.phone_number,this.state.user.user_cognito_id,this.state.selectedCountryCode);
        if(this.state.phone_number){
            VerifyNumber({phone_number: this.state.phone_number, user_cognito_id:this.state.user.user_cognito_id,country_code:this.state.selectedCountryCode})
            .then(res=>{
                console.log('res',res);
                if(res.data.message == "success"){
                    this.setState({number_verified: 'true'})
                }
            }).catch(err => {
                console.log('err',err)
            })
        }
    }

    handleSubmit(e) {
        console.log('Update user details clicked');
        e.preventDefault();
        e.persist();
        //temporary setting authentication to change nav bar tabs

        console.log('update User Details api called');
        const formData = new FormData(e.target);
        this.setState({
            isLoginError: false,
            isLoading: true
        });
        // converting formData to JSON
        const formJsonData = JSON.parse(formDataToJson(formData));

        formJsonData["user_cognito_id"] = this.state.user.user_cognito_id;
        formJsonData["number_verified"] = this.state.number_verified;

        // Calling update user details api
        updateUserDetails(JSON.stringify(formJsonData))
        .then((response) => {
            if (response.data.message === 'success') {
                this.setState({
                    isLoading: false,
                    isSignInSuccessed: true,
                    message : true
                });

            } else {
                // show error
                this.setState({
                    loginError: response.data.error,
                    isLoginError: true,
                    isLoading: false
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });

    }


    showProfile = () => {
        console.log('this.state.user.profile_picture_url',this.state.user.profile_picture_url)
        // this.setState({phone_number: this.state.user.phone_number})
        return (
            <React.Fragment>
                <div
                    style={{
                        marginTop : "10%"
                    }}
                    className="container pl-5 pr-5 profile-mt animated zoomIn mb-5 pb-2">
                    <div
                        style={{
                            alignContent: "center",
                            textAlign : "center"
                        }}
                        className={`section-title animated zoomIn profile-section-title`}>
                        <h1 ref="h1" className="font-weight-bold">
                            Profile Page
                        </h1>
                    </div>
                    <div
                        ref="lightDark"
                        style={{
                            border: "2px solid rgb(15, 129, 220)",
                            borderRadius: "1.8rem"

                        }}
                        className="row profile-container"
                        >{/*
                            <div ref="profileBorder" className="profile">
                            <img
                            className="img-fluid"
                            src={this.state.user.profile_picture_url}
                            alt=""
                            />
                            </div>*/}
                            <div className="col-md-10 ml-4 mt-2 pt-2 ">
                                <p
                                    ref="h1"
                                    style={{
                                        paddingLeft : "0px"
                                    }}
                                    className="player-dashboard-sub-head">
                                    Contact Information
                                </p>

                                <Form className="mt-2" onSubmit = {this.handleSubmit} >
                                    <FormGroup row>
                                        <Label for="exampleEmail" sm={2}>Name</Label>

                                        <Col sm={6}>
                                            <Row>
                                                <Col md={6} sm={12}>
                                                    <div class="input-group">
                                                        <Input
                                                            className="profile-input" type="text" name="first_name" id="exampleEmail" value={this.state.user.first_name} placeholder="First Name" />
                                                        <span class="input-group-addon profile-edit-icon">
                                                            <i class="fa fa-pencil" aria-hidden="true"></i>
                                                        </span>
                                                    </div>

                                                    {/*<img
                                                        src="/img/icon/pencheck.svg"
                                                        alt=""
                                                        />
                                                        */}


                                                    </Col>
                                                    <Col md={6} sm={12}>
                                                        <div class="input-group">
                                                            <Input
                                                                className="profile-input" type="text" name="last_name" id="exampleEmail" value={this.state.user.last_name} placeholder="Last Name" />
                                                            <span class="input-group-addon profile-edit-icon"
                                                                >
                                                                <i class="fa fa-pencil" aria-hidden="true"></i>
                                                            </span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>


                                        </FormGroup>

                                        <FormGroup row>
                                            <Label for="exampleEmail" sm={2}>Email</Label>
                                            <Col sm={6}>
                                                <div class="input-group">
                                                    <Input readOnly
                                                        className="profile-input" type="text" name="email" id="exampleEmail" value={this.state.user.email} placeholder="abc@example.com" />

                                                </div>
                                            </Col>
                                            <Col sm={4}>
                                                <button className="btn btn-success btn-sm"><i class="fa fa-check" aria-hidden="true"></i> Verified</button>
                                            </Col>



                                        </FormGroup>

                                        <FormGroup row>
                                            <Label for="exampleEmail" sm={2}>Mobile Phone</Label>
                                            <Col sm={6}>
                                                <div class="input-group-prepend">
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <span
                                                                style={{
                                                                    height : "100%"
                                                                }}
                                                                className="input-group-text country-code-container country-code-outer-box">
                                                                <select
                                                                    className="profile-input custom-select country-code country-code-input-box"
                                                                    defaultValue={this.state.user.country_code ? this.state.user.country_code : this.state.selectedCountryCode}
                                                                    onChange={this.handeChange}
                                                                    name="country_code"
                                                                    id=""

                                                                    >
                                                                    {this.state.CountryCode.map((index) => {
                                                                        return index.countries.map((key, value) => {
                                                                            if (key.code === '+1'){
                                                                                return (
                                                                                    <option key={value} defaultValue={key.code + ' USA'}>
                                                                                        {key.code}
                                                                                    </option>
                                                                                );
                                                                            }else if( this.state.user.country_code && this.state.user.country_code === key.code ){
                                                                                return (
                                                                                    <option key={value} value={key.code + ' ' + key.name} selected="true">
                                                                                        {key.code}
                                                                                    </option>
                                                                                );
                                                                            }
                                                                            else{
                                                                                return (
                                                                                    <option key={value} value={key.code + ' ' + key.name}>
                                                                                        {key.code}
                                                                                    </option>
                                                                                );
                                                                            }

                                                                        }, this);
                                                                    })}
                                                                </select>

                                                            </span>
                                                        </div>
                                                        <div className="col-sm-8 offset-sm-1">
                                                            <span className="profile-input input-group-text" id="basic-addon1">
                                                                <span className="country-name">
                                                                    {this.state.slectedCountryName}
                                                                </span>
                                                                <Input
                                                                    className="profile-input phone-number-input-box" type="text" name="phone_number" onChange={this.Change} id="exampleEmail" defaultValue={this.state.user.phone_number.substring(this.state.user.phone_number.length - 10 , this.state.user.phone_number.length)} placeholder="Your 10 Digit Mobile number" />
                                                                <span class="input-group-addon profile-edit-icon"
                                                                    >
                                                                    <i class="fa fa-pencil" aria-hidden="true"></i>
                                                                </span>
                                                            </span>

                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col sm={4}>
                                                {this.state.number_verified == 'true' ? 
                                                    (<button className="btn btn-success btn-sm" onClick={e =>e.preventDefault()}><i class="fa fa-check" aria-hidden="true"></i> Verified</button>) 
                                                    :
                                                    (
                                                        <React.Fragment>
                                                            <button className="btn btn-warning btn-sm" onClick={e =>e.preventDefault()} style={{'float':'left'}}><i class="fa fa-check"  aria-hidden="true"></i> Not Verified</button>
                                                            <button className="btn btn-danger btn-sm" style={{'float':'left','margin-left':'5px'}} onClick={this.VerifyNumber}> Verify now!</button>
                                                        </React.Fragment>
                                                    )
                                                }
                                                
                                            </Col>
                                        </FormGroup>

                                        

                                        <FormGroup row>
                                            <Label for="dob" sm={2}>Birthday</Label>
                                            <Col sm={6}>
                                                <div class="input-group">
                                                    <DatePicker
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        className="form-control"
                                                        name="dob"
                                                        selected={this.state.user.dob ? new Date(this.state.user.dob) : ""}
                                                        onChange={this.handleDateChange}
                                                        maxDate={subYears(new Date(), 10)}
                                                        placeholderText="Birthdate"
                                                        className="profile-input form-control"
                                                        />

                                                    <span class="input-group-addon profile-edit-icon"
                                                        >
                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                    </span>
                                                </div>
                                            </Col>
                                        </FormGroup>

                                        <FormGroup row>
                                            <Label for="exampleEmail" sm={2}>Sex</Label>
                                            <Col sm={6}>
                                                <div class="input-group">
                                                    <Input
                                                        className="profile-input" type="select" name="sex" id="exampleEmail" placeholder="Gender" defaultValue={this.state.user.gender} >
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </Input>

                                                    <span class="input-group-addon profile-edit-icon"
                                                        >
                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                    </span>
                                                </div>
                                            </Col>
                                        </FormGroup>
                                        <p
                                            ref="h1"
                                            style={{
                                                paddingLeft : "0px"
                                            }}
                                            className="player-dashboard-sub-head">
                                            Security and Permissions
                                        </p>
                                        <FormGroup row>
                                            <Label for="exampleEmail" sm={2}>Organization</Label>
                                            <Col sm={6}>
                                                <div class="input-group">
                                                    {/* 
                                                        <Input disabled
                                                            className="profile-input" type="select" name="organization" id="exampleEmail" defaultValue={this.state.organization ? this.state.organization : "PSU"}  placeholder="Organization" >
                                                            <option value={this.state.organization ? this.state.organization : "PSU"}  > {this.state.organization ? this.state.organization : "PSU"} </option>
                                                            <option value="NSF"  > NSF </option>
                                                        </Input>
                                                        <span class="input-group-addon profile-edit-icon"
                                                            >
                                                            <i class="fa fa-pencil" aria-hidden="true"></i>
                                                        </span>
                                                    */}
                                                    <span className="ProfileOrganization">{this.state.organization ? this.state.organization : "PSU"}</span>
                                                </div>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label for="exampleEmail" sm={2}>Type</Label>
                                            <Col sm={6}>
                                                <div class="input-group">
                                                    <Input
                                                        disabled="true"
                                                        className="profile-input" type="text" name="user_type" id="" placeholder="Gender" value={this.state.user.user_type == "StandardUser" ? "Standard" : "Admin"} />
                                                </div>
                                            </Col>
                                            <Col sm={4}>
                                                <span
                                                    style={{
                                                        fontSize : ".8em"
                                                    }}
                                                    >If you need Administration rights <br/> contact your account administrator.</span>
                                            </Col>
                                        </FormGroup>

                                        <FormGroup row>
                                            <Label for="exampleEmail" sm={12}>IRB Complete <span style={{
                                                    verticalAlign: "text-bottom",
                                                    fontSize: "1.4em"
                                                }}>{this.state.isIRBComplete ? <i
                                                    style={{color : "green"}}
                                                    class="fa fa-check-circle profile-edit-icon" aria-hidden="true"></i>
                                                :
                                                <i
                                                    style={{color : "red"}}
                                                    class="fa fa-times-circle profile-edit-icon" aria-hidden="true"></i>  }
                                                </span>
                                                <span>
                                                    <button className="btn btn-danger btn-sm" style={{'margin-left':'26px'}}>Complete now!</button>
                                                </span>
                                            </Label>
                                            <Col sm={8}>
                                                <div class="input-group">
                                                    <span class="input-group-addon">

                                                    </span>
                                                </div>
                                            </Col>

                                        </FormGroup>

                                        <div className="text-center">
                                            <Button color="primary"> Save Changes </Button>
                                            {this.state.isLoading ? (
                                                <div className="d-flex justify-content-center center-spinner">
                                                    <div
                                                        className="spinner-border text-primary"
                                                        role="status"
                                                        >
                                                        <span  className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            ) : null}
                                            {this.state.message ? (
                                                <div
                                                    className="alert alert-success"
                                                    style={{'margin-top': '8px'}}
                                                    role="alert">
                                                    <strong > Success !</strong> {this.state.message}
                                                    </div>
                                                ) : null}
                                                {this.state.isLoginError ? (
                                                    <div
                                                        className="alert alert-info api-response-alert"
                                                        role="alert"
                                                        >
                                                        <strong >Failed! </strong> {this.state.loginError}
                                                        </div>
                                                    ) : null}
                                                </div>

                                            </Form>


                                        </div>
                                        <div className="col-md-3 btns-heading text-left pt-4">





                                        </div>
                                    </div>
                                </div>
                                <div className="container pl-5 pr-5 zoomIn mb-5 pb-2">
                                    <div
                                        style={{
                                            border: "2px solid rgb(15, 129, 220)",
                                            borderRadius: "1.8rem"
                                        }}
                                        className="profile-container" >
                                        <div className="row">
                                            <div ref="h1"
                                                className="col-md-8 ml-4 player-dashboard-sub-head ">
                                                Simulation Information
                                            </div>
                                            <div className="col-md-3">

                                                <img
                                                    className={ "cancel-icon refresh-icon " + (this.state.isRefreshing ? 'rotate-icon' : '')}
                                                    src="/img/icon/refresh.png"
                                                    alt=""
                                                    onClick={this.refreshProfileData}
                                                    style={{
                                                        marginLeft: "auto",
                                                        marginRight: "0",
                                                        marginTop: "8%",
                                                        display: "flex",
                                                        width : "36px",
                                                        height : "36px"
                                                    }}
                                                    />

                                            </div>
                                        </div>
                                        <Row className="pt-2 pl-4 pr-4">
                                            <Col md={4}>

                                                <p ref="p1">
                                                    {this.state.user.is_selfie_image_uploaded ? (
                                                        <span>
                                                            <img src="/img/icon/check.svg" alt="" />
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            <img
                                                                className="cancel-icon"
                                                                src="/img/icon/cancel.svg"
                                                                alt=""
                                                                />
                                                        </span>
                                                    )}{' '}
                                                    Selfie Uploaded{' '}

                                                </p>


                                                {this.state.isUploading ? (
                                                    <div className="d-flex justify-content-center center-spinner">
                                                        <div
                                                            className="spinner-border text-primary"
                                                            role="status"
                                                            >
                                                            <span className="sr-only">Uploading...</span>
                                                        </div>
                                                    </div>
                                                ) : null}

                                                {this.state.isFileUploaded ? (
                                                    <UncontrolledAlert
                                                        color="success"
                                                        style={{ marginTop: '5px' }}
                                                        >
                                                        Successfully uploaded the Selfie Image
                                                    </UncontrolledAlert>
                                                ) : null}
                                                {this.state.fileUploadError ? (
                                                    <UncontrolledAlert
                                                        style={{ marginTop: '5px' }}
                                                        color="danger"

                                                        >
                                                        {this.state.fileUploadError}

                                                    </UncontrolledAlert>
                                                ) : null}
                                                <br/>
                                                {this.state.user.is_selfie_image_uploaded ? (
                                                    <div>
                                                        <button className = {`load-time-btn mt-1 mb-4`}>
                                                            <p>
                                                                Last Updated : {this.state.selfie_latest_upload_details[0]}
                                                            </p>
                                                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.selfie_latest_upload_details[1]}
                                                            </p>

                                                        </button>
                                                        <div>
                                                            <input
                                                                onChange={this.onChangeHandler}
                                                                type="file"
                                                                name="profile_pic"
                                                                id="file1"
                                                                style = {{
                                                                    display : "none"
                                                                }}
                                                                />
                                                            <label for="file1" className = "inspect-btn mt-1 mb-4" style={{
                                                                    textAlign : "center"
                                                                }}>
                                                                Update
                                                            </label>
                                                        </div>
                                                        <DownloadBtn

                                                            style={{
                                                                width : "100%"
                                                            }}
                                                            url={this.state.user.profile_picture_url}
                                                            content="Download 3d Selfie"
                                                            />
                                                    </div>
                                                ) : (<div>
                                                    <input
                                                        onChange={this.onChangeHandler}
                                                        type="file"
                                                        name="profile_pic"
                                                        id="file1"
                                                        style = {{
                                                            display : "none"
                                                        }}
                                                        />
                                                    <label for="file1" className = "inspect-btn mt-1 mb-4" style={{
                                                            textAlign : "center"
                                                        }}>
                                                        Upload
                                                    </label>
                                                </div>)}
                                            </Col>
                                            {/*
                                                <Col md={4}>
                                                <p ref="p4">
                                                {this.state.user.is_selfie_simulation_file_uploaded ? (
                                                <span>
                                                <img src="/img/icon/check.svg" alt="" />
                                                </span>
                                                ) : (
                                                <span>
                                                <img
                                                className="cancel-icon"
                                                src="/img/icon/cancel.svg"
                                                alt=""
                                                />
                                                </span>
                                                )}{' '}
                                                Simulation File Generated{' '}

                                                </p>
                                                <br/>
                                                {this.state.user.is_selfie_simulation_file_uploaded ? (
                                                <div>
                                                <img className="svg img-fluid" src={this.state.user.simulation_file_url} alt="" />
                                                <DownloadBtn
                                                style={{
                                                width : "100%"
                                                }}
                                                url={this.state.user.simulation_file_url}
                                                content="Download Selfie Image"
                                                />
                                                </div>
                                                ) : null}
                                                </Col>
                                                */}
                                                <Col md={4}>
                                                    <p ref="p2">
                                                        {this.state.user.is_selfie_model_uploaded ? (
                                                            <span>
                                                                <img src="/img/icon/check.svg" alt="" />
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                <img
                                                                    className="cancel-icon"
                                                                    src="/img/icon/cancel.svg"
                                                                    alt=""
                                                                    />
                                                            </span>
                                                        )}{' '}
                                                        3D Avatar Generated{' '}

                                                    </p>
                                                    <br/>
                                                    {this.state.user.is_selfie_model_uploaded ? (
                                                        <div>
                                                            <button className = {`load-time-btn mt-1 mb-4`}>
                                                                <p>
                                                                    Last Updated : {this.state.avatar_zip_file_url_details[0]}
                                                                </p>
                                                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.avatar_zip_file_url_details[1]}</p>
                                                            </button>

                                                            <button
                                                                style={{
                                                                    width : "100%"
                                                                }}
                                                                className={`inspect-btn mt-1 mb-4`} type="button">
                                                                Inspect
                                                            </button>
                                                            <DownloadBtn
                                                                style={{
                                                                    width : "100%"
                                                                }}
                                                                url={this.state.user.avatar_url}
                                                                content="Download avatar (ZIP)"
                                                                />
                                                        </div>
                                                    ) : null}
                                                </Col>

                                                <Col md={4}>
                                                    <p ref="p3">
                                                        {this.state.user.is_selfie_inp_uploaded ? (
                                                            <span>
                                                                <img src="/img/icon/check.svg" alt="" />
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                <img
                                                                    className="cancel-icon"
                                                                    src="/img/icon/cancel.svg"
                                                                    alt=""
                                                                    />
                                                            </span>
                                                        )}{' '}
                                                        Mesh File Generated

                                                    </p>
                                                    <br/>
                                                    {this.state.user.is_selfie_inp_uploaded ? (
                                                        <div>
                                                            <button className = {`load-time-btn mt-1 mb-4`}>
                                                                <p >
                                                                    Last Updated : {this.state.inp_latest_upload_details[0]}
                                                                </p>
                                                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.inp_latest_upload_details[1]}</p>
                                                            </button>
                                                            <button
                                                                style={{
                                                                    width : "100%"
                                                                }}
                                                                className={`inspect-btn mt-1 mb-4`} type="button">
                                                                Inspect
                                                            </button>
                                                            <DownloadBtn
                                                                style={{
                                                                    width : "100%"
                                                                }}
                                                                url={this.state.user.vtk_file_url}
                                                                content="Download FE Mesh (VTK)"
                                                                />
                                                        </div>
                                                    ) : null}

                                                </Col>
                                            </Row>
                                        </div>

                                    </div>
                                    <div className="container pl-5 pr-5 zoomIn mb-5 pb-2">
                                        <div
                                            style={{
                                                border: "2px solid rgb(15, 129, 220)",
                                                borderRadius: "1.8rem"
                                            }}
                                            className="profile-container" >
                                            <p
                                                ref="h1"
                                                style={{
                                                    paddingLeft : "0px"
                                                }}
                                                className="ml-4 player-dashboard-sub-head">
                                                App Settings
                                            </p>
                                            <Row className="pt-4 pl-4 pr-4 pb-4">
                                                <Col md={12}>
                                                    <div className="row">
                                                        <div className="col-sm-4">
                                                            <span ref="darkMode" className="dark-mode">
                                                                {this.state.mode}
                                                            </span>
                                                        </div>
                                                        <div className="col-sm-4  position-relative pt-1">
                                                            <label className="switch" htmlFor="checkbox">
                                                                <input

                                                                    value={this.state.isDarkMode}
                                                                    type="checkbox"
                                                                    id="checkbox"
                                                                    />
                                                                <div className="slider round"></div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md={12}>
                                                    <div className="row">
                                                        <div className="col-sm-4">
                                                            <span ref="chooserColor" className="dark-mode">
                                                                {this.state.militaryVersion}
                                                            </span>
                                                        </div>
                                                        <div className="col-sm-4  position-relative pt-1">
                                                            <label className="switch" htmlFor="militaryVersion">
                                                                <input
                                                                    onChange={this.militaryVersionHandler}
                                                                    value={this.state.militaryStatus}
                                                                    type="checkbox"
                                                                    id="militaryVersion"
                                                                    />
                                                                <div className="slider round"></div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                    {/*<DarkMode isDarkMode={this.props.isDarkModeSet} />*/}
                                    <Footer />
                                </React.Fragment>
                            );
                        };

                        returnComponent = () => {

                            if (!this.state.isAuthenticated && !this.state.isCheckingAuth) {
                                return <Redirect to="/Login" />;
                            } else if (Object.entries(this.state.user).length === 0) {
                                return <Spinner />;
                            }

                            return this.showProfile();
                        };

                        render() {
                            return this.returnComponent();
                        }

                        componentDidMount() {
                            this.setState({ isLoading: true });
                            isAuthenticated(JSON.stringify({}))
                            .then((value) => {
                                if (value.data.message === 'success') {
                                    this.setState({});
                                    getUserDetails({user_cognito_id : this.state.profile_to_view})
                                    .then((response) => {
                                        // store.dispatch(userDetails(response.data))
                                        console.log('RESPONSE DATA IS ', response.data);
                                        let inp_latest_url_details = ""
                                        let selfie_latest_url_details = ""
                                        let simulation_file_url_details = ""
                                        let avatar_zip_file_url_details = ""
                                        let vtk_file_url_details = ""
                                        if(response.data.data.inp_file_url) {
                                            let details = response.data.data.inp_file_url.split(".inp")[0].split('/');
                                            let timestamp = details[details.length - 1]
                                            let date = new Date(parseInt(timestamp))
                                            inp_latest_url_details = [date.toLocaleDateString(),date.toLocaleTimeString({},{hour12:true})]

                                        }
                                        if(response.data.data.profile_picture_url) {
                                            let file_extension = this.getUploadFileExtension(response.data.data.profile_picture_url);
                                            let details = response.data.data.profile_picture_url.split(file_extension)[0].split('/');

                                            let timestamp = details[details.length - 1]

                                            let date = new Date(parseInt(timestamp));

                                            selfie_latest_url_details = [date.toLocaleDateString(),date.toLocaleTimeString({},{hour12:true})]
                                        }
                                        if(response.data.data.simulation_file_url) {
                                            let details = response.data.data.simulation_file_url.split(".png")[0].split('/');
                                            let timestamp = details[details.length - 1]
                                            let date = new Date(parseInt(timestamp))
                                            simulation_file_url_details = [date.toLocaleDateString(),date.toLocaleTimeString({},{hour12:true})]
                                        }
                                        if(response.data.data.avatar_url) {
                                            let details = response.data.data.avatar_url.split(".zip")[0].split('/');
                                            let timestamp = details[details.length - 1]
                                            let date = new Date(parseInt(timestamp))
                                            avatar_zip_file_url_details = [date.toLocaleDateString(),date.toLocaleTimeString({},{hour12:true})]
                                        }
                                        if(response.data.data.vtk_file_url) {
                                            let details = response.data.data.vtk_file_url.split(".vtk")[0].split('/');
                                            let timestamp = details[details.length - 1]
                                            let date = new Date(parseInt(timestamp))
                                            vtk_file_url_details = [date.toLocaleDateString(),date.toLocaleTimeString({},{hour12:true})]
                                        }
                                        this.setState({
                                            user: { ...this.state.user, ...response.data.data },
                                            phone_number: response.data.data.phone_number.substring(response.data.data.phone_number.length - 10 , response.data.data.phone_number.length),
                                            number_verified: response.data.data.phone_number_verified ? response.data.data.phone_number_verified : 'false',
                                            isLoading: false,
                                            isAuthenticated: true,
                                            isCheckingAuth: false,
                                            inp_latest_upload_details : inp_latest_url_details,
                                            selfie_latest_upload_details : selfie_latest_url_details,
                                            simulation_file_latest_upload_details : simulation_file_url_details,
                                            avatar_zip_file_url_details : avatar_zip_file_url_details,
                                            vtk_file_url_details : vtk_file_url_details
                                        });

                                        if (getStatusOfDarkmode().status === true) {
                                            store.dispatch(darkThemeActiveSetter());
                                            this.refs.lightDark.style.background = '#232838';
                                            document.getElementsByTagName('html')[0].style.background =
                                            '#171b25';
                                            document.getElementsByTagName('body')[0].style.background =
                                            '#171b25';
                                            this.refs.profileBorder.style.border = '10px solid #171b25';
                                            this.refs.nameColor.style.color = '#fff';
                                            this.refs.chooserColor.style.color = '#fff';
                                            this.refs.darkMode.style.color = '#fff';
                                            const allInputs = this.state.inputs;
                                            allInputs.forEach((element) => {
                                                this.refs[element].setAttribute('id', 'dark-mode-color');
                                            });
                                            for (let i = 1; i <= 4; i++) {
                                                this.refs['p' + i].style.color = '#fff';
                                            }
                                            this.props.isDarkModeSet(this.state.isDarkMode);
                                        }
                                    })
                                    .catch((error) => {
                                        this.setState({
                                            user: {},
                                            isLoading: false,
                                            isCheckingAuth: false
                                        });
                                    });
                                } else {
                                    this.setState(
                                        { isAuthenticated: false, isCheckingAuth: false },
                                        () => {
                                            if (this.state.isAuthenticated === false) {
                                                store.dispatch(resetSignedInSucceeded());
                                                this.props.history.push('/Home');
                                            }
                                        }
                                    );
                                }
                            })
                            .catch((err) => {
                                this.setState({ isAuthenticated: false, isCheckingAuth: false });
                            });
                            if (getStatusOfDarkmode().status) {
                                document.getElementsByTagName('body')[0].style.background = '#171b25';
                            }
                        }
                    }

                    export default withRouter(verify);
