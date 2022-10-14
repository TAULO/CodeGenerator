/*
파일명: chatting.js
설명: 채팅 구현
작성일: 2021-01-20
기능구현: 도재구
*/

$(document).ready(function() {
	//웹소켓 연결
	connect();
	
	//채팅방 입장시 채팅방 회원의 회원정보를 가지고 와서 화면에 적용해주는 비동기 처리
	$.ajax({
			type : "GET",
			url  : "chat/users",
			data : { 'select' : $('#select').val()},
			async: false,
			success : function(data){
				$('.chat-top-pic').empty();
				let opr = '';
				if(data.length > 3){
					$.each(data, function(index,elem) {
						let i = index + 1;
						if(i <= 4){
							if(elem.profile != null){
								opr+=	"<img class='chat-top-img-1-"+i+"' src='/resources/profile/"+elem.email+"_"+elem.profile+"'>";
							}else{
								opr+=	"<img class='chat-top-img-1-"+i+"' src='/resources/img/icon/none.png'>";
							}
						}
					});
					
				}else if(data.length == 3){
					$.each(data, function(index,elem) {
						let i = index + 1;
						if(elem.profile != null){
							opr+=	"<img class='chat-top-img-2-"+i+"' src='/resources/profile/"+elem.email+"_"+elem.profile+"'>";
						}else{
							opr+=	"<img class='chat-top-img-2-"+i+"' src='/resources/img/icon/none.png'>";
						}
					});
															
				}else if(data.length == 2){
					$.each(data, function(index,elem) {
						let i = index + 1;
						if(elem.profile != null){
							opr+=	"<img class='chat-top-img-3-"+i+"' src='/resources/profile/"+elem.email+"_"+elem.profile+"'>";
						}else{
							opr+=	"<img class='chat-top-img-3-"+i+"' src='/resources/img/icon/none.png'>";
						}
					});
				}
				$('.chat-top-pic').append(opr);
				
				let element = '';
				$.each(data,function(index,user){
					element += 		"<div onclick='selectChatUser(this)' class='mension-select-user-wrapper'>"+
										"<div class='mension-select-user-subWrapper'>"+
											"<div id='mension-select-user-on-"+index+"' class='mension-select-user-on'></div>"+
											"<div class='mension-select-user-pic'>";
												if(user.profile != null){
													element += "<img class='mension-select-user-img' src='/resources/profile/"+user.email+"_"+user.profile+"'/>";
												}else{
													element += "<i class='fas fa-user'></i>";
												}
					element +=				"</div>"+
											"<div class='mension-select-user-letters-wrapper'>"+
												"<div id='mension-select-user-name-"+index+"' class='mension-select-user-name'>"+
													user.nickName+
												"</div>"+
												"<div id='mension-select-user-email-"+index+"' class='mension-select-user-email'>"+
													user.email+
												"</div>"+
											"</div>"+
										"</div>"+
									"</div>";
				});
				$('.mension-area').append(element);
				
				
			},
			error: function(request,status,error){
				alert(error);
			}
		});
	
	
	//Enter 키 입력
	$('.chat-msgWrite-btn').attr('class','chat-msgWrite-btn-not');
	$('#message').keypress( (event) => {
		//Enter 키 입력 시
		if (event.which == 13) {
			let filename = $('#file-input').val();
			if(filename != null && filename != ''){
				sendFiles(filename);
			}else{
				send();
			}
			$('#message').attr('contenteditable',true);
			$('#message').focus(); 
			$('#img_zone').css('display','none');
			$('.emoji-content').removeClass('disappear2');
			$('.emoji-content').addClass('disappear');
			$('#file-input').val('');
			
			event.preventDefault();
		}
		
		//@ 멘션키 입력시
		if (event.key == '@') {
			let mension_content = $('.mension-content');
			mension_content.removeClass('disappear').addClass('appear');
			mension_content.css('display','block');
		}
		
	});
	//전송 버튼 CSS 조절, 텍스트 박스에 글을 입력할 때마다
	$('#message').keyup( (event) => {
		let filename = $('#file-input').val();
		//파일이 들어왔으면
		if(filename != null && filename != ''){
			//CSS 효과 주지 않음
			
		//일반 텍스트가 들어왔으면
		}else{
			// textarea에 값이 입력되어 있지 않다면, 전송버튼 비활성화
			if($('#message').text().trim() == ''){
				$('.chat-msgWrite-btn').attr('class','chat-msgWrite-btn-not');
			//입력되어 있다면 전송버튼 활성화
			}else if($('#message').text() != ''){
				$('.chat-msgWrite-btn-not').attr('class','chat-msgWrite-btn');
			}
		}

	});
	//처음 입장시 메시지 입력창 CSS 색 입히기
	$('#message').focus();
	if($('#message').is(':focus')){
		$('.chat-msgWrite-wrapper').css("border","2px solid #f2dd68");
	}
	//입력창 클릭시 메시지 입력상태 ON
	$('.chat-msgWrite-wrapper').click( () => {
		$('#message').focus();
		$('.chat-msgWrite-wrapper').css("border","2px solid #f2dd68");
	});
	//입력창 외에 다른 곳 클릭시 입력상태 OFF
	$('#message').focusout( () => {
		$('.chat-body-wrapper, .chat-top-wrapper').click( () => {
			$('.chat-msgWrite-wrapper').css("border","2px solid #999999");
		});
	});
	
	//전송 버튼을 눌렀을 때
	$('#sendBtn').click( (event) => {
		//버튼이 활성화 되어 있는 상태이면 메시지를 보낸다
		if($('#chat-msgWrite-btn').attr('class') == 'chat-msgWrite-btn'){
			
			let filename = $('#file-input').val();
			if(filename != null && filename != ''){
				sendFiles(filename);
			}else{
				send();
			}
			$('#message').attr('contenteditable',true);
			$('#message').focus(); 
			$('.chat-msgWrite-btn').attr('class','chat-msgWrite-btn-not');
			$('#img_zone').css('display','none');
			$('.emoji-content').removeClass('disappear2');
			$('.emoji-content').addClass('disappear');
			$('#file-input').val('');
			
			event.preventDefault();
			
		//버튼이 활성화 되어 있지 않으면 입력상태 ON
		}else{
			$('#message').focus();
		}
	});

	//ESC 키 입력 시
	window.onkeydown = (event) => {
		if (event.keyCode == 27 || event.which == 27) {
			swal.fire({
				title: 'Warning',
				text: '채팅방을 종료합니다',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: '확인',
				cancelButtonText: '취소',
				
			}).then((result) => {
				if(result.isConfirmed){
					swal.fire({
						title: 'Confirm',
						text: '채팅기록은 저장됩니다',
						icon: 'info',
						confirmButtonColor: '#3085d6',
						confirmButtonText: '확인',
					}).then((result) => {
						if(result.isConfirmed){
							swal.fire("완료", "채팅 기록이 저장되었습니다.", "success");
							disconnect();
							window.close();
						}
					});
				}
			});
		}
	}
	
	//사용자가 이미지를 올렸을 때 
	$("#file-input").on('change', function(e){
		readURL(this.files[0]);
	});
	
});


/*
파일명: chatting.js
설명: 멘션 기능(회원을 선택하면 멘션이 적용되도록 하는 함수)
작성일: 2021-01-20
기능구현: 도재구
*/
function selectChatUser(me){
	let nickname = $(me).find('div:eq(4)').text();
	let email = $(me).find('div:eq(5)').text();
	let element = "<div contenteditable='false' class='mension-added' value='"+email+"'>"+nickname+"</div>";
	let index = $('#message').html().lastIndexOf('@');
	let prefix = $('#message').html().substring(0,index);

	$('.chat-msgWrite-btn-not').attr('class','chat-msgWrite-btn');
	$('#message').html(prefix + element);
	if($('.mension-content').hasClass('appear')){
		$('.mension-content').addClass('disappear');
		setTimeout( () => {
			$('.mension-content').removeClass('appear'); 
			$('.mension-content').css('display','none'); 
		}, 580 );
	}
	//멘션 선택후 커서위치 지정해주는 기능
	$('#message').focus();
	let editor = document.getElementById('message');
	var selection = window.getSelection();
	selection.selectAllChildren(editor);
	selection.collapseToEnd();
	
}

/*
파일명: chatting.js
설명: 멘션 팝업 띄우기
작성일: 2021-01-20
기능구현: 도재구
*/
function popupMension(target){
	if(!$('.mension-content').hasClass('disappear2')){
		if(target.hasClass('appear')){
			target.addClass('disappear');
			setTimeout( () => {
				target.removeClass('appear'); 
				target.css('display','none'); 
			}, 580 );
		}else {
			target.removeClass('disappear').addClass('appear');
			target.css('display','block');
		}
	}
}

/*
파일명: chatting.js
설명: 사용자가 채팅방에서 파일을 올렸을 때 실행되는 함수
작성일: 2021-01-20
기능구현: 도재구
*/
function readURL(file) {
  	let reader = new FileReader();
	//파일을 읽어서
  	reader.readAsDataURL(file);

	//확장자명 추출 extension
	let index = file.name.lastIndexOf(".");
	let extension = file.name.substring(index+1);
	
	//파일이 다 읽어지면 
  	reader.onload = (e) => {
		//파일을 업로드합니다.
		uploadFile(file);
		
		//이미지 미리보기
		$('#img_zone').css('display','block');
		
		//확장자명에 따라 이미지를 다르게 보여줍니다.
		if(extension === "png" || extension === "jpg" || extension === "jpeg" || extension === "gif"){
			$('#img_zone').attr('src', e.target.result);
		}else if(	extension === "ppt" 	|| 
					extension === "pptx"	||
					extension === "xlsx"	||
					extension === "xlsm"	||
					extension === "hwp"		||
					extension === "doc"		||
					extension === "docx"	||
					extension === "pdf"		||
					extension === "txt"		||
					extension === "zip"){
						
			$('#img_zone').attr('src', '/resources/img/icon/ppt.png');
			
		}else{
			$('#img_zone').attr('src', '/resources/img/icon/file.png');
		}
		//파일을 올렸을 때에는 텍스트를 작성할 수 없도록 합니다.
		$('#message').attr('contenteditable',false);
		$('#message').empty();
		$('#chat-msgWrite-btn').attr('class','chat-msgWrite-btn')
		
		//파일이 업로드 되는 동안 이모티콘 올리지 않도록 합니다.
		//chattingEmoji.js 파일에서 function switchAnimation(target) 에서 쓰임
		$('.emoji-content').removeClass('disappear');
		$('.emoji-content').addClass('disappear2');
		
		
		window.onkeydown = (event) => {
			//백스페이스 눌렀을 경우
			if (event.keyCode == 8 || event.which == 8) {
				$('#message').attr('contenteditable',true);
				$('#message').focus(); 
				$('#img_zone').css('display','none');
				$('.emoji-content').removeClass('disappear2');
				$('.emoji-content').addClass('disappear');
				$('#file-input').val('');
			}
			
			//엔터키를 눌렀을 경우
			if (event.keyCode == 13 || event.which == 13) {
				let filename = $('#file-input').val();
				if(filename != null && filename != ''){
					sendFiles(file.name);
				}else{
					send();
				}
				$('#message').attr('contenteditable',true);
				$('#message').focus(); 
				$('#img_zone').css('display','none');
				$('.emoji-content').removeClass('disappear2');
				$('.emoji-content').addClass('disappear');
				$('#file-input').val('');
				
				event.preventDefault();
			}
			
				//ESC 키 입력 시
				if (event.keyCode == 27 || event.which == 27) {
					swal.fire({
						title: 'Warning',
						text: '채팅방을 종료합니다',
						icon: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: '확인',
						cancelButtonText: '취소',
						
					}).then((result) => {
						if(result.isConfirmed){
							swal.fire({
								title: 'Confirm',
								text: '채팅기록은 저장됩니다',
								icon: 'info',
								confirmButtonColor: '#3085d6',
								confirmButtonText: '확인',
							}).then((result) => {
								if(result.isConfirmed){
									swal.fire("완료", "채팅 기록이 저장되었습니다", "success");
									disconnect();
									window.close();
								}
							});
						}
					});
				}
			
		}
  	}
}

/*
파일명: chatting.js
설명: 사용자가 파일을 올렸을 때 파일 업로드
작성일: 2021-01-20
기능구현: 도재구
*/
function uploadFile(file) {
	
	let form = $('#chat_uploadForm')[0];
	//파일 안 올리고 업로드 시 
	if($("#file-input").val()===''){
		return;
	}
	
    let formData = new FormData(form);
	formData.append('file', file);

	$.ajax({
		url: 'chat/file?email='+$("#session_email").val(),
		data: formData,
		type: 'POST',
		enctype: 'multipart/form-data',
		processData: false,
		contentType: false,
		async: false,
		cache: false,
		error: function(request,status,error){},
		success: function(data) {}
	});
}


var websocket;
var chatReceiveSocket;

function connect(){
	//전송하는 쪽에서 적용될 웹소켓
	websocket = new WebSocket(
		"ws://localhost:8090/websocket/chat/websocket?select="+$('#select').val()+"&roomname="+$('#roomname').val());
	websocket.onopen = onOpen;
	websocket.onmessage = onMessage;
	websocket.onclose = onClose;
	
	//받는 쪽에서 적용될 웹소켓 생성
	chatReceiveSocket = new WebSocket(
		"ws://localhost:8090/websocket/chatReceive/websocket?select="+$('#select').val()+"&roomname="+$('#roomname').val());
	chatReceiveSocket.onopen = (event) => {};
	chatReceiveSocket.onmessage = (event) => {};
	chatReceiveSocket.onclose = (event) => {};
}

function disconnect(){
	websocket.close();
}

//채팅방을 열었을 때 앞서 저장된 데이터를 불러와 주는 함수
function onOpen(evt){
	
	let today = new Date();
	let date = today.format('yyyy년 MM월 dd일');
	
	//파이어베이스 초기값 작성
	firebase.database().ref().child('chatting_room_seq/'+$('#select').val()+'/messages/0').set({
		chatting_room_seq : $('#select').val(),
		message_seq : 0
	});
	
	//DB에서 이전 데이터를 불러옵니다.
	firebase.database().ref().child('chatting_room_seq/'+$('#select').val()+'/messages').once('value',function(data){
		let myemail = $('#session_email').val();
		let msgbox = '';
		//받아온 데이터가 1개이면,
		if(data.val().length == 1){
			msgbox += 	"<div class='chat-body-date'>"+
							"<div class='chat-body-date-line'>"+
								"――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――"+
							"</div>"+
							"<div class='chat-body-date-letter'>"+
								date+
							"</div>"+
							"<div class='chat-body-date-line'>"+
								"――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――"+
							"</div>"+
						"</div>";
		}
		
		//데이터의 갯수 만큼 반복문을 돌려서 데이터를 불러옵니다.
		for(let i=1; i < data.val().length; i++){
			
			let str = data.val()[i].message_date;
			let strArr = str.split('-');
			let DB_date = new Date(strArr[0], strArr[1]-1, strArr[2]);
			let DB_date_format = DB_date.format('yyyy년 MM월 dd일');
			//날짜가 5일뒤 '자정이 지난' 메시지는 띄우지 않기
			if((today - DB_date)/1000/60/60/24 < 5){
				//날짜가 바뀌었으면 바뀐 것을 표시
				if(data.val()[i].message_date != data.val()[i-1].message_date){
					msgbox += 	"<div class='chat-body-date'>"+
									"<div class='chat-body-date-line'>"+
										"――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――"+
									"</div>"+
									"<div class='chat-body-date-letter'>"+
										DB_date_format+
									"</div>"+
									"<div class='chat-body-date-line'>"+
										"――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――"+
									"</div>"+
								"</div>";
				}
			
				//내가 보낸 메일이면
				if (data.val()[i].email == myemail) {
					msgbox += 	"<div class='chat-receiver-wrapper'>"+
									"<div class='chat-receiver-pic'>";
										if(data.val()[i].profile != null){
											msgbox +=	"<img class='chat-receiver-profile' src='/resources/profile/"+myemail+"_"+data.val()[i].profile+"'>";
										}else{
											msgbox +=	"<i class='fas fa-user'></i>";
										}
					msgbox +=		"</div>"+
									"<div>"+
										"<div class='chat-receiver-name'>"+
											data.val()[i].nickName+
										"</div>"+
										"<div class='chat-receiver-message-wrapper'>"+
											"<div id='chatMessageArea' class='chat-receiver-message'>";
											//file이 들어오면 파일 확장자 명에 따라 이미지를 다르게 준다
											if(data.val()[i].message_content == ''){
												if(data.val()[i].extension == 'jpg' || data.val()[i].extension == 'jpeg' || data.val()[i].extension == 'png' || data.val()[i].extension == 'gif'){
													msgbox +=	"<img id='chat-receiver-file' class='chat-receiver-file' src='/resources/files/file_directory_project_seq_"+$('#projectNum').val()+data.val()[i].message_file+"'>";
												}else if(	data.val()[i].extension === "ppt" 	|| 
															data.val()[i].extension === "pptx" 	|| 
															data.val()[i].extension === "xlsx" 	|| 
															data.val()[i].extension === "xlsm"	||
															data.val()[i].extension === "hwp" 	||
															data.val()[i].extension === "doc" 	||
															data.val()[i].extension === "docx" 	||
															data.val()[i].extension === "pdf" 	||
															data.val()[i].extension === "txt" 	||
															data.val()[i].extension === "zip"){
																
													msgbox +=	"<img id='chat-receiver-file' class='chat-receiver-file' src='/resources/img/icon/"+data.val()[i].extension+".png'>";
													
												}else{
													msgbox +=	"<img id='chat-receiver-file' class='chat-receiver-file' src='/resources/img/icon/file.png'>";
												}
													msgbox +=	"<br><a class='chat-receiver-file-a' href='chat/file/download?project_seq="+$('#projectNum').val()+"&file_uploaded_name="+data.val()[i].message_file.substring(1)+"'><i class='fas fa-download'></i> "+data.val()[i].message_file.substring(1)+"</a>";
											//일반 메시지가 들어오면
											}else{
												msgbox +=	data.val()[i].message_content;
											}
					msgbox +=				"</div>"+
											"<div class='chat-receiver-time'>"+
												data.val()[i].message_time+
											"</div>"+
										"</div>"+
									"</div>"+
								"</div>";
								
				//내가 보낸 메일이 아니면
				}else {
					msgbox += 	"<div class='chat-sender-wrapper'>"+
									"<div class='chat-sender-pic'>";
										if(data.val()[i].profile != null){
											msgbox +=	"<img class='chat-receiver-profile' src='/resources/profile/"+data.val()[i].email+"_"+data.val()[i].profile+"'>";
										}else{
											msgbox +=	"<i class='fas fa-user'></i>";
										}
					msgbox +=		"</div>"+
									"<div>"+
										"<div class='chat-sender-name'>"+
											data.val()[i].nickName+
										"</div>"+
										"<div class='chat-sender-message-wrapper'>"+
											"<div id='chatMessageArea' class='chat-sender-message'>";
											//file이 들어오면 파일 확장자 명에 따라 이미지를 다르게 준다
											if(data.val()[i].message_content == ''){
												if(data.val()[i].extension == 'jpg' || data.val()[i].extension == 'jpeg' || data.val()[i].extension == 'png' || data.val()[i].extension == 'gif'){
													msgbox +=	"<img id='chat-sender-file' class='chat-sender-file' src='/resources/files/file_directory_project_seq_"+$('#projectNum').val()+data.val()[i].message_file+"'>";
												}else if(	data.val()[i].extension === "ppt" 	|| 
															data.val()[i].extension === "pptx" 	||
															data.val()[i].extension === "xlsx"	||
															data.val()[i].extension === "xlsm"	||
															data.val()[i].extension === "hwp"	||
															data.val()[i].extension === "doc"	||
															data.val()[i].extension === "docx"	||
															data.val()[i].extension === "pdf"	||
															data.val()[i].extension === "txt"	||
															data.val()[i].extension === "zip"){
																
													msgbox +=	"<img id='chat-sender-file' class='chat-sender-file' src='/resources/img/icon/"+data.val()[i].extension+".png'>";
													
												}else{
													msgbox +=	"<img id='chat-sender-file' class='chat-sender-file' src='/resources/img/icon/file.png'>";
												}
													msgbox +=	"<br><a class='chat-sender-file-a' href='chat/file/download?project_seq="+$('#projectNum').val()+"&file_uploaded_name="+data.val()[i].message_file.substring(1)+"'><i class='fas fa-download'></i> "+data.val()[i].message_file.substring(1)+"</a>";
											//일반 메시지가 들어오면
											}else{
												msgbox +=	data.val()[i].message_content;
											}
					msgbox +=				"</div>"+
											"<div class='chat-sender-time'>"+
												data.val()[i].message_time+
											"</div>"+
										"</div>"+
									"</div>"+
								"</div>";
									
				}//if (msginfo == myemail) end
			}//if((today - DB_date)/1000/60/60/24) < 2) end
		}//for(let i=0; i < data.val().length; i++) end
		if(data.val().length != 1){
			msgbox += 	"<div class='chat-body-unread'>"+
							"<div class='chat-body-unread-line'>"+
								"――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――"+
							"</div>"+
							"<div class='chat-body-unread-letter'>"+
								"여기까지 읽었습니다."+
							"</div>"+
							"<div class='chat-body-unread-line'>"+
								"――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――"+
							"</div>"+
						"</div>";
		}
		
		//불러온 데이터를 메시지 화면창에 append 합니다.
		$("#chatMessageArea").append(msgbox);
		var chatAreaHeight = $("#chatArea").height();
		var maxScroll = $("#chatMessageArea").height() - chatAreaHeight;
		$("#chatMessageArea").scrollTop($("#chatMessageArea")[0].scrollHeight);
		
		
	});//firebase end
}

function onMessage(evt){
	var data = evt.data;
	//일반 메시지가 들어오면 다음 함수를 적용합니다.
	if(data.indexOf('|') != -1){
		appendMessage(data);
		
	//프로젝트 메인과 연결하기 위해서 또다른 웹소켓을 생성하였습니다.connectSocket
	//메시지를 보낼때 onMessage 함수를 두번 타게 되는데, 두번째 타게될 때에 이곳을 지납니다.
	}else if(data == $('#session_email').val()){
		//프로젝트 메인과 연결되어 있는 웹소켓 send
		connectSocket.send($('#select').val());
	}
}

function onClose(evt){
	
}



//채팅방에 메시지를 입력할시 적용되는 함수
function send(){
	let email = $('#session_email').val();
	let nickname = $('#nickname').val();
	var msg = $('#message').html();
	if($('#message').text().trim() != ''){
		if(msg.trim() != ''){
			websocket.send(email + "|" + msg + "|" + nickname + "|"+nickname);
		}
	}
	$('#message').text('');
}

//채팅방에 파일을 업로드할 때 적용되는 함수
function sendFiles(filename){
	let email = $('#session_email').val();
	let nickname = $('#nickname').val();
	var msg = $('#message').text();
	let index = filename.lastIndexOf('\\');
	let original_filename = filename.substring(index+1);
	websocket.send(email + "|" + msg + "|" + nickname +"|/"+original_filename);
}

//메시지를 실시간 보내주는 함수
function appendMessage(msg) {
	
	$.ajax(
		{
			type 		: "GET",
			url  		: "chat/users?select="+$('#select').val(),
			error		: function(request,status,error){
				alert(error);
			},
			success 	: function(data){
				
				let myemail = $('#session_email').val();
				let mynickname = $('#nickname').val();
				var strarray = msg.split('|');
			
				var msginfo = strarray[0];
				var message = strarray[1];
				var msgbox ='';
				
				//현재 시간 구하기
				let today = new Date();
				let time_index = today.toLocaleTimeString().lastIndexOf(':');
				let time = today.toLocaleTimeString().substr(0,time_index);
				let date = today.format('yyyy-MM-dd');
				
				let index = strarray[3].lastIndexOf(".");	
				let extension = strarray[3].substring(index+1);
				
				
					//받은 정보가 나의 이메일이면, 
					if (msginfo == myemail) {
						$.each(data,function(index,elem){
							if(myemail == elem.email){
								msgbox = 	"<div class='chat-receiver-wrapper'>"+
												"<div class='chat-receiver-pic'>";
												if(elem.profile != null){
													msgbox +=	"<img class='chat-receiver-profile' src='/resources/profile/"+myemail+"_"+elem.profile+"'>";
												}else{
													msgbox +=	"<i class='fas fa-user'></i>";
												}
								msgbox +=		"</div>"+
												"<div>"+
													"<div class='chat-receiver-name'>"+
														mynickname+
													"</div>"+
													"<div class='chat-receiver-message-wrapper'>"+
														"<div id='chatMessageArea' class='chat-receiver-message'>";
														//file이 들어오면 파일 확장자 명에 따라 이미지를 다르게 준다
														if(msg.indexOf('|/') != -1){
															if(extension == 'jpg' || extension == 'jpeg' || extension == 'png' || extension == 'gif'){
																msgbox +=	"<img id='chat-receiver-file' class='chat-receiver-file' src='/resources/files/file_directory_project_seq_"+$('#projectNum').val()+strarray[3]+"'>";
															}else if(	extension === "ppt"  || 
																		extension === "pptx" ||
																		extension === "xlsx" ||
																		extension === "xlsm" ||
																		extension === "hwp"	 ||
																		extension === "doc"	 ||
																		extension === "docx" ||
																		extension === "pdf"	 ||
																		extension === "txt"	 ||
																		extension === "zip"){
																			
																msgbox +=	"<img id='chat-receiver-file' class='chat-receiver-file' src='/resources/img/icon/"+extension+".png'>";
																
															}else{
																msgbox +=	"<img id='chat-receiver-file' class='chat-receiver-file' src='/resources/img/icon/file.png'>";
															}
																msgbox +=	"<br><a class='chat-receiver-file-a' href='chat/file/download?project_seq="+$('#projectNum').val()+"&file_uploaded_name="+strarray[3].substring(1)+"'><i class='fas fa-download'></i> "+strarray[3].substring(1)+"</a>";
														//일반 메시지가 들어오면
														}else{
															msgbox +=	message;
														}
								msgbox +=				"</div>"+
														"<div class='chat-receiver-time'>"+
															time+
														"</div>"+
													"</div>"+
												"</div>"+
											"</div>";
											
										
										//SELECT chatting_room_seq
										firebase.database().ref().child('chatting_room_seq').once('value',function(data){
											//message_seq 추출
											let message_seq = Object.keys(data.val()[$('#select').val()].messages).length;
											
											//INSERT message
											firebase.database().ref().child('chatting_room_seq/'+$('#select').val()+'/messages/'+message_seq).set({
												chatting_room_seq : $('#select').val(),
												message_seq : message_seq,
												message_content : message,
												message_date : date,
												message_time : time,
												message_file : strarray[3],
												extension: extension,
												email : $('#session_email').val(),
												nickName : $('#nickname').val(),
												profile : elem.profile,
											});
											
											//멘션을 보낸경우
											if(message.indexOf('<div contenteditable="false" class="mension-added" value="') != -1){
												//div 태그에서 이메일 추출하기
												let index = message.indexOf('<div contenteditable="false" class="mension-added" value="');
												let substr = message.substring(index+58);
												let suffix = substr.indexOf('"');
												let email = substr.substring(0,suffix);
												
												firebase.database().ref().child('mension/0').set({
													mension_seq : 0,
													mension_email : '',
													chatting_room_seq : '',
													message_content : '',
													message_date : '',
													message_time : '',
													email : '',
													nickName : '',
													profile : '',
													count : 0,
													
												});
												firebase.database().ref().child('mension').once('value',function(data){
													let mension_seq = data.val().length;
													
													firebase.database().ref().child('mension/'+mension_seq).set({
														mension_seq : mension_seq,
														mension_email : email,
														chatting_room_seq : $('#select').val(),
														message_seq : message_seq,
														message_content : message,
														message_date : date,
														message_time : time,
														email : $('#session_email').val(),
														nickName : $('#nickname').val(),
														profile : elem.profile,
														count : 1
													});
												});
												
											}
											
											
										});
										
										websocket.send($('#session_email').val());
								}
							
							});
						
					//OOO님이 입장하였습니다, 퇴장하였습니다 를 적용하고 싶을 때 이곳을 타게 하도록 합니다.
					}else if(msginfo == "알림"){
						msgbox += 	"<div class='chat-body-date'>"+
										"<div class='chat-body-date-line'>"+
											"―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――"+
										"</div>"+
										"<div class='chat-body-date-letter'>"+
											message+
										"</div>"+
										"<div class='chat-body-date-line'>"+
											"――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――"+
										"</div>"+
									"</div>";
					
					//받은 정보가 다른 회원의 이메일이면,	
					}else {
						$.each(data,function(index,elem){
							if(msginfo == elem.email){
								msgbox = 	"<div class='chat-sender-wrapper'>"+
												"<div class='chat-sender-pic'>";
												if(elem.profile != null){
													msgbox +=	"<img class='chat-sender-profile' src='/resources/profile/"+elem.email+"_"+elem.profile+"'>";
												}else{
													msgbox +=	"<i class='fas fa-user'></i>";
												}
													
								msgbox +=		"</div>"+
												"<div>"+
													"<div class='chat-sender-name'>"+
														elem.nickName+
													"</div>"+
													"<div class='chat-sender-message-wrapper'>"+
														"<div id='chatMessageArea' class='chat-sender-message'>";
														//file이 들어오면 파일 확장자 명에 따라 이미지를 다르게 준다
														if(msg.indexOf('|/') != -1){
															if(extension == 'jpg' || extension == 'jpeg' || extension == 'png' || extension == 'gif'){
																msgbox +=	"<img id='chat-sender-file' class='chat-sender-file' src='/resources/files/file_directory_project_seq_"+$('#projectNum').val()+strarray[3]+"'>";
															}else if(	extension === "ppt"  || 
																		extension === "pptx" ||
																		extension === "xlsx" ||
																		extension === "xlsm" ||
																		extension === "hwp"	 ||
																		extension === "doc"	 ||
																		extension === "docx" ||
																		extension === "pdf"	 ||
																		extension === "txt"	 ||
																		extension === "zip"){
																			
																msgbox +=	"<img id='chat-sender-file' class='chat-sender-file' src='/resources/img/icon/"+extension+".png'>";
																
															}else{
																msgbox +=	"<img id='chat-sender-file' class='chat-sender-file' src='/resources/img/icon/file.png'>";
															}
																msgbox +=	"<br><a class='chat-sender-file-a' href='chat/file/download?project_seq="+$('#projectNum').val()+"&file_uploaded_name="+strarray[3].substring(1)+"'><i class='fas fa-download'></i> "+strarray[3].substring(1)+"</a>";
														//일반 메시지가 들어오면
														}else{
															msgbox +=	message;
														}
								msgbox +=				"</div>"+
														"<div class='chat-sender-time'>"+
															time+
														"</div>"+
													"</div>"+
												"</div>"+
											"</div>";
											
											chatReceiveSocket.send('');
											
							}//if
						});//each end
					}
				
				//채팅 내용을 실시간 append 합니다.
				$("#chatMessageArea").append(msgbox);
				var chatAreaHeight = $("#chatArea").height();
				var maxScroll = $("#chatMessageArea").height() - chatAreaHeight;
				$("#chatMessageArea").scrollTop($("#chatMessageArea")[0].scrollHeight);
				
				
		}
	});
	
}
	//날짜 포맷 형식을 지정해준 함수
	Date.prototype.format = function (f) {
	    if (!this.valueOf()) return " ";
	
	    var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	    var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
	    var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	    var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	    var d = this;
	
	    return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
	        switch ($1) {
	            case "yyyy": return d.getFullYear(); // 년 (4자리)
	            case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
	            case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)
	            case "dd": return d.getDate().zf(2); // 일 (2자리)
	            case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
	            case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)
	            case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
	            case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)
	            case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
	            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
	            case "mm": return d.getMinutes().zf(2); // 분 (2자리)
	            case "ss": return d.getSeconds().zf(2); // 초 (2자리)
	            case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
	            default: return $1;
	        }
	    });
	};
	
	String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
	String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
	Number.prototype.zf = function (len) { return this.toString().zf(len); };
	