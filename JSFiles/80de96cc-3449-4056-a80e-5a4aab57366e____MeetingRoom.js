import React, { useState, Fragment, useEffect, useRef } from 'react'
import "antd/dist/antd.css";
import { Row, Col, Button, Drawer, Popover } from 'antd';
import MicIcon from '@material-ui/icons/Mic';
import VideocamIcon from '@material-ui/icons/Videocam';
import SecurityIcon from '@material-ui/icons/Security';
import PeopleIcon from '@material-ui/icons/People';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import Badge from '@material-ui/core/Badge';
import Messages from '../Messages/Messages'
import SendIcon from '@material-ui/icons/Send';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicOffIcon from '@material-ui/icons/MicOff';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InfoIcon from '@material-ui/icons/Info';
import './MeetingRoom.css'
import ParticipantsModal from '../shared/ParticipantsModal'
import io from 'socket.io-client';
import queryString from 'query-string';
import { connect } from 'react-redux'
import Peer from 'peerjs';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Modal } from 'antd'
import { compose } from 'redux'



let socket;

const videoGrid = {
    backgroundColor: "black",
    height: "100vh"
}

const chatGrid = {
    height: "100vh",
    backgroundColor: "#242324",
    borderLeft: "1px solid #3D3D42",
    display: "flex",
    flexDirection: "column"
}

const mainControls = {
    backgroundColor: "#1C1E20",
    height: 80,
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    justifyContent: "center",
}

const chatInput = {
    marginTop: "auto",
    padding: "22px 12px",
    display: "flex"
}

const mainControlsBlock1 = {
    color: "#D2D2D2",
    display: "flex",
    padding: 5,
}
const mainControlsBlock2 = {
    color: "#D2D2D2",
    display: "flex",
    padding: 5,
    justifyContent: "space-between"
}
const mainControlsBlock3 = {
    color: "#D2D2D2",
    display: "flex",
    padding: 5,
    alignItems: "right"
}

const chatMessage = {
    flexGrow: 1,
    backgroundColor: "transparent",
    border: "none",
    color: "#F5F5F5",
}



function MeetingRoom(props) {

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('xs'));

    const [participantsVisible, setparticipantsVisible] = useState(false);
    const [chatsVisible, setChatsVisible] = useState(false);
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [hostName, setHostName] = useState('');
    const [myStream, setMyStream] = useState('');
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [isSharing, setIsSharing] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [isSharingLocal, setIsSharingLocal] = useState(false);
    const [myID, setMyID] = useState('');
    const [selectedUser, setSelectedUser] = useState('Everyone');

    const myVideoGrid = useRef();
    const currentPeer = useRef();
    const sharingVideoGrid = useRef();
    const sharingGrid = useRef();



    const ENDPOINT = 'localhost:5000';
    const DOMAIN = 'http://localhost:3000/'

    const myPeer = new Peer(undefined, {
        host: '/',
        port: '3001'
    })

    const myVideo = document.createElement('video');
    const sharingVideo = document.createElement('video');
    sharingVideo.className = 'sharingVideo';
    myVideo.className = 'myVideo';
    myVideo.muted = true;
    const peers = {}

    useEffect(() => {
        myPeer.on('error', e => {
            console.log("connection set", e.type);
        })

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            setMyStream(stream);
            addVideoStream(myVideo, stream)
            myPeer.on('call', call => {
                call.answer(stream);
                const video = document.createElement('video');
                video.controls = true;
                call.on('stream', userVideoStream => {
                    addVideoStream(video, userVideoStream)
                    currentPeer.current = call.peerConnection;
                })
            })

            socket.on('user-connected', userId => {
                connectToNewUser(userId, stream)
            })


        })
    }, []);


    function handleChange(e) {
        setSelectedUser(e.target.value);
    }



    useEffect(() => {
        const { name, room, host } = queryString.parse(props.location.search);
        setName(name);
        setRoom(room);
        if (host !== '') {
            setHostName(host);
        }

        socket = io(ENDPOINT);

        myPeer.on('open', userId => {
            setMyID(userId)
            socket.emit('join', { name, room, userId }, (error) => {
                if (error) {
                    alert(error);
                }
            });
        })

        return () => {
            socket.emit('disconnect');
            socket.off();
        }

    }, [ENDPOINT, props.location.search]);


    useEffect(() => {
        socket.on("info", (info) => {
            setIsSharing(info);
        })

    })

    function addVideoStream(video, stream) {
        video.srcObject = stream

        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        myVideoGrid.current.append(video);

    }

    function addVideoStream2(video, stream) {
        video.srcObject = stream

        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        sharingGrid.current.append(video);
    }

    function shareScreen() {
        navigator.mediaDevices.getDisplayMedia({
            video: {
                cursor: "always"
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true
            }
        }).then((stream) => {
            socket.emit('sharingScreen', true);
            setIsSharingLocal(true);
            let videoTrack = stream.getVideoTracks()[0];
            videoTrack.onended = function () {
                stopScreenSharing();
            }
            let sender = currentPeer.current.getSenders().find(function (s) {
                return s.track.kind === videoTrack.kind;
            })
            sender.replaceTrack(videoTrack);

        })

    }

    function showInfoModal() {
        setInfoModal(true);
    }

    function hideInfoModal() {
        setInfoModal(false);
    }


    function stopScreenSharing() {
        socket.emit('sharingScreen', false);
        setIsSharingLocal(false);
        myVideo.id = '';
        let videoTrack = myStream.getVideoTracks()[0];

        let sender = currentPeer.current.getSenders().find(function (s) {
            return s.track.kind === videoTrack.kind;
        })
        sender.replaceTrack(videoTrack);

    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    useEffect(() => {
        socket.on('message', (message) => {
            setMessages(messages => [...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);




    useEffect(() => {
        socket.on('user-disconnected', userId => {
            if (peers[userId]) peers[userId].close()
        })
    }, [])



    const sendMessage = (event) => {
        event.preventDefault();
        let messageType = 'text';
        if (message) {
            socket.emit('sendMessage', message, selectedUser, messageType, () => setMessage(''));
        }
    }

    const showHideChats = () => {
        setChatsVisible(!chatsVisible);
    }
    const showParticipants = () => {
        setparticipantsVisible(true);
    };
    const onClose = () => {
        setparticipantsVisible(false);
    };

    function connectToNewUser(userId, stream) {
        const call = myPeer.call(userId, stream)
        const video = document.createElement('video')
        video.controls = true;
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
            currentPeer.current = call.peerConnection;
        })
        call.on('close', () => {
            video.remove()
        })

        peers[userId] = call
    }


    function handleFile(e) {
        let fileType;
        const file = e.target.files[0];
        if (file) {
            const file_name = file["name"];
            const file_extension = file_name.split('.').pop();
            if (file_extension === 'docx' || file_extension === 'doc' || file_extension === 'pdf' || file_extension === 'ppt' || file_extension === 'pptx' || file_extension === 'xlsx' || file_extension === 'DOCX' || file_extension === 'DOC' || file_extension === 'PDF' || file_extension === 'PPT' || file_extension === 'PPTX' || file_extension === 'XLSX') {
                fileType = 'document';
            } else if (file_extension === 'jpg' || file_extension === 'jpeg' || file_extension === 'gif' || file_extension === 'png' || file_extension === 'JPG' || file_extension === 'JPEG' || file_extension === 'GIF' || file_extension === 'PNG') {
                fileType = 'image'
            } else {
                return;
            }
            socket.emit('sendFile', file, selectedUser, fileType, file_name, file_extension, () => setMessage(''));
        }

    }

    const muteUnmute = () => {
        const enabled = myStream.getAudioTracks()[0].enabled;
        if (enabled) {
            myStream.getAudioTracks()[0].enabled = false;
            setAudioEnabled(false);

        } else {
            myStream.getAudioTracks()[0].enabled = true;
            setAudioEnabled(true);
        }
    }

    const playStop = () => {
        let enabled = myStream.getVideoTracks()[0].enabled;
        if (enabled) {
            myStream.getVideoTracks()[0].enabled = false;
            setVideoEnabled(false);

        } else {
            myStream.getVideoTracks()[0].enabled = true;
            setVideoEnabled(true);
        }
    }

    const content = (
        <div>
            <p>Security</p>
            <p onClick={showInfoModal}>Info</p>
            {/* <Modal
                title="Meeting Info"
                visible={infoModal}
                onCancel={hideInfoModal}
                footer={[
                    <Button variant="outlined" onClick={hideInfoModal}>
                        Ok
                    </Button>,
                ]}
            >
                <h2 style={{ textAlign: "center" }}>{props.meeting.title}</h2>
                <h3>Host: {props.meeting.hostFirstName ? capitalizeFirstLetter(props.meeting.hostFirstName) + " " + capitalizeFirstLetter(props.meeting.hostLastName) : null} </h3>
                <h3>Meeting ID: {props.meeting.meetingId}</h3>
                <h3>Meeting Link: {<span style={{ color: "rgb(3, 132, 89)" }}>{DOMAIN}{props.meeting.meetingId}</span>}</h3>
            </Modal> */}

            <p onClick={showParticipants}>Participants({users.length})</p>
            <p onClick={showHideChats}>Chats</p>
            <p><a style={{ color: "red" }} href="/profile">Leave Meeting</a></p>
        </div>
    );
    function renderMainScreen(chatsVisible) {
        const { meeting } = props;
        if (chatsVisible) {
            return (
                <Fragment>
                    <Col xs={24} lg={19} style={videoGrid}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div id="video-grid" ref={myVideoGrid} style={{ flexGrow: 1 }}>


                            </div>
                            <div style={{ marginLeft: "auto", marginRight: "auto", marginTop: 20, width: "80%", flexGrow: 3, backgroundColor: "#e9edef", textAlign: "center", justifyContent: "center", padding: 10, }}>
                                <h3 style={{ marginTop: 50 }}><span style={{ fontWeight: "bold" }}>Meeting Title:</span> Ajira Digital Training</h3>
                                <h3 style={{ marginTop: 40 }}><span style={{ fontWeight: "bold" }}>Meeting Host:</span> Moses Mugoya</h3>
                                <h3 style={{ marginTop: 40 }}> <span style={{ fontWeight: "bold" }}>Meeting ID:</span> 573JMDNDKS</h3>
                                <h3 style={{ marginTop: 40 }}><span style={{ fontWeight: "bold" }}>Meeting Link:</span> <span style={{ color: "green" }}>https://localhost:3000/573JMDNDKS</span></h3>
                            </div>
                        </div>



                        <div style={mainControls}>
                            {
                                matches
                                    ?
                                    <Row>
                                        <Col lg={13} xs={13} style={mainControlsBlock1}>
                                            <div onClick={muteUnmute} className="main__controls__button main__mute_button">
                                                {
                                                    audioEnabled
                                                        ?
                                                        <Fragment><MicIcon />
                                                            <span>Mute</span></Fragment>
                                                        :
                                                        <Fragment>
                                                            <MicOffIcon />
                                                            <span>Unmute</span>
                                                        </Fragment>

                                                }
                                            </div>
                                            <div onClick={playStop} className="main__controls__button main__video_button">
                                                {
                                                    videoEnabled
                                                        ?
                                                        <Fragment><VideocamIcon />
                                                            <span>Stop Video</span></Fragment>
                                                        :
                                                        <Fragment>
                                                            <VideocamOffIcon />
                                                            <span>Play Video</span>
                                                        </Fragment>

                                                }
                                            </div>

                                        </Col>
                                        <Col lg={5} xs={5}>

                                        </Col>

                                        <Col lg={6} xs={6} style={mainControlsBlock3}>
                                            <Popover content={content} trigger="click">
                                                <div className="main__controls__button">
                                                    <MoreHorizIcon />
                                                    <span>More</span>
                                                </div>
                                            </Popover>
                                        </Col>

                                    </Row>

                                    :
                                    <Row>
                                        <Col lg={8} style={mainControlsBlock1}>
                                            <div onClick={muteUnmute} className="main__controls__button main__mute_button">
                                                {
                                                    audioEnabled
                                                        ?
                                                        <Fragment><MicIcon />
                                                            <span>Mute</span></Fragment>
                                                        :
                                                        <Fragment>
                                                            <MicOffIcon />
                                                            <span>Unmute</span>
                                                        </Fragment>

                                                }
                                            </div>
                                            <div onClick={playStop} className="main__controls__button main__video_button">
                                                {
                                                    videoEnabled
                                                        ?
                                                        <Fragment><VideocamIcon />
                                                            <span>Stop Video</span></Fragment>
                                                        :
                                                        <Fragment>
                                                            <VideocamOffIcon />
                                                            <span>Play Video</span>
                                                        </Fragment>

                                                }
                                            </div>

                                        </Col>
                                        <Col lg={8} style={mainControlsBlock2}>
                                            <div className="main__controls__button" onClick={showInfoModal}>
                                                <InfoIcon />
                                                <span>Info</span>
                                            </div>
                                            {/* <Modal
                                                title="Meeting Info"
                                                visible={infoModal}
                                                onCancel={hideInfoModal}
                                                footer={[
                                                    <Button variant="outlined" onClick={hideInfoModal}>
                                                        Ok
                                                    </Button>,
                                                ]}
                                            >
                                                <h2 style={{ textAlign: "center" }}>{meeting.title}</h2>
                                                <h3>Host: {meeting.hostFirstName ? capitalizeFirstLetter(meeting.hostFirstName) + " " + capitalizeFirstLetter(meeting.hostLastName) : null} </h3>
                                                <h3>Meeting ID: {meeting.meetingId}</h3>
                                                <h3>Meeting Link: {<span style={{ color: "rgb(3, 132, 89)" }}>{DOMAIN}{meeting.meetingId}</span>}</h3>
                                            </Modal> */}
                                            <div className="main__controls__button">
                                                <SecurityIcon />
                                                <span>Security</span>
                                            </div>
                                            <div className="main__controls__button" style={{ textAlign: "center" }} onClick={shareScreen}>
                                                <ScreenShareIcon />
                                                <span>Share Screen</span>
                                            </div>
                                            <div className="main__controls__button" style={{ textAlign: "center" }} onClick={showParticipants}>
                                                <Badge color="secondary" badgeContent={users.length}>
                                                    <PeopleIcon />
                                                </Badge>
                                                <span>Participants</span>
                                            </div>
                                            <div className="main__controls__button" style={{ textAlign: "center" }} onClick={showHideChats}>
                                                <ChatBubbleIcon />
                                                <span>Chats</span>
                                            </div>
                                        </Col>
                                        <Col lg={4}>

                                        </Col>
                                        <Col lg={4} style={mainControlsBlock3}>
                                            <div className="main__controls__block">
                                                <div className="main__controls__button" >
                                                    <Button href="/profile" type="primary" danger>Leave meeting</Button>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                            }

                        </div>
                        <Drawer
                            title={<h4 style={{ fontWeight: "bold", textAlign: "center", color: "black" }}>{`Participants(${users.length})`}</h4>}
                            placement="right"
                            closable={false}
                            onClose={onClose}
                            visible={participantsVisible}
                            drawerStyle={{ backgroundColor: "white" }}
                            headerStyle={{ backgroundColor: "white" }}
                        >
                            <ParticipantsModal users={users} />
                        </Drawer>
                    </Col>
                    <Col xs={24} lg={5} style={chatGrid}>
                        <h3 style={{ marginTop: 20, color: 'white', textAlign: "center" }}>Chats</h3>
                        <div className="main__chat_window">
                            <Messages messages={messages} name={name} />
                        </div>
                        <label for="users" style={{ color: "white", margin: 1 }}>Send to:</label>
                        <select name="users" id="users" value={selectedUser} style={{ padding: 2, color: "black" }} onChange={handleChange}>
                            <option value="Everyone">Everyone</option>
                            {users && users.map(chat =>
                                <option key={chat.id} value={chat.socketID}>{chat.name}</option>
                            )};
                        </select>
                        <div style={chatInput}>
                            <input id="chat_message" style={chatMessage} type="text" value={message}
                                onChange={({ target: { value } }) => setMessage(value)}
                                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null} placeholder="Type message here..." />
                            <input accept="image/*,.pdf,.doc,.docx,video/*,.pptx,.ppt,.xlsx" onChange={handleFile} id="icon-button-file" type="file" style={{ display: "none" }} />
                            <label htmlFor="icon-button-file">
                                <AttachFileIcon style={{ color: "white", marginRight: 2 }} />
                            </label>
                            <SendIcon style={{ color: "white" }} onClick={e => sendMessage(e)} />
                        </div>

                    </Col>
                </Fragment>
            )
        } else {
            return (<Fragment>
                <Col xs={24} lg={24} style={videoGrid}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div id="video-grid" ref={myVideoGrid} style={{ flexGrow: 1 }}>


                        </div>
                        <div ref={sharingGrid} style={{ marginLeft: "auto", marginRight: "auto", marginTop: 20, width: "80%", flexGrow: 3, backgroundColor: "#e9edef", textAlign: "center", justifyContent: "center", padding: 10, }}>
                            <h3 style={{ marginTop: 50 }}><span style={{ fontWeight: "bold" }}>Meeting Title:</span> Ajira Digital Training</h3>
                            <h3 style={{ marginTop: 40 }}><span style={{ fontWeight: "bold" }}>Meeting Host:</span> Moses Mugoya</h3>
                            <h3 style={{ marginTop: 40 }}> <span style={{ fontWeight: "bold" }}>Meeting ID:</span> 573JMDNDKS</h3>
                            <h3 style={{ marginTop: 40 }}><span style={{ fontWeight: "bold" }}>Meeting Link:</span> <span style={{ color: "green" }}>https://localhost:3000/573JMDNDKS</span></h3>
                        </div>
                    </div>


                    <div style={mainControls}>
                        {
                            matches
                                ?
                                <Row>
                                    <Col lg={13} xs={13} style={mainControlsBlock1}>
                                        <div onClick={muteUnmute} className="main__controls__button main__mute_button">
                                            {
                                                audioEnabled
                                                    ?
                                                    <Fragment><MicIcon />
                                                        <span>Mute</span></Fragment>
                                                    :
                                                    <Fragment>
                                                        <MicOffIcon />
                                                        <span>Unmute</span>
                                                    </Fragment>

                                            }
                                        </div>
                                        <div onClick={playStop} className="main__controls__button main__video_button">
                                            {
                                                videoEnabled
                                                    ?
                                                    <Fragment><VideocamIcon />
                                                        <span>Stop Video</span></Fragment>
                                                    :
                                                    <Fragment>
                                                        <VideocamOffIcon />
                                                        <span>Play Video</span>
                                                    </Fragment>

                                            }
                                        </div>

                                    </Col>
                                    <Col lg={5} xs={5}>

                                    </Col>

                                    <Col lg={6} xs={6} style={mainControlsBlock3}>
                                        <Popover content={content} trigger="click">
                                            <div className="main__controls__button">
                                                <MoreHorizIcon />
                                                <span>More</span>
                                            </div>
                                        </Popover>
                                    </Col>

                                </Row>

                                :
                                <Row>
                                    <Col lg={8} style={mainControlsBlock1}>
                                        <div onClick={muteUnmute} className="main__controls__button main__mute_button">
                                            {
                                                audioEnabled
                                                    ?
                                                    <Fragment><MicIcon />
                                                        <span>Mute</span></Fragment>
                                                    :
                                                    <Fragment>
                                                        <MicOffIcon />
                                                        <span>Unmute</span>
                                                    </Fragment>

                                            }
                                        </div>
                                        <div onClick={playStop} className="main__controls__button main__video_button">
                                            {
                                                videoEnabled
                                                    ?
                                                    <Fragment><VideocamIcon />
                                                        <span>Stop Video</span></Fragment>
                                                    :
                                                    <Fragment>
                                                        <VideocamOffIcon />
                                                        <span>Play Video</span>
                                                    </Fragment>

                                            }
                                        </div>

                                    </Col>
                                    <Col lg={8} style={mainControlsBlock2}>
                                        <div className="main__controls__button" onClick={showInfoModal}>
                                            <InfoIcon />
                                            <span>Info</span>
                                        </div>
                                        {/* <Modal
                                            title="Meeting Info"
                                            visible={infoModal}
                                            onCancel={hideInfoModal}
                                            footer={[
                                                <Button variant="outlined" onClick={hideInfoModal}>
                                                    Ok
                                                    </Button>,
                                            ]}
                                        >
                                            <h2 style={{ textAlign: "center" }}>{meeting.title}</h2>
                                            <h3>Host: {meeting.hostFirstName ? capitalizeFirstLetter(meeting.hostFirstName) + " " + capitalizeFirstLetter(meeting.hostLastName) : null} </h3>
                                            <h3>Meeting ID: {meeting.meetingId}</h3>
                                            <h3>Meeting Link: {<span style={{ color: "rgb(3, 132, 89)" }}>{DOMAIN}{meeting.meetingId}</span>}</h3>
                                        </Modal> */}
                                        <div className="main__controls__button">
                                            <SecurityIcon />
                                            <span>Security</span>
                                        </div>
                                        <div className="main__controls__button" style={{ textAlign: "center" }} onClick={shareScreen}>
                                            <ScreenShareIcon />
                                            <span>Share Screen</span>
                                        </div>
                                        <div className="main__controls__button" style={{ textAlign: "center" }} onClick={showParticipants}>
                                            <Badge color="secondary" badgeContent={users.length}>
                                                <PeopleIcon />
                                            </Badge>
                                            <span>Participants</span>
                                        </div>
                                        <div className="main__controls__button" style={{ textAlign: "center" }} onClick={showHideChats}>
                                            <ChatBubbleIcon />
                                            <span>Chats</span>
                                        </div>
                                    </Col>
                                    <Col lg={4}>

                                    </Col>
                                    <Col lg={4} style={mainControlsBlock3}>
                                        <div className="main__controls__block">
                                            <div className="main__controls__button" >
                                                <Button href="/profile" type="primary" danger>Leave meeting</Button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                        }
                    </div>
                    <Drawer
                        title={<h4 style={{ fontWeight: "bold", textAlign: "center", color: "black" }}>{`Participants(${users.length})`}</h4>}
                        placement="right"
                        closable={false}
                        onClose={onClose}
                        visible={participantsVisible}
                        drawerStyle={{ backgroundColor: "white" }}
                        headerStyle={{ backgroundColor: "white" }}

                    >
                        <ParticipantsModal users={users} />
                    </Drawer>
                </Col>
            </Fragment >
            )
        }
    }
    return (
        <div>
            <Row>
                {
                    renderMainScreen(chatsVisible)
                }
            </Row>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    const { room } = queryString.parse(ownProps.location.search);
    const meetings = state.firestore.data.Meetings;
    const meeting = meetings ? meetings[room] : null
    return {
        meeting,
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

export default connect(mapStateToProps)(MeetingRoom)
