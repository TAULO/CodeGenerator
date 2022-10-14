

Ingenix.Security.TabControls.RoleTabs = function(){

    return {
    
        render:function(controller){
            this.controller = controller;
            var client = controller.app.getClient(); 
            var groupSearchWindow;
            var permissionSearchWindow;
            var userSearchWindow;
            var applicationSearchWindow;
            var roleExtensionSearchWindow;
            
            var ctrl = this;
            //now create the tabs
             
             var parentID = controller.parentPanel.id;
             // Main (Tabbed) Panel
             var  tabPanel = new Ext.TabPanel({
                    //renderTo:'tabs-div',
                    autoScroll: false, 
                    frame:false,
                    height:300,
                    margins:'0 0 0 0',
                    activeTab:0,
                    items:[
                     {
			            id:parentID+'_tabUsers',
			            contentEl:parentID+'_tabUsersContent',
    		            title: 'Users Who Are',
    		            closable:false,
    		            autoScroll:true,
    		            iconCls:'userIcon'
   	                 }
   	                 ,
                     {
	                    id:parentID+'_tabExtendsRoles',
	                    contentEl:parentID+'_tabExtendsRolesContent',
	                    title: 'Extends Roles',
	                    closable:false,
	                    autoScroll:true,
	                    iconCls:'roleIcon'
                    },
   	                 {
	                    id:parentID+'_tabGroups',
	                    contentEl:parentID+'_tabGroupsContent',
	                    title: 'In Groups',
	                    closable:false,
	                    autoScroll:true,
	                    iconCls:'groupIcon'
                    }
   	                 ,
                     {
	                    id:parentID+'_tabPermissions',
	                    contentEl:parentID+'_tabPermissionsContent',
	                    title: 'Has Permissions',
	                    closable:false,
	                    autoScroll:true,
	                    iconCls:'permissionIcon'
                    }
                    ,
                     {
	                    id:parentID+'_tabApplications',
	                    contentEl:parentID+'_tabApplicationsContent',
	                    title: 'Accesses Applications',
	                    closable:false,
	                    autoScroll:true,
	                    iconCls:'applicationIcon'
                    }
    		        
                    ]
                });
            
            tabPanel.render(parentID+'_tabs-div');
            
            var tb = new Ext.Toolbar({
                         renderTo:parentID+'_tabtoolbar' ,
                         height:24 ,
                         scope:this
            })

             var handleAddUserEvent = this.handleAddUserEvent;
            var addUserAction = new Ext.Action({
                    text: 'Add User',                
                    cls:'createIcon',
                    handler: function(){
                        tabPanel.setActiveTab(parentID+'_tabUsers');
                        if(!userSearchWindow){
                        
                            var userSearchForm = new Ingenix.Security.UserSearchForm({
                                    applyTo        : parentID+'_userSearchPanel',
                                    deferredRender : false,
                                    border         : false,
                                    frame          : false,
                                    client         : client,
                                    controller     : ctrl
                                });
                                
                            userSearchWindow = new Ext.Window({
                                applyTo     : parentID+'_addUserWindow',
                                layout      : 'fit',
                                width       : 550,
                                height      : 280,
                                closeAction :'hide',
                                plain       : true,
                                items       : userSearchForm,
                                modal      : true,

                                buttons: [{
                                    id       : parentID+'_btnAddUserFromSearch',
                                    text     : 'Add',
                                    disabled : true,
                                    handler  : function(){
                                        userSearchWindow.hide();
                                    }
                                },{
                                    text     : 'Close',
                                    handler  : function(){
                                        userSearchWindow.hide();
                                    }
                                }]
                            });

                            userSearchForm.addButtonListener(userSearchWindow.buttons[0],handleAddUserEvent);
                        }
                        userSearchWindow.show(this);
                    },
                    iconCls: 'blist'
                });
                tb.add(addUserAction);
                
            var handleAddExtendsRoleEvent = this.handleAddExtendsRoleEvent;
            var addRoleExtensionAction = new Ext.Action({
                    text: 'Add Role Extension',                
                    cls:'createIcon',
                    handler: function(){
                        tabPanel.setActiveTab(parentID+'_tabExtendsRoles');
                        if(!roleExtensionSearchWindow){
                        
                            var roleExtensionSearchForm = new Ingenix.Security.RoleSearchForm({
                                    applyTo        : parentID+'_extendsRoleSearchPanel',
                                    deferredRender : false,
                                    border         : false,
                                    frame          : false,
                                    client         : client,
                                    controller     : ctrl
                                });
                                
                            roleExtensionSearchWindow = new Ext.Window({
                                applyTo     : parentID+'_addExtendsRoleWindow',
                                layout      : 'fit',
                                width       : 550,
                                height      : 280,
                                closeAction :'hide',
                                plain       : true,
                                items       : roleExtensionSearchForm,
                                modal      : true,

                                buttons: [{
                                    id       : parentID+'_btnAddRoleExtensionFromSearch',
                                    text     : 'Add',
                                    disabled : true,
                                    handler  : function(){
                                        roleExtensionSearchWindow.hide();
                                    }
                                },{
                                    text     : 'Close',
                                    handler  : function(){
                                        roleExtensionSearchWindow.hide();
                                    }
                                }]
                            });

                            roleExtensionSearchForm.addButtonListener(roleExtensionSearchWindow.buttons[0],handleAddExtendsRoleEvent);
                        }
                        roleExtensionSearchWindow.show(this);
                    },
                    iconCls: 'blist'
                });
                tb.add(addRoleExtensionAction);
             //add group action
              var handleAddGroupEvent=this.handleAddGroupEvent;
               var addGroupAction = new Ext.Action({
                    text: 'Add Group',
                    cls:'createIcon',
                    handler: function(){
                        tabPanel.setActiveTab(parentID+'_tabGroups');
                        if(!groupSearchWindow){
                        
                            var groupSearchForm = new Ingenix.Security.GroupSearchForm({
                                    applyTo        : parentID+'_groupSearchPanel',
                                    deferredRender : false,
                                    border         : false,
                                    frame          : false,
                                    client         : client,
                                    controller     : ctrl
                                });
                                
                            groupSearchWindow = new Ext.Window({
                                applyTo     : parentID+'_addGroupWindow',
                                layout      : 'fit',
                                width       : 550,
                                height      : 280,
                                closeAction :'hide',
                                plain       : true,
                                items       : groupSearchForm,
                                modal      : true,

                                buttons: [{
                                    id       : parentID+'_btnAddGroupFromSearch',
                                    text     : 'Add',
                                    disabled : true,
                                    handler  : function(){
                                        groupSearchWindow.hide();
                                    }
                                },{
                                    text     : 'Close',
                                    handler  : function(){
                                        groupSearchWindow.hide();
                                    }
                                }]
                            });

                            groupSearchForm.addButtonListener(groupSearchWindow.buttons[0],handleAddGroupEvent);
                        }
                        groupSearchWindow.show(this);
                    },
                    iconCls: 'blist'
                });
              tb.add(addGroupAction);
           
            //add the permission
              var handleAddPermissionEvent = this.handleAddPermissionEvent;
              //add permision action
               var addPermissionAction = new Ext.Action({
                    text: 'Add Permission',
                    cls:'createIcon',
                    handler: function(){
                        tabPanel.setActiveTab(parentID+'_tabPermissions');
                        if(!permissionSearchWindow){
                        
                            var permissionSearchForm = new Ingenix.Security.PermissionSearchForm({
                                    applyTo        : parentID+'_permissionSearchPanel',
                                    deferredRender : false,
                                    border         : false,
                                    frame          : false,
                                    client         : client,
                                    controller     : ctrl
                                });
                                
                            permissionSearchWindow = new Ext.Window({
                                applyTo     : parentID+'_addPermissionWindow',
                                layout      : 'fit',
                                width       : 550,
                                height      : 280,
                                closeAction :'hide',
                                plain       : true,
                                items       : permissionSearchForm,
                                modal      : true,

                                buttons: [{
                                    id       : parentID+'_btnAddPermissionFromSearch',
                                    text     : 'Add',
                                    disabled : true,
                                    handler  : function(){
                                        permissionSearchWindow.hide();
                                    }
                                },{
                                    text     : 'Close',
                                    handler  : function(){
                                        permissionSearchWindow.hide();
                                    }
                                }]
                            });
                            permissionSearchForm.addButtonListener(permissionSearchWindow.buttons[0],handleAddPermissionEvent);
                        }
                        permissionSearchWindow.show(this);
                    },
                    iconCls: 'blist'
                });
              tb.add(addPermissionAction);
              
                            
              //application action
               var handleAddApplicationEvent = this.handleAddApplicationEvent;
               
             var addApplicationAction = new Ext.Action({
                    text: 'Add Application',
                    cls:'createIcon',
                    handler: function(){
                        tabPanel.setActiveTab(parentID+'_tabApplications');
                        if(!applicationSearchWindow){
                        
                            var applicationSearchForm = new Ingenix.Security.ApplicationSearchForm({
                                    applyTo        : parentID+'_applicationSearchPanel',
                                    deferredRender : false,
                                    border         : false,
                                    frame          : false,
                                    client         : client,
                                    controller     : ctrl
                                });
                                
                            applicationSearchWindow = new Ext.Window({
                                applyTo     : parentID+'_addApplicationWindow',
                                layout      : 'fit',
                                width       : 550,
                                height      : 280,
                                closeAction :'hide',
                                plain       : true,
                                items       : applicationSearchForm,
                                modal      : true,

                                buttons: [{
                                    id       : parentID+'_btnAddApplicationFromSearch',
                                    text     : 'Add',
                                    disabled : true,
                                    handler  : function(){
                                        applicationSearchWindow.hide();
                                    }
                                },{
                                    text     : 'Close',
                                    handler  : function(){
                                        applicationSearchWindow.hide();
                                    }
                                }]
                            });

                            applicationSearchForm.addButtonListener(applicationSearchWindow.buttons[0],handleAddApplicationEvent);
                        }
                        applicationSearchWindow.show(this);
                    },
                    iconCls: 'blist'
                });
              tb.add(addApplicationAction);
                                        
/********* audit log ********/
             var roleAuditWindow;
    	     var roleId = this.controller.id;
             
             var addGenerateAuditAction = new Ext.Action({
                    text: 'View Security Audit Report',
                    cls:'createIcon',
                    handler: function(){
                         if(!roleAuditWindow){  
                            roleAuditWindow = new Ext.Window({
                                width       : 750,
                                layout  :'fit',
                                height      : 450,
                                closeAction :'close',
                                title       : 'Security Audit Report',
                                plain       : true,
                                items       : auditPanel,
                                modal      : true,
                                buttons: [{
                                    text     : 'Close',
                                    handler  : function(){
                                        roleAuditWindow.close();
                                    }
                                    ,scope:this
                                }
                                ],
                                scope:this,
                                close : function(){ // extend close method
                                    var args = arguments;
                                    Ext.Window.prototype.close.apply(this, args);
                                    roleAuditWindow = null;
                                }
                            });
                        }
                        
                        var auditPanel = new Ext.TabPanel({
                                id:parentID+'_audit-panel',
                                autoDestroy:true,
                                activeTab: 0,
                                autoScroll: false,
                                enableTabScroll:true,
                                height:380,
                                tabPosition:'top',
                                defaults: {
                                bodyStyle: 'padding:1px'
                            }
                            });
                        roleAuditWindow.add(auditPanel);
                        auditPanel.parent = roleAuditWindow;
                        
                        var qTipRenderer = function (value, metadata, record, rowIndex, colIndex, store) {
                                    metadata.attr = 'ext:qtip="' + value + '"';//this does the tooltip on the grid
                                    return value;
                                };
                        var colConfig = [
                        {id:'EntryTime',dataIndex: 'EntryTime',hidden:false,renderer:function(value){return value.format("m/d/y H:i:s");},header: 'TimeStamp',sortable: false,width:110}
                        ,{id:'AppID',dataIndex: 'AppId',hidden:false,renderer:qTipRenderer,header: 'Application',sortable: false,width:150}
                        ,{id:'SessionId',dataIndex: 'SessionId',hidden:true,renderer:qTipRenderer,header: 'Session',sortable: false,width:160}
                        ,{id:'Type',dataIndex: 'Type',hidden:false,renderer:qTipRenderer,header: 'Type',sortable: false,width:120}
                        ,{id:'Result',dataIndex: 'ActionResult',hidden:true,renderer:function(value){return value?"Success":"Failure";},header: 'Result',sortable: false,width:50}
                        ,{id:'Description',dataIndex: 'Description',hidden:false,renderer:qTipRenderer,header: 'Description',sortable: false,width:350}
                        ];
                        var fields = ['Id','AppId','SessionId','Category','Type','ActionResult','Description','AuditObjectValue','AuditObjectType','UserId','EntryTime'];
                        var gridPageSize = 10;
                       
                        // Access Log Json Data Store
                        var a_ds;
                        var a_dataProxy = new Ext.data.HttpProxy({
                            url: 'dservice.aspx?querytype=getroleaccesslog',
                            method : 'post'
                        });
            	                     
                        a_ds = new Ext.data.JsonStore({
                                       root:'records',
                                       totalProperty:'totalResults',
                                       pageSize:gridPageSize,
                                       baseParams:{limit:gridPageSize,role:roleId},
                                       fields:fields, 
                                       proxy:a_dataProxy,
                                       id:'id'                                              
                                    });
                            
                        a_ds.addListener('beforeload',function(store,options){
                                var params = options.params; 
                                if(params == undefined)
                                {
                                    params = {};
                                    params.start=0;
                                }
                                options.params = params;
                            },this
                        );
                                                    
                        var a_pagingBar = new Ext.PagingToolbar({
                                        pageSize: gridPageSize,
                                        store: a_ds,
                                        height: 25,
                                        displayInfo: true,
                                        displayMsg: 'Displaying results {0} - {1} of {2}',
                                        emptyMsg: "No Results",
                                        cursor:0
                                    });
                        
                        var accessLogGrid = new Ext.grid.GridPanel({
                                draggable:false,
                                trackMouseOver:false,
                                columns:colConfig,
                                store:a_ds,
                                header:false,
                                height:320,
                                autoScroll:true,
                                title:'Role History',
                                autoWidth:true,
                                sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
                                view: new Ext.grid.GridView({
                                    forceFit:false}),
                                frame:true,
                                bbar: a_pagingBar,
                                //ctlCls:'grid',
                                loadMask: true,
                                cellPadding:8
                            }); 
                        a_ds.load();

                        auditPanel.add(accessLogGrid); // add access log grid panel
                        auditPanel.activate(accessLogGrid);
                        
                        roleAuditWindow.show(this);
                    },
                    iconCls: 'blist'
                });
              tb.add(addGenerateAuditAction);
              this.roleAuditWindow = roleAuditWindow;
/********* end audit log ********/
             
            //generate the tab grids

            //user grid
              
            var jsonUserGridReader = new Ext.data.JsonReader({
                root: "records",                         // The property which contains an Array of row objects
                id: "Id"
            }, ['Id','Username','LnameFname']
            )
            var id = this.controller.id;
            var userDataStore = new Ingenix.Security.JsonStore({
                url: 'dservice.aspx?querytype=getUsersInRole&client='+this.controller.app.getClient()+'&role='+id,
                reader: jsonUserGridReader,
                root: 'records',
                fields: ['Id','Username','LnameFname']
            })
            userDataStore.load();
            this.userDataStore = userDataStore;
            
            var userGrid = new Ext.grid.GridPanel({
                title: 'Results',
                store: userDataStore,
                columns: [
                    {header: "Id", width: 70, dataIndex: 'Id', sortable: true,hidden:true},
                    {header: "Username", width: 70, dataIndex: 'Username', sortable: true},
                    {header: "Name", width: 120, dataIndex: 'LnameFname', sortable: true}
                ],
                viewConfig: {
                forceFit: true
                },
                sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
                width:400,
                height:250,
                frame:true,
                title:'',
                iconCls:'icon-grid'
            });
            userGrid.addListener('rowdblclick', function(grid,rowIndex,e){Ingenix.Security.app.loadStageController('USER',userDataStore.getAt(rowIndex).get('Id'));},this);
            userGrid.render(parentID+'_userGrid');
                
            //wireup the context menu on the grid...
            
            this.userGridContextMenu = new Ext.menu.Menu({
            id: parentID+'userGridContextMenu',
            items: [
            {
                text: 'Remove',
                iconCls: 'vcard',
                handler: this.onUserGridContextItemClick.createDelegate(this, ['remove-user'])
            }
            ]
            });
                
            userGrid.addListener('rowcontextmenu', this.onUserGridContextMenu,this);

            userGrid.on('rowcontextmenu', function(userGrid, rowIndex, event){

                userGrid.getSelectionModel().selectRow(rowIndex);

            });

            this.userGrid = userGrid;
            
            //role extension grid stuff

              
            var jsonextendsRoleGridReader = new Ext.data.JsonReader({
                root: "records",                         // The property which contains an Array of row objects
                id: "Id"
            }, ['Id','Code','Name']
            )
            var extendsRoleDataStore = new Ingenix.Security.JsonStore({
                url: 'dservice.aspx?querytype=getExtendsRolesInRole&client='+this.controller.app.getClient()+'&role='+id,
                reader: jsonextendsRoleGridReader,
                root: 'records',
                fields: ['Id','Code','Name']
            })
            extendsRoleDataStore.load();
            this.extendsRoleDataStore = extendsRoleDataStore;
            
            var extendsRoleGrid = new Ext.grid.GridPanel({
                title: 'Results',
                store: extendsRoleDataStore,
                columns: [
                    {header: "Id", width: 70, dataIndex: 'Id', sortable: true,hidden:true},
                    {header: "Name", width: 120, dataIndex: 'Name', sortable: true}
                ],
                viewConfig: {
                forceFit: true
                },
                sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
                width:400,
                height:250,
                frame:true,
                title:'',
                iconCls:'icon-grid'
            });
            extendsRoleGrid.addListener('rowdblclick', function(grid,rowIndex,e){Ingenix.Security.app.loadStageController('ROLE',extendsRoleDataStore.getAt(rowIndex).get('Id'));},this);
            extendsRoleGrid.render(parentID+'_extendsRoleGrid');
            this.extendsRoleGrid = extendsRoleGrid;
            //wireup the context menu on the grid...
            
            this.extendsRoleGridContextMenu = new Ext.menu.Menu({
            id: parentID+'extendsRoleGridContextMenu',
            items: [
            {
                text: 'Remove',
                iconCls: 'vcard',
                handler: this.onextendsRoleGridContextItemClick.createDelegate(this, ['remove-extendsRole'])
            }
            ]
            });
                
            extendsRoleGrid.addListener('rowcontextmenu', this.onextendsRoleGridContextMenu,this);

            extendsRoleGrid.on('rowcontextmenu', function(extendsRoleGrid, rowIndex, event){

                extendsRoleGrid.getSelectionModel().selectRow(rowIndex);

            });

             //group grid stuff
            
            var jsonGroupGridReader = new Ext.data.JsonReader({
                totalProperty: "results",             // The property which contains the total dataset size (optional)
                root: "records",                         // The property which contains an Array of row objects
                id: "Id"
            }, ['Id','Code','Name']
            );
            
            var groupDataStore = new Ingenix.Security.JsonStore({
                url: 'dservice.aspx?querytype=getgroupsinrole&client='+controller.app.getClient()+'&role='+id,
                reader: jsonGroupGridReader,
                root: 'records',
                fields: ['Id','Code','Name']
            })
            groupDataStore.load();
            this.groupDataStore = groupDataStore;
            
            var groupGrid = new Ext.grid.GridPanel({
                title: 'Results',
                store: groupDataStore,
                columns: [
                    {header: "Id", width: 70, dataIndex: 'Id', sortable: true, hidden:true},
                    {header: "Name", width: 120, dataIndex: 'Name', sortable: true}
                ],
                viewConfig: {
                forceFit: true
                },
                sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
                width:400,
                height:250,
                frame:true,
                title:'',
                iconCls:'icon-grid'
            });
            groupGrid.addListener('rowdblclick', function(grid,rowIndex,e){Ingenix.Security.app.loadStageController('GROUP',groupDataStore.getAt(rowIndex).get('Id'));},this);
            groupGrid.render(parentID+'_groupGrid');
                
            //wireup the context menu on the grid...
            
            this.groupGridContextMenu = new Ext.menu.Menu({
            id: 'groupGridContextMenu',
            items: [
            {
                text: 'Remove',
                iconCls: 'vcard',
                handler: this.onGroupGridContextItemClick.createDelegate(this, ['remove-group'])
            }
            ]
            });
                
            groupGrid.addListener('rowcontextmenu', this.onGroupGridContextMenu,this);

            groupGrid.on('rowcontextmenu', function(groupGrid, rowIndex, event){

                groupGrid.getSelectionModel().selectRow(rowIndex);

            });

            this.groupGrid = groupGrid; 
            //permission grid stuff
            
            var jsonPermissionGridReader = new Ext.data.JsonReader({
                totalProperty: "results",             // The property which contains the total dataset size (optional)
                root: "records",                         // The property which contains an Array of row objects
                id: "Id"
            }, ['Id','Code','Name','ApplicationName']
            );
            
            var permissionDataStore = new Ingenix.Security.JsonStore({
                url: 'dservice.aspx?querytype=getrolepermissions&client='+this.controller.app.getClient()+'&role='+id,
                reader: jsonPermissionGridReader,
                root: 'records',
                fields: ['Id','Code','Name','ApplicationName']
            })
            permissionDataStore.load();
            this.permissionDataStore = permissionDataStore;
            
            var permissionGrid = new Ext.grid.GridPanel({
                title: 'Results',
                store: permissionDataStore,
                columns: [
                    {header: "Id", width: 70, dataIndex: 'Id', sortable: false, hidden:true},
                    {header: "Name", width: 120, dataIndex: 'Name', sortable: true},
                    {header: "Application", width: 120, dataIndex: 'ApplicationName', sortable: true}
                ],
                viewConfig: {
                forceFit: true
                },
                sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
                width:400,
                height:250,
                frame:true,
                title:'',
                iconCls:'icon-grid'
            });
            permissionGrid.addListener('rowdblclick', function(grid,rowIndex,e){Ingenix.Security.app.loadStageController('PERMISSION',permissionDataStore.getAt(rowIndex).get('Id'));},this);
            permissionGrid.render(parentID+'_permissionGrid');
                
            //wireup the context menu on the grid...
            
            this.permissionGridContextMenu = new Ext.menu.Menu({
            id: 'permissionGridContextMenu',
            items: [
            {
                text: 'Remove',
                iconCls: 'vcard',
                handler: this.onPermissionGridContextItemClick.createDelegate(this, ['remove-permission'])
            }
            ]
            });
                
            permissionGrid.addListener('rowcontextmenu', this.onPermissionGridContextMenu,this);

            permissionGrid.on('rowcontextmenu', function(permissionGrid, rowIndex, event){

                permissionGrid.getSelectionModel().selectRow(rowIndex);

            });

            this.permissionGrid = permissionGrid;
            
           
            //Applications grid
                  
            var jsonApplicationGridReader = new Ext.data.JsonReader({
                totalProperty: "results",             // The property which contains the total dataset size (optional)
                root: "records",                         // The property which contains an Array of row objects
                id: "Id"
            }, ['Id','Code','Name']
            );
            var id = controller.id;
            
            var applicationDataStore = new Ingenix.Security.JsonStore({
                url: 'dservice.aspx?querytype=getroleapplications&client='+controller.app.getClient()+'&role='+id,
                reader: jsonApplicationGridReader,
                root: 'records',
                fields: ['Id','Code','Name']
            })
            applicationDataStore.load();
            this.applicationDataStore = applicationDataStore;
            
            var applicationGrid = new Ext.grid.GridPanel({
                title: 'Results',
                store: applicationDataStore,
                columns: [
                    {header: "Id", width: 70, dataIndex: 'Id', sortable: true, hidden:true},
                    {header: "Name", width: 120, dataIndex: 'Name', sortable: true}
                ],
                viewConfig: {
                forceFit: true
                },
                sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
                width:400,
                height:250,
                frame:true,
                title:'',
                iconCls:'icon-grid'
            });
            
            applicationGrid.render(parentID+'_applicationGrid');
                
            //wireup the context menu on the grid...
            
            this.applicationGridContextMenu = new Ext.menu.Menu({
            id: 'applicationGridContextMenu',
            items: [
            {
                text: 'Remove',
                iconCls: 'vcard',
                handler: this.onApplicationGridContextItemClick.createDelegate(this, ['remove-application'])
            }
            ]
            });
                
            applicationGrid.addListener('rowcontextmenu', this.onApplicationGridContextMenu,this);

            applicationGrid.on('rowcontextmenu', function(applicationGrid, rowIndex, event){

                applicationGrid.getSelectionModel().selectRow(rowIndex);

            });

            this.applicationGrid = applicationGrid;
  
            
        },
          //fired from the add user window
        handleAddUserEvent:function(array){ 
            var ids='';
            //it is possible that a record is already linked.  Check for that case and ignore it.
            for (var i=0;i<array.length;i++)
            {
                //add this user...
                var id = array[i].data.Id;
                var username = array[i].data.Username;
                var index = this.userDataStore.find("Username",username,0,true,false);
                if(index == -1)
                {
                   ids = ids + id+ ',';
                   //now add the record to an array
                   var tempArr = new Array();
                    tempArr[0] = array[i];
                    this.userDataStore.add(tempArr);  
                }
            }
            if(ids != '')
                Ingenix.Security.Ajax.request({url: 'dservice.aspx?querytype=adduserstorole&ids='+ids+"&role="+this.controller.id, callback: this.addUserAjaxCallback,scope:this});
            
        },
        
        addUserAjaxCallback:function(options,success,response){
            
            Ext.MessageBox.hide();
            if(success)
            {
                var result = eval('('+response.responseText+')');
                if(result.success)
                    showMessageWin("User(s) added successfully.");
                else
                    Ext.Msg.alert('Error Saving Users', result.msg);
            }
            else{
                Ext.Msg.alert('Error Saving Users', response.responseText);
            }
        },
        
        
        
        onUserGridContextMenu:function(grid, rowIndex, e) {
            e.stopEvent();
            var coords = e.getXY();
            this.userGridContextMenu.showAt([coords[0], coords[1]]);
        },
        
        onUserGridContextItemClick:function(item) {

             Ext.MessageBox.show({
                   title: 'Please wait',
                   msg: 'Removing users...',
                   width:200,
                   progress:false,
                   closable:false
               });
               
            var records = this.userGrid.getSelections(); 

            if (item == 'remove-user') {
                var ids='';  
                for (var i=0;i<records.length;i++)
                {
                    var id = records[i].data.Id; 
                    ids = ids + id+ ',';               
                    this.userDataStore.remove(records[i]);
                }
                Ingenix.Security.Ajax.request({url: 'dservice.aspx?querytype=removeusersfromrole&ids='+ids+'&role='+this.controller.id, callback: this.removeUserAjaxCallback,scope:this});
            }
            
        },        
           
        removeUserAjaxCallback:function(options,success,response){
            Ext.MessageBox.hide();
            if(success)
            {
                var result = eval('('+response.responseText+')');
                if(result.success)
                    showMessageWin("User(s) removed successfully.");
                else
                    Ext.Msg.alert('Error Removing Users', result.message);
            }
            else{
                Ext.Msg.alert('Error Removing Users', response.responseText);
            }
        },        
          
           //fired from the add ExtendsRole window
        handleAddExtendsRoleEvent:function(array){ 
            var ids='';
            //it is possible that a record is already linked.  Check for that case and ignore it.
            for (var i=0;i<array.length;i++)
            {
                //add this ExtendsRole...
                var id = array[i].data.Id;
                var code = array[i].data.Code;
                var index = this.extendsRoleDataStore.find("Code",code,0,true,false);
                if(index == -1)
                {
                   ids = ids + id+ ',';
                   //now add the record to an array
                   var tempArr = new Array();
                    tempArr[0] = array[i];
                    this.extendsRoleDataStore.add(tempArr);  
                }
            }
            if(ids != '')
                Ingenix.Security.Ajax.request({url: 'dservice.aspx?querytype=addextensionstorole&ids='+ids+"&role="+this.controller.id, callback: this.addExtendsRoleAjaxCallback,scope:this});
            
        },
        
        addExtendsRoleAjaxCallback:function(options,success,response){
            
            Ext.MessageBox.hide();
            if(success)
            {
                var result = eval('('+response.responseText+')');
                if(result.success)
                    showMessageWin("Role(s) added successfully.");
                else
                    Ext.Msg.alert('Error Saving Roles', result.msg);
            }
            else{
                Ext.Msg.alert('Error Saving Roles', response.responseText);
            }
        },
        
        onextendsRoleGridContextMenu:function(grid, rowIndex, e) {
            e.stopEvent();
            var coords = e.getXY();
            this.extendsRoleGridContextMenu.showAt([coords[0], coords[1]]);
        },
        
        onextendsRoleGridContextItemClick:function(item) {

             Ext.MessageBox.show({
                   title: 'Please wait',
                   msg: 'Removing Role Extension...',
                   width:200,
                   progress:false,
                   closable:false
               });
               
            var records = this.extendsRoleGrid.getSelections(); 

            if (item == 'remove-extendsRole') {

                var ids='';  
                for (var i=0;i<records.length;i++)
                {
                    var id = records[i].data.Id; 
                    ids = ids + id+ ',';               
                    this.extendsRoleDataStore.remove(records[i]);
                }
                Ingenix.Security.Ajax.request({url: 'dservice.aspx?querytype=removeextensionsfromrole&ids='+ids+'&role='+this.controller.id, callback: this.removeExtendsRoleAjaxCallback,scope:this});
            }
            
        },        
           
        removeExtendsRoleAjaxCallback:function(options,success,response){
            Ext.MessageBox.hide();
            if(success)
            {
                var result = eval('('+response.responseText+')');
                if(result.success)
                    showMessageWin("Role Extension(s) removed successfully.");
                else
                    Ext.Msg.alert('Error Removing Role Extensions', result.message);
            }
            else{
                Ext.Msg.alert('Error Removing Role Extensions', response.responseText);
            }
        },        
         handleAddGroupEvent:function(array){ 
            var ids='';
            for (var i=0;i<array.length;i++)
            {
                //add this group...
                var id = array[i].data.Id;
                var code = array[i].data.Code;
                var index = this.groupDataStore.find("Code",code,0,true,false);
                if(index == -1)
                {
                   ids = ids + id+ ',';
                   //now add the record to an array
                   var tempArr = new Array();
                    tempArr[0] = array[i];
                    this.groupDataStore.add(tempArr);  
                }         
                
            }
            if(ids != '')
                Ingenix.Security.Ajax.request({url: 'dservice.aspx?querytype=addgroupstorole&ids='+ids+"&role="+this.controller.id, callback: this.addGroupAjaxCallback,scope:this});
        
        },
        
         addGroupAjaxCallback:function(options,success,response){
            if(success)
            {
                var result = eval('('+response.responseText+')');
                if(result.success)
                    showMessageWin("Group(s) added successfully.");
                else
                    Ext.Msg.alert('Error Saving Groups', result.msg);
            }
            else{
                Ext.Msg.alert('Error Saving Groups', response.responseText);
            }
        },
           
        onGroupGridContextMenu:function(grid, rowIndex, e) {
            e.stopEvent();
            var coords = e.getXY();
            this.groupGridContextMenu.showAt([coords[0], coords[1]]);
        },
        
           
        onGroupGridContextItemClick:function(item) {

             Ext.MessageBox.show({
                   title: 'Please wait',
                   msg: 'Removing groups...',
                   width:200,
                   progress:false,
                   closable:false
               });
               
            var records = this.groupGrid.getSelections(); 

            if (item == 'remove-group') {
                var ids='';  
                for (var i=0;i<records.length;i++)
                {
                    var id = records[i].data.Id; 
                    ids = ids + id+ ',';               
                    this.groupDataStore.remove(records[i]);
                }
                Ingenix.Security.Ajax.request({url: 'dservice.aspx?querytype=removegroupsfromrole&ids='+ids+"&role="+this.controller.id, callback: this.removeGroupAjaxCallback,scope:this});
            }
            
        },
        
        removeGroupAjaxCallback:function(options,success,response){
            Ext.MessageBox.hide();
            if(success)
            {
                var result = eval('('+response.responseText+')');
                if(result.success)
                    showMessageWin("Group(s) removed successfully.");
                else
                    Ext.Msg.alert('Error Removing Groups', result.message);
            }
            else{
                Ext.Msg.alert('Error Removing Groups', response.responseText);
            }
        },
        
        handleAddPermissionEvent:function(array){ 
            var ids='';
            for (var i=0;i<array.length;i++)
            {
                //add this permission...
                var id = array[i].data.Id;
                var code = array[i].data.Code;
                var index = this.permissionDataStore.find("Code",code,0,true,false);
                if(index == -1)
                {
                   ids = ids + id+ ',';
                   //now add the record to an array
                   var tempArr = new Array();
                    tempArr[0] = array[i];
                    this.permissionDataStore.add(tempArr);  
                }         
                
            }
            if(ids != '')
                Ingenix.Security.Ajax.request({url: 'dservice.aspx?querytype=addpermissionstorole&ids='+ids+"&role="+this.controller.id, callback: this.addPermissionAjaxCallback,scope:this});
        
        },
    
        addPermissionAjaxCallback:function(options,success,response){
            if(success)
            {
                var result = eval('('+response.responseText+')');
                if(result.success)
                    showMessageWin("Permission(s) added successfully.");
                else
                    Ext.Msg.alert('Error Saving Permissions', result.msg);
            }
            else{
                Ext.Msg.alert('Error Saving Permissions', response.responseText);
            }
        },
           
        onPermissionGridContextMenu:function(grid, rowIndex, e) {
            e.stopEvent();
            var coords = e.getXY();
            this.permissionGridContextMenu.showAt([coords[0], coords[1]]);
        },
        
           
        onPermissionGridContextItemClick:function(item) {

             Ext.MessageBox.show({
                   title: 'Please wait',
                   msg: 'Removing permissions...',
                   width:200,
                   progress:false,
                   closable:false
               });
               
            var records = this.permissionGrid.getSelections(); 

            if (item == 'remove-permission') {
                var ids='';  
                for (var i=0;i<records.length;i++)
                {
                    var id = records[i].data.Id; 
                    ids = ids + id+ ',';               
                    this.permissionDataStore.remove(records[i]);
                }
                Ingenix.Security.Ajax.request({url: 'dservice.aspx?querytype=removepermissionsfromrole&ids='+ids+"&role="+this.controller.id, callback: this.removePermissionAjaxCallback,scope:this});
            }
            
        },
        
        removePermissionAjaxCallback:function(options,success,response){
            Ext.MessageBox.hide();
            if(success)
            {
                var result = eval('('+response.responseText+')');
                if(result.success)
                    showMessageWin("Permission(s) removed successfully.");
                else
                    Ext.Msg.alert('Error Removing Permissions', result.message);
            }
            else{
                Ext.Msg.alert('Error Removing Permissions', response.responseText);
            }
        },
        
        handleAddApplicationEvent:function(array){ 
            var ids='';
            for (var i=0;i<array.length;i++)
            {
                //add this application...
                var id = array[i].data.Id;
                var code = array[i].data.Code;
                var index = this.applicationDataStore.find("Code",code,0,true,false);
                if(index == -1)
                {
                   ids = ids + id+ ',';
                   //now add the record to an array
                   var tempArr = new Array();
                    tempArr[0] = array[i];
                    this.applicationDataStore.add(tempArr);  
                }         
                
            }
            if(ids != '')
                Ingenix.Security.Ajax.request({url: 'dservice.aspx?querytype=addapplicationstorole&ids='+ids+"&role="+this.controller.id, callback: this.addApplicationAjaxCallback,scope:this});
            
        },
    
        addApplicationAjaxCallback:function(options,success,response){
            if(success)
            {
                var result = eval('('+response.responseText+')');
                if(result.success)
                    showMessageWin("Application(s) added successfully.");
                else
                    Ext.Msg.alert('Error Saving Applications', result.msg);
            }
            else{
                Ext.Msg.alert('Error Saving Applications', response.responseText);
            }
        },
           
        onApplicationGridContextMenu:function(grid, rowIndex, e) {
            e.stopEvent();
            var coords = e.getXY();
            this.applicationGridContextMenu.showAt([coords[0], coords[1]]);
        },
        
           
        onApplicationGridContextItemClick:function(item) {

             Ext.MessageBox.show({
                   title: 'Please wait',
                   msg: 'Removing applications...',
                   width:200,
                   progress:false,
                   closable:false
               });
               
            var records = this.applicationGrid.getSelections(); 

            if (item == 'remove-application') {
                var ids='';  
                for (var i=0;i<records.length;i++)
                {
                    var id = records[i].data.Id; 
                    ids = ids + id+ ',';               
                    this.applicationDataStore.remove(records[i]);
                }
                Ingenix.Security.Ajax.request({url: 'dservice.aspx?querytype=removerolefromapplications&ids='+ids+"&role="+this.controller.id, callback: this.removeApplicationAjaxCallback,scope:this});
            }
            
        },
        
        removeApplicationAjaxCallback:function(options,success,response){
            Ext.MessageBox.hide();
            if(success)
            {
                var result = eval('('+response.responseText+')');
                if(result.success)
                    showMessageWin("Application(s) removed successfully.");
                else
                    Ext.Msg.alert('Error Removing Applications', result.message);
            }
            else{
                Ext.Msg.alert('Error Removing Applications', response.responseText);
            }
        }

    }

}


// end of file