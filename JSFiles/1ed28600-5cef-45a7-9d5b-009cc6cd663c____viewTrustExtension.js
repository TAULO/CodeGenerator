var TrustExtensionNameSpace = {
    //---------------------页面信息----------------------
    TrustExtensionPage: {
        Code: "TrustExtensionItem"
    },
    abc:false,
    TEShowInfo: [],
    TrustExtensionData: {},
    isFirst: true,
    ShowOrHideJsrRightBool: false,
    //公休定义,WorkDayItems:包含公休补班的周末，也就是全部的实际工作日都在这个集合里
    PublicHolidays: { DateItems: [], WorkDayItems: [] },
    PublicHolidaysHasGet: false,
    InitSetCodeArray: [],
    //real days compareTarget's itemcode
    RealDaysItemCodes: [
        "AnnualTrusteeManagementReportDate",
        "AunualAuditReportDate",
        "AnnualAssetManagementReportDate",
        "RatingTrackReportingDate",
        "OrganisorReportDate"
    ],
    ForEachSetCode: [
        "RevolvingPeriod",
        "RevolvingPurchaseDate",
        "RevolvingPurchaseFrequency",
        "RevolvingPaymentFrequency",
        "R_CollectionDate",
        "R_PaymentDate"
    ],
    //初始化PublicHolidays
    InitPublicHolidays: function () {
        var self = TrustExtensionNameSpace;

        var myDate = new Date();
        var startdatestr = (myDate.getFullYear() - 1) + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();//"2016-04-26";
        console.log(startdatestr);
        var areaname = "中国大陆法定非工作日";
        var GetHolidaysUrl = "https://poolcutwcf/TaskProcessServices/DataProcessService.svc/jsAccessEP/GetPublicHolidays/TrustManagement/" + startdatestr + "/" + areaname;
        $.ajax({
            type: "GET",
            url: GetHolidaysUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                console.log(self.TrustExtensionPage.Code + " get public holidays url:" + GetHolidaysUrl);
                //console.log(response);
                self.PublicHolidays.DateItems = response;
                self.PublicHolidays.WorkDayItems = $.map(response, function (n) {
                    return self.GetDate(n.Date).getTime();
                });
                console.log(self.PublicHolidays.DateItems);
                //self.PublicHolidays.NoWorkDayItems = $.grep(self.PublicHolidays.DateItems, function (n, i) {
                //    var tmpdate = self.GetDate(n);
                //    if (tmpdate.getDay() == 0 || tmpdate.getDay() == 6) {
                //        return false;
                //    } else {
                //        return true;
                //    }
                //});
                //console.log(self.PublicHolidays.WorkDayItems);
                self.calculateDateInitSet();
                self.PublicHolidaysHasGet = true;
            },
            error: function (response) {
                //debugger;
                alert("error:" + response);
            }
        });
    },
    //---------------------获取页面显示信息逻辑----------------------
    //根据获取到的字符串，处理生成页面逻辑所需对象TrustExtensionData


    TEShowInit: function () {
        var self = TrustExtensionNameSpace;
        if (self.TEShowInfo.length > 0) {
            self.TrustExtensionData.DateSetList.HaveDataList = [];
            self.TrustExtensionData.DateSetList.NoHaveDataList = [];
            self.TrustExtensionData.ForEachSet.HaveDataList = [];
            self.TrustExtensionData.ForEachSet.NoHaveDataList = [];
            self.TrustExtensionData.JSRList.HaveDataList = [];
            self.TrustExtensionData.JSRList.NoHaveDataList = [];
            var jsrListTmp = {};
            function SetHaveAndNoData(n, arr1, arr2) {
                //ItemCode, ItemAliasValue, ItemValue, dataType, showExStr, CanDel
                var CanDel = (n.IsCompulsory.toLocaleLowerCase() == "false");
                var singledata = self.singleColumn(n.ItemCode, n.ItemAliasValue, n.ItemValue, n.DataType, CanDel, n.IsCompulsory, n.UnitOfMeasure, n.Precise);

                var isShow = (n.IsCompulsory == "True" || n.ItemValue.toString().length > 0);
                if (isShow)
                    arr1.push(singledata);
                else
                    arr2.push(singledata);
            }
            $.each(self.TEShowInfo, function (i, n) {
                if ($.inArray(n.ItemCode, self.ForEachSetCode) >= 0) {
                    SetHaveAndNoData(n, self.TrustExtensionData.ForEachSet.HaveDataList,
                        self.TrustExtensionData.ForEachSet.NoHaveDataList);
                }
                else if (n.IsCalculated == "False") {
                    SetHaveAndNoData(n, self.TrustExtensionData.DateSetList.HaveDataList,
                        self.TrustExtensionData.DateSetList.NoHaveDataList);
                } else if (n.IsCalculated == "True") {
                    var itemcode, itemtype;
                    if (n.IsPrimary == "True") {
                        itemcode = n.ItemCode;
                        itemtype = "main";
                    } else {
                        itemcode = n.ItemCode.substring(0, n.ItemCode.indexOf("_"));
                        itemtype = n.ItemCode.substr(n.ItemCode.indexOf("_") + 1);
                    }
                    var tmp = eval("jsrListTmp." + itemcode);
                    if (tmp == null || typeof tmp == "undefined") {
                        tmp = self.tableColumn(itemcode, "", "", "", "", true);
                    }
                    if (itemtype == "main") {
                        tmp.DisplayName = n.ItemAliasValue;
                        tmp.ItemValue = n.ItemValue;
                    } else if (itemtype == "CT") {
                        tmp.CompareTarget = n.ItemValue;
                    } else if (itemtype == "DC") {
                        tmp.DateCount = n.ItemValue;
                    }
                    jsrListTmp[itemcode] = tmp;
                }
            });
            //处理计算日
            for (var jsr in jsrListTmp) {
                var jsref = jsrListTmp[jsr];
                //tableColumn = function (ItemCode,DisplayName, ItemValue, CompareTarget, DateCount)
                if (typeof jsref.ItemValue != "undefined" && jsref.ItemValue.length > 0) {
                    self.TrustExtensionData.JSRList.HaveDataList.push(jsref);
                } else {
                    self.TrustExtensionData.JSRList.NoHaveDataList.push(jsref);
                }
            }
        }
    },
    TEShowInitEx: function () {
        var self = TrustExtensionNameSpace;
        var tsrarray = [
            self.tableColumn("ZhongDengMaterialsSubmissionDate", "中登资料提交日", "", "PaymentDate", "6", false),
            self.tableColumn("AnnualTrusteeManagementReminderReportDate", "年度托管报告日提醒日", "", "AnnualTrusteeManagementReportDate", "-30", false),
            self.tableColumn("AunualAuditReminderReportDate", "年度审计报告日提醒日", "", "AunualAuditReportDate", "-30", false),
            self.tableColumn("AnnualAssetManagementReminderReportDate", "年度资产管理报告日提醒日", "", "AnnualAssetManagementReportDate", "-30", false),
            self.tableColumn("RatingTrackReminderReportingDate", "跟踪评级报告日提醒日", "", "RatingTrackReportingDate", "-30", false),
            self.tableColumn("OrganisorReminderReportDate", "计划管理人报告日提醒日", "", "PaymentDate", "-10", false),
            self.tableColumn("InstructedPaymentReminderDate", "分配指令划款日提醒日", "", "PaymentDate", "-4", false)
        ];

        //Array.prototype.push.apply(self.TrustExtensionData.JSRList.HaveDataList, tsrarray);
        var tmp = [], tmpGuDing = [];
        $.each(self.TrustExtensionData.JSRList.HaveDataList, function (i, n) {
            tmp.push(n.ItemCode);
        });
        $.each(tsrarray, function (i, n) {
            tmpGuDing.push(n.ItemCode);

            if ($.inArray(n.ItemCode, tmp) < 0) {
                self.TrustExtensionData.JSRList.HaveDataList.push(n);
                self.InitSetCodeArray.push(n.ItemCode);
            }
        });
        $.each(self.TrustExtensionData.JSRList.HaveDataList, function (i, n) {
            if ($.inArray(n.ItemCode, tmpGuDing) >= 0) {
                n.IsShow = false;
            }
        });
        var tmpNo = [];
        $.each(self.TrustExtensionData.JSRList.NoHaveDataList, function (i, n) {
            if ($.inArray(n.ItemCode, tmpGuDing) < 0) {
                tmpNo.push(n);
            }
        });
        self.TrustExtensionData.JSRList.NoHaveDataList = tmpNo;
    },

    //---------------------页面保存逻辑----------------------
    //根据TrustExtensionData对象，生成最终保存所需结果字符串

    //TESaveInfo，处理TEResult出最终结果ko.mapping.toJSON(TEResult)为最终结果
    TESaveInfo: function () {
        var self = TrustExtensionNameSpace;
        var TEResult = [];

        if (self.TrustExtensionData.DateSetList.HaveDataList().length > 0) {
            $.each(self.TrustExtensionData.DateSetList.HaveDataList(), function (i, n) {
                TEResult.push(self.GetTEResultTemplate(n.ItemCode(), n.ItemValue(), n.DataType(), n.UnitOfMeasure(), n.Precise()));
            });
        }
        if (self.TrustExtensionData.ForEachSet.HaveDataList().length > 0) {
            $.each(self.TrustExtensionData.ForEachSet.HaveDataList(), function (i, n) {
                TEResult.push(self.GetTEResultTemplate(n.ItemCode(), n.ItemValue(), n.DataType(), n.UnitOfMeasure(), n.Precise()));
            });
        }
        if (self.TrustExtensionData.JSRList.HaveDataList().length > 0) {
            $.each(self.TrustExtensionData.JSRList.HaveDataList(), function (i, n) {
                var ivalue = n.ItemValue();
                if (ivalue && $.trim(ivalue).length > 0) {
                    TEResult.push(self.GetTEResultTemplate(n.ItemCode(), ivalue, "", ""));
                    TEResult.push(self.GetTEResultTemplate(n.ItemCode() + "_CT", n.CompareTarget(), "", ""));
                    TEResult.push(self.GetTEResultTemplate(n.ItemCode() + "_DC", n.DateCount(), "", ""));
                }
            });
        }
        return TEResult;
    },
    GetTEResultTemplate: function (ItemCode, ItemValue, DataType, UnitOfMeasure, Precise) {
        var self = TrustExtensionNameSpace;
        //return TRUST.api.template.format(self.TrustExtensionPage.Code, "", "", "", "", "", ItemCode, ItemValue);
        return TRUST.api.getTemplate(self.TrustExtensionPage.Code, "", "", "", "", "", ItemCode, ItemValue, DataType, UnitOfMeasure, Precise);
    },
    GetTEResultTemplateBak: function (ItemCode, ItemValue) {
        var self = TrustExtensionNameSpace;
        return {
            Category: self.TrustExtensionPage.Code,
            SPId: "",
            SPCode: "",
            SPRItemCode: "",
            TBId: "",
            ItemId: "",
            ItemCode: ItemCode,
            ItemValue: ItemValue
        };
    },
    //---------------------页面预览----------------------
    //knockout绑定方式
    TEPreview2: function () {
        var self = TrustExtensionNameSpace;
        var data = self.TrustExtensionData;
        var TETemplate = "<div id='TrustExtensionData' style='display:none'><div id='{0}'>{1}{2}</div></div>";
        var TERTemplate1 = "<div data-bind='foreach:DateSetList.HaveDataList'><label data-bind='html:ItemAliasValue'></label><label data-bind='html:ItemValue'></label></div>";
        var TERTemplate2 = "<div data-bind='foreach:JSRList.HaveDataList'><label data-bind='html:DisplayName'></label><label data-bind='html:ItemValue'></label></div>";
        var Tediv = TETemplate.format(self.TrustExtensionPage.Code, TERTemplate1, TERTemplate2);
        var $html = $(Tediv);
        $("body").append($html);

        ko.applyBindings(data, $("#TrustExtensionData")[0]);
        var result = $("#TrustExtensionData").html();
        $("#TrustExtensionData").remove();
        return result;
    },
    //数组对象拼html方式
    TEPreview: function () {
        var self = TrustExtensionNameSpace;

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
        if (self.TrustExtensionData.DateSetList.HaveDataList().length > 0) {
            $.each(self.TrustExtensionData.DateSetList.HaveDataList(), function (i, n) {
                TERTmp += TERTemplate.format(n.ItemAliasValue(), n.ItemValue());
            });
        }
        if (self.TrustExtensionData.ForEachSet.HaveDataList().length > 0) {
            $.each(self.TrustExtensionData.ForEachSet.HaveDataList(), function (i, n) {
                TERTmp += TERTemplate.format(n.ItemAliasValue(), n.ItemValue());
            });
        }
        if (self.TrustExtensionData.JSRList.HaveDataList().length > 0) {
            $.each(self.TrustExtensionData.JSRList.HaveDataList(), function (i, n) {
                var ivalue = n.ItemValue();
                if (ivalue && $.trim(ivalue).length > 0) {
                    TERTmp += TERTemplate.format(n.DisplayName(), ivalue);
                }
            });
        }
        return TETemplate.format("日期设置", TERTmp);
    },

    //---------------------页面逻辑----------------------
    //TrustExtensionData：页面操作对象
    //单字段对象
    singleColumn: function (ItemCode, ItemAliasValue, ItemValue, DataType, CanDel, IsCompulsory, UnitOfMeasure, Precise) {
        var self = TrustExtensionNameSpace;
        return {
            "ItemCode": ItemCode,
            "ItemAliasValue": ItemAliasValue,
            "ItemValue": ItemValue,
            "DataType": DataType,
            //"showExStr" : showExStr,
            "CanDel": CanDel,
            "IsCompulsory": IsCompulsory,
            "UnitOfMeasure": UnitOfMeasure,
            "Precise": Precise,
            "cls": self.GetCss(DataType)
        };
    },
    //列表字段标题对象
    tableColumnTitle: function (ItemCode, ItemAliasValue, isShow, DataType, showExStr) {
        var self = TrustExtensionNameSpace;
        return {
            "ItemCode": ItemCode,
            "ItemAliasValue": ItemAliasValue,
            "isShow": isShow,
            "DataType": DataType,
            "showExStr": showExStr,
            "cls": self.GetCss(DataType)
        };
    },
    //列表字段对象
    tableColumn: function (ItemCode, DisplayName, ItemValue, CompareTarget, DateCount, IsShow) {
        return {
            ItemCode: ItemCode,
            DisplayName: DisplayName,
            ItemValue: ItemValue,
            CompareTarget: CompareTarget,
            DateCount: DateCount,
            IsShow: IsShow
        };
    },

    GetCss: function (DataType) {
        if (DataType == null || typeof DataType == "undefined")
            return "form-control";
        else {
            DataType = DataType.toLocaleLowerCase();
            if (DataType == "string")
                return "form-control";
            else if (DataType == "date")
                return "form-control date-plugins";
            else
                return "form-control";
        }
    },
    //JSON数据
    TrustExtensionFunc: function () {
        var self = TrustExtensionNameSpace;
        this.DateSetList = {
            HaveDataList: [
                //singleColumn("PoolCloseDate", "资产池封包日", "2016-4-25", "date", false),
            ],
            NoHaveDataList: []
        };
        this.JSRList = {
            HaveDataList: [
                //tableColumn("AssetProviderReportDate", "资产服务机构报告日", "2016-4-25", "PoolCloseDate", "2",true),
            ],
            NoHaveDataList: []
        };
        this.ForEachSet = {
            HaveDataList: [
                //singleColumn("PoolCloseDate", "循环购买计算频率", "2016-4-25", "date", false),
            ],
            NoHaveDataList: []
        }
        this.CompareTargetArry = [];
        this.GetCompareTargetName = function (ItemCode) {
            var tmpArray = $.grep(this.DateSetList.HaveDataList(), function (n, i) {
                return n.ItemCode() == ItemCode;
            });
            if (tmpArray.length > 0) {
                return tmpArray[0].ItemAliasValue();
            }
            return ItemCode;
        };
        this.GetDateSetListByCode = function (type, keycode, valuecode) {//FundTransferDate
            if (type == 1)
                var sourcearray = TrustExtensionNameSpace.TrustExtensionData.DateSetList.HaveDataList();
            else if (type == 2)
                var sourcearray = TrustExtensionNameSpace.TrustExtensionData.JSRList.HaveDataList();
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
        };

    },
    GetDateSetListByCode: function (type, keycode, valuecode) {
        var self = TrustExtensionNameSpace;
        return self.TrustExtensionData.GetDateSetListByCode(type, keycode, valuecode);
    },
    GetTestData: function () {
        //viewTrustExtensionJson.txt;
        var httt = $.ajax({
            async: false,
            url: "viewTrustExtensionJson.txt",
            contentType: "application/json;charset=utf-8"
        });

        return JSON.parse(httt.responseText);
    },
    testUtil: function () {
        var self = TrustExtensionNameSpace;
        var temparray = self.TrustExtensionElement.update();
        $.each(temparray, function (i, n) {
            n.ItemValue = TRUST.ConvertDataByUtil("get", n.DataType, n.ItemValue, n.UnitOfMeasure, n.Precise);
        });

        $("#TemText").val(JSON.stringify(temparray));
    },
    ArraySort: function (array, sortno, sorttype) {
        if (array == null || typeof array == "undefined" || array.length <= 0 || sortno == null || typeof sortno == "undefined")
            return array;
        if (sorttype == null || typeof sorttype == "undefined" || $.trim(sorttype).length == 0)
            sorttype = "asc";

        var myObservableArray = ko.observableArray(array);

        myObservableArray.sort(function (left, right) {
            if (typeof left[sortno] == "undefined" || typeof right[sortno] == "undefined" || parseInt(right[sortno]) != right[sortno] || parseInt(left[sortno]) != left[sortno])
                return 0;
            else {
                var l = parseInt(left[sortno]);
                var r = parseInt(right[sortno])
                return l == r ? 0 : (l > r ? 1 : -1);
            }
        })

        array = myObservableArray();
        return array;
    },
    //日期对象初始化
    TrustExtensionElement: {
        init: function () {
            console.log("TrustExtensionElement init ... ");
            var self = TrustExtensionNameSpace;
            //debugger;
            if (self.isFirst) {
                var node = document.getElementById('TrustExtensionDiv');

                self.addWorkDay();
                self.addShowColumn();
                self.addShowColumnEx();
                self.DateTypeSelect();
                self.addDateCount();

                self.TrustExtensionData = new self.TrustExtensionFunc();
                //try {
                //    var data = self.GetTestData();
                //}
                //catch (ex) {
                //    var data = this.getCategoryData('TrustExtensionItem');
                //}
                //TRUST.SetDataArrayByUtil(data);
                var data = this.getCategoryData('TrustExtensionItem');
                //self.ArraySort(data, "SequenceNo"); //外侧已统一排序，这里暂时注释
                //$("#TemText").val(JSON.stringify(data));
                //console.log(data);
                self.TEShowInfo = data;//获取到的数据
                self.TEShowInit();//调用TEShowInfo给TrustExtensionData赋值
                self.TEShowInitEx();//调用TEShowInfo给TrustExtensionData赋值，固定提醒日
                self.TrustExtensionData = ko.mapping.fromJS(self.TrustExtensionData);
                ko.applyBindings(self.TrustExtensionData, node);

                self.CompareTargetUpdate(self.TrustExtensionData.DateSetList.HaveDataList(), self.TrustExtensionData.CompareTargetArry);
                //debugger;
                $.each(self.TrustExtensionData.CompareTargetArry(), function (i, n) {
                    n.ItemValue.subscribe(function () {
                        self.batchToReCalculate();
                    });
                });

                self.TrustExtensionData.DateSetList.HaveDataList.subscribe(function (newArray) {
                    self.CompareTargetUpdate(newArray, self.TrustExtensionData.CompareTargetArry);
                    self.batchToReCalculate();

                    $.each(self.TrustExtensionData.CompareTargetArry(), function (i, n) {
                        n.ItemValue.subscribe(function () {
                            self.batchToReCalculate();
                        });
                    });
                });

                self.InitPublicHolidays();

                self.isFirst = false;

                self.ShowOrHideJsrRight();
                self.ShowOrHideJsrRightButton();

                self.dateSetType();
            }
        },
        update: function () {
            var self = TrustExtensionNameSpace;
            var result = self.TESaveInfo();//ko.mapping.toJSON(
            //$("#TemText").val(result);
            //console.log(self.TrustExtensionPage.Code + ".update：" + result);
            console.log("result::");
            console.log(result);

            return result;
        },
        preview: function () {
            var self = TrustExtensionNameSpace;
            var result = self.TEPreview();//ko.mapping.toJSON(
            console.log(self.TrustExtensionPage.Code + ".preview:" + result);
            return result;
        },
        validation: function () {
            //验证
            return this.validControls("#TrustExtensionDiv input[data-valid]");
        },
        render: function () {
            //当前step加载时,调用
            var self = TrustExtensionNameSpace;
            //获取产品页 支持循环结构是否选中 ,ItemCode:IsTopUpAvailable
            var b = TrustItemModule.getItemValueByCode("IsTopUpAvailable");
            var dom = $("#TrustExtensionDiv").find("div.item:eq(1)");
            if(b == true)
                dom.show();
            else
                dom.hide();
        },
        InitTest: function () {
            var self = TrustExtensionNameSpace;
            if (isFirst) {
                self.TEStringToJSON(self.TrustExtensionElement.Init);
            }
            else
                self.TrustExtensionElement.Init();
        }
    },
    ShowOrHideJsrRight: function () {
        var self = TrustExtensionNameSpace;

        $("#setautohide").click(function () {
            self.ShowOrHideJsrRightBool = !self.ShowOrHideJsrRightBool;
            self.ShowOrHideJsrRightAllSet();
            if (self.ShowOrHideJsrRightBool == true) {
                $("#setautohide i").removeClass("icon-top").addClass("icon-bottom");
                $("#setautohide span").text(" 点击隐藏");
            }
            else if (self.ShowOrHideJsrRightBool == false) {
                $("#setautohide i").removeClass("icon-bottom").addClass("icon-top");
                $("#setautohide span").text(" 点击显示");
            }
        });
    },
    ShowOrHideJsrRightAllSet: function () {
        var self = TrustExtensionNameSpace;

        var autohides = $("#TrustExtensionJSRListHaveDataList div[name='autohide']");
        autohides.css("display", self.ShowOrHideJsrRightBool == true ? "block" : "none");
    },
    //是否显示 显示/隐藏 按钮
    ShowOrHideJsrRightButton: function () {
        var self = TrustExtensionNameSpace;
        //if (self.TrustExtensionData.JSRList.HaveDataList().length > 0)
        if ($("#TrustExtensionDiv").find("#TrustExtensionJSRListHaveDataList").children().length > 0)
            $("#setautohide").show();
        else
            $("#setautohide").hide();
    },
    CompareTargetUpdate: function (newArray, obj) {
        obj.removeAll();
        $.each(newArray, function (i, n) {
            if (n.DataType().toLocaleLowerCase() == "date") {
                obj.push(n);
            }
        });
    },
    //添加、移除工作日
    addWorkDay: function () {
        var self = TrustExtensionNameSpace;

        $('#addWorkDay').click(function () {
            if (self.TrustExtensionData.JSRList.NoHaveDataList().length <= 0)
                return;
            var value = [];
            var _obj = $(this).parent().parent();
            _obj.find('.form-control').each(function () {
                value.push($(this).val());
            });
            if (typeof value[3] == "undefined" || parseInt(value[3]) != value[3]) {
                alert("请输入正确的距离天数");
                return;
            }
            if (typeof value[1] == "undefined" || self.RQcheck(value[1]) == false) {
                alert("请填写" + self.TrustExtensionData.GetCompareTargetName(value[2]));
                return;
            }

            var dvcode = _obj.find(".form-control:eq(0) option:selected");
            var index0 = dvcode.attr('dataIndex'); //.index();

            var _this = $(this);
            var oNew = self.TrustExtensionData.JSRList.NoHaveDataList()[index0];
            self.TrustExtensionData.JSRList.NoHaveDataList.remove(oNew);

            //var data = self.tableColumn(oNew.ItemCode, value[0], value[1], value[2], value[3]);

            //var newData = ko.mapping.fromJS(data);

            var newData = oNew;
            newData.DisplayName(value[0]);
            newData.ItemValue(value[1]);
            newData.CompareTarget(value[2]);
            newData.DateCount(value[3]);

            self.TrustExtensionData.JSRList.HaveDataList.push(newData);

            self.ShowOrHideJsrRightButton();
            self.ShowOrHideJsrRightAllSet();
        });
        $("#removeWorkDay").live('click', function () {
            var index0 = $(this).attr("dataIndex");

            var oNew = self.TrustExtensionData.JSRList.HaveDataList()[index0];
            self.TrustExtensionData.JSRList.HaveDataList.remove(oNew);

            oNew.ItemValue("");
            oNew.CompareTarget("");
            oNew.DateCount("");
            self.TrustExtensionData.JSRList.NoHaveDataList.push(oNew);

            self.ShowOrHideJsrRightButton();
        });
    },
    //添加、移除展示字段
    addShowColumn: function () {
        var self = TrustExtensionNameSpace;

        $("#addShowColumn").click(function () {
            var _obj = $(this).parent().parent();
            var dvcode = _obj.find(".form-control:eq(0) option:selected");
            var index0 = dvcode.attr('dataIndex'); //.index();

            if (self.TrustExtensionData.DateSetList.NoHaveDataList().length > parseInt(index0)) {
                var oNew = self.TrustExtensionData.DateSetList.NoHaveDataList()[index0];

                self.TrustExtensionData.DateSetList.NoHaveDataList.remove(oNew);
                //oNew.CanDel = true;
                self.TrustExtensionData.DateSetList.HaveDataList.push(oNew);
                self.dateSetType();

            } else {
                //alert("false ..");
                return false;
            }
        });
        $("#removeShowColumn").live('click', function () {
            var index0 = $(this).attr("dataIndex");

            var oNew = self.TrustExtensionData.DateSetList.HaveDataList()[index0];
            self.TrustExtensionData.DateSetList.HaveDataList.remove(oNew);

            oNew.ItemValue("");
            self.TrustExtensionData.DateSetList.NoHaveDataList.push(oNew);
        });
    },
    addShowColumnEx: function () {
        var self = TrustExtensionNameSpace;

        $("#addShowColumnEx").click(function () {
            var _obj = $(this).parent().parent();
            var dvcode = _obj.find(".form-control:eq(0) option:selected");
            var index0 = dvcode.attr('dataIndex'); //.index();

            if (self.TrustExtensionData.ForEachSet.NoHaveDataList().length > parseInt(index0)) {
                var oNew = self.TrustExtensionData.ForEachSet.NoHaveDataList()[index0];

                self.TrustExtensionData.ForEachSet.NoHaveDataList.remove(oNew);
                //oNew.CanDel = true;
                self.TrustExtensionData.ForEachSet.HaveDataList.push(oNew);
                self.dateSetType();

            } else {
                //alert("false ..");
                return false;
            }
        });
        $("#removeShowColumnEx").live('click', function () {
            var index0 = $(this).attr("dataIndex");

            var oNew = self.TrustExtensionData.ForEachSet.HaveDataList()[index0];
            self.TrustExtensionData.ForEachSet.HaveDataList.remove(oNew);

            oNew.ItemValue("");
            self.TrustExtensionData.ForEachSet.NoHaveDataList.push(oNew);
        });
    },
    //CompareTarget onchange事件
    DateTypeSelect: function () {
        $("#TrustExtensionDiv").find("#DateTypeSelect").change(function () {
            var self = TrustExtensionNameSpace;
            self.calculateDaTEShowInit(this);
            return false;
        });
    },
    //日期空间挂钩子
    dateSetType: function () {
        $("#TrustExtensionDiv").find('.date-plugins').date_input();
    },
    //添加工作日个数出发事件
    addDateCount: function () {
        var self = TrustExtensionNameSpace;
        //baseDateType
        $("#TrustExtensionDiv").find("#addWorkDayDiv").find("input[name='DateCount']").live("change", function () {
            self.calculateDaTEShowInit(this);
            return false;
        });
        $("#TrustExtensionDiv").find("#TrustExtensionJSRListHaveDataList").find("input[name='DateCount']").live("change", function () {
            self.calculateDateByText(this);
            return false;
        });
    },
    DateSetChange: function () {
        $("#TrustExtensionDiv").find()
    },
    //批量重新计算，计算日期
    batchToReCalculate: function () {
        var self = TrustExtensionNameSpace;
        //debugger;
        console.log("batchToReCalculate");
        $("#TrustExtensionDiv").find("#addWorkDayDiv").find("input[name='DateCount']").each(function (i, n) {
            self.calculateDaTEShowInit($(n));
        });
        self.calculateDateByKoArray();
    },
    //更改对比天数，计算结果日期
    calculateDaTEShowInit: function (_thisObj) {
        var self = TrustExtensionNameSpace;

        var _obj = $(_thisObj).parent().parent().parent().parent();
        var _this = _obj.find("input[name='DateCount']");

        if (_this == null || typeof _this == "undefined" || parseInt(_this.val()) != _this.val())
            return false;

        var basedatetype = "";
        var basedatetypeele = _obj.find("select[name='DateType'] option:selected");
        if (basedatetypeele.length > 0) {
            basedatetype = basedatetypeele.val();
        } else {
            basedatetypeele = _obj.find("label[name='DateType']");
            basedatetype = basedatetypeele.val();
        }
        //var datevaluefrom = $("#TrustExtensionDiv").find("input[type='text'][baseDateType='" + basedatetype + "']");
        //var datevaluefromval = datevaluefrom.val();

        var tmpArray = $.grep(self.TrustExtensionData.DateSetList.HaveDataList(), function (n, i) {
            return n.ItemCode() == basedatetype
        });
        if (tmpArray.length <= 0) {
            oNew.ItemValue("");
            return false;
        }

        var result = self.caculateDaysProvider(tmpArray[0].ItemValue(), _this.val(), basedatetype);

        var datevalueto = _obj.find("input[type=text][name='DateValue']");
        datevalueto.val(result);
    },
    calculateDateByText: function (_thisObj) {
        var self = TrustExtensionNameSpace;

        var _obj = $(_thisObj).parent().parent().parent().parent();
        var _this = _obj.find("input[name='DateCount']");

        if (_this == null || typeof _this == "undefined" || parseInt(_this.val()) != _this.val())
            return false;

        var index0 = _obj.attr("dataIndex");
        var oNew = self.TrustExtensionData.JSRList.HaveDataList()[index0];
        var basedatetype = oNew.CompareTarget();

        if (basedatetype == null || typeof basedatetype == "undefined" || basedatetype == "") {
            oNew.ItemValue("");
            return false;
        }

        var tmpArray = $.grep(self.TrustExtensionData.DateSetList.HaveDataList(), function (n, i) {
            return n.ItemCode() == basedatetype
        });
        if (tmpArray.length <= 0) {
            oNew.ItemValue("");
            return false;
        }

        var result = self.caculateDaysProvider(tmpArray[0].ItemValue(), oNew.DateCount(), basedatetype);

        oNew.ItemValue(result);
    },
    calculateDateByKoArray: function () {
        var self = TrustExtensionNameSpace;

        $.each(self.TrustExtensionData.JSRList.HaveDataList(), function (i, n) {
            var oNew = n;
            var basedatetype = oNew.CompareTarget();
            if (basedatetype == null || typeof basedatetype == "undefined" || basedatetype == "") {
                oNew.ItemValue("");
            }
            else {
                var tmpArray = $.grep(self.TrustExtensionData.DateSetList.HaveDataList(), function (n, i) {
                    return n.ItemCode() == basedatetype
                });
                if (tmpArray.length <= 0) {
                    oNew.ItemValue("");
                }
                else {
                    var result = self.caculateDaysProvider(tmpArray[0].ItemValue(), oNew.DateCount(), basedatetype);
                    oNew.ItemValue(result);
                }
            }
        });
    },
    calculateDateInitSet: function () {
        var self = TrustExtensionNameSpace;

        $.each(self.TrustExtensionData.JSRList.HaveDataList(), function (i, n) {
            if ($.inArray(n.ItemCode(), self.InitSetCodeArray) >= 0) {
                var oNew = n;
                var basedatetype = oNew.CompareTarget();
                if (basedatetype == null || typeof basedatetype == "undefined" || basedatetype == "") {
                    oNew.ItemValue("");
                }
                else {
                    var tmpArray = $.grep(self.TrustExtensionData.DateSetList.HaveDataList(), function (n, i) {
                        return n.ItemCode() == basedatetype
                    });
                    if (tmpArray.length <= 0) {
                        oNew.ItemValue("");
                    }
                    else {
                        var result = self.caculateDaysProvider(tmpArray[0].ItemValue(), oNew.DateCount(), basedatetype);
                        oNew.ItemValue(result);
                    }
                }
            }
        });
        self.InitSetCodeArray = null;
    },
    //RealDaysItemCodes
    //日期计算
    caculateDaysProvider: function (sDateStr, num, basedatetype) {
        var self = TrustExtensionNameSpace;

        if (sDateStr == null || typeof sDateStr == "undefined" || self.RQcheck(sDateStr) == false || num == null || typeof num == "undefined" || parseInt(num) != num || typeof basedatetype == "undefined")
            return "";
        if (num == 0)
            return sDateStr;

        if (self.RealDaysItemCodes != null && typeof self.RealDaysItemCodes != "undefined" && self.RealDaysItemCodes.length > 0 && $.inArray(basedatetype, self.RealDaysItemCodes) >= 0)
            return self.caculateRealDays(sDateStr, num);
        else
            return self.caculateWorkDate(sDateStr, num);
    },
    //实际天数计算
    caculateRealDays: function (sDateStr, num) {
        var self = TrustExtensionNameSpace;

        var curDateTime = self.GetDate(sDateStr).getTime();
        num = parseInt(num);

        curDateTime += 86400000 * num;

        var dret = new Date();
        dret.setTime(curDateTime);

        var sDataResult = self.dateToString(dret);//(dret.getFullYear()) + '-' + (dret.getMonth() + 1) + '-' + dret.getDate();

        return sDataResult;
    },
    //计算工作日
    caculateWorkDate: function (sDateStr, num) {
        var self = TrustExtensionNameSpace;
        //debugger;
        var xs = num > 0 ? 1 : -1;
        var curDateTime = self.GetDate(sDateStr).getTime();
        num = parseInt(num);
        while (true) {
            try {
                curDateTime += 86400000 * xs;
                if ($.inArray(curDateTime, self.PublicHolidays.WorkDayItems) < 0) {
                    num = num - (1 * xs);
                }
                if (num == 0)
                    break;
            }
            catch (e) {
                break;
            }
        }
        var dret = new Date();
        dret.setTime(curDateTime);

        var sDataResult = self.dateToString(dret); //(dret.getFullYear()) + '-' + (dret.getMonth() + 1) + '-' + dret.getDate();

        return sDataResult;
    },
    //计算工最近的作日,如果当天是工作日则直接返回
    getWorkDate: function (sDateStr, num) {
        var self = TrustExtensionNameSpace;

        num = num ? num : 0;
        var xs = num >= 0 ? 1 : -1;
        var curDateTime = self.GetDate(sDateStr).getTime();
        num = parseInt(num);
        if (num == 0) {
            while (true) {
                try {
                    if ($.inArray(curDateTime, self.PublicHolidays.WorkDayItems) < 0) {
                        break;
                    }
                    curDateTime += 86400000 * xs;
                }
                catch (e) {
                    break;
                }
            }
        }
        else {
            while (true) {
                try {
                    curDateTime += 86400000 * xs;
                    if ($.inArray(curDateTime, self.PublicHolidays.WorkDayItems) < 0) {
                        num = num - (1 * xs);
                    }
                    if (num == 0)
                        break;
                }
                catch (e) {
                    break;
                }
            }
        }
        var dret = new Date();
        dret.setTime(curDateTime);

        var sDataResult = self.dateToString(dret); //(dret.getFullYear()) + '-' + (dret.getMonth() + 1) + '-' + dret.getDate();

        return sDataResult;
    },
    GetDate: function (datestr) {
        if (datestr != null && typeof datestr != "undefined")
            return new Date(datestr.split("-")[0], datestr.split("-")[1] - 1, datestr.split("-")[2])
        else
            return null;
    },
    RQcheck: function (RQ) {
        var date = RQ;
        var result = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);

        if (result == null)
            return false;
        var d = new Date(result[1], result[3] - 1, result[4]);
        return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4]);
    },
    stringToDate: function (string) {
        var matches;
        if (matches = string.match(/^(\d{4,4})-(\d{1,2})-(\d{2,2})$/)) {
            return new Date(matches[1], matches[2] - 1, matches[3]);
        } else {
            return null;
        };
    },
    dateToString: function (date) {
        var month = (date.getMonth() + 1).toString();
        var dom = date.getDate().toString();
        if (month.length == 1) month = "0" + month;
        if (dom.length == 1) dom = "0" + dom;
        return date.getFullYear() + "-" + month + "-" + dom;
    }
};
//debugger;
TRUST.registerMethods(TrustExtensionNameSpace.TrustExtensionElement);
