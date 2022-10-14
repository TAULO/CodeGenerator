String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}

String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
}

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
            NoHaveDataList: []
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
            NoHaveDataList: []
        }
        this.CompareTargetArry = [];
        this.ForEachCompareTargetArry = [];
        this.CalendarType = [
            { Value: 'WorkingDay', Text: '工作日' }
            , { Value: 'TradingDay', Text: '交易日' }
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
            var code, type, value;
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
            }
            if (!list[code]) {
                list[code] = baseDateColumn(code, '', '', '', '', '', '', '', '', '', '');
            }

            list[code][type] = value;
        }

        function SetBaseDateHaveAndNoData(list, arr1, arr2) {
            $.each(list, function (i, n) {
                if (n.FirstDate)
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

        if (viewModel.BaseInfo.HaveDataList().length > 0) {
            $.each(viewModel.BaseInfo.HaveDataList(), function (i, n) {
                TEResult.push(GetTEResultTemplate(n.ItemCode(), n.ItemValue(), n.DataType(), n.UnitOfMeasure(), n.Precise()));
            });
        }
        if (viewModel.ForEachPeriod.HaveDataList().length > 0) {
            $.each(viewModel.ForEachPeriod.HaveDataList(), function (i, n) {
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
                getBaseDate(i, n, TEResult);
            });
        }
        if (viewModel.AmortizationPeriodCalculateDate.HaveDataList().length > 0) {
            $.each(viewModel.AmortizationPeriodCalculateDate.HaveDataList(), function (i, n) {
                getJsr(i, n, TEResult);
            });
        }
        function getBaseDate(i, n, TEResult) {
            TEResult.push(GetTEResultTemplate(n.ItemCode(), "", "", ""));
            $.each(n, function (code, item) {
                if (code != 'ItemAliasValue' && code != 'ItemCode' && code != 'ItemValue') {
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
        return TRUST.api.getTemplate(PageCode, "", "", "", "", "", ItemCode, ItemValue, DataType, UnitOfMeasure, Precise);
    }

    function preview() {
        /*
        // 整体布局 {0} 标题 {1} 内容
        var print_tpl = '<div class="ItemBox"><h3 class="h3">{0}</h3><div class="ItemInner">{1}</div></div>';
        // 内容样式 {0} 是key {1} 是value 
        var print_content = '<div class="Item"><label>{0}</label><span></span></div>';
        // 复杂的内容样式 针对多条数据展示
        var print_item = '<div class="ItemContent"><div class="ItemTitle">{0}：{1}</div>{2}</div>';
        // 举栗子
        // <div class="ItemContent">
        //     <div class="ItemTitle">原始权益人：北京市律师所</div>
        //     <div class="Item">
        //         <label>账户名称</label>
        //         <span>JD201502</span>
        //     </div>
        //     <div class="Item">
        //         <label>费率</label>
        //         <span>JD201502</span>
        //     </div>
        // </div>
        */

        var TETemplate = '<div class="ItemBox"><h3 class="h3">{0}</h3><div class="ItemInner">{1}</div></div>';
        var TERTemplate = "<div class='Item'><label>{0}</label><span>{1}</span></div>";
        var TERTmp = "";
        if (viewModel.BaseInfo.HaveDataList().length > 0) {
            $.each(viewModel.BaseInfo.HaveDataList(), function (i, n) {
                TERTmp += TERTemplate.format(n.ItemAliasValue(), n.ItemValue());
            });
        }
        //if (viewModel.ForEachPeriod.HaveDataList().length > 0) {
        //    $.each(viewModel.ForEachPeriod.HaveDataList(), function (i, n) {
        //        TERTmp += TERTemplate.format(n.ItemAliasValue(), n.ItemValue());
        //    });
        //}
        //if (viewModel.ForEachPeriodCalculateDate.HaveDataList().length > 0) {
        //    $.each(viewModel.ForEachPeriodCalculateDate.HaveDataList(), function (i, n) {
        //        if (n.ItemValue) {
        //            TERTmp += TERTemplate.format(n.DisplayName(), n.ItemValue());
        //        }
        //    });
        //}
        return TETemplate.format("日期设置", TERTmp);
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
        var defalutTypeName = viewModel.CalendarType()[0].Value();
        Tmp(viewModel.AmortizationPeriod.HaveDataList, 'Calendar', typename, defalutTypeName);
        Tmp(viewModel.ForEachPeriod.HaveDataList, 'Calendar', typename, defalutTypeName);

        //基准日ConditionCalendar
        var defalutTypeName = viewModel.ConditionCalendarType()[0].Value();
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
        var index0 = dvcode.attr('dataIndex');
        if (_type == calcDateType.foreach && viewModel.ForEachPeriod.NoHaveDataList().length > parseInt(index0)) {
            var oNew = viewModel.ForEachPeriod.NoHaveDataList()[index0];

            viewModel.ForEachPeriod.NoHaveDataList.remove(oNew);
            viewModel.ForEachPeriod.HaveDataList.push(oNew);
        } else if (_type == calcDateType.date && viewModel.AmortizationPeriod.NoHaveDataList().length > parseInt(index0)) {
            var oNew = viewModel.AmortizationPeriod.NoHaveDataList()[index0];

            viewModel.AmortizationPeriod.NoHaveDataList.remove(oNew);
            viewModel.AmortizationPeriod.HaveDataList.push(oNew);
        }
        else {
            return false;
        }
        dateSetType();
    }

    function deleteR(obj, _type) {
        var rowindex = $(obj).attr('dataIndex');
        if (_type == calcDateType.foreach) {
            var item = viewModel.ForEachPeriod.HaveDataList()[rowindex];
            viewModel.ForEachPeriod.HaveDataList.remove(item);
            viewModel.ForEachPeriod.NoHaveDataList.push(item);
        } else if (_type == calcDateType.date) {
            var item = viewModel.AmortizationPeriod.HaveDataList()[rowindex];
            viewModel.AmortizationPeriod.HaveDataList.remove(item);
            viewModel.AmortizationPeriod.NoHaveDataList.push(item);
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
            var b = TrustItemModule.getItemValueByCode("IsTopUpAvailable");
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
TRUST.registerMethods(DateSetModel.StepActive);

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