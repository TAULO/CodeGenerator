import React, { useState, useEffect } from 'react'
import QnnForm from "../modules/qnn-form";
import CustomDrawerButton from './CustomDrawerButton'
import { getOrgId } from "qnn-apih5"
import { message as Msg } from 'antd';

const FormRedraw = (props) => {
    const [changeType, setChangeType] = useState('1')

    const refsMap = {
        form: null,
        form1: null,
    }

    const orgID = getOrgId(props)

    const fourItemLayout = {
        labelCol: {
            sm: { span: 8 }
        },
        wrapperCol: {
            sm: { span: 16 }
        }
    }


    useEffect(async () => {
        if (props.clickInfo.rowInfo.name === 'edit' || props.clickInfo.rowInfo.name === 'detail') {

            const { data } = await props.myFetch('getZjXmSalaryUserReshuffleDetail', { zjXmSalaryUserReshuffleId: props.clickInfo.rowData.zjXmSalaryUserReshuffleId })
            refsMap.form.setValues({
                changeType: data.changeType
            })
            // refsMap.form.form.setFieldsValue({ changeType: data.changeType })
            refsMap.form1.form.setFieldsValue({ ...data })

            setChangeType(data.changeType)

            // setChangeType(data.changeType)

        }
    }, [props.clickInfo.rowInfo.name])


    return (
        <div>
            <div>
                <QnnForm
                    fetch={props.myFetch}
                    upload={props.myUpload}
                    headers={{ token: props.loginAndLogoutInfo.loginInfo.token }}
                    wrappedComponentRef={(me) => { refsMap.form = me }}
                    method={{}}
                    componentsKey={{}}
                    formConfig={[
                        {
                            type: 'select',
                            label: '异动类型',
                            field: 'changeType',
                            placeholder: '请选择',
                            optionData: [
                                {
                                    label: "正常异动",
                                    value: "1"
                                },
                                {
                                    label: "离职异动",
                                    value: "2"
                                }
                            ],
                            allowClear: false,
                            initialValue: '1',
                            required: true,
                            disabled: props.clickInfo.rowInfo.name === 'detail',
                            onChange: (val, obj) => {
                                setChangeType(val)
                            }
                        },
                    ]}
                />
            </div>
            <div>
                {
                    changeType === '1' ?
                        <QnnForm
                            field={'qnnform1'}
                            fetch={props.myFetch}
                            upload={props.myUpload}
                            headers={{ token: props.loginAndLogoutInfo.loginInfo.token }}
                            wrappedComponentRef={(me) => { refsMap.form1 = me }}
                            method={{}}
                            componentsKey={{}}
                            formConfig={
                                [
                                    {
                                        field: 'extensionId',
                                        type: 'string',
                                        hide: true
                                    },
                                    {
                                        field: 'zjXmSalaryUserReshuffleId',
                                        type: 'string',
                                        hide: true
                                    },
                                    {
                                        field: 'projectId',
                                        type: 'string',
                                        hide: true
                                    },
                                    {
                                        field: 'projectName',
                                        type: 'string',
                                        hide: true
                                    },
                                    {
                                        field: 'companyId',
                                        type: 'string',
                                        hide: true
                                    },
                                    {
                                        field: 'companyName',
                                        type: 'string',
                                        hide: true
                                    },
                                    {
                                        label: '姓名',
                                        field: 'realName',
                                        required: true,
                                        span: 12,
                                        disabled: props.clickInfo.rowInfo.name === 'detail',
                                        type: 'selectByQnnTable',
                                        optionConfig: {
                                            label: 'realName',
                                            value: 'realName',
                                            searchKey: "realName"
                                        },
                                        allowClear: false,
                                        onChange: async (val, obj) => {
                                            console.log(val, obj)
                                            const { data, success, message } = await props.myFetch('getWorkManagementUserExtensionDetails', { extensionId: obj.itemData.extensionId })
                                            if (success) {
                                                let formData = {
                                                    extensionId: data.extensionId,
                                                    realName: data.realName,
                                                    positionName: data.positionName,
                                                    position: data.position,
                                                    orgId: data.orgId,
                                                    orgName: data.orgName,
                                                    departmentId: data.departmentId,
                                                    departmentName: data.departmentName,
                                                    officeId: data.officeId,
                                                    officeName: data.officeName,
                                                    orgAfterTree: [
                                                        {
                                                            value: data.orgId,
                                                            label: data.orgName
                                                        }
                                                    ],
                                                    departmentAfterTree: [
                                                        {
                                                            value: data.departmentId,
                                                            label: data.departmentName
                                                        }
                                                    ],
                                                    officeAfterTree: [
                                                        {
                                                            value: data.officeId,
                                                            label: data.officeName
                                                        }
                                                    ]
                                                }
                                                obj.form.setFieldsValue({ ...formData })
                                            } else {
                                                let formData = {
                                                    extensionId: null,
                                                    realName: null,
                                                    positionName: null,
                                                    position: null,
                                                    orgId: null,
                                                    orgName: null,
                                                    departmentId: null,
                                                    departmentName: null,
                                                    officeId: null,
                                                    officeName: null,
                                                    orgAfterTree: [],
                                                    departmentAfterTree: [],
                                                    officeAfterTree: []
                                                }
                                                obj.form.setFieldsValue({ ...formData })
                                                Msg.error(message)
                                            }

                                        },
                                        formItemLayout: fourItemLayout,
                                        dropdownMatchSelectWidth: 900,
                                        qnnTableConfig: {
                                            antd: {
                                                rowKey: "extensionId"
                                            },
                                            rowSelection: {
                                                hideSelectAll: true,
                                            },
                                            fetchConfig: (obj) => {
                                                return {
                                                    apiName: "getWorkManagementUserExtensionList",
                                                    otherParams: {
                                                        orgId: orgID
                                                    }
                                                }

                                            },
                                            searchBtnsStyle: "inline",
                                            formConfig: [
                                                {
                                                    isInTable: false,
                                                    form: {
                                                        type: 'string',
                                                        field: 'extensionHistoryId',
                                                        hide: true
                                                    }
                                                },
                                                {

                                                    table: {
                                                        dataIndex: "realName",
                                                        title: "姓名",
                                                        filter: true
                                                    },
                                                    form: {
                                                        field: "realName", //表格里面的字段 
                                                        label: "姓名",
                                                        type: "string",
                                                    }
                                                },
                                                {
                                                    table: {
                                                        title: '性别',
                                                        dataIndex: 'gender',
                                                        type: 'select',
                                                    }
                                                    , form: {
                                                        type: 'select',
                                                        optionConfig: {
                                                            label: 'label',
                                                            value: 'value'
                                                        },
                                                        optionData: [
                                                            {
                                                                label: '男',
                                                                value: '0'
                                                            },
                                                            {
                                                                label: '女',
                                                                value: '1'
                                                            }
                                                        ],
                                                        placeholder: '请选择',
                                                    },
                                                },
                                                {
                                                    table: {
                                                        title: '证件类型',
                                                        dataIndex: 'idType',
                                                        type: "select",
                                                    }
                                                    , form: {
                                                        field: "idType", //表格里面的字段 
                                                        label: "证件类型",
                                                        required: true,
                                                        type: "select",
                                                        optionData: [
                                                            //默认选项数据
                                                            {
                                                                label: "身份证",
                                                                value: "0"
                                                            },
                                                            {
                                                                label: "其他",
                                                                value: "1"
                                                            }
                                                        ],
                                                    }
                                                },
                                                {
                                                    table: {
                                                        title: '证件号',
                                                        dataIndex: 'idNumber',
                                                        filter: true
                                                    }
                                                    , form: {
                                                        field: "idNumber", //表格里面的字段 
                                                        label: "证件号",
                                                        type: "string",
                                                    }
                                                },
                                                {
                                                    table: {
                                                        title: '政治面貌名字',
                                                        dataIndex: 'politicCountenanceName',
                                                    }
                                                    , form: {
                                                        type: 'string',
                                                        label: '政治面貌名字',
                                                        field: 'politicCountenanceName',
                                                    }
                                                },
                                                {
                                                    isInForm: false,
                                                    table: {
                                                        dataIndex: "userType",
                                                        title: "聘用类型",
                                                        width: 120,
                                                        type: 'select',
                                                    },
                                                    form: {
                                                        type: 'select',
                                                        field: 'userType',
                                                        fetchConfig: {
                                                            apiName: "getBaseCodeSelect",
                                                            otherParams: {
                                                                itemId: 'pinYongLeiBie'
                                                            }
                                                        },
                                                        optionConfig: {//下拉选项配置
                                                            label: 'itemName', //默认 label
                                                            value: 'itemId',//
                                                            children: 'children',
                                                        },
                                                    }
                                                },
                                                {
                                                    table: {
                                                        title: '科室名称',
                                                        dataIndex: 'officeName',
                                                    }
                                                    , form: {
                                                        type: 'string',
                                                        field: 'officeName',
                                                        placeholder: '请输入',
                                                        required: false,
                                                    }
                                                },
                                            ],
                                        },

                                    },
                                    {
                                        type: 'string',
                                        label: '岗位',
                                        field: 'positionName',
                                        placeholder: '请输入',
                                        span: 12,
                                        required: true,
                                        disabled: true,
                                        formItemLayout: fourItemLayout,
                                    },
                                    {
                                        type: 'string',
                                        label: '岗位',
                                        field: 'position',
                                        span: 12,
                                        hide: true
                                    },
                                    {
                                        type: 'string',
                                        label: '所属科室',
                                        field: 'officeName',
                                        span: 12,
                                        placeholder: '请输入',
                                        required: true,
                                        disabled: true,
                                        formItemLayout: fourItemLayout,
                                    },
                                    {
                                        type: 'string',
                                        label: '所属科室id',
                                        field: 'officeId',
                                        hide: true
                                    },
                                    {
                                        type: 'string',
                                        label: '所属部门',
                                        field: 'departmentName',
                                        span: 12,
                                        placeholder: '请输入',
                                        required: true,
                                        disabled: true,
                                        formItemLayout: fourItemLayout,
                                    },
                                    {
                                        type: 'string',
                                        label: '所属部门id',
                                        field: 'departmentId',
                                        hide: true
                                    },
                                    {
                                        type: 'string',
                                        label: '所属单位/项目',
                                        field: 'orgName',
                                        span: 24,
                                        placeholder: '请输入',
                                        required: true,
                                        disabled: true,
                                        // formItemLayout: fourItemLayout,
                                    },
                                    {
                                        type: 'string',
                                        label: '所属项目id',
                                        field: 'orgId',
                                        hide: true
                                    },
                                    // {
                                    //     field: "positionAfter", //表格的唯一key
                                    //     label: "异动岗位",
                                    //     type: "cascader",
                                    //     required: true,
                                    //     fetchConfig: {
                                    //         apiName: "getBaseCodeTree",
                                    //         otherParams: {
                                    //             itemId: 'gangWeiGuanLi'
                                    //         }
                                    //     },
                                    //     disabled: props.clickInfo.rowInfo.name === 'detail',
                                    //     span: 12,
                                    //     formItemLayout: fourItemLayout,
                                    //     optionConfig: {//下拉选项配置
                                    //         label: 'itemName', //默认 label
                                    //         value: 'itemId',//
                                    //         children: 'children',
                                    //         linkageFields: {
                                    //             'positionNameAfter': 'itemName',
                                    //         }
                                    //     },
                                    // },
                                    // {
                                    //     field: 'positionNameAfter',
                                    //     type: 'string',
                                    //     hide: true
                                    // },
                                    {
                                        field: "departmentAfterTree", //表格的唯一key
                                        label: "异动部门",
                                        type: "treeSelect",
                                        required: true,
                                        span: 24,
                                        disabled: props.clickInfo.rowInfo.name === 'detail',
                                        // formItemLayout: fourItemLayout,
                                        treeSelectOption: {
                                            selectType: "1",
                                            maxNumber: 1,
                                            fetchConfig: {
                                                //配置后将会去请求下拉选项数据
                                                apiName: "getSysDepartmentCurrentTree",
                                                paramsKey: "departmentParentId",
                                            }
                                        },
                                        onChange: async (val, obj) => {
                                            if (val.length) {
                                                const { data } = await props.myFetch('getSysComDeptProById', { departmentId: val[0].value })
                                                obj.form.setFieldsValue({
                                                    ...obj.form.getFieldsValue(),
                                                    orgAfterTree: [
                                                        {
                                                            label: data.projectName ? data.projectName : data.companyName,
                                                            value: data.projectId ? data.projectId : data.companyId,
                                                        }
                                                    ]
                                                })
                                            }
                                        }
                                    },
                                    {
                                        field: "officeAfterTree", //表格的唯一key
                                        label: "异动科室",
                                        type: "treeSelect",
                                        required: true,
                                        span: 24,
                                        disabled: props.clickInfo.rowInfo.name === 'detail',
                                        // formItemLayout: fourItemLayout,
                                        treeSelectOption: {
                                            selectType: "1",
                                            maxNumber: 1,
                                            fetchConfig: {
                                                //配置后将会去请求下拉选项数据
                                                apiName: "getSysDepartmentCurrentTree",
                                                paramsKey: "departmentParentId",
                                            }
                                        }
                                    },
                                    {
                                        field: "orgAfterTree", //表格的唯一key
                                        label: "异动单位/项目",
                                        type: "treeSelect",
                                        required: true,
                                        disabled: true,
                                        // disabled: props.clickInfo.rowInfo.name === 'detail',
                                        span: 24,
                                        // formItemLayout: fourItemLayout,
                                        treeSelectOption: {
                                            selectType: "1",
                                            maxNumber: 1,
                                            fetchConfig: {
                                                //配置后将会去请求下拉选项数据
                                                apiName: "getSysDepartmentCurrentTree",
                                                paramsKey: "departmentParentId",
                                            }
                                        }
                                    },
                                    {
                                        type: 'select',
                                        label: '是否迁移工资关系所在项目',
                                        field: 'isMoveWageRelations',
                                        placeholder: '请选择',
                                        disabled: props.clickInfo.rowInfo.name === 'detail',
                                        optionData: [
                                            {
                                                label: "否",
                                                value: "0"
                                            },
                                            {
                                                label: "是",
                                                value: "1"
                                            }

                                        ],
                                        required: true,
                                        span: 24,
                                        formItemLayout: {
                                            labelCol: {
                                                sm: { span: 8 }
                                            },
                                            wrapperCol: {
                                                sm: { span: 16 }
                                            }
                                        },
                                    },
                                ]
                            }
                        />
                        :
                        <QnnForm
                            field={'qnnform2'}
                            fetch={props.myFetch}
                            upload={props.myUpload}
                            headers={{ token: props.loginAndLogoutInfo.loginInfo.token }}
                            wrappedComponentRef={(me) => { refsMap.form1 = me }}
                            method={{}}
                            componentsKey={{}}
                            formConfig={
                                [
                                    {
                                        field: 'extensionId',
                                        type: 'string',
                                        hide: true
                                    },
                                    {
                                        field: 'zjXmSalaryUserReshuffleId',
                                        type: 'string',
                                        hide: true
                                    },
                                    {
                                        field: 'projectId',
                                        type: 'string',
                                        hide: true
                                    },
                                    {
                                        field: 'projectName',
                                        type: 'string',
                                        hide: true
                                    },
                                    {
                                        field: 'companyId',
                                        type: 'string',
                                        hide: true
                                    },
                                    {
                                        field: 'companyName',
                                        type: 'string',
                                        hide: true
                                    },
                                    {
                                        label: '姓名',
                                        field: 'realName',
                                        required: true,
                                        span: 12,
                                        disabled: props.clickInfo.rowInfo.name === 'detail',
                                        type: 'selectByQnnTable',
                                        optionConfig: {
                                            label: 'realName',
                                            value: 'realName',
                                            searchKey: "realName"
                                        },
                                        allowClear: false,
                                        onChange: async (val, obj) => {
                                            const { data, success, message } = await props.myFetch('getWorkManagementUserExtensionDetails', { extensionId: obj.itemData.extensionId })
                                            if (success) {
                                                let formData = {
                                                    extensionId: data.extensionId,
                                                    realName: data.realName,
                                                    positionName: data.positionName,
                                                    position: data.position,
                                                    orgId: data.orgId,
                                                    orgName: data.orgName,
                                                    departmentId: data.departmentId,
                                                    departmentName: data.departmentName,
                                                    officeId: data.officeId,
                                                    officeName: data.officeName
                                                }
                                                obj.form.setFieldsValue({ ...formData })
                                            } else {
                                                let formData = {
                                                    extensionId: null,
                                                    realName: null,
                                                    positionName: null,
                                                    position: null,
                                                    orgId: null,
                                                    orgName: null,
                                                    departmentId: null,
                                                    departmentName: null,
                                                    officeId: null,
                                                    officeName: null
                                                }
                                                obj.form.setFieldsValue({ ...formData })
                                                Msg.error(message)
                                            }

                                        },
                                        formItemLayout: fourItemLayout,
                                        dropdownMatchSelectWidth: 900,
                                        qnnTableConfig: {
                                            antd: {
                                                rowKey: "extensionId"
                                            },
                                            rowSelection: {
                                                hideSelectAll: true,
                                            },
                                            fetchConfig: (obj) => {
                                                return {
                                                    apiName: "getWorkManagementUserExtensionList",
                                                    otherParams: {
                                                        orgId: orgID
                                                    }
                                                }

                                            },
                                            searchBtnsStyle: "inline",
                                            formConfig: [
                                                {
                                                    isInTable: false,
                                                    form: {
                                                        type: 'string',
                                                        field: 'extensionHistoryId',
                                                        hide: true
                                                    }
                                                },
                                                {

                                                    table: {
                                                        dataIndex: "realName",
                                                        title: "姓名",
                                                        filter: true
                                                    },
                                                    form: {
                                                        field: "realName", //表格里面的字段 
                                                        label: "姓名",
                                                        type: "string",
                                                    }
                                                },
                                                {
                                                    table: {
                                                        title: '性别',
                                                        dataIndex: 'gender',
                                                        type: 'select',
                                                    }
                                                    , form: {
                                                        type: 'select',
                                                        optionConfig: {
                                                            label: 'label',
                                                            value: 'value'
                                                        },
                                                        optionData: [
                                                            {
                                                                label: '男',
                                                                value: '0'
                                                            },
                                                            {
                                                                label: '女',
                                                                value: '1'
                                                            }
                                                        ],
                                                        placeholder: '请选择',
                                                    },
                                                },
                                                {
                                                    table: {
                                                        title: '证件类型',
                                                        dataIndex: 'idType',
                                                        type: "select",
                                                    }
                                                    , form: {
                                                        field: "idType", //表格里面的字段 
                                                        label: "证件类型",
                                                        required: true,
                                                        type: "select",
                                                        optionData: [
                                                            //默认选项数据
                                                            {
                                                                label: "身份证",
                                                                value: "0"
                                                            },
                                                            {
                                                                label: "其他",
                                                                value: "1"
                                                            }
                                                        ],
                                                    }
                                                },
                                                {
                                                    table: {
                                                        title: '证件号',
                                                        dataIndex: 'idNumber',
                                                        filter: true
                                                    }
                                                    , form: {
                                                        field: "idNumber", //表格里面的字段 
                                                        label: "证件号",
                                                        type: "string",
                                                    }
                                                },
                                                {
                                                    table: {
                                                        title: '政治面貌名字',
                                                        dataIndex: 'politicCountenanceName',
                                                    }
                                                    , form: {
                                                        type: 'string',
                                                        label: '政治面貌名字',
                                                        field: 'politicCountenanceName',
                                                    }
                                                },
                                                {
                                                    isInForm: false,
                                                    table: {
                                                        dataIndex: "userType",
                                                        title: "聘用类型",
                                                        width: 120,
                                                        type: 'select',
                                                    },
                                                    form: {
                                                        type: 'select',
                                                        field: 'userType',
                                                        fetchConfig: {
                                                            apiName: "getBaseCodeSelect",
                                                            otherParams: {
                                                                itemId: 'pinYongLeiBie'
                                                            }
                                                        },
                                                        optionConfig: {//下拉选项配置
                                                            label: 'itemName', //默认 label
                                                            value: 'itemId',//
                                                            children: 'children',
                                                        },
                                                    }
                                                },
                                                {
                                                    table: {
                                                        title: '科室名称',
                                                        dataIndex: 'officeName',
                                                    }
                                                    , form: {
                                                        type: 'string',
                                                        field: 'officeName',
                                                        placeholder: '请输入',
                                                        required: false,
                                                    }
                                                },
                                            ],
                                        },

                                    },
                                    {
                                        type: 'string',
                                        label: '岗位',
                                        field: 'positionName',
                                        placeholder: '请输入',
                                        span: 12,
                                        required: true,
                                        disabled: true,
                                        formItemLayout: fourItemLayout,
                                    },
                                    {
                                        type: 'string',
                                        label: '岗位',
                                        field: 'position',
                                        span: 12,
                                        hide: true
                                    },
                                    {
                                        type: 'string',
                                        label: '所属科室',
                                        field: 'officeName',
                                        span: 12,
                                        placeholder: '请输入',
                                        required: true,
                                        disabled: true,
                                        formItemLayout: fourItemLayout,
                                    },
                                    {
                                        type: 'string',
                                        label: '所属科室id',
                                        field: 'officeId',
                                        hide: true
                                    },
                                    {
                                        type: 'string',
                                        label: '所属部门',
                                        field: 'departmentName',
                                        span: 12,
                                        placeholder: '请输入',
                                        required: true,
                                        disabled: true,
                                        formItemLayout: fourItemLayout,
                                    },
                                    {
                                        type: 'string',
                                        label: '所属部门id',
                                        field: 'departmentId',
                                        hide: true
                                    },
                                    {
                                        type: 'string',
                                        label: '所属单位/项目',
                                        field: 'orgName',
                                        span: 12,
                                        placeholder: '请输入',
                                        required: true,
                                        disabled: true,
                                        formItemLayout: fourItemLayout,
                                    },
                                    {
                                        type: 'string',
                                        label: '所属项目id',
                                        field: 'orgId',
                                        hide: true
                                    },
                                    {
                                        type: 'select',
                                        label: '离职类型',
                                        field: 'quitType',
                                        placeholder: '请选择',
                                        required: true,
                                        disabled: props.clickInfo.rowInfo.name === 'detail',
                                        fetchConfig: {
                                            apiName: "getBaseCodeSelect",
                                            otherParams: {
                                                itemId: 'liZhiLeiXing'
                                            }
                                        },
                                        optionConfig: {//下拉选项配置
                                            label: 'itemName', //默认 label
                                            value: 'itemId',//
                                            children: 'children'
                                        },
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                    },
                                    {
                                        type: 'date',
                                        label: '离职时间',
                                        field: 'quitTime',
                                        placeholder: '请选择',
                                        formItemLayout: fourItemLayout,
                                        required: true,
                                        disabled: props.clickInfo.rowInfo.name === 'detail',
                                        span: 12,
                                    },
                                    {
                                        field: "quitRemarks", //表格的唯一key
                                        label: "离职原因",
                                        type: "textarea",
                                        required: true,
                                        disabled: props.clickInfo.rowInfo.name === 'detail',
                                        formItemLayout: {
                                            labelCol: {
                                                sm: { span: 4 }
                                            },
                                            wrapperCol: {
                                                sm: { span: 20 }
                                            }
                                        },
                                        // formItemWrapperStyle: -5,
                                        span: 24,
                                    },
                                    {
                                        type: 'select',
                                        label: '是否列入黑名单',
                                        field: 'isBlacklist',
                                        placeholder: '请选择',
                                        optionData: [
                                            {
                                                label: "否",
                                                value: "0"
                                            },
                                            {
                                                label: "是",
                                                value: "1"
                                            },
                                        ],
                                        required: true,
                                        disabled: props.clickInfo.rowInfo.name === 'detail',
                                        span: 12,
                                        formItemLayout: {
                                            labelCol: {
                                                sm: { span: 10 }
                                            },
                                            wrapperCol: {
                                                sm: { span: 14 }
                                            }
                                        },
                                    },
                                    {
                                        type: 'files',
                                        label: '附件',
                                        field: 'fileList',
                                        required: false,
                                        disabled: props.clickInfo.rowInfo.name === 'detail',
                                        fetchConfig: { apiName: window.configs.domain + 'upload' },
                                        max: 999,
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                    },
                                ]
                            }
                        />
                }
                {
                    props.clickInfo.rowInfo.name !== 'detail' ?
                        <CustomDrawerButton
                            refInstance={props.refInstance} // table的ref实例
                            okFunc={async () => {
                                refsMap.form1.form.validateFields().then(async (val) => {
                                    const clickInfo = { ...props.clickInfo.rowInfo }
                                    let url = ''
                                    let params = { ...refsMap.form1.form.getFieldsValue(), changeType }

                                    // if (changeType === '1') {
                                    //     params.positionAfter = refsMap.form1.form.getFieldsValue().positionAfter.join(',')
                                    // }
                                    switch (clickInfo.name) {
                                        case 'add':
                                            url = 'addZjXmSalaryUserReshuffle'
                                            break
                                        case 'edit':
                                            url = 'updateZjXmSalaryUserReshuffle'
                                            break
                                        default:
                                            break
                                    }



                                    if (changeType === '1') {
                                        if (params.departmentName !== params.departmentAfterTree[0].label) {
                                            const { success, message } = await props.myFetch(url, params)
                                            if (success) {
                                                Msg.success('保存成功!')
                                                props.refInstance.closeDrawer()
                                                props.refInstance.refresh()
                                            } else {
                                                Msg.error(message)
                                            }
                                        } else {
                                            Msg.error('异动部门未发生改变,请确认!')
                                        }
                                    } else {
                                        const { success, message } = await props.myFetch(url, params)
                                        if (success) {
                                            Msg.success('保存成功!')
                                            props.refInstance.closeDrawer()
                                            props.refInstance.refresh()
                                        } else {
                                            Msg.error(message)
                                        }
                                    }


                                })
                            }}
                            cancelFunc={() => {
                                console.log('取消')
                            }}
                        /> : null}
            </div>
        </div >

    )
}
export default FormRedraw