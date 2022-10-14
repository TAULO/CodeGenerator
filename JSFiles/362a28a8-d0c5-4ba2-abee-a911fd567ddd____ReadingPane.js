import React, { Component } from "react";
import moment from "moment";
import Theme from "../../Assets/Theme/Theme";
import { Avatar, Typography, Icon, Empty, Tabs, Spin } from "antd";
import ForwardDrawer from "./Components/ForwardDrawer";
import DownladDrawer from "./Components/DownloadDrawer";
import SonaVaultLogoArtboard10 from "../../Assets/icons/SV_ICONS/Sona Vault logo_Artboard 10.png";
// import RunIcon from '../../Assets/icons/SV_ICONS/Run_Orange.png';
import RecipientDrawer from "./Components/RecipentsDrawer";
import MetaData from "./Components/MetaData";
import Factoid from "./Components/FactoidAnswer";
import ReadingPaneModal from "./Components/ReadingPaneModal";
import { defineMessages } from "react-intl";
// import { GetAttachmentSave } from "../../Redux/Actions/SimpleSearchAction/SimpleSearchAction";
import { connect } from "react-redux";
import * as ApiInfo from "../../APIConfig/ApiParameters";
import likeStrokeIcon from '../../Assets/icons/Icon Library/Icon Library//RelevantOrange.png'
import dislikeStrokeIcon from '../../Assets/icons/Icon Library/Icon Library/NotRelevantOrange.png'
import styles from "../../styles";
import LabelDrawer from "./Components/LabelDrawer";
import { getPoliciesData } from "../../Screens/SearchArchive/utils";


const messages = defineMessages({
  "Message": {
    id: "ReadingPane.Message",
    defaultMessage: "Message"
  },
  "SonaVault System": {
    id: "ReadingPane.SonaVaultSystem",
    defaultMessage: "SonaVault System"
  },
  "To: ": {
    id: "ReadingPane.To",
    defaultMessage: "To: "
  },
  "Cc: ": {
    id: "ReadingPane.Cc",
    defaultMessage: "Cc: "
  },
  "Bcc: ": {
    id: "ReadingPane.Bcc",
    defaultMessage: "Bcc: "
  },
  "View Task Log": {
    id: "ReadingPane.ViewTaskLog",
    defaultMessage: "View Task Log"
  },
  "Metadata": {
    id: "ReadingPane.Metadata",
    defaultMessage: "Metadata"
  },
  "See All Recipients": {
    id: "ReadingPane.SeeAllRecipents",
    defaultMessage: "See All Recipients"
  },
  "See All Labels": {
    id: "ReadingPane.SeeAllLabels",
    defaultMessage: "See All Labels"
  },
  "show all": {
    id: "ReadingPane.ShowAll",
    defaultMessage: "show all"
  },
  "attachments": {
    id: "ReadingPane.attachments",
    defaultMessage: "attachments"
  },
  "Select an Item to read": {
    id: "ReadingPane.SelectAnItemToRead",
    defaultMessage: "Select an Item to read"
  }
});

const { Title, Text } = Typography;
const { color } = Theme;
const { TabPane } = Tabs;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

function styleLabels(labels) {
  return labels.map((label, index) => (
    <div key={index} style={{ padding: "3px 0" }}>
      <Text
        style={{
          color: "#fff",
          padding: 1,
          backgroundColor: `${label.type === "global" ? "purple" : "blue"}`
        }}
      >
        {label.label}
      </Text>
    </div>
  ));
}
function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

class ReadingPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "0",
      initialValueImage: 4,
      initialValueDocs: 3,
      globalLabels: [],
      legalLabels: [],
      labels: []
    };
    this.attachements = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    try {
      const { attachment } = props;
      let imageArray = document.getElementsByTagName("img");
      let imageTags = [...imageArray];
      let attachmentsArray = [...attachment];
      if (attachment && attachment.length) {
        for (let index = 0; index < imageTags.length; index++) {
          if (imageArray[index].src && imageArray[index].src.includes("cid")) {
            for (let i = 0; i < attachmentsArray.length; i++) {
              if (attachmentsArray[i].content_header && attachmentsArray[i].content_header["content-id"] && attachmentsArray[i].content_header["content-id"][0]) {
                if ((attachmentsArray[i].content_header["content-id"][0].slice(1, attachmentsArray[i].content_header["content-id"][0].length - 1
                ) === imageArray[index].src.slice(4))) {
                  imageArray[index].src = `data:image/${attachmentsArray[i].extension};base64,${attachmentsArray[i].raw}`
                  attachment[i].embeddedAttachment = true
                }
              }
              else if (imageArray[index].src.slice(4) === attachmentsArray[i].filename) {
                imageArray[index].src = `data:image/${attachmentsArray[i].extension};base64,${attachmentsArray[i].raw}`
                attachment[i].embeddedAttachment = true
              }
            }
          }
        }
      }


    } catch (e) {
      ApiInfo.DEBUGER && console.log(e.message);
    }
    return null;
  }

  sortAttachment() {
    const { attachment } = this.props;
    if (attachment) {
      // GetAttachmentSave(attachment);
      // let response = [];
      // attachment.forEach(attach => {
      //   if (
      //     attach.content_header &&
      //     (!attach.content_header["content-id"] ||
      //       (Array.isArray(attach.content_header["content-id"]) &&
      //         attach.content_header["content-id"].length === 0))
      //   ) {
      //     response.push(attach);
      //   }
      // });
      let images = [], docs = [];
      attachment.forEach((val) => {
        if (!val.embeddedAttachment) {
          (val.extension === "png" || val.extension === "jpeg" || val.extension === "jpg") ? images.push(val)
            : docs.push(val);
        }
      });
      return {
        imagesAttachment: images,
        docsAttachment: docs
      };
    }
  }
  openForwardDrawer = () => {
    this.setState({
      forward: true
    });
  };

  closeForwardDrawer = () => {
    this.setState({
      forward: false
    });
  };

  openReadingPaneView = async () => {
    try {
      const {
        openedEmail,
        attachment,
        has_attachment,
        message_body,
        smartSearch,
        onHold,
        legalHoldId,
        legalHoldAutoLabels,
        simpleSearch
        // formatMessage
      } = this.props;
      let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,width=${window.screen.width},height=${window.screen.height},left=-1000,top=-1000`;
      const newWindow = window.open("/readingpanemodal", "test", params);
      newWindow.openedEmail = openedEmail;
      newWindow.attachment = attachment;
      newWindow.has_attachment = has_attachment;
      // newWindow.formatMessage = formatMessage;
      newWindow.message_body = message_body;
      newWindow.smartSearch = smartSearch;
      newWindow.onHold = onHold;
      newWindow.legalHoldId = legalHoldId;
      newWindow.legalHoldAutoLabels = onHold ? legalHoldAutoLabels : simpleSearch && simpleSearch.LabelType;
    } catch (e) {
      ApiInfo.DEBUGER && console.log(e.message);
    }
  };
  closeReadingPaneView = () => {
    this.setState({
      ReadingPaneView: false
    });
  };

  openDownloadDrawer = () => {
    this.setState({
      download: true
    });
  };
  closeDownlaodDrawer = () => {
    this.setState({
      download: false
    });
  };
  b64toBlob = (b64Data, contentType, sliceSize, filename) => {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename + "." + contentType);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return blob;
  };

  openRecipientsDrawer = (recipents, title) => {
    this.setState({
      recipents: recipents,
      recipentsDrawer: true,
    });
  };

  openLabelDrawer = (email) => {
    this.setState({
      labelDrawer: true,
      email
    });
  };

  closeRecipientDrawer = () => {
    this.setState({
      recipentsDrawer: false
    });
  };

  closeLabelDrawer = () => {
    this.setState({
      labelDrawer: false,
      // recipentsDrawer: false
    });
  };

  handleTabChange = key => {
    this.setState({
      tabKey: key
    });
  };
  onHover = id => {
    if (
      document.getElementById(
        this.props.ReadingPaneViewModal ? id + "Modal" : id
      )
    ) {
      document.getElementById(
        this.props.ReadingPaneViewModal ? id + "Modal" : id
      ).style.display = "flex";
    }
  };
  onLeave = id => {
    if (
      document.getElementById(
        this.props.ReadingPaneViewModal ? id + "Modal" : id
      )
    ) {
      document.getElementById(
        this.props.ReadingPaneViewModal ? id + "Modal" : id
      ).style.display = "none";
    }
  };

  showAllAttachments = (docs, images) => {
    (docs > 3 && images > 4) || docs > 3 || images > 4
      ? this.setState({ initialValueDocs: docs, initialValueImage: images })
      : this.setState({ initialValueDocs: 3, initialValueImage: 4 });
  };

  componentDidUpdate() {
    ReadingPane.getDerivedStateFromProps(this.props, this.state);

  }

  // getLabelTypeColorName = (label) => {
  //   try {
  //     const { simpleSearch, legalHoldAutoLabels, globalAutoLabels, onHold } = this.props;
  //     let policyData;
  //     if (onHold) {
  //       policyData = legalHoldAutoLabels && legalHoldAutoLabels.length > 0 ? legalHoldAutoLabels : (simpleSearch && simpleSearch.LabelType && simpleSearch.LabelType.length > 0 ? simpleSearch.LabelType : [])
  //     } else {
  //       policyData = globalAutoLabels && globalAutoLabels.length > 0 ? globalAutoLabels : (legalHoldAutoLabels && legalHoldAutoLabels.legnth > 0 ? legalHoldAutoLabels : (simpleSearch && simpleSearch.LabelType && simpleSearch.LabelType.length > 0 ? simpleSearch.LabelType : []))
  //     }
  //     const containAllData = {};
  //     const policyId = label.split("-") && label.split("-")[0] && !isNaN(label.split("-")[0]) && Number(label.split("-")[0]);
  //     const labelId = label.split("-") && label.split("-")[0] && !isNaN(label.split("-")[1]) && Number(label.split("-")[1]);
  //     const caseId = label.split("-") && label.split("-")[2] && !isNaN(label.split("-")[2]) && Number(label.split("-")[2]);
  //     let policy = String(policyId) && policyData &&
  //       policyData.filter(policy => !isNaN(policy.FILTER_ID) && Number(policy.FILTER_ID) === policyId);
  //     policy = policy && policy.length && policy[0];
  //     let labelIndex = policy && policy.LABEL_ID && String(labelId) && policy.LABEL_ID.split(",") && policy.LABEL_ID.split(",").indexOf(String(labelId))
  //     containAllData.labelName = policy && policy.LABEL_NAME && String(labelIndex) && policy.LABEL_NAME.split(",") && policy.LABEL_NAME.split(",")[labelIndex]
  //     containAllData.labelType = policy && policy.FILTER_TYPE
  //     containAllData.color = policy && policy.COLOR_CODE && policy.COLOR_CODE.split(",") && policy.COLOR_CODE.split(",")[0];
  //     containAllData.caseId = caseId
  //     return containAllData
  //   }
  //   catch (e) { console.log(e.message) }
  // }



  // renderLabelsIntoReadingPane = () => {
  //   try {
  //     const { openedEmail, onHold, legalHoldId, legalHoldAutoLabels, simpleSearch } = this.props
  //     const allPolicies = onHold ? legalHoldAutoLabels : simpleSearch
  //     const labelsArray = openedEmail[0]._source.label_policy || [];
  //     let labels, containAllData;
  //     if (labelsArray.length > 0) {
  //       labels = labelsArray.map((ids, ind) => {
  //         containAllData = getLabelTypeColorName(ids, allPolicies, onHold)
  //         const { labelType, labelName, color, caseId } = containAllData;
  //         if (labelType === 'G') return this.returnJsxOfLabel(color, labelName, ind, 'global')
  //         else if (labelType === "L" && onHold && caseId && String(caseId) && legalHoldId && String(legalHoldId) && String(caseId) === String(legalHoldId)) return this.returnJsxOfLabel(color, labelName, ind, 'folder')
  //         else return null;
  //       })
  //     }
  //     return labels
  //   } catch (e) { console.log(e.message) }
  // }


  returnJsxOfLabel = (color, labelName, ind, labelType) => {
    return (
      <div key={ind} style={{ backgroundColor: `${color}`, ...styles.labelDropdownStyle }}>
        <Icon type={labelType} style={{ ...styles.labelDropdownStyle }} />
        {labelName}
      </div>
    )
  }

  render() {

    const {
      forward,
      download,
      recipentsDrawer,
      recipents,
      tabKey,
      initialValueImage,
      initialValueDocs,
      ReadingPaneView,
      DrawerTitle,
      labelDrawer
    } = this.state;

    const {
      closeReadingPane,
      openedEmail,
      forwardAction,
      notificationReadingPane,
      formatMessage,
      ReadingPaneViewModal,
      close,
      attachment,
      has_attachment,
      smartSearch,
      onHold,
      legalHoldId,
      legalHoldAutoLabels,
      simpleSearch,
      labelDataFromModal,
      modal
    } = this.props;
    let message_body, subject, sortedAttachment, role;
    let allLabelsJsx = getPoliciesData(
      openedEmail && openedEmail[0]._source.label_policy,
      this.openLabelDrawer,
      modal ? labelDataFromModal : legalHoldAutoLabels || (simpleSearch && simpleSearch.LabelType),
      onHold,
      legalHoldId
    )
    try {
      if (openedEmail[0].highlight && openedEmail[0].highlight.html_body && openedEmail[0].highlight.html_body[0]) {
        message_body = {
          content: openedEmail[0].highlight.html_body[0],
          content_type: "text/html"
        }
      } else if (openedEmail[0].highlight && openedEmail[0].highlight.message_body && openedEmail[0].highlight.message_body[0]) {
        message_body = {
          content: openedEmail[0].highlight.message_body[0],
          content_type: "text/plain"
        }
      } else if (openedEmail[0]._source.html_body) {
        message_body = {
          content: openedEmail[0]._source.html_body,
          content_type: "text/html"
        }
      } else {
        message_body = {
          content: openedEmail[0]._source.message_body,
          content_type: "text/plain"
        }
      }
      if (openedEmail[0].highlight && openedEmail[0].highlight.subject) {
        subject = openedEmail[0].highlight.subject
      } else if (openedEmail[0].highlight && openedEmail[0].highlight["subject.keyword"]) {
        subject = openedEmail[0].highlight["subject.keyword"]
      } else {
        subject = openedEmail[0]._source.subject
      }
      sortedAttachment = attachment && this.sortAttachment();
      // this.props.GetAttachmentSave(sortedAttachment);
      let userInfo = localStorage.getItem("userInfo");
      userInfo = JSON.parse(userInfo);
      role = userInfo.data.data.output[0].role;
    } catch (e) {
      ApiInfo.DEBUGER && console.log(e.message);
    }
    try {
      if (message_body && message_body.content_type === "text/plain") {
        if (message_body.content && typeof (message_body.content) === "string" && message_body.content.length) {
          message_body.content = message_body.content.split("\n").join("<br />")
        }
      }
    } catch (e) { }
    return notificationReadingPane ? (
      <div style={{ width: "100%", overflow: "auto", marginTop: -10 }}>
        <div
          style={{
            display: "flex",
            height: 40,
            backgroundColor: `${color.Dark}`,
            justifyContent: "space-between",
            width: "100%",
            postion: "fixed"
          }}
        >
          <div className="card-container">
            <Tabs type="card">
              <TabPane
                tab={formatMessage(messages["Message"])}
                key="Message"
              ></TabPane>
            </Tabs>
          </div>
          {closeReadingPane && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "5%",
                color: "#fff",
                zIndex: 2
              }}
            >
              <Icon
                type="close"
                style={{
                  color: "#fff",
                  fontSize: 18,
                  cursor: "pointer",
                  zIndex: 2
                }}
                onClick={() => closeReadingPane()}
              />
            </div>
          )}
        </div>
        <div
          style={{
            width: "100%",
            height: "-webkit-fill-available",
            padding: 20
          }}
        >
          {openedEmail ? (
            <div style={{ width: "100%" }}>
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    padding: "10px 0px 25px 0",
                    display: "flex",
                    borderBottom: `1px solid grey`
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      display: "flex",
                      justifyContent: "center"
                    }}
                  >
                    <img
                      src={SonaVaultLogoArtboard10}
                      height={48}
                      width={48}
                      alt=""
                    />
                  </div>
                  <div style={{ width: "100%", padding: "0px 30px" }}>
                    <Title level={4} style={{ marginTop: -5, padding: 0 }}>
                      {formatMessage(messages["SonaVault System"])}
                    </Title>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: 15,
                        marginTop: 10
                      }}
                    >
                      <Text>{formatMessage(messages["To: "])}</Text>
                      <Text>{openedEmail.name}</Text>
                      <Text style={{ color: color.Black40 }}>
                        {openedEmail.sent}
                      </Text>
                    </div>
                  </div>
                  <div style={{ width: "inherit" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%"
                      }}
                    >
                      <div
                        style={{ cursor: "pointer", padding: "0 10px" }}
                      ></div>
                    </div>
                    <div style={{ marginTop: 5 }}>
                      {openedEmail.labels &&
                        openedEmail.labels.length !== 0 &&
                        styleLabels(openedEmail.labels)}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div style={{ height: 70, borderBottom: "2px solid grey", display: "flex", alignItems: "center", paddingLeft: 30 }}>
                  <img src={RunIcon} title="Run" alt="Run" height={28} />
                  <div style={{ displasy: "flex", flexDirection: "column", marginLeft: 18 }}>
                    <Text>{formatMessage(messages["View Task Log"])}</Text>
                  </div>
                </div> */}
              <div style={{ padding: 25, height: "50px" }}>
                <Text>{openedEmail.snippet}</Text>
              </div>
            </div>
          ) : (

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: "inherit",
                  alignContent: "center",
                  width: "100%"
                }}
              >
                <Empty
                  style={{ width: "100%", height: "inherit", marginTop: "20%" }}
                  image={require(`../../Assets/icons/noSelection.svg`)}
                  description={
                    <span>
                      {formatMessage(messages["Select an Item to read"])}
                    </span>
                  }
                />
              </div>
            )}
        </div>
      </div>
    ) : (
        <div style={{ width: "100%", overflow: "auto" }}>
          {ReadingPaneView && (
            <ReadingPaneModal
              message_body={message_body}
              formatMessage={formatMessage}
              attachment={this.props.attachment}
              has_attachment={this.props.has_attachment}
              openedEmail={openedEmail}
              open={() => this.openReadingPaneView()}
              close={() => this.closeReadingPaneView()}
              smartSearch={smartSearch}
            />
          )}
          <LabelDrawer
            ReadingPaneViewModal={ReadingPaneViewModal}
            formatMessage={formatMessage}
            forward={forward}
            close={() => this.closeLabelDrawer()}
            labelDrawer={labelDrawer}
            openedEmail={openedEmail && openedEmail[0] && openedEmail[0]._source.label_policy}
            currentCaseId={legalHoldId}
            onHold={onHold}
            labelDataFromModal={labelDataFromModal}
          />

          <ForwardDrawer
            ReadingPaneViewModal={ReadingPaneViewModal}
            formatMessage={formatMessage}
            forward={forward}
            close={() => this.closeForwardDrawer()}
            openedEmail={openedEmail}
          />
          <DownladDrawer
            ReadingPaneViewModal={ReadingPaneViewModal}
            formatMessage={formatMessage}
            download={download}
            close={() => this.closeDownlaodDrawer()}
            openedEmail={openedEmail}
          />
          <RecipientDrawer
            ReadingPaneViewModal={ReadingPaneViewModal}
            formatMessage={formatMessage}
            recipentsDrawer={recipentsDrawer}
            recipents={recipents}
            close={() => this.closeRecipientDrawer()}
            title={DrawerTitle}
          />

          <div
            style={
              ReadingPaneViewModal
                ? {
                  display: "flex",
                  height: 39,
                  zIndex: 2,
                  backgroundColor: `${color.Dark}`,
                  justifyContent: "space-between",
                  width: "inherit"
                }
                : {
                  display: "flex",
                  height: 39,
                  zIndex: 2,
                  backgroundColor: `${color.Dark}`,
                  justifyContent: "space-between",
                  width: "100%"
                }
            }
          >
            <div className="card-container" style={{ zIndex: 2 }}>
              <Tabs
                type="card"
                tabBarStyle={{
                  width: "100%",
                  position: `${
                    this.props.noFixed || ReadingPaneViewModal
                      ? "static"
                      : "fixed"
                    }`
                }}
                onChange={this.handleTabChange}
              >
                <TabPane
                  tab={formatMessage(messages["Message"])}
                  key="0"
                />
                <TabPane
                  tab={formatMessage(messages["Metadata"])}
                  key="1"
                />
                {smartSearch && <TabPane
                  tab="Factoid Answer"
                  key="2"
                />}
              </Tabs>
            </div>
            {closeReadingPane && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "30px",
                  color: "#fff",
                  zIndex: 11,
                  padding: "0px 0 0 0"
                }}
              >
                <Icon
                  type="close"
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    cursor: "pointer",
                    position: "fixed"
                  }}
                  onClick={
                    !ReadingPaneViewModal
                      ? () => closeReadingPane()
                      : () => close()
                  }
                />
              </div>
            )}
          </div>
          {/* <div style={{ width: "100%", height: "inherit", }}> */}
          {openedEmail && openedEmail[0] ? (
            <div style={{ width: "100%", height: "inherit" }}>
              <div
                style={{
                  padding: "15px 0 0 10px",
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between"
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around"
                  }}
                >
                  <div style={{}}>
                    <Avatar
                      icon="user"
                      style={{ paddingTop: 5 }}
                    />
                  </div>
                  <div style={{ width: "95%" }}>
                    <div style={{ display: "flex", width: "100%" }}>
                      <div style={{ float: "right" }}>
                        {openedEmail[0]._source &&
                          openedEmail[0]._source.from &&
                          openedEmail[0]._source.from.length > 0 && (
                            <Title
                              title={openedEmail[0]._source.from[0]}
                              level={4}
                              style={{
                                margin: 0,
                                padding: 0,
                                marginLeft: 4,
                                width: "max-content"
                              }}
                            >
                              {openedEmail[0]._source.from[0].slice(0, 40)}
                              {openedEmail[0]._source.from[0].length > 40
                                ? "..."
                                : ""}
                            </Title>
                          )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          width: "inherit",
                          justifyContent: "flex-end"
                        }}
                      >
                        {smartSearch && (
                          <div style={{ cursor: "pointer", display: 'flex' }}>
                            <img
                              src={likeStrokeIcon}
                              alt='like'
                              style={{ width: 33, height: 'auto' }}
                            />
                            <img
                              src={dislikeStrokeIcon}
                              alt='like'
                              style={{ width: 33, height: 'auto' }}
                            />
                            {/* <div
                              style={{
                                borderLeft: `1px solid ${color.Black40}`,
                                height: 30,
                              }}
                            /> */}
                          </div>
                        )}
                        {forwardAction && (
                          <div style={{ cursor: "pointer", padding: "0 10px" }}>
                            <img
                              title="Forward"
                              src={require("../../Assets/icons/SV_ICONS/Forward_Orange.png")}
                              onClick={() => this.openForwardDrawer()}
                              alt=""
                              style={{ cursor: "pointer" }}
                              width={28}
                              height={28}
                            />
                          </div>
                        )}
                        <div style={{ paddingRight: 10 }}>
                          <img
                            title="Download"
                            src={require("../../Assets/icons/SV_ICONS/Download_Orange.png")}
                            onClick={() => this.openDownloadDrawer()}
                            alt=""
                            style={{ cursor: "pointer" }}
                            width={28}
                            height={28}
                          />
                        </div>
                        <div
                          style={{
                            borderLeft: `1px solid ${color.Black40}`,
                            height: 30,
                            padding: "0 10px"
                          }}
                        >
                          <img
                            title="Secure"
                            src={require("../../Assets/icons/SV_ICONS/Security_Blue.png")}
                            alt=""
                            style={{ cursor: "pointer" }}
                            width={28}
                            height="28"
                          />
                        </div>
                        {!ReadingPaneViewModal &&
                          <div style={{ paddingRight: 10 }}>
                            <img
                              title="Pop Out"
                              src={require("../../Assets/icons/SV_ICONS/Expand_Blue.png")}
                              onClick={() => this.openReadingPaneView()}
                              alt=""
                              style={{ cursor: "pointer" }}
                              width={28}
                              height={28}
                            />
                          </div>
                        }
                      </div>

                    </div>
                    <div style={{ marginTop: 7 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: allLabelsJsx && 
                        ((Array.isArray(allLabelsJsx) && allLabelsJsx.length) ||
                         (Object.keys(allLabelsJsx) && Object.keys(allLabelsJsx).length)) ? "70%" : "100%" }}>
                          {!ReadingPaneViewModal ? (
                            <div>
                              {openedEmail[0]._source &&
                                openedEmail[0]._source.to &&
                                Array.isArray(openedEmail[0]._source.to) &&
                                openedEmail[0]._source.to.length > 0 &&
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                  <Text style={{ display: 'flex', flexDirection: 'row', maxWidth: "39vw", whiteSpace: "nowrap", overflow: "hidden", overflowX: "ellipsis" }}>
                                    {formatMessage(messages["To: "])}&nbsp;{" "}
                                    {
                                      openedEmail[0]._source.to.map((val, index) =>
                                        (index === 0) ? (
                                          <Text key={index} title={val}>
                                            {val.slice(0, val.indexOf("@"))}
                                          </Text>
                                        ) : (
                                            (index > 0) && (
                                              <Text key={index} title={val}>
                                                {", " + val.slice(0, val.indexOf("@"))}
                                              </Text>
                                            )
                                          )
                                      )}
                                  </Text>
                                  {openedEmail[0]._source &&
                                    openedEmail[0]._source.to &&
                                    openedEmail[0]._source.to.length > 4 &&
                                    <span onClick={() =>
                                      this.openRecipientsDrawer(openedEmail[0]._source.to)}
                                      style={{
                                        width: 'auto',
                                        float: 'left',
                                        marginLeft: 5,
                                        fontSize: 12,
                                        cursor: "pointer",
                                        color: "blue"
                                      }} title={this.props.formatMessage(messages['See All Recipients'])}>
                                      >>
                               </span>
                                  }
                                </div>
                              }

                              {openedEmail[0]._source &&
                                openedEmail[0]._source.cc &&
                                Array.isArray(openedEmail[0]._source.cc) &&
                                openedEmail[0]._source.cc.length > 0 &&
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                  <Text style={{ display: 'flex', flexDirection: 'row', maxWidth: "39vw", whiteSpace: "nowrap", overflow: "hidden", overflowX: "ellipsis" }}>
                                    {formatMessage(messages["Cc: "])}&nbsp;{" "}
                                    {
                                      openedEmail[0]._source.cc.map((val, index) =>
                                        (index === 0) ? (
                                          <Text key={index} title={val}>
                                            {val.slice(0, val.indexOf("@"))}
                                          </Text>
                                        ) : (
                                            (index > 0) && (
                                              <Text key={index} title={val}>
                                                {", " + val.slice(0, val.indexOf("@"))}
                                              </Text>
                                            )
                                          )
                                      )}
                                  </Text>
                                  {openedEmail[0]._source &&
                                    openedEmail[0]._source.cc &&
                                    openedEmail[0]._source.cc.length > 4 &&
                                    <span
                                      onClick={() => this.openRecipientsDrawer(openedEmail[0]._source.cc, 'Recipients')
                                      }
                                      style={{
                                        width: 'auto',
                                        float: 'left',
                                        marginLeft: 5,
                                        fontSize: 12,
                                        cursor: "pointer",
                                        color: "blue"
                                      }}
                                      title={formatMessage(
                                        messages["See All Recipients"]
                                      )}
                                    >
                                      >>
                                    </span>
                                  }
                                </div>
                              }

                              {role === "EAS ADMINISTRATOR" &&
                                openedEmail[0]._source &&
                                openedEmail[0]._source.bcc &&
                                Array.isArray(openedEmail[0]._source.bcc) &&
                                openedEmail[0]._source.bcc.length > 0 &&
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                  <Text style={{ display: 'flex', flexDirection: 'row', maxWidth: "39vw", whiteSpace: "nowrap", overflow: "hidden", overflowX: "ellipsis" }}>
                                    {formatMessage(messages["Bcc: "])}&nbsp;{" "}
                                    {
                                      openedEmail[0]._source.bcc.map((val, index) =>
                                        (index === 0) ? (
                                          <Text key={index} title={val}>
                                            {val.slice(0, val.indexOf("@"))}
                                          </Text>
                                        ) : (
                                            (index > 0) && (
                                              <Text key={index} title={val}>
                                                {", " + val.slice(0, val.indexOf("@"))}
                                              </Text>
                                            )
                                          )
                                      )}
                                  </Text>
                                  {openedEmail[0]._source &&
                                    openedEmail[0]._source.bcc &&
                                    openedEmail[0]._source.bcc.length > 4 &&
                                    <span
                                      onClick={() =>
                                        this.openRecipientsDrawer(
                                          openedEmail[0]._source.bcc

                                        )
                                      }
                                      style={{
                                        width: 'auto',
                                        float: 'left',
                                        marginLeft: 5,
                                        fontSize: 12,
                                        cursor: "pointer",
                                        color: "blue"
                                      }}
                                      title={formatMessage(
                                        messages["See All Recipients"]
                                      )}
                                    >
                                      >>
                                      </span>
                                  }
                                </div>
                              }
                            </div>
                          ) : (
                              <div>
                                {openedEmail[0]._source &&
                                  openedEmail[0]._source.to &&
                                  Array.isArray(openedEmail[0]._source.to) &&
                                  openedEmail[0]._source.to.length > 0 &&
                                  <Text style={{ display: "flex", flexWrap: "wrap" }}>
                                    {formatMessage(messages["To: "])}&nbsp;{" "}
                                    {
                                      openedEmail[0]._source.to.map((val, index) =>
                                        index !== openedEmail[0]._source.to.length - 1 ? (
                                          <Text key={index}>{val}&nbsp;</Text>
                                        ) : (
                                            <Text key={index}>{", " + val}</Text>
                                          )
                                      )}
                                  </Text>
                                }
                                {openedEmail[0]._source &&
                                  openedEmail[0]._source.cc &&
                                  Array.isArray(openedEmail[0]._source.cc) &&
                                  openedEmail[0]._source.cc.length > 0 &&
                                  <Text style={{ display: "flex", flexWrap: "wrap" }}>
                                    Cc: &nbsp;{" "}
                                    {
                                      openedEmail[0]._source.cc.map((val, index) =>
                                        index !== openedEmail[0]._source.to.length - 1 ? (
                                          <Text key={index}>{val}&nbsp;</Text>
                                        ) : (
                                            <Text key={index}>{", " + val}</Text>
                                          )
                                      )}
                                  </Text>
                                }
                                {role === "EAS ADMINISTRATOR" &&
                                  openedEmail[0]._source &&
                                  openedEmail[0]._source.bcc &&
                                  Array.isArray(openedEmail[0]._source.bcc) &&
                                  openedEmail[0]._source.bcc.length > 0 &&
                                  <Text style={{ display: "flex", flexWrap: "wrap" }}>
                                    Bcc: &nbsp;{" "}
                                    {
                                      openedEmail[0]._source.bcc.map((val, index) =>
                                        index !==
                                          openedEmail[0]._source.to.length - 1 ? (
                                            <Text key={index}>{val}&nbsp;</Text>
                                          ) : (
                                            <Text key={index}>{", " + val}</Text>
                                          )
                                      )}
                                  </Text>
                                }

                              </div>
                            )}

                          <div style={{ margin: "0px 0", width: "100%" }}>
                            <p style={{ display: "flex", flexWrap: "wrap" }}>
                              {openedEmail[0]._source &&
                                openedEmail[0]._source &&
                                openedEmail[0]._source.header &&
                                openedEmail[0]._source.header.date && (
                                  <span style={{ color: color.Black40 }}>
                                    {(moment.utc(openedEmail[0]._source.header.date).format(
                                      "LLLL"
                                    ) === "Invalid date" ? openedEmail[0]._source.header.date : moment.utc(openedEmail[0]._source.header.date).format("LLLL"))}
                                  </span>
                                )}
                            </p>
                          </div>
                        </div>
                        {/* div1 */}
                        <div style={{ padding: '0px 10px', width: '30%', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                          {allLabelsJsx}
                        </div>
                      </div>
                      <p
                        style={{ fontSize: 17, padding: 0, margin: 0, width: allLabelsJsx && ((Array.isArray(allLabelsJsx) && allLabelsJsx.length) || (Object.keys(allLabelsJsx) && Object.keys(allLabelsJsx).length)) ? "50%" : "100%" }}
                        dangerouslySetInnerHTML={{ __html: subject }}
                      ></p>
                    </div>
                  </div>
                </div>
              </div>
              {has_attachment && attachment && attachment.length === 0 && (
                <div
                  style={{
                    width: "auto",
                    display: "flex",
                    justifyContent: "center",
                    borderTop: `1px solid ${color.Black10}`,
                    paddingTop: "10px"
                  }}
                >
                  <div>
                    <Spin indicator={antIcon} tip="Loading attachments.." />
                  </div>
                </div>
              )}
              {has_attachment &&
                attachment &&
                ((sortedAttachment &&
                  sortedAttachment.imagesAttachment.length > 0) ||
                  (sortedAttachment && sortedAttachment.docsAttachment.length > 0)) && (
                  <div
                    ref={this.attachements}
                    style={{
                      borderTop: `1px solid ${color.Black10}`,
                      paddingTop: "10px",
                      display: "flex",
                      flexDirection: "column",
                      overflowY: "auto"
                    }}
                  >
                    <div
                      style={{ display: "flex", flexWrap: "wrap", marginLeft: 5 }}
                    >
                      {sortedAttachment &&
                        sortedAttachment.imagesAttachment &&
                        sortedAttachment.imagesAttachment.map((val, index) => {
                          return (
                            index < initialValueImage && (
                              <div
                                key={index}
                                onClick={() =>
                                  this.b64toBlob(
                                    val.raw,
                                    val.extension,
                                    500,
                                    val.filename
                                  )
                                }
                                title={val.filename}
                                style={{
                                  marginRight: 10,
                                  marginBottom: 10,
                                  cursor: "pointer",
                                  position: "relative",
                                  border: "1px solid lightgrey"
                                }}
                              >
                                <img
                                  style={{ borderRadius: 3 }}
                                  onMouseOver={() => {
                                    this.onHover(val.filename + index);
                                  }}
                                  onMouseLeave={() => {
                                    this.onLeave(val.filename + index);
                                  }}
                                  alt=""
                                  width={140}
                                  height={120}
                                  src={`data:image/${val.extension};base64,${val.raw}`}
                                />
                                <div
                                  id={
                                    ReadingPaneViewModal
                                      ? val.filename + index + "Modal"
                                      : val.filename + index
                                  }
                                  onMouseOver={() => {
                                    this.onHover(val.filename + index);
                                  }}
                                  onMouseLeave={() => {
                                    this.onLeave(val.filename + index);
                                  }}
                                  style={{
                                    display: "none",
                                    flexDirection: "column",
                                    height: 38,
                                    width: 140,
                                    padding: 2,
                                    position: "absolute",
                                    marginTop: -37,
                                    backgroundColor: "#3a39398f"
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      cursor: "pointer",
                                      color: "#fff"
                                    }}
                                  >
                                    {val.filename.includes(val.extension)
                                      ? val.filename.length > 13
                                        ? val.filename
                                          .slice(
                                            0,
                                            val.filename.indexOf(
                                              val.extension
                                            ) - 1
                                          )
                                          .slice(0, 13) +
                                        "...." +
                                        (val.extension || "")
                                        : val.filename
                                      : val.filename > 13
                                        ? val.filename.slice(0, 13) +
                                        "...." +
                                        (val.extension || "")
                                        : val.filename + (val.extension || "")}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 8,
                                      cursor: "pointer",
                                      color: "#fff"
                                    }}
                                  >
                                    {bytesToSize(val.size)}
                                  </Text>
                                </div>
                              </div>
                            )
                          );
                        })}
                    </div>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", marginLeft: 5 }}
                    >
                      {sortedAttachment &&
                        sortedAttachment.docsAttachment &&
                        sortedAttachment.docsAttachment.map((val, index) => {
                          let icon = val.extension === "png" ? "PNG.png"
                            : val.extension === "xlsx" || val.extension === "xls" ? "Excel.png"
                              : val.extension === "txt" ? "TXT.png" : val.extension === "docx"
                                ? "Word.png" : val.extension === "pdf" ? "PDF.png" : val.extension === "ppt"
                                  ? "PowerPoint.png" : (val.extension === "jpg" || val.extension === "jpeg") && "JPG.png";
                          return (
                            index < initialValueDocs && (
                              <div
                                key={index}
                                title={val.filename}
                                onClick={() => this.b64toBlob(val.raw, val.extension, 500, val.filename)}
                                style={{
                                  cursor: "pointer",
                                  border: "1px solid rgb(200,198,196)",
                                  width: 210,
                                  marginRight: 10,
                                  display: "flex",
                                  marginBottom: 10
                                }}
                              >
                                {icon ? (
                                  <img
                                    alt=""
                                    width={48}
                                    src={require(`../../Assets/icons/File Types/${icon}`)}
                                  />
                                ) : (
                                    <Icon
                                      type="file"
                                      style={{ fontSize: 38, padding: 5 }}
                                    />
                                  )}
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: 38,
                                    paddingTop: 10
                                  }}
                                >
                                  <Text
                                    style={{ fontSize: 14, cursor: "pointer" }}
                                  >
                                    {val &&
                                      val.filename &&
                                      val.filename.includes(val.extension)
                                      ? val &&
                                        val.filename &&
                                        val.filename.length > 13
                                        ? val.filename
                                          .slice(
                                            0,
                                            val.filename.indexOf(
                                              val.extension
                                            ) - 1
                                          )
                                          .slice(0, 13) +
                                        "...." +
                                        val.extension || ""
                                        : val.filename
                                      : val &&
                                        val.filename &&
                                        val.filename.length > 13
                                        ? val.filename.slice(0, 13) +
                                        "...." +
                                        (val.extension || "")
                                        : val &&
                                        val.filename &&
                                        val.filename + (val.extension || "")}
                                  </Text>
                                  <Text
                                    style={{ fontSize: 10, cursor: "pointer" }}
                                  >
                                    {bytesToSize(val.size)}
                                  </Text>
                                </div>
                              </div>
                            )
                          );
                        })}
                    </div>
                    <div
                      style={{ display: "block" }}
                      onClick={() =>
                        this.showAllAttachments(
                          sortedAttachment.docsAttachment.length >
                            initialValueDocs
                            ? sortedAttachment.docsAttachment.length
                            : 3,
                          sortedAttachment.imagesAttachment.length >
                            initialValueImage
                            ? sortedAttachment.imagesAttachment.length
                            : 4
                        )
                      }
                    >
                      {(sortedAttachment.docsAttachment.length > 3 ||
                        sortedAttachment.imagesAttachment.length > 4) && (
                          <img
                            title=""
                            src={
                              (initialValueImage <= 4 || initialValueDocs <= 3) &&
                                initialValueImage <= 4 &&
                                initialValueDocs <= 3
                                ? require("../../Assets/icons/SV_ICONS/Orange-Drop Down Arrow.png")
                                : require("../../Assets/icons/SV_ICONS/Orange-UP Arrow.png")
                            }
                            alt=""
                            style={{ cursor: "pointer" }}
                            width={24}
                            height="24"
                          />
                        )}
                      <Text
                        style={{
                          marginLeft: 10,
                          cursor:
                            (sortedAttachment.docsAttachment.length > 3 ||
                              sortedAttachment.imagesAttachment.length > 4) &&
                            "pointer"
                        }}
                      >
                        {initialValueImage <= 4 &&
                          initialValueDocs <= 3 &&
                          (sortedAttachment.docsAttachment.length > 3 ||
                            sortedAttachment.imagesAttachment.length > 4) && (
                            <span>{formatMessage(messages["show all"])}</span>
                          )}{" "}
                        {sortedAttachment.docsAttachment.length +
                          sortedAttachment.imagesAttachment.length}{" "}
                        {formatMessage(messages["attachments"])}
                      </Text>
                    </div>
                  </div>
                )}

              {tabKey === "0" ? (
                <div
                  style={{
                    marginBottom: 25,
                    padding: "5px 25px 50px 25px",
                    borderTop: `1px solid ${color.Black10}`,
                    wordBreak: "break-all"
                  }}
                >
                  {message_body &&
                    // message_body.content_type &&
                    // message_body.content_type.includes("html") ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: message_body.content }}
                    ></div>
                    // ) 
                    // : (
                    // <p>{message_body && message_body.content}</p>
                    // )
                  }
                  {/* {message_body && typeof (message_body) === "string" && message_body.split("\n") && message_body.split("\n").map((item, idx) => {
                    return (
                      <div key={idx} dangerouslySetInnerHTML={{ __html: item.split("\n").join("") }} ></div>
                      // <p>{item}</p>
                    );
                  })} */}
                </div>
              ) : tabKey === "1" ? (
                // <div style={{ marginBottom: 25, height: "inherit", padding: "5px 25px 50px 25px", borderTop: `2px solid grey` }}>
                <MetaData formatMessage={formatMessage} data={openedEmail} />
              ) : (
                    <Factoid isTabOpened={tabKey === "2"} openedEmail={openedEmail} />
                  )
                // </div>
              }
            </div>
          ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: "inherit",
                  alignContent: "center",
                  width: "100%"
                }}
              >
                <Empty
                  style={{ width: "100%", height: "inherit", marginTop: "20%" }}
                  image={require(`../../Assets/icons/noSelection.svg`)}
                  description={
                    <span>{formatMessage(messages["Select an Item to read"])}</span>
                  }
                />
              </div>
            )
          }
        </div>
      );
  }

  //   renderLabels() {
  //     try {
  //       const labelArray = this.renderLabelsIntoReadingPane() || [];
  //       if (labelArray.length > 3) {
  //         return (this.openDrawerForRecipientAndLabel(null, 'See All Labels', this.openLabelDrawer))
  //       }
  //     } catch (e) { console.log(e.message) }
  //   }

  //   openDrawerForRecipientAndLabel(dataForDrawer, message, openDrawer) {
  //     return <span onClick={() => openDrawer(dataForDrawer)}
  //       style={{
  //         width: 'auto',
  //         float: 'left',
  //         marginLeft: 5,
  //         fontSize: 12,
  //         cursor: "pointer",
  //         color: "blue"
  //       }} title={this.props.formatMessage(messages[message])}>
  //       >>
  //     </span>;
  //   }

}

const mapStateToProps = state => ({
  readingPanelAttachment: state.SimpleSearchReducer.attachmentid,
  simpleSearch: state.SimpleSearchReducer.simpleSearch,
  legalHoldAutoLabels: state.AutoLabelingReducer.legalHoldAutoLabels,
  globalAutoLabels: state.AutoLabelingReducer.globalAutoLabels,
});

const mapDispatchToProps = dispatch => ({
  // GetAttachmentSave: data => dispatch(GetAttachmentSave(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(ReadingPane);
