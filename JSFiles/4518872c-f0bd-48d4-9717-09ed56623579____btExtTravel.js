var ORBITZ_CGI="/cgi-bin/phoenix/OrbitzCGI.fcg";
var ORBITZ_AIR_PRE_TAG="http://ad.doubleclick.net/clk;158558125;22100996;i?";
var ORBITZ_AIR_POST_TAG="&gcid=C11287x535&WT.mc_id=e5082&WT.mc_ev=click&afsrc=1";
var ORBITZ_HOTEL_PRE_TAG="http://ad.doubleclick.net/clk;138791957;22101124;c?";
var ORBITZ_HOTEL_POST_TAG="&gcid=C11287x536&WT.mc_id=e5083&WT.mc_ev=click&afsrc=1";
var ORBITZ_TRIP_LENGTH=2;
var ORBITZ_TRIP_START=floorDay(addDay(new Date()));
function ExtensionTravel() {
this.superApplication();
this.name("Travel");
this.i_enabled=true;
this.i_calendar_interface=undefined;
this.i_email_interface=undefined;
this.i_has_calendar=undefined;
this.i_has_email=undefined;
this.i_has_feature=undefined;
this.i_search_window=undefined;
this.i_tip_window=undefined;
this.i_flight_result_controller=undefined;
this.i_hotel_result_controller=undefined;
this.i_files={
"quick_add" : ["./src/Extensions/Travel/objects/Object.FlightSearchRequest.js",
"./src/Extensions/Travel/objects/Object.HotelSearchRequest.js",
"./src/Extensions/Travel/objects/Object.Location.js"],
"preferences" : ["./Extension.Travel.css"],
"search_window" : ["./src/Extensions/Travel/objects/Object.FlightSearchRequest.js",
"./src/Extensions/Travel/objects/Object.HotelSearchRequest.js",
"./src/Extensions/Travel/objects/Object.Location.js",
"./src/Extensions/Travel/components/Component.TravelInput.js",
"./src/Extensions/Travel/components/Component.OrbitzLogo.js",
"./src/Extensions/Travel/components/Component.TravelButton.js",
"./src/Extensions/Travel/components/Component.TravelSearchWindow.js",
"./src/Extensions/Travel/components/Component.FlightSearch.js",
"./src/Extensions/Travel/components/Component.HotelSearch.js",
"./Extension.Travel.css"],
"settings" : ["./src/Extensions/Travel/objects/Object.FlightSettings.js",
"./src/Extensions/Travel/objects/Object.HotelSettings.js",
"./src/Extensions/Travel/objects/Object.Location.js",
"./src/Extensions/Travel/objects/Object.TravelSettings.js"],
"airlines" : ["./src/Extensions/Travel/data/Data.Airlines.js",
"./src/Extensions/Travel/objects/Object.TravelCodePair.js"],
"hotel_chains" : ["./src/Extensions/Travel/data/Data.Hotels.js",
"./src/Extensions/Travel/objects/Object.TravelCodePair.js"],
"locations" : ["./src/Extensions/Travel/objects/Object.Location.js"],
"flight_search" : ["./src/Extensions/Travel/objects/Object.FlightSearchResult.js",
"./src/Extensions/Travel/objects/Object.FlightPackage.js",
"./src/Extensions/Travel/objects/Object.Flight.js",
"./src/Extensions/Travel/objects/Object.FlightLeg.js"],
"flight_results" : ["./src/Extensions/Travel/objects/Object.FlightViewObject.js",
"./src/Extensions/Travel/components/Component.OrbitzLogo.js",
"./src/Extensions/Travel/components/Component.TravelButton.js",
"./src/Extensions/Travel/components/Component.TravelToolbar.js",
"./src/Extensions/Travel/components/Component.FlightResultController.js",
"./src/Extensions/Travel/components/Component.FlightResultModel.js",
"./src/Extensions/Travel/components/Component.FlightListView.js",
"./src/Extensions/Travel/components/Component.FlightEventView.js",
"./Extension.Travel.css"],
"flight_details" : ["./src/Extensions/Travel/components/Component.TravelButton.js",
"./src/Extensions/Travel/components/Component.TravelToolbar.js",
"./src/Extensions/Travel/components/Component.FlightDetails.js",
"./src/Extensions/Travel/components/Component.FlightConfirmation.js",
"./src/Extensions/Travel/components/Component.FlightDetailsWindow.js",
"./Extension.Travel.css"],
"hotel_search" : ["./src/Extensions/Travel/objects/Object.Hotel.js",
"./src/Extensions/Travel/objects/Object.HotelImage.js",
"./src/Extensions/Travel/objects/Object.HotelFacility.js",
"./src/Extensions/Travel/objects/Object.HotelRoom.js",
"./Extension.Travel.css"],
"hotel_results" : ["./src/Extensions/Travel/components/Component.TravelButton.js",
"./src/Extensions/Travel/components/Component.TravelToolbar.js",
"./src/Extensions/Travel/components/Component.HotelResultController.js",
"./src/Extensions/Travel/components/Component.HotelListWindow.js",
"./Extension.Travel.css"],
"hotel_details" : ["./src/Extensions/Travel/components/Component.TravelButton.js",
"./src/Extensions/Travel/components/Component.TravelToolbar.js",
"./src/Extensions/Travel/components/Component.ImageSlideshow.js",
"./src/Extensions/Travel/components/Component.HotelDetailsWindow.js",
"./Extension.Travel.css"],
"travel_tips" : ["./src/Extensions/Travel/components/Component.TravelButton.js",
"./src/Extensions/Travel/components/Component.TravelTipWindow.js",
"./Extension.Travel.css"]
};
ExtensionTravel.obj=this;
EventHandler.register(this, "onintegrate", this.initialize, this);
}
ExtensionTravel.prototype.initialize=function() {
if(this.i_has_calendar==undefined) {
this.i_has_calendar=false;
this.i_has_email=false;
this.i_has_feature=false;
for(var x=0; x < app_ids.length; x++) {
if(app_ids[x]=="1004") {
this.i_has_calendar=true;
} else if(app_ids[x]=="1007") {
this.i_has_email=true;
} else if(app_ids[x]=="3001") {
this.i_has_feature=true;
}
}
}
if(this.i_has_calendar) {
if(this.i_has_feature) {
this.i_calendar_interface=new TravelCalendarInterface(this);
this.i_calendar_interface.initialize();
}
if(this.i_has_email) {
this.i_email_interface=new TravelEmailInterface(this);
this.i_email_interface.initialize();
}
}
}
ExtensionTravel.prototype.openSearchWindow=function(flight_request,
hotel_request) {
if(this.loadFiles("search_window", new SmartHandler(this, 
this.openSearchWindow, Array(flight_request, hotel_request), 
true))) {
var open_search=true;
var flights_open=false;
var hotels_open=false;
if(this.i_flight_result_controller!=undefined &&
this.i_flight_result_controller.isSearchInProgress()) {
flights_open=true;
} else if(this.i_hotel_result_controller!=undefined &&
this.i_hotel_result_controller.isSearchInProgress()) {
hotels_open=true;
}
if(flights_open || hotels_open) {
if(confirm("You are about to begin a new travel search. "+"Your current search will be discarded. "+"Do you want to continue?")) {
open_search=true;
if(flights_open) {
this.i_flight_result_controller.closeResults()
} else {
this.i_hotel_result_controller.closeResults();
}
} else {
open_search=false;
}
}
if(open_search) {
if(this.i_search_window==undefined) {
this.i_search_window=new TravelSearchWindow(this);
}
this.i_search_window.open(flight_request, hotel_request);
}
}
}
ExtensionTravel.prototype.showFlightResults=function(mode, request, 
result) {
if(result!=undefined) {
if(this.loadFiles("flight_results", new SmartHandler(this,
this.showFlightResults, Array(mode, request, result), 
true))) {
if(this.i_flight_result_controller==undefined) {
this.i_flight_result_controller=new FlightResultController(this, this.i_calendar_interface);
}
this.i_flight_result_controller.showResults(request, result, 
mode);
}
}
}
ExtensionTravel.prototype.showHotelResults=function(request, result) {
if(result!=undefined) {
if(this.loadFiles("hotel_results", new SmartHandler(this,
this.showHotelResults, Array(request, result), true))) {
if(this.i_hotel_result_controller==undefined) {
this.i_hotel_result_controller=new HotelResultController(this);
}
this.i_hotel_result_controller.showResults(request, result);
}
}
}
ExtensionTravel.prototype.showTip=function(id, handler, settings) {
if(settings==undefined) {
ExtensionTravel.store.getSettings(new SmartHandler(this,
this.showTip, Array(id, handler), true, true));
} else {
if(settings.getHelpSetting()) {
if(this.loadFiles("travel_tips", new SmartHandler(this, 
this.showTip, Array(id, handler, settings), true))) {
if(this.i_tip_window==undefined) {
this.i_tip_window=new TravelTipWindow();
}
this.i_tip_window.open(id, handler, settings);
}
} else if(handler!=undefined) {
handler.execute();
}
}
}
ExtensionTravel.store=Array();
ExtensionTravel.store.cached_airlines=undefined;
ExtensionTravel.store.cached_hotel_chains=undefined;
ExtensionTravel.store.cached_airports=Array();
ExtensionTravel.store.cached_settings=undefined;
ExtensionTravel.store.searchFlights=function(request, handler) {
if(ExtensionTravel.obj.loadFiles("flight_search", new SmartHandler(undefined, ExtensionTravel.store.searchFlights, 
Array(request, handler), true))) {
var post=new ResourcePost();
var note=Notifications.add("Searching flights");
var request_xml=request.toXml();
post.param("unm", user_prefs['user_name']);
post.param("sid", user_prefs['session_id']);
post.param("xml", "<request><method>searchflights</method>"+request_xml+"</request>");
ResourceManager.request(ORBITZ_CGI, 1,
ExtensionTravel.store.handleSearchFlights, post, 
Array(handler, note), undefined);
ExtensionTravel.store.log(1, request_xml);
}
}
ExtensionTravel.store.searchHotels=function(request, handler) {
if(ExtensionTravel.obj.loadFiles("hotel_search", new SmartHandler(undefined, ExtensionTravel.store.searchHotels, 
Array(request, handler), true))) {
var post=new ResourcePost();
var note=Notifications.add("Searching hotels")
var request_xml=request.toXml();
post.param("unm", user_prefs['user_name']);
post.param("sid", user_prefs['session_id']);
post.param("xml", "<request><method>searchhotels</method>"+request_xml+"</request>");
ResourceManager.request(ORBITZ_CGI, 1,
ExtensionTravel.store.handleSearchHotels, post, 
Array(handler, note), undefined);
ExtensionTravel.store.log(3, request_xml);
}
}
ExtensionTravel.store.getHotelInfo=function(hotel, handler) {
if(ExtensionTravel.obj.loadFiles("hotel_search", new SmartHandler(undefined, ExtensionTravel.store.getHotelInfo, 
Array(hotel, handler), true))) {
var post=new ResourcePost();
var note=Notifications.add("Retrieving hotel info")
post.param("unm", user_prefs['user_name']);
post.param("sid", user_prefs['session_id']);
post.param("xml", "<request><method>hotelinfo</method><orbitzid>"+hotel.getHotelId()+"</orbitzid></request>");
ResourceManager.request(ORBITZ_CGI, 1,
ExtensionTravel.store.handleGetHotelInfo, post, 
Array(hotel, handler, note), undefined);
}
}
ExtensionTravel.store.resolveAirportCodes=function(codes, handler) {
if(ExtensionTravel.obj.loadFiles("locations", new SmartHandler(undefined, ExtensionTravel.store.resolveAirportCodes,
Array(codes, handler), true))) {
if(codes!=undefined && codes.length > 0) {
var cached_airports=Array();
var uncached_airports=Array();
for(var x=0; x < codes.length; x++) {
var airport_code=codes[x];
if(airport_code!=undefined && airport_code.length==3 && 
ExtensionTravel.store.cached_airports[airport_code.toUpperCase()]!=undefined) {
cached_airports.push(new TravelLocation(ExtensionTravel.store.cached_airports[airport_code.toUpperCase()]));
} else {
uncached_airports.push(airport_code);
}
}
if(uncached_airports.length > 0) {
var post=new ResourcePost();
var note=Notifications.add("Resolving airport names");
var request_xml="<request><method>resolveairportcodes</method>";
for(var x=0; x < uncached_airports.length; x++) {
request_xml+="<query>"+htmlEncode(uncached_airports[x])+"</query>";
}
request_xml+="</request>";
post.param("unm", user_prefs['user_name']);
post.param("sid", user_prefs['session_id']);
post.param("xml", request_xml);
ResourceManager.request(ORBITZ_CGI, 1,
ExtensionTravel.store.handleResolveAirportCodes, 
post, Array(cached_airports, handler, note), 
undefined);
} else if(handler!=undefined) {
handler.execute(cached_airports);
}
} else if(handler!=undefined) {
handler.execute(undefined);
}
}
}
ExtensionTravel.store.resolveLocations=function(locations, handler) {
if(ExtensionTravel.obj.loadFiles("locations", new SmartHandler(undefined, ExtensionTravel.store.resolveLocation,
Array(locations, handler), true))) {
if(locations!=undefined && locations.length > 0) {
var cached_locations=Array();
var uncached_locations=Array();
var num_queries=0;
for(var x=0; x < locations.length; x++) {
var location=locations[x];
var airport_code=location.getAirportCode();
if(location.isAirport() && airport_code!=undefined &&
airport_code.length==3 && 
ExtensionTravel.store.cached_airports[airport_code.toUpperCase()]!=undefined) {
cached_locations.push(new TravelLocation(ExtensionTravel.store.cached_airports[airport_code.toUpperCase()]));
} else {
uncached_locations.push(location);
}
}
if(uncached_locations.length > 0) {
var post=new ResourcePost();
var note=Notifications.add("Resolving locations");
var request_xml="<request><method>resolvelocations</method>";
for(var x=0; x < uncached_locations.length; x++) {
var location=uncached_locations[x];
var query=location.getName();
var type=location.getType();
if(query==undefined) {
query=location.getAirportCode();
}
if(query!=undefined && (type==undefined || (type!=undefined && type >=-1 && type <=3))) {
num_queries++;
request_xml+="<query><string>"+htmlEncode(query)+"</string>";
if(type!=undefined) {
request_xml+="<type>"+type+"</type>";
}
request_xml+="</query>";
}
}
request_xml+="</request>";
if(num_queries > 0) {
post.param("unm", user_prefs['user_name']);
post.param("sid", user_prefs['session_id']);
post.param("xml", request_xml);
ResourceManager.request(ORBITZ_CGI, 1,
ExtensionTravel.store.handleResolveLocations, post, 
Array(cached_locations, handler, note), 
undefined);
} else if(handler!=undefined) {
handler.execute(undefined);
}
} else if(handler!=undefined) {
handler.execute(cached_locations);
}
} else if(handler!=undefined) {
handler.execute(undefined);
}
}
}
ExtensionTravel.store.listAirlines=function(handler) {
if(ExtensionTravel.obj.loadFiles("airlines", new SmartHandler(undefined, ExtensionTravel.store.listAirlines, Array(handler), 
true))) {
var ret=undefined;
if(ExtensionTravel.store.cached_airlines==undefined) {
if(ORBITZ_AIRLINE_LIST!=undefined) {
var airlines=Array();
for(var x=0; x < ORBITZ_AIRLINE_LIST.length; x++) {
var airline=new TravelCodePair();
airline.readFromJson(ORBITZ_AIRLINE_LIST[x]);
airlines.push(airline);
}
ExtensionTravel.store.cached_airlines=airlines;
ret=ExtensionTravel.store.cached_airlines;
}
} else {
ret=ExtensionTravel.store.cached_airlines;
}
if(handler!=undefined) {
handler.execute(ret);
}
}
}
ExtensionTravel.store.listHotelChains=function(handler) {
if(ExtensionTravel.obj.loadFiles("hotel_chains", new SmartHandler(undefined, ExtensionTravel.store.listHotelChains, Array(handler), 
true))) {
var ret=undefined;
if(ExtensionTravel.store.cached_hotel_chains==undefined) {
if(ORBITZ_HOTEL_LIST!=undefined) {
var hotel_chains=Array();
for(var x=0; x < ORBITZ_HOTEL_LIST.length; x++) {
var hotel_chain=new TravelCodePair();
hotel_chain.readFromJson(ORBITZ_HOTEL_LIST[x]);
hotel_chains.push(hotel_chain);
}
ExtensionTravel.store.cached_hotel_chains=hotel_chains;
ret=ExtensionTravel.store.cached_hotel_chains;
}
} else {
ret=ExtensionTravel.store.cached_hotel_chains;
}
if(handler!=undefined) {
handler.execute(ret);
}
}
}
ExtensionTravel.store.getSettings=function(handler) {
if(ExtensionTravel.obj.loadFiles("settings", new SmartHandler(undefined, ExtensionTravel.store.getSettings, handler))) {
var settings=ExtensionTravel.store.cached_settings;
if(settings==undefined) {
var reg_data=ExtensionTravel.obj.param("travel");
if(reg_data!=undefined) {
try {
settings=new TravelSettings();
reg_data=eval("("+reg_data+")");
settings.readFromJson(reg_data);
} catch(e) {
settings=TravelSettings.getDefaults();
}
} else {
settings=TravelSettings.getDefaults();
}
ExtensionTravel.store.cached_settings=settings;
}
if(handler!=undefined) {
handler.execute(settings);
}
}
}
ExtensionTravel.store.saveSettings=function(settings, handler) {
if(settings!=undefined) {
ExtensionTravel.obj.param("travel", settings.toJson());
ExtensionTravel.store.cached_settings=settings;
}
if(handler!=undefined) {
handler.execute();
}
}
ExtensionTravel.store.log=function(code, data) {
var post=new ResourcePost();
post.param("unm", user_prefs['user_name']);
post.param("sid", user_prefs['session_id']);
post.param("xml", "<request><method>checksession</method><opcode>"+code+"</opcode><userId>"+user_prefs['user_id']+"</userId><details>"+htmlEncode(data)+"</details></request>");
ResourceManager.request("/cgi-bin/phoenix/OpLogCGI.fcg", 1, undefined,
post);
}
ExtensionTravel.store.handleSearchFlights=function(data, xml, req, params) {
var handler=params[0];
var note=params[1];
var success=false;
var ret=undefined;
var timeout=false;
var disabled=false;
if(data.length > 0) {
try {
var result=eval("("+data+")");
if(result["code"]=="20000000") {
ret=new FlightSearchResult();
ret.readFromJson(result);
success=true;
} else if(result["code"]=="0" && 
result["desc"]=="Invalid session") {
timeout=true;
} else if(result["code"]=="0" &&
result["desc"]=="API disabled") {
disabled=true;
}
} catch(e) { }
}
if(success) {
Notifications.end(note);
} else {
Notifications.end(note, undefined, true, "Failed to search flights", 
false);
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute(Array(ret, disabled), true);
}
}
ExtensionTravel.store.handleSearchHotels=function(data, xml, req, params) {
var handler=params[0];
var note=params[1];
var success=false;
var ret=undefined;
var timeout=false;
var disabled=false;
if(data.length > 0) {
try {
var result=eval("("+data+")");
if(result["code"]=="20000000") {
var hotels=result["ht"];
ret=Array();
for(var x=0; x < hotels.length; x++) {
var hotel=new TravelHotel();
hotel.readFromJson(hotels[x], true);
ret.push(hotel);
}
success=true;
} else if(result["code"]=="0" && 
result["desc"]=="Invalid session") {
timeout=true;
} else if(result["code"]=="0" &&
result["desc"]=="API disabled") {
disabled=true;
}
} catch(e) { }
}
if(success) {
Notifications.end(note);
} else {
Notifications.end(note, undefined, true, "Failed to search hotels", 
false);
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute(Array(ret, disabled), true);
}
}
ExtensionTravel.store.handleGetHotelInfo=function(data, xml, req, params) {
var hotel=params[0];
var handler=params[1];
var note=params[2];
var success=false;
var timeout=false;
var disabled=false;
if(data.length > 0) {
try {
var result=eval("("+data+")");
if(result["code"]=="20000000") {
var hotels=result["ht"];
if(hotels.length > 0 && hotel!=undefined) {
hotel.readFromJson(hotels[0], false);
}
success=true;
} else if(result["code"]=="0" && 
result["desc"]=="Invalid session") {
timeout=true;
} else if(result["code"]=="0" &&
result["desc"]=="API disabled") {
disabled=true;
}
} catch(e) { }
}
if(success) {
Notifications.end(note);
} else {
Notifications.end(note, undefined, true, 
"Failed to retrieve hotel info", false);
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute(Array(hotel, disabled), true);
}
}
ExtensionTravel.store.handleResolveAirportCodes=function(data, xml, req, 
params) {
var cached_airports=params[0];
var handler=params[1];
var note=params[2];
var success=false;
var ret=undefined;
var timeout=false;
if(data.length > 0) {
try {
var result=eval("("+data+")");
if(result["code"]=="20000000") {
var result_data=result["qr"];
ret=Array();
for(var x=0; x < result_data.length; x++) {
var keyword=result_data[x]["qs"];
var locations=result_data[x]["ap"];
for(var y=0; y < locations.length; y++) {
var location=new TravelLocation();
location.readFromJson(locations[y]);
location.setKeyword(keyword);
ret.push(location);
if(location.isAirport()) {
var cache_airport=new TravelLocation(location);
var airport_code=cache_airport.getAirportCode();
ExtensionTravel.store.cached_airports[airport_code.toUpperCase()]=cache_airport;
}
}
}
success=true;
} else if(result["code"]=="0" && 
result["desc"]=="Invalid session") {
timeout=true;
}
for(var x=0; x < cached_airports.length; x++) {
ret.push(cached_airports[x]);
}
} catch(e) { }
}
if(success) {
Notifications.end(note);
} else {
Notifications.end(note, undefined, true, 
"Failed to resolve airport names", false);
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute(ret);
}
}
ExtensionTravel.store.handleResolveLocations=function(data, xml, req, 
params) {
var cached_locations=params[0];
var handler=params[1];
var note=params[2];
var success=false;
var ret=undefined;
var timeout=false;
if(data.length > 0) {
try {
var result=eval("("+data+")");
if(result["code"]=="20000000") {
var result_data=result["qr"];
ret=Array();
for(var x=0; x < result_data.length; x++) {
var keyword=result_data[x]["qs"];
var locations=result_data[x]["ls"];
for(var y=0; y < locations.length; y++) {
var location=new TravelLocation();
location.readFromJson(locations[y]);
location.setKeyword(keyword);
ret.push(location);
if(location.isAirport()) {
var cache_airport=new TravelLocation(location);
var airport_code=cache_airport.getAirportCode();
ExtensionTravel.store.cached_airports[airport_code.toUpperCase()]=cache_airport;
}
}
}
success=true;
} else if(result["code"]=="0" && 
result["desc"]=="Invalid session") {
timeout=true;
}
for(var x=0; x < cached_locations.length; x++) {
ret.push(cached_locations[x]);
}
} catch(e) { }
}
if(success) {
Notifications.end(note);
} else {
Notifications.end(note, undefined, true, 
"Failed to resolve locations", false);
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute(ret);
}
}
ExtensionTravel.utils=Array();
ExtensionTravel.utils.formatPrice=function(price, currency, zeros) {
var ret=undefined;
if(price!=undefined && currency!=undefined) {
var price_part=price % 100;
var price_whole=(price - price_part) / 100;
ret=""+price_whole;
if(zeros || price_part > 0) {
ret+="."+fillZeros(price_part);
}
if(currency=="USD") {
ret="$"+ret;
} else {
ret+=" "+currency;
}
}
return ret;
}
ExtensionTravel.utils.formatDate=function(date, offset, no_offset, 
no_date) {
var ret=undefined;
if(date!=undefined && offset!=undefined) {
var offset=parseInt(offset);
if((-1 * date.getTimezoneOffset())!=offset) {
ret=addMinutes(date, date.getTimezoneOffset()+offset);
} else {
ret=date;
}
if(no_date) {
ret=getTimeString(ret);
} else {
ret=getNumericDateString(ret)+" "+getTimeString(ret);
}
if(!no_offset) {
var off_mins=Math.abs(offset) % 60;
var off_hours=(Math.abs(offset) - off_mins) / 60;
if(offset < 0) {
offset="-";
} else {
offset="+";
}
ret+=" (GMT"+offset+fillZeros(off_hours)+":"+fillZeros(off_mins)+")";
}
}
return ret;
}
ExtensionTravel.utils.formatDuration=function(duration) {
var ret=undefined;
if(duration!=undefined) {
var mins=duration % 60
var hours=(duration - mins) / 60;
if(hours > 0) {
ret=hours+"hr";
} else {
ret="";
}
if(mins > 0) {
ret+=" "+mins+"min";
}
}
return ret;
}
ExtensionTravel.utils.arrayCompare=function(a, b) {
var ret=true;
if(a!=undefined || b!=undefined) {
if(a!=undefined && b!=undefined && a.length==b.length) {
for(var x=0; x < a.length; x++) {
var found=false;
for(var y=0; y < b.length; y++) {
if(a[x]==b[y]) {
found=true;
break;
}
}
if(!found) {
ret=false;
break;
}
}
} else {
ret=false;
}
}
return ret;
}
ExtensionTravel.inherit(Application);
SystemCore.registerApplication(new ExtensionTravel());
JavaScriptResource.notifyComplete("./src/Extensions/Travel/Extension.Travel.js");
function TravelCalendarInterface(app) {
this.i_app=app;
this.i_calendar=undefined;
this.i_initialized=false;
this.i_context_menu=undefined;
this.i_tab=undefined;
this.i_tab_content=undefined;
this.i_tab_attached=undefined;
this.i_data_model=undefined;
TravelCalendarInterface.obj=this;
}
TravelCalendarInterface.prototype.initialize=function() {
this.i_calendar=Application.getApplicationById(1004);
this.i_calendar.registerPreference("./btExtTravelPreferences.js");
var toolbar=this.i_calendar.getCalendarView().getCalendarTools();
var toolbar_travel_button=new IconLabelButton("Book Travel",
"TravelButton", 16, 16, 86, 17, "Book Travel");
EventHandler.register(toolbar_travel_button, "onclick",
this.handleBookClick, this);
toolbar.addItem(new ToolBarDivider());
toolbar.addItem(new ToolBarButton(toolbar_travel_button));
var view=this.i_calendar.getCalendarView().getCalendarView();
EventHandler.register(view, "oncontext", this.handleCalendarContext,
this);
EventHandler.register(view, "ondblclick", this.handleCalendarDblClick,
this);
EventHandler.register(this.i_calendar.getCalendarView(), "ondragcreate",
this.handleCalendarDragCreate, this);
var menu_item=view.genericContextMenu().addItem(new ContextMenuIconItem("Book Travel"));
EventHandler.register(menu_item, "onclick", this.handleBookClick, this);
EventHandler.register(QuickAdd, "onquickadd", this.handleQuickAdd, this);
this.i_initialized=true;
}
TravelCalendarInterface.prototype.handleCalendarDragCreate=function(e) {
if(this.isTravelRequest(e.event.title())) {
e.cancel=true;
this.handleTravelRequest(e.event.title(), e.event.startTime(),
e.event.endTime());
}
}
TravelCalendarInterface.prototype.handleChooseFlight=function(e) {
FlightResultController.obj.chooseFlight(e.item.parent().i_event.id());
}
TravelCalendarInterface.prototype.handleViewFlight=function(e) {
FlightResultController.obj.showDetails(e.item.parent().i_event.id());
}
TravelCalendarInterface.prototype.handleCalendarContext=function(e) {
var obj=e.event;
if(obj.type()=="travel") {
if(this.i_context_menu==undefined) {
this.i_context_menu=new ContextMenu(150, "");
var view_option=this.i_context_menu.addItem(new ContextMenuIconItem("View Details"));
EventHandler.register(view_option, "onclick",
this.handleViewFlight, this);
var choose_option=this.i_context_menu.addItem(new ContextMenuIconItem("Choose Flight"));
EventHandler.register(choose_option, "onclick",
this.handleChooseFlight, this);
}
var cx=this.i_context_menu;
cx.title(obj.title());
cx.i_event=obj;
cx.show();
}
}
TravelCalendarInterface.prototype.handleCalendarDblClick=function(e) {
if(e.event.type()=="travel") {
FlightResultController.obj.showDetails(e.event.id());
}
}
TravelCalendarInterface.prototype.handleQuickAdd=function(e) {
if(this.isTravelRequest(e.string)) {
e.cancel=true;
this.handleTravelRequest(e.string);
}
}
TravelCalendarInterface.prototype.handleResultsResize=function(e) {
if(this.i_calendar.i_scheduler!=undefined) {
if(this.i_calendar.i_win_scheduler.effectiveWidth()!=undefined) {
this.i_tab_content.style.width=(this.i_calendar.i_win_scheduler.effectiveWidth() - 14)+"px";
}
if(this.i_calendar.i_win_scheduler.effectiveHeight()!=undefined) {
this.i_tab_content.style.height=(this.i_calendar.i_win_scheduler.effectiveHeight() - 55)+"px";
}
}
}
TravelCalendarInterface.prototype.handleTabClose=function(e) {
this.removeTravelEvents();
this.i_tab_attached=false;
}
TravelCalendarInterface.prototype.attachResultWindow=function(window) {
if(this.i_initialized) {
var cal_scheduler=this.i_calendar.getScheduler();
if(this.i_tab==undefined) {
window.onshow();
cal_scheduler.getScheduler();
this.i_tab=new TabbedPaneTab("Travel", undefined, "", true);
EventHandler.register(this.i_tab, "onclose", this.handleTabClose,
this);
this.i_tab_content=document.createElement('DIV');
this.i_tab_content.style.border="1px solid #a3a3a3";
this.i_tab_content.style.backgroundColor="#FFFFFF";
this.i_tab_content.style.overflow="auto";
this.i_tab_content.appendChild(window.loadContent());
this.i_tab.contentPane(this.i_tab_content);
EventHandler.register(this.i_calendar.i_win_scheduler,
"oncontentresize", this.handleResultsResize, this);
this.handleResultsResize({ 'type' : 'contentresize' });	
}
if(!this.i_tab_attached) {
cal_scheduler.i_tab_schedule.addTab(this.i_tab);
this.i_tab.active(true);
this.handleResultsResize({ 'type' : 'contentresize' });
this.i_tab_attached=true;
}
}
}
TravelCalendarInterface.prototype.detachResultWindow=function(window) {
if(this.i_initialized) {
if(this.i_tab!=undefined && this.i_tab_attached) {
var cal_scheduler=this.i_calendar.getScheduler();
cal_scheduler.i_quick.active(true);
cal_scheduler.i_tab_schedule.removeTab(this.i_tab);
this.i_tab_attached=false;
this.removeTravelEvents();
}
}
}
TravelCalendarInterface.prototype.jumpToDailyView=function(date) {
if(this.i_initialized) {
if (SystemCore.activeApplication()!=this.i_calendar) {
this.loadCalendar();
}
var cal_view=this.i_calendar.getCalendarView();
cal_view.getCalendarView().focusDate(date.copy(true));
cal_view.i_daily.active(true);
}
}
TravelCalendarInterface.prototype.createTravelEvents=function(view_list) {
if(this.i_initialized) {
if(this.i_tab_attached) {
var view=this.i_calendar.getCalendarView().getCalendarView();
if(this.i_data_model!=undefined) {
view.removeDataModel(this.i_data_model);
}
this.i_data_model=new CalendarDataModel(undefined,
"Flight Results", 3);
this.i_data_model.access("ReadOnly");
this.i_data_model.localData(true);
this.i_data_model.disableLoad(true);
for(var x=0; x < view_list.length; x++) {
var view_obj=view_list[x];
var start_date=ExtensionTravel.utils.formatDate(view_obj.getStartDate(), parseInt(view_obj.getStartOffset()), true, true);
var end_date=ExtensionTravel.utils.formatDate(view_obj.getEndDate(), parseInt(view_obj.getEndOffset()), true, true);
var price=ExtensionTravel.utils.formatPrice(view_obj.getPrice(), view_obj.getCurrency());
var travel_body="";
var calendarIncrement=view.increment() ;
var flightDuration=view_obj.getDuration() ;
var minIncrements=8 ;
var incrementsNeeded=flightDuration/calendarIncrement ;
if (incrementsNeeded < minIncrements) {
travel_body=this.getTravelEventBody(true, view_obj, start_date, end_date, price) ;
}
else {
travel_body=this.getTravelEventBody(false, view_obj, start_date, end_date, price) ;
}
var event=new CalendarEvent(view_obj.getFlightId(),
view_obj.getAirlineName()+" Flight "+view_obj.getFlightNumber(), view_obj.getStartDate(),
view_obj.getEndDate(), false);
event.type("travel");
event.displayBody(travel_body);
event.sortOrder(x);
this.i_data_model.addEvent(event);
}
var months=this.i_data_model.getItems(0, 1000, "sort", "asc", 1);
for(var x=0; x < months.length();++x) {
months.getItem(x).i_init=true;
}
view.sortingMode(1);
view.addDataModel(this.i_data_model);
}
}
}
TravelCalendarInterface.prototype.getTravelEventBody=function(shortVersion, view_obj, start_date, end_date, price) {
var travel_body="" ;
if (shortVersion) {
travel_body="<b>"+view_obj.getAirlineName()+"</b><br>Flight "+view_obj.getFlightNumber()+"<br>";
travel_body=travel_body.replace(/ /g, " ");
travel_body+="<a href=/"#/" onclick=\""+"FlightResultController.obj.showDetails('"+view_obj.getFlightId()+"'); return false;\">View Details</a><br>";
var travel_body2="<br><b>Dep:</b> "+start_date+" ("+view_obj.getStartLocation()+")<br><b>Arr:</b> "+end_date+" ("+view_obj.getEndLocation()+")"+"<br><br><b>"+price+"</b><br><br>";
travel_body2=travel_body2.replace(/ /g, " ");
travel_body+=travel_body2 ;
travel_body+="<a href=/"#/" onclick=\""+"FlightResultController.obj.chooseFlight('"+view_obj.getFlightId()+"'); return false;\">Choose Flight</a>";
}
else {
travel_body="<b>"+view_obj.getAirlineName()+"</b><br>Flight "+view_obj.getFlightNumber()+"<br><br><b>Dep:</b> "+start_date+" ("+view_obj.getStartLocation()+")<br><b>Arr:</b> "+end_date+" ("+view_obj.getEndLocation()+")"+"<br><br><b>"+price+"</b><br><br>";
travel_body=travel_body.replace(/ /g, " ");
travel_body+="<a href=/"#/" onclick=\""+"FlightResultController.obj.showDetails('"+view_obj.getFlightId()+"'); return false;\">View Details</a><br>"+"<a href=/"#/" onclick=\""+"FlightResultController.obj.chooseFlight('"+view_obj.getFlightId()+"'); return false;\">Choose Flight</a>";
}
return travel_body ;
}
TravelCalendarInterface.prototype.removeTravelEvents=function() {
if(this.i_initialized) {
if(this.i_data_model!=undefined) {
var view=this.i_calendar.getCalendarView().getCalendarView();
view.removeDataModel(this.i_data_model);
view.sortingMode(0);
this.i_data_model=null;
}
}
}
TravelCalendarInterface.prototype.createEvent=function(start_date, end_date,
title, details) {
if(this.i_initialized) {
var ce=new CalendarEvent(undefined, title, start_date, end_date);
ce.isNew(true);
ce.description(details);
CalendarDataModel.getDefaultCalendar().addEvent(ce);
ce.save();
}
}
TravelCalendarInterface.prototype.bookTravelOnDate=function(start_date,
end_date, current_view) {
if(start_date!=undefined && end_date!=undefined) {
if(this.i_app.loadFiles("quick_add", new SmartHandler(this,
this.bookTravelOnDate, Array(start_date, end_date, 
current_view), true, true))) {
var flight_request=new FlightSearchRequest();
var hotel_request=new HotelSearchRequest();
var start_date_obj=iCaltoDate(start_date);
var end_date_obj=iCaltoDate(end_date);
flight_request.setDepartureDate(floorDay(start_date_obj));
if(current_view!=0 && getUnadjustedMinuteDiff(end_date_obj,
start_date_obj) % 1440!=0) {
flight_request.setDepartureStartTime(start_date_obj.getHours());
}
hotel_request.setCheckInDate(floorDay(start_date_obj));
this.i_app.openSearchWindow(flight_request, hotel_request);
}
}
}
TravelCalendarInterface.prototype.loadCalendar=function() {
if(this.i_initialized) {
SystemCore.navigationBar().unselectAll();
SystemCore.activeApplication(this.i_calendar);
}
}
TravelCalendarInterface.prototype.isTravelRequest=function(query) {
var ret=false;
if(this.i_initialized) {
var words=query.split(" ");
var word_list=Array("flight", "air", "trip", "flights", "hotel", 
"hotels", "motel", "resort", "travel");
for(var x=0; x < words.length && !ret; x++) {
for(var y=0; y < word_list.length && !ret; y++) {
if(words[x].toLowerCase()==word_list[y]) {
ret=true;
}
}
}
}
return ret;
}
TravelCalendarInterface.prototype.handleTravelRequest=function(query, start,
end) {
if(this.i_app.loadFiles("quick_add", new SmartHandler(this,
this.handleTravelRequest, Array(query, start, end), 
true, true))) {
var is_flight=undefined;
var words=query.split(" "); 
var words_lc=Array();
var context_num=8;
var word_map=Array();
var word_list={
0 : [["flight"],
["air"],
["trip"],
["flights"],
["travel"]],
1 : [["hotel"],
["hotels"],
["motel"],
["resort"]],
2 : [["from"],
["departing"],
["leave"],
["leaving"]],
3 : [["to"],
["arriving"],
["return"],
["returning"],
["in"],
["near"]],
4 : [["one", "way"],
["one-way"]],
5 : [["round", "trip"],
["round-trip"],
["two", "way"],
["two-way"]],
6 : [["on"],
["at"]],
7 : [["search"],
["find"],
["get"],
["plan"],
["book"],
["schedule"],
["searching"],
["finding"],
["getting"],
["planning"],
["booking"],
["scheduling"]]
};
for(var x=0; x < words.length; x++) {
var word=words[x].toLowerCase();
if(word.match(/,$/)) {
word=word.replace(/,$/, "");
}
words_lc.push(word);
}
for(var a=0; a < words_lc.length; a++) {
var context=-1;
for(var b=0; b < context_num && context==-1; b++) {
for(var c=0; c < word_list[b].length && context==-1; 
c++) {
for(var d=0; d < word_list[b][c].length; d++) {
if(words_lc[a+d]==word_list[b][c][d]) {
if(d==word_list[b][c].length - 1) {
context=b;
if(d > 0) {
var replace=word_list[b][c].join(" ");
words.splice(a, d+1, replace);
words_lc.splice(a, d+1, replace)
}
if((b==0 || b==1) &&
is_flight==undefined) {
is_flight=(b==0 ? true : false);
}
}
} else {
break;
}
}
}
}
word_map.push(context);
}
if(is_flight!=undefined) {
var last_context=undefined;
var depart_location=undefined;
var arrive_location=undefined;
var depart_date=undefined;
var depart_start=undefined;
var depart_end=undefined;
var arrive_date=undefined;
var arrive_start=undefined;
var journey_type=undefined;
if(start!=undefined) {
depart_date=floorDay(start);
}
for(var x=0; x < word_map.length; x++) {
switch(word_map[x]) {
case -1: 
var value=this.getWords(x, word_map, words);
var data=this.parseCityDateCombo(value, 
depart_date);
if(data!=undefined) {
var city=data[0];
var date=data[1];
if(city!="") {
arrive_location=city;
}
if(date!=undefined) {
depart_date=date;
}
}
x+=value.length - 1;
last_context=undefined;
break;
case 2: 
var value=this.getWords(x+1, word_map, words);
var data=this.parseCityDateCombo(value, 
depart_date);
if(data!=undefined) {
var city=data[0];
var date=data[1];
if(city!="") {
depart_location=city;
}
if(date!=undefined) {
depart_date=date;
}
}
x+=value.length;
if(value.length==0) {
last_context=2;
} else {
last_context=undefined;
}
break;
case 3: 
var value=this.getWords(x+1, word_map, words);
var data=this.parseCityDateCombo(value, 
arrive_date);
if(data!=undefined) {
var city=data[0];
var date=data[1];
if(city!="") {
arrive_location=city;
}
if(date!=undefined) {
arrive_date=date;
}
}
x+=value.length;
if(value.length==0) {
last_context=3;
} else {
last_context=undefined;
}
break;
case 4: 
journey_type=0;
break;
case 5: 
journey_type=1;
break;
case 6: 
var value=this.getWords(x+1, word_map, words);
if(last_context==2) {
depart_date=this.parseDate(value, depart_date);
} else if(last_context==3) {
arrive_date=this.parseDate(value, arrive_date);
} else {
depart_date=this.parseDate(value, depart_date);
}
x+=value.length;
break;
}
}
if(depart_date!=undefined) {
if(depart_date.getHours()!=0 || 
depart_date.getMinutes()!=0) {
depart_start=Math.round(depart_date.getHours()+(depart_date.getMinutes() / 100));
depart_date=floorDay(depart_date);
}
}
if(arrive_date!=undefined) {
if(arrive_date.getHours()!=0 || 
arrive_date.getMinutes()!=0) {
arrive_start=Math.round(arrive_date.getHours()+(arrive_date.getMinutes() / 100));
arrive_date=floorDay(arrive_date);
}
}
if(start!=undefined && end!=undefined) {
depart_start=Math.floor(start.getHours());
depart_end=Math.ceil(end.getHours());
if(depart_end==0) {
depart_end=24;
}
if(depart_start >=0 && depart_start < 2 &&
depart_end > 7 && depart_end < 11) {
depart_start=0;
depart_end=9;
} else if(depart_start > 4 && depart_start < 8 &&
depart_end > 10 && depart_end < 14) {
depart_start=6;
depart_end=12;
} else if(depart_start > 8 && depart_start < 12 &&
depart_end > 12 && depart_end < 16) {
depart_start=10;
depart_end=14;
} else if(depart_start > 10 && depart_start < 14 &&
depart_end > 15 && depart_end < 19) {
depart_start=12;
depart_end=17;
} else if(depart_start > 14 && depart_start < 18 &&
depart_end > 18 && depart_end < 22) {
depart_start=16;
depart_end=20;
} else if(depart_start > 16 && depart_start < 20 &&
depart_end > 22 && depart_end <=24) {
depart_start=18;
depart_end=24;
} else {
depart_end=undefined;
}
}
if(is_flight) {
var request=new FlightSearchRequest();
if(depart_location!=undefined) {
var depart=new TravelLocation();
depart.setName(trim(depart_location));
request.setDepartureLocation(depart);
}
if(arrive_location!=undefined) {
var arrive=new TravelLocation();
arrive.setName(trim(arrive_location));
request.setArrivalLocation(arrive);
}
request.setJourneyType(journey_type);
request.setDepartureDate(depart_date);
request.setDepartureStartTime(depart_start);
request.setDepartureEndTime(depart_end);
request.setArrivalDate(arrive_date);
request.setArrivalStartTime(arrive_start);
this.i_app.openSearchWindow(request);
} else {
var request=new HotelSearchRequest();
if(arrive_location!=undefined) {
var location=new TravelLocation();
location.setName(trim(arrive_location));
request.setLocation(location);
}
request.setCheckInDate(depart_date);
request.setCheckOutDate(arrive_date);
this.i_app.openSearchWindow(undefined, request);
}
}
}
}
TravelCalendarInterface.prototype.handleBookClick=function() {
this.i_app.openSearchWindow();
}
TravelCalendarInterface.prototype.getWords=function(offset, word_map, 
words) {
var ret=Array();
for(var x=0; word_map[offset+x]==-1; x++) {
ret.push(words[offset+x]);
}
return ret;
}
TravelCalendarInterface.prototype.parseDate=function(words, default_date) {
var ret=undefined;
if(words.length > 0) {
var date_words=Array();
var time_words=Array();
var date_str="";
var time_str="";
for(var x=0; x < words.length; x++) {
if(words[x].match(/^\d(\d)?:\d\d/)) {
time_words.push(words[x]);
} else if(words[x].match(/[a|p]m$/i)) {
if(time_words.length > 0) {
time_words.push(words[x]);
}
} else {
date_words.push(words[x]);
}
}
date_str=date_words.join(" ");
time_str=time_words.join(" ");
if(time_str=="") {
if(default_date==undefined) {
time_str="00:00";
} else {
time_str=getTimeString(default_date);
}
}
if(date_str=="") {
if(default_date==undefined) {
date_str=getNumericDateString(new Date());
} else {
date_str=getNumericDateString(default_date);
}
}
ret=createDateFromStrings(date_str, time_str);
} else {
ret=default_date;
}
return ret;
}
TravelCalendarInterface.prototype.parseCityDateCombo=function(words, 
default_date) {
var ret=undefined;
if(words.length > 0) {
var date_words=Array();
var city_words=Array();
var pivot=undefined;
for(var x=0; x < words.length; x++) {
if(pivot==undefined && words[x].match(/\d/)) {
pivot=x;
}
if(pivot==undefined) {
city_words.push(words[x]);
} else {
date_words.push(words[x]);
}
}
ret=Array(city_words.join(" "), this.parseDate(date_words, 
default_date));
}
return ret;
}
JavaScriptResource.notifyComplete("./src/Extensions/Travel/components/"+"Component.TravelCalendarInterface.js");
function TravelEmailInterface(app) {
this.ORBITZ_ADDRESS="travelercare@orbitz.com";
this.ORBITZ_SUBJECTS=Array("travel document - ",
"prepare for your trip - ",
"purchase request status - ",
"a change to your flight itinerary",
"hotel reservation confirmation",
"hotel+car reservation confirmation - ",
"flight purchase request confirmation - ",
"your itinerary");
this.ORBITZ_BODY=Array("trip information",
"ticket information",
"updated itinerary",
"flight information",
"hotel information",
"car information",
"e-mail itinerary");
this.ORBITZ_ZONES={
"ACDT" : 630,
"ACST" : 570,
"ADT" : -180,
"AEDT" : 160,
"AEST" : 600,
"AKDT" : -480,
"AKST" : -540,
"AST" : -240,
"AWDT" : 540,
"AWST" : 480,
"BST" : 60,
"CDT" : -300,
"CEDT" : 120,
"CEST" : 120,
"CET" : 60,
"CST" : -360,
"CXT" : 420,
"EDT" : -240,
"EEDT" : 180,
"EEST" : 180,
"EET" : 120,
"EST" : -300,
"GMT" : 0,
"HAA" : -180,
"HAC" : -300,
"HADT" : -540,
"HAE" : -240,
"HAP" : -420,
"HAR" : -360,
"HAST" : -600,
"HAT" : -150,
"HAY" : -480,
"HNA" : -240,
"HNC" : -360,
"HNE" : -300,
"HNP" : -480,
"HNR" : -420,
"HNT" : -210,
"HNY" : -540,
"IST" : 60,
"MDT" : -360,
"MESZ" : 120,
"MEZ" : 60,
"MST" : -420,
"NDT" : -150,
"NFT" : 690,
"NST" : -210,
"PDT" : -420,
"PST" : -480,
"UTC" : 0,
"WEDT" : 60,
"WEST" : 60,
"WET" : 0
};
this.i_app=app;
this.i_initialized=false;
this.i_calendar_date=undefined;
TravelEmailInterface.obj=this;
}
TravelEmailInterface.prototype.initialize=function() {
if(typeof(ApplicationEmail)!="undefined") {
this.i_initialized=true;
ApplicationEmail.travelEnabled=true;
}
}
TravelEmailInterface.prototype.isOrbitzEmail=function(message) {
var ret=false;
if(message!=undefined) {
var from=message.from_address();
if(from!=undefined) {
from=from.toLowerCase();
if(from==this.ORBITZ_ADDRESS) {
var subject=message.subject();
if(subject!=undefined) {
subject=subject.toLowerCase();
var subject_match=false;
for(var x=0; x < this.ORBITZ_SUBJECTS.length; x++) {
if(subject.indexOf(this.ORBITZ_SUBJECTS[x])==0) {
subject_match=true;
break;
}
}
if(subject_match) {
var body=message.body().replace(/[\r\n]/g, "");
if(message.html()==1) {
body=this.cleanHtmlData(body);
}
body=body.toLowerCase();
for(var x=0; x < this.ORBITZ_BODY.length; x++) {
if(body.indexOf(this.ORBITZ_BODY[x])!=-1) {
ret=true;
break;
}
}
}
}
}
}
}
return ret;
}
TravelEmailInterface.prototype.createEvent=function(message) {
this.i_calendar_date=undefined;
if(message!=undefined) {
var is_html=true;
var body=message.body();
var count=0;
if(message.html()==0) {
is_html=false;
} else if(body.indexOf("<!-- Converted from text/plain format -->")!=-1) {
is_html=false;
body=body.replace(/[\r\n]/g, "");
body=body.replace(/<title.*?>.*?<\/title>/i, "");
body=body.replace(/<\/p>/gi, "\n\n");
body=this.cleanHtmlData(body, true);
}
if(is_html) {
var subject=message.subject().toLowerCase();
var table_type=undefined;
body=body.replace(/[\r\n]/g, "");
if(subject.indexOf("your itinerary")==0) {
table_type=0;
} else {
table_type=1;
}
var table_tags=body.match(/<[\/]?table[^>]*>/ig);
var table_data=undefined;
if(table_tags!=undefined) {
var start_index=0;
var last_index=0;
var depth=-1;
table_data=Array();
for(var x=0; x < table_tags.length; x++) {
var tag=table_tags[x];
var index=body.indexOf(tag, last_index);
if(depth >=0) {
if(tag.match(/^<table/i)) {
depth++;
} else {
depth--;
}
if(depth==-1) {
table_data.push(body.substring(start_index,
index));
}
} else if((table_type==0 && tag.match(/class=(detailsTable|\"detailsTable\")/ ) ) ||
							( table_type == 1 && tag.match(
							/class=(\"\"|boxed|\"boxed\")/ ) ) ) {
						depth = 0;
						start_index = index + tag.length;
					}

					last_index = index + tag.length;

				}

			}

			// Use the table data to create calendar events
			if( table_data != undefined && table_data.length > 0 ) {

				if( table_type == 0 ) {

					// ------------------------
					// -- Itinerary Messages --
					// ------------------------

					for( var x = 0; x < table_data.length; x++ ) {

						var row_title = this.cleanHtmlData( table_data[ x ].replace( /^.*?<tr[^>]*>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>(.*?)<\/td>.*?<\/tr>.*/i, "$1" ) ).toLowerCase();
						var row_data = table_data[ x ];

						// Clean up the row data
						row_data = row_data.replace( /^(.*?<tr[^>]*>.*?<td[^>]*>.*?<\/td>.*?)<td[^>]*>.*?<\/td>(.*?<\/tr>)/i, "$1$2" );
						row_data = row_data.replace( 
								/<(\/tr|table)[^>]*>/gi, "<br>" );
						row_data = this.cleanHtmlData( row_data );

						if( row_title == "leave" || row_title == "return" ) {

							// Convert to a standard format
							row_data = row_data.replace( /(\w+, )(\w+ \d+)(, \d+)\n((.*?\n)*?)Depart: (\d+:\d+[ap]m)\n(\w+) (.*?)\n(.*?) (\(\w+\))\nArrive: (\d+:\d+[ap]m)\n(\w+) (.*?)\n(.*?) (\(\w+\))\n/g, "$1$2$3\n$4$9 $10 to $14 $15\nDeparture $10: $3, $6 LOCALTIME ($7)\nArrival $15: $3, $11 LOCALTIME ($12)\n" );

							// TODO: Do something about the timezone... somehow

							// Create the event
							count += this.createFlightEvents( row_data );

						} else if( row_title.indexOf( "check-in" ) == 0 ) {

							// Convert to a standard format
							row_data = row_data.replace( /(\w+, \w+ \d+, \d+)\n(\w+, \w+ \d+, \d+)\n((.*?\n)*?)Check in\/out: (.*?) \/ (.*?)\n/, "$3\nCheck\-in date: $1 ($5)\nCheck\-out date: $2 ($6)\n" );

							// Create the event
							count += this.createHotelEvents( row_data );

						} else if( row_title == "pick up" ) {

							// Convert to a standard format
							row_data = row_data.replace( /^(\w+, \w+ \d+, \d+ \d+:\d+[AP]M)\n(.*?)\n((.*?\n)*?)(\w+, \w+ \d+, \d+ \d+:\d+[AP]M)(.*?\n)*.*/, "$2\n\nPick-up date: $1 LOCALTIME\nDrop-off date: $5 LOCALTIME\n\n$3" );

							// Create the event
							count += this.createCarEvents( row_data );

						}

					}

				} else {

					// -----------------------
					// -- Standard Messages --
					// -----------------------

					ticket_data = table_data[ 0 ];
					ticket_data = ticket_data.match( /<tr>.*?<\/tr>/gi );

					if( ticket_data != undefined ) {

						for( var x = 0; x < ticket_data.length; x += 2 ) {

							row_title = this.cleanHtmlData( ticket_data[ x ] );
							row_data = this.cleanHtmlData( 
									ticket_data[ x + 1 ] );

							if( row_title != undefined && 
									row_data != undefined ) {

								row_title = row_title.toLowerCase();
								row_data = row_data + "\n";

								if( row_title == "ticket information" ||
										row_title == "trip information" ||
										row_title == "updated itinerary" ||
										row_title == "flight information" ) {
									count += this.createFlightEvents( 
											row_data );
								} else if( row_title == "hotel information" ) {
									count += this.createHotelEvents( 
											row_data );
								} else if( row_title == "car information" ) {
									count += this.createCarEvents( 
											row_data );
								}

							}

						}

					}
				}

			}

		// Parse plaintext messages
		} else {

			// ------------------------
			// -- Plaintext Messages --
			// ------------------------

			// TODO: Need to somehow fix grabbing text for the last section

			var ticket_breaks = body.match( /\n[A-Z ]+[\n]+[\*]{5}[\*]*/g );
			var break_index = Array();

			if( ticket_breaks != undefined ) {

				for( var x = 0; x < ticket_breaks.length; x++ ) {
					break_index.push( body.indexOf( ticket_breaks[ x ] ) );
				}

				for( var x = 0; x < ticket_breaks.length; x++ ) {

					var break_data = ticket_breaks[ x ];
					var row_title = break_data;
					var row_data = undefined;

					row_title = row_title.replace( /[\*]+$/, "" );
					row_title = row_title.replace( /\n/g, "" );
					row_title = row_title.toLowerCase();

					if( x + 1 < break_index.length ) {
						row_data = body.substring( break_index[ x ] + 
								break_data.length, break_index[ x + 1 ] );
					} else {
						row_data = body.substr( break_index[ x ] + 
								break_data.length );
					}

					row_data = row_data + "\n";

					if( row_title == "ticket information" ||
							row_title == "trip information" ||
							row_title == "updated itinerary" ||
							row_title == "flight information" ) {
						count += this.createFlightEvents( row_data );
					} else if( row_title == "hotel information" ) {
						count += this.createHotelEvents( row_data );
					} else if( row_title == "car information" ) {
						count += this.createCarEvents( row_data );
					}

				}

			}

		}

		// Notify the user of the result
		ExtensionTravel.store.log( 5, count + " events created" );

		if( count > 0 ) {
			DialogManager.confirm( count + " travel event" +
					( count == 1 ? " has" : "s have" ) + " been added " +
					"to your calendar.", "Travel Events Created", 
					TravelEmailInterface.handleConfirm,
					Array( "OK", "Go to Calendar" ), true );
		} else {
			DialogManager.alert( "Could not add travel events to your " +
					"calendar." );
		}

	}

}

/**
 * Utility method for converting HTML to plaintext.
 *
 * @param	input		The input text to convert
 * @param	keep_links	Flag to optionally keep the HTML A tags
 *
 * @return	The converted message data.
 */

TravelEmailInterface.prototype.cleanHtmlData = function( input, keep_links ) {

	var ret = input;

	if( input != undefined ) {
		if( !keep_links ) {
			ret = ret.replace( /<a .*?>.*?<\/a>/gi, "" );
		}
		ret = ret.replace( /<br.*?>/gi, "\n" );
		ret = ret.replace( /<.*?>/g, "" );
		ret = htmlUnencode( ret );
		ret = ret.replace( /[ \t]+/g, " " );
		ret = ret.replace( /^[ \t]/g, "" );
		ret = ret.replace( /[ \t]$/g, "" );
		ret = ret.replace( /[ \t]*\n[ \t]*/g, "\n" );
		ret = ret.replace( /\n\n[\n]+/g, "\n\n" );
	}

	return ret;

}

/**
 * Utility method for adjusting the timezone given in the Orbitz email message
 * to the local time on the computer.
 *
 * @param	date		The date object to convert
 * @param	zone		The timezone string given in the email message
 *
 * @return	The adjusted date object
 */

TravelEmailInterface.prototype.adjustTimezone = function( date, zone ) {

	var offset = this.ORBITZ_ZONES[ zone ];
	var ret = undefined;

	if( offset != undefined ) {
		ret = addMinutes( date, -1 * ( offset + date.getTimezoneOffset() ) );
	} else {
		ret = date;
	}

	return ret;

}

/**
 * Utility method for creating Calendar events from flight data in the Orbitz
 * confirmation email messages.
 *
 * @param	data		The data to use for creating flight events
 *
 * @return	The number of events created
 */

TravelEmailInterface.prototype.createFlightEvents = function( data ) {

	var ret = 0;
	var divider = "--------------------------------";
	var last_index = 0;
	var break_index = -1 * divider.length;
	var data_length = data.length;

	// Iterate over each part of the message (delimited by dashes)
	while( break_index != data_length ) {

		break_index = data.indexOf( divider, break_index + divider.length );

		if( break_index == -1 ) {
			break_index = data_length;
		}

		// Look for the departure and arrival date
		var flight_data = data.substring( last_index, break_index );
		var depart_index = flight_data.indexOf( "Departure" );
		var arrive_index = flight_data.lastIndexOf( "Arrival" );

		if( depart_index != -1 && arrive_index != -1 ) {

			// Grab the first departure line, last arrival line,
			// and any matching dates
			var depart_text = flight_data.substring( depart_index,
					flight_data.indexOf( "\n", depart_index ) );
			var arrive_text = flight_data.substring( arrive_index,
					flight_data.indexOf( "\n", arrive_index ) );
			var flight_dates = flight_data.match( /\w+, \w+ \d+, \d{4}/ );

			// Remove morning, afternoon, evening from the text
			depart_text = depart_text.replace( / \(\w+\)$/, "" );
			arrive_text = arrive_text.replace( / \(\w+\)$/, "" );

			// Grab the city, time, and timezone
			var depart_parts = depart_text.match( /^\w+[:]? \((.*?)\): (\w+ \d+), (\d+:\d+[ ]?[AP]M) (\w+)/i );
			var arrive_parts = arrive_text.match( /^\w+[:]? \((.*?)\): (\w+ \d+), (\d+:\d+[ ]?[AP]M) (\w+)/i );

			if( depart_parts != undefined && arrive_parts != undefined ) {

				var depart_city = depart_parts[ 1 ];
				var depart_time = depart_parts[ 3 ];
				var depart_zone = depart_parts[ 4 ];
				var arrive_city = arrive_parts[ 1 ];
				var arrive_time = arrive_parts[ 3 ];
				var arrive_zone = arrive_parts[ 4 ];

				// Grab the first and last matching dates
				var depart_date = flight_dates[ 0 ];
				var arrive_date = flight_dates[ flight_dates.length - 1 ];

				// Remove the day from the date strings
				depart_date = depart_date.replace( /^\w+, /, "" );
				arrive_date = arrive_date.replace( /^\w+, /, "" );

				// Create a date object
				depart_date = createDateFromStrings( depart_date, depart_time );
				arrive_date = createDateFromStrings( arrive_date, arrive_time );

				// Adjust the timezones
				depart_date = this.adjustTimezone( depart_date, depart_zone );
				arrive_date = this.adjustTimezone( arrive_date, arrive_zone );

				if( this.i_calendar_date == undefined ) {
					this.i_calendar_date = floorDay( depart_date );
				}

				// Create the event
				TravelCalendarInterface.obj.createEvent(
						depart_date, arrive_date,
						"Flight from " + depart_city + " to " + arrive_city, 
						flight_data );
				ret++;

			}

		}

		if( break_index != data_length ) {
			last_index = break_index + divider.length;
		}

	}

	return ret;

}

/**
 * Utility method for creating Calendar events from hotel data in the Orbitz
 * confirmation email messages.
 *
 * @param	data		The data to use for creating hotel events
 *
 * @return	The number of events created
 */

TravelEmailInterface.prototype.createHotelEvents = function( data ) {

	// Look for the check-in and check-out dates in the message
	var ret = 0;
	var check_in_data = data.match( /\nCheck\-in[ ]?(date)?:.*?\n/i );
	var check_out_data = data.match( /\nCheck\-out[ ]?(date)?:.*?\n/i );

	if( check_in_data != undefined && check_out_data != undefined ) {

		check_in_data = check_in_data[ 0 ].replace( /\n/g, "" );
		check_out_data = check_out_data[ 0 ].replace( /\n/g, "" );
		check_in_data = check_in_data.replace( /^.*?: \w+, /, "" );
		check_out_data = check_out_data.replace( /^.*?: \w+, /, "" );

		// Look for the date and time parts of the check-in and check-out date
		var check_in_date = check_in_data.match( /^\w+ \d+, \d+/ );
		var check_in_time = check_in_data.match( /\(.*?\)$/ );
		var check_out_date = check_out_data.match( /^\w+ \d+, \d+/ );
		var check_out_time = check_out_data.match( /\(.*?\)$/ );

		if( check_in_date != undefined && check_in_time != undefined &&
				check_out_date != undefined && check_out_time != undefined ) {

			check_in_date = check_in_date[ 0 ];
			check_in_time = check_in_time[ 0 ].replace( /^\((.*?)\)$/, "$1" );
			check_out_date = check_out_date[ 0 ];
			check_out_time = check_out_time[ 0 ].replace( /^\((.*?)\)$/, "$1" );

			// Fix for "Noon" in the time strings
			check_in_time = check_in_time.replace( /noon/i, "pm" );
			check_out_time = check_out_time.replace( /noon/i, "pm" );

			// Create a date object
			check_in_date = createDateFromStrings( check_in_date, 
					check_in_time );
			check_out_date = createDateFromStrings( check_out_date, 
					check_out_time );

			// TODO: Adjust the timezone... somehow...

			if( this.i_calendar_date == undefined ) {
				this.i_calendar_date = floorDay( check_in_date );
			}

			// Create the events
			TravelCalendarInterface.obj.createEvent( check_in_date,
					addMinutes( check_in_date, 15 ),
					"Check into hotel", data );
			TravelCalendarInterface.obj.createEvent( check_out_date,
					addMinutes( check_out_date, 15 ),
					"Check out of hotel", data );
			ret = 2;

		}

	}

	return ret;

}

/**
 * Utility method for creating Calendar events from car rental data in the
 * Orbitz confirmation email messages.
 *
 * @param	data		The data to use for creating car rental events
 *
 * @return	The number of events created
 */

TravelEmailInterface.prototype.createCarEvents = function( data ) {

	// Look for the pick up and drop off text in the data
	var ret = 0;
	var pick_up_data = data.match( /\nPick\-up[ ]?(date)?:.*?\n/i );
	var drop_off_data = data.match( /\nDrop\-off[ ]?(date)?:.*?\n/i );

	if( pick_up_data != undefined && drop_off_data != undefined ) {

		// Clean up the data
		pick_up_data = pick_up_data[ 0 ].replace( /\n/g, "" );
		drop_off_data = drop_off_data[ 0 ].replace( /\n/g, "" );
		pick_up_data = pick_up_data.replace( /^.*?: \w+, /, "" );
		drop_off_data = drop_off_data.replace( /^.*?: \w+, /, "" );

		// Parse out the date, time, and zone
		var pick_up_date = pick_up_data.match( /^\w+ \d+, \d+/ );
		var pick_up_time = pick_up_data.match( /\d+:\d+[ ]?[AP]M/i );
		var pick_up_zone = pick_up_data.match( /\w+$/ );
		var drop_off_date = drop_off_data.match( /^\w+ \d+, \d+/ );
		var drop_off_time = drop_off_data.match( /\d+:\d+[ ]?[AP]M/i );
		var drop_off_zone = drop_off_data.match( /\w+$/ );

		if( pick_up_date != undefined && pick_up_time != undefined &&
				pick_up_zone != undefined && drop_off_date != undefined &&
				drop_off_time != undefined && drop_off_zone != undefined ) {

			pick_up_date = pick_up_date[ 0 ];
			pick_up_time = pick_up_time[ 0 ];
			pick_up_zone = pick_up_zone[ 0 ];
			drop_off_date = drop_off_date[ 0 ];
			drop_off_time = drop_off_time[ 0 ];
			drop_off_zone = drop_off_zone[ 0 ];

			// Create a date object
			pick_up_date = createDateFromStrings( pick_up_date, pick_up_time );
			drop_off_date = createDateFromStrings( drop_off_date, 
					drop_off_time );

			// Adjust the timezone
			pick_up_date = this.adjustTimezone( pick_up_date, pick_up_zone );
			drop_off_date = this.adjustTimezone( drop_off_date, drop_off_zone );

			if( this.i_calendar_date == undefined ) {
				this.i_calendar_date = floorDay( pick_up_date );
			}

			// Create the events
			TravelCalendarInterface.obj.createEvent( pick_up_date,
					addMinutes( pick_up_date, 15 ),
					"Pick up rental car", data );
			TravelCalendarInterface.obj.createEvent( drop_off_date,
					addMinutes( drop_off_date, 15 ),
					"Drop off rental car", data );
			ret = 2;

		}

	}

	return ret;

}

// --------------------
// -- Static Methods --
// --------------------

/**
 * Handler method for the confirmation window which asks if the user wants
 * to view the created travel events in Calendar.
 *
 * This method will take the user to the Calendar application if the user
 * chose that option.
 *
 * @param	button_text		The text of the button the user clicked
 */

TravelEmailInterface.handleConfirm = function( button_text ) {

	if( button_text == "Go to Calendar" ) {
		TravelCalendarInterface.obj.loadCalendar();
		if( TravelEmailInterface.obj.i_calendar_date != undefined ) {
			TravelCalendarInterface.obj.jumpToDailyView( 
					TravelEmailInterface.obj.i_calendar_date );
		}
	}

}

// -----------------------------------
// -- Resource Manager Notification --
// -----------------------------------

JavaScriptResource.notifyComplete( "./src/Extensions/Travel/components/" +
		"Component.TravelEmailInterface.js" );

JavaScriptResource.notifyComplete("./btExtTravel.js");
