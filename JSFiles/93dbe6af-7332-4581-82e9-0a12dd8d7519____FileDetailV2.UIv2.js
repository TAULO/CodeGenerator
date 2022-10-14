define("FileDetailV2", [
	"ViewUtilities", "ConfigurationConstants", "ConfigurationEnums", "RightUtilities", "DefaultProfileHelper",
	"VanillaboxMin", "ImageListViewModel", "FileDownloader", "ConfigurationFileApi", "CheckModuleDestroyMixin",
	"css!FileDetailCssModule", "css!VanillaboxCSS"],
	function(ViewUtilities, ConfigurationConstants, ConfigurationEnums, RightUtilities, DefaultProfileHelper) {
	return {
		properties: {

			/**
			 * Files group identifier, that is needed for vanillabox plugin.
			 * @protected
			 * @type {String}
			 */
			groupId: null,

			/**
			 * Property, that stores vanillabox object.
			 * @protected
			 * @type {Object}
			 */
			vanillaboxContainer: null,

			/**
			 * Vanillabox options config.
			 * @protected
			 * It can contains such values
			 * {
					 *   animation: 'none',
					 *   closeButton: true,
					 *   keyboard: true,
					 *   loop: true,
					 *   preferredWidth: 800,
					 *   preferredHeight: 600,
					 *   repositionOnScroll: true,
					 *   type: 'image',
					 *   adjustToWindow: 'both',
					 *   grouping: true
					 * }
			 * for more information visit https://cocopon.me/app/vanillabox/
			 */
			vanillaboxDefaultConfig: {
				closeButton: true,
				loop: true,
				repositionOnScroll: true
			},

			/**
			 * List default grid columns.
			 * @protected
			 * @type {String[]}
			 */
			defaultGridColumnNames: ["Name", "Notes", "Type", "CreatedOn", "CreatedBy"],

			/**
			 * @private
			 */
			_isDenyEditAttachedFileDescriptionEnabled: false
		},
		attributes: {
			/**
			 * Save the name of the editing card
			 */
			"SchemaCardName": {
				dataValueType: Terrasoft.DataValueType.TEXT,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},

			/**
			 * Errors when downloading files.
			 * @protected
			 */
			"FilesUploadErrorLog": {
				dataValueType: Terrasoft.DataValueType.COLLECTION,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},

			/**
			 * ######### ########## ######.
			 * @protected
			 */
			Extensions: {
				dataValueType: Terrasoft.DataValueType.COLLECTION
			},

			/**
			 * @type {Boolean}
			 */
			isImageManagerDetailView: {
				dataValueType: Terrasoft.DataValueType.BOOLEAN
			},

			/**
			 * @type {Boolean}
			 */
			isAnyItemSelected: {
				dataValueType: Terrasoft.DataValueType.BOOLEAN
			},

			/**
			 * ############ ############# ######## ###########.
			 * @type {Object}
			 */
			ItemViewConfig: {
				dataValueType: Terrasoft.DataValueType.CUSTOM_OBJECT
			},

			/**
			 * Parent entity.
			 */
			parentEntity: {
				dataValueType: Terrasoft.DataValueType.CUSTOM_OBJECT
			},

			/**
			 * ### ###### ## ######.
			 */
			cacheEntityLink: {
				dataValueType: Terrasoft.DataValueType.COLLECTION
			},

			/**
			 * ############ #### ########.
			 */
			entityTypeConfig: {
				dataValueType: Terrasoft.DataValueType.COLLECTION
			},

			/**
			 * #######, ####### ######### ## ##, ### ######## - ######.
			 * @readonly
			 */
			isLink: {
				dataValueType: Terrasoft.DataValueType.BOOLEAN,
				value: false
			},

			/**
			 * #######, ####### ######### ## ##, ### ######## - ####.
			 * @readonly
			 */
			isFile: {
				dataValueType: Terrasoft.DataValueType.BOOLEAN,
				value: false
			},

			/**
			 * #######, ####### ######### ## ##, ### ######## - ###### ## ######.
			 * @readonly
			 */
			isEntityLink: {
				dataValueType: Terrasoft.DataValueType.BOOLEAN,
				value: false
			}
		},
		mixins: {
			CheckModuleDestroyMixin: "Terrasoft.CheckModuleDestroyMixin"
		},
		messages: {
			"ItemSelected": {
				mode: this.Terrasoft.MessageMode.PTP,
				direction: this.Terrasoft.MessageDirectionType.SUBSCRIBE
			}
		},

		methods: {

			// region Methods: Public

			/**
			 * @inheritdoc Terrasoft.BaseDetailV2#init
			 * @overridden
			 */
			init: function() {
				this.set("SchemaCardName", "LinkPageV2");
				this.initParentEntity();
				this.callParent(arguments);
				this.initCanManageSysSettings();
				const cardModuleId = this.sandbox.id + "LinkPageV2";
				this.sandbox.subscribe("getCardInfo", this.getCardInfoConfig.bind(this), [cardModuleId]);
				this.set("isAnyItemSelected", false);
				this.set("FilesUploadErrorLog", this.Ext.create("Terrasoft.Collection"));
				this.set("Extensions", this.Ext.create("Terrasoft.Collection"));
				this.on("change:SelectedRows", function(model, value) {
					this.set("isAnyItemSelected", !this.Ext.isEmpty(value));
				}, this);
				this.on("change:ActiveRow", function(model, value) {
					this.set("isAnyItemSelected", !this.Ext.isEmpty(value));
				}, this);
				this.on("change:MasterRecordId", this.onMasterRecordIdChanged, this);
				this._isDenyEditAttachedFileDescriptionEnabled =
					this.Terrasoft.Features.getIsEnabled("DenyEditAttachedFileDescription");
			},

			/**
			 * ####### ######## ## #######.
			 */
			destroy: function() {
				this.un("change:MasterRecordId", this.onMasterRecordIdChanged, this);
				this.callParent(arguments);
			},

			/**
			 * ############ ####### ######### ########### ############## ######.
			 * @param {Object} model Backbone ######.
			 * @param {Guid} value ########## ############# ######.
			 */
			onMasterRecordIdChanged: function(model, value) {
				const parentEntity = this.parentEntity;
				if (parentEntity && parentEntity.RecordId) {
					parentEntity.RecordId = value;
				}
			},

			/**
			 * ######## ###### #### ###### ## ########.
			 * @param {Function} callback ####### ######### ######.
			 * @param {Object} scope ######## ##########.
			 */
			updateEntityLinkCache: function(callback, scope) {
				const esq = this.getEntityLink();
				esq.getEntityCollection(function(response) {
					if (response && response.success && response.collection) {

						var entityLinkCollection = this.prepareEntityLinkCollection(response.collection);
						this.prepareCacheEntityLink(entityLinkCollection);

						this.Ext.callback(callback, scope || this);

					} else {

						this._onQueryErrorResponse(response);

					}
				}, this);
			},

			prepareEntityLinkCollection: function(collection) {

				if (!collection) {
					return null;
				}
				const collectionItems = collection.getItems();
				const collectionToCache = collectionItems.map(function(item) {
					const model = item.model;
					if (model) {
						return model.toJSON();
					} else {
						return {};
					}
				});

				return collectionToCache;

			},
			/**
			 * ############## ###### ##### #########.
			 * @param {Function} callback ####### ######### ######.
			 * @param {Object} scope ######## ##########.
			 */
			initEntityType: function(callback, scope) {
				const esq = this.getEntityType();
				esq.getEntityCollection(function(response) {
					if (response && response.success && response.collection) {
						const collection = response.collection.getItems();
						this.prepareEntityTypeConfig(collection);
						const toolsButtonMenu = this.get("ToolsButtonMenu");
						this.addEntityOperationsMenuItems(toolsButtonMenu);
						if (callback) {
							callback.call(scope || this);
						}
					} else {
						this._onQueryErrorResponse(response);
					}
				}, this);
			},

			/**
			 * ############# ############ ##### #########.
			 * @param {Array} collection ###### #######.
			 */
			prepareEntityTypeConfig: function(collection) {
				this.entityTypeConfig = this.Ext.create("Terrasoft.Collection");
				this.Terrasoft.each(collection, this.addEntityType, this);
			},

			/**
			 * ############## ###### ####.
			 * @param {Array} collection ###### #######.
			 */
			prepareCacheEntityLink: function(collection) {

				this.cacheEntityLink = this.Ext.create("Terrasoft.Collection");
				this.Terrasoft.each(collection, function(item) {

					const data = Ext.JSON.decode(item.Data);
					if (data) {

						this.cacheEntityLink.add(item.Id, {
							"name": item.Name,
							"entityName": data.entitySchemaName,
							"recordId": data.recordId
						}, this);

					}

				}, this);

			},

			/**
			 * ######### ##### ####### ##-#########.
			 */
			setDefaultEntityType: function() {
				this.isFile = false;
				this.isLink = false;
				this.isEntityLink = false;
			},

			/**
			 * ########## ### ########.
			 * @param {Object} item
			 */
			defineEntityType: function(item) {
				this.setDefaultEntityType();
				const entityType = item.get("Type");
				const entityTypeId = entityType.value;
				if (entityTypeId === ConfigurationConstants.FileType.File) {
					this.isFile = true;
				}
				if (entityTypeId === ConfigurationConstants.FileType.Link) {
					this.isLink = true;
				}
				if (entityTypeId === ConfigurationConstants.FileType.EntityLink) {
					this.isEntityLink = true;
				}
			},

			/**
			 * ########## ############ ### ######## # ######## ##########.
			 * @overridden
			 */
			getCardInfoConfig: function() {
				const detailInfo = {
					valuePairs: this.get("DefaultValues") || []
				};
				detailInfo.typeColumnName = this.parentEntity.EntityName;
				detailInfo.typeUId = this.parentEntity.RecordId;
				return detailInfo;
			},

			/**
			 * Initializes parent entity.
			 */
			initParentEntity: function() {
				this.parentEntity = {};
				const entitySchemaName = this.entitySchema && this.entitySchema.name || "";
				const parentSchemaName = entitySchemaName.replace("File", "");
				const masterRecordId = this.get("MasterRecordId");
				this.parentEntity.EntityName = parentSchemaName;
				this.parentEntity.RecordId = masterRecordId;
			},

			/**
			 * @inheritdoc Terrasoft.BaseDetailV2#getEditPagesSandboxIds
			 * @overridden
			 */
			getEditPagesSandboxIds: function() {
				return [this.sandbox.id + this.get("SchemaCardName")];
			},

			/**
			 * @inheritdoc Terrasoft.BaseDetailV2#getEditRecordButtonEnabled
			 * @overridden
			 */
			getEditRecordButtonEnabled: function() {
				let isSingleSelect = this.isSingleSelected();
				if (!this._isDenyEditAttachedFileDescriptionEnabled) {
					return isSingleSelect;
				}
				if (!isSingleSelect) {
					return false;
				}
				const activeRow = this.getActiveRow();
				return (activeRow.get("Type").value === ConfigurationConstants.FileType.Link);
			},

			/**
			 * ########## ######.
			 */
			addLinkRecord: function() {
				const editPageUId = Terrasoft.GUID_EMPTY;
				const isNewRecord = this.getIsNewRecord();
				if (isNewRecord) {
					this.sandbox.subscribe("CardSaved", function() {
						this.openCard(ConfigurationEnums.CardStateV2.ADD, editPageUId, null);
					}, this, [this.sandbox.id]);
					const config = {
						isSilent: true,
						messageTags: [this.sandbox.id]
					};
					this.sandbox.publish("SaveRecord", config, [this.sandbox.id]);
				} else {
					this.openCard(ConfigurationEnums.CardStateV2.ADD, editPageUId, null);
				}
			},

			/**
			 * ########## ###### ## ########.
			 * @param {String} entityName ######## ########.
			 */
			addEntityLinkRecord: function(entityName) {
				const filters = this.getEntityFilter(entityName);
				const configLookup = {
					entitySchemaName: entityName,
					multiSelect: true,
					filters: filters
				};
				const isNewRecord = this.getIsNewRecord();
				if (isNewRecord) {
					this.sandbox.subscribe("CardSaved", function() {
						this.openLookup(configLookup, this.saveSelectedRecords.bind(this, entityName), this);
					}, this, [this.sandbox.id]);
					const config = {
						isSilent: true,
						messageTags: [this.sandbox.id]
					};
					this.sandbox.publish("SaveRecord", config, [this.sandbox.id]);
				} else {
					this.openLookup(configLookup, this.saveSelectedRecords.bind(this, entityName), this);
				}
			},

			/**
			 * @inheritdoc Terrasoft.BaseGridDetailV2#onDeleted
			 * @overridden
			 */
			onDeleted: function(record) {
				this.set("SelectedRows", []);
				this.reloadCollectionData();
				if (record && record.Success) {
					const deletedItems = record.DeletedItems;
					this.Terrasoft.each(deletedItems, function(item) {
						this.cacheEntityLink.removeByKey(item);
					}, this);
				}
				this.callParent(arguments);
			},

			/**
			 * ######### #######, ### ########### #########.
			 * @param {String} entityName ######## ########.
			 * @return {Terrasoft.data.filters.FilterGroup} ########## ###### ########.
			 */
			getEntityFilter: function(entityName) {
				const filterGroup = this.Terrasoft.createFilterGroup();
				if (!this.Ext.isEmpty(this.cacheEntityLink)) {
					this.cacheEntityLink.each(function(item) {
						if (item.entityName === entityName) {
							const idFilter = this.Terrasoft.createColumnFilterWithParameter(
									this.Terrasoft.ComparisonType.NOT_EQUAL, "Id", item.recordId);
							filterGroup.addItem(idFilter);
						}
					}, this);
				}
				return filterGroup;
			},

			/**
			 * ########## ######## ########### ###### ############## ######.
			 * @return {Array} ######## ########### ###### ############## ######.
			 */
			generateButtonMenuItems: function() {
				const itemsConfig = [];
				if (!this.Ext.isEmpty(this.entityTypeConfig)) {
					this.entityTypeConfig.eachKey(function(entityName, item) {
						const addMethodName = "add" + entityName + "Record";
						this[addMethodName] = this.addEntityLinkRecord.bind(this, entityName);
						itemsConfig.push({
							"viewModelItem": this.getButtonMenuItem({
								Caption: item.menuItemCaption,
								Click: {"bindTo": addMethodName},
								Visible: {"bindTo": "getAddRecordButtonVisible"}
							}),
							"position": item.position,
							"key": entityName + "Item"
						});
					}, this);
				}
				return itemsConfig;
			},

			/**
			 * ######### # ####### ###### ## ########.
			 * @param {String} entityName ######## ########.
			 * @param {Object} config ###### #### {columnName: string, selectedRows: []}.
			 **/
			saveSelectedRecords: function(entityName, config) {

				const selectedRows = config.selectedRows.getItems();
				if (!selectedRows || !selectedRows.length) {
					return;
				}

				var insertedIds = [];
				const batchQuery = this.Ext.create("Terrasoft.BatchQuery");

				this.Terrasoft.each(selectedRows, function(item) {

					var newId = this.Terrasoft.generateGUID();
					var insertLinkQuery = this.getInsertEntityLink(item, entityName);
					insertLinkQuery.setParameterValue(this.entitySchema.primaryColumnName, newId, Terrasoft.DataValueType.GUID);
					insertedIds.push(newId);

					batchQuery.add(insertLinkQuery);
				}, this);

				batchQuery.add(this.getEntityLink(), function(response) {
					if (response && response.success && response.collection) {

						var entityLinkCollection = this.prepareEntityLinkCollection(response.collection);
						this.prepareCacheEntityLink(entityLinkCollection);

					}
				}, this);
				batchQuery.add(this.getInsertedEntities(insertedIds), this.addInsertedRecordToGrid, this);

				batchQuery.execute();

			},

			/**
			 * ######### ###### ## ########.
			 * @param {Object} item ###### ########.
			 * @param {Object} entityName ######## ########.
			 * @return {Terrasoft.InsertQuery}
			 */
			getInsertEntityLink: function(item, entityName) {

				const data = {
					entitySchemaName: entityName,
					recordId: item.value
				};
				const insert = this.Ext.create("Terrasoft.InsertQuery", {
					rootSchemaName: this.entitySchemaName
				});

				insert.setParameterValue("Name", item.Name, Terrasoft.DataValueType.TEXT);
				insert.setParameterValue("Data", Ext.JSON.encode(data), Terrasoft.DataValueType.BLOB);
				insert.setParameterValue(this.parentEntity.EntityName, this.parentEntity.RecordId,
						Terrasoft.DataValueType.GUID);
				insert.setParameterValue("Type", ConfigurationConstants.FileType.EntityLink,
						Terrasoft.DataValueType.GUID);

				return insert;

				},

			getInsertedEntities: function(selectedIds) {

				const esq = this.getGridDataESQ();
				this.initQueryColumns(esq);
				this.initQuerySorting(esq);
				this.initQueryFilters(esq);
				this.initQueryEvents(esq);
				esq.filters.addItem(
					this.Terrasoft.createColumnInFilterWithParameters(this.entitySchema.primaryColumnName, selectedIds)
				);

				return esq;
			},

			addInsertedRecordToGrid: function(response) {

				this.updateLoadedGridData(response, this.onGridDataLoaded, this);

			},

			/**
			 * ########## ## ##### ######### ####### ## id.
			 * @param {String} id ############# ########.
			 * @return {Object} ###### ########.
			 */
			getEntityLinkCacheById: function(id) {
				if (!this.Ext.isEmpty(this.cacheEntityLink)) {
					return this.cacheEntityLink.get(id);
				}
				return null;
			},

			/**
			 * @inheritdoc
			 * @overridden
			 */
			getOpenCardConfig: function() {
				const config = this.callParent(arguments);
				return this.Ext.apply(config, {
					moduleId: this.sandbox.id + this.get("SchemaCardName"),
					entitySchemaName: this.entitySchemaName
				});
			},

			/**
			 * @inheritdoc
			 * @overridden
			 */
			initEditPages: function() {
				const collection = this.Ext.create("Terrasoft.BaseViewModelCollection");
				const typeUId = this.Terrasoft.GUID_EMPTY;
				collection.add(typeUId, this.Ext.create("Terrasoft.BaseViewModel", {
					values: {
						Tag: typeUId,
						SchemaName: this.get("SchemaCardName")
					}
				}));
				this.set("EditPages", collection);
			},

			/**
			 * @inheritdoc Terrasoft.BaseGridDetailV2#linkClicked
			 * @overridden
			 */
			linkClicked: function(rowId) {
				const collection = this.getGridData();
				const record = collection.get(rowId);
				if (this.isEntityLink) {
					const recordId = record.get("Id");
					this.openCardEntity(recordId);
					return false;
				}
			},

			/**
			 * ######### ######## #######.
			 * @param {String} id ############# ######.
			 */
			openCardEntity: function(id) {
				const entityLink = this.getEntityLinkCacheById(id);
				if (!this.Ext.isEmpty(entityLink)) {
					const entityId = entityLink.recordId;
					const entityStructure = this.getEntityStructure(entityLink.entityName);
					const pages = entityStructure.pages;
					if (!this.Ext.isEmpty(pages)) {
						const cardModuleId = this.sandbox.id + "_" + pages[0].cardSchema;
						const operation = ConfigurationEnums.CardStateV2.EDIT;
						const openCardConfig = {
							moduleId: cardModuleId,
							schemaName: pages[0].cardSchema,
							operation: operation,
							id: entityId
						};
						this.sandbox.publish("OpenCard", openCardConfig, [this.sandbox.id]);
					}
				}
			},

			/**
			 * ########## ############ ### ############ ###### ## ########.
			 * @param {String} id ############# #######.
			 * @return {Object} URL ######.
			 */
			getEntityLinkConfigById: function(id) {
				const entityLink = this.getEntityLinkCacheById(id);
				if (!this.Ext.isEmpty(entityLink)) {
					const entityLinkId = entityLink.recordId;
					const entitySchemaName = entityLink.entityName;
					return this.createLink(entitySchemaName, "Id", "Name", entityLinkId);
				}
			},

			/**
			 * ########## ######## ######### ######### # ####### ######## ########### ########.
			 * @param {String} entityName ######## ########.
			 * @return {String} ######## ######### #########.
			 */
			getSysSettingImageByEntityName: function(entityName) {
				if (!this.Ext.isEmpty(this.entityTypeConfig) && this.entityTypeConfig.contains(entityName)) {
					const entityConfig = this.entityTypeConfig.get(entityName);
					return entityConfig.sysSettingImage;
				}
			},

			/**
			 * @inheritdoc GridUtilitiesV2#createViewModel
			 * @overridden
			 */
			createViewModel: function(config) {
				this.callParent(arguments);
				this.bindItemViewModelMethods(config.viewModel);
			},

			/**
			 * Bind image list view model item to methods in detail.
			 * @protected
			 * @param {Terrasoft.ImageListViewModel} viewModel
			 */
			bindItemViewModelMethods: function(viewModel) {
				viewModel.getEntityLinkConfigById = this.getEntityLinkConfigById.bind(this);
				viewModel.openCardEntity = this.openCardEntity.bind(this);
				viewModel.setDefaultEntityType = this.setDefaultEntityType;
				viewModel.defineEntityType = this.defineEntityType;
				viewModel.getEntityLinkCacheById = this.getEntityLinkCacheById.bind(this);
				viewModel.getSysSettingImageByEntityName = this.getSysSettingImageByEntityName.bind(this);
			},

			/**
			 * ######### #####, ############ ############ ###### # ###### #######
			 * @overridden
			 */
			addColumnLink: function(item, column) {
				const columnPath = column.columnPath;
				if (columnPath === item.primaryDisplayColumnName) {
					const linkConfig = this.getColumnLinkConfig(item);
					item["on" + columnPath + "LinkClick"] = function() {
						const value = this.get(columnPath);
						return {
							caption: value,
							target: linkConfig.target,
							title: value,
							url: linkConfig.link
						};
					};
				} else {
					this.callParent(arguments);
				}
			},

			/**
			 * Shows not valid files.
			 * @param {Number} maxFileSize Maximum upload file size in Mb from SysSetting.
			 * @param {Array} excludedFiles Array of files that wasn't uploaded.
			 */
			onFilesOversized: function(maxFileSize, excludedFiles) {
				const errorLog = this.get("FilesUploadErrorLog");
				const maxFileSizeExceededExceptionMessage = Ext.String.format(
						this.get("Resources.Strings.MaxFileSizeExceededExceptionMessage"), maxFileSize);
				Terrasoft.each(excludedFiles, function(file) {
					errorLog.add({
						file: file,
						message: maxFileSizeExceededExceptionMessage,
						isFileOversize: true
					});
				}, this);
			},

			/**
			 * @inheritdoc Terrasoft.BaseGridDetailV2#onCardSaved
			 * overridden
			 */
			onCardSaved: function() {
				const config = this.get("FileUploadConfig");
				if (!this.Ext.isEmpty(config)) {
					this.upload(config, function() {
						this.set("FileUploadConfig", null);
					});
				}
			},

			/**
			 * @inheritdoc Terrasoft.BaseGridDetailV2#onRender
			 * overridden
			 */
			onRender: function() {
				this.callParent(arguments);
				this.initDropzoneEvents();
				const mode = this.get("Mode");
				if (!mode) {
					this.setDefaultMode();
				}
			},

			/**
			 * @inheritdoc Terrasoft.BaseGridDetailV2#addDetailWizardMenuItems
			 * @overridden
			 */
			addDetailWizardMenuItems: this.Terrasoft.emptyFn,

			/**
			 * @inheritdoc Terrasoft.BaseGridDetailV2#addRecordOperationsMenuItems
			 * @overridden
			 */
			addRecordOperationsMenuItems: function(toolsButtonMenu) {
				const linkMenuItem = this.getAddLinkMenuItem();
				if (!this.Ext.isEmpty(linkMenuItem)) {
					toolsButtonMenu.addItem(linkMenuItem);
					toolsButtonMenu.addItem(this.getButtonMenuSeparator());
				}
				this.callParent(arguments);
			},

			/**
			 * ######### ######## # ######### ########### ###### ############## ######.
			 * @param {Terrasoft.core.collections.Collection} toolsButtonMenu ######### ########### ######.
			 */
			addEntityOperationsMenuItems: function(toolsButtonMenu) {
				const entityLink = this.generateButtonMenuItems();
				if (!this.Ext.isEmpty(entityLink)) {
					this.Terrasoft.each(entityLink, function(item) {
						toolsButtonMenu.insert(item.position, item.key, item.viewModelItem);
					}, this);
				}
			},

			/**
			 * @inheritdoc Terrasoft.BaseGridDetailV2#getEditRecordMenuItem
			 * @overridden
			 */
			getEditRecordMenuItem: function() {
				const menuItem = this.callParent(arguments);
				menuItem.set("Caption", {"bindTo": "Resources.Strings.ActionChangeSettingsCation"});
				menuItem.set("MarkerValue", {"bindTo": "Resources.Strings.ActionChangeSettingsCation"});
				return menuItem;
			},

			/**
			 * @inheritdoc Terrasoft.GridUtilities#beforeLoadGridData
			 * @overridden
			 */
			beforeLoadGridData: function() {
				this.set("IsGridDataLoaded", false);
				if (!this.get("isImageManagerDetailView")) {
					this.set("IsGridLoading", true);
				}
				this.set("IsGridEmpty", false);
			},

			/**
			 * @inheritdoc Terrasoft.GridUtilities#loadGridData
			 * @overridden
			 */
			loadGridData: function() {

				this.Terrasoft.chain(
						function(next) {
							this.updateEntityLinkCache(next, this);
						},
						function(next) {
							this.beforeLoadGridData();
							next();
						},
						function(next) {
							const extensions = this.get("Extensions");
							if (extensions.getCount() > 0) {
								next();
							} else {
								this.loadExtensions(next);
							}
						},
						function() {
							this.loadContainerListData();
						},
						this);

			},

			/**
			 * @inheritdoc Terrasoft.BaseGridDetail#hideQuickFilterButton
			 * @overridden
			 */
			getHideQuickFilterButton: function() {
				return false;
			},

			/**
			 * @inheritdoc Terrasoft.BaseGridDetail#getQuickFilterButton
			 * @overridden
			 */
			getShowQuickFilterButton: Terrasoft.emptyFn,

			/**
			 * @inheritdoc Terrasoft.GridUtilities#getIsCurrentGridRendered
			 * @overridden
			 */
			getIsCurrentGridRendered: function() {
				const currentGrid = this.getCurrentGrid();
				if (!this.get("isImageManagerDetailView")) {
					return this.callParent(arguments);
				} else {
					if (currentGrid) {
						currentGrid.rendered = false;
					}
					return false;
				}
			},

			/**
			 * @inheritdoc Terrasoft.GridUtilities#initQueryColumns
			 * @overridden
			 */
			initQueryColumns: function(esq) {
				this.callParent(arguments);
				this.initLoadFilesQueryColumns(esq);
			},

			/**
			 * @inheritdoc Terrasoft.GridUtilities#initQueryFilters
			 * @overridden
			 */
			initQueryFilters: function(esq) {
				const detailColumnName = this.get("DetailColumnName");
				var masterRecordId = this.get("MasterRecordId");
				if (masterRecordId == null) {
					masterRecordId = this.Terrasoft.GUID_EMPTY;
				}
				const filterGroup = this.getFilters();
				filterGroup.addItem(this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, detailColumnName, masterRecordId));
				esq.filters.add("entityFilterGroup", filterGroup);
			},

			/**
			 * ########## ######### ####### ######.
			 * @param {Boolean} value ######### ############# Image Manager.
			 * @return {Boolean} ######### ####### ######.
			 */
			getDataGridVisible: function(value) {
				return !value;
			},

			/**
			 * @inheritdoc Terrasoft.BaseGridDetailV2#switchGridMode
			 * @overridden
			 */
			switchGridMode: function() {
				this.deselectRows();
				const multiSelect = this.get("MultiSelect");
				this.set("MultiSelect", !multiSelect);
				this.reloadCollectionData();
			},

			/**
			 * @inheritdoc Terrasoft.GridUtilities#getGridRowViewModelClassName
			 * @overridden
			 */
			getGridRowViewModelClassName: function() {
				return "Terrasoft.ImageListViewModel";
			},

			/**
			 * @inheritdoc Terrasoft.GridUtilities#getGridRowViewModelConfig
			 * @overridden
			 */
			getGridRowViewModelConfig: function() {
				const config = this.callParent(arguments);
				this.Ext.apply(config, this.getAdditionalViewModelConfig());
				return config;
			},

			/**
			 * Config contains methods, needed for vanilla logic.
			 * @protected
			 * @returns {Object} config
			 */
			getAdditionalViewModelConfig: function() {
				return {
					Ext: this.Ext,
					Terrasoft: this.Terrasoft,
					sandbox: this.sandbox,
					methods: {
						imageContainerRender: this.setVanillaboxAttribute.bind(this),
						imageContainerReRender: this.setVanillaboxAttribute.bind(this)
					}
				};
			},

			/**
			 * Handles "itemsRendered" event, that has fired in ContainerList component.
			 */
			itemsRendered: function() {
				this._applyVanillaboxLogic();
			},

			/**
			 * ########### ######### ###### ##### ######### # ######.
			 * @overriden
			 * @param {Terrasoft.core.collections.Collection} collection ######### ######### #######.
			 */
			prepareResponseCollection: function(collection) {
				this.callParent(arguments);
				collection.each(function(item) {
					this.decorateItem(item);
				}, this);
			},

			/**
			 * @inheritdoc Terrasoft.BaseGridDetailV2#getEditRecordMenuItem
			 * @overridden
			 */
			getCopyRecordMenuItem: Terrasoft.emptyFn,

			/**
			 * @override
			 * @inheritdoc Terrasoft.GridUtilities#getProfile
			 */
			getProfile: function() {
				const profile = this.callParent(arguments);
				return Terrasoft.isEmpty(profile) || Ext.Object.isEmpty(profile) ? {isCollapsed: false} : profile;
			},

			/**
			 * @inheritDoc Terrasoft.BaseDetailV2#getToolsVisible
			 */
			getAddRecordButtonVisible: function() {
				return this.getToolsVisible() && this.get("CanEditMasterRecord");
			},

			// endregion

			// region Methods: Protected

			/**
			 * @inheritdoc Terrasoft.BaseDetailV2#initProfile
			 * @override
			 */
			initProfile: function () {
				this.callParent(arguments);
				this.initSortActionItems();
			},

			/**
			 * @inheritdoc Terrasoft.GridUtilitiesV2#generateEntityProfile
			 * @override
			 */
			generateEntityProfile: function () {
				var entityShema = this.getGridEntitySchema();
				if (entityShema) {
					var defColumns = this._getDefaultGridViewColumns();
					return DefaultProfileHelper.getEntityProfile(this.getProfileKey(),
						entityShema.name, this.Terrasoft.GridType.LISTED, defColumns);
				} else {
					return {};
				}
			},

			/**
			 * Initializes CanManageSysSettings rights attribute.
			 * @protected
			 */
			initCanManageSysSettings: function() {
				var rightsOperationName = "CanManageSysSettings";
				if (Terrasoft.Features.getIsEnabled("UseCanManageAdministrationForSysSettings") === true) {
					rightsOperationName = "CanManageAdministration";
				}
				RightUtilities.checkCanExecuteOperation({
					operation: rightsOperationName
				}, this._onCanManageSysSettingsComplete, this);
			},

			/**
			 * ############## ######### ###### ############# ########.
			 * @protected
			 * @param {Function} callback ####### ######### ######.
			 * @param {Object} scope ######## ##########.
			 */
			initData: function(callback, scope) {
				this.callParent([this.initEntityType.bind(this, callback, scope), this]);
			},

			/**
			 * ########## ###### ## ####### ###### ##### #########.
			 * @protected
			 * @virtual
			 * @return {Terrasoft.EntitySchemaQuery}
			 */
			getEntityType: function() {
				const esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: "EntityTypeLookup"
				});
				esq.addColumn("EntityName");
				esq.addColumn("MenuItemCaption");
				esq.addColumn("SysSettingImage");
				esq.addColumn("Position");
				return esq;
			},

			/**
			 * ########## ###### ## ####### ###### ###### ## ########.
			 * @protected
			 * @virtual
			 * @return {Terrasoft.EntitySchemaQuery}
			 */
			getEntityLink: function() {
				const esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: this.entitySchemaName
				});
				esq.addColumn("Id");
				esq.addColumn("Name");
				esq.addColumn("Data");
				esq.filters.addItem(esq.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, this.parentEntity.EntityName, this.parentEntity.RecordId));
				esq.filters.addItem(esq.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "Type", ConfigurationConstants.FileType.EntityLink));

				return esq;
			},

			/**
			 * ########## #######, ####### ###### ########## ########.
			 * @protected
			 * @overridden
			 * @return {Object} ########## ###### ########-############ #######
			 */
			getGridDataColumns: function() {
				const baseGridDataColumns = this.callParent(arguments);
				const gridDataColumns = {
					"Type": {
						path: "Type"
					},
					"Version": {
						path: "Version"
					},
					"CreatedBy": {
						path: "CreatedBy"
					},
					"Notes": {
						path: "Notes"
					}
				};
				return this.Ext.apply(baseGridDataColumns, gridDataColumns);
			},

			/**
			 * ########## ######### ######## #####.
			 * @protected
			 * @return {Object} ######### ######## #####.
			 */
			getUploadConfig: function(files) {
				return {
					scope: this,
					onUpload: this.onUpload,
					onComplete: this.onComplete,
					onFileComplete: this.onFileComplete,
					entitySchemaName: this.entitySchema.name,
					columnName: "Data",
					parentColumnName: this.get("DetailColumnName"),
					parentColumnValue: this.get("MasterRecordId"),
					files: files,
					isChunkedUpload: true,
					oversizeErrorHandler: this.onFilesOversized
				};
			},

			/**
			 * ########## ####### ########## ######## ######. ######## ##### ########. #### ### ######## ########
			 * ######, ########## #########.
			 */
			onComplete: function() {
				this.hideBodyMask();
				const errorLog = this.get("FilesUploadErrorLog");
				if (errorLog.getCount()) {
					this.onCompleteError(errorLog);
					errorLog.clear();
				}
			},

			/**
			 * Handler for message box ChangeSetting button.
			 * Navigates to setting page for changing max file size.
			 * @protected
			 */
			onChangeSettingValueHandler: function() {
				var resumeConfig = {
					method: this._navigateToChangeSettingPage,
					scope: this
				};
				if (this.canBeDestroyed(resumeConfig)) {
					this._navigateToChangeSettingPage();
				}
			},

			/**
			 * ########## ####### ########## ######## #####. ########## ###### # #######. #### ### ######## ########
			 * ######, ######### ## # ###.
			 * @protected
			 */
			onFileComplete: function(error, xhr, file, options) {
				if (!error) {
					this.loadGridDataRecord(options.data.fileId);
				} else {
					this.onFileCompleteError(error, file);
				}
			},

			/**
			 * ########## ####### ########### ###### ############## ######, ########## ## ########## ######.
			 * @protected
			 * @virtual
			 * @return {Terrasoft.BaseViewModel} ####### ########### ###### ############## ######, ########## ## ##########
			 * ######.
			 */
			getAddLinkMenuItem: function() {
				return this.getButtonMenuItem({
					Caption: {"bindTo": "Resources.Strings.AddLinkCaption"},
					Click: {"bindTo": "addLinkRecord"},
					Visible: {"bindTo": "getAddRecordButtonVisible"}
				});
			},

			/**
			 * Sets specified attributes, whis are needed for vanillabox plugin.
			 * @return {Object} Vanillabox configuration object.
			 * @protected
			 */
			setVanillaboxAttribute: function() {
				var groupId = this._getMessageFilesGroupId();
				var vanillaboxSelector = this.Ext.String.format("[vngrop]");
				if (this._isJqueryLoaded()) {
					var vanillaboxImages = $(".entity-image-view-class.vanillabox-selector").not(vanillaboxSelector);
					vanillaboxImages.attr("vngrop", groupId);
					vanillaboxImages.css("cursor", "pointer");
					vanillaboxImages.each(function(index, image) {
						image.setAttribute("href", image.src);
					});
				}
			},

			// endregion

			// region Methods: Private

			/**
			 * @private
			 */
			_getDefaultGridViewColumns: function () {
				var defColumns = Terrasoft.map(this.defaultGridColumnNames, function(columnName) {
					return Terrasoft.deepClone(this.columns[columnName]);
				}, this);
				return _.compact(defColumns);
			},

			/**
			 * ######### ############ #### ########.
			 * @private
			 * @param {Object} item ########## # ####.
			 * @param {String} item.EntityName ######## ########.
			 * @param {String} item.MenuItemCaption ####### # #### ############## ######.
			 * @param {String} item.SysSettingImage ######### ######### # ############ ########.
			 * @param {String} item.Position ####### ########### # #### ############## ######.
			 */
			addEntityType: function(item) {
				this.entityTypeConfig.add(item.get("EntityName"), {
					menuItemCaption: item.get("MenuItemCaption"),
					sysSettingImage: item.get("SysSettingImage"),
					position: item.get("Position")
				}, this);
			},

			/**
			 * @private
			 */
			_onQueryErrorResponse: function(response) {
				var exceptionInfo = {};
				if (response.errorInfo && response.errorInfo.message) {
					Ext.apply(exceptionInfo, {
						message: response.errorInfo.message
					});
				}
				throw new Terrasoft.UnknownException(exceptionInfo);
			},

			/**
			 * Returns the configuration of the link in the registry cell.
			 * @private
			 * @param {Terrasoft.BaseViewModel} item Record, click on which is processed.
			 */
			getColumnLinkConfig: function(item) {
				this.defineEntityType(item);
				const id = item.get("Id");
				const name = item.get("Name");
				let target = "_self";
				const click = null;
				let link;
				if (this.isFile) {
					link = Terrasoft.FileDownloader.getFileLink(this.entitySchema.uId, id);
				}
				if (this.isLink) {
					link = Terrasoft.addProtocolPrefix(name);
					target = "_blank";
				}
				if (this.isEntityLink) {
					const config = this.getEntityLinkConfigById(id);
					link = config.url;
				}
				return {
					target: target,
					link: link,
					click: click
				};
			},

			/**
			 * ########## ####### ###### #####.
			 * @private
			 * @param {Object} files #####, ############ FileAPI
			 */
			onFileSelect: function(files) {
				if (files.length <= 0) {
					return;
				}
				const config = this.getUploadConfig(files);
				const isNewRecord = this.getIsNewRecord();
				this.set("FileUploadConfig", config);
				if (isNewRecord) {
					const args = {
						isSilent: true,
						messageTags: [this.sandbox.id]
					};
					this.sandbox.publish("SaveRecord", args, [this.sandbox.id]);
				} else {
					this.upload(config);
				}
			},

			/**
			 * Gets the state of the current record.
			 * @private
			 * @return {Boolean} True - is new record.
			 */
			getIsNewRecord: function() {
				const cardState = this.sandbox.publish("GetCardState", null, [this.sandbox.id]);
				return (cardState.state === ConfigurationEnums.CardStateV2.ADD ||
						cardState.state === ConfigurationEnums.CardStateV2.COPY);
			},

			/**
			 * Uploads files using FileAPI.
			 * @private
			 * @param {Object} config File upload configuration.
			 * @param {Function} callback Callback.
			 */
			upload: function(config, callback) {
				this.Terrasoft.ConfigurationFileApi.upload(config, callback);
			},

			/**
			 * ########## ####### ###### ######## ######. ########## ##### ########.
			 * @private
			 */
			onUpload: function() {
				this.showBodyMask();
			},

			/**
			 * ########## Url ########### ########## #####.
			 * @private
			 * @param {String} id ############# #####.
			 * @return {String} ###### ## ###########.
			 */
			getExtensionImageUrl: function(id) {
				return this.Terrasoft.ImageUrlBuilder.getUrl({
					source: this.Terrasoft.ImageSources.ENTITY_COLUMN,
					params: {
						schemaName: "FileExtension",
						columnName: "Data",
						primaryColumnValue: id
					}
				});
			},

			/**
			 * ######### ######### ###### ##########.
			 * @private
			 * @param {Terrasoft.core.collections.Collection} collection ######### ####### ## ####### ##########.
			 * @param {Function} callback ####### ######### ######.
			 */
			fillExtensionsIcons: function(collection, callback) {
				const extensions = this.get("Extensions");
				this.Terrasoft.SysSettings.querySysSettingsItem("FileDetailDefaultIcon", function(response) {
					const defaultIconUrl = response
							? this.getExtensionImageUrl(response.value)
							: this.Terrasoft.ImageUrlBuilder.getUrl(this.get("Resources.Images.DefaultIcon"));
					const defIconId = this.Terrasoft.generateGUID();
					extensions.add(defIconId, {
						"Extension": "default",
						"Url": defaultIconUrl
					});
					collection.each(function(item) {
						const extensionId = item.get("Id");
						const extensionName = item.get("Name").toLowerCase();
						const extensionUrl = this.getExtensionImageUrl(extensionId);
						if (extensionName !== "default") {
							extensions.add(extensionId, {
								"Extension": extensionName,
								"Url": extensionUrl
							});
						}
					}, this);
					if (callback) {
						callback.call(this);
					}
				}, this);
			},

			/**
			 * ######### Url ###### ########## ######.
			 * @private
			 * @param {Function} callback
			 */
			loadExtensions: function(callback) {
				const esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: "FileExtension"
				});
				esq.addColumn("Id");
				esq.addColumn("Name");
				esq.getEntityCollection(function(result) {
					if (result.success && result.collection) {
						this.fillExtensionsIcons(result.collection, callback);
					} else {
						Ext.callback(callback, this);
					}
				}, this);
			},

			/**
			 * ########## ########## #####.
			 * @private
			 * @param {String} imageName ######## ###########.
			 * @return {String} ##########.
			 */
			getExtensionFromName: function(imageName) {
				return imageName ? imageName.substring(imageName.lastIndexOf(".") + 1, imageName.length) : "";
			},

			/**
			 * ######### ########## ##### ## ### ###########.
			 * @private
			 * @param {String} extension ##########.
			 * @return {Boolean} ######### (true - ## ###########, false - ###########).
			 */
			isFileNotImage: function(extension) {
				return (extension.match(/(jpg|png|gif|bmp|jpeg)$/i) === null);
			},

			/**
			 * Determines, that file is an image, checking its extension.
			 * @private
			 * @param {String} extension File xtension.
			 * @return {Boolean} True, if file is image.
			 */
			_isFileImage: function(extension) {
				return !this.isFileNotImage(extension);
			},

			/**
			 * Initialize query columns.
			 * @private
			 * @param {Terrasoft.data.queries.EntitySchemaQuery} esq Entity schema query.
			 */
			initLoadFilesQueryColumns: function(esq) {
				if (!esq.columns.contains(this.primaryDisplayColumnName)) {
					esq.addColumn(this.primaryDisplayColumnName);
				}
				if (!esq.columns.contains("Type")) {
					esq.addColumn("Type");
				}
				if (!esq.columns.contains("CreatedBy")) {
					esq.addColumn("CreatedBy");
				}
				if (!esq.columns.contains("Notes")) {
					esq.addColumn("Notes");
				}
			},

			/**
			 * ########## ######## #######.
			 * @private
			 * @param {String} mode #####.
			 * @return {String} ######## #######.
			 */
			getDetailMarkerValue: function(mode) {
				const caption = this.get("Resources.Strings.Caption");
				return this.Ext.String.format("{0} {1}", caption, mode);
			},

			/**
			 * Changes detail mode.
			 * @private
			 * @param {String} value New mode.
			 */
			changeDetailMode: function(value) {
				const mode = this.get("Mode");
				if (value === mode) {
					return;
				}
				this.set("Mode", value);
				this.deselectRows();
				this.set("isImageManagerDetailView", mode === "listed");
				this.reloadCollectionData();
			},

			/**
			 * Sets tiled mode.
			 * @private
			 */
			setTiledMode: function() {
				this.changeDetailMode("tiled");
			},

			/**
			 * Sets listed mode.
			 * @private
			 */
			setListedMode: function() {
				this.changeDetailMode("listed");
			},

			/**
			 * Sets the default mode.
			 * @private
			 */
			setDefaultMode: function() {
				this.setListedMode();
			},

			/**
			 * ######### ######### ######.
			 * @private
			 * @param {Terrasoft.BaseViewModelCollection} [currentCollection]
			 */
			reloadCollectionData: function(currentCollection) {
				const collection = this.Ext.create("Terrasoft.BaseViewModelCollection");
				const gridDataCollection = this.getGridData();
				collection.loadAll(gridDataCollection);
				if (currentCollection) {
					collection.loadAll(currentCollection);
				}
				gridDataCollection.clear();
				collection.each(this.decorateItem, this);
				gridDataCollection.loadAll(collection);
			},

			/**
			 * ########## ####### ##########.
			 * @private
			 * @param {Terrasoft.model.BaseViewModel} item ####### ######### #####.
			 */
			decorateItem: function(item) {
				const itemName = item.get("Name");
				const itemType = item.get("Type");
				if (!this.get("SelectedRows")) {
					this.set("SelectedRows", []);
				}
				item.columns = this.columns;
				item.detail = this;
				item.isMultiSelect = this.get("MultiSelect");
				item.mode = this.get("Mode");
				if (itemType.value === ConfigurationConstants.FileType.EntityLink) {
					item.set("imageUrl", null);
					return;
				}
				const itemExtension = (itemType.value !== ConfigurationConstants.FileType.Link)
						? this.getExtensionFromName(itemName)
						: "url";
				if (this.isFileNotImage(itemExtension)) {
					const extensionsCollection = this.get("Extensions");
					const extensions = extensionsCollection.getItems();
					const existedExtensions = extensions.filter(function(extension) {
						return extension.Extension === itemExtension;
					});
					if (existedExtensions.length > 0) {
						item.set("imageUrl", existedExtensions[0].Url);
					} else {
						const defaultExtensions = extensions.filter(function(extension) {
							return extension.Extension === "default";
						});
						const defaultIconUrl = defaultExtensions[0] ? defaultExtensions[0].Url : null;
						item.set("imageUrl", defaultIconUrl);
					}
				}
			},

			/**
			 * ######### ######### ###### ### ########## #############.
			 * @protected
			 */
			loadContainerListData: function() {
				const esq = this.getGridDataESQ();
				this.initQueryColumns(esq);
				this.initQuerySorting(esq);
				this.initQueryFilters(esq);
				this.initQueryOptions(esq);
				this.initQueryEvents(esq);
				const gridData = this.getGridData();
				const recordsCount = gridData.getCount();
				if (recordsCount > this.getRowCount()) {
					esq.rowCount = recordsCount;
				}
				esq.getEntityCollection(function(response) {
					this.destroyQueryEvents(esq);
					this.onGridDataLoaded(response);
				}, this);
			},

			/**
			 * ######### ############ ############# ######## ###########.
			 * @private
			 * @param {Object} itemConfig ###### ## ############ ######## # ContainerList.
			 */

			getItemViewConfig: function(itemConfig, item) {
				var imageWrapClasses = ["entity-image-view-class"];
				if (this._isFileImage(this.getExtensionFromName(item.values.Name))) {
					imageWrapClasses.push("vanillabox-selector");
				}
				const imagesListItemContainer = this.getImagesListItemContainerConfig(imageWrapClasses);
				itemConfig.config = imagesListItemContainer;
			},

			/**
			 * Returns configuration object for elements container.
			 * @private
			 * @param {Array} imageWrapClasses Wrap classes for ImageView component.
			 * @return {Object} Elements container configuration.
			 */
			getImagesListItemContainerConfig: function(imageWrapClasses) {
				const imagesListItemContainer =
						ViewUtilities.getContainerConfig("images-list-item-container", ["image-view-class"]);
				const entityImageWrapContainer =
						ViewUtilities.getContainerConfig("entity-image", ["entity-image-class"]);
				const selectEntityContainer =
						ViewUtilities.getContainerConfig("select-entity-container", ["select-entity-container-class"]);
				const checkBoxConfig = {
					className: "Terrasoft.CheckBoxEdit",
					classes: {wrapClass: ["entity-checked-class"]},
					visible: {"bindTo": "getIsMultiSelect"},
					checkedchanged: {"bindTo": "onSelectItem"},
					checked: {"bindTo": "getCheckItems"}
				};
				selectEntityContainer.items.push(checkBoxConfig);
				const imageContainer = ViewUtilities.getContainerConfig("entity-image-container",
						["entity-image-container-class"]);
				const imageViewConfig = {
					className: "Terrasoft.ImageView",
					imageSrc: {"bindTo": "getEntityImage"},
					classes: {wrapClass: imageWrapClasses},
					click: {"bindTo": "onEntityImageClick"}
				};
				imageContainer.items.push(imageViewConfig);
				imageContainer.afterrender = {"bindTo": "imageContainerRender"};
				imageContainer.afterrerender = {"bindTo": "imageContainerReRender"};
				const linkContainer = ViewUtilities.getContainerConfig("entity-link-container",
						["entity-link-container-class"]);
				linkContainer.afterrender = {"bindTo": "insertEntityLink"};
				linkContainer.afterrerender = {"bindTo": "insertEntityLink"};
				linkContainer.markerValue = {"bindTo": "getEntityText"};
				entityImageWrapContainer.items.push(selectEntityContainer, imageContainer, linkContainer);
				imagesListItemContainer.items.push(entityImageWrapContainer);
				imagesListItemContainer.markerValue = {bindTo: "getEntityText"};
				return imagesListItemContainer;
			},

			/**
			 * Button click event handler "Add File".
			 * @private
			 */
			onAddFileClick: Terrasoft.emptyFn,

			/**
			 * ############## ####### "drag" # "drop" ##########.
			 * @private
			 */
			initDropzoneEvents: function() {
				const dropZone = document.getElementById("DragAndDropContainer");
				if (!dropZone) {
					return;
				}
				if (this.Terrasoft.Features.getIsEnabled("CheckMasterRecordEditRights") &&
						!this.get("CanEditMasterRecord")) {
					return;
				}
				this.Terrasoft.ConfigurationFileApi.initDropzoneEvents(dropZone, function(over) {
					if (over) {
						dropZone.classList.add("dropzone-hover");
					} else {
						dropZone.classList.remove("dropzone-hover");
					}
				}, function(files) {
					this.onFileSelect(files);
				}.bind(this));
			},

			/**
			 * Shows message if errors occured during uploading.
			 * @private
			 * @param {Object} errorLog Contains files which were not uploaded.
			 */
			onCompleteError: function(errorLog) {
				const message = this.getFilesUploadErrorMessage(errorLog);
				const buttons = this._getShowErrorDialogButtons();
				this.showInformationDialog(message, Terrasoft.emptyFn, {
					buttons: buttons,
					handler: function(code) {
						if (code === "ChangeSettingValue") {
							this.onChangeSettingValueHandler();
						}
					}.bind(this)
				});
			},

			/**
			 * @private
			 */
			_getSettingsUrl: function() {
				return Terrasoft.combinePath("CardModuleV2",
						"SysSettingPage", "edit", "68e77c28-2ae0-df11-971b-001d60e938c6");
			},

			/**
			 * Gets files upload error message.
			 * @private
			 * @param {Object} errorLog Contains files which were not uploaded.
			 */
			getFilesUploadErrorMessage: function(errorLog) {
				const space = "\r\n\r\n";
				const errorMessageTemplate = "{0}:\r\n{1}";
				const errorLogItems = errorLog.getItems();
				const groups = Terrasoft.groupBy(errorLogItems, "message");
				let errorMessage = this.get("Resources.Strings.UploadError") + space;
				Terrasoft.each(groups, function(items, groupMessage) {
					const names = this.getFormattedFilesNames(items);
					errorMessage += Ext.String.format(errorMessageTemplate, groupMessage, names);
					errorMessage += space;
				}, this);
				errorMessage += this._getOversizeErrorTipMessage();
				return errorMessage.slice(0, errorMessage.length - space.length);
			},

			/**
			 * @private
			 */
			_getIsOversizedErrorExist: function(filesErrorLog) {
				var errorLog = filesErrorLog || this.$FilesUploadErrorLog;
				return (errorLog && errorLog.any(function(error) {
					return error && error.isFileOversize;
				}, this)) || false;
			},

			/**
			 * @private
			 */
			_getOversizeErrorTipMessage: function(errorLog) {
				const isOversizeExist = this._getIsOversizedErrorExist(errorLog);
				const messageTemplate = "{0}\r\n\r\n";
				if (isOversizeExist) {
					return Ext.String.format(messageTemplate, this.get("Resources.Strings.ChangeFileSizeInfoMessage"));
				} else {
					return Terrasoft.emptyString;
				}
			},

			/**
			 * Gets formatted files' names string.
			 * @private
			 * @param {Array} items Files.
			 * @return {String} Formatted files' names string.
			 */
			getFormattedFilesNames: function(items) {
				const space = "\r\n";
				const names = items.map(function(item) {
					return ("- " + item.file.name);
				}).join(space);
				return names;
			},

			/**
			 * Adds file and error message into file upload log.
			 * @private
			 * @param {String} error Error message.
			 * @param {Object} file File.
			 */
			onFileCompleteError: function(error, file) {
				const errorLog = this.get("FilesUploadErrorLog");
				const defaultMessage = this.get("Resources.Strings.UploadFileError");
				errorLog.add({
					file: file,
					error: error,
					message: defaultMessage
				});
			},

			/**
			 * @private
			 */
			_navigateToChangeSettingPage: function() {
				const hash = this._getSettingsUrl();
				this.sandbox.publish("PushHistoryState", {hash: hash});
			},

			/**
			 * @private
			 */
			_getShowErrorDialogButtons: function() {
				const buttons = [];
				const isOversizeError = this._getIsOversizedErrorExist();
				if (isOversizeError && this.$CanManageSysSettings) {
					const changeSettingButton = Terrasoft.getBlueButtonConfig("ChangeSettingValue",
							this.get("Resources.Strings.ChangeSizeCaption"));
					buttons.push(changeSettingButton, "cancel");
				} else {
					buttons.push("ok");
				}
				return buttons;
			},

			/**
			 * @private
			 */
			_onCanManageSysSettingsComplete: function(result) {
				this.set("CanManageSysSettings", result);
			},

			/**
			 * Gets vanillabox config.
			 * @private
			 * @return {Object} Vanillabox configuration object.
			 */
			_getVanillaboxConfig: function() {
				return Ext.apply({}, this.vanillaboxDefaultConfig);
			},

			/**
			 * Returns group identifier for grouping files from the message.
			 * @private
			 * @return {Guid} Files group identifier.
			 */
			_getMessageFilesGroupId: function() {
				if (this.groupId === null) {
					this.groupId = this.Terrasoft.generateGUID("N");
				}
				return this.groupId;
			},

			/**
			 * Checks jQuery load status.
			 * @return {boolean} False if jQuery isn't loaded.
			 * @private
			 */
			_isJqueryLoaded: function() {
				var $ = window.jQuery || window.$ || undefined;
				if (!$) {
					return false;
				}
				return true;
			},

			/**
			 * Applies vanillabox config.
			 * @private
			 */
			_applyVanillaboxLogic: function() {
				if (this.vanillaboxContainer !== null) {
					this.vanillaboxContainer.dispose();
				}
				var selector = this.Ext.String.format("[vngrop='{0}']", this._getMessageFilesGroupId());
				if (this._isJqueryLoaded()) {
					var $links = $(selector);
					if ($links.length) {
						this.vanillaboxContainer = $links.vanillabox(this._getVanillaboxConfig());
					}
				}
			}

			// endregion
		},

		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "Detail",
				"values": {
					"markerValue": {
						bindTo: "Mode",
						bindConfig: {
							converter: "getDetailMarkerValue"
						}
					}
				}
			},
			{
				"operation": "insert",
				"name": "DragAndDrop Container",
				"parentName": "Detail",
				"propertyName": "items",
				"values": {
					"id": "DragAndDropContainer",
					"selectors": {"wrapEl": "#DragAndDropContainer"},
					"itemType": Terrasoft.ViewItemType.CONTAINER,
					"wrapClass": ["dropzone"],
					"items": [
						{
							"labelClass": ["DragAndDropLabel"],
							"itemType": Terrasoft.ViewItemType.LABEL,
							"caption": {"bindTo": "Resources.Strings.DragAndDropCaption"}
						}
					]
				}
			},
			{
				"operation": "merge",
				"name": "DataGrid",
				"values": {
					"type": "listed",
					"visible": {
						"bindTo": "isImageManagerDetailView",
						"bindConfig": {"converter": "getDataGridVisible"}
					},
					"linkClick": {"bindTo": "linkClicked"}
				}
			},
			{
				"operation": "merge",
				"name": "AddRecordButton",
				"parentName": "Detail",
				"propertyName": "tools",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"tag": "addFileButton",
					"fileUpload": true,
					"filesSelected": {"bindTo": "onFileSelect"},
					"click": {"bindTo": "onAddFileClick"},
					"visible": {"bindTo": "getAddRecordButtonVisible"},
					"imageConfig": {"bindTo": "Resources.Images.AddButtonImage"}
				}
			},
			{
				"operation": "insert",
				"parentName": "Detail",
				"name": "ImageManagerContainer",
				"propertyName": "items",
				"index": 1,
				"values": {
					"generator": "ImageListConfigurationGenerator.generateContainerList",
					"idProperty": "Id",
					"collection": "Collection",
					"observableRowNumber": 100,
					"wrapClassName": ["images-list-class"],
					"onGetItemConfig": "getItemViewConfig",
					"visible": "isImageManagerDetailView",
					"itemsRendered": "itemsRendered"
				}
			},
			{
				"operation": "insert",
				"name": "SetListedModeButton",
				"parentName": "Detail",
				"propertyName": "tools",
				"values": {
					"itemType": this.Terrasoft.ViewItemType.BUTTON,
					"click": {"bindTo": "setListedMode"},
					"visible": {"bindTo": "getToolsVisible"},
					"hint": {"bindTo": "Resources.Strings.ListViewButtonHint"},
					"controlConfig": {
						"imageConfig": {"bindTo": "Resources.Images.ListedViewIcon"}
					},
					"classes": {"wrapperClass": ["listed-mode-button"]},
					"markerValue": "listed"
				}
			},
			{
				"operation": "insert",
				"name": "SetTiledModeButton",
				"parentName": "Detail",
				"propertyName": "tools",
				"values": {
					"itemType": this.Terrasoft.ViewItemType.BUTTON,
					"click": {"bindTo": "setTiledMode"},
					"visible": {"bindTo": "getToolsVisible"},
					"hint": {"bindTo": "Resources.Strings.TileViewButtonHint"},
					"controlConfig": {
						"imageConfig": {"bindTo": "Resources.Images.TiledViewIcon"}
					},
					"classes": {"wrapperClass": ["tiled-mode-button", "disable-left-margin"]},
					"markerValue": "tiled"
				}
			},
			{
				"operation": "remove",
				"name": "FiltersContainer"
			}
		]
		/**SCHEMA_DIFF*/
	};
});
