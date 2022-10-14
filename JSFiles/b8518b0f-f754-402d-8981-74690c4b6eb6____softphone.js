/**
 * 전화기능 -- ING
 */

var stompClient = null;
// 현재 콜정보 보관용 ???
var currentCallInfo = {
		//coretree
		cmd: 0,
		call_idx: 0,
		direct: 10,
		extension: '',
		cust_idx: 0,
		caller: '',
		callername: '',
		callee: '',
		calleename: '',
		unconditional: '',
		status: UC_CALL_STATE_IDLE
		//eit
		//id: 0,
		//message: ''
}


/* 아래 2개는 AP 에서 정의해서 사용하세요. 

function receiveCoreTreeEvent(event)
function receiveCoreTreeEventError(event)

extension : 로그인한 usserID 에 등록된 extension ???
caller    : 거는 사람 ; 이때는 extension 과 동일 
callee    : 받는 사람 ; 이때는 extension 과 동일 

*/

function stompConnect() {
    var socket = new SockJS('/webCTI');
	stompClient = Stomp.over(socket);

	//----- 디버그 없음 
	//stompClient.debug = null;

	//----- 디버그 콜백함수 이용시 예제입니다.
	//stompClient.debug = function(str) {
	//	console.log(str);
	//};

	stompClient.connect({}, function(frame) {

		try {
			//var whoami = frame.headers['user-name'];

			console.log("connecting.....");

			stompClient.subscribe('/topic/ext.state.*', function(receviedMessage){
				//coreTreeTopicHandler(receviedMessage);
				coreTreeTopicHandler(JSON.parse(receviedMessage.body));
			});
			
			stompClient.subscribe('/user/queue/groupware', function(receviedMessage){
				coreTreeQueueHandler(JSON.parse(receviedMessage.body));
			});

			stompClient.subscribe('/user/queue/errors', function(receviedError){
				webStompErrorHandler(receviedError);
			});

			console.log("connected!");
			requestQueryExtensionState("");
			requestQueryBusyExtensions();
		}
		catch (err) {
			console.log("connnect error: " + err);
		}
	});
}

function stompDisconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    console.log("Disconnected");
    alert("Disconnected");
}


function stompSend(message) {
	//console.log("stompSend: "+ message);
	if (!stompClient) {
		//TODO 팝업창
		alert("please call method stompConnect() !!!");
	}
	else {
		stompClient.send("/app/call", {}, message);
		//alert(message);
	}
}

function JSONTrim(object) {
	for(var key in object)
		   if(!object[key]) delete object[key];
	return object;
}

function JSONtoString(object) {
	return JSON.stringify(JSONTrim(event));
}

function JSONtoString2(object) {
	var results = [];
	for (var key in object) {
		var value = object[key];
		if (value) results.push(key.toString() + ': ' + value);
	}
	return '{' + results.join(', ') + '}';
}


//------- 이벤트 정의

function EventCoreTree(event, message) {
  //coretree
	this.cmd = event.cmd;
  this.direct = event.direct;
  this.call_idx = event.call_idx;
  this.extension = event.extension;
  this.cust_idx = event.cust_idx;
  this.caller = event.caller;
  this.callername = event.callername;
  this.callee = event.callee;
  this.calleename = event.calleename;
  this.responseCode = event.responseCode;
  this.unconditional = event.unconditional;
  this.status = event.status;
  //eit
  this.id = event.cmd;
  this.message = message;
}
EventCoreTree.prototype.fireEvent = function(callback, event) {
	if (callback && typeof(callback) === "function") {
		callback(this, event);
	}
}
EventCoreTree.prototype.toJson = function() {
	return JSON.stringify(this);
}
EventCoreTree.prototype.getInfo = function() {
	if (!this.message) {
		return this.id;
	}
	else {
		return this.id + ":" + this.message;
	}
}


function EventCoreTreeError (event, message) {
  //coretree
	this.cmd = event.cmd;
  this.direct = event.direct;
  this.call_idx = event.call_idx;
  this.extension = event.extension;
  this.cust_idx = event.cust_idx;
  this.caller = event.caller;
  this.callername = event.callername;
  this.callee = event.callee;
  this.calleename = event.calleename;
  this.responseCode = event.responseCode;
  this.unconditional = event.unconditional;
  this.status = event.status;
  //eit
  this.id = event.cmd;
  this.message = message;
}
EventCoreTreeError.prototype.fireEvent = function(callback, event) {
	if (callback && typeof(callback) === "function") {
		callback(this, event);
	}
}
EventCoreTreeError.prototype.toJson = function() {
	return JSON.stringify(this);
}
EventCoreTreeError.prototype.getInfo = function() {
	if (!this.message) {
		return this.id;
	}
	else {
		return this.id + ":" + this.message;
	}
}

function returnEvent(event, messsage, eitEventDefinedId) {
	var evt = new EventCoreTree(event, messsage);
	if (eitEventDefinedId) evt.id = eitEventDefinedId;
	evt.fireEvent(receiveCoreTreeEvent, evt);
}

function returnEventError(event, messsage, eitEventDefinedId) {
	var evt = new EventCoreTreeError(event, messsage);
	if (eitEventDefinedId) evt.id = eitEventDefinedId;
	evt.fireEvent(receiveCoreTreeEventError, evt);
}

function getEventCmd(event) {
	var message = "";
	var ctiMsg = "";
	switch (event.cmd){
		case UC_REGISTER_REQ:
			message = event.cmd+ ":"+ "UC_REGISTER_REQ";
			break;
		case UC_REGISTER_RES:
			message = event.cmd+ ":"+ "UC_REGISTER_RES";
			break;
		case UC_UNREGISTER_REQ:
			message = event.cmd+ ":"+ "UC_UNREGISTER_REQ";
			break;
		case UC_UNREGISTER_RES:
			message = event.cmd+ ":"+ "UC_UNREGISTER_RES";
			break;
		case UC_BUSY_EXT_REQ:
			message = event.cmd+ ":"+ "UC_BUSY_EXT_REQ";
			break;
		case UC_BUSY_EXT_RES:
			message = event.cmd+ ":"+ "UC_BUSY_EXT_RES";
			break;
		case UC_INFO_SRV_REQ:
			message = event.cmd+ ":"+ "UC_INFO_SRV_REQ";
			break;
		case UC_INFO_SRV_RES:
			message = event.cmd+ ":"+ "UC_INFO_SRV_RES";
			break;
		case UC_SET_SRV_REQ:
			message = event.cmd+ ":"+ "UC_SET_SRV_REQ";
			break;
		case UC_SET_SRV_RES:
			message = event.cmd+ ":"+ "UC_SET_SRV_RES";
			break;
		case UC_CLEAR_SRV_REQ:
			message = event.cmd+ ":"+ "UC_CLEAR_SRV_REQ";
			break;
		case UC_CLEAR_SRV_RES:
			message = event.cmd+ ":"+ "UC_CLEAR_SRV_RES";
			break;
		case UC_CALL_STATE_REQ:
			message = event.cmd+ ":"+ "UC_CALL_STATE_REQ";
			break;
		case UC_CALL_STATE_RES:
			message = event.cmd+ ":"+ "UC_CALL_STATE_RES";
			break;
		case UC_MAKE_CALL_REQ:
			message = event.cmd+ ":"+ "UC_MAKE_CALL_REQ";
			break;
		case UC_MAKE_CALL_RES:
			message = event.cmd+ ":"+ "UC_MAKE_CALL_RES";
			ctiMsg = "연결중";
			break;
		case UC_DROP_CALL_REQ:
			message = event.cmd+ ":"+ "UC_DROP_CALL_REQ";
			break;
		case UC_DROP_CALL_RES:
			message = event.cmd+ ":"+ "UC_DROP_CALL_RES";
			ctiMsg = "통화종료";
			break;
		case UC_ANWSER_CALL_REQ:
			message = event.cmd+ ":"+ "UC_ANWSER_CALL_REQ";
			break;
		case UC_ANWSER_CALL_RES:
			message = event.cmd+ ":"+ "UC_ANWSER_CALL_RES";
			ctiMsg = "통화중";
			break;
		case UC_PICKUP_CALL_REQ:
			message = event.cmd+ ":"+ "UC_PICKUP_CALL_REQ";
			break;
		case UC_PICKUP_CALL_RES:
			message = event.cmd+ ":"+ "UC_PICKUP_CALL_RES";
			break;
		case UC_HOLD_CALL_REQ:
			message = event.cmd+ ":"+ "UC_HOLD_CALL_REQ";
			break;
		case UC_HOLD_CALL_RES:
			message = event.cmd+ ":"+ "UC_HOLD_CALL_RES";
			ctiMsg = "보류중";
			break;
		case UC_ACTIVE_CALL_REQ:
			message = event.cmd+ ":"+ "UC_ACTIVE_CALL_REQ";
			break;
		case UC_ACTIVE_CALL_RES:
			message = event.cmd+ ":"+ "UC_ACTIVE_CALL_RES";
			ctiMsg = "보류해제";
			break;
		case UC_TRANSFER_CALL_REQ:
			message = event.cmd+ ":"+ "UC_TRANSFER_CALL_REQ";
			break;
		case UC_TRANSFER_CALL_RES:
			message = event.cmd+ ":"+ "UC_TRANSFER_CALL_RES";
			break;
		case UC_PICKUP_TRANSFER_REQ:
			message = event.cmd+ ":"+ "UC_PICKUP_TRANSFER_REQ";
			break;
		case UC_PICKUP_TRANSFER_RES:
			message = event.cmd+ ":"+ "UC_PICKUP_TRANSFER_RES";
			break;
		case UC_CLEAR_EXT_STATE_REQ:
			message = event.cmd+ ":"+ "UC_CLEAR_EXT_STATE_REQ";
			break;
		case UC_CLEAR_EXT_STATE_RES:
			message = event.cmd+ ":"+ "UC_CLEAR_EXT_STATE_RES";
			break;
		case UC_REPORT_EXT_STATE:
			message = event.cmd+ ":"+ "UC_REPORT_EXT_STATE";
			break;
		case UC_REPORT_SRV_STATE:
			message = event.cmd+ ":"+ "UC_REPORT_SRV_STATE";
			break;
		case UC_REPORT_WAITING_COUNT:
			message = event.cmd+ ":"+ "UC_REPORT_WAITING_COUNT";
			break;
			
		//etc
		case WS_REQ_EXTENSION_STATE:
			message = event.cmd+ ":"+ "WS_REQ_EXTENSION_STATE";
			break;
		case WS_RES_EXTENSION_STATE:
			message = event.cmd+ ":"+ "WS_RES_EXTENSION_STATE";
			break;
		case WS_REQ_SET_EXTENSION_STATE:
			message = event.cmd+ ":"+ "WS_REQ_SET_EXTENSION_STATE";
			break;
		case WS_RES_SET_EXTENSION_STATE:
			message = event.cmd+ ":"+ "WS_RES_SET_EXTENSION_STATE";
			break;
		case WS_REQ_RELOAD_USER:
			message = event.cmd+ ":"+ "WS_REQ_RELOAD_USER";
			break;
		case WS_RES_RELOAD_USER:
			message = event.cmd+ ":"+ "WS_RES_RELOAD_USER";
			break;
			
		//etc state
		case WS_VALUE_EXTENSION_STATE_ONLINE:
			message = event.cmd+ ":"+ "WS_VALUE_EXTENSION_STATE_ONLINE";
			ctiMsg = "대기";
			break;
		case WS_VALUE_EXTENSION_STATE_LEFT:
			message = event.cmd+ ":"+ "WS_VALUE_EXTENSION_STATE_LEFT";
			ctiMsg = "이석";
			break;
		case WS_VALUE_EXTENSION_STATE_DND:
			message = event.cmd+ ":"+ "WS_VALUE_EXTENSION_STATE_DND";
			break;
		case WS_VALUE_EXTENSION_STATE_REDIRECTED:
			message = event.cmd+ ":"+ "WS_VALUE_EXTENSION_STATE_REDIRECTED";
			ctiMsg = "착신전환";
			break;
			
		default:
			message = event.cmd+ ":"+ "UC_UNDEFINED!!!"
			break;
	}
	$("input[name=sp_state]").val(ctiMsg);
	return message;
}

function getEventId(event) {
	var message = "";
	var ctiMsg = "";
	switch (event.id){
		case UC_EIT_CALL_RINGING:
			message = event.id+ ":"+ "UC_EIT_CALL_RINGING";
			$("input[name=sp_custNo]").val(event.caller);
			$("input[name=sp_telNo]").val(event.caller);
			$("input[name=sp_msg]").val("전화가 왔습니다!!!!!!");
			ctiMsg = "인바운드";
			customer_one(event.caller);
			break;
		case UC_EIT_CALL_DIALING:
			message = event.id+ ":"+ "UC_EIT_CALL_DIALING";
			break;
		case UC_EIT_CALL_IDLE:
			message = event.id+ ":"+ "UC_EIT_CALL_IDLE";
			break;
		case UC_EIT_CALL_BUSY:
			message = event.id+ ":"+ "UC_EIT_CALL_BUSY";
			break;
		case UC_EIT_CALL_STATE:
			message = event.id+ ":"+ "UC_EIT_CALL_STATE";
			break;
		case UC_EIT_WEB_ERROR:
			message = event.id+ ":"+ "UC_EIT_WEB_ERROR";
			break;
		//reserved...
		//case ..
			
		default:
			message = getEventCmd(event);
			break;
	}
	$("input[name=sp_state]").val(ctiMsg);
	return message;
}

//call, extension
function getEventStatus(event) {
	var message = "";
	switch (event.status){
		case UC_STATUS_FAIL:
			message = event.status+ ":"+ "UC_STATUS_FAIL";
			break;
		case UC_CALL_STATE_UNREG:
			message = event.status+ ":"+ "UC_CALL_STATE_UNREG";
			break;
		case UC_CALL_STATE_IDLE:
			message = event.status+ ":"+ "UC_CALL_STATE_IDLE";
			break;
		case UC_CALL_STATE_INVITING:
			message = event.status+ ":"+ "UC_CALL_STATE_INVITING";
			break;
		case UC_CALL_STATE_RINGING:
			message = event.status+ ":"+ "UC_CALL_STATE_RINGING";
			break;
		case UC_CALL_STATE_BUSY:
			message = event.status+ ":"+ "UC_CALL_STATE_BUSY";
			break;
		case UC_CALL_STATE_NOT_FOUND:
			message = event.status+ ":"+ "UC_CALL_STATE_NOT_FOUND";
			break;
		case UC_CALL_STATE_CALLER_BUSY:
			message = event.status+ ":"+ "UC_CALL_STATE_CALLER_BUSY";
			break;
		case UC_CALL_STATE_CALLER_NOANSWER:
			message = event.status+ ":"+ "UC_CALL_STATE_CALLER_NOANSWER";
			break;
		case UC_CALL_STATE_CALLER_MOVE:
			message = event.status+ ":"+ "UC_CALL_STATE_CALLER_MOVE";
			break;
			
		// 2016년 07월 11일 메일 답변 적용
		case UC_CALL_STATE_RINGBACK:
			message = event.status+ ":"+ "UC_CALL_STATE_RINGBACK";
			break;
			
		case UC_CALL_STATE_CALLEE_BUSY:
			message = event.status+ ":"+ "UC_CALL_STATE_CALLEE_BUSY";
			break;
		case UC_CALL_STATE_CALLEE_NOANSER:
			message = event.status+ ":"+ "UC_CALL_STATE_CALLEE_NOANSER";
			break;
		case UC_CALL_STATE_CALLEE_MOVE:
			message = event.status+ ":"+ "UC_CALL_STATE_CALLEE_MOVE";
			break;
		//reserved
			
		default:
			message = getEventExtensionStatus(event); 
			break;
	}
	return message;
}

//etc state
function getEventExtensionStatus(event) {
	var message = "";
	var ctiMsg = "";
	switch (event.status){
		case WS_VALUE_EXTENSION_STATE_ONLINE:
			message = event.status+ ":"+ "WS_VALUE_EXTENSION_STATE_ONLINE";
			ctiMsg = "대기";
			//buttonState("READY");
			break;
		case WS_VALUE_EXTENSION_STATE_LEFT:
			message = event.status+ ":"+ "WS_VALUE_EXTENSION_STATE_LEFT";
			ctiMsg = "이석";
			break;
		case WS_VALUE_EXTENSION_STATE_DND:
			message = event.status+ ":"+ "WS_VALUE_EXTENSION_STATE_DND";
			break;
		case WS_VALUE_EXTENSION_STATE_REDIRECTED:
			message = event.status+ ":"+ "WS_VALUE_EXTENSION_STATE_REDIRECTED";
			ctiMsg = "착신전환";
			break;
		default:
			message = event.status+ ":"+ "UC or WS _CALL_STATE_UNDEFINED!!!"; 
			break;
	}
	$("input[name=sp_state]").val(ctiMsg);
	return message;
}

function getEventDirect(event) {
	var message = "";
	var ctiMsg = "";
	switch (event.direct){
		case UC_DIRECT_NONE:
			message = event.direct+ ":"+ "UC_DIRECT_NONE";
			break;
		case UC_DIRECT_OUTGOING:
			message = event.direct+ ":"+ "UC_DIRECT_OUTGOING";
			ctiMsg = "연결중";
			break;
		case UC_DIRECT_INCOMING:
			message = event.direct+ ":"+ "UC_DIRECT_INCOMING";
			break;
		default:
			message = event.direct+ ":"+ "UC_UNDEFINED!!!"
			break;
	}
	$("input[name=sp_state]").val(ctiMsg);
	return message;
}

function buttonState(types){
	try{
		switch(types) {
			case "RESET":
				$("#ready").attr("disabled",false);
				$("#notReady").attr("disabled",false);
				$("#dial").attr("disabled",false);
				$("#answer").attr("disabled",false);
				$("#pickUp").attr("disabled",false);
				$("#drop").attr("disabled",false);
				$("#hold").attr("disabled",false);
				$("#unhold").attr("disabled",false);
				$("#transfer").attr("disabled",false);
			break;
			case "READY":
				$("#ready").attr("disabled",true);
				$("#notReady").attr("disabled",false);
				$("#dial").attr("disabled",true);
				$("#answer").attr("disabled",true);
				$("#pickUp").attr("disabled",true);
				$("#drop").attr("disabled",true);
				$("#hold").attr("disabled",true);
				$("#unhold").attr("disabled",true);
				$("#transfer").attr("disabled",true);
				break;
			case "NOTREADY":
				$("#ready").attr("disabled",false);
				$("#notReady").attr("disabled",true);
				$("#dial").attr("disabled",false);
				$("#answer").attr("disabled",true);
				$("#pickUp").attr("disabled",false);
				$("#drop").attr("disabled",true);
				$("#hold").attr("disabled",true);
				$("#unhold").attr("disabled",true);
				$("#transfer").attr("disabled",true);
				break;
			case "RINGING":
				$("#ready").attr("disabled",true);
				$("#notReady").attr("disabled",true);
				$("#dial").attr("disabled",true);
				$("#answer").attr("disabled",false);
				$("#pickUp").attr("disabled",true);
				$("#drop").attr("disabled",true);
				$("#hold").attr("disabled",true);
				$("#unhold").attr("disabled",true);
				$("#transfer").attr("disabled",true);
				break;
			case "ESTABLISH":
				$("#ready").attr("disabled",true);
				$("#notReady").attr("disabled",true);
				$("#dial").attr("disabled",true);
				$("#answer").attr("disabled",true);
				$("#pickUp").attr("disabled",true);
				$("#drop").attr("disabled",false);
				$("#hold").attr("disabled",false);
				$("#unhold").attr("disabled",true);
				$("#transfer").attr("disabled",false);
				break;
			case "HOLD":
				$("#ready").attr("disabled",true);
				$("#notReady").attr("disabled",true);
				$("#dial").attr("disabled",true);
				$("#answer").attr("disabled",true);
				$("#pickUp").attr("disabled",true);
				$("#drop").attr("disabled",false);
				$("#hold").attr("disabled",true);
				$("#unhold").attr("disabled",false);
				$("#transfer").attr("disabled",false);
				break;
			case "UNHOLD":
				$("#ready").attr("disabled",true);
				$("#notReady").attr("disabled",true);
				$("#dial").attr("disabled",true);
				$("#answer").attr("disabled",true);
				$("#pickUp").attr("disabled",true);
				$("#drop").attr("disabled",false);
				$("#hold").attr("disabled",false);
				$("#unhold").attr("disabled",true);
				$("#transfer").attr("disabled",false);
				break;
		}
	}catch(err){
		console.log("buttonState error====>"+err);
}
}

function coreTreeQueueHandler(event) {
	console.log("<<-----coreTreeQueueHandler: cmd=" + getEventCmd(event) + " , direct=" + getEventDirect(event) + " , status=" + getEventStatus(event));

	switch (event.cmd) {
		//testing... 안오면 주석으로 막아요.
		// 71
		case UC_CLEAR_SRV_RES:
		(event.status != UC_STATUS_FAIL)?
				returnEvent(event, "UC_CLEAR_SRV_RES_SUCCESS", UC_EIT_CALL_STATE):
				returnEventError(event, "UC_CLEAR_SRV_RES_FAIL", UC_EIT_CALL_STATE);
		break;
	
		// 75
		case UC_MAKE_CALL_RES:
			console.log("전화걸기 응답.....");
			(event.status != UC_STATUS_FAIL)? 
				returnEvent(event, "MAKE_CALL_SUCCESS"):
				returnEventError(event, "MAKE_CALL_FAIL");
			break;
		
		// 77	
		case UC_DROP_CALL_RES:
			console.log("전화끊기 응답.....");
			(event.status != UC_STATUS_FAIL)?
				returnEvent(event, "DROP_CALL_SUCCESS"):
				returnEventError(event, "DROP_CALL_FAIL");
			break;
		
		//added
		// 79
		case UC_ANWSER_CALL_RES:
			console.log("전화받기 응답.....");
			(event.status != UC_STATUS_FAIL)?
				returnEvent(event, "ANWSER_CALL_SUCCESS"):
				returnEventError(event, "ANWSER_CALL_FAIL");
			break;
		
		//modified	
		// 81	
		case UC_PICKUP_CALL_RES:
			console.log("당겨받기 응답.....");
			(event.status != UC_STATUS_FAIL)?
				returnEvent(event, "PICKUP_CALL_SUCCESS"):
				returnEventError(event, "PICKUPR_CALL_FAIL");
			break;
		
		// 83	
		case UC_HOLD_CALL_RES:
			console.log("홀드.....");
			(event.status != UC_STATUS_FAIL)?
				returnEvent(event, "HOLD_CALL_SUCCESS"):
				returnEventError(event, "HOLD_CALL_FAIL");
			break;
		
		// 85
		case UC_ACTIVE_CALL_RES:
			console.log("언홀드.....");
			(event.status != UC_STATUS_FAIL)?
				returnEvent(event, "ACTIVE_CALL_SUCCESS"):
				returnEventError(event, "ACTIVE_CALL_FAIL");
			break;
			
		//added
		// 87
		case UC_TRANSFER_CALL_RES:
			console.log("호전환.....");
			(event.status != UC_STATUS_FAIL)?
				returnEvent(event, "TRANSFER_CALL_SUCCESS"):
				returnEventError(event, "TRANSFER_CALL_FAIL");
			break;
			
		//added
		// 89
		case UC_PICKUP_TRANSFER_RES:
			console.log("호전환.....");
			(event.status != UC_STATUS_FAIL)?
				returnEvent(event, "PICKUP_TRANSFER_SUCCESS"):
				returnEventError(event, "PICKUP_TRANSFER_FAIL");
			break;			
		
		// 123	
		case UC_SMS_INFO_RES:
			//REST??
			console.log("UC_SMS_INFO_RES.....");
			//angular??
			break;
		
		// 10002 	
		case WS_RES_EXTENSION_STATE:
			console.log("WS_RES_EXTENSION_STATE.....콜상태정보 갱신");
			console.log(JSON.stringify(event));
//			(event.status != UC_STATUS_FAIL)?
//				returnEvent(event, "WS_RES_EXTENSION_STATE_SUCCESS"):
//				returnEventError(event, "WS_RES_EXTENSION_STATE_FAIL");
			(event.status != UC_STATUS_FAIL)?
					returnEvent(event, "WS_RES_EXTENSION_STATE_SUCCESS", UC_EIT_CALL_STATE):
					returnEventError(event, "WS_RES_EXTENSION_STATE_FAIL", UC_EIT_CALL_STATE);
			break;
			
		// 인바운드, 아웃바운드 관련 처리	
		// 102	
		case UC_REPORT_EXT_STATE:
			//호전환 보관용
			//currentCallInfo.caller = event.caller;
			$("input[name=sp_custNo]").val(event.caller);
			$("input[name=sp_telNo]").val(event.caller);
			//cache?
			if (currentCallInfo.cmd == 0) {
				currentCallInfo = event;
			}

			var msg = "";
			switch (event.direct) {
				// 인바운드
				// 12
				case UC_DIRECT_INCOMING:
					switch (event.status) {
						// 111
						case UC_CALL_STATE_IDLE:
							if (currentCallInfo.status == UC_CALL_STATE_RINGING || currentCallInfo.status == UC_CALL_STATE_BUSY) {
								console.log("<<<______________UC_CALL_STATE_IDLE");
								console.log("<<<______________온라인...");
								
								//cache
								currentCallInfo.status = UC_CALL_STATE_IDLE;
								currentCallInfo.cmd = 0;
								currentCallInfo.call_idx = 0;
								
								//이벤트 재정의
								returnEvent(event, "UC_CALL_STATE_IDLE_SUCCESS", UC_EIT_CALL_IDLE);
							}
							break;
						
						// 113	
						case UC_CALL_STATE_RINGING:
						// 2016년 07월 11일 이재철 차장님 메일 답변 적용
						// 119	
						case UC_CALL_STATE_RINGBACK:

							console.log("<<<______________UC_CALL_STATE_RINGING___:"+ event.status);
							if (!event.callername) {
								console.log("<<<______________전화가 왔습니다..." + event.caller);
							} else {
								console.log("<<<______________전화가 왔습니다..." + event.callername + ", " + event.caller);
							}
							
							currentCallInfo.status = UC_CALL_STATE_RINGING;

							//이벤트 재정의 
							returnEvent(event, "UC_CALL_STATE_RINGING_SUCCESS", UC_EIT_CALL_RINGING);
							break;
						
						// 114	
						case UC_CALL_STATE_BUSY:
							console.log("<<<______________UC_CALL_STATE_BUSY");
							console.log("<<<______________통화중... " + event.callername + " , " + event.caller );

							currentCallInfo.status = UC_CALL_STATE_BUSY;
							
							//이벤트 재정의
							returnEvent(event, "UC_CALL_STATE_BUSY_SUCCESS", UC_EIT_CALL_BUSY);
							break;
							
						default:
							console.log("<<< UC_DIRECT_INCOMING: unkown state---->"+ event.status);
							//테스트 하면서 체크 필요 ??
							returnEvent(event, "UC_DIRECT_INCOMING_ETC_SUCCESS");
							break;
					}
					break;
				
				// 아웃바운드	
				// 11	
				case UC_DIRECT_OUTGOING:
					switch (event.status) {
					// 111
					case UC_CALL_STATE_IDLE:
						if (currentCallInfo.status == UC_CALL_STATE_RINGING || currentCallInfo.status == UC_CALL_STATE_BUSY) {
							console.log(">>>______________UC_CALL_STATE_IDLE");
							console.log(">>>______________온라인...");
							
							//cache
							currentCallInfo.status = UC_CALL_STATE_IDLE;
							currentCallInfo.cmd = 0;
							currentCallInfo.call_idx = 0;
							
							//이벤트 재정의 
							returnEvent(event, "UC_CALL_STATE_IDLE_SUCCESS", UC_EIT_CALL_IDLE);
						}
						break;
					
					// 112	
					case UC_CALL_STATE_INVITING:
						if (!event.calleename) {
							console.log(">>>______________UC_CALL_STATE_INVITING");
							console.log(">>>______________전화를 거는 중... " + event.callee);
						} 
						else {
							console.log(">>>______________UC_CALL_STATE_INVITING");
							console.log(">>>______________전화를 거는 중... "  + event.calleename + " , " + event.callee);
						}
						//이벤트 재정의
						returnEvent(event, "UC_CALL_STATE_INVITING_SUCCESS", UC_EIT_CALL_DIALING);
						break;
					
					// 114	
					case UC_CALL_STATE_BUSY:
						console.log(">>>______________UC_CALL_STATE_BUSY");
						
						if (!event.calleename) {
							console.log(">>>______________통화중... " + event.callee );
						} else {
							console.log(">>>______________통화중... " + event.calleename + " , " + event.callee);
						}
						
						currentCallInfo.status = UC_CALL_STATE_BUSY;
						
						//이벤트 재정의 
						returnEvent(event, "UC_CALL_STATE_BUSY_SUCCESS", UC_EIT_CALL_BUSY);
						break;
						
					default:
						console.log(">>> UC_DIRECT_OUTGOING: unkown state---->"+ event.status);
						//테스트 하면서 체크 필요 ??
						returnEvent(event, "UC_DIRECT_OUTGOING_ETC_SUCCESS");
						break;
					}
					break;
				
				// 알수 없는 상태
				default:
					console.log("!!!! unkown direct---->"+ event.direct);
					break;
			}
			break;
			
		// 2016-07-05 이재철 차장님 메일 답변 적용	; 상담원 상태변경시
		// 103	
		case UC_REPORT_SRV_STATE:
//			(event.status != UC_STATUS_FAIL)?
//				returnEvent(event, "UC_REPORT_SRV_STATE_SUCCESS"):
//				returnEventError(event, "UC_REPORT_SRV_STATE_FAIL");
			(event.status != UC_STATUS_FAIL)?
					returnEvent(event, "UC_REPORT_SRV_STATE_SUCCESS", UC_EIT_CALL_STATE):
					returnEventError(event, "UC_REPORT_SRV_STATE_FAIL", UC_EIT_CALL_STATE)
			break;
			
		// 2016-07-05 이재철 차장님 메일 답변 적용	; 대기고객수
		// 104
		case UC_REPORT_WAITING_COUNT:
			(event.status != UC_STATUS_FAIL)?
					returnEvent(event, "UC_REPORT_WAITING_COUNT_SUCCESS"):
					returnEventError(event, "UC_REPORT_WAITING_COUNT_FAIL");
			break;
			
		default:
			console.log("!!!!! Etc cmd----->"+ event.cmd);
			break;
	}
}


function coreTreeTopicHandler(event) {
	
	console.log("<<=====coreTreeTopicHandler: cmd=" + getEventCmd(event) + " , direct=" + getEventDirect(event) + " , status=" + getEventStatus(event));

	//console.log("coreTreeTopicHandler: "+ JSON.stringify(event));

	//ING
	switch (event.cmd) {
	// 71
	case UC_CLEAR_SRV_RES:
		(event.status != UC_STATUS_FAIL)?
				returnEvent(event, "UC_CLEAR_SRV_RES_SUCCESS", UC_EIT_CALL_STATE):
				returnEventError(event, "UC_CLEAR_SRV_RES_FAIL", UC_EIT_CALL_STATE);
		break;

	// 102	
	case UC_REPORT_EXT_STATE:
		//호전환 보관용
		//currentCallInfo.caller = event.caller;
		
		(event.status != UC_STATUS_FAIL)?
				returnEvent(event, "UC_REPORT_EXT_STATE_SUCCESS", UC_EIT_CALL_STATE):
				returnEventError(event, "UC_REPORT_EXT_STATE_FAIL", UC_EIT_CALL_STATE);
		break;
		
	// 103	
	case UC_REPORT_SRV_STATE:
		(event.status != UC_STATUS_FAIL)?
				returnEvent(event, "UC_REPORT_SRV_STATE_SUCCESS", UC_EIT_CALL_STATE):
				returnEventError(event, "UC_REPORT_SRV_STATE_FAIL", UC_EIT_CALL_STATE);
		break;

	// 104
	case UC_REPORT_WAITING_COUNT:
		(event.status != UC_STATUS_FAIL)?
				returnEvent(event, "UC_REPORT_WAITING_COUNT_SUCCESS"):
				returnEventError(event, "UC_REPORT_WAITING_COUNT_FAIL");
		break;		
		
	// 1002	
	case WS_RES_EXTENSION_STATE:
		(event.status != UC_STATUS_FAIL)?
				returnEvent(event, "WS_RES_EXTENSION_STATE_SUCCESS", UC_EIT_CALL_STATE):
				returnEventError(event, "WS_RES_EXTENSION_STATE_FAIL", UC_EIT_CALL_STATE);
		break;
		
	default:
		console.log("!!!!! Etc cmd=====>"+ event.cmd);
		break;
	}
}

function webStompErrorHandler(errorMessage) {
	//TODO
	console.log("webStompErrorHandler:-------------->>>>> "
			+ errorMessage);
	
	call = {
			cmd: UC_EIT_WEB_ERROR,
			extension: '',
			caller: '',
			callee: '',
			unconditional: '',
			status: -1
	};
	
	var error = new EventCoreTreeError(call, errorMessage);
	error.fireEvent(receiveCoreTreeEventError, error);
}


//---- SPRING 
//
//UC_REGISTER_REQ	= 60		; UC 서버의 주소를 PBX에 등록하는 명령
//UC_REGISTER_RES 	= 61		; 
//UC_UNREGISTER_REQ= 62		; UC 서버의 주소를 clear함
//UC_UNREGISTER_RES= 63		;
//
//---- SPRING 


//sample
//{"cmd":64,"extension":"","caller":"","callee":"","unconditional":"","status":-1}
//
//UC_BUSY_EXT_REQ = 64			; 
//응용이 재실행되었을 때, PBX에게 현재 통화상태가 idle이 아닌 내선들의 정보를 달라고 요청하는 명령어
//PBX에서는 필요하면 아래의 명령으로 응답한다.
//UC_REPORT_EXT_STATE,
//UC_REPORT_SRV_STATE
//----???
//WS_RES_EXTENSION_STATE (현재는 이값으로 리턴?)
function requestQueryBusyExtensions() {
	callreq = {
			cmd: UC_BUSY_EXT_REQ,
			extension: '',
			caller: '',
			callee: '',
			unconditional: '',
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}
//UC_BUSY_EXT_RES = 65			;


//UC_INFO_SRV_REQ = 66			; 
//응용에서 특정 내선의 착신전환 값을 알려달라고 요청하는 명령어
function requestQueryExtensionForReDirect(extension) {
	callreq = {
			cmd: UC_INFO_SRV_REQ,
			extension: extension,
			caller: '',
			callee: '',
			unconditional: '',
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}
//UC_INFO_SRV_RES = 67			;


//UC_SET_SRV_REQ = 68			;
//응용에서 특정 내선의 착신전환을 설정해달라고 요청하는 명령어
//(무조건,통화중,부재중,DnD중 택일)
//
//ResponseCode
//UC_SRV_UNCONDITIONAL = 1;
//UC_SRV_NOANSWER = 2;
//UC_SRV_BUSY = 3;
//UC_SRV_DND = 4;
function requestSetExtensionForReDirect(extension, unconditional, responseCode) {
	callreq = {
          cmd: UC_SET_SRV_REQ,
          direct: 0,
          call_idx: 0,
          extension: extension,
          cust_idx: 0,
          caller: '',
          callername: '',
          callee: '',
          calleename: '',
          responseCode: responseCode,
          unconditional: unconditional,
          status: 0
		};

	stompSend(JSON.stringify(callreq));
}
//UC_SET_SRV_RES = 69			;

/*
trade = {
      cmd: UC_SET_SRV_REQ,
      direct: UC_DIRECT_INCOMING,
      call_idx: 0,
      extension: '3001',
      cust_idx: 0,
      caller: '01045455962',
      callername: '',
      callee: '',
      calleename: '',
      responseCode: '',
      unconditional: '',
      status: 0
	};
*/

function requestSetExtensionForReDirectToUNCONDITIONAL(extension, unconditional) {
	// Requset UNCONDITIONAL
	requestSetExtensionForReDirect(extension, unconditional, UC_SRV_UNCONDITIONAL);
}
function requestSetExtensionForReDirectToNOANSWER(extension, unconditional) {
	// Requset NOANSWER
	requestSetExtensionForReDirect(extension, unconditional, UC_SRV_NOANSWER);
}
function requestSetExtensionForReDirectToBUSY(extension, unconditional) {
	// Requset BUSY
	requestSetExtensionForReDirect(extension, unconditional, UC_SRV_BUSY);
}
function requestSetExtensionForReDirectToDND(extension, unconditional) {
	// Requset DND
	requestSetExtensionForReDirect(extension, unconditional, UC_SRV_DND);
}


//UC_CLEAR_SRV_REQ = 70		;
//응용에서 특정 내선의 착신전환을 해제해달라고 요청하는 명령어
//(무조건,통화중,부재중,DnD중 택일)
function requestClearExtensionForReDirect(extension, responseCode) {
	callreq = {
          cmd: UC_CLEAR_SRV_REQ,
          direct: 0,
          call_idx: 0,
			extension: extension,
          cust_idx: 0,
          caller: '',
          callername: '',
          callee: '',
          calleename: '',
          responseCode: responseCode,
          unconditional: '',
          status: 0
		};
  
	stompSend(JSON.stringify(callreq));
}
//sample
//{"cmd":71,"direct":0,"call_idx":0,"extension":"3010","cust_idx":0,"caller":"","callername":null,"callee":"","calleename":null,"responseCode":4,"unconditional":"","status":20001}
//
//UC_CLEAR_SRV_RES = 71		;

function requestClearExtensionForReDirectToUNCONDITIONAL(extension) {
	// UNCONDITIONAL
	requestClearExtensionForReDirect(extension, UC_SRV_UNCONDITIONAL);
}
function requestClearExtensionForReDirectToNOANSWER(extension) {
	// NOANSWER
	requestClearExtensionForReDirect(extension, UC_SRV_NOANSWER);
}
function requestClearExtensionForReDirectToBUSY(extension) {
	// BUSY
	requestClearExtensionForReDirect(extension, UC_SRV_BUSY);
}
function requestClearExtensionForReDirectToDND(extension) {
	// DND
	requestClearExtensionForReDirect(extension, UC_SRV_DND);
}



//UC_CALL_STATE_REQ = 72		;
//응용에서 특정 내선의 통화상태를 알려달라고 요청하는 명령어
function requestQueryCallState(extension) {
	callreq = {
			cmd: UC_CALL_STATE_REQ,
			extension: extension,
			caller: '',
			callee: '',
			unconditional: '',
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}
//UC_CALL_STATE_RES = 73		;


//sample
//{"cmd":74,"extension":"3010","caller":"3010","callee":"3011","unconditional":"","status":-1}
//
//UC_MAKE_CALL_REQ = 74		;
//응용에서 전화를 거는 명령어
function requestCallDial(extension, caller, callee) {
	callreq = {
			cmd: UC_MAKE_CALL_REQ,
			extension: extension,
			caller: caller,
			callee: callee,
			unconditional: '',
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}
//sample
//{"cmd":75,"direct":0,"call_idx":0,"extension":"3010","cust_idx":0,"caller":"3010","callername":null,"callee":"3011","calleename":null,"responseCode":0,"unconditional":null,"status":100}
//
//UC_MAKE_CALL_RES = 75		;


//sample
//{"cmd":76,"extension":"3010","caller":"3011","callee":"3010","unconditional":"","status":-1}
//
//UC_DROP_CALL_REQ = 76		;
//응용에서 전화를 종료하는 명령어
function requestCallDrop(extension, caller, callee) {
	if (!caller) caller = '';
	if (!callee) callee = '';
	callreq = {
			cmd : UC_DROP_CALL_REQ,
			extension : extension,
			caller : caller,
			callee : callee,
			unconditional : '',
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}
//sample
//{"cmd":77,"direct":0,"call_idx":0,"extension":"3010","cust_idx":0,"caller":"3011","callername":null,"callee":"3010","calleename":null,"responseCode":0,"unconditional":null,"status":100}
//
//UC_DROP_CALL_RES = 77		;


//sample
//{"cmd":78,"direct":0,"call_idx":0,"extension":"3011","cust_idx":0,"caller":"","callername":"","callee":"","calleename":"","responseCode":"","unconditional":"","status":0}
//
//UC_ANWSER_CALL_REQ 78		;
//응용에서 수신된 전화를 받는 명령어
function requestCallAnswer(extension, caller, callee) {
	if (!caller) caller = '';
	if (!callee) callee = '';

	callreq = {
          cmd: UC_ANWSER_CALL_REQ,
          direct: UC_DIRECT_INCOMING,
          call_idx: 0,
          extension: extension,
          cust_idx: 0,
          caller: caller,
          callername: '',
//           callee: '',
          callee: callee,
          calleename: '',
          responseCode: '',
          unconditional: '',
          status: 0
		};
	
	stompSend(JSON.stringify(callreq));
}
//sample
//{"cmd":79,"direct":0,"call_idx":0,"extension":"3011","cust_idx":0,"caller":"","callername":null,"callee":"","calleename":null,"responseCode":0,"unconditional":null,"status":100}
//
//UC_ANWSER_CALL_RES = 79		;


//sample
//{"cmd":80,"extension":"3010","caller":"","callee":"3012","unconditional":"","status":-1}
//
//UC_PICKUP_CALL_REQ = 80		;
//다른 내선에 벨이 울리고 있을 때 응용에서 당겨 받는 명령어   ; caller = '' ?
function requestCallPickUp(extension, callee) {
	callreq = {
			cmd : UC_PICKUP_CALL_REQ,
			extension : extension,
			caller : '',
			callee : callee,
			unconditional : '',
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}
//sample
//{"cmd":81,"direct":0,"call_idx":0,"extension":"3010","cust_idx":0,"caller":"","callername":null,"callee":"3012","calleename":null,"responseCode":0,"unconditional":null,"status":100}
//
//UC_PICKUP_CALL_RES = 81		;


//sample
//{"cmd":82,"extension":"3010","caller":"3011","callee":"3010","unconditional":"","status":-1}
//
//UC_HOLD_CALL_REQ = 82		;
//현재 통화중인 콜을 잠시 보류하는 명령어
function requestCallHold(extension, caller, callee) {
	if (!caller) caller = '';
	if (!callee) callee = '';
	callreq = {
			cmd : UC_HOLD_CALL_REQ,
			extension : extension,
			caller : caller,
			callee : callee,
			unconditional : '',
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}
//sample
//{"cmd":83,"direct":0,"call_idx":0,"extension":"3010","cust_idx":0,"caller":"3011","callername":null,"callee":"3010","calleename":null,"responseCode":0,"unconditional":null,"status":100}
//
//UC_HOLD_CALL_RES = 83		;


//sample
//{"cmd":84,"extension":"3010","caller":"3011","callee":"3010","unconditional":"","status":-1}
//
//UC_ACTIVE_CALL_REQ = 84		;
//현재 보류중인 통화를 재개하는 명령어
function requestCallUnhold(extension, caller, callee) {
	if (!caller) caller = '';
	if (!callee) callee = '';
	callreq = {
			cmd : UC_ACTIVE_CALL_REQ,
			extension : extension,
			caller : caller,
			callee : callee,
			unconditional : '',
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}
//sample
//{"cmd":85,"direct":0,"call_idx":0,"extension":"3010","cust_idx":0,"caller":"3011","callername":null,"callee":"3010","calleename":null,"responseCode":0,"unconditional":null,"status":100}
//
//UC_ACTIVE_CALL_RES = 85		;


//sample
//{"cmd":86,"extension":"3010","caller":"3012","callee":"3010","unconditional":"3011","status":-1}
//
//UC_TRANSFER_CALL_REQ = 86	;
//현재 통화중인 통화를 다른 내선(unconditional 인자값)으로 돌려주는 명령어
function requestCallTransfer(extension, caller, callee, unconditional) {
	callreq = {
			cmd : UC_TRANSFER_CALL_REQ,
			extension : extension,
			caller : caller,
			callee : callee,
			unconditional : unconditional,
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}
//sample
//{"cmd":87,"direct":0,"call_idx":0,"extension":"3010","cust_idx":0,"caller":"3012","callername":null,"callee":"3010","calleename":null,"responseCode":0,"unconditional":null,"status":100}
//
//UC_TRANSFER_CALL_RES = 87	;


//UC_PICKUP_TRANSFER_REQ = 88	;
//현재 구현하지 않은 명령어
function requestCallTransferPickUp(extension, caller, callee, unconditional) {
	callreq = {
			cmd : UC_TRANSFER_CALL_REQ,
			extension : extension,
			caller : caller,
			callee : callee,
			unconditional : unconditional,
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}


//------CURRENT NOT USED
//
//UC_SEND_INPUT_DATA_REQ = 90	; IVR에서 받은 데이터를 응용으로 전달하는명령어
//UC_SEND_INPUT_DATA_RES = 91	;

//UC_INPUT_DATA_RESULT_REQ=92	; 응용에서 전달받은 데이터의 결과값을 PBX에게로 보내는 명령어
//UC_INPUT_DATA_RESULT_RES=93	; 
	
//UC_MANAGER_EXT_REQ = 94		; 응용에서 실시간 청취를 할 수 있는 관리자의 내선번호를 PBX에게 등록하는 명령어
//UC_MANAGER_EXT_RES = 95		;

//UC_CALLCENTER_GROUP_REQ = 96	; 응용에서 감청 대상이 되는 그룹 등록하는 명령어
//UC_CALLCENTER_GROUP_RES = 97	;

//UC_LISTEN_TO_CALL_REQ = 98	; 응용에서 관리자가 실시간 청취를 요청하는 명령어(추후 구현 예정)
//UC_LISTEN_TO_CALL_RES = 99	;
//
//------CURRENT NOT USED


//UC_CLEAR_EXT_STATE_REQ = 100	;
//PBX가 재부팅된 경우 응용에게 모든 내선의 통화상태를 idle로 clear하라는 명령어
function requestClearExtensionState(extension) {
	callreq = {
			cmd: UC_CLEAR_EXT_STATE_REQ,
			extension: extension,
			caller: '',
			callee: '',
			unconditional: '',
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}
//UC_CLEAR_EXT_STATE_RES = 101	;


//sample
//{"cmd":102,"direct":11,"call_idx":0,"extension":"3012","cust_idx":0,"caller":"3012","callername":null,"callee":"3011","calleename":null,"responseCode":0,"unconditional":"","status":112}
//
//UC_REPORT_EXT_STATE = 102	;
//내선의 통화상태가 변화가 생기면 응용에게 알려주는 명령어(응답은 필요없음)


//sample
//{"cmd":103,"direct":10,"call_idx":0,"extension":"3010","cust_idx":0,"caller":"","callername":null,"callee":"","calleename":null,"responseCode":0,"unconditional":"3011","status":20001}
//
//UC_REPORT_SRV_STATE = 103	;
//내선의 착신전환에 변화가 생기면 응용에게 알려주는 명령어(응답은 필요없음)


//UC_REPORT_WAITING_COUNT = 104;
//콜센터 그룹이나 콜센터 내선이 통화중이어서 통화를 기다리고 있는 개수를 변화가
//있을 때마다 응용에게 알려주는 명령어 (응답은 필요없음)


//-----SMS는 현재 KT만 지원함
//UC_SMS_SEND_REQ = 120		; 응용에서 SMS를 전송해 달라고 요청하는명령어 (PBX에서 MESSAGE메시지를 SSW로 전송)
//UC_SMS_SEND_RES = 121		;

//UC_SMS_INFO_REQ = 122		; SSW로부터 MESSAGE에 대한 응답이 오면 결과를 응용으로 알려주는 명령어
//UC_SMS_INFO_RES = 123		;

//UC_SMS_RECV_REQ = 124		; SSW로부터 MESSAGE 메시지를 수신한 경우 응용에게 알려주는 명령어
//UC_SMS_RECV_RES = 125		;

//UC_SMS_RESERV_SEND_REQ = 126	; 문자 예약전송을 요청하는 명령어
//UC_SMS_RESERV_SEND_RES = 127	;

//UC_SMS_RESERV_CANCEL_REQ = -128; 예약전송을 취소하는 명령어
//UC_SMS_RESERV_CANCEL_RES = -127;

//XXXXXXXXXXXXXXXXXXX OLD
//UC_SMS_TRANSFER_REQ = 130	; 
//UC_SMS_TRANSFER_RES = 131	;

//UC_SMS_TRANSFER_CANCEL_REQ=132;
//UC_SMS_TRANSFER_CANCEL_RES=133;
//XXXXXXXXXXXXXXXXXXX OLD

//XXXXXXXXXXXXXXXXXXX NEW
//UC_SMS_TRANSFER_REQ = -126	; 문자 수신을 받은 번호를 설정하는 명령어
//UC_SMS_TRANSFER_RES = -125	;

//UC_SMS_TRANSFER_CANCEL_REQ = -124; 문자 수신 번호를 취소 하는 명령어
//UC_SMS_TRANSFER_CANCEL_RES = -123;
//XXXXXXXXXXXXXXXXXXX NEW
//
//-----SMS는 현재 KT만 지원함


//-----인증
//
//UC_APP_AUTH_REQ = -58	; 응용에서 인증을 요청하기 위해서 사용(인증값을 가진 응용만 접속을 허용하도록해야 하는데 현재는 사용하지 않음)
//UC_APP_AUTH_RES = -57	;
//
//-----인증


//sample
//{"cmd":10001,"extension":"","caller":"","callee":"","unconditional":"","status":-1}
//
//WS_REQ_EXTENSION_STATE = 10001	;
//
function requestQueryExtensionState(extension) {
	//if (!extension) extension=0;
	if (!extension) extension='';
	
	callreq = {
			cmd: WS_REQ_EXTENSION_STATE,
			extension: extension,
			caller : '',
			callee : '',
			unconditional: '',
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}
//sample
//{"cmd":10002,"direct":0,"call_idx":0,"extension":"3010","cust_idx":0,"caller":"","callername":null,"callee":"","calleename":null,"responseCode":0,"unconditional":"","status":20001}
//
//WS_RES_EXTENSION_STATE = 10002	;
	

//WS_REQ_SET_EXTENSION_STATE = 10003;
//
function requestSetExtensionState(extension) {
	callreq = {
			cmd: WS_REQ_SET_EXTENSION_STATE,
			extension: extension,
			caller : '',
			callee : '',
			unconditional: '',
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}
//WS_RES_SET_EXTENSION_STATE = 10004; 


//WS_REQ_RELOAD_USER = 10005		;
//
function requestReloadUser(extension) {
	callreq = {
			cmd: WS_REQ_RELOAD_USER,
			extension: extension,
			caller : '',
			callee : '',
			unconditional: '',
			status: -1
	};

	stompSend(JSON.stringify(callreq));
}
//WS_RES_RELOAD_USER = 10006		;


//sample
//{"cmd":20001,"extension":"3010","caller":"","callee":"","unconditional":"","status":-1,"responseCode":4}
//
//WS_VALUE_EXTENSION_STATE_ONLINE = 20001;
//
function requestCallReady(extension) {
	callreq = {
			cmd: WS_VALUE_EXTENSION_STATE_ONLINE,
			extension: extension,
			caller : '',
			callee : '',
			unconditional: '',
			status: -1,
			responseCode: 4
	};

	stompSend(JSON.stringify(callreq));
}


//WS_VALUE_EXTENSION_STATE_LEFT = 20002;
//
function requestCallNotReady(extension) {
	callreq = {
			cmd: WS_VALUE_EXTENSION_STATE_LEFT,
			extension: extension,
			caller : '',
			callee : '',
			unconditional: '',
			status: -1,
			responseCode: 4
	};

	stompSend(JSON.stringify(callreq));
}

//WS_VALUE_EXTENSION_STATE_DND = 20003;
//
function requestCallDND(extension) {
	callreq = {
			cmd: WS_VALUE_EXTENSION_STATE_DND,
			extension: extension,
			caller : '',
			callee : '',
			unconditional: '',
			status: -1,
			responseCode: 4
	};

	stompSend(JSON.stringify(callreq));
}

//sample
//{"cmd":20004,"extension":"3010","caller":"3010","callee":"3011","unconditional":"3011","status":-1,"responseCode":1}
//
//WS_VALUE_EXTENSION_STATE_REDIRECTED = 20004;
//
function requestCallRedirect(extension, unconditional, responseCode) {
	callreq = {
			cmd: WS_VALUE_EXTENSION_STATE_REDIRECTED,
			extension: extension,
//			caller : extension,
//			callee : callee,
			caller : '',
			callee : '',
			unconditional: unconditional,
			status: -1,
			responseCode: responseCode
	};

	stompSend(JSON.stringify(callreq));
}

function requestCallRedirectToUNCONDITIONAL(extension, unconditional) {
	// UNCONDITIONAL
	requestCallRedirect(extension, unconditional, UC_SRV_UNCONDITIONAL);
}
function requestCallRedirectToNOANSWER(extension, unconditional) {
	// NOANSWER
	requestCallRedirect(extension, unconditional, UC_SRV_NOANSWER);
}
function requestCallRedirectToBUSY(extension, unconditional) {
	// BUSY
	requestCallRedirect(extension, unconditional, UC_SRV_BUSY);
}
function requestCallRedirectToDND(extension, unconditional) {
	// DND
	requestCallRedirect(extension, unconditional, UC_SRV_DND);
}


//------- clear 
//
function requestClearCallRedirectToUNCONDITIONAL(extension) {
	// UNCONDITIONAL
	requestClearExtensionForReDirectToUNCONDITIONAL(extension, UC_SRV_UNCONDITIONAL);
}
function requestClearCallRedirectToNOANSWER(extension) {
	// NOANSWER
	requestClearExtensionForReDirectToNOANSWER(extension, UC_SRV_NOANSWER);
}
function requestClearCallRedirectToBUSY(extension) {
	// BUSY
	requestClearExtensionForReDirectToBUSY(extension, UC_SRV_BUSY);
}
function requestClearCallRedirectToDND(extension) {
	// DND
	requestClearExtensionForReDirectToDND(extension, UC_SRV_DND);
}

