azfcms.model.cms.addExtensionPlugin(function(navigationId, name,description,type,region,weight,enable){
    Application_Resolver_ExtensionPlugin.addExtensionPluginMethod(function(){
        var pluginId = Azf_Model_DbTable_Plugin.insertPlugin(function(name,description,type,region,params){});
            
        var Azf_Plugin_Extension_Abstract = 
        Azf_Plugin_Extension_Manager.setUp(function(type, pluginId){
            var Azf_Plugin_Extension_Abstract= Azf_Plugin_Extension_Manager._getPluginInstance(function(type,pluginId, pluginParams){
                if(is_array(pluginParams)==false){
                    // Construct plugin params if not present
                    pluginParams = Azf_Plugin_Extension_Manager.getPluginParams(function(pluginId){
                        Azf_Model_DbTable_Plugin = Azf_Plugin_Extension_Manager.getModel();
                        return Azf_Model_DbTable_Plugin.getPluginParams(function(pluginId){
                            var params = Azf_Model_DbTable_Plugin.find(pluginId)['params'];
                            return Azf_Model_DbTable_Plugin._decode(params);
                        })
                    })
                } 
                    
                // Construct instance
                return Azf_Plugin_Extension_Manager._constructPlugin(function(type, pluginParams){
                    var className = Azf_Plugin_Extension_Manager.getClassName(type);
                    return new className(function(pluginParams){
                        return Azf_Plugin_Extension_Abstract.__construct(function(pluginParams/*optional*/){
                            Azf_Plugin_Extension_Abstract.setParams(pluginParams);
                        })
                    })
                });
            });
                
            try{
                Azf_Plugin_Extension_Abstract.setId(pluginId);
                Azf_Plugin_Extension_Abstract.setUp();
                if(Azf_Plugin_Extension_Abstract.isParamsDirty()){
                    var params = Azf_Plugin_Extension_Abstract.getParams();
                    Azf_Model_DbTable_Plugin.setPluginParams(pluginId,params);
                    Azf_Plugin_Extension_Abstract.clearParamsDirty();
                }
            }catch(e){
                    
            }
        })
    })
        
});


azfcms.model.cms.setHomePage(function(nodeId){
    Application_Resolver_Navigation.overrideSetHomePage(function(navigationid){
        var oldHomePage = Azf_Model_Tree_Navigation.findByHome();
        Azf_Model_Tree_Navigation.setHome(navigationId);
        var newHomePage = Azf_Model_Tree_Navigation.findByHome();
        return [oldHomePage,newHomePage];
        
    })
})


azfcms.controller.navigation.HomePage.onHomeChange(function(navigationItem){
    azfcms.view.Util.confirm(function(confirmed){
        if(confirmed==false)
            return;
        
        azfcms.model.cms.setHomePage(navigationItem.id).then(function(navigationNodes){
            var oldHomePage = navigationNodes[0];
            var newHomePage = navigationNodes[1];
            
            azfcms.model.navigation.onChange(oldHomePage);
            azfcms.model.navigation.onChange(newHomePage);
        })
    }, "Do you want to set selected page as home page?")
})
    
    
azfcms.model.cms.removeExtensionPlugin(function(pluginId){
    Application_Resolver_ExtensionPlugin.removeExtensionPluginMethod(function(pluginId){
        // Load plugin type
        var type = Azf_Model_DbTable_Plugin.find(pluginId)['type'];
            
        // Remove plugin related resources
        Azf_Plugin_Extension_Manager.tearDown(function(type, pluginId){
            Azf_Plugin_Extension_Abstract = Azf_Plugin_Extension_Manager._getPluginInstance(type, pluginId);
            try{
                Azf_Plugin_Extension_Abstract.setId(pluginId);
                Azf_Plugin_Extension_Abstract.tearDown();
            } catch(e){
                        
            }
        });
        
        // Delete plugin
        Azf_Model_DbTable_Plugin.deleteById(function(pluginId){
            Azf_Model_DbTable_Plugin['delete']();
        })
    })
})
    
    
azfcms.model.cms.getTemplateRegionsForNavigationStore(function(navigationId){
    return Application_Resolver_Template.getTemplateRegionsForNavigationMethod(function(){
        var templateIdentifier = Azf_Model_Tree_Navigation.getStaticParam(navigationId, 'templateIdentifier');
        if(!templateIdentifier){
            templateIdentifier = Zend_Registry.defaultTemplate;
        }
            
        return Azf_Template_Descriptor.getRegions(function(templateIdentifier){
            return this.getTemplate(templateIdentifier)['regions'];
        })
    })
})
    
    
azfcms.model.cms.getTemplateRegionsForNavigation(function(navigationId){
    Application_Resolver_Template.getTemplateRegionsForNavigationMethod(function(navigationId){
            
        })
})
    
    
Azf_Template_Descriptor.getTemplate(function(templateIdentifier){
    var templates = 
    Azf_Template_Descriptor.getTemplates(function(){
        if(Azf_Template_Descriptor._templates==null){
            Azf_Template_Descriptor._initTemplates(function(){
                var path = Azf_Template_Descriptor.getTemplateDirectoryPath(function(){
                    if(Azf_Template_Descriptor._templateDirectoryPath==null){
                        Azf_Template_Descriptor._initTemplateDirectoryPath();
                    }
                    return Azf_Template_Descriptor._templateDirectoryPath;
                });
        
                var potentialTemplateFilePaths = 
                Azf_Template_Descriptor._buildPotentialTemplateFilePaths(function(){
                    var potentialTemplateFilePaths = [];
                    var templateDirectoryPath = Azf_Template_Descriptor.getTemplateDirectoryPath();
    
                    var iterator = new DirectoryIterator(templateDirectoryPath);
                    foreach(function(iterator, path){
                        if(path.endsWith(".xml")){
                            potentialTemplateFilePaths.push(path);
                        }
                    });
    
                    return potentialTemplateFilePaths;
                });
        
                var parsedTemplates = 
                Azf_Template_Descriptor._parseTemplateFiles(function(potentialTemplateFilePaths){
                    var schema = Azf_Template_Descriptor.getSchemaSource();
                    var parsedTemplates = [];
            
                    for(var path in potentialTemplateFilePaths){
                        DomDocument.loadXmlFromFile(path);
                        if(DomDocument.schemaValidateFromSource(schema)){
                            parsedTemplates.push(Azf_Template_Descriptor.templateToArray(DomDocument));
                        }
                    }
            
                    return parsedTemplates;
                });
        
                Azf_Template_Descriptor.setTemplates(parsedTemplates);
            })
        }
        else {
            return Azf_Template_Descriptor._templates;
        }
    });
        
    return templates[templateIdentifier];
})
    
    
azfcms.model.cms.getRegionPluginsStore(function(nodeId, region){
    return Application_Resolver_ExtensionPlugin.getRegionExtensionPluginsMethod(function(nodeId, region){
        return Azf_Model_DbTable_NavigationPlugin.findAllByNavigationAndRegion(nodeId,region);
    });
})
    
    
azfcms.model.cms.enableExtensionPlugin(function(nodeId, pluginId,weight){
    return Application_Resolver_ExtensionPlugin.enableExtensionPluginMethod(function(nodeId, pluginId, weight){
        return Azf_Model_DbTable_NavigationPlugin.bind(nodeId, pluginId, weight);
    })
    
})
    
    
azfcms.model.cms.disableExtensionPlugin(function(nodeId,pluginId){
    return Application_Resolver_ExtensionPlugin.disableExtensionPluginMethod(function(nodeId,pluginId){
        Azf_Model_DbTable_NavigationPlugin.unbind(nodeId,pluginId);
        return true;
            
    });
})
    
azfcms.model.cms.setExtensionPluginValues(function(navigationId, pluginId, name,description,region,weight,enable){
    return Application_Resolver_ExtensionPlugin.setExtensionPluginValuesMethod(function(navigationId, pluginId, name,description,region,weight,enable){
        if(enabled==false){
            Azf_Model_DbTable_NavigationPlugin.unbind(navigationId, pluginId);
        } else {
            Azf_Model_DbTable_NavigationPlugin.updateWeightByNavigationIdAndPluginId(navigationId, pluginId, weight);
        }
        Azf_Model_DbTable_Plugin.updatePluginValues(pluginId, name,description, region);
            
    })
})
    
azfcms.model.getExtensionPluginStore(function(){
    return Application_Resolver_PluginDescriptor.getExtensionPlugins();
})
    
    
azfcms.controller.ExtensionEditorController.constructor(function(args){
    this.navigationId = args.navigationId;
    azfcms.controller.ExtendedEditorController.editorPane = args.model = azfcms.model.cms;
    azfcms.controller.ExtendedEditorController.model = args.model = azfcms.model.cms;
        
})
    
azfcms.view.ExtensionEditorPane.constructor(function(args){
    args = {
        regionStore: azfcms.model.cms.getTemplateRegionsStoreForNavigation(navigationId),
        gridStore: azfcms.model.cms.getRegionPluginsStore(nodeId, region),
        typeStore: azfcms.model.cms.getExtensionPluginStore()
    }
    azfcms.view.ExtensionEditorPane.regionStore = args.regionStore;
    azfcms.view.ExtensionEditorPane.typeStore = args.typeStore;
    azfcms.view.ExtensionEditorPane.gridStore = args.pluginsStore;
});
    
azfcms.view.ExtensionEditorPane.postCreate(function(args){
    azfcms.view.ExtensionEditorPane.pluginGrid.set("store",azfcms.view.ExtensionEditorPane.gridStore);
    azfcms.view.ExtensionEditorPane.typeSelect.set("store",azfcms.view.ExtensionEditorPane.typeStore);
    azfcms.view.ExtensionEditorPane.regionSelect.set("store",azfcms.view.ExtensionEditorPane.regionStore);
       
})
    
azfcms.view.ExtensionEditorPane.onNew(function(name,description,type,region,weight,enable){
    if(region==false || type == false)return;
    azfcms.controller.ExtensionEditorController.onNew(function(){
        azfcms.view.ExtensionEditorPane.disable();
        var navigationId = azfcms.controller.ExtensionEditorController.navigationId;
        azfcms.model.cms.addExtensionPlugin(navigationId, description, type, region, weight, enable)(
            function(){
                azfcms.view.ExtensionEditorPane.regionSelect.set('value',region);
                azfcms.view.ExtensionEditorPane.reloadGrid(function(navigationId,region){
                    azfcms.model.cms.findPluginsByNavigationAndRegion(function(navigationId,region){
                        return Application_Resolver_ExtensionPlugin.findPluginsByNavigationAndRegion(function(navigationId,regionId){
                            Azf_Model_DbTable_NavigationPlugin = Application_Resolver_ExtensionPlugin.getNavigationPluginModel();
                            return Azf_Model_DbTable_NavigationPlugin.findAllByNavigationAndRegion(navigationId, region);
                        })
                    }).then(function(result){
                        azfcms.view.ExtendedEditorPane.gridStore.setData(result)
                        azfcms.view.ExtensionEditorPane.pluginGrid.set("store",azfcms.view.ExtensionEditorPane.gridStore)
                    });
                    return then
                        
                }).then(function(){
                    azfcms.view.ExtensionEditorPane.regionSelect.set('value',region)
                    azfcms.view.ExtensionEditorPane.enable();
                })
                    
            })
    })
});
    
    
azfcms.view.ExtensionEditorPane.onSave(function(pluginId, name,description,region,weight,enable){
    azfcms.controller.ExtensionEditorController.onSave(function(pluginId, name,description,region,weight,enable){
        azfcms.view.ExtensionEditorPane.disable();
        var navigationId = azfcms.controller.ExtendedEditorController.navigationId;
        azfcms.model.cms.setExtensionPluginValues(navigationId, pluginId, name,description,region,weight,enable)(function(){
            azfcms.view.ExtensionEditorPane.enable();
        })(function(){
            azfcms.view.ExtensionEditorPane.reloadGrid(navigationId,region).then(function(){
                azfcms.view.ExtensionEditorPane.regionSelect.set('value',region)
                azfcms.view.ExtensionEditorPane.enable();
            });
                
        })
    })
        
});
    
azfcms.view.ExtensionEditorPane.onDelete(function(pluginId){
    azfcms.controller.ExtensionEditorController.onDelete(function(pluginId){
        azfcms.view.ExtensionEditorPane.disable();
        azfcms.model.cms.removeExtensionPlugin(pluginId)(function(){
            azfcms.view.ExtensionEditorPane.reloadGrid().then(function(){
                azfcms.view.ExtensionEditorPane.enable();
            })
                
        })
    })
});
    
    
azfcms.view.ExtensionEditorPane.onDisable(function(){
    azfcms.controller.ExtensionEditorController.onDisable(function(pluginId){
        var navigationId = azfcms.controller.ExtendedEditorController.navigationId;
        azfcms.view.ExtensionEditorPane.disable();
        azfcms.model.cms.disableExtensionPlugin(navigationId, pluginId)(function(){
            azfcms.view.ExtensionEditorPane.reloadGrid().then(function(){
                azfcms.view.ExtensionEditorPane.enable();
            })
        })
    })
})
    
azfcms.view.ExtensionEditorPane.onEnable(function(pluginId, weight){
    azfcms.controller.ExtensionEditorController.onEnable(function(pluginId, weight){
        var navigationId = azfcms.controller.ExtendedEditorController.navigationId;
        azfcms.view.ExtensionEditorPane.disable();
        azfcms.model.cms.enableExtensionPlugin(navigationId, pluginId, weight)(function(){
            azfcms.view.ExtensionEditorPane.enable();
        })
    })
})
    
    
    
azfcms.view.ExtensionEditorPane.onExtensionEdit(function(pluginId,type){
    azfcms.controller.ExtensionEditorController.onExtensionEdit(function(){
        var modules = azfcms.controller.ExtensionEditorController._buildRequire(type);
        require(modules,function(AbstractExtensionController, AbstractExtensionPane){
            var pane = azfcms.controller.ExtensionEditorController._buildEditorPane(function(AbstractExtensionPane){
                var pane  = new azfcms.view.AbstractExtensionPane._constructor();
                azfcms.view.ExtensionEditorPane.addChild(function(pane){
                    azfcms.view.ExtensionEditorPane.tabContainer.addChild(pane)
                });
                return pane;
            });
                
            var controller = azfcms.controller.ExtensionEditorController._buildController(function(AbstractExtensionController,pluginId, ExtensionEditorPane){
                var controller =  azfcms.controller.AbstractExtensionController = new AbstractExtensionController ;
                azfcms.controller.AbstractExtensionController.constructor({
                    pluginId:pluginId,
                    editorPane:ExtensionEditorPane
                },function(args){
                    azfcms.controller.AbstractExtensionController.pluginId = args.pluginId;
                    azfcms.controller.AbstractExtensionController.editorPane = args.editorPane;
                    azfcms.controller.AbstractExtensionController.init();
                })
            });
        })
    })
});
    
azfcms.view.ExtensionEditorPane.onItemSelect(function(item){
    azfcms.controller.ExtensionEditorController.onItemSelect(function(item){
        azfcms.view.ExtensionEditorPane.disable();
        azfcms.controller.ExtensionEditorController.pluginItem = plugin;
        var form = "form";
        azfcms.view.ExtensionEditorPane.set(function(form,plugin){
            azfcms.view.ExtensionEditorPane._setFormAttr(function(plugin){
                azfcms.view.ExtensionEditorPane.nameText.set("value",plugin.name);
                azfcms.view.ExtensionEditorPane.descriptionText.set("value",plugin.description);
                azfcms.view.ExtensionEditorPane.typeSelect.set("value",plugin.type);
                azfcms.view.ExtensionEditorPane.weightText.set("value",plugin.weight);
                azfcms.view.ExtensionEditorPane.disabledRadio.set("value",plugin.disabledRadio);
            })
        });
        azfcms.view.ExtensionEditorPane.enable();
        azfcms.view.ExtensionEditorPane.typeSelect.set("disabled",true);
    })
})
    
    
Azf_Controller_Action_Helper_ExtensionPlugin.postDispatch(function(){
    // Load navigationId
    var navigationId = Zend_Controller_Request_Http.getParam("id");
    // Produce rendered responses
    var responses = Azf_Plugin_Extension_Manager.render(function(navigationId){
        var plugins = Azf_Plugin_Extension_Manager.getPluginDefinitions(function(navigationId){
            return Azf_Model_DbTable_Plugin.findAllByNavigationId(function(navigationId){
                var rows = Zend_Db_Adapter_Abstract.fetchAll("");
                for(var row in rows){
                    row['params'] = Azf_Model_DbTable_Plugin._decode(row['params']);
                }
                return rows;
            });
        });
            
        var responseChunks = {};
        for(var plugin in plugins){
            var Azf_Plugin_Extension_Abstract = Azf_Plugin_Extension_Manager._getPluginInstance(plugin['type'],plugin['id'],plugin['params']);
            Azf_Plugin_Extension_Abstract.setId(plugins.id);
            ob_start();
                
            Azf_Plugin_Extension_Abstract.render();
            responseChunks[plugin['region']].push(ob_get_end());
        }
            
        var responses = {};
        foreach(function(responseChunks, region, responseChunk){
            responses[region] = responseChunk.join("");
        });
        return responses;
    });
        
    // Inject responses into response object
    foreach(function(responses,region,body){
        Zend_Controller_Response_Http.setBody("region",body);
    });
        
        
})
    
    
azfcms.view.ExtendedEditorPane.resize(function(){
    _Widget.resize();
        
    var box = azfcms.view.ExtendedEditorPane.getDomNodeBox(function(){
        var cs = domStyle.getComputedStyle(azfcms.view.ExtendedEditorPane.domNode);
        return {
            w:parseInt(cs.width),
            h:parseInt(cs.height)
        }
    });
        
    azfcms.view.ExtendedEditorPane.tabContainer.set("style:",box.h+"px");
    var tabBox = azfcms.view.ExtendedEditorPane.getTabContainerBox(function(){
        var cs = domStyle.getComputedStyle(azfcms.view.ExtendedEditorPane.tabContainer.containerNode);
        return {
            w:parseInt(cs.width),
            h:parseInt(cs.height)
        }
    })
        
        
        
        
        
    var tabSize = 30;
    var regionSelectionSize = 30;
    var formSize = 280;
    var minGridSize = 200;
    var gridSize = 0;
    var minSize = tabSize+regionSelectionSize+formSize+minGridSize;
        
    // If there is more space available
    if(minSize<tabBox.h){
        gridSize = tabBox.h-tabSize-regionSelectionSize-formSize;
    }
    // otherwise keep current sizes
    else {
        gridSize = minGridSize;
    }
        
    azfcms.view.ExtendedEditorPane.setChildHeights(regionSelectionSize, gridSize, formSize,function(){
        azfcms.view.ExtendedEditorPane.regionSelectionNode.style.height = regionSelectionSize +"px";
        azfcms.view.ExtendedEditorPane.pluginGrid.set("style","height:"+gridSize+"px");
        azfcms.view.ExtendedEditorPane.formNode.style = formSize+"px";
    });
});
    
azfcms.view.FilesystemPane.constructor(function(args){
    
    azfcms.view.FilesystemPane.gridStore = args.gridStore = azfcms.model.store.Filesystem.query(function(directory,filter){
        directory = String;
        filter = azfcms.model.QueryLangStore.queryOptions = JsFileFilter({
            directory:true,
            hidden:true,
            file:true
        });
        Application_Resolver_Filesystem.getFileListMethod(function(directory,filter){
            var normalizedFilter = Application_Resolver_Filesystem.normalizeFilter(filter);
            return Application_Resolver_Filesystem.getDirectoryFileList(function(directory,normalizedFilter){
                var realPath = Application_Resolver_Filesystem.constructRealPath(function(directory){
                    var baseDir = Application_Resolver_Filesystem.getBaseDir(function(){
                        return Application_Resolver_Filesystem._baseDir;
                    });
                    if(typeof directory=="string"){
                        if(directory.indexOf('..')>-1){
                            return null;
                        } else {
                            return realpath(baseDir+"/"+directory);
                        }
                    } else if(directory instanceof JsFile) {
                        var path = JsFile.dirname+"/"+JsFile.name;
                        return realPath(path);
                    }
                    
                });
                
                if(Application_Resolver_Filesystem.isPathSecure(realPath)==false){
                    return [];
                }
                
                var iterator = Application_Resolver_Filesystem.getDirectoryIterator(function(realpath){
                    return new DirectoryIterator(realpath);
                });
                
                var files = [];
                for(var file in iterator){
                    if(JsFileFilter.directory==false && true==files.isDir())
                        continue;
                    if(file.isHidden()==true && JsFileFilter.hidden==false)
                        continue;

                    if(file.isFile()==true && JsFileFilter.file==false)
                        continue;
                    
                    files.push(new JsFile(file))
                }
                
                return files;
            })
        }
        )
    });
    azfcms.view.FilesystemPane.treeStore = args.treeStore = azfcms.model.store.Filesystem.query(function(directory,filter){
        if(typeof directory =='undefined'){
            directory = ".";
        }
        var filter = azfcms.model.store.Filesystem.queryOptions = JsFileFilter({
            directory:true,
            hidden:false,
            file:false
        })
        return Application_Resolver_Filesystem.getFilesystemDirectoryTreeMethod(function(directory){
                
            })
    })
})


Application_Resolver_Filesystem.createDirectoryMethod(function(inDirectory, name){
    var realPath = Application_Resolver_Filesystem.constructRealPath(inDirectory);
    if(!Application_Resolver_Filesystem.isPathSecure(realPath)){
        return false;
    }
    
    var makePath = realPath+trim(name,"/\\");
    
    mkdir(makePath,"0777",true);
})
        
azfcms.view.FilesystemPane.postCreate(function(args){
    this.inherited(args);
            
    this.tree.set('store',azfcms.view.FilesystemPane.treeStore);
    azfcms.view.FilesystemPane.grid.setStore(azfcms.view.FilesystemPane.gridStore);
})
        
        
azfcms.view.FilesystemPane.addAction(function(name,callback,dijitIconClass){
    callback == function(selectedTreeItem,selectedGridItems){}
            
    var onClick = function(){
        var selectedTreeItem = azfcms.view.FilesystemPane.getTreeSelection();
        var selectedGridItems = azfcms.view.FilesystemPane.getGridSelection();
                
        callback(selectedTreeItem,selectedGridItems);
    }
            
    var button = azfcms.view.FilesystemPane._createButton(function(name,callback,dijitIconClass){
        return new dijit.form.Button({
            label:name,
            iconClass:dijitIconClass,
            onClick:onClick
        });
    });
    azfcms.view.FilesystemPane.toolbar.addChild(button);
})
        
azfcms.view.FilesystemPane.enable(function(){
    azfcms.view.FilesystemPane.toolbar.set("disabled",true);
    azfcms.view.FilesystemPane.grid.set("disabled",true);
    azfcms.view.FilesystemPane.tree.set("disabled",true);
})
        
azfcms.view.FilesystemPane.enable(function(){
    azfcms.view.FilesystemPane.toolbar.set("disabled",false);
    azfcms.view.FilesystemPane.grid.set("disabled",false);
    azfcms.view.FilesystemPane.tree.set("disabled",false);
})
        
        
azfcms.view.FilesystemPane.getGridSelection(function(){
    var selected = azfcms.view.FilesystemPane.grid.getSelected();
    return selected;
})
        
azfcms.view.FilesystemPane.getTreeSelection(function(){
    return azfcms.view.FilesystemPane.tree.selectedItems[0]|null;
})
        
azfcms.view.FilesystemPane.tree.onClick(function(){
    var item = azfcms.view.FilesystemPane.getTreeSelection();
    azfcms.view.FilesystemPane.onTreeSelect(function(item){});
})


azfcms.controller.FilesystemPaneController.constructor(function(args){
    args.view = azfcms.view.FilesystemPane
    
    azfcms.controller.FilesystemPaneController.attachEventHandlers(function(){
        azfcms.view.FilesystemPane.addAction(azfcms.resources.nls.fspUploadAction, azfcms.controller.FilesystemPaneController.onUpload(), "dijitUploadIcon")
    // CONTINUE
    })
})        

azfcms.controller.FilesystemPaneController.onUpload(function(selectedTreeItem,selectedGridItems){
    var dialog = azfcms.controller.FilesystemPaneController.getUploadDialog(function(){
        if(typeof azfcms.controller.FilesystemPaneController.uploadDialog=='object')
            return azfcms.controller.FilesystemPaneController.uploadDialog;
        azfcms.controller.FilesystemPaneController.uploadPane = new azfcms.view.UploadPanel();
        
        azfcms.controller.FilesystemPaneController.uploadDialog = 
        new dijit.Dialog({
            content:azfcms.controller.FilesystemPaneController.uploadPane
        });
        return azfcms.controller.FilesystemPaneController.uploadPane;        
    });
    
    var form = dialog.get('content').getForm() == azfcms.view.UploadPanel.getForm();
    azfcms.view.UploadPanel.on("upload",azfcms.controller.FilesystemPaneController.doUpload(function(form){
        azfcms.view.UploadPanel.disable();
        var promise = azfcms.store.Filesystem.uploadFiles(function(JsFile){ 
            var promise = azfcms.model.invokeWithForm(function(call,form){
                Application_Resolver_Filesystem.uploadFilesMethod(function(dirname){
                    var path = Application_Resolver_Filesystem.constructRealPath(dirname);
                    if(!Application_Resolver_Filesystem.isPathSecure(path)){
                        return false;
                    }
                        
                    for(file in $_FILES){
                        if(Application_Resolver_Filesystem._isUploadedFile(file)){
                            var newFilePath = Application_Resolver_Filesystem.constructRealPath(dirname+"/"+file.path);
                            if(Application_Resolver_Filesystem.isPathSecure(function(newFilePath){
                                var basePath = Application_Resolver_Filesystem.getBaseDir();
                                return isInBaseDir(basePath,newFilePath);
                            })){
                                Application_Resolver_Filesystem._moveUploadedFile(file.tmpFilePath,newFilePath);
                            }
                        }
                    }
                    return true;
                })
            })
            return promise;
        })
        promise.then((function(){
                
            azfcms.view.UploadPanel.reset(function(){
                azfcms.view.UploadPanel.file1Input.reset();
                azfcms.view.UploadPanel.file2Input.reset();
                azfcms.view.UploadPanel.file3Input.reset();
                azfcms.view.FilesystemPane.reload();
            });
            azfcms.view.UploadPanel.enable();
        }))
    }))
})

azfcms.controller.FilesystemPaneController.onDelete(function(selectedTreeItem, selectedGridItems){
    if(selectedGridItems.length==0){
        azfcms.view.Util.alert(azfcms.resources.nls.fspNoFileSelected)
        return;
    }
    
    var message = azfcms.resources.nls.fspDeleteSelectionMessage;
    azfcms.view.Util.confirm(function(callback,message,acceptLabel,rejectLabel){
        var args = [callback,message];
        if(acceptLabel){
            args.push(acceptLabel);
        }
        if(rejectLabel){
            args.push(rejectLabel);
        }
        
        var confirmPane = azfcms.view.Util.getConfirmPane(function(){
            var pane;
            if((pane = azfcms.view.Util._confirmPane)==false){
                azfcms.view.Util._confirmpane = pane = new azfcms.view.ConfirmPane();
                azfcms.view.Util._confirmDialog = new dijit.Dialog({
                    content:pane
                });
            }
            
            return pane;
        });
        
        azfcms.view.Util._confirmDialog.show();
        pane = azfcms.view.ConfirmPane.confirm.call(azfcms.view.ConfirmPane,args)
        (function(confirmed){
            callback(confirmed);
            azfcms.view.Util._confirmDialog.hide();
        });
    })
    // Confirm callback
    (function(confirmed){
        if(!confirmed){
            azfcms.view.FilesystemPane.enable();
            return false;
        }
        
        azfcms.store.Filesystem.deleteFiles(function(files){
            var promise = azfcms.model.invoke(function(files){
                Application_Resolver_Filesystem.deleteFilesMethod(function(files){
                    var file;
                    for(file in files){
                        file == JsFile;
                        
                        Application_Resolver_Filesystem.deleteFile(function(file){
                            file == JsFile;
                            if(!Application_Resolver_Filesystem.isFileArray(file,['dirname','name']))
                                return false;
                            
                            var realPath = Application_Resolver_Filesystem.constructRealPath(file);
                            var isPathSecure = Application_Resolver_Filesystem.isPathSecure(realPath);
                            if(!realPath || !isPathSecure)
                                return;
                            else {
                                unlink(realPath);
                            }
                        })
                    }
                })
            })
            promise.then(function(){
                if(files.length<1){
                    return false;
                }
                
                require.signal("azfcms/store/Filesystem/deleteFiles",files[0]);
            })
            return promise;
        })
        // Callback initiated after server is finished
        (function(){
            azfcms.view.FilesystemPane.reload();
            azfcms.view.FilesystemPane.enable();
        })
    });
})

azfcms.controller.FilesystemPaneController.onTreeSelect(function(item){
    azfcms.view.FilesystemPane.reloadGrid(item);
})


        
        
        
azfcms.model.QueryLangStore.constructor(function(args){
    azfcms.model.QueryLangStore.idProperty = args.idProperty;
    azfcms.model.QueryLangStore.model = args.model = azfcms.model
})

azfcms.model.QueryLangStore.getIdentity(function(){
    return this[azfcms.model.QueryLangStore.idProperty];
})

azfcms.model.QueryLangStore.query(function(query){
    query = QueryLangStoreQuery;
    azfcms.model = azfcms.model.QueryLangStore.model;
    
    
    var args = [
    query,
    azfcms.model.QueryLangStore.queryOptions
    ];
    
    var call = azfcms.model.createCall(azfcms.model.QueryLangStore.queryMethod, args);
    return azfcms.model.invoke(function(call){
        RandomResolverClass.randomResolverMethod(function(query, options){
            return stuff();
        })
    });
});

azfcms.model.QueryLangStore.add(function(object){
    
    var args = [
    object,
    azfcms.model.QueryLangStore.addOptions
    ]
    
    var call = azfcms.model.createCall(azfcms.model.QueryLangStore.addMethod, args);
    return azfcms.model.invoke(function(call){
        return RandomResolverClass.randomResolverMethod(function(object,options){
            return stuff();
        })
    })
});


azfcms.model.QueryLangStore.get(function(id){
    var method = azfcms.model.QueryLangStore.getMethod;
    var args = [
    id,
    azfcms.model.QueryLangStore.getOptions
    ];
    var call = azfcms.model.createCall(method,args);
    return azfcms.model.invoke(function(call){
        return RandomResolverClass.randomMethod(function(id,options){
            return something();
        })
    });
});

azfcms.model.QueryLangStore.put(function(object){
    var method = azfcms.model.QueryLangStore.putMethod;
    var args = [
    object,
    azfcms.model.QueryLangStore.putOptions
    ];
    var call = azfcms.model.createCall(method,args);
    return azfcms.model.invoke(function(call){
        return SomeResolverClass.someMethod(function(object,options){
            return something();
        })
    })
})

azfcms.model.QueryLangStore.remove(function(id){
    var method = azfcms.model.QueryLangStore.removeMethod;
    var args = [
    id,
    azfcms.model.QueryLangStore.removeOptions
    ];
    var call = azfcms.model.createCall(method,args);
    
    return azfcms.model.invoke(function(call){
        return SomeResolverClass(function(call){
            return something();
        })
    })
    
})


azfcms.view.UploadPanel.constructor(function(args){
    azfcms.view.UploadPanel.uplMessage = args.uplMessage;
    azfcms.view.UploadPanel.cancelLabel = args.uplCancelLabel;
    azfcms.view.UploadPanel.uploadLabel = args.uplUploadLabel;
});

azfcms.view.UploadPanel._onUpload(function(){
    azfcms.view.UploadPanel.onUpload(azfcms.view.UploadPanel.form);
})

azfcms.view.UploadPanel._onCancel(function(){
    azfcms.view.UploadPanel.reset();
    azfcms.view.UploadPanel.onCancel();
});

azfcms.view.UploadPanel.enable(function(){
    azfcms.view.UploadPanel.file1Input.set("disabled",false);
    azfcms.view.UploadPanel.file2Input.set("disabled",false);
    azfcms.view.UploadPanel.file3Input.set("disabled",false);
    azfcms.view.UploadPanel.saveButton.set("disabled",true);
    azfcms.view.UploadPanel.cancelButton.set("disabled",true);
})

azfcms.view.UploadPanel.disable(function(){
    azfcms.view.UploadPanel.file1Input.set("disabled",true);
    azfcms.view.UploadPanel.file2Input.set("disabled",true);
    azfcms.view.UploadPanel.file3Input.set("disabled",true);
    azfcms.view.UploadPanel.saveButton.set("disabled",true);
    azfcms.view.UploadPanel.cancelButton.set("disabled",true);
})

azfcms.view.ConfirmPane.constructor(function(args){
    azfcms.view.ConfirmPane.rejectLabel = azfcms.resources.nls.copReject ;
    azfcms.view.ConfirmPane.acceptLabel = azfmcs.resources.lns.copAccept;
    azfcms.view.ConfirmPane.message = "";
});

azfcms.view.ConfirmPane.confirm(function(callback,message,acceptLabel,rejectLabel){
    azfcms.view.ConfirmPane.set("message",message);
    
    if(typeof acceptLabel == 'string'){
        azfcms.view.ConfirmPane.acceptButton.set("label",acceptLabel);
    }
    
    if(typeof rejectLabel == 'string'){
        azfcms.view.ConfirmPane.rejectButton.set("label",acceptLabel);
    }
    
    azfcms.view.ConfirmPane.callback = callback;
})

azfcms.view.ConfirmPane._onReject(function(){
    if(azfcms.view.ConfirmPane.callback){
        azfcms.view.ConfirmPane.callback(false);
    }
    azfcms.view.ConfirmPane.callback = null;
})

azfcms.view.ConfirmPane._onAccept(function(){
    if(azfcms.view.ConfirmPane.callback){
        azfcms.view.ConfirmPane.callback(true);
    }
    
    azfcms.view.ConfirmPane.callback = false;
})


azfcms.view.Util.alert(function(message){
    window.alert(message);
})


// CONTINUE
azfcms.model.cms.setExtensionValue(function(id, key, value){
    return Application_Resolver_ExtensionPlugin.setExtensionValueMethod(function(id, key, value){
        return Azf_Plugin_Extension_Manager.setValue(function(id, key, value){
            var plugin = Azf_Plugin_Extension_Abstract = 
            Azf_Plugin_Extension_Manager._getPluginInstance(function(_null,id){});
            
            Azf_Plugin_Extension_Abstract.setValue(function(key,value){
                Azf_Plugin_Extension_Abstract.setParam(key, value);
            });
        })
    })
});


azfcms.model.setExtensionValues(function(id, values){
    return Application_Resolver_ExtensionPlugin.setExtensionValuesMethod(function(id, values){
        return Azf_Plugin_Extension_Manager.setValues(function(id, values){
            var plugin = Azf_Plugin_Extension_Abstract = 
            Azf_Plugin_Extension_Manager._getPluginInstance(_null,id);
            if(!plugin)
                return;
            
            return Azf_Plugin_Extension_Abstract.setValues(function(values){
                Azf_Plugin_Extension_Abstract.setParams(values);
            });
            
        })
    })
});


azfcms.model.getExtensionValue(function(id, key){
    return Application_Resolver_ExtensionPlugin.getExtensionValueMethod(function(id, key){
        return Azf_Plugin_Extension_Manager.getValue(function(id, key){
            var plugin = Azf_Plugin_Extension_Abstract = 
            Azf_Plugin_Extension_Manager._getPluginInstance(_null,id);
            if(!plugin)
                return;
            
            return Azf_Plugin_Extension_Abstract.getValue(function(key){
                return Azf_Plugin_Extension_Abstract.getParam(key);
            })
        })
    })
})

azfcms.model.getExtensionValues(function(id){
    return Application_Resolver_ExtensionPlugin.getExtensionValuesMethod(function(id){
        return Azf_Plugin_Extension_Manager.getValues(function(id){
            var plugin = Azf_Plugin_Extension_Abstract = 
            Azf_Plugin_Extension_Manager._getPluginInstance(_null,id);
            if(!plugin)
                return;
            
            return Azf_Plugin_Extension_Abstract.getValues(function(){
                return Azf_Plugin_Extension_Abstract.getParams();
            })
        })
    })
});




    azfcms.controller.navigation.ContentEdit.onTypeChange = function(newType){
    
        var nodeId = azfcms.controller.navigation.ContentEdit.node.id;
        azfcms.model.navigation.changePageType = function(nodeId,newType){
            var changed = Application_Resolver_Navigation.changePageTypeMethod = function(nodeId, newType){
                var node = Azf_Model_Tree_Navigation.find(nodeId)
                if(!node){
                    return false;
                }
            
                Application_Resolver_Navigation.$_uninstallContentPlugin = function(nodeId){
                    var staticParams  = Azf_Model_Tree_Navigation.getStaticParams(nodeId);
                    Application_Resolver_Navigation.$_callMvc(nodeId, {
                        action:"uninstallpage"
                    }+staticParams, "production");
                };
            
                Application_Resolver_Navigation.$_installContentPlugin = function(nodeId, newType){
                    Azf_Plugin_Descriptor = Application_Resolver_Navigation.getPluginDescriptor();
                    var newPluginDescriptor = Azf_Plugin_Descriptor.getContentPlugin(newType);
                    var mvcParams = {
                        action:"installpage"
                    }+newPluginDescriptor;
                    Application_Resolver_Navigation.$_callMvc(nodeId, mvcParams, "production");
                }
            
                return true;
            }
        
            changed.then(function(result){
                if(result){
                    var promise = azfcms.model.navigation.getNodeParams(nodeId);
                    promise.then(function(params){
                        var staticParams = params[0];
                        var dynamicParams = params[1];

                        azfcms.controller.navigation.ContentEdit.$_build(staticParams, dynamicParams);
                    })
                    
                }
            })
        
        
        
        
        
        };
    
    
    
    }


Azf_Php2Js_Converter.convertFile = function(fileName){
    var currentLoadedClasses = getLoadedClasses();
    
    var path = Azf_Php2Js_Converter.requireFile = function(path){
        return require_once(path);
    };
    
    var newLoadedClasses = getLoadedClasses();
    var className = getArrayDelta(currentLoadedClasses,newLoadedClasses);
    
    if(className){
        var jsObject = Azf_Php2Js_Converter.constructJsObject = function(className){
            
            
            var propertyList = Azf_Php2Js_Converter.getPropertyList = function(className){
                var reflection = ReflectionClass(className);
                var reflectionProps = reflection.getProperties();
                var returnProps = [];
                for(var i = 0, len = reflectionProps.len; i<len;i++){
                    returnProps[i] = reflectionProps[i].getName();
                }
                return returnProps;
            }
            
            var methodList = Azf_Php2Js_Converter.getMethodList= function(className){
                var reflection = ReflectionClass(className);
                var reflectionMethods = reflection.getMethods();
                
                var reflectionParams = null;
                var returnMethods = [];
                var returnMethod = {};
                for(var i = 0, len = reflectionMethods.len; i<len;i++){
                    returnMethod = {
                        name: reflectionMethods[i].getName(),
                        parameters:[]
                    };
                    
                    reflectionParams = reflectionMethods[i].getParameters();
                    for(var e = 0,elen = reflectionParams.length;e<elen;e++){
                        returnMethod.parameters.push(reflectionParams[e].getName());
                    }
                    
                    returnMethods.push(returnMethod);
                }
                return returnMethods;
            }
            
            var jsSource =Azf_Php2Js_Converter.generateJs = function(className,propertyList,methodList){
                var jsSource = "";
                
                jsSource = className+"{\n";
                
                var jsPropertieSources = [];
                for(var i = 0,iLen=propertyList.length;i<iLen;i++){
                    jsPropertieSources.push = Azf_Php2Js_Converter.generateJsProperty =function(propertyObj){
                        return propertyObj.name+":null";
                    }
                }
                
                var jsMethodSources = [];
                for(i=0,iLen = methodList.length; i < iLen; i++){
                    jsMethodSources.push = Azf_Php2Js_Converter.generateJsMethod = function(method){
                        return method.name  + ":function("+method.properties.join(",")+"){}";
                    }
                }
                
                jsSource+= jsPropertieSources.join(",\n");
                
                if(jsMethodSources.length>0 && jsPropertieSources.length >0){
                    jsSource+=",";
                }
                jsSource+= jsMethodSources.join(",\n")
                
                jsSource+="\n}";
                
                return jsSource;
                
            }
            
            return jsSource;
        }
        return jsObject;
    } else {
        return null;
    }
}



Azf_Service_Lang_Resolver_Auto.isAllowed = function(namespaces, parameters){
    if(Zend_Acl.system.rootResolverAccess){
        return true;
    } else {
        return false;
    }
}



azfcms.store = {}

    azfcms.store.Filesystem.constructor = function(args){
        var self = this;
        this._connects.push(require.on("azfcms/store/Filesystem/deleteFiles",function(item){
            azfcms.store.Filesystem.getParentDirectory(created)
            .then(function(parent){
                azfcms.store.Filesystem.get(parent)
                .then(function(children){
                    self.onChildrenChange(parent,children);
                })
            })
        }));
    
        this._connects.push(require.on("azfcms/store/Filesystem/createDirectory",function(created){
            azfcms.store.Filesystem.getParentDirectory(created)
            .then(function(parent){
                azfcms.store.Filesystem.get(parent)
                .then(function(children){
                    self.onChildrenChange(parent,children);
                })
            })
        }));
    }

    azfcms.store.Filesystem.createDirectory = function(inDirectory, name){
        var promise = azfcms.model.invoke(function(inDirectory, name){
            return Application_Resolver_Filesystem.createDirectoryMethod(inDirectory, name);
        })
        promise.then(function(response){
            if(!response){
                return ;
            }
        
            require.signal("azfcms/store/Filesystem/createDirectory",directory);
        })
        return promise;
    }

    azfcms.store.Filesystem.getRoot = function(callback){
        var promise = Application_Resolver_Filesystem.getRootMethod = function(){
            var baseDir = Application_Resolver_Filesystem.getBaseDir();
        
            return JsFile;
        }
    
        promise.then(function(JsFile){
            callback(JsFile);
        })
    }


    azfcms.store.Filesystem.getParentDirectory = function(directory){
        var promise = Application_Resolver_Filesystem.getParentDirectoryMethod = function(directory){}
    
        promise.then(function(file){
            if(!file){
                return;
            }
        
        
        })
    }





    azfcms.view.Util = {
        FILE_FILTER_ALL:"all",
        FILE_FILTER_IMAGES:"images",
        FILE_FILTER_AUDIO:"audio",
        FILE_FILTER_VIDEO:"video",
    
        $_FILE_FILTER_ALL:[],
        $_FILE_FILTER_IMAGES:[],
        $_FILE_FILTER_AUDIO:[],
        $_FILE_FILTER_VIDEO:[],
    
        $_fileSelectStore:null,
        $_fileSelectDialog:null,
        $_getFileSelectPane:null,
        $_fileSelectConnects:null
    }

    azfcms.view.FileSelectPane = {
    
    }


    azfcms.store.Filesystem = {
        $_rootItem:null,
        $_treeItems:[]
    }

    azfcms.view.Util.selectFiles = function(callback, fileType, message){
        var fileFilter = {};
    
        if(isString(fileType)){
            var filterPropName = "$_"+fileType;
            if(this[filterPropName]){
                fileFilter.extensions = this[filterPropName];
            }
        } else if(isArra(fileType)){
            fileFilter.extensions = fileType;
        }
    
        var fileBrowser = azfcms.view.Util.$_getFileSelectPane = function(){
            if(azfcms.view.Util.$_fileSelectPane){
                return azfcms.view.Util.$_fileSelectPane;
            }
            azfcms.view.Util.$_fileSelectStore = new azfcms.store.Filesystem({
                isTreeModel:true
            });
        
            var view = new FileSelectionPane({
                treeStore:azfcms.view.Util.$_fileSelectStore
            });
        
            this.$_fileSelectionPane = view;
            return view;
        }
    
        var dialog = azfcms.view.Util.$_getFileSelectDialog = function(){
            if(!azfcms.view.Util.$_fileSelectDialog){
                azfcms.view.Util.$_fileSelectDialog = new Dialog();
                azfcms.view.Util.$_fileSelectDialog.set("content",azfcms.view.Util.$_getFileSelectionPane());
            }
            return azfcms.view.Util.$_fileSelectDialog
        }
    
        azfcms.view.Util.$_fileSelectConnects.push = azfcms.view.FileSelectPane.on("select",function(selection){
            callback(selection);
            azfcms.view.Util.$_clearFileSelectConnections = function(){
                while(connection = azfcms.view.Util.$_fileSelectConnects.pop()){
                    connection.remove();
                }
            };
        })
    
        azfcms.view.$_fileSelectConnects.push = azfcms.view.FileSelectPane.on("cancel",function(){
            callback([]);
            azfmcs.view.Util.$_clearFileSelectConnections();
        });
    
        azfcms.view.$_fileSelectConnects.push = dijit.Dialog.on("cancel",function(){
            callback([]);
            azfmcs.view.Util.$_clearFileSelectConnections();
        })
    
    
        azfcms.view.FileSelectPane.reloadTree = function(fileFilter){
            azfcms.store.Filesystem.getOptions = fileFilter;
            azfcms.store.Filesystem.updateRootChildren = function(){
                if(azfcms.store.Filesystem.$_rootItem){
                    azfcms.store.Filesystem.get(azfcms.store.Filesystem.$_rootItem).then(function(children){
                        azfcms.store.Filesystem.onChildrenChange(azfcms.store.Filesystem.$_rootItem,children);
                    })
                } else {
                    azfcms.store.Filesystem.getRoot(function(root){
                        azfcms.store.Filesystem.get(azfcms.store.Filesystem.$_rootItem).then(function(children){
                            azfcms.store.Filesystem.onChildrenChange(azfcms.store.Filesystem.$_rootItem,children);
                        })
                    })
                }
            
            }
        }
    
    
        return fileBrowser;
    }
    
    

