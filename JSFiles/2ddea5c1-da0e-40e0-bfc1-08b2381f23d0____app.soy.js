// This file was automatically generated from dialog.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ui.dialog.
 */

if (typeof ui == 'undefined') { var ui = {}; }
if (typeof ui.dialog == 'undefined') { ui.dialog = {}; }


/**
 * @param {{
 *    settings: (?)
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.dialog.html = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(ui.navbar.html(null, null, opt_ijData) + ui.extensions.html(null, null, opt_ijData) + ui.footer.html(null, null, opt_ijData) + ui.settings.html(opt_data.settings, null, opt_ijData) + ui.dropzone.html(null, null, opt_ijData));
};
if (goog.DEBUG) {
  ui.dialog.html.soyTemplateName = 'ui.dialog.html';
}

// This file was automatically generated from dropzone.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ui.dropzone.
 */

if (typeof ui == 'undefined') { var ui = {}; }
if (typeof ui.dropzone == 'undefined') { ui.dropzone = {}; }


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.dropzone.html = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="su-dropzone"><p>Drag & drop to install extensions</p></div>');
};
if (goog.DEBUG) {
  ui.dropzone.html.soyTemplateName = 'ui.dropzone.html';
}

// This file was automatically generated from extension.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ui.extension.
 */

if (typeof ui == 'undefined') { var ui = {}; }
if (typeof ui.extension == 'undefined') { ui.extension = {}; }


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.html = function(opt_data, opt_ignored, opt_ijData) {
  var output = '';
  var signedClass__soy17 = '' + ('' + ui.extension.signedStatusClass(opt_data, null, opt_ijData));
  signedClass__soy17 = soydata.$$markUnsanitizedTextForInternalBlocks(signedClass__soy17);
  var thumbnailUrl__soy20 = '' + ('' + ui.extension.thumbnailUrl(opt_data, null, opt_ijData));
  thumbnailUrl__soy20 = soydata.$$markUnsanitizedTextForInternalBlocks(thumbnailUrl__soy20);
  output += '<div class="em-extension"><div class="row em-extension-header"><div class="col-xs-1 text-center glyph-toggle"><img src="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(thumbnailUrl__soy20)) + '" class="su-thumb-icon extension-thumbnail" alt="" width="32" height="32"><span class="glyphicon glyphicon-ok su-thumb-selected" aria-hidden="true"></span></div><div class="col-xs-5"><div class="extension-name">' + soy.$$escapeHtml(opt_data.name) + '</div><div class="text-muted"><small><em class="extension-signed">' + ui.extension.signedStatus(opt_data, null, opt_ijData) + '</em></small></div></div><div class="col-xs-2 extension-creator">' + soy.$$escapeHtml(opt_data.creator) + '</div><div class="col-xs-3 text-right extension-commands no-select"><div class="extension-enable"><div class="if-trusted"><input type="checkbox" ' + ((opt_data.loaded) ? 'checked="checked"' : '') + 'data-toggle="toggle" data-on="Enabled" data-off="Disabled" data-size="small" data-onstyle="primary" data-offstyle="default" data-width="90" ></div><div class="if-not-trusted">' + ui.extension.trustButton(null, null, opt_ijData) + '</div><div class="if-blocked">' + ui.extension.blockedButton(null, null, opt_ijData) + '</div></div><div class="extension-manage row"><div class="col-xs-6"><button class="btn btn-sm btn-primary cmd-update-extension"' + ((! opt_data.update_available) ? 'disabled="disabled"' : '') + '>Update</button></div><div class="col-xs-6"><button class="btn btn-sm btn-primary cmd-uninstall-extension"' + ((! opt_data.can_uninstall) ? 'disabled="disabled"' : '') + '>Uninstall</button></div></div></div><div class="col-xs-1 text-center glyph-toggle details-toggle no-select"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></div></div><!-- .row .em-extension-header --><div class="row extension-error-bag"></div><div class="row em-extension-body no-select"><div class="col-xs-1 text-right"><img src="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(thumbnailUrl__soy20)) + '" alt="" width="60" height="60" class="img-thumbnail extension-thumbnail"></div><div class="col-xs-6"><div class="row"><div class="col-xs-3">Version:</div><div class="col-xs-9 extension-version">' + soy.$$escapeHtml(opt_data.version) + '</div></div><div class="row"><div class="col-xs-3">Author:</div><div class="col-xs-9 extension-creator">' + soy.$$escapeHtml(opt_data.creator) + '</div></div><div class="row"><div class="col-xs-3">Copyright:</div><div class="col-xs-9 extension-copyright">' + soy.$$escapeHtml(opt_data.copyright) + '</div></div><div class="row em-extension-description"><div class="col-xs-3">Description:</div><div class="col-xs-9 extension-description">' + soy.$$escapeHtml(opt_data.description) + '</div></div></div><div class="col-xs-5"><div class="row extension-signature-badge"><div class="col-xs-12">Signature Information:</div><div class="col-xs-12"><p class="su-alert ' + soy.$$escapeHtmlAttribute(signedClass__soy17) + ' extension-signed text-center" role="alert">' + ui.extension.signedStatus(opt_data, null, opt_ijData) + '</p></div><div class="col-xs-12 text-right extension-signature-help"><a href="http://help.sketchup.com/" class="su-url su-url-external" data-su-url="help_extension_security">Visit the SketchUp Help Center to learn more</a> <img src="images/dlg_help.svg" class="su-help-icon" alt="" width="24" height="24"></div></div><!-- TODO(thomthom): Hide this until we have a way to get this info --><!--<div class="row extension-signature-info"><div class="col-xs-5">Developer ID:</div><div class="col-xs-7 extension-signature-creator">' + soy.$$escapeHtmlRcdata(opt_data.creator) + '</div></div><div class="row extension-signature-info"><div class="col-xs-5">Developer Page:</div><div class="col-xs-7 extension-signature-page">www.example.com</div></div><div class="row extension-signature-info"><div class="col-xs-5">Signature Date:</div><div class="col-xs-7 extension-signature-date">April 1, 2016</div></div>-->' + ((opt_data.license) ? ui.extension.licenseInfo({state: opt_data.license.state, days_remaining: opt_data.license.days_remaining}, null, opt_ijData) : '') + '</div></div><!-- .row .em-extension-body --></div>';
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  ui.extension.html.soyTemplateName = 'ui.extension.html';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.licenseInfo = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="row extension-license"><div class="col-xs-5">' + ui.extension.licenseStateTitle(opt_data, null, opt_ijData) + '</div><div class="col-xs-7">' + ((opt_data.days_remaining > 0) ? soy.$$escapeHtml(opt_data.days_remaining) + ' days remaining' : '') + '</div><div class="col-sm-offset-5 col-xs-7"><button class="btn btn-block btn-danger cmd-update-license">Update License</button></div></div>');
};
if (goog.DEBUG) {
  ui.extension.licenseInfo.soyTemplateName = 'ui.extension.licenseInfo';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.licenseStateTitle = function(opt_data, opt_ignored, opt_ijData) {
  var output = '';
  switch (opt_data.state) {
    case 0:
      output += 'Licensed:';
      break;
    case 1:
      output += '<span class="text-danger">License Expired:</span>';
      break;
    case 2:
      output += 'Trial License:';
      break;
    case 3:
      output += '<span class="text-danger">Trial License Expired:</span>';
      break;
    case 4:
      output += '<span class="text-danger">License Missing:</span>';
      break;
  }
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  ui.extension.licenseStateTitle.soyTemplateName = 'ui.extension.licenseStateTitle';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.signedStatus = function(opt_data, opt_ignored, opt_ijData) {
  var output = '';
  switch (opt_data.signed) {
    case 0:
      output += 'Signed';
      break;
    case 1:
      output += ui.extension.signatureWarningGlyph(null, null, opt_ijData) + 'Unsigned';
      break;
    case 2:
      output += ui.extension.signatureWarningGlyph(null, null, opt_ijData) + 'Invalid Signature';
      break;
    case 3:
      output += ui.extension.signatureWarningGlyph(null, null, opt_ijData) + 'Outdated Signature';
      break;
  }
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  ui.extension.signedStatus.soyTemplateName = 'ui.extension.signedStatus';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.signatureWarningGlyph = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<span class="signature-warning"><span class="glyphicon glyphicon-alert" aria-hidden="true"></span></span>');
};
if (goog.DEBUG) {
  ui.extension.signatureWarningGlyph.soyTemplateName = 'ui.extension.signatureWarningGlyph';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.signedStatusClass = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((opt_data.signed == 0) ? 'su-alert-success' : 'su-alert-danger');
};
if (goog.DEBUG) {
  ui.extension.signedStatusClass.soyTemplateName = 'ui.extension.signedStatusClass';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.thumbnailUrl = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((opt_data.thumbnail_url) ? soy.$$escapeHtml(opt_data.thumbnail_url) : 'images/extension_default_icon.svg');
};
if (goog.DEBUG) {
  ui.extension.thumbnailUrl.soyTemplateName = 'ui.extension.thumbnailUrl';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.trustButton = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<button class="btn btn-sm btn-warning cmd-trust-extension">Trust?</button>');
};
if (goog.DEBUG) {
  ui.extension.trustButton.soyTemplateName = 'ui.extension.trustButton';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.blockedButton = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<button class="btn btn-sm btn-danger" disabled>Blocked</button>');
};
if (goog.DEBUG) {
  ui.extension.blockedButton.soyTemplateName = 'ui.extension.blockedButton';
}

// This file was automatically generated from extension_errors.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ui.extension.error.
 */

if (typeof ui == 'undefined') { var ui = {}; }
if (typeof ui.extension == 'undefined') { ui.extension = {}; }
if (typeof ui.extension.error == 'undefined') { ui.extension.error = {}; }


/**
 * @param {{
 *    type: string,
 *    details: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.html = function(opt_data, opt_ignored, opt_ijData) {
  goog.asserts.assert(goog.isString(opt_data.type) || (opt_data.type instanceof goog.soy.data.SanitizedContent), "expected param 'type' of type string|goog.soy.data.SanitizedContent.");
  var type = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.type);
  goog.asserts.assert(goog.isString(opt_data.details) || (opt_data.details instanceof goog.soy.data.SanitizedContent), "expected param 'details' of type string|goog.soy.data.SanitizedContent.");
  var details = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.details);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="extension-error-item"><span class="glyphicon glyphicon-alert pull-left" aria-hidden="true"></span><span class="extension-error-message">' + soy.$$escapeHtml(type) + ' ' + soy.$$escapeHtml(details) + '</span></div>');
};
if (goog.DEBUG) {
  ui.extension.error.html.soyTemplateName = 'ui.extension.error.html';
}


/**
 * @param {{
 *    extensionName: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.failedInstall = function(opt_data, opt_ignored, opt_ijData) {
  goog.asserts.assert(goog.isString(opt_data.extensionName) || (opt_data.extensionName instanceof goog.soy.data.SanitizedContent), "expected param 'extensionName' of type string|goog.soy.data.SanitizedContent.");
  var extensionName = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.extensionName);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('Failed to install ' + soy.$$escapeHtml(extensionName) + '.');
};
if (goog.DEBUG) {
  ui.extension.error.failedInstall.soyTemplateName = 'ui.extension.error.failedInstall';
}


/**
 * @param {{
 *    extensionName: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.failedUninstall = function(opt_data, opt_ignored, opt_ijData) {
  goog.asserts.assert(goog.isString(opt_data.extensionName) || (opt_data.extensionName instanceof goog.soy.data.SanitizedContent), "expected param 'extensionName' of type string|goog.soy.data.SanitizedContent.");
  var extensionName = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.extensionName);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('Failed to uninstall ' + soy.$$escapeHtml(extensionName) + '.');
};
if (goog.DEBUG) {
  ui.extension.error.failedUninstall.soyTemplateName = 'ui.extension.error.failedUninstall';
}


/**
 * @param {{
 *    extensionName: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.failedUpdate = function(opt_data, opt_ignored, opt_ijData) {
  goog.asserts.assert(goog.isString(opt_data.extensionName) || (opt_data.extensionName instanceof goog.soy.data.SanitizedContent), "expected param 'extensionName' of type string|goog.soy.data.SanitizedContent.");
  var extensionName = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.extensionName);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('Failed to update ' + soy.$$escapeHtml(extensionName) + '.');
};
if (goog.DEBUG) {
  ui.extension.error.failedUpdate.soyTemplateName = 'ui.extension.error.failedUpdate';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.failedRemoveLicense = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('Unable to remove license.');
};
if (goog.DEBUG) {
  ui.extension.error.failedRemoveLicense.soyTemplateName = 'ui.extension.error.failedRemoveLicense';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.failedRemoveFiles = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('Unable to remove extension files.');
};
if (goog.DEBUG) {
  ui.extension.error.failedRemoveFiles.soyTemplateName = 'ui.extension.error.failedRemoveFiles';
}


/**
 * @param {{
 *    filetype: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.failedNoArchiveHandler = function(opt_data, opt_ignored, opt_ijData) {
  goog.asserts.assert(goog.isString(opt_data.filetype) || (opt_data.filetype instanceof goog.soy.data.SanitizedContent), "expected param 'filetype' of type string|goog.soy.data.SanitizedContent.");
  var filetype = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.filetype);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('Unable to handle ' + soy.$$escapeHtml(filetype) + ' files.');
};
if (goog.DEBUG) {
  ui.extension.error.failedNoArchiveHandler.soyTemplateName = 'ui.extension.error.failedNoArchiveHandler';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.failedWriteAccess = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('Missing file permission to modify extension files.');
};
if (goog.DEBUG) {
  ui.extension.error.failedWriteAccess.soyTemplateName = 'ui.extension.error.failedWriteAccess';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.failedDownload = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('Unable to complete download.');
};
if (goog.DEBUG) {
  ui.extension.error.failedDownload.soyTemplateName = 'ui.extension.error.failedDownload';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.failedUpdateLicense = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('Unable to update license.');
};
if (goog.DEBUG) {
  ui.extension.error.failedUpdateLicense.soyTemplateName = 'ui.extension.error.failedUpdateLicense';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.failedUpdateVersionId = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('Unable to update the extension id.');
};
if (goog.DEBUG) {
  ui.extension.error.failedUpdateVersionId.soyTemplateName = 'ui.extension.error.failedUpdateVersionId';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.failedArchiveRead = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('Unable to read extension archive.');
};
if (goog.DEBUG) {
  ui.extension.error.failedArchiveRead.soyTemplateName = 'ui.extension.error.failedArchiveRead';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.licenseErrorTitle = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('Failed to obtain active license for ' + soy.$$escapeHtml(opt_data.extensionName) + '.');
};
if (goog.DEBUG) {
  ui.extension.error.licenseErrorTitle.soyTemplateName = 'ui.extension.error.licenseErrorTitle';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extension.error.licenseErrorDescription = function(opt_data, opt_ignored, opt_ijData) {
  var output = '';
  switch (opt_data.state) {
    case 1:
      output += 'License expired.';
      break;
    case 3:
      output += 'Trial license expired.';
      break;
    case 4:
      output += 'License missing.';
      break;
  }
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  ui.extension.error.licenseErrorDescription.soyTemplateName = 'ui.extension.error.licenseErrorDescription';
}

// This file was automatically generated from extensions.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ui.extensions.
 */

if (typeof ui == 'undefined') { var ui = {}; }
if (typeof ui.extensions == 'undefined') { ui.extensions = {}; }


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.extensions.html = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="container-flex page active" id="extensions"><div class="row em-header"><div class="col-xs-1 text-center"><a href="#" id="cmd-select-all" title=\'Select All\'><img src="images/icon_line_plugin_selectall_32.svg" alt="" width="24" height="24"></a><a href="#" id="cmd-select-none" title=\'Select None\'><img src="images/icon_line_plugin_deselectall_32.svg" alt="" width="24" height="24"></a></div><div class="col-xs-5"><span class="text">Extension Name</span><!-- TODO(thomthom): Hidden until we have user-configurable sorting.<span class="glyphicon glyphicon-triangle-bottom su-glyph-sort" aria-hidden="true"/>--></div><div class="col-xs-2">Author</div><div class="col-xs-3 em-header-commands row"><div class="extension-enable text-right"><a href="#" id="cmd-enable-bulk" title=\'Enable All\'>Enable</a>|<a href="#" id="cmd-disable-bulk" title=\'Disable All\'>Disable</a></div><div class="extension-manage row"><div class="col-xs-6 text-center"><a href="#" id="cmd-update-bulk" title=\'Update Selected\'>Update</a></div><div class="col-xs-6 text-center"><a href="#" id="cmd-uninstall-bulk" title=\'Uninstall Selected\'>Uninstall</a></div></div></div></div><div id="extension-list" class="extension-list"></div></div><!-- .container-flex -->');
};
if (goog.DEBUG) {
  ui.extensions.html.soyTemplateName = 'ui.extensions.html';
}

// This file was automatically generated from footer.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ui.footer.
 */

if (typeof ui == 'undefined') { var ui = {}; }
if (typeof ui.footer == 'undefined') { ui.footer = {}; }


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.footer.html = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<footer class="footer"><div class="container-fluid"><div class="row"><div class="col-xs-6"><button class="btn btn-primary" id="cmd-install-extension">Install Extension</button></div><div class="col-xs-6 pull-right text-right"><div class="extension-enable"><button class="btn btn-default" id="cmd-discard">Discard Changes</button><button class="btn btn-primary" id="cmd-apply">Apply Changes</button></div></div></div></div></footer>');
};
if (goog.DEBUG) {
  ui.footer.html.soyTemplateName = 'ui.footer.html';
}

// This file was automatically generated from navbar.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ui.navbar.
 */

if (typeof ui == 'undefined') { var ui = {}; }
if (typeof ui.navbar == 'undefined') { ui.navbar = {}; }


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.navbar.html = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<nav class="navbar navbar-default navbar-fixed-top"><div class="container-fluid"><div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="#">Extension Manager</a></div><div id="navbar" class="collapse navbar-collapse"><ul class="nav navbar-nav su-tabs"><li id="tab-home" class="active"><a href="#home" data-page="extensions" data-page-mode="mode-home">Home</a></li><li id="tab-manage"><a href="#manage" data-page="extensions" data-page-mode="mode-manage">Manage<span class="badge badge-info"></span></a></li></ul><ul class="nav navbar-nav navbar-right"><li class="user-info">' + ui.navbar.user({nickname: '', logged_in: false}, null, opt_ijData) + '</li><li class="settings-icon"><a href="#settings" title="Settings" data-toggle="modal" data-target="#modal-settings"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span></a></li></ul></div><!--/.nav-collapse --></div></nav>');
};
if (goog.DEBUG) {
  ui.navbar.html.soyTemplateName = 'ui.navbar.html';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.navbar.user = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<a href="#user">' + ((opt_data.logged_in) ? soy.$$escapeHtml(opt_data.nickname) : 'Sign In') + ' <span class="glyphicon glyphicon-user" aria-hidden="true"></span></a>');
};
if (goog.DEBUG) {
  ui.navbar.user.soyTemplateName = 'ui.navbar.user';
}

// This file was automatically generated from prompt.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ui.prompt.
 */

if (typeof ui == 'undefined') { var ui = {}; }
if (typeof ui.prompt == 'undefined') { ui.prompt = {}; }


/**
 * @param {{
 *    title: string,
 *    message: string,
 *    footer: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.prompt.base = function(opt_data, opt_ignored, opt_ijData) {
  goog.asserts.assert(goog.isString(opt_data.title) || (opt_data.title instanceof goog.soy.data.SanitizedContent), "expected param 'title' of type string|goog.soy.data.SanitizedContent.");
  var title = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.title);
  goog.asserts.assert(goog.isString(opt_data.message) || (opt_data.message instanceof goog.soy.data.SanitizedContent), "expected param 'message' of type string|goog.soy.data.SanitizedContent.");
  var message = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.message);
  goog.asserts.assert(goog.isString(opt_data.footer) || (opt_data.footer instanceof goog.soy.data.SanitizedContent), "expected param 'footer' of type string|goog.soy.data.SanitizedContent.");
  var footer = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.footer);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="modal fade ui-prompt" tabindex="-1" role="dialog" aria-labelledby="modal-settings-title"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">' + soy.$$escapeHtml(title) + '</h4></div><div class="modal-body"><p>' + soy.$$escapeHtml(message) + '</p></div><div class="modal-footer">' + soy.$$escapeHtml(footer) + '</div></div></div></div>');
};
if (goog.DEBUG) {
  ui.prompt.base.soyTemplateName = 'ui.prompt.base';
}


/**
 * @param {{
 *    title: string,
 *    message: string,
 *    accept_title: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.prompt.baseAccept = function(opt_data, opt_ignored, opt_ijData) {
  goog.asserts.assert(goog.isString(opt_data.title) || (opt_data.title instanceof goog.soy.data.SanitizedContent), "expected param 'title' of type string|goog.soy.data.SanitizedContent.");
  var title = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.title);
  goog.asserts.assert(goog.isString(opt_data.message) || (opt_data.message instanceof goog.soy.data.SanitizedContent), "expected param 'message' of type string|goog.soy.data.SanitizedContent.");
  var message = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.message);
  goog.asserts.assert(goog.isString(opt_data.accept_title) || (opt_data.accept_title instanceof goog.soy.data.SanitizedContent), "expected param 'accept_title' of type string|goog.soy.data.SanitizedContent.");
  var accept_title = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.accept_title);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(ui.prompt.base({title: title, message: message, footer: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('<button type="button" class="btn btn-primary btn-accept" data-dismiss="modal">' + soy.$$escapeHtml(accept_title) + '</button>')}, null, opt_ijData));
};
if (goog.DEBUG) {
  ui.prompt.baseAccept.soyTemplateName = 'ui.prompt.baseAccept';
}


/**
 * @param {{
 *    title: string,
 *    message: string,
 *    accept_title: string,
 *    reject_title: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.prompt.baseAcceptDecline = function(opt_data, opt_ignored, opt_ijData) {
  goog.asserts.assert(goog.isString(opt_data.title) || (opt_data.title instanceof goog.soy.data.SanitizedContent), "expected param 'title' of type string|goog.soy.data.SanitizedContent.");
  var title = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.title);
  goog.asserts.assert(goog.isString(opt_data.message) || (opt_data.message instanceof goog.soy.data.SanitizedContent), "expected param 'message' of type string|goog.soy.data.SanitizedContent.");
  var message = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.message);
  goog.asserts.assert(goog.isString(opt_data.accept_title) || (opt_data.accept_title instanceof goog.soy.data.SanitizedContent), "expected param 'accept_title' of type string|goog.soy.data.SanitizedContent.");
  var accept_title = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.accept_title);
  goog.asserts.assert(goog.isString(opt_data.reject_title) || (opt_data.reject_title instanceof goog.soy.data.SanitizedContent), "expected param 'reject_title' of type string|goog.soy.data.SanitizedContent.");
  var reject_title = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.reject_title);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(ui.prompt.base({title: title, message: message, footer: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('<button type="button" class="btn btn-default btn-reject pull-left" data-dismiss="modal">' + soy.$$escapeHtml(reject_title) + '</button><button type="button" class="btn btn-primary btn-accept" data-dismiss="modal">' + soy.$$escapeHtml(accept_title) + '</button>')}, null, opt_ijData));
};
if (goog.DEBUG) {
  ui.prompt.baseAcceptDecline.soyTemplateName = 'ui.prompt.baseAcceptDecline';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.prompt.signInToUpdate = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(ui.prompt.baseAccept({title: soydata.$$markUnsanitizedTextForInternalBlocks('Sign in to update'), message: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('<p>You must be signed in to be able to update extensions.</p>'), accept_title: soydata.$$markUnsanitizedTextForInternalBlocks('Ok')}, null, opt_ijData));
};
if (goog.DEBUG) {
  ui.prompt.signInToUpdate.soyTemplateName = 'ui.prompt.signInToUpdate';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.prompt.signOut = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(ui.prompt.baseAcceptDecline({title: soydata.$$markUnsanitizedTextForInternalBlocks('Sign Out'), message: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('<p>Are you sure you would like to sign out of your account?</p>'), accept_title: soydata.$$markUnsanitizedTextForInternalBlocks('Sign Out'), reject_title: soydata.$$markUnsanitizedTextForInternalBlocks('Cancel')}, null, opt_ijData));
};
if (goog.DEBUG) {
  ui.prompt.signOut.soyTemplateName = 'ui.prompt.signOut';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.prompt.extensionErrors = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(ui.prompt.baseAccept({title: soydata.$$markUnsanitizedTextForInternalBlocks('Errors'), message: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('<p>Errors were encountered:</p><div class="extension-error-bag"></div>'), accept_title: soydata.$$markUnsanitizedTextForInternalBlocks('Ok')}, null, opt_ijData));
};
if (goog.DEBUG) {
  ui.prompt.extensionErrors.soyTemplateName = 'ui.prompt.extensionErrors';
}


/**
 * @param {{
 *    extensionName: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.prompt.trustExtension = function(opt_data, opt_ignored, opt_ijData) {
  goog.asserts.assert(goog.isString(opt_data.extensionName) || (opt_data.extensionName instanceof goog.soy.data.SanitizedContent), "expected param 'extensionName' of type string|goog.soy.data.SanitizedContent.");
  var extensionName = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.extensionName);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(ui.prompt.baseAcceptDecline({title: soydata.$$markUnsanitizedTextForInternalBlocks('Enable unsigned extension?'), message: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('<p>' + soy.$$escapeHtml(extensionName) + ' is not signed by the developer.<p><p>Are you sure you want to enable it?<p>'), accept_title: soydata.$$markUnsanitizedTextForInternalBlocks('Enable'), reject_title: soydata.$$markUnsanitizedTextForInternalBlocks('Cancel')}, null, opt_ijData));
};
if (goog.DEBUG) {
  ui.prompt.trustExtension.soyTemplateName = 'ui.prompt.trustExtension';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.prompt.installExtension = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(ui.prompt.baseAcceptDecline({title: soydata.$$markUnsanitizedTextForInternalBlocks('Confirm Extension Installation'), message: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('<p>This Extension will have the ability to access the filesystem on your computer. Do not grant access to this lightly; be sure you trust the author.</p><p>Do you want to install this Extension?</p>'), accept_title: soydata.$$markUnsanitizedTextForInternalBlocks('Install'), reject_title: soydata.$$markUnsanitizedTextForInternalBlocks('Cancel')}, null, opt_ijData));
};
if (goog.DEBUG) {
  ui.prompt.installExtension.soyTemplateName = 'ui.prompt.installExtension';
}


/**
 * @param {{
 *    extensionName: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.prompt.uninstallExtension = function(opt_data, opt_ignored, opt_ijData) {
  goog.asserts.assert(goog.isString(opt_data.extensionName) || (opt_data.extensionName instanceof goog.soy.data.SanitizedContent), "expected param 'extensionName' of type string|goog.soy.data.SanitizedContent.");
  var extensionName = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.extensionName);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(ui.prompt.baseAcceptDecline({title: soydata.$$markUnsanitizedTextForInternalBlocks('Uninstall extension?'), message: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('<p>This will remove ' + soy.$$escapeHtml(extensionName) + ' from the system.<p></p>Do you want to continue?</p>'), accept_title: soydata.$$markUnsanitizedTextForInternalBlocks('Uninstall'), reject_title: soydata.$$markUnsanitizedTextForInternalBlocks('Cancel')}, null, opt_ijData));
};
if (goog.DEBUG) {
  ui.prompt.uninstallExtension.soyTemplateName = 'ui.prompt.uninstallExtension';
}


/**
 * @param {{
 *    numExtensions: number
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.prompt.uninstallExtensions = function(opt_data, opt_ignored, opt_ijData) {
  var numExtensions = goog.asserts.assertNumber(opt_data.numExtensions, "expected parameter 'numExtensions' of type int.");
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(ui.prompt.baseAcceptDecline({title: soydata.$$markUnsanitizedTextForInternalBlocks('Uninstall ' + ('' + numExtensions) + '  extensions?'), message: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('<p>This will remove ' + soy.$$escapeHtml(numExtensions) + ' extensions from the system.<p></p>Do you want to continue?</p>'), accept_title: soydata.$$markUnsanitizedTextForInternalBlocks('Uninstall'), reject_title: soydata.$$markUnsanitizedTextForInternalBlocks('Cancel')}, null, opt_ijData));
};
if (goog.DEBUG) {
  ui.prompt.uninstallExtensions.soyTemplateName = 'ui.prompt.uninstallExtensions';
}


/**
 * @param {{
 *    numExtensions: number
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.prompt.updateExtensions = function(opt_data, opt_ignored, opt_ijData) {
  var numExtensions = goog.asserts.assertNumber(opt_data.numExtensions, "expected parameter 'numExtensions' of type int.");
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(ui.prompt.baseAcceptDecline({title: soydata.$$markUnsanitizedTextForInternalBlocks('Update ' + ('' + numExtensions) + ' extensions?'), message: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('<p>This will update ' + soy.$$escapeHtml(numExtensions) + ' extensions.</p><p>Do you want to continue?</p>'), accept_title: soydata.$$markUnsanitizedTextForInternalBlocks('Update'), reject_title: soydata.$$markUnsanitizedTextForInternalBlocks('Cancel')}, null, opt_ijData));
};
if (goog.DEBUG) {
  ui.prompt.updateExtensions.soyTemplateName = 'ui.prompt.updateExtensions';
}

// This file was automatically generated from settings.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ui.settings.
 */

if (typeof ui == 'undefined') { var ui = {}; }
if (typeof ui.settings == 'undefined') { ui.settings = {}; }


/**
 * @param {{
 *    security: (?)
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.settings.html = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="modal fade" id="modal-settings" tabindex="-1" role="dialog" aria-labelledby="modal-settings-title"><div class="modal-dialog modal-lg" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="modal-settings-title">Settings</h4></div><div class="modal-body">' + ui.settings.body(opt_data, null, opt_ijData) + '</div><div class="modal-footer"><button type="button" class="btn btn-primary btn-confirm" data-dismiss="modal">Confirm</button></div></div></div></div>');
};
if (goog.DEBUG) {
  ui.settings.html.soyTemplateName = 'ui.settings.html';
}


/**
 * @param {{
 *    security: (?)
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.settings.body = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="row"><div class="col-xs-3 text-right"><h4>Loading Policy:</h4></div><div class="col-xs-9 text-right"><a href="http://help.sketchup.com/" class="su-url su-url-external" data-su-url="help_extension_security"><img src="images/dlg_help.svg" class="su-help-icon" alt="" width="24" height="24"></a></div></div><div class="row" id="settings-security"><div class="col-xs-9 col-xs-offset-3">' + ui.settings.securityOptions(opt_data.security, null, opt_ijData) + '</div></div>');
};
if (goog.DEBUG) {
  ui.settings.body.soyTemplateName = 'ui.settings.body';
}


/**
 * @param {{
 *    mode_signed_only: number,
 *    mode_approve: number,
 *    mode_off: number
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.settings.securityOptions = function(opt_data, opt_ignored, opt_ijData) {
  var mode_signed_only = goog.asserts.assertNumber(opt_data.mode_signed_only, "expected parameter 'mode_signed_only' of type int.");
  var mode_approve = goog.asserts.assertNumber(opt_data.mode_approve, "expected parameter 'mode_approve' of type int.");
  var mode_off = goog.asserts.assertNumber(opt_data.mode_off, "expected parameter 'mode_off' of type int.");
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<ul class="su-option-list">' + ui.settings.securityItem({title: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('Identified Extensions Only'), description: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('Load extensions from identified developers only.'), value: mode_signed_only}, null, opt_ijData) + ui.settings.securityItem({title: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('Approve Unidentified Extensions'), description: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('Prompt before loading extensions from unidentified developers.'), value: mode_approve}, null, opt_ijData) + ui.settings.securityItem({title: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('Unrestricted'), description: soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks('Load extensions from unidentified developers without warning.'), value: mode_off}, null, opt_ijData) + '</ul>');
};
if (goog.DEBUG) {
  ui.settings.securityOptions.soyTemplateName = 'ui.settings.securityOptions';
}


/**
 * @param {{
 *    title: string,
 *    description: string,
 *    value: number
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
ui.settings.securityItem = function(opt_data, opt_ignored, opt_ijData) {
  goog.asserts.assert(goog.isString(opt_data.title) || (opt_data.title instanceof goog.soy.data.SanitizedContent), "expected param 'title' of type string|goog.soy.data.SanitizedContent.");
  var title = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.title);
  goog.asserts.assert(goog.isString(opt_data.description) || (opt_data.description instanceof goog.soy.data.SanitizedContent), "expected param 'description' of type string|goog.soy.data.SanitizedContent.");
  var description = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.description);
  var value = goog.asserts.assertNumber(opt_data.value, "expected parameter 'value' of type int.");
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<li class="su-collapsable"><div class="su-option-list-title"><label class="su-ui"><input type="radio" name="option-security-mode" value="' + soy.$$escapeHtmlAttribute(value) + '">' + soy.$$escapeHtml(title) + '<span class="su-collapse-btn text-center"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></span></label></div><div class="su-option-list-description su-collapse-target">' + soy.$$escapeHtml(description) + '</div></li>');
};
if (goog.DEBUG) {
  ui.settings.securityItem.soyTemplateName = 'ui.settings.securityItem';
}
