var { cal } = ChromeUtils.import("resource:///modules/calendar/calUtils.jsm");
var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
ChromeUtils.import("resource://gre/modules/AppConstants.jsm");
ChromeUtils.import("resource://gre/modules/Preferences.jsm");
var { AddonManger } = Components.utils.import("resource://gre/modules/AddonManager.jsm");
var { ExtensionParent } = ChromeUtils.import("resource://gre/modules/ExtensionParent.jsm");
var extension = ExtensionParent.GlobalManager.getExtension("Timetable@Sungho.Hwang");


var myapi = class extends ExtensionCommon.ExtensionAPI {
  onShutdown(isAppShutdown) {
    if (isAppShutdown) {
        return;
    }
    const Cu = Components.utils;
    const rootURI = this.extension.rootURI.spec;
    for (var module of Cu.loadedModules) {
        if (module.startsWith(rootURI)) {
            Cu.unload(module);
            };
    }
    const { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
    Services.obs.notifyObservers(null, "startupcache-invalidate", null);
    }
  getAPI(context) {
  extension.callOnClose(this)
    return {
        myapi: {
            setOne: function (selector, property, timeTable) {
                var windows = Services.wm.getEnumerator("mail:3pane");
                while (windows.hasMoreElements()) {
                    var window = windows.getNext();
                    var element = window.document.querySelector(selector)
                    var timeTable = window.document.createXULElement('calendar-modevbox');
                    timeTable.style.width = "210px";
                    timeTable.setAttribute("id", "time-table");
                    timeTable.setAttribute("mode", "task");
                    timeTable.style.border = '1px solid';
                    timeTable.style.fontSize = '13px';
                    timeTable.style.display = 'flex';
                    timeTable.style.flexDirection = 'column';
                    timeTable.style.flexWrap = 'wrap';
                    var mbox = window.document.createElement("box");
                    mbox.setAttribute("action", "mbox");
                    var dateBoxO = window.document.createXULElement('vbox');
                    var dateBoxT = window.document.createXULElement('hbox');
                    var dateToday = window.document.createXULElement('hbox');
                    function mboxatDate(date) {
                        var d = new Date(date),
                            month = '' + (d.getMonth() + 1),
                            day = '' + d.getDate(),
                            year = "/ " + d.getFullYear();

                        return [year, month, day].join('-');
                    };
                    dateToday.append(mboxatDate(Date()));
                    dateToday.style.display = "flex";
                    dateToday.style.alignItems = "center";
                    dateToday.style.justifyContent = "center";
                    dateToday.style.fontWeight = "bold";
                    dateToday.style.fontSize = "13px";
                    var inputDate = window.document.createElement("input");
                    var inputDate = window.document.createElement("input");
                    inputDate.style.fontWeight = "bold";
                    inputDate.style.fontSize = "13px";
                    inputDate.setAttribute("id", "inputDate");
                    inputDate.setAttribute("id", "inputDate");

                    function divDate(date) {
                        var day = Services.wm.getMostRecentWindow("mail:3pane").TodayPane.start.day;
                        var month = Services.wm.getMostRecentWindow("mail:3pane").TodayPane.start.month + 1;
                        var year = Services.wm.getMostRecentWindow("mail:3pane").TodayPane.start.year;

                        return [year, month, day].join('-');
                    };
                    inputDate.setAttribute("value", divDate());
                    inputDate.setAttribute("onchange", "Todaypane.setDaywithjsDate(this.value)");
                    dateBoxO.style.display = "flex";
                    dateBoxO.style.alignItems = "center";
                    dateBoxO.style.justifyContent = "center";
                    inputDate.style.display = "flex";
                    inputDate.style.alignItems = "center";
                    inputDate.style.justifyContent = "center";
                    inputDate.style.display = "flex";
                    inputDate.style.alignItems = "center";
                    inputDate.style.justifyContent = "center";
                    dateBoxT.style.display = "flex";
                    dateBoxT.style.alignItems = "center";
                    dateBoxT.style.justifyContent = "center";
                    inputDate.style.height = '13px';
                    inputDate.style.fontSize = '13px';
                    inputDate.style.width = '80px';
                    inputDate.style.fontWeight = "bold";
                    var miniMonthBtn = window.document.getElementById("miniday-dropdown-button").cloneNode(0);
                    miniMonthBtn.setAttribute("type", "menu");
                    miniMonthBtn.setAttribute("wantdropmarker", "true");
                    miniMonthBtn.setAttribute("class", "toolbarbutton");
                    var dropdownMinimonth = window.document.getElementById("miniday-dropdown-minimonth").cloneNode(0);
                    var popup = window.document.createXULElement("menupopup");
                    dropdownMinimonth.setAttribute("type", "menuitem");
                    popup.appendChild(dropdownMinimonth);
                    dropdownMinimonth.addEventListener("click", function () { inputDate.setAttribute("value", divDate()); });
                    miniMonthBtn.appendChild(popup);
                    dateBoxO.appendChild(inputDate);
                    dateBoxO.appendChild(miniMonthBtn);
                    dateBoxT.appendChild(inputDate);
                    dateBoxT.appendChild(dateToday);
                    mbox.appendChild(dateBoxO);
                    mbox.appendChild(dateBoxT);

                    var AM06 = window.document.createXULElement('hbox');
                    AM06.style.padding = '0';
                    AM06.style.margin = '0';
                    var label06 = window.document.createXULElement('label');
                    label06.setAttribute('value', 'AM 06:');
                    label06.style.height = '13px';
                    label06.style.padding = '0';
                    label06.style.margin = '0';
                    label06.style.width = '50px';
                    label06.style.textAlign = 'left';
                    var input06 = window.document.createElement('input');
                    input06.style.height = '13px';
                    input06.style.width = '150px';
                    input06.style.padding = '0';
                    input06.style.margin = '0';
                    input06.style.align = 'right';
                    input06.setAttribute("type", "text");
                    input06.setAttribute("id", "input06");
                    input06.setAttribute("required", "off");
                    AM06.appendChild(label06);
                    AM06.appendChild(input06);
                    mbox.appendChild(AM06);

                    var AM07 = window.document.createXULElement('hbox');
                    AM07.style.padding = '0';
                    AM07.style.margin = '0';
                    var label07 = window.document.createXULElement('label');
                    label07.setAttribute('value', 'AM 07:');
                    label07.style.height = '13px';
                    label07.style.padding = '0';
                    label07.style.margin = '0';
                    label07.style.width = '50px';
                    label07.style.textAlign = 'left';
                    var input07 = window.document.createElement('input');
                    input07.style.height = '13px';
                    input07.style.width = '150px';
                    input07.style.padding = '0';
                    input07.style.margin = '0';
                    input07.style.align = 'right';
                    input07.setAttribute("type", "text");
                    input07.setAttribute("id", "input07");
                    input07.setAttribute("required", "off");
                    AM07.appendChild(label07);
                    AM07.appendChild(input07);
                    mbox.appendChild(AM07);

                    var AM08 = window.document.createXULElement('hbox');
                    AM08.style.padding = '0';
                    AM08.style.margin = '0';
                    var label08 = window.document.createXULElement('label');
                    label08.setAttribute('value', 'AM 08:');
                    label08.style.height = '13px';
                    label08.style.padding = '0';
                    label08.style.margin = '0';
                    label08.style.width = '50px';
                    label08.style.textAlign = 'left';
                    var input08 = window.document.createElement('input');
                    input08.style.height = '13px';
                    input08.style.width = '150px';
                    input08.style.padding = '0';
                    input08.style.margin = '0';
                    input08.style.align = 'right';
                    input08.setAttribute("type", "text");
                    input08.setAttribute("id", "input08");
                    input08.setAttribute("required", "off");
                    AM08.appendChild(label08);
                    AM08.appendChild(input08);
                    mbox.appendChild(AM08);

                    var AM09 = window.document.createXULElement('hbox');
                    AM09.style.padding = '0';
                    AM09.style.margin = '0';
                    var label09 = window.document.createXULElement('label');
                    label09.setAttribute('value', 'AM 09:');
                    label09.style.height = '13px';
                    label09.style.padding = '0';
                    label09.style.margin = '0';
                    label09.style.width = '50px';
                    label09.style.textAlign = 'left';
                    var input09 = window.document.createElement('input');
                    input09.style.height = '13px';
                    input09.style.width = '150px';
                    input09.style.padding = '0';
                    input09.style.margin = '0';
                    input09.style.align = 'right';
                    input09.setAttribute("type", "text");
                    input09.setAttribute("id", "input09");
                    input09.setAttribute("required", "off");
                    AM09.appendChild(label09);
                    AM09.appendChild(input09);
                    mbox.appendChild(AM09);

                    var AM10 = window.document.createXULElement('hbox');
                    AM10.style.padding = '0';
                    AM10.style.margin = '0';
                    var label10 = window.document.createXULElement('label');
                    label10.setAttribute('value', 'AM 10:');
                    label10.style.height = '13px';
                    label10.style.padding = '0';
                    label10.style.margin = '0';
                    label10.style.width = '50px';
                    label10.style.textAlign = 'left';
                    var input10 = window.document.createElement('input');
                    input10.style.height = '13px';
                    input10.style.width = '150px';
                    input10.style.padding = '0';
                    input10.style.margin = '0';
                    input10.style.align = 'right';
                    input10.setAttribute("type", "text");
                    input10.setAttribute("id", "input10");
                    input10.setAttribute("required", "off");
                    AM10.appendChild(label10);
                    AM10.appendChild(input10);
                    mbox.appendChild(AM10);

                    var AM11 = window.document.createXULElement('hbox');
                    AM11.style.padding = '0';
                    AM11.style.margin = '0';
                    var label11 = window.document.createXULElement('label');
                    label11.setAttribute('value', 'AM 11:');
                    label11.style.height = '13px';
                    label11.style.padding = '0';
                    label11.style.margin = '0';
                    label11.style.width = '50px';
                    label11.style.textAlign = 'left';
                    var input11 = window.document.createElement('input');
                    input11.style.height = '13px';
                    input11.style.width = '150px';
                    input11.style.padding = '0';
                    input11.style.margin = '0';
                    input11.style.align = 'right';
                    input11.setAttribute("type", "text");
                    input11.setAttribute("id", "input11");
                    input11.setAttribute("required", "off");
                    AM11.appendChild(label11);
                    AM11.appendChild(input11);
                    mbox.appendChild(AM11);

                    var MD12 = window.document.createXULElement('hbox');
                    MD12.style.padding = '0';
                    MD12.style.margin = '0';
                    var label12 = window.document.createXULElement('label');
                    label12.setAttribute('value', 'MD 12:');
                    label12.style.height = '13px';
                    label12.style.padding = '0';
                    label12.style.margin = '0';
                    label12.style.width = '50px';
                    label12.style.textAlign = 'left';
                    var input12 = window.document.createElement('input');
                    input12.style.height = '13px';
                    input12.style.width = '150px';
                    input12.style.padding = '0';
                    input12.style.margin = '0';
                    input12.style.align = 'right';
                    input12.setAttribute("type", "text");
                    input12.setAttribute("id", "input12");
                    input12.setAttribute("required", "off");
                    MD12.appendChild(label12);
                    MD12.appendChild(input12);
                    mbox.appendChild(MD12);

                    var PM01 = window.document.createXULElement('hbox');
                    PM01.style.padding = '0';
                    PM01.style.margin = '0';
                    var label13 = window.document.createXULElement('label');
                    label13.setAttribute('value', 'PM 01:');
                    label13.style.height = '13px';
                    label13.style.padding = '0';
                    label13.style.margin = '0';
                    label13.style.width = '50px';
                    label13.style.textAlign = 'left';
                    var input13 = window.document.createElement('input');
                    input13.style.height = '13px';
                    input13.style.width = '150px';
                    input13.style.padding = '0';
                    input13.style.margin = '0';
                    input13.style.align = 'right';
                    input13.setAttribute("type", "text");
                    input13.setAttribute("id", "input13");
                    input13.setAttribute("required", "off");
                    PM01.appendChild(label13);
                    PM01.appendChild(input13);
                    mbox.appendChild(PM01);

                    var PM02 = window.document.createXULElement('hbox');
                    PM02.style.padding = '0';
                    PM02.style.margin = '0';
                    var label14 = window.document.createXULElement('label');
                    label14.setAttribute('value', 'PM 02:');
                    label14.style.height = '13px';
                    label14.style.padding = '0';
                    label14.style.margin = '0';
                    label14.style.width = '50px';
                    label14.style.textAlign = 'left';
                    var input14 = window.document.createElement('input');
                    input14.style.height = '13px';
                    input14.style.width = '150px';
                    input14.style.padding = '0';
                    input14.style.margin = '0';
                    input14.style.align = 'right';
                    input14.setAttribute("type", "text");
                    input14.setAttribute("id", "input14");
                    input14.setAttribute("required", "off");
                    PM02.appendChild(label14);
                    PM02.appendChild(input14);
                    mbox.appendChild(PM02);

                    var PM03 = window.document.createXULElement('hbox');
                    PM03.style.padding = '0';
                    PM03.style.margin = '0';
                    var label15 = window.document.createXULElement('label');
                    label15.setAttribute('value', 'PM 03:');
                    label15.style.height = '13px';
                    label15.style.padding = '0';
                    label15.style.margin = '0';
                    label15.style.width = '50px';
                    label15.style.textAlign = 'left';
                    var input15 = window.document.createElement('input');
                    input15.style.height = '13px';
                    input15.style.width = '150px';
                    input15.style.padding = '0';
                    input15.style.margin = '0';
                    input15.style.align = 'right';
                    input15.setAttribute("type", "text");
                    input15.setAttribute("id", "input15");
                    input15.setAttribute("required", "off");
                    PM03.appendChild(label15);
                    PM03.appendChild(input15);
                    mbox.appendChild(PM03);

                    var PM04 = window.document.createXULElement('hbox');
                    PM04.style.padding = '0';
                    PM04.style.margin = '0';
                    var label16 = window.document.createXULElement('label');
                    label16.setAttribute('value', 'PM 04:');
                    label16.style.height = '13px';
                    label16.style.padding = '0';
                    label16.style.margin = '0';
                    label16.style.width = '50px';
                    label16.style.textAlign = 'left';
                    var input16 = window.document.createElement('input');
                    input16.style.height = '13px';
                    input16.style.width = '150px';
                    input16.style.padding = '0';
                    input16.style.margin = '0';
                    input16.style.align = 'right';
                    input16.setAttribute("type", "text");
                    input16.setAttribute("id", "input16");
                    input16.setAttribute("required", "off");
                    PM04.appendChild(label16);
                    PM04.appendChild(input16);
                    mbox.appendChild(PM04);

                    var PM05 = window.document.createXULElement('hbox');
                    PM05.style.padding = '0';
                    PM05.style.margin = '0';
                    var label17 = window.document.createXULElement('label');
                    label17.setAttribute('value', 'PM 05:');
                    label17.style.height = '13px';
                    label17.style.padding = '0';
                    label17.style.margin = '0';
                    label17.style.width = '50px';
                    label17.style.textAlign = 'left';
                    var input17 = window.document.createElement('input');
                    input17.style.height = '13px';
                    input17.style.width = '150px';
                    input17.style.padding = '0';
                    input17.style.margin = '0';
                    input17.style.align = 'right';
                    input17.setAttribute("type", "text");
                    input17.setAttribute("id", "input17");
                    input17.setAttribute("required", "off");
                    PM05.appendChild(label17);
                    PM05.appendChild(input17);
                    mbox.appendChild(PM05);

                    var PM06 = window.document.createXULElement('hbox');
                    PM06.style.padding = '0';
                    PM06.style.margin = '0';
                    var label18 = window.document.createXULElement('label');
                    label18.setAttribute('value', 'PM 06:');
                    label18.style.height = '13px';
                    label18.style.padding = '0';
                    label18.style.margin = '0';
                    label18.style.width = '50px';
                    label18.style.textAlign = 'left';
                    var input18 = window.document.createElement('input');
                    input18.style.height = '13px';
                    input18.style.width = '150px';
                    input18.style.padding = '0';
                    input18.style.margin = '0';
                    input18.style.align = 'right';
                    input18.setAttribute("type", "text");
                    input18.setAttribute("id", "input18");
                    input18.setAttribute("required", "off");
                    PM06.appendChild(label18);
                    PM06.appendChild(input18);
                    mbox.appendChild(PM06);

                    var PM07 = window.document.createXULElement('hbox');
                    PM07.style.padding = '0';
                    PM07.style.margin = '0';
                    var label19 = window.document.createXULElement('label');
                    label19.setAttribute('value', 'PM 07:');
                    label19.style.height = '13px';
                    label19.style.padding = '0';
                    label19.style.margin = '0';
                    label19.style.width = '50px';
                    label19.style.textAlign = 'left';
                    var input19 = window.document.createElement('input');
                    input19.style.height = '13px';
                    input19.style.width = '150px';
                    input19.style.padding = '0';
                    input19.style.margin = '0';
                    input19.style.align = 'right';
                    input19.setAttribute("type", "text");
                    input19.setAttribute("id", "input19");
                    input19.setAttribute("required", "off");
                    PM07.appendChild(label19);
                    PM07.appendChild(input19);
                    mbox.appendChild(PM07);

                    var PM08 = window.document.createXULElement('hbox');
                    PM08.style.padding = '0';
                    PM08.style.margin = '0';
                    var label20 = window.document.createXULElement('label');
                    label20.setAttribute('value', 'PM 08:');
                    label20.style.height = '13px';
                    label20.style.padding = '0';
                    label20.style.margin = '0';
                    label20.style.width = '50px';
                    label20.style.textAlign = 'left';
                    var input20 = window.document.createElement('input');
                    input20.style.height = '13px';
                    input20.style.width = '150px';
                    input20.style.padding = '0';
                    input20.style.margin = '0';
                    input20.style.align = 'right';
                    input20.setAttribute("type", "text");
                    input20.setAttribute("id", "input20");
                    input20.setAttribute("required", "off");
                    PM08.appendChild(label20);
                    PM08.appendChild(input20);
                    mbox.appendChild(PM08);

                    var PM09 = window.document.createXULElement('hbox');
                    PM09.style.padding = '0';
                    PM09.style.margin = '0';
                    var label21 = window.document.createXULElement('label');
                    label21.setAttribute('value', 'PM 09:');
                    label21.style.height = '13px';
                    label21.style.padding = '0';
                    label21.style.margin = '0';
                    label21.style.width = '50px';
                    label21.style.textAlign = 'left';
                    var input21 = window.document.createElement('input');
                    input21.style.height = '13px';
                    input21.style.width = '150px';
                    input21.style.padding = '0';
                    input21.style.margin = '0';
                    input21.style.align = 'right';
                    input21.setAttribute("type", "text");
                    input21.setAttribute("id", "input21");
                    input21.setAttribute("required", "off");
                    PM09.appendChild(label21);
                    PM09.appendChild(input21);
                    mbox.appendChild(PM09);

                    var PM10 = window.document.createXULElement('hbox');
                    PM10.style.padding = '0';
                    PM10.style.margin = '0';
                    var label22 = window.document.createXULElement('label');
                    label22.setAttribute('value', 'PM 10:');
                    label22.style.height = '13px';
                    label22.style.padding = '0';
                    label22.style.margin = '0';
                    label22.style.width = '50px';
                    label22.style.textAlign = 'left';
                    var input22 = window.document.createElement('input');
                    input22.style.height = '13px';
                    input22.style.width = '150px';
                    input22.style.padding = '0';
                    input22.style.margin = '0';
                    input22.style.align = 'right';
                    input22.setAttribute("type", "text");
                    input22.setAttribute("id", "input22");
                    input22.setAttribute("required", "off");
                    PM10.appendChild(label22);
                    PM10.appendChild(input22);
                    mbox.appendChild(PM10);

                    var PM11 = window.document.createXULElement('hbox');
                    PM11.style.padding = '0';
                    PM11.style.margin = '0';
                    var label23 = window.document.createXULElement('label');
                    label23.setAttribute('value', 'PM 11:');
                    label23.style.height = '13px';
                    label23.style.padding = '0';
                    label23.style.margin = '0';
                    label23.style.width = '50px';
                    label23.style.textAlign = 'left';
                    var input23 = window.document.createElement('input');
                    input23.style.height = '13px';
                    input23.style.width = '150px';
                    input23.style.padding = '0';
                    input23.style.margin = '0';
                    input23.style.align = 'right';
                    input23.setAttribute("type", "text");
                    input23.setAttribute("id", "input23");
                    input23.setAttribute("required", "off");
                    PM11.appendChild(label23);
                    PM11.appendChild(input23);
                    mbox.appendChild(PM11);

                    var MN24 = window.document.createXULElement('hbox');
                    MN24.style.padding = '0';
                    MN24.style.margin = '0';
                    var label24 = window.document.createXULElement('label');
                    label24.setAttribute('value', 'MN 24:');
                    label24.style.height = '13px';
                    label24.style.padding = '0';
                    label24.style.margin = '0';
                    label24.style.width = '50px';
                    label24.style.textAlign = 'left';
                    var input24 = window.document.createElement('input');
                    input24.style.height = '13px';
                    input24.style.width = '150px';
                    input24.style.padding = '0';
                    input24.style.margin = '0';
                    input24.style.align = 'right';
                    input24.setAttribute("type", "text");
                    input24.setAttribute("id", "input24");
                    input24.setAttribute("required", "off");
                    MN24.appendChild(label24);
                    MN24.appendChild(input24);
                    mbox.appendChild(MN24);

                    var AM01 = window.document.createXULElement('hbox');
                    AM01.style.padding = '0';
                    AM01.style.margin = '0';
                    var label01 = window.document.createXULElement('label');
                    label01.setAttribute('value', 'AM 01:');
                    label01.style.height = '13px';
                    label01.style.padding = '0';
                    label01.style.margin = '0';
                    label01.style.width = '50px';
                    label01.style.textAlign = 'left';
                    var input01 = window.document.createElement('input');
                    input01.style.height = '13px';
                    input01.style.width = '150px';
                    input01.style.padding = '0';
                    input01.style.margin = '0';
                    input01.style.align = 'right';
                    input01.setAttribute("type", "text");
                    input01.setAttribute("id", "input01");
                    input01.setAttribute("required", "off");
                    AM01.appendChild(label01);
                    AM01.appendChild(input01);
                    mbox.appendChild(AM01);

                    var AM02 = window.document.createXULElement('hbox');
                    AM02.style.padding = '0';
                    AM02.style.margin = '0';
                    var label02 = window.document.createXULElement('label');
                    label02.setAttribute('value', 'AM 02:');
                    label02.style.height = '13px';
                    label02.style.padding = '0';
                    label02.style.margin = '0';
                    label02.style.width = '50px';
                    label02.style.textAlign = 'left';
                    var input02 = window.document.createElement('input');
                    input02.style.height = '13px';
                    input02.style.width = '150px';
                    input02.style.padding = '0';
                    input02.style.margin = '0';
                    input02.style.align = 'right';
                    input02.setAttribute("type", "text");
                    input02.setAttribute("id", "input02");
                    input02.setAttribute("required", "off");
                    AM02.appendChild(label02);
                    AM02.appendChild(input02);
                    mbox.appendChild(AM02);

                    var AM03 = window.document.createXULElement('hbox');
                    AM03.style.padding = '0';
                    AM03.style.margin = '0';
                    var label03 = window.document.createXULElement('label');
                    label03.setAttribute('value', 'AM 03:');
                    label03.style.height = '13px';
                    label03.style.padding = '0';
                    label03.style.margin = '0';
                    label03.style.width = '50px';
                    label03.style.textAlign = 'left';
                    var input03 = window.document.createElement('input');
                    input03.style.height = '13px';
                    input03.style.width = '150px';
                    input03.style.padding = '0';
                    input03.style.margin = '0';
                    input03.style.align = 'right';
                    input03.setAttribute("type", "text");
                    input03.setAttribute("id", "input03");
                    input03.setAttribute("required", "off");
                    AM03.appendChild(label03);
                    AM03.appendChild(input03);
                    mbox.appendChild(AM03);

                    var AM04 = window.document.createXULElement('hbox');
                    AM04.style.padding = '0';
                    AM04.style.margin = '0';
                    var label04 = window.document.createXULElement('label');
                    label04.setAttribute('value', 'AM 04:');
                    label04.style.height = '13px';
                    label04.style.padding = '0';
                    label04.style.margin = '0';
                    label04.style.width = '50px';
                    label04.style.textAlign = 'left';
                    var input04 = window.document.createElement('input');
                    input04.style.height = '13px';
                    input04.style.width = '150px';
                    input04.style.padding = '0';
                    input04.style.margin = '0';
                    input04.style.align = 'right';
                    input04.setAttribute("type", "text");
                    input04.setAttribute("id", "input04");
                    input04.setAttribute("required", "off");
                    AM04.appendChild(label04);
                    AM04.appendChild(input04);
                    mbox.appendChild(AM04);

                    var AM05 = window.document.createXULElement('hbox');
                    AM05.style.padding = '0';
                    AM05.style.margin = '0';
                    var label05 = window.document.createXULElement('label');
                    label05.setAttribute('value', 'AM 05:');
                    label05.style.height = '13px';
                    label05.style.padding = '0';
                    label05.style.margin = '0';
                    label05.style.width = '50px';
                    label05.style.textAlign = 'left';
                    var input05 = window.document.createElement('input');
                    input05.style.height = '13px';
                    input05.style.width = '150px';
                    input05.style.padding = '0';
                    input05.style.margin = '0';
                    input05.style.align = 'right';
                    input05.setAttribute("type", "text");
                    input05.setAttribute("id", "input05");
                    input05.setAttribute("required", "off");
                    AM05.appendChild(label05);
                    AM05.appendChild(input05);
                    mbox.appendChild(AM05);

                    var h1 = window.document.createElement("h1");
                    var h2 = window.document.createElement("h2");
                    timeTable.appendChild(h1);
                    h1.style.fontSize = "13px";
                    h1.innerHTML = "Timetable - Mozilla Thunderbird";
                    h1.style.display = "flex";
                    h1.style.alignItems = "center";
                    h1.style.justifyContent = "center";
                    h2.style.fontSize = "13px";
                    var updateButton = window.document.createElement("button");
                    var displayButton = window.document.createElement("button");
                    updateButton.innerHTML = "Update";
                    updateButton.style.display = "flex";
                    updateButton.style.alignItems = "center";
                    updateButton.style.justifyContent = "center";
                    displayButton.innerHTML = "Display";
                    displayButton.style.display = "flex";
                    displayButton.style.alignItems = "center";
                    displayButton.style.justifyContent = "center";
                    var buttonBoxOne = window.document.createXULElement("hbox");
                    buttonBoxOne.style.display = "flex";
                    buttonBoxOne.style.alignItems = "right";
                    buttonBoxOne.style.justifyContent = "right";
                    updateButton.style.fontSize = "13px";
                    updateButton.style.border = "1px solid";
                    displayButton.style.fontSize = "13px";
                    displayButton.style.border = "1px solid";
                    buttonBoxOne.appendChild(displayButton);
                    buttonBoxOne.appendChild(updateButton);
                    mbox.appendChild(buttonBoxOne);
                    mbox.style.overflow = "auto";
                    updateButton.style.width = "80px";
                    displayButton.style.width = "80px";
                    timeTable.appendChild(mbox);
                    timeTable.appendChild(h2);

                    window.document.getElementById("today-pane-panel").appendChild(timeTable);

                    var db;
                    var request = window.indexedDB.open("database2", 2);

                    request.onupgradeneeded = function () {
                        db = request.result;
                        
                        var objectStore = db.createObjectStore("timetable12", { keyPath: "id", autoIncrement: true});

                        var iDateIndex = objectStore.createIndex("iDate", "iDate", { unique: true });
                        var i06Index = objectStore.createIndex("i06", "i06", { unique: true });
                        var i07Index = objectStore.createIndex("i07", "i07", { unique: true });
                        var i08Index = objectStore.createIndex("i08", "i08", { unique: true });
                        var i09Index = objectStore.createIndex("i09", "i09", { unique: true });
                        var i10Index = objectStore.createIndex("i10", "i10", { unique: true });
                        var i11Index = objectStore.createIndex("i11", "i11", { unique: true });
                        var i12Index = objectStore.createIndex("i12", "i12", { unique: true });
                        var i13Index = objectStore.createIndex("i13", "i13", { unique: true });
                        var i14Index = objectStore.createIndex("i14", "i14", { unique: true });
                        var i15Index = objectStore.createIndex("i15", "i15", { unique: true });
                        var i16Index = objectStore.createIndex("i16", "i16", { unique: true });
                        var i17Index = objectStore.createIndex("i17", "i17", { unique: true });
                        var i18Index = objectStore.createIndex("i18", "i18", { unique: true });
                        var i19Index = objectStore.createIndex("i19", "i19", { unique: true });
                        var i20Index = objectStore.createIndex("i20", "i20", { unique: true });
                        var i21Index = objectStore.createIndex("i21", "i21", { unique: true });
                        var i22Index = objectStore.createIndex("i22", "i22", { unique: true });
                        var i23Index = objectStore.createIndex("i23", "i23", { unique: true });
                        var i24Index = objectStore.createIndex("i24", "i24", { unique: true });
                        var i01Index = objectStore.createIndex("i01", "i01", { unique: true });
                        var i02Index = objectStore.createIndex("i02", "i02", { unique: true });
                        var i03Index = objectStore.createIndex("i03", "i03", { unique: true });
                        var i04Index = objectStore.createIndex("i04", "i04", { unique: true });
                        var i05Index = objectStore.createIndex("i05", "i05", { unique: true });

                        var data = {
                            iDate: "2021-01-23",
                            i06: "ready to write",
                            i07: "ready to write",
                            i08: "ready to write",
                            i09: "ready to write",
                            i10: "ready to write",
                            i11: "ready to write",
                            i12: "ready to write",
                            i13: "ready to write",
                            i14: "ready to write",
                            i15: "ready to write",
                            i16: "ready to write",
                            i17: "ready to write",
                            i18: "ready to write",
                            i19: "ready to write",
                            i20: "ready to write",
                            i21: "ready to write",
                            i22: "ready to write",
                            i23: "ready to write",
                            i24: "ready to write",
                            i01: "ready to write",
                            i02: "ready to write",
                            i03: "ready to write",
                            i04: "ready to write",
                            i05: "ready to write"
                        };                       
                    objectStore.put(data);
                    };

                    request.onerror = function () {
                        h2.textContent += "Error loading database.";
                    };
                    request.onsuccess = function () {
                        h2.textContent += "Developer Sungho Hwang";
                    };

                    updateButton.onclick = function () {

                        var dateVal = window.document.getElementById("inputDate").value;
                        var input06Val = window.document.getElementById("input06").value;
                        var input07Val = window.document.getElementById("input07").value;
                        var input08Val = window.document.getElementById("input08").value;
                        var input09Val = window.document.getElementById("input09").value;
                        var input10Val = window.document.getElementById("input10").value;
                        var input11Val = window.document.getElementById("input11").value;
                        var input12Val = window.document.getElementById("input12").value;
                        var input13Val = window.document.getElementById("input13").value;
                        var input14Val = window.document.getElementById("input14").value;
                        var input15Val = window.document.getElementById("input15").value;
                        var input16Val = window.document.getElementById("input16").value;
                        var input17Val = window.document.getElementById("input17").value;
                        var input18Val = window.document.getElementById("input18").value;
                        var input19Val = window.document.getElementById("input19").value;
                        var input20Val = window.document.getElementById("input20").value;
                        var input21Val = window.document.getElementById("input21").value;
                        var input22Val = window.document.getElementById("input22").value;
                        var input23Val = window.document.getElementById("input23").value;
                        var input24Val = window.document.getElementById("input24").value;
                        var input01Val = window.document.getElementById("input01").value;
                        var input02Val = window.document.getElementById("input02").value;
                        var input03Val = window.document.getElementById("input03").value;
                        var input04Val = window.document.getElementById("input04").value;
                        var input05Val = window.document.getElementById("input05").value;

                        db = request.result;
                        var transaction = db.transaction("timetable12", "readwrite");
                        var objectStore = transaction.objectStore("timetable12");

                        objectStore.openCursor().onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor) {
                                var data = cursor.value;
                                data.iDate = dateVal;
                                data.i06 = input06Val;
                                data.i07 = input07Val;
                                data.i08 = input08Val;
                                data.i09 = input09Val;
                                data.i10 = input10Val;
                                data.i11 = input11Val;
                                data.i12 = input12Val;
                                data.i13 = input13Val;
                                data.i14 = input14Val;
                                data.i15 = input15Val;
                                data.i16 = input16Val;
                                data.i17 = input17Val;
                                data.i18 = input18Val;
                                data.i19 = input19Val;
                                data.i20 = input20Val;
                                data.i21 = input21Val;
                                data.i22 = input22Val;
                                data.i23 = input23Val;
                                data.i24 = input24Val;
                                data.i01 = input01Val;
                                data.i02 = input02Val;
                                data.i03 = input03Val;
                                data.i04 = input04Val;
                                data.i05 = input05Val;
                                var request = cursor.update(data);
                                request.onsuccess = function () {
                                    h2.textContent += ">";
                                };
                                cursor.continue();
                            };
                        };
                    };
                    displayButton.onclick = function () {

                        db = request.result;
                        var transaction = db.transaction("timetable12", "readwrite");
                        var objectStore = transaction.objectStore("timetable12");

                        objectStore.openCursor().onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor) {

                                window.document.getElementById("inputDate").value = cursor.value.iDate;
                                window.document.getElementById("input06").value = cursor.value.i06;
                                window.document.getElementById("input07").value = cursor.value.i07;
                                window.document.getElementById("input08").value = cursor.value.i08;
                                window.document.getElementById("input09").value = cursor.value.i09;
                                window.document.getElementById("input10").value = cursor.value.i10;
                                window.document.getElementById("input11").value = cursor.value.i11;
                                window.document.getElementById("input12").value = cursor.value.i12;
                                window.document.getElementById("input13").value = cursor.value.i13;
                                window.document.getElementById("input14").value = cursor.value.i14;
                                window.document.getElementById("input15").value = cursor.value.i15;
                                window.document.getElementById("input16").value = cursor.value.i16;
                                window.document.getElementById("input17").value = cursor.value.i17;
                                window.document.getElementById("input18").value = cursor.value.i18;
                                window.document.getElementById("input19").value = cursor.value.i19;
                                window.document.getElementById("input20").value = cursor.value.i20;
                                window.document.getElementById("input21").value = cursor.value.i21;
                                window.document.getElementById("input22").value = cursor.value.i22;
                                window.document.getElementById("input23").value = cursor.value.i23;
                                window.document.getElementById("input24").value = cursor.value.i24;
                                window.document.getElementById("input01").value = cursor.value.i01;
                                window.document.getElementById("input02").value = cursor.value.i02;
                                window.document.getElementById("input03").value = cursor.value.i03;
                                window.document.getElementById("input04").value = cursor.value.i04;
                                window.document.getElementById("input05").value = cursor.value.i05;

                                cursor.continue();
                                request.onsuccess = function () {
                                    h2.textContent += "^^";
                                };
                            };
                        };
                    }
                }
            },
                setThree: function() {
                    var windows = Services.wm.getEnumerator("mail:3pane");
                    while (windows.hasMoreElements()) {
                        var window = windows.getNext();
                        var todayPanePanel = window.document.querySelector("#today-pane-panel");
                        var todayPanePanelLastChild = window.document.querySelector("#today-pane-panel>#time-table");
                        todayPanePanel.removeChild(todayPanePanelLastChild);
                   }
                },
                  setSeven: function(id, property, getCurrentFrAMeColor) {
                    var windows = Services.wm.getEnumerator("mail:3pane");
                    while (windows.hasMoreElements()) {
                        var window = windows.getNext();
                            window.document.getElementById('time-table').style.backgroundColor = getCurrentFrAMeColor;
                        }
                    },
                  setEight: function(id, property, getCurrentBorderColor) {
                    var windows = Services.wm.getEnumerator("mail:3pane");
                    while (windows.hasMoreElements()) {
                        var window = windows.getNext();
                            window.document.getElementById('time-table').style.color = getCurrentBorderColor;
                    }
                }
            }
        }
    }
    close() {
                    var windows = Services.wm.getEnumerator("mail:3pane");
                    while (windows.hasMoreElements()) {
                        var window = windows.getNext();
                        var todayPanePanel = window.document.querySelector("#today-pane-panel");
                        var todayPanePanelLastChild = window.document.querySelector("#today-pane-panel>#time-table");
                        todayPanePanel.removeChild(todayPanePanelLastChild);
                   }
        Services.obs.notifyObservers(null, "startupcache-invalidate", null); 
    }
};