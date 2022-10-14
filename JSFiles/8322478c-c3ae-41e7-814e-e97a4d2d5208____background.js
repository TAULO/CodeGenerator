// --- file[background.js] ---

	var search_from_home=false;
	var localblasts = "";
	var searchblastfromFooter=false;	
	var url =  api_endpoint;
	var urlAPI = url+"/api/v2.0";
	var intervalID=null;
	var followerCount= 0 ;
	var prevUrl="";
	var member_id="";
	var login_session_key="";
	var initial_login_session_key="";
	var password="";
	var leader_id="";
	var leaderSessionKey="";
	var sessionName="";
	var sessionResults=null;
	var follower_session_key="";
	var fLeaderSessionKey="";
	var followID=null;
	var search_id="";
	var follower=null;
	var bLogin=false;
	var followAction="";
	var bCommandCompleted=true;
	var ppt_name="";
	var leader_session_key="";
	var recent_history_list="";
	var contentResults=null;
	var limit = 20;
	var blast_message ="";
	var blast_key="";
	var clicked_element="";
	var friend_list=[];
	var blastResults =null;
	var tray_count = 0;
	var link_url = "";
	var link_title = "";
	var allLeaderSessionsID=null;
	var member_images="";
	var default_images="";
	var profile_image_url="";
	var timer_recent_blasts=null;
	var timer_follower_list=null;
	var timer_get_url=null;
	var blast_replies=null;
	var blast_limit=30;
	var search_history=new Array();
	var previousTime=0;
	var new_blast_count=0;
	var last_seen_blast_time=null;
	var ppt_uploading=false;
	var login_in_progress=false;
	var follow_inprogress=false;
	var timer_blasts_count=null;
	var counts_updated_at=null;
	var recent_update_time=new Date();
	var prev_update_time=new Date();
	var follow_blast_id=0;
	var on_conversation_screen=false;
	var private_profile="false";
	var new_request_count=0;
	var new_approvals_count=0;
	var new_member = false;
	
	var image_index = 0;
	var image_index2 = 0;
	
	var keep_switching_icon = true;
	
	var searching_images = ['img/waiting1.png',
                        'img/waiting2.png',
                        'img/waiting3.png',
                        'img/waiting4.png'];

   var searching_images2 = ['loggedout.png',
                        'img/login1.png',
                        'img/login2.png',
                        'img/login3.png',
                        'icon.png'];   
						
					
	
	function RestClientParameters()
	{
		var _pl = new Array();
		var _name=new Array();
		var index=0;
		this.add = function(name, value) 
		{
			
			_pl[index] = value; 
			_name[index] = name;
			index++;
			return this; 
		}
		this.toXml = function()
		{
			var xml = "";
			for(var i=0;i<_pl.length;i++)
			{
				if(typeof(_pl[i]) != "function")
					xml +=_name[i]+"="+_pl[i]+"&";
			}
			xml=xml.slice(0,xml.length-1);
			return xml;	
		}
		
	}

	function invokePOST(url, method, parameters, callback,formElement)
	{
		try
		{
			url= "http://"+url+"/"+method+".xml?"+parameters.toXml();
			var req =  new XMLHttpRequest();       
			req.open('POST', url, true);
			req.onreadystatechange = function(event)
			{
				if( req.readyState == 4 )
				{
					if( req.status == 200 )
					{
						callback(req.responseXML);
					}
					else
					{		
					}
				}
			};
			req.send(formElement);
		}     
		catch(e)
		{
		}
	}
	var showErrorAlert=true;		
	function invoke(url, method, parameters, callback,tag,limit,tag2,tag3)
	{
		try
		{
			url= "http://"+url+"/"+method+".xml?"+parameters.toXml();
			var req =  new XMLHttpRequest();       
			req.open('GET', url, true);
			req.pid =tag;
			req.limit=limit;
			req.tag2=tag2;
			req.tag3=tag3;
			req.onreadystatechange = function(event)
			{
				if( req.readyState == 4 )
				{
					if( req.status == 200 )
					{
						callback(req.responseXML,req.pid,req.limit,req.tag2,req.tag3);
					}
					else if(req.status == 403)
					{
						if(login_session_key!="")
						{
							alert("Authentication Failure... Logging out");
						}
						deleteCookie();
						clearSession();
					}
					else if(req.status==0)
					{
/*
						if(req.pid=="login")
						{
							showNotification("Oops! No Internet Connection...");
						}
						else if(login_session_key!="")
						{
							showNotification("Oops! No Internet Connection...Logging out CoVu.");
						}
						clearSession();
						var popups = chrome.extension.getViews({type: "popup"});
						if(popups.length)
							popups[0].showSignInScreen(true);*/
						if(req.pid=='login')
						{
								var popups = chrome.extension.getViews({type: "popup"});
								
								if(popups.length)
									popups[0].showErrorAlert("Unable to send your request, Check your Internet Connection ");
								else
									showNotification("Unable to send your request, Check your Internet Connection ");	
									
								clearSession();
						}
						else if(req.pid!='notification')	
						{
							if(showErrorAlert)
							{
								var popups = chrome.extension.getViews({type: "popup"});
								
								if(popups.length)
									popups[0].showErrorAlert("Unable to send your request, Check your Internet Connection ");
								else
									showNotification("Unable to send your request, Check your Internet Connection ");
									
								showErrorAlert=false;
								
							}
						}
					}
					else
					{

						if(req.pid=="login")
						{
						//	clearSession();
							alert("Unable to Login. Try again");
						}
						else if(login_session_key!="")
						{
						//	showNotification("Something went wrong with server..Logging out CoVu");
						//	alert("Something went wrong with server..Logging out");
						}
						//clearSession();
						if(req.pid!='notification')	
						{
							var popups = chrome.extension.getViews({type: "popup"});
							if(popups.length)
								popups[0].showErrorAlert("Our server was unable process your request.");
						}
					}
				}
			};
			req.send(null);
		}     
		catch(e)
		{
			/*if(login_session_key!="")
				showNotification("Unable to send request to server....Logging out CoVu");
				//alert("Unable to send request to server....Logging out");
			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
				popups[0].showSignInScreen(true);
				
			
			clearSession();*/
			
			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
				popups[0].showErrorAlert("CoVu Chrome was unable to send your request ");
		}
	}
	function getTokenString()
	{
		if(__pptToken)
			return __pptToken["ResponseCode"];
		return 0;
	}
	
	function getPPTUploadToken()
	{
		pptManager.getUploadToken();
	}
	
	function getResponseToken()
	{
		pptManager.poolUploadStatus();
	}
	
	function liveSessionAlert()
	{
		alert("You are already in a live session.");
	}
	function clearSession()
	{
		keep_switching_icon=false;
		image_index2=0;
		image_index=0;
		
		historyManager.init();
		showNormalIcon();
		hideBadge();
		clearTimers("login");
		followerCount= 0 ;
		prevUrl="";
		member_id="";
		login_session_key="";
		password="";
		leader_id="";
		leaderSessionKey="";
		sessionName="";
		sessionResults=null;
		follower_session_key="";
		fLeaderSessionKey="";
		followID=null;
		search_id="";
		allLeaderSessionsID=null;
		follower=null;
		bLogin=false;
		followAction="";
		bCommandCompleted=true;
		recent_history_list="";
		contentResults=null;
		blast_message = "";
		blast_key ="";
		friend_list=[];
		tray_count = 0;
		blastResults=null;
		blast_limit=30;
		search_history= [];
		new_blast_count=0;
		last_seen_blast_time=null;
		ppt_uploading=false;
		login_in_progress=false;
		follow_inprogress=false;
		timer_blasts_count=null;
		initial_login_session_key="";
		recent_update_time=new Date();
		prev_update_time=new Date();
		follow_blast_id=0;
		on_conversation_screen=false;
		private_profile="false";
		new_request_count=0;
	 	new_approvals_count=0;
		hideBadge();
		peopleScreen.clearData();
		profileScreen.clearData();
		groupScreen.init();
	}

	function setTimers(status)
	{
		if(status == "login")
		{
			tray_count = 0;
			//timer_recent_blasts = setInterval(getRecentBlasts,20000);
			timer_blasts_count = setInterval(GetRecentBlastsCount,10000);
		}
		else if(status == "follower_list")
		{
			timer_follower_list=setInterval(GetLeaderSessionFollowers, 20000);
		}
		else if(status == "get_url")
		{
			timer_get_url=setInterval(GetUrl, 1000);
		}
		else if(status == "negitive")
		{
			tray_count--;
			if(tray_count == 0 && allLeaderSessionsID == null)
			{
				//allLeaderSessionsID = setInterval(getRecentBlasts,4000);
				//alert("inside negitive");
			}
		}
		else if(status == "positive")
		{
				tray_count++;
		//		clearInterval(allLeaderSessionsID);
		//		allLeaderSessionsID = null;
				//alert("inside positive")
		}
	}
	function clearTimers(status)
	{
		if(status == "login")
		{
			tray_count = 0;
			//clearInterval(GetRecentBlastsCount);
			clearInterval(timer_recent_blasts);
			clearInterval(timer_blasts_count);
			timer_blasts_count=null;
			timer_recent_blasts=null;
			clearTimers("follower_list");
			clearTimers("get_url");
		}
		else if(status == "follower_list")
		{
			clearInterval(timer_follower_list);
			timer_follower_list=null;
		}
		else if(status == "get_url")
		{
			clearInterval(timer_get_url);
			timer_get_url=null;
		}
	}
	
	function cbFollow(doc,index)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			chrome.tabs.create({url:"about:blank"});
			//bug fix to close popup
			chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.update(tab.id, { selected: true } )
			});
			fLeaderSessionKey=doc.getElementsByTagName("leader_session_key")[0].childNodes[0].nodeValue;
			follow_blast_id=index;
			follower_session_key=doc.getElementsByTagName("follower_session_key")[0].childNodes[0].nodeValue;
			setTimers("get_url");
			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
				popups[0].startFollow();
			showFollowerIcon();
		
		}
		else
		{
			//showFollowerIcon();
			removeDivBlast(index);
			showLoginIcon();
			var error = errorAlerts.getErrorMessage(doc);
			alert(error);
		}
		follow_inprogress=false;
	}
	
	function searchClick(index,show_reply)
	{
		if(!blastResults)
			return;
		var session=blastResults.getElementsByTagName("blast");
	    for(var i = 0; i < session.length; i++)
		{

			if(session[i].getElementsByTagName("blast_id")[0].childNodes[0].nodeValue==index.toString())
			{

				if(session[i].getElementsByTagName("live_session")[0])
				{
					if(show_reply)
					{
						showConversationScreen(true);
						GetBlastReplies(index);
						return;
					}
					else if(fLeaderSessionKey=="")
					{
						if(follow_inprogress==false && leaderSessionKey=="" && session[i].getElementsByTagName("from_covu_id")[0].childNodes[0].nodeValue!=leader_id)
						{
							var pl = new RestClientParameters();
							pl.add("login_session_key",login_session_key);
							pl.add("leader_covu_id",session[i].getElementsByTagName("from_covu_id")[0].childNodes[0].nodeValue);
							pl.add("leader_id_type","covu");
							pl.add("leader_session_key",session[i].getElementsByTagName("key")[0].childNodes[0].nodeValue);
							invoke(urlAPI, "Follow", pl, cbFollow,index);
							follow_inprogress=true;
							return;
						}
						else
						{
							return;
						}
					}
					else if(fLeaderSessionKey==index.toString())
					{
						CloseFollowerSession();
						return;
					}
				}
				else if(session[i].getElementsByTagName("type")[0].childNodes[0].nodeValue=="link" || session[i].getElementsByTagName("type")[0].childNodes[0].nodeValue=="ppt")
				{
					if(fLeaderSessionKey!="")
						return;
					if(show_reply)
					{
						showConversationScreen(true);
						GetBlastReplies(index);
					}
					else
					{
						var value=session[i].getElementsByTagName("content")[0].childNodes[0].nodeValue;
						chrome.tabs.create({url:"about:blank"});
						chrome.tabs.getSelected(null, function(tab) 
						{
							chrome.tabs.update(tab.id,{url:value});
						});

					}
				}
				else if(session[i].getElementsByTagName("type")[0].childNodes[0].nodeValue=="message")
				{
					showConversationScreen(true);
					GetBlastReplies(index);
				}					
			}
		}
	}
	
	function isUrl(s) {
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		return regexp.test(s);
	}
	
	function showConversationScreen(show)
	{
		if(show)
		{
			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
				popups[0].showConversationScreen(true);
		}
		
	}
	function removeBlastDiv(id)
	{
		if(blastResults)
		{
			var blast = blastResults.getElementsByTagName("blast");
			for(var i = 0; i < blast.length; i++)
			{
				blast_id = blast[i].getElementsByTagName("blast_id")[0].childNodes[0].nodeValue;
				if(blast_id==id)
				{
					blast[i].parentNode.removeChild(blast[i]);
					var popups = chrome.extension.getViews({type: "popup"});
					if(popups.length)
						popups[0].contentView(blastResults);
					return 0;
				}
			}
		}
		
	}
	function cbGetBlastReplies(doc,blast_id)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			blast_replies=doc;
			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
				popups[0].conversationView(doc,blast_id);
		}
		else
		{
		//	getRecentBlasts();
			historyManager.reset();
			removeBlastDiv(blast_id);
			var error = errorAlerts.getErrorMessage(doc);
			
			alert(error);
		}	
	}
	
	function GetBlastReplies(blast_id)
	{
		var pl = new RestClientParameters();
		pl.add("login_session_key",login_session_key );
		pl.add("blast_id",blast_id );
		invoke(urlAPI, "GetBlastReplies", pl, cbGetBlastReplies,blast_id);
	}
	function cbResetPassword(doc)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
				popups[0].showSucessfulReset();
		}
		else
		{
			var error = errorAlerts.getErrorMessage(doc);
			alert(error);
		}	
	}
	
	function resetPassword(email)
	{
		var pl = new RestClientParameters();
		pl.add("email",email );
		invoke(urlAPI, "RequestPasswordReset", pl, cbResetPassword);
	}
	
	
	
	function getRecentBlasts(){
		var popups = chrome.extension.getViews({type: "popup"});
		if(popups.length)
		{
		}
		else
		{
			blast_limit=30;
		}
		var pl = new RestClientParameters();
		if(search_id=="")
		{
			pl.add("stream","everyone");	
		}
		else if(leader_id==search_id)
		{
			pl.add("stream","my");
		}
		else
		{
			pl.add("stream","friend");
			pl.add("friend_covu_id", search_id);
		}
		search_history[search_id]=search_id;
		pl.add("login_session_key",login_session_key);
		pl.add("limit",blast_limit);
		
		var date=new Date();
		invoke(urlAPI, "GetRecentBlasts", pl, cbgetRecentBlasts,search_id,date.getTime());
	}
	
	function getLocalBlasts (search_value)
	{
		
		var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
			{
				
				popups[0].getLocallyblast(search_value);
			}
	}
	
	function hideBadge() 
	{
	//	if(new_blast_count!="0")
	//		getRecentBlasts();
		new_blast_count=0;
		new_request_count=0;
		new_approvals_count=0;
        chrome.browserAction.setBadgeText({ text: "" });
    }

    function showBadge(txt) 
	{
        chrome.browserAction.setBadgeBackgroundColor({color:[236,0,0,255]});
        chrome.browserAction.setBadgeText({ text: txt.toString() });
    }
	function playSound()
	{
		if(localStorage["sound"]!="false")
		{	
			var snd = new Audio("img/Laser.m4a");
			snd.play();
		}
	
	}
	function cbGetRecentBlastsCount(doc,time)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			if(login_session_key=="")
			{
				return;
			}
			//if(time==last_seen_blast_time)
				var count=parseInt(doc.getElementsByTagName("blasts")[0].childNodes[0].nodeValue);
				var friend_request_count=parseInt(doc.getElementsByTagName("friendship_requests")[0].childNodes[0].nodeValue);
				var friend_approvals_count=parseInt(doc.getElementsByTagName("friendship_approvals")[0].childNodes[0].nodeValue);
			//	counts_updated_at=doc.getElementsByTagName("counts_updated_at")[0].childNodes[0].nodeValue;
				var total_count=count+friend_request_count+friend_approvals_count;

				if(count!=new_blast_count)
				{
					new_blast_count=count;
					if(new_blast_count!=0)
					{
						var popups = chrome.extension.getViews({type: "popup"});
						if(popups.length)
						{
							try{
								if(popups[0].id("screen_home").style.display == 'block')
								{
									getRecentBlasts();
								}
							}
							catch(e)
							{
							}
						}
						playSound();
						
					}
					
					//getRecentBlasts();

				}
				else if(friend_request_count!=new_request_count)
				{
					
					if(friend_request_count>new_request_count)
					{
						playSound();
						getFriends();
						
					}
					else
					{
						getFriends();
					}
					
				//	updateNotifications(total_count);
				}
				else if(friend_approvals_count!=new_approvals_count)
				{

					if(friend_approvals_count>new_approvals_count)
					{
						getFriends();
						playSound();
					
					}
					
		//			updateNotifications(total_count);
				}
				new_blast_count=count;
				new_request_count=friend_request_count;
				new_approvals_count=friend_approvals_count;
				updateNotifications(total_count);

		}
		
	}
	
	function GetRecentBlastsCount()
	{
		showErrorAlert=true;
		if(!last_seen_blast_time)
		{
			if(blastResults)
			{
				var blast = blastResults.getElementsByTagName("blast");
				if(blast.length>0 && search_id=="")
				{
					last_seen_blast_time = blast[0].getElementsByTagName("updated_at")[0].childNodes[0].nodeValue;

				}
			}
		}
		if(login_session_key !="")			
		{
			var pl = new RestClientParameters();
			pl.add("login_session_key",login_session_key);
			invoke(urlAPI, "GetNotificationCounts", pl, cbGetRecentBlastsCount,'notification');
		}
	}
	function updateNotifications(count)
	{
		if(count!=0 && count<=99)
		{
			showBadge(count);
		}
		if(count>99)
		{
			showBadge('99+');
		}
		else if(count==0)
		{
			hideBadge();
		}
		var popups = chrome.extension.getViews({type: "popup"});
		if(popups.length)
			popups[0].showNotification();
	}
	function setBlastUpdateTime(view)
	{
		if(search_id=="")
		{
			var blast = blastResults.getElementsByTagName("blast");
				
			for(var i = 0; i < blast.length; i++)
			{
				if(view)
				{
					date = blast[i].getElementsByTagName("updated_at")[0].childNodes[0].nodeValue;
					prev_update_time=new Date(date);
					recent_update_time=new Date(date);
				}
				else
				{
					date = blast[i].getElementsByTagName("updated_at")[0].childNodes[0].nodeValue;
					prev_update_time=recent_update_time;
					recent_update_time=new Date(date);
				}
				break;
			}
		}
			
	}
	function cbgetRecentBlasts(doc,pid,time){
		
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		
		if(r==0)
		{
			if(pid!=search_id)
				return;
			if(previousTime==0 || previousTime<time)
			{
				previousTime=time;
			}
			else 
			{
				return;
			}
			blastResults=doc;

			//updateNotifications(new_blast_count);
			//GetRecentBlastsCount();
			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
				popups[0].contentView(doc);
				
		}
		else
		{
			
			if(login_session_key=="")
			{
				clearTimers('login');
				return;
			}
			search_id="";
			sessionResults=null;
		}
		
	}
	
	
	function getFriends(){
		
		var pl = new RestClientParameters();
		pl.add("login_session_key",login_session_key);
		pl.add("invitations",'true');
		invoke(urlAPI,"GetMemberDetails",pl,cbGetFriends);
	}
	function getMemberInfo(doc){
		var city='';
		var phone='';
		try
		{
			profileScreen.location=doc[0].getElementsByTagName('city')[0].childNodes[0].nodeValue;
		}
		catch(e)
		{
			
		}
		try
		{
			
			profileScreen.covu_id=doc[0].getElementsByTagName('covu_id')[0].childNodes[0].nodeValue;
			profileScreen.first_name=doc[0].getElementsByTagName('first_name')[0].childNodes[0].nodeValue;
			profileScreen.last_name=doc[0].getElementsByTagName('last_name')[0].childNodes[0].nodeValue;
			profileScreen.email_id=doc[0].getElementsByTagName('email')[0].childNodes[0].nodeValue;	
			profileScreen.avatar=doc[0].getElementsByTagName('avatar')[0].childNodes[0].nodeValue;
			
		}
		catch(e)
		{
			
		}
		try
		{
			profileScreen.phone=doc[0].getElementsByTagName('phone')[0].childNodes[0].nodeValue;
		}
		catch(e)
		{
			
		}
		try
		{
			profileScreen.admin=doc[0].getElementsByTagName('admin')[0].childNodes[0].nodeValue;	
		}
		catch(e)
		{
			
		}
	}
	function getFriendsInfo(friend_id)
	{
		var my_friends=[];

		if(friend_id)
		{
			for(var i=0;i<friend_id.length;i++)
			{
				try{
					my_friends.push({"name": friend_id[i].getElementsByTagName("name")[0].childNodes[0].nodeValue, "covu_id": friend_id[i].getElementsByTagName("covu_id")[0].childNodes[0].nodeValue, "has_avatar": friend_id[i].getElementsByTagName("has_avatar")[0].childNodes[0].nodeValue});
				}
				catch(e)
				{
					
				}
			}
		}
		peopleScreen.setFriends(my_friends);
	}
	
	function getFriendsRequest(friend_id)
	{
		var friend_requests=[];
		friend_id=friend_id[0].getElementsByTagName("invitation");
		if(friend_id)
		{
			for(var i=0;i<friend_id.length;i++)
			{
				try{
					friend_requests.push({"name": friend_id[i].getElementsByTagName("name")[0].childNodes[0].nodeValue, "covu_id": friend_id[i].getElementsByTagName("covu_id")[0].childNodes[0].nodeValue,"has_avatar":friend_id[i].getElementsByTagName("has_avatar")[0].childNodes[0].nodeValue});
				}
				catch(e)
				{
					
				}
			}
		}
		peopleScreen.setFriendsRequests(friend_requests);
	}
	function getFriendsSentRequest(friend_id)
	{
		var sent_requests=[];
		friend_id=friend_id[0].getElementsByTagName("invitation");
		if(friend_id)
		{
			for(var i=0;i<friend_id.length;i++)
			{
				try{
					sent_requests.push({"name": friend_id[i].getElementsByTagName("name")[0].childNodes[0].nodeValue, "covu_id": friend_id[i].getElementsByTagName("covu_id")[0].childNodes[0].nodeValue,"has_avatar":friend_id[i].getElementsByTagName("has_avatar")[0].childNodes[0].nodeValue});
				}
				catch(e)
				{
					
				}
			}
		}
		peopleScreen.setFriendsSentRequests(sent_requests);
	}
	
	function getDashboardDetails(){
		var pl = new RestClientParameters();
		pl.add('login_session_key',login_session_key);
		invoke(urlAPI,'GetMemberDetails',pl,cbgetDashboardDetails);
	}
	
	function cbgetDashboardDetails(doc){
		var popups = chrome.extension.getViews({type: "popup"});
		var success = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(success == 0){
				popups[0].create_dashboard_content(doc);	
		}
	}
	
	function getGroupsForDashboard(){
		var pl = new RestClientParameters();
		pl.add('login_session_key',login_session_key);
		invoke(urlAPI,'SearchGroups',pl,cbgetGroupsForDashboard);
	}
	
	function cbgetGroupsForDashboard(doc){
		var popups = chrome.extension.getViews({type: "popup"});
		var success = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(success == 0){
				popups[0].create_dashboard_content(doc);
		}
	}
	
	function cbGetFriends(doc){
		var popups = chrome.extension.getViews({type: "popup"});
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			//friend_list=doc;
			friend_list=[];
			getMemberInfo(doc.getElementsByTagName("member"));
			friend_id=doc.getElementsByTagName("friend");
			getFriendsInfo(doc.getElementsByTagName("friend"));
			var index=0;
			if(friend_id)
			{
				for(var i=0;i<friend_id.length;i++)
				{
					try{
						friend_list.push({"name": friend_id[i].getElementsByTagName("name")[0].childNodes[0].nodeValue, "covu_id": friend_id[i].getElementsByTagName("covu_id")[0].childNodes[0].nodeValue, "has_avatar": friend_id[i].getElementsByTagName("has_avatar")[0].childNodes[0].nodeValue});
					}
					catch(e)
					{
						
					}
					//friend_list[i]="\""+friend_id[i].getElementsByTagName("name")[0].childNodes[0].nodeValue+ "\", "+friend_id[i].getElementsByTagName("covu_id")[0].childNodes[0].nodeValue;
					index++;
				}
				
			}
			friend_id=doc.getElementsByTagName("group");
			
			if(friend_id)
			{
				for(var i=0;i<friend_id.length;i++)
				{
					try{
					friend_list.push({"name": friend_id[i].getElementsByTagName("name")[0].childNodes[0].nodeValue, "covu_id": friend_id[i].getElementsByTagName("covu_id")[0].childNodes[0].nodeValue,"has_avatar": "false"});
					}
					catch(e)
					{
						
					}
					//friend_list[index]="\""+friend_id[i].getElementsByTagName("name")[0].childNodes[0].nodeValue+ "\", "+friend_id[i].getElementsByTagName("covu_id")[0].childNodes[0].nodeValue;
					index++;
				}
			
			}
			

			
			friend_id=doc.getElementsByTagName("received_invitations");

			getFriendsRequest(friend_id);		
			
			friend_id=doc.getElementsByTagName("sent_invitations");

			getFriendsSentRequest(friend_id);
			private_profile=doc.getElementsByTagName("private")[0].childNodes[0].nodeValue;
			
			
			if(popups.length)
			{

					popups[0].loadPeopleInfo();
					popups[0].setProfileInfo();
					popups[0].manageAutoFill();
			}
		}
		else
		{
			var error = errorAlerts.getMemberDetails(doc);
			alert(error);
		}
	}
	function rememberUserInfo(id,pwd,bRemember)
	{
		if(bRemember)
		{
			var d = new Date();
			chrome.cookies.set({url:covu_signin_page,name:'app_login_session_key', value: initial_login_session_key, expirationDate : (d.getTime()/1000)+(7*24*3600)}, function (cook){})
			
			localStorage["user_name"]=id;
			localStorage["password"]=pwd;
		}
	}
	function showNotification(message) 
	{
	
		var notification = webkitNotifications.createNotification(
		  'icon.png',                      // The image.
		  "CoVu: Alert", // The title.
		  message      // The body.
		);
		notification.show();
		setTimeout(function(){notification.cancel();},2000)
		
  	}
  	
  	function cbLoginByKey(doc)
  	{
  		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0 )
		{
			getPPTUploadToken();
			leader_id=doc.getElementsByTagName("covu_id")[0].childNodes[0].nodeValue;
			initial_login_session_key=doc.getElementsByTagName("login_session_key")[0].childNodes[0].nodeValue;
			default_image=doc.getElementsByTagName("default_images")[0].childNodes[0].nodeValue;
			member_images=doc.getElementsByTagName("member_images")[0].childNodes[0].nodeValue;		
			if(doc.getElementsByTagName("has_avatar")[0].childNodes[0].nodeValue=="true")
			{
				profile_image_url=member_images+"/"+leader_id+".png";
			}
			else
			{
				profile_image_url= default_image+"/"+"avatar.png";
			}
			registerClient();		
		}
		else
		{
			login_in_progress=false;
			var error=errorAlerts.login(doc);
			var popups = chrome.extension.getViews({type: "popup"});
			clearSession();
			deleteCookie();
			alert(error);
		}
  	}
	function cbLogIn(doc,type,id,pwd,bRemember)
	{
	
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0 && leader_id==id)
		{
			getPPTUploadToken();

			initial_login_session_key=doc.getElementsByTagName("login_session_key")[0].childNodes[0].nodeValue;
			default_image=doc.getElementsByTagName("default_images")[0].childNodes[0].nodeValue;
			member_images=doc.getElementsByTagName("member_images")[0].childNodes[0].nodeValue;		
		//	showAvatar();
			if(doc.getElementsByTagName("has_avatar")[0].childNodes[0].nodeValue=="true")
			{
				profile_image_url=member_images+"/"+leader_id+".png";
				//id("profilePic").src=member_images+"/"+leader_id+".png";
			}
			else
			{
				profile_image_url= default_image+"/"+"avatar.png";
				//id("profilePic").src=default_image+"/"+"avatar.png";
			}
			password=pwd;
			rememberUserInfo(id,pwd,bRemember);
			registerClient();		
		}
		else
		{
			clearUserInfo();
			login_in_progress=false;
		//	var code = doc.getElementsByTagName("error")[0];
			var error=errorAlerts.login(doc);
	//		var code=parseInt(error);

			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
			{
				popups[0].showSignInScreen(true,error);
			}
			else
			{
				alert(error);
			}
		}
	}
	function logIn(id,pwd,remember)
	{
		clearSession();
		if(id=="" || pwd =="")
		{
			alert("You have left some of your login information blank. Please enter your CoVu ID and password, and then hit Submit.");
		}
		else
		{
			login_in_progress=true;
			leader_id=id;

			var pl = new RestClientParameters();
			pl.add("login_id",id );
			pl.add("login_id_type","covu" );
			pl.add("password",pwd);
			invoke(urlAPI, "Login", pl, cbLogIn,"login",leader_id,pwd,remember);
		}
	}
	function loginByKey(key)
	{
		clearSession();
		keep_switching_icon=true;
		rotateIcon();
		
		login_in_progress=true;
		var pl = new RestClientParameters();
		pl.add("login_session_key",key );
		invoke(urlAPI, "Login", pl, cbLoginByKey,"login");
	}
	function cbCreateMember(doc)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			//var popups = chrome.extension.getViews({type: "popup"});
			logIn(member_id,password,true);
			alert("Your account has been created successfully");
			new_member = true;
			//if(popups.length)
				//popups[0].showSignIn();
			//alert("created");
		}
		else
		{
			var error=errorAlerts.signUp(doc)
			alert(error);
		}
	}
	
	function signUp(id,privacy,pwd,confirm_pwd,first_name,last_name,email)
	{
		member_id=id;
		password=pwd;
	    var pl = new RestClientParameters();
		pl.add("covu_id",id );
		pl.add("covu_id_privacy",privacy );
		pl.add("password",pwd );	
		pl.add("password_confirmation",confirm_pwd);
		pl.add("first_name",first_name );
		pl.add("last_name",last_name );
		pl.add("email",email );	
		invoke(urlAPI, "CreateMember", pl, cbCreateMember);
	}
	function cbCloseLeaderSession(doc)
	{
		var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
				popups[0].document.getElementById('leadInfoBox').style.display='none';
				
		getRecentBlasts();
	}
	
	function closeLeaderSession()
	{
		clearTimers("follower_list");
		var pl = new RestClientParameters();
		pl.add("login_session_key",login_session_key  );
		pl.add("leader_session_key",leaderSessionKey );
		leaderSessionKey="";
		follower=null;
		followerCount=0;
		invoke(urlAPI, "CloseLeaderSession", pl, cbCloseLeaderSession);
		showLoginIcon();
	}
	
	function cbsendUrl(doc)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
		
		}
		else
		{
			var error = errorAlerts.getErrorMessage(doc);
			alert(error);
		}
	}
	
	function sendUrl(newUrl)
	{
	//api is not accepting null url
		if(newUrl=="")
		{
			newUrl="about:blank";
		}
		
		var pl = new RestClientParameters();
		pl.add("leader_session_key",leaderSessionKey );
		newUrl=escape(newUrl);
		pl.add("url",newUrl );		
		pl.add("login_session_key",login_session_key  );
		invoke(urlAPI, "SetLeaderSessionUrl", pl, cbsendUrl);
	}
	
	function send_Blast(message,recipient,type,is_live,reply_blast_id)
	{
	
		var pl = new RestClientParameters();
		pl.add("login_session_key",login_session_key);
		
		
		if(type=="message")
		{
			link_title="Live Blast with /"+leader_id;
			pl.add("content",encodeData(message));
			pl.add("title",encodeData(link_title));
		}
			
		pl.add("type",type);
		
		
		if(reply_blast_id)
		{
			pl.add("reply_to_blast_id",reply_blast_id);
		}
		//pl.add("memo",blast_message);
		if(type=="link" || type=="ppt")
		{
			if(!isUrl(link_url))
				link_url="http://"+link_url;
			pl.add("content",escape(link_url));
			pl.add("memo",encodeData(blast_message));
			pl.add("title",encodeData(link_title));
		}
		recipient=recipient.split(' ').join('');
		recipient=recipient.split(",");
		var rec=new Array();
		
		for(var i=0;i<recipient.length;i++)
		{
			rec[recipient[i]]="xxx"+recipient[i];
		}
		
		for (var p in rec) 
		{
			pl.add("recipient[]",encodeData(p));
		}
		sessionName=link_title;
		pl.add('live',is_live)
		invoke(urlAPI, "SendBlast", pl, cbSendBlast,reply_blast_id);
	}
	
	function cbSendBlast (doc,id)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			if(id)
			{

				searchClick(id,true);
			}
			else
			{
				try{
					leaderSessionKey=doc.getElementsByTagName("key")[0].childNodes[0].nodeValue;
					//getRecentBlasts();
					chrome.tabs.getSelected(null,function(tab) {
					var tablink = tab.url;
					sendUrl(tablink);
					setTimers("follower_list");
					var popups = chrome.extension.getViews({type: "popup"});
					if(popups.length)
						popups[0].showLead();
						
					showLeaderIcon();
					});	
				}
				catch(e)
				{
					
				}
				getRecentBlasts();
			}
		}
		else
		{
		
			var error = errorAlerts.sendBlast(doc);
			alert(error);
		}
	}
	
	function cbGetLeaderSessionFollowers(doc)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			follower=doc.getElementsByTagName("follower");
			followerCount=follower.length;
			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
				popups[0].activeFollowers();
		}
		else
		{
			closeLeaderSession();
			//Logout();
			var error = errorAlerts.getErrorMessage(doc);
			alert(error);
		}
	}
	
	function GetLeaderSessionFollowers()
	{
		var pl = new RestClientParameters();
		pl.add("login_session_key",login_session_key  );
		pl.add("leader_session_key",leaderSessionKey );
		invoke(urlAPI, "GetLeaderSessionFollowers", pl, cbGetLeaderSessionFollowers);
	}
	
	function cbLead(doc)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			leaderSessionKey=doc.getElementsByTagName("leader_session_key")[0].childNodes[0].nodeValue;
			getRecentBlasts();
			chrome.tabs.getSelected(null,function(tab) {
			var tablink = tab.url;
			sendUrl(tablink);
			setTimers("follower_list");
			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
				popups[0].showLead();
				
			showLeaderIcon();
			});			
		}
		else
		{
			var error = errorAlerts.getErrorMessage(doc);
			alert(error);
		}
	}
	
	function DeleteBlast()
	{
	//	r=confirm("Are you sure to Delete this blast");
	//	if(r)
		{
			var pl = new RestClientParameters();
			pl.add("login_session_key",login_session_key);
			pl.add("blast_id",blast_key);
			invoke(urlAPI, "DeleteBlast", pl,cbDeleteBlast,blast_key);
			removeBlastDiv(blast_key);
		}
	}
	
	function cbDeleteBlast(doc,blast_key)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
		/*	removeBlastDiv(blast_key);
						var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
				popups[0].contentView(blastResults);*/
		}
		else
		{
			alert("Server was unable to Delete your blast");
		}
	}
	
	function encodeData(value)
	{
	//	value=value.split('&').join('&amp;');
	//	value=$('<div/>').text(value).html();
		return encodeURIComponent(value);
	}
	
	function Lead(session_Name,recipient,notes)
	{
		sessionName=session_Name;
		var pl = new RestClientParameters();	
		pl.add("login_session_key",login_session_key  );
		pl.add("session_name",encodeData(sessionName) );
		pl.add("session_type","web");
		pl.add("notes",encodeData(notes));
		//followers=followers.split(",");
		
		recipient=recipient.split(' ').join('');
		recipient=recipient.split(",");
		var rec=new Array();
		
		for(var i=0;i<recipient.length;i++)
		{
			rec[recipient[i]]="xxx"+recipient[i];
		}
		
		for (var p in rec) 
		{
			pl.add("follower[]",encodeData(p));
		}
	/*	for(var i=0;i<followers.length;i++)
		{
			pl.add("follower[]", encodeData(followers[i]));
		}*/
		invoke(urlAPI, "Lead", pl, cbLead);
	}
	
	function cbLogout(doc)
	{
		peopleScreen.clearSearch();
	}
	function deleteCookie()
	{
		try{
			chrome.cookies.remove({url:covu_signin_page,name:'app_login_session_key'});
		}
		catch(e){
				
		}
	}
	function Logout()
	{
		//var bool = confirm("Are you sure you want to log out?");
		//if(bool)
		
			deleteCookie();
			if(leaderSessionKey!="")
			{
				closeLeaderSession();
			}
			
			if(follower_session_key!="")
			{
				CloseFollowerSession();
			} 
			
			clearTimers("login");
			var pl = new RestClientParameters();
			pl.add("login_session_key",login_session_key );
			invoke(urlAPI, "Logout", pl, cbLogout);
			login_session_key="";
			clearSession();
			showNormalIcon();
			clearUserInfo();
		
	}
	
	function followClosed()
	{
		var popups = chrome.extension.getViews({type: "popup"});
		if(popups.length)
		{
			if(followAction=="HOME")
				popups[0].onHomeButton();
			else if(followAction=="MEDIA")
				popups[0].showAddMediaURL(true);
			else if(followAction=="Logout")
				Logout();
			else if(followAction=="Lead")
				popups[0].submitLead();	
			else if(followAction=="SEARCH")
				popups[0].onSearchButton();	
		}
	}
	
	function closeFollow(type,search)
	{
		if(fLeaderSessionKey=="")
			return true;
		var r=confirm("You are now leaving a live session. Please confirm.");
		if (r==true)
		{
		/*	if(search!="")
			{
				search_id=search;
				getRecentBlasts(search_id);
			}
			followAction=type;*/
			CloseFollowerSession();

		
			return true;
		}
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.update(tab.id, { selected: true } )
		});
		return false;
	}
	
	function cbCloseFollowerSession(doc)
	{
		//showLoginIcon();
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
		/*	clearTimers("get_url");
			follower_session_key="";
			fLeaderSessionKey="";
			intervalID=null;
			showLoginIcon();
			followClosed();*/
		}
		else
		{
		//	var error = doc.getElementsByTagName("error")[0].childNodes[0].nodeValue;
		//	alert(error);
		}
		bCommandCompleted=true;
	}
	
	function CloseFollowerSession()
	{
		if(bCommandCompleted)
		{
			bCommandCompleted=false;
			clearTimers("get_url");

			showLoginIcon();
			var pl = new RestClientParameters();
			pl.add("login_session_key",login_session_key  );
			pl.add("follower_session_key",follower_session_key );
			invoke(urlAPI, "CloseFollowerSession", pl, cbCloseFollowerSession);
			follower_session_key="";
			prevUrl="";
			fLeaderSessionKey="";
		}

	}
	
	function OpenUrl(doc)
	{
		try
		{
			var r=doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
			if(r==0)
			{
			
		//			clearInterval(intervalID);
				var r=decodeURIComponent(doc.getElementsByTagName("url")[0].childNodes[0].nodeValue);
				if(r==prevUrl)
					return;
				prevUrl=r;
				chrome.tabs.getSelected(null, function(tab) 
				{
					chrome.tabs.update(tab.id,{url:r});
				});
			}
			else
			{
				var error = errorAlerts.getErrorMessage(doc);
				clearTimers("get_url");
				//clearInterval(intervalID);
				//intervalID=null;
				if(fLeaderSessionKey!="")
					alert(error);
				fLeaderSessionKey="";
				follower_session_key="";
				showLoginIcon();
				removeBlastDiv(follow_blast_id);
			}
		}
		catch(e)
		{
		}		
	}
	
	function GetUrl()
	{
		var pl = new RestClientParameters();
		pl.add("login_session_key",login_session_key  );
		pl.add("leader_session_key",fLeaderSessionKey );
		invoke(urlAPI, "GetLeaderSessionUrl", pl, OpenUrl);
	}
               

function rotateIcon2()
{              
	try{
      chrome.browserAction.setIcon({ path: searching_images2[image_index2]});
      if(image_index2==searching_images2.length-1)
      	return;
      	image_index2++;
      window.setTimeout(rotateIcon2, 30);
	}
	catch(e)
	{
		chrome.browserAction.setIcon({ path: 'icon.png'});
	}
}
function rotateIcon()
{              
   if ( keep_switching_icon )
   {
      chrome.browserAction.setIcon({ path: searching_images[image_index]});
      image_index = (image_index + 1) % searching_images.length;
      window.setTimeout(rotateIcon, 300);
   }
   else if(login_session_key=='')
   {
   	 	showNormalIcon();
   }
}
 function rotatLogin()
 {
 		rotateIcon2();
 }
	function showLoginIcon()
	{
		keep_switching_icon=false;
		window.setTimeout(rotatLogin, 300);

	//	chrome.browserAction.setIcon({ path: "img/rr.gif" });
	}
	
	function showNormalIcon() 
	{
        chrome.browserAction.setIcon({ path: "loggedout.png" });
    }
	
	function showFollowerIcon() 
	{
        chrome.browserAction.setIcon({ path: "img/following.png" });
    }
	
	function showLeaderIcon() 
	{
        chrome.browserAction.setIcon({ path: "img/leading.png" });
    }	
	function registerClient()
	{
		var pl = new RestClientParameters();
		pl.add("login_session_key",initial_login_session_key);
		pl.add("platform","chrome"  );
		pl.add("hardware_id",getHardwareID()  );
		pl.add("platform_model",navigator.platform );
		pl.add("device_token",getDeviceToken() );
		pl.add("platform_version_number",navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);
		pl.add("app_version",chrome.app.getDetails().version);
		pl.add("badges_enabled",true);
		pl.add("sounds_enabled",true);
		pl.add("alerts_enabled",true);
		pl.add("led_enabled",true);
		invoke(urlAPI,"RegisterClient",pl,cbRegisterClient,'login');
	}
	function cbRegisterClient(doc)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			
			//client_id=doc.getElementsByTagName("client_id")[0].childNodes[0].nodeValue;
			login_session_key=initial_login_session_key;
			groupScreen.init();
			groupScreen.GetNetworks();
			getFriends();
			setTimers("login");
			login_in_progress=false;
			showLoginIcon();
			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
			{
					popups[0].showLogin();
			}
		}
		else
		{

			//var error = doc.getElementsByTagName("error")[0].childNodes[0].nodeValue;
			deleteCookie();
			clearSession();

			clearLocalStorage();
			alert(errorAlerts.registerClient(doc));
		}
	}
	
	function clearLocalStorage()
	{
		localStorage.removeItem('hardware_id');
		localStorage.removeItem('device_token');
	}
	function clearUserInfo()
	{
		localStorage.removeItem('user_name');
		localStorage.removeItem('password');		
	}
	function getUserName()
	{
		if(localStorage['user_name'])
			return localStorage['user_name'];
		return "";
	}
	function getPassword()
	{
		if(localStorage['password'])
			return localStorage['password'];
		return "";
	}
	function cbGenerateDeviceUUIDs(doc)
	{	
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			var r=doc.getElementsByTagName("hardware_id")[0].childNodes[0].nodeValue;
			localStorage['hardware_id']=r;
			r=doc.getElementsByTagName("device_token")[0].childNodes[0].nodeValue;
			localStorage['device_token']=r;
		}
		else
		{
			var error = errorAlerts.getErrorMessage(doc);
			alert(error);
		}
	}
	
	function GenerateDeviceUUIDs()
	{
		var pl = new RestClientParameters();
		invoke(urlAPI, "GenerateDeviceUUIDs", pl, cbGenerateDeviceUUIDs);
	}
	function getHardwareID()
	{
		return localStorage['hardware_id'];
	}
	function getDeviceToken()
	{
		return localStorage['device_token'];
	}
	function getUUID()
	{
		if(!localStorage['hardware_id'])
		{
			GenerateDeviceUUIDs();
		}
		else
		{
			//return localStorage['hardware_id'];
		//	if(localStorage['user_name']&& localStorage['password'])
		//		logIn(localStorage['user_name'],localStorage['password'],true);
		}
	}
	
	function getBlastCount()
	{
		if(blastResults)
		{
			return blastResults.getElementsByTagName("blast").length;
		}
		return 0;
	}
	function cbUpdateProfile(doc)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			getFriends();
			if(getProfilePrivate())
				private_profile="flase";
			else
				private_profile="true";
				
			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
			{
					popups[0].document.getElementById('privacy_content').style.display='block';
					popups[0].document.getElementById('save_privacy').style.display='none';
			}
		}
		else
		{
			var error = errorAlerts.getErrorMessage(doc);
			alert(error);
		}
	}
	function updateProfileImage(form)
	{
		var formElement =new FormData( form);
		var pl = new RestClientParameters();
		pl.add("login_session_key",login_session_key);
		//pl.add("avatar",profileScreen.avatar_file);
		
		invokePOST(urlAPI,"UpdateProfile",pl,cbUpdateProfile,formElement);
	}
	function UpdateProfile(make_private)
	{
		var pl = new RestClientParameters();
		pl.add("login_session_key",login_session_key);
		pl.add("private",make_private);
		
		invokePOST(urlAPI,"UpdateProfile",pl,cbUpdateProfile);
	}
	function saveSoundOption(enable_sound)
	{
		localStorage["sound"]=enable_sound;
	}
	function toggleSound(enable_sound)
	{
		saveSoundOption(enable_sound);
	}
	function get_OMLInvocationURL(proto)
	{
			if(proto=="https:")
				return "https://"+urlAPI+"/InvokeOML.js?login_session_key="+login_session_key;
			else
				return "http://"+urlAPI+"/InvokeOML.js?&login_session_key="+login_session_key;
	}
	
	function get_LeaderEvents()
	{
		if(login_session_key!=""&& fLeaderSessionKey!="")
		{
			return "http://"+urlAPI+"/GetLeaderSessionLastClick.json?leader_session_key="+fLeaderSessionKey ;
		}
		else
			return false;
	}
	
	function get_MouseClickURL()
	{
		if(login_session_key!=""&& leaderSessionKey!="")
		{
			return "http://"+urlAPI+"/RecordMouseClick.json?leader_session_key="+leaderSessionKey  + "&login_session_key="+login_session_key;
		}
		else
			return false;
	}
	function getProfilePrivate()
	{
		if(private_profile=="true")
		{
			return true;
		}
		return false;
	}
	function getSoundEnable()
	{
		if(localStorage["sound"]!="false")
		{
			return true;
		}
		return false;
	}
	function cbBreakFriendship()
	{
	}
	function BreakFriendship(covu_id)
	{
		var pl = new RestClientParameters();
		pl.add("login_session_key",login_session_key);
		pl.add("friend_covu_id",covu_id);
		
		invoke(urlAPI,"BreakFriendship",pl,cbBreakFriendship);
	}
	function cbAcceptFriendship()
	{
		getFriends();
	}
	function AcceptFriendship(covu_id)
	{
		var pl = new RestClientParameters();
		pl.add("login_session_key",login_session_key);
		pl.add("friend_covu_id",covu_id);
		
		invoke(urlAPI,"AcceptFriendship",pl,cbAcceptFriendship);
	}
	 chrome.cookies.onChanged.addListener(function(info)
	 {
	 //	if(info.cookie['name']=='app_login_session_key' && info.cause=='explicit')
	 //		getCookie();
	 });

	chrome.extension.onRequest.addListener(function (request, sender, sendResponse) 
	{
		if(request.sendUrl)
		{
			if(leaderSessionKey!="")
				sendUrl(request.sendUrl);
			sendResponse({});
		}
		if(request.getOMLURL)
		{
				sendResponse({result: get_OMLInvocationURL(request.getOMLURL)});
		}
		if(request.msg=='getMouseClickUrl')
		{
			sendResponse({result: get_MouseClickURL()});
		}
		if(request.msg=='GetLeaderSessionLastClick')
		{
			sendResponse({result: get_LeaderEvents(),page_url: prevUrl});
		}
		
	});
	getUUID();
	function cookieLogin(value)
	{
		if(login_session_key=='')
		{
			login_in_progress=true;
			loginByKey(value);
		/*	initial_login_session_key=value;
			login_in_progress=true;
			registerClient();*/
		}
	}
	function cbSearchMembers(doc)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			//friend_list=doc;
			var member_list=[];
			var members=doc.getElementsByTagName("member");

			if(members)
			{
				for(var i=0;i<members.length;i++)
				{
					member_list.push({"first_name": members[i].getElementsByTagName("first_name")[0].childNodes[0].nodeValue,"last_name": members[i].getElementsByTagName("last_name")[0].childNodes[0].nodeValue, "covu_id": members[i].getElementsByTagName("covu_id")[0].childNodes[0].nodeValue, "has_avatar": members[i].getElementsByTagName("has_avatar")[0].childNodes[0].nodeValue,
					"friendship": members[i].getElementsByTagName("friendship")[0].childNodes[0].nodeValue
					});
				}
			}
			
			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
			{
					popups[0].peopleController.loadSearchResults(member_list);
			}
		}
		else
		{
			var error = errorAlerts.getMemberDetails(doc);
			alert(error);
		}	
	}
	function SearchMembers(key,start_limit)
	{
		var pl = new RestClientParameters();
		pl.add("login_session_key",login_session_key);
		pl.add("keyword",key);
		pl.add('start',start_limit);
		
		invoke(urlAPI,"SearchMembers",pl,cbSearchMembers);
	}
	function cbRequestFriendship(doc,covu_id,email)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
		{
			getFriends();
			var popups = chrome.extension.getViews({type: "popup"});
			if(email)
			{
				if(popups.length)
				{
						popups[0].peopleController.cbInviteByEmail('successfully sent invitation');
				}
			}
			else
			{
				if(popups.length)
				{
						popups[0].peopleController.RequestFriendshipSent(covu_id);
				}
			}
		}
		else
		{
			if(email)
			{
				var popups = chrome.extension.getViews({type: "popup"});
				if(popups.length)
				{
						popups[0].peopleController.cbInviteByEmail('unable to send invitation');
				}
			}
		}
	}
	function RequestFriendship(covu_id,email)
	{
		var pl = new RestClientParameters();
		pl.add("login_session_key",login_session_key);
		if(covu_id)
			pl.add("friend_covu_id",covu_id);
		else
		{
			var recipient=email.split(' ').join('');
			recipient=recipient.split(",");
			var rec=new Array();
			
			for(var i=0;i<recipient.length;i++)
			{
				rec[recipient[i]]="xxx"+recipient[i];
			}
			
			for (var p in rec) 
			{
				pl.add("emails[]",encodeData(p));
			}
		//	pl.add("emails[]",encodeData(email));
		}
		invoke(urlAPI,"RequestFriendship",pl,cbRequestFriendship,covu_id,email);
	}
	var tab_id=null;
	var gigyaListener=function (id,  changeInfo,  tab)
	{
		if(changeInfo.url )
		{
			getCookie(false,changeInfo.url);
		}	
	}
	function getCookie(showSignin,newUrl)
	{
		chrome.cookies.get({url:covu_signin_page,name:'app_login_session_key'},function(cookie)
			{
				if(cookie)
				{
					if(newUrl)
					{

							if(newUrl.search(/\?welcome/)!=-1)
							{
								new_member=true;
							}
							else
								new_member=false;
					}
					cookieLogin(cookie['value']);
					chrome.tabs.onUpdated.removeListener(gigyaListener);
					
				}
				else if(showSignin)
				{
					var value=covu_signin_page;
		
					chrome.tabs.create({url:"about:blank"},function(tab)
					{
						tab_id=tab.id;	
						chrome.tabs.onUpdated.removeListener(gigyaListener);
						chrome.tabs.onUpdated.addListener(gigyaListener);
					});
					
													
					chrome.tabs.getSelected(null, function(tab) 
					{

						chrome.tabs.update(tab.id,{url:value});
					});
							
					chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.update(tab.id, { selected: true } )
					});
					return;
				}
			});
	}
	function getFriendInfo(doc)
	{
		var city='';
		var phone='';
		var covu_id='';
		var first_name='';
		var last_name='';
		var avatar='';
		var email_id='';
		try
		{
			city=doc[0].getElementsByTagName('city')[0].childNodes[0].nodeValue;
		}
		catch(e)
		{
			
		}
		try
		{
			
			covu_id=doc[0].getElementsByTagName('covu_id')[0].childNodes[0].nodeValue;
			first_name=doc[0].getElementsByTagName('first_name')[0].childNodes[0].nodeValue;
			last_name=doc[0].getElementsByTagName('last_name')[0].childNodes[0].nodeValue;
			email_id=doc[0].getElementsByTagName('email')[0].childNodes[0].nodeValue;	
			avatar=doc[0].getElementsByTagName('avatar')[0].childNodes[0].nodeValue;
			
		}
		catch(e)
		{
			
		}
		try
		{
			phone=doc[0].getElementsByTagName('phone')[0].childNodes[0].nodeValue;
		}
		catch(e)
		{
			
		}
		var popups = chrome.extension.getViews({type: "popup"});
		if(popups.length)
		{
			popups[0].renderFriendProfile(covu_id,first_name,last_name,phone,city,email_id,avatar);
		}
	}
	function cbGetFriendProfile(doc)
	{
		var r = doc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		if(r==0)
			getFriendInfo(doc.getElementsByTagName("member"));
		else
		{
			var popups = chrome.extension.getViews({type: "popup"});
			if(popups.length)
				popups[0].showErrorAlert("Profile of this member is private.");	
		}
	}
	 function getFriendProfile(covu_id)
	 {
	 	var pl = new RestClientParameters();
		pl.add("login_session_key",login_session_key);
		pl.add("friend_covu_id",covu_id);
		
		invoke(urlAPI,"GetMemberDetails",pl,cbGetFriendProfile);
	 }
	getCookie();
	showNormalIcon();

