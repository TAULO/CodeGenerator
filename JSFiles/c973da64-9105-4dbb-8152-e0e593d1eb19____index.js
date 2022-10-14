import React, { Component } from "react";
import { Fragment } from "react";
import { UncontrolledAlert, Alert } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import ButtonNav from "../../../../../../../components/navButton/";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ContainerHeader from "../../../../../../../components/ContainerHeader/index";
import CardBox from "../../../../../../../components/CardBox/index";
import CustomPicker from "../../../../../../../components/pickers/routes/Color/customPicker";
import IntlMessages from "../../../../../../../util/IntlMessages";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  API_FETCH_INBOUND_NUMBER_EDIT_DATA,
  API_INBOUND_RECORD_DATA
} from "../../../../constants";
import { Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { fetchGlobal } from "../../../../../../../actions/Global";

import {
  scriptTextFieldsPrefix,
  scriptTextFieldsPostfix,
  record_call_data,
  style_header
} from "./data";
import axios from "axios";
import { createNotification } from "../../../../../../../Helpers";
const list_didRoute = [
  { value: "DNC", label: "Do Not Change" },
  { value: "AGENT", label: "Agent" },
  { value: "EXTEN", label: "Exten" },
  { value: "VOICEMAIL", label: "Voicemail" },
  { value: "PHONE", label: "Phone" },
  { value: "IN_GROUP", label: "In Group" },
  { value: "CALLMENU", label: "Call Menu" }
];

const list_filter_inbound_number = [
  { value: "DNC", label: "Do Not Change" },
  { value: "DISABLED", label: "Disabled" },
  { value: "GROUP", label: "Group" },
  { value: "URL", label: "Url" },
  { value: "DNC_INTERNAL", label: "DNC Internal" },
  { value: "DNC_CAMPAIGN", label: "DNC Campaign" }
];

const list_callHandelMethod = [
  { value: "CID", label: "CID" },
  { value: "CID Lookup", label: " CIDLOOKUP" },
  { value: "CID Lookup RL", label: "CIDLOOKUPRL" },
  { value: "CID Lookup RC", label: "CIDLOOKUPRC" },
  { value: "CID Lookup ALT", label: "CIDLOOKUPALT" },
  { value: "CID Lookup RLALT", label: "CIDLOOKUPRLALT" },
  { value: "CID Lookup RCALT", label: "CIDLOOKUPRCALT" }
];
class EditScript extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTitle: this.props.location.pathname.split("/")[5],
      groupId:
        this.props.location.pathname.split("/")[4] == "add"
          ? ""
          : this.props.location.pathname.split("/").pop(),
      pageError: false,
      scriptField: "",
      groupName: "",
      scriptComment: "",
      scriptActive: true,
      scriptActiveValue: "Y",
      scriptText: "",
      scriptTextSelectionStart: 0,
      showAlert: false,
      alertContent: "",
      alertTitle: "",
      showConfirm: false,
      showinfo: "",
      did_pattern: "",
      did_active: "",
      did_description: "",
      record_call: [],
      list_id: "",
      did_route: [],
      user: "",
      filter_inbound_number: [],
      is_change: false,
      isLoding: false,
      filter_inbound_number: "DNC",
      agentUser: "",
      exteninfo: "",
      voiceValue: "",
      phoneValue: "",
      groupValue: "",
      campaign_id: "",
      call_handle_method: "",
      group_id: "",
      filter_phone_group_id: "",
      filter_dnc_campaign: "",
      filter_url: "",
      filter_url_did_redirect: "",
      ingroup_list_id: "",
      campList: [],
      inboundList: [],
      callMenuList: [],
      phongroupList: []
    };
  }

  componentDidMount() {
    this.props.fetchGlobal(["cam", "inboundgroupoption", "callmenu"]);
    this.getData();
  }
  componentWillReceiveProps(nextPropsFromRedux) {
    this.setState({
      campList: nextPropsFromRedux.Global.campaigns
        ? nextPropsFromRedux.Global.campaigns
        : [],
      inboundList: nextPropsFromRedux.Global.inboundgroupoption
        ? nextPropsFromRedux.Global.inboundgroupoption
        : [],
      callMenuList: nextPropsFromRedux.Global.callMenuList
        ? nextPropsFromRedux.Global.callMenuList
        : [],
      phongroupList: nextPropsFromRedux.Global.phongroup
        ? nextPropsFromRedux.Global.phongroup
        : []
    });
  }

  getDynamicDrop = Index => {
    if (Index) {
      switch (Index) {
        case "AGENT":
          return this.getAgentInformation();
        case "EXTEN":
          return this.getExtenInformation();
        case "VOICEMAIL":
          return this.getVoiceInformation();
        case "PHONE":
          return this.getPhoneInformation();
        case "IN_GROUP":
          return this.getInGroupInformation();
        case "CALLMENU":
          return this.getCallMenuInformation();
        default:
          return "";
      }
    }
  };

  getDynamicNumberDrop = Index => {
    if (Index) {
      switch (Index) {
        case "GROUP":
          return this.getInGroupNumberInformation();
        case "URL":
          return this.getInUrlInformation();
        case "DNC_CAMPAIGN":
          return this.getInGroupfilterCampaignInformation();
        default:
          return "";
      }
    }
  };

  getAgentInformation = () => {
    return (
      <Fragment>
        <div
          className="col-md-12 col-12"
          data-title="User Agent"
          data-info="This field allows for a custom outbound routing extension. This allows you to use different call handling methods depending upon how you want to route calls through your outbound campaign. Formerly called Campaign VDAD extension.- 8368 - DEFAULT - Will send the call to the next available agent no matter what server they are on- 8369 - Used for Answering Machine Detection after that, same behavior as 8368."
          onMouseEnter={this.logMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <TextField
            id="dropActiondropext_safe_harbor_exten"
            label="User Agent "
            margin="normal"
            onChange={this.handleChange("agentUser")}
            fullWidth
            value={this.state.agentUser}
          />
        </div>
      </Fragment>
    );
  };

  getExtenInformation = () => {
    return (
      <Fragment>
        <div
          className="col-md-12 col-12"
          data-title="Extension"
          data-info="This field allows for a custom outbound routing extension. This allows you to use different call handling methods depending upon how you want to route calls through your outbound campaign. Formerly called Campaign VDAD extension.- 8368 - DEFAULT - Will send the call to the next available agent no matter what server they are on- 8369 - Used for Answering Machine Detection after that, same behavior as 8368."
          onMouseEnter={this.logMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <TextField
            id="dropActiondropext_safe_harbor_exten"
            label="Extension"
            margin="normal"
            onChange={this.handleChange("exteninfo")}
            fullWidth
            value={this.state.exteninfo}
          />
        </div>
      </Fragment>
    );
  };

  getVoiceInformation = () => {
    return (
      <Fragment>
        <div
          className="col-md-12 col-12"
          data-title="User Agent"
          data-info="This field allows for a custom outbound routing extension. This allows you to use different call handling methods depending upon how you want to route calls through your outbound campaign. Formerly called Campaign VDAD extension.- 8368 - DEFAULT - Will send the call to the next available agent no matter what server they are on- 8369 - Used for Answering Machine Detection after that, same behavior as 8368."
          onMouseEnter={this.logMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <TextField
            id="dropActiondropext_safe_harbor_exten"
            label="Voicemail "
            margin="normal"
            onChange={this.handleChange("voiceValue")}
            fullWidth
            value={this.state.voiceValue}
          />
        </div>
      </Fragment>
    );
  };

  getPhoneInformation = () => {
    return (
      <Fragment>
        <div
          className="col-md-12 col-12"
          data-title="Phone Extension"
          data-info="This field allows for a custom outbound routing extension. This allows you to use different call handling methods depending upon how you want to route calls through your outbound campaign. Formerly called Campaign VDAD extension.- 8368 - DEFAULT - Will send the call to the next available agent no matter what server they are on- 8369 - Used for Answering Machine Detection after that, same behavior as 8368."
          onMouseEnter={this.logMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <TextField
            id="dropActiondropext_safe_harbor_exten"
            label="Phone Extension "
            margin="normal"
            onChange={this.handleChange("phoneValue")}
            fullWidth
            value={this.state.phoneValue}
          />
        </div>
      </Fragment>
    );
  };

  getInGroupInformation = () => {
    const {
      campaign_id,
      call_handle_method,
      ingroup_list_id,
      group_id,
      campList,
      inboundList
    } = this.state;
    return (
      <Fragment>
        <div
          className="col-md-12 col-12"
          data-title="User Agent"
          data-info="This field allows for a custom outbound routing extension. This allows you to use different call handling methods depending upon how you want to route calls through your outbound campaign. Formerly called Campaign VDAD extension.- 8368 - DEFAULT - Will send the call to the next available agent no matter what server they are on- 8369 - Used for Answering Machine Detection after that, same behavior as 8368."
          onMouseEnter={this.logMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-simple">In-Group ID </InputLabel>
            <Select
              value={group_id}
              onChange={this.handleChange("group_id")}
              input={<Input id="age-simple" />}
            >
              {" "}
              <MenuItem key="NON-C" value="">
                DO Not Change
              </MenuItem>
              {inboundList &&
                inboundList.map((option, i) => (
                  <MenuItem key={i} value={option.group_id}>
                    {option.group_id}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText />
          </FormControl>
        </div>

        <div
          className="col-md-12 col-12"
          data-title="User Agent"
          data-info="This field allows for a custom outbound routing extension. This allows you to use different call handling methods depending upon how you want to route calls through your outbound campaign. Formerly called Campaign VDAD extension.- 8368 - DEFAULT - Will send the call to the next available agent no matter what server they are on- 8369 - Used for Answering Machine Detection after that, same behavior as 8368."
          onMouseEnter={this.logMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-simple">
              In-Group Call Handle Method{" "}
            </InputLabel>
            <Select
              value={call_handle_method}
              onChange={this.handleChange("call_handle_method")}
              input={<Input id="age-simple" />}
            >
              {" "}
              <MenuItem key="NON-C" value="">
                DO Not Change
              </MenuItem>
              {list_callHandelMethod &&
                list_callHandelMethod.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText />
          </FormControl>
        </div>
        <div
          className="col-md-12 col-12"
          data-title="User Agent"
          data-info="This field allows for a custom outbound routing extension. This allows you to use different call handling methods depending upon how you want to route calls through your outbound campaign. Formerly called Campaign VDAD extension.- 8368 - DEFAULT - Will send the call to the next available agent no matter what server they are on- 8369 - Used for Answering Machine Detection after that, same behavior as 8368."
          onMouseEnter={this.logMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-simple">In-Group Campaign ID</InputLabel>
            <Select
              value={campaign_id}
              onChange={this.handleChange("campaign_id")}
              input={<Input id="age-simple" />}
            >
              <MenuItem key="NON-C" value="">
                DO Not Change
              </MenuItem>
              {campList &&
                campList.map((option, i) => (
                  <MenuItem key={i} value={option.campaign_id}>
                    {option.campaign_id} -{option.campaign_name}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText />
          </FormControl>
        </div>
      </Fragment>
    );
  };

  getCallMenuInformation = () => {
    const { menu_id, callMenuList, call_handle_method } = this.state;
    return (
      <Fragment>
        <div
          className="col-md-12 col-12"
          data-title="User Agent"
          data-info="This field allows for a custom outbound routing extension. This allows you to use different call handling methods depending upon how you want to route calls through your outbound campaign. Formerly called Campaign VDAD extension.- 8368 - DEFAULT - Will send the call to the next available agent no matter what server they are on- 8369 - Used for Answering Machine Detection after that, same behavior as 8368."
          onMouseEnter={this.logMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-simple">Call Menu</InputLabel>
            <Select
              value={menu_id}
              onChange={this.handleChange("menu_id")}
              input={<Input id="age-simple" />}
            >
              {" "}
              <MenuItem key="NON-C" value="">
                DO Not Change
              </MenuItem>
              {callMenuList &&
                callMenuList.map((option, i) => (
                  <MenuItem key={i} value={option.menu_id}>
                    {option.menu_id}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText />
          </FormControl>
        </div>
      </Fragment>
    );
  };

  getInGroupNumberInformation = () => {
    const { filter_phone_group_id, phongroupList } = this.state;
    return (
      <Fragment>
        <div
          className="col-md-12 col-12"
          data-title="User Agent"
          data-info="This field allows for a custom outbound routing extension. This allows you to use different call handling methods depending upon how you want to route calls through your outbound campaign. Formerly called Campaign VDAD extension.- 8368 - DEFAULT - Will send the call to the next available agent no matter what server they are on- 8369 - Used for Answering Machine Detection after that, same behavior as 8368."
          onMouseEnter={this.logMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-simple">Filter Phone Group ID </InputLabel>
            <Select
              value={filter_phone_group_id}
              onChange={this.handleChange("filter_phone_group_id")}
              input={<Input id="age-simple" />}
            >
              {" "}
              <MenuItem key="NON-C" value="">
                DO Not Change
              </MenuItem>
              {phongroupList &&
                phongroupList.map((option, i) => (
                  <MenuItem key={i} value={option.filter_phone_group_id}>
                    {option.filter_phone_group_id} -{" "}
                    {option.filter_phone_group_name}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText />
          </FormControl>
        </div>
      </Fragment>
    );
  };
  getInUrlInformation = () => {
    const { filter_url, filter_url_did_redirect } = this.state;
    return (
      <Fragment>
        <div
          className="col-md-12 col-12"
          data-title="User Agent"
          data-info="This field allows for a custom outbound routing extension. This allows you to use different call handling methods depending upon how you want to route calls through your outbound campaign. Formerly called Campaign VDAD extension.- 8368 - DEFAULT - Will send the call to the next available agent no matter what server they are on- 8369 - Used for Answering Machine Detection after that, same behavior as 8368."
          onMouseEnter={this.logMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <TextField
            id="dropActiondropext_filter_url"
            label="FILTER URL "
            margin="normal"
            onChange={this.handleChange("filter_url")}
            fullWidth
            value={filter_url}
            helperText="Leave empty if you do not want to change it"
          />
        </div>
        <div
          className="col-md-12 col-12"
          data-title="User Agent"
          data-info="This field allows for a custom outbound routing extension. This allows you to use different call handling methods depending upon how you want to route calls through your outbound campaign. Formerly called Campaign VDAD extension.- 8368 - DEFAULT - Will send the call to the next available agent no matter what server they are on- 8369 - Used for Answering Machine Detection after that, same behavior as 8368."
          onMouseEnter={this.logMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-simple">
              Filter URL DID Redirect
            </InputLabel>
            <Select
              value={filter_url_did_redirect}
              onChange={this.handleChange("filter_url_did_redirect")}
              input={<Input id="age-simple" />}
            >
              {" "}
              <MenuItem key="NON-C" value="">
                DO Not Change
              </MenuItem>
              <MenuItem key="0" value="Y">
                Yes
              </MenuItem>
              <MenuItem key="1" value="N">
                No
              </MenuItem>
            </Select>
            <FormHelperText />
          </FormControl>
        </div>
      </Fragment>
    );
  };

  getInGroupfilterCampaignInformation = () => {
    const { filter_dnc_campaign } = this.state;
    return (
      <Fragment>
        <div
          className="col-md-12 col-12"
          data-title="User Agent"
          data-info="This field allows for a custom outbound routing extension. This allows you to use different call handling methods depending upon how you want to route calls through your outbound campaign. Formerly called Campaign VDAD extension.- 8368 - DEFAULT - Will send the call to the next available agent no matter what server they are on- 8369 - Used for Answering Machine Detection after that, same behavior as 8368."
          onMouseEnter={this.logMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <TextField
            id="dropActiondropext_filter_dnc_campaign"
            label="Filter DNC Campaign"
            margin="normal"
            onChange={this.handleChange("filter_dnc_campaign")}
            fullWidth
            value={filter_dnc_campaign}
            helperText="Leave empty if you do not want to change it"
          />
        </div>
      </Fragment>
    );
  };

  getData = e => {
    let _this = this;
    _this.setState({ isLoding: true });
    axios
      .get(API_FETCH_INBOUND_NUMBER_EDIT_DATA + this.state.pageTitle)
      .then(response => {
        //let campaignData = response.data.data;
        let numberData = response.data.data;
        console.log("=============================");
        console.log(numberData);
        _this.setState({
          //data: campaignData
          isLoding: false,
          did_pattern: numberData.did_pattern,
          did_pattern: numberData.did_pattern,
          did_description: numberData.did_description,
          did_active: numberData.did_active,
          record_call: numberData.record_call,
          list_id: numberData.list_id,
          did_route: numberData.did_route,
          user: numberData.user,
          filter_inbound_number: numberData.filter_inbound_number,
          group_id: numberData.group_id,
          agentUser: numberData.user,
          campaign_id: numberData.campaign_id,
          voiceValue: numberData.voicemail_ext,
          extension: numberData.extension,
          phone: numberData.phone,
          menu_id: numberData.menu_id,
          call_handle_method: numberData.call_handle_method,
          filter_url: numberData.filter_url,
          filter_url_did_redirect: numberData.filter_url_did_redirect,
          filter_dnc_campaign: numberData.filter_dnc_campaign
        });

        if (response.data.status === "Error") {
          _this.setState({ pageError: true });
        }
      })
      .catch(function(error) {
        createNotification("Error", "Error", error.response.data.msg);
      });
  };
  handleShowAlert = flag => {
    this.setState({ showAlert: flag });
  };

  handleShowAlert = flag => {
    this.setState({
      showAlert: flag
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      is_change: true
    });

    if (name == "scriptText") {
      this.setState({ scriptTextSelectionStart: event.target.selectionStart });
    } else if (name == "scriptField") {
      let newField =
        scriptTextFieldsPrefix + event.target.value + scriptTextFieldsPostfix;
      this.setState({
        scriptText:
          this.state.scriptText.slice(0, this.state.scriptTextSelectionStart) +
          newField +
          this.state.scriptText.slice(this.state.scriptTextSelectionStart + 1)
      });
    }
  };

  handleScriptTextClick = event => {
    this.setState({ scriptTextSelectionStart: event.target.selectionStart });
  };

  logMouseEnter = e => {
    this.setState({ showinfo: e.target.getAttribute("data-info") });
    this.setState({ showinfotitle: e.target.getAttribute("data-title") });
  };
  logMouseLeave = e => {
    if (e) {
      this.setState({ showinfotitle: "" });
    }
  };
  logNativeMouseLeave = () => {
    console.log("&nbsp;&nbsp;&nbsp;mouseleave (native)");
  };
  clearLog = () => {
    console.log();
  };

  handleActiveChange = (event, checked) => {
    this.setState({ did_active: checked ? "Y" : "N" });
  };

  handleSubmit = () => {
    let _this = this;
    _this.setState({ isLoding: true });
    let did_pattern = this.state.did_pattern;
    let did_description = this.state.did_description;

    let error = false;

    if (did_pattern == "") {
      this.setState({ did_patternError: true });
      error = true;
    } else {
      this.setState({ did_patternError: false });
    }

    if (did_description == "") {
      this.setState({ did_descriptionError: true });
      error = true;
    } else {
      this.setState({ did_descriptionError: false });
    }

    if (!error) {
      let postData = {
        did_pattern: this.state.did_pattern,
        did_description: this.state.did_description,
        did_active: this.state.did_active,
        record_call: this.state.record_call,
        list_id: this.state.list_id,
        did_route: this.state.did_route,
        extension: this.state.extension,
        voicemail_ext: this.state.voiceValue,
        phone: this.state.phone,
        menu_id: this.state.menu_id,
        user: this.state.user,
        group_id: this.state.group_id,
        call_handle_method: this.state.call_handle_method,
        filter_inbound_number: this.state.filter_inbound_number,
        filter_url: this.state.filter_url,
        filter_url_did_redirect: this.state.filter_url_did_redirect,
        filter_dnc_campaign: this.state.filter_dnc_campaign
      };

      let _this = this;
      axios
        .post(API_INBOUND_RECORD_DATA, postData)
        .then(response => {
          _this.setState({ isLoding: false });
          createNotification("success", "Success", response.data.msg);
        })

        .catch(function(error) {
          _this.setState({ isLoding: false });
          createNotification("Error", "Error", error.response.data.msg);
        });
    }
  };

  render() {
    const {
      pageTitle,
      pageError,
      showAlert,
      alertContent,
      alertTitle,
      scriptId,
      scriptActive,
      scriptIdError,
      scriptNameError,
      did_pattern,
      did_active,
      did_description,
      list_id,
      record_call,
      did_route,
      isLoding,
      filter_inbound_number,
      did_patternError,
      did_descriptionError,
      is_change
    } = this.state;

    if (pageTitle == "edit" && pageError) {
      return <div />;
    } else {
      return (
        <div>
          <ContainerHeader match={this.props.match} title={" Edit DID"} />
          {this.state.is_change && <ButtonNav click={this.handleSubmit} />}
          <div className="row">
            <SweetAlert
              show={showAlert}
              success={alertTitle === "Success" ? true : false}
              error={alertTitle === "Error" ? true : false}
              title={alertTitle}
              onConfirm={() => this.handleShowAlert(false)}
              onCancel={() => this.handleShowAlert(false)}
            >
              {alertContent}
            </SweetAlert>
            <div className="col-md-8 col-8">
              <div className="sub_menu_div" style={style_header}>
                {" "}
                <i className="fa fa-bars" style={{ marginRight: "10px" }} />
                Number: {pageTitle}
              </div>
            </div>
            <CardBox
              styleName="col-lg-8    "
              heading={pageTitle == "add" ? "Add new Group" : scriptId}
            >
              <form className="row" noValidate autoComplete="off">
                <div
                  className="col-md-6 col-6"
                  data-info="This is the number, extension or DID that will trigger this entry and that you will route within the system using this function."
                  data-title="DID Extension "
                  onMouseEnter={this.logMouseEnter}
                  onMouseLeave={this.logMouseLeave}
                >
                  <TextField
                    id="did_pattern"
                    onChange={this.handleChange("did_pattern")}
                    error={did_patternError}
                    label="DID Extension *"
                    value={did_pattern}
                    disabled={pageTitle == "add" ? false : true}
                    margin="normal"
                    fullWidth
                  />
                </div>

                <div
                  className="col-md-6 col-6"
                  onMouseEnter={this.logMouseEnte}
                  onMouseLeave={this.logMouseLeave}
                  data-info="This is the description of the DID routing entry."
                  data-title="DID Description"
                >
                  <TextField
                    id="did_description"
                    label="DID Description *"
                    value={did_description}
                    onChange={this.handleChange("did_description")}
                    margin="normal"
                    fullWidth
                    error={did_descriptionError}
                    data-title="Group Name"
                    data-info=" NOT  ............."
                  />
                </div>

                <div
                  className="col-md-12 col-12"
                  onMouseEnter={this.logMouseEnte}
                  onMouseLeave={this.logMouseLeave}
                  data-info="This the field where you set the DID entry to active or not. Default is Y."
                  data-title="Active"
                >
                  <p />
                  <p className="MuiFormHelperText-root-253"> Active </p>
                  <div className="row">
                    <Switch
                      value={did_active}
                      onChange={this.handleActiveChange}
                      label="Active"
                      checked={did_active == "Y" ? true : false}
                      color="primary"
                    />
                  </div>
                </div>

                <div
                  className="col-md-12 col-12"
                  data-title="Record Call"
                  data-info="This option allows you to set the calls coming into this DID to be recorded. Y will record the entire call, Y_QUEUESTOP will record the call until the call is hungup or enters an in-group queue, N will not record the call. Default is N."
                  onMouseEnter={this.logMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                >
                  <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple"> Record Call </InputLabel>
                    <Select
                      value={record_call}
                      onChange={this.handleChange("record_call")}
                      input={<Input id="age-simple" />}
                    >
                      {record_call_data &&
                        record_call_data.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {" "}
                            {option.label}
                          </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText />
                  </FormControl>
                </div>

                <div
                  className="col-md-12 col-12"
                  onMouseEnter={this.logMouseEnte}
                  onMouseLeave={this.logMouseLeave}
                  data-info="If IN_GROUP is selected as the DID Route, then this is the List ID that leads may be searched through and that leads will be inserted into if necessary."
                  data-title="In-Group List ID"
                >
                  <TextField
                    id="Group-Name"
                    label="In-Group List ID *"
                    value={list_id}
                    onChange={this.handleChange("list_id")}
                    margin="normal"
                    fullWidth
                    data-title="Group Name"
                    data-info=" NOT  ............."
                  />
                </div>

                <div
                  className="col-md-12 col-12"
                  data-title="DID Route"
                  data-info="This option if enabled allows you to filter calls coming into this DID and send them to an alternative action if they match a phone number."
                  onMouseEnter={this.logMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                >
                  <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple"> DID Route </InputLabel>
                    <Select
                      value={did_route}
                      onChange={this.handleChange("did_route")}
                      input={<Input id="age-simple" />}
                    >
                      {list_didRoute &&
                        list_didRoute.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {" "}
                            {option.label}
                          </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText />
                  </FormControl>
                </div>

                {this.getDynamicDrop(did_route)}

                <div className="col-xs-12" style={{ height: "30px" }} />

                <div
                  className="col-md-12 col-12"
                  data-title="Filter Inbound Number"
                  data-info="This option if enabled allows you to filter calls coming into this DID and send them to an alternative action if they match a phone number."
                  onMouseEnter={this.logMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                >
                  <div className="form-group">
                    <FormControl className="w-100 mb-2">
                      <InputLabel htmlFor="age-simple">
                        Filter Inbound Number
                      </InputLabel>
                      <Select
                        value={filter_inbound_number}
                        onChange={this.handleChange("filter_inbound_number")}
                        input={<Input id="age-simple" />}
                      >
                        {list_filter_inbound_number &&
                          list_filter_inbound_number.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {" "}
                              {option.label}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText />
                    </FormControl>
                  </div>
                </div>

                {this.getDynamicNumberDrop(filter_inbound_number)}
              </form>
            </CardBox>
            <div className="col-lg-4" style={{ display: "grid" }} />
          </div>
          {isLoding && (
            <div className="loader-view" id="loader-view">
              <CircularProgress />
            </div>
          )}
        </div>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    Global: state.globel
  };
}

const mapDispatchToProps = {
  fetchGlobal
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditScript)
);
