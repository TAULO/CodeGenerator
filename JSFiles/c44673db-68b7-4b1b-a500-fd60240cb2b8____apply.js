var _step=1;
$(function() {
	var userProductType;
	//根据所选的城市出现对应的营业部
	$('#toolbar #cityComb').combobox({     
	    valueField:'id',
	    textField:'name',
	    onChange:function(value){ 
	    	$('#toolbar #salesDeptComb').combobox({     
	    		  url:'audit/getSalesDeptFrCityId?cityId='+value,
	    		    valueField:'id',
	    		    textField:'name',
	    		    onLoadSuccess:function(){
	    	        	var data = $(this).combobox('getData');
	    	        	var salesDeptId;
	    	        	if(data.length>0) {
	    	        		$(this).combobox('select', data[0].id);
	    	        		salesDeptId = data[0].id;
	    	        		if(data[1] && data[1].id){
	    	        			salesDeptId = data[1].id;
	    	        		}
	    	        	}
	    	        	//根据固定的营业网点显示所有的客户经理
	    	        	$('#toolbar #managerName').combobox({
	    	                url:'apply/getCrmsInSalesDeptByProductIdAndSalesDeptIdHaveAll?salesDeptId='+salesDeptId+'&productId='+0,
	    	                valueField:'id',
	    	                textField:'name',
	    	                onLoadSuccess:function(pageData){
	    	                    if(pageData.loanId){
	    	                         $(this).combobox('select', pageData.crm.id);
	    	                     }else{
	    	                        var data = $(this).combobox('getData');
	    	                        if(data.length>0)
	    	                          $(this).combobox('select', data[0].id);
	    	                     }
	    	                  },filter: function(q, row){ 
	    	                      var opts = $(this).combobox('options'); 
	    	                      //return row[opts.textField].indexOf(q) == 0; 
	    	                      return row[opts.textField].indexOf(q)>-1;//将从头位置匹配改为任意匹配 
	    	                  }, 
	    	                  onSelect:function(newVal, oldVal){                      
	    	                     $('#toolbar #managerName').find('#crmId').val(newVal.id);
	    	                  }
	    	            });
	    	         }
	    	  }); 
	    }
	});
	
	
	//营业网点
    $('#toolbar #salesDeptComb').combobox({
        url:'apply/getCurSalesDept',
        valueField:'id',
        textField:'name',
        onLoadSuccess:function(){
            var data = $(this).combobox('getData');
            $(this).combobox('select', data[0].id);
            //客户经理
        }
    });
	
    //产品类型
    $('#toolbar #productComb').combobox({
        url:'apply/getProductType',
        valueField:'id',
        textField:'productName',
        onLoadSuccess:function(){
            var data = $(this).combobox('getData');
            if(data.length==1)
                $(this).combobox('select', data[0].productType);
            userProductType = data[0].productType;
        }
//        },onChange:function(value) {
//        var dataDeptId = $('#toolbar #salesDeptComb').combobox('getData');
//        var salesDeptId;
//        var salesDeptId = dataDeptId[1].id;
//        var url;
//        if(salesDeptId) {
//        	if(value){
//        		url = 'apply/getCrmsInSalesDeptByProductIdAndSalesDeptId?salesDeptId='+salesDeptId+'&productId='+value;
//        	}else {
//        		url = 'apply/getCrmsInSalesDeptByProductIdAndSalesDeptId?salesDeptId='+salesDeptId+'&productId='+0;
//        	}
//        	$('#toolbar #managerName').combobox({
//                url:url,
//                valueField:'id',
//                textField:'name',
//                onLoadSuccess:function(pageData){
//                    if(pageData.loanId){
//                         $(this).combobox('select', pageData.crm.id);
//                     }else{
//                        var data = $(this).combobox('getData');
//                        if(data.length>0)
//                          $(this).combobox('select', data[0].id);
//                     }
//                  },filter: function(q, row){ 
//                      var opts = $(this).combobox('options'); 
//                      //return row[opts.textField].indexOf(q) == 0; 
//                      return row[opts.textField].indexOf(q)>-1;//将从头位置匹配改为任意匹配 
//                  }, 
//                  onSelect:function(newVal, oldVal){                      
//                     $('#toolbar #managerName').find('#crmId').val(newVal.id);
//                  }
//            });
//        }
//        }
    
    });
    
    //城市
    $('#toolbar #cityComb').combobox({
        url:'apply/getCurCity',
        valueField:'id',
        textField:'name',
        onLoadSuccess:function(){
            var data = $(this).combobox('getData');
            if(data.length==1)
                $(this).combobox('select', data[0].id);
        }
    });

    // 借款状态
    $('#toolbar #loanStatusComb').combobox({
    	url:'apply/getLoanStatusList',
    	valueField:'value' ,
    	textField:'name',
    	 onLoadSuccess:function(){    
    		  var data = $(this).combobox('getData');    		
    	       $(this).combobox('select',data[0].value);
    	 }
    });
  
    $('#toolbar #extensionTimeComb').combobox({
        url:'apply/getExtensionTimeList',
        valueField:'value',
        textField:'name',
        onLoadSuccess:function(){
             var data = $(this).combobox('getData');
                $(this).combobox('select', data[0].value);
            
        }
    });
       // 查询按钮
    $('#searchBt').bind('click', search);

    var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];    // 加权因子   
    var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];            // 身份证验证位值.10代表X   
    /**  
     * 判断身份证号码为18位时最后的验证位是否正确  
     * @param a_idCard 身份证号码数组  
     * @return  
     */  
    function isTrueValidateCodeBy18IdCard(a_idCard) {   
        var sum = 0;                             // 声明加权求和变量   
        if (a_idCard[17].toLowerCase() == 'x') {   
            a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作   
        }   
        for ( var i = 0; i < 17; i++) {   
            sum += Wi[i] * a_idCard[i];            // 加权求和   
        }   
        valCodePosition = sum % 11;                // 得到验证码所位置   
        if (a_idCard[17] == ValideCode[valCodePosition]) {   
            return true;   
        } else {   
            return false;   
        }   
    }   
    /**  
      * 验证18位数身份证号码中的生日是否是有效生日  
      * @param idCard 18位书身份证字符串  
      * @return  
      */  
    function isValidityBrithBy18IdCard(idCard18){   
        var year =  idCard18.substring(6,10);   
        var month = idCard18.substring(10,12);   
        var day = idCard18.substring(12,14);   
        var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
        // 这里用getFullYear()获取年份，避免千年虫问题   
        if(temp_date.getFullYear()!=parseFloat(year)   
              ||temp_date.getMonth()!=parseFloat(month)-1   
              ||temp_date.getDate()!=parseFloat(day)){   
                return false;   
        }else{   
            return true;   
        }   
    }   
      /**  
       * 验证15位数身份证号码中的生日是否是有效生日  
       * @param idCard15 15位书身份证字符串  
       * @return  
       */  
      function isValidityBrithBy15IdCard(idCard15){   
          var year =  idCard15.substring(6,8);   
          var month = idCard15.substring(8,10);   
          var day = idCard15.substring(10,12);   
          var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
          // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
          if(temp_date.getYear()!=parseFloat(year)   
                  ||temp_date.getMonth()!=parseFloat(month)-1   
                  ||temp_date.getDate()!=parseFloat(day)){   
                    return false;   
            }else{   
                return true;   
            }   
      }   
    //去掉字符串头尾空格   
    function trim(str) {   
        return str.replace(/(^\s*)|(\s*$)/g, "");   
    }  
    
    $.extend($.fn.validatebox.defaults.rules, {
    	//邮编校验
    	zipCheck: {
            validator: function (value) {
                return /^[0-9]\d{5}$/.test(value);
            },
            message: '邮政编码不正确'
        },
        //地址校验
        addressCheck:{
              validator:function(value){
                   var a1,a2,a3,a4, i,l;
                   l=value.length-1;
                   if(value!=""&&value!=undefined){
                       for(i=0;i<value.length;i++){
                           if(value[i]=="省"){
                               a1=i;
                           } else if(value[i]=="市"){
                               a2=i;
                           } else if(value[i]=="区"){
                               a3=i;
                           } else if(value[i]=="县"){
                               a4=i;
                           }
                       }
                       if(a1!=undefined){
                           if(a1<a2&&a2<a3||a2<a4){
                               if(a3==l||a4==l){
                                  return false;
                               }else{
                                   return true;
                               }
                           }else{
                               return false;
                           }
                       }else{
                           if(a2<a3||a2<a4){
                               if(a3==l||a4==l){
                                    return false;
                               }else{
                                   return true;
                               }
                           }else{
                               return false;
                           }
                       }
   
                   }else{
                      return false;
                   }
              },
              message:'地址不正确'
          },
          requestMoneyCheck:{
        	  validator: function (value) {
        		  if(value%1000!=0){
        			  false;
        		  }else{
        			  return true;
        		  }
                 
              },
              message: '申请金额是一千的倍数'
          },
           requestMoneyCheckW:{
            validator: function (value) {
              if(value%10000!=0){
                false;
              }else{
                return true;
              }
                 
              },
              message: '申请金额是一万的倍数'
          },
    mobileCheck:{
        validator: function (value) {
            return /^(?:13\d|14\d|15\d|17\d|18\d)-?\d{5}(\d{3}|\*{3})$/.test(value);
        },
        message: '手机号码不正确'
    }, 
    telCheck:{
        validator:function(value,param){
            return /^(\d{3}-|\d{4}-)?(\d{8}|\d{7})?(-\d{1,6})?$/.test(value);
        },
        message:'电话号码不正确'
    },
    phoneCheck:{
        validator:function(value,param){
        	
            return (/^(\d{3}-|\d{4}-)?(\d{8}|\d{7})?(-\d{1,6})?$/.test(value))||(/^(?:13\d|14\d|15\d|17\d|18\d)-?\d{5}(\d{3}|\*{3})$/.test(value));
        },
        message:'联系电话不正确'
    },
    integerCheck:{
        validator:function(value){
            return /^[+]?[0-9]\d*$/.test(value);
        },
        message: '请输入整数'
    },//金额校验
    moneyCheck:{
        validator: function (value) {
            return (/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(value);
         },
         message:'请输入正确的金额'
    } ,
    percentCheck:{
        validator: function (value) {
            return (/^(([1-9]\d*)|\d)(\.\d{1,4})?$/).test(value);
         },
         message:'请输入正确的比率'
    } ,
    //邮箱校验
    emailCheck:{
    	
    	validator:function(value){
            return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value);
        },
        message: '请输入正确的邮箱地址'
    } ,

    //车牌校验
    carNoCheck:{
        validator: function (value) {
            return (/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/).test(value);
         },
         message:'请输入正确的车牌号码'

    },
    CHSAndENCheck:{
        validator: function (value) {
            return ( /^[\u4e00-\u9fa5a-zA-Z]+$/).test(value);
         },
         message:'请输入正确的格式'
    },//汉字校验
    CHSCheck:{
        validator: function (value) {
            return ( /^[\u4e00-\u9fa5]+$/).test(value);
         },
         message:'请输入正确的中文格式'
    },
    idCheck:{
        validator:function(idCard){
        	 
        	    idCard = trim(idCard.replace(/(^\s*)|(\s*$)/g, ""));               //去掉字符串头尾空格                     
        	    if (idCard.length == 15) {   
        	        return isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证    
        	    } else if (idCard.length == 18) {   
        	        var a_idCard = idCard.split("");  
        	       
        	        // 得到身份证数组   
        	        if(isValidityBrithBy18IdCard(idCard)&&isTrueValidateCodeBy18IdCard(a_idCard)){   //进行18位身份证的基本验证和第18位的验证
        	            return true;   
        	        }else {   
        	            return false;   
        	        }   
        	    } else {   
        	        return false;   
        	    }   
        },
        message:'请输入正确的身份证号'
      }
    
      });
    
    
  	$.ajax({
        type: "POST",
        url: "apply/getLoanType",
        dataType: "json",
      
        success: function(data){
            var columnsArr = [
				  {
                  field : 'organName',
                  title : '机构名称',
                  formatter: function(value, row, index) {
                    return row.organ?row.organ.name :'';               
                  },
                  width : 100
                },{
                  field : 'ChannelPlanCheck',
                  title : '方案名称',
                  formatter: function(value, row, index) {
                    return row.channelPlanCheck?row.channelPlanCheck.name  :'';               
                  },
                  width : 80
                }, {
                        field : 'personNo',
                        title : '客户编号',
                        formatter: function(value, row, index) {
                            return row.person.personNo;                             
                        },
                        width : 140
                    }, {
                        field : 'personName',
                        title : '姓名',
                        formatter : link,
                        width : 60
                    }, {
                        field : 'personIdnum',
                        title : '身份证号',
                        formatter : function(value, row, index) {
                            return row.person.idnum;
                        },
                        width : 150
                    }, {
            			field : 'productName',
            			title : '产品类型',
            			width : 180,
            			formatter: showExtensionLoanLedgerApplyBase,
                        width : 80
                    }, {
                        field : 'requestMoney',
                        title : '申请金额(元)',
                        width : 80
                    }, {
                        field : 'auditMoney',
                        title : '审批金额(元)',
                        width : 80 
                    }, {
                  field : 'auditMemberTypeText',
                  title : '审批会员类型',
                  width : 80 
                }, {
                        field : 'auditTime',
                        title : '审批期限',
                        width : 60
                    }, {
                        field : 'extensionTime',
                        title : '展期期次',
                        formatter : function(value, row, index) {
                            if(value == 0) {
                                return "无";
                            } else {
                                return value;
                            }
                        },
                        width : 60
                    }, {
                        field : 'hasHouse',
                        title : '费率',
                        formatter : function(value, row, index) {
                            return formatEnumName(value, 'HAVE_HOUSE_STATUS');
                        },
                        width : 80
                    }, {
                        field : 'serviceName',
                        title : '客服人员',
                        formatter : function(value, row, index) {
                            return row.service.name;
                        },
                        width : 80
                    }, {
                        field : 'managerName',
                        title : '客户经理',
                        formatter : function(value, row, index) {
                            return row.crm.name;
                        },
                        width : 80
                    }, {
                        field : 'assessorName',
                        title : '复核人员',
                        formatter : function(value, row, index) {
                        	if(row.assessor==null){
                        		return "";
                        	}else{
                        		return row.assessor.name;
                        	}
                            
                        },
                        width : 80
                    }, {
                        field : 'salesDeptName',
                        title : '营业网点',
                        formatter : function(value, row, index) {
                            return row.salesDept.name;
                        },
                        width : 150
                    }, {
                        field : 'requestDate',
                        title : '申请日期',
                        formatter : formatRequestDate,
                        width : 100
                    }, {
                        field : 'createdTime',
                        title : '创建时间',
                        width : 150
                    }, {
                        field : 'status',
                        title : '状态',
                        formatter : function(value, row, index) {
                                var valueArr = [23,25,28,32,34,35,36,38,39,48];
                                var userTypeCtrl = [2,3,4,5,6];
                                        if($.inArray(value,valueArr) >-1 && $.inArray( row.curUserType ,userTypeCtrl) > -1){
                                            if(value == 38 || value == 36){
                                                return formatEnumName(49, 'LOAN_STATUS');
                                            }else if( value == 35 || value == 34){
                                                return formatEnumName(53, 'LOAN_STATUS');
                                            }else{
                                                
                                                return formatEnumName(20, 'LOAN_STATUS');
                                            }
                                
                                        }else{
                                                  return formatEnumName(value, 'LOAN_STATUS');
                    
                                        }
                                    },
                        width : 100
                    }, {
                        field : 'operation',
                        title : '操作',
                        formatter : formatOperationsCell,
                        width : 160
                    }
                    ];
            if(data.length<2){
                columnsArr.splice(10,1);
            }


        	if(data[0]!=null && data[0].productType == '1'){
        		   //初始化列表/getLoginInfo
        	    $('#loanPageTb').datagrid({
        	        url : 'apply/getLoanPage',
        	        fitColumns : true,
        	        border : false,
        	        singleSelect:true,
        	        pagination : true,
        	        striped: true,
        	        pageSize:10,
        	        rownumbers : true,
        	        fit:true,
        	        columns : [columnsArr],
        	        rowStyler:function(index,row){ // 退回的单子显示红色
        	            if (row.status==51 ){   
        	              		// return 'background-color:#FF2850;';   
        	            	}   
        	       		}  
        	    });
        	}else{
        		   //初始化列表/getLoginInfo
        	    $('#loanPageTb').datagrid({
        	        url : 'apply/getLoanPage',
        	        fitColumns : true,
        	        border : false,
        	        singleSelect:true,
        	        pagination : true,
        	        striped: true,
        	        pageSize:10,
        	        rownumbers : true,
        	        fit:true,
        	        columns : [[
        	           {
        				field : 'personNo',
        				title : '客户编号',
        				formatter: function(value, row, index) {
        					return row.person.personNo;								
        				},
        				width : 140
        			}, {
        				field : 'personName',
        				title : '姓名',
        				formatter : link,
        				width : 50
        			},{
        				field : 'mobilePhoneLoan',
        				title : '手机号',
        				width : 50
        			},{
        				field : 'plateNumber',
        				title : '车牌号',
        				width : 50
        			}, {
        				field : 'personIdnum',
        				title : '身份证号',
        				formatter : function(value, row, index) {
        					return row.person.idnum;
        				},
        				width : 150
        			}, {
            			field : 'productName',
            			title : '产品类型',
            			width : 180,
            			formatter: showExtensionLoanLedgerApplyBase,
        				width : 80
        			}, {
        				field : 'requestMoney',
        				title : '申请金额(元)',
        				width : 80
        			}, {
        				field : 'auditMoney',
        				title : '审批金额(元)',
        				width : 80 
        			}, {
        				field : 'auditTime',
        				title : '审批期限',
        				width : 60
        			}, {
        				field : 'extensionTime',
        				title : '展期期次',
        				formatter : function(value, row, index) {
        					if(value == 0) {
        						return "无";
        					} else {
        						return value;
        					}
        				},
        				width : 60
        			},  {
        				field : 'serviceName',
        				title : '客服人员',
        				formatter : function(value, row, index) {
        					return row.service.name;
        				},
        				width : 80
        			}, {
        				field : 'managerName',
        				title : '客户经理',
        				formatter : function(value, row, index) {
        					return row.crm.name;
        				},
        				width : 80
        			}, {
        				field : 'assessorName',
        				title : '复核人员',
        				formatter : function(value, row, index) {
        					if(row.assessor==null){
                        		return "";
                        	}else{
                        		return row.assessor.name;
                        	}
        				},
        				width : 80
        			}, {
        				field : 'salesDeptName',
        				title : '营业网点',
        				formatter : function(value, row, index) {
        					return row.salesDept.name;
        				},
        				width : 150
        			}, {
        				field : 'requestDate',
        				title : '申请日期',
        				formatter : formatRequestDate,
        				width : 100
        			}, {
        				field : 'createdTime',
        				title : '创建时间',
        				width : 150
        			}, {
        				field : 'status',
        				title : '状态',
        				formatter : function(value, row, index) {
//        	        var valueArr = [23,25,28,32,38,39,48];
//        	        var userTypeCtrl = [2,3,4,5,6];
//        	        if($.inArray(value,valueArr) >-1 && $.inArray( row.service.userType ,userTypeCtrl) > -1){
        	//
//        	          return formatEnumName(30, 'LOAN_STATUS');
//        	        }else{
        					  return formatEnumName(value, 'LOAN_STATUS');

//        	        }
        				},
        				width : 100
        			}, {
        				field : 'operation',
        				title : '操作',
        				formatter : formatOperationsCell,
        				width : 160
        			}
        	        ]],
        	        rowStyler:function(index,row){ // 退回的单子显示红色
        	            if (row.status==51 ){   
        	              		// return 'background-color:#FF2850;';   
        	            	}   
        	       		}  
        	    });
        	}
        },
        error:function(){
        	
        }
    });
    $(document).keydown(function(e) {
    	if(e.which == 13) {
    		$('#searchBt').click();
    	}
    });
    //TODO
    
});

//Email前缀
function emailPrefix(str){
var index = str.indexOf("@");     
return str.substring(0,index);
}
//Email后缀
function emailSuffix(str){
var index = str.indexOf("@"); 	
return  str.substring(index,str.lenght);
}



function link(value,row,index){
  var fontStyle = 'font-weight:bolder';
  if(row.status==51 || row.status== 36 || row.status == 38){
     fontStyle = ' font-weight:bolder;color:red; ';
  }
  
  if(row.isAutoCancel == 1) {
	  fontStyle = ' font-weight:bolder;color:red; ';
  }

	if(row.extensionTime==0)
	{
		return '<a style='+fontStyle+' href="javascript:void(0)" onclick="browse('+row.id+ ',' + row.productType + ', '+row.productId+' )" >' + row.person.name + '</a>';
	}
	else
	{
		return '<a style='+fontStyle+' href="javascript:void(0)" onclick="browseExtension('+row.id+ ')" >' + row.person.name + '</a>';
	}
} 

function upLoad(){
  $('#file').dialog().dialog('open').dialog('setTitle', '上传附件');
}
/** 操作 */
function formatOperationsCell(value,row,index){

	if(groupId != 55 && userType != 4){
		var operations = row.operations.split("|");
		
		var formattedOperations="";
		for(var i = 0; i < operations.length; i++) {
			var operation = operations[i];
			if (operation == "编辑") {
				operation = '<a href="javascript:void(0)" onclick="edit('+row.id + ', ' + row.productId +',\''+ row.person.idnum + '\')">编辑</a>';
			}
			else if(operation == "提交") {
				operation = '<a href="javascript:void(0)" onclick="submit('+row.id+',\''+row.person.name+'\','+row.mobilePhoneLoan+',\''+row.person.idnum+'\')">提交</a>';
			}
			else if(operation == "附件") {
				operation = '<a href="javascript:void(0)" onclick="showAttachmentDlg('+row.id +','+  row.productType+','+  row.extensionTime  +')">附件</a>';
			}
			else if(operation == "展期提交") {
				operation = '<a href="javascript:void(0)" onclick="extensionSubmit('+row.id+')">提交</a>';
			}
			else if(operation == "申请展期") {
				operation = '<a href="javascript:void(0)" onclick="applyExtension('+ row.id +','+  row.loanId+','+  row.extensionTime  +')">申请展期</a>';
			}
			else if(operation == "借款取消") {
				operation = '<a href="javascript:void(0)" onclick="cancelLoan('+ row.id +')">借款取消</a>';
			} 
			else if(operation == "签约补充资料") {
				operation = '<a href="javascript:void(0)" onclick="signAddFile('+ row.id +','+  row.extensionTime  +')">签约补充资料</a>';
			} 
		  else if(operation == "恢复") {
		    operation = '<a href="javascript:void(0)" onclick="submit('+row.id+')">恢复</a>';
		  }
		  else if(operation == '下载附件'){
		    operation = '<a href="javascript:void(0)" onclick="downloadAttachment(\''+row.contractNo+'\')">下载附件</a>';
		
		  }
		
			if(formattedOperations =="") {
				formattedOperations = operation;
			} else {
				formattedOperations = formattedOperations + "   " + operation;
			}
		
		}
			var log = "<a href='javascript:businessLogPage(" + row.id + ");'>日志</a>";
			formattedOperations = formattedOperations + "  " + log;
		return formattedOperations;
		};
}
function businessLogPage(id) {
    $('#businessLogDlg').dialog({
        title: '借款日志',
        width: 900,
        height: 300,
        closed: false,
        cache: false,
        modal: true
    });
    var url = 'audit/businessLog/detail.json/' + id;
    $('#business_log_result').datagrid({
        url: url,
        fitColumns: true,
        border: false,
        singleSelect:true,
        pagination: true,
        pageSize: 10,
        striped: true,
        rownumbers: true,
        nowrap:false,
        fit:true,
        columns: [
            [
                {
                    field: 'operator',
                    title: '操作者',
                    width: 50
                },
                {
                    field: 'flowStatusView',
                    title: '环节',
                    width: 60
                },
                {
                    field: 'createDate',
                    title: '操作时间',
                    width: 100
                },
                {
                    field: 'message',
                    title: '日志内容',
                    width: 300 
                }
            ]
        ]
    });
    // 设置分页控件
    var p = $('#business_log_result').datagrid('getPager');
    $(p).pagination({
        pageList: [ 10, 20, 50 ]
    });
}

function showAttachmentDlg(loanId,productType,extensionTime){
	if(extensionTime==0)
	{
		if(productType == 1){
		 	window.open (rayUseUrl+"apply/seImageUploadView/"+loanId, "newwindow","toolbar=yes,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,fullscreen=3");
		}else if(productType == 2){
		    window.open (rayUseUrl+"apply/carImageUploadView/"+loanId, "newwindow","toolbar=yes,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,fullscreen=3");
	
		}	
	}
	else
	{
		 window.open (rayUseUrl+"apply/carExtensionImageUploadView/"+loanId, "newwindow","toolbar=yes,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,fullscreen=3");
	}
}

function search(){	
    var queryParams = $('#loanPageTb').datagrid('options').queryParams;
    queryParams.personName = $('#toolbar #personNameTxt').val();
    queryParams.personIdnum = $('#toolbar #personIdnumTxt').val();
    queryParams.productId = $('#toolbar #productComb').combobox('getValue');
    queryParams.salesDeptId = $('#toolbar #salesDeptComb').combobox('getValue');
    queryParams.cityId = $('#toolbar #cityComb').combobox('getValue');
    queryParams.status = $('#toolbar #loanStatusComb').combobox('getValue');
    queryParams.extensionTime = $('#toolbar #extensionTimeComb').combobox('getValue');
    
    queryParams.plateNumber = $('#toolbar #plateNumberTxt').val();
    queryParams.mobilePhoneLoan = $('#toolbar #personMobilePhoneTxt').val();
    var salesDeptId = $('#toolbar #salesDeptComb').combobox('getValue');
    var productId = $('#toolbar #productComb').combobox('getValue');
    queryParams.customerManagerId = $('#toolbar #managerName').combobox('getValue');
//    if(salesDeptId && productId){
//    	queryParams.customerManagerId = $('#toolbar #managerName').combobox('getValue');
//    }else {
//    	queryParams.customerManagerId = '';
//    }
//   queryParams.organName = $('#toolbar #organName').val();
    setFirstPage("#loanPageTb");
    $('#loanPageTb').datagrid('options').queryParams = queryParams;
    $("#loanPageTb").datagrid('reload');
};

function browse(loanId,productType, productId){
	//alert('1');
    if(productType == 1){
       if(5 ==  productId ||  productId == 6){
        //seLoanCityWideLoanDetail;
          doSeLoan(loanId,'apply/seLoanCityWideLoanDetail',loadExistedCityWideLoan);
        }else{
          doSeLoan(loanId);
        }
    }else if(productType == 2){
    	var isf="0";
    	 $.ajax({
 	        url : 'RefusalEntry/isRefusal?loanId='+loanId,
 	        data : $("#addCarLoanForm").serialize(),
 	        type:"POST",
 	        async: false,
 	        success : function(result){
 	            if(result=="1"){
 	            	isf="1";
 	            	  
 	            }
 	        }
 	 });
    	doCarLoan(loanId,isf);
    }
};
function browseExtension(loanId){
    	doCarLoanExtension(loanId);
};
function formatRequestDate(value,row,index){
	 return getYMD(value);
}
function formatSex(sex){
    if(sex==1)
        return "男";
    else if(sex==0)
        return "女";
    else 
    	return sex;
}
function formatHave(have){
    if(have==1)
        return "有";
    else if(have==0)
        return "无";
    else 
    	return have;
}
function formatYes(yes){
    if(yes==1)
        return "是";
    else if(yes== 0)
        return "否";
    else 
    	return yes;
}

function formatProductCarType(loanType){
    if(loanType == 1)
        return "移交类";
    else if(loanType==2)
        return "流通类";
    else 
    	return loanType;
}

function formatEducationLevel(educationLevel){
    if(educationLevel == 0)
        return "初中及以下";
    else if(educationLevel==1)
        return "高中";
    else if(educationLevel==2)
        return "中专";
    else if(educationLevel==3)
        return "大专";
    else if(educationLevel==4)
        return "本科";
    else if(educationLevel==5)
        return "硕士及以上";
    else 
    	return educationLevel;
}

function formatCompanyCategory(category){
    if(category == 0)
        return "个体";
    else if(category==1)
        return "私营独资";
    else if(category==2)
        return "私营合伙";
    else if(category==3)
        return "私营有限责任";
    else if(category==4)
        return "私营股份有限";
    else if(category==5)
        return "其他";
    else 
        return category;
}

function formatGuaranteeType(guaranteeType){
    if(guaranteeType == 0)
        return "自然人";
    else if(guaranteeType==1)
        return "法人";
    else 
        return category;
}

function formatCompanyType(companyType){
	 if(companyType == 0)
	        return "政府机构";
	    else if(companyType==1)
	        return "事业";
	    else if(companyType==2)
	        return "国企";
	    else if(companyType==3)
	        return "外资/合资";
	    else if(companyType==4)
	        return "民营";
	    else if(companyType==5)
	        return "私营";
	    else if(companyType==6)
	        return "其他";
	    else if(companyType==7)
	        return "合资";
	    else 
	    	return companyType;
}

function formatMarried(married){
	 if(married == 0)
        return "未婚";
     else if(married==1)
        return "已婚";
     else if(married==2)
        return "离异";
     else if(married==3)
        return "再婚";
     else if(married==4)
        return "丧偶";
     else if(married==5)
        return "其他";
     else 
    	return married;
}

function transferUndefined(data){
	if(data)
		return data;
	else 
		return "";
}



/** 显示编辑数据*/
function edit(loanId,productId,personIdnum){
   var url="apply/viewEdit";
	var isf="0";
	 $.ajax({
        url : 'RefusalEntry/isRefusal?loanId='+loanId,
        data : $("#addCarLoanForm").serialize(),
        type:"POST",
        async: false,
        success : function(result){
            if(result=="1"){
            	isf="1";
            	url="RefusalEntry/viewEdit";  
            }
        }
 });
	
	$.ajax({	        
	        url: url,
	        type : "POST",
	        dataType:"json",
	        data: {	  
	        	 loanId:loanId,
	             productId:productId,
	             idnum:personIdnum
	        },
	        success:function(loanDetailsVo){
	        		_step=1;
						//编辑小企业贷
						if(loanDetailsVo.productTypeId==1){
							//隐藏上一步，提交按钮
							$("#addTable1").show();
							$("#addTable2").hide();
							$("#prevStepBtn").hide();
							$("#submitEditBtn").hide();
			        		$("#nextStepBtn").show();
							var h = $(window).height() ;
							clrearLoanDate();

              commonApplyDataModule_plugin.prototype.loanDetails = loanDetailsVo;
              

              if (5 == loanDetailsVo.productId || loanDetailsVo.productId == 6) 
              return seLoanCityWideLoan('apply/seLoanCityWideLoanModify','编辑小企业同城贷',loanDetailsVo,'Modify','editLoanForm');

							 var url = 'apply/getHtml?'+'productCode='+loanDetailsVo.product.productCode+'&handler='+'Modify';
	   						$('#seLoanModify').dialog({
	   							title: '编辑小企业贷',
	   							closed: false,  
	   							cache: false,
	   							href: url,
	   							modal: true,
	   							onLoad : function(){
                            
                                    loadLoanDate(loanDetailsVo);    
                                    $('#editLoanForm').commonApplyDataModule(loanDetailsVo);
	   							}
							
	   						});			
							
						}
						//编辑车贷
						if(loanDetailsVo.productTypeId==2){
							if(isf=="1"){
								//隐藏上一步，提交按钮
							    var h = $(window).height() ;
							    var url = 'RefusalEntry/toCarLoanUpdate';
		                        $('#carLoanModify').dialog({
		                            title: '编辑拒单录入',
		                            closed: false,  
		                            cache: false,
		                            href: url,
		                            modal: true,
		                            onLoad : function(){
	                                
		                            	$('#editCarLoanForm').commonApplyDataModule(loanDetailsVo);
		                            	loadEditCar1(loanDetailsVo); 
		                    		
		                    		}		
								
							});
								
							}else{
								
							
							//隐藏上一步，提交按钮
							$("#addCarTable1").show();
							$("#addCarTable2").hide();
							$("#addCarTable3").hide();
							$("#prevCarStepBtn").hide();
							$("#addCarLoanBtn").hide();
			        		$("#nextCarStepBtn").show();
						    var h = $(window).height() ;
						    var url = 'apply/carLoanModify';
	                        $('#carLoanModify').dialog({
	                            title: '编辑车贷',
	                            closed: false,  
	                            cache: false,
	                            href: url,
	                            modal: true,
	                            onLoad : function(){
                                
                                $('#editCarLoanForm').commonApplyDataModule(loanDetailsVo);
                                loadEditCar(loanDetailsVo); 
                                debugger;
	                    		loanNewEditCar(loanDetailsVo);//编辑填充新的参数五个
	                    		}		
							
						});}
					
		        }
	        },
	        error:function(data){
		 		 $.messager.show({
						title: 'warning',
						msg: data.responseText
					});
			}
	    });

};

/**提交*/
function submit(loanId,personName,mobilePhoneLoan,personIdnum){
	//校验身份证正反面是否存在
	$.ajax({
        type: "POST",
        url: "apply/getIdNoTwo",
        dataType: "json",
        data: {
            id:loanId
        },
        success: function(message){
           if(message=='success'){
        	   
        	   
        		$.messager.confirm("Confirm", "您确定要提交吗？", function (r) {  
        	        if (r) {
//        	        	 $.ajax({
//		                        type: "POST",
//		                        url: "apply/getlcbzaFraud",
//		                        dataType: "json",
//		                        data: {
//		                            id:loanId,
//		                            personName:personName,
//		                            mobilePhoneLoan:mobilePhoneLoan,
//		                            personIdnum:personIdnum
//		                        },
//		                        success: function(message){
//		        	               
//		                        },
//		                        error:function(){
//		                         
//		                        }
//		                    });
        	        	$.ajax({
        	                type: "POST",
        	                url: "apply/submit",
        	                dataType: "json",
        	                data: {
        	                    id:loanId
        	                },
        	                success: function(message){
        		                if(message=="success"){
        		                    $.messager.show({
        		                        title:'提示',
        		                        msg:'提交成功！',
        		                        showType:'slide'
        		                    });
        		                    $("#addCarlg").dialog('close');
        		                    $("#addlg").dialog('close');
        		                    $("#loanPageTb").datagrid('reload');
        		                    
        		                    //调用捞财宝发起安反欺诈查询
        		                    $.ajax({
        		                        type: "POST",
        		                        url: "apply/getlcbzaFraud",
        		                        dataType: "json",
        		                        data: {
        		                            id:loanId,
                         					personName:personName,
                         					mobilePhoneLoan:mobilePhoneLoan,
                         					personIdnum:personIdnum
        		                        },
        		                        success: function(message){
        		        	               
        		                        },
        		                        error:function(){
        		                         
        		                        }
        		                    });
        		                    
        	                	} else {
        	                		 $.messager.show({
        	 	                        title:'提示',
        	 	                        msg:message,
        	 	                        showType:'slide'
        	 	                    });
        	                	}
        	                },
        	                error:function(){
        	                    $.messager.show({
        	                        title:'提交',
        	                        msg:'提交失败！',
        	                        showType:'slide'
        	                    });
        	                }
        	            });
        	        }
        	    });
        	   
           }else{
        	   $.messager.show({
                   title:'提示',
                   msg:'请上传<<身份证正反面>>!',
                   showType:'slide'
               });
        	   return;
           }
        },
        error:function(){
        	 $.messager.show({
                  title:'提示',
                  msg:message,
                  showType:'slide'
              });
        }
    });
	
};
/**展期提交*/
function extensionSubmit(loanId){
	$.messager.confirm("Confirm", "您确定要提交吗？", function (r) {  
        if (r) {
        	$.ajax({
                type: "POST",
                url: "apply/extensionSubmit",
                dataType: "json",
                data: {
                    id:loanId
                },
                success: function(message){
	                if(message=="success"){
	                    $.messager.show({
	                        title:'提示',
	                        msg:'提交成功！',
	                        showType:'slide'
	                    });
	                    $("#addCarlg").dialog('close');
	                    $("#addlg").dialog('close');
	                    $("#loanPageTb").datagrid('reload');
                	} else {
                		 $.messager.show({
 	                        title:'提示',
 	                        msg:message,
 	                        showType:'slide'
 	                    });
                	}
                },
                error:function(){
                    $.messager.show({
                        title:'提交',
                        msg:'提交失败！',
                        showType:'slide'
                    });
                }
            });
        }
    });
};
//借款取消
function cancelLoan(loanId) {
	//$.messager.confirm("Confirm", "确定取消借款?", function (r) {  
		//if (r) {
			//打开弹出框
			$('#showLoanCancelSelect').window('open');
			$('#displayLoanId').val(loanId);
		//}
	//});
}


//保存
function canCelSaveButton(){
	var LoanCancelSelect=$('#LoanCancelSelect').combobox('getValue');
	if(LoanCancelSelect==null||LoanCancelSelect==''){
		$.messager.show({
			title:'提示',
			msg:'请填写取消原因',
			showType:'slide'
		});
		return;
	}
	var loanId=$('#displayLoanId').val();
	var textareabeizhu=$('#textareabeizhu').val();
	$.ajax({
        type: "POST",
        url: "apply/lcbJudgePushStandard",
        dataType: "json",
        data: {
        	loanId:loanId,
        	LoanCancelSelect:LoanCancelSelect
        },
        success: function(message){
        	$('#showLoanCancelSelect').window('close');
        	$('#LoanCancelSelect').combobox('clear');
        	$('#textareabeizhu').val('');
            if(message.repCode=="000000"){
    			$.ajax({
				type: "POST",
				url: "apply/cancelLoan",
				dataType: "json",
				data: {
					loanId:loanId,
					LoanCancelSelect:LoanCancelSelect,
					beizhu:textareabeizhu
				},
				success: function(message){
					if(message=="success"){
						$.messager.show({
							title:'提示',
							msg:'取消成功！',
							showType:'slide'
						});
						$("#loanPageTb").datagrid('reload');
					} else {
						$.messager.show({
							title:'提示',
							msg:message,
							showType:'slide'
						});
					}
				},
				error:function(){
					$.messager.show({
						title:'提交',
						msg:'取消失败！',
						showType:'slide'
					});
				}
			});
        	} else {
        		 $.messager.show({
                     title:'提示',
                     msg:'取消失败',
                     showType:'slide'
                 });
        	}
        },
        error:function(){
            $.messager.show({
                title:'提示',
                msg:'取消失败！',
                showType:'slide'
            });
        }
    });
}


//取消
function canCelCanCelButton(){
	$('#showLoanCancelSelect').window('close');
	$('#LoanCancelSelect').combobox('clear');
	$('#textareabeizhu').val('');
}




// 申请展期
function applyExtension(id,loanId, extensionTime) {
	$.messager.confirm("Confirm", "确定申请展期？", function (r) {  
        if (r) {
        	$.ajax({
                type: "POST",
                url: "apply/applyExtension",
                dataType: "json",
                data: {
                	id : id ,
                    loanId : loanId ,
                    extensionTime : extensionTime
                },
                success: function(result){
	                if(result.isSuccess=="success"){
	                    $.messager.show({
	                        title:'提示',
	                        msg:result.msg,
	                        showType:'slide'
	                    });
	                    $("#addCarlg").dialog('close');
	                    $("#addlg").dialog('close');
	                    $("#loanPageTb").datagrid('reload');
                	} else {
                		 $.messager.show({
 	                        title:'提示',
 	                        msg:result.msg,
 	                        showType:'slide'
 	                    });
                	}
                },
                error:function(){
                    $.messager.show({
                        title:'提交',
                        msg:'申请失败！',
                        showType:'slide'
                    });
                }
            });
        }
    });
}



// 提交操作时间时间
function formatDate(val) {
    return $.mFuc.dateD(val);
};
// 操作
function formatAction(val,row,index) {
    var url="vehicleListEdit.html";
    return '<img src="/resources/static2/css/icons/cut.png" onclick="assignRoles()" title="分配角色" />&nbsp;<img src="/resources/static2/css/icons/pencil.png" onclick="window.open(\''+url+'\',\'\',\'scrollbars=yes,width=800,height=600,left='+($.mFuc.winW()-800)/2+',top='+($.mFuc.winH()-700)/2+'\')" title="编辑" />&nbsp;<img src="/resources/static2/css/icons/cancel.png" onclick="removeRecord('+index+')" title="删除" />';
};

// 弹出借款类型窗口
function addRecord() {
    
	$('#dlg').dialog('open').dialog('setTitle', '选择借款类型');
	 $("#dlg").find("#idnum").val("");
	 	// 借款类型下拉框
         var _mkid = $('#dlg #productComb2').combobox({
             url: 'apply/getLoanType',
             editable: false,
             valueField:'productType',
             textField:'productTypeName',
             onSelect: function (value) {
                 _zhbid.combobox({
                	 editable: false,
                     url: 'apply/getProducts',
                 	valueField:'id',
        			textField:'productName'
                 });
             }
         });
         // 产品类型下拉框
         var _zhbid = $('#dlg #productType').combobox({
 			valueField:'id',
			textField:'productName'
         });
	 
    $("#alg").find("#loanType").val($("#dlg").find("#productComb2").combobox('getValue'));
    $("#alg").find("#idnum").val($("#dlg").find("#idnum").val());
};
//弹出借款类型窗口
function upAlg() {
    $('#dlg').dialog('close');
    $('#alg').dialog('open').dialog('setTitle', '');
};
function closeAlg(){
    $('#alg').dialog('close');
}
//点击确认后跳转到新增页面
function next() {
	var idnum = $("#dlg").find("#idnum").val();
	var type = $("#dlg").find("#productComb2").combobox('getValue');
	var proType = $("#dlg").find("#productType").combobox('getValue');
	if(type==''||type==null||type==undefined){
		 $.messager.show({
				title: 'warning',
				msg: '请选择借款类型'
			});
		return false;
	}
	if(type==2 && (proType==''||proType==null||proType==undefined)){
		 $.messager.show({
				title: 'warning',
				msg: '请选择产品类型'
			});
		return false;
	}
	if(idnum==''||idnum==null||idnum==undefined){
		 $.messager.show({
				title: 'warning',
				msg: '请输入身份证号码'
			});
		return false;
	}	
	 if(!$("#newLoanForm").form('validate')){
	        return false;
	    }
    $('#dlg').dialog('close');
    $.ajax({
        url : "apply/findUserByIdnum",
        data : $("#newLoanForm").serialize(),
        type : "POST",
        dataType:"JSON",
        success : function(loanDetailsVo){
            if(loanDetailsVo.personType=='新客户'  && typeof(loanDetailsVo.refuseReason) == "undefined"){
                $("#alg").find("#productId").val(loanDetailsVo.productId);
                $("#alg").find("#loanType").val(loanDetailsVo.loanType);
                $("#alg").find("#idnum").val(loanDetailsVo.idnum);
                $("#alg").find("#personType").val(loanDetailsVo.personType);
                $("#alg").find("#productTypeId").val(loanDetailsVo.productTypeId);
                nexts();
            }else{
                $('#alg').dialog('open').dialog('setTitle','提示信息');
                $("#alg").find("#productId").val(loanDetailsVo.productId);
                $("#alg").find("#loanType").val(loanDetailsVo.loanType);
                $("#alg").find("#idnum").val(loanDetailsVo.idnum);
                $("#alg").find("#personType").val(loanDetailsVo.personType);
                $("#alg").find("#productTypeId").val(loanDetailsVo.productTypeId);
                if(typeof(loanDetailsVo.refuseReason) != "undefined")
                {
                	$('#refuseReason').text(loanDetailsVo.refuseReason);
                }
            }
        },
	    error:function(data){
	 		 $.messager.show({
					title: 'warning',
					msg: data.responseText
				});
		}
    });

}


//清空小企业数据
function clrearLoanDate(){
	$('#editLoanForm :input').val('');

}
//清空车贷页面上的数据
function clearCarLoanDate(){

	$('#editCarLoanForm :input').val('');
}
//点击确认后跳转到新增页面
function nexts() {
	
	$('#dlg-buttons').remove();
	$('#addSeLoanForm').remove();
	 $.ajax({
		  url : "apply/viewEdit",
			data : $("#addLoanForm").serialize(),
			type : "POST",
		   dataType:"JSON",
		   success : function(loanDetailsVo){
        commonApplyDataModule_plugin.prototype.loanDetails = loanDetailsVo;
			   $("#alg").dialog('close');	
				//新增
				if(loanDetailsVo.personType=='新客户'){
					//新增小企业贷款
					if(loanDetailsVo.productTypeId==1){
                        _step = 1;
                        $("#addTable2").hide();
                        $("#prevStepBtn").hide();
                        $("#submitEditBtn").hide();
                        $("#nextStepBtn").show();
                        $(".addTable").hide();
                        $("#addTable1").show();
                       
   					    var h = $(window).height() ;
   						clrearLoanDate();
			//			$('#addlg').dialog({modal:true,height:h*(0.8)}).dialog('open').dialog('setTitle','新增小企业贷');	
            if (5 == loanDetailsVo.productId || loanDetailsVo.productId == 6) 
            return seLoanCityWideLoan('apply/seLoanCityWideLoanAdd','新增小企业同城贷',loanDetailsVo,"Add",'addSeLoanForm');
					
          	 var url = 'apply/getHtml?'+'productCode='+loanDetailsVo.product.productCode+'&handler='+'Add';
   						$('#seLoanAdd').dialog({
   							title: '新增小企业贷',
   							closed: false,  
   							cache: false,
   							href: url,
   							modal: true,
   							maximizable:true,
   							onLoad : function(){
                
                                  loadAddData(loanDetailsVo);   
                                $("#addSeLoanForm").commonApplyDataModule(loanDetailsVo);  								
   							}
						
   						});		
						
					}//新增车贷 
					if(loanDetailsVo.productTypeId==2){
						 var h = $(window).height() ;
                        _step = 1;
                        $("#prevCarStepBtn").hide();
                        $("#addCarLoanBtn").hide();
                        $("#nextCarStepBtn").show();
                        $(".addCarTable").hide();
                        $("#addCarTable1").show();
                        clearCarLoanDate();
                        
                        var url = 'apply/carLoanAdd';
                        $('#carLoanAdd').dialog({
                            title: '新增车贷',
                            closed: false,  
                            cache: false,
                            href: url,
                            modal: true,
                            onLoad : function(){
                              $("#addCarLoanForm").commonApplyDataModule(loanDetailsVo);                            	
                            
                            	 loadAddCarLoanData(loanDetailsVo);	
                    		}
                        });  
						 				
						
					}

					
					
				}else{//老客户
					//老客户小企业贷
					if(loanDetailsVo.productTypeId==1){
						var h = $(window).height() ;
				//		$('#addlg').dialog({modal:true,height:h*(0.8)}).dialog('open').dialog('setTitle','编辑 小企业贷');
            if (5 == loanDetailsVo.productId || loanDetailsVo.productId == 6) 
            return seLoanCityWideLoan('apply/seLoanCityWideLoanAdd','新增小企业同城贷',loanDetailsVo,"Add",'addSeLoanForm');
						 var url = 'apply/getHtml?'+'productCode='+loanDetailsVo.product.productCode+'&handler='+'Add';
   						$('#seLoanAdd').dialog({
   							title: '新增小企业贷',
   							closed: false,  
   							cache: false,
   							href: url,
   							modal: true,
   							onLoad : function(){
                            
                                   loadOldData(loanDetailsVo);
                                    $("#addSeLoanForm").commonApplyDataModule(loanDetailsVo);
   							}
						
   						});	
											
					}
					//老客户车贷
					if(loanDetailsVo.productTypeId==2){
					    var h = $(window).height() ;
					    var url = 'apply/carLoanAdd';
                        $('#carLoanAdd').dialog({
                            title: '新增车贷',
                            closed: false,  
                            cache: false,
                            href: url,
                            modal: true,
                            onLoad : function(){
                                
                                loadOldCarLoanData(loanDetailsVo);              
                                $("#addCarLoanForm").commonApplyDataModule(loanDetailsVo);
                    		}
                        });  
							
						
					}
					
				}
	        }
		});	
}



/*function dateformat(date) {
  var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var mints = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var sec = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + mints + ":" + sec;
}*/

//取消
function cancel() {
    $('#dlg').dialog('close');

};
//关闭页面
function cloae() {
    $('#alg').dialog('close');

};
//打开申请贷款页面
function addVehicle() {
    $('#newLoanForm').submit();
}
// 分配角色
function assignRoles() {
    parent.$('<div/>').dialog({
        href : 'assignRoles.html',
        width : 500,
        height : 370,
        modal : true,
        title : '分配角色',
        buttons : [{
            text : '分配',
            iconCls : 'icon-ok',
            handler : function() {
                var d = parent.$(this).closest('.window-body');
                d.dialog('destroy');
                parent.$.messager.show({
                    title : '提示',
                    msg : '分配成功！'
                });
            }
        },{
            text : '取消',
            iconCls : 'icon-cancel',
            handler : function() {
                var d = parent.$(this).closest('.window-body');
                d.dialog('destroy');
            }
        }],
        onClose : function() {
            parent.$(this).dialog('destroy');
        }
    });
};
// 删除记录
function removeRecord(index) {
    $('#addRecord_datagrid').datagrid('uncheckAll').datagrid('unselectAll').datagrid('checkRow', index);
    batchRemoveRecord();
    $('#addRecord_datagrid').datagrid('uncheckAll').datagrid('unselectAll');
};
// 操作
function formatAction1(val, row, index) {
    var url = 'userInfoPerson.html';
    var html = [];
    html.push('<img title="编辑" src="/resources/css/icons/pencil.png" onclick="window.open(\''+url+'\',\'\',\'scrollbars=yes,width=800,height=600,left='+($.mFuc.winW()-800)/2+',top='+($.mFuc.winH()-700)/2+'\')" />');
    html.push('&nbsp;<img title="删除" src="/resources/css/icons/cancel.png" onclick="removeRecord('+index+')" />');
    htmlString = html.join('');
    return htmlString;
};

// 清空搜索
function clearSearch() {
    $('#list_result').datagrid('load',{});
    $('#list_search').searchbox('setValue','');
};
;var commonApplyDataModule_plugin = function ($) {

    var dataTag = 'commonApplyDataModule';

    function initialize(pageData,self) {
      loadSales(pageData,self);   
      
    };


    function loadSales (pageData,form) {
        // 营业网点及相应客户经理加载
        $(form).find('#salesDeptId').combobox({
              url:'apply/getSalesDeptsInCurCity',
              valueField:'id',
              textField:'name',
              onLoadSuccess:function(){
                  var data = $(this).combobox('getData');
                  if(data.length>0){
                      $(this).combobox('select', data[0].id);
                    
                  }
                  if(pageData.salesDept && pageData.salesDept.id){
                     $(this).combobox('select', pageData.salesDept.id);
                  }
              },
              onSelect:function(newVal, oldVal){ 
               $(form).find( '#managerName').combobox({     
                  url:'apply/getCrmsInSalesDeptByProductIdAndSalesDeptId',
                    valueField:'id',
                    textField:'name',
                    onBeforeLoad: function(param){                              
                      param.productId = pageData.productId;  
                      param.salesDeptId = newVal.id;
                      if($(form).find('#organID').length>0){
                        param.organID = $(form).find('#organID').combobox('getValue');

                      }
                    },
                    onLoadSuccess:function(){
                        if(pageData.loanId){
                             $(this).combobox('select', pageData.crm.id);
                         }else{
                            var data = $(this).combobox('getData');
                            if(data.length>0)
                              $(this).combobox('select', data[0].id);

                         }
                      },
                      onSelect:function(newVal, oldVal){                      

                         $(form).find('#crmId').val(newVal.id);
                      }
                }); 
            }
          });
        
        //复核人员
        $(form).find('#assessorName').combobox({
          url:'apply/getServicesInCurSalesDeptByProductId',
          valueField:'id',
          textField:'name',
          editable:false ,
          onBeforeLoad: function(param){                  
            param.productId = pageData.productId;  
            if(pageData.service){
              param.userId =  pageData.service.id;
            }              
          },
          onLoadSuccess:function(){
           if(pageData.assessor){
              $(this).combobox('select', pageData.assessor.id);
            }else{
              var data = $(this).combobox('getData');
              if(data.length>0 && pageData.service.id != data[0].id ){
            	  $(this).combobox('select', data[0].id);
              }else if (data.length>0 && pageData.productId == 8) {
                 $(this).combobox('select', data[0].id);
              };
              
            }
          },
          onSelect:function(newVal, oldVal) {
        	  
        	 /* if(newVal.id == $(form).find('#serviceId').val() &&  pageData.productId != 8){
                  $.messager.show({
                       title:'提示',
                       msg:'复核人员和客服不可以是同一人',
                       showType:'slide'
                   });
                  $(this).combobox('unselect', newVal.id);
                  return false;
                 
               }*/

            $(form).find('#assessorId').val(newVal.id);
          }
        });  
      //业务主任
        $(form).find('#bizNameEdit').combobox({
          url:'RefusalEntry/getBizDirectorByUserEdit',
          valueField:'id',
          textField:'name',
          editable:false ,
          onBeforeLoad: function(param){                  
            param.productId = pageData.productId;  
            param.bizId = pageData.director.id; 
            if(pageData.service){
              param.userId =  pageData.service.id;
            }              
          },
          onLoadSuccess:function(){
           if(pageData.assessor){
              $(this).combobox('select', pageData.assessor.id);
            }else{
              var data = $(this).combobox('getData');
              if(data.length>0 && pageData.service.id != data[0].id ){
            	  $(this).combobox('select', data[0].id);
              }else if (data.length>0 && pageData.productId == 8) {
                 $(this).combobox('select', data[0].id);
              };
              
            }
          },
          onSelect:function(newVal, oldVal) {
        	  
        	  

            $(form).find('#bizDirectorId').val(newVal.id);
          }
        });  
    } 

    var methods = {
        init: function (pageData, nav) {
            this.data(dataTag, pageData);
            initialize(pageData,this);

            return this;
        }
    };
    $.fn.commonApplyDataModule = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.instance_detail' );
        }
    };
};
commonApplyDataModule_plugin.prototype = {};
commonApplyDataModule_plugin(jQuery);


function showExtensionLoanLedgerApplyBase(value,row,index){
	if( row.extensionTime==0)
	{
		return '<a style="font-weight:bolder;color:blue;" href="javascript:void(0)" onclick="showLoanLedger('+row.id+')">'+row.product.productTypeName+'</a>';
	}
	else
	{
		
		return '<a style="font-weight:bolder;color:blue;" href="javascript:void(0)" onclick="showLoanExtensionLedger('+row.id+')">'+row.product.productTypeName+'</a>';
	}
}

function downloadAttachment(contractNo) {
	self.location.href= rayUseUrl+"apply/downloadAttachment?contractNo="+contractNo;

}
function ecifTrans (data) {


          $.ajax({
           url : 'ecif/insertCustomer',
           data : data,
           type:"POST",
           success : function(result){
             
           },
           error:function(data){
                 
           }
    }); 

}

//签约补充资料
function signAddFile(loanId,extensionTime){
	if(extensionTime==0)
	{
		window.open (rayUseUrl+"audit/contract/imageUploadView/"+loanId,"newwindow","toolbar=yes,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,fullscreen=3");
	}
	else
	{
		window.open (rayUseUrl+"audit/contract/extensionImageUploadView/"+loanId,"newwindow","toolbar=yes,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,fullscreen=3");
	}
}
