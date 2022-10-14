
////////////////////软电话界面对象初始化////////////////////////////////////////////////////////////
var isDemo = false;//是否用于demo,如果是用于demo,则不会读取初始化参数和与IC交互.【默认值是false】
var isDebug = false;//是否测试模式,如果测试模式,可以弹出测试数据,否则不弹测试数据.【默认值是false】
var hasParentPage = false;//!(window==parent);//检测是有上级页面,如果是被嵌入,则需要到上级页面读取初始化参数

//软电话按钮
var img1001 = $("img1001");//登录登出按钮
var img1002 = $("img1002");//就绪未就绪按钮
var img1003 = $("img1003");//挂机按钮
var img1004 = $("img1004");//应答外呼按钮
var img1005 = $("img1005");//保持取回按钮
var img1006 = $("img1006");//咨询按钮
var img1007 = $("img1007");//转接按钮
var img1008 = $("img1008");//会议按钮
var img1009 = $("img1009");//发送按钮按钮
var img1010 = $("img1010");//验证
var img1011 = $("img1011");//举手按钮
//输入控件
var text_aux_reasoncode  = $("text_aux_reasoncode");//未就绪子状态下拉框
var text_transfer_number = $("text_transfer_number");//转接号码输入框
var real_transfer_number = '';//真实外呼号码
var list_transfer_number = $("list_transfer_number");//转接号码下拉框

//显示控件
var span_ope_info     = $("span_ope_info");//操作状态显示栏
var span_agent_info   = $("span_agent_info");//坐席信息显示栏
var span_call_number  = $("span_call_number");//呼叫号码显示栏
var span_call_time    = $("span_call_time");//通话时长显示栏
var span_summary_info = $("span_summary_info");//在线时长显示栏

var span_ope_info0     = $("span_ope_info0");//操作状态显示栏
var span_agent_info0   = $("span_agent_info0");//坐席信息显示栏
var span_call_number0  = $("span_call_number0");//呼叫号码显示栏
var span_call_time0    = $("span_call_time0");//通话时长显示栏
var span_summary_info0 = $("span_summary_info0");//在线时长显示栏
var sp_setting = $("sp_setting");//设置

//隐含空间
var workitemlist =$("workitemlist");//工作列表

var phonenum = "";//呼叫号码
var callfrom = "";//呼叫来源
var ani = "";//主叫
var dnis = "";//被叫
var ucid = "";//UCID
var agentExtensionNumber = "";//登录坐席的坐席分机号

var lastSessionState  = "";
var lastChannelState  = "";
var lastWorkItemState = "";
var last_span_ope_info = "";
var last_ope_img = "";

var isUILocked = false;//界面是否被锁定
var isInitParameters = false;//是否已进行applet参数初始化
var currentCallDirection = "";//呼叫方向,Inbound、Outbound
var isLogined = false;//是否已登录


////////////////////常量定义////////////////////////////////////////////////////////////
//Session的状态
var _Session_State_AUXWORK        = "AUXWORK";//Indicates that the logged in agent is in auxwork. 
var _Session_State_AVAILABLE      = "AVAILABLE";//Indicates that the logged in agent is available to receive work. 
var _Session_State_INIT_AUXWORK   = "INIT_AUXWORK";//Indicates that the logged in agent is in the process of entering the auxwork state. 
var _Session_State_INIT_AVAILABLE = "INIT_AVAILABLE";//Indicates that the logged in agent is in the process of entering the available state. 
var _Session_State_INITIALIZED    = "INITIALIZED";//Indicates that the logged in agent is initialized. 
var _Session_State_LOGGED_IN      = "LOGGED_IN";//Indicates that the agent is logged in. 
var _Session_State_LOGGED_OUT     = "LOGGED_OUT";//Indicates that the agent is logged out. 
var _Session_State_UNINITIALIZED  = "UNINITIALIZED";//Indicates that the logged in agent has constructed but not yet initialized the Session. 
//Channel的状态
var _Channel_State_ACTIVE         = "ACTIVE";//Indicates the channel has one or more media interactions or documents, but the ceiling has not been reached. 
var _Channel_State_BUSY           = "BUSY";//Indicates that the channel is not available to receive any interactions or documents. 
var _Channel_State_IDLE           = "IDLE";//Indicates that the channel is available to receive interactions or documents, but has none assigned yet. 
var _Channel_State_INITIALIZED    = "INITIALIZED";//Indicates that the channel is initialized, and login can proceed. 
var _Channel_State_INITIALIZING   = "INITIALIZING";//Indicates that the channel has started initializing. 
var _Channel_State_LOGGED_IN      = "LOGGED_IN";//Indicates that the channel is logged into the IC system. 
var _Channel_State_LOGGED_OUT     = "LOGGED_OUT";//Indicates that the channel is logged out from the IC system. 
var _Channel_State_OCCUPIED       = "OCCUPIED";//Indicates that the maximum number of interactions or documents have been assigned to the channel, and the ceiling has been reached. 
var _Channel_State_UNINITIALIZED  = "UNINITIALIZED";//Initial state of a channel that has been created but not initialized. 
var _Channel_State_UNINITIALIZING = "UNINITIALIZING";//Indicates that the channel is in the process of uninitializing. 
//WorkItem状态
var _WorkItem_State_ALERTING     = "ALERTING";//Indicates that the workitem is waiting for user acceptance.
var _WorkItem_State_CONFERENCING = "CONFERENCING";//Indicates that a conference has been initiated on the workitem
var _WorkItem_State_CONSULTING   = "CONSULTING";//Indicates that a consult has been initiated on the workitem
var _WorkItem_State_DEFERRED     = "DEFERRED";//Indicates that the workitem will not be actively worked on by the user.
var _WorkItem_State_INITIATING   = "INITIATING";//Indicates that the workitem is being initiated by the user.
var _WorkItem_State_NONVIABLE    = "NONVIABLE";//Indicates that the WorkItem is in an unusable state.
var _WorkItem_State_PAUSED       = "PAUSED";//Indicates that workitem has been suspended.
var _WorkItem_State_TRANSFERRING = "TRANSFERRING";//Indicates that the transfer has been initiated on the workitem
var _WorkItem_State_WORKING      = "WORKING";//Indicates that the workitem is currently being worked on by the user
var _WorkItem_State_WRAPUP       = "WRAPUP";//Indicates that the workitem has been released.
//WorkItem操作
var _WorkItem_Operation_ACCEPT                 = "ACCEPT";
var _WorkItem_Operation_ASSOCIATECALL          = "ASSOCIATECALL";
var _WorkItem_Operation_COLLABORATIONBEGIN     = "COLLABORATIONBEGIN";
var _WorkItem_Operation_COLLABORATIONCANCEL    = "COLLABORATIONCANCEL";
var _WorkItem_Operation_COLLABORATIONCOMPLETE  = "COLLABORATIONCOMPLETE";
var _WorkItem_Operation_COMPLETE               = "COMPLETE";
var _WorkItem_Operation_DECLINE                = "DECLINE";
var _WorkItem_Operation_DEFER                  = "DEFER";
var _WorkItem_Operation_INVALID                = "INVALID"; //Value is null, not available or unknown 
var _WorkItem_Operation_MAKECURRENT            = "MAKECURRENT";
var _WorkItem_Operation_RELEASE                = "RELEASE";
var _WorkItem_Operation_REQUESTCUSTOMERHISTORY = "REQUESTCUSTOMERHISTORY";
var _WorkItem_Operation_REQUESTHISTORY         = "REQUESTHISTORY";
var _WorkItem_Operation_SETWRAPUPSELECTIONLIST = "SETWRAPUPSELECTIONLIST";
var _WorkItem_Operation_TRANSFER               = "TRANSFER";
var _WorkItem_Operation_TRANSFERCANCEL         = "TRANSFERCANCEL";

//applet初始化参数名称
var _APP_INIT_SDK_ADDRESS        = "sdkAddress";//IC主URL,必需
var _APP_INIT_SDK_ADDRESS2       = "sdkAddress2";//IC备用URL,非必需
var _APP_INIT_AGENT_LOGIN_ID     = "agentLoginID";//坐席工号,必需
var _APP_INIT_AGENT_PASSWORD     = "agentPassword";//坐席密码,必需
var _APP_INIT_EXTENSION_NUMBER   = "extensionNumber";//分机号,必需
var _APP_INIT_AGENT_NEW_PASSWORD = "agentNewPassword";//坐席新密码,非必需

/////////////////////////////////////处理初始化参数//////////////////////////////////////////////
//软电话初始化需要的参数,以下参数必填
var softphone_init_sdkAddress        ="";//AIC服务器地址
var softphone_init_sdkAddress2       ="";//备用AIC服务器地址,如果为空则后台自动取sdkAddress
var softphone_init_agentLoginID      ="";//座席工号
var softphone_init_agentPassword     ="";//座席登录密码,如果为空则后台自动取agentLoginID
var softphone_init_extensionNumber   ="";//座席话机的分机号
//软电话初始化需要的参数,以下参数非必填
var softphone_init_isAutoAnswer      ="";//是否自动应答,默认为否
var softphone_init_ivrNo             ="";//IVR号码,用于与IVR做转接或会议
var softphone_init_isPlayAgentId     ="";//是否报工号,默认为否
var softphone_init_playAgentNo       ="";//报工号时的播报号码
var softphone_init_isEndCallTransIvr ="";//是否通话结束后转IVR,默认为否
var softphone_init_tpinNos           ="";//IVR验证的编号,多个用逗号分隔
var softphone_init_tpinNames         ="";//IVR验证的名称,各个用逗号分隔
var softphone_init_monitorServerIP   ="";//监控服务器IP,用于有坐席监控服务器的情况

var softphone_init_transferCodes     ="";//转接号码列表的CODE
var softphone_init_transferNames     ="";//转接号码列表的NAME
var softphone_init_poppage_edudata   ="";//弹屏时需要传递的随路数据
var softphone_init_agentName         ="";//坐席名称

//初始化参数连接串
var softphoneInitParameters = "";//


////////////////////IC通知事件////////////////////////////////////////////////////////////
//IC事件通知界面
function EventMessage(Keyword, Message, Reason, ExtenReason){
	
	//alert("EventMessage:"+"Keyword="+Keyword+",Message="+Message+",Reason="+Reason);
	if(Keyword=="agentlogin"){
		if(Message=="FAILED"){//登录失败
			if("Redundant Login"==ExtenReason){//重复登录
				alert(Reason);
				//invokeAgentLogout();//如果重复登录,则试图登出
			}else if("ConnectionException"==ExtenReason){//连接IC服务器失败
				alert(Reason);
			}else {//其他原因
			    alert(Reason);
			}
		    UIforUnlock();
		}
		else if(Message=="OK"){//登录请求中
			if(isDebug)alert("**登录中...");
			Setspan_ope_info("登录中...");
			agentExtensionNumber = getInitData(_APP_INIT_EXTENSION_NUMBER);
		}else if(Message=="RetrieveSessionOK"){//成功取回Session,将界面进行恢复
			UIforLoginSuccessedEvent();
			if(isDebug)alert(Reason);
			if(ExtenReason=="AUXWORK"){//未就绪
				ReportAgentModeAUX(text_aux_reasoncode.value);
				UIforBusyEvent();if(isDebug)alert("**未就绪AUXWORK");
				//invokeVoiceLogout();//vouce示忙
			}
			else if(ExtenReason=="AVAILABLE"){//已就绪
				ReportAgentModeAvailable();
				UIforIdleEvent();if(isDebug)alert("**已就绪AVAILABLE");
				//invokeVoiceLogin();//vouce示闲
			}

			lastSessionState = ExtenReason;	
			invokeClearWorkItemList();//清除工作列表
			
		}
	}
	else if(Keyword=="session"){
		if(Message=="SessionConnectionStatusChanged"){
			if(isDebug)alert("**SessionConnectionStatusChanged->"+ExtenReason);
			if(ExtenReason=="OK"){//登录成功
				ReportLogin(getInitData("agentLoginID"), getInitData("agentPassword"), getInitData("extensionNumber"), '0', '10001');
				if(isDebug)alert("**登录成功");
				Setspan_ope_info("登录成功");
				//等待SessionStateChanged事件AUXWORK、AVAILABLE
				//UIforLoginSuccessedEvent();
				UIforLoginSuccessedEvent();
			}
		}
		else if(Message=="SessionStateChanged"){
			if(isDebug)alert("**SessionStateChanged->"+ExtenReason);
			if(ExtenReason=="AUXWORK"){//未就绪
				ReportAgentModeAUX(text_aux_reasoncode.value);
				UIforBusyEvent();if(isDebug)alert("**未就绪AUXWORK");
				//invokeVoiceLogout();//vouce示忙
			}
			else if(ExtenReason=="AVAILABLE"){//已就绪
				ReportAgentModeAvailable();
				UIforIdleEvent();if(isDebug)alert("**已就绪AVAILABLE");
				//invokeVoiceLogin();//vouce示闲
			}

			lastSessionState = ExtenReason;
			invokeClearWorkItemList();//清除工作列表
			
		}
		else if(Message=="SessionOperationSucceeded"){
			if(ExtenReason=="ENTERAUXWORK"){//未就绪操作成功
				ReportAgentModeAUX(text_aux_reasoncode.value);
				UIforBusyEvent();if(isDebug)alert("**未就绪操作成功!");
			}
			else if(ExtenReason=="ENTERAVAILABLE"){//就绪操作成功
				ReportAgentModeAvailable();
				UIforIdleEvent();if(isDebug)alert("**就绪操作成功!");
				UIforUnlock();
			}
			invokeClearWorkItemList();//清除工作列表
			
		}
		else if(Message=="SessionOperationFailed"){
			if(ExtenReason=="ENTERAUXWORK"){//未就绪操作失败
				alert("未就绪操作失败!");
				UIforUnlock();
			}
			else if(ExtenReason=="ENTERAVAILABLE"){//就绪操作失败
				alert("就绪操作失败!");
				UIforUnlock();
			}
		}else if(Message=="SessionShutDown"){//连接已断开
			ReportLogout();
			//add by liuqh20120923
			if(Reason=="DUPLICATE_LOGIN"){//当前工号被重复登录,已断开CTI连接.
				UIforLogout();
				alert("当前工号重复登录,已与CTI断开连接!请重新登录!");
			}
			//alert("连接已断开!");
			UIforUnlock();
		}
	}
	else if(Keyword=="channel"){
		if(Message=="ChannelStateChanged"){
			if(isDebug)alert("**ChannelStateChanged->"+ExtenReason);
			if(ExtenReason == _Channel_State_IDLE && Reason=="VOICE Channel state:IDLE"){//置闲
				//UIforIdleEvent();
				//if(isDebug)alert("**Voice通道闲,可通话");
			}
			else if(ExtenReason == _Channel_State_BUSY && Reason=="VOICE Channel state:BUSY"){//置忙
				//invokeClearWorkItemList();
				//UIforIdleEvent();
				//if(isDebug)alert("**Voice通道忙,可通话");			
			}
			else if(ExtenReason == _Channel_State_LOGGED_OUT && Reason=="VOICE Channel state:LOGGED_OUT"){//置忙
				//UIforBusyEvent();
				//if(isDebug)alert("**Voice通道登出,不可通话");			
			}

			lastChannelState = ExtenReason;
		}else if(Message=="ChannelOperationFailed"){
			if(ExtenReason=="MAKECALL"){//外呼失败
				alert("外呼失败,对方忙或无法接通!");
                ReportReleased();//add by liuqh20121108
				UIforBusyEvent();
				UIforUnlock();
			}
			else if(ExtenReason=="HOLD"){//保持失败
				alert("保持失败!");
				UIforUnlock();
			}
			else if(ExtenReason=="UNHOLD"){//取回保持失败
				alert("取回保持失败!");
				UIforUnlock();
			}
		}
	}	
	else if(Keyword=="workitem"){
		if((Message=="WorkItemAdded" || Message=="WorkItemStateChanged") && Reason=="ALERTING"){//振铃
			ReportIncoming(text_transfer_number.value);
//			var eduDatasAll = getEduValueAll();//随路数据
//			callfrom=getEduValue("comment");//呼叫来源
//            ani=getEduValue("ani");//主叫
//            dnis=getEduValue("dnis");//被叫
            UIforRingEvent();if(isDebug)alert("**振铃");
		}
		else if(Message=="WorkItemStateChanged"){
			if(isDebug)alert("**WorkItemStateChanged->"+ExtenReason);
			var eduDatasAll = getEduValueAll();//随路数据
//			callfrom=getEduValue("comment");//呼叫来源
            ani=getEduValue("ani");//主叫
            dnis=getEduValue("dnis");//被叫
          	
//            var Agencies = getEduValue("Agencies");//机构号码
//            var Card = getEduValue("Card");//会员卡号

            if(ExtenReason == _WorkItem_State_WORKING){//应答成功、呼叫成功、取回成功开始工作
            	if(img1004.disabled==false && img1004.name=="answer"){//上次是振铃则本地为应答成功
            		text_transfer_number.value = ani;
            		
            		ReportTalking();
	            		currentCallDirection = "inbound";//呼入
	            		if(isDebug)alert("**应答成功");
									if("call from ivr"==callfrom){//由IVR转入,报工号
										gonghao();
					                    callfrom="";
									}
									UIforTalkingEvent();
									//alert(''+agentExtensionNumber+','+dnis);
									//if(dnis==agentExtensionNumber){//被叫与坐席工号相同,振铃后应答弹屏
										calling_poppage_ext(ani,eduDatasAll);					
									//}
            	}else if(last_ope_img==img1004 && img1004.name=="dial"){//外呼接通
            		text_transfer_number.value = dnis;
            	
            		ReportTalking();
            		currentCallDirection = "outbound";//呼出
            		if(isDebug)alert("**外呼接通");
            		UIforTalkingEvent();
            	}else if(isUILocked && last_ope_img==img1005 && img1005.name=="hold"){//保持成功
            		ReportHolding();
            		if(isDebug)alert("**保持成功");
            		UIforHoldCallEvent();
            	}else if(isUILocked && last_ope_img==img1005 && img1005.name=="unhold"){//取回成功
            		ReportTalking();
            		if(isDebug)alert("**取回成功");
            		UIforUnholdCallEvent();
            	}
			}
			else if(ExtenReason == "WRAPUP"){//WRAPUP成功挂机
				ReportReleased();
				warpUp_ext();
				if(isDebug)alert("**挂机WRAPUP,currentCallDirection="+currentCallDirection);
				var sessionStatus = getSessionStatus();
				if("AVAILABLE"==sessionStatus){
					ReportAgentModeAvailable();
					UIforIdleEvent();
				}else {
					ReportAgentModeAUX(text_aux_reasoncode.value);
					UIforBusyEvent();
				}
//				if(currentCallDirection == "inbound"){//呼入结束
//					UIforIdleEvent();
//				}else if(currentCallDirection == "outbound"){//呼出结束
//					UIforBusyEvent();
//				}
				//UIforUnlock();
			}

        	lastWorkItemState = ExtenReason;
		}
//		else if(Message=="WorkItemContactAttributesChanged"){//随路数据变化?
//			var eduDatasAll = getEduValueAll();//随路数据
//			callfrom=getEduValue("comment");//呼叫来源
//            
//			if(ExtenReason=="ContactAttributes" && Reason.indexOf("CONFERENCE Collaboration for ")!=-1
//				){//第二次咨询/会议
//	            //UIforRingEvent();
//	            //if(isDebug)
//	            	//alert("**被咨询/会议振铃");
//			}
//		}
		else if(Message=="WorkItemOperationFailed"){//操作失败
			if(ExtenReason=="COLLABORATIONBEGIN" 
				&& isUILocked && last_ope_img==img1006 && img1006.name=="initConsult"){//咨询操作失败
					ReportTalking();
				alert("咨询操作失败!");
				UIforUnlock();
			}else if(ExtenReason=="COLLABORATIONBEGIN" 
				&& isUILocked && last_ope_img==img1008 && img1008.name=="initConference"){//会议操作失败
					ReportTalking();
				alert("会议操作失败!");
				UIforUnlock();
			}else if(ExtenReason=="TRANSFER"){//转接操作失败OK
				alert("转接操作失败,对方坐席无法到达!");
				UIforUnlock();
			}else if(ExtenReason=="COLLABORATIONCOMPLETE"){//咨询或会议结束操作失败
				ReportTalking();
				alert("操作失败,此时不允许该操作!");
				UIforUnlock();
			}else if(ExtenReason.indexOf("COLLABORATIONCOMPLETE")<1){//外呼失败,进行挂机add by liuqh20121009
				ReportReleased();
				if(isDebug)alert("**挂机WRAPUP,currentCallDirection="+currentCallDirection);
				var sessionStatus = getSessionStatus();
				if("AVAILABLE"==sessionStatus){
					ReportAgentModeAvailable();
					UIforIdleEvent();
				}else {
					ReportAgentModeAUX(text_aux_reasoncode.value);
					UIforBusyEvent();
				}
				UIforUnlock();
			}
		}else if(Message=="WorkItemOperationSucceeded"){//操作成功
			if(isDebug)alert("**WorkItemOperationSucceeded->"+ExtenReason);
			if(ExtenReason=="COLLABORATIONCANCEL" && last_ope_img==img1006){//咨询操作取消
					ReportTalking();
				 	if(img1006.name=="switchConsult"){//咨询操作坐席切换取回OK
						if(isDebug)alert("***咨询操作:坐席主动取回:"+Reason);
						UIforConsultCallSwapEvent();
				 	}else {//咨询操作对方坐席已挂机OK
						if(isDebug)alert("**咨询操作:对方坐席已挂机:"+Reason);
						UIforConsultCallSwapEvent();
				 	}
			}
			else if(ExtenReason=="COLLABORATIONCANCEL" && (last_ope_img==img1007 || last_ope_img==img1008) ){//会议操作取消
				ReportTalking();
				if(last_ope_img==img1007 && img1007.name=="switchConference"){
					if(isDebug)alert("**会议操作:坐席主动取回:"+Reason);
					UIforConferenceCallCancelEvent();
				}else {
					if(isDebug)alert("**会议操作:对方坐席已挂机:"+Reason);
					UIforConferenceCallCancelEvent();					
				}
			}
			else if(ExtenReason=="COLLABORATIONCOMPLETE" 
				&& isUILocked && last_ope_img==img1006 && img1006.name=="completeConsult"){//咨询操作成功
					ReportConsulting();
				if(isDebug)alert("**咨询操作成功(转接):"+Reason);
				//等待接收挂机事件.
			}
			else if(ExtenReason=="COLLABORATIONCOMPLETE" 
				&& last_ope_img==img1008 && img1008.name=="completeConference"){//会议建立成功
					ReportConsulting();
				if(isDebug)alert("**会议建立成功:"+Reason);
				UIforConferenceCallCompleteEvent();
			}
			else if(ExtenReason=="COLLABORATIONCOMPLETE"
				&& isUILocked && last_ope_img==img1007 && img1007.name=="initTransfer"){//转接操作成功OK
					ReportConsulting();
				if(isDebug)alert("**转接操作成功:"+Reason);
				//等待接收挂机事件.
			}
		}
		else if(Message=="WorkItemAdded" && Reason=="NONVIABLE"){
			var workitemID=Message;
			//if(isDebug)alert("**当前有未处理完成的任务"+workitemID);
			var varItem = new Option("待处理任务 "+workitemID, workitemID);
			
			var objSelect=$("workitemlist");
			objSelect.options.add(varItem);
		}
		else if(Message=="WorkItemRemoved"){
			var workitemID=Message;
			//if(isDebug)alert("**任务已完成"+workitemID);
			var objSelect=$("workitemlist");
			if(objSelect.options.length==0){
				//
			}
			else if(objSelect.options.length>0){
				//
			}
		}
	}
	else if(Keyword=="mediaInteraction"){
		//if(isDebug)alert("**mediaInteraction->Message="+Message+",Reason="+Reason);
		if(Message=="MediaInteractionPartyAdded"){
			if(Reason.indexOf("Type = AGENT")>-1){
				//if(isDebug) 
					//alert("**MediaInteractionPartyAdded->"+Reason);
				//UIforHangupEvent();
			}
		}
		else if(Message=="MediaInteractionPartyDropped"){
			if(Reason.indexOf("Type = AGENT")>-1){
				//if(isDebug) 
					//alert("**MediaInteractionPartyDropped->"+Reason);
				if(img1003.name=="hangup"){//对方坐席已挂机
					ReportTalking();
					UIforTalkingEvent();
				}
				//UIforHangupEvent();
			}
		}
//		else if(Message=="MediaInteractionStateChanged"){
//			if(Reason=="DISCONNECTED"){
//				//if(isDebug) 
//					alert("**MediaInteractionStateChanged->"+Reason);
//				//UIforHangupEvent();
//			}
//		}
//		else if(Message=="VoiceMediaInteractionAbandoned"){
//			//if(isDebug)
//				alert("**VoiceMediaInteractionAbandoned->"+Reason);
//		}
//		else if(Message=="VoiceMediaInteractionAudioSourceChanged"){
//			if(isDebug)
//				alert("**VoiceMediaInteractionAudioSourceChanged->"+Reason);
//		}
//		else if(Message=="VoiceMediaInteractionDestinationBusy"){
//			if(isDebug)
//				alert("**VoiceMediaInteractionDestinationBusy->"+Reason);
//		}
//		else if(Message=="VoiceMediaInteractionDestinationConnected"){
//			if(isDebug)
//				alert("**VoiceMediaInteractionDestinationConnected->"+Reason);
//		}
			
	}
	else if(Keyword=="worklistadd"){//有新的待处理任务
		//if(isDebug)alert("**worklistadd有新的待处理任务"+Keyword);
		var workitemID=Message;
		var varItem = new Option("待处理任务 "+workitemID, workitemID);
		
		var objSelect=$("workitemlist");
		objSelect.options.add(varItem);
	}
	else if(Keyword=="worklistremove"){//有任务已完成
		//if(isDebug)alert("**worklistremove有任务已完成"+Keyword);
		var workitemID=Message;
		var objSelect=$("workitemlist");
		for(var i=0;i<objSelect.options.length;i++){
			if(objSelect.options[i].value==workitemID){
				objSelect.options.remove(i);
			}
		}
	}
}


function querySt(parameter) {
    hu = window.location.search.substring(1);
    gy = hu.split("&");
    for(i=0;i<gy.length;i++) {
        ft = gy[i].split("=");
        if(ft[0]==parameter)
            return ft[1];
    }
    return "";
}  

//从调用页面获取初始化参数,用,,,和:::分隔
function getInitParametersFromParentUI(){
	//通过URL取初始化参数
    softphone_init_sdkAddress        =querySt("sdkAddress");
    softphone_init_sdkAddress2       =querySt("sdkAddress2");
    softphone_init_agentLoginID      =querySt("agentLoginID");
    softphone_init_agentPassword     =querySt("agentPassword");
    softphone_init_extensionNumber   =querySt("extensionNumber");	
    
    softphone_init_isAutoAnswer      =querySt("isAutoAnswer");
    softphone_init_ivrNo             =querySt("ivrNo");
    softphone_init_isPlayAgentId     =querySt("isPlayAgentId");
    softphone_init_playAgentNo       =querySt("playAgentNo");
    softphone_init_isEndCallTransIvr =querySt("isEndCallTransIvr");
    softphone_init_tpinNos           =querySt("tpinNos");
    softphone_init_tpinNames         =querySt("tpinNames");
    softphone_init_monitorServerIP   =querySt("monitorServerIP");

    softphone_init_transferCodes     =querySt("transferCodes");
    softphone_init_transferNames     =querySt("transferNames");
    softphone_init_poppage_edudata   =querySt("poppage_edudata");
    softphone_init_agentName         =querySt("agentName");    
    
  	if(!softphone_init_sdkAddress){
  		//软电话初始化需要的参数,以下参数必填
	    softphone_init_sdkAddress        =$pvalue("softphone_init_sdkAddress");
	    softphone_init_sdkAddress2       =$pvalue("softphone_init_sdkAddress2");
	    softphone_init_agentLoginID      =$pvalue("softphone_init_agentLoginID");
	    softphone_init_agentPassword     =$pvalue("softphone_init_agentPassword");
	    softphone_init_extensionNumber   =$pvalue("softphone_init_extensionNumber");
	
	    //软电话初始化需要的参数,以下参数非必填
	    softphone_init_isAutoAnswer      =$pvalue("softphone_init_isAutoAnswer");
	    softphone_init_ivrNo             =$pvalue("softphone_init_ivrNo");
	    softphone_init_isPlayAgentId     =$pvalue("softphone_init_isPlayAgentId");
	    softphone_init_playAgentNo       =$pvalue("softphone_init_playAgentNo");
	    softphone_init_isEndCallTransIvr =$pvalue("softphone_init_isEndCallTransIvr");
	    softphone_init_tpinNos           =$pvalue("softphone_init_tpinNos");
	    softphone_init_tpinNames         =$pvalue("softphone_init_tpinNames");
	    softphone_init_monitorServerIP   =$pvalue("softphone_init_monitorServerIP");
	
	    softphone_init_transferCodes     =$pvalue("softphone_init_transferCodes");
	    softphone_init_transferNames     =$pvalue("softphone_init_transferNames");
	    softphone_init_poppage_edudata   =$pvalue("softphone_init_poppage_edudata");
	    softphone_init_agentName         =$pvalue("softphone_init_agentName");
  	}
  	
    if(!softphone_init_sdkAddress2) softphone_init_sdkAddress2 = softphone_init_sdkAddress;
    if(!softphone_init_agentPassword) softphone_init_agentPassword = softphone_init_agentLoginID;
    
    softphoneInitParameters 
               = _APP_INIT_SDK_ADDRESS     +":::"+softphone_init_sdkAddress+",,,"
    		   + _APP_INIT_SDK_ADDRESS2    +":::"+softphone_init_sdkAddress2+",,,"
    		   + _APP_INIT_AGENT_LOGIN_ID  +":::"+softphone_init_agentLoginID+",,,"
    		   + _APP_INIT_AGENT_PASSWORD  +":::"+softphone_init_agentPassword+",,,"
    		   + _APP_INIT_EXTENSION_NUMBER+":::"+softphone_init_extensionNumber;
    return softphoneInitParameters;
}

//从本地变量获取初始化参数,用,,,和:::分隔
function getInitParametersFromLocal(){
    softphoneInitParameters 
               = _APP_INIT_SDK_ADDRESS     +":::"+softphone_init_sdkAddress+",,,"
    		   + _APP_INIT_SDK_ADDRESS2    +":::"+softphone_init_sdkAddress2+",,,"
    		   + _APP_INIT_AGENT_LOGIN_ID  +":::"+softphone_init_agentLoginID+",,,"
    		   + _APP_INIT_AGENT_PASSWORD  +":::"+softphone_init_agentPassword+",,,"
    		   + _APP_INIT_EXTENSION_NUMBER+":::"+softphone_init_extensionNumber;
    return softphoneInitParameters;
}


//设置初始化参数,参数见上
function setInitData(paraName, pareValue){
	$("ulinkSP").setInitData(paraName, pareValue);
	return true;
}
//批量设置初始化参数,用,,,和:::分隔
function setInitDataAll(spInitParameters){
	$("ulinkSP").setInitDataAll(spInitParameters);
	return true;
}
//获取初始化参数
function getInitData(paraName){
	var result=$("ulinkSP").getInitData(paraName);
	return result;
}

////////////////////注册图标点击后的响应事件////////////////////////////////////////////////////////////
//获取呼叫、咨询、会议、转接的目标号码
function getPhoneNum(errAltMsg){
	phonenum = text_transfer_number.value;
	if(!phonenum){
		alert(errAltMsg?errAltMsg:"请输入呼叫号码!");
		text_transfer_number.focus();
		return "";
	}
	return phonenum;
}

//登录/登出
img1001.onclick = function(){//alert('img1001.name='+img1001.name+',img1001.disabled='+img1001.disabled+',isUILocked='+isUILocked);
	if(img1001.disabled==true) return;last_ope_img=img1001;
	var action=img1001.name;//alert("action="+action);
	if(action=="logon"){//执行登录操作
		invokeAgentLogin();
		//UIforLocked();//等待登录结果事件
		//UIforLoginSuccessedEvent();
		
	}else if(action=="logout"){//执行登出操作
		ReportLogout();
		invokeAgentLogout();
		//UIforLocked();//等待登出结果事件
		UIforLogout();
	}
    if(isDemo) {isUILocked = false;}
}

//就绪/未就绪
img1002.onclick = function(){
	if(img1002.disabled==true || isUILocked) return;last_ope_img=img1002;
	var action=img1002.name;//alert("action="+action);
	if(action=="idle"){//执行就绪操作
		invokeMakeAvailable();
		//invokeVoiceLogin();
		//UIforIdleEvent();
		UIforLocked();//等待就绪事件通知
	}
	else if(action=="busy"){//执行未就绪操作
		invokeEnterAuxwork(text_aux_reasoncode.value);
		//invokeVoiceLogout();
		//UIforBusyEvent();
		UIforLocked();//等待未就绪事件通知
	}
    if(isDemo) {isUILocked = false;}
}

//挂机
img1003.onclick = function(){
	if(img1003.disabled==true || isUILocked) return;last_ope_img=img1003;
	var ret = invokeHangupCall();//执行挂机操作
	if(true){//add by liuqh20121009
				var sessionStatus = getSessionStatus();
				if("AVAILABLE"==sessionStatus){
					ReportAgentModeAvailable();
					UIforIdleEvent();
				}else {
					ReportAgentModeAUX(text_aux_reasoncode.value);
					UIforBusyEvent();
				}		
	}
	//UIforLocked();//等待挂机成功事件通知
	//UIforHangupEvent();
    if(isDemo) {isUILocked = false;}
}

//应答/外呼
img1004.onclick = function(){
	if(img1004.disabled==true || isUILocked) return;last_ope_img=img1004;
	var action=img1004.name;//alert("action="+action);
	if(action=="answer"){//执行应答操作
		invokeAnswerCall();
		UIforLocked();//等待应答成功事件通知
		//UIforTalkingEvent();
	}else if(action=="dail"){//执行外呼操作
		if(getPhoneNum("请输入呼叫号码!")){
			if(real_transfer_number)
				invokeMakeCall(real_transfer_number);
			else 
				invokeMakeCall(phonenum);
			
			UIforOutboundInit();
			if(isDemo) UIforTalkingEvent();
			//UIforLocked();//等待呼叫成功事件通知?
			//UIforTalkingEvent();
		}
		ReportOutgoing(text_transfer_number.value);
	}
    if(isDemo) {isUILocked = false;}
}

//保持/取回
img1005.onclick = function(){
	if(img1005.disabled==true || isUILocked) return;last_ope_img=img1005;
	var action=img1005.name;//alert("action="+action);
	if(action=="hold"){
		invokeHoldCall();
		UIforLocked();//等待保持成功事件通知
	}else if(action=="unhold"){
		invokeUnholdCall();
		UIforLocked();//等待取回成功事件通知
	}
    if(isDemo) {isUILocked = false;}
}

//咨询/切换
img1006.onclick = function(){
	if(img1006.disabled==true || isUILocked) return;last_ope_img=img1006;
	var action=img1006.name;//alert("action="+action);
	if(action=="initConsult"){//发起咨询
		if(getPhoneNum("请输入咨询号码!")){
			invokeConsultCall(phonenum);
			UIforConsultCallInit();
			//等待咨询操作结果事件通知,接不通不会有事件,对方接通也没有事件,对方挂机后有事件。
			//界面需要提供坐席切换回咨询或完成转接
		}
		ReportConsulting();
	}else if(action=="switchConsult"){//切换
		invokeConsultCallSwap();
		//UIforLocked();//等待切换成功事件通知;
	}
    if(isDemo) {isUILocked = false;}
}

//转接/咨询转接//会议切换
img1007.onclick = function(){//alert('img1007.name='+img1007.name+',img1007.disabled='+img1007.disabled+',isUILocked='+isUILocked);
	if(img1007.disabled==true || isUILocked) return;last_ope_img=img1007;
	var action=img1007.name;
	if(action=="initTransfer"){//发起转接
		if(getPhoneNum("请输入转接号码!")){
			invokeTransferCall(phonenum);
			UIforLocked();//等待转接操作结果事件通知
		}
	}else if(action=="completeConsult"){//咨询完成(发起转接)
		invokeConsultCallComplete();
		//UIforLocked();//等待切换成功事件通知;
	}else if(action=="switchConference"){//会议切换
		invokeConferenceCallSwap();
		//UIforLocked();//等待切换成功事件通知;
	}
    if(isDemo) {isUILocked = false;}
}

//会议
img1008.onclick = function(){
	if(img1008.disabled==true || isUILocked) return;last_ope_img=img1008;
	var action=img1008.name;//alert("action="+action);
	if(action=="initConference"){//发起会议
		if(getPhoneNum("请输入会议号码!")){
			invokeConferenceCall(phonenum);
			UIforConferenceCallInit();
			//UIforLocked();//等待会议操作结果事件通知
		}
	}else if(action=="completeConference"){//完成会议(取回客户)
		invokeConferenceCallComplete();
		//UIforLocked();//等待会议完成操作成功事件通知;UIforConferenceCallComplete();
	}
    if(isDemo) {isUILocked = false;}
}

//发送按键
img1009.onclick = function(){
	if(img1009.disabled==true || isUILocked) return;last_ope_img=img1009;
	if(dtmfnum=getPhoneNum("请输入按键号码!")){
		invokeSendDTMF(""+dtmfnum);
		alert("按键"+dtmfnum+"已发送");
	}
    if(isDemo) {isUILocked = false;}
}

//验证
img1010.onclick = function(){
	if(img1010.disabled==true || isUILocked) return;last_ope_img=img1010;
	if(isDemo) {isUILocked = false;}
}

//软电话设置
sp_setting.onclick = function(){
	if(img1001.disabled==false && img1001.name=="logon") {
		var paras = "height=200, width=400, left="+(screen.width-400)/2+",top="+(screen.height-260)/2 + ", toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no";
		window.open("sputil/loginsetting.htm", "spsettingwindow", paras);
	}else {
		alert("请登出软电话后再设置参数!");
	}
}

//举手按钮
img1011.onclick = function(){
	if(isForReport==true) {
		if(isLogined) {
			var paras = "height=100, width=400, left="+(screen.width-400)/2+",top="+(screen.height-260)/2 + ", toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no";
			window.open("sputil/handup.htm", "handupwindow", paras);
		}else {
			alert("请先登录!");
		}
	}
    if(isDemo) {isUILocked = false;}
}

////////////////////操作随路数据////////////////////////////////////////////////////////////
//设置随路数据,KEY,VALUE方式
function setEduValue(eduname,eduvalue){
	var result=$("ulinkSP").setEduValue(eduname,eduvalue);
	return result;
}

function setEduValues(edunameList,eduvalueList){
	var result=$("ulinkSP").setEduValues(edunameList,eduvalueList);
	return result;
}

//获取单个随路数据
function getEduValue(eduname){
	var result=$("ulinkSP").getEduValue(eduname);
	return result;
}

//获取多个随路数据,根据指定的若干名称按顺序返回,格式为:VALUE1,VALUE2,VALUE3
function getEduValueByNames(eduNameList) {
	var result=$("ulinkSP").getEduValueByNames(eduNameList);
	return result;	
}

//获取所有随路数据,格式为CALLID:1,CALLINNO:18701575605,CALLEDNO:58888
function getEduValueAll(){
	var result=$("ulinkSP").getEduValueAll();
	return result;
}

//删除随路数据
function delEduValue(eduname){
	var result=$("ulinkSP").delEduValue(eduname);
	return result;
}

function getChannelStatus(){
	var result=$("ulinkSP").getChannelStatus();
	return result;
}

function getSessionStatus(){
	var result=$("ulinkSP").getSessionStatus();
	return result;
}

function getWorkItemStatus(){
	var result=$("ulinkSP").getWorkItemStatus();
	return result;
}

////////////////////调用applet提供的事件接口////////////////////////////////////////////////////////////
//登录按钮点击事件,登录按钮点击时响应
function invokeAgentLogin(){
	if(isDemo) {
		ReportLogin(getInitData("agentLoginID"), getInitData("agentPassword"), getInitData("extensionNumber"), '0', '10001');
		UIforLoginSuccessedEvent();
		invokeEnterAuxwork(0);
		UIforBusyEvent();
		return;
	}
	var result=$("ulinkSP").doLogin();
	return result;
}

//签退按钮点击事件,签退按钮点击时响应
function invokeAgentLogout(){
	if(isDemo) {
		ReportLogout();
		UIforLogout();
		return;
	}	
//	var sessionStatus = getSessionStatus();
//	if("AUXWORK"!=sessionStatus){
//		invokeEnterAuxwork(text_aux_reasoncode.value);
//	}
	var result=$("ulinkSP").doLogout();
	return result;
}

//就绪按钮点击事件,就绪按钮点击时响应
function invokeMakeAvailable(){
	if(isDemo) {
		ReportAgentModeAvailable();
		UIforIdleEvent();
		return;
	}		
	var sessionStatus = getSessionStatus();
	if("AVAILABLE"==sessionStatus){
		UIforIdleEvent();
		return true;
	}
	var result=$("ulinkSP").makeAvailable();
	return result;
}

//未就绪按钮点击事件,未就绪按钮点击时响应
//SubIndex:未就绪子状态索引值(0开始)，对应IC平台配置中座席子状态配置顺序，与子状态编号无关
function invokeEnterAuxwork(reasonCodeIndex){
	if(isDemo) {
		ReportAgentModeAUX(text_aux_reasoncode.value);
		UIforBusyEvent();
		return;
	}			
	var sessionStatus = getSessionStatus();
	if("AUXWORK"==sessionStatus){
		UIforBusyEvent();
		return true;
	}	
	var result=$("ulinkSP").enterAuxwork(reasonCodeIndex);
	return result;
}

//电话通道示闲
function invokeVoiceLogin(){
	var result = $("ulinkSP").channelCommand("voice", "login");
	return result;
}
//电话通道示忙
function invokeVoiceLogout(){
	var result = $("ulinkSP").channelCommand("voice", "logout");
	return result;
}

//挂断按钮事件,点击挂断按钮时响应
function invokeHangupCall(){
	if(isDemo) {
		ReportReleased();
		UIforHangupEvent();
		ReportAgentModeACW();
		UIforAcwEvent();
		return;
	}
	var result=$("ulinkSP").releaseWorkItem();
	 result=$("ulinkSP").completeCall();
	return result;
}

//应答按钮事件,点击应答按钮
function invokeAnswerCall(){
	if(isDemo) {
		ReportTalking();
		UIforTalkingEvent();
		return;
	}		
	var result=$("ulinkSP").acceptCall();
	return result;
}

//呼出按钮事件,点击呼出按钮时响应
function invokeMakeCall(phonenum){
	if(isDemo) {
		ReportOutgoing(text_transfer_number.value);
		ReportTalking();
		UIforTalkingEvent();
		return;
	}		
	var result=$("ulinkSP").makeCall(phonenum);
	return result;
}

//保持按钮事件,点击保持按钮时响应
function invokeHoldCall(){
	if(isDemo) {
		ReportHolding();
		UIforHoldCallEvent();
		return;
	}			
	var result=$("ulinkSP").holdCall();
	return result;
}

//接回按钮事件,点击接回按钮时响应
function invokeUnholdCall(){
	if(isDemo) {
		ReportTalking();
		UIforTalkingEvent();
		return;
	}		
	var result=$("ulinkSP").unholdCall();
	return result;
}

//咨询按钮事件,点击咨询按钮时响应
function invokeConsultCall(phonenum){
	if(isDemo) {
		ReportConsulting();
		UIforConsultCallInit();
		return;
	}	
	var result=$("ulinkSP").transferCall("consult",phonenum);
	return result;
}

//取消咨询(咨询完取回客户通话)
function invokeConsultCallCancel(){
	if(isDemo) {
		ReportTalking();
		UIforTalkingEvent();
		return;
	}		
	var result=$("ulinkSP").collaborationCancel();
	return result;
}

//话路切换按钮事件,点击话路切换按钮时响应
function invokeConsultCallSwap(){
	if(isDemo) {
		ReportTalking();
		UIforTalkingEvent();
		return;
	}		
	return invokeConsultCallCancel();
}

//完成咨询(咨询完转接给第三方坐席)
function invokeConsultCallComplete(){
	if(isDemo) {
		ReportTalking();
		UIforTalkingEvent();
		return;
	}		
	var result=$("ulinkSP").collaborationComplete();
	return result;
}

//转接按钮事件,点击转接按钮时响应
function invokeTransferCall(phonenum){
	if(isDemo) {
		ReportReleased();
		UIforBusyEvent();
		return;
	}		
	var result=$("ulinkSP").transferCall("transfer",phonenum);
	return result;
}

//会议按钮事件,点击会议按钮时响应
function invokeConferenceCall(phonenum){
	if(isDemo) {
		ReportConsulting();
		UIforConferenceCallInit();
		return;
	}	
	var result=$("ulinkSP").transferCall("conference",phonenum);
	return result;
}

//取消会议(会议结束,取回客户通话)
function invokeConferenceCallCancel(){
	if(isDemo) {
		ReportTalking();
		UIforTalkingEvent();
		return;
	}		
	var result=$("ulinkSP").collaborationCancel();
	return result;
}

//会议取消
function invokeConferenceCallSwap(){
	if(isDemo) {
		ReportTalking();
		UIforTalkingEvent();
		return;
	}		
	return invokeConferenceCallCancel();
}

//完成会议(第二步:开始会议)
function invokeConferenceCallComplete(){
	if(isDemo) {
		ReportTalking();
		UIforTalkingEvent();
		return;
	}		
	var result=$("ulinkSP").collaborationComplete();
	return result;
}

//发送按键按钮事件,点击发送按键按钮时响应
function invokeSendDTMF(dtmfnum){
	var result=$("ulinkSP").sendDTMF(dtmfnum);
	return result;
}

//转IVR按钮事件,点击转IVR按钮时响应
function invokeTransferToIVR(){
	
}

function invokeClearWorkItemList(){
	var result=$("ulinkSP").clearWorkItemList();
	return result;	
}

////////////////////各种操作成功后对应的界面更新函数////////////////////////////////////////////////////////////
function UIforLocked(){
	isUILocked = true;//isUILocked = false;
	last_span_ope_info = span_ope_info.innerHTML;
//	return;
//	img1001.disabled = true;
//	img1002.disabled = true;
//	img1003.disabled = true;
//	img1004.disabled = true;
//	img1005.disabled = true;
//	img1006.disabled = true;
//	img1007.disabled = true;
//	img1008.disabled = true;
//	img1009.disabled = true;
//	
//	text_aux_reasoncode.disabled = true;	
//	text_transfer_number.disabled = true;
//	
//	span_ope_info.innerHTML="操作处理中...";
//	//span_call_number.innerHTML="";
//	//span_call_time.innerHTML="";
//	//span_summary_info.innerHTML="";
}

function UIforUnlock(){
	isUILocked = false;
	//span_ope_info.innerHTML = last_span_ope_info;
	if(isDebug)alert("**解除界面锁定");
}

//界面初始化
function UIforInit(){
	//
	
	currentCallDirection = "outbound";
	isUILocked = false;
	img1001.src = "spimg/UN_login_enable.gif";                  img1001.disabled = false;img1001.name="logon";img1001.alt="登录";
	img1002.src = "spimg/UN_manulBusy_unselected.gif";          img1002.disabled = true; img1002.name="";
	img1003.src ="spimg/UN_hangup.gif";                         img1003.disabled = true; img1003.name="";
	img1004.src ="spimg/UN_dial_unselected.gif";                img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_unselected.gif";               img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	img1008.src = "spimg/UN_initConference_unselected.gif";     img1008.disabled = true; img1008.name="";
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name="";
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;
	
	span_ope_info.innerHTML="未登录";
	//span_call_number.innerHTML="";
	//span_call_time.innerHTML="";
	//span_summary_info.innerHTML="";
	
	span_ope_info0.innerHTML     = "操作信息:";
	span_agent_info0.innerHTML   = "坐席信息:";
	span_call_number0.innerHTML  = "呼叫号码:";
	span_call_time0.innerHTML    = "通话时长:";
	span_summary_info0.innerHTML = "在线时长:";
	sp_setting.innerHTML         = "设置";
	
}

function UIforLogout(){
	isLogined = false;
	//ReportLogout();
	
	isUILocked = false;
	img1001.src = "spimg/UN_login_enable.gif";                  img1001.disabled = false;img1001.name="logon";img1001.alt="登录";
	img1002.src = "spimg/UN_manulBusy_unselected.gif";          img1002.disabled = true; img1002.name="";
	img1003.src ="spimg/UN_hangup.gif";                         img1003.disabled = true; img1003.name="";
	img1004.src ="spimg/UN_dial_unselected.gif";                img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_unselected.gif";               img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	img1008.src = "spimg/UN_initConference_unselected.gif";     img1008.disabled = true; img1008.name="";
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name="";
	
	img1011.src = "spimg/UN_handup_disable.gif";                 img1011.disabled = true; img1009.name="";

	text_aux_reasoncode.disabled = true;	
	text_transfer_number.disabled = true;
	
	span_ope_info.innerHTML="已登出";
	//span_call_number.innerHTML="";
	//span_call_time.innerHTML="";
	//span_summary_info.innerHTML="";
}

//调用
function UIforLoginSuccessedEvent(){
	Refreshspan_agent_info();
	isLogined = true;
	if(isForReport==true)
	img1011.src = "spimg/UN_handup_enable.gif";                 img1011.disabled = false; img1011.name="handup"; img1011.alt="举手";
	//ReportLogin('agent1', 'agent1', '2001', '0', '10002');
	/*
	isUILocked = false;
	img1001.src = "spimg/UN_logout_selected.gif";               img1001.disabled = false;img1001.name="logout";img1001.alt="登出";
	img1002.src ="spimg/UN_manulReady_selected.gif";            img1002.disabled = false;img1002.name="idle";img1002.alt="置闲";
	img1003.src ="spimg/UN_hangup.gif";                         img1003.disabled = true; img1003.name="";
	img1004.src ="spimg/UN_dial_unselected.gif";                img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_unselected.gif";               img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	img1008.src = "spimg/UN_initConference_unselected.gif";     img1008.disabled = true; img1008.name="";
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name="";
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="登录成功,未就绪";
	//span_call_number.innerHTML="";
	//span_call_time.innerHTML="";
	////span_summary_info.innerHTML="";
	*/
	
}

function UIforBusyEvent(){
	//ReportAgentModeAUX(text_aux_reasoncode.value);
	
	currentCallDirection = "outbound";
	isUILocked = false;
	img1001.src = "spimg/UN_logout_selected.gif";               img1001.disabled = false;img1001.name="logout";img1001.alt="登出";
	img1002.src ="spimg/UN_manulReady_selected.gif";            img1002.disabled = false;img1002.name="idle";img1002.alt="置闲";
	img1003.src ="spimg/UN_hangup.gif";                         img1003.disabled = true; img1003.name="";
	img1004.src ="spimg/UN_dial_enable.gif";                    img1004.disabled = false;img1004.name="dail";img1004.alt="拨号";	
	img1005.src = "spimg/UN_held_unselected.gif";               img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	img1008.src = "spimg/UN_initConference_unselected.gif";     img1008.disabled = true; img1008.name="";
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name=""
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;
	
	span_ope_info.innerHTML="未就绪";
	//span_call_number.innerHTML="";
	//span_call_time.innerHTML="";
	////span_summary_info.innerHTML="";
}


function UIforIdleEvent(){
	//ReportAgentModeAvailable();
	
	currentCallDirection = "inbound";
	isUILocked = false;
	img1001.src = "spimg/UN_logout_selected.gif";               img1001.disabled = false;img1001.name="logout";img1001.alt="登出";
	img1002.src = "spimg/UN_manulBusy_enable.gif";              img1002.disabled = false;img1002.name="busy";img1002.alt="置忙";
	img1003.src ="spimg/UN_hangup.gif";                         img1003.disabled = true; img1003.name="";
	img1004.src ="spimg/UN_dial_unselected.gif";                img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_unselected.gif";               img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	img1008.src = "spimg/UN_initConference_unselected.gif";     img1008.disabled = true; img1008.name="";
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name=""

	text_aux_reasoncode.disabled = false;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="已就绪";
	//span_call_number.innerHTML="";
	//span_call_time.innerHTML="";
	////span_summary_info.innerHTML="";
}

function UIforOutboundInit(){
	//ReportOutgoing(text_transfer_number.value);
	
	currentCallDirection = "outbound";//add by liuqh20110401
	isUILocked = false;
	img1001.src = "spimg/UN_logout_disable.gif";                img1001.disabled = true; img1001.name="";
	img1002.src = "spimg/UN_manulBusy_unselected.gif";          img1002.disabled = true; img1002.name="";
	img1003.src ="spimg/UN_hangup_enable.gif";                  img1003.disabled = false;img1003.name="hangup";img1003.alt="挂机";
	img1004.src ="spimg/UN_answer_unselected.gif";              img1004.disabled = true; img1004.name="dial";
	img1005.src = "spimg/UN_held_unselected.gif";               img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	img1008.src = "spimg/UN_initConference_unselected.gif";     img1008.disabled = true; img1008.name="";
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name="";
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="外呼中...";
	//span_call_number.innerHTML="13910819201";
	//span_call_time.innerHTML="00:01:40";
	//span_summary_info.innerHTML="00:01:40";
}

function UIforHangupEvent(){
	//ReportReleased();
	
	isUILocked = false;
	img1001.src = "spimg/UN_logout_selected.gif";               img1001.disabled = false;img1001.name="logout";img1001.alt="登出";
	img1002.src = "spimg/UN_manulBusy_enable.gif";              img1002.disabled = false;img1002.name="busy";img1002.alt="置忙";
	img1003.src ="spimg/UN_hangup.gif";                         img1003.disabled = true; img1003.name="";
	img1004.src ="spimg/UN_dial_unselected.gif";                img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_unselected.gif";               img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	img1008.src = "spimg/UN_initConference_unselected.gif";     img1008.disabled = true; img1008.name="";
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name=""
	
	text_aux_reasoncode.disabled = false;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="已挂机,未就绪";
	//span_call_number.innerHTML="";
	//span_call_time.innerHTML="";
	////span_summary_info.innerHTML="";
	
}

function UIforRingEvent(){
	//ReportIncoming(text_transfer_number.value);
	
	isUILocked = false;
	img1001.src = "spimg/UN_logout_disable.gif";                img1001.disabled = true; img1001.name="";
	img1002.src = "spimg/UN_manulBusy_unselected.gif";          img1002.disabled = true; img1002.name="";
	img1003.src ="spimg/UN_hangup.gif";                         img1003.disabled = true; img1003.name="";
	img1004.src ="spimg/UN_answer_selected.gif";                img1004.disabled = false;img1004.name="answer";img1004.alt="接听";
	img1005.src = "spimg/UN_held_unselected.gif";               img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	img1008.src = "spimg/UN_initConference_unselected.gif";     img1008.disabled = true; img1008.name="";
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name="";
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="振铃中...";
	//span_call_number.innerHTML="";
	//span_call_time.innerHTML="";
	////span_summary_info.innerHTML="";
}

function UIforTalkingEvent(){
	//ReportTalking();
	
	isUILocked = false;
	img1001.src = "spimg/UN_logout_disable.gif";                img1001.disabled = true; img1001.name="";
	img1002.src = "spimg/UN_manulBusy_unselected.gif";          img1002.disabled = true; img1002.name="";
	img1003.src ="spimg/UN_hangup_enable.gif";                  img1003.disabled = false;img1003.name="hangup";img1003.alt="挂机";
	img1004.src ="spimg/UN_answer_unselected.gif";              img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_enable.gif";                   img1005.disabled = false;img1005.name="hold";img1005.alt="保持";
	img1006.src = "spimg/UN_initConsult_enable.gif";            img1006.disabled = false;img1006.name="initConsult";img1006.alt="咨询";
	img1007.src = "spimg/UN_initTransfer_enable.gif";           img1007.disabled = false;img1007.name="initTransfer";img1007.alt="转接";
	img1008.src = "spimg/UN_initConference_enable.gif";         img1008.disabled = false;img1008.name="initConference";img1008.alt="会议";
	img1009.src = "spimg/dtmf.gif";                             img1009.disabled = false;img1009.name="dtmf";img1009.alt="发送按键";
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="通话中...";
	//span_call_number.innerHTML="13910819201";
	//span_call_time.innerHTML="00:00:00";
	//span_summary_info.innerHTML="00:00:00";
}

function UIforHoldCallEvent(){
	//ReportHolding();
	
	isUILocked = false;
	img1001.src = "spimg/UN_logout_disable.gif";                img1001.disabled = true; img1001.name="";
	img1002.src = "spimg/UN_manulBusy_unselected.gif";          img1002.disabled = true; img1002.name="";
	img1003.src ="spimg/UN_hangup.gif";                         img1003.disabled = true; img1003.name="";
	img1004.src ="spimg/UN_answer_unselected.gif";              img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_retrieve_selected.gif";             img1005.disabled = false;img1005.name="unhold";img1005.alt="取回";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	img1008.src = "spimg/UN_initConference_unselected.gif";     img1008.disabled = true; img1008.name="";
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name="";
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="通话保持中...";
	//span_call_number.innerHTML="13910819201";
	//span_call_time.innerHTML="00:01:00";
	//span_summary_info.innerHTML="00:01:00";
}

function UIforUnholdCallEvent(){
	isUILocked = false;
	img1001.src = "spimg/UN_logout_disable.gif";                img1001.disabled = true; img1001.name="";
	img1002.src = "spimg/UN_manulBusy_unselected.gif";          img1002.disabled = true; img1002.name="";
	img1003.src ="spimg/UN_hangup_enable.gif";                  img1003.disabled = false;img1003.name="hangup";img1003.alt="挂机";
	img1004.src ="spimg/UN_answer_unselected.gif";              img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_enable.gif";                   img1005.disabled = false;img1005.name="hold";img1005.alt="保持";
	img1006.src = "spimg/UN_initConsult_enable.gif";            img1006.disabled = false;img1006.name="initConsult";img1006.alt="咨询";
	img1007.src = "spimg/UN_initTransfer_enable.gif";           img1007.disabled = false;img1007.name="initTransfer";img1007.alt="转接";
	img1008.src = "spimg/UN_initConference_enable.gif";         img1008.disabled = false;img1008.name="initConference";img1008.alt="会议";
	img1009.src = "spimg/dtmf.gif";                             img1009.disabled = false;img1009.name="dtmf";img1009.alt="发送按键";
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="通话已取回";
	//span_call_number.innerHTML="13910819201";
	//span_call_time.innerHTML="00:00:00";
	//span_summary_info.innerHTML="00:00:00";
}

function UIforConsultCallInit(){
	//ReportConsulting();
	
	isUILocked = false;
	img1001.src = "spimg/UN_logout_disable.gif";                  img1001.disabled = true; img1001.name="";
	img1002.src = "spimg/UN_manulBusy_unselected.gif";            img1002.disabled = true; img1002.name="";
	img1003.src ="spimg/UN_hangup.gif";                           img1003.disabled = false;img1003.name="hangup";img1003.alt="挂机";
	img1004.src ="spimg/UN_answer_unselected.gif";                img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_unselected.gif";                 img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_selected.gif";            img1006.disabled = false;img1006.name="switchConsult";img1006.alt="切换";
	img1007.src = "spimg/UN_compConference_selected.gif";         img1007.disabled = false;img1007.name="completeConsult";img1007.alt="咨询转接";
	img1008.src = "spimg/UN_initConference_unselected.gif";       img1008.disabled = true; img1008.name="";
	img1009.src = "spimg/dtmf_e.gif";                             img1009.disabled = true; img1009.name="";
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="咨询中...";
	//span_call_number.innerHTML="13910819201";
	//span_call_time.innerHTML="00:01:20";
	//span_summary_info.innerHTML="00:01:20";
}

function UIforConsultCallSwapEvent(){
	isUILocked = false;
	img1001.src = "spimg/UN_logout_disable.gif";                img1001.disabled = true; img1001.name="";
	img1002.src = "spimg/UN_manulBusy_unselected.gif";          img1002.disabled = true; img1002.name="";
	img1003.src ="spimg/UN_hangup_enable.gif";                  img1003.disabled = false;img1003.name="hangup";img1003.alt="挂机";
	img1004.src ="spimg/UN_answer_unselected.gif";              img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_enable.gif";                   img1005.disabled = false;img1005.name="hold";img1005.alt="保持";
	img1006.src = "spimg/UN_initConsult_enable.gif";            img1006.disabled = false;img1006.name="initConsult";img1006.alt="咨询";
	img1007.src = "spimg/UN_initTransfer_enable.gif";           img1007.disabled = false;img1007.name="initTransfer";img1007.alt="转接";
	img1008.src = "spimg/UN_initConference_enable.gif";         img1008.disabled = false;img1008.name="initConference";img1008.alt="会议";
	img1009.src = "spimg/dtmf.gif";                             img1009.disabled = false;img1009.name="dtmf";img1009.alt="发送按键";
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="通话中,咨询已结束...";
	//span_call_number.innerHTML="13910819201";
	//span_call_time.innerHTML="00:00:00";
	//span_summary_info.innerHTML="00:00:00";
}

function UIforConsultCallCompleteEvent(){
	isUILocked = false;
	img1001.src = "spimg/UN_logout_selected.gif";               img1001.disabled = false;img1001.name="logout";img1001.alt="登出";
	img1002.src = "spimg/UN_manulBusy_enable.gif";              img1002.disabled = false;img1002.name="busy";img1002.alt="置忙";
	img1003.src ="spimg/UN_hangup.gif";                         img1003.disabled = true; img1003.name="";
	img1004.src ="spimg/UN_dial_unselected.gif";                img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_unselected.gif";               img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	img1008.src = "spimg/UN_initConference_unselected.gif";     img1008.disabled = true; img1008.name="";
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name="";
	
	text_aux_reasoncode.disabled = false;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="未就绪,转接完成";
	//span_call_number.innerHTML="";
	//span_call_time.innerHTML="";
	//span_summary_info.innerHTML="";	
}

function UIforTransferCallInit(){
	isUILocked = false;
	img1001.src = "spimg/UN_logout_selected.gif";               img1001.disabled = false;img1001.name="logout";img1001.alt="登出";
	img1002.src = "spimg/UN_manulBusy_enable.gif";              img1002.disabled = false;img1002.name="busy";img1002.alt="置忙";
	img1003.src ="spimg/UN_hangup.gif";                         img1003.disabled = true; img1003.name="";
	img1004.src ="spimg/UN_dial_unselected.gif";                img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_unselected.gif";               img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	img1008.src = "spimg/UN_initConference_unselected.gif";     img1008.disabled = true; img1008.name="";
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name="";
	
	text_aux_reasoncode.disabled = false;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="未就绪,转接完成";
	//span_call_number.innerHTML="";
	//span_call_time.innerHTML="";
	//span_summary_info.innerHTML="";

	//text_aux_reasoncode.value="";
	//text_transfer_number.value="";	
}

function UIforConferenceCallInit(){
	isUILocked = false;
	img1001.src = "spimg/UN_logout_disable.gif";                img1001.disabled = true; img1001.name="";
	img1002.src = "spimg/UN_manulBusy_unselected.gif";          img1002.disabled = true; img1002.name="";
	img1003.src ="spimg/UN_hangup_enable.gif";                  img1003.disabled = false;img1003.name="hangup";img1003.alt="挂机";
	img1004.src ="spimg/UN_answer_unselected.gif";              img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_unselected.gif";               img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
//	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	img1007.src = "spimg/UN_initConsult_selected.gif";          img1007.disabled = false;img1007.name="switchConference";img1007.alt="切换";
	img1008.src = "spimg/UN_compConference_selected.gif";       img1008.disabled = false;img1008.name="completeConference";img1008.alt="完成会议";
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name="";
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="通话中,发起会议...";
	//span_call_number.innerHTML="13910819201";
	//span_call_time.innerHTML="00:01:40";
	//span_summary_info.innerHTML="00:01:40";
}

function UIforConferenceCallCompleteEvent(){
/*	
	isUILocked = false;
	img1001.src = "spimg/UN_logout_disable.gif";                img1001.disabled = true; img1001.name="";
	img1002.src = "spimg/UN_manulBusy_unselected.gif";          img1002.disabled = true; img1002.name="";
	img1003.src ="spimg/UN_hangup_enable.gif";                  img1003.disabled = false;img1003.name="hangup";img1003.alt="挂机";
	img1004.src ="spimg/UN_answer_unselected.gif";              img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_enable.gif";                   img1005.disabled = false;img1005.name="hold";img1005.alt="保持";
	img1006.src = "spimg/UN_initConsult_enable.gif";            img1006.disabled = false;img1006.name="initConsult";img1006.alt="咨询";
	img1007.src = "spimg/UN_initTransfer_enable.gif";           img1007.disabled = false;img1007.name="initTransfer";img1007.alt="转接";
	img1008.src = "spimg/UN_initConference_enable.gif";         img1008.disabled = false;img1008.name="initConference";img1008.alt="会议";
	img1009.src = "spimg/dtmf.gif";                             img1009.disabled = false;img1009.name="dtmf";img1009.alt="发送按键";
*/

	isUILocked = false;
	img1001.src = "spimg/UN_logout_disable.gif";                img1001.disabled = true; img1001.name="";
	img1002.src = "spimg/UN_manulBusy_unselected.gif";          img1002.disabled = true; img1002.name="";
	img1003.src ="spimg/UN_hangup_enable.gif";                  img1003.disabled = false;img1003.name="hangup";img1003.alt="挂机";
	img1004.src ="spimg/UN_answer_unselected.gif";              img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_unselected.gif";               img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
//	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	//img1007.src = "spimg/UN_initConsult_selected.gif";          img1007.disabled = false;img1007.name="switchConference";img1007.alt="切换";
	img1007.src = "spimg/UN_initTransfer_unselected.gif";          img1007.disabled = true;
	img1008.src = "spimg/UN_initConference_unselected.gif";     img1008.disabled = true;
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name="";
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="会议建立成功";
	//span_call_number.innerHTML="13910819201";
	//span_call_time.innerHTML="00:01:20";
	//span_summary_info.innerHTML="00:01:20";
}

function UIforConferenceCallCancelEvent(){
	isUILocked = false;
	img1001.src = "spimg/UN_logout_disable.gif";                img1001.disabled = true; img1001.name="";
	img1002.src = "spimg/UN_manulBusy_unselected.gif";          img1002.disabled = true; img1002.name="";
	img1003.src ="spimg/UN_hangup_enable.gif";                  img1003.disabled = false;img1003.name="hangup";img1003.alt="挂机";
	img1004.src ="spimg/UN_answer_unselected.gif";              img1004.disabled = true; img1004.name="";
	img1005.src = "spimg/UN_held_enable.gif";                   img1005.disabled = false;img1005.name="hold";img1005.alt="保持";
	img1006.src = "spimg/UN_initConsult_enable.gif";            img1006.disabled = false;img1006.name="initConsult";img1006.alt="咨询";
	img1007.src = "spimg/UN_initTransfer_enable.gif";           img1007.disabled = false;img1007.name="initTransfer";img1007.alt="转接";
	img1008.src = "spimg/UN_initConference_enable.gif";         img1008.disabled = false;img1008.name="initConference";img1008.alt="会议";
	img1009.src = "spimg/dtmf.gif";                             img1009.disabled = false;img1009.name="dtmf";img1009.alt="发送按键";
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;

	span_ope_info.innerHTML="会议结束,第三方坐席已挂机";
	//span_call_number.innerHTML="13910819201";
	//span_call_time.innerHTML="00:01:20";
	//span_summary_info.innerHTML="00:01:20";
}

function UIforAcwEvent(){
	
	//currentCallDirection = "outbound";
	isUILocked = false;
	img1001.src = "spimg/UN_logout_selected.gif";               img1001.disabled = false;img1001.name="logout";img1001.alt="登出";
	img1002.src ="spimg/UN_manulReady_selected.gif";            img1002.disabled = false;img1002.name="idle";img1002.alt="置闲";
	img1003.src ="spimg/UN_hangup.gif";                         img1003.disabled = true; img1003.name="";
	img1004.src ="spimg/UN_dial_enable.gif";                    img1004.disabled = false;img1004.name="dail";img1004.alt="拨号";	
	img1005.src = "spimg/UN_held_unselected.gif";               img1005.disabled = true; img1005.name="";
	img1006.src = "spimg/UN_initConsult_disable.gif";           img1006.disabled = true; img1006.name="";
	img1007.src = "spimg/UN_initTransfer_unselected.gif";       img1007.disabled = true; img1007.name="";
	img1008.src = "spimg/UN_initConference_unselected.gif";     img1008.disabled = true; img1008.name="";
	img1009.src = "spimg/dtmf_e.gif";                           img1009.disabled = true; img1009.name=""
	
	text_aux_reasoncode.disabled = true;
	text_transfer_number.disabled = false;
	
	span_ope_info.innerHTML="事后处理";
	//span_call_number.innerHTML="";
	//span_call_time.innerHTML="";
	////span_summary_info.innerHTML="";
}


//设置AuxReasonCode
function SetAuxReasonCodes(reasonCodeNames){
	text_aux_reasoncode.length=0;
	var objSelect=text_aux_reasoncode;
	var arrTmp = reasonCodeNames.split(",,,");
	for(var i = 0; i < arrTmp.length; i++){
		var varItem = new Option(arrTmp[i], ""+i);
		objSelect.options.add(varItem);
	}
}

//设置转接号码下拉框
function SetTransferNumberList(codes, names){
	list_transfer_number.length=0;
	var objSelect=list_transfer_number;
	var varItem0 = new Option("", "");
	//objSelect.options.add(varItem0);
	var arrTmpCodes = codes.split(",,,");
	var arrTmpNames = names.split(",,,");
	for(var i = 0; i < arrTmpCodes.length; i++){
		var varItem = new Option(arrTmpNames[i], arrTmpCodes[i]);
		objSelect.options.add(varItem);
	}
}

//将本地参数再次传入applet
function setInitDataAllFromLocal(){
	softphoneInitParameters= getInitParametersFromLocal();
	Refreshspan_agent_info();
	isInitParameters = setInitDataAll(softphoneInitParameters);	
		
	//自动登录
	if(isAutoLogin=='1'){
		autoLoginTryCount = 0;
		autoLogin();
	}
}

function Setspan_ope_info(str){//操作状态显示栏
	span_ope_info.innerHTML = str;
}
function Setspan_agent_info(str){//坐席信息显示栏
	span_agent_info.innerHTML = str;
}
function Setspan_call_number(str){//呼叫号码显示栏
	span_call_number.innerHTML = str;
}
function Setspan_call_time(str){//通话时长显示栏
	span_call_time.innerHTML = str;
}
function Setspan_summary_info(str){//在线时长显示栏
	span_summary_info.innerHTML = str;
}

function Refreshspan_agent_info(){//刷新坐席信息显示栏
	softphone_init_agentLoginID = getInitData("agentLoginID");
	softphone_init_extensionNumber = getInitData("extensionNumber");
	var agetInfo = "AID:"+softphone_init_agentLoginID+" DN:"+softphone_init_extensionNumber;
	if(softphone_init_agentName) agetInfo+=" NAME:"+softphone_init_agentName;
	Setspan_agent_info(agetInfo);
}

if(hasParentPage){//软电话被嵌入
	//获取软电话初始化参数
	softphoneInitParameters= getInitParametersFromParentUI();
	
	//设置转接技能组下拉框
	SetTransferNumberList(softphone_init_transferCodes, softphone_init_transferNames);
	
	//设置坐席基本信息
	Refreshspan_agent_info();
}

if(hasParentPage && isInitParameters==false) {//第一次登录时进行参数初始化设置
	isInitParameters = setInitDataAll(softphoneInitParameters);
	if(isInitParameters==false){
		alert("配置的初始化参数不正确,无法进行软电话初始化,请联系管理员.");
	}else {
		if(isDebug)alert("**初始化参数已装入applet->"+softphoneInitParameters);
	}
}


function sendCmd(){
	var i = sendSocketMessage($value('cmd'));
}


function sendHandup(){
	var i = HandUp(getInitData("agentLoginID"), getInitData("extensionNumber"), $value('handupCode'), $value('handupDesc'));
}

function sendHandup2(handupCode, handupDesc){
	var i = HandUp(getInitData("agentLoginID"), getInitData("extensionNumber"), handupCode, handupDesc);
}

SetAuxReasonCodes("Default,,,事后处理,,,会议,,,小休,,,吃饭");

	var spEnvFilePathExist = false;
	var rwReady = false;
	//var filePath = spEnvFilePath;
	//读文件 
	function readFile(){
		try{
			var fso = new ActiveXObject("Scripting.FileSystemObject"); 
			var f = fso.OpenTextFile(spEnvFilePath,1);//只读
			var line; 
			while (!f.AtEndOfStream){
				line = f.ReadLine();
				if(line.indexOf('avaya.ic.sdk.user.name=')==0) {
					val = line.substring('avaya.ic.sdk.user.name='.length,line.length);
					if(!agentLoginID) {agentLoginID = val;agentPassword = '';}
				}if(line.indexOf('avaya.ic.sdk.user.password=')==0) {
					val = line.substring('avaya.ic.sdk.user.password='.length,line.length);
					if(!agentPassword) agentPassword = val;	
				}if(line.indexOf('avaya.ic.sdk.user.stationid=')==0) {
					val = line.substring('avaya.ic.sdk.user.stationid='.length,line.length);
					if(!extensionNumber) extensionNumber = val;
				}if(line.indexOf('avaya.ic.sdk.appserver.uri=')==0) {
					val = line.substring('avaya.ic.sdk.appserver.uri='.length,line.length);
					val = val.replaceAll("\\","");
					if(!sdkAddress) sdkAddress = val;		
				}
			}
			//如果无密码,则密码与工号一致agentLoginID = val; = ''
			if(agentLoginID && !agentPassword){
				agentPassword = agentLoginID;
			}
			f.Close();
			spEnvFilePathExist = true;
		}catch(Ex){
			spEnvFilePathExist = false;
		}
}
	
	//写文件 
	function writeFile(){
	    var fso, f, s ; 
	    fso = new ActiveXObject("Scripting.FileSystemObject");    
	    f = fso.OpenTextFile(spEnvFilePath,2,true);//可写,没有则自动创建
	    var filecontent = "#SDK Agent Properties"+"\r\n" 
	                    + "#"+new Date()+"\r\n";
	    filecontent += "avaya.ic.sdk.appserver.uri=" +sdkAddress.replaceAll("\\","")+"\r\n";
	    filecontent += "avaya.ic.sdk.user.name="     +agentLoginID+"\r\n";
	    filecontent += "avaya.ic.sdk.user.password=" +agentPassword+"\r\n";
	    filecontent += "avaya.ic.sdk.user.stationid="+extensionNumber+"\r\n";
	    f.WriteLine(filecontent);
	    f.Close(); 
	    rwReady = true;
	}
	
	function initPara(){
		//读取配置文件和传入参数比较
		readFile();		
		if(spEnvFilePathExist==false) {
			alert("读取配置文件"+spEnvFilePath+"失败!请手工设置!");
			return;
		}
		//将新的设置写入配置文件
   	writeFile();
		//将参数传入软电话applet
		softphone_init_agentLoginID   =agentLoginID;
		softphone_init_agentPassword  =agentPassword;
		softphone_init_extensionNumber=extensionNumber;
		softphone_init_sdkAddress     =sdkAddress.replaceAll("\\","");
		softphone_init_sdkAddress2    =sdkAddress.replaceAll("\\","");
		setInitDataAllFromLocal();
	}
	
	var autoLoginTryCount = 0;
	function autoLogin(i){
		if(!i) autoLoginTryCount = 0;else autoLoginTryCount++;
		//alert('autoLogin.autoLoginTryCount='+autoLoginTryCount);
		//alert('rwReady='+rwReady+',isInitParameters='+isInitParameters);
		if(isInitParameters==true){
			img1001.click();
		}else {
			if(autoLoginTryCount<=3)
			setTimeout("autoLogin("+(i+1)+")",2000);
		}
	}
