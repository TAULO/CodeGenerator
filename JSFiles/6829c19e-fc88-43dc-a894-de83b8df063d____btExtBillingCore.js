var BILLING_CGI="/cgi-bin/phoenix/BillingCGI.fcg";
function ExtensionBilling() {
this.superApplication();
this.name("Billing");
this.i_window=undefined;
this.i_window_blocked=false;
this.i_files={
"settings" : ["./Extension.Billing.css"],
"preferences" : ["./Extension.Billing.css"],
"cards" : ["./src/Extensions/Billing/objects/Object.BillingCreditCard.js",
"./src/Extensions/Billing/objects/Object.BillingCreditCardList.js"]
}
ExtensionBilling.popup_close_handler=undefined;
ExtensionBilling.has_contacts=false;
ExtensionBilling.has_features=false;
ExtensionBilling.obj=this;
EventHandler.register(this, "onintegrate", this.initialize, this);
}
ExtensionBilling.prototype.initialize=function() {
for(var x=0; x < app_ids.length;++x) {
if(app_ids[x]=="2005") {
ExtensionBilling.has_contacts=true;
} else if(app_ids[x]=="3005") {
ExtensionBilling.has_features=true;
}
}
if(ExtensionBilling.has_features) {
var general=Application.getApplicationById("GP");
general.registerPreference("./btExtBillingPreferences.js");
}
}
ExtensionBilling.prototype.createCard=function(close_handler,
featuretisement, auto_close, is_callback, contact) {
if(is_callback) {
var params=[];
if(contact!=undefined) {
params.push(["first_name", contact.get("N-GIVEN")]);
params.push(["last_name", contact.get("N-FAMILY")]);
params.push(["company", contact.get("ORG-COMPANY")]);
if(contact.get("ADR-WORK-STREET")!=undefined) {
params.push(["country", contact.get("ADR-WORK-CTRY")]);
params.push(["address1", contact.get("ADR-WORK-STREET")]);
params.push(["address2", contact.get("ADR-WORK-POBOX")]);
params.push(["city", contact.get("ADR-WORK-LOCALITY")]);
params.push(["state", contact.get("ADR-WORK-REGION")]);
params.push(["postal_code", contact.get("ADR-WORK-PCODE")]);
} else if(contact.get("ADR-HOME-STREET")!=undefined) {
params.push(["country", contact.get("ADR-HOME-CTRY")]);
params.push(["address1", contact.get("ADR-HOME-STREET")]);
params.push(["address2", contact.get("ADR-HOME-POBOX")]);
params.push(["city", contact.get("ADR-HOME-LOCALITY")]);
params.push(["state", contact.get("ADR-HOME-REGION")]);
params.push(["postal_code", contact.get("ADR-HOME-PCODE")]);
}
if(contact.get("TEL-WORK-NUMBER1")!=undefined) {
params.push(["phone", contact.get("TEL-WORK-NUMBER1")]);
} else if(contact.get("TEL-HOME-NUMBER1")!=undefined) {
params.push(["phone", contact.get("TEL-HOME-NUMBER1")]);
}
}
this.openCardWindow(params, featuretisement, auto_close,
close_handler);
} else {
this.preopenCardWindow(featuretisement);
ExtensionBilling.store.getContact(new SmartHandler(this,
this.createCard, Array(close_handler, featuretisement,
auto_close, true), true, true));
}
}
ExtensionBilling.prototype.modifyCard=function(card, close_handler,
featuretisement, auto_close) {
var params=[];
if(card!=undefined) {
params.push(["id", card.getId()]);
}
this.preopenCardWindow(featuretisement);
if(!this.i_window_blocked) {
this.openCardWindow(params, featuretisement, auto_close,
close_handler);
}
}
ExtensionBilling.prototype.preopenCardWindow=function(featuretisement) {
if(!this.i_window_blocked) {
var url="https://"+document.domain+user_prefs.root_dir+"/gds/blank.html";
var height=515;
height+=80;
if(featuretisement!=undefined) {
height+=110;
}
this.i_window=window.open(url, "BillingCard", "width=485, height="+height+", resizable=yes, scrollbars=yes");
if(this.i_window!=undefined) {
this.i_window.focus();
} else {
this.i_window_blocked=true;
DialogManager.alert("There was a problem opening the credit "+"card window. Please make sure that popup blocking is "+"disabled in your browser and try again.");
}
}
}
ExtensionBilling.prototype.openCardWindow=function(add_params,
featuretisement, auto_close, close_handler) {
if(!this.i_window_blocked && this.i_window!=undefined &&
!this.i_window.closed) {
ExtensionBilling.popup_close_handler=close_handler;
if(auto_close==undefined) {
auto_close=true;
}
var params=[["unm", user_prefs.user_name],
["sid", user_prefs.session_id],
["user_id", user_prefs.user_id],
["secure", window.secure],
["featuretisement", featuretisement],
["auto_close", (auto_close ? "1" : "0")],
["root_dir", user_prefs.root_dir]];
if(add_params!=undefined) {
for(var x=0; x < add_params.length;++x) {
params.push(add_params[x]);
}
}
var param_str="";
for(var x=0; x < params.length;++x) {
var param=params[x];
if(param[1]!=undefined) {
if(param_str.length > 0) {
param_str+="&";
}
param_str+=param[0]+"="+encodeURIComponent(param[1]); 
}
}
this.i_window.location="https://"+document.domain+user_prefs.root_dir+"/gds/Billing/card.php?"+param_str;
}
}
ExtensionBilling.closePopup=function(card, win) {
if(ExtensionBilling.popup_close_handler!=undefined) {
if(win!=undefined) {
ExtensionBilling.popup_close_handler.execute(Array(card, win),
true);
} else {
setTimeout(function() {
ExtensionBilling.popup_close_handler.execute(Array(card,
win), true); }, 0);
}
}
}
ExtensionBilling.updateCard=function(old_card_id, card) {
if(ExtensionBilling.cache.enterprise_cards!=undefined) {
ExtensionBilling.cache.enterprise_cards.deleteCard(old_card_id);
if(card.isEnterpriseCard()) {
ExtensionBilling.cache.enterprise_cards.addCard(card);
}
}
if(ExtensionBilling.cache.user_cards!=undefined) {
ExtensionBilling.cache.user_cards.deleteCard(old_card_id);
if(!card.isEnterpriseCard()) {
ExtensionBilling.cache.user_cards.addCard(card);
}
}
}
ExtensionBilling.addCard=function(card) {
if(card.isEnterpriseCard()) {
if(ExtensionBilling.cache.enterprise_cards!=undefined) {
ExtensionBilling.cache.enterprise_cards.addCard(card);
}
} else {
if(ExtensionBilling.cache.user_cards!=undefined) {
ExtensionBilling.cache.user_cards.addCard(card);
}
}
}
ExtensionBilling.cache={};
ExtensionBilling.cache.enterprise_cards=undefined;
ExtensionBilling.cache.user_cards=undefined;
ExtensionBilling.cache.contact=undefined;
ExtensionBilling.store={};
ExtensionBilling.store.enterprise_cards_pending=false;
ExtensionBilling.store.user_cards_pending=false;
ExtensionBilling.store.available_cards_handlers=[];
ExtensionBilling.store.enterprise_cards_handlers=[];
ExtensionBilling.store.user_cards_handlers=[];
ExtensionBilling.store.contact_pending=false;
ExtensionBilling.store.contact_handlers=[];
ExtensionBilling.store.getAvailableCards=function(handler) {
if(ExtensionBilling.obj.loadFiles("cards", new SmartHandler(undefined,
ExtensionBilling.store.getAvailableCards, handler))) {
if(ExtensionBilling.store.enterprise_cards_pending) {
ExtensionBilling.store.getEnterpriseCards(new SmartHandler(undefined, ExtensionBilling.store.getAvailableCards,
handler, false, true));
} else if(ExtensionBilling.store.user_cards_pending) {
ExtensionBilling.store.getUserCards(new SmartHandler(undefined, ExtensionBilling.store.getAvailableCards,
handler, false, true));
} else if(ExtensionBilling.cache.enterprise_cards==undefined &&
ExtensionBilling.cache.user_cards!=undefined) {
ExtensionBilling.store.getEnterpriseCards(new SmartHandler(undefined, ExtensionBilling.store.getAvailableCards,
handler, false, true));
} else if(ExtensionBilling.cache.user_cards==undefined &&
ExtensionBilling.cache.enterprrise_cards!=undefined) {
ExtensionBilling.store.getUserCards(new SmartHandler(undefined, ExtensionBilling.store.getAvailableCards,
handler, false, true));
} else if(ExtensionBilling.cache.user_cards!=undefined &&
ExtensionBilling.cache.enterprise_cards!=undefined) {
if(handler!=undefined) {
var user_cards=ExtensionBilling.cache.user_cards.getCards();
var enterprise_cards=ExtensionBilling.cache.enterprise_cards.getCards();
var ret=Array();
for(var x=0; x < user_cards.length;++x) {
ret.push(user_cards[x]);
}
for(var x=0; x < enterprise_cards.length;++x) {
ret.push(enterprise_cards[x]);
}
handler.execute(ret);
}
} else {
ExtensionBilling.store.enterprise_cards_pending=true;
ExtensionBilling.store.user_cards_pending=true;
if(handler!=undefined) {
ExtensionBilling.store.available_cards_handlers.push(handler);
}
var post=new ResourcePost();
post.param("unm", user_prefs.user_name);
post.param("sid", user_prefs.session_id);
post.param("xml", "<request><method>getavailablecards</method>"+"<enterpriseid>"+user_prefs.enterprise_id+"</enterpriseid><userid>"+user_prefs.user_id+"</userid></request>");
ResourceManager.request(BILLING_CGI, 1,
ExtensionBilling.store.handleAvailableCards, post);
}
}
}
ExtensionBilling.store.getEnterpriseCards=function(handler) {
if(ExtensionBilling.obj.loadFiles("cards", new SmartHandler(undefined,
ExtensionBilling.store.getEnterpriseCards, handler))) {
if(ExtensionBilling.store.enterprise_cards_pending) {
if(handler!=undefined) {
ExtensionBilling.store.enterprise_cards_handlers.push(handler);
}
} else if(ExtensionBilling.cache.enterprise_cards!=undefined) {
if(handler!=undefined) {
handler.execute(ExtensionBilling.cache.enterprise_cards.getCards());
}
} else {
ExtensionBilling.store.enterprise_cards_pending=true;
if(handler!=undefined) {
ExtensionBilling.store.enterprise_cards_handlers.push(handler);
}
ExtensionBilling.store.handleEnterpriseCards();
}
}
}
ExtensionBilling.store.getUserCards=function(handler) {
if(ExtensionBilling.obj.loadFiles("cards", new SmartHandler(undefined,
ExtensionBilling.store.getUserCards, handler))) {
if(ExtensionBilling.store.user_cards_pending) {
if(handler!=undefined) {
ExtensionBilling.store.user_cards_handlers.push(handler);
}
} else if(ExtensionBilling.cache.user_cards!=undefined) {
if(handler!=undefined) {
handler.execute(ExtensionBilling.cache.user_cards.getCards());
}
} else {
ExtensionBilling.store.user_cards_pending=true;
if(handler!=undefined) {
ExtensionBilling.store.user_cards_handlers.push(handler);
}
var post=new ResourcePost();
post.param("unm", user_prefs.user_name);
post.param("sid", user_prefs.session_id);
post.param("xml", "<request><method>getusercards</method>"+"<userid>"+user_prefs.user_id+"</userid></request>");
ResourceManager.request(BILLING_CGI, 1,
ExtensionBilling.store.handleUserCards, post);
}
}
}
ExtensionBilling.store.getUserCardById=function(id, handler) {
if(ExtensionBilling.obj.loadFiles("cards", new SmartHandler(undefined,
ExtensionBilling.store.getUserCardById, handler))) {
if(ExtensionBilling.store.user_cards_pending) {
ExtensionBilling.store.getUserCards(new SmartHandler(undefined,
ExtensionBilling.store.getUserCardById,
Array(id, handler), true, true));
} else if(ExtensionBilling.cache.user_cards!=undefined) {
if(handler!=undefined) {
var ret=undefined;
var cards=ExtensionBilling.cache.user_cards.getCards();
for(var x=0; x < cards.length;++x) {
if(cards[x].getId()==id) {
ret=cards[x];
break;
}
}
handler.execute(ret);
}
} else {
var note=Notifications.add("Retrieving billing information");
var post=new ResourcePost();
post.param("unm", user_prefs.user_name);
post.param("sid", user_prefs.session_id);
post.param("xml", "<request><method>getusercardbyid</method>"+"<cardid>"+id+"</cardid><userid>"+user_prefs.user_id+"</userid></request>");
ResourceManager.request(BILLING_CGI, 1,
ExtensionBilling.store.handleCard, post,
Array(handler, note));
}
}
}
ExtensionBilling.store.deleteUserCard=function(id, handler) {
var note=Notifications.add("Deleting credit card");
var post=new ResourcePost();
post.param("unm", user_prefs.user_name);
post.param("sid", user_prefs.session_id);
post.param("xml", "<request><method>deleteusercard</method><userid>"+user_prefs.user_id+"</userid><cardid>"+id+"</cardid></request>");
ResourceManager.request(BILLING_CGI, 1,
ExtensionBilling.store.handleDeleteCard, post, 
Array(id, handler, note));
}
ExtensionBilling.store.getContact=function(handler) {
if(ExtensionBilling.cache.contact!=undefined) {
if(handler!=undefined) {
handler.execute(ExtensionBilling.cache.contact);
}
} else if(ExtensionBilling.store.contact_pending) {
if(handler!=undefined) {
ExtensionBilling.store.contact_handlers.push(handler);
}
} else {
if(ExtensionBilling.has_contacts && SimpleClickDataCache.isLoaded) {
ExtensionBilling.store.contact_pending=true;
if(handler!=undefined) {
ExtensionBilling.store.contact_handlers.push(handler);
}
var user=SimpleClickDataCache.findUser("self");
contactsApp.commands.contacts_GetContact(user.uuid,
"root.ExtensionBilling.store.handleContact()");
} else if(handler!=undefined) {
handler.execute(undefined);
}
}
}
ExtensionBilling.store.handleAvailableCards=function(data, xml, req) {
var cards=ExtensionBilling.store.readCardsFromJSON(data, xml, req);
var user_cards=undefined;
var enterprise_cards=undefined;
var need_user_cards=true;
var need_enterprise_cards=true;
var available_handlers=ExtensionBilling.store.available_cards_handlers;
var enterprise_handlers=ExtensionBilling.store.enterprise_cards_handlers;
var user_handlers=ExtensionBilling.store.user_cards_handlers;
if(ExtensionBilling.cache.enterprise_cards!=undefined) {
need_enterprise_cards=false;
}
if(ExtensionBilling.cache.user_cards!=undefined) {
need_user_cards=false;
}
if(cards!=undefined) {
if(need_enterprise_cards) {
ExtensionBilling.cache.enterprise_cards=new BillingCreditCardList();
enterprise_cards=Array();
}
if(need_user_cards) {
ExtensionBilling.cache.user_cards=new BillingCreditCardList();
user_cards=Array();
}
for(var x=0; x < cards.length;++x) {
var card=cards[x];
if(card.isEnterpriseCard()) {
ExtensionBilling.cache.enterprise_cards.addCard(card);
enterprise_cards.push(card);
} else {
ExtensionBilling.cache.user_cards.addCard(card);
user_cards.push(card);
}
}
}	
ExtensionBilling.store.enterprise_cards_pending=false;
ExtensionBilling.store.user_cards_pending=false;
for(var x=0; x < available_handlers.length;++x) {
available_handlers[x].execute(cards);
}
for(var x=0; x < enterprise_handlers.length;++x) {
enterprise_handlers[x].execute(enterprise_cards);
}
for(var x=0; x < user_handlers.length;++x) {
user_handlers[x].execute(user_cards);
}
}
ExtensionBilling.store.handleEnterpriseCards=function(data, xml, req) {
var cards=Array();
var handlers=ExtensionBilling.store.enterprise_cards_handlers;
if(cards!=undefined) {
ExtensionBilling.cache.enterprise_cards=new BillingCreditCardList(cards);
}
ExtensionBilling.store.enterprise_cards_pending=false;
for(var x=0; x < handlers.length;++x) {
handlers[x].execute(cards);
}
}
ExtensionBilling.store.handleUserCards=function(data, xml, req) {
var cards=ExtensionBilling.store.readCardsFromJSON(data, xml, req);
var handlers=ExtensionBilling.store.user_cards_handlers;
if(cards!=undefined) {
ExtensionBilling.cache.user_cards=new BillingCreditCardList(cards);
}
ExtensionBilling.store.user_cards_pending=false;
for(var x=0; x < handlers.length;++x) {
handlers[x].execute(cards);
}
}
ExtensionBilling.store.readCardsFromJSON=function(data, xml, req) {
var success=false;
var timeout=false;
var cards=undefined;
if(data.length > 0) {
try {
var result=eval("("+data+")");
if(result.code=="20000000" && result.desc=="Success") {
cards=[];
for(var i=0; i < result.cl.length; i++) {
var card=new BillingCreditCard();
card.readFromJSON(result.cl[i]);
cards.push(card);
}
success=true;
} else if(result.code=="0" &&
result.desc=="Invalid session") {
cards=undefined;
sessionTimeout(true, true);
}
} catch(e) {
cards=undefined;
}
}
return cards;
}
ExtensionBilling.store.handleCard=function(data, xml, req, params) {
var handler=params[0];
var note=params[1];
var success=false;
var timeout=false;
var card=undefined;
if(data.length > 0) {
try {
var result=eval("("+data+")");
if(result.code=="20000000" && result.desc=="Success") {
card=new BillingCreditCard();
card.readFromJSON(result.cc);
success=true;
} else if(result.code=="0" &&
result.desc=="Invalid session") {
timeout=true;
}
} catch(e) { }
}
if(note!=undefined) {
if(success) {
Notifications.end(note);
} else {
Notifications.end(note, 3, true);
}
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute(card);
}
}
ExtensionBilling.store.handleDeleteCard=function(data, xml, req, params) {
var id=params[0];
var handler=params[1];
var note=params[2];
var success=false;
var timeout=false;
if(data.length > 0) {
try {
var result=eval("("+data+")");
if(result.code=="20000000" && result.desc=="Success") {
if(ExtensionBilling.cache.enterprise_cards!=undefined) {
ExtensionBilling.cache.enterprise_cards.deleteCard(id);
}
if(ExtensionBilling.cache.user_cards!=undefined) {
ExtensionBilling.cache.user_cards.deleteCard(id);
}
success=true;
} else if(result.code=="0" &&
result.desc=="Invalid session") {
timeout=true;
}
} catch(e) { }
}
if(success) {
Notifications.end(note);
} else {
Notifications.end(note, 3, true);
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler) {
handler.execute(success);
}
}
ExtensionBilling.store.handleContact=function(index) {
var data=contactsApp.handlers.readValidateData("GetContact", index);
if(data!=undefined) {
ExtensionBilling.cache.contact=new contactsApp.Contact();
ExtensionBilling.cache.contact.populate(data);
}
ExtensionBilling.store.contact_pending=false;
for(var i=0; i < ExtensionBilling.store.contact_handlers.length; i++) {
ExtensionBilling.store.contact_handlers[i].execute(ExtensionBilling.cache.contact);
}
}
ExtensionBilling.inherit(Application);
SystemCore.registerApplication(new ExtensionBilling());
JavaScriptResource.notifyComplete("./src/Extensions/Billing/Extension.Billing.js");
function BillingCreditCard() {
this.i_id=undefined;
this.i_type=undefined;
this.i_first_name=undefined;
this.i_last_name=undefined;
this.i_company=undefined;
this.i_address1=undefined;
this.i_address2=undefined;
this.i_city=undefined;
this.i_state=undefined;
this.i_postal_code=undefined;
this.i_country=undefined;
this.i_phone=undefined;
this.i_number=undefined;
this.i_expiration_year=undefined;
this.i_expiration_month=undefined;
this.i_enterprise_card=undefined;
this.i_single_use=undefined;
}
BillingCreditCard.types={
"1" : "Visa",
"2" : "MasterCard",
"3" : "American Express",
"4" : "Discover"
};
BillingCreditCard.factory=function() {
return new BillingCreditCard();
};
BillingCreditCard.prototype.getId=function() {
return this.i_id;
}
BillingCreditCard.prototype.getTypeId=function() {
return this.i_type;
}
BillingCreditCard.prototype.getType=function() {
return BillingCreditCard.types[this.i_type];
}
BillingCreditCard.prototype.getFirstName=function() {
return this.i_first_name;
}
BillingCreditCard.prototype.getLastName=function() {
return this.i_last_name;
}
BillingCreditCard.prototype.getFullName=function() {
return this.i_first_name+" "+this.i_last_name;
}
BillingCreditCard.prototype.getCompany=function() {
return this.i_company;
}
BillingCreditCard.prototype.getAddress1=function() {
return this.i_address1;
}
BillingCreditCard.prototype.getAddress2=function() {
return this.i_address2;
}
BillingCreditCard.prototype.getCity=function() {
return this.i_city;
}
BillingCreditCard.prototype.getState=function() {
return this.i_state;
}
BillingCreditCard.prototype.getPostalCode=function() {
return this.i_postal_code;
}
BillingCreditCard.prototype.getCountry=function() {
return this.i_country;
}
BillingCreditCard.prototype.getNumber=function() {
return this.i_number;
}
BillingCreditCard.prototype.getExpiration=function() {
return this.i_expiration_month+"/"+this.i_expiration_year;
}
BillingCreditCard.prototype.getExpirationYear=function() {
return this.i_expiration_year;
}
BillingCreditCard.prototype.getExpirationMonth=function() {
return this.i_expiration_month;
}
BillingCreditCard.prototype.isEnterpriseCard=function() {
return this.i_enterprise_card;
}
BillingCreditCard.prototype.isUserCard=function() {
return !this.isEnterpriseCard();
}
BillingCreditCard.prototype.isSingleUse=function() {
return this.i_single_use;
}
BillingCreditCard.prototype.isExpired=function() {
var today=new Date();
var ret=false;
if(this.i_expiration_year < today.getFullYear() || (this.i_expiration_year==today.getFullYear() &&
this.i_expiration_month < today.getMonth()+1)) {
ret=true;
}
return ret;
}
BillingCreditCard.prototype.readFromJSON=function(data) {
this.i_id=data.id;
this.i_type=data.tp;
this.i_first_name=data.fn;
this.i_last_name=data.ln;
this.i_company=data.cm;
this.i_address1=data.a1;
this.i_address2=data.a2;
this.i_city=data.ct;
this.i_state=data.st;
this.i_postal_code=data.pc;
this.i_country=data.cn;
this.i_phone=data.pn;
this.i_number=data.nn;
this.i_expiration_year=data.ey;
this.i_expiration_month=data.em
this.i_enterprise_card=data.ec;
this.i_single_use=data.su;
}
BillingCreditCard.readListFromXML=function(xml) {
var cards=[];
var data;
if(window.ActiveXObject) {
data=new ActiveXObject("Microsoft.XMLDOM");
data.loadXML(xml);
} else {
var parser=new DOMParser();
data=parser.parseFromString(xml, "text/xml");
}
var card_nodes=data.getElementsByTagName("creditcard");
for(var i=0; i < card_nodes.length; i++) {
var card=new BillingCreditCard();
card.readFromXML(card_nodes[i]);
cards.push(card);
}
return cards;
}
BillingCreditCard.prototype.readFromXML=function(xml) {
var data=undefined ;
if(typeof(xml)=="string") {
if(window.ActiveXObject) {
data=new ActiveXObject("Microsoft.XMLDOM");
data.loadXML(xml);
} else {
var parser=new DOMParser();
data=parser.parseFromString(xml, "text/xml");
}
} else {
data=xml;
}
var node=data.getElementsByTagName("cardid");
if(node.length > 0) {
this.i_id=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("type");
if(node.length > 0) {
this.i_type=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("firstname");
if(node.length > 0) {
this.i_first_name=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("lastname");
if(node.length > 0) {
this.i_last_name=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("address1");
if(node.length > 0) {
this.i_address1=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("address2");
if(node.length > 0) {
this.i_address2=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("city");
if(node.length > 0) {
this.i_city=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("postalcode");
if(node.length > 0) {
this.i_postal_code=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("country");
if(node.length > 0) {
this.i_country=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("phone");
if(node.length > 0) {
this.i_phone=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("number");
if(node.length > 0) {
this.i_number=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("expyear");
if(node.length > 0) {
this.i_expiration_year=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("expmonth");
if(node.length > 0) {
this.i_expiration_month=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("enterprisecard");
if(node.length > 0) {
this.i_enterprise_card=(node[0].childNodes[0].nodeValue=="1" ?
true : false);
}
node=data.getElementsByTagName("singleuse");
if(node.length > 0) {
this.i_single_use=(node[0].childNodes[0].nodeValue=="1" ?
true : false);
}
node=data.getElementsByTagName("company");
if(node.length > 0) {
this.i_company=node[0].childNodes[0].nodeValue;
}
node=data.getElementsByTagName("state");
if(node.length > 0) {
this.i_state=node[0].childNodes[0].nodeValue;
}
}
JavaScriptResource.notifyComplete("./src/Extensions/Billing/objects/Object.BillingCreditCard.js");
JavaScriptResource.notifyComplete("./btExtBillingCore.js");
