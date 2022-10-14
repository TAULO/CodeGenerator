// This JavaScript file contains the script functions for the main-survey index.html file.

// Names for variables stored in the json. Might remove if article tags end up working.
var DATA_ROOT = "apps";
var APP_NAME = "appName";
var APP_ICON = "appIcon";
var APP_TIMESTAMP = "appInstallTimestamp";
var APP_HOMEPAGE = "appHomepage";
var APP_PERMISSIONS = "appPermissions";
var APP_PERMISSION_TITLE = "appPermissionTitle";
var APP_PERMISSION_DETAIL = "appPermissionDetail";
var APP_PERMISSION_ICON = "appPermissionIcon";
var mainSurveyStorageName = "main-survey-state-storage";

var SSOTPKeys = [
    "SSOHowSecure", "SSOHowDataUsed", "SSOWhetherDelete",
    "SSOWhetherTellChange", "SSOWhoElse",
    "SSOHowOftenReview",
    "TPHowSecure", "TPHowDataUsed", "TPWhetherDelete",
    "TPWhetherTellChange", "TPWhoElse", "TPWhatPartAccess",
    "TPHowOftenReview"
];

var AppKeys = [
    "appRecall", "appLastUse", "appAwarePrior"
];

var MiscKeys = [
    "BetterUnderstandLink", "BetterUnderstandAccess",
    "ChangeSettings", "SixMonthReview", "OftenRemind",
    "OftenReapprove", "SeekApproval", "BlockSpecificData",
    "ChangeSettingsWhich", "SixMonthLookFor", "AddFeatures",
    "isSignedIn", "SSOEmailAddress",
    "NumSSOApps", "NumTPApps",
    "WhichIsSport", "WhichIsCold"
];

var SSOKeyEnd = 5; // SSOHowOftenReview is not nested
var TPKeyEnd = 12; // TPHowOftenReview is not nested

// The completionCode for the main-survey
const completionCode = "123ABCD";

// The current browser extension version number.
const currentBrowserExtensionVersionNumber = '0.3';

// Name of the locale storage to store the survey progress
const localStorageName = "api-priv-main-survey";
const localStorageExtDataName = "api-priv-main-survey-data";

const surveyPartialSendStartIndex = 6;

// A toggle boolean that records google login.
let isGoogleLoginConfirmed = false;

// A toggle boolean that records my account page launch.
let isMyAccountPageLaunched = false;

// Record id of logged in user
let authuserID = 0;

// Partial results array
let pageResultSentToServer = [];

let SSOGlobal = {};
let TPGlobal = {};
let oldestAppGlobal = {};
let newestAppGlobal = {};
let randomAppGlobal = {};

// Function that will be called to render the Google sign-in button.
function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

// Function to be called to modify the Google Sign In page.
function googleSignInComplete(googleUser) {

    let userEmail = googleUser.getBasicProfile().getEmail();
    authuserID = googleUser.getAuthResponse().session_state.extraQueryParams.authuser;

    // Add the user email address to the signed in button.
    document.getElementById('signedInAs').innerHTML =
        '<span class="gmailSignedInText">as <u>' +
        userEmail + '</u></span>' +
        '<img class="gmailImage" src="' + googleUser.getBasicProfile().getImageUrl() + '" alt=""/>';

    // Change the please click sign in paragraph.
    document.getElementById("pleaseClickSignInParagraph").innerText =
        'You are currently signed in to a Google account. If this is not your primary Google account, logout of the account and change into your primary Google account now.';

    isSignedIn = true;
    survey.setValue('isSignedIn', 'true');

    survey.setValue('SSOEmailAddress', userEmail);

    // Setup the sign-in state change listener.
    gapi.load('auth2', function() {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        let auth2 = gapi.auth2.init({
            client_id: '353069496362-4a8fuq2fs5crocmm1eaqqnm0bgn9m4mq.apps.googleusercontent.com'
        });

        // Listen for sign-in state changes.
        auth2.isSignedIn.listen(afterSignIn);
    });
}

// Function that will be called when the launch my account button is pressed.
function launchMyAccountPageInNewTab() {
    // Get the session id from the cookie.
    let sessionId = getCookieValueByName(sessionIdCookieName);

    document.getElementById("launchMyAccountPageButton").disabled = true;
    document.getElementById("launchMyAccountPageButton").className = "btn btn-secondary";

    // Send the message to launch the my account page to the background script of the browser extension.
    let message = { type: "LAUNCH_MY_ACCOUNT_PAGE", sessionId: sessionId, authuserID: authuserID };
    let event = new CustomEvent("LAUNCH_MY_ACCOUNT_PAGE", { detail: message });
    window.dispatchEvent(event);

    // Toggle the My Account launched boolean.
    isMyAccountPageLaunched = true;
}

// Function that will return true of browser extension is installed.
function isExtensionInstalled() {
    // Get the article tag data set.
    let article = document.querySelector('#surveyArticle');
    let data = article.dataset;
    return data.browserExtensionVersion === currentBrowserExtensionVersionNumber;
}


// Function that is called if withdraw button is pressed
function uninstallExtension() {
    // Remove the browser extension version attribute.
    document.getElementById('surveyArticle').removeAttribute('data-browser-extension-version');

    // Send the message to uninstall the browser extension to the background script of the browser extension.
    let message = { type: "COMMAND_UNINSTALL_EXTENSION" };
    let event = new CustomEvent("COMMAND_UNINSTALL_EXTENSION", { detail: message });
    window.dispatchEvent(event);

    $('#uninstallBrowserExtensionDiv').hide();
    $('#browserExtensionRemovedDiv').addClass('d-block').removeClass('d-none');

    signOut();

    startCountDownForRedirect();
}

// Function that is called if withdraw button is pressed
function uninstallExtensionNoCountdown() {
    if (isExtensionInstalled()) {
        // Remove the browser extension version attribute.
        document.getElementById('surveyArticle').removeAttribute('data-browser-extension-version');

        // Send the message to uninstall the browser extension to the background script of the browser extension.
        let message = { type: "COMMAND_UNINSTALL_EXTENSION" };
        let event = new CustomEvent("COMMAND_UNINSTALL_EXTENSION", { detail: message });
        window.dispatchEvent(event);

        $('#uninstallBrowserExtensionDiv').hide();
        $('#browserExtensionRemovedDiv').addClass('d-block').removeClass('d-none');

        signOut();
    }
}

// A toggle boolean that records google login.
let isSignedIn = false;

/**
 * Converts a given string into a camel case representation. The function uses dashes, underscores, periods, colons,
 * spaces, or combinations hereof as word boundaries. The first word is converted in to lower cases and all other words
 * are converted into title cases.
 *
 * @param str the string to convert.
 * @returns a new string in camel cases
 */
function camelCase(str) {
    return str.replace(/(^[-_.: ]*|[-_.: ]+)(.)?/g, (match, sep, letter, index) => {
        return letter !== undefined ? index === 0 ? letter.toLowerCase() : letter.toUpperCase() : '';
    });
}

/**
 * Converts a given string into a kebab case (Lisp case) representation. The function uses dashes, underscores, periods,
 * colons, spaces, upper case letter, or combinations hereof as word boundaries. In the resulting string all words are
 * separated by one single dash.
 *
 * @param str the string to convert.
 * @returns a new string in kebab cases
 */
function kebabCase(str) {
    return str.replace(/(\w)([-_.: ]*(?=[A-Z])|[-_.: ]+(?=\w))/g, '$1-').toLowerCase();
}

// Function to prepare survey result JSON
function prepareSurveyResults(survey) {
    resultsJSON = survey.data;

    let returnJSON = {};

    // Add a timestamp and prolific ID to the results.
    returnJSON.timestamp = getCurrentDateTime();
    returnJSON.prolificID = $("#submitted-prolific-pid").val();
    returnJSON.studyId = studyId;

    returnJSON["informedConsent"] = resultsJSON["informedConsent"];

    // Parsing nested answers under SSOConsiderations
    if (resultsJSON["SSOConsiderations"] !== undefined) {
        let SSOConsiderations = resultsJSON["SSOConsiderations"];
        for (let i = 0; i < SSOKeyEnd; i++) {
            let currentKey = SSOTPKeys[i];
            returnJSON[currentKey] = SSOConsiderations[currentKey];
        }
        returnJSON[SSOTPKeys[SSOKeyEnd]] = resultsJSON[SSOTPKeys[SSOKeyEnd]];
    }

    // Parsing nested answers under TPConsiderations
    if (resultsJSON["TPConsiderations"] !== undefined) {
        let TPConsiderations = resultsJSON["TPConsiderations"];
        for (let i = SSOKeyEnd + 1; i < TPKeyEnd; i++) {
            let currentKey = SSOTPKeys[i];
            returnJSON[currentKey] = TPConsiderations[currentKey];
        }
        returnJSON[SSOTPKeys[TPKeyEnd]] = resultsJSON[SSOTPKeys[TPKeyEnd]];
    }

    // Parsing Apps Authorized Matrix
    let AppsAuthMat = resultsJSON["AppsAuthorizedMatrix"];
    let AppsAuthMatRet = [];
    for (let key in AppsAuthMat) {
        let removeComment = resultsJSON[`Remove${key}Comment`];
        let retObj = { "appName": key, "keep": AppsAuthMat[key], "reason": removeComment };
        AppsAuthMatRet.push(retObj);
    }

    if (AppsAuthMatRet.length > 0) {
        returnJSON["AppsAuthMat"] = AppsAuthMatRet;
    }

    // Parsing OldestApp data
    if (survey.currentPageNo > survey.getPageByName("OldestAppPage4").visibleIndex && (oldestAppGlobal !== null && Object.keys(oldestAppGlobal).length !== 0)) {
        returnJSON["oldestApp"] = appResultParser(resultsJSON, "Oldest");
    }
    if (survey.currentPageNo > survey.getPageByName("NewestAppPage4").visibleIndex && (newestAppGlobal !== null && Object.keys(newestAppGlobal).length !== 0)) {
        returnJSON["newestApp"] = appResultParser(resultsJSON, "Newest");
    }
    if (survey.currentPageNo > survey.getPageByName("RandomAppPage4").visibleIndex && (randomAppGlobal !== null && Object.keys(randomAppGlobal).length !== 0)) {
        returnJSON["randomApp"] = appResultParser(resultsJSON, "Random");
    }

    for (let i = 0; i < MiscKeys.length; i++) {
        let key = MiscKeys[i];
        if (resultsJSON[key] !== undefined) {
            returnJSON[key] = resultsJSON[key];
        }
    }

    // Add the uuid to the results.
    returnJSON.uuid = getCookieValueByName(uuidCookieName);

    returnJSON["extentionData"] = {
        "ssodata": SSOGlobal,
        "tpdata": TPGlobal
    };

    return returnJSON;
}

function appResultParser(resultsJSON, whichApp) {
    let returnJSON = {};

    returnJSON[APP_NAME] = resultsJSON[`${whichApp}appName`];
    for (let i = 0; i < AppKeys.length; i++) {
        let appKey = `${whichApp}${AppKeys[i]}`;
        returnJSON[AppKeys[i]] = resultsJSON[appKey];
    }

    let appAgreeMat = resultsJSON[`${whichApp}appAgreeMat`];
    for (let key in appAgreeMat) {
        returnJSON[key] = appAgreeMat[key];
    }

    let appPermUnde = resultsJSON[`${whichApp}appPermUnderstand`];
    let appPermNece = resultsJSON[`${whichApp}appPermNece`];
    let appPermConc = resultsJSON[`${whichApp}appPermConc`];
    if (appPermConc !== undefined) {
        let appPermNeceConc = [];
        for (let key in appPermNece) {
            let retObj = {
                "permission": key,
                "understand": appPermUnde[key],
                "necessary": appPermNece[key],
                "concern": appPermConc[key]
            }
            appPermNeceConc.push(retObj);
        }
        returnJSON["appPermNeceConc"] = appPermNeceConc;
    }
    returnJSON["appDescribeConcern"] = resultsJSON[`${whichApp}appDescribeConcern`];

    return returnJSON;
}

// Function to send partial survey results to the server
function sendPartialSurveyResultsToTheServer(survey) {
    // Get the session id from the cookie.
    let sessionId = getCookieValueByName(sessionIdCookieName);

    // Prepare the survey results JSON.
    let partialResultsJSON = prepareSurveyResults(survey);
    partialResultsJSON.mainsurvey_complete = false;

    // POST the survey results to the server for processing.
    $.ajax({
        type: "POST",
        url: "http://localhost:8000/api/mainsurvey/",
        data: JSON.stringify(partialResultsJSON, null, 3),
        dataType: "json",
        success: function(data, jqXHR) {
            // Success handler
            console.log(data);
        },
        error: function(data, jqXHR) {
            // Error handler
            logErrorMessage(data + "  " + jqXHR);
        }
    });
}

// Function to send survey results to the server
function sendSurveyResultsToTheServer(survey) {
    // Get the session id from the cookie.
    let sessionId = getCookieValueByName(sessionIdCookieName);

    // Prepare the survey results JSON.
    let resultsJSON = prepareSurveyResults(survey);
    if (survey.getValue("hasWithdrawn") !== 'true') {
        resultsJSON.mainsurvey_complete = true;
    }

    console.log(resultsJSON);
    // POST the survey results to the server for processing.
    $.ajax({
        type: "POST",
        url: "http://localhost:8000/api/mainsurvey/",
        data: JSON.stringify(resultsJSON, null, 3),
        dataType: "json",
        success: function(data, jqXHR) {
            // Success handler
            console.log(data.success);
        },
        error: function(data, jqXHR) {
            // Error handler
            logErrorMessage(data + "  " + jqXHR);
        }
    });
}

function createSSOTPContext(SSOOrTP) {
    inputJSON = {};
    if (SSOOrTP === 'SSO') {
        inputJSON = SSOGlobal;
    } else {
        inputJSON = TPGlobal;
    }

    var contextList = document.getElementById(SSOOrTP + 'ContextList');
    var numOPerms = inputJSON.length;

    if (numOPerms == 0) {
        document.getElementById(SSOOrTP + "ContextImg").style.display = 'block';
        document.getElementById(SSOOrTP + "ContextList").style.display = 'none';
        return;
    }

    for (let i = 0; i < numOPerms; i++) {
        var permItemOuterOuter = document.createElement('div');
        permItemOuterOuter.className = "ulZjrf";

        var permItemOuterBoarder = document.createElement('div');
        permItemOuterBoarder.className = "IExo3d X9yxo dMnX1b";

        var permItemOuter = document.createElement('div');
        permItemOuter.className = "URz83d WRlqaf";
        permItemOuter.setAttribute('aria-hidden', 'false');

        var permItem = document.createElement('div');
        permItem.className = "YtMm3d";

        // Setting up Icon for the app
        var iconDiv = document.createElement('div');
        iconDiv.className = "ShbWnb";
        iconDiv.setAttribute('aria-hidden', 'true');
        var icon = document.createElement("img");
        icon.src = inputJSON[i][APP_ICON];
        icon.className = "BUooTd Z6d4Dd yoxEFd ";
        icon.setAttribute('data-iml', '308.9600000000132');
        icon.setAttribute('data-atf', 'true');

        iconDiv.appendChild(icon);
        permItem.appendChild(iconDiv);

        var appNameDiv = document.createElement('div');
        appNameDiv.className = "CMEZce";
        appNameDiv.innerHTML = inputJSON[i][APP_NAME];

        permItem.appendChild(appNameDiv);

        if (SSOOrTP === 'TP') {
            appCateNames = inputJSON[i][APP_PERMISSIONS];
            appCateString = "Has access to ";
            for (let j = 0; j < appCateNames.length; j++) {
                appCateName = appCateNames[j][APP_PERMISSION_TITLE];
                if (appCateName !== "Basic account info" &&
                    appCateName !== "Additional access") {
                    appCateString = appCateString.concat(appCateName, ", ");
                }
            }
            // Remove the last ", " at the end
            appCateString = appCateString.slice(0, -2);

            appCateDiv = document.createElement('div');
            appCateDiv.className = "xoz9O";
            appCateDiv.innerHTML = appCateString;
            permItem.appendChild(appCateDiv);
        } else {
            appCateDiv = document.createElement('div');
            appCateDiv.className = "xoz9O";
            permItem.appendChild(appCateDiv);
        }

        permItemOuter.appendChild(permItem);
        permItemOuterBoarder.appendChild(permItemOuter)
        permItemOuterOuter.appendChild(permItemOuterBoarder);
        contextList.appendChild(permItemOuterOuter);
    }

    if (SSOOrTP == 'SSO') {

    }
}

function createAppContext(appJSON) {
    var acceList = document.getElementById('accelist');
    var appAcce = 'Has access to';
    var numOCategories = appJSON[APP_PERMISSIONS].length;

    for (let i = 0; i < numOCategories; i++) {
        var acceItem = document.createElement('div');
        acceItem.className = "sPOj5c";
        acceItem.setAttribute('role', 'listitem');

        appCateName = appJSON[APP_PERMISSIONS][i][APP_PERMISSION_TITLE];
        if (i == 0 && numOCategories > 1) {
            appAcce = appAcce.concat(" ", appCateName);
        } else
        if (i != numOCategories - 1 && numOCategories > 1) {
            appAcce = appAcce.concat(", ", appCateName);
        }

        // Setting up Icon for the Categories
        var iconDiv = document.createElement('div');
        iconDiv.className = "ZaX9ed";
        iconDiv.setAttribute('aria-hidden', 'true');
        if (appCateName === 'Basic account info' || appCateName === 'Additional access') {
            iconDiv.innerHTML = basicAccountInfoIcon;
        } else {
            var iconSpan = document.createElement('span');
            var icon = document.createElement("img");
            if (appCateName === 'Google Services') {
                icon.src = "https://www.gstatic.com/accounts/oauth/default-scope-icon.png";
            } else {
                icon.src = appJSON[APP_PERMISSIONS][i][APP_PERMISSION_ICON];
            }
            icon.className = "BUooTd Z6d4Dd klq2Rc";
            icon.setAttribute('data-iml', '250.15000000075815');
            icon.setAttribute('data-atf', 'false');
            iconSpan.appendChild(icon);
            iconDiv.appendChild(iconSpan);
        }
        acceItem.appendChild(iconDiv);

        // Setting up list of access details
        var permDetes = appJSON[APP_PERMISSIONS][i][APP_PERMISSION_DETAIL];
        var permDetesOuterDiv = document.createElement('div');
        permDetesOuterDiv.className = "hMZdhd";
        permDetesOuterDiv.innerText = appCateName;
        var permDetesInnerDiv = document.createElement('div');
        permDetesInnerDiv.className = "OcFGjf";
        for (let j = 0; j < permDetes.length; j++) {
            var permDete = document.createElement('div');
            permDete.className = "wnt0Xd";
            permDete.setAttribute("role", "listitem");
            permDete.innerText = permDetes[j][0];
            permDetesInnerDiv.appendChild(permDete);
        }
        permDetesOuterDiv.appendChild(permDetesInnerDiv);
        acceItem.appendChild(permDetesOuterDiv);

        acceList.appendChild(acceItem);
    }

    document.getElementById("appName").innerText = appJSON[APP_NAME];
    document.getElementById("appIcon").src = appJSON[APP_ICON];
    document.getElementById("appTime").innerText = convertMillitoDate(appJSON[APP_TIMESTAMP]);
    document.getElementById("appAcce").innerText = appAcce;
}

function createAppsAuthorizedMatrix(TPJSON) {
    var appsAuthorizedMatrix = survey.getQuestionByName("AppsAuthorizedMatrix");
    // appsAuthorizedMatrix.rows = {};
    if (appsAuthorizedMatrix.rows.length === 0) {
        for (var i = 0; i < TPJSON.length; i++) {
            let TPAPPName = TPJSON[i][APP_NAME];
            let TPAPPNameDisplay = `![](${TPJSON[i][APP_ICON]} =30x30)      ${TPJSON[i][APP_NAME]}`;
            appsAuthorizedMatrix.rows.push(new Survey.ItemValue(TPAPPName, TPAPPNameDisplay));
        }
    }
}

function createNeceConcMatrix(appJSON, appPermNeceName, appPermConcName, appPermUndeName) {
    let numOCategories = appJSON[APP_PERMISSIONS].length;
    var appPermissionsNece = survey.getQuestionByName(appPermNeceName);
    var appPermissionsConc = survey.getQuestionByName(appPermConcName);
    var appPermissionsUnde = survey.getQuestionByName(appPermUndeName);

    if (appPermissionsNece.rows.length === 0 && appPermissionsConc.rows.length === 0) {
        for (var i = 0; i < numOCategories; i++) {
            var appCate = appJSON[APP_PERMISSIONS][i][APP_PERMISSION_DETAIL];
            for (var j = 0; j < appCate.length; j++) {
                var appPerm = appCate[j][0];
                appPermissionsUnde.rows.push(new Survey.ItemValue(appPerm, appPerm));
                appPermissionsNece.rows.push(new Survey.ItemValue(appPerm, appPerm));
                appPermissionsConc.rows.push(new Survey.ItemValue(appPerm, appPerm));
            }
        }
    }
}

function convertMillitoDate(milliseconds) {
    let month = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let date = new Date(milliseconds);
    let ret = `${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    return ret;
}

// Registers listeners for events fired by the survey model
function registerSurveyListener(survey) {
    // Add an on complete function.
    survey
        .onComplete
        .add(function(result) {
            // Send the survey results to the server.
            sendSurveyResultsToTheServer(survey);

            // Display the Uninstall Extension button.
            $('div.sv-completedpage').append(`
                <input type="button" class="sv-btn sv-paneldynamic__remove-btn"
                value="Uninstall Extension" onclick="uninstallExtension()">
            `);

            resultsJSON.timestamp = getCurrentDateTime();

            // document.querySelector('#surveyResult').textContent = "Result JSON:\n" + JSON.stringify(parsedResult, null, 3);
        });

    survey
        .onPartialSend
        .add(function(survey) {
            // Send the partial survey results back to the server.
            if (survey.currentPageNo > surveyPartialSendStartIndex) {
                if (!pageResultSentToServer.includes(survey.currentPageNo)) {
                    sendPartialSurveyResultsToTheServer(survey);
                    pageResultSentToServer.push(survey.currentPageNo);
                }
            }
        });


    // Certain functionality depending on the page name.
    survey
        .onAfterRenderPage
        .add(function(survey) {
            // Restore navigation Button state on each page
            survey.showNavigationButtons = true;
            survey.showProgressBar = "both";

            if (survey.currentPage.name === 'launchMyAccountPage') {
                survey.showNavigationButtons = false;
            } else if (survey.currentPage.name === 'launchMyAccountPageContext') {
                signOut();
            } else if (survey.currentPage.name === 'launchMyAccountProceedPage') {
                // Send the message to get the SSO and TP apps to the content script of the browser extension.
                let message = { type: "GET_MY_ACCOUNT_SSO_APP" };
                let event = new CustomEvent("GET_MY_ACCOUNT_SSO_APP", { detail: message });
                window.dispatchEvent(event);

                message = { type: "GET_MY_ACCOUNT_TP_APP" };
                event = new CustomEvent("GET_MY_ACCOUNT_TP_APP", { detail: message });
                window.dispatchEvent(event);

                // Send the message to get 3 apps to the content script of the browser extension.
                message = { type: "GET_MY_ACCOUNT_OLDEST_APP" };
                event = new CustomEvent("GET_MY_ACCOUNT_OLDEST_APP", { detail: message });
                window.dispatchEvent(event);

                message = { type: "GET_MY_ACCOUNT_NEWEST_APP" };
                event = new CustomEvent("GET_MY_ACCOUNT_NEWEST_APP", { detail: message });
                window.dispatchEvent(event);

                message = { type: "GET_MY_ACCOUNT_RANDOM_APP" };
                event = new CustomEvent("GET_MY_ACCOUNT_RANDOM_APP", { detail: message });
                window.dispatchEvent(event);
            } else if (survey.currentPage.name === 'extensionInstructionsPage') {
                // Get the extension instruction div tag from the survey.
                let extensionInstructionsDiv = document.getElementById('extensionInstructionsDiv');

                // If this is a Chrome browser use the Chrome instructions, else if this is Firefox use the Firefox instructions.
                if (isChrome) {
                    if (isEdgeChromium) {
                        // Set the Edge extension instructions into the div tag if the div tag is available.
                        if (extensionInstructionsDiv) {
                            extensionInstructionsDiv.innerHTML = browserExtensionIntroduction + edgeExtensionInstructions;
                        }
                    } else {
                        // Set the Chrome extension instructions into the div tag if the div tag is available.
                        if (extensionInstructionsDiv) {
                            extensionInstructionsDiv.innerHTML = browserExtensionIntroduction + chromeExtensionInstructions;
                        }
                    }
                } else if (isFirefox) {
                    // Set the Firefox extension instructions into the div tag if the div tag is available.
                    if (extensionInstructionsDiv) {
                        extensionInstructionsDiv.innerHTML = browserExtensionIntroduction + firefoxExtensionInstructions;
                    }
                } else {
                    // TODO: Survey participant is not using a supported browser, send to withdraw page.
                    if (extensionInstructionsDiv) {
                        extensionInstructionsDiv.innerHTML = browserNotSupported;
                    }
                    console.log('browser not supported');
                }

                // If the extension is not installed yet hide the survey navigation buttons temporarily.
                if (!isExtensionInstalled()) {
                    survey.showNavigationButtons = false;
                }
            } else if (survey.currentPage.name === 'GoogleSSOPage') {
                if ((isSignedIn)) {
                    // Turn on the next button.
                    survey.showNavigationButtons = true;
                } else {
                    // Hide the navigation until sign-in.
                    survey.showNavigationButtons = false;
                }
            } else if (survey.currentPage.name === 'SSOPerceptionPage') {
                createSSOTPContext('SSO');
            } else if (survey.currentPage.name === 'TPPerceptionPage') {
                createSSOTPContext('TP');
            } else if (survey.currentPage.name === 'ReflectionPage' ||
                survey.currentPage.name === 'FutureDesignPage1') {

                if (survey.currentPage.name === 'ReflectionPage') {
                    survey.showProgressBar = "off";
                }

                flag = false;
                if (TPGlobal !== null && TPGlobal.length > 0) {
                    createSSOTPContext('TP');
                    flag = true;
                } else {
                    document.getElementById("TPContextList").style.display = 'none';
                }

                if (SSOGlobal !== null && SSOGlobal.length > 0) {
                    createSSOTPContext('SSO');
                    flag = true;
                } else {
                    document.getElementById("SSOContextList").style.display = 'none';
                }

                if (!flag) {
                    document.getElementById("reflectionPageContextDiv").style.display = 'none';
                    document.getElementById("reflectionPageImg").style.display = 'block';
                }

            } else if (survey.currentPage.name === 'RecallThirdPartyAuthPage') {
                survey.showProgressBar = "off";
                createAppsAuthorizedMatrix(TPGlobal);
            } else if (survey.currentPage.name.substring(0, 13) === 'OldestAppPage') {
                createAppContext(oldestAppGlobal);
                createNeceConcMatrix(oldestAppGlobal, "OldestappPermNece", "OldestappPermConc", "OldestappPermUnderstand");
            } else if (survey.currentPage.name.substring(0, 13) === 'NewestAppPage') {
                createAppContext(newestAppGlobal);
                createNeceConcMatrix(newestAppGlobal, "NewestappPermNece", "NewestappPermConc", "NewestappPermUnderstand");
            } else if (survey.currentPage.name.substring(0, 13) === 'RandomAppPage') {
                createAppContext(randomAppGlobal);
                createNeceConcMatrix(randomAppGlobal, "RandomappPermNece", "RandomappPermConc", "RandomappPermUnderstand");
            }
        });

    survey
        .onValueChanged
        .add(function(survey) {
            if (survey.currentPage.name === 'RecallThirdPartyAuthPage') {
                let AppsRemovePanel = survey.getPanelByName("AppsRemovePanel");
                let AppsAuthorizedMatRows = survey.getQuestionByName("AppsAuthorizedMatrix").visibleRows;
                for (let i = 0; i < AppsAuthorizedMatRows.length; i++) {
                    let rowValue = AppsAuthorizedMatRows[i].rowValue;
                    let appNameValue = AppsAuthorizedMatRows[i].name;
                    let appNameText = AppsAuthorizedMatRows[i].text;
                    if (rowValue === 'Remove') {
                        if (AppsRemovePanel.getQuestionByName(`Remove${appNameValue}Comment`) === null) {
                            AppsRemovePanel.addNewQuestion("comment", `Remove${appNameValue}Comment`, i);
                            survey.getQuestionByName(`Remove${appNameValue}Comment`).title = `You indicated you prefer to remove ${appNameText} from your Google account. Please explain why you wish to remove this app.`;
                            survey.getQuestionByName(`Remove${appNameValue}Comment`).isRequired = true;
                        }
                    } else if (rowValue === 'Keep' || rowValue === 'Unsure') {
                        AppsRemovePanel.removeQuestion(AppsRemovePanel.getQuestionByName(`Remove${appNameValue}Comment`));
                    }
                }
            }

            if (survey.currentPage.name === 'GoogleSSOPage') {
                // survey.showNavigationButtons = false;
                if (isSignedIn) {
                    survey.showNavigationButtons = true;
                }
            }
        });

    // Set up a mutation listener for surveyArticle dataset
    let surveyArticle = document.getElementById('surveyArticle');
    if (surveyArticle !== null) {
        // console.log("article tag exists");
        // Set up observer for the survey article dataset and store as a survey value on mutation.
        let surveyArticleDatasetObserver = new MutationObserver((mutationsList, observer) => {
            mutationsList
                .filter(mutation => mutation.type === 'attributes')
                .forEach(mutation => {
                    if (mutation.attributeName === 'data-ssodata') {
                        if (mutation.target.dataset.ssodata !== "undefined") {
                            let SSOJSON = JSON.parse(mutation.target.dataset.ssodata);
                            SSOGlobal = SSOJSON;
                            let numSSO = SSOJSON.length;
                            survey.setValue("NumSSOApps", numSSO);
                            if (numSSO >= 1) {
                                survey.setValue("SSOPageVisible", "true");
                            }
                        }
                    }
                    if (mutation.attributeName === 'data-tpdata') {
                        if (mutation.target.dataset.tpdata !== "undefined") {
                            let TPJSON = JSON.parse(mutation.target.dataset.tpdata);
                            TPGlobal = TPJSON;
                            let numTP = TPJSON.length;

                            if (numTP > 0) {
                                survey.setValue("OldestPageVisible", "true");
                                survey.setValue("RecallThirdPartyAuthPageVisible", "true");
                            }
                            if (numTP > 1) {
                                survey.setValue("NewestPageVisible", "true");
                            }
                            if (numTP > 2) {
                                survey.setValue("RandomPageVisible", "true");
                            }
                            survey.setValue("NumTPApps", numTP);
                        }
                    }

                    if (mutation.attributeName === 'data-oldest-app-data') {
                        if (mutation.target.dataset.oldestAppData !== "undefined") {
                            // Get attribute value from article dataset
                            let oldestApp = JSON.parse(mutation.target.dataset.oldestAppData);
                            oldestAppGlobal = oldestApp;
                            // Set attribute value into survey object
                            survey.setValue('OldestappName', oldestApp[APP_NAME]);
                        }
                    }

                    if (mutation.attributeName === 'data-newest-app-data') {
                        if (mutation.target.dataset.newestAppData !== "undefined") {
                            // Get attribute value from article dataset
                            let newestApp = JSON.parse(mutation.target.dataset.newestAppData);
                            newestAppGlobal = newestApp;
                            // Set attribute value into survey object
                            survey.setValue('NewestappName', newestApp[APP_NAME]);
                        }
                    }

                    if (mutation.attributeName === 'data-random-app-data') {
                        if (mutation.target.dataset.randomAppData !== "undefined") {
                            // Get attribute value from article dataset
                            let randomApp = JSON.parse(mutation.target.dataset.randomAppData);
                            randomAppGlobal = randomApp;
                            // Set attribute value into survey object
                            survey.setValue('RandomappName', randomApp[APP_NAME]);
                        }
                    }
                });
        });
        surveyArticleDatasetObserver.observe(surveyArticle, { attributes: true });

        // Flag to prevent survey.nextPage to trigger more than once
        let tempFlag = 0;
        // Set up observer for timer data
        let timerDataObserver = new MutationObserver((mutationsList, observer) => {
            mutationsList
                .forEach(mutation => {
                    // Extract time from surveyArticle dataset
                    let timeLeft = mutation.target ? mutation.target.dataset ?
                        mutation.target.dataset.countDownTimer : 0 : {};

                    // If time is left (leave some buffer in case the timeLeft never quite reaches zero).
                    if (timeLeft > 1000) {
                        // Hide the survey navigation buttons again.
                        survey.showNavigationButtons = false;

                        // Update timer on survey page
                        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                        let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                        survey.getQuestionByName('launchMyAccountTimer').html = `
                            ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}
                            are left for exploring "Apps with access to your account" Page.
                        `;

                        // Show timer.
                        survey.setValue('launchMyAccountTimer', 'true');
                        // survey.getQuestionByName('launchMyAccountTimer').visible = true;
                    } else {
                        // Show the survey navigation buttons again.
                        survey.showNavigationButtons = true;

                        // Reset the my account page launched toggle.
                        isMyAccountPageLaunched = false;

                        // Hide timer and description and show proceed message.
                        survey.setValue('launchMyAccountProceed', 'true');
                        survey.getQuestionByName('launchMyAccountTimer').visible = false;
                        if (tempFlag === 0 && survey.currentPage.name === "launchMyAccountPage") {
                            survey.nextPage();
                            tempFlag = 1;
                        }
                    }
                });
        });
        timerDataObserver.observe(surveyArticle, { attributeFilter: ['data-count-down-timer'] });

        // Create an observer for surveyArticle.dataset.browserExtensionVersion
        const observer = new MutationObserver(function(mutationsList, observer) {
            mutationsList
                .forEach(mutation => {
                    // If the browser extension has been installed activate the navigation buttons.
                    if (mutation.target.dataset.browserExtensionVersion === currentBrowserExtensionVersionNumber) {
                        if (survey.currentPage.name === "extensionInstructionsPage") {
                            survey.showNavigationButtons = true;
                        }
                    } else {
                        console.log('web browser extension version mismatch');
                    }
                });
        });
        observer.observe(surveyArticle, { attributeFilter: ['data-browser-extension-version'] });
    }
}

// Function to load extension data from cookies
function loadAppsData(localStorageDataName) {
    let mainSurveyExtData = JSON.parse(window.localStorage.getItem(localStorageDataName));
    if (mainSurveyExtData !== null) {
        authuserID = mainSurveyExtData.authuserID;
        SSOGlobal = mainSurveyExtData.SSOGlobal;
        TPGlobal = mainSurveyExtData.TPGlobal;
        oldestAppGlobal = mainSurveyExtData.oldestAppGlobal;
        newestAppGlobal = mainSurveyExtData.newestAppGlobal;
        randomAppGlobal = mainSurveyExtData.randomAppGlobal;
    }
}

// Function to record extension data if the page is refreshed
function saveAppsDataOnReload(localStorageDataName) {
    let mainSurveyExtData = {};

    mainSurveyExtData.authuserID = authuserID;
    mainSurveyExtData.SSOGlobal = SSOGlobal;
    mainSurveyExtData.TPGlobal = TPGlobal;
    mainSurveyExtData.oldestAppGlobal = oldestAppGlobal;
    mainSurveyExtData.newestAppGlobal = newestAppGlobal;
    mainSurveyExtData.randomAppGlobal = randomAppGlobal;

    window.localStorage.setItem(localStorageDataName, JSON.stringify(mainSurveyExtData));
}


/******************************************************************************
 * Set up of survey model instance
 ******************************************************************************/
// Set the survey json, see the file json/survey-config.js.
window.survey = new Survey.Model(mainSurveyJSON);

// Register survey-related listeners
registerCommonSurveyListener(survey);
registerSurveyListener(survey);
//Load saved state
loadState(survey, localStorageName);
loadAppsData(localStorageExtDataName);

// Save survey responses when window is closed, refresh, or navigation buttons are used
window.addEventListener('beforeunload', function(event) {
    if (survey !== undefined) {
        saveState(survey, localStorageName);
        saveAppsDataOnReload(localStorageExtDataName);
    }
});

// Get the survey element div and apply the survey model.
$("#surveyElement").Survey({
    model: window.survey,
});