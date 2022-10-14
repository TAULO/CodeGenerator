
sysUser.initUserExtension = function(userId) {
	Hg.refRepeatSubmit("sysUserExtension_form");//防止表单重复提交

	
	
	$("#sysUserExtension_layout [tag='ok']").click(function(){
		_saveUserExtension();
	});
	

	
	$("#sysUserExtension_layout [tag='cancel']").click(function(){
		$("#sysUserExtension_layout").parent().window("close");
	});
	
	

	
	
	//私有页面方法------------------------------------------------------------------------------------------------------
	function _saveUserExtension() {
		$("#sysUserExtension_layout").block();
		//提交数据--------------------------------------------------
		var submitUrl = "/sys/sysUser/editUserExtension";
		Hg.getJson(submitUrl,$("#sysUserExtension_form").serializeArray(),function(data){
			if (!data.success) {
				$("#sysUserExtension_layout").unblock();
				Hg.refreshSubmitToken("sysUserExtension_form");
				Hg.showErrorMsg("sysUserExtension_form",data.data);
			} else {
				$.messager.ok("保存数据成功!",function(){
					$("#sysUserExtension_layout").parent().window("close");
					$('#sysUser_grid').datagrid("reload");
				});
			}
		});
	}
};


sysUser.initUserExtension(userId);
