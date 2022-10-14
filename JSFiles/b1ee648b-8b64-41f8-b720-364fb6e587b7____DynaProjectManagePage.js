//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
	Ext.ns("GTP.AppFrameV2.DynaBizComp");
	var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

	//[Start]
	    _init: function () {
	        _this._initDataContext();

	        //初始化模块树	        
	        //	        if (Ext.isEmpty($G.Params.moduleName)) {
	        //	            var panel1 = $G.getCmp("layoutPanel1");
	        //	            panel1.expand();
	        _this._moduleTreeLoad();
	        //	        }
	        //	        else {
	        //	            $G.getCmp("layoutPanel1").hide();
	        //	        }
	        //初始化其他设置
	        _this._initSetting();
	        _this._loadListData({});
	        //初始化模块树2
	        //_this._queryModuleTree();
	    },
	//[End]

	//[Start]
	    _queryModuleTree: function (config) {
	        var treeQueryPlan = $G.QueryPlans.getQueryPlan("treeQueryPlan");
	        if (treeQueryPlan) {
	            if (!config) config = {};
	            if (_this._setCategoryLoadConfig && Ext.isFunction(_this._setCategoryLoadConfig)) {
	                config = _this._setCategoryLoadConfig.call(this, config); //判断用户自定义配置，用户可重写此方法
	            }
	            var queryPlanParam = treeQueryPlan.getQueryParam();

	            if ($G.PageExtend.QueryLevel && $G.PageExtend.QueryLevel != "0") {
	                config.action = "QueryFromRoot";
	                config.args = [$G.PageExtend.QueryLevel, queryPlanParam];
	            }
	            else {
	                config.action = "QueryFromRoot"
	                config.args = [-1, queryPlanParam];
	            }

	            var dataSource = $G.DataContext.getDataSource(treeQueryPlan.dataSource);
	            Ext.ux.AppFrame.DataSource.loadData(dataSource, queryPlanParam, config);
	        }
	    },
	//[End]

	//[Start]
	    _moduleTreeLoad: function () {
	        var nodeClickFunc = function (node, e) {

	            $G.Page._module.code = node.attributes.code;
	            $G.Page._module.isBizComponent = node.attributes.rawData.IsBizComponent;
	            $G.Page._module.text = node.attributes.rawData.Name;
	            if (!$G.Page._module.isBizComponent)
	                sbnAddExtension.disable();
	            else
	                sbnAddExtension.enable(true);
	            //todo设置过滤条件
	            var queryPlan = _this._getQueryPlan();

	            if ($G.Page._module.isBizComponent == true) {
	                queryPlan.setFilterValue("filter_BizCompName", $G.Page._module.code);
	                queryPlan.setFilterValue("filter_MT_FullCode", "");
	            } else {
	                queryPlan.setFilterValue("filter_MT_FullCode", node.attributes.fullcode + "/");
	                queryPlan.setFilterValue("filter_BizCompName", "");
	            }

	            _this._loadListData();
	        };
	        var tree = GTP.AppFrameV2.DynaBizComp.createModuleTree(nodeClickFunc, "layoutPanel1", { action: "GetLeafTreeData" });
	        $G.Page._module = { code: tree.root.text, nodeType: false, text: "功能模块" };
	    },
	//[End]

	//[Start]
	    _initDataContext: function () {
	        if (!$G.Page._dataListSource)
	            $G.Page._dataListSource = $G.DataContext.getDataSource('DynaExtensionQuery');
	        if (!$G.Page._dataEditSource)
	            $G.Page._dataEditSource = $G.DataContext.getDataSource('DynamicExtensionEdit');
	        if (!$G.Page._dataTreeSource)
	            $G.Page._dataTreeSource = $G.DataContext.getDataSource('DynaQueryModuleTree');
	    },
	//[End]

	//[Start]
	    _initSetting: function () {
	        //初始化$G.Page._module模块信息
	        if (Ext.isEmpty($G.Params.moduleName))
	            $G.Page._module = { code: $G.Params.EntityFullName };

	        //初始化模块树信息
	        //	        $G.PageExtend.QueryLevel = 1;

	        //	        var tree = $G.Page._getTreeControl();
	        //	        if (tree) tree.on("beforeexpand", function (treegrid, record) {
	        //	            if ($G.PageExtend.QueryLevel && $G.PageExtend.QueryLevel != "0")
	        //	                _this._appendRowSibing(record.id, false);
	        //	        }, this);

	        //	        var qb = $G.QueryPlans.getQueryPlan("treeQueryPlan");
	        //	        if (qb) {
	        //	            if (Ext.isEmpty(qb.orders)) {
	        //	                qb.addOrder({ ownerCt: qb });
	        //	                qb.orders.items[0].field = "OrderNo";
	        //	                qb.orders.items[0].isDesc = false;
	        //	            }
	        //	        }

	        var grid = _this._getGridControl();
	        //设置单选
	        grid.getSelectionModel().singleSelect = true;

	        //绑定分页工具条事件
	        _this.__bindGridPagingEvent(gridView);

	        //加载QueryBox
	        _this.__bindQueryBox(grid);

	        //禁用新建
	        $G.getCmp("sbnAddExtension").disable();

	        //	            _this._selectFirstNode();

	        //初始化条件操作符下拉框
	        _this._initOperator();

	        //设置页签更新事件
	        Portal.Tab.SetFocusTabEvent(function (tab, iframe) {
	            //判断是否为只读状态
	            _this._loadListData(true);
	        }, Portal.Tab.CurrentTabID());
	    },
	//[End]

	//[Start]
	    _selectTreeFirstNode: function () {
	        ///<summary>查看:actName</summary>

	        try {
	            var treeGrid = $G.Page._getTreeControl();
	            treeGrid.expandLevel(1); //商务合同默认打开一层
	            treeGrid.getSelectionModel().selectFirstRow(); //默认选中第一条记录

	        } catch (e) {
	            Ext.MessageBox.alert("异常信息", e.message);
	        }

	        $G.Page.treeGrid_RowClick();
	    },
	//[End]

	//[Start]
	    _initOperator: function () {
	        var column = $G.getCmp("gridView1").getColumnModel().getColumnById("col_OperatorType");
	        var comboBox = column.editor.field;
	        //	        comboBox.addItem(result[i].Name.zh_CN, result[i].Id);
	        comboBox.on("expand", function () {
	            var record = _this._getSelectRecord("gridView1");
	            _this._initOperatorData(comboBox, record.data.DataType);
	        });

	        _this._initOperatorData(comboBox);

	        comboBox.setEditable(false);
	        comboBox.allowBlank = false;
	    },
	//[End]

	//[Start]
	    _initOperatorData: function (comboBox, dataType) {
	        comboBox.store.removeAll();
	        comboBox.addItem("等于", "Equal");
	        comboBox.addItem("不等于", "NotEqual");
	        if (dataType && dataType == "Boolean")
	            return;
	        if (dataType && (dataType == "String" || dataType == "GTPEnum" || dataType == "DataDict")) {
	            comboBox.addItem("包含有", "Like");
	        }
	        else {
	            comboBox.addItem("大于", "GreatThan");
	            comboBox.addItem("大于等于", "GreatEqual");
	            comboBox.addItem("小于", "LessThan");
	            comboBox.addItem("小于等于", "LessEqual");
	        }

	    },
	//[End]

	//[Start]
	    _selectFirstNode: function () {
	        var tree = $G.getCmp("ModuleTree");
	        var node = tree.getRootNode().childNodes[0].select();
	    },
	//[End]

	//[Start]
	    _getTreeControl: function () {
	        return $G.getCmp("treeGrid");
	    },
	//[End]

	//[Start]
	    _getGridControl: function () {
	        return $G.getCmp('gridView');
	    },
	//[End]

	//[Start]
	    _getQueryPlan: function () {
	        var queryPlan = $G.QueryPlans.getQueryPlan("queryPlan");
	        return queryPlan;
	    },
	//[End]

	//[Start]
	    __bindGridPagingEvent: function (gridView) {
	        ///<summary>绑定分页事件</summary>
	        var pagingToolbar = $G.getCmp("paging_toolbar");
	        if (pagingToolbar) {
	            pagingToolbar.on("loaddata", function (item, index, size) {
	                var tem_queryPlan = $G.Page._getQueryPlan();
	                tem_queryPlan.currentPage = index; // pageIndex = index - 1;
	                tem_queryPlan.pageSize = size;
	                var queryPlanParam = tem_queryPlan.getQueryParam();
	                if ($G.Page.queryBoxqueryPlanParam) {
	                    queryPlanParam = _this._FormFrameQueryParamMerge(queryPlanParam, $G.Page.queryBoxqueryPlanParam);
	                }
	                _this._loadListData(queryPlanParam);
	            });
	        }
	    },
	//[End]

	//[Start]
	    __bindQueryBox: function (grid) {
	        ///////////////////////////////////////////////////////////////////////////////
	        if (!$G.Page._queryBox) {
	            var dataSource = $G.DataContext.getDataSource("DynaExtensionQuery");
	            $G.Page._queryBox = Ext.ux.query.createQueryBox(
                                dataSource.type,
                                "gridView",
                                "queryBox1",
                                false,
                                '',
                                grid
                                );
	            $G.Page._queryBox.on("getCriteira", function (queryBoxParam) {

	                $G.Page.queryBoxqueryPlanParam = queryBoxParam;
	                var pagingToolbar = $G.getCmp('paging_toolbar');
	                pagingToolbar.doLoad(0);

	            });
	        }

	        Ext.ux.query.showQueryBox("billGrid_toolbar", 0);


	        /////////////////////////////////////////////////////////////////////////////
	    },
	//[End]

	//[Start]
	    _FormFrameQueryParamMerge: function (queryPlanParam1, queryPlanParam2) {
	        ///<summary>合并查询方案参数</summary>
	        if (queryPlanParam1) {
	            var tem_queryPlanParam = $G.clone(queryPlanParam1);
	            if (queryPlanParam2) {
	                tem_queryPlanParam.filters = $G.mergeFilters(tem_queryPlanParam.filters, queryPlanParam2.filters);
	                //	                tem_queryPlanParam.orders = _this._mergeOrders(tem_queryPlanParam.orders, queryPlanParam2.orders);
	                return tem_queryPlanParam;
	            }
	            else {
	                return tem_queryPlanParam;
	            }
	        }
	        else if (queryPlanParam2) {
	            return queryPlanParam2;
	        }
	        else {
	            return undefined;
	        }
	    },
	//[End]

	//[Start]
	    _initEntityList: function (moduleCode) {
	        if (Ext.isEmpty(moduleCode))
	            moduleCode = $G.Page._module.code;
	        var entityCombo = $G.getCmp("Efd_EntityName");
	        if (entityCombo.moduleCode != moduleCode) {
	            //todo清空下拉选项
	            if (entityCombo.store.data.getCount() > 0)
	                entityCombo.store.removeAll();
	            $G.dispatcher({
	                action: "GetEntityList",
	                args: [moduleCode],
	                async: false,
	                success: function (data) {
	                    for (var i = 0; i < data.length; i++)
	                        entityCombo.addItem(data[i].EntityAlias, data[i].EntityFullName);
	                    entityCombo.moduleCode = $G.Page._module.code;
	                }
	            });
	        }
	    },
	//[End]

	//[Start]
	    _getQueryPlan: function () {
	        return $G.QueryPlans.getQueryPlan("queryPlan" || 0);
	    },
	//[End]

	//[Start]
	    _loadListData: function (needSelect) {
	        var grid = $G.getCmp("gridView");
	        var selectRecord = grid.apf_ds.getDataRecord();
	        grid.AP_loadData();

	        //	        $G.dispatcher({
	        //	            action: "GetProjectList",
	        //	            args: [queryPlan, isBizComp, bizCompName],
	        //	            success: function (data) {
	        //	                dataSource.loadData(data);

	        //	                if (needSelect && selectRecord) {
	        //	                    var grid = $G.getCmp("gridView");
	        //	                    for (var i = 0; i < grid.store.rawData.length; i++) {
	        //	                        var record = grid.store.getAt(i);
	        //	                        if (record.data.Id == selectRecord.data.Id) {
	        //	                            grid.getSelectionModel().selectRow(i);
	        //	                            grid.getView().focusRow(i);
	        //	                        }
	        //	                    }
	        //	                }

	        //	                if (data.length > 0)
	        //	                    _this.gridView_RowClick();
	        //	            }
	        //	        });
	    },
	//[End]

	//[Start]
	    _loadEditData: function (id) {
	        var dataSource = $G.Page._dataEditSource;
	        dataSource.removeAll();
	        dataSource.commitChanges();
	        if (id) {
	            $G.dispatcher({
	                action: "GetDynaProject",
	                args: [id],
	                success: function (data) {
	                    _this._initEntityList(data.BizCompName);
	                    _this._showEditWindow(true);
	                    $G.getCmp("Efd_EntityName").setReadOnly(true);
	                    dataSource.loadData(data);
	                    $G.getCmp("Efd_CopyExtension").setValue(false);
	                    $G.getCmp("Efd_CopyExtension").setReadOnly(true);
	                    $G.getCmp("Efd_ReferenceExtensionAlias").setReadOnly(true);
	                }
	            });
	        }
	        else {
	            _this._showEditWindow(true);
	            $G.getCmp("Efd_EntityName").setReadOnly(false);
	            _this._initEntityList();
	            dataSource.addRecord();
	            dataSource.setFieldValue("BizCompName", $G.Page._module.code);
	            dataSource.setFieldValue("BizCompAlias", $G.Page._module.text);
	            $G.getCmp("Efd_CopyExtension").setValue(false);
	            $G.getCmp("Efd_CopyExtension").setReadOnly(false);
	            $G.getCmp("Efd_ReferenceExtensionAlias").setReadOnly(true);
	        }
	    },
	//[End]

	//[Start]
	    _loadConditionData: function () { },
	//[End]

	//[Start]
	    _showEditWindow: function (isShow) {
	        var editWindow = $G.getCmp("windowView");
	        if (isShow) {
	            editWindow.show();
	        }
	        else {
	            editWindow.hide();
	        }
	    },
	//[End]

	//[Start]
	    _getSelectRecord: function (grid, needTip) {
	        if (!grid)
	            return null;
	        var grid = $G.getCmp(grid);
	        var records = grid.getSelectionModel().getSelections();
	        if (records && records.length) {
	            return records[0];
	        }
	        else if (needTip) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "当前没有选中记录");
	        }

	    },
	//[End]

	//[Start]
	    actAddExtension_Handler: function (sender) {
	        ///<summary>添加:actAddExtension</summary>
	        _this._setEditWindowState(false, true);
	        _this._loadEditData();
	    },
	//[End]

	//[Start]
	    actAddStaticExtension_Handler: function (sender) {
	        ///<summary>新增静态方案:actAddStaticExtension</summary>
	        _this._setEditWindowState(true, true);
	        _this._loadEditData();
	    },
	//[End]

	//[Start]
	    actEditExtension_Handler: function (sender) {
	        ///<summary>编辑:actEditExtension</summary>
	        var record = _this._getSelectRecord("gridView", true);
	        if (record) {
	            _this._setEditWindowState(Ext.isEmpty(record.data.Conditions), false);
	            _this._loadEditData(record.id);
	        }
	    },
	//[End]

	//[Start]
	    _setEditWindowState: function (isStatic, isNew) {
	        var title = "";
	        var editWindow = $G.getCmp("windowView");
	        var conditionGrid = $G.getCmp("gridView1");
	        //	        if (isNew) {
	        //	            title += "新增";
	        //	        }
	        //	        else {
	        //	            title += "编辑";
	        //	        }

	        //	        if (isStatic) {
	        //	            title += " - 静态方案";
	        //	            conditionGrid.setVisible(false);
	        //	            editWindow.setHeight(250);
	        //	            editWindow.staticProject = true;
	        //	        }
	        //	        else {
	        //	            title += " - 动态方案";
	        //	            conditionGrid.setVisible(true);
	        //	            editWindow.setHeight(460);
	        //	            editWindow.staticProject = false;
	        //	        }

	        var title = (isNew ? "新建" : "编辑") + '-' + (isStatic ? "静态方案" : "动态方案");
	        conditionGrid.setVisible(!isStatic);
	        editWindow.setHeight(isStatic ? 280 : 490);
	        editWindow.setTitle(title);
	    },
	//[End]

	//[Start]
	    actDeleteExtension_Handler: function (sender) {
	        ///<summary>删除:actDeleteExtension</summary>
	        var record = _this._getSelectRecord("gridView", true);
	        if (record) {
	            Ext.MessageBox.confirm(GTP.AppFrame.WebResource.Hint, "删除方案会清除相关记录,确认要删除么", function (e) {
	                if (e == "yes") {
	                    $G.dispatcher({
	                        action: "DeleteExtension",
	                        args: [record.id],
	                        success: function () {
	                            var grid = $G.getCmp("gridView");
	                            grid.getStore().remove(record);
	                        }
	                    });
	                }
	            });
	        }
	    },
	//[End]

	//[Start]
	    actAddCondition_Handler: function (sender) {
	        ///<summary>添加:actAddCondition</summary>
	        var record = $G.Page._dataEditSource.getDataRecord();
	        if (Ext.isEmpty(record.data.EntityName)) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请先选择业务实体");
	            return;
	        }
	        //	            var bizCompName = record.data.BizCompName;
	        var config = {
	            url: $G.getPageURLByFullName("GTP.AppFrame.PropertyTreeLookupPage"),
	            title: "请选择属性",
	            target: "_extwin",
	            features: {
	                dialogWidth: 420,
	                dialogHeight: 360
	            },

	            parameters: {
	                entityName: record.data.EntityName,
	                BizCompName: record.data.BizCompName,
	                //	                    hasLeaf: hasLeaf,
	                limitLevel: 1,
	                selectMode: 4
	            },
	            callback: function (ret) {
	                if (ret.state) {
	                    var dataSource = $G.DataContext.getDataSource('DynamicExtensionEdit.DynamicExtensionConditions');
	                    dataSource.addRecord();
	                    var conRecord = $G.DataContext.getDataSource("DynamicExtensionEdit.DynamicExtensionConditions").getDataRecord();
	                    var data = ret.returnValue;
	                    if (conRecord.data.PropertyName != data.propertyFullName) {
	                        conRecord.set("PropertyName", data.propertyFullName);
	                        conRecord.set("PropertyAlias", data.propertyName);
	                        conRecord.set("DataFullType", data.propertyType);
	                        $G.getCmp("gridView1_col_PropertyAlias_editor").setValue(data.propertyName);
	                        conRecord.set("DataType", data.propertyOType);
	                        conRecord.set("PropertyValue", null);
	                        conRecord.set("OperatorType", null);
	                    }
	                }
	            }
	        };
	        $G.open(config);
	    },
	//[End]

	//[Start]
	    actRemoveCondition_Handler: function (sender) {
	        ///<summary>移除:actRemoveCondition</summary>
	        _this._removeGridRecord("gridView1");
	    },
	//[End]

	//[Start]
	    _removeGridRecord: function (gridId) {
	        var grid = $G.getCmp(gridId);
	        var records = grid.getSelectionModel().getSelections();
	        if (records && records.length > 0) {
	            Ext.MessageBox.confirm(GTP.AppFrame.WebResource.Hint, String.format(GTP.AppFrame.WebResource.OptSelectedRecord, GTP.AppFrame.WebResource.Delete), function (e) {
	                if (e == "yes") {
	                    for (var i = 0; i < records.length; i++) {
	                        grid.getStore().remove(records[i]);
	                    }
	                }
	            });
	        }
	        else {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "当前没有选中记录");
	        }
	    },
	//[End]

	//[Start]
	    _checkProjectData: function () {
	        $G.getCmp("entityView").stopEditing();
	        var record = $G.Page._dataEditSource.getDataRecord();
	        if (Ext.isEmpty(record.data.ExtensionName)) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请填写方案名称");
	            return true;
	        }
	        if (Ext.isEmpty(record.data.EntityName)) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请选择业务实体");
	            return true;
	        }
	        var copyProject = $G.getCmp("Efd_CopyExtension").getValue();
	        if (copyProject) {
	            if (!record.data.ReferenceExtension) {
	                Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "使用复制新增功能需要先选择一个参照方案,请选择参照方案");
	                return true;
	            }
	        }
	        var conditionGrid = $G.getCmp("gridView1");
	        conditionGrid.stopEditing();
	        if (!conditionGrid.hidden) {
	            var constr = "";
	            var conditions = record.data.DynamicExtensionConditions;
	            for (var i = 0; i < conditions.length; i++) {
	                if (Ext.isEmpty(conditions[i].PropertyAlias) || Ext.isEmpty(conditions[i].OperatorType) || Ext.isEmpty(conditions[i].PropertyValue)) {
	                    Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "当前方案需要添加生效条件,请添加正确格式的生效条件");
	                    return true;
	                }
	                constr += (i != 0 ? "&" : "") + conditions[i].PropertyAlias + " " +
                    _this._getOperatorTypeAlias(conditions[i].OperatorType) + " " + conditions[i].PropertyRenderValue;
	            }
	            if (Ext.isEmpty(constr)) {
	                Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "当前方案需要添加生效条件,请添加正确格式的生效条件");
	                return true;
	            }
	            record.set("Conditions", constr);
	        }
	        return false;
	    },
	//[End]

	//[Start]
	    actAcceptHandler: function (sender) {
	        ///<summary>确定:actAccept</summary>
	        if (_this._checkProjectData())
	            return;
	        var dataSource = $G.Page._dataEditSource;
	        var changeSummary = dataSource.getChangeSummary();
	        if (changeSummary) {
	            $G.dispatcher({
	                action: "SaveProject",
	                args: changeSummary,
	                success: function () {
	                    //todo成功提示
	                    _this._loadListData();
	                    _this._showEditWindow(false);
	                }
	            });
	        }
	        else
	            _this._showEditWindow(false);
	    },
	//[End]

	//[Start]
	    actCancel_Handler: function (sender) {
	        ///<summary>取消:actCancel</summary>
	        _this._showEditWindow(false);
	    },
	//[End]

	//[Start]
	    actPublish_Handler: function (sender) {
	        ///<summary>发布:actPublish</summary>
	        var record = $G.Page._dataListSource.getDataRecord();
	        record.set('IsPublished', true);
	        $G.Page._dataEditSource.commitChanges();
	    },
	//[End]

	//[Start]
	    _checkSelectRecord: function () {
	        var gridView = _this._getGridControl();
	        var record = gridView.getSelectionModel().getSelected();
	        if (!record) {
	            Gtp.net.MessageBox.error(GTP.AppFrame.WebResource.PageError, "请选择一条数据");
	            return;
	        }
	        return record;
	    },
	//[End]

	//[Start]
	    actSetProperty_Handler: function (sender) {
	        ///<summary>配置属性:actSetProperty</summary>
	        _this._redirect(false);

	        //	        var url = $G.getPageURLByFullName("GTP.AppFrameV2.DynaBizComp.DynaPropertyManagePage");
	        //	        url += "?ExtensionId=" + record.data.Id + "&EntityFullName=" + record.data.EntityName + "&ExtensionState=" + (Ext.isEmpty(record.data.Conditions));
	        //	        //	        Portal.Tab.Show({ id: Portal.Tab.CurrentTabID() + "_" + id, title: name + "菜单信息", url: url });
	        //	        //	        Gtp.net.Global.open({ target: "_tab", id: "DynamicMenu_" + record.data.Id, title: name + "菜单信息", url: url });
	        //	        Portal.Tab.Show({
	        //	            id: "DynaExtension_" + record.data.Id,
	        //	            title: "属性配置",
	        //	            url: url
	        //	        });
	    },
	//[End]

	//[Start]
	    _redirect: function (isView) {
	        var record = _this._getSelectRecord("gridView", true);
	        if (!record)
	            return;
	        //	        var url = $G.getPageURLByFullName("GTP.AppFrameV2.DynaBizComp.DynaPropertyManagePage");
	        //	        $G.open({
	        //	            url: url,
	        //	            target: "_self",
	        //	            parameters: {
	        //	                State: isView ? "View" : null,
	        //	                ExtensionId: record.data.Id,
	        //	                EntityFullName: record.data.EntityName,
	        //	                StaticExtension: (Ext.isEmpty(record.data.Conditions))
	        //	            }
	        //	        });

	        var url = $G.getPageURLByFullName("GTP.AppFrameV2.DynaBizComp.DynaPropertyManagePage");
	        url += "?ExtensionId=" + record.data.Id + "&EntityFullName=" + record.data.EntityName + "&StaticExtension=" + (Ext.isEmpty(record.data.Conditions))
	                  + "&State=" + record.data.IsPublished;

	        Portal.Tab.Show({
	            id: "DynaExtension_" + record.data.Id,
	            title: record.data.ProjectName + ":属性配置",
	            url: url
	        });
	    },
	//[End]

	//[Start]
	    actSearchTree_Handler: function (sender) {
	        ///<summary>actSearchTree</summary>

	    },
	//[End]

	//[Start]
	    actRefreshTree_Handler: function (sender) {
	        ///<summary>actRefreshTree</summary>

	    },
	//[End]

	//[Start]
	    actRefresh_Handler: function (sender) {
	        ///<summary>刷新:actRefresh</summary>

	    },
	//[End]

	//[Start]
	    actSearch_Handler: function (sender) {
	        ///<summary>actSearch</summary>

	    },
	//[End]

	//[Start]
	    col_IsPublished_Renderer: function (val, metadata, record, rowIndex, colIndex, store) {
	        ///<summary>Grid列的渲染函数</summary>
	        var sImage;
	        var value;
	        if (record.data.IsPublished) {
	            value = "已启用";
	            sImage = "/Common/images/toolbar/GTP_start.png";
	        }
	        else {
	            sImage = "/Common/images/toolbar/GTP_Pause.png";
	            value = "已停用";
	        }
	        return String.format("<img style='margin-right:2px;vertical-align:middle' src='{0}'>{1}", sImage, value);
	    },
	//[End]

	//[Start]
	    Efd_EntityName_Select: function (item, record, index) {
	        ///<summary>Select</summary>
	        var projectRecord = $G.Page._dataEditSource.getDataRecord();
	        projectRecord.set("EntityAlias", record.data.text);
	    },
	//[End]

	//[Start]
	    gridView1_col_PropertyAlias_editor_TriggerClick: function (index) {
	        ///<summary>TriggerClick</summary>
	        var record = $G.Page._dataEditSource.getDataRecord();
	        if (Ext.isEmpty(record.data.EntityName)) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请先选择业务实体");
	            return;
	        }
	        var conRecord = $G.DataContext.getDataSource("DynamicExtensionEdit.DynamicExtensionConditions").getDataRecord();
	        if (index == 2) {
	            var config = {
	                url: $G.getPageURLByFullName("GTP.AppFrame.PropertyTreeLookupPage"),
	                title: "请选择属性",
	                target: "_extwin",
	                features: {
	                    dialogWidth: 420,
	                    dialogHeight: 360
	                },

	                parameters: {
	                    entityName: record.data.EntityName,
	                    BizCompName: record.data.BizCompName,
	                    //	                    hasLeaf: false,
	                    limitLevel: 1,
	                    selectMode: 4
	                },
	                callback: function (ret) {
	                    if (ret.state) {
	                        var data = ret.returnValue;
	                        if (conRecord.data.PropertyName != data.propertyFullName) {
	                            conRecord.set("PropertyName", data.propertyFullName);
	                            conRecord.set("PropertyAlias", data.propertyName);
	                            $G.getCmp("gridView1_col_PropertyAlias_editor").setValue(data.propertyName);
	                            conRecord.set("DataType", data.propertyOType);
	                            //	                            _this._resetConditionSetting(conRecord);
	                            conRecord.set("PropertyValue", null);
	                            conRecord.set("OperatorType", null);
	                            conRecord.set("DataFullType", null);
	                        }
	                    }
	                }
	            };
	            $G.open(config);
	        }
	        else {
	            //	            var record = $G.Page._dataEditSource.getDataRecord();
	            conRecord.set("PropertyName", null);
	            conRecord.set("PropertyAlias", null);
	            conRecord.set("DataType", null);
	            conRecord.set("OperatorType", null);
	            conRecord.set("PropertyValue", null);
	            conRecord.set("DataFullType", null);
	        }
	    },
	//[End]

	//[Start]
	    actBack_Handler: function (sender) {
	        ///<summary>返回:actBack</summary>

	    },
	//[End]

	//[Start]
	    actEnable_Handler: function (sender) {
	        ///<summary>启用:actEnable</summary>
	        var record = _this._getSelectRecord("gridView", true);
	        if (record) {
	            $G.dispatcher({
	                action: "EnableExtension",
	                args: [record.id],
	                success: function (result) {
	                    record.set('IsPublished', true);
	                    record.set('ModifyTime', result);
	                    $G.Page._dataListSource.commitChanges();
	                    _this.gridView_RowClick();
	                    //	                    $G.getCmp("btnEnable").disable();
	                    //	                    $G.getCmp("btnDisable").enable(true);
	                }
	            });
	        }
	    },
	//[End]

	//[Start]
	    actDisable_Handler: function (sender) {
	        ///<summary>停用:actDisable</summary>
	        var record = _this._getSelectRecord("gridView", true);
	        if (record) {
	            $G.dispatcher({
	                action: "DisableExtension",
	                args: [record.id],
	                success: function (result) {
	                    record.set('IsPublished', false);
	                    record.set('ModifyTime', result);
	                    $G.Page._dataListSource.commitChanges();
	                    _this.gridView_RowClick();
	                    //	                    $G.getCmp("btnDisable").disable();
	                    //	                    $G.getCmp("btnEnable").enable(true);
	                }
	            });
	        }
	    },
	//[End]

	//[Start]
	    _getOperatorTypeAlias: function (OperatorType) {
	        switch (OperatorType) {
	            case "Equal":
	                return "等于";
	            case "NotEqual":
	                return "不等于";
	            case "GreatThan":
	                return "大于";
	            case "GreatEqual":
	                return "大于等于";
	            case "LessThan":
	                return "小于";
	            case "LessEqual":
	                return "小于等于";
	            case "Like":
	                return "包含有";
	            default:
	                return null;
	        }
	    },
	//[End]

	//[Start]
	    col_OperatorType_Renderer: function (val, metadata, record, rowIndex, colIndex, store) {
	        ///<summary>Grid列的渲染函数</summary>
	        return _this._getOperatorTypeAlias(record.data.OperatorType);
	    },
	//[End]

	//[Start]
	    col_Conditions_Renderer: function (val, metadata, record, rowIndex, colIndex, store) {
	        ///<summary>Grid列的渲染函数</summary>
	        if (Ext.isEmpty(record.data.Conditions))
	            return null;
	        var conditions = record.data.Conditions.split("&");
	        var condition = record.data.Conditions.replace(/&/g, "<br>");
	        //metadata.attr = 'ext:qtip="' + record.data.PhoneNumbers + '"';
	        metadata.attr = 'ext:qtip="' + condition + '"';
	        return conditions[0] + "(条件" + conditions.length + ")";
	    },
	//[End]

	//[Start]
	    gridView_RowClick: function (item, rowIndex, e) {
	        ///<summary>RowClick</summary>
	        var record = _this._getSelectRecord("gridView", false);
	        if (record) {
	            if (record.data.IsPublished) {
	                $G.getCmp("btnEnable").disable();
	                $G.getCmp("btnDisable").enable(true);
	                //	                $G.getCmp("btnSetProperty").disable();
	                $G.getCmp("btnEditExtension").disable();
	                $G.getCmp("btnDeleteExtension").disable();
	            }
	            else {
	                $G.getCmp("btnDisable").disable();
	                $G.getCmp("btnEnable").enable(true);
	                //	                $G.getCmp("btnSetProperty").enable(true);
	                $G.getCmp("btnEditExtension").enable(true);
	                $G.getCmp("btnDeleteExtension").enable(true);
	            }
	        }
	    },
	//[End]

	//[Start]
	    actView_Handler: function (sender) {
	        ///<summary>查看:actView</summary>
	        _this._redirect(true);
	    },
	//[End]

	//[Start]
	    gridView1_col_PropertyValue_editor_TriggerClick: function (index) {
	        ///<summary>TriggerClick</summary>
	        if (index == 2) {
	            var grid = $G.getCmp("gridView1");
	            grid.stopEditing();
	            var rec = grid.getSelectionModel().getSelected();
	            var dataType = rec.get("DataFullType");
	            var dataOType = rec.get("DataType");
	            var propertyName = rec.get("PropertyName");
	            //	            var dataClass = rec.get("PropertyValue");
	            var value = rec.get("PropertyValue");
	            //	            var value = null;
	            if (Ext.isEmpty(dataOType)) {
	                Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请先选择属性");
	                return false;
	            }
	            //会有四种类型key,enum,value,object
	            switch (dataOType) {
	                case "object": //todo:待定
	                    break;
	                case "key":
	                    //showDataLookup(dataClass, Ext.util.JSON.decode(rec.get('dataInfoExp')));
	                    break;
	                case "GTPEnum":
	                case "DataDict":
	                    //	                    _this._showSimpleValueInput(dataOType, value, dataType);
	                    //	                    break;
	                    _this._switchDictInput(dataOType, value, dataType, propertyName, rec);
	                    break;
	                case "String":
	                    Ext.Msg.prompt(
	                    //_webres.Input, _webres.Content,
                                '请填写', '内容',
                                function (btn, txt) {
                                    if (btn == 'ok') {
                                        rec.set('PropertyValue', txt);
                                        rec.set('PropertyRenderValue', txt);
                                    }
                                }
                            );
	                    break;
	                default:
	                    _this._showSimpleValueInput(dataOType, value);
	                    break;
	            }
	        }
	        else {
	            var rec = $G.getCmp("gridView1").getSelectionModel().getSelected();
	            rec.set('PropertyValue', null);
	        }
	    },
	//[End]

	//[Start]
	    _switchDictInput: function (dataOType, value, dataType, propertyName, rec) {
	        if (dataType)
	            _this._showSimpleValueInput(dataOType, value, dataType);
	        else {
	            var record = $G.Page._dataEditSource.getDataRecord();
	            var entityName = record.get("EntityName");
	            $G.dispatcher({
	                action: "GetPropertyFullType",
	                args: [entityName, propertyName],
	                success: function (result) {
	                    rec.set("DataFullType", result);
	                    _this._showSimpleValueInput(dataOType, value, result);
	                }
	            });
	        }
	    },
	//[End]

	//[Start]
	    _showSimpleValueInput: function (dataOType, value, dataType) {//字符类型弹的框
	        var dlgSimpleValue;
	        var isDateTime = (dataOType == 'DateTime');
	        if (!dlgSimpleValue) dlgSimpleValue = GTP.Coding.GeneralInput.createDialog({
	            callback: function (v) {
	                var grid = $G.getCmp("gridView1");
	                var rec = grid.getSelectionModel().getSelected();
	                if (isDateTime) {
	                    v.key = Ext.decode(v.key) + "T00:00:00";
	                }
	                var renderValue = v.key;

	                if (dataOType == "enum") {
	                    if (!Ext.isEmpty(v.key)) {
	                        $G.dispatcher({
	                            action: "GetEnumInfo",
	                            async: false,
	                            args: [dataType, v.key],
	                            success: function (result) {
	                                v.key = result[0];
	                                renderValue = result[1];
	                            }
	                        });
	                    }
	                }
	                else if (dataOType == "dict") {
	                    if (!Ext.isEmpty(v.key)) {
	                        $G.dispatcher({
	                            action: "GetDicyInfo",
	                            async: false,
	                            args: [dataType, v.key],
	                            success: function (result) {
	                                renderValue = result;
	                            }
	                        });
	                    }
	                }
	                rec.set('PropertyValue', v.key);
	                rec.set('PropertyRenderValue', renderValue);
	                //	                rec.set('PropertyOValue', v.key);
	            }
	        });

	        if (dataOType == 'Long' || dataOType == 'float' || dataOType == 'Integer' || dataOType == 'Decimal' || dataOType == 'Double')
	        { dataOType = 'int'; }
	        else if (dataOType == 'DateTime')
	        { dataOType = 'date'; }
	        else if (dataOType == 'GTPEnum') {
	            dataOType = 'enum';
	        } else if (dataOType == 'DataDict') {
	            dataOType = 'dict';
	        }
	        else if (dataOType == 'Boolean') {
	            dataOType = 'radio';
	        }

	        dlgSimpleValue.showDialog({
	            dataType: dataOType,
	            value: value,
	            IsRange: false,
	            dataType1: dataType
	        });
	    },
	//[End]

	//[Start]
	    Efd_CopyExtension_Check: function (item, checked) {
	        ///<summary>Check</summary>
	        if (checked) {
	            $G.getCmp("Efd_ReferenceExtensionAlias").setReadOnly(false);
	        }
	        else {
	            var dataSource = $G.Page._dataEditSource;
	            dataSource.setFieldValue("ReferenceExtension", null);
	            dataSource.setFieldValue("ReferenceExtensionAlias", null);
	            $G.getCmp("Efd_ReferenceExtensionAlias").setReadOnly(true);
	        }
	    }
	//[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.DynaBizComp.DynaProjectManagePage = _class;
})();
//</Bottom>