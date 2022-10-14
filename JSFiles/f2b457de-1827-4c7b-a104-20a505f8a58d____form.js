import React, { Component } from "react";
import { Form } from "../../modules/work-flow";
import QnnForm from "../../modules/qnn-form";
import PersonInfo from '../comp/PersonInfo'
import Apih5 from "qnn-apih5"
import { message as Msg } from "antd";
let config = {
    //流程专属配置   
    editDocCdnAddress: window.configs.ntkoAddress,
    workFlowConfig: {
        //后台定的字段
        title: ['titleName'], //标题字段
        apiNameByAdd: "updateZjXmSalaryUserExtensionHistory",
        apiNameByUpdate: "updateZjXmSalaryUserExtensionHistory",
        apiNameByGet: "getWorkZjXmSalaryUserExtensionHistoryDetail",
        flowId: 'hbgbbsApply',
        todo: "TodoList",
        hasTodo: "HasTodoList"
    },
    parameterName: 'orgID',
    isHaveDoc: true,
    docModuleShow: false,
    docFieldLable: "公文正文",
    docFieldName: "applyFileList",
    docFieldIsRequired: false,
    docIsReadOnly: false,
    docFormFormItemLayout: {
        labelCol: {
            xs: { span: 4 },
            sm: { span: 4 }
        },
        wrapperCol: {
            xs: { span: 20 },
            sm: { span: 20 }
        }
    },
    //切换布局
    formLayout: "leftDoc",
    //是否使用描述式表单
    formType: "descriptions",
    descriptionsConfig: {
        "layout": "horizontal",
        "column": 12,
        size: "small"
    },
    // //左侧公文附件字段名字  
    filesFieldName: "fileList",
    filesModuleShow: false,
    //请求左侧待办已办列表的ajax配置
    //@curList 当前处于什么列表 todo(待办)  hasTodo(已办)
    getTodoDataFetchConfig: (curList) => ({
        apiName: curList === "todo" ? "getTodoList" : "getHasTodoList"
    }),
};
const formItemLayout = {
    labelCol: {
        xs: { span: 6 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 }
    }
}

const fourItemLayout = {
    labelCol: {
        sm: { span: 8 }
    },
    wrapperCol: {
        sm: { span: 16 }
    }
}
class index extends Apih5 {
    constructor(props) {
        super(props);
        this.state = {
            visibleBjdh: false,
            workId: '',
            flowData: null
        }
        this.positionData = null
        this.props.myFetch('getBaseCodeTree', { itemId: 'gangWeiGuanLi' }).then(({ data, success, message }) => {
            if (success) {
                this.positionData = data
            }
        })
        this.getDataFunc()
    }

    getDataFunc = async () => {
        let params = {}
        if (this.props.flowData?.extensionHistoryId) {
            params = {
                extensionHistoryId: this.props.flowData?.extensionHistoryId
            }
        } else {
            params = { workId: this.props.rowData.workId }
        }
        const { data, success, message } = await this.props.myFetch('getWorkZjXmSalaryUserExtensionHistoryDetail', { ...params })

        if (success) this.setState({
            flowData: data
        })
    }

    handleCancelBjdh = () => {
        this.setState({ visibleBjdh: false });
    }

    render() {
        const { isInQnnTable, } = this.props;
        const { flowData } = this.state
        const orgId = this.apih5.getOrgId()
        return (
            <div style={{ height: isInQnnTable ? "" : "100vh" }}>
                {
                    flowData ? <Form
                        {...this.props}
                        {...config}
                        upload={this.props.myUpload}
                        wrappedComponentRef={(me) => {
                            this.flowForm = me;
                        }}
                        openFlowDataParms={(formData, props, flowData) => {
                            // this.zjXmSalaryEmployApprovalId = formData.zjXmSalaryEmployApprovalId
                            return formData
                        }}
                        // fieldsCURD={(obj, flowData) => {
                        //     this.setState({
                        //         workId: flowData.workId
                        //     })
                        //     return obj
                        // }}
                        formConfig={
                            [
                                {
                                    field: 'flowId',
                                    type: 'string',
                                    initialValue: 'ZxFsReviewWorkFlow',
                                    hide: true,
                                },
                                {
                                    field: 'isDeduct',
                                    type: 'string',
                                    initialValue: flowData?.isDeduct,
                                    hide: true,
                                },
                                {
                                    field: 'workId',
                                    type: 'string',
                                    initialValue: flowData?.workId,
                                    hide: true,
                                },
                                {
                                    field: 'approvalFlag',
                                    type: 'string',
                                    initialValue:"reserveCadre",
                                    hide: true,
                                },
                                {
                                    field: 'extensionHistoryId',
                                    type: 'string',
                                    initialValue: flowData?.extensionHistoryId,
                                    hide: true,
                                },
                                {
                                    field: 'extensionId',
                                    type: 'string',
                                    initialValue: flowData.extensionId,
                                    hide: true,
                                },
                                {
                                    field: 'positionReserve',
                                    type: 'string',
                                    initialValue: flowData.positionReserve,
                                    hide: true,
                                },
                                {
                                    field: 'positionReserveName',
                                    initialValue: flowData.positionReserveName,
                                    hide: true
                                },
                                {
                                    label: '标题',
                                    field: 'titleName',
                                    type: 'string',
                                    span: 12,
                                    qnnDisabled: true,
                                    formItemLayout: formItemLayout,
                                    initialValue: flowData?.titleName,
                                    placeholder: '请选择'
                                },
                                {
                                    label: '报审单位',
                                    type: 'string',
                                    field: 'applyForUnitName',
                                    span: 12,
                                    qnnDisabled: true,
                                    formItemLayout: formItemLayout,
                                    initialValue: flowData?.applyForUnitName,
                                    placeholder: '请输入'
                                },
                                {
                                    label: '报审单位',
                                    type: 'string',
                                    span: 12,
                                    qnnDisabled: true,
                                    field: 'applyForUnitCode',
                                    initialValue: flowData?.applyForUnitCode,
                                    hide: true
                                },
                                {
                                    label: '报审人',
                                    field: 'applyForUser',
                                    type: 'string',
                                    addDisabled: true,
                                    editDisabled: true,
                                    span: 12,
                                    qnnDisabled: true,
                                    formItemLayout: formItemLayout,
                                    initialValue: flowData?.applyForUser,
                                    placeholder: '请输入'
                                },
                                {
                                    label: "附件",
                                    field: "flowFileList",
                                    type: "files",
                                    initialValue: flowData?.flowFileList,
                                    span: 12,
                                    // qnnDisabled: true,
                                    formItemLayout: formItemLayout,
                                    fetchConfig: {
                                        apiName:"upload"
                                    }
                                },
                                {
                                    type: "component",
                                    field: "component66",
                                    label: '信息查看',
                                    Component: obj => {
                                        return (
                                            <QnnForm
                                                fetch={this.props.myFetch}
                                                data={this.state.flowData}
                                                formConfig={[
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
                                                        disabled: true,
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
                                                                    positionSalary: data.levelSalaryId ? data.levelSalaryId.split(',')[data.levelSalaryId.split(',').length - 1] : '',
                                                                    extensionId: obj.itemData.extensionId,
                                                                    professionalTitle: data.title
                                                                }

                                                                this.table.setDeawerValues(newData)
                                                            } else {
                                                                Msg.error(message)
                                                                this.table.setDeawerValues({ realName: '' })
                                                                // setIsModalVisible(false)
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
                                                        disabled: true,
                                                    },
                                                    {
                                                        label: '性别',
                                                        field: 'gender',
                                                        type: 'select',
                                                        optionConfig: {
                                                            label: 'label',
                                                            value: 'value'
                                                        },
                                                        span: 12,
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
                                                        formItemLayout: fourItemLayout,
                                                        placeholder: '请选择',
                                                        disabled: true
                                                    },
                                                    {
                                                        type: 'date',
                                                        label: '出生年月',
                                                        field: 'birthday',
                                                        required: true,
                                                        span: 12,
                                                        formItemLayout: fourItemLayout,
                                                        disabled: true
                                                    },
                                                    {
                                                        label: '籍贯', //表头标题
                                                        field: 'nativePlace', //表格里面的字段
                                                        required: true,
                                                        type: 'cascader',
                                                        optionConfig: {//下拉选项配置
                                                            label: 'itemName', //默认 label
                                                            value: 'itemId',//
                                                            children: 'children'
                                                        },
                                                        fetchConfig: {//配置后将会去请求下拉选项数据
                                                            apiName: 'getBaseCodeTree',
                                                            otherParams: {
                                                                itemId: 'xingzhengquhuadaima'
                                                            }
                                                        },
                                                        span: 12,
                                                        formItemLayout: fourItemLayout,
                                                        disabled: true
                                                    },
                                                    {
                                                        field: "politicCountenance", //表格的唯一key
                                                        label: "政治面貌",
                                                        type: "select",
                                                        placeholder: "请输入",
                                                        required: true,
                                                        fetchConfig: {
                                                            apiName: "getBaseCodeSelect",
                                                            otherParams: {
                                                                itemId: 'zhengzhimianmao'
                                                            }
                                                        },
                                                        optionConfig: {//下拉选项配置
                                                            label: 'itemName', //默认 label
                                                            value: 'itemId',//
                                                            children: 'children'
                                                        },
                                                        initialValue: "13",
                                                        span: 12,
                                                        disabled: true,
                                                        formItemLayout: fourItemLayout,
                                                    },
                                                    {
                                                        type: 'select',
                                                        label: '学历',
                                                        field: 'education',
                                                        required: true,
                                                        span: 12,
                                                        formItemLayout: fourItemLayout,
                                                        fetchConfig: {
                                                            apiName: "getBaseCodeSelect",
                                                            otherParams: {
                                                                itemId: 'xueli'
                                                            }
                                                        },
                                                        optionConfig: {//下拉选项配置
                                                            label: 'itemName', //默认 label
                                                            value: 'itemId',// 
                                                        },
                                                        disabled: true
                                                    },
                                                    {
                                                        type: 'date',
                                                        label: '毕业时间',
                                                        field: 'graduateDate',
                                                        required: true,
                                                        span: 12,
                                                        formItemLayout: fourItemLayout,
                                                        disabled: true
                                                    },
                                                    {
                                                        type: 'string',
                                                        label: '毕业学校',
                                                        field: 'graduateSchool',
                                                        required: true,
                                                        span: 12,
                                                        formItemLayout: fourItemLayout,
                                                        disabled: true
                                                    },
                                                    {
                                                        type: 'select',
                                                        label: '毕业专业',
                                                        field: 'major',
                                                        required: true,
                                                        span: 12,
                                                        formItemLayout: fourItemLayout,
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
                                                        disabled: true
                                                    },
                                                    {
                                                        type: 'select',
                                                        label: '专业技术职务',
                                                        field: 'title',
                                                        required: true,
                                                        span: 12,
                                                        formItemLayout: fourItemLayout,
                                                        fetchConfig: {
                                                            apiName: "getBaseCodeSelect",
                                                            otherParams: {
                                                                itemId: 'zhiChengMingCheng'
                                                            }
                                                        },
                                                        optionConfig: {//下拉选项配置
                                                            label: 'itemName', //默认 label
                                                            value: 'itemId',// 
                                                        },
                                                        disabled: true
                                                    },
                                                    {
                                                        type: 'date',
                                                        label: '参加工作时间',
                                                        field: 'workFirstDate',
                                                        required: true,
                                                        span: 12,
                                                        formItemLayout: fourItemLayout,
                                                        disabled: true
                                                    },
                                                    {
                                                        field: "userType", //表格里面的字段 
                                                        label: "聘用类型",
                                                        required: true,
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
                                                        type: 'cascader',
                                                        label: '后备岗位',
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
                                                        disabled: true,
                                                    },
                                                    {
                                                        type: "string",
                                                        label: '现任职务',
                                                        field: 'orgName',
                                                        required: true,
                                                        span: 8,
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
                                                        type: "string",
                                                        label: '',
                                                        field: 'departmentName',
                                                        required: true,
                                                        span: 8,
                                                        formItemLayout: fourItemLayout,
                                                        disabled: true,
                                                    },
                                                    {
                                                        // projectId
                                                        type: "string",
                                                        field: 'departmentId',
                                                        hide: true
                                                    },
                                                    {
                                                        field: "position", //表格的唯一key
                                                        label: "",
                                                        type: "cascader",
                                                        required: true,
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
                                                        span: 8,
                                                        formItemLayout: fourItemLayout,
                                                    },
                                                ]}
                                            />
                                        );
                                    },
                                    span: 12,
                                },
                                {
                                    type: "textarea",
                                    label: "基层单位推荐",
                                    field: "opinionField1",
                                    opinionField: true,
                                    addShow: false,
                                    span: 12,
                                },
                                {
                                    type: "textarea",
                                    label: "人力资源部经办人",
                                    field: "opinionField2",
                                    opinionField: true,
                                    addShow: false,
                                    span: 12,
                                },
                                {
                                    type: "textarea",
                                    label: "人力资源部经理",
                                    field: "opinionField3",
                                    opinionField: true,
                                    addShow: false,
                                    span: 12,
                                },
                                {
                                    type: "textarea",
                                    label: "主管部门经理",
                                    field: "opinionField4",
                                    opinionField: true,
                                    addShow: false,
                                    span: 12,
                                },
                                {
                                    type: "textarea",
                                    label: "分管领导",
                                    field: "opinionField5",
                                    opinionField: true,
                                    addShow: false,
                                    span: 12,
                                },
                                // {
                                //     type: "textarea",
                                //     label: "人事科管",
                                //     field: "opinionField6",
                                //     opinionField: true,
                                //     addShow: false,
                                //     span: 12,
                                // },
                                // {
                                //     type: "textarea",
                                //     label: "公司分管",
                                //     field: "opinionField7",
                                //     opinionField: true,
                                //     addShow: false,
                                //     span: 12,
                                // },
                                // {
                                //     type: "textarea",
                                //     label: "项目人事",
                                //     field: "opinionField8",
                                //     opinionField: true,
                                //     addShow: false,
                                //     span: 12,
                                // },
                            ]
                        }
                        {...this.props.workFlowConfig}
                        {...config.workFlowConfig}
                        tabs={[]}
                    /> : null
                }

                <PersonInfo
                    propsData={this.props}
                    modalShowStatus={this.state.modalShowStatus}
                    projectId={this.state.projectId}
                    extensionHistoryId={this.state.extensionHistoryId}
                    primaryKey={this.state.primaryKey}
                    type={'salary'}
                    isReview={true}
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
