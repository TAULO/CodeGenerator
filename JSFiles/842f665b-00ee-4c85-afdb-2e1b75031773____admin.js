'use strict';

var path = require('path'),
	async = require('async'),
	request = require('superagent'),
	semver = require('semver'),
	fs = require('fs-extra'),
	moment = require('moment'),
	Utilities = require('periodicjs.core.utilities'),
	ControllerHelper = require('periodicjs.core.controller'),
	Extensions = require('periodicjs.core.extensions'),
	marked = require('marked'),
	ExtensionCore = new Extensions({
		extensionFilePath: path.resolve(process.cwd(), './content/config/extensions.json')
	}),
	CoreUtilities,
	CoreController,
	appSettings,
	dbSettings,
	mongoose,
	User,
	Collection,
	Compilation,
	Item, //Item
	AppDBSetting,
	Contenttype,
	adminSettings,
	logger;


/**
 * load contenttype data
 * @param  {object} contenttypes load default contentypes
 * @param  {Function} callbackk async callback
 */
var loadDefaultContentTypes = function (contentypes, callback) {
	var query = {
		_id: {
			$in: contentypes
		}
	};

	CoreController.searchModel({
		model: Contenttype,
		query: query,
		callback: callback
	});
};
/**
 * get the default content type from stored db defaults
 * @param  {object} contenttypesetting - name of default setting
 * @param  {Function} callbackk async callback
 */
var getDefaultContentTypes = function (contentypesetting, callback) {
	CoreController.loadModel({
		docid: contentypesetting,
		model: AppDBSetting,
		callback: function (err, defaultcontenttypes) {
			if (err) {
				callback(err, null);
			}
			else if (defaultcontenttypes && defaultcontenttypes.value) {
				loadDefaultContentTypes(defaultcontenttypes.value, callback);
			}
			else {
				callback(null, null);
			}
		}
	});
};

/**
 * load the markdown release data
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var getMarkdownReleases = function (req, res, next) {
	var markdownpages = [],
		markdownfiles = [];
	req.controllerData = (req.controllerData) ? req.controllerData : {};

	fs.readdir(path.join(process.cwd(), 'releases'), function (err, files) {
		if (err) {
			logger.error(err);
			req.controllerData.markdownpages = markdownpages;
			next();
		}
		else {
			if (files.length > 0) {
				files.reverse();
				markdownfiles = files.slice(0, 5);
			}
			async.each(
				markdownfiles,
				function (file, cb) {
					fs.readFile(path.join(process.cwd(), 'releases', file), 'utf8', function (err, data) {
						markdownpages.push(marked(data));
						cb(err);
						// console.log(data); //hello!
					});
				},
				function (err) {
					if (err) {
						logger.error(err);
						req.controllerData.markdownpages = markdownpages;
						next();
					}
					else {
						// console.log('markdownpages',markdownpages);
						req.controllerData.markdownpages = markdownpages;
						next();
					}
				});
		}
	});
};

/**
 * does a query to get content counts for all content types
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var getHomepageStats = function (req, res, next) {
	req.controllerData = (req.controllerData) ? req.controllerData : {};

	async.parallel({
		extensionsCount: function (cb) {
			ExtensionCore.getExtensions({
					periodicsettings: appSettings
				},
				function (err, extensions) {
					if (err) {
						cb(err, null);
					}
					else {
						cb(null, extensions.length);
					}
				});

		},
		themesCount: function (cb) {
			var themedir = path.resolve(process.cwd(), 'content/themes/'),
				returnFiles = [];
			fs.readdir(themedir, function (err, files) {
				if (err) {
					cb(err, null);
				}
				else {
					if (files) {
						for (var x = 0; x < files.length; x++) {
							if (files[x].match('periodicjs.theme')) {
								returnFiles.push(files[x]);
							}
						}
					}
					cb(null, returnFiles.length);
				}
			});
		},
		itemsCount: function (cb) {
			Item.count({}, function (err, count) {
				cb(err, count);
			});
		},
		collectionsCount: function (cb) {
			Collection.count({}, function (err, count) {
				cb(err, count);
			});
		},
		assetsCount: function (cb) {
			mongoose.model('Asset').count({}, function (err, count) {
				cb(err, count);
			});
		},
		contenttypesCount: function (cb) {
			Contenttype.count({}, function (err, count) {
				cb(err, count);
			});
		},
		tagsCount: function (cb) {
			mongoose.model('Tag').count({}, function (err, count) {
				cb(err, count);
			});
		},
		categoriesCount: function (cb) {
			mongoose.model('Category').count({}, function (err, count) {
				cb(err, count);
			});
		},
		usersCount: function (cb) {
			User.count({}, function (err, count) {
				cb(err, count);
			});
		}
	}, function (err, results) {
		if (err) {
			logger.error(err);
		}
		// console.log('results', results);
		req.controllerData.contentcounts = results;
		next();
	});
};

/**
 * sets search limit
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var setSearchLimitTo1000 = function (req, res, next) {
	req.query.limit = 1000;
	next();
};

/**
 * remove changeset item from changes array
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var remove_changeset_from_content = function (req, res, next) {
	var requestbody = {},
		removedchangeset,
		changesetindex;
	try {
		changesetindex = req.params.changesetnum - 1;
		switch (req.params.contententity) {
		case 'compilation':
			removedchangeset = req.controllerData.compilation.changes.splice(changesetindex, 1);
			req.redirectpath = '/p-admin/compilation/edit/' + req.controllerData.compilation._id + '/revisions';
			requestbody = {
				changes: req.controllerData.compilation.changes,
				docid: req.controllerData.compilation._id
			};
			break;
		case 'item':
			removedchangeset = req.controllerData.item.changes.splice(changesetindex, 1);
			req.redirectpath = '/p-admin/item/edit/' + req.controllerData.item._id + '/revisions';
			requestbody = {
				changes: req.controllerData.item.changes,
				docid: req.controllerData.item._id
			};
			break;
		case 'collection':
			removedchangeset = req.controllerData.collection.changes.splice(changesetindex, 1);
			req.redirectpath = '/p-admin/collection/edit/' + req.controllerData.collection._id + '/revisions';
			requestbody = {
				changes: req.controllerData.collection.changes,
				docid: req.controllerData.collection._id
			};
			break;
		case 'asset':
			removedchangeset = req.controllerData.asset.changes.splice(changesetindex, 1);
			req.redirectpath = '/p-admin/asset/edit/' + req.controllerData.asset._id + '/revisions';
			requestbody = {
				changes: req.controllerData.asset.changes,
				docid: req.controllerData.asset._id
			};
			break;
		default:
			next(new Error('invalid entity type'));
			break;
		}
		req.skipemptyvaluecheck = true;
		req.saverevision = false;
		req.forceupdate = true;
		req.body = requestbody;
		console.log('req.body', req.body);
		next();
	}
	catch (e) {
		console.error(e);
		next(e);
	}
};

/**
 * admin ext home page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var index = function (req, res) {
	// res.header('Cache-Control', 'public, max-age=7200');

	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/home/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				err: err,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'admin',
						extensions: CoreUtilities.getAdminMenu()
					},
					markdownpages: req.controllerData.markdownpages,
					contentcounts: req.controllerData.contentcounts,
					user: req.user
				}
			});
		}
	);
};

/**
 * application settings and theme settings page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var settings_index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/settings/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			// console.log('req.controllerData.themesettings',req.controllerData.themesettings);
			// console.log('req.controllerData.appsettings',req.controllerData.appsettings);
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Application Settings',
						headerjs: ['/extensions/periodicjs.ext.admin/js/settings.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					user: req.user,
					themesettings: req.controllerData.themesettings,
					appsettings: req.controllerData.appsettings,
				}
			});
		}
	);
};

/**
 * settings faq page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var settings_faq = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/settings/faq',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Application Quick Help',
						headerjs: ['/extensions/periodicjs.ext.admin/js/settings.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					user: req.user
				}
			});
		}
	);
};

/**
 * send test mail page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var mail_index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/mailer/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Mail Settings',
						headerjs: ['/extensions/periodicjs.ext.admin/js/mailer.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					user: req.user
				}
			});
		}
	);
};

/**
 * list items page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var items_index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/items/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				err: err,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'item admin',
						extensions: CoreUtilities.getAdminMenu()
					},
					items: req.controllerData.items,
					itemscount: req.controllerData.itemscount,
					itempages: Math.ceil(req.controllerData.itemscount / req.query.limit),
					// privileges: req.controllerData.privileges,
					user: req.user
				}
			});
		}
	);
};

/**
 * new item page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var item_new = function (req, res) {

	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/items/new',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			if (!err && !User.hasPrivilege(req.user, 110)) {
				err = new Error('You don\'t have access to view content');
			}
			getDefaultContentTypes('item_default_contenttypes', function (err, defaultcontenttypes) {
				if (err) {
					CoreController.handleDocumentQueryErrorResponse({
						err: err,
						res: res,
						req: req
					});
				}
				else {
					CoreController.handleDocumentQueryRender({
						res: res,
						req: req,
						renderView: templatepath,
						responseData: {
							pagedata: {
								title: 'New Item',
								headerjs: ['/extensions/periodicjs.ext.admin/js/item.min.js'],
								extensions: CoreUtilities.getAdminMenu()
							},
							item: null,
							default_contentypes: defaultcontenttypes,
							serverdate: moment().format('YYYY-MM-DD'),
							servertime: moment().format('HH:mm'),
							adminSettings: adminSettings,
							user: req.user
						}
					});
				}
			});
		}
	);
};

/**
 * set req.param.id for item
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var item_loadItem = function (req, res, next) {
	var postdata = CoreUtilities.removeEmptyObjectValues(req.body);
	req.params.id = postdata.docid;
	next();
};
/**
 * edit item page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var item_edit = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/items/edit',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			getDefaultContentTypes('item_default_contenttypes', function (err, defaultcontenttypes) {
				if (err) {
					CoreController.handleDocumentQueryErrorResponse({
						err: err,
						res: res,
						req: req
					});
				}
				else {
					if (defaultcontenttypes && defaultcontenttypes.length > 0) {
						if (req.controllerData.item.contenttypes && req.controllerData.item.contenttypes.length > 0) {
							for (var a in defaultcontenttypes) {
								var alreadyHasContenttype = false;
								for (var b in req.controllerData.item.contenttypes) {
									if (defaultcontenttypes[a]._id.equals(req.controllerData.item.contenttypes[b]._id)) {
										alreadyHasContenttype = true;
									}
									// console.log('a',a,'defaultcontenttypes[a]._id',defaultcontenttypes[a]._id,'b',b,req.controllerData.item.contenttypes[b]._id,'alreadyHasContenttype',alreadyHasContenttype);
								}
								if (alreadyHasContenttype === false) {
									req.controllerData.item.contenttypes.push(defaultcontenttypes[a]);
								}
							}
						}
						else {
							req.controllerData.item.contenttypes = defaultcontenttypes;
						}
					}
					CoreController.handleDocumentQueryRender({
						res: res,
						req: req,
						renderView: templatepath,
						responseData: {
							pagedata: {
								title: req.controllerData.item.title + ' - Edit Item',
								headerjs: ['/extensions/periodicjs.ext.admin/js/item.min.js'],
								extensions: CoreUtilities.getAdminMenu()
							},
							item: req.controllerData.item,
							serverdate: moment(req.controllerData.item.publishat).format('YYYY-MM-DD'),
							servertime: moment(req.controllerData.item.publishat).format('HH:mm'),
							adminSettings: adminSettings,
							user: req.user
						}
					});
				}
			});

		}
	);
};

/**
 * review item revision page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var item_review_revision = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/items/review_revision',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			if (!err && !User.hasPrivilege(req.user, 110)) {
				err = new Error('You don\'t have access to view content');
			}
			if (err) {
				CoreController.handleDocumentQueryErrorResponse({
					err: err,
					res: res,
					req: req
				});
			}
			else {
				CoreController.handleDocumentQueryRender({
					res: res,
					req: req,
					renderView: templatepath,
					responseData: {
						pagedata: {
							title: 'Revision (' + req.params.changeset + ') for ' + req.controllerData.item.title + ' - Edit Item',
							headerjs: ['/extensions/periodicjs.ext.admin/js/content_revision.min.js'],
							extensions: CoreUtilities.getAdminMenu()
						},
						item: req.controllerData.item,
						user: req.user
					}
				});
			}
		}
	);
};

/**
 * review item revision page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var item_revisions = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/items/revisions',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			if (!err && !User.hasPrivilege(req.user, 110)) {
				err = new Error('You don\'t have access to view content');
			}
			if (err) {
				CoreController.handleDocumentQueryErrorResponse({
					err: err,
					res: res,
					req: req
				});
			}
			else {
				CoreController.handleDocumentQueryRender({
					res: res,
					req: req,
					renderView: templatepath,
					responseData: {
						pagedata: {
							title: 'Revisions for ' + req.controllerData.item.title + ' - Edit Item',
							headerjs: ['/extensions/periodicjs.ext.admin/js/content_revision.min.js'],
							extensions: CoreUtilities.getAdminMenu()
						},
						item: req.controllerData.item,
						user: req.user
					}
				});
			}
		}
	);
};


/**
 * list collections page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var collections_index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/collections/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Collections',
						extensions: CoreUtilities.getAdminMenu()
					},
					collections: req.controllerData.collections,
					collectionscount: req.controllerData.collectionscount,
					collectionpages: Math.ceil(req.controllerData.collectionscount / req.query.limit),
					user: req.user
				}
			});
		}
	);
};

/**
 * new collection page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var collection_new = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/collections/new',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			getDefaultContentTypes('collection_default_contenttypes', function (err, defaultcontenttypes) {
				if (err) {
					CoreController.handleDocumentQueryErrorResponse({
						err: err,
						res: res,
						req: req
					});
				}
				else {
					CoreController.handleDocumentQueryRender({
						res: res,
						req: req,
						renderView: templatepath,
						responseData: {
							pagedata: {
								title: 'New Collection',
								headerjs: ['/extensions/periodicjs.ext.admin/js/collection.min.js'],
								extensions: CoreUtilities.getAdminMenu()
							},
							collection: null,
							default_contentypes: defaultcontenttypes,
							serverdate: moment().format('YYYY-MM-DD'),
							servertime: moment().format('HH:mm'),
							adminSettings: adminSettings,
							user: req.user
						}
					});
				}
			});
		}
	);
};


/**
 * set req.param.id for collection
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var collection_loadItem = function (req, res, next) {
	var postdata = CoreUtilities.removeEmptyObjectValues(req.body);
	req.params.id = postdata.docid;
	next();
};

/**
 * edit collection page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var collection_edit = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/collections/edit',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {


			getDefaultContentTypes('collection_default_contenttypes', function (err, defaultcontenttypes) {
				if (err) {
					CoreController.handleDocumentQueryErrorResponse({
						err: err,
						res: res,
						req: req
					});
				}
				else {
					if (defaultcontenttypes && defaultcontenttypes.length > 0) {
						if (req.controllerData.collection.contenttypes && req.controllerData.collection.contenttypes.length > 0) {
							for (var a in defaultcontenttypes) {
								var alreadyHasContenttype = false;
								for (var b in req.controllerData.collection.contenttypes) {
									if (defaultcontenttypes[a]._id.equals(req.controllerData.collection.contenttypes[b]._id)) {
										alreadyHasContenttype = true;
									}
									// console.log('a',a,'defaultcontenttypes[a]._id',defaultcontenttypes[a]._id,'b',b,req.controllerData.collection.contenttypes[b]._id,'alreadyHasContenttype',alreadyHasContenttype);
								}
								if (alreadyHasContenttype === false) {
									req.controllerData.collection.contenttypes.push(defaultcontenttypes[a]);
								}
							}
						}
						else {
							req.controllerData.collection.contenttypes = defaultcontenttypes;
						}
					}
					CoreController.handleDocumentQueryRender({
						res: res,
						req: req,
						renderView: templatepath,
						responseData: {
							pagedata: {
								title: req.controllerData.collection.title + ' - Edit Collection',
								headerjs: ['/extensions/periodicjs.ext.admin/js/collection.min.js'],
								extensions: CoreUtilities.getAdminMenu()
							},
							collection: req.controllerData.collection,
							serverdate: moment(req.controllerData.collection.publishat).format('YYYY-MM-DD'),
							servertime: moment(req.controllerData.collection.publishat).format('HH:mm'),
							adminSettings: adminSettings,
							user: req.user
						}
					});
				}
			});

		}
	);
};


/**
 * review collection revision page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var collection_review_revision = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/collections/review_revision',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			if (!err && !User.hasPrivilege(req.user, 110)) {
				err = new Error('You don\'t have access to view content');
			}
			if (err) {
				CoreController.handleDocumentQueryErrorResponse({
					err: err,
					res: res,
					req: req
				});
			}
			else {
				CoreController.handleDocumentQueryRender({
					res: res,
					req: req,
					renderView: templatepath,
					responseData: {
						pagedata: {
							title: 'Revision (' + req.params.changeset + ') for ' + req.controllerData.collection.title + ' - Edit Item',
							headerjs: ['/extensions/periodicjs.ext.admin/js/content_revision.min.js'],
							extensions: CoreUtilities.getAdminMenu()
						},
						collection: req.controllerData.collection,
						user: req.user
					}
				});
			}
		}
	);
};

/**
 * review collection revision page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var collection_revisions = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/collections/revisions',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			if (!err && !User.hasPrivilege(req.user, 110)) {
				err = new Error('You don\'t have access to view content');
			}
			if (err) {
				CoreController.handleDocumentQueryErrorResponse({
					err: err,
					res: res,
					req: req
				});
			}
			else {
				CoreController.handleDocumentQueryRender({
					res: res,
					req: req,
					renderView: templatepath,
					responseData: {
						pagedata: {
							title: 'Revisions for ' + req.controllerData.collection.title + ' - Edit Item',
							headerjs: ['/extensions/periodicjs.ext.admin/js/content_revision.min.js'],
							extensions: CoreUtilities.getAdminMenu()
						},
						collection: req.controllerData.collection,
						user: req.user
					}
				});
			}
		}
	);
};
/**
 * list compilations page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var compilations_index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/compilations/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Compilations',
						extensions: CoreUtilities.getAdminMenu()
					},
					compilations: req.controllerData.compilations,
					compilationscount: req.controllerData.compilationscount,
					compilationpages: Math.ceil(req.controllerData.compilationscount / req.query.limit),
					user: req.user
				}
			});
		}
	);
};

/**
 * new compilation page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var compilation_new = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/compilations/new',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			getDefaultContentTypes('compilation_default_contenttypes', function (err, defaultcontenttypes) {
				if (err) {
					CoreController.handleDocumentQueryErrorResponse({
						err: err,
						res: res,
						req: req
					});
				}
				else {
					CoreController.handleDocumentQueryRender({
						res: res,
						req: req,
						renderView: templatepath,
						responseData: {
							pagedata: {
								title: 'New Compilation',
								headerjs: ['/extensions/periodicjs.ext.admin/js/compilation.min.js'],
								extensions: CoreUtilities.getAdminMenu()
							},
							compilation: null,
							default_contentypes: defaultcontenttypes,
							serverdate: moment().format('YYYY-MM-DD'),
							servertime: moment().format('HH:mm'),
							adminSettings: adminSettings,
							user: req.user
						}
					});
				}
			});
		}
	);
};

/**
 * edit compilation page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var compilation_edit = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/compilations/edit',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			getDefaultContentTypes('compilation_default_contenttypes', function (err, defaultcontenttypes) {
				if (err) {
					CoreController.handleDocumentQueryErrorResponse({
						err: err,
						res: res,
						req: req
					});
				}
				else {
					if (defaultcontenttypes && defaultcontenttypes.length > 0) {
						if (req.controllerData.compilation.contenttypes && req.controllerData.compilation.contenttypes.length > 0) {
							for (var a in defaultcontenttypes) {
								var alreadyHasContenttype = false;
								for (var b in req.controllerData.compilation.contenttypes) {
									if (defaultcontenttypes[a]._id.equals(req.controllerData.compilation.contenttypes[b]._id)) {
										alreadyHasContenttype = true;
									}
									// console.log('a',a,'defaultcontenttypes[a]._id',defaultcontenttypes[a]._id,'b',b,req.controllerData.compilation.contenttypes[b]._id,'alreadyHasContenttype',alreadyHasContenttype);
								}
								if (alreadyHasContenttype === false) {
									req.controllerData.compilation.contenttypes.push(defaultcontenttypes[a]);
								}
							}
						}
						else {
							req.controllerData.compilation.contenttypes = defaultcontenttypes;
						}
					}
					CoreController.handleDocumentQueryRender({
						res: res,
						req: req,
						renderView: templatepath,
						responseData: {
							pagedata: {
								title: req.controllerData.compilation.title + ' - Edit Compilation',
								headerjs: ['/extensions/periodicjs.ext.admin/js/compilation.min.js'],
								extensions: CoreUtilities.getAdminMenu()
							},
							compilation: req.controllerData.compilation,
							serverdate: moment(req.controllerData.compilation.publishat).format('YYYY-MM-DD'),
							servertime: moment(req.controllerData.compilation.publishat).format('HH:mm'),
							adminSettings: adminSettings,
							user: req.user
						}
					});
				}
			});
		}
	);
};

/**
 * review compilation revision page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var compilation_review_revision = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/compilations/review_revision',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			if (!err && !User.hasPrivilege(req.user, 110)) {
				err = new Error('You don\'t have access to view content');
			}
			if (err) {
				CoreController.handleDocumentQueryErrorResponse({
					err: err,
					res: res,
					req: req
				});
			}
			else {
				CoreController.handleDocumentQueryRender({
					res: res,
					req: req,
					renderView: templatepath,
					responseData: {
						pagedata: {
							title: 'Revision (' + req.params.changeset + ') for ' + req.controllerData.compilation.title + ' - Edit Item',
							headerjs: ['/extensions/periodicjs.ext.admin/js/content_revision.min.js'],
							extensions: CoreUtilities.getAdminMenu()
						},
						compilation: req.controllerData.compilation,
						user: req.user
					}
				});
			}
		}
	);
};

/**
 * review compilation revision page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var compilation_revisions = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/compilations/revisions',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			if (!err && !User.hasPrivilege(req.user, 110)) {
				err = new Error('You don\'t have access to view content');
			}
			if (err) {
				CoreController.handleDocumentQueryErrorResponse({
					err: err,
					res: res,
					req: req
				});
			}
			else {
				CoreController.handleDocumentQueryRender({
					res: res,
					req: req,
					renderView: templatepath,
					responseData: {
						pagedata: {
							title: 'Revisions for ' + req.controllerData.compilation.title + ' - Edit Item',
							headerjs: ['/extensions/periodicjs.ext.admin/js/content_revision.min.js'],
							extensions: CoreUtilities.getAdminMenu()
						},
						compilation: req.controllerData.compilation,
						user: req.user
					}
				});
			}
		}
	);
};

var compilation_content_search_index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/compilations/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			var content_entities = req.controllerData.items.concat(req.controllerData.collections);
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Compilation Search Result',
						extensions: CoreUtilities.getAdminMenu()
					},
					content_entities: content_entities.sort(CoreUtilities.sortObject('asc', 'name')),
					user: req.user
				}
			});
		}
	);
};

/**
 * list assets page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var assets_index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/assets/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Assets',
						headerjs: ['/extensions/periodicjs.ext.admin/js/asset.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					assets: req.controllerData.assets,
					assetscount: req.controllerData.assetscount,
					assetpages: Math.ceil(req.controllerData.assetscount / req.query.limit),
					user: req.user
				}
			});
		}
	);
};

/**
 * show asset page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var asset_show = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/assets/show',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: req.controllerData.asset.title + ' - Edit Assets',
						headerjs: ['/extensions/periodicjs.ext.admin/js/asset.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					asset: req.controllerData.asset,
					adminSettings: adminSettings,
					user: req.user
				}
			});
		}
	);
};

/**
 * list content types page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var contenttypes_index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/contenttypes/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'content type admin',
						headerjs: ['/extensions/periodicjs.ext.admin/js/contenttype.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					contenttypes: req.controllerData.contenttypes,
					contenttypescount: req.controllerData.contenttypescount,
					contenttypepages: Math.ceil(req.controllerData.contenttypescount / req.query.limit),
					user: req.user
				}
			});
		}
	);
};

/**
 * show content type page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var contenttype_show = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/contenttypes/show',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: req.controllerData.contenttype.title + ' - Edit Content Types',
						headerjs: ['/extensions/periodicjs.ext.admin/js/contenttype.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					periodic: {
						version: appSettings.version
					},
					contenttype: req.controllerData.contenttype,
					user: req.user
				}
			});
		}
	);
};

/**
 * list tags page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var tags_index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/tags/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'tag admin',
						headerjs: ['/extensions/periodicjs.ext.admin/js/attributes.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					tags: req.controllerData.tags,
					tagscount: req.controllerData.tagscount,
					tagpages: Math.ceil(req.controllerData.tagscount / req.query.limit),
					user: req.user
				}
			});
		}
	);
};

/**
 * show selected tag page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var tag_show = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/tags/show',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: req.controllerData.tag.title + ' - Edit Tag',
						headerjs: ['/extensions/periodicjs.ext.admin/js/attributes.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					periodic: {
						version: appSettings.version
					},
					tag: req.controllerData.tag,
					user: req.user
				}
			});
		}
	);
};

/**
 * get tag parent page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var tag_parent = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/tags/show_parent',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: req.controllerData.tag.title + ' - Edit Tag',
						extensions: CoreUtilities.getAdminMenu()
					},
					periodic: {
						version: appSettings.version
					},
					parent: req.controllerData.tag.parent,
					user: req.user
				}
			});
		}
	);
};

/**
 * list categories page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var categories_index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/categories/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Category admin',
						headerjs: ['/extensions/periodicjs.ext.admin/js/attributes.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					categories: req.controllerData.categories,
					categoriescount: req.controllerData.categoriescount,
					categorypages: Math.ceil(req.controllerData.categoriescount / req.query.limit),
					user: req.user
				}
			});
		}
	);
};

/**
 * show category information
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var category_show = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/categories/show',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: req.controllerData.category.title + ' - Edit Category',
						headerjs: ['/extensions/periodicjs.ext.admin/js/attributes.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					periodic: {
						version: appSettings.version
					},
					category: req.controllerData.category,
					user: req.user
				}
			});
		}
	);
};

/**
 * get get category parent page page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var category_parent = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/categories/show_parent',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: req.controllerData.category.title + ' - Edit Category',
						extensions: CoreUtilities.getAdminMenu()
					},
					periodic: {
						version: appSettings.version
					},
					parent: req.controllerData.category.parent,
					user: req.user
				}
			});
		}
	);
};

/**
 * get extension data from selected extension package json
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var loadExtension = function (req, res, next) {
	var extname = req.params.id,
		extFilePath = path.resolve(process.cwd(), 'content/config/extensions.json'),
		z = false,
		selectedExt,
		currentExtensions;

	fs.readJson(extFilePath, function (err, currentExtensionsJson) {
		// console.log("currentExtensionsJson",currentExtensionsJson);
		if (err) {
			next(err);
		}
		else {
			currentExtensions = currentExtensionsJson.extensions;
			for (var x in currentExtensions) {
				if (currentExtensions[x].name === extname) {
					z = x;
				}
			}

			if (z !== false) {
				selectedExt = currentExtensions[z];
			}
			req.controllerData = (req.controllerData) ? req.controllerData : {};
			req.controllerData.extension = selectedExt;
			req.controllerData.extensionx = z;
			next();
		}
	});
};

/**
 * load extensions that are enabled and installed
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var loadExtensions = function (req, res, next) {
	req.controllerData = (req.controllerData) ? req.controllerData : {};

	ExtensionCore.getExtensions({
			periodicsettings: appSettings
		},
		function (err, extensions) {
			if (err) {
				CoreController.handleDocumentQueryErrorResponse({
					err: err,
					res: res,
					req: req
				});
			}
			else {
				req.controllerData.extensions = extensions;
				next();
			}
		});
};

/**
 * list installed extensions
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var extensions_index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/extensions/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Extensions',
						headerjs: ['/extensions/periodicjs.ext.admin/js/ext.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					items: false,
					extensions: req.controllerData.extensions,
					user: req.user
				}
			});
		}
	);
};

/**
 * show selected extension page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var extension_show = function (req, res) {
	var extname = req.params.id,
		extPackageConf = ExtensionCore.getExtensionPackageJsonFilePath(extname),
		extPeriodicConf = ExtensionCore.getExtensionPeriodicConfFilePath(extname);

	// an example using an object instead of an array
	async.parallel({
			packagefile: function (callback) {
				fs.readJson(extPackageConf, callback);
			},
			periodicfile: function (callback) {
				fs.readJson(extPeriodicConf, callback);
			}
		},
		function (err, results) {
			if (err) {
				CoreController.handleDocumentQueryErrorResponse({
					err: err,
					res: res,
					req: req
				});
			}
			else {
				CoreController.getPluginViewDefaultTemplate({
						viewname: 'p-admin/extensions/show',
						themefileext: appSettings.templatefileextension,
						extname: 'periodicjs.ext.admin'
					},
					function (err, templatepath) {
						CoreController.handleDocumentQueryRender({
							res: res,
							req: req,
							renderView: templatepath,
							responseData: {
								pagedata: {
									title: req.controllerData.extension.name + ' - Extension',
									headerjs: ['/extensions/periodicjs.ext.admin/js/ext_settings.min.js'],
									extensions: CoreUtilities.getAdminMenu()
								},
								extdata: results,
								extension: req.controllerData.extension,
								extconfigfiles: req.controllerData.extconfigfiles,
								user: req.user
							}
						});
					}
				);
			}
		});
};

/**
 * loads list of installed themes by reading content/themes directory
 * @param  {object} req
 * @param  {object} res
 * @param {object} next async callback
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var loadThemes = function (req, res, next) {
	var themedir = path.resolve(process.cwd(), 'content/themes/'),
		returnFiles = [];

	req.controllerData = (req.controllerData) ? req.controllerData : {};

	fs.readdir(themedir, function (err, files) {
		if (files) {
			for (var x = 0; x < files.length; x++) {
				if (files[x].match('periodicjs.theme')) {
					returnFiles.push(files[x]);
				}
			}
		}

		if (err) {
			CoreController.handleDocumentQueryErrorResponse({
				err: err,
				res: res,
				req: req
			});
		}
		else {
			req.controllerData.themes = returnFiles;
			next();
		}
	});
};

/**
 * list installed themes and install new themes page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var themes_index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/themes/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Themes',
						headerjs: ['/extensions/periodicjs.ext.admin/js/theme.min.js', '/extensions/periodicjs.ext.admin/js/settings.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					items: false,
					themes: req.controllerData.themes,
					themesettings: req.controllerData.themesettings,
					activetheme: appSettings.theme,
					user: req.user
				}
			});
		}
	);
};
/**
 * get theme page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var theme_show = function (req, res) {
	var themename = req.params.id,
		themeRouteConf = path.join(process.cwd(), 'content/themes', themename, 'routes.js'),
		themePackageConf = path.join(process.cwd(), 'content/config/themes', themename, 'periodicjs.theme.json');

	// an example using an object instead of an array
	async.parallel({
			packagefile: function (callback) {
				fs.readJson(themePackageConf, callback);
			},
			routefile: function (callback) {
				fs.readFile(themeRouteConf, 'utf8', callback);
			}
		},
		function (err, results) {
			if (err) {
				console.log('async callback err', themename, err);
				CoreController.handleDocumentQueryErrorResponse({
					err: err,
					res: res,
					req: req
				});
			}
			else {
				CoreController.getPluginViewDefaultTemplate({
						viewname: 'p-admin/themes/show',
						themefileext: appSettings.templatefileextension,
						extname: 'periodicjs.ext.admin'
					},
					function (err, templatepath) {
						CoreController.handleDocumentQueryRender({
							res: res,
							req: req,
							renderView: templatepath,
							responseData: {
								pagedata: {
									title: req.controllerData.theme.name + ' - Theme',
									headerjs: ['/extensions/periodicjs.ext.admin/js/theme_show.min.js'],
									extensions: CoreUtilities.getAdminMenu()
								},
								themedata: results,
								theme: req.controllerData.theme,
								user: req.user
							}
						});
					}
				);
			}
		});
};
/**
 * select theme name from req parameter
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var loadTheme = function (req, res, next) {
	var selectedTheme = req.params.id;

	req.controllerData = req.controllerData || {};
	req.controllerData.theme = {
		name: selectedTheme,
		activetheme: appSettings.theme
	};
	if (selectedTheme) {
		next();
	}
	else {
		next(new Error('no theme selected'));
	}
};

/**
 * shows list of users page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var users_index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/users/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Manage Users',
						extensions: CoreUtilities.getAdminMenu()
					},
					users: req.controllerData.users,
					userscount: req.controllerData.userscount,
					userpages: Math.ceil(req.controllerData.userscount / req.query.limit),
					user: req.user
				}
			});
		}
	);
};

/**
 * shows user profile page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var users_show = function (req, res) {
	var allow_edit = false,
		params = req.params;

	if (params.id === req.user.username) {
		logger.silly('users_show: logged in user matches username');
		allow_edit = true;
	}
	else if (req.user.usertype === 'admin') {
		logger.silly('users_show: user is admin');
		allow_edit = true;
	}
	else if (User.hasPrivilege(req.user, 750)) {
		logger.silly('users_show: has edit user privilege');
		allow_edit = true;
	}
	else {
		logger.silly('users_show: no access');
	}

	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/users/show',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'User profile (' + req.controllerData.user.username + ')',
						extensions: CoreUtilities.getAdminMenu()
					},
					userprofile: req.controllerData.user,
					allow_edit: allow_edit,
					user: req.user
				}
			});
		}
	);
};

/**
 * create a new user page
 * @param  {object} req
 * @param  {object} res
 * @return {object} reponds with an error page or sends user to authenicated in resource
 */
var users_new = function (req, res) {
	var allow_edit = false;

	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/users/new',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Create User Account',
						headerjs: ['/extensions/periodicjs.ext.admin/js/userprofile.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					userprofile: null,
					allow_edit: allow_edit,
					user: req.user
				}
			});
		}
	);
};

/**
 * make sure a user is authenticated, if not logged in, send them to login page and return them to original resource after login
 * @param  {object} req
 * @param  {object} res
 * @return {Function} next() callback
 */
var users_edit = function (req, res) {
	var allow_edit = false,
		params = req.params;

	if (params.id === req.user.username) {
		logger.silly('users_show: logged in user matches username');
		allow_edit = true;
	}
	else if (req.user.usertype === 'admin') {
		logger.silly('users_show: user is admin');
		allow_edit = true;
	}
	else if (User.hasPrivilege(req.user, 750)) {
		logger.silly('users_show: has edit user privilege');
		allow_edit = true;
	}
	else {
		logger.silly('users_show: no access');
	}

	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/users/edit',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.admin'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Edit ' + req.controllerData.user.username,
						headerjs: ['/extensions/periodicjs.ext.admin/js/userprofile.min.js'],
						extensions: CoreUtilities.getAdminMenu()
					},
					userprofile: req.controllerData.user,
					allow_edit: allow_edit,
					user: req.user
				}
			});
		}
	);
};

var check_periodic_version = function (req, server_res) {
	request
		.get('https://registry.npmjs.org/periodicjs')
		.set('Accept', 'application/json')
		.end(function (error, res) {
			if (res.error) {
				error = res.error;
			}
			if (error) {
				CoreController.handleDocumentQueryErrorResponse({
					err: error,
					res: res,
					req: req
				});
			}
			else {
				var latestPeriodicVersion = res.body['dist-tags'].latest;
				var currentPeriodicVersion = appSettings.version;
				if (semver.gte(currentPeriodicVersion, latestPeriodicVersion)) {
					server_res.send({
						status: 'current',
						message: 'Your instance of Periodic ' + currentPeriodicVersion + ' is up to date with the current version ' + latestPeriodicVersion
					});
				}
				else {
					// console.log('\u0007');
					server_res.send({
						status: 'error',
						message: 'Your instance of Periodic: ' + currentPeriodicVersion + ' is out of date, Current Version: ' + latestPeriodicVersion
					});
				}
			}
		});
};

var loadAdminSettings = function () {
	var appenvironment = appSettings.application.environment;
	fs.readJson(path.join(process.cwd(), 'content/config/extensions/periodicjs.ext.admin/settings.json'), function (err, adminSettingJson) {
		if (err) {
			logger.error(err);
		}
		if (adminSettingJson && adminSettingJson[appenvironment]) {
			adminSettings = adminSettingJson[appenvironment];
		}
	});
};

/**
 * admin controller
 * @module adminController
 * @{@link https://github.com/typesettin/periodicjs.ext.admin}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @requires module:async
 * @requires module:path
 * @requires module:superagent
 * @requires module:moment
 * @requires module:semver
 * @requires module:periodicjs.core.utilities
 * @requires module:periodicjs.core.controller
 * @requires module:periodicjs.core.mailer
 * @param  {object} resources variable injection from current periodic instance with references to the active logger and mongo session
 * @return {object}           admin
 */
var controller = function (resources) {
	logger = resources.logger;
	mongoose = resources.mongoose;
	appSettings = resources.settings;
	dbSettings = resources.db;
	loadAdminSettings();
	CoreController = new ControllerHelper(resources);
	CoreUtilities = new Utilities(resources);
	Item = mongoose.model('Item');
	Collection = mongoose.model('Collection');
	Compilation = mongoose.model('Compilation');
	User = mongoose.model('User');
	AppDBSetting = mongoose.model('Setting');
	Contenttype = mongoose.model('Contenttype');

	return {
		index: index,
		remove_changeset_from_content: remove_changeset_from_content,
		setSearchLimitTo1000: setSearchLimitTo1000,
		getMarkdownReleases: getMarkdownReleases,
		getHomepageStats: getHomepageStats,
		settings_index: settings_index,
		settings_faq: settings_faq,
		mail_index: mail_index,
		items_index: items_index,
		item_loadItem: item_loadItem,
		item_new: item_new,
		item_edit: item_edit,
		item_review_revision: item_review_revision,
		item_revisions: item_revisions,
		collections_index: collections_index,
		collection_loadItem: collection_loadItem,
		collection_new: collection_new,
		collection_edit: collection_edit,
		collection_review_revision: collection_review_revision,
		collection_revisions: collection_revisions,
		compilations_index: compilations_index,
		compilation_new: compilation_new,
		compilation_edit: compilation_edit,
		compilation_content_search_index: compilation_content_search_index,
		compilation_review_revision: compilation_review_revision,
		compilation_revisions: compilation_revisions,
		extensions_index: extensions_index,
		loadExtensions: loadExtensions,
		loadExtension: loadExtension,
		extension_show: extension_show,
		themes_index: themes_index,
		loadThemes: loadThemes,
		loadTheme: loadTheme,
		theme_show: theme_show,
		contenttypes_index: contenttypes_index,
		contenttype_show: contenttype_show,
		tags_index: tags_index,
		tag_show: tag_show,
		tag_parent: tag_parent,
		categories_index: categories_index,
		category_show: category_show,
		category_parent: category_parent,
		assets_index: assets_index,
		asset_show: asset_show,
		users_index: users_index,
		users_show: users_show,
		users_edit: users_edit,
		users_new: users_new,
		check_periodic_version: check_periodic_version
	};
};

module.exports = controller;
