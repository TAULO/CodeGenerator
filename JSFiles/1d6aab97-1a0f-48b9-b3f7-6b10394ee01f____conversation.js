import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCard,
  CButton,
  CCardImage,
  CCardBody,
  CDropdownDivider,
  CCardFooter,
  CCardText,
  CFormInput,
  CBadge,
} from "@coreui/react";
import MaterialTable from "material-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import CSVImageType from "../../assets/images/DocumentTypeImage/ic_file_csv.svg";
import DOCImageType from "../../assets/images/DocumentTypeImage/ic_file_doc.svg";
import PDFImageType from "../../assets/images/DocumentTypeImage/ic_file_pdf.svg";
import PPTImageType from "../../assets/images/DocumentTypeImage/ic_file_ppt.svg";
import TXTImageType from "../../assets/images/DocumentTypeImage/ic_file_txt.svg";
import XLSImageType from "../../assets/images/DocumentTypeImage/ic_file_xls.svg";
import MemberRemoveIcon from "@mui/icons-material/PersonRemove";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MessageIcon from "../../assets/images/logo/chat.png";
import { getUserData } from "../../utility/utils";
import { useFormik } from "formik";
import TextField from "@material-ui/core/TextField";
import {
  messageSend,
  clearMessage,
  leaveGroup,
  deleteGroup,
  removeMemberFromGroup,
  deleteConversation,
} from "./MessageAction";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import Pusher from "pusher-js";
import { getAccessToken } from "../../utility/utils";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AddGroupMember from "./AddGroupMember";
import moment from "moment";
import EditGroupMember from "./EditGroupMember";
import { useHistory } from "react-router-dom";
import Messages from "./Messages";
import { BASE_URL } from "src/redux/actions/types";

var pusherInstance = null;
var pusherChannelSubscription = null;

const MySwal = withReactContent(Swal);

const conversation = (Data) => {
  const dispatch = useDispatch();
  const hiddenFileInput = React.useRef(null);
  const message = useSelector((state) => state.message);
  var messageEl = useRef(null);
  const [isLoading, setLoading] = useState(true);
  const [imageupload, setImageUpload] = useState([]);
  const [file, setFile] = useState([]);
  const [searchchatname, setSearchChatName] = useState("");
  const [viewmember, setViewMember] = useState(false);
  const [removegroupmember, setRemoveGroupMember] = useState(false);
  const [editgroup, setEditGroup] = useState(false);
  const [addmember, setAddMember] = useState(false);
  const [messageStatus, setMessageStatus] = useState(false);
  const [deleteData, setDeleteData] = useState(false);
  const history = useHistory();

  const [screenSize, getDimension] = useState({
    dynamicWidth: window.innerWidth,
    dynamicHeight: window.innerHeight,
  });

  const [loader, showLoader, hideLoader] = useFullPageLoader();

  // message send code
  const initialValues = {
    conversation_id: "",
    to: "",
    body: "",
    attachments: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values, { resetForm }) => {
      var formData = new FormData();
      formData.append("conversation_id", Data.Data.conversation_id);
      formData.append("module", "message");
      if (Data.Data.members) {
        formData.append("to", getUserData().email);
      } else {
        formData.append("to", Data.Data.email);
      }

      if (
        imageupload.length > 0 &&
        (values.body === "" || values.body === null)
      ) {
        formData.append("body", "attachments");
      } else {
        formData.append("body", values.body);
      }

      if (imageupload && imageupload.length > 0) {
        for (let i = 0; i < imageupload.length; i++) {
          formData.append(`attachments[${i}]`, imageupload[i]);
        }
      }

      values.conversation_id = Data.Data.conversation_id;
      values.to = Data.Data.email;
      if (pusherChannelSubscription) {
        var triggered = pusherChannelSubscription.trigger(
          "client-message-sent",
          {
            conversation_id: Data.Data.conversation_id,
            author_email: getUserData().email,
            body: values.body,
            created_at: moment().calendar(),
            attachments: file,
          }
        );

        var messagePayload = {
          author_email: getUserData().email,
          author_name: getUserData().first_name + " " + getUserData().last_name,
          body: values.body,
          attachments: file,
          created_at: moment().calendar(),
        };

        scrollToBottom();
        Data.HistroyData.messages.push(messagePayload);
        setMessageStatus(!messageStatus);
      }

      dispatch(messageSend(formData));
      clearState();
      resetForm({ values: "" });
    },
  });

  const clearState = () => {
    setFile([]);
    setImageUpload([]);
  };
  const scrollToBottom = () => {
    if (messageEl.current !== null) {
      messageEl.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const clearChat = () => {
    handleClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to clear this chat History!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          clearMessage({
            conversation_id: Data.Data.conversation_id,
            module: "message",
          })
        );
      }
    });
  };

  const DeleteConversation = () => {
    handleClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this conversation!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          deleteConversation({
            conversation_id: Data.Data.conversation_id,
            module: "message",
          })
        );
        setDeleteData(false)
      }
    });
  };

  const removeGroup = () => {
    handleClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to leave this Group?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          leaveGroup({
            conversation_id: Data.Data.conversation_id,
            module: "message",
          })
        );
        window.location.reload();
      }
    });
  };

  const DeleteGroup = () => {
    handleClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Group?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          deleteGroup({
            conversation_id: Data.Data.conversation_id,
            module: "message",
          })
        );
        window.location.reload();
      }
    });
  };

  const memberViewModal = () => {
    handleClose();
    setViewMember(true);
  };

  const editGroupModal = () => {
    handleClose();
    setEditGroup(true);
  };

  const addMemberModal = () => {
    handleClose();
    setAddMember(true);
  };

  const removeMemberModal = () => {
    handleClose();
    setRemoveGroupMember(true);
  };

  const removeMemberAction = (data) => {
    const emails = [];
    data.map(function (item) {
      emails.push(item.email);
    });
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Remove this Member from Group?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          removeMemberFromGroup({
            conversation_id: Data.Data.conversation_id,
            members: emails,
            module: "message",
          })
        );
        setRemoveGroupMember(false);
      }
    });
  };

  // Pusher.logToConsole = true;
  useEffect(() => {
    scrollToBottom();
    setDeleteData(Data.Data)
    // const pusher = new Pusher("594b913a96ab7f7226af", { web@dasinfomedia.com credentials
    pusherInstance = new Pusher("91615c302a4ee7dce09a", {
      //arjun credentials
      authEndpoint: "https://api-tutorpark.ssavts.in/api/broadcasting/auth",
      auth: {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + getAccessToken(),
        },
      },
      cluster: "ap2",
      activityTimeout: 15000,
    });

    if (pusherInstance !== null) {
      pusherChannelSubscription = pusherInstance.subscribe(
        "presence-conversation_" + Data.Data.conversation_id
      );
    }

    if (pusherChannelSubscription !== null) {
      pusherChannelSubscription.bind("pusher:subscription_succeeded", () => {
        var subBind = pusherChannelSubscription.bind("message.sent", (data) => {
          var messagePayload = {
            id: data.payLoad.id,
            author_email: data.payLoad.author_email,
            author_name: data.payLoad.author_name,
            body: data.payLoad.body,
            author_image: data.payLoad.author_image,
            created_at: data.payLoad.created_at,
            iam_author: data.payLoad.iam_author,
            attachments: data.payLoad.attachments,
            author: data.payLoad.author,
            read_by: data.payLoad.read_by,
          };
          scrollToBottom();
          if (data.payLoad.author_email !== getUserData().email) {
            Data.HistroyData.messages.push(messagePayload);
          }
          setMessageStatus(!messageStatus);
        });
      });
    }

    return () => {
      // Anything in here is fired on component unmount.
      if (pusherInstance !== null) {
        var unsub = pusherInstance.unsubscribe(
          "presence-conversation_" + Data.Data.conversation_id
        );
      }
    };
  }, [Data.HistroyData.messages, messageStatus]);

  

  useLayoutEffect(() => {
    // const pusher = new Pusher("594b913a96ab7f7226af", { web@dasinfomedia.com credentials
    pusherInstance = new Pusher("91615c302a4ee7dce09a", {
      //arjun credentials
      // authEndpoint: "https://api-tutorpark.ssavts.in/api/broadcasting/auth",
      authEndpoint: BASE_URL+"/broadcasting/auth",
      auth: {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + getAccessToken(),
        },
      },
      cluster: "ap2",
      //   activityTimeout: 8000,
    });

    if (pusherInstance !== null) {
      pusherChannelSubscription = pusherInstance.subscribe(
        "presence-conversation_" + Data.Data.conversation_id
      );
    }
  }, []);

  // message tab code

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // image file upload code
  const handleImageClick = (event) => {
    hiddenFileInput.current.click();
  };

  const fileChangedHandler = (event) => {
    setImageUpload([...imageupload, ...event.target.files]);
    setFile([
      ...file,
      {
        file: URL.createObjectURL(event.target.files[0]),
        fileName: event.target.files[0].name,
      },
    ]);
  };

  const deleteFile = (event) => {
    const Imagefile = file.filter((item, index) => index !== event);
    setFile(Imagefile);
  };

  const membercolumns = [
    {
      title: "Name",
      field: "name",
    },
    {
      title: "Email",
      field: "email",
    },
    {
      render: (data) =>
        data.email === getUserData().email ? (
          <CBadge color="primary">Admin</CBadge>
        ) : (
          ""
        ),
    },
  ];

  // get dynamic screen size
  const setDimension = () => {
    getDimension({
      dynamicWidth: window.innerWidth,
      dynamicHeight: window.innerHeight,
    });
  };

  const handleBackClick = () => {
    window.location.reload();
    dispatch({ type: "set", sidebarShow: false });
  };

  // screen size get autometic and set it
  useEffect(() => {
    window.addEventListener("resize", setDimension);

    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, [screenSize]);

  console.log("delete")
  console.log(deleteData)

  const messageChatDynamic =
    Data.HistroyData.messages &&
    Data.HistroyData.messages
      .filter((Chat) => {
        if (searchchatname === "") {
          return Chat;
        } else if (
          Chat.body.toLowerCase().includes(searchchatname.toLowerCase())
        ) {
          return Chat;
        }
      })
      .map(function (Chat, key) {
        return (
          <>
            <CCardBody className="card-message-body" key={key}>
              {getUserData().email === Chat.author_email ? (
                <div style={{ textAlign: "-webkit-right" }}>
                  {Chat.attachments !== null ? (
                    <div
                      className=" p-2 message-me"
                      style={{
                        width: "fit-content",
                        fontSize: "14px",
                        color: "#5A55FD",
                      }}
                    >
                      {Chat.attachments.map(function (attachment, key) {
                        //console.log(attachment)
                        var fileExtension = null;
                        var fileName = null;
                        var redirectPath = null;
                        if (attachment.file) {
                          fileName = attachment.fileName;
                          redirectPath = attachment.file;
                          fileExtension = attachment.fileName.split(".").pop();
                        } else {
                          fileName = attachment.substring(
                            attachment.lastIndexOf("/") + 1,
                            attachment.length
                          );
                          redirectPath = attachment;
                          fileExtension = attachment
                            .substring(
                              attachment.lastIndexOf("/") + 1,
                              attachment.length
                            )
                            .split(".")
                            .pop();
                        }

                        return (
                          <a
                            key={key}
                            href={redirectPath}
                            without
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <CCardImage
                              className="p-1"
                              style={{
                                width: "fit-content",
                                fontSize: "14px",
                                color: "#5A55FD",
                                height: "75px",
                                width: "75px",
                              }}
                              src={
                                fileExtension === "pdf"
                                  ? PDFImageType
                                  : fileExtension === "doc" ||
                                    fileExtension === "docx"
                                    ? DOCImageType
                                    : fileExtension === "ppt" ||
                                      fileExtension === "pptm" ||
                                      fileExtension === "pptx"
                                      ? PPTImageType
                                      : fileExtension === "xls" ||
                                        fileExtension === "xlsx"
                                        ? XLSImageType
                                        : fileExtension === "csv"
                                          ? CSVImageType
                                          : fileExtension === "txt"
                                            ? TXTImageType
                                            : redirectPath
                              }
                            />

                            <div
                              style={{ color: "#fff", textDecoration: "none" }}
                            >
                              {fileName.length < 15
                                ? fileName
                                : fileName.substring(0, 15) + "..."}
                            </div>
                          </a>
                        );
                      })}
                      <div
                        className=" p-2 message-me"
                        style={{ width: "fit-content" }}
                      >
                        <section
                          className="not-found-controller"
                          dangerouslySetInnerHTML={{ __html: Chat.body }}
                        />
                        <div className="time-zone-me">
                          {Chat.created_at} ~ {Chat.author_name} ~
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className=" p-2 message-me"
                      style={{ width: "fit-content" }}
                    >
                      <section
                        className="not-found-controller"
                        dangerouslySetInnerHTML={{ __html: Chat.body }}
                      />
                      <div className="time-zone-me">
                        {Chat.created_at} ~ {Chat.author_name} ~
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: "-webkit-left" }}>
                  {Chat.attachments !== null ? (
                    <div
                      className=" p-2 message-you"
                      style={{
                        width: "fit-content",
                        fontSize: "14px",
                        color: "#5A55FD",
                      }}
                    >
                      {Chat.attachments.map(function (attachment, key) {
                        var fileExtension = null;
                        var fileName = null;
                        var redirectPath = null;
                        if (attachment.file) {
                          fileName = attachment.fileName;
                          redirectPath = attachment.file;
                          fileExtension = attachment.fileName.split(".").pop();
                        } else {
                          fileName = attachment.substring(
                            attachment.lastIndexOf("/") + 1,
                            attachment.length
                          );
                          redirectPath = attachment;
                          fileExtension = attachment
                            .substring(
                              attachment.lastIndexOf("/") + 1,
                              attachment.length
                            )
                            .split(".")
                            .pop();
                        }

                        return (
                          <a
                            key={key}
                            href={redirectPath}
                            without
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <CCardImage
                              className="p-1"
                              style={{
                                width: "fit-content",
                                fontSize: "14px",
                                color: "#5A55FD",
                                height: "75px",
                                width: "75px",
                              }}
                              src={
                                fileExtension === "pdf"
                                  ? PDFImageType
                                  : fileExtension === "doc" ||
                                    fileExtension === "docx"
                                    ? DOCImageType
                                    : fileExtension === "ppt" ||
                                      fileExtension === "pptm" ||
                                      fileExtension === "pptx"
                                      ? PPTImageType
                                      : fileExtension === "xls" ||
                                        fileExtension === "xlsx"
                                        ? XLSImageType
                                        : fileExtension === "csv"
                                          ? CSVImageType
                                          : fileExtension === "txt"
                                            ? TXTImageType
                                            : redirectPath
                              }
                            />

                            <div style={{ textDecoration: "none" }}>
                              {fileName.length < 15
                                ? fileName
                                : fileName.substring(0, 15) + "..."}
                            </div>
                          </a>
                        );
                      })}

                      <div
                        className=" p-2 message-you"
                        style={{ width: "fit-content" }}
                      >
                        <section
                          className="not-found-controller"
                          dangerouslySetInnerHTML={{ __html: Chat.body }}
                        />
                        <div className="time-zone-you">
                          {Chat.created_at} ~ {Chat.author_name} ~
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className=" p-2 message-you"
                      style={{ width: "fit-content" }}
                    >
                      <section
                        className="not-found-controller"
                        dangerouslySetInnerHTML={{ __html: Chat.body }}
                      />
                      <div className="time-zone-you">
                        {Chat.created_at} ~ {Chat.author_name} ~
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CCardBody>
          </>
        );
      });

  return (
    <div>
      {deleteData === false ? (
        <div>
          <div>
            <CCard
              className="friendcard d-flex justify-content-center"
              style={{ minHeight: screenSize.dynamicHeight - 160 }}
            >
              <div className="text-center">
                <CCardImage
                  style={{ height: "150px", width: "150px" }}
                  src={MessageIcon}
                />
                <CCardText style={{ color: "#D2D2D2" }}>
                  Select a Message conversation
                </CCardText>
              </div>
            </CCard>
          </div>
        </div>
      ) : (
        <div>
          <div>
            <CCard className="friendcard">
              <div className="d-flex align-items-center p-2">
                <div className="col-xl-1 col-lg-1 col-md-1 col-sm-2 position-relative">
                  {Data.Responsive === "no" ? (
                    <CCardImage
                      src={Data.Data.image}
                      className="rounded-circle messageprofile-image"
                    />
                  ) : (
                    <div>
                      <ArrowBackIcon onClick={() => handleBackClick()} />
                    </div>
                  )}
                </div>

                <div className="col-xl-7 col-lg-7 col-md-7 col-sm-5">
                  {message.histroyListData.type === "personal" ? (
                    <>
                      <div className="font-weight-bold">{Data.Data.name}</div>
                    </>
                  ) : (
                    <>
                      <div className="font-weight-bold">
                        {message.histroyListData.name}
                      </div>
                      <div className="message-font-size">
                        {message.histroyListData.total_members}
                      </div>
                    </>
                  )}
                </div>

                <div className="col-xl-4 col-lg-4 col-md-7 col-sm-5 d-flex align-items-center justify-content-end">
                  <div className="d-flex position-relative col-xs-10 col-xl-10 col-lg-10 col-md-10 col-sm-10">
                    <CFormInput
                      className="d-inline rounded-pill search-chat-input"
                      placeholder="Search"
                      onChange={(event) =>
                        setSearchChatName(event.target.value)
                      }
                    />
                    <div className="search-button-chat rounded-pill position-absolute">
                      <FontAwesomeIcon icon={faSearch} />
                    </div>
                  </div>
                  <div>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls="long-menu"
                      aria-expanded={open ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      MenuListProps={{
                        "aria-labelledby": "long-button",
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    >
                      {Data.Data.members ? (
                        <div>
                          {Data.Data.author &&
                            getUserData().email === Data.Data.author.email ? (
                            <div>
                              <MenuItem onClick={() => editGroupModal()}>
                                Edit Group
                              </MenuItem>
                              <MenuItem onClick={() => addMemberModal()}>
                                Add Member
                              </MenuItem>
                              <MenuItem onClick={() => removeMemberModal()}>
                                Remove Member
                              </MenuItem>
                              <MenuItem onClick={clearChat}>
                                Clear Chat
                              </MenuItem>
                              <MenuItem onClick={() => DeleteGroup()}>
                                Delete Group
                              </MenuItem>
                              <MenuItem onClick={() => memberViewModal()}>
                                View Member
                              </MenuItem>
                            </div>
                          ) : (
                            <div>
                              <MenuItem onClick={() => addMemberModal()}>
                                Add Member
                              </MenuItem>
                              <MenuItem onClick={clearChat}>
                                Clear Chat
                              </MenuItem>
                              <MenuItem onClick={() => removeGroup()}>
                                Leave Group
                              </MenuItem>
                              <MenuItem onClick={() => memberViewModal()}>
                                View Member
                              </MenuItem>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <MenuItem onClick={clearChat}>
                            Clear Chat
                          </MenuItem>
                          <MenuItem onClick={() => DeleteConversation()}>
                            Delete Conversation
                          </MenuItem>
                        </div>
                      )}
                    </Menu>
                  </div>
                </div>
              </div>
              <CDropdownDivider className="divider" />
              <div
                style={{
                  height: screenSize.dynamicHeight - 330,
                  overflow: "auto",
                }}
                className="conversation-scrollbar-css"
              >
                {messageChatDynamic}
                <div ref={messageEl}></div>
              </div>
              {file.length > 0 ? (
                <div
                  className="row"
                  style={{
                    backgroundColor: "#EAECF1",
                    height: "60px",
                    padding: "5px",
                    marginLeft: "0px",
                    marginRight: "0px",
                  }}
                >
                  {file.length > 0 &&
                    file.map((item, index) => {
                      var fileExtension = null;
                      fileExtension = item.fileName.split(".").pop();

                      return (
                        <div
                          key={index}
                          style={{ width: "50px" }}
                          className="mr-2"
                        >
                          <CloseIcon
                            type="button"
                            onClick={() => deleteFile(index)}
                            style={{
                              marginLeft: "32px",
                              color: "#cb0e0e",
                              position: "absolute",
                              backgroundColor: "#ffbc00",
                              borderRadius: "20px",
                            }}
                          />
                          <img
                            style={{
                              height: "50px",
                              width: "50px",
                              borderRadius: "50px",
                            }}
                            src={
                              fileExtension === "pdf"
                                ? PDFImageType
                                : fileExtension === "doc" ||
                                  fileExtension === "docx"
                                  ? DOCImageType
                                  : fileExtension === "ppt" ||
                                    fileExtension === "pptm" ||
                                    fileExtension === "pptx"
                                    ? PPTImageType
                                    : fileExtension === "xls" ||
                                      fileExtension === "xlsx"
                                      ? XLSImageType
                                      : fileExtension === "csv"
                                        ? CSVImageType
                                        : fileExtension === "txt"
                                          ? TXTImageType
                                          : item.file
                            }
                          />
                        </div>
                      );
                    })}
                </div>
              ) : (
                ""
              )}
              <form onSubmit={formik.handleSubmit}>
                <CCardFooter className="footer-message">
                  <div className="m-2 pb-1 comment-input-div">
                    <AttachFileIcon
                      className="mt-2"
                      style={{ cursor: "pointer" }}
                      onClick={handleImageClick}
                    />
                    <input
                      type="file"
                      // multiple
                      accept="application/pdf, application/vnd.ms-excel/*, image/*, application/csv, application/doc/*, application/txt, application/ppt/*, "
                      ref={hiddenFileInput}
                      onChange={fileChangedHandler}
                      style={{ display: "none" }}
                    />

                    <TextField
                      InputProps={{
                        inputProps: { style: {} },
                        style: { height: 45, borderRadius: 50 },
                      }}
                      variant="outlined"
                      id="body"
                      name="body"
                      autoComplete="off"
                      value={formik.values.body}
                      onChange={formik.handleChange}
                      className="comments-message-control pl-3"
                      placeholder="Write your Message"
                    />
                    {(formik.values.body !== "" || file.length > 0) &&
                      formik.values.body.trim() ? (
                      <CButton
                        className="comments-button rounded-pill position-absolute"
                        type="submit"
                      >
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </CButton>
                    ) : (
                      ""
                    )}
                  </div>
                </CCardFooter>
              </form>
            </CCard>
          </div>

          {/* group member view modal  */}

          <CModal
            size="lg"
            visible={viewmember}
            onDismiss={() => setViewMember(false)}
          >
            <CModalHeader
              onDismiss={() => setViewMember(false)}
              className="tutorviewmodalheader"
            >
              <CModalTitle>Group Member</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <MaterialTable
                title={Data.Data.name}
                columns={membercolumns}
                data={Data.Data.members}
              />
            </CModalBody>
          </CModal>

          {/* Remove Group member modal  */}

          <CModal
            size="lg"
            visible={removegroupmember}
            onDismiss={() => setRemoveGroupMember(false)}
          >
            <CModalHeader
              onDismiss={() => setRemoveGroupMember(false)}
              className="tutorviewmodalheader"
            >
              <CModalTitle>Remove Member from Group</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <MaterialTable
                title={Data.Data.name}
                columns={membercolumns}
                data={Data.Data.members}
                options={{
                  search: true,
                  selection: true,
                  selectionProps: (data) => ({
                    disabled: data.email === getUserData().email,
                  }),
                  filtering: true,
                  searchFieldAlignment: "right",
                  headerStyle: {
                    backgroundColor: "#DEDDF4",
                    color: "#444346",
                    fontWeight: "600",
                    fontSize: "15px",
                  },
                }}
                actions={[
                  {
                    tooltip: "Remove Member",
                    icon: MemberRemoveIcon,
                    onClick: (evt, data) => removeMemberAction(data, evt),
                  },
                ]}
              />
            </CModalBody>
          </CModal>

          {/* Edit group modal */}

          {message.editGroupStatus !== false ? (
            <CModal
              size="lg"
              visible={editgroup}
              onDismiss={() => setEditGroup(false)}
            >
              <CModalHeader
                onDismiss={() => setEditGroup(false)}
                className="tutorviewmodalheader"
              >
                <CModalTitle>Edit Group</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <EditGroupMember editData={Data.Data} />
              </CModalBody>
            </CModal>
          ) : (
            <CModal size="lg" onDismiss={() => setEditGroup(false)}>
              <CModalHeader
                onDismiss={() => setEditGroup(false)}
                className="tutorviewmodalheader"
              >
                <CModalTitle>Edit Group</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <EditGroupMember editData={Data.Data} />
              </CModalBody>
            </CModal>
          )}

          {/* Add member group modal */}

          {message.addMemberStatus !== false ? (
            <CModal
              size="lg"
              visible={addmember}
              onDismiss={() => setAddMember(false)}
            >
              <CModalHeader
                onDismiss={() => setAddMember(false)}
                className="tutorviewmodalheader"
              >
                <CModalTitle>Add Group Member</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <AddGroupMember GroupData={Data} />
              </CModalBody>
            </CModal>
          ) : (
            <CModal size="lg" onDismiss={() => setAddMember(false)}>
              <CModalHeader
                onDismiss={() => setAddMember(false)}
                className="tutorviewmodalheader"
              >
                <CModalTitle>Add Group Member</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <AddGroupMember GroupData={Data} />
              </CModalBody>
            </CModal>
          )}
        </div>
      )}
    </div>
  );
};
export default conversation;
