//(function () {
	var usernameIsOk = false;
	var passwordIsOk = false;
	var rePasswordIsOk = false;
	var companyNameIsOk = false;
	var emailIsOk = false;
	var areaCodeIsOk = false;
	var telephoneIsOk = false;
	var telExtensionIsOk = true; //允许为空
	var companyAddrIsOk = false;
	var linkmanIsOk = false;
	var mobileIsOk = false;
	var vcodeIsOk = false;
	var mobileCodeIsOk = false;
	var agreementIsOk = true;
	var isUpdatePhone = false; //验证手机框电话号码是否更新，包括用户名框中是邮箱情况
	var oldMobile = '';//记录上一次验证电话，用于判断电话是否变化
	var getMoblieCodeInterval = 120; //可重新获取手机验证码时间间隔 单位秒
	var miao = getMoblieCodeInterval;
	var timeoutrun = 0; //倒计时计数器
	var vcodeGenerateTiem ;//最新图形验证码生成的时间
	var vcodeOvertimeInterval = 10 * 60 * 1000;//图形验证码有效期为10分钟
	var checkReg = {
	    emailNameReg: /^(([a-zA-Z0-9]+\w*((\.\w+)|(-\w+))*[\.-]?[a-zA-Z0-9]+)|([a-zA-Z0-9]))$/, //匹配邮箱名称
	    emailReg: /^(([a-zA-Z0-9]+\w*((\.\w+)|(-\w+))*[\.-]?[a-zA-Z0-9]+)|([a-zA-Z0-9]))\@[a-zA-Z0-9]+((\.|-)[a-zA-Z0-9]+)*\.[a-zA-Z0-9]+$/, //匹配邮箱
	    mobileReg: /^1[3,4,5,6,7,8,9][0-9]{9}$/,//匹配电话号码
	    passwordReg: /^\S{1,20}$/,//匹配密码 匹配所有非空白
	    numberReg: /^[0-9]*$/,//匹配数字
	    vcodeReg: /^[a-zA-Z0-9]*$/,//匹配图形验证码
	    linkmanReg: /^(\w|[\u4E00-\u9FA5]|\s)*$/,//匹配联系人信息
		upperCaseReg: /[A-Z]/g,
	    companNameReg: /^(\w|[\u4E00-\u9FA5])*$/,//匹配 汉字 数字 字母 下划线
	    lang_zh: {
	        //账户信息
	        '3101' : '4-20个字符，可由小写字母、中文、数字组成',
	        '3102' : '用户名不能为空',
	        '3103' : '该用户名已被使用，请更换其它用户名，或者使用该&nbsp;<a href=\"signin.php?username={#username#}\" name=\"email_login_link\" class=\"more\">用户名登录</a>',
	        '3104' : '最少4个字符，请输入您的用户名',
	        '3105' : '最多只能为20个字符（10个汉字）',
	        '3106' : '用户名不能全由数字组成！',
	        '3107' : '用户名不能有大写字母！',
			'3108' : '用户名只能是数字，小写字母和汉字',
	        '3111' : '密码为6-20个字符，可由英文、数字及符号组成',
	        '3112' : '登录密码不能为空',
	        '3113' : '密码长度6-20个字符，请重新输入',
	        '3115' : '密码不能包含“空格”，请重新输入',
	        '3116' : '密码为6-20位字符,只能由英文、数字及符号组成',
	        '3121' : '请再次输入密码',
	        '3122' : '密码不能为空',
	        '3123' : '两次输入的密码不一致，请重新输入',
	        //企业及联系人信息
	        '3131' : '请填写单位执照上得名称，最长为30个汉字（60个字符）',
	        '3132' : '公司名称不能为空',
	        '3133' : '公司名称最长只能为30个汉字（60个字符）',
	        '3134' : '该公司名称已被使用',
	        '3141' : '请选择并填写公司地址',
	        '3142' : '公司地址不能为空',
	        '3143' : '请选择完整的公司地址',
	        '3144' : '公司地址最长只能为64个汉字（128个字符）',
	        '3151' : '请输入邮箱，建议填写企业邮箱',
	        '3152' : '邮箱不能为空',
	        '3153' : '邮箱格式不正确，请重新输入',
	        '3154' : '该邮箱已被注册，请更换其它邮箱，或使用该&nbsp;<a href=\"signin.php?Email={#Email#}\" name=\"email_login_link\" class=\"more\">邮箱登录</a>',
	        '3161' : '请输入区号',
	        '3162' : '区号不能为空',
	        '3163' : '只能3-4位纯数字',
	        '3171' : '请输入座机号',
	        '3172' : '座机号不能为空',
	        '3173' : '只能7-8位纯数字',
	        '3181' : '请输入分机号',
	        '3183' : '只能是数字',
	        '3191' : '2-32个字符，可有中文或英文组成',
	        '3192' : '联系人姓名不能为空',
	        '3193' : '联系人姓名只能为2-32个字符，不允许特殊符号',
	        '3201' : '请输入手机号码',
	        '3202' : '手机号不能为空',
	        '3203' : '手机号格式不正确，请重新输入',
	        '3204' : '此手机号已注册，请更换其它手机号，或使用该&nbsp;<a href=\"signin.php?Email={#Email#}\" name=\"mobile_login _link\" class=\"more\">手机号登录</a>',
	        '3211' : '请填写图片中的字符，不区分大小写',
	        '3212' : '请输入图形验证码',
	        '3213' : '图形验证码输入错误，请重新输入',
	        '3214' : '图形验证码已失效，请重新输入',
	        '3221' : '请输入短信验证码',
	        '3222' : '验证码已发送，请注意查收',
	        '3223' : '您的手机号码获取验证码过于频繁，请于24小时后重试',
	        '3224' : '还是没有收到短信？请于24小时后重试，或更换验证手机号码',
	        '3225' : '网络繁忙，请稍后重试',
	        '3226' : '重新获取验证码',
	        '3227' : '完成验证后，您可以用该手机登录和找回密码',
	        '3228' : '验证码错误',
	        '3229' : '您的手机号码获取验证码过于频繁，请2分钟后重试',
	        '3231' : '您必须同意当当服务条款后，才能提交注册。',
	        '3241' : '注册失败，请稍后重试。' 
	    },
	    userName: {
	        checkFocus: function(){
	            checkReg.tool.switchInputStyle('normal','J_userName', 'J_tipImgUserName','J_tipInfoUserName');
	            $('#J_tipInfoUserName').html(checkReg.lang_zh['3101']);
	        },
	        checkKeypress: function(){
	        	var username = $.trim($('#J_userName').val());
	            if (username == '') {
	                return false;
	            }
	        	//格式正确性验证
	            var verifyObj = checkReg.tool.VerifyCharLength(username, 20);
	            if(verifyObj && ('flag' in verifyObj) && verifyObj.flag===false){
	                checkReg.tool.switchInputStyle('error','J_userName', 'J_tipImgUserName','J_tipInfoUserName');
	                $('#J_tipInfoUserName').text(checkReg.lang_zh['3105']);
	                $('#J_userName').val(username.substr(0,verifyObj.charLen));
	                return false;
	            }else{
	            	checkReg.tool.switchInputStyle('normal','J_userName', 'J_tipImgUserName','J_tipInfoUserName');
	            }
	        },	    
	        checkUsername: function(){
	            usernameIsOk = false;
	            var usernameExist = false;
	            checkReg.tool.switchInputStyle('normal','J_userName', 'J_tipImgUserName','J_tipInfoUserName');
	            
	            var username = $.trim($('#J_userName').val());
	            if (username == '') {
	                return false;
	            }
	            
	            //格式正确性验证
	            var verifyObj = checkReg.userName.VerifyFormatUserName(username);
	            if(verifyObj && ('flag' in verifyObj) && verifyObj.flag===false){
	                checkReg.tool.switchInputStyle('error','J_userName', 'J_tipImgUserName','J_tipInfoUserName');
	                $('#J_tipInfoUserName').text(verifyObj.errorInfo);
	                return false;
	            }
	            //唯一性验证
	            $.ajax({
	                type: 'POST',
	                url: 'p/nickname_checker.php',
	                data: 'nickname=' + username,
	                async: false,
	                cache: false,
	                success: function (flg) {
	                    if (flg == "true") {
	                        checkReg.tool.switchInputStyle('error','J_userName', 'J_tipImgUserName','J_tipInfoUserName');
	                        $('#J_tipInfoUserName').html(checkReg.lang_zh['3103'].replace('{#username#}', username));
	                        usernameExist = true;
	                        return false;
	                    }
	                },
	                error: function(){
	                	return false;
	                }
	            });
	            if (usernameExist == true) {
	                return false;
	            }
	            checkReg.tool.switchInputStyle('ok','J_userName', 'J_tipImgUserName','J_tipInfoUserName');
	            usernameIsOk = true;
	            return true;
	        },	            
	        VerifyFormatUserName: function(str){
	            var errorInfo = ''; 
	            var textFlag = false;
	            var verifyObj = {"flag": textFlag, "errorInfo":""};
	
	            if (str && str!=''){
	                if (GetCharLength(str)<4){
	                    errorInfo = checkReg.lang_zh['3104'];
	                    textFlag = false;
	                }else if(GetCharLength(str)>20){
	                    errorInfo = checkReg.lang_zh['3105'];
	                    textFlag = false;
	                }
	                else if(checkReg.numberReg.test(str)){
	                    errorInfo = checkReg.lang_zh['3106'];
	                    textFlag = false;
	                }else if(checkReg.upperCaseReg.test(str)){
	                    errorInfo = checkReg.lang_zh['3107'];
	                    textFlag = false;
	                }else{
	                    if(str.match(checkReg.companNameReg)){
	                        textFlag = true;
	                    } else {
	                        errorInfo = checkReg.lang_zh['3108'];
	                        textFlag = false;
	                    }
	                }
	                verifyObj = {"flag": textFlag, "errorInfo": errorInfo};                
	            }
	            return verifyObj;
	        }//end VerifyFormatUserName
	    },
	    password: {
	        checkPasswordFocus: function() {
	            checkReg.tool.switchInputStyle('normal','J_password', 'J_tipImgPassword', 'J_tipInfoPassword');
	            $('#J_tipInfoPassword').html(checkReg.lang_zh['3111']);
	            $('#J_tipUpperCaseBox').hide();//大写键盘锁定
	            $('#spnPwdStrongTips').hide(); //密码强度提醒
	        },
	        checkPasswordInput: function() {
	            if($('#J_tipUpperCaseBox').is(':hidden')){
	                checkReg.tool.switchInputStyle('normal','J_password', 'J_tipImgPassword', 'J_tipInfoPassword');
	                $('#J_tipInfoPassword').hide();
	                $('#spnPwdStrongTips').hide();
	                
	                var passwordVal = $('#J_password').val();
	                var passwordLen = passwordVal.length;
	                if ( passwordLen==0 ) {
	                    $('#J_tipInfoPassword').show().html(checkReg.lang_zh['3111']);                
	                    return false;
	                }
	                //密码长度小于6是，密码强度显示为最低
	                if ( passwordLen<6 ) {
	                    $('#spnPwdStrongTips').show();
	                    $('.j_pwdStrong').hide();
	                    $('#spnPwdStrong1').show();   
	                    return false;
	                }
	                
	                if ( passwordLen>20 ){
	                    checkReg.tool.switchInputStyle('error','J_password', 'J_tipImgPassword', 'J_tipInfoPassword');                    
	                    $('#J_tipInfoPassword').html(checkReg.lang_zh['3113']);
	                    return false;
	                }
	                //密码强度处理
	                var chenum = checkReg.password.checkStrong(passwordVal);
	                if (chenum == 0) {
	                    return false;
	                } else if (chenum == 1) {
	                    $('.j_pwdStrong').hide();
	                    $('#spnPwdStrong1').show();
	                } else if (chenum == 2) {
	                    $('.j_pwdStrong').hide();
	                    $('#spnPwdStrong2').show();
	                } else if (chenum >= 3) {                   
	                    $('.j_pwdStrong').hide();
	                    $('#spnPwdStrong3').show();
	                }
	                $('#spnPwdStrongTips').show();
	                checkReg.tool.switchInputStyle('ok','J_password', 'J_tipImgPassword', 'J_tipInfoPassword');
	                return true;
	            }
	        },
	        checkPassword: function() {
	            checkReg.tool.switchInputStyle('normal','J_password', 'J_tipImgPassword', 'J_tipInfoPassword');
	            $('#spnPwdStrongTips').hide();
	            $("#J_tipUpperCaseBox").hide();
	            $("#J_tipInfoPassword").show();
	            
	            passwordIsOk = false;            
	            var passwordVal = $('#J_password').val();
	            var passwordLen = passwordVal.length;
	            if (passwordLen == 0) {
	                return false;
	            }
	            if (passwordLen < 6 || passwordLen > 20) {
	                checkReg.tool.switchInputStyle('error','J_password', 'J_tipImgPassword', 'J_tipInfoPassword');
	                $('#J_tipInfoPassword').html(checkReg.lang_zh['3113']);
	                return false;
	            }
	            if (!checkReg.passwordReg.test(passwordVal)) {
	                checkReg.tool.switchInputStyle('error','J_password', 'J_tipImgPassword', 'J_tipInfoPassword');
	                $('#J_tipInfoPassword').html(checkReg.lang_zh['3115']);       
	                return false;
	            }
	            
	            for(var i=0;i<passwordLen;i++){
	                if(passwordVal.charCodeAt(i)>127){
	                    checkReg.tool.switchInputStyle('error','J_password', 'J_tipImgPassword', 'J_tipInfoPassword');
	                    $('#J_tipInfoPassword').html(checkReg.lang_zh['3116']);
	                    return false; 
	                }
	            }
	            if(!checkReg.password.checkPasswordInput()){
	                return false;
	            }
	            passwordIsOk = true;
	            //当确认密码不为空时，密码修改后再一次验证确认密码和密码是否相等
	            checkReg.rePassword.checkRePassword();
	            return true; 
	        },
	        checkCapslockOpen: function(e) {//大写字母验证
	            var  e= window.event || e;
	            var  n= e.keyCode || e.which;
	            var  m= e.shiftKey || (n==16) || false;
	            if (((n >= 65 && n <= 90) && !m) || ((n >= 97 && n <= 122 )&& m)) {
	                $('#spnPwdStrongTips').hide();
	                $('#J_tipInfoPassword').hide();
	                $("#J_tipUpperCaseBox").show();
	            } else if(n >= 97 && n <= 122 && !m){
	                $("#J_tipUpperCaseBox").hide();
	            } else if(n==27){
	                $("#J_tipUpperCaseBox").hide();
	            } else{
	                $("#J_tipUpperCaseBox").hide();
	            }
	        },
	        checkStrong: function(sPW){
	            if (sPW.length < 1){
	                return 0;
	            }
	            var Modes = 0;
	            for (var i = 0; i < sPW.length; i++) {
	                Modes |= Evaluate(sPW.charCodeAt(i));
	            }
	            var num = bitTotal(Modes);
	            return num;
	        }
	    },
	    rePassword: {
	        checkRePasswordFocus: function() {
	            checkReg.tool.switchInputStyle('normal', 'J_repassword', 'J_tipImgRepassword', 'J_tipInfoRepassword');
	            $('#J_tipInfoRepassword').html(checkReg.lang_zh['3121']);
	        },
	        checkRePassword: function() {
	            checkReg.tool.switchInputStyle('normal', 'J_repassword', 'J_tipImgRepassword', 'J_tipInfoRepassword');
	            rePasswordIsOk = false;
	            var passsword = $('#J_password').val();
	            var rep_password = $('#J_repassword').val();
	            if (rep_password == '') {
	                return false;
	            }
	            if (rep_password != passsword) {
	                checkReg.tool.switchInputStyle('error', 'J_repassword', 'J_tipImgRepassword', 'J_tipInfoRepassword');           
	                $('#J_tipInfoRepassword').html(checkReg.lang_zh['3123']);
	                return false;
	            }
	            checkReg.tool.switchInputStyle('ok', 'J_repassword', 'J_tipImgRepassword', 'J_tipInfoRepassword');       
	            rePasswordIsOk = true;
	            return true;
	        }
	    },
	    companyName: {
	        checkCompanyNameFocus: function() {
	            checkReg.tool.switchInputStyle('normal', 'J_companyName', 'J_tipImgCompanyName', 'J_tipInfoCompanyName');
	            $('#J_tipInfoCompanyName').html(checkReg.lang_zh['3131']);
	        },
	        checkKeypress: function(){
	        	var companyName = $.trim($('#J_companyName').val());
	            if (companyName == '') {
	                return false;
	            }
	        	//格式正确性验证
	            var verifyObj = checkReg.tool.VerifyCharLength(companyName, 60);
	            if(verifyObj && ('flag' in verifyObj) && verifyObj.flag===false){
	            	checkReg.tool.switchInputStyle('error', 'J_companyName', 'J_tipImgCompanyName', 'J_tipInfoCompanyName');
	                $('#J_tipInfoCompanyName').text(checkReg.lang_zh['3133']);
	                $('#J_companyName').val(companyName.substr(0,verifyObj.charLen));
	                return false;
	            }else{
	            	checkReg.tool.switchInputStyle('normal', 'J_companyName', 'J_tipImgCompanyName', 'J_tipInfoCompanyName');
	            }
	        },
	        checkCompanyName: function(){
	            companyNameIsOk = false;
	            var companyNameExist = false;
	            checkReg.tool.switchInputStyle('normal', 'J_companyName', 'J_tipImgCompanyName', 'J_tipInfoCompanyName');
	            
	            var companyName = $.trim($('#J_companyName').val());            
	            if (companyName == '') {
	                return false;
	            }
	            
	            //格式正确性验证
	            var verifyObj = checkReg.companyName.VerifyFormatCompanyName(companyName);
	            if(verifyObj && ('flag' in verifyObj) && verifyObj.flag===false){
	                checkReg.tool.switchInputStyle('error', 'J_companyName', 'J_tipImgCompanyName', 'J_tipInfoCompanyName');
	                $('#J_tipInfoCompanyName').text(verifyObj.errorInfo);
	                return false;
	            }
	            
	            //唯一性验证
	            $.ajax({
	                type: 'POST',
	                url: 'p/enterprise_checker.php?',
	                data: 'enterprise_name=' + companyName,
	                async: false,
	                cache: false,
	                success: function (flg) {
	                    if (flg == "true") {
	                    	checkReg.tool.switchInputStyle('error', 'J_companyName', 'J_tipImgCompanyName', 'J_tipInfoCompanyName');
	                        $('#J_tipInfoCompanyName').html(checkReg.lang_zh['3134']);
	                        companyNameExist = true;
	                        return false;
	                    }
	                }
	            });            
	            
	            if (companyNameExist == true) {
	                return false;
	            }
	            checkReg.tool.switchInputStyle('ok', 'J_companyName', 'J_tipImgCompanyName', 'J_tipInfoCompanyName');
	            companyNameIsOk = true;
	            return true;
	        },
	        VerifyFormatCompanyName: function(str){
	            var errorInfo = ''; 
	            var textFlag = false;
	            var verifyObj = {"flag": textFlag, "errorInfo":""};
	
	            if (str && str!=''){
	                if (GetCharLength(str)>60){
	                    errorInfo = checkReg.lang_zh['3133'];
	                    textFlag = false;
	                }else{
	                    textFlag = true;
	                }
	                verifyObj = {"flag": textFlag, "errorInfo": errorInfo};                
	            }
	            return verifyObj;
	        }//end VerifyFormatCompanyName
	    },
	    companyAddress: {
	        checkAddSelFocus: function(){
	            checkReg.tool.switchInputStyle('normal', '', 'J_tipImgAddr', 'J_tipInfoAddr');
	        },
	        checkAddrDetailFocus: function(){
	            checkReg.tool.switchInputStyle('normal', 'addr_detail', 'J_tipImgAddr', 'J_tipInfoAddr');
	            $('#J_tipInfoAddr').html(checkReg.lang_zh['3141']);           
	        },
	        checkKeypress: function(){
	        	var addrDetail = $.trim($('#addr_detail').val());
	            if (addrDetail == '') {
	                return false;
	            }
	        	//格式正确性验证
	            var verifyObj = checkReg.tool.VerifyCharLength(addrDetail, 128);
	            if(verifyObj && ('flag' in verifyObj) && verifyObj.flag===false){
	            	checkReg.tool.switchInputStyle('error', 'addr_detail', 'J_tipImgAddr', 'J_tipInfoAddr');
	                $('#J_tipInfoAddr').text(checkReg.lang_zh['3144']);
	                $('#addr_detail').val(addrDetail.substr(0,verifyObj.charLen));
	                return false;
	            }else{
	            	checkReg.tool.switchInputStyle('normal', 'addr_detail', 'J_tipImgAddr', 'J_tipInfoAddr');
	            }
	        },
	        check_country_province_city: function(){
	        	companyAddrIsOk = false;
	            checkReg.tool.switchInputStyle('normal', '', 'J_tipImgAddr', 'J_tipInfoAddr');
	            var $tipInfoAddr = $('#J_tipInfoAddr');            
	            if ($('#quarter_id').is(':visible') && $('#quarter_id').val() == '0'){                
	                //$tipInfoAddr.html(checkReg.lang_zh['3143']);
	                return false;
	            }
	            if ($('#town_id').is(':visible') && $('#town_id').val() == '0'){
	                //$tipInfoAddr.html(checkReg.lang_zh['3143']);
	                return false;
	            }
	            if ($('#city_id').is(':visible') && $('#city_id').val() == '0'){
	                //$tipInfoAddr.html(checkReg.lang_zh['3143']);
	                return false;
	            }
	            if ($('#province_id').is(':visible') && $('#province_id').val() == '0'){
	                //$tipInfoAddr.html(checkReg.lang_zh['3143']);
	                return false;
	            }
	            if ($('#addr_detail').val() == ''){
	                //$tipInfoAddr.html(checkReg.lang_zh['3143']);
	                return false;
	            }
	            companyAddrIsOk = true;
	            checkReg.tool.switchInputStyle('ok', '', 'J_tipImgAddr', 'J_tipInfoAddr');
	            return true;
	        },
	        setSelList: {
	            set_city: function(province){
	                if (province == 0){//不选值时，后面初始化
	                	clearSelect('city_id', 'show', '请选择');
	                	clearSelect('town_id', 'show', '请选择');
	                	clearSelect('quarter_id', 'hide', '请选择'); 
	                    return;
	                }
	            
	                var region = get_region(province);
	                if (region[0].statusCode != 0){//表示此列表内无数据
	                	clearSelect('quarter_id', 'hide', '请选择');
	                    clearSelect('town_id', 'hide', '请选择');
	                    clearSelect('city_id', 'hide', '请选择');
	                } else {
	                	clearSelect('town_id', 'show', '请选择');
	                	clearSelect('quarter_id', 'hide', '请选择');
	                    set_options('city_id', region, '请选择');
	                }
	            },
	            set_town: function(city){
	                if (city == 0){//不选值时，后面初始化
	                	clearSelect('town_id', 'show', '请选择');
	                	clearSelect('quarter_id', 'hide', '请选择'); 
	                    return;
	                }
	            
	                var region = get_region(city);   
	                if (region[0].statusCode != 0) {//表示此列表内无数据
	                	clearSelect('quarter_id', 'hide', '请选择');
	                    clearSelect('town_id', 'hide', '请选择');
	                } else {
	                	clearSelect('quarter_id', 'hide', '请选择'); 
	                    set_options('town_id', region, '请选择');
	                }
	            },
	            set_quarter: function(town){
	                if (town == 0){//不选值时，后面初始化
	                	clearSelect('quarter_id', 'hide', '请选择'); 
	                    return;
	                }            
	                var region = get_region(town);                
	                if (region[0].statusCode != 0) {//表示此列表内无数据
	                	clearSelect('quarter_id', 'hide', '请选择');
	                } else {
	                	jQuery('#quarter_id').show();
	                	set_options('quarter_id', region, '请选择');
	                }
	            }
	        }
	    },
	    companyEmail: {
	        checkEmailFocus: function(){
	            checkReg.tool.switchInputStyle('normal','J_email', 'J_tipImgEmail','J_tipInfoEmail');            
	            $('#J_tipInfoEmail').html(checkReg.lang_zh['3151']);
	        },
	        checkEmail: function(){
	            emailIsOk = false;
	            var emailExist = false;
	            checkReg.tool.switchInputStyle('normal','J_email', 'J_tipImgEmail','J_tipInfoEmail');
	            
	            var email = $.trim($('#J_email').val());            
	            if (email == '') {
	                return false;
	            }
	                         
	            if (email.length > 40 || !checkReg.emailReg.test(email)) {
	                checkReg.tool.switchInputStyle('error','J_email', 'J_tipImgEmail','J_tipInfoEmail');
	                $('#J_tipInfoEmail').html(checkReg.lang_zh['3153']);
	                return false;
	            }
	            if (/[ ]/.test(email)) {
	                checkReg.tool.switchInputStyle('error','J_email', 'J_tipImgEmail','J_tipInfoEmail');
	                $('#J_tipInfoEmail').html(checkReg.lang_zh['3153']);
	                return false;
	            }
	            $.ajax({
	                type: 'POST',
	                url: 'p/email_checker.php',
	                data: 'email=' + email,
	                async: false,
	                cache: false,
	                success: function (flg) {
	                    if (flg == "true") {
	                        checkReg.tool.switchInputStyle('error','J_email', 'J_tipImgEmail','J_tipInfoEmail');
	                        $('#J_tipInfoEmail').html(checkReg.lang_zh['3154'].replace('{#Email#}', email));
	                        emailExist = true;
	                        return ;
	                    }
	                }
	            });
	            if (emailExist == true) {
	                return false;
	            }
	            checkReg.tool.switchInputStyle('ok','J_email', 'J_tipImgEmail','J_tipInfoEmail');
	            emailIsOk = true;
	            return true;
	        }
	    },
	    companyTel: {
	        areaCode: {
	            checkAreaCodeFocus: function(){
	                checkReg.tool.switchInputStyle('normal','J_areaCode', 'J_tipImgCompanyTel','J_tipInfoAreaCode');            
	                $('#J_tipInfoAreaCode').html(checkReg.lang_zh['3161']);
	            },
	            checkAreaCode: function(){
	                areaCodeIsOk = false;
	                checkReg.tool.switchInputStyle('normal','J_areaCode', 'J_tipImgCompanyTel','J_tipInfoAreaCode');  
	                
	                var areaCode = $.trim($('#J_areaCode').val());            
	                if (areaCode == '') {
	                    return false;
	                }
	                 
	                var len = areaCode.length;            
	                if (!checkReg.numberReg.test(areaCode) ||(len!=3 && len!=4)) {
	                    checkReg.tool.switchInputStyle('error','J_areaCode', 'J_tipImgCompanyTel','J_tipInfoAreaCode');
	                    $('#J_tipInfoAreaCode').html(checkReg.lang_zh['3163']);
	                    return false;
	                }
	                areaCodeIsOk = true;
	                if(areaCodeIsOk && telephoneIsOk && telExtensionIsOk){
	                    checkReg.tool.switchInputStyle('ok','J_areaCode', 'J_tipImgCompanyTel','J_tipInfoAreaCode');
	                }
	                return true;
	            }
	        },
	        telephone: {
	            checkTelephoneFocus: function(){
	                checkReg.tool.switchInputStyle('normal','J_telphone', 'J_tipImgCompanyTel','J_tipInfoTelphone');            
	                $('#J_tipInfoTelphone').html(checkReg.lang_zh['3171']);
	            },
	            checkTelephone: function(){
	                telephoneIsOk = false;
	                checkReg.tool.switchInputStyle('normal','J_telphone', 'J_tipImgCompanyTel','J_tipInfoTelphone');  
	                
	                var telephone = $.trim($('#J_telphone').val());            
	                if (telephone == '') {
	                    return false;
	                }
	                var len = telephone.length;
	                if (!checkReg.numberReg.test(telephone) || (len!=7 && len!=8)) {
	                    checkReg.tool.switchInputStyle('error','J_telphone', 'J_tipImgCompanyTel','J_tipInfoTelphone');
	                    $('#J_tipInfoTelphone').html(checkReg.lang_zh['3173']);
	                    return false;
	                }
	                telephoneIsOk = true;
	                if(areaCodeIsOk && telephoneIsOk && telExtensionIsOk){
	                    checkReg.tool.switchInputStyle('ok','J_telphone', 'J_tipImgCompanyTel','J_tipInfoTelphone');
	                }
	                return true;
	            }
	        },
	        telExtension: {
	            checkTelExtensionFocus: function(){
	                checkReg.tool.switchInputStyle('normal','J_telExtension', 'J_tipImgCompanyTel','J_tipInfoTelExtension');            
	                $('#J_tipInfoTelExtension').html(checkReg.lang_zh['3181']);
	            },
	            checkTelExtension: function(){
	                telExtensionIsOk = true;
	                checkReg.tool.switchInputStyle('normal','J_telExtension', 'J_tipImgCompanyTel','J_tipInfoTelExtension');  
	                
	                var telExtension = $.trim($('#J_telExtension').val());            
	                if (telExtension == '') {
	                    telExtensionIsOk = true;
	                }else if(!checkReg.numberReg.test(telExtension)) {
	                    checkReg.tool.switchInputStyle('error','J_telExtension', 'J_tipImgCompanyTel','J_tipInfoTelExtension');
	                    $('#J_tipInfoTelExtension').html(checkReg.lang_zh['3183']);
	                    telExtensionIsOk = false;
	                    return false;
	                }
	                if(areaCodeIsOk && telephoneIsOk && telExtensionIsOk){
	                    checkReg.tool.switchInputStyle('ok','J_telphone', 'J_tipImgCompanyTel','J_tipInfoTelphone');
	                }
	                return true;
	            }
	        }
	    },
	    companyLinkman: {
	        checkLinkmanFocus: function(){
	            checkReg.tool.switchInputStyle('normal','J_linkman', 'J_tipImgLinkman','J_tipInfoLinkman');            
	            $('#J_tipInfoLinkman').html(checkReg.lang_zh['3191']);
	        },
	        checkKeypress: function(){
	        	var linkman = $.trim($('#J_linkman').val());
	            if (linkman == '') {
	                return false;
	            }
	        	//格式正确性验证
	            var verifyObj = checkReg.tool.VerifyCharLength(linkman, 32);
	            if(verifyObj && ('flag' in verifyObj) && verifyObj.flag===false){
	            	checkReg.tool.switchInputStyle('error','J_linkman', 'J_tipImgLinkman','J_tipInfoLinkman');  
	                $('#J_tipInfoLinkman').text(checkReg.lang_zh['3193']);
	                $('#J_linkman').val(linkman.substr(0,verifyObj.charLen));
	                return false;
	            }else{
	            	checkReg.tool.switchInputStyle('normal','J_linkman', 'J_tipImgLinkman','J_tipInfoLinkman');
	            }
	        },
	        checkLinkman: function(){            
	            linkmanIsOk = false;
	            checkReg.tool.switchInputStyle('normal','J_linkman', 'J_tipImgLinkman','J_tipInfoLinkman');  
	            
	            var linkman = $.trim($('#J_linkman').val());            
	            if (linkman == '') {
	                return false;
	            }
	            
	            //格式正确性验证
	            var len = GetCharLength(linkman);
	            if (len<2 || len>32){
	                checkReg.tool.switchInputStyle('error','J_linkman', 'J_tipImgLinkman','J_tipInfoLinkman');
	                $('#J_tipInfoLinkman').html(checkReg.lang_zh['3193']);
	                return false;
	            }
	            if (!checkReg.linkmanReg.test(linkman)) {
	                checkReg.tool.switchInputStyle('error','J_linkman', 'J_tipImgLinkman','J_tipInfoLinkman');
	                $('#J_tipInfoLinkman').html(checkReg.lang_zh['3193']);
	                return false;
	            }
	            checkReg.tool.switchInputStyle('ok','J_linkman', 'J_tipImgLinkman','J_tipInfoLinkman');
	            linkmanIsOk = true;
	            return true;
	        }
	    },
	    companyMobile: {
	        checkMobileFocus: function(){
	            checkReg.tool.switchInputStyle('normal','J_mobile', 'J_tipImgMobile','J_tipInfoMobile');
	            $('#J_tipInfoMobile').html(checkReg.lang_zh['3201']);
	        },
	        checkMobile: function(){
	            checkReg.tool.switchInputStyle('normal','J_mobile', 'J_tipImgMobile','J_tipInfoMobile');
	            mobileIsOk = false;
	            var mobileExist = false;
	            
	            var mobile = $.trim($('#J_mobile').val());
	            if( oldMobile != mobile){
	                isUpdatePhone = true;
	                oldMobile = mobile;
	            }
	            if (mobile == '') {
	                return false;
	            }
	            
	            if (!checkReg.mobileReg.test(mobile)) {
	                checkReg.tool.switchInputStyle('error','J_mobile', 'J_tipImgMobile','J_tipInfoMobile');         
	                $('#J_tipInfoMobile').html(checkReg.lang_zh['3203']);
	                return false;
	            }
	            
	            $.ajax({
	                type: 'POST',
	                url: 'p/mobile_checker.php',
	                data: 'mobile=' + mobile,
	                async: false,
	                cache: false,
	                success: function (flg) {
	                    if (flg == "true") {
	                        checkReg.tool.switchInputStyle('error','J_mobile', 'J_tipImgMobile','J_tipInfoMobile');
	                        $('#J_tipInfoMobile').html(checkReg.lang_zh['3204'].replace('{#Email#}', mobile));
	                        mobileExist = true;
	                        return false;
	                    }
	                }
	            });
	            if (mobileExist == true) {
	                return false;
	            }
	            checkReg.tool.switchInputStyle('ok','J_mobile', 'J_tipImgMobile','J_tipInfoMobile');
	            mobileIsOk = true;
	            
	            //如果手机号变更的话，重新获短信取验证码
	            var vcode = $.trim($('#txt_vcode').val());
	            if(isUpdatePhone && (vcode!= '' || !checkReg.vcode.checkVcodeOvertime()) ){//验证手机框中内容变更且（图形验证码非空或者失效）
	                checkReg.tool.switchVcodeArea('vcode');
	            }
	            isUpdatePhone = false;
	            return true;
	        }
	    },
	    vcode: {
	        checkVcodeFocus: function(){
	            checkReg.tool.switchInputStyle('normal','txt_vcode', 'J_tipImgVcode','J_tipInfoVcode');
	            $('#J_tipInfoVcode').html(checkReg.lang_zh['3211']);
	        },
	        checkVcode: function(){
	            if($('.j-vcode').is(':visible')){
	                vcodeIsOk = false;
	                checkReg.tool.switchInputStyle('normal','txt_vcode','J_tipImgVcode','J_tipInfoVcode');
	                
	                var txtVcode = $.trim($("#txt_vcode").val());
	                var txtVcodeLen = txtVcode.length;
	                if(checkReg.vcodeReg.test(txtVcode)){
	                    if(txtVcodeLen==4){
	                        if(!checkReg.vcode.checkVcodeOvertime()){
	                            checkReg.tool.switchInputStyle('normal','txt_vcode', 'J_tipImgVcode','J_tipInfoVcode');
	                            $('#J_tipInfoVcode').removeClass('info_normal').html(checkReg.lang_zh['3214']);
	                            return false;
	                        }
	                        //验证图形验证码是否正确
	                        checkReg.vcode.checkVcodeIsOk(txtVcode);
	                    }
	                }else {
	                    checkReg.tool.switchInputStyle('error','txt_vcode', 'J_tipImgVcode','J_tipInfoVcode');
	                    $('#J_tipInfoVcode').html(checkReg.lang_zh['3213']);
	                    return false;
	                }
	            }
	        },
	        checkVcodeIsOk: function(vcode){	        	
	            var type=0;
	            $.ajax({
	                type: 'POST',
	                url: 'p/vcode_check_new.php',
	                data: 'vcode=' + vcode + '&type=' + type,
	                async: false,
	                cache: false,
	                success: function (flg) {
	                    if (flg == 'false') {
	                        checkReg.tool.switchInputStyle('error','txt_vcode', 'J_tipImgVcode','J_tipInfoVcode');   
	                        $('#J_tipInfoVcode').html(checkReg.lang_zh['3213']);
	                        return false;
	                    }else{
	                        checkReg.tool.switchInputStyle('ok','txt_vcode', 'J_tipImgVcode','J_tipInfoVcode');
	                        vcodeIsOk = true;                        
	                        if(!mobileIsOk){
	                            return false;
	                        }              
	                        checkReg.mobileCodeBtn.sendMobileCodeFun();
	                        return true;
	                    }
	                }
	            });
	          
	        },
	        checkVcodeOvertime: function(){
	            var nowTime = new Date().getTime();
	            if( (nowTime - vcodeGenerateTiem)> vcodeOvertimeInterval ){
	                show_vcode('imgVcode');
	                return false;
	            }else{
	                return true;
	            }
	        }
	    },
	    mobileCodeBtn: {       
	        sendMobileCodeFun: function(){//点击获取手机验证码
	            var txtVcode = $('#txt_vcode').val();
	            var mobile_phone = $.trim($('#J_mobile').val());
	          //图形验证码是否失效 
	            if(txtVcode!= '' && !checkReg.vcode.checkVcodeOvertime()){	            	
	                checkReg.tool.switchVcodeArea('vcode');
	                checkReg.tool.switchInputStyle('normal','txt_vcode', 'J_tipImgVcode','J_tipInfoVcode');
                    $('#J_tipInfoVcode').removeClass('info_normal').html(checkReg.lang_zh['3214']);
	                return false;	                
	            }	            
	            // 手机号注册，发送验证码短信
	            var send_flg = false;
	            $.ajax({
	                type: 'POST',
	                url: 'p/send_mobile_vcode_new.php',
	                data: 'custid=0&verify_type=5&vcode=' + txtVcode + '&type=0&mobile_phone=' + mobile_phone,
	                async: false,
	                cache: false,
	                success: function (flg) {
	                    if(flg == '-10' || flg == '-11' || flg == '-12'){
	                    	checkReg.tool.switchVcodeArea('vcode');
	                        // 清空弹层里的短信验证码输入框 和 提示信息，并将光标定位到短信验证码输入框
	                    	checkReg.tool.switchInputStyle('error','txt_vcode', 'J_tipImgVcode','J_tipInfoVcode');                 
	                        $('#J_tipInfoVcode').html(checkReg.lang_zh['3214']);
	                        return false;
	                    } else{
	                    	checkReg.tool.switchVcodeArea('phoneVcode');
	                        if (flg == "0") {                          
	                            // 计时器初始化
	                            miao = getMoblieCodeInterval;
	                            changejishi();    
	                            // 清空弹层里的短信验证码输入框 和 提示信息，并将光标定位到短信验证码输入框
	                            checkReg.tool.switchInputStyle('normal','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode'); 
	                            $('#J_mobileCode').val('');
	                            $('#J_mobileCode').focus();
	                            $('#J_tipInfoMobileCode').html(checkReg.lang_zh['3222']);                            
	                            // 发送验证码短信成功                
	                            return true;
	                        }else if (flg == "-2") {
	                            // 当天发送短信的次数超过了规定的最大次数
	                            checkReg.tool.switchInputStyle('normal','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode'); 
	                            $('#J_tipInfoMobileCode').removeClass('info_normal').html(checkReg.lang_zh['3223']);
	                            $('#sendMobileCode').hide();
	                            $('#J_countDownTip').show().find('.send_tel_check').html(checkReg.lang_zh['3226']);
	                            return false;
	                        }else if (flg == "-4" || flg == "-5" || flg == "-8") {
	                            // 手机验证码插入数据库失败 或者 发送验证码到用户手机失败 或者 两次发送间隔少于2分钟
	                            checkReg.tool.switchInputStyle('normal','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode'); 
	                            $('#J_tipInfoMobileCode').removeClass('info_normal').html(checkReg.lang_zh['3223']);
	                            return false;
	                        } else if ( flg == "-7" ) {
	                            // 两次发送间隔少于2分钟
	                            checkReg.tool.switchInputStyle('normal','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode'); 
	                            $('#J_tipInfoMobileCode').removeClass('info_normal').html(checkReg.lang_zh['3229']);
	                            return false;
	                        } else {
	                            //可以重新发送获取验证码请求
	                            checkReg.tool.switchInputStyle('normal','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode');
	                            $('#J_tipInfoMobileCode').removeClass('info_normal').html(checkReg.lang_zh['3224']);
	                            return false;
	                        }
	                    } 
	                }
	            });
	        }
	    },
	    mobileCode: {
	        checkMobileCodeFocus: function() {
	            checkReg.tool.switchInputStyle('normal','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode');
	            $('#J_tipInfoMobileCode').html(checkReg.lang_zh['3221']);
	        },
	        checkMobileCode: function(){
	            checkReg.tool.switchInputStyle('normal','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode');
	            mobileCodeIsOk = false;
	            var mobilePhone = $.trim($('#J_mobile').val());
	            var pop_sms_vcode = $.trim($('#J_mobileCode').val());           
	            if (pop_sms_vcode == '') {
	                return false;
	            }
	            if (pop_sms_vcode.length != 6) {
	                checkReg.tool.switchInputStyle('error','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode');
	                $('#J_tipInfoMobileCode').html(checkReg.lang_zh['3228']);
	                return false;
	            }
	            
	            $.ajax({
	                type: 'POST',
	                url: 'p/check_mobilephone_vcode.php',
	                data: '&type=0&verify_type=5&mobile_phone=' + mobilePhone  +"&sms_vcode=" + pop_sms_vcode ,
	                async: false,
	                cache: false,
	                success: function (flg) {
	                    if (flg == 'false') {
	                    	checkReg.tool.switchInputStyle('error','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode');
	                        $('#J_tipInfoMobileCode').html(checkReg.lang_zh['3228']);                      
	                        return false;
	                    }else {
	                    	checkReg.tool.switchInputStyle('ok','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode');
	                        mobileCodeIsOk = true; 
	                    }
	                }
	            });
	                    
	            return true;
	        }
	    },
	    agreement: {
	        checkAgreement: function() {
	            if ('checked' == $('#J_agreement').attr('checked')) {
	                $('#J_tipInfoAgreement').html('');
	                agreementIsOk = true;
	                return true;
	            } else {
	                $('#J_tipInfoAgreement').html(checkReg.lang_zh['3231']);
	                agreementIsOk = false;
	                return false;
	            }
	        }
	    },
	    tool:{
            //将单元格恢复到最初样式
            switchInputStyle: function(showType, inputId, tipImgId, tipInfoId){
                if(showType == 'normal') {
                    $('#' + inputId).removeClass('wl_select_change');
                    $('#' + tipImgId).hide();
                    $('#' + tipInfoId).addClass('info_normal').html('').css({'display':'block'});
                }else if(showType == 'ok') {
                    $('#' + inputId).removeClass('wl_select_change');
                    $('#' + tipImgId).removeClass('wl_select_icon22').css({'display':'inline-block'});
                    $('#' + tipInfoId).addClass('info_normal').css({'display':'block'});
                } else if(showType == 'error') {
                    $('#' + inputId).addClass('wl_select_change');
                    $('#' + tipImgId).addClass('wl_select_icon22').css({'display':'inline-block'});
                    $('#' + tipInfoId).removeClass('info_normal').css({'display':'block'});
                }
            },
            switchVcodeArea: function(showType){//切换图形验证码 和短信验证码样式
                if(showType === 'vcode') {
                    if($('.j-phoneVcode').is(':visible')){
                        $('.j-phoneVcode').hide();
                        show_vcode('imgVcode');
                        $('.j-vcode').fadeIn(800);
                        $('#J_mobileCode').val('');
                        mobileCodeIsOk = false;
                        checkReg.tool.switchInputStyle('normal','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode');
                        //如果当前存于倒计时状态，清空倒计时状态
                        clearTimeout(timeoutrun);
                        $('#sendMobileCode').show();
                        $('#J_countDownTip').hide();
                    }else {
                        show_vcode('imgVcode');
                    }               
                }else if(showType === 'phoneVcode') {
                    if ($('.j-vcode').is(':visible')){
                        $('.j-vcode').hide();
                        $('.j-phoneVcode').fadeIn(800);
                        checkReg.tool.switchInputStyle('normal','txt_vcode', 'J_tipImgVcode','J_tipInfoVcode');
                    }
                }
            },           
            isFunc: function(funcName){
                return typeof funcName == 'function';
            },
            VerifyCharLength: function(str, maxLen){
	            var newCharLen = maxLen;
	            var textFlag = true;
	            var verifyObj = {"flag": textFlag, "charLen": newCharLen};
	
	            if (str && str!=''){
	                if(GetCharLength(str)>maxLen){
	                	var charLen = str.length;
	                    textFlag = false;
	                    var l = 0;
	                    for(var i=0;i<charLen; i++){
	                    	l += GetCharLength(str[i]);
	                    	if( l==maxLen ){
	                    		newCharLen = (i+1);
	                    		break;
	                    	}else if(l>maxLen){
	                    		newCharLen = i;
	                    		break;
	                    	}	                    	
	                    }
	                }
	                verifyObj = {"flag": textFlag, "charLen":newCharLen};                
	            }
	            return verifyObj;
	        },//end VerifyCharLength
	        getCheatProof: function(){//读取放诈骗文案
		    	jQuery.ajax({
		            type: 'POST',
		            url: 'p/mix_cheat_proof.php?source=enterRegisterTop',
		            async: true,
		            dataType: 'json',
		            success: function (res) {
		            	if (res) {
		            		$cheatProofDiv = jQuery('#J_cheatProofTop');
		            		if(res.cheatProof_display==='block' && res.cheatProof){
		            			//读取防欺诈接口正常显示接口数据,否则显示默认数据
		            			if(res.cheatProof.errorCode==='0'){
		            				$cheatProofDiv.html(res.cheatProof.res);
		            			}	            			
		            			$cheatProofDiv.css({'display':'block'});
		            		}
		            		return true;
		            	}else{
		            		return false;
		            	}
		            }
		        });
	    	}
	    }
	};
	//字符串长度，一个中文记为2个长度
	function GetCharLength(str) {
	    var iLength = 0;
	    for(var i = 0;i<str.length;i++){
	        if(str.charCodeAt(i) >255){
	            iLength += 2;
	        } else {
	            iLength += 1;
	        }
	    }
	    return iLength;
	}
	//密码强度验证
	function Evaluate(character){
	    if (character >= 48 && character <= 57){
	        return 1;
	    } else if (character >= 65 && character <= 90) {
	        return 2;
	    } else if (character >= 97 && character <= 122) {
	        return 4;
	    } else {
	        return 8;
	    }
	}
	//密码强度验证
	function bitTotal(num){
	    var modes = 0;
	    for (var i = 0; i < 4; i++) {
	        if (num & 1) modes++;
	        num >>>= 1;
	    }
	    return modes;
	}
	//重新获取验证码前的倒计时
	function changejishi(){    
	    miao--;
	    var fen, smiao;
	    fen = parseInt( miao/60 );
	    smiao = miao - ( fen * 60 );
	    var fenstr = '';
	    if(fen > 0){
	        fenstr = fen + '分';
	    }
	    if(miao > 0){
	        $('#J_countDownTip').show().find('.send_tel_check').html( fenstr + smiao + '秒后重新获取' );
	        $('#sendMobileCode').hide();
	        clearTimeout(timeoutrun);
	        timeoutrun = setTimeout(changejishi, 1000);
	    }else{
	        $('#sendMobileCode').show();
	        $('#J_countDownTip').hide();
	        $('#J_tipInfoMobileCode').html('');
	    }
	}
	//隐藏列表时初始化，防止误提交
	function clearSelect(target_id, isShow, default_option)
	{
		if(isShow=="show"){
			$('#' + target_id).show();
		}else{
			$('#' + target_id).hide();
		}    
	    if (default_option){
	    	$('#' + target_id).html('<option value="0">' + default_option + '</option>');
	    }        
	}
	
	//获取
	function get_region(countryId){
	    var data;
	    jQuery.ajax({
	        type: 'get',
	        url: 'p/region.php',
	        data: 'parent_id=' + countryId,
	        async: false,
	        cache: false,
	        success: function(flg) {
	            data = eval(flg);
	            return;
	        }
	    });
	    return data;
	}
	/*
	 * 说明：设置传入的选项值到指定的下拉列表中
	 *
	 * @param {String || Object]} selectObj 目标下拉选框的名称或对象，必须
	 * @param {Array} optionList 选项值设置 格式：[{txt:'北京', val:'010'}, {txt:'上海', val:'020'}] ，必须
	 * @param {String} firstOption 第一个选项值，如：“请选择”，可选，值为空
	 */
	function set_options(selectObj, optionList, firstOption)
	{    
		if (typeof selectObj != 'object')
	    {
	        selectObj = document.getElementById(selectObj);
	    }
		selectObj.setAttribute("style","display:;"); 
	    // 清空选项
	    remove_options(selectObj);
	    // 选项计数
	    var start = 0;
	    // 如果需要添加第一个选项
	    if (firstOption) {
	        selectObj.options[0] = new Option(firstOption, 0);
	        start++;
	    }
	
	    if(optionList && optionList !='' && optionList.length>0){
	    	var len = optionList.length;
		    for (var i = 1; i < len; i++) {//i=0时是状态码
		        // 设置 option
		        selectObj.options[start] = new Option(unescape(optionList[i].name), optionList[i].id);
		        start++;
		    }
	    }
	}
	/*
	 * 说明：将指定下拉列表的选项值清空
	 *
	 * @param {String || Object]} selectObj 目标下拉选框的名称或对象，必须
	 */
	function remove_options(selectObj)
	{
	    if (typeof selectObj != 'object') {
	        selectObj = document.getElementById(selectObj);
	    }
	
	    // 原有选项计数
	    var len = selectObj.options.length;
	    for (var i = 0; i < len; i++) {
	        // 移除当前选项
	        // 由于在options[0]删除后，后面的选项就会补上，因此，只需要selectObj.options[0]=null
	        selectObj.options[0] = null;
	    }
	}
	//获取图形验证码
	function show_vcode(img_id) {    
	    vcodeIsOk = false;
	    vcodeGenerateTiem = new Date().getTime();
	    $('#' + img_id).attr('src', 'p/tmp_proxy.php?t=' + new Date().getTime());
	    $('#txt_vcode').val('');
	    checkReg.tool.switchInputStyle('normal','txt_vcode', 'J_tipImgVcode','J_tipInfoVcode'); 
	}
	//提交注册
	function check_register() {	
		
	    //账户信息
	    var usernameTrim = $.trim($('#J_userName').val());
	    var passwordVal = $('#J_password').val();
	    var repasswordVal = $('#J_repassword').val();
	    //企业信息
	    var companyNameTrim = $.trim($('#J_companyName').val());
	    var $province = $('#province_id');
	    var $cityId = $('#city_id');
	    var $townId = $('#town_id');
	    var $quarterId = $('#quarter_id');
	    var provinceId = $province.val();
	    var cityId = $cityId.val();
	    var townId = $townId.val();
	    var quarterId = $quarterId.val();
	    var addrDetail = $.trim($('#addr_detail').val());
	    
	    var emailTrim = $.trim($('#J_email').val());
	    var areaCodeTrim = $.trim($('#J_areaCode').val());
	    var telephoneTrim = $.trim($('#J_telphone').val());
	    var linkmanTrim = $.trim($('#J_linkman').val());
	    var mobileTrim = $.trim($('#J_mobile').val());
	    var vcodeTrim = $.trim($('#txt_vcode').val());
	    var mobileCodeTrim = $.trim($('#J_mobileCode').val());
	    //为空判断
	    if (usernameTrim == '' || passwordVal == '' || repasswordVal == '' 
	            || companyNameTrim == '' || emailTrim == '' || areaCodeTrim == ''
	            || telephoneTrim == '' || linkmanTrim == ''
	            || mobileTrim == ''
	            || vcodeTrim == '' 
	            || ($('.j-phoneVcode').is(':visible') && mobileCodeTrim == "")) {
	        
	        if (usernameTrim == "") {
	            checkReg.tool.switchInputStyle('error','J_userName', 'J_tipImgUserName','J_tipInfoUserName');
	            $('#J_tipInfoUserName').html(checkReg.lang_zh['3102']);
	        }
	        if (passwordVal == "") {
	            checkReg.tool.switchInputStyle('error','J_password', 'J_tipImgPassword', 'J_tipInfoPassword');
	            $('#J_tipInfoPassword').html(checkReg.lang_zh['3112']);
	            $('#J_tipUpperCaseBox').hide();            
	            $('#spnPwdStrongTips').hide();            
	        }
	        if (repasswordVal == "") {
	            checkReg.tool.switchInputStyle('error', 'J_repassword', 'J_tipImgRepassword', 'J_tipInfoRepassword');
	            $('#J_tipInfoRepassword').html(checkReg.lang_zh['3122']);            
	        }
	        
	        if (companyNameTrim == "") {
	            checkReg.tool.switchInputStyle('error', 'J_companyName', 'J_tipImgCompanyName', 'J_tipInfoCompanyName');
	            $('#J_tipInfoCompanyName').html(checkReg.lang_zh['3132']);            
	        }	        
	        if (($province.is(':visible') && provinceId==0) || ($cityId.is(':visible') && cityId==0) 
	        		|| ($townId.is(':visible') && townId==0) || ($quarterId.is(':visible') && quarterId==0)) {
	            checkReg.tool.switchInputStyle('error', '', 'J_tipImgAddr', 'J_tipInfoAddr');
	            $('#J_tipInfoAddr').html(checkReg.lang_zh['3143']);            
	        }
	        if (addrDetail=='') {
	            checkReg.tool.switchInputStyle('error', 'addr_detail', 'J_tipImgAddr', 'J_tipInfoAddr');
	            $('#J_tipInfoAddr').html(checkReg.lang_zh['3143']);            
	        }
	        if (emailTrim == "") {
	            checkReg.tool.switchInputStyle('error','J_email', 'J_tipImgEmail','J_tipInfoEmail');
	            $('#J_tipInfoEmail').html(checkReg.lang_zh['3152']);            
	        }
	        if (areaCodeTrim == "") {
	            checkReg.tool.switchInputStyle('error','J_areaCode', 'J_tipImgCompanyTel','J_tipInfoAreaCode');
	            $('#J_tipInfoAreaCode').html(checkReg.lang_zh['3162']);            
	        }
	        if (telephoneTrim == "") {
	            checkReg.tool.switchInputStyle('error','J_telphone', 'J_tipImgCompanyTel','J_tipInfoTelphone');
	            $('#J_tipInfoTelphone').html(checkReg.lang_zh['3172']);            
	        }
	        if (linkmanTrim == "") {
	            checkReg.tool.switchInputStyle('error','J_linkman', 'J_tipImgLinkman','J_tipInfoLinkman');
	            $('#J_tipInfoLinkman').html(checkReg.lang_zh['3192']);            
	        }
	        if (mobileTrim == "") {
	            checkReg.tool.switchInputStyle('error','J_mobile', 'J_tipImgMobile','J_tipInfoMobile'); 
	            $('#J_tipInfoMobile').html(checkReg.lang_zh['3202']);            
	        }
	        
	        if( vcodeTrim =='' ) {
	            checkReg.tool.switchInputStyle('error','txt_vcode', 'J_tipImgVcode','J_tipInfoVcode');
	            $('#J_tipInfoVcode').html(checkReg.lang_zh['3212']);
	        }
	        if (mobileCodeTrim == "") {
	            checkReg.tool.switchInputStyle('error','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode');
	            $('#J_tipInfoMobileCode').html(checkReg.lang_zh['3221']);
	        }
	        //防止重复提交
	        submitBtnAvailability('enable');
	        return false;
	    }
	    
	    //所填信息是否正确判断
	    if(usernameIsOk && passwordIsOk && rePasswordIsOk && companyNameIsOk && emailIsOk && areaCodeIsOk 
	            && telephoneIsOk && telExtensionIsOk && companyAddrIsOk && linkmanIsOk && mobileIsOk
	            && vcodeIsOk && mobileCodeIsOk && agreementIsOk ){  
	    	jQuery.ajax({
	            type: 'POST',
	            url: 'register_enterprise_handle.php',
	            data: jQuery('#registerForm').serialize(),
	            async: false,
	            cache: false,
	            success: function(errorCode) {
	            	if(errorCode == '0'){
	            		var returnUrl = $('#returnUrl').val();
	            		window.location.href = "regmobileok.php?mobile_phone=" + mobileTrim         			
	            			+ "&email=" + emailTrim
	            			+ "&username=" + usernameTrim
	            			+ "&returnurl=" + returnUrl;
	            	}else{
	            		handlerError(errorCode);
	            	}
	            },
	            complete: function(){
	            	//防止重复提交
	            	submitBtnAvailability('enable');
	            }
	        });
	    }else{
	    	submitBtnAvailability('enable');
	    }
	}
	//通过浏览器回退按钮返回该页面时，不会清空之前已填写的内容，需要在加载页面时验证一下已填写的内容 
	function verifyRollback(){
		checkReg.userName.checkUsername();
		checkReg.password.checkPassword();
		checkReg.rePassword.checkRePassword();
		checkReg.companyName.checkCompanyName();
		checkReg.companyAddress.check_country_province_city();
		checkReg.companyEmail.checkEmail();
		checkReg.companyTel.areaCode.checkAreaCode();
		checkReg.companyTel.telephone.checkTelephone();
		checkReg.companyTel.telExtension.checkTelExtension();
		checkReg.companyLinkman.checkLinkman();
		checkReg.companyMobile.checkMobile();
		checkReg.vcode.checkVcode();
		checkReg.mobileCode.checkMobileCode();
	}
	//防止重复提交注册
	function submitBtnAvailability( type ){
	    if( type == 'disable' ) {
	        $('#J_submitSaveUnclick').show();
	        $('#J_submitSave').hide();
	    } else {
	        $('#J_submitSaveUnclick').hide();
	        $('#J_submitSave').show();
	    }
	}
	//后台验证各种错误并返回提示信息，用于错误兼容
	function handlerError(errorCode) {
	    switch (errorCode) {
	        case "0":
	            break;
	        case "-1": //非法参数
	        	$('#J_tipInfoAgreement').html(checkReg.lang_zh['3241']);
	            break;
	        case "1": //用户名已存在
	        	var username = $('#J_userName').val();
	        	checkReg.tool.switchInputStyle('error','J_userName', 'J_tipImgUserName','J_tipInfoUserName');
	            $('#J_tipInfoUserName').html(checkReg.lang_zh['3103'].replace('{#username#}', username));
	            break;
	        case "2": //公司名称已存在
	        	checkReg.tool.switchInputStyle('error', 'J_companyName', 'J_tipImgCompanyName', 'J_tipInfoCompanyName');
	            $('#J_tipInfoCompanyName').html(checkReg.lang_zh['3134']);
	        	break;
	        case "3": //邮箱已存在
	        	var email = $('#J_email').val();
	        	checkReg.tool.switchInputStyle('error','J_email', 'J_tipImgEmail','J_tipInfoEmail');
	            $('#J_tipInfoEmail').html(checkReg.lang_zh['3154'].replace('{#Email#}', email));
	            break;
	        case "4": //手机号已存在
	        	var mobile = $('#J_mobile').val();
	        	checkReg.tool.switchInputStyle('error','J_mobile', 'J_tipImgMobile','J_tipInfoMobile');
	            $('#J_tipInfoMobile').html(checkReg.lang_zh['3204'].replace('{#Email#}', mobile));
	            break;
	        case "5": //手机号为空
	        	checkReg.tool.switchInputStyle('error','J_mobile', 'J_tipImgMobile','J_tipInfoMobile'); 
	            $('#J_tipInfoMobile').html(checkReg.lang_zh['3202']);
	            break;
	        case "6": //公司名为空
				checkReg.tool.switchInputStyle('error', 'J_companyName', 'J_tipImgCompanyName', 'J_tipInfoCompanyName');
	            $('#J_tipInfoCompanyName').html(checkReg.lang_zh['3132']);       
	            break;
	        case "7":// 当天发送短信的次数超过了规定的最大次数
	        	checkReg.tool.switchInputStyle('normal','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode'); 
	            $('#J_tipInfoMobileCode').removeClass('info_normal').html(checkReg.lang_zh['3223']);
	            $('#sendMobileCode').hide();
	            $('#J_countDownTip').show().find('.send_tel_check').html(checkReg.lang_zh['3226']);
	            break;
	        case "8": //入库失败
	        	$('#J_tipInfoAgreement').html(checkReg.lang_zh['3241']);
	            break;
	        case "10": //手机验证码错误
	        	checkReg.tool.switchInputStyle('error','J_mobileCode', 'J_tipImgMobileCode','J_tipInfoMobileCode');
	            $('#J_tipInfoMobileCode').html(checkReg.lang_zh['3228']);
	        	break;
	        default:
	            break;
	    }
	}
	
	$(function() {
		show_vcode('imgVcode');
		verifyRollback();	
		
		//显示头部防欺诈文案
		checkReg.tool.getCheatProof();
		
	    //设置鼠标焦点在输入框内时提示信息
	    $('#J_userName').bind("focus",function(){ 
	        checkReg.userName.checkFocus();
	    });
	    //最多只允许输入10个汉字
	    $('#J_userName').on('keyup',function(){
	    	checkReg.userName.checkKeypress();
	    });
	    //账号输入框失去焦点时，触发账号合法性验证
	    $("#J_userName").blur(function(){
	        checkReg.userName.checkUsername();
	    });
	    
	    //密码输入框 
	    $('#J_password').bind("focus",function(){ 
	        checkReg.password.checkPasswordFocus();
	    });
	    $("#J_password").keyup(function(){ 
	        checkReg.password.checkPasswordInput();
	    });
	    $("#J_password").blur(function(){
	        checkReg.password.checkPassword();
	    });
	    $("#J_password").keypress(function(e) {
	        checkReg.password.checkCapslockOpen(e);
	    });
	    
	    //确认密码输入框 
	    $('#J_repassword').bind("focus",function(){ 
	        checkReg.rePassword.checkRePasswordFocus();
	    });
	    $("#J_repassword").blur(function(){
	        checkReg.rePassword.checkRePassword();
	    }); 
	    //公司名称
	    $('#J_companyName').bind("focus",function(){ 
	        checkReg.companyName.checkCompanyNameFocus();
	    });
	    $("#J_companyName").blur(function(){
	        checkReg.companyName.checkCompanyName();
	    });
	    //最多只允许输入30个汉字 60个字符
	    $('#J_companyName').on('keyup',function(){
	    	checkReg.companyName.checkKeypress();
	    });
	    /******* companyAddr start *******/
	    //初始化省份信息
	    var optionList = get_region('9000');
	    set_options('province_id', optionList, '请选择'); 
	        //省份	    
	    $('#province_id, #city_id, #town_id, #quarter_id').on("focus",function(){
	        checkReg.companyAddress.checkAddSelFocus();
	    });
	    $('#province_id').on("change",function(){
	    	checkReg.companyAddress.setSelList.set_city($(this).val());
	    });
	        //市  
	    $('#city_id').on("change",function(){
	    	checkReg.companyAddress.setSelList.set_town($(this).val());
	    });
	        //镇
	    $('#town_id').on("change",function(){
	    	checkReg.companyAddress.setSelList.set_quarter($(this).val());
	    });
	        //区
	        //详细地址
	    $('#addr_detail').on("focus",function(){
	        checkReg.companyAddress.checkAddrDetailFocus();
	    });	    
	    //最多只允许输入64个汉字
	    $('#addr_detail').on("keyup",function(){
	        checkReg.companyAddress.checkKeypress();
	    });
	    $("#province_id, #city_id, #town_id, #quarter_id,#addr_detail").on('blur', function(){
	        checkReg.companyAddress.check_country_province_city();
	    });
	    
	    /******* companyAddr end *******/	    
	    //公司邮箱
	    $('#J_email').bind("focus",function(){ 
	        checkReg.companyEmail.checkEmailFocus();
	    });
	    $("#J_email").blur(function(){
	        checkReg.companyEmail.checkEmail();
	    });
	    
	    //固定电话 区号
	    $('#J_areaCode').bind("focus",function(){ 
	        checkReg.companyTel.areaCode.checkAreaCodeFocus();
	    });
	    $("#J_areaCode").blur(function(){
	        checkReg.companyTel.areaCode.checkAreaCode();
	    });
	    //固定电话 座机号
	    $('#J_telphone').bind("focus",function(){ 
	        checkReg.companyTel.telephone.checkTelephoneFocus();
	    });
	    $("#J_telphone").blur(function(){
	        checkReg.companyTel.telephone.checkTelephone();
	    });
	    //固定电话 分机号
	    $('#J_telExtension').bind("focus",function(){ 
	        checkReg.companyTel.telExtension.checkTelExtensionFocus();
	    });
	    $("#J_telExtension").blur(function(){
	        checkReg.companyTel.telExtension.checkTelExtension();
	    });
	    
	    //联系人姓名
	    $('#J_linkman').bind("focus",function(){ 
	        checkReg.companyLinkman.checkLinkmanFocus();
	    });
	    //最多只允许输入32个汉字
	    $('#J_linkman').on('keyup',function(){
	    	checkReg.companyLinkman.checkKeypress();
	    });	    
	    $("#J_linkman").blur(function(){
	        checkReg.companyLinkman.checkLinkman();
	    });
	   
	    //手机号码
	    $('#J_mobile').bind("focus",function(){ 
	        checkReg.companyMobile.checkMobileFocus();
	    });
	    $("#J_mobile").blur(function(){
	        checkReg.companyMobile.checkMobile();
	    });
	    
	    //图形验证码
	    jQuery('#vcodeImgWrap, #vcodeImgBtn').click(function(){
	        show_vcode('imgVcode');
	    });
	    $('#txt_vcode').bind("focus",function(e){
	        checkReg.vcode.checkVcodeFocus(e);
	    });
	    $('#txt_vcode').blur(function(){
	        checkReg.vcode.checkVcode();
	    });
	    $("#txt_vcode").keyup(function(){
	        checkReg.vcode.checkVcode();
	    });
	    
	    //短信验证码
	    $('#J_mobileCode').bind("focus",function(){
	        checkReg.mobileCode.checkMobileCodeFocus();
	    });
	    $("#J_mobileCode").blur(function(){
	        checkReg.mobileCode.checkMobileCode();
	    });
	    //获取手机验证码
	    $('#sendMobileCode').bind("click",function(){
	        checkReg.mobileCodeBtn.sendMobileCodeFun();    
	    });
	    
	    //当当条款勾选
	    $('#J_agreement').bind("click",function(){
	        checkReg.agreement.checkAgreement();
	    });
	    //提交注册失败后，点击任何输入框，情况注册提示错误信息
	    $('#J_userName, #J_password, #J_repassword, #J_companyName,#province_id,'+
	    		'#city_id, #town_id, #quarter_id, #addr_detail,#J_email, ' + 
	    		'#J_areaCode, #J_telphone, #J_telExtension, #J_linkman, #J_mobile,'+
	    		' #txt_vcode, #J_mobileCode').bind("focus",function(){
			var tipInfoAgreement = $('#J_tipInfoAgreement').html();
			if(tipInfoAgreement == checkReg.lang_zh['3241']){
				$('#J_tipInfoAgreement').html('');
			}
		});
	    //提交注册
	    $('#J_submitSave').bind("click",function(){
	        //防止重复提交
	        submitBtnAvailability('disable');
	        //由于在ie8以下的浏览器版本，防止重复提交按钮不明显，所以延时0.1s执行注册操作
	        setTimeout(check_register, 50);
	        //check_register();        
	    });
	});
//}());
