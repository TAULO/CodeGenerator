/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false */

(function (f, define) {
    'use strict';
    define([
        './window.assert',
        './window.logger',
        './kidoju.tools',
        './kidoju.image',
        './kidoju.dialogs',
        './kidoju.widgets.vectordrawing.toolbar', // For the image editor template
        './app.logger',
        './app.i18n',
        './app.rapi'
    ], f);
})(function () {

    'use strict';

    /**
     * IMPORTANT
     * Since AssetManager is a Kidoju widget, this could have been in kidoju.data.js
     * but kidoju.data.js has no idea of our S3 infrastructure or the way we store file uris using custom schemes
     *
     * Therefore preferably, this could have been in app.models.js
     * but the transport is dependant upon the tool (set by a component selection) and the summaryId (set by the page url)
     * when app.models is a wrapper for rapi calls which neither know the tool or the summaryId
     * Maybe this could be parameterized but then it would have to be feeded into the AssetManager.
     *
     * Note that app.assets is built by config.jsx and is a set of config options for asset collections
     * kidoju.assets are the actual assets to be used in kidoju.widgets.assetmanager
     */

    var app = window.app = window.app || {};

    /* This function has too many statements. */
    /* jshint -W071 */

    (function ($, undefined) {

        var kendo = window.kendo;
        var kidoju = window.kidoju;
        var i18n = app.i18n;
        var rapi = app.rapi;
        var assert = window.assert;
        var logger = new window.Logger('app.assets');
        var deepExtend = kendo.deepExtend;
        var STRING = 'string';
        var NUMBER = 'number';
        var OBJECT = 'object';
        var VERSION_HIDDEN_FIELD = 'input[type="hidden"][name="version"]';
        // var DATA_SCHEME = 'data://';
        var RX_DATA_URL = /^data:\/\/s\/([^\/]+)\/([^\/]+)\/([^\/]+)$/;
        var RX_MONGODB_ID = /^[a-f0-9]{24}$/;
        var RX_LANGUAGE = /^[a-z]{2}$/;
        var RX_URL = /^https?\:\/\//;

        // Ensure app.assets have been loaded from app.config.jsx
        assert.isPlainObject(app.assets, assert.format(assert.messages.isPlainObject.default, 'app.assets'));
        assert.isPlainObject(app.assets.audio, assert.format(assert.messages.isPlainObject.default, 'app.assets.audio'));
        assert.isPlainObject(app.assets.icon, assert.format(assert.messages.isPlainObject.default, 'app.assets.icon'));
        assert.isPlainObject(app.assets.image, assert.format(assert.messages.isPlainObject.default, 'app.assets.image'));
        assert.isPlainObject(app.assets.video, assert.format(assert.messages.isPlainObject.default, 'app.assets.video'));

        /**
         * Editor configurations
         * @type {{}}
         */
        var editors = {

            // audio: { /* TODO */ },

            image: {
                // Open kendo.dataviz.ui.VectorDrawing without New and Open tools
                template: '<div data-' + kendo.ns + 'role="vectordrawing" data-' + kendo.ns + 'bind="events: { command: onCommand, dialog: onDialog }" data-' + kendo.ns + 'toolbar="' +
                    kendo.htmlEncode(JSON.stringify({ resizable: true, tools: kendo.ui.VectorDrawingToolBar.fn.options.tools.slice(2) })) + '"></div>',
                maximize: true, // Maximize window when opening
                openImageDialog: function () {
                    assert.instanceof(kendo.dataviz.ui.VectorDrawing, this, assert.format(assert.messages.instanceof.default, 'this', 'kendo.dataviz.ui.VectorDrawing'));
                    var vectorDrawingWidget = this;
                    // We discard some tools to avoid nesting editors and asset managers indefinitely
                    var tools = kidoju.assets.image.collections[0].tools;
                    kidoju.assets.image.collections[0].tools = tools.filter(function (tool) {
                        return tool !== 'create' && tool !== 'edit';
                    });
                    // Show a nested asset manager dialog without creating and editing
                    kidoju.dialogs.showAssetManager(
                        kidoju.assets.image,
                        '', // We are not replacing an existing image but adding a new image, so the url is blank
                        { title: 'Insert image' }, // TODO i18n
                        // Event handler when clicking the OK button
                        function (e) {
                            // Restore assets tools
                            kidoju.assets.image.collections[0].tools = tools;
                            var url = e.sender.viewModel.get('url');
                            // Replace scheme
                            var schemes = kidoju.assets.image.schemes;
                            for (var scheme in kidoju.assets.image.schemes) {
                                url = url.replace(scheme + '://', schemes[scheme]);
                            }
                            // Import image into drawing
                            vectorDrawingWidget.import(url)
                                .fail(function (error) {
                                    if (app.notification && $.isFunction(app.notification.error)) {
                                        app.notification.error('Could not load image ' + url);  // TODO i18n
                                        logger.error({
                                            message: 'vectorDrawingWidget.import failed',
                                            method: 'editors.image.openImageDialog',
                                            data: { url: url },
                                            error: error
                                        });
                                    }
                                });
                        }
                    );
                },
                // Note: onCommand is defined in the viewModel set in _editSelected of kidoju.widgets.assetmanager and onCommand calls openUrl and saveAs
                openUrl: function (url) {
                    assert.instanceof(kendo.ui.Window, this, assert.format(assert.messages.instanceof.default, 'this', 'kendo.ui.Window'));
                    var vectorDrawingWidget = this.element.find(kendo.roleSelector('vectordrawing')).data('kendoVectorDrawing');
                    url = $('<a/>').attr('href', url).get(0).href; // Note: a simple way to resolve a relative url
                    return vectorDrawingWidget.open(url)
                        .fail(function (error) {
                            if (app.notification && $.isFunction(app.notification.error)) {
                                app.notification.error('Could not load image ' + url.split('/').pop());  // TODO i18n
                                logger.error({
                                    message: 'vectorDrawingWidget.open failed',
                                    method: 'editors.image.openUrl',
                                    data: { url: url },
                                    error: error
                                });
                            }
                        });
                },
                resize: function (e) {
                    assert.instanceof(kendo.ui.Window, this, assert.format(assert.messages.instanceof.default, 'this', 'kendo.ui.Window'));
                    var vectorDrawingWidget = this.element.find(kendo.roleSelector('vectordrawing')).data('kendoVectorDrawing');
                    var container = e.sender.element;
                    vectorDrawingWidget.element
                        .outerWidth(container.width())
                        .outerHeight(container.height());
                    vectorDrawingWidget.resize();
                },
                saveAs: function (name, assetManager) {
                    assert.instanceof(kendo.dataviz.ui.VectorDrawing, this, assert.format(assert.messages.instanceof.default, 'this', 'kendo.dataviz.ui.VectorDrawing'));
                    assert.type(STRING, name, assert.format(assert.messages.type.default, 'name', STRING));
                    assert.instanceof(kendo.ui.AssetManager, assetManager, assert.format(assert.messages.instanceof.default, 'assetManager', 'kendo.ui.AssetManager'));
                    var that = this;
                    var pos = name.lastIndexOf('.');
                    assert.ok(pos > 0, '`name` should have an extension');
                    var extension = name.substr(pos + 1).toLowerCase();
                    name = name.substr(0, pos);
                    var json = false;
                    if (extension.endsWith('+')) {
                        json = true;
                        extension = extension.slice(0, -1);
                    }
                    var exportFile = (extension === 'jpg' || extension === 'png') ? that.exportImage : that.exportSVG;
                    logger.debug({
                        message: 'Saving file',
                        method: 'editors.image.saveAs',
                        data: { name: name, ext: extension }
                    });
                    exportFile.bind(that)({ json: json }) // json: true only applies to exportSVG
                        .done(function (dataUri) {
                            // Important: dataUri is actually the result of getImageData for exportImage and it needs to be encoded to make a dataUri
                            // Beware any error here will be caught in the try/catch of kendo.drawing.canvas.Surface.prototype.getImageData defined in kidoju.widgets.vectordrawing.js
                            if (extension === 'jpg') {
                                // Default quality is 50 which is a bit low
                                dataUri = kidoju.image.jpegEncode(dataUri, 70);
                            } else if (extension === 'png') {
                                // We do our own encoding because canvas.toDataURL does no compression
                                dataUri = kidoju.image.pngEncode(dataUri);
                            }
                            var blob = kidoju.image.dataUri2Blob(dataUri);
                            blob.name = name + '.' + extension;
                            logger.debug({
                                message: 'exporFile successful',
                                method: 'editors.image.saveAs',
                                data: { name: name, ext: extension }
                            });
                            // Note: _uploadFile calls transport.upload which triggers notifications for success/error
                            assetManager._uploadFile(blob)
                                .done(function () {
                                    // Update source, so that save dialog will remember the name
                                    that._source = name + '.' + extension;
                                    // Also update the dialog title
                                    var windowWidget = that.element.closest(kendo.roleSelector('window')).data('kendoWindow');
                                    if (windowWidget instanceof kendo.ui.Window) {
                                        windowWidget.title(that._source);
                                    }
                                });
                        })
                        .fail(function (error) {
                            if (app.notification && $.isFunction(app.notification.error)) {
                                app.notification.error('Could not export ' + extension + ' file.');  // TODO i18n
                                logger.error({
                                    message: 'exportFile failed',
                                    method: 'editors.image.saveAs',
                                    data: { name: name, ext: extension },
                                    error: error
                                });
                            }
                        });
                }
            }

            // video: { /* TODO */ }

        };

        /**
         * DataSource options for custom collection types defined in config files, especially default.json
         * @type {{websearch: websearch, summary: summary, organisation: organisation}}
         */
        var collectionSources = {

            /**
             * Creates a web search collection for a search provider
             * @type audio, image, video
             * @param params including provider (google, bing, ...) and type (image, video, ... but not a complete mime type)
             * @returns {{}}
             */
            websearch: function (type, params) {
                assert.type(STRING, 'type', assert.format(assert.messages.type.default, 'type', STRING));
                assert.isPlainObject(params, assert.format(assert.messages.isPlainObject.default, 'params'));
                return deepExtend({
                    name: 'Google', // unfortunately i18n.culture is not yet available
                    pageSize: params.pageSize, // Google returns a maximum of 10 items
                    serverPaging: true,
                    serverFiltering: true,
                    transport: {

                        /**
                         * Read transport
                         * @param options
                         */
                        read: function (options) {
                            var qs = options.data;
                            // options.data.filter is built by the assetmanager search box
                            qs.q = (qs.filter && qs.filter.logic === 'and' && qs.filter.filters && qs.filter.filters[1] && qs.filter.filters[1].field === 'url' && qs.filter.filters[1].value) || '';
                            qs.type = params.searchType;
                            qs.language = i18n.locale();
                            qs.filter = undefined; // filter is replaced by q
                            app.rapi.web.search(params.provider, qs)
                                .done(options.success) // response items have mime, size and url
                                .fail(options.error);
                        }

                    }
                }, params);
            },

            /**
             * Creates an editable collection for a summary/project
             * @param type
             * @param params
             */
            summary: function (type, params) {
                assert.type(STRING, 'type', assert.format(assert.messages.type.default, 'type', STRING));
                assert.type(OBJECT, params, assert.format(assert.messages.type.default, 'params', OBJECT));
                return deepExtend({
                    name: 'Project', // TODO i18n.culture.assets.collections.summary, but i18n is not yet loaded
                    tools: ['upload', 'create', 'edit', 'destroy'],
                    editor: editors[type],
                    // pageSize: 12,
                    // serverPaging: false,
                    // serverFiltering: false,
                    transport: {

                        /**
                         * Create transport
                         * @param options
                         */
                        create: function (options) {
                            throw new Error('Use upload transport');
                        },

                        /**
                         * Destroy transport
                         * @param options
                         */
                        destroy: function (options) {
                            var locale = i18n.locale();
                            var params = JSON.parse($(VERSION_HIDDEN_FIELD).val());
                            var data = options.data;

                            assert.isPlainObject(data, assert.format(assert.messages.isPlainObject.default, 'data'));
                            assert.type(STRING, data.url, assert.format(assert.messages.type.default, 'data.url', STRING));
                            var matches = data.url.match(RX_DATA_URL);
                            assert.equal(4, matches.length, assert.format(assert.messages.equal.default, 'matches.length', 4));
                            assert.equal(locale, matches[1], assert.format(assert.messages.equal.default, 'matches[1]', locale));
                            assert.equal(params.summaryId, matches[2], assert.format(assert.messages.equal.default, 'matches[2]', params.summaryId));

                            // Delete file
                            rapi.v1.content.deleteFile(locale, params.summaryId, matches[3])
                                .done(function (response) {
                                    logger.debug({
                                        message: 'file deleted',
                                        method: 'summary.transport.destroy',
                                        data: deepExtend({ language: locale, summaryId: params.summaryId, url: data.url }, response)
                                    });
                                    options.success({ data: [data], total: 1 });
                                    assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                    app.notification.success(i18n.culture.editor.notifications.fileDeleteSuccess);
                                })
                                .fail(function (xhr, status, error) {
                                    logger.error({
                                        message: 'file deletion error',
                                        method: 'summary.transport.destroy',
                                        data: { status: status, error: error, reponse: xhr.responseText }
                                    });
                                    options.error(xhr, status, error);
                                    assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                    app.notification.error(i18n.culture.editor.notifications.fileDeleteFailure);
                                });
                        },

                        /**
                         * Read transport
                         * @param options
                         */
                        read: function (options) {
                            var locale = i18n.locale();
                            var params = JSON.parse($(VERSION_HIDDEN_FIELD).val());
                            assert.match(RX_LANGUAGE, locale, assert.format(assert.messages.match.default, 'locale', RX_LANGUAGE));
                            assert.match(RX_MONGODB_ID, params.summaryId, assert.format(assert.messages.match.default, params.summaryId, RX_MONGODB_ID));

                            // Get all project files
                            rapi.v1.content.getAllSummaryFiles(locale, params.summaryId).done(function (response) {
                                assert.isPlainObject(response, assert.format(assert.messages.isPlainObject.default, 'response'));
                                assert.isArray(response.data, assert.format(assert.messages.isArray.default, 'response.data'));
                                assert.type(NUMBER, response.total, assert.format(assert.messages.type.default, 'response.total', NUMBER));

                                // The asset manager takes care of filtering assets by type
                                options.success(response);

                            }).fail(function (xhr, status, error) {
                                logger.error({
                                    message: 'file list read error',
                                    method: 'summary.transport.read',
                                    data: { status: status, error: error, reponse: xhr.responseText }
                                });
                                options.error(xhr, status, error);
                                assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                app.notification.error(i18n.culture.editor.notifications.filesLoadFailure);
                            });
                        },

                        /**
                         * Update transport
                         * @param options
                         */
                        update: function (options) {
                            throw new Error('Use upload transport');
                        },

                        /**
                         * Upload transport for create and update
                         * Note: Upload is not a kendo.data.DataSource CRUD transport but we make it available in the DataSource as transport.upload
                         * Important: Upload is called from the kendo.ui.AssetManager upon clicking the upload button or dropping files
                         * @param options
                         */
                        upload: function (options) {
                            var locale = i18n.locale();
                            var params = JSON.parse($(VERSION_HIDDEN_FIELD).val());
                            var data = options.data;

                            assert.match(RX_LANGUAGE, locale, assert.format(assert.messages.match.default, 'locale', RX_LANGUAGE));
                            assert.match(RX_MONGODB_ID, params.summaryId, assert.format(assert.messages.match.default, params.summaryId, RX_MONGODB_ID));
                            // Note a window.File is a sort of window.Blob with a name
                            // assert.instanceof(window.File, data.file, assert.format(assert.messages.instanceof.default, 'data.file', 'File'));
                            assert.instanceof(window.Blob, data.file, assert.format(assert.messages.instanceof.default, 'data.file', 'Blob'));
                            assert.type(STRING, data.file.name, assert.format(assert.messages.type.default, 'data.file.name', STRING));
                            logger.debug({
                                message: 'getting a signed url from aws',
                                method: 'summary.transport.upload',
                                data: { language: locale, summaryId: params.summaryId }
                            });

                            // Get a signed upload url from Amazon S3
                            rapi.v1.content.getUploadUrl(locale, params.summaryId, data.file)
                                .done(function (uploadUrl) {
                                    logger.debug({
                                        message: 'uploading file/blob to signed url',
                                        method: 'summary.transport.upload',
                                        data: { language: locale, summaryId: params.summaryId, uploadUrl: uploadUrl }
                                    });
                                    // Upload to that signed url
                                    rapi.v1.content.uploadFile(uploadUrl, data.file)
                                        .progress(function (e) {
                                            if (e.lengthComputable) { // TODO trigger progress on dataSource
                                                $(document).trigger('progress.kendoAssetManager', [e.loaded / e.total, 'progress']);
                                            }
                                        })
                                        .done(function (response) {
                                            assert.isPlainObject(response, assert.format(assert.messages.isPlainObject.default, 'response'));
                                            assert.type(STRING, response.name, assert.format(assert.messages.type.default, 'response.name', STRING));
                                            assert.type(NUMBER, response.size, assert.format(assert.messages.type.default, 'response.size', NUMBER));
                                            assert.type(STRING, response.type, assert.format(assert.messages.type.default, 'response.type', STRING));
                                            assert.type(STRING, response.url, assert.format(assert.messages.type.default, 'response.url', STRING));
                                            logger.debug({
                                                message: 'new file/blob uploaded',
                                                method: 'summary.transport.upload',
                                                data: deepExtend({ language: locale, summaryId: params.summaryId }, response)
                                            });
                                            options.success({ data: [response], total: 1 });
                                            $(document).trigger('progress.kendoAssetManager', [1, 'complete']); // TODO trigger progress on dataSource
                                            assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                            app.notification.success(i18n.culture.editor.notifications.fileCreateSuccess);
                                        })
                                        .fail(function (xhr, status, error) {
                                            logger.error({
                                                message: 'file/blob upload error',
                                                method: 'summary.transport.upload',
                                                data: { status: status, error: error, response: xhr.responseText }
                                            });
                                            options.error(xhr, status, error);
                                            assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                            app.notification.error(i18n.culture.editor.notifications.fileCreateFailure);
                                        });
                                })
                                .fail(function (xhr, status, error) {
                                    logger.error({
                                        message: 'erro getting a signed upload url',
                                        method: 'summary.transport.create',
                                        data: { status: status, error: error, reponse: xhr.responseText }
                                    });
                                    options.error(xhr, status, error);
                                    assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                    app.notification.error(i18n.culture.editor.notifications.uploadUrlFailure);
                                });
                        },

                        /**
                         * Import transport
                         * Note: Import is not a kendo.data.DataSource CRUD transport but we make it available in the DataSource as transport.import
                         * Important: Import is called from kidoju.dialogs upon clicking the OK button of the asset manager dialog, when the url starts with http(s)://,
                         * that is when the url is not from amazon s3
                         * @param options
                         */
                        import: function (options) {
                            var locale = i18n.locale();
                            var params = JSON.parse($(VERSION_HIDDEN_FIELD).val());
                            var data = options.data;

                            assert.match(RX_LANGUAGE, locale, assert.format(assert.messages.match.default, 'locale', RX_LANGUAGE));
                            assert.match(RX_MONGODB_ID, params.summaryId, assert.format(assert.messages.match.default, params.summaryId, RX_MONGODB_ID));
                            assert.match(RX_URL, data.url, assert.format(assert.messages.match.default, data.url, RX_URL));

                            window.app.rapi.v1.content.importFile(locale, params.summaryId, data.url)
                                .done(function (response) {
                                    assert.isPlainObject(response, assert.format(assert.messages.isPlainObject.default, 'response'));
                                    assert.type(STRING, response.name, assert.format(assert.messages.type.default, 'response.name', STRING));
                                    assert.type(NUMBER, response.size, assert.format(assert.messages.type.default, 'response.size', NUMBER));
                                    assert.type(STRING, response.type, assert.format(assert.messages.type.default, 'response.type', STRING));
                                    assert.type(STRING, response.url, assert.format(assert.messages.type.default, 'response.url', STRING));
                                    logger.debug({
                                        message: 'url imported',
                                        method: 'summary.transport.import',
                                        data: deepExtend({ language: locale, summaryId: params.summaryId }, response)
                                    });
                                    options.success({ data: [response], total: 1 });
                                    assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                    app.notification.success(i18n.culture.editor.notifications.urlImportSuccess);
                                })
                                .fail(function (xhr, status, error) {
                                    logger.error({
                                        message: 'url import error',
                                        method: 'summary.transport.import',
                                        data: { status: status, error: error, response: xhr.responseText }
                                    });
                                    options.error(xhr, status, error);
                                    assert.instanceof(kendo.ui.Notification, app.notification, assert.format(assert.messages.instanceof.default, 'app.notification', 'kendo.ui.Notification'));
                                    app.notification.error(i18n.culture.editor.notifications.urlImportFailure);
                                });
                        }
                    }
                }, params);
            }

            /**
             * Creates an editable collection for an organisation
             * Note: should be disabled or hidden when user/summary does not belong to an organization
             */
            // organisation: function (type, params) { }

        };

        /**
         * Parses an asset configuration (audio, image, video)
         * @param config
         */
        function parseConfiguration(type) {
            assert.type(STRING, type, assert.format(assert.messages.type.default, 'type', STRING));
            assert.isPlainObject(app.assets[type], assert.format(assert.messages.isPlainObject.default, 'app.assets.' + type));
            var clone = JSON.parse(JSON.stringify(app.assets[type]));
            for (var i = 0, length = clone.collections.length; i < length; i++) {
                var collection = clone.collections[i];
                if (collection.source && $.isFunction(collectionSources[collection.source])) {
                    // collection = collectionSources[collection.type](collection.params);
                    clone.collections[i] = collectionSources[collection.source](type, collection.params || {});
                }
            }
            return clone;
        }

        /**
         * ./webapp/config/default.json is read by ./web_modules/app.config.jsx to produce app.assets, a configuration of read-only collections
         * We need extend app.assets into kidoju.assets used by kidoju.widgets, with project/organization editable collections and Google search
         */
        // Build audio tool assets
        kidoju.assets.audio = new kidoju.ToolAssets(parseConfiguration('audio'));
        // Build icon assets
        kidoju.assets.icon = new kidoju.ToolAssets(parseConfiguration('icon'));
        // Build image tool assets
        kidoju.assets.image = new kidoju.ToolAssets(parseConfiguration('image'));
        // Build video tool assets
        kidoju.assets.video = new kidoju.ToolAssets(parseConfiguration('video'));

        // Log readiness
        logger.debug({
            message: 'Assets configured'
        });

    }(window.jQuery));

    /* jshint +W071 */

    return app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });
