define('users/users', function (require, exports, module) {

    var $ = require('jquery');
    var Pagination = require('pagination/pagination');
    var SelectList = require('select-list/select');
    var Config = require('configs/configs');
    var cxmenu=require('cxMenu/cxmenu');
    require('calendar/cxcalendar');
    require('jquery/jquery-form');
    require('libs/layer/layer');
    module.exports = {
        init: function (storageIp,storagePort) {
            this.url = location.href.substring(0, location.href.lastIndexOf("/"));
            this.storageIp = storageIp;
            this.storagePort = storagePort;
            this.pageNumber = 7;
            this.searchWord = "";

            this.campusId = ''; // 点击机构树的机构
            this.userType = 'teacher'; // 人员类型
            this.checked = [];  // 复选框选择的机构
            this.adminId = []; // 是管理员的teacherId

            this.addUser();
            this.allotRoles();
            this.initAllotDevice();
            this.initSearch();
            //this.initUserList(1);
            this.initUpload();
            this.initLeadingIn();
            this.initLeadingOut();
            this.initDownloadMould();
            this.initEnable();
            this.initDisable();
            this.initUrls();
            this.previews();
            this.initHeadImage();
            this.initAddHeadImage();
            this.closedates();

            this.allotAdmin(); // 分配管理员
            cxmenu.initSearchAllDevice();
        },

        initUrls: function(){
            var userName = $('.user').find('a').first().text();
            $('.nav').find('a').each(function(){
                $(this).attr('href',$(this).attr('href')+'&userName=' + userName);
            });
        },
        closedates: function(){

            $('.cxcalendar').on('click', function() {
                $(".cxcalendar").show();
                $('.cxcalendar_lock').show();
            })
            $('body *').not(".cxcalendar").on('click', function(e) {
                if (e.target.id === 'e_userBirthday') {
                    return;
                } else {
                    $(".cxcalendar").hide();
                    $('.cxcalendar_lock').hide();
                }
            })
        },
        addUser: function () {
            var that = this;

            $('.btn-add-users').on('click', function () {
                that.initSelect("select-identity", "");
                var con = $('.add-users');
                $(".add-users").find("img").attr("src","./images/userimg.png");
                $("#userRealName").val("");
                $("#userPwd").val("");
                $("#userNum").val("");
                $("#userMobile").val("");
                $("#userEmail").val("");
                $("#userBirthday").val("");
                $("#userAddress").val("");
                console.log("添加用户");
                layer.open({
                    type: 1,
                    title: '添加用户',
                    shadeClose: false,
                    shade: 0.8,
                    content:$('.add-users'),
                    area:['385px','520px'],
                    btn:["确定", "取消"],
                    end:function (index, layero) {
                        $('.cxcalendar').hide();
                        $('.cxcalendar_lock').hide();
                    },
                    yes:function (index, layero) {
                        $('.cxcalendar').hide();
                        $('.cxcalendar_lock').hide();
                        var userGender = $("input[name='sex']:checked").val();
                        var userRealName = $("#userRealName").val().trim();
                        var userPwd = $("#userPwd").val().trim();
                        var userNum = $("#userNum").val().trim();
                        var userMobile = $("#userMobile").val().trim();
                        var userEmail = $("#userEmail").val().trim();
                        var userType = $("#details-identity input").val();
                        console.log(userRealName);

                        if (userRealName.length == 0) {
                            layer.msg("姓名不能为空");
                            return false;
                        }
                        if (userRealName.length > 45) {
                            layer.msg("姓名请小于45个字符");
                            return false;
                        }
                        if (userPwd.length == 0) {
                            layer.msg("密码不能为空");
                            return false;
                        }
                        if (userNum.length == 0 && userMobile.length == 0 && userEmail.length == 0) {
                            layer.msg("编号,电话或邮箱至少填写一个");
                            return false;
                        }
                        if (userEmail != "" && !userEmail.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) {
                            layer.msg("邮箱格式不正确！请重新输入");
                            $("#userEmail").focus();
                            return false;
                        }
                        var userBirthday = $("#userBirthday").val().trim();
                        var userAddress = $("#userAddress").val().trim();
                        var userAvatar =$(".headimages").attr("id");
                        $.post(that.url + "/User/userAdd.do", {
                            'userPwd': userPwd,
                            'userRealName': userRealName,
                            'userGender': userGender,
                            'userBirthday': userBirthday,
                            'userMobile': userMobile,
                            'userEmail': userEmail,
                            'userAddress': userAddress,
                            'userNum': userNum,
                            'userType': userType,
                            'userAvatar': userAvatar
                        }, function (data) {
                            layer.close(index);
                            if (data.code != 0) {
                                layer.msg("用户增加失败");
                                return false;
                            } else {
                                if (data.result == -1) {
                                    layer.msg("用户已存在");
                                    return false;
                                }
                                if (data.result == 0) {
                                    layer.msg("用户增加失败");
                                    return false;
                                }
                                layer.msg("用户添加成功");
                                that.initUserList(1);
                                return false;
                            }
                        }, 'json');
                        layer.close(index);
                    }
                });
            });
        },
        //获取所有系统 添加角色时使用
        getToken: function () {
            $.post(that.url + "/Role/getToken.do", {//获取用户组织机构
            }, function (data) {
                var tokens = "";
                $.each(data.tokenList, function (i, value) {
                    tokens += "<option token_id=\"" + value.token_id + "\" token_name=\"" + value.token_name + "\">" + value.token_desc + "</option>";
                });
                $("#allot-system").html(tokens);


            }, 'json');

        },
        // 获取所有角色列表
        // 如果只有一个用户，显示其已有角色
        getRoles: function () {
            var that = this;
            var action = "getRoles.do"
            var checkedUser = $(".main-list .m-check.m-checked");
            var ids = "";
            $.each(checkedUser, function (i, value) {
                var userId = checkedUser.eq(i).parent().attr("id");
                ids += userId + ",";
            })
            ids = ids.substring(0,ids.length-1);
            // 只有一个用户
            if(ids.indexOf(",") < 0){
                action = "getUserRoles.do";
            }
            $.post(that.url + "/Role/" + action, {//获取用户角色列表
                'userId': ids
            }, function (data) {
                var roles = "";
                $.each(data.roleList, function (i, value) {
                    roles += "<li title=\"" + value.roleName + "\"><i class=\"m-check " + value.isSelect + "\" role_id=\"" + value.roleId + "\" role_token=\"" + value.role_token + "\"></i><label>" + value.roleName + "</label></li>";
                })
                $("#allot-syetem-list").html(roles);
                //下拉框
                var SelectList = require('select-list/select');
                var select = new SelectList('#allot-system', function (option) {

                });
                select.init();

                var checks = $('.allot-users .m-check');
                //单选
                checks.on('click', function () {
                    if ($(this).hasClass('m-checked')) {
                        $(this).removeClass('m-checked');
                    } else {
                        $(this).addClass('m-checked');
                    }

                });
                $("#allot-syetem-list").find('label').each(function (){
                    $(this).on('click', function () {
                        var check = $(this).parent().find('i');
                        if(check.hasClass('m-checked')){
                            check.removeClass('m-checked');
                        }else{
                            check.addClass('m-checked');
                        }
                    });
                });
            }, 'json');
        },
        initSelect: function (name, value) {
            var that = this;
            $(".select-identity").empty();
            $(".e_select-identity").empty();
            $.post(that.url + "/User/userTypeSearch.do", {}, function (data) {
                $("." + name).append(data);
                //下拉框
                var select = new SelectList("." + name + ' select', function (option) {
                    userType = option.attr('data-value');
                });
                select.init();
                if (value !== "") {
                    $(".e_select-identity input[name='details-identity']").val(value);

                    var selectedLi = $(".e_select-identity li[data-value=" + value + "]");
                    $(".e_select-identity input.select-button").val(selectedLi.text());
                    $(".e_select-identity .select-list li.selected").removeClass('selected');
                    selectedLi.addClass("selected");
                }
            }, 'html');
        },
        // 修改用户信息
        editUser: function () {
            var that = this;
            $('.btn-edit-users').on('click', function () {
                var id = $(this).closest('.u-item').find('.u-check').attr('id');
                $('.headimage').attr("id",id);
                $('#e_userBirthday').cxCalendar();
                $.post(that.url + "/User/userSearch.do", {//用户搜索
                    'userId': id
                }, function (data) {
                    if (data.code == 0) {
                        $("#e_userRealName").val(data.result.userRealName);
                        $("#e_userBirthday").val(data.result.userBirthday);
                        $("#e_userMobile").val(data.result.userMobile);
                        $("#e_userEmail").val(data.result.userEmail);
                        $("#e_userAddress").val(data.result.userAddress);
                        $("#e_userNum").val(data.result.userNum);
                        var userPath = data.result.userPath;
                        var headsub =userPath.substring(userPath.indexOf(":") + 1, userPath.length);
                        if (userPath=="") {
                            //暂时设置为默认头像
                            userPath = "./images/userimg.png";

                        } else {
                            userPath = "http://" + that.storageIp + ":" + that.storagePort + headsub;
                        }

                        $(".edit-users").find("img").attr("src",userPath);
                        var sex="";
                        if (data.result.userGender == 0 || data.result.userGender == 1) {
                            sex+="<input type='radio' value='1' name='e_sex' checked='checked'/><label for='male'>男</label>"+
                                "<input type='radio' value='2' name='e_sex'/><label for='female'>女</label>";
                        } else {
                            sex+="<input type='radio' value='1' name='e_sex'/><label for='male'>男</label>"+
                                "<input type='radio' value='2' name='e_sex' checked='checked'/><label for='female'>女</label>";
                        }
                        $("#e_sex").html(sex);
                        that.initSelect("e_select-identity", data.result.userType);
                    }
                }, 'json');
                $(".layui-layer-content").css("height","315px");
                layer.open({
                    type: 1,
                    title: '修改用户',
                    shadeClose: true,
                    shade: 0.8,
                    content:$('.edit-users'),
                    area:['385px','420px'],
                    btn:["确定", "取消"],
                    end:function (index, layero) {
                        $('.cxcalendar').hide();
                        $('.cxcalendar_lock').hide();

                    },
                    yes:function (index, layero) {
                        $('.cxcalendar').hide();
                        $('.cxcalendar_lock').hide();
                        var userRealName = $("#e_userRealName").val().trim();
                        var userGender = $("input[name='e_sex']:checked").val();
                        var userBirthday = $("#e_userBirthday").val().trim();
                        var userType = $("#details-identity input").val();
                        var userNum = $("#e_userNum").val().trim();
                        var userMobile = $("#e_userMobile").val().trim();
                        var userEmail = $("#e_userEmail").val().trim();
                        var userAddress = $("#e_userAddress").val().trim();
                        var userAvatar =$(".headimage").attr("id");
                        var userPath="";
                        if (userRealName.length == 0) {
                            layer.msg("姓名不能为空");
                            return false;
                        }
                        if (userRealName.length > 45) {
                            layer.msg("姓名请小于45个字符");
                            return false;
                        }
                        if (userNum.length == 0 && userMobile.length == 0 && userEmail.length == 0) {
                            layer.msg("编号,电话或邮箱至少填写一个");
                            return false;
                        }
                        if (userEmail != "" && !userEmail.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) {
                            layer.msg("邮箱格式不正确！请重新输入");
                            $("#userEmail").focus();
                            return false;
                        }
                        $.post(that.url + "/User/userUpdate.do", {//修改用户
                            'userId': id,
                            'userRealName': userRealName,
                            'userGender': userGender,
                            'userBirthday': userBirthday,
                            'userType': userType,
                            'userNum': userNum,
                            'userMobile': userMobile,
                            'userEmail': userEmail,
                            'userAddress': userAddress,
                            'userPath':userPath,
                            'userAvatar':userAvatar
                        }, function (data) {
                            layer.close(index);
                            if (data.code == -1) {
                                layer.msg("修改失败或与其他用户信息重复");
                            } else {
                                layer.msg("修改成功");
                                var page = $(".current");
                                if (page.length < 1) {
                                    that.initUserList(1);
                                } else {
                                    for (var i = 0; i < page.length; i++) {
                                        if (page.eq(i).attr("class") == "current") {
                                            that.initUserList(page.eq(i).text());
                                        }
                                    }
                                }
                            }
                        }, 'json');
                        layer.close(index);
                    }
                });
                return false;
            });
        },

        previews: function (){
            var that =this;
            $("#uploads").on('change', function () {
                var file = $("#uploads");
                var holeName = $("#uploads").val();
                var name = holeName.split("\\");
                var fileName = name[name.length - 1];
                $("#upload_fileNames").val(fileName)
                var extension = (fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length)).toLowerCase();//截取文件后缀名
                if (!(extension == "bmp" || extension == "jpg" ||extension == "png"|| extension == "jpeg"))
                {
                    $("#aaa").attr("style","display:none");
                    $("#aa").attr("style","display:none");
                    layer.msg("目前仅支持jpg、png、bmp、jpeg格式的图片");
                    return false;
                }
                that.preview(this)
            })
        },

        preview: function (file)
        {
            var prevDiv = document.getElementById('aaa');
            if (file.files && file.files[0])
            {
                var reader = new FileReader();
                reader.onload = function(evt){
                    $("#aaa").find("img").attr("src",evt.target.result);
                    $("#aaa").attr("style","display: inline");
                    $("#aa").attr("style","width:100px;height:100px;overflow:hidden");
                    $("#preview").attr("src",evt.target.result);
                }
                reader.readAsDataURL(file.files[0]);
            }
            else
            {
                prevDiv.innerHTML = '<div class="img" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>';
            }
        },

        initHeadImage: function () {
            var that = this;
            $('.headimage').on('click', function () {
                $("#upload_fileNames").val("");
                $("#uploads").val("");
                var id =$(this).attr("id");
                $("#aaa").attr("style","display:none");
                $("#aa").attr("style","display:none");
                var con = $('.user-heading');
                layer.open({
                    type: 1,
                    title: '设置头像',
                    shadeClose: true,
                    shade: 0.8,
                    content:$('.user-heading'),
                    btn:["确定", "取消"],
                    end:function (index, layero) {
                    },
                    yes:function (index, layero) {
                        var file = $("#uploadFiles");
                        var fileName = $("#upload_fileNames").val();
                        var imageDate = $("#imageData").val();
                        var array = imageDate.split(",");
                        var x = array[0];
                        var y = array[1];
                        var w = array[2];
                        var h = array[3];
                        var width = array[4];
                        var height = array[5];
                        var extension = (fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length)).toLowerCase();//截取文件后缀名
                        if (extension == "bmp" || extension == "jpg" || extension == "png"|| extension == "jpeg") {
                            var options = {
                                url: that.url + '/User/imageUpload.do?x=' + x + '&y=' + y + '&w=' + w + '&h=' + h + "&width=" + width + "&height=" + height + "&extension=" + extension,
                                type: 'post',
                                dataType: 'json',
                                success: function (data) {
                                    layer.close(index);
                                    var time =data.filename;
                                    if (data.result == "success") {
                                        var src ="./headImage/"+time+"."+extension+"";
                                        $(".headimage").attr("id",time+"."+extension)
                                        $(".edit-users").find("img").attr("src",src)

                                    }
                                    else  {
                                        layer.msg("设置头像失败");
                                    }

                                }
                            };
                            file.ajaxSubmit(options);

                        } else {
                            layer.msg("目前仅支持jpg、png、bmp、jpeg格式的图片");
                            return false;
                        }
                    }
                });
            });
        },

        initAddHeadImage: function () {
            var that = this;

            $('#userHeadImage').on('click', function () {
                $("#upload_fileNames").val("");
                $("#uploads").val("");
                $("#aaa").attr("style","display:none");
                $("#aa").attr("style","display:none");
                layer.open({
                    type: 1,
                    title: '设置头像',
                    shadeClose: true,
                    shade: 0.8,
                    content:$('.user-heading'),
                    btn:["确定", "取消"],
                    end:function (index, layero) {
                    },
                    yes:function (index, layero) {
                        var file = $("#uploadFiles");
                        var fileName = $("#upload_fileNames").val();
                        var imageDate = $("#imageData").val();
                        var array = imageDate.split(",");
                        var x = array[0];
                        var y = array[1];
                        var w = array[2];
                        var h = array[3];
                        var width = array[4];
                        var height = array[5];
                        var extension = (fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length)).toLowerCase();//截取文件后缀名
                        if (extension == "bmp" || extension == "jpg" || extension == "png"|| extension == "jpeg") {
                            var options = {

                                url: that.url + '/User/imageUpload.do?x=' + x + '&y=' + y + '&w=' + w + '&h=' + h + "&width=" + width + "&height=" + height + "&extension=" + extension,
                                type: 'post',
                                dataType: 'json',
                                success: function (data) {
                                    layer.close(index);
                                    if (data.result == "success") {
                                        var time =data.filename;
                                        var src ="./headImage/"+ time +"."+extension+"";
                                        $(".add-users").find("img").attr("src",src)
                                        $("#userHeadImage").attr("id",time+"."+extension)

                                    }
                                    else  {
                                        layer.msg("设置头像失败");
                                    }
                                }
                            };
                            file.ajaxSubmit(options);

                        } else {
                            layer.msg("目前仅支持jpg、png、bmp、jpeg格式的图片");
                            return false;
                        }
                    }
                });
            });
        },


        // 显示用户信息
        showUserDetails: function () {
            var that = this;
            $('.btn-details').on('click', function () {
                var id = $(this).closest('.u-item').find('.u-check').attr('id');
                // 查询用户的组织机构
                $.post(that.url + "/User/campusSearch.do", {
                    'userId': id
                }, function (data) {
                    $("#details-userAgency").html("组织机构："+(data.result==""?"暂无":data.result));
                    $("#details-userAgency").attr("title",data.result==""?"暂无":data.result);
                }, 'json');

                $.post(that.url + "/User/userDetails.do", {
                    'userId': id
                }, function (data) {
                    var userPath =data.userInfo.userPath;
                    var addr ="http://"+ that.storageIp+":"+that.storagePort;
                    var n = userPath.indexOf("/");//userPath为空为-1
                    if (userPath=="" || n == -1) {
                        userPath =  "./images/userimg.png";//获取显示的图片
                    } else {
                        userPath = userPath.substring(n, userPath.length);
                        userPath = addr + userPath;
                    }
                    var system_list = "";
                    $.each(data.roleInfo, function (i, value) {
                        system_list += "<li title=" + value + ">" + value + "</li>"
                    })
                    system_list == "" ? system_list = "无" : "";
                    $(".details-name").find('img').attr('src',userPath);
                    $("#details-system-list").html(system_list);
                    $("#details-userRealName").html(data.userInfo.userRealName);
                    $("#details-userRealName").attr("title",data.userInfo.userRealName);
                    $("#details-userName").html("用户名：" + data.userInfo.userName);
                    $("#details-userName").attr("title",data.userInfo.userName);
                    $("#details-userSex").html("性别：" + (data.userInfo.userGender == 1 ? "男" : (data.userInfo.userGender == 2 ? "女":"未知")));
                    $("#details-userNum").html("编号：" + data.userInfo.userNum);
                    $("#details-userNum").attr("title",data.userInfo.userNum);
                    $("#details-userEmail").html(data.userInfo.userEmail);
                    $("#details-userEmail").attr("title",data.userInfo.userEmail);
                    $("#details-userBrithday").html(data.userInfo.userBirthday);
                    $("#details-userMobile").html(data.userInfo.userMobile);
                    $("#details-userMobile").attr("title",data.userInfo.userMobile);
                    $("#details-userAddr").html(data.userInfo.userAddress);
                    $("#details-userAddr").attr("title",data.userInfo.userAddress);
                    $("#details-userStatus").html(data.userInfo.userStatus == 1 ? "已启用" : data.userInfo.userStatus == 2 ? "禁用" : "未启用");
                }, 'json');

                //
                //console.log('onshow');
                ////下拉框
                //var select = new SelectList('select#details-system', function (option) {
                //    console.log('value = ' + option.attr('data-value'));
                //    console.log('text = ' + option.text());
                //});
                //select.init();
                layer.open({
                    type: 1,
                    title: '用户信息',
                    shadeClose: true,
                    shade: 0.8,
                    content:$('.m-details'),
                    btn:["确定"],
                    yes:function (index, layero) {
                        layer.close(index);
                    }
                });
                return false;
            });
        },
        // 分配角色
        allotRoles: function () {
            var that = this;
            $('.btn-allot-roles').on('click', function () {
                var checkedUser = $(".main-list .m-check.m-checked");
                var ids = "";
                $("#allot-role-list").val(ids);

                //that.getToken();
                that.getRoles();
                $.each(checkedUser, function (i, value) {
                    var userId = checkedUser.eq(i).parent().attr("id");
                    ids += userId + ",";
                })
                if (ids == "") {
                    layer.msg("请选择用户");
                    return false;
                }
                layer.open({
                    type: 1,
                    title: '分配角色',
                    shadeClose: false,
                    area:["520px","450px"],
                    shade: 0.8,
                    content:$('.allot-users'),
                    btn:["确定", "取消"],
                    end:function (index, layero) {
                    },
                    yes:function (index, layero) {
                        var roleSelect = $("#allot-syetem-list").find(".m-checked");
                        var roles = "";
                        $.each(roleSelect, function (i, value) {
                            var roleId = roleSelect.eq(i).attr("role_id");
                            roles += roleId + ",";
                        })
                        $.post(that.url + "/User/roleAllot.do", {
                            'user_ids': ids,
                            'roles_ids': roles
                        }, function (data) {

                            var n = data.indexOf(":");
                            var total = data.substring(n + 2, n + 6);
                            if (total == "true") {
                                layer.msg("分配成功");
                            }
                            else{
                                layer.msg("分配失败");
                            }

                            $("#allot-role-list").val("");

                        }, 'html')
                        layer.close(index);
                    }
                });


            });
        },
        //分配设备
        initAllotDevice:function(){
            var that = this;
            $(".btn-allot-device").on("click", function () {
                // var userId= $("#userList").find(".back-mi").attr("userid");
                var checkedUser = $(".main-list .m-check.m-checked");
                var userId = "";
                $("#allot-role-list").val(userId);

                //that.getToken();
                that.getRoles();
                $.each(checkedUser, function (i, value) {
                    var id = checkedUser.eq(i).parent().attr("id");
                    userId += id + ",";
                })


                if(userId === null || userId === ""){
                    layer.msg("请选择用户");
                    return;
                }
                var content = $("#win-allot");
                // $("#win-input-i").val("");//清空查询框内容
                // $("#deviceTree-id").val("");//清空临时ID
                // $("#deviceTree-name").val("");//清空临时名称
                layer.open({
                    type: 1,
                    title: '分配设备',
                    shadeClose: true,
                    shade: 0.8,
                    area: ['1000px', '600px'],
                    content: content,
                    btn: ["确定", "取消"],
                    success: function(layero, index){
                        //刷新界面固定数据 设备类型 设备树 用户设备数据
                        $.post(that.url+ "/User/searchDeviceTree.do",{
                        // $.post(that.url + "/Device/searchDeviceTree.do",{
                            userId:userId
                        }, function (data) {
                            // console.log(data);
                            $("#userId").val(data.userId);
                            //左侧设备树
                            var treeHtml = '<div class="org-menu" id="device-tree">';
                            treeHtml += data.deviceTree;
                            treeHtml += "</div>";
                            $(".left-device-tree").html(treeHtml);
                            //左侧设备类型列表
                            var sysList = "<option value=\"\">全部类型</option>";
                            $.each(data.sysList,function(i,value){
                                sysList+="<option value=\""+value.dtype_name+"\">"+value.dtype_name_cn+"</option>";
                            })
                            $("#win-sys").html(sysList);
                            //初始化右侧设备列表
                            cxmenu.init();
                        }, 'json');
                    },
                    no: function (index, layero) {
                        layer.close(index);
                    },
                    yes: function (index, layero) {
                        var devices = $("#win-deviceList").find(".win-block-mains-li");
                        var deviceIds ="";
                        $.each(devices,function(i,value){
                            deviceIds+=devices.eq(i).attr("id")+",";
                        })
                        $.post(that.url + "/User/allotDevice.do",{
                            userId:userId,
                            deviceId:deviceIds
                        }, function (data) {
                            if(data.msg=="true"){
                                var searchWord =$("#deviceSearchWord").val();
                                var deviceType=$("#systlt").children("input[name='systlt']").val();
                                that.searchDevice(userId,deviceType,searchWord);
                                layer.msg("分配成功");
                                $(".m-check-all").removeClass("m-checked");
                                layer.close(index);
                            }
                        }, 'json');
                    }
                });
            });
        },
        //参数：用户ID 设备类型 关键字
        searchDevice:function(userId,deviceType,searchWord){
            var that = this;
            $.post(that.url + "/User/searchDevice.do",{
                userId:userId,
                deviceType:deviceType,
                searchWord:searchWord
            }, function (data) {
                var deviceList = "";
                $.each(data.deviceList,function(i,value){
                    deviceList+="<div class=\"catalog-list-main\">"+
                        "<div class=\"u-check\">"+
                        "<i class=\"m-check\" user2deviceId=\""+value.user2deviceId+"\"></i></div>"+
                        "<div class=\"catalog-name\">"+value.hostName+"</div>"+
                        "<div class=\"catalog-lei\">"+value.typeName+"</div>"+
                        "<div class=\"catalog-ip\">"+value.hostIP+"</div>"+
                        "<div class=\"catalog-dev\">"+value.areaName+"</div>"+
                        "<div class=\"catalog-cz\">"+
                        "<a  user2deviceId=\""+value.user2deviceId+"\" href=\"javascript:void(0)\" class=\"a-btn a-btn-delete device-delete\"></a></div></div>";
                })
                $("#deviceList").html(deviceList);
                that.initCheckBox();
                // that.initDeleteOneDevice();
            }, 'json');
        },
        //初始化多选框
        initCheckBox:function(){
            //var checks = $('.m-check');
            ////单选
            //$(document).on('click','.m-check', function () {
            //    $(this).hasClass('m-checked') ? $(this).removeClass('m-checked') : $(this).addClass('m-checked');
            //});
            //如果该项下面有子类，则该项的宽度设置为100%；
            $('.catalog-list-title ul li').each(function () {
                var childUl = $(this).children('ul');
                if (childUl && childUl.length > 0) {
                    $(this).addClass('single-line');
                }
            });

            //如果该项下面有子类，则添加全选功能
            $(document).on('click','.catalog-list-main-z ul li .m-check', function () {
                var li = $(this).closest('li');
                var childUl = li.children('ul');
                if (childUl && childUl.length > 0) {
                    var allChildCheck = li.find('.m-check');
                    $(this).hasClass('m-checked') ? allChildCheck.addClass('m-checked') : allChildCheck.removeClass('m-checked');
                }
            });
        },
        //选中 check
        initUserCheck: function () {
            var checkAll = $('.main-list .m-check-all');
            checkAll.removeClass('m-checked');
            var checks = $('.main-list .m-check');
            // 整条都可以点选
            $('.main-list .u-item').on('click',function(){
                var checkTemp = $(this).find('i');
                if (checkTemp.hasClass('m-checked')) {
                    checkTemp.removeClass('m-checked');
                    $(this).css("background-color","white");
                } else {
                    checkTemp.addClass('m-checked');
                    $(this).css("background-color","#eaedf1");
                }
                // 都被勾选 ，全选框也被勾选
                if (checks.length == $('.u-item .m-checked').length) {
                    checkAll.addClass('m-checked');
                }
                // 未全被勾选，全选框取消勾选
                else {
                    checkAll.removeClass('m-checked');
                }

            });

            //全选
            checkAll.on('click', function () {
                if ($(this).hasClass('m-checked')) {
                    $(this).removeClass('m-checked');
                    checks.removeClass('m-checked');
                    checks.parent().parent().css("background-color","white");
                } else {
                    $(this).addClass('m-checked');
                    checks.addClass('m-checked');
                    checks.parent().parent().css("background-color","#eaedf1");
                }

            });

        },
        //搜索
        initSearch: function () {
            var that = this;
            //搜索
            $('.user-main .main-top .btn-search').on('click', function () {
                that.searchWord = $('.user-main .m-search input').val();
                that.initUserList(1);
                that.initUserCheck();
            });

            $('.user-main .m-search input').bind('keypress', function (event) {
                if (event.keyCode == '13') {
                    that.searchWord = $('.user-main .m-search input').val();
                    that.initUserList(1);
                    that.initUserCheck();
                }
            });
        },
        //分页
        initPage: function (count) {
            $('.m-users.m-page').html('');
            var that = this;
            if (count > 0) {
                var page = new Pagination(count, function (pageIndex) {
                    that.initUserList(pageIndex + 1);
                    that.initUserCheck();
                });
                page.init('.m-users.m-page', this.pageNumber);
            }

        },
        //获取用户列表
        initUserList: function (page) {

            var that = this;
            var userId = sessionStorage.getItem('userId');

            $.post(that.url + "/User/userSearchByPage.do", {
                'page': page,
                'pageSize': that.pageNumber,
                'searchWord': that.searchWord,
                'userStatus': '-1',
                'campusId': that.campusId,
                'userType': that.userType,
                'userId': userId,
            }, function (data) {
                var n = data.indexOf("@_@");
                if (page && page == 1) {
                    var total = data.substring(0, n);
                    that.initPage(total);
                }
                data = data.substring(n + 3, data.length);
                $('.main-list .u-item').remove();

                $('.main-list').append(data);
                $('.m-check-all').unbind();
                that.initUserCheck();
                that.editUser();
                that.showUserDetails();
                that.initModifyPassword();

            }, 'html');
        },
        // 启用
        initEnable: function () {
            var that = this;
            $('.btn-enable').on('click', function () {
                var ids = that.getIdGroup(true,"");
                /*var checkedUser = $(".m-check.m-checked");
                $.each(checkedUser, function (i, value) {
                    var userId = checkedUser.eq(i).parent().attr("id");
                    ids += userId + ",";
                })*/
                if (ids.length==0) {
                    layer.msg("请选择用户");
                    return false;
                }
                $.post(that.url + "/User/userUpdateStatus.do", {//修改用户状态-启动
                    'userId': ids.toString(),
                    'userStatus': '1'
                }, function (data) {
                    if (data.code == 0) {
                        if (data.result) {
                            layer.msg("已启用");
                            var page = $(".current");
                            if (page.length < 1) {
                                that.initUserList(1);
                            } else {
                                for (var i = 0; i < page.length; i++) {
                                    if (page.eq(i).attr("class") == "current") {
                                        that.initUserList(page.eq(i).text());
                                    }
                                }
                            }
                        }
                        else{
                            layer.msg("启用失败");
                        }
                    }
                    that.initUserCheck();
                    return false;
                }, 'json');
            });
        },
        // 禁用
        initDisable: function () {
            var that = this;
            $('.btn-disable').on('click', function () {
                var userId = sessionStorage.getItem('userId');
                var ids = that.getIdGroup(false,userId);
                /*var checkedUser = $(".m-check.m-checked");
                $.each(checkedUser, function (i, value) {
                    var teacherId = checkedUser.eq(i).parent().attr("id");
                    if(userId!=teacherId) {
                        ids += teacherId + ",";
                    }else{
                        flag=true;  //用户选择了本身
                    }
                })*/
                var checkedUser = $(".m-check.m-checked");
                if (ids.length == 0) {
                    if(checkedUser.length==0) {
                        layer.msg("请选择用户");
                    }else{
                        layer.msg("无权限禁用,请联系管理员。");
                    }
                    return false;
                }
                $.post(that.url + "/User/userUpdateStatus.do", {
                    'userId': ids.toString(),
                    'userStatus': '2'
                }, function (data) {
                    if (data.code == 0) {
                        if (data.result) {
                            layer.msg("已禁用");
                            var page = $(".current");
                            if (page.length < 1) {
                                that.initUserList(1);
                            } else {
                                for (var i = 0; i < page.length; i++) {
                                    if (page.eq(i).attr("class") == "current") {
                                        that.initUserList(page.eq(i).text());
                                    }
                                }
                            }
                        }
                        else{
                            layer.msg("禁用失败");
                        }
                    }
                    that.initUserCheck();
                    return false;
                }, 'json');
            });
        },
        // 导入用户
        initLeadingIn: function () {
            var that = this;
            $('.btn-leading-in').on('click', function () {
                $("#upload_fileName").val("");
                $("#upload").val("");
                layer.open({
                    type: 1,
                    title: '导入用户',
                    shadeClose: true,
                    shade: 0.8,
                    area:["450px","160px"],
                    content:$('.user-leading'),
                    btn:["确定", "取消"],
                    end: function (index, layero) {

                    },
                    yes: function (index, layero) {
                        var file = $("#uploadFile");
                        var fileName = $("#upload_fileName").val();
                        var extension = (fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length)).toLowerCase();//截取文件后缀名
                        if (extension == "xls" || extension == "xlsx") {
                            var options = {
                                url: that.url + '/User/userUpload.do',
                                type: 'post',
                                dataType: 'json',
                                success: function (data) {
                                    layer.close(index);
                                    if (data.result == "success") {
                                        layer.msg("导入完成");
                                        that.initUserList(1);
                                    } else if (data.result == "fileError") {
                                        layer.msg("导入程序错误");
                                    } else {
                                        that.downFailedExcel(data.result);
                                    }
                                }
                            };
                            file.ajaxSubmit(options);
                        } else {
                            layer.msg("请选择xls或xlsx格式文件");
                            return false;
                        }
                    }
                });
            });
        },
        // 导出用户列表
        initLeadingOut: function () {
            var that = this;
            $('.btn-leading-out').on('click', function () {
                layer.open({
                    type: 1,
                    title: '导出用户',
                    shadeClose: true,
                    shade: 0.8,
                    area:["340px","150px"],
                    content:'<div style="font-size: 16px;text-align: center;line-height: 40px;">确定要下载文件吗？</div>',
                    btn:["确定", "取消"],
                    end: function (index, layero) {
                    },
                    yes: function (index, layero) {

                        window.location.href = that.url + "/User/userExportExcel.do?searchWord=" + that.searchWord + "&userStatus=-1";
                        layer.close(index);
                    }
                });

            });
        },
        initDownloadMould: function () {
            var that = this;
            $('#download-template').on('click', function () {
                window.location.href = that.url + "/User/userDownloadMould.do";//下载用户模板
            });
        },
        initUpload: function () {
            $("#upload").on("change", function () {
                var file = $("#upload");
                var holeName = $("#upload").val();
                var name = holeName.split("\\");
                var fileName = name[name.length - 1];
                $("#upload_fileName").val(fileName)
            })
        },

        //获取选中用户的id，返回数组
        getIdGroup: function (flag,userId) {
            var idGroup = [];
            $('.main-list .m-check.m-checked').each(function () {
                var id = $(this).closest('.u-check').attr('id');
                if(flag) {//启用
                    idGroup.push(id);
                }else{ //禁用
                    if(id!=userId){
                        idGroup.push(id);
                    }
                }
            });
            return idGroup;
        },
        //修改密码
        initModifyPassword: function () {
            var that = this;
            $('.a-btn-pwd').on('click', function () {
                $('#user-new-pwd').val("");
                var id = $(this).closest('.u-item').find('.u-check').attr('id');
                layer.open({
                    type: 1,
                    title: '修改密码',
                    shadeClose: true,
                    area:["370px","148px"],
                    shade: 0.8,
                    content:$('.user-modify-pwd'),
                    btn:["确定", "取消"],
                    end: function (index, layero) {
                    },
                    yes: function (index, layero) {
                        var newPwd = $('#user-new-pwd').val();
                        if (newPwd == "") {
                            layer.msg("密码不能为空");
                            return false;
                        }
                        $.post(that.url + "/User/pwdUpdate.do", {//用户密码修改
                            'userId': id,
                            'userPwd': newPwd
                        }, function (data) {
                            if (data.code == 0) {
                                layer.close(index);
                                if (data.result) {
                                    layer.msg("修改成功");
                                }else{
                                    layer.msg("修改失败");
                                }
                            }
                            return false;
                        }, 'json');
                    }
                });
                return false;
            });
        },
        // 部分导入失败，下载失败数据列表excel
        downFailedExcel: function (filePath) {
            var that = this;
            layer.open({
                type: 1,
                title: '部分导入失败',
                shadeClose: true,
                shade: 0.8,
                content:$(".download-failed"),
                btn:["确定", "取消"],
                end: function (index, layero) {
                    that.initUserList(1);
                },
                yes: function (index, layero) {
                    window.location.href = that.url + "/User/userDownloadFailed.do?filePath=" + filePath;//用户数据导出失败
                    that.initUserList(1);
                    layer.close(index);
                }
            });
        },
        // 分配管理员
        allotAdmin: function () {
            var that = this;
            $('.btn-allot-admin').on('click', function () {

                if (that.checked.length === 0) {
                    layer.msg("请选择机构");
                    return false;
                }
                that.adminId = [];
                that.searchTeacherWord = '';
                that.initTeacherList(1);
                that.initSearchTeacher();
                layer.open({
                    type: 1,
                    title: '分配管理员',
                    shadeClose: true,
                    area:["520px","620px"],
                    shade: 0.8,
                    content:$('.allot-admin'),
                    btn:["确定", "取消"],
                    success: function() {
                    },
                    end:function (index, layero) {
                    },
                    yes:function (index, layero) {
                        $.post(that.url + "/User/editUserAdmin.do", {
                            'userId': that.adminId.join(','),
                            'campusIds': that.checked.join(','),
                        }, function (data) {
                            var parseData = JSON.parse(data);
                            if (parseData.code === 0 && parseData.result) {
                                layer.msg('分配成功');
                                that.initUserList(1);
                            } else {
                                layer.msg('分配失败')
                            }
                        })
                        layer.close(index);
                    }
                });

            })
        },
        // 选择管理员
        initSelectAdmin: function () {
            $('.allot-admin').find(':checkbox').each(function(i,n) {
                $(n).unbind('click');
            })
            var that = this;
            $('.allot-admin').find(':checkbox').each(function(i,n) {
                var teacherId = $(n).attr('teacherId');
                if (that.adminId.indexOf(teacherId) > -1) {
                    $(n).prop('checked', true);
                }
                $(n).on('click', function (e) {
                    var isChecked = this.checked;
                    if (isChecked) {
                        $(this).prop('checked', isChecked);
                        that.adminId.push(teacherId);
                    } else {
                        $(this).removeAttr('checked');
                        that.adminId = that.adminId.filter(function (item) {
                            return item != teacherId;
                        });
                    }
                })
            })
        },
        //获取分配管理员教师列表
        initTeacherList: function (page) {
            var that = this;
            var userId = sessionStorage.getItem('userId');

            $.post(that.url + "/Teacher/teacherSearchByPage.do", {
                'page': page,
                'pageSize': 10,
                'searchWord': that.searchTeacherWord,
                'campusId': that.checked.join(','),
                'flag': 'us',
                'userId': userId,
            }, function (data) {
                var totalCount = data.totalCount;
                var html=""
                $.each(data.list,function(ind,value) {
                    var teacherName = value.teacher_name;
                    var mobile = value.mobile;
                    var employeeNo = value.employeeno;
                    var teacherId = value.id;
                    var isAdmin = value.user.user_isAdmin;
                    if (isAdmin === '1' && that.adminId.indexOf(teacherId.toString()) === -1) {
                        that.adminId.push(teacherId.toString());
                    }

                    html += "<div class='item'>" +
                        "<div class='check'>" +
                        "<input type='checkbox' teacherId=" + teacherId + ">" +
                        "</div>" +
                        "<div class='number' title=" + employeeNo + ">" + employeeNo + "</div>" +
                        "<div class='name' title=" + teacherName + ">" + teacherName + "</div>" +
                        "<div class='tel'>" + mobile + "</div>" +
                        "</div>"

                })
                if (page && page == 1) {
                    that.initTeacherPage(totalCount);
                }

                $('.allot-admin-content').html(html);
                that.initSelectAdmin();
            }, 'json');
        },
        //分页
        initTeacherPage: function (count) {
            $('.m-page.allot-admin-page').html('');
            var that = this;
            if (count > 0) {
                var page = new Pagination(count, function (pageIndex) {
                    that.initTeacherList(pageIndex + 1);
                });
                page.init('.m-page.allot-admin-page', 10);
            }

        },
        //搜索教师
        initSearchTeacher: function () {
            var that = this;

            //搜索
            $('.allot-admin .btn-search').on('click', function () {
                that.searchTeacherWord = $('.allot-admin .m-search input').val();
                that.initTeacherList(1);
            });

            $('.allot-admin .m-search input').bind('keypress', function (event) {
                if (event.keyCode == '13') {
                    that.searchTeacherWord = $('.allot-admin .m-search input').val();
                    that.initTeacherList(1);
                }
            });
        },
    }


});
