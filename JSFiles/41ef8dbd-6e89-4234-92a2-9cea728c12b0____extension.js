// Copyright 2011 Google Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview
 * Provides logic for the extension.
 *
 */

/** google global namespace for Google projects. */
var google = google || {};

/** devrel namespace for Google Developer Relations projects. */
google.devrel = google.devrel || {};

/** samples namespace for Devrel sample code. */
google.devrel.samples = google.devrel.samples || {};

/** autodo namespace for this sample. */
google.devrel.samples.autodo = google.devrel.samples.autodo || {};

/** Extension object for Chrome extension methods. */
google.devrel.samples.autodo.Extension =
    google.devrel.samples.autodo.Extension || {};

/** Alias for Extension object. */
var Extension = google.devrel.samples.autodo.Extension;

/**
 * The URL to Au-to-do.
 * @type {string}
 */
google.devrel.samples.autodo.Extension.APP_URL =
    'http://your-application-id.appspot.com';

/**
 * The number of milliseconds between incident retrievals.
 * @type {number}
 */
google.devrel.samples.autodo.Extension.FETCH_FREQ = 30000;

/**
 * The badge color to display behind the incident counter.
 * @type {Array}
 */
google.devrel.samples.autodo.Extension.INCIDENT_COLOR = [0, 163, 0, 255];

/**
 * The badge color to display when the user isn't logged in.
 * @type {Array}
 */
google.devrel.samples.autodo.Extension.WARNING_COLOR = [255, 0, 0, 255];

/**
 * The user's assigned incidents.
 * @type {Array}
 */
google.devrel.samples.autodo.Extension.incidents;

/**
 * Whether or not the user needs to log in.
 * @type {boolean}
 */
google.devrel.samples.autodo.Extension.loginRequired = false;

/**
 * Initializes the background process.
 */
google.devrel.samples.autodo.Extension.backgroundInit = function() {
  Extension.getIncidents();
  setInterval(Extension.getIncidents, Extension.FETCH_FREQ);
};

/**
 * Gets the list of incidents assigned to the current user.
 */
google.devrel.samples.autodo.Extension.getIncidents = function() {
  var req = new XMLHttpRequest();
  req.open('GET', Extension.APP_URL +
      '/resources/v1/incidents/?owner=me', true);
  req.onload = Extension.processIncidents;
  req.onerror = Extension.processError;
  req.send();
};

/**
 * Processes the response from the incident request.
 * @param {Event} e Request completion event.
 */
google.devrel.samples.autodo.Extension.processIncidents = function(e) {
  if (e.target.status >= 200 && e.target.status < 300) {
    Extension.incidents = JSON.parse(e.target.responseText);
    Extension.loginRequired = false;
    Extension.updateBadgeCount(Extension.incidents.length);
  } else {
    Extension.processError();
  }
};

/**
 * Processes an error response from the incident request.
 */
google.devrel.samples.autodo.Extension.processError = function() {
  Extension.loginRequired = true;
  Extension.displayLoginBadge();
};

/**
 * Updates the badge icon to display the incident count.
 * @param {number} incidentCount Number of incidents.
 */
google.devrel.samples.autodo.Extension.updateBadgeCount =
    function(incidentCount) {
  chrome.browserAction.setBadgeBackgroundColor({
    color: Extension.INCIDENT_COLOR
  });
  chrome.browserAction.setBadgeText({text: '' + incidentCount});
};

/**
 * Displays a icon indicating the user should log in.
 */
google.devrel.samples.autodo.Extension.displayLoginBadge = function() {
  chrome.browserAction.setBadgeBackgroundColor({
    color: Extension.WARNING_COLOR
  });
  chrome.browserAction.setBadgeText({text: ':('});
};

/**
 * Opens the selected incident in a new tab.
 * @param {MouseEvent} e Mouse event triggering the tab to open.
 */
google.devrel.samples.autodo.Extension.openIncident = function(e) {
  var id = e.target.dataset.id;
  var url = Extension.APP_URL + '#id=';
  Extension.openTab(url + id);
};

/**
 * Opens Au-to-do in a new tab.
 */
google.devrel.samples.autodo.Extension.openATD = function() {
  Extension.openTab(Extension.APP_URL);
};

/**
 * Opens a new tab and closes the extension popup.
 * @param {string} url URL to open in the new tab.
 */
google.devrel.samples.autodo.Extension.openTab = function(url) {
  chrome.tabs.create({
    url: url,
    selected: true
  });
  self.close();
};

/**
 * Initializes the popup window.
 */
google.devrel.samples.autodo.Extension.popupInit = function() {
  var bg = chrome.extension.getBackgroundPage();

  if (bg.Extension.loginRequired) {
    var login = document.querySelector('#login');
  login.style.display = 'block';
  } else {
    var incidentDiv = document.querySelector('#incidents');
    incidentDiv.setAttribute('style', 'display: block');
    for (var i = 0; i < bg.Extension.incidents.length; i++) {
      var incident = document.createElement('div');
      incident.classList.add('content-list-div');
      var a = document.createElement('a');
      a.href = '#';
      a.dataset.id = bg.Extension.incidents[i].id;
      var text = document.createTextNode(bg.Extension.incidents[i].title);
      a.appendChild(text);
      a.onclick = Extension.openIncident;
      incident.appendChild(a);
      incidentDiv.appendChild(incident);
    }

    var atdLink = document.querySelector('#atd-link');
    atdLink.onclick = Extension.openATD;
  }
};
