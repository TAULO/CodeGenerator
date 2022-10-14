
/**
* @class		Ext.ux.FileBrowserPanel
* @extends		Ext.Panel
* @namespace	Ext.ux
*
* FileBrowserPanel
*
* @author		Rocco Bruyn
* @version		0.1.1
*
* @licence		GNU General Public License v3
* 				http://www.gnu.org/licenses/lgpl.html
*/

// Create namespace
Ext.namespace('Ext.ux');

/**
* Create new Extension
*
* @constructor
* @param {Object} config	An object literal config object
*/
Ext.ux.FileBrowserPanel = Ext.extend(Ext.Panel, {
    /**
    * @cfg {String} dataUrl The URL that is used to process data (required)
    */
    dataUrl: '',
    /**
    * @cfg {String} defaultThumbnailImage Default image to use in thumnail view
    */
    defaultThumbnailImage: '../Icons/48/document_blank.png',
    /**
    * @cfg	{Function} fileUploadCallback Function that is used to show a file upload window/dialog
    * Needs to be implemented at construction
    */

    fileUploadWindow: undefined,
    fileUploadButton: undefined,

    fileUploadCallback: function (sender, e) { //Ext.emptyFn,

        var awpath = '/Areas/Content/Plugins/';
        var imagesPath = '/Areas/Content/Images/';
        var win = this.fileUploadWindow;

        if (!win) {
            this.fileUploadWindow = new UploadWindow({
                title: 'Upload dialog',
                applyTo: 'upload-window',
                layout: 'fit',
                closeAction: 'hide',
                frame: true,
                width: 800,
                height: 600,
                gridHeight: 400,
                toggle: sender,
                style: 'margin: 0 auto;',
                //renderTo: 'upload-window',
                flashSwfUploadPath: awpath + 'swfupload.swf',
                flashUploadUrl: 'api/v1/File',
                flashButtonSprite: imagesPath + 'swfupload_browse_button_trans_56x22.png',
                iconStatusAborted: imagesPath + 'cross.png',
                iconStatusDone: imagesPath + 'tick.png',
                iconsStatusError: imagesPath + 'cross.png',
                iconStatusPending: imagesPath + 'hourglass.png',
                iconStatusSending: imagesPath + 'loading.gif',
                standarUploadUrl: 'api/v1/File',
                xhrUploadUrl: 'api/v1/File'
            });
            /*new Ext.Window({
            applyTo: 'upload-window',
            layout: 'fit',
            closeAction: 'hide',
            width: 600,
            height: 400,

            plain: true,
*/

            win = this.fileUploadWindow;

            win.on('close', function () {
                sender.enable();
            });

            win.on('hine', function () {
                sender.enable();
            });
        }

        if (win.isVisible()) {
            win.hide(this, function () {
                //sender.enable();
            });
        } else {
            win.show(this, function () {
                //sender.disable();
            });
        }
    },

    /**
    * Called by Ext when instantiating
    *
    * @private
    * @param {Object} config Configuration object
    */
    initComponent: function () {

        //        Ext.require(['Ext.data.*', 'Ext.grid.*']);
        //        
        //        Ext.define('File', {
        //            extend: 'Ext.data.Model',
        //            fields: [
        //            { name: 'Id', type: 'int' },
        //            { name: 'Name', type: 'string' },
        //            { name: 'Size', type: 'int' },
        //            { name: 'Type', type: 'string' },
        //            { name: 'Date', type: 'date', dateFormat: 'MS' },
        //            { name: 'row_class', type: 'string', defaultValue: 'ux-unknown-file' },
        //            { name: 'Thumbnail', type: 'string', defaultValue: this.defaultThumbnailImage }
        //        ]
        //        });

        var config;

        // create the tree that displays folders
        this.tree = new Ext.tree.TreePanel({
            cls: 'ux-foldertree',
            title: this.il8n.treePanelHeaderText,
            border: false,
            useArrows: true,
            enableDrop: true,
            dropConfig: {
                ddGroup: 'fileMoveDD',
                appendOnly: true,
                onNodeDrop: this.onTreeNodeDrop
            },
            loader: new Ext.tree.TreeLoader({
                url: 'api/v1/Folder',
                requestMethod: 'GET',
                listeners: {
                    beforeload: {
                        fn: this.onTreeLoaderBeforeLoad,
                        scope: this
                    }
                }
            }),
            root: new Ext.tree.AsyncTreeNode({
                text: 'Root',
                expanded: true
            }),
            selModel: new Ext.tree.DefaultSelectionModel({
                listeners: {
                    selectionchange: {
                        fn: this.onTreeSelectionChange,
                        scope: this
                    }
                }
            }),
            tools: [{
                id: 'plus',
                qtip: this.il8n.newText,
                handler: this.onPlusToolClick,
                scope: this
            }, {
                id: 'minus',
                qtip: this.il8n.deleteText,
                handler: this.onMinusToolClick,
                scope: this,
                hidden: true
            }, {
                id: 'gear',
                qtip: this.il8n.renameText,
                handler: this.onGearToolClick,
                scope: this,
                hidden: true
            }],
            listeners: {
                contextmenu: {
                    fn: this.onTreeContextMenu,
                    scope: this
                },
                afterrender: {
                    fn: this.onTreeAfterRender,
                    scope: this,
                    single: true
                }
            }
        });

        // create an editor for the tree for modifying folder names
        this.treeEditor = new Ext.tree.TreeEditor(this.tree, {
            allowBlank: false,
            grow: true,
            growMin: 90,
            growMax: 240
        }, {
            completeOnEnter: true,
            cancelOnEsc: true,
            ignoreNoChange: true,
            selectOnFocus: true,
            listeners: {
                beforestartedit: {
                    fn: this.onTreeEditorBeforeStartEdit,
                    scope: this
                },
                beforecomplete: {
                    fn: this.onTreeEditorBeforeComplete,
                    scope: this
                }
            }
        });

        // create a grid that displays files
        this.grid = new Ext.grid.EditorGridPanel({
            cls: 'ux-filebrowser-grid',
            //title: this.il8n.gridPanelHeaderText,
            border: false,
            stripeRows: true,
            enableDragDrop: true,
            trackMouseOver: true,
            ddGroup: 'fileMoveDD',
            colModel: new Ext.grid.ColumnModel([
				{
				    header: this.il8n.gridColumnNameHeaderText,
				    id: 'Name',
				    dataIndex: 'Name',
				    sortable: true,
				    editor: new Ext.form.TextField({ vtype: 'filename' })
				}, {
				    header: this.il8n.gridColumnSizeHeaderText,
				    dataIndex: 'Size',
				    sortable: true,
				    renderer: Ext.util.Format.bytesToSi
				}, {
				    header: this.il8n.gridColumnTypeHeaderText,
				    dataIndex: 'Type',
				    sortable: true
				}, {
				    header: this.il8n.gridColumnDateModifiedText,
				    dataIndex: 'Date',
				    sortable: true,
				    renderer: Ext.util.Format.dateRenderer(this.il8n.displayDateFormat)
				}
			]),
            store: new Ext.data.JsonStore({
                url: 'api/v1/File',
                restful: true,
                //model: 'File',
                /*proxy: {
                type: 'rest',
                url: 'api/v1/File',
                reader: {
                type: 'json',
                root: 'data'
                },
                writer: {
                type: 'json'
                }
                },*/
                /*reader: new Ext.data.JsonReader({
                successProperty: 'success',
                idProperty: 'Id',
                root: 'data',
                fields: [
                { name: 'Id', type: 'int' },
                { name: 'Name', type: 'string' },
                { name: 'Size', type: 'int' },
                { name: 'Type', type: 'string' },
                { name: 'Date', type: 'date', dateFormat: 'MS' },
                { name: 'row_class', type: 'string', defaultValue: 'ux-unknown-file' },
                { name: 'Thumbnail', type: 'string', defaultValue: this.defaultThumbnailImage }
                ]}),
                writer: new Ext.data.JsonWriter({
                encode: false,
                writeAllFields: true
                }),
                autoSave: true,*/
                idProperty: 'Id',
                root: 'data',
                fields: [
                    { name: 'Id', type: 'int' },
					{ name: 'Name', type: 'string' },
					{ name: 'Size', type: 'int' },
					{ name: 'Type', type: 'string' },
					{ name: 'Date', type: 'date' },
					{ name: 'row_class', type: 'string', defaultValue: 'ux-unknown-file' },
					{ name: 'Thumbnail', type: 'string', defaultValue: this.defaultThumbnailImage }
				]/*,
				listeners: {
					beforeload: {
						fn: this.onGridStoreBeforeLoad,
						scope: this
					}
				}*/
            }),
            selModel: new Ext.grid.RowSelectionModel({
                listeners: {
                    selectionchange: {
                        fn: this.onGridSelectionChange,
                        scope: this
                    }
                }
            }),
            viewConfig: {
                forceFit: true,
                emptyText: this.il8n.noFilesText,
                getRowClass: function (record, rowIndex, rowParams, store) {
                    return 'ux-filepanel-iconrow ' + record.get('row_class');
                }
            },
            listeners: {
                render: {
                    fn: this.onGridRender
                },
                rowcontextmenu: {
                    fn: this.onGridContextMenu,
                    scope: this
                },
                afteredit: {
                    fn: this.onGridEditorAfterEdit,
                    scope: this
                }
            }
        });

        // create a panel that will display files as thumbnails
        this.thumbs = new Ext.Panel({
            cls: 'ux-filepanel-thumbnails',
            border: false,
            layout: 'fit',
            items: new Ext.DataView({
                store: this.grid.getStore(),
                tpl: new Ext.XTemplate(
					'<tpl for=".">',
						'<div class="ux-filebrowser-thumb-wrap" id="ux-filebrowser-thumb-{#}">',
							'<div class="ux-filebrowser-thumb"><img src="{Thumbnail}" title="{Name}"></div>',
							'<span class="x-editable">{Name:ellipsis(18)}</span>',
						'</div>',
					'</tpl>',
					'<div class="x-clear"></div>'),
                style: {
                    overflow: 'auto'
                },
                multiSelect: true,
                overClass: 'x-view-over',
                itemSelector: '.ux-filebrowser-thumb-wrap',
                emptyText: '<div class="x-grid-empty">' + this.il8n.noFilesText + '</div>',
                plugins: [
					new Ext.ux.FileBrowserPanel.LabelEditor({
					    dataIndex: 'Id',
					    listeners: {
					        complete: {
					            fn: this.onThumbEditorComplete,
					            scope: this
					        }
					    }
					})
				],
                listeners: {
                    selectionchange: {
                        fn: this.onThumbsSelectionChange,
                        scope: this
                    },
                    render: {
                        fn: this.onThumbRender,
                        scope: this
                    },
                    contextmenu: {
                        fn: this.onThumbsContextMenu,
                        scope: this
                    }
                }
            })
        });

        // config
        config = Ext.apply(this.initialConfig, {
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                width: 200,
                autoScroll: true,
                split: true,
                collapseMode: 'mini',
                items: this.tree
            }, {
                region: 'center',
                layout: 'card',
                activeItem: 0,
                tbar: new Ext.Toolbar({
                    items: [{
                        xtype: 'button',
                        text: this.il8n.renameText,
                        cmd: 'rename',
                        iconCls: 'ux-rename',
                        canToggle: true,
                        disabled: true,
                        handler: this.onGridToolbarClick
                    }, {
                        xtype: 'button',
                        text: this.il8n.deleteText,
                        cmd: 'delete',
                        iconCls: 'ux-delete',
                        canToggle: true,
                        disabled: true,
                        handler: this.onGridToolbarClick
                    }, '-', {
                        xtype: 'button',
                        text: this.il8n.uploadText,
                        iconCls: 'ux-upload',
                        handler: this.fileUploadCallback
                    }, {
                        xtype: 'button',
                        text: this.il8n.downloadText,
                        cmd: 'download',
                        iconCls: 'ux-download',
                        canToggle: true,
                        disabled: true,
                        handler: this.onGridToolbarClick
                    }, '-', {
                        xtype: 'button',
                        text: this.il8n.viewsText,
                        iconCls: 'ux-view',
                        menu: [{
                            text: this.il8n.detailsText,
                            cmd: 'switchView',
                            iconCls: 'ux-details',
                            cardIndex: 0,
                            viewMode: 'details',
                            handler: this.onGridToolbarClick
                        }, {
                            text: this.il8n.thumbnailsText,
                            cmd: 'switchView',
                            iconCls: 'ux-thumbnails',
                            cardIndex: 1,
                            viewMode: 'thumbnails',
                            handler: this.onGridToolbarClick
                        }]
                    }]
                }),
                items: [
					this.grid,
					this.thumbs
				]
            }]
        });

        // appy the config
        Ext.apply(this, config);

        // Call parent (required)
        Ext.ux.FileBrowserPanel.superclass.initComponent.apply(this, arguments);

        // flag indicating which 'viewMode' is selected
        // can be 'details' or 'thumbnails'
        this.viewMode = 'details';

        // install events
        this.addEvents(
        /**
        * @event BeforeCreateFolder
        * Fires before a new folder is created on the server,
        * return false to cancel the event
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Ext.tree.TreeNode}		node The node representing the folder to be created
        */
			'BeforeCreateFolder',

        /**
        * @event BeforeRenameFolder
        * Fires before folder will be renamed on the server,
        * return false to cancel the event
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Ext.tree.TreeNode}		node		The node representing the folder that will be renamed
        * @param {String}					newName		The new folder name
        * @param {String}					oldName		The old folder name
        */
			'BeforeRenameFolder',

        /**
        * @event BeforeDeleteFolder
        * Fires before folder will be deleted on the server,
        * return false to cancel the event
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Ext.tree.TreeNode}		node The node representing the folder that will be deleted
        */
			'BeforeDeleteFolder',

        /**
        * @event BeforeRenameFile
        * Fires before file will be renamed on the server,
        * return false to cancel the event
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Ext.data.Record}			record	The record representing the file that will be renamed
        * @param {String}					newName	The new file name
        * @param {String}					oldName	The old file name
        * */
			'BeforeRenameFile',

        /**
        * @event BeforeDeleteFile
        * Fires before file will be deleted from the server,
        * return false to cancel the event
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Ext.data.Record}			record	The record representing the file that will be deleted
        */
			'BeforeDeleteFile',

        /**
        * @event BeforeDownloadFile
        * Fires before file will be downloaded from the server,
        * return false to cancel the event
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Ext.data.Record}			record	The record representing the file that will be downloaded
        */
			'BeforeDownloadFile',

        /**
        * @event BeforeMoveFile
        * Fires before one or more files will be moved to another folder on the server,
        * return false to cancel the event
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Array}					files				An array containing Ext.data.Record objects representing the file(s) to move
        * @param {String}					sourceFolder		Path of the source folder
        * @param {String}					destinationFolder	Path of the destination folder
        */
			'BeforeMoveFile',

        /**
        * @event CreateFolder
        * Fires when folder was successfully created
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Object}					opts	The options that were used for the original request
        * @param {Object}					o		Decoded response body from the server
        */
			'CreateFolder',

        /**
        * @event RenameFolder
        * Fires when folder was successfully renamed
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Object}					opts	The options that were used for the original request
        * @param {Object}					o		Decoded response body from the server
        */
			'RenameFolder',

        /**
        * @event DeleteFolder
        * Fires when folder was successfully deleted
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Object}					opts	The options that were used for the original request
        * @param {Object}					o		Decoded response body from the server
        */
			'DeleteFolder',

        /**
        * @event RenameFile
        * Fires when file was successfully renamed
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Object}					opts	The options that were used for the original request
        * @param {Object}					o		Decoded response body from the server
        */
			'RenameFile',

        /**
        * @event DeleteFile
        * Fires when file(s) was/were successfully deleted
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Object}					opts	The options that were used for the original request
        * @param {Object}					o		Decoded response body from the server
        */
			'DeleteFile',

        /**
        * @event MoveFile
        * Fires when file(s) was/were successfully moved
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Object}					opts	The options that were used for the original request
        * @param {Object}					o		Decoded response body from the server
        */
			'MoveFile',

        /**
        * @event CreateFolderFailed
        * Fires when creation of folder failed
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Object}					opts	The options that were used for the original request
        * @param {Object}					o		Decoded response body from the server
        */
			'CreateFolderFailed',

        /**
        * @event RenameFolderFailed
        * Fires when renaming folder failed
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Object}					opts	The options that were used for the original request
        * @param {Object}					o		Decoded response body from the server
        */
			'RenameFolderFailed',

        /**
        * @event DeleteFolderFailed
        * Fires when deleting folder failed
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Object}					opts	The options that were used for the original request
        * @param {Object}					o		Decoded response body from the server
        */
			'DeleteFolderFailed',

        /**
        * @event RenameFileFailed
        * Fires when renaming file failed
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Object}					opts	The options that were used for the original request
        * @param {Object}					o		Decoded response body from the server
        */
			'RenameFileFailed',

        /**
        * @event DeleteFileFailed
        * Fires when deleting file(s) failed
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Object}					opts	The options that were used for the original request
        * @param {Object}					o		Decoded response body from the server
        */
			'DeleteFileFailed',

        /**
        * @event MoveFileFailed
        * Fires when moving file(s) failed
        *
        * @param {Ext.ux.FileBrowserPanel}	this
        * @param {Object}					opts	The options that were used for the original request
        * @param {Object}					o		Decoded response body from the server
        */
			'MoveFileFailed'
		);

    }, // eo function initComponent

    /**
    * Event handler for when 'plus' tool in the tree header is clicked
    * Invokes creation of new folder
    *
    * @private
    * @param	{Ext.EventObject}	evt		The click event
    * @param	{Ext.Element}		toolEl	The tool element
    * @param	{Ext.Panel}			panel	The host panel
    * @param	{Ext.Panel}			tc		The tool config object
    * @returns	{Void}
    */
    onPlusToolClick: function (evt, toolEl, panel, tc) {
        var node;
        node = this.tree.getSelectionModel().getSelectedNode();
        this.invokeCreateFolder(node);
    }, // eo function onPlusToolClick

    /**
    * Event handler for when 'minus' tool in the tree header is clicked
    * Invokes deletion of selected folder
    *
    * @private
    * @param	{Ext.EventObject}	evt		The click event
    * @param	{Ext.Element}		toolEl	The tool element
    * @param	{Ext.Panel}			panel	The host panel
    * @param	{Ext.Panel}			tc		The tool config object
    * @returns	{Void}
    */
    onMinusToolClick: function (evt, toolEl, panel, tc) {
        var node;
        node = this.tree.getSelectionModel().getSelectedNode();
        this.deleteFolder(node);
    }, // oe onMinusToolClick

    /**
    * Event handler for when 'gear' tool in the tree header is clicked
    * Invokes renaming of selected folder
    *
    * @private
    * @param	{Ext.EventObject}	evt		The click event
    * @param	{Ext.Element}		toolEl	The tool element
    * @param	{Ext.Panel}			panel	The host panel
    * @param	{Ext.Panel}			tc		The tool config object
    * @returns	{Void}
    */
    onGearToolClick: function (evt, toolEl, panel, tc) {
        var node;
        node = this.tree.getSelectionModel().getSelectedNode();
        this.treeEditor.triggerEdit(node);
    }, // eo function onGearToolClick

    /**
    * Event handler for when tree node is right-clicked
    * Shows context menu
    *
    * @private
    * @param	{Ext.tree.TreeNode}	node	Tree node that was right-clicked
    * @param	{Ext.EventObject}	evt		Event object
    * @returns	{Void}
    */
    onTreeContextMenu: function (node, evt) {
        var contextMenu;

        evt.stopEvent();
        node.select();

        contextMenu = this.getTreeContextMenu();
        contextMenu.find('text', this.il8n.renameText)[0].setDisabled(node.isRoot);
        contextMenu.find('text', this.il8n.deleteText)[0].setDisabled(node.isRoot);
        contextMenu.showAt(evt.getXY());
    }, // eo function onTreeContextMenu

    /**
    * Event handlers for when grid row is right-clicked
    * Shows context menu
    *
    * @private
    * @param	{Ext.grid.GridPanel}	grid		Grid panel that was right-clicked
    * @param	{Integer}				rowIndex	Index of the selected row
    * @param	{Ext.EventObject}		evt			Event object
    * @returns	{Void}
    */
    onGridContextMenu: function (grid, rowIndex, evt) {
        var contextMenu;

        evt.stopEvent();
        grid.getSelectionModel().selectRow(rowIndex);

        contextMenu = this.getGridContextMenu();
        contextMenu.rowIndex = rowIndex;
        contextMenu.showAt(evt.getXY());
    }, // eo function onGridContextMenu

    /**
    * @private
    * @param	{Ext.DataView}		dataView	The containing data view
    * @param	{Number}			index		Index of the node that was right clicked
    * @param	{HTMLElement}		node		The node that was right clicked
    * @param	{Ext.EventObject}	evt			Event object
    * @returns	{Void}
    */
    onThumbsContextMenu: function (dataView, index, node, evt) {
        var contextMenu;

        evt.preventDefault();
        dataView.select(node);

        contextMenu = this.getGridContextMenu();
        contextMenu.dataView = dataView;
        contextMenu.node = node;
        contextMenu.showAt(evt.getXY());
    }, // eo function onThumbsContextMenu

    /**
    * Event handler for when tree-specific contextmenu item is clicked
    * Delegates actions for menu items to other methods
    *
    * @private
    * @param 	{Ext.menu.Menu}		menu		he context menu
    * @param	{Ext.menu.Item}		menuItem	The menu item that was clicked
    * @param	{Ext.EventObject}	evt			Event object
    * @returns	{Void}
    */
    onTreeContextMenuClick: function (menu, menuItem, evt) {
        var node;
        node = this.tree.getSelectionModel().getSelectedNode();
        switch (menuItem.cmd) {
            case 'new':
                this.invokeCreateFolder(node);
                break;
            case 'rename':
                this.treeEditor.triggerEdit(node);
                break;

            case 'delete':
                this.deleteFolder(node);
                break;
        }

    }, // eo function onTreeContextMenuClick

    /**
    * Event handler for when grid-specific contentmenu item is clicked
    * Delegates actions for menu items to other methods
    *
    * @private
    * @param 	{Ext.menu.Menu}		menu		he context menu
    * @param	{Ext.menu.Item}		menuItem	The menu item that was clicked
    * @param	{Ext.EventObject}	evt			Event object
    * @returns	{Void}
    */
    onGridContextMenuClick: function (menu, menuItem, evt) {
        var colIndex, labelEditor, record, el, records;
        switch (menuItem.cmd) {
            case 'rename':
                if (this.viewMode === 'details') {
                    colIndex = this.grid.getColumnModel().getIndexById('Name');
                    this.grid.startEditing(menu.rowIndex, colIndex);
                } else if (this.viewMode === 'thumbnails') {
                    // get LabelEditor from DataView (first plugin)
                    // and the record that is represented by the right-clicked node
                    labelEditor = menu.dataView.plugins[0];
                    record = menu.dataView.getRecord(menu.node);

                    // get the <span> that contains the text
                    el = Ext.DomQuery.selectNode(labelEditor.labelSelector, menu.node);

                    // invoke editing
                    labelEditor.startEdit(el, record.get('Name'));
                    labelEditor.activeRecord = record;
                }
                break;

            case 'delete':
                if (this.viewMode === 'details') {
                    records = this.grid.getSelectionModel().getSelections();
                } else if (this.viewMode === 'thumbnails') {
                    records = menu.dataView.getSelectedRecords();
                }
                this.deleteFile(records);
                break;

            case 'download':
                if (this.viewMode === 'details') {
                    record = this.grid.getSelectionModel().getSelected();
                } else if (this.viewMode === 'thumbnails') {
                    record = menu.dataView.getRecord(menu.node);
                }
                this.downloadFile(record);
                break;

            default:
                break;
        }
    }, // eo function onGridContextMenuClick

    /**
    * Event handler for all button that are clicked in the grid toolbar
    *
    * @private
    * @param	{Ext.Button}		button	The button that was clicked
    * @param	{Ext.EventObject}	evt		The click event
    * @returns	{Void}
    */
    onGridToolbarClick: function (button, evt) {
        var rowIndex, colIndex, dataView, labelEditor, node, record, el, records;
        switch (button.cmd) {
            case 'rename':
                if (this.viewMode === 'details') {
                    rowIndex = this.grid.getSelectionModel().last;
                    colIndex = this.grid.getColumnModel().getIndexById('Name');
                    this.grid.startEditing(rowIndex, colIndex);
                } else if (this.viewMode === 'thumbnails') {
                    // get the DataView from the thumbs panel (first item)
                    // then get the LabelEditor from the DataView (first plugin)
                    dataView = this.thumbs.get(0);
                    labelEditor = dataView.plugins[0];

                    // get the first selected node which is an HTMLElement
                    // and the record that is represents
                    node = dataView.getSelectedNodes()[0];
                    record = dataView.getRecord(node);

                    // get the <span> that contains the text
                    el = Ext.DomQuery.selectNode(labelEditor.labelSelector, node);

                    // make sure only one node is selected
                    dataView.select(node);

                    // invoke editing
                    labelEditor.startEdit(el, record.get('Name'));
                    labelEditor.activeRecord = record;
                }
                break;

            case 'delete':
                if (this.viewMode === 'details') {
                    records = this.grid.getSelectionModel().getSelections();
                } else if (this.viewMode === 'thumbnails') {
                    dataView = this.thumbs.get(0);
                    records = dataView.getSelectedRecords();
                }
                this.deleteFile(records);
                break;

            case 'download':
                if (this.viewMode === 'details') {
                    record = this.grid.getSelectionModel().getSelected();
                } else if (this.viewMode === 'thumbnails') {
                    dataView = this.thumbs.get(0);
                    record = dataView.getSelectedRecords()[0];
                }
                this.downloadFile(record);
                break;

            case 'switchView':
                this.grid.getSelectionModel().clearSelections();
                this.thumbs.get(0).clearSelections();

                this.find('region', 'center')[0].getLayout().setActiveItem(button.cardIndex);
                this.viewMode = button.viewMode;
                break;

            default:
                break;
        }

    }, // eo function onGridToolbarClick

    /**
    * Event handler for when editit of treenode is initiated, but before the value changes
    * Checks if node is not the root node, since it's not allowed to change that
    *
    * @param	{Ext.tree.TreeEditor}	editor	The tree editor
    * @param	{Ext.Element}			boundEl	Underlying element
    * @param	{Mixed}					value	Field value
    * @returns	{Boolean}						Proceed?
    */
    onTreeEditorBeforeStartEdit: function (editor, boundEl, value) {
        return (editor.editNode.isRoot) ? false : true;
    }, // eo function onTreeEditorBeforeStartEdit

    /**
    * Event handler for when node has been edited but change is not yet been
    * reflected in the underlying field
    * Return false to undo editing
    *
    * @private
    * @param	{Ext.tree.TreeEditor}	editor		The tree editor where the node was edited
    * @param	{String}				newValue	New value of the node
    * @param	{String}				oldValue	Old value of the node
    * @returns	{Boolean}							Proceed?
    */
    onTreeEditorBeforeComplete: function (editor, newValue, oldValue) {
        // set the new folder name in the node beiing renamed
        editor.editNode.setText(newValue);
        // check if the node beiing edited is a new or existing folder
        if (editor.editNode.attributes.isNew) {
            this.createFolder(editor.editNode);
            this.treeEditor.ignoreNoChange = true;
        } else {
            this.renameFolder(editor.editNode, newValue, oldValue);
        }

        return true;
    }, // eo function onTreeEditorBeforeComplete

    /**
    * Event handler for when filename is changed
    * Checks if new filename doesn't already exist
    *
    * @private
    * @param	{Ext.EventObject}	event	Edit event object
    * @returns	{Boolean}					Success
    */
    onGridEditorAfterEdit: function (evt) {
        var extensionChanged;
        // check if the extension was changed, we don't allow this
        extensionChanged = this.checkExtensionChanged(evt.value, evt.originalValue);
        if (extensionChanged) {
            this.alertExtensionChanged(evt.originalValue);
            evt.record.reject();
            return false;
        }

        this.renameFile(evt.record, evt.value, evt.originalValue);
        return true;
    }, // eo function onGridEditorAfterEdit

    /**
    * Event handler for when thumbnail has been edited
    * Return false to undo editing
    *
    * @private
    * @param	{Ext.Editor}	editor		The LabelEditor
    * @param	{String}		newValue	New value of the file
    * @param	{String}		oldValue	Old value of the file
    * @returns	{Boolean}					Proceed
    */
    onThumbEditorComplete: function (editor, newValue, oldValue) {
        var extensionChanged;
        // check if the extension of the file was not changed, we dont allow this
        extensionChanged = this.checkExtensionChanged(newValue, oldValue);
        if (extensionChanged) {
            this.alertExtensionChanged(oldValue);
            return false;
        }

        // set the new filename in the record beiing modified
        editor.activeRecord.set(editor.dataIndex, newValue);
        this.renameFile(editor.activeRecord, newValue, oldValue);
        return true;
    }, // eo function onThumbEditorComplete

    /**
    * Event handler for when the selection changes in the tree
    * Appends the folder path of the selected node to the request
    * Causes files to be loaded in the grid for selected node
    * Toggles displaying of 'minus' and 'gear' tools depending on selection
    *
    * @private
    * @param	{Ext.tree.DefaultSelectionModel}	sm		Selection model
    * @param	{Ext.tree.TreeNode}					node	The selected tree node
    * @returns	{Void}
    */
    onTreeSelectionChange: function (sm, node) {
        this.grid.getStore().baseParams.path = sm.getSelectedNode().getPath('text');
        this.grid.getStore().load();
        this.tree.getTool('minus').setDisplayed((!node.isRoot));
        this.tree.getTool('gear').setDisplayed((!node.isRoot));
    }, // eo function onTreeSelectionChange

    /**
    * Event handler for when selection in the grid changes
    * En- or disables buttons in the toolbar depending on selection in the grid
    *
    * @private
    * @param	{Ext.grid.RowSelectionModel} sm The selection model
    * @returns	{Void}
    */
    onGridSelectionChange: function (sm) {
        if (sm.hasSelection()) {
            this.enableGridToolbarButtons();
        } else {
            this.disableGridToolbarButtons();
        }
    }, // eo function onGridSelectionChange

    /**
    * Event handler for when the selection of the thumbnails changes
    * En- or disables buttons in the toolbar depending on the selections
    *
    * @private
    * @param	{Ext.DataView}	dataView	The dataview that contains the thumbnails
    * @param	{Array}			selections	The selected nodes
    * @returns	{Void}
    */
    onThumbsSelectionChange: function (dataView, selections) {
        if (selections.length > 0) {
            this.enableGridToolbarButtons();
        } else {
            this.disableGridToolbarButtons();
        }
    }, // eo function onThumbsSelectionChange

    /**
    * Event handler for when the tree is about to load new data
    * Appends the folder path of the selected node to the request
    *
    * @private
    * @param	{Ext.tree.TreeLoader}	TreeLoader	The Treeloader
    * @param	{Ext.tree.TreeNode}		node		The selected node
    * @param	{Object}				callback	Callback function specified in the 'load' call from the treeloader
    * @returns	{Void}
    */
    onTreeLoaderBeforeLoad: function (treeLoader, node, callback) {
        treeLoader.baseParams.action = 'LoadFolder';
        treeLoader.baseParams.path = node.getPath('text');
    }, // eo function onTreeLoaderBeforeLoad

    /**
    * Event handler for when the grid is about to load new data
    * Appends the folder path of the selected node to the request
    *
    * @private
    * @param	{Ext.data.JsonStore}	store	The store object
    * @param	{Object}				opts	Loading options
    * @returns	{Void}
    */
    onGridStoreBeforeLoad: function (store, opts) {
        /*
        var node;
        store.baseParams.action = 'get-files';
		
        node = this.tree.getSelectionModel().getSelectedNode();
		
        //store.baseParams.path = this.tree.getSelectionModel().getSelectedNode().getPath('text');
        store.setBaseParam('path', node.getPath('text'));
        console.log('gridBeforeload');
        console.log(store.baseParams);
        */
    }, // eo function onGridStoreBeforeLoad
    /**
    * Event handler for when the tree is renderer
    * Selects the root node, causing the files in the root to be loaded
    *
    * @private
    * @param	{Ext.tree.TreePanel} tree The tree panel
    * @returns	{Void}
    */
    onTreeAfterRender: function (tree) {
        tree.getSelectionModel().select(tree.root);
    }, // eo function onTreeRender

    /**
    * Event handler when the grid is rendered
    * Creates a new tooltip that shows on the grid rows
    *
    * @private
    * @param	{Ext.grid.GridPanel} grid The grid panel
    * @returns	{Void}
    */
    onGridRender: function (grid) {
        this.tip = new Ext.ToolTip({
            view: this.getView(),
            target: this.getView().mainBody,
            delegate: '.x-grid3-row',
            renderTo: Ext.getBody(),
            listeners: {
                beforeshow: function (tip) {
                    var text;
                    text = Ext.DomQuery.selectValue('td:first div', tip.triggerElement);
                    tip.body.update(text);
                }
            }
        });
    }, // eo function onGridRender

    /**
    * Event handler for when the thumbnail panel is rendered
    * Configures dragzone for dataview
    *
    * @private
    * @param	{Ext.DataView} dataView	The DataView from the panel
    * @returns	{Void}
    */
    onThumbRender: function (dataView) {
        // configure new DragZone object
        dataView.dragZone = new Ext.dd.DragZone(dataView.getEl(), {
            /**
            * DragDrop group this zone belongs to
            */
            ddGroup: 'fileMoveDD',

            /**
            * Implementation of getDragData
            * Returns an object literal containing information about what is being dragged
            *
            * @param	{Ext.EventObject} evt	MouseDown event
            * @returns	{Object}				Object with drag data
            */
            getDragData: function (evt) {
                var sourceEl, dragProxyHtml;
                // get the event target, that be the item that is beiing dragged
                sourceEl = evt.getTarget(dataView.itemSelector);
                if (sourceEl) {
                    // if nothing is selected, select the node beiing dragged
                    // else/if multiple nodes are selected and the node beiing dragged is outside the selection,
                    // select the node beiing dragged
                    if (dataView.getSelectedNodes().length === 0) {
                        dataView.select(sourceEl);
                    } else if (!evt.ctrlKey && !evt.shiftKey &&
							  dataView.getSelectedNodes().length > 0 &&
							  dataView.getSelectedNodes().indexOf(sourceEl) === -1) {
                        dataView.select(sourceEl);
                    }

                    // clone the node to use as dragProxy
                    dragProxyHtml = sourceEl.cloneNode(true);
                    dragProxyHtml.id = Ext.id();

                    // compose and return dragData
                    return {
                        ddel: dragProxyHtml,
                        sourceEl: sourceEl,
                        repairXY: Ext.fly(sourceEl).getXY(),
                        sourceStore: dataView.store,
                        draggedRecord: dataView.getRecord(sourceEl),
                        selections: dataView.getSelectedRecords()
                    };
                }

                return null;
            },

            /**
            * Gets the XY position used to restore the drag in case of invalid drop
            *
            * @returns	{Array}	XY location
            */
            getRepairXY: function () {
                return this.dragData.repairXY;
            }
        });
    }, // onThumbRender

    /**
    * Event handler for when a file from the grid is dropped on a folder
    * in the tree
    *
    * @private
    * @param	{Object}			nodeData	Custom data associated with the drop node
    * @param	{Ext.dd.DragSource}	source		The source that was dragged over this dragzone
    * @param	{Ext.EventObject}	evt			The Event object
    * @param	{Object}			data		Object containing arbitrairy data supplied by drag source
    * @returns	{Boolean}
    */
    onTreeNodeDrop: function (nodeData, source, evt, data) {
        var from, to;
        // get the source- and destination folder
        from = this.tree.getSelectionModel().getSelectedNode().getPath('text');
        to = nodeData.node.getPath('text');

        // move the file
        this.moveFile(data.selections, from, to);
        return true;
    }, // eo function onTreeNodeDrop

    /**
    * Gets and lazy creates context menu for folder tree
    *
    * @private
    * @returns {Ext.menu.Menu} Context menu
    */
    getTreeContextMenu: function () {

        if (!this.treeContextMenu) {
            this.treeContextMenu = new Ext.menu.Menu({
                items: [{
                    text: this.il8n.newText,
                    cmd: 'new',
                    iconCls: 'ux-newfolder'
                }, {
                    text: this.il8n.renameText,
                    cmd: 'rename',
                    iconCls: 'ux-RenameFolder'
                }, {
                    text: this.il8n.deleteText,
                    cmd: 'delete',
                    iconCls: 'ux-DeleteFolder'
                }],
                listeners: {
                    click: {
                        fn: this.onTreeContextMenuClick,
                        scope: this
                    }
                }
            });
        }

        return this.treeContextMenu;
    }, // eo function getTreeContextMenu

    /**
    * Gets and lazy creates context menu for file grid
    *
    * @private
    * @returns {Ext.menu.Menu} Context menu
    */
    getGridContextMenu: function () {

        if (!this.gridContextMenu) {
            this.gridContextMenu = new Ext.menu.Menu({
                items: [{
                    text: this.il8n.renameText,
                    cmd: 'rename',
                    iconCls: 'ux-RenameFile'
                }, {
                    text: this.il8n.deleteText,
                    cmd: 'delete',
                    iconCls: 'ux-DeleteFile'
                }, {
                    text: this.il8n.downloadText,
                    cmd: 'download',
                    iconCls: 'ux-DownloadFile'
                }],
                listeners: {
                    click: {
                        fn: this.onGridContextMenuClick,
                        scope: this
                    }
                }
            });
        }

        return this.gridContextMenu;
    }, // eo function getGridContextMenu

    /**
    * Invokes the creation of a new folder
    *
    * @private
    * @param	{Ext.tree.TreeNode}	node The node under which the new folder needs to be created
    * @returns	{Void}
    */
    invokeCreateFolder: function (node) {
        // expand the selected node, append a new childnode to it and immediately start editing it
        node.expand(false, true, function (node) {
            var newNode = node.appendChild(new Ext.tree.TreeNode({
                text: this.il8n.newFolderText,
                cls: 'x-tree-node-collapsed',
                isNew: true		// flag indicating to create a new folder rather than renaming an existing one
            }));
            this.treeEditor.ignoreNoChange = false;
            this.treeEditor.triggerEdit(newNode);
        }, this);
    }, // eo function invokeCreateFolder

    /**
    * Checks if the extension of a renamed file was not changed
    *
    * @private
    * @param	{String}	newName		New filename
    * @param	{String}	oldName		Old filename
    * @returns	{Boolean}				If extension was changed
    */
    checkExtensionChanged: function (newName, oldName) {
        var matchNew, matchOld;
        matchNew = Ext.form.VTypes.filenameVal.exec(newName);
        matchOld = Ext.form.VTypes.filenameVal.exec(oldName);
        return (matchNew[1] !== matchOld[1]);
    }, // eo function checkExtensionChanged

    /**
    * Alert user that filename cannot be changed because
    * the extension may not change
    *
    * @private
    * @param	{String}	fileName	The original filename
    * @param	{Function}	callback	Optional callback function to execute after the alert
    * @returns	{Void}
    */
    alertExtensionChanged: function (fileName, callback) {
        Ext.Msg.show({
            title: this.il8n.extensionChangeTitleText,
            msg: String.format(this.il8n.extensionChangeMsgText, fileName),
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.ERROR,
            closable: false,
            fn: callback || Ext.EmptyFn
        });
    }, // eo function alertExtensionChanged

    /**
    * Disables buttons in the toolbar that are marked 'toggleable'
    *
    * @private
    * @returns {Void}
    */
    disableGridToolbarButtons: function () {
        var buttons;
        buttons = this.find('region', 'center')[0].getTopToolbar().find('canToggle', true);
        Ext.each(buttons, function (button) {
            button.disable();
        });
    }, // eo function disableGridToolbarButtons

    /**
    * Enables buttons in the toolbar that are marked 'toggleable'
    *
    * @private
    * @returns {Void}
    */
    enableGridToolbarButtons: function () {
        var buttons;
        buttons = this.find('region', 'center')[0].getTopToolbar().find('canToggle', true);
        Ext.each(buttons, function (button) {
            button.enable();
        });
    }, // eo function enableGridToolbarButtons

    showErrorMessage: function () {
        Ext.Msg.show({
            title: this.il8n.actionRequestFailureTitleText,
            msg: this.il8n.actionRequestFailureMsgText,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.ERROR,
            closable: false
        });
    },

    processResponse: function (response) {
        var o = {}, store, record;

        // decode response in try..catch, response might be mangled/incorrect
        // show error message in case of failure
        try {
            o = Ext.decode(response.responseText);
        } catch (e) {

            o = undefined;

            Ext.Msg.show({
                title: this.il8n.actionResponseFailureTitleText,
                msg: this.il8n.actionResponseFailureMsgText,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR,
                closable: false
            });
        }

        return o;
    },

    /**
    * Callback that handles all actions performed on the server (rename, move etc.)
    * Called when Ajax request finishes, regardless if this was a success or not
    *
    * @private
    * @param	{Object}	opts		The options that were used for the original request
    * @param	{Boolean}	success		If the request succeded
    * @param	{Object}	response	The XMLHttpRequest object containing the response data
    * @returns	{Void}
    */

    actionCallback: function (opts, success, response) {
        var o = {}, store, record;

        // check if request was successful
        if (true !== success) {
            Ext.Msg.show({
                title: this.il8n.actionRequestFailureTitleText,
                msg: this.il8n.actionRequestFailureMsgText,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR,
                closable: false
            });
            return;
        }

        // decode response in try..catch, response might be mangled/incorrect
        // show error message in case of failure
        try {
            o = Ext.decode(response.responseText);
        } catch (e) {
            Ext.Msg.show({
                title: this.il8n.actionResponseFailureTitleText,
                msg: this.il8n.actionResponseFailureMsgText,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR,
                closable: false
            });
        }

        var action = (opts.params ? opts.params.Action : opts.jsonData ? opts.jsonData.Action : null) || 'None';

        // check if server reports all went well
        // handle success/failure accordingly
        if (true === o.success) {
            switch (action) {
                case 'CreateFolder':
                    // fire CreateFolder event
                    if (true !== this.eventsSuspended) {
                        this.fireEvent('CreateFolder', this, opts, o);
                    }

                    // remove flag
                    delete opts.node.attributes.isNew;
                    break;
                case 'RenameFolder':
                    // fire RenameFolder
                    if (true !== this.eventsSuspended) {
                        this.fireEvent('RenameFolder', this, opts, o);
                    }
                    break;
                case 'DeleteFolder':
                    // fire DeleteFolder event
                    if (true !== this.eventsSuspended) {
                        this.fireEvent('DeleteFolder', this, opts, o);
                    }

                    // remove node
                    opts.node.parentNode.select();
                    opts.node.remove();
                    break;
                case 'RenameFile':
                    // fire RenameFile event
                    if (true !== this.eventsSuspended) {
                        this.fireEvent('RenameFile', this, opts, o);
                    }

                    // commit the change in the record
                    opts.record.commit();
                    break;
                case 'DeleteFile':
                    // fire DeleteFile event
                    if (true !== this.eventsSuspended) {
                        this.fireEvent('DeleteFile', this, opts, o);
                    }

                    // delete record(s) from the grid
                    store = this.grid.getStore();
                    Ext.each(o.data.successful, function (item, index, allItems) {
                        record = store.getById(item.Id);
                        store.remove(record);
                    });
                    break;
                case 'MoveFile':
                    // fire MoveFile event
                    if (true !== this.eventsSuspended) {
                        this.fireEvent('MoveFile', this, opts, o);
                    }

                    // delete record(s) from the grid
                    store = this.grid.getStore();
                    Ext.each(o.data.successful, function (item, index, allItems) {
                        record = store.getById(item.Id);
                        store.remove(record);
                    });
                    break;
                default:
                    break;
            }
        } else {
            switch (action) {
                case 'CreateFolder':
                    // fire CreateFolderFailed event
                    if (true !== this.eventsSuspended) {
                        this.fireEvent('CreateFolderFailed', this, opts, o);
                    }

                    // remove the node
                    opts.node.remove();
                    break;
                case 'RenameFolder':
                    // fire RenameFolderFailed event
                    if (true !== this.eventsSuspended) {
                        this.fireEvent('RenameFolderFailed', this, opts, o);
                    }

                    // reset name
                    opts.node.setText(opts.oldName);
                    break;
                case 'DeleteFolder':
                    // fire DeleteFolderFailed event
                    if (true !== this.eventsSuspended) {
                        this.fireEvent('DeleteFolderFailed', this, opts, o);
                    }
                    break;
                case 'RenameFile':
                    // fire RenameFileFailed event
                    if (true !== this.eventsSuspended) {
                        this.fireEvent('RenameFileFailed', this, opts, o);
                    }

                    // reject the change in the record
                    opts.record.reject();
                    break;
                case 'DeleteFile':
                    // fire DeleteFileFailed event
                    if (true !== this.eventsSuspended) {
                        this.fireEvent('DeleteFileFailed', this, opts, o);
                    }

                    // delete successfully moved record(s) from the grid
                    store = this.grid.getStore();
                    Ext.each(o.data.successful, function (item, index, allItems) {
                        record = store.getById(item.id);
                        store.remove(record);
                    });
                    break;
                case 'MoveFile':
                    // fire MoveFileFailed event
                    if (true !== this.eventsSuspended) {
                        this.fireEvent('MoveFileFailed', this, opts, o);
                    }

                    // delete successfully moved record(s) from the grid
                    store = this.grid.getStore();
                    Ext.each(o.data.successful, function (item, index, allItems) {
                        record = store.getById(item.id);
                        store.remove(record);
                    });

                    // prompt for overwrite
                    if (o.data.existing.length > 0) {
                        Ext.Msg.show({
                            title: this.il8n.confirmOverwriteTitleText,
                            msg: this.il8n.confirmOverwriteMsgText,
                            buttons: Ext.Msg.YESNO,
                            icon: Ext.Msg.QUESTION,
                            closable: false,
                            scope: this,
                            fn: function (buttonId, text, cfg) {
                                var files, store;
                                if (buttonId === 'yes') {
                                    // create array with remaining files
                                    files = [];
                                    store = this.grid.getStore();
                                    Ext.each(o.data.existing, function (item, index, allItems) {
                                        files.push(store.getById(item.id));
                                    });

                                    // call again, but with overwrite option
                                    this.moveFile(files, opts.params.sourcePath, opts.params.destinationPath, true);
                                }
                            }
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    }, // eo function actionCallback

    /**
    * Create a new folder on the server
    *
    * @private
    * @param	{Ext.tree.TreeNode}	node The node representing the folder to create
    * @returns	{Void}
    */
    createFolder: function (node) {
        // fire BeforeCreateFolder event
        if (true !== this.eventsSuspended &&
		   false === this.fireEvent('BeforeCreateFolder', this, node)) {
            return;
        }

        var jsonData = {
            Action: 'CreateFolder',
            Folder: { Id: 345, Name: '', Path: '' },
            Path: node.getPath('text')
        };

        // send request to server
        Ext.Ajax.request({
            url: 'api/v1/Folder',
            method: 'POST',
            jsonData: jsonData,
            restful: true,
            node: node,
            callback: this.actionCallback,
            scope: this
        });
    }, // eo function createFolder

    /**
    * Renames a given folder on the server
    *
    * @private
    * @param	{Ext.tree.TreeNode}	node	The treenode that needs to be renamed
    * @param	{String}			newName	The old foldername
    * @param	{String}			oldName	The new foldername
    * @returns	{Void}
    */
    renameFolder: function (node, newName, oldName) {
        // fire BeforeRenameFolder event
        if (true !== this.eventsSuspended &&
		   false === this.fireEvent('BeforeRenameFolder', this, node, newName, oldName)) {
            return;
        }

        var jsonData = {
            Action: 'RenameFolder',
            Folder: { Id: node.id || node.data.Id, Name: oldName, Path: node.getPath('text') },
            Name: newName
        };

        // send request to server
        Ext.Ajax.request({
            url: 'api/v1/Folder',
            method: 'PUT',
            jsonData: jsonData,
            restful: true,
            node: node,
            newName: newName,
            oldName: oldName,
            callback: this.actionCallback,
            scope: this,
            params: {
                Action: 'RenameFolder',
                path: node.parentNode.getPath('text'),
                newName: newName,
                oldName: oldName
            }
        });

    }, // eo function renameFolder

    /**
    * Deletes folder from the server
    *
    * @private
    * @param	{Ext.tree.TreeNode}	node The treenode that needs to be deleted
    * @returns	{Void}
    */
    deleteFolder: function (node) {
        // fire BeforeDeleteFolder event
        if (true !== this.eventsSuspended &&
		   false === this.fireEvent('BeforeDeleteFolder', this, node)) {
            return;
        }

        var jsonData = {
            Action: 'DeleteFolder',
            Folder: { Id: 23423, Name:'', Path: node.getPath('text') }
        };

        // confirm removal
        Ext.Msg.show({
            title: this.il8n.confirmDeleteFolderTitleText,
            msg: String.format(this.il8n.confirmDeleteFolderMsgText, node.text),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            closable: false,
            scope: this,
            fn: function (buttonId) {
                if (buttonId === 'yes') {
                    // send request to server
                    Ext.Ajax.request({
                        url: 'api/v1/Folder',
                        method: 'DELETE',
                        jsonData: jsonData,
                        restful: true,
                        node: node,
                        callback: this.actionCallback,
                        scope: this
                    });
                }
            }
        });

    }, // eo function deleteFolder

    /**
    * Renames file on the server
    *
    * @private
    * @param	{Ext.data.Record}	record	Record representing the file that is beiing renamed
    * @param	{String}			newName	New filename
    * @param	{String}			oldName	Old filname
    * @returns	{Void}
    */
    renameFile: function (record, newName, oldName) {
        // fire BeforeRenameFile event
        if (true !== this.eventsSuspended &&
		   false === this.fireEvent('BeforeRenameFile', this, record, newName, oldName)) {
            return;
        }

        // set request data
        var jsonData = {
            Action: "RenameFile",
            Path: this.tree.getSelectionModel().getSelectedNode().getPath('text') + '/',
            Files: [{ Id: record.id || record.data.Id, Name: newName}]
        };

        // send request to server
        Ext.Ajax.request({
            url: 'api/v1/File',
            method: 'PUT',
            jsonData: jsonData,
            restful: true,
            record: record,
            newName: newName,
            oldName: oldName,
            callback: this.actionCallback,
            scope: this
        });

    }, // eo function renameFile

    /**
    * Deletes file from the server
    *
    * @private
    * @param	{Array}	files Array of Ext.data.Record objects representing the files that need to be deleted
    * @returns	{Void}
    */
    deleteFile: function (files) {
        var jsonData, dialogTitle, dialogMsg;
        // fire BeforeDeleteFile event
        if (true !== this.eventsSuspended &&
		   false === this.fireEvent('BeforeDeleteFile', this, files)) {
            return;
        }

        // set request data
        jsonData = {
            Action: "DeleteFile",
            Path: this.tree.getSelectionModel().getSelectedNode().getPath('text') + '/',
            Files: []
        };

        // loop over files array and add request data like:
        Ext.each(files, function (item, index, allItems) {
            jsonData.Files.push({ Id: item.id || item.get('Id'), Name: item.get('Name') });
        });

        // prepare confirmation texts depending on amount of files
        dialogTitle = this.il8n.confirmDeleteSingleFileTitleText;
        dialogMsg = String.format(this.il8n.confirmDeleteSingleFileMsgText, files[0].get('Name'));
        if (files.length > 1) {
            dialogTitle = this.il8n.confirmDeleteMultipleFileTitleText;
            dialogMsg = String.format(this.il8n.confirmDeleteMultipleFileMsgText, files.length);
        }

        // confirm removal
        Ext.Msg.show({
            title: dialogTitle,
            msg: dialogMsg,
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            closable: false,
            scope: this,
            fn: function (buttonId) {
                if (buttonId === 'yes') {
                    // send request to server
                    Ext.Ajax.request({
                        method: 'DELETE',
                        url: 'api/v1/File',
                        jsonData: jsonData,
                        restful: true,
                        callback: this.actionCallback,
                        scope: this
                    });
                }
            }
        });
    }, // eo function deleteFile

    /**
    * Download a file from the server
    * Shamelessly stolen from Saki's FileTreePanel (Saki FTW! :p)
    * But it does exactly what i need it to do, and it does it very well..
    * @see http://filetree.extjs.eu/
    *
    * @private
    * @param	{Ext.data.Record} record Record representing the file that needs to be downloaded
    * @returns	{Void}
    */
    downloadFile: function (record) {
        var id, frame, form, hidden, callback;
        // fire BeforeDownloadFile event
        if (true !== this.eventsSuspended &&
		   false === this.fireEvent('BeforeDownloadFile', this, record)) {
            return;
        }

        // generate a new unique id
        id = Ext.id();

        // create a new iframe element
        frame = document.createElement('iframe');
        frame.id = id;
        frame.name = id;
        frame.className = 'x-hidden';

        // use blank src for Internet Explorer
        if (Ext.isIE) {
            frame.src = Ext.SSL_SECURE_URL;
        }

        // append the frame to the document
        document.body.appendChild(frame);

        // also set the name for Internet Explorer
        if (Ext.isIE) {
            document.frames[id].name = id;
        }

        //  create a new form element
        form = Ext.DomHelper.append(document.body, {
            tag: 'form',
            method: 'post',
            action: this.dataUrl,
            target: id
        });

        // create hidden input element with the 'action'
        hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = 'action';
        hidden.value = 'download-file';
        form.appendChild(hidden);

        // create another hidden element that holds the path of the file to download
        hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = 'path';
        hidden.value = this.getSelectedFilePath();
        form.appendChild(hidden);

        // create a callback function that does some cleaning afterwards
        callback = function () {
            Ext.EventManager.removeListener(frame, 'load', callback, this);
            setTimeout(function () {
                document.body.removeChild(form);
            }, 100);
            setTimeout(function () {
                document.body.removeChild(frame);
            }, 110);
        };

        // attach callback and submit the form
        Ext.EventManager.on(frame, 'load', callback, this);
        form.submit();
    },

    /**
    * Move a file on the server to another folder
    *
    * @private
    * @param	{Array}		files				Array of Ext.data.Record objects representing the files to move
    * @param	{String}	sourceFolder		Source folder
    * @param	{String}	destinationFolder	Destination folder
    * @param	{Boolean}	overwrite			If files should be overwritten in destination, defaults to false
    * @returns	{Void}
    */
    moveFile: function (files, sourceFolder, destinationFolder, overwrite) {
        var params;
        // fire BeforeMoveFile event
        if (true !== this.eventsSuspended &&
		   false === this.fireEvent('BeforeMoveFile', this, files, sourceFolder, destinationFolder)) {
            return;
        }

        // set request data
        var jsonData = {
            Action: 'MoveFile',
            Path: destinationFolder,
            Files: []
            /*overwrite: (true === overwrite) ? true : false*/
        };

        // loop over files array and add request parameters like:
        // files[rec-id] : filename.ext
        Ext.each(files, function (item, index, allItems) {
            jsonData.Files.push({ Id: item.id || item.get('Id'), Name: item.get('Name') });
        });

        // send request to server
        Ext.Ajax.request({
            url: 'api/v1/File',
            method: 'PUT',
            jsonData: jsonData,
            restful: true,
            sourcePath: sourceFolder,
            destinationPath: destinationFolder,
            callback: this.actionCallback,
            scope: this
        });
    }, // eo function moveFile

    /**
    * Refreshes the grid with data from the server
    *
    * @returns	{Void}
    */
    refreshGrid: function () {
        this.grid.getStore().load();
    }, // eo function refreshGrid

    /**
    * Gets the full path of the current selected file
    *
    * @returns {String} The full path of the current selected file
    */
    getSelectedFilePath: function () {
        var node, record, dataView, path;
        // get selected node from the tree
        node = this.tree.getSelectionModel().getSelectedNode();

        // get the selected node from the grid or thumbnails, depending on viewMode
        if (this.viewMode === 'details') {
            record = this.grid.getSelectionModel().getSelected();
        } else if (this.viewMode === 'thumbnails') {
            dataView = this.thumbs.get(0);
            record = dataView.getSelectedRecords()[0];
        }

        // check if they are both present
        if (node === null || record === undefined) {
            return null;
        }

        // construct full path and return it
        path = node.getPath('text') + '/' + record.get('Name');
        return path;
    } // eo function getSelectedFilePath

});                  // eo extend

// register xtype
//Ext.reg('ux-filebrowserpanel', Ext.ux.FileBrowserPanel);

/**
* LabelEditor
* Used for editing the labels of the thumbnails
* Code from ExtJS example website
*
* @class	Ext.ux.FileBrowserPanel.LabelEditor
* @extends	Ext.Editor
*/
Ext.ux.FileBrowserPanel.LabelEditor = Ext.extend(Ext.Editor, {
    alignment: 'tl-tl',
    hideEl: false,
    cls: 'x-small-editor',
    shim: false,
    ignoreNoChange: true,
    completeOnEnter: true,
    cancelOnEsc: true,
    labelSelector: 'span.x-editable',

    constructor: function (cfg, field) {
        Ext.ux.FileBrowserPanel.LabelEditor.superclass.constructor.call(this,
			field || new Ext.form.TextField({
			    allowBlank: false,
			    growMin: 90,
			    growMax: 240,
			    grow: true,
			    selectOnFocus: true,
			    vtype: 'filename'
			}), cfg
		);
    },

    init: function (view) {
        this.view = view;
        view.on('render', this.initEditor, this);
    },

    initEditor: function () {
        this.view.on({
            scope: this,
            containerclick: this.doBlur,
            click: this.doBlur
        });
        this.view.getEl().on('mousedown', this.onMouseDown, this, { delegate: this.labelSelector });
    },

    onMouseDown: function (evt, target) {
        if (!evt.ctrlKey && !evt.shiftKey) {
            var item, record;
            item = this.view.findItemFromChild(target);
            evt.stopEvent();
            record = this.view.store.getAt(this.view.indexOf(item));
            this.startEdit(target, record.data[this.dataIndex]);
            this.activeRecord = record;
        } else {
            evt.preventDefault();
        }
    },

    doBlur: function () {
        if (this.editing) {
            this.field.blur();
        }
    }
}); // eo extend

/**
* Strings for internationalization
*/
Ext.ux.FileBrowserPanel.prototype.il8n = {
    displayDateFormat: 'd/m/Y H:i',
    newText: 'New',
    renameText: 'Rename',
    deleteText: 'Delete',
    uploadText: 'Upload',
    downloadText: 'Download',
    viewsText: 'Views',
    detailsText: 'Details',
    thumbnailsText: 'Thumbnails',
    newFolderText: 'New-Folder',
    noFilesText: 'No files to display',
    treePanelHeaderText: 'Folders',
    gridPanelHeaderText: 'Files',
    gridColumnNameHeaderText: 'Name',
    gridColumnSizeHeaderText: 'Size',
    gridColumnTypeHeaderText: 'Type',
    gridColumnDateModifiedText: 'Date Modified',
    extensionChangeTitleText: 'Error changing extension',
    extensionChangeMsgText: "Cannot rename '{0}'. You cannot change the file extension.",
    confirmDeleteFolderTitleText: 'Confirm folder delete',
    confirmDeleteFolderMsgText: "Are you sure you want to remove the folder '{0}' and all of it's contents?",
    confirmDeleteSingleFileTitleText: 'Confirm file delete',
    confirmDeleteSingleFileMsgText: "Are you sure you want to delete '{0}'?",
    confirmDeleteMultipleFileTitleText: 'Confirm multiple file delete',
    confirmDeleteMultipleFileMsgText: "Are you sure you want to delete these {0} files?",
    confirmOverwriteTitleText: 'Confirm file replace',
    confirmOverwriteMsgText: 'One or more files with the same name already exist in the destination folder. Do you wish to overwrite these?',
    actionRequestFailureTitleText: 'Oh dear..',
    actionRequestFailureMsgText: "It seems like your colleague spilled coffee on your keyboard. We can't send your request until you hang it out to dry",
    actionResponseFailureTitleText: 'PANIC!!',
    actionResponseFailureMsgText: 'Pink elephants are stampeding through the server! Run for the hills!'
};

/**
* Additional Format function(s) to use
*/
Ext.apply(Ext.util.Format, {
    /**
    * Format filesize to human readable format
    * Also deals with filesizes in units larger then MegaBytes
    *
    * @param	{Integer}	size	Filesize in bytes
    * @returns	{String}			Formatted filesize
    */
    bytesToSi: function (size) {
        if (typeof size === 'number' && size > 0) {
            var s, e, r;
            s = ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
            e = Math.floor(Math.log(size) / Math.log(1024));
            r = size / Math.pow(1024, e);
            if (Math.round(r.toFixed(2)) !== r.toFixed(2)) {
                r = r.toFixed(2);
            }
            return r + ' ' + s[e];
        } else {
            return '0 b';
        }
    }
}); // eo apply

/**
* Additional VType(s)to use
*/
Ext.apply(Ext.form.VTypes, {
    /**
    * Validation type for filenames
    * allows only alphanumeric, underscore, hypen and dot
    * Checks for extension between 2 and 4 karakters
    */
    filenameVal: /[a-z0-9_\-\.]+\.([a-z0-9]{2,4})$/i,
    filenameMask: /[a-z0-9_\-\.]/i,
    filenameText: 'Filename is invalid or contains illegal characters',
    filename: function (val, field) {
        return Ext.form.VTypes.filenameVal.test(val);
    }

}); // eo apply

// eof
