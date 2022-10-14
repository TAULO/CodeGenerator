$(function() {	
	
	if(userType==8){//只有财务才显示导入导出按钮			
		// 导出认领结果按钮
		$('#export').show();
		$('#exportReceiveResultBt').linkbutton("enable");
		$('#exportExcelBt').linkbutton("enable");
		$('#exportReceiveResultBt').bind('click', exportReceiveResult);
		$('#exportExcelBt').bind('click', openUploadFileDLG);
	}else{
		$('#exportReceiveResultBt').linkbutton("disable");
		$('#exportExcelBt').linkbutton("disable");
		$('#export').hide();
	}
	if(userType==8||userType==1){//只有财务才显示导入导出按钮			
		// 导出认领结果按钮
		$('#recTimeBt').show();
		$('#changeRecBt').linkbutton("enable");
		$('#changeRecBt').bind('click', changeRecTime);
	}else{
		$('#changeRecBt').linkbutton("disable");
		$('#recTimeBt').hide();
	}
	
	
	
	
	//默认状态为未认领
	$('#status').combobox('setValue', 20);
	$('#businessAccountPanel').window('close');
	$('#recTimePanel').window('close');
	
	$('.commonCloseBut').click(function(){
		$(this).parents('div .easyui-window').window('close');
	});
	//设置开始时间为当天 0时0分0秒到24点 
	/*var startDate = new Date();
	var start = startDate.getFullYear() + "-" + (startDate.getMonth() + 1)
			+ "-" + startDate.getDate()+ " 00:00:00" ;
	
	var nowDate = startDate.getFullYear() + "-" + (startDate.getMonth() + 1)
	+ "-" + startDate.getDate();
	$('#repayDateInput').val(nowDate);
	
	
	$('#recTimeStart').val(start);
	var end = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-"
			+ startDate.getDate()+ " 23:59:59" ;
	$('#recTimeEnd').val(end);*/
	
	// 列表
	$('#list_result').datagrid({
		url : 'after/businessAccount/getBusinessAccountPage',
		fitColumns : true,
		border : false,
		singleSelect : true,
		pagination : true,
		striped : true,
		pageSize : 10,
		rownumbers : true,
		fit:true,
		columns : [ [
		
		{
			field : 'repayDate',
			title : '交易日期',
			formatter : function(value, row, index) {
				return row.repayDate.substr(0, 10);	
			//	return row.repayDate;
			}
		}, {
			field : 'repayTime',
			title : '交易时间'
		}, {
			field : 'recTime',
			title : '认领时间'
		},{
			field : 'loginName',
			title : '认领者工号' ,
			formatter : function(value, row, index) {
				if(row.sysUser){
					return row.sysUser.loginName;
				}else {					
					return null;
				}
								
			}
		},{
			field : 'personName',
			title : '借款人名字'
		},{
			field : 'firstAccount',
			title : '本方账号'
		}, {
			field : 'secondAccount',
			title : '对方账号'

		}, {
			field : 'type',
			title : '借贷',formatter : function(value, row, index) {					
				return formatEnumName(value,'BORROW_OR_LOAN');
			}
		}, {
			field : 'amount',
			title : '还款金额', formatter : function (value, row, index) {
            	if(value!=null){
  					 return  value.toFixed(2);//保留两位小数
               	}else{
               		return value;
               	}
               }
		}, {
			field : 'secondCompany',
			title : '对方单位'
		}, {
			field : 'voucherNo',
			title : '凭证号'
		}, {
			field : 'secondBank',
			title : '对方行号'
		}, {
			field : 'remark',
			title : '摘要'
		}, {
			field : 'purpose',
			title : '用途'

		}, {
			field : 'comments',
			title : '附言'
		}, {
			field : 'status',
			title : '状态',formatter : function(value, row, index) {				
				return formatEnumName(value,'BUSINESS_ACCOUNT_STATUS');
			}
		}, {
			field : 'id',
			title : '操作',
			formatter:formatOperations,width : 160
		} ] ]
	});
	// 设置分页控件
	var p = $('#list_result').datagrid('getPager');
	$(p).pagination({
		pageList : [ 10, 20, 50 ]
	});
	// 查询按钮
	$('#searchBt').bind('click', search);
	// 返回按钮
	$('#backBt').bind('click', back);
	// 领取列表里的查询按钮
	$('#receiveSearchBt').bind('click', receiveSearch);	
	//按Enter键查询
	$(document).keydown(function(e) {
		if (e.which == 13){	
			//如果打开领取列表,查询领取列表
			if($("#receiveGrid").is(":visible")==true){
				$('#receiveSearchBt').click();
			}else{
				$('#searchBt').click();
			}			
		}
	});
});
//操作显示
// 打开上传文件窗口
function openUploadFileDLG() {
	$("#fileName").val('');
	$('#fileUploadDialog').dialog('open').dialog('setTitle', '批量导入');
	$('#fileUploadForm').form('clear');
}

function ajaxFileUpload(saveBtn) {
	$.ajaxFileUpload({
        url: 'after/businessAccount/upload', //用于文件上传的服务器端请求地址
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: 'file', //文件上传域的ID    
        dataType: "json",
        async:false,
        success: function (data)  //服务器成功响应处理函数
        {
        	$.messager.show({
				title: 'warning',
				msg: data.responseText
			});
	        },  
	       error:function(data){
	 		 $.messager.show({
					title: 'warning',
					msg: data.responseText,
					timeout: 0
				});
	   }
  });

	$('#fileUploadDialog').dialog('close');
	$("#list_result").datagrid('reload');
}

function formatOperations(value,row,index){
	var operations = '';
	var status = row.status;//状态
	var loanProductType= null;
	var salesDeptId = null;
	if(row.loan){
		 loanProductType= row.loan.productType;
		 salesDeptId = row.loan.salesDeptId;
	}
	
	
	var recOperatorId =  row.recOperatorId;//认领人
	var  modifierId = row.modifierId;
	if(userType == 6 || userType == 7 || userType == 11){//客服 .审核.贷后
		if(status==20){//未认领
			operations += '<a href="javascript:void(0)" onclick="toReceiveList(\''+row.repayDate+'\',\''+row.repayTime+'\','+row.status+','+row.amount+','+row.id+','+row.version+',\''+row.secondCompany+'\')">领取 </a>&nbsp;&nbsp;';
		}else if((status==10||status==50||status==60)&&loginUserId == recOperatorId){//已认领
			operations += '<a href="javascript:void(0)" onclick="undo(\''+row.repayDate+'\',\''+row.repayTime+'\','+row.id+','+row.amount+',\''+row.secondCompany+'\')">撤销 &nbsp;&nbsp;</a>';
		}	

	}else if(userType==2||userType==3){//经理 副理
	//请勿删除，测试时使用 	alert("status  "+status+"productId "+productId +"productType " +productType+"salesDeptId "+salesDeptId +"salesDept "+salesDept);
		if(status==20){//未认领
			operations += '<a href="javascript:void(0)" onclick="toReceiveList(\''+row.repayDate+'\',\''+row.repayTime+'\','+row.status+','+row.amount+','+row.id+','+row.version+',\''+row.secondCompany+'\')">领取 </a>&nbsp;&nbsp;';
		}else if((status==10||status==50||status==60)&&(loanProductType == productType)&& checkSalesDept(salesDeptId)){//已认领
			 operations += '<a href="javascript:void(0)" onclick="undo(\''+row.repayDate+'\',\''+row.repayTime+'\','+row.id+','+row.amount+',\''+row.secondCompany+'\')">撤销 &nbsp;&nbsp;</a>';
		}	

	}else if(userType==8){//财务
		if(status==20){//未认领
			operations += '<a href="javascript:void(0)" onclick="noReceive(\''+row.repayDate+'\',\''+row.repayTime+'\','+row.id+','+row.amount+',\''+row.secondCompany+'\')">无需认领 &nbsp;&nbsp;</a>';
		}else if(status==40&&loginUserId==modifierId){// 无需认领
			operations += '<a href="javascript:void(0)" onclick="financeUndo(\''+row.repayDate+'\',\''+row.repayTime+'\','+row.id+','+row.amount+',\''+row.secondCompany+'\')">撤销 &nbsp;&nbsp;</a>';
		}
	}else if(userType==1){//admin
		operations += '<a href="javascript:void(0)" onclick="loadBusinessAccountToWindow('+row.id + ')">编辑 &nbsp;&nbsp;</a>';
		operations += '<a href="javascript:void(0)" onclick="deleteBusinessAccount('+row.id + ')">删除 &nbsp;&nbsp;</a>';
	}
	
	operations += '<a href="javascript:void(0)" onclick="toLogList('+row.id + ')">日志</a>';
	return operations;
};
//点击返回按钮
function back(){	
	$('#receiveGrid').dialog('close');	
}


//删除对公还款
function deleteBusinessAccount(id){
	 parent.$.messager.confirm('确认', '您确定修改吗?', function(r) {
			if (r) {
				$.ajax({
					url : 'after/businessAccount/deleteBusinessAccountById',
					data :{
						id : id,
					},
					type:"POST",
					success : function(result){
						if(result.isSuccess){
							$.messager.show({
								title : '提示',
								msg : '删除成功'
							});
							$("#list_result").datagrid('reload');
						}else{
							$.messager.show({
								title : '提示',
								msg : result.msg
							});  
							$("#list_result").datagrid('reload');
						}
			  
					},
					error:function(data){
						$.messager.show({
						title: 'warning',
						msg: data.msg
					});
		   		}
	  		});
		}
	 });
}


function changeRecTime(){
	$.ajax({
		url : 'after/businessAccount/getRecTime',
		type:'POST',
		success : function(result){
			if (result.isSuccess) {
				$('#recTimePanel').window({
//					width:300,
					modal:true
				});
				$('#recTimeEditForm').form('clear');
				$('#recTimeEditForm').form('load', result.businessAccount);
			} else {
				$.messager.alert('操作提示', result.msg,'error');
			}
		},
		error:function(data){
			$.messager.alert('操作提示', 'error','error');
		}
	});
}


function doSaveRecTime(){
	 parent.$.messager.confirm('确认', '您确定修改吗?', function(r) {
			if (r) {
				$.ajax({
					url : 'after/businessAccount/editRecTime',
					data :		$('#recTimeEditForm').serialize(),
					type:"POST",
					success : function(result){
						if(result.isSuccess){
							$.messager.show({
								title : '提示',
								msg : '编辑成功'
							});
							$("#list_result").datagrid('reload');
							$('#recTimePanel').window('close');
						}else{
							$.messager.show({
								title : '提示',
								msg : result.msg
							});  
							$("#list_result").datagrid('reload');
							$('#recTimePanel').window('close');
						}
			  
					},
					error:function(data){
						$.messager.show({
						title: 'warning',
						msg: data.msg
					});
		   		}
	  		});
		}
	});
}

//加载对公还款信息填充到表单
function loadBusinessAccountToWindow (id) {
	$.ajax({
		url : 'after/businessAccount/getBusinessAccountById',
		data : {
			id : id						
		},
		type:'POST',
		success : function(result){
			if (result.isSuccess) {
				$('#businessAccountPanel').window({
//					width:300,
					modal:true
				});
				$('#businessAccountEditForm').form('clear');
				$('#businessAccountEditForm').form('load', result.businessAccount);
				$('#repayDateEdit').val(result.businessAccount.repayDate.substring(0,10));
			} else {
				$.messager.alert('操作提示', result.msg,'error');
			}
		},
		error:function(data){
			$.messager.alert('操作提示', 'error','error');
		}
	});
}

function doSavebusinessAccountInfo(){
	 parent.$.messager.confirm('确认', '您确定修改吗?', function(r) {
			if (r) {
				$.ajax({
					url : 'after/businessAccount/editBusinessAccount',
					data :{
						id :  $('#idEdit').val(),
						repayDate:$('#repayDateEdit').val()+" 00:00:00",
						repayTime:$('#repayTimeEdit').val(),
						secondCompany: $('#secondCompanyEdit').val(),
						amount: $('#amountEdit').val()	,
						secondAccount: $('#secondAccountEdit').val(),
						status: $('#statusEdit').combobox('getValue')
					},
					type:"POST",
					success : function(result){
						if(result.isSuccess){
							$.messager.show({
								title : '提示',
								msg : '编辑成功'
							});
							$("#list_result").datagrid('reload');
							$('#businessAccountPanel').window('close');
						}else{
							$.messager.show({
								title : '提示',
								msg : result.msg
							});  
							$("#list_result").datagrid('reload');
							$('#businessAccountPanel').window('close');
						}
			  
					},
					error:function(data){
						$.messager.show({
						title: 'warning',
						msg: data.msg
					});
		   		}
	  		});
		}
	});
}




//检查借款的网点是否在用户的权限里
function checkSalesDept(salesDeptId){
	var salesDeptArray = eval(salesDept);   
	for(var i=0; i<salesDeptArray.length; i++){
	    var tempSalesDept =salesDeptArray[i];
		if(tempSalesDept==salesDeptId){
			return true;
		}
	}
	return false;
}
//撤销
function undo(repayDate,repayTime,id,amount,secondCompany){
	 if(secondCompany=="undefined")
	 {
		 secondCompany='';
	 }
	 parent.$.messager.confirm('确认', '您确定撤掉吗?', function(r) {
			if (r) {
				$.ajax({
					url : 'after/businessAccount/undo',
					data : {
						id : id,
						repayDate:repayDate,
						repayTime:repayTime,
						secondCompany:secondCompany,
						amount:amount						
					},
					type:"POST",
					success : function(result){
						if(result=='success'){
							$.messager.show({
								title : '提示',
								msg : '撤销成功'
							});
							$("#list_result").datagrid('reload');
						}else{
							$.messager.show({
								title : '提示',
								msg : result
							});  
							$("#list_result").datagrid('reload');
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
	});
}
//财务撤销
function financeUndo(repayDate,repayTime,id,amount,secondCompany){
	 parent.$.messager.confirm('确认', '您确定撤掉吗?', function(r) {
			if (r) {
				$.ajax({
					url : 'after/businessAccount/financeUndo',
					data : {
						id : id,
						repayDate:repayDate,
						repayTime:repayTime,
						secondCompany:secondCompany,
						amount:amount
						
					},
					type:"POST",
					success : function(result){

						if(result=='success'){
							$.messager.show({
								title : '提示',
								msg : '撤销成功'
							});
							$("#list_result").datagrid('reload');
						}else{
							$.messager.show({
								title : '提示',
								msg : result
							});  
							$("#list_result").datagrid('reload');
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
		});
}
//无需认领
function noReceive(repayDate,repayTime,id,amount,secondCompany){
	 parent.$.messager.confirm('确认', '您确定无需认领吗?', function(r) {
			if (r) {
				$.ajax({
					url : 'after/businessAccount/noReceive',
					data : {
						id : id,
						repayDate:repayDate,
						repayTime:repayTime,
						secondCompany:secondCompany,
						amount:amount
					},
					type:"POST",
					success : function(result){

						if(result=='success'){
							$.messager.show({
								title : '提示',
								msg : '无需认领成功'
							});
							$("#list_result").datagrid('reload');
						}else{
							$.messager.show({
								title : '提示',
								msg : result
							});  
							$("#list_result").datagrid('reload');
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
		});

}
//导出认领结果excel
function  exportReceiveResult(){
	   $.ajax({
		   url : 'after/businessAccount/checkExportReceiveDataLocal',		   
		   type:"POST",
		   dataType: "json",
		   success : function(result){
			   if(result=='success'){
				  var url2=rayUseUrl+'after/businessAccount/exportReceiveDataLocal';
				   self.location.href=url2;	
				   $("#list_result").datagrid('reload');
			   }else{
				   $.messager.show({
							title : '提示',
							msg : result
				   });
				    return false; 				 
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
//日志列表
function toLogList(id){
	$('#logGrid').dialog('open').dialog('setTitle', '日志列表');	
	$('#log_result').datagrid({
 		url : 'after/businessAccount/getLogsPage?keyId='+id,
		fitColumns : true,
		border : false,
		singleSelect : false,
		pagination : true,
		striped : true,
		pageSize : 10,
		rownumbers : true,
		selectOnCheck : true,
		columns : [ [
		{
			field : 'creator',
			title : '操作者'
		}, {
			field : 'createdTime',
			title : '操作时间'
		}, {
			field : 'message',
			title : '日志内容',
			width:200
		} ] ]
	});
	// 设置分页控件
	var p = $('#log_result').datagrid('getPager');
	$(p).pagination({
		pageList : [ 10, 20, 50 ]
	});
}
//跳转到领取列表
function toReceiveList(repayDate,repay_Time,row_status,amounts,row_id,row_version,rows_secondCompany) {
//	var rows = $('#list_result').datagrid('getSelections');	
	var repay= repayDate.substr(0, 10);
	var repayTime= repay_Time;
	var status = formatEnumName(row_status,'BUSINESS_ACCOUNT_STATUS');
	var amount = amounts;
	var id=row_id;
	var version =row_version;
	//对方单位
	var secondCompany = rows_secondCompany;
    $.ajax({
		   url : 'after/businessAccount/toReceiveList',		   
		   type:"POST",
		   data : {
				id : id				
			},
		   success : function(result){
			   if(result=='success'){
				 //加载领取列表
				   loadReceiveList();
				  $('#repayDateLabel').text("交易日期:  "+repay);				   
				   $('#statusLabel').text("状态：   "+status);
				   $('#amoutLabel').text("还款金额：    "+amount.toFixed(2));				   
				   
				   $('#repayDate').val(repay);				   
				   $('#repayTime').val(repayTime);
				   $('#businessAccountId').val(id);
				   
				   $('#version').val(version);
				   $('#secondCompany').val(secondCompany);
				   $('#amountInput').val(amount);
				   
			   }else{
				   $.messager.show({
							title : '提示',
							msg : result
				   });
				    return false; 				 
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
//加载领取列表
function loadReceiveList(){
	$('#receiveGrid').dialog('open').dialog('setTitle', '领取列表');
	   $('#receivebar #productComb').combobox({
        url:'apply/getProductType',
        valueField:'id',
        textField:'productName',
        onLoadSuccess:function(){
            var data = $(this).combobox('getData');
            if(data.length==1)
                $(this).combobox('select', data[0].productType);
            userProductType = data[0].productType;
        }
    });
		$('#receive_result').datagrid({
//			url : 'after/businessAccount/getReceivePage', 这里不需要url
			fitColumns : true,
			border : false,
			singleSelect : false,
			pagination : true,
			striped : true,
			pageSize : 10,
			rownumbers : true,
			selectOnCheck : true,
			columns : [ [
			{
				field : 'personName',
				title : '借款人',
				formatter : function(value, row, index) {
					if(row.extensionTime==0)
					{
						return '<a style="font-weight:bolder" href="javascript:void(0)" onclick="toLoanDetail('+row.id+ ',' + row.productType  +  ')">' + row.person.name + '</a>';
					}
					else
					{
						return '<a style="font-weight:bolder" href="javascript:void(0)" onclick="toLoanExtensionDetail('+row.id+')">' + row.person.name + '</a>';
					}
				}
			}, {
				field : 'productType',
				title : '借款类型',
				formatter : function(value, row, index) {
					if(row.productType==1){
						return '小企业贷';
					}else if(row.productType==2){
						return '车贷';
					}					
				}
			},
			
			{field : 'productId',title : '产品类型',formatter: function(value, row, index){
				return  formatEnumName(value,'PRODUCT_ID');
				}
			},
			{
				field : 'crmName',
				title : '客户经理',
				formatter : function(value, row, index) {
					return row.crm.name;
				}
			},
			{
				field : 'serviceName',
				title : '客服',
				formatter : function(value, row, index) {
					return row.manageService.name;
				}

			}, {
				field : 'idnum',
				title : '身份证号',
				formatter : function(value, row, index) {
					return "****" + row.person.idnum.substr(row.person.idnum.length-6, 6);					
				}
			}, {
				field : 'professionType',
				title : '职业类型',
				formatter : function(value, row, index) {
					return row.person.professionType;
				}
			}, {
				field : 'purpose',
				title : '用途'
			}, {
				field : 'pactMoney',
				title : '合同金额', formatter : function (value, row, index) {
	            	if(value!=null){
	  					 return  value.toFixed(2);//保留两位小数
	               	}else{
	               		return value;
	               	}
	               }
			}, {
				field : 'auditMoney',
				title : '审批金额', formatter : function (value, row, index) {
	            	if(value!=null){
	  					 return  value.toFixed(2);//保留两位小数
	               	}else{
	               		return value;
	               	}
	               }
			}, {
				field : 'auditTime',
				title : '借款期限'
			}, 
			{
				field : 'extensionTime',
				title : '展期期次',
				formatter : function(value, row, index) {
					if(value == 0) {
						return "无";
					} else {
						return value;
					}
				}
			},
			{
				field : 'status',
				title : '状态',formatter : function(value, row, index) {				
					return formatEnumName(value,'LOAN_STATUS');
				}

			}, {
				field : 'id',
				title : '操作',
				formatter:receiveOptions,width : 160
			} ] ]
		});
		// 设置分页控件
		var p = $('#receive_result').datagrid('getPager');
		$(p).pagination({
			pageList : [ 10, 20, 50 ]
		});
	   
}
//领取列表里的操作显示
function receiveOptions(value,row,index){	
		var operations = '';		
		operations += '<a href="javascript:void(0)" onclick="receive('+row.id + ')">领取</a>&nbsp;';		
		return operations;
		
}
//确认领取
function receive(id){

	var loanId= id;	
	
	var  repayDate=$('#repayDate').val()+" 00:00:00";				   
	var repayTime=  $('#repayTime').val();
	var id=  $('#businessAccountId').val();	   
	 var version =   $('#version').val();
	//对方单位
	 var secondCompany =  $('#secondCompany').val();
	 if(secondCompany=="undefined")
	 {
		 secondCompany='';
	 }
	 var amount =  $('#amountInput').val();
	 parent.$.messager.confirm('确认', '您确定领取吗?', function(r) {
			if (r) {
				$.ajax({
					url : 'after/businessAccount/receive',		   
					type:"POST",
					data : {
						id : id	,
						loanId:loanId,
						repayDate:repayDate,
						repayTime:repayTime,
						version:version,
						secondCompany:secondCompany,
						amount:amount
				
					},
					success : function(result){
						if(result=='success'){
							//关闭领取列表				 
							$('#receiveGrid').dialog('close');	
							$("#list_result").datagrid('reload');
						}else{
							$.messager.show({
								title : '提示',
								timeout:0,//如果定义为0，消息窗口将不会关闭，除非用户关闭它。
								msg : result
							});
							return false; 				 
						}
					},
					error:function(data){//业务异常显示
						$.messager.show({
							title: 'warning',
							msg: data.responseText
						});
					}
				});
			}
	 });

}

function renderContractView(dialogId,contacterBrowseId,contacterTempletId,loanDetails){
	$('#'+dialogId+' #' +contacterBrowseId+' >'+' #'+contacterTempletId+'  ~ div').remove();
    if(loanDetails.contacterList) {
        for(var i =0;i<loanDetails.contacterList.length;i++){
            var contacter = loanDetails.contacterList[i];
            var contacterBrowsePanel =  $('#'+dialogId+' #'+contacterTempletId).clone().show().addClass('easyui-panel');
            var contacterBrowsePanelId = "contacterBrowsePanel_" + i;
            contacterBrowsePanel.attr("id",contacterBrowsePanelId);
            contacterBrowsePanel.attr("title","联系人"+(i+1));

            contacterBrowsePanel.find('#contacterName').text(contacter.name);
            contacterBrowsePanel.find('#contacterRelationship').text(contacter.relationship);
            contacterBrowsePanel.find('#contacterMobilePhone').text(contacter.mobilePhone);
            contacterBrowsePanel.find('#contacterHomePhone').text(transferUndefined(contacter.homePhone));
            contacterBrowsePanel.find('#contacterWorkUnit').text(contacter.workUnit);
            contacterBrowsePanel.find('#contacterHadKnown').text(formatYes(contacter.hadKnown));
            contacterBrowsePanel.find('#address').text(contacter.address);
            contacterBrowsePanel.find('#title').text(contacter.title);

            contacterBrowsePanel.appendTo($('#'+dialogId+' #' +contacterBrowseId));
        }
        $.parser.parse('#'+dialogId+' #' +contacterBrowseId);
    }
}

function renderCommonView(loanDetails,dialogId){
	
		if(loanDetails.loan) {
			 $('#'+dialogId+' #browseForm #status').text(formatEnumName(loanDetails.loan.status,'LOAN_STATUS'));//状态
			
		}
	   if(loanDetails.grantAccount){
	   		var grantAccountName;
	   		if(loanDetails.grantAccount.bank && loanDetails.grantAccount.bank.bankName){
	   			grantAccountName = loanDetails.grantAccount.bank.bankName;
	   		}else{
	   			grantAccountName = loanDetails.grantAccount.bankName;
	   		}
		   $('#'+dialogId+' #browseForm #grantAccount').text(grantAccountName);//放款银行    	
	    }    
	    if(loanDetails.repayAccount){
	    	var repayAccountName;
	    	if(loanDetails.repayAccount.bank.bankName){
	    		repayAccountName = loanDetails.repayAccount.bank.bankName;
	    	}else{
	    		repayAccountName = loanDetails.repayAccount.bankName;
	    	}


	    	 $('#'+dialogId+' #browseForm #repayAccount').text(repayAccountName);//还款银行
	    }
	
	if(loanDetails.product) {
        $('#'+dialogId+' #browseForm #productName').text(loanDetails.product.productName);
    }
    if(loanDetails.loan) {
        $('#'+dialogId+' #browseForm #requestMoney').text(loanDetails.loan.requestMoney + "元");
        $('#'+dialogId+' #browseForm #requestTime').text(loanDetails.loan.requestTime + "期");
        $('#'+dialogId+' #browseForm #purpose').text(loanDetails.loan.purpose);
    }
    if(loanDetails.person) {
        $('#'+dialogId+' #browseForm #personName').text(loanDetails.person.name);
        $('#'+dialogId+' #browseForm #personSex').text(formatSex(loanDetails.person.sex));
        $('#'+dialogId+' #browseForm #personIdnum').text(loanDetails.person.idnum);
        $('#'+dialogId+' #browseForm #personMarried').text(formatMarried(loanDetails.person.married));
        $('#'+dialogId+' #browseForm #personEducationLevel').text(formatEducationLevel(loanDetails.person.educationLevel));
        $('#'+dialogId+' #browseForm #personHasChildren').text(formatHave(loanDetails.person.hasChildren));
        $('#'+dialogId+' #browseForm #personZipCode').text(loanDetails.person.zipCode);
        $('#'+dialogId+' #browseForm #personAddress').text(loanDetails.person.address);
        $('#'+dialogId+' #browseForm #personMobilePhone').text(loanDetails.person.mobilePhone);
        $('#'+dialogId+' #browseForm #personEmail').text(loanDetails.person.email);
        $('#'+dialogId+' #browseForm #personHomePhone').text(transferUndefined(loanDetails.person.homePhone));
        if(loanDetails.person.professionType){
            $('#'+dialogId+' #browseForm').find('#professionType').text(loanDetails.person.professionType);//职业类型
        }
        // 根据房产类型判断租金和房贷显示与否
        // 规则，如果房产类型是商品房、经济适用房、自建房则显示房贷
        // 如果是租用 则显示每月租金
        // 如果是亲戚住房则租金和房贷均没有
        $('#'+dialogId+' #browseForm #personHouseEstateType').text(loanDetails.person.houseEstateType);
        var personHouseTR = $('#'+dialogId+' #browseForm #personHouseEstateType').parent().parent();
        if(loanDetails.person.houseEstateType == '商品房' || 
        		loanDetails.person.houseEstateType == '经济适用房' || 
        		loanDetails.person.houseEstateType == '自建房'){
        	personHouseTR.find(':nth-child(3)').hide();
        	personHouseTR.find(':nth-child(4)').hide();
        	personHouseTR.find(':nth-child(5)').show();
        	personHouseTR.find(':nth-child(6)').show();
        	
        	$('#'+dialogId+' #browseForm #personHasHouseLoan').text(formatHave(loanDetails.person.hasHouseLoan));
        }
        if(loanDetails.person.houseEstateType == '租用'){
        	personHouseTR.find(':nth-child(3)').show();
        	personHouseTR.find(':nth-child(4)').show();
        	personHouseTR.find(':nth-child(5)').hide();
        	personHouseTR.find(':nth-child(6)').hide();

        	$('#'+dialogId+' #browseForm #personRentPerMonth').text(loanDetails.person.rentPerMonth + "元");
        }
        if(loanDetails.person.houseEstateType == '亲戚住房'){
        	personHouseTR.find(':nth-child(3)').hide();
        	personHouseTR.find(':nth-child(4)').hide();
        	personHouseTR.find(':nth-child(5)').hide();
        	personHouseTR.find(':nth-child(6)').hide();
        }
        
        $('#'+dialogId+' #browseForm #personHouseEstateAddress').text(loanDetails.person.houseEstateAddress);
        if(loanDetails.person.incomePerMonth){
        	$('#'+dialogId+' #browseForm #personIncomePerMonth').text(loanDetails.person.incomePerMonth +"万元/月");
        }
        
    }
    if(loanDetails.company) {
        $('#'+dialogId+' #browseForm #companyName').text(loanDetails.company.name);
        $('#'+dialogId+' #browseForm #companyIndustryInvolved').text(loanDetails.company.industryInvolved);
        $('#'+dialogId+' #browseForm #companyLegalRepresentative').text(loanDetails.company.legalRepresentative);
        $('#'+dialogId+' #browseForm #companyLegalRepresentativeId').text(loanDetails.company.legalRepresentativeId);
        $('#'+dialogId+' #browseForm #companyIncomePerMonth').text(loanDetails.company.incomePerMonth + "万元/月");
        $('#'+dialogId+' #browseForm #companyFoundedDate').text(getYMD(loanDetails.company.foundedDate));
        $('#'+dialogId+' #browseForm #companyCategory').text(formatCompanyCategory(loanDetails.company.category));
        $('#'+dialogId+' #browseForm #companyAddress').text(loanDetails.company.address);
        $('#'+dialogId+' #browseForm #companyAvgProfitPerYear').text(loanDetails.company.avgProfitPerYear + "万元/年");
        $('#'+dialogId+' #browseForm #companyPhone').text(transferUndefined(transferUndefined(loanDetails.company.phone)));
        $('#'+dialogId+' #browseForm #companyZipCode').text(loanDetails.company.zipCode);
        $('#'+dialogId+' #browseForm #companyOperationSite').text(loanDetails.company.operationSite);
        $('#'+dialogId+' #browseForm #companyMajorBusiness').text(loanDetails.company.majorBusiness);
        $('#'+dialogId+' #browseForm #companyEmployeesNumber').text(loanDetails.company.employeesNumber);
        $('#'+dialogId+' #browseForm #companyEmployeesWagesPerMonth').text(loanDetails.company.employeesWagesPerMonth + "万元/月");
    }
    if(loanDetails.service) {
        $('#'+dialogId+' #browseForm #serviceName').text(loanDetails.service.name);
    }
    if(loanDetails.loan) {
        $('#'+dialogId+' #browseForm #customerSource').text(loanDetails.loan.customerSource);
        $('#'+dialogId+' #browseForm #requestDate').text(getYMD(loanDetails.loan.requestDate));
    }
    if(loanDetails.crm) {
        $('#'+dialogId+' #browseForm #crmCode').text(loanDetails.crm.code);
        $('#'+dialogId+' #browseForm #crmName').text(loanDetails.crm.name);
    }
    if(loanDetails.salesDept) {
        $('#'+dialogId+' #browseForm #salesDeptName').text(loanDetails.salesDept.name);
    }
    if(loanDetails.assessor) {
        $('#'+dialogId+' #browseForm #assessorName').text(loanDetails.assessor.name);
    }
    if(loanDetails.loan.remark) {
        $('#'+dialogId+' #browseForm #remark').text(loanDetails.loan.remark);
    }
	
	
}

//显示债权的详细信息
function toLoanDetail(loanId,productType){
	if(productType==1){//小企业贷款
		  $.ajax({
			   url : 'after/businessAccount/businessLoanDetail',			   
			   type:"POST",
			   data: {
		            loanId:loanId,
		            flag:"businessAccount"

		        },
			   success : function(loanDetailsVo){
				   var url = getDialogFileUrl(loanDetailsVo,'BusinessLoanDetail');
				   if (8 ==  loanDetailsVo.product.id) {
				    	 $('#browseEduDlg').dialog({

				    	 	  title: '查看小企业贷',
						        width: 1000,
						        height:600,
						        closed: false,  
						        cache: false,
						        href: url,
						        modal: true,
						        onLoad:function(){
						        	renderOtherField(loanDetailsVo,'loanBrowseTab');
						        	renderContractView('browseEduDlg','contacterBrowseTab','contacterBrowsePanelTemplate',loanDetailsVo);
						        	renderCommonView(loanDetailsVo,'browseEduDlg');
						        	
						        }

				    	 })

				    }else{
				    	
				    	url = url ||'after/businessAccount/toBusinessLoanDetail';   
				    	$('#seLoanDetail').dialog({
				    		title: '查看小企业贷',
				    		width: 1100,
				    		height:800,
				    		closed: false,  
				    		cache: false,
				    		href: url,
				    		modal: true,				        
				    		onLoad : function(){   
				    			loadBusinessLoanDetail(loanDetailsVo);
				    		}
				    	
				    	});
				    	
				    }
				   
				  
				  
			   }
		});
	}else if(productType==2){//车贷
		  $.ajax({
			   url : 'after/businessAccount/carLoanDetail',			   
			   type:"POST",
			   data: {
		            loanId:loanId,
		            flag:"businessAccount"
		        },
			   success : function(loanDetailsVo){
				   var url = 'after/businessAccount/toCarLoanDetail';   
				    $('#carLoanDetail').dialog({
				        title: '查看车贷',
				        width: 1100,
				        height:800,
				        closed: false,  
				        cache: false,
				        href: url,
				        modal: true,
				        onLoad : function(){   
				        	loadCarLoanDetail(loanDetailsVo);
				        }
				   
				    });
				  
				  
			   }
		});
	}
	
}

function toLoanExtensionDetail(loanId){
	 $.ajax({
		   url : 'after/businessAccount/carLoanExtensionDetail',			   
		   type:"POST",
		   data: {
	            loanId:loanId
	        },
		   success : function(loanDetailsVo){
			   var url = 'after/businessAccount/toCarLoanExtensionDetail';   
			    $('#carLoanExtensionDetail').dialog({
			        title: '查看车贷展期',
			        width: 1100,
			        height:800,
			        closed: false,  
			        cache: false,
			        href: url,
			        modal: true,
			        onLoad : function(){   
			        	loadCarLoanExtensionDetail(loanDetailsVo);
			        }
			   
			    });
			  
			  
		   }
	});
}
function transferUndefined(data){
	if(data)
		return data;
	else 
		return "";
}

function formatSex(sex){
    if(sex==1)
        return "男";
    else if(sex==0)
        return "女";
    else 
    	return sex;
}
function formatGuaranteeType(guaranteeType){
    if(guaranteeType == 0)
        return "自然人";
    else if(guaranteeType==1)
        return "法人";
    else 
        return category;
}
//车贷-经营场所
function furmatBusinessPlace(businessPlace){
	if(businessPlace==1){
		return  '租用';
	}else if(businessPlace==2){
		return ' 自有房产';
	}else{
		return '';
	}
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
function formatRequestDate(value,row,index){	
	 return getYMD(value);
}

function getYMD(datetime){	

	if(datetime==''||typeof(datetime) =="undefined"){
		return '';
	}
	return datetime.substr(0, 10);
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
	    else 
	    	return companyType;
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

//加载车贷信息
function loadCarLoanDetail(loanDetailsVo){
	 
	 
		if(loanDetailsVo.product) {
	        $('#browseCLForm #productName').text(loanDetailsVo.product.productName);
	    }
	    if(loanDetailsVo.loan) {
	        $('#browseCLForm #auditMoney').text(loanDetailsVo.loan.auditMoney.toFixed(2) + "元");
	        $('#browseCLForm #auditTime').text(loanDetailsVo.loan.auditTime + "期");
	        $('#browseCLForm #purpose').text(loanDetailsVo.loan.purpose);
	        $('#browseCLForm #status').text(formatEnumName(loanDetailsVo.loan.status,'LOAN_STATUS'));//状态
	    }
	    if(loanDetailsVo.grantAccount){
	    	 $('#browseCLForm #grantAccount').text(loanDetailsVo.grantAccount.bank.bankName);//放款银行    	
	    }    
	    if(loanDetailsVo.repayAccount){
	   	 	$('#browseCLForm #repayAccount').text(loanDetailsVo.repayAccount.bank.bankName);//还款银行
	    }
	    
	    if(loanDetailsVo.person) {
	    	$('#browseCLForm #maxRepayAmount').text(transferUndefined(loanDetailsVo.person.maxRepayAmount.toFixed(2))+'元/月');//可接受的最高月还款额
	    	$('#browseCLForm #professionType').text(transferUndefined(loanDetailsVo.person.professionType));// 职业类型
	    	if(loanDetailsVo.person.professionType=='自营'){
	    		$('.enterpprise1').css('display','table-row');
	    		$('.enterpprise2').css('display','table-row');
	    		$('#browseCLForm #privateEnterpriseType').text(transferUndefined(loanDetailsVo.person.privateEnterpriseType));
     	        $('#browseCLForm #foundedDate').text(getYMD(loanDetailsVo.person.foundedDate));//成立时间
     	        $('#browseCLForm #businessPlace').text(furmatBusinessPlace(loanDetailsVo.person.businessPlace));
     	        $('#browseCLForm #totalEmployees').text(transferUndefined(loanDetailsVo.person.totalEmployees)+'人');
     	        $('#browseCLForm #ratioOfInvestments').text(transferUndefined(loanDetailsVo.person.ratioOfInvestments)+'%');
     	        $('#browseCLForm #monthOfProfit').text(transferUndefined(loanDetailsVo.person.monthOfProfit.toFixed(2))+'万元/月');
	    	}else{
	    		$('.enterpprise1').css('display','none');
	    		$('.enterpprise2').css('display','none');
	    	}
	        $('#browseCLForm #personName').text(loanDetailsVo.person.name);
	        $('#browseCLForm #personSex').text(formatSex(loanDetailsVo.person.sex));
	        $('#browseCLForm #personIdnum').text(loanDetailsVo.person.idnum);
	        $('#browseCLForm #personMarried').text(formatMarried(loanDetailsVo.person.married));
	        $('#browseCLForm #personEducationLevel').text(formatEducationLevel(loanDetailsVo.person.educationLevel));
	        $('#browseCLForm #personHasChildren').text(formatHave(loanDetailsVo.person.hasChildren));
	        if(loanDetailsVo.person.hasChildren==1){
	        	$('#browseCLForm #childrenSchool').text(loanDetailsVo.person.childrenSchool);
	        }else{
	        	$('#browseCLForm #school').text('');//不显示子女在读学校        	        	
	        }
	        $('#browseCLForm #personMobilePhone').text(loanDetailsVo.person.mobilePhone);
	        $('#browseCLForm #personEmail').text(loanDetailsVo.person.email);
	        $('#browseCLForm #personHomePhone').text(loanDetailsVo.person.homePhone);
	        $('#browseCLForm #personPlaceDomicile').text(loanDetailsVo.person.placeDomicile);
	        $('#browseCLForm #personHouseholdZipCode').text(loanDetailsVo.person.householdZipCode);
	        $('#browseCLForm #personAddress').text(loanDetailsVo.person.address);
	        // 根据居住类型，决定每月租金和每月房贷是否显示，规则
	        // 如果居住类型是按揭房，则显示每月房贷
	        // 如果居住类型是租赁，则显示每月租金
	        // 如果其他的，则不显示每月租金和每月房贷
	       
	        $('#browseCLForm #personLiveType').text(loanDetailsVo.person.liveType);
	        var liveType = loanDetailsVo.person.liveType;
	        var liveTypeTR =  $('#browseCLForm #personLiveType').parent().parent();
	        if(liveType=='按揭房'){
	        	liveTypeTR.find(':nth-child(3)').text('每月房贷').show();
	        	liveTypeTR.find(':nth-child(4)').show();
	        	if(loanDetailsVo.person.rentPerMonth){
	        		$('#browseCLForm #personRentPerMonth').text(loanDetailsVo.person.rentPerMonth.toFixed(2) + "元");
	        	}else if(loanDetailsVo.person.rentPerMonth==0){
	        		$('#browseCLForm #personRentPerMonth').text(loanDetailsVo.person.rentPerMonth.toFixed(2) + "元");
	        	}
	        	
	        } else if(liveType == '租赁'){
	        	liveTypeTR.find(':nth-child(3)').text('每月租金').show();
	        	liveTypeTR.find(':nth-child(4)').show();
	        	if(loanDetailsVo.person.rentPerMonth){
	        		$('#browseCLForm #personRentPerMonth').text(loanDetailsVo.person.rentPerMonth.toFixed(2) + "元");
	        	}else if(loanDetailsVo.person.rentPerMonth==0){
	        		$('#browseCLForm #personRentPerMonth').text(loanDetailsVo.person.rentPerMonth.toFixed(2) + "元");
	        	}
	        } else{
	        	liveTypeTR.find(':nth-child(3)').hide();
        		liveTypeTR.find(':nth-child(4)').hide();
        	}
	        $('#browseCLForm #personHouseEstateAddress').text(loanDetailsVo.person.houseEstateAddress);
	        $('#browseCLForm #personZipCode').text(loanDetailsVo.person.zipCode);
	    }
	   
	    if(loanDetailsVo.vehicle) {
	        $('#browseCLForm #vehicleBrand').text(loanDetailsVo.vehicle.brand);
	        $('#browseCLForm #vehicleModel').text(loanDetailsVo.vehicle.model);
	        $('#browseCLForm #vehicleCoty').text(loanDetailsVo.vehicle.coty+"年");
	        $('#browseCLForm #vehicleMileage').text(loanDetailsVo.vehicle.mileage+"公里");
	        $('#browseCLForm #vehiclePlateNumber').text(loanDetailsVo.vehicle.plateNumber);
	        $('#browseCLForm #vehicleFrameNumber').text(loanDetailsVo.vehicle.frameNumber);
	    }
	    if(loanDetailsVo.company) {
	        $('#browseCLForm #companyName').text(loanDetailsVo.company.name);
	        $('#browseCLForm #companyAddress').text(loanDetailsVo.company.address);
	        $('#browseCLForm #personCompanyType').text(formatCompanyType(loanDetailsVo.company.companyType));
	    }
	    if(loanDetailsVo.person) {
	        $('#browseCLForm #personDeptName').text(loanDetailsVo.person.deptName);
	        $('#browseCLForm #personJob').text(loanDetailsVo.person.job);
	        $('#browseCLForm #personExt').text(loanDetailsVo.person.ext);
	        $('#browseCLForm #personWorkNature').text(loanDetailsVo.person.workNature);
	        $('#browseCLForm #personIncomePerMonth').text(loanDetailsVo.person.incomePerMonth.toFixed(2) + "元");
	        $('#browseCLForm #personPayDay').text(loanDetailsVo.person.payDate + "号");
	        $('#browseCLForm #personOtherIncome').text(loanDetailsVo.person.otherIncome.toFixed(2) + "元");
	        $('#browseCLForm #personWitness').text(loanDetailsVo.person.witness);
	        $('#browseCLForm #personWorkThatDept').text(loanDetailsVo.person.workThatDept);
	        $('#browseCLForm #personWorkThatPosition').text(loanDetailsVo.person.workThatPosition);
	        $('#browseCLForm #personWorkThatTell').text(loanDetailsVo.person.workThatTell);
	        $('#browseCLForm #personCompanyType').text(formatCompanyType(loanDetailsVo.person.companyType));
	    }
	    if(loanDetailsVo.creditHistory) {
	        $('#browseCLForm #creditHistoryHasCreditCard').text(formatHave(loanDetailsVo.creditHistory.hasCreditCard));
	        if(loanDetailsVo.creditHistory.hasCreditCard==1){
		        $('#browseCLForm #creditHistoryCardNum').text(loanDetailsVo.creditHistory.cardNum);
		        $('#browseCLForm #creditHistoryTotalAmount').text(loanDetailsVo.creditHistory.totalAmount.toFixed(2) + "元");
		        $('#browseCLForm #creditHistoryOverdrawAmount').text(loanDetailsVo.creditHistory.overdrawAmount.toFixed(2) + "元");
	    	}else{
	    		 $('#browseCLForm #creditHistoryCardNum').text('');
 		        $('#browseCLForm #creditHistoryTotalAmount').text('');
 		        $('#browseCLForm #creditHistoryOverdrawAmount').text('');
	    	}
	    }
	    if(loanDetailsVo.service) {
	        $('#browseCLForm #serviceName').text(loanDetailsVo.service.name);
	    }
	    if(loanDetailsVo.loan) {
	        $('#browseCLForm #customerSource').text(loanDetailsVo.loan.customerSource);
	        $('#browseCLForm #requestDate').text(getYMD(loanDetailsVo.loan.requestDate));
	    }
	    if(loanDetailsVo.crm) {
	        $('#browseCLForm #crmCode').text(loanDetailsVo.crm.code);
	        $('#browseCLForm #crmName').text(loanDetailsVo.crm.name);
	    }
	    if(loanDetailsVo.salesDept) {
	        $('#browseCLForm #salesDeptName').text(loanDetailsVo.salesDept.name);
	    }
	    if(loanDetailsVo.assessor) {
	        $('#browseCLForm #assessorName').text(loanDetailsVo.assessor.name);
	    }
	    if(loanDetailsVo.loan.remark) {
		    $('#browseCLForm #remark').text(loanDetailsVo.loan.remark);
		 }
	    
	    $('#contacterCLBrowseTab > #contacterQTLXRBrowsePanelTemplate ~ div').remove();
	    if(loanDetailsVo.contacterList) {
	        var otherContacter = 0;
	        var haveZXQS = false;
	        var haveXDWLXR = false;
	        for(var i =0;i<loanDetailsVo.contacterList.length;i++){
	            var contacter = loanDetailsVo.contacterList[i];
	            if(contacter.relationship == '直系亲属' && !haveZXQS) {
	            	haveZXQS= true;
	                var contacterZXQSBrowsePanel = $('#contacterZXQSBrowsePanel').show().addClass('easyui-panel');
	                contacterZXQSBrowsePanel.attr("title", "直系亲属");
	                contacterZXQSBrowsePanel.find('#contacterName').text(contacter.name);
	                contacterZXQSBrowsePanel.find('#contacterRelationship').text(contacter.relationship);
	                contacterZXQSBrowsePanel.find('#contacterMobilePhone').text(contacter.mobilePhone);
	                contacterZXQSBrowsePanel.find('#contacterAddress').text(contacter.address);

	                contacterZXQSBrowsePanel.find('#contacterWorkUnit').text(contacter.workUnit);
	                contacterZXQSBrowsePanel.find('#contacterHadKnown').text(formatYes(contacter.hadKnown));
	            }else if(contacter.relationship == '现单位同事' && !haveXDWLXR){
	            	haveXDWLXR = true;
	                var contacterXDWLXRBrowsePanel = $('#contacterXDWLXRBrowsePanel').show().addClass('easyui-panel');
	                contacterXDWLXRBrowsePanel.attr("title", "现单位同事");
	                contacterXDWLXRBrowsePanel.show();
	                contacterXDWLXRBrowsePanel.find('#contacterName').text(contacter.name);
	                contacterXDWLXRBrowsePanel.find('#contacterRelationship').text(contacter.relationship);
	                contacterXDWLXRBrowsePanel.find('#contacterAddress').text(contacter.address);
	                contacterXDWLXRBrowsePanel.find('#contacterMobilePhone').text(contacter.mobilePhone);;
	                contacterXDWLXRBrowsePanel.find('#contacterWorkUnit').text(contacter.workUnit);
	                contacterXDWLXRBrowsePanel.find('#contacterHadKnown').text(formatYes(contacter.hadKnown));
	            }else {
	                otherContacter += 1;

	                var contacterCLBrowsePanel =  $('#contacterQTLXRBrowsePanelTemplate').clone().show().addClass('easyui-panel');
	                var contacterCLBrowsePanelId = "contacterCLBrowsePanel_" + i;
	                contacterCLBrowsePanel.attr("id",contacterCLBrowsePanelId);
	                contacterCLBrowsePanel.attr("title", "其他联系人"+(otherContacter));

	                contacterCLBrowsePanel.find('#contacterName').text(contacter.name);
	                contacterCLBrowsePanel.find('#contacterRelationship').text(contacter.relationship);
	                contacterCLBrowsePanel.find('#contacterMobilePhone').text(contacter.mobilePhone);
	                contacterCLBrowsePanel.find('#contacterAddress').text(contacter.address);
	                contacterCLBrowsePanel.find('#contacterWorkUnit').text(contacter.workUnit);
	                contacterCLBrowsePanel.find('#contacterHadKnown').text(formatYes(contacter.hadKnown));

	                contacterCLBrowsePanel.appendTo($('#contacterCLBrowseTab'));
	            }
	        }
	       
	    }		

}


//加载车贷展期信息
function loadCarLoanExtensionDetail(loanDetailsVo){
	 
	 
		if(loanDetailsVo.product) {
	        $('#browseExtensionCLForm #productName').text(loanDetailsVo.product.productName);
	    }
	    if(loanDetailsVo.extension) {
	        $('#browseExtensionCLForm #auditMoney').text(loanDetailsVo.extension.auditMoney.toFixed(2) + "元");
	        $('#browseExtensionCLForm #auditTime').text(loanDetailsVo.extension.auditTime + "期");
	        $('#browseExtensionCLForm #purpose').text(loanDetailsVo.loan.purpose);
	        $('#browseExtensionCLForm #status').text(formatEnumName(loanDetailsVo.extension.status,'LOAN_STATUS'));//状态
	    }
	    if(loanDetailsVo.grantAccount){
	    	 $('#browseExtensionCLForm #grantAccount').text(loanDetailsVo.grantAccount.bank.bankName);//放款银行    	
	    }    
	    if(loanDetailsVo.repayAccount){
	   	 	$('#browseExtensionCLForm #repayAccount').text(loanDetailsVo.repayAccount.bank.bankName);//还款银行
	    }
	    
	    if(loanDetailsVo.person) {
	    	$('#browseExtensionCLForm #maxRepayAmount').text(transferUndefined(loanDetailsVo.person.maxRepayAmount.toFixed(2))+'元/月');//可接受的最高月还款额
	    	$('#browseExtensionCLForm #professionType').text(transferUndefined(loanDetailsVo.person.professionType));// 职业类型
	    	if(loanDetailsVo.person.professionType=='自营'){
	    		$('.enterpprise1').css('display','table-row');
	    		$('.enterpprise2').css('display','table-row');
	    		$('#browseExtensionCLForm #privateEnterpriseType').text(transferUndefined(loanDetailsVo.person.privateEnterpriseType));
   	        $('#browseExtensionCLForm #foundedDate').text(getYMD(loanDetailsVo.person.foundedDate));//成立时间
   	        $('#browseExtensionCLForm #businessPlace').text(furmatBusinessPlace(loanDetailsVo.person.businessPlace));
   	        $('#browseExtensionCLForm #totalEmployees').text(transferUndefined(loanDetailsVo.person.totalEmployees)+'人');
   	        $('#browseExtensionCLForm #ratioOfInvestments').text(transferUndefined(loanDetailsVo.person.ratioOfInvestments)+'%');
   	        $('#browseExtensionCLForm #monthOfProfit').text(transferUndefined(loanDetailsVo.person.monthOfProfit.toFixed(2))+'万元/月');
	    	}else{
	    		$('.enterpprise1').css('display','none');
	    		$('.enterpprise2').css('display','none');
	    	}
	        $('#browseExtensionCLForm #personName').text(loanDetailsVo.person.name);
	        $('#browseExtensionCLForm #personSex').text(formatSex(loanDetailsVo.person.sex));
	        $('#browseExtensionCLForm #personIdnum').text(loanDetailsVo.person.idnum);
	        $('#browseExtensionCLForm #personMarried').text(formatMarried(loanDetailsVo.person.married));
	        $('#browseExtensionCLForm #personEducationLevel').text(formatEducationLevel(loanDetailsVo.person.educationLevel));
	        $('#browseExtensionCLForm #personHasChildren').text(formatHave(loanDetailsVo.person.hasChildren));
	        if(loanDetailsVo.person.hasChildren==1){
	        	$('#browseExtensionCLForm #childrenSchool').text(loanDetailsVo.person.childrenSchool);
	        }else{
	        	$('#browseExtensionCLForm #school').text('');//不显示子女在读学校        	        	
	        }
	        $('#browseExtensionCLForm #personMobilePhone').text(loanDetailsVo.person.mobilePhone);
	        $('#browseExtensionCLForm #personEmail').text(loanDetailsVo.person.email);
	        $('#browseExtensionCLForm #personHomePhone').text(loanDetailsVo.person.homePhone);
	        $('#browseExtensionCLForm #personPlaceDomicile').text(loanDetailsVo.person.placeDomicile);
	        $('#browseExtensionCLForm #personHouseholdZipCode').text(loanDetailsVo.person.householdZipCode);
	        $('#browseExtensionCLForm #personAddress').text(loanDetailsVo.person.address);
	        // 根据居住类型，决定每月租金和每月房贷是否显示，规则
	        // 如果居住类型是按揭房，则显示每月房贷
	        // 如果居住类型是租赁，则显示每月租金
	        // 如果其他的，则不显示每月租金和每月房贷
	       
	        $('#browseExtensionCLForm #personLiveType').text(loanDetailsVo.person.liveType);
	        var liveType = loanDetailsVo.person.liveType;
	        var liveTypeTR =  $('#browseExtensionCLForm #personLiveType').parent().parent();
	        if(liveType=='按揭房'){
	        	liveTypeTR.find(':nth-child(3)').text('每月房贷').show();
	        	liveTypeTR.find(':nth-child(4)').show();
	        	if(loanDetailsVo.person.rentPerMonth){
	        		$('#browseExtensionCLForm #personRentPerMonth').text(loanDetailsVo.person.rentPerMonth.toFixed(2) + "元");
	        	}else if(loanDetailsVo.person.rentPerMonth==0){
	        		$('#browseExtensionCLForm #personRentPerMonth').text(loanDetailsVo.person.rentPerMonth.toFixed(2) + "元");
	        	}
	        	
	        } else if(liveType == '租赁'){
	        	liveTypeTR.find(':nth-child(3)').text('每月租金').show();
	        	liveTypeTR.find(':nth-child(4)').show();
	        	if(loanDetailsVo.person.rentPerMonth){
	        		$('#browseExtensionCLForm #personRentPerMonth').text(loanDetailsVo.person.rentPerMonth.toFixed(2) + "元");
	        	}else if(loanDetailsVo.person.rentPerMonth==0){
	        		$('#browseExtensionCLForm #personRentPerMonth').text(loanDetailsVo.person.rentPerMonth.toFixed(2) + "元");
	        	}
	        } else{
	        	liveTypeTR.find(':nth-child(3)').hide();
      		liveTypeTR.find(':nth-child(4)').hide();
      	}
	        $('#browseExtensionCLForm #personHouseEstateAddress').text(loanDetailsVo.person.houseEstateAddress);
	        $('#browseExtensionCLForm #personZipCode').text(loanDetailsVo.person.zipCode);
	    }
	   
	    if(loanDetailsVo.vehicle) {
	        $('#browseExtensionCLForm #vehicleBrand').text(loanDetailsVo.vehicle.brand);
	        $('#browseExtensionCLForm #vehicleModel').text(loanDetailsVo.vehicle.model);
	        $('#browseExtensionCLForm #vehicleCoty').text(loanDetailsVo.vehicle.coty+"年");
	        $('#browseExtensionCLForm #vehicleMileage').text(loanDetailsVo.vehicle.mileage+"公里");
	        $('#browseExtensionCLForm #vehiclePlateNumber').text(loanDetailsVo.vehicle.plateNumber);
	        $('#browseExtensionCLForm #vehicleFrameNumber').text(loanDetailsVo.vehicle.frameNumber);
	    }
	    if(loanDetailsVo.company) {
	        $('#browseExtensionCLForm #companyName').text(loanDetailsVo.company.name);
	        $('#browseExtensionCLForm #companyAddress').text(loanDetailsVo.company.address);
	        $('#browseExtensionCLForm #personCompanyType').text(formatCompanyType(loanDetailsVo.company.companyType));
	    }
	    if(loanDetailsVo.person) {
	        $('#browseExtensionCLForm #personDeptName').text(loanDetailsVo.person.deptName);
	        $('#browseExtensionCLForm #personJob').text(loanDetailsVo.person.job);
	        $('#browseExtensionCLForm #personExt').text(loanDetailsVo.person.ext);
	        $('#browseExtensionCLForm #personWorkNature').text(loanDetailsVo.person.workNature);
	        $('#browseExtensionCLForm #personIncomePerMonth').text(loanDetailsVo.person.incomePerMonth.toFixed(2) + "元");
	        $('#browseExtensionCLForm #personPayDay').text(loanDetailsVo.person.payDate + "号");
	        $('#browseExtensionCLForm #personOtherIncome').text(loanDetailsVo.person.otherIncome.toFixed(2) + "元");
	        $('#browseExtensionCLForm #personWitness').text(loanDetailsVo.person.witness);
	        $('#browseExtensionCLForm #personWorkThatDept').text(loanDetailsVo.person.workThatDept);
	        $('#browseExtensionCLForm #personWorkThatPosition').text(loanDetailsVo.person.workThatPosition);
	        $('#browseExtensionCLForm #personWorkThatTell').text(loanDetailsVo.person.workThatTell);
	        $('#browseExtensionCLForm #personCompanyType').text(formatCompanyType(loanDetailsVo.person.companyType));
	    }
	    if(loanDetailsVo.creditHistory) {
	        $('#browseExtensionCLForm #creditHistoryHasCreditCard').text(formatHave(loanDetailsVo.creditHistory.hasCreditCard));
	        if(loanDetailsVo.creditHistory.hasCreditCard==1){
		        $('#browseExtensionCLForm #creditHistoryCardNum').text(loanDetailsVo.creditHistory.cardNum);
		        $('#browseExtensionCLForm #creditHistoryTotalAmount').text(loanDetailsVo.creditHistory.totalAmount.toFixed(2) + "元");
		        $('#browseExtensionCLForm #creditHistoryOverdrawAmount').text(loanDetailsVo.creditHistory.overdrawAmount.toFixed(2) + "元");
	    	}else{
	    		 $('#browseExtensionCLForm #creditHistoryCardNum').text('');
		        $('#browseExtensionCLForm #creditHistoryTotalAmount').text('');
		        $('#browseExtensionCLForm #creditHistoryOverdrawAmount').text('');
	    	}
	    }
	    if(loanDetailsVo.service) {
	        $('#browseExtensionCLForm #serviceName').text(loanDetailsVo.service.name);
	    }
	    if(loanDetailsVo.loan) {
	        $('#browseExtensionCLForm #customerSource').text(loanDetailsVo.loan.customerSource);
	        $('#browseExtensionCLForm #requestDate').text(getYMD(loanDetailsVo.loan.requestDate));
	    }
	    if(loanDetailsVo.crm) {
	        $('#browseExtensionCLForm #crmCode').text(loanDetailsVo.crm.code);
	        $('#browseExtensionCLForm #crmName').text(loanDetailsVo.crm.name);
	    }
	    if(loanDetailsVo.salesDept) {
	        $('#browseExtensionCLForm #salesDeptName').text(loanDetailsVo.salesDept.name);
	    }
	    if(loanDetailsVo.assessor) {
	        $('#browseExtensionCLForm #assessorName').text(loanDetailsVo.assessor.name);
	    }
	    if(loanDetailsVo.loan.remark) {
		    $('#browseExtensionCLForm #remark').text(loanDetailsVo.loan.remark);
		 }
	    
	    $('#contacterCLBrowseTab > #contacterQTLXRBrowsePanelTemplate ~ div').remove();
	    if(loanDetailsVo.contacterList) {
	        var otherContacter = 0;
	        var haveZXQS = false;
	        var haveXDWLXR = false;
	        for(var i =0;i<loanDetailsVo.contacterList.length;i++){
	            var contacter = loanDetailsVo.contacterList[i];
	            if(contacter.relationship == '直系亲属' && !haveZXQS) {
	            	haveZXQS= true;
	                var contacterZXQSBrowsePanel = $('#contacterZXQSBrowsePanel').show().addClass('easyui-panel');
	                contacterZXQSBrowsePanel.attr("title", "直系亲属");
	                contacterZXQSBrowsePanel.find('#contacterName').text(contacter.name);
	                contacterZXQSBrowsePanel.find('#contacterRelationship').text(contacter.relationship);
	                contacterZXQSBrowsePanel.find('#contacterMobilePhone').text(contacter.mobilePhone);
	                contacterZXQSBrowsePanel.find('#contacterAddress').text(contacter.address);

	                contacterZXQSBrowsePanel.find('#contacterWorkUnit').text(contacter.workUnit);
	                contacterZXQSBrowsePanel.find('#contacterHadKnown').text(formatYes(contacter.hadKnown));
	            }else if(contacter.relationship == '现单位同事' && !haveXDWLXR){
	            	haveXDWLXR = true;
	                var contacterXDWLXRBrowsePanel = $('#contacterXDWLXRBrowsePanel').show().addClass('easyui-panel');
	                contacterXDWLXRBrowsePanel.attr("title", "现单位同事");
	                contacterXDWLXRBrowsePanel.show();
	                contacterXDWLXRBrowsePanel.find('#contacterName').text(contacter.name);
	                contacterXDWLXRBrowsePanel.find('#contacterRelationship').text(contacter.relationship);
	                contacterXDWLXRBrowsePanel.find('#contacterAddress').text(contacter.address);
	                contacterXDWLXRBrowsePanel.find('#contacterMobilePhone').text(contacter.mobilePhone);;
	                contacterXDWLXRBrowsePanel.find('#contacterWorkUnit').text(contacter.workUnit);
	                contacterXDWLXRBrowsePanel.find('#contacterHadKnown').text(formatYes(contacter.hadKnown));
	            }else {
	                otherContacter += 1;

	                var contacterCLBrowsePanel =  $('#contacterQTLXRBrowsePanelTemplate').clone().show().addClass('easyui-panel');
	                var contacterCLBrowsePanelId = "contacterCLBrowsePanel_" + i;
	                contacterCLBrowsePanel.attr("id",contacterCLBrowsePanelId);
	                contacterCLBrowsePanel.attr("title", "其他联系人"+(otherContacter));

	                contacterCLBrowsePanel.find('#contacterName').text(contacter.name);
	                contacterCLBrowsePanel.find('#contacterRelationship').text(contacter.relationship);
	                contacterCLBrowsePanel.find('#contacterMobilePhone').text(contacter.mobilePhone);
	                contacterCLBrowsePanel.find('#contacterAddress').text(contacter.address);
	                contacterCLBrowsePanel.find('#contacterWorkUnit').text(contacter.workUnit);
	                contacterCLBrowsePanel.find('#contacterHadKnown').text(formatYes(contacter.hadKnown));

	                contacterCLBrowsePanel.appendTo($('#contacterCLBrowseTab'));
	            }
	        }
	       
	    }		

}


//加载小企业贷详细信息
function loadBusinessLoanDetail(loanDetailsVo){
	renderOtherField(loanDetailsVo,'browseForm');
    
	if(loanDetailsVo.product) {
        $('#browseForm #productName').text(loanDetailsVo.product.productName);
    }
    if(loanDetailsVo.loan) {
        $('#browseForm #auditMoney').text(loanDetailsVo.loan.auditMoney.toFixed(2) + "元");
        $('#browseForm #auditTime').text(loanDetailsVo.loan.auditTime + "期");
        $('#browseForm #purpose').text(loanDetailsVo.loan.purpose);
        $('#browseForm #status').text(formatEnumName(loanDetailsVo.loan.status,'LOAN_STATUS'));//状态
        $('#browseForm #requestMoney').text(loanDetailsVo.loan.requestMoney + "元");
        $('#browseForm #requestTime').text(loanDetailsVo.loan.requestTime + "期");
    }
    if(loanDetailsVo.grantAccount){
    	 $('#browseForm #grantAccount').text(loanDetailsVo.grantAccount.bank.bankName);//放款银行    	
    }    
    if(loanDetailsVo.repayAccount){
   	 	$('#browseForm #repayAccount').text(loanDetailsVo.repayAccount.bank.bankName);//还款银行
    }
    if(loanDetailsVo.person) {
        $('#browseForm #personName').text(loanDetailsVo.person.name);
        $('#browseForm #personSex').text(formatSex(loanDetailsVo.person.sex));
        $('#browseForm #personIdnum').text(loanDetailsVo.person.idnum);
        $('#browseForm #personMarried').text(formatMarried(loanDetailsVo.person.married));
        $('#browseForm #personEducationLevel').text(formatEducationLevel(loanDetailsVo.person.educationLevel));
        $('#browseForm #personHasChildren').text(formatHave(loanDetailsVo.person.hasChildren));              
        $('#browseForm #personZipCode').text(loanDetailsVo.person.zipCode);
        $('#browseForm #personAddress').text(loanDetailsVo.person.address);
        $('#browseForm #personMobilePhone').text(loanDetailsVo.person.mobilePhone);
        $('#browseForm #personEmail').text(loanDetailsVo.person.email);
        $('#browseForm #personHomePhone').text(transferUndefined(loanDetailsVo.person.homePhone));
       if(loanDetailsVo.person.professionType){
            $('#browseForm').find('#professionType').val(loanDetailsVo.person.professionType);//职业类型
        }
        // 根据房产类型判断租金和房贷显示与否
        // 规则，如果房产类型是商品房、经济适用房、自建房则显示房贷
        // 如果是租用 则显示每月租金
        // 如果是亲戚住房则租金和房贷均没有
        $('#browseForm #personHouseEstateType').text(loanDetailsVo.person.houseEstateType);
        var personHouseTR = $('#browseForm #personHouseEstateType').parent().parent();
        if(loanDetailsVo.person.houseEstateType == '商品房' || 
        		loanDetailsVo.person.houseEstateType == '经济适用房' || 
        		loanDetailsVo.person.houseEstateType == '自建房'){
        	personHouseTR.find(':nth-child(3)').hide();
        	personHouseTR.find(':nth-child(4)').hide();
        	personHouseTR.find(':nth-child(5)').show();
        	personHouseTR.find(':nth-child(6)').show();
        	
        	$('#browseForm #personHasHouseLoan').text(formatHave(loanDetailsVo.person.hasHouseLoan));
        }
        if(loanDetailsVo.person.houseEstateType == '租用'){
        	personHouseTR.find(':nth-child(3)').show();
        	personHouseTR.find(':nth-child(4)').show();
        	personHouseTR.find(':nth-child(5)').hide();
        	personHouseTR.find(':nth-child(6)').hide();

        	$('#browseForm #personRentPerMonth').text(loanDetailsVo.person.rentPerMonth.toFixed(2) + "元");
        }
        if(loanDetailsVo.person.houseEstateType == '亲戚住房'){
        	personHouseTR.find(':nth-child(3)').hide();
        	personHouseTR.find(':nth-child(4)').hide();
        	personHouseTR.find(':nth-child(5)').hide();
        	personHouseTR.find(':nth-child(6)').hide();
        }
        
        $('#browseForm #personHouseEstateAddress').text(loanDetailsVo.person.houseEstateAddress); 
        if(loanDetailsVo.person.incomePerMonth){
            $('#browseForm #personIncomePerMonth').text(loanDetailsVo.person.incomePerMonth.toFixed(2) +"万元/月");

        }
       //职业类型
        $('#browseForm #professionType').text(loanDetailsVo.person.professionType);
       
    }
    if(loanDetailsVo.company) {
        $('#browseForm #companyName').text(loanDetailsVo.company.name);
        $('#browseForm #companyIndustryInvolved').text(loanDetailsVo.company.industryInvolved);
        $('#browseForm #companyLegalRepresentative').text(loanDetailsVo.company.legalRepresentative);
        $('#browseForm #companyLegalRepresentativeId').text(loanDetailsVo.company.legalRepresentativeId);
        if (loanDetailsVo.company.incomePerMonth)
        	$('#browseForm #companyIncomePerMonth').text(loanDetailsVo.company.incomePerMonth.toFixed(2) + "万元/月");
        $('#browseForm #companyFoundedDate').text(getYMD(loanDetailsVo.company.foundedDate));
        loanDetailsVo.company.category==3;

        $('#browseForm #companyCategory').text(formatCompanyCategory(loanDetailsVo.company.category));
        $('#browseForm #companyAddress').text(loanDetailsVo.company.address);
        if (loanDetailsVo.company.avgProfitPerYear)
        	$('#browseForm #companyAvgProfitPerYear').text(loanDetailsVo.company.avgProfitPerYear.toFixed(2) + "万元/年");
        $('#browseForm #companyPhone').text(transferUndefined(transferUndefined(loanDetailsVo.company.phone)));
        $('#browseForm #companyZipCode').text(loanDetailsVo.company.zipCode);
        $('#browseForm #companyOperationSite').text(loanDetailsVo.company.operationSite);
        $('#browseForm #companyMajorBusiness').text(loanDetailsVo.company.majorBusiness);
        $('#browseForm #companyEmployeesNumber').text(loanDetailsVo.company.employeesNumber);
        if (loanDetailsVo.company.employeesWagesPerMonth)
        	$('#browseForm #companyEmployeesWagesPerMonth').text(loanDetailsVo.company.employeesWagesPerMonth.toFixed(2) + "万元/月");
    }
    if(loanDetailsVo.service) {
        $('#browseForm #serviceName').text(loanDetailsVo.service.name);
    }
    if(loanDetailsVo.loan) {
        $('#browseForm #customerSource').text(loanDetailsVo.loan.customerSource);
        $('#browseForm #requestDate').text(getYMD(loanDetailsVo.loan.requestDate));
    }
    if(loanDetailsVo.crm) {
        $('#browseForm #crmCode').text(loanDetailsVo.crm.code);
        $('#browseForm #crmName').text(loanDetailsVo.crm.name);
    }
    if(loanDetailsVo.salesDept) {
        $('#browseForm #salesDeptName').text(loanDetailsVo.salesDept.name);
    }
    if(loanDetailsVo.assessor) {
        $('#browseForm #assessorName').text(loanDetailsVo.assessor.name);
    }
    if(loanDetailsVo.loan.remark) {
        $('#browseForm #remark').text(loanDetailsVo.loan.remark);
    }
    // 清空联系人列表（除了模板）
    
    $('#contacterBrowseTab > #contacterBrowsePanelTemplate ~ div').remove();
    if(loanDetailsVo.contacterList) {
        for(var i =0;i<loanDetailsVo.contacterList.length;i++){
            var contacter = loanDetailsVo.contacterList[i];
            var contacterBrowsePanel =  $('#contacterBrowsePanelTemplate').clone().show().addClass('easyui-panel');
            var contacterBrowsePanelId = "contacterBrowsePanel_" + i;
            contacterBrowsePanel.attr("id",contacterBrowsePanelId);
            contacterBrowsePanel.attr("title","联系人"+(i+1));

            contacterBrowsePanel.find('#contacterName').text(contacter.name);
            contacterBrowsePanel.find('#contacterRelationship').text(contacter.relationship);
            contacterBrowsePanel.find('#contacterMobilePhone').text(contacter.mobilePhone);
            contacterBrowsePanel.find('#contacterHomePhone').text(transferUndefined(contacter.homePhone));
            contacterBrowsePanel.find('#contacterWorkUnit').text(contacter.workUnit);
            contacterBrowsePanel.find('#contacterHadKnown').text(formatYes(contacter.hadKnown));
            contacterBrowsePanel.find('#title').text(contacter.title);
            contacterBrowsePanel.find('#address').text(contacter.address);

            contacterBrowsePanel.appendTo($('#contacterBrowseTab'));
        }
        $.parser.parse('#contacterBrowseTab');
    }

    $('#guaranteeBrowseTab > #guaranteeBrowsePanelTemplate ~ div').remove();
    if(loanDetailsVo.guaranteeList) {
        for(var i =0;i<loanDetailsVo.guaranteeList.length;i++){
            var guarantee = loanDetailsVo.guaranteeList[i];
            var guaranteeBrowsePanel =  $('#guaranteeBrowsePanelTemplate').clone().show().addClass('easyui-panel');
            var guaranteeBrowsePanelId = "guaranteeBrowsePanel_" + i;                  
            guaranteeBrowsePanel.attr("id",guaranteeBrowsePanelId);
            guaranteeBrowsePanel.attr("title","担保人"+(i+1));
            if(loanDetailsVo.guaranteeList[i].flag){
            	 guaranteeBrowsePanel.find('#flag').text("该担保人为指定担保人");
        	}
            if(guarantee.guaranteeType==0){//自然人
            	 guaranteeBrowsePanel.find('#guaranteeName').text(guarantee.name);
                 guaranteeBrowsePanel.find('#guaranteeType').text(transferUndefined(formatGuaranteeType(guarantee.guaranteeType)));
                 guaranteeBrowsePanel.find('#guaranteeIdnum').text(transferUndefined(guarantee.idnum));
                 guaranteeBrowsePanel.find('#guaranteeSex').text(transferUndefined(formatSex(guarantee.sex)));
                 guaranteeBrowsePanel.find('#guaranteeMarried').text(transferUndefined(formatMarried(guarantee.married)));
                 guaranteeBrowsePanel.find('#guaranteeEducationLevel').text(transferUndefined(guarantee.educationLevel));
                 guaranteeBrowsePanel.find('#guaranteeHasChildren').text(transferUndefined(formatYes(guarantee.hasChildren)));
                 guaranteeBrowsePanel.find('#guaranteeAddress').text(transferUndefined(guarantee.address));
                 guaranteeBrowsePanel.find('#guaranteeMobilePhone').text(transferUndefined(guarantee.mobilePhone));
                 guaranteeBrowsePanel.find('#guaranteeEmail').text(transferUndefined(guarantee.email));
                 guaranteeBrowsePanel.find('#personHomePhone').text(transferUndefined(guarantee.homePhone));
                 guaranteeBrowsePanel.find('#guaranteeCompanyFullName').text(transferUndefined(guarantee.companyFullName));
                 guaranteeBrowsePanel.find('#guaranteeZipCode').text(transferUndefined(guarantee.zipCode));
                 guaranteeBrowsePanel.find('#guaranteeCompanyAddress').text(transferUndefined(guarantee.companyAddress));
                 guaranteeBrowsePanel.find('#guaranteeCompanyPhone').text(transferUndefined(guarantee.companyPhone));
                
                guaranteeBrowsePanel.find('#tr7').hide();
                guaranteeBrowsePanel.find('#tr8').hide();
               
            }else if(guarantee.guaranteeType==1){//法人
            	 guaranteeBrowsePanel.find('#tr1').hide();
                 guaranteeBrowsePanel.find('#tr2').hide();
                 guaranteeBrowsePanel.find('#tr3').hide();
                 guaranteeBrowsePanel.find('#tr4').hide();
                 guaranteeBrowsePanel.find('#tr5').hide();
                 guaranteeBrowsePanel.find('#tr6').hide();                      
            	 guaranteeBrowsePanel.find('#tr7').show();
                 guaranteeBrowsePanel.find('#tr8').show(); 
                 guaranteeBrowsePanel.find('#guaType').text(transferUndefined(formatGuaranteeType(guarantee.guaranteeType)));
                 guaranteeBrowsePanel.find('#guaCompanyFullName').text(transferUndefined(guarantee.companyFullName));
                 guaranteeBrowsePanel.find('#guaZipCode').text(transferUndefined(guarantee.zipCode));
                 guaranteeBrowsePanel.find('#guaCompanyAddress').text(transferUndefined(guarantee.companyAddress));
                 guaranteeBrowsePanel.find('#guaCompanyPhone').text(transferUndefined(guarantee.companyPhone));
            	
            }
           

            guaranteeBrowsePanel.appendTo($('#guaranteeBrowseTab'));
        }
    }

    loadExistedCityWideLoan(loanDetailsVo,'browseForm');
	
	
}

//领取列表的查询按钮
function receiveSearch() {
	
	var queryParams = $('#receive_result').datagrid('options').queryParams;	
	queryParams.personName = null;
	queryParams.personMobilePhone = null;
	queryParams.personIdnum = null;
	// if( $('#personName').val()==''&& $('#personMobilePhone').val()==''&& $('#personIdnum').val()==''){
	// 	$.messager.show({
	// 		title:' 提示',
	// 		msg:'请至少输入一个查询条件'
	// 	});
	// 	return false;
	// }
	if( $('#personName').val()!=''){
		queryParams.personName = $('#personName').val();
	}
	if( $('#personMobilePhone').val()!=''){
		queryParams.personMobilePhone = $('#personMobilePhone').val();
	}
	if( $('#personIdnum').val()!=''){
		queryParams.personIdnum = $('#personIdnum').val();
	}

	if($('#receivebar #productComb').combobox('getValue')=="all"){
    	 queryParams.productId =null;
    }else{
	    queryParams.productId = $('#receivebar #productComb').combobox('getValue');
    }
	queryParams.extensionTime = $('#extensionTimeComb').combobox('getValue');
	$('#receive_result').datagrid('options').queryParams = queryParams;
	$("#receive_result").datagrid({
		url : 'after/businessAccount/getReceivePage'
	});	
}

function search() {
	var queryParams = $('#list_result').datagrid('options').queryParams;
	repay=new Object();	
	queryParams.repayDate = repay;
	queryParams.amount = null;
	queryParams.secondCompany =  null;
	queryParams.status = null;
	queryParams.recOperatorNo = null;
	queryParams.recTimeStart = repay;
	queryParams.recTimeEnd = repay;
	if($('#repayDateInput').val()!=''){
		queryParams.repayDate = $('#repayDateInput').val()+" 00:00:00"; 
	}
	queryParams.amount = $('#amount').val();//金额
	queryParams.secondCompany = $('#secondCompanyInput').val();//对方单位
	if ($('#status').combobox('getValue') == "all") {//状态
		queryParams.status = 0;
	} else {
		queryParams.status = $('#status').combobox('getValue');
	}
	if ($('#recTimeStart').val() != '') {
		queryParams.recTimeStart = $('#recTimeStart').val();
	}
	if($('#recTimeEnd').val()!=''){
		queryParams.recTimeEnd = $('#recTimeEnd').val();
	}
	if($('#recOperatorNo').val()!=''){
		queryParams.recOperatorNo = $('#recOperatorNo').val();	
	}	
	 setFirstPage("#list_result");
	$('#list_result').datagrid('options').queryParams = queryParams;
	$("#list_result").datagrid('reload');
}
