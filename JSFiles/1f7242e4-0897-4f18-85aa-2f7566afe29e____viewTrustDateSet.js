
var m_DateSetModel;

function AddBase(obj) {
    if(m_DateSetModel != null){
        m_DateSetModel.AddBase(obj);
    }
}

function DeleteBase(obj) {
    if (m_DateSetModel != null) {
        m_DateSetModel.deleteBase(obj);
    }
}

function AddR(obj, _type) {
    if (m_DateSetModel != null) {
        m_DateSetModel.AddR(obj, _type);
    }
}

function DeleteR(obj, _type) {
    if (m_DateSetModel != null) {
        m_DateSetModel.DeleteR(obj, _type);
    }
}

function DateSetType() {
    if (m_DateSetModel != null) {
        m_DateSetModel.dateSetType();
    }
}

function AddJsr(_this, _type) {
    if (m_DateSetModel != null) {
        m_DateSetModel.AddJsr(_this, _type);
    }
}

function DeleteJsr(_this, _type) {
    if (m_DateSetModel != null) {
        m_DateSetModel.DeleteJsr(_this, _type);
    }
}

function ShowOrHideJsrRightButton(_type) {
    if (m_DateSetModel != null) {
        m_DateSetModel.ShowOrHideJsrRightButton(_type);
    }
}

function ConditionChanged(_this) {
    if (m_DateSetModel != null) {
        m_DateSetModel.ConditionChanged(_this);
    }
}

function VShowOrHide(_this, _type) {
    if (m_DateSetModel != null) {
        m_DateSetModel.VShowOrHide(_this, _type);
    }
}

function ShowOrHideJsrRightAllSet(_type) {
    if (m_DateSetModel != null) {
        m_DateSetModel.ShowOrHideJsrRightAllSet(_type);
    }    
}


define(function (require) {
    var $ = require('jquery');
    var ui = require('jquery-ui');
    var ko = require('knockout');
    var komapping = require('knockout.mapping');
    ko.mapping = komapping;
    //require('knockout.rendercontrol');
    require('asyncbox');
    var common = require('common');
    var GlobalVariable = require('globalVariable');
    require('calendar');
    require('date_input');

    var viewTrustWizard = require('app/productManage/TrustManagement/TrustWizard/viewTrustWizard');

    require('app/productManage/Scripts/renderControl');
    require('knockout.validation.min');

    var viewTrustItem = require('app/productManage/TrustManagement/TrustWizard/viewTrustItem');
    var trustId = common.getQueryString('tid');
    //String.prototype.startWith = function (str) {
    //    var reg = new RegExp("^" + str);
    //    return reg.test(this);
    //}

    //String.prototype.endWith = function (str) {
    //    var reg = new RegExp(str + "$");
    //    return reg.test(this);
    //}

    //自然日  就叫 NaturalDay吧
    //工作日和交易日   WorkingDay  TradingDay
    //BeginingOfMonth	             月初
    //EndOfMonth                     月末
    //向前 -1  向后 1  不调整 0
    //基准条件 选中值为 1 不选中值为0

    var DateSetModel = (function () {
        var viewModel;
        var PageCode = "TrustExtensionItem";
        var RListRule = { Math: /^R_/ }, RVListRule = { Math: /^R_V_/ }, BListRule = { Math: /^[B]_/ }, BVListRule = { Math: /^[B]_V_/ };
        var calcDateType = { date: 'date', foreach: 'foreach' };
        var vShowOrHideValue = { date: true, foreach: true };
        var PublicHolidays = { DateItems: [], NoWorkDayItems: [] };
        var PublicTradingdays = { DateItems: [], NoWorkDayItems: [] };
        //===初始化相关===

        function viewModelObject() {
            this.BaseInfo = {
                HaveDataList: [
                    //singleColumn("PoolCloseDate", "资产池封包日", "2016-4-25", "date", false),
                ],
                NoHaveDataList: []
            };
            this.ForEachPeriod = {
                HaveDataList: [
                    //baseDateColumn("AssetProviderReportDate", "资产服务机构报告日", "2016-4-25", "PoolCloseDate", "2",true),
                ],
                NoHaveDataList: []
            };
            this.ForEachPeriodCalculateDate = {
                HaveDataList: [
                    //singleColumn("PoolCloseDate", "循环购买计算频率", "2016-4-25", "date", false),
                ],
                NoHaveDataList: [],
                MergeDataList: []
            }
            this.AmortizationPeriod = {
                HaveDataList: [
                    //循环购买，计算日
                    //tableColumn("AssetProviderReportDate", "资产服务机构报告日", "2016-4-25", "PoolCloseDate", "2",true),
                ],
                NoHaveDataList: []
            }
            this.AmortizationPeriodCalculateDate = {
                HaveDataList: [
                    //singleColumn("PoolCloseDate", "循环购买计算频率", "2016-4-25", "date", false),
                ],
                NoHaveDataList: [],
                MergeDataList: []
            }
            this.CompareTargetArry = [];
            this.ForEachCompareTargetArry = [];
            this.CalendarType = [
                { Value: 'WorkingDay', Text: '工作日' }
                , { Value: 'TradingDay', Text: '交易日' }
                , { Value: 'NaturalDay', Text: '自然日' }
            ];
            this.ConditionCalendarType = [
                { Value: 'WorkingDay', Text: '工作日' }
                , { Value: 'TradingDay', Text: '交易日' }
                , { Value: 'NaturalDay', Text: '自然日' }
            ];
            this.ConditionTargetType = [
                { Value: 'BeginingOfMonth', Text: '月初' }
                , { Value: 'EndOfMonth', Text: '月末' }
            ];
            this.GetCompareTargetName = GetCompareTargetName;
        }

        //---start  注册事件等
        function subscribeR() {
            viewModel.ForEachPeriod.HaveDataList.subscribe(function (newArray) {
                CompareTargetUpdate(newArray, viewModel.ForEachCompareTargetArry);
            });
            viewModel.AmortizationPeriod.HaveDataList.subscribe(function (newArray) {
                CompareTargetUpdate(newArray, viewModel.CompareTargetArry);
            });
        }

        function CompareTargetUpdate(newArray, obj) {
            obj.removeAll();
            $.each(newArray, function (i, n) {
                obj.push(n);
            });
        }

        function GetCompareTargetName(ItemCode, type) {
            var list = [];
            if (type == calcDateType.foreach) list = viewModel.ForEachPeriod.HaveDataList();
            else list = viewModel.AmortizationPeriod.HaveDataList();
            var tmpArray = $.grep(list, function (n, i) {
                return n.ItemCode() == ItemCode;
            });
            if (tmpArray.length > 0) {
                return tmpArray[0].ItemAliasValue();
            }
            return ItemCode;
        }

        function getDateSetListByCode(type, keycode, valuecode) {//FundTransferDate
            if (type == 1)
                var sourcearray = viewModel.BaseInfo.HaveDataList();
            else if (type == 2) {
                var sourcearray = viewModel.AmortizationPeriodCalculateDate.HaveDataList();
            }
            else
                return "";

            var tmparray = $.grep(sourcearray, function (n) {
                return n.ItemCode() == keycode;
            });

            valuecode = (valuecode == null || typeof valuecode == "undefined" ? "ItemValue" : valuecode);
            if (tmparray != null && typeof tmparray != "undefined" && tmparray.length > 0)
                return tmparray[0][valuecode]();
            else
                return "";
        }
        //---end 

        function init(api) {
            viewModel = new viewModelObject();
            var data = api.getCategoryData('TrustExtensionItem');
            initViewModel(data);
            viewModel = ko.mapping.fromJS(viewModel);
            var node = document.getElementById('TrustExtensionDiv');
            ko.applyBindings(viewModel, node);
            subscribeR();
            CompareTargetUpdate(viewModel.AmortizationPeriod.HaveDataList(), viewModel.CompareTargetArry);
            CompareTargetUpdate(viewModel.ForEachPeriod.HaveDataList(), viewModel.ForEachCompareTargetArry);
            InitPublicTradingdays();
            dateSetType();
        }

        function initViewModel(data) {
            viewModel.ForEachPeriod.HaveDataList = [];
            viewModel.ForEachPeriod.NoHaveDataList = [];
            var bvlist = {}, blist = {}, rvlist = {}, rlist = {};
            $.each(data, function (i, n) {
                if (RVListRule.Math.test(n.ItemCode) && n.IsCalculated == "True") {//循环期-相对部分
                    SetVDateObjArr(rvlist, n);

                } else if (RListRule.Math.test(n.ItemCode)) {//循环期-基准日部分
                    SetBaseDateObjArr(rlist, n);

                } else if (BVListRule.Math.test(n.ItemCode)) {//摊还期-相对部分
                    SetVDateObjArr(bvlist, n);

                } else if (BListRule.Math.test(n.ItemCode)) {//摊还期-基准日部分
                    SetBaseDateObjArr(blist, n);

                }
                else {//基本信息
                    SetHaveAndNoData(n, viewModel.BaseInfo.HaveDataList,
                        viewModel.BaseInfo.NoHaveDataList);
                }
            });
            SetBaseDateHaveAndNoData(rlist, viewModel.ForEachPeriod.HaveDataList, viewModel.ForEachPeriod.NoHaveDataList);
            SetVDateHaveAndNoData(rvlist, viewModel.ForEachPeriodCalculateDate.HaveDataList, viewModel.ForEachPeriodCalculateDate.NoHaveDataList);
            SetBaseDateHaveAndNoData(blist, viewModel.AmortizationPeriod.HaveDataList, viewModel.AmortizationPeriod.NoHaveDataList);
            SetVDateHaveAndNoData(bvlist, viewModel.AmortizationPeriodCalculateDate.HaveDataList, viewModel.AmortizationPeriodCalculateDate.NoHaveDataList);

            function SetVDateObjArr(list, n) {
                var itemcode, itemtype;
                if (n.IsPrimary == "True") {
                    itemcode = n.ItemCode;
                    itemtype = "main";
                } else {
                    itemcode = n.ItemCode.substring(0, n.ItemCode.lastIndexOf("_"));
                    itemtype = n.ItemCode.substr(n.ItemCode.lastIndexOf("_") + 1);
                }
                var tmp = list[itemcode];
                if (tmp == null || typeof tmp == "undefined") {
                    tmp = tableColumn(itemcode, "", "", "", "", "", true);
                }
                if (itemtype == "main") {
                    tmp.DisplayName = n.ItemAliasValue;
                    tmp.ItemValue = n.ItemValue;
                } else if (itemtype == "CT") {
                    tmp.CompareTarget = n.ItemValue;
                } else if (itemtype == "DC") {
                    tmp.DateCount = n.ItemValue;
                } else if (itemtype == "CD") {
                    tmp.CalendarType = n.ItemValue;
                }
                list[itemcode] = tmp;
            }
            function SetBaseDateObjArr(list, n) {
                var code, type, value, attrFromDB;
                if (n.ItemCode.endWith('_FirstDate') || n.ItemCode.endWith('_Frequency') || n.ItemCode.endWith('_WorkingDateAdjustment') || n.ItemCode.endWith('_Calendar')
                    || n.ItemCode.endWith('_Condition') || n.ItemCode.endWith('_ConditionTarget') || n.ItemCode.endWith('_ConditionDay') || n.ItemCode.endWith('_ConditionCalendar')) {
                    code = n.ItemCode.substring(0, n.ItemCode.lastIndexOf("_"));
                    type = n.ItemCode.substr(n.ItemCode.lastIndexOf("_") + 1);
                    value = (n.ItemCode.endWith('_Condition') ? (n.ItemValue == 'True') : n.ItemValue);
                }
                else {
                    code = n.ItemCode;
                    type = 'ItemAliasValue';
                    value = n.ItemAliasValue;
                    attrFromDB = n;
                }
                if (!list[code]) {
                    list[code] = baseDateColumn(code, '', '', '', '', '', '', '', '', '', '');
                }
                if (attrFromDB && !list[code]['attrFromDB']) list[code]['attrFromDB'] = attrFromDB;

                list[code][type] = value;
            }

            function SetBaseDateHaveAndNoData(list, arr1, arr2) {
                $.each(list, function (i, n) {
                    if (n.FirstDate || n.attrFromDB.IsCompulsory == "True")
                        arr1.push(n);
                    else
                        arr2.push(n);
                })
            }
            function SetVDateHaveAndNoData(list, arr1, arr2) {
                $.each(list, function (i, n) {
                    if (n.DateCount)
                        arr1.push(n);
                    else
                        arr2.push(n);
                })
            }
            function SetHaveAndNoData(n, arr1, arr2) {
                //ItemCode, ItemAliasValue, ItemValue, dataType, showExStr, CanDel
                var CanDel = (n.IsCompulsory.toLocaleLowerCase() == "false");
                var singledata = singleColumn(n.ItemCode, n.ItemAliasValue, n.ItemValue, n.DataType, CanDel, n.IsCompulsory, n.UnitOfMeasure, n.Precise);

                var isShow = (n.IsCompulsory == "True" || n.ItemValue.toString().length > 0);
                if (isShow)
                    arr1.push(singledata);
                else
                    arr2.push(singledata);
            }
        }

        function update() {
            var TEResult = [];

            /**
             *
             * errorCode 1 计息期间为计息日期间 (加入计息日验证)
             * errorCode 2 计息期间为分配日期间 （加入信托分配日验证）
             *
            **/
            var Validation = {
                errorCode: null,
                errorMsg: "",
                isInForeachPeriod: false, // 是否存在循环期
                isForeachPeriodError: true, // 是否抛出循环期错误提示
                isAmortizationPeriodError: true // 是否抛出摊还期错误提示
            };

            if (viewModel.BaseInfo.HaveDataList().length > 0) {
                $.each(viewModel.BaseInfo.HaveDataList(), function (i, n) {
                    if (n.ItemCode() === "PaymentPeriod") {
                        if (n.ItemValue() === "InterestCollectionDate") {
                            Validation.errorCode = 1;
                            Validation.errorMsg = "计息日";
                        } else if (n.ItemValue() === "AllocationDate") {
                            Validation.errorCode = 2;
                            Validation.errorMsg = "信托分配日";
                        }
                    }
                    if (n.ItemCode() === "RevolvingPeriod"
                        && n.ItemValue() !== "") {
                        Validation.isInForeachPeriod = true;
                    }
                    TEResult.push(GetTEResultTemplate(n.ItemCode(), n.ItemValue(), n.DataType(), n.UnitOfMeasure(), n.Precise()));
                });
            }
            if (viewModel.ForEachPeriod.HaveDataList().length > 0) {
                $.each(viewModel.ForEachPeriod.HaveDataList(), function (i, n) {
                    if (Validation.errorCode === 1) {
                        // 如果存在计息日就不抛出
                        if (n.ItemCode() === "R_InterestCollectionDate") {
                            Validation.isForeachPeriodError = false;
                        }
                    } else if (Validation.errorCode === 2) {
                        if (n.ItemCode() === "R_AllocationDate") {
                            Validation.isForeachPeriodError = false;
                        }
                    }
                    getBaseDate(i, n, TEResult);
                });
            }
            if (viewModel.ForEachPeriodCalculateDate.HaveDataList().length > 0) {
                $.each(viewModel.ForEachPeriodCalculateDate.HaveDataList(), function (i, n) {
                    getJsr(i, n, TEResult);
                });
            }
            if (viewModel.AmortizationPeriod.HaveDataList().length > 0) {
                $.each(viewModel.AmortizationPeriod.HaveDataList(), function (i, n) {
                    if (Validation.errorCode === 1) {
                        // 如果存在计息日就不抛出
                        if (n.ItemCode() === "B_InterestCollectionDate") {
                            Validation.isAmortizationPeriodError = false;
                        }
                    } else if (Validation.errorCode === 2) {
                        if (n.ItemCode() === "B_AllocationDate") {
                            Validation.isAmortizationPeriodError = false;
                        }
                    }
                    getBaseDate(i, n, TEResult);
                });
            }
            if (viewModel.AmortizationPeriodCalculateDate.HaveDataList().length > 0) {
                $.each(viewModel.AmortizationPeriodCalculateDate.HaveDataList(), function (i, n) {
                    getJsr(i, n, TEResult);
                });
            }
            if (Validation.errorCode !== null) {
                if (Validation.isForeachPeriodError && Validation.isInForeachPeriod) {
                    alert('循环期内没有添加' + Validation.errorMsg + '！');
                }
                else if (Validation.isAmortizationPeriodError) {
                    alert('摊还期内没有添加' + Validation.errorMsg + '！');
                }
            }
            function getBaseDate(i, n, TEResult) {
                TEResult.push(GetTEResultTemplate(n.ItemCode(), "", "", ""));
                $.each(n, function (code, item) {
                    if (code != 'ItemAliasValue' && code != 'ItemCode' && code != 'ItemValue' && code != 'attrFromDB') {
                        TEResult.push(GetTEResultTemplate(n.ItemCode() + "_" + code, n[code](), "", ""));
                    }
                })
            }
            function getJsr(i, n, TEResult) {
                var ivalue = n.ItemValue();
                //if (ivalue && $.trim(ivalue).length > 0) {
                TEResult.push(GetTEResultTemplate(n.ItemCode(), ivalue, "", ""));
                TEResult.push(GetTEResultTemplate(n.ItemCode() + "_CT", n.CompareTarget(), "", ""));
                TEResult.push(GetTEResultTemplate(n.ItemCode() + "_DC", n.DateCount(), "", ""));
                TEResult.push(GetTEResultTemplate(n.ItemCode() + "_CD", n.CalendarType(), "", ""));
                //}
            }
            return TEResult;
        }

        function GetTEResultTemplate(ItemCode, ItemValue, DataType, UnitOfMeasure, Precise) {
            return viewTrustWizard.api.getTemplate(PageCode, "", "", "", "", "", ItemCode, ItemValue, DataType, UnitOfMeasure, Precise);
        }

        function preview() {

            var TETemplate = '<div class="ItemBox"><h3 class="h3">{0}</h3><div class="ItemInner">{1}</div></div>';
            var TERTemplate = "<div class='Item'><label>{0}</label><span>{1}</span></div>";
            var TERTmp = "";
            if (viewModel.BaseInfo.HaveDataList().length > 0) {
                $.each(viewModel.BaseInfo.HaveDataList(), function (i, n) {
                    TERTmp += TERTemplate.format(n.ItemAliasValue(), n.ItemValue());
                });
            }
            return '';
        }

        //---获取Calendar---
        function GetCalendarDate(params, callback) {
            var GetHolidaysUrl = GlobalVariable.DataProcessServiceUrl + "GetPublicHolidays/TrustManagement/" + params.startdatestr + "/" + params.areaname;
            $.ajax({
                type: "GET",
                url: GetHolidaysUrl,
                dataType: "jsonp",
                crossDomain: true,
                contentType: "application/json;charset=utf-8",
                success: function (response) {
                    if (callback)
                        callback(response);
                },
                error: function (response) {
                    alert("GetCalendarDate error:" + response);
                    if (callback)
                        callback(response);
                }
            });
        }
        //初始化PublicHolidays
        function InitPublicHolidays() {
            var myDate = new Date();
            var startdatestr = (myDate.getFullYear() - 1) + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();//"2016-04-26";
            var areaname = "中国大陆法定非工作日";
            GetCalendarDate({ startdatestr: startdatestr, areaname: areaname }, function (response) {
                console.log('非工作日');
                console.log(response);
                if (response && response.length > 0) {
                    //PublicHolidays.NoWorkDayItems = $.map(response, function (n) {
                    //    return self.GetDate(n.Date).getTime();
                    //});
                }
                else {
                    NoCalendarTypeSet('WorkingDay');
                }

                InitPublicTradingdays(function () {
                    //calculateDateInitSet();
                    //self.PublicHolidaysHasGet = true;
                });
            });
        }
        function InitPublicTradingdays(callback) {
            var self = TrustExtensionNameSpace;

            var myDate = new Date();
            var startdatestr = (myDate.getFullYear() - 1) + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();//"2016-04-26";
            var areaname = "中国大陆法定非交易日";
            GetCalendarDate({ startdatestr: startdatestr, areaname: areaname }, function (response) {
                console.log('非交易日');
                console.log(response);
                if (response && response.length > 0) {
                    //PublicTradingdays.NoWorkDayItems = $.map(response, function (n) {
                    //    return self.GetDate(n.Date).getTime();
                    //});
                } else {
                    NoCalendarTypeSet('TradingDay');
                }

                if (callback)
                    callback();
            });
        }
        function NoCalendarTypeSet(TypeName) {
            RemoveCalendarType(TypeName);
            ChangeToFirstCalendarType(TypeName);

            //batchToReCalculate();
            //batchToReCalculateForEach();
        }
        function RemoveCalendarType(typename) {
            $.each(viewModel.CalendarType(), function (i, n) {
                if (n.Value() == typename) {
                    viewModel.CalendarType.remove(n);
                    return false;
                }
            });
            $.each(viewModel.ConditionCalendarType(), function (i, n) {
                if (n.Value() == typename) {
                    viewModel.ConditionCalendarType.remove(n);
                    return false;
                }
            });
        }
        function ChangeToFirstCalendarType(typename) {
            //相对日期CalendarType
            var defalutTypeName = viewModel.CalendarType()[0].Value();
            Tmp(viewModel.AmortizationPeriodCalculateDate.HaveDataList, 'CalendarType', typename, defalutTypeName);
            Tmp(viewModel.ForEachPeriodCalculateDate.HaveDataList, 'CalendarType', typename, defalutTypeName);

            //基准日Calendar
            var defalutTypeName = viewModel.ConditionCalendarType()[0].Value();
            Tmp(viewModel.AmortizationPeriod.HaveDataList, 'Calendar', typename, defalutTypeName);
            Tmp(viewModel.ForEachPeriod.HaveDataList, 'Calendar', typename, defalutTypeName);

            //基准日ConditionCalendar
            //var defalutTypeName = viewModel.ConditionCalendarType()[0].Value();
            Tmp(viewModel.AmortizationPeriod.HaveDataList, 'ConditionCalendar', typename, defalutTypeName);
            Tmp(viewModel.ForEachPeriod.HaveDataList, 'ConditionCalendar', typename, defalutTypeName);

            function Tmp(koTmp, columnName, typename, defaulttypename) {
                $.each(koTmp(), function (i, n) {
                    if (n[columnName]() == typename) {
                        n[columnName](defaulttypename);
                    }
                })
            }
        }


        //字段列实体
        function baseDateColumn(ItemCode, ItemValue, ItemAliasValue, FirstDate, Frequency, WorkingDateAdjustment, Calendar, Condition, ConditionTarget, ConditionDay, ConditionCalendar) {
            return { ItemCode: ItemCode, ItemValue: ItemValue, ItemAliasValue: ItemAliasValue, FirstDate: FirstDate, Frequency: Frequency, WorkingDateAdjustment: WorkingDateAdjustment, Calendar: Calendar, Condition: Condition, ConditionTarget: ConditionTarget, ConditionDay: ConditionDay, ConditionCalendar: ConditionCalendar };
        }

        function singleColumn(ItemCode, ItemAliasValue, ItemValue, DataType, CanDel, IsCompulsory, UnitOfMeasure, Precise) {
            return { "ItemCode": ItemCode, "ItemAliasValue": ItemAliasValue, "ItemValue": ItemValue, "DataType": DataType, "CanDel": CanDel, "IsCompulsory": IsCompulsory, "UnitOfMeasure": UnitOfMeasure, "Precise": Precise };
        }

        function tableColumn(ItemCode, DisplayName, ItemValue, CompareTarget, DateCount, CalendarType, IsShow) {
            return {
                ItemCode: ItemCode,
                DisplayName: DisplayName,
                ItemValue: ItemValue,
                CompareTarget: CompareTarget,
                DateCount: DateCount,
                CalendarType: CalendarType,
                IsShow: IsShow
            };
        }

        //===页面事件操作相关===

        function addBase(obj) {
            var _obj = $(obj).parent().parent();
            var dvcode = _obj.find(".form-control:eq(0) option:selected");
            var index0 = dvcode.attr('dataIndex');

            if (viewModel.BaseInfo.NoHaveDataList().length > parseInt(index0)) {
                var oNew = viewModel.BaseInfo.NoHaveDataList()[index0];

                viewModel.BaseInfo.NoHaveDataList.remove(oNew);
                viewModel.BaseInfo.HaveDataList.push(oNew);
                dateSetType();

            } else {
                return false;
            }
        }

        function deleteBase(obj) {
            var rowindex = $(obj).attr('dataIndex');
            var item = viewModel.BaseInfo.HaveDataList()[rowindex];
            viewModel.BaseInfo.HaveDataList.remove(item);
            viewModel.BaseInfo.NoHaveDataList.push(item);
        }

        function addR(obj, _type) {
            var _obj = $(obj).parent().parent();
            var dvcode = _obj.find(".form-control:eq(0) option:selected");
            var index = parseInt(dvcode.attr('dataIndex'));
            if (_type == calcDateType.foreach && viewModel.ForEachPeriod.NoHaveDataList().length > index) {
                var oNew = viewModel.ForEachPeriod.NoHaveDataList()[index];
                var oNewCode = oNew.ItemCode().replace('R_', '');
                var periodCalc = viewModel.ForEachPeriodCalculateDate.NoHaveDataList();
                var count = periodCalc.length;

                oNew.Frequency("1"); // 间隔期长为0时会保存失败，所以我给它默认为1

                viewModel.ForEachPeriod.NoHaveDataList.remove(oNew);
                viewModel.ForEachPeriod.HaveDataList.push(oNew);

                for (var i = 0; i < count; i++) {
                    if (periodCalc[i].ItemCode().replace('R_V_', '') === oNewCode) {
                        viewModel.ForEachPeriodCalculateDate.MergeDataList.push(periodCalc[i]);
                        viewModel.ForEachPeriodCalculateDate.NoHaveDataList.remove(periodCalc[i]);
                        dateSetType();
                        return;
                    }
                }

            } else if (_type == calcDateType.date && viewModel.AmortizationPeriod.NoHaveDataList().length > index) {
                var oNew = viewModel.AmortizationPeriod.NoHaveDataList()[index];
                var oNewCode = oNew.ItemCode().replace('B_', '');
                var periodCalc = viewModel.AmortizationPeriodCalculateDate.NoHaveDataList();
                var count = periodCalc.length;

                oNew.Frequency("1"); // 间隔期长为0时会保存失败，所以我给它默认为1

                viewModel.AmortizationPeriod.NoHaveDataList.remove(oNew);
                viewModel.AmortizationPeriod.HaveDataList.push(oNew);

                for (var i = 0; i < count; i++) {
                    if (periodCalc[i].ItemCode().replace('B_V_', '') === oNewCode) {
                        viewModel.AmortizationPeriodCalculateDate.MergeDataList.push(periodCalc[i]);
                        viewModel.AmortizationPeriodCalculateDate.NoHaveDataList.remove(periodCalc[i]);
                        dateSetType();
                        return;
                    }
                }
            }
            else {
                return false;
            }
        }

        function deleteR(obj, _type) {
            var rowindex = parseInt($(obj).attr('dataIndex'));

            if (_type == calcDateType.foreach) {
                var item = viewModel.ForEachPeriod.HaveDataList()[rowindex];
                var itemCode = item.ItemCode().replace('R_', '');
                var periodCalc = viewModel.ForEachPeriodCalculateDate.MergeDataList();
                var count = periodCalc.length;

                viewModel.ForEachPeriod.HaveDataList.remove(item);
                viewModel.ForEachPeriod.NoHaveDataList.push(item);

                for (var i = 0; i < count; i++) {
                    if (periodCalc[i].ItemCode().replace('R_V_', '') === itemCode) {
                        viewModel.ForEachPeriodCalculateDate.NoHaveDataList.push(periodCalc[i]);
                        viewModel.ForEachPeriodCalculateDate.MergeDataList.remove(periodCalc[i]);
                        return;
                    }
                }

            } else if (_type == calcDateType.date) {
                var item = viewModel.AmortizationPeriod.HaveDataList()[rowindex];
                var itemCode = item.ItemCode().replace('B_', '');
                var periodCalc = viewModel.AmortizationPeriodCalculateDate.MergeDataList();
                var count = periodCalc.length;

                viewModel.AmortizationPeriod.HaveDataList.remove(item);
                viewModel.AmortizationPeriod.NoHaveDataList.push(item);

                for (var i = 0; i < count; i++) {
                    if (periodCalc[i].ItemCode().replace('B_V_', '') === itemCode) {
                        viewModel.AmortizationPeriodCalculateDate.NoHaveDataList.push(periodCalc[i]);
                        viewModel.AmortizationPeriodCalculateDate.MergeDataList.remove(periodCalc[i]);
                        return;
                    }
                }
            }
        }

        function dateSetType() {
            $("#TrustExtensionDiv").find('.date-plugins').date_input();
        }

        function addJsr(_this, _type) {
            var jsrList = [];
            if (_type == calcDateType.foreach) {
                jsrList = viewModel.ForEachPeriodCalculateDate;
            }
            else {
                jsrList = viewModel.AmortizationPeriodCalculateDate;
            }

            if (jsrList.NoHaveDataList().length <= 0)
                return;
            var value = [];
            var _obj = $(_this).parent().parent();
            _obj.find('.form-control').each(function () {
                value.push($(this).val());
            });
            if (typeof value[3] == "undefined" || parseInt(value[3]) != value[3]) {
                alert("请输入正确的距离天数");
                return;
            }
            //if (typeof value[1] == "undefined" || DataSetTools.RQcheck(value[1]) == false) {
            //    alert("请填写" + GetCompareTargetName(value[2], _type));
            //    return;
            //}
            var dvcode = _obj.find(".form-control:eq(0) option:selected");
            var index0 = dvcode.attr('dataIndex'); //.index();

            if (_type == calcDateType.foreach) {
                var oNew = viewModel.ForEachPeriodCalculateDate.NoHaveDataList()[index0];
            }
            else {
                var oNew = viewModel.AmortizationPeriodCalculateDate.NoHaveDataList()[index0];
            }

            var newData = oNew;
            newData.DisplayName(value[0]);
            newData.ItemValue(value[1]);
            newData.CompareTarget(value[2]);
            newData.DateCount(value[3]);
            newData.CalendarType(value[4]);

            if (_type == calcDateType.foreach) {
                viewModel.ForEachPeriodCalculateDate.NoHaveDataList.remove(oNew);
                viewModel.ForEachPeriodCalculateDate.HaveDataList.push(newData);
            }
            else {
                viewModel.AmortizationPeriodCalculateDate.NoHaveDataList.remove(oNew);
                viewModel.AmortizationPeriodCalculateDate.HaveDataList.push(newData);
            }

            ShowOrHideJsrRightButton(_type);
            ShowOrHideJsrRightAllSet(_type);
        }

        function deleteJsr(_this, _type) {
            var index = $(_this).attr("dataIndex");

            var datalist = {};
            if (_type == calcDateType.foreach) datalist = viewModel.ForEachPeriodCalculateDate;
            else datalist = viewModel.AmortizationPeriodCalculateDate;

            var oNew = datalist.HaveDataList()[index];
            datalist.HaveDataList.remove(oNew);

            oNew.ItemValue("");
            oNew.CompareTarget("");
            oNew.DateCount("");
            oNew.CalendarType('');
            datalist.NoHaveDataList.push(oNew);

            ShowOrHideJsrRightButton(_type);
            ShowOrHideJsrRightAllSet(_type);
        }

        function ShowOrHideJsrRightButton(_type) {
            if (_type == calcDateType.foreach) {
                if ($("#TrustExtensionDiv").find("#TrustExtensionJSRListHaveDataList").children().length > 0)
                    $("#setautohide").show();
                else
                    $("#setautohide").hide();
            } else {
                var self = TrustExtensionNameSpace;
                if ($("#TrustExtensionDiv").find("#TrustExtensionForEachJSRListHaveDataList").children().length > 0)
                    $("#setautohideforeach").show();
                else
                    $("#setautohideforeach").hide();
            }
        }

        function conditionChanged(_this) {
            var ul = $(_this).parent().parent().parent();
            if (!_this.checked) {
                $.each(ul.find('.form-control[conditiongroup="Condition"]'), function (i, n) {
                    $(n).val('');
                    $(n).removeClass('red-border');
                });
            }
        }

        function vShowOrHide(_this, _type) {
            var b;
            if (_type == calcDateType.foreach) {
                b = vShowOrHideValue.foreach = !vShowOrHideValue.foreach;

            }
            else {
                b = vShowOrHideValue.date = !vShowOrHideValue.date;
            }
            ShowOrHideJsrRightAllSet(_type);

            if (b == true) {
                $(_this).find("i").removeClass("icon-bottom").addClass("icon-top");
                $(_this).find("span").text(" 点击隐藏");
            }
            else if (b == false) {
                $(_this).find("i").removeClass("icon-top").addClass("icon-bottom");
                $(_this).find("span").text(" 点击显示");
            }
        }

        function ShowOrHideJsrRightAllSet(_type) {
            if (_type == calcDateType.foreach) {
                var autohides = $("#TrustExtensionForEachJSRListHaveDataList div[name='autohide']");
                autohides.css("display", vShowOrHideValue.foreach == true ? "block" : "none");
            } else {
                var autohides = $("#TrustExtensionJSRListHaveDataList div[name='autohide']");
                autohides.css("display", vShowOrHideValue.date == true ? "block" : "none");
            }
        }

        //===排序===
        function SortDateFunction() {
            var self = TrustExtensionNameSpace;
            //指定排序顺序，点一下降序
            var sortOrder = true;
            $("#sortDate").click(function () {
                self.sortDate(self, sortOrder, self.calcDateType.date);
                sortOrder = !sortOrder;
                //这里要加这个函数右边显示区域保留当前状态
                self.ShowOrHideJsrRightAllSet();
                if (sortOrder == false) {
                    $("#sortDate i").removeClass("icon-bottom").addClass("icon-top");
                    $("#sortDate span").text(" 升序排序");
                }
                else if (sortOrder == true) {
                    $("#sortDate i").removeClass("icon-top").addClass("icon-bottom");
                    $("#sortDate span").text(" 降序排序");
                }
            });
            var sortOrderForEach = true;
            $("#sortDateforeach").click(function () {
                self.sortDate(self, sortOrderForEach, self.calcDateType.foreach);
                sortOrderForEach = !sortOrderForEach;
                //这里要加这个函数右边显示区域保留当前状态
                self.ShowOrHideJsrRightAllSet_Foreach();
                if (sortOrderForEach == false) {
                    $("#sortDateforeach i").removeClass("icon-bottom").addClass("icon-top");
                    $("#sortDateforeach span").text(" 升序排序");
                }
                else if (sortOrderForEach == true) {
                    $("#sortDateforeach i").removeClass("icon-top").addClass("icon-bottom");
                    $("#sortDateforeach span").text(" 降序排序");
                }
            });
        }
        //默认升序排序
        function initSortDate(type) {
            var self = TrustExtensionNameSpace;
            self.sortDate(self, false, type);
        }
        function sortDate(self, order, type) {
            var temp = new Array();
            var datalist = {};
            if (type == self.calcDateType.foreach) datalist = self.TrustExtensionData.ForEachSetJSRList;
            else datalist = self.TrustExtensionData.JSRList;

            var temptwo = self.SortDateByOrder(temp.concat(datalist.HaveDataList()), order);
            //先全部删除再重新添加的方式重新渲染
            datalist.HaveDataList.removeAll();
            $.each(temptwo, function (i, n) {
                datalist.HaveDataList.push(n);
            })
        }
        function SortDateByOrder(tempArr, sortOrder) {
            var self = TrustExtensionNameSpace;
            var length = tempArr.length;
            //暴力排序,sortOrder=false 降序排序                          
            for (var i = 0; i < length - 1; i++) {
                for (var j = 0; j < length - 1; j++) {
                    if (self.ComPareDate(tempArr[j].ItemValue(), tempArr[j + 1].ItemValue(), sortOrder)) {
                        var test = tempArr[j + 1];
                        tempArr[j + 1] = tempArr[j];
                        tempArr[j] = test;
                    }
                }
            }
            return tempArr;
        }
        //比较两个日期的大小，如果大于返回true
        function ComPareDate(date1, date2, option) {
            var temp1 = this.TansferDateToInt(date1);
            var temp2 = this.TansferDateToInt(date2);
            if (option) {
                return temp1 < temp2;
            }
            else {
                return temp1 > temp2;
            }
        }
        //转换日期，进行比较
        function TansferDateToInt(date) {
            var tempArr = [];
            var temp = "";
            tempArr = date.split("-");
            //console.log(tempArr)
            for (var i = 0; i < tempArr.length; i++) {
                temp += tempArr[i];
            }
            return parseInt(temp);
        }


        var stepActive = {
            init: function () {
                init(this);
            },
            update: function () {
                return update();
            },
            preview: function () {
                var result = preview();
                console.log(PageCode + ".preview:" + result);
                return result;
            },
            validation: function () {
                //验证
                return this.validControls("#TrustExtensionDiv input[data-valid]:enabled:visible");
            },
            render: function () {
                //当前step加载时,调用
                //获取产品页 支持循环结构是否选中 ,ItemCode:IsTopUpAvailable
   
                var b = viewTrustItem.getItemValueByCode("IsTopUpAvailable");
                //var b = TrustItemModule.getItemValueByCode("IsTopUpAvailable");
                var dom = $("#TrustExtensionDiv").find("div.foreachset");
                if (b == true)
                    dom.show();
                else
                    dom.hide();
            }
        }
        return {
            StepActive: stepActive
            , CalcDateType: calcDateType
            , AddR: addR
            , DeleteR: deleteR
            , AddBase: addBase
            , DeleteBase: deleteBase
            , AddJsr: addJsr
            , DeleteJsr: deleteJsr
            , ConditionChanged: conditionChanged
            , VShowOrHide: vShowOrHide
            , GetDateSetListByCode: getDateSetListByCode
            , test: function () {
                console.log(viewModel.AmortizationPeriodCalculateDate.HaveDataList());
                console.log(viewModel.ForEachPeriodCalculateDate.HaveDataList());
                console.log(viewModel.AmortizationPeriod.HaveDataList());
                console.log(viewModel.ForEachPeriod.HaveDataList());
            }
        }
    })();

    var TrustExtensionNameSpace = {
        GetDateSetListByCode: DateSetModel.GetDateSetListByCode
    };

    var DataSetTools = {
        RQcheck: function (RQ) {
            var date = RQ;
            var result = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);

            if (result == null)
                return false;
            var d = new Date(result[1], result[3] - 1, result[4]);
            return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4]);
        }
    }

    var TrustPeriod = (function () {
        var svcUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";

        var dataModel = {
            DataList: []
        };
        var viewModel = {};
        function init() {
            initDatePlugins();
            periodClilck();
            SavePeriodClick();
        }
        function initDatePlugins() {
            $("#TrustPeriodDiv").find('.date-plugins').date_input();
        }
        function SavePeriodClick() {
            $("#SavePeriod").click(function () {
                var trustPeriodType = $("#TrustPeriodDiv select[name='TrustPeriodType']").val();
                dataModel = ko.mapping.toJS(viewModel);
                var items = '<items>';
                $.each(dataModel.DataList, function (i, v) {
                    items += '<item>';
                    items += '<TrustId>' + trustId + '</TrustId>';
                    items += '<TrustPeriodDesc>' + trustId + '(' + stringToDate(v.StartDate).dateFormat("dd/MM/yyyy") + ' - ' + stringToDate(v.EndDate).dateFormat("dd/MM/yyyy") + ')' + '</TrustPeriodDesc>';
                    items += '<TrustPeriodType>' + trustPeriodType + '</TrustPeriodType>';
                    items += '<StartDate>' + v.StartDate + '</StartDate>';
                    items += '<EndDate>' + v.EndDate + '</EndDate>';
                    items += '<IsCurrent>' + v.IsCurrent + '</IsCurrent>';
                    items += '<IsContainsEnd>' + v.IsContainsEnd + '</IsContainsEnd>';
                    items += '<IsManualModified>' + v.IsManualModified + '</IsManualModified>';
                    items += '</item>';
                });
                items += '</items>';

                var executeParam = {
                    SPName: 'usp_UpdateTrustPeriod', SQLParams: [
                        { Name: 'trustId', value: trustId, DBType: 'int' },
                        { Name: 'trustPeriodType', value: trustPeriodType, DBType: 'string' },
                        { Name: 'items', value: items, DBType: 'xml' }
                    ]
                };
                PostRemoteData(executeParam, function (result) {
                    //if (result[0].Result) {alert('保存成功！');} else {alert('数据提交保存时出现错误！');}
                    if (result == true || result == false) {//result = cmd.ExecuteNonQuery() > 0;所以，这里不报错就OK
                        alert('保存成功！');
                    } else {
                        alert('数据提交保存时出现错误！');
                    }
                });
            });
        }

        function ExecuteRemoteDataPost(executeParam) {
            //console.log("ExecuteRemoteData函数触发！");
            //encodeURIComponent()把URL字符串重新编排
            //var executeParams = encodeURIComponent(JSON.stringify(executeParam));
            var executeParams = JSON.stringify(executeParam);
            var sourceData = [];
            $.ajax({
                cache: false,
                type: "POST",
                async: false,
                url: GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: executeParams,
                success: function (response) {
                    if (typeof response === 'string') { sourceData = JSON.parse(response); }
                    else { sourceData = response; }
                },
                //error: function (response) { alert('Error occursed while requiring the remote source data!'); }
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.status);
                    alert(XMLHttpRequest.readyState);
                    alert(textStatus);
                }
            });
            return sourceData;
        }


        //增加onchange事件，在select的值改变时更细下面的div
        function periodClilck() {
            if (trustId == 0)
                $("#period_set").hide();

            $("#TrustPeriodType").change(function () {
                //console.log("onchange函数触发！")
                var listData = GetSourceData();
                dataModel.DataList = listData;
                dataModel.StartDate = ko.observable('');
                dataModel.EndDate = ko.observable('');
                dataModel.IsManualModified = ko.observable(true);
                //console.log(dataModel.DataList[1].StartDate);
                var listNode = document.getElementById('PeriodTarget');
                for (var i = 0; i < dataModel.DataList.length; i++) {
                    dataModel.DataList[i].StartDate = dataModel.DataList[i].StartDate.length > 0 ? getStringDate(dataModel.DataList[i].StartDate).dateFormat('yyyy-MM-dd') : '';
                    dataModel.DataList[i].EndDate = dataModel.DataList[i].EndDate.length > 0 ? getStringDate(dataModel.DataList[i].EndDate).dateFormat('yyyy-MM-dd') : '';
                }

                //ko.unapplyBindings($(listNode), false);
                //$("#PeriodTarget").empty();
                $("#PeriodTargetPP").html($("#PeriodTemplate").html());
                viewModel = ko.mapping.fromJS(dataModel);
                ko.cleanNode(listNode);
                viewModel.AddPeriods = function () {
                    var StartDate = viewModel.StartDate(), EndDate = viewModel.EndDate();

                    if (StartDate != '' && EndDate != '') {
                        var newArr = {
                            EndDate: viewModel.EndDate(),
                            IsContainsEnd: 0,
                            IsCurrent: false,
                            IsManualModified: viewModel.IsManualModified(),
                            StartDate: viewModel.StartDate(),
                            TrustPeriodDesc: "",
                            TrustPeriodType: $("#TrustPeriodType").val()
                        };
                        viewModel.DataList.unshift(newArr);
                        viewModel.DataList.sort(function (a, b) {
                            var a = (typeof a.StartDate === 'string') ? a.StartDate.replace(/-/g, "") : a.StartDate().replace(/-/g, "");
                            var b = (typeof b.StartDate === 'string') ? b.StartDate.replace(/-/g, "") : b.StartDate().replace(/-/g, "");
                            return parseInt(a) - parseInt(b);
                        })
                        viewModel.EndDate('');
                        viewModel.StartDate('');
                    }
                }
                ko.applyBindings(viewModel, listNode);
                initDatePlugins();
            });

            $("#period_set").click(function () {
                if (!viewModel.DataList) {
                    //console.log("第一次初始化！");
                    var listData = GetSourceData();
                    dataModel.DataList = listData;
                    dataModel.StartDate = ko.observable('');
                    dataModel.EndDate = ko.observable('');
                    dataModel.IsManualModified = ko.observable(true);

                    var listNode = document.getElementById('PeriodTarget');
                    for (var i = 0; i < dataModel.DataList.length; i++) {
                        dataModel.DataList[i].StartDate = dataModel.DataList[i].StartDate.length > 0 ? getStringDate(dataModel.DataList[i].StartDate).dateFormat('yyyy-MM-dd') : '';
                        dataModel.DataList[i].EndDate = dataModel.DataList[i].EndDate.length > 0 ? getStringDate(dataModel.DataList[i].EndDate).dateFormat('yyyy-MM-dd') : '';
                    }

                    //ko.unapplyBindings($(listNode), false);
                    //$("#PeriodTarget").empty();
                    $("#PeriodTargetPP").html($("#PeriodTemplate").html());


                    viewModel = ko.mapping.fromJS(dataModel);
                    viewModel.AddPeriods = function () {
                        var StartDate = viewModel.StartDate(), EndDate = viewModel.EndDate();

                        if (StartDate != '' && EndDate != '') {
                            var newArr = {
                                EndDate: viewModel.EndDate(),
                                IsContainsEnd: 0,
                                IsCurrent: false,
                                IsManualModified: viewModel.IsManualModified(),
                                StartDate: viewModel.StartDate(),
                                TrustPeriodDesc: "",
                                TrustPeriodType: $("#TrustPeriodType").val()
                            };
                            viewModel.DataList.unshift(newArr);
                            viewModel.DataList.sort(function (a, b) {
                                var a = (typeof a.StartDate === 'string') ? a.StartDate.replace(/-/g, "") : a.StartDate().replace(/-/g, "");
                                var b = (typeof b.StartDate === 'string') ? b.StartDate.replace(/-/g, "") : b.StartDate().replace(/-/g, "");
                                return parseInt(a) - parseInt(b);
                            })
                            viewModel.EndDate('');
                            viewModel.StartDate('');
                        }
                    }
                    ko.applyBindings(viewModel, listNode);
                    initDatePlugins();
                }

                $.anyDialog({
                    //dragable:true,
                    modal: true,
                    dialogClass: "TaskProcessDialogClass",
                    closeText: "",
                    //html: $(".interest-adjustments"),
                    html: $("#trustPeriod").show(),
                    height: 500,
                    width: 800,
                    close: function (event, ui) {
                    },
                    title: "调整"
                });
            });
        }
        ko.unapplyBindings = function ($node, remove) {
            // unbind events
            $node.find("*").each(function () {
                $(this).unbind();
            });
            // Remove KO subscriptions and references
            if (remove) {
                ko.removeNode($node[0]);
            } else {
                ko.cleanNode($node[0]);
            }
        };
        function GetSourceData() {
            //console.log("GetSourceData函数触发！");
            var executeParam = {
                SPName: 'usp_GetTrustPeriod',
                SQLParams: [
                    { Name: 'TrustId', value: trustId, DBType: 'int' },
                    { Name: 'TrustPeriodType', value: $("#TrustPeriodDiv select[name='TrustPeriodType']").val(), DBType: 'string' },
                ]
            };
            return ExecuteRemoteData(executeParam);
        }
        function ExecuteRemoteData(executeParam) {
            //console.log("ExecuteRemoteData函数触发！");
            //encodeURIComponent()把URL字符串重新编排
            var executeParams = encodeURIComponent(JSON.stringify(executeParam));
            var sourceData = [];
            //console.log("ExecuteRemoteData init...")
            $.ajax({
                cache: false,
                type: "GET",
                async: false,
                url: svcUrl + 'appDomain=TrustManagement&executeParams=' + executeParams + '&resultType=commom',
                dataType: "json",
                contentType: "application/xml;charset=utf-8",
                data: {},
                success: function (response) {
                    if (typeof response === 'string') { sourceData = JSON.parse(response); }
                    else { sourceData = response; }
                },
                //error: function (response) { alert('Error occursed while requiring the remote source data!'); }
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.status);
                    alert(XMLHttpRequest.readyState);
                    alert(textStatus);
                }
            });
            return sourceData;
        }
        function PostRemoteData(executeParam, callback) {
            //var executeParams = encodeURIComponent(JSON.stringify(executeParam));
            var executeParams = JSON.stringify(executeParam);

            var params = '';
            params += '<root appDomain="TrustManagement" postType="">';// appDomain="TrustManagement"
            params += executeParams;
            params += '</root>';

            var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonPostExecute";

            $.ajax({
                type: "POST",
                url: serviceUrl,
                dataType: "json",
                contentType: "application/xml;charset=utf-8",
                data: params,
                processData: false,
                success: function (response) {
                    if (callback)
                        callback(response);
                },
                error: function (response) { alert("error is :" + response); }
            });
        }

        function removeItem(_this) {
            if (confirm('确认删除该条记录吗？')) {
                var dataIndex = $(_this).attr('dataIndex');
                var item = viewModel.DataList()[dataIndex];
                viewModel.DataList.remove(item);
            }
        }
        return {
            Init: init
            , RemoveItem: removeItem
        }
    })();

    var TrustFactBondPayment = (function () {
        var svcUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";

        var dataModel = {
            DataList: [],
        };
        var viewModel = {};
        function init() {
            initDatePlugins();
            initWhere();
            periodClilck();
            FactBondPayment_GetListClick();
        }
        function initDatePlugins() {
            $("#TrustFactBondPaymentDiv").find('.date-plugins').date_input();
        }
        function initWhere() {
            var list = GetReportingDateId();
            if (list) {
                var html = '';//'<option value="all">所有</option>';
                //sortData(list, 'OptionValue');
                $.each(list, function (i, item) {
                    html += '<option value="' + item.OptionValue + '">' + item.OptionText + '</option>';
                });
                $('#selReportingDateFilter').html(html);
            }
        }

        function GetReportingDateId() {
            var executeParam = {
                SPName: 'usp_GetFactBondPaymentFilterMetaData', SQLParams: [
                    { Name: 'TrustId', value: trustId, DBType: 'string' }
                ]
            };
            return ExecuteRemoteData(executeParam);
        }
        function periodClilck() {
            if (trustId == 0)
                $("#FactBondPayment_show").hide();

            $("#FactBondPayment_show").click(function () {
                if (!viewModel.DataList) {
                    GetListAndBind();
                }

                $.anyDialog({
                    modal: true,
                    dialogClass: "TaskProcessDialogClass",
                    closeText: "",
                    html: $("#TrustFactBondPayment").show(),
                    height: 460,
                    width: 900,
                    close: function (event, ui) {
                    },
                    title: "实际支付信息"
                });
            });
        }
        function FactBondPayment_GetListClick() {
            if (trustId == 0)
                $("#FactBondPayment_GetList").hide();

            $("#FactBondPayment_GetList").click(function () {
                GetListAndBind();
            });
        }
        function GetListAndBind() {
            var listData = GetSourceData();
            dataModel.DataList = listData;

            var listNode = document.getElementById('FactBondPayment_Target');
            //for (var i = 0; i < dataModel.DataList.length; i++) {
            //    dataModel.DataList[i].StartDate = dataModel.DataList[i].StartDate.length > 0 ? getStringDate(dataModel.DataList[i].StartDate).dateFormat('yyyy-MM-dd') : '';
            //    dataModel.DataList[i].EndDate = dataModel.DataList[i].EndDate.length > 0 ? getStringDate(dataModel.DataList[i].EndDate).dateFormat('yyyy-MM-dd') : '';
            //}

            ko.unapplyBindings($(listNode), false);
            //$("#PeriodTarget").empty();
            $("#FactBondPayment_Target").html($("#FactBondPayment_Template").html());


            viewModel = ko.mapping.fromJS(dataModel);
            ko.applyBindings(viewModel, listNode);
            initDatePlugins();
        }
        ko.unapplyBindings = function ($node, remove) {
            // unbind events
            $node.find("*").each(function () {
                $(this).unbind();
            });
            // Remove KO subscriptions and references
            if (remove) {
                ko.removeNode($node[0]);
            } else {
                ko.cleanNode($node[0]);
            }
        };
        function GetSourceData() {
            var executeParam = {
                SPName: 'usp_GetFactBondPayment', SQLParams: [
                    { Name: 'TrustId', value: trustId, DBType: 'string' },
                    { Name: 'ReportingDateId', value: $('#selReportingDateFilter').val(), DBType: 'string' }
                ]
            };
            return ExecuteRemoteData(executeParam);
        }
        function ExecuteRemoteData(executeParam) {
            var executeParams = encodeURIComponent(JSON.stringify(executeParam));
            var sourceData = [];

            $.ajax({
                cache: false,
                type: "GET",
                async: false,
                url: svcUrl + 'appDomain=TrustManagement&executeParams=' + executeParams + '&resultType=commom',
                dataType: "json",
                contentType: "application/xml;charset=utf-8",
                data: {},
                success: function (response) {
                    if (typeof response === 'string') { sourceData = JSON.parse(response); }
                    else { sourceData = response; }
                },
                error: function (response) { alert('Error occursed while requiring the remote source data!'); }
            });
            return sourceData;
        }
        return {
            Init: init
        }
    })();

    //viewTrustWizard.registerMethods(DateSetModel.StepActive);

    $(function () {
        TrustPeriod.Init();
        TrustFactBondPayment.Init();
    });

    m_DateSetModel = DateSetModel;
    return DateSetModel;

});