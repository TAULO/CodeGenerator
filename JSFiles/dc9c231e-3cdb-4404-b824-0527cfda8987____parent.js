define('parent/parent', function (require, exports, module) {
    var $ = require('jquery');
    var Pagination = require('pagination/pagination');
    var SelectList = require('select-list/select');
    var Config = require('configs/configs');
    require('calendar/cxcalendar');
    require('jquery/jquery-form');
    require('libs/layer/layer');
    var ERROR_SAME = -5; //与其他数据重复
    var ERROR = -1;//失败
    var ERROR_NOOBJ =-4;//对象不存在
    module.exports = {
        init: function (storageIp, storagePort) {
            this.url = location.href.substring(0, location.href.lastIndexOf("/"));
            this.storageIp = storageIp;
            this.storagePort = storagePort;
            this.pageNumber = 7;
            this.searchWord = "";
            this.addParent();
            this.initSearch();
            //this.initParentList(1);
            this.initUpload();
            this.initLeadingIn();
            this.initLeadingOut();
            this.initDownloadMould();
            this.initUrls();
            this.previews();
            this.initHeadImage();
            this.initAddHeadImage();
            this.initGetStudent();

        },

        initUrls: function () {
            var userName = $('.user').find('a').first().text();
            $('.nav').find('a').each(function () {
                $(this).attr('href', $(this).attr('href') + '&userName=' + userName);
            });
            $("#guardians> span >span").click(function(){
                $("#guardians> span >span").removeClass("color-gree").find("i").remove();
                $(this).addClass("color-gree").append("<i></i>")
            });
            $("#isTogether> span >span").click(function(){
                $("#isTogether> span >span").removeClass("color-gree").find("i").remove();
                $(this).addClass("color-gree").append("<i></i>")
            });
            $("#guardianss> span >span").click(function(){
                $("#guardianss> span >span").removeClass("color-gree").find("i").remove();
                $(this).addClass("color-gree").append("<i></i>")
            });
            $("#togethers> span >span").click(function(){
                $("#togethers> span >span").removeClass("color-gree").find("i").remove();
                $(this).addClass("color-gree").append("<i></i>")
            });
        },

        //添加家长
        addParent: function () {
            var that = this;

            $('.btn-add-users').on('click', function () {
                $(".add-users").find("img").attr("src", "./images/userimg.png");
                $("#studentRealName").val("");
                $("#parentRealName").val("");
                $("#userMobile").val("");
                $("#userEmail").val("");
                $("#parentNamePy").val("");
                //初始化单选按钮
                $(".select-sf> span >span").removeClass("color-gree").find("i").remove();
                $('#isGuardians').addClass("color-gree").append("<i></i>")
                $('#isT').addClass("color-gree").append("<i></i>")
                //初始化下拉框
                $('#relation').find("input").val(1);
                $('#relation .select-button').val('父亲')
                layer.open({
                    type: 1,
                    title: '添加家长',
                    shadeClose: true,
                    shade: 0.8,
                    content: $('.add-users'),
                    area: ['385px', '520px'],
                    btn: ["确定", "取消"],
                    offset: ['100px', '100px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();

                    },
                    yes: function (index, layero) {
                        var parentGuardian = $('#guardians').find('.color-gree').attr("value");//是否选课
                        var together = $('#isTogether').find('.color-gree').attr("value");//是否选课
                        var studentName = $('#studentName').find("input").val().trim();//学生姓名
                        var parentRealName = $("#parentRealName").val().trim();//家长姓名
                        var userMobile = $("#userMobile").val().trim();//电话
                        var userEmail = $("#userEmail").val().trim();//邮箱
                        var parentNamePy = $("#parentNamePy").val();//姓名拼音
                        var memberShip = $('#relation').find("input").val().trim();//成员关系

                        if (parentRealName.length == 0) {
                            layer.msg("姓名不能为空");
                            return false;
                        }
                        if (parentRealName.length > 45) {
                            layer.msg("姓名请小于45个字符");
                            return false;
                        }
                        if (parentNamePy === '') {
                            layer.msg("拼音不能为空");
                            return false;
                        } else if (!parentNamePy.match(/^[a-zA-z0-9]+$/)) {
                            layer.msg('请输入正确的拼音格式')
                            return false;
                        }
                        if (userEmail != "" && !userEmail.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) {
                            layer.msg("邮箱格式不正确！请重新输入");
                            $("#userEmail").focus();
                            return false;
                        }
                        if(userMobile != "" &&!(/^1(3|4|5|7|8|9)\d{9}$/.test(userMobile))){
                            layer.msg("手机号码格式不正确！请重新输入");
                            return false;
                        }
                        if (userEmail.length == 0 && userMobile.length == 0 ) {
                            layer.msg("手机号码或邮箱至少填写一个");
                            return false;
                        }
                        var userAvatar = $(".headimages").attr("id");
                        $(".headimages").attr("id","userHeadImage");
                        $.post(that.url + "/Parent/parentAdd.do", {
                            'isGuardian': parentGuardian,
                            'namepy':parentNamePy,
                            'studentName':studentName,
                            'isTogether': together,
                            'parentName': parentRealName,
                            'mobile': userMobile,
                            'email': userEmail,
                            'parentRelation': memberShip,
                            'parentAvatar': userAvatar
                        }, function (data) {
                            layer.close(index);
                            if (data.code != 0) {
                                layer.msg("家长增加失败");
                                return false;
                            } else {
                                if (data.result == ERROR_SAME) {
                                    layer.msg("家长已存在或手机邮箱已注册");
                                    return false;
                                }
                                if (data.result == ERROR) {
                                    layer.msg("家长增加失败");
                                    return false;
                                }
                                layer.msg("家长添加成功");
                                that.initParentList(1);
                                return false;
                            }
                        }, 'json');
                        layer.close(index);
                    }
                });
            });
        },

        //获取所有学生
        initGetStudent: function () {
            var that = this;
            $.post(that.url + "/Parent/getStudent.do", function (data) {
                var html = "";

                html += "<option value= ''>全部学生</option>"
                $.each(data.studentList, function (ind, value) {
                    var campus = new Array();
                    $.each(value.user.campuses,function(ind,value){
                        campus.push(value.name);
                    })
                    var realName = value["realName"];
                    var student_code = value["student_code"];
                    if(!campus||campus=="")
                    {
                        campus ="暂无班级";
                    }
                    html += "<option value='" + student_code + "'>" + realName+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+campus + "</option>"
                })
                html += " </select>"

                $('#studentName').html(html);
                $('#e_studentName').html(html);
                var select = new SelectList('#studentName', function (option) {
                });
                select.init();
                document.getElementById("studentName").style.zIndex = "40";
                var select2 = new SelectList('#e_studentName', function (option) {
                });
                select2.init();
                document.getElementById("e_studentName").style.zIndex = "40";
            }, 'json');
        },

        // 修改家长信息
        editParent: function () {
            var that = this;
            $('.btn-edit-users').on('click', function () {
                var id = $(this).closest('.u-item').find('.u-check').attr('id');
                var parentCode = $(this).closest('.u-item').find('.u-check').attr('parentCode');

                $.post(that.url + "/Parent/parentDetails.do", {
                    'parentCode': parentCode,
                    'userId':id,
                    'page': 1,
                    'pageSize':1,
                    'searchWord':""
                }, function (data) {
                    var value = data.userInfo.items[0];
                    if(value.user!=null) {
                        var parentName = value.parent_name;
                        var parentNamePy = value.namepy;
                        var mobile = value.parent_mobile;
                        var email = value.email;
                        var userPath = value.user.user_path;
                        var memberShip = (value.membership == 1 ? "父亲" : (value.membership == 2 ? "母亲" : "其他"));
                        var studentCode = new Array();
                        var studentName = new Array();
                        $.each(value.studentSet,function(ind,value){
                            studentCode.push(value.student_code);
                            studentName.push(value.realName)
                        })
                        var userPath = value.user.user_path;
                        var addr = "http://" + that.storageIp + ":" + that.storagePort;
                        var n = userPath.indexOf("/");//userPath为空为-1
                        if (userPath == "" || n == -1) {
                            userPath = "./images/userimg.png";//获取显示的图片
                        } else {
                            userPath = userPath.substring(n, userPath.length);
                            userPath = addr + userPath;
                        }
                    }
                    $('#e_relation').find("input").val(value.membership);//成员关系
                    $('#e_studentName').find("input").val(studentCode);//学段
                    $('#e_relation .select-button').val(memberShip)//职务
                    $('#e_studentName .select-button').val(studentName)//学段
                    $("#e_userRealName").val(parentName);
                    $("#e_parentNamePy").val(parentNamePy);
                    $("#e_userMobile").val(mobile);
                    $("#e_userEmail").val(email);
                    //初始化选择按钮
                    $(".select-sf> span >span").removeClass("color-gree").find("i").remove();
                    $('#'+value.is_guardian).addClass("color-gree").append("<i></i>")
                    $('#'+value.is_together+value.is_together).addClass("color-gree").append("<i></i>")
                    $(".edit-users").find("img").attr("src",userPath);
                }, 'json');
                layer.open({
                    type: 1,
                    title: '修改家长信息',
                    shadeClose: true,
                    shade: 0.8,
                    content: $('.edit-users'),
                    area: ['385px', '520px'],
                    btn: ["确定", "取消"],
                    offset: ['100px', '100px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();

                    },
                    yes: function (index, layero) {
                        var parentGuardian = $('#guardianss').find('.color-gree').attr("value");//是否在职
                        var together = $('#togethers').find('.color-gree').attr("value");//是否在职
                        var parentName = $("#e_userRealName").val().trim();
                        var parentNamePy = $("#e_parentNamePy").val().trim();
                        var userMobile = $("#e_userMobile").val().trim();
                        var userEmail = $("#e_userEmail").val().trim();
                        var memberShip =$('#e_relation').find("input").val().trim();//成员关系
                        var studentName =$('#e_studentName').find("input").val().trim();//学生姓名
                        var userAvatar = $(".headimages").attr("id");
                        $(".headimages").attr("id","e_userHeadImage");
                        if (parentName.length == 0) {
                            layer.msg("姓名不能为空");
                            return false;
                        }
                        if (parentName.length > 45) {
                            layer.msg("姓名请小于45个字符");
                            return false;
                        }
                        if (parentNamePy === '') {
                            layer.msg("拼音不能为空");
                            return false;
                        } else if (!parentNamePy.match(/^[a-zA-z0-9]+$/)) {
                            layer.msg('请输入正确的拼音格式')
                            return false;
                        }
                        if (userEmail != "" && !userEmail.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) {
                            layer.msg("邮箱格式不正确！请重新输入");
                            $("#userEmail").focus();
                            return false;
                        }
                        if(userMobile != "" &&!(/^1(3|4|5|7|8|9)\d{9}$/.test(userMobile))){
                            layer.msg("手机号码格式不正确！请重新输入");
                            return false;
                        }
                        if (userEmail.length == 0 && userMobile.length == 0 ) {
                            layer.msg("手机号码或邮箱至少填写一个");
                            return false;
                        }
                        $.post(that.url + "/Parent/parentUpdate.do", {//修改用户
                            'parentCode': parentCode,
                            'isGuardian': parentGuardian,
                            'namePy':parentNamePy,
                            'studentName':studentName,
                            'isTogether': together,
                            'parentName': parentName,
                            'mobile': userMobile,
                            'email': userEmail,
                            'parentRelation': memberShip,
                            'parentAvatar': userAvatar
                        }, function (data) {
                            layer.close(index);
                                if (data.code == ERROR_SAME) {
                                    layer.msg("家长已存在或手机邮箱已注册");
                                    return false;
                                }
                                if (data.code == ERROR) {
                                    layer.msg("家长修改失败");
                                    return false;
                                }
                                if (data.code == ERROR_NOOBJ) {
                                    layer.msg("修改对象不存在");
                                    return false;
                                }
                                else{
                                    layer.msg("修改成功");
                                }
                                var page = $(".current");
                                if (page.length < 1) {
                                    that.initParentList(1);
                                } else {
                                    for (var i = 0; i < page.length; i++) {
                                        if (page.eq(i).attr("class") == "current") {
                                            that.initParentList(page.eq(i).text());
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
        //删除成员
        deleteParent: function () {
            var that = this;
            $('.a-btn-delete').on('click', function () {
                var parentCode = $(this).closest('.u-item').find('.u-check').attr('parentcode');
                var status = $(this).closest('.u-item').find('.u-check').attr('status');
                if(status==1)
                {
                    layer.msg("用户已启用无法删除");
                    return false;
                }
                var con = $('.m-delete');
                layer.open({
                    type: 1,
                    title: '删除家长',
                    shadeClose: true,
                    shade: 0.8,
                    content:con,
                    btn:["确定", "取消"],
                    offset: ['200px', '200px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();
                    },
                    yes: function (index, layero) {
                        layer.close(index);
                        $.post(that.url+"/Parent/parentDelete.do", {
                            'id':parentCode
                        }, function (data) {
                            if (data.code == 0) {
                                if (data.value) {
                                    layer.msg("删除成功");
                                    var page = $(".current");
                                    if (page.length < 1) {
                                        that.initParentList(1);
                                    } else {
                                        for (var i = 0; i < page.length; i++) {
                                            if (page.eq(i).attr("class") == "current") {
                                                that.initParentList(page.eq(i).text());
                                            }
                                        }
                                    }
                                    return true;
                                }
                            }
                            layer.msg("删除失败");
                            return false;
                        }, 'json');
                    }
                });
                return false;
            });
        },

        //预览头像
        previews: function () {
            var that = this;
            $("#uploads").on('change', function () {
                var thatt =this
                var flag ="";
                var holeName = $("#uploads").val();
                var name = holeName.split("\\");
                var fileName = name[name.length - 1];
                $("#upload_fileNames").val(fileName)
                var file = $("#uploadFiles");
                var extension = (fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length)).toLowerCase();//截取文件后缀名
                if (!(extension == "bmp" || extension == "jpg" || extension == "png" || extension == "jpeg")) {
                    $("#aaa").attr("style", "display:none");
                    $("#aa").attr("style", "display:none");
                    layer.msg("目前仅支持jpg、png、bmp、jpeg格式的图片");
                    $("#upload_fileNames").val("")
                    return false;
                }

                var options = {
                    url: that.url + '/Parent/parentImageCheck.do',
                    type: 'post',
                    dataType: 'json',
                    success: function (data) {
                        if(data.result>1024){
                            layer.msg("请上传1M以下的图片");
                            $("#upload_fileNames").val("")
                            flag = "false";
                            return false;
                        }
                        else{
                            that.preview(thatt)
                        }
                    }
                };
                file.ajaxSubmit(options)
            })
        },

        //预览头像
        preview: function (file) {
            var prevDiv = document.getElementById('aaa');
            if (file.files && file.files[0]) {
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $("#aaa").find("img").attr("src", evt.target.result);
                    $("#aaa").attr("style", "display: inline");
                    $("#aa").attr("style", "width:100px;height:100px;overflow:hidden");
                    $("#preview").attr("src", evt.target.result);
                }
                reader.readAsDataURL(file.files[0]);
            }
            else {
                prevDiv.innerHTML = '<div class="img" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>';
            }
        },

        //初始化设置头像（修改用）
        initHeadImage: function () {
            var that = this;
            $('#e_userHeadImage').on('click', function () {
                $("#upload_fileNames").val("");
                $("#uploads").val("");
                var id = $(this).attr("id");
                $("#aaa").attr("style", "display:none");
                $("#aa").attr("style", "display:none");
                var con = $('.user-heading');
                layer.open({
                    type: 1,
                    title: '设置头像',
                    shadeClose: true,
                    area:"430px",
                    shade: 0.8,
                    content: $('.user-heading'),
                    btn: ["确定", "取消"],
                    offset: ['100px', '100px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();
                    },
                    yes: function (index, layero) {
                        var file = $("#uploadFiles");
                        var fileName = $("#upload_fileNames").val();
                        if(fileName=="")
                        {
                            layer.msg("请选择图片");
                            return false;
                        }
                        var imageDate = $("#imageData").val();
                        var array = imageDate.split(",");
                        var x = array[0];
                        var y = array[1];
                        var w = array[2];
                        var h = array[3];
                        var width = array[4];
                        var height = array[5];
                        var extension = (fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length)).toLowerCase();//截取文件后缀名
                        if (extension == "bmp" || extension == "jpg" || extension == "png" || extension == "jpeg") {
                            var options = {
                                url: that.url + '/Parent/imageUpload.do?x=' + x + '&y=' + y + '&w=' + w + '&h=' + h + "&width=" + width + "&height=" + height + "&extension=" + extension,
                                type: 'post',
                                dataType: 'json',
                                success: function (data) {
                                    layer.close(index);
                                    var time = data.filename;
                                    if (data.result == "success") {
                                        var src = "./headImage/" + time + "." + extension + "";
                                        $(".headimages").attr("id", time + "." + extension)
                                        $(".edit-users").find("img").attr("src", src)

                                    }
                                    else {
                                        layer.msg("设置头像失败");
                                    }

                                }
                            };
                            file.ajaxSubmit(options);
                        }
                    }
                });
            });
        },

        //初始化设置头像（添加用）
        initAddHeadImage: function () {
            var that = this;

            $('#userHeadImage').on('click', function () {
                $("#upload_fileNames").val("");
                $("#uploads").val("");
                $("#aaa").attr("style", "display:none");
                $("#aa").attr("style", "display:none");
                layer.open({
                    type: 1,
                    title: '设置头像',
                    shadeClose: true,
                    shade: 0.8,
                    area:"430px",
                    content: $('.user-heading'),
                    btn: ["确定", "取消"],
                    offset: ['100px', '100px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();
                    },
                    yes: function (index, layero) {
                        var file = $("#uploadFiles");
                        var fileName = $("#upload_fileNames").val();
                        if(fileName=="")
                        {
                            layer.msg("请选择图片");
                            return false;
                        }
                        var imageDate = $("#imageData").val();
                        var array = imageDate.split(",");
                        var x = array[0];
                        var y = array[1];
                        var w = array[2];
                        var h = array[3];
                        var width = array[4];
                        var height = array[5];
                        var extension = (fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length)).toLowerCase();//截取文件后缀名
                        if (extension == "bmp" || extension == "jpg" || extension == "png" || extension == "jpeg") {
                            var options = {

                                url: that.url + '/Parent/imageUpload.do?x=' + x + '&y=' + y + '&w=' + w + '&h=' + h + "&width=" + width + "&height=" + height + "&extension=" + extension,
                                type: 'post',
                                dataType: 'json',
                                success: function (data) {
                                    layer.close(index);
                                     if (data.result == "success") {
                                        var time = data.filename;
                                        var src = "./headImage/" + time + "." + extension + "";
                                        $(".add-users").find("img").attr("src", src)
                                        $("#userHeadImage").attr("id", time + "." + extension)

                                    }
                                    else {
                                        layer.msg("设置头像失败");
                                    }
                                }
                            };
                            file.ajaxSubmit(options);

                        }

                    }
                });
            });
        },

        // 显示用户信息
        showParentDetails: function () {
            var that = this;
            $('.btn-details').on('click', function () {
                var id = $(this).closest('.u-item').find('.u-check').attr('id');
                var parentCode = $(this).closest('.u-item').find('.u-check').attr('parentCode');

                $.post(that.url + "/Parent/parentDetails.do", {
                    'parentCode': parentCode,
                    'userId':id,
                    'page': 1,
                    'pageSize':1,
                    'searchWord':""
                }, function (data) {
                    var value = data.userInfo.items[0];
                    if(value.user!=null) {
                        var parentName = value.parent_name;
                        var studentName = value.studentNames;
                        var mobile = value.parent_mobile;
                        var email = value.email;
                        var userPath = value.user.user_path;
                        var memberShip = (value.membership == 1 ? "父亲" : (value.membership == 2 ? "母亲" : "其他"));
                        var together = (value.is_together == 1 ? "是" : (value.is_together == "0" ? "否" : ""))
                        var guardian = (value.is_guardian == 1 ? "是" : (value.is_guardian == "0" ? "否" : ""))
                        var addr = "http://" + that.storageIp + ":" + that.storagePort;
                        var n = userPath.indexOf("/");//userPath为空为-1
                        if (userPath == "" || n == -1) {
                            userPath = "./images/userimg.png";//获取显示的图片
                        } else {
                            userPath = userPath.substring(n, userPath.length);
                            userPath = addr + userPath;
                        }
                    }
                    var system_list = "";
                    $.each(data.roleInfo, function (i, value) {
                        system_list += "<li title=" + value + ">" + value + "</li>"
                    })
                    system_list == "" ? system_list = "无" : "";
                    $(".details-name").find('img').attr('src', userPath);
                    $("#details-system-list").html(system_list);
                    $("#details-userRealName").html(parentName);
                    $("#details-userRealName").attr("title", parentName);
                    $("#details-userName").html("用户名：" + value.user.user_name);
                    $("#details-userRelation").html("成员关系：" + memberShip);
                    $("#details-userRelation").attr("title", memberShip);
                    $("#details-studentName").html(studentName);
                    $("#details-studentName").attr("title", studentName);
                    $("#details-email").html(email);
                    $("#details-email").attr("title", email);
                    $("#details-userMobile").html(mobile);
                    $("#details-userMobile").attr("title", mobile);
                    $("#details-guardian").html(guardian);
                    $("#details-guardian").attr("title", guardian);
                    $("#details-istogether").html(together);
                    $("#details-istogether").attr("title", together);
                }, 'json');
                layer.open({
                    type: 1,
                    title: '家长信息',
                    shadeClose: true,
                    shade: 0.8,
                    content: $('.m-details'),
                    btn: ["确定"],
                    offset: ['100px', '100px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();
                    },
                    yes: function (index, layero) {
                        layer.close(index);
                    }
                });
                return false;
            });
        },

        //选中 check
        initUserCheck: function () {
            var checkAll = $('.main-list .m-check-all');
            checkAll.removeClass('m-checked');
            var checks = $('.main-list .m-check');
            // 整条都可以点选
            $('.main-list .u-item').on('click', function () {
                var checkTemp = $(this).find('i');
                if (checkTemp.hasClass('m-checked')) {
                    checkTemp.removeClass('m-checked');
                    $(this).css("background-color", "white");
                } else {
                    checkTemp.addClass('m-checked');
                    $(this).css("background-color", "#eaedf1");
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
                    checks.parent().parent().css("background-color", "white");
                } else {
                    $(this).addClass('m-checked');
                    checks.addClass('m-checked');
                    checks.parent().parent().css("background-color", "#eaedf1");
                }

            });

        },
        //搜索
        initSearch: function () {
            var that = this;
            //搜索
            $('.user-main .btn-search').on('click', function () {
                that.searchWord = $('.user-main .m-search input').val();
                that.initParentList(1);
                that.initUserCheck();
            });

            $('.user-main .m-search input').bind('keypress', function (event) {
                if (event.keyCode == '13') {
                    that.searchWord = $('.user-main .m-search input').val();
                    that.initParentList(1);
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

                    that.initParentList(pageIndex + 1);

                    that.initUserCheck();
                });
                page.init('.m-users.m-page', this.pageNumber);
            }

        },
        //edit on 2017.1.9
        //获取用户列表
        initParentList: function (page, isInit) {
            if (isInit) {
                this.searchWord = '';
            }
            var that = this;
            var userId = sessionStorage.getItem('userId');
            $.post(that.url + "/Parent/parentSearchByPage.do", {
                'page': page,
                'pageSize': that.pageNumber,
                'searchWord': that.searchWord,
                'parentCode': '-1',
                'campusId': that.campusId,
                'userId': userId,
            }, function (data) {
                var totalCount = data.totalCount;
                var html="";
                $.each(data.list,function(ind,value){
                    if(value.user!=null){
                    var userId = value.user.user_id;
                    var parentCode = value.parent_code;
                    var parentId = value.id;
                    var parentName = value.parent_name;
                    var studentName = value.studentNames;
                    var mobile = value.parent_mobile;
                    var email = value.email;
                    var userPath = value.user.user_path;
                    var status = value.user.user_status;
                    var memberShip = (value.membership == 1 ? "父亲" : (value.membership == 2 ? "母亲":"其他"));

                    if (totalCount != 0) {
                        var addr ="http://"+ that.storageIp+":"+that.storagePort;

                        var n = userPath.indexOf("/");//userPath为空为-1
                        if (userPath=="" || n == -1) {
                            userPath =  "./images/userimg.png";//获取显示的图片
                        } else {
                            userPath = userPath.substring(n, userPath.length);
                            userPath = addr + userPath;
                        }
                    }

                    html +="  <div class=\"u-item\">" +
                    "                <div class=\"u-check\" id='" + userId + "' parentCode='" + parentCode + "' parentId='" + parentId + "' status='" + status +"'>" +
                    "                    <i class=\"m-check\" style=\"margin: 31px 0 0 11px\"></i>" +
                    "                </div>" +
                    "                <div class=\"u-name\" title=\"" + parentName + "\">" +
                    "                    <div class=\"user-head\">" +
                    "                        <img src='" + userPath + "'>" +
                    "                        <div class=\"user-con\">" + parentName + "</div>" +
                    "                        <div style=\"clear:both;line-height:0; height:0;\"></div>" +
                    "                    </div>" +
                    "                </div>" +
                    "                <div class=\"u-studentName\" title=\"" + studentName + "\">" + studentName + "</div>" +
                    "                <div class=\"u-tel\" title=\"" + mobile + "\">" + mobile + "</div>" +
                    "                <div class=\"u-email\" title=\"" + email + "\">" + email + "</div>" +
                    "                <div class=\"u-tel\">" + memberShip + "</div>"+
                    "                <div class=\"u-operation\">" +
                    "                    <a href=\"javascript:void(0)\" class=\"a-btn a-btn-details btn-details\" title='用户详情'></a>" +
                    "                    <a href=\"javascript:void(0)\" class=\"a-btn a-btn-edit btn-edit-users\" title='用户编辑'></a>" +
                    "                    <a href=\"javascript:void(0)\" class=\"a-btn a-btn-delete\" title='删除用户'></a>" +
                    "                </div>" +
                    "            </div>";
                    }
                })

                if (page && page == 1) {
                    that.initPage(totalCount);
                }


                $('.main-list .u-item').remove();
                $('.main-list').append(html);


                $('.m-check-all').unbind();
                that.initUserCheck();
                that.deleteParent();
                that.showParentDetails();
                that.editParent();
                that.batchDelete(); // 批量删除
            }, 'json');
        },

        // 导入用户
        initLeadingIn: function () {
            var that = this;
            $('.btn-leading-in').on('click', function () {
                $("#upload_fileName").val("");
                $("#upload").val("");
                layer.open({
                    type: 1,
                    title: '导入家长',
                    shadeClose: true,
                    shade: 0.8,
                    area: ["450px", "160px"],
                    content: $('.user-leading'),
                    btn: ["确定", "取消"],
                    offset: ['100px', '100px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();

                    },
                    yes: function (index, layero) {
                        var file = $("#uploadFile");
                        var fileName = $("#upload_fileName").val();
                        var extension = (fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length)).toLowerCase();//截取文件后缀名
                        if (extension == "xls" || extension == "xlsx") {
                            var options = {
                                url: that.url + '/Parent/parentUpload.do',
                                type: 'post',
                                dataType: 'json',
                                success: function (data) {
                                    layer.close(index);
                                    if (data.result == "success") {
                                        layer.msg("导入完成");
                                        that.initParentList(1);
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
                var campusId = that.campusId;
                layer.open({
                    type: 1,
                    title: '导出家长',
                    shadeClose: true,
                    shade: 0.8,
                    area: ["300px", "130px"],
                    content: '<div style="text-align: center; margin-top: 15px">确定要下载文件吗？</div>',
                    btn: ["确定", "取消"],
                    offset: ['150px', '150px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();
                    },
                    yes: function (index, layero) {

                        window.location.href = that.url + "/Parent/parentExportExcel.do?searchWord=" + that.searchWord+"&campusId="+campusId;
                        layer.close(index);
                    }
                });

            });
        },
        initDownloadMould: function () {
            var that = this;
            $('#download-template').on('click', function () {
                window.location.href = that.url + "/Parent/parentDownloadMould.do";//下载用户模板
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
        getIdGroup: function () {
            var idGroup = [];
            $('.main-list .m-check.m-checked').each(function () {
                var id = $(this).closest('.u-check').attr('id');
                idGroup.push(id);
            });
            return idGroup;
        },

        // 部分导入失败，下载失败数据列表excel
        downFailedExcel: function (filePath) {
            var that = this;
            layer.open({
                type: 1,
                title: '部分导入失败',
                shadeClose: true,
                shade: 0.8,
                content: $(".download-failed"),
                btn: ["确定", "取消"],
                offset: ['100px', '100px'],
                success: function () {
                    $('#layer', window.parent.document).show();
                },
                end: function (index, layero) {
                    $('#layer', window.parent.document).hide();
                    that.initParentList(1);
                },
                yes: function (index, layero) {
                    window.location.href = that.url + "/Parent/parentDownloadFailed.do?filePath=" + filePath;//用户数据导出失败
                    that.initParentList(1);
                    layer.close(index);
                }
            });
        },
        //    根据机构id获取parentlist
        initParentListByCampusId: function (campusId) {
            this.campusId = campusId;
            this.initParentList(1, true);
            $('.m-search input').val('');
        },
        //    批量删除
        batchDelete: function () {
            var that = this;
            $('#btn-batch-delete').unbind('click');
            $('#btn-batch-delete').on('click', function () {
                that.selected = [];
                $('i.m-check.m-checked').each(function(index, element) {
                    that.selected.push($(this).parent().attr('parentid'));
                })
                var pIds = that.selected.join(',')
                if (that.selected.length === 0) {
                    layer.msg('请先选择人员');
                } else {
                    $.post(that.url + "/Parent/parentsDelete.do", {
                        pIds: pIds,
                    }, function(result) {
                        var data = JSON.parse(result);
                        if (data.code === 0 && data.value) {
                            layer.msg('删除成功');
                            var page = $(".current");
                            if (page.length < 1) {
                                that.initParentList(1);
                            } else {
                                for (var i = 0; i < page.length; i++) {
                                    if (page.eq(i).attr("class") == "current") {
                                        that.initParentList(page.eq(i).text());
                                    }
                                }
                            }
                        } else {
                            layer.msg('删除失败');
                        }
                    })
                }
            })
        }

    }
});