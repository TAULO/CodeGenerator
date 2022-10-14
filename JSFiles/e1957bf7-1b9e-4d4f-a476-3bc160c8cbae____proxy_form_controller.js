// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @fileoverview This file implements the ProxyFormController class, which
 * wraps a form element with logic that enables implementation of proxy
 * settings.
 *
 * @author mkwst@google.com (Mike West)
 */

/**
 * Wraps the proxy configuration form, binding proper handlers to its various
 * `change`, `click`, etc. events in order to take appropriate action in
 * response to user events.
 *
 * @param {string} id The form's DOM ID.
 * @constructor
 */
var ProxyFormController = function(id) {
  /**
   * The wrapped form element
   * @type {Node}
   * @private
   */
  this.form_ = document.getElementById(id);

  // Throw an error if the element either doesn't exist, or isn't a form.
  if (!this.form_)
    throw chrome.i18n.getMessage('errorIdNotFound', id);

/* This is not a form anymore
  else if (this.form_.nodeName !== 'FORM')
    throw chrome.i18n.getMessage('errorIdNotForm', id);
*/

  /**
   * Cached references to the `fieldset` groups that define the configuration
   * options presented to the user.
   *
   * @type {NodeList}
   * @private
   */

// There are no configgroups since all the items will be active allthe time
//  this.configGroups_ = document.querySelectorAll('#' + id + ' > fieldset');

  this.bindEventHandlers_();
  this.readCurrentState_();

  // Handle errors
  this.handleProxyErrors_();
};

///////////////////////////////////////////////////////////////////////////////

/**
 * The proxy types we're capable of handling.
 * @enum {string}
 */
ProxyFormController.ProxyTypes = {
//  AUTO: 'auto_detect',
//  PAC: 'pac_script',
  DIRECT: 'direct-connection-button',
  FIXED: 'fixed_servers',
  SYSTEM: 'system-wide-button'
};

/**
 * The window types we're capable of handling.
 * @enum {int}
 */
ProxyFormController.WindowTypes = {
  REGULAR: 1,
  INCOGNITO: 2
};

/**
 * The extension's level of control of Chrome's roxy setting
 * @enum {string}
 */
ProxyFormController.LevelOfControl = {
  NOT_CONTROLLABLE: 'not_controllable',
  OTHER_EXTENSION: 'controlled_by_other_extension',
  AVAILABLE: 'controllable_by_this_extension',
  CONTROLLING: 'controlled_by_this_extension'
};

/**
 * The response type from 'proxy.settings.get'
 *
 * @typedef {{value: ProxyConfig,
 *     levelOfControl: ProxyFormController.LevelOfControl}}
 */
ProxyFormController.WrappedProxyConfig;

///////////////////////////////////////////////////////////////////////////////

/**
 * Retrieves proxy settings that have been persisted across restarts.
 *
 * @return {?ProxyConfig} The persisted proxy configuration, or null if no
 *     value has been persisted.
 * @static
 */
ProxyFormController.getPersistedSettings = function() {
  var result = null;
  if (window.localStorage['proxyConfig'] !== undefined)
    result = JSON.parse(window.localStorage['proxyConfig']);
  return result ? result : null;
};


/**
 * Persists proxy settings across restarts.
 *
 * @param {!ProxyConfig} config The proxy config to persist.
 * @static
 */
ProxyFormController.setPersistedSettings = function(config) {
  window.localStorage['proxyConfig'] = JSON.stringify(config);
/*
  // Clear previous proxy rotation alarm
  chrome.alarms.clear("RotateProxyAlarm");
  console.log('Clearing proxy rotation alarm.');

  // Set alarm for proxy rotation
  var rotationInterval = JSON.parse(window.localStorage['rotationInterval']);
  if (config.regular.mode == 'fixed_servers' && rotationInterval > 0) {

    console.log('Resetting proxy rotation interval: ' + rotationInterval);

    chrome.alarms.create("RotateProxyAlarm", { delayInMinutes: rotationInterval, periodInMinutes: rotationInterval });
  }
*/
};

/**
 * Set proxy
 *
 * @param {!ProxyConfig} config The proxy config to persist.
 * @static
 */
ProxyFormController.setProxy = function() {

// v0.1.3

	var pacScriptURL='http://www.jumbroxy.com/pacs/' + window.localStorage['manualProxyID'];

	// check if the secure web proxy has been disabled
	if( (window.localStorage['secureWebProxy'] !== undefined) 
		&& !JSON.parse(window.localStorage['secureWebProxy'])) {
		pacScriptURL=pacScriptURL + '_nossl';
	} 

	pacScriptURL=pacScriptURL + '.pac';

	console.log('PAC URL ' + pacScriptURL);

  	var config = {regular: null, incognito: null};
        config.regular = {mode: 'pac_script',
                  pacScript: {url: pacScriptURL, mandatory: true}};

	  config.incognito = config.regular;

    window.localStorage['proxyConfig'] = JSON.stringify(config);

    chrome.proxy.settings.set(
        {value: config.regular, scope: 'regular'},
////	ProxyFormController.callbackForRegularSettings_.bind(this));
	function() {});


// We send web request immediately after the new proxy has been set
// This is done in order to avoid strange Chrome error
// when auth dialog pops up 
//

var xhr = new XMLHttpRequest();
//xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
xhr.open("GET", 'http://www.google.com/', true);
xhr.send();

    chrome.extension.sendRequest({type: 'clearError'});

}

/**
 * Rotate proxy
 *
 * @param {!ProxyConfig} config The proxy config to persist.
 * @static
 */
ProxyFormController.rotateProxy = function() {
    /* Get proxy list from the local storage */
    var rslt = null;
    if (window.localStorage['proxyList'] !== undefined) {
      rslt = JSON.parse(window.localStorage['proxyList']);
    }

    /* Strip the previous proxy */
    for (var i = 0; i < rslt.length; i++) {
//	console.log('Proxy array length: ' + rslt.length + ' index: ' + i);
	if( rslt[i].id == window.localStorage['manualProxyID']) {
		rslt.splice(i,1);
	}
    }

    var rand = rslt[Math.floor(Math.random() * rslt.length)];

      var id = rand.id;
      var host = rand.host;
      var port = parseInt( rand.port, 10);
      var status = rand.status;
      var country = rand.country;
      var DMA = rand.DMA;

        result = { scheme: 'http', host: host, port: port };

//      console.log( result);

  	var config = {regular: null, incognito: null};
	  config.regular = {mode: 'fixed_servers'};
          config.regular.rules = {
            singleProxy: result,
            bypassList: ['<local>','*jumbroxy.com']
          };

// v0.1.3

	var pacScriptURL='http://www.jumbroxy.com/pacs/' + id;

	// check if the secure web proxy has been disabled
	if( (window.localStorage['secureWebProxy'] !== undefined) 
		&& !JSON.parse(window.localStorage['secureWebProxy'])) {
		pacScriptURL=pacScriptURL + '_nossl';
	} 

	pacScriptURL=pacScriptURL + '.pac';

	console.log('PAC URL ' + pacScriptURL);

        config.regular = {mode: 'pac_script',
                  pacScript: {url: pacScriptURL, mandatory: true}};

	  config.incognito = config.regular;

  window.localStorage['proxyConfig'] = JSON.stringify(config);
  window.localStorage['manualProxyID'] = id;

    chrome.proxy.settings.set(
        {value: config.regular, scope: 'regular'},
////	ProxyFormController.callbackForRegularSettings_.bind(this));
	function() {});




// We send web request immediately after the new proxy has been set
// This is done in order to avoid strange Chrome error
// when auth dialog pops up 
//

var xhr = new XMLHttpRequest();
//xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
xhr.open("GET", 'http://www.google.com/', true);
xhr.send();

/*
Unchecked runtime.lastError while running types.ChromeSetting.set: You do not have permission to access incognito preferences.
    chrome.proxy.settings.set(
        {value: config.incognito, scope: 'incognito_persistent'},
	function() {});
*/


/*
        c.callbackForRegularSettings_.bind(c));
*/
    chrome.extension.sendRequest({type: 'clearError'});
};

///////////////////////////////////////////////////////////////////////////////

ProxyFormController.prototype = {
  /**
   * The form's current state.
   * @type {regular: ?ProxyConfig, incognito: ?ProxyConfig}
   * @private
   */
  config_: {regular: null, incognito: null},

  /**
   * Do we have access to incognito mode?
   * @type {boolean}
   * @private
   */
  isAllowedIncognitoAccess_: false,

  /**
   * @return {string} The PAC file URL (or an empty string).

  get pacURL() {
    return document.getElementById('autoconfigURL').value;
  },

  /**
   * @param {!string} value The PAC file URL.
  set pacURL(value) {
    document.getElementById('autoconfigURL').value = value;
  },

  /**
   * @return {string} The PAC file data (or an empty string).
  get manualPac() {
    return document.getElementById('autoconfigData').value;
  },


  /**
   * @param {!string} value The PAC file data.
  set manualPac(value) {
    document.getElementById('autoconfigData').value = value;
  },
   */

  /**
   * @return {Array.<string>} A list of hostnames that should bypass the proxy.
   */
  get bypassList() {
//    return document.getElementById('bypassList').value.split(/\s*(?:,|^)\s*/m);
    bypass = ['<local>','*jumbroxy.com'];
    return bypass;
  },


  /**
   * @param {?Array.<string>} data A list of hostnames that should bypass
   *     the proxy. If empty, the bypass list is emptied.
   */
  set bypassList(data) {
    if (!data)
      data = [];
//    document.getElementById('bypassList').value = data.join(', ');
  },


  /**
   * @see http://code.google.com/chrome/extensions/trunk/proxy.html
   * @return {?ProxyServer} An object containing the proxy server host, port,
   *     and scheme. If null, there is no single proxy.
   */
  get singleProxy() {
//    var checkbox = document.getElementById('singleProxyForEverything');
//    return checkbox.checked ? this.httpProxy : null;
    return this.httpProxy;
  },


  /**
   * @see http://code.google.com/chrome/extensions/trunk/proxy.html
   * @param {?ProxyServer} data An object containing the proxy server host,
   *     port, and scheme. If null, the single proxy checkbox will be unchecked.
   */
  set singleProxy(data) {
    if (data)
      this.httpProxy = data;
/*
    var checkbox = document.getElementById('singleProxyForEverything');
    checkbox.checked = !!data; // Converts to boolean and ensures boolean type

    if (data)
      this.httpProxy = data;

    if (checkbox.checked)
      checkbox.parentNode.parentNode.classList.add('single');
    else
      checkbox.parentNode.parentNode.classList.remove('single');
*/
  },

  /**
   * @return {?ProxyServer} An object containing the proxy server host, port
   *     and scheme.
   */
  get httpProxy() {
    return this.getProxyImpl_('Http');
  },


  /**
   * @param {?ProxyServer} data An object containing the proxy server host,
   *     port, and scheme. If empty, empties the proxy setting.
   */
  set httpProxy(data) {
    this.setProxyImpl_('Http', data);
  },


  /**
   * @return {?ProxyServer} An object containing the proxy server host, port
   *     and scheme.
  get httpsProxy() {
    return this.getProxyImpl_('Https');
  },


  /**
   * @param {?ProxyServer} data An object containing the proxy server host,
   *     port, and scheme. If empty, empties the proxy setting.
  set httpsProxy(data) {
    this.setProxyImpl_('Https', data);
  },


  /**
   * @return {?ProxyServer} An object containing the proxy server host, port
   *     and scheme.
  get ftpProxy() {
    return this.getProxyImpl_('Ftp');
  },


  /**
   * @param {?ProxyServer} data An object containing the proxy server host,
   *     port, and scheme. If empty, empties the proxy setting.
  set ftpProxy(data) {
    this.setProxyImpl_('Ftp', data);
  },


  /**
   * @return {?ProxyServer} An object containing the proxy server host, port
   *     and scheme.
  get fallbackProxy() {
    return this.getProxyImpl_('Fallback');
  },


  /**
   * @param {?ProxyServer} data An object containing the proxy server host,
   *     port, and scheme. If empty, empties the proxy setting.
  set fallbackProxy(data) {
    this.setProxyImpl_('Fallback', data);
  },
   */

  /**
   * @param {string} type The type of proxy that's being set ("Http",
   *     "Https", etc.).
   * @return {?ProxyServer} An object containing the proxy server host,
   *     port, and scheme.
   * @private
   */
  getProxyImpl_: function(type) {

    console.log('Selected manual proxy type ' + type);

/*
    var result = {
      scheme: document.getElementById('proxyScheme' + type).value,
      host: document.getElementById('proxyHost' + type).value,
      port: parseInt(document.getElementById('proxyPort' + type).value, 10)
    };
    return (result.scheme && result.host && result.port) ? result : undefined;
*/

    var result = {
      scheme: null,
      host: null,
      port: null
    };

    // We need to get the proxy ID of the active manual button
    var proxyID = null;
    var elems = document.getElementsByTagName('*'), i;
    for (i in elems) {
        if((' ' + elems[i].className + ' ').indexOf('active selected') > -1) {
	  var child = elems[i].firstChild;
	  var buttonID = child.getAttribute("id");
	  var found = buttonID.match(/manual-(us|uk)-proxy-(\d+)/i);
	  proxyID = found [2];
          console.log('Selected element ' + found[2]);
	}
    }


// One need to get the proxy details from the local storage
//    var e = document.getElementById('manualProxies');
//    var proxyID = e.options[e.selectedIndex].value;

//    console.log('Selected manual proxy ID ' + proxyID);

    /* Get proxy list from the local storage */
    var rslt = null;
    if (window.localStorage['proxyList'] !== undefined) {
      rslt = JSON.parse(window.localStorage['proxyList']);
    }

    console.log('Fetching proxy list from local storage');

    if( !rslt) {

      console.log('Proxy list can not be fetched from the local storage');
    } 
    else {

      for (var key in rslt) {
        if (rslt.hasOwnProperty(key)) {
      var id = rslt[key].id;
      var host = rslt[key].host;
      var port = parseInt( rslt[key].port, 10);
      var status = rslt[key].status;
      var country = rslt[key].country;
      var DMA = rslt[key].DMA;

      // Matching proxy ID has been found
      if( id == proxyID) {		

        result = { scheme: 'http', host: host, port: port };

        console.log('Saving proxy ID to the local storage');
        window.localStorage['manualProxyID'] = id;
      }
        }
      }
    }

    return (result.scheme && result.host && result.port) ? result : undefined;
  },


  /**
   * A generic mechanism for setting proxy data.
   *
   * @see http://code.google.com/chrome/extensions/trunk/proxy.html
   * @param {string} type The type of proxy that's being set ("Http",
   *     "Https", etc.).
   * @param {?ProxyServer} data An object containing the proxy server host,
   *     port, and scheme. If empty, empties the proxy setting.
   * @private
   */
  setProxyImpl_: function(type, data) {
    if (!data)
      data = {scheme: 'http', host: '', port: ''};
/*
    document.getElementById('proxyScheme' + type).value = data.scheme;
    document.getElementById('proxyHost' + type).value = data.host;
    document.getElementById('proxyPort' + type).value = data.port;
*/
// One need to put the code here in order to populate the form properly
    /* Get proxy list from the local storage */
    var rslt = null;
    if (window.localStorage['manualProxyID'] !== undefined) {
      rslt = window.localStorage['manualProxyID'];
    }

    console.log('Fetching proxy ID from local storage ' + rslt);

/*
    // We need to get the proxy ID of the active manual button
    var proxyID = null;
    var elems = document.getElementsByTagName('*'), i;
    for (i in elems) {
        if((' ' + elems[i].className + ' ').indexOf('active selected') > -1) {
	  var child = elems[i].firstChild;
	  var buttonID = child.getAttribute("id");
	  var found = buttonID.match(/manual-(us|uk)-proxy-(\d+)/i);
	  proxyID = found [2];
          console.log('Selected element ' + found[2]);
	}
    }
*/

    var items = document.getElementById("proxy-list");
    var DMA = items.getElementsByTagName("li");
    for (var i=0; i<DMA.length; i++) {

      var child = DMA[i].firstChild;
      var buttonID = child.getAttribute("id");
      console.log('Matching ' + buttonID);

// We are matching IDs here but after proxylist reload the node ID of the same
// DMA can be different. This will lead to the first record being selected.

      if( !!buttonID && (buttonID.indexOf('-' + rslt) > 0)) {

	// select and activate the proxy server item
	cssClass = child.getAttribute('class');
	child.setAttribute('class', (cssClass === null ? '' : cssClass.replace(' active', '').replace(' selected', '')) + ' active selected');
        break;
      }
    }

  },

///////////////////////////////////////////////////////////////////////////////

  /**
   * Calls the proxy API to read the current settings, and populates the form
   * accordingly.
   *
   * @private
   */
  readCurrentState_: function() {
    chrome.extension.isAllowedIncognitoAccess(
        this.handleIncognitoAccessResponse_.bind(this));
  },

  /**
   * Handles the respnse from `chrome.extension.isAllowedIncognitoAccess`
   * We can't render the form until we know what our access level is, so
   * we wait until we have confirmed incognito access levels before
   * asking for the proxy state.
   *
   * @param {boolean} state The state of incognito access.
   * @private
   */
  handleIncognitoAccessResponse_: function(state) {

  console.log('Is Incognito access allowed? ' + this.isAllowedIncognitoAccess_ + " " + state);

    this.isAllowedIncognitoAccess_ = state;
    chrome.proxy.settings.get({incognito: false},
        this.handleRegularState_.bind(this));

/* Do not bother with Incognito state atm
*/
    if (this.isAllowedIncognitoAccess_) {
      chrome.proxy.settings.get({incognito: true},
          this.handleIncognitoState_.bind(this));
    }

  },

  /**
   * Handles the response from 'proxy.settings.get' for regular
   * settings.
   *
   * @param {ProxyFormController.WrappedProxyConfig} c The proxy data and
   *     extension's level of control thereof.
   * @private
   */
  handleRegularState_: function(c) {

    console.log('Regular level of control ' + c.levelOfControl);

    if (c.levelOfControl === ProxyFormController.LevelOfControl.AVAILABLE ||
        c.levelOfControl === ProxyFormController.LevelOfControl.CONTROLLING) {
      this.recalcFormValues_(c.value);
      this.config_.regular = c.value;
    } else {
      this.handleLackOfControl_(c.levelOfControl);
    }
  },

  /**
   * Handles the response from 'proxy.settings.get' for incognito
   * settings.
   *
   * @param {ProxyFormController.WrappedProxyConfig} c The proxy data and
   *     extension's level of control thereof.
   * @private
   */
  handleIncognitoState_: function(c) {

    console.log('Incognito level of control ' + c.levelOfControl);

    if (c.levelOfControl === ProxyFormController.LevelOfControl.AVAILABLE ||
        c.levelOfControl === ProxyFormController.LevelOfControl.CONTROLLING) {

	// This form does not have incognito mode so the if statement below always 0
      if (this.isIncognitoMode_())
        this.recalcFormValues_(c.value);

      this.config_.incognito = c.value;
    } else {
      this.handleLackOfControl_(c.levelOfControl);
    }
  },

  /**
   * Binds event handlers for the various bits and pieces of the form that
   * are interesting to the controller.
   *
   * @private
   */
  bindEventHandlers_: function() {
    console.log('Binding event listener for click ' + this.form_);
//    this.form_.parentNode.parentNode.parentNode.addEventListener('click', this.dispatchFormClick_.bind(this));
    this.form_.addEventListener('click', this.dispatchFormClick_.bind(this));
  },


  /**
   * When a `click` event is triggered on the form, this function handles it by
   * analyzing the context, and dispatching the click to the correct handler.
   *
   * @param {Event} e The event to be handled.
   * @private
   * @return {boolean} True if the event should bubble, false otherwise.
   */
  dispatchFormClick_: function(e) {
    var t = e.target;

    console.log('Click ' + t);

    // Case 1: "Apply"
//    if (t.nodeName === 'INPUT' && t.getAttribute('type') === 'submit') {
//      return this.applyChanges_(e);
/*
    // Case 2: "Use the same proxy for all protocols" in an active section
    } else if (t.nodeName === 'INPUT' &&
               t.getAttribute('type') === 'checkbox' &&
               t.parentNode.parentNode.parentNode.classList.contains('active')
              ) {
      return this.toggleSingleProxyConfig_(e);

    // Case 3: "Flip to incognito mode."
    } else if (t.nodeName === 'BUTTON') {
      return this.toggleIncognitoMode_(e);
*/
    // Case 1: "Direct connection button."
    if ( ~t.getAttribute('id').indexOf('direct-connection')) {
      console.log('Direct connection button pressed');
      return this.applyChanges_(e);
    // Case 2: "System-wide settings button."
    } else if ( ~t.getAttribute('id').indexOf('system-wide')) {
      console.log('System-wide settings button pressed');
      return this.applyChanges_(e);
    // Case 3: One of the manual proxy buttons in the stack pressed
    } else if ( ~t.getAttribute('id').indexOf('manual')) {
      console.log('One of the manual proxy button pressed');
      return this.applyChanges_(e);
    // Case 4: "Reload proxylist button."
    } else if ( ~t.getAttribute('id').indexOf('reload-')) {
      return this.reloadProxyList_(e);
    // Case 5: Expansion button pressed
    } else if ( ~t.getAttribute('id').indexOf('expansion')) {
      console.log('Stack expansion button pressed');
    // Case X: Click on something random: maybe changing active config group?
    } else {
      // Walk up the tree until we hit `form > fieldset` or fall off the top
      while (t && (t.nodeName !== 'FIELDSET' ||
             t.parentNode.nodeName !== 'FORM')) {
        t = t.parentNode;
      }
      if (t) {
//        this.changeActive_(t);
        return false;
      }
    }
    return true;
  },

  /**
   * Reload proxy list.
   *
   * @param {DOMElement} img.
   * @private
   */
  reloadProxyList_: function(fieldset) {

    // Reload the proxy list
    var j = new JumboCustomerAccount();  
    j.requestProxyList();

    // Clear the error
    chrome.extension.sendRequest({type: 'clearError'});

// requestProxyList is async
//    this.readCurrentState_();
  },

  /**
   * Sets the form's active config group.
   *
   * @param {DOMElement} fieldset The configuration group to activate.
   * @private
   */
/*
  changeActive_: function(fieldset) {
    for (var i = 0; i < this.configGroups_.length; i++) {
      var el = this.configGroups_[i];
      var radio = el.querySelector("input[type='radio']");
      if (el === fieldset) {
        el.classList.add('active');
        radio.checked = true;
      } else {
        el.classList.remove('active');
      }
    }
    this.recalcDisabledInputs_();
  },
*/
  /**
   * Sets the form's active button.
   */
  changeActive_: function(mode) {

    this.deselectConnectionTypes_();

	if( mode === 'direct') {
		var directConnection = document.getElementById('direct-connection-button');
		cssClass = directConnection.getAttribute('class');
		directConnection.setAttribute('class', (cssClass === null ? '' : cssClass.replace(' active', '')) + ' active');
	} else if ( mode === 'system') {
		var systemConnection = document.getElementById('system-wide-button');
		cssClass = systemConnection.getAttribute('class');
		systemConnection.setAttribute('class', (cssClass === null ? '' : cssClass.replace(' active', '')) + ' active');
	}
  },

  /**
   * Deactivates all other buttons
   */
  deselectConnectionTypes_: function() {
	// deactivate all other items (proxies, connection types...)
	deactivateItems = document.querySelectorAll('#proxy-tab .active');
	for (var i = 0; i < deactivateItems.length; i++) {
		var cssClass = deactivateItems[i].getAttribute('class');
		deactivateItems[i].setAttribute('class', (cssClass === null ? '' : cssClass.replace(' active', '')));
	}
	// re-enable any disabled buttons
	disabledItems = document.querySelectorAll('#proxy-tab button');
	for (var i = 0; i < disabledItems.length; i++) {
		disabledItems[i].removeAttribute('disabled');
	}
	// close lists
	var lists = document.querySelectorAll('.proxy-locations.open');
	for (var i = 0; i < lists.length; i++) {
		lists[i].setAttribute('class', lists[i].getAttribute('class').replace(' open', ''));
	}
  },

  /**
   * Recalculates the `disabled` state of the form's input elements, based
   * on the currently active group, and that group's contents.
   *
   * @private
   */
  recalcDisabledInputs_: function() {
    var i, j;
    for (i = 0; i < this.configGroups_.length; i++) {
      var el = this.configGroups_[i];
      var inputs = el.querySelectorAll(
          "input:not([type='radio']), select, textarea");
// There are no selects or textareas in our form
      if (el.classList.contains('active')) {
        for (j = 0; j < inputs.length; j++) {
          inputs[j].removeAttribute('disabled');
        }
      } else {
        for (j = 0; j < inputs.length; j++) {
          inputs[j].setAttribute('disabled', 'disabled');
        }
      }
    }
  },


  /**
   * Handler called in response to click on form's submission button. Generates
   * the proxy configuration and passes it to `useCustomProxySettings`, or
   * handles errors in user input.
   *
   * Proxy errors (and the browser action's badge) are cleared upon setting new
   * values.
   *
   * @param {Event} e DOM event generated by the user's click.
   * @private
   */
  applyChanges_: function(e) {
    e.preventDefault();
    e.stopPropagation();

//    if (this.isIncognitoMode_())
      this.config_.incognito = this.generateProxyConfig_();
//    else
//      this.config_.regular = this.generateProxyConfig_();
      this.config_.regular = this.config_.incognito;

    chrome.proxy.settings.set(
        {value: this.config_.regular, scope: 'regular'},
	this.callbackForRegularSettings_.bind(this));
////	function() {});
/*
You do not have permission to access incognito preferences.
    chrome.proxy.settings.set(
        {value: this.config_.regular, scope: 'incognito_persistent'},
	function() {});
*/

//      ProxyFormController.setPersistedSettings(this.config_);
////      window.localStorage['proxyConfig'] = JSON.stringify(this.config_);
////      this.generateAlert_(chrome.i18n.getMessage('successfullySetProxy'));

	// Set alarm for proxy rotation
	var rotationInterval = JSON.parse(window.localStorage['rotationInterval']);
	if ((this.config_.regular.mode == 'fixed_servers' || this.config_.regular.mode == 'pac_script')
		 && rotationInterval > 0) {

		console.log('Resetting proxy rotation interval: ' + rotationInterval);

		/* Set alaram to repeat proxy rotation */
		// No need to clear the previous alarm since it will be replaced with the new one
		// chrome.alarms.clear("RotateProxyAlarm");
		chrome.alarms.create("RotateProxyAlarm", { delayInMinutes: rotationInterval, periodInMinutes: rotationInterval });
	} else {

		console.log('Clearing proxy rotation alarm');

		/* Clear alarm if rotation has been disabled) 
		or direct/system settings were selected */
		chrome.alarms.clear("RotateProxyAlarm");		
	}
/*
    chrome.proxy.settings.set(
        {value: this.config_.regular, scope: 'regular'},
        this.callbackForRegularSettings_.bind(this));
*/
    chrome.extension.sendRequest({type: 'clearError'});
  },

  /**
   * Called in response to setting a regular window's proxy settings: checks
   * for `lastError`, and then sets incognito settings (if they exist).
   *
   * @private
   */
  callbackForRegularSettings_: function() {
    if (chrome.runtime.lastError) {
      this.generateAlert_(chrome.i18n.getMessage('errorSettingRegularProxy'));
      return;
    }
/*
    if (this.config_.incognito) {

      chrome.proxy.settings.set(
          {value: this.config_.incognito, scope: 'incognito_persistent'},
          this.callbackForIncognitoSettings_.bind(this));

    } else {
*/

// We send web request immediately after the new proxy has been set
// This is done in order to avoid strange Chrome error
// when auth dialog pops up 
//
var xhr = new XMLHttpRequest();
//xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
xhr.open("GET", 'http://www.google.com/', true);
xhr.send();

      ProxyFormController.setPersistedSettings(this.config_);
      this.generateAlert_(chrome.i18n.getMessage('successfullySetProxy'));
//    }
  },

  /**
   * Called in response to setting an incognito window's proxy settings: checks
   * for `lastError` and sets a success message.
   *
   * @private
   */
  callbackForIncognitoSettings_: function() {
    if (chrome.runtime.lastError) {
      this.generateAlert_(chrome.i18n.getMessage('errorSettingIncognitoProxy'));
      return;
    }
    ProxyFormController.setPersistedSettings(this.config_);
    this.generateAlert_(
        chrome.i18n.getMessage('successfullySetProxy'));
  },

  /**
   * Generates an alert overlay inside the proxy's popup, then closes the popup
   * after a short delay.
   *
   * @param {string} msg The message to be displayed in the overlay.
   * @param {?boolean} close Should the window be closed?  Defaults to true.
   * @private
   */
  generateAlert_: function(msg, close) {
/*
    var success = document.createElement('div');
    success.classList.add('overlay');
    success.setAttribute('role', 'alert');
    success.textContent = msg;
    document.body.appendChild(success);

//Do something more interesting here

    setTimeout(function() { success.classList.add('visible'); }, 10);
*/
    setTimeout(function() {
      if (close === false) {
//        success.classList.remove('visible');
      } else 
        window.close();
    }, 500);
  },


  /**
   * Parses the proxy configuration form, and generates a ProxyConfig object
   * that can be passed to `useCustomProxyConfig`.
   *
   * @see http://code.google.com/chrome/extensions/trunk/proxy.html
   * @return {ProxyConfig} The proxy configuration represented by the form.
   * @private
   */
  generateProxyConfig_: function() {

    /* First one - Proxy tab itself, second - tab area, so we need third active element */
    var active = document.getElementsByClassName('active')[2];

    console.log('Generating proxy config for ' + active);

    switch (active.id) {
      case ProxyFormController.ProxyTypes.SYSTEM:
	// Erase manualProxyID from local storage
	window.localStorage.removeItem('manualProxyID');
        return {mode: 'system'};
      case ProxyFormController.ProxyTypes.DIRECT:
	// Erase manualProxyID from local storage
	window.localStorage.removeItem('manualProxyID');
        return {mode: 'direct'};
/*
      case ProxyFormController.ProxyTypes.PAC:
        var pacScriptURL = this.pacURL;
        var pacManual = this.manualPac;
        if (pacScriptURL)
          return {mode: 'pac_script',
                  pacScript: {url: pacScriptURL, mandatory: true}};
        else if (pacManual)
          return {mode: 'pac_script',
                  pacScript: {data: pacManual, mandatory: true}};
        else
          return {mode: 'auto_detect'};

      case ProxyFormController.ProxyTypes.FIXED:
        return {mode: 'fixed_servers'};
*/
      default: 

        var config = {mode: 'fixed_servers'};

// v0.1.3

        if (this.singleProxy) { // Sets the manual proxy ID variable

	var pacScriptURL='http://www.jumbroxy.com/pacs/' + window.localStorage['manualProxyID'];

	// check if the secure web proxy has been disabled
	if( (window.localStorage['secureWebProxy'] !== undefined) 
		&& !JSON.parse(window.localStorage['secureWebProxy'])) {
		pacScriptURL=pacScriptURL + '_nossl';
	} 

	pacScriptURL=pacScriptURL + '.pac';

	console.log('PAC URL ' + pacScriptURL);

        return {mode: 'pac_script',
                  pacScript: {url: pacScriptURL, mandatory: true}};
	}

//    console.log('singleProxy' + this.singleProxy);

//    console.log('bypass list' + this.bypassList);
/*
          config.rules = {
            singleProxy: this.httpProxy,
            bypassList: this.bypassList
          };
*/
        if (this.singleProxy) {
          config.rules = {
            singleProxy: this.singleProxy,
            bypassList: this.bypassList
          };
/*
        } else {
          config.rules = {
            proxyForHttp: this.httpProxy,
            proxyForHttps: this.httpsProxy,
            proxyForFtp: this.ftpProxy,
            fallbackProxy: this.fallbackProxy,
            bypassList: this.bypassList
          };
*/
        }
        return config;
    }
  },


  /**
   * Sets the proper display classes based on the "Use the same proxy server
   * for all protocols" checkbox. Expects to be called as an event handler
   * when that field is clicked.
   *
   * @param {Event} e The `click` event to respond to.
   * @private

  toggleSingleProxyConfig_: function(e) {
    var checkbox = e.target;
    if (checkbox.nodeName === 'INPUT' &&
        checkbox.getAttribute('type') === 'checkbox') {
      if (checkbox.checked)
        checkbox.parentNode.parentNode.classList.add('single');
      else
        checkbox.parentNode.parentNode.classList.remove('single');
    }
  },
   */

  /**
   * Returns the form's current incognito status.
   *
   * @return {boolean} True if the form is in incognito mode, false otherwise.
   * @private
   */
  isIncognitoMode_: function(e) {
//    return this.form_.parentNode.classList.contains('incognito');
    return false;
  },


  /**
   * Toggles the form's incognito mode. Saves the current state to an object
   * property for later use, clears the form, and toggles the appropriate state.
   *
   * @param {Event} e The `click` event to respond to.
   * @private
   */
  toggleIncognitoMode_: function(e) {
    var div = this.form_.parentNode;
    var button = document.getElementsByTagName('button')[0];

    // Cancel the button click.
    e.preventDefault();
    e.stopPropagation();

    // If we can't access Incognito settings, throw a message and return.
    if (!this.isAllowedIncognitoAccess_) {
      var msg = "I'm sorry, Dave, I'm afraid I can't do that. Give me access " +
                "to Incognito settings by checking the checkbox labeled " +
                "'Allow in Incognito mode', which is visible at " +
                "chrome://extensions.";
      this.generateAlert_(msg, false);
      return;
    }

    if (this.isIncognitoMode_()) {
      // In incognito mode, switching to cognito.
      this.config_.incognito = this.generateProxyConfig_();
      div.classList.remove('incognito');
      this.recalcFormValues_(this.config_.regular);
      button.innerText = 'Configure incognito window settings.';
    } else {
      // In cognito mode, switching to incognito.
      this.config_.regular = this.generateProxyConfig_();
      div.classList.add('incognito');
      this.recalcFormValues_(this.config_.incognito);
      button.innerText = 'Configure regular window settings.';
    }
  },


  /**
   * Sets the form's values based on a ProxyConfig.
   *
   * @param {!ProxyConfig} c The ProxyConfig object.
   * @private
   */
  recalcFormValues_: function(c) {

    console.log('Recalculating form values ' + c.mode);

    // Normalize `auto_detect`
/*
    if (c.mode === 'auto_detect')
      c.mode = 'pac_script';
*/

    // We need to activate a particular button here, based on the proxyConfig contents
    // {"regular":{"mode":"system"},"incognito":{"mode":"system"}}
    // Activate one of the buttons, based on `mode`.
    this.changeActive_(c.mode);

    // Populate the PAC script
/*
    if (c.pacScript) {
      if (c.pacScript.url)
        this.pacURL = c.pacScript.url;
    } else {
      this.pacURL = '';
    }
*/
this.pacURL = '';

    // Evaluate the `rules`
    if (c.rules) {
      var rules = c.rules;
      if (rules.singleProxy) {
        this.singleProxy = rules.singleProxy;
/*
      } else {
        this.singleProxy = null;
        this.httpProxy = rules.proxyForHttp;
        this.httpsProxy = rules.proxyForHttps;
        this.ftpProxy = rules.proxyForFtp;
        this.fallbackProxy = rules.fallbackProxy;
*/
      }
      this.bypassList = rules.bypassList;
    } else {
      this.singleProxy = null;
      this.httpProxy = null;
      this.httpsProxy = null;
      this.ftpProxy = null;
      this.fallbackProxy = null;
      this.bypassList = '';
    }
  },


  /**
   * Handles the case in which this extension doesn't have the ability to
   * control the Proxy settings, either because of an overriding policy
   * or an extension with higher priority.
   *
   * @param {ProxyFormController.LevelOfControl} l The level of control this
   *     extension has over the proxy settings.
   * @private
   */
  handleLackOfControl_: function(l) {
    var msg;
    if (l === ProxyFormController.LevelOfControl.NO_ACCESS)
      msg = chrome.i18n.getMessage('errorNoExtensionAccess');
    else if (l === ProxyFormController.LevelOfControl.OTHER_EXTENSION)
      msg = chrome.i18n.getMessage('errorOtherExtensionControls');
    this.generateAlert_(msg);
  },


  /**
   * Handle the case in which errors have been generated outside the context
   * of this popup.
   *
   * @private
   */
  handleProxyErrors_: function() {
    chrome.extension.sendRequest(
        {type: 'getError'},
        this.handleProxyErrorHandlerResponse_.bind(this));
  },

  /**
   * Handles response from ProxyErrorHandler
   *
   * @param {{result: !string}} response The message sent in response to this
   *     popup's request.
   */
  handleProxyErrorHandlerResponse_: function(response) {
    if (response.result !== null) {
      var error = JSON.parse(response.result);
      console.error(error);
      // TODO(mkwst): Do something more interesting
      this.generateAlert_(
          chrome.i18n.getMessage(
              error.details ? 'errorProxyDetailedError' : 'errorProxyError',
              [error.error, error.details]),
          false);
    }
  }
};
