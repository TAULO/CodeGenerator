// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This file was generated by:
//   tools/json_schema_compiler/compiler.py.
// NOTE: The format of types has changed. 'FooType' is now
//   'chrome.developerPrivate.FooType'.
// Please run the closure compiler before committing changes.
// See https://chromium.googlesource.com/chromium/src/+/master/docs/closure_compilation.md

/** @fileoverview Externs generated from namespace: developerPrivate */

/** @const */
chrome.developerPrivate = {};

/**
 * @enum {string}
 */
chrome.developerPrivate.ItemType = {
  HOSTED_APP: 'hosted_app',
  PACKAGED_APP: 'packaged_app',
  LEGACY_PACKAGED_APP: 'legacy_packaged_app',
  EXTENSION: 'extension',
  THEME: 'theme',
};

/**
 * @typedef {{
 *   path: string,
 *   render_process_id: number,
 *   render_view_id: number,
 *   incognito: boolean,
 *   generatedBackgroundPage: boolean
 * }}
 */
chrome.developerPrivate.ItemInspectView;

/**
 * @typedef {{
 *   extension_id: string,
 *   render_process_id: (string|number),
 *   render_view_id: (string|number),
 *   incognito: boolean
 * }}
 */
chrome.developerPrivate.InspectOptions;

/**
 * @typedef {{
 *   message: string
 * }}
 */
chrome.developerPrivate.InstallWarning;

/**
 * @enum {string}
 */
chrome.developerPrivate.ExtensionType = {
  HOSTED_APP: 'HOSTED_APP',
  PLATFORM_APP: 'PLATFORM_APP',
  LEGACY_PACKAGED_APP: 'LEGACY_PACKAGED_APP',
  EXTENSION: 'EXTENSION',
  THEME: 'THEME',
  SHARED_MODULE: 'SHARED_MODULE',
};

/**
 * @enum {string}
 */
chrome.developerPrivate.Location = {
  FROM_STORE: 'FROM_STORE',
  UNPACKED: 'UNPACKED',
  THIRD_PARTY: 'THIRD_PARTY',
  UNKNOWN: 'UNKNOWN',
};

/**
 * @enum {string}
 */
chrome.developerPrivate.ViewType = {
  APP_WINDOW: 'APP_WINDOW',
  BACKGROUND_CONTENTS: 'BACKGROUND_CONTENTS',
  COMPONENT: 'COMPONENT',
  EXTENSION_BACKGROUND_PAGE: 'EXTENSION_BACKGROUND_PAGE',
  EXTENSION_DIALOG: 'EXTENSION_DIALOG',
  EXTENSION_GUEST: 'EXTENSION_GUEST',
  EXTENSION_POPUP: 'EXTENSION_POPUP',
  TAB_CONTENTS: 'TAB_CONTENTS',
};

/**
 * @enum {string}
 */
chrome.developerPrivate.ErrorType = {
  MANIFEST: 'MANIFEST',
  RUNTIME: 'RUNTIME',
};

/**
 * @enum {string}
 */
chrome.developerPrivate.ErrorLevel = {
  LOG: 'LOG',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

/**
 * @enum {string}
 */
chrome.developerPrivate.ExtensionState = {
  ENABLED: 'ENABLED',
  DISABLED: 'DISABLED',
  TERMINATED: 'TERMINATED',
  BLACKLISTED: 'BLACKLISTED',
};

/**
 * @enum {string}
 */
chrome.developerPrivate.CommandScope = {
  GLOBAL: 'GLOBAL',
  CHROME: 'CHROME',
};

/**
 * @typedef {{
 *   isEnabled: boolean,
 *   isActive: boolean
 * }}
 */
chrome.developerPrivate.AccessModifier;

/**
 * @typedef {{
 *   lineNumber: number,
 *   columnNumber: number,
 *   url: string,
 *   functionName: string
 * }}
 */
chrome.developerPrivate.StackFrame;

/**
 * @typedef {{
 *   type: !chrome.developerPrivate.ErrorType,
 *   extensionId: string,
 *   fromIncognito: boolean,
 *   source: string,
 *   message: string,
 *   id: number,
 *   manifestKey: string,
 *   manifestSpecific: (string|undefined)
 * }}
 */
chrome.developerPrivate.ManifestError;

/**
 * @typedef {{
 *   type: !chrome.developerPrivate.ErrorType,
 *   extensionId: string,
 *   fromIncognito: boolean,
 *   source: string,
 *   message: string,
 *   id: number,
 *   severity: !chrome.developerPrivate.ErrorLevel,
 *   contextUrl: string,
 *   occurrences: number,
 *   renderViewId: number,
 *   renderProcessId: number,
 *   canInspect: boolean,
 *   stackTrace: !Array<!chrome.developerPrivate.StackFrame>
 * }}
 */
chrome.developerPrivate.RuntimeError;

/**
 * @typedef {{
 *   suspiciousInstall: boolean,
 *   corruptInstall: boolean,
 *   updateRequired: boolean,
 *   blockedByPolicy: boolean,
 *   custodianApprovalRequired: boolean,
 *   parentDisabledPermissions: boolean
 * }}
 */
chrome.developerPrivate.DisableReasons;

/**
 * @typedef {{
 *   openInTab: boolean,
 *   url: string
 * }}
 */
chrome.developerPrivate.OptionsPage;

/**
 * @typedef {{
 *   url: string,
 *   specified: boolean
 * }}
 */
chrome.developerPrivate.HomePage;

/**
 * @typedef {{
 *   url: string,
 *   renderProcessId: number,
 *   renderViewId: number,
 *   incognito: boolean,
 *   isIframe: boolean,
 *   type: !chrome.developerPrivate.ViewType
 * }}
 */
chrome.developerPrivate.ExtensionView;

/**
 * @enum {string}
 */
chrome.developerPrivate.ControllerType = {
  POLICY: 'POLICY',
};

/**
 * @enum {string}
 */
chrome.developerPrivate.HostAccess = {
  ON_CLICK: 'ON_CLICK',
  ON_SPECIFIC_SITES: 'ON_SPECIFIC_SITES',
  ON_ALL_SITES: 'ON_ALL_SITES',
};

/**
 * @typedef {{
 *   type: !chrome.developerPrivate.ControllerType,
 *   text: string
 * }}
 */
chrome.developerPrivate.ControlledInfo;

/**
 * @typedef {{
 *   description: string,
 *   keybinding: string,
 *   name: string,
 *   isActive: boolean,
 *   scope: !chrome.developerPrivate.CommandScope,
 *   isExtensionAction: boolean
 * }}
 */
chrome.developerPrivate.Command;

/**
 * @typedef {{
 *   id: string,
 *   name: string
 * }}
 */
chrome.developerPrivate.DependentExtension;

/**
 * @typedef {{
 *   message: string,
 *   submessages: !Array<string>
 * }}
 */
chrome.developerPrivate.Permission;

/**
 * @typedef {{
 *   host: string,
 *   granted: boolean
 * }}
 */
chrome.developerPrivate.SiteControl;

/**
 * @typedef {{
 *   hasAllHosts: boolean,
 *   hostAccess: !chrome.developerPrivate.HostAccess,
 *   hosts: !Array<!chrome.developerPrivate.SiteControl>
 * }}
 */
chrome.developerPrivate.RuntimeHostPermissions;

/**
 * @typedef {{
 *   simplePermissions: !Array<!chrome.developerPrivate.Permission>,
 *   runtimeHostPermissions: (!chrome.developerPrivate.RuntimeHostPermissions|undefined)
 * }}
 */
chrome.developerPrivate.Permissions;

/**
 * @typedef {{
 *   blacklistText: (string|undefined),
 *   commands: !Array<!chrome.developerPrivate.Command>,
 *   controlledInfo: (!chrome.developerPrivate.ControlledInfo|undefined),
 *   dependentExtensions: !Array<!chrome.developerPrivate.DependentExtension>,
 *   description: string,
 *   disableReasons: !chrome.developerPrivate.DisableReasons,
 *   errorCollection: !chrome.developerPrivate.AccessModifier,
 *   fileAccess: !chrome.developerPrivate.AccessModifier,
 *   homePage: !chrome.developerPrivate.HomePage,
 *   iconUrl: string,
 *   id: string,
 *   incognitoAccess: !chrome.developerPrivate.AccessModifier,
 *   installWarnings: !Array<string>,
 *   launchUrl: (string|undefined),
 *   location: !chrome.developerPrivate.Location,
 *   locationText: (string|undefined),
 *   manifestErrors: !Array<!chrome.developerPrivate.ManifestError>,
 *   manifestHomePageUrl: string,
 *   mustRemainInstalled: boolean,
 *   name: string,
 *   offlineEnabled: boolean,
 *   optionsPage: (!chrome.developerPrivate.OptionsPage|undefined),
 *   path: (string|undefined),
 *   permissions: !chrome.developerPrivate.Permissions,
 *   prettifiedPath: (string|undefined),
 *   runtimeErrors: !Array<!chrome.developerPrivate.RuntimeError>,
 *   runtimeWarnings: !Array<string>,
 *   state: !chrome.developerPrivate.ExtensionState,
 *   type: !chrome.developerPrivate.ExtensionType,
 *   updateUrl: string,
 *   userMayModify: boolean,
 *   version: string,
 *   views: !Array<!chrome.developerPrivate.ExtensionView>,
 *   webStoreUrl: string
 * }}
 */
chrome.developerPrivate.ExtensionInfo;

/**
 * @typedef {{
 *   canLoadUnpacked: boolean,
 *   inDeveloperMode: boolean,
 *   isDeveloperModeControlledByPolicy: boolean,
 *   isIncognitoAvailable: boolean,
 *   isSupervised: boolean
 * }}
 */
chrome.developerPrivate.ProfileInfo;

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   version: string,
 *   description: string,
 *   may_disable: boolean,
 *   enabled: boolean,
 *   isApp: boolean,
 *   type: !chrome.developerPrivate.ItemType,
 *   allow_activity: boolean,
 *   allow_file_access: boolean,
 *   wants_file_access: boolean,
 *   incognito_enabled: boolean,
 *   is_unpacked: boolean,
 *   allow_reload: boolean,
 *   terminated: boolean,
 *   allow_incognito: boolean,
 *   icon_url: string,
 *   path: (string|undefined),
 *   options_url: (string|undefined),
 *   app_launch_url: (string|undefined),
 *   homepage_url: (string|undefined),
 *   update_url: (string|undefined),
 *   install_warnings: !Array<!chrome.developerPrivate.InstallWarning>,
 *   manifest_errors: !Array<*>,
 *   runtime_errors: !Array<*>,
 *   offline_enabled: boolean,
 *   views: !Array<!chrome.developerPrivate.ItemInspectView>
 * }}
 */
chrome.developerPrivate.ItemInfo;

/**
 * @typedef {{
 *   includeDisabled: (boolean|undefined),
 *   includeTerminated: (boolean|undefined)
 * }}
 */
chrome.developerPrivate.GetExtensionsInfoOptions;

/**
 * @typedef {{
 *   extensionId: string,
 *   fileAccess: (boolean|undefined),
 *   incognitoAccess: (boolean|undefined),
 *   errorCollection: (boolean|undefined),
 *   hostAccess: (!chrome.developerPrivate.HostAccess|undefined)
 * }}
 */
chrome.developerPrivate.ExtensionConfigurationUpdate;

/**
 * @typedef {{
 *   inDeveloperMode: (boolean|undefined)
 * }}
 */
chrome.developerPrivate.ProfileConfigurationUpdate;

/**
 * @typedef {{
 *   extensionId: string,
 *   commandName: string,
 *   scope: (!chrome.developerPrivate.CommandScope|undefined),
 *   keybinding: (string|undefined)
 * }}
 */
chrome.developerPrivate.ExtensionCommandUpdate;

/**
 * @typedef {{
 *   failQuietly: (boolean|undefined),
 *   populateErrorForUnpacked: (boolean|undefined)
 * }}
 */
chrome.developerPrivate.ReloadOptions;

/**
 * @typedef {{
 *   failQuietly: (boolean|undefined),
 *   populateError: (boolean|undefined),
 *   retryGuid: (string|undefined),
 *   useDraggedPath: (boolean|undefined)
 * }}
 */
chrome.developerPrivate.LoadUnpackedOptions;

/**
 * @enum {string}
 */
chrome.developerPrivate.PackStatus = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
};

/**
 * @enum {string}
 */
chrome.developerPrivate.FileType = {
  LOAD: 'LOAD',
  PEM: 'PEM',
};

/**
 * @enum {string}
 */
chrome.developerPrivate.SelectType = {
  FILE: 'FILE',
  FOLDER: 'FOLDER',
};

/**
 * @enum {string}
 */
chrome.developerPrivate.EventType = {
  INSTALLED: 'INSTALLED',
  UNINSTALLED: 'UNINSTALLED',
  LOADED: 'LOADED',
  UNLOADED: 'UNLOADED',
  VIEW_REGISTERED: 'VIEW_REGISTERED',
  VIEW_UNREGISTERED: 'VIEW_UNREGISTERED',
  ERROR_ADDED: 'ERROR_ADDED',
  ERRORS_REMOVED: 'ERRORS_REMOVED',
  PREFS_CHANGED: 'PREFS_CHANGED',
  WARNINGS_CHANGED: 'WARNINGS_CHANGED',
  COMMAND_ADDED: 'COMMAND_ADDED',
  COMMAND_REMOVED: 'COMMAND_REMOVED',
  PERMISSIONS_CHANGED: 'PERMISSIONS_CHANGED',
};

/**
 * @typedef {{
 *   message: string,
 *   item_path: string,
 *   pem_path: string,
 *   override_flags: number,
 *   status: !chrome.developerPrivate.PackStatus
 * }}
 */
chrome.developerPrivate.PackDirectoryResponse;

/**
 * @typedef {{
 *   name: string
 * }}
 */
chrome.developerPrivate.ProjectInfo;

/**
 * @typedef {{
 *   event_type: !chrome.developerPrivate.EventType,
 *   item_id: string,
 *   extensionInfo: (!chrome.developerPrivate.ExtensionInfo|undefined)
 * }}
 */
chrome.developerPrivate.EventData;

/**
 * @typedef {{
 *   beforeHighlight: string,
 *   highlight: string,
 *   afterHighlight: string
 * }}
 */
chrome.developerPrivate.ErrorFileSource;

/**
 * @typedef {{
 *   error: string,
 *   path: string,
 *   source: (!chrome.developerPrivate.ErrorFileSource|undefined),
 *   retryGuid: string
 * }}
 */
chrome.developerPrivate.LoadError;

/**
 * @typedef {{
 *   extensionId: string,
 *   pathSuffix: string,
 *   message: string,
 *   manifestKey: (string|undefined),
 *   manifestSpecific: (string|undefined),
 *   lineNumber: (number|undefined)
 * }}
 */
chrome.developerPrivate.RequestFileSourceProperties;

/**
 * @typedef {{
 *   highlight: string,
 *   beforeHighlight: string,
 *   afterHighlight: string,
 *   title: string,
 *   message: string
 * }}
 */
chrome.developerPrivate.RequestFileSourceResponse;

/**
 * @typedef {{
 *   extensionId: (string|undefined),
 *   renderViewId: number,
 *   renderProcessId: number,
 *   incognito: (boolean|undefined),
 *   url: (string|undefined),
 *   lineNumber: (number|undefined),
 *   columnNumber: (number|undefined)
 * }}
 */
chrome.developerPrivate.OpenDevToolsProperties;

/**
 * @typedef {{
 *   extensionId: string,
 *   errorIds: (!Array<number>|undefined),
 *   type: (!chrome.developerPrivate.ErrorType|undefined)
 * }}
 */
chrome.developerPrivate.DeleteExtensionErrorsProperties;

/**
 * Runs auto update for extensions and apps immediately.
 * @param {function(): void=} callback Called after update check completes.
 */
chrome.developerPrivate.autoUpdate = function(callback) {};

/**
 * Returns information of all the extensions and apps installed.
 * @param {!chrome.developerPrivate.GetExtensionsInfoOptions=} options Options
 *     to restrict the items returned.
 * @param {function(!Array<!chrome.developerPrivate.ExtensionInfo>): void=}
 *     callback Called with extensions info.
 */
chrome.developerPrivate.getExtensionsInfo = function(options, callback) {};

/**
 * Returns information of a particular extension.
 * @param {string} id The id of the extension.
 * @param {function(!chrome.developerPrivate.ExtensionInfo): void=} callback
 *     Called with the result.
 */
chrome.developerPrivate.getExtensionInfo = function(id, callback) {};

/**
 * Returns the size of a particular extension on disk (already formatted).
 * @param {string} id The id of the extension.
 * @param {function(string): void} callback Called with the result.
 */
chrome.developerPrivate.getExtensionSize = function(id, callback) {};

/**
 * Returns information of all the extensions and apps installed.
 * @param {boolean} includeDisabled include disabled items.
 * @param {boolean} includeTerminated include terminated items.
 * @param {function(!Array<!chrome.developerPrivate.ItemInfo>): void} callback
 *     Called with items info.
 * @deprecated Use getExtensionsInfo
 */
chrome.developerPrivate.getItemsInfo = function(includeDisabled, includeTerminated, callback) {};

/**
 * Returns the current profile's configuration.
 * @param {function(!chrome.developerPrivate.ProfileInfo): void} callback
 */
chrome.developerPrivate.getProfileConfiguration = function(callback) {};

/**
 * Updates the active profile.
 * @param {!chrome.developerPrivate.ProfileConfigurationUpdate} update The
 *     parameters for updating the profile's configuration.  Any     properties
 *     omitted from |update| will not be changed.
 * @param {function(): void=} callback
 */
chrome.developerPrivate.updateProfileConfiguration = function(update, callback) {};

/**
 * Opens a permissions dialog.
 * @param {string} extensionId The id of the extension to show permissions for.
 * @param {function(): void=} callback
 */
chrome.developerPrivate.showPermissionsDialog = function(extensionId, callback) {};

/**
 * Reloads a given extension.
 * @param {string} extensionId The id of the extension to reload.
 * @param {!chrome.developerPrivate.ReloadOptions=} options Additional
 *     configuration parameters.
 * @param {function((!chrome.developerPrivate.LoadError|undefined)): void=}
 *     callback
 */
chrome.developerPrivate.reload = function(extensionId, options, callback) {};

/**
 * Modifies an extension's current configuration.
 * @param {!chrome.developerPrivate.ExtensionConfigurationUpdate} update The
 *     parameters for updating the extension's configuration.     Any properties
 *     omitted from |update| will not be changed.
 * @param {function(): void=} callback
 */
chrome.developerPrivate.updateExtensionConfiguration = function(update, callback) {};

/**
 * Loads a user-selected unpacked item.
 * @param {!chrome.developerPrivate.LoadUnpackedOptions=} options Additional
 *     configuration parameters.
 * @param {function((!chrome.developerPrivate.LoadError|undefined)): void=}
 *     callback
 */
chrome.developerPrivate.loadUnpacked = function(options, callback) {};

/**
 * Installs the file that was dragged and dropped onto the associated page.
 * @param {function(): void=} callback
 */
chrome.developerPrivate.installDroppedFile = function(callback) {};

/**
 * Notifies the browser that a user began a drag in order to install an
 * extension.
 */
chrome.developerPrivate.notifyDragInstallInProgress = function() {};

/**
 * Loads an extension / app.
 * @param {DirectoryEntry} directory The directory to load the extension from.
 * @param {function(string): void} callback
 */
chrome.developerPrivate.loadDirectory = function(directory, callback) {};

/**
 * Open Dialog to browse to an entry.
 * @param {!chrome.developerPrivate.SelectType} selectType Select a file or a
 *     folder.
 * @param {!chrome.developerPrivate.FileType} fileType Required file type. For
 *     example, pem type is for private key and load type is for an unpacked
 *     item.
 * @param {function(string): void} callback called with selected item's path.
 */
chrome.developerPrivate.choosePath = function(selectType, fileType, callback) {};

/**
 * Pack an extension.
 * @param {string} path
 * @param {string=} privateKeyPath The path of the private key, if one is given.
 * @param {number=} flags Special flags to apply to the loading process, if any.
 * @param {function(!chrome.developerPrivate.PackDirectoryResponse): void=}
 *     callback called with the success result string.
 */
chrome.developerPrivate.packDirectory = function(path, privateKeyPath, flags, callback) {};

/**
 * Returns true if the profile is managed.
 * @param {function(boolean): void} callback
 */
chrome.developerPrivate.isProfileManaged = function(callback) {};

/**
 * Reads and returns the contents of a file related to an extension which caused
 * an error.
 * @param {!chrome.developerPrivate.RequestFileSourceProperties} properties
 * @param {function(!chrome.developerPrivate.RequestFileSourceResponse): void}
 *     callback
 */
chrome.developerPrivate.requestFileSource = function(properties, callback) {};

/**
 * Open the developer tools to focus on a particular error.
 * @param {!chrome.developerPrivate.OpenDevToolsProperties} properties
 * @param {function(): void=} callback
 */
chrome.developerPrivate.openDevTools = function(properties, callback) {};

/**
 * Delete reported extension errors.
 * @param {!chrome.developerPrivate.DeleteExtensionErrorsProperties} properties
 *     The properties specifying the errors to remove.
 * @param {function(): void=} callback
 */
chrome.developerPrivate.deleteExtensionErrors = function(properties, callback) {};

/**
 * Repairs the extension specified.
 * @param {string} extensionId The id of the extension to repair.
 * @param {function(): void=} callback
 */
chrome.developerPrivate.repairExtension = function(extensionId, callback) {};

/**
 * Shows the options page for the extension specified.
 * @param {string} extensionId The id of the extension to show the options page
 *     for.
 * @param {function(): void=} callback
 */
chrome.developerPrivate.showOptions = function(extensionId, callback) {};

/**
 * Shows the path of the extension specified.
 * @param {string} extensionId The id of the extension to show the path for.
 * @param {function(): void=} callback
 */
chrome.developerPrivate.showPath = function(extensionId, callback) {};

/**
 * (Un)suspends global shortcut handling.
 * @param {boolean} isSuspended Whether or not shortcut handling should be
 *     suspended.
 * @param {function(): void=} callback
 */
chrome.developerPrivate.setShortcutHandlingSuspended = function(isSuspended, callback) {};

/**
 * Updates an extension command.
 * @param {!chrome.developerPrivate.ExtensionCommandUpdate} update The
 *     parameters for updating the extension command.
 * @param {function(): void=} callback
 */
chrome.developerPrivate.updateExtensionCommand = function(update, callback) {};

/**
 * Adds a new host permission to the extension. The extension will only have
 * access to the host if it is within the requested permissions.
 * @param {string} extensionId The id of the extension to modify.
 * @param {string} host The host to add.
 * @param {function(): void=} callback
 */
chrome.developerPrivate.addHostPermission = function(extensionId, host, callback) {};

/**
 * Removes a host permission from the extension. This should only be called with
 * a host that the extension has access to.
 * @param {string} extensionId The id of the extension to modify.
 * @param {string} host The host to remove.
 * @param {function(): void=} callback
 */
chrome.developerPrivate.removeHostPermission = function(extensionId, host, callback) {};

/**
 * @param {string} id
 * @param {boolean} enabled
 * @param {function(): void=} callback
 * @deprecated Use management.setEnabled
 */
chrome.developerPrivate.enable = function(id, enabled, callback) {};

/**
 * @param {string} extensionId
 * @param {boolean} allow
 * @param {function(): void=} callback
 * @deprecated Use updateExtensionConfiguration
 */
chrome.developerPrivate.allowIncognito = function(extensionId, allow, callback) {};

/**
 * @param {string} extensionId
 * @param {boolean} allow
 * @param {function(): void=} callback
 * @deprecated Use updateExtensionConfiguration
 */
chrome.developerPrivate.allowFileAccess = function(extensionId, allow, callback) {};

/**
 * @param {!chrome.developerPrivate.InspectOptions} options
 * @param {function(): void=} callback
 * @deprecated Use openDevTools
 */
chrome.developerPrivate.inspect = function(options, callback) {};

/**
 * Fired when a item state is changed.
 * @type {!ChromeEvent}
 */
chrome.developerPrivate.onItemStateChanged;

/**
 * Fired when the profile's state has changed.
 * @type {!ChromeEvent}
 */
chrome.developerPrivate.onProfileStateChanged;
