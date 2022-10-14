import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

import ezeetelImg from "../../assets/imgs/ezeetel-Logo.png";
import ezeetelSmallImg from "../../assets/imgs/et-logo.PNG";
import groupImg from "../../assets/imgs/group.png";
import "antd/dist/antd.css";
import { Collapse, Menu } from "antd";

import LoginContext from "../../context/login/loginContext";
import UserContext from "../../context/useragent/userContext";
import ContactContext from "../../context/contact/contactContext";

const { Panel } = Collapse;

const SideBar = (props) => {
  const { SubMenu } = Menu;

  const loginContext = useContext(LoginContext);
  const userContext = useContext(UserContext);
  const contactContext = useContext(ContactContext);
  const { collapse_sidebar } = loginContext;
  const { changeScreenView } = userContext;
  const { notificationsArray, groupNotifications } = contactContext;

  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState([]);
  const [one, setOne] = useState(false);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [four, setFour] = useState(false);
  const [five, setFive] = useState(false);
  const [six, setSix] = useState(false);
  const [seven, setSeven] = useState(false);

  useEffect(() => {
    //get group details from session storage
    let groupNames =
      sessionStorage.getItem("groupNames") !== null &&
      sessionStorage.getItem("groupNames") !== undefined &&
      sessionStorage.getItem("groupNames").split(",");
    let groupNumbers =
      sessionStorage.getItem("groupNumbers") !== null &&
      sessionStorage.getItem("groupNumbers") !== undefined &&
      sessionStorage.getItem("groupNumbers").split(",");
    let arr = [];
    if (groupNumbers !== null && groupNames !== null) {
      for (let i = 0; i < groupNumbers.length; i++) {
        arr.push({ name: groupNames[i], number: groupNumbers[i] });
      }
    }
    console.log(arr);

    setGroups(arr);
    setGroup(arr);
  }, [sessionStorage.getItem("groupNames") !== null]);

  useEffect(() => {
    setOne(false);
    setTwo(false);
    setThree(false);
    setFour(false);
    setFive(false);
    setSix(false);
    setSeven(false);
    setGroups([]);
  }, [
    sessionStorage.getItem("currentNavHeader") !== "My Profile",
    sessionStorage.getItem("authenticated"),
  ]);
  return (
    <div
      className={`${
        collapse_sidebar ? "sidebar-collapsed" : "sidebar"
      } d-flex flex-column align-items-start min-vh-100`}
    >
      <div className="row   w-100">
        <div
          className={`${
            collapse_sidebar ? " px-0" : " px-4 "
          } sidebar-header mb-4 pt-2`}
        >
          {/* change image when the sidebar collapses */}
          <img
            className={`${
              collapse_sidebar ? "sidebar-small-logo" : "sidebar-logo "
            }`}
            src={`${collapse_sidebar ? ezeetelSmallImg : ezeetelImg}`}
            alt=""
          />
        </div>

        <div className="sidebar-background"></div>

        <div className="sidebar-menu px-0">
          <div className="mb-3"></div>
          {!collapse_sidebar ? (
            <>
              {/* dashboard */}
              <div className="row mt-5  w-100 d-flex position-relative">
                <Collapse
                  bordered={false}
                  onChange={() => {
                    setOne(!one);
                    setTwo(false);
                    setThree(false);
                    setFour(false);
                    setFive(false);
                    setSix(false);
                    setSeven(false);
                  }}
                  // expandIconPosition="right"
                  activeKey={one ? 1 : 0}
                  className="site-collapse-custom-collapse "
                  ghost
                >
                  <Panel
                    showArrow={false}
                    className=""
                    header={
                      <Link
                        to="/dashboard"
                        className={`w-100 p-1 ms-3 ${
                          one ? "sidebar-options-div p-2 link-color" : ""
                        } `}
                        style={{ color: "#000 !important" }}
                      >
                        <span className="menu-icon me-3">
                          <i className="fas fa-columns"></i>
                        </span>

                        <span>Dashboard</span>
                      </Link>
                    }
                    key="1"
                  ></Panel>
                </Collapse>
              </div>
              {/* contact */}
              <div className="row mt-2 w-100 d-flex position-relative">
                <Collapse
                  bordered={false}
                  onChange={() => {
                    setOne(false);
                    setTwo(!two);
                    setThree(false);
                    setFour(false);
                    setFive(false);
                    setSix(false);
                    setSeven(false);
                  }}
                  expandIconPosition="right"
                  activeKey={two ? 1 : 0}
                  className="site-collapse-custom-collapse "
                  ghost
                >
                  <Panel
                    className=""
                    header={
                      <Link
                        to="/centralContact"
                        // className="link-color"
                        className={`w-100 p-1 ms-3 ${
                          two ? "sidebar-options-div p-2" : ""
                        } `}
                      >
                        <span className="menu-icon me-3">
                          <i className="fas fa-address-book "></i>
                        </span>
                        <span>Contacts</span>
                      </Link>
                    }
                    key="1"
                  >
                    <div className="sidebar-div-ul">
                      <ul className="sidebar-ul">
                        <Link to="/centralContact" className="link-color">
                          <li className="ps-2 me-4 py-2 sidebar-list-items">
                            Central Contacts
                          </li>
                        </Link>
                        <span className="d-flex ">
                          <Link to="/myContact" className="link-color">
                            <li className="ps-2 pe-5 me-4 py-2 sidebar-list-items">
                              My Contacts
                            </li>
                          </Link>

                          <li className="sidebar-list-items d-flex">
                            <Link
                              to="/createContact"
                              className=" link-color px-3  py-1 pt-2 "
                            >
                              <i className="fas fa-plus link-color" />
                            </Link>
                          </li>
                        </span>
                        {/* <li className="ps-2 me-4 py-2 sidebar-list-items">
                          Outlook Contacts
                        </li> */}
                        <Link to="/remoteContact" className="link-color">
                          <li className="ps-2 me-4 py-2 sidebar-list-items">
                            Extensions
                          </li>
                        </Link>
                      </ul>
                    </div>
                  </Panel>
                </Collapse>
              </div>

              {/* calls */}
              <div className="row mt-1   w-100">
                <Collapse
                  bordered={false}
                  onChange={() => {
                    setOne(false);
                    setTwo(false);
                    setThree(!three);
                    setFour(false);
                    setFive(false);
                    setSix(false);
                    setSeven(false);
                  }}
                  expandIconPosition="right"
                  activeKey={three ? 1 : 0}
                  className="site-collapse-custom-collapse"
                  ghost
                >
                  <Panel
                    header={
                      <Link
                        to="/allCalls"
                        className={`w-100 p-1 ms-3 ${
                          three ? "sidebar-options-div p-2" : ""
                        } `}
                      >
                        <span className="menu-icon me-3">
                          <i className="fas fa-phone-alt"></i>
                        </span>
                        <span>Calls </span>
                        {/* <i className="fas fa-plus float-end pt-2 fs-6 fw-normal" style={{display:`${addTwo?"":"none"}`}}/> */}
                      </Link>
                    }
                    key="1"
                  >
                    <div className="sidebar-div-ul">
                      <ul className="sidebar-ul">
                        <Link to="/allCalls" className="link-color">
                          <li className="ps-2 me-4 py-2 sidebar-list-items">
                            All Calls
                          </li>
                        </Link>
                        <Link to="/missedCalls" className="link-color">
                          <li className="ps-2 me-4 py-2 sidebar-list-items">
                            Missed Calls
                          </li>
                        </Link>
                        <Link to="/outgoingCalls" className="link-color">
                          <li className="ps-2 me-4 py-2 sidebar-list-items">
                            Outgoing Calls
                          </li>
                        </Link>
                        <Link to="/receivedCalls" className="link-color">
                          <li className="ps-2 me-4 py-2 sidebar-list-items">
                            Received Calls
                          </li>
                        </Link>
                        {/* <Link to="/dialpad" className="link-color"> <li className="ps-2 me-4 py-2 sidebar-list-items">Make a call</li></Link> */}
                      </ul>
                    </div>
                  </Panel>
                </Collapse>
              </div>
              {/* IM */}
              {JSON.parse(sessionStorage.getItem("userInfo")) !== null &&
                JSON.parse(sessionStorage.getItem("userInfo")).extension
                  .chat === 1 && (
                  <div className="row w-100 d-flex position-relative">
                    <Collapse
                      bordered={false}
                      onChange={() => {
                        setOne(false);
                        setTwo(false);
                        setThree(false);
                        setFour(!four);
                        setFive(false);
                        setSix(false);
                        setSeven(false);
                      }}
                      expandIconPosition="right"
                      activeKey={four ? 1 : 0}
                      className="site-collapse-custom-collapse "
                      ghost
                    >
                      <Panel
                        className=""
                        header={
                          <Link
                            to="/allChats"
                            className={`w-100 p-1 ms-3 ${
                              four ? "sidebar-options-div p-2" : ""
                            } `}
                          >
                            <span className="menu-icon me-3">
                              <i className="fas fa-envelope" />
                            </span>
                            <span>Instant Message</span>
                          </Link>
                        }
                        key="1"
                      >
                        <div className="sidebar-div-ul">
                          <ul className="sidebar-ul">
                            <span className="d-flex ">
                              <Link to="/allChats" className="link-color">
                                <li className="px-2 pe-4 me-5 py-2 sidebar-list-items">
                                  Chats
                                </li>
                              </Link>

                              <li className="sidebar-list-items d-flex">
                                <Link
                                  to="/demo"
                                  className=" link-color px-3  py-1 pt-2 "
                                >
                                  <i className="fas fa-plus link-color" />
                                </Link>
                              </li>
                            </span>
                          </ul>
                        </div>
                      </Panel>
                    </Collapse>
                  </div>
                )}

              {/* SMS */}
              {JSON.parse(sessionStorage.getItem("userInfo")) !== null &&
              JSON.parse(sessionStorage.getItem("userInfo")).extension.sms ===
                1 ? (
                <div className="row w-100 d-flex position-relative">
                  <Collapse
                    bordered={false}
                    onChange={() => {
                      setOne(false);
                      setTwo(false);
                      setThree(false);
                      setFour(false);
                      setFive(!five);
                      setSix(false);
                      setSeven(false);
                    }}
                    expandIconPosition="right"
                    activeKey={five ? 1 : 0}
                    className="site-collapse-custom-collapse "
                    ghost
                  >
                    <Panel
                      className=""
                      header={
                        <Link
                          to="/allSMSChats"
                          className={`w-100 p-1 ms-3 ${
                            five ? "sidebar-options-div p-2" : ""
                          } `}
                          onClick={() =>
                            sessionStorage.setItem("currentMember", "")
                          }
                        >
                          <span className="menu-icon me-3">
                            <i className="fas fa-sms" />
                          </span>
                          <span className="">
                            <span>
                              SMS
                              {JSON.parse(
                                sessionStorage.getItem("userInfo")
                              ) !== null &&
                              JSON.parse(sessionStorage.getItem("userInfo")) !==
                                undefined &&
                              (JSON.parse(sessionStorage.getItem("userInfo"))
                                .extension.telnyx_api_key == null ||
                                JSON.parse(sessionStorage.getItem("userInfo"))
                                  .extension.telnyx_app_id == null) ? (
                                <span className="text-danger ms-2">
                                  service unavailable
                                </span>
                              ) : (
                                ""
                              )}
                              {notificationsArray.length + groupNotifications !=
                                0 && (
                                <span
                                  style={{
                                    height: "5px",
                                    width: "5px",
                                    background: "rgb(12 220 124)",
                                    marginLeft: "6px",
                                    padding: "2px 5px",
                                    borderRadius: "50%",
                                    fontSize: "10px",
                                    color: "white",
                                  }}
                                >
                                  {notificationsArray.length +
                                    groupNotifications}
                                </span>
                              )}
                            </span>
                          </span>
                        </Link>
                      }
                      key="1"
                    >
                      <div className="sidebar-div-ul">
                        <ul className="sidebar-ul">
                          <span className="d-flex ">
                            <Link to="/allSMSChats" className="link-color">
                              <li className="px-2 pe-4 me-5 py-2 sidebar-list-items">
                                SMS
                                {/* display number of unread sms if any */}
                                {notificationsArray.length > 0 && (
                                  <span
                                    style={{
                                      height: "5px",
                                      width: "5px",
                                      background: "rgb(12 220 124)",
                                      marginLeft: "6px",
                                      padding: "2px 5px",
                                      borderRadius: "50%",
                                      fontSize: "10px",
                                      color: "white",
                                    }}
                                  >
                                    {notificationsArray.length}
                                  </span>
                                )}
                              </li>
                            </Link>

                            <li className="sidebar-list-items d-flex">
                              <Link
                                to="/newSMSChat"
                                className=" link-color px-3  py-1 pt-2 "
                              >
                                <i className="fas fa-plus link-color" />
                              </Link>
                            </li>
                          </span>
                          {/* display groups if any */}

                          {group.length > 0 && (
                            <span className="d-flex ">
                              <Collapse
                                style={{ marginLeft: "0px !important" }}
                                bordered={false}
                                expandIconPosition="left"
                                defaultActiveKey={0}
                                ghost
                                className="group-bar"
                              >
                                <Panel
                                  showArrow={false}
                                  header={
                                    <Link
                                      to={{
                                        pathname: `/SMSGroup/${group[0].number}`,
                                        state: {
                                          groupName: group[0].name,
                                          groupNumber: group[0].number,
                                        },
                                      }}
                                      className="sidebar-list-items px-2 me-3 pe-5  py-2 "
                                      onClick={() =>
                                        sessionStorage.setItem(
                                          "currentGroup",
                                          JSON.stringify([
                                            group[0].number,
                                            group[0].name,
                                          ])
                                        )
                                      }
                                    >
                                      <span>
                                        Groups
                                        {groupNotifications != 0 && (
                                          <span
                                            style={{
                                              height: "5px",
                                              width: "5px",
                                              background: "rgb(12 220 124)",
                                              marginLeft: "6px",
                                              padding: "2px 5px",
                                              borderRadius: "50%",
                                              fontSize: "10px",
                                              color: "white",
                                            }}
                                          >
                                            {groupNotifications}
                                          </span>
                                        )}
                                      </span>
                                    </Link>
                                  }
                                  style={{ marginLeft: "0px !important" }}
                                  key="1"
                                >
                                  <span
                                    className="d-flex flex-column"
                                    style={{
                                      height: "100px",
                                      overflow: "scroll",
                                    }}
                                  >
                                    {group.length > 0 &&
                                      group.map((item, index) => {
                                        return (
                                          <>
                                            <span className="d-flex ">
                                              <Link
                                                key={index}
                                                to={{
                                                  pathname: `/SMSGroup/${item.number}`,
                                                  state: {
                                                    groupName: item.name,
                                                    groupNumber: item.number,
                                                  },
                                                }}
                                                className="link-color"
                                                onClick={() =>
                                                  sessionStorage.setItem(
                                                    "currentGroup",
                                                    JSON.stringify([
                                                      item.number,
                                                      item.name,
                                                    ])
                                                  )
                                                }
                                              >
                                                <li className="px-2 ms-3 me-3 pe-5  py-2 sidebar-list-items">
                                                  {item.name}
                                                </li>
                                              </Link>

                                              <li className="sidebar-list-items d-flex">
                                                <Link
                                                  to={{
                                                    pathname: `/NewGroupChat/${item.number}`,
                                                    state: {
                                                      groupName: item.name,
                                                      groupNumber: item.number,
                                                    },
                                                  }}
                                                  className=" link-color px-3  py-1 pt-2 "
                                                  onClick={() =>
                                                    sessionStorage.setItem(
                                                      "currentGroup",
                                                      JSON.stringify([
                                                        item.number,
                                                        item.name,
                                                      ])
                                                    )
                                                  }
                                                >
                                                  <i className="fas fa-plus link-color" />
                                                </Link>
                                              </li>
                                            </span>
                                          </>
                                        );
                                      })}
                                  </span>
                                </Panel>
                              </Collapse>
                            </span>
                          )}
                        </ul>
                      </div>
                    </Panel>
                  </Collapse>
                </div>
              ) : (
                group.length > 0 && (
                  <div className="row w-100 d-flex position-relative">
                    <Collapse
                      bordered={false}
                      onChange={() => {
                        setOne(false);
                        setTwo(false);
                        setThree(false);
                        setFour(false);
                        setFive(!five);
                        setSix(false);
                        setSeven(false);
                      }}
                      expandIconPosition="right"
                      activeKey={five ? 1 : 0}
                      className="site-collapse-custom-collapse "
                      ghost
                    >
                      <Panel
                        className=""
                        header={
                          <Link
                            to={{
                              pathname: `/SMSGroup/${group[0].number}`,
                              state: {
                                groupName: group[0].name,
                                groupNumber: group[0].number,
                              },
                            }}
                            className={`w-100 p-1 ms-3 ${
                              five ? "sidebar-options-div p-2" : ""
                            } `}
                            onClick={() =>
                              sessionStorage.setItem(
                                "currentGroup",
                                JSON.stringify([group[0].number, group[0].name])
                              )
                            }
                          >
                            <span className="menu-icon me-3">
                              <i className="fas fa-user-friends" />
                            </span>
                            <span className="">
                              <span>
                                Groups
                                {JSON.parse(
                                  sessionStorage.getItem("userInfo")
                                ) !== null &&
                                JSON.parse(
                                  sessionStorage.getItem("userInfo")
                                ) !== undefined &&
                                (JSON.parse(sessionStorage.getItem("userInfo"))
                                  .extension.telnyx_api_key == null ||
                                  JSON.parse(sessionStorage.getItem("userInfo"))
                                    .extension.telnyx_app_id == null) ? (
                                  <span className="text-danger ms-2">
                                    service unavailable
                                  </span>
                                ) : (
                                  ""
                                )}
                                {groupNotifications.length > 0 && (
                                  <span
                                    style={{
                                      height: "5px",
                                      width: "5px",
                                      background: "rgb(12 220 124)",
                                      marginLeft: "6px",
                                      padding: "2px 5px",
                                      borderRadius: "50%",
                                      fontSize: "10px",
                                      color: "white",
                                    }}
                                  >
                                    {groupNotifications.length}
                                  </span>
                                )}
                              </span>
                            </span>
                          </Link>
                        }
                        key="1"
                      >
                        <div className="sidebar-div-ul">
                          <ul className="sidebar-ul">
                            <span className="d-flex ">
                              <span
                                className="d-flex flex-column"
                                style={{
                                  height: "100px",
                                  overflow: "scroll",
                                }}
                              >
                                {group.length > 0 &&
                                  group.map((item, index) => {
                                    return (
                                      <>
                                        <span className="d-flex ">
                                          <Link
                                            key={index}
                                            to={{
                                              pathname: `/SMSGroup/${item.number}`,
                                              state: {
                                                groupName: item.name,
                                                groupNumber: item.number,
                                              },
                                            }}
                                            className="link-color"
                                            onClick={() =>
                                              sessionStorage.setItem(
                                                "currentGroup",
                                                JSON.stringify([
                                                  item.number,
                                                  item.name,
                                                ])
                                              )
                                            }
                                          >
                                            <li className="px-2 ms-3 me-3 pe-5  py-2 sidebar-list-items">
                                              {item.name}
                                            </li>
                                          </Link>

                                          <li className="sidebar-list-items d-flex">
                                            <Link
                                              to={{
                                                pathname: `/NewGroupChat/${item.number}`,
                                                state: {
                                                  groupName: item.name,
                                                  groupNumber: item.number,
                                                },
                                              }}
                                              className=" link-color px-3  py-1 pt-2 "
                                              onClick={() =>
                                                sessionStorage.setItem(
                                                  "currentGroup",
                                                  JSON.stringify([
                                                    item.number,
                                                    item.name,
                                                  ])
                                                )
                                              }
                                            >
                                              <i className="fas fa-plus link-color" />
                                            </Link>
                                          </li>
                                        </span>
                                      </>
                                    );
                                  })}
                              </span>
                            </span>
                          </ul>
                        </div>
                      </Panel>
                    </Collapse>
                  </div>
                )
              )}
              {/* efax */}
              {JSON.parse(sessionStorage.getItem("userInfo")) !== null &&
                JSON.parse(sessionStorage.getItem("userInfo")).extension
                  .efax === 1 && (
                  <div className="row w-100 d-flex position-relative">
                    <Collapse
                      bordered={false}
                      onChange={() => {
                        setOne(false);
                        setTwo(false);
                        setThree(false);
                        setFour(false);
                        setFive(false);
                        setSix(!six);
                        setSeven(false);
                      }}
                      expandIconPosition="right"
                      activeKey={six ? 1 : 0}
                      className="site-collapse-custom-collapse "
                      ghost
                    >
                      <Panel
                        className=""
                        header={
                          <Link
                            to="/faxLogs"
                            className={`w-100 p-1 ms-3  ${
                              six ? "sidebar-options-div p-2" : ""
                            } `}
                          >
                            <span className="menu-icon me-3">
                              <i className="fas fa-fax" />
                            </span>
                            <span>
                              E-Fax
                              {JSON.parse(
                                sessionStorage.getItem("userInfo")
                              ) !== null &&
                              JSON.parse(sessionStorage.getItem("userInfo")) !==
                                undefined &&
                              (JSON.parse(sessionStorage.getItem("userInfo"))
                                .extension.telnyx_api_key == null ||
                                JSON.parse(sessionStorage.getItem("userInfo"))
                                  .extension.telnyx_app_id == null) ? (
                                <span className="text-danger ms-2">
                                  service unavailable
                                </span>
                              ) : (
                                ""
                              )}
                            </span>
                          </Link>
                        }
                        key="1"
                      >
                        <div className="sidebar-div-ul">
                          <ul className="sidebar-ul">
                            <span className="d-flex ">
                              <Link to="/faxLogs" className="link-color">
                                <li className="px-2 me-3 pe-5  py-2 sidebar-list-items">
                                  Faxes
                                </li>
                              </Link>

                              <li className="sidebar-list-items d-flex">
                                <Link
                                  to="/eFax"
                                  className=" link-color px-3  py-1 pt-2 "
                                >
                                  <i className="fas fa-plus link-color" />
                                </Link>
                              </li>
                            </span>
                          </ul>
                        </div>
                      </Panel>
                    </Collapse>
                  </div>
                )}

              {/* <div className="row w-100 d-flex position-relative">
                <Collapse
                  bordered={false}
                  onChange={() => {
                    setOne(false);
                    setTwo(false);
                    setThree(false);
                    setFour(false);
                    setFive(false);
                    setSix(false);
                    setSeven(!seven);
                  }}
                  expandIconPosition="right"
                  activeKey={seven ? 1 : 0}
                  className="site-collapse-custom-collapse "
                  ghost
                >
                  <Panel
                    className=""
                    header={
                      <Link
                        to="/documents"
                        className={`w-100 p-1 ms-3  ${
                          six ? "sidebar-options-div p-2" : ""
                        } `}
                      >
                        <span className="menu-icon me-3">
                          <i className="fas fa-solid fa-file" />
                        </span>
                        <span>Documents</span>
                      </Link>
                    }
                    key="1"
                  ></Panel>
                </Collapse>
              </div> */}
            </>
          ) : (
            <>
              {/* when the sidebar is collapsed */}
              {/* dashboard */}
              <Link
                style={{
                  width: "100%",
                  color: "black",
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
                to="/dashboard"
                onClick={() => changeScreenView(false)}
              >
                <i
                  className={`${
                    collapse_sidebar ? "fs-5 link-color" : ""
                  } fas fa-columns `}
                ></i>
              </Link>

              {/* contacts */}
              <Menu style={{ width: "100%" }} mode="vertical">
                <SubMenu
                  key="sub1"
                  icon={
                    <i
                      className={`${
                        collapse_sidebar ? "fs-5 link-color" : ""
                      } fas fa-address-book `}
                    ></i>
                  }
                  // title="Contacts"
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Menu.ItemGroup>
                    <Menu.Item key="1">
                      <Link
                        to="/centralContact"
                        onClick={() => changeScreenView(false)}
                      >
                        Central Contacts
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                      <Link
                        to="/myContact"
                        onClick={() => changeScreenView(false)}
                      >
                        My Contacts
                      </Link>
                    </Menu.Item>
                    {/* <Menu.Item key="3">Outlook Contacts</Menu.Item> */}
                    <Menu.Item key="4">
                      <Link
                        to="/remoteContact"
                        onClick={() => changeScreenView(false)}
                      >
                        Extensions
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      key="5"
                      style={{ background: "rgb(135 206 235 / 50%)" }}
                    >
                      <Link
                        to="/createContact"
                        onClick={() => changeScreenView(false)}
                      >
                        New Contact
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                </SubMenu>
              </Menu>
              {/* calls */}
              <Menu style={{ width: "100%" }} mode="vertical">
                <SubMenu
                  key="sub1"
                  icon={
                    <i
                      className={`${
                        collapse_sidebar ? "fs-5 link-color" : ""
                      } fas fa-phone-alt`}
                    ></i>
                  }
                  // title="Calls"
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Menu.ItemGroup>
                    <Menu.Item key="1">
                      <Link
                        to="/allCalls"
                        onClick={() => changeScreenView(false)}
                      >
                        All Calls
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                      <Link
                        to="/missedCalls"
                        onClick={() => changeScreenView(false)}
                      >
                        Missed Calls
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                      <Link
                        to="/outgoingCalls"
                        onClick={() => changeScreenView(false)}
                      >
                        Outgoing Calls
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                      <Link
                        to="/receivedCalls"
                        onClick={() => changeScreenView(false)}
                      >
                        Received Calls
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                </SubMenu>
              </Menu>
              {/* SMS */}
              {JSON.parse(sessionStorage.getItem("userInfo")) !== null &&
              JSON.parse(sessionStorage.getItem("userInfo")).extension.sms ===
                1 ? (
                <Menu
                  style={{ width: "100%", position: "relative" }}
                  mode="vertical"
                >
                  {notificationsArray.length + groupNotifications > 0 && (
                    <span
                      className="position-absolute text-white d-flex align-items-center "
                      style={{
                        height: "15px",
                        width: "15px",
                        background: "rgb(12 220 124)",

                        padding: "2px 5px",
                        borderRadius: "50%",
                        fontSize: "10px",

                        top: "0.6rem",
                        left: "2rem",
                      }}
                    >
                      {notificationsArray.length + groupNotifications}
                    </span>
                  )}
                  <SubMenu
                    key="sub1"
                    icon={
                      <i
                        className={`${
                          collapse_sidebar ? "fs-5 link-color" : ""
                        } fas fa-sms`}
                      ></i>
                    }
                    // title="Calls"
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Menu.ItemGroup>
                      <Menu.Item key="1">
                        <Link
                          to="/allSMSChats"
                          onClick={() => changeScreenView(false)}
                        >
                          SMS
                        </Link>
                      </Menu.Item>
                      <Menu.Item
                        key="2"
                        style={{ background: "rgb(135 206 235 / 50%)" }}
                      >
                        <Link
                          to="/newSMSChat"
                          onClick={() => changeScreenView(false)}
                        >
                          New SMS
                        </Link>
                      </Menu.Item>

                      {group.length > 0 &&
                        group.map((item, index) => {
                          return (
                            <>
                              <Menu.Item key={index + 3} className=" ">
                                <Link
                                  to={{
                                    pathname: `/SMSGroup/${item.number}`,
                                    state: {
                                      groupName: item.name,
                                      groupNumber: item.number,
                                    },
                                  }}
                                  className="link-color  fw-bold"
                                  onClick={() => {
                                    sessionStorage.setItem(
                                      "currentGroup",
                                      JSON.stringify([item.number, item.name])
                                    );
                                    changeScreenView(false);
                                  }}
                                >
                                  {item.name}
                                </Link>
                              </Menu.Item>
                              <Menu.Item>
                                <Link
                                  to={{
                                    pathname: `/NewGroupChat/${item.number}`,
                                    state: {
                                      groupName: item.name,
                                      groupNumber: item.number,
                                    },
                                  }}
                                  className=" link-color "
                                  onClick={() => {
                                    sessionStorage.setItem(
                                      "currentGroup",
                                      JSON.stringify([item.number, item.name])
                                    );
                                    changeScreenView(false);
                                  }}
                                >
                                  {`New ${item.name} SMS`}
                                </Link>
                              </Menu.Item>
                            </>
                          );
                        })}
                    </Menu.ItemGroup>
                  </SubMenu>
                </Menu>
              ) : (
                group.length > 0 && (
                  <Menu
                    style={{ width: "100%", position: "relative" }}
                    mode="vertical"
                  >
                    {groupNotifications > 0 && (
                      <span
                        className="position-absolute text-white d-flex align-items-center "
                        style={{
                          height: "15px",
                          width: "15px",
                          background: "rgb(12 220 124)",

                          padding: "2px 5px",
                          borderRadius: "50%",
                          fontSize: "10px",

                          top: "0.6rem",
                          left: "2rem",
                        }}
                      >
                        {groupNotifications}
                      </span>
                    )}
                    <SubMenu
                      key="sub1"
                      icon={
                        <i
                          className={`${
                            collapse_sidebar ? "fs-5 link-color" : ""
                          } fas fa-user-friends`}
                        ></i>
                      }
                      // title="Calls"
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Menu.ItemGroup>
                        {group.map((item, index) => {
                          return (
                            <>
                              <Menu.Item key={index + 3} className=" ">
                                <Link
                                  to={{
                                    pathname: `/SMSGroup/${item.number}`,
                                    state: {
                                      groupName: item.name,
                                      groupNumber: item.number,
                                    },
                                  }}
                                  className="link-color  fw-bold"
                                  onClick={() => {
                                    sessionStorage.setItem(
                                      "currentGroup",
                                      JSON.stringify([item.number, item.name])
                                    );
                                    changeScreenView(false);
                                  }}
                                >
                                  {item.name}
                                </Link>
                              </Menu.Item>
                              <Menu.Item>
                                <Link
                                  to={{
                                    pathname: `/NewGroupChat/${item.number}`,
                                    state: {
                                      groupName: item.name,
                                      groupNumber: item.number,
                                    },
                                  }}
                                  className=" link-color "
                                  onClick={() => {
                                    sessionStorage.setItem(
                                      "currentGroup",
                                      JSON.stringify([item.number, item.name])
                                    );
                                    changeScreenView(false);
                                  }}
                                >
                                  {`New ${item.name} SMS`}
                                </Link>
                              </Menu.Item>
                            </>
                          );
                        })}
                      </Menu.ItemGroup>
                    </SubMenu>
                  </Menu>
                )
              )}
              {/* IM */}
              {JSON.parse(sessionStorage.getItem("userInfo")) !== null &&
                JSON.parse(sessionStorage.getItem("userInfo")).extension
                  .chat === 1 && (
                  <Menu style={{ width: "100%" }} mode="vertical">
                    <SubMenu
                      key="sub1"
                      icon={
                        <i
                          className={`${
                            collapse_sidebar ? "fs-5 link-color" : ""
                          } fas fa-envelope`}
                        ></i>
                      }
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Menu.ItemGroup>
                        <Menu.Item key="1">
                          <Link
                            to="/allChats"
                            onClick={() => changeScreenView(false)}
                          >
                            Chats
                          </Link>
                        </Menu.Item>
                        <Menu.Item
                          key="2"
                          style={{ background: "rgb(135 206 235 / 50%)" }}
                        >
                          <Link
                            to="/demo"
                            onClick={() => changeScreenView(false)}
                          >
                            New Chat
                          </Link>
                        </Menu.Item>
                      </Menu.ItemGroup>
                    </SubMenu>
                  </Menu>
                )}

              {/* e-fax */}

              {JSON.parse(sessionStorage.getItem("userInfo")) !== null &&
                JSON.parse(sessionStorage.getItem("userInfo")).extension
                  .efax === 1 && (
                  <Menu style={{ width: "100%" }} mode="vertical">
                    <SubMenu
                      key="sub1"
                      icon={
                        <i
                          className={`${
                            collapse_sidebar ? "fs-5 link-color" : ""
                          } fas fa-fax`}
                        ></i>
                      }
                      // title="Calls"
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Menu.ItemGroup>
                        <Menu.Item
                          key="1"
                          style={{ background: "rgb(135 206 235 / 50%)" }}
                        >
                          <Link
                            to="/eFax"
                            onClick={() => changeScreenView(false)}
                          >
                            Send Fax
                          </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                          <Link
                            to="/faxLogs"
                            onClick={() => changeScreenView(false)}
                          >
                            Faxes
                          </Link>
                        </Menu.Item>
                      </Menu.ItemGroup>
                    </SubMenu>
                  </Menu>
                )}
              {/* <Link
                style={{
                  width: "100%",
                  color: "black",
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
                to="/documents"
                onClick={() => changeScreenView(false)}
              >
              
                <i className="fas fa-solid fa-file mt-2 fs-5"></i>
              </Link> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
