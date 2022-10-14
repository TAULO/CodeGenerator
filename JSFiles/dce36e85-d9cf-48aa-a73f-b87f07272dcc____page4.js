/**
 * 	页面四
 */
_page4_account1_type = document.getElementById("page4_account1_type");
_page4_account1_value = document.getElementById("page4_account1_value");
_page4_account1_lable = document.getElementById("page4_account1_lable");
_page4_account1_line_select = document.getElementById("page4_account1_line_select");
_page4_account1_extension = document.getElementById("page4_account1_extension");

_page4_account2_type = document.getElementById("page4_account2_type");
_page4_account2_value = document.getElementById("page4_account2_value");
_page4_account2_lable = document.getElementById("page4_account2_lable");
_page4_account2_line_select = document.getElementById("page4_account2_line_select");
_page4_account2_extension = document.getElementById("page4_account2_extension");

_page4_account3_type = document.getElementById("page4_account3_type");
_page4_account3_value = document.getElementById("page4_account3_value");
_page4_account3_lable = document.getElementById("page4_account3_lable");
_page4_account3_line_select = document.getElementById("page4_account3_line_select");
_page4_account3_extension = document.getElementById("page4_account3_extension");


//账号一路线选项定义
page4_account1_line1 = document.createElement("OPTION");
page4_account1_line1.value="line1";
page4_account1_line2 = document.createElement("OPTION");
page4_account1_line2.value="line2";
page4_account1_line3 = document.createElement("OPTION");
page4_account1_line3.value="line3";
page4_account1_empty = document.createElement("OPTION");
page4_account1_empty.value="empty";
page4_account1_all_contacts = document.createElement("OPTION");
page4_account1_all_contacts.value="all_contacts";

if (document.cookie.split("=")[1] == "en") {
	page4_account1_line1.innerHTML="line1";
	page4_account1_line2.innerHTML="line2";
	page4_account1_line3.innerHTML="line3";
	page4_account1_empty.innerHTML="N/A";
	page4_account1_all_contacts.innerHTML="all contacts ";
} else {
	page4_account1_line1.innerHTML="线路1";
	page4_account1_line2.innerHTML="线路2";
	page4_account1_line3.innerHTML="线路3";
	page4_account1_empty.innerHTML="空";
	page4_account1_all_contacts.innerHTML="所有联系人";
}

//账号二路线选项定义
page4_account2_line1 = document.createElement("OPTION");
page4_account2_line1.value="line1";
page4_account2_line2 = document.createElement("OPTION");
page4_account2_line2.value="line2";
page4_account2_line3 = document.createElement("OPTION");
page4_account2_line3.value="line3";
page4_account2_empty = document.createElement("OPTION");
page4_account2_empty.value="empty";
page4_account2_all_contacts = document.createElement("OPTION");
page4_account2_all_contacts.value="all_contacts";

if (document.cookie.split("=")[1] == "en") {
	page4_account2_line1.innerHTML="line1";
	page4_account2_line2.innerHTML="line2";
	page4_account2_line3.innerHTML="line3";
	page4_account2_empty.innerHTML="N/A";
	page4_account2_all_contacts.innerHTML="all contacts ";
} else {
	page4_account2_line1.innerHTML="线路1";
	page4_account2_line2.innerHTML="线路2";
	page4_account2_line3.innerHTML="线路3";
	page4_account2_empty.innerHTML="空";
	page4_account2_all_contacts.innerHTML="所有联系人";
}

//账号三路线选项定义
page4_account3_line1 = document.createElement("OPTION");
page4_account3_line1.value="line1";
page4_account3_line2 = document.createElement("OPTION");
page4_account3_line2.value="line2";
page4_account3_line3 = document.createElement("OPTION");
page4_account3_line3.value="line3";
page4_account3_empty = document.createElement("OPTION");
page4_account3_empty.value="empty";
page4_account3_all_contacts = document.createElement("OPTION");
page4_account3_all_contacts.value="all_contacts";

if (document.cookie.split("=")[1] == "en") {
	page4_account3_line1.innerHTML="line1";
	page4_account3_line2.innerHTML="line2";
	page4_account3_line3.innerHTML="line3";
	page4_account3_empty.innerHTML="N/A";
	page4_account3_all_contacts.innerHTML="all contacts ";
} else {
	page4_account3_line1.innerHTML="线路1";
	page4_account3_line2.innerHTML="线路2";
	page4_account3_line3.innerHTML="线路3";
	page4_account3_empty.innerHTML="空";
	page4_account3_all_contacts.innerHTML="所有联系人";
}

//点击标签四
function tabfour() {
	if(content_4.style.display == "none" || content_4.style.display == ""){
		content_1.style.display = "none";
		content_2.style.display = "none";
		content_3.style.display = "none";
		content_4.style.display = "block";
		content_5.style.display = "none";
		content_6.style.display = "none";
		content_7.style.display = "none";
		content_8.style.display = "none";
	}

	if(tab_4){
		tab_1.style.background = "";
		tab_1.style.color = "";
		tab_2.style.background = "";
		tab_2.style.color = "";
		tab_3.style.background = "";
		tab_3.style.color = "";
		tab_4.style.background = "#fafafa";
		tab_4.style.color = "#000000";
		tab_5.style.background = "";
		tab_5.style.color = "";
		tab_6.style.background = "";
		tab_6.style.color = "";
		tab_7.style.background = "";
		tab_7.style.color = "";
		tab_8.style.background = "";
		tab_8.style.color = "";
	}
	//page4_account_type_select();
	$.get("php/page4.php",function(data,status){
		if (status == "success") {
			var json = JSON.parse(data);
			console.log(json.data.account1_line_select);
			console.log(json.data.account2_line_select);
			console.log(json.data.account3_line_select);
			page4_set_data(json.data);
		}
	});
}

//数据初始化
function page4_set_data(data) {
	account1_value_select(data.account1_type);
	_page4_account1_value.value = data.account1_value;
	_page4_account1_lable.value = data.account1_lable;
	account1_value_line_select(data.account1_line_select);
	_page4_account1_extension.value = data.account1_extension;

	account2_value_select(data.account2_type);
	_page4_account2_value.value = data.account2_value;
	_page4_account2_lable.value = data.account2_lable;
	account2_value_line_select(data.account2_line_select);
	_page4_account2_extension.value = data.account2_extension;

	account3_value_select(data.account3_type);
	_page4_account3_value.value = data.account3_value;
	_page4_account3_lable.value = data.account3_lable;
	account3_value_line_select(data.account3_line_select);
	_page4_account3_extension.value = data.account3_extension;
}

function page4_account_type_select(name,value) {
	switch (name) {
	case "page4_account1_type":
		account1_value_select(value);
		break;
	case "page4_account2_type":
		console.log(name);
		account2_value_select(value);
		break;
	case "page4_account3_type":
		console.log(name);
		account3_value_select(value);
		break;
	default:
		break;
	}
}

function account1_value_select(value) {
	switch (value) {
	case "empty"://xxxx na
		$("select[name='page4_account1_type'] option[value= 'empty']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = true;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "line"://xvvx line
		$("select[name='page4_account1_type'] option[value= 'line']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = false;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_line1);
		_page4_account1_line_select.add(page4_account1_line2);
		_page4_account1_line_select.add(page4_account1_line3);
		page4_account1_line1.selected= true
		_page4_account1_extension.disabled = true;
		break;
	case "speed_dial"://vvvx line
		$("select[name='page4_account1_type'] option[value= 'speed_dial']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = false;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_line1);
		_page4_account1_line_select.add(page4_account1_line2);
		_page4_account1_line_select.add(page4_account1_line3);
		page4_account1_line1.selected= true
		_page4_account1_extension.disabled = true;
		break;
	case "retrieve_park"://vvvx line
		$("select[name='page4_account1_type'] option[value= 'retrieve_park']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = false;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_line1);
		_page4_account1_line_select.add(page4_account1_line2);
		_page4_account1_line_select.add(page4_account1_line3);
		page4_account1_line1.selected= true
		_page4_account1_extension.disabled = true;
		break;
	case "blf"://vvvv line
		$("select[name='page4_account1_type'] option[value= 'blf']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = false;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_line1);
		_page4_account1_line_select.add(page4_account1_line2);
		_page4_account1_line_select.add(page4_account1_line3);
		page4_account1_line1.selected= true
		_page4_account1_extension.disabled = false;
		break;
	case "blf_list"://xxxx line
		$("select[name='page4_account1_type'] option[value= 'blf_list']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = true;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_line1);
		_page4_account1_line_select.add(page4_account1_line2);
		_page4_account1_line_select.add(page4_account1_line3);
		page4_account1_line1.selected= true
		_page4_account1_extension.disabled = true;
		break;
	case "voice_mail"://vvvx line
		$("select[name='page4_account1_type'] option[value= 'voice_mail']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = false;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_line1);
		_page4_account1_line_select.add(page4_account1_line2);
		_page4_account1_line_select.add(page4_account1_line3);
		page4_account1_line1.selected= true
		_page4_account1_extension.disabled = true;
		break;
	case "pickup"://vvvx line
		$("select[name='page4_account1_type'] option[value= 'pickup']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = false;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_line1);
		_page4_account1_line_select.add(page4_account1_line2);
		_page4_account1_line_select.add(page4_account1_line3);
		page4_account1_line1.selected= true
		_page4_account1_extension.disabled = true;
		break;
	case "group_pickup"://vvvx line
		$("select[name='page4_account1_type'] option[value= 'group_pickup']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = false;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_line1);
		_page4_account1_line_select.add(page4_account1_line2);
		_page4_account1_line_select.add(page4_account1_line3);
		page4_account1_line1.selected= true
		_page4_account1_extension.disabled = true;
		break;
	case "call_park"://vvvx line
		$("select[name='page4_account1_type'] option[value= 'call_park']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = false;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_line1);
		_page4_account1_line_select.add(page4_account1_line2);
		_page4_account1_line_select.add(page4_account1_line3);
		page4_account1_line1.selected= true
		_page4_account1_extension.disabled = true;
		break;
	case "intercom"://vvvx line
		$("select[name='page4_account1_type'] option[value= 'intercom']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = false;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_line1);
		_page4_account1_line_select.add(page4_account1_line2);
		_page4_account1_line_select.add(page4_account1_line3);
		page4_account1_line1.selected= true
		_page4_account1_extension.disabled = true;
		break;
	case "dtmf"://vvxx na
		$("select[name='page4_account1_type'] option[value= 'dtmf']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "prefix"://vvxx na
		$("select[name='page4_account1_type'] option[value= 'prefix']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "xml_browser"://vvxx na
		$("select[name='page4_account1_type'] option[value= 'xml_browser']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "conference"://vvxx na
		$("select[name='page4_account1_type'] option[value= 'conference']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "forward"://vvxx na
		$("select[name='page4_account1_type'] option[value= 'forward']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "transfer"://vvxx na
		$("select[name='page4_account1_type'] option[value= 'transfer']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "url_record"://vvxx na
		$("select[name='page4_account1_type'] option[value= 'url_record']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "url"://vvxx na
		$("select[name='page4_account1_type'] option[value= 'url']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "local_group"://xvvx	all contacts
		$("select[name='page4_account1_type'] option[value= 'local_group']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = false;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_all_contacts);
		_page4_account1_extension.disabled = true;
		break;
	case "xml_group"://xvvx na
		$("select[name='page4_account1_type'] option[value= 'xml_group']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = false;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "hold"://xvxx na
		$("select[name='page4_account1_type'] option[value= 'hold']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "dnd"://xvxx na
		$("select[name='page4_account1_type'] option[value= 'dnd']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "recall"://xvxx na
		$("select[name='page4_account1_type'] option[value= 'recall']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "sms"://xvxx na
		$("select[name='page4_account1_type'] option[value= 'sms']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "record"://xvxx na
		$("select[name='page4_account1_type'] option[value= 'record']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "paging"://vvxv na
		$("select[name='page4_account1_type'] option[value= 'paging']").attr("selected","selected");
		_page4_account1_value.disabled = false;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = false;
		break;
	case "group_listening"://xvxx na
		$("select[name='page4_account1_type'] option[value= 'group_listening']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "private_hold"://xvxx na
		$("select[name='page4_account1_type'] option[value= 'private_hold']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "hot_desking"://xvxx na
		$("select[name='page4_account1_type'] option[value= 'hot_desking']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "acd"://xvxx na
		$("select[name='page4_account1_type'] option[value= 'acd']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "zero_touch"://xvxx na
		$("select[name='page4_account1_type'] option[value= 'zero_touch']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "phone_lock"://xvxx na
		$("select[name='page4_account1_type'] option[value= 'phone_lock']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "directory"://xvxx na
		$("select[name='page4_account1_type'] option[value= 'directory']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;
	case "paging_list"://xvxx na
		$("select[name='page4_account1_type'] option[value= 'paging_list']").attr("selected","selected");
		_page4_account1_value.disabled = true;
		_page4_account1_lable.disabled = false;
		_page4_account1_line_select.disabled = true;
		$("#page4_account1_line_select").empty();
		_page4_account1_line_select.add(page4_account1_empty);
		_page4_account1_extension.disabled = true;
		break;

	default:
		break;
	}
}

function account1_value_line_select(value) {
	switch (value) {
	case "line1":
		$("select[name='page4_account1_line_select'] option[value= 'line1']").attr("selected","selected");
		break;
	case "line2":
		$("select[name='page4_account1_line_select'] option[value= 'line2']").attr("selected","selected");
		break;
	case "line3":
		$("select[name='page4_account1_line_select'] option[value= 'line3']").attr("selected","selected");
		break;
	case "empty":
		$("select[name='page4_account1_line_select'] option[value= 'empty']").attr("selected","selected");
		break;
	case "all_contacts":
		$("select[name='page4_account1_line_select'] option[value= 'all_contacts']").attr("selected","selected");
		break;
	default:
		break;
	}
}


function account2_value_select(value) {
	switch (value) {
	case "empty"://xxxx na
		$("select[name='page4_account2_type'] option[value= 'empty']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = true;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "line"://xvvx line
		$("select[name='page4_account2_type'] option[value= 'line']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = false;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_line1);
		_page4_account2_line_select.add(page4_account2_line2);
		_page4_account2_line_select.add(page4_account2_line3);
		page4_account2_line1.selected= true
		_page4_account2_extension.disabled = true;
		break;
	case "speed_dial"://vvvx line
		$("select[name='page4_account2_type'] option[value= 'speed_dial']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = false;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_line1);
		_page4_account2_line_select.add(page4_account2_line2);
		_page4_account2_line_select.add(page4_account2_line3);
		page4_account2_line1.selected= true
		_page4_account2_extension.disabled = true;
		break;
	case "retrieve_park"://vvvx line
		$("select[name='page4_account2_type'] option[value= 'retrieve_park']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = false;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_line1);
		_page4_account2_line_select.add(page4_account2_line2);
		_page4_account2_line_select.add(page4_account2_line3);
		page4_account2_line1.selected= true
		_page4_account2_extension.disabled = true;
		break;
	case "blf"://vvvv line
		$("select[name='page4_account2_type'] option[value= 'blf']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = false;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_line1);
		_page4_account2_line_select.add(page4_account2_line2);
		_page4_account2_line_select.add(page4_account2_line3);
		page4_account2_line1.selected= true
		_page4_account2_extension.disabled = false;
		break;
	case "blf_list"://xxxx line
		$("select[name='page4_account2_type'] option[value= 'blf_list']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = true;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_line1);
		_page4_account2_line_select.add(page4_account2_line2);
		_page4_account2_line_select.add(page4_account2_line3);
		page4_account2_line1.selected= true
		_page4_account2_extension.disabled = true;
		break;
	case "voice_mail"://vvvx line
		$("select[name='page4_account2_type'] option[value= 'voice_mail']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = false;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_line1);
		_page4_account2_line_select.add(page4_account2_line2);
		_page4_account2_line_select.add(page4_account2_line3);
		page4_account2_line1.selected= true
		_page4_account2_extension.disabled = true;
		break;
	case "pickup"://vvvx line
		$("select[name='page4_account2_type'] option[value= 'pickup']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = false;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_line1);
		_page4_account2_line_select.add(page4_account2_line2);
		_page4_account2_line_select.add(page4_account2_line3);
		page4_account2_line1.selected= true
		_page4_account2_extension.disabled = true;
		break;
	case "group_pickup"://vvvx line
		$("select[name='page4_account2_type'] option[value= 'group_pickup']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = false;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_line1);
		_page4_account2_line_select.add(page4_account2_line2);
		_page4_account2_line_select.add(page4_account2_line3);
		page4_account2_line1.selected= true
		_page4_account2_extension.disabled = true;
		break;
	case "call_park"://vvvx line
		$("select[name='page4_account2_type'] option[value= 'call_park']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = false;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_line1);
		_page4_account2_line_select.add(page4_account2_line2);
		_page4_account2_line_select.add(page4_account2_line3);
		page4_account2_line1.selected= true
		_page4_account2_extension.disabled = true;
		break;
	case "intercom"://vvvx line
		$("select[name='page4_account2_type'] option[value= 'intercom']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = false;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_line1);
		_page4_account2_line_select.add(page4_account2_line2);
		_page4_account2_line_select.add(page4_account2_line3);
		page4_account2_line1.selected= true
		_page4_account2_extension.disabled = true;
		break;
	case "dtmf"://vvxx na
		$("select[name='page4_account2_type'] option[value= 'dtmf']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "prefix"://vvxx na
		$("select[name='page4_account2_type'] option[value= 'prefix']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "xml_browser"://vvxx na
		$("select[name='page4_account2_type'] option[value= 'xml_browser']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "conference"://vvxx na
		$("select[name='page4_account2_type'] option[value= 'conference']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "forward"://vvxx na
		$("select[name='page4_account2_type'] option[value= 'forward']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "transfer"://vvxx na
		$("select[name='page4_account2_type'] option[value= 'transfer']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "url_record"://vvxx na
		$("select[name='page4_account2_type'] option[value= 'url_record']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "url"://vvxx na
		$("select[name='page4_account2_type'] option[value= 'url']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "local_group"://xvvx	all contacts
		$("select[name='page4_account2_type'] option[value= 'local_group']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = false;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_all_contacts);
		_page4_account2_extension.disabled = true;
		break;
	case "xml_group"://xvvx na
		$("select[name='page4_account2_type'] option[value= 'xml_group']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = false;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "hold"://xvxx na
		$("select[name='page4_account2_type'] option[value= 'hold']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "dnd"://xvxx na
		$("select[name='page4_account2_type'] option[value= 'dnd']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "recall"://xvxx na
		$("select[name='page4_account2_type'] option[value= 'recall']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "sms"://xvxx na
		$("select[name='page4_account2_type'] option[value= 'sms']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "record"://xvxx na
		$("select[name='page4_account2_type'] option[value= 'record']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "paging"://vvxv na
		$("select[name='page4_account2_type'] option[value= 'paging']").attr("selected","selected");
		_page4_account2_value.disabled = false;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = false;
		break;
	case "group_listening"://xvxx na
		$("select[name='page4_account2_type'] option[value= 'group_listening']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "private_hold"://xvxx na
		$("select[name='page4_account2_type'] option[value= 'private_hold']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "hot_desking"://xvxx na
		$("select[name='page4_account2_type'] option[value= 'hot_desking']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "acd"://xvxx na
		$("select[name='page4_account2_type'] option[value= 'acd']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "zero_touch"://xvxx na
		$("select[name='page4_account2_type'] option[value= 'zero_touch']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "phone_lock"://xvxx na
		$("select[name='page4_account2_type'] option[value= 'phone_lock']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "directory"://xvxx na
		$("select[name='page4_account2_type'] option[value= 'directory']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;
	case "paging_list"://xvxx na
		$("select[name='page4_account2_type'] option[value= 'paging_list']").attr("selected","selected");
		_page4_account2_value.disabled = true;
		_page4_account2_lable.disabled = false;
		_page4_account2_line_select.disabled = true;
		$("#page4_account2_line_select").empty();
		_page4_account2_line_select.add(page4_account2_empty);
		_page4_account2_extension.disabled = true;
		break;

	default:
		break;
	}
}

function account2_value_line_select(value) {
	switch (value) {
	case "line1":
		$("select[name='page4_account2_line_select'] option[value= 'line1']").attr("selected","selected");
		break;
	case "line2":
		$("select[name='page4_account2_line_select'] option[value= 'line2']").attr("selected","selected");
		break;
	case "line3":
		$("select[name='page4_account2_line_select'] option[value= 'line3']").attr("selected","selected");
		break;
	case "empty":
		$("select[name='page4_account2_line_select'] option[value= 'empty']").attr("selected","selected");
		break;
	case "all_contacts":
		$("select[name='page4_account2_line_select'] option[value= 'all_contacts']").attr("selected","selected");
		break;

	default:
		break;
	}
}


function account3_value_select(value) {
	switch (value) {
	case "empty"://xxxx na
		$("select[name='page4_account3_type'] option[value= 'empty']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = true;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "line"://xvvx line
		$("select[name='page4_account3_type'] option[value= 'line']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = false;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_line1);
		_page4_account3_line_select.add(page4_account3_line2);
		_page4_account3_line_select.add(page4_account3_line3);
		page4_account3_line1.selected= true
		_page4_account3_extension.disabled = true;
		break;
	case "speed_dial"://vvvx line
		$("select[name='page4_account3_type'] option[value= 'speed_dial']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = false;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_line1);
		_page4_account3_line_select.add(page4_account3_line2);
		_page4_account3_line_select.add(page4_account3_line3);
		page4_account3_line1.selected= true
		_page4_account3_extension.disabled = true;
		break;
	case "retrieve_park"://vvvx line
		$("select[name='page4_account3_type'] option[value= 'retrieve_park']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = false;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_line1);
		_page4_account3_line_select.add(page4_account3_line2);
		_page4_account3_line_select.add(page4_account3_line3);
		page4_account3_line1.selected= true
		_page4_account3_extension.disabled = true;
		break;
	case "blf"://vvvv line
		$("select[name='page4_account3_type'] option[value= 'blf']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = false;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_line1);
		_page4_account3_line_select.add(page4_account3_line2);
		_page4_account3_line_select.add(page4_account3_line3);
		page4_account3_line1.selected= true
		_page4_account3_extension.disabled = false;
		break;
	case "blf_list"://xxxx line
		$("select[name='page4_account3_type'] option[value= 'blf_list']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = true;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_line1);
		_page4_account3_line_select.add(page4_account3_line2);
		_page4_account3_line_select.add(page4_account3_line3);
		page4_account3_line1.selected= true
		_page4_account3_extension.disabled = true;
		break;
	case "voice_mail"://vvvx line
		$("select[name='page4_account3_type'] option[value= 'voice_mail']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = false;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_line1);
		_page4_account3_line_select.add(page4_account3_line2);
		_page4_account3_line_select.add(page4_account3_line3);
		page4_account3_line1.selected= true
		_page4_account3_extension.disabled = true;
		break;
	case "pickup"://vvvx line
		$("select[name='page4_account3_type'] option[value= 'pickup']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = false;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_line1);
		_page4_account3_line_select.add(page4_account3_line2);
		_page4_account3_line_select.add(page4_account3_line3);
		page4_account3_line1.selected= true
		_page4_account3_extension.disabled = true;
		break;
	case "group_pickup"://vvvx line
		$("select[name='page4_account3_type'] option[value= 'group_pickup']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = false;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_line1);
		_page4_account3_line_select.add(page4_account3_line2);
		_page4_account3_line_select.add(page4_account3_line3);
		page4_account3_line1.selected= true
		_page4_account3_extension.disabled = true;
		break;
	case "call_park"://vvvx line
		$("select[name='page4_account3_type'] option[value= 'call_park']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = false;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_line1);
		_page4_account3_line_select.add(page4_account3_line2);
		_page4_account3_line_select.add(page4_account3_line3);
		page4_account3_line1.selected= true
		_page4_account3_extension.disabled = true;
		break;
	case "intercom"://vvvx line
		$("select[name='page4_account3_type'] option[value= 'intercom']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = false;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_line1);
		_page4_account3_line_select.add(page4_account3_line2);
		_page4_account3_line_select.add(page4_account3_line3);
		page4_account3_line1.selected= true
		_page4_account3_extension.disabled = true;
		break;
	case "dtmf"://vvxx na
		$("select[name='page4_account3_type'] option[value= 'dtmf']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "prefix"://vvxx na
		$("select[name='page4_account3_type'] option[value= 'prefix']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "xml_browser"://vvxx na
		$("select[name='page4_account3_type'] option[value= 'xml_browser']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "conference"://vvxx na
		$("select[name='page4_account3_type'] option[value= 'conference']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "forward"://vvxx na
		$("select[name='page4_account3_type'] option[value= 'forward']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "transfer"://vvxx na
		$("select[name='page4_account3_type'] option[value= 'transfer']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "url_record"://vvxx na
		$("select[name='page4_account3_type'] option[value= 'url_record']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "url"://vvxx na
		$("select[name='page4_account3_type'] option[value= 'url']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "local_group"://xvvx	all contacts
		$("select[name='page4_account3_type'] option[value= 'local_group']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = false;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_all_contacts);
		_page4_account3_extension.disabled = true;
		break;
	case "xml_group"://xvvx na
		$("select[name='page4_account3_type'] option[value= 'xml_group']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = false;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "hold"://xvxx na
		$("select[name='page4_account3_type'] option[value= 'hold']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "dnd"://xvxx na
		$("select[name='page4_account3_type'] option[value= 'dnd']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "recall"://xvxx na
		$("select[name='page4_account3_type'] option[value= 'recall']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "sms"://xvxx na
		$("select[name='page4_account3_type'] option[value= 'sms']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "record"://xvxx na
		$("select[name='page4_account3_type'] option[value= 'record']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "paging"://vvxv na
		$("select[name='page4_account3_type'] option[value= 'paging']").attr("selected","selected");
		_page4_account3_value.disabled = false;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = false;
		break;
	case "group_listening"://xvxx na
		$("select[name='page4_account3_type'] option[value= 'group_listening']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "private_hold"://xvxx na
		$("select[name='page4_account3_type'] option[value= 'private_hold']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "hot_desking"://xvxx na
		$("select[name='page4_account3_type'] option[value= 'hot_desking']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "acd"://xvxx na
		$("select[name='page4_account3_type'] option[value= 'acd']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "zero_touch"://xvxx na
		$("select[name='page4_account3_type'] option[value= 'zero_touch']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "phone_lock"://xvxx na
		$("select[name='page4_account3_type'] option[value= 'phone_lock']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "directory"://xvxx na
		$("select[name='page4_account3_type'] option[value= 'directory']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;
	case "paging_list"://xvxx na
		$("select[name='page4_account3_type'] option[value= 'paging_list']").attr("selected","selected");
		_page4_account3_value.disabled = true;
		_page4_account3_lable.disabled = false;
		_page4_account3_line_select.disabled = true;
		$("#page4_account3_line_select").empty();
		_page4_account3_line_select.add(page4_account3_empty);
		_page4_account3_extension.disabled = true;
		break;

	default:
		break;
	}
}

function account3_value_line_select(value) {
	switch (value) {
	case "line1":
		$("select[name='page4_account3_line_select'] option[value= 'line1']").attr("selected","selected");
		break;
	case "line2":
		$("select[name='page4_account3_line_select'] option[value= 'line2']").attr("selected","selected");
		break;
	case "line3":
		$("select[name='page4_account3_line_select'] option[value= 'line3']").attr("selected","selected");
		break;
	case "empty":
		$("select[name='page4_account3_line_select'] option[value= 'empty']").attr("selected","selected");
		break;
	case "all_contacts":
		$("select[name='page4_account3_line_select'] option[value= 'all_contacts']").attr("selected","selected");
		break;

	default:
		break;
	}
}




/*点击确定，提交数据*/
page4_submit = document.getElementById('page4_submit');
page4_submit.onclick = function(){
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {
        if(xhr.readyState==4 && xhr.status == 200){
        	var json = JSON.parse(xhr.responseText);
        	if(json.flag == "1"){
        		alert("保存成功！");
        	}else if(json.flag == "0"){
        		alert("保存失败！");
        	}
        	//console.log(xhr.responseText);
        }
    }

    var data = 'flag='+"0"
			    +'&page4_account1_type='+		_page4_account1_type.value
				+'&page4_account1_value='+		_page4_account1_value.value
				+'&page4_account1_lable='+		_page4_account1_lable.value
				+'&page4_account1_line_select='+_page4_account1_line_select.value
				+'&page4_account1_extension='+	_page4_account1_extension.value
				+'&page4_account2_type='+		_page4_account2_type.value
				+'&page4_account2_value='+		_page4_account2_value.value
				+'&page4_account2_lable='+		_page4_account2_lable.value
				+'&page4_account2_line_select='+_page4_account2_line_select.value
				+'&page4_account2_extension='+	_page4_account2_extension.value
				+'&page4_account3_type='+		_page4_account3_type.value
				+'&page4_account3_value='+		_page4_account3_value.value
				+'&page4_account3_lable='+		_page4_account3_lable.value
				+'&page4_account3_line_select='+_page4_account3_line_select.value
				+'&page4_account3_extension='+	_page4_account3_extension.value;
    var url = 'php/page4_submit.php';
    xhr.open('post',url,true);

    xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');

    xhr.send(data);
    return false;
}

/*取消按键*/
page4_cancel = document.getElementById('page4_cancel');
page4_cancel.onclick = function(){
	location.reload();
}

