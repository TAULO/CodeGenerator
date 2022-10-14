import React from "react";
import QnnTable from "../../modules/qnn-table";
import { message as Msg } from "antd";
import FlowFormByMaterialManagementContract from './form';
import IsForm from './isForm'
import PersonInfo from '../comp/PersonInfo'
import Apih5 from "qnn-apih5"

const fourItemLayout = {
    labelCol: {
        sm: { span: 8 }
    },
    wrapperCol: {
        sm: { span: 16 }
    }
}
const config = {
    antd: {
        rowKey: 'extensionHistoryId',
        size: 'small'
    },
    drawerConfig: {
        width: '1200px'
    },
    paginationConfig: {
        position: 'bottom'
    },
    formItemLayout: {
        labelCol: {
            xs: { span: 3 },
            sm: { span: 3 }
        },
        wrapperCol: {
            xs: { span: 21 },
            sm: { span: 21 }
        }
    }
};
class index extends Apih5 {
    constructor(props) {
        super(props);
        this.state = {
            modalShowStatus: false,
            projectId: ''
        }
    }
    saveDataFunc = async (apiName, requestData, callBack) => {
        const filterData = {}
        Object.keys(requestData).forEach(ele => {
            // latestAttachmentList 近照不进行转字符串处理
            if (Array.isArray(requestData[ele]) && ele !== 'latestAttachmentList') {
                filterData[ele] = requestData[ele].toString()
            } else {
                filterData[ele] = requestData[ele]
            }
        })
        callBack(await this.props.myFetch(apiName, { ...filterData }))
    }

    getPostSalaryFunc = async (id, callBack) => {
        callBack(await this.props.myFetch('getPositionLevelSalaryDetails', { levelSalaryId: id }))
    }

    setPostionAfterNameFunc = async (refName, formName, targetName) => {
        const formData = await this[refName].getDeawerValues()
        const resData = await this.props.myFetch('getBaseCodeTree', { itemId: 'gangWeiGuanLi' })
        if (resData.success) {
            let arrList = []
            let TemporaryData = resData.data
            const fArr = formData[formName].split(',')

            const outerLoopFunc = (aouterData, targetData, i) => {
                targetData.map(item => {
                    if (aouterData === item.itemId) {
                        arrList[i] = item.itemName
                        TemporaryData = item.children
                    }
                    return true
                })
            }

            for (let i = 0; i < fArr.length; i++) {
                outerLoopFunc(fArr[i], TemporaryData, i)
            }

            this.table.setDeawerValues({
                [targetName]: arrList.join('/')
            })
        }
    }

    render() {
        const { companyId, companyName, projectId, projectName, departmentName, departmentId } = this.apih5.getUserInfo('curCompany')
        const { realName } = this.apih5.getUserInfo()
        const orgId = this.apih5.getOrgId()

        return (
            <div>
                <QnnTable
                    {...this.props}
                    fetch={this.props.myFetch}
                    upload={this.props.myUpload}
                    headers={{ token: this.props.loginAndLogoutInfo.loginInfo.token }}
                    wrappedComponentRef={(me) => {
                        this.table = me;
                    }}
                    {...config}
                    fetchConfig={{
                        apiName: 'getZjXmSalaryUserExtensionHistoryList',
                        otherParams: {
                            orgId: orgId,
                            approvalFlag: "report"
                        }
                    }}
                    actionBtns={[
                        {
                            name: 'addDiy',//内置add del
                            icon: 'plus',//icon
                            type: 'primary',//类型  默认 primary  [primary dashed danger]
                            label: '新增',
                            onClick: (obj) => {
                                if (projectId) {
                                    obj.qnnTableInstance.btnAction({
                                        btnConfig: {
                                            name: "add",
                                            drawerTitle: "",
                                            formBtns: [
                                                {
                                                    name: 'cancel', //关闭右边抽屉
                                                    type: 'dashed',//类型  默认 primary
                                                    label: '取消',
                                                },
                                                {
                                                    name: 'diySubmit',//内置add del
                                                    type: 'primary',//类型  默认 primary
                                                    label: '保存',//提交数据并且关闭右边抽屉 
                                                    onClick: async (obj) => {
                                                        this.saveDataFunc('addZjXmSalaryUserExtensionHistory', {
                                                            ...obj._formData,
                                                            companyId: companyId || null,
                                                            companyName: companyName || null,
                                                            projectId: projectId || null,
                                                            projectName: projectName || null,
                                                            departmentName: departmentName || null,
                                                            departmentId: departmentId || null,
                                                            orgId: orgId,
                                                            approvalFlag: 'report'
                                                        }, ({ data, success, message }) => {
                                                            if (success) {
                                                                Msg.success('保存成功!')
                                                                this.setState({
                                                                    primaryKey: data.zjXmSalaryEmployApprovalId
                                                                })
                                                                obj.qnnTableInstance.closeDrawer()
                                                            } else {
                                                                Msg.error(message)
                                                            }
                                                        })
                                                    },
                                                    // hide: (obj) => {
                                                    //     let index = obj.btnCallbackFn.getActiveKey();
                                                    //     if (index === "1") {
                                                    //         return true;
                                                    //     } else {
                                                    //         return false;
                                                    //     }
                                                    // },
                                                }
                                            ]
                                        },
                                        attrBindInfo: {
                                            rowData: {
                                                ...obj.rowData
                                            }
                                        }
                                    })
                                } else {
                                    Msg.warning('请将右上角的当前项目切换为项目类型!')
                                }
                            },

                        },
                        // {
                        //     name: 'edit',//内置add del
                        //     icon: 'edit',//icon
                        //     type: 'primary',//类型  默认 primary  [primary dashed danger]
                        //     label: '修改',
                        //     formBtns: [
                        //         {
                        //             name: 'cancel', //关闭右边抽屉
                        //             type: 'dashed',//类型  默认 primary
                        //             label: '取消',
                        //         },
                        //         {
                        //             name: 'submit',//内置add del
                        //             type: 'primary',//类型  默认 primary
                        //             label: '保存',//提交数据并且关闭右边抽屉 
                        //             fetchConfig: {//ajax配置
                        //                 apiName: 'updateZjXmSalaryEmployApproval',
                        //                 otherParams: {
                        //                     approvalFlag: "salary"
                        //                 }
                        //             },
                        //             onClick: (obj) => {
                        //                 obj.btnCallbackFn.clearSelectedRows();
                        //             }
                        //         }
                        //     ]
                        // },
                        {
                            name: 'Component',
                            type: 'primary',
                            label: '发起评审',
                            drawerTitle: '发起评审',
                            disabled: (obj) => {
                                let data = obj.btnCallbackFn.getSelectedRows();
                                if (data.length === 1 && !data[0].workId) {
                                    return false;
                                } else {
                                    return true;
                                }
                            },
                            Component: (props) => {
                                let flowData = props?.btnCallbackFn?.getSelectedRows?.()?.[0];
                                return < IsForm  {...this.props} type={'salary'} btnCallbackFn={props.qnnTableInstance} isInQnnTable={true} flowData={{ ...flowData }} />
                            }
                        },
                        {
                            name: 'del',//内置add del
                            icon: 'delete',//icon
                            type: 'danger',//类型  默认 primary  [primary dashed danger]
                            label: '删除',
                            fetchConfig: {//ajax配置
                                apiName: 'batchDeleteZjXmSalaryUserExtensionHistory',
                            }
                        }
                    ]}
                    rowSelection={{
                        type: 'check',
                        getCheckboxProps: record => ({
                            // name:record.name,
                            disabled: record.apih5FlowStatus === '1' || record.apih5FlowStatus === '2',
                        }),
                    }}
                    drawerShowToggle={(args) => {
                        if (!args.drawerIsShow) {
                            this.table.refresh()
                        }
                    }}
                    formConfig={[
                        {
                            isInTable: false,
                            form: {
                                field: 'zjXmSalaryEmployApprovalId',
                                type: 'string',
                                hide: true,
                            }
                        },
                        {
                            table: {
                                title: '标题',
                                dataIndex: 'titleName',
                                key: 'titleName',
                                filter: true,
                                width: 200,
                                onClick: (obj, rowData) => {
                                    this.setState({
                                        primaryKey: obj.rowData.zjXmSalaryEmployApprovalId
                                    }, () => {
                                        obj.btnCallbackFn.btnAction({
                                            btnConfig: {
                                                name: "detail",
                                                drawerTitle: ""
                                            },
                                            attrBindInfo: {
                                                rowData: {
                                                    ...obj.rowData
                                                }
                                            }
                                        })
                                    })
                                }
                            },
                            isInForm: false
                        },
                        {
                            table: {
                                title: '申报时间',
                                dataIndex: 'declareTime',
                                key: 'declareTime',
                                width: 100,
                                format: 'YYYY-MM-DD'
                            },
                            isInForm: false
                        },
                        {
                            table: {
                                title: '报审单位',
                                dataIndex: 'orgName',
                                key: 'orgName',
                                width: 100
                            },
                            isInForm: false
                        },

                        {
                            table: {
                                title: '当前审批位置',
                                dataIndex: 'approvalLocation',
                                key: 'approvalLocation',
                                width: 120
                            },
                            isInForm: false
                        },
                        {
                            table: {
                                title: '审批状态',
                                dataIndex: 'apih5FlowStatus',
                                key: 'apih5FlowStatus',
                                width: 100,
                                type: 'select'
                            },
                            form: {
                                field: "apih5FlowStatus",
                                type: "select",
                                placeholder: "请选择...",
                                fetchConfig: {
                                    apiName: "getBaseCodeSelect",
                                    otherParams: {
                                        itemId: 'liuChengZhuangTai'
                                    }
                                },
                                optionConfig: {
                                    label: 'itemName',
                                    value: 'itemId',
                                },
                            }
                        },
                        {
                            table: {
                                title: '审批时间',
                                dataIndex: 'approvalTime',
                                key: 'approvalTime',
                                width: 100,
                                format: 'YYYY-MM-DD'
                            },
                            isInForm: false
                        },
                        {
                            isInForm: false,
                            table: {
                                showType: "tile", //出来的样式 bubble（气泡）  tile（平铺） 默认bubble  （0.6.15版本中将该属性移动到table属性下，也可写到table同级）
                                width: 110,
                                title: "操作",
                                key: "action", //操作列名称
                                fixed: "right", //固定到右边
                                align: "center",
                                btns: [
                                    {
                                        name: "editDiy", // 内置name有【add,  del, edit, detail, Component, form】
                                        label: "修改",
                                        onClick: (obj) => {
                                            this.setState({
                                                primaryKey: obj.rowData.zjXmSalaryEmployApprovalId
                                            }, () => {
                                                obj.btnCallbackFn.btnAction({
                                                    btnConfig: {
                                                        name: "edit",
                                                        drawerTitle: "",
                                                        formBtns: [
                                                            {
                                                                name: 'cancel', //关闭右边抽屉
                                                                type: 'dashed',//类型  默认 primary
                                                                label: '取消',
                                                            },
                                                            {
                                                                name: 'submit',//内置add del
                                                                type: 'primary',//类型  默认 primary
                                                                label: '保存',//提交数据并且关闭右边抽屉 
                                                                fetchConfig: {//ajax配置
                                                                    apiName: 'updateZjXmSalaryUserExtensionHistory',
                                                                    otherParams: (obj) => {
                                                                        return {
                                                                            approvalFlag: "report",
                                                                            zjXmSalaryEmployApprovalId: this.state.primaryKey
                                                                        }
                                                                    }
                                                                },
                                                                //如果tab面是第一个显示,否则不显示
                                                                hide: (obj) => {
                                                                    let index = obj.btnCallbackFn.getActiveKey();
                                                                    if (index === "1") {
                                                                        return true;
                                                                    } else {
                                                                        return false;
                                                                    }
                                                                },
                                                            }
                                                        ]
                                                    },
                                                    attrBindInfo: {
                                                        rowData: {
                                                            ...obj.rowData
                                                        }
                                                    }
                                                })
                                            })
                                        },
                                        disabled: (args) => {
                                            return args.rowData.apih5FlowStatus === '1' || args.rowData.apih5FlowStatus === '2'
                                        },

                                    },
                                ]
                            }
                        },
                    ]}
                    tabs={[
                        {
                            field: "基础信息",
                            name: "qnnForm",
                            title: "基础信息",
                            content: {
                                wrappedComponentRef: (me) => { this.form1 = me },

                                fetchConfig: {
                                    apiName: 'getWorkZjXmSalaryUserExtensionHistoryDetail',//可为function 返回必须为string
                                    params: {
                                        extensionHistoryId: "extensionHistoryId"
                                    },
                                    otherParams: {},
                                },
                                formConfig: [
                                    {
                                        type: 'string',
                                        label: 'extensionId',
                                        field: 'extensionId',
                                        hide: true
                                    },
                                    {
                                        field: 'extensionHistoryId',
                                        type: 'string',
                                        hide: true,
                                    },
                                    {
                                        label: '姓名',
                                        field: 'realName',
                                        required: true,
                                        // disabled: true,
                                        span: 12,
                                        type: 'selectByQnnTable',
                                        optionConfig: {
                                            label: 'realName',
                                            value: 'realName',
                                            searchKey: "realName"
                                        },
                                        allowClear: false,
                                        onChange: async (val, obj) => {
                                            let newData = null

                                            const { data, success, message } = await this.props.myFetch('getWorkManagementUserExtensionDetails', { extensionId: obj.itemData.extensionId })

                                            if (success) {
                                                newData = {
                                                    ...data,
                                                    // positionSalary: data.levelSalaryId ? data.levelSalaryId.split(',')[data.levelSalaryId.split(',').length - 1] : '',
                                                    extensionId: obj.itemData.extensionId,
                                                    professionalTitle: data.title
                                                }

                                                this.table.setDeawerValues(newData)
                                            } else {
                                                Msg.error(message)
                                                this.table.setDeawerValues({ realName: '' })
                                                return
                                            }
                                        },
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
                                                        orgId
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
                                                        required: true,
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
                                            ],
                                        },
                                    },
                                    {
                                        type: "images",
                                        desc: "上传近照",
                                        label: " ",
                                        colon: false,
                                        field: "latestAttachmentList", //唯一的字段名 ***必传
                                        fetchConfig: {
                                            apiName: "upload"
                                        },
                                        max: 1,
                                        className: "Upload-photo",
                                        // required: true,
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                    },
                                    {
                                        type: 'date',
                                        label: '出生年月',
                                        field: 'birthday',
                                        // required: true,
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                        disabled: true
                                    },
                                    {
                                        field: "userType", //表格里面的字段 
                                        label: "聘用类型",
                                        // required: true,
                                        type: "select",
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
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                        disabled: true
                                    },
                                    {
                                        field: "title", //表格的唯一key
                                        label: "职称",
                                        type: "select",
                                        disabled: true,
                                        fetchConfig: {
                                            apiName: "getBaseCodeSelect",
                                            otherParams: {
                                                itemId: 'zhiChengMingCheng'
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
                                        type: "select",
                                        label: '所学专业',
                                        field: 'major',
                                        // required: true,
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                        disabled: true,
                                        fetchConfig: {
                                            apiName: "getBaseCodeSelect",
                                            otherParams: {
                                                itemId: 'zhuanye'
                                            }
                                        },
                                        optionConfig: {//下拉选项配置
                                            label: 'itemName', //默认 label
                                            value: 'itemId',// 
                                        },

                                    },
                                    {
                                        type: 'date',
                                        label: '毕业时间',
                                        field: 'graduateDate',
                                        // required: true,
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                        disabled: true
                                    },
                                    {
                                        type: 'string',
                                        label: '毕业学校',
                                        field: 'graduateSchool',
                                        // required: true,
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                        disabled: true
                                    },
                                    {
                                        type: "string",
                                        label: '所属单位/项目',
                                        field: 'orgName',
                                        // required: true,
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                        disabled: true,
                                    },
                                    {
                                        // projectId
                                        type: "string",
                                        field: 'orgId',
                                        hide: true
                                    },
                                    {
                                        field: "position", //表格的唯一key
                                        label: "已审批岗位",
                                        type: "cascader",
                                        // required: true,
                                        fetchConfig: {
                                            apiName: "getBaseCodeTree",
                                            otherParams: {
                                                itemId: 'gangWeiGuanLi'
                                            }
                                        },
                                        disabled: true,
                                        optionConfig: {//下拉选项配置
                                            label: 'itemName', //默认 label
                                            value: 'itemId',//
                                            children: 'children'
                                        },
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                    },
                                    {
                                        type: 'cascader',
                                        label: '已审批岗位等级',
                                        field: 'levelSalaryId',
                                        // required: true,
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                        disabled: true,
                                        fetchConfig: {
                                            apiName: "getZjXmSalaryPositionLevelSalarySelect",
                                            otherParams: {
                                                itemId: 'gongrenzhongzhong'
                                            }
                                        },
                                        optionConfig: {//下拉选项配置
                                            label: 'label', //默认 label
                                            value: 'value',//
                                            children: 'showData',
                                        },
                                    },
                                    {
                                        type: 'number',
                                        label: '已审批岗薪',
                                        field: 'positionSalary',
                                        // required: true,
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                        disabled: true,
                                    },
                                    // 推荐岗位
                                    {
                                        type: 'cascader',
                                        label: '推荐岗位',
                                        field: 'positionAfter',
                                        required: true,
                                        span: 24,
                                        fetchConfig: {
                                            apiName: "getBaseCodeTree",
                                            otherParams: {
                                                itemId: 'gangWeiGuanLi'
                                            }
                                        },
                                        optionConfig: {//下拉选项配置
                                            label: 'itemName', //默认 label
                                            value: 'itemId',//
                                            children: 'children',
                                        },
                                        formItemLayout: {
                                            labelCol: {
                                                sm: { span: 4 }
                                            },
                                            wrapperCol: {
                                                sm: { span: 20 }
                                            }
                                        },
                                        onChange: () => {
                                            this.setPostionAfterNameFunc('table', 'positionAfter', 'positionAfterName')
                                        },
                                    },
                                    {
                                        field: 'positionAfterName',
                                        hide: true
                                    },
                                    {
                                        field: "levelSalaryRecommendId", //表格里面的字段 
                                        label: "推岗薪等级",
                                        required: true,
                                        type: "cascader",
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                        fetchConfig: {
                                            apiName: "getZjXmSalaryPositionLevelSalarySelect",
                                            otherParams: {
                                                itemId: 'gongrenzhongzhong'
                                            }
                                        },
                                        optionConfig: {//下拉选项配置
                                            label: 'label', //默认 label
                                            value: 'value',//
                                            children: 'showData',
                                            linkageFields: {
                                                "positionSalaryRecommend": "value",
                                                "salaryRecommendId": "value"
                                            }

                                        },
                                        onChange: (val) => {
                                            this.getPostSalaryFunc(val[val.length - 1], ({ data, success, message }) => {
                                                if (success) this.table.setDeawerValues({
                                                    positionSalaryRecommend: data[0].positionSalary
                                                })
                                            })
                                        }
                                    },
                                    {
                                        type: 'number',
                                        label: '推荐岗薪',
                                        field: 'positionSalaryRecommend',
                                        required: true,
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                        disabled: true
                                    },
                                    {
                                        type: 'string',
                                        field: 'salaryRecommendId',
                                        hide: true
                                    },
                                    {
                                        type: 'textarea',
                                        label: '推荐原因',
                                        field: 'levelSalaryRecommendRemarks',
                                        required: true,
                                        span: 24,
                                    },
                                    {
                                        type: 'cascader',
                                        label: '公司核准岗薪等级',
                                        field: 'levelSalaryCompanyApprovalId',
                                        required: true,
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                        fetchConfig: {
                                            apiName: "getZjXmSalaryPositionLevelSalarySelect",
                                            otherParams: {
                                                itemId: 'gongrenzhongzhong'
                                            }
                                        },
                                        optionConfig: {//下拉选项配置
                                            label: 'label', //默认 label
                                            value: 'value',//
                                            children: 'showData',
                                            linkageFields: {
                                                "positionSalaryCompanyApproval": "value",
                                                "salaryCompanyApprovalId": "value"
                                            }
                                        },
                                        onChange: (val) => {
                                            this.getPostSalaryFunc(val[val.length - 1], ({ data, success, message }) => {
                                                if (success) this.table.setDeawerValues({
                                                    positionSalaryCompanyApproval: data[0].positionSalary
                                                })
                                            })
                                        }
                                    },
                                    {
                                        type: 'number',
                                        label: '公司核准岗薪',
                                        field: 'positionSalaryCompanyApproval',
                                        required: true,
                                        span: 12,
                                        formItemLayout: fourItemLayout,
                                        disabled: true
                                    },
                                    {
                                        type: 'string',
                                        field: 'salaryCompanyApprovalId',
                                        hide: true
                                    },
                                ]
                            }
                        }]
                    }

                />
                <PersonInfo
                    propsData={this.props}
                    modalShowStatus={this.state.modalShowStatus}
                    projectId={this.state.projectId}
                    extensionHistoryId={this.state.extensionHistoryId}
                    primaryKey={this.state.primaryKey}
                    type={'report'}
                    closeCb={(val) => {
                        this.setState({
                            modalShowStatus: val
                        }, () => {
                            if (val === 'saveSuccess') {
                                this.buttomTable.refresh()
                            }
                        })

                    }}
                    tabsDataFunc={(data) => {
                        console.log(data)
                    }}
                />
            </div>
        );
    }
}

export default index;