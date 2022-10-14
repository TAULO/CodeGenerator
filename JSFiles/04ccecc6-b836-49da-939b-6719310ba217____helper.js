/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "";
var isMobile = false;
var currentSelection, myNicEditor;
$(document).ready(function () {
    performPageActions();
});
function getCurrentPage() {
//returns the current page the user is on
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if (page === "") {
        page = "index.jsp";
    }
    return page;
}
function General() {
    extension = GetExtension();
//    verifyUser();
    Accordion();
    pageOptions();
//    sticky_relocate();
    checkMobile();
    $('textarea').val("");
    $("#datepicker").val("");
    $(".hide-on-load").hide();
    $(window).scroll(sticky_relocate);
    $(".panelClose").click(function () {
        $(this).closest(".overlay").fadeOut(500);
        $(this).closest(".overlay").addClass("hide");
    });
    $(".close_overlay").click(function () {
        $(this).closest(".overlay").fadeOut(500);
        $(this).closest(".overlay").addClass("hide");
    });
    $(".menu-item").click(function () {
        $(".menu-item").removeClass("menu-clicked");
        $(this).addClass("menu-clicked");
    });
    $(".search-btn").click(function () {
        toggleSearchPanel();
    });
    $("#userLoginbutton").click(function () {
        var email_phone = $("#emailad").val();
        var password = $("#loginPass").val();
        UserLogin(email_phone, password);
    });
    $(".panelBtn").click(function () {
        toggleReferencePanel();
    });
    $("#listview").click(function () {
        ListView();
    });
    $("#blockview").click(function () {
        BlockView();
    });
    $("#newContent").click(function () {
        window.location = extension + "index.jsp";
    });
    $("#innersearchbtn").click(function () {
        var searchtext = $("#searchtxt").val();
        filterObjects(searchtext);
    });
    $("#objectTitle").keyup(function () {
        $(this).val(capitaliseFirstLetter($(this).val()));
    });

//-------------------------------Address--------------//
    $("#regStateDDL").keyup(function () {
        var text = $("#regStateDDL").val().trim();
        var parent = $("#stateList");
        parent.empty();
        if (text !== "") {
            $("#regStateDDL").addClass("redborder");
            $("#regTownDDL").prop("disabled", "disabled");
            $("#regLgaDDL").prop("disabled", "disabled");
            $("#regStreetDDL").prop("disabled", "disabled");
            $.each($(".state_name"), function (index, item) {
                var statetext = $(item).text().trim();
                if (statetext.toLowerCase() === text.toLowerCase()) {
                    parent.empty();
                    selectState(item, statetext);
                } else if (statetext.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                    $("<div />", {class: 'row linkbtn bigtxt', text: statetext, click: function () {
                            parent.empty();
                            selectState(item, statetext);
                        }}).appendTo(parent);
                    $("#regStateDDL").addClass("redborder");
                    $("#regTownDDL").prop("disabled", "disabled");
                    $("#regLgaDDL").prop("disabled", "disabled");
                    $("#regStreetDDL").prop("disabled", "disabled");
                }
            });
        } else {
            $("#regStateDDL").addClass("redborder");
            $("#regTownDDL").prop("disabled", "disabled");
            $("#regLgaDDL").prop("disabled", "disabled");
            $("#regStreetDDL").prop("disabled", "disabled");
        }
    });
    $("#regLgaDDL").keyup(function () {
        var text = $("#regLgaDDL").val();
        var parent = $("#lgaList");
        parent.empty();
        if (text !== "") {
            $.each($(".lga_name"), function (index, item) {
                var statetext = $(item).text();
                if (statetext.toLowerCase() === text.toLowerCase()) {
                    parent.empty();
                    selectLga(item, statetext);
                } else if (statetext.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                    $("<div />", {class: 'row linkbtn bigtxt', text: statetext, click: function () {
                            parent.empty();
                            selectLga(item, statetext);
                        }}).appendTo(parent);
                    $("#regLgaDDL").addClass("redborder");
                }
            });
        } else {
            $("#regLgaDDL").removeClass("redborder");
            $("#regTownDDL").removeAttr("disabled");
        }
    });
    $("#regTownDDL").keyup(function () {
        var text = $("#regTownDDL").val();
        var parent = $("#townList");
        parent.empty();
        if (text !== "") {
            $.each($(".town_name"), function (index, item) {
                var statetext = $(item).text();
                if (statetext.toLowerCase() === text.toLowerCase()) {
                    parent.empty();
                    selectTown(item, statetext);
                } else if (statetext.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                    $("<div />", {class: 'row linkbtn bigtxt', text: statetext, click: function () {
                            parent.empty();
                            selectTown(item, statetext);
                        }}).appendTo(parent);
                    $("#regTownDDL").addClass("redborder");
                }
            });
        } else {
            $("#regTownDDL").removeClass("redborder");
            $("#regLgaDDL").removeAttr("disabled");
        }
    });
    $("#regBusStopDDL").keyup(function () {
        var text = $("#regBusStopDDL").val();
        var parent = $("#busstopList");
        parent.empty();
        if (text !== "") {
            $.each($(".busstop_name"), function (index, item) {
                var statetext = $(item).text();
                if (statetext.toLowerCase() === text.toLowerCase()) {
                    parent.empty();
                    selectBusstop(item, statetext);
                } else if (statetext.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                    $("<div />", {class: 'row linkbtn bigtxt', text: statetext, click: function () {
                            parent.empty();
                            selectBusstop(item, statetext);
                        }}).appendTo(parent);
                    $("#regBusStopDDL").addClass("redborder");
                }
            });
        } else {
            $("#regBusStopDDL").removeClass("redborder");
            $("#regStreetDDL").removeAttr("disabled");
        }
    });
    $("#regStreetDDL").keyup(function () {
        var text = $("#regStreetDDL").val();
        var parent = $("#streetList");
        parent.empty();
        if (text !== "") {
            $.each($(".street_name"), function (index, item) {
                var statetext = $(item).text();
                if (statetext.toLowerCase() === text.toLowerCase()) {
                    parent.empty();
                    selectStreet(item, statetext);
                } else if (statetext.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                    $("<div />", {class: 'row linkbtn bigtxt', text: statetext, click: function () {
                            parent.empty();
                            selectStreet(item, statetext);
                        }}).appendTo(parent);
                }
            });
        }
    });
    $("#memberRegistrationbutton").click(function () {
        CheckMemberRegistrationInputs();
    });
    //-----------------------------Address-----------------------------//
    $(document).mouseup(function (e) {
        if (e.target.class !== 'searchPanel' && !$('.searchPanel').find(e.target).length) {
            closeSearchPanel();
        }
    });
}
function verifyUser() {
//This function checks if a user is signed in and responds     
    $("#wmlinks").css("visibility", "hidden");
    $("#wmlinks").hide();
    var userid = $("#userid").val();
    if (userid === "null" || userid === "") {
        $(".forMembers").hide();
        $(".forMembers").addClass("hide");
        $(".notforMembers").show();
        $(".notforMembers").removeClass("hide");
//        alert(extension);
        window.location = extension + "link?location=Logout";
    } else {
        $(".forMembers").removeClass("hide");
        $(".forMembers").show();
        $(".notforMembers").hide();
        $(".notforMembers").addClass("hide");
    }
}
function Accordion() {
    $(".accordion-content").hide();
    $("<i />", {class: "fa fa-fw fa-chevron-up half-marginright smalltext arrow-up"}).prependTo(".accordion-handler").hide();
    $("<i />", {class: "fa fa-fw fa-chevron-down half-marginright smalltext arrow-down"}).prependTo(".accordion-handler");
    $(".accordion-expanded").show();
    $(".accordion-expanded").closest(".accordion-parent").find(".arrow-up").toggle();
    $(".accordion-expanded").closest(".accordion-parent").find(".arrow-down").toggle();
    $(".accordion-handler").click(function () {
        $(this).closest(".accordion-parent").find(".accordion-content").slideToggle(500);
        $(this).find(".arrow-up").toggle();
        $(this).find(".arrow-down").toggle();
    });
}
function transferTileData(tile) {
    var dat = $(tile).find('.data1').text();
    $(tile).find(".item1").text(dat);
    $(tile).find('.edit1').val(dat);
    var dat = $(tile).find('.data2').text();
    $(tile).find(".item2").text(dat);
    $(tile).find('.edit2').val(dat);
    var dat = $(tile).find('.data3').text();
    $(tile).find(".item3").text(dat);
    $(tile).find('.edit3').val(dat);
    var dat = $(tile).find('.data4').text();
    $(tile).find(".item4").text(dat);
    $(tile).find('.edit4').val(dat);
    var dat = $(tile).find('.data5').text();
    $(tile).find(".item5").text(dat);
    $(tile).find('.edit5').val(dat);
    var dat = $(tile).find('.data6').text();
    $(tile).find(".item6").text(dat);
    $(tile).find('.edit6').val(dat);
    var dat = $(tile).find('.data7').text();
    $(tile).find(".item7").text(dat);
    $(tile).find('.edit7').val(dat);
    var dat = $(tile).find('.data8').text();
    $(tile).find(".item8").text(dat);
    $(tile).find('.edit8').val(dat);
    var dat = $(tile).find('.data9').text();
    $(tile).find(".item9").text(dat);
    $(tile).find('.edit9').val(dat);
}
function pageOptions() {
    $(".pageoption1Link").click(function () {
        $(".pageoption").addClass("hide");
        $(".pageoption").hide();
        $(".pageoption1").toggleClass("hide");
        $(".pageoptionLink").removeClass("optionSelected");
        $(".pageoption1Link").addClass("optionSelected");
        $(".pageoption1").fadeToggle(500);
    });
    $(".pageoption2Link").click(function () {
        $(".pageoption").addClass("hide");
        $(".pageoption").hide();
        $(".pageoption2").toggleClass("hide");
        $(".pageoptionLink").removeClass("optionSelected");
        $(".pageoption2Link").addClass("optionSelected");
        $(".pageoption2").fadeToggle(500);
    });
    $(".pageoption3Link").click(function () {
        $(".pageoption").addClass("hide");
        $(".pageoption").hide();
        $(".pageoption3").removeClass("hide");
        $(".pageoptionLink").removeClass("optionSelected");
        $(".pageoption3Link").addClass("optionSelected");
        $(".pageoption3").fadeIn(500);
    });
    $(".pageoption4Link").click(function () {
        $(".pageoption").addClass("hide");
        $(".pageoption").hide();
        $(".pageoption4").removeClass("hide");
        $(".pageoptionLink").removeClass("optionSelected");
        $(".pageoption4Link").addClass("optionSelected");
        $(".pageoption4").fadeIn(500);
    });
    $(".pageoption5Link").click(function () {
        $(".pageoption").addClass("hide");
        $(".pageoption").hide();
        $(".pageoption5").removeClass("hide");
        $(".pageoptionLink").removeClass("optionSelected");
        $(".pageoption5Link").addClass("optionSelected");
        $(".pageoption5").fadeIn(500);
    });
}
function mobileOptions() {
    $(".mobileoption1Link").click(function () {
        $(".mobileoption").addClass("hide");
        $(".mobileoption").hide();
        $(".mobileoption1").removeClass("hide");
        $(".mobileoption1").fadeIn(500);
    });
    $(".mobileoption2Link").click(function () {
        $(".mobileoption").addClass("hide");
        $(".mobileoption").hide();
        $(".mobileoption2").removeClass("hide");
        $(".mobileoption2").fadeIn(500);
    });
    $(".mobileoption3Link").click(function () {
        $(".mobileoption").addClass("hide");
        $(".mobileoption").hide();
        $(".mobileoption3").removeClass("hide");
        $(".mobileoption3").fadeIn(500);
    });
    $(".mobileoption4Link").click(function () {
        $(".mobileoption").addClass("hide");
        $(".mobileoption").hide();
        $(".mobileoption4").removeClass("hide");
        $(".mobileoption4").fadeIn(500);
    });
    $(".mobileoption5Link").click(function () {
        $(".mobileoption").addClass("hide");
        $(".mobileoption").hide();
        $(".mobileoption5").removeClass("hide");
        $(".mobileoption5").fadeIn(500);
    });
    $(".mobile-close").click(function () {
        $(this).closest(".mobile-menu").fadeOut(500);
        $(this).closest(".mobile-menu").addClass("hide");
    });
}
function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top) {
        $("#stick").css("position", "fixed");
        $('#stick').addClass('stick');
    } else {
        $("#stick").css("position", "relative");
        $('#stick').removeClass('stick');
    }
}
function toggleSearchPanel() {
    $(".searchPanel").removeClass("hide");
    $(".searchPanel").toggle(500);
    $("#searchtxt").focus();
}
function closeSearchPanel() {
    $(".searchPanel").removeClass("hide");
    $(".searchPanel").hide(500);
}
function openReferencePanel() {
    $(".refsPanel").removeClass("hide-refs");
    $("#contentList").removeClass("widenright");
    $(".rightTitle").removeClass("widen");
    $("#bookView").removeClass("widenbook");
    $(".righticon").show();
    $(".lefticon").hide();
}
function closeReferencePanel() {
    $(".refsPanel").addClass("hide-refs");
    $("#contentList").addClass("widenright");
    $(".rightTitle").addClass("widen");
    $("#bookView").addClass("widenbook");
    $(".righticon").hide();
    $(".lefticon").show();
}
function toggleReferencePanel() {
    $(".refsPanel").toggleClass("hide-refs");
    $("#contentList").toggleClass("widenright");
    $(".rightTitle").toggleClass("widen");
    $("#bookView").toggleClass("widenbook");
    $(".lefticon, .righticon").toggle();
}
function filterObjects(searchtext) {
    $("body").removeHighlight();
    if (searchtext.trim() !== "") {
        var searchObjs = $(".searchObject");
        var match = $('.searchObject:contains("' + searchtext + '")');
        if (match.text().trim()) {
            searchObjs.hide();
            match.closest(".searchObject").show();
            $(".searchObject").highlight(searchtext);
        } else {
            $(".searchObject").show();
        }
    } else {
        $(".searchObject").show();
    }
}
function checkMobile() {
    isMobile = false;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
    {
        if (screen.width < 600) {
            $(".not-for-mobile").hide();
            $(".mobile-show").removeClass("hide");
            $(".mobile-show").show();
            mobileOptions();
        }
        isMobile = true;
//        toggleSidebar();
    } else {
        tooltip();
    }
}
function getIsMobile() {
    return isMobile;
}
function tooltip() {
    $(".tooltipParent").mouseenter(function () {
        $(this).children(".tooltip").removeClass("hide");
        $(this).children(".tooltip").show();
    });
    $(".tooltipParent").mouseleave(function () {
        $(this).children(".tooltip").addClass("hide");
        $(this).children(".tooltip").hide();
    });
}
function ListView() {
    $("#content").addClass("listview");
    openReferencePanel();
    $(".panelBtn").hide();
}
function BlockView() {
    $("#content").removeClass("listview");
    closeReferencePanel();
    $(".panelBtn").show();
}
function CustomAlert(message) {
    alert(message);
}
function GetCurrentSelection() {
    return currentSelection;
}
function showCustomLoader(loaderText) {
    $(".bottom-loader").text(loaderText);
    $(".bottom-loader").show();
}
function hideCustomLoader() {
    $(".bottom-loader").text("");
    $(".bottom-loader").hide();
}
function capitaliseFirstLetter(text) {
    if (text !== undefined) {
        return text.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}
function getEditor() {
    return myNicEditor;
}
function placeholder(container, text) {
    $(container).text(text);
    $(container).addClass("ashtext");
    $(container).focusin(function () {
        var current_text = $(container).text();
        if (current_text === text) {
            $(container).text("");
            $(container).removeClass("ashtext");
        }
    });
    $(container).focusout(function () {
        var current_text = $(container).text();
        if (current_text === "") {
            $(container).text(text);
            $(container).addClass("ashtext");
        }
    });
}
function CustomAutoComplete(data, textbox) {
    var parent = $("<div />", {class: "parts autoCompleteParent"}).wrap(textbox);
    var result = $("<div />", {class: "autoCompleteContainer wide white border lightborder"}).appendTo(parent);
    textbox.keyup(function () {
        var text = textbox.val().trim();
        parent.find(".autoCompleteContainer").show();
        parent.find(".autoCompleteContainer").empty();
        if (text !== "") {
            $.each(data, function (index, item) {
                if (item.toLowerCase().startsWith(text)) {
//                if (item.toLowerCase().indexOf(text) >= 0) {
                    $("<div />", {class: "mini-padding-vertical whitebtn half-padding-horizontal textleft", text: item, click: function () {
                            textbox.val(item);
                            parent.find(".autoCompleteContainer").empty();
                            parent.find(".autoCompleteContainer").hide();
                            triggerSearch();
                        }}).appendTo(result);
                }
            });
        }
    });
    $(document).mouseup(function (e) {
        if (e.target.class !== 'autoCompleteContainer' && !$('.autoCompleteContainer').find(e.target).length) {
            parent.find(".autoCompleteContainer").empty();
            parent.find(".autoCompleteContainer").hide();
        }
    });
}

//---------------------------------------------------Login-----------------------------------------//
function UserLogin(email_phone, password) {
    $(".loader").show();
    $.ajax({
        url: extension + "UserServlet",
        type: 'GET',
        data: {
            type: "Login",
            email_phone: email_phone,
            password: password
        },
        success: function (data) {
            $(".loader").hide();
            $(".overlay").hide();
            if (data[0] === "Successful") {
                if (data[1] === "member") {
                    window.location = extension + "pages/UserDashBoard.jsp";
                } else if (data[1] === "manager"){
                    window.location = extension + "pages/ManagerDashBoard.jsp";
                } else if (data[1] === "admin"){
                    window.location = extension + "pages/AdminDashBoard.jsp";
                }
            } else {
                CustomAlert(data);
            }
        },
        error: function (error) {
            window.location.reload();
        }
    });
}
function RelocateSectionContent() {
    $(".loader").show();
    $.ajax({
        url: extension + "BookServlet",
        type: 'GET',
        data: {
            type: "RelocateSectionContent"
        },
        success: function (data) {
            alert(data);
        },
        error: function (error) {
            window.location.reload();
        }
    });
}
//---------------------------------------------------Login-----------------------------------------//

//------------------------Address---------------------------------//
function createNewTown(town, stateId) {
    $.ajax({
        url: extension + "AddressServlet",
        type: 'GET',
        data: {
            type: "createNewTown",
            town: town,
            stateId: stateId
        },
        success: function (data) {
            $("#regTownDDLselected").text(data);
//            return data;
        }
    });
}
function createNewLga(lga, stateId) {
    $.ajax({
        url: extension + "AddressServlet",
        type: 'GET',
        data: {
            type: "createNewLga",
            lga: lga,
            stateId: stateId
        },
        success: function (data) {
            $("#regLgaDDLselected").text(data);
//            return data;
        }
    });
}
function createNewStreet(street, parentId, parenttype) {
    $.ajax({
        url: extension + "AddressServlet",
        type: 'GET',
        data: {
            type: "createNewStreet",
            parenttype: parenttype,
            parentId: parentId,
            street: street
        },
        success: function (data) {
            $("#regStreetDDLselected").text(data);
//            return data;
        }
    });
}
function createNewBusstop(busstop, townId) {
    $.ajax({
        url: extension + "AddressServlet",
        type: 'GET',
        data: {
            type: "createNewBusstop",
            busstop: busstop,
            townId: townId
        },
        success: function (data) {
            $("#regBusStopDDLselected").text(data);
//            return data;
        }
    });
}
function selectState(item, statetext) {
    $("#regStateDDL").val(statetext);
    $("#regStateDDL").removeClass("redborder");
    var selectedstate = $(item).closest(".state").children(".state_id").text();
    $("#regStateDDLselected").text(selectedstate);
    getLga("", selectedstate);
    getTown("", selectedstate);
    getStreet("", selectedstate, "state");
    $("#regTownDDL").removeAttr("disabled");
    $("#regLgaDDL").removeAttr("disabled");
    $("#regStreetDDL").removeAttr("disabled");
}
function selectLga(item, statetext) {
    $("#regLgaDDL").val(statetext);
    $("#regLgaDDL").removeClass("redborder");
    var selectedlga = $(item).closest(".lga").children(".lga_id").text();
    $("#regLgaDDLselected").text(selectedlga);
    getPickUpCentersByLocation(selectedlga, "lga");
    getStreet("", selectedlga, "lga");
}
function selectTown(item, statetext) {
    $("#regTownDDL").val(statetext);
    $("#regTownDDL").removeClass("redborder");
    var selectedtown = $(item).closest(".town").children(".town_id").text();
    $("#regTownDDLselected").text(selectedtown);
    getPickUpCentersByLocation(selectedtown, "town");
    getBusstop("", selectedtown);
    getStreet("", selectedtown, "town");
}
function selectBusstop(item, busstoptext) {
    $("#regBusStopDDL").val(busstoptext);
    $("#regBusStopDDL").removeClass("redborder");
    var selectedbusstop = $(item).closest(".busstop").children(".busstop_id").text();
    $("#regBusStopDDLselected").text(selectedbusstop);
    getPickUpCentersByLocation(selectedbusstop, "busstop");
    getStreet("", selectedbusstop, "busstop");
}
function selectStreet(item, statetext) {
    $("#regStreetDDL").val(statetext);
    var selectedstreet = $(item).closest(".street").children(".street_id").text();
    $("#regStreetDDLselected").text(selectedstreet);
}
function getStates(searchedState) {
    $(".loader").show();
    $.ajax({
        url: extension + "AddressServlet",
        type: 'GET',
        data: {
            type: "allStates",
            searchedState: searchedState
        },
        success: function (data) {
            var parent = $('#states');
            parent.empty();
            if (data === "empty") {
                $('<div />', {class: " ", text: "No State"}).appendTo(parent);
            } else {
                var allStates = data;
                $.each(allStates, function (index, state) {
                    var statediv = $('<div />', {class: "state parts"}).appendTo(parent);
                    $('<div />', {class: "state_name", text: state}).appendTo(statediv);
                    $('<div />', {class: "state_id", text: index}).appendTo(statediv);
                });
            }
            $(".loader").hide();
        },
        error: function () {
            CustomAlert("Please Check your Network Connection");
        }
    });
}
function getLga(searchedLga, parentid) {
    $(".loader").show();
    $.ajax({
        url: extension + "AddressServlet",
        type: 'GET',
        data: {
            type: "Lga",
            searchedLga: searchedLga,
            parent: parentid
        },
        success: function (data) {
            var parent = $("#lgas");
            parent.empty();
            if (data === "empty") {
                $('<div />', {class: "row", text: "No Local Government Area"}).appendTo(parent);
            } else {
                var lga = data;
                $.each(lga, function (index, Lga) {
                    var lgadiv = $('<div />', {class: "lga parts"}).appendTo(parent);
                    $('<div />', {class: "lga_name", text: Lga}).appendTo(lgadiv);
                    $('<div />', {class: "lga_id", text: index}).appendTo(lgadiv);
                });
            }
            $(".loader").hide();
        },
        error: function () {
            CustomAlert("Please Check your Network Connection");
        }
    });
}
function getTown(searchedTown, parentid) {
    $(".loader").show();
    $.ajax({
        url: extension + "AddressServlet",
        type: 'GET',
        data: {
            type: "towns",
            searchedTown: searchedTown,
            parent: parentid
        },
        success: function (data) {
            var parent = $("#towns");
            parent.empty();
            if (data === "empty") {
                $('<div />', {class: "row", text: "No Town"}).appendTo(parent);
            } else {
                var town = data;
                $.each(town, function (index, twn) {
                    var towndiv = $('<div />', {class: "town parts"}).appendTo(parent);
                    $('<div />', {class: "town_name", text: twn}).appendTo(towndiv);
                    $('<div />', {class: "town_id", text: index}).appendTo(towndiv);
                });
            }
            $(".loader").hide();
        },
        error: function () {
            CustomAlert("Please Check your Network Connection");
        }
    });
}
function getBusstop(searchedBusstop, parentid) {
    $(".loader").show();
    $.ajax({
        url: extension + "AddressServlet",
        type: 'GET',
        data: {
            type: "busstops",
            searchedBusstop: searchedBusstop,
            parent: parentid
        },
        success: function (data) {
            var parent = $("#busstops");
            parent.empty();
            if (data === "empty") {
                $('<div />', {class: "row", text: "No Bus-Stop"}).appendTo(parent);
            } else {
                var town = data;
                $.each(town, function (index, twn) {
                    var busstopdiv = $('<div />', {class: "busstop parts"}).appendTo(parent);
                    $('<div />', {class: "busstop_name", text: twn}).appendTo(busstopdiv);
                    $('<div />', {class: "busstop_id", text: index}).appendTo(busstopdiv);
                });
            }
            $(".loader").hide();
        }
    });
}
function getStreet(searchedStreet, parentid, parenttype) {
    $(".loader").show();
    $.ajax({
        url: extension + "AddressServlet",
        type: 'GET',
        data: {
            type: "streets",
            searchedStreet: searchedStreet,
            parent: parentid,
            ptype: parenttype
        },
        success: function (data) {
            var parent = $("#streets");
            parent.empty();
            if (data === "empty") {
                $('<div />', {class: " ", text: "No Street"}).appendTo(parent);
            } else {
                var street = data;
                $.each(street, function (index, Street) {
                    var streetdiv = $('<div />', {class: "street parts", text: Street}).appendTo(parent);
                    $('<div />', {class: "street_name", text: Street}).appendTo(streetdiv);
                    $('<div />', {class: "street_id", text: index}).appendTo(streetdiv);
                });
            }
            $(".loader").hide();
        },
        error: function () {
            CustomAlert("Please Check your Network Connection");
        }
    });
}
//----------------Address--------------------//

//---------------------------Registration---------------------------//
function CheckMemberRegistrationInputs() {
    var firstname = $("#fnam").val();
    var lastname = $("#lnam").val();
    var phonenumber = $("#phonenumber").val();
    var password = $("#password").val();
    var team = $("#team option:selected").val();
//    alert(team);
    var emailaddress = $("#email").val();
    var emailPat = /^(\".*\"|[A-Za-z]\w*)@(\[\d{1,3}(\.\d{1,3}){3}]|[A-Za-z]\w*(\.[A-Za-z]\w*)+)$/;
    var confirmpassword = $("#confirmpassword").val();
    if (firstname === "First Name" || firstname === "") {
        CustomAlert("Please Enter your First Name");
    }
    else if (lastname === "Last Name" || lastname === "") {
        CustomAlert("Please Enter your Last Name");
    }
    else if (phonenumber === "Phone Number" || phonenumber === "") {
        CustomAlert("Please Enter your Phone Number");
    }
    else if (password === "Password" || password === "") {
        CustomAlert("Please Enter your Password");
    }
    else if (team === "0") {
        CustomAlert("Please Select your Team");
    }
    else if (confirmpassword === "Confirm Password" || confirmpassword !== password) {
        CustomAlert("Please Confirm your Password");
    }
    else if (emailaddress === "Email Address" || emailaddress === "") {
        CustomAlert("Please Enter your Email Address");
    }
    else if (!emailaddress.match(emailPat)) {
        CustomAlert("Please Enter a legit Email Address");
    }
    else {
        memberRegistration(firstname, lastname, emailaddress, phonenumber, password, team);
    }
}
function memberRegistration(firstname, lastname, emailaddress, phonenumber, password, team) {
    $.ajax({
        url: extension + "UserServlet",
        type: 'GET',
        data: {
            type: "MemberRegistration",
            firstname: firstname,
            lastname: lastname,
            emailaddress: emailaddress,
            phonenumber: phonenumber,
            password: password,
            team: team
        },
        success: function (data) {
            if (data === "success") {
                CustomAlert("User Account created successfully.");
                window.location = extension + "pages/UserDashBoard.jsp";
            } else {
                CustomAlert(data);
            }
        }
    });
}

//---------------------------Registration----------------------------//


