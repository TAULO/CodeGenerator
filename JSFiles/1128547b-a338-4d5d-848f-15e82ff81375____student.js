define('student/student', function (require, exports, module) {

    var $ = require('jquery');
    var Pagination = require('pagination/pagination');
    var SelectList = require('select-list/select');
    var Config = require('configs/configs');
    require('calendar/cxcalendar');
    require('jquery/jquery-form');
    require('libs/layer/layer');
    var  PAGESIZE="7";
    var  CURRENTPAGE = "1";
    var ERROR_SAME = -5; //与其他数据重复
    var ERROR = -1;//失败
    var ERROR_NOOBJ =-4;//对象不存在
    module.exports = {
        init: function (storageIp,storagePort) {
            this.url = location.href.substring(0, location.href.lastIndexOf("/"));
            this.storageIp = storageIp;
            this.storagePort = storagePort;
            this.pageNumber = 7;
            this.searchWord = "";
            this.addStudent();
            //this.getSelectPeople();
            this.initSearch();
            //this.initStudentList(1);
            this.initUpload();
            this.initLeadingIn();
            this.initLeadingOut();
            this.initDownloadMould();
            this.initUrls();
            this.previews();
            this.initHeadImage();
            this.initAddHeadImage();
            this.closedates();
        },

        closedates: function(){
            $(document).on("click","#studentBirthday,#year,#e_studentBirthday,#e_year,.cxcalendar",function(){
                $(this).unbind("click");
                $(document).bind("click",function(){
                    $(".cxcalendar").hide();
                    $('.cxcalendar_lock').hide();
                })
                return false
            })
        },

        initUrls: function(){
            var userName = $('.user').find('a').first().text();
            $('.nav').find('a').each(function(){
                $(this).attr('href',$(this).attr('href')+'&userName=' + userName);
            });
            $("#sex> span >span").click(function(){
                $("#sex> span >span").removeClass("color-gree").find("i").remove();
                $(this).addClass("color-gree").append("<i></i>")
            });
            $("#e_sex> span >span").click(function(){
                $("#e_sex> span >span").removeClass("color-gree").find("i").remove();
                $(this).addClass("color-gree").append("<i></i>")
            });
        },

        addStudent: function () {
            var that = this;
            var userId = sessionStorage.getItem('userId');
            $('.btn-add-users').on('click', function () {
                // 获取机构树数据
                $.post(that.url + "/Campus/campusTree.do", {
                    'userId': userId
                }, function (data) {
                    that.initCampusTree(JSON.parse(data));  // 初始化机构树

                })
                $(".add-users").find("img").attr("src","./images/userimg.png");
                //初始化input框
                $("#studentName").val("");
                $("#pinyin").val("");
                $("#studentNum").val("");
                $("#studentBirthday").val("");
                $("#year").val("");
                $("#userMobile").val("");
                $("#userEmail").val("");
                $('#userAddress').val("");
                //初始化单选按钮
                $(".select-sf> span >span").removeClass("color-gree").find("i").remove();
                $('#ss').addClass("color-gree").append("<i></i>");
                //初始化下拉框
                $('#studytype').find("input").val(1);
                $('#entertype').find("input").val(1);
                $('#select-people').find("input").val('汉族');
                $('#status').find("input").val('1');
                $('#status .select-button').val('在校')
                $('#studytype .select-button').val('走读')
                $('#entertype .select-button').val('普通入学')
                $('#select-people .select-button').val('汉族')
                layer.open({
                    type: 1,
                    title: '添加学生',
                    shadeClose: true,
                    shade: 0.8,
                    content:$('.add-users'),
                    area:['410px','590px'],
                    btn:["确定", "取消"],
                    offset: ['100px', '100px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();
                        $('.cxcalendar').hide();
                        $('.cxcalendar_lock').hide();
                        that.campus = ''; // 清除选择的机构id
                    },
                    yes:function (index, layero) {
                        $('.cxcalendar').hide();
                        $('.cxcalendar_lock').hide();
                        var realName = $("#studentName").val();//真实姓名
                        var namepy = $("#pinyin").val();//拼音
                        var student_num = $("#studentNum").val();//学生编号
                        var birthday = $("#studentBirthday").val();//生日
                        var enter_year = $("#year").val();//入学年度
                        var mobile = $("#userMobile").val();//电话
                        var email = $("#userEmail").val();//邮箱
                        var address = $('#userAddress').val();//地址
                        var gender = $('#sex').find('.color-gree').attr("value");//性别
                        var status = $('#status').find("input").val().trim();//在校状态
                        var enter_way = $('#entertype').find("input").val().trim();//入学方式
                        var readtype = $('#studytype').find("input").val().trim();//就读方式
                        var nation = $('#select-people').find("input").val().trim();//民族
                        var userAvatar =$(".headimages").attr("id");
                        var campus = sessionStorage.getItem('campusId');
                        $(".headimages").attr("id","userHeadImage");
                        if (realName.length == 0) {
                            layer.msg("姓名不能为空");
                            return false;
                        }
                        var pattern = new RegExp("[~'!@#￥$%^&*()-+_=:]");
                        if(pattern.test(realName)){
                            layer.msg("姓名不能有~'!@#￥$%等特殊字符");
                            return false;
                        }
                        if (realName.length > 45) {
                            layer.msg("姓名请小于45个字符");
                            return false;
                        }
                        if (namepy === '') {
                            layer.msg("拼音不能为空");
                            return false;
                        } else if (!namepy.match(/^[a-zA-z0-9]+$/)) {
                            layer.msg('请输入正确的拼音格式')
                            return false;
                        }
                        if (!student_num) {
                            layer.msg("学籍号不能为空");
                            return false;
                        }
                        if (student_num !== '' && !student_num.match(/^[a-zA-z0-9]+$/)) {
                            layer.msg('学籍号只能为数字或字母');
                            return false;
                        }
                        if (email != "" && !email.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) {
                            layer.msg("邮箱格式不正确！请重新输入");
                            $("#userEmail").focus();
                            return false;
                        }
                        if(mobile != "" && !(/^1(3|4|5|7|8|9)\d{9}$/.test(mobile))){
                            layer.msg("手机号码格式不正确！请重新输入");
                            return false;
                        }
                        if (student_num.length == 0 && email.length == 0 && mobile.length == 0) {
                            layer.msg("手机号码或邮箱至少填写一个");
                            return false;
                        }
                        if(enter_year != "" && !(/^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))$/.test(enter_year))){
                            layer.msg("入学年度格式不正确，请重新输入");
                            return false;
                        }
                        if(birthday != "" && !(/^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))$/.test(birthday))){
                            layer.msg("出生年月格式不正确，请重新输入");
                            return false;
                        }
                        if((enter_year<birthday)&&birthday != ""&&enter_year !="")
                        {
                            layer.msg("入学日期不能小于出生日期");
                            return false;
                        }
                        // if (!campus) {
                        //     layer.msg("机构不能为空");
                        //     return false;
                        // }
                        $.post(that.url + "/Student/studentAdd.do", {
                             'studentName':realName,
                             'studentNamePy' :namepy,
                             'studentNo':student_num,
                             'birthday' :birthday,
                             'schoolYear': enter_year,
                             'studentMobile':mobile,
                             'studentEmail': email,
                             'studentAddress': address,
                             'gender':gender,
                             'studentState':status,
                             'enterType': enter_way,
                             'studentType': readtype,
                             'nation':nation,
                             'studentAvatar': userAvatar,
                            'campusId': campus

                        }, function (data) {
                            layer.close(index);
                            if (data.code != 0) {
                                layer.msg("学生增加失败");
                                return false;
                            } else {
                                /*if (data.result == ERROR_SAME) {
                                    layer.msg("学生已存在或手机邮箱已注册");
                                    return false;
                                }*/
                                if (data.result!="" && data.result.indexOf(",")>-1) {
                                    layer.msg(data.result);
                                    return false;
                                }
                                if (data.result == ERROR) {
                                    layer.msg("学生添加失败");
                                    return false;
                                }
                                layer.msg("学生添加成功");
                                that.initStudentList(1);
                                return false;
                            }
                        }, 'json');
                        layer.close(index);
                    }
                });
            });
        },

        // 修改用户信息
        editStudent: function () {
            var that = this;
            var userId = sessionStorage.getItem('userId');

            $('.btn-edit-users').on('click', function () {
                // 获取机构树数据
                $.post(that.url + "/Campus/campusTree.do", {
                    'userId': userId
                }, function (data) {
                    that.initCampusTree(JSON.parse(data));  // 初始化机构树

                })

                var id = $(this).closest('.u-item').find('.u-check').attr('id');
                var studentCode = $(this).closest('.u-item').find('.u-check').attr('studentcode');
                $.post(that.url + "/Student/studentDetails.do", {
                    'studentCode': studentCode,
                    'userId':id,
                    'page': 1,
                    'pageSize':1,
                    'searchWord':""
                }, function (data) {
                    var value = data.userInfo.items[0];
                    if(value.user!=null) {
                        var userId = value.user.user_id;//用户id
                        var address = value.address;//地址
                        var birthday = value.birthday;//生日
                        var email = value.email;//邮箱
                        var enter_way = (value.enter_way == 1 ? "普通入学" : (value.enter_way == 2 ? "体育特招" : (value.enter_way == 3 ? "外校转入" : "其他")));//入学方式
                        var enter_year = value.enter_year;//入学年度
                        var nation = value.nation;//民族
                        var namepy = value.namepy;//拼音
                        var email = value.email;//邮箱
                        var mobile = value.mobile;//手机
                        var gender = (value.gender == 1 ? "男" : (value.gender == 2 ? "女":"未知"));//性别
                        var readtype = (value.readtype  == 1 ? "走读" : (value.readtype  == 2 ? "住宿" : (value.readtype  == 3 ? "借宿" : "其他")));//走读方式
                        var realName = value.realName;//真实姓名
                        var student_code = value.student_code;//学生编码
                        var student_num = value.student_num;//学生编号
                        var userPath =value.student_path;//头像地址
                        var studentId =value.id;//学生id
                        var status = (value.status == 1 ? "在校" : (value.status ==2?"离校":"已毕业"))
                        var campus = new Array();//组织机构

                        that.campus = value.user.campuses[0].id; // 设置机构id
                        $('.campus-title').html( value.user.campuses[0].name);  // 设置机构名字

                        $.each(value.user.campuses,function(ind,value){
                            campus.push(value.name);
                        })
                        var addr ="http://"+ that.storageIp+":"+that.storagePort;

                        var n = userPath.indexOf("/");//userPath为空为-1
                        if (userPath=="" || n == -1) {
                            userPath =  "./images/userimg.png";//获取显示的图片
                        } else {
                            userPath = userPath.substring(n, userPath.length);
                            userPath = addr + userPath;
                        }

                    }
                    $('#e_studytype').find("input").val(value.readtype);//就读方式
                    $('#e_entertype').find("input").val(value.enter_way);//入学方式
                    $('#e_select-people').find("input").val(nation);//学段
                    $('#e_status').find("input").val(value.status);//学段
                    $('#e_status .select-button').val(status)//就读方式
                    $('#e_studytype .select-button').val(readtype)//就读方式
                    $('#e_entertype .select-button').val(enter_way)//入学方式
                    $('#e_select-people .select-button').val(nation)//职务
                    $("#e_userRealName").val(realName);
                    $("#e_pinyin").val(namepy);
                    $("#e_userNum").val(student_num);
                    $("#e_studentBirthday").val(birthday);
                    $("#e_year").val(enter_year);
                    $("#e_userMobile").val(mobile);
                    $("#e_userEmail").val(email);
                    $("#e_userAddress").val(address);
                    $(".edit-users").find("img").attr("src",userPath);
                    $(".select-sf> span >span").removeClass("color-gree").find("i").remove();
                    $('#'+value.gender+value.gender).addClass("color-gree").append("<i></i>")

                }, 'json');
                layer.open({
                    type: 1,
                    title: '修改学生信息',
                    shadeClose: true,
                    shade: 0.8,
                    content:$('.edit-users'),
                    area:['410px','520px'],
                    btn:["确定", "取消"],
                    offset: ['100px', '100px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();
                        $('.cxcalendar').hide();
                        $('.cxcalendar_lock').hide();
                        that.campus = ''; // 清空机构id
                    },
                    yes:function (index, layero) {
                        $('.cxcalendar').hide();
                        $('.cxcalendar_lock').hide();
                        var gender = $('#e_sex').find('.color-gree').attr("value");//性别
                        var realName = $("#e_userRealName").val();//真实姓名
                        var namepy = $("#e_pinyin").val();//拼音
                        var student_num = $("#e_userNum").val();//学生编号
                        var birthday = $("#e_studentBirthday").val();//生日
                        var enter_year = $("#e_year").val();//入学年度
                        var mobile = $("#e_userMobile").val();//电话
                        var email = $("#e_userEmail").val();//邮箱
                        var address = $('#e_userAddress').val();//地址
                        var status = $('#e_status').find("input").val().trim();//在校状态
                        var enter_way = $('#e_entertype').find("input").val().trim();//入学方式
                        var readtype = $('#e_studytype').find("input").val().trim();//就读方式
                        var nation = $('#e_select-people').find("input").val().trim();//民族
                        var userAvatar =$(".headimage").attr("id");
                        $(".headimage").attr("id","e_userHeadImage");
                        if (realName.length == 0) {
                            layer.msg("姓名不能为空");
                            return false;
                        }
                        if (!student_num) {
                            layer.msg("学籍号不能为空");
                            return false;
                        }
                        if (realName.length > 45) {
                            layer.msg("姓名请小于45个字符");
                            return false;
                        }
                        if (namepy === '') {
                            layer.msg("拼音不能为空");
                            return false;
                        } else if (!namepy.match(/^[a-zA-z0-9]+$/)) {
                            layer.msg('请输入正确的拼音格式')
                            return false;
                        }
                        if (student_num !== '' && !student_num.match(/^[a-zA-z0-9]+$/)) {
                            layer.msg('学籍号只能为数字或字母');
                            return false;
                        }
                        if (email != "" && !email.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) {
                            layer.msg("邮箱格式不正确！请重新输入");
                            $("#userEmail").focus();
                            return false;
                        }
                        if(mobile != "" &&!(/^1(3|4|5|7|8|9)\d{9}$/.test(mobile))){
                            layer.msg("手机号码格式不正确！请重新输入");
                            return false;
                        }
                        if (student_num.length == 0 && email.length == 0 && mobile.length == 0) {
                            layer.msg("手机号码或邮箱至少填写一个");
                            return false;
                        }
                        if(enter_year != "" && !(/^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))$/.test(enter_year))){
                            layer.msg("入学年度格式不正确，请重新输入");
                            return false;
                        }
                        if(birthday != "" && !(/^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))$/.test(birthday))){
                            layer.msg("出生年月格式不正确，请重新输入");
                            return false;
                        }
                        if((enter_year<birthday)&&birthday != ""&&enter_year !="")
                        {
                            layer.msg("入学日期不能小于出生日期");
                            return false;
                        }
                        $.post(that.url + "/Student/studentUpdate.do", {
                            'studentCode':studentCode,
                            'studentName':realName,
                            'studentNamePy' :namepy,
                            'studentNo':student_num,
                            'birthday' :birthday,
                            'schoolYear': enter_year,
                            'studentMobile':mobile,
                            'studentEmail': email,
                            'studentAddress': address,
                            'gender':gender,
                            'studentState':status,
                            'enterType': enter_way,
                            'studentType': readtype,
                            'nation':nation,
                            'studentAvatar': userAvatar,
                            'campusId': that.campus
                        }, function (data) {
                            layer.close(index);
                                /*if (data.code == ERROR_SAME) {
                                    layer.msg("学生已存在或手机邮箱已注册");
                                    return false;
                                }*/
                                if (data.code !=null && data.code.indexOf(",")>-1) {
                                    layer.msg(data.code);
                                    return false;
                                }
                                if (data.code == ERROR) {
                                    layer.msg("学生修改失败");
                                    return false;
                                }
                                if (data.code == ERROR_NOOBJ) {
                                    layer.msg("修改对象不存在");
                                    return false;
                                }
                                else {
                                layer.msg("修改成功");
                                }
                                var page = $(".current");
                                if (page.length < 1) {
                                    that.initStudentList(1);
                                } else {
                                    for (var i = 0; i < page.length; i++) {
                                        if (page.eq(i).attr("class") == "current") {
                                            that.initStudentList(page.eq(i).text());
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
        //getSelectPeople:function(){
        //    var that = this;
        //    $.post(that.url+"/Student/getPeopleByProperties.do",function(data){
        //        var html="";
        //        var name = data.name.split(",");
        //        var val = data.value.split(",");
        //        for(var i=0;i<name.length;i++){
        //            html+="<option value='"+val[i]+"'>"+name[i]+"</option>";
        //        }
        //        $("#select-people").html(html);
        //        $("#e_select-people").html(html);
        //        var select = new SelectList('#select-people,#e_select-people', function (option) {
        //        });
        //        select.init();
        //        document.getElementById("select-people").style.zIndex = "60";
        //        document.getElementById("e_select-people").style.zIndex = "60";
        //
        //    },'json')
        //},

        //删除成员
        deleteStudent: function () {
            var that = this;
            $('.a-btn-delete').on('click', function () {
                var studentCode = $(this).closest('.u-item').find('.u-check').attr('studentcode');
                var status = $(this).closest('.u-item').find('.u-check').attr('status');
                if(status==1)
                {
                    layer.msg("用户已启用无法删除");
                    return false;
                }
                //var con = $('.m-delete');
                var con = '<p class="delete-role-confirm" style="text-align: center ; line-height: 40px;font-size: 15px">确认删除该学生吗?</p>';  //update by caoqian

                layer.open({
                    type: 1,
                    title: '删除学生',
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
                        $.post(that.url+"/Student/studentDelete.do", {
                            'id':studentCode
                        }, function (data) {
                            if (data.code == 0) {
                                if (data.value) {
                                    layer.msg("删除成功");
                                    var page = $(".current");
                                    if (page.length < 1) {
                                        that.initStudentList(1);
                                    } else {
                                        for (var i = 0; i < page.length; i++) {
                                            if (page.eq(i).attr("class") == "current") {
                                                that.initStudentList(page.eq(i).text());
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
                    url: that.url + '/Student/studentImageCheck.do',
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
            $('#e_userHeadImage').on('click', function () {
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
                    area:"430px",
                    content:$('.user-heading'),
                    btn:["确定", "取消"],
                    offset: ['100px', '100px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();
                    },
                    yes:function (index, layero) {
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
                        if (extension == "bmp" || extension == "jpg" || extension == "png"|| extension == "jpeg") {
                            var options = {
                                url: that.url + '/Teacher/imageUpload.do?x=' + x + '&y=' + y + '&w=' + w + '&h=' + h + "&width=" + width + "&height=" + height + "&extension=" + extension,
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
                    area:"430px",
                    content:$('.user-heading'),
                    btn:["确定", "取消"],
                    offset: ['100px', '100px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();
                    },
                    yes:function (index, layero) {
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
                        if (extension == "bmp" || extension == "jpg" || extension == "png"|| extension == "jpeg") {
                            var options = {

                                url: that.url + '/Teacher/imageUpload.do?x=' + x + '&y=' + y + '&w=' + w + '&h=' + h + "&width=" + width + "&height=" + height + "&extension=" + extension,
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
        showStudentDetails: function () {
            var that = this;
            $('.btn-details').on('click', function () {
                var id = $(this).closest('.u-item').find('.u-check').attr('id');
                var studentCode = $(this).closest('.u-item').find('.u-check').attr('studentCode');
                $.post(that.url + "/Student/studentDetails.do", {
                    'studentCode': studentCode,
                    'userId':id,
                    'page': 1,
                    'pageSize':1,
                    'searchWord':""
                }, function (data) {
                    var value = data.userInfo.items[0];
                    if(value.user!=null) {
                        var userName = value.namepy; // 用户名
                        var userId = value.user.user_id;//用户id
                        var address = value.address;//地址
                        var birthday = value.birthday;//生日
                        var email = value.email;//邮箱
                        var enter_way = (enter_way == 1 ? "普通入学" : enter_way == 2 ? "体育特招" : (enter_way == 3 ? "外校转入" : "其他"));//入学方式
                        var enter_year = value.enter_year;//入学年度
                        var nation = value.nation;//民族
                        var email = value.email;//邮箱
                        var mobile = value.mobile;//手机
                        var gender = (value.gender == 1 ? "男" : (value.gender == 2 ? "女":"未知"));//性别
                        var readtype = value.readtype  == 1 ? "走读" : value.readtype  == 2 ? "住宿" : (value.readtype  == 3 ? "借宿" : "其他")//走读方式
                        var realName = value.realName;//真实姓名
                        var student_code = value.student_code;//学生编码
                        var student_num = value.student_num;//学生编号
                        var userPath =value.student_path;//头像地址
                        var studentId =value.id;//学生id
                        var status = (value.status == 1 ? "在校" : (value.status ==2?"离校":"其他"))
                        var campus = new Array();//组织机构
                        $.each(value.user.campuses,function(ind,value){
                            campus.push(value.name);
                        })
                            var addr ="http://"+ that.storageIp+":"+that.storagePort;

                            var n = userPath.indexOf("/");//userPath为空为-1
                            if (userPath=="" || n == -1) {
                                userPath =  "./images/userimg.png";//获取显示的图片
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
                    $(".details-name").find('img').attr('src',userPath);
                    $("#details-system-list").html(system_list);
                    $("#details-userRealName").html(realName);
                    $("#details-userRealName").attr("title",realName);
                    $("#details-userName").html("用户名：" + userName);
                    $("#details-userName").attr("title",student_num);
                    $("#details-userSex").html("组织机构：" + campus);
                    $("#details-userNum").html("民族：" + nation);
                    $("#details-userNum").attr("title",nation);
                    $("#details-userBrithday").html(birthday);
                    $("#details-userBrithday").attr("title",birthday);
                    $("#details-userGender").html(gender);
                    $("#details-userMobile").html(mobile);
                    $("#details-userMobile").attr("title",mobile);
                    $("#details-userEmail").html(email);
                    $("#details-userEmail").attr("title",email);
                    $("#details-userAddr").html(address);
                    $("#details-userAddr").attr("title",address);
                    $("#details-studytype").html(readtype);
                    $("#details-studytype").attr("title",readtype);
                    $("#details-userStatus").html(status);
                    $("#details-userStatus").attr("title",status);
                    $("#details-enteryear").html(enter_year);
                    $("#details-enteryear").attr("title",enter_year);
                    $("#details-entertype").html(enter_way);
                }, 'json');

                layer.open({
                    type: 1,
                    title: '学生信息',
                    shadeClose: true,
                    shade: 0.8,
                    content:$('.m-details'),
                    btn:["确定"],
                    offset: ['100px', '100px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();
                    },
                    yes:function (index, layero) {
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
            $('.user-main .btn-search').on('click', function () {
                that.searchWord = $('.user-main .m-search input').val();
                that.initStudentList(1);
                that.initUserCheck();
            });

            $('.user-main .m-search input').bind('keypress', function (event) {
                if (event.keyCode == '13') {
                    that.searchWord = $('.user-main .m-search input').val();
                    that.initStudentList(1);
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
                    that.initStudentList(pageIndex + 1);
                    that.initUserCheck();
                });
                page.init('.m-users.m-page', this.pageNumber);
            }

        },

        //获取学生列表
        initStudentList: function (page, isInit) {
            if (isInit) {
                this.searchWord = '';
            }
            var that = this;
            var userId = sessionStorage.getItem('userId');
            $.post(that.url + "/Student/studentSearchByPage.do", {
                'page': page,
                'pageSize': PAGESIZE,
                'searchWord': that.searchWord,
                'parentCode': '-1',
                'campusId': that.campusId,
                'userId': userId
            }, function (data) {
                var totalCount = data.totalCount;
                var html = "";
                $.each(data.list, function (ind, value) {
                    if(value.user!=null) {
                    var userId = value.user.user_id;//用户id
                    var status = value.user.user_status;
                    var address = value.address;//地址
                    var birthday = value.birthday;//生日
                    var email = value.email;//邮箱
                    var enter_way = value.enter_way;//入学方式
                    var enter_year = value.enter_year?value.enter_year:"";//入学年度
                    var nation = value.nation;//民族
                    var email = value.email;//邮箱
                    var mobile = value.mobile;//手机
                    var gender = (value.gender == 1 ? "男" : (value.gender == 2 ? "女" : "未知"));//性别
                    var readtype = value.readtype;//走读方式
                    var realName = value.realName;//真实姓名
                    var student_code = value.student_code;//学生编码
                    var student_num = value.student_num;//学生编号
                    var userPath = value.student_path;//头像地址
                    var studentId = value.id;//学生id
                    var campus = new Array();//组织机构
                    $.each(value.user.campuses, function (ind, value) {
                        campus.push(value.name);
                    })

                    if (totalCount != 0) {
                        var addr = "http://" + that.storageIp + ":" + that.storagePort;

                        var n = userPath.indexOf("/");//userPath为空为-1
                        if (userPath == "" || n == -1) {
                            userPath = "./images/userimg.png";//获取显示的图片
                        } else {
                            userPath = userPath.substring(n, userPath.length);
                            userPath = addr + userPath;
                        }
                    }

                    html += "  <div class=\"u-item\">" +
                    "                <div class=\"u-check\" id='" + userId + "' studentCode='" + student_code + "' studentId='" + studentId + "' status='" + status + "'>" +
                    "                    <i class=\"m-check\" style=\"margin: 31px 0 0 11px\"></i>" +
                    "                </div>" +
                    "                <div class=\"u-name\" title=\"" + realName + "\">" +
                    "                    <div class=\"user-head\">" +
                    "                        <img src='" + userPath + "'>" +
                    "                        <div class=\"user-con\">" + realName + "</div>" +
                    "                        <div style=\"clear:both;line-height:0; height:0;\"></div>" +
                    "                    </div>" +
                    "                </div>" +
                    "                <div class=\"u-number\" title=\"" + student_num + "\">" + student_num + "</div>" +
                    "                <div class=\"u-class\" title=\"" + campus + "\">" + campus + "</div>" +
                    "                <div class=\"u-sex\" title=\"" + gender + "\">" + gender + "</div>" +
                    "                <div class=\"u-tel\" title=\"" + mobile + "\">" + mobile + "</div>" +
                    "                <div class=\"u-email2\" title=\"" + email + "\">" + email + "</div>" +
                    "                <div class=\"u-year\" title=\"" + enter_year + "\">" + enter_year + "</div>" +
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
                that.showStudentDetails();
                that.editStudent();
                that.deleteStudent();
                that.batchDelete(); // 批量删除
            }, 'json');
        },

        // 导入学生
        initLeadingIn: function () {
            var that = this;
            $('.btn-leading-in').on('click', function () {
                $("#upload_fileName").val("");
                $("#upload").val("");
                layer.open({
                    type: 1,
                    title: '导入学生',
                    shadeClose: true,
                    shade: 0.8,
                    area:["450px","160px"],
                    content:$('.user-leading'),
                    btn:["确定", "取消"],
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
                                url: that.url + '/Student/studentUpload.do',
                                type: 'post',
                                dataType: 'json',
                                success: function (data) {
                                    layer.close(index);
                                    if (data.result == "success") {
                                        layer.msg("导入完成");
                                        that.initStudentList(1);
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
                console.log('campusId', campusId);

                layer.open({
                    type: 1,
                    title: '导出学生',
                    shadeClose: true,
                    shade: 0.8,
                    area:["300px","130px"],
                    content:'<div style="text-align: center; margin-top: 15px">确定要下载文件吗？</div>',
                    btn:["确定", "取消"],
                    offset: ['150px', '150px'],
                    success: function () {
                        $('#layer', window.parent.document).show();
                    },
                    end: function (index, layero) {
                        $('#layer', window.parent.document).hide();
                    },
                    yes: function (index, layero) {

                        window.location.href = that.url + "/Student/studentExportExcel.do?searchWord=" + that.searchWord+"&campusId="+campusId;
                        layer.close(index);
                    }
                });

            });
        },
        initDownloadMould: function () {
            var that = this;
            $('#download-template').on('click', function () {
                window.location.href = that.url + "/Student/studentDownloadMould.do";//下载用户模板
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
                content:$(".download-failed"),
                btn:["确定", "取消"],
                offset: ['100px', '100px'],
                success: function () {
                    $('#layer', window.parent.document).show();
                },
                end: function (index, layero) {
                    $('#layer', window.parent.document).hide();
                    that.initStudentList(1);
                },
                yes: function (index, layero) {
                    window.location.href = that.url + "/Student/studentDownloadFailed.do?filePath=" + filePath;//用户数据导出失败
                    that.initStudentList(1);
                    layer.close(index);
                }
            });
        },
        //        初始化下拉机构树

        initCampusTree: function(data) {
            var that = this;
            $('.campusTree').hide();
            var flag = false;
            $('.campus-title').on('click',function () {
                flag = !flag;
                if (flag) {
                    $('.campusTree').slideDown(200);
                } else {
                    $('.campusTree').slideUp(200);
                }
            })
            // 选择的机构名字
            var name = '';
            $('.campus-title').html(name);
            var zTreeObj;
            // zTree 的参数配置）
            var setting = {
                view: {
                    showIcon: false,
                    showLine: false,
                },
                callback: {
                    onClick: function (e, treeId, treeNode) {
                        var id = treeNode.id;
                        name = treeNode.name;
                        $('.campus-title').html(name);
                        that.campus = id;
                    }
                }
            };
            var formateDate = this.formateCampusData([data]);
            zTreeObj = $.fn.zTree.init($(".campusTree"), setting, formateDate);
            $('.campusTree a').each(function () {
                $(this).on('click', function () {
                    flag = false;
                    $('.campusTree').slideUp(200);
                })
            })
        },
        //        格式化机构树数据
        formateCampusData: function (dataArr) {
            var that = this;
            var result = [];
            if (dataArr && dataArr.length > 0) {
                result =  dataArr.map(function (item) {
                    return {
                        name: item.name,
                        id: item.id,
                        open: true,
                        children: that.formateCampusData(item.directories)
                    }
                })
            }
            return result;
        },
        //    根据机构id获取studentlist
        initStudentListByCampusId: function (campusId) {
            this.campusId = campusId;
            this.initStudentList(1, true);
            $('.m-search input').val('');

        },
        //    批量删除
        batchDelete: function () {
            var that = this;
            $('#btn-batch-delete').unbind('click');
            $('#btn-batch-delete').on('click', function () {
                that.selected = [];
                $('i.m-check.m-checked').each(function(index, element) {
                    that.selected.push($(this).parent().attr('studentid'));
                })
                var studentIds = that.selected.join(',')
                if (that.selected.length === 0) {
                    layer.msg('请先选择人员');
                } else {
                    /*$.post(that.url + "/Student/studentsDelete.do", {
                        studentIds: studentIds
                    }, function(result) {
                        var data = JSON.parse(result);
                        if (data.code === 0 && data.value) {
                            layer.msg('删除成功');
                            var page = $(".current");
                            if (page.length < 1) {
                                that.initStudentList(1);
                            } else {
                                for (var i = 0; i < page.length; i++) {
                                    if (page.eq(i).attr("class") == "current") {
                                        that.initStudentList(page.eq(i).text());
                                    }
                                }
                            }
                        } else {
                            layer.msg('删除失败');
                        }
                    })*/
                    //update by caoqian 增加删除提示
                    var con = '<p class="delete-role-confirm" style="text-align: center ; line-height: 40px;font-size: 15px">确认删除学生吗?</p>';  // update by caoqian
                    layer.open({
                        type: 1,
                        title: '删除学生',
                        shadeClose: true,
                        offset: ['200px', '200px'],
                        shade: 0.8,
                        content:con,
                        btn:["确定", "取消"],
                        success: function () {
                            $('#layer', window.parent.document).show();
                        },
                        end: function (index, layero) {
                            $('#layer', window.parent.document).hide();
                        },
                        yes: function (index, layero) {
                            layer.close(index);
                            $.post(that.url + "/Student/studentsDelete.do", {
                                studentIds: studentIds
                            }, function(result) {
                                var data = JSON.parse(result);
                                if (data.code === 0 && data.value) {
                                    layer.msg('删除成功');
                                    var page = $(".current");
                                    if (page.length < 1) {
                                        that.initStudentList(1);
                                    } else {
                                        for (var i = 0; i < page.length; i++) {
                                            if (page.eq(i).attr("class") == "current") {
                                                that.initStudentList(page.eq(i).text());
                                            }
                                        }
                                    }
                                } else {
                                    layer.msg('删除失败');
                                }
                            })
                        }
                    });
                }
            })
        }
    }

});
