
Ext.define('TMOV.view.win_tmov_policy_setting', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.form.FieldSet',
        'Ext.form.field.Number',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Date',
        'Ext.form.Label',
        'Ext.grid.Panel',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.grid.View',
        'Ext.selection.CheckboxModel',
        'Ext.tree.Panel',
        'Ext.grid.RowNumberer'
    ],

    border: false,
    height: 760,
    id: 'win_tmov_policy_setting',
    padding: '',
    width: 1024,
    layout: 'border',
    constrainHeader: true,
    title: '정책 설정',
    maximizable: true,
    modal: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    flex: 1,
                    region: 'north',
                    split: true,
                    border: false,
                    height: 150,
                    id: 'pnl_policy_basic',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            margin: 5,
                            width: 420,
                            title: '기본 설정',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch',
                                        padding: '0 0 5 0'
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            id: 'txt_policy_id',
                                            width: 310,
                                            fieldLabel: '아이디',
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelSeparator: ' ',
                                            labelWidth: 120,
                                            readOnly: true
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch',
                                        padding: '0 0 5 0'
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            id: 'txt_policy_name',
                                            width: 310,
                                            fieldLabel: '이름',
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelSeparator: ' ',
                                            labelWidth: 120,
                                            readOnly: true
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch',
                                        padding: '0 0 5 0'
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            id: 'txt_policy_employytype',
                                            width: 310,
                                            fieldLabel: '직책',
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelSeparator: ' ',
                                            labelWidth: 120,
                                            readOnly: true
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch',
                                        padding: '0 0 5 0'
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            id: 'txt_policy_download_count',
                                            width: 310,
                                            fieldLabel: '다운로드 제한 건수',
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelSeparator: ' ',
                                            labelWidth: 120
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch',
                                        padding: '0 0 5 0'
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            id: 'txt_policy_max_file_size',
                                            width: 310,
                                            fieldLabel: '최대 허용 파일 크기',
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelSeparator: ' ',
                                            labelWidth: 120
                                        },
                                        {
                                            xtype: 'container',
                                            width: 10
                                        },
                                        {
                                            xtype: 'combobox',
                                            flex: 1,
                                            id: 'cmb_policy_max_file_size',
                                            editable: false,
                                            store: [
                                                'Byte',
                                                'KByte',
                                                'MByte',
                                                'GByte'
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch',
                                        padding: '0 0 5 0'
                                    },
                                    items: [
                                        {
                                            xtype: 'checkboxfield',
                                            id: 'chk_policy_expire_date',
                                            width: 150,
                                            fieldLabel: '정책 유효 기간',
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelSeparator: ' ',
                                            labelWidth: 120,
                                            listeners: {
                                                change: {
                                                    fn: me.onCheckboxfieldChange,
                                                    scope: me
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'datefield',
                                            hidden: true,
                                            id: 'dtf_policy_expire_date',
                                            width: 160,
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelSeparator: ' ',
                                            editable: false,
                                            format: 'Y-m-d H:i:s'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch',
                                        padding: '0 0 5 0'
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            id: 'txt_policy_logout_time',
                                            width: 310,
                                            fieldLabel: '자동 로그아웃 시간',
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelSeparator: ' ',
                                            labelWidth: 120
                                        },
                                        {
                                            xtype: 'label',
                                            padding: '4 0 0 5',
                                            text: '분'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    margin: '0 0 5 0',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch',
                                        padding: '0 0 5 0'
                                    },
                                    items: [
                                        {
                                            xtype: 'checkboxfield',
                                            flex: 1,
                                            id: 'chk_policy_duplex',
                                            fieldLabel: '단방향 여부',
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelSeparator: ' ',
                                            labelWidth: 120,
                                            checked: true
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            flex: 1,
                            border: true,
                            margin: 5,
                            title: '등록된 확장자',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    flex: 1,
                                    id: 'gpn_policy_extension_save',
                                    margin: '0 0 5 0',
                                    header: false,
                                    title: 'My Grid Panel',
                                    store: 'st_tmov_extension_list',
                                    dockedItems: [
                                        {
                                            xtype: 'toolbar',
                                            dock: 'top',
                                            layout: {
                                                type: 'hbox',
                                                padding: '0 0 5 0'
                                            },
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    flex: 1,
                                                    layout: {
                                                        type: 'hbox',
                                                        align: 'stretch'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'button',
                                                            id: 'btn_policy_ext_remove',
                                                            width: 80,
                                                            text: '삭제',
                                                            listeners: {
                                                                click: {
                                                                    fn: me.onBtn_policy_ext_removeClick,
                                                                    scope: me
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'group_name',
                                            text: '그룹',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'ext_name',
                                            text: '확장자',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'ext_cmt',
                                            text: '설명',
                                            flex: 1
                                        }
                                    ],
                                    selModel: Ext.create('Ext.selection.CheckboxModel', {

                                    })
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    flex: 1,
                    region: 'center',
                    id: 'pnl_policy_extension',
                    layout: 'border',
                    header: false,
                    items: [
                        {
                            xtype: 'treepanel',
                            region: 'west',
                            split: true,
                            border: false,
                            id: 'tpn_policy_extension',
                            width: 220,
                            collapsible: true,
                            title: '확장자 그룹',
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    border: false,
                                    hidden: true,
                                    items: [
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                                align: 'stretch'
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    width: 60,
                                                    text: '추가',
                                                    listeners: {
                                                        click: {
                                                            fn: me.onButtonClick31,
                                                            scope: me
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'container',
                                                    width: 10
                                                },
                                                {
                                                    xtype: 'button',
                                                    width: 60,
                                                    text: '수정',
                                                    listeners: {
                                                        click: {
                                                            fn: me.onButtonClick111,
                                                            scope: me
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'container',
                                                    width: 10
                                                },
                                                {
                                                    xtype: 'button',
                                                    width: 60,
                                                    text: '삭제',
                                                    listeners: {
                                                        click: {
                                                            fn: me.onButtonClick211,
                                                            scope: me
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'container',
                                                    flex: 1
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            listeners: {
                                afterrender: {
                                    fn: me.onTpn_policy_extensionAfterRender,
                                    scope: me
                                },
                                itemclick: {
                                    fn: me.onTpn_policy_extensionItemClick,
                                    scope: me
                                }
                            }
                        },
                        {
                            xtype: 'gridpanel',
                            search: function() {
                                var group = Ext.getCmp('cmb_policy_extension_group').getValue();
                                var search_text = Ext.getCmp('txf_policy_extension_search').getValue();

                                var store = [];

                                Ext.Ajax.request(
                                {
                                    url : 'api/ftTMOV/GetExtension',
                                    success : function(res_data)
                                    {
                                        var resObj = JSON.parse(res_data.responseText);

                                        for (var i in resObj)
                                        {
                                            if (group !== '확장자 그룹')
                                            {
                                                if (resObj[i].group_name === group)
                                                {
                                                    if (resObj[i].ext_name.indexOf(search_text) > -1)
                                                    {
                                                        store.push(resObj[i]);
                                                    }
                                                }
                                            }
                                            else
                                            {
                                                if (resObj[i].ext_name.indexOf(search_text) > -1)
                                                {
                                                    store.push(resObj[i]);
                                                }
                                            }
                                        }

                                        Ext.getStore('st_tmov_extension_window').loadData(store);
                                    }
                                }
                                );

                            },
                            flex: 1,
                            region: 'center',
                            border: false,
                            id: 'gpn_policy_extension_view',
                            title: '확장자 설정',
                            store: 'st_tmov_extension_window',
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    border: false,
                                    items: [
                                        {
                                            xtype: 'container',
                                            flex: 1,
                                            layout: {
                                                type: 'hbox',
                                                align: 'stretch'
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    id: 'btn_policy_extension_list_add',
                                                    width: 80,
                                                    text: '선택 추가',
                                                    listeners: {
                                                        click: {
                                                            fn: me.onBtn_policy_extension_list_addClick,
                                                            scope: me
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    hidden: true,
                                                    id: 'btn_policy_extension_add',
                                                    width: 70,
                                                    text: '추가',
                                                    listeners: {
                                                        click: {
                                                            fn: me.onBtn_policy_extension_addClick,
                                                            scope: me
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'container',
                                                    width: 10
                                                },
                                                {
                                                    xtype: 'button',
                                                    hidden: true,
                                                    id: 'btn_policy_extension_modify',
                                                    width: 70,
                                                    text: '수정',
                                                    listeners: {
                                                        click: {
                                                            fn: me.onBtn_policy_extension_modifyClick,
                                                            scope: me
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'container',
                                                    width: 10
                                                },
                                                {
                                                    xtype: 'button',
                                                    hidden: true,
                                                    id: 'btn_policy_extension_remove',
                                                    width: 70,
                                                    text: '삭제',
                                                    listeners: {
                                                        click: {
                                                            fn: me.onBtn_policy_extension_removeClick,
                                                            scope: me
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'container',
                                                    flex: 1
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    id: 'cmb_policy_extension_group',
                                                    fieldLabel: '그룹',
                                                    labelAlign: 'right',
                                                    labelSeparator: ' ',
                                                    editable: false
                                                },
                                                {
                                                    xtype: 'container',
                                                    width: 10
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    id: 'txf_policy_extension_search',
                                                    fieldLabel: '확장자 이름',
                                                    labelAlign: 'right',
                                                    labelSeparator: ' ',
                                                    listeners: {
                                                        specialkey: {
                                                            fn: me.onTxf_policy_extension_searchSpecialkey,
                                                            scope: me
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'container',
                                                    width: 10
                                                },
                                                {
                                                    xtype: 'button',
                                                    width: 80,
                                                    text: '검색',
                                                    listeners: {
                                                        click: {
                                                            fn: me.onButtonClick,
                                                            scope: me
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    width: 80,
                                    text: '번호'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 160,
                                    dataIndex: 'ext_name',
                                    text: '확장자 이름'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'ref_cnm',
                                    text: 'MIME 유형',
                                    flex: 2
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'ext_cmt',
                                    text: '기타 설명',
                                    flex: 2
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 220,
                                    dataIndex: 'cr_dtm',
                                    text: '등록 일'
                                }
                            ],
                            listeners: {
                                itemdblclick: {
                                    fn: me.onGpn_policy_extension_viewItemDblClick,
                                    scope: me
                                }
                            },
                            selModel: Ext.create('Ext.selection.CheckboxModel', {

                            })
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    region: 'south',
                    height: 30,
                    id: 'pnl_policy_save',
                    layout: 'fit',
                    header: false,
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'end'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    id: 'bt_save_policy',
                                    width: 100,
                                    text: '저장',
                                    listeners: {
                                        click: {
                                            fn: me.onBt_save_policyClick,
                                            scope: me
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    id: 'bt_cancel_policy',
                                    margin: '0 10 0 10',
                                    width: 100,
                                    text: '취소',
                                    listeners: {
                                        click: {
                                            fn: me.onBt_cancel_policyClick,
                                            scope: me
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            listeners: {
                afterrender: {
                    fn: me.onWin_tmov_policy_settingAfterRender,
                    scope: me
                },
                beforedestroy: {
                    fn: me.onWin_tmov_policy_settingBeforeDestroy,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onCheckboxfieldChange: function(field, newValue, oldValue, eOpts) {
        if (newValue === true)
        {
            Ext.getCmp('dtf_policy_expire_date').show();
        }
        else
        {
            Ext.getCmp('dtf_policy_expire_date').hide();
        }
    },

    onBtn_policy_ext_removeClick: function(button, e, eOpts) {
        var gpn_policy_extension_save = Ext.getCmp('gpn_policy_extension_save');
        store = gpn_policy_extension_save.getStore();
        var removeItem = gpn_policy_extension_save.getSelectionModel().selected.items;

        if(removeItem.length === 0)
        {
            Ext.MessageBox.show({ title: '확장자 삭제', msg: '삭제할 확장자를 선택하세요.', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

        store.remove(removeItem);
    },

    onButtonClick31: function(button, e, eOpts) {
        var component = Ext.getCmp('tpn_policy_extension');

        if(component.getSelectionModel().getSelection().length === 0)
        {
            Ext.MessageBox.show({
                title: '그룹 추가',
                msg: '부모 그룹을 선택하세요',
                buttons: Ext.MessageBox.OK,
                fn: function()
                {
                    return;
                },
                icon : Ext.Msg.ERROR
            });

            return;
        }

        Ext.Msg.prompt('그룹 추가', '그룹 이름을 입력해주세요 : ', function(btn, text){
            if (btn == 'ok')
            {
                var item = component.getSelectionModel().selected.items[0].raw;
                Ext.Ajax.request(
                    {
                        url : 'api/ftTMOV/AddExtensionGroup',
                        params : {
                            'parent' : Ext.encode(item._id),
                            'name' : Ext.encode(text)
                        },
                        success : function(res_data)
                        {
                            Ext.Ajax.request(
                                {
                                    url : 'api/ftTMOV/GetExtensionGroup',
                                    success : function(res_data)
                                    {
                                        var resObj = JSON.parse(res_data.responseText);
                                        component.setRootNode(resObj);
                                    }
                                }
                            );
                        }
                    }
                );
            }
        });


    },

    onButtonClick111: function(button, e, eOpts) {
        var component = Ext.getCmp('tpn_policy_extension');

        if(component.getSelectionModel().getSelection().length === 0)
        {
            Ext.MessageBox.show({
                title: '그룹 수정',
                msg: '수정할 그룹을 선택하세요',
                buttons: Ext.MessageBox.OK,
                fn: function()
                {
                    return;
                },
                icon : Ext.Msg.ERROR
            });

            return;
        }

        var item = component.getSelectionModel().getSelection()[0].raw;

        if(item.parent === null)
        {
            Ext.MessageBox.show({
                title: '그룹 수정',
                msg: '최상위 그룹은 수정할 수 없습니다.',
                buttons: Ext.MessageBox.OK,
                fn: function()
                {
                    return;
                },
                icon : Ext.Msg.ERROR
            });

            return;
        }

        Ext.Msg.prompt('그룹 수정', '그룹 이름을 입력해주세요 : ', function(btn, text){
            if (btn == 'ok')
            {
                item.text = text;

                Ext.Ajax.request(
                    {
                        url : 'api/ftTMOV/ModifyExtensionGroup',
                        params : {
                            'group' : Ext.encode(item)
                        },
                        success : function(res_data)
                        {
                            Ext.Ajax.request(
                                {
                                    url : 'api/ftTMOV/GetExtensionGroup',
                                    success : function(res_data)
                                    {
                                        var resObj = JSON.parse(res_data.responseText);
                                        component.setRootNode(resObj);
                                    }
                                }
                            );
                        }
                    }
                );
            }
        });


    },

    onButtonClick211: function(button, e, eOpts) {
        var component = Ext.getCmp('tpn_policy_extension');

        if(component.getSelectionModel().getSelection().length === 0)
        {
            Ext.MessageBox.show({
                title: '그룹 삭제',
                msg: '삭제할 그룹을 선택하세요',
                buttons: Ext.MessageBox.OK,
                fn: function()
                {
                    return;
                },
                icon : Ext.Msg.ERROR
            });

            return;
        }

        var item = component.getSelectionModel().getSelection()[0].raw;

        if(item.parent === null)
        {
            Ext.MessageBox.show({
                title: '그룹 삭제',
                msg: '최상위 그룹은 삭제할 수 없습니다.',
                buttons: Ext.MessageBox.OK,
                fn: function()
                {
                    return;
                },
                icon : Ext.Msg.ERROR
            });

            return;
        }

        Ext.Msg.confirm('그룹 삭제', '그룹을 삭제 하시겠습니까?',function(btn) {
            if (btn === 'yes')
            {
                Ext.Ajax.request(
                    {
                        url : 'api/ftTMOV/RemoveExtensionGroup',
                        params : {
                            '_id' : Ext.encode(item._id)
                        },
                        success : function(res_data)
                        {
                            Ext.Ajax.request(
                                {
                                    url : 'api/ftTMOV/GetExtensionGroup',
                                    success : function(res_data)
                                    {
                                        var resObj = JSON.parse(res_data.responseText);
                                        component.setRootNode(resObj);
                                    }
                                }
                            );
                        }
                    }
                );
            }
        });
    },

    onTpn_policy_extensionAfterRender: function(component, eOpts) {
        Ext.Ajax.request(
            {
                url : 'api/ftTMOV/GetExtensionGroup',
                success : function(res_data)
                {
                    var resObj = JSON.parse(res_data.responseText);
                    component.setRootNode(resObj);
                    component.getSelectionModel().select(0);

                    Ext.Ajax.request(
                        {
                            url : 'api/ftTMOV/GetExtension',
                            success : function(res_data)
                            {
                                var resObj = JSON.parse(res_data.responseText);
                                Ext.getStore('st_tmov_extension_window').loadData(resObj);
                            }
                        }
                    );

                }
            }
        );


    },

    onTpn_policy_extensionItemClick: function(dataview, record, item, index, e, eOpts) {
        Ext.Ajax.request(
            {
                url : 'api/ftTMOV/GetExtension',
                params : {
                    group_name : Ext.encode(record.raw.name)
                },
                success : function(res_data)
                {
                    var resObj = JSON.parse(res_data.responseText);
                    Ext.getStore('st_tmov_extension_window').loadData(resObj);
                }
            }
        );

    },

    onBtn_policy_extension_list_addClick: function(button, e, eOpts) {
        var gpn_policy_extension_view = Ext.getCmp('gpn_policy_extension_view');
        var items = gpn_policy_extension_view.getSelectionModel().getSelection();

        if(items.length === 0)
        {
            Ext.MessageBox.show({ title: '확장자 추가', msg: '추가할 확장자를 선택하세요.', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

        var save_store = Ext.getCmp('gpn_policy_extension_save').getStore();
        var save_items = save_store.data.items;

        var isExistExtensionName = [];

        for (var i in items)
        {
            var isExist = false;

            for (var j in save_items)
            {
                if (items[i].raw._id === save_items[j].raw._id)
                {
                    isExist = true;
                    isExistExtensionName.push(save_items[j].raw.ext_name);
                }
            }

            if (isExist === false)
            {
                save_store.add(items[i].raw);
            }
        }

        if (isExistExtensionName.length !== 0)
        {
            Ext.MessageBox.show({ title: '확장자 추가', msg: '등록된 확장자가 있습니다. ( ' + isExistExtensionName + ' )' , buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

    },

    onBtn_policy_extension_addClick: function(button, e, eOpts) {
        var component = Ext.getCmp('tpn_policy_extension');

        if(component.getSelectionModel().getSelection().length === 0)
        {
            Ext.MessageBox.show({
                title: '확장자 추가',
                msg: '확장자를 추가할 그룹을 선택하세요',
                buttons: Ext.MessageBox.OK,
                fn: function()
                {
                    return;
                },
                icon : Ext.Msg.ERROR
            });

            return;
        }

        var item = component.getSelectionModel().getSelection()[0].raw;

        var view = Ext.getCmp('gpn_policy_extension_view');

        Ext.create('TMOV.view.win_tmov_extension', {
            isModify : false,
            group : item,
            view : view
        }).show();
    },

    onBtn_policy_extension_modifyClick: function(button, e, eOpts) {
        var gpn_policy_extension_view = Ext.getCmp('gpn_policy_extension_view');

        if (gpn_policy_extension_view.getSelectionModel().getSelection().length === 0)
        {
            Ext.MessageBox.show({ title: '확장자 수정', msg: '확장자를 선택하세요', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

        var tpn_policy_extension = Ext.getCmp('tpn_policy_extension');

        Ext.create('TMOV.view.win_tmov_extension', {
            isModify : true,
            item : gpn_policy_extension_view.getSelectionModel().getSelection()[0].raw,
            group : tpn_policy_extension.getSelectionModel().getSelection()[0].raw,
            view : gpn_policy_extension_view
        }).show();
    },

    onBtn_policy_extension_removeClick: function(button, e, eOpts) {
        var gpn_policy_extension_view = Ext.getCmp('gpn_policy_extension_view');
        var store = gpn_policy_extension_view.getStore();

        selectedItem = gpn_policy_extension_view.getSelectionModel().getSelection();
        if (selectedItem.length === 0)
        {
            Ext.MessageBox.show({ title: '확장자 삭제', msg: '삭제할 확장자를 선택하세요', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

        var tpn_tmov_extension = Ext.getCmp('tpn_policy_extension');
        var group = tpn_tmov_extension.getSelectionModel().getSelection();

        Ext.Msg.confirm('확장자 삭제', '삭제 하시겠습니까?',function(btn) {
            if (btn === 'yes')
            {
                var gpn_policy_extension_save = Ext.getCmp('gpn_policy_extension_save');
                save_store = gpn_policy_extension_save.getStore();
                save_items = save_store.data.items;

                usedItems = [];
                var removeItems = [];

                isAllExist = false;

                for (var k in selectedItem)
                {
                    var isExist = false;

                    for (var i in save_items)
                    {
                        if (save_items[i].raw._id === selectedItem[k].raw._id)
                        {
                            isExist = true;
                            isAllExist = true;
                            usedItems.push(selectedItem[k].raw.ext_name);
                            break;
                        }
                    }

                    if (isExist === false)
                    {
                        removeItems.push(selectedItem[k].raw);
                    }
                }

                Ext.Ajax.request(
                    {
                        url : 'api/ftTMOV/RemoveExtension',
                        params : {
                            items : Ext.encode(removeItems),
                            userid : Ext.encode(Ext.getCmp('main').user['@id'])
                        },
                        success : function(res_data)
                        {
                            var resObj = JSON.parse(res_data.responseText);

                            Ext.Ajax.request(
                                {
                                    url : 'api/ftTMOV/GetExtension',
                                    params : {
                                        parent : Ext.encode(group[0].raw._id)
                                    },
                                    success : function(res_data)
                                    {
                                        var resObj = JSON.parse(res_data.responseText);
                                        store.loadData(resObj);
                                    }
                                }
                            );

                            if (resObj.retVal === false || isAllExist === true)
                            {
                                for (var i in resObj.usedItems)
                                {
                                    if ( usedItems.indexOf(resObj.usedItems[i]) > -1 )
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        usedItems.push(resObj.usedItems[i]);
                                    }
                                }

                                Ext.MessageBox.show({ title: '확장자 삭제', msg: '정책에서 사용중인 확장자입니다. (' + usedItems + ')', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
                                return;
                            }
                        }
                    }
                );
            }
        });
    },

    onTxf_policy_extension_searchSpecialkey: function(field, e, eOpts) {
        if(e.keyCode === 13)
        {
            Ext.getCmp('gpn_policy_extension_view').search();
        }
    },

    onButtonClick: function(button, e, eOpts) {
        Ext.getCmp('gpn_policy_extension_view').search();
    },

    onGpn_policy_extension_viewItemDblClick: function(dataview, record, item, index, e, eOpts) {
        var store = Ext.getCmp('gpn_policy_extension_save').getStore();

        var isExist = false;
        for (var i in store.data.items)
        {
            if (store.data.items[i].raw._id === record.raw._id)
            {
                isExist = true;
            }
        }

        if( isExist === true)
        {
            Ext.MessageBox.show({ title: '확장자 추가', msg: '등록된 확장자가 있습니다', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

        store.add( record.raw );
    },

    onWin_tmov_policy_settingAfterRender: function(component, eOpts) {
        Ext.getCmp('cmb_policy_max_file_size').select('GByte');
        var data = null;
        var item = null;

        if(component.isInner === true)
        {
            data = Ext.getCmp('gpn_inner_user_policy').getSelectionModel().getSelection()[0].raw;
            Ext.getCmp('txt_policy_name').setValue(data.surname);
            Ext.getCmp('txt_policy_id').setValue(data.userid);
            Ext.getCmp('txt_policy_employytype').setValue(data.employytype);
            item = data.inner_policy;
        }
        else
        {
            data = Ext.getCmp('gpn_outer_user_policy').getSelectionModel().getSelection()[0].raw;
            Ext.getCmp('txt_policy_name').setValue(data.surname);
            Ext.getCmp('txt_policy_id').setValue(data.userid);
            Ext.getCmp('txt_policy_employytype').setValue(data.employytype);
            item = data.outer_policy;
        }

        console.log(data);

        var file_size = 0;

        if (item.alw_fl_sz >= 1024 * 1024 * 1024)
        {
            file_size = item.alw_fl_sz / (1024 * 1024 * 1024);
            Ext.getCmp('cmb_policy_max_file_size').setValue('GByte');
            Ext.getCmp('txt_policy_max_file_size').setValue(file_size);
        }
        else if (item.alw_fl_sz >= 1024 * 1024)
        {
            file_size = item.alw_fl_sz / (1024 * 1024);
            Ext.getCmp('cmb_policy_max_file_size').setValue('MByte');
            Ext.getCmp('txt_policy_max_file_size').setValue(file_size);
        }
            else if (item.alw_fl_sz >= 1024)
            {
                file_size = item.alw_fl_sz / (1024);
                Ext.getCmp('cmb_policy_max_file_size').setValue('KByte');
                Ext.getCmp('txt_policy_max_file_size').setValue(file_size);
            }
                else
                {
                    file_size = item.alw_fl_sz;
                    Ext.getCmp('cmb_policy_max_file_size').setValue('Byte');
                    Ext.getCmp('txt_policy_max_file_size').setValue(file_size);
                }


        Ext.getCmp('txt_policy_download_count').setValue(item.dwl_lmt_cnt);
        console.log(item);

        if (item.plc_vld_perd === 0 || item.plc_vld_perd === '')
        {
            Ext.getCmp('dtf_policy_expire_date').setValue('');
        }
        else
        {
            Ext.getCmp('chk_policy_expire_date').setValue(true);
            Ext.getCmp('dtf_policy_expire_date').setValue(item.plc_vld_perd);
        }

        Ext.getCmp('txt_policy_logout_time').setValue(item.auto_logout_tm);
        Ext.getCmp('chk_policy_duplex').setValue(item.owy_yn);

        var gpn_policy_extension_save = Ext.getCmp('gpn_policy_extension_save');
        var store = Ext.getStore('st_tmov_extension_list');
        store.loadData([]);

        Ext.Ajax.request(
            {
                url : 'api/ftTMOV/GetExtension',
                success : function(res_data)
                {
                    var resObj = JSON.parse(res_data.responseText);
                    var ext_list = item.exts;

                    for (var i in ext_list)
                    {
                        for (var k in resObj)
                        {
                            if (ext_list[i] === resObj[k]._id)
                                store.add(resObj[k]);
                        }
                    }
                }
            }
        );


        var data = [];

        Ext.Ajax.request(
            {
                url : 'api/ftTMOV/GetExtensionGroupList',
                success : function(res_data)
                {
                    var resObj = JSON.parse(res_data.responseText);

                    for ( var i in resObj)
                        data.push(resObj[i]);


                    var extension_group_store = Ext.create('Ext.data.Store', {
                        fields: ['text', '_id'],
                        data : data
                    });

                    var cmb_policy_extension_group = Ext.getCmp('cmb_policy_extension_group');
                    cmb_policy_extension_group.bindStore(extension_group_store);
                    cmb_policy_extension_group.select("확장자 그룹");
                    cmb_policy_extension_group.updateLayout();
                }
            }
        );


    },

    onBt_save_policyClick: function(button, e, eOpts) {
        var component = Ext.getCmp('win_tmov_policy_setting');

        //기본 정책 설정
        var txt_policy_max_file_size = Ext.getCmp('txt_policy_max_file_size').getValue();
        var txt_policy_download_count = Ext.getCmp('txt_policy_download_count').getValue();
        var dtf_policy_expire_date = Ext.getCmp('dtf_policy_expire_date').getValue();
        var txt_policy_logout_time = Ext.getCmp('txt_policy_logout_time').getValue();
        var chk_policy_duplex = Ext.getCmp('chk_policy_duplex').getValue();

        if (dtf_policy_expire_date === null)
        {
            dtf_policy_expire_date = '';
        }

        if (txt_policy_max_file_size < 0 || txt_policy_max_file_size === '' || txt_policy_max_file_size === null)
        {
            Ext.MessageBox.show({ title: '정책 설정', msg: '최대 허용 파일 크기를 입력 하세요.', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

        if (txt_policy_download_count < 0 || txt_policy_download_count === '' || txt_policy_download_count === null)
        {
            Ext.MessageBox.show({ title: '정책 설정', msg: '다운로드 제한 건수를 입력 하세요.', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

        if (Ext.getCmp('chk_policy_expire_date').getValue() === false)
        {
            dtf_policy_expire_date = '';
        }
        else
        {
            if (dtf_policy_expire_date === '')
            {
                Ext.MessageBox.show({ title: '정책 설정', msg: '정책 유효 기간을 선택하세요', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
                return;
            }
        }

        if (txt_policy_logout_time < 0 || txt_policy_logout_time === '' || txt_policy_logout_time === null)
        {
            Ext.MessageBox.show({ title: '정책 설정', msg: '자동 로그아웃 시간을 입력 하세요.', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

        var exts = [];
        var items = Ext.getCmp('gpn_policy_extension_save').getStore().data.items;

        for (var i in items)
        {
            exts.push(items[i].raw._id);
        }

        var size_type = Ext.getCmp('cmb_policy_max_file_size').getValue();

        if (size_type === 'KByte')
        {
            txt_policy_max_file_size = txt_policy_max_file_size * 1024;
        }

        if (size_type === 'MByte')
        {
            txt_policy_max_file_size = txt_policy_max_file_size * 1024 * 1024;
        }

        if (size_type === 'GByte')
        {
            txt_policy_max_file_size = txt_policy_max_file_size * 1024 * 1024 * 1024;
        }

        var net_dscd = '01';

        if (component.isInner === true)
        {
            net_dscd = '01';
            _id = Ext.getCmp('gpn_inner_user_policy').getSelectionModel().getSelection()[0].raw._id;
        }
        else
        {
            net_dscd = '02';
            _id = Ext.getCmp('gpn_outer_user_policy').getSelectionModel().getSelection()[0].raw._id;
        }

        console.log(dtf_policy_expire_date);

        config = {
            '_id' : _id,
            'alw_fl_sz' : txt_policy_max_file_size,
            'dwl_lmt_cnt' : txt_policy_download_count,
            'plc_vld_perd' : dtf_policy_expire_date,
            'auto_logout_tm' : txt_policy_logout_time,
            'owy_yn' : chk_policy_duplex,
            'exts' : exts,
            'net_dscd' : net_dscd
        };

        Ext.Ajax.request(
            {
                url : 'api/ftTMOV/ModifyUserPolicy',
                params : {
                    config : Ext.encode(config),
                    userid : Ext.encode(Ext.getCmp('main').user.userid)
                },
                success : function(res_data)
                {
                    component.close();
                }
            }
        );

    },

    onBt_cancel_policyClick: function(button, e, eOpts) {
        Ext.getCmp('win_tmov_policy_setting').close();
    },

    onWin_tmov_policy_settingBeforeDestroy: function(component, eOpts) {
        Ext.getStore('st_tmov_user_policy').load();
    }

});