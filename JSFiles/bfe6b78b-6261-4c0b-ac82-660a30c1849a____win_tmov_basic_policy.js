
Ext.define('TMOV.view.win_tmov_basic_policy', {
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
    id: 'win_tmov_basic_policy',
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
                    region: 'north',
                    border: false,
                    height: 90,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'container',
                            flex: 1,
                            margin: 5,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    flex: 1
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'txf_svr_farm_name',
                                    fieldLabel: '서버팜 이름',
                                    readOnly: true
                                },
                                {
                                    xtype: 'container',
                                    flex: 1
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            flex: 1,
                            margin: 5,
                            title: '내부 서버',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    id: 'txf_inr_main_ip',
                                    fieldLabel: '주 서버'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'txf_inr_sub_ip',
                                    fieldLabel: '보조 서버'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            flex: 1,
                            margin: 5,
                            title: '외부 서버',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    id: 'txf_out_main_ip',
                                    fieldLabel: '주 서버'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'txf_out_sub_ip',
                                    fieldLabel: '보조 서버'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    flex: 1,
                    region: 'north',
                    split: true,
                    border: false,
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
                                            xtype: 'numberfield',
                                            id: 'txf_alw_fl_sz',
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
                                            id: 'cmb_alw_fl_sz',
                                            fieldLabel: 'Label',
                                            hideLabel: true,
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
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            id: 'txf_dwl_lmt_cnt',
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
                                    hidden: true,
                                    margin: '0 0 5 0',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch',
                                        padding: ''
                                    },
                                    items: [
                                        {
                                            xtype: 'checkboxfield',
                                            id: 'chk_plc_vld_perd',
                                            width: 150,
                                            fieldLabel: '정책 유효 기간',
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelSeparator: ' ',
                                            labelWidth: 120,
                                            listeners: {
                                                change: {
                                                    fn: me.onChk_plc_vld_perdChange,
                                                    scope: me
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'datefield',
                                            hidden: true,
                                            id: 'dt_plc_vld_perd',
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
                                            id: 'txf_annc_top_pst_cnt',
                                            width: 310,
                                            fieldLabel: '공지 상위 게시 건수',
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
                                            id: 'txf_aply_odr',
                                            width: 310,
                                            fieldLabel: '결제선차수',
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
                                            id: 'txf_auto_logout_tm',
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
                                            id: 'chk_owy_yn',
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
                                    id: 'gpn_basic_policy_extension_save',
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
                                                            width: 80,
                                                            text: '삭제',
                                                            listeners: {
                                                                click: {
                                                                    fn: me.onButtonClick1,
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
                    id: 'pnl_basic_policy_exts_setting',
                    layout: 'border',
                    header: false,
                    items: [
                        {
                            xtype: 'treepanel',
                            region: 'west',
                            split: true,
                            border: false,
                            id: 'tpn_basic_policy_extension_group',
                            width: 220,
                            collapsible: true,
                            title: '확장자 그룹',
                            listeners: {
                                afterrender: {
                                    fn: me.onTpn_basic_policy_extension_groupAfterRender,
                                    scope: me
                                },
                                itemclick: {
                                    fn: me.onTpn_basic_policy_extension_groupItemClick,
                                    scope: me
                                }
                            }
                        },
                        {
                            xtype: 'gridpanel',
                            search: function() {
                                var group = Ext.getCmp('cmb_basic_policy_extension_group').getValue();
                                var search_text = Ext.getCmp('txf_basic_policy_extension_search').getValue();

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
                            id: 'gpn_basic_policy_extension_view',
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
                                                    width: 80,
                                                    text: '선택 추가',
                                                    listeners: {
                                                        click: {
                                                            fn: me.onButtonClick2,
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
                                                    id: 'cmb_basic_policy_extension_group',
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
                                                    id: 'txf_basic_policy_extension_search',
                                                    fieldLabel: '확장자 이름',
                                                    labelAlign: 'right',
                                                    labelSeparator: ' ',
                                                    listeners: {
                                                        specialkey: {
                                                            fn: me.onTxf_basic_policy_extension_searchSpecialkey,
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
                            selModel: Ext.create('Ext.selection.CheckboxModel', {

                            }),
                            listeners: {
                                itemdblclick: {
                                    fn: me.onGpn_basic_policy_extension_viewItemDblClick,
                                    scope: me
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    region: 'south',
                    height: 30,
                    id: 'pnl_basic_policy_confirm',
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
                                    id: 'btn_basic_policy_ok',
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
                                    id: 'btn_basic_policy_cancel',
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
                    fn: me.onWin_tmov_basic_policyAfterRender,
                    scope: me
                },
                beforedestroy: {
                    fn: me.onWin_tmov_basic_policyBeforeDestroy,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onChk_plc_vld_perdChange: function(field, newValue, oldValue, eOpts) {
        if (newValue === true)
        {
            Ext.getCmp('dt_plc_vld_perd').show();
        }
        else
        {
            Ext.getCmp('dt_plc_vld_perd').hide();
        }
    },

    onButtonClick1: function(button, e, eOpts) {
        var gpn_policy_extension_save = Ext.getCmp('gpn_basic_policy_extension_save');
        store = gpn_policy_extension_save.getStore();
        var removeItem = gpn_policy_extension_save.getSelectionModel().selected.items;

        if(removeItem.length === 0)
        {
            Ext.MessageBox.show({ title: '확장자 삭제', msg: '삭제할 확장자를 선택하세요.', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

        store.remove(removeItem);
    },

    onTpn_basic_policy_extension_groupAfterRender: function(component, eOpts) {
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
                            params : {
                                parent : Ext.encode(component.getSelectionModel().getSelection()[0].raw._id)
                            },
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

    onTpn_basic_policy_extension_groupItemClick: function(dataview, record, item, index, e, eOpts) {
        Ext.Ajax.request(
            {
                url : 'api/ftTMOV/GetExtension',
                params : {
                    parent : Ext.encode(record.raw._id)
                },
                success : function(res_data)
                {
                    var resObj = JSON.parse(res_data.responseText);
                    Ext.getStore('st_tmov_extension_window').loadData(resObj);
                }
            }
        );

    },

    onButtonClick2: function(button, e, eOpts) {
        var gpn_policy_extension_view = Ext.getCmp('gpn_basic_policy_extension_view');
        var items = gpn_policy_extension_view.getSelectionModel().getSelection();

        if(items.length === 0)
        {
            Ext.MessageBox.show({ title: '확장자 추가', msg: '추가할 확장자를 선택하세요.', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

        var save_store = Ext.getCmp('gpn_basic_policy_extension_save').getStore();
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

    onTxf_basic_policy_extension_searchSpecialkey: function(field, e, eOpts) {
        if(e.keyCode === 13)
        {
            Ext.getCmp('gpn_basic_policy_extension_view').search();
        }
    },

    onButtonClick: function(button, e, eOpts) {
        Ext.getCmp('gpn_basic_policy_extension_view').search();
    },

    onGpn_basic_policy_extension_viewItemDblClick: function(dataview, record, item, index, e, eOpts) {
        var store = Ext.getCmp('gpn_basic_policy_extension_save').getStore();

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

    onBt_save_policyClick: function(button, e, eOpts) {
        var win_tmov_policy_setting = Ext.getCmp('win_tmov_basic_policy');

        //기본 정책 설정
        var txt_policy_name = Ext.getCmp('txf_svr_farm_name').getValue();

        // 허용 파일 크기
        var txt_policy_max_file_size = Ext.getCmp('txf_alw_fl_sz').getValue();

        // 다운로드 제한 건수
        var txt_policy_download_count = Ext.getCmp('txf_dwl_lmt_cnt').getValue();

        // 정책 유효 기간
        var dtf_policy_expire_date = Ext.getCmp('dt_plc_vld_perd').getValue();

        // 자동 로그아웃 시간
        var txt_policy_logout_time = Ext.getCmp('txf_auto_logout_tm').getValue();

        // 단방향 여부
        var chk_policy_duplex = Ext.getCmp('chk_owy_yn').getValue();

        // 공지 상위 게시 건수
        var txf_annc_top_pst_cnt = Ext.getCmp('txf_annc_top_pst_cnt').getValue();

        // 결제선차수
        var txf_aply_odr = Ext.getCmp('txf_aply_odr').getValue();

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

        if (Ext.getCmp('chk_plc_vld_perd').getValue() === false)
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

        if (txf_annc_top_pst_cnt === '' | txf_annc_top_pst_cnt === null)
        {
            Ext.MessageBox.show({ title: '정책 설정', msg: '공지 상위 게시 건수를 입력 하세요.', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

        if (txf_aply_odr === '' | txf_aply_odr === null)
        {
            Ext.MessageBox.show({ title: '정책 설정', msg: '결제선차수를 입력 하세요.', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

        if (txt_policy_logout_time < 0 || txt_policy_logout_time === '' || txt_policy_logout_time === null)
        {
            Ext.MessageBox.show({ title: '정책 설정', msg: '자동 로그아웃 시간을 입력 하세요.', buttons: Ext.MessageBox.OK, fn: function() { return; }, icon : Ext.Msg.ERROR });
            return;
        }

        var exts = [];
        var items = Ext.getCmp('gpn_basic_policy_extension_save').getStore().data.items;

        for (var i in items)
        {
            exts.push(items[i].raw._id);
        }

        var size_type = Ext.getCmp('cmb_alw_fl_sz').getValue();

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

        //서버팜 설정
        var main_inner_ip = Ext.getCmp('txf_inr_main_ip').getValue();
        var sub_inner_ip = Ext.getCmp('txf_inr_sub_ip').getValue();
        var main_outer_ip = Ext.getCmp('txf_out_main_ip').getValue();
        var sub_outer_ip = Ext.getCmp('txf_out_sub_ip').getValue();

        var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

        if (re.test(main_inner_ip))
        {
            var parts = main_inner_ip.split(".");

            for (var i = 0; i < parts.length; i++)
            {
                if (parseInt(parseFloat(parts[i]), 10) > 255)
                {
                    Ext.Msg.alert('서버 설정', '내부 주 서버 IP주소가 올바르지 않습니다.');
                    return false;
                }
            }
        }
        else
        {
            Ext.Msg.alert('서버 설정', '내부 주 서버 IP주소가 올바르지 않습니다.');
            return false;
        }

        if (re.test(main_outer_ip))
        {
            var parts = main_outer_ip.split(".");

            for (var i = 0; i < parts.length; i++)
            {
                if (parseInt(parseFloat(parts[i]), 10) > 255)
                {
                    Ext.Msg.alert('서버 설정', '외부 주 서버 IP주소가 올바르지 않습니다.');
                    return false;
                }
            }
        }
        else
        {
            Ext.Msg.alert('서버 설정', '외부 주 서버 IP주소가 올바르지 않습니다.');
            return false;
        }

        if (sub_inner_ip !== '')
        {
            if (re.test(sub_inner_ip))
            {
                var parts = sub_inner_ip.split(".");

                for (var i = 0; i < parts.length; i++)
                {
                    if (parseInt(parseFloat(parts[i]), 10) > 255)
                    {
                        Ext.Msg.alert('서버 설정', '내부 보조 서버 IP주소가 올바르지 않습니다.');
                        return false;
                    }
                }
            }
            else
            {
                Ext.Msg.alert('서버 설정', '내부 보조 서버 IP주소가 올바르지 않습니다.');
                return false;
            }
        }

        if (sub_outer_ip !== '')
        {
            if (re.test(sub_outer_ip))
            {
                var parts = sub_outer_ip.split(".");

                for (var i = 0; i < parts.length; i++)
                {
                    if (parseInt(parseFloat(parts[i]), 10) > 255)
                    {
                        Ext.Msg.alert('서버 설정', '외부 보조 서버 IP주소가 올바르지 않습니다.');
                        return false;
                    }
                }
            }
            else
            {
                Ext.Msg.alert('서버 설정', '외부 보조 서버 IP주소가 올바르지 않습니다.');
                return false;
            }
        }

        // 망구분
        var net_dscd = 'in';

        if (win_tmov_policy_setting.isInner === true)
        {
            net_dscd = 'in';
        }
        else
        {
            net_dscd = 'out';
        }

        var save_item = {
            'server_farm' : win_tmov_policy_setting.server_farm,
            'alw_fl_sz' : txt_policy_max_file_size,
            'dwl_lmt_cnt' : txt_policy_download_count,
            'plc_vld_perd' : dtf_policy_expire_date,
            'annc_top_pst_cnt' : txf_annc_top_pst_cnt,
            'aply_odr' : txf_aply_odr,
            'auto_logout_tm' : txt_policy_logout_time,
            'owy_yn' : chk_policy_duplex,
            'exts' : exts,
            'main_inner_ip' : main_inner_ip,
            'sub_inner_ip' : sub_inner_ip,
            'main_outer_ip' : main_outer_ip,
            'sub_outer_ip' : sub_outer_ip,
            'net_dscd' : net_dscd
        };

        //정책 설정
        Ext.Ajax.request(
            {
                url : 'api/ftTMOV/ModifyServerList',
                params : {
                    config : Ext.encode(save_item),
                    userid : Ext.encode(Ext.getCmp('main').user.userid)
                },
                success : function(res_data)
                {

                    Ext.getCmp('win_tmov_basic_policy').close();
                }
            }
        );
    },

    onBt_cancel_policyClick: function(button, e, eOpts) {
        Ext.getCmp('win_tmov_basic_policy').close();
    },

    onWin_tmov_basic_policyAfterRender: function(component, eOpts) {
        var item = null;
        var policy = null;

        if (component.isInner === true)
        {
            item = Ext.getCmp('gpn_tmov_inner_server_farm').getSelectionModel().getSelection()[0].raw;
            policy = item.inner_policy;
        }
        else
        {
            item = Ext.getCmp('gpn_tmov_outer_server_farm').getSelectionModel().getSelection()[0].raw;
            policy = item.outer_policy;
        }

        component.server_farm = item.server_farm;

        Ext.getCmp('txf_svr_farm_name').setValue(item.server_name);

        Ext.getCmp('txf_inr_main_ip').setValue(item.main_inner_ip);
        Ext.getCmp('txf_inr_sub_ip').setValue(item.sub_inner_ip);

        Ext.getCmp('txf_out_main_ip').setValue(item.main_outer_ip);
        Ext.getCmp('txf_out_sub_ip').setValue(item.sub_outer_ip);

        var file_size = 0;

        if (policy.alw_fl_sz >= 1024 * 1024 * 1024)
        {
            file_size = policy.alw_fl_sz / (1024 * 1024 * 1024);
            Ext.getCmp('cmb_alw_fl_sz').setValue('GByte');
            Ext.getCmp('txf_alw_fl_sz').setValue(file_size);
        }
        else if (policy.alw_fl_sz >= 1024 * 1024)
        {
            file_size = policy.alw_fl_sz / (1024 * 1024);
            Ext.getCmp('cmb_alw_fl_sz').setValue('MByte');
            Ext.getCmp('txf_alw_fl_sz').setValue(file_size);
        }
            else if (policy.alw_fl_sz >= 1024)
            {
                file_size = policy.alw_fl_sz / (1024);
                Ext.getCmp('cmb_alw_fl_sz').setValue('KByte');
                Ext.getCmp('txf_alw_fl_sz').setValue(file_size);
            }
                else
                {
                    file_size = policy.alw_fl_sz;
                    Ext.getCmp('cmb_alw_fl_sz').setValue('Byte');
                    Ext.getCmp('txf_alw_fl_sz').setValue(file_size);
                }

        // 다운로드 제한 건수
        Ext.getCmp('txf_dwl_lmt_cnt').setValue(policy.dwl_lmt_cnt);

        // 정책 유효 기간
        if (policy.plc_vld_perd === 0 || policy.plc_vld_perd === '')
        {
            Ext.getCmp('dt_plc_vld_perd').setValue('');
        }
        else
        {
            Ext.getCmp('chk_plc_vld_perd').setValue(true);
            Ext.getCmp('dt_plc_vld_perd').setValue(policy.plc_vld_perd);
        }

        Ext.getCmp('txf_annc_top_pst_cnt').setValue(policy.annc_top_pst_cnt);
        Ext.getCmp('txf_aply_odr').setValue(policy.aply_odr);

        Ext.getCmp('txf_auto_logout_tm').setValue(policy.auto_logout_tm);
        Ext.getCmp('chk_owy_yn').setValue(policy.owy_yn);

        var gpn_policy_extension_save = Ext.getCmp('gpn_basic_policy_extension_save');
        var store = Ext.getStore('st_tmov_extension_list');
        store.loadData([]);

        Ext.Ajax.request(
            {
                url : 'api/ftTMOV/GetExtension',
                success : function(res_data)
                {
                    var resObj = JSON.parse(res_data.responseText);
                    var ext_list = policy.exts;

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

                    var cmb_policy_extension_group = Ext.getCmp('cmb_basic_policy_extension_group');
                    cmb_policy_extension_group.bindStore(extension_group_store);
                    cmb_policy_extension_group.select("확장자 그룹");
                    cmb_policy_extension_group.updateLayout();
                }
            }
        );


    },

    onWin_tmov_basic_policyBeforeDestroy: function(component, eOpts) {
        Ext.Ajax.request(
            {
                url : 'api/ftTMOV/GetServerList',
                params : {
                    server_farm : Ext.encode(Ext.getCmp('tpn_tmov_tree').getSelectionModel().getSelection()[0].raw.name),
                    user : Ext.encode(Ext.getCmp('main').user)
                },
                success : function(res_data)
                {
                    var resObj = JSON.parse(res_data.responseText);
                    Ext.getStore('st_tmov_server_list').loadData(resObj);
                }
            }
        );
    }

});