//var appWP = angular.module('appWidgetPreferences', ['ui.bootstrap', 'ngSanitize']);
//Service
appWP.factory('exService', function ($log) {
    var listItemID = "";
    var selectedControlsJSON = "";
    var myPreferences = "";
    var userSelected = false;

    return {
        setJSON: function (selectedJSON) {
            selectedControlsJSON = selectedJSON;
        },
        getJSON: function () {
            return selectedControlsJSON;
        },
        getPreferences: function () {
            var reqUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists(guid'" + CCI_Common.GetConfig("myWorkspace Widget Preferences") + "')/items?$filter=UserID eq '" + _spPageContextInfo.userLoginName + "'";
            jQuery.ajax({
                url: reqUri,
                type: "GET",
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose",
                },
                success: function (data) {
                    if (data.d.results.length == 1) {
                        myPreferences = data.d.results[0].Preferences;
                        //listItemID = data.d.results[0].ID;
                        return myPreferences;
                    }
                    else {
                        $log.info("Check Preferences list for user - " + _spPageContextInfo.userLoginName);
                    }
                },
                error: function (jqxr, errorCode, errorThrown) {
                    CCI_Common.LogException(_spPageContextInfo.userLoginName, "CCI-myWorkspace_Widgets.js--getPreferences", _spPageContextInfo.serverRequestPath, jqxr.responseText);
                }
            });
            return myPreferences;
        }
    };
});

appWP.controller('ModalDemoCtrl', function ($scope, $rootScope, $sce, $modal, $log, exService) {

    init();

    function init() {
        //Check for Preferences in Widget Preferences list
        var currentPref = exService.getPreferences();
        if (typeof (currentPref) != "undefined" && currentPref != null && currentPref != "") {
            //Display widgets
            var wdgtsToDisplay = JSON.parse(currentPref);
            if (wdgtsToDisplay.selections.length > 0) {
                LoadControls(wdgtsToDisplay);
            }
        }
        else { //Initial load
            var defaultPref = {
                "selections": [
                    { "chkCtrl": "chkBIDashboard", "ddlCtrl": "ddlBIDashboard", "ddlCtrlValue": "1" },
                    { "chkCtrl": "chkGroups", "ddlCtrl": "ddlGroups", "ddlCtrlValue": "2" },
                    { "chkCtrl": "chkMyDocs", "ddlCtrl": "ddlMyDocs", "ddlCtrlValue": "3" },
                    { "chkCtrl": "chkMyTasks", "ddlCtrl": "chkMyTasks", "ddlCtrlValue": "4" }
                ]
            };
            LoadDefaultControls(defaultPref);
        }
    }

    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'WidgetPreferences.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                
            }
        });


        modalInstance.result.then(function () {
            var currentPref = exService.getJSON();
            if (typeof (currentPref) != "undefined" && currentPref != "") {
                LoadControls(currentPref);
            }
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
    
    //Load controls
    //Check current preferences
    function LoadControls(currentPreferences) {
        //var ctrlsToPopulate = JSON.parse(currentPreferences);
        $scope.firstTemplate = "";
        $scope.secondTemplate = "";
        $scope.thirdTemplate = "";
        $scope.fourthTemplate = "";
        $scope.fifthTemplate = "";
        if (currentPreferences.selections.length > 0) {
            /*var ctrlsToPopulate = currentPreferences.selections.sort(function (a, b) {
                return parseInt(a.ddlCtrlValue) - parseInt(b.ddlCtrlValue);
            });*/
            for (var count = 0; count < currentPreferences.selections.length; count++) {
                switch (JSON.parse(currentPreferences.selections[count])["chkCtrl"]) {
                    case "chkBIDashboard":
                        switch (JSON.parse(currentPreferences.selections[count])["ddlCtrlValue"]) {
                            case "1":
                                $scope.firstTemplate = "BIDashboard.html";
                                break;
                            case "2":
                                $scope.secondTemplate = "BIDashboard.html";
                                break;
                            case "3":
                                $scope.thirdTemplate = "BIDashboard.html";
                                break;
                            case "4":
                                $scope.fourthTemplate = "BIDashboard.html";
                                break;
                        }
                        break;
                    case "chkMyTasks":
                        switch (JSON.parse(currentPreferences.selections[count])["ddlCtrlValue"]) {
                            case "1":
                                $scope.firstTemplate = "MyTasks.html";
                                break;
                            case "2":
                                $scope.secondTemplate = "MyTasks.html";
                                break;
                            case "3":
                                $scope.thirdTemplate = "MyTasks.html";
                                break;
                            case "4":
                                $scope.fourthTemplate = "MyTasks.html";
                                break;
                        }
                        break;
                    case "chkMyDocs":
                        switch (JSON.parse(currentPreferences.selections[count])["ddlCtrlValue"]) {
                            case "1":
                                $scope.firstTemplate = "MyDocuments.html";
                                break;
                            case "2":
                                $scope.secondTemplate = "MyDocuments.html";
                                break;
                            case "3":
                                $scope.thirdTemplate = "MyDocuments.html";
                                break;
                            case "4":
                                $scope.fourthTemplate = "MyDocuments.html";
                                break;
                        }
                        break;
                    case "chkGroups":
                        switch (JSON.parse(currentPreferences.selections[count])["ddlCtrlValue"]) {
                            case "1":
                                $scope.firstTemplate = "Groups.html";
                                break;
                            case "2":
                                $scope.secondTemplate = "Groups.html";
                                break;
                            case "3":
                                $scope.thirdTemplate = "Groups.html";
                                break;
                            case "4":
                                $scope.fourthTemplate = "Groups.html";
                                break;
                        }
                        break;
                }
            }
        }
    }

    //Inital Load
    function LoadDefaultControls(currentPreferences) {
        //var ctrlsToPopulate = JSON.parse(currentPreferences);
        $scope.firstTemplate = "";
        $scope.secondTemplate = "";
        $scope.thirdTemplate = "";
        $scope.fourthTemplate = "";

        if (currentPreferences.selections.length > 0) {
            /*var ctrlsToPopulate = currentPreferences.selections.sort(function (a, b) {
                return parseInt(a.ddlCtrlValue) - parseInt(b.ddlCtrlValue);
            });*/
            for (var count = 0; count < currentPreferences.selections.length; count++) {
                switch (currentPreferences.selections[count]["chkCtrl"]) {
                    case "chkBIDashboard":
                        switch (currentPreferences.selections[count]["ddlCtrlValue"]) {
                            case "1":
                                $scope.firstTemplate = "BIDashboard.html";
                                break;
                            case "2":
                                $scope.secondTemplate = "BIDashboard.html";
                                break;
                            case "3":
                                $scope.thirdTemplate = "BIDashboard.html";
                                break;
                            case "4":
                                $scope.fourthTemplate = "BIDashboard.html";
                                break;
                        }
                        break;
                    case "chkGroups":
                        switch (currentPreferences.selections[count]["ddlCtrlValue"]) {
                            case "1":
                                $scope.firstTemplate = "Groups.html";
                                break;
                            case "2":
                                $scope.secondTemplate = "Groups.html";
                                break;
                            case "3":
                                $scope.thirdTemplate = "Groups.html";
                                break;
                            case "4":
                                $scope.fourthTemplate = "Groups.html";
                                break;
                        }
                        break;
                    case "chkMyDocs":
                        switch (currentPreferences.selections[count]["ddlCtrlValue"]) {
                            case "1":
                                $scope.firstTemplate = "MyDocuments.html";
                                break;
                            case "2":
                                $scope.secondTemplate = "MyDocuments.html";
                                break;
                            case "3":
                                $scope.thirdTemplate = "MyDocuments.html";
                                break;
                            case "4":
                                $scope.fourthTemplate = "MyDocuments.html";
                                break;
                        }
                        break;
                    case "chkMyTasks":
                        switch (currentPreferences.selections[count]["ddlCtrlValue"]) {
                            case "1":
                                $scope.firstTemplate = "MyTasks.html";
                                break;
                            case "2":
                                $scope.secondTemplate = "MyTasks.html";
                                break;
                            case "3":
                                $scope.thirdTemplate = "MyTasks.html";
                                break;
                            case "4":
                                $scope.fourthTemplate = "MyTasks.html";
                                break;
                        }
                        break;
                }
            }
        }
    }
});

//Model window
appWP.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $log, exService) {

    $scope.orderNumbers = ["1", "2", "3", "4"];
    $scope.DisplaySave = true;

    $scope.checkUniqueOrder = function () {
        var orderCounter = {};
        var c;
        var allOrder = [
            ((typeof ($scope.chkBIDashboard) == "undefined" || $scope.chkBIDashboard == false)) ? 0 : $scope.ddlBIDashboard,
            ((typeof ($scope.chkGroups) == "undefined" || $scope.chkGroups == false)) ? 0 : $scope.ddlGroups,
            ((typeof ($scope.chkMyDocs) == "undefined" || $scope.chkMyDocs == false)) ? 0 : $scope.ddlMyDocs,
            ((typeof ($scope.chkMyTasks) == "undefined" || $scope.chkMyTasks == false)) ? 0 : $scope.ddlMyTasks
        ];
        for (var i = 0; i <= 4; i++) {
            if (allOrder[i] > 0) {
                c = orderCounter[allOrder[i]] = (orderCounter[allOrder[i]] || 0) + 1;
                if (c > 1) {
                    break;
                }
            }
        }
        if (c > 1) {
            $scope.safeApply(function () {
                $scope.UniqueOrderMessage = CCI_Common.GetConfig("Unique Order Message");
                $scope.DisplaySave = false;
            });
        }
        else {
            $scope.safeApply(function () {
                $scope.UniqueOrderMessage = "";
                $scope.DisplaySave = true;
            });
        }
    };

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };


    GetPreferences(); //Get preferences from SPList
    if (typeof (exService.myPreferences) != "undefined" && exService.myPreferences != null && exService.myPreferences != "") {
        //Pre populate controls
        var ctrlsToPopulate = JSON.parse(exService.myPreferences);
        if (ctrlsToPopulate.selections.length > 0) {
            for (var count = 0; count < ctrlsToPopulate.selections.length; count++) {
                switch (JSON.parse(ctrlsToPopulate.selections[count])["chkCtrl"]) {
                    case "chkBIDashboard": //BI Dashboard
                        $scope.chkBIDashboard = true;
                        if (parseInt(JSON.parse(ctrlsToPopulate.selections[count])["ddlCtrlValue"]) > 0) {
                            $scope.ddlBIDashboard = JSON.parse(ctrlsToPopulate.selections[count])["ddlCtrlValue"];
                            $scope.orderNumbers = ["1", "2", "3", "4"];
                        }
                        break;
                    case "chkMyTasks": //My Tasks
                        $scope.chkMyTasks = true;
                        if (parseInt(JSON.parse(ctrlsToPopulate.selections[count])["ddlCtrlValue"]) > 0) {
                            $scope.ddlMyTasks = JSON.parse(ctrlsToPopulate.selections[count])["ddlCtrlValue"];
                            $scope.orderNumbers = ["1", "2", "3", "4"];
                        }
                        break;
                    case "chkMyDocs": //My Documents
                        $scope.chkMyDocs = true;
                        if (parseInt(JSON.parse(ctrlsToPopulate.selections[count])["ddlCtrlValue"]) > 0) {
                            $scope.ddlMyDocs = JSON.parse(ctrlsToPopulate.selections[count])["ddlCtrlValue"];
                            $scope.orderNumbers = ["1", "2", "3", "4"];
                        }
                        break;
                    case "chkGroups": //Groups
                        $scope.chkGroups = true;
                        if (parseInt(JSON.parse(ctrlsToPopulate.selections[count])["ddlCtrlValue"]) > 0) {
                            $scope.ddlGroups = JSON.parse(ctrlsToPopulate.selections[count])["ddlCtrlValue"];
                            $scope.orderNumbers = ["1", "2", "3", "4"];
                        }
                        break;
                }
            }
        }
    }
    else {
        $scope.chkBIDashboard = true;
        $scope.ddlBIDashboard = "1";
        $scope.chkGroups = true;
        $scope.ddlGroups = "2";
        $scope.chkMyDocs = true;
        $scope.ddlMyDocs = "3";
        $scope.chkMyTasks = true;
        $scope.ddlMyTasks = "4";
    }

    
    $scope.ok = function () {
        //Get Selected Checkboxes and associated DDLs and build JSON
        var userFinalSelection = {
            selections: []
        };

        var userSelected = false; //Will become true if user makes any selection. If false, nothing will be updated.

        if (typeof (this.chkBIDashboard) != "undefined" && this.chkBIDashboard != false) {
            var orderBIDashboard = typeof (this.ddlBIDashboard) != "undefined" ? this.ddlBIDashboard : 0;
            var chkBIDSelection = new Selection("chkBIDashboard", "ddlBIDashboard", orderBIDashboard);
            userFinalSelection.selections.push(JSON.stringify(chkBIDSelection));
            userSelected = true;
        }
        if (typeof (this.chkMyTasks) != "undefined" && this.chkMyTasks != false) {
            var orderMyTasks = typeof (this.ddlMyTasks) != "undefined" ? this.ddlMyTasks : 0;
            var chkMyTasksSelection = new Selection("chkMyTasks", "ddlMyTasks", orderMyTasks);
            userFinalSelection.selections.push(JSON.stringify(chkMyTasksSelection));
            userSelected = true;
        }
        if (typeof (this.chkMyDocs) != "undefined" && this.chkMyDocs != false) {
            var orderMyDocs = typeof (this.ddlMyDocs) != "undefined" ? this.ddlMyDocs : 0;
            var chkMyDocsSelection = new Selection("chkMyDocs", "ddlMyDocs", orderMyDocs);
            userFinalSelection.selections.push(JSON.stringify(chkMyDocsSelection));
            userSelected = true;
        }
        if (typeof (this.chkGroups) != "undefined" && this.chkGroups != false) {
            var orderGroups = typeof (this.ddlGroups) != "undefined" ? this.ddlGroups : 0;
            var chkGroupsSelection = new Selection("chkGroups", "ddlGroups", orderGroups);
            userFinalSelection.selections.push(JSON.stringify(chkGroupsSelection));
            userSelected = true;
        }
        
        if (this.chkBIDashboard == false || this.chkMyTasks == false || this.chkMyDocs == false || this.chkGroups == false) {
            userSelected = true;
        }

        if (userSelected) {
            exService.setJSON(userFinalSelection);

            if (exService.getJSON() != null && exService.getJSON() != "") {
                ManagePreferences();
            }
        }
        
        $modalInstance.close();
    };

    //To build JSONs
    function Selection(chkCtrlName, ddlCtrlName, ddlCtrlValue) {
        this.chkCtrl = chkCtrlName;
        this.ddlCtrl = ddlCtrlName;
        this.ddlCtrlValue = ddlCtrlValue;
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //Manage (Add/Update) preferences
    function ManagePreferences() {
        if (exService.myPreferences != null && exService.myPreferences != "") { //If Preferences exists in SPList
            UpdateWPListREST(exService.listItemID);
        }
        else {
            //add new
            AddtoWPListREST();
        }
    }
    //Add to 'Widget Preferences' list
    function AddtoWPListREST() {
        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists(guid'" + CCI_Common.GetConfig("myWorkspace Widget Preferences") + "')/items"
        jQuery.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify({
                '__metadata': { 'type': 'SP.Data.WWPListItem' },  ///_api/web/lists/getbytitle('myWorkspace Widget Preferences')/ListItemEntityTypeFullName
                'UserID': _spPageContextInfo.userLoginName,
                'Preferences': JSON.stringify(exService.getJSON())
            }),
            headers: {
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function (d) {
                exService.myPreferences = exService.getJSON();
            },
            error: function (error) {
                CCI_Common.LogException(_spPageContextInfo.userLoginName, "CCI-myWorkspace_Widgets.js--AddtoWPListREST", _spPageContextInfo.serverRequestPath, JSON.stringify(error));
            }
        });
    }

    //Update 'Widget Preferences' list
    function UpdateWPListREST(itemID) {
        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists(guid'" + CCI_Common.GetConfig("myWorkspace Widget Preferences") + "')/items(" + itemID + ")"
        jQuery.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify({
                '__metadata': { 'type': 'SP.Data.WWPListItem' },  ///_api/web/lists/getbytitle('myWorkspace Widget Preferences')/ListItemEntityTypeFullName
                'UserID': _spPageContextInfo.userLoginName,
                'Preferences': JSON.stringify(exService.getJSON())
            }),
            headers: {
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "IF-MATCH": "*",
                "X-HTTP-Method":"MERGE"
            },
            success: function (data) {
                exService.myPreferences = exService.getJSON();
            },
            error: function (error) {
                CCI_Common.LogException(_spPageContextInfo.userLoginName, "CCI-myWorkspace_Widgets.js--UpdateWPListREST", _spPageContextInfo.serverRequestPath, JSON.stringify(error));
            }
        });
    }

    //Get saved preferences from SPList
    function GetPreferences()
    {
        jQuery.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists(guid'" + CCI_Common.GetConfig("myWorkspace Widget Preferences") + "')/items?$filter=UserID eq '" + _spPageContextInfo.userLoginName + "'",
            type: "GET",
            async: false,
            headers: {
                "accept": "application/json;odata=verbose",
            },
            success: function (data) {
                if (data.d.results.length == 1) {
                    exService.myPreferences = data.d.results[0].Preferences;
                    exService.listItemID = data.d.results[0].ID;
                }
                else {
                    $log.info("Check Preferences list for user - " + _spPageContextInfo.userLoginName);
                }
            },
            error: function (jqxr, errorCode, errorThrown) {
                CCI_Common.LogException(_spPageContextInfo.userLoginName, "CCI-myWorkspace_Widgets.js--GetPreferences", _spPageContextInfo.serverRequestPath, jqxr.responseText);
            }
        });
    }
});

//Groups
appWP.controller('ctrlGroups', function ($scope) {
    var allGroupsCollection = [];
    var currentgrouplength;
    var checkGroupCounter = 0;

    init();

    function init() {
        yam.getLoginStatus(
            function (response) {
                if (response.authResponse) {
                    var myyammerGroups = [];
                    yam.platform.request({
                        url: "groups.json?mine=1",     
                        method: "GET",
                        data: {    
                        },
                        success: function (user) { 
                            for (var k = 0; k < user.length; k++) {
                                var myyammergroup = [];
                                myyammergroup[0] = user[k].full_name;
                                myyammergroup[1] = user[k].web_url;
                                myyammergroup[2] = "Yammer Groups";
                                myyammerGroups[k] = myyammergroup;
                            }

                            currentgrouplength = allGroupsCollection.length;
                            if (myyammerGroups.length > 0) {
                                allGroupsCollection[currentgrouplength] = myyammerGroups;
                            }

                            getCommunityGroups();
                        },
                        error: function (user) {
                        }
                    });
                }
                else {
                    var myerrorYammerGroups = [];
                    var myerrorYammerGroup = [];
                    myerrorYammerGroup[0] = "YammerLoginError";
                    myerrorYammerGroup[1] = "https://www.yammer.com";
                    myerrorYammerGroup[2] = "Yammer Groups";
                    myerrorYammerGroups[0] = myerrorYammerGroup;
                    currentgrouplength = allGroupsCollection.length;

                    if (myerrorYammerGroups.length > 0) {
                        allGroupsCollection[currentgrouplength] = myerrorYammerGroups;
                    }
                    getCommunityGroups();
                }
          }
        );
    }

    function getCommunityGroups() {
        var myCommunityGroups = [];
        var siteUrl;
        var searchSubMenuResultsHtml = "";
        siteUrl = _spPageContextInfo.siteAbsoluteUrl;

        var url = siteUrl + "/_api/search/query?querytext='path:\"" + siteUrl + "\" contentclass:STS_Web  WebTemplate=COMMUNITY' ";

        $.ajax({
            method: 'GET',
            url: url,
            dataType: 'json',
            success: function (data) {
                var results = data.PrimaryQueryResult.RelevantResults.Table.Rows.results
                $.each(data.PrimaryQueryResult.RelevantResults.Table.Rows, function (index, row) {
                    var mygroup = [];
                    mygroup[0] = row.Cells[3].Value;
                    mygroup[1] = row.Cells[6].Value;
                    mygroup[2] = "Community Sites";
                    myCommunityGroups[index] = mygroup;
                });

                currentgrouplength = allGroupsCollection.length;
                if (myCommunityGroups.length > 0) {
                    allGroupsCollection[currentgrouplength] = myCommunityGroups;
                }
                getTeamGroups();
            }
        });
    }

    function getTeamGroups() {
        var myTeamgroups = [];
        var siteUrl;
        var searchSubMenuResultsHtml = "";
        siteUrl = _spPageContextInfo.siteAbsoluteUrl;

        var url = siteUrl + "/_api/search/query?querytext='path:\"" + siteUrl + "\" contentclass:STS_Web  WebTemplate:STS' ";
        $.ajax({
            method: 'GET',
            url: url,
            dataType: 'json',
            success: function (data) {
                $.each(data.PrimaryQueryResult.RelevantResults.Table.Rows, function (index, row) {
                    var mygroup = [];
                    mygroup[0] = row.Cells[3].Value;
                    mygroup[1] = row.Cells[6].Value;
                    mygroup[2] = "Team Sites";
                    myTeamgroups[index] = mygroup;
                });

                currentgrouplength = allGroupsCollection.length;
                if (myTeamgroups.length > 0) {
                    allGroupsCollection[currentgrouplength] = myTeamgroups;
                }
                renderAllgroups(allGroupsCollection);
            }
        });
    }

    function renderAllgroups(mygroups) {
        var iCounter;
        var iCounter1;
        var divClassname;
        var ulID = "ulid";
        var divId;
        var strDiv;
        var topdiv1;
        var groupHeadingName = [];
        var groupTitle;
        var viewMorePagelink;
        var standrardItemCounter = 4;
        var checkYammerLogin = 0;

        if (mygroups.length >= 0) {
            iCounter = mygroups.length;
        }

        if (iCounter == 1) {
            divClassname = 'col-sm-12';
        }

        if (iCounter == 2) {
            divClassname = 'col-sm-6';
        }

        if (iCounter == 3) {
            divClassname = 'col-sm-4';
        }

        divId = divClassname;
        var checkcounter = 0;
        mygroups.reverse();

        for (var k = 0; k < iCounter; k++) {
            var mygroup = mygroups[k];
            var icounter2 = mygroup.length;
            for (var p = 0; p < icounter2; p++) {
                groupHeadingName[k] = mygroup[p][2];
                break;
            }

            if (icounter2 > 0) {
                groupTitle = groupHeadingName[k];

                strDiv = "<div class=" + divClassname + " id=" + divId + "><h2 class=\"dropdown-header\">" + groupTitle + "</h2><ul class=\"check_side_area\" id=" + ulID + ">	</ul></div>";
                topdiv1 = $(".GroupMenu").append(strDiv);

                siteUrl = _spPageContextInfo.siteAbsoluteUrl;
                var delveSiteUrl = siteUrl + "/_layouts/15/me.aspx" + "?v=work&p=" + _spPageContextInfo.userLoginName;

                if (groupTitle.indexOf('Yammer') >= 0) {
                    viewMorePagelink = "https://www.yammer.com";
                }

                if (groupTitle.indexOf('Team') >= 0) {
                    viewMorePagelink = delveSiteUrl;
                }

                if (groupTitle.indexOf('Community') >= 0) {
                    viewMorePagelink = delveSiteUrl;
                }

                if (mygroup.length >= 0) {
                    iCounter1 = mygroup.length;
                }

                for (var j = 0; j < iCounter1; j++) {
                    if (mygroup[j][0].indexOf('YammerLoginError') >= 0) {
                        checkYammerLogin = 1;
                        resultsHtml = "<li> Please login to <a href='" + mygroup[j][1] + "' target=_blank >Yammer</a></li>";
                    }
                    else {
                        checkYammerLogin = 0;
                        resultsHtml = "<li> <a href='" + mygroup[j][1] + "' target=_blank> " + mygroup[j][0] + "</a></li>";
                    }

                    $("#" + ulID).append(resultsHtml);
                    if (j >= standrardItemCounter) {
                        break;
                    }
                }

                if (iCounter1 > 0) {
                    if (checkYammerLogin == 0) {
                        resultsHtml = "<li> <a href='" + viewMorePagelink + "' target=_blank > " + "View All" + "</a></li>";
                        $("#" + ulID).append(resultsHtml);
                    }
                }

                ulID = ulID + k;
                divId = divClassname + k;
                checkcounter = k + 1;
            }
        }
    }
});

//BI Dashboard
appWP.controller('ctrlBIDashboard', function ($scope) {

    $scope.ImagePath = CCI_Common.GetConfig('myWorkspace BIDashBoard');

    function GetListItems() { 
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists(guid'" + CCI_Common.GetConfig("BIDashboard List") + "')/Items?";
        requestUri += "$select=Title,CCI_x002d_URL";
        //requestUri += "&$filter=DisplayInApp eq 1";

        jQuery.ajax({
            url: requestUri,
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
            },
            success: function (data) {
                //$scope.BIData = data.d.results;
                $scope.$apply(function () {
                    $scope.BIData = data.d.results;
                });
            },
            error: function (jqxr, errorCode, errorThrown) {
                CCI_Common.LogException(_spPageContextInfo.userLoginName, "CCI-myWorkspace_Widgets.js--GetListItems", _spPageContextInfo.serverRequestPath, jqxr.responseText);
            }
        });
    }

    init();

    function init() {
        GetListItems();
    }
});

//My Tasks
appWP.controller('ctrlMyTasks', function ($scope) {
    $scope.AppTitle = "My Tasks";
    $scope.displayMyTasks = true;

    function GetMyTasks(myTasksUri) {
        var MyTasks = {
            Tasks: []
        };

        jQuery.ajax({
            url: encodeURI(myTasksUri),
            type: "GET",
            crossDomain: true,
            headers: {
                "accept": "application/json;odata=verbose",
            },
            success: function (data) {
                if (data.d.query.PrimaryQueryResult != null) {
                    var results = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                    if (results.length > 0) {
                        var title = "";
                        var path = "";
                        var assignedTo = "";
                        var dueDate = "";
                        for (var i = 0; i < results.length; i++) {
                            for (var keys = 0; keys < results[i].Cells.results.length; keys++) {
                                if (results[i].Cells.results[keys]["Key"] != null && typeof (results[i].Cells.results[keys]["Key"] != "undefined")) {

                                    switch (results[i].Cells.results[keys]["Key"]) {
                                        case "Title":
                                            title = results[i].Cells.results[keys]["Value"];
                                            break;
                                        case "Path":
                                            if (results[i].Cells.results[keys]["Value"].indexOf("DispForm") > 0) {
                                                path = results[i].Cells.results[keys]["Value"].replace("DispForm","EditForm");
                                            }
                                            else {
                                                path = results[i].Cells.results[keys]["Value"];
                                            }
                                            break;
                                        case "AssignedTo":
                                            assignedTo = results[i].Cells.results[keys]["Value"].split(' (')[0]; //Actual value - "Tiyyaguru, Srikanth (CCI-Atlanta-CON)"
                                            break;
                                        case "DueDateOWSDATE":
                                            dueDate = results[i].Cells.results[keys]["Value"];
                                            break;
                                    }
                                }
                            }
                            //Build JSON
                            var myTask = new TasksDetails(title, dueDate, assignedTo, path);
                            MyTasks.Tasks.push(myTask);
                        }
                    }
                }
                //Update Scope variable
                if (MyTasks.Tasks.length > 0) {
                    $scope.$apply(function () {
                        $scope.MyTasks = JSON.parse(JSON.stringify(MyTasks)).Tasks;
                        $scope.displayMyTasks = true;
                    });
                }
                else {
                    $scope.$apply(function () {
                        $scope.displayMyTasks = false;
                    });
                }
            },
            error: function (error) {
                $scope.displayMyTasks = false;
                CCI_Common.LogException(_spPageContextInfo.userLoginName, "CCI-myWorkspace_Widgets.js--GetMyTasks", _spPageContextInfo.serverRequestPath, JSON.stringify(error));
            }
        });
    }

    init();

    function init() {
        
        var myTasksUri = _spPageContextInfo.siteAbsoluteUrl + "/_api/search/query?querytext='";
        myTasksUri += "ContentTypeId:0x0108*"; //'Task' content type
        myTasksUri += " Path:\"" + _spPageContextInfo.siteAbsoluteUrl + "\"";

        $.getJSON(_spPageContextInfo.webServerRelativeUrl + "/_api/web/currentuser")            .done(function (data) {
                if (data != null && data.Title != null && typeof (data.Title) != "undefined") {
                    myTasksUri += " AssignedTo:\"" + data.Title + "\"";
                    myTasksUri += "'";
                    myTasksUri += "&selectproperties='Title,Path,AssignedTo,DueDateOWSDATE'";
                    //myTasksUri += "&sortlist='DueDateOWSDATE:ascending'";
                    //myTasksUri += "&rowlimit=10";

                    GetMyTasks(myTasksUri);
                }
            })            .fail(function () {
                console.log("Failed to get the User Name");
                myTasksUri += "'";
                myTasksUri += "&selectproperties='Title,Path,AssignedTo,DueDateOWSDATE'";
                //myTasksUri += "&sortlist='DueDateOWSDATE:ascending'";
                //myTasksUri += "&rowlimit=10";

                GetMyTasks(myTasksUri);
            });
/*
        GetMyTasks();
        var content = "{ \"Table\": [ { \"EMPLID\": \"00607432\", \"EMPL_RCD\": 0.0, \"VC_PLAN_ID\": \"CCIICPLAN\", \"VC_PAYOUT_PRD_ID\": \"2016\", \"GB_GROUP_ID\": \"ICCORPMKTGSAL\", \"VC_GOAL_ID\": \"MBO\", \"PRD_BGN_DT\": \"2016-01-01T00:00:00\", \"PRD_END_DT\": \"2016-12-31T00:00:00\", \"NAME\": \"Test User1\", \"AS_OF_DATE\": \"2016-07-17T00:00:00\", \"VC_AWARD_VALUE\": 17983.20, \"JOBCODE\": \"SA0361\", \"JOBCODE_DESCR\": \"Sr Mgr,3rd Party Retail - Corp\", \"CC_TARGET_PCT\": 15.0, \"ANNUAL_RT\": 119888.0, \"DESCR\": \"CORP - MARKETING/SALES\", \"VC_PERF_FACTOR\": 1.0, \"DESCR50\": \"MBO\", \"DESCR100\": \"Function Specific MBO\", \"VC_PCT_ATTAINED\": 100.0, \"VC_WEIGHT_PERCENT\": 10.0, \"CC_WEIGHTED_RESULT\": 10.0, \"PRORATE_FACTOR\": 1.0, \"VC_CALC_AWARD\": 17983.20, \"CC_VC_CURRENT\": \"Y\", \"CC_VC_PRIOR\": \"N\", \"CC_VC_RESULTS\": \"N\" }, { \"EMPLID\": \"00607432\", \"EMPL_RCD\": 0.0, \"VC_PLAN_ID\": \"CCIICPLAN\", \"VC_PAYOUT_PRD_ID\": \"2016\", \"GB_GROUP_ID\": \"ICCORPMKTGSAL\", \"VC_GOAL_ID\": \"FCF\", \"PRD_BGN_DT\": \"2016-01-01T00:00:00\", \"PRD_END_DT\": \"2016-12-31T00:00:00\", \"NAME\": \"Test User1\", \"AS_OF_DATE\": \"2016-07-17T00:00:00\", \"VC_AWARD_VALUE\": 17983.20, \"JOBCODE\": \"SA0361\", \"JOBCODE_DESCR\": \"Sr Mgr,3rd Party Retail - Corp\", \"CC_TARGET_PCT\": 15.0, \"ANNUAL_RT\": 119888.0, \"DESCR\": \"CORP - MARKETING/SALES\", \"VC_PERF_FACTOR\": 1.0, \"DESCR50\": \"CCI Consolidated Free Cash Flow (FCF)\", \"DESCR100\": \"Total Company: OCF + LTIP Exp - CapEx - LTIP Paymts +/- Chg in Work Captl - Cash Int - Cash Taxes\", \"VC_PCT_ATTAINED\": 100.0, \"VC_WEIGHT_PERCENT\": 30.0, \"CC_WEIGHTED_RESULT\": 30.0, \"PRORATE_FACTOR\": 1.0, \"VC_CALC_AWARD\": 17983.20, \"CC_VC_CURRENT\": \"Y\", \"CC_VC_PRIOR\": \"N\", \"CC_VC_RESULTS\": \"N\" }, { \"EMPLID\": \"00607432\", \"EMPL_RCD\": 0.0, \"VC_PLAN_ID\": \"CCIICPLAN\", \"VC_PAYOUT_PRD_ID\": \"2016\", \"GB_GROUP_ID\": \"ICCORPMKTGSAL\", \"VC_GOAL_ID\": \"CONS OCF\", \"PRD_BGN_DT\": \"2016-01-01T00:00:00\", \"PRD_END_DT\": \"2016-12-31T00:00:00\", \"NAME\": \"Test User1\", \"AS_OF_DATE\": \"2016-07-17T00:00:00\", \"VC_AWARD_VALUE\": 17983.20, \"JOBCODE\": \"SA0361\", \"JOBCODE_DESCR\": \"Sr Mgr,3rd Party Retail - Corp\", \"CC_TARGET_PCT\": 15.0, \"ANNUAL_RT\": 119888.0, \"DESCR\": \"CORP - MARKETING/SALES\", \"VC_PERF_FACTOR\": 1.0, \"DESCR50\": \"CCI Consolidated Operating Cash Flow (OCF)\", \"DESCR100\": \"CCI Consolidated Annual Operating Cash Flow (OCF)\", \"VC_PCT_ATTAINED\": 100.0, \"VC_WEIGHT_PERCENT\": 20.0, \"CC_WEIGHTED_RESULT\": 20.0, \"PRORATE_FACTOR\": 1.0, \"VC_CALC_AWARD\": 17983.20, \"CC_VC_CURRENT\": \"Y\", \"CC_VC_PRIOR\": \"N\", \"CC_VC_RESULTS\": \"N\" }, { \"EMPLID\": \"00607432\", \"EMPL_RCD\": 0.0, \"VC_PLAN_ID\": \"CCIICPLAN\", \"VC_PAYOUT_PRD_ID\": \"2016\", \"GB_GROUP_ID\": \"ICCORPMKTGSAL\", \"VC_GOAL_ID\": \"RESCON PSU\", \"PRD_BGN_DT\": \"2016-01-01T00:00:00\", \"PRD_END_DT\": \"2016-12-31T00:00:00\", \"NAME\": \"Test User1\", \"AS_OF_DATE\": \"2016-07-17T00:00:00\", \"VC_AWARD_VALUE\": 17983.20, \"JOBCODE\": \"SA0361\", \"JOBCODE_DESCR\": \"Sr Mgr,3rd Party Retail - Corp\", \"CC_TARGET_PCT\": 15.0, \"ANNUAL_RT\": 119888.0, \"DESCR\": \"CORP - MARKETING/SALES\", \"VC_PERF_FACTOR\": 1.0, \"DESCR50\": \"Cox Residential Consolidated PSUs\", \"DESCR100\": \"Cox Residential Consolidated Annual PSU\", \"VC_PCT_ATTAINED\": 100.0, \"VC_WEIGHT_PERCENT\": 20.0, \"CC_WEIGHTED_RESULT\": 20.0, \"PRORATE_FACTOR\": 1.0, \"VC_CALC_AWARD\": 17983.20, \"CC_VC_CURRENT\": \"Y\", \"CC_VC_PRIOR\": \"N\", \"CC_VC_RESULTS\": \"N\" }, { \"EMPLID\": \"00607432\", \"EMPL_RCD\": 0.0, \"VC_PLAN_ID\": \"CCIICPLAN\", \"VC_PAYOUT_PRD_ID\": \"2016\", \"GB_GROUP_ID\": \"ICCORPMKTGSAL\", \"VC_GOAL_ID\": \"RESCON REV\", \"PRD_BGN_DT\": \"2016-01-01T00:00:00\", \"PRD_END_DT\": \"2016-12-31T00:00:00\", \"NAME\": \"Test User1\", \"AS_OF_DATE\": \"2016-07-17T00:00:00\", \"VC_AWARD_VALUE\": 17983.20, \"JOBCODE\": \"SA0361\", \"JOBCODE_DESCR\": \"Sr Mgr,3rd Party Retail - Corp\", \"CC_TARGET_PCT\": 15.0, \"ANNUAL_RT\": 119888.0, \"DESCR\": \"CORP - MARKETING/SALES\", \"VC_PERF_FACTOR\": 1.0, \"DESCR50\": \"Cox Residential Consolidated Revenue\", \"DESCR100\": \"Cox Residential Consolidated Annual Revenue\", \"VC_PCT_ATTAINED\": 100.0, \"VC_WEIGHT_PERCENT\": 20.0, \"CC_WEIGHTED_RESULT\": 20.0, \"PRORATE_FACTOR\": 1.0, \"VC_CALC_AWARD\": 17983.20, \"CC_VC_CURRENT\": \"Y\", \"CC_VC_PRIOR\": \"N\", \"CC_VC_RESULTS\": \"N\" } ] }";
        $scope.MyTasks = JSON.parse(content).Table;*/
    }

    //To build JSON
    function TasksDetails(taskTitle, taskDueDate, taskAssignedTo, taskPath) {
        this.TaskTitle = taskTitle;
        this.TaskDueDate = taskDueDate;
        this.TaskAssignedTo = taskAssignedTo;
        this.TaskPath = taskPath;
    }
});

//My Documents
appWP.controller('ctrlMyWSDocuments', function ($scope) {
    $scope.AppTitle = "My Online Documents";
    $scope.displayTable = true;
    var currentUserName;

    function GetMyDocuments(docsQuery) {
        var MyDocuments = {
            Documents: []
        };

        //var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/folders('" + CCI_Common.GetConfig("Workspace Documents") + "')/Files";
        /*
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/search/query?querytext='";
        requestUri += "Path:\"" + _spPageContextInfo.webAbsoluteUrl + "/" + CCI_Common.GetConfig("Workspace Documents") + "\" IsDocument:true";
        requestUri += "'";
        requestUri += "&selectproperties='Title,Path,LastModifiedTime,ModifiedBy,FileType'";
        requestUri += "&sortlist='LastModifiedTime:descending'";
        requestUri += "&rowlimit=10";*/

        jQuery.ajax({
            //url: encodeURI(docsQuery),
            url: docsQuery,
            method: "GET",
            async: false,
            headers: {
                "accept": "application/json;odata=verbose",
            },
            success: function (data) {
                if (data.d.query.PrimaryQueryResult != null) {
                    var results = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                    if (results.length > 0) {
                        var title = "";
                        var fileType = "";
                        var path = "";
                        var lastModifiedTime = "";
                        var modifiedBy = "";
                        for (var i = 0; i < results.length; i++) {
                            for (var keys = 0; keys < results[i].Cells.results.length; keys++) {
                                if (results[i].Cells.results[keys]["Key"] != null && typeof (results[i].Cells.results[keys]["Key"] != "undefined")) {

                                    switch (results[i].Cells.results[keys]["Key"]) {
                                        case "Title":
                                            title = results[i].Cells.results[keys]["Value"];
                                            break;
                                        case "FileType":
                                            if (results[i].Cells.results[keys]["Value"] == "pdf") {
                                                fileType = _spPageContextInfo.siteAbsoluteUrl + "/_layouts/15/images/icpdf.png";
                                            }
                                            else if (results[i].Cells.results[keys]["Value"] == "docx" || results[i].Cells.results[keys]["Value"] == "doc") {
                                                fileType = _spPageContextInfo.siteAbsoluteUrl + "/_layouts/15/images/icdocx.png";
                                            }
                                            else if (results[i].Cells.results[keys]["Value"] == "pptx" || results[i].Cells.results[keys]["Value"] == "ppt") {
                                                fileType = _spPageContextInfo.siteAbsoluteUrl + "/_layouts/15/images/icpptx.png";
                                            }
                                            else if (results[i].Cells.results[keys]["Value"] == "xlsx" || results[i].Cells.results[keys]["Value"] == "xls") {
                                                fileType = _spPageContextInfo.siteAbsoluteUrl + "/_layouts/15/images/icxlsx.png";
                                            }
                                            else {
                                                fileType = _spPageContextInfo.siteAbsoluteUrl + "/Style%20Library/coxone/images/star_img.jpg";
                                            }
                                            break;
                                        case "Path":
                                            path = results[i].Cells.results[keys]["Value"];
                                            break;
                                        case "LastModifiedTime":
                                            lastModifiedTime = results[i].Cells.results[keys]["Value"];
                                            break;
                                       case "EditorOWSUSER":
                                            modifiedBy = results[i].Cells.results[keys]["Value"].split("|")[1].split(" (")[0]; //SAMPLE VALE: "Srikanth.Tiyyaguru@cox.com | Tiyyaguru, Srikanth (CCI-Atlanta-CON) | 693A30232E667C6D656D626572736869707C737469797961677540636F78636F6D6D696E632E6F6E6D6963726F736F66742E636F6D i:0#.f|membership|stiyyagu@coxcomminc.onmicrosoft.com"
                                            break; //Comment for Delve 
                                    }
                                }
                            }
                            //Build JSON
                            var myDocument = new DocumentDetails(title, lastModifiedTime, modifiedBy, fileType, path); //Without Delve
                            //var myDocument = new DocumentDetails(title, lastModifiedTime, currentUserName, fileType, path); //For Delve
                            MyDocuments.Documents.push(myDocument);
                        }
                    }
                }
                //Update Scope variable
                if (MyDocuments.Documents.length > 0) {
                    $scope.$apply(function () {
                        $scope.MyDocuments = JSON.parse(JSON.stringify(MyDocuments)).Documents;
                    });
                }
                else {
                    $scope.$apply(function () {
                        $scope.AppTitle = CCI_Common.GetConfig("Empty MyDocments Message");
                        $scope.displayTable = false;
                    });
                }
            },
            error: function (error) {
                CCI_Common.LogException(_spPageContextInfo.userLoginName, "CCI-myWorkspace_Widgets.js--GetMyDocuments", _spPageContextInfo.serverRequestPath, JSON.stringify(error));
            }
        });
    }

    function GetCurrentUserDocID() {
        var deferred = $.Deferred();

        jQuery.ajax({
            url: _spPageContextInfo.siteAbsoluteUrl + "/_api/search/query?querytext=%27UserName:" + _spPageContextInfo.userLoginName.replace("@", "%40") + "%27&selectproperties=%27DocId%2cAccountName%27&sourceid=%27b09a7990-05ea-4af9-81ef-edfab16c4e31%27",
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
            },
            success: function (data) {
                if (data.d.query.PrimaryQueryResult != null) {
                    var results = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                    if (results.length == 1) {
                        for (var keys = 0; keys < results[0].Cells.results.length; keys++) {
                            if (results[0].Cells.results[keys]["Key"] != null && typeof (results[0].Cells.results[keys]["Key"] != "undefined")) {
                                if (results[0].Cells.results[keys]["Key"] == "DocId") {
                                    deferred.resolve(results[0].Cells.results[keys]["Value"]);
                                }
                            }
                        }
                    }
                    else {
                        deferred.resolve("ME");
                    }
                }
                else {
                    deferred.resolve("ME");
                }
            },
            error: function (jqxr, errorCode, errorThrown) {
                CCI_Common.LogException(_spPageContextInfo.userLoginName, "CCI-myWorkspace_Widgets.js--GetListItems", _spPageContextInfo.serverRequestPath, jqxr.responseText);
                deferred.reject("ME");
            }
        });
        return deferred.promise();
    }

    init();

    function init() {
/*
        var requestUri = _spPageContextInfo.siteAbsoluteUrl + "/_api/search/query?querytext='";
        requestUri += "(FileExtension:doc OR FileExtension:docx OR FileExtension:xls OR FileExtension:xlsx OR FileExtension:ppt OR FileExtension:pptx OR FileExtension:pdf)";
        requestUri += " Path:\"" + _spPageContextInfo.siteAbsoluteUrl + "\"";
        

        $.getJSON(_spPageContextInfo.webServerRelativeUrl + "/_api/web/currentuser")            .done(function (data) {
                if (data != null && data.Title != null && typeof (data.Title) != "undefined") {
                    currentUserName = data.Title;
                    requestUri += " ModifiedBy:\"" + data.Title + "\"";
                    requestUri += "'";
                    requestUri += "&selectproperties='Title,Path,LastModifiedTime,EditorOWSUSER,FileType'";
                    requestUri += "&sortlist='LastModifiedTime:descending'";
                    requestUri += "&rowlimit=10";

                    GetMyDocuments(requestUri);
                }
            })            .fail(function () {
                console.log("MyWorkspace Documents - Failed to get the User Name");
                currentUserName = "";
                requestUri += "'";
                requestUri += "&selectproperties='Title,Path,LastModifiedTime,ModifiedBy,FileType'";
                requestUri += "&sortlist='LastModifiedTime:descending'";
                requestUri += "&rowlimit=10";

                GetMyDocuments(requestUri);
            });
            */

        
        //From Delve
        GetCurrentUserDocID().then(function (docID) {
            if (docID != null && typeof docID != "undefined") {
                var requestUri = _spPageContextInfo.siteAbsoluteUrl + "/_api/search/query?querytext=";
                //requestUri += "%27* AND (FileExtension:doc OR FileExtension:docx OR FileExtension:xls OR FileExtension:xlsx OR FileExtension:ppt OR FileExtension:pptx OR FileExtension:pdf)%27";
                requestUri += "%27*%27";
                requestUri += "&amp;clienttype=%27ContentSearchRegular%27";
                requestUri += "&amp;selectproperties=%27Title,Path,LastModifiedTime,FileType,EditorOWSUSER%27";
                requestUri += "&Properties=%27GraphQuery:ACTOR(" + docID + "\\,%20action\\:1003)%27";
                GetMyDocuments(requestUri);
            }
        });

        /*
        $.getJSON(_spPageContextInfo.webServerRelativeUrl + "/_api/web/currentuser")            .done(function (data) {
                if (data != null && data.Email != null && typeof (data.Email) != "undefined") {
                    currentUserEmail = data.Email;
                    //https://coxcomminc.sharepoint.com/sites/coxonelab2/_api/search/query?querytext=%27*%20AND%20(FileExtension:doc%20OR%20FileExtension:docx%20OR%20FileExtension:xls%20OR%20FileExtension:xlsx%20OR%20FileExtension:ppt%20OR%20FileExtension:pptx%20OR%20FileExtension:pdf)%27&selectproperties=%27Path%27&clienttype=%27ContentSearchRegular%27&properties=%27GraphQuery:ACTOR(137876856\,%20action\:1003)%27
                    var requestUri = _spPageContextInfo.siteAbsoluteUrl + "/_api/search/query?querytext=";
                    requestUri += "%27* AND (FileExtension:doc OR FileExtension:docx OR FileExtension:xls OR FileExtension:xlsx OR FileExtension:ppt OR FileExtension:pptx OR FileExtension:pdf)%27";
                    requestUri += "&amp;clienttype=%27ContentSearchRegular%27";
                    requestUri += "&amp;selectproperties=%27Title,Path,LastModifiedTime,FileType,EditorOWSUSER%27";
                    requestUri += "&amp;Properties=%27GraphQuery:ACTOR(ME\,%20action\:1003)%27";
                    //requestUri += "&amp;Properties=%27GraphQuery:ACTOR(ME\, action\:1003)%27";
                    //var requestUri = _spPageContextInfo.siteAbsoluteUrl + "/_api/search/query?QueryText=%27*%27&amp;Properties=%27GraphQuery:ACTOR(ME\,%20action\:1003)%27";
                    GetMyDocuments(requestUri);
                }
            })            .fail(function () {
                console.log("MyWorkspace Documents - Failed to get the User Name");
            });*/
    }

    //To build JSON
    function DocumentDetails(fileTitle, fileModified, fileModifiedBy, fileType, filePath) {
        this.FileTitle = fileTitle;
        this.FileModified = fileModified;
        this.FileModifiedBy = fileModifiedBy;
        this.FileType = fileType;
        this.FilePath = filePath;
    }
});
