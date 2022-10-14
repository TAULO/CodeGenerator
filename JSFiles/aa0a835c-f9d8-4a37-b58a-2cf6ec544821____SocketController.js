import ControllScreen from "../view/ControllScreen.js";
import ConfigScreenName from "../config/ConfigScreenName.js";
import GetDataMySeft from "../model/server/getdata/GetDataMySeft.js";
import OnlineModeDataField from "../model/onlineMode/dataField/OnlineModeDataField.js";
import DataCommand from "../common/DataCommand.js";
import ControllScreenDialog from "../view/ControllScreenDialog.js";
import QuestNotification from "../modules/menu/QuestAndAchievement/Data/QuestNotification.js";
import AchievedNotification from "../modules/menu/QuestAndAchievement/Data/AchievedNotification.js";
import DailyQuestNotification from "../modules/menu/QuestAndAchievement/Data/DailyQuestNotification.js";
import EventGame from "./EventGame.js";
import MainData from "../model/MainData.js";
import DataField from "../model/DataField.js";
import ShopDataField from "../model/shop/datafield/ShopDatafield.js";
import ShopCommand from "../model/shop/datafield/ShopCommand.js";
import OnlineModeCRDataCommand from "../model/onlinemodecreatroom/datafield/OnlineModeCRDataCommand.js";
import EventModeCommand from "../model/eventmode/datafield/EventModeCommand.js";
import ControllDialog from "../view/ControllDialog.js";
import ControllLoading from "../view/ControllLoading.js";
import EventModeDatafield from "../model/eventmode/datafield/EventModeDatafield.js";
import PlayScriptScreen from "../view/playscript/playScriptScreen.js";
import ConfigPlatform from "../config/ConfigPlatform.js";
import ControllTextScroller from "../view/ControllTextScroller.js";
import KeyBoard from "../view/component/KeyBoard.js";
import ControllTurnbaseRequestUpdate from "./ControllTurnbaseRequestUpdate.js";
import Common from "../common/Common.js";
import DataUser from "../model/user/DataUser.js";
import ControllQuestLogUpdate from "./ControllQuestLogUpdate.js";
import ControllLocalStorage from "./ControllLocalStorage.js";
import PushNotifyLocal from "../PushNotifyLocal.js";
import PlayingLogic from "./PlayingLogic.js";
import FaceBookCheckingTools from "../FaceBookCheckingTools.js";
import ControllDataMessages from "./ControllDataMessages.js";
import SqlLiteController from "../SqlLiteController.js";

export default class SocketController {
    static instance() {
        if (this.socketController) {

        } else {
            this.socketController = new SocketController();
        }

        return this.socketController;
    }
    constructor() {
        this.socket = null;
        this.ktLogin = false;
        this.timeBegin = 0;
        this.idPing = null;
        this.events = {
            onConnection: new Phaser.Signal(),
            onConnectionLost: new Phaser.Signal(),
            onLoginError: new Phaser.Signal(),
            onLogin: new Phaser.Signal(),
            onRoomJoinError: new Phaser.Signal(),
            onRoomJoin: new Phaser.Signal(),
            onPublicMessage: new Phaser.Signal(),
            onPrivateMessage: new Phaser.Signal(),
            onUserEnterRoom: new Phaser.Signal(),
            onUserExitRoom: new Phaser.Signal(),
            onUserCountChange: new Phaser.Signal(),
            onRoomRemove: new Phaser.Signal(),
            onRoomAdd: new Phaser.Signal(),
            onExtensionResponse: new Phaser.Signal(),
            onRoomCreationError: new Phaser.Signal(),
            onRoomVarsUpdate: new Phaser.Signal(),
            onSpectatorToPlayer: new Phaser.Signal(),
            onSpectatorToPlayerError: new Phaser.Signal(),
            onPlayerToSpectator: new Phaser.Signal(),
            onPlayerToSpectatorError: new Phaser.Signal(),
            onUserVarsUpdate: new Phaser.Signal(),
            onGroupSubscribed: new Phaser.Signal(),
            onGroupSubscribedError: new Phaser.Signal(),
            onGroupUnsubscribed: new Phaser.Signal(),
            onGroupUnsubscribedError: new Phaser.Signal(),
            onInvitation: new Phaser.Signal(),
            onInvitationReply: new Phaser.Signal(),
            onInvitationReplyError: new Phaser.Signal(),
            onRoomFindResult: new Phaser.Signal(),
            onAdminMessage: new Phaser.Signal(),
            onModeratorMessage: new Phaser.Signal()
        }
        this.roomLobby = null;
        this.ktPlay = false;
        this.idxPing = null;
        this.dataMySeft = null;
        // this.initListenerSfs();
    }
    initListenerSfs(config) {
        LogConsole.log('initListenerSfs');
        this.removeAllEvent();
        this.socket = null;
        this.configZoneServer = config.zone;
        // Create new Session
        this.socket = new SFS2X.SmartFox(config);
        MainData.instance().zoneSFS = config.zone;
        // Add smartfox events
        this.addEvent(SFS2X.SFSEvent.CONNECTION, this.onConnectionCallback);
        this.addEvent(SFS2X.SFSEvent.CONNECTION_LOST, this.onConnectionLostCallback);
        this.addEvent(SFS2X.SFSEvent.LOGIN_ERROR, this.onLoginErrorCallback);
        this.addEvent(SFS2X.SFSEvent.LOGIN, this.onLoginCallback);
        this.addEvent(SFS2X.SFSEvent.LOGOUT, this.onLogoutCallback);
        this.addEvent(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this.onRoomJoinErrorCallback);
        this.addEvent(SFS2X.SFSEvent.ROOM_JOIN, this.onRoomJoinCallback);
        this.addEvent(SFS2X.SFSEvent.PUBLIC_MESSAGE, this.onPublicMessageCallback);
        this.addEvent(SFS2X.SFSEvent.USER_ENTER_ROOM, this.onUserEnterRoomCallback);
        this.addEvent(SFS2X.SFSEvent.USER_EXIT_ROOM, this.onUserExitRoomCallback);
        this.addEvent(SFS2X.SFSEvent.EXTENSION_RESPONSE, this.onExtensionResponseCallback);

        this.addEvent(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, this.onRoomVarsUpdateCallback);
        this.addEvent(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this.onUserVarsUpdateCallback);
        this.addEvent(SFS2X.SFSEvent.INVITATION, this.onInvitationCallback);
        this.addEvent(SFS2X.SFSEvent.INVITATION_REPLY, this.onInvitationReplyCallback);
        this.addEvent(SFS2X.SFSEvent.INVITATION_REPLY_ERROR, this.onInvitationReplyErrorCallback);
        this.addEvent(SFS2X.SFSEvent.PING_PONG, this.onPingPong);

        this.callPingServer();

    }

    removeAllEvent() {
        this.removeEvent(SFS2X.SFSEvent.CONNECTION, this.onConnectionCallback);
        this.removeEvent(SFS2X.SFSEvent.CONNECTION_LOST, this.onConnectionLostCallback);
        this.removeEvent(SFS2X.SFSEvent.LOGIN_ERROR, this.onLoginErrorCallback);
        this.removeEvent(SFS2X.SFSEvent.LOGIN, this.onLoginCallback);
        this.removeEvent(SFS2X.SFSEvent.LOGOUT, this.onLogoutCallback);
        this.removeEvent(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this.onRoomJoinErrorCallback);
        this.removeEvent(SFS2X.SFSEvent.ROOM_JOIN, this.onRoomJoinCallback);
        this.removeEvent(SFS2X.SFSEvent.PUBLIC_MESSAGE, this.onPublicMessageCallback);
        this.removeEvent(SFS2X.SFSEvent.USER_ENTER_ROOM, this.onUserEnterRoomCallback);
        this.removeEvent(SFS2X.SFSEvent.USER_EXIT_ROOM, this.onUserExitRoomCallback);
        this.removeEvent(SFS2X.SFSEvent.EXTENSION_RESPONSE, this.onExtensionResponseCallback);

        this.removeEvent(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, this.onRoomVarsUpdateCallback);
        this.removeEvent(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this.onUserVarsUpdateCallback);
        this.removeEvent(SFS2X.SFSEvent.INVITATION, this.onInvitationCallback);
        this.removeEvent(SFS2X.SFSEvent.INVITATION_REPLY, this.onInvitationReplyCallback);
        this.removeEvent(SFS2X.SFSEvent.INVITATION_REPLY_ERROR, this.onInvitationReplyErrorCallback);
        this.removeEvent(SFS2X.SFSEvent.PING_PONG, this.onPingPong);
    }

    getTime() {
        let d = new Date();
        let n = d.getTime();
        return n;
    }

    callPingServer() {
        this.timeBegin = this.getTime();
        $.ajax({
            type: "GET",
            url: "https://cdn.gamezoka.com/storage/mp3/ping/pong.txt?time=" + this.getTime(),
            data: {},
            dataType: 'json',
            success: this.successPing.bind(this),
            error: this.errorPing.bind(this)
        });
    }

    successPing() {
        this.checkPingServer();
    }
    errorPing() {
        this.checkPingServer();
    }

    checkPingServer() {
        let timeEnd = this.getTime();
        /*
        console.log("window.performance.memory ");
        console.log(window.performance.memory.jsHeapSizeLimit / (1024 * 1024));
        console.log(window.performance.memory.totalJSHeapSize / (1024 * 1024));
        console.log(window.performance.memory.usedJSHeapSize / (1024 * 1024));*/

        let duration = (timeEnd - this.timeBegin) / 1000;
        let bitsLoaded = 8000 * 8;
        let speedBps = (bitsLoaded / duration).toFixed(2);
        let speedKbps = (speedBps / 1024).toFixed(2);
        let speedMbps = (speedKbps / 1024).toFixed(2);
        //
        let pingServer = speedKbps;

        /*
        if (pingServer < 250) {
            EventGame.instance().event.bad_connection.dispatch()
        }*/

        if (this.dataMySeft !== null) {
            this.dataMySeft.lag_value = pingServer;
        }

        this.removeIdBadConnect();
        this.idPing = game.time.events.add(Phaser.Timer.SECOND * 2, this.callPingServer, this);
    }

    removeIdBadConnect() {
        if (this.idPing !== null) {
            game.time.events.remove(this.idPing);
        }
    }

    onPingPong(event) {
        /*
        if (event.lagValue > 200) {
            EventGame.instance().event.bad_connection.dispatch();
        }       
        this.dataMySeft.lag_value = event.lagValue;*/
    }

    onPublicMessageCallback(event) {
        this.events.onPublicMessage.dispatch(event);
    }

    onInvitationCallback(event) {
        LogConsole.log("onInvitation : " + this.dataMySeft.is_playing_game)
        LogConsole.log(event);
        LogConsole.log("playScript.playing_guide : " + MainData.instance().playScript.playing_guide);
        if (this.dataMySeft.is_playing_game === true || MainData.instance().playScript.playing_guide !== PlayScriptScreen.DONE_ALL) {

        } else {
            ControllScreenDialog.instance().addDialogInviteFriend(event.invitation);
        }

        this.events.onInvitation.dispatch(event);
    }

    onInvitationReplyCallback(event) {
        this.events.onInvitationReply.dispatch(event);
    }

    onInvitationReplyErrorCallback(event) {
        LogConsole.log("onInvitationReplyError");
        LogConsole.log(event);
        LogConsole.log(event.errorMessage);
        ControllScreenDialog.instance().addDialog(event.errorMessage);

        this.events.onInvitationReplyError.dispatch(event);
    }

    onRoomVarsUpdateCallback(event) {
        this.events.onRoomVarsUpdate.dispatch(event);
    }

    onUserVarsUpdateCallback(event) {
        // console.log("onUserVarsUpdateCallback  : " + event.user.isItMe);
        // console.log(event);
        if (event.user.isItMe) {
            this.updateMySeft();
        }
        this.events.onUserVarsUpdate.dispatch(event);
    }

    onUserEnterRoomCallback(event) {
        this.events.onUserEnterRoom.dispatch(event);
    }

    onUserExitRoomCallback(event) {
        if (event.room.isGame) {
            if (event.user.isItMe) {
                this.ktPlay = false;
            } else { }
        }
        this.events.onUserExitRoom.dispatch(event);
    }

    connect() {
        LogConsole.log('connect sv');
        ControllLoading.instance().showLoading();
        this.socket.connect();
    }

    addEvent(event, listener) {
        this.socket.addEventListener(event, listener, this);
    }

    removeEvent(event, listener) {
        if (this.socket !== null) {
            this.socket.removeEventListener(event, listener, this);
        }
    }

    onConnectionCallback(event) {
        //LogConsole.log('onConnectionCallback');
        this.events.onConnection.dispatch(event);
        EventGame.instance().event.onConnectServer.dispatch();
    }

    onConnectionLostCallback(event) {
        this.roomLobby = null;
        //SocketController.instance().disconnect();
        if (MainData.instance().LOGED_IN == true) {
            ControllScreenDialog.instance().removeAllItem();
            ControllDialog.instance().addPopupDisconnect();
        }
        this.removeReplayPing();
        KeyBoard.instance().hide();
        this.events.onConnectionLost.dispatch(event);
    }

    onLoginErrorCallback(event) {
        LogConsole.log("onLoginErrorCallback-------------------");
        LogConsole.log(event);
        this.events.onLoginError.dispatch(event);
    }

    onLoginCallback(event) {
        LogConsole.log("onLoginCallback-------------------");
        MainData.instance().LOGED_IN = true;
        LogConsole.log(event);
        this.socket.enableLagMonitor(true);
        this.events.onLogin.dispatch(event);

        // this.sendPingServer();

        // this.updateMySeft();
    }

    onLogoutCallback(event) {
        LogConsole.log("onLogoutCallback-------------------");
        LogConsole.log(event);
        MainData.instance().LOGED_IN = false;
        ControllScreenDialog.instance().removeAllItem();
        ControllLoading.instance().showLoading();
        ControllDialog.instance().removeAllItem();
        MainData.instance().dataServer.resetDataServer();
        DataUser.instance().resetData();
        this.removeReplayPing();
        ControllScreen.instance().changeScreen(ConfigScreenName.LOGIN);
    }

    updateMySeft() {
        // LogConsole.log(this.socket);
        if (this.socket.mySelf !== null) {
            this.dataMySeft = GetDataMySeft.begin(this.socket.mySelf);
        }
    }

    onRoomJoinErrorCallback(event) {
        LogConsole.log("onRoomJoinErrorCallback-------------------");
        LogConsole.log(event);
        this.events.onRoomJoinError.dispatch(event);
    }

    onRoomJoinCallback(event) {
        LogConsole.log("onRoomJoinCallback-------------------");
        LogConsole.log(event);
        this.ktLogin = false;
        if (this.roomLobby === null) {
            this.roomLobby = this.socket.lastJoinedRoom;

            DataUser.instance().beginLoadData();

            let nowDate = new Date();
            let dayNow = nowDate.getDate();
            let monthNow = nowDate.getMonth() + 1;
            let yearNow = nowDate.getFullYear();
            let idDayNow = dayNow + "" + monthNow + "" + yearNow;

            let count = ControllLocalStorage.instance().getItem(idDayNow);

            if (count === "error" || count === null || count === "null") {
                count = 1;
                let dateOld = new Date();
                dateOld.setDate(dateOld.getDate() - 1);
                let dayOld = dateOld.getDate();
                let monthOld = dateOld.getMonth() + 1;
                let yearOld = dateOld.getFullYear();
                let idDayOld = dayOld + "" + monthOld + "" + yearOld;
                let countOld = ControllLocalStorage.instance().getItem(idDayOld);
                if (countOld === "error" || countOld === null || countOld === "null") {
                } else {
                    let dataPushOld = {
                        id: 1
                    }
                    PushNotifyLocal.instance().clearPush(dataPushOld);
                    ControllLocalStorage.instance().removeItem(idDayOld);
                }
            } else {
                count = parseInt(count) + 1;
            }
            if (count > 0) {
                let dailyPush = "Daily" + idDayNow;
                let idPush = ControllLocalStorage.instance().getItem(dailyPush);
                if (idPush === "error" || idPush === null || idPush === "null") {
                    let dateNew = new Date();
                    dateNew.setHours(PlayingLogic.instance().randomNumber(8, 20));
                    let datePush = new Date(dateNew.getTime());
                    datePush.setDate(nowDate.getDate() + 1);

                    let dataPush = {
                        id: 1,
                        title: "[Wazzat]Phần thường hằng ngày đã sẵn sàng",
                        text: "Hãy nhanh tay nhận phần thưởng",
                        trigger: {
                            at: datePush
                        }
                    }

                    PushNotifyLocal.instance().setLocalPush(dataPush);

                    if (PushNotifyLocal.instance().ktPush) {
                        FaceBookCheckingTools.instance().logEvent("LocalDailyPush");
                    }

                    ControllLocalStorage.instance().setItem(dailyPush, true);
                }
            }

            ControllLocalStorage.instance().setItem(idDayNow, count);
        }

        let room = event.room;
        if (room.isGame) {
            this.ktPlay = true;
            if (room.getVariable("mode").value === "OnlineMode" || room.getVariable("mode").value === "OnlineModeRoom") {
                LogConsole.log("MainData.instance().state :" + MainData.instance().state);
                if (MainData.instance().state === ConfigScreenName.ONLINE_MODE) {
                    this.events.onRoomJoin.dispatch(event);
                } else {
                    MainData.instance().dataJoinRoom = event;
                    ControllScreen.instance().changeScreen(ConfigScreenName.ONLINE_MODE)
                }
            } else {
                this.events.onRoomJoin.dispatch(event);
            }

        } else {
            this.ktPlay = false;
            this.events.onRoomJoin.dispatch(event);
        }
    }

    onExtensionResponseCallback(event) {
        if (
            event.cmd === "EVENT_MODE_LOAD_DISPLAY_PLAYERS" ||
            event.cmd === "USER_PING"
        ) {

        } else {
            LogConsole.log("event.cmd : " + event.cmd);
            LogConsole.log(event.params.getDump());
        }

        if (event.params.getUtfString(DataField.status) === "FAILED") {
            if (
                event.cmd === OnlineModeCRDataCommand.ONLINE_MODE_ROOM_INVITE_RESPONSE
            ) {
            } else {
                ControllScreenDialog.instance().addDialog(event.params.getUtfString(DataField.message));
            }
            this.events.onExtensionResponse.dispatch(event);
        } else if (event.params.getUtfString(DataField.status) === "WARNING") {
            if (event.cmd === DataCommand.CHALLENGE_GAME_GET_PLAYLISTS_RESPONSE) {
                this.events.onExtensionResponse.dispatch(event);
            } else if (event.cmd === DataCommand.CHALLENGE_GAME_FINISH_RESPONSE) {
                this.events.onExtensionResponse.dispatch(event);
            } else if (event.cmd == DataCommand.SOLO_MODE_PLAYLIST_SELECTED_RESPONSE) {
                this.events.onExtensionResponse.dispatch(event);
            } else if (event.cmd == DataCommand.CHALLENGE_GAME_QUESTIONS_RESPONSE) {
                this.events.onExtensionResponse.dispatch(event);
            } else if (event.cmd === OnlineModeCRDataCommand.ONLINE_MODE_ROOM_INVITE_RESPONSE) {
                this.events.onExtensionResponse.dispatch(event);
            } else if (event.cmd === DataCommand.SOLO_MODE_QUESTION_RESPONSE) {
                if (event.params.getUtfString(DataField.message) == "User has no heart to play practice mode.") {
                    this.events.onExtensionResponse.dispatch(event);
                } else {
                    ControllScreenDialog.instance().addDialog(event.params.getUtfString(DataField.message));
                    this.events.onExtensionResponse.dispatch(event);
                }
            }
            else {
                ControllScreenDialog.instance().addDialog(event.params.getUtfString(DataField.message));
                this.events.onExtensionResponse.dispatch(event);
            }
        } else {
            this.events.onExtensionResponse.dispatch(event);
            if (event.cmd == DataCommand.QUEST_ACHIEVED_NOTIFICATION) {
                LogConsole.log('QUEST_ACHIEVED_NOTIFICATION');
                if (this.dataMySeft.is_playing_game !== true) {
                    setTimeout(() => {
                        ControllScreenDialog.instance().changeScreen(ConfigScreenName.QUEST_CLAIM_POPUP, QuestNotification.handle(event.params));
                    }, 1000);
                }
                // });
            }
            if (event.cmd == DataCommand.DAILY_QUEST_NOTIFICATION) {
                if (this.dataMySeft.is_playing_game !== true) {
                    // setTimeout(() => {
                    ControllScreenDialog.instance().addDailyRewardPopup(DailyQuestNotification.handle(event.params));
                    // }, 1000);
                }
                // });
            }
            if (event.cmd === DataCommand.ACHIEVEMENT_ACHIEVED_NOTIFICATION) {
                if (this.dataMySeft.is_playing_game !== true) {
                    // setTimeout(() => {
                    ControllScreenDialog.instance().changeScreen(ConfigScreenName.ACHIEVEMENT_CLAIM_POPUP, AchievedNotification.handle(event.params));
                    // }, 1000);
                }
            }

            if (event.cmd === DataCommand.ONLINE_ROOM_INVITATION) {

                if (
                    MainData.instance().state === ConfigScreenName.MAIN_MENU ||
                    MainData.instance().state === ConfigScreenName.ONLINE_MODE
                ) {
                    ControllScreen.instance().screen.checkShowInvite(event.params);
                }
            }

            if (event.cmd === DataCommand.LEVEL_UP_NOTIFICATION) {
                ControllScreenDialog.instance().addLevelUp(event.params.getInt(DataField.level_up_to));
            } else if (event.cmd === ShopCommand.SHOP_BUY_PLAYLIST_RESPONSE) {
                if (event.params.getInt("is_solo_mode") === 0) {
                    ControllScreenDialog.instance().addPopupBuyDone(event.params.getInt(ShopDataField.playlist_id));
                }
            } else if (event.cmd === OnlineModeCRDataCommand.ONLINE_MODE_ROOM_INVITE_RESPONSE) {

            } else if (event.cmd === OnlineModeCRDataCommand.ONLINE_MODE_ROOM_BE_KICKED) {
                ControllScreenDialog.instance().addDialog("Bạn đã bị kích khỏi phòng chơi.");
            } else if (event.cmd === EventModeCommand.EVENT_MODE_EVENT_START_BROADCAST) {
                ControllScreenDialog.instance().addTextScroll("Sự kiên " + event.params.getSFSObject(EventModeDatafield.event)
                    .getUtfString(EventModeDatafield.name) + " đã bắt đầu mời các bạn tham gia.");
            }

            if (event.cmd === DataCommand.BROADCASH_NOTIFICATION) {
                ControllTextScroller.instance().addNotify(event.params);
            }
            if (event.cmd === DataCommand.USER_NOTIFICATION) {
                ControllScreenDialog.instance().addDialog(event.params.getUtfString("message"));
            }
            if (event.cmd == DataCommand.TURNBASE_CHALLENGE_REQUEST_UPDATE) {
                let requestUpdate = ControllTurnbaseRequestUpdate.instance().getUpdate(event.params);
                if (MainData.instance().menuOpponentsResponse !== null) {
                    let foundIndex = MainData.instance().menuOpponentsResponse.findIndex(x => x.challenge_request_id == requestUpdate.challenge_request_id);
                    if (foundIndex == -1) {
                        MainData.instance().menuOpponentsResponse.push(requestUpdate);
                    } else {
                        MainData.instance().menuOpponentsResponse[foundIndex] = requestUpdate;
                    }
                    Common.filterResponseGames();
                }
            }
            if (event.cmd == DataCommand.USER_MESSAGE_LOAD_RESPONSE) {
                let dataMessages = ControllDataMessages.begin(event.params);
                let users = ControllDataMessages.getUsers(event.params);
                // console.log('dataMessages')
                // console.log(dataMessages)
                for (let i = 0; i < users.length; i++) {
                    // MainData.instance().dataMessagesLocal
                    let userIndex = MainData.instance().dataMessagesLocal.users.findIndex(ele => ele.id == users[i].id);
                    if (userIndex !== -1) {
                        MainData.instance().dataMessagesLocal.users[userIndex] = users[i];
                        users[i].zone = MainData.instance().zoneSFS;
                        users[i].user_id = SocketController.instance().dataMySeft.user_id;
                        SqlLiteController.instance().updateUserMessages(users[i]);
                    } else {
                        MainData.instance().dataMessagesLocal.users.push(users[i]);
                        users[i].zone = MainData.instance().zoneSFS;
                        users[i].user_id = SocketController.instance().dataMySeft.user_id;
                        SqlLiteController.instance().updateUserMessages(users[i]);
                        //
                    }
                }
                for (let i = 0; i < dataMessages.length; i++) {
                    MainData.instance().dataMessagesLocal.dataMessages.push(dataMessages[i])
                    dataMessages[i].zone = MainData.instance().zoneSFS;
                    dataMessages[i].user_id = SocketController.instance().dataMySeft.user_id;
                    SqlLiteController.instance().updateNewMessage(dataMessages[i]);
                }
                //
                ControllDataMessages.instance().checkLoadMessages = false;
                //
                if (EventGame.instance().callMessageFromChatScreen == true) {
                    EventGame.instance().event.newMessage.dispatch();
                    EventGame.instance().callMessageFromChatScreen = true;
                }
                EventGame.instance().event.loadMessagesDone.dispatch();
            }
            if (event.cmd == DataCommand.USER_MESSAGE_RECEIVE) {
                this.sendRequestDataMessages();
            }
            if (event.cmd == DataCommand.SYSTEM_MESSAGE_LOAD_RESPONSE) {
                let systemMessages = ControllDataMessages.getSystemMessages(event.params);
                for (let i = 0; i < systemMessages.length; i++) {
                    MainData.instance().systemMessagesLocal.dataMessages.push(systemMessages[i])
                    systemMessages[i].zone = MainData.instance().zoneSFS;
                    systemMessages[i].user_id = SocketController.instance().dataMySeft.user_id;
                    SqlLiteController.instance().updateNewSystemMessage(systemMessages[i]);
                }
            }
            if (event.cmd == DataCommand.QUEST_LOG_UPDATE) {
                let questLogUpdate = ControllQuestLogUpdate.instance().getUpdate(event.params);
                Common.setQuestLogs(questLogUpdate, DataUser.instance().quest_logs);
            }
            EventGame.instance().event.loadSystemMessagesDone.dispatch();
        }
    }

    addEventExtension(callback, scope) {
        this.events.onExtensionResponse.add(callback, scope);
    }
    removeEventExtension(callback, scope) {
        this.events.onExtensionResponse.remove(callback, scope);
    }

    sendPingServer() {
        this.removeReplayPing();
        this.idxPing = game.time.events.add(Phaser.Timer.SECOND * 10, this.sendPingServer, this);

        this.sendData("USER_PING", null);
    }


    removeReplayPing() {
        if (this.idxPing !== null) {
            game.time.events.remove(this.idxPing);
        }
    }

    sendDataOneSignal(cmd, data) {
        this.socket.send(new SFS2X.ExtensionRequest(cmd, data, this.roomLobby));
    }

    sendData(cmd, data) {
        LogConsole.log("sendData");
        LogConsole.log("cmd : ---- " + cmd);
        LogConsole.log("this.ktPlay : ---- " + this.ktPlay);

        if (data != null) {
            LogConsole.log("data : " + data.getDump());
        }
        if (this.ktPlay) {
            this.socket.send(new SFS2X.ExtensionRequest(cmd, data, this.socket.lastJoinedRoom));
        } else {
            this.socket.send(new SFS2X.ExtensionRequest(cmd, data, this.roomLobby));
        }
    }

    sendDataGetMenu(cmd, data) {
        ControllLoading.instance().showLoading();
        if (data !== null) {
            LogConsole.log("data : " + data);
        }
        if (this.ktPlay) {
            this.socket.send(new SFS2X.ExtensionRequest(cmd, null, this.socket.lastJoinedRoom));
        } else {
            this.socket.send(new SFS2X.ExtensionRequest(cmd, null, this.roomLobby));
        }

    }

    sendLoading(percent) {
        LogConsole.log("sendLoading " + percent);
        let userVars = [];
        userVars.push(new SFS2X.SFSUserVariable(OnlineModeDataField.online_mode_loaded, percent));
        this.socket.send(new SFS2X.SetUserVariablesRequest(userVars));
    }



    sendInvitationReply(invitation, invitationReply) {
        this.socket.send(new SFS2X.InvitationReplyRequest(invitation, invitationReply));
    }

    sendPublicChat(command, dataChat) {
        console.log('GGGGGGGGG :' + SocketController.instance().dataMySeft.vip)
        dataChat.putBool('vip', SocketController.instance().dataMySeft.vip);
        this.socket.send(new SFS2X.PublicMessageRequest(command, dataChat, this.socket.lastJoinedRoom));
    }

    sendExitRoom() {
        LogConsole.log("sendExitRoom");
        this.socket.send(new SFS2X.LeaveRoomRequest());
    }

    sendLogout() {
        LogConsole.log('logout sfs');
        this.socket.send(new SFS2X.LogoutRequest());
    }

    loginSFSByDevice(callback) {
        if (this.ktLogin == false) {
            // this.ktLogin = true;
            let postData = {
                deviceId: "",
                device: ConfigPlatform.getNamePlatform(),
                referrer: MainData.instance().referrer,
                userOneSingal: MainData.instance().userOneSingal,
                tokenOneSignal: MainData.instance().tokenOneSignal
            };

            if (window.isTest === false) {
                let uuid = prompt('Get UUID:');
                postData.deviceId = uuid;
            } else {
                if (window.cordova && typeof device !== 'undefined') {
                    postData.deviceId = MainData.instance().udid;
                } else {
                    let uuid = prompt('Get UUID:');
                    postData.deviceId = uuid;
                }
            }
            LogConsole.log("postData");
            LogConsole.log(postData);

            ControllLoading.instance().showLoading();
            this.ajaxGetServerInfoByUUID(postData, (response) => {
                callback(response);
            });
        }
    }

    loginSFSByYanAccount(callback) {
        let postData = {
            token: "",
            device: ConfigPlatform.getNamePlatform()
        };
        postData.token = MainData.instance().tokenYanAccount;

        ControllLoading.instance().showLoading();
        this.ajaxGetServerInfoByYanAccount(postData, (response) => {
            callback(response);
        });
    }

    ajaxGetServerInfoByUUID(postData, callback) {
        $.ajax({
            type: "POST",
            url: window.RESOURCE.login_deviceId,
            data: postData,
            dataType: 'json',
            success: function (response) {
                callback(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.error("Error get server infomation");
                console.error(thrownError);
                console.error(xhr.status);
                console.error(xhr.responseJSON);
                callback({ "status": "ERROR_LOGIN" });
            }
        });
    }

    ajaxGetServerInfoByYanAccount(postData, callback) {
        $.ajax({
            type: "POST",
            url: window.RESOURCE.login_yan,
            data: postData,
            dataType: 'json',
            success: function (response) {
                //LogConsole.log(response);
                callback(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.error("Error get server infomation");
                console.error(thrownError);
                console.error(xhr.status);
                console.error(xhr.responseJSON);
                callback({ "status": "ERROR_LOGIN" });
            }
        });
    }

    loginSFS(userId, token) {
        if (this.ktLogin == false) {
            this.ktLogin = true;
            this.roomLobby = null;
            var params = new SFS2X.SFSObject();
            if (window.isTest == true) {
                params.putUtfString("token", token);
            } else {
                params.putUtfString("token", 'xipat!@#2019');
            }
            if (userId !== undefined) {
                this.socket.send(new SFS2X.LoginRequest(userId.toString(), "", params, this.configZoneServer));
            } else {
                var id = prompt('Get user id:');
                if (id == null) {
                    id = 2;
                }
                this.socket.send(new SFS2X.LoginRequest(id.toString(), "", params, this.configZoneServer));
            }
        }
    }

    sendRequestDataMessages() {
        // SqlLiteController.instance().resetTableShopPlaylist();
        if (MainData.instance().dataMessagesLocal === null) {
            SqlLiteController.instance().event.get_messages_complete.add(this.get_messages_complete, this);
            SqlLiteController.instance().getMesseges(MainData.instance().zoneSFS, SocketController.instance().dataMySeft.user_id);
        } else {
            let params = new SFS2X.SFSObject();
            if (MainData.instance().dataMessagesLocal.dataMessages.length > 0) {
                params.putLong('last_user_message_id', MainData.instance().dataMessagesLocal.dataMessages[MainData.instance().dataMessagesLocal.dataMessages.length - 1].id);
            } else {
                params.putLong('last_user_message_id', 0);
            }
            SocketController.instance().sendData(DataCommand.USER_MESSAGE_LOAD_REQUEST, params);
            ControllDataMessages.instance().checkLoadMessages = true;
        }
    }

    get_messages_complete(userMessages) {
        SqlLiteController.instance().event.get_messages_complete.remove(this.get_messages_complete, this);
        if (userMessages === null || userMessages.length === 0) {
            let params = new SFS2X.SFSObject();
            MainData.instance().dataMessagesLocal = {
                user_id: SocketController.instance().dataMySeft.user_id,
                dataMessages: [],
                users: []
            };
            params.putLong('last_user_message_id', 0);
            SocketController.instance().sendData(DataCommand.USER_MESSAGE_LOAD_REQUEST, params);
            ControllDataMessages.instance().checkLoadMessages = true;
        } else {
            // console.log('GOGOGOG???')
            this.dataMessages = userMessages;
            SqlLiteController.instance().event.get_user_messages_complete.add(this.get_user_messages_complete, this);
            SqlLiteController.instance().getUserMessages(MainData.instance().zoneSFS, SocketController.instance().dataMySeft.user_id);
        }
    }

    get_user_messages_complete(users) {
        SqlLiteController.instance().event.get_user_messages_complete.remove(this.get_user_messages_complete, this);
        if (users === null || users.length === 0) {
            let params = new SFS2X.SFSObject();
            MainData.instance().dataMessagesLocal = {
                user_id: SocketController.instance().dataMySeft.user_id,
                dataMessages: [],
                users: []
            };
            params.putLong('last_user_message_id', 0);
            SocketController.instance().sendData(DataCommand.USER_MESSAGE_LOAD_REQUEST, params);
            ControllDataMessages.instance().checkLoadMessages = true;
        } else {
            this.dataUserMessages = users;
            MainData.instance().dataMessagesLocal = {
                user_id: SocketController.instance().dataMySeft.user_id,
                dataMessages: this.dataMessages,
                users: this.dataUserMessages
            }
            //
            let params = new SFS2X.SFSObject();
            if (MainData.instance().dataMessagesLocal.dataMessages.length > 0) {
                params.putLong('last_user_message_id', MainData.instance().dataMessagesLocal.dataMessages[MainData.instance().dataMessagesLocal.dataMessages.length - 1].id);
            } else {
                params.putLong('last_user_message_id', 0);
            }
            SocketController.instance().sendData(DataCommand.USER_MESSAGE_LOAD_REQUEST, params);
            ControllDataMessages.instance().checkLoadMessages = true;
        }
    }

    sendRequestSystemMessages() {
        SqlLiteController.instance().event.get_system_messages_complete.add(this.get_system_messages_complete, this);
        SqlLiteController.instance().getSystemMessages(MainData.instance().zoneSFS, SocketController.instance().dataMySeft.user_id);
    }
    get_system_messages_complete(sys_messages) {
        SqlLiteController.instance().event.get_system_messages_complete.remove(this.get_system_messages_complete, this);
        let params = new SFS2X.SFSObject();
        if (sys_messages == null || sys_messages.length == 0) {
            //
            // console.log('sys_messages')
            // console.log(sys_messages);
            MainData.instance().systemMessagesLocal = {
                user_id: SocketController.instance().dataMySeft.user_id,
                dataMessages: []
            }
            params.putLong('last_message_content_id', 0);
            SocketController.instance().sendData(DataCommand.SYSTEM_MESSAGE_LOAD_REQUEST, params);
        } else {
            // console.log('sys_messages')
            // console.log(sys_messages);
            MainData.instance().systemMessagesLocal = {
                user_id: SocketController.instance().dataMySeft.user_id,
                dataMessages: sys_messages
            }
            //
            if (MainData.instance().systemMessagesLocal.dataMessages.length > 0) {
                params.putLong('last_message_content_id', MainData.instance().systemMessagesLocal.dataMessages[MainData.instance().systemMessagesLocal.dataMessages.length - 1].message_content_id);
                // params.putLong('last_message_content_id', 0);
            } else {
                params.putLong('last_message_content_id', 0);
            }
            SocketController.instance().sendData(DataCommand.SYSTEM_MESSAGE_LOAD_REQUEST, params);
        }
    }
}