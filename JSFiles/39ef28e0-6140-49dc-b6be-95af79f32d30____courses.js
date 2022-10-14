$(document).ready(function () {

    function deleteAggregatedExamToCourse(course_id, exam_id) {
        console.log('click ok');

        $.ajax({
            type: "DELETE",
            url: '/admin/courses/remove-aggregate-course/' + course_id + '/' + exam_id,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {
                //Recuperando a lista de Exams associados e atualizando a view
                getExamsAggregatedInCourse(course_id);
            }
        });
    }

    add_edit_course_questions();
});
if ($("#course").length > 0) {
    add_course_teachers();
    add_course_material();
    $("#dynamic-flash").css("transition", "opacity 3s ease-in-out");
    $("#dynamic-flash").css("-moz-transition", "opacity 3s ease-in-out");
    $("#dynamic-flash").css("-webkit-transition", "opacity 3s ease-in-out");
    $("#dynamic-flash").css("-o-transition", "opacity 3s ease-in-out");
}



function add_course_material() {
    $("#add-course-material").on('click', function () {

        $("#course-material-form").show();
    });
    remove_course_material();
    save_course_material();
}

function add_course_teachers() {

    $(".remove-course-teacher").click(function () {

        $(this).parent().parent().css("display", "none");
        $.ajax({
            type: "POST",
            url: "/admin/courses/remove-course-teacher",
            data: {
                "course": $("#course_id").val(),
                "teacher": $(this).parent().parent().find(".course-teachers-select").val()
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {
                console.log($(this).parent().parent());
                $(this).parent().parent().remove();
                flash_success("Professor excluído com sucesso!");
            }

        });
    });
    $("#calculate-percentage-teacher").click(function () {
        $.ajax({
            type: "POST",
            url: "/admin/courses/totalizeTeachers",
            data: {
                "course": $("#course_id").val()
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {

                $("#course-teachers").html(data);
                //$('#add-videos-' + lesson_id).html(data);
                //$('#add-videos-'+ selectedLesson).html(data);
                flash_success("Totalização concluida");
            }

        });
    });
    $("#save-course-teachers").click(function () {
        var teachers_map = {};
        var total_percentage = 0;
        $("[name |='course-teacher-name']").each(function (index) {
            var teacher_id = $(this).val();
            var teacher_percentage = $(this).parent().parent().find(".course-teacher-percentage").val();
            teacher_percentage = teacher_percentage.replace(',', '.');
            total_percentage += +teacher_percentage;
            teachers_map[teacher_id] = teacher_percentage;
        });
        if (total_percentage > 100) {
            flash_danger("Soma das porcentagens superior a 100%");
            return;
        }


        $.ajax({
            type: "POST",
            url: "/admin/courses/updatecourseteachers",
            data: {"teachers": teachers_map,
                "course": $("#course_id").val()

            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {

                //$('#add-videos-' + lesson_id).html(data);
                //$('#add-videos-'+ selectedLesson).html(data);
                flash_success("Professores salvos com sucesso");
            }

        });
    });
    $(".add-course-teacher").off("click").on("click", function () {
        var newFormTeachers;
        var sizeDivsTeachers;
        var newFieldTeachers;
        var i = 0;
        // newFormTeachers = $(this).closest('.form-teachers').clone(true);


        newFormTeachers = $('.form-course-teachers').last().clone(true);
        console.log(newFormTeachers);
        $('.form-course-teachers').last().after(newFormTeachers);
        sizeDivsTeachers = $('#course-teachers-fields').children.length + i;
        newFieldTeachers = $('.form-course-teachers').last();
        $('[name|="course-teacher-name"]').last().attr('name', 'course-teacher-name-' + sizeDivsTeachers);
        $('[name|="course-teacher-name"]').last().attr('id', 'course-teacher-name-' + sizeDivsTeachers);
        newFieldTeachers.attr('name', 'course-teachers-name-' + sizeDivsTeachers);
        newFieldTeachers.val('');
        $("label[for=name]").last().text('Professor ' + sizeDivsTeachers);
        i++;
    });
}

function add_module_edit() {
    $(".edit-module").click(function () {

        if (!$(this).parent().hasClass("selected")) {
            $(this).parent().click();
        }
        var target_id = $(this).data("target-id");
        var checkExist = setInterval(function () {


            if ($("#lessons").data("selected-module") == target_id) {
                $("#lessons-tab").click();
                clearInterval(checkExist);
            }
        }, 100);
    });
}

function createModuleTable() {
    $(".nav-tabs").on("click", "a", function (e) {
        e.preventDefault();
        $(this).tab('show');
    })
            .on("click", "span", function () {
                var anchor = $(this).siblings('a');
                $(anchor.attr('href')).remove();
                $(this).parent().remove();
                $(".nav-tabs li").children('a').first().click();
            });
    var post = {};
    post.name = $(this).closest('.form-input').children('.form-control').val();
    var table = $('#module-table').DataTable({
        "initComplete": function (settings, json) {
            add_module_edit();
            add_delete_module();
        },
        "processing": true,
        "columnDefs": [
            {"visible": false, "targets": [0, 2]}
        ],
        "ajax": {
            "url": "/admin/courses/" + $("#course_id").val() + "/datatables",
            "type": "POST",
            "headers": {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
        },
        "serverSide": true,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.9/i18n/Portuguese-Brasil.json'
        },
    });
    $('.add-module').click(function (e) {
        e.preventDefault();
        var post = {};
        //post.name = $(this).closest('.form-input').children('.form-control').val();
        post.name = $(this).parent().find('input').val();
        post.course_id = $("#course_id").val();
        var parent_div = $(this).parent();
        var newFormGroup = $(this).closest('.form-group').clone(true);
        $('#fields .form-group').last().after(newFormGroup);
        newField = $('#fields .form-control').last();
        newField.attr('name', 'module-name');
        newField.val('');
        newField.focus();
        $("label[for=name]").last().text('Nova disciplina');
        $.ajax({
            type: "POST",
            url: '/admin/courses/modules',
            data: {name: post.name,
                course_id: post.course_id
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {
                try {
                    var newRow = $.parseJSON(data);
                    parent_div.remove();
                    table.draw(false);
                    add_module_edit();
                    add_delete_module();
                } catch (e) {
                    if ("error" in data) {
                        flash_danger(data["error"]);
                    }
                }
            }
        });
    });

    $('.event_aggregate-saap').click(function () {
        var courseID = $('#aggregate-saap_li').attr('course-id');
        getExamsAggregatedInCourse(courseID);
    });

    $('.aggregate-saap-to-course').click(function (e) {
        e.preventDefault();
        var post = {};
        //post.name = $(this).closest('.form-input').children('.form-control').val();

        post.course_id_bought = $("#course_id").val();
        post.exam_id_extra = $("#exam_id option:selected").val();
        post.exam_title = $("#exam_id option:selected").text();
        $.ajax({
            type: "POST",
            url: '/admin/courses/aggregate-course',
            data: {
                course_id_bought: post.course_id_bought,
                exam_id_extra: post.exam_id_extra,
                exam_title: post.exam_title
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {
                try {
                    var btnExcluir = '<i class="delete-aggregation-exam-of-course fa fa-times" onClick="deleteAggregatedExamToCourse(' + post.course_id_bought + ',' + post.exam_id_extra + ')" style="color:red; cursor: pointer"></i>';
                    $('#aggregated-saap-table tr:last').after('<tr><td>' + post.exam_title + '</td><td>' + btnExcluir + '</td></tr>');
                } catch (e) {
                    if ("error" in data) {
                        flash_danger(data["error"]);
                    }
                }
            }
        });
    });
    function getExamsAggregatedInCourse(_course_id) {

        $.ajax({
            type: "GET",
            url: '/admin/courses/aggregate-course/' + _course_id,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {
                var info = JSON.parse(data);
                try {
                    for (i = 0; i < info.length; i++) {
                        var btnExcluir = '<i class="delete-aggregation-exam-of-course fa fa-times" onClick="deleteAggregatedExamToCourse(' + _course_id + ',' + info[i].id + ')" style="color:red; cursor: pointer"></i>';
                        $('#aggregated-saap-table tr:last').after('<tr><td>' + info[i].title + '</td><td>' + btnExcluir + '</td></tr>');
                    }
                } catch (e) {
                    if ("error" in data) {
                        flash_danger(data["error"]);
                    }
                }
            }
        });
    }







    $("[name|='module-name']").on('keypress', function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $(this).parent().next('.add-module').click();
        }

    });
    $("[name|='lesson-group']").children().on('keypress', function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $(this).next('.add-lesson').click();
        }

    });
    var tableLessons;
    var selectedModule;
    $('#module-table tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {


            $("#lessons-tab").not("[href='#lessons']").attr("data-toggle", "tab");
            $("#lessons-tab").not("[href='#lessons']").attr("href", "#lessons");
            $("#lessons-tab").not("[class='']").parent().attr("class", "");
            table.$('tr.selected').removeClass('selected');
            if (tableLessons != null) {
                tableLessons.destroy();
            }
            $(this).addClass('selected');
            $(".dynamic-tab").remove();
            selectedModule = table.row(this).data()[0];
            add_new_tab('edit-module', table.row(this).data()[1], "Edição ", "#edit-module");
            //TODO: colocar conteúdo aqui

            add_tab_content('/admin/courses/editmodule', {module_id: table.row(this).data()[0]}, 'edit-module', function () {
                $("#save-module").off('click').on('click', function () {
                    post_form(selectedModule, "edit-module", 'updatemodule');
                    $("#module-table").DataTable().ajax.reload(function () {
                        add_delete_module();
                    });
                    $("#module-table").on('draw.dt', function () {
                        add_delete_module();
                    });
                });
            });
            tableLessons = $('#lessons-table').DataTable({
                "processing": true,
                "columnDefs": [
                    {"visible": false, "targets": 0}
                ],
                "initComplete": function (settings, json) {
                    console.log("selected" + selectedModule);
                    add_delete_lesson();
                    $("#lessons-table").on('draw.dt', function () {
                        console.log('enter');
                        add_delete_lesson();
                        add_edit_questions();
                    });
                    add_edit_questions();
                    $('.tags-select').select2({
                        tags: true,
                        minimumInputLength: 3,
                        ajax: {
                            type: 'POST',
                            url: '/admin/tags/select',
                            dataType: 'json',
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                            },
                            data: function (params) {
                                return {
                                    term: params.term
                                };
                            },
                            processResults: function (data) {
                                return {results: data};
                            }
                        }
                    });
                },
                "ajax": {
                    "url": "/admin/courses/" + selectedModule + "/lessons",
                    "type": "POST",
                    "headers": {
                        'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                    },
                },
                "serverSide": true,
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.10.9/i18n/Portuguese-Brasil.json'
                }
            });
            update_sequence("lesson-sequence", selectedModule);
            $("#lessons").data("selected-module", selectedModule);
            $('#lessons-table tbody').dblclick(function
                    () {
                $(".nav-tabs li").children('a').last().click();
            })






        }
    });
    var selectedLesson;
    $("#lessons-table").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableLessons.$('tr.selected').removeClass('selected');
            $(".dynamic-tab").remove();
            $(this).addClass('selected');
            selectedLesson = tableLessons.row(this).data()[0];
            var nextTab = $('.nav-tabs li').size() + 1;
            var lesson_name = tableLessons.row(this).data()[1];
            if (lesson_name == null || lesson_name == '') {
                lesson_name = tableLessons.row(this).data()[2];
            }


            add_new_tab('edit-lesson', lesson_name, "Edição ", "#edit-lesson");
            add_tab_content('/admin/courses/editlessons', {lesson_id: tableLessons.row(this).data()[0]}, 'edit-lesson', function () {
                $("#save-lesson").off('click').on('click', function () {
                    post_form(selectedLesson, "edit-lesson", 'updatelesson');
                    $("#lessons-table").DataTable().ajax.reload(function () {
                        add_delete_lesson();
                        add_edit_questions();
                    });
                    $("#lessons-table").on('draw.dt', function () {
                        add_delete_lesson();
                        add_edit_questions();
                    });
                });
            });
            nextTab++;
            add_new_tab('video', lesson_name, 'Vídeos', "#add-videos");
            add_tab_content('/admin/courses/editvideos', {lesson_id: tableLessons.row(this).data()[0]}, 'add-videos', function () {

                save_videos(selectedLesson, $("#save-videos"));
                $(".content-preview").click(function () {
                    $("#vimeoPreviewModal").modal('toggle');
                    var content = $(this).parent().parent().find(".content-url").val();
                    if (content.startsWith('vimeo:')) {
                        content = 'https://player.vimeo.com/video/' + content.substring(6);
                    }

                    $("#vimeo-preview").attr('src', content);
                });
            });
            nextTab++;
            add_teachers(selectedLesson, lesson_name);
            nextTab++;
            add_material(selectedLesson, lesson_name);
        }
    });
    $('.add-lesson').click(function (e) {
        e.preventDefault();
        var module_id = selectedModule;
        var name_input = $(this).parent().parent().find("[name|='lesson-name']").val();
        var sequence_input = $(this).parent().parent().find("[name|='lesson-sequence']").val();
        var duration_input = $(this).parent().parent().find("[name|='lesson-name']").val();
        var parent_div = $(this).parent().parent();
        $.ajax({
            type: "POST",
            url: '/admin/courses/addlessons',
            data: {module_id: module_id,
                title: name_input,
                sequence: sequence_input,
                duration: duration_input
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {


                var new_div = parent_div.clone(true);
                clear_form_elements(new_div);
                var last_div = $(".lesson-fields").last();
                console.log("[name='" + new_div.attr('name') + "']");
                console.log(last_div.find("[name='lesson-sequence']").val());
                console.log(last_div);
                new_div.find("lesson-box [name|='lesson-sequence']").val(last_div.find("[name='lesson-sequence']").val());
                last_div.after(new_div);
                parent_div.remove();
                var newRow = $.parseJSON(data);
                tableLessons.draw(false);
            }
        });
    });
    $("#unblock-course").on('click', function () {
        verify_unblock();
    });
    // create_new_field_dynamic($("[name|='module-name']"),'module','Atividade',2);
}



function add_new_tab(id, name, type, link) {
    var tab_id = '#' + id + "-tab";
    if ($(tab_id).length <= 0)
        $('<li><a id="' + tab_id + '" href="' + link + '" class="dynamic-tab" data-toggle="tab">' + type + ' de ' + name + '</a></li>').appendTo('.nav-tabs');
    else {
        $(tab_id).attr("href", link);
        $(tab_id).text(type + 'de ' + name);
    }

}

function add_tab_content(url, parameter_data, id, callback) {
    var content_id = "#" + id;
    console.log('content_id:' + content_id);
    $.ajax({
        type: "POST",
        url: url,
        data: parameter_data,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        },
        cache: false,
        success: function (data) {

            if ($(content_id).length <= 0) {

                var $appended = $('<div class="tab-pane" id="' + id + '">' + data + '</div>').appendTo('.tab-content');
                remove_changed_attribute($appended.attr('id'));
                change_watcher($appended.attr('id'));
            } else {
                $(content_id).html(data);
                remove_changed_attribute(content_id);
                change_watcher(content_id);
            }

            callback();
        }
    });
}


function add_delete_lesson() {
    $(".delete-lesson").off('click').click(function () {

        if (confirm("Tem certeza que deseja excluir esse item?")) {
            $.ajax({
                "type": "POST",
                url: '/admin/courses/remove-lesson',
                data: {lesson: $(this).data("target-id")
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                },
                cache: false,
                success: function (data) {
                    $("#lessons-table").DataTable().ajax.reload(function () {

                        add_delete_lesson();
                        add_edit_questions();
                    });
                    $("#lessons-table").on('draw.dt', function () {
                        add_delete_lesson();
                        add_edit_questions();
                    });
                    if (data == 'true') {
                        flash_success('Aula excluída com sucesso!')
                    } else if (data == 'full') {
                        flash_danger("Há alunos cursando essa aula.")
                    } else {
                        flash_danger("Não foi possível excluir a aula");
                    }
                }
            });
            // $("#module-table").

        }
    });
}




function add_course_edit_questions() {
    $(".create-course-questions").click(function () {
        $("courseGroupSubjectModal").find("*").addBack().off();
        $.ajax({
            url: "/admin/courses/create-group",
            type: "POST",
            data: {
                'course': $(this).data('')
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {

            }
        });
    });
}




function add_edit_questions() {
    $(".create-questions").click(function () {

        $("#groupSubjectModal").find("*").addBack().off();
        $.ajax({
            url: "/admin/courses/create-group",
            type: "POST",
            data: {
                'lesson': $(this).data("target-id")
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {

                $("#groupSubjectModal").html(data);
                $("#groupSubjectModal").modal('toggle');
                $("#groupSubjectModal").on('shown.bs.modal', function () {

                    createSelect("subject", undefined, $("#groupSubjectModal"));
                    add_save_relation_event();
                    $("#add-subject").off('click').click(function () {
                        $(".subject-select").select2("destroy").end();
                        $(".subject-question-row").last().after($(".subject-question-row").first().clone());
                        $(".subject-select").last().val("");
                        createSelect("subject", undefined, $("#groupSubjectModal"));
                        $(".delete-relation").find("*").addBack().off();
                        $(".delete-relation").click(function () {
                            $(this).parent().parent().remove();
                        });
                    });
                    $(".delete-relation").click(function () {
                        $(this).parent().parent().remove();
                    });
                });
            }
        });
    });
}



function add_save_relation_event() {
    $("#save-relation").click(function () {

        $.ajax({
            url: "/admin/courses/save-lesson-group",
            type: "POST",
            data: {
                fields: $("#group-form").serialize(),
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {
                $("#groupSubjectLabel").css('display', 'none');
                $("#savedGroupLabel").css('display', 'block');
                setTimeout(function () {
                    $("#groupSubjectLabel").css('display', 'block');
                    $("#savedGroupLabel").css('display', 'none');
                }, 3000);
            }
        });
    });
}



function add_edit_course_questions() {
    createSelect("subject-course", undefined);
    add_save_course_relation_event();
    $("#add-course-subject").off('click').click(function () {
        $(".subject-course-select").select2("destroy").end();
        $(".subject-course-question-row").last().after($(".subject-course-question-row").first().clone());
        $(".subject-course-select").last().val("");
        $("[name='question_count[]']").last().val(0);
        createSelect("subject-course", undefined);
        $(".delete-course-relation").find("*").addBack().off();
        $(".delete-course-relation").click(function () {
            $(this).parent().parent().remove();
        });
    });
    $(".delete-course-relation").click(function () {
        $(this).parent().parent().remove();
    });
    $(".create-course-questions").click(function () {

        $("#courseQuestionModal").find("*").addBack().off();
    });
}



function add_save_course_relation_event() {
    $("#save-course-relation").click(function () {
        if ($("#course-group-duration").val() == "") {
            flash_danger("É obrigatório informar a duração da avaliação!")
        } else if (isNaN($("#course-group-duration").val())) {
            flash_danger("Duração inválida! Informe um número válido no campo");
        } else {

            $(this).text('Salvando...');
            if ($("#group-course-form").data("saved") == false) {
                console.log($("#save-course-relation").data("target-id"));
                $.ajax({
                    url: "/admin/courses/create-course-group",
                    type: "POST",
                    data: {
                        'course': $("#save-course-relation").data("target")
                    },
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                    },
                    cache: false,
                    success: function (data) {

                        $.ajax({
                            url: "/admin/courses/save-course-group",
                            type: "POST",
                            data: {
                                fields: $("#group-course-form").serialize(),
                                'course-group-id': data,
                            },
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                            },
                            cache: false,
                            success: function (data) {
                                $("#groupCourseSubjectLabel").css('display', 'none');
                                $("#savedGroupCourseLabel").css('display', 'block');
                                setTimeout(function () {
                                    $("#groupCourseSubjectLabel").css('display', 'block');
                                    $("#savedGroupCourseLabel").css('display', 'none');
                                    flash_success('Grupo foi criado com sucesso!');
                                    $("#save-course-relation").text('Salvar');
                                }, 3000);
                            }
                        });
                    }
                });
            } else {
                $.ajax({
                    url: "/admin/courses/save-course-group",
                    type: "POST",
                    data: {
                        fields: $("#group-course-form").serialize(),
                    },
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                    },
                    cache: false,
                    success: function (data) {
                        $("#groupCourseSubjectLabel").css('display', 'none');
                        $("#savedGroupCourseLabel").css('display', 'block');
                        setTimeout(function () {
                            $("#groupCourseSubjectLabel").css('display', 'block');
                            $("#savedGroupCourseLabel").css('display', 'none');
                            flash_success('Grupo foi atualizado com sucesso!');
                            $("#save-course-relation").text('Salvar');
                        }, 3000);
                    }
                });
            }


        }
    });
}




function remove_material() {
    $(".remove-material").on('click', function () {
        var removed_item = $(this);
        $.ajax({
            type: "POST",
            url: '/admin/courses/remove-material',
            data: {content: $(this).data('content')
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {

                $(removed_item).parent().remove();
            }

        });
    });
}



function add_material(selectedLesson, lesson_name) {


    add_new_tab('material', lesson_name, "Materiais ", "#add-material");
    add_tab_content('/admin/courses/material', {lesson_id: selectedLesson}, 'add-material', function () {

        $("#add-material").on('click', function () {

            $("#material-form").show();
        });
        remove_material();
        save_material();
    });
}



function save_material() {


    console.log('enter the submit');
    $("#material-form").submit(function (event) {
        event.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: '/admin/courses/savematerial',
            type: 'POST',
            data: formData,
            success: function (data) {
                alert(data)
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            processData: false,
            contentType: false,
            success: function (result) {

                var li;
                if (result["extension"] == '.pdf') {
                    li = '<li class="fa fa-file-pdf-o">';
                } else if (result["extension"] == '.pps') {
                    li = '<li class="fa fa-file-powerpoint-o" >';
                } else if (result["extension"] == '.doc' || result["extension"] == '.docx') {
                    li = '<li class="fa fa-file-word-o" >';
                } else if (result["extension"] == '.png' || result["extension"] == '.jpg' || result["extension"] == 'jpeg') {
                    li = '<li class= "fa fa-file-image-o" >';
                } else {
                    li = '<li class="fa fa-file" >';
                }
                li = li + '<a name="material-file"  data-id="' + result['id'] + '" data-url="' + result['url'] + '" href="/' + result['url'] + '">' + result['choosen'] + '</a> <a type="button" class="fa fa-times remove-material" data-content="' + result['id'] + '" style="color:red"></a></li>';
                $("#content-files").append(li + "<br/>");
                $("#material-name").val("");
                remove_material();
            }
        });
        return false;
    });
}

function save_course_material() {
    $("#course-material-form").submit(function (event) {
        event.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: '/admin/courses/savecoursematerial',
            type: 'POST',
            data: formData,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            processData: false,
            contentType: false,
            success: function (result) {

                var li;
                if (result["extension"] == '.pdf') {
                    li = '<li class="fa fa-file-pdf-o">';
                } else if (result["extension"] == '.pps') {
                    li = '<li class="fa fa-file-powerpoint-o" >';
                } else if (result["extension"] == '.doc' || result["extension"] == '.docx') {
                    li = '<li class="fa fa-file-word-o" >';
                } else if (result["extension"] == '.png' || result["extension"] == '.jpg' || result["extension"] == 'jpeg') {
                    li = '<li class= "fa fa-file-image-o" >';
                } else {
                    li = '<li class="fa fa-file" >';
                }
                li = li + '<a name="course-material-file"  data-id="' + result['id'] + '" data-url="' + result['url'] + '" href="/' + result['url'] + '">' + result['choosen'] + '</a> <a type="button" class="fa fa-times remove-material" data-content="' + result['id'] + '" style="color:red"></a></li>';
                $("#course-content-files").append(li + "<br/>");
                $("#course-material-name").val("");
                remove_course_material();
            }
        });
        return false;
    });
}

function remove_course_material() {
    $(".remove-course-material").on('click', function () {
        var removed_item = $(this);
        $.ajax({
            type: "POST",
            url: '/admin/courses/remove-course-material',
            data: {'course-content': $(this).data('content')
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {

                $(removed_item).parent().remove();
            }

        });
    });
}

function add_teachers(selectedLesson, lesson_name) {


    add_new_tab('teacher-percentage', lesson_name, "Professores ", "#add-teachers");
    add_tab_content('/admin/courses/editteachers', {lesson_id: selectedLesson}, 'add-teachers', function () {

        save_teachers(selectedLesson, $("#save-teachers"), $("[name|=teacher-name]"));
        $('.teachers-select').select2({
            width: 'resolve',
            minimumInputLength: 3,
            ajax: {
                type: 'POST',
                url: '/admin/teachers/select',
                dataType: 'json',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                },
                data: function (params) {
                    return {
                        term: params.term
                    };
                },
                processResults: function (data) {
                    return {results: data};
                }
            }
        });
        $(".equal-divide").click(function () {
            equal_percentage(sizeDivsTeachers, $("[name|='teacher-percentage']"));
        });
        $(".remove-lesson-teacher").click(function () {

            $(this).parent().parent().css("display", "none");
            $.ajax({
                type: "POST",
                url: "/admin/courses/remove-lesson-teacher",
                data: {
                    "lesson": selectedLesson,
                    "teacher": $(this).parent().parent().find(".teachers-select").val()
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                },
                cache: false,
                success: function (data) {
                    console.log($(this).parent().parent());
                    $(this).parent().parent().remove();
                    flash_success("Professor excluído com sucesso!");
                }

            });
        });
        var newFormTeachers;
        var sizeDivsTeachers;
        var newFieldTeachers;
        var i = 0;
        $(".add-teacher").off("click").on("click", function () {

            // newFormTeachers = $(this).closest('.form-teachers').clone(true);

            $('.teachers-select').last().select2("destroy");
            newFormTeachers = $('.form-teachers').last().clone(true);
            $('.teachers-select').last().select2({
                width: 'resolve',
                minimumInputLength: 3,
                ajax: {
                    type: 'POST',
                    url: '/admin/teachers/select',
                    dataType: 'json',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                    },
                    data: function (params) {
                        return {
                            term: params.term
                        };
                    },
                    processResults: function (data) {

                        return {results: data};
                    }
                }
            });
            $('.form-teachers').last().after(newFormTeachers);
            sizeDivsTeachers = $('#teachers-fields').children.length + i;
            newFieldTeachers = $('.form-teachers').last();
            $('[name|="teacher-name"]').last().attr('name', 'teacher-name-' + sizeDivsTeachers);
            $('[name|="teacher-name"]').last().attr('id', 'teacher-name-' + sizeDivsTeachers);
            newFieldTeachers.attr('name', 'teachers-name-' + sizeDivsTeachers);
            newFieldTeachers.val('');
            $("label[for=name]").last().text('Professor ' + sizeDivsTeachers);
            i++;
            $('.teachers-select').last().select2({
                width: 'resolve',
                minimumInputLength: 3,
                ajax: {
                    type: 'POST',
                    url: '/admin/teachers/select',
                    dataType: 'json',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                    },
                    data: function (params) {
                        return {
                            term: params.term
                        };
                    },
                    processResults: function (data) {
                        return {results: data};
                    }
                }
            });
        });
    });
}



function create_new_field_dynamic(field, portuguese_name, english_name, initial) {
    var newFormGroup;
    var sizeDivs;
    var newField;
    var i = initial;
    field.one('change', function () {

        newFormGroup = $(this).closest('.form-group').clone(true);
        i = i + 1;
        $('#fields .form-group').last().after(newFormGroup);
        sizeDivs = $('#fields').children.length + i;
        newField = $('#fields .form-control').last();
        newField.attr('name', english_name + '-name-' + sizeDivs);
        newField.val('');
        $("label[for=name]").last().text(portuguese_name + ' ' + sizeDivs);
        create_new_field_dynamic(newField, 'module', 'Atividade', 2);
    });
}


function create_new_tab(title, tab_id, table, route, type) {

    $('<li><a href="#' + tab_id + '-' + id + '" class="dynamic-tab" data-toggle="tab">' + title + ' ' + name + '</a></li>').appendTo('.nav-tabs');
}



function create_new_tab_from_view(title, tab_id, table, route) {
    var id = table.row(this).data()[0];
    var name = table.row(this).data()[1];
    $('<li><a href="#' + tab_id + '-' + id + '" class="dynamic-tab" data-toggle="tab">' + title + ' ' + name + '</a></li>').appendTo('.nav-tabs');
    $.ajax({
        type: "POST",
        url: '/admin/courses/' + route,
        data: {id: id
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        },
        cache: false,
        success: function (data) {
            $('<div class="tab-pane" id=' + tab_id + '-' + id + '">' + data + '</div>').appendTo('.tab-content');
        }
    });
}

function create_new_table_tab(title, new_table_id, table, route) {
    var id = table.row(this).data()[0];
    var new_data_table;
    new_data_table = $('#' + new_table_id).DataTable({
        "processing": true,
        "columnDefs": [
            {"visible": false, "targets": 0}
        ],
        "ajax": {
            "url": "/admin/courses/" + id + "/" + route,
            "type": "POST",
            "headers": {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
        },
        "serverSide": true,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.9/i18n/Portuguese-Brasil.json'
        }
    });
    return new_data_table;
}

function update_sequence(input_name, module_id) {


    with_max_table_sequence(module_id, function (max) {
        $("[name|='" + input_name + "'").each(function (index) {

            $(this).val(+max + (+index + 1));
        });
    });
}

function save_teachers(lesson_id, button, teachers) {

    button.on('click', function () {

        var teachers_map = {};
        var total_percentage = 0;
        $("[name|='teacher-name']").each(function (index) {
            var teacher_id = $(this).val();
            var teacher_percentage = $(this).parent().parent().find("[name|='teacher-percentage']").val();
            console.log($(this).parent().parent());
            total_percentage += +teacher_percentage;
            teachers_map[teacher_id] = teacher_percentage;
        });
        console.log($(this).parent().parent());
        console.log(total_percentage);
        if (total_percentage > 100) {
            flash_danger("Soma das porcentagens superior a 100%");
            return;
        }


        $.ajax({
            type: "POST",
            url: "/admin/courses/updateteachers",
            data: {"teachers": teachers_map,
                "lesson_id": lesson_id

            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {


                //$('#add-videos-' + lesson_id).html(data);
                //$('#add-videos-'+ selectedLesson).html(data);
                flash_success("Professores salvos com sucesso");
            }

        });
    });
}


function save_videos(lesson_id, button) {



    button.off('click').on('click', function () {


        console.log(lesson_id);
        console.log($("[name='video[]']"));
        var url_map = {};
        $("[name='video[]']").each(function (index) {
            var sequence = $(this).data("sequence");
            url_map[Number(sequence)] = $(this).val();
        });
        console.log(url_map);
        $.ajax({
            type: "POST",
            url: "/admin/courses/updatevideos",
            data: {video: url_map,
                lesson_id: lesson_id
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {


                $("#lessons-table").DataTable().ajax.reload(function () {

                    add_delete_lesson();
                    add_edit_questions();
                });
                $("#lessons-table").on('draw.dt', function () {
                    add_delete_lesson();
                    add_edit_questions();
                });
                //$('#add-videos-' + lesson_id).html(data);
                //$('#add-videos-'+ selectedLesson).html(data);
                flash_success("Vídeos salvos com sucesso");
                remove_changed_attribute("add-videos-");
            }

        });
    });
}


function save_module(module_id, button) {

    button.off('click').on('click', function () {


        $.ajax({
            type: "POST",
            url: '/admin/courses/updatemodule',
            data: {module_id: module_id,
                module: $("[id='edit-module']").serialize(),
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            },
            cache: false,
            success: function (data) {
                if ("error" in data) {
                    flash_danger(data["error"]);
                } else {
                    flash_success(data["success"]);
                }
            },
            error: function (xhr) {
                if (xhr.status == 404) {
                    flash_danger("Erro na comunicação com o servidor. Entre em contato com um administrador do sistema");
                } else {
                    flash_danger("O sistema encontrou um erro de código " + xhr.status + ". Entre em contato com o suporte técnico informando o código de erro");
                }
            }

        });
    });
}

function save_lesson(lesson_id) {

}





function post_form(id, form_id, route, method_with_data) {
    $.ajax({
        type: "POST",
        url: '/admin/courses/' + route,
        data: {
            id: id,
            form: $("[id='" + form_id + "']").serialize(),
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        },
        cache: false,
        success: function (data) {
            if ("error" in data) {
                flash_danger(data["error"]);
            } else {
                flash_success(data["success"]);
            }
            if (method_with_data !== undefined) {
                method_with_data(data);
            }

        }
    });
}














function change_watcher(begin_with_id, event) {



    $("[id^='" + begin_with_id + "'] .form-control").not("[data-changed='true']").off('input').on("input", function () {
        $(this).attr("data-changed", "true");
        //var actualTab =   $("[href='#" +  $("[id^='"+ begin_with_id +"']").attr('id') + "'  ]") ;
        var actualTab = $("[href='#" + begin_with_id + "'");
        if (actualTab.text().indexOf(" {modificado} ") == -1) {

            actualTab.text(actualTab.text() + " {modificado} ");
            if (event != undefined)
                event();
        }
    });
}



function remove_changed_attribute(begin_with_id) {
    $("[id^='" + begin_with_id + "'] .form-control [data-changed='true']").removeAttr("data-change");
    //var actualTab =   $("[href='#" +  $("[id^='"+ begin_with_id +"']").attr('id') + "'  ]") ;

    var actualTab = $("[href='#" + begin_with_id + "'");
    if (actualTab.text().indexOf(" {modificado} ") != -1) {

        actualTab.text(actualTab.text().replace(" {modificado} ", ""));
    }

}

function is_changed(begin_with_id) {
    var actualTab = $("[href='#" + begin_with_id + "'");
    if (actualTab.text().indexOf(" {modificado} ") != -1) {
        return false;
    }
    return true;
}



function change_context_watcher(begin_with_id) {

}


function equal_percentage(number, teacher_percentage) {
    var percentage = 100 / number;
    percentage = percentage.toFixed(2);
    teacher_percentage.val(percentage);
}



function with_max_table_sequence(module_id, with_function) {
    $.ajax({
        "type": "POST",
        url: '/admin/courses/maxsequence',
        data: {id: module_id
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        },
        cache: false,
        success: function (data) {
            with_function(data);
        }
    });
}

function add_delete_module() {

    $(".delete-module").click(function () {

        if (confirm("Tem certeza que deseja excluir esse item?")) {
            $.ajax({
                "type": "POST",
                url: '/admin/courses/remove-module',
                data: {module: $(this).data("target-id")
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                },
                cache: false,
                success: function (data) {
                    $("#module-table").DataTable().ajax.reload(function () {
                        add_module_edit();
                        add_delete_module();
                    });
                    if (data == 'true') {
                        flash_success('Disciplina excluída com sucesso!')
                    } else if (data == 'full') {
                        flash_danger("Há aulas associadas a essa disciplina.")
                    } else {
                        flash_danger("Não foi possível excluir a disciplina");
                    }
                }
            });
            // $("#module-table").

        }
    });
    /*
     $('[data-method]').append(function()
     {
     return "\n"+
     "<form action='"+$(this).attr('href')+"' method='POST' name='delete_item' style='display:none'>\n"+
     "   <input type='hidden' name='_method' value='"+$(this).attr('data-method')+"'>\n"+
     "   <input type='hidden' name='_token' value='"+$('meta[name="_token"]').attr('content')+"'>\n"+
     "</form>\n"
     })
     .removeAttr('href')
     .attr('style','cursor:pointer;')
     .attr('onclick','$(this).find("form").submit();');
     */
    /*
     Generic are you sure dialog
     */
    /*
     $('form[name=delete_item]').submit(function(){
     return confirm("Tem certeza que deseja excluir esse item?");
     });
     */
}

function verify_unblock() {

    var course_id = $("#course_id").val();
    $.ajax({
        type: "POST",
        url: "/admin/courses/unblock",
        data: {'course': course_id
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        },
        cache: false,
        success: function (data) {

            if ("error" in data) {
                flash_danger(data["error"]);
                $('html,body').animate({
                    scrollTop: 0
                }, 700);
            } else {
                flash_success(data["success"]);
                $('.nav-tabs-custom').find('input, textarea, button, select').attr('disabled', 'disabled');
                $('html,body').animate({
                    scrollTop: 0
                }, 700);
            }
        }

    });
}

function clear_form_elements(selector) {
    selector.find(':input').each(function () {
        switch (this.type) {
            case 'password':
            case 'text':
            case 'textarea':
            case 'file':
            case 'select-one':
            case 'select-multiple':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });
}




function flash_message(type, message) {

    $("#dynamic-flash").css("opacity", "1");
    $("#dynamic-flash").removeClass();
    $("#dynamic-flash").addClass("alert");
    $("#dynamic-flash").addClass(type);
    $("#dynamic-flash").html(message);
    setTimeout(function () {
        $("#dynamic-flash").css("opacity", "0");
    }, 5000);
}

function flash_success(message) {
    flash_message("alert-success", message);
}

function flash_warning(message) {
    flash_message("alert-warning", message);
}
function flash_danger(message) {
    flash_message("alert-danger", message);
}

function disable_tab(tab_selector) {

    console.log(tab_selector);
    tab_selector.attr("data-toggle", "");
    tab_selector.attr("href", "#lessons");
    console.log(tab_selector.parent());
    tab_selector.parent().attr("class", "disabled");
}

function enable_tab(tab_selector, target) {
    tab_selector.attr("data-toggle", "tab");
    tab_selector.attr("href", target);
    tab_selector.parent().attr("class", "");
}


function disable_lesson_related_tabs() {
    disable_tab($("#video-tab"));
    disable_tab($("#teacher-percentage-tab"));
    disable_tab($("#edit-lesson-tab"));
    disable_tab($("#material-tab"));
}

function enable_lesson_related_tabs(selectedLesson) {
    enable_tab($("#video-tab"), "#add-videos-" + selectedLesson);
    enable_tab($("#teacher-percentage-tab"), "#add-teachers-" + selectedLesson);
    enable_tab($("#edit-lesson-tab"), "#edit-lesson-" + selectedLesson);
    enable_tab($("#material-tab"), "#add-material-" + selectedLesson);
}

